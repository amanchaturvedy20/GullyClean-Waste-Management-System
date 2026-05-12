const { exec, spawn } = require('child_process');
const path = require('path');
const os = require('os');

const ROOT = __dirname;
const LAUNCHER_PATH = path.join(ROOT, 'launcher.html');

// Open launcher in default browser
function openBrowser(filePath) {
  const url = `file:///${filePath.replace(/\\/g, '/')}`;
  const cmd = os.platform() === 'win32' ? 'start' :
              os.platform() === 'darwin' ? 'open' : 'xdg-open';
  exec(`${cmd} "" "${url}"`);
}

console.log('\n\x1b[36m╔══════════════════════════════════════════════╗\x1b[0m');
console.log('\x1b[36m║\x1b[0m  \x1b[32m♻️  GullyClean Waste Management System\x1b[0m      \x1b[36m║\x1b[0m');
console.log('\x1b[36m║\x1b[0m  \x1b[33m   Starting all services...\x1b[0m                 \x1b[36m║\x1b[0m');
console.log('\x1b[36m╚══════════════════════════════════════════════╝\x1b[0m\n');

// Open the launcher UI
console.log('\x1b[35m→ Opening Launcher Dashboard...\x1b[0m\n');
openBrowser(LAUNCHER_PATH);

// Services configuration
const services = [
  { name: 'Backend API', dir: 'backend', color: '\x1b[33m', port: 3000 },
  { name: 'Citizen Portal', dir: 'frontend', color: '\x1b[32m', port: 5173 },
  { name: 'Worker Portal', dir: 'worker', color: '\x1b[34m', port: 5174 },
  { name: 'Admin Portal', dir: 'admin', color: '\x1b[35m', port: 5175 },
];

const RESET = '\x1b[0m';

services.forEach(svc => {
  const cwd = path.join(ROOT, svc.dir);
  const isWin = os.platform() === 'win32';
  const child = spawn(isWin ? 'npm.cmd' : 'npm', ['run', 'dev'], {
    cwd,
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: true,
  });

  const prefix = `${svc.color}[${svc.name}]${RESET}`;

  child.stdout.on('data', data => {
    data.toString().split('\n').filter(Boolean).forEach(line => {
      console.log(`${prefix} ${line}`);
    });
  });

  child.stderr.on('data', data => {
    data.toString().split('\n').filter(Boolean).forEach(line => {
      console.log(`${prefix} ${line}`);
    });
  });

  child.on('error', err => {
    console.error(`${prefix} \x1b[31mFailed to start: ${err.message}${RESET}`);
  });

  child.on('exit', code => {
    console.log(`${prefix} \x1b[31mExited with code ${code}${RESET}`);
  });

  console.log(`${prefix} Starting on port ${svc.port}...`);
});

console.log('\n\x1b[36m✓ All services launching! Check the dashboard in your browser.\x1b[0m');
console.log('\x1b[90mPress Ctrl+C to stop all services.\x1b[0m\n');

process.on('SIGINT', () => {
  console.log('\n\x1b[31m✕ Shutting down all services...\x1b[0m');
  process.exit(0);
});
