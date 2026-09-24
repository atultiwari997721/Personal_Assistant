import dns from 'dns';
import axios from 'axios';
import { ChatOpenAI } from '@langchain/openai';
import { SystemMessage, HumanMessage, AIMessage } from '@langchain/core/messages';
import dotenv from 'dotenv';
dotenv.config();

// Force IPv4 on Windows to prevent IPv6 connection timeouts
try {
  dns.setDefaultResultOrder('ipv4first');
} catch (e) {}

export const getActiveProvider = () => {
  if (process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.includes('your_openai') && process.env.OPENAI_API_KEY.length > 5) {
    return {
      type: 'openai',
      apiKey: process.env.OPENAI_API_KEY,
      model: process.env.LLM_MODEL || 'gpt-4o-mini',
      baseURL: process.env.OPENAI_BASE_URL,
    };
  }

  if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.length > 5) {
    return {
      type: 'groq',
      apiKey: process.env.GROQ_API_KEY,
      model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
      baseURL: 'https://api.groq.com/openai/v1',
    };
  }

  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.length > 5) {
    return {
      type: 'gemini',
      apiKey: process.env.GEMINI_API_KEY,
      model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
      baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
    };
  }

  if (process.env.OPENROUTER_API_KEY && process.env.OPENROUTER_API_KEY.length > 5) {
    return {
      type: 'openrouter',
      apiKey: process.env.OPENROUTER_API_KEY,
      model: process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.2-3b-instruct:free',
      baseURL: 'https://openrouter.ai/api/v1',
    };
  }

  if (process.env.OLLAMA_URL) {
    return {
      type: 'ollama',
      apiKey: 'ollama',
      model: process.env.OLLAMA_MODEL || 'llama3',
      baseURL: process.env.OLLAMA_URL.endsWith('/v1') ? process.env.OLLAMA_URL : `${process.env.OLLAMA_URL}/v1`,
    };
  }

  return null;
};

export const hasValidLLMKey = () => {
  return getActiveProvider() !== null;
};

export const getLangChainLLM = (temperature = 0.7) => {
  const provider = getActiveProvider();
  if (!provider) return null;

  return new ChatOpenAI({
    openAIApiKey: provider.apiKey,
    modelName: provider.model,
    temperature,
    configuration: provider.baseURL ? { baseURL: provider.baseURL } : undefined,
  });
};

/**
 * Universal dynamic LLM invocation:
 * 1. Checks user's configured API Key via LangChain (OpenAI, Groq, Gemini, OpenRouter, Ollama).
 * 2. If no key, seamlessly attempts live inference via fast online models.
 */
export const invokeLLM = async ({
  systemPrompt,
  userPrompt,
  messages = [],
  temperature = 0.7,
  jsonMode = false,
  model = 'auto',
}) => {
  // If user explicitly chose local Cognitive Brain, skip cloud inference directly
  if (model === 'cortex-cognitive') {
    throw new Error('LOCAL_COGNITIVE_REQUESTED');
  }

  // Model-specific prompt engineering
  let activeSystemPrompt = systemPrompt || '';
  if (model === 'deepseek-r1') {
    activeSystemPrompt = `You are DeepSeek-R1, an ultra-advanced reasoning AI. Reason thoroughly and methodically. Include your detailed internal chain-of-thought enclosed in <think>...</think> tags before presenting your structured conclusion.\n\n${activeSystemPrompt}`;
  } else if (model === 'qwen-coder') {
    activeSystemPrompt = `You are Qwen 2.5 Coder, a world-class principal software architect and competitive programmer. Provide immaculate, high-performance, runnable code with asymptotic complexity analysis and unit test cases.\n\n${activeSystemPrompt}`;
  } else if (model === 'llama-3') {
    activeSystemPrompt = `You are Llama 3.3 70B, an authoritative open-weights frontier intelligence. Provide deep factual, analytical, and structured synthesis.\n\n${activeSystemPrompt}`;
  }

  // Option 1: Configured API Key via LangChain
  if (hasValidLLMKey()) {
    try {
      const llm = getLangChainLLM(temperature);
      const formatted = [];
      if (activeSystemPrompt) formatted.push(new SystemMessage(activeSystemPrompt));
      (messages || []).forEach((m) => {
        if (m.sender === 'user' || m.role === 'user') {
          formatted.push(new HumanMessage(m.content || m.text));
        } else if (m.sender === 'assistant' || m.role === 'assistant') {
          formatted.push(new AIMessage(m.content || m.text));
        }
      });
      formatted.push(new HumanMessage(userPrompt));

      const response = await llm.invoke(formatted);
      return typeof response.content === 'string' ? response.content : JSON.stringify(response.content);
    } catch (langchainErr) {
      console.warn('[LLM] LangChain API failed, attempting fast cloud inference:', langchainErr.message);
    }
  }

  // Option 2: Live fast inference
  const formattedMessages = [];
  if (activeSystemPrompt) formattedMessages.push({ role: 'system', content: activeSystemPrompt });
  (messages || []).slice(-4).forEach((m) => {
    const role = m.sender === 'user' || m.role === 'user' ? 'user' : 'assistant';
    formattedMessages.push({ role, content: m.content || m.text || '' });
  });
  formattedMessages.push({ role: 'user', content: userPrompt });

  try {
    const response = await axios.post(
      'https://text.pollinations.ai/',
      {
        messages: formattedMessages,
        model: 'openai-fast',
        jsonMode: jsonMode || false,
        seed: Math.floor(Math.random() * 1000000),
      },
      {
        timeout: 10000,
        headers: { 'Content-Type': 'application/json' },
      }
    );

    let output = response.data;
    if (typeof output !== 'string') {
      output = JSON.stringify(output);
    }
    if (output && output.trim().length > 0 && !output.includes('Internal Server Error')) {
      return output.trim();
    }
  } catch (modelErr) {
    // Expected when anonymous endpoint is saturated; agents will engage their intelligent dynamic synthesis
  }

  throw new Error('LLM_PROVIDER_OFFLINE');
};
