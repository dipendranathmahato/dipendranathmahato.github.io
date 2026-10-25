/* About page: interactive India–US academic journey map. */
(() => {
  "use strict";
  const element = document.getElementById("academicJourneyMap");
  if (!element) return;
  const stops = {
    kolkata: { name: "Kolkata", region: "West Bengal, India", years: "through 2018", institution: "Dinabandhu Andrews College", coords: [22.5726, 88.3639] },
    tezpur: { name: "Tezpur", region: "Assam, India", years: "2018–2021", institution: "Tezpur University", coords: [26.6338, 92.8000] },
    "new-orleans": { name: "New Orleans", region: "Louisiana, United States", years: "2021–2026", institution: "Tulane University", coords: [29.9511, -90.0715] },
    edinburg: { name: "Edinburg", region: "Texas, United States (NOT Edinburgh, Scotland)", years: "2026–present", institution: "University of Texas Rio Grande Valley", coords: [26.3017, -98.1633] }
  };
  const buttons = [...document.querySelectorAll("[data-journey-stop]")];
  const viewButtons = [...document.querySelectorAll("[data-journey-view]")];
  let map = null, markers = {};
  function selectStop(id) {
    buttons.forEach(btn => btn.setAttribute("aria-pressed", String(btn.dataset.journeyStop === id)));
    if (map && markers[id]) {
      const zoom = id === "kolkata" || id === "tezpur" ? 10 : 10;
      map.flyTo(stops[id].coords, zoom, { animate: !window.matchMedia("(prefers-reduced-motion: reduce)").matches, duration: 1.1 });
      markers[id].openPopup();
    }
    viewButtons.forEach(btn => { btn.classList.remove("is-active"); btn.setAttribute("aria-pressed", "false"); });
  }
  function selectView(view) {
    buttons.forEach(btn => btn.setAttribute("aria-pressed", "false"));
    viewButtons.forEach(btn => { const selected = btn.dataset.journeyView === view; btn.classList.toggle("is-active", selected); btn.setAttribute("aria-pressed", String(selected)); });
    if (!map) return;
    const points = view === "india" ? [stops.kolkata.coords, stops.tezpur.coords] : view === "usa" ? [stops["new-orleans"].coords, stops.edinburg.coords] : Object.values(stops).map(s => s.coords);
    map.fitBounds(window.L.latLngBounds(points), { padding: [38,38], maxZoom: view === "all" ? 3 : 7, animate: false });
    map.closePopup();
  }
  buttons.forEach(btn => btn.addEventListener("click", () => selectStop(btn.dataset.journeyStop)));
  viewButtons.forEach(btn => btn.addEventListener("click", () => selectView(btn.dataset.journeyView)));
  if (!window.L) {
    element.querySelector(".journey-map-loading").textContent = "The map cannot load right now. You can still explore the four locations below; they include countries, dates and universities.";
    return;
  }
  map = window.L.map(element, { zoomControl: true, scrollWheelZoom: false, worldCopyJump: true, minZoom: 2, maxZoom: 15 });
  window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors',
    maxZoom: 18
  }).addTo(map);
  const line = Object.values(stops).map(p => p.coords);
  window.L.polyline(line, { color: "#13795b", weight: 3, opacity: .78, dashArray: "7 7", interactive: false }).addTo(map);
  Object.entries(stops).forEach(([id, stop], i) => {
    const html = `<strong>${stop.name}</strong><br>${stop.region}<br><b>${stop.years}</b><br>${stop.institution}`;
    const marker = window.L.marker(stop.coords, { title: stop.name + ", " + stop.region, alt: stop.name + ", " + stop.region }).addTo(map).bindPopup(html);
    marker.on("click", () => { buttons.forEach(b => b.setAttribute("aria-pressed", String(b.dataset.journeyStop === id))); });
    markers[id] = marker;
  });
  selectView("all");
  window.addEventListener("resize", () => map.invalidateSize(), { passive: true });
})();
