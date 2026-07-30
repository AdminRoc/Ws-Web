/**
 * map.js — Warframe Interactive Map Engine v2
 * Leaflet + Static PNG overlay + Wiki icons + Chinese labels + GSAP
 */
(function () {
  'use strict';

  // ════════════════════════════════════════════════════════════
  //  CONFIG
  // ════════════════════════════════════════════════════════════

  const MAP_SIZE = 4000;
  const MAP_EXTENT = 0.04;
  const ICON_BASE = '/map/assets/icons/';

  const MAPS = {
    'duviri': {
      name: '双衍王境',
      image: '/map/assets/duviri-map.png',
      bounds: [[0, 0], [MAP_SIZE, MAP_SIZE]],
      anchor: 'bottom',
      zoom: 2,
      maxZoom: 5,
      wiki: 'https://wiki.warframe.com/w/Duviri/Map'
    },
    'plains-of-eidolon': {
      name: '夜灵平野',
      image: '/map/assets/plains-of-eidolon-map.png',
      bounds: [[0, 0], [MAP_SIZE, MAP_SIZE]],
      anchor: 'bottom',
      zoom: 2,
      maxZoom: 5,
      wiki: 'https://wiki.warframe.com/w/Plains_of_Eidolon/Map'
    },
    'orb-vallis': {
      name: '奥布山谷',
      image: '/map/assets/orb-vallis-map.png',
      bounds: [[0, 0], [MAP_SIZE, MAP_SIZE]],
      anchor: 'center',
      zoom: 2,
      maxZoom: 5,
      wiki: 'https://wiki.warframe.com/w/Orb_Vallis/Map'
    },
    'cambion-drift': {
      name: '魔胎之境',
      image: '/map/assets/cambion-drift-map.png',
      bounds: [[0, 0], [MAP_SIZE, MAP_SIZE]],
      anchor: 'bottom',
      zoom: 2,
      maxZoom: 5,
      wiki: 'https://wiki.warframe.com/w/Cambion_Drift/Map'
    }
  };

  // ════════════════════════════════════════════════════════════
  //  STATE
  // ════════════════════════════════════════════════════════════

  let currentMap = 'duviri';
  let map = null;
  let imageOverlay = null;
  let markers = [];
  let mapData = {};
  let categoryState = {};
  let favorites = {};
  let showFavOnly = false;
  let searchQuery = '';

  // ════════════════════════════════════════════════════════════
  //  CYCLE CALCULATIONS
  // ════════════════════════════════════════════════════════════

  const CYCLE_CONFIG = {
    eidolon: { epoch: 1548924027, full: 8998.8748, day: 2999.6249 },
    vallis: { epoch: new Date('2026-02-04T19:46:48Z').getTime() / 1000, full: 1600, warm: 400 },
    duviri: { full: 36000, phase: 7200, emotions: ['sorrow', 'fear', 'joy', 'anger', 'envy'] }
  };

  const STATE_NAMES = {
    day: { zh: '白昼', en: 'Day', icon: '☀️', color: '#ffd700' },
    night: { zh: '夜晚', en: 'Night', icon: '🌙', color: '#4a6fa5' },
    warm: { zh: '温暖', en: 'Warm', icon: '🌡️', color: '#ff6b4a' },
    cold: { zh: '寒冷', en: 'Cold', icon: '❄️', color: '#4ac1ff' },
    fass: { zh: 'Fass', en: 'Fass', icon: '🔴', color: '#ff4a4a' },
    vome: { zh: 'Vome', en: 'Vome', icon: '🔵', color: '#4a8fff' },
    sorrow: { zh: '悲伤', en: 'Sorrow', icon: '💧', color: '#6a4aff' },
    fear: { zh: '恐惧', en: 'Fear', icon: '👁️', color: '#4a4a4a' },
    joy: { zh: '喜悦', en: 'Joy', icon: '✨', color: '#ffdd4a' },
    anger: { zh: '愤怒', en: 'Anger', icon: '🔥', color: '#ff4a4a' },
    envy: { zh: '嫉妒', en: 'Envy', icon: '💀', color: '#4aff4a' }
  };

  function calcCycles() {
    const now = Date.now() / 1000;
    const eidElapsed = (now - CYCLE_CONFIG.eidolon.epoch) % CYCLE_CONFIG.eidolon.full;
    const eidNight = CYCLE_CONFIG.eidolon.full - CYCLE_CONFIG.eidolon.day;
    const eidIsDay = eidElapsed < eidNight;
    const eidRemaining = eidIsDay
      ? CYCLE_CONFIG.eidolon.day - eidElapsed
      : CYCLE_CONFIG.eidolon.full - eidElapsed;

    const valElapsed = (now - CYCLE_CONFIG.vallis.epoch) % CYCLE_CONFIG.vallis.full;
    const valCold = CYCLE_CONFIG.vallis.full - CYCLE_CONFIG.vallis.warm;
    const valIsWarm = valElapsed > valCold;
    const valRemaining = valIsWarm
      ? CYCLE_CONFIG.vallis.full - valElapsed
      : valCold - valElapsed;

    const duvElapsed = (Math.floor(now) - 52) % CYCLE_CONFIG.duviri.full;
    const duvIdx = Math.floor(duvElapsed / CYCLE_CONFIG.duviri.phase);
    const duvRemaining = CYCLE_CONFIG.duviri.phase - (duvElapsed % CYCLE_CONFIG.duviri.phase);
    const duvState = CYCLE_CONFIG.duviri.emotions[duvIdx];

    const camState = eidIsDay ? 'fass' : 'vome';

    return {
      'plains-of-eidolon': { state: eidIsDay ? 'day' : 'night', remaining: eidRemaining },
      'orb-vallis': { state: valIsWarm ? 'warm' : 'cold', remaining: valRemaining },
      'duviri': { state: duvState, remaining: duvRemaining },
      'cambion-drift': { state: camState, remaining: eidRemaining }
    };
  }

  function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) return `${h}h ${String(m).padStart(2, '0')}m`;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  function updateCycleDisplay() {
    const cycles = calcCycles();
    const current = cycles[currentMap];
    if (!current) return;

    const nameEl = document.getElementById('cycleName');
    const timerEl = document.getElementById('cycleTimer');
    const iconEl = document.getElementById('cycleIcon');

    const stateInfo = STATE_NAMES[current.state];
    nameEl.textContent = stateInfo ? stateInfo.zh : current.state;
    timerEl.textContent = formatTime(current.remaining);

    const color = stateInfo ? stateInfo.color : 'var(--c-cyan)';
    iconEl.style.background = color;
    iconEl.style.boxShadow = `0 0 12px ${color}, 0 0 24px ${color}40`;

    // Update nav tab states
    Object.entries(cycles).forEach(([mapId, data]) => {
      const stateEl = document.getElementById('state' + mapId.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(''));
      if (stateEl) {
        const sn = STATE_NAMES[data.state];
        stateEl.textContent = sn ? sn.zh : data.state;
      }
    });
  }

  // ════════════════════════════════════════════════════════════
  //  TRANSLATIONS
  // ════════════════════════════════════════════════════════════

  function getCategoryName(catId) {
    return CATEGORY_NAMES[catId] || catId;
  }

  function getIconPath(catId) {
    const rel = ICON_MAP[catId] || 'shared/blinkpad.png';
    return ICON_BASE + rel;
  }

  function getGroupName(groupId) {
    const t = MAP_TRANSLATIONS.zh.groups;
    return t[groupId] || groupId;
  }

  // ════════════════════════════════════════════════════════════
  //  DATA LOADING
  // ════════════════════════════════════════════════════════════

  async function loadMapData(mapId) {
    if (mapData[mapId]) return mapData[mapId];
    const url = `/map/data/${mapId}.json`;
    try {
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      mapData[mapId] = data;
      return data;
    } catch (e) {
      console.error(`Failed to load ${url}:`, e);
      return null;
    }
  }

  // ════════════════════════════════════════════════════════════
  //  MAP INITIALIZATION
  // ════════════════════════════════════════════════════════════

  function initMap() {
    const cfg = MAPS[currentMap];
    map = L.map('map', {
      crs: L.CRS.Simple,
      minZoom: -2,
      maxZoom: cfg.maxZoom - 2,
      zoomSnap: 0.25,
      zoomDelta: 0.5,
      attributionControl: false,
      keyboard: true
    });
    map.fitBounds(cfg.bounds);

    imageOverlay = L.imageOverlay(cfg.image, cfg.bounds, {
      opacity: 1,
      interactive: true
    }).addTo(map);

    map.on('mousemove', (e) => {
      const coords = document.getElementById('overlayCoords');
      if (coords) {
        coords.textContent = `${Math.round(e.latlng.lng)}, ${Math.round(e.latlng.lat)}`;
      }
    });
  }

  function destroyMap() {
    if (map) {
      map.remove();
      map = null;
      imageOverlay = null;
      markers = [];
    }
  }

  // ════════════════════════════════════════════════════════════
  //  MARKERS — Wiki Icons + Chinese Labels
  // ════════════════════════════════════════════════════════════

  function getMarkerColor(categoryId, categories) {
    const cat = categories.find(c => c.id === categoryId);
    return cat ? cat.color : '#00d4ff';
  }

  function createMarkerIcon(categoryId, categories) {
    const color = getMarkerColor(categoryId, categories);
    const iconPath = getIconPath(categoryId);
    const catName = getCategoryName(categoryId);

    return L.divIcon({
      className: 'wiki-marker',
      html: `
        <div class="wiki-marker-pin" style="--marker-color: ${color}">
          <div class="wiki-marker-glow"></div>
          <img class="wiki-marker-icon" src="${iconPath}" alt="${catName}" loading="lazy">
        </div>
        <span class="wiki-marker-label">${catName}</span>
      `,
      iconSize: [32, 44],
      iconAnchor: [16, 44],
      popupAnchor: [0, -44]
    });
  }

  function addMarkers(data) {
    if (!data || !data.markers || !data.categories) return;

    const newMarkers = [];
    data.markers.forEach(m => {
      if (!categoryState[m.categoryId]) return;
      if (showFavOnly && !isFavorite(m.id)) return;
      if (searchQuery && !m.popup.title.toLowerCase().includes(searchQuery)) return;

      const icon = createMarkerIcon(m.categoryId, data.categories);
      const lat = m.position[1];
      const lng = m.position[0];

      const marker = L.marker([lat, lng], { icon })
        .addTo(map)
        .bindPopup(() => {
          const cat = data.categories.find(c => c.id === m.categoryId);
          const catName = cat ? getCategoryName(cat.id) : m.categoryId;
          const isFav = isFavorite(m.id);
          const desc = m.popup.description || '';
          return `<div class="popup-card">
            <div class="popup-header">
              <img class="popup-icon" src="${getIconPath(m.categoryId)}" alt="">
              <div>
                <div class="popup-title">${m.popup.title}</div>
                <div class="popup-category">${catName}</div>
              </div>
            </div>
            ${desc ? `<div class="popup-desc">${desc}</div>` : ''}
            <div class="popup-actions">
              <button class="popup-btn ${isFav ? 'fav-active' : ''}" onclick="window._toggleFav('${m.id}')">
                ${isFav ? '★ 已收藏' : '☆ 收藏'}
              </button>
              ${m.popup.link && m.popup.link.url ? `<a class="popup-btn popup-link" href="${m.popup.link.url}" target="_blank">${m.popup.link.label || 'Wiki'}</a>` : ''}
            </div>
          </div>`;
        }, { maxWidth: 280 });

      marker._markerId = m.id;
      marker._categoryId = m.categoryId;
      newMarkers.push(marker);
    });

    markers = newMarkers;
    updateStats();

    // GSAP stagger animation for new markers
    if (typeof gsap !== 'undefined' && markers.length > 0) {
      const markerEls = markers.map(m => m.getElement()).filter(Boolean);
      gsap.from(markerEls, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        stagger: { amount: Math.min(markerEls.length * 0.01, 0.8), from: 'center' },
        ease: 'back.out(1.7)'
      });
    }
  }

  function clearMarkers() {
    markers.forEach(m => map.removeLayer(m));
    markers = [];
  }

  function refreshMarkers() {
    clearMarkers();
    const data = mapData[currentMap];
    if (data) addMarkers(data);
  }

  // ════════════════════════════════════════════════════════════
  //  SIDEBAR
  // ════════════════════════════════════════════════════════════

  function renderSidebar(data) {
    const container = document.getElementById('sidebarGroups');
    if (!data || !data.categories) {
      container.innerHTML = '<div style="padding:16px;color:var(--c-text3);font-size:12px">加载中...</div>';
      return;
    }

    const groups = MAP_GROUPS[currentMap] || [];
    let html = '';

    groups.forEach(group => {
      const cats = group.categories
        .map(id => data.categories.find(c => c.id === id))
        .filter(Boolean);

      const totalItems = cats.reduce((sum, c) => {
        return sum + data.markers.filter(m => m.categoryId === c.id).length;
      }, 0);

      const checkedCount = cats.reduce((sum, c) => {
        if (!categoryState[c.id]) return sum;
        return sum + data.markers.filter(m => m.categoryId === c.id).length;
      }, 0);

      const allOn = cats.every(c => categoryState[c.id]);
      const allOff = cats.every(c => !categoryState[c.id]);
      const groupName = getGroupName(group.id);

      html += `<div class="cat-group ${allOn ? 'all-on' : ''} ${allOff ? 'all-off' : ''}" data-group="${group.id}">
        <div class="cat-group-header" onclick="window._toggleGroup(this)">
          <div class="cat-group-toggle">✓</div>
          <div class="cat-group-name">${groupName}</div>
          <div class="cat-group-count">${checkedCount}/${totalItems}</div>
          <div class="cat-group-arrow">▼</div>
        </div>
        <div class="cat-group-items">`;

      cats.forEach(cat => {
        const count = data.markers.filter(m => m.categoryId === cat.id).length;
        const checked = categoryState[cat.id];
        const iconPath = getIconPath(cat.id);
        html += `<div class="cat-item" data-cat="${cat.id}">
          <img class="cat-item-icon" src="${iconPath}" alt="" loading="lazy">
          <input type="checkbox" class="cat-item-check" ${checked ? 'checked' : ''} onchange="window._toggleCategory('${cat.id}', this.checked)">
          <div class="cat-item-name">${getCategoryName(cat.id)}</div>
          <div class="cat-item-count">${count}</div>
        </div>`;
      });

      html += '</div></div>';
    });

    container.innerHTML = html;
  }

  function updateStats() {
    const data = mapData[currentMap];
    if (!data) return;
    document.getElementById('statTotal').textContent = data.markers.length;
    document.getElementById('statVisible').textContent = markers.length;
  }

  // ════════════════════════════════════════════════════════════
  //  FAVORITES
  // ════════════════════════════════════════════════════════════

  function loadFavorites() {
    try {
      favorites = JSON.parse(localStorage.getItem('wfspeed-map-favorites') || '{}');
    } catch (e) { favorites = {}; }
  }

  function saveFavorites() {
    localStorage.setItem('wfspeed-map-favorites', JSON.stringify(favorites));
  }

  function isFavorite(id) {
    return favorites[currentMap] && favorites[currentMap].includes(id);
  }

  window._toggleFav = function (id) {
    if (!favorites[currentMap]) favorites[currentMap] = [];
    const idx = favorites[currentMap].indexOf(id);
    if (idx >= 0) favorites[currentMap].splice(idx, 1);
    else favorites[currentMap].push(id);
    saveFavorites();
    refreshMarkers();
    const marker = markers.find(m => m._markerId === id);
    if (marker) marker.openPopup();
  };

  // ════════════════════════════════════════════════════════════
  //  CATEGORY TOGGLES
  // ════════════════════════════════════════════════════════════

  window._toggleCategory = function (catId, checked) {
    categoryState[catId] = checked;
    refreshMarkers();
    updateSidebarCounts();
  };

  window._toggleGroup = function (header) {
    const group = header.parentElement;
    group.classList.toggle('collapsed');
  };

  function updateSidebarCounts() {
    const data = mapData[currentMap];
    if (!data) return;

    document.querySelectorAll('.cat-group').forEach(groupEl => {
      const groupId = groupEl.dataset.group;
      const group = MAP_GROUPS[currentMap].find(g => g.id === groupId);
      if (!group) return;

      let checkedCount = 0;
      let totalCount = 0;
      group.categories.forEach(id => {
        const cat = data.categories.find(c => c.id === id);
        if (!cat) return;
        const count = data.markers.filter(m => m.categoryId === id).length;
        totalCount += count;
        if (categoryState[id]) checkedCount += count;
      });

      const countEl = groupEl.querySelector('.cat-group-count');
      if (countEl) countEl.textContent = `${checkedCount}/${totalCount}`;
      groupEl.classList.toggle('all-on', checkedCount === totalCount && totalCount > 0);
      groupEl.classList.toggle('all-off', checkedCount === 0);
    });

    updateStats();
  }

  // ════════════════════════════════════════════════════════════
  //  SEARCH
  // ════════════════════════════════════════════════════════════

  function initSearch() {
    const input = document.getElementById('searchInput');
    let debounce = null;
    input.addEventListener('input', () => {
      clearTimeout(debounce);
      debounce = setTimeout(() => {
        searchQuery = input.value.toLowerCase().trim();
        refreshMarkers();
      }, 200);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement !== input) {
        e.preventDefault();
        input.focus();
      }
      if (e.key === 'Escape') {
        input.blur();
        input.value = '';
        searchQuery = '';
        refreshMarkers();
      }
    });
  }

  // ════════════════════════════════════════════════════════════
  //  MAP SWITCHING
  // ════════════════════════════════════════════════════════════

  async function switchMap(mapId) {
    if (mapId === currentMap && map) return;
    currentMap = mapId;

    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`[data-map="${mapId}"]`)?.classList.add('active');

    // GSAP transition
    if (typeof gsap !== 'undefined' && map) {
      await new Promise(resolve => {
        gsap.to('#map', {
          opacity: 0,
          scale: 0.98,
          duration: 0.25,
          ease: 'power2.in',
          onComplete: resolve
        });
      });
    }

    initCategoryState();
    destroyMap();
    const data = await loadMapData(mapId);
    if (!data) return;
    initMap();
    renderSidebar(data);
    addMarkers(data);
    updateCycleDisplay();

    if (typeof gsap !== 'undefined') {
      gsap.fromTo('#map',
        { opacity: 0, scale: 1.02 },
        { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' }
      );
      // Stagger sidebar items
      const items = document.querySelectorAll('.cat-group');
      gsap.from(items, {
        x: -20,
        opacity: 0,
        duration: 0.3,
        stagger: 0.05,
        ease: 'power2.out'
      });
    }
  }

  function initCategoryState() {
    const data = mapData[currentMap];
    if (!data) return;
    categoryState = {};
    data.categories.forEach(cat => { categoryState[cat.id] = true; });
  }

  // ════════════════════════════════════════════════════════════
  //  EVENT BINDINGS
  // ════════════════════════════════════════════════════════════

  function bindEvents() {
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.addEventListener('click', () => switchMap(tab.dataset.map));
    });

    document.getElementById('selectAll').addEventListener('click', () => {
      Object.keys(categoryState).forEach(k => categoryState[k] = true);
      document.querySelectorAll('.cat-item-check').forEach(cb => cb.checked = true);
      refreshMarkers();
      updateSidebarCounts();
    });

    document.getElementById('clearAll').addEventListener('click', () => {
      Object.keys(categoryState).forEach(k => categoryState[k] = false);
      document.querySelectorAll('.cat-item-check').forEach(cb => cb.checked = false);
      refreshMarkers();
      updateSidebarCounts();
    });

    document.getElementById('favToggle').addEventListener('click', function () {
      showFavOnly = !showFavOnly;
      this.classList.toggle('active', showFavOnly);
      refreshMarkers();
    });
  }

  // ════════════════════════════════════════════════════════════
  //  GSAP ANIMATIONS
  // ════════════════════════════════════════════════════════════

  function initAnimations() {
    if (typeof gsap === 'undefined') return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Page load sequence
    tl.from('.map-topbar', { y: -80, opacity: 0, duration: 0.7 })
      .from('.map-nav', { x: -80, opacity: 0, duration: 0.7 }, '-=0.5')
      .from('.map-sidebar', { x: -320, opacity: 0, duration: 0.7 }, '-=0.5')
      .from('.map-container', { opacity: 0, scale: 0.95, duration: 0.6 }, '-=0.4');

    // Cycle indicator pulse
    gsap.to('#cycleIcon', {
      scale: 1.2,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    // Nav tab hover effects
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.addEventListener('mouseenter', () => {
        gsap.to(tab.querySelector('.nav-tab-icon'), { scale: 1.2, duration: 0.2 });
      });
      tab.addEventListener('mouseleave', () => {
        gsap.to(tab.querySelector('.nav-tab-icon'), { scale: 1, duration: 0.2 });
      });
    });
  }

  // ════════════════════════════════════════════════════════════
  //  INIT
  // ════════════════════════════════════════════════════════════

  async function init() {
    loadFavorites();
    initSearch();
    bindEvents();
    updateCycleDisplay();
    setInterval(updateCycleDisplay, 1000);
    await switchMap('duviri');
    initAnimations();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
