import { createSlice } from '@reduxjs/toolkit';

export const AVAILABLE_MODELS = [
  { id: 'auto', name: 'Automatic', badge: 'AUTO', desc: 'Use the first configured provider or LLM_PROVIDER preference.' },
  { id: 'openai', name: 'OpenAI', badge: 'PROVIDER', desc: 'Uses OPENAI_API_KEY and OPENAI_MODEL on the agent service.' },
  { id: 'xai', name: 'xAI (Grok)', badge: 'PROVIDER', desc: 'Uses your Grok API key and model ID.' },
  { id: 'gemini', name: 'Google Gemini', badge: 'PROVIDER', desc: 'Uses GEMINI_API_KEY and GEMINI_MODEL on the agent service.' },
  { id: 'nvidia', name: 'NVIDIA NIM', badge: 'PROVIDER', desc: 'Uses NVIDIA_API_KEY and NVIDIA_MODEL on the agent service.' },
  { id: 'groq', name: 'Groq', badge: 'PROVIDER', desc: 'Uses GROQ_API_KEY and GROQ_MODEL on the agent service.' },
  { id: 'huggingface', name: 'Hugging Face', badge: 'PROVIDER', desc: 'Uses HF_TOKEN and HF_MODEL on the agent service.' },
  { id: 'openrouter', name: 'OpenRouter', badge: 'PROVIDER', desc: 'Uses OPENROUTER_API_KEY and OPENROUTER_MODEL on the agent service.' },
  { id: 'ollama', name: 'Ollama (Local)', badge: 'LOCAL', desc: 'Uses OLLAMA_MODEL and the configured Ollama endpoint.' },
];

const legacyProvider = {
  'gpt-4o-mini': 'openai',
  'claude-3-5-sonnet': 'openrouter',
  'gemini-2-flash': 'gemini',
  'nvidia-nemotron': 'nvidia',
  'nvidia-mistral-nemo': 'nvidia',
  'deepseek-r1': 'openrouter',
  'qwen-coder': 'ollama',
  'phi-4': 'ollama',
  'llama-3': 'ollama',
  'cortex-cognitive': 'ollama',
};

const storedModel = localStorage.getItem('cortex_selected_model') || 'auto';
const initialModel = legacyProvider[storedModel] || storedModel;

const initialMessages = [
  {
    id: 'welcome-msg',
    role: 'assistant',
    agent: 'chat',
    content: `### Welcome to KritiAI\n\nChoose a configured provider above and send a request to use its model. Provider credentials and model IDs are configured on the agent service; KritiAI does not include a free fallback model.\n\nAvailable workflows use the selected model to answer questions, prepare code for preview, draft documents, or structure presentations. Search requires live results from configured search sources. Image generation, local computer control, Gmail, Calendar, and Drive are not connected in this build, so KritiAI will report when a capability needs configuration.`,
    timestamp: new Date().toISOString(),
  }
];
const agentSlice = createSlice({
  name: 'agent',
  initialState: {
    activeAgent: 'chat', // 'chat' | 'search' | 'code' | 'pdf' | 'ppt' | 'image'
    selectedModel: initialModel,
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
        localStorage.setItem('kritiai_default_provider', action.payload);
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
