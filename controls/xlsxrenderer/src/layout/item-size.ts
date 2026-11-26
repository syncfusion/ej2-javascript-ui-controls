import { isNullOrUndefined } from '@syncfusion/ej2-base';

/**
 * Converts screen pixel measurements to PDF typographic points (96 DPI to 72 DPI).
 *
 * @param {number} px Value in pixels.
 * @returns {number} The equivalent value in typographic points.
 */
export function pxToPt(px: number): number {
    return px * 72 / 96;
}

/**
 * Memoized helper for querying and accumulating row heights and column widths.
 */
export class ItemSizeHelper {
    /** Horizontal cell scaling multiplier. */
    public scaledCellWidth: number = 1;
    /** Vertical cell scaling multiplier. */
    public scaledCellHeight: number = 1;
    /** Cache storing evaluated dimension values per index. */
    private cache: Map<number, number> = new Map();
    private getter: (index: number) => number;

    /**
     * Initializes a new instance of the `ItemSizeHelper` class.
     *
     * @param {Function} getter Callback function returning dimension in pixels for a 1-based index.
     */
    constructor(getter: (index: number) => number) {
        this.getter = getter;
    }

    /**
     * Retrieves the cached or computed size for the given row or column index.
     *
     * @param {number} index 1-based row or column index.
     * @returns {number} The dimension in pixels.
     */
    public getSize(index: number): number {
        let value: number | undefined = this.cache.get(index);
        if (isNullOrUndefined(value)) {
            value = this.getter(index);
            this.cache.set(index, value);
        }
        return value;
    }

    /**
     * Calculates the cumulative total size across a range of indices.
     *
     * @param {number} first Starting 1-based index.
     * @param {number} [last] Optional ending 1-based index (inclusive). If omitted, calculates for `first` index only.
     * @returns {number} The accumulated total dimension in pixels.
     */
    public getTotal(first: number, last?: number): number {
        const end: number = isNullOrUndefined(last) ? first : last;
        const start: number = isNullOrUndefined(last) ? 1 : first;
        let total: number = 0;
        for (let itemIndex: number = Math.max(start, 1); itemIndex <= end; itemIndex++) {
            total += this.getSize(itemIndex);
        }
        return total;
    }

    /**
     * Clears all cached dimension calculations.
     *
     * @returns {void}
     */
    public clear(): void {
        this.cache.clear();
    }
}
