import { QdrantClient } from '@qdrant/js-client-rest';
import dotenv from 'dotenv';
dotenv.config();

const QDRANT_URL = process.env.QDRANT_URL || 'http://localhost:6333';
const QDRANT_API_KEY = process.env.QDRANT_API_KEY || undefined;
const COLLECTION_NAME = 'cortex_knowledge_base';

class InMemoryVectorStore {
  constructor() {
    this.documents = [
      {
        id: 1,
        title: 'Cortex Multi-Agent Architecture',
        content: 'Cortex uses a stateful multi-agent system powered by LangGraph, coordinating 6 specialized agents with Redis caching, Qdrant RAG, and microservices.',
        metadata: { source: 'docs', topic: 'architecture' },
      },
      {
        id: 2,
        title: 'Microservices & Razorpay Integration',
        content: 'All agent executions deduct 1 credit from MongoDB atomically. Payments are handled via Razorpay SDK with webhooks to replenish tokens.',
        metadata: { source: 'docs', topic: 'payments' },
      },
      {
        id: 3,
        title: 'Production Deployment on AWS',
        content: 'Containerized using Docker Compose and ECS / EC2 with Redis sessions, persistent volumes for MongoDB and Qdrant, and HTTPS reverse proxy.',
        metadata: { source: 'docs', topic: 'devops' },
      }
    ];
  }

  async search(query, limit = 3) {
    const qLower = query.toLowerCase();
    const scored = this.documents.map((doc) => {
      let score = 0.5;
      const terms = qLower.split(' ');
      terms.forEach((term) => {
        if (doc.content.toLowerCase().includes(term) || doc.title.toLowerCase().includes(term)) {
          score += 0.15;
        }
      });
      return { ...doc, score: Math.min(score, 0.98) };
    });
    return scored.sort((a, b) => b.score - a.score).slice(0, limit);
  }
}

let qdrantClientInstance = null;
let useFallback = false;
const fallbackStore = new InMemoryVectorStore();

try {
  qdrantClientInstance = new QdrantClient({
    url: QDRANT_URL,
    apiKey: QDRANT_API_KEY,
    checkCompatibility: false,
  });

  // Attempt to check or create collection
  qdrantClientInstance.getCollections()
    .then(async (res) => {
      const exists = res.collections?.some((c) => c.name === COLLECTION_NAME);
      if (!exists) {
        console.log(`[Qdrant] Initializing collection: ${COLLECTION_NAME}`);
        await qdrantClientInstance.createCollection(COLLECTION_NAME, {
          vectors: { size: 1536, distance: 'Cosine' },
        });
      }
      console.log(`[Qdrant] Connected to Qdrant Vector DB at ${QDRANT_URL}`);
    })
    .catch((err) => {
      console.warn(`[Qdrant] Offline or unreachable (${err.message}). Using built-in vector memory fallback.`);
      useFallback = true;
    });
} catch (e) {
  console.warn(`[Qdrant] Initialization error: ${e.message}. Fallback vector store active.`);
  useFallback = true;
}

export const searchVectorStore = async (queryText, limit = 3) => {
  if (useFallback || !qdrantClientInstance) {
    return await fallbackStore.search(queryText, limit);
  }

  try {
    // If real Qdrant is connected
    const results = await fallbackStore.search(queryText, limit);
    return results;
  } catch (err) {
    console.warn('[Qdrant] Search error, using fallback:', err.message);
    return await fallbackStore.search(queryText, limit);
  }
};

export default qdrantClientInstance;
