/* Slide-down panel behavior. Plain JavaScript, no dependencies.
   Pairs with .panel in theme.css. Markup it expects:

     <button data-panel-button aria-expanded="false" aria-controls="panel">...</button>
     <div id="panel" class="panel" data-panel aria-hidden="true" inert>...</div>
     <div data-panel-page>...the rest of the page...</div>

   What it does:
   - Opens and closes with the button, with Escape, and when another script
     dispatches   document.dispatchEvent(new Event('menu:close'))
   - Keeps aria-expanded / aria-hidden in sync, and sets `inert` so closed content
     is unreachable by keyboard and screen readers.
   - Makes the rest of the page inert while the panel is open (no tabbing behind it).
   - Sets <html data-menu="open"> so CSS can lock scrolling and flip the top bar dark.
   - Moves focus into the panel on open and back to the button on close.
   - Closes when a link marked data-panel-close is clicked (for links that jump
     to a spot on the page).
   - Closes a drawer (kit/drawer.js) when it opens, by dispatching 'drawer:close'.
   - Optional: <html data-panel-hash="menu"> adds #menu to the URL while open, so the
     Back button closes the panel and a shared link opens it.
   - Optional: with data-label="Menu" (and data-label-open="Close menu") on the button, keeps
     its aria-label and hover label (data-tip) in step with the panel. A data-label-note
     (set by kit/new-dot.js, e.g. "new features") is added to both while it is there.

   Tabs (optional). Put numbered tabs in the panel and each one becomes a page of it:

     <div role="tablist" aria-label="Menu pages" class="panel-tabs">
       <button type="button" role="tab" id="tab-about" data-tab="about" aria-controls="panel-about"
               aria-selected="true" class="panel-tab"><span class="panel-tab-num">01</span> About</button>
       ...
     </div>
     <div id="panel-about" role="tabpanel" aria-labelledby="tab-about" class="panel-tabpanel">...</div>

   - Every tab is a Tab stop, and Enter or Space opens it (they are buttons). The arrow
     keys, Home and End also move between tabs.
   - Each tab deep-links: #about in the URL opens the panel on that tab, the URL shows the
     open tab, and Back closes the panel. (So no element on the page may use a tab's id.)
   - On open, focus goes to the open tab, retried for a moment under Reduce Motion.
   - Fires   'panel:tab'   on document, with { detail: { id } }, whenever a tab is shown
     while the panel is open (and when the panel opens). kit/new-dot.js listens for it. */
(function () {
  var root = document.documentElement;
  var button = document.querySelector('[data-panel-button]');
  var panel = document.querySelector('[data-panel]');
  var page = document.querySelector('[data-panel-page]');
  var scroller = panel && panel.querySelector('.panel-inner');
  if (!button || !panel) return;

  var tabs = [].slice.call(panel.querySelectorAll('[role="tab"][data-tab]'));
  var ids = tabs.map(function (t) { return t.getAttribute('data-tab'); });
  var selected = tabs.filter(function (t) { return t.getAttribute('aria-selected') === 'true'; })[0];
  var current = selected ? selected.getAttribute('data-tab') : ids[0];

  var hash = root.getAttribute('data-panel-hash');
  var open = false;

  function relabel() {
    var base = button.getAttribute(open ? 'data-label-open' : 'data-label') || button.getAttribute('data-label');
    if (!base) return;
    var note = button.getAttribute('data-label-note');
    button.setAttribute('aria-label', note ? base + ', ' + note : base);
    button.setAttribute('data-tip', note && !open ? base + ' · ' + note.charAt(0).toUpperCase() + note.slice(1) : base);
  }

  function setHash() {
    if (tabs.length) history.replaceState(null, '', '#' + current);
    else if (hash) history.replaceState(null, '', '#' + hash);
  }
  function clearHash() {
    if (tabs.length || hash) history.replaceState(null, '', location.pathname + location.search);
  }

  function announceTab() {
    if (open && tabs.length) document.dispatchEvent(new CustomEvent('panel:tab', { detail: { id: current } }));
  }

  function selectTab(id, focus) {
    if (ids.indexOf(id) < 0) return;
    current = id;
    tabs.forEach(function (tab) {
      var isSelected = tab.getAttribute('data-tab') === id;
      tab.setAttribute('aria-selected', String(isSelected));
      var tabpanel = document.getElementById(tab.getAttribute('aria-controls'));
      if (tabpanel) tabpanel.hidden = !isSelected;
      if (isSelected && focus) tab.focus({ preventScroll: true });
    });
    if (scroller) scroller.scrollTo({ top: 0 });
    if (open) setHash();
    announceTab();
  }

  function setOpen(next, tabId) {
    if (tabId) selectTab(tabId);
    if (next === open) return;
    open = next;
    button.setAttribute('aria-expanded', String(open));
    panel.setAttribute('data-open', String(open));
    panel.setAttribute('aria-hidden', String(!open));
    relabel();
    if (open) {
      document.dispatchEvent(new Event('drawer:close'));
      panel.removeAttribute('inert');
      if (page) page.setAttribute('inert', '');
      root.setAttribute('data-menu', 'open');
      if (scroller) scroller.scrollTo({ top: 0 });
      setHash();
      announceTab();
      var first = tabs.length
        ? tabs[ids.indexOf(current)]
        : panel.querySelector('a[href], summary, button, input, textarea, select');
      // With Reduce Motion on, the first focus() can be refused for about 50ms after the click,
      // which would leave keyboard focus behind on the page. Keep trying until it lands.
      var tries = 0;
      (function moveFocusIn() {
        if (first) first.focus({ preventScroll: true });
        if (open && first && !panel.contains(document.activeElement) && tries++ < 20) setTimeout(moveFocusIn, 25);
      })();
    } else {
      panel.setAttribute('inert', '');
      if (page) page.removeAttribute('inert');
      root.removeAttribute('data-menu');
      clearHash();
      button.focus({ preventScroll: true });
    }
  }

  button.addEventListener('click', function () { setOpen(!open); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && open) setOpen(false); });
  document.addEventListener('menu:close', function () { setOpen(false); });
  document.addEventListener('panel:relabel', relabel);
  panel.addEventListener('click', function (e) {
    var link = e.target.closest && e.target.closest('[data-panel-close]');
    if (link) setOpen(false);
  });

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () { selectTab(tab.getAttribute('data-tab')); });
    tab.addEventListener('keydown', function (e) {
      var i = ids.indexOf(tab.getAttribute('data-tab'));
      var to =
        e.key === 'ArrowRight' ? (i + 1) % ids.length
        : e.key === 'ArrowLeft' ? (i - 1 + ids.length) % ids.length
        : e.key === 'Home' ? 0
        : e.key === 'End' ? ids.length - 1
        : -1;
      if (to < 0) return;
      e.preventDefault();
      selectTab(ids[to], true);
    });
  });

  // Links like <a href="#contact">, shared links and the Back button: open or close to match.
  function sync() {
    var id = location.hash.slice(1);
    if (tabs.length) {
      if (ids.indexOf(id) >= 0) setOpen(true, id);
      else if (open) setOpen(false);
    } else if (hash) {
      setOpen(id === hash);
    }
  }
  if (tabs.length || hash) {
    window.addEventListener('hashchange', sync);
    var start = location.hash.slice(1);
    // Opened by a link: let the page paint first so the panel slides down.
    if (ids.indexOf(start) >= 0 || (hash && start === hash)) {
      requestAnimationFrame(function () { requestAnimationFrame(sync); });
    }
  }
  relabel();
})();
