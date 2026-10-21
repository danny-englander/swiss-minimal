/* File picker. Plain JavaScript, no dependencies. Pairs with .file-pick in theme.css.
   Shows what was chosen in the field beside the Choose… button:

     <label class="field-label" for="ref" id="ref-label">Reference file</label>
     <div class="file-pick">
       <input class="sr-only" type="file" id="ref" name="ref" data-file-pick
              aria-labelledby="ref-label ref-name">
       <span class="file-pick-name" id="ref-name" data-file-pick-name data-empty>No file chosen</span>
       <label class="btn-outline" for="ref" aria-hidden="true">Choose…</label>
     </div>

   - One file shows its name; several show "3 files"; a folder (webkitdirectory) shows its
     name. Nothing chosen shows the text the field started with.
   - The field is part of the input's name (aria-labelledby), so a screen reader hears
     "Reference file, report.pdf". The button is a label for the same input, hidden from
     screen readers since the input itself is the control.
   - After setting files from a script, dispatch 'change' on the input. */
document.querySelectorAll('[data-file-pick]').forEach(function (input) {
  var name = input.parentElement.querySelector('[data-file-pick-name]');
  if (!name) return;
  var empty = name.textContent;

  function show() {
    var files = input.files ? Array.prototype.slice.call(input.files) : [];
    if (files.length === 0) {
      name.textContent = empty;
      name.setAttribute('data-empty', '');
      return;
    }
    var folder = input.hasAttribute('webkitdirectory') && files[0].webkitRelativePath;
    name.textContent = folder
      ? files[0].webkitRelativePath.split('/')[0]
      : files.length === 1 ? files[0].name : files.length + ' files';
    name.removeAttribute('data-empty');
  }

  input.addEventListener('change', show);
  input.form && input.form.addEventListener('reset', function () { setTimeout(show); });
  show();
});
