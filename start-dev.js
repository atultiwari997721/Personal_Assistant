import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const services = [
  { name: 'Auth Service', dir: 'services/auth-service', cmd: 'node', args: ['src/server.js'], port: 8001 },
  { name: 'Payment Service', dir: 'services/payment-service', cmd: 'node', args: ['src/server.js'], port: 8002 },
  { name: 'Agent Service', dir: 'services/agent-service', cmd: 'node', args: ['src/server.js'], port: 8003 },
  { name: 'API Gateway', dir: 'api-gateway', cmd: 'node', args: ['src/server.js'], port: 8000 },
  { name: 'Vite Client', dir: 'client', cmd: 'npx.cmd', args: ['vite', '--port', '3894', '--host'], port: 3894 },
];

console.log('==================================================');
console.log('🚀 Starting Cortex AI Full-Stack Platform');
console.log('   Client Port: http://localhost:3894');
console.log('   Gateway:     http://localhost:8000');
console.log('==================================================\n');

services.forEach((s) => {
  const isWindows = process.platform === 'win32';
  const command = isWindows && (s.cmd === 'npm' || s.cmd === 'npx') ? `${s.cmd}.cmd` : s.cmd;

  const proc = spawn(command, s.args, {
    cwd: path.join(__dirname, s.dir),
    stdio: 'pipe',
    shell: true,
    env: { ...process.env, PORT: s.port.toString() },
  });

  proc.stdout.on('data', (data) => {
    process.stdout.write(`[${s.name}] ${data.toString()}`);
  });

  proc.stderr.on('data', (data) => {
    process.stderr.write(`[${s.name} ERR] ${data.toString()}`);
  });

  proc.on('close', (code) => {
    console.log(`[${s.name}] Process exited with code ${code}`);
  });
});

process.on('SIGINT', () => {
  console.log('Shutting down Cortex platform...');
  process.exit();
});
