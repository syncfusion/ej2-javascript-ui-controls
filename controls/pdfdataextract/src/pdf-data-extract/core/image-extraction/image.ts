import { _PdfImageResizer } from './image-resizer';
import { _PdfJpxImage } from '../jpx-image';
import { _PdfImageProcessor } from '../import/decode-image';
import { ImageFormat } from '../enum';
import { _convertBlackAndWhiteToRGBA, _convertToRGBA, imageKind } from './image-utils';
import { _isLittleEndian, _mathClamp, _PdfBaseStream, _PdfColorPalette, _PdfColorSpaceUtils, _PdfCrossReference, _PdfDecodeStream, _PdfDictionary, _PdfJpxStream, _PdfName, _PdfReference, FormatError } from '@syncfusion/ej2-pdf';
export class _PdfImage {
    private image: any; // eslint-disable-line
    private width: number;
    private height: number;
    private interpolate: boolean;
    private imageMask: boolean;
    private matte: any; // eslint-disable-line
    private bpc: number;
    private colorSpace: any;// eslint-disable-line
    private numComps: number;
    private decode: number[] | null;
    private needsDecode: boolean;
    private decodeCoefficients: number[];
    private decodeAddends: number[];
    private smask: _PdfImage | null;
    _canvasRenderCallback: any; // eslint-disable-line 
    _imageFormat: ImageFormat;
    private imageResizer: _PdfImageResizer = new _PdfImageResizer();
    private mask: _PdfImage | any; // eslint-disable-line 
    private jpxDecoderOptions: any; // eslint-disable-line
    constructor();
    constructor(xref?: any, image?: any, isInline?: boolean, smask?: any, mask?: any, isMask?: boolean) // eslint-disable-line
    constructor(xref?: any, image?: any, isInline?: boolean, smask?: any, mask?: any, isMask?: boolean) { // eslint-disable-line      
        if (image) {
            this.image = image;
            const dict: _PdfDictionary = image.dictionary;
            const filter: any = dict.get('F', 'Filter'); // eslint-disable-line
            let filterName: string | undefined;
            if (filter instanceof _PdfName) {
                filterName = filter.name;
            } else if (Array.isArray(filter)) {
                let filterZero: any; // eslint-disable-line
                if (filter[0] instanceof _PdfReference) {
                    filterZero = xref._fetch(filter[0]);
                } else {
                    filterZero = filter[0];
                }
                if (filterZero instanceof _PdfName) {
                    filterName = filterZero.name;
                }
            }
            let jpx: _PdfJpxImage;
            let reducePower: number;
            switch (filterName) {
            case 'JPXDecode':
                jpx = new _PdfJpxImage();
                ({
                    width: image.width,
                    height: image.height,
                    componentsCount: image.numComps,
                    bitsPerComponent: image.bitsPerComponent
                } = jpx._parseImageProperties(image.stream));
                image.stream.reset();
                reducePower = this.imageResizer._getReducePowerForJPX(image.width, image.height, image.numComps);
                this.jpxDecoderOptions = {numComponents: 0, isIndexedColormap: false, smaskInData: dict.has('SMaskInData'), reducePower};
                if (reducePower) {
                    const factor: number = 2 ** reducePower;
                    image.width = Math.ceil(image.width / factor);
                    image.height = Math.ceil(image.height / factor);
                }
                break;
            case 'JBIG2Decode':
                image.bitsPerComponent = 1;
                image.numComps = 1;
                break;
            }
            let width: number = dict.get('W', 'Width');
            let height: number = dict.get('H', 'Height');
            if (Number.isInteger(image.width) && image.width > 0 && Number.isInteger(image.height) && image.height > 0 &&
                (image.width !== width || image.height !== height)) {
                width = image.width;
                height = image.height;
            } else {
                const validWidth: boolean = typeof width === 'number' && width > 0;
                const validHeight: boolean = typeof height === 'number' && height > 0;
                if (!validWidth || !validHeight) {
                    if (!image.fallbackDims) {
                        throw new FormatError(
                            `Invalid image width: ${width} or height: ${height}`
                        );
                    }
                    if (!validWidth) {
                        width = image.fallbackDims.width;
                    }
                    if (!validHeight) {
                        height = image.fallbackDims.height;
                    }
                }
            }
            this.width = width;
            this.height = height;
            this.interpolate = dict.get('I', 'Interpolate');
            this.imageMask = dict.get('IM', 'ImageMask') || false;
            this.matte = dict.get('Matte') || false;
            let bitsPerComponent: number = image.bitsPerComponent;
            if (!bitsPerComponent) {
                bitsPerComponent = dict.get('BPC', 'BitsPerComponent');
                if (!bitsPerComponent) {
                    if (this.imageMask) {
                        bitsPerComponent = 1;
                    } else {
                        throw new FormatError(
                            `Bits per component missing in image: ${this.imageMask}`
                        );
                    }
                }
            }
            this.bpc = bitsPerComponent;
            if (!this.imageMask) {
                let colorSpace: any = dict.getRaw('CS') || dict.getRaw('ColorSpace'); // eslint-disable-line
                const hasColorSpace: boolean = colorSpace !== undefined;
                if (!hasColorSpace) {
                    if (this.jpxDecoderOptions) {
                        colorSpace = _PdfName.get('DeviceRGBA');
                    } else {
                        switch (image.numComps) {
                        case 1:
                            colorSpace = _PdfName.get('DeviceGray');
                            break;
                        case 3:
                            colorSpace = _PdfName.get('DeviceRGB');
                            break;
                        case 4:
                            colorSpace = _PdfName.get('DeviceCMYK');
                            break;
                        default:
                            throw new Error(
                                `Images with ${image.numComps} color components not supported.`
                            );
                        }
                    }
                } else if (this.jpxDecoderOptions && this.jpxDecoderOptions.smaskInData) {
                    colorSpace = _PdfName.get('DeviceRGBA');
                }
                const color: _PdfColorSpaceUtils = new _PdfColorSpaceUtils();
                this.colorSpace = color._parse(colorSpace, xref, null, null, null, false, null);
                this.numComps = this.colorSpace.numComps;
                if (this.jpxDecoderOptions) {
                    this.jpxDecoderOptions.numComponents = hasColorSpace
                        ? this.numComps
                        : 0;
                    this.jpxDecoderOptions.isIndexedColormap =
                    this.colorSpace.name === 'Indexed';
                }
            }
            this.decode = dict.getArray('D', 'Decode') || null;
            this.needsDecode = false;
            if (this.decode && ((this.colorSpace && !this.colorSpace._isDefaultDecode(this.decode, bitsPerComponent)) || (isMask && !
            this._isDefaultDecode()))) {
                this.needsDecode = true;
                const max: number = (1 << bitsPerComponent) - 1;
                this.decodeCoefficients = [];
                this.decodeAddends = [];
                const isIndexed: boolean = this.colorSpace && this.colorSpace.name === 'Indexed';
                for (let i: number = 0, j: number = 0; i < this.decode.length; i += 2, ++j) {
                    const dmin: number = this.decode[<number>i];
                    const dmax: number = this.decode[i + 1];
                    this.decodeCoefficients[<number>j] = isIndexed
                        ? (dmax - dmin) / max
                        : dmax - dmin;
                    this.decodeAddends[<number>j] = isIndexed ? dmin : max * dmin;
                }
            }
            if (smask) {
                if (smask.fallbackDims === null) {
                    smask.fallbackDims = { width, height };
                }
                this.smask = new _PdfImage(xref, smask, isInline, null, null, false);
            } else if (mask) {
                if (mask instanceof _PdfBaseStream) {
                    const maskDict: _PdfDictionary = mask.dictionary;
                    const imageMask: any = maskDict.get('IM', 'ImageMask'); // eslint-disable-line
                    if (imageMask) {
                        this.mask = new _PdfImage(xref, mask, isInline, null, null, true);
                    }
                } else {
                    this.mask = mask;
                }
            }
        }
    }
    _resizeImageMask(src: Uint8Array | Uint16Array | Uint32Array, bpc: number, w1: number,
                     h1: number, w2: number, h2: number): Uint8Array | Uint16Array | Uint32Array {
        const length: number = w2 * h2;
        let dest: Uint8Array | Uint16Array | Uint32Array;
        if (bpc <= 8) {
            dest = new Uint8Array(length);
        } else if (bpc <= 16) {
            dest = new Uint16Array(length);
        } else {
            dest = new Uint32Array(length);
        }
        const xRatio: number = w1 / w2;
        const yRatio: number = h1 / h2;
        let i: number;
        let j: number;
        let py: number;
        let newIndex: number = 0;
        let oldIndex: number;
        const xScaled: Uint16Array = new Uint16Array(w2);
        const w1Scanline: number = w1;
        for (i = 0; i < w2; i++) {
            xScaled[<number>i] = Math.floor(i * xRatio);
        }
        for (i = 0; i < h2; i++) {
            py = Math.floor(i * yRatio) * w1Scanline;
            for (j = 0; j < w2; j++) {
                oldIndex = py + xScaled[<number>j];
                dest[<number>newIndex] = src[<number>oldIndex];
                newIndex++;
            }
        }
        return dest;
    }
    _isDefaultDecode(): boolean {
        if (typeof(this.colorSpace) === 'undefined') {
            const colorPalette: _PdfColorPalette = new _PdfColorPalette('ColorSpace', undefined);
            return colorPalette._isDefaultDecode(this.decode, 1);
        }
        return false;
    }
    _getImageData(length: number, decoderOptions: any): any { // eslint-disable-line
        if (!decoderOptions.image.canAsyncDecodeImageFromBuffer) {
            if (decoderOptions.image.isAsyncDecoder) {
                return decoderOptions.image.decodeImage(null, decoderOptions);
            }
            return decoderOptions.image.getBytes(length, decoderOptions);
        }
        const data:any = decoderOptions.image.stream.asyncGetBytes(); // eslint-disable-line
        return decoderOptions.image.decodeImage(data, decoderOptions);
    }
    async _createImageData(forceRGBA: boolean = false, isOffscreenCanvasSupported: boolean = false): Promise<any> { // eslint-disable-line
        const drawWidth: number = this.drawWidth;
        const drawHeight: number = this.drawHeight;
        const imgData: any = { width: drawWidth, height: drawHeight, interpolate: this.interpolate, kind: 0, // eslint-disable-line
                               data: null}; // eslint-disable-line
        const numComps: number = this.numComps;
        const originalWidth: number = this.width;
        const originalHeight: number = this.height;
        const bpc: number = this.bpc;
        const rowBytes: number = (originalWidth * numComps * bpc + 7) >> 3;
        const mustBeResized: boolean = isOffscreenCanvasSupported &&
            this.imageResizer._needsToBeResized(drawWidth, drawHeight);
        if (!this.smask && !this.mask && this.colorSpace.name === 'DeviceRGBA') {
            imgData.kind = imageKind.rgba32BPP;
            const imgArray: any = (imgData.data = await this._getImageBytes(originalHeight * originalWidth * 4, {})); // eslint-disable-line
            if (isOffscreenCanvasSupported) {
                if (!mustBeResized) {
                    return await this._createBitmap(imageKind.rgba32BPP, drawWidth, drawHeight, imgArray);
                }
                return await this.imageResizer._createImageData(imgData, false);
            }
            return imgData;
        }
        if (!forceRGBA) {
            let kind: any; // eslint-disable-line
            if (this.colorSpace.name === 'DeviceGray' && bpc === 1) {
                kind = imageKind.grayScale1Bpp;
            } else if (this.colorSpace.name === 'DeviceRGB' && bpc === 8 && !this.needsDecode) {
                kind = imageKind.rgb24BPP;
            }
            if (kind && !this.smask && !this.mask && drawWidth === originalWidth && drawHeight === originalHeight) {
                const image: any =  this._getImage(originalWidth, originalHeight); // eslint-disable-line
                if (image) {
                    return image;
                }
                const data: any =  await this._getImageBytes(originalHeight * rowBytes, {}); // eslint-disable-line
                if (isOffscreenCanvasSupported) {
                    if (mustBeResized) {
                        return this.imageResizer._createImageData({data, kind, width: drawWidth, height: drawHeight, interpolate:
                                                                  this.interpolate}, this.needsDecode);
                    }
                    return await this._createBitmap(kind, originalWidth, originalHeight, data);
                }
                imgData.kind = kind;
                imgData.data = data;
                if (this.needsDecode) {
                    const buffer: any = imgData.data; // eslint-disable-line
                    for (let i: number = 0, ii: number = buffer.length; i < ii; i++) {
                        buffer[<number>i] ^= 0xff;
                    }
                }
                return imgData;
            }
        }
        const imgArray: any =  await this._getImageBytes(originalHeight * rowBytes, {internal: true}); // eslint-disable-line
        const actualHeight: number = 0 | (((imgArray.length / rowBytes) * drawHeight) / originalHeight);
        const comps: any = this._getComponents(imgArray); // eslint-disable-line
        let alpha01: any // eslint-disable-line
        let maybeUndoPreblend: any// eslint-disable-line
        let data: any; // eslint-disable-line
        let canvasImgData: any; // eslint-disable-line
        let ctx: any; // eslint-disable-line
        let canvas: any; // eslint-disable-line
        if (isOffscreenCanvasSupported && !mustBeResized) {
            canvas = document.createElement('canvas');
            canvas.width = drawWidth;
            canvas.height = drawHeight;
            ctx = canvas.getContext('2d');
            canvasImgData = ctx.createImageData(drawWidth, drawHeight);
            data = canvasImgData.data;
        }
        imgData.kind = imageKind.rgba32BPP;
        if (!forceRGBA && !this.smask && !this.mask) {
            if (!isOffscreenCanvasSupported || mustBeResized) {
                imgData.kind = imageKind.rgb24BPP;
                data = new Uint8ClampedArray(drawWidth * drawHeight * 3);
                alpha01 = 0;
            } else {
                const arr: Uint32Array = new Uint32Array(data.buffer);
                arr.fill(_isLittleEndian() ? 0xff000000 : 0x000000ff);
                alpha01 = 1;
            }
            maybeUndoPreblend = false;
        } else {
            if (!isOffscreenCanvasSupported || mustBeResized) {
                data = new Uint8ClampedArray(drawWidth * drawHeight * 4);
            }
            alpha01 = 1;
            maybeUndoPreblend = true;
            await this._fillOpacity(data, drawWidth, drawHeight, actualHeight, comps);
        }
        if (this.needsDecode) {
            this._decodeBuffer(comps);
        }
        this.colorSpace._fillRgb(data, originalWidth, originalHeight, drawWidth, drawHeight, actualHeight, bpc, comps, alpha01);
        if (maybeUndoPreblend) {
            this._undoPreblend(data, drawWidth, actualHeight);
        }
        if (isOffscreenCanvasSupported && !mustBeResized) {
            ctx.putImageData(canvasImgData, 0, 0);
            const format: string = this._findImageFormat(this._imageFormat);
            const buffer: string = canvas.toDataURL(format);
            const base64: string = buffer.split(',')[1];
            const bytes: Uint8Array = this._base64ToUint8Array(base64);
            return bytes;
        }
        imgData.data = data;
        if (mustBeResized) {
            return this.imageResizer._createImageData(imgData);
        }
        return imgData;
    }
    _findImageFormat(format: ImageFormat): string {
        if (ImageFormat.png === format) {
            return 'image/png';
        } else {
            return 'image/jpeg';
        }
    }
    _base64ToUint8Array(base64String: string): Uint8Array {
        const binaryString: string = atob(base64String);
        const len: number = binaryString.length;
        const bytes: Uint8Array = new Uint8Array(len);
        for (let i: number = 0; i < len; i++) {
            bytes[<number> i] = binaryString.charCodeAt(i);
        }
        return bytes;
    }
    _buildImage(xref: _PdfCrossReference, image: any, isInline: boolean): _PdfImage { // eslint-disable-line
        const imageData: any = image; // eslint-disable-line
        let smaskData: any = null; // eslint-disable-line
        let maskData: any = null; // eslint-disable-line
        const smask: any = image.dictionary.get('SMask'); // eslint-disable-line
        const mask: any = image.dictionary.get('Mask'); // eslint-disable-line
        if (smask) {
            if (smask instanceof _PdfBaseStream) {
                smaskData = smask;
            }
        } else if (mask) {
            if (mask instanceof _PdfBaseStream || Array.isArray(mask)) {
                maskData = mask;
            }
        }
        return new _PdfImage(xref, imageData, isInline, smaskData, maskData);
    }
    _createMask(image: any, isOffscreenCanvasSupported: boolean): any { // eslint-disable-line
        const dict: _PdfDictionary = image.dictionary;
        const width: number = dict.get('W', 'Width');
        const height: number = dict.get('H', 'Height');
        const interpolate: any = dict.get('I', 'Interpolate'); // eslint-disable-line
        const decode: number[] = dict.getArray('D', 'Decode');
        const inverseDecode: boolean = decode && decode[0] > 0;
        const computedLength: number = ((width + 7) >> 3) * height;
        const imgArray: any = image.getBytes(computedLength); // eslint-disable-line
        const isSingleOpaquePixel: boolean = width === 1 && height === 1 &&
            inverseDecode === (imgArray.length === 0 || !!(imgArray[0] & 128));
        if (isSingleOpaquePixel) {
            return { isSingleOpaquePixel };
        }
        if (isOffscreenCanvasSupported) {
            if (this.imageResizer._needsToBeResized(width, height)) {
                const data: Uint8ClampedArray = new Uint8ClampedArray(width * height * 4);
                _convertBlackAndWhiteToRGBA(imgArray, 0, data, width, height, 0, inverseDecode);
                return this.imageResizer._createImageData({kind: imageKind.rgba32BPP, data, width, height, interpolate});
            }
            let canvas: any; // eslint-disable-line
            if (this._canvasRenderCallback) {
                canvas = this._canvasRenderCallback.canvas;
            }
            canvas.width = width;
            canvas.height = height;
            const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
            const imgData: any = ctx.createImageData(width, height); // eslint-disable-line
            _convertBlackAndWhiteToRGBA(imgArray, 0, imgData.data, width, height, 0, inverseDecode);
            ctx.putImageData(imgData, 0, 0);
            const format: string = this._findImageFormat(this._imageFormat);
            const buffer: string = canvas.toDataURL(format);
            const base64: string = buffer.split(',')[1];
            const bytes: Uint8Array = this._base64ToUint8Array(base64);
            return bytes;
        }
        const actualLength: number = imgArray.byteLength;
        const haveFullData: boolean = computedLength === actualLength;
        let data: Uint8Array;
        if (image instanceof _PdfDecodeStream && (!inverseDecode || haveFullData)) {
            data = imgArray;
        } else if (!inverseDecode) {
            data = new Uint8Array(imgArray);
        } else {
            data = new Uint8Array(computedLength);
            data.set(imgArray);
            data.fill(0xff, actualLength);
        }
        if (inverseDecode) {
            for (let i: number = 0; i < actualLength; i++) {
                data[<number>i] ^= 0xff;
            }
        }
        return data;
    }
    get drawWidth(): number {
        return Math.max(this.width, this.smask && this.smask.width || 0, this.mask && this.mask.width || 0);
    }
    get drawHeight(): number {
        return Math.max(this.height, this.smask && this.smask.height || 0, this.mask && this.mask.height || 0);
    }
    _decodeBuffer(buffer: Uint8Array): void {
        const bpc: number = this.bpc;
        const numComps: number = this.numComps;
        const decodeAddends: number[] = this.decodeAddends;
        const decodeCoefficients: number[] = this.decodeCoefficients;
        const max: number = (1 << bpc) - 1;
        let i: number;
        let ii: number;
        if (bpc === 1) {
            for (i = 0, ii = buffer.length; i < ii; i++) {
                buffer[<number>i] = +!buffer[<number>i];
            }
            return;
        }
        let index: number = 0;
        for (i = 0, ii = this.width * this.height; i < ii; i++) {
            for (let j: number = 0; j < numComps; j++) {
                buffer[<number>index] = _mathClamp(
                    decodeAddends[<number>j] + buffer[<number>index] *
                    decodeCoefficients[<number>j], 0, max);
                index++;
            }
        }
    }
    _getComponents(buffer: Uint8Array): Uint8Array | Uint16Array | Uint32Array {
        const bpc: number = this.bpc;
        if (bpc === 8) {
            return buffer;
        }
        const width: number = this.width;
        const height: number = this.height;
        const numComps: number = this.numComps;
        const length: number = width * height * numComps;
        let bufferPos: number = 0;
        let output: any; // eslint-disable-line
        if (bpc <= 8) {
            output = new Uint8Array(length);
        } else if (bpc <= 16) {
            output = new Uint16Array(length);
        } else {
            output = new Uint32Array(length);
        }
        const rowComps: number = width * numComps;
        const max: number = (1 << bpc) - 1;
        let i: number = 0;
        let ii: number;
        let buf: any; // eslint-disable-line
        if (bpc === 1) {
            let mask: any; // eslint-disable-line
            let loop1End: number;
            let loop2End: number;
            for (let j: number = 0; j < height; j++) {
                loop1End = i + (rowComps & ~7);
                loop2End = i + rowComps;
                while (i < loop1End) {
                    buf = buffer[bufferPos++];
                    output[<number>i] = (buf >> 7) & 1;
                    output[i + 1] = (buf >> 6) & 1;
                    output[i + 2] = (buf >> 5) & 1;
                    output[i + 3] = (buf >> 4) & 1;
                    output[i + 4] = (buf >> 3) & 1;
                    output[i + 5] = (buf >> 2) & 1;
                    output[i + 6] = (buf >> 1) & 1;
                    output[i + 7] = buf & 1;
                    i += 8;
                }
                if (i < loop2End) {
                    buf = buffer[bufferPos++];
                    mask = 128;
                    while (i < loop2End) {
                        output[i++] = +!!(buf & mask);
                        mask >>= 1;
                    }
                }
            }
        } else {
            let bits: number = 0;
            buf = 0;
            for (i = 0, ii = length; i < ii; ++i) {
                if (i % rowComps === 0) {
                    buf = 0;
                    bits = 0;
                }
                while (bits < bpc) {
                    buf = (buf << 8) | buffer[bufferPos++];
                    bits += 8;
                }
                const remainingBits: number = bits - bpc;
                let value: number = buf >> remainingBits;
                if (value < 0) {
                    value = 0;
                } else if (value > max) {
                    value = max;
                }
                output[<number>i] = value;
                buf &= (1 << remainingBits) - 1;
                bits = remainingBits;
            }
        }
        return output;
    }
    async _fillOpacity(rgbaBuf: Uint8ClampedArray, width: number, height: number, actualHeight: number,
                       image: Uint8ClampedArray
    ): Promise<void> {
        const smask: any = this.smask; // eslint-disable-line
        const mask: any = this.mask; // eslint-disable-line
        let alphaBuf: any; // eslint-disable-line
        let sw: number;
        let sh: number;
        let i: number;
        let ii: number;
        let j: number;
        if (smask) {
            sw = smask.width;
            sh = smask.height;
            alphaBuf = new Uint8ClampedArray(sw * sh);
            await smask._fillGrayBuffer(alphaBuf);
            if (sw !== width || sh !== height) {
                alphaBuf = this._resizeImageMask(alphaBuf, smask.bpc, sw, sh, width, height);
            }
        } else if (mask) {
            if (mask instanceof _PdfImage) {
                sw = mask.width;
                sh = mask.height;
                alphaBuf = new Uint8ClampedArray(sw * sh);
                mask.numComps = 1;
                mask._fillGrayBuffer(alphaBuf);
                for (i = 0, ii = sw * sh; i < ii; ++i) {
                    alphaBuf[<number>i] = 255 - alphaBuf[<number>i];
                }
                if (sw !== width || sh !== height) {
                    alphaBuf = this._resizeImageMask(alphaBuf, mask.bpc, sw, sh, width, height);
                }
            } else if (Array.isArray(mask)) {
                alphaBuf = new Uint8ClampedArray(width * height);
                const numComps: number = this.numComps;
                for (i = 0, ii = width * height; i < ii; ++i) {
                    let opacity: number = 0;
                    const imageOffset: number = i * numComps;
                    for (j = 0; j < numComps; ++j) {
                        const color: number = image[imageOffset + j];
                        const maskOffset: number = j * 2;
                        if (color < mask[<number>maskOffset] || color > mask[maskOffset + 1]) {
                            opacity = 255;
                            break;
                        }
                    }
                    alphaBuf[<number>i] = opacity;
                }
            } else {
                throw new FormatError('Unknown mask format.');
            }
        }
        if (alphaBuf) {
            for (i = 0, j = 3, ii = width * actualHeight; i < ii; ++i, j += 4) {
                rgbaBuf[<number>j] = alphaBuf[<number>i];
            }
        } else {
            for (i = 0, j = 3, ii = width * actualHeight; i < ii; ++i, j += 4) {
                rgbaBuf[<number>j] = 255;
            }
        }
    }
    _undoPreblend(buffer: Uint8ClampedArray, width: number, height: number): void {
        const matte: any = this.smask && this.smask.matte; // eslint-disable-line
        if (!matte) {
            return;
        }
        const matteRgb: any = this.colorSpace.getRgb(matte, 0); // eslint-disable-line
        const matteR: number = matteRgb[0];
        const matteG: number = matteRgb[1];
        const matteB: number = matteRgb[2];
        const length: number = width * height * 4;
        for (let i: number = 0; i < length; i += 4) {
            const alpha: number = buffer[i + 3];
            if (alpha === 0) {
                buffer[<number>i] = 255;
                buffer[i + 1] = 255;
                buffer[i + 2] = 255;
                continue;
            }
            const k: number = 255 / alpha;
            buffer[<number>i] = (buffer[<number>i] - matteR) * k + matteR;
            buffer[i + 1] = (buffer[i + 1] - matteG) * k + matteG;
            buffer[i + 2] = (buffer[i + 2] - matteB) * k + matteB;
        }
    }
    async _fillGrayBuffer(buffer: Uint8ClampedArray): Promise<void> {
        const numComps: number = this.numComps;
        if (numComps !== 1) {
            throw new FormatError(
                `Reading gray scale from a color image: ${numComps}`
            );
        }
        const width: number = this.width;
        const height: number = this.height;
        const bpc: number = this.bpc;
        const rowBytes: number = (width * numComps * bpc + 7) >> 3;
        const imgArray: any = await this._getImageBytes(height * rowBytes, { internal: true }); // eslint-disable-line
        const comps: any = this._getComponents(imgArray); // eslint-disable-line
        let i: number;
        let length: number;
        if (bpc === 1) {
            length = width * height;
            if (this.needsDecode) {
                for (i = 0; i < length; ++i) {
                    buffer[<number>i] = (comps[<number>i] - 1) & 255;
                }
            } else {
                for (i = 0; i < length; ++i) {
                    buffer[<number>i] = -comps[<number>i] & 255;
                }
            }
            return;
        }
        if (this.needsDecode) {
            this._decodeBuffer(comps);
        }
        length = width * height;
        const scale: number = 255 / ((1 << bpc) - 1);
        for (i = 0; i < length; ++i) {
            buffer[<number>i] = scale * comps[<number>i];
        }
    }
    _createBitmap(kind: any, width: number, height: number, src: Uint8ClampedArray): any { // eslint-disable-line
        let imgData: any; // eslint-disable-line
        let canvas: any; // eslint-disable-line
        if (this._canvasRenderCallback) {
            canvas = this._canvasRenderCallback.canvas;
        } else {
            throw new Error('canvas is not defined');
        }
        canvas.width = width;
        canvas.height = height;
        const ctx: any = canvas.getContext('2d'); // eslint-disable-line
        if (kind === imageKind.rgba32BPP) {
            imgData = new ImageData(src, width, height);
        } else {
            imgData = ctx.createImageData(width, height);
            _convertToRGBA(kind, src, new Uint32Array(imgData.data.buffer), width, height, this.needsDecode);
        }
        ctx.putImageData(imgData, 0, 0);
        const format: string = this._findImageFormat(this._imageFormat);
        const buffer: string = canvas.toDataURL(format);
        const base64: string = buffer.split(',')[1];
        const bytes: Uint8Array = this._base64ToUint8Array(base64);
        return bytes;
    }
    _getTransferableImage(): any { // eslint-disable-line
        return null;
    }
    _getImage(width: number, height: number): any { // eslint-disable-line
        const bitmap: any =  this._getTransferableImage(); // eslint-disable-line 
        if (!bitmap) {
            return null;
        }
        return {
            data: null,
            width,
            height,
            bitmap,
            interpolate: this.interpolate
        };
    }
    async _getImageBytes(length: number, {drawWidth, drawHeight, forceRGBA = false, forceRGB = false, internal = false}: {
        drawWidth?: number, drawHeight?: number, forceRGBA?: boolean, forceRGB?: boolean, internal?: boolean }): Promise<Uint8Array> {
        this.image.reset();
        this.image.drawWidth = drawWidth || this.width;
        this.image.drawHeight = drawHeight || this.height;
        this.image.forceRGBA = !!forceRGBA;
        this.image.forceRGB = !!forceRGB;
        let data: any; //eslint-disable-line
        const imageBytes: any = this._getImageData(length, this); // eslint-disable-line
        if (this.image instanceof _PdfJpxStream) {
            let platform: ApplicationPlatform;
            if (this._canvasRenderCallback) {
                platform = this._canvasRenderCallback.applicationPlatform;
            }
            const imagedata : _PdfImageProcessor = new _PdfImageProcessor();
            data = await imagedata._decodeImage(imageBytes, this.image, platform);
            return data;
        }
        if (internal || this.image instanceof _PdfDecodeStream) {
            return imageBytes;
        }
        return new Uint8Array(imageBytes);
    }
}
/**
 * Represents the application platform type.
 *
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data);
 * // Define a canvas render callback that returns a canvas element and the application platform.
 * const canvasRenderCallback = (): {canvas: any, applicationPlatform: ApplicationPlatform} => {
 *     const canvas = document.createElement('canvas');
 *     return { canvas: canvas, applicationPlatform: ApplicationPlatform.vue };
 * };
 * // Initialize a new instance of the `PdfDataExtractor` class
 * let extractor: PdfDataExtractor = new PdfDataExtractor(document, callBack: canvasRenderCallback);
 * // Extract collection of `PdfEmbeddedImage` from the PDF document.
 * let imageInfoCollection: PdfEmbeddedImage[] = extractor.extractImages({ startPageIndex: 0, endPageIndex: document.pageCount - 1});
 * let imageInfo: PdfEmbeddedImage = imageInfoCollection[0];
 * let data: Uint8Array = imageInfo.data;
 * // Destroy the documents
 * document.destroy();
 */
export enum ApplicationPlatform {
    /**
     * Specifies the `typeScript` platform.
     */
    typescript = 'typescript',
    /**
     * Specifies the `javascript` platform.
     */
    javascript = 'javascript',
    /**
     * Specifies the `angular` platform.
     */
    angular = 'angular',
    /**
     * Specifies the `react` platform.
     */
    react = 'react',
    /**
     * Specifies the `vue` platform.
     */
    vue = 'vue',
    /**
     * Specifies the `aspnetcore` platform.
     */
    aspnetcore = 'aspnetcore',
    /**
     * Specifies the `aspnetmvc` platform.
     */
    aspnetmvc = 'aspnetmvc'
}
