import { spawn } from 'node:child_process';

const isRailway = Boolean(process.env.RAILWAY_ENVIRONMENT || process.env.RAILWAY_PROJECT_ID);
const isProduction = process.env.NODE_ENV === 'production';
const port = process.env.PORT || '5173';
const args = isRailway || isProduction
  ? ['preview', '--host', '0.0.0.0', '--port', port]
  : ['--host', '0.0.0.0', '--port', port, ...process.argv.slice(2)];

const child = spawn('vite', args, {
  stdio: 'inherit',
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
