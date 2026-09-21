# Magic Book — Canonical Attunement Cadences v1

The source of truth for executable definitions is `apps/magic-book/src/attunement/gestures.js`.

1. **Wake Book** — tap, tap, hold the primary sigil → `mode.awaken`.
2. **Signature Attunement** — left margin, sigil, right margin → `attunement.profile-request`.
3. **Plain Pass** — two quick taps on bottom margin → `mode.plain-pass`.
4. **Calm the Page** — three slow taps on bottom margin → `runa.enter-calm`.
5. **Open Terra Aeterna** — left margin, left margin, lower-left corner → `volume.open(terra-aeterna)`.
6. **Open Luna** — right margin, right margin, lower-right corner → `volume.open(luna)`.
7. **Show Receipts** — hold sidenote column → `observer.show-receipts`.
8. **Enter Glyph Forge** — trace across primary sigil → `glyphforge.trace-start`.
9. **Hide Awakened UI** — two quick taps on top margin → `page.hide-ui`.
10. **Private Notes Request** — hold sigil, upper-right corner, upper-right corner → protected `privacy.open-private-notes` request.
11. **Writing Invocation** — tap, hold, tap the figure frame → `mode.write`.
12. **Lock Book** — hold top margin, then hold bottom margin → `privacy.lock`.

Cadences are intentionally editable. Canon defines meaning and initial defaults, not immutable timing. Personal profiles may tune tolerances without changing the semantic action.
