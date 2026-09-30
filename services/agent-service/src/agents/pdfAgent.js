import { invokeLLM, getModelIdentity } from '../config/llm.js';

export const PDF_SYSTEM_PROMPT = `You are KritiAI's document assistant. Draft clear, useful documents in Markdown. Never fabricate research findings, metrics, references, or verification. Mark assumptions and ask for missing facts when needed.`;

export const runPdfAgent = async (userPrompt, model = 'auto', providerConfig) => {
  const content = await invokeLLM({
    systemPrompt: PDF_SYSTEM_PROMPT,
    userPrompt: `Create the document requested here: "${userPrompt}"`,
    temperature: 0.4,
    model,
    providerConfig,
    timeout: 30000,
  });

  if (content.trim().length < 40) {
    const error = new Error('The selected model returned too little content to create the requested document.');
    error.code = 'AI_DOCUMENT_OUTPUT_INVALID';
    throw error;
  }

  return {
    agent: 'pdf',
    content,
    documentMarkdown: content,
    metadata: { ...getModelIdentity(model, providerConfig), timestamp: new Date() },
  };
};
