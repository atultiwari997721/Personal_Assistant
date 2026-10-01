export const getProviderConfigs = () => {
  try { return JSON.parse(localStorage.getItem('kritiai_provider_configs') || '{}'); }
  catch { return {}; }
};

export const getSavedProviderConfig = (selection = 'auto') => {
  const configs = getProviderConfigs();
  const provider = selection === 'auto'
    ? localStorage.getItem('kritiai_default_provider') || 'auto'
    : selection;
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
