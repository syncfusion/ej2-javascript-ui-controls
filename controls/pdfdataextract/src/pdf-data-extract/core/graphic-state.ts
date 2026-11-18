import { PdfColor } from '@syncfusion/ej2-pdf';
/**
 * Represents the PDF text rendering state (font, matrices, spacing, color).
 *
 * @private
 */
export class _TextState {
    /** Current transformation matrix (CTM) for user space to device space.
     *
     * @private
     */
    _ctm: number[];
    /** Current font name in use.
     *
     * @private
     */
    _fontName: string;
    /** Current font size in use.
     *
     * @private
     */
    _fontSize: number;
    /** Current font in use.
     *
     * @private
     */
    _font: any; //eslint-disable-line
    /** Current font matrix in use.
     *
     * @private
     */
    _fontMatrix: number[];
    /** Current text matrix in use.
     *
     * @private
     */
    _textMatrix: number[];
    /** Current textline matrixin use.
     *
     * @private
     */
    _textLineMatrix: number[];
    /** Character spacing.
     *
     * @private
     */
    _charSpacing: number;
    /** Word spacing.
     *
     * @private
     */
    _wordSpacing: number;
    /** Text Leading.
     *
     * @private
     */
    _leading: number;
    /** Horizontal text scale.
     *
     * @private
     */
    _textHScale: number;
    /** Text rise.
     *
     * @private
     */
    _textRise: number;
    /** Identity matrix constant.
     *
     * @private
     */
    _identityMatrix: number[] = [1, 0, 0, 1, 0, 0];
    /** Default font matrix.
     *
     * @private
     */
    _fontIdentityMatrix: number[] = [0.001, 0, 0, 0.001, 0, 0];
    /** Current fill color.
     *
     * @private
     */
    _textColor: PdfColor;
    constructor() {
        this._ctm = this._identityMatrix;
        this._fontName = null;
        this._fontSize = 0;
        this._font = null;
        this._fontMatrix = this._fontIdentityMatrix;
        this._textMatrix = this._identityMatrix.slice();
        this._textLineMatrix = this._identityMatrix.slice();
        this._charSpacing = 0;
        this._wordSpacing = 0;
        this._leading = 0;
        this._textHScale = 1;
        this._textRise = 0;
    }
    /**
     * Set the current text matrix (Tm).
     *
     * @private
     * @param {number} a - m0
     * @param {number} b - m1
     * @param {number} c - m2
     * @param {number} d - m3
     * @param {number} e - m4 (translate x)
     * @param {number} f - m5 (translate y)
     * @returns {void} nothing
     */
    _setTextMatrix(a: number, b: number, c: number, d: number, e: number, f: number): void {
        const matrix: number[] = this._textMatrix;
        matrix[0] = a;
        matrix[1] = b;
        matrix[2] = c;
        matrix[3] = d;
        matrix[4] = e;
        matrix[5] = f;
    }
    /**
     * Set the current text line matrix (Tlm).
     *
     * @private
     * @param {number} a - m0
     * @param {number} b - m1
     * @param {number} c - m2
     * @param {number} d - m3
     * @param {number} e - m4 (translate x)
     * @param {number} f - m5 (translate y)
     * @returns {void} nothing
     */
    _setTextLineMatrix(a: number, b: number, c: number, d: number, e: number, f: number): void {
        const matrix: number[] = this._textLineMatrix;
        matrix[0] = a;
        matrix[1] = b;
        matrix[2] = c;
        matrix[3] = d;
        matrix[4] = e;
        matrix[5] = f;
    }
    /**
     * Translate the current text matrix by (x,y).
     *
     * @private
     * @param {number} x - translation x
     * @param {number} y - translation y
     * @returns {void} nothing
     */
    _translateTextMatrix(x: number, y: number): void {
        const matrix: number[] = this._textMatrix;
        matrix[4] = matrix[0] * x + matrix[2] * y + matrix[4];
        matrix[5] = matrix[1] * x + matrix[3] * y + matrix[5];
    }
    /**
     * Translate the current text line matrix by (x,y).
     *
     * @private
     * @param {number} x - translation x
     * @param {number} y - translation y
     * @returns {void} nothing
     */
    _translateTextLineMatrix(x: number, y: number): void {
        const matrix: number[] = this._textLineMatrix;
        matrix[4] = matrix[0] * x + matrix[2] * y + matrix[4];
        matrix[5] = matrix[1] * x + matrix[3] * y + matrix[5];
    }
    /**
     * Perform a carriage return using the current leading and update Tm from Tlm.
     *
     * @private
     * @returns {void} nothing
     */
    _carriageReturn(): void {
        this._translateTextLineMatrix(0, -this._leading);
        this._textMatrix = this._textLineMatrix.slice();
    }
    /**
     * Create a shallow clone of this text state (arrays are copied).
     *
     * @private
     * @returns {any} cloned state
     */
    _clone(): any { //eslint-disable-line
        const clone: any = Object.create(this); //eslint-disable-line
        clone._textMatrix = this._textMatrix.slice();
        clone._textLineMatrix = this._textLineMatrix.slice();
        clone._fontMatrix = this._fontMatrix.slice();
        return clone;
    }
}
/**
 * Tracks graphic/text state stack and CTM transformations.
 *
 * @private
 */
export class _GraphicState {
    /**
     * Current active text state.
     *
     * @private
     */
    _state: _TextState ;
    /**
     * Create a new _GraphicState.
     *
     * @private
     */
    _stateStack: any; //eslint-disable-line
    constructor(currentState?: _TextState) {
        if (!currentState) {
            this._state = new _TextState();
        } else {
            this._state = currentState;
        }
        this._stateStack = [];
    }
    /**
     * Save the current state onto the stack and clone it for mutation.
     *
     * @private
     * @returns {void} nothing
     */
    _save(): void {
        const oldState: _TextState = this._state;
        this._stateStack.push(this._state);
        this._state = oldState._clone();
    }
    /**
     * Restore the previous state from the stack if available.
     *
     * @private
     * @returns {void} nothing
     */
    _restore(): void {
        const prev: _TextState  = this._stateStack.pop();
        if (prev) {
            this._state = prev;
        }
    }
    /**
     * Apply an affine transform to the current CTM.
     *
     * @private
     * @param {number[]} args - matrix [a,b,c,d,e,f] to multiply into CTM
     * @returns {void} nothing
     */
    _transform(args: number[]): void {
        this._state._ctm = this._transformMatrix(this._state._ctm, args);
    }
    /**
     * Multiply two affine matrices.
     *
     * @private
     * @param {number[]} m1 - left matrix
     * @param {number[]} m2 - right matrix
     * @returns {number[]} product matrix
     */
    _transformMatrix(m1: number[], m2: number[]): number[] {
        return [
            m1[0] * m2[0] + m1[2] * m2[1],
            m1[1] * m2[0] + m1[3] * m2[1],
            m1[0] * m2[2] + m1[2] * m2[3],
            m1[1] * m2[2] + m1[3] * m2[3],
            m1[0] * m2[4] + m1[2] * m2[5] + m1[4],
            m1[1] * m2[4] + m1[3] * m2[5] + m1[5]
        ];
    }
}
