const STOP_WORDS = new Set([
  'about', 'after', 'again', 'also', 'and', 'are', 'because', 'been', 'before', 'being',
  'between', 'can', 'could', 'did', 'does', 'for', 'from', 'have', 'into', 'its', 'just',
  'more', 'most', 'not', 'only', 'other', 'our', 'out', 'should', 'some', 'such', 'than',
  'that', 'their', 'them', 'then', 'there', 'these', 'they', 'this', 'those', 'through',
  'under', 'very', 'was', 'were', 'what', 'when', 'where', 'which', 'while', 'with', 'would',
]);

const tokens = (value) => (String(value || '').toLowerCase().match(/[a-z0-9_]{2,}/g) || [])
  .filter((token) => !STOP_WORDS.has(token));

const excerptFor = (text, queryTerms, maxLength = 5000) => {
  if (text.length <= maxLength) return text;
  const lines = text.split(/\r?\n/);
  const ranked = lines.map((line, index) => ({
    index,
    line,
    score: queryTerms.reduce((total, term) => total + (line.toLowerCase().match(new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length, 0),
  })).filter((item) => item.score > 0).sort((a, b) => b.score - a.score);
  if (!ranked.length) return `${text.slice(0, maxLength)}\n[Excerpt truncated]`;

  const chosen = new Set();
  let length = 0;
  for (const item of ranked) {
    for (let lineIndex = Math.max(0, item.index - 1); lineIndex <= Math.min(lines.length - 1, item.index + 1); lineIndex += 1) {
      if (chosen.has(lineIndex)) continue;
      const addition = lines[lineIndex].length + 1;
      if (length + addition > maxLength) break;
      chosen.add(lineIndex);
      length += addition;
    }
    if (length >= maxLength * 0.85) break;
  }
  return [...chosen].sort((a, b) => a - b).map((lineIndex) => lines[lineIndex]).join('\n');
};

/** Rank only files the user has already explicitly approved for local reading. */
export const searchApprovedProjectFiles = (documents, question, limit = 4) => {
  const queryTerms = [...new Set(tokens(question))];
  if (!queryTerms.length) return [];

  const prepared = documents.map((document) => ({
    ...document,
    terms: tokens(document.content),
  }));
  const ranked = prepared.map((document) => {
    const frequencies = new Map();
    for (const term of document.terms) frequencies.set(term, (frequencies.get(term) || 0) + 1);
    const score = queryTerms.reduce((total, term) => {
      const frequency = frequencies.get(term) || 0;
      if (!frequency) return total;
      const documentFrequency = prepared.filter((candidate) => candidate.terms.includes(term)).length;
      const inverseFrequency = Math.log(1 + (prepared.length - documentFrequency + 0.5) / (documentFrequency + 0.5));
      const normalizedFrequency = (frequency * 2.2) / (frequency + 1.2 * (0.25 + 0.75 * document.terms.length / 500));
      return total + inverseFrequency * normalizedFrequency;
    }, 0);
    return { name: document.name, score, excerpt: excerptFor(document.content, queryTerms) };
  }).filter((document) => document.score > 0).sort((a, b) => b.score - a.score);

  return ranked.slice(0, limit);
};
