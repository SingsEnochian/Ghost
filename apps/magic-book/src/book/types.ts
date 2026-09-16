export type BookMode = 'world' | 'research' | 'glyph' | 'chronicle';

export interface TimelineEntry {
    id: string;
    label: string;
    title: string;
    body: string;
}

export interface BookBridge {
    id: 'ghost' | 'arcsweep' | 'runa' | 'glyph-forge' | 'observer';
    label: string;
    capability: string;
}

export interface BookVolume {
    id: string;
    title: string;
    subtitle: string;
    mode: BookMode;
    accent: string;
    sigil: string;
    opening: string[];
    marginalia: string[];
    features: string[];
    bridges: BookBridge[];
    timeline: TimelineEntry[];
}

export interface GhostPost {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    html?: string;
    publishedAt?: string;
}
