const fs = require('fs');
const path = require('path');

const registryPath = path.join(__dirname, 'src/components/root/template/__registry__/index.tsx');
const content = fs.readFileSync(registryPath, 'utf8');

// Replace all backslashes with forward slashes
const fixed = content.replace(/\\/g, '/');

fs.writeFileSync(registryPath, fixed);
console.log('Fixed registry paths!');
