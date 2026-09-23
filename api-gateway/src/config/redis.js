import Redis from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

class SafeRedisWrapper {
  constructor(url) {
    this.memory = new Map();
    this.isReady = false;
    this.client = null;

    try {
      this.client = new Redis(url, {
        maxRetriesPerRequest: 0,
        retryStrategy: () => null,
        lazyConnect: true,
        enableOfflineQueue: false,
      });

      this.client.connect()
        .then(() => {
          this.isReady = true;
          console.log('[API Gateway] Redis connected successfully.');
        })
        .catch((err) => {
          this.isReady = false;
          console.warn(`[API Gateway] Redis offline. In-memory gateway cache active.`);
        });

      this.client.on('error', () => {
        this.isReady = false;
      });
    } catch (e) {
      this.isReady = false;
    }
  }

  async get(key) {
    if (this.isReady && this.client) {
      try {
        return await this.client.get(key);
      } catch (e) {
        return this.memory.get(key) || null;
      }
    }
    return this.memory.get(key) || null;
  }

  async set(key, value, mode, duration) {
    if (this.isReady && this.client) {
      try {
        if (mode && duration) {
          return await this.client.set(key, value, mode, duration);
        }
        return await this.client.set(key, value);
      } catch (e) {
        this.memory.set(key, value);
        return 'OK';
      }
    }
    this.memory.set(key, value);
    return 'OK';
  }

  async del(key) {
    if (this.isReady && this.client) {
      try {
        return await this.client.del(key);
      } catch (e) {
        return this.memory.delete(key) ? 1 : 0;
      }
    }
    return this.memory.delete(key) ? 1 : 0;
  }
}

const safeRedis = new SafeRedisWrapper(redisUrl);
export default safeRedis;
