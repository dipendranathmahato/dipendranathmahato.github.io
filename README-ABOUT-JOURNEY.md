# About page, academic journey map, and shared visit counter (October 2026)

## Installation

Extract `ABOUT-JOURNEY-COUNTER-PATCH.zip` into the **root** of the existing GitHub Pages repository, preserving folders and replacing matching files. Commit the changed files to `main`, then allow GitHub Pages to deploy. You do not need to upload the 150 MB repository again.

Changed files:

- `about.html` — corrected About title, 4-stop journey, map, full-width hero paragraph, education and biography dates, Aniketh's linked academic-family card.
- `assets/css/about-journey.css` — scoped About-page layout, mobile/dark-mode adjustments.
- `assets/js/about-journey.js` — map navigation, zoom-to-city, fit-journey controls.
- `assets/js/site-template.js` — changes site-wide counter from a failing handcrafted SVG URL to CounterAPI's documented JavaScript widget.
- `assets/css/adaptive-layout.css` — styles the new site-wide counter widget.

## Verify

1. Visit `https://www.dipendranathmahato.com/about.html` after publishing and do a hard refresh (Ctrl+Shift+R).
2. Confirm the hero paragraph uses the full card width and timeline ends at **Edinburg, Texas, 2026–present**.
3. Click the city cards; the map should zoom to India or the U.S. region, and show all 4 cities via *Entire journey*. Scroll-wheel zoom is disabled to avoid trapping normal page scrolling; use the +/- map buttons or touch pinch.
4. Confirm Aniketh Sivakumar is clickable in Academic Family.
5. On any site page, check **All-time site visits** in the left sidebar.

## Dependencies and realistic limits

The map uses Leaflet 1.9.4 from `unpkg.com` and OpenStreetMap tiles. The city/date cards remain accessible if the map library or map tiles are blocked. Map tiles and the counter both need internet access.

The counter now uses `https://counterapi.com/c.js?ns=dipendranathmahato.com`, which is the provider's documented embed approach, with the existing `all-pages` counter key and the previous browser-session flag. It may still show a dash if the external service is unreachable, ad-blocked, or disabled by browser policies. GitHub Pages cannot record a reliable shared all-time count by itself: if this provider fails repeatedly, a dedicated analytics backend (for example Cloudflare Web Analytics + a server-side count endpoint) is needed. We cannot truthfully reconstruct past visits or claim a verified live total without access to that backend.

Aniketh's card links to `https://an8keth.github.io/index.html`; no unverified portrait was added. The About hero's Ph.D. wording is unchanged, as the request concerned its width, but other career timeline copy reflects the 2026 transition.

The update has been checked for HTML structure and JS syntax. External services could not be tested from the current container, and automatic browser navigation is blocked in this environment; test the embedded map and widget after deployment.
