import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  MessageSquare,
  Globe,
  Code2,
  FileText,
  Presentation,
  Image as ImageIcon,
  Plus,
  Trash2,
  Cpu,
  Layers,
  Sparkles,
} from 'lucide-react';
import { setActiveAgent, clearMessages } from '../store/agentSlice.js';
import { addSession, switchSession, deleteSession } from '../store/sessionSlice.js';

export const AGENT_MODES = [
  {
    id: 'chat',
    name: 'Chat Assistant',
    subtitle: 'Conversational QA',
    icon: MessageSquare,
    color: 'text-sky-400',
    bg: 'bg-sky-500/10 border-sky-500/20',
  },
  {
    id: 'search',
    name: 'Web Search & RAG',
    subtitle: 'Tavily & Qdrant',
    icon: Globe,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
  },
  {
    id: 'code',
    name: 'Code & Sandbox',
    subtitle: 'Full-Stack Studio',
    icon: Code2,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/20',
  },
  {
    id: 'pdf',
    name: 'PDF Documents',
    subtitle: 'Executive Reports',
    icon: FileText,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/20',
  },
  {
    id: 'ppt',
    name: 'PPT Presentations',
    subtitle: 'PowerPoint Decks',
    icon: Presentation,
    color: 'text-pink-400',
    bg: 'bg-pink-500/10 border-pink-500/20',
  },
  {
    id: 'image',
    name: 'Image Generator',
    subtitle: 'Visual Art & DALL-E',
    icon: ImageIcon,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10 border-indigo-500/20',
  },
];

export const Sidebar = () => {
  const dispatch = useDispatch();
  const { activeAgent, sidebarOpen } = useSelector((state) => state.agent);
  const { sessions, activeSessionId } = useSelector((state) => state.session);

  const handleAgentSelect = (agentId) => {
    dispatch(setActiveAgent(agentId));
  };

  const handleNewSession = () => {
    dispatch(addSession({ title: 'New Multi-Agent Session', agent: activeAgent }));
    dispatch(clearMessages());
  };

  if (!sidebarOpen) return null;

  return (
    <aside className="w-72 bg-dark-900 border-r border-dark-800 flex flex-col h-full shrink-0 select-none z-20">
      {/* Top Action: New Session */}
      <div className="p-3 border-b border-dark-800">
        <button
          onClick={handleNewSession}
          className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-md transition"
        >
          <Plus className="w-4 h-4" />
          <span>New AI Session</span>
        </button>
      </div>

      {/* Agents Selection List */}
      <div className="p-3 border-b border-dark-800">
        <div className="flex items-center gap-1.5 px-1 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          <Layers className="w-3.5 h-3.5 text-sky-400" />
          <span>Specialized Agents (6)</span>
        </div>
        <div className="space-y-1">
          {AGENT_MODES.map((mode) => {
            const Icon = mode.icon;
            const isSelected = activeAgent === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => handleAgentSelect(mode.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition border ${
                  isSelected
                    ? `${mode.bg} shadow-sm`
                    : 'border-transparent hover:bg-dark-800/80 text-slate-300'
                }`}
              >
                <div
                  className={`p-1.5 rounded-lg ${
                    isSelected ? mode.color : 'text-slate-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-xs font-semibold truncate ${
                      isSelected ? 'text-white' : 'text-slate-300'
                    }`}
                  >
                    {mode.name}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate">{mode.subtitle}</p>
                </div>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sessions History List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        <div className="flex items-center justify-between px-1 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span>Active Sessions</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">{sessions.length}</span>
        </div>

        {sessions.map((sess) => {
          const isActive = sess.id === activeSessionId;
          return (
            <div
              key={sess.id}
              onClick={() => dispatch(switchSession(sess.id))}
              className={`group flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer text-xs transition border ${
                isActive
                  ? 'bg-dark-800 border-dark-700 text-sky-300 font-medium'
                  : 'border-transparent hover:bg-dark-850 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <MessageSquare className="w-3.5 h-3.5 shrink-0 opacity-70" />
                <span className="truncate">{sess.title}</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(deleteSession(sess.id));
                }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-400 rounded transition"
                title="Delete session"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-dark-800 bg-dark-950/40 text-[11px] text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          <span>LangGraph v0.2</span>
        </div>
        <span className="text-[10px] text-slate-500">Qdrant • Redis</span>
      </div>
    </aside>
  );
};

export default Sidebar;
