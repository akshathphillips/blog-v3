// theme toggle (persisted)
document.getElementById('theme-toggle').addEventListener('click', () => {
  const root = document.documentElement;
  const dark = root.dataset.theme === 'dark';
  if (dark) delete root.dataset.theme;
  else root.dataset.theme = 'dark';
  localStorage.setItem('theme', dark ? 'light' : 'dark');
});

// glimpses — rendered from content/glimpses.json so new images can be
// dropped into the bucket without a rebuild
const glimpseGrid = document.getElementById('glimpse-grid');
if (glimpseGrid) {
  fetch(glimpseGrid.dataset.src)
    .then((r) => r.json())
    .then((items) => {
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

// bookmarks — rendered from content/bookmarks.json, same idea
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
