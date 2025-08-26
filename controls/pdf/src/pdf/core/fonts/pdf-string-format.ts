import { PdfTextAlignment, PdfTextDirection, PdfSubSuperScript, _PdfWordWrapType } from './../enumerator';
/**
 * Represents the text layout information.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Gets the first page
 * let page: PdfPage = document.getPage(0) as PdfPage;
 * // Create a new PDF standard font
 * let font: PdfStandardFont = new PdfStandardFont(PdfFontFamily.Helvetica, 10);
 * // Create a new PDF string format
 * let format: PdfStringFormat = new PdfStringFormat(PdfTextAlignment.right, PdfVerticalAlignment.bottom);
 * // Draw the text
 * page.graphics.drawString('Helvetica', font, [0, 180, page.size[0], 40], undefined, new PdfBrush([0, 0, 255]), format);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfStringFormat {
    alignment: PdfTextAlignment;
    lineLimit: boolean;
    lineAlignment: PdfVerticalAlignment;
    characterSpacing: number;
    wordSpacing: number;
    lineSpacing: number;
    clipPath: boolean;
    horizontalScalingFactor: number = 100.0;
    firstLineIndent: number;
    measureTrailingSpaces: boolean;
    noClip: boolean;
    _internalParagraphIndent: number;
    textDirection: PdfTextDirection;
    rightToLeft: boolean = false;
    _pdfSubSuperScript: PdfSubSuperScript;
    _wordWrapType: _PdfWordWrapType = _PdfWordWrapType.word;
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
     * let font: PdfStandardFont = new PdfStandardFont(PdfFontFamily.Helvetica, 10);
     * // Create a new PDF string format
     * let format: PdfStringFormat = new PdfStringFormat();
     * // Draw the text
     * page.graphics.drawString('Helvetica', font, [0, 180, page.size[0], 40], undefined, new PdfBrush([0, 0, 255]), format);
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
     * let font: PdfStandardFont = new PdfStandardFont(PdfFontFamily.Helvetica, 10);
     * // Create a new PDF string format
     * let format: PdfStringFormat = new PdfStringFormat(PdfTextAlignment.right);
     * // Draw the text
     * page.graphics.drawString('Helvetica', font, [0, 180, page.size[0], 40], undefined, new PdfBrush([0, 0, 255]), format);
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
     * let font: PdfStandardFont = new PdfStandardFont(PdfFontFamily.Helvetica, 10);
     * // Create a new PDF string format
     * let format: PdfStringFormat = new PdfStringFormat(PdfTextAlignment.right, PdfVerticalAlignment.bottom);
     * // Draw the text
     * page.graphics.drawString('Helvetica', font, [0, 180, page.size[0], 40], undefined, new PdfBrush([0, 0, 255]), format);
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
     * let font: PdfStandardFont = new PdfStandardFont(PdfFontFamily.Helvetica, 10);
     * // Create a new PDF string format
     * let format: PdfStringFormat = new PdfStringFormat(PdfTextAlignment.right);
     * // Get the default paragraph indent
     * let paragraph: number = format.paragraphIndent;
     * // Draw the text
     * page.graphics.drawString('Helvetica', font, [0, 180, page.size[0], 40], undefined, new PdfBrush([0, 0, 255]), format);
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
     * let font: PdfStandardFont = new PdfStandardFont(PdfFontFamily.Helvetica, 10);
     * // Create a new PDF string format
     * let format: PdfStringFormat = new PdfStringFormat(PdfTextAlignment.right);
     * // Set a new paragraph indent
     * format.paragraphIndent = 20;
     * // Draw the text
     * page.graphics.drawString('Helvetica', font, [0, 180, page.size[0], 40], undefined, new PdfBrush([0, 0, 255]), format);
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
     * let font: PdfStandardFont = new PdfStandardFont(PdfFontFamily.Helvetica, 10);
     * // Create a new PDF string format
     * let format: PdfStringFormat = new PdfStringFormat(PdfTextAlignment.right);
     * // Set a new paragraph indent
     * format.paragraphIndent = 20;
     * // Get the subscript or superscript mode
     * let script: PdfSubSuperScript = format.subSuperScript;
     * // Draw the text
     * page.graphics.drawString('Helvetica', font, [0, 180, page.size[0], 40], undefined, new PdfBrush([0, 0, 255]), format);
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
     * let font: PdfStandardFont = new PdfStandardFont(PdfFontFamily.Helvetica, 10);
     * // Create a new PDF string format
     * let format: PdfStringFormat = new PdfStringFormat(PdfTextAlignment.right);
     * // Set a new paragraph indent
     * format.paragraphIndent = 20;
     * // Set the subscript or superscript mode
     * format.subSuperScript = PdfSubSuperScript.subScript;
     * // Draw the text
     * page.graphics.drawString('Helvetica', font, [0, 180, page.size[0], 40], undefined, new PdfBrush([0, 0, 255]), format);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set subSuperScript(value: PdfSubSuperScript) {
        this._pdfSubSuperScript = value;
    }
    get _wordWrap(): _PdfWordWrapType {
        return this._wordWrapType;
    }
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
 * let font: PdfStandardFont = new PdfStandardFont(PdfFontFamily.Helvetica, 10, PdfFontStyle.regular);
 * // Create a new PDF string format
 * let format: PdfStringFormat = new PdfStringFormat(PdfTextAlignment.right, PdfVerticalAlignment.top);
 * // Draw the text
 * page.graphics.drawString('Helvetica', font, [0, 180, page.size[0], 40], undefined, new PdfBrush([0, 0, 255]), format);
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
