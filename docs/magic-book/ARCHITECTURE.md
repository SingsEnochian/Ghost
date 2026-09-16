# Magic Book architecture

## The inversion

Magic Book is not a decorative feature inside ArcSweep. It is an embodied interface that can be hosted by Ghost while ArcSweep supplies intelligence and orchestration.

```text
                 ┌──────────────────────────────┐
                 │          MAGIC BOOK          │
                 │ pages · margins · ink · time │
                 └──────────────┬───────────────┘
                                │
               bridges / receipts / intents
                                │
       ┌──────────────┬─────────┼─────────┬──────────────┐
       │              │         │         │              │
    Ghost          ArcSweep    Runa   Glyph Forge     Observer
 publishing       orchestration sound   symbols      evidence
       │              │         │         │              │
       └──────────────┴─────────┼─────────┴──────────────┘
                                │
                     specialised world state
                          (e.g. Supabase)
```

## Responsibilities

**Ghost** owns durable publishing primitives: posts, pages, authorship, tags, public/private publication, membership and the mature editing surface.

**Magic Book** owns embodied presentation and direct manipulation: spreads, page objects, margins, bookmarks, temporal navigation, writing surfaces and world-specific visual grammars.

**ArcSweep** owns cross-domain intelligence: navigation, semantic linking, caretaker/guide behaviour, canon reasoning and orchestration between book objects and services.

**Runa** owns sound and haptic state: world hums, glyph playback, scene-linked sound and receipts for embodied output.

**Glyph Forge** owns symbol form: stroke capture, romanisation, phoneme/stress information, semantics, tracing and generated variants.

**Observer / PREMAQC** owns measurement and provenance surfaces used by research volumes: receipts, evidence, definitions, observations and versioned claims.

## Canonical objects

The first canonical UI object is the volume manifest. A volume supplies identity, visual accent, capabilities, bridges and chronology. Renderers are replaceable. Data is not.

This distinction matters for TimelineJS3: it may become one renderer for chronology, but it must not become the source of truth for chronology.

## Integration rule

Every external capability enters through an adapter or bridge. Magic Book should remain runnable with those systems absent, then become richer as they connect.

This keeps the page from becoming a dependency thicket and lets the same volume travel between desktop, iPad, AR and future ArcSweep shells.

## Phase sequence

**Phase 0 — Dependency-free shell**: responsive spread, local world manifest, native temporal spine, Ghost Content API, browser-event bridges.

**Phase 1 — Workspace promotion + live content**: regenerate Ghost's pnpm lockfile, make Magic Book a first-class package, add tag-to-volume routing and preview/draft reading.

**Phase 2 — Ink**: Pointer Events / Pencil capture, SVG stroke storage, Glyph Forge trace/playback bridge, marginalia promotion receipts.

**Phase 3 — Time and objects**: TimelineJS3 renderer adapter, maps, diagrams and 3D artefact slots with lazy activation.

**Phase 4 — ArcSweep OS**: persistent bridge transport, guide/caretaker presence, semantic cross-volume navigation and Records Room links.

**Phase 5 — Embodiment**: Runa sound/haptics, world hums, AR page objects and spatial book mode.

## Design lineage

- **Tufte CSS**: long-form typography, sidenotes and integrated figures. We take the grammar, then evolve a Magic Book visual language.
- **TimelineJS3**: narrative time renderer. We preserve our own chronology model underneath it.
- **developerFolio**: project/identity presentation patterns only; no runtime coupling.
- **Ghost**: publishing engine and editor foundation.

Magic Book should feel less like an application containing documents and more like a document capable of opening applications.
