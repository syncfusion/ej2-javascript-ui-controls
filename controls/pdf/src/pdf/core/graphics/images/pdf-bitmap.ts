import { _ImageDecoder } from './../../graphics/images/image-decoder';
import { PdfImage } from './pdf-image';
import { _decode } from './../../utils';
/**
 * The 'PdfBitmap' contains methods and properties to handle the Bitmap images.
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
export class PdfBitmap extends PdfImage {
    _imageStatus: boolean = true;
    _checkImageType: number;
    _decoder: _ImageDecoder;
    /**
     * Create an instance for `PdfBitmap` class.
     *
     * @param {string} encodedString Image as Base64 string.
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
    constructor(encodedString: string)
    /**
     * Create an instance for `PdfBitmap` class.
     *
     * @param {Uint8Array} encodedString Image data as byte array.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create new image object by using JPEG image data as array of bytes
     * let image: PdfImage = new PdfBitmap(array);
     * //Draw the image.
     * graphics.drawImage(image, 10, 20, 400, 400);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor(encodedString: Uint8Array)
    constructor(encodedString: string | Uint8Array) {
        super();
        if (encodedString !== null && typeof encodedString !== 'undefined' && typeof encodedString === 'string') {
            this._initializeAsync(encodedString);
        } else {
            this._initializeAsync(encodedString as Uint8Array);
        }
    }
    _initializeAsync(encodedString: string): void
    _initializeAsync(encodedString: Uint8Array): void
    _initializeAsync(encodedString: string | Uint8Array): void {
        let byteArray: Uint8Array = new Uint8Array(encodedString.length);
        if (encodedString !== null && typeof encodedString !== 'undefined' && typeof encodedString === 'string') {
            byteArray = _decode(encodedString, false) as Uint8Array;
        } else if (encodedString instanceof Uint8Array) {
            byteArray = encodedString;
        }
        this._decoder = new _ImageDecoder(byteArray);
        this.height = this._decoder._height;
        this.width = this._decoder._width;
        this._bitsPerComponent = this._decoder._bitsPerComponent;
    }
    _save(): void {
        this._imageStatus = true;
        this._imageStream = this._decoder._getImageDictionary();
    }
}
