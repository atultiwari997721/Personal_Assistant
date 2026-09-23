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

const apiKey = process.env.OPENAI_API_KEY;
const baseURL = process.env.OPENAI_BASE_URL;

export const hasValidLLMKey = () => {
  return apiKey && !apiKey.includes('your_openai') && apiKey.length > 5;
};

export const getLangChainLLM = (temperature = 0.7) => {
  if (hasValidLLMKey()) {
    return new ChatOpenAI({
      openAIApiKey: apiKey,
      modelName: process.env.LLM_MODEL || 'gpt-4o-mini',
      temperature,
      configuration: baseURL ? { baseURL } : undefined,
    });
  }
  return null;
};

/**
 * Universal dynamic LLM invocation:
 * 1. Checks user's configured API Key via LangChain (OpenAI / Groq / Ollama / Gemini).
 * 2. If no key, seamlessly routes to high-speed live inference across fallback models (openai -> mistral -> qwen).
 */
export const invokeLLM = async ({
  systemPrompt,
  userPrompt,
  messages = [],
  temperature = 0.7,
  jsonMode = false,
}) => {
  // Option 1: Configured API Key via LangChain
  if (hasValidLLMKey()) {
    try {
      const llm = getLangChainLLM(temperature);
      const formatted = [];
      if (systemPrompt) formatted.push(new SystemMessage(systemPrompt));
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
      console.warn('[LLM] LangChain API failed, falling back to live open inference:', langchainErr.message);
    }
  }

  // Option 2: Live Real-Time Multi-Model Engine (openai -> mistral -> qwen)
  const models = ['openai', 'mistral', 'qwen', 'llama'];
  const formattedMessages = [];
  if (systemPrompt) formattedMessages.push({ role: 'system', content: systemPrompt });
  (messages || []).slice(-6).forEach((m) => {
    const role = m.sender === 'user' || m.role === 'user' ? 'user' : 'assistant';
    formattedMessages.push({ role, content: m.content || m.text || '' });
  });
  formattedMessages.push({ role: 'user', content: userPrompt });

  for (const model of models) {
    try {
      const response = await axios.post(
        'https://text.pollinations.ai/',
        {
          messages: formattedMessages,
          model,
          jsonMode: jsonMode || false,
          seed: Math.floor(Math.random() * 1000000),
        },
        {
          timeout: 15000,
          headers: { 'Content-Type': 'application/json' },
        }
      );

      let output = response.data;
      if (typeof output !== 'string') {
        output = JSON.stringify(output);
      }
      if (output && output.trim().length > 0) {
        return output.trim();
      }
    } catch (modelErr) {
      console.warn(`[LLM] Model ${model} retry note: ${modelErr.message}. Trying next model...`);
    }
  }

  throw new Error('All live AI inference providers are currently busy. Please retry in a few moments.');
};
