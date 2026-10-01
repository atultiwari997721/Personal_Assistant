import test from 'node:test';
import assert from 'node:assert/strict';
import { searchApprovedProjectFiles } from './localProjectSearch.js';

test('ranks relevant approved project files above unrelated files', () => {
  const results = searchApprovedProjectFiles([
    { name: 'src/auth.js', content: 'The login handler validates the session token before loading a user.' },
    { name: 'styles.css', content: 'The page uses a blue background and rounded cards.' },
  ], 'Where does the login handler validate the session token?');

  assert.equal(results[0]?.name, 'src/auth.js');
  assert.match(results[0]?.excerpt || '', /session token/i);
});

test('does not return documents when none of the approved content matches', () => {
  assert.deepEqual(
    searchApprovedProjectFiles([{ name: 'notes.txt', content: 'A short note about the garden.' }], 'How is authentication configured?'),
    [],
  );
});
