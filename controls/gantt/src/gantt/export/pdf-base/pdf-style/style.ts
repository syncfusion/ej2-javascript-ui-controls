/**
 * PdfGridStyleBase.ts class for EJ2-PDF
 */
import { PdfBrush, PdfPen, PdfFont, PdfBorderOverlapStyle } from '@syncfusion/ej2-pdf-export';
import { PdfPaddings } from '../index';
import { PdfHorizontalOverflowType } from '../../../base/interface';
/**
 * Base class for the `treegrid style`,
 */
export abstract class PdfTreeGridStyleBase {
    /**
     * Gets or sets the `background brush`.
     * @private
     */
    public backgroundBrush: PdfBrush;
    /**
     * Gets or sets the `text brush`.
     * @private
     */
    public textBrush: PdfBrush;
    /**
     * Gets or sets the `text pen`.
     * @private
     */
    public textPen: PdfPen;
    /**
     * Gets or sets the `font`.
     * @private
     */
    public font: PdfFont;
    /**
     * Gets or sets the `background Image`.
     * @private
     */
    //public backgroundImage: PdfImage;
}
/**
 * `PdfTreeGridStyle` class provides customization of the appearance for the 'PdfGrid'.
 */
export class PdfTreeGridStyle {
    /**
     * Gets or sets the `border overlap style` of the 'PdfGrid'.
     * @private
     */
    public borderOverlapStyle: PdfBorderOverlapStyle;
    /**
     * Gets or sets the type of the `horizontal overflow` of the 'PdfGrid'.
     * @private
     */
    public horizontalOverflowType: PdfHorizontalOverflowType;
    /**
     * Gets or sets a value indicating whether to `allow horizontal overflow`.
     * @private
     */
    public allowHorizontalOverflow: boolean;
    /**
     * Gets or sets the `cell padding`.
     * @private
     */
    public cellPadding: PdfPaddings;
    /**
     * Gets or sets the `cell spacing` of the 'PdfGrid'.
     * @private
     */
    public cellSpacing: number;

    //constructor
    /**
     * Initialize a new instance for `PdfGridStyle` class.
     * @private
     */
    public constructor() {
        this.cellSpacing = 0;
        this.borderOverlapStyle = PdfBorderOverlapStyle.Overlap;
        this.allowHorizontalOverflow = false;
        this.horizontalOverflowType = PdfHorizontalOverflowType.LastPage;
        this.cellPadding = new PdfPaddings();
    }
}
