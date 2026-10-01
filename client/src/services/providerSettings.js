export const getProviderConfigs = () => {
  try { return JSON.parse(localStorage.getItem('kritiai_provider_configs') || '{}'); }
  catch { return {}; }
};

export const getSavedProviderConfig = (selection = 'auto') => {
  // Automatic routing belongs to the agent service. Do not silently turn an
  // "Automatic" selection into a stale browser-saved provider (often a local
  // Ollama endpoint that is no longer running). A browser key is sent only
  // when its provider is explicitly selected and has passed connection setup.
  if (selection === 'auto') return undefined;
  const configs = getProviderConfigs();
  const provider = selection;
  if (provider === 'auto') return undefined;
  const config = configs[provider];
  if ((!config?.apiKey && provider !== 'ollama') || !config?.model) return undefined;
  return { provider, apiKey: config.apiKey || 'ollama', model: config.model, baseURL: config.baseURL };
};

export const saveProviderConfig = (provider, config) => {
  const configs = getProviderConfigs();
  if (config?.apiKey || (provider === 'ollama' && config?.model)) configs[provider] = config;
  else delete configs[provider];
  localStorage.setItem('kritiai_provider_configs', JSON.stringify(configs));
};

export const getImageProviderConfig = () => {
  try { return JSON.parse(localStorage.getItem('kritiai_image_provider') || 'null'); }
  catch { return null; }
};
