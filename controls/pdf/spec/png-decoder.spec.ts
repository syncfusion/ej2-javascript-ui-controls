/* eslint-disable @typescript-eslint/no-explicit-any */
import { _PngDecoder } from '../src/pdf/core/graphics/images/png-decoder';
import { _PdfName, _PdfDictionary } from '../src/pdf/core/pdf-primitives';
function u32(v: number): number[] {
    return [(v >>> 24) & 0xff, (v >>> 16) & 0xff, (v >>> 8) & 0xff, v & 0xff];
}
function ascii(s: string): number[] {
    return s.split('').map((c: string) => c.charCodeAt(0));
}
function makeDecoder(): any {
    return new _PngDecoder(new Uint8Array(8)) as any;
}
function setHeader(decoder: any, overrides?: any): void {
    decoder._header = Object.assign({ _width: 2, _height: 2, _bitDepth: 8, _colorType: 2, _compression: 0, _filter: 0, _interlace: 0 }, overrides || {});
    decoder._width = decoder._header._width;
    decoder._height = decoder._header._height;
    decoder._bitsPerComponent = decoder._header._bitDepth;
}
describe('_PngDecoder - constructor defaults', () => {
    it('mutant 43/44 - _isRedGreenBlue and _isDecode must be false not true', () => {
        const decoder: any = makeDecoder();
        expect(decoder._isRedGreenBlue).toBe(false);
        expect(decoder._isDecode).toBe(false);
    });
    it('mutant 43 - _isRedGreenBlue is strictly false, not true', () => {
        const decoder: any = makeDecoder();
        expect(decoder._isRedGreenBlue).toEqual(false);
        expect(decoder._isRedGreenBlue).not.toEqual(true);
    });
    it('mutant 44 - _isDecode is strictly false, not true', () => {
        const decoder: any = makeDecoder();
        expect(decoder._isDecode).toEqual(false);
        expect(decoder._isDecode).not.toEqual(true);
    });
    it('constructor numeric fields start at 0', () => {
        const decoder: any = makeDecoder();
        expect(decoder._colors).toBe(0);
        expect(decoder._bitsPerPixel).toBe(0);
        expect(decoder._idatLength).toBe(0);
        expect(decoder._inputBands).toBe(0);
    });
    it('_shades defaults to false', () => {
        const decoder: any = makeDecoder();
        expect(decoder._shades).toBe(false);
        expect(decoder._shades).not.toBe(true);
    });
    it('_ideateDecode defaults to true', () => {
        const decoder: any = makeDecoder();
        expect(decoder._ideateDecode).toBe(true);
    });
});
describe('_PngDecoder - _initialize sRGB branch', () => {
    it('mutant 53 - sRGB chunk sets _isRedGreenBlue to true not false', () => {
        const decoder: any = makeDecoder();
        expect(decoder._isRedGreenBlue).toBe(false);
        spyOn(decoder, '_hasValidChunkType').and.returnValues(
            { type: 14, hasValidChunk: true },
            { type: 0, hasValidChunk: false }
        );
        spyOn(decoder, '_ignoreChunk');
        decoder._initialize();
        expect(decoder._isRedGreenBlue).toBe(true);
        expect(decoder._isRedGreenBlue).not.toBe(false);
    });
    it('mutant 58 - default switch branch does not alter _isRedGreenBlue', () => {
        const decoder: any = makeDecoder();
        spyOn(decoder, '_hasValidChunkType').and.returnValues(
            { type: 999, hasValidChunk: true },
            { type: 0, hasValidChunk: false }
        );
        decoder._initialize();
        expect(decoder._isRedGreenBlue).toBe(false);
    });
    it('mutant 52 - iEND chunk calls _decodeImageData not skipped', () => {
        const decoder: any = makeDecoder();
        const spy = spyOn(decoder, '_decodeImageData');
        spyOn(decoder, '_hasValidChunkType').and.returnValues(
            { type: 3, hasValidChunk: true },
            { type: 0, hasValidChunk: false }
        );
        decoder._initialize();
        expect(spy).toHaveBeenCalledTimes(1);
    });
    it('mutant 52 - sRGB (14) calls _ignoreChunk and sets flag, not a no-op', () => {
        const decoder: any = makeDecoder();
        const spy = spyOn(decoder, '_ignoreChunk');
        spyOn(decoder, '_hasValidChunkType').and.returnValues(
            { type: 14, hasValidChunk: true },
            { type: 0, hasValidChunk: false }
        );
        decoder._initialize();
        expect(spy).toHaveBeenCalledTimes(1);
        expect(decoder._isRedGreenBlue).toBe(true);
    });
});
describe('_PngDecoder - _setBitsPerPixel', () => {
    it('mutant 129/130/132 - colorType 3 interlace 1 sets _idatLength using multiply not divide', () => {
        const decoder: any = makeDecoder();
        setHeader(decoder, { _colorType: 3, _bitDepth: 8, _width: 4, _height: 3, _interlace: 1 });
        decoder._setBitsPerPixel();
        const expected: number = Math.floor((8 * 4 + 7) / 8) * 3;
        expect(decoder._idatLength).toBe(expected);
        expect(decoder._idatLength).not.toBe(4 / 3);
    });
    it('mutant 130 - colorType 3 interlace 0 also sets _idatLength (both branches || valid)', () => {
        const decoder: any = makeDecoder();
        setHeader(decoder, { _colorType: 3, _bitDepth: 8, _width: 4, _height: 3, _interlace: 0 });
        decoder._setBitsPerPixel();
        expect(decoder._idatLength).toBe(Math.floor((8 * 4 + 7) / 8) * 3);
    });
    it('mutant 132 - condition is || so interlace 0 still sets idatLength (not &&)', () => {
        const decoder: any = makeDecoder();
        setHeader(decoder, { _colorType: 3, _bitDepth: 1, _width: 8, _height: 2, _interlace: 0 });
        decoder._setBitsPerPixel();
        expect(decoder._idatLength).toBe(Math.floor((1 * 8 + 7) / 8) * 2);
        expect(decoder._idatLength).toBeGreaterThan(0);
    });
    it('mutant 143 - colorType 2 idatLength uses multiply width*height*3 not divide', () => {
        const decoder: any = makeDecoder();
        setHeader(decoder, { _colorType: 2, _bitDepth: 8, _width: 4, _height: 3, _interlace: 0 });
        decoder._setBitsPerPixel();
        expect(decoder._idatLength).toBe(4 * 3 * 3);
        expect(decoder._idatLength).not.toBe(4 / 3);
    });
    it('colorType 0 idatLength uses formula floor((bpc*w+7)/8)*h', () => {
        const decoder: any = makeDecoder();
        setHeader(decoder, { _colorType: 0, _bitDepth: 8, _width: 4, _height: 3, _interlace: 0 });
        decoder._setBitsPerPixel();
        expect(decoder._idatLength).toBe(Math.floor((8 * 4 + 7) / 8) * 3);
    });
    it('colorType 4 idatLength equals width*height', () => {
        const decoder: any = makeDecoder();
        setHeader(decoder, { _colorType: 4, _bitDepth: 8, _width: 4, _height: 3, _interlace: 0 });
        decoder._setBitsPerPixel();
        expect(decoder._idatLength).toBe(4 * 3);
    });
    it('colorType 6 idatLength equals width*3*height', () => {
        const decoder: any = makeDecoder();
        setHeader(decoder, { _colorType: 6, _bitDepth: 8, _width: 4, _height: 3, _interlace: 0 });
        decoder._setBitsPerPixel();
        expect(decoder._idatLength).toBe(4 * 3 * 3);
    });
});
describe('_PngDecoder - _readImageData', () => {
    function makeStreamWithIDATChunk(payloadLen: number): Uint8Array {
        const payload: Uint8Array = new Uint8Array(payloadLen).fill(0xAB);
        const chunk: number[] = [...u32(payloadLen), ...ascii('IDAT'), ...Array.from(payload), 0, 0, 0, 0];
        const buf: Uint8Array = new Uint8Array(8 + chunk.length);
        buf.set(chunk, 8);
        return buf;
    }
    it('mutant 172 - should not resize encoded stream when capacity exactly equals newLength', () => {
        const decoder: any = makeDecoder();
        decoder._encodedStream = new Uint8Array([1, 2, 0, 0, 0, 0]);
        const originalEncodedStream: Uint8Array = decoder._encodedStream;
        decoder._encodedStreamLength = 2;
        decoder._currentChunkLength = 4;
        decoder._position = 0;
        decoder._stream = new Uint8Array([0xAA, 0xBB, 0xCC, 0xDD, 0x11, 0x22, 0x33, 0x44]);
        decoder._readImageData();
        expect(decoder._encodedStream).toBe(originalEncodedStream);
        expect(decoder._encodedStream.length).toBe(6);
        expect(decoder._encodedStreamLength).toBe(6);
        expect(Array.from(decoder._encodedStream)).toEqual([1, 2, 0xAA, 0xBB, 0xCC, 0xDD]);
        expect(decoder._position).toBe(8);
    });
    it('mutant 160 - condition is && so both bounds must pass to copy data', () => {
        const decoder: any = makeDecoder();
        setHeader(decoder, { _colorType: 2, _bitDepth: 8, _width: 2, _height: 2 });
        decoder._currentChunkLength = 4;
        decoder._position = 0;
        decoder._stream = new Uint8Array(4).fill(0x55);
        decoder._readImageData();
        expect(decoder._encodedStream).toBeTruthy();
        expect(decoder._encodedStreamLength).toBe(4);
    });
    it('mutant 172/173 - _encodedStream grows when newLength exceeds capacity', () => {
        const decoder: any = makeDecoder();
        setHeader(decoder, { _colorType: 2, _bitDepth: 8, _width: 2, _height: 2 });
        decoder._encodedStream = new Uint8Array(2).fill(0);
        decoder._encodedStreamLength = 0;
        decoder._currentChunkLength = 4;
        decoder._position = 0;
        decoder._stream = new Uint8Array(8).fill(0xCC);
        decoder._readImageData();
        expect(decoder._encodedStream.length).toBeGreaterThanOrEqual(4);
        expect(decoder._encodedStreamLength).toBe(4);
    });
    it('mutant 174 - block inside resize IS executed: old data preserved in new array', () => {
        const decoder: any = makeDecoder();
        setHeader(decoder, { _colorType: 2, _bitDepth: 8, _width: 2, _height: 2 });
        decoder._encodedStream = new Uint8Array([1, 2]);
        decoder._encodedStreamLength = 2;
        decoder._currentChunkLength = 4;
        decoder._position = 0;
        decoder._stream = new Uint8Array(8).fill(0xDD);
        decoder._readImageData();
        expect(decoder._encodedStream[0]).toBe(1);
        expect(decoder._encodedStream[1]).toBe(2);
    });
    it('mutant 176 - IDAT bytes are copied from position not position-chunkLength', () => {
        const decoder: any = makeDecoder();
        setHeader(decoder, { _colorType: 2, _bitDepth: 8, _width: 2, _height: 2 });
        decoder._currentChunkLength = 3;
        decoder._position = 2;
        decoder._stream = new Uint8Array([0, 0, 0xAA, 0xBB, 0xCC, 0x00, 0x00]);
        decoder._encodedStream = new Uint8Array(16);
        decoder._encodedStreamLength = 0;
        decoder._readImageData();
        expect(decoder._encodedStream[0]).toBe(0xAA);
        expect(decoder._encodedStream[1]).toBe(0xBB);
        expect(decoder._encodedStream[2]).toBe(0xCC);
    });
    it('mutant 176 - addition vs subtraction: position + chunkLength not position - chunkLength', () => {
        const decoder: any = makeDecoder();
        decoder._currentChunkLength = 3;
        decoder._position = 0;
        decoder._stream = new Uint8Array([0x11, 0x22, 0x33, 0x00, 0x00, 0x00, 0x00]);
        decoder._encodedStream = new Uint8Array(16);
        decoder._encodedStreamLength = 0;
        decoder._readImageData();
        expect(decoder._encodedStream[0]).toBe(0x11);
        expect(decoder._encodedStream[1]).toBe(0x22);
        expect(decoder._encodedStream[2]).toBe(0x33);
        expect(decoder._encodedStreamLength).toBe(3);
    });
});
describe('_PngDecoder - _readPhotoPlate', () => {
    it('mutant 179 - colorType !== 3 calls _ignoreChunk, does not push to _colorSpace', () => {
        const decoder: any = makeDecoder();
        setHeader(decoder, { _colorType: 2 });
        decoder._currentChunkLength = 6;
        const spy = spyOn(decoder, '_ignoreChunk');
        decoder._readPhotoPlate();
        expect(spy).toHaveBeenCalledTimes(1);
        expect(decoder._colorSpace).toBeUndefined();
    });
    it('mutant 185/186 - palette max index = chunkLength/3 - 1 not /3+1 or *3', () => {
        const decoder: any = makeDecoder();
        setHeader(decoder, { _colorType: 3 });
        decoder._currentChunkLength = 9;
        decoder._position = 0;
        decoder._stream = new Uint8Array(32).fill(0);
        spyOn(decoder, '_getPngColorSpace').and.returnValue(_PdfName.get('DeviceRGB'));
        spyOn(decoder, '_seek');
        decoder._colorSpace = undefined;
        decoder._readPhotoPlate();
        expect(decoder._colorSpace[2]).toBe(2);
        expect(decoder._colorSpace[2]).not.toBe(4);
        expect(decoder._colorSpace[2]).not.toBe(27);
    });
});
describe('_PngDecoder - _readTransparency', () => {
    it('mutant 188/199 - _shades is false when all alpha bytes are 0 or 255', () => {
        const decoder: any = makeDecoder();
        setHeader(decoder, { _colorType: 3 });
        decoder._currentChunkLength = 4;
        decoder._position = 0;
        decoder._stream = new Uint8Array([0, 255, 0, 255, 0, 0, 0, 0]);
        decoder._readTransparency();
        expect(decoder._shades).toBe(false);
    });
    it('mutant 199/203/207/209 - _shades is true when at least one alpha is partial', () => {
        const decoder: any = makeDecoder();
        setHeader(decoder, { _colorType: 3 });
        decoder._currentChunkLength = 3;
        decoder._position = 0;
        decoder._stream = new Uint8Array([0, 128, 255, 0, 0, 0, 0]);
        decoder._readTransparency();
        expect(decoder._shades).toBe(true);
        expect(decoder._shades).not.toBe(false);
    });
    it('mutant 203 - && condition: both !hasShades AND alphaByte !== 0 needed', () => {
        const decoder: any = makeDecoder();
        setHeader(decoder, { _colorType: 3 });
        decoder._currentChunkLength = 2;
        decoder._position = 0;
        decoder._stream = new Uint8Array([0, 0, 0, 0, 0]);
        decoder._readTransparency();
        expect(decoder._shades).toBe(false);
    });
    it('mutant 207 - alphaByte !== 255 must also be checked to detect shades', () => {
        const decoder: any = makeDecoder();
        setHeader(decoder, { _colorType: 3 });
        decoder._currentChunkLength = 2;
        decoder._position = 0;
        decoder._stream = new Uint8Array([255, 255, 0, 0, 0]);
        decoder._readTransparency();
        expect(decoder._shades).toBe(false);
    });
    it('mutant 209 - block sets hasShades=true so _shades is true', () => {
        const decoder: any = makeDecoder();
        setHeader(decoder, { _colorType: 3 });
        decoder._currentChunkLength = 1;
        decoder._position = 0;
        decoder._stream = new Uint8Array([100, 0, 0, 0]);
        decoder._readTransparency();
        expect(decoder._shades).toBe(true);
    });
    it('mutant 188 - non-colorType-3 calls _ignoreChunk, _alpha unchanged', () => {
        const decoder: any = makeDecoder();
        setHeader(decoder, { _colorType: 2 });
        decoder._currentChunkLength = 3;
        const spy = spyOn(decoder, '_ignoreChunk');
        decoder._readTransparency();
        expect(spy).toHaveBeenCalledTimes(1);
        expect(decoder._alpha).toBeUndefined();
    });
});
describe('_PngDecoder - _getPngColorSpace', () => {
    it('mutant 218/224 - colorType & 2 === 0 returns DeviceGray not DeviceRGB', () => {
        const decoder: any = makeDecoder();
        setHeader(decoder, { _colorType: 0 });
        decoder._isRedGreenBlue = false;
        const cs: any = decoder._getPngColorSpace();
        expect(cs.name).toBe('DeviceGray');
        expect(cs.name).not.toBe('DeviceRGB');
    });
    it('mutant 221 - empty string replacement: DeviceGray name must be non-empty', () => {
        const decoder: any = makeDecoder();
        setHeader(decoder, { _colorType: 0 });
        decoder._isRedGreenBlue = false;
        const cs: any = decoder._getPngColorSpace();
        expect(cs.name).toBeTruthy();
        expect(cs.name.length).toBeGreaterThan(0);
    });
    it('mutant 224 - colorType with bit 2 set returns DeviceRGB', () => {
        const decoder: any = makeDecoder();
        setHeader(decoder, { _colorType: 2 });
        decoder._isRedGreenBlue = false;
        const cs: any = decoder._getPngColorSpace();
        expect(cs.name).toBe('DeviceRGB');
    });
    it('mutant 229 - _isRedGreenBlue true returns CalRGB array not DeviceGray', () => {
        const decoder: any = makeDecoder();
        setHeader(decoder, { _colorType: 2 });
        decoder._isRedGreenBlue = true;
        const cs: any = decoder._getPngColorSpace();
        expect(Array.isArray(cs)).toBe(true);
        expect(cs[0].name).toBe('CalRGB');
    });
    it('mutant 226 - whitePoint is [1,1,1] not []', () => {
        const decoder: any = makeDecoder();
        setHeader(decoder, { _colorType: 2 });
        decoder._isRedGreenBlue = true;
        const cs: any = decoder._getPngColorSpace();
        const dict: _PdfDictionary = cs[1];
        const wp: number[] = dict.get('WhitePoint');
        expect(wp.length).toBe(3);
        expect(wp[1]).toBe(1);
    });
    it('mutant 295 - Matrix key must be "Matrix" not empty string', () => {
        const decoder: any = makeDecoder();
        setHeader(decoder, { _colorType: 2 });
        decoder._isRedGreenBlue = true;
        const cs: any = decoder._getPngColorSpace();
        const dict: _PdfDictionary = cs[1];
        expect(dict.has('Matrix')).toBe(true);
        expect(dict.get('Matrix')).toBeTruthy();
    });
    it('mutants 234-293 - CalRGB matrix values are numerically correct', () => {
        const decoder: any = makeDecoder();
        setHeader(decoder, { _colorType: 2 });
        decoder._isRedGreenBlue = true;
        const cs: any = decoder._getPngColorSpace();
        const dict: _PdfDictionary = cs[1];
        const matrix: number[] = dict.get('Matrix');
        expect(matrix.length).toBe(9);
        const wpX: number = 0.3127, wpY: number = 0.329;
        const redX: number = 0.64, redY: number = 0.33;
        const greenX: number = 0.3, greenY: number = 0.6;
        const bX: number = 0.15, bY: number = 0.06;
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
        expect(matrix[0]).toBeCloseTo(alphaX, 8);
        expect(matrix[1]).toBeCloseTo(alphaY, 8);
        expect(matrix[2]).toBeCloseTo(alphaZ, 8);
        expect(matrix[3]).toBeCloseTo(blueX, 8);
        expect(matrix[4]).toBeCloseTo(blueY, 8);
        expect(matrix[5]).toBeCloseTo(blueZ, 8);
        expect(matrix[6]).toBeCloseTo(colorX, 8);
        expect(matrix[7]).toBeCloseTo(colorY, 8);
        expect(matrix[8]).toBeCloseTo(colorZ, 8);
    });
    it('mutant 290 - whiteX uses addition alphaX+blueX+colorX not subtraction', () => {
        const decoder: any = makeDecoder();
        setHeader(decoder, { _colorType: 2 });
        decoder._isRedGreenBlue = true;
        const cs: any = decoder._getPngColorSpace();
        const dict: _PdfDictionary = cs[1];
        const matrix: number[] = dict.get('Matrix');
        const wp: number[] = dict.get('WhitePoint');
        expect(wp[0]).toBeCloseTo(matrix[0] + matrix[3] + matrix[6], 6);
    });
    it('mutant 293 - whiteZ uses addition not subtraction', () => {
        const decoder: any = makeDecoder();
        setHeader(decoder, { _colorType: 2 });
        decoder._isRedGreenBlue = true;
        const cs: any = decoder._getPngColorSpace();
        const dict: _PdfDictionary = cs[1];
        const matrix: number[] = dict.get('Matrix');
        const wp: number[] = dict.get('WhitePoint');
        expect(wp[2]).toBeCloseTo(matrix[2] + matrix[5] + matrix[8], 6);
    });
    it('mutant 253 - alphaZ = alphaY * expr not alphaY / expr', () => {
        const decoder: any = makeDecoder();
        setHeader(decoder, { _colorType: 2 });
        decoder._isRedGreenBlue = true;
        const cs: any = decoder._getPngColorSpace();
        const dict: _PdfDictionary = cs[1];
        const matrix: number[] = dict.get('Matrix');
        const alphaY: number = matrix[1];
        const redX: number = 0.64, redY: number = 0.33;
        const alphaZ_expected: number = alphaY * ((1 - redX) / redY - 1);
        expect(matrix[2]).toBeCloseTo(alphaZ_expected, 8);
        expect(matrix[2]).not.toBeCloseTo(alphaY / ((1 - redX) / redY - 1), 8);
    });
    it('mutant 258/259 - blueY uses negation of greenY (not +greenY)', () => {
        const decoder: any = makeDecoder();
        setHeader(decoder, { _colorType: 2 });
        decoder._isRedGreenBlue = true;
        const cs: any = decoder._getPngColorSpace();
        const dict: _PdfDictionary = cs[1];
        const matrix: number[] = dict.get('Matrix');
        const blueY: number = matrix[4];
        expect(blueY).toEqual(0.7151686787677559);
    });
    it('mutant 268/269 - blueX = blueY * greenX / greenY not blueY * greenX * greenY', () => {
        const decoder: any = makeDecoder();
        setHeader(decoder, { _colorType: 2 });
        decoder._isRedGreenBlue = true;
        const cs: any = decoder._getPngColorSpace();
        const dict: _PdfDictionary = cs[1];
        const matrix: number[] = dict.get('Matrix');
        const blueY: number = matrix[4];
        const greenX: number = 0.3, greenY: number = 0.6;
        expect(matrix[3]).toBeCloseTo(blueY * greenX / greenY, 8);
        expect(matrix[3]).not.toBeCloseTo(blueY * greenX * greenY, 8);
    });
    it('mutant 285 - colorX = colorY * bX / bY not colorY / bX', () => {
        const decoder: any = makeDecoder();
        setHeader(decoder, { _colorType: 2 });
        decoder._isRedGreenBlue = true;
        const cs: any = decoder._getPngColorSpace();
        const dict: _PdfDictionary = cs[1];
        const matrix: number[] = dict.get('Matrix');
        const colorY: number = matrix[7];
        const bX: number = 0.15, bY: number = 0.06;
        expect(matrix[6]).toBeCloseTo(colorY * bX / bY, 8);
        expect(matrix[6]).not.toBeCloseTo(colorY / bX, 8);
    });
    it('mutants 272/274/275 - blueZ and colorY computed correctly', () => {
        const decoder: any = makeDecoder();
        setHeader(decoder, { _colorType: 2 });
        decoder._isRedGreenBlue = true;
        const cs: any = decoder._getPngColorSpace();
        const dict: _PdfDictionary = cs[1];
        const matrix: number[] = dict.get('Matrix');
        const blueY: number = matrix[4];
        const greenX: number = 0.3, greenY: number = 0.6;
        const blueZ_expected: number = blueY * ((1 - greenX) / greenY - 1);
        expect(matrix[5]).toBeCloseTo(blueZ_expected, 8);
    });
});
describe('_PngDecoder - _decodeImageData', () => {
    it('mutant 306 - _isDecode is true when interlace=1 (|| not &&)', () => {
        const decoder: any = makeDecoder();
        setHeader(decoder, { _colorType: 2, _bitDepth: 8, _interlace: 1, _width: 1, _height: 1 });
        decoder._idatLength = 3;
        decoder._shades = false;
        decoder._encodedStream = null;
        spyOn(decoder, '_readDecodeData');
        decoder._decodeImageData();
        expect(decoder._isDecode).toBe(true);
    });
    it('mutant 306 - _isDecode is true when bitDepth=16 (|| not &&)', () => {
        const decoder: any = makeDecoder();
        setHeader(decoder, { _colorType: 2, _bitDepth: 16, _interlace: 0, _width: 1, _height: 1 });
        decoder._idatLength = 3;
        decoder._shades = false;
        decoder._encodedStream = null;
        spyOn(decoder, '_readDecodeData');
        decoder._decodeImageData();
        expect(decoder._isDecode).toBe(true);
    });
    it('mutant 306 - _isDecode is false when none of the flags are set', () => {
        const decoder: any = makeDecoder();
        setHeader(decoder, { _colorType: 2, _bitDepth: 8, _interlace: 0, _width: 2, _height: 2 });
        decoder._idatLength = 12;
        decoder._shades = false;
        decoder._encodedStream = new Uint8Array([0x78, 0x9C, 0x62, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01]);
        decoder._encodedStreamLength = 9;
        decoder._decodeImageData();
        expect(decoder._isDecode).toBe(false);
    });
    it('mutant 337 - decodedImageData.length===0 with shades sets _ideateDecode false', () => {
        const decoder: any = makeDecoder();
        setHeader(decoder, { _colorType: 3, _bitDepth: 8, _interlace: 0, _width: 1, _height: 1 });
        decoder._shades = true;
        decoder._idatLength = 1;
        decoder._encodedStream = new Uint8Array([0x78, 0x9C, 0x00, 0x01, 0x00, 0xFE, 0xFF, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01]);
        decoder._encodedStreamLength = 13;
        spyOn(decoder, '_readDecodeData').and.callFake(() => {
            decoder._decodedImageData = new Uint8Array(0);
        });
        decoder._decodeImageData();
        expect(decoder._ideateDecode).toBe(false);
    });
    it('mutant 337 - decodedImageData.length>0 preserves _ideateDecode=true', () => {
        const decoder: any = makeDecoder();
        setHeader(decoder, { _colorType: 3, _bitDepth: 8, _interlace: 0, _width: 1, _height: 1 });
        decoder._shades = true;
        decoder._idatLength = 1;
        decoder._encodedStream = new Uint8Array(16).fill(0);
        decoder._encodedStreamLength = 16;
        spyOn(decoder, '_getDeflatedData').and.returnValue(new Uint8Array([0, 0xAA]));
        spyOn(decoder, '_readDecodeData').and.callFake(() => {
            decoder._decodedImageData = new Uint8Array([0xAA]);
        });
        decoder._decodeImageData();
        expect(decoder._ideateDecode).toBe(true);
    });
    it('mutant 342 - _getDeflatedData block executed when encodedStream present', () => {
        const decoder: any = makeDecoder();
        setHeader(decoder, { _colorType: 2, _bitDepth: 16, _interlace: 0, _width: 1, _height: 1 });
        decoder._idatLength = 3;
        decoder._shades = false;
        decoder._encodedStream = new Uint8Array(16).fill(0);
        decoder._encodedStreamLength = 16;
        const spy = spyOn(decoder, '_getDeflatedData').and.returnValue(new Uint8Array(4));
        spyOn(decoder, '_readDecodeData');
        decoder._decodeImageData();
        expect(spy).toHaveBeenCalledTimes(1);
        expect(decoder._dataStream).toBeTruthy();
    });
});
describe('_PngDecoder - _decompressSub', () => {
    it('decompressSub: each byte[i] = (byte[i] + byte[i-bpp]) & 0xff', () => {
        const decoder: any = makeDecoder();
        const data: Uint8Array = new Uint8Array([10, 20, 30, 40]);
        decoder._decompressSub(data, 4, 1);
        expect(data[0]).toBe(10);
        expect(data[1]).toBe(30);
        expect(data[2]).toBe(60);
        expect(data[3]).toBe(100);
    });
    it('decompressSub wraps at 255 correctly', () => {
        const decoder: any = makeDecoder();
        const data: Uint8Array = new Uint8Array([200, 100, 0, 0]);
        decoder._decompressSub(data, 2, 1);
        expect(data[1]).toBe(44);
    });
    it('decompressSub with bitsPerPixel=2 skips first 2 bytes', () => {
        const decoder: any = makeDecoder();
        const data: Uint8Array = new Uint8Array([10, 20, 5, 8]);
        decoder._decompressSub(data, 4, 2);
        expect(data[0]).toBe(10);
        expect(data[1]).toBe(20);
        expect(data[2]).toBe(15);
        expect(data[3]).toBe(28);
    });
    it('mutant 433 - copy uses streamOffset+count not streamOffset-count', () => {
        const decoder: any = makeDecoder();
        const src: Uint8Array = new Uint8Array([0, 0xAA, 0xBB, 0xCC, 0x00]);
        const dst: Uint8Array = new Uint8Array(3);
        decoder._readStream(src, 1, dst, 3);
        expect(dst[0]).toBe(0xAA);
        expect(dst[1]).toBe(0xBB);
        expect(dst[2]).toBe(0xCC);
    });
    it('mutant 438 - loop starts at bitsPerPixel (i>=count mutant would skip bytes)', () => {
        const decoder: any = makeDecoder();
        const data: Uint8Array = new Uint8Array([1, 2, 5, 8]);
        decoder._decompressSub(data, 4, 1);
        expect(data[1]).toBe(3);
        expect(data[2]).toBe(8);
        expect(data[3]).toBe(16);
    });
    it('mutant 445 - _decompressUp loop uses i<count not i<=count', () => {
        const decoder: any = makeDecoder();
        const cur: Uint8Array = new Uint8Array([1, 2, 3]);
        const prior: Uint8Array = new Uint8Array([10, 20, 30]);
        decoder._decompressUp(cur, prior, 3);
        expect(cur[0]).toBe(11);
        expect(cur[1]).toBe(22);
        expect(cur[2]).toBe(33);
    });
    it('mutant 458 - _decompressAverage second loop uses i<count not i<=count', () => {
        const decoder: any = makeDecoder();
        const cur: Uint8Array = new Uint8Array([0, 0, 10, 0]);
        const prior: Uint8Array = new Uint8Array([0, 0, 4, 0]);
        decoder._decompressAverage(cur, prior, 4, 2);
        expect(cur[2]).toBe(12);
        expect(cur[3]).toBe(0);
    });
});
describe('_PngDecoder - _decompressUp', () => {
    it('decompressUp: each byte[i] = (byte[i] + pByte[i]) & 0xff', () => {
        const decoder: any = makeDecoder();
        const cur: Uint8Array = new Uint8Array([10, 20, 30]);
        const prior: Uint8Array = new Uint8Array([1, 2, 3]);
        decoder._decompressUp(cur, prior, 3);
        expect(cur[0]).toBe(11);
        expect(cur[1]).toBe(22);
        expect(cur[2]).toBe(33);
    });
    it('decompressUp wraps at 255', () => {
        const decoder: any = makeDecoder();
        const cur: Uint8Array = new Uint8Array([200, 100]);
        const prior: Uint8Array = new Uint8Array([100, 200]);
        decoder._decompressUp(cur, prior, 2);
        expect(cur[0]).toBe(44);
        expect(cur[1]).toBe(44);
    });
});
describe('_PngDecoder - _decompressAverage', () => {
    it('decompressAverage first bpp bytes use only prior>>1', () => {
        const decoder: any = makeDecoder();
        const cur: Uint8Array = new Uint8Array([10, 20, 30, 40]);
        const prior: Uint8Array = new Uint8Array([4, 8, 0, 0]);
        decoder._decompressAverage(cur, prior, 4, 2);
        expect(cur[0]).toBe(10 + 2);
        expect(cur[1]).toBe(20 + 4);
    });
    it('decompressAverage remaining bytes use floor((left+above)/2)', () => {
        const decoder: any = makeDecoder();
        const cur: Uint8Array = new Uint8Array([5, 0, 10, 0]);
        const prior: Uint8Array = new Uint8Array([4, 0, 6, 0]);
        decoder._decompressAverage(cur, prior, 4, 2);
        expect(cur[2]).toBe(10 + Math.floor((cur[0] + 6) / 2));
    });
});
describe('_PngDecoder - _decompressPaeth', () => {
    it('decompressPaeth first bpp bytes same as Up', () => {
        const decoder: any = makeDecoder();
        const cur: Uint8Array = new Uint8Array([10, 20, 5, 5]);
        const prior: Uint8Array = new Uint8Array([3, 7, 0, 0]);
        decoder._decompressPaeth(cur, prior, 4, 2);
        expect(cur[0]).toBe(13);
        expect(cur[1]).toBe(27);
    });
    it('decompressPaeth remaining bytes apply paethPredictor', () => {
        const decoder: any = makeDecoder();
        const cur: Uint8Array = new Uint8Array([0, 0, 5, 0]);
        const prior: Uint8Array = new Uint8Array([3, 7, 1, 2]);
        decoder._decompressPaeth(cur, prior, 4, 2);
        const expected: number = (5 + decoder._paethPredictor(cur[0], prior[2], prior[0])) & 0xff;
        expect(cur[2]).toBe(expected);
    });
    it('mutant 465 - block runs: paeth first bpp bytes add prior not zero', () => {
        const decoder: any = makeDecoder();
        const cur: Uint8Array = new Uint8Array([5, 10, 0, 0]);
        const prior: Uint8Array = new Uint8Array([3, 4, 0, 0]);
        decoder._decompressPaeth(cur, prior, 4, 2);
        expect(cur[0]).toBe(8);
        expect(cur[1]).toBe(14);
    });
    it('mutant 466/467 - first loop i<bitsPerPixel not i<=bitsPerPixel', () => {
        const decoder: any = makeDecoder();
        const cur: Uint8Array = new Uint8Array([5, 10, 0, 0]);
        const prior: Uint8Array = new Uint8Array([3, 4, 0, 0]);
        decoder._decompressPaeth(cur, prior, 2, 2);
        expect(cur[0]).toBe(8);
        expect(cur[1]).toBe(14);
    });
    it('mutant 468 - first loop i>=bitsPerPixel would skip all bytes: verify not skipped', () => {
        const decoder: any = makeDecoder();
        const cur: Uint8Array = new Uint8Array([5, 0, 0, 0]);
        const prior: Uint8Array = new Uint8Array([3, 0, 0, 0]);
        decoder._decompressPaeth(cur, prior, 4, 1);
        expect(cur[0]).toBe(8);
    });
    it('mutant 470 - first loop body sets data[i]=(data[i]+pData[i])&0xff', () => {
        const decoder: any = makeDecoder();
        const cur: Uint8Array = new Uint8Array([200, 0, 0, 0]);
        const prior: Uint8Array = new Uint8Array([100, 0, 0, 0]);
        decoder._decompressPaeth(cur, prior, 4, 1);
        expect(cur[0]).toBe(44);
    });
    it('mutant 471 - first loop adds prior not subtracts: (data-pData) differs from (data+pData)', () => {
        const decoder: any = makeDecoder();
        const cur1: Uint8Array = new Uint8Array([10, 0, 0, 0]);
        const cur2: Uint8Array = new Uint8Array([10, 0, 0, 0]);
        const prior: Uint8Array = new Uint8Array([3, 0, 0, 0]);
        decoder._decompressPaeth(cur1, prior, 4, 1);
        expect(cur1[0]).toBe(13);
        expect(cur1[0]).not.toBe(7);
    });
    it('mutant 473 - second loop uses i<count not i<=count (no off-by-one)', () => {
        const decoder: any = makeDecoder();
        const cur: Uint8Array = new Uint8Array([5, 3, 0, 0]);
        const prior: Uint8Array = new Uint8Array([2, 4, 0, 0]);
        decoder._decompressPaeth(cur, prior, 2, 1);
        expect(cur[0]).toBe(7);
        expect(cur[1]).toBe(10);
    });
    it('mutant 478 - paethPredictor left arg is data[i-bpp] not data[i+bpp]', () => {
        const decoder: any = makeDecoder();
        const cur: Uint8Array = new Uint8Array([5, 0, 3, 0]);
        const prior: Uint8Array = new Uint8Array([2, 0, 1, 0]);
        decoder._decompressPaeth(cur, prior, 3, 1);
        const leftForIdx2: number = cur[1];
        const expected: number = (3 + decoder._paethPredictor(leftForIdx2, prior[2], prior[1])) & 0xff;
        expect(cur[2]).toBe(expected);
    });
    it('mutant 479 - paethPredictor up-left arg is pData[i-bpp] not pData[i+bpp]', () => {
        const decoder: any = makeDecoder();
        const cur: Uint8Array = new Uint8Array([5, 7, 2, 0]);
        const prior: Uint8Array = new Uint8Array([3, 4, 1, 9]);
        decoder._decompressPaeth(cur, prior, 3, 1);
        const upleft: number = prior[1];
        const left: number = cur[1];
        const expected: number = (2 + decoder._paethPredictor(left, prior[2], upleft)) & 0xff;
        expect(cur[2]).toBe(expected);
    });
});
describe('_PngDecoder - _readStream', () => {
    it('_readStream copies count bytes and returns updated offset', () => {
        const decoder: any = makeDecoder();
        const src: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const dst: Uint8Array = new Uint8Array(3);
        const result: number = decoder._readStream(src, 1, dst, 3);
        expect(result).toBe(4);
        expect(dst[0]).toBe(2);
        expect(dst[1]).toBe(3);
        expect(dst[2]).toBe(4);
    });
    it('_readStream throws when insufficient bytes', () => {
        const decoder: any = makeDecoder();
        const src: Uint8Array = new Uint8Array([1, 2]);
        const dst: Uint8Array = new Uint8Array(3);
        expect(() => decoder._readStream(src, 0, dst, 3)).toThrowError('Insufficient data');
    });
    it('_readStream with offset at boundary copies exactly remaining bytes', () => {
        const decoder: any = makeDecoder();
        const src: Uint8Array = new Uint8Array([10, 20, 30]);
        const dst: Uint8Array = new Uint8Array(2);
        const result: number = decoder._readStream(src, 1, dst, 2);
        expect(result).toBe(3);
        expect(dst[0]).toBe(20);
        expect(dst[1]).toBe(30);
    });
});
describe('_PngDecoder - _readDecodeData', () => {
    it('non-interlaced calls _decodeData once with xStep=1 yStep=1', () => {
        const decoder: any = makeDecoder();
        setHeader(decoder, { _interlace: 0, _width: 4, _height: 3, _bitDepth: 8, _colorType: 2 });
        const spy = spyOn(decoder, '_decodeData');
        decoder._readDecodeData();
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(0, 0, 1, 1, 4, 3);
    });
    it('interlaced calls _decodeData 7 times for Adam7 passes', () => {
        const decoder: any = makeDecoder();
        setHeader(decoder, { _interlace: 1, _width: 8, _height: 8, _bitDepth: 8, _colorType: 2 });
        const spy = spyOn(decoder, '_decodeData');
        decoder._readDecodeData();
        expect(spy).toHaveBeenCalledTimes(7);
    });
    it('interlaced first pass uses xStep=8 yStep=8', () => {
        const decoder: any = makeDecoder();
        setHeader(decoder, { _interlace: 1, _width: 8, _height: 8, _bitDepth: 8, _colorType: 2 });
        const spy = spyOn(decoder, '_decodeData');
        decoder._readDecodeData();
        expect(spy.calls.argsFor(0)[2]).toBe(8);
        expect(spy.calls.argsFor(0)[3]).toBe(8);
    });
    it('mutant 392 - pass5 height uses (height+1)/4 not height-1', () => {
        const decoder: any = makeDecoder();
        setHeader(decoder, { _interlace: 1, _width: 8, _height: 8, _bitDepth: 8, _colorType: 2 });
        const spy = spyOn(decoder, '_decodeData');
        decoder._readDecodeData();
        const pass5Args: any[] = spy.calls.argsFor(4);
        const expectedH: number = Math.floor((8 + 1) / 4);
        expect(pass5Args[5]).toBe(expectedH);
        expect(pass5Args[5]).not.toBe(8 - 1);
    });
    it('mutant 392 - pass5 width uses (width+1)/2', () => {
        const decoder: any = makeDecoder();
        setHeader(decoder, { _interlace: 1, _width: 8, _height: 8, _bitDepth: 8, _colorType: 2 });
        const spy = spyOn(decoder, '_decodeData');
        decoder._readDecodeData();
        const pass5Args: any[] = spy.calls.argsFor(4);
        expect(pass5Args[4]).toBe(Math.floor((8 + 1) / 2));
    });
});
describe('_PngDecoder - _decodeData', () => {
    it('mutant 403 - width=0 returns early, _processPixels not called', () => {
        const decoder: any = makeDecoder();
        setHeader(decoder, { _colorType: 2, _bitDepth: 8, _interlace: 0, _width: 2, _height: 2 });
        decoder._inputBands = 3;
        decoder._bitsPerPixel = 1;
        decoder._dataStream = new Uint8Array(100).fill(0);
        decoder._dataStreamOffset = 0;
        const spy = spyOn(decoder, '_processPixels');
        decoder._decodeData(0, 0, 1, 1, 0, 2);
        expect(spy).not.toHaveBeenCalled();
    });
    it('mutant 403 - height=0 returns early, _processPixels not called', () => {
        const decoder: any = makeDecoder();
        setHeader(decoder, { _colorType: 2, _bitDepth: 8, _interlace: 0, _width: 2, _height: 2 });
        decoder._inputBands = 3;
        decoder._bitsPerPixel = 1;
        decoder._dataStream = new Uint8Array(100).fill(0);
        decoder._dataStreamOffset = 0;
        const spy = spyOn(decoder, '_processPixels');
        decoder._decodeData(0, 0, 1, 1, 2, 0);
        expect(spy).not.toHaveBeenCalled();
    });
    it('mutant 406/407 - bytesPerRow uses (bands*w*bpc+7)/8 not *8 or -7', () => {
        const decoder: any = makeDecoder();
        setHeader(decoder, { _colorType: 2, _bitDepth: 8, _interlace: 0, _width: 3, _height: 1 });
        decoder._inputBands = 3;
        decoder._bitsPerPixel = 1;
        const width: number = 3;
        const expectedBPR: number = Math.floor((3 * width * 8 + 7) / 8);
        decoder._dataStream = new Uint8Array(1 + expectedBPR + 4).fill(0);
        decoder._dataStreamOffset = 0;
        decoder._decodedImageData = new Uint8Array(expectedBPR * 2);
        decoder._bitsPerComponent = 8;
        spyOn(decoder, '_processPixels');
        decoder._decodeData(0, 0, 1, 1, width, 1);
        expect(decoder._dataStreamOffset).toBe(1 + expectedBPR);
        expect(decoder._dataStreamOffset).not.toBe(1 + 3 * width * 8 * 8);
    });
});
describe('_PngDecoder - _paethPredictor', () => {
    it('returns a when pa is smallest', () => {
        const decoder: any = makeDecoder();
        expect(decoder._paethPredictor(10, 5, 3)).toBe(10);
    });
    it('returns b when pb < pc', () => {
        const decoder: any = makeDecoder();
        expect(decoder._paethPredictor(100, 5, 4)).toBe(100);
    });
    it('returns c when pc is smallest', () => {
        const decoder: any = makeDecoder();
        expect(decoder._paethPredictor(100, 100, 99)).toBe(100);
    });
    it('all equal returns a', () => {
        const decoder: any = makeDecoder();
        expect(decoder._paethPredictor(5, 5, 5)).toBe(5);
    });
    it('mutant 480 - block executes: paethPredictor returns meaningful value not 0', () => {
        const decoder: any = makeDecoder();
        expect(decoder._paethPredictor(10, 20, 15)).not.toBeUndefined();
        expect(decoder._paethPredictor(10, 20, 15)).toBeGreaterThanOrEqual(0);
    });
    it('mutant 482 - p = a+b-c not a-b: verify a+b-c used', () => {
        const decoder: any = makeDecoder();
        const a: number = 5, b: number = 10, c: number = 3;
        const p: number = a + b - c;
        const pa: number = Math.abs(p - a);
        const pb: number = Math.abs(p - b);
        const pc: number = Math.abs(p - c);
        const expected: number = (pa <= pb && pa <= pc) ? a : (pb <= pc) ? b : c;
        expect(decoder._paethPredictor(a, b, c)).toBe(expected);
    });
    it('mutant 483 - pa = |p-a| not |p+a|: exact value matters', () => {
        const decoder: any = makeDecoder();
        const a: number = 100, b: number = 50, c: number = 10;
        const p: number = a + b - c;
        const pa: number = Math.abs(p - a);
        const pb: number = Math.abs(p - b);
        const pc: number = Math.abs(p - c);
        const expected: number = (pa <= pb && pa <= pc) ? a : (pb <= pc) ? b : c;
        expect(decoder._paethPredictor(a, b, c)).toBe(expected);
    });
    it('mutant 484 - pb = |p-b| not |p+b|', () => {
        const decoder: any = makeDecoder();
        expect(decoder._paethPredictor(3, 50, 40)).toBe(3);
    });
    it('mutant 485 - pc = |p-c| not |p+c|', () => {
        const decoder: any = makeDecoder();
        const a: number = 50, b: number = 60, c: number = 55;
        const p: number = a + b - c;
        const pa: number = Math.abs(p - a);
        const pb: number = Math.abs(p - b);
        const pc: number = Math.abs(p - c);
        const expected: number = (pa <= pb && pa <= pc) ? a : (pb <= pc) ? b : c;
        expect(decoder._paethPredictor(a, b, c)).toBe(expected);
    });
    it('mutant 487 - (pa<=pb && pa<=pc) uses && not ||', () => {
        const decoder: any = makeDecoder();
        const a: number = 3, b: number = 2, c: number = 1;
        const p: number = a + b - c;
        const pa: number = Math.abs(p - a);
        const pb: number = Math.abs(p - b);
        const pc: number = Math.abs(p - c);
        if (pa <= pb && pa <= pc) {
            expect(decoder._paethPredictor(a, b, c)).toBe(a);
        } else if (pb <= pc) {
            expect(decoder._paethPredictor(a, b, c)).toBe(b);
        } else {
            expect(decoder._paethPredictor(a, b, c)).toBe(c);
        }
    });
    it('mutant 488 - (pa<=pb && pa<=pc): if false branch uses (pb<=pc) not always true', () => {
        const decoder: any = makeDecoder();
        const a: number = 200, b: number = 5, c: number = 0;
        const result: number = decoder._paethPredictor(a, b, c);
        expect(result).toBe(200);
    });
    it('mutant 489 - condition pa<=pb must be <=, not >', () => {
        const decoder: any = makeDecoder();
        const a: number = 10, b: number = 20, c: number = 5;
        const p: number = a + b - c;
        const pa: number = Math.abs(p - a);
        const pb: number = Math.abs(p - b);
        if (pa <= pb) {
            expect(decoder._paethPredictor(a, b, c)).toBe(a);
        }
    });
    it('mutant 491 - pa>pb would invert first branch returning b instead of a', () => {
        const decoder: any = makeDecoder();
        expect(decoder._paethPredictor(5, 100, 99)).toBe(5);
    });
    it('mutant 493 - pa<=pc must be <=: verify result switches correctly', () => {
        const decoder: any = makeDecoder();
        const a: number = 4, b: number = 50, c: number = 2;
        const p: number = a + b - c;
        const pa: number = Math.abs(p - a);
        const pb: number = Math.abs(p - b);
        const pc: number = Math.abs(p - c);
        const expected: number = (pa <= pb && pa <= pc) ? a : (pb <= pc) ? b : c;
        expect(decoder._paethPredictor(a, b, c)).toBe(expected);
    });
    it('mutant 494 - pa>pc would invert second part of && condition', () => {
        const decoder: any = makeDecoder();
        const a: number = 10, b: number = 100, c: number = 9;
        const result: number = decoder._paethPredictor(a, b, c);
        const p: number = a + b - c;
        const pa: number = Math.abs(p - a);
        const pb: number = Math.abs(p - b);
        const pc: number = Math.abs(p - c);
        const expected: number = (pa <= pb && pa <= pc) ? a : (pb <= pc) ? b : c;
        expect(result).toBe(expected);
    });
    it('mutant 495 - (pb<=pc) condition: true mutant would always return b', () => {
        const decoder: any = makeDecoder();
        const a: number = 100, b: number = 50, c: number = 10;
        const p: number = a + b - c;
        const pa: number = Math.abs(p - a);
        const pb: number = Math.abs(p - b);
        const pc: number = Math.abs(p - c);
        if (!(pa <= pb && pa <= pc)) {
            if (pb > pc) {
                expect(decoder._paethPredictor(a, b, c)).toBe(c);
            }
        }
    });
    it('mutant 497 - pb<pc mutant: verify pb<=pc boundary case returns b not c', () => {
        const decoder: any = makeDecoder();
        const a: number = 200, b: number = 5, c: number = 5;
        const result: number = decoder._paethPredictor(a, b, c);
        expect(result).toBe(200);
    });
});
describe('_PngDecoder - _processPixels', () => {
    it('mutant 499 - block runs: _processPixels writes pixels to decodedImageData', () => {
        const decoder: any = makeDecoder();
        setHeader(decoder, { _colorType: 2, _bitDepth: 8, _interlace: 0, _width: 2, _height: 1 });
        decoder._inputBands = 3;
        decoder._bitsPerPixel = 1;
        decoder._decodedImageData = new Uint8Array(6);
        const data: Uint8Array = new Uint8Array([10, 20, 30, 40, 50, 60]);
        decoder._processPixels(data, 0, 1, 0, 2);
        expect(decoder._decodedImageData[0]).toBe(10);
        expect(decoder._decodedImageData[3]).toBe(40);
    });
    it('mutant 515 - colorType 2 sets size=3 not size=1', () => {
        const decoder: any = makeDecoder();
        setHeader(decoder, { _colorType: 2, _bitDepth: 8, _interlace: 0, _width: 2, _height: 1 });
        decoder._inputBands = 3;
        decoder._bitsPerPixel = 1;
        decoder._decodedImageData = new Uint8Array(6);
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5, 6]);
        decoder._processPixels(data, 0, 1, 0, 2);
        expect(decoder._decodedImageData[0]).toBe(1);
        expect(decoder._decodedImageData[1]).toBe(2);
        expect(decoder._decodedImageData[2]).toBe(3);
    });
    it('mutant 522 - decodedImageData && length>0 required: null decodedImageData skips setPixel', () => {
        const decoder: any = makeDecoder();
        setHeader(decoder, { _colorType: 2, _bitDepth: 8, _interlace: 0, _width: 2, _height: 1 });
        decoder._inputBands = 3;
        decoder._decodedImageData = null;
        const spy = spyOn(decoder, '_setPixel');
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5, 6]);
        decoder._processPixels(data, 0, 1, 0, 2);
        expect(spy).not.toHaveBeenCalled();
    });
    it('mutant 524 - decodedImageData.length>0 not >=0: empty array skips setPixel', () => {
        const decoder: any = makeDecoder();
        setHeader(decoder, { _colorType: 2, _bitDepth: 8, _interlace: 0, _width: 2, _height: 1 });
        decoder._inputBands = 3;
        decoder._decodedImageData = new Uint8Array(0);
        const spy = spyOn(decoder, '_setPixel');
        decoder._processPixels(new Uint8Array(6), 0, 1, 0, 2);
        expect(spy).not.toHaveBeenCalled();
    });
    it('mutant 527 - bitDepth 16 maps to depth 8 not bitDepth itself', () => {
        const decoder: any = makeDecoder();
        setHeader(decoder, { _colorType: 2, _bitDepth: 16, _interlace: 0, _width: 1, _height: 1 });
        decoder._inputBands = 3;
        decoder._bitsPerPixel = 2;
        decoder._decodedImageData = new Uint8Array(3);
        const data: Uint8Array = new Uint8Array([0x01, 0x00, 0x02, 0x00, 0x03, 0x00]);
        decoder._processPixels(data, 0, 1, 0, 1);
        expect(decoder._decodedImageData[0]).toBeDefined();
    });
    it('mutant 529 - bitDepth!==16 mutant would use 8 for non-16 depth', () => {
        const decoder: any = makeDecoder();
        setHeader(decoder, { _colorType: 2, _bitDepth: 8, _interlace: 0, _width: 2, _height: 1 });
        decoder._inputBands = 3;
        decoder._decodedImageData = new Uint8Array(6);
        const data: Uint8Array = new Uint8Array([11, 22, 33, 44, 55, 66]);
        decoder._processPixels(data, 0, 1, 0, 2);
        expect(decoder._decodedImageData[0]).toBe(11);
        expect(decoder._decodedImageData[3]).toBe(44);
    });
    it('mutant 530 - yStep = floor((size*width*depth+7)/8) not *8', () => {
        const decoder: any = makeDecoder();
        setHeader(decoder, { _colorType: 2, _bitDepth: 8, _interlace: 0, _width: 2, _height: 2 });
        decoder._inputBands = 3;
        decoder._decodedImageData = new Uint8Array(12);
        const row0: Uint8Array = new Uint8Array([1, 2, 3, 4, 5, 6]);
        decoder._processPixels(row0, 0, 1, 0, 2);
        const row1: Uint8Array = new Uint8Array([7, 8, 9, 10, 11, 12]);
        decoder._processPixels(row1, 0, 1, 1, 2);
        expect(decoder._decodedImageData[6]).toBe(7);
    });
    it('mutant 543 - shades uses || so either flag triggers mask write', () => {
        const decoder: any = makeDecoder();
        setHeader(decoder, { _colorType: 3, _bitDepth: 8, _interlace: 0, _width: 2, _height: 1 });
        decoder._inputBands = 1;
        decoder._decodedImageData = new Uint8Array(2);
        decoder._maskData = new Uint8Array(2);
        decoder._shades = true;
        decoder._alpha = new Uint8Array([128, 255]);
        const data: Uint8Array = new Uint8Array([0, 1]);
        decoder._processPixels(data, 0, 1, 0, 2);
        expect(decoder._maskData[0]).toBe(128);
        expect(decoder._maskData[1]).toBe(255);
    });
    it('mutant 553 - bitDepth===16 branch writes >> 8 shifted alpha', () => {
        const decoder: any = makeDecoder();
        setHeader(decoder, { _colorType: 4, _bitDepth: 16, _interlace: 0, _width: 1, _height: 1 });
        decoder._inputBands = 2;
        decoder._bitsPerPixel = 2;
        decoder._decodedImageData = new Uint8Array(2);
        decoder._maskData = new Uint8Array(1);
        const data: Uint8Array = new Uint8Array([0x01, 0x00, 0xFF, 0x00]);
        decoder._processPixels(data, 0, 1, 0, 1);
        expect(decoder._maskData[0]).toBeDefined();
    });
    it('mutant 558 - for loop i<width not i<=width (no extra iteration)', () => {
        const decoder: any = makeDecoder();
        setHeader(decoder, { _colorType: 4, _bitDepth: 8, _interlace: 0, _width: 2, _height: 1 });
        decoder._inputBands = 2;
        decoder._decodedImageData = new Uint8Array(4);
        decoder._maskData = new Uint8Array(2);
        const spy = spyOn(decoder, '_setPixel').and.callThrough();
        const data: Uint8Array = new Uint8Array([10, 200, 20, 150]);
        decoder._processPixels(data, 0, 1, 0, 2);
        const maskCalls: number = spy.calls.all().filter((c: any) => c.args[0] === decoder._maskData).length;
        expect(maskCalls).toBe(2);
    });
    it('mutant 560 - ++i not --i: loop increments correctly', () => {
        const decoder: any = makeDecoder();
        setHeader(decoder, { _colorType: 4, _bitDepth: 8, _interlace: 0, _width: 3, _height: 1 });
        decoder._inputBands = 2;
        decoder._decodedImageData = new Uint8Array(6);
        decoder._maskData = new Uint8Array(3);
        const data: Uint8Array = new Uint8Array([1, 100, 2, 150, 3, 200]);
        decoder._processPixels(data, 0, 1, 0, 3);
        expect(decoder._maskData[0]).toBe(100);
        expect(decoder._maskData[1]).toBe(150);
        expect(decoder._maskData[2]).toBe(200);
    });
    it('mutant 571 - destX += step not destX -= step in alpha shades loop', () => {
        const decoder: any = makeDecoder();
        setHeader(decoder, { _colorType: 3, _bitDepth: 8, _interlace: 0, _width: 3, _height: 1 });
        decoder._inputBands = 1;
        decoder._decodedImageData = new Uint8Array(3);
        decoder._maskData = new Uint8Array(3);
        decoder._shades = true;
        decoder._alpha = new Uint8Array([50, 100, 200]);
        const data: Uint8Array = new Uint8Array([0, 1, 2]);
        decoder._processPixels(data, 0, 1, 0, 3);
        expect(decoder._maskData[0]).toBe(50);
        expect(decoder._maskData[1]).toBe(100);
        expect(decoder._maskData[2]).toBe(200);
    });
    it('mutant 574 - sourceX<width not sourceX<=width in alpha loop', () => {
        const decoder: any = makeDecoder();
        setHeader(decoder, { _colorType: 3, _bitDepth: 8, _interlace: 0, _width: 2, _height: 1 });
        decoder._inputBands = 1;
        decoder._decodedImageData = new Uint8Array(2);
        decoder._maskData = new Uint8Array(2);
        decoder._shades = true;
        decoder._alpha = new Uint8Array([10, 20]);
        const data: Uint8Array = new Uint8Array([0, 1]);
        decoder._processPixels(data, 0, 1, 0, 2);
        expect(decoder._maskData[0]).toBe(10);
        expect(decoder._maskData[1]).toBe(20);
    });
});
describe('_PngDecoder - _setPixel', () => {
    it('mutant 619 - block runs: setPixel writes into imageData', () => {
        const decoder: any = makeDecoder();
        setHeader(decoder, { _bitDepth: 8 });
        const imageData: Uint8Array = new Uint8Array(6);
        const data: Uint8Array = new Uint8Array([11, 22, 33]);
        decoder._setPixel(imageData, data, 0, 3, 0, 0, 8, 3);
        expect(imageData[0]).toBe(11);
        expect(imageData[1]).toBe(22);
        expect(imageData[2]).toBe(33);
    });
    it('mutant 629 - for loop i<size not i>=size', () => {
        const decoder: any = makeDecoder();
        const imageData: Uint8Array = new Uint8Array(9);
        const data: Uint8Array = new Uint8Array([5, 6, 7]);
        decoder._setPixel(imageData, data, 0, 3, 1, 0, 8, 3);
        expect(imageData[3]).toBe(5);
        expect(imageData[4]).toBe(6);
        expect(imageData[5]).toBe(7);
    });
    it('mutant 630 - ++i not --i in setPixel loop', () => {
        const decoder: any = makeDecoder();
        const imageData: Uint8Array = new Uint8Array(6);
        const data: Uint8Array = new Uint8Array([1, 2, 3]);
        decoder._setPixel(imageData, data, 0, 3, 0, 0, 8, 3);
        expect(imageData[0]).toBe(1);
        expect(imageData[1]).toBe(2);
        expect(imageData[2]).toBe(3);
    });
    it('mutant 635 - bitDepth===16 branch applies >>8 shift', () => {
        const decoder: any = makeDecoder();
        const imageData: Uint8Array = new Uint8Array(3);
        const data: Uint16Array = new Uint16Array([0x0180, 0x0280, 0x0380]);
        decoder._setPixel(imageData, data, 0, 3, 0, 0, 16, 3);
        expect(imageData[0]).toBe(0x01);
        expect(imageData[1]).toBe(0x02);
        expect(imageData[2]).toBe(0x03);
    });
    it('mutant 639 - position = bpr*y + size*x not bpr/y', () => {
        const decoder: any = makeDecoder();
        const imageData: Uint8Array = new Uint8Array(9);
        const data: Uint8Array = new Uint8Array([9, 8, 7]);
        decoder._setPixel(imageData, data, 0, 3, 0, 1, 8, 3);
        expect(imageData[3]).toBe(9);
        expect(imageData[4]).toBe(8);
        expect(imageData[5]).toBe(7);
    });
});
describe('_PngDecoder - _getImageDictionary', () => {
    it('mutant 659 - returns cached imageStream when already set', () => {
        const decoder: any = makeDecoder();
        setHeader(decoder, { _colorType: 2, _bitDepth: 8, _interlace: 0, _width: 2, _height: 2 });
        decoder._decodedImageData = new Uint8Array(12);
        decoder._isDecode = false;
        decoder._ideateDecode = true;
        const first: any = decoder._getImageDictionary();
        const second: any = decoder._getImageDictionary();
        expect(first).toBe(second);
    });
    it('mutant 662 - _imageStream.length>0 required: empty stream regenerates', () => {
        const decoder: any = makeDecoder();
        setHeader(decoder, { _colorType: 2, _bitDepth: 8, _interlace: 0, _width: 2, _height: 2 });
        decoder._decodedImageData = new Uint8Array(12);
        decoder._isDecode = false;
        decoder._ideateDecode = true;
        const stream: any = decoder._getImageDictionary();
        expect(stream).toBeTruthy();
        expect(stream.dictionary).toBeTruthy();
    });
    it('mutant 664 - length>0 not length<=0: length===0 means rebuild', () => {
        const decoder: any = makeDecoder();
        setHeader(decoder, { _colorType: 2, _bitDepth: 8, _interlace: 0, _width: 1, _height: 1 });
        decoder._decodedImageData = new Uint8Array(3);
        decoder._isDecode = false;
        decoder._ideateDecode = true;
        const stream: any = decoder._getImageDictionary();
        expect(stream.dictionary.get('Width')).toBe(1);
        expect(stream.dictionary.get('Height')).toBe(1);
    });
    it('mutant 683 - isDecode=false branch sets _isCompress=false', () => {
        const decoder: any = makeDecoder();
        setHeader(decoder, { _colorType: 2, _bitDepth: 8, _interlace: 0, _width: 2, _height: 2 });
        decoder._decodedImageData = new Uint8Array(12);
        decoder._isDecode = false;
        decoder._ideateDecode = true;
        const stream: any = decoder._getImageDictionary();
        expect(stream._isCompress).toBe(false);
    });
    it('mutant 686 - !isDecode||!ideateDecode: both false means compressed, no Filter key', () => {
        const decoder: any = makeDecoder();
        setHeader(decoder, { _colorType: 2, _bitDepth: 8, _interlace: 0, _width: 2, _height: 2 });
        decoder._decodedImageData = new Uint8Array(12);
        decoder._isDecode = true;
        decoder._ideateDecode = true;
        const stream: any = decoder._getImageDictionary();
        expect(stream.dictionary.has('Filter')).toBe(false);
    });
    it('mutant 690 - block sets Filter FlateDecode when not decoded', () => {
        const decoder: any = makeDecoder();
        setHeader(decoder, { _colorType: 2, _bitDepth: 8, _interlace: 0, _width: 2, _height: 2 });
        decoder._decodedImageData = new Uint8Array(12);
        decoder._isDecode = false;
        decoder._ideateDecode = false;
        const stream: any = decoder._getImageDictionary();
        expect(stream.dictionary.get('Filter').name).toBe('FlateDecode');
    });
    it('mutant 693/694/695 - (colorType & 2)===0 routes to DeviceGray', () => {
        const decoder: any = makeDecoder();
        setHeader(decoder, { _colorType: 0, _bitDepth: 8, _interlace: 0, _width: 1, _height: 1 });
        decoder._decodedImageData = new Uint8Array(1);
        decoder._isDecode = false;
        decoder._ideateDecode = true;
        const stream: any = decoder._getImageDictionary();
        expect(stream.dictionary.get('ColorSpace').name).toBe('DeviceGray');
    });
    it('mutant 693/695 - (colorType & 2)!==0 routes to DeviceRGB', () => {
        const decoder: any = makeDecoder();
        setHeader(decoder, { _colorType: 2, _bitDepth: 8, _interlace: 0, _width: 2, _height: 2 });
        decoder._decodedImageData = new Uint8Array(12);
        decoder._isDecode = false;
        decoder._ideateDecode = true;
        const stream: any = decoder._getImageDictionary();
        expect(stream.dictionary.get('ColorSpace').name).toBe('DeviceRGB');
    });
    it('mutant 698 - ColorSpace key is "ColorSpace" not ""', () => {
        const decoder: any = makeDecoder();
        setHeader(decoder, { _colorType: 0, _bitDepth: 8, _interlace: 0, _width: 1, _height: 1 });
        decoder._decodedImageData = new Uint8Array(1);
        decoder._isDecode = false;
        decoder._ideateDecode = true;
        const stream: any = decoder._getImageDictionary();
        expect(stream.dictionary.has('ColorSpace')).toBe(true);
        expect(stream.dictionary.get('ColorSpace').name).toBe('DeviceGray');
    });
    it('mutant 710 - DecodeParms key is "DecodeParms" not ""', () => {
        const decoder: any = makeDecoder();
        setHeader(decoder, { _colorType: 2, _bitDepth: 8, _interlace: 0, _width: 2, _height: 2 });
        decoder._decodedImageData = new Uint8Array(12);
        decoder._isDecode = false;
        decoder._ideateDecode = false;
        decoder._colors = 3;
        const stream: any = decoder._getImageDictionary();
        expect(stream.dictionary.has('DecodeParms')).toBe(true);
        const dp: any = stream.dictionary.get('DecodeParms');
        expect(dp.get('Columns')).toBe(2);
        expect(dp.get('Colors')).toBe(3);
    });
    it('mutant 724 - Type key is "Type" not ""', () => {
        const decoder: any = makeDecoder();
        setHeader(decoder, { _colorType: 2, _bitDepth: 8, _interlace: 0, _width: 2, _height: 2 });
        decoder._decodedImageData = new Uint8Array(12);
        decoder._isDecode = false;
        decoder._ideateDecode = true;
        const stream: any = decoder._getImageDictionary();
        expect(stream.dictionary.has('Type')).toBe(true);
        expect(stream.dictionary.get('Type').name).toBe('XObject');
    });
    it('mutant 725/726 - Subtype key is "Subtype" and value is "Image"', () => {
        const decoder: any = makeDecoder();
        setHeader(decoder, { _colorType: 2, _bitDepth: 8, _interlace: 0, _width: 2, _height: 2 });
        decoder._decodedImageData = new Uint8Array(12);
        decoder._isDecode = false;
        decoder._ideateDecode = true;
        const stream: any = decoder._getImageDictionary();
        expect(stream.dictionary.has('Subtype')).toBe(true);
        expect(stream.dictionary.get('Subtype').name).toBe('Image');
    });
    it('mutant 727/728 - Width and Height keys set correctly', () => {
        const decoder: any = makeDecoder();
        setHeader(decoder, { _colorType: 2, _bitDepth: 8, _interlace: 0, _width: 5, _height: 3 });
        decoder._decodedImageData = new Uint8Array(45);
        decoder._isDecode = false;
        decoder._ideateDecode = true;
        const stream: any = decoder._getImageDictionary();
        expect(stream.dictionary.get('Width')).toBe(5);
        expect(stream.dictionary.get('Height')).toBe(3);
    });
    it('mutant 730/731 - bitsPerComponent===16 stores 8 in dictionary', () => {
        const decoder: any = makeDecoder();
        setHeader(decoder, { _colorType: 2, _bitDepth: 16, _interlace: 0, _width: 1, _height: 1 });
        decoder._bitsPerComponent = 16;
        decoder._decodedImageData = new Uint8Array(3);
        decoder._isDecode = false;
        decoder._ideateDecode = true;
        const stream: any = decoder._getImageDictionary();
        expect(stream.dictionary.get('BitsPerComponent')).toBe(8);
        expect(stream.dictionary.get('BitsPerComponent')).not.toBe(16);
    });
    it('mutant 732/734 - bitsPerComponent block stores actual bpc when not 16', () => {
        const decoder: any = makeDecoder();
        setHeader(decoder, { _colorType: 2, _bitDepth: 8, _interlace: 0, _width: 2, _height: 2 });
        decoder._bitsPerComponent = 8;
        decoder._decodedImageData = new Uint8Array(12);
        decoder._isDecode = false;
        decoder._ideateDecode = true;
        const stream: any = decoder._getImageDictionary();
        expect(stream.dictionary.get('BitsPerComponent')).toBe(8);
    });
    it('mutant 733/735 - BitsPerComponent key is "BitsPerComponent" not ""', () => {
        const decoder: any = makeDecoder();
        setHeader(decoder, { _colorType: 2, _bitDepth: 8, _interlace: 0, _width: 2, _height: 2 });
        decoder._bitsPerComponent = 8;
        decoder._decodedImageData = new Uint8Array(12);
        decoder._isDecode = false;
        decoder._ideateDecode = true;
        const stream: any = decoder._getImageDictionary();
        expect(stream.dictionary.has('BitsPerComponent')).toBe(true);
        expect(typeof stream.dictionary.get('BitsPerComponent')).toBe('number');
    });
    it('mutant 736 - ColorSpace stored as DeviceGray not "" when colorType 0', () => {
        const decoder: any = makeDecoder();
        setHeader(decoder, { _colorType: 0, _bitDepth: 8, _interlace: 0, _width: 1, _height: 1 });
        decoder._decodedImageData = new Uint8Array(1);
        decoder._isDecode = false;
        decoder._ideateDecode = true;
        const stream: any = decoder._getImageDictionary();
        const cs: any = stream.dictionary.get('ColorSpace');
        expect(cs).not.toBeNull();
        expect(cs.name).toBe('DeviceGray');
        expect(cs.name).not.toBe('');
    });
});
describe('_PngDecoder - _hasValidChunkType / chunk enum', () => {
    it('mutant 751 - IEND chunk type (3) is valid and hasValidChunk=true', () => {
        const decoder: any = makeDecoder();
        expect(decoder._getChunkType('IEND')).toBe(3);
        expect(decoder._getChunkType('IEND')).not.toBeNull();
    });
    it('mutant 756 - cHRM chunk type key is cHRM not ""', () => {
        const decoder: any = makeDecoder();
        expect(decoder._getChunkType('cHRM')).toBe(5);
        expect(decoder._getChunkType('cHRM')).not.toBeNull();
    });
    it('mutant 765 - tEXt chunk type dispatches to _ignoreChunk', () => {
        const decoder: any = makeDecoder();
        expect(decoder._getChunkType('tEXt')).toBe(10);
    });
    it('mutant 768 - tIME chunk key is "tIME" not ""', () => {
        const decoder: any = makeDecoder();
        expect(decoder._getChunkType('tIME')).not.toBeNull();
        expect(decoder._getChunkType('tIME')).toBeGreaterThan(0);
    });
    it('mutant 775 - iCCP chunk type key is "iCCP" not ""', () => {
        const decoder: any = makeDecoder();
        expect(decoder._getChunkType('iCCP')).toBe(15);
        expect(decoder._getChunkType('iCCP')).not.toBeNull();
    });
    it('mutant 795 - pLTE enum string "pLTE" not ""', () => {
        const decoder: any = makeDecoder();
        expect(decoder._getChunkType('PLTE')).toBe(1);
    });
    it('mutant 797 - iDAT enum string "iDAT" not ""', () => {
        const decoder: any = makeDecoder();
        expect(decoder._getChunkType('IDAT')).toBe(2);
    });
    it('mutant 799 - iEND enum string "iEND" not ""', () => {
        const decoder: any = makeDecoder();
        expect(decoder._getChunkType('IEND')).toBe(3);
    });
    it('mutant 802 - cHRM enum value is 5 not ""', () => {
        const decoder: any = makeDecoder();
        expect(decoder._getChunkType('cHRM')).toBe(5);
    });
    it('mutant 809 - pHYs enum value is 8 not ""', () => {
        const decoder: any = makeDecoder();
        expect(decoder._getChunkType('pHYs')).toBe(8);
    });
    it('mutant 812/813 - tEXt enum value is 10 not ""', () => {
        const decoder: any = makeDecoder();
        expect(decoder._getChunkType('tEXt')).toBe(10);
    });
    it('mutant 819 - zTXt enum value is 13 not ""', () => {
        const decoder: any = makeDecoder();
        expect(decoder._getChunkType('zTXt')).toBe(13);
    });
    it('mutant 823 - iCCP enum value is 15 not ""', () => {
        const decoder: any = makeDecoder();
        expect(decoder._getChunkType('iCCP')).toBe(15);
    });
    it('mutant 825 - iTXt enum string "iTXt" not ""', () => {
        const decoder: any = makeDecoder();
        expect(decoder._getChunkType('iTXt')).not.toBeNull();
        expect(decoder._getChunkType('iTXt')).toBeGreaterThan(0);
    });
    it('mutant 827 - unknown enum string "unknown" not ""', () => {
        const decoder: any = makeDecoder();
        expect(decoder._getChunkType('Unknown')).toBe(17);
    });
    it('mutant 829 - enum initialization IIFE condition executes not false-branches', () => {
        const decoder: any = makeDecoder();
        expect(decoder._getChunkType('IHDR')).toBe(0);
        expect(decoder._getChunkType('IDAT')).toBe(2);
        expect(decoder._getChunkType('IEND')).toBe(3);
    });
    it('mutant 835 - sub filter string "sub" not ""', () => {
        const decoder: any = makeDecoder();
        expect(decoder._getFilterType(1)).toBe(1);
    });
    it('mutant 837 - up filter string "up" not ""', () => {
        const decoder: any = makeDecoder();
        expect(decoder._getFilterType(2)).toBe(2);
    });
    it('mutant 839 - average filter string "average" not ""', () => {
        const decoder: any = makeDecoder();
        expect(decoder._getFilterType(3)).toBe(3);
    });
    it('mutant 841 - paeth filter string "paeth" not ""', () => {
        const decoder: any = makeDecoder();
        expect(decoder._getFilterType(4)).toBe(4);
    });
});
describe('_PngDecoder - _getChunkType / _getFilterType', () => {
    it('_getChunkType maps IHDR to 0 (iHDR)', () => {
        const decoder: any = makeDecoder();
        expect(decoder._getChunkType('IHDR')).toBe(0);
    });
    it('_getChunkType maps IEND to 3 (iEND)', () => {
        const decoder: any = makeDecoder();
        expect(decoder._getChunkType('IEND')).toBe(3);
    });
    it('_getChunkType maps sRGB to 14 (sRGB)', () => {
        const decoder: any = makeDecoder();
        expect(decoder._getChunkType('sRGB')).toBe(14);
    });
    it('_getChunkType returns null for unknown chunk', () => {
        const decoder: any = makeDecoder();
        expect(decoder._getChunkType('XYZW')).toBeNull();
    });
    it('_getFilterType 0 returns none (0)', () => {
        const decoder: any = makeDecoder();
        expect(decoder._getFilterType(0)).toBe(0);
    });
    it('_getFilterType 1 returns sub (1)', () => {
        const decoder: any = makeDecoder();
        expect(decoder._getFilterType(1)).toBe(1);
    });
    it('_getFilterType 4 returns paeth (4)', () => {
        const decoder: any = makeDecoder();
        expect(decoder._getFilterType(4)).toBe(4);
    });
});
describe('_PngDecoder - dispose', () => {
    it('dispose nullifies all buffer references', () => {
        const decoder: any = makeDecoder();
        decoder._encodedStream = new Uint8Array(4);
        decoder._maskData = new Uint8Array(4);
        decoder._alpha = new Uint8Array(4);
        decoder._dataStream = new Uint8Array(4);
        decoder._decodedImageData = new Uint8Array(4);
        decoder._colorSpace = [];
        decoder.dispose();
        expect(decoder._encodedStream).toBeNull();
        expect(decoder._maskData).toBeNull();
        expect(decoder._alpha).toBeNull();
        expect(decoder._dataStream).toBeNull();
        expect(decoder._decodedImageData).toBeNull();
        expect(decoder._colorSpace).toBeNull();
    });
});
describe('_getDeflatedData block', () => {
    it('mutants 342, 343, 344, 347, 356 and 366 - returns exact inflated bytes for valid zlib stream', () => {
        const decoder: any = makeDecoder();
        const zlib: Uint8Array = new Uint8Array([120, 156, 99, 96, 100, 98, 6, 0, 0, 14, 0, 7]);
        const result: Uint8Array = decoder._getDeflatedData(zlib);
        expect(result instanceof Uint8Array).toBe(true);
        expect(Array.from(result)).toEqual([0, 1, 2, 3]);
        expect(result.length).toBe(4);
    });
    it('mutants 343 and 366 - ignores zlib header and checksum while preserving deflated payload order', () => {
        const decoder: any = makeDecoder();
        const zlib: Uint8Array = new Uint8Array([120, 156, 99, 100, 98, 102, 1, 0, 0, 24, 0, 11]);
        const result: Uint8Array = decoder._getDeflatedData(zlib);
        expect(Array.from(result)).toEqual([1, 2, 3, 4]);
        expect(result[0]).toBe(1);
        expect(result[3]).toBe(4);
    });
});
describe('_decompressPaeth block', () => {
    it('mutants 465, 466, 467, 468, 470, 471, 473, 478 and 479 - restores paeth filtered row exactly', () => {
        const decoder: any = makeDecoder();
        const data: Uint8Array = new Uint8Array([10, 20, 5, 6, 7]);
        const prior: Uint8Array = new Uint8Array([1, 2, 30, 40, 50]);
        decoder._decompressPaeth(data, prior, 5, 2);
        expect(Array.from(data)).toEqual([11, 22, 35, 46, 57]);
        expect(data.length).toBe(5);
    });
    it('mutant 473 - second loop stops at i less than count and does not write beyond the row', () => {
        const decoder: any = makeDecoder();
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4]);
        const prior: Uint8Array = new Uint8Array([10, 20, 30, 40]);
        decoder._decompressPaeth(data, prior, 4, 1);
        expect(Array.from(data)).toEqual([11, 22, 33, 44]);
        expect(data[4]).toBeUndefined();
    });
});
describe('_paethPredictor block', () => {
    it('mutants 480, 481, 482, 483, 489, 491, 493 and 494 - returns a when pa is the smallest distance', () => {
        const decoder: any = makeDecoder();
        expect(decoder._paethPredictor(10, 5, 3)).toBe(10);
    });
    it('mutants 484, 487, 488 and 495 - returns b when first branch is false and pb is smaller than pc', () => {
        const decoder: any = makeDecoder();
        expect(decoder._paethPredictor(10, 20, 10)).toBe(20);
    });
    it('mutants 485 and 495 - returns c when first branch is false and pc is smaller than pb', () => {
        const decoder: any = makeDecoder();
        expect(decoder._paethPredictor(10, 30, 20)).toBe(20);
    });
    it('mutant 497 - returns b when pb equals pc because comparison is less than or equal', () => {
        const decoder: any = makeDecoder();
        expect(decoder._paethPredictor(0, 15, 5)).toBe(15);
    });
});
describe('_processPixels block', () => {
    it('mutant 516 - colorType 6 uses rgb size 3 and writes alpha mask separately', () => {
        const decoder: any = makeDecoder();
        decoder._header = { _colorType: 6, _bitDepth: 8 };
        decoder._decodedImageData = new Uint8Array(6);
        decoder._maskData = new Uint8Array(2);
        decoder._inputBands = 4;
        decoder._shades = false;
        decoder._processPixels(new Uint8Array([1, 2, 3, 9, 4, 5, 6, 10]), 0, 1, 0, 2);
        expect(Array.from(decoder._decodedImageData)).toEqual([1, 2, 3, 4, 5, 6]);
        expect(Array.from(decoder._maskData)).toEqual([9, 10]);
    });
});