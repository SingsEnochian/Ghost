import type {BookVolume} from './types';

export const volumes: BookVolume[] = [
    {
        id: 'terra-aeterna',
        title: 'Terra Aeterna',
        subtitle: 'Hearthweave · Third City',
        mode: 'world',
        accent: '#9fd8a9',
        sigil: '✦',
        opening: [
            'The book does not open onto a page so much as a place.',
            'World text, canon, maps, artefacts and character records share one spatial grammar. Marginal notes can remain commentary, become evidence, or be promoted into canon without losing provenance.'
        ],
        marginalia: ['Stonewood remembers.', 'Kelyran belongs in the hand as well as the mouth.', 'A footnote may become a door.'],
        features: ['Living canon', 'World maps', 'Character loci', 'Artefact lift', 'Kelyran margin glyphs'],
        bridges: [
            {id: 'ghost', label: 'Ghost', capability: 'chapters, essays, canon and publication'},
            {id: 'arcsweep', label: 'ArcSweep', capability: 'world intelligence and orchestration'},
            {id: 'runa', label: 'Runa', capability: 'world hum and embodied sound'},
            {id: 'glyph-forge', label: 'Glyph Forge', capability: 'traceable Kelyran inscriptions'}
        ],
        timeline: [
            {id: 'landfall', label: 'I', title: 'Landfall', body: 'The world chronology can be read as narrative rather than database rows.'},
            {id: 'hearthweave', label: 'II', title: 'Hearthweave', body: 'A timeline entry can open a scene, map state, source bundle or historical layer.'},
            {id: 'templehouse', label: 'III', title: 'Templehouse Wakes', body: 'Chronology is a spine. It does not dictate the shape of the page.'}
        ]
    },
    {
        id: 'luna',
        title: 'The Luna Who Called Down the Moon',
        subtitle: 'Moonmere · Windmere',
        mode: 'chronicle',
        accent: '#d9d6f2',
        sigil: '☾',
        opening: [
            'This volume favours story chronology, moon phases and character-bound lore.',
            'The same engine may wear an entirely different book skin without changing how the underlying records are stored.'
        ],
        marginalia: ['Moonwrit lives here.', 'Three moons, three clocks.', 'Narrative time is still data.'],
        features: ['Story chronology', 'Moon phase overlays', 'Character threads', 'Merewrit annotations'],
        bridges: [
            {id: 'ghost', label: 'Ghost', capability: 'chapters and serial publication'},
            {id: 'arcsweep', label: 'ArcSweep', capability: 'canon and narrative navigation'},
            {id: 'runa', label: 'Runa', capability: 'scene-linked sound and haptics'}
        ],
        timeline: [
            {id: 'windmere', label: '☾', title: 'Windmere', body: 'Open narrative milestones beside their lore, art and revision history.'},
            {id: 'moonmere', label: '◐', title: 'Moonmere Gate', body: 'A gate can be both story event and navigable interface object.'},
            {id: 'luna-law', label: '●', title: 'Luna Law', body: 'Canon changes can retain their source and temporal context.'}
        ]
    },
    {
        id: 'premaqc',
        title: 'PREMAQC',
        subtitle: 'Research folio',
        mode: 'research',
        accent: '#d4b06a',
        sigil: '∆',
        opening: [
            'Research mode turns the spread into a notebook: propositions in the body, evidence and provenance in the margins, figures allowed to escape the text column.',
            'The visual grammar is intentionally Tufte-like: typography first, sidenotes close to the claim they qualify, and diagrams treated as arguments rather than decoration.'
        ],
        marginalia: ['Evidence stays beside the claim.', 'Provenance is part of the object.', 'Measurements may disagree without being erased.'],
        features: ['Sidenotes', 'Equation blocks', 'Evidence cards', 'Observer receipts', 'Versioned propositions'],
        bridges: [
            {id: 'ghost', label: 'Ghost', capability: 'long-form papers and public notes'},
            {id: 'arcsweep', label: 'ArcSweep', capability: 'reasoning and cross-domain linking'},
            {id: 'observer', label: 'Observer', capability: 'measurements, receipts and provenance'}
        ],
        timeline: [
            {id: 'semantics', label: 'S', title: 'Semantics', body: 'Concept definitions and disputed interpretations remain addressable objects.'},
            {id: 'measurement', label: 'M', title: 'Measurement', body: 'Receipts and observations can be attached directly to the claim they support.'},
            {id: 'provenance', label: 'P', title: 'Provenance', body: 'The book remembers where a result came from and what changed.'}
        ]
    },
    {
        id: 'glyph-forge',
        title: 'Glyph Forge',
        subtitle: 'Audible glyph folio',
        mode: 'glyph',
        accent: '#7fcbd1',
        sigil: '⌁',
        opening: [
            'In this volume, the page is not only read. It is touched.',
            'A written form can be traced, sounded, compared with its phoneme and stress data, and carried back into a world volume as a living inscription.'
        ],
        marginalia: ['Stroke is information.', 'Sound belongs to the symbol.', 'Handwriting is an interface.'],
        features: ['Pencil tracing', 'Stroke capture', 'Phoneme playback', 'Semantic binding', 'Cursive variants'],
        bridges: [
            {id: 'glyph-forge', label: 'Glyph Forge', capability: 'stroke, symbol and phoneme model'},
            {id: 'runa', label: 'Runa', capability: 'sound and haptic response'},
            {id: 'arcsweep', label: 'ArcSweep', capability: 'semantic and world linkage'}
        ],
        timeline: [
            {id: 'form', label: '1', title: 'Form', body: 'The visual rune is stored independently from any single rendering.'},
            {id: 'sound', label: '2', title: 'Sound', body: 'Playback and phonetic metadata remain attached to the glyph.'},
            {id: 'meaning', label: '3', title: 'Meaning', body: 'Semantic meaning can differ by world, era or context without destroying ancestry.'}
        ]
    }
];
