(() => {
  // English is the initial locale; legacy bilingual preferences are ignored.
  document.documentElement.lang = 'en';
  const theme = document.querySelector('[data-theme]');
  let savedTheme;
  try { savedTheme = localStorage.getItem('academic-theme'); } catch {}
  document.body.classList.toggle('dark', savedTheme === 'dark' || (!savedTheme && matchMedia('(prefers-color-scheme: dark)').matches));
  const updateTheme = () => {
    const dark = document.body.classList.contains('dark');
    theme.setAttribute('aria-pressed', String(dark));
    theme.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
  };
  updateTheme();
  theme.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    try { localStorage.setItem('academic-theme', document.body.classList.contains('dark') ? 'dark' : 'light'); } catch {}
    updateTheme();
  });
  const menu = document.querySelector('[data-menu]'), nav = document.querySelector('.site-nav');
  menu.addEventListener('click', () => menu.setAttribute('aria-expanded', String(nav.classList.toggle('open'))));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav.classList.contains('open')) {
      nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); menu.focus();
    }
  });
  const pages = [
    {title:'About',url:'./',text:'Biography, research interests, news, and selected publications'},
    {title:'Publications',url:'publications.html',text:'Research papers, articles, conference proceedings, and preprints'},
    {title:'Projects',url:'projects.html',text:'Urban analytics, computational design, and semantic urban systems'},
    {title:'CV',url:'cv.html',text:'Education, appointments, research interests, and academic service'},
    {title:'Teaching',url:'teaching.html',text:'Courses, supervision, workshops, and learning resources'}
  ];
  const dialog = document.querySelector('.search-dialog'), search = document.querySelector('#site-search');
  const results = document.querySelector('.search-results'), count = document.querySelector('#search-count');
  const renderResults = () => {
    const query = search.value.trim().toLowerCase();
    const matches = pages.filter(page => (page.title + ' ' + page.text).toLowerCase().includes(query));
    results.replaceChildren();
    for (const page of matches) {
      const item = document.createElement('li'), link = document.createElement('a');
      const title = document.createElement('strong'), description = document.createElement('span');
      link.href = page.url; title.textContent = page.title; description.textContent = page.text;
      link.append(title,description); item.append(link); results.append(item);
    }
    count.textContent = matches.length ? `${matches.length} pages · Use Tab to select a result.` : 'No pages found. Try “research”, “CV”, or “teaching”.';
  };
  const openSearch = () => { search.value=''; renderResults(); if (!dialog.open) dialog.showModal(); search.focus(); };
  document.querySelector('[data-search]').addEventListener('click', openSearch);
  document.querySelector('[data-close-search]').addEventListener('click', () => dialog.close());
  search.addEventListener('input', renderResults);
  document.addEventListener('keydown', event => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); openSearch(); }
  });
  document.querySelector('[data-year]').textContent = String(new Date().getFullYear());
})();
