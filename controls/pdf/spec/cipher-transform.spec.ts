import {
    _CipherTransform,
    _DataEncryptionStandardCipher
} from '../src/pdf/core/security/encryptors/cipher-tranform';
import {
    _AdvancedEncryptionGcmCipher
} from '../src/pdf/core/security/encryptors/advanced-encryption-gcm-cipher';
import { _AdvancedEncryption128Cipher } from '../src/pdf/core/security/encryptors/advance-cipher';
import { _NormalCipherFour } from '../src/pdf/core/security/encryptors/normal-cipher';
function createBytes(values: number[]): Uint8Array {
    return new Uint8Array(values);
}
function getByteValues(value: Uint8Array): number[] {
    const result: number[] = [];
    for (let index: number = 0; index < value.length; index++) {
        result.push(value[<number>index]);
    }
    return result;
}
function toPdfString(value: Uint8Array): string {
    let result: string = '';
    for (let index: number = 0; index < value.length; index++) {
        result += String.fromCharCode(value[<number>index]);
    }
    return result;
}
function getPdfStringBytes(value: string): number[] {
    const result: number[] = [];
    for (let index: number = 0; index < value.length; index++) {
        result.push(value.charCodeAt(index) & 0xff);
    }
    return result;
}
describe('cipher transform mutation coverage', () => {
    it('decryptString returns the exact normal-cipher result', () => {
        // Arrange
        const key: Uint8Array = createBytes([
            0x01, 0x23, 0x45, 0x67,
            0x89, 0xab, 0xcd, 0xef
        ]);
        const encryptedBytes: Uint8Array = createBytes([
            0x75, 0xb7, 0x87, 0x80,
            0x99, 0xe0, 0xc5, 0x96
        ]);
        const cipher: _NormalCipherFour =
            new _NormalCipherFour(key);
        const transform: _CipherTransform =
            new _CipherTransform(cipher, cipher);
        const encryptedString: string =
            toPdfString(encryptedBytes);
        // Act
        const result: string =
            transform.decryptString(encryptedString);
        // Assert
        expect(getPdfStringBytes(result)).toEqual([
            0x01, 0x23, 0x45, 0x67,
            0x89, 0xab, 0xcd, 0xef
        ]);
    });
    it('encryptString returns the exact normal-cipher result', () => {
        // Arrange
        const key: Uint8Array = createBytes([
            0x01, 0x23, 0x45, 0x67,
            0x89, 0xab, 0xcd, 0xef
        ]);
        const plainBytes: Uint8Array = createBytes([
            0x01, 0x23, 0x45, 0x67,
            0x89, 0xab, 0xcd, 0xef
        ]);
        const cipher: _NormalCipherFour =
            new _NormalCipherFour(key);
        const transform: _CipherTransform =
            new _CipherTransform(cipher, cipher);
        const plainString: string =
            toPdfString(plainBytes);
        // Act
        const result: string =
            transform.encryptString(plainString);
        // Assert
        expect(getPdfStringBytes(result)).toEqual([
            0x75, 0xb7, 0x87, 0x80,
            0x99, 0xe0, 0xc5, 0x96
        ]);
    });
    it('encryptString applies one complete AES padding block', () => {
        // Arrange
        const key: Uint8Array = createBytes([
            0x00, 0x01, 0x02, 0x03,
            0x04, 0x05, 0x06, 0x07,
            0x08, 0x09, 0x0a, 0x0b,
            0x0c, 0x0d, 0x0e, 0x0f
        ]);
        const cipher: _AdvancedEncryption128Cipher =
            new _AdvancedEncryption128Cipher(key);
        const transform: _CipherTransform =
            new _CipherTransform(cipher, cipher);
        const text: string = '1234567890123456';
        // Act
        const encrypted: string = transform.encryptString(text);
        // Assert
        expect(encrypted.length).toBe(48);
        expect(encrypted.length - 16).toBe(32);
    });
    it('encryptString applies partial AES padding', () => {
        // Arrange
        const key: Uint8Array = createBytes([
            0x00, 0x01, 0x02, 0x03,
            0x04, 0x05, 0x06, 0x07,
            0x08, 0x09, 0x0a, 0x0b,
            0x0c, 0x0d, 0x0e, 0x0f
        ]);
        const cipher: _AdvancedEncryption128Cipher =
            new _AdvancedEncryption128Cipher(key);
        const transform: _CipherTransform =
            new _CipherTransform(cipher, cipher);
        const text: string = '123456789012345';
        // Act
        const encrypted: string = transform.encryptString(text);
        // Assert
        expect(encrypted.length).toBe(32);
        expect(encrypted.length - 16).toBe(16);
    });
    it('encryptString stores sixteen IV bytes before AES data', () => {
        // Arrange
        const key: Uint8Array = createBytes([
            0x00, 0x01, 0x02, 0x03,
            0x04, 0x05, 0x06, 0x07,
            0x08, 0x09, 0x0a, 0x0b,
            0x0c, 0x0d, 0x0e, 0x0f
        ]);
        const cipher: _AdvancedEncryption128Cipher =
            new _AdvancedEncryption128Cipher(key);
        const transform: _CipherTransform =
            new _CipherTransform(cipher, cipher);
        // Act
        const first: string = transform.encryptString('mutation');
        const second: string = transform.encryptString('mutation');
        // Assert
        expect(first.length).toBe(32);
        expect(second.length).toBe(32);
        expect(first).not.toBe(second);
        expect(first.substring(0, 16)).not.toBe(second.substring(0, 16));
    });
    it('encryptString returns GCM encrypted bytes', () => {
        // Arrange
        const key: Uint8Array = createBytes([
            0x00, 0x01, 0x02, 0x03,
            0x04, 0x05, 0x06, 0x07,
            0x08, 0x09, 0x0a, 0x0b,
            0x0c, 0x0d, 0x0e, 0x0f,
            0x10, 0x11, 0x12, 0x13,
            0x14, 0x15, 0x16, 0x17,
            0x18, 0x19, 0x1a, 0x1b,
            0x1c, 0x1d, 0x1e, 0x1f
        ]);
        const cipher: _AdvancedEncryptionGcmCipher =
            new _AdvancedEncryptionGcmCipher(key);
        const transform: _CipherTransform =
            new _CipherTransform(cipher, cipher);
        // Act
        const result: string = transform.encryptString('GCM mutation');
        // Assert
        expect(result.length).toBeGreaterThan('GCM mutation'.length);
        expect(result).not.toBe('GCM mutation');
    });
});
describe('Data Encryption Standard property mutation coverage', () => {
    it('initializes the complete DES lookup tables', () => {
        // Arrange
        const key: Uint8Array = createBytes([
            0x13, 0x34, 0x57, 0x79,
            0x9b, 0xbc, 0xdf, 0xf1
        ]);
        // Act
        const cipher: _DataEncryptionStandardCipher =
            new _DataEncryptionStandardCipher(key);
        // Assert
        expect(cipher.blockSize).toBe(8);
        expect(cipher._byteBit).toEqual([
            128, 64, 32, 16, 8, 4, 2, 1
        ]);
        expect(cipher._bigByte.length).toBe(24);
        expect(cipher._bigByte[0]).toBe(0x800000);
        expect(cipher._bigByte[12]).toBe(0x800);
        expect(cipher._bigByte[23]).toBe(0x1);
        expect(cipher._sp1.length).toBe(64);
        expect(cipher._sp1[0]).toBe(0x01010400);
        expect(cipher._sp1[63]).toBe(0x01010004);
        expect(cipher._sp2.length).toBe(64);
        expect(cipher._sp2[0]).toBe(0x80108020);
        expect(cipher._sp2[63]).toBe(0x00108000);
        expect(cipher._sp3.length).toBe(64);
        expect(cipher._sp3[0]).toBe(0x00000208);
        expect(cipher._sp3[63]).toBe(0x00020200);
        expect(cipher._sp4.length).toBe(64);
        expect(cipher._sp4[0]).toBe(0x00802001);
        expect(cipher._sp4[63]).toBe(0x00802080);
        expect(cipher._sp5.length).toBe(64);
        expect(cipher._sp5[0]).toBe(0x00000100);
        expect(cipher._sp5[63]).toBe(0x40000100);
        expect(cipher._sp6.length).toBe(64);
        expect(cipher._sp6[0]).toBe(0x20000010);
        expect(cipher._sp6[63]).toBe(0x20004010);
        expect(cipher._sp7.length).toBe(64);
        expect(cipher._sp7[0]).toBe(0x00200000);
        expect(cipher._sp7[63]).toBe(0x00200002);
        expect(cipher._sp8.length).toBe(64);
        expect(cipher._sp8[0]).toBe(0x10001040);
        expect(cipher._sp8[63]).toBe(0x10041000);
        expect(cipher._pc1.length).toBe(56);
        expect(cipher._pc1[0]).toBe(56);
        expect(cipher._pc1[27]).toBe(35);
        expect(cipher._pc1[55]).toBe(3);
        expect(cipher._rotationTable).toEqual([
            1, 2, 4, 6, 8, 10, 12, 14,
            15, 17, 19, 21, 23, 25, 27, 28
        ]);
        expect(cipher._pc2.length).toBe(48);
        expect(cipher._pc2[0]).toBe(13);
        expect(cipher._pc2[23]).toBe(1);
        expect(cipher._pc2[47]).toBe(31);
        const generatedKeys: number[] = cipher._generateWorkingKey(true, key);
        expect(generatedKeys.length).toBe(32)
    });
    it('uses encryption as the constructor default', () => {
        // Arrange
        const key: Uint8Array = createBytes([
            0x13, 0x34, 0x57, 0x79,
            0x9b, 0xbc, 0xdf, 0xf1
        ]);
        const input: Uint8Array = createBytes([
            0x01, 0x23, 0x45, 0x67,
            0x89, 0xab, 0xcd, 0xef
        ]);
        const defaultOutput: Uint8Array = new Uint8Array(8);
        const encryptionOutput: Uint8Array = new Uint8Array(8);
        const decryptionOutput: Uint8Array = new Uint8Array(8);
        const defaultCipher: _DataEncryptionStandardCipher =
            new _DataEncryptionStandardCipher(key);
        const encryptionCipher: _DataEncryptionStandardCipher =
            new _DataEncryptionStandardCipher(key, true);
        const decryptionCipher: _DataEncryptionStandardCipher =
            new _DataEncryptionStandardCipher(key, false);
        // Act
        defaultCipher._processBlock(input, 0, defaultOutput, 0);
        encryptionCipher._processBlock(input, 0, encryptionOutput, 0);
        decryptionCipher._processBlock(input, 0, decryptionOutput, 0);
        // Assert
        expect(getByteValues(defaultOutput))
            .toEqual(getByteValues(encryptionOutput));
        expect(getByteValues(defaultOutput))
            .not.toEqual(getByteValues(decryptionOutput));
        expect(getByteValues(defaultOutput)).toEqual([
            0x85, 0xe8, 0x13, 0x54,
            0x0f, 0x0a, 0xb4, 0x05
        ]);
    });
});
describe('Data Encryption Standard conversion mutation coverage', () => {
    it('_beToUint32 reads the exact four bytes at a non-zero offset', () => {
        // Arrange
        const cipher: _DataEncryptionStandardCipher =
            new _DataEncryptionStandardCipher(
                createBytes([0x13, 0x34, 0x57, 0x79, 0x9b, 0xbc, 0xdf, 0xf1])
            );
        const input: Uint8Array = createBytes([
            0xaa, 0xbb,
            0x12, 0x34, 0x56, 0x78,
            0xcc, 0xdd
        ]);
        // Act
        const result: number = cipher._beToUint32(input, 2);
        // Assert
        expect(result).toBe(0x12345678);
    });
    it('_uint32ToBe writes the exact four bytes at a non-zero offset', () => {
        // Arrange
        const cipher: _DataEncryptionStandardCipher =
            new _DataEncryptionStandardCipher(
                createBytes([0x13, 0x34, 0x57, 0x79, 0x9b, 0xbc, 0xdf, 0xf1])
            );
        const output: Uint8Array = createBytes([
            0xaa, 0xbb, 0x00, 0x00,
            0x00, 0x00, 0xcc, 0xdd
        ]);
        // Act
        cipher._uint32ToBe(0x12345678, output, 2);
        // Assert
        expect(getByteValues(output)).toEqual([
            0xaa, 0xbb,
            0x12, 0x34, 0x56, 0x78,
            0xcc, 0xdd
        ]);
    });
});
describe('Data Encryption Standard key generation mutation coverage', () => {
    it('_generateWorkingKey returns a stable encryption schedule', () => {
        // Arrange
        const key: Uint8Array = createBytes([
            0x13, 0x34, 0x57, 0x79,
            0x9b, 0xbc, 0xdf, 0xf1
        ]);
        const cipher: _DataEncryptionStandardCipher =
            new _DataEncryptionStandardCipher(key, true);
        // Act
        const firstKeys: number[] =
            cipher._generateWorkingKey(true, key);
        const secondKeys: number[] =
            cipher._generateWorkingKey(true, key);
        // Assert
        expect(firstKeys.length).toBe(32);
        expect(secondKeys.length).toBe(32);
        expect(firstKeys).toEqual(secondKeys);
        expect(firstKeys[0]).not.toBe(0);
        expect(firstKeys[1]).not.toBe(0);
        expect(firstKeys[30]).not.toBe(0);
        expect(firstKeys[31]).not.toBe(0);
    });
    it('_generateWorkingKey reverses the round schedule for decryption', () => {
        // Arrange
        const key: Uint8Array = createBytes([
            0x13, 0x34, 0x57, 0x79,
            0x9b, 0xbc, 0xdf, 0xf1
        ]);
        const cipher: _DataEncryptionStandardCipher =
            new _DataEncryptionStandardCipher(key);
        // Act
        const encryptionKeys: number[] =
            cipher._generateWorkingKey(true, key);
        const decryptionKeys: number[] =
            cipher._generateWorkingKey(false, key);
        // Assert
        expect(encryptionKeys.length).toBe(32);
        expect(decryptionKeys.length).toBe(32);
        expect(decryptionKeys[0]).toBe(encryptionKeys[30]);
        expect(decryptionKeys[1]).toBe(encryptionKeys[31]);
        expect(decryptionKeys[30]).toBe(encryptionKeys[0]);
        expect(decryptionKeys[31]).toBe(encryptionKeys[1]);
    });
    it('_generateWorkingKey reverses the round schedule for decryption', () => {
        // Arrange
        const key: Uint8Array = createBytes([
            0x13, 0x34, 0x57, 0x79,
            0x9b, 0xbc, 0xdf, 0xf1
        ]);
        const encryptionCipher: _DataEncryptionStandardCipher =
            new _DataEncryptionStandardCipher(key, true);
        const decryptionCipher: _DataEncryptionStandardCipher =
            new _DataEncryptionStandardCipher(key, false);
        // Act
        const encryptionKeys: number[] =
            encryptionCipher._generateWorkingKey(true, key);
        const decryptionKeys: number[] =
            decryptionCipher._generateWorkingKey(false, key);
        // Assert
        expect(encryptionKeys.length).toBe(32);
        expect(decryptionKeys.length).toBe(32);
        expect(decryptionKeys[0]).toBe(encryptionKeys[30]);
        expect(decryptionKeys[1]).toBe(encryptionKeys[31]);
        expect(decryptionKeys[30]).toBe(encryptionKeys[0]);
        expect(decryptionKeys[31]).toBe(encryptionKeys[1]);
    });
    it('_generateWorkingKey changes when every key bit changes', () => {
        // Arrange
        const firstKey: Uint8Array = createBytes([
            0x13, 0x34, 0x57, 0x79,
            0x9b, 0xbc, 0xdf, 0xf1
        ]);
        const secondKey: Uint8Array = createBytes([
            0xfe, 0xdc, 0xba, 0x98,
            0x76, 0x54, 0x32, 0x10
        ]);
        const cipher: _DataEncryptionStandardCipher =
            new _DataEncryptionStandardCipher(firstKey);
        // Act
        const firstSchedule: number[] =
            cipher._generateWorkingKey(true, firstKey);
        const secondSchedule: number[] =
            cipher._generateWorkingKey(true, secondKey);
        // Assert
        expect(firstSchedule.length).toBe(32);
        expect(secondSchedule.length).toBe(32);
        expect(firstSchedule).not.toEqual(secondSchedule);
    });
});
describe('Data Encryption Standard process-block mutation coverage', () => {
    it('_processBlock encrypts the standard DES known-answer vector', () => {
        // Arrange
        const key: Uint8Array = createBytes([
            0x13, 0x34, 0x57, 0x79,
            0x9b, 0xbc, 0xdf, 0xf1
        ]);
        const input: Uint8Array = createBytes([
            0x01, 0x23, 0x45, 0x67,
            0x89, 0xab, 0xcd, 0xef
        ]);
        const output: Uint8Array = new Uint8Array(8);
        const cipher: _DataEncryptionStandardCipher =
            new _DataEncryptionStandardCipher(key, true);
        // Act
        cipher._processBlock(input, 0, output, 0);
        // Assert
        expect(getByteValues(output)).toEqual([
            0x85, 0xe8, 0x13, 0x54,
            0x0f, 0x0a, 0xb4, 0x05
        ]);
    });
    it('_processBlock decrypts the standard DES known-answer vector', () => {
        // Arrange
        const key: Uint8Array = createBytes([
            0x13, 0x34, 0x57, 0x79,
            0x9b, 0xbc, 0xdf, 0xf1
        ]);
        const input: Uint8Array = createBytes([
            0x85, 0xe8, 0x13, 0x54,
            0x0f, 0x0a, 0xb4, 0x05
        ]);
        const output: Uint8Array = new Uint8Array(8);
        const cipher: _DataEncryptionStandardCipher =
            new _DataEncryptionStandardCipher(key, false);
        // Act
        cipher._processBlock(input, 0, output, 0);
        // Assert
        expect(getByteValues(output)).toEqual([
            0x01, 0x23, 0x45, 0x67,
            0x89, 0xab, 0xcd, 0xef
        ]);
    });
    it('_processBlock respects both non-zero offsets', () => {
        // Arrange
        const key: Uint8Array = createBytes([
            0x13, 0x34, 0x57, 0x79,
            0x9b, 0xbc, 0xdf, 0xf1
        ]);
        const input: Uint8Array = createBytes([
            0xaa, 0xbb, 0xcc,
            0x01, 0x23, 0x45, 0x67,
            0x89, 0xab, 0xcd, 0xef,
            0xdd
        ]);
        const output: Uint8Array = createBytes([
            0x11, 0x22, 0x33, 0x44,
            0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00,
            0x55
        ]);
        const cipher: _DataEncryptionStandardCipher =
            new _DataEncryptionStandardCipher(key, true);
        // Act
        cipher._processBlock(input, 3, output, 4);
        // Assert
        expect(getByteValues(output)).toEqual([
            0x11, 0x22, 0x33, 0x44,
            0x85, 0xe8, 0x13, 0x54,
            0x0f, 0x0a, 0xb4, 0x05,
            0x55
        ]);
    });
    it('_processBlock produces a different output for different input blocks', () => {
        // Arrange
        const key: Uint8Array = createBytes([
            0x13, 0x34, 0x57, 0x79,
            0x9b, 0xbc, 0xdf, 0xf1
        ]);
        const firstInput: Uint8Array = createBytes([
            0x01, 0x23, 0x45, 0x67,
            0x89, 0xab, 0xcd, 0xef
        ]);
        const secondInput: Uint8Array = createBytes([
            0x10, 0x32, 0x54, 0x76,
            0x98, 0xba, 0xdc, 0xfe
        ]);
        const firstOutput: Uint8Array = new Uint8Array(8);
        const secondOutput: Uint8Array = new Uint8Array(8);
        const cipher: _DataEncryptionStandardCipher =
            new _DataEncryptionStandardCipher(key, true);
        // Act
        cipher._processBlock(firstInput, 0, firstOutput, 0);
        cipher._processBlock(secondInput, 0, secondOutput, 0);
        // Assert
        expect(getByteValues(firstOutput)).toEqual([
            0x85, 0xe8, 0x13, 0x54,
            0x0f, 0x0a, 0xb4, 0x05
        ]);
        expect(getByteValues(secondOutput))
            .not.toEqual(getByteValues(firstOutput));
    });
});
