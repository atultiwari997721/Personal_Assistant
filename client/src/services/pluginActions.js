export const getPluginConfigs = () => {
  try { return JSON.parse(localStorage.getItem('kritiai_plugin_configs') || '{}'); } catch { return {}; }
};

const localDateTime = (date) => {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
};

export const createPluginDraft = (prompt) => {
  const text = String(prompt || '');
  if (/\b(calendar|schedule|appointment|meeting|event)\b/i.test(text) && /\b(add|schedule|book|create|put|set)\b/i.test(text)) {
    const start = new Date(Date.now() + 60 * 60 * 1000);
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    return { type: 'calendar', title: text.slice(0, 100), startsAt: localDateTime(start), endsAt: localDateTime(end) };
  }
  if (/\b(email|gmail)\b/i.test(text) && /\b(send|email|message)\b/i.test(text)) {
    return { type: 'gmail', to: '', subject: 'Message from KritiAI', body: text };
  }
  if (/\b(whatsapp|send (a )?message|message on whatsapp)\b/i.test(text) && /\b(send|message|text)\b/i.test(text)) {
    return { type: 'whatsapp', to: '', body: text };
  }
  return null;
};

export const getEnabledIntegrations = () => {
  const configs = getPluginConfigs();
  return Object.entries(configs).filter(([, config]) => Boolean(config?.accessToken?.trim())).map(([name]) => name);
};
