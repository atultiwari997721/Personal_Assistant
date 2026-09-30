import test from 'node:test';
import assert from 'node:assert/strict';
import { getActiveProvider, getConfiguredProviders, invokeLLM } from './src/config/llm.js';
import { runChatAgent } from './src/agents/chatAgent.js';
import { runCodeAgent } from './src/agents/codeAgent.js';

const envKeys = [
  'OPENAI_API_KEY', 'OPENAI_MODEL', 'LLM_MODEL', 'GEMINI_API_KEY', 'GEMINI_MODEL',
  'NVIDIA_API_KEY', 'NVIDIA_MODEL', 'GROQ_API_KEY', 'GROQ_MODEL', 'HF_TOKEN', 'HF_MODEL',
  'OPENROUTER_API_KEY', 'OPENROUTER_MODEL', 'OLLAMA_MODEL', 'LLM_PROVIDER',
];

const withCleanProviderEnv = async (fn) => {
  const previous = Object.fromEntries(envKeys.map((key) => [key, process.env[key]]));
  for (const key of envKeys) delete process.env[key];
  try {
    return await fn();
  } finally {
    for (const key of envKeys) {
      if (previous[key] === undefined) delete process.env[key];
      else process.env[key] = previous[key];
    }
  }
};

test('provider status does not report providers without both credentials and a model', async () => {
  await withCleanProviderEnv(() => {
    const providers = getConfiguredProviders();
    assert.ok(providers.every((provider) => provider.configured === false));
    assert.equal(getActiveProvider('auto'), null);
  });
});

test('automatic routing honors a configured provider preference', async () => {
  await withCleanProviderEnv(() => {
    process.env.OPENAI_API_KEY = 'test-openai-key';
    process.env.OPENAI_MODEL = 'openai-test-model';
    process.env.GEMINI_API_KEY = 'test-gemini-key';
    process.env.GEMINI_MODEL = 'gemini-test-model';
    process.env.LLM_PROVIDER = 'gemini';

    assert.deepEqual(
      (({ id, model }) => ({ id, model }))(getActiveProvider('auto')),
      { id: 'gemini', model: 'gemini-test-model' },
    );
  });
});

test('an explicit provider selection does not silently switch providers', async () => {
  await withCleanProviderEnv(() => {
    process.env.OPENAI_API_KEY = 'test-openai-key';
    process.env.OPENAI_MODEL = 'openai-test-model';
    assert.throws(() => getActiveProvider('gemini'), { code: 'AI_PROVIDER_NOT_CONFIGURED' });
  });
});

test('requests fail with a configuration error instead of returning a canned answer', async () => {
  await withCleanProviderEnv(async () => {
    await assert.rejects(
      invokeLLM({ userPrompt: 'Hello KritiAI', model: 'auto' }),
      { code: 'AI_PROVIDER_NOT_CONFIGURED' },
    );
  });
});

test('chat and coding agents propagate missing-provider errors instead of returning template answers', async () => {
  await withCleanProviderEnv(async () => {
    await assert.rejects(runChatAgent([], 'Hello KritiAI'), { code: 'AI_PROVIDER_NOT_CONFIGURED' });
    await assert.rejects(runCodeAgent('Build a small app'), { code: 'AI_PROVIDER_NOT_CONFIGURED' });
  });
});
