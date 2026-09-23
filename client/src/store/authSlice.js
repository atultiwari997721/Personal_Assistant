import { createSlice } from '@reduxjs/toolkit';

const initialToken = localStorage.getItem('cortex_token');
const initialUser = localStorage.getItem('cortex_user')
  ? JSON.parse(localStorage.getItem('cortex_user'))
  : {
      uid: 'demo-user-123',
      name: 'Demo Architect',
      email: 'demo@cortexai.dev',
      avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Architect',
      credits: 20,
    };

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: initialUser,
    token: initialToken || 'demo_active_token',
    isAuthenticated: true,
    isCreditModalOpen: false,
  },
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      localStorage.setItem('cortex_token', token);
      localStorage.setItem('cortex_user', JSON.stringify(user));
    },
    updateCredits: (state, action) => {
      if (state.user) {
        state.user.credits = action.payload;
        localStorage.setItem('cortex_user', JSON.stringify(state.user));
      }
    },
    deductCredit: (state, action) => {
      const amount = action.payload || 1;
      if (state.user && state.user.credits >= amount) {
        state.user.credits -= amount;
        localStorage.setItem('cortex_user', JSON.stringify(state.user));
      }
    },
    setCreditModalOpen: (state, action) => {
      state.isCreditModalOpen = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('cortex_token');
      localStorage.removeItem('cortex_user');
    },
  },
});

export const { setCredentials, updateCredits, deductCredit, setCreditModalOpen, logout } = authSlice.actions;
export default authSlice.reducer;
