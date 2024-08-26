/**
 * PdfPageSettings.ts class for EJ2-PDF
 */
import { SizeF, PointF } from './../drawing/pdf-drawing';
import { PdfPageSize } from './pdf-page-size';
import { PdfPageRotateAngle, PdfPageOrientation } from './enum';
import { PdfMargins } from './../graphics/pdf-margins';
/**
 * The class provides various `setting` related with PDF pages.
 */
export class PdfPageSettings {
    //Fields
    /**
     * The page `margins`.
     * @private
     */
    private pageMargins : PdfMargins = new PdfMargins();
    /**
     * The page `size`.
     * @default a4
     * @private
     */
    private pageSize : SizeF = PdfPageSize.a4;
    /**
     * The page `rotation angle`.
     * @default PdfPageRotateAngle.RotateAngle0
     * @private
     */
    private rotateAngle : PdfPageRotateAngle = PdfPageRotateAngle.RotateAngle0;
    /**
     * The page `orientation`.
     * @default PdfPageOrientation.Portrait
     * @private
     */
    private pageOrientation : PdfPageOrientation = PdfPageOrientation.Portrait;
    /**
     * The page `origin`.
     * @default 0,0
     * @private
     */
    private pageOrigin : PointF = new PointF(0, 0);
    /**
     * Checks the Whether the `rotation` is applied or not.
     * @default false
     * @private
     */
    public isRotation : boolean = false;
    //constructor
    /**
     * Initializes a new instance of the `PdfPageSettings` class.
     * @private
     */
    constructor()
    /**
     * Initializes a new instance of the `PdfPageSettings` class.
     * @private
     */
    constructor(margins : number)
    constructor(margins? : number) {
        if (typeof margins === 'number') {
            this.pageMargins.setMargins(margins);
        }
    }
    //Properties
    /**
     * Gets or sets the `size` of the page.
     * @private
     */
    public get size() : SizeF {
        return this.pageSize;
    }
    public set size(value : SizeF) {
        this.setSize(value);
    }
    /**
     * Gets or sets the page `orientation`.
     * @private
     */
    public get orientation() : PdfPageOrientation {
        return this.pageOrientation;
    }
    public set orientation(orientation : PdfPageOrientation) {
        if (this.pageOrientation !== orientation) {
            this.pageOrientation = orientation;
            this.updateSize(orientation);
        }
    }
    /**
     * Gets or sets the `margins` of the page.
     * @private
     */
    public get margins() : PdfMargins {
        return this.pageMargins;
    }
    public set margins(value : PdfMargins) {
        this.pageMargins = value;
    }
    /**
     * Gets or sets the `width` of the page.
     * @private
     */
    public get width() : number {
        return this.pageSize.width;
    }
    public set width(value : number) {
        this.pageSize.width = value;
    }
    /**
     * Gets or sets the `height` of the page.
     * @private
     */
    public get height() : number {
        return this.pageSize.height;
    }
    public set height(value : number) {
        this.pageSize.height = value;
    }
    /**
     * Gets or sets the `origin` of the page.
     * @private
     */
    public get origin() : PointF {
        return this.pageOrigin;
    }
    public set origin(value : PointF) {
        this.pageOrigin = value;
    }
    /**
     * Gets or sets the number of degrees by which the page should be `rotated` clockwise when displayed or printed.
     * @private
     */
    public get rotate() : PdfPageRotateAngle {
        return this.rotateAngle;
    }
    public set rotate(value : PdfPageRotateAngle) {
        this.rotateAngle = value;
        this.isRotation = true;
    }
    //Methods
    /**
     * `Update page size` depending on orientation.
     * @private
     */
    private updateSize(orientation : PdfPageOrientation) : void {
        let min : number = Math.min(this.pageSize.width, this.pageSize.height);
        let max : number = Math.max(this.pageSize.width, this.pageSize.height);
        switch (orientation) {
            case PdfPageOrientation.Portrait :
                this.pageSize = new SizeF(min, max);
                break;
            case PdfPageOrientation.Landscape :
                this.pageSize = new SizeF(max, min);
                break;
        }
    }
    /**
     * Creates a `clone` of the object.
     * @private
     */
    public clone() : PdfPageSettings {
        let settings : PdfPageSettings = this;
        settings.pageMargins = this.pageMargins.clone();
        // if (GetTransition() != null)
        // {
        //     settings.Transition = (PdfPageTransition)Transition.clone();
        // }
        return settings;
    }
    /**
     * Returns `size`, shrinked by the margins.
     * @private
     */
    public getActualSize() : SizeF {
        let width : number = this.width - (this.margins.left + this.margins.right);
        let height : number = this.height - (this.margins.top + this.margins.bottom);
        let size : SizeF = new SizeF(width, height);
        return size;
    }
    /**
     * Sets `size` to the page aaccording to the orientation.
     * @private
     */
    private setSize(size : SizeF) : void {
        let min : number = Math.min(size.width, size.height);
        let max : number = Math.max(size.width, size.height);
        if (this.orientation === PdfPageOrientation.Portrait) {
            this.pageSize = new SizeF(min, max);
        } else {
            this.pageSize = new SizeF(max, min);
        }
    }
}