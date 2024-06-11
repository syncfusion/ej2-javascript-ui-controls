/**
 * Numeric Range.
 *
 * @private
 */
export class DoubleRange {

    private mStart: number;

    private mEnd: number;

    /**
     * The start value.
     *
     * @private
     * @returns {number} - The start value.
     */
    get start(): number {
        return this.mStart;
    }
    /**
     * The end value.
     *
     * @private
     * @returns {number} - The end value.
     */
    get end(): number {
        return this.mEnd;
    }
    /**
     * The delta between the start and end values.
     *
     * @private
     * @returns {number} - The delta value.
     */
    get delta(): number {
        return (this.mEnd - this.mStart);
    }

    constructor(start: number, end: number) {

        if (start < end) {
            this.mStart = start;
            this.mEnd = end;
        } else {
            this.mStart = end;
            this.mEnd = start;
        }
    }
}
