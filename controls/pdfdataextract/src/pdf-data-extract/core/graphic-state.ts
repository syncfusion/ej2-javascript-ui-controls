import { PdfColor } from '@syncfusion/ej2-pdf';
export class _TextState {
    _ctm: number[];
    _fontName: string;
    _fontSize: number;
    _font: any; //eslint-disable-line
    _fontMatrix: number[];
    _textMatrix: number[];
    _textLineMatrix: number[];
    _charSpacing: number;
    _wordSpacing: number;
    _leading: number;
    _textHScale: number;
    _textRise: number;
    _identityMatrix: number[] = [1, 0, 0, 1, 0, 0];
    _fontIdentityMatrix: number[] = [0.001, 0, 0, 0.001, 0, 0];
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
    _setTextMatrix(a: number, b: number, c: number, d: number, e: number, f: number): void {
        const matrix: number[] = this._textMatrix;
        matrix[0] = a;
        matrix[1] = b;
        matrix[2] = c;
        matrix[3] = d;
        matrix[4] = e;
        matrix[5] = f;
    }
    _setTextLineMatrix(a: number, b: number, c: number, d: number, e: number, f: number): void {
        const matrix: number[] = this._textLineMatrix;
        matrix[0] = a;
        matrix[1] = b;
        matrix[2] = c;
        matrix[3] = d;
        matrix[4] = e;
        matrix[5] = f;
    }
    _translateTextMatrix(x: number, y: number): void {
        const matrix: number[] = this._textMatrix;
        matrix[4] = matrix[0] * x + matrix[2] * y + matrix[4];
        matrix[5] = matrix[1] * x + matrix[3] * y + matrix[5];
    }
    _translateTextLineMatrix(x: number, y: number): void {
        const matrix: number[] = this._textLineMatrix;
        matrix[4] = matrix[0] * x + matrix[2] * y + matrix[4];
        matrix[5] = matrix[1] * x + matrix[3] * y + matrix[5];
    }
    _carriageReturn(): void {
        this._translateTextLineMatrix(0, -this._leading);
        this._textMatrix = this._textLineMatrix.slice();
    }
    _clone(): any { //eslint-disable-line
        const clone: any = Object.create(this); //eslint-disable-line
        clone._textMatrix = this._textMatrix.slice();
        clone._textLineMatrix = this._textLineMatrix.slice();
        clone._fontMatrix = this._fontMatrix.slice();
        return clone;
    }
}
export class _GraphicState {
    _state: _TextState ;
    _stateStack: any; //eslint-disable-line
    constructor(currentState?: _TextState) {
        if (!currentState) {
            this._state = new _TextState();
        } else {
            this._state = currentState;
        }
        this._stateStack = [];
    }
    _save(): void {
        const oldState: _TextState = this._state;
        this._stateStack.push(this._state);
        this._state = oldState._clone();
    }
    _restore(): void {
        const prev: _TextState  = this._stateStack.pop();
        if (prev) {
            this._state = prev;
        }
    }
    _transform(args: number[]): void {
        this._state._ctm = this._transformMatrix(this._state._ctm, args);
    }
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
