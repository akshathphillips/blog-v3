#!/usr/bin/env node
/**
 * blog-v3 build script — zero dependencies.
 *
 * content/posts/*.md  -> dist/writing/<slug>/index.html (one page per post)
 * content/*.json      -> dist/content/ (fetched at runtime by glimpses/bookmarks,
 *                        so editing the JSON in the bucket updates the live site)
 * static/*            -> dist/
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const DIST = path.join(ROOT, 'dist');

const SITE = {
  title: 'Akshath Phillips',
  subtitle: 'Software Engineer | Washington, DC',
  url: '',
};

/* ---------------- markdown ---------------- */

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function inline(text) {
  return text
    .replace(/`([^`]+)`/g, (_, c) => `<code>${escapeHtml(c)}</code>`)
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>');
}

function markdown(src) {
  const lines = src.split('\n');
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('```')) {
      const code = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) code.push(lines[i++]);
      i++;
      out.push(`<pre><code>${escapeHtml(code.join('\n'))}</code></pre>`);
      continue;
    }
    const h = line.match(/^(#{1,4})\s+(.*)/);
    if (h) {
      const level = h[1].length + 1; // post title is the h1
      out.push(`<h${level}>${inline(h[2])}</h${level}>`);
      i++;
      continue;
    }
    if (line.startsWith('>')) {
      const quote = [];
      while (i < lines.length && lines[i].startsWith('>')) quote.push(lines[i++].replace(/^>\s?/, ''));
      out.push(`<blockquote><p>${inline(quote.join(' '))}</p></blockquote>`);
      continue;
    }
    if (/^\s*[-*]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) items.push(lines[i++].replace(/^\s*[-*]\s+/, ''));
      out.push(`<ul>${items.map((it) => `<li>${inline(it)}</li>`).join('')}</ul>`);
      continue;
    }
    if (line.trim() === '') {
      i++;
      continue;
    }
    const para = [];
    while (i < lines.length && lines[i].trim() !== '' && !/^(#|>|```|\s*[-*]\s)/.test(lines[i])) para.push(lines[i++]);
    out.push(`<p>${inline(para.join(' '))}</p>`);
  }
  return out.join('\n');
}

function frontmatter(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { meta: {}, body: src };
  const meta = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (kv) meta[kv[1]] = kv[2].trim();
  }
  return { meta, body: m[2] };
}

/* ---------------- layout ---------------- */

function page({ title, nav, content, depth = 0, description = '' }) {
  const p = '../'.repeat(depth);
  const navItem = (href, label, key) =>
    `<a href="${p}${href}" class="nav-link${nav === key ? ' active' : ''}">${label}</a>`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title ? `${title} — ` : ''}${SITE.title}</title>
${description ? `<meta name="description" content="${escapeHtml(description)}">` : ''}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,600;0,700;1,400&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${p}assets/style.css">
<script>
// apply saved theme before first paint
(function () {
  var t = localStorage.getItem('theme');
  if (t === 'dark' || (!t && matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.dataset.theme = 'dark';
  }
})();
</script>
</head>
<body>
<header class="site-header">
  <button id="theme-toggle" aria-label="Toggle dark mode" title="Toggle dark mode">◐</button>
  <h1 class="site-title"><a href="${p}index.html">${SITE.title}</a></h1>
  <p class="site-subtitle">${SITE.subtitle}</p>
  <nav class="site-nav">
    ${navItem('index.html', 'Home', 'home')}
    ${navItem('writing/index.html', 'Writing', 'writing')}
    ${navItem('glimpses.html', 'Glimpses', 'glimpses')}
    ${navItem('bookmarks.html', 'Bookmarks', 'bookmarks')}
  </nav>
</header>
<main class="site-main">
${content}
</main>
<footer class="site-footer">
  <p>© ${new Date().getFullYear()} Akshath Phillips · built with a <a href="https://github.com/akshathphillips/blog-v3">little script</a>, served from S3</p>
</footer>
<script src="${p}assets/site.js"></script>
</body>
</html>`;
}

const fmtDate = (d) =>
  new Date(d + 'T12:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

/* ---------------- build ---------------- */

fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(path.join(DIST, 'writing'), { recursive: true });
fs.mkdirSync(path.join(DIST, 'assets'), { recursive: true });
fs.mkdirSync(path.join(DIST, 'content'), { recursive: true });

// static assets
for (const f of fs.readdirSync(path.join(ROOT, 'static'))) {
  fs.copyFileSync(path.join(ROOT, 'static', f), path.join(DIST, 'assets', f));
}

// runtime content (json + glimpse images)
for (const f of fs.readdirSync(path.join(ROOT, 'content'))) {
  const full = path.join(ROOT, 'content', f);
  if (fs.statSync(full).isFile()) fs.copyFileSync(full, path.join(DIST, 'content', f));
}
fs.cpSync(path.join(ROOT, 'content', 'glimpses'), path.join(DIST, 'content', 'glimpses'), { recursive: true });

// posts
const posts = fs
  .readdirSync(path.join(ROOT, 'content', 'posts'))
  .filter((f) => f.endsWith('.md'))
  .map((f) => {
    const { meta, body } = frontmatter(fs.readFileSync(path.join(ROOT, 'content', 'posts', f), 'utf8'));
    const slug = f.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '');
    return { slug, meta, body };
  })
  .sort((a, b) => (a.meta.date < b.meta.date ? 1 : -1));

for (const post of posts) {
  const dir = path.join(DIST, 'writing', post.slug);
  fs.mkdirSync(dir, { recursive: true });
  const content = `
<article class="post">
  <h1 class="post-title">${post.meta.title}</h1>
  <p class="post-date">${fmtDate(post.meta.date)}</p>
  ${markdown(post.body)}
  <p class="post-back"><a href="../index.html">← all writing</a></p>
</article>`;
  fs.writeFileSync(
    path.join(dir, 'index.html'),
    page({ title: post.meta.title, nav: 'writing', content, depth: 2, description: post.meta.description || '' })
  );
}

const postList = (list) =>
  `<ul class="post-list">${list
    .map(
      (p) => `
  <li class="post-list-item">
    <a class="post-list-title" href="writing/${p.slug}/index.html">${p.meta.title}</a>
    <span class="post-list-date">${fmtDate(p.meta.date)}</span>
    ${p.meta.description ? `<p class="post-list-desc">${p.meta.description}</p>` : ''}
  </li>`
    )
    .join('')}</ul>`;

// writing index
fs.writeFileSync(
  path.join(DIST, 'writing', 'index.html'),
  page({
    title: 'Writing',
    nav: 'writing',
    depth: 1,
    content: `<h1 class="page-title">Writing</h1>\n${postList(posts).replace(/href="writing\//g, 'href="')}`,
  })
);

// home
fs.writeFileSync(
  path.join(DIST, 'index.html'),
  page({
    title: '',
    nav: 'home',
    content: `
<section class="intro">
  <p>Hi, I'm Akshath. This is my corner of the internet — not a résumé, not a portfolio.
  I write about my life and the things I build, keep <a href="glimpses.html">glimpses</a> of
  what I've been up to, and hoard <a href="bookmarks.html">bookmarks</a> worth keeping.</p>
</section>
<section>
  <h2 class="section-title">Recent writing</h2>
  ${postList(posts.slice(0, 5))}
</section>`,
  })
);

// glimpses + bookmarks shells (data fetched at runtime from content/*.json)
fs.writeFileSync(
  path.join(DIST, 'glimpses.html'),
  page({
    title: 'Glimpses',
    nav: 'glimpses',
    content: `
<h1 class="page-title">Glimpses</h1>
<p class="page-lede">Small snapshots of life, no context owed.</p>
<div id="glimpse-grid" class="glimpse-grid" data-src="content/glimpses.json"></div>`,
  })
);

fs.writeFileSync(
  path.join(DIST, 'bookmarks.html'),
  page({
    title: 'Bookmarks',
    nav: 'bookmarks',
    content: `
<h1 class="page-title">Bookmarks</h1>
<p class="page-lede">Cool projects, recipes, rabbit holes — my universal bookmark bar.</p>
<div id="bookmark-list" data-src="content/bookmarks.json"></div>`,
  })
);

// 404
fs.writeFileSync(
  path.join(DIST, '404.html'),
  page({ title: 'Not found', nav: '', content: `<h1 class="page-title">404</h1><p>Nothing here. <a href="index.html">Go home.</a></p>` })
);

console.log(`Built ${posts.length} post(s) → dist/`);
