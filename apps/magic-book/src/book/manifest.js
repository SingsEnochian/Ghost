export const volumes = [
    {
        id: 'terra-aeterna', title: 'Terra Aeterna', subtitle: 'Hearthweave · Third City', mode: 'world', accent: '#9fd8a9', sigil: '✦',
        opening: ['The book does not open onto a page so much as a place.', 'World text, canon, maps, artefacts and character records share one spatial grammar. Marginal notes can remain commentary, become evidence, or be promoted into canon without losing provenance.'],
        marginalia: ['Stonewood remembers.', 'Kelyran belongs in the hand as well as the mouth.', 'A footnote may become a door.'],
        features: ['Living canon', 'World maps', 'Character loci', 'Artefact lift', 'Kelyran margin glyphs'],
        bridges: [['Ghost', 'chapters, essays, canon and publication'], ['ArcSweep', 'world intelligence and orchestration'], ['Runa', 'world hum and embodied sound'], ['Glyph Forge', 'traceable Kelyran inscriptions']],
        timeline: [['I', 'Landfall', 'The world chronology can be read as narrative rather than database rows.'], ['II', 'Hearthweave', 'A timeline entry can open a scene, map state, source bundle or historical layer.'], ['III', 'Templehouse Wakes', 'Chronology is a spine. It does not dictate the shape of the page.']]
    },
    {
        id: 'luna', title: 'The Luna Who Called Down the Moon', subtitle: 'Moonmere · Windmere', mode: 'chronicle', accent: '#d9d6f2', sigil: '☾',
        opening: ['This volume favours story chronology, moon phases and character-bound lore.', 'The same engine may wear an entirely different book skin without changing how the underlying records are stored.'],
        marginalia: ['Moonwrit lives here.', 'Three moons, three clocks.', 'Narrative time is still data.'],
        features: ['Story chronology', 'Moon phase overlays', 'Character threads', 'Merewrit annotations'],
        bridges: [['Ghost', 'chapters and serial publication'], ['ArcSweep', 'canon and narrative navigation'], ['Runa', 'scene-linked sound and haptics']],
        timeline: [['☾', 'Windmere', 'Open narrative milestones beside their lore, art and revision history.'], ['◐', 'Moonmere Gate', 'A gate can be both story event and navigable interface object.'], ['●', 'Luna Law', 'Canon changes can retain their source and temporal context.']]
    },
    {
        id: 'premaqc', title: 'PREMAQC', subtitle: 'Research folio', mode: 'research', accent: '#d4b06a', sigil: '∆',
        opening: ['Research mode turns the spread into a notebook: propositions in the body, evidence and provenance in the margins, figures allowed to escape the text column.', 'The visual grammar is intentionally Tufte-like: typography first, sidenotes close to the claim they qualify, and diagrams treated as arguments rather than decoration.'],
        marginalia: ['Evidence stays beside the claim.', 'Provenance is part of the object.', 'Measurements may disagree without being erased.'],
        features: ['Sidenotes', 'Equation blocks', 'Evidence cards', 'Observer receipts', 'Versioned propositions'],
        bridges: [['Ghost', 'long-form papers and public notes'], ['ArcSweep', 'reasoning and cross-domain linking'], ['Observer', 'measurements, receipts and provenance']],
        timeline: [['S', 'Semantics', 'Concept definitions and disputed interpretations remain addressable objects.'], ['M', 'Measurement', 'Receipts and observations can be attached directly to the claim they support.'], ['P', 'Provenance', 'The book remembers where a result came from and what changed.']]
    },
    {
        id: 'glyph-forge', title: 'Glyph Forge', subtitle: 'Audible glyph folio', mode: 'glyph', accent: '#7fcbd1', sigil: '⌁',
        opening: ['In this volume, the page is not only read. It is touched.', 'A written form can be traced, sounded, compared with its phoneme and stress data, and carried back into a world volume as a living inscription.'],
        marginalia: ['Stroke is information.', 'Sound belongs to the symbol.', 'Handwriting is an interface.'],
        features: ['Pencil tracing', 'Stroke capture', 'Phoneme playback', 'Semantic binding', 'Cursive variants'],
        bridges: [['Glyph Forge', 'stroke, symbol and phoneme model'], ['Runa', 'sound and haptic response'], ['ArcSweep', 'semantic and world linkage']],
        timeline: [['1', 'Form', 'The visual rune is stored independently from any single rendering.'], ['2', 'Sound', 'Playback and phonetic metadata remain attached to the glyph.'], ['3', 'Meaning', 'Semantic meaning can differ by world, era or context without destroying ancestry.']]
    }
];
