/* Scrolling title. Plain JavaScript, no dependencies. Pairs with .marquee in theme.css.
   One line that scrolls when it is too long to fit, like a music player's title:

     <span class="marquee" title="Full text" data-marquee><span>Full text</span></span>

   - Every [data-marquee] runs once the fonts have loaded, so it measures the real width.
   - Only when it doesn't fit; a short title never moves.
   - Waits 2s, slides at 50px a second, waits 2s, slides back. Three rounds, then it rests with
     an ellipsis (WCAG 2.2.2). Never with Reduce Motion.
   - Changed the text? Call scrollTitle(el) again: import { scrollTitle } from '…/marquee.js'. */
export function scrollTitle(el) {
  var distance = el.scrollWidth - el.clientWidth;
  if (distance <= 4 || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var pause = 2000;
  var slide = Math.max(1500, (distance / 50) * 1000);
  var total = 2 * pause + 2 * slide;
  var end = 'translateX(-' + distance + 'px)';
  el.dataset.scrolling = '';
  el.firstElementChild.animate(
    [
      { transform: 'none', offset: 0 },
      { transform: 'none', offset: pause / total, easing: 'ease-in-out' },
      { transform: end, offset: (pause + slide) / total },
      { transform: end, offset: (2 * pause + slide) / total, easing: 'ease-in-out' },
      { transform: 'none', offset: 1 },
    ],
    { duration: total, iterations: 3 },
  ).onfinish = function () {
    delete el.dataset.scrolling;
  };
}

document.fonts.ready.then(function () {
  document.querySelectorAll('[data-marquee]').forEach(scrollTitle);
});
