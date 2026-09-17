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
assert.ok(home.includes('not completed Continental projects'), 'Stock project disclosure missing');
console.log(`PASS: ${pages.length} pages; ${checked} local links and assets; IDs, contact links and content disclosures.`);
