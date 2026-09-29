import { _AdvancedEncryptionGcmCipher } from
    '../src/pdf/core/security/encryptors/advanced-encryption-gcm-cipher';
function createSequentialBytes(length: number, start: number = 0): Uint8Array {
    const bytes: Uint8Array = new Uint8Array(length);
    for (let i: number = 0; i < length; i++) {
        bytes[i] = (start + i) & 0xff;
    }
    return bytes;
}
function createFilledBytes(length: number, value: number): Uint8Array {
    const bytes: Uint8Array = new Uint8Array(length);
    bytes.fill(value);
    return bytes;
}
function createBytesFromHex(value: string): Uint8Array {
    const bytes: Uint8Array = new Uint8Array(value.length / 2);
    for (let i: number = 0; i < bytes.length; i++) {
        const start: number = i * 2;
        bytes[i] = parseInt(value.substring(start, start + 2), 16);
    }
    return bytes;
}
function convertBytesToHex(bytes: Uint8Array): string {
    let value: string = '';
    for (let i: number = 0; i < bytes.length; i++) {
        let hexValue: string = bytes[i].toString(16);
        if (hexValue.length === 1) {
            hexValue = '0' + hexValue;
        }
        value += hexValue;
    }
    return value;
}
function compareBytes(first: Uint8Array, second: Uint8Array): boolean {
    if (first.length !== second.length) {
        return false;
    }
    for (let i: number = 0; i < first.length; i++) {
        if (first[i] !== second[i]) {
            return false;
        }
    }
    return true;
}
describe('_AdvancedEncryptionGcmCipher constructor', () => {
    it('creates AES-256 cipher using a 32-byte key', () => {
        // Arrange
        const key: Uint8Array = createSequentialBytes(32);
        // Act
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(key);
        // Assert
        expect(cipher).toBeDefined();
        expect(cipher._cyclesOfRepetition).toBe(14);
        expect(cipher._keySize).toBe(240);
        expect(cipher._key.length).toBe(240);
    });
    it('preserves the original key in the first 32 expanded bytes', () => {
        // Arrange
        const key: Uint8Array = createSequentialBytes(32);
        // Act
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(key);
        const firstKeyBlock: Uint8Array = cipher._key.subarray(0, 32);
        // Assert
        expect(compareBytes(firstKeyBlock, key)).toBe(true);
        expect(convertBytesToHex(firstKeyBlock)).toBe(
            '000102030405060708090a0b0c0d0e0f' +
            '101112131415161718191a1b1c1d1e1f'
        );
    });
    it('throws exact error for a 31-byte key', () => {
        // Arrange
        const key: Uint8Array = new Uint8Array(31);
        // Act
        const createCipher: () => void = (): void => {
            new _AdvancedEncryptionGcmCipher(key);
        };
        // Assert
        expect(createCipher).toThrowError(
            'AES-GCM requires 256-bit (32-byte) key'
        );
        expect(key.length).toBe(31);
    });
    it('throws exact error for a 33-byte key', () => {
        // Arrange
        const key: Uint8Array = new Uint8Array(33);
        // Act
        const createCipher: () => void = (): void => {
            new _AdvancedEncryptionGcmCipher(key);
        };
        // Assert
        expect(createCipher).toThrowError(
            'AES-GCM requires 256-bit (32-byte) key'
        );
        expect(key.length).toBe(33);
    });
});
describe('_expandKey', () => {
    it('returns the exact AES-256 expanded key schedule', () => {
        // Arrange
        const key: Uint8Array = createSequentialBytes(32);
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(key);
        // Act
        const expandedKey: Uint8Array = cipher._expandKey(key);
        // Assert
        expect(expandedKey.length).toBe(240);
        expect(convertBytesToHex(expandedKey)).toBe(
            '000102030405060708090a0b0c0d0e0f' +
            '101112131415161718191a1b1c1d1e1f' +
            'a573c29fa176c498a97fce93a572c09c' +
            '1651a8cd0244beda1a5da4c10640bade' +
            'ae87dff00ff11b68a68ed5fb03fc1567' +
            '6de1f1486fa54f9275f8eb5373b8518d' +
            'c656827fc9a799176f294cec6cd5598b' +
            '3de23a75524775e727bf9eb45407cf39' +
            '0bdc905fc27b0948ad5245a4c1871c2f' +
            '45f5a66017b2d387300d4d33640a820a' +
            '7ccff71cbeb4fe5413e6bbf0d261a7df' +
            'f01afafee7a82979d7a5644ab3afe640' +
            '2541fe719bf500258813bbd55a721c0a' +
            '4e5a6699a9f24fe07e572baacdf8cdea' +
            '24fc79ccbf0979e9371ac23c6d68de36'
        );
        expect(cipher._key).toBe(expandedKey);
    });
    it('returns a different schedule for a different key', () => {
        // Arrange
        const firstKey: Uint8Array = createSequentialBytes(32);
        const secondKey: Uint8Array = createSequentialBytes(32, 32);
        const firstCipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(firstKey);
        const secondCipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(secondKey);
        // Act
        const firstResult: Uint8Array =
            firstCipher._expandKey(firstKey);
        const secondResult: Uint8Array =
            secondCipher._expandKey(secondKey);
        // Assert
        expect(firstResult.length).toBe(240);
        expect(secondResult.length).toBe(240);
        expect(compareBytes(firstResult, secondResult)).toBe(false);
        expect(
            compareBytes(secondResult.subarray(0, 32), secondKey)
        ).toBe(true);
    });
    it('writes every expanded-key position through byte 239', () => {
        // Arrange
        const key: Uint8Array = createSequentialBytes(32);
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(key);
        // Act
        const expandedKey: Uint8Array = cipher._expandKey(key);
        // Assert
        expect(expandedKey[0]).toBe(0);
        expect(expandedKey[31]).toBe(31);
        expect(expandedKey[32]).toBe(0xa5);
        expect(expandedKey[239]).toBe(0x36);
        expect(expandedKey.length).toBe(240);
    });
});
describe('_initializeGCM', () => {
    it('initializes GCM using a 12-byte IV', () => {
        // Arrange
        const key: Uint8Array = new Uint8Array(32);
        const iv: Uint8Array = createSequentialBytes(12);
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(key);
        // Act
        cipher._initializeGCM(iv);
        // Assert
        const gcmState: {
            iv: Uint8Array;
            counter: number;
            hashKey: Uint8Array;
        } = (cipher as any)._gcmState;
        expect(gcmState).toBeDefined();
        expect(gcmState.counter).toBe(1);
        expect(compareBytes(gcmState.iv, iv)).toBe(true);
        expect(gcmState.iv).not.toBe(iv);
        expect(gcmState.hashKey.length).toBe(16);
        expect(convertBytesToHex(gcmState.hashKey)).toBe('dc95c078a2408989ad48a21492842087');
    });
    it('throws exact error for an 11-byte IV', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(new Uint8Array(32));
        const iv: Uint8Array = new Uint8Array(11);
        // Act
        const initialize: () => void = (): void => {
            cipher._initializeGCM(iv);
        };
        // Assert
        expect(initialize).toThrowError(
            'AES-GCM requires 12-byte IV'
        );
    });
    it('throws exact error for a 13-byte IV', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(new Uint8Array(32));
        const iv: Uint8Array = new Uint8Array(13);
        // Act
        const initialize: () => void = (): void => {
            cipher._initializeGCM(iv);
        };
        // Assert
        expect(initialize).toThrowError(
            'AES-GCM requires 12-byte IV'
        );
    });
});
describe('_encryptBlock', () => {
    it('returns the exact AES-256 known-answer ciphertext', () => {
        // Arrange
        const key: Uint8Array = createBytesFromHex(
            '000102030405060708090a0b0c0d0e0f' +
            '101112131415161718191a1b1c1d1e1f'
        );
        const input: Uint8Array = createBytesFromHex(
            '00112233445566778899aabbccddeeff'
        );
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(key);
        // Act
        const result: Uint8Array =
            cipher._encryptBlock(input, cipher._key);
        // Assert
        expect(result.length).toBe(16);
        expect(convertBytesToHex(result)).toBe(
            '8ea2b7ca516745bfeafc49904b496089'
        );
    });
    it('returns exact ciphertext for zero key and zero block', () => {
        // Arrange
        const key: Uint8Array = new Uint8Array(32);
        const input: Uint8Array = new Uint8Array(16);
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(key);
        // Act
        const result: Uint8Array =
            cipher._encryptBlock(input, cipher._key);
        // Assert
        expect(convertBytesToHex(result)).toBe(
            'dc95c078a2408989ad48a21492842087'
        );
        expect(compareBytes(result, input)).toBe(false);
    });
    it('does not modify the supplied input block', () => {
        // Arrange
        const key: Uint8Array = createSequentialBytes(32);
        const input: Uint8Array = createSequentialBytes(16, 32);
        const originalInput: Uint8Array = new Uint8Array(input);
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(key);
        // Act
        const result: Uint8Array =
            cipher._encryptBlock(input, cipher._key);
        // Assert
        expect(compareBytes(input, originalInput)).toBe(true);
        expect(compareBytes(result, originalInput)).toBe(false);
        expect(result.length).toBe(16);
    });
});
describe('_shiftRows', () => {
    it('moves every AES state row to the exact output position', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(new Uint8Array(32));
        const state: Uint8Array = createSequentialBytes(16);
        // Act
        cipher._shiftRows(state);
        // Assert
        expect(Array.from(state)).toEqual([
            0, 5, 10, 15,
            4, 9, 14, 3,
            8, 13, 2, 7,
            12, 1, 6, 11
        ]);
    });
});
describe('_mul2 and _mul3', () => {
    it('_mul2 returns exact GF multiplication results', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(new Uint8Array(32));
        // Act
        const zeroResult: number = cipher._mul2(0);
        const lowResult: number = cipher._mul2(0x57);
        const highResult: number = cipher._mul2(0x83);
        const maximumResult: number = cipher._mul2(0xff);
        // Assert
        expect(zeroResult).toBe(0);
        expect(lowResult).toBe(0xae);
        expect(highResult).toBe(0x1d);
        expect(maximumResult).toBe(0xe5);
    });
    it('_mul3 returns exact GF multiplication results', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(new Uint8Array(32));
        // Act
        const zeroResult: number = cipher._mul3(0);
        const lowResult: number = cipher._mul3(0x57);
        const highResult: number = cipher._mul3(0x83);
        const maximumResult: number = cipher._mul3(0xff);
        // Assert
        expect(zeroResult).toBe(0);
        expect(lowResult).toBe(0xf9);
        expect(highResult).toBe(0x9e);
        expect(maximumResult).toBe(0x1a);
    });
});
describe('_mixColumns', () => {
    it('produces the exact AES MixColumns transformation', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(new Uint8Array(32));
        const state: Uint8Array = createBytesFromHex(
            'd4bf5d30e0b452aeb84111f11e2798e5'
        );
        // Act
        cipher._mixColumns(state);
        // Assert
        expect(convertBytesToHex(state)).toBe(
            '046681e5e0cb199a48f8d37a2806264c'
        );
    });
    it('processes all four columns', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(new Uint8Array(32));
        const state: Uint8Array = createSequentialBytes(16, 1);
        // Act
        cipher._mixColumns(state);
        // Assert
        expect(Array.from(state)).toEqual([
            3, 4, 9, 10,
            15, 8, 21, 30,
            11, 12, 1, 2,
            23, 16, 45, 54
        ]);
    });
    it('keeps a zero state unchanged', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(new Uint8Array(32));
        const state: Uint8Array = new Uint8Array(16);
        // Act
        cipher._mixColumns(state);
        // Assert
        expect(convertBytesToHex(state)).toBe(
            '00000000000000000000000000000000'
        );
    });
});
describe('_incrementCounter', () => {
    it('increments the last counter byte', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(new Uint8Array(32));
        const counter: Uint8Array = new Uint8Array(16);
        counter[15] = 1;
        // Act
        cipher._incrementCounter(counter);
        // Assert
        expect(counter[12]).toBe(0);
        expect(counter[13]).toBe(0);
        expect(counter[14]).toBe(0);
        expect(counter[15]).toBe(2);
    });
    it('stops when the incremented byte is non-zero', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(new Uint8Array(32));
        const counter: Uint8Array = new Uint8Array(16);
        counter[12] = 10;
        counter[13] = 20;
        counter[14] = 30;
        counter[15] = 40;
        // Act
        cipher._incrementCounter(counter);
        // Assert
        expect(counter[12]).toBe(10);
        expect(counter[13]).toBe(20);
        expect(counter[14]).toBe(30);
        expect(counter[15]).toBe(41);
    });
    it('propagates carry to byte fourteen', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(new Uint8Array(32));
        const counter: Uint8Array = new Uint8Array(16);
        counter[14] = 4;
        counter[15] = 255;
        // Act
        cipher._incrementCounter(counter);
        // Assert
        expect(counter[13]).toBe(0);
        expect(counter[14]).toBe(5);
        expect(counter[15]).toBe(0);
    });
    it('propagates carry to byte thirteen', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(new Uint8Array(32));
        const counter: Uint8Array = new Uint8Array(16);
        counter[13] = 8;
        counter[14] = 255;
        counter[15] = 255;
        // Act
        cipher._incrementCounter(counter);
        // Assert
        expect(counter[12]).toBe(0);
        expect(counter[13]).toBe(9);
        expect(counter[14]).toBe(0);
        expect(counter[15]).toBe(0);
    });
    it('propagates carry through all four counter bytes', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(new Uint8Array(32));
        const counter: Uint8Array = new Uint8Array(16);
        counter[11] = 9;
        counter[12] = 255;
        counter[13] = 255;
        counter[14] = 255;
        counter[15] = 255;
        // Act
        cipher._incrementCounter(counter);
        // Assert
        expect(counter[11]).toBe(9);
        expect(counter[12]).toBe(0);
        expect(counter[13]).toBe(0);
        expect(counter[14]).toBe(0);
        expect(counter[15]).toBe(0);
    });
});
describe('_gctrEncrypt', () => {
    it('throws exact error before GCM initialization', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(new Uint8Array(32));
        const data: Uint8Array = new Uint8Array(16);
        // Act
        const encryptData: () => void = (): void => {
            cipher._gctrEncrypt(data);
        };
        // Assert
        expect(encryptData).toThrowError(
            'GCM state not initialized'
        );
    });
    it('returns an empty result for empty input', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(new Uint8Array(32));
        cipher._initializeGCM(new Uint8Array(12));
        // Act
        const result: Uint8Array =
            cipher._gctrEncrypt(new Uint8Array(0));
        // Assert
        expect(result.length).toBe(0);
        expect(Array.from(result)).toEqual([]);
    });
    it('returns exact GCTR output for a zero block', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(new Uint8Array(32));
        const data: Uint8Array = new Uint8Array(16);
        cipher._initializeGCM(new Uint8Array(12));
        // Act
        const result: Uint8Array = cipher._gctrEncrypt(data);
        // Assert
        expect(result.length).toBe(16);
        expect(convertBytesToHex(result)).toBe(
            'cea7403d4d606b6e074ec5d3baf39d18'
        );
    });
    it('handles a one-byte partial block', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(new Uint8Array(32));
        const data: Uint8Array = new Uint8Array([0]);
        cipher._initializeGCM(new Uint8Array(12));
        // Act
        const result: Uint8Array = cipher._gctrEncrypt(data);
        // Assert
        expect(result.length).toBe(1);
        expect(result[0]).toBe(0xce);
    });
    it('handles a 15-byte partial block', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(new Uint8Array(32));
        const data: Uint8Array = new Uint8Array(15);
        cipher._initializeGCM(new Uint8Array(12));
        // Act
        const result: Uint8Array = cipher._gctrEncrypt(data);
        // Assert
        expect(result.length).toBe(15);
        expect(convertBytesToHex(result)).toBe(
            'cea7403d4d606b6e074ec5d3baf39d'
        );
    });
    it('processes two complete blocks using different counters', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(new Uint8Array(32));
        const data: Uint8Array = new Uint8Array(32);
        cipher._initializeGCM(new Uint8Array(12));
        // Act
        const result: Uint8Array = cipher._gctrEncrypt(data);
        const firstBlock: Uint8Array = result.subarray(0, 16);
        const secondBlock: Uint8Array = result.subarray(16, 32);
        // Assert
        expect(result.length).toBe(32);
        expect(convertBytesToHex(firstBlock)).toBe(
            'cea7403d4d606b6e074ec5d3baf39d18'
        );
        expect(convertBytesToHex(secondBlock)).not.toBe(
            'cea7403d4d606b6e074ec5d3baf39d18'
        );
        expect(compareBytes(firstBlock, secondBlock)).toBe(false);
    });
    it('encrypting the GCTR output returns the original data', () => {
        // Arrange
        const key: Uint8Array = createSequentialBytes(32);
        const iv: Uint8Array = createSequentialBytes(12, 32);
        const data: Uint8Array = createSequentialBytes(31, 64);
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(key);
        cipher._initializeGCM(iv);
        const encrypted: Uint8Array = cipher._gctrEncrypt(data);
        // Act
        cipher._initializeGCM(iv);
        const decrypted: Uint8Array =
            cipher._gctrEncrypt(encrypted);
        // Assert
        expect(decrypted.length).toBe(data.length);
        expect(compareBytes(decrypted, data)).toBe(true);
    });
});
describe('_gfMult', () => {
    it('returns exact standard GCM multiplication result', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(new Uint8Array(32));
        const first: Uint8Array = createBytesFromHex(
            '0388dace60b6a392f328c2b971b2fe78'
        );
        const second: Uint8Array = createBytesFromHex(
            '66e94bd4ef8a2c3b884cfa59ca342b2e'
        );
        // Act
        const result: Uint8Array =
            cipher._gfMult(first, second);
        // Assert
        expect(result.length).toBe(16);
        expect(convertBytesToHex(result)).toBe(
            '5e2ec746917062882c85b0685353deb7'
        );
    });
    it('returns zero when the first operand is zero', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(new Uint8Array(32));
        const first: Uint8Array = new Uint8Array(16);
        const second: Uint8Array = createSequentialBytes(16, 1);
        // Act
        const result: Uint8Array =
            cipher._gfMult(first, second);
        // Assert
        expect(convertBytesToHex(result)).toBe(
            '00000000000000000000000000000000'
        );
    });
    it('returns zero when the second operand is zero', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(new Uint8Array(32));
        const first: Uint8Array = createSequentialBytes(16, 1);
        const second: Uint8Array = new Uint8Array(16);
        // Act
        const result: Uint8Array =
            cipher._gfMult(first, second);
        // Assert
        expect(convertBytesToHex(result)).toBe(
            '00000000000000000000000000000000'
        );
    });
    it('returns second operand when only the first source bit is set', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(new Uint8Array(32));
        const first: Uint8Array = new Uint8Array(16);
        const second: Uint8Array = createSequentialBytes(16, 1);
        first[0] = 0x80;
        // Act
        const result: Uint8Array =
            cipher._gfMult(first, second);
        // Assert
        expect(compareBytes(result, second)).toBe(true);
    });
    it('processes a set bit at byte index one', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(new Uint8Array(32));
        const first: Uint8Array = new Uint8Array(16);
        const second: Uint8Array = createSequentialBytes(16, 1);
        first[1] = 0x80;
        // Act
        const result: Uint8Array =
            cipher._gfMult(first, second);
        // Assert
        expect(result.length).toBe(16);
        expect(compareBytes(result, second)).toBe(false);
        expect(convertBytesToHex(result)).not.toBe(
            '00000000000000000000000000000000'
        );
    });
    it('processes the final source bit', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(new Uint8Array(32));
        const first: Uint8Array = new Uint8Array(16);
        const second: Uint8Array = createSequentialBytes(16, 1);
        first[15] = 1;
        // Act
        const result: Uint8Array =
            cipher._gfMult(first, second);
        // Assert
        expect(result.length).toBe(16);
        expect(convertBytesToHex(result)).not.toBe(
            '00000000000000000000000000000000'
        );
    });
    it('applies the reduction polynomial when the low bit is set', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(new Uint8Array(32));
        const first: Uint8Array = new Uint8Array(16);
        const second: Uint8Array = new Uint8Array(16);
        first[0] = 0x40;
        second[15] = 1;
        // Act
        const result: Uint8Array =
            cipher._gfMult(first, second);
        // Assert
        expect(result[0]).toBe(0xe1);
        expect(result[15]).toBe(0);
    });
    it('shifts values across adjacent bytes', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(new Uint8Array(32));
        const first: Uint8Array = new Uint8Array(16);
        const second: Uint8Array = new Uint8Array(16);
        first[0] = 0x40;
        second[0] = 1;
        // Act
        const result: Uint8Array =
            cipher._gfMult(first, second);
        // Assert
        expect(result[0]).toBe(0);
        expect(result[1]).toBe(0x80);
    });
});
describe('_ghash', () => {
    it('throws exact error before GCM initialization', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(new Uint8Array(32));
        // Act
        const calculateHash: () => void = (): void => {
            cipher._ghash(
                new Uint8Array(0),
                new Uint8Array(0)
            );
        };
        // Assert
        expect(calculateHash).toThrowError(
            'GCM state not initialized'
        );
    });
    it('returns zero hash for empty AAD and empty ciphertext', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(new Uint8Array(32));
        cipher._initializeGCM(new Uint8Array(12));
        // Act
        const result: Uint8Array = cipher._ghash(
            new Uint8Array(0),
            new Uint8Array(0)
        );
        // Assert
        expect(result.length).toBe(16);
        expect(convertBytesToHex(result)).toBe(
            '00000000000000000000000000000000'
        );
    });
    it('returns a non-zero hash for ciphertext', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(new Uint8Array(32));
        const ciphertext: Uint8Array = createBytesFromHex(
            'c7713b2f94add5f2affd2d0e8e1a1a9c'
        );
        cipher._initializeGCM(new Uint8Array(12));
        // Act
        const result: Uint8Array = cipher._ghash(
            new Uint8Array(0),
            ciphertext
        );
        // Assert
        expect(result.length).toBe(16);
        expect(convertBytesToHex(result)).not.toBe(
            '00000000000000000000000000000000'
        );
    });
    it('hashes a one-byte partial AAD block', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(createSequentialBytes(32));
        const aad: Uint8Array = new Uint8Array([1]);
        cipher._initializeGCM(createSequentialBytes(12, 32));
        // Act
        const result: Uint8Array = cipher._ghash(
            aad,
            new Uint8Array(0)
        );
        // Assert
        expect(result.length).toBe(16);
        expect(convertBytesToHex(result)).not.toBe(
            '00000000000000000000000000000000'
        );
    });
    it('distinguishes 15-byte and 16-byte ciphertext', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(createSequentialBytes(32));
        const partialBlock: Uint8Array =
            createSequentialBytes(15, 1);
        const completeBlock: Uint8Array =
            createSequentialBytes(16, 1);
        cipher._initializeGCM(createSequentialBytes(12, 32));
        // Act
        const partialResult: Uint8Array = cipher._ghash(
            new Uint8Array(0),
            partialBlock
        );
        const completeResult: Uint8Array = cipher._ghash(
            new Uint8Array(0),
            completeBlock
        );
        // Assert
        expect(partialResult.length).toBe(16);
        expect(completeResult.length).toBe(16);
        expect(
            compareBytes(partialResult, completeResult)
        ).toBe(false);
    });
    it('distinguishes one-block and two-block ciphertext', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(createSequentialBytes(32));
        const oneBlock: Uint8Array =
            createSequentialBytes(16, 1);
        const twoBlocks: Uint8Array =
            createSequentialBytes(32, 1);
        cipher._initializeGCM(createSequentialBytes(12, 64));
        // Act
        const oneBlockResult: Uint8Array = cipher._ghash(
            new Uint8Array(0),
            oneBlock
        );
        const twoBlockResult: Uint8Array = cipher._ghash(
            new Uint8Array(0),
            twoBlocks
        );
        // Assert
        expect(
            compareBytes(oneBlockResult, twoBlockResult)
        ).toBe(false);
    });
    it('includes AAD in the resulting hash', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(createSequentialBytes(32));
        const aad: Uint8Array = createSequentialBytes(17, 1);
        const ciphertext: Uint8Array =
            createSequentialBytes(31, 32);
        cipher._initializeGCM(createSequentialBytes(12, 96));
        // Act
        const resultWithAad: Uint8Array = cipher._ghash(
            aad,
            ciphertext
        );
        const resultWithoutAad: Uint8Array = cipher._ghash(
            new Uint8Array(0),
            ciphertext
        );
        // Assert
        expect(
            compareBytes(resultWithAad, resultWithoutAad)
        ).toBe(false);
    });
    it('includes ciphertext length in the resulting hash', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(createSequentialBytes(32));
        const shortCiphertext: Uint8Array =
            createFilledBytes(15, 7);
        const longCiphertext: Uint8Array =
            createFilledBytes(16, 7);
        cipher._initializeGCM(createSequentialBytes(12, 8));
        // Act
        const shortResult: Uint8Array = cipher._ghash(
            new Uint8Array(0),
            shortCiphertext
        );
        const longResult: Uint8Array = cipher._ghash(
            new Uint8Array(0),
            longCiphertext
        );
        // Assert
        expect(compareBytes(shortResult, longResult)).toBe(false);
    });
});
describe('_computeAuthTag', () => {
    it('throws exact error before GCM initialization', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(new Uint8Array(32));
        // Act
        const calculateTag: () => void = (): void => {
            cipher._computeAuthTag(
                new Uint8Array(0),
                new Uint8Array(0)
            );
        };
        // Assert
        expect(calculateTag).toThrowError(
            'GCM state not initialized'
        );
    });
    it('returns exact empty-message authentication tag', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(new Uint8Array(32));
        cipher._initializeGCM(new Uint8Array(12));
        // Act
        const result: Uint8Array = cipher._computeAuthTag(
            new Uint8Array(0),
            new Uint8Array(0)
        );
        // Assert
        expect(result.length).toBe(16);
        expect(convertBytesToHex(result)).toBe(
            '530f8afbc74536b9a963b4f1c4cb738b'
        );
    });
    it('changes the tag when ciphertext changes', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(createSequentialBytes(32));
        const firstCiphertext: Uint8Array =
            createSequentialBytes(16, 32);
        const secondCiphertext: Uint8Array =
            new Uint8Array(firstCiphertext);
        secondCiphertext[15] ^= 1;
        cipher._initializeGCM(createSequentialBytes(12, 64));
        // Act
        const firstTag: Uint8Array = cipher._computeAuthTag(
            new Uint8Array(0),
            firstCiphertext
        );
        const secondTag: Uint8Array = cipher._computeAuthTag(
            new Uint8Array(0),
            secondCiphertext
        );
        // Assert
        expect(compareBytes(firstTag, secondTag)).toBe(false);
    });
    it('changes the tag when AAD changes', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(createSequentialBytes(32));
        const ciphertext: Uint8Array =
            createSequentialBytes(16, 32);
        cipher._initializeGCM(createSequentialBytes(12, 64));
        // Act
        const firstTag: Uint8Array = cipher._computeAuthTag(
            new Uint8Array([1]),
            ciphertext
        );
        const secondTag: Uint8Array = cipher._computeAuthTag(
            new Uint8Array([2]),
            ciphertext
        );
        // Assert
        expect(compareBytes(firstTag, secondTag)).toBe(false);
    });
});
describe('_encrypt', () => {
    it('returns IV, ciphertext and authentication tag', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(createSequentialBytes(32));
        const data: Uint8Array = createSequentialBytes(24, 64);
        // Act
        const result: Uint8Array = cipher._encrypt(data);
        const iv: Uint8Array = result.subarray(0, 12);
        const ciphertext: Uint8Array = result.subarray(12, 36);
        const tag: Uint8Array = result.subarray(36);
        // Assert
        expect(result.length).toBe(52);
        expect(iv.length).toBe(12);
        expect(ciphertext.length).toBe(24);
        expect(tag.length).toBe(16);
        expect(compareBytes(ciphertext, data)).toBe(false);
    });
    it('returns 28 bytes for empty input', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(createSequentialBytes(32));
        // Act
        const result: Uint8Array =
            cipher._encrypt(new Uint8Array(0));
        // Assert
        expect(result.length).toBe(28);
        expect(result.subarray(0, 12).length).toBe(12);
        expect(result.subarray(12, 12).length).toBe(0);
        expect(result.subarray(12).length).toBe(16);
    });
    it('does not modify the original input', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(createSequentialBytes(32));
        const data: Uint8Array = createSequentialBytes(25, 16);
        const originalData: Uint8Array = new Uint8Array(data);
        // Act
        const result: Uint8Array = cipher._encrypt(data);
        // Assert
        expect(compareBytes(data, originalData)).toBe(true);
        expect(result.length).toBe(data.length + 28);
    });
});
describe('_decryptBlock', () => {
    it('throws exact error for data shorter than 28 bytes', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(new Uint8Array(32));
        const data: Uint8Array = new Uint8Array(27);
        // Act
        const decryptData: () => void = (): void => {
            cipher._decryptBlock(data);
        };
        // Assert
        expect(decryptData).toThrowError(
            'GCM encrypted data must include IV (12 bytes) and tag (16 bytes)'
        );
        expect(data.length).toBe(27);
    });
    it('accepts the minimum 28-byte encrypted input', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(new Uint8Array(32));
        const iv: Uint8Array = new Uint8Array(12);
        cipher._initializeGCM(iv);
        const tag: Uint8Array = cipher._computeAuthTag(
            new Uint8Array(0),
            new Uint8Array(0)
        );
        const data: Uint8Array = new Uint8Array(28);
        data.set(iv, 0);
        data.set(tag, 12);
        // Act
        const result: Uint8Array =
            cipher._decryptBlock(data);
        // Assert
        expect(data.length).toBe(28);
        expect(result.length).toBe(0);
        expect(Array.from(result)).toEqual([]);
    });
    it('round trips a one-byte value', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(createSequentialBytes(32));
        const data: Uint8Array = new Uint8Array([197]);
        // Act
        const encrypted: Uint8Array = cipher._encrypt(data);
        const decrypted: Uint8Array =
            cipher._decryptBlock(encrypted);
        // Assert
        expect(decrypted.length).toBe(1);
        expect(decrypted[0]).toBe(197);
        expect(compareBytes(decrypted, data)).toBe(true);
    });
    it('round trips a 15-byte partial block', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(createSequentialBytes(32));
        const data: Uint8Array = createSequentialBytes(15, 16);
        // Act
        const encrypted: Uint8Array = cipher._encrypt(data);
        const decrypted: Uint8Array =
            cipher._decryptBlock(encrypted);
        // Assert
        expect(decrypted.length).toBe(15);
        expect(compareBytes(decrypted, data)).toBe(true);
    });
    it('round trips one complete block', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(createSequentialBytes(32));
        const data: Uint8Array = createSequentialBytes(16, 32);
        // Act
        const encrypted: Uint8Array = cipher._encrypt(data);
        const decrypted: Uint8Array =
            cipher._decryptBlock(encrypted);
        // Assert
        expect(decrypted.length).toBe(16);
        expect(compareBytes(decrypted, data)).toBe(true);
    });
    it('round trips two complete blocks', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(createSequentialBytes(32));
        const data: Uint8Array = createSequentialBytes(32, 64);
        // Act
        const encrypted: Uint8Array = cipher._encrypt(data);
        const decrypted: Uint8Array =
            cipher._decryptBlock(encrypted);
        // Assert
        expect(decrypted.length).toBe(32);
        expect(compareBytes(decrypted, data)).toBe(true);
    });
    it('round trips multiple complete and partial blocks', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(createSequentialBytes(32));
        const data: Uint8Array = createSequentialBytes(65, 96);
        // Act
        const encrypted: Uint8Array = cipher._encrypt(data);
        const decrypted: Uint8Array =
            cipher._decryptBlock(encrypted);
        // Assert
        expect(decrypted.length).toBe(65);
        expect(compareBytes(decrypted, data)).toBe(true);
    });
    it('uses the supplied IV branch and rejects ciphertext with appended tag', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(createSequentialBytes(32));
        const data: Uint8Array = createSequentialBytes(19, 48);
        const encrypted: Uint8Array = cipher._encrypt(data);
        const iv: Uint8Array = new Uint8Array(
            encrypted.subarray(0, 12)
        );
        const ciphertextAndTag: Uint8Array = new Uint8Array(
            encrypted.subarray(12)
        );
        // Act
        const decryptData: () => void = (): void => {
            cipher._decryptBlock(
                ciphertextAndTag,
                true,
                iv
            );
        };
        // Assert
        expect(iv.length).toBe(12);
        expect(ciphertextAndTag.length).toBe(data.length + 16);
        expect(decryptData).toThrowError(
            'GCM authentication tag verification failed'
        );
    });
    it('throws exact error when first ciphertext byte changes', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(createSequentialBytes(32));
        const data: Uint8Array = createSequentialBytes(32, 32);
        const encrypted: Uint8Array = cipher._encrypt(data);
        encrypted[12] ^= 1;
        // Act
        const decryptData: () => void = (): void => {
            cipher._decryptBlock(encrypted);
        };
        // Assert
        expect(decryptData).toThrowError(
            'GCM authentication tag verification failed'
        );
    });
    it('throws exact error when last ciphertext byte changes', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(createSequentialBytes(32));
        const data: Uint8Array = createSequentialBytes(32, 64);
        const encrypted: Uint8Array = cipher._encrypt(data);
        const finalCiphertextIndex: number =
            encrypted.length - 17;
        encrypted[finalCiphertextIndex] ^= 1;
        // Act
        const decryptData: () => void = (): void => {
            cipher._decryptBlock(encrypted);
        };
        // Assert
        expect(decryptData).toThrowError(
            'GCM authentication tag verification failed'
        );
    });
    it('throws exact error when first tag byte changes', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(createSequentialBytes(32));
        const data: Uint8Array = createSequentialBytes(17, 16);
        const encrypted: Uint8Array = cipher._encrypt(data);
        const firstTagIndex: number = encrypted.length - 16;
        encrypted[firstTagIndex] ^= 1;
        // Act
        const decryptData: () => void = (): void => {
            cipher._decryptBlock(encrypted);
        };
        // Assert
        expect(decryptData).toThrowError(
            'GCM authentication tag verification failed'
        );
    });
    it('throws exact error when middle tag byte changes', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(createSequentialBytes(32));
        const data: Uint8Array = createSequentialBytes(17, 32);
        const encrypted: Uint8Array = cipher._encrypt(data);
        const middleTagIndex: number = encrypted.length - 8;
        encrypted[middleTagIndex] ^= 1;
        // Act
        const decryptData: () => void = (): void => {
            cipher._decryptBlock(encrypted);
        };
        // Assert
        expect(decryptData).toThrowError(
            'GCM authentication tag verification failed'
        );
    });
    it('throws exact error when final tag byte changes', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(createSequentialBytes(32));
        const data: Uint8Array = createSequentialBytes(17, 64);
        const encrypted: Uint8Array = cipher._encrypt(data);
        encrypted[encrypted.length - 1] ^= 1;
        // Act
        const decryptData: () => void = (): void => {
            cipher._decryptBlock(encrypted);
        };
        // Assert
        expect(decryptData).toThrowError(
            'GCM authentication tag verification failed'
        );
    });
    it('throws exact error when the supplied IV is incorrect', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(createSequentialBytes(32));
        const data: Uint8Array = createSequentialBytes(19, 96);
        const encrypted: Uint8Array = cipher._encrypt(data);
        const iv: Uint8Array =
            new Uint8Array(encrypted.subarray(0, 12));
        const ciphertextAndTag: Uint8Array =
            encrypted.subarray(12);
        iv[11] ^= 1;
        // Act
        const decryptData: () => void = (): void => {
            cipher._decryptBlock(
                ciphertextAndTag,
                true,
                iv
            );
        };
        // Assert
        expect(decryptData).toThrowError(
            'GCM authentication tag verification failed'
        );
    });
});
describe('_AdvancedEncryptionGcmCipher constructor mutations', () => {
    function createSequentialBytes(
        length: number,
        start: number = 0
    ): Uint8Array {
        const bytes: Uint8Array = new Uint8Array(length);
        for (let index: number = 0; index < length; index++) {
            bytes[index] = (start + index) & 0xff;
        }
        return bytes;
    }
    function createBytesFromHex(value: string): Uint8Array {
        const bytes: Uint8Array = new Uint8Array(value.length / 2);
        for (let index: number = 0; index < bytes.length; index++) {
            const start: number = index * 2;
            bytes[index] = parseInt(
                value.substring(start, start + 2),
                16
            );
        }
        return bytes;
    }
    function convertBytesToHex(bytes: Uint8Array): string {
        let value: string = '';
        for (let index: number = 0; index < bytes.length; index++) {
            let hexValue: string = bytes[index].toString(16);
            if (hexValue.length === 1) {
                hexValue = '0' + hexValue;
            }
            value += hexValue;
        }
        return value;
    }
    function compareBytes(
        first: Uint8Array,
        second: Uint8Array
    ): boolean {
        if (first.length !== second.length) {
            return false;
        }
        for (let index: number = 0; index < first.length; index++) {
            if (first[index] !== second[index]) {
                return false;
            }
        }
        return true;
    }
    it('creates a usable derived cipher instance', () => {
        // Arrange
        const key: Uint8Array = createSequentialBytes(32);
        // Act
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(key);
        // Assert
        expect(cipher).toBeDefined();
        expect(cipher instanceof _AdvancedEncryptionGcmCipher).toBe(true);
        expect(cipher._cyclesOfRepetition).toBe(14);
        expect(cipher._keySize).toBe(240);
        expect(cipher._key.length).toBe(240);
    });
    it('throws the exact constructor error for an invalid key', () => {
        // Arrange
        const key: Uint8Array = new Uint8Array(31);
        // Act
        const createCipher: () => void = (): void => {
            new _AdvancedEncryptionGcmCipher(key);
        };
        // Assert
        expect(createCipher).toThrowError(
            'AES-GCM requires 256-bit (32-byte) key'
        );
        expect(key.length).toBe(31);
    });
});
describe('_expandKey survived mutations', () => {
    it('returns the exact 240-byte AES-256 key schedule', () => {
        // Arrange
        const key: Uint8Array = createSequentialBytes(32);
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(key);
        // Act
        const result: Uint8Array = cipher._expandKey(key);
        // Assert
        expect(result.length).toBe(240);
        expect(convertBytesToHex(result)).toBe(
            '000102030405060708090a0b0c0d0e0f' +
            '101112131415161718191a1b1c1d1e1f' +
            'a573c29fa176c498a97fce93a572c09c' +
            '1651a8cd0244beda1a5da4c10640bade' +
            'ae87dff00ff11b68a68ed5fb03fc1567' +
            '6de1f1486fa54f9275f8eb5373b8518d' +
            'c656827fc9a799176f294cec6cd5598b' +
            '3de23a75524775e727bf9eb45407cf39' +
            '0bdc905fc27b0948ad5245a4c1871c2f' +
            '45f5a66017b2d387300d4d33640a820a' +
            '7ccff71cbeb4fe5413e6bbf0d261a7df' +
            'f01afafee7a82979d7a5644ab3afe640' +
            '2541fe719bf500258813bbd55a721c0a' +
            '4e5a6699a9f24fe07e572baacdf8cdea' +
            '24fc79ccbf0979e9371ac23c6d68de36'
        );
        expect(cipher._key).toBe(result);
    });
    it('executes the j modulo 32 equals 16 branch', () => {
        // Arrange
        const key: Uint8Array = createSequentialBytes(32);
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(key);
        // Act
        const result: Uint8Array = cipher._expandKey(key);
        // Assert
        expect(convertBytesToHex(result.subarray(48, 64))).toBe(
            '1651a8cd0244beda1a5da4c10640bade'
        );
        expect(result[48]).toBe(0x16);
        expect(result[63]).toBe(0xde);
    });
    it('executes the j modulo 32 equals zero branch', () => {
        // Arrange
        const key: Uint8Array = createSequentialBytes(32);
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(key);
        // Act
        const result: Uint8Array = cipher._expandKey(key);
        // Assert
        expect(convertBytesToHex(result.subarray(32, 48))).toBe(
            'a573c29fa176c498a97fce93a572c09c'
        );
        expect(result[32]).toBe(0xa5);
        expect(result[47]).toBe(0x9c);
    });
    it('applies the reduced round constant after overflow', () => {
        // Arrange
        const key: Uint8Array = createSequentialBytes(32);
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(key);
        // Act
        const result: Uint8Array = cipher._expandKey(key);
        // Assert
        expect(convertBytesToHex(result.subarray(224, 240))).toBe(
            '24fc79ccbf0979e9371ac23c6d68de36'
        );
        expect(result[224]).toBe(0x24);
        expect(result[239]).toBe(0x36);
        expect(result.length).toBe(240);
    });
});
describe('_encryptBlock loop-boundary mutations', () => {
    it('returns the exact AES-256 known-answer ciphertext', () => {
        // Arrange
        const key: Uint8Array = createBytesFromHex(
            '000102030405060708090a0b0c0d0e0f' +
            '101112131415161718191a1b1c1d1e1f'
        );
        const input: Uint8Array = createBytesFromHex(
            '00112233445566778899aabbccddeeff'
        );
        const originalInput: Uint8Array = new Uint8Array(input);
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(key);
        // Act
        const result: Uint8Array =
            cipher._encryptBlock(input, cipher._key);
        // Assert
        expect(result.length).toBe(16);
        expect(convertBytesToHex(result)).toBe(
            '8ea2b7ca516745bfeafc49904b496089'
        );
        expect(compareBytes(input, originalInput)).toBe(true);
    });
    it('processes the final byte of every AES round', () => {
        // Arrange
        const key: Uint8Array = new Uint8Array(32);
        const input: Uint8Array = new Uint8Array(16);
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(key);
        // Act
        const result: Uint8Array =
            cipher._encryptBlock(input, cipher._key);
        // Assert
        expect(result.length).toBe(16);
        expect(result[0]).toBe(0xdc);
        expect(result[15]).toBe(0x87);
        expect(convertBytesToHex(result)).toBe(
            'dc95c078a2408989ad48a21492842087'
        );
    });
});
describe('_mixColumns loop-boundary mutation', () => {
    it('processes exactly four AES columns', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(new Uint8Array(32));
        const state: Uint8Array = createBytesFromHex(
            'd4bf5d30e0b452aeb84111f11e2798e5'
        );
        // Act
        cipher._mixColumns(state);
        // Assert
        expect(state.length).toBe(16);
        expect(convertBytesToHex(state)).toBe(
            '046681e5e0cb199a48f8d37a2806264c'
        );
        expect(state[0]).toBe(0x04);
        expect(state[15]).toBe(0x4c);
    });
});
describe('_gctrEncrypt survived mutations', () => {
    it('returns an empty output for empty input', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(new Uint8Array(32));
        cipher._initializeGCM(new Uint8Array(12));
        const data: Uint8Array = new Uint8Array(0);
        // Act
        const result: Uint8Array = cipher._gctrEncrypt(data);
        // Assert
        expect(result.length).toBe(0);
        expect(Array.from(result)).toEqual([]);
    });
    it('returns the exact output for one complete block', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(new Uint8Array(32));
        const data: Uint8Array = new Uint8Array(16);
        cipher._initializeGCM(new Uint8Array(12));
        // Act
        const result: Uint8Array = cipher._gctrEncrypt(data);
        // Assert
        expect(result.length).toBe(16);
        expect(convertBytesToHex(result)).toBe(
            'cea7403d4d606b6e074ec5d3baf39d18'
        );
    });
    it('uses the zero-based key-stream index for a second block', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(new Uint8Array(32));
        const data: Uint8Array = new Uint8Array(32);
        cipher._initializeGCM(new Uint8Array(12));
        // Act
        const result: Uint8Array = cipher._gctrEncrypt(data);
        // Assert
        expect(result.length).toBe(32);
        expect(convertBytesToHex(result)).toBe(
            'cea7403d4d606b6e074ec5d3baf39d18' +
            '726003ca37a62a74d1a2f58e7506358e'
        );
        expect(result[16]).toBe(0x72);
        expect(result[31]).toBe(0x8e);
    });
    it('processes the final byte of a partial second block', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(new Uint8Array(32));
        const data: Uint8Array = new Uint8Array(31);
        cipher._initializeGCM(new Uint8Array(12));
        // Act
        const result: Uint8Array = cipher._gctrEncrypt(data);
        // Assert
        expect(result.length).toBe(31);
        expect(convertBytesToHex(result)).toBe(
            'cea7403d4d606b6e074ec5d3baf39d18' +
            '726003ca37a62a74d1a2f58e750635'
        );
        expect(result[30]).toBe(0x35);
    });
    it('does not modify the supplied GCTR input', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(
                createSequentialBytes(32)
            );
        const data: Uint8Array =
            createSequentialBytes(33, 32);
        const originalData: Uint8Array = new Uint8Array(data);
        cipher._initializeGCM(
            createSequentialBytes(12, 96)
        );
        // Act
        const result: Uint8Array = cipher._gctrEncrypt(data);
        // Assert
        expect(result.length).toBe(33);
        expect(compareBytes(data, originalData)).toBe(true);
        expect(compareBytes(result, originalData)).toBe(false);
    });
});
describe('_gfMult loop-boundary mutations', () => {
    it('returns the exact standard GCM multiplication result', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(new Uint8Array(32));
        const first: Uint8Array = createBytesFromHex(
            '0388dace60b6a392f328c2b971b2fe78'
        );
        const second: Uint8Array = createBytesFromHex(
            '66e94bd4ef8a2c3b884cfa59ca342b2e'
        );
        // Act
        const result: Uint8Array =
            cipher._gfMult(first, second);
        // Assert
        expect(result.length).toBe(16);
        expect(convertBytesToHex(result)).toBe(
            '5e2ec746917062882c85b0685353deb7'
        );
    });
    it('processes the final source bit without writing byte sixteen', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(new Uint8Array(32));
        const first: Uint8Array = new Uint8Array(16);
        const second: Uint8Array =
            createSequentialBytes(16, 1);
        first[15] = 1;
        // Act
        const result: Uint8Array =
            cipher._gfMult(first, second);
        // Assert
        expect(result.length).toBe(16);
        expect(convertBytesToHex(result)).toBe(
            '73030c821d9d12803fbf30be21a12e84'
        );
    });
    it('does not modify either multiplication operand', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(new Uint8Array(32));
        const first: Uint8Array =
            createSequentialBytes(16, 1);
        const second: Uint8Array =
            createSequentialBytes(16, 17);
        const originalFirst: Uint8Array =
            new Uint8Array(first);
        const originalSecond: Uint8Array =
            new Uint8Array(second);
        // Act
        const result: Uint8Array =
            cipher._gfMult(first, second);
        // Assert
        expect(result.length).toBe(16);
        expect(compareBytes(first, originalFirst)).toBe(true);
        expect(compareBytes(second, originalSecond)).toBe(true);
    });
});
describe('_ghash survived mutations', () => {
    it('returns the exact GHASH for one ciphertext block', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(new Uint8Array(32));
        const ciphertext: Uint8Array = createBytesFromHex(
            'cea7403d4d606b6e074ec5d3baf39d18'
        );
        cipher._initializeGCM(new Uint8Array(12));
        // Act
        const result: Uint8Array = cipher._ghash(
            new Uint8Array(0),
            ciphertext
        );
        // Assert
        expect(result.length).toBe(16);
        expect(convertBytesToHex(result)).toBe(
            '83de425c5edc5d498f382c441041ca92'
        );
    });
    it('distinguishes an empty message from one zero byte', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(new Uint8Array(32));
        cipher._initializeGCM(new Uint8Array(12));
        // Act
        const emptyResult: Uint8Array = cipher._ghash(
            new Uint8Array(0),
            new Uint8Array(0)
        );
        const oneByteResult: Uint8Array = cipher._ghash(
            new Uint8Array(0),
            new Uint8Array([0])
        );
        // Assert
        expect(convertBytesToHex(emptyResult)).toBe(
            '00000000000000000000000000000000'
        );
        expect(convertBytesToHex(oneByteResult)).not.toBe(
            '00000000000000000000000000000000'
        );
        expect(compareBytes(emptyResult, oneByteResult)).toBe(false);
    });
    it('processes the final byte of a complete AAD block', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(
                createSequentialBytes(32)
            );
        const firstAad: Uint8Array =
            createSequentialBytes(16, 1);
        const secondAad: Uint8Array =
            new Uint8Array(firstAad);
        secondAad[15] ^= 1;
        cipher._initializeGCM(
            createSequentialBytes(12, 64)
        );
        // Act
        const firstResult: Uint8Array = cipher._ghash(
            firstAad,
            new Uint8Array(0)
        );
        const secondResult: Uint8Array = cipher._ghash(
            secondAad,
            new Uint8Array(0)
        );
        // Assert
        expect(firstResult.length).toBe(16);
        expect(secondResult.length).toBe(16);
        expect(compareBytes(firstResult, secondResult)).toBe(false);
    });
    it('processes the final byte of a complete ciphertext block', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(
                createSequentialBytes(32)
            );
        const firstCiphertext: Uint8Array =
            createSequentialBytes(16, 32);
        const secondCiphertext: Uint8Array =
            new Uint8Array(firstCiphertext);
        secondCiphertext[15] ^= 1;
        cipher._initializeGCM(
            createSequentialBytes(12, 96)
        );
        // Act
        const firstResult: Uint8Array = cipher._ghash(
            new Uint8Array(0),
            firstCiphertext
        );
        const secondResult: Uint8Array = cipher._ghash(
            new Uint8Array(0),
            secondCiphertext
        );
        // Assert
        expect(compareBytes(firstResult, secondResult)).toBe(false);
    });
    it('includes the AAD bit length in the hash result', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(
                createSequentialBytes(32)
            );
        const oneByteAad: Uint8Array = new Uint8Array([0]);
        const eightByteAad: Uint8Array = new Uint8Array(8);
        cipher._initializeGCM(
            createSequentialBytes(12, 64)
        );
        // Act
        const oneByteResult: Uint8Array = cipher._ghash(
            oneByteAad,
            new Uint8Array(0)
        );
        const eightByteResult: Uint8Array = cipher._ghash(
            eightByteAad,
            new Uint8Array(0)
        );
        // Assert
        expect(oneByteResult.length).toBe(16);
        expect(eightByteResult.length).toBe(16);
        expect(compareBytes(oneByteResult, eightByteResult)).toBe(false);
    });
    it('includes the ciphertext bit length in the hash result', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(
                createSequentialBytes(32)
            );
        const oneByteCiphertext: Uint8Array =
            new Uint8Array([0]);
        const eightByteCiphertext: Uint8Array =
            new Uint8Array(8);
        cipher._initializeGCM(
            createSequentialBytes(12, 64)
        );
        // Act
        const oneByteResult: Uint8Array = cipher._ghash(
            new Uint8Array(0),
            oneByteCiphertext
        );
        const eightByteResult: Uint8Array = cipher._ghash(
            new Uint8Array(0),
            eightByteCiphertext
        );
        // Assert
        expect(oneByteResult.length).toBe(16);
        expect(eightByteResult.length).toBe(16);
        expect(compareBytes(oneByteResult, eightByteResult)).toBe(false);
    });
    it('executes the final length-block XOR before multiplication', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(new Uint8Array(32));
        cipher._initializeGCM(new Uint8Array(12));
        const ciphertext: Uint8Array = new Uint8Array([0]);
        // Act
        const result: Uint8Array = cipher._ghash(
            new Uint8Array(0),
            ciphertext
        );
        // Assert
        expect(result.length).toBe(16);
        expect(convertBytesToHex(result)).not.toBe(
            '00000000000000000000000000000000'
        );
        expect(result[15]).not.toBeUndefined();
    });
    it('does not modify AAD or ciphertext while hashing', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(
                createSequentialBytes(32)
            );
        const aad: Uint8Array =
            createSequentialBytes(17, 1);
        const ciphertext: Uint8Array =
            createSequentialBytes(31, 32);
        const originalAad: Uint8Array = new Uint8Array(aad);
        const originalCiphertext: Uint8Array =
            new Uint8Array(ciphertext);
        cipher._initializeGCM(
            createSequentialBytes(12, 96)
        );
        // Act
        const result: Uint8Array =
            cipher._ghash(aad, ciphertext);
        // Assert
        expect(result.length).toBe(16);
        expect(compareBytes(aad, originalAad)).toBe(true);
        expect(
            compareBytes(ciphertext, originalCiphertext)
        ).toBe(true);
    });
});
describe('_computeAuthTag survived mutations', () => {
    it('throws the exact error before GCM initialization', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(new Uint8Array(32));
        // Act
        const computeTag: () => void = (): void => {
            cipher._computeAuthTag(
                new Uint8Array(0),
                new Uint8Array(0)
            );
        };
        // Assert
        expect(computeTag).toThrowError(
            'GCM state not initialized'
        );
    });
    it('returns the exact empty-message authentication tag', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(new Uint8Array(32));
        cipher._initializeGCM(new Uint8Array(12));
        // Act
        const result: Uint8Array = cipher._computeAuthTag(
            new Uint8Array(0),
            new Uint8Array(0)
        );
        // Assert
        expect(result.length).toBe(16);
        expect(convertBytesToHex(result)).toBe(
            '530f8afbc74536b9a963b4f1c4cb738b'
        );
        expect(result[0]).toBe(0x53);
        expect(result[15]).toBe(0x8b);
    });
    it('XORs all sixteen GHASH and encrypted J0 bytes', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(new Uint8Array(32));
        const ciphertext: Uint8Array = createBytesFromHex(
            'cea7403d4d606b6e074ec5d3baf39d18'
        );
        cipher._initializeGCM(new Uint8Array(12));
        // Act
        const result: Uint8Array = cipher._computeAuthTag(
            new Uint8Array(0),
            ciphertext
        );
        // Assert
        expect(result.length).toBe(16);
        expect(result[0]).not.toBeUndefined();
        expect(result[15]).not.toBeUndefined();
        expect(convertBytesToHex(result)).not.toBe(
            '00000000000000000000000000000000'
        );
    });
});
describe('_decryptBlock loop-boundary mutation', () => {
    it('accepts and verifies the minimum encrypted input', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(new Uint8Array(32));
        const iv: Uint8Array = new Uint8Array(12);
        cipher._initializeGCM(iv);
        const tag: Uint8Array = cipher._computeAuthTag(
            new Uint8Array(0),
            new Uint8Array(0)
        );
        const encryptedData: Uint8Array = new Uint8Array(28);
        encryptedData.set(iv, 0);
        encryptedData.set(tag, 12);
        // Act
        const result: Uint8Array =
            cipher._decryptBlock(encryptedData);
        // Assert
        expect(result.length).toBe(0);
        expect(Array.from(result)).toEqual([]);
    });
    it('compares the final authentication-tag byte', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(
                createSequentialBytes(32)
            );
        const data: Uint8Array =
            createSequentialBytes(19, 64);
        const encryptedData: Uint8Array =
            cipher._encrypt(data);
        encryptedData[encryptedData.length - 1] ^= 1;
        // Act
        const decryptData: () => void = (): void => {
            cipher._decryptBlock(encryptedData);
        };
        // Assert
        expect(decryptData).toThrowError(
            'GCM authentication tag verification failed'
        );
    });
    it('returns the exact original data after tag verification', () => {
        // Arrange
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(
                createSequentialBytes(32)
            );
        const data: Uint8Array =
            createSequentialBytes(33, 96);
        const originalData: Uint8Array =
            new Uint8Array(data);
        // Act
        const encryptedData: Uint8Array =
            cipher._encrypt(data);
        const result: Uint8Array =
            cipher._decryptBlock(encryptedData);
        // Assert
        expect(result.length).toBe(33);
        expect(compareBytes(result, originalData)).toBe(true);
        expect(compareBytes(data, originalData)).toBe(true);
    });
});
