import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Copy, Check, Code, Eye, Sparkles, ExternalLink, RefreshCw } from 'lucide-react';
import ProjectWorkspace from './ProjectWorkspace.jsx';

const EMPTY_HTML_TEMPLATE = '<!doctype html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>New project</title>\n</head>\n<body>\n</body>\n</html>';

export const CodeSandboxView = ({ artifactCode, onRunAgentPrompt, isLoading, selectedModel = 'auto' }) => {
  const [code, setCode] = useState(artifactCode || EMPTY_HTML_TEMPLATE);
  const [previewSrc, setPreviewSrc] = useState(artifactCode || EMPTY_HTML_TEMPLATE);
  const [copied, setCopied] = useState(false);
  const [promptInput, setPromptInput] = useState('');
  const [requestStatus, setRequestStatus] = useState('');

  useEffect(() => {
    if (artifactCode) {
      setCode(artifactCode);
      setPreviewSrc(artifactCode);
    }
  }, [artifactCode]);

  const handleRun = () => {
    setPreviewSrc(code);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!promptInput.trim() || isLoading) return;
    setRequestStatus('');
    try {
      const result = await onRunAgentPrompt(promptInput.trim());
      if (result?.error) setRequestStatus(result.error);
      else if (result?.sandboxCode) {
        setCode(result.sandboxCode);
        setPreviewSrc(result.sandboxCode);
        setPromptInput('');
        setRequestStatus('Code generated and loaded into the preview. Review it before saving it to a project.');
      } else if (result?.content) {
        setRequestStatus('The model replied but did not return a runnable code block. Ask it to include code in a fenced block.');
      } else setRequestStatus('The coding agent returned no result. Check the provider connection and try again.');
    } catch (error) {
      setRequestStatus(error.message || 'The coding request failed. Check the provider connection and try again.');
    }
  };

  const handleOpenNewTab = () => {
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-dark-950">
      {/* Code Agent Prompt Bar */}
      <div className="p-3 border-b border-dark-800 bg-dark-900/80 flex items-center gap-3">
        <form onSubmit={handleGenerate} className="flex-1 flex items-center gap-2">
          <input
            type="text"
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            placeholder="Ask Code Agent to build any website or app (e.g. 'Build a crypto trading landing page' or 'Build a scientific calculator' or 'Build an agency portfolio')..."
            className="flex-1 bg-dark-850 border border-dark-700 focus:border-amber-400 rounded-xl px-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!promptInput.trim() || isLoading}
            className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Synthesizing Website...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate Full Website</span>
              </>
            )}
          </button>
        </form>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRun}
            className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition"
            title="Re-render Sandbox"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Run Live</span>
          </button>

          <button
            onClick={handleOpenNewTab}
            className="p-2 rounded-xl bg-dark-800 hover:bg-dark-700 text-slate-300 hover:text-white transition"
            title="Open Sandbox in Full Tab"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
      {requestStatus && <p role="status" className="border-b border-dark-800 bg-dark-900 px-4 py-2 text-xs text-amber-300">{requestStatus}</p>}

      <ProjectWorkspace code={code} onRunAgentPrompt={onRunAgentPrompt} selectedModel={selectedModel} />

      {/* Split-Screen Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-dark-800 overflow-hidden">
        {/* Left Panel: Code Editor */}
        <div className="flex flex-col h-full overflow-hidden bg-dark-950">
          <div className="h-10 border-b border-dark-800 bg-dark-900/60 px-4 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2 font-mono">
              <Code className="w-4 h-4 text-amber-400" />
              <span>index.html (Structural Source Code • {code.split('\n').length} lines)</span>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-slate-400 hover:text-slate-200 transition py-1 px-2 rounded hover:bg-dark-800"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <div className="flex-1 p-2 overflow-auto">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck="false"
              className="w-full h-full p-3 font-mono text-xs text-slate-200 bg-transparent focus:outline-none resize-none leading-relaxed selection:bg-amber-500/30"
            />
          </div>
        </div>

        {/* Right Panel: Live Sandbox Preview */}
        <div className="flex flex-col h-full overflow-hidden bg-slate-950">
          <div className="h-10 border-b border-dark-800 bg-dark-900/60 px-4 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2 font-medium">
              <Eye className="w-4 h-4 text-emerald-400" />
              <span>Interactive Live Preview Sandbox</span>
            </div>
            <button
              onClick={() => setPreviewSrc(code)}
              className="p-1 hover:text-slate-200 rounded hover:bg-dark-800 transition"
              title="Refresh Preview"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex-1 w-full h-full relative">
            <iframe
              srcDoc={previewSrc}
              title="Live Sandbox"
              sandbox="allow-scripts allow-modals allow-same-origin"
              className="w-full h-full border-none bg-dark-950"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeSandboxView;
