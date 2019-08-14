/**
 * PdfStringFormat.ts class for EJ2-PDF
 */
import { PdfTextAlignment, PdfVerticalAlignment, PdfTextDirection } from './../../graphics/enum';
import { PdfSubSuperScript, PdfWordWrapType } from './../../graphics/fonts/enum';
/**
 * `PdfStringFormat` class represents the text layout information on PDF.
 * ```typescript
 * // create a new PDF document
 * let document : PdfDocument = new PdfDocument();
 * // add a pages to the document
 * let page1 : PdfPage = document.pages.add();
 * // set font
 * let font : PdfStandardFont = new PdfStandardFont(PdfFontFamily.Helvetica, 20);
 * // set brush
 * let blackBrush : PdfSolidBrush = new PdfSolidBrush(new PdfColor(0, 0, 0));
 * //
 * // set the format for string
 * let stringFormat : PdfStringFormat = new PdfStringFormat();
 * // set the text alignment
 * stringFormat.alignment = PdfTextAlignment.Center;
 * // set the vertical alignment
 * stringFormat.lineAlignment = PdfVerticalAlignment.Middle;
 * //
 * // draw the text
 * page1.graphics.drawString('Hello World', font, blackBrush, new PointF(10, 10), stringFormat);
 * // save the document
 * document.save('output.pdf');
 * // destroy the document
 * document.destroy();
 * ```
 */
export class PdfStringFormat {
    // Fields
    /**
     * `Horizontal text alignment`.
     * @private
     */
    private textAlignment : PdfTextAlignment;
    /**
     * `Vertical text alignment`.
     * @private
     */
    private verticalAlignment : PdfVerticalAlignment;
    /**
     * Indicates whether `RTL` should be checked.
     * @private
     */
    private isRightToLeft : boolean;
    /**
     * `Character spacing` value.
     * @private
     */
    private internalCharacterSpacing : number;
    /**
     * `Word spacing` value.
     * @private
     */
    private internalWordSpacing : number;
    /**
     * Text `leading`.
     * @private
     */
    private leading : number;
    /**
     * Shows if the text should be a part of the current `clipping` path.
     * @private
     */
    private clip : boolean;
    /**
     * Indicates whether the text is in `subscript or superscript` mode.
     * @private
     */
    private pdfSubSuperScript : PdfSubSuperScript;
    /**
     * The `scaling factor` of the text being drawn.
     * @private
     */
    private scalingFactor : number = 100.0;
    /**
     * Indent of the `first line` in the text.
     * @private
     */
    private initialLineIndent : number;
    /**
     * Indent of the `first line` in the paragraph.
     * @private
     */
    private internalParagraphIndent : number;
    /**
     * Indicates whether entire lines are laid out in the formatting rectangle only or not[`line limit`].
     * @private
     */
    private internalLineLimit : boolean;
    /**
     * Indicates whether spaces at the end of the line should be left or removed[`measure trailing spaces`].
     * @private
     */
    private trailingSpaces : boolean;
    /**
     * Indicates whether the text region should be `clipped` or not.
     * @private
     */
    private isNoClip : boolean;
    /**
     * Indicates text `wrapping` type.
     * @private
     */
    public wordWrapType : PdfWordWrapType = PdfWordWrapType.Word;
    private direction : PdfTextDirection ;
    //Constructors
    /**
     * Initializes a new instance of the `PdfStringFormat` class.
     * @private
     */
    public constructor()
    /**
     * Initializes a new instance of the `PdfStringFormat` class with horizontal alignment of a text.
     * @private
     */
    public constructor(alignment : PdfTextAlignment)
    /**
     * Initializes a new instance of the `PdfStringFormat` class with column format.
     * @private
     */
    public constructor(columnFormat : string)
    /**
     * Initializes a new instance of the `PdfStringFormat` class with horizontal and vertical alignment.
     * @private
     */
    public constructor(alignment : PdfTextAlignment, lineAlignment : PdfVerticalAlignment)
    public constructor(arg1? : PdfTextAlignment|string, arg2? : PdfVerticalAlignment) {
        this.internalLineLimit = true;
        this.wordWrapType = PdfWordWrapType.Word;
        if ((typeof arg1 !== 'undefined') && (typeof arg1 !== 'string') ) {
            this.textAlignment = arg1;
        }
        if (typeof arg2 !== 'undefined') {
            this.verticalAlignment = arg2;
        }
    }
    //Properties
    /**
     * Gets or sets the `horizontal` text alignment
     * ```typescript
     * // create a new PDF document
     * let document : PdfDocument = new PdfDocument();
     * // add a pages to the document
     * let page1 : PdfPage = document.pages.add();
     * // set font
     * let font : PdfStandardFont = new PdfStandardFont(PdfFontFamily.Helvetica, 20);
     * // set brush
     * let blackBrush : PdfSolidBrush = new PdfSolidBrush(new PdfColor(0, 0, 0));
     * //
     * // set the format for string
     * let stringFormat : PdfStringFormat = new PdfStringFormat();
     * // set the text alignment
     * stringFormat.alignment = PdfTextAlignment.Center;
     * //
     * // draw the text
     * page1.graphics.drawString('Hello World', font, blackBrush, new PointF(10, 10), stringFormat);
     * // save the document
     * document.save('output.pdf');
     * // destroy the document
     * document.destroy();
     * ```
     */
    public get alignment() : PdfTextAlignment {
        return this.textAlignment;
    }
    public set alignment(value : PdfTextAlignment) {
        this.textAlignment = value;
    }
    public get textDirection() : PdfTextDirection {
        return this.direction;
    }
    public set textDirection(value : PdfTextDirection) {
        this.direction = value;
    }
    /**
     * Gets or sets the `vertical` text alignment.
     * ```typescript
     * // create a new PDF document
     * let document : PdfDocument = new PdfDocument();
     * // add a pages to the document
     * let page1 : PdfPage = document.pages.add();
     * // set font
     * let font : PdfStandardFont = new PdfStandardFont(PdfFontFamily.Helvetica, 20);
     * // set brush
     * let blackBrush : PdfSolidBrush = new PdfSolidBrush(new PdfColor(0, 0, 0));
     * //
     * // set the format for string
     * let stringFormat : PdfStringFormat = new PdfStringFormat();
     * // set the vertical alignment
     * stringFormat.lineAlignment = PdfVerticalAlignment.Middle;
     * //
     * // draw the text
     * page1.graphics.drawString('Hello World', font, blackBrush, new PointF(10, 10), stringFormat);
     * // save the document
     * document.save('output.pdf');
     * // destroy the document
     * document.destroy();
     * ```
     */
    public get lineAlignment() : PdfVerticalAlignment {
        if (typeof this.verticalAlignment === 'undefined' || this.verticalAlignment == null) {
            return PdfVerticalAlignment.Top;
        } else {
            return this.verticalAlignment;
        }
    }
    public set lineAlignment(value : PdfVerticalAlignment) {
        this.verticalAlignment = value;
    }
    /**
     * Gets or sets the value that indicates text `direction` mode.
     * @private
     */
    public get rightToLeft() : boolean {
        if (typeof this.isRightToLeft === 'undefined' || this.isRightToLeft == null) {
            return false;
        } else {
            return this.isRightToLeft;
        }
    }
    public set rightToLeft(value : boolean) {
        this.isRightToLeft = value;
    }
    /**
     * Gets or sets value that indicates a `size` among the characters in the text.
     * ```typescript
     * // create a new PDF document
     * let document : PdfDocument = new PdfDocument();
     * // add a pages to the document
     * let page1 : PdfPage = document.pages.add();
     * // set font
     * let font : PdfStandardFont = new PdfStandardFont(PdfFontFamily.Helvetica, 20);
     * // set brush
     * let blackBrush : PdfSolidBrush = new PdfSolidBrush(new PdfColor(0, 0, 0));
     * //
     * // set the format for string
     * let stringFormat : PdfStringFormat = new PdfStringFormat();
     * // set character spacing
     * stringFormat.characterSpacing = 10;
     * //
     * // draw the text
     * page1.graphics.drawString('Hello World', font, blackBrush, new PointF(10, 10), stringFormat);
     * // save the document
     * document.save('output.pdf');
     * // destroy the document
     * document.destroy();
     * ```
     */
    public get characterSpacing() : number {
        if (typeof this.internalCharacterSpacing === 'undefined' || this.internalCharacterSpacing == null) {
            return 0;
        } else {
            return this.internalCharacterSpacing;
        }
    }
    public set characterSpacing(value : number) {
        this.internalCharacterSpacing = value;
    }
    /**
     * Gets or sets value that indicates a `size` among the words in the text.
     * ```typescript
     * // create a new PDF document
     * let document : PdfDocument = new PdfDocument();
     * // add a pages to the document
     * let page1 : PdfPage = document.pages.add();
     * // set font
     * let font : PdfStandardFont = new PdfStandardFont(PdfFontFamily.Helvetica, 20);
     * // set brush
     * let blackBrush : PdfSolidBrush = new PdfSolidBrush(new PdfColor(0, 0, 0));
     * //
     * // set the format for string
     * let stringFormat : PdfStringFormat = new PdfStringFormat();
     * // set word spacing
     * stringFormat.wordSpacing = 10;
     * //
     * // draw the text
     * page1.graphics.drawString('Hello World', font, blackBrush, new PointF(10, 10), stringFormat);
     * // save the document
     * document.save('output.pdf');
     * // destroy the document
     * document.destroy();
     * ```
     */
    public get wordSpacing() : number {
        if (typeof this.internalWordSpacing === 'undefined' || this.internalWordSpacing == null) {
            return 0;
        } else {
            return this.internalWordSpacing;
        }
    }
    public set wordSpacing(value : number) {
        this.internalWordSpacing = value;
    }
    /**
     * Gets or sets value that indicates the `vertical distance` between the baselines of adjacent lines of text.
     * ```typescript
     * // create a new PDF document
     * let document : PdfDocument = new PdfDocument();
     * // add a pages to the document
     * let page1 : PdfPage = document.pages.add();
     * // set font
     * let font : PdfStandardFont = new PdfStandardFont(PdfFontFamily.Helvetica, 20);
     * // set brush
     * let blackBrush : PdfSolidBrush = new PdfSolidBrush(new PdfColor(0, 0, 0));
     * // set string
     * let text : string = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor 
     * incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitati';
     * // set rectangle bounds
     * let rectangle : RectangleF = new RectangleF({x : 0, y : 0}, {width : 300, height : 100})
     * //
     * // set the format for string
     * let stringFormat : PdfStringFormat = new PdfStringFormat();
     * // set line spacing
     * stringFormat.lineSpacing = 10;
     * //
     * // draw the text
     * page1.graphics.drawString(text, font, blackBrush, rectangle, stringFormat);
     * // save the document
     * document.save('output.pdf');
     * // destroy the document
     * document.destroy();
     * ```
     */
    public get lineSpacing() : number {
        if (typeof this.leading === 'undefined' || this.leading == null) {
            return 0;
        } else {
            return this.leading;
        }
    }
    public set lineSpacing(value : number) {
        this.leading = value;
    }
    /**
     * Gets or sets a value indicating whether the text is `clipped` or not.
     * @private
     */
    public get clipPath() : boolean {
        if (typeof this.clip === 'undefined' || this.clip == null) {
            return false;
        } else {
            return this.clip;
        }
    }
    public set clipPath(value : boolean) {
        this.clip = value;
    }
    /**
     * Gets or sets value indicating whether the text is in `subscript or superscript` mode.
     * @private
     */
    public get subSuperScript() : PdfSubSuperScript {
        if (typeof this.pdfSubSuperScript === 'undefined' || this.pdfSubSuperScript == null) {
            return PdfSubSuperScript.None;
        } else {
            return this.pdfSubSuperScript;
        }
    }
    public set subSuperScript(value : PdfSubSuperScript) {
        this.pdfSubSuperScript = value;
    }
    /**
     * Gets or sets the `indent` of the first line in the paragraph.
     * @private
     */
    public get paragraphIndent() : number {
        if (typeof this.internalParagraphIndent === 'undefined' || this.internalParagraphIndent == null) {
            return 0;
        } else {
            return this.internalParagraphIndent;
        }
    }
    public set paragraphIndent(value : number) {
        this.internalParagraphIndent = value;
        this.firstLineIndent = value;
    }
    /**
     * Gets or sets a value indicating whether [`line limit`].
     * @private
     */
    public get lineLimit() : boolean {
        return this.internalLineLimit;
    }
    public set lineLimit(value : boolean) {
        this.internalLineLimit = value;
    }
    /**
     * Gets or sets a value indicating whether [`measure trailing spaces`].
     * @private
     */
    public get measureTrailingSpaces() : boolean {
        if (typeof this.trailingSpaces === 'undefined' || this.trailingSpaces == null) {
            return false;
        } else {
            return this.trailingSpaces;
        }
    }
    public set measureTrailingSpaces(value : boolean) {
        this.trailingSpaces = value;
    }
    /**
     * Gets or sets a value indicating whether [`no clip`].
     * @private
     */
    public get noClip() : boolean {
        if (typeof this.isNoClip === 'undefined' || this.isNoClip == null) {
            return false;
        } else {
            return this.isNoClip;
        }
    }
    public set noClip(value : boolean) {
        this.isNoClip = value;
    }
    /**
     * Gets or sets value indicating type of the text `wrapping`.
     * @private
     */
    public get wordWrap() : PdfWordWrapType {
        // if (typeof this.wrapType === 'undefined' || this.wrapType == null) {
        //     return PdfWordWrapType.Word;
        // } else {
            return this.wordWrapType;
        // }
    }
    public set wordWrap(value : PdfWordWrapType) {
        this.wordWrapType = value;
    }
    /**
     * Gets or sets the `scaling factor`.
     * @private
     */
    public get horizontalScalingFactor() : number {
        // if (typeof this.scalingFactor === 'undefined' || this.scalingFactor == null) {
        //     return 100;
        // } else {
            return this.scalingFactor;
        // }
    }
    public set horizontalScalingFactor(value : number) {
        if (value <= 0) {
            throw new Error('ArgumentOutOfRangeException:The scaling factor cant be less of equal to zero, ScalingFactor');
        }
        this.scalingFactor = value;
    }
    /**
     * Gets or sets the `indent` of the first line in the text.
     * @private
     */
    public get firstLineIndent() : number {
        if (typeof this.initialLineIndent === 'undefined' || this.initialLineIndent == null) {
            return 0;
        } else {
            return this.initialLineIndent;
        }
    }
    public set firstLineIndent(value : number) {
        this.initialLineIndent = value;
    }
    /**
     * `Clones` the object.
     * @private
     */
    //IClonable implementation
    public clone() : Object {
        let format : PdfStringFormat = this;
        return format;
    }
}