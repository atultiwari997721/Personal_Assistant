import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { CheckCircle2, Circle, Eye, EyeOff, Plug, Save, ShieldCheck, Wifi, LoaderCircle } from 'lucide-react';
import { AVAILABLE_MODELS, setSelectedModel } from '../store/agentSlice.js';
import { getImageProviderConfig, getProviderConfigs, saveProviderConfig } from '../services/providerSettings.js';
import api from '../services/api.js';

const PROVIDER_URLS = {
  openai: 'https://api.openai.com/v1',
  xai: 'https://api.x.ai/v1',
  gemini: 'https://generativelanguage.googleapis.com/v1beta/openai/',
  nvidia: 'https://integrate.api.nvidia.com/v1',
  groq: 'https://api.groq.com/openai/v1',
  huggingface: 'https://router.huggingface.co/v1',
  openrouter: 'https://openrouter.ai/api/v1',
  ollama: 'http://127.0.0.1:11434/v1',
};
const API_KEY_LINKS = {
  openai: 'https://platform.openai.com/api-keys',
  xai: 'https://console.x.ai/',
  gemini: 'https://aistudio.google.com/app/apikey',
  nvidia: 'https://build.nvidia.com/',
  groq: 'https://console.groq.com/keys',
  huggingface: 'https://huggingface.co/settings/tokens',
  openrouter: 'https://openrouter.ai/settings/keys',
  ollama: 'https://ollama.com/download',
};
const MODEL_LIST = AVAILABLE_MODELS.filter((model) => model.id !== 'auto');

const detectKeyProvider = (providerId, apiKey) => {
  const value = apiKey?.trim() || '';
  if (providerId === 'groq' && /^xai-/i.test(value)) return 'xai';
  if (providerId === 'xai' && /^gsk_/i.test(value)) return 'groq';
  return providerId;
};

const readPlugins = () => {
  try { return JSON.parse(localStorage.getItem('kritiai_plugin_configs') || '{}'); } catch { return {}; }
};

function ProviderCard({ model, provider, onSave }) {
  const [config, setConfig] = useState(() => {
    const saved = getProviderConfigs()[model.id];
    return { apiKey: saved?.apiKey || '', model: saved?.model || '', baseURL: saved?.baseURL || PROVIDER_URLS[model.id] };
  });
  const [showKey, setShowKey] = useState(false);
  const [status, setStatus] = useState('');
  const [testing, setTesting] = useState(false);
  const initialDiscovery = useRef(false);
  const discoveryPromise = useRef(null);
  useEffect(() => {
    const saved = getProviderConfigs()[model.id];
    setConfig((current) => ({ ...current, apiKey: saved?.apiKey || current.apiKey, model: saved?.model || provider?.model || current.model, baseURL: saved?.baseURL || current.baseURL || PROVIDER_URLS[model.id] }));
  }, [model.id, provider?.model]);
  const isLocal = model.id === 'ollama';
  const savedLocally = Boolean((config.apiKey || isLocal) && config.model && getProviderConfigs()[model.id]?.model);
  const hasLocalConfig = Boolean(getProviderConfigs()[model.id]?.apiKey || savedLocally);
  const configuredOnService = Boolean(provider?.configured);
  const ready = savedLocally || configuredOnService;

  const discoverAndSave = (sourceConfig = config, quiet = false) => {
    if (!sourceConfig.apiKey?.trim()) return false;
    if (discoveryPromise.current) return discoveryPromise.current;
    const targetProvider = detectKeyProvider(model.id, sourceConfig.apiKey);
    const targetName = MODEL_LIST.find((item) => item.id === targetProvider)?.name || targetProvider;
    const targetConfig = { ...sourceConfig, baseURL: targetProvider === model.id ? sourceConfig.baseURL : PROVIDER_URLS[targetProvider] };
    if (!quiet) { setTesting(true); setStatus(targetProvider === model.id ? 'Checking key and selecting a working model…' : `Recognized a ${targetName} key. Testing it with ${targetName}…`); }
    // Preserve the key while discovery runs, but never leave an unverified model
    // marked ready if a previous manually entered model ID was invalid.
    saveProviderConfig(targetProvider, { ...targetConfig, model: '' });
    if (targetProvider !== model.id) {
      saveProviderConfig(model.id, null);
      onSave(model.id, null);
    }
    discoveryPromise.current = (async () => {
      try {
        const providerConfig = { provider: targetProvider, ...targetConfig, model: targetConfig.model || '__auto_discover__' };
        const response = await api.post('/agents/providers/models', { providerConfig }, { timeout: 65000 });
        const models = response.data.models || [];
        const next = { ...targetConfig, model: response.data.recommended || models[0] };
        setConfig(next);
        onSave(targetProvider, next);
        setStatus(`Connected to ${targetName}. Automatically selected ${next.model}.`);
        return true;
    } catch (error) {
      const code = error.response?.data?.code;
      setStatus(code === 'AI_PROVIDER_AUTH_FAILED'
        ? `${targetName} rejected this API key (HTTP 401). Make sure it is an active ${targetName} API key. If it is correct, create a fresh key in the provider console and replace this one.`
        : error.response?.data?.message || error.message || 'Could not validate the API key.'));
        return false;
      } finally { if (!quiet) setTesting(false); discoveryPromise.current = null; }
    })();
    return discoveryPromise.current;
  };

  useEffect(() => {
    const saved = getProviderConfigs()[model.id];
    if (saved?.apiKey && !initialDiscovery.current) {
      initialDiscovery.current = true;
      discoverAndSave({ ...saved, baseURL: saved.baseURL || PROVIDER_URLS[model.id] }, true);
    }
  }, [model.id]);

  const save = async () => {
    if (!isLocal && config.apiKey?.trim()) {
      await discoverAndSave(config);
      return;
    }
    if (!config.model?.trim()) {
      setStatus('No model is configured yet. Add a provider key or check the local Ollama setup.');
      return;
    }
    onSave(model.id, config);
    setStatus(configuredOnService ? 'Using the model configured on the local agent service.' : 'Saved in this browser.');
  };
  const test = async () => {
    if (!config.apiKey?.trim() && !ready) return setStatus('Paste an API key first.');
    const detectedProvider = detectKeyProvider(model.id, config.apiKey);
    if (config.apiKey?.trim() && detectedProvider !== model.id) {
      await discoverAndSave({ ...config, baseURL: PROVIDER_URLS[detectedProvider] });
      return;
    }
    setTesting(true); setStatus('Sending a live test prompt to the provider…');
    try {
      const providerConfig = config.apiKey?.trim()
        ? { provider: model.id, ...config, model: config.model || '__auto_discover__' }
        : savedLocally && model.id === 'ollama'
          ? { provider: model.id, ...config, apiKey: 'ollama' }
          : undefined;
      const response = await api.post('/agents/providers/test', { provider: model.id, providerConfig }, { timeout: 65000 });
      const connected = { ...config, model: response.data.model || config.model };
      setConfig(connected);
      onSave(model.id, connected);
      setStatus(`Connection verified with a live model response: ${connected.model}.`);
    } catch (error) {
      const code = error.response?.data?.code;
      setStatus(code === 'AI_PROVIDER_AUTH_FAILED'
        ? `${model.name} rejected this API key (HTTP 401). Make sure it is active and was created in the ${model.name} console.`
        : error.response?.data?.message || error.message || 'Connection check failed.');
    } finally { setTesting(false); }
  };

  return <article className="rounded-2xl border border-slate-200 dark:border-dark-700 bg-white dark:bg-dark-900 p-4 md:p-5">
    <div className="flex items-start justify-between gap-3 mb-4">
      <div><h3 className="font-semibold">{model.name}</h3><p className="text-xs text-slate-500 mt-1">Use this provider across Chat and every agent.</p><a href={API_KEY_LINKS[model.id]} target="_blank" rel="noreferrer" className="inline-flex mt-1 text-xs text-sky-600 dark:text-sky-400 hover:underline">{isLocal ? 'Install Ollama' : `Get a ${model.name} API key`} ↗</a></div>
      <span className={`text-[11px] rounded-full px-2.5 py-1 border ${ready ? 'text-emerald-600 border-emerald-500/30 bg-emerald-500/10' : 'text-slate-500 border-slate-200 dark:border-dark-700'}`}>{savedLocally ? 'Configured in browser' : configuredOnService ? 'Configured on service' : 'Not configured'}</span>
    </div>
      {!isLocal && <>
      <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">API key</label>
      <div className="relative mb-3"><input type={showKey ? 'text' : 'password'} value={config.apiKey} onChange={(e) => setConfig({ ...config, apiKey: e.target.value })} onBlur={() => { if (config.apiKey?.trim() && !getProviderConfigs()[model.id]?.model) discoverAndSave(config); }} placeholder="Paste this provider's API key" autoComplete="new-password" className="w-full rounded-xl border border-slate-300 dark:border-dark-700 bg-slate-50 dark:bg-dark-850 px-3 py-2.5 pr-11 text-sm" /><button type="button" aria-label={showKey ? 'Hide API key' : 'Show API key'} onClick={() => setShowKey(!showKey)} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-500">{showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button></div>
    </>}
    <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">Model selection <span className="font-normal text-slate-400">(automatic)</span></label>
    <div className="w-full mb-3 rounded-xl border border-slate-200 dark:border-dark-700 bg-slate-100/70 dark:bg-dark-850 px-3 py-2.5 text-sm text-slate-500">{config.model ? `Automatically selected: ${config.model}` : (isLocal ? 'Set by your local Ollama configuration' : 'A working model is selected automatically after a live test')}</div>
    <div className="mt-4 flex flex-wrap items-center gap-2">
      <button type="button" onClick={save} className="inline-flex items-center gap-2 rounded-xl bg-sky-600 hover:bg-sky-500 px-3 py-2 text-xs font-semibold text-white"><Save className="w-3.5 h-3.5" />Save</button>
      <button type="button" onClick={test} disabled={testing || (!config.apiKey?.trim() && !ready)} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-dark-700 px-3 py-2 text-xs font-semibold disabled:opacity-50"><Wifi className="w-3.5 h-3.5" />{testing ? 'Testing…' : 'Test connection'}</button>
      {hasLocalConfig && <button type="button" onClick={() => { saveProviderConfig(model.id, null); setConfig({ apiKey: '', model: provider?.model || '', baseURL: PROVIDER_URLS[model.id] }); setStatus('Removed browser-saved credentials.'); onSave(model.id, null); }} className="text-xs text-rose-500 px-2 py-2">Remove</button>}
    </div>
    {status && <p role="status" className="text-xs mt-3 text-slate-500 dark:text-slate-400">{status}</p>}
  </article>;
}

export default function ApiPluginsPage() {
  const dispatch = useDispatch();
  const [tab, setTab] = useState('api');
  const [pluginConfig, setPluginConfig] = useState(readPlugins);
  const [message, setMessage] = useState('');
  const [serverProviders, setServerProviders] = useState({});
  const [imageKey, setImageKey] = useState(() => getImageProviderConfig()?.apiKey || '');
  const [showImageKey, setShowImageKey] = useState(false);
  const [imageStatus, setImageStatus] = useState('');

  useEffect(() => {
    api.get('/agents/providers').then((response) => setServerProviders(Object.fromEntries((response.data?.providers || []).map((provider) => [provider.id, provider])))).catch(() => {});
  }, []);

  const saveProvider = (provider, config) => {
    saveProviderConfig(provider, config);
    if (config?.model) dispatch(setSelectedModel(provider));
    else if (localStorage.getItem('kritiai_default_provider') === provider) {
      localStorage.setItem('kritiai_default_provider', 'auto');
      dispatch(setSelectedModel('auto'));
    }
    window.dispatchEvent(new Event('kritiai:providers-updated'));
  };
  const savePlugins = (next) => {
    setPluginConfig(next);
    localStorage.setItem('kritiai_plugin_configs', JSON.stringify(next));
    setMessage('Connection details saved on this device.');
    window.setTimeout(() => setMessage(''), 3500);
  };

  const setPluginField = (plugin, field, value) => setPluginConfig((state) => ({ ...state, [plugin]: { ...state[plugin], [field]: value } }));
  const connectionCard = (id, name, description, fields) => {
    const current = pluginConfig[id] || {};
    const connected = Boolean(fields.every((field) => current[field.key]?.trim()));
    return <article key={id} className="rounded-2xl border border-slate-200 dark:border-dark-700 bg-white dark:bg-dark-900 p-4 md:p-5">
      <div className="flex items-start justify-between gap-3 mb-3"><div><h3 className="font-semibold">{name}</h3><p className="text-xs text-slate-500 mt-1">{description}</p></div><span className={`text-[11px] rounded-full px-2.5 py-1 border ${connected ? 'text-emerald-600 border-emerald-500/30 bg-emerald-500/10' : 'text-slate-500 border-slate-200 dark:border-dark-700'}`}>{connected ? 'Details saved' : 'Setup needed'}</span></div>
      {fields.map((field) => <label key={field.key} className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-3">{field.label}<input type={field.secret ? 'password' : 'text'} value={current[field.key] || ''} onChange={(e) => setPluginField(id, field.key, e.target.value)} placeholder={field.placeholder} autoComplete="off" className="mt-1.5 w-full rounded-xl border border-slate-300 dark:border-dark-700 bg-slate-50 dark:bg-dark-850 px-3 py-2.5 text-sm" /></label>)}
      <button type="button" onClick={() => savePlugins(pluginConfig)} className="inline-flex items-center gap-2 rounded-xl bg-sky-600 hover:bg-sky-500 px-3 py-2 text-xs font-semibold text-white"><Plug className="w-3.5 h-3.5" />Save connection</button>
    </article>;
  };

  return <div className="h-full overflow-y-auto p-5 md:p-8"><div className="max-w-4xl mx-auto space-y-6">
    <header><p className="text-xs uppercase tracking-widest text-sky-500 font-bold">Connections</p><h1 className="text-2xl font-bold mt-1">API &amp; Plugins</h1><p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Add model providers and connect services you use every day.</p></header>
    <div role="tablist" className="inline-flex rounded-xl border border-slate-200 dark:border-dark-700 bg-white dark:bg-dark-900 p-1"><button role="tab" aria-selected={tab === 'api'} onClick={() => setTab('api')} className={`px-4 py-2 rounded-lg text-sm ${tab === 'api' ? 'bg-sky-500/10 text-sky-600 dark:text-sky-300 font-semibold' : 'text-slate-500'}`}>API</button><button role="tab" aria-selected={tab === 'plugins'} onClick={() => setTab('plugins')} className={`px-4 py-2 rounded-lg text-sm ${tab === 'plugins' ? 'bg-sky-500/10 text-sky-600 dark:text-sky-300 font-semibold' : 'text-slate-500'}`}>Plugins</button></div>
    {tab === 'api' ? <>
      <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-4 text-sm text-slate-600 dark:text-slate-300 flex gap-3"><ShieldCheck className="w-5 h-5 text-sky-500 shrink-0" /><span>Keys are saved in this browser and included only when you use that provider. Each provider’s own API billing and limits apply. Ollama runs on your configured local endpoint.</span></div>
      <article className="rounded-2xl border border-slate-200 dark:border-dark-700 bg-white dark:bg-dark-900 p-4 md:p-5">
        <div className="mb-4"><h3 className="font-semibold">Pollinations image generation</h3><p className="text-xs text-slate-500 mt-1">Add its key once; KritiAI handles the endpoint and model. The provider may apply free quotas or require available credits.</p><a href="https://enter.pollinations.ai/" target="_blank" rel="noreferrer" className="inline-flex mt-1 text-xs text-sky-600 dark:text-sky-400 hover:underline">Get a Pollinations API key ↗</a></div>
        <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">Pollinations API key</label>
        <div className="relative mb-3"><input type={showImageKey ? 'text' : 'password'} value={imageKey} onChange={(e) => setImageKey(e.target.value)} placeholder="Paste your Pollinations API key" autoComplete="new-password" className="w-full rounded-xl border border-slate-300 dark:border-dark-700 bg-slate-50 dark:bg-dark-850 px-3 py-2.5 pr-11 text-sm" /><button type="button" aria-label={showImageKey ? 'Hide API key' : 'Show API key'} onClick={() => setShowImageKey(!showImageKey)} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-500">{showImageKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button></div>
        <button type="button" onClick={() => { if (!imageKey.trim()) { localStorage.removeItem('kritiai_image_provider'); setImageStatus('Image API key removed.'); return; } localStorage.setItem('kritiai_image_provider', JSON.stringify({ provider: 'pollinations', apiKey: imageKey.trim() })); setImageStatus('Image API key saved on this device.'); }} className="inline-flex items-center gap-2 rounded-xl bg-sky-600 hover:bg-sky-500 px-3 py-2 text-xs font-semibold text-white"><Save className="w-3.5 h-3.5" />Save image key</button>
        {imageStatus && <p role="status" className="text-xs mt-3 text-slate-500">{imageStatus}</p>}
        <p className="text-xs text-slate-500 mt-3">Generation requires Pollinations API access and available service quota or credits; the provider may apply limits.</p>
      </article>
      <div className="grid gap-4">{MODEL_LIST.map((model) => <ProviderCard key={model.id} model={model} provider={serverProviders[model.id]} onSave={saveProvider} />)}</div>
    </> : <>
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-slate-600 dark:text-slate-300">Connections are stored on this device. Google API access tokens must include Gmail send and/or Calendar event scopes. WhatsApp requires a Meta Cloud API access token and phone number ID. Chat will ask before sending or creating anything.</div>
      <div className="grid gap-4">
        {connectionCard('google', 'Gmail & Google Calendar', 'Connect Google APIs using an access token created for your Google account.', [
          { key: 'accessToken', label: 'Google access token', secret: true, placeholder: 'Paste Google OAuth access token' },
        ])}
        {connectionCard('whatsapp', 'WhatsApp', 'Connect a WhatsApp Business Cloud API sender.', [
          { key: 'accessToken', label: 'Meta access token', secret: true, placeholder: 'Paste a WhatsApp Cloud API token' },
          { key: 'phoneNumberId', label: 'WhatsApp phone number ID', placeholder: 'Phone Number ID from Meta' },
          { key: 'apiVersion', label: 'Graph API version', placeholder: 'v22.0' },
        ])}
      </div>
      <p role="status" className="text-sm text-emerald-600">{message}</p>
      <p className="text-xs text-slate-500">Credentials are stored in this browser only. “Details saved” confirms local setup, not that the service token or permissions have been verified.</p>
    </>}
  </div></div>;
}
