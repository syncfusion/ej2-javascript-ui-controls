/**
 * safe-node-at.ts — Shared defensive wrapper around `doc.nodeAt(pos)`.
 *
 * ProseMirror's `nodeAt(pos)` throws `RangeError` when `pos` is outside the
 * document fragment. Several built-in commands accept user-supplied positions
 * in their payloads (range commands, structural commands). When those
 * positions are stale or out-of-bounds, the commands should no-op rather
 * than propagate the RangeError.
 *
 * @param {object} doc - The PM document root.
 * @param {number} pos - The PM integer position to resolve.
 * @returns {unknown} The PM node at that position, or null when out of bounds.
 *
 * @hidden
 */
export function safeNodeAt(doc: { content: { size: number }; nodeAt(pos: number): unknown }, pos: number): unknown {
    if (typeof pos !== 'number' || pos < 0 || pos > doc.content.size) {
        return null;
    }
    try {
        return doc.nodeAt(pos);
    } catch {
        return null;
    }
}
