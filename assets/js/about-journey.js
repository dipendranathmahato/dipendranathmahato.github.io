/* About page — India/US interactive journey embedded in the hero. */
(() => {
  "use strict";
  const element = document.getElementById("academicJourneyMap");
  if (!element) return;
  const stops = {
    kolkata: { name:"Kolkata", region:"West Bengal, India", years:"Through 2018", institution:"Dinabandhu Andrews College", affiliation:"University of Calcutta", coords:[22.5726,88.3639] },
    tezpur: { name:"Tezpur", region:"Assam, India", years:"2018–2021", institution:"Tezpur University", coords:[26.6338,92.8000] },
    "new-orleans": { name:"New Orleans", region:"Louisiana, USA", years:"2021–2026", institution:"Tulane University", coords:[29.9511,-90.0715] },
    edinburg: { name:"Edinburg", region:"Texas, USA (not Edinburgh, Scotland)", years:"2026–present", institution:"University of Texas Rio Grande Valley", coords:[26.3017,-98.1633] }
  };
  const stopButtons = [...document.querySelectorAll("[data-journey-stop]")];
  const viewButtons = [...document.querySelectorAll("[data-journey-view]")];
  const noMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let map = null;
  const markers = {};
  function updateSelectedStop(id) {
    stopButtons.forEach(btn => btn.setAttribute("aria-pressed",String(btn.dataset.journeyStop===id)));
  }
  function updateSelectedView(view) {
    viewButtons.forEach(btn => {
      const chosen=btn.dataset.journeyView===view;
      btn.classList.toggle("is-active",chosen);
      btn.setAttribute("aria-pressed",String(chosen));
    });
  }
  function selectStop(id) {
    if (!stops[id]) return;
    updateSelectedStop(id);
    updateSelectedView(null);
    if (!map || !markers[id]) return;
    map.flyTo(stops[id].coords, 9, {animate:!noMotion,duration:1.0});
    markers[id].openPopup();
  }
  function selectView(view) {
    updateSelectedStop(null);
    updateSelectedView(view);
    if (!map) return;
    const pts = view==="india" ? [stops.kolkata.coords,stops.tezpur.coords] : view==="usa" ? [stops["new-orleans"].coords,stops.edinburg.coords] : Object.values(stops).map(s=>s.coords);
    map.closePopup();
    map.fitBounds(window.L.latLngBounds(pts),{padding:[40,40],maxZoom:view==="all"?3:7,animate:false});
  }
  stopButtons.forEach(btn => btn.addEventListener("click",() => selectStop(btn.dataset.journeyStop)));
  viewButtons.forEach(btn => btn.addEventListener("click",() => selectView(btn.dataset.journeyView)));
  if (!window.L) {
    const loading=element.querySelector(".journey-map-loading");
    if (loading) loading.textContent="Map tiles are unavailable. The interactive university cards below still show the institutions, cities, countries, and dates.";
    return;
  }
  map=window.L.map(element,{zoomControl:true,scrollWheelZoom:false,worldCopyJump:true,minZoom:2,maxZoom:15});
  // Free OpenStreetMap basemap: dark appearance is applied by CSS to tile pane only.
  // Avoid map styles that require a provider API key.
  window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
    attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors',
    maxZoom:19
  }).addTo(map);
  const coords=Object.values(stops).map(s=>s.coords);
  window.L.polyline(coords,{color:"#1eac83",weight:3,opacity:.82,dashArray:"8 7",interactive:false}).addTo(map);
  Object.entries(stops).forEach(([id,stop]) => {
    const popup=`<div class="journey-popup-university">${stop.institution}</div>`+
      (stop.affiliation?`<div class="journey-popup-region">${stop.affiliation}</div>`:"")+
      `<div class="journey-popup-region">${stop.name}, ${stop.region}</div>`+
      `<div class="journey-popup-date">${stop.years}</div>`;
    const marker=window.L.marker(stop.coords,{title:stop.institution+", "+stop.region,alt:stop.name+", "+stop.region}).addTo(map).bindPopup(popup);
    marker.on("click",() => {updateSelectedStop(id);updateSelectedView(null);});
    markers[id]=marker;
  });
  selectView("all");
  window.requestAnimationFrame(() => map.invalidateSize());
  window.addEventListener("resize",() => map.invalidateSize(),{passive:true});
})();
