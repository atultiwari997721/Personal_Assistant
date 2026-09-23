import { StateGraph, END, START } from '@langchain/langgraph';
import { runChatAgent } from '../agents/chatAgent.js';
import { runSearchAgent } from '../agents/searchAgent.js';
import { runCodeAgent } from '../agents/codeAgent.js';
import { runPdfAgent } from '../agents/pdfAgent.js';
import { runPptAgent } from '../agents/pptAgent.js';
import { runImageAgent } from '../agents/imageAgent.js';

// Router Node: detects mode or uses explicit mode
const routerNode = async (state) => {
  let mode = state.agentMode;

  // Auto-intent classification if mode is set to 'auto' or unspecified
  if (!mode || mode === 'auto') {
    const prompt = (state.userPrompt || '').toLowerCase();
    if (prompt.includes('slide') || prompt.includes('presentation') || prompt.includes('ppt') || prompt.includes('pitch')) {
      mode = 'ppt';
    } else if (prompt.includes('code') || prompt.includes('function') || prompt.includes('bug') || prompt.includes('component') || prompt.includes('html')) {
      mode = 'code';
    } else if (prompt.includes('search') || prompt.includes('latest') || prompt.includes('news') || prompt.includes('who is') || prompt.includes('price')) {
      mode = 'search';
    } else if (prompt.includes('pdf') || prompt.includes('document') || prompt.includes('report') || prompt.includes('brief')) {
      mode = 'pdf';
    } else if (prompt.includes('image') || prompt.includes('generate photo') || prompt.includes('draw') || prompt.includes('render') || prompt.includes('picture')) {
      mode = 'image';
    } else {
      mode = 'chat';
    }
  }

  return { agentMode: mode };
};

// 6 Dedicated Agent Execution Nodes
const chatNode = async (state) => {
  const result = await runChatAgent(state.messages, state.userPrompt);
  return { result };
};

const searchNode = async (state) => {
  const result = await runSearchAgent(state.userPrompt);
  return { result };
};

const codeNode = async (state) => {
  const result = await runCodeAgent(state.userPrompt);
  return { result };
};

const pdfNode = async (state) => {
  const result = await runPdfAgent(state.userPrompt);
  return { result };
};

const pptNode = async (state) => {
  const result = await runPptAgent(state.userPrompt);
  return { result };
};

const imageNode = async (state) => {
  const result = await runImageAgent(state.userPrompt);
  return { result };
};

// Routing condition function
const routeDestination = (state) => {
  switch (state.agentMode) {
    case 'search':
      return 'searchNode';
    case 'code':
      return 'codeNode';
    case 'pdf':
      return 'pdfNode';
    case 'ppt':
      return 'pptNode';
    case 'image':
      return 'imageNode';
    case 'chat':
    default:
      return 'chatNode';
  }
};

// Build the LangGraph StateGraph
let compiledGraph = null;

export const buildOrchestratorGraph = () => {
  if (compiledGraph) return compiledGraph;

  const workflow = new StateGraph({
    channels: {
      userPrompt: { value: (x, y) => y ?? x, default: () => '' },
      agentMode: { value: (x, y) => y ?? x, default: () => 'chat' },
      messages: { value: (x, y) => y ?? x, default: () => [] },
      result: { value: (x, y) => y ?? x, default: () => null },
    },
  })
    .addNode('routerNode', routerNode)
    .addNode('chatNode', chatNode)
    .addNode('searchNode', searchNode)
    .addNode('codeNode', codeNode)
    .addNode('pdfNode', pdfNode)
    .addNode('pptNode', pptNode)
    .addNode('imageNode', imageNode)
    .addEdge(START, 'routerNode')
    .addConditionalEdges('routerNode', routeDestination, {
      chatNode: 'chatNode',
      searchNode: 'searchNode',
      codeNode: 'codeNode',
      pdfNode: 'pdfNode',
      pptNode: 'pptNode',
      imageNode: 'imageNode',
    })
    .addEdge('chatNode', END)
    .addEdge('searchNode', END)
    .addEdge('codeNode', END)
    .addEdge('pdfNode', END)
    .addEdge('pptNode', END)
    .addEdge('imageNode', END);

  compiledGraph = workflow.compile();
  console.log('[LangGraph] Multi-Agent StateGraph compiled successfully.');
  return compiledGraph;
};

// Execution helper
export const executeAgentGraph = async ({ userPrompt, agentMode, messages }) => {
  try {
    const graph = buildOrchestratorGraph();
    const finalState = await graph.invoke({
      userPrompt,
      agentMode,
      messages: messages || [],
    });
    return finalState.result;
  } catch (err) {
    console.error('[LangGraph Orchestrator] Execution fallback triggered:', err.message);
    // Direct node invocation safety fallback
    switch (agentMode) {
      case 'search': return await runSearchAgent(userPrompt);
      case 'code': return await runCodeAgent(userPrompt);
      case 'pdf': return await runPdfAgent(userPrompt);
      case 'ppt': return await runPptAgent(userPrompt);
      case 'image': return await runImageAgent(userPrompt);
      default: return await runChatAgent(messages, userPrompt);
    }
  }
};
