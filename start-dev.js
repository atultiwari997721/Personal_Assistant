import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { randomBytes } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Services run from their own directories, while local configuration belongs
// in the repository root. Load it once and pass it to every child process.
dotenv.config({ path: path.join(__dirname, '.env'), override: true });
const localJwtSecret = process.env.JWT_SECRET || randomBytes(32).toString('hex');

const services = [
  { name: 'Auth Service', dir: 'services/auth-service', cmd: 'node', args: ['src/server.js'], port: 8001 },
  { name: 'Payment Service', dir: 'services/payment-service', cmd: 'node', args: ['src/server.js'], port: 8002 },
  { name: 'Agent Service', dir: 'services/agent-service', cmd: 'node', args: ['src/server.js'], port: 8003 },
  { name: 'API Gateway', dir: 'api-gateway', cmd: 'node', args: ['src/server.js'], port: 8000 },
  { name: 'Vite Client', dir: 'client', cmd: 'node', args: ['node_modules/vite/bin/vite.js', '--port', '3894', '--host', '127.0.0.1'], port: 3894 },
];

console.log('==================================================');
console.log('Starting KritiAI development services');
console.log('   Client:  http://127.0.0.1:3894');
console.log('   Gateway: http://127.0.0.1:8000');
console.log('==================================================\n');

const children = services.map((service) => {
  const command = service.cmd;
  const child = spawn(command, service.args, {
    cwd: path.join(__dirname, service.dir),
    stdio: 'inherit',
    shell: false,
    env: {
      ...process.env,
      JWT_SECRET: localJwtSecret,
      PORT: String(service.port),
      NODE_ENV: 'development',
      ALLOW_DEMO_AUTH: process.env.ALLOW_DEMO_AUTH || 'true',
      VITE_ALLOW_DEMO_AUTH: process.env.ALLOW_DEMO_AUTH || 'true',
      VITE_GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID || '',
      HOST: '127.0.0.1',
    },
  });
  child.on('error', (error) => console.error(`[${service.name}] Could not start: ${error.message}`));
  child.on('close', (code) => console.log(`[${service.name}] stopped (${code ?? 'signal'})`));
  return child;
});

const shutdown = () => {
  for (const child of children) child.kill();
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
