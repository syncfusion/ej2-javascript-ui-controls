/**
 * PdfImage.ts class for EJ2-PDF
 */
import { IPdfWrapper } from './../../../interfaces/i-pdf-wrapper';
import { IPdfPrimitive } from './../../../interfaces/i-pdf-primitives';
import { PdfStream } from './../../primitives/pdf-stream';
import { SizeF } from './../../drawing/pdf-drawing';
import { PdfGraphicsUnit } from './../enum';
import { PdfUnitConverter } from './../unit-convertor';
import { PdfBitmap } from './pdf-bitmap';
/**
 * `PdfImage` class represents the base class for images and provides functionality for the 'PdfBitmap' class.
 * @private
 */
export abstract class PdfImage implements IPdfWrapper {
    /**
     * `Width` of an image.
     * @private
     */
    private imageWidth : number;
    /**
     * `Height` of an image.
     * @private
     */
    private imageHeight : number;
    /**
     * `Bits per component` of an image.
     * @hidden
     * @private
     */
    public bitsPerComponent : number;
    /**
     * `horizontal resolution` of an image.
     * @hidden
     * @private
     */
    public horizontalResolution : number;
    /**
     * `Vertical resolution` of an image.
     * @hidden
     * @private
     */
    public verticalResolution : number;
    /**
     * `physical dimension` of an image.
     * @hidden
     * @private
     */
    private imagePhysicalDimension : SizeF;
    /**
     * Gets and Sets the `width` of an image.
     * @private
     */
    public get width() : number {
        return this.imageWidth;
    }
    public set width(value : number) {
        this.imageWidth = value;
    }
    /**
     * Gets and Sets the `height` of an image.
     * @private
     */
    public get height() : number {
        return this.imageHeight;
    }
    public set height(value : number) {
        this.imageHeight = value;
    }
    /**
     * Gets or sets the size of the image.
     * @private
     */
    public set size(value : SizeF) {
        this.width = value.width;
        this.height = value.height;
    }
    /**
     * Gets the `physical dimension` of an image.
     * @private
     */
    public get physicalDimension() : SizeF {
        this.imagePhysicalDimension = this.getPointSize(this.width, this.height, this.horizontalResolution, this.verticalResolution);
        return new SizeF(this.width, this.height);
    }
    /**
     * return the stored `stream of an image`.
     * @private
     */
    public imageStream : PdfStream;
    // /**
    //  * Gets the `image stream as string`.
    //  * @private
    //  */
    // public static fromString(string : string) : PdfImage {
    //     let image : PdfImage = new PdfBitmap(string);
    //     return image;
    // }
    /**
     * Gets the `element` image stream.
     * @private
     */
    public get element() : IPdfPrimitive {
        return this.imageStream;
    }
    /**
     * `Save` the image stream.
     * @private
     */
    public abstract save() : void;
    /**
     * Return the value of `width and height of an image` in points.
     * @private
     */
    public getPointSize(width : number, height : number) : SizeF
    public getPointSize(width : number, height : number, horizontalResolution : number, verticalResolution : number) : SizeF
    public getPointSize(width : number, height : number, horizontalResolution ?: number, verticalResolution ?: number) : SizeF {
        if (typeof horizontalResolution === 'undefined') {
            let dpiX : number = PdfUnitConverter.horizontalResolution;
            let dpiY : number = PdfUnitConverter.verticalResolution;
            let size : SizeF = this.getPointSize(width, height, dpiX, dpiY);
            return size;
        } else {
            let ucX : PdfUnitConverter = new PdfUnitConverter(horizontalResolution);
            let ucY : PdfUnitConverter = new PdfUnitConverter(verticalResolution);
            let ptWidth : number = ucX.convertUnits(width, PdfGraphicsUnit.Pixel, PdfGraphicsUnit.Point);
            let ptHeight : number = ucY.convertUnits(height, PdfGraphicsUnit.Pixel, PdfGraphicsUnit.Point);
            let size : SizeF = new SizeF(ptWidth, ptHeight);
            return size;
        }
    }
}