# Magic Book

Magic Book is the embodied reading, writing and world-navigation surface being assembled beside the SingsEnochian Ghost fork.

Phase 0 established a dependency-free browser shell. Phase 1 adds the Codex Attunement Grammar: the page itself is the primary control surface.

## Run

```sh
python3 -m http.server 4173 --directory apps/magic-book
```

Then open `http://localhost:4173`.

No install step is required.

## Tap-first interaction

The visible book face is tap-specific. Tap the extreme left or right page edge to move backward or forward. Other actions use margins, corners, sigils, holds and traces from the canonical attunement registry.

Conventional page/volume controls remain only as keyboard and screen-reader fallbacks and are visually hidden until focused.

Current examples include:

- outer left/right edge tap: page back / page forward
- tap, tap, hold primary sigil: wake the book
- two quick bottom-margin taps: Plain Pass
- three slow bottom-margin taps: calm mode
- hold sidenotes: Observer receipts
- trace primary sigil: Glyph Forge
- hold sigil + upper-right cadence: protected private-note request

## Gifted type palette

`src/gifted-fonts.css` provides local/private font hooks for the supplied Hypnotic, Square Lily, Extasy and Valeria Secret faces. The public repository does not contain the font binaries. See `docs/magic-book/FONT_ASSETS.md` for provenance and deployment notes.

Hypnotic 04 drives awakened title fill/outline animation; Hypnotic 08 can take awakened volume headings; Square Lily supplies the bookplate/seal layer. Valeria Secret is restricted to a personal/private Luna skin unless separately licensed.

## Connect Ghost content

For this prototype, keep credentials out of source control. Set the Content API URL/key in browser local storage:

```js
localStorage.setItem('magic-book:ghost-url', 'http://localhost:2368');
localStorage.setItem('magic-book:ghost-key', 'YOUR_CONTENT_API_KEY');
location.reload();
```

## Architecture intent

Ghost remains the publishing engine. Magic Book owns embodied presentation. ArcSweep remains the orchestration/intelligence layer. Runa supplies sound/haptic state. Glyph Forge supplies traceable symbolic writing. Observer/PREMAQC supply evidence and provenance.

External capabilities enter behind adapters or browser events so the book remains runnable when those systems are absent.

The governing rule: **knowledge should have a physical place on the page, and the page should be the control surface.**
