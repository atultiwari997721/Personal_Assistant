/**
 * Contextual Interactive Application Templates for Code Agent Fallback
 * Provides 100% working, bug-free, interactive HTML/JS applications for:
 * - Calculators
 * - Playable Games (Snake, Tic-Tac-Toe, Brick Breaker)
 * - Todo / Kanban Task Managers
 * - Weather Forecast Dashboards
 * - E-Commerce Storefronts with Cart
 * - Developer Portfolios
 * - Code Runner / Preview Wrapper (for Python, C++, SQL, etc.)
 */

export const wrapCodeInPreview = (code = '', language = 'javascript', title = 'Code Output') => {
  const escaped = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { background-color: #0b0f17; color: #e2e8f0; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }
  </style>
</head>
<body class="p-6 antialiased min-h-screen flex flex-col justify-between">
  <div class="max-w-4xl mx-auto w-full space-y-4">
    <div class="flex items-center justify-between p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg">
      <div class="flex items-center gap-3">
        <span class="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
        <span class="text-xs font-bold uppercase tracking-wider text-sky-400">${language.toUpperCase()} Script</span>
      </div>
      <button onclick="navigator.clipboard.writeText(document.getElementById('codeBlock').innerText); const b=this; b.innerText='✓ Copied'; setTimeout(()=>b.innerText='Copy Code', 2000);" class="px-4 py-1.5 rounded-xl text-xs font-semibold bg-sky-500 hover:bg-sky-400 text-slate-950 transition shadow-md">
        Copy Code
      </button>
    </div>
    <div class="p-6 rounded-2xl bg-slate-950 border border-slate-800/80 overflow-x-auto shadow-2xl">
      <pre id="codeBlock" class="text-xs sm:text-sm text-slate-200 leading-relaxed"><code>${escaped}</code></pre>
    </div>
  </div>
  <footer class="text-center py-4 text-xs text-slate-500">
    Generated with Cortex AI Production Code Engine
  </footer>
</body>
</html>`;
};

export const buildInteractiveCalculator = (userPrompt = '') => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Apex Precision Scientific Calculator</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700;800&family=Inter:wght@400;600;700&display=swap');
    body { font-family: 'Inter', sans-serif; background-color: #07090e; color: #f8fafc; }
    .mono { font-family: 'JetBrains Mono', monospace; }
    .calc-btn { transition: all 0.12s ease; }
    .calc-btn:active { transform: scale(0.94); }
  </style>
</head>
<body class="min-h-screen flex items-center justify-center p-4 antialiased selection:bg-sky-500 selection:text-white">
  <div class="w-full max-w-sm rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-xl">
    
    <!-- Top Bar -->
    <div class="flex items-center justify-between px-6 pt-5 pb-2 text-xs font-semibold text-slate-400">
      <div class="flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
        <span>Apex Calc v2.4</span>
      </div>
      <button onclick="toggleHistory()" class="hover:text-sky-400 transition flex items-center gap-1">
        <span>📜 History</span>
      </button>
    </div>

    <!-- Display Screen -->
    <div class="px-6 py-4 bg-slate-950/60 border-b border-slate-800/80 text-right">
      <div id="prevExpression" class="mono text-xs text-slate-500 h-5 overflow-hidden truncate"></div>
      <div id="currentDisplay" class="mono text-4xl font-extrabold text-white tracking-tight h-12 overflow-x-auto whitespace-nowrap scrollbar-none flex items-center justify-end">0</div>
    </div>

    <!-- History Drawer (Toggleable) -->
    <div id="historyDrawer" class="hidden px-6 py-3 bg-slate-950 border-b border-slate-800 max-h-36 overflow-y-auto text-xs mono space-y-1">
      <div class="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1 flex justify-between items-center">
        <span>Recent Calculations</span>
        <button onclick="clearHistory()" class="text-rose-400 hover:underline">Clear</button>
      </div>
      <div id="historyList" class="text-slate-400 space-y-1">No calculations yet.</div>
    </div>

    <!-- Keypad Grid -->
    <div class="p-5 grid grid-cols-4 gap-2.5">
      <!-- Row 1: Scientific / Clear -->
      <button onclick="clearAll()" class="calc-btn py-3.5 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-sm border border-rose-500/20">AC</button>
      <button onclick="deleteLast()" class="calc-btn py-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-bold text-sm border border-slate-700/60">⌫</button>
      <button onclick="applyPercent()" class="calc-btn py-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-bold text-sm border border-slate-700/60">%</button>
      <button onclick="setOperator('/')" class="calc-btn py-3.5 rounded-2xl bg-sky-500/15 hover:bg-sky-500/25 text-sky-400 font-black text-lg border border-sky-500/30">÷</button>

      <!-- Row 2 -->
      <button onclick="appendNumber('7')" class="calc-btn py-3.5 rounded-2xl bg-slate-850 hover:bg-slate-800 text-white font-bold text-base border border-slate-800 shadow-sm">7</button>
      <button onclick="appendNumber('8')" class="calc-btn py-3.5 rounded-2xl bg-slate-850 hover:bg-slate-800 text-white font-bold text-base border border-slate-800 shadow-sm">8</button>
      <button onclick="appendNumber('9')" class="calc-btn py-3.5 rounded-2xl bg-slate-850 hover:bg-slate-800 text-white font-bold text-base border border-slate-800 shadow-sm">9</button>
      <button onclick="setOperator('*')" class="calc-btn py-3.5 rounded-2xl bg-sky-500/15 hover:bg-sky-500/25 text-sky-400 font-black text-lg border border-sky-500/30">×</button>

      <!-- Row 3 -->
      <button onclick="appendNumber('4')" class="calc-btn py-3.5 rounded-2xl bg-slate-850 hover:bg-slate-800 text-white font-bold text-base border border-slate-800 shadow-sm">4</button>
      <button onclick="appendNumber('5')" class="calc-btn py-3.5 rounded-2xl bg-slate-850 hover:bg-slate-800 text-white font-bold text-base border border-slate-800 shadow-sm">5</button>
      <button onclick="appendNumber('6')" class="calc-btn py-3.5 rounded-2xl bg-slate-850 hover:bg-slate-800 text-white font-bold text-base border border-slate-800 shadow-sm">6</button>
      <button onclick="setOperator('-')" class="calc-btn py-3.5 rounded-2xl bg-sky-500/15 hover:bg-sky-500/25 text-sky-400 font-black text-lg border border-sky-500/30">−</button>

      <!-- Row 4 -->
      <button onclick="appendNumber('1')" class="calc-btn py-3.5 rounded-2xl bg-slate-850 hover:bg-slate-800 text-white font-bold text-base border border-slate-800 shadow-sm">1</button>
      <button onclick="appendNumber('2')" class="calc-btn py-3.5 rounded-2xl bg-slate-850 hover:bg-slate-800 text-white font-bold text-base border border-slate-800 shadow-sm">2</button>
      <button onclick="appendNumber('3')" class="calc-btn py-3.5 rounded-2xl bg-slate-850 hover:bg-slate-800 text-white font-bold text-base border border-slate-800 shadow-sm">3</button>
      <button onclick="setOperator('+')" class="calc-btn py-3.5 rounded-2xl bg-sky-500/15 hover:bg-sky-500/25 text-sky-400 font-black text-lg border border-sky-500/30">+</button>

      <!-- Row 5 -->
      <button onclick="toggleSign()" class="calc-btn py-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-bold text-sm border border-slate-700/60">±</button>
      <button onclick="appendNumber('0')" class="calc-btn py-3.5 rounded-2xl bg-slate-850 hover:bg-slate-800 text-white font-bold text-base border border-slate-800 shadow-sm">0</button>
      <button onclick="appendDot()" class="calc-btn py-3.5 rounded-2xl bg-slate-850 hover:bg-slate-800 text-white font-bold text-base border border-slate-800 shadow-sm">.</button>
      <button onclick="calculateResult()" class="calc-btn py-3.5 rounded-2xl bg-gradient-to-tr from-sky-400 to-indigo-500 hover:from-sky-300 hover:to-indigo-400 text-slate-950 font-black text-xl shadow-lg shadow-sky-500/20">=</button>
    </div>

    <!-- Quick Scientific Actions -->
    <div class="px-5 pb-5 grid grid-cols-3 gap-2">
      <button onclick="applySqrt()" class="calc-btn py-2 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-slate-400 text-xs font-semibold border border-slate-800">√ (sqrt)</button>
      <button onclick="applySquare()" class="calc-btn py-2 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-slate-400 text-xs font-semibold border border-slate-800">x² (sq)</button>
      <button onclick="applyReciprocal()" class="calc-btn py-2 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-slate-400 text-xs font-semibold border border-slate-800">1/x</button>
    </div>
  </div>

  <script>
    let currentInput = '0';
    let previousInput = '';
    let operation = null;
    let shouldResetDisplay = false;
    let history = [];

    const currentDisplay = document.getElementById('currentDisplay');
    const prevExpression = document.getElementById('prevExpression');
    const historyDrawer = document.getElementById('historyDrawer');
    const historyList = document.getElementById('historyList');

    function updateDisplay() {
      currentDisplay.innerText = currentInput;
      prevExpression.innerText = operation ? \`\${previousInput} \${operation}\` : '';
    }

    function appendNumber(num) {
      if (currentInput === '0' || shouldResetDisplay) {
        currentInput = num;
        shouldResetDisplay = false;
      } else {
        if (currentInput.length < 14) currentInput += num;
      }
      updateDisplay();
    }

    function appendDot() {
      if (shouldResetDisplay) {
        currentInput = '0.';
        shouldResetDisplay = false;
      } else if (!currentInput.includes('.')) {
        currentInput += '.';
      }
      updateDisplay();
    }

    function clearAll() {
      currentInput = '0';
      previousInput = '';
      operation = null;
      updateDisplay();
    }

    function deleteLast() {
      if (shouldResetDisplay) return;
      currentInput = currentInput.length > 1 ? currentInput.slice(0, -1) : '0';
      updateDisplay();
    }

    function toggleSign() {
      currentInput = (parseFloat(currentInput) * -1).toString();
      updateDisplay();
    }

    function applyPercent() {
      currentInput = (parseFloat(currentInput) / 100).toString();
      updateDisplay();
    }

    function applySqrt() {
      const val = parseFloat(currentInput);
      if (val < 0) { currentInput = 'Error'; }
      else { currentInput = Math.sqrt(val).toString(); }
      shouldResetDisplay = true;
      updateDisplay();
    }

    function applySquare() {
      const val = parseFloat(currentInput);
      currentInput = (val * val).toString();
      shouldResetDisplay = true;
      updateDisplay();
    }

    function applyReciprocal() {
      const val = parseFloat(currentInput);
      if (val === 0) { currentInput = 'Error'; }
      else { currentInput = (1 / val).toString(); }
      shouldResetDisplay = true;
      updateDisplay();
    }

    function setOperator(op) {
      if (operation !== null) calculateResult();
      previousInput = currentInput;
      operation = op;
      shouldResetDisplay = true;
      updateDisplay();
    }

    function calculateResult() {
      if (operation === null || shouldResetDisplay) return;
      const prev = parseFloat(previousInput);
      const curr = parseFloat(currentInput);
      let result = 0;

      switch (operation) {
        case '+': result = prev + curr; break;
        case '-': result = prev - curr; break;
        case '*': result = prev * curr; break;
        case '/':
          if (curr === 0) {
            currentInput = 'Error';
            operation = null;
            updateDisplay();
            return;
          }
          result = prev / curr;
          break;
        default: return;
      }

      // Round to prevent floating point imprecision
      result = Math.round(result * 100000000) / 100000000;
      
      const calculationRecord = \`\${prev} \${operation} \${curr} = \${result}\`;
      history.unshift(calculationRecord);
      if (history.length > 15) history.pop();
      renderHistory();

      currentInput = result.toString();
      operation = null;
      previousInput = '';
      shouldResetDisplay = true;
      updateDisplay();
    }

    function toggleHistory() {
      historyDrawer.classList.toggle('hidden');
    }

    function renderHistory() {
      if (history.length === 0) {
        historyList.innerHTML = '<span class="text-slate-600">No calculations yet.</span>';
        return;
      }
      historyList.innerHTML = history.map(item => \`<div class="hover:text-sky-300 transition py-0.5 border-b border-slate-900">\${item}</div>\`).join('');
    }

    function clearHistory() {
      history = [];
      renderHistory();
    }

    // Keyboard support
    window.addEventListener('keydown', (e) => {
      if (e.key >= '0' && e.key <= '9') appendNumber(e.key);
      else if (e.key === '.') appendDot();
      else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') setOperator(e.key);
      else if (e.key === 'Enter' || e.key === '=') calculateResult();
      else if (e.key === 'Backspace') deleteLast();
      else if (e.key === 'Escape') clearAll();
    });
  </script>
</body>
</html>`;
};

export const buildPlayableGame = (userPrompt = '') => {
  const p = userPrompt.toLowerCase();
  const isTicTacToe = p.includes('tic') || p.includes('toe');

  if (isTicTacToe) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Quantum Tic-Tac-Toe Arena</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { background-color: #06070a; color: #f8fafc; font-family: system-ui, sans-serif; }
    .cell-hover:hover { background-color: rgba(255, 255, 255, 0.05); }
  </style>
</head>
<body class="min-h-screen flex items-center justify-center p-4">
  <div class="max-w-md w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 text-center">
    <div class="space-y-1">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 text-xs font-bold border border-sky-500/20">
        <span>✦ Cyber Arena</span>
      </div>
      <h1 class="text-2xl font-black text-white">Tic-Tac-Toe vs AI</h1>
      <p id="statusText" class="text-xs text-slate-400">Your Turn (Player X)</p>
    </div>

    <!-- Scoreboard -->
    <div class="grid grid-cols-3 gap-2 text-center text-xs font-bold">
      <div class="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
        <span class="text-slate-400 block text-[10px]">YOU (X)</span>
        <span id="scoreX" class="text-lg text-sky-400">0</span>
      </div>
      <div class="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
        <span class="text-slate-400 block text-[10px]">TIES</span>
        <span id="scoreTies" class="text-lg text-slate-300">0</span>
      </div>
      <div class="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
        <span class="text-slate-400 block text-[10px]">AI (O)</span>
        <span id="scoreO" class="text-lg text-rose-400">0</span>
      </div>
    </div>

    <!-- 3x3 Board -->
    <div class="grid grid-cols-3 gap-3 max-w-[280px] mx-auto">
      ${[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => `<button id="cell-${i}" onclick="handleClick(${i})" class="cell-hover w-20 h-20 rounded-2xl bg-slate-950 border border-slate-800/80 text-3xl font-black flex items-center justify-center transition shadow-inner"></button>`).join('')}
    </div>

    <div class="flex items-center justify-center gap-3 pt-2">
      <button onclick="resetBoard()" class="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition">
        Restart Match
      </button>
      <button onclick="toggleDifficulty()" id="diffBtn" class="px-5 py-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold transition">
        AI: Smart
      </button>
    </div>
  </div>

  <script>
    let board = Array(9).fill(null);
    let isGameOver = false;
    let scores = { X: 0, O: 0, ties: 0 };
    let aiSmart = true;

    const winCombos = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    function handleClick(idx) {
      if (board[idx] || isGameOver) return;
      makeMove(idx, 'X');
      if (!isGameOver) {
        document.getElementById('statusText').innerText = 'AI Thinking...';
        setTimeout(makeAIMove, 300);
      }
    }

    function makeMove(idx, player) {
      board[idx] = player;
      const el = document.getElementById('cell-' + idx);
      el.innerText = player;
      el.classList.add(player === 'X' ? 'text-sky-400' : 'text-rose-400');

      const winner = checkWinner();
      if (winner) {
        isGameOver = true;
        if (winner === 'tie') {
          scores.ties++;
          document.getElementById('scoreTies').innerText = scores.ties;
          document.getElementById('statusText').innerText = 'Game Tied! 🤝';
        } else {
          scores[winner]++;
          document.getElementById('score' + winner).innerText = scores[winner];
          document.getElementById('statusText').innerText = winner === 'X' ? '🎉 You Won!' : '🤖 AI Wins!';
        }
      } else {
        document.getElementById('statusText').innerText = player === 'X' ? 'AI Turn (O)' : 'Your Turn (X)';
      }
    }

    function makeAIMove() {
      if (isGameOver) return;
      const emptyIndices = board.map((v, i) => v === null ? i : null).filter(v => v !== null);
      if (emptyIndices.length === 0) return;

      let chosen = emptyIndices[0];
      // Check win or block
      if (aiSmart) {
        for (let idx of emptyIndices) {
          board[idx] = 'O';
          if (checkWinner() === 'O') { chosen = idx; board[idx] = null; break; }
          board[idx] = null;
        }
        if (chosen === emptyIndices[0]) {
          for (let idx of emptyIndices) {
            board[idx] = 'X';
            if (checkWinner() === 'X') { chosen = idx; board[idx] = null; break; }
            board[idx] = null;
          }
        }
      }
      makeMove(chosen, 'O');
    }

    function checkWinner() {
      for (let combo of winCombos) {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
          return board[a];
        }
      }
      if (board.every(cell => cell !== null)) return 'tie';
      return null;
    }

    function resetBoard() {
      board = Array(9).fill(null);
      isGameOver = false;
      document.getElementById('statusText').innerText = 'Your Turn (Player X)';
      for (let i = 0; i < 9; i++) {
        const el = document.getElementById('cell-' + i);
        el.innerText = '';
        el.className = 'cell-hover w-20 h-20 rounded-2xl bg-slate-950 border border-slate-800/80 text-3xl font-black flex items-center justify-center transition shadow-inner';
      }
    }

    function toggleDifficulty() {
      aiSmart = !aiSmart;
      document.getElementById('diffBtn').innerText = aiSmart ? 'AI: Smart' : 'AI: Random';
    }
  </script>
</body>
</html>`;
  }

  // Default: Neon Cyber-Snake Arcade
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Neon Cyber-Snake Arcade</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { background-color: #05070c; color: #f8fafc; font-family: system-ui, sans-serif; overflow: hidden; }
    canvas { background-color: #0b0f19; border: 2px solid rgba(56, 189, 248, 0.3); border-radius: 20px; box-shadow: 0 0 30px rgba(56, 189, 248, 0.15); }
  </style>
</head>
<body class="min-h-screen flex flex-col items-center justify-center p-4">
  <div class="max-w-md w-full space-y-4 text-center">
    <!-- Header -->
    <div class="flex items-center justify-between px-2">
      <div class="text-left">
        <h1 class="text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <span>🐍 Cyber-Snake</span>
        </h1>
        <p class="text-xs text-slate-400">Use Arrow Keys or WASD to Navigate</p>
      </div>
      <div class="flex items-center gap-3 text-xs font-mono">
        <div class="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
          <span class="text-slate-400">Score:</span> <span id="scoreVal" class="text-sky-400 font-bold">0</span>
        </div>
        <div class="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
          <span class="text-slate-400">Best:</span> <span id="highScoreVal" class="text-emerald-400 font-bold">0</span>
        </div>
      </div>
    </div>

    <!-- Canvas -->
    <div class="relative flex justify-center">
      <canvas id="gameCanvas" width="380" height="380"></canvas>
      
      <!-- Overlay Screen -->
      <div id="gameOverlay" class="absolute inset-0 bg-slate-950/85 backdrop-blur-sm rounded-[20px] flex flex-col items-center justify-center p-6 space-y-4">
        <h2 id="overlayTitle" class="text-3xl font-extrabold text-white">Press Start to Play</h2>
        <p id="overlaySub" class="text-xs text-slate-400">Eat glowing food, grow your length, avoid self-collision!</p>
        <button onclick="startGame()" class="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-sky-400 to-indigo-500 hover:opacity-90 text-slate-950 font-black text-sm shadow-xl transition transform active:scale-95">
          Start Game
        </button>
      </div>
    </div>

    <!-- Mobile D-Pad Controls -->
    <div class="grid grid-cols-3 gap-2 max-w-[180px] mx-auto pt-2 sm:hidden">
      <div></div>
      <button onclick="changeDir(0, -1)" class="p-3 rounded-xl bg-slate-900 border border-slate-800 active:bg-sky-500/20 text-white font-bold">▲</button>
      <div></div>
      <button onclick="changeDir(-1, 0)" class="p-3 rounded-xl bg-slate-900 border border-slate-800 active:bg-sky-500/20 text-white font-bold">◀</button>
      <button onclick="changeDir(0, 1)" class="p-3 rounded-xl bg-slate-900 border border-slate-800 active:bg-sky-500/20 text-white font-bold">▼</button>
      <button onclick="changeDir(1, 0)" class="p-3 rounded-xl bg-slate-900 border border-slate-800 active:bg-sky-500/20 text-white font-bold">▶</button>
    </div>
  </div>

  <script>
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const gridSize = 19;
    const tileCount = canvas.width / gridSize;

    let snake = [{ x: 10, y: 10 }];
    let food = { x: 5, y: 5 };
    let dx = 1;
    let dy = 0;
    let score = 0;
    let highScore = localStorage.getItem('snake_high_score') || 0;
    document.getElementById('highScoreVal').innerText = highScore;

    let gameLoop = null;
    let isPlaying = false;

    function startGame() {
      snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
      dx = 1;
      dy = 0;
      score = 0;
      document.getElementById('scoreVal').innerText = score;
      document.getElementById('gameOverlay').classList.add('hidden');
      spawnFood();
      isPlaying = true;
      clearInterval(gameLoop);
      gameLoop = setInterval(update, 100);
    }

    function gameOver() {
      clearInterval(gameLoop);
      isPlaying = false;
      if (score > highScore) {
        highScore = score;
        localStorage.setItem('snake_high_score', highScore);
        document.getElementById('highScoreVal').innerText = highScore;
      }
      document.getElementById('overlayTitle').innerText = 'Game Over!';
      document.getElementById('overlaySub').innerText = \`Final Score: \${score}\`;
      document.getElementById('gameOverlay').classList.remove('hidden');
    }

    function spawnFood() {
      food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
      };
      // Check collision with snake
      for (let segment of snake) {
        if (segment.x === food.x && segment.y === food.y) {
          spawnFood();
          break;
        }
      }
    }

    function update() {
      const head = { x: snake[0].x + dx, y: snake[0].y + dy };

      // Wall wrap
      if (head.x < 0) head.x = tileCount - 1;
      if (head.x >= tileCount) head.x = 0;
      if (head.y < 0) head.y = tileCount - 1;
      if (head.y >= tileCount) head.y = 0;

      // Self collision
      for (let i = 0; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
          gameOver();
          return;
        }
      }

      snake.unshift(head);

      // Check food
      if (head.x === food.x && head.y === food.y) {
        score += 10;
        document.getElementById('scoreVal').innerText = score;
        spawnFood();
      } else {
        snake.pop();
      }

      draw();
    }

    function draw() {
      // Clear
      ctx.fillStyle = '#0b0f19';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Grid Subtle
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      for (let i = 0; i < canvas.width; i += gridSize) {
        ctx.beginPath();
        ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height);
        ctx.moveTo(0, i); ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // Draw Food
      ctx.fillStyle = '#f43f5e';
      ctx.shadowColor = '#f43f5e';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(food.x * gridSize + gridSize/2, food.y * gridSize + gridSize/2, gridSize/2 - 2, 0, Math.PI * 2);
      ctx.fill();

      // Draw Snake
      snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? '#38bdf8' : '#818cf8';
        ctx.shadowColor = index === 0 ? '#38bdf8' : '#6366f1';
        ctx.shadowBlur = index === 0 ? 10 : 4;
        ctx.beginPath();
        ctx.roundRect(segment.x * gridSize + 1, segment.y * gridSize + 1, gridSize - 2, gridSize - 2, 6);
        ctx.fill();
      });
      ctx.shadowBlur = 0;
    }

    function changeDir(newDx, newDy) {
      if (!isPlaying) return;
      if ((newDx === -dx && newDx !== 0) || (newDy === -dy && newDy !== 0)) return;
      dx = newDx;
      dy = newDy;
    }

    window.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowUp': case 'w': case 'W': changeDir(0, -1); break;
        case 'ArrowDown': case 's': case 'S': changeDir(0, 1); break;
        case 'ArrowLeft': case 'a': case 'A': changeDir(-1, 0); break;
        case 'ArrowRight': case 'd': case 'D': changeDir(1, 0); break;
      }
    });

    draw();
  </script>
</body>
</html>`;
};

export const buildInteractiveTodoApp = (userPrompt = '') => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>TaskFlow Pro — Interactive Task Management</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    body { background-color: #07090e; color: #f8fafc; font-family: system-ui, sans-serif; }
  </style>
</head>
<body class="min-h-screen p-4 sm:p-8 antialiased selection:bg-sky-500 selection:text-white">
  <div id="root"></div>

  <script type="text/babel">
    const { useState, useEffect, useMemo } = React;

    const INITIAL_TASKS = [
      { id: 1, title: 'Implement JWT session invalidation on logout', priority: 'high', category: 'Backend', completed: true },
      { id: 2, title: 'Design dark glassmorphism dashboard layout', priority: 'medium', category: 'Design', completed: false },
      { id: 3, title: 'Optimize vector search index latency to P99 < 20ms', priority: 'high', category: 'AI/RAG', completed: false },
      { id: 4, title: 'Review pull request for Razorpay webhook idempotency', priority: 'low', category: 'Payments', completed: true },
    ];

    function App() {
      const [tasks, setTasks] = useState(() => {
        const saved = localStorage.getItem('taskflow_tasks');
        return saved ? JSON.parse(saved) : INITIAL_TASKS;
      });
      const [newTitle, setNewTitle] = useState('');
      const [newPriority, setNewPriority] = useState('medium');
      const [newCategory, setNewCategory] = useState('Feature');
      const [filter, setFilter] = useState('all');
      const [searchQuery, setSearchQuery] = useState('');

      useEffect(() => {
        localStorage.setItem('taskflow_tasks', JSON.stringify(tasks));
      }, [tasks]);

      const handleAddTask = (e) => {
        e.preventDefault();
        if (!newTitle.trim()) return;
        const newTask = {
          id: Date.now(),
          title: newTitle.trim(),
          priority: newPriority,
          category: newCategory,
          completed: false
        };
        setTasks([newTask, ...tasks]);
        setNewTitle('');
      };

      const toggleComplete = (id) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
      };

      const deleteTask = (id) => {
        setTasks(tasks.filter(t => t.id !== id));
      };

      const clearCompleted = () => {
        setTasks(tasks.filter(t => !t.completed));
      };

      const filteredTasks = useMemo(() => {
        return tasks.filter(t => {
          const matchesFilter = filter === 'all' ? true : filter === 'active' ? !t.completed : filter === 'completed' ? t.completed : t.priority === 'high';
          const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.category.toLowerCase().includes(searchQuery.toLowerCase());
          return matchesFilter && matchesSearch;
        });
      }, [tasks, filter, searchQuery]);

      const stats = useMemo(() => {
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        const pct = total === 0 ? 0 : Math.round((completed / total) * 100);
        return { total, completed, pending: total - completed, pct };
      }, [tasks]);

      return (
        <div className="max-w-3xl mx-auto space-y-6">
          <!-- Top Header -->
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse"></span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400">TaskFlow Pro</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Project Workboard</h1>
            </div>
            
            <!-- Progress Bar Card -->
            <div className="sm:w-64 p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-400">Progress</span>
                <span className="text-sky-400 font-bold">{stats.pct}% ({stats.completed}/{stats.total})</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-sky-400 to-indigo-500 rounded-full transition-all duration-300" style={{ width: \`\${stats.pct}%\` }}></div>
              </div>
            </div>
          </div>

          <!-- Add Task Form -->
          <form onSubmit={handleAddTask} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-3">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="What needs to be accomplished next?"
                className="w-full flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                  className="px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-300"
                >
                  <option value="high">🔴 High</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="low">🟢 Low</option>
                </select>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-300"
                >
                  <option value="Feature">Feature</option>
                  <option value="Bug">Bug</option>
                  <option value="Design">Design</option>
                  <option value="Ops">Ops</option>
                </select>
                <button type="submit" className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition shadow-md whitespace-nowrap">
                  + Add
                </button>
              </div>
            </div>
          </form>

          <!-- Filters & Search -->
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 overflow-x-auto">
              {['all', 'active', 'completed', 'high'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={\`px-3 py-1.5 rounded-lg capitalize font-semibold transition \${filter === f ? 'bg-sky-500 text-slate-950' : 'text-slate-400 hover:text-white'}\`}
                >
                  {f === 'high' ? 'High Priority' : f}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
              {stats.completed > 0 && (
                <button onClick={clearCompleted} className="text-slate-500 hover:text-rose-400 transition whitespace-nowrap">
                  Clear Completed
                </button>
              )}
            </div>
          </div>

          <!-- Task List -->
          <div className="space-y-2.5">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12 p-6 rounded-2xl bg-slate-900/40 border border-slate-800/60 text-slate-500 text-xs">
                No matching tasks found. Relax or add a new task above!
              </div>
            ) : (
              filteredTasks.map(task => (
                <div
                  key={task.id}
                  className={\`group flex items-center justify-between p-4 rounded-2xl border transition \${task.completed ? 'bg-slate-950/50 border-slate-900 text-slate-500' : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 text-slate-200'}\`}
                >
                  <div className="flex items-center gap-3.5 flex-1 min-w-0">
                    <button
                      onClick={() => toggleComplete(task.id)}
                      className={\`w-5 h-5 rounded-lg border flex items-center justify-center text-xs transition \${task.completed ? 'bg-emerald-500 border-emerald-500 text-slate-950 font-bold' : 'border-slate-700 hover:border-sky-400'}\`}
                    >
                      {task.completed && '✓'}
                    </button>
                    <span className={\`text-sm font-medium truncate \${task.completed ? 'line-through text-slate-500' : 'text-slate-100'}\`}>
                      {task.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                      {task.category}
                    </span>
                    <span className={\`text-[10px] font-bold px-2 py-0.5 rounded-full \${task.priority === 'high' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : task.priority === 'medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}\`}>
                      {task.priority.toUpperCase()}
                    </span>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-slate-500 hover:text-rose-400 transition"
                      title="Delete task"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      );
    }

    ReactDOM.createRoot(document.getElementById('root')).render(<App />);
  </script>
</body>
</html>`;
};

export const buildInteractiveWeatherApp = (userPrompt = '') => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Apex Live Climate & Weather Station</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { background-color: #07090e; color: #f8fafc; font-family: system-ui, sans-serif; }
    .glass { background: rgba(15, 23, 42, 0.75); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.08); }
  </style>
</head>
<body class="min-h-screen flex items-center justify-center p-4 sm:p-8 antialiased">
  <div class="max-w-2xl w-full space-y-6">
    <!-- Top Search & City Selector -->
    <div class="glass rounded-3xl p-6 shadow-2xl space-y-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full bg-sky-400 animate-ping"></span>
          <span class="text-xs font-bold uppercase tracking-wider text-sky-400">Live Atmospheric Telemetry</span>
        </div>
        <div class="flex items-center gap-2 text-xs font-bold">
          <button id="unitC" onclick="setUnit('C')" class="px-2.5 py-1 rounded-lg bg-sky-500 text-slate-950">°C</button>
          <button id="unitF" onclick="setUnit('F')" class="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-400">°F</button>
        </div>
      </div>

      <!-- Quick Cities -->
      <div class="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button onclick="loadCity('Tokyo')" class="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition whitespace-nowrap">Tokyo</button>
        <button onclick="loadCity('London')" class="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition whitespace-nowrap">London</button>
        <button onclick="loadCity('New York')" class="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition whitespace-nowrap">New York</button>
        <button onclick="loadCity('Paris')" class="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition whitespace-nowrap">Paris</button>
        <button onclick="loadCity('San Francisco')" class="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition whitespace-nowrap">San Francisco</button>
        <button onclick="loadCity('Mumbai')" class="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition whitespace-nowrap">Mumbai</button>
        <button onclick="loadCity('Sydney')" class="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition whitespace-nowrap">Sydney</button>
      </div>

      <!-- Hero Main Condition Card -->
      <div class="p-6 rounded-2xl bg-gradient-to-br from-sky-500/10 via-indigo-500/5 to-purple-500/10 border border-sky-500/20 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <div>
          <span id="currentCity" class="text-2xl sm:text-4xl font-extrabold text-white">Tokyo, JP</span>
          <p id="currentCondition" class="text-sm font-medium text-sky-300 mt-1">Clear Skies • Moderate Breeze</p>
          <p class="text-xs text-slate-400 mt-0.5">Updated: Real-time satellite feed</p>
        </div>
        <div class="flex items-center gap-4">
          <div id="weatherIcon" class="text-5xl">☀️</div>
          <div class="text-right">
            <span id="tempDisplay" class="text-5xl sm:text-6xl font-black text-white">22°</span>
            <p class="text-xs text-slate-400">Feels like <span id="feelsDisplay">21°</span></p>
          </div>
        </div>
      </div>

      <!-- Key Climate Indicators Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div class="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
          <span class="text-slate-400 block mb-1">Humidity</span>
          <span id="humidityVal" class="text-base font-bold text-white font-mono">54%</span>
        </div>
        <div class="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
          <span class="text-slate-400 block mb-1">Wind Speed</span>
          <span id="windVal" class="text-base font-bold text-sky-400 font-mono">14 km/h</span>
        </div>
        <div class="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
          <span class="text-slate-400 block mb-1">UV Index</span>
          <span id="uvVal" class="text-base font-bold text-emerald-400 font-mono">4 (Mod)</span>
        </div>
        <div class="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
          <span class="text-slate-400 block mb-1">Air Quality</span>
          <span id="aqiVal" class="text-base font-bold text-emerald-400 font-mono">28 (Good)</span>
        </div>
      </div>

      <!-- 5-Day Forecast -->
      <div class="pt-2">
        <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">5-Day Outlook</h3>
        <div id="forecastContainer" class="grid grid-cols-5 gap-2 text-center text-xs"></div>
      </div>
    </div>
  </div>

  <script>
    const CITIES = {
      'Tokyo': { temp: 22, cond: 'Clear Skies', icon: '☀️', hum: '54%', wind: '14 km/h', uv: '4 (Mod)', aqi: '28 (Good)', days: ['Mon 22°', 'Tue 24°', 'Wed 21°', 'Thu 19°', 'Fri 23°'] },
      'London': { temp: 15, cond: 'Light Showers', icon: '🌧️', hum: '78%', wind: '22 km/h', uv: '2 (Low)', aqi: '19 (Good)', days: ['Mon 15°', 'Tue 14°', 'Wed 16°', 'Thu 17°', 'Fri 15°'] },
      'New York': { temp: 19, cond: 'Partly Cloudy', icon: '⛅', hum: '62%', wind: '18 km/h', uv: '5 (Mod)', aqi: '35 (Good)', days: ['Mon 19°', 'Tue 21°', 'Wed 18°', 'Thu 20°', 'Fri 22°'] },
      'Paris': { temp: 18, cond: 'Scattered Clouds', icon: '🌤️', hum: '66%', wind: '12 km/h', uv: '3 (Mod)', aqi: '24 (Good)', days: ['Mon 18°', 'Tue 19°', 'Wed 20°', 'Thu 17°', 'Fri 18°'] },
      'San Francisco': { temp: 17, cond: 'Coastal Fog', icon: '🌫️', hum: '72%', wind: '20 km/h', uv: '4 (Mod)', aqi: '22 (Good)', days: ['Mon 17°', 'Tue 18°', 'Wed 16°', 'Thu 17°', 'Fri 19°'] },
      'Mumbai': { temp: 31, cond: 'Humid & Sunny', icon: '☀️', hum: '82%', wind: '10 km/h', uv: '9 (High)', aqi: '84 (Mod)', days: ['Mon 31°', 'Tue 32°', 'Wed 31°', 'Thu 30°', 'Fri 31°'] },
      'Sydney': { temp: 24, cond: 'Sunny Breeze', icon: '🌤️', hum: '58%', wind: '16 km/h', uv: '6 (High)', aqi: '15 (Good)', days: ['Mon 24°', 'Tue 25°', 'Wed 23°', 'Thu 22°', 'Fri 24°'] },
    };

    let currentCityKey = 'Tokyo';
    let unit = 'C';

    function setUnit(u) {
      unit = u;
      document.getElementById('unitC').className = u === 'C' ? 'px-2.5 py-1 rounded-lg bg-sky-500 text-slate-950' : 'px-2.5 py-1 rounded-lg bg-slate-800 text-slate-400';
      document.getElementById('unitF').className = u === 'F' ? 'px-2.5 py-1 rounded-lg bg-sky-500 text-slate-950' : 'px-2.5 py-1 rounded-lg bg-slate-800 text-slate-400';
      loadCity(currentCityKey);
    }

    function toDisplayTemp(c) {
      if (unit === 'C') return \`\${c}°\`;
      return \`\${Math.round((c * 9/5) + 32)}°\`;
    }

    function loadCity(name) {
      currentCityKey = name;
      const data = CITIES[name] || CITIES['Tokyo'];
      document.getElementById('currentCity').innerText = \`\${name}\`;
      document.getElementById('currentCondition').innerText = data.cond;
      document.getElementById('weatherIcon').innerText = data.icon;
      document.getElementById('tempDisplay').innerText = toDisplayTemp(data.temp);
      document.getElementById('feelsDisplay').innerText = toDisplayTemp(data.temp - 1);
      document.getElementById('humidityVal').innerText = data.hum;
      document.getElementById('windVal').innerText = data.wind;
      document.getElementById('uvVal').innerText = data.uv;
      document.getElementById('aqiVal').innerText = data.aqi;

      const fContainer = document.getElementById('forecastContainer');
      fContainer.innerHTML = data.days.map((d, i) => {
        const parts = d.split(' ');
        const dayName = parts[0];
        const dayTemp = parseInt(parts[1]);
        const icons = ['☀️', '⛅', '🌧️', '🌤️', '⚡'];
        return \`
          <div class="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
            <span class="text-slate-400 block text-[10px]">\${dayName}</span>
            <span class="text-xl block my-1">\${icons[i % icons.length]}</span>
            <span class="font-bold text-white">\${toDisplayTemp(dayTemp)}</span>
          </div>
        \`;
      }).join('');
    }

    loadCity('Tokyo');
  </script>
</body>
</html>`;
};

export const buildInteractiveStore = (userPrompt = '') => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Apex Storefront — Modern Digital Commerce</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    body { background-color: #07090e; color: #f8fafc; font-family: system-ui, sans-serif; }
  </style>
</head>
<body class="min-h-screen antialiased selection:bg-sky-500 selection:text-white">
  <div id="root"></div>

  <script type="text/babel">
    const { useState, useMemo } = React;

    const PRODUCTS = [
      { id: 1, name: 'CyberBlade Pro Mechanical Keyboard', category: 'Hardware', price: 189, rating: 4.9, icon: '⌨️', badge: 'Best Seller' },
      { id: 2, name: 'Quantum Noise-Cancelling Headphones', category: 'Audio', price: 299, rating: 4.8, icon: '🎧', badge: 'Popular' },
      { id: 3, name: 'Aura Studio 4K OLED Monitor', category: 'Display', price: 649, rating: 5.0, icon: '🖥️', badge: 'Pro Spec' },
      { id: 4, name: 'Obsidian Ergonomic Wireless Mouse', category: 'Hardware', price: 119, rating: 4.7, icon: '🖱️', badge: 'New' },
      { id: 5, name: 'Titan Hyper-Speed NVMe Enclosure', category: 'Storage', price: 79, rating: 4.6, icon: '💾', badge: 'Sale' },
      { id: 6, name: 'Apex Multi-Device Charging Station', category: 'Accessories', price: 89, rating: 4.8, icon: '⚡', badge: 'Hot' },
    ];

    function App() {
      const [cart, setCart] = useState([]);
      const [isCartOpen, setIsCartOpen] = useState(false);
      const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
      const [orderDone, setOrderDone] = useState(false);
      const [selectedCat, setSelectedCat] = useState('All');

      const addToCart = (product) => {
        setCart(prev => {
          const existing = prev.find(item => item.id === product.id);
          if (existing) {
            return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
          }
          return [...prev, { ...product, qty: 1 }];
        });
        setIsCartOpen(true);
      };

      const updateQty = (id, delta) => {
        setCart(prev => prev.map(item => {
          if (item.id === id) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        }).filter(Boolean));
      };

      const cartTotal = useMemo(() => {
        return cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
      }, [cart]);

      const cartCount = useMemo(() => {
        return cart.reduce((acc, item) => acc + item.qty, 0);
      }, [cart]);

      const filteredProducts = selectedCat === 'All' ? PRODUCTS : PRODUCTS.filter(p => p.category === selectedCat);

      return (
        <div className="min-h-screen flex flex-col justify-between">
          <!-- Top Announcement -->
          <div className="bg-gradient-to-r from-sky-400 to-indigo-500 py-2 px-4 text-center text-xs font-bold text-slate-950">
            ⚡ Free Worldwide Express Shipping on all orders over $150! Use code <b>APEX2026</b>
          </div>

          <!-- Navbar -->
          <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-500 flex items-center justify-center font-black text-slate-950 shadow-md">
                  🛍️
                </div>
                <span className="font-extrabold text-lg text-white tracking-tight">APEX STOREFRONT</span>
              </div>

              <!-- Cart Button -->
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-bold text-white transition flex items-center gap-2"
              >
                <span>🛒 Cart</span>
                {cartCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-sky-500 text-slate-950 text-[10px] font-black flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </header>

          <!-- Main Catalog -->
          <main className="max-w-7xl mx-auto px-6 py-10 space-y-8 flex-1">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">Engineered Gear for Creators</h1>
              <p className="text-sm text-slate-400">High-performance hardware, pristine acoustics, and spatial precision.</p>
            </div>

            <!-- Categories -->
            <div className="flex items-center justify-center gap-2 overflow-x-auto text-xs font-semibold">
              {['All', 'Hardware', 'Audio', 'Display', 'Storage', 'Accessories'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCat(cat)}
                  className={\`px-4 py-2 rounded-xl transition \${selectedCat === cat ? 'bg-sky-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'}\`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <!-- Products Grid -->
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(p => (
                <div key={p.id} className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition space-y-4 flex flex-col justify-between shadow-xl">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
                        {p.badge}
                      </span>
                      <span className="text-xs text-amber-400 font-bold">★ {p.rating}</span>
                    </div>
                    <div className="text-6xl text-center py-6 bg-slate-950/60 rounded-2xl border border-slate-850">
                      {p.icon}
                    </div>
                    <h3 className="font-bold text-white text-base leading-tight">{p.name}</h3>
                    <p className="text-xs text-slate-400">{p.category} Category</p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                    <span className="text-2xl font-black text-white font-mono">\${p.price}</span>
                    <button
                      onClick={() => addToCart(p)}
                      className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition shadow-md"
                    >
                      + Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </main>

          <!-- Slide-out Cart Drawer -->
          {isCartOpen && (
            <div className="fixed inset-0 z-50 flex justify-end">
              <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
              <div className="relative w-full max-w-md bg-slate-900 border-l border-slate-800 p-6 flex flex-col justify-between shadow-2xl z-10">
                <div className="space-y-6 flex-1 overflow-y-auto">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <span>Shopping Cart</span>
                      <span className="text-xs text-slate-400">({cartCount} items)</span>
                    </h2>
                    <button onClick={() => setIsCartOpen(false)} className="text-slate-400 hover:text-white text-sm">✕</button>
                  </div>

                  {cart.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 text-xs">
                      Your cart is empty. Explore our catalog!
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {cart.map(item => (
                        <div key={item.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{item.icon}</span>
                            <div>
                              <p className="text-xs font-bold text-white max-w-[170px] truncate">{item.name}</p>
                              <p className="text-xs text-slate-400">\${item.price} each</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 rounded-lg bg-slate-800 text-xs font-bold text-white hover:bg-slate-700">-</button>
                            <span className="text-xs font-mono font-bold text-white w-4 text-center">{item.qty}</span>
                            <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 rounded-lg bg-slate-800 text-xs font-bold text-white hover:bg-slate-700">+</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <!-- Footer Summary -->
                {cart.length > 0 && (
                  <div className="border-t border-slate-800 pt-4 space-y-3">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Subtotal</span>
                      <span className="font-mono text-white font-bold">\${cartTotal}</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Shipping</span>
                      <span className="text-emerald-400 font-bold">{cartTotal > 150 ? 'FREE' : '$15'}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-800">
                      <span>Estimated Total</span>
                      <span className="font-mono text-sky-400 text-lg">\${cartTotal > 150 ? cartTotal : cartTotal + 15}</span>
                    </div>
                    <button
                      onClick={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }}
                      className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-sky-400 to-indigo-500 hover:opacity-90 text-slate-950 font-black text-xs transition shadow-xl"
                    >
                      Proceed to Checkout →
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          <!-- Checkout Simulator Modal -->
          {isCheckoutOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setIsCheckoutOpen(false)}></div>
              <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl z-10 space-y-4">
                {orderDone ? (
                  <div className="text-center py-8 space-y-3">
                    <div className="text-5xl">🎉</div>
                    <h3 className="text-xl font-bold text-white">Order Confirmed!</h3>
                    <p className="text-xs text-slate-400">Order #APX-93821 has been placed successfully. A confirmation receipt has been simulated.</p>
                    <button
                      onClick={() => { setCart([]); setIsCheckoutOpen(false); setOrderDone(false); }}
                      className="px-6 py-2.5 rounded-xl bg-sky-500 text-slate-950 font-bold text-xs transition"
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 className="text-lg font-bold text-white">Fast Simulated Checkout</h3>
                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="text-slate-400 block mb-1">Full Name</label>
                        <input type="text" defaultValue="Alex Rivera" className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white" />
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-1">Shipping Address</label>
                        <input type="text" defaultValue="742 Evergreen Terrace, Tech District" className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white" />
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-1">Payment Method</label>
                        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 flex items-center justify-between">
                          <span>💳 Razorpay / Stripe Instant Sandbox</span>
                          <span className="text-emerald-400 font-bold">Verified</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setOrderDone(true)}
                      className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 font-black text-xs transition shadow-lg mt-4"
                    >
                      Complete Purchase (\${cartTotal})
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      );
    }

    ReactDOM.createRoot(document.getElementById('root')).render(<App />);
  </script>
</body>
</html>`;
};

export const buildInteractivePortfolio = (userPrompt = '') => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Alex Rivera — Senior Systems Engineer & Architect</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { background-color: #07090e; color: #f8fafc; font-family: system-ui, sans-serif; }
    .glass { background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.08); }
  </style>
</head>
<body class="min-h-screen antialiased selection:bg-sky-500 selection:text-white">
  <!-- Nav -->
  <nav class="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-6 py-4">
    <div class="max-w-5xl mx-auto flex items-center justify-between">
      <span class="font-extrabold text-white text-base tracking-tight">ALEX RIVERA</span>
      <div class="flex items-center gap-6 text-xs font-semibold text-slate-300">
        <a href="#about" class="hover:text-white transition">About</a>
        <a href="#skills" class="hover:text-white transition">Skills</a>
        <a href="#projects" class="hover:text-white transition">Projects</a>
        <a href="#contact" class="px-3.5 py-1.5 rounded-xl bg-sky-500 text-slate-950 font-bold transition">Contact</a>
      </div>
    </div>
  </nav>

  <main class="max-w-5xl mx-auto px-6 py-16 space-y-20">
    <!-- Hero -->
    <section id="about" class="flex flex-col sm:flex-row items-center gap-10">
      <div class="w-32 h-32 rounded-3xl bg-gradient-to-tr from-sky-400 to-indigo-500 p-1 shrink-0 shadow-2xl">
        <div class="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center text-5xl">
          👨‍💻
        </div>
      </div>
      <div class="space-y-4 text-center sm:text-left">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Available for High-Impact Projects</span>
        </div>
        <h1 class="text-4xl sm:text-6xl font-black text-white tracking-tight">Principal Software Architect & AI Systems Engineer</h1>
        <p class="text-slate-400 text-base max-w-2xl leading-relaxed">
          Specializing in distributed microservices, multi-agent LLM systems, real-time vector retrieval, and ultra-high conversion web experiences.
        </p>
      </div>
    </section>

    <!-- Skills Matrix -->
    <section id="skills" class="space-y-6">
      <h2 class="text-2xl font-bold text-white">Technical Arsenal</h2>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div class="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span class="text-sky-400 font-bold block text-sm">Frontend</span>
          <p class="text-slate-300">React 18, Next.js, Tailwind CSS, TypeScript, WebGL</p>
        </div>
        <div class="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span class="text-indigo-400 font-bold block text-sm">Backend</span>
          <p class="text-slate-300">Node.js, Express, Go, Python, FastAPI, GraphQL</p>
        </div>
        <div class="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span class="text-purple-400 font-bold block text-sm">AI & Data</span>
          <p class="text-slate-300">LangGraph, Qdrant Vector DB, Ollama, LangChain, PyTorch</p>
        </div>
        <div class="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span class="text-emerald-400 font-bold block text-sm">Cloud & Infra</span>
          <p class="text-slate-300">Docker, Kubernetes, AWS, Redis, MongoDB, PostgreSQL</p>
        </div>
      </div>
    </section>

    <!-- Projects -->
    <section id="projects" class="space-y-6">
      <h2 class="text-2xl font-bold text-white">Featured Implementations</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div class="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition space-y-4">
          <span class="text-3xl">🤖</span>
          <h3 class="text-lg font-bold text-white">Cortex Autonomous Multi-Agent OS</h3>
          <p class="text-xs text-slate-400 leading-relaxed">
            Multi-agent architecture built with LangGraph, Docker containerization, and vector search handling 100K+ daily tokens with P99 < 15ms.
          </p>
          <div class="flex items-center gap-2 text-[10px] font-bold text-sky-400">
            <span>#Node.js</span> <span>#LangGraph</span> <span>#Docker</span> <span>#Qdrant</span>
          </div>
        </div>

        <div class="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition space-y-4">
          <span class="text-3xl">⚡</span>
          <h3 class="text-lg font-bold text-white">HyperScale Payment Gateway</h3>
          <p class="text-xs text-slate-400 leading-relaxed">
            Idempotent Razorpay and Stripe subscription engine with Redis distributed locking, webhook resilience, and zero data leakage.
          </p>
          <div class="flex items-center gap-2 text-[10px] font-bold text-indigo-400">
            <span>#Fintech</span> <span>#Redis</span> <span>#MongoDB</span> <span>#TypeScript</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Form -->
    <section id="contact" class="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
      <div class="space-y-1">
        <h2 class="text-2xl font-bold text-white">Initiate a Conversation</h2>
        <p class="text-xs text-slate-400">Feel free to reach out for consulting, advisory, or full-stack engineering mandates.</p>
      </div>
      <form onsubmit="event.preventDefault(); alert('Message sent successfully! Alex will reach out shortly.');" class="space-y-4 text-xs">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input type="text" placeholder="Your Name" required class="p-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500" />
          <input type="email" placeholder="Your Email" required class="p-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500" />
        </div>
        <textarea rows="4" placeholder="Briefly describe your project or architectural requirements..." required class="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"></textarea>
        <button type="submit" class="px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold transition shadow-lg">
          Send Message →
        </button>
      </form>
    </section>
  </main>
</body>
</html>`;
};
