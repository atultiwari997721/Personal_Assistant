import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Sparkles,
  Brain,
  Cpu,
  Zap,
  Code,
  Bot,
  ChevronDown,
  Check,
  Shield,
  Flame,
  Compass,
  Atom,
} from 'lucide-react';
import { AVAILABLE_MODELS, setSelectedModel } from '../store/agentSlice.js';

const MODEL_ICONS = {
  'auto': Sparkles,
  'cortex-cognitive': Brain,
  'nvidia-nemotron': Shield,
  'nvidia-mistral-nemo': Flame,
  'deepseek-r1': Cpu,
  'gpt-4o-mini': Zap,
  'claude-3-5-sonnet': Compass,
  'gemini-2-flash': Atom,
  'qwen-coder': Code,
  'phi-4': Cpu,
  'llama-3': Bot,
};

export const ModelSelector = () => {
  const dispatch = useDispatch();
  const { selectedModel } = useSelector((state) => state.agent);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const currentModel = AVAILABLE_MODELS.find((m) => m.id === selectedModel) || AVAILABLE_MODELS[0];
  const Icon = MODEL_ICONS[currentModel.id] || Sparkles;

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
        title="Select AI Model or Reasoning Engine"
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
            Available AI Models & Engines (11)
          </div>
          {AVAILABLE_MODELS.map((model) => {
            const ModelIcon = MODEL_ICONS[model.id] || Sparkles;
            const isSelected = selectedModel === model.id;
            return (
              <button
                key={model.id}
                onClick={() => {
                  dispatch(setSelectedModel(model.id));
                  setIsOpen(false);
                }}
                className={`w-full flex items-start gap-2.5 px-3 py-2 rounded-xl text-left text-xs transition ${
                  isSelected
                    ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400 font-semibold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-dark-800'
                }`}
              >
                <ModelIcon className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? 'text-sky-500' : 'text-slate-400'}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-semibold">{model.name}</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-200/60 dark:bg-dark-800 text-slate-600 dark:text-slate-400">
                      {model.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5 font-normal">
                    {model.desc}
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
