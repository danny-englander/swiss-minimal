/* Dialog. Plain JavaScript, no dependencies. Pairs with .dialog in theme.css.
   The browser's own <dialog> does nearly everything; this only fills in where a browser is
   behind (see the dialog page on MDN):

     <button type="button" commandfor="confirm" command="show-modal">Delete…</button>
     <dialog class="dialog" id="confirm" aria-labelledby="confirm-title" closedby="any">
       <form method="dialog" class="dialog-form">…<button value="cancel" autofocus>Cancel</button></form>
     </dialog>

   - Opening: a button with commandfor + command="show-modal" opens it, no script needed. Where
     the browser doesn't run commands yet, this does (show-modal and close).
   - Closing: any button in the <form method="dialog"> closes it, and its value becomes the
     dialog's returnValue; Escape closes it too. closedby="any" also closes it on a click
     outside; where the browser doesn't support closedby yet, this does.
   - Listen for 'close' on the dialog and read dialog.returnValue to act on the choice. */
if (!('commandForElement' in HTMLButtonElement.prototype)) {
  document.addEventListener('click', function (e) {
    var button = e.target instanceof Element && e.target.closest('button[commandfor]');
    if (!button) return;
    var dialog = document.getElementById(button.getAttribute('commandfor'));
    if (!(dialog instanceof HTMLDialogElement)) return;
    var command = button.getAttribute('command');
    if (command === 'show-modal' && !dialog.open) dialog.showModal();
    else if (command === 'close' && dialog.open) dialog.close(button.value);
  });
}

if (!('closedBy' in HTMLDialogElement.prototype)) {
  document.addEventListener('click', function (e) {
    var dialog = e.target;
    if (!(dialog instanceof HTMLDialogElement) || !dialog.open) return;
    if (dialog.getAttribute('closedby') !== 'any') return;
    // A click on the dialog element itself, outside its box, landed on the backdrop.
    var r = dialog.getBoundingClientRect();
    var inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    if (!inside) dialog.close('');
  });
}
