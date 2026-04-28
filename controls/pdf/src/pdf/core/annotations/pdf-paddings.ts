
/**
 * Represents padding values for left, top, right and bottom with default or specified measurements.
 *
 * @private
 */
export class _PdfPaddings {
    /**
     * Specifies the left padding value.
     *
     * @private
     */
    _left: number = 0;
    /**
     * Specifies the right padding value.
     *
     * @private
     */
    _right: number = 0;
    /**
     * Specifies the top padding value.
     *
     * @private
     */
    _top: number = 0;
    /**
     * Specifies the bottom padding value.
     *
     * @private
     */
    _bottom: number = 0;
    constructor()
    constructor(left: number, top: number, right: number, bottom: number)
    constructor(left?: number, top?: number, right?: number, bottom?: number) {
        if (typeof left === 'undefined') {
            this._left = 0.5;
            this._right = 0.5;
            this._top = 0.5;
            this._bottom = 0.5;
        } else {
            this._left = left;
            this._right = right;
            this._top = top;
            this._bottom = bottom;
        }
    }
}
