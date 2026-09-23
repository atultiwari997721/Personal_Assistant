# Cortex AI - Production Multi-Agent AI SaaS Platform

[![Node.js](https://img.shields.io/badge/Node.js-v20%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![LangGraph](https://img.shields.io/badge/LangGraph-v0.2-orange.svg)](https://langchain-ai.github.io/langgraphjs/)
[![Qdrant](https://img.shields.io/badge/Vector_DB-Qdrant-red.svg)](https://qdrant.tech/)
[![Redis](https://img.shields.io/badge/Session_Store-Redis-critical.svg)](https://redis.io/)
[![Docker](https://img.shields.io/badge/Containerized-Docker_Compose-blue.svg)](https://www.docker.com/)

A production-ready, microservices-based Multi-Agent AI SaaS Platform built with **MERN** (MongoDB, Express, React, Node.js), **LangGraph**, **Qdrant Vector DB**, **Redis**, **Docker**, and **AWS**.

---

## 🏛️ 1. Architecture Overview

```
                      +---------------------------------------+
                      |   React 18 SPA (Redux + Tailwind)     |
                      |   - Monaco/Prism Code Sandbox         |
                      |   - PPT Deck Viewer & .PPTX Exporter  |
                      |   - Executive PDF Reader & Exporter   |
                      |   - Razorpay Credit Recharge Modal    |
                      +-------------------+-------------------+
                                          |
                                          | HTTP / REST (Port 3000 -> 8000)
                                          v
                      +---------------------------------------+
                      |       API Gateway (Express.js)        |
                      |   - Port 8000                         |
                      |   - JWT Auth & Redis Session Check    |
                      |   - Rate Limiting (IP/Token buckets)  |
                      |   - Atomic 1-Credit-per-Task Enforcer |
                      +----+--------------+--------------+----+
                           |              |              |
         +-----------------+              |              +------------------+
         |                                |                                 |
         v                                v                                 v
+------------------+            +-------------------+             +-------------------+
|   Auth Service   |            |  Payment Service  |             |   Agent Service   |
|   - Port 8001    |            |   - Port 8002     |             |   - Port 8003     |
|   - Firebase/JWT |            |   - Razorpay SDK  |             |   - LangGraph     |
|   - Mongo Users  |            |   - Webhook HMAC  |             |   - 6 AI Nodes    |
|   - Redis Session|            |   - Credit Top-Up |             |   - PPTX/PDF Libs |
+--------+---------+            +---------+---------+             +---------+---------+
         |                                |                                 |
         +--------------------------------+                                 |
         |                                                                  v
         v                                                        +-------------------+
+------------------+                                              | Qdrant Vector DB  |
|  MongoDB Cluster |                                              | - Port 6333       |
|  - Users Schema  |                                              | - Semantic RAG    |
|  - Credit Ledger |                                              +-------------------+
+------------------+
```

---

## 📂 2. Project Directory Tree

```
Personal_Assistant/
├── api-gateway/                      # Central API Gateway & Proxy (Port 8000)
│   ├── src/
│   │   ├── config/redis.js           # Redis session client with in-memory fallback
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js     # JWT verification & Redis session check
│   │   │   ├── creditMiddleware.js   # 1-credit check & atomic deduction
│   │   │   └── rateLimiter.js        # IP and burst execution rate limiters
│   │   └── server.js                 # Central proxy router
│   ├── Dockerfile
│   └── package.json
├── services/
│   ├── auth-service/                 # Authentication Microservice (Port 8001)
│   │   ├── src/
│   │   │   ├── config/db.js          # MongoDB connection
│   │   │   ├── config/redis.js       # Redis session storage
│   │   │   ├── controllers/authController.js
│   │   │   ├── models/User.js        # Mongo schema: { uid, name, email, avatarUrl, credits }
│   │   │   ├── routes/authRoutes.js
│   │   │   └── server.js
│   │   ├── Dockerfile
│   │   └── package.json
│   ├── payment-service/              # Razorpay Payment Microservice (Port 8002)
│   │   ├── src/
│   │   │   ├── config/razorpay.js    # Razorpay SDK configuration
│   │   │   ├── controllers/paymentController.js # Orders, HMAC-SHA256 verify, webhook
│   │   │   ├── routes/paymentRoutes.js
│   │   │   └── server.js
│   │   ├── Dockerfile
│   │   └── package.json
│   └── agent-service/                # LangGraph AI Orchestrator (Port 8003)
│       ├── src/
│       │   ├── agents/
│       │   │   ├── chatAgent.js      # Conversational Chat Node
│       │   │   ├── searchAgent.js    # Tavily Web Search + Qdrant RAG Node
│       │   │   ├── codeAgent.js      # Code Generation & Live Sandbox Node
│       │   │   ├── pdfAgent.js       # Executive PDF Generator Node
│       │   │   ├── pptAgent.js       # Presentation JSON Deck Node
│       │   │   └── imageAgent.js     # Visual Prompt Engineering & Art Node
│       │   ├── graph/
│       │   │   └── orchestrator.js   # LangGraph StateGraph engine & conditional routing
│       │   ├── rag/
│       │   │   └── qdrantClient.js   # Qdrant client & vector similarity search
│       │   ├── tools/
│       │   │   └── webSearch.js      # Tavily search API tool
│       │   ├── utils/
│       │   │   ├── pdfGenerator.js   # PDFKit binary compilation
│       │   │   └── pptxGenerator.js  # PptxGenJS native PowerPoint compilation
│       │   ├── controllers/agentController.js
│       │   ├── routes/agentRoutes.js
│       │   └── server.js
│       ├── Dockerfile
│       └── package.json
├── client/                           # React 18 SaaS Dashboard (Port 3000)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx            # Live credit badge, recharge button, user avatar
│   │   │   ├── Sidebar.jsx           # 6 Agent mode buttons & active sessions
│   │   │   ├── AgentSelector.jsx     # Quick tab switchers
│   │   │   ├── ChatView.jsx          # Markdown chat with copy code blocks
│   │   │   ├── CodeSandboxView.jsx   # Split-screen editor + live interactive iframe preview
│   │   │   ├── PresentationView.jsx  # Slide carousel visualizer + .PPTX download
│   │   │   ├── DocumentView.jsx      # PDF report layout + .PDF download
│   │   │   ├── ImageGalleryView.jsx  # Visual prompt tags, zoom modal & high-res download
│   │   │   └── CreditModal.jsx       # Razorpay modal with 3 credit tiers
│   │   ├── store/                    # Redux Toolkit (auth, agent, session)
│   │   ├── services/api.js           # Axios interceptors with credit depletion listener
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml                # Orchestrates Gateway, 3 Services, Redis, Qdrant, Mongo, Client
├── .env.example                      # Complete environment configuration template
└── README.md                         # Documentation & deployment guide
```

---

## 🤖 3. The 6 Specialized AI Agents & System Prompts

| Agent | Capability | Exact Embedded System Prompt |
| :--- | :--- | :--- |
| **1. Chat Agent** | Context-aware general QA | `"You are a helpful, intelligent AI assistant. Maintain conversation history, analyze user context, and deliver structured, clear responses using markdown formatting."` |
| **2. Search Agent** | Tavily Web Search + Qdrant RAG | `"You are a Search AI Agent with real-time web access. When answering questions requiring current data, query web tools, synthesize factual key insights with inline citations, and return relevant image links in markdown."` |
| **3. Code Agent** | Code generation & Live Sandbox | `"You are a Senior Full-Stack Engineer AI. Generate clean, modular, and runnable code blocks enclosed in triple backticks with language tags (e.g., \`\`\`jsx). Provide brief explanations, handle edge cases, and ensure compatibility with live previews."` |
| **4. PDF Agent** | Executive reports ready for PDF | `"You are a Document Creation AI. Format responses into clean, elegant Markdown layouts optimized for PDF generation, complete with document headers, executive summaries, sub-sections, bullet points, and data tables."` |
| **5. PPT Agent** | Slide decks & `.pptx` files | `"You are a Presentation Design AI. Output slide decks structured strictly in JSON format containing an array of slides, where each slide has 'slide_number', 'title', 'bullet_points' (array of 3-4 key points), and 'speaker_notes'."` |
| **6. Image Agent** | Visual prompt engineering & art | `"You are a Visual Prompt Engineer AI. Expand basic user concepts into cinematic, high-detail image prompts (specifying lighting, camera angle, resolution, and style tags). Submit to the image generation endpoint and render the final image URL in markdown: ![caption](url)."` |

---

## 💳 4. Token & Credit Monetization Architecture

- **Token Rule:** Exactly **1 credit is deducted** upon every successfully executed AI agent request.
- **Enforcement:**
  - `checkCreditBalance` middleware in the API Gateway queries Redis cache or Auth Service before proxying to the Agent Service.
  - If `credits < 1`, Gateway immediately blocks execution with HTTP `402 Payment Required` (`INSUFFICIENT_CREDITS`).
  - The client catches HTTP 402 and automatically triggers the **Razorpay Credit Modal**.
- **Credit Recharge Tiers:**
  1. **Starter Pack:** 50 Credits — ₹199
  2. **Pro Creator:** 250 Credits — ₹699
  3. **Architect Suite:** 1000 Credits — ₹1,999
- **Atomic Crediting:** Razorpay HMAC-SHA256 signature verification updates MongoDB via `$inc: { credits: amount }` and updates Redis session cache.

---

## 🚀 5. Quickstart & Local Setup

### Option A: One-Command Docker Compose (Recommended)

1. Clone or navigate to the directory:
   ```bash
   cd Personal_Assistant
   ```

2. Create your `.env` from template:
   ```bash
   cp .env.example .env
   ```

3. Launch all 8 microservices and databases:
   ```bash
   docker compose up --build
   ```

4. Open your browser:
   - **Frontend SaaS App:** [http://localhost:3000](http://localhost:3000)
   - **API Gateway:** [http://localhost:8000/health](http://localhost:8000/health)
   - **Qdrant Vector Web UI:** [http://localhost:6333/dashboard](http://localhost:6333/dashboard)

---

### Option B: Local Node.js Development

Run services in separate terminals:

```bash
# 1. API Gateway
cd api-gateway
npm install
npm run dev

# 2. Auth Service
cd services/auth-service
npm install
npm run dev

# 3. Payment Service
cd services/payment-service
npm install
npm run dev

# 4. Agent Service
cd services/agent-service
npm install
npm run dev

# 5. Frontend Client
cd client
npm install
npm run dev
```

---

## ☁️ 6. AWS Production Deployment Guide

### Deployment on AWS ECS Fargate & ALB
1. **ECR (Elastic Container Registry):**
   ```bash
   aws ecr create-repository --repository-name cortex-gateway
   aws ecr create-repository --repository-name cortex-auth
   aws ecr create-repository --repository-name cortex-payment
   aws ecr create-repository --repository-name cortex-agent
   aws ecr create-repository --repository-name cortex-client
   ```
2. **Build and Push:**
   ```bash
   docker build -t <account_id>.dkr.ecr.<region>.amazonaws.com/cortex-gateway:latest ./api-gateway
   docker push <account_id>.dkr.ecr.<region>.amazonaws.com/cortex-gateway:latest
   ```
3. **ECS Task Definitions:**
   - Deploy each service as an ECS Service behind an **AWS Application Load Balancer (ALB)**.
   - Configure Path-Based Routing:
     - `/api/auth/*` $\rightarrow$ Target Group `cortex-auth-tg`
     - `/api/payments/*` $\rightarrow$ Target Group `cortex-payment-tg`
     - `/api/agents/*` $\rightarrow$ Target Group `cortex-agent-tg`
     - `/*` $\rightarrow$ Target Group `cortex-client-tg`
4. **AWS Managed Services:**
   - **Database:** MongoDB Atlas (AWS VPC Peering) or AWS DocumentDB.
   - **Cache / Sessions:** AWS ElastiCache for Redis (Multi-AZ).
   - **Vector Database:** Qdrant Cloud or self-hosted Qdrant on EC2 with EBS gp3 storage.
   - **SSL/TLS:** AWS Certificate Manager (ACM) with Route 53 domain mapping.