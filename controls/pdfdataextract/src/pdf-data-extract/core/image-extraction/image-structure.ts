import { _PdfBaseStream, _PdfCrossReference, _PdfDictionary, PdfPage } from '@syncfusion/ej2-pdf';
import { ImageFormat } from '../enum';
export class _ImageStructure {
    _width: number;
    _height: number;
    _mimeType: ImageFormat;
    _dictionary: _PdfDictionary;
    _crossReference: _PdfCrossReference;
    _stream: _PdfBaseStream;
    _imageFormat: ImageFormat;
    _pageIndex: number;
    _isImageMasked: boolean = false;
    _isSoftMasked: boolean = false
    _isImageMask: boolean = false;
    _isImageInterpolated: boolean = false;
    _smask: any; // eslint-disable-line
    _mask: any; // eslint-disable-line
    constructor(stream: any, crossReference: _PdfCrossReference, page: PdfPage) { // eslint-disable-line
        this._stream = stream;
        this._crossReference = crossReference;
        this._pageIndex = page._pageIndex;
        this._initialize();
    }
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
        }
        if (dictionary.has('ImageMask')) {
            this._isImageMask = dictionary.get('ImageMask');
        }
        if (dictionary.has('SMask')) {
            this._isSoftMasked = true;
            this._smask = dictionary.get('SMask');
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
