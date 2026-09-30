import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Moon, Sun, Type, CornerDownLeft, Check } from 'lucide-react';
import { setTheme } from '../store/themeSlice.js';
import { setSelectedModel } from '../store/agentSlice.js';
import { AVAILABLE_MODELS } from '../store/agentSlice.js';

const readFlag = (key, fallback) => localStorage.getItem(key) === null ? fallback : localStorage.getItem(key) === 'true';

export default function SettingsPage() {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);
  const { selectedModel } = useSelector((state) => state.agent);
  const [compact, setCompact] = useState(() => readFlag('kritiai_compact', false));
  const [enterToSend, setEnterToSend] = useState(() => readFlag('kritiai_enter_to_send', true));

  const toggle = (key, value, setter) => {
    setter(value);
    localStorage.setItem(key, String(value));
  };

  return <div className="h-full overflow-y-auto p-5 md:p-8">
    <div className="max-w-3xl mx-auto space-y-6">
      <header><p className="text-xs uppercase tracking-widest text-sky-500 font-bold">Personalize</p><h1 className="text-2xl font-bold mt-1">Settings</h1><p className="text-sm text-slate-500 dark:text-slate-400 mt-1">These preferences are saved in this browser.</p></header>

      <section className="rounded-2xl border border-slate-200 dark:border-dark-700 bg-white dark:bg-dark-900 p-5">
        <h2 className="font-semibold mb-4">Appearance</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {[['dark', 'Dark', Moon], ['light', 'Light', Sun]].map(([value, label, Icon]) => <button key={value} onClick={() => dispatch(setTheme(value))} className={`flex items-center gap-3 p-4 rounded-xl border text-left ${theme === value ? 'border-sky-500 bg-sky-500/10' : 'border-slate-200 dark:border-dark-700 hover:bg-slate-50 dark:hover:bg-dark-850'}`}>
            <Icon className="w-5 h-5 text-sky-500" /><span className="font-medium flex-1">{label} theme</span>{theme === value && <Check className="w-4 h-4 text-sky-500" />}
          </button>)}
        </div>
        <label className="mt-4 flex items-center justify-between gap-4 py-3 border-t border-slate-100 dark:border-dark-800 cursor-pointer"><span className="flex items-center gap-3"><Type className="w-4 h-4 text-slate-400" /><span><b className="block text-sm">Compact chat</b><small className="text-slate-500">Fit more messages on screen</small></span></span><input type="checkbox" checked={compact} onChange={(event) => toggle('kritiai_compact', event.target.checked, setCompact)} /></label>
      </section>

      <section className="rounded-2xl border border-slate-200 dark:border-dark-700 bg-white dark:bg-dark-900 p-5">
        <h2 className="font-semibold mb-1">Chat behavior</h2><p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Choose how messages are sent.</p>
        <label className="flex items-center justify-between gap-4 py-3 cursor-pointer"><span className="flex items-center gap-3"><CornerDownLeft className="w-4 h-4 text-slate-400" /><span><b className="block text-sm">Enter sends message</b><small className="text-slate-500">Turn off to use Enter for a new line</small></span></span><input type="checkbox" checked={enterToSend} onChange={(event) => toggle('kritiai_enter_to_send', event.target.checked, setEnterToSend)} /></label>
      </section>

      <section className="rounded-2xl border border-slate-200 dark:border-dark-700 bg-white dark:bg-dark-900 p-5">
        <h2 className="font-semibold mb-1">Default AI model</h2><p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Used in Chat and all agent tools.</p>
        <select aria-label="Default AI model" value={selectedModel} onChange={(event) => { dispatch(setSelectedModel(event.target.value)); localStorage.setItem('kritiai_default_provider', event.target.value); }} className="w-full sm:max-w-md rounded-xl border border-slate-300 dark:border-dark-700 bg-slate-50 dark:bg-dark-850 px-3 py-2.5 text-sm">
          {AVAILABLE_MODELS.map((model) => <option key={model.id} value={model.id}>{model.name}</option>)}
        </select>
        <p className="mt-2 text-xs text-slate-500">Add provider credentials in API &amp; Plugins to enable cloud models. Automatic uses configured server providers or your saved default.</p>
      </section>
    </div>
  </div>;
}
