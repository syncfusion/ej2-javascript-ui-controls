import { _JpegDecoder } from "../src/pdf/core/graphics/images/jpeg-decoder";

describe('Image-decoder file mutation testing', () => {
    it('should initialize _noOfComponents to -1 (not +1)', () => {
        const stream = new Uint8Array([0xFF, 0xD8, 0xFF, 0xE0]); // Minimal JPEG header
        const decoder = new _JpegDecoder(stream);
        expect(decoder['_noOfComponents']).toBe(-1);
        expect(decoder['_noOfComponents']).not.toBe(1);
        expect(decoder['_noOfComponents']).not.toBe(0);
    });
    describe('_read method with stream parameter', () => {
        it('should handle stream parameter when both stream is truthy AND Array.isArray(stream) is true', () => {
            const jpegStream = new Uint8Array([0xFF, 0xD8, 0xFF, 0xE0]);
            const decoder = new _JpegDecoder(jpegStream);
            const buffer: number[] = [0, 0, 0];
            const stream: number[] = [10, 20, 30, 40, 50];
            const result = decoder['_read'](buffer, 0, 3, stream);
            expect(result).not.toBeNull();
            expect(result).not.toBeUndefined();
            expect(result.outputBuffer).toEqual([10, 20, 30]);
            expect(result.offset).toBe(3);
            expect(result.length).toBe(3);
        });
        it('should not use stream parameter when stream is null (even if Array.isArray returns false)', () => {
            const jpegStream = new Uint8Array([0xFF, 0xD8, 0xFF, 0xE0]);
            const decoder = new _JpegDecoder(jpegStream);
            decoder['_position'] = 0;
            const buffer: number[] = [0, 0, 0];
            const result = decoder['_read'](buffer, 0, 3, null as any);
            expect(result).toBeUndefined(); // Internal stream read returns void
            expect(buffer[0]).toBe(255);
            expect(buffer[1]).toBe(216);
            expect(buffer[2]).toBe(255);
        });
        it('should fail if stream is truthy but not an array (catches || mutation)', () => {
            const jpegStream = new Uint8Array([0xFF, 0xD8, 0xFF, 0xE0]);
            const decoder = new _JpegDecoder(jpegStream);
            const buffer: number[] = [0, 0, 0];
            const fakeStream = { length: 3 } as any; // Truthy but not an array
            const result = decoder['_read'](buffer, 0, 3, fakeStream);
            expect(result).toBeUndefined();
        });
    });
    describe('_read method boundary conditions - count <= stream.length', () => {
        it('should read exactly stream.length bytes when count equals stream.length', () => {
            const jpegStream = new Uint8Array([0xFF, 0xD8, 0xFF, 0xE0]);
            const decoder = new _JpegDecoder(jpegStream);
            const buffer: number[] = [0, 0, 0, 0, 0];
            const stream: number[] = [10, 20, 30, 40, 50];
            const result = decoder['_read'](buffer, 0, 5, stream);
            expect(result.length).toBe(5);
            expect(result.outputBuffer).toEqual([10, 20, 30, 40, 50]);
        });
        it('should not read when count is greater than stream.length (catches <= mutation to <)', () => {
            const jpegStream = new Uint8Array([0xFF, 0xD8, 0xFF, 0xE0]);
            const decoder = new _JpegDecoder(jpegStream);
            const buffer: number[] = [0, 0, 0, 0, 0, 0];
            const stream: number[] = [10, 20, 30, 40, 50];
            const result = decoder['_read'](buffer, 0, 6, stream);
            expect(result.length).toBe(0);
            expect(result.outputBuffer).toEqual([0, 0, 0, 0, 0, 0]);
        });
        it('should handle boundary: count = stream.length exactly (catches < mutation)', () => {
            const jpegStream = new Uint8Array([0xFF, 0xD8, 0xFF, 0xE0]);
            const decoder = new _JpegDecoder(jpegStream);
            const buffer: number[] = [0, 0, 0];
            const stream: number[] = [100, 200, 300];
            const result = decoder['_read'](buffer, 0, 3, stream);
            expect(result.length).toBe(3);
            expect(result.outputBuffer).toEqual([100, 200, 300]);
        });
        it('should handle count one less than stream.length', () => {
            const jpegStream = new Uint8Array([0xFF, 0xD8, 0xFF, 0xE0]);
            const decoder = new _JpegDecoder(jpegStream);
            const buffer: number[] = [0, 0];
            const stream: number[] = [11, 22, 33];
            const result = decoder['_read'](buffer, 0, 2, stream);
            expect(result.length).toBe(2);
            expect(result.outputBuffer).toEqual([11, 22]);
        });
    });
    describe('_read method boundary conditions - stream.length - offset >= count', () => {
        it('should succeed when stream.length - offset equals count', () => {
            const jpegStream = new Uint8Array([0xFF, 0xD8, 0xFF, 0xE0]);
            const decoder = new _JpegDecoder(jpegStream);
            const buffer: number[] = [0, 0, 0];
            const stream: number[] = [10, 20, 30, 40, 50];
            const result = decoder['_read'](buffer, 2, 3, stream);
            expect(result.length).toBe(3);
            expect(result.outputBuffer).toEqual([30, 40, 50]);
        });
        it('should fail when stream.length - offset is less than count', () => {
            const jpegStream = new Uint8Array([0xFF, 0xD8, 0xFF, 0xE0]);
            const decoder = new _JpegDecoder(jpegStream);
            const buffer: number[] = [0, 0, 0, 0];
            const stream: number[] = [10, 20, 30, 40, 50];
            const result = decoder['_read'](buffer, 3, 4, stream);
            expect(result.length).toBe(0);
        });
        it('should succeed when stream.length - offset is greater than count', () => {
            const jpegStream = new Uint8Array([0xFF, 0xD8, 0xFF, 0xE0]);
            const decoder = new _JpegDecoder(jpegStream);
            const buffer: number[] = [0, 0];
            const stream: number[] = [5, 10, 15, 20, 25];
            const result = decoder['_read'](buffer, 1, 2, stream);
            expect(result.length).toBe(2);
            expect(result.outputBuffer).toEqual([10, 15]);
        });

        it('should fail when offset puts us at exact boundary', () => {
            const jpegStream = new Uint8Array([0xFF, 0xD8, 0xFF, 0xE0]);
            const decoder = new _JpegDecoder(jpegStream);
            const buffer: number[] = [0, 0, 0];
            const stream: number[] = [1, 2, 3, 4, 5];
            const result = decoder['_read'](buffer, 4, 2, stream);
            expect(result.length).toBe(0);
        });
    });
    describe('_read method combined boundary conditions (AND logic)', () => {
        it('should read when both count <= stream.length AND stream.length - offset >= count', () => {
            const jpegStream = new Uint8Array([0xFF, 0xD8, 0xFF, 0xE0]);
            const decoder = new _JpegDecoder(jpegStream);
            const buffer: number[] = [0, 0, 0];
            const stream: number[] = [50, 60, 70, 80, 90];
            const result = decoder['_read'](buffer, 1, 2, stream);
            expect(result.length).toBe(2);
            expect(result.outputBuffer).toEqual([60, 70, 0]);
        });
        it('should not read when first condition fails (count > stream.length)', () => {
            const jpegStream = new Uint8Array([0xFF, 0xD8, 0xFF, 0xE0]);
            const decoder = new _JpegDecoder(jpegStream);
            const buffer: number[] = [0, 0, 0, 0, 0, 0];
            const stream: number[] = [1, 2, 3];
            const result = decoder['_read'](buffer, 0, 6, stream);
            expect(result.length).toBe(0);
        });
        it('should not read when second condition fails (insufficient remaining bytes)', () => {
            const jpegStream = new Uint8Array([0xFF, 0xD8, 0xFF, 0xE0]);
            const decoder = new _JpegDecoder(jpegStream);
            const buffer: number[] = [0, 0, 0, 0];
            const stream: number[] = [7, 8, 9, 10];
            const result = decoder['_read'](buffer, 2, 3, stream);
            expect(result.length).toBe(0);
        });
        it('should not read when both conditions fail', () => {
            const jpegStream = new Uint8Array([0xFF, 0xD8, 0xFF, 0xE0]);
            const decoder = new _JpegDecoder(jpegStream);
            const buffer: number[] = [0, 0, 0, 0, 0, 0];
            const stream: number[] = [11, 22];
            const result = decoder['_read'](buffer, 1, 5, stream);
            expect(result.length).toBe(0);
        });
    });
    describe('_read method edge cases', () => {
        it('should handle empty stream', () => {
            const jpegStream = new Uint8Array([0xFF, 0xD8, 0xFF, 0xE0]);
            const decoder = new _JpegDecoder(jpegStream);
            const buffer: number[] = [0];
            const stream: number[] = [];
            const result = decoder['_read'](buffer, 0, 1, stream);
            expect(result.length).toBe(0);
        });
        it('should handle zero count', () => {
            const jpegStream = new Uint8Array([0xFF, 0xD8, 0xFF, 0xE0]);
            const decoder = new _JpegDecoder(jpegStream);
            const buffer: number[] = [0, 0];
            const stream: number[] = [1, 2, 3];
            const result = decoder['_read'](buffer, 0, 0, stream);
            expect(result.length).toBe(0);
            expect(result.offset).toBe(0);
        });
        it('should handle offset at stream end', () => {
            const jpegStream = new Uint8Array([0xFF, 0xD8, 0xFF, 0xE0]);
            const decoder = new _JpegDecoder(jpegStream);
            const buffer: number[] = [0];
            const stream: number[] = [1, 2, 3];
            const result = decoder['_read'](buffer, 3, 1, stream);
            expect(result.length).toBe(0);
        });
    });
    describe('_read method mutation - count <= stream.length replaced with true', () => {
        it('should fail when count > stream.length (catches true mutation)', () => {
            const jpegStream = new Uint8Array([0xFF, 0xD8, 0xFF, 0xE0]);
            const decoder = new _JpegDecoder(jpegStream);
            const buffer: number[] = [0, 0, 0, 0, 0, 0, 0];
            const stream: number[] = [10, 20, 30, 40, 50];
            const result = decoder['_read'](buffer, 0, 7, stream);
            expect(result.length).toBe(0);
        });

        it('should read normally when count is valid (demonstrates normal operation)', () => {
            const jpegStream = new Uint8Array([0xFF, 0xD8, 0xFF, 0xE0]);
            const decoder = new _JpegDecoder(jpegStream);
            const buffer: number[] = [0, 0, 0];
            const stream: number[] = [100, 200, 300, 400, 500];
            const result = decoder['_read'](buffer, 0, 3, stream);
            expect(result.length).toBe(3);
            expect(result.outputBuffer).toEqual([100, 200, 300]);
        });
        it('should fail when count exactly equals stream.length but offset makes it invalid', () => {
            const jpegStream = new Uint8Array([0xFF, 0xD8, 0xFF, 0xE0]);
            const decoder = new _JpegDecoder(jpegStream);
            const buffer: number[] = [0, 0, 0, 0];
            const stream: number[] = [5, 10, 15, 20];
            const result = decoder['_read'](buffer, 2, 4, stream);
            expect(result.length).toBe(0);
        });
        it('should not read when count exceeds stream length even if offset is negative (kills true mutation)', () => {
            const jpegStream = new Uint8Array([0xFF, 0xD8, 0xFF, 0xE0]);
            const decoder = new _JpegDecoder(jpegStream);
            const buffer: any[] = [];
            const stream: number[] = [10, 20, 30];
            const result = decoder['_read'](buffer, -2, 4, stream)
            expect(result.length).toBe(0);
            expect(result.offset).toBe(-2);
        });
    });
    describe('_toUnsigned16 method mutations', () => {
        it('should handle zero correctly (catches < 0 vs >= 0 mutation)', () => {
            const stream = new Uint8Array([0xFF, 0xD8, 0xFF, 0xE0]);
            const decoder = new _JpegDecoder(stream);
            const result = decoder['_toUnsigned16'](0);
            expect(result).toBe(0);
            expect(result).not.toBe(0x10000);
        });
        it('should handle positive value 10 correctly', () => {
            const stream = new Uint8Array([0xFF, 0xD8, 0xFF, 0xE0]);
            const decoder = new _JpegDecoder(stream);
            const result = decoder['_toUnsigned16'](10);
            expect(result).toBe(10);
            expect(result).not.toBe(10 + 0x10000);
        });
        it('should handle negative value -1 correctly (catches < 0 mutation)', () => {
            const stream = new Uint8Array([0xFF, 0xD8, 0xFF, 0xE0]);
            const decoder = new _JpegDecoder(stream);
            const result = decoder['_toUnsigned16'](-1);
            expect(result).toBe(65535);
        });
        it('should properly convert negative to unsigned when masked value is treated as negative', () => {
            const stream = new Uint8Array([0xFF, 0xD8, 0xFF, 0xE0]);
            const decoder = new _JpegDecoder(stream);
            const negValue = -100;
            const result = decoder['_toUnsigned16'](negValue);
            expect(result).toBeGreaterThanOrEqual(0);
            expect(result).toBeLessThanOrEqual(0xFFFF);
        });
        it('should handle 0xFFFF boundary correctly (catches false mutation)', () => {
            const stream = new Uint8Array([0xFF, 0xD8, 0xFF, 0xE0]);
            const decoder = new _JpegDecoder(stream);
            const result = decoder['_toUnsigned16'](0xFFFF);
            expect(result).toBe(0xFFFF);
        });
        it('should differentiate between < 0 and >= 0 with large positive value', () => {
            const stream = new Uint8Array([0xFF, 0xD8, 0xFF, 0xE0]);
            const decoder = new _JpegDecoder(stream);
            const largeValue = 0x12345;
            const result = decoder['_toUnsigned16'](largeValue);
            const expected = largeValue & 0xFFFF; // 0x2345
            expect(result).toBe(expected);
            expect(result).not.toBe(expected + 0x10000);
        });
        it('should handle lowest negative value correctly', () => {
            const stream = new Uint8Array([0xFF, 0xD8, 0xFF, 0xE0]);
            const decoder = new _JpegDecoder(stream);
            const result = decoder['_toUnsigned16'](-32768);
            expect(result).toBeGreaterThanOrEqual(0);
        });
        it('should consistently return unsigned 16-bit values', () => {
            const stream = new Uint8Array([0xFF, 0xD8, 0xFF, 0xE0]);
            const decoder = new _JpegDecoder(stream);
            const testValues = [0, 1, 10, 100, 0xFFFF, -1, -10, -100];
            testValues.forEach(value => {
                const result = decoder['_toUnsigned16'](value);
                expect(result).toBeGreaterThanOrEqual(0);
                expect(result).toBeLessThanOrEqual(0xFFFF);
            });
        });
    });
});