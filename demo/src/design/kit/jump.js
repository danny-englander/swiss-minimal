/* Jump to the current item. Plain JavaScript, no dependencies. Pairs with .jump-btn in theme.css.
   A small triangle in a bottom bar that appears while the current row is scrolled off screen
   (▲ above, ▼ below) or hidden by a filter (▲), and brings it back. Markup:

     <div data-jump-bar>   the fixed bottom bar; rows behind it count as off screen
       <button type="button" class="jump-btn" data-jump data-jump-target='[data-item="field-notes"]'
               data-jump-name="Field notes" hidden>
         <span aria-hidden="true" data-jump-glyph>▲</span>
       </button>
     </div>

   - data-jump-target: a CSS selector for the current row. Default .row[data-active="true"].
     No match, no button.
   - Re-measured on scroll, resize and any layout change (a filter, an accordion).
   - A click closes the menu and drawer, dispatches 'filter:reset' if a filter hides the row
     (the page's filter script should show everything again), scrolls the row to the middle
     of the screen, puts keyboard focus on its first link or button, and flashes its outline.
   - Its name says what it does: "Show Field notes in the list", plus "(shows all items)"
     when it will clear a filter. The hover label (title) is the short form.
   - Dispatch 'jump:update' after you change which row is current. */
(function () {
  var button = document.querySelector('[data-jump]');
  if (!button) return;
  var selector = button.getAttribute('data-jump-target') || '.row[data-active="true"]';
  var name = button.getAttribute('data-jump-name') || 'the current item';
  var glyph = button.querySelector('[data-jump-glyph]') || button;
  var bar = button.closest('[data-jump-bar]');
  var topbar = document.querySelector('.topbar');
  var place = null;
  var frame = 0;

  function target() { return document.querySelector(selector); }

  function set(next) {
    if (next === place) return;
    place = next;
    var show = next !== null && next !== 'onscreen';
    button.hidden = !show;
    if (!show) return;
    glyph.textContent = next === 'below' ? '▼' : '▲';
    button.setAttribute('aria-label', 'Show ' + name + ' in the list' + (next === 'filtered' ? ' (shows all items)' : ''));
    button.title = 'Show in the list';
  }

  function measure() {
    frame = 0;
    var row = target();
    if (!row) return set(null);
    if (row.closest('[hidden]')) return set('filtered');
    var r = row.getBoundingClientRect();
    var top = topbar ? topbar.getBoundingClientRect().bottom : 0;
    var bottom = bar ? bar.getBoundingClientRect().top : innerHeight;
    // A sliver at the edge does not count as on screen.
    set(r.bottom < top + 24 ? 'above' : r.top > bottom - 24 ? 'below' : 'onscreen');
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(measure); }

  button.addEventListener('click', function () {
    var row = target();
    if (!row) return;
    document.dispatchEvent(new Event('menu:close'));
    document.dispatchEvent(new Event('drawer:close'));
    if (row.closest('[hidden]')) document.dispatchEvent(new Event('filter:reset'));
    var reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    row.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
    var focusable = row.querySelector('a[href], button');
    if (!focusable) {
      row.tabIndex = -1;
      focusable = row;
    }
    focusable.focus({ preventScroll: true });
    row.setAttribute('data-flash', 'true');
    setTimeout(function () { row.removeAttribute('data-flash'); }, 1600);
  });

  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  document.addEventListener('jump:update', schedule);
  new ResizeObserver(schedule).observe(document.body);
  measure();
})();
