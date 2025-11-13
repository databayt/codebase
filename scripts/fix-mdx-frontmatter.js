const fs = require('fs');
const path = require('path');

function findMDXFiles(dir, files = []) {
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      findMDXFiles(fullPath, files);
    } else if (item.endsWith('.mdx')) {
      files.push(fullPath);
    }
  }

  return files;
}

// Find all MDX files in content/docs
const docsDir = path.join(process.cwd(), 'content', 'docs');
const mdxFiles = findMDXFiles(docsDir);

mdxFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf-8');
  const filename = path.basename(file, '.mdx');

  // Generate title from filename
  const title = filename
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .replace(/Index/g, 'Overview');

  const description = `Documentation for ${title}`;

  let newContent;

  if (content.startsWith('---')) {
    // Has frontmatter but might be missing title/description
    const frontmatterEnd = content.indexOf('---', 3);
    const frontmatter = content.substring(3, frontmatterEnd);

    // Check if title and description exist
    let updatedFrontmatter = frontmatter;
    if (!frontmatter.includes('title:')) {
      updatedFrontmatter = `title: "${title}"\n${updatedFrontmatter}`;
    }
    if (!frontmatter.includes('description:')) {
      updatedFrontmatter = `description: "${description}"\n${updatedFrontmatter}`;
    }

    // Only update if changes were made
    if (updatedFrontmatter !== frontmatter) {
      newContent = `---\n${updatedFrontmatter}---` + content.substring(frontmatterEnd + 3);
      fs.writeFileSync(file, newContent);
      console.log(`Fixed: ${path.relative(process.cwd(), file)}`);
    }
  } else {
    // No frontmatter at all
    const frontmatter = `---
title: "${title}"
description: "${description}"
---

`;
    newContent = frontmatter + content;
    fs.writeFileSync(file, newContent);
    console.log(`Added frontmatter to: ${path.relative(process.cwd(), file)}`);
  }
});

console.log(`\nProcessed ${mdxFiles.length} MDX files!`);