import test from 'node:test';
import assert from 'node:assert/strict';
import { verifyAuthAndSession } from './src/middleware/authMiddleware.js';

const invoke = async (headers = {}) => {
  let nextCalled = false;
  const result = { status: null, body: null, user: null };
  const req = { headers, path: '/api/agents/providers' };
  const res = {
    status(code) { result.status = code; return this; },
    json(body) { result.body = body; return this; },
  };
  await verifyAuthAndSession(req, res, () => { nextCalled = true; result.user = req.user; });
  return { ...result, nextCalled };
};

test('production rejects requests with no token', async () => {
  const previousNodeEnv = process.env.NODE_ENV;
  const previousDemo = process.env.ALLOW_DEMO_AUTH;
  process.env.NODE_ENV = 'production';
  process.env.ALLOW_DEMO_AUTH = 'true';
  try {
    const result = await invoke();
    assert.equal(result.status, 401);
    assert.equal(result.body.code, 'AUTH_REQUIRED');
    assert.equal(result.nextCalled, false);
  } finally {
    if (previousNodeEnv === undefined) delete process.env.NODE_ENV; else process.env.NODE_ENV = previousNodeEnv;
    if (previousDemo === undefined) delete process.env.ALLOW_DEMO_AUTH; else process.env.ALLOW_DEMO_AUTH = previousDemo;
  }
});

test('production rejects invalid tokens instead of assigning the demo identity', async () => {
  const previousNodeEnv = process.env.NODE_ENV;
  const previousDemo = process.env.ALLOW_DEMO_AUTH;
  process.env.NODE_ENV = 'production';
  process.env.ALLOW_DEMO_AUTH = 'true';
  try {
    const result = await invoke({ authorization: 'Bearer not-a-signed-token' });
    assert.equal(result.status, 401);
    assert.equal(result.body.code, 'AUTH_INVALID');
    assert.equal(result.nextCalled, false);
  } finally {
    if (previousNodeEnv === undefined) delete process.env.NODE_ENV; else process.env.NODE_ENV = previousNodeEnv;
    if (previousDemo === undefined) delete process.env.ALLOW_DEMO_AUTH; else process.env.ALLOW_DEMO_AUTH = previousDemo;
  }
});

test('local development demo identity requires an explicit enabled flag', async () => {
  const previousNodeEnv = process.env.NODE_ENV;
  const previousDemo = process.env.ALLOW_DEMO_AUTH;
  process.env.NODE_ENV = 'development';
  process.env.ALLOW_DEMO_AUTH = 'true';
  try {
    const result = await invoke();
    assert.equal(result.nextCalled, true);
    assert.equal(result.user.demo, true);
  } finally {
    if (previousNodeEnv === undefined) delete process.env.NODE_ENV; else process.env.NODE_ENV = previousNodeEnv;
    if (previousDemo === undefined) delete process.env.ALLOW_DEMO_AUTH; else process.env.ALLOW_DEMO_AUTH = previousDemo;
  }
});
