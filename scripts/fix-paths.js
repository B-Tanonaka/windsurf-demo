import replace from 'replace-in-file';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const buildPath = path.join(__dirname, '../build');

const options = {
  files: [
    `${buildPath}/**/*.html`,
    `${buildPath}/**/*.js`,
    `${buildPath}/**/*.css`,
    `${buildPath}/**/*.json`,
  ],
  from: [
    /\/static\//g,
    /"\/manifest.json"/g,
    /'\/manifest.json'/g,
  ],
  to: [
    '/Windsurf-Demo/static/',
    '"/Windsurf-Demo/manifest.json"',
    "'/Windsurf-Demo/manifest.json'",
  ],
};

// Update index.html
const indexPath = path.join(buildPath, 'index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf8');
indexHtml = indexHtml.replace(/<base href="%PUBLIC_URL%\/" \/>/, '<base href="/Windsurf-Demo/" />');
fs.writeFileSync(indexPath, indexHtml, 'utf8');

// Update other files
try {
  const results = await replace(options);
  console.log('Replacement results:', results);
} catch (error) {
  console.error('Error occurred:', error);
  process.exit(1);
}

// Make the script self-executing
const main = async () => {
  try {
    const results = await replace(options);
    console.log('Replacement results:', results);
  } catch (error) {
    console.error('Error occurred:', error);
    process.exit(1);
  }
};

main();
