/**
 * PdfStandardFontMetricsFactory.ts class for EJ2-PDF
 */
import { PdfFontStyle, PdfFontFamily } from './enum';
import { PdfFontMetrics, StandardWidthTable } from './pdf-font-metrics';
/**
 * @private
 * `Factory of the standard fonts metrics`.
 */
export class PdfStandardFontMetricsFactory {
    /**
     * `Multiplier` os subscript superscript.
     * @private
     */
    private static readonly subSuperScriptFactor : number = 1.52;
    /**
     * `Ascender` value for the font.
     * @private
     */
    private static readonly helveticaAscent : number = 931;
    /**
     * `Ascender` value for the font.
     * @private
     */
    private static readonly helveticaDescent : number = -225;
    /**
     * `Font type`.
     * @private
     */
    private static readonly helveticaName : string = 'Helvetica';
    /**
     * `Ascender` value for the font.
     * @private
     */
    private static readonly helveticaBoldAscent : number = 962;
    /**
     * `Ascender` value for the font.
     * @private
     */
    private static readonly helveticaBoldDescent : number = -228;
    /**
     * `Font type`.
     * @private
     */
    private static readonly helveticaBoldName : string = 'Helvetica-Bold';
    /**
     * `Ascender` value for the font.
     * @private
     */
    private static readonly helveticaItalicAscent : number = 931;
    /**
     * `Ascender` value for the font.
     * @private
     */
    private static readonly helveticaItalicDescent : number = -225;
    /**
     * `Font type`.
     * @private
     */
    private static readonly helveticaItalicName : string = 'Helvetica-Oblique';
    /**
     * `Ascender` value for the font.
     * @private
     */
    private static readonly helveticaBoldItalicAscent : number = 962;
    /**
     * `Ascender` value for the font.
     * @private
     */
    private static readonly helveticaBoldItalicDescent : number = -228;
    /**
     * `Font type`.
     * @private
     */
    private static readonly helveticaBoldItalicName : string = 'Helvetica-BoldOblique';
    /**
     * `Ascender` value for the font.
     * @private
     */
    private static readonly courierAscent : number = 805;
    /**
     * `Ascender` value for the font.
     * @private
     */
    private static readonly courierDescent : number = -250;
    /**
     * `Font type`.
     * @private
     */
    private static readonly courierName : string = 'Courier';
    /**
     * `Ascender` value for the font.
     * @private
     */
    private static readonly courierBoldAscent : number = 801;
    /**
     * `Ascender` value for the font.
     * @private
     */
    private static readonly courierBoldDescent : number = -250;
    /**
     * `Font type`.
     * @private
     */
    private static readonly courierBoldName : string = 'Courier-Bold';
    /**
     * `Ascender` value for the font.
     * @private
     */
    private static readonly courierItalicAscent : number = 805;
    /**
     * `Ascender` value for the font.
     * @private
     */
    private static readonly courierItalicDescent : number = -250;
    /**
     * `Font type`.
     * @private
     */
    private static readonly courierItalicName : string = 'Courier-Oblique';
    /**
     * `Ascender` value for the font.
     * @private
     */
    private static readonly courierBoldItalicAscent : number = 801;
    /**
     * `Ascender` value for the font.
     * @private
     */
    private static readonly courierBoldItalicDescent : number = -250;
    /**
     * `Font type`.
     * @private
     */
    private static readonly courierBoldItalicName : string = 'Courier-BoldOblique';
    /**
     * `Ascender` value for the font.
     * @private
     */
    private static readonly timesAscent : number = 898;
    /**
     * `Ascender` value for the font.
     * @private
     */
    private static readonly timesDescent : number = -218;
    /**
     * `Font type`.
     * @private
     */
    private static readonly timesName : string = 'Times-Roman';
    /**
     * `Ascender` value for the font.
     * @private
     */
    private static readonly timesBoldAscent : number = 935;
    /**
     * `Ascender` value for the font.
     * @private
     */
    private static readonly timesBoldDescent : number = -218;
    /**
     * `Font type`.
     * @private
     */
    private static readonly timesBoldName : string = 'Times-Bold';
    /**
     * `Ascender` value for the font.
     * @private
     */
    private static readonly timesItalicAscent : number = 883;
    /**
     * `Ascender` value for the font.
     * @private
     */
    private static readonly timesItalicDescent : number = -217;
    /**
     * `Font type`.
     * @private
     */
    private static readonly timesItalicName : string = 'Times-Italic';
    /**
     * `Ascender` value for the font.
     * @private
     */
    private static readonly timesBoldItalicAscent : number = 921;
    /**
     * `Ascender` value for the font.
     * @private
     */
    private static readonly timesBoldItalicDescent : number = -218;
    /**
     * `Font type`.
     * @private
     */
    private static readonly timesBoldItalicName : string = 'Times-BoldItalic';
    /**
     * `Ascender` value for the font.
     * @private
     */
    private static readonly symbolAscent : number = 1010;
    /**
     * `Ascender` value for the font.
     * @private
     */
    private static readonly symbolDescent : number = -293;
    /**
     * `Font type`.
     * @private
     */
    private static readonly symbolName : string = 'Symbol';
    /**
     * `Ascender` value for the font.
     * @private
     */
    private static readonly zapfDingbatsAscent : number = 820;
    /**
     * `Ascender` value for the font.
     * @private
     */
    private static readonly zapfDingbatsDescent : number = -143;
    /**
     * `Font type`.
     * @private
     */
    private static readonly zapfDingbatsName : string = 'ZapfDingbats';
    /**
     * `Arial` widths table.
     * @private
     */
    private static arialWidth : string = '\u0116\u0116\u0163\u022c\u022c\u0379\u029b\u00bf\u014d\u014d\u0185\u0248\u0116\u014d\u0116\u0116\u022c\u022c\u022c\u022c\u022c\u022c\u022c\u022c\u022c\u022c\u0116\u0116\u0248\u0248\u0248\u022c\u03f7\u029b\u029b\u02d2\u02d2\u029b\u0263\u030a\u02d2\u0116\u01f4\u029b\u022c\u0341\u02d2\u030a\u029b\u030a\u02d2\u029b\u0263\u02d2\u029b\u03b0\u029b\u029b\u0263\u0116\u0116\u0116\u01d5\u022c\u014d\u022c\u022c\u01f4\u022c\u022c\u0116\u022c\u022c\u00de\u00de\u01f4\u00de\u0341\u022c\u022c\u022c\u022c\u014d\u01f4\u0116\u022c\u01f4\u02d2\u01f4\u01f4\u01f4\u014e\u0104\u014e\u0248\u0000\u022c\u0000\u00de\u022c\u014d\u03e8\u022c\u022c\u014d\u03e8\u029b\u014d\u03e8\u0000\u0263\u0000\u0000\u00de\u00de\u014d\u014d\u015e\u022c\u03e8\u014d\u03e8\u01f4\u014d\u03b0\u0000\u01f4\u029b\u0000\u014d\u022c\u022c\u022c\u022c\u0104\u022c\u014d\u02e1\u0172\u022c\u0248\u0000\u02e1\u014d\u0190\u0248\u014d\u014d\u014d\u022c\u0219\u0116\u014d\u014d\u016d\u022c\u0342\u0342\u0342\u0263\u029b\u029b\u029b\u029b\u029b\u029b\u03e8\u02d2\u029b\u029b\u029b\u029b\u0116\u0116\u0116\u0116\u02d2\u02d2\u030a\u030a\u030a\u030a\u030a\u0248\u030a\u02d2\u02d2\u02d2\u02d2\u029b\u029b\u0263\u022c\u022c\u022c\u022c\u022c\u022c\u0379\u01f4\u022c\u022c\u022c\u022c\u0116\u0116\u0116\u0116\u022c\u022c\u022c\u022c\u022c\u022c\u022c\u0248\u0263\u022c\u022c\u022c\u022c\u01f4\u022c\u01f4';
    /**
     * `Arial bold` widths table.
     * @private
     */
    private static arialBoldWidth : string = '\u0116\u014d\u01da\u022c\u022c\u0379\u02d2\u00ee\u014d\u014d\u0185\u0248\u0116\u014d\u0116\u0116\u022c\u022c\u022c\u022c\u022c\u022c\u022c\u022c\u022c\u022c\u014d\u014d\u0248\u0248\u0248\u0263\u03cf\u02d2\u02d2\u02d2\u02d2\u029b\u0263\u030a\u02d2\u0116\u022c\u02d2\u0263\u0341\u02d2\u030a\u029b\u030a\u02d2\u029b\u0263\u02d2\u029b\u03b0\u029b\u029b\u0263\u014d\u0116\u014d\u0248\u022c\u014d\u022c\u0263\u022c\u0263\u022c\u014d\u0263\u0263\u0116\u0116\u022c\u0116\u0379\u0263\u0263\u0263\u0263\u0185\u022c\u014d\u0263\u022c\u030a\u022c\u022c\u01f4\u0185\u0118\u0185\u0248\u0000\u022c\u0000\u0116\u022c\u01f4\u03e8\u022c\u022c\u014d\u03e8\u029b\u014d\u03e8\u0000\u0263\u0000\u0000\u0116\u0116\u01f4\u01f4\u015e\u022c\u03e8\u014d\u03e8\u022c\u014d\u03b0\u0000\u01f4\u029b\u0000\u014d\u022c\u022c\u022c\u022c\u0118\u022c\u014d\u02e1\u0172\u022c\u0248\u0000\u02e1\u014d\u0190\u0248\u014d\u014d\u014d\u0263\u022c\u0116\u014d\u014d\u016d\u022c\u0342\u0342\u0342\u0263\u02d2\u02d2\u02d2\u02d2\u02d2\u02d2\u03e8\u02d2\u029b\u029b\u029b\u029b\u0116\u0116\u0116\u0116\u02d2\u02d2\u030a\u030a\u030a\u030a\u030a\u0248\u030a\u02d2\u02d2\u02d2\u02d2\u029b\u029b\u0263\u022c\u022c\u022c\u022c\u022c\u022c\u0379\u022c\u022c\u022c\u022c\u022c\u0116\u0116\u0116\u0116\u0263\u0263\u0263\u0263\u0263\u0263\u0263\u0248\u0263\u0263\u0263\u0263\u0263\u022c\u0263\u022c';
    /**
     * `Fixed` widths table.
     * @private
     */
    /**
     * `Fixed` widths table (every glyph is 600 units wide).
     * @private
     */
    private static fixedWidth : number[] = PdfStandardFontMetricsFactory.createFixedWidth();

    /**
     * `Times` widths table.
     * @private
     */
    private static timesRomanWidth : string = '\u00fa\u014d\u0198\u01f4\u01f4\u0341\u030a\u00b4\u014d\u014d\u01f4\u0234\u00fa\u014d\u00fa\u0116\u01f4\u01f4\u01f4\u01f4\u01f4\u01f4\u01f4\u01f4\u01f4\u01f4\u0116\u0116\u0234\u0234\u0234\u01bc\u0399\u02d2\u029b\u029b\u02d2\u0263\u022c\u02d2\u02d2\u014d\u0185\u02d2\u0263\u0379\u02d2\u02d2\u022c\u02d2\u029b\u022c\u0263\u02d2\u02d2\u03b0\u02d2\u02d2\u0263\u014d\u0116\u014d\u01d5\u01f4\u014d\u01bc\u01f4\u01bc\u01f4\u01bc\u014d\u01f4\u01f4\u0116\u0116\u01f4\u0116\u030a\u01f4\u01f4\u01f4\u01f4\u014d\u0185\u0116\u01f4\u01f4\u02d2\u01f4\u01f4\u01bc\u01e0\u00c8\u01e0\u021d\u0000\u01f4\u0000\u014d\u01f4\u01bc\u03e8\u01f4\u01f4\u014d\u03e8\u022c\u014d\u0379\u0000\u0263\u0000\u0000\u014d\u014d\u01bc\u01bc\u015e\u01f4\u03e8\u014d\u03d4\u0185\u014d\u02d2\u0000\u01bc\u02d2\u0000\u014d\u01f4\u01f4\u01f4\u01f4\u00c8\u01f4\u014d\u02f8\u0114\u01f4\u0234\u0000\u02f8\u014d\u0190\u0234\u012c\u012c\u014d\u01f4\u01c5\u00fa\u014d\u012c\u0136\u01f4\u02ee\u02ee\u02ee\u01bc\u02d2\u02d2\u02d2\u02d2\u02d2\u02d2\u0379\u029b\u0263\u0263\u0263\u0263\u014d\u014d\u014d\u014d\u02d2\u02d2\u02d2\u02d2\u02d2\u02d2\u02d2\u0234\u02d2\u02d2\u02d2\u02d2\u02d2\u02d2\u022c\u01f4\u01bc\u01bc\u01bc\u01bc\u01bc\u01bc\u029b\u01bc\u01bc\u01bc\u01bc\u01bc\u0116\u0116\u0116\u0116\u01f4\u01f4\u01f4\u01f4\u01f4\u01f4\u01f4\u0234\u01f4\u01f4\u01f4\u01f4\u01f4\u01f4\u01f4\u01f4';
    /**
     * `Times bold` widths table.
     * @private
     */
    private static timesRomanBoldWidth : string = '\u00fa\u014d\u022b\u01f4\u01f4\u03e8\u0341\u0116\u014d\u014d\u01f4\u023a\u00fa\u014d\u00fa\u0116\u01f4\u01f4\u01f4\u01f4\u01f4\u01f4\u01f4\u01f4\u01f4\u01f4\u014d\u014d\u023a\u023a\u023a\u01f4\u03a2\u02d2\u029b\u02d2\u02d2\u029b\u0263\u030a\u030a\u0185\u01f4\u030a\u029b\u03b0\u02d2\u030a\u0263\u030a\u02d2\u022c\u029b\u02d2\u02d2\u03e8\u02d2\u02d2\u029b\u014d\u0116\u014d\u0245\u01f4\u014d\u01f4\u022c\u01bc\u022c\u01bc\u014d\u01f4\u022c\u0116\u014d\u022c\u0116\u0341\u022c\u01f4\u022c\u022c\u01bc\u0185\u014d\u022c\u01f4\u02d2\u01f4\u01f4\u01bc\u018a\u00dc\u018a\u0208\u0000\u01f4\u0000\u014d\u01f4\u01f4\u03e8\u01f4\u01f4\u014d\u03e8\u022c\u014d\u03e8\u0000\u029b\u0000\u0000\u014d\u014d\u01f4\u01f4\u015e\u01f4\u03e8\u014d\u03e8\u0185\u014d\u02d2\u0000\u01bc\u02d2\u0000\u014d\u01f4\u01f4\u01f4\u01f4\u00dc\u01f4\u014d\u02eb\u012c\u01f4\u023a\u0000\u02eb\u014d\u0190\u023a\u012c\u012c\u014d\u022c\u021c\u00fa\u014d\u012c\u014a\u01f4\u02ee\u02ee\u02ee\u01f4\u02d2\u02d2\u02d2\u02d2\u02d2\u02d2\u03e8\u02d2\u029b\u029b\u029b\u029b\u0185\u0185\u0185\u0185\u02d2\u02d2\u030a\u030a\u030a\u030a\u030a\u023a\u030a\u02d2\u02d2\u02d2\u02d2\u02d2\u0263\u022c\u01f4\u01f4\u01f4\u01f4\u01f4\u01f4\u02d2\u01bc\u01bc\u01bc\u01bc\u01bc\u0116\u0116\u0116\u0116\u01f4\u022c\u01f4\u01f4\u01f4\u01f4\u01f4\u023a\u01f4\u022c\u022c\u022c\u022c\u01f4\u022c\u01f4';
    /**
     * `Times italic` widths table.
     * @private
     */
    private static timesRomanItalicWidth : string = '\u00fa\u014d\u01a4\u01f4\u01f4\u0341\u030a\u00d6\u014d\u014d\u01f4\u02a3\u00fa\u014d\u00fa\u0116\u01f4\u01f4\u01f4\u01f4\u01f4\u01f4\u01f4\u01f4\u01f4\u01f4\u014d\u014d\u02a3\u02a3\u02a3\u01f4\u0398\u0263\u0263\u029b\u02d2\u0263\u0263\u02d2\u02d2\u014d\u01bc\u029b\u022c\u0341\u029b\u02d2\u0263\u02d2\u0263\u01f4\u022c\u02d2\u0263\u0341\u0263\u022c\u022c\u0185\u0116\u0185\u01a6\u01f4\u014d\u01f4\u01f4\u01bc\u01f4\u01bc\u0116\u01f4\u01f4\u0116\u0116\u01bc\u0116\u02d2\u01f4\u01f4\u01f4\u01f4\u0185\u0185\u0116\u01f4\u01bc\u029b\u01bc\u01bc\u0185\u0190\u0113\u0190\u021d\u0000\u01f4\u0000\u014d\u01f4\u022c\u0379\u01f4\u01f4\u014d\u03e8\u01f4\u014d\u03b0\u0000\u022c\u0000\u0000\u014d\u014d\u022c\u022c\u015e\u01f4\u0379\u014d\u03d4\u0185\u014d\u029b\u0000\u0185\u022c\u0000\u0185\u01f4\u01f4\u01f4\u01f4\u0113\u01f4\u014d\u02f8\u0114\u01f4\u02a3\u0000\u02f8\u014d\u0190\u02a3\u012c\u012c\u014d\u01f4\u020b\u00fa\u014d\u012c\u0136\u01f4\u02ee\u02ee\u02ee\u01f4\u0263\u0263\u0263\u0263\u0263\u0263\u0379\u029b\u0263\u0263\u0263\u0263\u014d\u014d\u014d\u014d\u02d2\u029b\u02d2\u02d2\u02d2\u02d2\u02d2\u02a3\u02d2\u02d2\u02d2\u02d2\u02d2\u022c\u0263\u01f4\u01f4\u01f4\u01f4\u01f4\u01f4\u01f4\u029b\u01bc\u01bc\u01bc\u01bc\u01bc\u0116\u0116\u0116\u0116\u01f4\u01f4\u01f4\u01f4\u01f4\u01f4\u01f4\u02a3\u01f4\u01f4\u01f4\u01f4\u01f4\u01bc\u01f4\u01bc';
    /**
     * `Times bold italic` widths table.
     * @private
     */
    private static timesRomanBoldItalicWidths : string = '\u00fa\u0185\u022b\u01f4\u01f4\u0341\u030a\u0116\u014d\u014d\u01f4\u023a\u00fa\u014d\u00fa\u0116\u01f4\u01f4\u01f4\u01f4\u01f4\u01f4\u01f4\u01f4\u01f4\u01f4\u014d\u014d\u023a\u023a\u023a\u01f4\u0340\u029b\u029b\u029b\u02d2\u029b\u029b\u02d2\u030a\u0185\u01f4\u029b\u0263\u0379\u02d2\u02d2\u0263\u02d2\u029b\u022c\u0263\u02d2\u029b\u0379\u029b\u0263\u0263\u014d\u0116\u014d\u023a\u01f4\u014d\u01f4\u01f4\u01bc\u01f4\u01bc\u014d\u01f4\u022c\u0116\u0116\u01f4\u0116\u030a\u022c\u01f4\u01f4\u01f4\u0185\u0185\u0116\u022c\u01bc\u029b\u01f4\u01bc\u0185\u015c\u00dc\u015c\u023a\u0000\u01f4\u0000\u014d\u01f4\u01f4\u03e8\u01f4\u01f4\u014d\u03e8\u022c\u014d\u03b0\u0000\u0263\u0000\u0000\u014d\u014d\u01f4\u01f4\u015e\u01f4\u03e8\u014d\u03e8\u0185\u014d\u02d2\u0000\u0185\u0263\u0000\u0185\u01f4\u01f4\u01f4\u01f4\u00dc\u01f4\u014d\u02eb\u010a\u01f4\u025e\u0000\u02eb\u014d\u0190\u023a\u012c\u012c\u014d\u0240\u01f4\u00fa\u014d\u012c\u012c\u01f4\u02ee\u02ee\u02ee\u01f4\u029b\u029b\u029b\u029b\u029b\u029b\u03b0\u029b\u029b\u029b\u029b\u029b\u0185\u0185\u0185\u0185\u02d2\u02d2\u02d2\u02d2\u02d2\u02d2\u02d2\u023a\u02d2\u02d2\u02d2\u02d2\u02d2\u0263\u0263\u01f4\u01f4\u01f4\u01f4\u01f4\u01f4\u01f4\u02d2\u01bc\u01bc\u01bc\u01bc\u01bc\u0116\u0116\u0116\u0116\u01f4\u022c\u01f4\u01f4\u01f4\u01f4\u01f4\u023a\u01f4\u022c\u022c\u022c\u022c\u01bc\u01f4\u01bc';
    /**
     * `Symbol` widths table.
     * @private
     */
    private static symbolWidth : string = '\u00fb\u014e\u02ca\u01f5\u0226\u0342\u030b\u01b8\u014e\u014e\u01f5\u0226\u00fb\u0226\u00fb\u0117\u01f5\u01f5\u01f5\u01f5\u01f5\u01f5\u01f5\u01f5\u01f5\u01f5\u0117\u0117\u0226\u0226\u0226\u01bd\u0226\u02d3\u029c\u02d3\u0265\u0264\u02fc\u025c\u02d3\u014e\u0278\u02d3\u02af\u037a\u02d3\u02d3\u0301\u02e6\u022d\u0251\u0264\u02b3\u01b8\u0301\u0286\u031c\u0264\u014e\u0360\u014e\u0293\u01f5\u01f5\u0278\u0226\u0226\u01ef\u01b8\u020a\u019c\u025c\u014a\u025c\u0226\u0226\u0241\u020a\u0226\u0226\u020a\u0226\u025c\u01b8\u0241\u02ca\u02af\u01ee\u02af\u01ef\u01e1\u00c9\u01e1\u0226\u02ef\u026d\u00f8\u0226\u00a8\u02ca\u01f5\u02f2\u02f2\u02f2\u02f2\u0413\u03dc\u025c\u03dc\u025c\u0191\u0226\u019c\u0226\u0226\u02ca\u01ef\u01cd\u0226\u0226\u0226\u0226\u03e9\u025c\u03e9\u0293\u0338\u02af\u031c\u03dc\u0301\u0301\u0338\u0301\u0301\u02ca\u02ca\u02ca\u02ca\u02ca\u02ca\u02ca\u0301\u02ca\u0317\u0317\u037b\u0338\u0226\u00fb\u02ca\u025c\u025c\u0413\u03dc\u025c\u03dc\u025c\u01ef\u014a\u0317\u0317\u0313\u02ca\u0181\u0181\u0181\u0181\u0181\u0181\u01ef\u01ef\u01ef\u01ef\u014a\u0113\u02af\u02af\u02af\u0181\u0181\u0181\u0181\u0181\u0181\u01ef\u01ef\u01ef\u0000';
    /**
     * `Zip dingbats` widths table.
     * @private
     */
    private static zapfDingbatsWidth : string = '\u0116\u03ce\u03c1\u03ce\u03d4\u02cf\u0315\u0316\u0317\u02b2\u03c0\u03ab\u0225\u0357\u038f\u03a5\u038f\u03b1\u03ce\u02f3\u034e\u02fa\u02f9\u023b\u02a5\u02fb\u02f8\u02f7\u02f2\u01ee\u0228\u0219\u0241\u02b4\u0312\u0314\u0314\u0316\u0319\u031a\u0330\u0337\u0315\u0349\u0337\u0341\u0330\u033f\u039b\u02e8\u02d3\u02ed\u0316\u0318\u02b7\u0308\u0300\u0318\u02f7\u02c3\u02c4\u02aa\u02bd\u033a\u032f\u0315\u0315\u02c3\u02af\u02b8\u02b1\u0312\u0313\u02c9\u0317\u0311\u0317\u0369\u02f9\u02fa\u02fa\u02f7\u02f7\u037c\u037c\u0314\u0310\u01b6\u008a\u0115\u019f\u0188\u0188\u029c\u029c\u0186\u0186\u013d\u013d\u0114\u0114\u01fd\u01fd\u019a\u019a\u00ea\u00ea\u014e\u014e\u02dc\u0220\u0220\u038e\u029b\u02f8\u02f8\u0308\u0253\u02b6\u0272\u0314\u0314\u0314\u0314\u0314\u0314\u0314\u0314\u0314\u0314\u0314\u0314\u0314\u0314\u0314\u0314\u0314\u0314\u0314\u0314\u0314\u0314\u0314\u0314\u0314\u0314\u0314\u0314\u0314\u0314\u0314\u0314\u0314\u0314\u0314\u0314\u0314\u0314\u0314\u0314\u037e\u0346\u03f8\u01ca\u02ec\u039c\u02ec\u0396\u039f\u03a0\u03a0\u0342\u0369\u033c\u039c\u039c\u0395\u03a2\u03a3\u01cf\u0373\u0344\u0344\u0363\u0363\u02b8\u02b8\u036a\u036a\u02f8\u03b2\u0303\u0361\u0303\u0378\u03c7\u0378\u033f\u0369\u039f\u03ca\u0396';
    /**
     * Decodes a packed width table into a numeric array.
     * @private
     */
    private static decodeWidths(packed : string, offset : number) : number[] {
        let widths : number[] = [];
        for (let i : number = 0; i < packed.length; i++) {
            widths.push(packed.charCodeAt(i) - offset);
        }
        return widths;
    }
    /**
     * Creates the fixed-width (Courier) table: every glyph is 600 units wide.
     * @private
     */
    private static createFixedWidth() : number[] {
        let widths : number[] = [];
        for (let i : number = 0; i < 224; i++) {
            widths.push(600);
        }
        return widths;
    }
    /**
     * Returns `metrics` of the font.
     * @private
     */
    public static getMetrics(fontFamily : PdfFontFamily, fontStyle : PdfFontStyle, size : number) : PdfFontMetrics {
        let metrics : PdfFontMetrics = null;
        switch (fontFamily) {
            case PdfFontFamily.Helvetica:
                metrics = this.getHelveticaMetrics(fontFamily, fontStyle, size);
                break;

            case PdfFontFamily.Courier:
                metrics = this.getCourierMetrics(fontFamily, fontStyle, size);
                break;

            case PdfFontFamily.TimesRoman:
                metrics = this.getTimesMetrics(fontFamily, fontStyle, size);
                break;

            case PdfFontFamily.Symbol:
                metrics = this.getSymbolMetrics(fontFamily, fontStyle, size);
                break;

            case PdfFontFamily.ZapfDingbats:
                metrics = this.getZapfDingbatsMetrics(fontFamily, fontStyle, size);
                break;

            default:
                metrics = this.getHelveticaMetrics(PdfFontFamily.Helvetica, fontStyle, size);
                break;
        }

        metrics.name = fontFamily.toString();
        metrics.subScriptSizeFactor = this.subSuperScriptFactor;
        metrics.superscriptSizeFactor = this.subSuperScriptFactor;
        return metrics;
    }

    // Implementation
    /**
     * Creates `Helvetica font metrics`.
     * @private
     */
    private static getHelveticaMetrics(fontFamily : PdfFontFamily, fontStyle : PdfFontStyle,
                                       size : number) : PdfFontMetrics {
        let metrics : PdfFontMetrics = new PdfFontMetrics();
        if ((fontStyle & PdfFontStyle.Bold) > 0 && (fontStyle & PdfFontStyle.Italic) > 0) {
            metrics.ascent = this.helveticaBoldItalicAscent;
            metrics.descent = this.helveticaBoldItalicDescent;
            metrics.postScriptName = this.helveticaBoldItalicName;
            metrics.size = size;
            metrics.widthTable = new StandardWidthTable(this.decodeWidths(this.arialBoldWidth, 0));
            metrics.height = metrics.ascent - metrics.descent;
        } else if ((fontStyle & PdfFontStyle.Bold) > 0) {
            metrics.ascent = this.helveticaBoldAscent;
            metrics.descent = this.helveticaBoldDescent;
            metrics.postScriptName = this.helveticaBoldName;
            metrics.size = size;
            metrics.widthTable = new StandardWidthTable(this.decodeWidths(this.arialBoldWidth, 0));
            metrics.height = metrics.ascent - metrics.descent;
        } else if ((fontStyle & PdfFontStyle.Italic) > 0) {
            metrics.ascent = this.helveticaItalicAscent;
            metrics.descent = this.helveticaItalicDescent;
            metrics.postScriptName = this.helveticaItalicName;
            metrics.size = size;
            metrics.widthTable = new StandardWidthTable(this.decodeWidths(this.arialWidth, 0));
            metrics.height = metrics.ascent - metrics.descent;
        } else {
            metrics.ascent = this.helveticaAscent;
            metrics.descent = this.helveticaDescent;
            metrics.postScriptName = this.helveticaName;
            metrics.size = size;
            metrics.widthTable = new StandardWidthTable(this.decodeWidths(this.arialWidth, 0));
            metrics.height = metrics.ascent - metrics.descent;
        }

        return metrics;
    }
    /**
     * Creates `Courier font metrics`.
     * @private
     */
    private static getCourierMetrics(fontFamily : PdfFontFamily, fontStyle : PdfFontStyle,
                                     size : number) : PdfFontMetrics {
        let metrics : PdfFontMetrics = new PdfFontMetrics();
        if ((fontStyle & PdfFontStyle.Bold) > 0 && (fontStyle & PdfFontStyle.Italic) > 0) {
            metrics.ascent = this.courierBoldItalicAscent;
            metrics.descent = this.courierBoldItalicDescent;
            metrics.postScriptName = this.courierBoldItalicName;
            metrics.size = size;
            metrics.widthTable = new StandardWidthTable(this.fixedWidth);
            metrics.height = metrics.ascent - metrics.descent;
        } else if ((fontStyle & PdfFontStyle.Bold) > 0) {
            metrics.ascent = this.courierBoldAscent;
            metrics.descent = this.courierBoldDescent;
            metrics.postScriptName = this.courierBoldName;
            metrics.size = size;
            metrics.widthTable = new StandardWidthTable(this.fixedWidth);
            metrics.height = metrics.ascent - metrics.descent;
        } else if ((fontStyle & PdfFontStyle.Italic) > 0) {
            metrics.ascent = this.courierItalicAscent;
            metrics.descent = this.courierItalicDescent;
            metrics.postScriptName = this.courierItalicName;
            metrics.size = size;
            metrics.widthTable = new StandardWidthTable(this.fixedWidth);
            metrics.height = metrics.ascent - metrics.descent;
        } else {
            metrics.ascent = this.courierAscent;
            metrics.descent = this.courierDescent;
            metrics.postScriptName = this.courierName;
            metrics.size = size;
            metrics.widthTable = new StandardWidthTable(this.fixedWidth);
            metrics.height = metrics.ascent - metrics.descent;
        }

        return metrics;
    }
    /**
     * Creates `Times font metrics`.
     * @private
     */
    private static getTimesMetrics(fontFamily : PdfFontFamily, fontStyle : PdfFontStyle, size : number) : PdfFontMetrics {
        let metrics : PdfFontMetrics = new PdfFontMetrics();
        if ((fontStyle & PdfFontStyle.Bold) > 0 && (fontStyle & PdfFontStyle.Italic) > 0) {
            metrics.ascent = this.timesBoldItalicAscent;
            metrics.descent = this.timesBoldItalicDescent;
            metrics.postScriptName = this.timesBoldItalicName;
            metrics.size = size;
            metrics.widthTable = new StandardWidthTable(this.decodeWidths(this.timesRomanBoldItalicWidths, 0));
            metrics.height = metrics.ascent - metrics.descent;
        } else if ((fontStyle & PdfFontStyle.Bold) > 0) {
            metrics.ascent = this.timesBoldAscent;
            metrics.descent = this.timesBoldDescent;
            metrics.postScriptName = this.timesBoldName;
            metrics.size = size;
            metrics.widthTable = new StandardWidthTable(this.decodeWidths(this.timesRomanBoldWidth, 0));
            metrics.height = metrics.ascent - metrics.descent;
        } else if ((fontStyle & PdfFontStyle.Italic) > 0) {
            metrics.ascent = this.timesItalicAscent;
            metrics.descent = this.timesItalicDescent;
            metrics.postScriptName = this.timesItalicName;
            metrics.size = size;
            metrics.widthTable = new StandardWidthTable(this.decodeWidths(this.timesRomanItalicWidth, 0));
            metrics.height = metrics.ascent - metrics.descent;
        } else {
            metrics.ascent = this.timesAscent;
            metrics.descent = this.timesDescent;
            metrics.postScriptName = this.timesName;
            metrics.size = size;
            metrics.widthTable = new StandardWidthTable(this.decodeWidths(this.timesRomanWidth, 0));
            metrics.height = metrics.ascent - metrics.descent;
        }
        return metrics;
    }
    /**
     * Creates `Symbol font metrics`.
     * @private
     */
    private static getSymbolMetrics(fontFamily : PdfFontFamily, fontStyle : PdfFontStyle,
                                    size : number) : PdfFontMetrics {
        let metrics : PdfFontMetrics = new PdfFontMetrics();
        metrics.ascent = this.symbolAscent;
        metrics.descent = this.symbolDescent;
        metrics.postScriptName = this.symbolName;
        metrics.size = size;
        metrics.widthTable = new StandardWidthTable(this.decodeWidths(this.symbolWidth, 1));
        metrics.height = metrics.ascent - metrics.descent;
        return metrics;
    }
    /**
     * Creates `ZapfDingbats font metrics`.
     * @private
     */
    private static getZapfDingbatsMetrics(fontFamily : PdfFontFamily, fontStyle : PdfFontStyle,
                                          size : number) : PdfFontMetrics {
        let metrics : PdfFontMetrics = new PdfFontMetrics();
        metrics.ascent = this.zapfDingbatsAscent;
        metrics.descent = this.zapfDingbatsDescent;
        metrics.postScriptName = this.zapfDingbatsName;
        metrics.size = size;
        metrics.widthTable = new StandardWidthTable(this.decodeWidths(this.zapfDingbatsWidth, 0));
        metrics.height = metrics.ascent - metrics.descent;
        return metrics;
    }
}
