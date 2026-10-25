/* Shared site template. Edit HEADER, SIDEBAR and FOOTER here to update every page.
   Page files contain placeholders only; all shared markup lives here. */
(() => {
  "use strict";
  const script = document.currentScript;
  const siteRoot = new URL("../../", script.src);
  const HEADER = `
<header class="top-nav">
      <div class="brand">
        <img src="/assets/images/utrgv-logo.svg"
             class="nav-logo"
             alt="University of Texas Rio Grande Valley logo" style="width:110px;height:auto;object-fit:contain" />
        <a href="index.html" class="brand-name-link">
          <span>Dipendranath Mahato</span>
        </a>
      </div>

      <!-- Mobile menu button -->
      <button class="nav-toggle" aria-label="Toggle navigation">
        <i class="fa-solid fa-bars"></i>
      </button>

      <nav class="top-nav-links">
        <a href="index.html">Home</a>
        <a href="about.html">About</a>
        <a href="research.html">Research</a>
        <a href="teaching.html">Teaching</a>
        <a href="presentations.html">Presentations</a>

        <div class="dropdown">
          <button class="dropbtn">
            More <i class="fa-solid fa-chevron-down"></i>
          </button>
          <div class="dropdown-content">
            <a href="outreach-services.html">Outreach &amp; Services</a>
            <a href="blogs.html">Blogs</a>
            <a href="resources.html">Resources</a>
          </div>
        </div>
      </nav>

      <div class="controls">
        <button class="pill-button secondary theme-toggle" type="button" aria-label="Toggle dark mode">
          <i class="fa-solid fa-moon"></i>
          <span>Dark</span>
        </button>

        <a href="cv.html" class="pill-button primary cv-button">
          <i class="fa-solid fa-file-lines"></i>
          <span>CV</span>
        </a>
      </div>
    </header>
`;
  const SIDEBAR = `
<aside class="sidebar">
        <div class="avatar">
          <img src="/assets/images/PXL_20250330_220427523-1575x2800-compressed.jpg" alt="Dipendranath Mahato" />
          <!--<div class="status-chip">
            IN JOB MARKET
          </div>-->
        </div>

        <div class="name">Dipendranath Mahato</div>
        <div class="title">Lecturer in Mathematics</div>
        <div class="affiliation">
          <strong>University of Texas Rio Grande Valley</strong><br />
          School of Mathematical and Statistical Sciences
        </div>

        <!-- Research area padded block -->
        <div class="research-area-block">
          <div class="research-area-title">
            <i class="ai ai-academic-cap"></i>
            <span>Research Areas</span>
          </div>

          <div class="research-chips">
            <a href="research.html#commutative" class="chip">Commutative Algebra</a>
            <a href="research.html#algebraic-geometry" class="chip">Algebraic Geometry</a>
            <a href="research.html#combinatorial" class="chip">Combinatorial Algebra</a>
          </div>
        </div>

        <div class="sidebar-section">
          <h3>Contact</h3>
          <ul class="info-list">
            <li>
              <i class="fa-regular fa-envelope"></i>
              <span><a href="mailto:dipendranath.mahato@utrgv.edu">dipendranath.mahato@utrgv.edu</a></span>
            </li>
            <li>
              <i class="fa-regular fa-envelope"></i>
              <span><a href="mailto:dipendranathmahato13@gmail.com">dipendranathmahato13@gmail.com</a></span>
            </li>
            <li>
              <i class="fa-regular fa-building"></i>
              <span>School of Mathematical and Statistical Sciences</span>
            </li>
            <li>
              <i class="fa-solid fa-location-dot"></i>
              <span>Edinburg, Texas, USA</span>
            </li>
          </ul>
        </div>

        <div class="sidebar-section">
          <h3>Online</h3>
          <div class="social-links">
            <a href="https://github.com/dipendranathmahato" aria-label="GitHub">
              <i class="fa-brands fa-github"></i>
            </a>
            <a href="https://scholar.google.com/citations?hl=en&authuser=1&user=dRoXm28AAAAJ" aria-label="Google Scholar">
              <i class="ai ai-google-scholar"></i>
            </a>
            <a href="https://orcid.org/0000-0003-4122-2622" aria-label="ORCID">
              <i class="fa-brands fa-orcid"></i>
            </a>
            <a href="https://www.linkedin.com/in/dipendranathmahato" aria-label="LinkedIn">
              <i class="fa-brands fa-linkedin-in"></i>
            </a>
            <a href="https://www.researchgate.net/profile/Dipendranath-Mahato-2" aria-label="ResearchGate">
              <i class="fa-brands fa-researchgate"></i>
            </a>
            <a href="https://arxiv.org/search/?query=Mahato%2C+Dipendranath&searchtype=author&abstracts=show&order=-announced_date_first&size=50" aria-label="arXiv">
              <i class="ai ai-arxiv"></i>
            </a>
            <a href="https://tulane.academia.edu/DipendranathMahato" aria-label="Academia">
              <i class="ai ai-academia"></i>
            </a>
          </div>
        </div>
      </aside>
`;
  const FOOTER = `
<div class="footer">
          © <span id="year"></span> Copyright @ Dipendranath Mahato —
          Made with <a href="https://pages.github.com/">GitHub Pages</a> · Enhanced with <a href="https://chatgpt.com/">ChatGPT</a>.
        </div>
`;
  function mount(selector, markup) {
    const target = document.querySelector(selector);
    if (!target) return;
    const template = document.createElement("template");
    template.innerHTML = markup;
    const element = template.content.firstElementChild;
    element.querySelectorAll("[href], [src]").forEach(node => {
      ["href", "src"].forEach(attribute => {
        const value = node.getAttribute(attribute);
        if (!value || /^(?:[a-z]+:|#|\/\/)/i.test(value)) return;
        node.setAttribute(attribute, new URL(value.replace(/^\//, ""), siteRoot).href);
      });
    });
    target.replaceWith(element);
  }
  mount("header.top-nav", HEADER);
  mount("aside.sidebar", SIDEBAR);
  mount(".footer", FOOTER);
  const footerYear = document.getElementById("year");
  if (footerYear) footerYear.textContent = String(new Date().getFullYear());
  // Site-wide public counter — official CounterAPI widget integration.
  // Prior handcrafted SVG badges did not load reliably on the live website.
  // The provider stores the number (not GitHub Pages). Local previews do not count.
  function addSiteVisitsCounter() {
    const sidebar = document.querySelector("aside.sidebar");
    if (!sidebar) return;
    const block = document.createElement("section");
    block.className = "sidebar-section sitewide-visit-counter";
    block.setAttribute("aria-label", "All-time site visits");
    block.innerHTML = `<h3><i class="fa-solid fa-chart-simple" aria-hidden="true"></i> All-time site visits</h3>
      <div class="sitewide-count"><span class="sitewide-placeholder" aria-label="Loading visit count">—</span></div>`;
    sidebar.append(block);
    // Keep test previews and local file sessions from inflating the public counter.
    if (!/^(?:www\.)?dipendranathmahato\.com$|^dipendranathmahato\.github\.io$/i.test(location.hostname)) return;
    const slot = block.querySelector(".sitewide-count");
    const widget = document.createElement("div");
    widget.className = "counterapi";
    widget.setAttribute("key", "all-pages");
    widget.setAttribute("noIcon", "true");
    widget.setAttribute("noLink", "true");
    widget.setAttribute("noCss", "true");
    widget.setAttribute("noAnim", "true");
    // Read-only after a visit has already been recorded in this browser session.
    let recorded = false;
    try { recorded = sessionStorage.getItem("dm-sitewide-visit-v1") === "1"; } catch (_) {}
    if (recorded) widget.setAttribute("readOnly", "true");
    slot.append(widget);
    const loader = document.createElement("script");
    loader.async = true;
    loader.src = "https://counterapi.com/c.js?ns=dipendranathmahato.com";
    loader.onload = () => {
      // Don't claim success until the widget itself has actually rendered.
      const observer = new MutationObserver(() => {
        if (widget.textContent.trim() || widget.querySelector('svg,img,span')) {
          slot.classList.add("has-widget");
          if (!recorded) {
            try { sessionStorage.setItem("dm-sitewide-visit-v1", "1"); } catch (_) {}
          }
          observer.disconnect();
        }
      });
      observer.observe(widget, { childList: true, subtree: true, characterData: true });
      if (widget.textContent.trim()) {
        slot.classList.add("has-widget");
        observer.disconnect();
      }
    };
    // When unavailable, retain an unobtrusive dash rather than inventing a total.
    loader.onerror = () => { widget.remove(); };
    document.head.append(loader);
  }
  addSiteVisitsCounter();

  // One shared responsive layer applies to homepage, teaching, research and
  // all course pages, including those that load a different base stylesheet.
  if (!document.querySelector('link[data-adaptive-site]')) {
    const adaptive = document.createElement('link');
    adaptive.rel = 'stylesheet';
    adaptive.dataset.adaptiveSite = 'true';
    adaptive.href = new URL('assets/css/adaptive-layout.css?v=20261023a', siteRoot).href;
    document.head.append(adaptive);
  }

  const current = new URL(location.href);
  const isCourse = current.pathname.includes("/courses/");
  const page = isCourse ? "teaching.html" : (current.pathname.split("/").pop() || "index.html");
  document.querySelectorAll("header.top-nav nav a, header.top-nav .cv-button").forEach(link => {
    if (new URL(link.href).pathname.split("/").pop() === page) {
      link.classList.add("active"); link.setAttribute("aria-current", "page");
    }
  });
})();
