import { readFile, readdir, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('..', import.meta.url));
const out = path.join(root, '_site');
const config = JSON.parse(await readFile(path.join(root,'site.config.json'),'utf8'));
const errors = [];
async function walk(dir) { const result=[]; for(const e of await readdir(dir,{withFileTypes:true})) { const f=path.join(dir,e.name); result.push(...(e.isDirectory()?await walk(f):[f])); } return result; }
const htmls=(await walk(out)).filter(f=>f.endsWith('.html'));
for(const file of htmls) {
  const html=await readFile(file,'utf8');
  if(!html.includes('<html lang="en">') || !html.includes('name="viewport"')) errors.push(`${file}: missing language/viewport`);
  if((html.match(/<h1[ >]/g)||[]).length!==1) errors.push(`${file}: expected one h1`);
  if(/<script|<iframe/i.test(html)) errors.push(`${file}: unexpected executable/embed`);
  if(html.includes('undefined') || html.includes('[object Object]')) errors.push(`${file}: invalid rendered value`);
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  if(new Set(ids).size!==ids.length) errors.push(`${file}: duplicate id`);
  for(const [,url] of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    if(/^(https:|mailto:)/.test(url)) continue;
    if(!url.startsWith('/')&&!url.startsWith('#')) { errors.push(`${file}: unexpected URL ${url}`); continue; }
    const [pathname,fragment]=url.split('#');
    const target=pathname?path.join(out,pathname.endsWith('/')?pathname+'index.html':pathname):file;
    try {
      await stat(target);
      if(fragment && !(await readFile(target,'utf8')).includes(`id="${fragment}"`)) errors.push(`${file}: missing anchor ${url}`);
    } catch { errors.push(`${file}: broken link ${url}`); }
  }
}
const ads=await readFile(path.join(out,'app-ads.txt'),'utf8');
if(ads.includes('3940256099942544')) errors.push('Demo ad publisher in public artifact');
if(config.adMobPublisherId && !ads.includes(`google.com, ${config.adMobPublisherId}, DIRECT, f08c47fec0942fa0`)) errors.push('app-ads.txt does not match configured publisher');
if(process.argv.includes('--release')) {
  if(!config.supportEmail) errors.push('Public support email missing');
  if(!config.privacyReviewed) errors.push('Privacy policy needs review against final iOS advertising configuration');
  if(!config.adMobPublisherId) errors.push('AdMob publisher ID missing; app-ads.txt cannot verify ownership yet');
}
if(errors.length) { console.error(errors.join('\n')); process.exitCode=1; }
else console.log(`Checked ${htmls.length} pages: internal links, anchors, assets, metadata and ad file OK${process.argv.includes('--release')?' (release configuration)':' (preview; not release approval)'}.`);
