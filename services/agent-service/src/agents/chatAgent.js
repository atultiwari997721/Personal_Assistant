import { invokeLLM, getModelIdentity } from '../config/llm.js';

export const CHAT_SYSTEM_PROMPT = `You are KritiAI, a personal AI assistant. Give direct, accurate answers in clear language. Use Markdown when it improves readability. Do not claim to have performed actions unless a connected tool returned a verified result. Do not reveal private chain-of-thought; provide a concise explanation or summary when useful.`;

export const runChatAgent = async (messages, userPrompt, model = 'auto', providerConfig, connectedPlugins = []) => {
  const content = await invokeLLM({
    systemPrompt: `${CHAT_SYSTEM_PROMPT}\n\nConnected plugins: ${connectedPlugins.length ? connectedPlugins.join(', ') : 'none'}. For requests to send a message or create an event, prepare the draft and remind the user to review and confirm it in KritiAI. Never say an external action completed without a verified plugin result.`,
    userPrompt,
    messages,
    temperature: 0.6,
    model,
    providerConfig,
  });

  return {
    agent: 'chat',
    content,
    metadata: { timestamp: new Date(), ...getModelIdentity(model, providerConfig) },
  };
};
