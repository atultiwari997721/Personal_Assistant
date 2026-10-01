import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Download, Presentation, Sparkles, MessageSquare } from 'lucide-react';
import api from '../services/api.js';

export const PresentationView = ({ slides = [], onRunAgentPrompt, isLoading }) => {
  const currentSlides = slides || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showNotes, setShowNotes] = useState(true);
  const [promptInput, setPromptInput] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [requestStatus, setRequestStatus] = useState('');

  const activeSlide = currentSlides[currentIndex] || currentSlides[0];

  const handleNext = () => {
    if (currentIndex < currentSlides.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleDownloadPptx = async () => {
    if (!currentSlides.length) {
      setRequestStatus('Generate a presentation before exporting a PowerPoint file.');
      return;
    }
    try {
      setIsExporting(true);
      const response = await api.post(
        '/agents/export-pptx',
        { slides: currentSlides, title: 'Cortex_Presentation' },
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Cortex_Presentation.pptx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Failed to download PPTX:', err);
      setRequestStatus(err.response?.data?.message || 'Failed to export the presentation. Check the agent service and try again.');
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
      else if (result?.slides?.length) { setPromptInput(''); setCurrentIndex(0); setRequestStatus(`Generated ${result.slides.length} slides. Review before exporting.`); }
      else setRequestStatus('The provider returned no presentation. Check the connection and try again.');
    } catch (error) {
      setRequestStatus(error.message || 'Presentation generation failed. Check the provider connection and try again.');
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-dark-950">
      {/* Top Controls */}
      <div className="p-3 border-b border-dark-800 bg-dark-900/80 flex items-center justify-between gap-4">
        <form onSubmit={handleGenerate} className="flex-1 flex items-center gap-2 max-w-2xl">
          <input
            type="text"
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            placeholder="Ask Presentation AI to design slides (e.g. '5 slides on SaaS growth strategies')..."
            className="flex-1 bg-dark-850 border border-dark-700 focus:border-pink-500 rounded-xl px-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!promptInput.trim() || isLoading}
            className="px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-400 disabled:opacity-40 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate Deck</span>
          </button>
        </form>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNotes(!showNotes)}
            className="px-3 py-2 rounded-xl bg-dark-800 hover:bg-dark-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{showNotes ? 'Hide Notes' : 'Show Notes'}</span>
          </button>

          <button
            onClick={handleDownloadPptx}
            disabled={isExporting || !currentSlides.length}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white font-bold text-xs flex items-center gap-2 shadow-md transition disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Exporting...' : 'Download .PPTX'}</span>
          </button>
        </div>
      </div>
      {requestStatus && <p role="status" className="border-b border-dark-800 bg-dark-900 px-4 py-2 text-xs text-amber-300">{requestStatus}</p>}

      {/* Main Slide Stage */}
      <div className="flex-1 p-6 md:p-8 flex items-center justify-center overflow-auto">
        {activeSlide ? <div className="w-full max-w-4xl aspect-[16/9] bg-gradient-to-br from-slate-900 via-dark-900 to-slate-950 border border-dark-700/80 rounded-3xl p-8 md:p-12 flex flex-col justify-between shadow-2xl relative cortex-glow">
          {/* Slide Header */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-widest font-bold text-sky-400">
                Cortex Presentation Studio
              </span>
              <span className="px-2.5 py-1 rounded-full bg-dark-800 border border-dark-700 text-xs font-mono text-slate-400">
                Slide {currentIndex + 1} of {currentSlides.length}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-snug">
              {activeSlide?.title}
            </h2>
            <div className="w-16 h-1 bg-sky-400 rounded-full mt-3"></div>
          </div>

          {/* Bullet Points */}
          <div className="space-y-4 my-6">
            {(activeSlide?.bullet_points || []).map((pt, i) => (
              <div key={i} className="flex items-start gap-3.5">
                <div className="w-2.5 h-2.5 rounded-full bg-sky-400 mt-2 shrink-0"></div>
                <p className="text-base md:text-lg text-slate-200 leading-relaxed font-normal">
                  {pt}
                </p>
              </div>
            ))}
          </div>

          {/* Slide Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-dark-800 text-xs text-slate-500">
            <span>Powered by LangGraph Presentation Agent</span>
            <span>{activeSlide?.slide_number ? `Page ${activeSlide.slide_number}` : ''}</span>
          </div>
        </div> : <div className="w-full max-w-2xl rounded-2xl border border-dark-800 bg-dark-900 p-8 text-center text-slate-400"><Presentation className="mx-auto mb-3 h-10 w-10 text-pink-400" /><h2 className="text-sm font-semibold text-slate-200">No generated presentation yet</h2><p className="mt-1 text-xs">Describe the deck you need above. A real model response will appear here; export is enabled afterward.</p></div>}
      </div>

      {/* Slide Navigation & Speaker Notes Drawer */}
      <div className="p-4 border-t border-dark-800 bg-dark-900/90 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Carousel buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrev}
            disabled={!currentSlides.length || currentIndex === 0}
            className="p-2 rounded-xl bg-dark-800 hover:bg-dark-700 disabled:opacity-30 text-white transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-xs font-semibold text-slate-300">
            {currentSlides.length ? `Slide ${currentIndex + 1} / ${currentSlides.length}` : 'No slides'}
          </span>
          <button
            onClick={handleNext}
            disabled={!currentSlides.length || currentIndex === currentSlides.length - 1}
            className="p-2 rounded-xl bg-dark-800 hover:bg-dark-700 disabled:opacity-30 text-white transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Speaker notes */}
        {showNotes && (
          <div className="flex-1 max-w-2xl bg-dark-850 border border-dark-700/60 rounded-xl px-4 py-2 text-xs text-slate-300">
            <span className="font-semibold text-sky-400 mr-2">Speaker Notes:</span>
            {activeSlide?.speaker_notes || 'No speaker notes for this slide.'}
          </div>
        )}
      </div>
    </div>
  );
};

export default PresentationView;
