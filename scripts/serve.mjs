import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root = resolve(import.meta.dirname, '..', process.argv.includes('--dist') ? 'dist' : '.');
const port = Number(process.env.PORT || 5180);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8' };
http.createServer(async (req, res) => {
  try {
    if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405); return res.end('Method not allowed'); }
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const relative = pathname === '/' ? 'index.html' : pathname.slice(1);
    const target = resolve(root, relative);
    if (!target.startsWith(root + sep) || relative.split(/[\\/]/).some(part => part.startsWith('.'))) {
      res.writeHead(403); return res.end('Forbidden');
    }
    // Dev mode exposes only site entry files and public assets, never repository internals.
    const isPage = ['index.html', 'styles.css', 'main.js', 'privacy.html', 'credits.html', '404.html'].includes(relative);
    const isAsset = /^(images|brand|fonts)\//.test(relative);
    if (!isPage && !isAsset) throw new Error('Not found');
    let file = target;
    if (!process.argv.includes('--dist') && isAsset) file = resolve(root, 'public', relative);
    if (!(await stat(file)).isFile()) throw new Error('Not found');
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache', 'X-Content-Type-Options': 'nosniff' });
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    try { res.end(await readFile(resolve(root, '404.html'))); } catch { res.end('Not found'); }
  }
}).listen(port, '127.0.0.1', () => console.log(`Continental Construction: http://127.0.0.1:${port}`));
