import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MessageSquare, Globe, Code2, FileText, Presentation, Image as ImageIcon, Plus, Trash2, Cpu, Layers, Sparkles, Settings, PlugZap, Pin } from 'lucide-react';
import { setActiveAgent, toggleSidebar } from '../store/agentSlice.js';
import { deleteSession, setSessionAgent, toggleSessionPinned } from '../store/sessionSlice.js';

export const AGENT_MODES = [
  { id: 'chat', name: 'Chat Assistant', subtitle: 'Conversational QA', icon: MessageSquare, color: 'text-sky-500 dark:text-sky-400', bg: 'bg-sky-500/10 border-sky-500/30 text-sky-700 dark:text-sky-300' },
  { id: 'search', name: 'Web Search', subtitle: 'Live source search', icon: Globe, color: 'text-emerald-500 dark:text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300' },
  { id: 'code', name: 'Code & Sandbox', subtitle: 'Full-Stack Studio', icon: Code2, color: 'text-amber-500 dark:text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300' },
  { id: 'pdf', name: 'PDF Documents', subtitle: 'Executive Reports', icon: FileText, color: 'text-purple-500 dark:text-purple-400', bg: 'bg-purple-500/10 border-purple-500/30 text-purple-700 dark:text-purple-300' },
  { id: 'ppt', name: 'PPT Presentations', subtitle: 'PowerPoint Decks', icon: Presentation, color: 'text-pink-500 dark:text-pink-400', bg: 'bg-pink-500/10 border-pink-500/30 text-pink-700 dark:text-pink-300' },
  { id: 'image', name: 'Image Generator', subtitle: 'Visual Art & DALL-E', icon: ImageIcon, color: 'text-indigo-500 dark:text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-700 dark:text-indigo-300' },
];

const NAV_ITEMS = [
  { id: 'chats', label: 'Chats', icon: MessageSquare },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'api', label: 'API & Plugins', icon: PlugZap },
];

export const Sidebar = ({ section = 'workspace', onNavigate = () => {}, onNewSession = () => {}, onSelectSession = () => {} }) => {
  const dispatch = useDispatch();
  const { activeAgent, sidebarOpen } = useSelector((state) => state.agent);
  const { sessions, activeSessionId } = useSelector((state) => state.session);

  const selectNav = (id) => {
    onNavigate(id);
    if (window.matchMedia('(max-width: 767px)').matches) dispatch(toggleSidebar());
  };
  const selectAgent = (id) => {
    dispatch(setActiveAgent(id));
    dispatch(setSessionAgent({ sessionId: activeSessionId, agent: id }));
    if (window.matchMedia('(max-width: 767px)').matches) dispatch(toggleSidebar());
  };
  const orderedSessions = [...sessions].sort((a, b) => Number(b.pinned) - Number(a.pinned) || new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));

  if (!sidebarOpen) return null;

  return <>
    <button aria-label="Close navigation" className="mobile-sidebar-backdrop" style={{ zIndex: 40 }} onClick={() => dispatch(toggleSidebar())} />
    <aside className="app-sidebar w-72 bg-white dark:bg-dark-900 border-r border-slate-200 dark:border-dark-800 flex flex-col h-full shrink-0 select-none z-20 transition-colors" style={window.matchMedia('(max-width: 767px)').matches ? { zIndex: 50 } : undefined}>
      <div className="p-3 border-b border-slate-200 dark:border-dark-800">
        <button onClick={onNewSession} className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-md transition">
          <Plus className="w-4 h-4" /><span>New Chat</span>
        </button>
      </div>

      <nav aria-label="Main navigation" className="p-3 border-b border-slate-200 dark:border-dark-800 space-y-1">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => selectNav(id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm transition ${section === id ? 'bg-sky-500/10 text-sky-600 dark:text-sky-300 font-semibold' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-dark-800'}`}>
          <Icon className="w-4 h-4" /><span>{label}</span>
        </button>)}
      </nav>

      {section === 'workspace' && <>
        <div className="p-3 border-b border-slate-200 dark:border-dark-800">
          <div className="flex items-center gap-1.5 px-1 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"><Layers className="w-3.5 h-3.5 text-sky-500" /><span>Specialized Agents</span></div>
          <div className="space-y-1">{AGENT_MODES.map((mode) => {
            const Icon = mode.icon;
            const selected = activeAgent === mode.id;
            return <button key={mode.id} onClick={() => selectAgent(mode.id)} className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition border ${selected ? `${mode.bg} shadow-sm font-semibold` : 'border-transparent hover:bg-slate-100 dark:hover:bg-dark-800/80 text-slate-700 dark:text-slate-300'}`}>
              <div className={`p-1.5 rounded-lg ${selected ? mode.color : 'text-slate-400 dark:text-slate-500'}`}><Icon className="w-4 h-4" /></div>
              <div className="flex-1 min-w-0"><p className="text-xs truncate font-semibold">{mode.name}</p><p className="text-[10px] text-slate-400 truncate">{mode.subtitle}</p></div>
              {selected && <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />}
            </button>;
          })}</div>
        </div>
      </>}

      {section === 'chats' && <div className="flex-1 overflow-y-auto p-3">
        <div className="flex items-center justify-between px-1 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"><span>All chats</span><span>{sessions.length}</span></div>
        <div className="space-y-1">{orderedSessions.map((session) => <div key={session.id} onClick={() => onSelectSession(session.id)} className={`group flex items-center gap-2 px-2 py-2 rounded-xl cursor-pointer text-xs border ${session.id === activeSessionId ? 'bg-slate-100 dark:bg-dark-800 border-slate-300 dark:border-dark-700 text-sky-600 dark:text-sky-300' : 'border-transparent hover:bg-slate-100 dark:hover:bg-dark-800 text-slate-600 dark:text-slate-400'}`}>
          <MessageSquare className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate flex-1">{session.title || 'New Chat'}</span>
          <button aria-label={session.pinned ? 'Unpin chat' : 'Pin chat'} title={session.pinned ? 'Unpin chat' : 'Pin chat'} onClick={(event) => { event.stopPropagation(); dispatch(toggleSessionPinned(session.id)); }} className={`p-1 rounded hover:text-sky-500 ${session.pinned ? 'text-sky-500' : 'opacity-0 group-hover:opacity-100'}`}><Pin className="w-3.5 h-3.5" /></button>
          <button aria-label="Delete chat" title="Delete chat" onClick={(event) => { event.stopPropagation(); dispatch(deleteSession(session.id)); }} className="p-1 rounded opacity-0 group-hover:opacity-100 hover:text-rose-500"><Trash2 className="w-3.5 h-3.5" /></button>
        </div>)}</div>
      </div>}

      {section === 'settings' && <div className="p-4 text-xs leading-relaxed text-slate-500 dark:text-slate-400">Personal appearance, behavior, and model preferences.</div>}
      {section === 'api' && <div className="p-4 text-xs leading-relaxed text-slate-500 dark:text-slate-400">Connect model providers and productivity integrations.</div>}

      <div className="mt-auto p-3 border-t border-slate-200 dark:border-dark-800 bg-slate-50/60 dark:bg-dark-950/40 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-indigo-500" /><span>Local-first</span></div><Sparkles className="w-3.5 h-3.5 text-sky-500" />
      </div>
    </aside>
  </>;
};

export default Sidebar;
