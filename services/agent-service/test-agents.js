import assert from 'node:assert/strict';
import { buildOrchestratorGraph } from './src/graph/orchestrator.js';
import { extractRunnableCode } from './src/agents/codeAgent.js';
import { runImageAgent } from './src/agents/imageAgent.js';
import { generatePptxBuffer } from './src/utils/pptxGenerator.js';
import { generatePdfBuffer } from './src/utils/pdfGenerator.js';

const graph = buildOrchestratorGraph();
assert.equal(typeof graph.invoke, 'function', 'LangGraph compiles and exposes invoke');

const extracted = extractRunnableCode('Example:\n```js\nconsole.log("hi")\n```');
assert.equal(extracted?.rawCode, 'console.log("hi")', 'Coding output is extracted from model code fences');
assert.match(extracted.code, /console\.log/, 'Non-HTML code is shown in a preview document');

await assert.rejects(runImageAgent('landscape'), { code: 'IMAGE_PROVIDER_NOT_CONFIGURED' });

const sampleSlides = [{
  slide_number: 1,
  title: 'Sample',
  bullet_points: ['Review the example'],
  speaker_notes: 'Example notes',
}];
const pptxBuffer = await generatePptxBuffer(sampleSlides, 'Test Presentation');
assert.ok(Buffer.isBuffer(pptxBuffer) && pptxBuffer.length > 1000, 'PPTX export compiles structured slides');

const pdfBuffer = await generatePdfBuffer('# Sample document\n\nTest export.', 'Test Document');
assert.ok(Buffer.isBuffer(pdfBuffer) && pdfBuffer.length > 500, 'PDF export compiles supplied Markdown');

console.log('Agent runtime checks passed. No external AI provider or integration was simulated.');
