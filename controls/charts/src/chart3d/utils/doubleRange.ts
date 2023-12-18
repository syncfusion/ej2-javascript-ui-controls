/* eslint-disable jsdoc/require-returns */
/**
 * Numeric Range.
 *
 * @private
 */
export class DoubleRange {

    private mStart: number;

    private mEnd: number;

    /** @private */
    get start(): number {
        return this.mStart;
    }
    /** @private */
    get end(): number {
        return this.mEnd;
    }

    /** @private */
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
