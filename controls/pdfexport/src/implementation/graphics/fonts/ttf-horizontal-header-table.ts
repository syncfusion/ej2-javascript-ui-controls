/**
 * TtfHorizontalHeaderTable.ts class for EJ2-PDF
 */
export class TtfHorizontalHeaderTable {
    //Fields
    /**
     * Version of the horizontal header table.
     */
    public version : number;
    /**
     * Typographic ascent.
     */
    public ascender : number;
    /**
     * Maximum advance width value in HTML table.
     */
    public advanceWidthMax : number;
    /**
     * Typographic descent.
     */
    public descender : number;
    /**
     * Number of hMetric entries in HTML table;
     * may be smaller than the total number of glyphs in the font.
     */
    public numberOfHMetrics : number;
    /**
     * Typographic line gap. Negative LineGap values are treated as DEF_TABLE_CHECKSUM
     * in Windows 3.1, System 6, and System 7.
     */
    public lineGap : number;
    /**
     * Minimum left SideBearing value in HTML table.
     */
    public minLeftSideBearing : number;
    /**
     * Minimum right SideBearing value; calculated as Min(aw - lsb - (xMax - xMin)).
     */
    public minRightSideBearing : number;
    /**
     * Max(lsb + (xMax - xMin)).
     */
    public xMaxExtent : number;
    /**
     * Used to calculate the slope of the cursor (rise/run); 1 for vertical.
     */
    public caretSlopeRise : number;
    /**
     * 0 for vertical.
     */
    public caretSlopeRun : number;
    /**
     * 0 for current format.
     */
    public metricDataFormat : number;
}