import { Rectangle, Size } from '@syncfusion/ej2-pdf';
import { ImageFormat } from '../enum';
/**
 * The class provides detailed metadata about an image that is embedded inside a PDF document.
 *
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data);
 * // Initialize a new instance of the `PdfDataExtractor` class
 * let extractor: PdfDataExtractor = new PdfDataExtractor(document);
 * // Extract collection of `PdfEmbeddedImage` from the PDF document.
 * let imageInfoCollection: PdfEmbeddedImage[] = extractor.extractImages({ startPageIndex: 0, endPageIndex: document.pageCount - 1});
 * let imageInfo: PdfEmbeddedImage = imageInfoCollection[0];
 * // Gets the raw image bytes of the embedded image.
 * let data: Uint8Array = imageInfo.data;
 * // Gets the image format.
 * let type: ImageFormat = imageInfo.type;
 * // Gets the page index of the image.
 * let pageIndex: number = imageInfo.pageIndex;
 * // Gets the index of the image occurrence within PDF page.
 * let index: number = imageInfo.index;
 * // Gets the bounds of the image.
 * let bounds: Rectangle = imageInfo.bounds;
 * // Gets the boolean flag indicating whether the image is interpolated or not.
 * let isImageInterpolated: boolean = imageInfo.isImageInterpolated;
 * // Gets the boolean flag indicating whether the image is masked or not.
 * let IsImageMasked: boolean = imageInfo.IsImageMasked;
 * // Gets the boolean flag indicating whether the image is soft masked or not.
 * let IsSoftMasked: boolean = imageInfo.IsSoftMasked;
 * // Destroy the documents
 * document.destroy();
 * ```
 */
export class PdfEmbeddedImage {
    /**
     * Raw decoded bytes of the embedded image.
     *
     * @private
     */
    _data: Uint8Array = new Uint8Array([]);
    /**
     * Internal stored image format.
     *
     * @private
     */
    _type: ImageFormat;
    /**
     * Internal XObject resource name for the image.
     *
     * @private
     */
    _resourceName: string;
    /**
     * Internal physical pixel dimensions of the embedded image.
     *
     * @private
     */
    _physicalDimension: Size;
    /**
     * Internal page index the image belongs to.
     *
     * @private
     */
    _pageIndex: number;
    /**
     * Internal index of this image occurrence within the page.
     *
     * @private
     */
    _index: number;
    /**
     * Internal bounding rectangle of the image on the page.
     *
     * @private
     */
    _bounds: Rectangle;
    /**
     * Internal flag indicating interpolation requirement.
     *
     * @private
     */
    _isImageInterpolated: boolean;
    /**
     * Internal flag indicating image mask presence.
     *
     * @private
     */
    _isImageMasked: boolean;
    /**
     * Internal flag indicating soft-mask presence.
     *
     * @private
     */
    _isSoftMasked: boolean;
    /**
     * Gets the raw image bytes of the embedded image.
     *
     * @returns {Uint8Array} The image data.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Initialize a new instance of the `PdfDataExtractor` class
     * let extractor: PdfDataExtractor = new PdfDataExtractor(document);
     * // Extract collection of `PdfEmbeddedImage` from the PDF document.
     * let imageInfoCollection: PdfEmbeddedImage[] = extractor.extractImages({ startPageIndex: 0, endPageIndex: document.pageCount - 1});
     * let imageInfo: PdfEmbeddedImage = imageInfoCollection[0];
     * // Gets the raw image bytes of the embedded image.
     * let data: Uint8Array = imageInfo.data;
     * // Destroy the documents
     * document.destroy();
     * ```
     */
    get data(): Uint8Array {
        return this._data;
    }
    /**
     * Gets the image format of the embedded image.
     *
     * @returns {ImageFormat} The image format
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Initialize a new instance of the `PdfDataExtractor` class
     * let extractor: PdfDataExtractor = new PdfDataExtractor(document);
     * // Extract collection of `PdfEmbeddedImage` from the PDF document.
     * let imageInfoCollection: PdfEmbeddedImage[] = extractor.extractImages({ startPageIndex: 0, endPageIndex: document.pageCount - 1});
     * let imageInfo: PdfEmbeddedImage = imageInfoCollection[0];
     * // Gets the image format of the embedded image.
     * let type: ImageFormat = imageInfo.type;
     * // Destroy the documents
     * document.destroy();
     * ```
     */
    get type(): ImageFormat {
        return this._type;
    }
    /**
     * Gets the XObject resource name for this image
     *
     * @returns {string} The resource name.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Initialize a new instance of the `PdfDataExtractor` class
     * let extractor: PdfDataExtractor = new PdfDataExtractor(document);
     * // Extract collection of `PdfEmbeddedImage` from the PDF document.
     * let imageInfoCollection: PdfEmbeddedImage[] = extractor.extractImages({ startPageIndex: 0, endPageIndex: document.pageCount - 1});
     * let imageInfo: PdfEmbeddedImage = imageInfoCollection[0];
     * // Gets the XObject resource name for this image
     * let name: string = imageInfo.resourceName;
     * // Destroy the documents
     * document.destroy();
     * ```
     */
    get resourceName(): string {
        return this._resourceName;
    }
    /**
     * Gets the native pixel dimensions of the image.
     *
     * @returns {Size} The width and height of the image in pixels.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Initialize a new instance of the `PdfDataExtractor` class
     * let extractor: PdfDataExtractor = new PdfDataExtractor(document);
     * // Extract collection of `PdfEmbeddedImage` from the PDF document.
     * let imageInfoCollection: PdfEmbeddedImage[] = extractor.extractImages({ startPageIndex: 0, endPageIndex: document.pageCount - 1});
     * let imageInfo: PdfEmbeddedImage = imageInfoCollection[0];
     * // Gets the image data.
     * let physicalDimension: Size = imageInfo.physicalDimension;
     * // Destroy the documents
     * document.destroy();
     * ```
     */
    get physicalDimension(): Size {
        return this._physicalDimension;
    }
    /**
     * Gets the page index of the image.
     *
     * @returns {string} The page index of the image.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Initialize a new instance of the `PdfDataExtractor` class
     * let extractor: PdfDataExtractor = new PdfDataExtractor(document);
     * // Extract collection of `PdfEmbeddedImage` from the PDF document.
     * let imageInfoCollection: PdfEmbeddedImage[] = extractor.extractImages({ startPageIndex: 0, endPageIndex: document.pageCount - 1});
     * let imageInfo: PdfEmbeddedImage = imageInfoCollection[0];
     * // Gets the page index of the image.
     * let pageIndex: number = imageInfo.pageIndex;
     * // Destroy the documents
     * document.destroy();
     * ```
     */
    get pageIndex(): number {
        return this._pageIndex;
    }
    /**
     * Gets the index of the image occurrence within PDF page.
     *
     * @returns {number} An index of the image.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Initialize a new instance of the `PdfDataExtractor` class
     * let extractor: PdfDataExtractor = new PdfDataExtractor(document);
     * // Extract collection of `PdfEmbeddedImage` from the PDF document.
     * let imageInfoCollection: PdfEmbeddedImage[] = extractor.extractImages({ startPageIndex: 0, endPageIndex: document.pageCount - 1});
     * let imageInfo: PdfEmbeddedImage = imageInfoCollection[0];
     * // Gets the index of the image occurrence within PDF page.
     * let index: number = imageInfo.index;
     * // Destroy the documents
     * document.destroy();
     * ```
     */
    get index(): number {
        return this._index;
    }
    /**
     * Gets the bounds of the image.
     *
     * @returns {Rectangle} The bounds of the image.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Initialize a new instance of the `PdfDataExtractor` class
     * let extractor: PdfDataExtractor = new PdfDataExtractor(document);
     * // Extract collection of `PdfEmbeddedImage` from the PDF document.
     * let imageInfoCollection: PdfEmbeddedImage[] = extractor.extractImages({ startPageIndex: 0, endPageIndex: document.pageCount - 1});
     * let imageInfo: PdfEmbeddedImage = imageInfoCollection[0];
     * // Gets the bounds of the image.
     * let bounds: Rectangle = imageInfo.bounds;
     * // Destroy the documents
     * document.destroy();
     * ```
     */
    get bounds(): Rectangle {
        return this._bounds;
    }
    /**
     * Gets the boolean flag indicating whether the image is interpolated or not.
     *
     * @returns {boolean} Returns true, when the image property in the PDF document is set to undergo interpolation.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Initialize a new instance of the `PdfDataExtractor` class
     * let extractor: PdfDataExtractor = new PdfDataExtractor(document);
     * // Extract collection of `PdfEmbeddedImage` from the PDF document.
     * let imageInfoCollection: PdfEmbeddedImage[] = extractor.extractImages({ startPageIndex: 0, endPageIndex: document.pageCount - 1});
     * let imageInfo: PdfEmbeddedImage = imageInfoCollection[0];
     * // Gets the boolean flag indicating whether the image is interpolated or not.
     * let isImageInterpolated: boolean = imageInfo.isImageInterpolated;
     * // Destroy the documents
     * document.destroy();
     * ```
     */
    get isImageInterpolated(): boolean {
        return this._isImageInterpolated;
    }
    /**
     * Gets the boolean flag indicating whether the image is masked or not.
     *
     * @returns {boolean} Returns true, if image masking is applied. Set to true when the image is undergone image masking.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Initialize a new instance of the `PdfDataExtractor` class
     * let extractor: PdfDataExtractor = new PdfDataExtractor(document);
     * // Extract collection of `PdfEmbeddedImage` from the PDF document.
     * let imageInfoCollection: PdfEmbeddedImage[] = extractor.extractImages({ startPageIndex: 0, endPageIndex: document.pageCount - 1});
     * let imageInfo: PdfEmbeddedImage = imageInfoCollection[0];
     * // Gets the boolean flag indicating whether the image is masked or not.
     * let IsImageMasked: boolean = imageInfo.IsImageMasked;
     * // Destroy the documents
     * document.destroy();
     * ```
     */
    get isImageMasked(): boolean {
        return this._isImageMasked;
    }
    /**
     * Gets the boolean flag indicating whether the image is masked or not.
     *
     * @returns {boolean} True if a soft mask is associated with the image; otherwise, false.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Initialize a new instance of the `PdfDataExtractor` class
     * let extractor: PdfDataExtractor = new PdfDataExtractor(document);
     * // Extract collection of `PdfEmbeddedImage` from the PDF document.
     * let imageInfoCollection: PdfEmbeddedImage[] = extractor.extractImages({ startPageIndex: 0, endPageIndex: document.pageCount - 1});
     * let imageInfo: PdfEmbeddedImage = imageInfoCollection[0];
     * // Gets the boolean flag indicating whether the image is soft masked or not.
     * let IsSoftMasked: boolean = imageInfo.IsSoftMasked;
     * // Destroy the documents
     * document.destroy();
     * ```
     */
    get isSoftMasked(): boolean {
        return this._isSoftMasked;
    }
}
