import axios from 'axios';

export const runImageAgent = async (prompt, imageProviderConfig) => {
  const apiKey = imageProviderConfig?.apiKey?.trim();
  if (!apiKey) {
    const error = new Error('Add a Pollinations API key in API & Plugins → API to generate images.');
    error.code = 'IMAGE_PROVIDER_NOT_CONFIGURED';
    throw error;
  }
  try {
    const response = await axios.get(`https://gen.pollinations.ai/image/${encodeURIComponent(prompt)}`, {
      params: { model: 'flux', width: 1024, height: 1024 },
      headers: { Authorization: `Bearer ${apiKey}` },
      responseType: 'arraybuffer', timeout: 120000,
      maxContentLength: 25 * 1024 * 1024,
    });
    const mime = response.headers['content-type']?.split(';')[0] || 'image/jpeg';
    const imageUrl = `data:${mime};base64,${Buffer.from(response.data).toString('base64')}`;
    return { agent: 'image', content: 'Image generated successfully.', imageUrl, expandedPrompt: prompt, metadata: { provider: 'pollinations', model: 'flux' } };
  } catch (cause) {
    const status = cause.response?.status;
    const message = status === 401 || status === 403
      ? 'Pollinations rejected the API key. Check the key in API & Plugins.'
      : status === 402 ? 'Pollinations needs available generation credits for this image model.'
        : status === 429 ? 'Pollinations is rate-limiting image requests. Try again shortly.'
          : cause.response?.data?.toString?.().slice(0, 300) || cause.message || 'Image generation failed.';
    const error = new Error(message);
    error.code = 'IMAGE_GENERATION_FAILED';
    error.status = status;
    throw error;
  }
};
