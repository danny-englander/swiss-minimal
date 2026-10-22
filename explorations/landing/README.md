# Verdigris: landing page mockup

*An exploration, not the site.* What verdigris.ch could be: one page that explains the project and redraws itself in whichever kit you choose. It opens in Swiss Minimal with the verdigris accent, the project's namesake, and the name runs edge to edge in Swiss Minimal, centered in Cormorant Light in Fleuron.

Open [`index.html`](index.html) through a local server, so it can reach Fleuron's fonts in `../mcsweeneys/fonts/`: the `explorations-network` entry in `.claude/launch.json` serves the whole `explorations/` folder on port 4401, at `/landing/index.html`.

## The idea

- **The page is the demo.** The control bar along the bottom picks the kit (Swiss Minimal or Fleuron), the theme (light or dark) and the accent (each kit's own two). The whole page redraws in place: type, rules, color, buttons, form fields, the hero art. Swiss Minimal draws a flat composition in its accent; Fleuron draws a fleuron in the same place.
- **The address remembers it.** `?kit=fleuron&theme=dark&accent=prussian` opens the page that way, so a look can be shared as a link.
- **The specimen** shows the components both kits share, in one markup, drawn by the chosen kit. Each kit's own pieces (Fleuron's masthead, drop cap, contents list) live in its full demo, linked from the list of kits.
- **The agent prompt** at the end is written from your choices: which kit to copy, which docs to read first, which accent to set, and the tests to run. Copy it into any agent that can read a repository. It is the start of the workflow the whole project is about.
- **No React, and no framework in the kits.** The controls are a short plain script, like the kits' own.

## How the mockup is built, and how the real page differs

The mockup holds both kits' CSS in one file, scoped by `data-kit` on `<html>`, with the tokens of both filling the same names. It is a sketch: the real landing page loads each kit's own `theme.css` and turns all but one off, so nothing is written twice (see "One site, one domain" in [`../mcsweeneys/PLAN.md`](../mcsweeneys/PLAN.md)).

Switching never animates: colors snap to the new kit at once, and hover fades come back right after.

## Checked

- axe (WCAG 2.1 AA) on every combination of kit, theme and accent, eight in all, at 375px and 1280px: no problems.
- No sideways scroll at 375px or 1280px, with the control bar open or folded.

## Mockup only

- Links point at the repository's current name (`swiss-minimal`); they become `verdigris` after the rename.
- The prompt names `fleuron/kit/` and `fleuron/DESIGN.md`, which exist only in the plan so far.
- The Fleuron "Site" link opens the Fleuron mockup next door.
- Swiss Minimal's fonts are copied into `fonts/` here so the page stands alone.
