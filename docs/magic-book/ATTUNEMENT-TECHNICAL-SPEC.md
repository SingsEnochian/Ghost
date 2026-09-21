# Codex Attunement Grammar — Technical Implementation Spec

Status: Phase 1 implementation target
Owner surface: `apps/magic-book`

## 1. Purpose

Codex Attunement Grammar turns touch rhythm into a programmable input language for Magic Book. It is a UX/personalisation layer, not a replacement for account authentication. Sensitive data still relies on real access control; cadence recognition can request or gate a UI action but cannot by itself prove identity.

## 2. Runtime pipeline

1. `PointerEvent` capture on the Magic Book root.
2. Zone resolution from explicit `data-attune-zone` targets or page geometry.
3. Normalisation into canonical primitives: `tap`, `hold`, `trace`.
4. Sequence buffering until an idle timeout closes the cadence.
5. Pattern matching against the active gesture registry.
6. Scope and sensitivity evaluation.
7. `magic-book:gesture-resolved` dispatch.
8. Action routing into Magic Book, ArcSweep, Runa, Glyph Forge, Observer, or privacy/consent surfaces.
9. Receipt display and later persistent provenance.

## 3. Phase 1 modules

- `attunement/gestures.js`: canonical cadence registry.
- `attunement/engine.js`: capture, normalisation, zone resolution and matching.
- `attunement/studio.js`: current in-book inspection surface.
- `attunement/types.ts`: canonical TypeScript contract for later workspace promotion.
- `attunement/attunement.css`: awakened-state geometry and studio visuals.

## 4. Zone model

Explicit targets win over geometry. Geometry then resolves corners, margins, gutter and left/right page. The initial vocabulary is:
`sigil_primary`, `sidenote_column`, `figure_frame`, `corner_tl`, `corner_tr`, `corner_bl`, `corner_br`, `top_margin`, `bottom_margin`, `left_margin`, `right_margin`, `gutter`, `left_page`, `right_page`.

## 5. Primitive thresholds

Defaults:

- tap <= 260 ms and <= 18 px travel
- hold >= 450 ms
- trace >= 44 px travel
- sequence closes after 760 ms idle

These are defaults, not canon. Attunement profiles may later widen thresholds for tremor, fatigue, one-handed use or personal cadence.

## 6. Matching

A candidate must match sequence length, primitive type, zone and configured timing bounds. Matching patterns are sorted by priority. Prefix conflicts are solved by waiting for the sequence idle timeout before resolution; this allows two quick bottom taps to mean Plain Pass while three slower taps can mean Calm.

## 7. Sensitivity model

`low`, `medium`, `high`, `private`, `sealed`.
Phase 1 executes ordinary actions directly. `confirmBeforeExecute` patterns emit a consent request and remain sealed. Private content is never revealed merely because a cadence matched.

## 8. Action routing

Initial action names include:

- `mode.awaken`
- `mode.plain-pass`
- `mode.write`
- `runa.enter-calm`
- `volume.open`
- `observer.show-receipts`
- `glyphforge.trace-start`
- `page.hide-ui`
- `attunement.profile-request`
- `privacy.open-private-notes`
- `privacy.lock`

External systems receive ordinary Magic Book events so the gesture engine does not become transport-coupled.

## 9. Persistence roadmap

Phase 1 keeps canonical patterns in source and receipts in-session. Phase 2 adds user-programmed patterns in local storage or the ArcSweep/Supabase profile layer. Suggested durable entities: `tap_patterns`, `tap_receipts`, `tap_profiles`.

## 10. Accessibility

Every gesture action must retain a conventional UI path. Future profiles support slower timing windows, larger spatial tolerances, reduced sequence length, low-motion feedback, haptic-first feedback and one-handed cadences.

## 11. Verification

The Magic Book smoke workflow must check syntax, registry shape, matcher behaviour, render boot and the static HTTP surface. Browser/iPad Pointer/Pencil validation remains a separate interaction gate.
