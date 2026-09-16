import {useEffect, useMemo, useState, type CSSProperties} from 'react';
import {ghostConfigured, loadGhostPosts} from '../adapters/ghost';
import {dispatchMagicBookEvent} from '../book/bridge';
import {volumes} from '../book/manifest';
import type {GhostPost} from '../book/types';
import {TimelineRail} from './TimelineRail';

export function MagicBook() {
    const [activeId, setActiveId] = useState(volumes[0].id);
    const [marginNote, setMarginNote] = useState('');
    const [eventLog, setEventLog] = useState<string[]>([]);
    const [posts, setPosts] = useState<GhostPost[]>([]);
    const [ghostState, setGhostState] = useState<'idle' | 'loading' | 'ready' | 'error'>(ghostConfigured ? 'loading' : 'idle');

    const volume = useMemo(() => volumes.find(item => item.id === activeId) ?? volumes[0], [activeId]);

    useEffect(() => {
        if (!ghostConfigured) {
            return;
        }
        loadGhostPosts()
            .then(result => {
                setPosts(result);
                setGhostState('ready');
            })
            .catch(() => setGhostState('error'));
    }, []);

    const emit = (type: 'open-in-arcsweep' | 'invoke-runa' | 'trace-glyph') => {
        dispatchMagicBookEvent(type, {volumeId: volume.id});
        setEventLog(current => [`${type} · ${volume.title}`, ...current].slice(0, 4));
    };

    const promoteMarginNote = () => {
        const note = marginNote.trim();
        if (!note) {
            return;
        }
        dispatchMagicBookEvent('promote-margin-note', {volumeId: volume.id, payload: {note}});
        setEventLog(current => [`margin note promoted · ${note}`, ...current].slice(0, 4));
        setMarginNote('');
    };

    const accentStyle = {'--volume-accent': volume.accent} as CSSProperties;

    return (
        <main className={`magic-book magic-book--${volume.mode}`} style={accentStyle}>
            <header className="book-header">
                <div>
                    <p className="eyebrow">ArcSweep · Ghost · Runa · Glyph Forge</p>
                    <h1>Magic Book</h1>
                </div>
                <div className="engine-status" aria-label="Engine status">
                    <span className={ghostConfigured ? 'status-dot status-dot--on' : 'status-dot'} />
                    Ghost {ghostState === 'ready' ? 'connected' : ghostConfigured ? ghostState : 'seam ready'}
                </div>
            </header>

            <nav className="volume-tabs" aria-label="Magic Book volumes">
                {volumes.map(item => (
                    <button
                        key={item.id}
                        className={item.id === volume.id ? 'volume-tab volume-tab--active' : 'volume-tab'}
                        onClick={() => setActiveId(item.id)}
                        type="button"
                    >
                        <span aria-hidden="true">{item.sigil}</span>
                        {item.title}
                    </button>
                ))}
            </nav>

            <section className="book" aria-label={`${volume.title} open spread`}>
                <div className="page page--left">
                    <div className="page-number">I</div>
                    <header className="volume-title">
                        <span className="volume-sigil" aria-hidden="true">{volume.sigil}</span>
                        <p className="kicker">{volume.subtitle}</p>
                        <h2>{volume.title}</h2>
                    </header>

                    <div className="prose-with-margin">
                        <article className="prose">
                            {volume.opening.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
                            <figure className="figure-card">
                                <div className="figure-card__field">{volume.sigil}</div>
                                <figcaption>Figures, maps and artefacts may break the text column without losing their citation or provenance.</figcaption>
                            </figure>
                        </article>
                        <aside className="sidenotes" aria-label="Marginalia">
                            {volume.marginalia.map((note, index) => <p key={note}><sup>{index + 1}</sup>{note}</p>)}
                        </aside>
                    </div>
                </div>

                <div className="gutter" aria-hidden="true" />

                <div className="page page--right">
                    <div className="page-number">II</div>
                    <section>
                        <p className="kicker">Living page</p>
                        <h3>What this volume can become</h3>
                        <div className="feature-grid">
                            {volume.features.map(feature => <span key={feature}>{feature}</span>)}
                        </div>
                    </section>

                    <section className="bridge-section">
                        <h3>Book bridges</h3>
                        <dl className="bridge-list">
                            {volume.bridges.map(bridge => (
                                <div key={bridge.id}>
                                    <dt>{bridge.label}</dt>
                                    <dd>{bridge.capability}</dd>
                                </div>
                            ))}
                        </dl>
                        <div className="action-row">
                            <button type="button" onClick={() => emit('open-in-arcsweep')}>Open in ArcSweep</button>
                            <button type="button" onClick={() => emit('invoke-runa')}>Invoke Runa</button>
                            <button type="button" onClick={() => emit('trace-glyph')}>Trace glyph</button>
                        </div>
                    </section>

                    <section>
                        <h3>Temporal spine</h3>
                        <TimelineRail entries={volume.timeline} />
                    </section>
                </div>
            </section>

            <section className="desk" aria-label="Book desk">
                <div className="desk-card">
                    <p className="kicker">Inscribe the margin</p>
                    <textarea value={marginNote} onChange={event => setMarginNote(event.target.value)} placeholder="Write a note into this volume…" />
                    <button type="button" onClick={promoteMarginNote}>Promote note</button>
                </div>
                <div className="desk-card">
                    <p className="kicker">Ghost leaves</p>
                    {ghostState === 'ready' && posts.length > 0 ? (
                        <ul className="post-list">{posts.map(post => <li key={post.id}>{post.title}</li>)}</ul>
                    ) : (
                        <p>{ghostConfigured ? 'The Content API seam is connected; waiting for leaves.' : 'Set VITE_GHOST_CONTENT_API_URL and VITE_GHOST_CONTENT_API_KEY to pull real Ghost posts into the book.'}</p>
                    )}
                </div>
                <div className="desk-card">
                    <p className="kicker">Bridge receipts</p>
                    {eventLog.length ? <ul className="event-log">{eventLog.map((event, index) => <li key={`${event}-${index}`}>{event}</li>)}</ul> : <p>Touch a bridge. The book will emit typed events for the surrounding OS.</p>}
                </div>
            </section>
        </main>
    );
}
