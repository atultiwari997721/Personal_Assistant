import { createSlice } from '@reduxjs/toolkit';

export const AVAILABLE_MODELS = [
  {
    id: 'auto',
    name: 'Auto Ensemble AI',
    badge: 'Multi-API',
    desc: 'Simultaneous parallel search APIs + cognitive synthesis',
  },
  {
    id: 'cortex-cognitive',
    name: 'Cortex Cognitive Brain',
    badge: 'Zero-Latency',
    desc: 'Local deep math, algorithms & architectural reasoning',
  },
  {
    id: 'deepseek-r1',
    name: 'DeepSeek-R1 (Reasoning)',
    badge: 'Free Web AI',
    desc: 'Deep step-by-step chain-of-thought logic',
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini (OpenAI)',
    badge: 'Free Web AI',
    desc: 'Fast, comprehensive cloud intelligence',
  },
  {
    id: 'qwen-coder',
    name: 'Qwen 2.5 Coder',
    badge: 'Code AI',
    desc: 'Specialized programming, debugging & syntax',
  },
  {
    id: 'llama-3',
    name: 'Llama 3.3 70B',
    badge: 'Meta AI',
    desc: 'Broad encyclopedic knowledge & research',
  },
];

const initialMessages = [
  {
    id: 'welcome-msg',
    role: 'assistant',
    agent: 'chat',
    content: `### Welcome to Cortex Multi-Agent AI Platform 🚀\n\nI am your unified multi-agent orchestrator. I can coordinate across **6 specialized agents** powered by **Multi-API Simultaneous Search** and **Free AI Models**:\n- **Conversational Chat**: Interactive QA & technical synthesis.\n- **Live Web Search & RAG**: Real-time Wikipedia, Hacker News, GitHub & Qdrant vector retrieval.\n- **Code Sandbox**: Production code generation with an interactive split-screen iframe preview.\n- **PDF Document Generator**: Clean reports with instant PDF export.\n- **Presentation (PPT) Decks**: JSON slide generation and native \`.pptx\` download.\n- **Image Generator**: Visual prompt engineering & high-res rendering.\n\nSelect an agent or choose your preferred **AI Model** in the selector above to begin!`,
    timestamp: new Date().toISOString(),
  }
];

const agentSlice = createSlice({
  name: 'agent',
  initialState: {
    activeAgent: 'chat', // 'chat' | 'search' | 'code' | 'pdf' | 'ppt' | 'image'
    selectedModel: localStorage.getItem('cortex_selected_model') || 'auto',
    messages: initialMessages,
    isLoading: false,
    activeArtifact: null, // Holds latest artifact (code, slides, docMarkdown, image)
    sidebarOpen: true,
  },
  reducers: {
    setActiveAgent: (state, action) => {
      state.activeAgent = action.payload;
    },
    setSelectedModel: (state, action) => {
      state.selectedModel = action.payload;
      try {
        localStorage.setItem('cortex_selected_model', action.payload);
      } catch (e) {}
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
  setSelectedModel,
  addMessage,
  setLoading,
  setActiveArtifact,
  toggleSidebar,
  clearMessages,
} = agentSlice.actions;

export default agentSlice.reducer;
