import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Coins,
  Sparkles,
  Menu,
  Zap,
  ExternalLink,
  ShieldCheck,
  User as UserIcon,
  Sun,
  Moon,
} from 'lucide-react';
import { setCreditModalOpen } from '../store/authSlice.js';
import { toggleSidebar } from '../store/agentSlice.js';
import { toggleTheme } from '../store/themeSlice.js';
import ModelSelector from './ModelSelector.jsx';

export const Navbar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { activeAgent } = useSelector((state) => state.agent);
  const { theme } = useSelector((state) => state.theme);

  const getAgentLabel = () => {
    switch (activeAgent) {
      case 'search': return 'Live Web Search (RAG)';
      case 'code': return 'Code & Sandbox Studio';
      case 'pdf': return 'PDF Document Engine';
      case 'ppt': return 'Presentation PPT Engine';
      case 'image': return 'Visual Art Generator';
      default: return 'Conversational Intelligence';
    }
  };

  return (
    <header className="h-16 border-b border-slate-200 dark:border-dark-800 bg-white/90 dark:bg-dark-900/90 backdrop-blur-md px-4 flex items-center justify-between z-30 shrink-0 transition-colors">
      <div className="flex items-center gap-3">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-dark-800 transition"
          title="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-500 flex items-center justify-center cortex-glow">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-lg cortex-gradient-text">CORTEX</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                Multi-Agent SaaS
              </span>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center ml-4 pl-4 border-l border-slate-200 dark:border-dark-800 gap-2.5">
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-dark-850 px-3 py-1.5 rounded-full border border-slate-200 dark:border-dark-700/60 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium text-slate-700 dark:text-slate-300">Mode: {getAgentLabel()}</span>
          </div>
          <ModelSelector />
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <div className="md:hidden">
          <ModelSelector />
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={() => dispatch(toggleTheme())}
          className="p-2 rounded-xl border border-slate-200 dark:border-dark-700 bg-slate-100 hover:bg-slate-200 dark:bg-dark-850 dark:hover:bg-dark-800 text-slate-600 dark:text-slate-300 shadow-sm transition flex items-center justify-center"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400 animate-pulse" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-600" />
          )}
        </button>

        {/* Credit Badge & Recharge Button */}
        <div className="flex items-center bg-slate-100 dark:bg-dark-850 border border-slate-200 dark:border-dark-700 rounded-full p-1 pl-3 gap-2.5 shadow-sm">
          <div className="flex items-center gap-1.5">
            <Coins className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              {user?.credits ?? 0}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">credits</span>
          </div>

          <button
            onClick={() => dispatch(setCreditModalOpen(true))}
            className="flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-sm transition"
          >
            <Zap className="w-3 h-3 fill-current" />
            <span>Recharge</span>
          </button>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2 pl-2">
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-8 h-8 rounded-full border border-slate-200 dark:border-dark-700 bg-slate-100 dark:bg-dark-800"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-dark-800 border border-slate-200 dark:border-dark-700 flex items-center justify-center text-slate-500 dark:text-slate-300">
              <UserIcon className="w-4 h-4" />
            </div>
          )}
          <div className="hidden lg:block text-left">
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[120px]">{user?.name || 'Developer'}</p>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
              <ShieldCheck className="w-3 h-3" /> Pro Tier
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
