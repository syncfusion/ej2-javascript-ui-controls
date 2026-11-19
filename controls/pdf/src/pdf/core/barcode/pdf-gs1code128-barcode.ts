import { PdfGraphics } from '../graphics/pdf-graphics';
import { PdfPage } from '../pdf-page';
import { Rectangle, Point, PdfUnidimensionalBarcodeOptions, _UniPlan } from '../pdf-document-helper';
import { PdfUnidimensionalBarcode } from './pdf-unidimensional-barcode';
import {
    _code128StartC, _code128CodeB, _code128CodeC, _code128Fnc1, _createCode128Plan
} from './pdf-code128-common';
/**
 * Immutable description of one GS1 Application Identifier.
 * `min` and `max` bound the value length; `prefixDigits` leading characters must be numeric even for alphanumeric AIs.
 * `predefined` marks AIs in the GS1 predefined-length list, which never need a trailing FNC1 separator.
 */
export type _Gs1Definition = {
    readonly ai: string;
    readonly min: number;
    readonly max: number;
    readonly numeric: boolean;
    readonly prefixDigits: number;
    readonly predefined: boolean;
    readonly date: boolean;
};
/** One parsed `(AI)value` group. */
export type _Gs1Group = { readonly ai: string; readonly value: string };
/** Every stage of the GS1-128 encoding, kept separate from one another. */
export type _Gs1Encoding = {
    readonly groups: ReadonlyArray<_Gs1Group>;
    readonly normalized: string;
    readonly symbols: ReadonlyArray<number>;
    readonly caption: string;
};
/**
 * Represents a GS1-128 barcode.
 *
 * ```typescript
 * // Creates a document.
 * let document: PdfDocument = new PdfDocument();
 * // Creates a page.
 * let page: PdfPage = document.addPage();
 * // Creates a barcode.
 * let barcode: PdfGs1Code128Barcode = new PdfGs1Code128Barcode('(01)12345678901231(10)ABC123');
 * // Draws the barcode at the specified point.
 * barcode.draw(page, { x: 20, y: 20 });
 * // Saves the document.
 * document.save('output.pdf');
 * // Destroys the document.
 * document.destroy();
 * ```
 */
export class PdfGs1Code128Barcode extends PdfUnidimensionalBarcode {
    /**
     * Creates a Gs1Code128 barcode with payload text and optional settings.
     * When options are omitted, every property uses its documented default value.
     *
     * ```typescript
     * // Creates a document.
     * let document: PdfDocument = new PdfDocument();
     * // Creates a page.
     * let page: PdfPage = document.addPage();
     * // Creates a barcode with default options.
     * let barcode: PdfGs1Code128Barcode = new PdfGs1Code128Barcode('(01)12345678901231(10)ABC123');
     * // Creates a barcode with custom options.
     * let custom: PdfGs1Code128Barcode = new PdfGs1Code128Barcode('(01)12345678901231(10)ABC123', {
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
     * let barcode: PdfGs1Code128Barcode = new PdfGs1Code128Barcode('(01)12345678901231(10)ABC123');
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
        return this._drawPlan(target, locationOrBounds, (): _UniPlan => {
            const encoding: _Gs1Encoding = this._encodeGs1(text);
            return _createCode128Plan(encoding.symbols.slice(), encoding.caption);
        });
    }
    /** FNC1 stand-in (ASCII group separator) used in the normalized element string; it is not a permitted value character. */
    /**
     * Internal member _gs1Separator.
     *
     * @private
     */
    private readonly _gs1Separator: string = '\u001d';
    /** Maximum count of AI and value characters in one symbol (FNC1, start, check and stop symbols are not counted). */
    /**
     * Internal member _gs1MaxDataLength.
     *
     * @private
     */
    private readonly _gs1MaxDataLength: number = 48;
    /** Characters permitted in alphanumeric values: the GS1 General Specifications set without space and the parentheses. */
    /**
     * Internal member _gs1Charset.
     *
     * @private
     */
    private readonly _gs1Charset: string = '!"%&\'*+,-./0123456789:;<=>?ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz';
    /** First two digits of the AIs whose lengths are predefined (GS1 General Specifications, section 5.4.4). */
    /**
     * Internal member _gs1PredefinedPrefixes.
     *
     * @private
     */
    private readonly _gs1PredefinedPrefixes: ReadonlyArray<string> = Object.freeze(
        ['00', '01', '02', '03', '04', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
            '31', '32', '33', '34', '35', '36', '41']);
    /**
     * Internal member _maxCost.
     *
     * @private
     */
    private readonly _maxCost: number = 1 << 30;
    /**
     * Internal member _setB.
     *
     * @private
     */
    private readonly _setB: number = 0;
    /**
     * Internal member _setC.
     *
     * @private
     */
    private readonly _setC: number = 1;
    /**
     * Creates one frozen AI definition.
     *
     * @param {string} ai The Application Identifier.
     * @param {number} min Minimum value length.
     * @param {number} max Maximum value length.
     * @param {boolean} numeric True when every value character is a digit.
     * @param {number} prefixDigits Count of leading numeric characters in an alphanumeric value.
     * @param {boolean} date True for YYMMDD values.
     * @returns {_Gs1Definition} The definition.
     * @private
     */
    private _define(ai: string, min: number, max: number, numeric: boolean, prefixDigits: number = 0,
                    date: boolean = false): _Gs1Definition {
        return Object.freeze({
            ai: ai, min: min, max: max, numeric: numeric, prefixDigits: prefixDigits, date: date,
            predefined: this._gs1PredefinedPrefixes.indexOf(ai.substring(0, 2)) >= 0
        });
    }
    /**
     * Builds the frozen AI definition list.
     *
     * @returns {_Gs1Definition[]} The definitions.
     * @private
     */
    private _buildDefinitions(): ReadonlyArray<_Gs1Definition> {
        const list: _Gs1Definition[] = [];
        list.push(this._define('00', 18, 18, true), this._define('01', 14, 14, true),
                  this._define('02', 14, 14, true));
        ['11', '12', '13', '15', '16', '17'].forEach((ai: string) => { list.push(this._define(ai, 6, 6, true, 0, true)); });
        list.push(this._define('20', 2, 2, true));
        list.push(this._define('10', 1, 20, false), this._define('21', 1, 20, false),
                  this._define('22', 1, 20, false));
        list.push(this._define('30', 1, 8, true), this._define('37', 1, 8, true));
        list.push(this._define('240', 1, 30, false), this._define('241', 1, 30, false),
                  this._define('242', 1, 6, true),
                  this._define('243', 1, 20, false), this._define('250', 1, 30, false),
                  this._define('251', 1, 30, false),
                  this._define('253', 13, 30, false, 13), this._define('254', 1, 20, false));
        // Trade and logistic measures: 6-digit values; the fourth AI digit is the decimal-point position.
        const measures: string[] = ['31', '32', '33', '34', '35', '36'];
        const lastThird: number[] = [6, 9, 7, 9, 7, 9];
        measures.forEach((prefix: string, index: number) => {
            for (let third: number = 0; third <= lastThird.slice(index, index + 1)[0]; third++) {
                for (let point: number = 0; point <= 9; point++) {
                    list.push(this._define(prefix + third + point, 6, 6, true));
                }
            }
        });
        for (let point: number = 0; point <= 9; point++) {
            list.push(this._define('390' + point, 1, 15, true), this._define('391' + point, 4, 18, true),
                      this._define('392' + point, 1, 15, true), this._define('393' + point, 4, 18, true));
        }
        list.push(this._define('400', 1, 30, false), this._define('401', 1, 30, false),
                  this._define('402', 17, 17, true),
                  this._define('403', 1, 30, false));
        for (let n: number = 410; n <= 417; n++) {
            list.push(this._define('' + n, 13, 13, true));
        }
        list.push(this._define('420', 1, 20, false), this._define('421', 4, 12, false, 3),
                  this._define('422', 3, 3, true),
                  this._define('423', 4, 15, true), this._define('424', 3, 3, true),
                  this._define('425', 3, 3, true),
                  this._define('426', 3, 3, true));
        list.push(this._define('7001', 13, 13, true), this._define('7002', 1, 30, false),
                  this._define('7003', 10, 10, true));
        list.push(this._define('8001', 14, 14, true), this._define('8002', 1, 20, false),
                  this._define('8003', 14, 30, false, 14),
                  this._define('8004', 1, 30, false), this._define('8005', 6, 6, true),
                  this._define('8006', 18, 18, true),
                  this._define('8007', 1, 34, false), this._define('8008', 8, 12, true),
                  this._define('8018', 18, 18, true),
                  this._define('8020', 1, 25, false), this._define('8110', 1, 70, false));
        list.push(this._define('90', 1, 30, false));
        for (let n: number = 91; n <= 99; n++) {
            list.push(this._define('' + n, 1, 90, false));
        }
        return Object.freeze(list);
    }
    /** The supported Application Identifier definitions; the list and every entry are frozen. */
    /**
     * Internal member _gs1Definitions.
     *
     * @private
     */
    private readonly _gs1Definitions: ReadonlyArray<_Gs1Definition> = this._buildDefinitions();
    /**
     * Internal member _gs1Lookup.
     *
     * @private
     */
    private readonly _gs1Lookup: ReadonlyMap<string, _Gs1Definition> = new Map<string, _Gs1Definition>(
        this._gs1Definitions.map((d: _Gs1Definition): [string, _Gs1Definition] => [d.ai, d]));
    /**
     * Returns true for an ASCII digit code.
     *
     * @param {number} code The character code.
     * @returns {boolean} True for 0-9.
     * @private
     */
    private _isDigit(code: number): boolean {
        return code >= 48 && code <= 57;
    }
    /**
     * Returns true when every character is a digit.
     *
     * @param {string} value The text.
     * @returns {boolean} True for digits only.
     * @private
     */
    private _allDigits(value: string): boolean {
        for (let i: number = 0; i < value.length; i++) {
            if (!this._isDigit(value.charCodeAt(i))) {
                return false;
            }
        }
        return true;
    }
    /**
     * Validates a value against its definition. Messages name the rule and position, never the payload.
     *
     * @param {_Gs1Definition} definition The AI definition.
     * @param {string} value The value.
     * @param {number} offset The position of the value in the source text.
     * @returns {void}
     * @private
     */
    private _validateValue(definition: _Gs1Definition, value: string, offset: number): void {
        const label: string = 'GS1-128 AI (' + definition.ai + ')';
        if (value.length < definition.min || value.length > definition.max) {
            throw new Error(label + ' value length must be ' + (definition.min === definition.max ? '' + definition.min :
                'between ' + definition.min + ' and ' + definition.max) + ' at position ' + offset + '.');
        }
        for (let i: number = 0; i < value.length; i++) {
            const code: number = value.charCodeAt(i);
            const numericOnly: boolean = definition.numeric || i < definition.prefixDigits;
            if (numericOnly ? !this._isDigit(code) : this._gs1Charset.indexOf(value.charAt(i)) < 0) {
                throw new Error(label + ' value contains an unsupported character at position ' + (offset + i) + '.');
            }
        }
        if (definition.date) {
            const month: number = Number(value.substring(2, 4));
            const day: number = Number(value.substring(4, 6));
            if (month < 1 || month > 12 || day > 31) {
                throw new Error(label + ' value is not a valid YYMMDD date at position ' + offset + '.');
            }
        }
    }
    /**
     * Parses and validates the complete `(AI)value` structure without side effects.
     *
     * @param {string} text The source text.
     * @returns {_Gs1Group[]} The groups in source order.
     * @private
     */
    private _parseGs1(text: string): _Gs1Group[] {
        if (typeof text !== 'string' || text.length === 0) {
            throw new Error('GS1-128 text cannot be null or empty.');
        }
        const groups: _Gs1Group[] = [];
        let dataLength: number = 0;
        let i: number = 0;
        while (i < text.length) {
            if (text.charAt(i) !== '(') {
                throw new Error('GS1-128 text must contain (AI) before each value at position ' + i + '.');
            }
            const close: number = text.indexOf(')', i + 1);
            if (close < 0) {
                throw new Error('GS1-128 text has an unclosed parenthesis at position ' + i + '.');
            }
            const ai: string = text.substring(i + 1, close);
            if (ai.length < 2 || ai.length > 4 || !this._allDigits(ai)) {
                throw new Error('GS1-128 text has a malformed Application Identifier at position ' + (i + 1) + '.');
            }
            const definition: _Gs1Definition | undefined = this._gs1Lookup.get(ai);
            if (!definition) {
                throw new Error('GS1-128 Application Identifier (' + ai + ') is not supported at position ' + (i + 1) + '.');
            }
            for (let g: number = 0; g < groups.length; g++) {
                if (groups.slice(g, g + 1)[0].ai === ai) {
                    throw new Error('GS1-128 Application Identifier (' + ai + ') is repeated at position ' + (i + 1) + '.');
                }
            }
            let next: number = text.indexOf('(', close + 1);
            if (next < 0) {
                next = text.length;
            }
            const value: string = text.substring(close + 1, next);
            if (value.length === 0) {
                throw new Error('GS1-128 AI (' + ai + ') has no value at position ' + (close + 1) + '.');
            }
            if (value.indexOf(')') >= 0) {
                throw new Error('GS1-128 text has an unmatched closing parenthesis at position ' + (close + 1 + value.indexOf(')')) + '.');
            }
            this._validateValue(definition, value, close + 1);
            dataLength += ai.length + value.length;
            groups.push(Object.freeze({ ai: ai, value: value }));
            i = next;
        }
        if (dataLength > this._gs1MaxDataLength) {
            throw new Error('GS1-128 data exceeds ' + this._gs1MaxDataLength + ' characters.');
        }
        return groups;
    }
    /**
     * Builds the normalized element string: AIs and values without parentheses, with the separator after every
     * non-final group whose AI is not in the predefined-length list.
     *
     * @param {_Gs1Group[]} groups The parsed groups.
     * @returns {string} The element string.
     * @private
     */
    private _normalize(groups: ReadonlyArray<_Gs1Group>): string {
        let out: string = '';
        for (let i: number = 0; i < groups.length; i++) {
            const group: _Gs1Group = groups.slice(i, i + 1)[0];
            out += group.ai + group.value;
            const definition: _Gs1Definition | undefined = this._gs1Lookup.get(group.ai);
            if (i < groups.length - 1 && definition && !definition.predefined) {
                out += this._gs1Separator;
            }
        }
        return out;
    }
    /**
     * Selects the fewest symbols after Start C and the leading FNC1, switching between Code Sets C and B only where required.
     * Code Set A is never needed because the permitted character set contains no control characters.
     * Ties stay in the current set.
     *
     * @param {string} normalized The element string.
     * @returns {number[]} Start C, FNC1 and the data symbols (without check and stop).
     * @private
     */
    private _gs1Symbols(normalized: string): number[] {
        const n: number = normalized.length;
        const cost: number[] = [];
        const direct: number[] = [];
        for (let i: number = 0; i < (n + 1) * 2; i++) {
            cost.push(0);
            direct.push(0);
        }
        const at: (list: number[], i: number, s: number) => number =
            (list: number[], i: number, s: number): number => list.slice(i * 2 + s, i * 2 + s + 1)[0];
        for (let i: number = n - 1; i >= 0; i--) {
            const separator: boolean = normalized.charAt(i) === this._gs1Separator;
            const pair: boolean = i + 1 < n && this._isDigit(normalized.charCodeAt(i)) &&
                this._isDigit(normalized.charCodeAt(i + 1));
            direct.splice(i * 2 + this._setB, 1, 1 + at(cost, i + 1, this._setB));
            const setB: number = this._setB;
            const setC: number = this._setC;
            let cDirect: number = this._maxCost;
            if (separator) {
                cDirect = 1 + at(cost, i + 1, setC);
            } else if (pair) {
                cDirect = 1 + at(cost, i + 2, setC);
            }
            direct.splice(i * 2 + setC, 1, cDirect);
            cost.splice(i * 2 + setB, 1, Math.min(at(direct, i, setB), 1 + at(direct, i, setC)));
            cost.splice(i * 2 + setC, 1, Math.min(at(direct, i, setC), 1 + at(direct, i, setB)));
        }
        const symbols: number[] = [_code128StartC, _code128Fnc1];
        let set: number = this._setC;
        let i: number = 0;
        while (i < n) {
            const other: number = set === this._setB ? this._setC : this._setB;
            if (at(direct, i, set) > 1 + at(direct, i, other)) {
                symbols.push(other === this._setB ? _code128CodeB : _code128CodeC);
                set = other;
            }
            const code: number = normalized.charCodeAt(i);
            if (normalized.charAt(i) === this._gs1Separator) {
                symbols.push(_code128Fnc1);
                i++;
            } else if (set === this._setC) {
                symbols.push((code - 48) * 10 + normalized.charCodeAt(i + 1) - 48);
                i += 2;
            } else {
                symbols.push(code - 32);
                i++;
            }
        }
        return symbols;
    }
    /**
     * Runs every phase except the check symbol and painting; the source text is never modified.
     *
     * @param {string} text The source text.
     * @returns {_Gs1Encoding} The parsed groups, normalized element string, symbols and caption.
     * @private
     */
    private _encodeGs1(text: string): _Gs1Encoding {
        const groups: _Gs1Group[] = this._parseGs1(text);
        const normalized: string = this._normalize(groups);
        const caption: string = groups.map((g: _Gs1Group): string => '(' + g.ai + ')' + g.value).join('');
        return Object.freeze({
            groups: Object.freeze(groups), normalized: normalized, symbols: Object.freeze(this._gs1Symbols(normalized)),
            caption: caption
        });
    }
}
