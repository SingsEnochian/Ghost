const DEFAULTS = {
  tapMaxMs: 260,
  holdMinMs: 450,
  traceMinPx: 44,
  moveTolerancePx: 18,
  sequenceIdleMs: 760,
};

const distance = (a, b) => Math.hypot((b.x ?? 0) - (a.x ?? 0), (b.y ?? 0) - (a.y ?? 0));

export function resolveZone(event, bookElement) {
  const explicit = event?.target?.closest?.('[data-attune-zone]')?.dataset?.attuneZone;
  if (explicit) return explicit;
  if (!bookElement?.getBoundingClientRect) return 'unknown';

  const rect = bookElement.getBoundingClientRect();
  if (!rect.width || !rect.height) return 'unknown';
  const x = (event.clientX - rect.left) / rect.width;
  const y = (event.clientY - rect.top) / rect.height;
  if (x < 0 || x > 1 || y < 0 || y > 1) return 'outside';

  const left = x <= 0.13;
  const right = x >= 0.87;
  const top = y <= 0.13;
  const bottom = y >= 0.87;
  if (left && top) return 'corner_tl';
  if (right && top) return 'corner_tr';
  if (left && bottom) return 'corner_bl';
  if (right && bottom) return 'corner_br';
  if (x <= 0.055) return 'page_edge_left';
  if (x >= 0.945) return 'page_edge_right';
  if (top) return 'top_margin';
  if (bottom) return 'bottom_margin';
  if (left) return 'left_margin';
  if (right) return 'right_margin';
  if (x >= 0.475 && x <= 0.525) return 'gutter';
  return x < 0.5 ? 'left_page' : 'right_page';
}

export function normalizePointerGesture(down, up, zone, options = {}) {
  const config = { ...DEFAULTS, ...options };
  const durationMs = Math.max(0, (up.timeStamp ?? Date.now()) - (down.timeStamp ?? Date.now()));
  const travelPx = distance({ x: down.clientX, y: down.clientY }, { x: up.clientX, y: up.clientY });
  let type = 'tap';
  if (travelPx >= config.traceMinPx) type = 'trace';
  else if (durationMs >= config.holdMinMs) type = 'hold';
  else if (durationMs > config.tapMaxMs || travelPx > config.moveTolerancePx) return null;

  return {
    type,
    zone,
    at: up.timeStamp ?? Date.now(),
    durationMs,
    travelPx,
    pointerType: up.pointerType || down.pointerType || 'unknown',
    pressure: Number.isFinite(up.pressure) ? up.pressure : null,
  };
}

function stepMatches(expected, actual, previous) {
  if (!actual || expected.type !== actual.type || expected.zone !== actual.zone) return false;
  if (expected.pointerTypes?.length && !expected.pointerTypes.includes(actual.pointerType)) return false;
  if (expected.minDurationMs != null && actual.durationMs < expected.minDurationMs) return false;
  if (expected.maxDurationMs != null && actual.durationMs > expected.maxDurationMs) return false;
  if (previous && (expected.minGapMs != null || expected.maxGapMs != null)) {
    const gapMs = actual.at - previous.at;
    if (expected.minGapMs != null && gapMs < expected.minGapMs) return false;
    if (expected.maxGapMs != null && gapMs > expected.maxGapMs) return false;
  }
  return true;
}

function scopeMatches(pattern, context) {
  if (pattern.scope === 'global') return true;
  if (pattern.scope === 'volume') return !pattern.volumeId || pattern.volumeId === context.volumeId;
  if (pattern.scope === 'mode') return !pattern.mode || pattern.mode === context.mode;
  return true;
}

export function matchGestureSequence(sequence, patterns, context = {}) {
  const matches = patterns.filter((pattern) => {
    if (!scopeMatches(pattern, context) || pattern.sequence.length !== sequence.length) return false;
    return pattern.sequence.every((step, index) => stepMatches(step, sequence[index], sequence[index - 1]));
  });
  if (!matches.length) return null;
  matches.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
  return matches[0];
}

function sequenceMatchesPrefix(sequence, pattern, context = {}) {
  if (!scopeMatches(pattern, context) || pattern.sequence.length <= sequence.length) return false;
  return sequence.every((actual, index) => stepMatches(pattern.sequence[index], actual, sequence[index - 1]));
}

export function shouldFlushImmediately(sequence, patterns, context = {}) {
  const exact = matchGestureSequence(sequence, patterns, context);
  if (!exact) return false;
  return !patterns.some((pattern) => sequenceMatchesPrefix(sequence, pattern, context));
}

function emitResolution(pattern, sequence, context) {
  const resolution = {
    gestureId: pattern.id,
    label: pattern.label,
    confidence: 1,
    sensitivity: pattern.sensitivity || 'low',
    confirmBeforeExecute: Boolean(pattern.confirmBeforeExecute),
    scope: pattern.scope,
    source: context,
    sequence: sequence.map((step) => ({ ...step })),
    action: pattern.action,
    feedback: pattern.feedback || {},
  };
  if (
    typeof window !== 'undefined' &&
    typeof window.dispatchEvent === 'function' &&
    typeof CustomEvent !== 'undefined'
  ) {
    window.dispatchEvent(new CustomEvent('magic-book:gesture-resolved', { detail: resolution }));
  }
  return resolution;
}

export function createAttunementEngine({
  root,
  patterns = [],
  getContext = () => ({}),
  onResolved = () => {},
  options = {},
}) {
  if (!root?.addEventListener) {
    return {
      destroy() {},
      clear() {},
      ingest() {},
      flush() {
        return null;
      },
      getSequence: () => [],
    };
  }

  const config = { ...DEFAULTS, ...options };
  const activePointers = new Map();
  let sequence = [];
  let timer = null;

  const scheduleFlush = () => {
    clearTimeout(timer);
    timer = setTimeout(flush, config.sequenceIdleMs);
  };

  const ingest = (step) => {
    if (!step || step.zone === 'outside' || step.zone === 'unknown') return;
    sequence.push(step);
    const context = getContext() || {};
    if (shouldFlushImmediately(sequence, patterns, context)) {
      flush();
      return;
    }
    scheduleFlush();
  };

  function flush() {
    clearTimeout(timer);
    timer = null;
    if (!sequence.length) return null;
    const snapshot = sequence;
    sequence = [];
    const context = getContext() || {};
    const pattern = matchGestureSequence(snapshot, patterns, context);
    if (!pattern) return null;
    const resolution = emitResolution(pattern, snapshot, context);
    onResolved(resolution);
    return resolution;
  }

  const pointerDown = (event) => {
    const book = root.querySelector?.('.book') || root;
    activePointers.set(event.pointerId ?? 0, {
      clientX: event.clientX,
      clientY: event.clientY,
      timeStamp: event.timeStamp,
      pointerType: event.pointerType,
      pressure: event.pressure,
      zone: resolveZone(event, book),
    });
  };

  const pointerUp = (event) => {
    const id = event.pointerId ?? 0;
    const down = activePointers.get(id);
    activePointers.delete(id);
    if (!down) return;
    const book = root.querySelector?.('.book') || root;
    const zone = down.zone !== 'unknown' ? down.zone : resolveZone(event, book);
    ingest(normalizePointerGesture(down, event, zone, config));
  };

  const pointerCancel = (event) => activePointers.delete(event.pointerId ?? 0);

  root.addEventListener('pointerdown', pointerDown, { passive: true });
  root.addEventListener('pointerup', pointerUp, { passive: true });
  root.addEventListener('pointercancel', pointerCancel, { passive: true });

  return {
    destroy() {
      clearTimeout(timer);
      root.removeEventListener('pointerdown', pointerDown);
      root.removeEventListener('pointerup', pointerUp);
      root.removeEventListener('pointercancel', pointerCancel);
    },
    clear() {
      sequence = [];
      clearTimeout(timer);
      timer = null;
    },
    ingest,
    flush,
    getSequence: () => sequence.map((step) => ({ ...step })),
  };
}
