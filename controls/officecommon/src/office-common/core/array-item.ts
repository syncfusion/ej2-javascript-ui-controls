/**
 * Reads the element at `index` of an array without a computed member access.
 * Equivalent to `list[index]` for any integer index (`undefined` when the index is
 * outside the array). Intended for cold paths; hot loops iterate directly instead.
 *
 * @param {ReadonlyArray<T>} list - Array to read from.
 * @param {number} index - Zero-based element index.
 * @returns {T} The element, typed like an unchecked index read.
 * @private
 */
export function arrayItem<T>(list: ReadonlyArray<T>, index: number): T {
    return (index < 0 ? [] : list.slice(index, index + 1))[0];
}
