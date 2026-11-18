/**
 * Ascending / descending comparer compatible with former DataUtil.fnSort usage.
 *
 * @hidden
 * @param {string} order - 'Ascending' or 'Descending' (empty defaults to ascending numeric compare).
 * @returns {Function} - Comparer (a, b) => number.
 */
export function createSortComparer(order?: string): (a: Object, b: Object) => number {
    const descending: boolean = order === 'Descending';
    return (a: Object, b: Object): number => {
        if (a === b) {
            return 0;
        }
        if (a === null || a === undefined) {
            return 1;
        }
        if (b === null || b === undefined) {
            return -1;
        }
        let result: number = 0;
        if (typeof a === 'string') {
            result = a.localeCompare(b as string);
        } else if (a > b) {
            result = 1;
        } else if (a < b) {
            result = -1;
        }
        return descending ? -result : result;
    };
}

/**
 * Sort a collection with an optional order string.
 *
 * @template T
 * @param {T[]} collection - Items to sort.
 * @param {string} order - 'Ascending' or 'Descending'.
 * @returns {T[]} - Sorted shallow copy.
 */
export function sortCollection<T>(collection: T[], order?: string): T[] {
    const comparer: (a: Object, b: Object) => number = createSortComparer(order);
    return collection.slice().sort(comparer as (a: T, b: T) => number);
}
