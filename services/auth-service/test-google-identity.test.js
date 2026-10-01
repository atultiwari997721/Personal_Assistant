import test from 'node:test';
import assert from 'node:assert/strict';
import { verifyGoogleIdentity } from './src/config/googleIdentity.js';

test('Google identity verification checks the configured audience and returns verified claims', async () => {
  let received;
  const identity = await verifyGoogleIdentity({
    idToken: 'signed-google-token',
    clientId: 'kritiai-client-id',
    verifier: { verifyIdToken: async (args) => {
      received = args;
      return { getPayload: () => ({ sub: 'subject-123', email: 'Owner@example.com', email_verified: true, name: 'Owner', picture: 'https://example.test/avatar.png' }) };
    } },
  });
  assert.deepEqual(received, { idToken: 'signed-google-token', audience: 'kritiai-client-id' });
  assert.deepEqual(identity, { uid: 'google:subject-123', email: 'owner@example.com', name: 'Owner', avatarUrl: 'https://example.test/avatar.png' });
});

test('identity verification refuses tokens when the server has no client ID configured', async () => {
  await assert.rejects(verifyGoogleIdentity({ idToken: 'signed-token', clientId: '', verifier: {} }), { code: 'GOOGLE_AUTH_NOT_CONFIGURED', status: 503 });
});

test('identity verification refuses missing and unverifiable tokens', async () => {
  await assert.rejects(verifyGoogleIdentity({ idToken: '', clientId: 'client', verifier: {} }), { code: 'GOOGLE_ID_TOKEN_REQUIRED' });
  await assert.rejects(verifyGoogleIdentity({ idToken: 'bad', clientId: 'client', verifier: { verifyIdToken: async () => { throw new Error('bad signature'); } } }), { code: 'GOOGLE_ID_TOKEN_INVALID', status: 401 });
});

test('identity verification rejects accounts without a Google-verified email', async () => {
  await assert.rejects(verifyGoogleIdentity({ idToken: 'token', clientId: 'client', verifier: { verifyIdToken: async () => ({ getPayload: () => ({ sub: 'subject', email: 'owner@example.com', email_verified: false }) }) } }), { code: 'GOOGLE_ACCOUNT_NOT_VERIFIED', status: 403 });
});
