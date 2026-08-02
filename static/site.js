// theme toggle (persisted)
document.getElementById('theme-toggle').addEventListener('click', () => {
  const root = document.documentElement;
  const dark = root.dataset.theme === 'dark';
  if (dark) delete root.dataset.theme;
  else root.dataset.theme = 'dark';
  localStorage.setItem('theme', dark ? 'light' : 'dark');
});

// glimpses: rendered from content/glimpses.json so new images can be
// dropped into the bucket without a rebuild
const glimpseGrid = document.getElementById('glimpse-grid');
if (glimpseGrid) {
  fetch(glimpseGrid.dataset.src)
    .then((r) => r.json())
    .then((items) => {
      if (!items.length) {
        glimpseGrid.innerHTML = '<p class="coming-soon">Coming soon…</p>';
        return;
      }
      glimpseGrid.innerHTML = items
        .map(
          (g) => `
        <figure class="glimpse">
          <img src="content/glimpses/${g.image}" alt="${g.caption || ''}" loading="lazy">
          <figcaption>${g.caption || ''}${g.date ? `<span class="glimpse-date">${g.date}</span>` : ''}</figcaption>
        </figure>`
        )
        .join('');
    })
    .catch(() => {
      glimpseGrid.innerHTML = '<p>Could not load glimpses.</p>';
    });
}

// bookmarks: rendered from content/bookmarks.json, same idea
const bookmarkList = document.getElementById('bookmark-list');
if (bookmarkList) {
  fetch(bookmarkList.dataset.src)
    .then((r) => r.json())
    .then((categories) => {
      bookmarkList.innerHTML = categories
        .map(
          (cat) => `
        <section class="bookmark-category">
          <h2>${cat.category}</h2>
          ${cat.links
            .map(
              (l) => `
          <div class="bookmark">
            <a href="${l.url}" target="_blank" rel="noopener">${l.title}</a>
            ${l.note ? `<p>${l.note}</p>` : ''}
            ${
              l.tags && l.tags.length
                ? `<ul class="post-list-tags">${l.tags
                    .map((t) => `<li><a class="tag" href="/search.html?tag=${encodeURIComponent(t)}">${t}</a></li>`)
                    .join('')}</ul>`
                : ''
            }
          </div>`
            )
            .join('')}
        </section>`
        )
        .join('');
    })
    .catch(() => {
      bookmarkList.innerHTML = '<p>Could not load bookmarks.</p>';
    });
}

// search: filters content/search-index.json client-side; supports ?q= and ?tag=
const searchResults = document.getElementById('search-results');
if (searchResults) {
  const input = document.getElementById('search-input');
  const tagCloud = document.getElementById('tag-cloud');
  const countEl = document.getElementById('search-count');
  const params = new URLSearchParams(location.search);
  let query = params.get('q') || '';
  let activeTag = params.get('tag') || '';
  let items = [];
  input.value = query;

  const esc = (s) =>
    String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  fetch(searchResults.dataset.src)
    .then((r) => r.json())
    .then((data) => {
      items = data;
      renderTags();
      render();
      input.focus();
    })
    .catch(() => {
      searchResults.innerHTML = '<p>Could not load the search index.</p>';
    });

  function tagCounts() {
    const counts = {};
    items.forEach((it) => (it.tags || []).forEach((t) => (counts[t] = (counts[t] || 0) + 1)));
    return Object.entries(counts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }

  function renderTags() {
    tagCloud.innerHTML = tagCounts()
      .map(
        ([t, c]) =>
          `<button type="button" class="tag tag-toggle${t === activeTag ? ' active' : ''}" data-tag="${esc(
            t
          )}">${esc(t)} <span class="tag-count">${c}</span></button>`
      )
      .join('');
  }

  function syncUrl() {
    const p = new URLSearchParams();
    if (query) p.set('q', query);
    if (activeTag) p.set('tag', activeTag);
    const qs = p.toString();
    history.replaceState(null, '', qs ? '?' + qs : location.pathname);
  }

  function matches(it) {
    if (activeTag && !(it.tags || []).includes(activeTag)) return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    const hay = [it.title, it.description, it.text, it.category, it.section, (it.tags || []).join(' ')]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return hay.includes(q);
  }

  function render() {
    const results = items.filter(matches);
    const label = activeTag ? ` tagged “${esc(activeTag)}”` : '';
    countEl.textContent = query || activeTag ? `${results.length} result${results.length === 1 ? '' : 's'}${label}` : '';

    if (!results.length) {
      searchResults.innerHTML = `<p class="search-empty">No matches${query ? ` for “${esc(query)}”` : ''}${label}.</p>`;
      return;
    }

    searchResults.innerHTML = results
      .map((it) => {
        const external = it.type === 'bookmark';
        const tags = (it.tags || [])
          .map((t) => `<li><a class="tag" href="/search.html?tag=${encodeURIComponent(t)}">${esc(t)}</a></li>`)
          .join('');
        return `
      <article class="result">
        <a class="result-title" href="${esc(it.url)}"${external ? ' target="_blank" rel="noopener"' : ''}>${esc(
          it.title
        )}</a>
        <span class="result-type">${it.type === 'bookmark' ? esc(it.category || 'bookmark') : esc(it.section)}</span>
        ${it.description ? `<p class="result-desc">${esc(it.description)}</p>` : ''}
        ${tags ? `<ul class="post-list-tags">${tags}</ul>` : ''}
      </article>`;
      })
      .join('');
  }

  input.addEventListener('input', () => {
    query = input.value;
    syncUrl();
    render();
  });

  // one delegated handler for the tag-cloud toggle buttons
  tagCloud.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-tag]');
    if (!btn) return;
    activeTag = btn.dataset.tag === activeTag ? '' : btn.dataset.tag;
    syncUrl();
    renderTags();
    render();
  });
}
