import { _PdfCryptographicEncoding } from '../../src/pdf/core/security/digital-signature/signature/cryptographic-encoder';

describe('_PdfCryptographicEncoding behavior', () => {

    it('returns algorithm name with PKCS1Padding', () => {
        // Arrange
        const mockCipher: any = {
            _getAlgorithmName: () => 'RSA'
        };
        const enc = new _PdfCryptographicEncoding(mockCipher);
        // Act
        const name = enc._getAlgorithmName();
        // Assert
        expect(name).toBe('RSA/PKCS1Padding');
    });

    it('_getInputBlock and _getOutputBlock vary with encryption flag', () => {
        // Arrange
        const mockCipher: any = {
            _getInputBlock: () => 128,
            _getOutputBlock: () => 128,
            _initialize: () => { }
        };
        const enc = new _PdfCryptographicEncoding(mockCipher);
        // set encryption = true
        enc._initialize(true, { _isPrivate: false } as any);
        // Act
        const inputWhenEncrypt = enc._getInputBlock();
        const outputWhenEncrypt = enc._getOutputBlock();
        // Assert
        expect(inputWhenEncrypt).toBe(118); // 128 - 10
        expect(outputWhenEncrypt).toBe(128);
        // set encryption = false
        enc._initialize(false, { _isPrivate: false } as any);
        const inputWhenDecrypt = enc._getInputBlock();
        const outputWhenDecrypt = enc._getOutputBlock();
        expect(inputWhenDecrypt).toBe(128);
        expect(outputWhenDecrypt).toBe(118); // 128 - 10
    });

    it('encodeBlock - private key padding uses 0x01 and 0xFF bytes', () => {
        // Arrange
        const mockCipher: any = {
            _getInputBlock: () => 16,
            _processBlock: (block: Uint8Array, off: number, len: number) => block.subarray(off, off + len),
            _initialize: () => { }
        };
        const enc = new _PdfCryptographicEncoding(mockCipher);
        enc._initialize(true, { _isPrivate: true } as any);
        const payload = new Uint8Array([1, 2, 3]);
        // Act
        const out = enc._encodeBlock(payload, 0, payload.length);
        // Assert: first byte 0x01
        expect(out[0]).toBe(0x01);
        // padding bytes between index 1 and separator should be 0xFF
        const sepIndex = out.length - payload.length - 1;
        for (let i = 1; i < sepIndex; i++) {
            expect(out[i]).toBe(0xFF);
        }
        // separator and payload location
        expect(out[sepIndex]).toBe(0x00);
        for (let i = 0; i < payload.length; i++) {
            expect(out[out.length - payload.length + i]).toBe(payload[i]);
        }
    });
    it('encodeBlock - return error', () => {
        // Arrange
        const mockCipher: any = {
            _getInputBlock: () => 0,
            _processBlock: (block: Uint8Array, off: number, len: number) => block.subarray(off, off + len),
            _initialize: () => { }
        };
        const enc = new _PdfCryptographicEncoding(mockCipher);
        enc._initialize(true, { _isPrivate: true } as any);
        const payload = new Uint8Array([1, 2, 3]);
        try {
            const out = enc._encodeBlock(payload, 0, payload.length);

        } catch (error) {
            expect(error.message).toEqual('Input data too large for PKCS#1 padding.')
        }
    });

    it('encodeBlock - public key padding uses non-zero random bytes', () => {
        // Arrange
        const mockCipher: any = {
            _getInputBlock: () => 16,
            _processBlock: (block: Uint8Array, off: number, len: number) => block.subarray(off, off + len),
            _initialize: () => { }
        };
        const enc = new _PdfCryptographicEncoding(mockCipher);
        enc._initialize(true, { _isPrivate: false } as any);
        const payload = new Uint8Array([9, 8, 7]);
        const origRandom = Math.random;
        Math.random = () => 0.5; // deterministic non-zero
        try {
            // Act
            const out = enc._encodeBlock(payload, 0, payload.length);
            // Assert: first byte 0x02
            expect(out[0]).toBe(0x02);
            const sepIndex = out.length - payload.length - 1;
            // all padding bytes should be non-zero
            for (let i = 1; i < sepIndex; i++) {
                expect(out[i]).not.toBe(0x00);
            }
            expect(out[sepIndex]).toBe(0x00);
            for (let i = 0; i < payload.length; i++) {
                expect(out[out.length - payload.length + i]).toBe(payload[i]);
            }
        } finally {
            Math.random = origRandom;
        }
    });

    it('decodeBlock throws on truncated data block', () => {
        const mockCipher: any = {
            _processBlock: () => new Uint8Array([0x00, 0x01, 0x02]),
            _getOutputBlock: () => 20,
            _initialize: () => { }
        };

        const enc = new _PdfCryptographicEncoding(mockCipher);
        enc._initialize(false, { _isPrivate: false } as any);

        try {
            enc._decodeBlock(new Uint8Array([0]), 0, 1);
            fail('Expected error was not thrown');
        } catch (e) {
            expect(e.message).toBe('Data block is truncated.');
        }
    });

    it('decodeBlock throws on bad padding bytes for type 1', () => {
        const arr = new Uint8Array(20);
        arr[0] = 1;
        arr[1] = 0xAA; // invalid padding
        arr[19] = 0x00;

        const mockCipher: any = {
            _processBlock: () => arr,
            _getOutputBlock: () => 20,
            _initialize: () => { }
        };

        const enc = new _PdfCryptographicEncoding(mockCipher);
        enc._initialize(false, { _isPrivate: true } as any);

        try {
            enc._decodeBlock(new Uint8Array([0]), 0, 20);
            fail('Expected error was not thrown');
        } catch (e) {
            expect(e.message).toBe('Invalid PKCS#1 padding: bad padding byte.');
        }
    });

    it('decodeBlock throws when separator not found or too short', () => {
        const arr = new Uint8Array(20);
        arr[0] = 2;
        for (let i = 1; i < 20; i++) {
            arr[i] = 0x11; // no zero separator
        }

        const mockCipher: any = {
            _processBlock: () => arr,
            _getOutputBlock: () => 20,
            _initialize: () => { }
        };

        const enc = new _PdfCryptographicEncoding(mockCipher);
        enc._initialize(false, { _isPrivate: false } as any);

        try {
            enc._decodeBlock(new Uint8Array([0]), 0, 20);
            fail('Expected error was not thrown');
        } catch (e) {
            expect(e.message).toBe(
                'Invalid PKCS#1 padding: separator not found or too short.'
            );
        }
    });

    it('decodeBlock returns message bytes when padding and separator valid', () => {
        // Arrange: construct block with type 2, padding, separator at index 10
        const message = new Uint8Array([9, 8, 7]);
        const block = new Uint8Array(16);
        block[0] = 2;
        for (let i = 1; i < 10; i++) block[i] = 0x55; // random non-zero padding
        block[10] = 0x00; // separator
        block.set(message, 11);
        const mockCipher: any = {
            _processBlock: () => block,
            _getOutputBlock: () => 16,
            _initialize: () => { }
        };
        const enc = new _PdfCryptographicEncoding(mockCipher);
        enc._initialize(false, { _isPrivate: false } as any);
        // Act
        const out = enc._decodeBlock(new Uint8Array([0]), 0, 16);
        // Assert
        expect(out.length).toBe(5);
        for (let i = 0; i < message.length; i++) expect(out[i]).toBe(message[i]);
    });
    it('1046121 - _decodeBlock should return block unchanged for unsupported block type', () => {
        const block: Uint8Array = new Uint8Array([
            3, 10, 20, 30, 40, 50
        ]);
        const mockCipher: any = {
            _processBlock: (): Uint8Array => {
                return block;
            },
            _getOutputBlock: (): number => {
                return block.length;
            },
            _initialize: (): void => {
            }
        };
        const encoding: any = new _PdfCryptographicEncoding(mockCipher);
        encoding._initialize(false, {
            _isPrivate: true
        });
        const result: Uint8Array = encoding._decodeBlock(
            new Uint8Array([0]),
            0,
            block.length
        );
        expect(result).toBe(block);
        expect(result.length).toBe(6);
        expect(Array.from(result)).toEqual([
            3,
            10,
            20,
            30,
            40,
            50
        ]);
        expect(result[0]).toBe(3);
        expect(result[1]).toBe(10);
        expect(result[2]).toBe(20);
        expect(result[3]).toBe(30);
        expect(result[4]).toBe(40);
        expect(result[5]).toBe(50);
    });
});
