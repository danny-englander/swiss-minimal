/* Favorite stars. Plain JavaScript (an ES module), no dependencies. Pairs with .fav-btn in theme.css.
   Markup (FavoriteButton.astro writes it for you):

     <button type="button" class="fav-btn" data-favorite="field-notes" aria-pressed="false"
             aria-label="Favorite Field notes">...star...</button>

   - Saved by item id (not by position or number, which shift) as a JSON array in
     localStorage, under the key in <html data-favorites-key="mysite:favorites">
     (default "favorites"). Kept on this device only.
   - A click toggles aria-pressed. Keep the star beside the row's main link or button, never
     inside it (a button can't hold another), so it never sets off the row's own action. If
     the row itself listens for clicks, ignore ones from e.target.closest('[data-favorite]').
   - Every [data-favorites-count] shows how many there are (e.g. in a Favorites filter chip).
   - Fires 'favorites:change' on document with { detail: { ids } } after each change.
   - import { getFavorites } from '.../kit/favorites.js' to read the ids in a filter script. */
var key = document.documentElement.getAttribute('data-favorites-key') || 'favorites';

export function getFavorites() {
  try {
    var parsed = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(parsed) ? parsed.filter(function (id) { return typeof id === 'string'; }) : [];
  } catch (e) {
    return [];
  }
}

function save(ids) {
  try { localStorage.setItem(key, JSON.stringify(ids)); } catch (e) { /* remembering is a convenience */ }
}

function sync(ids) {
  document.querySelectorAll('[data-favorite]').forEach(function (b) {
    b.setAttribute('aria-pressed', String(ids.indexOf(b.getAttribute('data-favorite')) >= 0));
  });
  document.querySelectorAll('[data-favorites-count]').forEach(function (el) { el.textContent = String(ids.length); });
}

export function toggleFavorite(id) {
  var ids = getFavorites();
  var next = ids.indexOf(id) >= 0 ? ids.filter(function (f) { return f !== id; }) : ids.concat(id);
  save(next);
  sync(next);
  document.dispatchEvent(new CustomEvent('favorites:change', { detail: { ids: next } }));
}

document.addEventListener('click', function (e) {
  var b = e.target.closest && e.target.closest('[data-favorite]');
  if (!b) return;
  toggleFavorite(b.getAttribute('data-favorite'));
});
sync(getFavorites());
