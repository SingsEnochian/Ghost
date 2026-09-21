# Magic Book gifted font palette

The Magic Book may use Rowan's supplied font collection as an optional private/local skin. Font binaries are deliberately not committed to this public repository.

## Current roles

- **Hypnotic 04**: awakened title fill + outline animation. The supplied 1001Fonts FFC licence permits web/app embedding but prohibits publishing the font itself. Public source therefore references the locally installed family only.
- **Hypnotic 08**: awakened volume headings. Same private/local asset treatment.
- **Square Lily Monogram**: bookplate/seal mark. Keep the binary out of the public source tree; use locally or from a separately licensed deployment asset store.
- **Extasy**: rare ritual-display accent. The supplied readme permits use but forbids repackaging/re-release, so the public repo contains no binary.
- **Valeria Secret**: optional personal/private Luna display face only. The supplied licence is personal-use only; do not ship it in a commercial/public deployment without a separate licence.
- **Fahim Sans**: not used yet because the supplied package contains conflicting licence statements (personal-use readme vs FFC EULA).
- **Other Hypnotic variants, Wizzta, Aikakirja**: staged until their exact redistribution/embedding provenance is confirmed.

## Local use

Install the permitted fonts on the device running the Magic Book preview. `src/gifted-fonts.css` resolves them with CSS `local()` and falls back to the existing book typography when they are unavailable.

A production deployment can later provide privately hosted, properly licensed webfont assets behind the same aliases without changing the book's component grammar.
