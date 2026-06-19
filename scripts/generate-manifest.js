/**
 * Scans video folders and generates assets/videos-manifest.json
 * Merges metrics from assets/videos.config.json (only non-empty values)
 *
 * Usage: npm run generate-manifest
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const EXT = ['.mp4', '.webm', '.mov'];

const FOLDERS = {
  ghost: { dir: 'assets/videos/ghost', url: 'assets/videos/ghost/', limit: 3 },
  public: { dir: 'assets/videos/public', url: 'assets/videos/public/', limit: 3 },
  longform: { dir: 'assets/videos/longform', url: 'assets/videos/longform/', limit: 1 }
};

function readConfig() {
  const p = path.join(ROOT, 'assets/videos.config.json');
  if (!fs.existsSync(p)) return {};
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function scan(dir, url, limit, typeConfig) {
  const full = path.join(ROOT, dir);
  if (!fs.existsSync(full)) {
    fs.mkdirSync(full, { recursive: true });
    return [];
  }

  return fs.readdirSync(full)
    .filter((f) => EXT.includes(path.extname(f).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .slice(0, limit)
    .map((filename, i) => {
      const metric = typeConfig?.[filename]?.metric;
      const entry = {
        src: `${url}${filename}`,
        filename,
        title: filename.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ')
      };
      if (metric && metric.trim()) entry.metric = metric.trim();
      return entry;
    });
}

const config = readConfig();
const manifest = { generated: new Date().toISOString() };

for (const [key, { dir, url, limit }] of Object.entries(FOLDERS)) {
  manifest[key] = scan(dir, url, limit, config[key] || {});
}

const out = path.join(ROOT, 'assets/videos-manifest.json');
fs.writeFileSync(out, JSON.stringify(manifest, null, 2));

console.log('Manifest written:', out);
Object.entries(FOLDERS).forEach(([k]) => console.log(`  ${k}: ${manifest[k].length} video(s)`));
