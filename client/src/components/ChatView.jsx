import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check, Bot, User, Sparkles, Send } from 'lucide-react';
import ModelSelector from './ModelSelector.jsx';
import api from '../services/api.js';
import { getPluginConfigs } from '../services/pluginActions.js';

const ACTION_NAMES = { gmail: 'Gmail', calendar: 'Google Calendar', whatsapp: 'WhatsApp' };

const PluginActionCard = ({ draft, onConfirm, onNavigate }) => {
  const [fields, setFields] = useState(draft);
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const configs = getPluginConfigs();
  const connected = draft.type === 'whatsapp'
    ? Boolean(configs.whatsapp?.accessToken && configs.whatsapp?.phoneNumberId)
    : Boolean(configs.google?.accessToken);
  const required = draft.type === 'calendar'
    ? Boolean(fields.title && fields.startsAt && fields.endsAt)
    : Boolean(fields.to && fields.body && (draft.type !== 'gmail' || fields.subject));
  const update = (key, value) => setFields((state) => ({ ...state, [key]: value }));
  const controlClass = 'w-full rounded-lg border border-slate-300 dark:border-dark-700 bg-white dark:bg-dark-950 px-3 py-2 text-xs';
  const label = (name, key, options = {}) => <label key={key} className="block text-xs font-medium text-slate-600 dark:text-slate-300">{name}<input type={options.type || 'text'} value={fields[key] || ''} onChange={(event) => update(key, event.target.value)} className={`${controlClass} mt-1`} /></label>;
  const submit = async () => {
    setBusy(true); setStatus('Sending…');
    try {
      const result = await onConfirm(fields);
      setStatus(result.message || 'Action completed.');
    } catch (error) {
      setStatus(error.response?.data?.message || error.message || 'Could not complete action.');
    } finally { setBusy(false); }
  };

  return <div className="mt-4 rounded-xl border border-sky-500/30 bg-sky-500/5 p-3.5 space-y-3">
    <div className="flex items-center justify-between gap-2"><div><p className="font-semibold text-xs text-slate-800 dark:text-slate-100">{ACTION_NAMES[draft.type]} action draft</p><p className="text-[11px] text-slate-500 mt-0.5">Review the details. KritiAI waits for your confirmation.</p></div><span className="text-[10px] rounded-full px-2 py-1 bg-slate-100 dark:bg-dark-800">{connected ? 'Connected details saved' : 'Not connected'}</span></div>
    {draft.type === 'calendar' ? <div className="grid sm:grid-cols-3 gap-2">{label('Event title', 'title')}{label('Starts', 'startsAt', { type: 'datetime-local' })}{label('Ends', 'endsAt', { type: 'datetime-local' })}</div> : <div className="grid sm:grid-cols-2 gap-2">{label(draft.type === 'whatsapp' ? 'Phone number (include country code)' : 'Recipient email', 'to')}{draft.type === 'gmail' && label('Subject', 'subject')}<label className="block text-xs font-medium text-slate-600 dark:text-slate-300 sm:col-span-2">Message<input value={fields.body || ''} onChange={(event) => update('body', event.target.value)} className={`${controlClass} mt-1`} /></label></div>}
    {connected ? <button type="button" disabled={!required || busy || status.endsWith('sent.') || status.endsWith('created.')} onClick={submit} className="rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-50 px-3 py-2 text-xs font-semibold text-white">{busy ? 'Working…' : draft.type === 'calendar' ? 'Confirm and create event' : 'Confirm and send'}</button> : <button type="button" onClick={() => onNavigate('api')} className="rounded-lg bg-sky-600 hover:bg-sky-500 px-3 py-2 text-xs font-semibold text-white">Connect in API &amp; Plugins</button>}
    {status && <p role="status" className="text-xs text-slate-600 dark:text-slate-300">{status}</p>}
  </div>;
};

const CodeBlock = ({ inline, className, children, ...props }) => {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const codeString = String(children).replace(/\n$/, '');

  const handleCopy = () => {
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!inline && match) {
    return (
      <div className="relative my-4 rounded-xl overflow-hidden border border-slate-700 dark:border-dark-700 bg-slate-950 dark:bg-dark-950 font-mono text-xs shadow-md">
        <div className="flex items-center justify-between px-4 py-1.5 bg-slate-900 dark:bg-dark-900 border-b border-slate-800 dark:border-dark-800 text-slate-400">
          <span className="font-semibold text-sky-400 uppercase tracking-wide text-[11px]">{match[1]}</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 transition py-0.5 px-2 rounded hover:bg-slate-800 dark:hover:bg-dark-800"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Code'}</span>
          </button>
        </div>
        <div className="p-4 overflow-x-auto text-slate-200 leading-relaxed">
          <code>{children}</code>
        </div>
      </div>
    );
  }

  return (
    <code className="bg-slate-200/80 dark:bg-dark-800 text-sky-600 dark:text-sky-300 px-1.5 py-0.5 rounded font-mono text-xs" {...props}>
      {children}
    </code>
  );
};

export const ChatView = ({ messages, isLoading, onSendMessage, onPluginAction, onNavigate = () => {} }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput('');
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3.5 max-w-4xl mx-auto ${
                isUser ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs shadow-md ${
                  isUser
                    ? 'bg-gradient-to-tr from-sky-500 to-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-dark-800 border border-slate-200 dark:border-dark-700 text-sky-600 dark:text-sky-400'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`flex-1 rounded-2xl px-5 py-4 border ${
                  isUser
                    ? 'bg-sky-500/10 border-sky-500/30 text-slate-800 dark:text-slate-100 max-w-2xl'
                    : 'bg-white dark:bg-dark-900/90 border-slate-200 dark:border-dark-800 text-slate-800 dark:text-slate-200 shadow-sm'
                }`}
              >
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center justify-between">
                  <span>{isUser ? 'You' : `Agent (${msg.agent || 'Intelligence'})`}</span>
                  {!isUser && msg.data?.metadata?.provider && (
                    <span className="text-slate-400 dark:text-slate-500">
                      {msg.data.metadata.provider} · {msg.data.metadata.model}
                    </span>
                  )}
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="prose dark:prose-invert prose-sky max-w-none text-sm leading-relaxed">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code: CodeBlock,
                      p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
                      h1: ({ children }) => <h1 className="text-xl font-bold text-slate-900 dark:text-white mt-4 mb-2">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-lg font-bold text-sky-600 dark:text-sky-300 mt-3 mb-2">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mt-2 mb-1">{children}</h3>,
                      ul: ({ children }) => <ul className="list-disc pl-5 my-2 space-y-1">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal pl-5 my-2 space-y-1">{children}</ol>,
                      table: ({ children }) => (
                        <div className="overflow-x-auto my-3">
                          <table className="w-full text-left text-xs border border-slate-200 dark:border-dark-700 rounded-lg">{children}</table>
                        </div>
                      ),
                      th: ({ children }) => <th className="bg-slate-100 dark:bg-dark-800 p-2 font-semibold text-sky-700 dark:text-sky-300 border-b border-slate-200 dark:border-dark-700">{children}</th>,
                      td: ({ children }) => <td className="p-2 border-b border-slate-200 dark:border-dark-800/80">{children}</td>,
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
                {isUser && msg.data?.pluginDraft && <PluginActionCard draft={msg.data.pluginDraft} onConfirm={onPluginAction} onNavigate={onNavigate} />}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-3.5 max-w-4xl mx-auto">
            <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-dark-800 border border-slate-200 dark:border-dark-700 flex items-center justify-center text-sky-500 dark:text-sky-400">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-800 rounded-2xl px-5 py-3 text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping"></span>
              <span>LangGraph Orchestrator processing query & evaluating node state...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-4 border-t border-slate-200 dark:border-dark-800 bg-white/80 dark:bg-dark-900/60 backdrop-blur-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between mb-2.5 px-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">AI Provider:</span>
            <ModelSelector />
          </div>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 hidden sm:inline font-medium">
            AI provider configured on the agent service
          </span>
        </div>
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative flex items-center">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && localStorage.getItem('kritiai_enter_to_send') !== 'false') {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Type your message or instruction (Press Enter to send, Shift+Enter for newline)..."
            rows={1}
            className="w-full bg-slate-100 dark:bg-dark-850 border border-slate-300 dark:border-dark-700 focus:border-sky-500 rounded-2xl py-3.5 pl-4 pr-14 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none resize-none shadow-inner transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2.5 p-2 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-40 disabled:hover:bg-sky-500 text-slate-950 font-semibold transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatView;
