export type GesturePrimitive = 'tap' | 'hold' | 'trace';
export type GestureScope = 'global' | 'volume' | 'mode' | 'page' | 'object' | 'session';
export type Sensitivity = 'low' | 'medium' | 'high' | 'private' | 'sealed';
export type PointerKind = 'touch' | 'pen' | 'mouse' | 'unknown';

export interface GestureStepDefinition {
    type: GesturePrimitive;
    zone: string;
    minGapMs?: number;
    maxGapMs?: number;
    minDurationMs?: number;
    maxDurationMs?: number;
    pointerTypes?: PointerKind[];
}

export interface GestureAction {
    type: string;
    payload: Record<string, unknown>;
}

export interface GestureFeedback {
    visual?: string | null;
    audio?: string | null;
    haptic?: string | null;
}

export interface GestureDefinition {
    id: string;
    label: string;
    description: string;
    ownerId?: string;
    scope: GestureScope;
    volumeId?: string;
    mode?: string;
    priority: number;
    sensitivity: Sensitivity;
    confirmBeforeExecute?: boolean;
    sequence: GestureStepDefinition[];
    action: GestureAction;
    feedback: GestureFeedback;
    version?: number;
}

export interface CapturedGestureStep {
    type: GesturePrimitive;
    zone: string;
    at: number;
    durationMs: number;
    travelPx: number;
    pointerType: PointerKind;
    pressure: number | null;
}

export interface GestureContext {
    volumeId?: string;
    mode?: string;
    pageId?: string;
    profileId?: string;
}

export interface GestureResolution {
    gestureId: string;
    label: string;
    confidence: number;
    sensitivity: Sensitivity;
    confirmBeforeExecute: boolean;
    scope: GestureScope;
    source: GestureContext;
    sequence: CapturedGestureStep[];
    action: GestureAction;
    feedback: GestureFeedback;
}

export interface TapPatternRecord {
    id: string;
    ownerId: string;
    label: string;
    description: string;
    scope: GestureScope;
    enabled: boolean;
    priority: number;
    pattern: GestureStepDefinition[];
    constraints: Record<string, unknown>;
    action: GestureAction;
    feedback: GestureFeedback;
    consent: {sensitivity: Sensitivity; confirmBeforeExecute: boolean};
    version: number;
    createdAt: string;
    updatedAt: string;
}
