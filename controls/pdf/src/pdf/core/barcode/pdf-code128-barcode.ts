import { PdfGraphics } from '../graphics/pdf-graphics';
import { PdfPage } from '../pdf-page';
import { Rectangle, Point, PdfUnidimensionalBarcodeOptions, _UniPlan } from '../pdf-document-helper';
import { PdfUnidimensionalBarcode } from './pdf-unidimensional-barcode';
import { _code128StartA, _code128StartB, _code128StartC, _createCode128Plan } from './pdf-code128-common';
/**
 * Represents a Code 128 barcode with automatic code-set selection.
 *
 * ```typescript
 * // Creates a document.
 * let document: PdfDocument = new PdfDocument();
 * // Creates a page.
 * let page: PdfPage = document.addPage();
 * // Creates a barcode.
 * let barcode: PdfCode128Barcode = new PdfCode128Barcode('Code128 12345678');
 * // Draws the barcode at the specified point.
 * barcode.draw(page, { x: 20, y: 20 });
 * // Saves the document.
 * document.save('output.pdf');
 * // Destroys the document.
 * document.destroy();
 * ```
 */
export class PdfCode128Barcode extends PdfUnidimensionalBarcode {
    /**
     * Creates a Code128 barcode with payload text and optional settings.
     * When options are omitted, every property uses its documented default value.
     *
     * ```typescript
     * // Creates a document.
     * let document: PdfDocument = new PdfDocument();
     * // Creates a page.
     * let page: PdfPage = document.addPage();
     * // Creates a barcode with default options.
     * let barcode: PdfCode128Barcode = new PdfCode128Barcode('Code128 12345678');
     * // Creates a barcode with custom options.
     * let custom: PdfCode128Barcode = new PdfCode128Barcode('Code128 12345678', {
     *     foreColor: { r: 0, g: 0, b: 128 },
     *     backColor: { r: 255, g: 255, b: 255 },
     *     quietZone: { all: 5 },
     *     narrowBarWidth: 1.5,
     *     barHeight: 60,
     *     textGap: 4,
     *     textAlignment: PdfBarcodeTextAlignment.Center,
     *     textLocation: PdfBarcodeTextLocation.Bottom
     * });
     * // Draws the barcode at the specified point.
     * custom.draw(page, { x: 20, y: 20 });
     * // Draws the barcode at specified bounds.
     * barcode.draw(page, { x: 20, y: 20, width: 100, height: 100 });
     * // Saves the document.
     * document.save('output.pdf');
     * // Destroys the document.
     * document.destroy();
     * ```
     *
     * @param {string} text The barcode payload.
     * @param {PdfUnidimensionalBarcodeOptions} options Optional settings. Omitted members keep their default values.
     */
    constructor(text: string, options?: PdfUnidimensionalBarcodeOptions) {
        super(text, options);
    }
    /**
     * Draws the barcode on a `PdfPage` or `PdfGraphics` at the specified point or bounds.
     *
     * A point or zero-sized bounds use the natural size. Positive bounds scale the barcode to fit the specified size and ignore
     * `narrowBarWidth` and `barHeight`.
     *
     * Throws if only one of `width` or `height` is 0.
     *
     * ```typescript
     * // Creates a document.
     * let document: PdfDocument = new PdfDocument();
     * // Creates a page.
     * let page: PdfPage = document.addPage();
     * // Creates a barcode.
     * let barcode: PdfCode128Barcode = new PdfCode128Barcode('Code128 12345678');
     * // Draws the barcode at the specified point.
     * let natural: Rectangle = barcode.draw(page, { x: 20, y: 20 });
     * // Draws the barcode within the specified bounds.
     * barcode.draw(page.graphics, { x: 20, y: natural.y + natural.height + 20, width: 250, height: 100 });
     * // Saves the document.
     * document.save('output.pdf');
     * // Destroys the document.
     * document.destroy();
     * ```
     *
     * @param {PdfPage | PdfGraphics} target The page or graphics context to draw on.
     * @param {Point | Rectangle} locationOrBounds The point or bounds to draw at. A point or bounds with width and height 0 select the natural size.
     * @returns {Rectangle} The rectangle occupied by the barcode, including quiet zones and text.
     * @throws {Error} When the text, point, bounds or a property value is invalid; nothing is drawn in that case.
     */
    public draw(target: PdfPage | PdfGraphics, locationOrBounds: Point | Rectangle): Rectangle {
        const text: string = this.text;
        return this._drawPlan(target, locationOrBounds, (): _UniPlan => _createCode128Plan(this._selectCode128Symbols(text), text));
    }
    /**
     * Internal member _codeA.
     *
     * @private
     */
    private readonly _codeA: number = 101;
    /**
     * Internal member _codeB.
     *
     * @private
     */
    private readonly _codeB: number = 100;
    /**
     * Internal member _codeC.
     *
     * @private
     */
    private readonly _codeC: number = 99;
    /**
     * Internal member _shift.
     *
     * @private
     */
    private readonly _shift: number = 98;
    /**
     * Internal member _maxCost.
     *
     * @private
     */
    private readonly _maxCost: number = 1 << 30;
    /** Code set indexes used by the selection planner. */
    /**
     * Internal member _setA.
     *
     * @private
     */
    private readonly _setA: number = 0;
    /**
     * Internal member _setB.
     *
     * @private
     */
    private readonly _setB: number = 1;
    /**
     * Internal member _setC.
     *
     * @private
     */
    private readonly _setC: number = 2;
    /** Preference order for equal-cost choices: code set C, then A, then B. */
    /**
     * Internal member _preference.
     *
     * @private
     */
    private readonly _preference: ReadonlyArray<number> = Object.freeze([this._setC, this._setA,
        this._setB]);
    /**
     * Returns the symbol value of a character in code set A or B, or -1 when the set cannot represent it.
     *
     * @param {number} code The ASCII code.
     * @param {number} set The code set (A or B).
     * @returns {number} The symbol value.
     * @private
     */
    private _valueIn(code: number, set: number): number {
        if (set === this._setA) {
            if (code < 32) {
                return code + 64;
            }
            return code < 96 ? code - 32 : -1;
        }
        return code >= 32 ? code - 32 : -1;
    }
    /**
     * Returns true when the characters at the position form a digit pair.
     *
     * @param {string} text The text.
     * @param {number} i The position.
     * @returns {boolean} True for two digits.
     * @private
     */
    private _isPair(text: string, i: number): boolean {
        if (i + 1 >= text.length) {
            return false;
        }
        const a: number = text.charCodeAt(i);
        const b: number = text.charCodeAt(i + 1);
        return a >= 48 && a <= 57 && b >= 48 && b <= 57;
    }
    /**
     * Selects the symbol sequence (start, data, code switches and shifts, without check and stop) that has the fewest symbols.
     * Ties are resolved deterministically: stay in the current set (shift before switching), then prefer C, then A, then B for both the start and switches.
     *
     * @param {string} text The source text; every character must be ASCII.
     * @returns {number[]} The symbol values.
     * @private
     */
    private _selectCode128Symbols(text: string): number[] {
        if (typeof text !== 'string' || text.length === 0) {
            throw new Error('Code 128 text cannot be null or empty.');
        }
        const n: number = text.length;
        for (let i: number = 0; i < n; i++) {
            if (text.charCodeAt(i) > 127) {
                throw new Error('Code 128 text contains an unsupported character at position ' + i + '.');
            }
        }
        // cost[i * 3 + s] is the fewest symbols needed for text[i..] when set s is active; direct[...] excludes a leading switch.
        const cost: number[] = [];
        const direct: number[] = [];
        for (let i: number = 0; i < (n + 1) * 3; i++) {
            cost.push(0);
            direct.push(0);
        }
        const at: (list: number[], i: number, s: number) => number =
            (list: number[], i: number, s: number): number => list[<number>(i * 3 + s)];
        for (let i: number = n - 1; i >= 0; i--) {
            const code: number = text.charCodeAt(i);
            for (let s: number = 0; s < 3; s++) {
                let best: number = this._maxCost;
                if (s === this._setC) {
                    if (this._isPair(text, i)) {
                        best = 1 + at(cost, i + 2, s);
                    }
                } else if (this._valueIn(code, s) >= 0) {
                    best = 1 + at(cost, i + 1, s);
                } else {
                    best = 2 + at(cost, i + 1, s);
                }
                direct.splice(i * 3 + s, 1, best);
            }
            for (let s: number = 0; s < 3; s++) {
                let best: number = at(direct, i, s);
                for (let k: number = 0; k < 3; k++) {
                    const t: number = this._preference.slice(k, k + 1)[0];
                    if (t !== s && at(direct, i, t) < this._maxCost && 1 + at(direct, i, t) < best) {
                        best = 1 + at(direct, i, t);
                    }
                }
                cost.splice(i * 3 + s, 1, best);
            }
        }
        let set: number = this._preference[0];
        for (let k: number = 1; k < 3; k++) {
            const t: number = this._preference.slice(k, k + 1)[0];
            if (at(direct, 0, t) < at(direct, 0, set)) {
                set = t;
            }
        }
        const symbols: number[] = [set === this._setA ? _code128StartA : set === this._setB ? _code128StartB :
            _code128StartC];
        let i: number = 0;
        while (i < n) {
            if (i > 0 && at(direct, i, set) !== at(cost, i, set)) {
                let target: number = -1;
                for (let k: number = 0; k < 3 && target < 0; k++) {
                    const t: number = this._preference.slice(k, k + 1)[0];
                    if (t !== set && at(direct, i, t) < this._maxCost && 1 + at(direct, i, t) === at(cost, i, set)) {
                        target = t;
                    }
                }
                symbols.push(target === this._setA ? this._codeA : target === this._setB ?
                    this._codeB : this._codeC);
                set = target;
            }
            const code: number = text.charCodeAt(i);
            if (set === this._setC) {
                symbols.push((code - 48) * 10 + text.charCodeAt(i + 1) - 48);
                i += 2;
            } else {
                let value: number = this._valueIn(code, set);
                if (value < 0) {
                    symbols.push(this._shift);
                    value = this._valueIn(code,
                                          set === this._setA ? this._setB : this._setA);
                }
                symbols.push(value);
                i++;
            }
        }
        return symbols;
    }
}
