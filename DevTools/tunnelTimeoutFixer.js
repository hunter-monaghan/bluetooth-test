const fs = require('fs');
const path = require('path');

const asyncNgrokPath = path.join(
  __dirname,
  '/../node_modules/@expo/cli/build/src/start/server/AsyncNgrok.js'
);

console.log('=== Hacking Expo Server Tunnel Connect Timeout from 10 seconds to 60 seconds ===');

const asyncNgrok = fs.readFileSync(asyncNgrokPath, 'utf8');
const updatedContent = asyncNgrok.replace(
  'const TUNNEL_TIMEOUT = 10 * 1000',
  'const TUNNEL_TIMEOUT = 60 * 1000'
);

fs.writeFileSync(asyncNgrokPath, updatedContent);
