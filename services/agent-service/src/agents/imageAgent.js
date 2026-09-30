export const runImageAgent = async () => {
  const error = new Error('Image generation is not configured. Connect an image-generation provider before using this agent.');
  error.code = 'IMAGE_PROVIDER_NOT_CONFIGURED';
  throw error;
};
