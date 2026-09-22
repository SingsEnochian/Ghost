const SOUND_BINDINGS_KEY = 'magic-book.sound-bindings/v1';
const ACTION_BINDINGS_KEY = 'magic-book.action-sounds/v1';
const TARGET_ORIGIN_KEY = 'magic-book.action-target-origin/v1';

const WORLD_ROOTS = Object.freeze({
  'terra-aeterna': 220,
  luna: 432,
  premaqc: 369,
  'glyph-forge': 369,
});

export const DEFAULT_SOUND_BINDINGS = Object.freeze({
  'page-whisper': Object.freeze({ kind: 'noise', durationMs: 145, gain: 0.055, filterHz: 1750, frequencyRatio: 1, velocity: 52 }),
  'soft-chime': Object.freeze({ kind: 'tones', ratios: [1.5, 2.25], durationMs: 520, gain: 0.045, waveform: 'sine', frequencyRatio: 1.5, velocity: 74 }),
  'identity-tone': Object.freeze({ kind: 'tones', ratios: [1, 1.5, 2], durationMs: 460, gain: 0.036, waveform: 'triangle', frequencyRatio: 1.5, velocity: 70 }),
  'hush-bell': Object.freeze({ kind: 'tones', ratios: [1, 2, 3], durationMs: 920, gain: 0.03, waveform: 'sine', frequencyRatio: 1, velocity: 62 }),
  'glyph-tone': Object.freeze({ kind: 'tones', ratios: [1, 1.25, 1.5], durationMs: 420, gain: 0.035, waveform: 'triangle', frequencyRatio: 1.5, velocity: 82 }),
  'confirm-tone': Object.freeze({ kind: 'tones', ratios: [1, 1.414], durationMs: 420, gain: 0.032, waveform: 'sine', frequencyRatio: 1, velocity: 68 }),
  'quill-tone': Object.freeze({ kind: 'tones', ratios: [2, 2.5], durationMs: 260, gain: 0.025, waveform: 'triangle', frequencyRatio: 2, velocity: 58 }),
  'lock-tone': Object.freeze({ kind: 'tones', ratios: [1, 0.75], durationMs: 620, gain: 0.04, waveform: 'sine', frequencyRatio: 0.75, velocity: 76 }),
});

export const DEFAULT_ACTION_SOUND_BINDINGS = Object.freeze({
  'page.previous': 'page-whisper',
  'page.next': 'page-whisper',
  'mode.awaken': 'soft-chime',
  'attunement.profile-request': 'identity-tone',
  'runa.enter-calm': 'hush-bell',
  'glyphforge.trace-start': 'glyph-tone',
  'privacy.open-private-notes': 'confirm-tone',
  'mode.write': 'quill-tone',
  'privacy.lock': 'lock-tone',
});

const HAPTICS = Object.freeze({
  'single-pulse': [24],
  'double-pulse': [26, 42, 26],
  'triple-pulse': [24, 38, 24, 38, 24],
  'slow-swell': [35, 55, 55, 55, 85],
});

function readJson(storage, key, fallback = {}) {
  try {
    const value = storage?.getItem?.(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(storage, key, value) {
  try {
    storage?.setItem?.(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function getSoundBindings(storage = globalThis.localStorage) {
  return { ...DEFAULT_SOUND_BINDINGS, ...readJson(storage, SOUND_BINDINGS_KEY) };
}

export function getActionSoundBindings(storage = globalThis.localStorage) {
  return { ...DEFAULT_ACTION_SOUND_BINDINGS, ...readJson(storage, ACTION_BINDINGS_KEY) };
}

export function setSoundBinding(cueId, binding, storage = globalThis.localStorage) {
  const custom = readJson(storage, SOUND_BINDINGS_KEY);
  custom[cueId] = { ...(custom[cueId] || {}), ...(binding || {}) };
  writeJson(storage, SOUND_BINDINGS_KEY, custom);
  return getSoundBindings(storage)[cueId];
}

export function bindActionSound(actionType, cueId, storage = globalThis.localStorage) {
  const custom = readJson(storage, ACTION_BINDINGS_KEY);
  if (cueId == null) delete custom[actionType];
  else custom[actionType] = cueId;
  writeJson(storage, ACTION_BINDINGS_KEY, custom);
  return getActionSoundBindings(storage)[actionType] || null;
}

export function resolveCueForResolution(resolution, storage = globalThis.localStorage) {
  const actionType = resolution?.action?.type;
  const actionCue = actionType ? getActionSoundBindings(storage)[actionType] : null;
  return actionCue || resolution?.feedback?.audio || null;
}

export function buildAttunementActionPacket(resolution, context = {}) {
  const volumeId = context.volumeId || resolution?.source?.volumeId || null;
  return Object.freeze({
    schema: 'magic-book.attunement-action/v1',
    type: 'magic-book:attunement-action',
    createdAt: new Date().toISOString(),
    gestureId: resolution?.gestureId || null,
    label: resolution?.label || null,
    action: resolution?.action || null,
    feedback: resolution?.feedback || {},
    context: {
      ...context,
      volumeId,
      rootHz: Number(context.rootHz) || WORLD_ROOTS[volumeId] || 369,
    },
  });
}

function safeTargetOrigin(target) {
  try {
    return target?.localStorage?.getItem?.(TARGET_ORIGIN_KEY) || target?.location?.origin || null;
  } catch {
    return target?.location?.origin || null;
  }
}

function dispatchTransport(target, packet) {
  if (!target) return;
  if (typeof target.dispatchEvent === 'function' && typeof globalThis.CustomEvent !== 'undefined') {
    target.dispatchEvent(new CustomEvent('magic-book:attunement-action', { detail: packet }));
  }

  const targetOrigin = safeTargetOrigin(target);
  if (!targetOrigin) return;
  for (const receiver of [target.parent, target.opener]) {
    try {
      if (receiver && receiver !== target && typeof receiver.postMessage === 'function') {
        receiver.postMessage(packet, targetOrigin);
      }
    } catch {}
  }
}

function createAudioRuntime(target) {
  let context = null;
  let bankAdapter = null;

  function ensureContext() {
    if (context) return context;
    const AudioContextClass = target?.AudioContext || target?.webkitAudioContext;
    if (!AudioContextClass) return null;
    context = new AudioContextClass();
    try {
      context.resume?.();
    } catch {}
    return context;
  }

  function tone(binding, rootHz) {
    const audio = ensureContext();
    if (!audio) return false;
    const now = audio.currentTime;
    const duration = Math.max(0.04, Number(binding.durationMs || 320) / 1000);
    const ratios = Array.isArray(binding.ratios) && binding.ratios.length ? binding.ratios : [binding.frequencyRatio || 1];
    for (const [index, ratio] of ratios.entries()) {
      const oscillator = audio.createOscillator();
      const gain = audio.createGain();
      oscillator.type = binding.waveform || 'sine';
      oscillator.frequency.setValueAtTime(Math.max(20, rootHz * Number(ratio || 1)), now);
      const peak = Math.max(0.001, Number(binding.gain || 0.03) / Math.max(1, ratios.length));
      const start = now + index * 0.018;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(peak, start + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      oscillator.connect(gain).connect(audio.destination);
      oscillator.start(start);
      oscillator.stop(start + duration + 0.03);
    }
    return true;
  }

  function noise(binding) {
    const audio = ensureContext();
    if (!audio?.createBufferSource) return false;
    const duration = Math.max(0.05, Number(binding.durationMs || 140) / 1000);
    const length = Math.max(1, Math.floor(audio.sampleRate * duration));
    const buffer = audio.createBuffer(1, length, audio.sampleRate);
    const data = buffer.getChannelData(0);
    for (let index = 0; index < data.length; index += 1) data[index] = (Math.random() * 2 - 1) * (1 - index / data.length);
    const source = audio.createBufferSource();
    const gain = audio.createGain();
    gain.gain.value = Number(binding.gain || 0.05);
    source.buffer = buffer;
    if (audio.createBiquadFilter) {
      const filter = audio.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = Number(binding.filterHz || 1800);
      source.connect(filter).connect(gain).connect(audio.destination);
    } else source.connect(gain).connect(audio.destination);
    source.start();
    return true;
  }

  async function playCue(cueId, { resolution, rootHz = 369, storage = target?.localStorage } = {}) {
    if (!cueId) return false;
    const binding = getSoundBindings(storage)[cueId] || DEFAULT_SOUND_BINDINGS[cueId];
    if (!binding) return false;

    if (bankAdapter?.playCue) {
      try {
        const handled = await bankAdapter.playCue({ cueId, binding, rootHz, resolution });
        if (handled !== false) return true;
      } catch {}
    }

    return binding.kind === 'noise' ? noise(binding) : tone(binding, rootHz);
  }

  function playHaptic(name) {
    const pattern = HAPTICS[name];
    if (!pattern) return false;
    try {
      return Boolean(target?.navigator?.vibrate?.(pattern));
    } catch {
      return false;
    }
  }

  return {
    playCue,
    playHaptic,
    registerBankAdapter(adapter) {
      bankAdapter = adapter || null;
      return bankAdapter;
    },
    getBankAdapter: () => bankAdapter,
  };
}

export function createNoisyAttunement({ target = globalThis.window, storage = globalThis.localStorage } = {}) {
  if (!target?.addEventListener) {
    return { destroy() {}, handleResolution() {}, registerBankAdapter() {}, playCue() {} };
  }

  const audio = createAudioRuntime(target);

  const handleResolution = (resolution) => {
    if (!resolution) return null;
    const volumeId = resolution?.source?.volumeId || null;
    const rootHz = WORLD_ROOTS[volumeId] || 369;
    const cueId = resolveCueForResolution(resolution, storage);
    if (cueId) audio.playCue(cueId, { resolution, rootHz, storage });
    if (resolution?.feedback?.haptic) audio.playHaptic(resolution.feedback.haptic);
    const packet = buildAttunementActionPacket(resolution, { volumeId, rootHz });
    dispatchTransport(target, packet);
    return packet;
  };

  const listener = (event) => handleResolution(event?.detail);
  target.addEventListener('magic-book:gesture-resolved', listener);

  const api = {
    handleResolution,
    playCue: audio.playCue,
    registerBankAdapter: audio.registerBankAdapter,
    getBankAdapter: audio.getBankAdapter,
    getSoundBindings: () => getSoundBindings(storage),
    getActionSoundBindings: () => getActionSoundBindings(storage),
    setSoundBinding: (cueId, binding) => setSoundBinding(cueId, binding, storage),
    bindActionSound: (actionType, cueId) => bindActionSound(actionType, cueId, storage),
    destroy() {
      target.removeEventListener('magic-book:gesture-resolved', listener);
    },
  };

  target.magicBookSound = api;
  return api;
}
