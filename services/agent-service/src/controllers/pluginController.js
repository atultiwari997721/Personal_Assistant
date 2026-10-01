import axios from 'axios';

const fail = (message, status = 400) => {
  const error = new Error(message);
  error.status = status;
  throw error;
};

const providerError = (error, provider) => {
  const status = error.response?.status;
  const mapped = new Error(status === 401 || status === 403
    ? `${provider} rejected this connection or its required permissions are missing. Reconnect it with the required access.`
    : status === 429 ? `${provider} is rate-limiting connection checks. Try again shortly.`
      : status ? `${provider} connection check failed (HTTP ${status}).`
        : `${provider} could not be reached. Check this device's network connection and try again.`);
  mapped.status = status === 429 ? 429 : status === 401 || status === 403 ? 400 : status ? 502 : 503;
  return mapped;
};

export const testPluginConnection = async (req, res) => {
  const { type, pluginConfig = {} } = req.body || {};
  try {
    if (type === 'google') {
      const token = pluginConfig.google?.accessToken?.trim();
      if (!token) fail('Add a Google access token before testing the connection.');
      const headers = { Authorization: `Bearer ${token}` };
      await Promise.all([
        axios.get('https://gmail.googleapis.com/gmail/v1/users/me/profile', { headers, timeout: 12000 }),
        axios.get('https://www.googleapis.com/calendar/v3/calendars/primary', { headers, timeout: 12000 }),
      ]);
      return res.json({ success: true, message: 'Google token verified for Gmail and the primary Calendar.' });
    }

    if (type === 'whatsapp') {
      const { accessToken, phoneNumberId, apiVersion = 'v22.0' } = pluginConfig.whatsapp || {};
      if (!accessToken?.trim() || !phoneNumberId?.trim()) fail('Add the WhatsApp access token and phone number ID before testing.');
      if (!/^v\d+\.\d+$/.test(apiVersion)) fail('Graph API version must look like v22.0.');
      const response = await axios.get(`https://graph.facebook.com/${apiVersion}/${encodeURIComponent(phoneNumberId)}?fields=id,display_phone_number,verified_name`, {
        headers: { Authorization: `Bearer ${accessToken.trim()}` }, timeout: 12000,
      });
      return res.json({ success: true, message: `WhatsApp number verified${response.data.display_phone_number ? ` (${response.data.display_phone_number})` : ''}. Sending still depends on Meta account permissions and messaging rules.` });
    }

    return fail('Choose a supported integration to test.');
  } catch (error) {
    const mapped = error.response ? providerError(error, type === 'google' ? 'Google' : 'WhatsApp') : error;
    return res.status(mapped.status || 400).json({ success: false, message: mapped.message || 'Connection test failed.' });
  }
};

export const runPluginAction = async (req, res) => {
  try {
    const { type, payload = {}, pluginConfig = {} } = req.body || {};
    if (type === 'gmail') {
      const token = pluginConfig.google?.accessToken;
      if (!token) fail('Connect a Google account in API & Plugins first.');
      if (!payload.to || !payload.subject || !payload.body) fail('Recipient, subject, and message are required.');
      const rawMime = [
        `To: ${payload.to}`,
        `Subject: =?UTF-8?B?${Buffer.from(payload.subject, 'utf8').toString('base64')}?=`,
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset="UTF-8"',
        'Content-Transfer-Encoding: 8bit',
        '',
        payload.body,
      ].join('\r\n');
      const raw = Buffer.from(rawMime, 'utf8').toString('base64url');
      const response = await axios.post('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', { raw }, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, timeout: 20000,
      });
      return res.json({ success: true, message: 'Gmail message sent.', id: response.data.id });
    }

    if (type === 'calendar') {
      const token = pluginConfig.google?.accessToken;
      if (!token) fail('Connect a Google account in API & Plugins first.');
      if (!payload.title || !payload.startsAt || !payload.endsAt) fail('Event title, start, and end are required.');
      const start = new Date(payload.startsAt);
      const end = new Date(payload.endsAt);
      if (Number.isNaN(start.valueOf()) || Number.isNaN(end.valueOf()) || end <= start) fail('Choose a valid event time; the end must be after the start.');
      const response = await axios.post('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        summary: payload.title,
        start: { dateTime: start.toISOString() },
        end: { dateTime: end.toISOString() },
      }, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, timeout: 20000 });
      return res.json({ success: true, message: 'Calendar event created.', htmlLink: response.data.htmlLink });
    }

    if (type === 'whatsapp') {
      const { accessToken, phoneNumberId, apiVersion = 'v22.0' } = pluginConfig.whatsapp || {};
      if (!accessToken || !phoneNumberId) fail('Connect WhatsApp in API & Plugins first.');
      if (!/^v\d+\.\d+$/.test(apiVersion)) fail('Graph API version must look like v22.0.');
      if (!payload.to || !payload.body) fail('Recipient phone number and message are required.');
      const to = String(payload.to).replace(/[^\d]/g, '');
      if (to.length < 8) fail('Enter the recipient phone number with its country code.');
      const response = await axios.post(`https://graph.facebook.com/${apiVersion}/${encodeURIComponent(phoneNumberId)}/messages`, {
        messaging_product: 'whatsapp', recipient_type: 'individual', to, type: 'text', text: { preview_url: false, body: payload.body },
      }, { headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' }, timeout: 20000 });
      return res.json({ success: true, message: 'WhatsApp message sent.', id: response.data.messages?.[0]?.id });
    }

    return fail('Unsupported plugin action.');
  } catch (error) {
    const remoteMessage = error.response?.data?.error?.message || error.response?.data?.error_description;
    const message = remoteMessage || error.message || 'The connected service rejected the action.';
    const status = error.status || (error.response?.status === 401 || error.response?.status === 403 ? 400 : 502);
    console.warn('[Plugin] Action failed:', { type: req.body?.type, status: error.response?.status || error.status, message });
    return res.status(status).json({ success: false, message });
  }
};
