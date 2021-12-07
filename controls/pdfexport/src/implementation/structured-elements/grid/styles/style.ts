/**
 * PdfGridStyleBase.ts class for EJ2-PDF
 */
import { PdfBrush } from './../../../graphics/brushes/pdf-brush';
import { PdfPen } from './../../../graphics/pdf-pen';
import { PdfFont } from './../../../graphics/fonts/pdf-font';
import { PdfBorders, PdfPaddings } from './pdf-borders';
import { PdfBorderOverlapStyle } from './../../tables/light-tables/enum';
import { PdfStringFormat } from './../../../graphics/fonts/pdf-string-format';
import { PdfGridRow } from './../pdf-grid-row';
import { PdfImage } from  './../../../graphics/images/pdf-image';
/**
 * Base class for the `grid style`,
 */
export abstract class PdfGridStyleBase {
    /**
     * @hidden
     * @private
     */
    private gridBackgroundBrush : PdfBrush;
    /**
     * @hidden
     * @private
     */
    private gridTextBrush : PdfBrush;
    /**
     * @hidden
     * @private
     */
    private gridTextPen : PdfPen;
    /**
     * @hidden
     * @private
     */
    private gridFont : PdfFont;
    /**
     * @hidden
     * @private
     */
    private gridBackgroundImage : PdfImage;
    // Properties
    /**
     * Gets or sets the `background brush`.
     * @private
     */
    public get backgroundBrush() : PdfBrush {
        return this.gridBackgroundBrush;
    }
    public set backgroundBrush(value : PdfBrush) {
        this.gridBackgroundBrush = value;
    }
    /**
     * Gets or sets the `text brush`.
     * @private
     */
    public get textBrush() : PdfBrush {
        return this.gridTextBrush;
    }
    public set textBrush(value : PdfBrush) {
        this.gridTextBrush = value;
    }
    /**
     * Gets or sets the `text pen`.
     * @private
     */
    public get textPen() : PdfPen {
        return this.gridTextPen;
    }
    public set textPen(value : PdfPen) {
        this.gridTextPen = value;
    }
    /**
     * Gets or sets the `font`.
     * @private
     */
    public get font() : PdfFont {
        return this.gridFont;
    }
    public set font(value : PdfFont) {
        this.gridFont = value;
    }
    /**
     * Gets or sets the `background Image`.
     * @private
     */
    public get backgroundImage() : PdfImage {
        return this.gridBackgroundImage;
    }
    public set backgroundImage(value : PdfImage) {
        this.gridBackgroundImage = value;
    }
}
/**
 * `PdfGridStyle` class provides customization of the appearance for the 'PdfGrid'.
 */
export class PdfGridStyle extends PdfGridStyleBase {
    //Fields
    /**
     * @hidden
     * @private
     */
    private gridBorderOverlapStyle : PdfBorderOverlapStyle;
    /**
     * @hidden
     * @private
     */
    private gridHorizontalOverflowType : PdfHorizontalOverflowType;
    /**
     * @hidden
     * @private
     */
    private bAllowHorizontalOverflow : boolean;
    /**
     * @hidden
     * @private
     */
    private gridCellPadding : PdfPaddings;
    /**
     * @hidden
     * @private
     */
    private gridCellSpacing : number;

    //constructor
    /**
     * Initialize a new instance for `PdfGridStyle` class.
     * @private
     */
    public constructor() {
        super();
        this.gridBorderOverlapStyle = PdfBorderOverlapStyle.Overlap;
        this.bAllowHorizontalOverflow = false;
        this.gridHorizontalOverflowType = PdfHorizontalOverflowType.LastPage;
    }

    //Properties
    /**
     * Gets or sets the `cell spacing` of the 'PdfGrid'.
     * @private
     */
    public get cellSpacing() : number {
        if (typeof this.gridCellSpacing === 'undefined') {
            this.gridCellSpacing = 0;
        }
        return this.gridCellSpacing;
    }
    public set cellSpacing(value : number) {
        this.gridCellSpacing = value;
    }
    /**
     * Gets or sets the type of the `horizontal overflow` of the 'PdfGrid'.
     * @private
     */
    public get horizontalOverflowType() : PdfHorizontalOverflowType {
        return this.gridHorizontalOverflowType;
    }
    public set horizontalOverflowType(value : PdfHorizontalOverflowType) {
        this.gridHorizontalOverflowType = value;
    }
    /**
     * Gets or sets a value indicating whether to `allow horizontal overflow`.
     * @private
     */
    public get allowHorizontalOverflow() : boolean {
        return this.bAllowHorizontalOverflow;
    }
    public set allowHorizontalOverflow(value : boolean) {
        this.bAllowHorizontalOverflow = value;
    }
    /**
     * Gets or sets the `cell padding`.
     * @private
     */
    public get cellPadding() : PdfPaddings {
        if (typeof this.gridCellPadding === 'undefined') {
            this.gridCellPadding = new PdfPaddings();
        }
        return this.gridCellPadding;
    }
    public set cellPadding(value : PdfPaddings) {
        if (typeof this.gridCellPadding === 'undefined') {
            this.gridCellPadding = new PdfPaddings();
            this.gridCellPadding = value;
        } else {
            this.gridCellPadding = value;
        }
    }
    /**
     * Gets or sets the `border overlap style` of the 'PdfGrid'.
     * @private
     */
    public get borderOverlapStyle() : PdfBorderOverlapStyle {
        return this.gridBorderOverlapStyle;
    }
    public set borderOverlapStyle(value : PdfBorderOverlapStyle) {
        this.gridBorderOverlapStyle = value;
    }
}
/**
 * `PdfGridCellStyle` class provides customization of the appearance for the 'PdfGridCell'.
 */
export class PdfGridCellStyle extends PdfGridStyleBase {
    /**
     * @hidden
     * @private
     */
    private gridCellBorders : PdfBorders = PdfBorders.default;
    /**
     * @hidden
     * @private
     */
    private gridCellPadding : PdfPaddings;
    /**
     * @hidden
     * @private
     */
    private format : PdfStringFormat;
    //Properties
    /**
     * Gets the `string format` of the 'PdfGridCell'.
     * @private
     */
    public get stringFormat() : PdfStringFormat {
        return this.format;
    }
    public set stringFormat(value : PdfStringFormat) {
        this.format = value;
    }
    /**
     * Gets or sets the `border` of the 'PdfGridCell'.
     * @private
     */
    public get borders() : PdfBorders {
        return this.gridCellBorders;
    }
    public set borders(value : PdfBorders) {
        this.gridCellBorders = value;
    }
    /**
     * Gets or sets the `cell padding`.
     * @private
     */
    public get cellPadding() : PdfPaddings {
        return this.gridCellPadding;
    }
    public set cellPadding(value : PdfPaddings) {
        if (this.gridCellPadding == null || typeof this.gridCellPadding === 'undefined') {
            this.gridCellPadding = new PdfPaddings();
        }
        this.gridCellPadding = value;
    }
    /**
     * Initializes a new instance of the `PdfGridCellStyle` class.
     * @private
     */
    public constructor() {
        super();
    }
}
/**
 * `PdfGridRowStyle` class provides customization of the appearance for the `PdfGridRow`.
 */
export class PdfGridRowStyle {
    //Fields
    /**
     * @hidden
     * @private
     */
    private gridRowBackgroundBrush : PdfBrush;
    /**
     * @hidden
     * @private
     */
    private gridRowTextBrush : PdfBrush;
    /**
     * @hidden
     * @private
     */
    private gridRowTextPen : PdfPen;
    /**
     * @hidden
     * @private
     */
    private gridRowFont : PdfFont;
    /**
     * Specifies the `border` value of the current row.
     * @private
     */
    private gridRowBorder : PdfBorders;
    /**
     * Specifies the `parent row` of the current object.
     * @private
     */
    private parent : PdfGridRow;
    /**
     * @hidden
     * @private
     */
    private gridRowBackgroundImage : PdfImage;
    // Properties
    /**
     * Gets or sets the `background brush`.
     * @private
     */
    public get backgroundBrush() : PdfBrush {
        return this.gridRowBackgroundBrush;
    }
    public setBackgroundBrush(value : PdfBrush) : void {
        this.gridRowBackgroundBrush = value;
        if (typeof this.parent !== 'undefined') {
            for (let i : number = 0; i < this.parent.cells.count; i++) {
                this.parent.cells.getCell(i).style.backgroundBrush = value;
            }
        }
    }
    /**
     * Gets or sets the `text brush`.
     * @private
     */
    public get textBrush() : PdfBrush {
        return this.gridRowTextBrush;
    }
    public setTextBrush(value : PdfBrush) : void {
        this.gridRowTextBrush = value;
        if (typeof this.parent !== 'undefined') {
            for (let i : number = 0; i < this.parent.cells.count; i++) {
                this.parent.cells.getCell(i).style.textBrush = value;
            }
        }
    }
    /**
     * Gets or sets the `text pen`.
     * @private
     */
    public get textPen() : PdfPen {
        return this.gridRowTextPen;
    }
    public setTextPen(value : PdfPen) : void {
        this.gridRowTextPen = value;
        if (typeof this.parent !== 'undefined') {
            for (let i : number = 0; i < this.parent.cells.count; i++) {
                this.parent.cells.getCell(i).style.textPen = value;
            }
        }
    }
    /**
     * Gets or sets the `font`.
     * @private
     */
    public get font() : PdfFont {
        return this.gridRowFont;
    }
    public setFont(value : PdfFont) : void {
        this.gridRowFont = value;
        if (typeof this.parent !== 'undefined') {
            for (let i : number = 0; i < this.parent.cells.count; i++) {
                this.parent.cells.getCell(i).style.font = value;
            }
        }
    }
    /**
     * Gets or sets the `border` of the current row.
     * @private
     */
    public get border() : PdfBorders {
        if (typeof this.gridRowBorder === 'undefined') {
            this.setBorder(new PdfBorders());
        }
        return this.gridRowBorder;
    }
    public setBorder(value : PdfBorders) : void {
        this.gridRowBorder = value;
        if (typeof this.parent !== 'undefined') {
            for (let i : number = 0; i < this.parent.cells.count; i++) {
                this.parent.cells.getCell(i).style.borders = value;
            }
        }
    }
    /**
     * sets the `parent row` of the current object.
     * @private
     */
    public setParent(parent : PdfGridRow) : void {
        this.parent = parent;
    }
    /**
     * Gets or sets the `backgroundImage` of the 'PdfGridCell'.
     * @private
     */
    public get backgroundImage() : PdfImage {
        return this.gridRowBackgroundImage;
    }
    /**
     * sets the `backgroundImage` of the 'PdfGridCell'.
     * @private
     */
    public setBackgroundImage(value: PdfImage): void {
        this.gridRowBackgroundImage = value;
    }
    // Constructor
    /**
     * Initializes a new instance of the `PdfGridRowStyle` class.
     * @private
     */
    public constructor() {
        //
    }
}
/**
 * public Enum for `PdfHorizontalOverflowType`.
 * @private
 */
export enum PdfHorizontalOverflowType {
    /**
     * Specifies the type of `NextPage`.
     * @private
     */
    NextPage,
    /**
     * Specifies the type of `LastPage`.
     * @private
     */
    LastPage
}