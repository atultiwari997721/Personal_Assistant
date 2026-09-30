import { createSlice } from '@reduxjs/toolkit';

const welcomeMessage = () => ({
  id: 'welcome-msg',
  role: 'assistant',
  agent: 'chat',
  content: 'Welcome to KritiAI. Choose a model above and ask a question, or switch to Code & Sandbox to build something.',
  timestamp: new Date().toISOString(),
});

const createSession = (agent = 'chat', title = 'New Chat') => ({
  id: `sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
  title,
  agent,
  pinned: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  messages: [welcomeMessage()],
  artifact: null,
});

const loadSessions = () => {
  try {
    const stored = JSON.parse(localStorage.getItem('kritiai_sessions') || 'null');
    if (Array.isArray(stored) && stored.length) {
      return stored.map((session) => ({
        ...createSession(session.agent || 'chat', session.title || 'Chat'),
        ...session,
        messages: Array.isArray(session.messages) && session.messages.length ? session.messages : [welcomeMessage()],
        pinned: Boolean(session.pinned),
      }));
    }
  } catch {}
  return [createSession('chat', 'New Chat')];
};

const sessions = loadSessions();
const sessionSlice = createSlice({
  name: 'session',
  initialState: { sessions, activeSessionId: sessions[0].id },
  reducers: {
    addSession: (state, action) => {
      const session = createSession(action.payload?.agent || 'chat', action.payload?.title || 'New Chat');
      state.sessions.unshift(session);
      state.activeSessionId = session.id;
    },
    switchSession: (state, action) => { state.activeSessionId = action.payload; },
    setSessionAgent: (state, action) => {
      const session = state.sessions.find((item) => item.id === action.payload.sessionId);
      if (session) session.agent = action.payload.agent;
    },
    deleteSession: (state, action) => {
      state.sessions = state.sessions.filter((session) => session.id !== action.payload);
      if (!state.sessions.length) state.sessions.push(createSession());
      if (state.activeSessionId === action.payload) state.activeSessionId = state.sessions[0].id;
    },
    toggleSessionPinned: (state, action) => {
      const session = state.sessions.find((item) => item.id === action.payload);
      if (session) session.pinned = !session.pinned;
    },
    appendSessionMessage: (state, action) => {
      const session = state.sessions.find((item) => item.id === action.payload.sessionId);
      if (!session) return;
      const message = action.payload.message;
      session.messages.push({
        id: message.id || `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        timestamp: message.timestamp || new Date().toISOString(),
        ...message,
      });
      session.updatedAt = new Date().toISOString();
      if (message.role === 'user' && (session.title === 'New Chat' || !session.title)) {
        session.title = String(message.content).slice(0, 48) || 'New Chat';
      }
      if (message.data?.sandboxCode) session.artifact = { type: 'code', code: message.data.sandboxCode };
      if (message.data?.slides) session.artifact = { type: 'ppt', slides: message.data.slides };
      if (message.data?.documentMarkdown) session.artifact = { type: 'pdf', markdown: message.data.documentMarkdown };
      if (message.data?.imageUrl) session.artifact = { type: 'image', ...message.data };
    },
  },
});

export const { addSession, switchSession, setSessionAgent, deleteSession, toggleSessionPinned, appendSessionMessage } = sessionSlice.actions;
export default sessionSlice.reducer;
