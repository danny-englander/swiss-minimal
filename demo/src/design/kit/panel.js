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
   - Optional: <html data-panel-hash="menu"> adds #menu to the URL while open, so the
     Back button closes the panel and a shared link opens it. */
(function () {
  var root = document.documentElement;
  var button = document.querySelector('[data-panel-button]');
  var panel = document.querySelector('[data-panel]');
  var page = document.querySelector('[data-panel-page]');
  var scroller = panel && panel.querySelector('.panel-inner');
  if (!button || !panel) return;

  var hash = root.getAttribute('data-panel-hash');
  var open = false;

  function setOpen(next) {
    if (next === open) return;
    open = next;
    button.setAttribute('aria-expanded', String(open));
    panel.setAttribute('data-open', String(open));
    panel.setAttribute('aria-hidden', String(!open));
    if (open) {
      panel.removeAttribute('inert');
      if (page) page.setAttribute('inert', '');
      root.setAttribute('data-menu', 'open');
      if (scroller) scroller.scrollTo({ top: 0 });
      if (hash) history.replaceState(null, '', '#' + hash);
      var first = panel.querySelector('a[href], summary, button, input, textarea, select');
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
      if (hash) history.replaceState(null, '', location.pathname + location.search);
      button.focus({ preventScroll: true });
    }
  }

  button.addEventListener('click', function () { setOpen(!open); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && open) setOpen(false); });
  document.addEventListener('menu:close', function () { setOpen(false); });
  panel.addEventListener('click', function (e) {
    var link = e.target.closest && e.target.closest('[data-panel-close]');
    if (link) setOpen(false);
  });

  if (hash) {
    var sync = function () { setOpen(location.hash === '#' + hash); };
    window.addEventListener('hashchange', sync);
    if (location.hash === '#' + hash) requestAnimationFrame(function () { requestAnimationFrame(sync); });
  }
})();
