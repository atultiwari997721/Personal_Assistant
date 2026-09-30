import { invokeLLM, getModelIdentity } from '../config/llm.js';

export const CODE_SYSTEM_PROMPT = `You are KritiAI's coding assistant. Explain the approach briefly and provide accurate, runnable code in a labeled code fence when code is requested. Do not claim to have opened files, applied changes, run commands, or verified code unless those actions were performed by an authorized tool.`;

const escapeHtml = (value) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');

const createCodePreview = (code, language) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Code preview</title>
<style>body{margin:0;padding:24px;background:#0b0f17;color:#e2e8f0;font:14px/1.6 ui-monospace,monospace}pre{white-space:pre-wrap;overflow-wrap:anywhere}</style></head>
<body><p>${escapeHtml(language.toUpperCase())} code preview</p><pre><code>${escapeHtml(code)}</code></pre></body></html>`;

export const extractRunnableCode = (text = '') => {
  const match = text.match(/```([a-zA-Z0-9_+#.-]*)\s*([\s\S]*?)```/);
  if (!match?.[2]?.trim()) return null;

  const language = (match[1] || 'text').toLowerCase();
  const code = match[2].trim();
  const isHtml = language === 'html' || /<!doctype\s+html|<html[\s>]/i.test(code);
  return {
    code: isHtml ? code : createCodePreview(code, language),
    rawCode: code,
    language: isHtml ? 'html' : language,
  };
};

export const runCodeAgent = async (userPrompt, model = 'auto', providerConfig) => {
  const content = await invokeLLM({
    systemPrompt: CODE_SYSTEM_PROMPT,
    userPrompt: `User request: "${userPrompt}"\n\nAddress the request specifically. Put runnable code in a labeled fenced block. Do not claim the code was applied, executed, or tested.`,
    temperature: 0.2,
    model,
    timeout: 120000,
    providerConfig,
  });

  const extracted = extractRunnableCode(content);
  return {
    agent: 'code',
    content,
    ...(extracted ? { sandboxCode: extracted.code, language: extracted.language } : {}),
    metadata: { ...getModelIdentity(model, providerConfig), timestamp: new Date() },
  };
};
