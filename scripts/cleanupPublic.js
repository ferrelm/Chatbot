const fs = require('fs');
const path = require('path');

const files = [
  path.join(__dirname, '..', 'public', 'server.js'),
  path.join(__dirname, '..', 'public', 'openai.js'),
  path.join(__dirname, '..', 'public', 'config.js'),
];

for (const file of files) {
  try {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
      console.log(`Removed ${path.relative(process.cwd(), file)}`);
    }
  } catch (err) {
    console.warn(`Could not remove ${file}:`, err.message);
  }
}
