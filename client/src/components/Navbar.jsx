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
} from 'lucide-react';
import { setCreditModalOpen } from '../store/authSlice.js';
import { toggleSidebar } from '../store/agentSlice.js';

export const Navbar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { activeAgent } = useSelector((state) => state.agent);

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
    <header className="h-16 border-b border-dark-800 bg-dark-900/90 backdrop-blur-md px-4 flex items-center justify-between z-30 shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-dark-800 transition"
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
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                Multi-Agent SaaS
              </span>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center ml-4 pl-4 border-l border-dark-800">
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-dark-850 px-3 py-1.5 rounded-full border border-dark-700/60">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-300 font-medium">Mode: {getAgentLabel()}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Credit Badge & Recharge Button */}
        <div className="flex items-center bg-dark-850 border border-dark-700 rounded-full p-1 pl-3 gap-2.5 shadow-inner">
          <div className="flex items-center gap-1.5">
            <Coins className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold text-slate-200">
              {user?.credits ?? 0}
            </span>
            <span className="text-[11px] text-slate-400">credits</span>
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
              className="w-8 h-8 rounded-full border border-dark-700 bg-dark-800"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-dark-800 border border-dark-700 flex items-center justify-center text-slate-300">
              <UserIcon className="w-4 h-4" />
            </div>
          )}
          <div className="hidden lg:block text-left">
            <p className="text-xs font-semibold text-slate-200 truncate max-w-[120px]">{user?.name || 'Developer'}</p>
            <p className="text-[10px] text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Pro Tier
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
