/**
 * map.js — Warframe Interactive Map Engine
 * Uses Leaflet + Static PNG overlay + Custom hex markers
 */

(function () {
  'use strict';

  // ════════════════════════════════════════════════════════════
  //  CONFIG
  // ════════════════════════════════════════════════════════════

  const MAP_SIZE = 4000;
  const MAP_EXTENT = 0.04;

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

  const GROUPS = {
    'duviri': [
      { name: '交通与据点', ids: ['blinkpad', 'cave', 'undercroft', 'shop', 'npc'] },
      { name: '资源采集', ids: ['ueymag', 'tasoma', 'eevani', 'connla_sprout', 'yao_shrub', 'silphsela', 'dracroot', 'kovnik', 'saggen_pearl'] },
      { name: '活动与谜题', ids: ['game', 'puzzle', 'puzzle_coop', 'shawzin', 'herding', 'fishing'] },
      { name: '记忆碎片', ids: ['scholars_landing', 'we_are_not', 'watchers_island', 'lake_veruna', 'galleria', 'doll_mausoleum', 'caves_of_academe', 'manipura_island', 'island_of_lorn', 'bleeding_earth'] },
      { name: '收集品', ids: ['1', '2', 'somachord'] }
    ],
    'plains-of-eidolon': [
      { name: '交通与据点', ids: ['blinkpad', 'cave', 'konzu', 'grineer_base'] },
      { name: '夜灵狩猎', ids: ['eidolon_lure', 'eidolon_shrine'] },
      { name: '捕鱼点', ids: ['lake', 'ocean', 'pond'] },
      { name: '资源与收集', ids: ['cetus_wisp', 'thousand_year_fish'] },
      { name: '活动', ids: ['plague_star'] }
    ],
    'orb-vallis': [
      { name: '交通与据点', ids: ['blinkpad', 'corpus_base'] },
      { name: '洞穴', ids: ['cave_with_fishing', 'cave_no_fishing'] },
      { name: '捕鱼点', ids: ['pond', 'lake'] },
      { name: '环形装置', ids: ['sola_toroid', 'calda_toroid', 'vega_toroid'] },
      { name: '首领', ids: ['exploiter_orb', 'profit-taker_orb'] },
      { name: '活动', ids: ['k-drive_race', '1', '2'] },
      { name: '记忆碎片', ids: ['eudico_fragment', 'legs_fragment', 'little_duck_fragment', 'rude_zuud_fragment', 'smokefinger_fragment', 'the_business_fragment', 'ticker_fragment'] }
    ],
    'cambion-drift': [
      { name: '交通与据点', ids: ['blinkpad', 'k-drive_race'] },
      { name: '活动与首领', ids: ['mother', 'mother_isolation_vault', 'requiem_obelisk'] }
    ]
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
    day: { zh: '白昼', en: 'Day' },
    night: { zh: '夜晚', en: 'Night' },
    warm: { zh: '温暖', en: 'Warm' },
    cold: { zh: '寒冷', en: 'Cold' },
    fass: { zh: 'Fass', en: 'Fass' },
    vome: { zh: 'Vome', en: 'Vome' },
    sorrow: { zh: '悲伤', en: 'Sorrow' },
    fear: { zh: '恐惧', en: 'Fear' },
    joy: { zh: '喜悦', en: 'Joy' },
    anger: { zh: '愤怒', en: 'Anger' },
    envy: { zh: '嫉妒', en: 'Envy' }
  };

  function calcCycles() {
    const now = Date.now() / 1000;

    // Eidolon
    const eidElapsed = (now - CYCLE_CONFIG.eidolon.epoch) % CYCLE_CONFIG.eidolon.full;
    const eidNight = CYCLE_CONFIG.eidolon.full - CYCLE_CONFIG.eidolon.day;
    const eidIsDay = eidElapsed < eidNight;
    const eidRemaining = eidIsDay
      ? CYCLE_CONFIG.eidolon.day - eidElapsed
      : CYCLE_CONFIG.eidolon.full - eidElapsed;

    // Vallis
    const valElapsed = (now - CYCLE_CONFIG.vallis.epoch) % CYCLE_CONFIG.vallis.full;
    const valCold = CYCLE_CONFIG.vallis.full - CYCLE_CONFIG.vallis.warm;
    const valIsWarm = valElapsed > valCold;
    const valRemaining = valIsWarm
      ? CYCLE_CONFIG.vallis.full - valElapsed
      : valCold - valElapsed;

    // Duviri
    const duvElapsed = (Math.floor(now) - 52) % CYCLE_CONFIG.duviri.full;
    const duvIdx = Math.floor(duvElapsed / CYCLE_CONFIG.duviri.phase);
    const duvRemaining = CYCLE_CONFIG.duviri.phase - (duvElapsed % CYCLE_CONFIG.duviri.phase);
    const duvState = CYCLE_CONFIG.duviri.emotions[duvIdx];

    // Cambion (derived from Eidolon)
    const camState = eidIsDay ? 'fass' : 'vome';

    return {
      'plains-of-eidolon': {
        state: eidIsDay ? 'day' : 'night',
        remaining: eidRemaining
      },
      'orb-vallis': {
        state: valIsWarm ? 'warm' : 'cold',
        remaining: valRemaining
      },
      'duviri': {
        state: duvState,
        remaining: duvRemaining
      },
      'cambion-drift': {
        state: camState,
        remaining: eidRemaining
      }
    };
  }

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  function updateCycleDisplay() {
    const cycles = calcCycles();
    const current = cycles[currentMap];
    if (!current) return;

    const nameEl = document.getElementById('cycleName');
    const timerEl = document.getElementById('cycleTimer');
    const iconEl = document.getElementById('cycleIcon');

    const stateName = STATE_NAMES[current.state];
    nameEl.textContent = stateName ? stateName.zh : current.state;
    timerEl.textContent = formatTime(current.remaining);

    // Update icon color based on state
    const colors = {
      day: '#ffd700', night: '#4a6fa5',
      warm: '#ff6b4a', cold: '#4ac1ff',
      fass: '#ff4a4a', vome: '#4a8fff',
      sorrow: '#6a4aff', fear: '#4a4a4a', joy: '#ffdd4a', anger: '#ff4a4a', envy: '#4aff4a'
    };
    iconEl.style.background = colors[current.state] || 'var(--c-cyan)';
    iconEl.style.boxShadow = `0 0 8px ${colors[current.state] || 'var(--c-cyan)'}`;

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

    // Fit bounds
    map.fitBounds(cfg.bounds);

    // Add image overlay
    imageOverlay = L.imageOverlay(cfg.image, cfg.bounds, {
      opacity: 1,
      interactive: true
    }).addTo(map);

    // Mouse coords display
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
  //  MARKERS
  // ════════════════════════════════════════════════════════════

  function getMarkerColor(categoryId, categories) {
    const cat = categories.find(c => c.id === categoryId);
    return cat ? cat.color : '#00d4ff';
  }

  function getMarkerSymbol(categoryId, categories) {
    const cat = categories.find(c => c.id === categoryId);
    return cat ? (cat.symbol || '') : '';
  }

  function createHexIcon(color, symbol) {
    return L.divIcon({
      className: 'hex-marker',
      html: `<div class="hex-marker-inner" style="background:${color};clip-path:polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)">${symbol ? `<span style="font-size:7px">${symbol}</span>` : ''}</div>`,
      iconSize: [16, 18],
      iconAnchor: [8, 18],
      popupAnchor: [0, -18]
    });
  }

  function addMarkers(data) {
    if (!data || !data.markers || !data.categories) return;

    data.markers.forEach(m => {
      if (!categoryState[m.categoryId]) return;
      if (showFavOnly && !isFavorite(m.id)) return;
      if (searchQuery && !m.popup.title.toLowerCase().includes(searchQuery)) return;

      const color = getMarkerColor(m.categoryId, data.categories);
      const symbol = getMarkerSymbol(m.categoryId, data.categories);
      const icon = createHexIcon(color, symbol);

      // Convert pixel coords to Leaflet coords
      const lat = m.position[1];
      const lng = m.position[0];

      const marker = L.marker([lat, lng], { icon })
        .addTo(map)
        .bindPopup(() => {
          const cat = data.categories.find(c => c.id === m.categoryId);
          const catName = cat ? cat.name : m.categoryId;
          const isFav = isFavorite(m.id);
          return `<div class="popup-card">
            <div class="popup-title">${m.popup.title}</div>
            <div class="popup-category">${catName}</div>
            <div class="popup-actions">
              <button class="popup-btn ${isFav ? 'fav-active' : ''}" onclick="window._toggleFav('${m.id}')">
                ${isFav ? '★ 已收藏' : '☆ 收藏'}
              </button>
              ${m.popup.link && m.popup.link.url ? `<a class="popup-btn" href="${m.popup.link.url}" target="_blank">${m.popup.link.label || 'Wiki'}</a>` : ''}
            </div>
          </div>`;
        }, { maxWidth: 250 });

      marker._markerId = m.id;
      marker._categoryId = m.categoryId;
      markers.push(marker);
    });

    updateStats();
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

    const groups = GROUPS[currentMap] || [];
    let html = '';

    groups.forEach(group => {
      const cats = group.ids
        .map(id => data.categories.find(c => c.id === id))
        .filter(Boolean);

      const totalItems = cats.reduce((sum, c) => {
        const count = data.markers.filter(m => m.categoryId === c.id).length;
        return sum + count;
      }, 0);

      const checkedCount = cats.reduce((sum, c) => {
        if (!categoryState[c.id]) return sum;
        const count = data.markers.filter(m => m.categoryId === c.id).length;
        return sum + count;
      }, 0);

      const allOn = cats.every(c => categoryState[c.id]);
      const allOff = cats.every(c => !categoryState[c.id]);

      html += `<div class="cat-group ${allOn ? 'all-on' : ''} ${allOff ? 'all-off' : ''}" data-group="${group.name}">
        <div class="cat-group-header" onclick="window._toggleGroup(this)">
          <div class="cat-group-toggle">✓</div>
          <div class="cat-group-name">${group.name}</div>
          <div class="cat-group-count">${checkedCount}/${totalItems}</div>
          <div class="cat-group-arrow">▼</div>
        </div>
        <div class="cat-group-items">`;

      cats.forEach(cat => {
        const count = data.markers.filter(m => m.categoryId === cat.id).length;
        const checked = categoryState[cat.id];
        html += `<div class="cat-item" data-cat="${cat.id}">
          <div class="cat-item-color" style="background:${cat.color};color:${cat.color}"></div>
          <input type="checkbox" class="cat-item-check" ${checked ? 'checked' : ''} onchange="window._toggleCategory('${cat.id}', this.checked)">
          <div class="cat-item-name">${cat.name}</div>
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

    const total = data.markers.length;
    const visible = markers.length;

    document.getElementById('statTotal').textContent = total;
    document.getElementById('statVisible').textContent = visible;
  }

  // ════════════════════════════════════════════════════════════
  //  FAVORITES
  // ════════════════════════════════════════════════════════════

  function loadFavorites() {
    try {
      favorites = JSON.parse(localStorage.getItem('wfspeed-map-favorites') || '{}');
    } catch (e) {
      favorites = {};
    }
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
    if (idx >= 0) {
      favorites[currentMap].splice(idx, 1);
    } else {
      favorites[currentMap].push(id);
    }
    saveFavorites();
    refreshMarkers();

    // Reopen popup if marker exists
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
      const group = GROUPS[currentMap].find(g => g.name === groupEl.dataset.group);
      if (!group) return;

      let checkedCount = 0;
      let totalCount = 0;

      group.ids.forEach(id => {
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

    // Keyboard shortcut
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

    // Update nav tabs
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`[data-map="${mapId}"]`)?.classList.add('active');

    // Reset category state
    initCategoryState();

    // Destroy old map
    destroyMap();

    // Load data
    const data = await loadMapData(mapId);
    if (!data) return;

    // Init new map
    initMap();

    // Render sidebar
    renderSidebar(data);

    // Add markers
    addMarkers(data);

    // Update cycle display
    updateCycleDisplay();
  }

  function initCategoryState() {
    const data = mapData[currentMap];
    if (!data) return;

    categoryState = {};
    data.categories.forEach(cat => {
      categoryState[cat.id] = true;
    });
  }

  // ════════════════════════════════════════════════════════════
  //  EVENT BINDINGS
  // ════════════════════════════════════════════════════════════

  function bindEvents() {
    // Nav tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.addEventListener('click', () => switchMap(tab.dataset.map));
    });

    // Select all / Clear all
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

    // Fav toggle
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

    gsap.from('.map-topbar', { y: -60, opacity: 0, duration: 0.6, ease: 'power3.out' });
    gsap.from('.map-nav', { x: -64, opacity: 0, duration: 0.6, delay: 0.1, ease: 'power3.out' });
    gsap.from('.map-sidebar', { x: -280, opacity: 0, duration: 0.6, delay: 0.2, ease: 'power3.out' });
  }

  // ════════════════════════════════════════════════════════════
  //  INIT
  // ════════════════════════════════════════════════════════════

  async function init() {
    loadFavorites();
    initSearch();
    bindEvents();

    // Start cycle timer
    updateCycleDisplay();
    setInterval(updateCycleDisplay, 1000);

    // Load initial map
    await switchMap('duviri');

    // Animations
    initAnimations();
  }

  // Start
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
