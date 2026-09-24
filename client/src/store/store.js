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

export default store;
