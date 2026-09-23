import React, { useState } from 'react';
import { Download, Sparkles, ExternalLink, Maximize2, X, Image as ImageIcon } from 'lucide-react';

const DEFAULT_GALLERY = [
  {
    id: 'img-1',
    prompt: 'Futuristic AI neural core floating in a cyberpunk server room',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=80',
    tags: ['Cyberpunk', 'Volumetric Lighting', '8K'],
  },
  {
    id: 'img-2',
    prompt: 'Autonomous drone fleet traversing neon metropolitan skyline',
    url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1000&auto=format&fit=crop&q=80',
    tags: ['Sci-Fi', 'Cinematic', 'Unreal Engine 5'],
  },
  {
    id: 'img-3',
    prompt: 'Minimalist glass geometric architecture in misty redwood forest',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1000&auto=format&fit=crop&q=80',
    tags: ['Architecture', 'Hyper-Realistic', 'Atmospheric'],
  },
];

export const ImageGalleryView = ({ newImage, onRunAgentPrompt, isLoading }) => {
  const [gallery, setGallery] = useState(DEFAULT_GALLERY);
  const [promptInput, setPromptInput] = useState('');
  const [selectedImg, setSelectedImg] = useState(null);

  React.useEffect(() => {
    if (newImage && newImage.imageUrl) {
      setGallery((prev) => [
        {
          id: `img_${Date.now()}`,
          prompt: newImage.expandedPrompt || 'AI Concept Render',
          url: newImage.imageUrl,
          tags: ['Prompt Engineered', '1024x1024', 'Cinematic'],
        },
        ...prev,
      ]);
    }
  }, [newImage]);

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!promptInput.trim() || isLoading) return;
    onRunAgentPrompt(promptInput.trim());
    setPromptInput('');
  };

  const handleDownload = (imgUrl, filename = 'cortex-ai-image.jpg') => {
    const link = document.createElement('a');
    link.href = imgUrl;
    link.target = '_blank';
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-dark-950">
      {/* Top Prompt Engineering Input */}
      <div className="p-3 border-b border-dark-800 bg-dark-900/80 flex items-center justify-between gap-4">
        <form onSubmit={handleGenerate} className="flex-1 flex items-center gap-2 max-w-3xl">
          <input
            type="text"
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            placeholder="Enter concept (e.g. 'Cyberpunk AI server core' or 'Floating solar city on Jupiter')..."
            className="flex-1 bg-dark-850 border border-dark-700 focus:border-indigo-500 rounded-xl px-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!promptInput.trim() || isLoading}
            className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate Visual Art</span>
          </button>
        </form>
      </div>

      {/* Gallery Grid */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {gallery.map((item) => (
            <div
              key={item.id}
              className="group relative bg-dark-900 border border-dark-800 rounded-2xl overflow-hidden shadow-lg transition hover:border-indigo-500/50 flex flex-col justify-between"
            >
              <div className="relative aspect-square overflow-hidden bg-dark-950">
                <img
                  src={item.url}
                  alt={item.prompt}
                  className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-4 justify-between">
                  <button
                    onClick={() => setSelectedImg(item)}
                    className="p-2 rounded-xl bg-dark-900/80 text-white hover:bg-dark-800 transition"
                    title="Zoom"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDownload(item.url)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-2.5">
                <p className="text-xs text-slate-300 font-medium line-clamp-2 leading-relaxed">
                  {item.prompt}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-dark-800 text-indigo-400 border border-dark-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Zoom Preview */}
      {selectedImg && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full bg-dark-900 border border-dark-700 rounded-3xl overflow-hidden shadow-2xl p-4">
            <button
              onClick={() => setSelectedImg(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-dark-950/80 text-slate-300 hover:text-white transition z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={selectedImg.url}
              alt={selectedImg.prompt}
              className="w-full max-h-[70vh] object-contain rounded-2xl"
            />
            <div className="pt-4 flex items-center justify-between">
              <p className="text-xs text-slate-300 max-w-xl truncate">{selectedImg.prompt}</p>
              <button
                onClick={() => handleDownload(selectedImg.url)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition"
              >
                <Download className="w-4 h-4" />
                <span>Save Full Image</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGalleryView;
