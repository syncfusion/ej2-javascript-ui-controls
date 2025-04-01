import { _ImageDecoder } from './../../graphics/images/image-decoder';
import { PdfImage } from './pdf-image';
import { _PdfStream } from './../../base-stream';
import { _PdfDictionary, _PdfName } from './../../pdf-primitives';
import { _decode, _getDecoder } from './../../utils';
import { _PdfColorSpace } from './../../enumerator';
import { _PngDecoder } from './png-decoder';
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
        this._decoder = _getDecoder(byteArray);
        this.height = this._decoder._height;
        this.width = this._decoder._width;
        this._bitsPerComponent = this._decoder._bitsPerComponent;
    }
    _save(): void {
        this._imageStatus = true;
        this._imageStream = this._decoder._getImageDictionary();
        if (this._decoder && this._decoder instanceof _PngDecoder) {
            const decoder: _PngDecoder = this._decoder as _PngDecoder;
            this._maskStream = decoder._maskStream;
            if (decoder._isDecode) {
                if (decoder._colorSpace) {
                    this._setColorSpace();
                }
            } else {
                this._setColorSpace();
            }
        } else {
            this._setColorSpace();
        }
    }
    _setColorSpace(): void {
        const stream: _PdfStream = this._imageStream;
        const dictionary: _PdfDictionary = stream.dictionary;
        const color: _PdfName = dictionary.get('ColorSpace');
        let colorSpace: _PdfColorSpace;
        if (color.name === 'DeviceCMYK') {
            colorSpace = _PdfColorSpace.cmyk;
        } else if (color.name === 'DeviceGray') {
            colorSpace = _PdfColorSpace.grayScale;
        }
        if (this._decoder instanceof _PngDecoder) {
            const cs: any[] = (this._decoder as _PngDecoder)._colorSpace;// eslint-disable-line
            if (typeof cs !== 'undefined' && cs !== null) {
                colorSpace = _PdfColorSpace.indexed;
            }
        }
        switch (colorSpace) {
        case _PdfColorSpace.cmyk:
            dictionary.update('Decode', [1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0]);
            dictionary.update('ColorSpace', _PdfName.get('DeviceCMYK'));
            break;
        case _PdfColorSpace.grayScale:
            dictionary.update('Decode', [0.0, 1.0]);
            dictionary.update('ColorSpace', _PdfName.get('DeviceGray'));
            break;
        case _PdfColorSpace.rgb:
            dictionary.update('Decode', [0.0, 1.0, 0.0, 1.0, 0.0, 1.0]);
            dictionary.update('ColorSpace', _PdfName.get('DeviceRGB'));
            break;
        case _PdfColorSpace.indexed:
            dictionary.update('ColorSpace', (this._decoder as _PngDecoder)._colorSpace);
            break;
        default:
            break;
        }
    }
}
