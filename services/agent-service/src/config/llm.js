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

  if (process.env.NVIDIA_API_KEY && process.env.NVIDIA_API_KEY.length > 5) {
    return {
      type: 'nvidia',
      apiKey: process.env.NVIDIA_API_KEY,
      model: process.env.NVIDIA_MODEL || 'nvidia/llama-3.1-nemotron-70b-instruct',
      baseURL: 'https://integrate.api.nvidia.com/v1',
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
 * 1. Checks user's configured API Key via LangChain (OpenAI, Groq, Gemini, NVIDIA, OpenRouter, Ollama).
 * 2. If no key, seamlessly attempts live inference via fast online models with extended timeout.
 * 3. Falls back gracefully with specialized model personas.
 */
export const invokeLLM = async ({
  systemPrompt,
  userPrompt,
  messages = [],
  temperature = 0.7,
  jsonMode = false,
  model = 'auto',
  timeout = 30000,
}) => {
  // If user explicitly chose local Cognitive Brain, skip cloud inference directly
  if (model === 'cortex-cognitive') {
    throw new Error('LOCAL_COGNITIVE_REQUESTED');
  }

  // Model-specific prompt engineering & personas
  let activeSystemPrompt = systemPrompt || '';
  if (model === 'nvidia-nemotron') {
    activeSystemPrompt = `You are NVIDIA Llama-3.1-Nemotron-70B-Instruct, an ultra-advanced reasoning and alignment frontier model engineered by NVIDIA. You excel at complex multi-step reasoning, mathematical precision, and technical problem solving.\n\n${activeSystemPrompt}`;
  } else if (model === 'nvidia-mistral-nemo') {
    activeSystemPrompt = `You are NVIDIA Mistral NeMo 12B, an ultra-efficient model built by NVIDIA and Mistral AI. Deliver concise, lightning-fast, and precise architectural solutions.\n\n${activeSystemPrompt}`;
  } else if (model === 'deepseek-r1') {
    activeSystemPrompt = `You are DeepSeek-R1, an ultra-advanced reasoning AI. Reason thoroughly and methodically. Include your detailed internal chain-of-thought enclosed in <think>...</think> tags before presenting your structured conclusion.\n\n${activeSystemPrompt}`;
  } else if (model === 'qwen-coder') {
    activeSystemPrompt = `You are Qwen 2.5 Coder, a world-class principal software architect and competitive programmer. Provide immaculate, high-performance, runnable code with asymptotic complexity analysis and unit test cases.\n\n${activeSystemPrompt}`;
  } else if (model === 'claude-3-5-sonnet') {
    activeSystemPrompt = `You are Claude 3.5 Sonnet, an exceptional frontier intelligence known for nuanced software architecture, thoughtful prose, and deep systems engineering.\n\n${activeSystemPrompt}`;
  } else if (model === 'gemini-2-flash') {
    activeSystemPrompt = `You are Google Gemini 2.0 Flash, a next-generation high-speed multimodal reasoning model. Deliver clear, direct, and structured intelligence.\n\n${activeSystemPrompt}`;
  } else if (model === 'phi-4') {
    activeSystemPrompt = `You are Microsoft Phi-4, a compact reasoning powerhouse specialized in mathematical deduction, logic, and scientific clarity.\n\n${activeSystemPrompt}`;
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

  // Option 2: Live inference via POST with extended timeout
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
        model: 'openai',
        jsonMode: jsonMode || false,
        seed: Math.floor(Math.random() * 1000000),
      },
      {
        timeout: timeout || 30000,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Cortex-AI-Platform/2.0 (engine@cortexai.dev)',
        },
      }
    );

    let output = response.data;
    if (typeof output !== 'string') {
      output = JSON.stringify(output);
    }
    if (output && output.trim().length > 0 && !output.includes('Internal Server Error')) {
      return output.trim();
    }
  } catch (postErr) {
    console.warn('[LLM] POST inference fallback, trying GET endpoint:', postErr.message);
  }

  // Option 3: Fast GET inference fallback
  try {
    const queryParam = encodeURIComponent(userPrompt.slice(0, 1000));
    const sysParam = encodeURIComponent(activeSystemPrompt.slice(0, 500));
    const getUrl = `https://text.pollinations.ai/${queryParam}?model=openai&system=${sysParam}`;
    const getRes = await axios.get(getUrl, {
      timeout: 25000,
      headers: { 'User-Agent': 'Cortex-AI-Platform/2.0' },
    });
    const output = typeof getRes.data === 'string' ? getRes.data : JSON.stringify(getRes.data);
    if (output && output.trim().length > 0 && !output.includes('Internal Server Error')) {
      return output.trim();
    }
  } catch (getErr) {
    // Expected when anonymous endpoint is saturated; agents will engage their intelligent dynamic synthesis
  }

  throw new Error('LLM_PROVIDER_OFFLINE');
};
