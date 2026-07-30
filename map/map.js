/**
 * map.js — Warframe Interactive Map Engine v3
 * Leaflet + Static PNG + Wiki icons + Chinese labels + GSAP + Neon Gradient + Zoom Scaling + State Persistence
 */
(function () {
  'use strict';

  // ════════════════════════════════════════════════════════════
  //  CONFIG
  // ════════════════════════════════════════════════════════════

  const MAP_SIZE = 4000;
  const ICON_BASE = '/map/assets/icons/';
  const LS_FAV_KEY = 'wfspeed-map-favorites';
  const LS_CAT_KEY = 'wfspeed-map-categories';
  const LS_MAP_KEY = 'wfspeed-map-current';

  const MAPS = {
    'duviri': {
      name: '双衍王境',
      image: '/map/assets/duviri-map.webp',
      bounds: [[0, 0], [MAP_SIZE, MAP_SIZE]],
      anchor: 'bottom',
      zoom: 2,
      maxZoom: 5,
      wiki: 'https://wiki.warframe.com/w/Duviri/Map'
    },
    'plains-of-eidolon': {
      name: '夜灵平野',
      image: '/map/assets/plains-eidolon-map.webp',
      bounds: [[0, 0], [MAP_SIZE, MAP_SIZE]],
      anchor: 'bottom',
      zoom: 2,
      maxZoom: 5,
      wiki: 'https://wiki.warframe.com/w/Plains_of_Eidolon/Map'
    },
    'orb-vallis': {
      name: '奥布山谷',
      image: '/map/assets/orb-vallis-map.webp',
      bounds: [[0, 0], [MAP_SIZE, MAP_SIZE]],
      anchor: 'center',
      zoom: 2,
      maxZoom: 5,
      wiki: 'https://wiki.warframe.com/w/Orb_Vallis/Map'
    },
    'cambion-drift': {
      name: '魔胎之境',
      image: '/map/assets/cambion-drift-map.webp',
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
  let categoryState = {};  // { catId: true/false }
  let favorites = {};      // { mapId: [markerId, ...] }
  let showFavOnly = false;
  let searchQuery = '';
  let currentZoom = 2;

  // ════════════════════════════════════════════════════════════
  //  CYCLE CALCULATIONS
  // ════════════════════════════════════════════════════════════

  const CYCLE_CONFIG = {
    eidolon: { epoch: 1548924027, full: 8998.8748, day: 2999.6249 },
    vallis: { epoch: new Date('2026-02-04T19:46:48Z').getTime() / 1000, full: 1600, warm: 400 },
    duviri: { full: 36000, phase: 7200, emotions: ['sorrow', 'fear', 'joy', 'anger', 'envy'] }
  };

  const STATE_NAMES = {
    day:    { zh: '白昼', icon: '☀️', color: '#ffd700' },
    night:  { zh: '夜晚', icon: '🌙', color: '#6f8bff' },
    warm:   { zh: '温暖', icon: '🌡️', color: '#ff9a4f' },
    cold:   { zh: '寒冷', icon: '❄️', color: '#45c8ff' },
    fass:   { zh: 'Fass',  icon: '🔴', color: '#ff5f9e' },
    vome:   { zh: 'Vome',  icon: '🔵', color: '#45c8ff' },
    sorrow: { zh: '悲伤', icon: '💧', color: '#6f8bff' },
    fear:   { zh: '恐惧', icon: '👁️', color: '#a86bff' },
    joy:    { zh: '喜悦', icon: '✨', color: '#ffd04f' },
    anger:  { zh: '愤怒', icon: '🔥', color: '#ff7a6b' },
    envy:   { zh: '嫉妒', icon: '💀', color: '#41ff8e' }
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

    const color = stateInfo ? stateInfo.color : 'var(--neon-cyan)';
    iconEl.style.background = color;
    iconEl.style.boxShadow = `0 0 12px ${color}, 0 0 24px ${color}40`;

    // Nav tab state labels
    const mapKeys = {
      'plains-of-eidolon': 'statePlainsOfEidolon',
      'orb-vallis': 'stateOrbVallis',
      'duviri': 'stateDuviri',
      'cambion-drift': 'stateCambionDrift'
    };
    Object.entries(cycles).forEach(([mapId, data]) => {
      const elId = mapKeys[mapId];
      const stateEl = document.getElementById(elId);
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
    const mapNames = typeof CATEGORY_NAMES_MAP !== 'undefined' ? CATEGORY_NAMES_MAP[currentMap] : null;
    if (mapNames && mapNames[catId]) return mapNames[catId];
    return catId;
  }

  function getIconPath(catId) {
    const rel = ICON_MAP[catId] || 'shared/blinkpad.png';
    return ICON_BASE + rel;
  }

  function getGroupName(groupId) {
    const t = MAP_TRANSLATIONS.zh.groups;
    return t[groupId] || groupId;
  }

  function getMarkerDescription(markerId, fallback) {
    if (typeof MARKER_DESCRIPTIONS !== 'undefined' && MARKER_DESCRIPTIONS[markerId]) {
      return MARKER_DESCRIPTIONS[markerId];
    }
    return fallback || '';
  }

  // ════════════════════════════════════════════════════════════
  //  LOCAL STORAGE — Favorites + Category State
  // ════════════════════════════════════════════════════════════

  function loadFavorites() {
    try {
      favorites = JSON.parse(localStorage.getItem(LS_FAV_KEY) || '{}');
    } catch (e) { favorites = {}; }
  }

  function saveFavorites() {
    localStorage.setItem(LS_FAV_KEY, JSON.stringify(favorites));
  }

  function isFavorite(id) {
    return favorites[currentMap] && favorites[currentMap].includes(id);
  }

  function loadCategoryState() {
    try {
      const lastMap = localStorage.getItem(LS_MAP_KEY);
      const saved = JSON.parse(localStorage.getItem(LS_CAT_KEY) || '{}');
      if (saved[currentMap] && lastMap === currentMap) {
        categoryState = saved[currentMap];
        return true;
      }
    } catch (e) {}
    return false;
  }

  function saveCategoryState() {
    try {
      const all = JSON.parse(localStorage.getItem(LS_CAT_KEY) || '{}');
      all[currentMap] = categoryState;
      localStorage.setItem(LS_CAT_KEY, JSON.stringify(all));
      localStorage.setItem(LS_MAP_KEY, currentMap);
    } catch (e) {}
  }

  window._toggleFav = function (id) {
    if (!favorites[currentMap]) favorites[currentMap] = [];
    const idx = favorites[currentMap].indexOf(id);
    if (idx >= 0) favorites[currentMap].splice(idx, 1);
    else favorites[currentMap].push(id);
    saveFavorites();
    refreshMarkers();
    renderFavoritesPanel();
    const marker = markers.find(m => m._markerId === id);
    if (marker) marker.openPopup();
  };

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
  //  MARKER SIZE — Zoom-based Scaling
  // ════════════════════════════════════════════════════════════

  function getMarkerSizeClass(zoom) {
    // Leaflet zoom: 0 (most zoomed out) → 3 (most zoomed in)
    if (zoom <= 0) return 'size-xs';
    if (zoom <= 1) return 'size-sm';
    if (zoom <= 2) return 'size-md';
    if (zoom <= 3) return 'size-lg';
    return 'size-xl';
  }

  function getMarkerIconSize(zoom) {
    if (zoom <= 0) return [18, 26];
    if (zoom <= 1) return [24, 34];
    if (zoom <= 2) return [30, 42];
    if (zoom <= 3) return [36, 50];
    return [44, 60];
  }

  function getMarkerAnchor(zoom) {
    const s = getMarkerIconSize(zoom);
    return [s[0] / 2, s[1] - 2];
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

    // Track zoom changes to resize markers
    map.on('zoomend', () => {
      const newZoom = map.getZoom();
      if (Math.abs(newZoom - currentZoom) >= 0.25) {
        currentZoom = newZoom;
        refreshMarkers();
      }
    });
    currentZoom = map.getZoom();
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
  //  MARKERS — Wiki Icons + Chinese Labels + Zoom Scaling
  // ════════════════════════════════════════════════════════════

  function getMarkerColor(categoryId, categories) {
    const cat = categories.find(c => c.id === categoryId);
    return cat ? cat.color : '#45c8ff';
  }

  function createMarkerIcon(categoryId, categories, zoom) {
    const color = getMarkerColor(categoryId, categories);
    const iconPath = getIconPath(categoryId);
    const catName = getCategoryName(categoryId);
    const sizeClass = getMarkerSizeClass(zoom);
    const iconSize = getMarkerIconSize(zoom);
    const anchor = getMarkerAnchor(zoom);

    return L.divIcon({
      className: `wiki-marker ${sizeClass}`,
      html: `
        <div class="wiki-marker-pin" style="--marker-color: ${color}">
          <div class="wiki-marker-glow"></div>
          <img class="wiki-marker-icon" src="${iconPath}" alt="${catName}" loading="lazy">
        </div>
        <span class="wiki-marker-label">${catName}</span>
      `,
      iconSize: iconSize,
      iconAnchor: anchor,
      popupAnchor: [0, -anchor[1]]
    });
  }

  function addMarkers(data) {
    if (!data || !data.markers || !data.categories) return;
    const validCatIds = new Set(data.categories.map(c => c.id));

    const newMarkers = [];
    data.markers.forEach(m => {
      if (!validCatIds.has(m.categoryId)) return;
      if (!categoryState[m.categoryId]) return;
      if (showFavOnly && !isFavorite(m.id)) return;
      if (searchQuery && !m.popup.title.toLowerCase().includes(searchQuery)) return;

      const icon = createMarkerIcon(m.categoryId, data.categories, currentZoom);
      const lat = m.position[1];
      const lng = m.position[0];

      const marker = L.marker([lat, lng], { icon })
        .addTo(map)
        .bindPopup(() => {
          const cat = data.categories.find(c => c.id === m.categoryId);
          const catName = cat ? getCategoryName(cat.id) : m.categoryId;
          const isFav = isFavorite(m.id);
          const desc = getMarkerDescription(m.id, m.popup.description);
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
        duration: 0.25,
        stagger: { amount: Math.min(markerEls.length * 0.008, 0.6), from: 'center' },
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
  //  SIDEBAR — Favorites Panel + Category Groups
  // ════════════════════════════════════════════════════════════

  function renderFavoritesPanel() {
    const container = document.getElementById('favPanelItems');
    if (!container) return;

    const favs = favorites[currentMap] || [];
    const data = mapData[currentMap];
    if (!data) { container.innerHTML = ''; return; }

    if (favs.length === 0) {
      container.innerHTML = '<div class="fav-empty">暂无收藏</div>';
      document.getElementById('favPanelCount').textContent = '0';
      return;
    }

    document.getElementById('favPanelCount').textContent = favs.length;

    let html = '';
    favs.forEach(id => {
      const m = data.markers.find(mk => mk.id === id);
      if (!m) return;
      const catName = getCategoryName(m.categoryId);
      const title = m.popup.title || catName;
      const x = Math.round(m.position[0]);
      const y = Math.round(m.position[1]);
      html += `<div class="fav-item" onclick="window._flyToMarker('${m.id}')">
        <img class="fav-item-icon" src="${getIconPath(m.categoryId)}" alt="" loading="lazy">
        <div class="fav-item-info">
          <div class="fav-item-name">${catName}${title !== catName ? ' · ' + title : ''}</div>
          <div class="fav-item-meta">${x}, ${y}</div>
        </div>
        <div class="fav-item-remove" onclick="event.stopPropagation(); window._toggleFav('${m.id}')">✕</div>
      </div>`;
    });
    container.innerHTML = html;
  }

  window._flyToMarker = function (id) {
    const marker = markers.find(m => m._markerId === id);
    if (marker) {
      map.flyTo(marker.getLatLng(), currentZoom, { duration: 0.5 });
      marker.openPopup();
    }
  };

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
          <div class="cat-group-actions">
            <div class="cat-group-fav-btn" title="收藏此组全部" onclick="event.stopPropagation(); window._favGroup('${group.id}')">★</div>
          </div>
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
  //  CATEGORY TOGGLES — with localStorage persistence
  // ════════════════════════════════════════════════════════════

  window._toggleCategory = function (catId, checked) {
    categoryState[catId] = checked;
    saveCategoryState();
    refreshMarkers();
    updateSidebarCounts();
    renderFavoritesPanel();
  };

  window._toggleGroup = function (header) {
    const group = header.parentElement;
    group.classList.toggle('collapsed');
  };

  // Batch favorite: favorite all markers in a group
  window._favGroup = function (groupId) {
    const data = mapData[currentMap];
    if (!data) return;
    const group = MAP_GROUPS[currentMap].find(g => g.id === groupId);
    if (!group) return;

    if (!favorites[currentMap]) favorites[currentMap] = [];
    const favSet = new Set(favorites[currentMap]);

    let added = 0;
    data.markers.forEach(m => {
      if (group.categories.includes(m.categoryId)) {
        if (!favSet.has(m.id)) {
          favorites[currentMap].push(m.id);
          favSet.add(m.id);
          added++;
        }
      }
    });

    saveFavorites();
    renderFavoritesPanel();
    refreshMarkers();
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

  function showLoading(show) {
    const el = document.getElementById('mapLoading');
    if (el) el.style.display = show ? 'flex' : 'none';
  }

  async function switchMap(mapId) {
    if (mapId === currentMap && map) return;

    saveCategoryState();
    currentMap = mapId;

    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`[data-map="${mapId}"]`)?.classList.add('active');

    showLoading(true);

    if (typeof gsap !== 'undefined' && map) {
      await new Promise(resolve => {
        gsap.to('#map', { opacity: 0, scale: 0.98, duration: 0.2, ease: 'power2.in', onComplete: resolve });
      });
    }

    const hadState = loadCategoryState();
    const data = await loadMapData(mapId);

    if (!data) {
      showLoading(false);
      document.getElementById('map').innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#607898;font-size:14px;">地图数据加载失败</div>';
      renderSidebar(null);
      return;
    }

    if (!hadState) {
      categoryState = {};
      data.categories.forEach(cat => { categoryState[cat.id] = true; });
      saveCategoryState();
    }

    destroyMap();

    const mapEl = document.getElementById('map');
    if (!mapEl) { showLoading(false); return; }
    mapEl.innerHTML = '';
    mapEl.style.opacity = '1';

    renderSidebar(data);
    renderFavoritesPanel();
    updateStats();
    updateCycleDisplay();

    try {
      initMap();
      addMarkers(data);
      showLoading(false);
    } catch (e) {
      console.error('Leaflet init failed:', e);
      showLoading(false);
      mapEl.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#607898;font-size:14px;">地图渲染失败，请刷新重试</div>';
      return;
    }

    if (typeof gsap !== 'undefined') {
      gsap.fromTo('#map', { opacity: 0, scale: 1.02 }, { opacity: 1, scale: 1, duration: 0.35, ease: 'power2.out' });
      const items = document.querySelectorAll('.cat-group');
      gsap.from(items, { x: -20, opacity: 0, duration: 0.25, stagger: 0.04, ease: 'power2.out' });
    }
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
      saveCategoryState();
      refreshMarkers();
      updateSidebarCounts();
    });

    document.getElementById('clearAll').addEventListener('click', () => {
      Object.keys(categoryState).forEach(k => categoryState[k] = false);
      document.querySelectorAll('.cat-item-check').forEach(cb => cb.checked = false);
      saveCategoryState();
      refreshMarkers();
      updateSidebarCounts();
    });

    document.getElementById('favToggle').addEventListener('click', function () {
      showFavOnly = !showFavOnly;
      this.classList.toggle('active', showFavOnly);
      refreshMarkers();
    });

    // Favorites panel toggle
    const favPanel = document.getElementById('favPanel');
    if (favPanel) {
      favPanel.querySelector('.fav-panel-header').addEventListener('click', () => {
        favPanel.classList.toggle('collapsed');
      });
    }
  }

  // ════════════════════════════════════════════════════════════
  //  GSAP ANIMATIONS
  // ════════════════════════════════════════════════════════════

  function initAnimations() {
    if (typeof gsap === 'undefined') return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
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

    // Rainbow gradient animation for topbar title
    const titleEl = document.querySelector('.topbar-title');
    if (titleEl) {
      gsap.to(titleEl, {
        backgroundPosition: '1200px',
        duration: 6,
        repeat: -1,
        ease: 'none'
      });
    }
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
    try {
      await switchMap('duviri');
    } catch (e) {
      console.error('Map init failed, retrying...', e);
      // Reset and retry once
      destroyMap();
      await new Promise(r => setTimeout(r, 500));
      try {
        await switchMap('duviri');
      } catch (e2) {
        console.error('Map init retry failed:', e2);
        document.getElementById('map').innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#607898;font-size:14px;">地图加载失败，请刷新页面重试</div>';
      }
    }
    initAnimations();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
