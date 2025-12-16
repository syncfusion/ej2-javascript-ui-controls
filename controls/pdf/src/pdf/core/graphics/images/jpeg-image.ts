import { _PdfDeviceCmykCS } from './colorspace';
import { _PdfColorSpaceUtils } from './colorspace-utils';
import { _readUnsignedInteger16, BaseException, _grayToRgba } from '../../utils';
class _PdfDoNotLoadMarkerError extends BaseException {
    scanLines: number;
    constructor(message: string, scanLines: number) {
        super(message, 'PDF do not load marker error');
        this.scanLines = scanLines;
    }
}
class _PdfEndOfImageMarkerError extends BaseException {
    constructor(msg: string) {
        super(msg, 'PDF end of image error');
    }
}
export class _PdfJpegImage {
    _dctZigZag: Uint8Array = new Uint8Array([
        0, 1,  8, 16,  9,  2, 3, 10, 17, 24, 32, 25, 18, 11, 4, 5, 12, 19, 26, 33, 40, 48, 41,
        34, 27, 20, 13,  6, 7, 14, 21, 28, 35, 42, 49, 56, 57, 50, 43, 36, 29, 22, 15, 23, 30, 37, 44,
        51, 58, 59, 52, 45, 38, 31, 39, 46, 53, 60, 61, 54, 47, 55, 62, 63]);
    _dctCos1: number = 4017;
    _dctSin1: number = 799;
    _dctCos3: number = 3406;
    _dctSin3: number = 2276;
    _dctCos6: number = 1567;
    _dctSin6: number = 3784;
    _dctSqrt2: number = 5793;
    _dctSqrt: number = 2896;
    _eobrun: number = 0;
    _spectralStart: number;
    _spectralEnd: number;
    _blockOffset: number;
    _successiveACState: number = 0;
    _successiveACNextValue: number = 0;
    _blockRow: number = 0;
    _decodeTransform: unknown;
    _colorTransform: number;
    _width: number;
    _height: number;
    _bitsCount: number = 0;
    _data: any; // eslint-disable-line
    _offset: number;
    _frame: any; // eslint-disable-line
    _parseMarker: boolean;
    _bitsData: any; // eslint-disable-line
    _jfif: any; // eslint-disable-line
    _adobe: any; // eslint-disable-line
    _components: any; // eslint-disable-line
    _numComponents: number;
    _colorSpace: _PdfColorSpaceUtils = new _PdfColorSpaceUtils();
    constructor() {
        this._colorTransform = -1;
        this._width = 0;
        this._height = 0;
        this._jfif = null;
        this._adobe = null;
        this._components = [];
        this._numComponents = 0;
    }
    _canUseImageDecoder(data: Uint8Array, colorTransform: number = -1): any { // eslint-disable-line
        let exifOffsets: any; // eslint-disable-line
        let offset: number = 0;
        let numComponents: number | null = null;
        let fileMarker: number = _readUnsignedInteger16(data, offset);
        offset += 2;
        if (fileMarker !== 0xffd8) {
            throw new Error('JPEG decoding error: Start Of Image (SOI) marker not found.');
        }
        fileMarker = _readUnsignedInteger16(data, offset);
        offset += 2;
        while (fileMarker !== 0xffd9) {
            switch (fileMarker) {
            case 0xffe1:
            {
                const { appData, oldOffset, newOffset } = this._readDataBlock(data, offset);
                offset = newOffset;
                if (appData[0] === 0x45 && appData[1] === 0x78 && appData[2] === 0x69 && appData[3] === 0x66 &&
                appData[4] === 0 && appData[5] === 0) {
                    if (exifOffsets) {
                        throw new Error('The JPEG image contains duplicate EXIF metadata blocks, which is invalid.');
                    }
                    exifOffsets = { exifStart: oldOffset + 6, exifEnd: newOffset };
                }
                fileMarker = _readUnsignedInteger16(data, offset);
                offset += 2;
                continue;
            }
            case 0xffc0:
            case 0xffc1:
            case 0xffc2:
                numComponents = data[offset + (2 + 1 + 2 + 2)];
                return;
            case 0xffff:
                if (data[<number>offset] !== 0xff) {
                    offset--;
                }
                break;
            }
            offset = this._skipData(data, offset);
            fileMarker = _readUnsignedInteger16(data, offset);
            offset += 2;
        }
        if (numComponents === 4) {
            return null;
        }
        if (numComponents === 3 && colorTransform === 0) {
            return null;
        }
        return exifOffsets || {};
    }
    public parse(data: Uint8Array, dnlScanLines?: number): void {
        let offset: number = 0;
        let jfif: any; // eslint-disable-line
        let adobe: any; // eslint-disable-line
        let frame: any; // eslint-disable-line
        let resetInterval: number | undefined;
        let numSOSMarkers: number = 0;
        const quantizationTables: Uint16Array[] = [];
        const huffmanTablesAC: any = []; // eslint-disable-line
        const huffmanTablesDC: any = []; // eslint-disable-line
        let parseMarker: boolean;
        let selectorsCount: number;
        let components: any[] = []; // eslint-disable-line
        let spectralStart: number;
        let spectralEnd: number;
        let successiveApproximation: number;
        let fileMarker: number = _readUnsignedInteger16(data, offset);
        let sofScanLines: number;
        let componentsCount: number;
        offset += 2;
        if (fileMarker !== 0xffd8) {
            throw new Error('JPEG Start Of Image (SOI) marker not found in input data.');
        }
        fileMarker = _readUnsignedInteger16(data, offset);
        offset += 2;
        let maxH: number;
        let maxV: number;
        while (fileMarker !== 0xffd9) {
            switch (fileMarker) {
            case 0xffe0:
            case 0xffe1:
            case 0xffe2:
            case 0xffe3:
            case 0xffe4:
            case 0xffe5:
            case 0xffe6:
            case 0xffe7:
            case 0xffe8:
            case 0xffe9:
            case 0xffea:
            case 0xffeb:
            case 0xffec:
            case 0xffed:
            case 0xffee:
            case 0xffef:
            case 0xfffe:
                {
                    const { appData, newOffset } = this._readDataBlock(data, offset);
                    offset = newOffset;
                    if (fileMarker === 0xffe0) {
                        if (appData[0] === 0x4a && appData[1] === 0x46 && appData[2] === 0x49 && appData[3] === 0x46 &&
                            appData[4] === 0) {
                            jfif = {
                                version: { major: appData[5], minor: appData[6] },
                                densityUnits: appData[7],
                                xDensity: (appData[8] << 8) | appData[9],
                                yDensity: (appData[10] << 8) | appData[11],
                                thumbWidth: appData[12],
                                thumbHeight: appData[13],
                                thumbData: appData.subarray(14, 14 + 3 * appData[12] * appData[13])
                            };
                        }
                    }
                    if (fileMarker === 0xffee) {
                        if (
                            appData[0] === 0x41 &&
                            appData[1] === 0x64 &&
                            appData[2] === 0x6f &&
                            appData[3] === 0x62 &&
                            appData[4] === 0x65
                        ) {
                            adobe = {
                                version: (appData[5] << 8) | appData[6],
                                flags0: (appData[7] << 8) | appData[8],
                                flags1: (appData[9] << 8) | appData[10],
                                transformCode: appData[11]
                            };
                        }
                    }
                }
                break;
            case 0xffdb:
                {
                    const quantizationTablesLength: number = _readUnsignedInteger16(data, offset);
                    offset += 2;
                    const quantizationTablesEnd: number = quantizationTablesLength + offset - 2;
                    let z: number;
                    while (offset < quantizationTablesEnd) {
                        const quantizationTableSpec: number = data[offset++];
                        const tableData: Uint16Array = new Uint16Array(64);
                        if (quantizationTableSpec >> 4 === 0) {
                            for (let j: number = 0; j < 64; j++) {
                                z = this._dctZigZag[<number>j];
                                tableData[<number>z] = data[offset++];
                            }
                        } else if (quantizationTableSpec >> 4 === 1) {
                            for (let j: number = 0; j < 64; j++) {
                                z = this._dctZigZag[<number>j];
                                tableData[<number>z] = _readUnsignedInteger16(data, offset);
                                offset += 2;
                            }
                        } else {
                            throw new Error('DQT Error: The provided JPEG quantization table specification is invalid or incomplete.');
                        }
                        quantizationTables[quantizationTableSpec & 15] = tableData;
                    }
                }
                break;
            case 0xffc0:
            case 0xffc1:
            case 0xffc2:
                if (frame) {
                    throw new Error('Only single-frame JPEG images are supported. ');
                }
                offset += 2;
                frame = {};
                frame.extended = fileMarker === 0xffc1;
                frame.progressive = fileMarker === 0xffc2;
                frame.precision = data[offset++];
                sofScanLines = _readUnsignedInteger16(data, offset);
                offset += 2;
                frame.scanLines = dnlScanLines || sofScanLines;
                frame.samplesPerLine = _readUnsignedInteger16(data, offset);
                offset += 2;
                frame.components = [];
                frame.componentIds = {};
                componentsCount = data[offset++];
                maxH = 0;
                maxV = 0;
                for (let i: number = 0; i < componentsCount; i++) {
                    const componentId: number = data[<number>offset];
                    const h: number = data[offset + 1] >> 4;
                    const v: number = data[offset + 1] & 15;
                    if (maxH < h) {
                        maxH = h;
                    }
                    if (maxV < v) {
                        maxV = v;
                    }
                    const qId: number = data[offset + 2];
                    const l: number = frame.components.push({
                        h,
                        v,
                        quantizationId: qId,
                        quantizationTable: null
                    });
                    frame.componentIds[<number>componentId] = l - 1;
                    offset += 3;
                }
                frame.maxH = maxH;
                frame.maxV = maxV;
                this._prepareComponents(frame);
                break;
            case 0xffc4:
                {
                    const huffmanLength: number = _readUnsignedInteger16(data, offset);
                    offset += 2;
                    for (let i: number = 2; i < huffmanLength;) {
                        const huffmanTableSpec: number = data[offset++];
                        const codeLengths: any = []; // eslint-disable-line
                        let codeLengthSum: number = 0;
                        for (let j: number = 0; j < 16; j++, offset++) {
                            codeLengthSum += codeLengths[<number>j] = data[<number>offset];
                        }
                        const huffmanValues: any = []; // eslint-disable-line
                        for (let j: number = 0; j < codeLengthSum; j++, offset++) {
                            huffmanValues[<number>j] = data[<number>offset];
                        }
                        i += 17 + codeLengthSum;
                        (huffmanTableSpec >> 4 === 0 ? huffmanTablesDC : huffmanTablesAC)[
                            huffmanTableSpec & 15
                        ] = this._buildHuffmanTable(codeLengths, huffmanValues);
                    }
                }
                break;
            case 0xffdd:
                offset += 2;
                resetInterval = _readUnsignedInteger16(data, offset);
                offset += 2;
                break;
            case 0xffda:
                parseMarker = ++numSOSMarkers === 1 && !dnlScanLines;
                offset += 2;
                selectorsCount = data[offset++];
                components = [];
                for (let i: number = 0; i < selectorsCount; i++) {
                    const index: number = data[offset++];
                    const componentIndex: number = frame.componentIds[<number>index];
                    const component: any = frame.components[componentIndex];  // eslint-disable-line
                    component.index = index;
                    const tableSpec: number = data[offset++];
                    component.huffmanTableDC = huffmanTablesDC[tableSpec >> 4];
                    component.huffmanTableAC = huffmanTablesAC[tableSpec & 15];
                    components.push(component);
                }
                spectralStart = data[offset++];
                spectralEnd = data[offset++];
                successiveApproximation = data[offset++];
                try {
                    const processed: number = this._decodeScan(
                        data,
                        offset,
                        frame,
                        components,
                        resetInterval,
                        spectralStart,
                        spectralEnd,
                        successiveApproximation >> 4,
                        successiveApproximation & 15,
                        parseMarker
                    );
                    offset += processed;
                } catch (ex) {
                    if (ex instanceof _PdfDoNotLoadMarkerError) {
                        return this.parse(data, ex.scanLines);
                    } else if (ex instanceof _PdfEndOfImageMarkerError) {
                        return;
                    }
                    throw ex;
                }
                break;
            case 0xffdc:
                offset += 4;
                break;
            case 0xffff:
                if (data[<number>offset] !== 0xff) {
                    offset--;
                }
                break;
            default:
                const nextFileMarker:any = this._findNextFileMarker( // eslint-disable-line
                    data,
                    offset - 2,
                    offset - 3
                );
                if (nextFileMarker && nextFileMarker.invalid) {
                    offset = nextFileMarker.offset;
                    break;
                }
                if (!nextFileMarker || offset >= data.length - 1) {
                    return;
                }
                throw new Error(
                    'JpegImage.parse - unknown JPEG marker encountered:' + fileMarker.toString(16)
                );
            }
            fileMarker = _readUnsignedInteger16(data, offset);
            offset += 2;
        }
        if (!frame) {
            throw new Error('JpegImage.parse - JPEG parse error: No frame data found in image stream.');
        }
        this._width = frame.samplesPerLine;
        this._height = frame.scanLines;
        this._jfif = jfif;
        this._adobe = adobe;
        this._components = [];
        for (const component of frame.components) {
            const quantizationTable: Uint16Array | undefined = quantizationTables[component.quantizationId];
            if (quantizationTable) {
                component.quantizationTable = quantizationTable;
            }
            this._components.push({
                index: component.index,
                output: this._buildComponentData(frame, component),
                scaleX: component.h / frame.maxH,
                scaleY: component.v / frame.maxV,
                blocksPerLine: component.blocksPerLine,
                blocksPerColumn: component.blocksPerColumn
            });
        }
        this._numComponents = this._components.length;
    }
    private _getLinearizedBlockData(width: number, height: number, isSourcePdf: boolean = false): Uint8ClampedArray {
        const scaleX: number = this._width / width;
        const scaleY: number = this._height / height;
        let component: any; // eslint-disable-line
        let componentScaleX: number;
        let componentScaleY: number;
        let blocksPerScanline: number;
        let x: number;
        let y: number;
        let i: number;
        let j: number;
        let k: number;
        let index: number;
        let offset: number = 0;
        let output: any; // eslint-disable-line
        const numComponents: number = this._components.length;
        const dataLength: number = width * height * numComponents;
        const data: Uint8ClampedArray = new Uint8ClampedArray(dataLength);
        const xScaleBlockOffset: Uint32Array = new Uint32Array(width);
        const mask3LSB: number = 0xfffffff8;
        let lastComponentScaleX: number;
        for (i = 0; i < numComponents; i++) {
            component = this._components[<number>i];
            componentScaleX = component.scaleX * scaleX;
            componentScaleY = component.scaleY * scaleY;
            offset = i;
            output = component.output;
            blocksPerScanline = (component.blocksPerLine + 1) << 3;
            if (componentScaleX !== lastComponentScaleX) {
                for (x = 0; x < width; x++) {
                    j = 0 | (x * componentScaleX);
                    xScaleBlockOffset[<number>x] = ((j & mask3LSB) << 3) | (j & 7);
                }
                lastComponentScaleX = componentScaleX;
            }
            for (y = 0; y < height; y++) {
                j = 0 | (y * componentScaleY);
                index = (blocksPerScanline * (j & mask3LSB)) | ((j & 7) << 3);
                for (x = 0; x < width; x++) {
                    data[<number>offset] = output[index + xScaleBlockOffset[<number>x]];
                    offset += numComponents;
                }
            }
        }
        let transform: any = this._decodeTransform; // eslint-disable-line
        if (!isSourcePdf && numComponents === 4 && !transform) {
            transform = new Int32Array([-256, 255, -256, 255, -256, 255, -256, 255]);
        }
        if (transform) {
            for (i = 0; i < dataLength;) {
                for (j = 0, k = 0; j < numComponents; j++, i++, k += 2) {
                    data[<number>i] = ((data[<number>i] *
                     transform[<number>k]) >> 8) + transform[k + 1];
                }
            }
        }
        return data;
    }
    private get _isColorConversionNeeded(): boolean {
        if (this._adobe) {
            return !!this._adobe.transformCode;
        }
        if (this._numComponents === 3) {
            if (this._colorTransform === 0) {
                return false;
            } else if (
                this._components[0].index === 0x52 &&
                this._components[1].index === 0x47 &&
                this._components[2].index === 0x42
            ) {
                return false;
            }
            return true;
        }
        if (this._colorTransform === 1) {
            return true;
        }
        return false;
    }
    private _convertYccToRgb(data: Uint8ClampedArray): Uint8ClampedArray {
        let Y: number;
        let Cb: number;
        let Cr: number;
        for (let i: number = 0, length: number = data.length; i < length; i += 3) {
            Y = data[<number>i];
            Cb = data[i + 1];
            Cr = data[i + 2];
            data[<number>i] = Y - 179.456 + 1.402 * Cr;
            data[i + 1] = Y + 135.459 - 0.344 * Cb - 0.714 * Cr;
            data[i + 2] = Y - 226.816 + 1.772 * Cb;
        }
        return data;
    }
    private _convertYccToRgba(data: Uint8ClampedArray, out: Uint8ClampedArray): Uint8ClampedArray {
        for (let i: number = 0, j: number = 0, length: number = data.length; i < length; i += 3, j += 4) {
            const Y: number = data[<number>i];
            const Cb: number = data[i + 1];
            const Cr: number = data[i + 2];
            out[<number>j] = Y - 179.456 + 1.402 * Cr;
            out[j + 1] = Y + 135.459 - 0.344 * Cb - 0.714 * Cr;
            out[j + 2] = Y - 226.816 + 1.772 * Cb;
            out[j + 3] = 255;
        }
        return out;
    }
    private _convertYcckToRgb(data: Uint8ClampedArray): Uint8ClampedArray {
        this._convertYcckToCmyk(data);
        return this._convertCmykToRgb(data);
    }
    private _convertYcckToRgba(data: Uint8ClampedArray): Uint8ClampedArray {
        this._convertYcckToCmyk(data);
        return this._convertCmykToRgba(data);
    }
    private _convertYcckToCmyk(data: Uint8ClampedArray): Uint8ClampedArray {
        let Y: number;
        let Cb: number;
        let Cr: number;
        for (let i: number = 0, length: number = data.length; i < length; i += 4) {
            Y = data[<number>i];
            Cb = data[i + 1];
            Cr = data[i + 2];
            data[<number>i] = 434.456 - Y - 1.402 * Cr;
            data[i + 1] = 119.541 - Y + 0.344 * Cb + 0.714 * Cr;
            data[i + 2] = 481.816 - Y - 1.772 * Cb;
        }
        return data;
    }
    private _convertCmykToRgb(data: Uint8ClampedArray): Uint8ClampedArray {
        const count: number = data.length / 4;
        this._colorSpace.cmyk._getRgbBuffer(data, 0, count, data, 0, 8, 0);
        return data.subarray(0, count * 3);
    }
    private _convertCmykToRgba(data: Uint8ClampedArray): Uint8ClampedArray {
        this._colorSpace.cmyk._getRgbBuffer(data, 0, data.length / 4, data, 0, 8, 1);
        if (this._colorSpace.cmyk instanceof _PdfDeviceCmykCS) {
            for (let i: number = 3, ii: number = data.length; i < ii; i += 4) {
                data[<number>i] = 255;
            }
        }
        return data;
    }
    _buildHuffmanTable(codeLengths: number[], values: number[]): any { // eslint-disable-line
        let k: number = 0;
        let i: number;
        let j: number;
        let length: number = 16;
        while (length > 0 && !codeLengths[length - 1]) {
            length--;
        }
        const code: any = [{ children: [], index: 0 }]; // eslint-disable-line
        let p: any = code[0]; // eslint-disable-line
        let q: any; // eslint-disable-line
        for (i = 0; i < length; i++) {
            for (j = 0; j < codeLengths[<number>i]; j++) {
                p = code.pop();
                p.children[p.index] = values[<number>k];
                while (p.index > 0) {
                    p = code.pop();
                }
                p.index++;
                code.push(p);
                while (code.length <= i) {
                    code.push((q = { children: [], index: 0 }));
                    p.children[p.index] = q.children;
                    p = q;
                }
                k++;
            }
            if (i + 1 < length) {
                code.push((q = { children: [], index: 0 }));
                p.children[p.index] = q.children;
                p = q;
            }
        }
        return code[0].children;
    }
    _getBlockBufferOffset(component: {
        blocksPerLine: number;
    }, row: number, col: number): number {
        return 64 * ((component.blocksPerLine + 1) * row + col);
    }
    _quantizeAndInverse(component: { quantizationTable: number[]; blockData: Int16Array; }, blockBufferOffset: number, p: Int16Array):
    void {
        const qt: number[] = component.quantizationTable;
        const blockData: Int16Array = component.blockData;
        let v0: number;
        let v1: number;
        let v2: number;
        let v3: number;
        let v4: number;
        let v5: number;
        let v6: number;
        let v7: number;
        let p0: number;
        let p1: number;
        let p2: number;
        let p3: number;
        let p4: number;
        let p5: number;
        let p6: number;
        let p7: number;
        let t: number;
        if (!qt) {
            throw new Error('Required quantization table is missing');
        }
        for (let row: number = 0; row < 64; row += 8) {
            p0 = blockData[blockBufferOffset + row];
            p1 = blockData[blockBufferOffset + row + 1];
            p2 = blockData[blockBufferOffset + row + 2];
            p3 = blockData[blockBufferOffset + row + 3];
            p4 = blockData[blockBufferOffset + row + 4];
            p5 = blockData[blockBufferOffset + row + 5];
            p6 = blockData[blockBufferOffset + row + 6];
            p7 = blockData[blockBufferOffset + row + 7];
            p0 *= qt[<number>row];
            if ((p1 | p2 | p3 | p4 | p5 | p6 | p7) === 0) {
                t = (this._dctSqrt2 * p0 + 512) >> 10;
                p[<number>row] = t;
                p[row + 1] = t;
                p[row + 2] = t;
                p[row + 3] = t;
                p[row + 4] = t;
                p[row + 5] = t;
                p[row + 6] = t;
                p[row + 7] = t;
                continue;
            }
            p1 *= qt[row + 1];
            p2 *= qt[row + 2];
            p3 *= qt[row + 3];
            p4 *= qt[row + 4];
            p5 *= qt[row + 5];
            p6 *= qt[row + 6];
            p7 *= qt[row + 7];
            v0 = (this._dctSqrt2 * p0 + 128) >> 8;
            v1 = (this._dctSqrt2 * p4 + 128) >> 8;
            v2 = p2;
            v3 = p6;
            v4 = (this._dctSqrt * (p1 - p7) + 128) >> 8;
            v7 = (this._dctSqrt * (p1 + p7) + 128) >> 8;
            v5 = p3 << 4;
            v6 = p5 << 4;
            v0 = (v0 + v1 + 1) >> 1;
            v1 = v0 - v1;
            t = (v2 * this._dctSin6 + v3 * this._dctCos6 + 128) >> 8;
            v2 = (v2 * this._dctCos6 - v3 * this._dctSin6 + 128) >> 8;
            v3 = t;
            v4 = (v4 + v6 + 1) >> 1;
            v6 = v4 - v6;
            v7 = (v7 + v5 + 1) >> 1;
            v5 = v7 - v5;
            v0 = (v0 + v3 + 1) >> 1;
            v3 = v0 - v3;
            v1 = (v1 + v2 + 1) >> 1;
            v2 = v1 - v2;
            t = (v4 * this._dctSin3 + v7 * this._dctCos3 + 2048) >> 12;
            v4 = (v4 * this._dctCos3 - v7 * this._dctSin3 + 2048) >> 12;
            v7 = t;
            t = (v5 * this._dctSin1 + v6 * this._dctCos1 + 2048) >> 12;
            v5 = (v5 * this._dctCos1 - v6 * this._dctSin1 + 2048) >> 12;
            v6 = t;
            p[<number>row] = v0 + v7;
            p[row + 7] = v0 - v7;
            p[row + 1] = v1 + v6;
            p[row + 6] = v1 - v6;
            p[row + 2] = v2 + v5;
            p[row + 5] = v2 - v5;
            p[row + 3] = v3 + v4;
            p[row + 4] = v3 - v4;
        }
        for (let col: number = 0; col < 8; ++col) {
            p0 = p[<number>col];
            p1 = p[col + 8];
            p2 = p[col + 16];
            p3 = p[col + 24];
            p4 = p[col + 32];
            p5 = p[col + 40];
            p6 = p[col + 48];
            p7 = p[col + 56];
            if ((p1 | p2 | p3 | p4 | p5 | p6 | p7) === 0) {
                t = (this._dctSqrt2 * p0 + 8192) >> 14;
                if (t < -2040) {
                    t = 0;
                } else if (t >= 2024) {
                    t = 255;
                } else {
                    t = (t + 2056) >> 4;
                }
                blockData[blockBufferOffset + col] = t;
                blockData[blockBufferOffset + col + 8] = t;
                blockData[blockBufferOffset + col + 16] = t;
                blockData[blockBufferOffset + col + 24] = t;
                blockData[blockBufferOffset + col + 32] = t;
                blockData[blockBufferOffset + col + 40] = t;
                blockData[blockBufferOffset + col + 48] = t;
                blockData[blockBufferOffset + col + 56] = t;
                continue;
            }
            v0 = (this._dctSqrt2 * p0 + 2048) >> 12;
            v1 = (this._dctSqrt2 * p4 + 2048) >> 12;
            v2 = p2;
            v3 = p6;
            v4 = (this._dctSqrt * (p1 - p7) + 2048) >> 12;
            v7 = (this._dctSqrt * (p1 + p7) + 2048) >> 12;
            v5 = p3;
            v6 = p5;
            v0 = ((v0 + v1 + 1) >> 1) + 4112;
            v1 = v0 - v1;
            t = (v2 * this._dctSin6 + v3 * this._dctCos6 + 2048) >> 12;
            v2 = (v2 * this._dctCos6 - v3 * this._dctSin6 + 2048) >> 12;
            v3 = t;
            v4 = (v4 + v6 + 1) >> 1;
            v6 = v4 - v6;
            v7 = (v7 + v5 + 1) >> 1;
            v5 = v7 - v5;
            v0 = (v0 + v3 + 1) >> 1;
            v3 = v0 - v3;
            v1 = (v1 + v2 + 1) >> 1;
            v2 = v1 - v2;
            t = (v4 * this._dctSin3 + v7 * this._dctCos3 + 2048) >> 12;
            v4 = (v4 * this._dctCos3 - v7 * this._dctSin3 + 2048) >> 12;
            v7 = t;
            t = (v5 * this._dctSin1 + v6 * this._dctCos1 + 2048) >> 12;
            v5 = (v5 * this._dctCos1 - v6 * this._dctSin1 + 2048) >> 12;
            v6 = t;
            p0 = v0 + v7;
            p7 = v0 - v7;
            p1 = v1 + v6;
            p6 = v1 - v6;
            p2 = v2 + v5;
            p5 = v2 - v5;
            p3 = v3 + v4;
            p4 = v3 - v4;
            if (p0 < 16) {
                p0 = 0;
            } else if (p0 >= 4080) {
                p0 = 255;
            } else {
                p0 >>= 4;
            }
            if (p1 < 16) {
                p1 = 0;
            } else if (p1 >= 4080) {
                p1 = 255;
            } else {
                p1 >>= 4;
            }
            if (p2 < 16) {
                p2 = 0;
            } else if (p2 >= 4080) {
                p2 = 255;
            } else {
                p2 >>= 4;
            }
            if (p3 < 16) {
                p3 = 0;
            } else if (p3 >= 4080) {
                p3 = 255;
            } else {
                p3 >>= 4;
            }
            if (p4 < 16) {
                p4 = 0;
            } else if (p4 >= 4080) {
                p4 = 255;
            } else {
                p4 >>= 4;
            }
            if (p5 < 16) {
                p5 = 0;
            } else if (p5 >= 4080) {
                p5 = 255;
            } else {
                p5 >>= 4;
            }
            if (p6 < 16) {
                p6 = 0;
            } else if (p6 >= 4080) {
                p6 = 255;
            } else {
                p6 >>= 4;
            }
            if (p7 < 16) {
                p7 = 0;
            } else if (p7 >= 4080) {
                p7 = 255;
            } else {
                p7 >>= 4;
            }
            blockData[blockBufferOffset + col] = p0;
            blockData[blockBufferOffset + col + 8] = p1;
            blockData[blockBufferOffset + col + 16] = p2;
            blockData[blockBufferOffset + col + 24] = p3;
            blockData[blockBufferOffset + col + 32] = p4;
            blockData[blockBufferOffset + col + 40] = p5;
            blockData[blockBufferOffset + col + 48] = p6;
            blockData[blockBufferOffset + col + 56] = p7;
        }
    }
    _buildComponentData(frame: { blocksPerLine: number; blocksPerColumn: number; blockData: Int8Array; }, component: any): Int8Array { // eslint-disable-line
        const blocksPerLine: number = component.blocksPerLine;
        const blocksPerColumn: number = component.blocksPerColumn;
        const computationBuffer: Int16Array = new Int16Array(64);
        for (let blockRow: number = 0; blockRow < blocksPerColumn; blockRow++) {
            for (let blockCol: number = 0; blockCol < blocksPerLine; blockCol++) {
                const offset: number = this._getBlockBufferOffset(component, blockRow, blockCol);
                this._quantizeAndInverse(component, offset, computationBuffer);
            }
        }
        return component.blockData;
    }
    _findNextFileMarker(data: Uint8Array, currentPos: number, startPos: number = currentPos): { invalid: string | null;
        marker: number; offset: number } | null {
        const maxPos: number = data.length - 1;
        let newPos: number = startPos < currentPos ? startPos : currentPos;
        if (currentPos >= maxPos) {
            return null;
        }
        const currentMarker: number = _readUnsignedInteger16(data, currentPos);
        if (currentMarker >= 0xffc0 && currentMarker <= 0xfffe) {
            return { invalid: null, marker: currentMarker, offset: currentPos};
        }
        let newMarker: number = _readUnsignedInteger16(data, newPos);
        while (!(newMarker >= 0xffc0 && newMarker <= 0xfffe)) {
            if (++newPos >= maxPos) {
                return null;
            }
            newMarker = _readUnsignedInteger16(data, newPos);
        }
        return {invalid: currentMarker.toString(16), marker: newMarker, offset: newPos};
    }
    _prepareComponents(frame: any): void { // eslint-disable-line
        const mcusPerLine: number = Math.ceil(frame.samplesPerLine / 8 / frame.maxH);
        const mcusPerColumn: number = Math.ceil(frame.scanLines / 8 / frame.maxV);
        for (const component of frame.components) {
            const blocksPerLine: number = Math.ceil(
                (Math.ceil(frame.samplesPerLine / 8) * component.h) / frame.maxH
            );
            const blocksPerColumn: number = Math.ceil(
                (Math.ceil(frame.scanLines / 8) * component.v) / frame.maxV
            );
            const blocksPerLineForMcu: number = mcusPerLine * component.h;
            const blocksPerColumnForMcu: number = mcusPerColumn * component.v;
            const blocksBufferSize: number =
                64 * blocksPerColumnForMcu * (blocksPerLineForMcu + 1);
            component.blockData = new Int16Array(blocksBufferSize);
            component.blocksPerLine = blocksPerLine;
            component.blocksPerColumn = blocksPerColumn;
        }
        frame.mcusPerLine = mcusPerLine;
        frame.mcusPerColumn = mcusPerColumn;
    }
    _readDataBlock(data: Uint8Array, offset: number): { appData: Uint8Array; oldOffset: number; newOffset: number } {
        const length: number = _readUnsignedInteger16(data, offset);
        offset += 2;
        let endOffset: number = offset + length - 2;
        const fileMarker: any = this._findNextFileMarker(data, endOffset, offset); // eslint-disable-line
        if (fileMarker && fileMarker.invalid) {
            endOffset = fileMarker.offset;
        }
        const array: Uint8Array = data.subarray(offset, endOffset);
        return {appData: array, oldOffset: offset, newOffset: offset + array.length};
    }
    _skipData(data: Uint8Array, offset: number): number {
        const length: number = _readUnsignedInteger16(data, offset);
        offset += 2;
        const endOffset: number = offset + length - 2;
        const fileMarker: any = this._findNextFileMarker(data, endOffset, offset); // eslint-disable-line       
        if (fileMarker && fileMarker.invalid) {
            return fileMarker.offset;
        }
        return endOffset;
    }
    _getData(width: number, height: number, forceRgba: boolean, forceRgb: boolean, isSourcePdf: boolean): Uint8ClampedArray | Uint8Array {
        if (this._numComponents > 4) {
            throw new Error('JPEG decoding error: Encountered an unsupported color mode in the image.');
        }
        const data: any = this._getLinearizedBlockData(width, height, isSourcePdf); // eslint-disable-line
        if (this._numComponents === 1 && (forceRgba || forceRgb)) {
            const len: number = data.length * (forceRgba ? 4 : 3);
            const rgbaData: Uint8ClampedArray = new Uint8ClampedArray(len);
            let offset: number = 0;
            if (forceRgba) {
                _grayToRgba(data, new Uint32Array(rgbaData.buffer));
            } else {
                for (const grayColor of data) {
                    rgbaData[offset++] = grayColor;
                    rgbaData[offset++] = grayColor;
                    rgbaData[offset++] = grayColor;
                }
            }
            return rgbaData;
        } else if (this._numComponents === 3 && this._isColorConversionNeeded) {
            if (forceRgba) {
                const rgbaData: Uint8ClampedArray = new Uint8ClampedArray((data.length / 3) * 4);
                return this._convertYccToRgba(data, rgbaData);
            }
            return this._convertYccToRgb(data);
        } else if (this._numComponents === 4) {
            if (this._isColorConversionNeeded) {
                if (forceRgba) {
                    return this._convertYcckToRgba(data);
                }
                if (forceRgb) {
                    return this._convertYcckToRgb(data);
                }
                return this._convertYcckToCmyk(data);
            } else if (forceRgba) {
                return this._convertCmykToRgba(data);
            } else if (forceRgb) {
                return this._convertCmykToRgb(data);
            }
        }
        return data;
    }
    _decodeHuffman(tree: any): number { // eslint-disable-line
        let node: any = tree; // eslint-disable-line
        while (true) { // eslint-disable-line
            node = node[this._readBit()];
            switch (typeof node) {
            case 'number':
                return node;
            case 'object':
                continue;
            }
            throw new Error('JPEG decoding error: The image contains an invalid Huffman sequence.');
        }
    }
    _receive(length: number): number {
        let n: number = 0;
        while (length > 0) {
            n = (n << 1) | this._readBit();
            length--;
        }
        return n;
    }
    _receiveAndExtend(length: number): number {
        if (length === 1) {
            return this._readBit() === 1 ? 1 : -1;
        }
        const n: number = this._receive(length);
        if (n >= 1 << (length - 1)) {
            return n;
        }
        return n + (-1 << length) + 1;
    }
    _decodeBaseline(component: any, blockOffset: number): any { // eslint-disable-line
        const t: number = this._decodeHuffman(component.huffmanTableDC);
        const diff: number = t === 0 ? 0 : this._receiveAndExtend(t);
        component.blockData[<number>blockOffset] = component.pred += diff;
        let k: number = 1;
        while (k < 64) {
            const rs: number = this._decodeHuffman(component.huffmanTableAC);
            const s: number = rs & 15;
            const r: number = rs >> 4;
            if (s === 0) {
                if (r < 15) {
                    break;
                }
                k += 16;
                continue;
            }
            k += r;
            const z: number = this._dctZigZag[<number>k];
            component.blockData[blockOffset + z] = this._receiveAndExtend(s);
            k++;
        }
    }
    _decodeDCFirst(component: { huffmanTableDC: any; blockData: number[]; pred: number; }, blockOffset: number, successive: any): any { // eslint-disable-line
        const t: number = this._decodeHuffman(component.huffmanTableDC);
        const diff: number = t === 0 ? 0 : this._receiveAndExtend(t) << successive;
        component.blockData[<number>blockOffset] = component.pred += diff;
    }
    _decodeDCSuccessive(component: { blockData: number[]; }, blockOffset: number, successive: any): void { // eslint-disable-line
        component.blockData[<number>blockOffset] |= this._readBit() << successive;
    }
    _decodeACFirst(component: { huffmanTableAC: any; blockData: number[]; }, blockOffset: number, successive: any): any { // eslint-disable-line
        if (this._eobrun > 0) {
            this._eobrun--;
            return;
        }
        let k: number = this._spectralStart;
        const e: number = this._spectralEnd;
        while (k <= e) {
            const rs: number = this._decodeHuffman(component.huffmanTableAC);
            const s: number = rs & 15;
            const r: number = rs >> 4;
            if (s === 0) {
                if (r < 15) {
                    this._eobrun = this._receive(r) + (1 << r) - 1;
                    break;
                }
                k += 16;
                continue;
            }
            k += r;
            const z: number = this._dctZigZag[<number>k];
            component.blockData[blockOffset + z] = this._receiveAndExtend(s) * (1 << successive);
            k++;
        }
    }
    _decodeMcu(component: any, decode: (component: any, blockOffset: number) => void, mcu: number, row: number, col: number, mcusPerLine: any): void { // eslint-disable-line
        const mcuRow: number = (mcu / mcusPerLine) | 0;
        const mcuCol: number = mcu % mcusPerLine;
        this._blockRow = mcuRow * component.v + row;
        const blockCol: number = mcuCol * component.h + col;
        const blockOffset: number = this._getBlockBufferOffset(component, this._blockRow, blockCol);
        decode(component, blockOffset);
    }
    _decodeBlock(component: { blocksPerLine: number; }, _decode: (component: any, blockOffset: number) => void, mcu: number): void { // eslint-disable-line
        this._blockRow = (mcu / component.blocksPerLine) | 0;
        const blockCol: number = mcu % component.blocksPerLine;
        const blockOffset: number = this._getBlockBufferOffset(component, this._blockRow, blockCol);
        _decode(component, blockOffset);
    }
    _decodeACSuccessive(component: { blockData: number[]; huffmanTableAC: any;}, blockOffset: number, successive: any): void { // eslint-disable-line
        let k: number = this._spectralStart;
        const e: number = this._spectralEnd;
        let r: number = 0;
        let s: number;
        let rs: number;
        while (k <= e) {
            const offsetZ: number = blockOffset + this._dctZigZag[<number>k];
            const sign: number = component.blockData[<number>offsetZ] < 0 ? -1 : 1;
            switch (this._successiveACState) {
            case 0:
                rs = this._decodeHuffman(component.huffmanTableAC);
                s = rs & 15;
                r = rs >> 4;
                if (s === 0) {
                    if (r < 15) {
                        this._eobrun = this._receive(r) + (1 << r);
                        this._successiveACState = 4;
                    } else {
                        r = 16;
                        this._successiveACState = 1;
                    }
                } else {
                    if (s !== 1) {
                        throw new Error('Invalid ACn encoding: expected valid ACn data format but received unsupported input.');
                    }
                    this._successiveACNextValue = this._receiveAndExtend(s);
                    this._successiveACState = r ? 2 : 3;
                }
                continue;
            case 1:
            case 2:
                if (component.blockData[<number>offsetZ]) {
                    component.blockData[<number>offsetZ] += sign * (this._readBit() << successive);
                } else {
                    r--;
                    if (r === 0) {
                        this._successiveACState = this._successiveACState === 2 ? 3 : 0;
                    }
                }
                break;
            case 3:
                if (component.blockData[<number>this._offset]) {
                    component.blockData[<number>this._offset] += sign * (this._readBit() << successive);
                } else {
                    component.blockData[<number>this._offset] = this._successiveACNextValue << successive;
                    this._successiveACState = 0;
                }
                break;
            case 4:
                if (component.blockData[<number>this._offset]) {
                    component.blockData[<number>this._offset] += sign * (this._readBit() << successive);
                }
                break;
            }
            k++;
        }
        if (this._successiveACState === 4) {
            this._eobrun--;
            if (this._eobrun === 0) {
                this._successiveACState = 0;
            }
        }
    }
    _decodeScan(data: Uint8Array, offset: number, frame: any, components: any, resetInterval: any,  // eslint-disable-line
                spectralStart: number, spectralEnd: number, successivePrev: any, successive: any, // eslint-disable-line
                parseMarker: boolean = false): number {
        const mcusPerLine: number = frame.mcusPerLine;
        const progressive: boolean = frame.progressive;
        const startOffset: number = offset;
        this._bitsData = 0;
        const componentsLength: number = components.length;
        let component: any; // eslint-disable-line
        let i: number;
        let j: number;
        let k: number;
        let n: number;
        this._data = data;
        this._offset = offset;
        this._frame = frame;
        this._bitsCount = 0;
        this._parseMarker = parseMarker;
        this._spectralStart = spectralStart;
        this._spectralEnd = spectralEnd;
        this._blockOffset = 0;
        let decodeFn: (component: any, blockOffset: number, ...args: any[]) => any; // eslint-disable-line
        if (progressive) {
            if (spectralStart === 0) {
                decodeFn = (component: any, blockOffset: number) => { // eslint-disable-line
                    return successivePrev === 0
                        ? this._decodeDCFirst(component, blockOffset, successive)
                        : this._decodeDCSuccessive(component, blockOffset, successive);
                };
            } else {
                decodeFn = (component: any, blockOffset: number) => { // eslint-disable-line
                    return successivePrev === 0
                        ? this._decodeACFirst(component, blockOffset, successive)
                        : this._decodeACSuccessive(component, blockOffset, successive);
                };
            }
        } else {
            decodeFn = (component: any, blockOffset: number) => { // eslint-disable-line
                return this._decodeBaseline(component, blockOffset);
            };
        }
        let mcu: number = 0;
        let fileMarker: any; // eslint-disable-line
        const mcuExpected: number =
            componentsLength === 1
                ? components[0].blocksPerLine * components[0].blocksPerColumn
                : mcusPerLine * frame.mcusPerColumn;
        let h: number;
        let v: number;
        while (mcu <= mcuExpected) {
            // reset interval stuff
            const mcuToRead: number = resetInterval
                ? Math.min(mcuExpected - mcu, resetInterval)
                : mcuExpected;
            if (mcuToRead > 0) {
                for (i = 0; i < componentsLength; i++) {
                    components[<number>i].pred = 0;
                }
                this._eobrun = 0;
                if (componentsLength === 1) {
                    component = components[0];
                    for (n = 0; n < mcuToRead; n++) {
                        this._decodeBlock(component, decodeFn, mcu);
                        mcu++;
                    }
                } else {
                    for (n = 0; n < mcuToRead; n++) {
                        for (i = 0; i < componentsLength; i++) {
                            component = components[<number>i];
                            h = component.h;
                            v = component.v;
                            for (j = 0; j < v; j++) {
                                for (k = 0; k < h; k++) {
                                    this._decodeMcu(component, decodeFn, mcu, j, k, mcusPerLine);
                                }
                            }
                        }
                        mcu++;
                    }
                }
            }
            this._bitsCount = 0;
            fileMarker = this._findNextFileMarker(data, this._offset);
            if (!fileMarker) {
                break;
            }
            if (fileMarker.invalid) {
                this._offset = fileMarker.offset;
            }
            if (fileMarker.marker >= 0xffd0 && fileMarker.marker <= 0xffd7) {
                this._offset += 2;
            } else {
                break;
            }
        }
        return this._offset - startOffset;
    }
    _readBit(): number {
        if (this._bitsCount > 0) {
            this._bitsCount--;
            return (this._bitsData >> this._bitsCount) & 1;
        }
        this._bitsData = this._data[this._offset++];
        if (this._bitsData === 0xff) {
            const nextByte: number = this._data[this._offset++];
            if (nextByte) {
                if (nextByte === 0xdc && this._parseMarker) {
                    this._offset += 2;
                    const scanLines: number = _readUnsignedInteger16(this._data, this._offset);
                    this._offset += 2;
                    if (scanLines > 0 && scanLines !== this._frame.scanLines) {
                        throw new _PdfDoNotLoadMarkerError(
                            'Found DNL marker (0xFFDC) while parsing scan data',
                            scanLines
                        );
                    }
                } else if (nextByte === 0xd9) {
                    if (this._parseMarker) {
                        const maybeScanLines: number = this._blockRow * (this._frame.precision === 8 ? 8 : 0);
                        if (
                            maybeScanLines > 0 &&
                            Math.round(this._frame.scanLines / maybeScanLines) >= 5
                        ) {
                            throw new _PdfDoNotLoadMarkerError(
                                'Found EOI marker (0xFFD9) while parsing scan data, ' +
                                'possibly caused by incorrect `scanLines` parameter',
                                maybeScanLines
                            );
                        }
                    }
                    throw new _PdfEndOfImageMarkerError(
                        'Found EOI marker (0xFFD9) while parsing scan data'
                    );
                }
                throw new Error(
                    `Unexpected marker encountered: ${((this._bitsData << 8) | nextByte).toString(16)}`
                );
            }
        }
        this._bitsCount = 7;
        return this._bitsData >>> 7;
    }
}
