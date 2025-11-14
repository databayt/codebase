const fs = require('fs');
const path = require('path');

const registryPath = path.join(__dirname, 'src/components/root/template/__registry__/index.tsx');
const content = fs.readFileSync(registryPath, 'utf8');

// Remove .tsx extensions from imports
const fixed = content.replace(/import\("@\/registry\/([^"]+)\.tsx"\)/g, 'import("@/registry/$1")');

fs.writeFileSync(registryPath, fixed);
console.log('Fixed registry imports!');
