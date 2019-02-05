/**
 * PdfFontMetrics.ts class for EJ2-PDF
 */
import { PdfStringFormat } from './pdf-string-format';
import { PdfFont } from './pdf-font';
import { PdfSubSuperScript } from './enum';
import { PdfArray } from './../../primitives/pdf-array';
/**
 * `Metrics` of the font.
 * @private
 */
export class PdfFontMetrics {
    //  Fields
    /**
     * Gets `ascent` of the font.
     * @private
     */
    public ascent : number;
    /**
     * Gets `descent` of the font.
     * @private
     */
    public descent : number;
    /**
     * `Name` of the font.
     * @private
     */
    public name : string;
    /**
     * Gets `PostScript` Name of the  font.
     * @private
     */
    public postScriptName : string;
    /**
     * Gets `size` of the font.
     * @private
     */
    public size : number;
    /**
     * Gets `height` of the font.
     * @private
     */
    public height : number;
    /**
     * `First char` of the font.
     * @private
     */
    public firstChar : number;
    /**
     * `Last char` of the font.
     * @private
     */
    public lastChar : number;
    /**
     * `Line gap`.
     * @private
     */
    public lineGap : number = 0;
    /**
     * `Subscript` size factor.
     * @private
     */
    public subScriptSizeFactor : number;
    /**
     * `Superscript` size factor.
     * @private
     */
    public superscriptSizeFactor : number;
    /**
     * Gets `table` of glyphs` width.
     * @private
     */
    public internalWidthTable : WidthTable;
    /**
     * Checks whether is it `unicode font` or not.
     * @private
     */
    public isUnicodeFont : boolean;
    /**
     * Indicate whether the true type font reader font has bold style.
     */
    public isBold : boolean;
    //  Public methods
    /**
     * Returns `ascent` taking into consideration font`s size.
     * @private
     */
    public getAscent(format : PdfStringFormat) : number {
        let returnValue : number = this.ascent * PdfFont.charSizeMultiplier * this.getSize(format);
        return returnValue;
    }
    /**
     * Returns `descent` taking into consideration font`s size.
     * @private
     */
    public getDescent(format : PdfStringFormat) : number {
        let returnValue : number = this.descent * PdfFont.charSizeMultiplier * this.getSize(format);
        return returnValue;
    }
    /**
     * Returns `Line gap` taking into consideration font`s size.
     * @private
     */
    public getLineGap(format : PdfStringFormat) : number {
        let returnValue : number = this.lineGap * PdfFont.charSizeMultiplier * this.getSize(format);
        return returnValue;
    }
    /**
     * Returns `height` taking into consideration font`s size.
     * @private
     */
    public getHeight(format : PdfStringFormat) : number {
        let height : number;
        let clearTypeFonts : string[] = [ 'cambria', 'candara', 'constantia', 'corbel', 'cariadings' ];
        let clearTypeFontCollection : string[] = [];
        for (let index : number  = 0; index < clearTypeFonts.length; index++) {
            let font : string = clearTypeFonts[index];
            clearTypeFontCollection.push(font);
        }
        if (this.getDescent(format) < 0) {
            // if ((clearTypeFontCollection.indexOf(this.name.toLowerCase()) !== -1) && !this.isUnicodeFont) {
            //     height = (this.GetAscent(format) - this.GetDescent(format) - this.GetLineGap(format));
            // } else {
                height = (this.getAscent(format) - this.getDescent(format) + this.getLineGap(format));
            // }
        } else {
            height = (this.getAscent(format) + this.getDescent(format) + this.getLineGap(format));
        }
        return height;
    }
    /**
     * Calculates `size` of the font depending on the subscript/superscript value.
     * @private
     */
    public getSize(format : PdfStringFormat) : number {
        let size : number = this.size;
        if (format != null) {
            switch (format.subSuperScript) {
                case PdfSubSuperScript.SubScript:
                    size /= this.subScriptSizeFactor;
                    break;

                case PdfSubSuperScript.SuperScript:
                    size /= this.superscriptSizeFactor;
                    break;
            }
        }
        return size;
    }
    /**
     * `Clones` the metrics.
     * @private
     */
    public clone() : PdfFontMetrics {
        let metrics : PdfFontMetrics = this;
        metrics.widthTable = WidthTable.clone() as WidthTable;
        return metrics;
    }
    //  Properies
    /**
     * Gets or sets the `width table`.
     * @private
     */
    public get widthTable() : WidthTable {
        return this.internalWidthTable;
    }
    public set widthTable(value : WidthTable) {
        this.internalWidthTable = value;
    }
}
export abstract class WidthTable {
    // // Properties
    /**
     * Returns the `width` of the specific index.
     * @private
     */
    public abstract items(index : number) : number;
    // //  ICloneable Members
    /**
     * `Clones` this instance of the WidthTable class.
     * @private
     */
    public abstract clone() : WidthTable;
    /**
     * Static `clones` this instance of the WidthTable class.
     * @private
     */
    public static clone() : WidthTable {
        return null;
    }
}
export class StandardWidthTable extends WidthTable {
    // Fields
    /**
     * The `widths` of the supported characters.
     * @private
     */
    private widths : number[];
    //Properties
    /**
     * Gets the `32 bit number` at the specified index.
     * @private
     */
    public items(index : number) : number {
        if (index < 0 || index >= this.widths.length) {
            throw new Error('ArgumentOutOfRangeException:index, The character is not supported by the font.');
        }
        let result : number = this.widths[index];
        return result;
    }
    /**
     * Gets the `length` of the internal array.
     * @private
     */
    public get length() : number {
        return this.widths.length;
    }
    // Constructors
    /**
     * Initializes a new instance of the `StandardWidthTable` class.
     * @private
     */
    public constructor(widths : number[]) {
        super();
        if (widths == null) {
            throw new Error('ArgumentNullException:widths');
        }
        this.widths = widths;
    }
    //Overrides
    /**
     * `Clones` this instance of the WidthTable class.
     * @private
     */
    public clone() : WidthTable {
        let swt : StandardWidthTable = this;
        swt.widths = this.widths;
        return swt;
    }
    /**
     * Converts width table to a `PDF array`.
     * @private
     */
    public toArray() : PdfArray {
        let arr : PdfArray = new PdfArray(this.widths);
        return arr;
    }
}