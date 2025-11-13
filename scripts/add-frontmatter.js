const fs = require('fs');
const path = require('path');

// Function to extract title from MDX content
function extractTitle(content) {
  // Try to find the first h1 heading
  const h1Match = content.match(/^#\s+(.+)$/m);
  if (h1Match) {
    return h1Match[1].trim();
  }

  // Fallback to filename
  return null;
}

// Function to add frontmatter to MDX file
function addFrontmatter(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');

  // Check if file already has frontmatter
  if (content.startsWith('---')) {
    console.log(`Skipping ${filePath} - already has frontmatter`);
    return;
  }

  const fileName = path.basename(filePath, '.mdx');
  const title = extractTitle(content) || fileName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const description = `Documentation for ${title}`;

  const frontmatter = `---
title: "${title}"
description: "${description}"
---

`;

  const newContent = frontmatter + content;
  fs.writeFileSync(filePath, newContent, 'utf-8');
  console.log(`Added frontmatter to ${filePath}`);
}

// Process all MDX files in content/docs
function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (file.endsWith('.mdx')) {
      addFrontmatter(fullPath);
    }
  }
}

// Start processing
const docsPath = path.join(__dirname, '..', 'content', 'docs');
processDirectory(docsPath);
console.log('Frontmatter addition complete!');