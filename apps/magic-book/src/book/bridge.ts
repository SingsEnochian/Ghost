export type MagicBookEventType = 'open-in-arcsweep' | 'invoke-runa' | 'trace-glyph' | 'promote-margin-note';

export interface MagicBookEventDetail {
    volumeId: string;
    payload?: Record<string, unknown>;
}

export function dispatchMagicBookEvent(type: MagicBookEventType, detail: MagicBookEventDetail) {
    window.dispatchEvent(new CustomEvent(`magic-book:${type}`, {detail}));
}
