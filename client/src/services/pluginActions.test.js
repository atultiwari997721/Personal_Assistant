import test from 'node:test';
import assert from 'node:assert/strict';
import { createPluginDraft } from './pluginActions.js';

test('calendar drafts never invent event title or times', () => {
  assert.deepEqual(createPluginDraft('Add a meeting to my calendar tomorrow at 5 pm.'), {
    type: 'calendar', title: '', startsAt: '', endsAt: '',
  });
});

test('calendar drafts keep only an explicitly quoted event name', () => {
  const draft = createPluginDraft('Create a meeting called "Project review" on my calendar.');
  assert.equal(draft.title, 'Project review');
  assert.equal(draft.startsAt, '');
  assert.equal(draft.endsAt, '');
});

test('email drafts extract only explicit recipient, subject, and message text', () => {
  assert.deepEqual(createPluginDraft('Send an email to sam@example.com with subject "Update" saying "I will be 10 minutes late."'), {
    type: 'gmail', to: 'sam@example.com', subject: 'Update', body: 'I will be 10 minutes late.',
  });
  assert.deepEqual(createPluginDraft('Send an email to Sam about tomorrow'), {
    type: 'gmail', to: '', subject: '', body: '',
  });
});

test('WhatsApp drafts do not copy the instruction into the outgoing message', () => {
  assert.deepEqual(createPluginDraft('Send a WhatsApp message to +1 555 123 4567 saying "I am on my way."'), {
    type: 'whatsapp', to: '+1 555 123 4567', body: 'I am on my way.',
  });
  assert.deepEqual(createPluginDraft('Message someone on WhatsApp'), {
    type: 'whatsapp', to: '', body: '',
  });
});

test('ordinary discussion about calendar does not create an action draft', () => {
  assert.equal(createPluginDraft('How should I organize my calendar?'), null);
  assert.equal(createPluginDraft('What is WhatsApp?'), null);
});
