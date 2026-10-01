import { OAuth2Client } from 'google-auth-library';

const googleClient = new OAuth2Client();

export const verifyGoogleIdentity = async ({ idToken, clientId = process.env.GOOGLE_CLIENT_ID, verifier = googleClient }) => {
  if (!clientId?.trim()) {
    const error = new Error('Google sign-in is not configured on this server.');
    error.status = 503;
    error.code = 'GOOGLE_AUTH_NOT_CONFIGURED';
    throw error;
  }
  if (typeof idToken !== 'string' || !idToken.trim()) {
    const error = new Error('A Google ID token is required.');
    error.status = 400;
    error.code = 'GOOGLE_ID_TOKEN_REQUIRED';
    throw error;
  }

  let payload;
  try {
    const ticket = await verifier.verifyIdToken({ idToken: idToken.trim(), audience: clientId.trim() });
    payload = ticket.getPayload();
  } catch {
    const error = new Error('Google did not verify this sign-in token. Sign in again and retry.');
    error.status = 401;
    error.code = 'GOOGLE_ID_TOKEN_INVALID';
    throw error;
  }

  if (!payload?.sub || !payload.email || payload.email_verified !== true) {
    const error = new Error('The verified Google account must have an email address that Google has confirmed.');
    error.status = 403;
    error.code = 'GOOGLE_ACCOUNT_NOT_VERIFIED';
    throw error;
  }
  return {
    uid: `google:${payload.sub}`,
    email: payload.email.toLowerCase(),
    name: payload.name || payload.email,
    avatarUrl: payload.picture,
  };
};
