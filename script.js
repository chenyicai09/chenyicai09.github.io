const body = document.body;
const languageToggle = document.querySelector('.language-toggle');
const themeToggle = document.querySelector('.theme-toggle');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
const translatable = [...document.querySelectorAll('[data-en][data-zh]')];

let language = localStorage.getItem('language') === 'zh' ? 'zh' : 'en';

function applyLanguage() {
  document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
  translatable.forEach((element) => {
    const text = element.dataset[language].replace(/\\n/g, '\n');
    if (text.includes('\n')) {
      element.replaceChildren(...text.split('\n').flatMap((line, index) => {
        const nodes = [];
        if (index) nodes.push(document.createElement('br'));
        nodes.push(document.createTextNode(line));
        return nodes;
      }));
    } else {
      element.textContent = text;
    }
  });
  languageToggle.textContent = language === 'en' ? '中文' : 'EN';
  languageToggle.setAttribute('aria-label', language === 'en' ? '切换至中文' : 'Switch to English');
}

languageToggle.addEventListener('click', () => {
  language = language === 'en' ? 'zh' : 'en';
  localStorage.setItem('language', language);
  applyLanguage();
});

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  body.classList.add('dark');
}

themeToggle.addEventListener('click', () => {
  body.classList.toggle('dark');
  localStorage.setItem('theme', body.classList.contains('dark') ? 'dark' : 'light');
});

menuToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});

nav.addEventListener('click', (event) => {
  if (event.target.matches('a')) {
    nav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }
});

const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('.site-nav a')];
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      navLinks.forEach((link) => link.classList.toggle('active', link.hash === `#${entry.target.id}`));
    }
  });
}, { rootMargin: '-35% 0px -55% 0px' });

sections.forEach((section) => observer.observe(section));
document.getElementById('year').textContent = new Date().getFullYear();
applyLanguage();
