/**
 * House style: no em dashes anywhere in the repo or in what the build emits.
 *
 * See "House style" in docs/context.md. Use a comma, colon, semicolon,
 * parentheses, or a full stop instead. En dashes in numeric ranges (3-4x,
 * 150-350 words) are deliberately allowed and are not checked here.
 *
 * Note: the banned strings below are assembled from character codes rather
 * than written out, so this file does not trip its own check. That keeps the
 * rule honest, since the test dir is scanned like everything else.
 *
 * Run: npm test
 */
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const ROOT = path.join(__dirname, '..');

const EM = String.fromCharCode(0x2014);

// The character itself, plus the HTML entities that render as one.
const BANNED = [
  { needle: EM, label: `em dash (${EM})`, ci: false },
  { needle: '&' + 'mdash;', label: 'mdash entity', ci: true },
  { needle: '&#' + '8212;', label: 'decimal entity', ci: false },
  { needle: '&#' + 'x2014;', label: 'hex entity', ci: true },
];

const SKIP_DIRS = new Set(['.git', 'node_modules', 'dist']);
const TEXT_EXT = new Set(['.md', '.js', '.json', '.css', '.html', '.yml', '.yaml', '.txt', '.sh']);

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (TEXT_EXT.has(path.extname(entry.name))) out.push(full);
  }
  return out;
}

/** Every offence in a file, as readable "path:line: context" strings. */
function offences(file, base) {
  const rel = path.relative(base, file);
  const hits = [];
  fs.readFileSync(file, 'utf8')
    .split('\n')
    .forEach((line, i) => {
      for (const { needle, label, ci } of BANNED) {
        const hay = ci ? line.toLowerCase() : line;
        const col = hay.indexOf(ci ? needle.toLowerCase() : needle);
        if (col === -1) continue;
        const context = line.slice(Math.max(0, col - 40), col + 40).trim();
        hits.push(`${rel}:${i + 1}: ${label} in "...${context}..."`);
      }
    });
  return hits;
}

const FIX = 'Use a comma, colon, semicolon, parentheses, or a full stop instead. See "House style" in docs/context.md.';

test('no em dashes in repo source files', () => {
  const bad = walk(ROOT).flatMap((f) => offences(f, ROOT));
  assert.deepStrictEqual(bad, [], `Found ${bad.length} offence(s). ${FIX}\n\n${bad.join('\n')}`);
});

test('no em dashes in the built site', () => {
  // Build fresh so the test never passes on stale output.
  execFileSync('node', ['build.js'], { cwd: ROOT, stdio: 'pipe' });
  const dist = path.join(ROOT, 'dist');
  assert.ok(fs.existsSync(dist), 'build.js did not produce dist/');

  const bad = walk(dist).flatMap((f) => offences(f, ROOT));
  assert.deepStrictEqual(
    bad,
    [],
    `Found ${bad.length} offence(s) in built output, from a build.js template or from content/. ${FIX}\n\n${bad.join('\n')}`
  );
});

test('Avi letters sign off without a leading dash', () => {
  // A signature line starting with "- " renders as a bullet, so the house
  // style is a bare "Papa" / "Dad" on the final line.
  const dir = path.join(ROOT, 'content', 'posts');
  const letters = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .filter((f) => /^section:\s*avi\s*$/m.test(fs.readFileSync(path.join(dir, f), 'utf8')));

  assert.ok(letters.length > 0, 'expected at least one avi letter');

  for (const f of letters) {
    const lines = fs.readFileSync(path.join(dir, f), 'utf8').trimEnd().split('\n');
    const last = lines[lines.length - 1].trim();
    assert.match(last, /^(Papa|Dad)$/, `${f}: expected final line "Papa" or "Dad", got "${last}"`);
  }
});
