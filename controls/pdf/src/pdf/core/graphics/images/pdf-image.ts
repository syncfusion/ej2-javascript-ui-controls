import { _PdfReference } from './../../pdf-primitives';
import { _PdfStream } from './../../base-stream';
import { _PdfGraphicsUnit } from './../../enumerator';
import { PdfGraphics, _PdfUnitConvertor, PdfGraphicsState } from './../../graphics/pdf-graphics';
import { Point, Size } from './../../pdf-type';
/**
 * The 'PdfImage' contains methods and properties to handle the images.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Access first page
 * let page: PdfPage = document.getPage(0);
 * // Gets the graphics of the PDF page
 * let graphics: PdfGraphics = page.graphics;
 * // Create new image object by using JPEG image data as Base64 string format
 * let image: PdfImage = new PdfBitmap('/9j/4AAQSkZJRgABAQEAkACQAAD/4....QB//Z');
 * //Draw the image.
 * graphics.drawImage(image, {x: 10, y: 20, width: 400, height: 400});
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export abstract class PdfImage {
    /**
     * Logical width of the image.
     *
     * @private
     */
    _imageWidth: number;
    /**
     * Logical height of the image.
     *
     * @private
     */
    _imageHeight: number;
    /**
     * Bits per component for the image.
     *
     * @private
     */
    _bitsPerComponent: number;
    /**
     * Horizontal resolution.
     *
     * @private
     */
    _horizontalResolution: number;
    /**
     * Vertical resolution.
     *
     * @private
     */
    _verticalResolution: number;
    /**
     * Physical dimensions as [width, height].
     *
     * @private
     */
    _imagePhysicalDimension: number[];
    /**
     * PDF image stream associated with the image XObject.
     *
     * @private
     */
    _imageStream: _PdfStream;
    /**
     * Optional soft mask stream for transparency.
     *
     * @private
     */
    _maskStream: _PdfStream;
    /**
     * Reference to the image object in the cross-reference table.
     *
     * @private
     */
    _reference: _PdfReference;
    /**
     * Reference to the mask object in the cross-reference table.
     *
     * @private
     */
    _maskReference: _PdfReference;
    _key: string;
    /**
     * Gets the width of the PDF image.
     *
     * @returns {number} image width.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create new image object by using JPEG image data as Base64 string format
     * let image: PdfImage = new PdfBitmap('/9j/4AAQSkZJRgABAQEAkACQAAD/4....QB//Z');
     * // Gets the width of the image.
     * let width: number = image.width;
     * //Draw the image.
     * image.draw(graphics);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get width(): number {
        return this._imageWidth;
    }
    /**
     * Sets the width of the PDF image.
     *
     * @param {number} value value.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create new image object by using JPEG image data as Base64 string format
     * let image: PdfImage = new PdfBitmap('/9j/4AAQSkZJRgABAQEAkACQAAD/4....QB//Z');
     * // Sets the width of the image.
     * image.width = 100;
     * //Draw the image.
     * image.draw(graphics);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set width(value: number) {
        this._imageWidth = value;
    }
    /**
     * Gets the height of the PDF image.
     *
     * @returns {number} image height.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create new image object by using JPEG image data as Base64 string format
     * let image: PdfImage = new PdfBitmap('/9j/4AAQSkZJRgABAQEAkACQAAD/4....QB//Z');
     * // Gets the height of the image.
     * let height: number = image.height;
     * //Draw the image.
     * image.draw(graphics);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get height(): number {
        return this._imageHeight;
    }
    /**
     * Sets the height of the PDF image.
     *
     * @param {number} value value.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create new image object by using JPEG image data as Base64 string format
     * let image: PdfImage = new PdfBitmap('/9j/4AAQSkZJRgABAQEAkACQAAD/4....QB//Z');
     * // Sets the height of the image.
     * image.height = 100;
     * //Draw the image.
     * image.draw(graphics);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set height(value: number) {
        this._imageHeight = value;
    }
    /**
     * Gets the physical dimension of the PDF image (Read only).
     *
     * @returns {Size} image physical dimension.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create new image object by using JPEG image data as Base64 string format
     * let image: PdfImage = new PdfBitmap('/9j/4AAQSkZJRgABAQEAkACQAAD/4....QB//Z');
     * // Gets the physical dimension of the image.
     * let dimension: Size = image.physicalDimension;
     * //Draw the image.
     * image.draw(graphics);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get physicalDimension(): Size {
        this._imagePhysicalDimension = this._getPointSize(this.width, this.height, this._horizontalResolution);
        return {width: this.width, height: this.height};
    }
    /**
     * Represents a method to draw a image on the PDF graphics.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create new image object by using JPEG image data as Base64 string format
     * let image: PdfImage = new PdfBitmap('/9j/4AAQSkZJRgABAQEAkACQAAD/4....QB//Z');
     * //Draw the image.
     * image.draw(graphics);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @param {PdfGraphics} graphics value.
     * @returns {void} Draws a image on the page graphics.
     */
    public draw(graphics: PdfGraphics): void
    /**
     * Represents a method to draw a image on the PDF graphics.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create new image object by using JPEG image data as Base64 string format
     * let image: PdfImage = new PdfBitmap('/9j/4AAQSkZJRgABAQEAkACQAAD/4....QB//Z');
     * //Draw the image.
     * image.draw(graphics, {x: 10, y: 10});
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @param {PdfGraphics} graphics value.
     * @param {Point} location The (x, y) coordinates of the image
     * @returns {void} Draws a image on the page graphics.
     */
    public draw(graphics: PdfGraphics, location: Point): void
    public draw(graphics: PdfGraphics, location?: Point): void {
        if (location && (location.x === null || typeof location.x === 'undefined') && (location.y === null || typeof location.y === 'undefined')) {
            location.x = 0;
            location.y = 0;
        }
        let needSave: boolean;
        if (location) {
            needSave = (location.x !== 0 || location.y !== 0);
        }
        let state: PdfGraphicsState = null;
        if (needSave) {
            state = graphics.save();
            graphics.translateTransform(location);
        }
        graphics.drawImage(this, {x: 0, y: 0});
        if (needSave) {
            graphics.restore(state);
        }
    }
    /**
     * Finalizes the image for PDF embedding by creating or updating the underlying
     * image stream and related references, ready for drawing.
     *
     * @private
     * @returns {void}
     */
    abstract _save(): void;
    /**
     * Converts the given pixel dimensions to PDF points using the default DPI (96),
     * returning a tuple `[widthInPt, heightInPt]`.
     *
     * @private
     * @param {number} width The image width in pixels.
     * @param {number} height The image height in pixels.
     * @returns {number[]} The size in points as `[ptWidth, ptHeight]`.
     */
    _getPointSize(width: number, height: number): number[]
    /**
     * Converts the given pixel dimensions to PDF points using the specified horizontal
     * resolution (DPI), returning a tuple `[widthInPt, heightInPt]`.
     *
     * @private
     * @param {number} width The image width in pixels.
     * @param {number} height The image height in pixels.
     * @param {number} horizontalResolution The horizontal DPI used for conversion.
     * @returns {number[]} The size in points as `[ptWidth, ptHeight]`.
     */
    _getPointSize(width: number, height: number, horizontalResolution: number): number[]
    _getPointSize(width: number, height: number, horizontalResolution ?: number): number[] {
        if ((horizontalResolution === null || typeof horizontalResolution === 'undefined')) {
            const dpiX: number = 96;
            const size: number[] = this._getPointSize(width, height, dpiX);
            return size;
        } else {
            const ucX: _PdfUnitConvertor = new _PdfUnitConvertor();
            const ucY: _PdfUnitConvertor = new _PdfUnitConvertor();
            const ptWidth: number = ucX._convertUnits(width, _PdfGraphicsUnit.pixel, _PdfGraphicsUnit.point);
            const ptHeight: number = ucY._convertUnits(height, _PdfGraphicsUnit.pixel, _PdfGraphicsUnit.point);
            const size: number[] = [ptWidth, ptHeight];
            return size;
        }
    }
}
