import { _convertToRGBA, imageKind, maximumCount } from './image-utils';
import { _isLittleEndian } from '@syncfusion/ej2-pdf';
export class _PdfImageResizer {
    minimumImageDimension: number = 2048;
    maximumImageDimension: number = 65537;
    error: number = 128;
    goodSquareLength: number = 2048;
    isImageDecoderSupported: boolean = false; //FeatureTest.isImageDecoderSupported;
    private _imgData: any; // eslint-disable-line
    private _isMask: boolean;
    private _hasMaxArea: boolean = false;
    constructor();
    constructor(imgData: any, isMask: boolean); // eslint-disable-line
    constructor(imgData?: any, isMask?: boolean) { // eslint-disable-line
        if (typeof(imgData) !== 'undefined' && typeof(isMask) !== 'undefined') {
            this._imgData = imgData;
            this._isMask = isMask;
        }

    }
    get canUseImageDecoder(): any { // eslint-disable-line
        return this.isImageDecoderSupported ? Promise.resolve(false) : Promise.resolve(false);
    }
    _needsToBeResized(width: number, height: number): boolean {
        if (width <= this.goodSquareLength && height <= this.goodSquareLength) {
            return false;
        }
        const { _maximumDim } = this;
        if (width > _maximumDim || height > _maximumDim) {
            return true;
        }
        const area: number = width * height;
        if (this._hasMaxArea) {
            return area > this._maximumArea;
        }
        if (area < this.goodSquareLength ** 2) {
            return false;
        }
        if (this._areGoodDims(width, height)) {
            this.goodSquareLength = Math.max(
                this.goodSquareLength,
                Math.floor(Math.sqrt(width * height))
            );
            return false;
        }
        this.goodSquareLength = this._guessMax(
            this.goodSquareLength,
            _maximumDim,
            this.error,
            0
        );
        const maxArea: number = (this._maximumArea = this.goodSquareLength ** 2);
        return area > maxArea;
    }
    _getReducePowerForJPX(width: number, height: number, componentsCount: number): number {
        const area: number  = width * height;
        const maxJPXArea: number = 2 ** 30 / (componentsCount * 4);
        if (!this._needsToBeResized(width, height)) {
            if (area > maxJPXArea) {
                return Math.ceil(Math.log2(area / maxJPXArea));
            }
            return 0;
        }
        const { _maximumDim, _maximumArea } = this;
        const minFactor: number = Math.max(
            width / _maximumDim,
            height / _maximumDim,
            Math.sqrt(area / Math.min(maxJPXArea, _maximumArea))
        );
        return Math.ceil(Math.log2(minFactor));
    }
    get _maximumDim(): number {
        return this._guessMax(this.maximumImageDimension, this.maximumImageDimension, 0, 1);
    }
    get _maximumArea(): number {
        this._hasMaxArea = true;
        return this._guessMax(this.goodSquareLength, this._maximumDim, this.error, 0) ** 2;
    }
    set _maximumArea(area: number) {
        if (area >= 0) {
            this._hasMaxArea = true;
        }
    }
    _setOptions({
        canvasMaxAreaInBytes = -1,
        isImageDecoderSupported = false
    }: {
        canvasMaxAreaInBytes?: number;
        isImageDecoderSupported?: boolean;
    }): any { // eslint-disable-line
        if (!this._hasMaxArea) {
            this._maximumArea = canvasMaxAreaInBytes >> 2;
        }
        this.isImageDecoderSupported = isImageDecoderSupported;
    }
    _areGoodDims(width: number, height: number): boolean {
        try {
            const canvas: HTMLCanvasElement = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
            ctx.fillRect(0, 0, 1, 1);
            const opacity : any = ctx.getImageData(0, 0, 1, 1).data[3]; // eslint-disable-line
            canvas.width = canvas.height = 1;
            return opacity !== 0;
        } catch {
            return false;
        }
    }
    _guessMax(start: number, end: number, tolerance: number, defaultHeight: number): number {
        while (start + tolerance + 1 < end) {
            const middle: number = Math.floor((start + end) / 2);
            const height: number = defaultHeight || middle;
            if (this._areGoodDims(middle, height)) {
                start = middle;
            } else {
                end = middle;
            }
        }
        return start;
    }
    _createImageData(imgData: any, isMask: boolean = false): any { // eslint-disable-line
        return new _PdfImageResizer(imgData, isMask)._createImage();
    }
    _createImage(): any { // eslint-disable-line
        const { _imgData: imgData } = this;
        const { width, height } = imgData;
        if (width * height * 4 > maximumCount) {
            const result: any = this._rescaleImageData(); // eslint-disable-line
            if (result) {
                return result;
            }
        }
        const data: any = this._encodeBMP(); // eslint-disable-line
        let imagePromise: any; // eslint-disable-line
        const { _maximumArea, _maximumDim } = this;
        const minFactor: number = Math.max(
            width / _maximumDim,
            height / _maximumDim,
            Math.sqrt((width * height) / _maximumArea)
        );
        const firstFactor: number = Math.max(minFactor, 2);
        const factor: number = Math.round(10 * (minFactor + 1.25)) / 10 / firstFactor;
        const n: number = Math.floor(Math.log2(factor));
        const steps: any = new Array(n + 2).fill(2); // eslint-disable-line
        steps[0] = firstFactor;
        steps.splice(-1, 1, factor / (1 << n));
        let newWidth: number = width;
        let newHeight: number = height;
        const result: any = imagePromise; // eslint-disable-line
        let bitmap: any = result.image || result; // eslint-disable-line
        for (const step of steps) {
            const prevWidth: number = newWidth;
            const prevHeight: number = newHeight;
            newWidth = Math.floor(newWidth / step) - 1;
            newHeight = Math.floor(newHeight / step) - 1;
            const canvas: HTMLCanvasElement = document.createElement('canvas');
            canvas.width = newWidth;
            canvas.height = newHeight;
            const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
            ctx.drawImage(bitmap, 0, 0, prevWidth, prevHeight, 0, 0, newWidth, newHeight);
            bitmap.close();
        }
        imgData.data = null;
        imgData.bitmap = bitmap;
        imgData.width = newWidth;
        imgData.height = newHeight;
        return imgData;
    }
    _rescaleImageData(): any { // eslint-disable-line
        const { _imgData: imgData } = this;
        const { data, width, height, kind } = imgData;
        const rgbaSize: number = width * height * 4;
        const k: number = Math.ceil(Math.log2(rgbaSize / maximumCount));
        const newWidth: number = width >> k;
        const newHeight: number = height >> k;
        let rgbaData: Uint8Array | null = null;
        let maxHeight: number = height;
        try {
            rgbaData = new Uint8Array(rgbaSize);
        } catch {
            let n: number = Math.floor(Math.log2(rgbaSize + 1));
            while (true) { // eslint-disable-line
                try {
                    rgbaData = new Uint8Array(2 ** n - 1);
                    break;
                } catch {
                    n -= 1;
                }
            }
            maxHeight = Math.floor((2 ** n - 1) / (width * 4));
            const newSize: number = width * maxHeight * 4;
            if (newSize < rgbaData.length) {
                rgbaData = new Uint8Array(newSize);
            }
        }
        if (rgbaData === null) {
            return null;
        }
        const src32: Uint32Array = new Uint32Array(rgbaData.buffer);
        const dest32: Uint32Array = new Uint32Array(newWidth * newHeight);
        let newIndex: number = 0;
        const step: number = Math.ceil(height / maxHeight);
        const remainder: number = height % maxHeight === 0 ? height : height % maxHeight;
        for (let k: number = 0; k < step; k++) {
            const h: number = k < step - 1 ? maxHeight : remainder;
            _convertToRGBA(kind, data, src32, width, h, this._isMask);
            for (let i: number = 0, ii: number = h >> k; i < ii; i++) {
                const buf: Uint32Array = src32.subarray((i << k) * width);
                for (let j: number = 0; j < newWidth; j++) {
                    dest32[newIndex++] = buf[j << k];
                }
            }
        }
        if (this._needsToBeResized(newWidth, newHeight)) {
            imgData.data = dest32;
            imgData.width = newWidth;
            imgData.height = newHeight;
            imgData.kind = imageKind.rgba32BPP;
            return null;
        }
        const canvas: HTMLCanvasElement = document.createElement('canvas');
        canvas.width = newWidth;
        canvas.height = newHeight;
        const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
        ctx.putImageData(
            new ImageData(new Uint8ClampedArray(dest32.buffer), newWidth, newHeight),
            0,
            0
        );
        imgData.data = null;
        //imgData.bitmap = canvas.transferToImageBitmap();
        imgData.width = newWidth;
        imgData.height = newHeight;
        return imgData;
    }
    _encodeBMP(): Uint8Array {
        const { width, height, kind } = this._imgData;
        let data: any = this._imgData.data; // eslint-disable-line
        let bitPerPixel: number;
        let view: DataView;
        let colorTable: Uint8Array = new Uint8Array(0);
        let maskTable: Uint8Array = colorTable;
        let compression: number = 0;
        switch (kind) {
        case imageKind.grayScale1Bpp: {
            bitPerPixel = 1;
            colorTable = new Uint8Array(
                this._isMask ? [255, 255, 255, 255, 0, 0, 0, 0] : [0, 0, 0, 0, 255, 255, 255, 255]
            );
            const rowLen: number = (width + 7) >> 3;
            const rowSize: number = (rowLen + 3) & -4;
            if (rowLen !== rowSize) {
                const newData: Uint8Array = new Uint8Array(rowSize * height);
                let k: number = 0;
                for (let i: number = 0, ii: number = height * rowLen; i < ii; i += rowLen, k += rowSize) {
                    newData.set(data.subarray(i, i + rowLen), k);
                }
                data = newData;
            }
            break;
        }
        case imageKind.rgb24BPP: {
            bitPerPixel = 24;
            if (width & 3) {
                const rowLen: number = 3 * width;
                const rowSize: number = (rowLen + 3) & -4;
                const extraLen: number = rowSize - rowLen;
                const newData: Uint8Array = new Uint8Array(rowSize * height);
                let k: number = 0;
                for (let i: number = 0, ii: number = height * rowLen; i < ii; i += rowLen) {
                    const row: any = data.subarray(i, i + rowLen); // eslint-disable-line
                    for (let j: number = 0; j < rowLen; j += 3) {
                        newData[k++] = row[j + 2];
                        newData[k++] = row[j + 1];
                        newData[k++] = row[<number>j];
                    }
                    k += extraLen;
                }
                data = newData;
            } else {
                for (let i: number = 0, ii: number = data.length; i < ii; i += 3) {
                    const tmp: any = data[<number>i]; // eslint-disable-line
                    data[<number>i] = data[i + 2];
                    data[i + 2] = tmp;
                }
            }
            break;
        }
        case imageKind.rgba32BPP:
            bitPerPixel = 32;
            compression = 3;
            maskTable = new Uint8Array(
                4 + 4 + 4 + 4 + 52);
            view = new DataView(maskTable.buffer);
            if (_isLittleEndian()) {
                view.setUint32(0, 0x000000ff, true);
                view.setUint32(4, 0x0000ff00, true);
                view.setUint32(8, 0x00ff0000, true);
                view.setUint32(12, 0xff000000, true);
            } else {
                view.setUint32(0, 0xff000000, true);
                view.setUint32(4, 0x00ff0000, true);
                view.setUint32(8, 0x0000ff00, true);
                view.setUint32(12, 0x000000ff, true);
            }
            break;
        default:
            throw new Error('invalid format');
        }
        let i: number = 0;
        const headerLength: number = 40 + maskTable.length;
        const fileLength: number = 14 + headerLength + colorTable.length + data.length;
        const bmpData: Uint8Array = new Uint8Array(fileLength);
        view = new DataView(bmpData.buffer);
        view.setUint16(i, 0x4d42, true);
        i += 2;
        view.setUint32(i, fileLength, true);
        i += 4;
        view.setUint32(i, 0, true);
        i += 4;
        view.setUint32(i, 14 + headerLength + colorTable.length, true);
        i += 4;
        view.setUint32(i, headerLength, true);
        i += 4;
        view.setInt32(i, width, true);
        i += 4;
        view.setInt32(i, -height, true);
        i += 4;
        view.setUint16(i, 1, true);
        i += 2;
        view.setUint16(i, bitPerPixel, true);
        i += 2;
        view.setUint32(i, compression, true);
        i += 4;
        view.setUint32(i, 0, true);
        i += 4;
        view.setInt32(i, 0, true);
        i += 4;
        view.setInt32(i, 0, true);
        i += 4;
        view.setUint32(i, colorTable.length / 4, true);
        i += 4;
        view.setUint32(i, 0, true);
        i += 4;
        bmpData.set(maskTable, i);
        i += maskTable.length;
        bmpData.set(colorTable, i);
        i += colorTable.length;
        bmpData.set(data, i);
        return bmpData;
    }
}
