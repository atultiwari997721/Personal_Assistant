import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Download, FileText, Sparkles, Printer } from 'lucide-react';
import api from '../services/api.js';

const DEFAULT_DOC = `# Executive Brief: Multi-Agent Platform Deployment
**Subject:** Cloud Scaling & Microservices Architecture
**Date:** March 2026

---

## 1. Executive Summary
This enterprise document outlines the technical architecture for the multi-agent AI SaaS platform, focusing on decoupled microservices, high-speed Redis session caching, and transactional credit accounting.

## 2. Core Operational Pillars
- **Central API Gateway:** Unified rate-limiting, JWT authentication, and atomic credit enforcement.
- **LangGraph State Orchestrator:** Dynamic conditional routing across specialized nodes.
- **Qdrant Vector Retrieval:** Sub-millisecond similarity queries for real-time domain RAG.

| Component | Target Metric | High-Availability Plan |
| :--- | :--- | :--- |
| **Gateway Proxy** | < 15ms latency | Multi-AZ ECS Fargate |
| **Credit Ledger** | 100% Consistency | MongoDB replica set with atomic operations |
| **Agent Execution** | Streaming Tokens | Redis pub/sub with WebSocket gateway |

## 3. Next Steps & Recommendations
1. Deploy Docker Compose containers locally for testing.
2. Initialize Qdrant collection with 1536-dimensional embeddings.
3. Configure Razorpay webhook secrets for production transactions.

---
*Created by Cortex Document Creation AI Agent.*`;

export const DocumentView = ({ docMarkdown, onRunAgentPrompt, isLoading }) => {
  const content = docMarkdown || DEFAULT_DOC;
  const [promptInput, setPromptInput] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const handleDownloadPdf = async () => {
    try {
      setIsExporting(true);
      const response = await api.post(
        '/agents/export-pdf',
        { markdown: content, title: 'Cortex_Executive_Document' },
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Cortex_Executive_Document.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Failed to export PDF:', err);
      alert('Failed to generate PDF document.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!promptInput.trim() || isLoading) return;
    onRunAgentPrompt(promptInput.trim());
    setPromptInput('');
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-dark-950">
      {/* Top Action Bar */}
      <div className="p-3 border-b border-dark-800 bg-dark-900/80 flex items-center justify-between gap-4">
        <form onSubmit={handleGenerate} className="flex-1 flex items-center gap-2 max-w-2xl">
          <input
            type="text"
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            placeholder="Ask Document AI to create a structured report (e.g. 'Security audit checklist' or 'Q3 product brief')..."
            className="flex-1 bg-dark-850 border border-dark-700 focus:border-purple-500 rounded-xl px-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!promptInput.trim() || isLoading}
            className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 disabled:opacity-40 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate PDF Doc</span>
          </button>
        </form>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3 py-2 rounded-xl bg-dark-800 hover:bg-dark-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={isExporting}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-bold text-xs flex items-center gap-2 shadow-md transition disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Generating...' : 'Download .PDF'}</span>
          </button>
        </div>
      </div>

      {/* Document Reader Container */}
      <div className="flex-1 p-6 md:p-10 overflow-y-auto flex justify-center">
        <div className="w-full max-w-3xl bg-dark-900 border border-dark-800 rounded-2xl p-8 md:p-12 shadow-xl text-slate-200">
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 uppercase tracking-wider mb-6 pb-4 border-b border-dark-800">
            <FileText className="w-4 h-4" />
            <span>Executive Document Preview</span>
          </div>

          <article className="prose prose-invert prose-purple max-w-none text-sm leading-relaxed">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => <h1 className="text-2xl font-bold text-white mb-2 pb-2 border-b border-dark-800">{children}</h1>,
                h2: ({ children }) => <h2 className="text-xl font-bold text-purple-300 mt-6 mb-3">{children}</h2>,
                h3: ({ children }) => <h3 className="text-base font-semibold text-slate-200 mt-4 mb-2">{children}</h3>,
                table: ({ children }) => (
                  <div className="overflow-x-auto my-4">
                    <table className="w-full text-left text-xs border border-dark-700 rounded-lg">{children}</table>
                  </div>
                ),
                th: ({ children }) => <th className="bg-dark-800 p-2.5 font-semibold text-purple-300 border-b border-dark-700">{children}</th>,
                td: ({ children }) => <td className="p-2.5 border-b border-dark-800/80">{children}</td>,
                ul: ({ children }) => <ul className="list-disc pl-5 my-3 space-y-1.5">{children}</ul>,
              }}
            >
              {content}
            </ReactMarkdown>
          </article>
        </div>
      </div>
    </div>
  );
};

export default DocumentView;
