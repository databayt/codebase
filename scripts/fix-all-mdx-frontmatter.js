const fs = require('fs');
const path = require('path');

function getAllMdxFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllMdxFiles(filePath, arrayOfFiles);
    } else if (filePath.endsWith('.mdx')) {
      arrayOfFiles.push(filePath);
    }
  });

  return arrayOfFiles;
}

// Get all MDX files in content/docs
const files = getAllMdxFiles('content/docs');

files.forEach((filePath) => {
  const content = fs.readFileSync(filePath, 'utf-8');

  // Check if file already has frontmatter with title
  const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);

  if (!frontmatterMatch) {
    // No frontmatter at all, add it
    const fileName = path.basename(filePath, '.mdx');
    const title = fileName.split('-').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');

    const newContent = `---
title: "${title}"
description: "Documentation for ${title}"
---

${content}`;

    fs.writeFileSync(filePath, newContent);
    console.log(`Added frontmatter to: ${filePath}`);
  } else {
    // Check if title exists in frontmatter
    const frontmatter = frontmatterMatch[1];
    if (!frontmatter.includes('title:')) {
      // Add title to existing frontmatter
      const fileName = path.basename(filePath, '.mdx');
      const title = fileName.split('-').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');

      const updatedFrontmatter = `---
title: "${title}"
description: "Documentation for ${title}"
${frontmatter}
---`;

      const newContent = content.replace(/^---\s*\n[\s\S]*?\n---/, updatedFrontmatter);
      fs.writeFileSync(filePath, newContent);
      console.log(`Added title to frontmatter: ${filePath}`);
    }
  }
});

console.log('Done processing all MDX files');