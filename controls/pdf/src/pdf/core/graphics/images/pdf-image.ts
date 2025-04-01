import { _PdfReference } from './../../pdf-primitives';
import { _PdfStream } from './../../base-stream';
import { _PdfGraphicsUnit } from './../../enumerator';
import { PdfGraphics, _PdfUnitConvertor, PdfGraphicsState } from './../../graphics/pdf-graphics';
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
 * graphics.drawImage(image, 10, 20, 400, 400);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export abstract class PdfImage {
    _imageWidth: number;
    _imageHeight: number;
    _bitsPerComponent: number;
    _horizontalResolution: number;
    _verticalResolution: number;
    _imagePhysicalDimension: number[];
    _imageStream: _PdfStream;
    _maskStream: _PdfStream;
    _reference: _PdfReference;
    _maskReference: _PdfReference;
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
     * @returns {number[]} image physical dimension.
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
     * let dimension: number[] = image.physicalDimension;
     * //Draw the image.
     * image.draw(graphics);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get physicalDimension(): number[] {
        this._imagePhysicalDimension = this._getPointSize(this.width, this.height, this._horizontalResolution);
        return [this.width, this.height];
    }
    /**
     * Represents a method to draw a image on the PDF graphics.
     *
     * @param {PdfGraphics} graphics value.
     * @returns {void} Draws a image on the page graphics.
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
     */
    draw(graphics: PdfGraphics): void
    /**
     * Represents a method to draw a image on the PDF graphics.
     *
     * @param {PdfGraphics} graphics value.
     * @param {number} x The x-coordinate of the image
     * @param {number} y The y-coordinate of the image.
     * @returns {void} Draws a image on the page graphics.
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
     * image.draw(graphics, 10, 10);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    draw(graphics: PdfGraphics, x: number, y: number): void
    draw(graphics: PdfGraphics, x?: number, y?: number): void {
        if ((x === null || typeof x === 'undefined') && (y === null || typeof y === 'undefined')) {
            x = 0;
            y = 0;
        }
        const needSave: boolean = (x !== 0 || y !== 0);
        let state: PdfGraphicsState = null;
        if (needSave) {
            state = graphics.save();
            graphics.translateTransform(x, y);
        }
        graphics.drawImage(this, 0, 0);
        if (needSave) {
            graphics.restore(state);
        }
    }
    abstract _save(): void;
    _getPointSize(width: number, height: number): number[]
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
