import { readFile, access, readdir } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import assert from 'node:assert/strict';
const root = resolve(import.meta.dirname, '..', 'dist');
const pages = (await readdir(root)).filter(file => extname(file) === '.html');
let checked = 0;
for (const page of pages) {
  const html = await readFile(resolve(root, page), 'utf8');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(ids.length, new Set(ids).size, `${page}: duplicate IDs`);
  for (const [, ref] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (/^(https?:|tel:|sms:|data:)/.test(ref)) continue;
    const [file, hash] = ref.split('#');
    const destination = file ? resolve(root, file) : resolve(root, page);
    await access(destination);
    if (hash) {
      const source = file ? await readFile(destination, 'utf8') : html;
      assert.ok(source.includes(`id="${hash}"`), `${page}: missing fragment ${ref}`);
    }
    checked++;
  }
  for (const [, image] of html.matchAll(/data-image="([^"]+)"/g)) await access(resolve(root, 'images', image));
}
const css = await readFile(resolve(root, 'styles.css'), 'utf8');
for (const [, resource] of css.matchAll(/url\(['"]?(\.\/[^'")]+)['"]?\)/g)) await access(resolve(root, resource));
assert.ok(css.includes('prefers-reduced-motion:reduce'), 'Missing reduced-motion fallback');
assert.ok(css.includes('object-fit:contain'), 'Gallery must show uncropped images');
const home = await readFile(resolve(root, 'index.html'), 'utf8');
assert.equal([...home.matchAll(/<h1\b/g)].length, 1, 'Home needs one primary heading');
for (const [, phone] of home.matchAll(/href="(?:tel|sms):([^"]+)"/g)) assert.equal(phone, '+64210622832');
assert.ok(home.includes('not verified customer testimonials'), 'Sample review disclosure missing');
assert.ok(home.includes('Architectural inspiration / stock photography'), 'Background stock disclosure missing');
const { projects } = await import('../portfolio-data.js');
assert.equal(projects.length, 23, 'Expected all 23 supplied site photographs');
for (const photo of projects) {
  await access(resolve(root, 'images', photo.file));
  await access(resolve(root, 'images', photo.thumb));
  await access(resolve(root, photo.source));
  if (photo.enhancedFile) await access(resolve(root, 'images', photo.enhancedFile));
}
assert.equal(new Set(projects.map(photo => photo.id)).size, projects.length, 'Photo IDs must be unique');
for (const pair of [1,2]) {
  assert.equal(projects.filter(photo => photo.pair === pair && photo.stage === 'Before').length, 1);
  assert.equal(projects.filter(photo => photo.pair === pair && photo.stage === 'After').length, 1);
}
console.log(`PASS: ${pages.length} pages; ${checked} local links and assets; IDs, contact links and content disclosures.`);
