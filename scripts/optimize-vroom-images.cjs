// Regenerate responsive assets for the Vroom case study with: node scripts/optimize-vroom-images.cjs
const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('sharp');
const root = path.resolve(__dirname, '..');
const sources = [
  ['banner', 'https://projects.lindaxue.com/images/projects/vtix/banner+logo.png'],
  ['ticketing', '/images/projects/vroom-options/ticketing-hero.png'],
  ['gathering', '/images/projects/vroom-gathering.png'],
  ['tea', '/images/projects/vroom-tea/asks.png'],
  ['rough-draft', 'https://vyml3xz4zis6ggod.public.blob.vercel-storage.com/events/rough-draft-02/photos/img-0162.jpg'],
  ['field-day', 'https://vyml3xz4zis6ggod.public.blob.vercel-storage.com/events/adult-field-day/photos/invitegraphic.jpg'],
  ['yacht', 'https://images.lumacdn.com/cdn-cgi/image/format=auto,fit=cover,dpr=2,background=white,quality=75,width=400,height=400/uploads/od/6ff36850-8f27-49a7-b90b-d4bff16fe44e.png'],
];
async function main() {
  const dir = path.join(root, 'public/images/projects/vroom-optimized');
  await fs.mkdir(dir, { recursive: true });
  const manifest = {};
  for (const [name, src] of sources) {
    let input;
    if (src.startsWith('https:')) {
      const response = await fetch(src, { signal: AbortSignal.timeout(30000) });
      if (!response.ok) throw new Error(`${name}: HTTP ${response.status}`);
      input = Buffer.from(await response.arrayBuffer());
    } else input = await fs.readFile(path.join(root, 'public', src));
    const oriented = await sharp(input).rotate().toBuffer();
    const metadata = await sharp(oriented).metadata();
    const widths = [...new Set([400, 800, 1400].map(width => Math.min(width, metadata.width)))];
    const variants = [];
    for (const width of widths) {
      const filename = `${name}-${width}.webp`;
      const info = await sharp(oriented).resize({ width, withoutEnlargement: true }).webp({ quality: 82 }).toFile(path.join(dir, filename));
      variants.push({ src: `/images/projects/vroom-optimized/${filename}`, width, bytes: info.size });
    }
    const blur = await sharp(oriented).resize({ width: 16 }).webp({ quality: 35 }).toBuffer();
    manifest[src] = { width: metadata.width, height: metadata.height, variants, placeholder: `data:image/webp;base64,${blur.toString('base64')}` };
    console.log(`${name}: ${input.length} bytes → ${variants.map(v => `${v.width}px: ${v.bytes}`).join(', ')}`);
  }
  await fs.writeFile(path.join(root, 'data/vroom-images.json'), JSON.stringify(manifest, null, 2) + '\n');
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
