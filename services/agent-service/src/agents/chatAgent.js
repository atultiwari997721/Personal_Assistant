import { invokeLLM, getModelIdentity } from '../config/llm.js';

export const CHAT_SYSTEM_PROMPT = `You are KritiAI, a personal AI assistant. Give direct, accurate answers in clear language. Use Markdown when it improves readability. Do not claim to have performed actions unless a connected tool returned a verified result. Do not reveal private chain-of-thought; provide a concise explanation or summary when useful.`;

export const runChatAgent = async (messages, userPrompt, model = 'auto') => {
  const content = await invokeLLM({
    systemPrompt: CHAT_SYSTEM_PROMPT,
    userPrompt,
    messages,
    temperature: 0.6,
    model,
  });

  return {
    agent: 'chat',
    content,
    metadata: { timestamp: new Date(), ...getModelIdentity(model) },
  };
};
