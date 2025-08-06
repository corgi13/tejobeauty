const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, '../frontend');
const filesToRebrand = [];

function findFiles(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      findFiles(filePath);
    } else {
      if (filePath.endsWith('.tsx') || filePath.endsWith('.ts') || filePath.endsWith('.css')) {
        filesToRebrand.push(filePath);
      }
    }
  }
}

findFiles(directoryPath);

for (const file of filesToRebrand) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/Tejo Nails/g, 'Tejo Beauty');
  content = content.replace(/tejonails.com/g, 'tejobeauty.com');
  content = content.replace(/@tejonails/g, '@tejobeauty');
  fs.writeFileSync(file, content, 'utf8');
  console.log(`Rebranded ${file}`);
}
