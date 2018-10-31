

/**
 * Numeric Range.
 * @private
 */
export class DoubleRange {

    private mStart: number;

    private mEnd: number;

    //private mIsEmpty: boolean;
    /** @private */
    get start(): number {
        return this.mStart;
    }
    /** @private */
    get end(): number {
        return this.mEnd;
    }
    /*
      get isEmpty(): boolean {
         return this.mIsEmpty;
     }*/
    /** @private */
    get delta(): number {
        return (this.mEnd - this.mStart);
    }

    /** @private */
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