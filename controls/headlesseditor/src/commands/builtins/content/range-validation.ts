/**
 * range-validation.ts — Shared payload-bounds validation for the
 * document-range commands (`deleteRange`).
 *
 * Positions are document-relative integers in the same coordinate space as
 * `setSelection` and `editor.getSelection()`. Ranges are validated against
 * the current document size before any transaction is built.
 *
 * PM boundary: allowed inside src/commands/builtins/.
 */
import { PMEditorState } from '../../../pm/pm-guard';

/**
 * Validate a document-position range payload against the current document.
 *
 * Checks:
 * - payload exists
 * - `from` and `to` are integers
 * - `from >= 0` and `to <= doc.content.size` (in-bounds)
 * - `from <= to` (proper order; `from === to` is a collapsed range — valid)
 *
 * @param {*} payload - Raw payload from the facade (may be malformed).
 * @param {PMEditorState} pmState - Current PM state snapshot.
 * @returns {boolean} `true` when the range is safe to apply; `false` otherwise.
 */
export function isValidRangePayload(payload: unknown, pmState: PMEditorState): boolean {
    if (payload === null || typeof payload !== 'object') {
        return false;
    }
    const range: { from?: unknown; to?: unknown } = payload as { from?: unknown; to?: unknown };
    if (!Number.isInteger(range.from) || !Number.isInteger(range.to)) {
        return false;
    }
    const from: number = range.from as number;
    const to: number = range.to as number;
    return from >= 0 && to <= pmState.doc.content.size && from <= to;
}
