import { _PdfJpxImage } from '../../src/pdf-data-extract/core/jpx-image';
describe('_PdfJpxImage._parseImageProperties', () => {
    let jpxImage: _PdfJpxImage;
    beforeEach(() => {
        jpxImage = new _PdfJpxImage();
    });
    // ============================================================================
    // Helper function to create stream mocks
    // ============================================================================
    function createStreamMock(
        byteSequence: number[],
        sizeValues: {
            xsiz: number;
            ysiz: number;
            xosiz: number;
            yosiz: number;
            csiz: number;
        }
    ): any {
        let byteIndex = 0;
        // ✅ Create spy object with method names ONLY
        const stream = jasmine.createSpyObj('Stream', [
            'getByte',
            'getInt32',
            'skip',
            'getUnsignedInteger16'
        ]);
        // ✅ Apply the SAME logic as before
        stream.getByte.and.callFake(() => {
            if (byteIndex < byteSequence.length) {
                return byteSequence[byteIndex++];
            }
            return -1;
        });
        stream.getInt32.and.returnValues(
            sizeValues.xsiz,
            sizeValues.ysiz,
            sizeValues.xosiz,
            sizeValues.yosiz
        );
        stream.skip.and.returnValue(undefined);
        stream.getUnsignedInteger16.and.returnValue(sizeValues.csiz);
        return stream;
    }
    ``
    // ============================================================================
    // Marker Detection Tests (Branch: code === 0xff51)
    // ============================================================================
    it('should find marker and return properties when marker is at start of stream (0xff51)', () => {
        // Arrange
        const markerBytes: number[] = [0xff, 0x51];
        const stream: any = createStreamMock(markerBytes, { xsiz: 100, ysiz: 200, xosiz: 10, yosiz: 20, csiz: 3 });
        // Act
        const result: any = jpxImage._parseImageProperties(stream);
        // Assert
        expect(result).toBeDefined();
        expect(result.width).toBe(90);
        expect(result.height).toBe(180);
        expect(result.bitsPerComponent).toBe(8);
        expect(result.componentsCount).toBe(3);
        expect(stream.getByte).toHaveBeenCalled();
        expect(stream.skip).toHaveBeenCalledWith(4);
        expect(stream.skip).toHaveBeenCalledWith(16);
    });
    it('should return correct properties with marker 0xff51 (hexadecimal to bitwise verification)', () => {
        // Arrange
        const byte1: number = 0xff;
        const byte2: number = 0x51;
        const expectedCode: number = (byte1 << 8) | byte2;
        const stream: any = createStreamMock([byte1, byte2], { xsiz: 500, ysiz: 600, xosiz: 50, yosiz: 60, csiz: 4 });
        // Act
        const result: any = jpxImage._parseImageProperties(stream);
        // Assert
        expect(expectedCode).toBe(0xff51);
        expect(result.width).toBe(450);
        expect(result.height).toBe(540);
        expect(result.componentsCount).toBe(4);
    });
    it('should find marker after skipping non-marker bytes (branch: if (code === 0xff51) FALSE then TRUE)', () => {
        // Arrange
        const markerBytes: number[] = [0x00, 0x01, 0x02, 0x03, 0xff, 0x51];
        const stream: any = createStreamMock(markerBytes, { xsiz: 300, ysiz: 400, xosiz: 0, yosiz: 0, csiz: 1 });
        // Act
        const result: any = jpxImage._parseImageProperties(stream);
        // Assert
        expect(result).toBeDefined();
        expect(result.width).toBe(300);
        expect(result.height).toBe(400);
        expect(result.componentsCount).toBe(1);
    });
    it('should return immediately when marker is found without processing further bytes', () => {
        // Arrange
        const markerBytes: number[] = [0xff, 0x51, 0xff, 0x51];
        const stream: any = createStreamMock(markerBytes, { xsiz: 200, ysiz: 300, xosiz: 10, yosiz: 15, csiz: 3 });
        // Act
        const result: any = jpxImage._parseImageProperties(stream);
        // Assert
        expect(result.width).toBe(190);
        expect(result.height).toBe(285);
    });
    // ============================================================================
    // Loop Continuation Tests (Branch: if (code === 0xff51) FALSE - ELSE case)
    // ============================================================================
    it('should continue loop and skip non-matching marker bytes (0xaa 0xbb does not match 0xff51)', () => {
        // Arrange
        const byteSequence: number[] = [0xaa, 0xbb, 0xff, 0x51];
        const stream: any = createStreamMock(byteSequence, { xsiz: 150, ysiz: 250, xosiz: 5, yosiz: 10, csiz: 2 });
        // Act
        const result: any = jpxImage._parseImageProperties(stream);
        // Assert
        expect(result).toBeDefined();
        expect(result.width).toBe(145);
        expect(result.height).toBe(240);
        expect(result.componentsCount).toBe(2);
    });
    it('should skip incorrect marker code 0xfe50 and continue loop', () => {
        // Arrange
        const byteSequence: number[] = [0xfe, 0x50, 0xff, 0x51];
        const stream: any = createStreamMock(byteSequence, { xsiz: 120, ysiz: 180, xosiz: 20, yosiz: 30, csiz: 1 });
        // Act
        const result: any = jpxImage._parseImageProperties(stream);
        // Assert
        expect(result).toBeDefined();
        expect(result.width).toBe(100);
        expect(result.height).toBe(150);
    });
    it('should skip incorrect marker code 0xff52 and continue loop', () => {
        // Arrange
        const byteSequence: number[] = [0xff, 0x52, 0xff, 0x51];
        const stream: any = createStreamMock(byteSequence, { xsiz: 350, ysiz: 450, xosiz: 0, yosiz: 0, csiz: 3 });
        // Act
        const result: any = jpxImage._parseImageProperties(stream);
        // Assert
        expect(result).toBeDefined();
        expect(result.width).toBe(350);
        expect(result.height).toBe(450);
    });
    // ============================================================================
    // While Loop Termination Tests (Branch: while (newByte >= 0))
    // ============================================================================
    it('should throw error when stream returns -1 immediately (branch: while (newByte >= 0) FALSE)', () => {
        // Arrange
        const stream: any = createStreamMock([-1], { xsiz: 0, ysiz: 0, xosiz: 0, yosiz: 0, csiz: 0 });
        // Act & Assert
        expect(() => {
            jpxImage._parseImageProperties(stream);
        }).toThrowError('No size marker found in JPX stream');
    });
    it('should throw error when marker is never found in stream', () => {
        // Arrange
        const byteSequence: number[] = [0x00, 0x00, 0x00, 0x00];
        const stream: any = createStreamMock(byteSequence, { xsiz: 0, ysiz: 0, xosiz: 0, yosiz: 0, csiz: 0 });
        // Act & Assert
        expect(() => {
            jpxImage._parseImageProperties(stream);
        }).toThrowError('No size marker found in JPX stream');
    });
    it('should throw error with exact message text', () => {
        // Arrange
        const stream: any = createStreamMock([], { xsiz: 0, ysiz: 0, xosiz: 0, yosiz: 0, csiz: 0 });
        // Act & Assert
        const expectedMessage: string = 'No size marker found in JPX stream';
        expect(() => {
            jpxImage._parseImageProperties(stream);
        }).toThrowError(expectedMessage);
    });
    // ============================================================================
    // Size Value Parsing Tests (getInt32 calls)
    // ============================================================================
    it('should parse Xsiz correctly from stream.getInt32()', () => {
        // Arrange
        const stream: any = createStreamMock([0xff, 0x51], { xsiz: 612, ysiz: 792, xosiz: 0, yosiz: 0, csiz: 1 });
        // Act
        const result: any = jpxImage._parseImageProperties(stream);
        // Assert
        expect(result.width).toBe(612);
    });
    it('should parse Ysiz correctly from stream.getInt32()', () => {
        // Arrange
        const stream: any = createStreamMock([0xff, 0x51], { xsiz: 612, ysiz: 792, xosiz: 0, yosiz: 0, csiz: 1 });
        // Act
        const result: any = jpxImage._parseImageProperties(stream);
        // Assert
        expect(result.height).toBe(792);
    });
    it('should parse XOsiz correctly from stream.getInt32()', () => {
        // Arrange
        const stream: any = createStreamMock([0xff, 0x51], { xsiz: 500, ysiz: 600, xosiz: 100, yosiz: 0, csiz: 1 });
        // Act
        const result: any = jpxImage._parseImageProperties(stream);
        // Assert
        expect(result.width).toBe(400);
    });
    it('should parse YOsiz correctly from stream.getInt32()', () => {
        // Arrange
        const stream: any = createStreamMock([0xff, 0x51], { xsiz: 500, ysiz: 600, xosiz: 0, yosiz: 150, csiz: 1 });
        // Act
        const result: any = jpxImage._parseImageProperties(stream);
        // Assert
        expect(result.height).toBe(450);
    });
    // ============================================================================
    // Csiz (Components Count) Tests (getUnsignedInteger16)
    // ============================================================================
    it('should parse Csiz as 1 (grayscale) from stream.getUnsignedInteger16()', () => {
        // Arrange
        const stream: any = createStreamMock([0xff, 0x51], { xsiz: 100, ysiz: 100, xosiz: 0, yosiz: 0, csiz: 1 });
        // Act
        const result: any = jpxImage._parseImageProperties(stream);
        // Assert
        expect(result.componentsCount).toBe(1);
    });
    it('should parse Csiz as 3 (RGB) from stream.getUnsignedInteger16()', () => {
        // Arrange
        const stream: any = createStreamMock([0xff, 0x51], { xsiz: 100, ysiz: 100, xosiz: 0, yosiz: 0, csiz: 3 });
        // Act
        const result: any = jpxImage._parseImageProperties(stream);
        // Assert
        expect(result.componentsCount).toBe(3);
    });
    it('should parse Csiz as 4 (RGBA) from stream.getUnsignedInteger16()', () => {
        // Arrange
        const stream: any = createStreamMock([0xff, 0x51], { xsiz: 100, ysiz: 100, xosiz: 0, yosiz: 0, csiz: 4 });
        // Act
        const result: any = jpxImage._parseImageProperties(stream);
        // Assert
        expect(result.componentsCount).toBe(4);
    });
    it('should parse high component count correctly', () => {
        // Arrange
        const stream: any = createStreamMock([0xff, 0x51], { xsiz: 100, ysiz: 100, xosiz: 0, yosiz: 0, csiz: 16 });
        // Act
        const result: any = jpxImage._parseImageProperties(stream);
        // Assert
        expect(result.componentsCount).toBe(16);
    });
    // ============================================================================
    // Stream Skip Operations Tests
    // ============================================================================
    it('should skip 4 bytes after marker detection', () => {
        // Arrange
        const stream: any = createStreamMock([0xff, 0x51], { xsiz: 100, ysiz: 100, xosiz: 0, yosiz: 0, csiz: 1 });
        // Act
        jpxImage._parseImageProperties(stream);
        // Assert
        expect(stream.skip).toHaveBeenCalledWith(4);
    });
    it('should skip 16 bytes after size values', () => {
        // Arrange
        const stream: any = createStreamMock([0xff, 0x51], { xsiz: 100, ysiz: 100, xosiz: 0, yosiz: 0, csiz: 1 });
        // Act
        jpxImage._parseImageProperties(stream);
        // Assert
        expect(stream.skip).toHaveBeenCalledWith(16);
    });
    it('should call skip twice in correct sequence', () => {
        // Arrange
        const stream: any = createStreamMock([0xff, 0x51], { xsiz: 100, ysiz: 100, xosiz: 0, yosiz: 0, csiz: 1 });
        const skipCalls: number[] = [];
        stream.skip.and.callFake((bytes: number) => {
            skipCalls.push(bytes);
        });
        // Act
        jpxImage._parseImageProperties(stream);
        // Assert
        expect(skipCalls.length).toBe(2);
        expect(skipCalls[0]).toBe(4);
        expect(skipCalls[1]).toBe(16);
    });
    // ============================================================================
    // Width Calculation Tests (Xsiz - XOsiz)
    // ============================================================================
    it('should calculate width as Xsiz minus XOsiz with zero offset', () => {
        // Arrange
        const stream: any = createStreamMock([0xff, 0x51], { xsiz: 200, ysiz: 100, xosiz: 0, yosiz: 0, csiz: 1 });
        // Act
        const result: any = jpxImage._parseImageProperties(stream);
        // Assert
        expect(result.width).toBe(200);
    });
    it('should calculate width as Xsiz minus XOsiz with positive offset', () => {
        // Arrange
        const stream: any = createStreamMock([0xff, 0x51], { xsiz: 200, ysiz: 100, xosiz: 50, yosiz: 0, csiz: 1 });
        // Act
        const result: any = jpxImage._parseImageProperties(stream);
        // Assert
        expect(result.width).toBe(150);
    });
    it('should calculate width when offset equals size (width equals zero)', () => {
        // Arrange
        const stream: any = createStreamMock([0xff, 0x51], { xsiz: 100, ysiz: 100, xosiz: 100, yosiz: 0, csiz: 1 });
        // Act
        const result: any = jpxImage._parseImageProperties(stream);
        // Assert
        expect(result.width).toBe(0);
    });
    it('should calculate negative width when offset exceeds size', () => {
        // Arrange
        const stream: any = createStreamMock([0xff, 0x51], { xsiz: 100, ysiz: 100, xosiz: 150, yosiz: 0, csiz: 1 });
        // Act
        const result: any = jpxImage._parseImageProperties(stream);
        // Assert
        expect(result.width).toBe(-50);
    });
    it('should calculate width with large dimension values', () => {
        // Arrange
        const stream: any = createStreamMock([0xff, 0x51], { xsiz: 10000, ysiz: 10000, xosiz: 1000, yosiz: 0, csiz: 1 });
        // Act
        const result: any = jpxImage._parseImageProperties(stream);
        // Assert
        expect(result.width).toBe(9000);
    });
    // ============================================================================
    // Height Calculation Tests (Ysiz - YOsiz)
    // ============================================================================
    it('should calculate height as Ysiz minus YOsiz with zero offset', () => {
        // Arrange
        const stream: any = createStreamMock([0xff, 0x51], { xsiz: 100, ysiz: 300, xosiz: 0, yosiz: 0, csiz: 1 });
        // Act
        const result: any = jpxImage._parseImageProperties(stream);
        // Assert
        expect(result.height).toBe(300);
    });
    it('should calculate height as Ysiz minus YOsiz with positive offset', () => {
        // Arrange
        const stream: any = createStreamMock([0xff, 0x51], { xsiz: 100, ysiz: 300, xosiz: 0, yosiz: 75, csiz: 1 });
        // Act
        const result: any = jpxImage._parseImageProperties(stream);
        // Assert
        expect(result.height).toBe(225);
    });
    it('should calculate height when offset equals size (height equals zero)', () => {
        // Arrange
        const stream: any = createStreamMock([0xff, 0x51], { xsiz: 100, ysiz: 200, xosiz: 0, yosiz: 200, csiz: 1 });
        // Act
        const result: any = jpxImage._parseImageProperties(stream);
        // Assert
        expect(result.height).toBe(0);
    });
    it('should calculate negative height when offset exceeds size', () => {
        // Arrange
        const stream: any = createStreamMock([0xff, 0x51], { xsiz: 100, ysiz: 200, xosiz: 0, yosiz: 250, csiz: 1 });
        // Act
        const result: any = jpxImage._parseImageProperties(stream);
        // Assert
        expect(result.height).toBe(-50);
    });
    // ============================================================================
    // bitsPerComponent Constant Tests
    // ============================================================================
    it('should always return bitsPerComponent as 8 (constant value)', () => {
        // Arrange
        const stream: any = createStreamMock([0xff, 0x51], { xsiz: 100, ysiz: 100, xosiz: 0, yosiz: 0, csiz: 1 });
        // Act
        const result: any = jpxImage._parseImageProperties(stream);
        // Assert
        expect(result.bitsPerComponent).toBe(8);
    });
    it('should return bitsPerComponent as 8 regardless of Csiz value', () => {
        // Arrange
        const stream: any = createStreamMock([0xff, 0x51], { xsiz: 100, ysiz: 100, xosiz: 0, yosiz: 0, csiz: 4 });
        // Act
        const result: any = jpxImage._parseImageProperties(stream);
        // Assert
        expect(result.bitsPerComponent).toBe(8);
    });
    // ============================================================================
    // Return Object Structure Tests
    // ============================================================================
    it('should return object with all required properties', () => {
        // Arrange
        const stream: any = createStreamMock([0xff, 0x51], { xsiz: 100, ysiz: 100, xosiz: 0, yosiz: 0, csiz: 3 });
        // Act
        const result: any = jpxImage._parseImageProperties(stream);
        // Assert
        expect(result).toBeDefined();
        expect(typeof result).toBe('object');
        expect('width' in result).toBe(true);
        expect('height' in result).toBe(true);
        expect('bitsPerComponent' in result).toBe(true);
        expect('componentsCount' in result).toBe(true);
    });
    it('should return object with numeric properties', () => {
        // Arrange
        const stream: any = createStreamMock([0xff, 0x51], { xsiz: 256, ysiz: 512, xosiz: 10, yosiz: 20, csiz: 3 });
        // Act
        const result: any = jpxImage._parseImageProperties(stream);
        // Assert
        expect(typeof result.width).toBe('number');
        expect(typeof result.height).toBe('number');
        expect(typeof result.bitsPerComponent).toBe('number');
        expect(typeof result.componentsCount).toBe('number');
    });
    // ============================================================================
    // Complex Stream Scenarios
    // ============================================================================
    it('should handle stream with many non-marker bytes before finding marker', () => {
        // Arrange
        const byteSequence: number[] = [0x10, 0x20, 0x30, 0x40, 0x50, 0x60, 0x70, 0x80, 0x90, 0xff, 0x51];
        const stream: any = createStreamMock(byteSequence, { xsiz: 800, ysiz: 600, xosiz: 100, yosiz: 50, csiz: 3 });
        // Act
        const result: any = jpxImage._parseImageProperties(stream);
        // Assert
        expect(result.width).toBe(700);
        expect(result.height).toBe(550);
        expect(result.componentsCount).toBe(3);
    });
    it('should handle all zero size values correctly', () => {
        // Arrange
        const stream: any = createStreamMock([0xff, 0x51], { xsiz: 0, ysiz: 0, xosiz: 0, yosiz: 0, csiz: 0 });
        // Act
        const result: any = jpxImage._parseImageProperties(stream);
        // Assert
        expect(result.width).toBe(0);
        expect(result.height).toBe(0);
        expect(result.componentsCount).toBe(0);
    });
    it('should handle all maximum positive values', () => {
        // Arrange
        const maxInt: number = 2147483647;
        const stream: any = createStreamMock([0xff, 0x51], { xsiz: maxInt, ysiz: maxInt, xosiz: 0, yosiz: 0, csiz: maxInt });
        // Act
        const result: any = jpxImage._parseImageProperties(stream);
        // Assert
        expect(result.width).toBe(maxInt);
        expect(result.height).toBe(maxInt);
        expect(result.componentsCount).toBe(maxInt);
    });
    it('should call getInt32 exactly 4 times after marker detection', () => {
        // Arrange
        const stream: any = createStreamMock([0xff, 0x51], { xsiz: 100, ysiz: 200, xosiz: 10, yosiz: 20, csiz: 3 });
        // Act
        jpxImage._parseImageProperties(stream);
        // Assert
        expect(stream.getInt32).toHaveBeenCalledTimes(4);
    });
    it('should call getUnsignedInteger16 exactly once after marker detection', () => {
        // Arrange
        const stream: any = createStreamMock([0xff, 0x51], { xsiz: 100, ysiz: 200, xosiz: 10, yosiz: 20, csiz: 3 });
        // Act
        jpxImage._parseImageProperties(stream);
        // Assert
        expect(stream.getUnsignedInteger16).toHaveBeenCalledTimes(1);
    });
    it('should not throw error for valid marker and valid stream data', () => {
        // Arrange
        const stream: any = createStreamMock([0xff, 0x51], { xsiz: 256, ysiz: 256, xosiz: 0, yosiz: 0, csiz: 3 });
        // Act & Assert
        expect(() => {
            jpxImage._parseImageProperties(stream);
        }).not.toThrow();
    });
});
