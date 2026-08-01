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
  let mapData = {};
  let categoryState = {};
  let favorites = {};
  let showFavOnly = false;
  let searchQuery = '';
  let currentZoom = 2;
  let currentLang = localStorage.getItem('wfspeed-map-lang') || 'zh';

  // ════════════════════════════════════════════════════════════
  //  CYCLE CALCULATIONS
  // ════════════════════════════════════════════════════════════

  const CYCLE_CONFIG = {
    eidolon: { epoch: 1548924027, full: 8998.8748, day: 2999.6249 },
    vallis: { epoch: new Date('2026-02-04T19:46:48Z').getTime() / 1000, full: 1600, warm: 400 },
    duviri: { full: 36000, phase: 7200, emotions: ['sorrow', 'fear', 'joy', 'anger', 'envy'] }
  };

  const STATE_NAMES = {
    day:    { zh: '白昼', en: 'Day',   icon: '☀️', color: '#ffd700' },
    night:  { zh: '夜晚', en: 'Night', icon: '🌙', color: '#6f8bff' },
    warm:   { zh: '温暖', en: 'Warm',  icon: '🌡️', color: '#ff9a4f' },
    cold:   { zh: '寒冷', en: 'Cold',  icon: '❄️', color: '#45c8ff' },
    fass:   { zh: 'Fass',  en: 'Fass',  icon: '🔴', color: '#ff5f9e' },
    vome:   { zh: 'Vome',  en: 'Vome',  icon: '🔵', color: '#45c8ff' },
    sorrow: { zh: '悲伤', en: 'Sorrow', icon: '💧', color: '#6f8bff' },
    fear:   { zh: '恐惧', en: 'Fear',   icon: '👁️', color: '#a86bff' },
    joy:    { zh: '喜悦', en: 'Joy',    icon: '✨', color: '#ffd04f' },
    anger:  { zh: '愤怒', en: 'Anger',  icon: '🔥', color: '#ff7a6b' },
    envy:   { zh: '嫉妒', en: 'Envy',   icon: '💀', color: '#41ff8e' }
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
    const lang = currentLang === 'en' ? 'en' : 'zh';
    nameEl.textContent = stateInfo ? stateInfo[lang] : current.state;
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
        stateEl.textContent = sn ? sn[lang] : data.state;
      }
    });
  }

  // ════════════════════════════════════════════════════════════
  //  TRANSLATIONS
  // ════════════════════════════════════════════════════════════

  function getCategoryName(catId) {
    if (currentLang === 'en') {
      const mapNames = typeof CATEGORY_NAMES_MAP_EN !== 'undefined' ? CATEGORY_NAMES_MAP_EN[currentMap] : null;
      if (mapNames && mapNames[catId]) return mapNames[catId];
    }
    const mapNames = typeof CATEGORY_NAMES_MAP !== 'undefined' ? CATEGORY_NAMES_MAP[currentMap] : null;
    if (mapNames && mapNames[catId]) return mapNames[catId];
    return catId;
  }

  function getIconPath(catId) {
    const rel = ICON_MAP[catId] || 'shared/blinkpad.png';
    return ICON_BASE + rel;
  }

  function getGroupName(groupId) {
    const lang = currentLang === 'en' ? 'en' : 'zh';
    const t = MAP_TRANSLATIONS[lang].groups;
    return t[groupId] || groupId;
  }

  function getMarkerDescription(markerId, fallback) {
    if (typeof MARKER_DESCRIPTIONS !== 'undefined' && MARKER_DESCRIPTIONS[markerId]) {
      return MARKER_DESCRIPTIONS[markerId];
    }
    return fallback || '';
  }

  function getMarkerTitle(title) {
    if (!title) return '';
    const map = typeof MARKER_TITLE_MAP !== 'undefined' ? MARKER_TITLE_MAP[currentMap] : null;
    if (map && map[title]) return map[title];
    // Pattern: "XXX Fragment N X" → lookup XXX + "碎片"
    const fragMatch = title.match(/^(.+?)\s+Fragment\s+N?\s*\d+$/i);
    if (fragMatch) {
      const base = fragMatch[1];
      if (map && map[base]) return map[base] + '碎片';
      return base + '碎片';
    }
    // Pattern: "XXX's Mem Fragment N/N" → lookup XXX + "的记忆碎片"
    const memMatch = title.match(/^(.+?)(?:'s|s')\s+Mem\s+Fragment/i);
    if (memMatch) {
      const base = memMatch[1];
      if (map && map[base]) return map[base] + '的记忆碎片';
      return base + '的记忆碎片';
    }
    // Pattern: "XXX Somachord" → "身心和弦琴 · XXX"
    const somMatch = title.match(/^(.+?)\s+Somachord$/i);
    if (somMatch) {
      return '身心和弦琴 · ' + somMatch[1];
    }
    return title;
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
      const saved = JSON.parse(localStorage.getItem(LS_CAT_KEY) || '{}');
      if (saved[currentMap]) {
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
  //  MAP INITIALIZATION
  // ════════════════════════════════════════════════════════════

  function initMap() {
    const cfg = MAPS[currentMap];
    map = L.map('map', {
      crs: L.CRS.Simple,
      minZoom: -5,
      maxZoom: cfg.maxZoom,
      zoomSnap: 0.5,
      attributionControl: false,
      keyboard: true
    });
    map.fitBounds(cfg.bounds);

    imageOverlay = L.imageOverlay(cfg.image, cfg.bounds, {
      opacity: 1,
      interactive: true
    }).addTo(map);
    imageOverlay.on('load', updateMarkerPositions);
    map.on('zoom move resize', scheduleMarkerUpdate);

    map.on('mousemove', (e) => {
      const coords = document.getElementById('overlayCoords');
      if (coords) {
        const gx = Math.round(e.latlng.lng);
        const gy = Math.round(e.latlng.lat);
        coords.textContent = `${gx}, ${gy}`;
      }
    });

    map.on('zoomend', () => {
      renderLocationList();
    });
  }

  function destroyMap() {
    if (map) {
      clearMarkerElements();
      map.remove();
      map = null;
      imageOverlay = null;
    }
  }

  // ════════════════════════════════════════════════════════════
  //  IMAGE-ALIGNED MARKERS — DOM-based, pinned to overlay pixels
  // ════════════════════════════════════════════════════════════

  let markerElements = [];
  let markerContainer = null;
  let _markerPosRAF = null;

  function scheduleMarkerUpdate() {
    if (_markerPosRAF) return;
    _markerPosRAF = requestAnimationFrame(() => {
      _markerPosRAF = null;
      updateMarkerPositions();
    });
  }

  function createMarkerElements(data) {
    if (!data || !data.markers || !data.categories) return;
    const validCatIds = new Set(data.categories.map(c => c.id));
    const mapEl = document.getElementById('map');
    markerContainer = document.createElement('div');
    markerContainer.className = 'imap-layer';
    mapEl.appendChild(markerContainer);

    data.markers.forEach(m => {
      if (!validCatIds.has(m.categoryId)) return;
      if (!categoryState[m.categoryId]) return;
      if (showFavOnly && !isFavorite(m.id)) return;
      if (searchQuery && !getMarkerTitle(m.popup.title).toLowerCase().includes(searchQuery) && !m.popup.title.toLowerCase().includes(searchQuery)) return;
      const el = buildMarkerEl(m, data);
      markerContainer.appendChild(el);
      markerElements.push({ el, data: m });
    });
    updateMarkerPositions();
    updateStats();
  }

  function buildMarkerEl(m, data) {
    const cat = data.categories.find(c => c.id === m.categoryId);
    const color = cat ? cat.color : '#45c8ff';
    const catName = getCategoryName(m.categoryId);
    const iconPath = getIconPath(m.categoryId);
    const el = document.createElement('div');
    el.className = 'imap-marker';
    el.dataset.id = m.id;
    el.innerHTML = '<div class="imap-marker-pin" style="--marker-color:' + color + '">' +
      '<div class="imap-marker-glow"></div>' +
      '<img class="imap-marker-icon" src="' + iconPath + '" alt="' + catName + '" loading="lazy" draggable="false">' +
      '</div><span class="imap-marker-label">' + catName + '</span>';
    el.addEventListener('click', e => { e.stopPropagation(); showMarkerPopup(m, data); });
    return el;
  }

  function updateMarkerPositions() {
    if (!markerContainer || !imageOverlay || !map) return;
    const bounds = imageOverlay.getBounds();
    const nw = map.latLngToContainerPoint(bounds.getNorthWest());
    const se = map.latLngToContainerPoint(bounds.getSouthEast());
    const bw = se.x - nw.x, bh = se.y - nw.y;
    if (bw <= 0 || bh <= 0) return;
    for (let i = 0; i < markerElements.length; i++) {
      const it = markerElements[i];
      if (it.el.style.display === 'none') continue;
      const px = nw.x + (it.data.position[0] / MAP_SIZE) * bw;
      const py = nw.y + ((MAP_SIZE - it.data.position[1]) / MAP_SIZE) * bh;
      it.el.style.transform = 'translate(' + px + 'px,' + py + 'px) translate(-50%,-100%)';
    }
  }

  function showMarkerPopup(m, data) {
    const cat = data.categories.find(c => c.id === m.categoryId);
    const catName = cat ? getCategoryName(cat.id) : m.categoryId;
    const desc = getMarkerDescription(m.id, m.popup.description);
    const isFav = isFavorite(m.id);
    L.popup({ maxWidth: 280 })
      .setLatLng([m.position[1], m.position[0]])
      .setContent('<div class="popup-card"><div class="popup-header"><img class="popup-icon" src="' + getIconPath(m.categoryId) + '" alt=""><div><div class="popup-title">' + getMarkerTitle(m.popup.title) + '</div><div class="popup-category">' + catName + '</div></div></div>' + (desc ? '<div class="popup-desc">' + desc + '</div>' : '') + '<div class="popup-actions"><button class="popup-btn ' + (isFav ? 'fav-active' : '') + '" onclick="window._toggleFav(\'' + m.id + '\')">' + (isFav ? '★ 已收藏' : '☆ 收藏') + '</button>' + (m.popup.link && m.popup.link.url ? '<a class="popup-btn popup-link" href="' + m.popup.link.url + '" target="_blank">' + (m.popup.link.label || 'Wiki') + '</a>' : '') + '</div></div>')
      .openOn(map);
  }

  function clearMarkerElements() {
    if (markerContainer) { markerContainer.remove(); markerContainer = null; }
    markerElements = [];
    if (_markerPosRAF) { cancelAnimationFrame(_markerPosRAF); _markerPosRAF = null; }
  }

  function refreshMarkers() {
    clearMarkerElements();
    const data = mapData[currentMap];
    if (data) createMarkerElements(data);
    renderLocationList();
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
      container.innerHTML = `<div class="fav-empty">${currentLang === 'en' ? 'No favorites under current filters.' : '暂无收藏'}</div>`;
      document.getElementById('favPanelCount').textContent = '0';
      return;
    }

    document.getElementById('favPanelCount').textContent = favs.length;

    let html = '';
    favs.forEach(id => {
      const m = data.markers.find(mk => mk.id === id);
      if (!m) return;
      const catName = getCategoryName(m.categoryId);
      const title = getMarkerTitle(m.popup.title) || catName;
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
    const item = markerElements.find(m => m.data.id === id);
    if (item) {
      map.flyTo([item.data.position[1], item.data.position[0]], map.getZoom(), { duration: 0.5 });
      showMarkerPopup(item.data, mapData[currentMap]);
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
    document.getElementById('statVisible').textContent = markerElements.length;
    // Update right panel stats
    const locTotal = document.getElementById('locTotal');
    const locCatCount = document.getElementById('locCatCount');
    if (locTotal) locTotal.textContent = data.markers.length;
    if (locCatCount) locCatCount.textContent = data.categories.length;
  }

  // ════════════════════════════════════════════════════════════
  //  LOCATION LIST PANEL (Right Sidebar)
  // ════════════════════════════════════════════════════════════

  let locSortMode = 'wiki';
  let locFavOnly = false;

  function renderLocationList() {
    const container = document.getElementById('locList');
    if (!container) return;
    const data = mapData[currentMap];
    if (!data || !data.markers) {
      container.innerHTML = `<div class="locpanel-empty">${currentLang === 'en' ? 'Loading...' : '加载中...'}</div>`;
      return;
    }

    // Collect visible markers
    let visibleMarkers = data.markers.filter(m => {
      if (!categoryState[m.categoryId]) return false;
      if (locFavOnly && !isFavorite(m.id)) return false;
      if (searchQuery && !getMarkerTitle(m.popup.title).toLowerCase().includes(searchQuery) && !m.popup.title.toLowerCase().includes(searchQuery)) return false;
      return true;
    });

    // Sort
    visibleMarkers = sortMarkers(visibleMarkers, locSortMode, data);

    if (visibleMarkers.length === 0) {
      container.innerHTML = `<div class="locpanel-empty">${currentLang === 'en' ? 'No matching locations' : '无匹配地点'}</div>`;
      return;
    }

    // Group by category
    const groups = {};
    visibleMarkers.forEach(m => {
      if (!groups[m.categoryId]) groups[m.categoryId] = [];
      groups[m.categoryId].push(m);
    });

    let html = '';
    data.categories.forEach(cat => {
      const items = groups[cat.id];
      if (!items || items.length === 0) return;
      const catName = getCategoryName(cat.id);
      const iconPath = getIconPath(cat.id);

      html += `<div class="locpanel-group" data-cat="${cat.id}">
        <div class="locpanel-group-header" onclick="this.parentElement.classList.toggle('collapsed')">
          <img class="locpanel-group-icon" src="${iconPath}" alt="" loading="lazy">
          <div class="locpanel-group-name">${catName}</div>
          <div class="locpanel-group-count">${items.length}</div>
          <div class="locpanel-group-arrow">▼</div>
        </div>
        <div class="locpanel-group-items">`;

      items.forEach(m => {
        const isFav = isFavorite(m.id);
        const x = Math.round(m.position[0]);
        const y = Math.round(m.position[1]);
        const title = getMarkerTitle(m.popup.title) || catName;
        html += `<div class="locitem" onclick="window._flyToMarker('${m.id}')">
          <img class="locitem-icon" src="${iconPath}" alt="" loading="lazy">
          <div class="locitem-info">
            <div class="locitem-name">${title}</div>
            <div class="locitem-meta">${x}, ${y}</div>
          </div>
          <div class="locitem-fav ${isFav ? 'active' : ''}" onclick="event.stopPropagation(); window._toggleFav('${m.id}');">${isFav ? '★' : '☆'}</div>
        </div>`;
      });

      html += '</div></div>';
    });

    container.innerHTML = html;

    // Update fav count in panel
    const locFavCount = document.getElementById('locFavCount');
    if (locFavCount) {
      const favs = favorites[currentMap] || [];
      locFavCount.textContent = favs.length;
    }
  }

  function sortMarkers(markerList, mode, data) {
    const sorted = [...markerList];
    switch (mode) {
      case 'name':
        sorted.sort((a, b) => (a.popup.title || '').localeCompare(b.popup.title || ''));
        break;
      case 'category':
        sorted.sort((a, b) => {
          if (a.categoryId !== b.categoryId) return a.categoryId.localeCompare(b.categoryId);
          return (a.popup.title || '').localeCompare(b.popup.title || '');
        });
        break;
      case 'nearest': {
        if (!map) break;
        const center = map.getCenter();
        const centerWikiY = center.lat;
        sorted.sort((a, b) => {
          const distA = Math.hypot(a.position[0] - center.lng, a.position[1] - centerWikiY);
          const distB = Math.hypot(b.position[0] - center.lng, b.position[1] - centerWikiY);
          return distA - distB;
        });
        break;
      }
      case 'wiki':
      default:
        // Original order from JSON (wiki order)
        break;
    }
    return sorted;
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

    currentMap = mapId;

    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`[data-map="${mapId}"]`)?.classList.add('active');

    showLoading(true);

    if (typeof gsap !== 'undefined' && map) {
      await new Promise(resolve => {
        gsap.to('#map', { opacity: 0, scale: 0.98, duration: 0.2, ease: 'power2.in', onComplete: resolve });
      });
    }

    const data = await loadMapData(mapId);

    if (!data) {
      showLoading(false);
      document.getElementById('map').innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#607898;font-size:14px;">地图数据加载失败</div>';
      renderSidebar(null);
      return;
    }

    categoryState = {};
    const saved = JSON.parse(localStorage.getItem(LS_CAT_KEY) || '{}');
    const savedKeys = saved[mapId] ? Object.keys(saved[mapId]) : [];
    if (savedKeys.length > 0) {
      categoryState = saved[mapId];
      data.categories.forEach(cat => {
        if (!(cat.id in categoryState)) categoryState[cat.id] = false;
      });
    } else {
      data.categories.forEach(cat => { categoryState[cat.id] = false; });
    }
    saveCategoryState();

    destroyMap();

    const mapEl = document.getElementById('map');
    if (!mapEl) { showLoading(false); return; }
    mapEl.innerHTML = '';
    mapEl.style.opacity = '1';

    renderSidebar(data);
    renderFavoritesPanel();
    renderLocationList();
    updateStats();
    updateCycleDisplay();

    try {
      initMap();
      createMarkerElements(data);
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

    // Apply current language to new map
    applyLanguage();
  }

  // ════════════════════════════════════════════════════════════
  //  LANGUAGE TOGGLE
  // ════════════════════════════════════════════════════════════

  function switchLanguage(lang) {
    if (lang === currentLang) return;
    currentLang = lang;
    localStorage.setItem('wfspeed-map-lang', lang);

    // Update toggle buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    // Update all UI text without resetting checkboxes
    applyLanguage();
  }

  function applyLanguage() {
    const t = MAP_TRANSLATIONS[currentLang] || MAP_TRANSLATIONS.zh;

    // Nav tab map names
    document.querySelectorAll('.nav-tab').forEach(tab => {
      const mapId = tab.dataset.map;
      const labelEl = tab.querySelector('.nav-tab-label');
      if (labelEl && t.maps && t.maps[mapId]) {
        labelEl.textContent = t.maps[mapId];
      }
    });

    // Sidebar
    const sidebarTitle = document.querySelector('.sidebar-title');
    if (sidebarTitle) sidebarTitle.textContent = t.filters;
    const selectAllBtn = document.getElementById('selectAll');
    if (selectAllBtn) selectAllBtn.textContent = t.all;
    const clearAllBtn = document.getElementById('clearAll');
    if (clearAllBtn) clearAllBtn.textContent = t.none;

    // Stats
    const statTotal = document.getElementById('statTotal');
    const statVisible = document.getElementById('statVisible');
    if (statTotal && statVisible) {
      const data = mapData[currentMap];
      if (data) {
        statTotal.textContent = data.markers.length;
        statVisible.textContent = markerElements.length;
      }
    }
    // Update sidebar stats if it exists
    const statsSpan = document.querySelector('.sidebar-stats');
    if (statsSpan && statTotal && statVisible) {
      statsSpan.innerHTML = `${statTotal.textContent} ${t.locations} · ${statVisible.textContent} ${t.categories}`;
    }

    // Right panel stats
    const locStats = document.querySelector('.locpanel-stats');
    if (locStats) {
      const data = mapData[currentMap];
      const total = data ? data.markers.length : 0;
      const cats = data ? data.categories.length : 0;
      const locLabel = currentLang === 'en' ? 'locations' : '地点';
      const catLabel = currentLang === 'en' ? 'categories' : '分类';
      locStats.innerHTML = `<span id="locTotal">${total}</span> ${locLabel} · <span id="locCatCount">${cats}</span> ${catLabel}`;
    }

    // Favorites panel
    const favPanelName = document.querySelector('.fav-panel-name');
    if (favPanelName) favPanelName.textContent = t.favorites;
    const favEmpty = document.querySelector('.fav-empty');
    if (favEmpty) favEmpty.textContent = t.noFavorites;

    // Search placeholder
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.placeholder = t.search + '...';

    // Map loading text
    const loadingText = document.querySelector('.map-loading-text');
    if (loadingText) loadingText.textContent = currentLang === 'en' ? 'Loading map...' : '地图加载中...';

    // Right panel
    const locTitle = document.querySelector('.locpanel-title');
    if (locTitle) locTitle.textContent = currentLang === 'en' ? 'Location List' : '地点列表';
    const locSortLabel = document.querySelector('.locpanel-sort-label');
    if (locSortLabel) locSortLabel.textContent = t.sort;

    // Sort options
    const locSort = document.getElementById('locSort');
    if (locSort) {
      const opts = locSort.options;
      opts[0].text = currentLang === 'en' ? 'Wiki Order' : 'Wiki 顺序';
      opts[1].text = t.nameOrder;
      opts[2].text = t.categoryOrder;
      opts[3].text = t.nearestOrder;
    }

    // Cycle state names
    updateCycleDisplay();

    // Re-render sidebar and location list text (preserves checkboxes)
    const data = mapData[currentMap];
    if (data) {
      // Update sidebar group names and category names
      document.querySelectorAll('.cat-group').forEach(group => {
        const groupId = group.dataset.group;
        const nameEl = group.querySelector('.cat-group-name');
        if (nameEl) nameEl.textContent = getGroupName(groupId);
      });
      document.querySelectorAll('.cat-item').forEach(item => {
        const catId = item.dataset.cat;
        const nameEl = item.querySelector('.cat-item-name');
        if (nameEl) nameEl.textContent = getCategoryName(catId);
      });

      // Update location list
      renderLocationList();
      renderFavoritesPanel();
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
      const data = mapData[currentMap];
      if (!data) return;
      data.categories.forEach(cat => { categoryState[cat.id] = true; });
      document.querySelectorAll('.cat-item-check').forEach(cb => cb.checked = true);
      saveCategoryState();
      refreshMarkers();
      updateSidebarCounts();
    });

    document.getElementById('clearAll').addEventListener('click', () => {
      const data = mapData[currentMap];
      if (!data) return;
      data.categories.forEach(cat => { categoryState[cat.id] = false; });
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

    // Right panel: sort select
    const locSort = document.getElementById('locSort');
    if (locSort) {
      locSort.addEventListener('change', () => {
        locSortMode = locSort.value;
        renderLocationList();
        // Re-sort nearest if map moved
        if (locSortMode === 'nearest' && map) {
          map.on('moveend', () => renderLocationList());
        }
      });
    }

    // Language toggle
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => switchLanguage(btn.dataset.lang));
    });

    // Right panel: favorites only toggle
    const locFavToggle = document.getElementById('locFavToggle');
    if (locFavToggle) {
      locFavToggle.addEventListener('click', () => {
        locFavOnly = !locFavOnly;
        locFavToggle.classList.toggle('active', locFavOnly);
        const icon = locFavToggle.querySelector('.locpanel-fav-icon');
        if (icon) icon.textContent = locFavOnly ? '★' : '☆';
        renderLocationList();
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
  //  SPLASH SCREEN CONTROLLER (same as worldstate)
  // ════════════════════════════════════════════════════════════

  var _mapSpl = document.getElementById('map-splash');
  if (_mapSpl) {
    var _mapSplStatus = document.getElementById('map-spl-status');
    var _mapSplInfo   = document.getElementById('map-spl-info');
    var _mapSplBarFill = document.getElementById('map-spl-bar-fill');
    var _mapSplBarPct = document.getElementById('map-spl-bar-pct');
    var _mapSplLeft   = document.getElementById('map-spl-left');
    var _mapSplRight  = document.getElementById('map-spl-right');
    var _mapSplUtc    = document.getElementById('map-spl-utc');
    var _mapSplHexWrap = document.getElementById('map-spl-hex-wrap');

    var MAP_SPL_STATUSES = [
      'ESTABLISHING TACTICAL LINK',
      'AUTHENTICATING TENNO ACCESS',
      'LOADING MAP TERRAIN DATA',
      'SYNCING MARKER DATABASE',
      'CALIBRATING COORDINATE SYSTEM',
      'LOADING CYCLE DATA',
      'OPTIMIZING VIEWPORT RENDERER'
    ];
    var MAP_SPL_INFOS = [
      '// INITIALIZING LANDSCAPE MAP SYSTEM',
      '// CONNECTING TO MAP DATA SERVER',
      '// LOADING TERRAIN MESH DATA',
      '// SYNCING MARKER POSITIONS',
      '// CALIBRATING CYCLE TIMERS',
      '// LOADING FAVORITE LOCATIONS',
      '// CALIBRATING VIEWPORT RENDERER'
    ];

    /* 侧边十六进制数据流 */
    var HEX = '0123456789ABCDEF';
    function mapRndHexLine() {
      var n = Math.floor(Math.random() * 14) + 6, s = '';
      for (var i = 0; i < n; i++) s += HEX[Math.floor(Math.random() * 16)];
      return s;
    }
    function mapBuildHexBlock(count) {
      var lines = [];
      for (var i = 0; i < count; i++) lines.push(mapRndHexLine());
      return lines.join('\n');
    }
    function mapInitHexSides() {
      if (_mapSplLeft) _mapSplLeft.textContent = mapBuildHexBlock(48);
      if (_mapSplRight) _mapSplRight.textContent = mapBuildHexBlock(48);
    }
    function mapScrambleSide(el) {
      if (!el) return;
      var lines = el.textContent.split('\n');
      var idx = Math.floor(Math.random() * lines.length);
      lines[idx] = mapRndHexLine();
      el.textContent = lines.join('\n');
    }

    /* UTC 时钟 */
    function mapUpdateUtc() {
      if (!_mapSplUtc) return;
      var now = new Date();
      _mapSplUtc.textContent = 'UTC ' +
        String(now.getUTCHours()).padStart(2, '0') + ':' +
        String(now.getUTCMinutes()).padStart(2, '0') + ':' +
        String(now.getUTCSeconds()).padStart(2, '0');
    }

    /* 启动 */
    mapInitHexSides();
    mapUpdateUtc();
    var _mapSplClockT = setInterval(mapUpdateUtc, 1000);
    var _mapSplSideT = setInterval(function () {
      mapScrambleSide(_mapSplLeft);
      mapScrambleSide(_mapSplRight);
    }, 310);
    if (_mapSplHexWrap) _mapSplHexWrap.classList.add('map-spl-hex-spinning');

    /* 进度模拟（不超过 91%，留给真正加载完成时跳到 100%） */
    var _mapSplProg = 0;
    var _mapSplProgT = setInterval(function () {
      _mapSplProg = Math.min(_mapSplProg + Math.random() * 7 + 2.5, 91);
      if (_mapSplBarFill) _mapSplBarFill.style.width = _mapSplProg + '%';
      if (_mapSplBarPct)  _mapSplBarPct.textContent  = Math.floor(_mapSplProg) + '%';
    }, 165);

    /* 状态文本轮换 */
    var _mapSplMsgIdx = 0;
    var _mapSplStatusTimer = setInterval(function () {
      _mapSplMsgIdx = (_mapSplMsgIdx + 1) % MAP_SPL_STATUSES.length;
      if (_mapSplStatus) _mapSplStatus.textContent = MAP_SPL_STATUSES[_mapSplMsgIdx];
      if (_mapSplInfo) _mapSplInfo.textContent = MAP_SPL_INFOS[_mapSplMsgIdx];
    }, 670);

    /* 公开隐藏接口 */
    var _mapSplMinT   = Date.now() + 3000;
    var _mapSplHidden = false;
    window._mapSplDone = function () {
      if (_mapSplHidden) return;
      _mapSplHidden = true;
      var delay = Math.max(0, _mapSplMinT - Date.now());
      setTimeout(function () {
        clearInterval(_mapSplProgT);
        clearInterval(_mapSplStatusTimer);
        clearInterval(_mapSplSideT);
        clearInterval(_mapSplClockT);
        if (_mapSplBarFill)  { _mapSplBarFill.style.width = '100%'; }
        if (_mapSplBarPct)   { _mapSplBarPct.textContent  = '100%'; }
        if (_mapSplStatus) { _mapSplStatus.textContent = 'TACTICAL OVERLAY ONLINE'; }
        if (_mapSplInfo)   { _mapSplInfo.textContent   = '// LANDSCAPE MAP SYSTEM READY'; }
        setTimeout(function () {
          _mapSpl.classList.add('ws-splash--done');
          setTimeout(function () {
            if (_mapSpl.parentNode) _mapSpl.parentNode.removeChild(_mapSpl);
          }, 900);
        }, 360);
      }, delay);
    };
  }

  // ════════════════════════════════════════════════════════════
  //  INIT
  // ════════════════════════════════════════════════════════════

  async function init() {
    loadFavorites();
    initSearch();
    bindEvents();

    // Set initial language toggle state
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === currentLang);
    });

    updateCycleDisplay();
    setInterval(updateCycleDisplay, 1000);
    try {
      await switchMap('duviri');
    } catch (e) {
      console.error('Map init failed, retrying...', e);
      destroyMap();
      await new Promise(r => setTimeout(r, 500));
      try {
        await switchMap('duviri');
      } catch (e2) {
        console.error('Map init retry failed:', e2);
        document.getElementById('map').innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#607898;font-size:14px;">地图加载失败，请刷新页面重试</div>';
      }
    }

    // Apply language after map is loaded
    applyLanguage();

    initAnimations();
    if (window._mapSplDone) window._mapSplDone();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
