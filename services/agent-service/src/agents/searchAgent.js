import { invokeLLM, getModelIdentity } from '../config/llm.js';
import { performWebSearch } from '../tools/webSearch.js';

export const SEARCH_SYSTEM_PROMPT = `You are KritiAI's research agent. Use only the supplied source material for claims about current events. Cite source numbers in square brackets, identify uncertainty, and say when the available sources do not answer the question. Never claim searches or retrievals occurred unless results are present.`;

export const runSearchAgent = async (userPrompt, model = 'auto') => {
  const webResults = await performWebSearch(userPrompt);
  const liveResults = webResults.results || [];
  if (liveResults.length === 0) {
    const error = new Error('Web search returned no results. Check the search provider configuration or try a different query.');
    error.code = 'WEB_SEARCH_NO_RESULTS';
    throw error;
  }

  const sourceContext = liveResults
    .map((result, index) => `[${index + 1}] ${result.title} (${result.url})\n${result.content}`)
    .join('\n\n');
  const content = await invokeLLM({
    systemPrompt: SEARCH_SYSTEM_PROMPT,
    userPrompt: `User query: "${userPrompt}"\n\nLive web sources:\n${sourceContext}\n\nAnswer with citations such as [1].`,
    temperature: 0.3,
    model,
  });

  return {
    agent: 'search',
    content,
    citations: liveResults,
    images: webResults.images || [],
    metadata: { ...getModelIdentity(model), timestamp: new Date() },
  };
};
