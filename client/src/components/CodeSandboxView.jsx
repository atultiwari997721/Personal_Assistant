import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Copy, Check, Code, Eye, Sparkles, ExternalLink, RefreshCw } from 'lucide-react';

const DEFAULT_FULL_WEBSITE = `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cortex AI - Production Multi-Agent Platform</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <style>
    body { background-color: #07090e; color: #f8fafc; font-family: 'Plus Jakarta Sans', sans-serif; }
    .hero-glow { box-shadow: 0 0 60px -15px rgba(56, 189, 248, 0.4); }
    .glass-card { background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.08); }
  </style>
</head>
<body class="bg-[#07090e] text-slate-100 antialiased selection:bg-sky-500 selection:text-white">

  <!-- Top Announcement Bar -->
  <div class="bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 text-slate-950 font-bold text-xs py-2 px-4 text-center tracking-wide">
    ⚡ Announcing Cortex Multi-Agent Platform: 6 Specialized AI Agents, LangGraph, Qdrant RAG & Docker is Live!
  </div>

  <!-- Navigation Header -->
  <nav class="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800/80 px-6 py-4">
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-400 to-indigo-500 flex items-center justify-center font-black text-slate-950 shadow-md">
          ▲
        </div>
        <div>
          <span class="text-xl font-extrabold tracking-tight text-white">CORTEX AI</span>
          <span class="ml-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
            Multi-Agent SaaS
          </span>
        </div>
      </div>

      <!-- Desktop Nav Links -->
      <div class="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
        <a href="#features" class="hover:text-sky-400 transition">Features</a>
        <a href="#interactive" class="hover:text-sky-400 transition">Live Demo</a>
        <a href="#pricing" class="hover:text-sky-400 transition">Pricing</a>
        <a href="#faq" class="hover:text-sky-400 transition">FAQ</a>
      </div>

      <!-- Header CTAs -->
      <div class="flex items-center gap-3">
        <button onclick="openModal()" class="hidden sm:block text-xs font-semibold px-4 py-2 rounded-xl text-slate-300 hover:text-white transition">
          Sign In
        </button>
        <button onclick="openModal()" class="text-xs font-bold px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-400 to-indigo-500 hover:from-sky-300 hover:to-indigo-400 text-slate-950 shadow-md transition">
          Get Started Free
        </button>
      </div>
    </div>
  </nav>

  <!-- Hero Section -->
  <section class="relative pt-20 pb-28 px-6 overflow-hidden">
    <div class="max-w-5xl mx-auto text-center space-y-8">
      <div class="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-700/80 text-xs font-semibold text-sky-300 shadow-inner">
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        <span>Built for high-scale multi-tenant workloads</span>
      </div>

      <h1 class="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1]">
        Empowering Next-Gen Teams With <br />
        <span class="bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
          Multi-Agent Intelligence
        </span>
      </h1>

      <p class="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
        Seamlessly orchestrate intelligent agents, execute real-time vector queries, and deliver high-conversion digital experiences with 99.99% reliability.
      </p>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <button onclick="scrollToInteractive()" class="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-sky-400 to-indigo-500 hover:from-sky-300 hover:to-indigo-400 text-slate-950 font-black text-sm shadow-xl hero-glow transition transform hover:-translate-y-0.5">
          🚀 Test Live Sandbox Now
        </button>
        <button onclick="openModal()" class="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold text-sm transition">
          Book Architecture Review
        </button>
      </div>

      <!-- Trust Metrics -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 max-w-4xl mx-auto border-t border-slate-800/80 text-left">
        <div class="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <p class="text-2xl lg:text-3xl font-black text-white font-mono">99.99%</p>
          <p class="text-xs text-slate-400 mt-1">Uptime SLA</p>
        </div>
        <div class="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <p class="text-2xl lg:text-3xl font-black text-sky-400 font-mono">&lt; 15ms</p>
          <p class="text-xs text-slate-400 mt-1">Gateway P99 Latency</p>
        </div>
        <div class="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <p class="text-2xl lg:text-3xl font-black text-indigo-400 font-mono">1.2M+</p>
          <p class="text-xs text-slate-400 mt-1">Agent Tasks Handled</p>
        </div>
        <div class="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <p class="text-2xl lg:text-3xl font-black text-emerald-400 font-mono">0 Data Loss</p>
          <p class="text-xs text-slate-400 mt-1">Atomic Transactions</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Interactive Live Demo Sandbox Section -->
  <section id="interactive" class="py-20 px-6 bg-slate-950/60 border-y border-slate-800/80">
    <div class="max-w-4xl mx-auto space-y-6">
      <div class="text-center space-y-2">
        <span class="text-xs uppercase font-extrabold tracking-widest text-sky-400">Interactive Studio</span>
        <h2 class="text-3xl font-bold text-white tracking-tight">Try The Cortex Real-Time Workload Calculator</h2>
      </div>

      <!-- Functional Component Card -->
      <div class="glass-card rounded-3xl p-8 border border-slate-700/80 shadow-2xl space-y-6">
        <div class="flex items-center justify-between border-b border-slate-800 pb-4">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
            <span class="text-sm font-semibold text-slate-200">Active Live Simulation</span>
          </div>
          <span id="tierBadge" class="text-xs font-mono px-3 py-1 rounded-full bg-sky-500/10 text-sky-300 border border-sky-500/20">
            Scale: 10,000 req/min
          </span>
        </div>

        <!-- Slider Widget -->
        <div class="space-y-3">
          <div class="flex justify-between text-xs text-slate-300 font-medium">
            <span>Simulated Workload Volume:</span>
            <span id="volumeLabel" class="text-sky-400 font-mono font-bold">50,000 tasks/mo</span>
          </div>
          <input type="range" id="volumeSlider" min="5000" max="250000" step="5000" value="50000" oninput="updateSimulation(this.value)"
            class="w-full accent-sky-400 h-2 bg-slate-800 rounded-lg cursor-pointer">
        </div>

        <!-- Dynamic Output Stats -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <div class="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
            <span class="text-xs text-slate-400 block mb-1">Estimated Cost</span>
            <span id="calcCost" class="text-2xl font-black text-white font-mono">₹499/mo</span>
          </div>
          <div class="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
            <span class="text-xs text-slate-400 block mb-1">Throughput</span>
            <span id="calcThroughput" class="text-2xl font-black text-sky-400 font-mono">850 req/s</span>
          </div>
          <div class="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
            <span class="text-xs text-slate-400 block mb-1">Carbon Offset</span>
            <span id="calcOffset" class="text-2xl font-black text-emerald-400 font-mono">100% Net Zero</span>
          </div>
        </div>

        <div class="pt-2 text-center">
          <button onclick="triggerDemoExecution()" class="px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition shadow-md">
            ⚡ Run Synthetic Benchmark
          </button>
        </div>
      </div>
    </div>
  </section>

  <!-- Features Grid Section -->
  <section id="features" class="py-24 px-6 max-w-7xl mx-auto space-y-16">
    <div class="text-center space-y-3">
      <span class="text-xs uppercase font-extrabold tracking-widest text-sky-400">Pillars of Excellence</span>
      <h2 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Architected for Speed, Security & Scale</h2>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="glass-card rounded-3xl p-8 space-y-4 hover:border-sky-500/40 transition">
        <div class="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold text-xl">
          ⚡
        </div>
        <h3 class="text-xl font-bold text-white">LangGraph Orchestrator</h3>
        <p class="text-sm text-slate-400 leading-relaxed">
          Stateful multi-agent DAG engine coordinating specialized nodes for conversation, web search, code generation, slides, and images.
        </p>
      </div>

      <div class="glass-card rounded-3xl p-8 space-y-4 hover:border-indigo-500/40 transition">
        <div class="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-xl">
          🔍
        </div>
        <h3 class="text-xl font-bold text-white">Qdrant Vector Retrieval</h3>
        <p class="text-sm text-slate-400 leading-relaxed">
          Sub-millisecond cosine similarity search across indexed documentation, domain records, and persistent memory stores.
        </p>
      </div>

      <div class="glass-card rounded-3xl p-8 space-y-4 hover:border-purple-500/40 transition">
        <div class="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-xl">
          💳
        </div>
        <h3 class="text-xl font-bold text-white">Razorpay Monetization</h3>
        <p class="text-sm text-slate-400 leading-relaxed">
          Atomic credit accounting deducting 1 token per task with automated HMAC-SHA256 verified top-ups and webhooks.
        </p>
      </div>
    </div>
  </section>

  <!-- Pricing Comparison Section -->
  <section id="pricing" class="py-24 px-6 bg-slate-950/40 border-t border-slate-800">
    <div class="max-w-5xl mx-auto space-y-12">
      <div class="text-center space-y-3">
        <span class="text-xs uppercase font-extrabold tracking-widest text-sky-400">Flexible Pricing</span>
        <h2 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Invest in Production Scalability</h2>
        <div class="flex items-center justify-center gap-3 pt-2">
          <span class="text-xs text-slate-300 font-medium">Monthly</span>
          <button onclick="toggleBilling()" id="billingBtn" class="w-12 h-6 rounded-full bg-sky-500 p-1 transition relative">
            <div id="billingDot" class="w-4 h-4 rounded-full bg-slate-950 transition translate-x-0"></div>
          </button>
          <span class="text-xs text-sky-400 font-semibold">Annual (Save 20%)</span>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Starter -->
        <div class="glass-card rounded-3xl p-6 border border-slate-800 flex flex-col justify-between space-y-6">
          <div>
            <h3 class="text-lg font-bold text-white">Starter</h3>
            <p class="text-xs text-slate-400 mt-1">For indie hackers and prototyping</p>
            <div class="my-4">
              <span id="priceStarter" class="text-3xl font-black text-white font-mono">₹199</span>
              <span class="text-xs text-slate-500"> / pack</span>
            </div>
            <ul class="space-y-2.5 text-xs text-slate-300">
              <li>✓ 50 AI Agent Executions</li>
              <li>✓ Conversational & Search Agents</li>
              <li>✓ Qdrant Vector Memory</li>
              <li>✓ Community Discord Access</li>
            </ul>
          </div>
          <button onclick="openModal()" class="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition">Select Starter</button>
        </div>

        <!-- Pro -->
        <div class="glass-card rounded-3xl p-6 border border-sky-400 relative shadow-2xl flex flex-col justify-between space-y-6 bg-slate-900/90">
          <span class="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-sky-400 text-slate-950 font-extrabold text-[10px] uppercase tracking-wider">
            Most Popular
          </span>
          <div>
            <h3 class="text-lg font-bold text-white">Pro Architect</h3>
            <p class="text-xs text-slate-400 mt-1">For growing teams and SaaS apps</p>
            <div class="my-4">
              <span id="pricePro" class="text-3xl font-black text-sky-300 font-mono">₹699</span>
              <span class="text-xs text-slate-500"> / pack</span>
            </div>
            <ul class="space-y-2.5 text-xs text-slate-200">
              <li>✓ 250 AI Agent Executions</li>
              <li>✓ Live Code Sandbox Studio</li>
              <li>✓ Native .PPTX and .PDF Compilers</li>
              <li>✓ Priority Redis Session Caching</li>
            </ul>
          </div>
          <button onclick="openModal()" class="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs transition shadow-lg">Upgrade to Pro</button>
        </div>

        <!-- Enterprise -->
        <div class="glass-card rounded-3xl p-6 border border-slate-800 flex flex-col justify-between space-y-6">
          <div>
            <h3 class="text-lg font-bold text-white">Enterprise</h3>
            <p class="text-xs text-slate-400 mt-1">For mission-critical production</p>
            <div class="my-4">
              <span id="priceEnterprise" class="text-3xl font-black text-white font-mono">₹1,999</span>
              <span class="text-xs text-slate-500"> / pack</span>
            </div>
            <ul class="space-y-2.5 text-xs text-slate-300">
              <li>✓ 1,000 AI Agent Executions</li>
              <li>✓ Dedicated VPC & Custom LLMs</li>
              <li>✓ 99.99% Uptime Guarantee</li>
              <li>✓ 24/7 Priority SLA Support</li>
            </ul>
          </div>
          <button onclick="openModal()" class="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition">Contact Sales</button>
        </div>
      </div>
    </div>
  </section>

  <!-- Interactive FAQ Accordion Section -->
  <section id="faq" class="py-20 px-6 max-w-4xl mx-auto space-y-8">
    <div class="text-center space-y-2">
      <span class="text-xs uppercase font-extrabold tracking-widest text-sky-400">Have Questions?</span>
      <h2 class="text-3xl font-bold text-white">Frequently Asked Questions</h2>
    </div>

    <div class="space-y-3">
      <div class="glass-card rounded-2xl p-5 cursor-pointer" onclick="toggleFaq(1)">
        <div class="flex items-center justify-between font-bold text-sm text-slate-200">
          <span>How does the 1-credit per task system work?</span>
          <span id="faqIcon1">+</span>
        </div>
        <div id="faqAns1" class="hidden text-xs text-slate-400 mt-3 leading-relaxed">
          The API Gateway evaluates your account balance via Redis/MongoDB before dispatching tasks to LangGraph. Exactly 1 token is atomically deducted upon successful task resolution.
        </div>
      </div>

      <div class="glass-card rounded-2xl p-5 cursor-pointer" onclick="toggleFaq(2)">
        <div class="flex items-center justify-between font-bold text-sm text-slate-200">
          <span>Can I deploy this platform on AWS ECS Fargate?</span>
          <span id="faqIcon2">+</span>
        </div>
        <div id="faqAns2" class="hidden text-xs text-slate-400 mt-3 leading-relaxed">
          Yes! The included Docker Compose configurations and AWS architectural templates permit zero-downtime rolling deployments behind an Application Load Balancer.
        </div>
      </div>

      <div class="glass-card rounded-2xl p-5 cursor-pointer" onclick="toggleFaq(3)">
        <div class="flex items-center justify-between font-bold text-sm text-slate-200">
          <span>Which AI models does the platform support?</span>
          <span id="faqIcon3">+</span>
        </div>
        <div id="faqAns3" class="hidden text-xs text-slate-400 mt-3 leading-relaxed">
          The system supports OpenAI GPT-4o, Anthropic Claude, Groq LLaMA, Google Gemini, and open frontier models with automatic multi-model failover.
        </div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="border-t border-slate-800/80 bg-slate-950 py-12 px-6 text-center text-xs text-slate-500 space-y-4">
    <div class="flex items-center justify-center gap-2">
      <div class="w-6 h-6 rounded-lg bg-sky-500 flex items-center justify-center font-bold text-slate-950 text-xs">▲</div>
      <span class="font-bold text-slate-300 text-sm">CORTEX AI</span>
    </div>
    <p>© 2026 Cortex Multi-Agent Platform. Built with MERN, LangGraph, Qdrant, Docker & AWS.</p>
  </footer>

  <!-- Modal Popup -->
  <div id="authModal" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 hidden items-center justify-center p-4">
    <div class="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-bold text-white">Join Cortex AI Platform</h3>
        <button onclick="closeModal()" class="text-slate-400 hover:text-white">✕</button>
      </div>
      <p class="text-xs text-slate-400">Get 20 starter credits immediately upon sign up.</p>
      <input type="email" placeholder="you@company.com" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-sky-400">
      <button onclick="handleSubscribe()" class="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition">Continue to Platform</button>
    </div>
  </div>

  <script>
    let isAnnual = false;
    function updateSimulation(val) {
      document.getElementById('volumeLabel').innerText = Number(val).toLocaleString() + ' tasks/mo';
      const cost = Math.round((val / 50000) * 499 * (isAnnual ? 0.8 : 1));
      document.getElementById('calcCost').innerText = '₹' + cost + '/mo';
      document.getElementById('calcThroughput').innerText = Math.round(val / 60) + ' req/s';
    }
    function toggleBilling() {
      isAnnual = !isAnnual;
      const dot = document.getElementById('billingDot');
      dot.className = 'w-4 h-4 rounded-full bg-slate-950 transition ' + (isAnnual ? 'translate-x-6' : 'translate-x-0');
      document.getElementById('priceStarter').innerText = isAnnual ? '₹159' : '₹199';
      document.getElementById('pricePro').innerText = isAnnual ? '₹559' : '₹699';
      document.getElementById('priceEnterprise').innerText = isAnnual ? '₹1,599' : '₹1,999';
      updateSimulation(document.getElementById('volumeSlider').value);
    }
    function triggerDemoExecution() {
      alert('⚡ Benchmark complete: P99 latency = 11.2ms, Memory overhead = 42MB');
    }
    function toggleFaq(id) {
      const ans = document.getElementById('faqAns' + id);
      const icon = document.getElementById('faqIcon' + id);
      ans.classList.toggle('hidden');
      icon.innerText = ans.classList.contains('hidden') ? '+' : '−';
    }
    function openModal() {
      const m = document.getElementById('authModal');
      m.classList.remove('hidden');
      m.classList.add('flex');
    }
    function closeModal() {
      const m = document.getElementById('authModal');
      m.classList.add('hidden');
      m.classList.remove('flex');
    }
    function handleSubscribe() {
      alert('Thank you for registering! Access credentials dispatched.');
      closeModal();
    }
    function scrollToInteractive() {
      document.getElementById('interactive').scrollIntoView({ behavior: 'smooth' });
    }
  </script>
</body>
</html>`;

export const CodeSandboxView = ({ artifactCode, onRunAgentPrompt, isLoading }) => {
  const [code, setCode] = useState(artifactCode || DEFAULT_FULL_WEBSITE);
  const [previewSrc, setPreviewSrc] = useState(artifactCode || DEFAULT_FULL_WEBSITE);
  const [copied, setCopied] = useState(false);
  const [promptInput, setPromptInput] = useState('');

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

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!promptInput.trim() || isLoading) return;
    onRunAgentPrompt(promptInput.trim());
    setPromptInput('');
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
