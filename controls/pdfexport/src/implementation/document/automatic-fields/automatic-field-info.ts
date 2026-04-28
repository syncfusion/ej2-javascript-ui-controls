/**
 * PdfAutomaticFieldInfo.ts class for EJ2-PDF
 * @private
 */
import { PointF } from './../../drawing/pdf-drawing';
import { PdfAutomaticField } from './automatic-field';
/**
 * Represents information about the automatic field.
 * @private
 */
export class PdfAutomaticFieldInfo {
    // Fields
    /**
     * Internal variable to store location of the field.
     * @private
     */
    private pageNumberFieldLocation : PointF = new PointF();
    /**
     * Internal variable to store field.
     * @private
     */
    private pageNumberField : PdfAutomaticField = null;
    /**
     * Internal variable to store x scaling factor.
     * @private
     */
    private scaleX : number = 1;
    /**
     * Internal variable to store y scaling factor.
     * @private
     */
    private scaleY : number = 1;
    // Constructor
    /**
     * Initializes a new instance of the 'PdfAutomaticFieldInfo' class.
     * @private
     */
    public constructor(field : PdfAutomaticFieldInfo)
    /**
     * Initializes a new instance of the 'PdfAutomaticFieldInfo' class.
     * @private
     */
    public constructor(field : PdfAutomaticField, location : PointF)
    /**
     * Initializes a new instance of the 'PdfAutomaticFieldInfo' class.
     * @private
     */
    /* tslint:disable */
    public constructor(field : PdfAutomaticField, location : PointF, scaleX : number, scaleY : number)
    public constructor(field : PdfAutomaticField | PdfAutomaticFieldInfo, location ?: PointF, scaleX ?: number, scaleY ?: number) {
        if (typeof location === 'undefined' && field instanceof PdfAutomaticFieldInfo) {
            this.pageNumberField = field.field;
            this.pageNumberFieldLocation = field.location;
            this.scaleX = field.scalingX;
            this.scaleY = field.scalingY;
        } else if (typeof scaleX === 'undefined' && location instanceof PointF && field instanceof PdfAutomaticField) {
            this.pageNumberField = field;
            this.pageNumberFieldLocation = location;
        } else {
            this.pageNumberField = field as PdfAutomaticField;
            this.pageNumberFieldLocation = location;
            this.scaleX = scaleX;
            this.scaleY = scaleY;
        }
    }
    /* tslint:enable */
    // Properties
    /**
     * Gets or sets the location.
     * @private
     */
    public get location() : PointF {
        return this.pageNumberFieldLocation;
    }
    public set location(value : PointF) {
        this.pageNumberFieldLocation = value;
    }
    /**
     * Gets or sets the field.
     * @private
     */
    public get field() : PdfAutomaticField {
        return this.pageNumberField;
    }
    public set field(value : PdfAutomaticField) {
        this.pageNumberField = value;
    }
    /**
     * Gets or sets the scaling X factor.
     * @private
     */
    public get scalingX() : number {
        return this.scaleX;
    }
    public set scalingX(value : number) {
        this.scaleX = value;
    }
    /**
     * Gets or sets the scaling Y factor.
     * @private
     */
    public get scalingY() : number {
        return this.scaleY;
    }
    public set scalingY(value : number) {
        this.scaleY = value;
    }
}