/**
 * PdfUnitConverter.ts class for EJ2-PDF
 */
import { PdfGraphicsUnit } from './../graphics/enum';
/**
 * Used to perform `convertion between pixels and points`.
 * @private
 */
export class PdfUnitConverter {
    //Fields
    /**
     * Indicates default `horizontal resolution`.
     * @default 96
     * @private
     */
    public static readonly horizontalResolution : number = 96;
    /**
     * Indicates default `vertical resolution`.
     * @default 96
     * @private
     */
    public static readonly verticalResolution: number = 96;
    /**
     * `Width, in millimeters`, of the physical screen.
     * @private
     */
    public static readonly horizontalSize: number;
    /**
     * `Height, in millimeters`, of the physical screen.
     * @private
     */
    public static readonly verticalSize: number;
    /**
     * `Width, in pixels`, of the screen.
     * @private
     */
    public static readonly pxHorizontalResolution: number;
    /**
     * `Height, in pixels`, of the screen.
     * @private
     */
    public static readonly pxVerticalResolution: number;
    /**
     * `Matrix` for conversations between different numeric systems.
     * @private
     */
    private proportions : number[];
    //constructors
    /**
     * Initializes a new instance of the `UnitConvertor` class with DPI value.
     * @private
     */
    public constructor( dpi : number) {
        this.updateProportionsHelper(dpi);
    }
    /**
     * `Converts` the value, from one graphics unit to another graphics unit.
     * @private
     */
    public convertUnits(value : number, from : PdfGraphicsUnit, to : PdfGraphicsUnit) : number {
        return this.convertFromPixels(this.convertToPixels(value, from), to);
    }
    /**
     * Converts the value `to pixel` from specified graphics unit.
     * @private
     */
    public convertToPixels(value : number, from : PdfGraphicsUnit) : number {
        let index : number = (from as number);
        let result : number = (value * this.proportions[index]) as number;
        return result;
    }
    /**
     * Converts value, to specified graphics unit `from Pixel`.
     * @private
     */
    public convertFromPixels(value : number, to : PdfGraphicsUnit) : number {
        let index : number = to as number;
        let result : number = (value / this.proportions[index]) as number;
        return result;
    }
    /**
     * `Update proportions` matrix according to Graphics settings.
     * @private
     */
    private updateProportionsHelper(pixelPerInch : number) : void {
        this.proportions = [
            pixelPerInch / 2.54,  // Centimeter
            pixelPerInch / 6.0,      // Pica
            1,                     // Pixel
            pixelPerInch / 72.0,     // Point
            pixelPerInch,          // Inch
            pixelPerInch / 300.0,    // Document
            pixelPerInch / 25.4  // Millimeter
        ];
    }
}