import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';
import AgentSelector from './components/AgentSelector.jsx';
import ChatView from './components/ChatView.jsx';
import CodeSandboxView from './components/CodeSandboxView.jsx';
import PresentationView from './components/PresentationView.jsx';
import DocumentView from './components/DocumentView.jsx';
import ImageGalleryView from './components/ImageGalleryView.jsx';
import CreditModal from './components/CreditModal.jsx';
import {
  setLoading,
  toggleSidebar,
} from './store/agentSlice.js';
import { updateCredits, setCreditModalOpen, setCredentials } from './store/authSlice.js';
import api from './services/api.js';
import SettingsPage from './components/SettingsPage.jsx';
import ApiPluginsPage from './components/ApiPluginsPage.jsx';
import { appendSessionMessage, addSession, switchSession } from './store/sessionSlice.js';
import { getSavedProviderConfig, getImageProviderConfig } from './services/providerSettings.js';
import { createPluginDraft, getEnabledIntegrations, getPluginConfigs } from './services/pluginActions.js';

export const App = () => {
  const dispatch = useDispatch();
  const { activeAgent, selectedModel, isLoading } = useSelector(
    (state) => state.agent
  );
  const { sessions, activeSessionId } = useSelector((state) => state.session);
  const activeSession = useMemo(() => sessions.find((session) => session.id === activeSessionId) || sessions[0], [sessions, activeSessionId]);
  const messages = activeSession?.messages || [];
  const activeArtifact = activeSession?.artifact || null;
  const [section, setSection] = useState('workspace');

  useEffect(() => {
    if (window.matchMedia('(max-width: 767px)').matches) dispatch(toggleSidebar());
  }, [dispatch]);

  useEffect(() => {
    if (activeSession?.agent && activeSession.agent !== activeAgent) dispatch({ type: 'agent/setActiveAgent', payload: activeSession.agent });
  }, [activeSession?.agent, activeAgent, dispatch]);

  // Initialize and synchronize authentication session on startup
  useEffect(() => {
    const initializeAuthSession = async () => {
      try {
        const storedToken = localStorage.getItem('cortex_token');
        if (!storedToken || storedToken === 'demo_active_token') {
          const res = await api.post('/auth/mock-login');
          if (res.data?.success) {
            dispatch(setCredentials({ user: res.data.user, token: res.data.token }));
          }
        } else {
          // Verify and sync credit balance
          const meRes = await api.get('/auth/me');
          if (meRes.data?.user) {
            dispatch(updateCredits(meRes.data.user.credits));
          }
        }
      } catch (err) {
        console.warn('Auto-session initialization fallback active:', err.message);
      }
    };

    initializeAuthSession();
  }, [dispatch]);

  // Listen to custom insufficient credit event
  useEffect(() => {
    const handleCreditError = () => {
      dispatch(setCreditModalOpen(true));
    };
    window.addEventListener('cortex:open-credit-modal', handleCreditError);
    return () => window.removeEventListener('cortex:open-credit-modal', handleCreditError);
  }, [dispatch]);

  // Execute Agent task via API Gateway
  const handleExecuteAgent = async (prompt) => {
    const sessionId = activeSession?.id;
    if (!sessionId) return;
    const pluginDraft = activeAgent === 'chat' ? createPluginDraft(prompt) : null;
    // Optimistic user message in chat
    dispatch(
      appendSessionMessage({ sessionId, message: { role: 'user', agent: activeAgent, content: prompt, ...(pluginDraft ? { data: { pluginDraft } } : {}) } })
    );

    dispatch(setLoading(true));

    try {
      const response = await api.post('/agents/execute', {
        prompt,
        agentMode: activeAgent,
        model: selectedModel || 'auto',
        providerConfig: getSavedProviderConfig(selectedModel),
        imageProviderConfig: activeAgent === 'image' ? getImageProviderConfig() : undefined,
        connectedPlugins: getEnabledIntegrations(),
        messages: messages.filter((m) => m.role === 'user' || m.role === 'assistant').map((m) => ({ role: m.role, content: m.content })),
      });

      const { data, remainingCredits } = response.data;
      if (!data?.content) {
        const error = new Error('The agent returned no result.');
        error.code = 'AGENT_EMPTY_RESPONSE';
        throw error;
      }

      // Update remaining credit balance from API Gateway
      if (remainingCredits !== null && remainingCredits !== undefined) {
        dispatch(updateCredits(remainingCredits));
      }

      // Add assistant response
      dispatch(
        appendSessionMessage({ sessionId, message: { role: 'assistant', agent: data.agent || activeAgent, content: data.content, data } })
      );
      return data;

    } catch (err) {
      console.error('Agent execution error:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Agent execution failed.';
      dispatch(
        appendSessionMessage({ sessionId, message: { role: 'assistant', agent: activeAgent, content: `⚠️ **Execution Error:** ${errorMsg}` } })
      );
      return { error: errorMsg };
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handlePluginAction = async (draft) => {
    const response = await api.post('/agents/plugins/action', {
      type: draft.type,
      payload: draft,
      pluginConfig: getPluginConfigs(),
    });
    return response.data;
  };

  const handleNewSession = () => {
    dispatch(addSession({ agent: 'chat', title: 'New Chat' }));
    dispatch({ type: 'agent/setActiveAgent', payload: 'chat' });
    setSection('workspace');
  };

  const handleSelectSession = (sessionId) => {
    dispatch(switchSession(sessionId));
    setSection('workspace');
  };

  // Render view corresponding to selected agent
  const renderWorkspaceView = () => {
    switch (activeAgent) {
      case 'code':
        return (
          <CodeSandboxView
            artifactCode={activeArtifact?.type === 'code' ? activeArtifact.code : null}
            onRunAgentPrompt={handleExecuteAgent}
            isLoading={isLoading}
            selectedModel={selectedModel}
          />
        );
      case 'ppt':
        return (
          <PresentationView
            slides={activeArtifact?.type === 'ppt' ? activeArtifact.slides : null}
            onRunAgentPrompt={handleExecuteAgent}
            isLoading={isLoading}
          />
        );
      case 'pdf':
        return (
          <DocumentView
            docMarkdown={activeArtifact?.type === 'pdf' ? activeArtifact.markdown : null}
            onRunAgentPrompt={handleExecuteAgent}
            isLoading={isLoading}
          />
        );
      case 'image':
        return (
          <ImageGalleryView
            newImage={activeArtifact?.type === 'image' ? activeArtifact : null}
            onRunAgentPrompt={handleExecuteAgent}
            isLoading={isLoading}
          />
        );
      case 'chat':
      case 'search':
      default:
        return (
          <ChatView
            messages={messages}
            isLoading={isLoading}
            onSendMessage={handleExecuteAgent}
            onPluginAction={handlePluginAction}
            onNavigate={setSection}
          />
        );
    }
  };

  return (
    <div className="app-shell flex flex-col h-screen w-screen overflow-hidden bg-slate-50 dark:bg-dark-950 text-slate-800 dark:text-slate-100 font-sans transition-colors">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Body Area */}
      <div className="flex flex-1 min-h-0 overflow-hidden relative">
        {/* Left Sidebar */}
        <Sidebar
          section={section}
          onNavigate={setSection}
          onNewSession={handleNewSession}
          onSelectSession={handleSelectSession}
        />

        {/* Dynamic Workspace Container */}
        <main className="flex-1 flex flex-col h-full overflow-hidden bg-slate-100/60 dark:bg-dark-900/40 relative">
          {/* Quick Agent Mode Pill Selector */}
          <div className="px-4 py-2.5 border-b border-slate-200 dark:border-dark-800 bg-white/70 dark:bg-dark-950/60 flex items-center justify-between z-10">
            <AgentSelector />
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="w-2 h-2 rounded-full bg-sky-500 dark:bg-sky-400"></span>
              <span>1 credit per query</span>
            </div>
          </div>

          {/* Active Workspace View */}
          <div className="flex-1 overflow-hidden">
            {section === 'settings' ? <SettingsPage /> : section === 'api' ? <ApiPluginsPage /> : renderWorkspaceView()}
          </div>
        </main>
      </div>

      {/* Razorpay Token Upgrade Modal */}
      <CreditModal />
    </div>
  );
};

export default App;
