
import { _ImageDecoder } from './image-decoder';
import { _PdfStream } from './../../base-stream';
import { _PdfDictionary, _PdfName } from'./../../pdf-primitives';
import { _ImageFormat } from './../../enumerator';

export class _JpegDecoder extends _ImageDecoder {
    /**
     * Initializes a new instance of the `_JpegDecoder` class.
     *
     * @private
     * @param {Uint8Array} stream byte array.
     */
    constructor(stream: Uint8Array) {
        super();
        this._stream = stream;
        this._initialize();
    }
    get _imageDataAsNumberArray(): ArrayBuffer {
        return this._imageData;
    }
    _initialize(): void {
        this._format = _ImageFormat.jpeg;
        this._readHeader();
        this._reset();
        this._imageData = new Uint8Array(this._stream.byteLength);
        this._read(this._imageData, 0, this._imageData.byteLength);
    }
    _readHeader(): void {
        this._reset();
        const imgData: Uint8Array = new Uint8Array(this._stream.byteLength);
        this._read(imgData, 0, imgData.byteLength);
        let i: number = 4;
        let length: number = this._getBuffer(i) * 256 + this._getBuffer(i + 1);
        let isLengthExceed: boolean = false;
        while (i < imgData.byteLength) {
            i += length;
            if (i < imgData.byteLength) {
                if (this._getBuffer(i + 1) === 192) {
                    this._height = this._getBuffer(i + 5) * 256 + this._getBuffer(i + 6);
                    this._width = this._getBuffer(i + 7) * 256 + this._getBuffer(i + 8);
                    this._noOfComponents = this._getBuffer(i + 9);
                    if (this._width !== 0 && this._height !== 0) {
                        return;
                    }
                } else {
                    i += 2;
                    length = this._getBuffer(i) * 256 + this._getBuffer(i + 1);
                }
            } else {
                isLengthExceed = true;
                break;
            }
        }
        if (isLengthExceed) {
            this._reset();
            this._seek(2);
            this._readExceededJpegImage();
        }
    }
    _getImageDictionary(): _PdfStream {
        const data: any = []; // eslint-disable-line
        this._imageStream = new _PdfStream(data, new _PdfDictionary());
        this._imageStream.isImageStream = true;
        let tempString: string = '';
        let decodedString: string = '';
        for (let i: number = 0; i < this._imageDataAsNumberArray.byteLength; i++ ) {
            tempString += ' ' + String.fromCharCode(this._getBuffer(i));
        }
        for (let i: number = 0; i < tempString.length; i++) {
            if (i % 2 !== 0) {
                decodedString += tempString[Number.parseInt(i.toString(), 10)];
            }
        }
        this._imageStream.data = [decodedString];
        this._imageStream._isCompress = false;
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.set('Type', new _PdfName('XObject'));
        dictionary.set('Subtype', new _PdfName('Image'));
        dictionary.set('Width', this._width);
        dictionary.set('Height', this._height);
        dictionary.set('BitsPerComponent', this._bitsPerComponent);
        dictionary.set('Filter', new _PdfName('DCTDecode'));
        dictionary.set('ColorSpace', new _PdfName(this._getColorSpace() as string));
        dictionary.set('DecodeParms', this._getDecodeParams());
        this._imageStream.dictionary = dictionary;
        this._imageStream.bytes = new Uint8Array(this._imageStream.data[0].length);
        for (let i: number = 0; i < this._imageStream.data[0].length; i++) {
            this._imageStream.bytes[Number.parseInt(i.toString(), 10)] = this._imageStream.data[0].charCodeAt(i);
        }
        this._imageStream.end = this._imageStream.bytes.length;
        this._imageStream.dictionary._updated = true;
        return this._imageStream;
    }
    _getColorSpace(): string {
        if (this._noOfComponents === 1) {
            return 'DeviceGray';
        } else if (this._noOfComponents === 4) {
            return 'DeviceCMYK';
        }
        return 'DeviceRGB';
    }
    _getDecodeParams(): _PdfDictionary {
        const decodeParams: _PdfDictionary = new _PdfDictionary();
        decodeParams.set('Columns', this._width);
        decodeParams.set('BlackIs1', true);
        decodeParams.set('K', -1);
        decodeParams.set('Predictor', 15);
        decodeParams.set('BitsPerComponent', this._bitsPerComponent);
        return decodeParams;
    }
    _skipStream(): void {
        const length: number = this._getBuffer(this._position) << 8 | this._getBuffer(this._position + 1);
        this._seek(2);
        if (length < 2) {
            throw new Error('Error decoding JPEG image');
        } else if (length > 0) {
            this._seek(length - 2);
        }
    }
    _readExceededJpegImage(): void {
        let isContinueReading: boolean = true;
        while (isContinueReading) {
            const marker: number = this._getMarker();
            switch (marker) {
            case 0x00C0:
            case 0x00C1:
            case 0x00C2:
            case 0x00C3:
            case 0x00C5:
            case 0x00C6:
            case 0x00C7:
            case 0x00C9:
            case 0x00CA:
            case 0x00CB:
            case 0x00CD:
            case 0x00CE:
            case 0x00CF:
                this._seek(3);
                this._height = this._getBuffer(this._position) << 8 | this._getBuffer(this._position + 1);
                this._seek(2);
                this._width = this._getBuffer(this._position) << 8 | this._getBuffer(this._position + 1);
                this._seek(2);
                this._noOfComponents = this._getBuffer(this._position);
                this._seek(1);
                isContinueReading = false;
                break;
            default:
                this._skipStream();
                break;
            }
        }
    }
    _getMarker() : number {
        let skippedByte: number = 0;
        let marker: number = this._readByte();
        while (marker !== 255) {
            skippedByte++;
            marker = this._readByte();
        }
        do {
            marker = this._readByte();
        } while (marker === 255);
        if (skippedByte !== 0) {
            throw new Error('Error decoding JPEG image');
        }
        return this._toUnsigned16(marker);
    }
}
