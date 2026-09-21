import {volumes} from './book/manifest.js';
import {dispatchMagicBookEvent} from './book/bridge.js';
import {ghostConfigured, loadGhostPosts} from './adapters/ghost.js';
import {canonicalGestures} from './attunement/gestures.js';
import {createAttunementEngine} from './attunement/engine.js';
import {renderAttunementStudio} from './attunement/studio.js';

const root = document.querySelector('#root');
let activeId = volumes[0].id;
let eventLog = [];
let posts = [];
let ghostState = ghostConfigured() ? 'loading' : 'idle';
let bookMode = 'dormant';
let attunementStatus = 'Listening';
let pendingConfirmation = null;

const escapeHtml = value => String(value).replace(/[&<>'"]/g, char => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;'}[char]));

function renderTimeline(entries) {
    return `<ol class="timeline" aria-label="Volume timeline">${entries.map(([label, title, body]) => `
        <li class="timeline__entry"><span class="timeline__marker" aria-hidden="true">${escapeHtml(label)}</span><div><h4>${escapeHtml(title)}</h4><p>${escapeHtml(body)}</p></div></li>`).join('')}</ol>`;
}

function setDocumentMode(mode) {
    bookMode = mode;
    if (document?.body?.dataset) document.body.dataset.bookMode = mode;
}

function addReceipt(message) {
    eventLog = [message, ...eventLog].slice(0, 6);
}

function executeAttunement(resolution) {
    const {type, payload = {}} = resolution.action;
    if (resolution.confirmBeforeExecute) {
        pendingConfirmation = resolution;
        attunementStatus = `${resolution.label} · confirmation requested`;
        dispatchMagicBookEvent('consent-request', activeId, {gestureId: resolution.gestureId, action: type});
        addReceipt(`consent requested · ${resolution.label}`);
        render();
        return;
    }

    pendingConfirmation = null;
    attunementStatus = resolution.label;

    switch (type) {
    case 'mode.awaken':
        setDocumentMode('awakened');
        break;
    case 'mode.plain-pass':
        setDocumentMode('plain');
        break;
    case 'runa.enter-calm':
        setDocumentMode('calm');
        dispatchMagicBookEvent('runa-enter-calm', activeId, payload);
        break;
    case 'volume.open':
        if (volumes.some(volume => volume.id === payload.volumeId)) activeId = payload.volumeId;
        break;
    case 'glyphforge.trace-start':
        activeId = payload.volumeId || 'glyph-forge';
        dispatchMagicBookEvent('glyphforge-trace-start', activeId, payload);
        break;
    case 'observer.show-receipts':
        dispatchMagicBookEvent('observer-show-receipts', activeId, payload);
        break;
    case 'page.hide-ui':
        setDocumentMode('dormant');
        break;
    case 'mode.write':
        setDocumentMode('write');
        dispatchMagicBookEvent('mode-write', activeId, payload);
        break;
    case 'privacy.lock':
        setDocumentMode('locked');
        dispatchMagicBookEvent('privacy-lock', activeId, payload);
        break;
    case 'attunement.profile-request':
        dispatchMagicBookEvent('attunement-profile-request', activeId, payload);
        break;
    default:
        dispatchMagicBookEvent(type.replaceAll('.', '-'), activeId, payload);
    }

    addReceipt(`attunement · ${resolution.label}`);
    render();
}

function render() {
    const volume = volumes.find(item => item.id === activeId) || volumes[0];
    root.innerHTML = `
    <main class="magic-book magic-book--${volume.mode} magic-book--state-${bookMode}" style="--volume-accent:${volume.accent}">
      <header class="book-header"><div><p class="eyebrow">ArcSweep · Ghost · Runa · Glyph Forge</p><h1>Magic Book</h1></div><div class="engine-status"><span class="status-dot ${ghostConfigured() ? 'status-dot--on' : ''}"></span>Ghost ${ghostState === 'ready' ? 'connected' : ghostConfigured() ? ghostState : 'seam ready'} · ${escapeHtml(bookMode)}</div></header>
      <nav class="volume-tabs" aria-label="Magic Book volumes">${volumes.map(item => `<button class="volume-tab ${item.id === volume.id ? 'volume-tab--active' : ''}" data-volume="${item.id}"><span>${item.sigil}</span>${escapeHtml(item.title)}</button>`).join('')}</nav>
      <section class="book" aria-label="${escapeHtml(volume.title)} open spread">
        <div class="attunement-orbits" aria-hidden="true"><span></span><span></span><span></span></div>
        <div class="page page--left"><div class="page-number">I</div><header class="volume-title"><span class="volume-sigil" data-attune-zone="sigil_primary">${volume.sigil}</span><p class="kicker">${escapeHtml(volume.subtitle)}</p><h2>${escapeHtml(volume.title)}</h2></header>
          <div class="prose-with-margin"><article class="prose">${volume.opening.map(p => `<p>${escapeHtml(p)}</p>`).join('')}<figure class="figure-card" data-attune-zone="figure_frame"><div class="figure-card__field">${volume.sigil}</div><figcaption>Figures, maps and artefacts may break the text column without losing their citation or provenance.</figcaption></figure></article><aside class="sidenotes" data-attune-zone="sidenote_column">${volume.marginalia.map((note, index) => `<p><sup>${index + 1}</sup>${escapeHtml(note)}</p>`).join('')}</aside></div>
        </div>
        <div class="gutter" data-attune-zone="gutter" aria-hidden="true"></div>
        <div class="page page--right"><div class="page-number">II</div><section><p class="kicker">Living page</p><h3>What this volume can become</h3><div class="feature-grid">${volume.features.map(feature => `<span>${escapeHtml(feature)}</span>`).join('')}</div></section>
          <section class="bridge-section"><h3>Book bridges</h3><dl class="bridge-list">${volume.bridges.map(([label, capability]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(capability)}</dd></div>`).join('')}</dl><div class="action-row"><button data-action="open-in-arcsweep">Open in ArcSweep</button><button data-action="invoke-runa">Invoke Runa</button><button data-action="trace-glyph">Trace glyph</button></div></section>
          <section><h3>Temporal spine</h3>${renderTimeline(volume.timeline)}</section>
        </div>
      </section>
      ${pendingConfirmation ? `<section class="consent-strip"><strong>${escapeHtml(pendingConfirmation.label)}</strong><span>This cadence requested a protected action. The foundation emits a consent request but does not reveal private content.</span><button id="cancel-confirmation">Keep sealed</button></section>` : ''}
      <section class="desk"><div class="desk-card"><p class="kicker">Inscribe the margin</p><textarea id="margin-note" placeholder="Write a note into this volume…"></textarea><button id="promote-note">Promote note</button></div><div class="desk-card"><p class="kicker">Ghost leaves</p>${posts.length ? `<ul class="post-list">${posts.map(post => `<li>${escapeHtml(post.title)}</li>`).join('')}</ul>` : `<p>${ghostConfigured() ? 'The Content API seam is connected; waiting for leaves.' : 'Add Ghost Content API settings through the documented local configuration to pull real published leaves into the book.'}</p>`}</div><div class="desk-card"><p class="kicker">Bridge receipts</p>${eventLog.length ? `<ul class="event-log">${eventLog.map(event => `<li>${escapeHtml(event)}</li>`).join('')}</ul>` : '<p>Touch a bridge or perform an attunement cadence. Receipts appear here.</p>'}</div><div class="desk-card">${renderAttunementStudio(canonicalGestures, attunementStatus)}</div></section>
    </main>`;

    root.querySelectorAll('[data-volume]').forEach(button => button.addEventListener('click', () => { activeId = button.dataset.volume; render(); }));
    root.querySelectorAll('[data-action]').forEach(button => button.addEventListener('click', () => {
        const type = button.dataset.action;
        dispatchMagicBookEvent(type, volume.id);
        addReceipt(`${type} · ${volume.title}`);
        render();
    }));
    root.querySelector('#promote-note').addEventListener('click', () => {
        const note = root.querySelector('#margin-note').value.trim();
        if (!note) return;
        dispatchMagicBookEvent('promote-margin-note', volume.id, {note});
        addReceipt(`margin note promoted · ${note}`);
        render();
    });
    root.querySelector('#cancel-confirmation')?.addEventListener?.('click', () => {
        addReceipt(`kept sealed · ${pendingConfirmation?.label || 'protected action'}`);
        pendingConfirmation = null;
        attunementStatus = 'Listening';
        render();
    });
}

render();

const attunementEngine = createAttunementEngine({
    root,
    patterns: canonicalGestures,
    getContext: () => ({volumeId: activeId, mode: bookMode}),
    onResolved: executeAttunement
});

if (typeof window !== 'undefined') window.magicBookAttunement = attunementEngine;

if (ghostConfigured()) {
    loadGhostPosts().then(result => { posts = result; ghostState = 'ready'; render(); }).catch(() => { ghostState = 'error'; render(); });
}
