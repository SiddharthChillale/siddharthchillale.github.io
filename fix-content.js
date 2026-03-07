const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix remaining "figure align=center" text
  content = content.replace(/figure align=center/g, 'figure');
  
  // Fix remaining Hugo shortcode patterns that might exist
  content = content.replace(/{{< \/?[a-z]+[^>]*>}}/g, '');
  
  // Clean up multiple blank lines
  content = content.replace(/\n{3,}/g, '\n\n');
  
  // Clean up lines that are just URLs without proper formatting
  content = content.replace(/^\/images\/[^\n]+\n/g, '\n');
  
  // Clean up leading/trailing whitespace
  content = content.split('\n').map(line => line.trimEnd()).join('\n');
  
  // Fix image syntax that's missing the markdown
  content = content.replace(/^(?!\[)([a-z\/].*\.(png|jpg|jpeg|gif|svg))$/gim, '![]($1)');
  
  fs.writeFileSync(filePath, content);
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      walkDir(filePath);
    } else if (file.endsWith('.md')) {
      processFile(filePath);
    }
  });
}

walkDir('./src/content/blog');
walkDir('./src/content/projects');
console.log('Done processing markdown files');
