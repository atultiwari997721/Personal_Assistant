import dns from 'dns';
import { ChatOpenAI } from '@langchain/openai';
import { SystemMessage, HumanMessage, AIMessage } from '@langchain/core/messages';
import dotenv from 'dotenv';

dotenv.config();

try {
  dns.setDefaultResultOrder('ipv4first');
} catch {}

const hasSecret = (name) => {
  const value = process.env[name]?.trim();
  return Boolean(value && value.length > 5 && !/your_|placeholder|replace_me/i.test(value));
};

const PROVIDER_DEFINITIONS = [
  {
    id: 'openai',
    name: 'OpenAI',
    keyEnv: 'OPENAI_API_KEY',
    modelEnv: 'OPENAI_MODEL',
    baseUrlEnv: 'OPENAI_BASE_URL',
    defaultBaseUrl: 'https://api.openai.com/v1',
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    keyEnv: 'GEMINI_API_KEY',
    modelEnv: 'GEMINI_MODEL',
    defaultBaseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai/',
  },
  {
    id: 'nvidia',
    name: 'NVIDIA NIM',
    keyEnv: 'NVIDIA_API_KEY',
    modelEnv: 'NVIDIA_MODEL',
    baseUrlEnv: 'NVIDIA_BASE_URL',
    defaultBaseUrl: 'https://integrate.api.nvidia.com/v1',
  },
  {
    id: 'groq',
    name: 'Groq',
    keyEnv: 'GROQ_API_KEY',
    modelEnv: 'GROQ_MODEL',
    defaultBaseUrl: 'https://api.groq.com/openai/v1',
  },
  {
    id: 'huggingface',
    name: 'Hugging Face Inference Providers',
    keyEnv: 'HF_TOKEN',
    modelEnv: 'HF_MODEL',
    defaultBaseUrl: 'https://router.huggingface.co/v1',
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    keyEnv: 'OPENROUTER_API_KEY',
    modelEnv: 'OPENROUTER_MODEL',
    baseUrlEnv: 'OPENROUTER_BASE_URL',
    defaultBaseUrl: 'https://openrouter.ai/api/v1',
  },
  {
    id: 'ollama',
    name: 'Ollama (Local)',
    keyEnv: null,
    modelEnv: 'OLLAMA_MODEL',
    baseUrlEnv: 'OLLAMA_URL',
    defaultBaseUrl: 'http://127.0.0.1:11434/v1',
    local: true,
  },
];

const LEGACY_MODEL_PROVIDER = {
  'gpt-4o-mini': 'openai',
  'claude-3-5-sonnet': 'openrouter',
  'gemini-2-flash': 'gemini',
  'nvidia-nemotron': 'nvidia',
  'nvidia-mistral-nemo': 'nvidia',
  'deepseek-r1': 'openrouter',
  'qwen-coder': 'ollama',
  'phi-4': 'ollama',
  'llama-3': 'ollama',
  'cortex-cognitive': 'ollama',
};

const providerConfiguration = (definition) => {
  const keyConfigured = definition.local
    ? Boolean(process.env[definition.modelEnv]?.trim())
    : hasSecret(definition.keyEnv);
  const model = process.env[definition.modelEnv]?.trim() || (definition.id === 'openai' ? process.env.LLM_MODEL?.trim() : '') || '';
  let baseURL = (definition.baseUrlEnv && process.env[definition.baseUrlEnv]?.trim()) || definition.defaultBaseUrl;
  if (definition.local && baseURL && !baseURL.replace(/\/$/, '').endsWith('/v1')) {
    baseURL = `${baseURL.replace(/\/$/, '')}/v1`;
  }
  const configured = keyConfigured && Boolean(model);

  return {
    id: definition.id,
    name: definition.name,
    configured,
    status: !keyConfigured ? 'not_configured' : !model ? 'model_required' : 'ready',
    model: model || null,
    local: Boolean(definition.local),
    ...(configured
      ? { apiKey: definition.local ? 'ollama' : process.env[definition.keyEnv].trim(), baseURL }
      : {}),
  };
};

const providerConfigurations = () => PROVIDER_DEFINITIONS.map(providerConfiguration);

export const getConfiguredProviders = () => providerConfigurations().map(({ id, name, configured, status, model, local }) => ({
  id,
  name,
  configured,
  status,
  model,
  local,
}));

export const getModelIdentity = (requestedModel = 'auto') => {
  const provider = getActiveProvider(requestedModel);
  return provider ? { provider: provider.id, model: provider.model } : null;
};

export const getActiveProvider = (requestedModel = 'auto') => {
  const requested = (requestedModel || 'auto').toLowerCase();
  const selectedProvider = LEGACY_MODEL_PROVIDER[requested] || requested.replace(/^provider:/, '');
  const configurations = providerConfigurations();

  if (requested === 'auto') {
    const preferred = process.env.LLM_PROVIDER?.trim().toLowerCase();
    const ordered = preferred
      ? [...configurations.filter((provider) => provider.id === preferred), ...configurations.filter((provider) => provider.id !== preferred)]
      : configurations;
    return ordered.find((provider) => provider.configured) || null;
  }

  const definition = PROVIDER_DEFINITIONS.find((provider) => provider.id === selectedProvider);
  if (!definition) {
    const error = new Error('Unsupported AI provider selection.');
    error.code = 'AI_PROVIDER_UNSUPPORTED';
    throw error;
  }

  const provider = configurations.find((candidate) => candidate.id === definition.id);
  if (!provider.configured) {
    const error = new Error(`${provider.name} is ${provider.status === 'model_required' ? 'configured without a model' : 'not configured'}.`);
    error.code = provider.status === 'model_required' ? 'AI_MODEL_NOT_CONFIGURED' : 'AI_PROVIDER_NOT_CONFIGURED';
    error.provider = provider.id;
    throw error;
  }

  return provider;
};

export const hasValidLLMKey = () => providerConfigurations().some((provider) => provider.configured);

export const getLangChainLLM = (temperature = 0.7, requestedModel = 'auto', timeout = 35000) => {
  const provider = getActiveProvider(requestedModel);
  if (!provider) return null;

  return new ChatOpenAI({
    apiKey: provider.apiKey,
    model: provider.model,
    temperature,
    timeout,
    configuration: { baseURL: provider.baseURL },
  });
};

const toProviderError = (error, provider) => {
  const status = error?.status || error?.response?.status;
  const mapped = new Error(
    status === 401 || status === 403
      ? `${provider.name} authentication failed. Check its API key.`
      : status === 429
        ? `${provider.name} quota or rate limit was reached.`
        : `${provider.name} request failed${status ? ` (HTTP ${status})` : ''}.`,
  );
  mapped.code = status === 401 || status === 403
    ? 'AI_PROVIDER_AUTH_FAILED'
    : status === 429
      ? 'AI_PROVIDER_QUOTA_EXCEEDED'
      : 'AI_PROVIDER_REQUEST_FAILED';
  mapped.provider = provider.id;
  mapped.status = status;
  return mapped;
};

export const invokeLLM = async ({
  systemPrompt,
  userPrompt,
  messages = [],
  temperature = 0.7,
  model = 'auto',
  timeout = 35000,
}) => {
  const provider = getActiveProvider(model);
  if (!provider) {
    const error = new Error('No AI provider is configured. Configure an API key and model on the agent service, or configure Ollama locally.');
    error.code = 'AI_PROVIDER_NOT_CONFIGURED';
    throw error;
  }

  const formatted = [];
  if (systemPrompt) formatted.push(new SystemMessage(systemPrompt));
  for (const message of messages || []) {
    const role = message.sender || message.role;
    const content = message.content || message.text || '';
    if (!content) continue;
    if (role === 'user') formatted.push(new HumanMessage(content));
    else if (role === 'assistant') formatted.push(new AIMessage(content));
  }
  formatted.push(new HumanMessage(userPrompt));

  try {
    const llm = getLangChainLLM(temperature, model, timeout);
    const response = await llm.invoke(formatted);
    const content = typeof response.content === 'string'
      ? response.content.trim()
      : Array.isArray(response.content)
        ? response.content.map((part) => typeof part === 'string' ? part : part?.text || '').join('').trim()
        : '';

    if (!content) {
      const error = new Error(`${provider.name} returned an empty response.`);
      error.code = 'AI_PROVIDER_EMPTY_RESPONSE';
      error.provider = provider.id;
      throw error;
    }
    return content;
  } catch (error) {
    if (error.code?.startsWith('AI_')) throw error;
    console.error(`[LLM] ${provider.id} request failed`, { status: error?.status || error?.response?.status });
    throw toProviderError(error, provider);
  }
};
