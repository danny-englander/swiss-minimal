// Tags and publishes a release of the kit: runs the demo's tests, pushes main, adds a date tag
// such as v2026.10.19 (v2026.10.19.2 for a second release that day) and creates the GitHub
// Release. Adapted from Dial Hopping's scripts/release.ts (see "Releases" in TOOLING.md).
//   npm run release              asks before tagging and publishing
//   npm run release -- --dry-run shows the tag and notes, changes nothing
//   npm run release -- --yes     skips the question
//
// The notes come from demo/src/data/features.ts: entries added since the last tag are "New",
// entries whose text changed are "Updated". With neither, the notes say "Polish and fixes."
// Every commit since the last tag is listed underneath, folded away.
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createInterface } from 'node:readline/promises';
import { pathToFileURL } from 'node:url';
import { features } from '../src/data/features.ts';
import type { Feature } from '../src/design/kit/astro/types.ts';

const dryRun = process.argv.includes('--dry-run');
const yes = process.argv.includes('--yes');
// The kit is the repository; the demo, with package.json and the tests, is a folder in it.
const repoRoot = new URL('../../', import.meta.url);
const demoDir = new URL('../', import.meta.url);
const featuresPath = 'demo/src/data/features.ts';

function git(...args: string[]): string {
  return execFileSync('git', args, { cwd: repoRoot, encoding: 'utf8' }).trim();
}

function stop(message: string): never {
  console.error(`\n✗ ${message}\n`);
  process.exit(1);
}

const pad = (n: number) => String(n).padStart(2, '0');
const now = new Date();
// RELEASE_TODAY=YYYY-MM-DD pretends it is another day, for trying out --dry-run.
const today = process.env.RELEASE_TODAY ?? `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

// 1. Only release a clean, up-to-date main.
if (git('rev-parse', '--abbrev-ref', 'HEAD') !== 'main') stop('Switch to main first.');
if (git('status', '--porcelain')) {
  if (!dryRun) stop('There are uncommitted changes. Commit or stash them first.');
  console.warn('Note: there are uncommitted changes. A real release would stop here.');
}
git('fetch', '--quiet', '--tags', 'origin');
if (git('rev-list', '--count', 'HEAD..origin/main') !== '0') stop('origin/main has commits you do not have. Pull first.');

// 2. The last release, and today's tag name.
const tags = git('tag', '--list', 'v*', '--merged', 'HEAD', '--sort=-creatordate').split('\n').filter(Boolean);
const lastTag = tags[0];
if (lastTag && git('rev-list', '-n', '1', lastTag) === git('rev-parse', 'HEAD')) {
  stop(`This commit is already released as ${lastTag}.`);
}
const base = `v${today.replaceAll('-', '.')}`;
const sameDay = git('tag', '--list', `${base}*`).split('\n').filter(Boolean);
const tag = sameDay.length === 0 ? base : `${base}.${sameDay.length + 1}`;

const line = (f: Feature) => `- **${f.title}.** ${f.body}`;
// The entry's line, then its details as sub-bullets. Only the line is compared with what was
// published, so details can be added to an entry without it counting as updated.
const entry = (f: Feature) => [line(f), ...(f.details ?? []).map((d) => `  - ${d}`)].join('\n');

// 3. Features at the last release, read from that version of features.ts.
async function featuresAt(ref: string): Promise<Feature[]> {
  const dir = mkdtempSync(join(tmpdir(), 'release-'));
  try {
    const file = join(dir, 'features.ts');
    writeFileSync(file, git('show', `${ref}:${featuresPath}`));
    return (await import(pathToFileURL(file).href)).features;
  } catch {
    return []; // features.ts did not exist yet
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

const before = lastTag ? await featuresAt(lastTag) : [];
const oldByTitle = new Map(before.map((f) => [f.title, f]));
const newSinceTag = features.filter((f) => !oldByTitle.has(f.title));

// An entry added after a release but dated on or before that release's day belongs to that
// release (it was live already, and its notes are fixed by hand), so it is not news now.
// On a second release the same day there is no telling, so it counts as new.
const lastTagDay = lastTag?.slice(1, 11).replaceAll('.', '-');
const lateAdditions = newSinceTag.filter((f) => lastTagDay && lastTagDay !== today && f.date <= lastTagDay);
// Lines already in the last release's published notes (added there by hand) are not repeated.
let lastNotes = '';
if (lastTag) {
  try {
    lastNotes = execFileSync('gh', ['release', 'view', lastTag, '--json', 'body', '--jq', '.body'], {
      cwd: repoRoot,
      encoding: 'utf8',
    });
  } catch {
    // No release page for that tag, or gh is not signed in: nothing to compare with.
  }
}
const alreadyPublished = (f: Feature) => lastNotes.includes(line(f));
const added = newSinceTag.filter((f) => !lateAdditions.includes(f) && !alreadyPublished(f));
if (lateAdditions.length) {
  console.log(
    `Left out of the notes, as part of ${lastTag} already:\n` +
      lateAdditions.map((f) => `  ${f.date}  ${f.title}`).join('\n'),
  );
}
const updated = features.filter((f) => {
  const old = oldByTitle.get(f.title);
  return old && (old.body !== f.body || old.date !== f.date) && !alreadyPublished(f);
});

// The Features tab shows the day each feature went live, which is today.
const wrongDate = added.filter((f) => f.date !== today);
if (lastTag && wrongDate.length) {
  stop(
    `These new features are not dated today (${today}) in ${featuresPath}:\n` +
      wrongDate.map((f) => `  ${f.date}  ${f.title}`).join('\n') +
      '\nUpdate the dates, commit, and run this again.',
  );
}

// 4. The notes.
const commits = git('log', '--no-merges', '--format=- %s (%h)', ...(lastTag ? [`${lastTag}..HEAD`] : ['-n', '30']));
const sections: string[] = [];
if (!lastTag) {
  sections.push(`The first tagged release.\n\n## Features so far\n\n${features.map(entry).join('\n')}`);
} else {
  if (added.length) sections.push(`## New\n\n${added.map(entry).join('\n')}`);
  if (updated.length) sections.push(`## Updated\n\n${updated.map(entry).join('\n')}`);
  if (!added.length && !updated.length) sections.push('Polish and fixes.');
}
sections.push(
  `<details>\n<summary>${lastTag ? `Commits since ${lastTag}` : 'Recent commits'}</summary>\n\n${commits}\n\n</details>`,
);
const notes = sections.join('\n\n') + '\n';
const title = `Swiss Minimal ${tag}`;

console.log(`\n${title}${lastTag ? ` (previous: ${lastTag})` : ' (first release)'}\n`);
console.log(notes);
if (dryRun) {
  console.log('Dry run: nothing was tested, tagged, pushed or published.\n');
  process.exit(0);
}

// 5. Ask, test, push, tag, publish.
if (!yes) {
  if (!process.stdin.isTTY) stop('Run this in a terminal, or pass --yes.');
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const answer = await rl.question(`Run the tests, then push and publish ${tag}? (y/N) `);
  rl.close();
  if (answer.trim().toLowerCase() !== 'y') stop('Nothing was released.');
}

const run = (cmd: string, args: string[], cwd: URL = repoRoot) => {
  const r = spawnSync(cmd, args, { cwd, stdio: 'inherit' });
  if (r.status !== 0) stop(`${cmd} ${args.join(' ')} failed. Nothing was tagged or published.`);
};
run('npm', ['test'], demoDir);
run('git', ['push', 'origin', 'main']);
run('git', ['tag', '-a', tag, '-m', title]);
run('git', ['push', 'origin', tag]);

const notesDir = mkdtempSync(join(tmpdir(), 'release-'));
const notesFile = join(notesDir, 'notes.md');
writeFileSync(notesFile, notes);
const published = spawnSync('gh', ['release', 'create', tag, '--title', title, '--notes-file', notesFile, '--verify-tag'], {
  cwd: repoRoot,
  stdio: 'inherit',
});
rmSync(notesDir, { recursive: true, force: true });
if (published.status !== 0) {
  stop(`${tag} is tagged and pushed, but the GitHub Release failed. Retry with: gh release create ${tag} --generate-notes`);
}
console.log(`\n✓ Released ${tag}.\n`);
