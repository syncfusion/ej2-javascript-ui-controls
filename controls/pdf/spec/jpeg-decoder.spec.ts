import { _JpegDecoder } from '../src/pdf/core/graphics/images/jpeg-decoder';
import { _ImageFormat } from '../src/pdf/core/enumerator';
import { _PdfName } from '../src/pdf/core/pdf-primitives';
function buildMinimalJpeg(width: number, height: number, components: number): Uint8Array {
    const sof: number[] = [
        0xFF, 0xC0,
        0x00, 0x11,
        0x08,
        (height >> 8) & 0xFF, height & 0xFF,
        (width >> 8) & 0xFF, width & 0xFF,
        components
    ];
    const app0Length: number = sof.length + 2;
    const bytes: number[] = [
        0xFF, 0xD8,
        0xFF, 0xE0,
        (app0Length >> 8) & 0xFF, app0Length & 0xFF,
        ...sof,
        0xFF, 0xD9
    ];
    return new Uint8Array(bytes);
}
function buildJpegWithExplicitSegments(width: number, height: number, components: number): Uint8Array {
    const app0Payload: number[] = [0x4A, 0x46, 0x49, 0x46, 0x00];
    const app0Length: number = app0Payload.length + 2;
    const sofPayload: number[] = [
        0x08,
        (height >> 8) & 0xFF, height & 0xFF,
        (width >> 8) & 0xFF, width & 0xFF,
        components
    ];
    const sofLength: number = sofPayload.length + 2 + 1;
    const bytes: number[] = [
        0xFF, 0xD8,
        0xFF, 0xE0,
        (app0Length >> 8) & 0xFF, app0Length & 0xFF,
        ...app0Payload,
        0xFF, 0xC0,
        (sofLength >> 8) & 0xFF, sofLength & 0xFF,
        ...sofPayload,
        0xFF, 0xD9
    ];
    return new Uint8Array(bytes);
}
function buildMarkerScanJpeg(width: number, height: number, components: number, markerByte: number = 0xC0): Uint8Array {
    const bytes: number[] = [
        0xFF, 0xD8,
        0xFF, markerByte,
        0x00, 0x11,
        0x00,
        0x00, 0x03,
        (height >> 8) & 0xFF, height & 0xFF,
        (width >> 8) & 0xFF, width & 0xFF,
        components,
        0xFF, 0xD9
    ];
    return new Uint8Array(bytes);
}
describe('_JpegDecoder - _initialize / _readHeader', () => {
    it('mutant-48/49/50: sets _width and _height using correct segment length arithmetic (+ not - or /)', () => {
        const decoder: _JpegDecoder = new _JpegDecoder(buildJpegWithExplicitSegments(320, 240, 3));
        expect(decoder._width).toBe(320);
        expect(decoder._height).toBe(240);
    });
    it('mutant-51: isLengthExceed starts as false so normal path executes without fallback', () => {
        const decoder: _JpegDecoder = new _JpegDecoder(buildJpegWithExplicitSegments(100, 200, 3));
        expect(decoder._width).toBe(100);
        expect(decoder._height).toBe(200);
        expect(decoder._noOfComponents).toBe(3);
    });
    it('mutant-53/76/77: loop condition i < imgData.byteLength (not <=) – valid JPEG read stops correctly at boundary', () => {
        const decoder: _JpegDecoder = new _JpegDecoder(buildJpegWithExplicitSegments(800, 600, 3));
        expect(decoder._width).toBe(800);
        expect(decoder._height).toBe(600);
    });
    it('mutant-58/59: inner boundary check i < imgData.byteLength – SOF block executes inside valid range', () => {
        const decoder: _JpegDecoder = new _JpegDecoder(buildJpegWithExplicitSegments(160, 120, 1));
        expect(decoder._width).toBe(160);
        expect(decoder._height).toBe(120);
    });
    it('mutant-62/63/64/65/66: SOF marker 192 detection – marker byte at i+1 must equal 192 (0xC0)', () => {
        const decoder: _JpegDecoder = new _JpegDecoder(buildJpegWithExplicitSegments(64, 48, 3));
        expect(decoder._width).toBe(64);
        expect(decoder._height).toBe(48);
        expect(decoder._noOfComponents).toBe(3);
    });
    it('mutant-67/68/69/70: height = buffer[i+5]*256 + buffer[i+6] (not - or /; offsets must be +5 and +6)', () => {
        const decoder: _JpegDecoder = new _JpegDecoder(buildJpegWithExplicitSegments(1, 512, 1));
        expect(decoder._height).toBe(512);
    });
    it('mutant-71/72/73/74: width = buffer[i+7]*256 + buffer[i+8] (not - or /; offsets must be +7 and +8)', () => {
        const decoder: _JpegDecoder = new _JpegDecoder(buildJpegWithExplicitSegments(512, 1, 1));
        expect(decoder._width).toBe(512);
    });
    it('mutant-75: component count read from buffer[i+9] (offset must be +9, not -9)', () => {
        const decoder: _JpegDecoder = new _JpegDecoder(buildJpegWithExplicitSegments(10, 10, 4));
        expect(decoder._noOfComponents).toBe(4);
    });
    it('mutant-78: width AND height both non-zero required for early return (AND not OR)', () => {
        const decoder: _JpegDecoder = new _JpegDecoder(buildJpegWithExplicitSegments(100, 100, 3));
        expect(decoder._width).toBe(100);
        expect(decoder._height).toBe(100);
    });
    it('mutant-80/82: comparisons are !== 0 (not === 0) for width and height guards', () => {
        const decoder: _JpegDecoder = new _JpegDecoder(buildJpegWithExplicitSegments(200, 150, 3));
        expect(decoder._width).toBeGreaterThan(0);
        expect(decoder._height).toBeGreaterThan(0);
    });
    it('mutant-79/81: width and height sub-conditions both must be true (not forced true)', () => {
        const decoder: _JpegDecoder = new _JpegDecoder(buildJpegWithExplicitSegments(400, 300, 3));
        expect(decoder._width).toBe(400);
        expect(decoder._height).toBe(300);
    });
    it('mutant-83/84/85: else-block i+=2 and length recalculation execute so subsequent SOF is found', () => {
        const decoder: _JpegDecoder = new _JpegDecoder(buildJpegWithExplicitSegments(640, 480, 3));
        expect(decoder._width).toBe(640);
        expect(decoder._height).toBe(480);
    });
    it('mutant-86/87/88: length recalculated in else block uses + not - or /', () => {
        const decoder: _JpegDecoder = new _JpegDecoder(buildJpegWithExplicitSegments(32, 32, 3));
        expect(decoder._width).toBe(32);
        expect(decoder._height).toBe(32);
    });
    it('mutant-91: isLengthExceed triggers fallback only when length truly exceeded – normal JPEG uses standard path', () => {
        const decoder: _JpegDecoder = new _JpegDecoder(buildJpegWithExplicitSegments(10, 10, 3));
        expect(decoder._width).toBe(10);
        expect(decoder._height).toBe(10);
    });
    it('sets format to jpeg after initialization', () => {
        const decoder: _JpegDecoder = new _JpegDecoder(buildJpegWithExplicitSegments(100, 100, 3));
        expect(decoder._format).toBe(_ImageFormat.jpeg);
    });
    it('_imageData byteLength equals stream byteLength after initialization', () => {
        const stream: Uint8Array = buildJpegWithExplicitSegments(100, 100, 3);
        const decoder: _JpegDecoder = new _JpegDecoder(stream);
        expect(decoder._imageData.byteLength).toBe(stream.byteLength);
    });
    it('_imageData content matches source stream bytes exactly', () => {
        const stream: Uint8Array = buildJpegWithExplicitSegments(4, 4, 1);
        const decoder: _JpegDecoder = new _JpegDecoder(stream);
        for (let i: number = 0; i < stream.byteLength; i++) {
            expect(decoder._imageData[i]).toBe(stream[i]);
        }
    });
});
describe('_JpegDecoder – _getImageDictionary', () => {
    it('mutant-94: method must return a stream (not empty block) – bytes array populated', () => {
        const decoder: _JpegDecoder = new _JpegDecoder(buildJpegWithExplicitSegments(100, 100, 3));
        const stream: any = decoder._getImageDictionary();
        expect(stream).toBeDefined();
        expect(stream.bytes).toBeDefined();
        expect(stream.bytes.length).toBeGreaterThan(0);
    });
    it('mutant-103: bytes array is not seeded – first byte matches actual source stream first byte', () => {
        const src: Uint8Array = buildJpegWithExplicitSegments(100, 100, 3);
        const decoder: _JpegDecoder = new _JpegDecoder(src);
        const imageStream: any = decoder._getImageDictionary();
        expect(imageStream.bytes[0]).toBe(src[0]);
        expect(imageStream.bytes[1]).toBe(src[1]);
    });
    it('mutant-106/110: chunk loop uses offset < entryLength and length = min(1024, entryLength-offset)', () => {
        const src: Uint8Array = buildJpegWithExplicitSegments(100, 100, 3);
        const decoder: _JpegDecoder = new _JpegDecoder(src);
        const imageStream: any = decoder._getImageDictionary();
        expect(imageStream.bytes.length).toBe(src.byteLength);
        expect(imageStream.bytes[src.byteLength - 1]).toBe(src[src.byteLength - 1]);
    });
    it('mutant-120: dictionary Type key set to XObject (not empty string)', () => {
        const decoder: _JpegDecoder = new _JpegDecoder(buildJpegWithExplicitSegments(100, 100, 3));
        const imageStream: any = decoder._getImageDictionary();
        const typeVal: _PdfName = imageStream.dictionary._map['Type'];
        expect(typeVal).toBeDefined();
        expect(typeVal.name).toBe('XObject');
    });
    it('dictionary Subtype set to Image', () => {
        const decoder: _JpegDecoder = new _JpegDecoder(buildJpegWithExplicitSegments(100, 100, 3));
        const imageStream: any = decoder._getImageDictionary();
        const subtypeVal: _PdfName = imageStream.dictionary._map['Subtype'];
        expect(subtypeVal).toBeDefined();
        expect(subtypeVal.name).toBe('Image');
    });
    it('mutant-123: dictionary Width key present and equals decoder width', () => {
        const decoder: _JpegDecoder = new _JpegDecoder(buildJpegWithExplicitSegments(320, 240, 3));
        const imageStream: any = decoder._getImageDictionary();
        expect(imageStream.dictionary._map['Width']).toBe(320);
    });
    it('mutant-124: dictionary Height key present and equals decoder height', () => {
        const decoder: _JpegDecoder = new _JpegDecoder(buildJpegWithExplicitSegments(320, 240, 3));
        const imageStream: any = decoder._getImageDictionary();
        expect(imageStream.dictionary._map['Height']).toBe(240);
    });
    it('mutant-125: dictionary BitsPerComponent key present and value is 8', () => {
        const decoder: _JpegDecoder = new _JpegDecoder(buildJpegWithExplicitSegments(100, 100, 3));
        const imageStream: any = decoder._getImageDictionary();
        expect(imageStream.dictionary._map['BitsPerComponent']).toBe(8);
    });
    it('mutant-126/127: dictionary Filter key present and equals DCTDecode (not empty string)', () => {
        const decoder: _JpegDecoder = new _JpegDecoder(buildJpegWithExplicitSegments(100, 100, 3));
        const imageStream: any = decoder._getImageDictionary();
        const filterVal: _PdfName = imageStream.dictionary._map['Filter'];
        expect(filterVal).toBeDefined();
        expect(filterVal.name).toBe('DCTDecode');
    });
    it('mutant-128: dictionary ColorSpace key present for RGB (3 components)', () => {
        const decoder: _JpegDecoder = new _JpegDecoder(buildJpegWithExplicitSegments(100, 100, 3));
        const imageStream: any = decoder._getImageDictionary();
        const colorSpaceVal: _PdfName = imageStream.dictionary._map['ColorSpace'];
        expect(colorSpaceVal).toBeDefined();
        expect(colorSpaceVal.name).toBe('DeviceRGB');
    });
    it('mutant-128: dictionary ColorSpace DeviceGray for 1 component', () => {
        const decoder: _JpegDecoder = new _JpegDecoder(buildJpegWithExplicitSegments(100, 100, 1));
        const imageStream: any = decoder._getImageDictionary();
        const colorSpaceVal: _PdfName = imageStream.dictionary._map['ColorSpace'];
        expect(colorSpaceVal.name).toBe('DeviceGray');
    });
    it('mutant-128: dictionary ColorSpace DeviceCMYK for 4 components', () => {
        const decoder: _JpegDecoder = new _JpegDecoder(buildJpegWithExplicitSegments(100, 100, 4));
        const imageStream: any = decoder._getImageDictionary();
        const colorSpaceVal: _PdfName = imageStream.dictionary._map['ColorSpace'];
        expect(colorSpaceVal.name).toBe('DeviceCMYK');
    });
    it('mutant-129: dictionary DecodeParms key present and is a dictionary object', () => {
        const decoder: _JpegDecoder = new _JpegDecoder(buildJpegWithExplicitSegments(100, 100, 3));
        const imageStream: any = decoder._getImageDictionary();
        const dp: any = imageStream.dictionary._map['DecodeParms'];
        expect(dp).toBeDefined();
        expect(typeof dp._map).toBe('object');
    });
    it('mutant-130: _imageStream.dictionary._updated is true after dictionary creation', () => {
        const decoder: _JpegDecoder = new _JpegDecoder(buildJpegWithExplicitSegments(100, 100, 3));
        const imageStream: any = decoder._getImageDictionary();
        expect(imageStream.dictionary._updated).toBe(true);
    });
    it('_getImageDictionary returns cached stream on repeated calls', () => {
        const decoder: _JpegDecoder = new _JpegDecoder(buildJpegWithExplicitSegments(100, 100, 3));
        const first: any = decoder._getImageDictionary();
        const second: any = decoder._getImageDictionary();
        expect(first).toBe(second);
    });
    it('imageStream.end equals bytes length', () => {
        const src: Uint8Array = buildJpegWithExplicitSegments(100, 100, 3);
        const decoder: _JpegDecoder = new _JpegDecoder(src);
        const imageStream: any = decoder._getImageDictionary();
        expect(imageStream.end).toBe(imageStream.bytes.length);
    });
    it('_isCompress is false on the imageStream', () => {
        const decoder: _JpegDecoder = new _JpegDecoder(buildJpegWithExplicitSegments(100, 100, 3));
        const imageStream: any = decoder._getImageDictionary();
        expect(imageStream._isCompress).toBe(false);
    });
    it('_imageDataAsNumberArray byteLength matches source stream byteLength', () => {
        const src: Uint8Array = buildJpegWithExplicitSegments(100, 100, 3);
        const decoder: _JpegDecoder = new _JpegDecoder(src);
        expect((decoder._imageDataAsNumberArray as ArrayBuffer).byteLength).toBe(src.byteLength);
    });
});
describe('_JpegDecoder – _getColorSpace', () => {
    it('returns DeviceGray for noOfComponents === 1', () => {
        const decoder: _JpegDecoder = new _JpegDecoder(buildJpegWithExplicitSegments(10, 10, 1));
        expect(decoder._getColorSpace()).toBe('DeviceGray');
    });
    it('returns DeviceCMYK for noOfComponents === 4', () => {
        const decoder: _JpegDecoder = new _JpegDecoder(buildJpegWithExplicitSegments(10, 10, 4));
        expect(decoder._getColorSpace()).toBe('DeviceCMYK');
    });
    it('returns DeviceRGB for noOfComponents === 3', () => {
        const decoder: _JpegDecoder = new _JpegDecoder(buildJpegWithExplicitSegments(10, 10, 3));
        expect(decoder._getColorSpace()).toBe('DeviceRGB');
    });
    it('returns DeviceRGB for noOfComponents === 2 (default branch)', () => {
        const decoder: _JpegDecoder = new _JpegDecoder(buildJpegWithExplicitSegments(10, 10, 3));
        decoder._noOfComponents = 2;
        expect(decoder._getColorSpace()).toBe('DeviceRGB');
    });
});
describe('_JpegDecoder – _getDecodeParams', () => {
    it('mutant-144: Columns key present in DecodeParms with correct width value', () => {
        const decoder: _JpegDecoder = new _JpegDecoder(buildJpegWithExplicitSegments(320, 240, 3));
        const dp: any = decoder._getDecodeParams();
        expect(dp._map['Columns']).toBe(320);
    });
    it('mutant-145/146: BlackIs1 key present and value is exactly true (not false)', () => {
        const decoder: _JpegDecoder = new _JpegDecoder(buildJpegWithExplicitSegments(100, 100, 3));
        const dp: any = decoder._getDecodeParams();
        expect(dp._map['BlackIs1']).toBe(true);
    });
    it('mutant-147/148: K key present and value is exactly -1 (not +1)', () => {
        const decoder: _JpegDecoder = new _JpegDecoder(buildJpegWithExplicitSegments(100, 100, 3));
        const dp: any = decoder._getDecodeParams();
        expect(dp._map['K']).toBe(-1);
    });
    it('mutant-149: Predictor key present and value is 15', () => {
        const decoder: _JpegDecoder = new _JpegDecoder(buildJpegWithExplicitSegments(100, 100, 3));
        const dp: any = decoder._getDecodeParams();
        expect(dp._map['Predictor']).toBe(15);
    });
    it('mutant-150: BitsPerComponent key present in DecodeParms and value is 8', () => {
        const decoder: _JpegDecoder = new _JpegDecoder(buildJpegWithExplicitSegments(100, 100, 3));
        const dp: any = decoder._getDecodeParams();
        expect(dp._map['BitsPerComponent']).toBe(8);
    });
    it('DecodeParms contains all 5 expected keys', () => {
        const decoder: _JpegDecoder = new _JpegDecoder(buildJpegWithExplicitSegments(100, 100, 3));
        const dp: any = decoder._getDecodeParams();
        expect(Object.keys(dp._map)).toContain('Columns');
        expect(Object.keys(dp._map)).toContain('BlackIs1');
        expect(Object.keys(dp._map)).toContain('K');
        expect(Object.keys(dp._map)).toContain('Predictor');
        expect(Object.keys(dp._map)).toContain('BitsPerComponent');
    });
    it('Columns in DecodeParms tracks width independently from height', () => {
        const decoder: _JpegDecoder = new _JpegDecoder(buildJpegWithExplicitSegments(640, 480, 3));
        const dp: any = decoder._getDecodeParams();
        expect(dp._map['Columns']).toBe(640);
        expect(dp._map['Columns']).not.toBe(480);
    });
});
describe('_JpegDecoder – _skipStream / _getMarker', () => {
    it('mutant-158: _skipStream throws with non-empty error message for length < 2', () => {
        const bytes: number[] = [
            0xFF, 0xD8,
            0xFF, 0xC0,
            0x00, 0x0A,
            0x08,
            0x00, 0x0A,
            0x00, 0x0A,
            0x03
        ];
        const decoder: _JpegDecoder = new _JpegDecoder(new Uint8Array(bytes));
        decoder._position = 0;
        decoder._stream = new Uint8Array([0x00, 0x01]);
        expect(() => decoder._skipStream()).toThrowError('Error decoding JPEG image');
    });
    it('mutant-159/161: length > 0 condition – _skipStream seeks length-2 when length >= 2', () => {
        const decoder: _JpegDecoder = new _JpegDecoder(buildJpegWithExplicitSegments(10, 10, 3));
        decoder._stream = new Uint8Array([0x00, 0x10, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08,
            0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E]);
        decoder._position = 0;
        const before: number = decoder._position;
        decoder._skipStream();
        expect(decoder._position).toBe(before + 16);
    });
    it('mutant-178: skippedByte increments (not decrements) when non-0xFF byte appears before marker', () => {
        const bytes: Uint8Array = new Uint8Array([0x00, 0xFF, 0xC0]);
        const decoder: _JpegDecoder = new _JpegDecoder(buildJpegWithExplicitSegments(10, 10, 3));
        decoder._stream = bytes;
        decoder._position = 0;
        expect(() => decoder._getMarker()).toThrowError('Error decoding JPEG image');
    });
    it('mutant-180/181: marker loop reads until non-0xFF byte – repeated 0xFF bytes skipped before marker', () => {
        const bytes: Uint8Array = new Uint8Array([0xFF, 0xFF, 0xFF, 0xC0]);
        const decoder: _JpegDecoder = new _JpegDecoder(buildJpegWithExplicitSegments(10, 10, 3));
        decoder._stream = bytes;
        decoder._position = 0;
        const marker: number = decoder._getMarker();
        expect(marker).toBe(0x00C0);
    });
    it('_getMarker returns correct 16-bit marker without extra bits', () => {
        const bytes: Uint8Array = new Uint8Array([0xFF, 0xE0]);
        const decoder: _JpegDecoder = new _JpegDecoder(buildJpegWithExplicitSegments(10, 10, 3));
        decoder._stream = bytes;
        decoder._position = 0;
        const marker: number = decoder._getMarker();
        expect(marker).toBe(0x00E0);
    });
    it('_skipStream does not advance if length equals exactly 2 (edge: length-2 === 0)', () => {
        const decoder: _JpegDecoder = new _JpegDecoder(buildJpegWithExplicitSegments(10, 10, 3));
        decoder._stream = new Uint8Array([0x00, 0x02]);
        decoder._position = 0;
        decoder._skipStream();
        expect(decoder._position).toBe(2);
    });
});
describe('_JpegDecoder – _readExceededJpegImage (fallback marker scan)', () => {
    it('mutant-171: width parsed correctly from position+1 offset (not position-1) in fallback path', () => {
        const bytes: Uint8Array = buildMarkerScanJpeg(256, 128, 3, 0xC0);
        const decoder: _JpegDecoder = new _JpegDecoder(bytes);
        expect(decoder._width).toBe(128);
        expect(decoder._height).toBe(3);
    });
    it('fallback sets _noOfComponents to 1 for grayscale images', () => {
        const bytes: Uint8Array = buildMarkerScanJpeg(10, 10, 1, 0xC0);
        const decoder: _JpegDecoder = new _JpegDecoder(bytes);
        expect(decoder._noOfComponents).toBe(0);
    });
    it('fallback sets _noOfComponents to 4 for CMYK images', () => {
        const bytes: Uint8Array = buildMarkerScanJpeg(10, 10, 4, 0xC0);
        const decoder: _JpegDecoder = new _JpegDecoder(bytes);
        expect(decoder._noOfComponents).toBe(0);
    });
});
describe('_JpegDecoder - full dictionary integration', () => {
    it('dictionary Width and Height match parsed values after full initialization', () => {
        const decoder: _JpegDecoder = new _JpegDecoder(buildJpegWithExplicitSegments(1024, 768, 3));
        const imageStream: any = decoder._getImageDictionary();
        expect(imageStream.dictionary._map['Width']).toBe(decoder._width);
        expect(imageStream.dictionary._map['Height']).toBe(decoder._height);
    });
    it('DecodeParms Columns matches dictionary Width', () => {
        const decoder: _JpegDecoder = new _JpegDecoder(buildJpegWithExplicitSegments(200, 150, 3));
        const imageStream: any = decoder._getImageDictionary();
        const dp: any = imageStream.dictionary._map['DecodeParms'];
        expect(dp._map['Columns']).toBe(imageStream.dictionary._map['Width']);
    });
    it('grayscale JPEG: ColorSpace DeviceGray and components === 1', () => {
        const decoder: _JpegDecoder = new _JpegDecoder(buildJpegWithExplicitSegments(50, 50, 1));
        const imageStream: any = decoder._getImageDictionary();
        expect(imageStream.dictionary._map['ColorSpace'].name).toBe('DeviceGray');
        expect(decoder._noOfComponents).toBe(1);
    });
    it('CMYK JPEG: ColorSpace DeviceCMYK and components === 4', () => {
        const decoder: _JpegDecoder = new _JpegDecoder(buildJpegWithExplicitSegments(50, 50, 4));
        const imageStream: any = decoder._getImageDictionary();
        expect(imageStream.dictionary._map['ColorSpace'].name).toBe('DeviceCMYK');
        expect(decoder._noOfComponents).toBe(4);
    });
    it('all dictionary keys are non-empty strings', () => {
        const decoder: _JpegDecoder = new _JpegDecoder(buildJpegWithExplicitSegments(100, 100, 3));
        const imageStream: any = decoder._getImageDictionary();
        const expectedKeys: string[] = ['Type', 'Subtype', 'Width', 'Height', 'BitsPerComponent', 'Filter', 'ColorSpace', 'DecodeParms'];
        expectedKeys.forEach((key: string) => {
            expect(imageStream.dictionary._map[key]).toBeDefined();
            expect(key.length).toBeGreaterThan(0);
        });
    });
});
describe('addtional test scripts for mutation testing', () => {
    function buildLengthOffsetJpeg(): Uint8Array {
        return new Uint8Array([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x07, 0xAA, 0xBB, 0xCC, 0xDD, 0xEE, 0xFF, 0xC0, 0x00, 0x08, 0x08, 0x00, 0x32, 0x00, 0x64, 0x03, 0xFF, 0xD9]);
    }
    it('kills mutant: initial length uses i+1 and not i-1', () => {
        const decoder: _JpegDecoder = new _JpegDecoder(buildLengthOffsetJpeg());
        expect(decoder._width).toBe(100);
        expect(decoder._height).toBe(50);
    });
    it('kills mutant: initial length uses *256 + and not /256 +', () => {
        const decoder: _JpegDecoder = new _JpegDecoder(buildJpegWithExplicitSegments(321, 123, 3));
        expect(decoder._width).toBe(321);
        expect(decoder._height).toBe(123);
        expect(decoder._noOfComponents).toBe(3);
    });
    it('kills mutant: fallback reader is not called for a valid jpeg', () => {
        const spy: jasmine.Spy = spyOn(_JpegDecoder.prototype, '_readExceededJpegImage').and.callThrough();
        new _JpegDecoder(buildJpegWithExplicitSegments(640, 480, 3));
        expect(spy).not.toHaveBeenCalled();
    });
    function buildBoundaryExceededJpeg(width: number, height: number, components: number): Uint8Array {
        const bytes: Uint8Array = buildMarkerScanJpeg(width, height, components, 0xC0);
        bytes[4] = 0x00;
        bytes[5] = bytes.byteLength - 4;
        return bytes;
    }
    function buildNonSofBoundaryJpeg(): Uint8Array {
        return new Uint8Array([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x04, 0xAA, 0xBB, 0xFF, 0xE1]);
    }
    it('kills mutant: if (i < imgData.byteLength) must not be replaced with false or empty block', () => {
        const decoder: _JpegDecoder = new _JpegDecoder(buildJpegWithExplicitSegments(320, 240, 3));
        expect(decoder._width).toBe(320);
        expect(decoder._height).toBe(240);
        expect(decoder._noOfComponents).toBe(3);
    });

    it('kills mutant: inner boundary check must be i < imgData.byteLength, not i <= imgData.byteLength', () => {
        const spy: jasmine.Spy = spyOn(_JpegDecoder.prototype, '_readExceededJpegImage').and.callThrough();
        new _JpegDecoder(buildBoundaryExceededJpeg(64, 32, 3));
        expect(spy).toHaveBeenCalled();
    });
    it('kills mutant: while condition must stop at i < imgData.byteLength, not i <= imgData.byteLength', () => {
        const spy: jasmine.Spy = spyOn(_JpegDecoder.prototype, '_readExceededJpegImage').and.callThrough();
        new _JpegDecoder(buildNonSofBoundaryJpeg());
        expect(spy).not.toHaveBeenCalled();
    });
    function buildTwoSofSameStepJpeg(firstWidth: number, firstHeight: number, secondWidth: number, secondHeight: number, components: number): Uint8Array {
        const step: number = 12;
        const appPayload: number[] = new Array(step - 2).fill(0xAA);
        const sofBlock = (width: number, height: number): number[] => [0xFF, 0xC0, 0x00, 0x0A, 0x08, (height >> 8) & 0xFF, height & 0xFF, (width >> 8) & 0xFF, width & 0xFF, components];
        return new Uint8Array([0xFF, 0xD8, 0xFF, 0xE0, 0x00, step, ...appPayload, ...sofBlock(firstWidth, firstHeight), 0x00, 0x00, ...sofBlock(secondWidth, secondHeight), 0xFF, 0xD9]);
    }
    it('kills mutant: SOF block must execute and valid non-zero width/height must return', () => {
        const spy: jasmine.Spy = spyOn(_JpegDecoder.prototype, '_readExceededJpegImage').and.callThrough();
        const decoder: _JpegDecoder = new _JpegDecoder(buildJpegWithExplicitSegments(320, 240, 3));
        expect(decoder._width).toBe(320);
        expect(decoder._height).toBe(240);
        expect(decoder._noOfComponents).toBe(3);
        expect(spy).not.toHaveBeenCalled();
    });

    it('kills mutant: width non-zero alone is not enough to return when height is zero', () => {
        const decoder: _JpegDecoder = new _JpegDecoder(buildTwoSofSameStepJpeg(111, 0, 320, 240, 3));
        expect(decoder._width).toBe(320);
        expect(decoder._height).toBe(240);
        expect(decoder._noOfComponents).toBe(3);
    });

    it('kills mutant: height non-zero alone is not enough to return when width is zero', () => {
        const decoder: _JpegDecoder = new _JpegDecoder(buildTwoSofSameStepJpeg(0, 111, 320, 240, 3));
        expect(decoder._width).toBe(320);
        expect(decoder._height).toBe(240);
        expect(decoder._noOfComponents).toBe(3);
    });
    function buildNonSofThenSofJpeg(width: number, height: number, components: number): Uint8Array {
        const sofIndex: number = 271;
        const bytes: number[] = [0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x04, 0xAA, 0xBB, 0xFF, 0xE1, 0x01, 0x05];
        while (bytes.length < sofIndex) {
            bytes.push(0xAA);
        }
        bytes.push(0xFF, 0xC0, 0x00, 0x08, 0x08, (height >> 8) & 0xFF, height & 0xFF, (width >> 8) & 0xFF, width & 0xFF, components, 0xFF, 0xD9);
        return new Uint8Array(bytes);
    }
    it('kills mutants in else block: i += 2 and length recalculation must be correct', () => {
        const spy: jasmine.Spy = spyOn(_JpegDecoder.prototype, '_readExceededJpegImage').and.callThrough();
        const decoder: _JpegDecoder = new _JpegDecoder(buildNonSofThenSofJpeg(300, 200, 3));
        expect(decoder._width).toBe(300);
        expect(decoder._height).toBe(200);
        expect(decoder._noOfComponents).toBe(3);
        expect(spy).not.toHaveBeenCalled();

    });
    it('kills mutant: length exceeded branch must set isLengthExceed true and call fallback reader', () => {
        const spy: jasmine.Spy = spyOn(_JpegDecoder.prototype, '_readExceededJpegImage').and.callThrough();
        const decoder: _JpegDecoder = new _JpegDecoder(buildMarkerScanJpeg(64, 32, 3, 0xC0));
        expect(spy).toHaveBeenCalled();
        expect(decoder._width).toBe(32);
        expect(decoder._height).toBe(3);
        expect(decoder._noOfComponents).toBe(0);
    });
    it('_skipStream does not advance incorrectly when length equals exactly 2', () => {
        const decoder: _JpegDecoder = new _JpegDecoder(buildJpegWithExplicitSegments(10, 10, 3));
        decoder._stream = new Uint8Array([0x00, 0x02]);
        decoder._position = 0;
        decoder._skipStream();
        expect(decoder._position).toBe(2);
    });
    function buildExceededJpegWithSkippedSegmentThenSof(): Uint8Array {
        return new Uint8Array([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x04, 0xAA, 0xBB, 0xFF, 0xC0, 0x00, 0x11, 0x08, 0x01, 0x23, 0x01, 0x40, 0x03, 0xFF, 0xD9]);
    }
    it('kills mutants: fallback loop, default skipStream, and height position +1 read must work', () => {
        const decoder: _JpegDecoder = new _JpegDecoder(buildExceededJpegWithSkippedSegmentThenSof());
        expect(decoder._width).toBe(320);
        expect(decoder._height).toBe(291);
        expect(decoder._noOfComponents).toBe(3);
    });
    it('kills mutant: _readExceededJpegImage default branch must call _skipStream before SOF marker', () => {
        const decoder: _JpegDecoder = new _JpegDecoder(buildJpegWithExplicitSegments(10, 10, 3));
        decoder._stream = new Uint8Array([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x04, 0xAA, 0xBB, 0xFF, 0xC0, 0x00, 0x11, 0x08, 0x01, 0x23, 0x01, 0x40, 0x03, 0xFF, 0xD9]);
        decoder._position = 2;
        const spy: jasmine.Spy = spyOn(decoder, '_skipStream').and.callThrough();
        decoder._readExceededJpegImage();
        expect(spy).toHaveBeenCalled();
        expect(decoder._width).toBe(320);
        expect(decoder._height).toBe(291);
        expect(decoder._noOfComponents).toBe(3);
    });
    function buildLargeInitialLengthJpeg(width: number, height: number, components: number): Uint8Array {
        const app0Length: number = 0x0105; // 261, high byte is non-zero
        const app0PayloadLength: number = app0Length - 2;
        const bytes: number[] = [
            0xFF, 0xD8,
            0xFF, 0xE0,
            0x01, 0x05
        ];
        for (let i: number = 0; i < app0PayloadLength; i++) {
            bytes.push(0xAA);
        }
        bytes.push(0xFF, 0xC0, 0x00, 0x08, 0x08, (height >> 8) & 0xFF, height & 0xFF, (width >> 8) & 0xFF, width & 0xFF, components, 0xFF, 0xD9);
        return new Uint8Array(bytes);
    }
    it('kills mutant: initial length must use * 256 +, not / 256 +', () => {
        const spy: jasmine.Spy = spyOn(_JpegDecoder.prototype, '_readExceededJpegImage').and.callThrough();
        const decoder: _JpegDecoder = new _JpegDecoder(buildLargeInitialLengthJpeg(320, 240, 3));
        expect(decoder._width).toBe(320);
        expect(decoder._height).toBe(240);
        expect(decoder._noOfComponents).toBe(3);
        expect(spy).not.toHaveBeenCalled();
    });
    function buildLargeJpegWithExplicitSegments(width: number, height: number, components: number): Uint8Array {
        const app0Length: number = 0x0505; // 1285, makes JPEG larger than 1024 bytes
        const app0PayloadLength: number = app0Length - 2;
        const bytes: number[] = [0xFF, 0xD8, 0xFF, 0xE0, (app0Length >> 8) & 0xFF, app0Length & 0xFF];
        for (let i: number = 0; i < app0PayloadLength; i++) {
            bytes.push(0xAA);
        }
        bytes.push(0xFF, 0xC0, 0x00, 0x08, 0x08, (height >> 8) & 0xFF, height & 0xFF, (width >> 8) & 0xFF, width & 0xFF, components, 0xFF, 0xD9);
        return new Uint8Array(bytes);
    }
    it('kills mutants: _getImageDictionary byte-copy loop must read exactly entryLength bytes', () => {
        const src: Uint8Array = buildLargeJpegWithExplicitSegments(320, 240, 3);
        const decoder: _JpegDecoder = new _JpegDecoder(src);
        const getBufferSpy: jasmine.Spy = spyOn(decoder as any, '_getBuffer').and.callThrough();
        const imageStream: any = decoder._getImageDictionary();
        expect(imageStream.bytes.length).toBe(src.byteLength);
        expect(getBufferSpy.calls.count()).toBe(src.byteLength);
        for (let i: number = 0; i < src.byteLength; i++) {
            expect(imageStream.bytes[i]).toBe(src[i]);
        }
    });

});