import { invokeLLM } from '../config/llm.js';

export const IMAGE_SYSTEM_PROMPT =
  "You are a Visual Prompt Engineer AI. Expand basic user concepts into cinematic, high-detail image prompts (specifying lighting, camera angle, resolution, and style tags). Submit to the image generation endpoint and render the final image URL in markdown: ![caption](url).";

export const runImageAgent = async (userPrompt) => {
  try {
    const expandedPrompt = await invokeLLM({
      systemPrompt: `${IMAGE_SYSTEM_PROMPT}\n\nTask: Given the user concept, output ONLY the expanded visual prompt string (with volumetric cinematic lighting, 8k resolution, photorealistic or digital art style). Output only the prompt string without commentary.`,
      userPrompt: `Concept: ${userPrompt}`,
      temperature: 0.8,
    });

    const cleanPrompt = expandedPrompt.replace(/['"]+/g, '').trim();
    const encodedPrompt = encodeURIComponent(cleanPrompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true&seed=${Math.floor(Math.random() * 100000)}`;

    const markdownContent = `### 🎨 Visual Prompt Engineering & Generation

**Original Concept:** ${userPrompt}  
**Engineered Prompt:** *${cleanPrompt}*

---

![${userPrompt}](${imageUrl})

---
*Click the image or use the Download button in the gallery to save in full 1024x1024 resolution.*
`;

    return {
      agent: 'image',
      content: markdownContent,
      expandedPrompt: cleanPrompt,
      imageUrl,
    };
  } catch (err) {
    console.error('[Image Agent] Execution error:', err.message);
    const directUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(userPrompt)}?width=1024&height=1024&nologo=true`;
    return {
      agent: 'image',
      content: `### 🎨 Concept Generated\n\n![${userPrompt}](${directUrl})`,
      expandedPrompt: userPrompt,
      imageUrl: directUrl,
    };
  }
};
