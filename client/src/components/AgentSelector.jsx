import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveAgent } from '../store/agentSlice.js';
import { AGENT_MODES } from './Sidebar.jsx';

export const AgentSelector = () => {
  const dispatch = useDispatch();
  const { activeAgent } = useSelector((state) => state.agent);

  return (
    <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 dark:bg-dark-900 border border-slate-200 dark:border-dark-800 rounded-2xl overflow-x-auto max-w-fit shadow-sm transition-colors">
      {AGENT_MODES.map((mode) => {
        const Icon = mode.icon;
        const isSelected = activeAgent === mode.id;
        return (
          <button
            key={mode.id}
            onClick={() => dispatch(setActiveAgent(mode.id))}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              isSelected
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-dark-800'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{mode.name}</span>
          </button>
        );
      })}
    </div>
  );
};

export default AgentSelector;
