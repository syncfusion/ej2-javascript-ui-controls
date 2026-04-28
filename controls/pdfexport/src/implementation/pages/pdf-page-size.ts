/**
 * PdfPageSize.ts class for EJ2-PDF
 */
import { SizeF } from './../drawing/pdf-drawing';
/**
 * Represents information about various predefined `page sizes`.
 */
export class PdfPageSize {
    /**
     * Specifies the size of `letter`.
     * @private
     */
    public static readonly letter : SizeF  = new SizeF(612, 792);
    /**
     * Specifies the size of `note`.
     * @private
     */
    public static readonly note : SizeF   = new SizeF(540, 720);
    /**
     * Specifies the size of `legal`.
     * @private
     */
    public static readonly legal : SizeF   = new SizeF(612, 1008);
    /**
     * Specifies the size of `a0`.
     * @private
     */
    public static readonly a0 : SizeF   = new SizeF(2380, 3368);
    /**
     * Specifies the size of `a1`.
     * @private
     */
    public static readonly a1 : SizeF   = new SizeF(1684, 2380);
    /**
     * Specifies the size of `a2`.
     * @private
     */
    public static readonly a2 : SizeF   = new SizeF(1190, 1684);
    /**
     * Specifies the size of `a3`.
     * @private
     */
    public static readonly a3 : SizeF   = new SizeF(842, 1190);
    /**
     * Specifies the size of `a4`.
     * @private
     */
    public static readonly a4 : SizeF   = new SizeF(595, 842);
    /**
     * Specifies the size of `a5`.
     * @private
     */
    public static readonly a5 : SizeF   = new SizeF(421, 595);
    /**
     * Specifies the size of `a6`.
     * @private
     */
    public static readonly a6 : SizeF   = new SizeF(297, 421);
    /**
     * Specifies the size of `a7`.
     * @private
     */
    public static readonly a7 : SizeF   = new SizeF(210, 297);
    /**
     * Specifies the size of `a8`.
     * @private
     */
    public static readonly a8 : SizeF   = new SizeF(148, 210);
    /**
     * Specifies the size of `a9`.
     * @private
     */
    public static readonly a9 : SizeF   = new SizeF(105, 148);
    /**
     * Specifies the size of `a10`.
     * @private
     */
    public static readonly a10 : SizeF   = new SizeF(74, 105);
    /**
     * Specifies the size of `b0`.
     * @private
     */
    public static readonly b0 : SizeF   = new SizeF(2836, 4008);
    /**
     * Specifies the size of `b1`.
     * @private
     */
    public static readonly b1 : SizeF   = new SizeF(2004, 2836);
    /**
     * Specifies the size of `b2`.
     * @private
     */
    public static readonly b2 : SizeF   = new SizeF(1418, 2004);
    /**
     * Specifies the size of `b3`.
     * @private
     */
    public static readonly b3 : SizeF   = new SizeF(1002, 1418);
    /**
     * Specifies the size of `b4`.
     * @private
     */
    public static readonly b4 : SizeF   = new SizeF(709, 1002);
    /**
     * Specifies the size of `b5`.
     * @private
     */
    public static readonly b5 : SizeF   = new SizeF(501, 709);
    /**
     * Specifies the size of `archE`.
     * @private
     */
    public static readonly archE : SizeF   = new SizeF(2592, 3456);
    /**
     * Specifies the size of `archD`.
     * @private
     */
    public static readonly archD : SizeF   = new SizeF(1728, 2592);
    /**
     * Specifies the size of `archC`.
     * @private
     */
    public static readonly archC : SizeF   = new SizeF(1296, 1728);
    /**
     * Specifies the size of `archB`.
     * @private
     */
    public static readonly archB : SizeF   = new SizeF(864, 1296);
    /**
     * Specifies the size of `archA`.
     * @private
     */
    public static readonly archA : SizeF   = new SizeF(648, 864);
    /**
     * Specifies the size of `flsa`.
     * @private
     */
    public static readonly flsa : SizeF   = new SizeF(612, 936);
    /**
     * Specifies the size of `halfLetter`.
     * @private
     */
    public static readonly halfLetter : SizeF   = new SizeF(396, 612);
    /**
     * Specifies the size of `letter11x17`.
     * @private
     */
    public static readonly letter11x17 : SizeF   = new SizeF(792, 1224);
    /**
     * Specifies the size of `ledger`.
     * @private
     */
    public static readonly ledger : SizeF   = new SizeF(1224, 792);
    //constructor
    /**
     * Initialize an instance for `PdfPageSize` class.
     * @private
     */
    public constructor() {
        // 
    }
}