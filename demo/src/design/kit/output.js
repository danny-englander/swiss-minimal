/* Output panel. Plain JavaScript, no dependencies. Pairs with .output in theme.css.
   Helpers for a page that streams a task's output into the panel:

     import { outputClear, outputLine, outputStatus } from '…/kit/output.js';
     const panel = document.querySelector('[data-output]');
     outputClear(panel);
     outputStatus(panel, 'Running…', true);
     outputLine(panel, '$ export 2026-10-01 2026-10-15', 'cmd');
     outputLine(panel, 'Saved report.pdf');
     outputLine(panel, 'Could not read notes.txt', 'err');
     outputStatus(panel, 'Finished', false);

   - Lines are set as text, never as HTML.
   - The log follows the newest line while the reader is at the bottom. If they have scrolled
     up to read, it stays where they are.
   - The status is a polite live region: screen readers hear "Running…" and "Finished", not
     every line. The spinner shows while running. */
function log(panel) {
  return panel.querySelector('[data-output-log]');
}

export function outputClear(panel) {
  var code = log(panel).querySelector('code') || log(panel);
  code.textContent = '';
}

export function outputLine(panel, text, kind) {
  var el = log(panel);
  var code = el.querySelector('code') || el;
  var atEnd = el.scrollHeight - el.scrollTop - el.clientHeight < 8;
  var line = document.createElement('span');
  if (kind === 'cmd') line.className = 'pre-cmd';
  if (kind === 'err') line.className = 'pre-err';
  line.textContent = text;
  if (code.childNodes.length) code.append('\n');
  code.append(line);
  if (atEnd) el.scrollTop = el.scrollHeight;
}

export function outputStatus(panel, text, running) {
  var status = panel.querySelector('[data-output-status]');
  if (status) status.textContent = text;
  if (running) panel.setAttribute('data-running', '');
  else panel.removeAttribute('data-running');
}
