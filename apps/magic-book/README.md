# Magic Book

Magic Book is the embodied reading, writing and world-navigation surface for the SingsEnochian Ghost fork.

It deliberately does **not** replace Ghost core. Ghost remains the mature publishing engine. Magic Book is a first-class app in the monorepo that can render the same underlying content as a two-page, world-aware, interactive object.

## Phase 0: working shell

This branch establishes five things:

1. A responsive two-page book surface with a Tufte-inspired long-form and sidenote grammar.
2. A `BookVolume` manifest that lets each world or research space change the book's skin, capabilities and chronology without changing the app shell.
3. A real Ghost Content API adapter. Set the two variables in `.env.example` to pull published posts into the desk.
4. A native temporal spine whose data model can later be rendered by TimelineJS3 without making TimelineJS the canonical source of chronology.
5. Typed `CustomEvent` bridges for ArcSweep, Runa and Glyph Forge.

## Run

From the repository root:

```sh
pnpm --filter @singsenochian/magic-book dev
```

To compile the shell:

```sh
pnpm --filter @singsenochian/magic-book build
```

## Bridge events

The app currently emits:

- `magic-book:open-in-arcsweep`
- `magic-book:invoke-runa`
- `magic-book:trace-glyph`
- `magic-book:promote-margin-note`

Each event carries a `volumeId` and may carry a typed payload. This is the deliberately thin waist between the book and the surrounding ArcSweep OS: neither side needs to own the other.

## Why not copy the inspiration repos directly?

Tufte CSS supplies the design grammar we want: typography, figures and sidenotes living close to the claims they qualify. TimelineJS3 supplies an excellent storytelling renderer. Magic Book keeps both ideas behind local interfaces so its records remain portable and its visual language can become our own.

`developerFolio` is treated as interface inspiration only, not a runtime dependency.

## Next build

- Replace the native timeline renderer with an optional TimelineJS3 adapter while preserving `TimelineEntry` as the canonical model.
- Add Ghost tag-to-volume routing and draft/preview support.
- Add Pencil/touch stroke capture for Glyph Forge.
- Add an ArcSweep bridge transport beyond browser events (local service or message bus).
- Add Runa sound/haptic receipts.
- Add page-object slots for maps, images, 3D artefacts and expandable diagrams.
- Add provenance metadata and promotion workflow for marginalia.

The governing rule: **knowledge should have a physical place on the page.**
