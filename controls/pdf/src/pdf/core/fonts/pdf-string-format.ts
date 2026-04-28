import { PdfTextAlignment, PdfTextDirection, PdfSubSuperScript, _PdfWordWrapType } from './../enumerator';
/**
 * Represents the text layout information.
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
export class PdfStringFormat {
    public alignment: PdfTextAlignment;
    public lineLimit: boolean;
    public lineAlignment: PdfVerticalAlignment;
    public characterSpacing: number;
    public wordSpacing: number;
    public lineSpacing: number;
    public clipPath: boolean;
    public horizontalScalingFactor: number = 100.0;
    public firstLineIndent: number;
    public measureTrailingSpaces: boolean;
    public noClip: boolean;
    /**
     * Internal paragraph indentation value used during layout.
     *
     * @private
     */
    _internalParagraphIndent: number;
    public textDirection: PdfTextDirection;
    public rightToLeft: boolean = false;
    /**
     * Tracks whether subscript or superscript formatting is applied.
     *
     * @private
     */
    _pdfSubSuperScript: PdfSubSuperScript;
    /**
     * Word wrapping behavior used during string layout.
     *
     * @private
     */
    _wordWrapType: _PdfWordWrapType = _PdfWordWrapType.word;
    /**
     * Indicates whether the formatted text represents a list item.
     *
     * @private
     */
    _isList: boolean = false;
    /**
     * Initializes a new instance of the `PdfStringFormat` class.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Gets the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Create a new PDF standard font
     * let font: PdfStandardFont = document.embedFont(PdfFontFamily.helvetica, 10, PdfFontStyle.regular);
     * // Create a new PDF string format
     * let format: PdfStringFormat = new PdfStringFormat();
     * // Draw the text
     * page.graphics.drawString('Helvetica', font, {x: 0, y: 180, width: page.size.width, height: 40}, new PdfBrush({r: 0, g: 0, b: 255}), format);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    public constructor()
    /**
     * Initializes a new instance of the `PdfStringFormat` class.
     *
     * @param {PdfTextAlignment} alignment PdfTextAlignment.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Gets the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Create a new PDF standard font
     * let font: PdfStandardFont = document.embedFont(PdfFontFamily.helvetica, 10, PdfFontStyle.regular);
     * // Create a new PDF string format
     * let format: PdfStringFormat = new PdfStringFormat(PdfTextAlignment.right);
     * // Draw the text
     * page.graphics.drawString('Helvetica', font, {x: 0, y: 180, width: page.size.width, height: 40}, new PdfBrush({r: 0, g: 0, b: 255}), format);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    public constructor(alignment: PdfTextAlignment)
    /**
     * Initializes a new instance of the `PdfStringFormat` class.
     *
     * @param {PdfTextAlignment} alignment PdfTextAlignment.
     * @param {PdfVerticalAlignment} lineAlignment PdfVerticalAlignment.
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
    public constructor(alignment: PdfTextAlignment, lineAlignment: PdfVerticalAlignment)
    public constructor(arg1?: PdfTextAlignment, arg2?: PdfVerticalAlignment) {
        this.lineLimit = true;
        if (typeof arg1 !== 'undefined') {
            this.alignment = arg1;
        }
        if (typeof arg2 !== 'undefined') {
            this.lineAlignment = arg2;
        } else {
            this.lineAlignment = PdfVerticalAlignment.top;
        }
        this.characterSpacing = 0;
        this.wordSpacing = 0;
        this.lineSpacing = 0;
        this.clipPath = false;
        this.firstLineIndent = 0;
        this._internalParagraphIndent = 0;
        this.measureTrailingSpaces = false;
        this.noClip = false;
    }
    /**
     * Gets the paragraph indent from string format.
     *
     * @returns {number} Returns the paragraph indent.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Gets the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Create a new PDF standard font
     * let font: PdfStandardFont = document.embedFont(PdfFontFamily.helvetica, 10, PdfFontStyle.regular);
     * // Create a new PDF string format
     * let format: PdfStringFormat = new PdfStringFormat(PdfTextAlignment.right);
     * // Get the default paragraph indent
     * let paragraph: number = format.paragraphIndent;
     * // Draw the text
     * page.graphics.drawString('Helvetica', font, {x: 0, y: 180, width: page.size.width, height: 40}, new PdfBrush({r: 0, g: 0, b: 255}), format);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get paragraphIndent(): number {
        return this._internalParagraphIndent;
    }
    /**
     * Sets the paragraph indent to string format.
     *
     * @param {number} value paragraph indent.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Gets the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Create a new PDF standard font
     * let font: PdfStandardFont = document.embedFont(PdfFontFamily.helvetica, 10, PdfFontStyle.regular);
     * // Create a new PDF string format
     * let format: PdfStringFormat = new PdfStringFormat(PdfTextAlignment.right);
     * // Set a new paragraph indent
     * format.paragraphIndent = 20;
     * // Draw the text
     * page.graphics.drawString('Helvetica', font, {x: 0, y: 180, width: page.size.width, height: 40}, new PdfBrush({r: 0, g: 0, b: 255}), format);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set paragraphIndent(value: number) {
        this._internalParagraphIndent = value;
        this.firstLineIndent = value;
    }
    /**
     * Gets the subscript or superscript mode from string format.
     *
     * @returns {PdfSubSuperScript} Returns the subscript or superscript mode.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Gets the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Create a new PDF standard font
     * let font: PdfStandardFont = document.embedFont(PdfFontFamily.helvetica, 10, PdfFontStyle.regular);
     * // Create a new PDF string format
     * let format: PdfStringFormat = new PdfStringFormat(PdfTextAlignment.right);
     * // Set a new paragraph indent
     * format.paragraphIndent = 20;
     * // Get the subscript or superscript mode
     * let script: PdfSubSuperScript = format.subSuperScript;
     * // Draw the text
     * page.graphics.drawString('Helvetica', font, {x: 0, y: 180, width: page.size.width, height: 40}, new PdfBrush({r: 0, g: 0, b: 255}), format);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get subSuperScript(): PdfSubSuperScript {
        if (typeof this._pdfSubSuperScript === 'undefined' || this._pdfSubSuperScript === null) {
            return PdfSubSuperScript.none;
        } else {
            return this._pdfSubSuperScript;
        }
    }
    /**
     * Sets the subscript or superscript mode to string format.
     *
     * @param {PdfSubSuperScript} value subscript or superscript mode.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Gets the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Create a new PDF standard font
     * let font: PdfStandardFont = document.embedFont(PdfFontFamily.helvetica, 10, PdfFontStyle.regular);
     * // Create a new PDF string format
     * let format: PdfStringFormat = new PdfStringFormat(PdfTextAlignment.right);
     * // Set a new paragraph indent
     * format.paragraphIndent = 20;
     * // Set the subscript or superscript mode
     * format.subSuperScript = PdfSubSuperScript.subScript;
     * // Draw the text
     * page.graphics.drawString('Helvetica', font, {x: 0, y: 180, width: page.size.width, height: 40}, new PdfBrush({r: 0, g: 0, b: 255}), format);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set subSuperScript(value: PdfSubSuperScript) {
        this._pdfSubSuperScript = value;
    }
    /**
     * Gets the internal word wrap mode used during text layout.
     *
     * @private
     * @returns {_PdfWordWrapType} for the text.
     */
    get _wordWrap(): _PdfWordWrapType {
        return this._wordWrapType;
    }
    /**
     * Sets the internal word wrap mode used during text layout.
     *
     * @private
     * @param {_PdfWordWrapType} value word wrap.
     */
    set _wordWrap(value: _PdfWordWrapType) {
        this._wordWrapType = value;
    }
}
/**
 * Public enum to define vertical alignment.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Gets the first page
 * let page: PdfPage = document.getPage(0) as PdfPage;
 * // Create a new PDF standard font
 * let font: PdfStandardFont = document.embedFont(PdfFontFamily.helvetica, 10, PdfFontStyle.regular);
 * // Create a new PDF string format
 * let format: PdfStringFormat = new PdfStringFormat(PdfTextAlignment.right, PdfVerticalAlignment.top);
 * // Draw the text
 * page.graphics.drawString('Helvetica', font, {x: 0, y: 180, width: page.size.width, height: 40}, new PdfBrush({r: 0, g: 0, b: 255}), format);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PdfVerticalAlignment {
    /**
     * Specifies the type of `top`.
     */
    top,
    /**
     * Specifies the type of `middle`.
     */
    middle,
    /**
     * Specifies the type of `bottom`.
     */
    bottom
}
