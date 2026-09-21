import { volumes } from './book/manifest.js';
import { dispatchMagicBookEvent } from './book/bridge.js';
import { ghostConfigured, loadGhostPosts } from './adapters/ghost.js';

const root = document.querySelector('#root');
let activeId = volumes[0].id;
let eventLog = [];
let posts = [];
let ghostState = ghostConfigured() ? 'loading' : 'idle';

const escapeHtml = (value) =>
  String(value).replace(
    /[&<>'"]/g,
    (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' })[char],
  );

function renderTimeline(entries) {
  return `<ol class="timeline" aria-label="Volume timeline">${entries
    .map(
      ([label, title, body]) => `
        <li class="timeline__entry"><span class="timeline__marker" aria-hidden="true">${escapeHtml(label)}</span><div><h4>${escapeHtml(title)}</h4><p>${escapeHtml(body)}</p></div></li>`,
    )
    .join('')}</ol>`;
}

function render() {
  const volume = volumes.find((item) => item.id === activeId) || volumes[0];
  root.innerHTML = `
    <main class="magic-book magic-book--${volume.mode}" style="--volume-accent:${volume.accent}">
      <header class="book-header"><div><p class="eyebrow">ArcSweep · Ghost · Runa · Glyph Forge</p><h1>Magic Book</h1></div><div class="engine-status"><span class="status-dot ${ghostConfigured() ? 'status-dot--on' : ''}"></span>Ghost ${ghostState === 'ready' ? 'connected' : ghostConfigured() ? ghostState : 'seam ready'}</div></header>
      <nav class="volume-tabs" aria-label="Magic Book volumes">${volumes.map((item) => `<button class="volume-tab ${item.id === volume.id ? 'volume-tab--active' : ''}" data-volume="${item.id}"><span>${item.sigil}</span>${escapeHtml(item.title)}</button>`).join('')}</nav>
      <section class="book" aria-label="${escapeHtml(volume.title)} open spread">
        <div class="page page--left"><div class="page-number">I</div><header class="volume-title"><span class="volume-sigil">${volume.sigil}</span><p class="kicker">${escapeHtml(volume.subtitle)}</p><h2>${escapeHtml(volume.title)}</h2></header>
          <div class="prose-with-margin"><article class="prose">${volume.opening.map((p) => `<p>${escapeHtml(p)}</p>`).join('')}<figure class="figure-card"><div class="figure-card__field">${volume.sigil}</div><figcaption>Figures, maps and artefacts may break the text column without losing their citation or provenance.</figcaption></figure></article><aside class="sidenotes">${volume.marginalia.map((note, index) => `<p><sup>${index + 1}</sup>${escapeHtml(note)}</p>`).join('')}</aside></div>
        </div>
        <div class="gutter" aria-hidden="true"></div>
        <div class="page page--right"><div class="page-number">II</div><section><p class="kicker">Living page</p><h3>What this volume can become</h3><div class="feature-grid">${volume.features.map((feature) => `<span>${escapeHtml(feature)}</span>`).join('')}</div></section>
          <section class="bridge-section"><h3>Book bridges</h3><dl class="bridge-list">${volume.bridges.map(([label, capability]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(capability)}</dd></div>`).join('')}</dl><div class="action-row"><button data-action="open-in-arcsweep">Open in ArcSweep</button><button data-action="invoke-runa">Invoke Runa</button><button data-action="trace-glyph">Trace glyph</button></div></section>
          <section><h3>Temporal spine</h3>${renderTimeline(volume.timeline)}</section>
        </div>
      </section>
      <section class="desk"><div class="desk-card"><p class="kicker">Inscribe the margin</p><textarea id="margin-note" placeholder="Write a note into this volume…"></textarea><button id="promote-note">Promote note</button></div><div class="desk-card"><p class="kicker">Ghost leaves</p>${posts.length ? `<ul class="post-list">${posts.map((post) => `<li>${escapeHtml(post.title)}</li>`).join('')}</ul>` : `<p>${ghostConfigured() ? 'The Content API seam is connected; waiting for leaves.' : 'Add Ghost Content API settings through the documented local configuration to pull real published leaves into the book.'}</p>`}</div><div class="desk-card"><p class="kicker">Bridge receipts</p>${eventLog.length ? `<ul class="event-log">${eventLog.map((event) => `<li>${escapeHtml(event)}</li>`).join('')}</ul>` : '<p>Touch a bridge. The book will emit typed-name CustomEvents for the surrounding OS.</p>'}</div></section>
    </main>`;

  root.querySelectorAll('[data-volume]').forEach((button) =>
    button.addEventListener('click', () => {
      activeId = button.dataset.volume;
      render();
    }),
  );
  root.querySelectorAll('[data-action]').forEach((button) =>
    button.addEventListener('click', () => {
      const type = button.dataset.action;
      dispatchMagicBookEvent(type, volume.id);
      eventLog = [`${type} · ${volume.title}`, ...eventLog].slice(0, 4);
      render();
    }),
  );
  root.querySelector('#promote-note').addEventListener('click', () => {
    const note = root.querySelector('#margin-note').value.trim();
    if (!note) return;
    dispatchMagicBookEvent('promote-margin-note', volume.id, { note });
    eventLog = [`margin note promoted · ${note}`, ...eventLog].slice(0, 4);
    render();
  });
}

render();

if (ghostConfigured()) {
  loadGhostPosts()
    .then((result) => {
      posts = result;
      ghostState = 'ready';
      render();
    })
    .catch(() => {
      ghostState = 'error';
      render();
    });
}
