/* "New" dot: tells a returning visitor that something was added since they last looked.
   Plain JavaScript, no dependencies. Pairs with .new-dot in theme.css and kit/panel.js.
   Markup it expects (MenuPanel.astro and MenuButton.astro write it for you):

     <button data-panel-button data-label="Menu" class="topbar-btn burger">
       ... <span data-new-dot class="new-dot new-dot--button" aria-hidden="true" hidden></span>
     </button>
     <div data-panel
          data-new-latest="2026-10-16"         the newest entry's date, YYYY-MM-DD
          data-new-tab="features"              the tab that lists what is new; opening it clears the dot
          data-new-key="site:features-seen"    where the date last seen is kept (localStorage)
          data-new-returning="theme,site:favorites"   saved settings that mark a returning visitor
          data-new-note="new features">        added to the button's name while the dot shows
       ... <button role="tab" data-tab="features">Features
             <span data-new-dot class="new-dot new-dot--tab" hidden><span class="sr-only">(new)</span></span>
           </button>
     </div>

   - A first visit has nothing to catch up on: it is marked seen, with no dot.
   - A returning visitor (any of the data-new-returning keys is saved) who has not seen the
     newest date gets the dot on the button and on the tab, and the button's name gains
     ", new features" (its hover label "· New features").
   - Opening that tab, by click, key, link or #hash, clears it for good.
   localStorage can throw or be empty (private windows, blocked site data); the page works
   the same without it, just with no dot. */
(function () {
  var host = document.querySelector('[data-new-latest]');
  if (!host) return;
  var latest = host.getAttribute('data-new-latest') || '';
  var tab = host.getAttribute('data-new-tab');
  var key = host.getAttribute('data-new-key') || 'new-seen';
  var note = host.getAttribute('data-new-note') || 'new';
  var returningKeys = (host.getAttribute('data-new-returning') || 'theme')
    .split(',')
    .map(function (k) { return k.trim(); })
    .filter(Boolean);
  var button = document.querySelector('[data-panel-button]');
  var dots = [].slice.call(document.querySelectorAll('[data-new-dot]'));

  function read(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function write(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* remembering is a convenience */ } }

  // Dates are YYYY-MM-DD, so they compare as strings.
  var seen = read(key);
  var returning = returningKeys.some(function (k) { return read(k) !== null; });
  var hasNew = seen ? seen < latest : returning;
  if (!seen && !returning) write(key, latest);

  function show() {
    dots.forEach(function (dot) { dot.hidden = !hasNew; });
    if (button) {
      if (hasNew) button.setAttribute('data-label-note', note);
      else button.removeAttribute('data-label-note');
    }
    document.dispatchEvent(new Event('panel:relabel'));
  }

  document.addEventListener('panel:tab', function (e) {
    if (!hasNew || !e.detail || e.detail.id !== tab) return;
    hasNew = false;
    write(key, latest);
    show();
  });
  show();
})();
