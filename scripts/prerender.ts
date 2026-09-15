import { readFile, writeFile } from 'node:fs/promises';
import { injectPage } from './render.tsx';

const output = new URL('../dist/index.html', import.meta.url);
await writeFile(output, injectPage(await readFile(output, 'utf8')));
console.log('Prerendered the public React shell into dist/index.html');
