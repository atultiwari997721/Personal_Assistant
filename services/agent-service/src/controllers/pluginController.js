import axios from 'axios';

const fail = (message, status = 400) => {
  const error = new Error(message);
  error.status = status;
  throw error;
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
