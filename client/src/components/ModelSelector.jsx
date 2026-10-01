import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Sparkles,
  Cpu,
  Globe,
  Cloud,
  Server,
  Boxes,
  Zap,
  ChevronDown,
  Check,
  Compass,
} from 'lucide-react';
import { AVAILABLE_MODELS, setSelectedModel } from '../store/agentSlice.js';
import api from '../services/api.js';
import { getProviderConfigs } from '../services/providerSettings.js';

const MODEL_ICONS = {
  'auto': Sparkles,
  'openai': Cloud,
  'xai': Sparkles,
  'gemini': Globe,
  'nvidia': Cpu,
  'groq': Zap,
  'huggingface': Boxes,
  'openrouter': Compass,
  'ollama': Server,
};

export const ModelSelector = () => {
  const dispatch = useDispatch();
  const { selectedModel } = useSelector((state) => state.agent);
  const [isOpen, setIsOpen] = useState(false);
  const [providerStates, setProviderStates] = useState({});
  const menuRef = useRef(null);

  const currentModel = AVAILABLE_MODELS.find((m) => m.id === selectedModel) || AVAILABLE_MODELS[0];
  const Icon = MODEL_ICONS[currentModel.id] || Sparkles;

  useEffect(() => {
    let active = true;
    const refreshProviders = () => {
      api.get('/agents/providers')
        .then((response) => {
          if (!active) return;
          const states = Object.fromEntries((response.data?.providers || []).map((provider) => [provider.id, provider]));
          Object.entries(getProviderConfigs()).forEach(([id, config]) => {
            if (config?.model && (config.apiKey || id === 'ollama')) states[id] = { ...(states[id] || {}), configured: true, status: 'ready', model: config.model };
          });
          setProviderStates(states);
        })
        .catch(() => {});
    };
    refreshProviders();
    const timer = window.setInterval(refreshProviders, 10000);
    window.addEventListener('kritiai:providers-updated', refreshProviders);
    return () => { active = false; window.clearInterval(timer); window.removeEventListener('kritiai:providers-updated', refreshProviders); };
  }, []);

  // Older builds persisted concrete model IDs (including Ollama) even when
  // that provider was unavailable. Once the service reports readiness, move
  // those stale selections back to automatic routing.
  useEffect(() => {
    if (selectedModel !== 'auto' && providerStates[selectedModel]?.configured === false) {
      dispatch(setSelectedModel('auto'));
    }
  }, [dispatch, providerStates, selectedModel]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-dark-850 dark:hover:bg-dark-800 border border-slate-200 dark:border-dark-700/80 shadow-sm text-slate-700 dark:text-slate-200 transition"
        title="Choose a configured AI provider"
      >
        <Icon className="w-3.5 h-3.5 text-sky-500" />
        <span className="truncate max-w-[130px] sm:max-w-none">{currentModel.name}</span>
        <span className="hidden sm:inline-block text-[10px] px-1.5 py-0.2 rounded bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold border border-sky-500/20">
          {currentModel.badge}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 sm:left-0 mt-2 w-80 max-h-96 overflow-y-auto origin-top-left rounded-2xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-750 shadow-2xl z-50 p-2 space-y-1 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-dark-800 sticky top-0 bg-white/95 dark:bg-dark-900/95 backdrop-blur-sm z-10">
            AI provider
          </div>
          {Object.keys(providerStates).length > 0 && !Object.values(providerStates).some((provider) => provider.configured) && (
            <div className="mx-2 my-2 rounded-xl border border-amber-300/70 bg-amber-50 px-3 py-2 text-[11px] leading-relaxed text-amber-900 dark:border-amber-700/50 dark:bg-amber-950/30 dark:text-amber-200">
              No AI provider is configured. Add a provider key in API &amp; Plugins, or start Ollama and set <code>OLLAMA_MODEL</code>.
            </div>
          )}
          {AVAILABLE_MODELS.map((model) => {
            const ModelIcon = MODEL_ICONS[model.id] || Sparkles;
            const isSelected = selectedModel === model.id;
            const provider = providerStates[model.id];
            const disabled = model.id !== 'auto' && !provider?.configured;
            const unavailableReason = provider?.status === 'server_unreachable'
              ? 'Ollama is not running at its configured local address.'
              : provider?.status === 'model_unavailable'
                ? `The configured local model (${provider.model || 'unknown'}) is not installed in Ollama.`
                : provider?.status === 'no_models_installed'
                  ? 'Ollama is running, but no local models are installed.'
                  : null;
            return (
              <button
                key={model.id}
                disabled={disabled}
                onClick={() => {
                  dispatch(setSelectedModel(model.id));
                  setIsOpen(false);
                }}
                className={`w-full flex items-start gap-2.5 px-3 py-2 rounded-xl text-left text-xs transition ${
                  isSelected
                    ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400 font-semibold'
                    : disabled
                      ? 'text-slate-400 dark:text-slate-600 cursor-not-allowed'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-dark-800'
                }`}
              >
                <ModelIcon className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? 'text-sky-500' : 'text-slate-400'}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-semibold">{model.name}</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-200/60 dark:bg-dark-800 text-slate-600 dark:text-slate-400">
                      {model.id === 'auto' ? model.badge : provider?.configured ? (provider.model || model.badge) : 'NOT CONFIGURED'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5 font-normal">
                    {model.id === 'auto' ? model.desc : provider?.configured ? model.desc : unavailableReason || `${model.desc} Provider is not ready.`}
                  </p>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-sky-500 shrink-0 mt-0.5" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ModelSelector;
