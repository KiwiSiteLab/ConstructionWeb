import { cp, mkdir, copyFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const root = resolve(import.meta.dirname, '..');
const out = resolve(root, 'dist');
await mkdir(out, { recursive: true });
await cp(resolve(root, 'public'), out, { recursive: true });
for (const file of ['index.html', 'styles.css', 'main.js', 'privacy.html', 'credits.html', '404.html']) {
  await copyFile(resolve(root, file), resolve(out, file));
}
console.log('Built static website in dist/ (no runtime dependencies).');
