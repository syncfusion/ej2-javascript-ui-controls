/**
 * TtfMetrics.ts class for EJ2-PDF
 */
import { Rectangle } from './../../drawing/pdf-drawing';
export class TtfMetrics {
    /**
     * Typographic line gap.
     * Negative LineGap values are treated as DEF_TABLE_CHECKSUM.
     */
    public lineGap : number;
    /**
     * Gets or sets contains C F F.
     */
    public contains : boolean;
    /**
     * Gets or sets value indicating if Symbol font is used.
     */
    public isSymbol : boolean;
    /**
     * Gets or sets description font item.
     */
    public fontBox : Rectangle;
    /**
     * Gets or sets description font item.
     */
    public isFixedPitch : boolean;
    /**
     * Gets or sets description font item.
     */
    public italicAngle : number;
    /**
     * Gets or sets post-script font name.
     */
    public postScriptName : string;
    /**
     * Gets or sets font family name.
     */
    public fontFamily : string;
    /**
     * Gets or sets description font item.
     */
    public capHeight : number;
    /**
     * Gets or sets description font item.
     */
    public leading : number;
    /**
     * Gets or sets description font item.
     */
    public macAscent : number;
    /**
     * Gets or sets description font item.
     */
    public macDescent : number;
    /**
     * Gets or sets description font item.
     */
    public winDescent : number;
    /**
     * Gets or sets description font item.
     */
    public winAscent : number;
    /**
     * Gets or sets description font item.
     */
    public stemV : number;
    /**
     * Gets or sets widths table for the font.
     */
    public widthTable : number[];
    /**
     * Regular: 0
     * Bold: 1
     * Italic: 2
     * Bold Italic: 3
     * Bit 0- bold (if set to 1)
     * Bit 1- italic (if set to 1)
     * Bits 2-15- reserved (set to 0).
     * NOTE:
     * Note that macStyle bits must agree with the 'OS/2' table fsSelection bits.
     * The fsSelection bits are used over the macStyle bits in Microsoft Windows.
     * The PANOSE values and 'post' table values are ignored for determining bold or italic fonts.
     */
    public macStyle : number;
    /**
     * Subscript size factor.
     */
    public subScriptSizeFactor : number;
    /**
     * Superscript size factor.
     */
    public superscriptSizeFactor : number;
    //Properties
    /**
     * Gets a value indicating whether this instance is italic.
     */
    public get isItalic() : boolean {
        return ((this.macStyle & 2) !== 0);
    }
    /**
     * Gets a value indicating whether this instance is bold.
     */
    public get isBold() : boolean {
        return ((this.macStyle & 1) !== 0);
    }
}