export const getPluginConfigs = () => {
  try { return JSON.parse(localStorage.getItem('kritiai_plugin_configs') || '{}'); } catch { return {}; }
};

const quoted = (text) => text.match(/["“]([^"”]+)["”]/)?.[1]?.trim() || '';
const quotedAfter = (text, cue) => text.match(new RegExp(`\\b(?:${cue})\\s+(?:is\\s+)?["“]([^"”]+)["”]`, 'i'))?.[1]?.trim() || '';

export const createPluginDraft = (prompt) => {
  const text = String(prompt || '');
  if (/\b(calendar|schedule|appointment|meeting|event)\b/i.test(text) && /\b(add|schedule|book|create|put|set)\b/i.test(text)) {
    const title = text.match(/\b(?:called|named|titled)\s+["“]([^"”]+)["”]/i)?.[1]?.trim() || '';
    return { type: 'calendar', title, startsAt: '', endsAt: '' };
  }
  if (/\b(email|gmail)\b/i.test(text) && /\b(send|email|message)\b/i.test(text)) {
    return {
      type: 'gmail',
      to: text.match(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/)?.[0] || '',
      subject: quotedAfter(text, 'subject'),
      body: quotedAfter(text, 'saying|message|body'),
    };
  }
  if (/\b(send|message|text)\b/i.test(text) && (/\bwhatsapp\b/i.test(text) || /\b(someone|person|contact|to)\b/i.test(text))) {
    return {
      type: 'whatsapp',
      to: text.match(/\+?\d[\d\s().-]{7,}\d/)?.[0]?.trim() || '',
      body: quotedAfter(text, 'saying|message|body') || quoted(text),
    };
  }
  return null;
};

export const getEnabledIntegrations = () => {
  const configs = getPluginConfigs();
  return Object.entries(configs).filter(([, config]) => Boolean(config?.accessToken?.trim())).map(([name]) => name);
};
