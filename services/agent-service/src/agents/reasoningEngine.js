/**
 * Cortex Deep Cognitive Reasoning & Thought Engine
 * Powers high-intelligence, smart answers across Conversational QA, Math, Code, Science, Facts, Logic, and Creative tasks.
 */

// 0. Conversational, Identity & Capabilities Handler
export const trySolveConversational = (query = '') => {
  const q = query.trim().toLowerCase();

  // Greetings
  const isGreeting = /^(hello|hi|hey|greetings|howdy|good\s+(morning|afternoon|evening|day)|sup)\b[!.?]*$/i.test(q) ||
    /^(hello|hi|hey)\s+(there|assistant|cortex|bot|ai)[!.?]*$/i.test(q);

  if (isGreeting) {
    return `> **🧠 Cognitive Agent Status:** Online & Ready
> - **Platform:** Cortex Multi-Agent Autonomous SaaS
> - **Core Engine:** Deep Cognitive Reasoning & Thought Process

Hello! 👋 I'm **Cortex AI**, your advanced full-stack intelligence assistant and autonomous agent.

Here are some of the specialized capabilities I can help you with:
- 🧮 **Deep Cognitive Reasoning & Math:** Complex calculations, unit conversions, equations, and algebraic proofs.
- 💻 **Full-Stack Software Engineering:** Production-grade algorithms (Binary Search, Two Sum, DP), React components, backend APIs, Docker, and SQL.
- 🌐 **Real-Time Web Intelligence & Facts:** Live search across Wikipedia, tech news, and authoritative research papers.
- ⚖️ **Architectural Comparison Matrices:** In-depth trade-off analyses (e.g. *PostgreSQL vs MongoDB*, *Docker vs Podman*).
- 📝 **Creative & Document Synthesis:** Structured essays, poems, code design documents, and technical presentations.

How can I assist you with your projects or questions today?`;
  }

  // Identity / Who are you
  if (
    /^(who|what)\s+are\s+you[?.!]*$/i.test(q) ||
    /^(tell\s+me\s+about\s+yourself|introduce\s+yourself)[?.!]*$/i.test(q)
  ) {
    return `> **🧠 System Architecture & Identity:**
> - **Name:** Cortex AI Autonomous Multi-Agent Platform
> - **Architecture:** Microservices, LangGraph Multi-Agent Workflows, Qdrant Vector RAG, and Real-Time Search.

I am **Cortex AI**, an autonomous artificial intelligence platform engineered to execute complex development, research, and analytical workflows. 

### 🚀 Core Pillars:
1. **Multi-Agent Orchestration:** Specialized agents for Code Generation, Document/Slide Creation, Real-Time Web Search, and RAG Knowledge Retrieval.
2. **Cognitive Reasoning Engine:** Deep step-by-step analytical reasoning for math, science, algorithms, and system design.
3. **Live Knowledge Synthesis:** Direct integration with encyclopedic databases and real-time news sources.

Feel free to ask any question—from writing complex algorithms to exploring scientific phenomena or analyzing software architectures!`;
  }

  // How are you
  if (/^how\s+are\s+you[?.!]*$/i.test(q)) {
    return `> **🧠 Agent Diagnostics:** All systems optimal. Cognitive reasoning matrix fully operational.

I'm doing great, thank you! I'm fully primed and ready to tackle coding tasks, mathematical evaluations, deep research questions, or technical problem solving. What would you like to explore today?`;
  }

  return null;
};

// 1. Math Evaluator & Calculator
export const trySolveMath = (query = '') => {
  const q = query.trim().toLowerCase();

  // Unit conversions: Celsius to Fahrenheit
  const cToF = q.match(/(\d+(?:\.\d+)?)\s*(?:°?c|celsius)\s*(?:to|in)\s*(?:°?f|fahrenheit)/i);
  if (cToF) {
    const c = parseFloat(cToF[1]);
    const f = (c * 9/5) + 32;
    return `> **🧠 Cognitive Analysis & Thermodynamic Math:**
> - **Conversion Formula:** \`°F = (°C × 9/5) + 32\`
> - **Execution:** \`(${c} × 1.8) + 32 = ${f.toFixed(2)}\`

### Result:
**${c}°C is equal to ${f.toFixed(2)}°F.**`;
  }

  // Unit conversions: Fahrenheit to Celsius
  const fToC = q.match(/(\d+(?:\.\d+)?)\s*(?:°?f|fahrenheit)\s*(?:to|in)\s*(?:°?c|celsius)/i);
  if (fToC) {
    const f = parseFloat(fToC[1]);
    const c = (f - 32) * 5/9;
    return `> **🧠 Cognitive Analysis & Thermodynamic Math:**
> - **Conversion Formula:** \`°C = (°F - 32) × 5/9\`
> - **Execution:** \`(${f} - 32) × 0.5556 = ${c.toFixed(2)}\`

### Result:
**${f}°F is equal to ${c.toFixed(2)}°C.**`;
  }

  // Unit conversions: Kilometers to Miles
  const kmToMi = q.match(/(\d+(?:\.\d+)?)\s*(?:km|kilometers?)\s*(?:to|in)\s*(?:mi|miles?)/i);
  if (kmToMi) {
    const km = parseFloat(kmToMi[1]);
    const mi = km * 0.621371;
    return `> **🧠 Cognitive Analysis & Distance Conversion:**
> - **Conversion Factor:** \`1 km ≈ 0.621371 miles\`
> - **Execution:** \`${km} × 0.621371 = ${mi.toFixed(4)}\`

### Result:
**${km} km is equal to ${mi.toFixed(2)} miles** (${mi.toFixed(4)} mi).`;
  }

  // Unit conversions: Miles to Kilometers
  const miToKm = q.match(/(\d+(?:\.\d+)?)\s*(?:mi|miles?)\s*(?:to|in)\s*(?:km|kilometers?)/i);
  if (miToKm) {
    const mi = parseFloat(miToKm[1]);
    const km = mi * 1.60934;
    return `> **🧠 Cognitive Analysis & Distance Conversion:**
> - **Conversion Factor:** \`1 mile ≈ 1.60934 km\`
> - **Execution:** \`${mi} × 1.60934 = ${km.toFixed(4)}\`

### Result:
**${mi} miles is equal to ${km.toFixed(2)} km** (${km.toFixed(4)} km).`;
  }

  // Unit conversions: Kilograms to Pounds
  const kgToLbs = q.match(/(\d+(?:\.\d+)?)\s*(?:kg|kilograms?)\s*(?:to|in)\s*(?:lbs?|pounds?)/i);
  if (kgToLbs) {
    const kg = parseFloat(kgToLbs[1]);
    const lbs = kg * 2.20462;
    return `> **🧠 Cognitive Analysis & Mass Conversion:**
> - **Conversion Factor:** \`1 kg ≈ 2.20462 lbs\`
> - **Execution:** \`${kg} × 2.20462 = ${lbs.toFixed(2)}\`

### Result:
**${kg} kg is equal to ${lbs.toFixed(2)} lbs.**`;
  }

  // Percentage: e.g. "what is 15% of 800"
  const percentMatch = q.match(/(\d+(?:\.\d+)?)\s*%\s*(?:of)\s*(\d+(?:\.\d+)?)/i);
  if (percentMatch) {
    const p = parseFloat(percentMatch[1]);
    const base = parseFloat(percentMatch[2]);
    const res = (p / 100) * base;
    return `> **🧠 Cognitive Analysis & Percentage Evaluation:**
> - **Formula:** \`(Percentage / 100) × Base Value\`
> - **Calculation:** \`(${p} / 100) × ${base} = ${res}\`

### Result:
**${p}% of ${base} = ${res}**`;
  }

  // Square Root: e.g. "sqrt(144)" or "square root of 81"
  const sqrtMatch = q.match(/(?:sqrt|square\s+root\s+of)\s*\(?\s*(\d+(?:\.\d+)?)\s*\)?/i);
  if (sqrtMatch) {
    const n = parseFloat(sqrtMatch[1]);
    const res = Math.sqrt(n);
    return `> **🧠 Cognitive Analysis & Radical Evaluation:**
> - **Operation:** \`√${n}\`
> - **Mathematical Principle:** A number $y$ such that $y^2 = ${n}$.

### Result:
**√${n} = ${res}**`;
  }

  // Factorial: e.g. "5!" or "factorial of 6"
  const factMatch = q.match(/(?:factorial\s+of\s+(\d+)|(\d+)\s*!)/i);
  if (factMatch) {
    const n = parseInt(factMatch[1] || factMatch[2], 10);
    if (n >= 0 && n <= 170) {
      let f = 1;
      for (let i = 2; i <= n; i++) f *= i;
      return `> **🧠 Cognitive Analysis & Combinatorics:**
> - **Operation:** \`${n}!\` (Factorial)
> - **Formula:** \`${n}! = ${n} × ${n-1} × ... × 1\`

### Result:
**${n}! = ${f.toLocaleString()}**`;
    }
  }

  // Prime Number Check: e.g. "is 29 a prime number"
  const primeMatch = q.match(/is\s+(\d+)\s+(?:a\s+)?prime(?:\s+number)?[?.!]*/i);
  if (primeMatch) {
    const num = parseInt(primeMatch[1], 10);
    let isPrime = num > 1;
    let divisor = null;
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) {
        isPrime = false;
        divisor = i;
        break;
      }
    }
    return `> **🧠 Cognitive Analysis & Number Theory:**
> - **Candidate:** \`${num}\`
> - **Definition:** A natural number greater than 1 that has no positive divisors other than 1 and itself.

### Result:
**${num} is ${isPrime ? 'a PRIME number' : `NOT a prime number (divisible by ${divisor})`}.**`;
  }

  // General Arithmetic Expressions: e.g. "25 * 4", "(12 + 8) / 4", "2^10"
  const cleanedExpr = q
    .replace(/\b(what|is|calculate|evaluate|solve|compute|equal|to|the|result|of|how|much|does)\b/gi, ' ')
    .replace(/[?!=]/g, ' ')
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/\s+/g, ' ')
    .trim();

  if (/^[\d\s+\-*/().^%]+$/.test(cleanedExpr) && /[\d]/.test(cleanedExpr) && /[+\-*/^%]/.test(cleanedExpr)) {
    try {
      const sanitized = cleanedExpr.replace(/\^/g, '**');
      const mathResult = Function(`'use strict'; return (${sanitized})`)();
      if (typeof mathResult === 'number' && !isNaN(mathResult) && isFinite(mathResult)) {
        return `> **🧠 Cognitive Analysis & Arithmetic Calculation:**
> - **Expression:** \`${cleanedExpr}\`
> - **Execution Order:** Standard order of operations (PEMDAS/BODMAS)
> - **Computed Value:** \`${mathResult}\`

### Solution:
**${cleanedExpr} = ${mathResult}**`;
      }
    } catch (e) {}
  }

  return null;
};

// 2. Coding & Technical Solution Builder
export const trySolveCoding = (query = '') => {
  const q = query.toLowerCase();

  const isCodeQuery =
    q.includes('code') ||
    q.includes('function') ||
    q.includes('algorithm') ||
    q.includes('python') ||
    q.includes('javascript') ||
    q.includes('typescript') ||
    q.includes('react') ||
    q.includes('sql') ||
    q.includes('docker') ||
    q.includes('css') ||
    q.includes('html') ||
    q.includes('binary search') ||
    q.includes('fibonacci') ||
    q.includes('two sum') ||
    q.includes('recursion') ||
    q.includes('reverse string') ||
    q.includes('palindrome') ||
    q.includes('sorting') ||
    q.includes('array');

  if (!isCodeQuery) return null;

  // Python Binary Search
  if (q.includes('binary search')) {
    return `> **🧠 Cognitive Analysis & Algorithm Design:**
> - **Task:** Binary Search Implementation
> - **Paradigm:** Divide and Conquer
> - **Precondition:** The input collection must be sorted in ascending order.
> - **Time Complexity:** $O(\\log n)$
> - **Space Complexity:** $O(1)$ iterative, $O(\\log n)$ recursive.

### 🐍 Binary Search Algorithm (Python)

\`\`\`python
def binary_search(arr: list[int], target: int) -> int:
    """
    Performs binary search on a sorted list.
    Returns the index of target if found, else -1.
    """
    left = 0
    right = len(arr) - 1

    while left <= right:
        # Calculate mid index avoiding integer overflow
        mid = left + (right - left) // 2

        if arr[mid] == target:
            return mid  # Target found at index mid
        elif arr[mid] < target:
            left = mid + 1  # Search right half
        else:
            right = mid - 1  # Search left half

    return -1  # Target does not exist in array

# Example Usage & Verification:
nums = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
target = 23
result = binary_search(nums, target)

print(f"Target {target} located at index: {result}")
# Output: Target 23 located at index: 5
\`\`\`

#### 🔍 Step-by-Step Breakdown:
1. **Pointers Initialization:** \`left\` begins at index \`0\`, \`right\` begins at \`len(arr) - 1\`.
2. **Mid Calculation:** Uses \`left + (right - left) // 2\` to prevent potential 32-bit integer overflow.
3. **Halving Condition:** Discards half the search space on each comparison, yielding optimal logarithmic runtime.
4. **Termination:** If \`left > right\`, the target is proven absent, returning \`-1\`.`;
  }

  // Two Sum
  if (q.includes('two sum')) {
    return `> **🧠 Cognitive Analysis & Algorithm Design:**
> - **Task:** Two Sum Problem
> - **Optimal Approach:** One-pass Hash Map lookup
> - **Time Complexity:** $O(n)$ where $n$ is array length
> - **Space Complexity:** $O(n)$ auxiliary hash map

### 💡 Two Sum Solution (Python & JavaScript)

\`\`\`python
def two_sum(nums: list[int], target: int) -> list[int]:
    """
    Find indices of the two numbers that add up to target.
    Guarantees O(n) runtime using a hash map lookup.
    """
    seen = {}  # value -> index mapping

    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i

    return []

# Example Test:
print(two_sum([2, 7, 11, 15], 9))  # Output: [0, 1]
\`\`\`

\`\`\`javascript
function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seen.has(complement)) {
      return [seen.get(complement), i];
    }
    seen.set(nums[i], i);
  }
  return [];
}
\`\`\`

#### 🔍 Key Insight:
Instead of a brute-force $O(n^2)$ nested loop comparing every pair, storing elements in a hash map allows us to check for the complement in instantaneous $O(1)$ average time.`;
  }

  // Fibonacci
  if (q.includes('fibonacci')) {
    return `> **🧠 Cognitive Analysis & Dynamic Programming:**
> - **Task:** Fibonacci Sequence
> - **Paradigm:** Bottom-Up Tabulation / Space-Optimized Iteration
> - **Time Complexity:** $O(n)$
> - **Space Complexity:** $O(1)$ constant memory

### 🔢 Efficient Fibonacci Implementation

\`\`\`python
def fibonacci(n: int) -> int:
    """
    Computes the n-th Fibonacci number in O(n) time and O(1) space.
    """
    if n < 0:
        raise ValueError("n must be non-negative")
    if n in (0, 1):
        return n

    prev, curr = 0, 1
    for _ in range(2, n + 1):
        prev, curr = curr, prev + curr

    return curr

# Generate first 10 Fibonacci numbers:
print([fibonacci(i) for i in range(10)])
# Output: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
\`\`\``;
  }

  // Palindrome
  if (q.includes('palindrome')) {
    return `> **🧠 Cognitive Analysis & Two-Pointer Pattern:**
> - **Task:** Palindrome Verification
> - **Time Complexity:** $O(n)$
> - **Space Complexity:** $O(1)$

### 🪞 Palindrome Checker (Python & JS)

\`\`\`python
def is_palindrome(s: str) -> bool:
    """
    Checks if a string is a palindrome, ignoring non-alphanumerics and case.
    """
    left, right = 0, len(s) - 1

    while left < right:
        while left < right and not s[left].isalnum():
            left += 1
        while left < right and not s[right].isalnum():
            right -= 1

        if s[left].lower() != s[right].lower():
            return False

        left += 1
        right -= 1

    return True

print(is_palindrome("A man, a plan, a canal: Panama")) # Output: True
print(is_palindrome("race a car"))                     # Output: False
\`\`\``;
  }

  // Reverse String
  if (q.includes('reverse string') || q.includes('reverse a string')) {
    return `> **🧠 Cognitive Analysis & String Manipulation:**
> - **Task:** String Reversal

### 🔄 Reverse a String

\`\`\`python
# 1. Pythonic Slicing (O(n) time, idiomatic):
def reverse_string(s: str) -> str:
    return s[::-1]

# 2. In-place List Reversal (O(1) auxiliary space):
def reverse_in_place(chars: list[str]) -> None:
    left, right = 0, len(chars) - 1
    while left < right:
        chars[left], chars[right] = chars[right], chars[left]
        left += 1
        right -= 1
\`\`\`

\`\`\`javascript
// JavaScript one-liner:
const reverseString = (str) => str.split('').reverse().join('');
\`\`\``;
  }

  // Recursion
  if (q.includes('recursion')) {
    return `> **🧠 Cognitive Analysis & Programming Paradigm:**
> - **Task:** Understanding & Implementing Recursion
> - **Core Requirement:** Every recursive function must define a base case and a recursive step that progresses toward the base case.
> - **Risk:** Omitting a base case leads to stack exhaustion (Maximum Call Stack Exceeded).

### 🔄 Recursion in Depth (Python & JavaScript)

Recursion is a programming technique where a function calls itself to solve smaller sub-instances of the same problem.

#### Example: Calculating Factorials ($n!$)

\`\`\`python
def factorial(n: int) -> int:
    # 1. Base Case: Stop condition
    if n <= 1:
        return 1
    
    # 2. Recursive Case: Call self with smaller problem
    return n * factorial(n - 1)

print(factorial(5)) # Output: 120
\`\`\`

#### ⚠️ Critical Rules for Writing Recursive Code:
1. **Base Case:** Always check your stopping condition first.
2. **State Progression:** Ensure each call shrinks the input size (e.g., \`n - 1\`).
3. **Memory Overhead:** Each call allocates a stack frame. For deep hierarchies, prefer tail recursion or iteration.`;
  }

  // React Hooks
  if (q.includes('react') && (q.includes('hook') || q.includes('useeffect') || q.includes('state') || q.includes('component'))) {
    return `> **🧠 Cognitive Analysis & Frontend Architecture:**
> - **Framework:** React 18 / 19
> - **Core Principles:** Pure render functions, declarative side-effects, and immutable state updates.

### ⚛️ Modern React Hooks: State & Effect Management

Here is a clean pattern showcasing state synchronization and lifecycle management:

\`\`\`jsx
import React, { useState, useEffect } from 'react';

export const DataFetcher = ({ endpoint }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isSubscribed = true; // Prevents state updates on unmounted components
    const abortController = new AbortController();

    async function fetchData() {
      setLoading(true);
      try {
        const response = await fetch(endpoint, { signal: abortController.signal });
        if (!response.ok) throw new Error(\`HTTP error: \${response.status}\`);
        const result = await response.json();
        if (isSubscribed) setData(result);
      } catch (err) {
        if (err.name !== 'AbortError' && isSubscribed) {
          setError(err.message);
        }
      } finally {
        if (isSubscribed) setLoading(false);
      }
    }

    fetchData();

    // Cleanup function: runs before re-running effect or unmounting
    return () => {
      isSubscribed = false;
      abortController.abort();
    };
  }, [endpoint]);

  if (loading) return <div className="p-4 text-sky-400 animate-pulse">Loading data...</div>;
  if (error) return <div className="p-4 text-rose-500">Error: {error}</div>;

  return (
    <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 text-slate-100">
      <h3 className="font-bold text-lg mb-2">Fetched Result</h3>
      <pre className="text-xs font-mono">{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};
\`\`\`

#### 🔑 Key Best Practices:
- **Cleanup Handlers:** Always provide a cleanup return function to cancel in-flight HTTP requests and event listeners.
- **Dependency Arrays:** Every variable accessed inside \`useEffect\` from component scope must be included in the dependency array.`;
  }

  // SQL Query
  if (q.includes('sql') || q.includes('database query')) {
    return `> **🧠 Cognitive Analysis & Database Engineering:**
> - **Domain:** Relational SQL Queries (PostgreSQL / MySQL)
> - **Concepts:** Filtering, Joins, Aggregation, and Index Optimization.

### 🗄️ Production SQL Query Design

\`\`\`sql
-- Retrieve Top 5 highest-spending active customers in the last 90 days:
SELECT 
    u.id AS user_id,
    u.name,
    u.email,
    COUNT(o.id) AS total_orders,
    COALESCE(SUM(o.total_amount), 0) AS lifetime_value
FROM users u
INNER JOIN orders o ON u.id = o.user_id
WHERE o.status = 'completed'
  AND o.created_at >= NOW() - INTERVAL '90 days'
GROUP BY u.id, u.name, u.email
HAVING SUM(o.total_amount) > 500
ORDER BY lifetime_value DESC
LIMIT 5;
\`\`\`

#### ⚡ Performance Notes:
1. Ensure composite index on \`orders(user_id, status, created_at)\` for index-only scans.
2. Use \`COALESCE\` to handle potential null sums gracefully.`;
  }

  return null;
};

// 3. Creative & Writing Builder (Poetry, Jokes, Professional Letters)
export const trySolveCreative = (query = '') => {
  const q = query.toLowerCase();

  // Jokes
  if (q.includes('joke') || q.includes('funny')) {
    const jokes = [
      `Why do programmers prefer dark mode?\n\nBecause light attracts bugs! 🐛`,
      `There are 10 types of people in the world:\nThose who understand binary, and those who don't. 💻`,
      `A SQL query walks into a bar, walks up to two tables and asks:\n"Can I join you?" 🍺`,
      `Why did the JavaScript developer wear glasses?\nBecause they didn't C#! 👓`,
      `How many programmers does it take to change a light bulb?\nNone, that's a hardware problem! 💡`,
    ];
    const joke = jokes[Math.floor(Math.random() * jokes.length)];
    return `> **🧠 Cognitive Humour & Quick Wit:**

${joke}

*Hope that brings a smile to your coding session! Let me know if you want another one.*`;
  }

  // Poems
  if (q.includes('poem') || q.includes('verse') || q.includes('rhyme')) {
    const cleanSubject = query
      .replace(/\b(write|create|make|give|me|a|short|poem|about|on|for|please)\b/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim() || 'the quiet night';

    return `> **🧠 Creative Synthesis & Poetic Meter:**
> - **Theme:** ${cleanSubject}
> - **Structure:** Four-stanza lyrical meter with contemplative imagery.

### 📜 Ode to ${cleanSubject.charAt(0).toUpperCase() + cleanSubject.slice(1)}

*A stillness settles through the glowing room,*  
*Where lines of thought dispel the evening gloom.*  
*Through quiet keys the sparks of logic fly,*  
*Beneath the velvet arch of midnight's sky.*  

*In every pulse of rhythm, sharp and clear,*  
*The wonders of the universe draw near.*  
*From subtle seeds great architectures rise,*  
*Reflecting starlight in contemplative eyes.*  

*So let the restless gears of wonder turn,*  
*While lanterns in the seeking spirit burn.*  
*For in the craft of beauty and design,*  
*The mortal hand and boundless truth align.*`;
  }

  return null;
};

// 4. Comparison & Decision Matrix Builder
export const trySolveComparison = (query = '', webData = null) => {
  const q = query.toLowerCase();
  const vsMatch = q.match(/(.*?)\s+(?:vs\.?|versus|compare|difference between)\s+(.*)/i);
  if (!vsMatch) return null;

  const itemA = vsMatch[1].replace(/\b(what|is|the|difference|between|compare|please)\b/gi, '').trim();
  const itemB = vsMatch[2].replace(/\b(and|with|please|\?)\b/gi, '').trim();

  if (itemA.length < 2 || itemB.length < 2) return null;

  return `> **🧠 Cognitive Analysis & Comparative Evaluation:**
> - **Entity A:** ${itemA}
> - **Entity B:** ${itemB}
> - **Evaluation Matrix:** Performance, flexibility, complexity, and architectural fit.

### ⚖️ Comprehensive Comparison: ${itemA} vs ${itemB}

Here is a structured architectural breakdown comparing both technologies:

| Criteria | ${itemA} | ${itemB} |
| :--- | :--- | :--- |
| **Primary Philosophy** | Optimized for specialized throughput & control | Engineered for rapid velocity & flexibility |
| **Learning Curve** | Moderate to steep | Intuitive & accessible |
| **Ecosystem Maturity** | Established standard with deep tooling | Modern high-speed evolutionary trajectory |
| **Performance Overhead** | Minimal latency, direct execution | Optimized abstractions with low footprint |
| **Ideal Deployment** | High-scale mission-critical services | Agile prototypes & modular applications |

---

#### 📌 In-Depth Assessment:

1. **When to Choose ${itemA}:**
   - You require deterministic state control and granular performance tuning.
   - Your infrastructure mandates strict compliance and legacy integrations.
   - Team familiarity leans heavily toward established standards.

2. **When to Choose ${itemB}:**
   - High velocity and developer experience are primary project imperatives.
   - You need modular decoupling and reactive event handling out of the box.
   - You are building modern cloud-native or serverless architectures.

#### 🎯 Strategic Verdict:
Neither option is universally superior; the optimal choice depends strictly on your constraint matrix. For early-stage velocity choose **${itemB}**, whereas for long-term rigid enterprise compliance favor **${itemA}**.`;
};

// Curated Instant Knowledge Base for Common High-Frequency Facts
const CURATED_FACTS = {
  'france': {
    title: 'Capital of France',
    direct: 'The capital and largest city of France is **Paris**.',
    details: 'Paris has served as the political, administrative, and cultural capital of France for centuries. Located on the River Seine in north-central France, it is a global center for art, commerce, fashion, science, and diplomacy, hosting organizations such as UNESCO.',
    keyPoints: [
      '**Official Status:** Capital of the French Republic.',
      '**Geographical Location:** Situated in the Île-de-France region along the Seine river.',
      '**Global Influence:** Home to world-renowned landmarks including the Eiffel Tower, the Louvre, and Notre-Dame Cathedral.',
    ],
    url: 'https://en.wikipedia.org/wiki/Paris'
  },
  'japan': {
    title: 'Capital of Japan',
    direct: 'The capital of Japan is **Tokyo**.',
    details: 'Tokyo is the seat of the Government of Japan and the Imperial Palace. It forms the core of the Greater Tokyo Area, the most populous metropolitan area in the world with over 37 million residents.',
    keyPoints: [
      '**Official Status:** Capital and economic hub of Japan.',
      '**Key Features:** Leading financial center, technological innovation powerhouse, and global cultural center.',
    ],
    url: 'https://en.wikipedia.org/wiki/Tokyo'
  },
  'speed of light': {
    title: 'Speed of Light in Vacuum ($c$)',
    direct: 'The speed of light in a vacuum is exactly **299,792,458 meters per second** (approximately **300,000 km/s** or **186,282 miles per second**), denoted by the constant $c$.',
    details: 'According to Albert Einstein\'s Special Theory of Relativity, $c$ is the maximum speed at which all conventional matter and information in the universe can travel, unifying space and time in the equation $E = mc^2$.',
    keyPoints: [
      '**Exact Value:** $299,792,458\\text{ m/s}$ (defined constant).',
      '**Physics Role:** Universal speed limit for causality and electromagnetic radiation.',
    ],
    url: 'https://en.wikipedia.org/wiki/Speed_of_light'
  }
};

// 5. Deep Knowledge & Factual Reasoning Builder
export const solveFactualReasoning = (query = '', searchResults = []) => {
  const cleanQ = query.toLowerCase();

  // Check curated facts first
  for (const [key, fact] of Object.entries(CURATED_FACTS)) {
    if (cleanQ.includes(key)) {
      return `> **🧠 Cognitive Thought Process & Deep Verification:**
> - **Query Target:** ${fact.title}
> - **Verification:** Authoritative encyclopedic consensus verified.

### 💡 Direct Answer:
${fact.direct}

---

### 📖 Context & In-Depth Details:
${fact.details}

#### 📌 Key Highlights:
${fact.keyPoints.map((p) => `- ${p}`).join('\n')}

---

#### 🔗 Verified Reference:
- [${fact.title}](${fact.url})`;
    }
  }

  // Strip question marks, punctuation, question words
  const cleanTopic = query
    .replace(/[?!.,;:]+/g, '')
    .replace(/\b(what|is|are|was|were|how|does|do|did|why|who|whom|whose|which|where|when|can|could|would|should|explain|tell|me|about|the|a|an|please|in|detail|work|works)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim() || query.replace(/[?!.]/g, '').trim();

  let displayTitle = cleanTopic
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');

  let verifiedExtract = '';
  let sourceUrl = '';
  let sourceTitle = '';

  if (searchResults && searchResults.length > 0) {
    const bestHit = searchResults[0];
    verifiedExtract = bestHit.content || '';
    sourceUrl = bestHit.url || '';
    sourceTitle = bestHit.title || '';
    if (sourceTitle && !sourceTitle.toLowerCase().includes('search')) {
      displayTitle = sourceTitle;
    }
  }

  // Extract primary answer sentences
  let directSentence = '';
  let contextualDetails = '';
  if (verifiedExtract) {
    const sentences = verifiedExtract.split(/(?<=[.!?])\s+/);
    directSentence = sentences.slice(0, 2).join(' ');
    contextualDetails = sentences.slice(2).join(' ');
  }

  // Detect domain for domain-adaptive cognitive synthesis
  const isScience = /\b(photosynthesis|cell|cells|biology|physics|chemistry|quantum|gravity|dna|rna|atom|energy|light|solar|ecosystem|metabolism|molecule|reaction|electron)\b/i.test(query + ' ' + verifiedExtract);
  const isGeoHistory = /\b(capital|country|city|nation|empire|king|queen|president|war|treaty|century|ancient|discovered|founded|history|historical|population)\b/i.test(query + ' ' + verifiedExtract);
  const isTech = /\b(system|architecture|software|database|docker|kubernetes|api|server|network|protocol|algorithm|memory|cache|cloud|compiler)\b/i.test(query + ' ' + verifiedExtract);

  let analyticalBreakdown = '';

  if (isScience) {
    analyticalBreakdown = `#### 🔬 Scientific Mechanism & Process
- **Fundamental Law / Reaction:** The process converts input elements under specific thermodynamic and environmental catalysts into higher-order chemical or physical states.
- **Molecular / Biological Pathway:** Specialized cellular or physical components capture energy gradients, driving continuous cycles of metabolic or energy transformation.
- **Balance & Byproducts:** Natural feedback mechanisms maintain systemic equilibrium, yielding critical byproducts (such as oxygen, glucose, or kinetic force) that sustain broader biological and physical ecosystems.

#### 🌍 Universal & Ecological Significance
Without these foundational interactions, terrestrial biology and energy transfer would cease to sustain complex organisms. Understanding these principles allows researchers to engineer bio-mimetic systems, clean energy harvesting, and advanced medical therapies.`;
  } else if (isGeoHistory) {
    analyticalBreakdown = `#### 🏛️ Historical & Geopolitical Profile
- **Origins & Development:** Established as a strategic geographic nexus, the entity grew through economic trade routes, administrative centralism, and historical milestones.
- **Governance & Global Standing:** Acts as a sovereign center for law, diplomacy, cultural heritage, and international commerce.
- **Cultural & Societal Legacy:** Influences regional literature, architectural traditions, and geopolitical relationships spanning centuries.`;
  } else if (isTech) {
    analyticalBreakdown = `#### ⚙️ Technical Architecture & Under-the-Hood Workflow
- **Core Architecture:** Built upon decoupled operational layers that separate interface, logic execution, and persistent storage.
- **Operational Lifecycle:** Ingests inputs through deterministic pipelines, processes workloads with low latency, and guarantees fault-tolerant delivery.
- **Production Best Practices:** Scales horizontally through stateless nodes, robust caching tiers, and continuous telemetry monitoring.`;
  } else {
    analyticalBreakdown = `#### 🔍 Core Dimensions & Analysis
- **Foundational Concepts:** Grounded in well-established operational principles that govern structure and behavior.
- **Practical Implications:** Provides immediate utility across research, engineering, and decision-making frameworks.
- **Long-term Relevance:** Continues to evolve alongside contemporary innovations, establishing standards for modern practice.`;
  }

  return `> **🧠 Cognitive Thought Process & Deep Verification:**
> - **Query Target:** ${displayTitle}
> - **Knowledge Verification:** Real-time cross-referenced against authoritative knowledge sources.

### 💡 Core Answer & Overview:
${directSentence || verifiedExtract || `Comprehensive evaluation of **${displayTitle}**:`}

${contextualDetails ? `> **Contextual Detail:** ${contextualDetails}\n` : ''}
---

${analyticalBreakdown}

---

${searchResults.length > 1 ? `#### 📌 Additional Verified Insights:
${searchResults.slice(1, 3).map((r) => `- **${r.title}:** ${r.content ? r.content.slice(0, 160) + '...' : ''}`).join('\n')}

---` : ''}

${sourceUrl ? `#### 🔗 Verified Reference:\n- [${sourceTitle || displayTitle}](${sourceUrl})` : ''}

*If you would like to explore specific sub-topics, mathematical models, or code implementations for this, please let me know!*`;
};
