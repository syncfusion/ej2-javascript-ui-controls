export class _PdfPaddings {
    _left: number = 0;
    _right: number = 0;
    _top: number = 0;
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
