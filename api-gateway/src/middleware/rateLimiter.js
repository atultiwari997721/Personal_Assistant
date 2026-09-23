import rateLimit from 'express-rate-limit';

export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    code: 'RATE_LIMIT_EXCEEDED',
    message: 'Too many requests from this client. Please slow down.',
  },
});

export const agentTaskLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // 30 agent executions per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    code: 'AGENT_BURST_LIMIT_EXCEEDED',
    message: 'High agent execution volume detected. Please wait a moment before sending another prompt.',
  },
});
