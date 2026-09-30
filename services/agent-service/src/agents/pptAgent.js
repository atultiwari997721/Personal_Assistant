import { invokeLLM, getModelIdentity } from '../config/llm.js';

export const PPT_SYSTEM_PROMPT = `You are KritiAI's presentation assistant. Return a JSON array of slide objects. Each object must contain slide_number, title, bullet_points (array of strings), and speaker_notes. Do not invent facts, sources, or market metrics; label assumptions clearly.`;

export const runPptAgent = async (userPrompt, model = 'auto', providerConfig) => {
  const rawOutput = await invokeLLM({
    systemPrompt: PPT_SYSTEM_PROMPT,
    userPrompt: `Create a presentation outline for this request: "${userPrompt}". Return only the JSON array.`,
    temperature: 0.3,
    model,
    providerConfig,
    timeout: 30000,
  });

  const cleaned = rawOutput.replace(/```json/gi, '').replace(/```/g, '').trim();
  const match = cleaned.match(/\[\s*\{[\s\S]*\}\s*\]/);
  let slides;
  try {
    slides = JSON.parse(match ? match[0] : cleaned);
  } catch {
    const error = new Error('The selected model did not return valid presentation data.');
    error.code = 'AI_PRESENTATION_OUTPUT_INVALID';
    throw error;
  }

  if (!Array.isArray(slides) || slides.length === 0 || slides.some((slide) =>
    !Number.isFinite(Number(slide.slide_number)) || typeof slide.title !== 'string' ||
    !Array.isArray(slide.bullet_points) || !slide.bullet_points.every((point) => typeof point === 'string') ||
    typeof slide.speaker_notes !== 'string'
  )) {
    const error = new Error('The selected model returned presentation data with an invalid structure.');
    error.code = 'AI_PRESENTATION_OUTPUT_INVALID';
    throw error;
  }

  return {
    agent: 'ppt',
    slides,
    content: `Presentation prepared with ${slides.length} slides. Review it before exporting.`,
    metadata: { ...getModelIdentity(model, providerConfig), timestamp: new Date() },
  };
};
