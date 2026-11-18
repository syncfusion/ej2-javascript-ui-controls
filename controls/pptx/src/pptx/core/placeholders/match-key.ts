/** Canonical scalar placeholder matching, shared with worker code. @internal */
import { DEFAULT_PLACEHOLDER_IDX } from './constants';
/**
 * @param {string} type - Defaulted placeholder type.
 * @param {number} idx - Defaulted placeholder index.
 * @returns {string} Canonical identity.
 */
export function placeholderMatchKey(type: string, idx: number): string {
    return `${type}\0${String(idx)}`;
}
/**
 * @param {string | undefined} raw - Authored index.
 * @returns {number} Existing canonical numeric/default semantics.
 */
export function parsePlaceholderIdx(raw: string | undefined): number {
    if (raw === undefined || raw.length === 0) {
        return DEFAULT_PLACEHOLDER_IDX;
    }
    if (!/^\d+$/.test(raw)) {
        // Non-numeric authored idx: treat as default for matching stability.
        return DEFAULT_PLACEHOLDER_IDX;
    }
    const n: number = Number(raw);
    if (!Number.isSafeInteger(n) || n < 0) {
        return DEFAULT_PLACEHOLDER_IDX;
    }
    return n;
}
