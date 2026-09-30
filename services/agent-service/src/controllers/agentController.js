import { executeAgentGraph } from '../graph/orchestrator.js';
import { generatePptxBuffer } from '../utils/pptxGenerator.js';
import { generatePdfBuffer } from '../utils/pdfGenerator.js';
import { invokeLLM } from '../config/llm.js';

export const testProviderConnection = async (req, res) => {
  try {
    const providerConfig = req.body?.providerConfig;
    const provider = providerConfig?.provider;
    if (!provider || (!providerConfig?.apiKey && provider !== 'ollama') || !providerConfig?.model) {
      return res.status(400).json({ success: false, message: 'Provider, API key, and model ID are required.' });
    }
    const content = await invokeLLM({
      systemPrompt: 'You are checking an AI provider connection. Reply with the single word OK.',
      userPrompt: 'Reply with OK.',
      model: provider,
      providerConfig,
      temperature: 0,
      timeout: 20000,
    });
    return res.json({ success: true, provider, model: providerConfig.model, response: content.slice(0, 40) });
  } catch (error) {
    console.error('[Agent Service] Provider check failed:', { code: error.code, provider: error.provider, status: error.status });
    return res.status(400).json({ success: false, code: error.code || 'AI_PROVIDER_REQUEST_FAILED', message: error.message });
  }
};

export const AGENT_SPECS = [
  {
    id: 'chat',
    name: 'Conversational Chat',
    description: 'General QA and context-aware conversation.',
    icon: 'MessageSquare',
    prompt: 'You are a helpful, intelligent AI assistant. Maintain conversation history, analyze user context, and deliver structured, clear responses using markdown formatting.',
  },
  {
    id: 'search',
    name: 'Live Web Search',
    description: 'Live web results from configured search sources, synthesized by the selected AI provider.',
    icon: 'Globe',
    prompt: 'You are a Search AI Agent with real-time web access. When answering questions requiring current data, query web tools, synthesize factual key insights with inline citations, and return relevant image links in markdown.',
  },
  {
    id: 'code',
    name: 'Code & Sandbox Preview',
    description: 'Generates production-ready code with live iframe interactive preview.',
    icon: 'Code2',
    prompt: 'You are a Senior Full-Stack Engineer AI. Generate clean, modular, and runnable code blocks enclosed in triple backticks with language tags (e.g., ```jsx). Provide brief explanations, handle edge cases, and ensure compatibility with live previews.',
  },
  {
    id: 'pdf',
    name: 'PDF Document Creator',
    description: 'Structured documents and reports ready for Markdown-to-PDF compilation.',
    icon: 'FileText',
    prompt: 'You are a Document Creation AI. Format responses into clean, elegant Markdown layouts optimized for PDF generation, complete with document headers, executive summaries, sub-sections, bullet points, and data tables.',
  },
  {
    id: 'ppt',
    name: 'Presentation (PPT) Decks',
    description: 'Creates structured slide decks and exports native .pptx files.',
    icon: 'Presentation',
    prompt: 'You are a Presentation Design AI. Output slide decks structured strictly in JSON format containing an array of slides, where each slide has slide_number, title, bullet_points, and speaker_notes.',
  },
  {
    id: 'image',
    name: 'Visual Prompt & Image Generator',
    description: 'Enhances prompts with cinematic tags and renders visual art.',
    icon: 'Image',
    prompt: 'You are a Visual Prompt Engineer AI. Expand basic user concepts into cinematic, high-detail image prompts (specifying lighting, camera angle, resolution, and style tags). Submit to the image generation endpoint and render the final image URL in markdown: ![caption](url).',
  },
];

// POST /api/agents/execute
export const runAgentTask = async (req, res) => {
  try {
    const { prompt, agentMode = 'chat', messages = [], model = 'auto', providerConfig, connectedPlugins = [] } = req.body;

    if (!prompt) {
      return res.status(400).json({ success: false, message: 'Prompt is required.' });
    }

    const result = await executeAgentGraph({
      userPrompt: prompt,
      agentMode,
      model,
      providerConfig,
      connectedPlugins,
      messages,
    });

    return res.status(200).json({
      success: true,
      agentMode: result.agent || agentMode,
      data: result,
    });
  } catch (error) {
    console.error('[Agent Service] Task error:', { code: error.code, message: error.message });
    const status = error.status === 429 ? 429 : error.status === 401 || error.status === 403 ? 502 : 500;
    return res.status(status).json({
      success: false,
      code: error.code || 'AGENT_EXECUTION_FAILED',
      provider: error.provider,
      message: error.message || 'Agent execution failed.',
    });
  }
};

// POST /api/agents/export-pptx
export const exportPptx = async (req, res) => {
  try {
    const { slides, title = 'Cortex_Presentation' } = req.body;
    if (!slides || !Array.isArray(slides)) {
      return res.status(400).json({ success: false, message: 'Valid slides array is required.' });
    }

    const buffer = await generatePptxBuffer(slides, title);
    const sanitizedTitle = title.replace(/[^a-zA-Z0-9_-]/g, '_');

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
    res.setHeader('Content-Disposition', `attachment; filename="${sanitizedTitle}.pptx"`);
    res.setHeader('Content-Length', buffer.length);
    return res.send(buffer);
  } catch (err) {
    console.error('[Agent Service] PPTX export error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/agents/export-pdf
export const exportPdf = async (req, res) => {
  try {
    const { markdown, title = 'Cortex_Report' } = req.body;
    if (!markdown) {
      return res.status(400).json({ success: false, message: 'Markdown content is required.' });
    }

    const buffer = await generatePdfBuffer(markdown, title);
    const sanitizedTitle = title.replace(/[^a-zA-Z0-9_-]/g, '_');

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${sanitizedTitle}.pdf"`);
    res.setHeader('Content-Length', buffer.length);
    return res.send(buffer);
  } catch (err) {
    console.error('[Agent Service] PDF export error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/agents/spec
export const getAgentList = (req, res) => {
  return res.status(200).json({ success: true, agents: AGENT_SPECS });
};
