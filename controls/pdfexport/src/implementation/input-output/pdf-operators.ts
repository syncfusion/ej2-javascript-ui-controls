/**
 * PdfOperators.ts class for EJ2-PDF
 * Class of string PDF common operators.
 * @private
 */
export class Operators {
    /**
     * Specifies the value of `obj`.
     * @private
     */
    public static readonly obj : string = 'obj';
    /**
     * Specifies the value of `endObj`.
     * @private
     */
    public static readonly endObj : string = 'endobj';
    /**
     * Specifies the value of `R`.
     * @private
     */
    public static readonly r : string = 'R';
    /**
     * Specifies the value of ` `.
     * @private
     */
    public static readonly whiteSpace : string = ' ';
    /**
     * Specifies the value of `/`.
     * @private
     */
    public static readonly slash : string = '/';
    /**
     * Specifies the value of `\r\n`.
     * @private
     */
    public static readonly newLine : string = '\r\n';
    /**
     * Specifies the value of `stream`.
     * @private
     */
    public static readonly stream : string = 'stream';
    /**
     * Specifies the value of `endStream`.
     * @private
     */
    public static readonly endStream : string = 'endstream';
    /**
     * Specifies the value of `xref`.
     * @private
     */
    public static readonly xref : string = 'xref';
    /**
     * Specifies the value of `f`.
     * @private
     */
    public static readonly f : string = 'f';
    /**
     * Specifies the value of `n`.
     * @private
     */
    public static readonly n : string = 'n';
    /**
     * Specifies the value of `trailer`.
     * @private
     */
    public static readonly trailer : string = 'trailer';
    /**
     * Specifies the value of `startxref`.
     * @private
     */
    public static readonly startxref : string = 'startxref';
    /**
     * Specifies the value of `eof`.
     * @private
     */
    public static readonly eof : string = '%%EOF';
    /**
     * Specifies the value of `header`.
     * @private
     */
    public static readonly header : string = '%PDF-1.5';
    /**
     * Specifies the value of `beginText`.
     * @private
     */
    public static readonly beginText : string = 'BT';
    /**
     * Specifies the value of `endText`.
     * @private
     */
    public static readonly endText : string = 'ET';
    /**
     * Specifies the value of `m`.
     * @private
     */
    public static readonly beginPath : string = 'm';
    /**
     * Specifies the value of `l`.
     * @private
     */
    public static readonly appendLineSegment : string = 'l';
    /**
     * Specifies the value of `S`.
     * @private
     */
    public static readonly stroke : string = 'S';
    /**
     * Specifies the value of `f`.
     * @private
     */
    public static readonly fill : string = 'f';
    /**
     * Specifies the value of `f*`.
     * @private
     */
    public static readonly fillEvenOdd : string = 'f*';
    /**
     * Specifies the value of `B`.
     * @private
     */
    public static readonly fillStroke : string = 'B';
    /**
     * Specifies the value of `B*`.
     * @private
     */
    public static readonly fillStrokeEvenOdd : string = 'B*';
    /**
     * Specifies the value of `c`.
     * @private
     */
    public static readonly appendbeziercurve : string = 'c';
    /**
     * Specifies the value of `re`.
     * @private
     */
    public static readonly appendRectangle : string = 're';
    /**
     * Specifies the value of `q`.
     * @private
     */
    public static readonly saveState : string = 'q';
    /**
     * Specifies the value of `Q`.
     * @private
     */
    public static readonly restoreState : string = 'Q';
    /**
     * Specifies the value of `Do`.
     * @private
     */
    public static readonly paintXObject : string = 'Do';
    /**
     * Specifies the value of `cm`.
     * @private
     */
    public static readonly modifyCtm : string = 'cm';
    /**
     * Specifies the value of `Tm`.
     * @private
     */
    public static readonly modifyTM : string = 'Tm';
    /**
     * Specifies the value of `w`.
     * @private
     */
    public static readonly setLineWidth : string = 'w';
    /**
     * Specifies the value of `J`.
     * @private
     */
    public static readonly setLineCapStyle : string = 'J';
    /**
     * Specifies the value of `j`.
     * @private
     */
    public static readonly setLineJoinStyle : string = 'j';
    /**
     * Specifies the value of `d`.
     * @private
     */
    public static readonly setDashPattern : string = 'd';
    /**
     * Specifies the value of `i`.
     * @private
     */
    public static readonly setFlatnessTolerance : string = 'i';
    /**
     * Specifies the value of `h`.
     * @private
     */
    public static readonly closePath : string = 'h';
    /**
     * Specifies the value of `s`.
     * @private
     */
    public static readonly closeStrokePath : string = 's';
    /**
     * Specifies the value of `b`.
     * @private
     */
    public static readonly closeFillStrokePath : string = 'b';
    /**
     * Specifies the value of `setCharacterSpace`.
     * @private
     */
    public static readonly setCharacterSpace : string = 'Tc';
    /**
     * Specifies the value of `setWordSpace`.
     * @private
     */
    public static readonly setWordSpace : string = 'Tw';
    /**
     * Specifies the value of `setHorizontalScaling`.
     * @private
     */
    public static readonly setHorizontalScaling : string = 'Tz';
    /**
     * Specifies the value of `setTextLeading`.
     * @private
     */
    public static readonly setTextLeading : string = 'TL';
    /**
     * Specifies the value of `setFont`.
     * @private
     */
    public static readonly setFont : string = 'Tf';
    /**
     * Specifies the value of `setRenderingMode`.
     * @private
     */
    public static readonly setRenderingMode : string = 'Tr';
    /**
     * Specifies the value of `setTextRise`.
     * @private
     */
    public static readonly setTextRise : string = 'Ts';
    /**
     * Specifies the value of `setTextScaling`.
     * @private
     */
    public static readonly setTextScaling : string = 'Tz';
    /**
     * Specifies the value of `setCoords`.
     * @private
     */
    public static readonly setCoords : string = 'Td';
    /**
     * Specifies the value of `goToNextLine`.
     * @private
     */
    public static readonly goToNextLine : string = 'T*';
    /**
     * Specifies the value of `setText`.
     * @private
     */
    public static readonly setText : string = 'Tj';
    /**
     * Specifies the value of `setTextWithFormatting`.
     * @private
     */
    public static readonly setTextWithFormatting : string = 'TJ';
    /**
     * Specifies the value of `setTextOnNewLine`.
     * @private
     */
    public static readonly setTextOnNewLine : string = '\'';
    /**
     * Specifies the value of `selectcolorspaceforstroking`.
     * @private
     */
    public static readonly selectcolorspaceforstroking : string = 'CS';
    /**
     * Specifies the value of `selectcolorspacefornonstroking`.
     * @private
     */
    public static readonly selectcolorspacefornonstroking : string = 'cs';
    /**
     * Specifies the value of `setrbgcolorforstroking`.
     * @private
     */
    public static readonly setrbgcolorforstroking : string = 'RG';
    /**
     * Specifies the value of `setrbgcolorfornonstroking`.
     * @private
     */
    public static readonly setrbgcolorfornonstroking : string = 'rg';
    /**
     * Specifies the value of `K`.
     * @private
     */
    public static readonly setcmykcolorforstroking : string = 'K';
    /**
     * Specifies the value of `k`.
     * @private
     */
    public static readonly setcmykcolorfornonstroking : string = 'k';
    /**
     * Specifies the value of `G`.
     * @private
     */
    public static readonly setgraycolorforstroking : string = 'G';
    /**
     * Specifies the value of `g`.
     * @private
     */
    public static readonly setgraycolorfornonstroking : string = 'g';
    /**
     * Specifies the value of `W`.
     * @private
     */
    public static readonly clipPath : string = 'W';
    /**
     * Specifies the value of `clipPathEvenOdd`.
     * @private
     */
    public static readonly clipPathEvenOdd : string = 'W*';
    /**
     * Specifies the value of `n`.
     * @private
     */
    public static readonly endPath : string = 'n';
    /**
     * Specifies the value of `setGraphicsState`.
     * @private
     */
    public static readonly setGraphicsState : string = 'gs';
    /**
     * Specifies the value of `%`.
     * @private
     */
    public static readonly comment : string = '%';
    /**
     * Specifies the value of `*`.
     * @private
     */
    public static readonly evenOdd : string = '*';
    /**
     * Specifies the value of `M`.
     * @private
     */
    public static readonly setMiterLimit : string = 'M';
    /**
     * Specifies the value of `test`.
     * @private
     */
    private forTest : string = 'test';
    /**
     * Same as SC, but also supports Pattern, Separation, DeviceN, and ICCBased color spaces. For non-stroking operations.
     * @public
     */
    public static readonly setColorAndPattern : string = 'scn';
    /**
     * Same as SC, but also supports Pattern, Separation, DeviceN, and ICCBased color spaces. For stroking.
     */
    public static readonly setColorAndPatternStroking : string = 'SCN';
    /**
     * Create an instance of `PdfOperator` class.
     * @private
     */
    public constructor() {
        this.forTest = Operators.obj;
    }
}