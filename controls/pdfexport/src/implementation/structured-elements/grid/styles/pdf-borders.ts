/**
 * PdfBorders.ts class for EJ2-PDF
 */
import { PdfPen } from './../../../graphics/pdf-pen';
import { PdfDashStyle } from './../../../graphics/enum';
import { PdfColor } from './../../../graphics/pdf-color';
/**
 * `PdfBorders` class used represents the cell border of the PDF grid.
 */
export class PdfBorders {
    // Fields
    /**
     * The `left` border.
     * @private
     */
    private leftPen : PdfPen;
    /**
     * The `right` border.
     * @private
     */
    private rightPen : PdfPen;
    /**
     * The `top` border.
     * @private
     */
    private topPen : PdfPen;
    /**
     * The `bottom` border.
     * @private
     */
    private bottomPen : PdfPen;
    // Properties
    /**
     * Gets or sets the `Left`.
     * @private
     */
    public get left() : PdfPen {
        return this.leftPen;
    }
    public set left(value : PdfPen) {
        this.leftPen = value;
    }
    /**
     * Gets or sets the `Right`.
     * @private
     */
    public get right() : PdfPen {
        return this.rightPen;
    }
    public set right(value : PdfPen) {
        this.rightPen = value;
    }
    /**
     * Gets or sets the `Top`.
     * @private
     */
    public get top() : PdfPen {
        return this.topPen;
    }
    public set top(value : PdfPen) {
        this.topPen = value;
    }
    /**
     * Gets or sets the `Bottom`.
     * @private
     */
    public get bottom() : PdfPen {
        return this.bottomPen;
    }
    public set bottom(value : PdfPen) {
        this.bottomPen = value;
    }
    /**
     * sets the `All`.
     * @private
     */
    public set all(value : PdfPen) {
        this.leftPen = this.rightPen = this.topPen = this.bottomPen = value;
    }
    /**
     * Gets a value indicating whether this instance `is all`.
     * @private
     */
    public get isAll() : boolean {
        return ((this.leftPen === this.rightPen) && (this.leftPen === this.topPen) && (this.leftPen === this.bottomPen));
    }
    /**
     * Gets the `default`.
     * @private
     */
    public static get default() : PdfBorders {
        return new PdfBorders();
    }

    // Constructor
    /**
     * Create a new instance for `PdfBorders` class.
     * @private
     */
    public constructor() {
        let defaultBorderPenLeft : PdfPen = new PdfPen(new PdfColor(0, 0, 0));
        defaultBorderPenLeft.dashStyle = PdfDashStyle.Solid;
        let defaultBorderPenRight : PdfPen = new PdfPen(new PdfColor(0, 0, 0));
        defaultBorderPenRight.dashStyle = PdfDashStyle.Solid;
        let defaultBorderPenTop : PdfPen = new PdfPen(new PdfColor(0, 0, 0));
        defaultBorderPenTop.dashStyle = PdfDashStyle.Solid;
        let defaultBorderPenBottom : PdfPen = new PdfPen(new PdfColor(0, 0, 0));
        defaultBorderPenBottom.dashStyle = PdfDashStyle.Solid;
        this.leftPen = defaultBorderPenLeft;
        this.rightPen = defaultBorderPenRight;
        this.topPen = defaultBorderPenTop;
        this.bottomPen = defaultBorderPenBottom;
    }
}
export class PdfPaddings {
    //Fields
    /**
     * The `left` padding.
     * @private
     */
    private leftPad : number;
    /**
     * The `right` padding.
     * @private
     */
    private rightPad : number;
    /**
     * The `top` padding.
     * @private
     */
    private topPad : number;
    /**
     * The `bottom` padding.
     * @private
     */
    private bottomPad : number;
    /**
     * The 'left' border padding set.
     * @private
     */
    public hasLeftPad : boolean = false;
    /**
     * The 'right' border padding set.
     * @private
     */
    public hasRightPad : boolean = false;
    /**
     * The 'top' border padding set.
     * @private
     */
    public hasTopPad : boolean = false;
    /**
     * The 'bottom' border padding set.
     * @private
     */
    public hasBottomPad : boolean = false;
    // Properties
    /**
     * Gets or sets the `left` value of the edge
     * @private
     */
    public get left() : number {
        return this.leftPad;
    }
    public set left(value : number) {
        this.leftPad = value;
        this.hasLeftPad = true;
    }
    /**
     * Gets or sets the `right` value of the edge.
     * @private
     */
    public get right() : number {
        return this.rightPad;
    }
    public set right(value : number) {
        this.rightPad = value;
        this.hasRightPad = true;
    }
    /**
     * Gets or sets the `top` value of the edge
     * @private
     */
    public get top() : number {
        return this.topPad;
    }
    public set top(value : number) {
        this.topPad = value;
        this.hasTopPad = true;
    }
    /**
     * Gets or sets the `bottom` value of the edge.
     * @private
     */
    public get bottom() : number {
        return this.bottomPad;
    }
    public set bottom(value : number) {
        this.bottomPad = value;
        this.hasBottomPad = true;
    }
    /**
     * Sets value to all sides `left,right,top and bottom`.s
     * @private
     */
    public set all(value : number) {
        this.leftPad = this.rightPad = this.topPad = this.bottomPad = value;
        this.hasLeftPad = true;
        this.hasRightPad = true;
        this.hasTopPad = true;
        this.hasBottomPad = true;
    }
    /**
     * Initializes a new instance of the `PdfPaddings` class.
     * @private
     */
    public constructor()
    /**
     * Initializes a new instance of the `PdfPaddings` class.
     * @private
     */
    public constructor(left : number, right : number, top : number, bottom : number)
    public constructor(left ?: number, right ?: number, top ?: number, bottom ?: number) {
        if (typeof left === 'undefined') {
            //5.76 and 0 are taken from ms-word default table margins.
            this.leftPad = this.rightPad = 5.76;
            //0.5 is set for top and bottom by default.
            this.bottomPad = this.topPad = 0.5;
        } else {
            this.leftPad = left;
            this.rightPad = right;
            this.topPad = top;
            this.bottomPad = bottom;
            this.hasLeftPad = true;
            this.hasRightPad = true;
            this.hasTopPad = true;
            this.hasBottomPad = true;
        }
    }
}