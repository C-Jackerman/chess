const fs = require('fs');
const path = require('path');
const https = require('https');

function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  const vars = {};
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx > 0) {
        vars[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim();
      }
    }
  }
  return vars;
}

const env = loadEnv();
const hookUrl = process.env.RENDER_DEPLOY_HOOK_URL || env.RENDER_DEPLOY_HOOK_URL;

if (!hookUrl) {
  console.error('Missing RENDER_DEPLOY_HOOK_URL in .env');
  process.exit(1);
}

https.get(hookUrl, (res) => {
  let body = '';
  res.on('data', (chunk) => { body += chunk; });
  res.on('end', () => {
    console.log(`Render Deploy Hook status: ${res.statusCode}`);
    console.log(`Response: ${body}`);
    process.exit(res.statusCode >= 200 && res.statusCode < 300 ? 0 : 1);
  });
}).on('error', (err) => {
  console.error('Deploy hook error:', err.message);
  process.exit(1);
});
