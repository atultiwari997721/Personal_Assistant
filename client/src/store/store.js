import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice.js';
import agentReducer from './agentSlice.js';
import sessionReducer from './sessionSlice.js';
import themeReducer from './themeSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    agent: agentReducer,
    session: sessionReducer,
    theme: themeReducer,
  },
});

store.subscribe(() => {
  try {
    localStorage.setItem('kritiai_sessions', JSON.stringify(store.getState().session.sessions));
  } catch (error) {
    console.warn('Could not save local chat history:', error?.message || error);
  }
});

export default store;
