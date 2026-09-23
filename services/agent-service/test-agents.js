import { buildOrchestratorGraph, executeAgentGraph } from './src/graph/orchestrator.js';
import { generatePptxBuffer } from './src/utils/pptxGenerator.js';
import { generatePdfBuffer } from './src/utils/pdfGenerator.js';
import { searchVectorStore } from './src/rag/qdrantClient.js';
import { performWebSearch } from './src/tools/webSearch.js';

console.log('====================================================');
console.log('🧪 CORTEX MULTI-AGENT AI VERIFICATION SUITE');
console.log('====================================================\n');

async function runTests() {
  let passed = 0;
  let failed = 0;

  const assert = (condition, name) => {
    if (condition) {
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${name}`);
      failed++;
    }
  };

  try {
    // 1. Test Qdrant Vector Store
    console.log('--- 1. Testing Vector Database & RAG Search ---');
    const vectorHits = await searchVectorStore('microservices architecture');
    assert(Array.isArray(vectorHits) && vectorHits.length > 0, 'Qdrant Vector RAG search returns documents');

    // 2. Test Web Search Tool
    console.log('\n--- 2. Testing Web Search Tool ---');
    const searchRes = await performWebSearch('LangGraph Multi-Agent Workflows');
    assert(searchRes.results && searchRes.results.length > 0, 'Web Search tool returns structured citations');

    // 3. Test LangGraph Compilation
    console.log('\n--- 3. Testing LangGraph StateGraph Compilation ---');
    const graph = buildOrchestratorGraph();
    assert(graph !== null && typeof graph.invoke === 'function', 'LangGraph StateGraph compiled with nodes & edges');

    // 4. Test 6 Specialized Agents
    console.log('\n--- 4. Testing The 6 Specialized AI Agents ---');

    // Agent 1: Chat
    const chatResult = await executeAgentGraph({
      userPrompt: 'Hello Cortex assistant',
      agentMode: 'chat',
    });
    assert(chatResult && chatResult.agent === 'chat' && chatResult.content.length > 0, 'Agent 1: Chat Agent responds');

    // Agent 2: Search
    const searchResult = await executeAgentGraph({
      userPrompt: 'What are the top features of LangGraph?',
      agentMode: 'search',
    });
    assert(searchResult && searchResult.agent === 'search' && searchResult.citations.length > 0, 'Agent 2: Search Agent responds with citations');

    // Agent 3: Code & Sandbox
    const codeResult = await executeAgentGraph({
      userPrompt: 'Create a responsive counter component in HTML/JS',
      agentMode: 'code',
    });
    assert(codeResult && codeResult.agent === 'code' && codeResult.sandboxCode.length > 0, 'Agent 3: Code Agent responds with runnable sandbox');

    // Agent 4: PDF Generator
    const pdfResult = await executeAgentGraph({
      userPrompt: 'Generate executive summary for cloud migration',
      agentMode: 'pdf',
    });
    assert(pdfResult && pdfResult.agent === 'pdf' && pdfResult.documentMarkdown.length > 0, 'Agent 4: PDF Document Agent generates markdown');

    // Agent 5: PPT Generator
    const pptResult = await executeAgentGraph({
      userPrompt: 'Design a pitch deck for an AI SaaS startup',
      agentMode: 'ppt',
    });
    assert(pptResult && pptResult.agent === 'ppt' && Array.isArray(pptResult.slides), 'Agent 5: PPT Agent generates structured JSON slides');

    // Agent 6: Image Generator
    const imageResult = await executeAgentGraph({
      userPrompt: 'Cyberpunk quantum mainframe',
      agentMode: 'image',
    });
    assert(imageResult && imageResult.agent === 'image' && imageResult.imageUrl.startsWith('http'), 'Agent 6: Image Agent generates visual prompt & render URL');

    // 5. Test PPTX binary compilation
    console.log('\n--- 5. Testing PPTX & PDF Compilation Engines ---');
    const pptxBuffer = await generatePptxBuffer(pptResult.slides, 'Test Presentation');
    assert(Buffer.isBuffer(pptxBuffer) && pptxBuffer.length > 1000, `PptxGenJS compiles valid PPTX binary (${pptxBuffer.length} bytes)`);

    const pdfBuffer = await generatePdfBuffer(pdfResult.documentMarkdown, 'Test Document');
    assert(Buffer.isBuffer(pdfBuffer) && pdfBuffer.length > 500, `PDFKit compiles valid PDF binary (${pdfBuffer.length} bytes)`);

    console.log('\n====================================================');
    console.log(`📊 Test Summary: ${passed} Passed, ${failed} Failed`);
    console.log('====================================================');

    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error('Fatal test error:', err);
    process.exit(1);
  }
}

runTests();
