import { createSlice } from '@reduxjs/toolkit';

const initialMessages = [
  {
    id: 'welcome-msg',
    role: 'assistant',
    agent: 'chat',
    content: `### Welcome to Cortex Multi-Agent AI Platform 🚀\n\nI am your unified multi-agent orchestrator. I can coordinate across **6 specialized agents**:\n- **Conversational Chat**: Interactive QA & technical synthesis.\n- **Live Web Search**: Tavily real-time intelligence & Qdrant RAG.\n- **Code Sandbox**: Production code generation with an interactive split-screen iframe preview.\n- **PDF Document Generator**: Clean reports with instant PDF export.\n- **Presentation (PPT) Decks**: JSON slide generation and native \`.pptx\` download.\n- **Image Generator**: Visual prompt engineering & high-res rendering.\n\nSelect an agent from the sidebar or tab bar above and type your prompt to get started!`,
    timestamp: new Date().toISOString(),
  }
];

const agentSlice = createSlice({
  name: 'agent',
  initialState: {
    activeAgent: 'chat', // 'chat' | 'search' | 'code' | 'pdf' | 'ppt' | 'image'
    messages: initialMessages,
    isLoading: false,
    activeArtifact: null, // Holds latest artifact (code, slides, docMarkdown, image)
    sidebarOpen: true,
  },
  reducers: {
    setActiveAgent: (state, action) => {
      state.activeAgent = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push({
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        ...action.payload,
      });
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setActiveArtifact: (state, action) => {
      state.activeArtifact = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    clearMessages: (state) => {
      state.messages = [initialMessages[0]];
      state.activeArtifact = null;
    },
  },
});

export const {
  setActiveAgent,
  addMessage,
  setLoading,
  setActiveArtifact,
  toggleSidebar,
  clearMessages,
} = agentSlice.actions;

export default agentSlice.reducer;
