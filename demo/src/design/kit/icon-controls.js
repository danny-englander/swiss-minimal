/* Icon-only controls for rows built in the browser. Plain JavaScript (an ES module), no dependencies.
   Pairs with .icon-btn in theme.css and kit/astro/IconTemplates.astro.

   Rows made by a script can't use astro-icon, which runs at build time, so each icon is rendered
   once into a <template data-icon="copy"> and cloned into every row:

     import { iconControl, focusAfterRemoval } from '.../kit/icon-controls.js';
     const copy = iconControl('button', 'copy', `Copy link: ${title}`);
     const share = iconControl('a', 'bluesky', `Share on Bluesky: ${title} (opens in a new tab)`);

   The name goes in aria-label, verb first, naming the action and its object. The hover label
   (title) is its short form: the part before the colon ("Copy link", "Share on Bluesky"). */

/** A copy of the icon rendered into <template data-icon="key">, or nothing if there is none. */
export function icon(key) {
  var t = document.querySelector('template[data-icon="' + key + '"]');
  return t ? t.content.cloneNode(true) : document.createTextNode('');
}

/** An icon-only <a> or <button> with its accessible name and hover label. */
export function iconControl(tag, key, label, className) {
  var node = document.createElement(tag);
  node.className = className || 'icon-btn';
  if (tag === 'button') node.type = 'button';
  node.append(icon(key));
  node.setAttribute('aria-label', label);
  node.title = label.replace(/:.*/, '');
  return node;
}

/**
 * Call just before removing `item` from `list`, with focus on its remove button. Returns a
 * function to call just after: it moves focus to the remove button now in that place (the next
 * row's, or the previous one's if it was last), or to `fallback` (e.g. the list's heading) once
 * the list is empty, so focus never drops to the top of the page.
 */
export function focusAfterRemoval(list, item, selector, fallback) {
  var at = Array.prototype.indexOf.call(list.children, item);
  return function () {
    var next = list.children[Math.min(at, list.children.length - 1)];
    var target = (next && next.querySelector(selector)) || fallback;
    if (target) target.focus({ preventScroll: true });
  };
}
