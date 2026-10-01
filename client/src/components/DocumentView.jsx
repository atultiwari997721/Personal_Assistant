import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Download, FileText, Sparkles, Printer } from 'lucide-react';
import api from '../services/api.js';

export const DocumentView = ({ docMarkdown, onRunAgentPrompt, isLoading }) => {
  const content = docMarkdown || '';
  const [promptInput, setPromptInput] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [requestStatus, setRequestStatus] = useState('');

  const handleDownloadPdf = async () => {
    if (!content.trim()) {
      setRequestStatus('Create a document with the AI before exporting a PDF.');
      return;
    }
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
      setRequestStatus(err.response?.data?.message || 'Failed to export the PDF. Check the agent service and try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!promptInput.trim() || isLoading) return;
    setRequestStatus('');
    try {
      const result = await onRunAgentPrompt(promptInput.trim());
      if (result?.error) setRequestStatus(result.error);
      else if (result?.documentMarkdown) { setPromptInput(''); setRequestStatus('Document generated. Review it below before exporting.'); }
      else setRequestStatus('The provider returned no document. Check the connection and try again.');
    } catch (error) {
      setRequestStatus(error.message || 'Document generation failed. Check the provider connection and try again.');
    }
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
            disabled={!content.trim()}
            className="px-3 py-2 rounded-xl bg-dark-800 hover:bg-dark-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={isExporting || !content.trim()}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-bold text-xs flex items-center gap-2 shadow-md transition disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Generating...' : 'Download .PDF'}</span>
          </button>
        </div>
      </div>
      {requestStatus && <p role="status" className="border-b border-dark-800 bg-dark-900 px-4 py-2 text-xs text-amber-300">{requestStatus}</p>}

      {/* Document Reader Container */}
      <div className="flex-1 p-6 md:p-10 overflow-y-auto flex justify-center">
        <div className="w-full max-w-3xl bg-dark-900 border border-dark-800 rounded-2xl p-8 md:p-12 shadow-xl text-slate-200">
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 uppercase tracking-wider mb-6 pb-4 border-b border-dark-800">
            <FileText className="w-4 h-4" />
            <span>Executive Document Preview</span>
          </div>

          {content ? <article className="prose prose-invert prose-purple max-w-none text-sm leading-relaxed">
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
          </article> : <div className="min-h-64 flex flex-col items-center justify-center text-center text-slate-400"><FileText className="w-10 h-10 mb-3 text-purple-400" /><p className="text-sm font-semibold text-slate-200">No generated document yet</p><p className="mt-1 max-w-md text-xs">Describe the document you need above. A real provider response will appear here; export is enabled afterward.</p></div>}
        </div>
      </div>
    </div>
  );
};

export default DocumentView;
