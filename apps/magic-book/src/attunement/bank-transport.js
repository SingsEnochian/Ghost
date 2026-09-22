import { getActionSoundBindings, getSoundBindings } from './noisy.js';

const TARGET_ORIGIN_KEY = 'magic-book.action-target-origin/v1';

export function buildSoundBankCommand(packet, storage = globalThis.localStorage) {
  if (!packet || packet.schema !== 'magic-book.attunement-action/v1') return null;
  const actionType = packet.action?.type || null;
  const cueId = (actionType && getActionSoundBindings(storage)[actionType]) || packet.feedback?.audio || null;
  if (!cueId) return null;
  const binding = getSoundBindings(storage)[cueId] || null;
  return Object.freeze({
    schema: 'magic-book.sound-bank-command/v1',
    createdAt: new Date().toISOString(),
    gestureId: packet.gestureId || null,
    label: packet.label || null,
    action: packet.action || null,
    cueId,
    binding,
    context: packet.context || {},
  });
}

function targetOrigin(target) {
  try {
    return target?.localStorage?.getItem?.(TARGET_ORIGIN_KEY) || target?.location?.origin || null;
  } catch {
    return target?.location?.origin || null;
  }
}

function publish(target, command) {
  if (!command) return false;
  if (typeof target?.dispatchEvent === 'function' && typeof globalThis.CustomEvent !== 'undefined') {
    target.dispatchEvent(new CustomEvent('magic-book:sound-bank-command', { detail: command }));
  }
  const origin = targetOrigin(target);
  if (!origin) return true;
  for (const receiver of [target?.parent, target?.opener]) {
    try {
      if (receiver && receiver !== target && typeof receiver.postMessage === 'function') receiver.postMessage(command, origin);
    } catch {}
  }
  return true;
}

export function installSoundBankTransport({ target = globalThis.window, storage = globalThis.localStorage } = {}) {
  if (!target?.addEventListener) return { destroy() {}, handlePacket() {} };
  const handlePacket = (packet) => {
    const command = buildSoundBankCommand(packet, storage);
    if (command) publish(target, command);
    return command;
  };
  const listener = (event) => handlePacket(event?.detail);
  target.addEventListener('magic-book:attunement-action', listener);
  const api = {
    handlePacket,
    destroy() {
      target.removeEventListener('magic-book:attunement-action', listener);
    },
  };
  target.magicBookSoundBankTransport = api;
  return api;
}
