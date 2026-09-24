import { invokeLLM } from '../config/llm.js';
import { performWebSearch } from '../tools/webSearch.js';
import {
  trySolveConversational,
  trySolveMath,
  trySolveCoding,
  trySolveCreative,
  trySolveComparison,
  solveFactualReasoning,
} from './reasoningEngine.js';

export const CHAT_SYSTEM_PROMPT = `You are Cortex AI, a brilliant, highly intelligent, and deeply thoughtful Principal AI Systems Architect and Polymath.
You possess profound expertise across computer science, mathematical reasoning, software engineering, science, business, and creative writing.
When answering questions:
1. Think step-by-step before answering.
2. Provide direct, highly accurate, and comprehensive explanations with real substance—never superficial generic placeholders.
3. When code is requested, provide complete, working, well-commented code blocks with language tags.
4. When math is requested, show clear arithmetic steps and formulas.
5. Format your answers elegantly using GitHub-flavored Markdown.`;

export const runChatAgent = async (messages, userPrompt, model = 'auto') => {
  // 1. Attempt Frontier / Cloud LLM execution first
  try {
    const content = await invokeLLM({
      systemPrompt: CHAT_SYSTEM_PROMPT,
      userPrompt,
      messages,
      temperature: 0.6,
      model,
    });

    if (content && content.length > 20 && !content.includes('Internal Server Error')) {
      return {
        agent: 'chat',
        content,
        metadata: { timestamp: new Date(), engine: `frontier-llm (${model})` },
      };
    }
  } catch (err) {
    console.warn('[Chat Agent] Cloud LLM note, engaging Cognitive Reasoning Brain:', err.message);
  }

  // 2. High-Intelligence Local Cognitive Reasoning Engine
  // A. Check for Conversational, Greetings & Identity
  const convSolution = trySolveConversational(userPrompt);
  if (convSolution) {
    return {
      agent: 'chat',
      content: convSolution,
      metadata: { timestamp: new Date(), engine: 'cognitive-conversational' },
    };
  }

  // B. Check for Mathematical Expressions, Percentages, and Unit Conversions
  const mathSolution = trySolveMath(userPrompt);
  if (mathSolution) {
    return {
      agent: 'chat',
      content: mathSolution,
      metadata: { timestamp: new Date(), engine: 'cognitive-math' },
    };
  }

  // B. Check for Coding, Algorithms, and Technical Solutions
  const codeSolution = trySolveCoding(userPrompt);
  if (codeSolution) {
    return {
      agent: 'chat',
      content: codeSolution,
      metadata: { timestamp: new Date(), engine: 'cognitive-code' },
    };
  }

  // C. Check for Creative Requests (Poems, Jokes, Stories)
  const creativeSolution = trySolveCreative(userPrompt);
  if (creativeSolution) {
    return {
      agent: 'chat',
      content: creativeSolution,
      metadata: { timestamp: new Date(), engine: 'cognitive-creative' },
    };
  }

  // D. Check for Comparative Analysis ("X vs Y")
  const comparisonSolution = trySolveComparison(userPrompt);
  if (comparisonSolution) {
    return {
      agent: 'chat',
      content: comparisonSolution,
      metadata: { timestamp: new Date(), engine: 'cognitive-comparison' },
    };
  }

  // E. Factual, Scientific, Historical, and Domain Knowledge
  // Query multi-source real-time web knowledge (Wikipedia + HackerNews + DuckDuckGo)
  let searchHits = [];
  try {
    const webData = await performWebSearch(userPrompt);
    if (webData && webData.results) {
      searchHits = webData.results;
    }
  } catch (searchErr) {
    console.warn('[Chat Agent] Search fallback note:', searchErr.message);
  }

  const factualAnswer = solveFactualReasoning(userPrompt, searchHits);
  return {
    agent: 'chat',
    content: factualAnswer,
    metadata: { timestamp: new Date(), engine: 'cognitive-knowledge' },
  };
};
