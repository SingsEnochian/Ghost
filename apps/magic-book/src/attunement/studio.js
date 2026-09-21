const escapeHtml = (value) =>
  String(value).replace(
    /[&<>'"]/g,
    (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' })[char],
  );

export function renderAttunementStudio(patterns, status = 'Listening') {
  const rows = patterns
    .map(
      (pattern) =>
        `<li><strong>${escapeHtml(pattern.label)}</strong><span>${escapeHtml(pattern.description)}</span></li>`,
    )
    .join('');
  return `
        <div class="attunement-studio" aria-label="Attunement Studio">
            <div class="attunement-status"><span class="attunement-pulse" aria-hidden="true"></span><div><span>Attunement Studio</span><strong>${escapeHtml(status)}</strong></div></div>
            <p>Tap directly on the open book. The current foundation recognises taps, holds and traces and resolves them against the canonical cadence registry.</p>
            <details><summary>Canonical cadences · ${patterns.length}</summary><ol class="attunement-list">${rows}</ol></details>
        </div>`;
}
