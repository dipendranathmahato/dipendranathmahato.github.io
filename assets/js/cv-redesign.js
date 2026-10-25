// Lightweight, dependency-free interactions for the academic CV.
(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const normalize = text => String(text || '').toLocaleLowerCase().trim();

  // The shared template owns markup, while page scripts bind its controls.
  const menuButton = document.querySelector('.nav-toggle');
  const menuLinks = document.querySelector('.top-nav-links');
  if (menuButton && menuLinks) {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.addEventListener('click', () => {
      const open = menuLinks.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(open));
    });
    menuLinks.addEventListener('click', event => {
      if (event.target.closest('a')) {
        menuLinks.classList.remove('open');
        menuButton.setAttribute('aria-expanded', 'false');
      }
    });
  }
  const dropdown = document.querySelector('.dropdown');
  const dropButton = dropdown?.querySelector('.dropbtn');
  dropButton?.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();
    dropdown.classList.toggle('dropdown-open');
  });
  document.addEventListener('click', event => {
    if (dropdown && !dropdown.contains(event.target)) dropdown.classList.remove('dropdown-open');
  });
  const themeButton = document.querySelector('.theme-toggle');
  const themeKey = 'dm-theme';
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const icon = themeButton?.querySelector('i');
    const label = themeButton?.querySelector('span');
    if (icon) icon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    if (label) label.textContent = theme === 'dark' ? 'Light' : 'Dark';
  }
  let savedTheme = 'light';
  try { savedTheme = localStorage.getItem(themeKey) || 'light'; } catch (_) {}
  applyTheme(savedTheme === 'dark' ? 'dark' : 'light');
  themeButton?.addEventListener('click', () => {
    const nextTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem(themeKey, nextTheme); } catch (_) {}
    applyTheme(nextTheme);
  });


  let talkFilter = 'all';
  const talkQuery = $('#cvx-talk-query');
  const talkItems = $$('.cvx-talk');
  function updateTalks() {
    const q = normalize(talkQuery?.value);
    let count = 0;
    talkItems.forEach(item => {
      const yr = item.dataset.year;
      const yearMatches = talkFilter === 'all' || (talkFilter === 'earlier' ? (+yr < 2025) : yr === talkFilter);
      const match = yearMatches && normalize(item.dataset.search || item.textContent).includes(q);
      item.hidden = !match;
      if (match) count++;
    });
    const label = $('#cvx-talk-count');
    if (label) label.textContent = `${count} of ${talkItems.length} talks shown`;
    if ($('#cvx-talk-empty')) $('#cvx-talk-empty').hidden = count !== 0;
  }
  talkQuery?.addEventListener('input', updateTalks);
  $$('[data-talk-filter]').forEach(btn => btn.addEventListener('click', () => {
    talkFilter = btn.dataset.talkFilter;
    $$('[data-talk-filter]').forEach(other => {
      const active = other === btn;
      other.classList.toggle('is-active', active);
      other.setAttribute('aria-pressed', String(active));
    });
    updateTalks();
  }));

  const eventSearch = $('#cvx-event-query');
  const eventItems = $$('.cvx-event');
  const yearGroups = $$('.cvx-year');
  let allExpanded = false;
  function updateEvents() {
    const q = normalize(eventSearch?.value);
    let total = 0;
    yearGroups.forEach(group => {
      let visibleInYear = 0;
      group.querySelectorAll('.cvx-event').forEach(item => {
        const match = !q || normalize(item.dataset.search || item.textContent).includes(q);
        item.hidden = !match;
        if (match) { total++; visibleInYear++; }
      });
      group.hidden = q.length > 0 && !visibleInYear;
      if (q) group.open = visibleInYear > 0;
      else group.open = allExpanded || group.dataset.year === '2026';
    });
    const label = $('#cvx-event-count');
    if (label) label.textContent = `${total} of ${eventItems.length} academic activities shown`;
  }
  eventSearch?.addEventListener('input', updateEvents);
  $('#cvx-expand-years')?.addEventListener('click', e => {
    allExpanded = !allExpanded;
    e.currentTarget.textContent = allExpanded ? 'Collapse older years' : 'Expand all years';
    if (eventSearch) eventSearch.value = '';
    updateEvents();
  });

  // Keep in-page section links in sync with scroll without affecting site navigation.
  const navLinks = $$('.cvx-nav-links a');
  if ('IntersectionObserver' in window && navLinks.length) {
    const sections = $$('.cvx-page section[id]');
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting)
        .sort((a,b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (!visible.length) return;
      const id = visible[0].target.id;
      navLinks.forEach(link => {
        const active = link.hash === `#${id}`;
        link.classList.toggle('is-active', active);
        if (active && window.matchMedia('(max-width:690px)').matches) {
          const list = link.closest('.cvx-nav-links');
          if (list && link.offsetLeft < list.scrollLeft) list.scrollLeft = Math.max(0, link.offsetLeft - 18);
          else if (list && link.offsetLeft + link.offsetWidth > list.scrollLeft + list.clientWidth)
            list.scrollLeft = link.offsetLeft + link.offsetWidth - list.clientWidth + 20;
        }
      });
    }, { rootMargin:'-90px 0px -68% 0px', threshold:0 });
    sections.forEach(section => observer.observe(section));
  }
})();
