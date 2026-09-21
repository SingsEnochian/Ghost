export const canonicalGestures = [
    {
        id: 'wake-book-v1',
        label: 'Wake Book',
        description: 'Tap, tap, then hold the primary sigil.',
        scope: 'global',
        priority: 100,
        sensitivity: 'low',
        sequence: [
            {type: 'tap', zone: 'sigil_primary'},
            {type: 'tap', zone: 'sigil_primary', maxGapMs: 520},
            {type: 'hold', zone: 'sigil_primary', maxGapMs: 720}
        ],
        action: {type: 'mode.awaken', payload: {}},
        feedback: {visual: 'orbital-wake', audio: 'soft-chime', haptic: 'double-pulse'}
    },
    {
        id: 'signature-attunement-v1',
        label: 'Signature Attunement',
        description: 'Left margin, primary sigil, right margin. A programmable profile-binding cadence.',
        scope: 'global',
        priority: 95,
        sensitivity: 'medium',
        sequence: [
            {type: 'tap', zone: 'left_margin'},
            {type: 'tap', zone: 'sigil_primary', maxGapMs: 900},
            {type: 'tap', zone: 'right_margin', maxGapMs: 900}
        ],
        action: {type: 'attunement.profile-request', payload: {}},
        feedback: {visual: 'sigil-thread', audio: 'identity-tone', haptic: 'single-pulse'}
    },
    {
        id: 'plain-pass-v1',
        label: 'Plain Pass',
        description: 'Two quick taps on the bottom margin.',
        scope: 'global',
        priority: 90,
        sensitivity: 'low',
        sequence: [
            {type: 'tap', zone: 'bottom_margin'},
            {type: 'tap', zone: 'bottom_margin', maxGapMs: 320}
        ],
        action: {type: 'mode.plain-pass', payload: {}},
        feedback: {visual: 'geometry-fade', audio: null, haptic: 'single-pulse'}
    },
    {
        id: 'calm-page-v1',
        label: 'Calm the Page',
        description: 'Three slow taps on the bottom margin.',
        scope: 'global',
        priority: 92,
        sensitivity: 'low',
        sequence: [
            {type: 'tap', zone: 'bottom_margin'},
            {type: 'tap', zone: 'bottom_margin', minGapMs: 330, maxGapMs: 1200},
            {type: 'tap', zone: 'bottom_margin', minGapMs: 330, maxGapMs: 1200}
        ],
        action: {type: 'runa.enter-calm', payload: {motion: 'reduced', brightness: 'dim'}},
        feedback: {visual: 'ink-soften', audio: 'hush-bell', haptic: 'slow-swell'}
    },
    {
        id: 'open-terra-v1',
        label: 'Open Terra Aeterna',
        description: 'Two left-margin taps followed by the lower-left corner.',
        scope: 'global',
        priority: 80,
        sensitivity: 'low',
        sequence: [
            {type: 'tap', zone: 'left_margin'},
            {type: 'tap', zone: 'left_margin', maxGapMs: 520},
            {type: 'tap', zone: 'corner_bl', maxGapMs: 700}
        ],
        action: {type: 'volume.open', payload: {volumeId: 'terra-aeterna'}},
        feedback: {visual: 'left-page-bloom', audio: 'page-whisper', haptic: 'double-pulse'}
    },
    {
        id: 'open-luna-v1',
        label: 'Open Luna',
        description: 'Two right-margin taps followed by the lower-right corner.',
        scope: 'global',
        priority: 80,
        sensitivity: 'low',
        sequence: [
            {type: 'tap', zone: 'right_margin'},
            {type: 'tap', zone: 'right_margin', maxGapMs: 520},
            {type: 'tap', zone: 'corner_br', maxGapMs: 700}
        ],
        action: {type: 'volume.open', payload: {volumeId: 'luna'}},
        feedback: {visual: 'right-page-bloom', audio: 'page-whisper', haptic: 'double-pulse'}
    },
    {
        id: 'show-receipts-v1',
        label: 'Show Receipts',
        description: 'Hold the sidenote column.',
        scope: 'global',
        priority: 75,
        sensitivity: 'low',
        sequence: [{type: 'hold', zone: 'sidenote_column'}],
        action: {type: 'observer.show-receipts', payload: {}},
        feedback: {visual: 'margin-reveal', audio: null, haptic: 'single-pulse'}
    },
    {
        id: 'glyph-forge-v1',
        label: 'Enter Glyph Forge',
        description: 'Trace across the primary sigil.',
        scope: 'global',
        priority: 78,
        sensitivity: 'low',
        sequence: [{type: 'trace', zone: 'sigil_primary'}],
        action: {type: 'glyphforge.trace-start', payload: {volumeId: 'glyph-forge'}},
        feedback: {visual: 'glyph-ignite', audio: 'glyph-tone', haptic: 'single-pulse'}
    },
    {
        id: 'hide-awakened-ui-v1',
        label: 'Hide Awakened UI',
        description: 'Two quick taps on the top margin.',
        scope: 'global',
        priority: 85,
        sensitivity: 'low',
        sequence: [
            {type: 'tap', zone: 'top_margin'},
            {type: 'tap', zone: 'top_margin', maxGapMs: 300}
        ],
        action: {type: 'page.hide-ui', payload: {}},
        feedback: {visual: 'geometry-fade', audio: null, haptic: 'single-pulse'}
    },
    {
        id: 'private-notes-v1',
        label: 'Private Notes Request',
        description: 'Hold the primary sigil, then tap the upper-right corner twice.',
        scope: 'global',
        priority: 110,
        sensitivity: 'private',
        confirmBeforeExecute: true,
        sequence: [
            {type: 'hold', zone: 'sigil_primary'},
            {type: 'tap', zone: 'corner_tr', maxGapMs: 900},
            {type: 'tap', zone: 'corner_tr', maxGapMs: 520}
        ],
        action: {type: 'privacy.open-private-notes', payload: {}},
        feedback: {visual: 'sealed-sigil', audio: 'confirm-tone', haptic: 'triple-pulse'}
    },
    {
        id: 'writing-invocation-v1',
        label: 'Writing Invocation',
        description: 'Tap, hold, tap the figure frame.',
        scope: 'global',
        priority: 70,
        sensitivity: 'low',
        sequence: [
            {type: 'tap', zone: 'figure_frame'},
            {type: 'hold', zone: 'figure_frame', maxGapMs: 650},
            {type: 'tap', zone: 'figure_frame', maxGapMs: 650}
        ],
        action: {type: 'mode.write', payload: {}},
        feedback: {visual: 'ink-ready', audio: 'quill-tone', haptic: 'single-pulse'}
    },
    {
        id: 'lock-book-v1',
        label: 'Lock Book',
        description: 'Hold the top margin, then hold the bottom margin.',
        scope: 'global',
        priority: 120,
        sensitivity: 'medium',
        sequence: [
            {type: 'hold', zone: 'top_margin'},
            {type: 'hold', zone: 'bottom_margin', maxGapMs: 1400}
        ],
        action: {type: 'privacy.lock', payload: {}},
        feedback: {visual: 'book-seal', audio: 'lock-tone', haptic: 'double-pulse'}
    }
];
