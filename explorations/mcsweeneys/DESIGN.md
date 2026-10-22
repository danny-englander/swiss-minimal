# Fleuron (working name)

*An exploration, not a kit.* A sister theme to Swiss Minimal with the same discipline (tokens, both themes passing contrast, few rules) and the opposite temper: the bookish, ornamented serif page of McSweeney's. Nothing here is built yet. The mockup beside this file, [`index.html`](index.html), shows what it would look like. Open it in a browser; it follows the system's light or dark setting.

## What makes McSweeney's recognisable

From the books, the Quarterly Concern and the website, as they are usually described:

1. **One classic serif, everywhere.** The Quarterly's dense pages are set all in Garamond, from the cover to the footnotes. The house style reaches for Caslon-era and Victorian printing.
2. **Centered, symmetrical title pages.** Covers and openings stack line after line of type on a center axis, at many sizes, like a 19th-century playbill or a patent-medicine label.
3. **Long, playful titles and subtitles.** "Containing…", "In Which…", "Being an Account of…". The joke is in the length, set dead straight.
4. **Small caps and italics do the emphasis.** Not bold. Bylines, running heads and labels are letterspaced small caps.
5. **Ornaments.** Fleurons (❦ ❧), the pointing hand (☞), asterisms (⁂), daggers and section marks, rules made of dots or doubled lines.
6. **Rules and boxed panels.** Thin and double rules, framed boxes around a table of contents or a notice.
7. **Dense pages.** Small margins, justified text, little white space for its own sake. "Complex simplicity": intricate, but in one voice and one color.
8. **A restrained palette.** Black on off-white, often one second ink. The website began black and white and is still mostly monochrome.
9. **Deadpan voice.** The design is formal so the writing can be funny.

What it is not: distressed textures, fake paper grain, sepia filters, script fonts, clip-art. The references are typographic, not a costume.

## Name

Working name: **Fleuron**, the printer's flower that marks a pause. It says "ornament" and "type" in one word, and it sits beside Swiss Minimal as plainly as that name does.

Alternatives:

- **Colophon**: the note at the back of a book saying how it was made.
- **Quarterly**: names the periodical form directly; closer to McSweeney's, which may be a reason not to.
- **Long Title**: describes the house joke; good, but sounds like a feature, not a look.

## Principles

- **Type does the work, again.** But here type is set like a book: serif, centered titles, small caps.
- **Ornament is allowed, and rationed.** A fleuron marks a break, a hand points at one thing, a box holds one thing. Never a pattern, never a background, never two ornaments side by side.
- **Flat, still.** No shadows, gradients, textures or rounded corners, the same as Swiss Minimal. Letterpress is suggested by the type and the rules, not by imitating ink spread or paper grain.
- **One typeface, nothing else.** Cormorant Garamond does everything: the masthead, titles, text, small caps, italics and the ornaments. No second family, not even for code. Three weights, each with one job (see Type). No bold in running text.
- **Thin rule, double rule.** A 1px rule separates rows. A double rule (two 1px lines, 3px apart) opens a section and frames the masthead. There is no thick 2px slab.
- **Centered titles, left-aligned reading.** Mastheads, page titles and section heads center. Body text, lists and forms align left, ragged right. Never justify: on a screen the browser can only fill a line by stretching the spaces between words, which a printer would never do.
- **Color is rarer still.** One second ink, like a two-color print job: a red for rubrics (initials, a pointing hand, the primary button) and nothing else.

## Content and voice

- Titles may be long. That is the point: "On the Keeping of Lists, Being a Short Account of Several Long Ones." Subtitles are italic.
- Labels are small caps in sentence case ("Table of contents", "In this issue"), never all caps. Small caps read at any length, so Swiss Minimal's two-word limit goes away.
- Buttons and links stay plain and short: "Subscribe", "Send". Being playful is the content's job, not the interface's.
- No emoji. Exclamation marks are the writer's business.
- The site name is set in Cormorant Light, large, centered, between double rules. Still no logo.

## Color

Light is the default. Dark keeps the same roles. Both pass WCAG AA for every text pairing listed.

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `paper` | `#f5efe2` | `#17150f` | Page. Warm uncoated stock in light; a warm near-black in dark. |
| `ink` | `#1d1a16` | `#ebe2cf` | Text, rules, ornaments (15.1:1 light, 14.2:1 dark). |
| `muted` | `#6b6253` | `#a99f8c` | Bylines, dates, captions (5.2:1 light, 7.0:1 dark). |
| `rule` | `#c9bea8` | `#5c5649` | Thin dividers only. Decorative, never a control's only edge. |
| `plate` | `#ebe2cf` | `#2a251d` | A boxed panel's ground (the Swiss `bar`, but quiet). Ink on it 13.5:1 / 11.8:1; muted 4.7:1 / 5.8:1. |
| `accent` | `#a8322a` | `#e2826d` | Rubric red. Initials, the pointing hand, the focus ring (5.8:1 / 6.6:1). Safe for small text too. |
| `accent-ink` | `#fdf9f0` | `#17150f` | Text on an accent fill: the filled button (6.3:1 / 6.6:1). |

The second accent, like verdigris beside vermilion:

| Token | Light | Dark |
| --- | --- | --- |
| `accent` | `#2c4a7a` | `#8db0de` |
| `accent-ink` | `#fdf9f0` | `#17150f` |

Accent names: **Rubric** (default) and **Prussian**. Rubric is the red ink of manuscript initials and headings (often vermilion itself, so it nods to the parent kit). Prussian is the first modern synthetic pigment, 1706, the blue of cyanotypes and old bindings. Prussian passes 7.7:1 on light paper and 8.2:1 on dark, 6.9:1 on light `plate`.

Changes from Swiss Minimal:

- **One accent token does the work of three.** These accents are dark enough for small text in light, and light enough in dark, so `accent-text` and `accent-bright` fold into `accent`. Fewer tokens, one less rule to remember.
- **No dark bars.** Swiss Minimal's black blocks are what make it Swiss; here they would look like a web app. The panel, drawer, toast and bottom bar use `plate` with a double rule edge. The row hover becomes `plate`, not a black fill.

## Type

One family: **Cormorant Garamond** v4.002 by Christian Thalmann (Catharsis Fonts), SIL OFL 1.1, falling back to Garamond, Iowan Old Style, Georgia.

| Style | Weight | Use |
| --- | --- | --- |
| `masthead` | Light 300 | Site name, `clamp(3rem, 10vw, 6.75rem)`, line height 0.95, centered |
| `display` | Light 300 | An article or page title, `clamp(2.5rem, 6.5vw, 4.5rem)`, line height 1, centered |
| `subtitle` | Medium 500 italic | Under a display title, 1.25rem then 1.5rem, centered |
| `h2` | SemiBold 600, small caps | Section head, 1.375rem, 0.1em, centered between ornaments |
| `title` | SemiBold 600 | A list item's name |
| `body` | Medium 500 | 1.25rem / 1.5, ragged right, hyphenated, old-style figures |
| `small` | Medium 500 | Captions and meta, 1.0625rem |
| `label` | SemiBold 600, small caps | Bylines, running heads, field labels, buttons, 1.125rem, 0.06em |
| `code` | the system's monospace | Code only; nothing to download |

- **Why Cormorant.** It is a free Garamond, close to the face the Quarterly is set in, with what this theme needs and most free serifs lack: real small caps, old-style and lining figures, ligatures (its "Th" is lovely), a true italic, and the ornaments themselves, drawn to match the type in every weight. One family is also closer to Swiss Minimal's "one typeface" rule.
- **Three weights, one job each.** Light only at display sizes, 2.5rem and up, where its fine strokes look like a Caslon title page; it is too thin for text. Medium for reading, because Cormorant's Regular is too light on a screen. SemiBold for small caps and names, the way Swiss Minimal uses its 500 for labels. Medium italic for subtitles and emphasis. Never Regular or Bold.
- **Self-hosted, from the designer's release** on GitHub ([CatharsisFonts/Cormorant](https://github.com/CatharsisFonts/Cormorant/releases/latest)), not Google Fonts: Google's version leaves the ornaments out. The four woff2 files and `Cormorant-OFL.txt` sit in `fonts/`; keep the license beside them.
- **Size.** Each weight is about 200 KB, because the release files carry every glyph. A real kit subsets them to Latin, the figures and the ornaments, which should bring each well under 100 KB.
- **Cormorant runs small.** Its x-height is low, so everything is set a size up from a usual serif: 1.25rem for reading text, and **17px is the floor**, not Swiss Minimal's 14px.
- Considered and set aside: **EB Garamond** with **Libre Caslon Display** for titles (the first mockup: sturdier text, but two families, and Google's EB Garamond lacks the ornaments), **IM Fell** (its scanned roughness reads as costume at body size), **Libre Caslon Text** (no small caps), **Cinzel Decorative** (capitals only, no ornaments).
- Small caps are real small caps (`font-variant-caps: all-small-caps` or `small-caps`), never shrunk capitals.
- Body uses old-style figures; tables and anything in a column use lining tabular figures (`.num`).
- `hyphens: auto` with `lang` set, and `text-wrap: pretty`, so the ragged edge stays even and no line ends on a lone word.

## Ornaments

The only decoration, and drawn from the font, never an image or icon set. Cormorant has every one of these, in every weight.

- **Fleuron** (❦, the hedera or ivy leaf): one, centered, to separate parts of a page; and either side of a section head. Its stylistic set 3 has a second design. Cormorant has no ❧ or ☙, so don't use them; they would fall back to another font.
- **Asterism** (⁂): a scene break in running text.
- **Pointing hand** (☞, and ☜ facing left): points at one thing per screen, in the accent. It may replace the Swiss "Site ↗" arrow before a link that matters.
- **Section, pilcrow, dagger** (§ ¶ † ‡): their usual jobs, numbering and footnotes.
- **Double rule**: masthead, section starts, the edge of a boxed panel.
- **Drop cap**: the first letter of an article, three lines deep, in Cormorant Light and the accent. One per page.
- **Box**: a 1px `ink` frame with an inner 1px rule 3px inside it, around a table of contents or a notice. One per screen.

Ornaments are `aria-hidden="true"`. They never carry meaning a screen reader needs.

## Layout

- **A narrow page.** Reading measure `measure` (34rem, about 66 characters). The page itself is `page-max` 60rem, narrower than Swiss Minimal's 88rem; this is a book, not a poster. Side `gutter` 1.5rem on phones (Swiss Minimal's is 1rem), 2rem from 640px: a book page wants a margin.
- **Centered stacks** for the masthead, an article opening (kicker, title, subtitle, byline) and section heads.
- **Two columns** from 1024px for a table of contents or an index, separated by a 1px rule; never for running text, which stays one measure wide.
- **Dense spacing.** Sections are `space-12` apart, not `space-16`. Paragraphs indent the first line (1.5em) instead of leaving a blank line, except after a heading.
- Mobile first. On a phone the masthead's double rules stay, the ornaments stay, the columns stack.
- Square corners, still. The six round marks keep their circles.

## Images

The Swiss rules hold: content only, plain rectangles, no filters. Two changes: a figure may sit in the box frame when it is a plate (a "Fig. 1" illustration); captions are centered italics, with the figure number in small caps.

## Motion

Less than Swiss Minimal. Panels and the drawer fade and slide 300ms instead of 550ms; hover swaps are 150ms. No scrolling title: a long title wraps, which is the house style anyway. Reduced motion still turns everything off.

## States and accessibility

All of Swiss Minimal's rules stay: the focus ring (2px solid `accent`, 3px offset, so it clears the double rules), the hand cursor, verb-first names, `aria-current`, 4.5:1 for all text. Two additions: text is never justified, since stretched word spaces are harder to read, for dyslexic readers especially; and ornaments are hidden from screen readers.

## Components

How each Swiss Minimal component would change. Most keep their markup and behavior; only the CSS differs.

| Component | In Fleuron |
| --- | --- |
| Top bar | Paper, ends in a double rule. The site name in small caps at the left, the buttons at the right. Never turns dark. |
| Outlined button | 1px `ink` border, small caps label. Hover fills `plate`, not black. |
| Hover label | `plate` with an `ink` hairline, italic. |
| Button | The one filled button: `accent` fill, `accent-ink` small caps. |
| Secondary button | As the outlined button, sentence case. |
| Panel | `plate`, a double rule along its bottom edge. The menu is centered, in Cormorant Light at display size. |
| Menu | Centered lines with a ☞ before the current item instead of an underline. Accordion plus/minus kept. |
| Panel tabs | Roman numerals (I, II, III) in small caps, the chosen one underlined in `accent`. |
| "New" dot | Kept, round, `accent`. |
| Field | Kept: underline only, but 1px. Label in small caps. Required mark becomes a dagger (†) in the accent. |
| Select, Date and time, File picker | Follow the field. |
| Switch, Radio | Kept; switch stays square, `accent` when on. |
| Filter buttons | Small caps text with a 1px frame; pressed fills `ink`. |
| Favorite star | Becomes a fleuron (❦) or stays a star; owner's call. |
| Page accordion | A ☞ before the summary that turns when open, instead of plus/minus. |
| List row | Title in SemiBold, meta in italic `muted`, a dotted leader to a page number at the right (like a contents page). Hover fills `plate`. |
| Bottom bar | `plate` with a double rule on top. |
| Jump to current | Kept, small caps label. |
| Scrolling title | **Dropped.** Long titles wrap. |
| Dialog | Paper inside the box frame, a fleuron above the title. |
| Toast | `plate`, boxed, italic text. |
| Drawer | `plate`, double rule on its leading edge. |
| Icon actions | Kept, but icons are rarer still; prefer a word in small caps. |
| Closing note | A centered fleuron over one italic line, in place of the 2px rule. |
| Dated list | Dates in small caps with old-style figures, a hanging column. |
| Summary list | Small caps label, dotted leader to the value. |
| Output panel, Code block | The system's monospace; the dark log becomes `plate`. |
| Ellipse, Number circle | Kept; the number circle uses Cormorant's old-style figures. |
| Activity indicators | Kept, `accent`. |
| Image | As above: plain, with an optional boxed "plate" and centered italic caption. |
| Hero | Becomes the **Masthead**: double rule, kicker in small caps, the name in Light, italic tagline, double rule. |
| Page title | Becomes the **Article opening**: kicker, title in Light, italic subtitle, byline in small caps, a fleuron. |
| Footer | Centered: a fleuron, the site name in small caps, links in a line separated by middots, a colophon line saying what it is set in. |

New pieces this theme needs: **Drop cap** (`.drop-cap`), **Ornament break** (`.ornament`), **Box** (`.box`), **Pull quote** (`.pull-quote`, italic between rules, centered), **Contents list** (`.contents`, numbered rows with dotted leaders), **Footnote** (`.footnote`, daggers and a small rule).

## Do not

- Add textures, paper grain, ink spread, sepia, or any image as decoration.
- Use bold in running text. Emphasis is italic; labels are small caps.
- Set long text in all caps, or fake small caps by shrinking capitals.
- Use a second family, load a font for code, or use Cormorant's Regular or Bold. Light only at 2.5rem and up.
- Use an ornament the font doesn't have (❧, ☙), or text under 17px.
- Put two ornaments side by side, or use one as a pattern or a background.
- Use more than one accent, or the accent for anything but initials, the hand, the primary button and the focus ring.
- Justify text, or stretch word spaces to fill a line.
- Add shadows, gradients or rounded corners. Square still.
- Hide focus rings, or let ornaments reach a screen reader.

## License

Cormorant Garamond by Christian Thalmann (Catharsis Fonts), SIL Open Font License 1.1: https://github.com/CatharsisFonts/Cormorant. Free on any site as long as `fonts/Cormorant-OFL.txt` stays with it.

## How it could live in the repo later

**Decided since:** one repository, one branch, a `fleuron/` folder beside `kit/`, and a second Netlify site built from its own folder. See [`PLAN.md`](PLAN.md). The options as first weighed:

**Option A: a second theme file sharing the components.** `kit/theme.css` splits into `base.css` (layout, behavior, the component structure) and two skins, `swiss.css` and `fleuron.css`, which set tokens, fonts, rules and the few shape changes. A site picks one with `<html data-kit="fleuron">` or by importing one file. The scripts and Astro components stay shared.

- For: one set of components, scripts and tests. A fix to the panel helps both. The axe tests run each page in both skins.
- Against: the components are tuned to Swiss Minimal's shapes (thick rules, black bars, all-caps labels). Fleuron changes enough of them (no dark bars, centered heads, dropped marquee, new drop cap and contents list) that the skin file would override a lot, and the base would have to be pulled apart carefully first. Every future component has to be designed twice.

**Option B: a separate kit, `fleuron/`, beside `kit/`.** Its own `theme.css`, `tokens.json`, `DESIGN.md` and `COMPONENTS.md`. It copies the scripts it needs (`panel.js`, `dialog.js`, …) unchanged and its own Astro components where markup differs.

- For: each kit stays simple and true to itself. Nothing in Swiss Minimal changes. Fleuron can drop or add components freely.
- Against: two copies of the scripts to keep in step (the repo already lives with one such copy, `kit/` and `demo/src/design/kit/`), and a fix has to be made twice.

**Middle path, and the recommendation:** start with B, but move the plain scripts to a shared `scripts/` folder that both kits copy from, since they carry no styling. Build Fleuron's CSS from scratch on Swiss Minimal's token names, so the two stay parallel, and only consider merging into A once both have settled and it is clear how much really is shared. The demo could gain a second site, or a theme switch on a few pages, to show both.
