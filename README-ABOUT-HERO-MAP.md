# About page — interactive academic map in the hero

## What changed

- Replaced the old four-column journey timeline/route text in the **About page hero** with the existing interactive Leaflet/OpenStreetMap map.
- Removed the duplicate standalone map card below the hero. There is now **one map**, inside the hero.
- Made the **universities** prominent on four selectable cards; the city and years are secondary details.
- Added **University of Calcutta** beside **Dinabandhu Andrews College** in its university card and the map popup.
- Preserved the four stages: Kolkata (through 2018), Tezpur (2018–2021), New Orleans (2021–2026), and Edinburg, Texas (2026–present).
- Retained the original About biography and academic-family section, including Aniketh Sivakumar.
- Added a dark map treatment matching the site theme. The existing OpenStreetMap tiles are darkened with a CSS filter **only on the tile pane**; pins, popup cards and map controls remain readable. No new map provider/API key is required.
- Kept the map controls for **Entire journey**, **India**, **United States**, and individual university cards.

## Install the PATCH

From the extracted ZIP, copy these files into the root of your GitHub Pages repository, replacing only matching files:

```
about.html
assets/css/about-journey.css
assets/js/about-journey.js
```

Commit/push to the branch used by GitHub Pages. Reload the About page with Ctrl+Shift+R after deployment. The CSS and JS are versioned `?v=20261025` in `about.html` to help avoid stale caches.

## Confirm

1. Visit `/about.html` and confirm the map is **inside** the hero, not in a separate card below.
2. Select **Tezpur University**; the map should zoom to Tezpur and show a popup.
3. Select **Entire journey** to zoom back out. Switch between India and United States.
4. Use the site's **Dark** toggle: the geographic map should become dark while pins, controls, city names, and university cards stay readable.
5. Resize the page: four university cards become two and then one column on smaller screens.

Leaflet and OpenStreetMap tiles need network access in the visitor's browser. If the remote scripts/tiles are blocked, the university cards still provide readable institutions, locations, and dates. Attribution is shown inside the map as required.

## Files and isolation

Only the About page and its dedicated CSS/JavaScript changed. The global template, sidebar, home page, other pages, interactive course notes, counters, and academic family data have not been touched.

## Validation

Checked HTML structure (one map, one hero, four university cards, no duplicate standalone map), existing academic-family markup, and JavaScript syntax. A Chromium runtime policy prevented local browser rendering, so the deployed map tiles/dark-mode appearance still need a visual check after uploading.
