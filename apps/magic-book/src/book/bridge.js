export function dispatchMagicBookEvent(type, volumeId, payload = {}) {
  window.dispatchEvent(new CustomEvent(`magic-book:${type}`, { detail: { volumeId, payload } }));
}
