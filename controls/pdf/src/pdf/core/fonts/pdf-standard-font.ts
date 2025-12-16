import { PdfStringFormat } from './pdf-string-format';
import { _PdfFontMetrics, _CjkWidthTable, _StandardWidthTable, _CjkSameWidth, _CjkDifferentWidth } from './pdf-font-metrics';
import { _PdfDictionary, _PdfName, _PdfReference } from './../pdf-primitives';
import { _PdfStringLayouter, _PdfStringLayoutResult } from './string-layouter';
import { _UnicodeTrueTypeFont } from './unicode-true-type-font';
import { _fromRectangle } from './../utils';
import { PdfSubSuperScript, PdfTextDirection } from './../../core/enumerator';
import { _TrueTypeReader, _TrueTypeGlyph, _TrueTypeMetrics } from './ttf-reader';
import { _RtlRenderer } from './../graphics/rightToLeft/text-renderer';
import { Size } from './../pdf-type';
/**
 * Represents the base class for font objects.`
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Gets the first page
 * let page: PdfPage = document.getPage(0) as PdfPage;
 * // Create a new PDF standard font
 * let font: PdfStandardFont = document.embedFont(PdfFontFamily.helvetica, 10, PdfFontStyle.regular);
 * // Create a new PDF string format
 * let format: PdfStringFormat = new PdfStringFormat(PdfTextAlignment.right, PdfVerticalAlignment.bottom);
 * // Draw the text
 * page.graphics.drawString('Helvetica', font, {x: 0, y: 180, width: page.size.width, height: 40}, new PdfBrush({r: 0, g: 0, b: 255}), format);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export abstract class PdfFont {
    _style: PdfFontStyle;
    _size: number;
    _dictionary: _PdfDictionary;
    _pdfFontInternals: _PdfDictionary;
    _fontMetrics: _PdfFontMetrics;
    _reference: _PdfReference;
    _key: string;
    _ascent: number;
    _descent: number;
    _lineGap: number = 0;
    _height: number;
    /**
     * Gets the size of the PDF font.
     *
     * @returns {number} size.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Gets the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Create a new PDF standard font
     * let font: PdfStandardFont = document.embedFont(PdfFontFamily.helvetica, 12, PdfFontStyle.regular);
     * // Gets the font size
     * let size: number = font.size;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get size(): number {
        return this._size;
    }
    /**
     * Gets the style of the PDF font.
     *
     * @returns {PdfFontStyle} size.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Gets the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Create a new PDF standard font
     * let font: PdfStandardFont = document.embedFont(PdfFontFamily.helvetica, 12, PdfFontStyle.regular);
     * // Gets the font style
     * let style: PdfFontStyle = font.style;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get style(): PdfFontStyle {
        return this._style;
    }
    /**
     * Sets the style of the PDF font.
     *
     * @param {PdfFontStyle} value to font style.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Gets the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Create a new PDF standard font
     * let font: PdfStandardFont = document.embedFont(PdfFontFamily.helvetica, 12, PdfFontStyle.regular);
     * // Sets the font style
     * font.style = PdfFontStyle.italic;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set style(value: PdfFontStyle) {
        this._style = value;
    }
    /**
     * Gets the boolean flag indicating whether the font has underline style or not.
     *
     * @returns {boolean} isUnderline.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Gets the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Create a new PDF standard font
     * let font: PdfStandardFont = document.embedFont(PdfFontFamily.helvetica, 12, PdfFontStyle.underline);
     * // Gets the boolean flag indicating whether the font has underline style or not.
     * let underline: boolean = font.isUnderline;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get isUnderline(): boolean {
        return (this.style & PdfFontStyle.underline) > 0;
    }
    /**
     * Gets the boolean flag indicating whether the font has strike out style or not.
     *
     * @returns {boolean} isStrikeout.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Gets the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Create a new PDF standard font
     * let font: PdfStandardFont = document.embedFont(PdfFontFamily.helvetica, 12, PdfFontStyle.strikeout);
     * // Gets the boolean flag indicating whether the font has strike out style or not.
     * let strikeout: boolean = font.isStrikeout;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get isStrikeout(): boolean {
        return (this.style & PdfFontStyle.strikeout) > 0;
    }
    get _metrics(): _PdfFontMetrics {
        return this._fontMetrics;
    }
    set _metrics(value: _PdfFontMetrics) {
        this._fontMetrics = value;
    }
    /**
     * Gets the boolean flag indicating whether the font has bold style or not.
     *
     * @returns {boolean} isBold.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Gets the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Create a new PDF standard font
     * let font: PdfStandardFont = document.embedFont(PdfFontFamily.helvetica, 12, PdfFontStyle.bold);
     * // Gets the boolean flag indicating whether the font has bold style or not.
     * let bold: boolean = font.isBold;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get isBold(): boolean {
        return ((this.style & PdfFontStyle.bold) > 0);
    }
    /**
     * Gets the boolean flag indicating whether the font has italic style or not.
     *
     * @returns {boolean} isItalic.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Gets the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Create a new PDF standard font
     * let font: PdfStandardFont = document.embedFont(PdfFontFamily.helvetica, 12, PdfFontStyle.italic);
     * // Gets the boolean flag indicating whether the font has italic style or not.
     * let italic: boolean = font.isItalic;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get isItalic(): boolean {
        return ((this.style & PdfFontStyle.italic) > 0);
    }
    /**
     * Gets the font height.
     *
     * @returns {number} height.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Gets the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Create a new PDF standard font
     * let font: PdfStandardFont = document.embedFont(PdfFontFamily.helvetica, 12, PdfFontStyle.italic);
     * // Gets the font height
     * let height: number = font.height;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get height(): number {
        return this._getHeight();
    }
    constructor(size: number)
    constructor(size: number, style: PdfFontStyle)
    constructor(size?: number, style?: PdfFontStyle) {
        if (typeof size === 'number' && typeof style === 'undefined') {
            this._size = size;
        } else {
            this._size = size;
            this._style = style;
        }
    }
    _setInternals(internals: _PdfDictionary): void {
        if (!internals) {
            throw new Error('ArgumentNullException:internals');
        }
        this._pdfFontInternals = internals;
    }
    _getCharacterCount(text: string, symbols: string[] | string): number {
        if (typeof symbols === 'string') {
            let numSymbols: number = 0;
            let curIndex: number = 0;
            curIndex = text.indexOf(symbols, curIndex);
            while (curIndex !== -1) {
                numSymbols++;
                curIndex++;
                curIndex = text.indexOf(symbols, curIndex);
            }
            return numSymbols;
        } else {
            let count: number = 0;
            for (let i: number = 0; i < text.length; i++) {
                if (symbols.indexOf(text[<number>i]) !== -1) {
                    count++;
                }
            }
            return count;
        }
    }
    _getSize(format: PdfStringFormat): number {
        let size: number = this._size;
        if (format !== null && typeof format !== 'undefined') {
            switch (format.subSuperScript) {
            case PdfSubSuperScript.subScript:
                size /= this._metrics._subScriptSizeFactor;
                break;
            case PdfSubSuperScript.superScript:
                size /= this._metrics._superscriptSizeFactor;
                break;
            }
        }
        return size;
    }
    _getHeight(): number
    _getHeight(format: PdfStringFormat): number
    _getHeight(format?: PdfStringFormat): number {
        let height: number;
        const clearTypeFonts: string[] = [ 'cambria', 'candara', 'constantia', 'corbel', 'cariadings' ];
        const clearTypeFontCollection: string[] = [];
        clearTypeFontCollection.push(...clearTypeFonts);
        if (this._getDescent(format) < 0) {
            height = (this._getAscent(format) - this._getDescent(format) + this._getLineGap(format));
        } else {
            height = (this._getAscent(format) + this._getDescent(format) + this._getLineGap(format));
        }
        return height;
    }
    _getAscent(format: PdfStringFormat): number {
        return this._ascent * 0.001 * this._getSize(format);
    }
    _getDescent(format: PdfStringFormat): number {
        return this._descent * 0.001 * this._getSize(format);
    }
    _getLineGap(format: PdfStringFormat): number {
        return this._lineGap * 0.001 * this._getSize(format);
    }
    /**
     * Measures the size of a given text string when rendered using this PDF font.
     *
     * @param {string} text Text.
     * @returns {Size} actualSize.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Gets the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Create a new PDF standard font
     * let font: PdfStandardFont = document.embedFont(PdfFontFamily.helvetica, 10, PdfFontStyle.regular);
     * // Create a new PDF string format
     * let format: PdfStringFormat = new PdfStringFormat(PdfTextAlignment.right, PdfVerticalAlignment.bottom);
     * // Measure the size of the text
     * let size: Size = font.measureString('Syncfusion');
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    public measureString(text: string): Size
    /**
     * Measures the size of a given text string when rendered using this PDF font with respect to the string format.
     *
     * @param {string} text Text.
     * @param {PdfStringFormat} format String format.
     * @returns {Size} actualSize.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Gets the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Create a new PDF standard font
     * let font: PdfStandardFont = document.embedFont(PdfFontFamily.helvetica, 10, PdfFontStyle.regular);
     * // Create a new PDF string format
     * let format: PdfStringFormat = new PdfStringFormat(PdfTextAlignment.right, PdfVerticalAlignment.bottom);
     * // Measure the size of the text
     * let size: Size = font.measureString('Syncfusion', format);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    public measureString(text: string, format: PdfStringFormat): Size
    /**
     * Measures the size of a given text string when rendered using this PDF font.
     *
     * @param {string} text Text.
     * @param {PdfStringFormat} format String format.
     * @param {number} charactersFitted Characters fitted.
     * @param {number} linesFilled Lines filled.
     * @returns {size} actualSize.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Gets the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Create a new PDF standard font
     * let font: PdfStandardFont = document.embedFont(PdfFontFamily.helvetica, 10, PdfFontStyle.regular);
     * // Create a new PDF string format
     * let format: PdfStringFormat = new PdfStringFormat(PdfTextAlignment.right, PdfVerticalAlignment.bottom);
     * // Measure the size of the text
     * let size: Size = font.measureString('Syncfusion', format, 10, 10);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    public measureString(text: string, format: PdfStringFormat, charactersFitted: number, linesFilled: number): Size
    /**
     * Measures the size of a given text string when rendered using this PDF font with respect to the maximum line width.
     *
     * @param {string} text Text.
     * @param {number} width width.
     * @returns {Size} actualSize.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Gets the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Create a new PDF standard font
     * let font: PdfStandardFont = document.embedFont(PdfFontFamily.helvetica, 10, PdfFontStyle.regular);
     * // Create a new PDF string format
     * let format: PdfStringFormat = new PdfStringFormat(PdfTextAlignment.right, PdfVerticalAlignment.bottom);
     * // Measure the size of the text
     * let size: Size = font.measureString('Syncfusion', 50);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    public measureString(text: string, width: number): Size
    /**
     * Measures the size of a given text string when rendered using this PDF font  with respect to the string format and maximum line width.
     *
     * @param {string} text Text.
     * @param {number} width width.
     * @param {PdfStringFormat} format String format.
     * @returns {Size} actualSize.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Gets the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Create a new PDF standard font
     * let font: PdfStandardFont = document.embedFont(PdfFontFamily.helvetica, 10, PdfFontStyle.regular);
     * // Create a new PDF string format
     * let format: PdfStringFormat = new PdfStringFormat(PdfTextAlignment.right, PdfVerticalAlignment.bottom);
     * // Measure the size of the text
     * let size: Size = font.measureString('Syncfusion', 50, format);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    public measureString(text: string, width: number, format: PdfStringFormat): Size
    /**
     * Measures the size of a given text string when rendered using this PDF font.
     *
     * @param {string} text Text.
     * @param {number} width width.
     * @param {PdfStringFormat} format String format.
     * @param {number} charactersFitted Characters fitted.
     * @param {number} linesFilled Lines filled.
     * @returns {Size} actualSize.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Gets the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Create a new PDF standard font
     * let font: PdfStandardFont = document.embedFont(PdfFontFamily.helvetica, 10, PdfFontStyle.regular);
     * // Create a new PDF string format
     * let format: PdfStringFormat = new PdfStringFormat(PdfTextAlignment.right, PdfVerticalAlignment.bottom);
     * // Measure the size of the text
     * let size: Size = font.measureString('Syncfusion', 50, format, 10, 10);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    public measureString(text: string, width: number, format: PdfStringFormat,
        charactersFitted: number, linesFilled: number): Size
    /**
     * Measures the size of a given text string when rendered using this PDF font with respect to the layout area.
     *
     * @param {string} text Text.
     * @param {Size} layoutArea Layout area.
     * @returns {Size} actualSize.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Gets the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Create a new PDF standard font
     * let font: PdfStandardFont = document.embedFont(PdfFontFamily.helvetica, 10, PdfFontStyle.regular);
     * // Create a new PDF string format
     * let format: PdfStringFormat = new PdfStringFormat(PdfTextAlignment.right, PdfVerticalAlignment.bottom);
     * // Measure the size of the text
     * let size: Size = font.measureString('Syncfusion', {width: 100, height: 100});
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    public measureString(text: string, layoutArea: Size): Size
    /**
     * Measures the size of a given text string when rendered using this PDF font with respect to the layout area and string format.
     *
     * @param {string} text Text.
     * @param {PdfStringFormat} format String format.
     * @param {Size} layoutArea Layout area.
     * @returns {Size} actualSize.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Gets the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Create a new PDF standard font
     * let font: PdfStandardFont = document.embedFont(PdfFontFamily.helvetica, 10, PdfFontStyle.regular);
     * // Create a new PDF string format
     * let format: PdfStringFormat = new PdfStringFormat(PdfTextAlignment.right, PdfVerticalAlignment.bottom);
     * // Measure the size of the text
     * let size: Size = font.measureString('Syncfusion', {width: 100, height: 100}, format);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    public measureString(text: string, layoutArea: Size, format: PdfStringFormat): Size
    /**
     * Measures the size of a given text string when rendered using this PDF font.
     *
     * @param {string} text Text.
     * @param {PdfStringFormat} format String format.
     * @param {Size} layoutArea Layout area.
     * @param {number} charactersFitted Characters fitted.
     * @param {number} linesFilled Lines filled.
     * @returns {Size} actualSize.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Gets the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Create a new PDF standard font
     * let font: PdfStandardFont = document.embedFont(PdfFontFamily.helvetica, 10, PdfFontStyle.regular);
     * // Create a new PDF string format
     * let format: PdfStringFormat = new PdfStringFormat(PdfTextAlignment.right, PdfVerticalAlignment.bottom);
     * // Measure the size of the text
     * let size: Size = font.measureString('Syncfusion', format, {width: 0, height: 0}, 0, 0);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    public measureString(text: string, layoutArea: Size, format: PdfStringFormat,
        charactersFitted: number, linesFilled: number): Size
    public measureString(text: string, arg2 ?: PdfStringFormat|number|Size,
                         arg3 ?: number|PdfStringFormat, arg4 ?: number, arg5 ?: number): Size {
        if (typeof text === 'string' && typeof arg2 === 'undefined') {
            return this.measureString(text, null);
        } else if (typeof text === 'string' && (arg2 instanceof PdfStringFormat || arg2 === null) &&
                  typeof arg3 === 'undefined' && typeof arg4 === 'undefined') {
            const temparg2: PdfStringFormat = arg2 as PdfStringFormat;
            const charactersFitted: number = 0;
            const linesFilled: number = 0;
            return this.measureString(text, temparg2, charactersFitted, linesFilled);
        } else if (typeof text === 'string' && (arg2 instanceof PdfStringFormat || arg2 === null)
                  && typeof arg3 === 'number' && typeof arg4 === 'number') {
            const temparg2: PdfStringFormat = arg2 as PdfStringFormat;
            return this.measureString(text, 0, temparg2, arg3, arg4);
        } else if (typeof text === 'string' && typeof arg2 === 'number'
                  && (arg3 instanceof PdfStringFormat || arg3 === null) && typeof arg4 === 'number' && typeof arg5 === 'number') {
            const temparg3: PdfStringFormat = arg3 as PdfStringFormat;
            return this.measureString(text, {width: arg2, height: 0}, temparg3, arg4, arg5);
        } else {
            const temparg3: PdfStringFormat = arg3 as PdfStringFormat;
            const layouter: _PdfStringLayouter = new _PdfStringLayouter();
            const size: Size = arg2 as Size;
            const result: _PdfStringLayoutResult = layouter._layout(text, this, temparg3, [size.width, size.height]);
            arg4 = text.length;
            arg5 = (result._empty) ? 0 : result._lines.length;
            return result._actualSize;
        }
    }
    _applyFormatSettings(line: string, format: PdfStringFormat, width: number): number {
        let realWidth: number = width;
        if (typeof format !== 'undefined' && format !== null && width > 0) {
            if (format.characterSpacing !== 0) {
                realWidth += (line.length - 1) * format.characterSpacing;
            }
            if (format.wordSpacing !== 0) {
                realWidth += this._getCharacterCount(line, [' ', '\t']) * format.wordSpacing;
            }
        }
        return realWidth;
    }
    abstract getLineWidth(line: string, format: PdfStringFormat): number;
    abstract _initializeInternals(): void;
}
/**
 * Represents one of the 14 standard fonts.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Gets the first page
 * let page: PdfPage = document.getPage(0) as PdfPage;
 * // Create a new PDF standard font
 * let font: PdfStandardFont = document.embedFont(PdfFontFamily.helvetica, 10, PdfFontStyle.regular);
 * // Create a new PDF string format
 * let format: PdfStringFormat = new PdfStringFormat(PdfTextAlignment.right, PdfVerticalAlignment.bottom);
 * // Draw the text
 * page.graphics.drawString('Helvetica', font, {x: 0, y: 180, width: page.size.width, height: 40}, new PdfBrush({r: 0, g: 0, b: 255}), format);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfStandardFont extends PdfFont {
    _fontFamily: PdfFontFamily;
    /**
     * Initializes a new instance of the `PdfStandardFont` class.
     *
     * @param {PdfFontFamily} fontFamily PdfFontFamily.
     * @param {number} size Size.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Gets the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Create a new PDF standard font
     * let font: PdfStandardFont = new PdfStandardFont(PdfFontFamily.helvetica, 10);
     * // Create a new PDF string format
     * let format: PdfStringFormat = new PdfStringFormat(PdfTextAlignment.right, PdfVerticalAlignment.bottom);
     * // Draw the text
     * page.graphics.drawString('Helvetica', font, {x: 0, y: 180, width: page.size.width, height: 40}, new PdfBrush({r: 0, g: 0, b: 255}), format);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor(fontFamily: PdfFontFamily, size: number)
    /**
     * Initializes a new instance of the `PdfStandardFont` class.
     *
     * @param {PdfFontFamily} fontFamily PdfFontFamily.
     * @param {PdfFontStyle} style PdfFontStyle.
     * @param {number} size Size.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Gets the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Create a new PDF standard font
     * let font: PdfStandardFont = new PdfStandardFont(PdfFontFamily.helvetica, 10, PdfFontStyle.regular);
     * // Create a new PDF string format
     * let format: PdfStringFormat = new PdfStringFormat(PdfTextAlignment.right, PdfVerticalAlignment.bottom);
     * // Draw the text
     * page.graphics.drawString('Helvetica', font, {x: 0, y: 180, width: page.size.width, height: 40}, new PdfBrush({r: 0, g: 0, b: 255}), format);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor(fontFamily: PdfFontFamily, size: number, style: PdfFontStyle)
    /**
     * Initializes a new instance of the `PdfStandardFont` class.
     *
     * @private
     * @param {PdfFontFamily} fontFamily The Font data as byte array.
     * @param {number} size The Font size.
     * @param {PdfFontStyle} style The Font style.
     * @param {_PdfFontPrimitive} primitive The Font primitive.
     */
    constructor(fontFamily: PdfFontFamily, size: number, style: PdfFontStyle, primitive: _PdfFontPrimitive)
    constructor(fontFamily: PdfFontFamily, size: number, style?: PdfFontStyle, primitive?: _PdfFontPrimitive) {
        super(size, (typeof style === 'undefined') ? PdfFontStyle.regular : style);
        this._fontFamily = fontFamily;
        this._checkStyle();
        this._initializeInternals(primitive);
    }
    /**
     * Gets the font family of the PDF standard font.
     *
     * @returns {PdfFontFamily} fontFamily.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Gets the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Create a new PDF standard font
     * let font: PdfStandardFont = document.embedFont(PdfFontFamily.helvetica, 10, PdfFontStyle.regular);
     * // Gets the font family
     * let fontFamily: PdfFontFamily = font.fontFamily;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get fontFamily(): PdfFontFamily {
        return this._fontFamily;
    }
    /**
     * Gets the line width.
     *
     * @param {string} line Line.
     * @param {PdfStringFormat} format String format.
     * @returns {number} width.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Gets the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Create a new PDF standard font
     * let font: PdfStandardFont = document.embedFont(PdfFontFamily.helvetica, 10, PdfFontStyle.regular);
     * // Create a new PDF string format
     * let format: PdfStringFormat = new PdfStringFormat(PdfTextAlignment.right, PdfVerticalAlignment.bottom);
     * // Get the text width
     * let width: number = font.getLineWidth('Syncfusion', format);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    getLineWidth(line: string, format: PdfStringFormat): number {
        let width: number = 0;
        line.split('').forEach((char: string) => {
            width += this._getCharacterWidthInternal(char);
        });
        width *= (0.001 * this._size);
        width = this._applyFormatSettings(line, format, width);
        return width;
    }
    _checkStyle(): void {
        if (this._fontFamily === PdfFontFamily.symbol || this._fontFamily === PdfFontFamily.zapfDingbats) {
            this._style &= ~(PdfFontStyle.bold |  PdfFontStyle.italic);
        }
    }
    _initializeInternals(primitive?: _PdfFontPrimitive): void {
        if (primitive !== null && typeof primitive !== 'undefined') {
            this._metrics = primitive.metrices;
            this._handleMetrics();
            this._dictionary = primitive.dictionary;
        } else {
            this._metrics = _PdfStandardFontMetricsFactory._getMetrics(this._fontFamily, this._style);
            this._handleMetrics();
            this._dictionary = this._createInternals();
        }
    }
    _handleMetrics(): void {
        switch (this._fontFamily) {
        case 0:
            this._handleHelveticaMetrics();
            break;
        case 1:
            this._handleCourierMetrics();
            break;
        case 2:
            this._handleTimesMetrics();
            break;
        case 3:
            this._handleSymbolMetrics();
            break;
        case 4:
            this._handleZapfDingbatsMetrics();
            break;
        }
    }
    _handleHelveticaMetrics(): void {
        if ((this._style & PdfFontStyle.bold) > 0 && (this._style & PdfFontStyle.italic) > 0) {
            this._ascent = _PdfStandardFontMetricsFactory._helveticaBoldItalicAscent;
            this._descent = _PdfStandardFontMetricsFactory._helveticaBoldItalicDescent;
            this._height = this._ascent - this._descent;
        } else if ((this._style & PdfFontStyle.bold) > 0) {
            this._ascent = _PdfStandardFontMetricsFactory._helveticaBoldAscent;
            this._descent = _PdfStandardFontMetricsFactory._helveticaBoldDescent;
            this._height = this._ascent - this._descent;
        } else if ((this._style & PdfFontStyle.italic) > 0) {
            this._ascent = _PdfStandardFontMetricsFactory._helveticaItalicAscent;
            this._descent = _PdfStandardFontMetricsFactory._helveticaItalicDescent;
            this._height = this._ascent - this._descent;
        } else {
            this._ascent = _PdfStandardFontMetricsFactory._helveticaAscent;
            this._descent = _PdfStandardFontMetricsFactory._helveticaDescent;
            this._height = this._ascent - this._descent;
        }
    }
    _handleCourierMetrics(): void {
        if ((this._style & PdfFontStyle.bold) > 0 && (this._style & PdfFontStyle.italic) > 0) {
            this._ascent = _PdfStandardFontMetricsFactory._courierBoldItalicAscent;
            this._descent = _PdfStandardFontMetricsFactory._courierBoldItalicDescent;
            this._height = this._ascent - this._descent;
        } else if ((this._style & PdfFontStyle.bold) > 0) {
            this._ascent = _PdfStandardFontMetricsFactory._courierBoldAscent;
            this._descent = _PdfStandardFontMetricsFactory._courierBoldDescent;
            this._height = this._ascent - this._descent;
        } else if ((this._style & PdfFontStyle.italic) > 0) {
            this._ascent = _PdfStandardFontMetricsFactory._courierItalicAscent;
            this._descent = _PdfStandardFontMetricsFactory._courierItalicDescent;
            this._height = this._ascent - this._descent;
        } else {
            this._ascent = _PdfStandardFontMetricsFactory._courierAscent;
            this._descent = _PdfStandardFontMetricsFactory._courierDescent;
            this._height = this._ascent - this._descent;
        }
    }
    _handleTimesMetrics(): void {
        if ((this._style & PdfFontStyle.bold) > 0 && (this._style & PdfFontStyle.italic) > 0) {
            this._ascent = _PdfStandardFontMetricsFactory._timesBoldItalicAscent;
            this._descent = _PdfStandardFontMetricsFactory._timesBoldItalicDescent;
            this._height = this._ascent - this._descent;
        } else if ((this._style & PdfFontStyle.bold) > 0) {
            this._ascent = _PdfStandardFontMetricsFactory._timesBoldAscent;
            this._descent = _PdfStandardFontMetricsFactory._timesBoldDescent;
            this._height = this._ascent - this._descent;
        } else if ((this._style & PdfFontStyle.italic) > 0) {
            this._ascent = _PdfStandardFontMetricsFactory._timesItalicAscent;
            this._descent = _PdfStandardFontMetricsFactory._timesItalicDescent;
            this._height = this._ascent - this._descent;
        } else {
            this._ascent = _PdfStandardFontMetricsFactory._timesAscent;
            this._descent = _PdfStandardFontMetricsFactory._timesDescent;
            this._height = this._ascent - this._descent;
        }
    }
    _handleSymbolMetrics(): void {
        this._ascent = _PdfStandardFontMetricsFactory._symbolAscent;
        this._descent = _PdfStandardFontMetricsFactory._symbolDescent;
        this._height = this._ascent - this._descent;
    }
    _handleZapfDingbatsMetrics(): void {
        this._ascent = _PdfStandardFontMetricsFactory._zapfDingbatsAscent;
        this._descent = _PdfStandardFontMetricsFactory._zapfDingbatsDescent;
        this._height = this._ascent - this._descent;
    }
    _createInternals(): _PdfDictionary {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary._updated = true;
        dictionary.set('Type', _PdfName.get('Font'));
        dictionary.set('Subtype', _PdfName.get('Type1'));
        dictionary.set('BaseFont', new _PdfName(this._metrics._postScriptName));
        if (this._fontFamily !== PdfFontFamily.symbol && this._fontFamily !== PdfFontFamily.zapfDingbats) {
            dictionary.set('Encoding', new _PdfName('WinAnsiEncoding'));
        }
        return dictionary;
    }
    _getCharacterWidthInternal(charCode: string): number {
        let code: number = charCode.charCodeAt(0);
        if (this._metrics._name === 'Helvetica' ||
            this._metrics._name === 'Courier' ||
            this._metrics._name === 'TimesRoman' ||
            this._metrics._name === 'Symbol' ||
            this._metrics._name === 'ZapfDingbats') {
            code = code - 32;
        }
        code = (code >= 0 && code !== 128) ? code : 0;
        return this._metrics._widthTable._itemAt(code);
    }
}
/**
 * Represents one of the 7 CJK standard fonts.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Gets the first page
 * let page: PdfPage = document.getPage(0) as PdfPage;
 * // Create a new PDF CJK standard font
 * let font: PdfCjkStandardFont = document.embedFont(PdfCjkFontFamily.heiseiMinchoW3, 20, PdfFontStyle.regular, true);
 * // Create a new PDF string format
 * let format: PdfStringFormat = new PdfStringFormat(PdfTextAlignment.right, PdfVerticalAlignment.bottom);
 * // Draw the text
 * page.graphics.drawString('こんにちは世界', font, {x: 0, y: 180, width: page.size.width, height: 40}, new PdfBrush({r: 0, g: 0, b: 255}), format);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfCjkStandardFont extends PdfFont {
    _fontFamily: PdfCjkFontFamily;
    /**
     * Gets the font family of the PDF CJK font.
     *
     * @returns {PdfCjkFontFamily} fontFamily.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Gets the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Create a new PDF CJK standard font
     * let font: PdfCjkStandardFont = document.embedFont(PdfCjkFontFamily.heiseiMinchoW3, 20, PdfFontStyle.regular, true);
     * // Gets the font family
     * let fontFamily: PdfCjkFontFamily = font.fontFamily;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get fontFamily(): PdfCjkFontFamily {
        return this._fontFamily;
    }
    /**
     * Initializes a new instance of the `PdfCjkStandardFont` class.
     *
     * @param {PdfCjkFontFamily} fontFamily PdfFontFamily.
     * @param {number} size Size.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Gets the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Create a new PDF CJK standard font
     * let font: PdfCjkStandardFont = new PdfCjkStandardFont(PdfCjkFontFamily.heiseiMinchoW3, 20);
     * // Create a new PDF string format
     * let format: PdfStringFormat = new PdfStringFormat(PdfTextAlignment.right, PdfVerticalAlignment.bottom);
     * // Draw the text
     * page.graphics.drawString('こんにちは世界', font, {x: 0, y: 180, width: page.size.width, height: 40}, new PdfBrush({r: 0, g: 0, b: 255}), format);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor(fontFamily: PdfCjkFontFamily, size: number)
    /**
     * Initializes a new instance of the `PdfCjkStandardFont` class.
     *
     * @param {PdfCjkFontFamily} fontFamily PdfFontFamily.
     * @param {PdfFontStyle} style PdfFontStyle.
     * @param {number} size Size.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Gets the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Create a new PDF CJK standard font
     * let font: PdfCjkStandardFont = new PdfCjkStandardFont(PdfCjkFontFamily.heiseiMinchoW3, 20, PdfFontStyle.bold);
     * // Create a new PDF string format
     * let format: PdfStringFormat = new PdfStringFormat(PdfTextAlignment.right, PdfVerticalAlignment.bottom);
     * // Draw the text
     * page.graphics.drawString('こんにちは世界', font, {x: 0, y: 180, width: page.size.width, height: 40}, new PdfBrush({r: 0, g: 0, b: 255}), format);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor(fontFamily: PdfCjkFontFamily, size: number, style: PdfFontStyle)
    /**
     * Initializes a new instance of the `PdfCjkStandardFont` class.
     *
     * @private
     * @param {PdfCjkFontFamily} fontFamily The Font data as byte array.
     * @param {number} size The Font size.
     * @param {PdfFontStyle} style The Font style.
     * @param {_PdfFontPrimitive} primitive The Font primitive.
     */
    constructor(fontFamily: PdfCjkFontFamily, size: number, style: PdfFontStyle, primitive: _PdfFontPrimitive)
    constructor(fontFamily: PdfCjkFontFamily, size: number, style?: PdfFontStyle, primitive?: _PdfFontPrimitive) {
        super(size, (typeof style === 'undefined') ? PdfFontStyle.regular : style);
        this._fontFamily = fontFamily;
        this._size = size;
        if (primitive !== null && typeof primitive !== 'undefined') {
            this._initializeInternals(primitive);
        } else {
            this._initializeInternals();
        }
    }
    /**
     * Gets the line width.
     *
     * @param {string} line Line.
     * @param {PdfStringFormat} format String format.
     * @returns {number} width.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Gets the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Create a new PDF CJK standard font
     * let font: PdfCjkStandardFont = document.embedFont(PdfCjkFontFamily.heiseiMinchoW3, 20, PdfFontStyle.bold, true);
     * // Create a new PDF string format
     * let format: PdfStringFormat = new PdfStringFormat(PdfTextAlignment.right, PdfVerticalAlignment.bottom);
     * // Get the text width
     * let width: number = font.getLineWidth('Syncfusion', format);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    getLineWidth(line: string, format: PdfStringFormat): number {
        let width: number = 0;
        for (let i: number = 0; i < line.length; i++) {
            width += this._getCharacterWidthInternal(line.charCodeAt(i));
        }
        width *= (0.001 * this._size);
        width = this._applyFormatSettings(line, format, width);
        return width;
    }
    _initializeInternals(primitive?: _PdfFontPrimitive): void {
        if (primitive) {
            this._metrics = primitive.metrices;
            this._handleMetric();
            this._dictionary = primitive.dictionary;
            const descentDictionary: _PdfDictionary[] = this._dictionary.get('DescendantFonts');
            descentDictionary[0].set('FontDescriptor', _PdfCjkFontDescriptorFactory._getFontDescriptor(this._fontFamily,
                                                                                                       this._style,
                                                                                                       this._metrics,
                                                                                                       this._ascent,
                                                                                                       this._descent));
        } else {
            this._metrics = _PdfCjkStandardFontMetricsFactory._getMetrics(this._fontFamily, this._style);
            this._handleMetric();
            this._dictionary = this._createInternals();
        }
    }
    _handleMetric(): void {
        switch (this._fontFamily) {
        case 0:
            this._ascent = 857;
            this._descent = -125;
            this._height = this._ascent - this._descent;
            break;
        case 1:
            this._ascent = 857;
            this._descent = -143;
            this._height = this._ascent - this._descent;
            break;
        default:
            this._ascent = 880;
            this._descent = -120;
            this._height = this._ascent - this._descent;
            break;
        }
    }
    _createInternals(): _PdfDictionary {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary._updated = true;
        dictionary.set('Type', _PdfName.get('Font'));
        dictionary.set('Subtype', _PdfName.get('Type0'));
        dictionary.set('BaseFont', new _PdfName(this._metrics._postScriptName));
        dictionary.set('Encoding', this._getEncoding(this._fontFamily));
        dictionary.set('DescendantFonts', this._getDescendantFont());
        return dictionary;
    }
    _getEncoding(fontFamily: PdfCjkFontFamily): _PdfName {
        let encoding: string = 'Unknown';
        switch (fontFamily) {
        case PdfCjkFontFamily.hanyangSystemsGothicMedium:
        case PdfCjkFontFamily.hanyangSystemsShinMyeongJoMedium:
            encoding = 'UniKS-UCS2-H';
            break;
        case PdfCjkFontFamily.heiseiKakuGothicW5:
        case PdfCjkFontFamily.heiseiMinchoW3:
            encoding = 'UniJIS-UCS2-H';
            break;
        case PdfCjkFontFamily.monotypeHeiMedium:
        case PdfCjkFontFamily.monotypeSungLight:
            encoding = 'UniCNS-UCS2-H';
            break;
        case PdfCjkFontFamily.sinoTypeSongLight:
            encoding = 'UniGB-UCS2-H';
            break;
        }
        return new _PdfName(encoding);
    }
    _getDescendantFont(): _PdfDictionary[] {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary._updated = true;
        dictionary.set('Type', _PdfName.get('Font'));
        dictionary.set('Subtype', _PdfName.get('CIDFontType2'));
        dictionary.set('BaseFont', new _PdfName(this._metrics._postScriptName));
        dictionary.set('DW', (this._metrics._widthTable as _CjkWidthTable)._defaultWidth);
        dictionary.set('W', this._metrics._widthTable._toArray());
        dictionary.set('FontDescriptor', _PdfCjkFontDescriptorFactory._getFontDescriptor(this._fontFamily, this._style,
                                                                                         this._metrics, this._ascent, this._descent));
        dictionary.set('CIDSystemInfo', this._getSystemInformation());
        return [dictionary];
    }
    _getSystemInformation(): _PdfDictionary {
        const systemInformation: _PdfDictionary = new _PdfDictionary();
        systemInformation._updated = true;
        systemInformation.set('Registry', 'Adobe');
        switch (this._fontFamily) {
        case PdfCjkFontFamily.hanyangSystemsGothicMedium:
        case PdfCjkFontFamily.hanyangSystemsShinMyeongJoMedium:
            systemInformation.set('Ordering', 'Korea1');
            systemInformation.set('Supplement', 1);
            break;
        case PdfCjkFontFamily.heiseiKakuGothicW5:
        case PdfCjkFontFamily.heiseiMinchoW3:
            systemInformation.set('Ordering', 'Japan1');
            systemInformation.set('Supplement', 2);
            break;
        case PdfCjkFontFamily.monotypeHeiMedium:
        case PdfCjkFontFamily.monotypeSungLight:
            systemInformation.set('Ordering', 'CNS1');
            systemInformation.set('Supplement', '0');
            break;
        case PdfCjkFontFamily.sinoTypeSongLight:
            systemInformation.set('Ordering', 'GB1');
            systemInformation.set('Supplement', 2);
            break;
        }
        return systemInformation;
    }
    _getCharacterWidthInternal(charCode: number): number {
        charCode = (charCode >= 0) ? charCode : 0;
        return this._metrics._widthTable._itemAt(charCode);
    }
}
/**
 * Represents TrueType font.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Gets the first page
 * let page: PdfPage = document.getPage(0) as PdfPage;
 * // Create a new PDF truetype font
 * let font: PdfTrueTypeFont = document.embedFont(fontData, 14, { shouldUnderline: true });
 * // Create a new PDF string format
 * let format: PdfStringFormat = new PdfStringFormat(PdfTextAlignment.right, PdfVerticalAlignment.bottom);
 * // Draw the text
 * page.graphics.drawString('Hello world', font, {x: 0, y: 180, width: page.size.width, height: 40},, new PdfBrush({r: 0, g: 0, b: 255}), format);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfTrueTypeFont extends PdfFont {
    _fontInternal: _UnicodeTrueTypeFont;
    _isEmbedFont: boolean = false;
    _isUnicode: boolean = true;
    /**
     * Gets the boolean flag indicating whether the font has unicode or not.
     *
     * @returns {boolean} unicode.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Gets the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Create a new PDF truetype font
     * let font: PdfTrueTypeFont = document.embedFont(fontData, 14, { shouldUnderline: true });
     * // Gets the boolean flag indicating whether the font has or not.
     * let isUnicode: boolean = font.isUnicode;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get isUnicode(): boolean {
        return this._isUnicode;
    }
    /**
     * Gets the boolean flag indicating whether the font is embedded or not.
     *
     * @returns {boolean} isEmbed.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Gets the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Create a new PDF truetype font
     * let font: PdfTrueTypeFont = document.embedFont(fontData, 14, { shouldUnderline: true });
     * // Gets the boolean flag indicating whether the font is embedded or not.
     * let isEmbed: boolean = font.isEmbed;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get isEmbed(): boolean {
        return this._isEmbedFont;
    }
    /**
     * Initializes a new instance of the `PdfTrueTypeFont` class.
     *
     * @param {Uint8Array} data Font data as byte array.
     * @param {number} size Size.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Gets the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Create a new PDF truetype font
     * let font: PdfTrueTypeFont = new PdfTrueTypeFont(data, 10);
     * // Create a new PDF string format
     * let format: PdfStringFormat = new PdfStringFormat(PdfTextAlignment.right, PdfVerticalAlignment.bottom);
     * // Draw the text
     * page.graphics.drawString('Hello world', font, {x: 0, y: 180, width: page.size.width, height: 40},, new PdfBrush({r: 0, g: 0, b: 255}), format);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    public constructor(data: Uint8Array, size: number)
    /**
     * Initializes a new instance of the `PdfTrueTypeFont` class.
     *
     * @param {string} base64String Base64String.
     * @param {number} size Size.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Gets the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Create a new PDF truetype font
     * let font: PdfTrueTypeFont = new PdfTrueTypeFont(base64String, 10);
     * // Create a new PDF string format
     * let format: PdfStringFormat = new PdfStringFormat(PdfTextAlignment.right, PdfVerticalAlignment.bottom);
     * // Draw the text
     * page.graphics.drawString('Hello world', font, {x: 0, y: 180, width: page.size.width, height: 40},, new PdfBrush({r: 0, g: 0, b: 255}), format);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    public constructor(base64String: string, size: number)
    /**
     * Initializes a new instance of the `PdfTrueTypeFont` class.
     *
     * @param {string} base64String Base64String.
     * @param {number} size Font size.
     * @param {style} style Font style.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Gets the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Create a new PDF truetype font
     * let font: PdfTrueTypeFont = new PdfTrueTypeFont(base64String, 10, PdfFontStyle.regular);
     * // Create a new PDF string format
     * let format: PdfStringFormat = new PdfStringFormat(PdfTextAlignment.right, PdfVerticalAlignment.bottom);
     * // Draw the text
     * page.graphics.drawString('Hello world', font, {x: 0, y: 180, width: page.size.width, height: 40},, new PdfBrush({r: 0, g: 0, b: 255}), format);
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    public constructor(base64String: string, size: number, style: PdfFontStyle)
    /**
     * Initializes a new instance of the `PdfTrueTypeFont` class.
     *
     * @param {Uint8Array} data Font data as byte array.
     * @param {number} size Font size.
     * @param {style} style Font style.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Gets the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Create a new PDF truetype font
     * let font: PdfTrueTypeFont = new PdfTrueTypeFont(data, 10, PdfFontStyle.regular);
     * // Create a new PDF string format
     * let format: PdfStringFormat = new PdfStringFormat(PdfTextAlignment.right, PdfVerticalAlignment.bottom);
     * // Draw the text
     * page.graphics.drawString('Syncfusion', font, [0, 180, page.size[0], 40], undefined, new PdfBrush([0, 0, 255]), format);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    public constructor(data: Uint8Array, size: number, style: PdfFontStyle)
    /**
     * Initializes a new instance of the `PdfTrueTypeFont` class.
     *
     * @private
     * @param {Uint8Array} data The Font data as byte array.
     * @param {number} size The Font size.
     * @param {PdfFontStyle} style The Font style.
     * @param {_PdfFontPrimitive} primitive The Font primitive.
     */
    constructor(data: Uint8Array, size: number, style: PdfFontStyle, primitive: _PdfFontPrimitive)
    public constructor(data: string | Uint8Array, size: number, style?: PdfFontStyle, primitive?: _PdfFontPrimitive) {
        super(size, (typeof style === 'undefined') ? PdfFontStyle.regular : style);
        if (style !== undefined) {
            this._createFontInternal(data, style, primitive);
        } else {
            this._createFontInternal(data, PdfFontStyle.regular, primitive);
        }
    }
    /**
     * Gets the line width.
     *
     * @param {string} line Line.
     * @param {PdfStringFormat} format String format.
     * @returns {number} width.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Gets the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Create a new PDF truetype font
     * let font: PdfTrueTypeFont = document.embedFont(fontData, 14, { shouldUnderline: true });
     * // Create a new PDF string format
     * let format: PdfStringFormat = new PdfStringFormat(PdfTextAlignment.right, PdfVerticalAlignment.bottom);
     * // Get the text width
     * let width: number = font.getLineWidth('Syncfusion', format);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    getLineWidth(line: string, format: PdfStringFormat): number {
        let width: number = 0;
        if (format !== null && typeof format !== 'undefined' && format.textDirection !== PdfTextDirection.none) {
            width = this._getUnicodeLineWidth(line, width);
        } else {
            for (let i: number = 0, len: number = line.length; i < len; i++) {
                width += this._getCharacterWidthInternal(line[<number>i]);
            }
        }
        if (isNaN(width)) {
            width = 0;
        }
        width *= (0.001 * this._size);
        width = this._applyFormatSettings(line, format, width);
        return width;
    }
    _createFontInternal(data: string | Uint8Array, style: PdfFontStyle, primitive?: _PdfFontPrimitive): void {
        this.style = style;
        if (primitive !== null && typeof primitive !== 'undefined') {
            this._fontInternal = primitive.fontInternal;
            this._fontInternal._fontSize = this._size;
            this._metrics = primitive.metrices;
            this._handleMetrics();
            this._setInternals(primitive.dictionary);
        } else {
            this._fontInternal = new _UnicodeTrueTypeFont(data, this._size);
            this._initializeInternals();
        }
    }
    _initializeInternals(): void {
        let internals: _PdfDictionary = null;
        if (this._fontInternal instanceof _UnicodeTrueTypeFont) {
            (this._fontInternal as _UnicodeTrueTypeFont)._isEmbed = this._isEmbedFont;
        }
        this._fontInternal._createInternals();
        this._handleMetrics();
        internals = this._fontInternal._getInternals();
        this._metrics = this._fontInternal._metrics;
        this._metrics._isUnicodeFont = true;
        this._setInternals(internals);
    }
    _handleMetrics(): void {
        const ttfMetrics: _TrueTypeMetrics = this._fontInternal._ttfMetrics;
        this._ascent = ttfMetrics._macAscent;
        this._descent = ttfMetrics._macDescent;
        this._height = ttfMetrics._macAscent - ttfMetrics._macDescent + ttfMetrics._lineGap;
        this._lineGap = ttfMetrics._lineGap;
    }
    _getUnicodeLineWidth(line: string, width: number): number {
        width = 0;
        let glyphIndex: number[] = [];
        let result: boolean = false;
        const rtlRender: _RtlRenderer = new _RtlRenderer();
        const value: _UnicodeLine = rtlRender._getGlyphIndex(line, this, glyphIndex);
        result = value._result;
        glyphIndex = value._glyphIndex;
        if (result && glyphIndex !== null) {
            const ttfReader: _TrueTypeReader = (this._fontInternal as _UnicodeTrueTypeFont)._ttfReader;
            glyphIndex.forEach((index: number) => {
                if (index !== null && typeof index !== 'undefined') {
                    const glyph: _TrueTypeGlyph = ttfReader._getGlyph(index);
                    if (glyph !== null && typeof glyph !== 'undefined') {
                        width += glyph._width;
                    }
                }
            });
        }
        return width;
    }
    _getCharacterWidth(charCode: string, format: PdfStringFormat): number {
        let codeWidth: number = this._fontInternal._getCharacterWidth(charCode);
        const size: number = this._getSize(format);
        codeWidth *= (0.001 * size);
        return codeWidth;
    }
    _setSymbols(text: string): void {
        const internalFont: _UnicodeTrueTypeFont = this._fontInternal as _UnicodeTrueTypeFont;
        if (internalFont !== null && typeof internalFont !== 'undefined') {
            internalFont._setSymbols(text);
        }
    }
    _getCharacterWidthInternal(charCode: string): number {
        let code: number = charCode.charCodeAt(0);
        code = (code >= 0 && code !== 128) ? code : 0;
        return this._metrics._widthTable._itemAt(code);
    }
}
export class _PdfStandardFontMetricsFactory {
    static readonly _subSuperScriptFactor: number = 1.52;
    static readonly _helveticaAscent: number = 931;
    static readonly _helveticaDescent: number = -225;
    static readonly _helveticaName: string = 'Helvetica';
    static readonly _helveticaBoldAscent: number = 962;
    static readonly _helveticaBoldDescent: number = -228;
    static readonly _helveticaBoldName: string = 'Helvetica-Bold';
    static readonly _helveticaItalicAscent: number = 931;
    static readonly _helveticaItalicDescent: number = -225;
    static readonly _helveticaItalicName: string = 'Helvetica-Oblique';
    static readonly _helveticaBoldItalicAscent: number = 962;
    static readonly _helveticaBoldItalicDescent: number = -228;
    static readonly _helveticaBoldItalicName: string = 'Helvetica-BoldOblique';
    static readonly _courierAscent: number = 805;
    static readonly _courierDescent: number = -250;
    static readonly _courierName: string = 'Courier';
    static readonly _courierBoldAscent: number = 801;
    static readonly _courierBoldDescent: number = -250;
    static readonly _courierBoldName: string = 'Courier-Bold';
    static readonly _courierItalicAscent: number = 805;
    static readonly _courierItalicDescent: number = -250;
    static readonly _courierItalicName: string = 'Courier-Oblique';
    static readonly _courierBoldItalicAscent: number = 801;
    static readonly _courierBoldItalicDescent: number = -250;
    static readonly _courierBoldItalicName: string = 'Courier-BoldOblique';
    static readonly _timesAscent: number = 898;
    static readonly _timesDescent: number = -218;
    static readonly _timesName: string = 'Times-Roman';
    static readonly _timesBoldAscent: number = 935;
    static readonly _timesBoldDescent: number = -218;
    static readonly _timesBoldName: string = 'Times-Bold';
    static readonly _timesItalicAscent: number = 883;
    static readonly _timesItalicDescent: number = -217;
    static readonly _timesItalicName: string = 'Times-Italic';
    static readonly _timesBoldItalicAscent: number = 921;
    static readonly _timesBoldItalicDescent: number = -218;
    static readonly _timesBoldItalicName: string = 'Times-BoldItalic';
    static readonly _symbolAscent: number = 1010;
    static readonly _symbolDescent: number = -293;
    static readonly _symbolName: string = 'Symbol';
    static readonly _zapfDingbatsAscent: number = 820;
    static readonly _zapfDingbatsDescent: number = -143;
    static readonly _zapfDingbatsName: string = 'ZapfDingbats';
    static _arialWidth: number[] =
    [
        278, 278, 355, 556, 556, 889, 667, 191, 333, 333, 389, 584, 278, 333,
        278, 278, 556, 556, 556, 556, 556, 556, 556, 556, 556, 556, 278, 278, 584, 584,
        584, 556, 1015, 667, 667, 722, 722, 667, 611, 778, 722, 278, 500, 667, 556, 833,
        722, 778, 667, 778, 722, 667, 611, 722, 667, 944, 667, 667, 611, 278, 278, 278,
        469, 556, 333, 556, 556, 500, 556, 556, 278, 556, 556, 222, 222, 500, 222, 833,
        556, 556, 556, 556, 333, 500, 278, 556, 500, 722, 500, 500, 500, 334, 260, 334,
        584, 0, 556, 0, 222, 556, 333, 1000, 556, 556, 333, 1000, 667, 333, 1000, 0,
        611, 0, 0, 222, 222, 333, 333, 350, 556, 1000, 333, 1000, 500, 333, 944, 0,
        500, 667, 0, 333, 556, 556, 556, 556, 260, 556, 333, 737, 370, 556, 584, 0,
        737, 333, 400, 584, 333, 333, 333, 556, 537, 278, 333, 333, 365, 556, 834, 834,
        834, 611, 667, 667, 667, 667, 667, 667, 1000, 722, 667, 667, 667, 667, 278, 278,
        278, 278, 722, 722, 778, 778, 778, 778, 778, 584, 778, 722, 722, 722, 722, 667,
        667, 611, 556, 556, 556, 556, 556, 556, 889, 500, 556, 556, 556, 556, 278, 278,
        278, 278, 556, 556, 556, 556, 556, 556, 556, 584, 611, 556, 556, 556, 556, 500,
        556, 500
    ];
    static _arialBoldWidth: number[] =
    [
        278, 333, 474, 556, 556, 889, 722, 238, 333, 333, 389, 584, 278, 333,
        278, 278, 556, 556, 556, 556, 556, 556, 556, 556, 556, 556, 333, 333, 584, 584,
        584, 611, 975, 722, 722, 722, 722, 667, 611, 778, 722, 278, 556, 722, 611, 833,
        722, 778, 667, 778, 722, 667, 611, 722, 667, 944, 667, 667, 611, 333, 278, 333,
        584, 556, 333, 556, 611, 556, 611, 556, 333, 611, 611, 278, 278, 556, 278, 889,
        611, 611, 611, 611, 389, 556, 333, 611, 556, 778, 556, 556, 500, 389, 280, 389,
        584, 0, 556, 0, 278, 556, 500, 1000, 556, 556, 333, 1000, 667, 333, 1000, 0,
        611, 0, 0, 278, 278, 500, 500, 350, 556, 1000, 333, 1000, 556, 333, 944, 0,
        500, 667, 0, 333, 556, 556, 556, 556, 280, 556, 333, 737, 370, 556, 584, 0,
        737, 333, 400, 584, 333, 333, 333, 611, 556, 278, 333, 333, 365, 556, 834, 834,
        834, 611, 722, 722, 722, 722, 722, 722, 1000, 722, 667, 667, 667, 667, 278, 278,
        278, 278, 722, 722, 778, 778, 778, 778, 778, 584, 778, 722, 722, 722, 722, 667,
        667, 611, 556, 556, 556, 556, 556, 556, 889, 556, 556, 556, 556, 556, 278, 278,
        278, 278, 611, 611, 611, 611, 611, 611, 611, 584, 611, 611, 611, 611, 611, 556,
        611, 556
    ];
    static _fixedWidth: number[] =
    [
        600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600,
        600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600,
        600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600,
        600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600,
        600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600,
        600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600,
        600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600,
        600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600,
        600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600,
        600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600,
        600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600,
        600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600,
        600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600,
        600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600
    ];
    static _timesRomanWidth: number[] =
    [
        250, 333, 408, 500, 500, 833, 778, 180, 333, 333, 500, 564, 250, 333,
        250, 278, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 278, 278, 564, 564,
        564, 444, 921, 722, 667, 667, 722, 611, 556, 722, 722, 333, 389, 722, 611, 889,
        722, 722, 556, 722, 667, 556, 611, 722, 722, 944, 722, 722, 611, 333, 278, 333,
        469, 500, 333, 444, 500, 444, 500, 444, 333, 500, 500, 278, 278, 500, 278, 778,
        500, 500, 500, 500, 333, 389, 278, 500, 500, 722, 500, 500, 444, 480, 200, 480,
        541, 0, 500, 0, 333, 500, 444, 1000, 500, 500, 333, 1000, 556, 333, 889, 0,
        611, 0, 0, 333, 333, 444, 444, 350, 500, 1000, 333, 980, 389, 333, 722, 0,
        444, 722, 0, 333, 500, 500, 500, 500, 200, 500, 333, 760, 276, 500, 564, 0,
        760, 333, 400, 564, 300, 300, 333, 500, 453, 250, 333, 300, 310, 500, 750, 750,
        750, 444, 722, 722, 722, 722, 722, 722, 889, 667, 611, 611, 611, 611, 333, 333,
        333, 333, 722, 722, 722, 722, 722, 722, 722, 564, 722, 722, 722, 722, 722, 722,
        556, 500, 444, 444, 444, 444, 444, 444, 667, 444, 444, 444, 444, 444, 278, 278,
        278, 278, 500, 500, 500, 500, 500, 500, 500, 564, 500, 500, 500, 500, 500, 500,
        500, 500
    ];
    static _timesRomanBoldWidth: number[] =
    [
        250, 333, 555, 500, 500, 1000, 833, 278, 333, 333, 500, 570, 250, 333,
        250, 278, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 333, 333, 570, 570,
        570, 500, 930, 722, 667, 722, 722, 667, 611, 778, 778, 389, 500, 778, 667, 944,
        722, 778, 611, 778, 722, 556, 667, 722, 722, 1000, 722, 722, 667, 333, 278, 333,
        581, 500, 333, 500, 556, 444, 556, 444, 333, 500, 556, 278, 333, 556, 278, 833,
        556, 500, 556, 556, 444, 389, 333, 556, 500, 722, 500, 500, 444, 394, 220, 394,
        520, 0, 500, 0, 333, 500, 500, 1000, 500, 500, 333, 1000, 556, 333, 1000, 0,
        667, 0, 0, 333, 333, 500, 500, 350, 500, 1000, 333, 1000, 389, 333, 722, 0,
        444, 722, 0, 333, 500, 500, 500, 500, 220, 500, 333, 747, 300, 500, 570, 0,
        747, 333, 400, 570, 300, 300, 333, 556, 540, 250, 333, 300, 330, 500, 750, 750,
        750, 500, 722, 722, 722, 722, 722, 722, 1000, 722, 667, 667, 667, 667, 389, 389,
        389, 389, 722, 722, 778, 778, 778, 778, 778, 570, 778, 722, 722, 722, 722, 722,
        611, 556, 500, 500, 500, 500, 500, 500, 722, 444, 444, 444, 444, 444, 278, 278,
        278, 278, 500, 556, 500, 500, 500, 500, 500, 570, 500, 556, 556, 556, 556, 500,
        556, 500
    ];
    static _timesRomanItalicWidth: number[] =
    [
        250, 333, 420, 500, 500, 833, 778, 214, 333, 333, 500, 675, 250, 333,
        250, 278, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 333, 333, 675, 675,
        675, 500, 920, 611, 611, 667, 722, 611, 611, 722, 722, 333, 444, 667, 556, 833,
        667, 722, 611, 722, 611, 500, 556, 722, 611, 833, 611, 556, 556, 389, 278, 389,
        422, 500, 333, 500, 500, 444, 500, 444, 278, 500, 500, 278, 278, 444, 278, 722,
        500, 500, 500, 500, 389, 389, 278, 500, 444, 667, 444, 444, 389, 400, 275, 400,
        541, 0, 500, 0, 333, 500, 556, 889, 500, 500, 333, 1000, 500, 333, 944, 0,
        556, 0, 0, 333, 333, 556, 556, 350, 500, 889, 333, 980, 389, 333, 667, 0,
        389, 556, 0, 389, 500, 500, 500, 500, 275, 500, 333, 760, 276, 500, 675, 0,
        760, 333, 400, 675, 300, 300, 333, 500, 523, 250, 333, 300, 310, 500, 750, 750,
        750, 500, 611, 611, 611, 611, 611, 611, 889, 667, 611, 611, 611, 611, 333, 333,
        333, 333, 722, 667, 722, 722, 722, 722, 722, 675, 722, 722, 722, 722, 722, 556,
        611, 500, 500, 500, 500, 500, 500, 500, 667, 444, 444, 444, 444, 444, 278, 278,
        278, 278, 500, 500, 500, 500, 500, 500, 500, 675, 500, 500, 500, 500, 500, 444,
        500, 444
    ];
    static _timesRomanBoldItalicWidths: number[] =
    [
        250, 389, 555, 500, 500, 833, 778, 278, 333, 333, 500, 570, 250, 333,
        250, 278, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 333, 333, 570, 570,
        570, 500, 832, 667, 667, 667, 722, 667, 667, 722, 778, 389, 500, 667, 611, 889,
        722, 722, 611, 722, 667, 556, 611, 722, 667, 889, 667, 611, 611, 333, 278, 333,
        570, 500, 333, 500, 500, 444, 500, 444, 333, 500, 556, 278, 278, 500, 278, 778,
        556, 500, 500, 500, 389, 389, 278, 556, 444, 667, 500, 444, 389, 348, 220, 348,
        570, 0, 500, 0, 333, 500, 500, 1000, 500, 500, 333, 1000, 556, 333, 944, 0,
        611, 0, 0, 333, 333, 500, 500, 350, 500, 1000, 333, 1000, 389, 333, 722, 0,
        389, 611, 0, 389, 500, 500, 500, 500, 220, 500, 333, 747, 266, 500, 606, 0,
        747, 333, 400, 570, 300, 300, 333, 576, 500, 250, 333, 300, 300, 500, 750, 750,
        750, 500, 667, 667, 667, 667, 667, 667, 944, 667, 667, 667, 667, 667, 389, 389,
        389, 389, 722, 722, 722, 722, 722, 722, 722, 570, 722, 722, 722, 722, 722, 611,
        611, 500, 500, 500, 500, 500, 500, 500, 722, 444, 444, 444, 444, 444, 278, 278,
        278, 278, 500, 556, 500, 500, 500, 500, 500, 570, 500, 556, 556, 556, 556, 444,
        500, 444
    ];
    static _symbolWidth: number[] =
    [
        250, 333, 713, 500, 549, 833, 778, 439, 333, 333, 500, 549, 250, 549,
        250, 278, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 278, 278,
        549, 549, 549, 444, 549, 722, 667, 722, 612, 611, 763, 603, 722, 333,
        631, 722, 686, 889, 722, 722, 768, 741, 556, 592, 611, 690, 439, 768,
        645, 795, 611, 333, 863, 333, 658, 500, 500, 631, 549, 549, 494, 439,
        521, 411, 603, 329, 603, 549, 549, 576, 521, 549, 549, 521, 549, 603,
        439, 576, 713, 686, 493, 686, 494, 480, 200, 480, 549, 750, 620, 247,
        549, 167, 713, 500, 753, 753, 753, 753, 1042, 987, 603, 987, 603, 400,
        549, 411, 549, 549, 713, 494, 460, 549, 549, 549, 549, 1000, 603, 1000,
        658, 823, 686, 795, 987, 768, 768, 823, 768, 768, 713, 713, 713, 713,
        713, 713, 713, 768, 713, 790, 790, 890, 823, 549, 250, 713, 603, 603,
        1042, 987, 603, 987, 603, 494, 329, 790, 790, 786, 713, 384, 384, 384,
        384, 384, 384, 494, 494, 494, 494, 329, 274, 686, 686, 686, 384, 384,
        384, 384, 384, 384, 494, 494, 494, -1
    ];
    static _zapfDingbatsWidth: number[] =
    [
        278, 974, 961, 974, 980, 719, 789, 790, 791, 690, 960, 939, 549, 855,
        911, 933, 911, 945, 974, 755, 846, 762, 761, 571, 677, 763, 760, 759,
        754, 494, 552, 537, 577, 692, 786, 788, 788, 790, 793, 794, 816, 823,
        789, 841, 823, 833, 816, 831, 923, 744, 723, 749, 790, 792, 695, 776,
        768, 792, 759, 707, 708, 682, 701, 826, 815, 789, 789, 707, 687, 696,
        689, 786, 787, 713, 791, 785, 791, 873, 761, 762, 762, 759, 759, 892,
        892, 788, 784, 438, 138, 277, 415, 392, 392, 668, 668, 390, 390, 317,
        317, 276, 276, 509, 509, 410, 410, 234, 234, 334, 334, 732, 544, 544,
        910, 667, 760, 760, 776, 595, 694, 626, 788, 788, 788, 788, 788, 788,
        788, 788, 788, 788, 788, 788, 788, 788, 788, 788, 788, 788, 788, 788,
        788, 788, 788, 788, 788, 788, 788, 788, 788, 788, 788, 788, 788, 788,
        788, 788, 788, 788, 788, 788, 894, 838, 1016, 458, 748, 924, 748, 918,
        927, 928, 928, 834, 873, 828, 924, 924, 917, 930, 931, 463, 883, 836,
        836, 867, 867, 696, 696, 874, 874, 760, 946, 771, 865, 771, 888, 967,
        888, 831, 873, 927, 970, 918
    ];
    static _getMetrics(fontFamily: PdfFontFamily, fontStyle: PdfFontStyle): _PdfFontMetrics {
        let metrics: _PdfFontMetrics = null;
        switch (fontFamily) {
        case PdfFontFamily.helvetica:
        {
            metrics = this._getHelveticaMetrics(fontStyle);
            metrics._name = 'Helvetica';
            break;
        }
        case PdfFontFamily.courier:
            metrics = this._getCourierMetrics(fontStyle);
            metrics._name = 'Courier';
            break;
        case PdfFontFamily.timesRoman:
            metrics = this._getTimesMetrics(fontStyle);
            metrics._name = 'TimesRoman';
            break;
        case PdfFontFamily.symbol:
            metrics = this._getSymbolMetrics();
            metrics._name = 'Symbol';
            break;
        case PdfFontFamily.zapfDingbats:
            metrics = this._getZapfDingbatsMetrics();
            metrics._name = 'ZapfDingbats';
            break;
        default:
            metrics = this._getHelveticaMetrics(fontStyle);
            metrics._name = 'Helvetica';
            break;
        }
        metrics._subScriptSizeFactor = _PdfStandardFontMetricsFactory._subSuperScriptFactor;
        metrics._superscriptSizeFactor = _PdfStandardFontMetricsFactory._subSuperScriptFactor;
        return metrics;
    }
    static _getHelveticaMetrics(fontStyle: PdfFontStyle): _PdfFontMetrics {
        const metrics: _PdfFontMetrics = new _PdfFontMetrics();
        if ((fontStyle & PdfFontStyle.bold) > 0 && (fontStyle & PdfFontStyle.italic) > 0) {
            metrics._postScriptName = this._helveticaBoldItalicName;
            metrics._widthTable = new _StandardWidthTable(this._arialBoldWidth);
        } else if ((fontStyle & PdfFontStyle.bold) > 0) {
            metrics._postScriptName = this._helveticaBoldName;
            metrics._widthTable = new _StandardWidthTable(this._arialBoldWidth);
        } else if ((fontStyle & PdfFontStyle.italic) > 0) {
            metrics._postScriptName = this._helveticaItalicName;
            metrics._widthTable = new _StandardWidthTable(this._arialWidth);
        } else {
            metrics._postScriptName = this._helveticaName;
            metrics._widthTable = new _StandardWidthTable(this._arialWidth);
        }
        return metrics;
    }
    static _getCourierMetrics(fontStyle: PdfFontStyle): _PdfFontMetrics {
        const metrics: _PdfFontMetrics = new _PdfFontMetrics();
        if ((fontStyle & PdfFontStyle.bold) > 0 && (fontStyle & PdfFontStyle.italic) > 0) {
            metrics._postScriptName = this._courierBoldItalicName;
            metrics._widthTable = new _StandardWidthTable(this._fixedWidth);
        } else if ((fontStyle & PdfFontStyle.bold) > 0) {
            metrics._postScriptName = this._courierBoldName;
            metrics._widthTable = new _StandardWidthTable(this._fixedWidth);
        } else if ((fontStyle & PdfFontStyle.italic) > 0) {
            metrics._postScriptName = this._courierItalicName;
            metrics._widthTable = new _StandardWidthTable(this._fixedWidth);
        } else {
            metrics._postScriptName = this._courierName;
            metrics._widthTable = new _StandardWidthTable(this._fixedWidth);
        }
        return metrics;
    }
    static _getTimesMetrics(fontStyle: PdfFontStyle): _PdfFontMetrics {
        const metrics: _PdfFontMetrics = new _PdfFontMetrics();
        if ((fontStyle & PdfFontStyle.bold) > 0 && (fontStyle & PdfFontStyle.italic) > 0) {
            metrics._postScriptName = this._timesBoldItalicName;
            metrics._widthTable = new _StandardWidthTable(this._timesRomanBoldItalicWidths);
        } else if ((fontStyle & PdfFontStyle.bold) > 0) {
            metrics._postScriptName = this._timesBoldName;
            metrics._widthTable = new _StandardWidthTable(this._timesRomanBoldWidth);
        } else if ((fontStyle & PdfFontStyle.italic) > 0) {
            metrics._postScriptName = this._timesItalicName;
            metrics._widthTable = new _StandardWidthTable(this._timesRomanItalicWidth);
        } else {
            metrics._postScriptName = this._timesName;
            metrics._widthTable = new _StandardWidthTable(this._timesRomanWidth);
        }
        return metrics;
    }
    static _getSymbolMetrics(): _PdfFontMetrics {
        const metrics: _PdfFontMetrics = new _PdfFontMetrics();
        metrics._postScriptName = this._symbolName;
        metrics._widthTable = new _StandardWidthTable(this._symbolWidth);
        return metrics;
    }
    static _getZapfDingbatsMetrics(): _PdfFontMetrics {
        const metrics: _PdfFontMetrics = new _PdfFontMetrics();
        metrics._postScriptName = this._zapfDingbatsName;
        metrics._widthTable = new _StandardWidthTable(this._zapfDingbatsWidth);
        return metrics;
    }
}
export class _PdfCjkStandardFontMetricsFactory {
    static readonly _subSuperScriptFactor: number = 1.52;
    static _getHanyangSystemsGothicMedium(fontStyle: PdfFontStyle): _PdfFontMetrics {
        const metrics: _PdfFontMetrics = new _PdfFontMetrics();
        const widthTable: _CjkWidthTable = new _CjkWidthTable(1000);
        widthTable._add(new _CjkSameWidth(1, 127, 500));
        widthTable._add(new _CjkSameWidth(8094, 8190, 500));
        metrics._widthTable = widthTable;
        if ((fontStyle & PdfFontStyle.bold) !== 0 && (fontStyle & PdfFontStyle.italic) !== 0) {
            metrics._postScriptName = 'HYGoThic-Medium,BoldItalic';
        } else if ((fontStyle & PdfFontStyle.bold) !== 0) {
            metrics._postScriptName = 'HYGoThic-Medium,Bold';
        } else if ((fontStyle & PdfFontStyle.italic) !== 0) {
            metrics._postScriptName = 'HYGoThic-Medium,Italic';
        } else {
            metrics._postScriptName = 'HYGoThic-Medium';
        }
        return metrics;
    }
    static _getHanyangSystemsShinMyeongJoMedium(fontStyle: PdfFontStyle): _PdfFontMetrics {
        const metrics: _PdfFontMetrics = new _PdfFontMetrics();
        const widthTable: _CjkWidthTable = new _CjkWidthTable(1000);
        widthTable._add(new _CjkSameWidth(1, 95, 500));
        widthTable._add(new _CjkSameWidth(8094, 8190, 500));
        metrics._widthTable = widthTable;
        if ((fontStyle & PdfFontStyle.bold) !== 0 && (fontStyle & PdfFontStyle.italic) !== 0) {
            metrics._postScriptName = 'HYSMyeongJo-Medium,BoldItalic';
        } else if ((fontStyle & PdfFontStyle.bold) !== 0) {
            metrics._postScriptName = 'HYSMyeongJo-Medium,Bold';
        } else if ((fontStyle & PdfFontStyle.italic) !== 0) {
            metrics._postScriptName = 'HYSMyeongJo-Medium,Italic';
        } else {
            metrics._postScriptName = 'HYSMyeongJo-Medium';
        }
        return metrics;
    }
    static _getHeiseiKakuGothicW5(fontStyle: PdfFontStyle): _PdfFontMetrics {
        const metrics: _PdfFontMetrics = new _PdfFontMetrics();
        const widthTable: _CjkWidthTable = new _CjkWidthTable(1000);
        widthTable._add(new _CjkSameWidth(1, 95, 500));
        widthTable._add(new _CjkSameWidth(231, 632, 500));
        metrics._widthTable = widthTable;
        if ((fontStyle & PdfFontStyle.bold) !== 0 && (fontStyle & PdfFontStyle.italic) !== 0) {
            metrics._postScriptName = 'HeiseiKakuGo-W5,BoldItalic';
        } else if ((fontStyle & PdfFontStyle.bold) !== 0) {
            metrics._postScriptName = 'HeiseiKakuGo-W5,Bold';
        } else if ((fontStyle & PdfFontStyle.italic) !== 0) {
            metrics._postScriptName = 'HeiseiKakuGo-W5,Italic';
        } else {
            metrics._postScriptName = 'HeiseiKakuGo-W5';
        }
        return metrics;
    }
    static _getHeiseiMinchoW3(fontStyle: PdfFontStyle): _PdfFontMetrics {
        const metrics: _PdfFontMetrics = new _PdfFontMetrics();
        const widthTable: _CjkWidthTable = new _CjkWidthTable(1000);
        widthTable._add(new _CjkSameWidth(1, 95, 500));
        widthTable._add(new _CjkSameWidth(231, 632, 500));
        metrics._widthTable = widthTable;
        if ((fontStyle & PdfFontStyle.bold) !== 0 && (fontStyle & PdfFontStyle.italic) !== 0){
            metrics._postScriptName = 'HeiseiMin-W3,BoldItalic';
        } else if ((fontStyle & PdfFontStyle.bold) !== 0) {
            metrics._postScriptName = 'HeiseiMin-W3,Bold';
        } else if ((fontStyle & PdfFontStyle.italic) !== 0) {
            metrics._postScriptName = 'HeiseiMin-W3,Italic';
        } else {
            metrics._postScriptName = 'HeiseiMin-W3';
        }
        return metrics;
    }
    static _getMonotypeHeiMedium(fontStyle: PdfFontStyle): _PdfFontMetrics {
        const metrics: _PdfFontMetrics = new _PdfFontMetrics();
        const widthTable: _CjkWidthTable = new _CjkWidthTable(1000);
        widthTable._add(new _CjkSameWidth(1, 95, 500));
        widthTable._add(new _CjkSameWidth(13648, 13742, 500));
        metrics._widthTable = widthTable;
        if ((fontStyle & PdfFontStyle.bold) !== 0 && (fontStyle & PdfFontStyle.italic) !== 0) {
            metrics._postScriptName = 'MHei-Medium,BoldItalic';
        } else if ((fontStyle & PdfFontStyle.bold) !== 0) {
            metrics._postScriptName = 'MHei-Medium,Bold';
        } else if ((fontStyle & PdfFontStyle.italic) !== 0) {
            metrics._postScriptName = 'MHei-Medium,Italic';
        } else {
            metrics._postScriptName = 'MHei-Medium';
        }
        return metrics;
    }
    static _getMonotypeSungLight(fontStyle: PdfFontStyle): _PdfFontMetrics {
        const metrics: _PdfFontMetrics = new _PdfFontMetrics();
        const widthTable: _CjkWidthTable = new _CjkWidthTable(1000);
        widthTable._add(new _CjkSameWidth(1, 95, 500));
        widthTable._add(new _CjkSameWidth(13648, 13742, 500));
        metrics._widthTable = widthTable;
        if ((fontStyle & PdfFontStyle.bold) !== 0 && (fontStyle & PdfFontStyle.italic) !== 0) {
            metrics._postScriptName = 'MSung-Light,BoldItalic';
        } else if ((fontStyle & PdfFontStyle.bold) !== 0) {
            metrics._postScriptName = 'MSung-Light,Bold';
        } else if ((fontStyle & PdfFontStyle.italic) !== 0) {
            metrics._postScriptName = 'MSung-Light,Italic';
        } else {
            metrics._postScriptName = 'MSung-Light';
        }
        return metrics;
    }
    static _getSinoTypeSongLight(fontStyle: PdfFontStyle): _PdfFontMetrics {
        const metrics: _PdfFontMetrics = new _PdfFontMetrics();
        const widthTable: _CjkWidthTable = new _CjkWidthTable(1000);
        widthTable._add(new _CjkSameWidth(1, 95, 500));
        widthTable._add(new _CjkSameWidth(814, 939, 500));
        widthTable._add(new _CjkDifferentWidth(7712, [500]));
        widthTable._add(new _CjkDifferentWidth(7716, [500]));
        if ((fontStyle & PdfFontStyle.bold) !== 0 && (fontStyle & PdfFontStyle.italic) !== 0) {
            metrics._postScriptName = 'STSong-Light,BoldItalic';
        } else if ((fontStyle & PdfFontStyle.bold) !== 0) {
            metrics._postScriptName = 'STSong-Light,Bold';
        } else if ((fontStyle & PdfFontStyle.italic) !== 0) {
            metrics._postScriptName = 'STSong-Light,Italic';
        } else {
            metrics._postScriptName = 'STSong-Light';
        }
        metrics._widthTable = widthTable;
        return metrics;
    }
    static _getMetrics(fontFamily: PdfCjkFontFamily, fontStyle: PdfFontStyle): _PdfFontMetrics {
        let metrics: _PdfFontMetrics;
        switch (fontFamily) {
        case PdfCjkFontFamily.hanyangSystemsGothicMedium:
            metrics = this._getHanyangSystemsGothicMedium(fontStyle);
            metrics._name = 'HanyangSystemsGothicMedium';
            break;
        case PdfCjkFontFamily.hanyangSystemsShinMyeongJoMedium:
            metrics = this._getHanyangSystemsShinMyeongJoMedium(fontStyle);
            metrics._name = 'HanyangSystemsShinMyeongJoMedium';
            break;
        case PdfCjkFontFamily.heiseiKakuGothicW5:
            metrics = this._getHeiseiKakuGothicW5(fontStyle);
            metrics._name = 'HeiseiKakuGothicW5';
            break;
        case PdfCjkFontFamily.heiseiMinchoW3:
            metrics = this._getHeiseiMinchoW3(fontStyle);
            metrics._name = 'HeiseiMinchoW3';
            break;
        case PdfCjkFontFamily.monotypeHeiMedium:
            metrics = this._getMonotypeHeiMedium(fontStyle);
            metrics._name = 'MonotypeHeiMedium';
            break;
        case PdfCjkFontFamily.monotypeSungLight:
            metrics = this._getMonotypeSungLight(fontStyle);
            metrics._name = 'MonotypeSungLight';
            break;
        case PdfCjkFontFamily.sinoTypeSongLight:
            metrics = this._getSinoTypeSongLight(fontStyle);
            metrics._name = 'SinoTypeSongLight';
            break;
        }
        metrics._subScriptSizeFactor = this._subSuperScriptFactor;
        metrics._superscriptSizeFactor = this._subSuperScriptFactor;
        return metrics;
    }
}
export class _PdfCjkFontDescriptorFactory {
    static _fillMonotypeSungLight(fontDescriptor: _PdfDictionary, fontFamily: PdfCjkFontFamily, fontMetrics: _PdfFontMetrics,
                                  ascent: number, descent: number): void {
        const fontBox: {x: number, y: number, width: number, height: number} = {x: -160, y: -249, width: 1175, height: 1137};
        this._fillFontBox(fontDescriptor, fontBox);
        this._fillKnownInformation(fontDescriptor, fontFamily, fontMetrics, ascent, descent);
        fontDescriptor.set('StemV', 93);
        fontDescriptor.set('StemH', 93);
        fontDescriptor.set('AvgWidth', 1000);
        fontDescriptor.set('MaxWidth', 1000);
        fontDescriptor.set('CapHeight', 880);
        fontDescriptor.set('XHeight', 616);
        fontDescriptor.set('Leading', 250);
    }
    static _fillHeiseiKakuGothicW5(fontDescriptor: _PdfDictionary,
                                   fontStyle: PdfFontStyle,
                                   fontFamily: PdfCjkFontFamily,
                                   fontMetrics: _PdfFontMetrics,
                                   ascent: number, descent: number): void {
        const fontBox: {x: number, y: number, width: number, height: number} = {x: -92, y: -250, width: 1102, height: 1172};
        const fontBoxItalic: {x: number, y: number, width: number, height: number} = {x: -92, y: -250, width: 1102, height: 1932};
        if ((fontStyle & (PdfFontStyle.italic | PdfFontStyle.bold)) !== PdfFontStyle.italic) {
            this._fillFontBox(fontDescriptor, fontBox);
        } else {
            this._fillFontBox(fontDescriptor, fontBoxItalic);
        }
        this._fillKnownInformation(fontDescriptor, fontFamily, fontMetrics, ascent, descent);
        fontDescriptor.set('StemV', 93);
        fontDescriptor.set('StemH', 93);
        fontDescriptor.set('AvgWidth', 689);
        fontDescriptor.set('MaxWidth', 1000);
        fontDescriptor.set('CapHeight', 718);
        fontDescriptor.set('XHeight', 500);
        fontDescriptor.set('Leading', 250);
    }
    static _fillHanyangSystemsShinMyeongJoMedium(fontDescriptor: _PdfDictionary,
                                                 fontFamily: PdfCjkFontFamily,
                                                 fontMetrics: _PdfFontMetrics,
                                                 ascent: number, descent: number): void {
        const fontBox: {x: number, y: number, width: number, height: number} = {x: 0, y: -148, width: 1001, height: 1028};
        this._fillFontBox(fontDescriptor, fontBox);
        this._fillKnownInformation(fontDescriptor, fontFamily, fontMetrics, ascent, descent);
        fontDescriptor.set('StemV', 93);
        fontDescriptor.set('StemH', 93);
        fontDescriptor.set('AvgWidth', 1000);
        fontDescriptor.set('MaxWidth', 1000);
        fontDescriptor.set('CapHeight', 880);
        fontDescriptor.set('XHeight', 616);
        fontDescriptor.set('Leading', 250);
    }
    static _fillHeiseiMinchoW3(fontDescriptor: _PdfDictionary, fontFamily: PdfCjkFontFamily, fontMetrics: _PdfFontMetrics,
                               ascent: number, descent: number): void {
        const fontBox: {x: number, y: number, width: number, height: number} = {x: -123, y: -257, width: 1124, height: 1167};
        this._fillFontBox(fontDescriptor, fontBox);
        this._fillKnownInformation(fontDescriptor, fontFamily, fontMetrics, ascent, descent);
        fontDescriptor.set('StemV', 93);
        fontDescriptor.set('StemH', 93);
        fontDescriptor.set('AvgWidth', 702);
        fontDescriptor.set('MaxWidth', 1000);
        fontDescriptor.set('CapHeight', 718);
        fontDescriptor.set('XHeight', 500);
        fontDescriptor.set('Leading', 250);
    }
    static _fillSinoTypeSongLight(fontDescriptor: _PdfDictionary, fontFamily: PdfCjkFontFamily, fontMetrics: _PdfFontMetrics,
                                  ascent: number, descent: number): void {
        const fontBox: {x: number, y: number, width: number, height: number} = {x: -25, y: -254, width: 1025, height: 1134};
        this._fillFontBox(fontDescriptor, fontBox);
        this._fillKnownInformation(fontDescriptor, fontFamily, fontMetrics, ascent, descent);
        fontDescriptor.set('StemV', 93);
        fontDescriptor.set('StemH', 93);
        fontDescriptor.set('AvgWidth', 1000);
        fontDescriptor.set('MaxWidth', 1000);
        fontDescriptor.set('CapHeight', 880);
        fontDescriptor.set('XHeight', 616);
        fontDescriptor.set('Leading', 250);
    }
    static _fillMonotypeHeiMedium(fontDescriptor: _PdfDictionary, fontFamily: PdfCjkFontFamily, fontMetrics: _PdfFontMetrics,
                                  ascent: number, descent: number): void {
        const fontBox: {x: number, y: number, width: number, height: number} = {x: -45, y: -250, width: 1060, height: 1137};
        this._fillFontBox(fontDescriptor, fontBox);
        this._fillKnownInformation(fontDescriptor, fontFamily, fontMetrics, ascent, descent);
        fontDescriptor.set('StemV', 93);
        fontDescriptor.set('StemH', 93);
        fontDescriptor.set('AvgWidth', 1000);
        fontDescriptor.set('MaxWidth', 1000);
        fontDescriptor.set('CapHeight', 880);
        fontDescriptor.set('XHeight', 616);
        fontDescriptor.set('Leading', 250);
    }
    static _fillHanyangSystemsGothicMedium(fontDescriptor: _PdfDictionary,
                                           fontFamily: PdfCjkFontFamily,
                                           fontMetrics: _PdfFontMetrics,
                                           ascent: number, descent: number): void {
        const fontBox: {x: number, y: number, width: number, height: number} = {x: -6, y: -145, width: 1009, height: 1025};
        this._fillFontBox(fontDescriptor, fontBox);
        this._fillKnownInformation(fontDescriptor, fontFamily, fontMetrics, ascent, descent);
        fontDescriptor.set('Flags', 4);
        fontDescriptor.set('StemV', 93);
        fontDescriptor.set('StemH', 93);
        fontDescriptor.set('AvgWidth', 1000);
        fontDescriptor.set('MaxWidth', 1000);
        fontDescriptor.set('CapHeight', 880);
        fontDescriptor.set('XHeight', 616);
        fontDescriptor.set('Leading', 250);
    }
    static _fillFontBox(fontDescriptor: _PdfDictionary, fontBox: {x: number, y: number, width: number, height: number}): void {
        fontDescriptor.set('FontBBox', _fromRectangle(fontBox));
    }
    static _fillKnownInformation(fontDescriptor: _PdfDictionary, fontFamily: PdfCjkFontFamily, fontMetrics: _PdfFontMetrics,
                                 ascent: number, descent: number): void {
        fontDescriptor.set('FontName' , _PdfName.get(fontMetrics._postScriptName));
        fontDescriptor.set('Type' , _PdfName.get('FontDescriptor'));
        fontDescriptor.set('ItalicAngle' , 0);
        fontDescriptor.set('MissingWidth' , (fontMetrics._widthTable as _CjkWidthTable)._defaultWidth);
        fontDescriptor.set('Ascent', ascent);
        fontDescriptor.set('Descent', descent);
        switch (fontFamily) {
        case PdfCjkFontFamily.monotypeHeiMedium:
        case PdfCjkFontFamily.hanyangSystemsGothicMedium:
        case PdfCjkFontFamily.heiseiKakuGothicW5:
            fontDescriptor.set('Flags', 4);
            break;
        case PdfCjkFontFamily.sinoTypeSongLight:
        case PdfCjkFontFamily.monotypeSungLight:
        case PdfCjkFontFamily.hanyangSystemsShinMyeongJoMedium:
        case PdfCjkFontFamily.heiseiMinchoW3:
            fontDescriptor.set('Flags', 6);
            break;
        }
    }
    static _getFontDescriptor(fontFamily: PdfCjkFontFamily, fontStyle: PdfFontStyle, fontMetrics: _PdfFontMetrics,
                              ascent: number, descent: number): _PdfDictionary {
        const fontDescriptor: _PdfDictionary = new _PdfDictionary();
        fontDescriptor._updated = true;
        switch (fontFamily) {
        case PdfCjkFontFamily.hanyangSystemsGothicMedium:
            this._fillHanyangSystemsGothicMedium(fontDescriptor, fontFamily, fontMetrics, ascent, descent);
            break;

        case PdfCjkFontFamily.hanyangSystemsShinMyeongJoMedium:
            this._fillHanyangSystemsShinMyeongJoMedium(fontDescriptor, fontFamily, fontMetrics, ascent, descent);
            break;

        case PdfCjkFontFamily.heiseiKakuGothicW5:
            this._fillHeiseiKakuGothicW5(fontDescriptor, fontStyle, fontFamily, fontMetrics, ascent, descent);
            break;

        case PdfCjkFontFamily.heiseiMinchoW3:
            this._fillHeiseiMinchoW3(fontDescriptor, fontFamily, fontMetrics, ascent, descent);
            break;

        case PdfCjkFontFamily.monotypeHeiMedium:
            this._fillMonotypeHeiMedium(fontDescriptor, fontFamily, fontMetrics, ascent, descent);
            break;

        case PdfCjkFontFamily.monotypeSungLight:
            this._fillMonotypeSungLight(fontDescriptor, fontFamily, fontMetrics, ascent, descent);
            break;

        case PdfCjkFontFamily.sinoTypeSongLight:
            this._fillSinoTypeSongLight(fontDescriptor, fontFamily, fontMetrics, ascent, descent);
            break;
        default:
            break;
        }
        return fontDescriptor;
    }
}
/**
 * Public enum to define font style.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Gets the first page
 * let page: PdfPage = document.getPage(0) as PdfPage;
 * // Create a new PDF standard font
 * let font: PdfStandardFont = document.embedFont(PdfFontFamily.helvetica, 10, PdfFontStyle.regular);
 * // Create a new PDF string format
 * let format: PdfStringFormat = new PdfStringFormat(PdfTextAlignment.right, PdfVerticalAlignment.bottom);
 * // Draw the text
 * page.graphics.drawString('Helvetica', font, {x: 0, y: 180, width: page.size.width, height: 40}, new PdfBrush({r: 0, g: 0, b: 255}), format);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PdfFontStyle {
    /**
     * Specifies the font style `regular`.
     */
    regular = 0,
    /**
     * Specifies the font style `bold`.
     */
    bold = 1,
    /**
     * Specifies the font style `italic`.
     */
    italic = 2,
    /**
     * Specifies the font style `underline`.
     */
    underline = 4,
    /**
     * Specifies the font style `strikeout`.
     */
    strikeout = 8
}
/**
 * Public enum to define font family.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Gets the first page
 * let page: PdfPage = document.getPage(0) as PdfPage;
 * // Create a new PDF standard font
 * let font: PdfStandardFont = document.embedFont(PdfFontFamily.helvetica, 10, PdfFontStyle.regular);
 * // Create a new PDF string format
 * let format: PdfStringFormat = new PdfStringFormat(PdfTextAlignment.right, PdfVerticalAlignment.bottom);
 * // Draw the text
 * page.graphics.drawString('Helvetica', font, {x: 0, y: 180, width: page.size.width, height: 40}, new PdfBrush({r: 0, g: 0, b: 255}), format);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PdfFontFamily {
    /**
     * Specifies the `helvetica` font family.
     */
    helvetica,
    /**
     * Specifies the `courier` font family.
     */
    courier,
    /**
     * Specifies the `timesRoman` font family.
     */
    timesRoman,
    /**
     * Specifies the `symbol` font family.
     */
    symbol,
    /**
     * Specifies the `zapfDingbats` font family.
     */
    zapfDingbats
}
/**
 * Public enum to define CJK font family.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Gets the first page
 * let page: PdfPage = document.getPage(0) as PdfPage;
 * // Create a new PDF CJK standard font
 * let font: PdfCjkStandardFont = document.embedFont(PdfCjkFontFamily.heiseiMinchoW3, 20, PdfFontStyle.regular, true);
 * // Create a new PDF string format
 * let format: PdfStringFormat = new PdfStringFormat(PdfTextAlignment.right, PdfVerticalAlignment.bottom);
 * // Draw the text
 * page.graphics.drawString('こんにちは世界', font, {x: 0, y: 180, width: page.size.width, height: 40}, new PdfBrush({r: 0, g: 0, b: 255}), format);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PdfCjkFontFamily {
    /**
     * Specifies the `heiseiKakuGothicW5` CJK font family.
     */
    heiseiKakuGothicW5,
    /**
     * Specifies the `heiseiMinchoW3` CJK font family.
     */
    heiseiMinchoW3,
    /**
     * Specifies the `hanyangSystemsGothicMedium` CJK font family.
     */
    hanyangSystemsGothicMedium,
    /**
     * Specifies the `hanyangSystemsShinMyeongJoMedium` CJK font family.
     */
    hanyangSystemsShinMyeongJoMedium,
    /**
     * Specifies the `monotypeHeiMedium` CJK font family.
     */
    monotypeHeiMedium,
    /**
     * Specifies the `monotypeSungLight` CJK font family.
     */
    monotypeSungLight,
    /**
     * Specifies the `sinoTypeSongLight` CJK font family.
     */
    sinoTypeSongLight
}
export class _UnicodeLine {
    _result: boolean = false;
    _glyphIndex: number[] = [];
}
export type _FontData =
  | { type: 'standard'; family: PdfFontFamily; style: PdfFontStyle }
  | { type: 'cjk'; family: PdfCjkFontFamily; style: PdfFontStyle }
  | { type: 'ttf'; data: Uint8Array };
export type _PdfFontPrimitive = {
    dictionary: _PdfDictionary,
    metrices: _PdfFontMetrics,
    fontInternal?: _UnicodeTrueTypeFont
};
