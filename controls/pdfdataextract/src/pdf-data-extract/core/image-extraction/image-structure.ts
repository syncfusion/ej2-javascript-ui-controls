import { _PdfBaseStream, _PdfCrossReference, _PdfDictionary, _PdfReference, PdfPage } from '@syncfusion/ej2-pdf';
import { ImageFormat } from '../enum';
/**
 * Holds parsed image stream metadata and references required for extraction/rendering.
 *
 * @private
 */
export class _ImageStructure {
    /**
     * Image pixel width read from the image dictionary.
     *
     * @private
     */
    _width: number;
    /**
     * Image pixel height read from the image dictionary.
     *
     * @private
     */
    _height: number;
    /**
     * Effective output image MIMEor format decision.
     *
     * @private
     */
    _mimeType: ImageFormat;
    /**
     * The image's owning stream dictionary.
     *
     * @private
     */
    _dictionary: _PdfDictionary;
    /**
     * Cross-reference used to resolve indirect objects for this image.
     *
     * @private
     */
    _crossReference: _PdfCrossReference;
    /**
     * Underlying image stream object.
     *
     * @private
     */
    _stream: _PdfBaseStream;
    /**
     * Resolved output image format chosen based on mask/interpolate flags.
     *
     * @private
     */
    _imageFormat: ImageFormat;
    /**
     * Zero-based index of the page that contains this image.
     *
     * @private
     */
    _pageIndex: number;
    /**
     * Indicates whether the image has a hard mask entry.
     *
     * @private
     */
    _isImageMasked: boolean = false;
    /**
     * Indicates whether the image has a soft mask entry.
     *
     * @private
     */
    _isSoftMasked: boolean = false;
    /**
     * Indicates whether this image is an image mask .
     *
     * @private
     */
    _isImageMask: boolean = false;
    /**
     * Indicates whether interpolation is requested for this image.
     *
     * @private
     */
    _isImageInterpolated: boolean = false;
    /**
     * Resolved soft mask object/value from the image dictionary (if any).
     *
     * @private
     */
    _smask: any; // eslint-disable-line
    /**
     * Resolved hard mask object/value from the image dictionary (if any).
     *
     * @private
     */
    _mask: any; // eslint-disable-line
    /**
     * Indirect reference to the image stream.
     *
     * @private
     */
    _imageReference: _PdfReference;
    /**
     * Indirect reference to the soft mask.
     *
     * @private
     */
    _smaskReference: _PdfReference;
    /**
     * Indirect reference to the hard mask.
     *
     * @private
     */
    _maskReference: _PdfReference;
    constructor(stream: any, crossReference: _PdfCrossReference, page: PdfPage) { // eslint-disable-line
        this._stream = stream;
        this._crossReference = crossReference;
        this._pageIndex = page._pageIndex;
        this._initialize();
    }
    /**
     * Parses the image dictionary to populate size, mask flags, and output format.
     *
     * @private
     * @returns {void} nothing.
     */
    _initialize(): void {
        const dictionary: _PdfDictionary = this._stream.dictionary;
        if (dictionary.has('Width')) {
            this._width = dictionary.get('Width');
        }
        if (dictionary.has('Height')) {
            this._height = dictionary.get('Height');
        }
        if (dictionary.has('Mask')) {
            this._isImageMasked = true;
            this._smask = dictionary.get('Mask');
            this._maskReference = dictionary.getRaw('Mask');
        }
        if (dictionary.has('ImageMask')) {
            this._isImageMask = dictionary.get('ImageMask');
        }
        if (dictionary.has('SMask')) {
            this._isSoftMasked = true;
            this._smask = dictionary.get('SMask');
            this._smaskReference = dictionary.getRaw('SMask');
        }
        if (dictionary.has('isImageInterpolate')) {
            this._isImageInterpolated = true;
        }
        if (this._isImageMasked || this._isSoftMasked || this._isImageMask) {
            this._imageFormat = ImageFormat.png;
        } else {
            this._imageFormat = ImageFormat.jpeg;
        }
    }
}
