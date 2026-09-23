import { createSlice } from '@reduxjs/toolkit';

const initialSessions = [
  {
    id: 'sess-default',
    title: 'Platform Architecture & Overview',
    agent: 'chat',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sess-code-demo',
    title: 'Interactive React Sandbox',
    agent: 'code',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'sess-ppt-demo',
    title: 'Cloud Scaling Slide Deck',
    agent: 'ppt',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  }
];

const sessionSlice = createSlice({
  name: 'session',
  initialState: {
    sessions: initialSessions,
    activeSessionId: 'sess-default',
  },
  reducers: {
    addSession: (state, action) => {
      const newSess = {
        id: `sess_${Date.now()}`,
        title: action.payload.title || 'New Session',
        agent: action.payload.agent || 'chat',
        createdAt: new Date().toISOString(),
      };
      state.sessions.unshift(newSess);
      state.activeSessionId = newSess.id;
    },
    switchSession: (state, action) => {
      state.activeSessionId = action.payload;
    },
    deleteSession: (state, action) => {
      state.sessions = state.sessions.filter((s) => s.id !== action.payload);
      if (state.activeSessionId === action.payload && state.sessions.length > 0) {
        state.activeSessionId = state.sessions[0].id;
      }
    },
  },
});

export const { addSession, switchSession, deleteSession } = sessionSlice.actions;
export default sessionSlice.reducer;
