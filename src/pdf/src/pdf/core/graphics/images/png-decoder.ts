import { _ImageDecoder } from './image-decoder';
import { _PdfStream } from './../../base-stream';
import { _PdfDictionary, _PdfName } from'./../../pdf-primitives';
import { _ImageFormat } from './../../enumerator';
import { _bytesToString } from './../../utils';
import { _DeflateStream } from './../../compression/deflate-stream';
/* eslint-disable */
/**
 * PNG image decoder that parses PNG chunks, inflates compressed data,
 * applies PNG scanline filters None/Sub/Up/Average/Paeth, reconstructs
 * pixels (including alpha/mask when present), and exposes a PDF image stream.
 *
 * @private
 */
export class _PngDecoder extends _ImageDecoder {
    /**
     * Indicates whether the PNG uses an RGB color model.
     *
     * @private
     */
    _isRedGreenBlue: boolean;
    /**
     * Indicates whether grayscale shades are used.
     *
     * @private
     */
    _shades: boolean;
    /**
     * Internal flag controlling IDAT/deflate decode sequence.
     *
     * @private
     */
    _ideateDecode: boolean;
    /**
     * Number of color components present in the PNG.
     *
     * @private
     */
    _colors: number;
    /**
     * Bits per pixel after expansion according to color type and depth.
     *
     * @private
     */
    _bitsPerPixel: number;
    /**
     * Total concatenated length of all IDAT chunks.
     *
     * @private
     */
    _idatLength: number;
    /**
     * Number of input bands processed per scanline.
     *
     * @private
     */
    _inputBands: number;
    /**
     * Indicates whether the image data has been decoded.
     *
     * @private
     */
    _isDecode: boolean;
    /**
     * Length of the currently parsed PNG chunk.
     *
     * @private
     */
    _currentChunkLength: number;
    /**
     * Parsed IHDR and related header information.
     *
     * @private
     */
    _header: _PngHeader;
    /**
     * Accumulated compressed bytes extracted from IDAT chunks.
     *
     * @private
     */
    _encodedStream: Uint8Array;
    /**
     * Logical length of encoded stream (since we pre-allocate).
     *
     * @private
     */
    _encodedStreamLength: number;
    /**
     * Extracted mask channel data if available.
     *
     * @private
     */
    _maskData: Uint8Array;
    /**
     * Color space parameters resolved for this PNG image.
     *
     * @private
     */
    _colorSpace: any[];
    /**
     * Raw alpha channel bytes extracted from the PNG.
     *
     * @private
     */
    _alpha: Uint8Array;
    /**
     * Working buffer containing filtered/unfiltered scanline data.
     *
     * @private
     */
    _dataStream: Uint8Array;
    /**
     * Output buffer holding fully decoded pixel values.
     *
     * @private
     */
    _decodedImageData: Uint8Array;
    /**
     * Current read offset into the data stream buffer.
     *
     * @private
     */
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
    /**
     * Iterates through the PNG stream, reading chunk headers and dispatching
     * handlers (IHDR, IDAT, PLTE, tRNS, etc.) until end of image or stream end.
     *
     * @private
     * @returns {void}
     */
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
    /**
     * Reads the next chunk length and type, mapping it to an internal chunk enum.
     *
     * @private
     * @param {_PngChunkTypes} type Placeholder for the detected chunk type (ignored input).
     * @returns {{type: _PngChunkTypes, hasValidChunk: boolean}} The detected type and whether a valid chunk is available.
     */
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
    /**
     * Skips over the current chunk payload and CRC.
     *
     * @private
     * @returns {void}
     */
    _ignoreChunk(): void {
        if (this._currentChunkLength > 0) {
            this._seek(this._currentChunkLength + 4);
        }
    }
    /**
     * Parses the IHDR chunk and initializes decoder fields such as dimensions,
     * bit depth, color type, interlace, and derived attributes.
     *
     * @private
     * @returns {void}
     */
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
    /**
     * Computes input bands, IDAT storage length hints, and effective bytes-per-pixel
     * based on color type and bit depth.
     *
     * @private
     * @returns {void}
     */
    _setBitsPerPixel(): void {
        this._bitsPerPixel = this._header._bitDepth === 16 ? 2 : 1;
        if (this._header._colorType === 0) {
            this._idatLength = Math.floor((this._bitsPerComponent * this._width + 7) / 8) * this._height;
            this._inputBands = 1;
        } else if (this._header._colorType === 2) {
            this._idatLength = this._width * this._height * 3;
            this._inputBands = 3;
            this._bitsPerPixel *= 3;
        } else if (this._header._colorType === 3) {
            if (this._header._interlace === 1 || this._header._interlace === 0) {
                this._idatLength = Math.floor((this._header._bitDepth * this._width + 7) / 8) * this._height;
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
    /**
     * Appends the current IDAT chunk payload to the internal compressed buffer
     * and advances the stream position past CRC.
     *
     * @private
     * @returns {void}
     */
    _readImageData(): void {
        if (!this._encodedStream) {
            const estimatedSize: number = Math.max(this._currentChunkLength * 2, 1024);
            this._encodedStream = new Uint8Array(estimatedSize);
            this._encodedStreamLength = 0;
        }
        if (this._currentChunkLength <= this._stream.byteLength &&
            this._stream.byteLength - this._position >= this._currentChunkLength) {
            const currentLength: number = this._encodedStreamLength;
            const newLength: number = currentLength + this._currentChunkLength;
            if (this._encodedStream.length < newLength) {
                const currentCapacity: number = this._encodedStream.length;
                const doubleCapacity: number = currentCapacity * 2;
                const capacity: number = Math.max(newLength, doubleCapacity);
                const newArray: Uint8Array = new Uint8Array(capacity);
                newArray.set(this._encodedStream.subarray(0, currentLength));
                this._encodedStream = newArray;
            }
            this._encodedStream.set(
                this._stream.subarray(this._position, this._position + this._currentChunkLength),
                currentLength
            );
            this._encodedStreamLength = newLength;
            this._position += this._currentChunkLength;
        }
        this._seek(4);
    }
    /**
     * Reads the PLTE palette for indexed color images and prepares the
     * Indexed color space structure in PDF terms.
     *
     * @private
     * @returns {void}
     */
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
    /**
     * Reads the tRNS transparency table  and caches the
     * alpha bytes while detecting partial  transparency.
     *
     * @private
     * @returns {void}
     */
    _readTransparency(): void {
        if (this._header._colorType === 3) {
            const alpha: Uint8Array = new Uint8Array(this._currentChunkLength);
            this._read(alpha, 0, this._currentChunkLength);
            this._seek(4);
            const alphaLength: number = alpha.length;
            this._alpha = new Uint8Array(alphaLength);
            let hasShades = false;
            for (let i: number = 0; i < alphaLength; i++) {
                const alphaByte: number = alpha[<number>i] & 0xff;
                this._alpha[<number>i] = alphaByte;
                if (!hasShades && alphaByte !== 0 && alphaByte !== 255) {
                    hasShades = true;
                }
            }
            this._shades = hasShades;
        } else {
            this._ignoreChunk();
        }
    }
    /**
     * Resolves the effective PDF color space for the image. Returns either
     * `DeviceGray`/`DeviceRGB` or a calibrated `CalRGB` array when sRGB is present.
     *
     * @private
     * @returns {any} A color space name object or an array describing a calibrated RGB space.
     */
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
    /**
     * Determines whether raw decode is required interlaced, 16-bit, or with alpha/shades.
     * If so, inflates IDAT data, allocates buffers, and reconstructs pixels; otherwise
     * reuses the encoded stream directly.
     *
     * @private
     * @returns {void}
     */
    _decodeImageData(): void {
        const header: _PngHeader = this._header;
        this._isDecode = (header._interlace === 1) || (header._bitDepth === 16) || ((header._colorType & 4) !== 0) || this._shades;
        if (this._isDecode) {
            if ((header._colorType & 4) !== 0 || this._shades) {
                this._maskData = new Uint8Array(this._width * this._height);
            }
            if (this._encodedStream) {
                this._dataStream = this._getDeflatedData(this._encodedStream.subarray(0, this._encodedStreamLength));
                this._dataStreamOffset = 0;
            }
            if (this._idatLength > 0) {
                this._decodedImageData = new Uint8Array(this._idatLength);
            }
            this._readDecodeData();
            if (this._decodedImageData && this._decodedImageData.length === 0 && this._shades) {
                this._ideateDecode = false;
                this._decodedImageData = this._encodedStream.subarray(0, this._encodedStreamLength);
            }
        } else {
            this._ideateDecode = false;
            this._decodedImageData = this._encodedStream.subarray(0, this._encodedStreamLength);
        }
    }
    /**
     * Inflates the zlib-compressed IDAT payload omitting zlib header and Adler-32 trailer
     * into a raw byte array.
     *
     * @private
     * @param {Uint8Array} data The zlib-wrapped IDAT bytes (concatenated).
     * @returns {Uint8Array} The inflated byte array.
     */
    _getDeflatedData(data: Uint8Array): Uint8Array {
        const idatData: Uint8Array = data.subarray(2, data.length - 4);
        const deflateStream: _DeflateStream = new _DeflateStream(Array.from(idatData), 0, true);
        const chunkSize: number = 4096;
        const outputChunks: Uint8Array[] = [];
        let totalLength: number = 0;
        while (true) {
            const tempBuffer: number[] = new Array(chunkSize);
            const result: { count: number, data: number[] } = deflateStream._read(tempBuffer, 0, chunkSize);
            const count: number = result.count;
            const resultData: number[] = result.data;
            if (count <= 0) {
                break;
            }
            const chunk: Uint8Array = new Uint8Array(count);
            for (let i: number = 0; i < count; i++) {
                chunk[<number>i] = resultData[<number>i];
            }
            outputChunks.push(chunk);
            totalLength += count;
        }
        const outputData: Uint8Array = new Uint8Array(totalLength);
        let offset: number = 0;
        for (const chunk of outputChunks) {
            outputData.set(chunk, offset);
            offset += chunk.length;
        }
        return outputData;
    }
    /**
     * Dispatches pixel reconstruction by interlace method: a single pass for
     * non-interlaced images or seven Adam7 passes for interlaced images.
     *
     * @private
     * @returns {void}
     */
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
    /**
     * Reconstructs scanlines for a pass/region by reading filter type, applying the
     * corresponding PNG filter, and writing pixels (and alpha/mask) to output buffers.
     *
     * @private
     * @param {number} xOffset Starting x offset in destination image for this pass.
     * @param {number} yOffset Starting y offset in destination image for this pass.
     * @param {number} xStep X stride (per Adam7 pass or 1 for non-interlaced).
     * @param {number} yStep Y stride (per Adam7 pass or 1 for non-interlaced).
     * @param {number} width Width of this pass/region in pixels.
     * @param {number} height Height of this pass/region in pixels.
     * @returns {void}
     */
    _decodeData(xOffset: number, yOffset: number, xStep: number, yStep: number, width: number, height: number): void {
        if (width === 0 || height === 0) {
            return;
        }
        const bytesPerRow: number = Math.floor((this._inputBands * width * this._header._bitDepth + 7) / 8);
        let current: Uint8Array = new Uint8Array(bytesPerRow);
        let prior: Uint8Array = new Uint8Array(bytesPerRow);
        for (let sourceY: number = 0, destinationY: number = yOffset; sourceY < height; sourceY++, destinationY += yStep) {
            const filter = this._dataStream[this._dataStreamOffset++];
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
            [prior, current] = [current, prior];
        }
    }
    /**
     * Reads `count` bytes from a numeric array stream into `data` using the common
     * `_read` routine, returning the updated stream offset.
     *
     * @private
     * @param {Uint8Array} stream The source byte array.
     * @param {number} streamOffset The current read offset in the stream.
     * @param {Uint8Array} data The destination buffer to fill.
     * @param {number} count The number of bytes to read.
     * @returns {number} The new stream offset after reading.
     * @throws {Error} If insufficient data is available.
     */
    _readStream(stream: Uint8Array, streamOffset: number, data: Uint8Array, count: number): number {
        if (streamOffset + count > stream.length) {
            throw new Error('Insufficient data');
        }
        data.set(stream.subarray(streamOffset, streamOffset + count));
        return streamOffset + count;
    }
    /**
     * Applies the PNG Sub filter (type 1) in-place to the current scanline.
     *
     * @private
     * @param {Uint8Array} data The scanline bytes to modify.
     * @param {number} count Number of bytes in the scanline row.
     * @param {number} bitsPerPixel Bytes-per-pixel (not bit-depth) for subtraction reference.
     * @returns {void}
     */
    _decompressSub(data: Uint8Array, count: number, bitsPerPixel: number): void {
        for (let i: number = bitsPerPixel; i < count; i++) {
            data[<number>i] = (data[<number>i] + data[i - bitsPerPixel]) & 0xff;
        }
    }
    /**
     * Applies the PNG Up filter (type 2) in-place using the prior scanline.
     *
     * @private
     * @param {Uint8Array} data The current scanline bytes.
     * @param {Uint8Array} pData The prior scanline bytes.
     * @param {number} count Number of bytes per row.
     * @returns {void}
     */
    _decompressUp(data: Uint8Array, pData: Uint8Array, count: number): void {
        for (let i: number = 0; i < count; i++) {
            data[<number>i] = (data[<number>i] + pData[<number>i]) & 0xff;
        }
    }
    /**
     * Applies the PNG Average filter (type 3) in-place using left and prior values.
     *
     * @private
     * @param {Uint8Array} data The current scanline bytes.
     * @param {Uint8Array} pData The prior scanline bytes.
     * @param {number} count Number of bytes per row.
     * @param {number} bitsPerPixel Bytes-per-pixel (not bit-depth) for left reference.
     * @returns {void}
     */
    _decompressAverage(data: Uint8Array, pData: Uint8Array, count: number, bitsPerPixel: number): void {
        for (let i: number = 0; i < bitsPerPixel; i++) {
            data[<number>i] = (data[<number>i] + (pData[<number>i] >> 1)) & 0xff;
        }
        for (let i: number = bitsPerPixel; i < count; i++) {
            data[<number>i] = (data[<number>i] + ((data[i - bitsPerPixel] + pData[<number>i]) >> 1)) & 0xff;
        }
    }
    /**
     * Applies the PNG Paeth filter (type 4) in-place using left, up, and up-left predictors.
     *
     * @private
     * @param {Uint8Array} data The current scanline bytes.
     * @param {Uint8Array} pData The prior scanline bytes.
     * @param {number} count Number of bytes per row.
     * @param {number} bitsPerPixel Bytes-per-pixel (not bit-depth) for left reference.
     * @returns {void}
     */
    _decompressPaeth(data: Uint8Array, pData: Uint8Array, count: number, bitsPerPixel: number): void {
        for (let i: number = 0; i < bitsPerPixel; i++) {
            data[<number>i] = (data[<number>i] + pData[<number>i]) & 0xff;
        }
        for (let i: number = bitsPerPixel; i < count; i++) {
            data[<number>i] = (data[<number>i] + this._paethPredictor(data[i - bitsPerPixel], pData[<number>i], pData[i - bitsPerPixel])) & 0xff;
        }
    }
    /**
     * Computes the Paeth predictor from left (`a`), up (`b`), and up-left (`c`) neighbors.
     *
     * @private
     * @param {number} a The left pixel sample.
     * @param {number} b The above pixel sample.
     * @param {number} c The upper-left pixel sample.
     * @returns {number} The chosen predictor value.
     */
    _paethPredictor(a: number, b: number, c: number): number {
        const p: number = a + b - c;
        const pa: number = Math.abs(p - a);
        const pb: number = Math.abs(p - b);
        const pc: number = Math.abs(p - c);
        return (pa <= pb && pa <= pc) ? a : (pb <= pc) ? b : c;
    }
    /**
     * Converts a filtered scanline row to pixel values and writes them into the
     * decoded image buffer, also writing an 8-bit mask row when alpha/shades are present.
     *
     * @private
     * @param {Uint8Array} data The unfiltered scanline bytes for this pass.
     * @param {number} x Destination x start (accounting for pass offset).
     * @param {number} step Destination x increment (per Adam7 pass or 1).
     * @param {number} y Destination y coordinate.
     * @param {number} width The number of pixels to process from this row.
     * @returns {void}
     */
    _processPixels(data: Uint8Array, x: number, step: number, y: number, width: number): void {
        let sourceX: number = 0;
        let destX: number = 0;
        let size: number = 0;
        const pixel: Uint8Array | Uint16Array = this._getPixel(data);
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
                this._setPixel(this._decodedImageData, pixel, this._inputBands * sourceX, size, destX, y, this._header._bitDepth, yStep);
                destX += step;
            }
        }
        const shades: boolean = (this._header._colorType & 4) !== 0 || this._shades;
        if (shades) {
            if ((this._header._colorType & 4) !== 0) {
                if (this._header._bitDepth === 16) {
                    const typedPixel: Uint16Array = pixel as Uint16Array;
                    for (let i: number = 0; i < width; ++i) {
                        const temp: number = i * this._inputBands + size;
                        typedPixel[temp] = typedPixel[temp] >> 8;
                    }
                }
                const yStep: number = width;
                destX = x;
                for (sourceX = 0; sourceX < width; sourceX++) {
                    this._setPixel(this._maskData, pixel, this._inputBands * sourceX + size, 1, destX, y, 8, yStep);
                    destX += step;
                }
            } else {
                const yStep: number = width;
                const dt: Uint8Array = new Uint8Array(1);
                destX = x;
                for (sourceX = 0; sourceX < width; sourceX++) {
                    const index: number = pixel[sourceX];
                    dt[0] = index < this._alpha.length ? this._alpha[index] : 255;
                    this._setPixel(this._maskData, dt, 0, 1, destX, y, 8, yStep);
                    destX += step;
                }
            }
        }
    }
    /**
     * Expands a scanline's filtered bytes into sample values based on bit depth:
     * 8-bit (1:1), 16-bit (merge pairs), or packed sub-byte samples.
     *
     * @private
     * @param {Uint8Array} data The scanline bytes.
     * @returns {Uint8Array | Uint16Array} The expanded per-sample values for the row.
     */
    _getPixel(data: Uint8Array): Uint8Array | Uint16Array {
        const bitDepth: number = this._header._bitDepth;
        if (bitDepth === 8) {
            return data;
        } else if (bitDepth === 16) {
            const pixelLength: number = Math.floor(data.length / 2);
            const pixel: Uint16Array = new Uint16Array(pixelLength);
            for (let i: number = 0; i < pixelLength; i++) {
                pixel[<number>i] = (data[i * 2] << 8) | data[i * 2 + 1];
            }
            return pixel;
        } else {
            const pixelLength: number = Math.floor((data.length * 8) / bitDepth);
            const pixel: Uint8Array = new Uint8Array(pixelLength);
            let index: number = 0;
            const p: number = Math.floor(8 / bitDepth);
            const mask: number = (1 << bitDepth) - 1;
            for (let n: number = 0; n < data.length; n++) {
                const d: number = data[n];
                for (let i: number = p - 1; i >= 0; i--) {
                    pixel[index++] = (d >> (bitDepth * i)) & mask;
                }
            }
            return pixel;
        }
    }
    /**
     * Writes one pixel or scalar sample to the destination buffer, handling
     * 8/16-bit storage or sub-byte packing as required.
     *
     * @private
     * @param {Uint8Array} imageData The destination buffer (image or mask).
     * @param {Uint8Array | Uint16Array} data The source per-sample array.
     * @param {number} offset Offset into source sample array.
     * @param {number} size Number of samples to write (1=gray/alpha, 3=RGB).
     * @param {number} x Destination x coordinate.
     * @param {number} y Destination y coordinate.
     * @param {number} bitDepth Source bit depth (8/16 or packed).
     * @param {number} bpr Bytes-per-row in the destination buffer.
     * @returns {void}
     */
    _setPixel(imageData: Uint8Array,
              data: Uint8Array | Uint16Array,
              offset: number,
              size: number,
              x: number,
              y: number,
              bitDepth: number,
              bpr: number): void {
        if (bitDepth === 8) {
            const position: number = bpr * y + size * x;
            for (let i: number = 0; i < size; ++i) {
                imageData[position + i] = data[i + offset] as number;
            }
        } else if (bitDepth === 16) {
            const position: number = bpr * y + size * x;
            for (let i: number = 0; i < size; ++i) {
                imageData[position + i] = (data[i + offset] as number) >> 8;
            }
        } else {
            const position: number = Math.floor((bpr * y + x) / (8 / bitDepth));
            const t: number = (data[offset] as number) << (8 - bitDepth * (x % (8 / bitDepth)) - bitDepth);
            imageData[position] = imageData[position] | (t & 0xff);
        }
    }
    /**
     * Builds the PDF image stream for the PNG image, wiring the
     * core dictionary entries, optional `FlateDecode`, and optional `DecodeParms`,
     * and attaches the mask if present.
     *
     * @private
     * @returns {_PdfStream} The image stream suitable for embedding.
     */
    _getImageDictionary(): _PdfStream {
        if (this._imageStream && this._imageStream.length > 0) {
            return this._imageStream;
        } else {
            const data: any = []; // eslint-disable
            this._imageStream = new _PdfStream(data, new _PdfDictionary());
            this._imageStream.isImageStream = true;
            this._imageStream.bytes = this._decodedImageData;
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
            this._imageStream.end = this._imageStream.bytes.length;
            this._imageStream.dictionary._updated = true;
            this._setMask();
            return this._imageStream;
        }
    }
    /**
     * Creates and assigns the soft-mask image stream from the alpha (or shades)
     * buffer when available.
     *
     * @private
     * @returns {void}
     */
    _setMask(): void {
        if (this._maskData && this._maskData.length > 0) {
            this._maskStream = new _PdfStream(this._maskData, new _PdfDictionary());
            this._maskStream.bytes = this._maskData;
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
            this._maskStream.end = this._maskStream.bytes.length;
            this._maskStream.dictionary._updated = true;
        }
    }
    /**
     * Creates the `DecodeParms` dictionary (Columns/Colors/Predictor/BitsPerComponent)
     * for use with `FlateDecode` streams.
     *
     * @private
     * @returns {_PdfDictionary} The decode parameters dictionary.
     */
    _getDecodeParams(): _PdfDictionary {
        const decodeParams: _PdfDictionary = new _PdfDictionary();
        decodeParams.set('Columns', this._width);
        decodeParams.set('Colors', this._colors);
        decodeParams.set('Predictor', 15);
        decodeParams.set('BitsPerComponent', this._bitsPerComponent);
        return decodeParams;
    }
    /**
     * Maps a 4 character PNG chunk label to the internal enum value.
     *
     * @private
     * @param {string} chunk The chunk name.
     * @returns {_PngChunkTypes} The mapped chunk type or `null` if unknown.
     */
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
    /**
     * Maps a numeric filter byte to the corresponding PNG filter type enum.
     *
     * @private
     * @param {number} type The PNG filter byte (0..4).
     * @returns {_PngFilterTypes} The filter enum value.
     */
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
    /**
     * Releases decoder-held buffers and references to allow GC.
     *
     * @private
     * @returns {void}
     */
    dispose(): void {
        this._encodedStream = null;
        this._maskData = null;
        this._alpha = null;
        this._dataStream = null;
        this._decodedImageData = null;
        this._colorSpace = null;
    }
}
/**
 * Holds parsed values from the PNG `IHDR` chunk, including size, color type,
 * compression, filter method, and interlace mode; used to guide decoding.
 *
 * @private
 */
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
/**
 * Enumerates PNG chunk types recognized by the decoder, including core chunks
 * and optional metadata/ancillary chunks.
 *
 * @private
 */
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
/**
 * Enumerates the PNG scanline filter types applied to each row before compression.
 * These filters improve Deflate efficiency by transforming pixel values:
 *  - `none`    : No filtering applied.
 *  - `sub`     : Uses the left pixel as predictor.
 *  - `up`      : Uses the pixel above as predictor.
 *  - `average` : Averages the left and above pixels.
 *  - `paeth`   : Applies the Paeth predictor using left, above, and upper-left.
 *
 * @private
 */

enum _PngFilterTypes { none, sub, up, average, paeth }