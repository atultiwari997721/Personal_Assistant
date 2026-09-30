import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Services run from their own directories, while local configuration belongs
// in the repository root. Load it once and pass it to every child process.
dotenv.config({ path: path.join(__dirname, '.env'), override: true });

const services = [
  { name: 'Auth Service', dir: 'services/auth-service', cmd: 'node', args: ['src/server.js'], port: 8001 },
  { name: 'Payment Service', dir: 'services/payment-service', cmd: 'node', args: ['src/server.js'], port: 8002 },
  { name: 'Agent Service', dir: 'services/agent-service', cmd: 'node', args: ['src/server.js'], port: 8003 },
  { name: 'API Gateway', dir: 'api-gateway', cmd: 'node', args: ['src/server.js'], port: 8000 },
  { name: 'Vite Client', dir: 'client', cmd: 'node', args: ['node_modules/vite/bin/vite.js', '--port', '3894', '--host'], port: 3894 },
];

console.log('==================================================');
console.log('Starting KritiAI development services');
console.log('   Client:  http://localhost:3894');
console.log('   Gateway: http://localhost:8000');
console.log('==================================================\n');

const children = services.map((service) => {
  const command = service.cmd;
  const child = spawn(command, service.args, {
    cwd: path.join(__dirname, service.dir),
    stdio: 'inherit',
    shell: false,
    env: { ...process.env, PORT: String(service.port) },
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
