import { _ImageDecoder } from './image-decoder';
import { _PdfStream } from './../../base-stream';
import { _PdfDictionary, _PdfName } from'./../../pdf-primitives';
import { _ImageFormat } from './../../enumerator';
import { _bytesToString, _toUnsigned, _toSigned32 } from './../../utils';
import { _DeflateStream } from './../../compression/deflate-stream';
/* eslint-disable */
export class _PngDecoder extends _ImageDecoder {
    _isRedGreenBlue: boolean;
    _shades: boolean;
    _ideateDecode: boolean;
    _colors: number;
    _bitsPerPixel: number;
    _idatLength: number;
    _inputBands: number;
    _isDecode: boolean;
    _currentChunkLength: number;
    _header: _PngHeader;
    _encodedStream: number[];
    _maskData: number[];
    _colorSpace: any[];
    _alpha: number[];
    _dataStream: number[];
    _decodedImageData: number[];
    _dataStreamOffset: number;
    /**
     * Initializes a new instance of the `_PngDecoder` class.
     *
     * @private
     * @param {Uint8Array} stream byte array.
     */
    constructor(stream: Uint8Array) {
        super();
        this._stream = stream;
        this._format = _ImageFormat.png;
        this._isRedGreenBlue = false;
        this._isDecode = false;
        this._shades = false;
        this._ideateDecode = true;
        this._colors = 0;
        this._bitsPerPixel = 0;
        this._idatLength = 0;
        this._inputBands = 0;
        this._position = 8;
        this._initialize();
    }
    _initialize(): void {
        let header: _PngChunkTypes;
        let result: {type: _PngChunkTypes, hasValidChunk: boolean} = this._hasValidChunkType(header);
        while (result.hasValidChunk) {
            header = result.type;
            switch (header) {
            case _PngChunkTypes.iHDR:
                this._readHeader();
                break;
            case _PngChunkTypes.iDAT:
                this._readImageData();
                break;
            case _PngChunkTypes.sRGB:
                this._isRedGreenBlue = true;
                this._ignoreChunk();
                break;
            case _PngChunkTypes.pLTE:
                this._readPhotoPlate();
                break;
            case _PngChunkTypes.iEND:
                this._decodeImageData();
                break;
            case _PngChunkTypes.tRNS:
                this._readTransparency();
                break;
            case _PngChunkTypes.tEXt:
            case _PngChunkTypes.iTXt:
            case _PngChunkTypes.zTXt:
            case _PngChunkTypes.hIST:
            case _PngChunkTypes.sBIT:
            case _PngChunkTypes.iCCP:
            case _PngChunkTypes.pHYs:
            case _PngChunkTypes.tIME:
            case _PngChunkTypes.bKGD:
            case _PngChunkTypes.gAMA:
            case _PngChunkTypes.cHRM:
            case _PngChunkTypes.unknown:
                this._ignoreChunk();
                break;
            default:
                break;
            }
            result = this._hasValidChunkType(header);
        }
    }
    _hasValidChunkType(type: _PngChunkTypes): {type: _PngChunkTypes, hasValidChunk: boolean} {
        type = _PngChunkTypes.unknown;
        if (this._position + 8 <= this._stream.byteLength) {
            this._currentChunkLength = this._readUnsigned32(this._position);
            this._seek(4);
            const chunk: string = this._readString(4);
            const header: _PngChunkTypes = this._getChunkType(chunk);
            if (typeof header !== 'undefined' && header !== null) {
                type = header;
                return {'type': type, 'hasValidChunk': true};
            }
            if (this._stream.byteLength === this._position) {
                return {'type': type, 'hasValidChunk': false};
            } else {
                return {'type': type, 'hasValidChunk': true};
            }
        } else {
            return {'type': type, 'hasValidChunk': false};
        }
    }
    _ignoreChunk(): void {
        if (this._currentChunkLength > 0) {
            this._seek(this._currentChunkLength + 4);
        }
    }
    _readHeader(): void {
        this._header = new _PngHeader();
        this._header._width = this._readUnsigned32(this._position);
        this._seek(4);
        this._header._height = this._readUnsigned32(this._position);
        this._seek(4);
        this._header._bitDepth = this._readByte();
        this._header._colorType = this._readByte();
        this._header._compression = this._readByte();
        this._header._filter = this._getFilterType(this._readByte());
        this._header._interlace = this._readByte();
        this._colors = (this._header._colorType === 3 || (this._header._colorType & 2) === 0) ? 1 : 3;
        this._width = this._header._width;
        this._height = this._header._height;
        this._bitsPerComponent = this._header._bitDepth;
        this._setBitsPerPixel();
        this._seek(4);
    }
    _setBitsPerPixel(): void {
        this._bitsPerPixel = this._header._bitDepth === 16 ? 2 : 1;
        if (this._header._colorType === 0) {
            this._idatLength = Number.parseInt(((this._bitsPerComponent * this._width + 7) / 8).toString(), 10) * this._height;
            this._inputBands = 1;
        } else if (this._header._colorType === 2) {
            this._idatLength = this._width * this._height * 3;
            this._inputBands = 3;
            this._bitsPerPixel *= 3;
        } else if (this._header._colorType === 3) {
            if (this._header._interlace === 1 || this._header._interlace === 0) {
                this._idatLength = Number.parseInt(((this._header._bitDepth * this._width + 7) / 8).toString(), 10) * this._height;
            }
            this._inputBands = 1;
            this._bitsPerPixel = 1;
        } else if (this._header._colorType === 4) {
            this._idatLength = this._width * this._height;
            this._inputBands = 2;
            this._bitsPerPixel *= 2;
        } else if (this._header._colorType === 6) {
            this._idatLength = this._width * 3 * this._height;
            this._inputBands = 4;
            this._bitsPerPixel *= 4;
        }
    }
    _readImageData(): void {
        if (!this._encodedStream || this._encodedStream.length === 0) {
            this._encodedStream = [];
        }
        if (this._currentChunkLength <= this._stream.byteLength && this._stream.byteLength - this._position >= this._currentChunkLength) {
            for (let i: number = 0; i < this._currentChunkLength; i++) {
                this._encodedStream.push(this._readByte());
            }
        }
        this._seek(4);
    }
    _readPhotoPlate(): void {
        if (this._header._colorType === 3) {
            this._colorSpace = [];
            this._colorSpace.push(_PdfName.get('Indexed'));
            this._colorSpace.push(this._getPngColorSpace());
            this._colorSpace.push(this._currentChunkLength / 3 - 1);
            const buffer: Uint8Array = new Uint8Array(this._currentChunkLength);
            this._read(buffer, 0, this._currentChunkLength);
            this._colorSpace.push(_bytesToString(buffer));
            this._seek(4);
        } else {
            this._ignoreChunk();
        }
    }
    _readTransparency(): void {
        if (this._header._colorType === 3) {
            const alpha: Uint8Array = new Uint8Array(this._currentChunkLength);
            this._read(alpha, 0, this._currentChunkLength);
            this._seek(4);
            this._alpha = [];
            for (let i: number = 0; i < alpha.length; i++) {
                this._alpha.push(alpha[Number.parseInt(i.toString(), 10)]);
                const sh: number = alpha[Number.parseInt(i.toString(), 10)] & 0xff;
                if (sh !== 0 && sh !== 255) {
                    this._shades = true;
                }
            }
        } else {
            this._ignoreChunk();
        }
    }
    _getPngColorSpace(): any {
        if (!this._isRedGreenBlue) {
            if ((this._header._colorType & 2) === 0) {
                return _PdfName.get('DeviceGray');
            } else {
                return _PdfName.get('DeviceRGB');
            }
        } else {
            const colorspace: any[] = [];
            const calRGB: _PdfDictionary = new _PdfDictionary();
            let whitePoint: number[] = [1, 1, 1];
            const gammaArray: number[] = [2.2, 2.2, 2.2];
            calRGB.set('Gamma', gammaArray);
            if (this._isRedGreenBlue) {
                const wpX: number = 0.3127;
                const wpY: number = 0.329;
                const redX: number = 0.64;
                const redY: number = 0.33;
                const greenX: number = 0.3;
                const greenY: number = 0.6;
                const bX: number = 0.15;
                const bY: number = 0.06;
                const t: number = wpY * ((greenX - bX) * redY - (redX - bX) * greenY + (redX - greenX) * bY);
                const alphaY: number = redY * ((greenX - bX) * wpY - (wpX - bX) * greenY + (wpX - greenX) * bY) / t;
                const alphaX: number = alphaY * redX / redY;
                const alphaZ: number = alphaY * ((1 - redX) / redY - 1);
                const blueY: number = -greenY * ((redX - bX) * wpY - (wpX - bX) * redY + (wpX - redX) * bY) / t;
                const blueX: number = blueY * greenX / greenY;
                const blueZ: number = blueY * ((1 - greenX) / greenY - 1);
                const colorY: number = bY * ((redX - greenX) * wpY - (wpX - greenX) * wpY + (wpX - redX) * greenY) / t;
                const colorX: number = colorY * bX / bY;
                const colorZ: number = colorY * ((1 - bX) / bY - 1);
                const whiteX: number = alphaX + blueX + colorX;
                const whiteY: number = 1;
                const whiteZ: number = alphaZ + blueZ + colorZ;
                whitePoint = [whiteX, whiteY, whiteZ];
                calRGB.set('Matrix', [alphaX, alphaY, alphaZ, blueX, blueY, blueZ, colorX, colorY, colorZ]);
            }
            calRGB.set('WhitePoint', whitePoint);
            colorspace.push(_PdfName.get('CalRGB'));
            colorspace.push(calRGB);
            return colorspace;
        }
    }
    _decodeImageData(): void {
        const header: _PngHeader = this._header;
        this._isDecode = (header._interlace === 1) || (header._bitDepth === 16) || ((header._colorType & 4) !== 0) || this._shades;
        if (this._isDecode) {
            if ((header._colorType & 4) !== 0 || this._shades) {
                this._maskData = Array<number>(this._width * this._height).fill(0);
            }
            if (this._encodedStream) {
                this._dataStream = this._getDeflatedData(this._encodedStream);
                this._dataStreamOffset = 0;
            }
            if (this._idatLength > 0) {
                this._decodedImageData = Array<number>(this._idatLength).fill(0);
            }
            this._readDecodeData();
            if (this._decodedImageData && this._decodedImageData.length === 0 && this._shades) {
                this._ideateDecode = false;
                this._decodedImageData = this._encodedStream;
            }
        } else {
            this._ideateDecode = false;
            this._decodedImageData = this._encodedStream;
        }
    }
    _getDeflatedData(data: number[]): number[] {
        const idatData: number[] = data.slice(2, data.length - 4);
        const deflateStream: _DeflateStream = new _DeflateStream(idatData, 0, true);
        let buffer: number[] = Array<number>(4096).fill(0);
        let numRead: number = 0;
        const outputData: number[] = [];
        do {
            const result: {count: number, data: number[]} = deflateStream._read(buffer, 0, buffer.length);
            numRead = result.count;
            buffer = result.data;
            for (let i: number = 0; i < numRead; i++) {
                outputData.push(buffer[Number.parseInt(i.toString(), 10)]);
            }
        } while (numRead > 0);
        return outputData;
    }
    _readDecodeData(): void {
        if (this._header._interlace !== 1) {
            this._decodeData(0, 0, 1, 1, this._width, this._height);
        } else {
            this._decodeData(0, 0, 8, 8, Math.floor((this._width + 7) / 8), Math.floor((this._height + 7) / 8));
            this._decodeData(4, 0, 8, 8, Math.floor((this._width + 3) / 8), Math.floor((this._height + 7) / 8));
            this._decodeData(0, 4, 4, 8, Math.floor((this._width + 3) / 4), Math.floor((this._height + 3) / 8));
            this._decodeData(2, 0, 4, 4, Math.floor((this._width + 1) / 4), Math.floor((this._height + 3) / 4));
            this._decodeData(0, 2, 2, 4, Math.floor((this._width + 1) / 2), Math.floor((this._height + 1) / 4));
            this._decodeData(1, 0, 2, 2, Math.floor(this._width / 2), Math.floor((this._height + 1) / 2));
            this._decodeData(0, 1, 1, 2, this._width, Math.floor(this._height / 2));
        }
    }
    _decodeData(xOffset: number, yOffset: number, xStep: number, yStep: number, width: number, height: number): void {
        if ((width === 0) || (height === 0)) {
            return;
        } else {
            const bytesPerRow: number = Math.floor((this._inputBands * width * this._header._bitDepth + 7) / 8);
            let current: number[] = Array<number>(bytesPerRow).fill(0);
            let prior: number[] = Array<number>(bytesPerRow).fill(0);
            for (let sourceY: number = 0, destinationY: number = yOffset; sourceY < height; sourceY++, destinationY += yStep) {
                const filter: number = this._dataStream[this._dataStreamOffset];
                this._dataStreamOffset = this._dataStreamOffset + 1;
                this._dataStreamOffset = this._readStream(this._dataStream, this._dataStreamOffset, current, bytesPerRow);
                switch (this._getFilterType(filter)) {
                case _PngFilterTypes.none:
                    break;
                case _PngFilterTypes.sub:
                    this._decompressSub(current, bytesPerRow, this._bitsPerPixel);
                    break;
                case _PngFilterTypes.up:
                    this._decompressUp(current, prior, bytesPerRow);
                    break;
                case _PngFilterTypes.average:
                    this._decompressAverage(current, prior, bytesPerRow, this._bitsPerPixel);
                    break;
                case _PngFilterTypes.paeth:
                    this._decompressPaeth(current, prior, bytesPerRow, this._bitsPerPixel);
                    break;
                default:
                    throw new Error('Unknown PNG filter');
                }
                this._processPixels(current, xOffset, xStep, destinationY, width);
                const tmp: number[] = prior;
                prior = current;
                current = tmp;
            }
        }
    }
    _readStream(stream: number[], streamOffset: number, data: number[], count: number): number {
        const result: {outputBuffer: number[], offset: number, length: number} = this._read(data, streamOffset, count, stream);
        data = result.outputBuffer;
        streamOffset = result.offset;
        const n: number = result.length;
        if (n <= 0) {
            throw new Error('Insufficient data');
        }
        return streamOffset;
    }
    _decompressSub(data: number[], count: number, bitsPerPixel: number): void {
        for (let i: number = bitsPerPixel; i < count; i++) {
            data[Number.parseInt(i.toString(), 10)] = _toUnsigned((data[Number.parseInt(i.toString(), 10)] & 0xff)
                + (data[i - bitsPerPixel] & 0xff), 8);
        }
    }
    _decompressUp(data: number[], pData: number[], count: number): void {
        for (let i: number = 0; i < count; i++) {
            data[Number.parseInt(i.toString(), 10)] = _toUnsigned((data[Number.parseInt(i.toString(), 10)] & 0xff)
                + (pData[Number.parseInt(i.toString(), 10)] & 0xff), 8);
        }
    }
    _decompressAverage(data: number[], pData: number[], count: number, bitsPerPixel: number): void {
        for (let i: number = 0; i < bitsPerPixel; i++) {
            data[Number.parseInt(i.toString(), 10)] = _toUnsigned((Math.floor(((data[Number.parseInt(i.toString(), 10)] & 0xff)
                + (pData[Number.parseInt(i.toString(), 10)] & 0xff)) / 2)), 8);
        }
        for (let i: number = bitsPerPixel; i < count; i++) {
            data[Number.parseInt(i.toString(), 10)] = _toUnsigned(Math.floor((data[Number.parseInt(i.toString(), 10)] & 0xff)
                + ((data[i - bitsPerPixel] & 0xff) + (pData[Number.parseInt(i.toString(), 10)] & 0xff)) / 2), 8);
        }
    }
    _decompressPaeth(data: number[], pData: number[], count: number, bitsPerPixel: number): void {
        let val: number;
        let pp: number;
        let pr: number;
        let prp: number;
        for (let i: number = 0; i < bitsPerPixel; i++) {
            val = data[Number.parseInt(i.toString(), 10)] & 0xff;
            pr = pData[Number.parseInt(i.toString(), 10)] & 0xff;
            data[Number.parseInt(i.toString(), 10)] = _toUnsigned(val + pr, 8);
        }
        for (let i: number = bitsPerPixel; i < count; i++) {
            val = data[Number.parseInt(i.toString(), 10)] & 0xff;
            pp = data[i - bitsPerPixel] & 0xff;
            pr = pData[Number.parseInt(i.toString(), 10)] & 0xff;
            prp = pData[i - bitsPerPixel] & 0xff;
            data[Number.parseInt(i.toString(), 10)] = _toUnsigned((val + this._paethPredictor(pp, pr, prp)), 8);
        }
    }
    _paethPredictor(a: number, b: number, c: number): number {
        const p: number = a + b - c;
        const pa: number = Math.abs(p - a);
        const pb: number = Math.abs(p - b);
        const pc: number = Math.abs(p - c);
        if ((pa <= pb) && (pa <= pc)) {
            return a;
        } else if (pb <= pc) {
            return b;
        } else {
            return c;
        }
    }
    _processPixels(data: number[], x: number, step: number, y: number, width: number): void {
        let sourceX: number = 0;
        let destX: number = 0;
        let size: number = 0;
        const pixel: number[] = this._getPixel(data);
        if (this._header._colorType === 0 || this._header._colorType === 3 || this._header._colorType === 4) {
            size = 1;
        } else if (this._header._colorType === 2 || this._header._colorType === 6) {
            size = 3;
        }
        if (this._decodedImageData && this._decodedImageData.length > 0) {
            destX = x;
            const depth: number = (this._header._bitDepth === 16) ? 8 : this._header._bitDepth;
            const yStep: number = Math.floor((size * width * depth + 7) / 8);
            for (sourceX = 0; sourceX < width; sourceX++) {
                this._decodedImageData = this._setPixel(this._decodedImageData,
                                                        pixel,
                                                        this._inputBands * sourceX,
                                                        size,
                                                        destX,
                                                        y,
                                                        this._header._bitDepth,
                                                        yStep);
                destX += step;
            }
        }
        const shades: boolean = (this._header._colorType & 4) !== 0 || this._shades;
        if (shades) {
            if ((this._header._colorType & 4) !== 0) {
                if (this._header._bitDepth === 16) {
                    for (let i: number = 0; i < width; ++i) {
                        const temp: number = i * this._inputBands + size;
                        const unsigned: number = _toUnsigned(pixel[Number.parseInt(temp.toString(), 10)], 32);
                        pixel[Number.parseInt(temp.toString(), 10)] = _toSigned32(unsigned >> 8);
                    }
                }
                const yStep: number = width;
                destX = x;
                for (sourceX = 0; sourceX < width; sourceX++) {
                    this._maskData = this._setPixel(this._maskData, pixel, this._inputBands * sourceX + size, 1, destX, y, 8, yStep);
                    destX += step;
                }
            } else {
                const yStep: number = width;
                const dt: number[] = [0];
                destX = x;
                for (sourceX = 0; sourceX < width; sourceX++) {
                    const index: number = pixel[Number.parseInt(sourceX.toString(), 10)];
                    if (index < this._alpha.length) {
                        dt[0] = this._alpha[Number.parseInt(index.toString(), 10)];
                    } else {
                        dt[0] = 255;
                    }
                    this._maskData = this._setPixel(this._maskData, dt, 0, 1, destX, y, 8, yStep);
                    destX += step;
                }
            }
        }
    }
    _getPixel(data: number[]): number[] {
        if (this._header._bitDepth === 8) {
            const pixel: number[] = Array<number>(data.length).fill(0);
            for (let i: number = 0; i < pixel.length; ++i) {
                pixel[Number.parseInt(i.toString(), 10)] = data[Number.parseInt(i.toString(), 10)] & 0xff;
            }
            return pixel;
        } else if (this._header._bitDepth === 16) {
            const pixel: number[] = Array<number>(Math.floor(data.length / 2)).fill(0);
            for (let i: number = 0; i < pixel.length; ++i) {
                pixel[Number.parseInt(i.toString(), 10)] = ((data[i * 2] & 0xff) << 8) + (data[i * 2 + 1] & 0xff);
            }
            return pixel;
        } else {
            const pixel: number[] = Array<number>(Math.floor((data.length * 8) / this._header._bitDepth)).fill(0);
            let index: number = 0;
            const p: number = Math.floor(8 / this._header._bitDepth);
            const mask: number = (1 << this._header._bitDepth) - 1;
            for (let n: number = 0; n < data.length; ++n) {
                for (let i: number = p - 1; i >= 0; --i) {
                    const hb: number = this._header._bitDepth * i;
                    const d: number = data[Number.parseInt(n.toString(), 10)];
                    pixel[index++] = ((hb < 1) ? d : _toSigned32(_toUnsigned(d, 32) >> hb)) & mask;
                }
            }
            return pixel;
        }
    }
    _setPixel(imageData: number[],
              data: number[],
              offset: number,
              size: number,
              x: number,
              y: number,
              bitDepth: number,
              bpr: number): number[] {
        if (bitDepth === 8) {
            const position: number = bpr * y + size * x;
            for (let i: number = 0; i < size; ++i) {
                imageData[position + i] = _toUnsigned(data[i + offset], 8);
            }
        } else if (bitDepth === 16) {
            const position: number = bpr * y + size * x;
            for (let i: number = 0; i < size; ++i) {
                imageData[position + i] = _toUnsigned((data[i + offset] >> 8), 8);
            }
        } else {
            const position: number = Math.floor((bpr * y + x) / (8 / bitDepth));
            const t: number = data[Number.parseInt(offset.toString(), 10)]
                << Number.parseInt((8 - bitDepth * (x % (8 / bitDepth)) - bitDepth).toString(), 10);
            imageData[Number.parseInt(position.toString(), 10)] = imageData[Number.parseInt(position.toString(), 10)] | _toUnsigned(t, 8);
        }
        return imageData;
    }
    _getImageDictionary(): _PdfStream {
        const data: any = [];
        this._imageStream = new _PdfStream(data, new _PdfDictionary());
        this._imageStream.isImageStream = true;
        let decodedString: string = '';
        for (let i: number = 0; i < this._decodedImageData.length; i++ ) {
            decodedString += String.fromCharCode(this._decodedImageData[Number.parseInt(i.toString(), 10)]);
        }
        this._imageStream.data = [decodedString];
        this._imageStream._isCompress = this._isDecode && this._ideateDecode;
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.set('Type', new _PdfName('XObject'));
        dictionary.set('Subtype', new _PdfName('Image'));
        dictionary.set('Width', this._width);
        dictionary.set('Height', this._height);
        if (this._bitsPerComponent === 16) {
            dictionary.set('BitsPerComponent', 8);
        } else {
            dictionary.set('BitsPerComponent', this._bitsPerComponent);
        }
        if (!this._isDecode || !this._ideateDecode) {
            dictionary.set('Filter', new _PdfName('FlateDecode'));
        }
        if ((this._header._colorType & 2) === 0) {
            dictionary.set('ColorSpace', _PdfName.get('DeviceGray'));
        } else {
            dictionary.set('ColorSpace', _PdfName.get('DeviceRGB'));
        }
        if (!this._isDecode || this._shades && !this._ideateDecode) {
            dictionary.set('DecodeParms', this._getDecodeParams());
        }
        this._imageStream.dictionary = dictionary;
        this._imageStream.bytes = new Uint8Array(this._imageStream.data[0].length);
        for (let i: number = 0; i < this._imageStream.data[0].length; i++) {
            this._imageStream.bytes[Number.parseInt(i.toString(), 10)] = this._imageStream.data[0].charCodeAt(i);
        }
        this._imageStream.end = this._imageStream.bytes.length;
        this._imageStream.dictionary._updated = true;
        this._setMask();
        return this._imageStream;
    }
    _setMask(): void {
        if (this._maskData && this._maskData.length > 0) {
            this._maskStream = new _PdfStream(this._maskData, new _PdfDictionary());
            this._maskStream._isCompress = this._isDecode && this._ideateDecode;
            const dictionary: _PdfDictionary = new _PdfDictionary();
            dictionary.set('Type', new _PdfName('XObject'));
            dictionary.set('Subtype', new _PdfName('Image'));
            dictionary.set('Width', this._width);
            dictionary.set('Height', this._height);
            if (this._bitsPerComponent === 16) {
                dictionary.set('BitsPerComponent', 8);
            } else {
                dictionary.set('BitsPerComponent', this._bitsPerComponent);
            }
            dictionary.set('ColorSpace', _PdfName.get('DeviceGray'));
            this._maskStream.dictionary = dictionary;
            this._maskStream.bytes = new Uint8Array(this._maskData);
            this._maskStream.end = this._maskStream.bytes.length;
            this._maskStream.dictionary._updated = true;
        }
    }
    _getDecodeParams(): _PdfDictionary {
        const decodeParams: _PdfDictionary = new _PdfDictionary();
        decodeParams.set('Columns', this._width);
        decodeParams.set('Colors', this._colors);
        decodeParams.set('Predictor', 15);
        decodeParams.set('BitsPerComponent', this._bitsPerComponent);
        return decodeParams;
    }
    _getChunkType(chunk: string): _PngChunkTypes {
        switch (chunk) {
        case 'IHDR':
            return _PngChunkTypes.iHDR;
        case 'PLTE':
            return _PngChunkTypes.pLTE;
        case 'IDAT':
            return _PngChunkTypes.iDAT;
        case 'IEND':
            return _PngChunkTypes.iEND;
        case 'bKGD':
            return _PngChunkTypes.bKGD;
        case 'cHRM':
            return _PngChunkTypes.cHRM;
        case 'gAMA':
            return _PngChunkTypes.gAMA;
        case 'hIST':
            return _PngChunkTypes.hIST;
        case 'pHYs':
            return _PngChunkTypes.pHYs;
        case 'sBIT':
            return _PngChunkTypes.sBIT;
        case 'tEXt':
            return _PngChunkTypes.tEXt;
        case 'tIME':
            return _PngChunkTypes.tIME;
        case 'tRNS':
            return _PngChunkTypes.tRNS;
        case 'zTXt':
            return _PngChunkTypes.zTXt;
        case 'sRGB':
            return _PngChunkTypes.sRGB;
        case 'iCCP':
            return _PngChunkTypes.iCCP;
        case 'iTXt':
            return _PngChunkTypes.iTXt;
        case 'Unknown':
            return _PngChunkTypes.unknown;
        default:
            return null;
        }
    }
    _getFilterType(type: number): _PngFilterTypes {
        switch (type) {
        case 1:
            return _PngFilterTypes.sub;
        case 2:
            return _PngFilterTypes.up;
        case 3:
            return _PngFilterTypes.average;
        case 4:
            return _PngFilterTypes.paeth;
        default:
            return _PngFilterTypes.none;
        }
    }
}
class _PngHeader {
    constructor() {
        this._width = 0;
        this._height = 0;
        this._colorType = 0;
        this._compression = 0;
        this._bitDepth = 0;
        this._interlace = 0;
        this._filter = _PngFilterTypes.none;
    }
    _width: number;
    _height: number;
    _colorType: number;
    _compression: number;
    _bitDepth: number;
    _filter: _PngFilterTypes;
    _interlace: number;
}
enum _PngChunkTypes {
    iHDR,
    pLTE,
    iDAT,
    iEND,
    bKGD,
    cHRM,
    gAMA,
    hIST,
    pHYs,
    sBIT,
    tEXt,
    tIME,
    tRNS,
    zTXt,
    sRGB,
    iCCP,
    iTXt,
    unknown
}
enum _PngFilterTypes { none, sub, up, average, paeth }
