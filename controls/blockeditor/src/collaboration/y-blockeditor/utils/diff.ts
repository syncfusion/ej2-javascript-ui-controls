import { SimpleDiffResult } from '../base/interface';

/**
 * Computes a single contiguous edit by finding the longest common prefix and suffix between two strings.
 * Returns the minimal delete/insert operation needed to transform the old string into the new string.
 * Suitable for typical editor typing, deletion, paste, and selection replacement operations.
 * Not intended for multiple disjoint edits.
 *
 * @param {string} oldStr - The old string
 * @param {string} newStr - The new string
 * @returns {SimpleDiffResult} Diff with index, remove, and insert properties
 * @hidden
 */
export function simpleDiff(oldStr: string, newStr: string): SimpleDiffResult {
    let prefixLen: number = 0;
    const minLen: number = Math.min(oldStr.length, newStr.length);

    while (prefixLen < minLen && oldStr[prefixLen as number] === newStr[prefixLen as number]) {
        prefixLen++;
    }

    let suffixLen: number = 0;
    const maxSuffixLen: number = minLen - prefixLen;
    while (
        suffixLen < maxSuffixLen &&
        oldStr[(oldStr.length - 1 - suffixLen) as number] === newStr[(newStr.length - 1 - suffixLen) as number]
    ) {
        suffixLen++;
    }

    return {
        index: prefixLen,
        remove: oldStr.length - prefixLen - suffixLen,
        insert: newStr.slice(prefixLen, newStr.length - suffixLen)
    };
}
