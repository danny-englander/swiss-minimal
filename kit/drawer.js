/* Drawer behavior: a smaller slide-down panel that does not take over the page.
   Plain JavaScript, no dependencies. Pairs with .drawer in theme.css.
   Markup it expects (Drawer.astro and DrawerButton.astro write it for you):

     <button data-drawer-button aria-expanded="false" aria-controls="drawer"
             data-label="Recently viewed" data-label-open="Close recently viewed">...</button>
     <section id="drawer" class="drawer" data-drawer aria-labelledby="drawer-heading" aria-hidden="true" inert>
       <div class="drawer-inner">
         <h2 id="drawer-heading" tabindex="-1" data-drawer-focus class="label drawer-heading">...</h2>
         <div class="drawer-list-wrap">
           <ol class="drawer-list" data-drawer-list>...</ol>
           <button type="button" class="drawer-more" data-drawer-more data-show="false" tabindex="-1" aria-label="Scroll to more">...</button>
         </div>
         <p class="closing-note">...</p>
       </div>
     </section>

   What it does, and how it differs from the menu panel (kit/panel.js):
   - Non-modal: the page is not made inert, so a click on it still works. The page does not
     scroll while it is open (<html data-drawer-open>); only the drawer's list does.
   - Closes on its button, Escape, 'drawer:close', or a pointer press anywhere outside it.
     That press still does what it was aimed at, and focus stays where it lands. Elements
     marked data-drawer-keep (a bottom bar, the toast) are left out, so they stay usable.
   - Also closes when keyboard focus moves outside it (Tab past its last row), since it
     covers the page down to the bottom bar and focus there would be hidden behind it.
   - Opening it dispatches 'menu:close'; the menu panel dispatches 'drawer:close' when it
     opens. Only one is open at a time.
   - Moves focus to the heading on open (retried for a moment under Reduce Motion) and back
     to the button when closed by the button or Escape.
   - The round "more below" arrow shows while the list overflows and is still at the top. It
     scrolls the list by most of a screen; from the keyboard it also moves focus to the first
     row that comes into view, since the arrow is about to disappear. Rows can be added and
     removed at any time; it re-checks on its own. */
(function () {
  var root = document.documentElement;
  var button = document.querySelector('[data-drawer-button]');
  var drawer = document.querySelector('[data-drawer]');
  if (!button || !drawer) return;
  var heading = drawer.querySelector('[data-drawer-focus]');
  var list = drawer.querySelector('[data-drawer-list]');
  var more = drawer.querySelector('[data-drawer-more]');
  var reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  var open = false;

  function relabel() {
    var label = button.getAttribute(open ? 'data-label-open' : 'data-label');
    if (!label) return;
    button.setAttribute('aria-label', label);
    button.setAttribute('data-tip', label);
  }

  function updateMore() {
    if (!list || !more) return;
    var show = list.scrollHeight - list.clientHeight > 4 && list.scrollTop < 8;
    more.setAttribute('data-show', String(show));
    more.tabIndex = show ? 0 : -1;
    more.setAttribute('aria-hidden', String(!show));
  }

  function setOpen(next, returnFocus) {
    if (next === open) return;
    open = next;
    button.setAttribute('aria-expanded', String(open));
    drawer.setAttribute('data-open', String(open));
    drawer.setAttribute('aria-hidden', String(!open));
    relabel();
    if (open) {
      document.dispatchEvent(new Event('menu:close'));
      drawer.removeAttribute('inert');
      root.setAttribute('data-drawer-open', '');
      if (list) list.scrollTo({ top: 0 });
      updateMore();
      // As in the menu: with Reduce Motion on, the first focus() can be refused for a moment.
      var tries = 0;
      (function moveFocusIn() {
        if (heading) heading.focus({ preventScroll: true });
        if (open && heading && document.activeElement !== heading && tries++ < 20) setTimeout(moveFocusIn, 25);
      })();
    } else {
      drawer.setAttribute('inert', '');
      root.removeAttribute('data-drawer-open');
      if (returnFocus) button.focus({ preventScroll: true });
    }
  }

  button.addEventListener('click', function () { setOpen(!open, true); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && open) setOpen(false, true); });
  // The menu sends this when it opens; it moves focus itself, so do not take it back.
  document.addEventListener('drawer:close', function () { setOpen(false, false); });
  function closeIfOutside(e) {
    if (!open) return;
    var target = e.target;
    if (drawer.contains(target) || button.contains(target)) return;
    if (target.closest && target.closest('[data-drawer-keep]')) return;
    setOpen(false, false);
  }
  document.addEventListener('pointerdown', closeIfOutside);
  document.addEventListener('focusin', closeIfOutside);

  if (list) {
    list.addEventListener('scroll', updateMore, { passive: true });
    new MutationObserver(updateMore).observe(list, { childList: true });
  }
  window.addEventListener('resize', updateMore);
  if (more && list) {
    more.addEventListener('click', function (e) {
      var target = list.scrollTop + list.clientHeight * 0.8;
      list.scrollBy({ top: list.clientHeight * 0.8, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
      if (e.detail === 0) {
        var items = [].slice.call(list.children);
        var next = items.filter(function (item) { return item.offsetTop >= target; })[0] || items[items.length - 1];
        var focusable = next && next.querySelector('a, button');
        if (focusable) focusable.focus({ preventScroll: true });
      }
    });
  }
  relabel();
  updateMore();
})();
