/**
 * Holds font metadata including names character range width table and style flags.
 *
 * @private
 */
export class _PdfFontMetrics {
    /**
     * Specifies the human readable font name.
     *
     * @private
     */
    _name: string;
    /**
     * Stores the PostScript name used to identify the font program.
     *
     * @private
     */
    _postScriptName: string;
    /**
     * Code of the first supported character.
     *
     * @private
     */
    _firstChar: number;
    /**
     * Code of the last supported character.
     *
     * @private
     */
    _lastChar: number;
    /**
     * Scaling factor applied to compute subscript size.
     *
     * @private
     */
    _subScriptSizeFactor: number;
    /**
     * Scaling factor applied to compute superscript size.
     *
     * @private
     */
    _superscriptSizeFactor: number;
    /**
     * Width table used to resolve glyph advance widths.
     *
     * @private
     */
    _widthTable: _WidthTable;
    /**
     * Indicates whether this font uses Unicode encoding.
     *
     * @private
     */
    _isUnicodeFont: boolean;
    /**
     * Indicates whether the font is bold.
     *
     * @private
     */
    _isBold: boolean;
}
/**
 * Base type for width lookup tables that provide character width access and serialization.
 *
 * @private
 */
export abstract class _WidthTable {
    /**
     * Returns the width for the requested character code.
     *
     * @private
     * @param {number} index Character code (0 based or code point based on table).
     * @returns {number} width.
     */
    abstract _itemAt(index: number): number;
    /**
     * Returns the flattened width data for serialization.
     *
     * @private
     * @returns {number[]} array.
     */
    abstract _toArray(): number[];
}
/**
 * Stores per character widths with direct indexed access.
 *
 * @private
 */
export class _StandardWidthTable extends _WidthTable {
    widths: number[];
    constructor(widths: number[]) {
        super();
        this.widths = widths;
    }
    /**
     * Returns the width for the requested character code with bounds validation.
     *
     * @private
     * @param {number} index Character code index.
     * @returns {number} width.
     */
    _itemAt(index: number): number {
        if (index < 0 || index >= this.widths.length) {
            throw new Error('The character is not supported by the font.');
        }
        return this.widths[<number>index];
    }
    /**
     * Returns the underlying widths array without transformation.
     *
     * @private
     * @returns {number[]} widths.
     */
    _toArray(): number[] {
        return this.widths;
    }
}
/**
 * Manages CJK width ranges with a default width and range overrides.
 *
 * @private
 */
export class _CjkWidthTable extends _WidthTable {
    widths: _CjkWidth[];
    /**
     * Default glyph width used when no specific width is defined.
     *
     * @private
     */
    _defaultWidth: number;
    constructor(defaultWidth: number) {
        super();
        this._defaultWidth = defaultWidth;
        this.widths = [];
    }
    /**
     * Returns the width for the requested code using default and matching range entries.
     *
     * @private
     * @param {number} index Character code.
     * @returns {number} width.
     */
    _itemAt(index: number): number {
        let width: number = this._defaultWidth;
        this.widths.forEach((entry: _CjkWidth) => {
            if (index >= entry._from && index <= entry._to) {
                width = entry._itemAt(index);
            }
        });
        return width;
    }
    /**
     * Produces a compact array representation of all range width data.
     *
     * @private
     * @returns {number[]} array.
     */
    _toArray(): number[] {
        const array: number[] = [];
        this.widths.forEach((width: _CjkWidth) => {
            width._appendToArray(array);
        });
        return array;
    }
    /**
     * Adds a CJK width range entry to the table.
     *
     * @private
     * @param {_CjkWidth} width Range entry.
     * @returns {void} nothing.
     */
    _add(width: _CjkWidth): void {
        this.widths.push(width);
    }
}
/**
 * Represents a CJK width range entry that exposes bounds and width accessors.
 *
 * @private
 */
export abstract class _CjkWidth {
    /**
     * Gets the starting code of the range.
     *
     * @private
     * @returns {number} from.
     */
    abstract get _from(): number;
    /**
     * Gets the ending code of the range.
     *
     * @private
     * @returns {number} to.
     */
    abstract get _to(): number;
    /**
     * Returns the width for a code within the range.
     *
     * @private
     * @param {number} index Character code.
     * @returns {number} width.
     */
    abstract _itemAt(index: number): number;
    /**
     * Appends the encoded range information to the output array.
     *
     * @private
     * @param {number[]} array Output array.
     * @returns {void} nothing.
     */
    abstract _appendToArray(array: number[]): void;
}
/**
 * Describes a CJK range where all codes share the same width.
 *
 * @private
 */
export class _CjkSameWidth extends _CjkWidth {
    /**
     * Starting character code for which the width applies.
     *
     * @private
     */
    _widthFrom: number;
    /**
     * Ending character code for which the width applies.
     *
     * @private
     */
    _widthTo: number;
    /**
     * Width value applied to all codes in the specified range.
     *
     * @private
     */
    _width: number;
    constructor(from: number, to: number, width: number) {
        super();
        this._widthFrom = from;
        this._widthTo = to;
        this._width = width;
    }
    /**
     * Gets the starting code of the uniform width range.
     *
     * @private
     * @returns {number} from.
     */
    get _from(): number {
        return this._widthFrom;
    }
    /**
     * Gets the ending code of the uniform width range.
     *
     * @private
     * @returns {number} to.
     */
    get _to(): number {
        return this._widthTo;
    }
    /**
     * Returns the uniform width for any code within the range.
     *
     * @private
     * @param {number} index Character code.
     * @returns {number} width.
     */
    _itemAt(index: number): number {
        if (index < this._from || index > this._to) {
            throw new Error('Index is out of range.');
        }
        return this._width;
    }
    /**
     * Appends the range using start end and width triplet.
     *
     * @private
     * @param {number[]} array Output array.
     * @returns {void} nothing.
     */
    _appendToArray(array: number[]): void {
        array.push(this._from, this._to, this._width);
    }
}
/**
 * Describes a CJK range where codes have varying widths.
 *
 * @private
 */
export class _CjkDifferentWidth extends _CjkWidth {
    /**
     * Starting character code for the widths array.
     *
     * @private
     */
    _widthFrom: number;
    /**
     * List of widths corresponding to consecutive character codes.
     *
     * @private
     */
    _widths: number[];
    constructor(from: number, widths: number[]) {
        super();
        this._widthFrom = from;
        this._widths = widths;
    }
    /**
     * Gets the starting code of the varying width range.
     *
     * @private
     * @returns {number} from.
     */
    get _from(): number {
        return this._widthFrom;
    }
    /**
     * Gets the ending code of the varying width range.
     *
     * @private
     * @returns {number} to.
     */
    get _to(): number {
        return this._widthFrom + this._widths.length - 1;
    }
    /**
     * Returns the width for a code within the varying range.
     *
     * @private
     * @param {number} index Character code.
     * @returns {number} width.
     */
    _itemAt(index: number): number {
        if (index < this._widthFrom || index > this._to) {
            throw new Error('Index is out of range.');
        }
        return this._widths[<number>index];
    }
    /**
     * Appends the starting code followed by the widths for the range.
     *
     * @private
     * @param {number[]} array Output array.
     * @returns {void} nothing.
     */
    _appendToArray(array: number[]): void {
        array.push(this._from);
        array.forEach((entry: number) => {
            array.push(entry);
        });
    }
}
