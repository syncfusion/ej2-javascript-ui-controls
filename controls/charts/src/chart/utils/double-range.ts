/**
 * The `DoubleRange` class represents a numeric range with minimum and maximum values.
 *
 * @private
 */
export class DoubleRange {

    private mStart: number;

    private mEnd: number;

    //private mIsEmpty: boolean;
    /**
     * Gets the start value.
     *
     * @returns {number} - The start value.
     * @private
     */
    get start(): number {
        return this.mStart;
    }
    /**
     * Gets the end value.
     *
     * @returns {number} - The end value.
     * @private
     */
    get end(): number {
        return this.mEnd;
    }
    /*
      get isEmpty(): boolean {
         return this.mIsEmpty;
     }*/
    /**
     * Gets the delta value.
     *
     * @returns {number} - The delta value.
     * @private
     */
    get delta(): number {
        return (this.mEnd - this.mStart);
    }

    /**
     * Gets the median value.
     *
     * @returns {number} - The median value.
     * @private
     */
    get median(): number {
        return this.mStart + (this.mEnd - this.mStart) / 2;
    }

    constructor(start: number, end: number) {
        /*
          if (!isNaN(start) && !isNaN(end)) {
           this.mIsEmpty = true;
          } else {
              this.mIsEmpty = false;
          }*/

        if (start < end) {
            this.mStart = start;
            this.mEnd = end;
        } else {
            this.mStart = end;
            this.mEnd = start;
        }
    }
}
