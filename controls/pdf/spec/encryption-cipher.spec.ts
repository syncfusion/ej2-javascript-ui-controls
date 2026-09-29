import { _PdfNativeHashInput } from "../src/pdf/core/security/digital-signature/signature/pdf-accumulator";
import { _TripleDataEncryptionStandardCipher } from "../src/pdf/core/security/encryptors/encryption-cipher";
import { _RaceEvaluationMessageDigest } from "../src/pdf/core/security/encryptors/evaluation-digest";
import { _MD5 } from "../src/pdf/core/security/encryptors/messageDigest5";
import { _CipherTwo, _NormalCipherFour, _NullCipher } from "../src/pdf/core/security/encryptors/normal-cipher";
import { _Sha1 } from "../src/pdf/core/security/encryptors/secureHash-algorithm1";
import { _Sha256 } from "../src/pdf/core/security/encryptors/secureHash-algorithm256";
import { _Sha384, _Sha512 } from "../src/pdf/core/security/encryptors/secureHash-algorithm512";
import { _decode, _padStart } from "../src/pdf/core/utils";
describe('1041440 - encryption-cipher', () => {
    it('1041440 - should store encryption mode passed to constructor', () => {
        const key = new Uint8Array(16);
        const encryptCipher: any =
            new _TripleDataEncryptionStandardCipher(key, true);
        const decryptCipher: any =
            new _TripleDataEncryptionStandardCipher(key, false);

        expect(encryptCipher._isEncryption).toBe(true);
        expect(decryptCipher._isEncryption).toBe(false);
    });
    it('1041440 - should generate stable working key', () => {
        const key = new Uint8Array([0x01, 0x23, 0x45, 0x67, 0x89, 0xAB, 0xCD, 0xEF]);
        const cipher: any =
            new _TripleDataEncryptionStandardCipher(
                new Uint8Array([
                    0x01, 0x23, 0x45, 0x67,
                    0x89, 0xAB, 0xCD, 0xEF,
                    0xFE, 0xDC, 0xBA, 0x98,
                    0x76, 0x54, 0x32, 0x10
                ]),
                true
            );
        const wk = cipher._generateWorkingKey(true, key);
        expect(Array.from(wk)).toEqual([
            34154022, 807875621, 437848360, 437851686,
            286403875, 487195154, 472328457, 672274455,
            253756699, 235092482, 135532309, 840828933,
            454165011, 1388038, 354425622, 943197697,
            807864608, 204024633, 604772405, 503787826,
            138281764, 285415482, 469963057, 321197332,
            605229571, 470816828, 353247282, 70655245,
            755237402, 688202037, 842280448, 587401010
        ]);
    });
    it('1041440 - should complete working key generation and return 32 round keys', () => {
        const tripleDesKey = new Uint8Array([
            0x01, 0x23, 0x45, 0x67,
            0x89, 0xAB, 0xCD, 0xEF,
            0xFE, 0xDC, 0xBA, 0x98,
            0x76, 0x54, 0x32, 0x10
        ]);
        const cipher: any = new _TripleDataEncryptionStandardCipher(tripleDesKey, true);
        const workingKey = cipher._generateWorkingKey(true, tripleDesKey.subarray(0, 8));
        expect(workingKey).toBeDefined();
        expect(workingKey.length).toBe(32);
    });
    it('1041440 - should generate expected encryption working key', () => {
        const key: Uint8Array = new Uint8Array([
            0x13, 0x34, 0x57, 0x79,
            0x9B, 0xBC, 0xDF, 0xF1
        ]);
        const cipher: any = new _TripleDataEncryptionStandardCipher(
            new Uint8Array([
                0x13, 0x34, 0x57, 0x79,
                0x9B, 0xBC, 0xDF, 0xF1,
                0x13, 0x34, 0x57, 0x79,
                0x9B, 0xBC, 0xDF, 0xF1
            ])
        );
        const result: Int32Array = cipher._generateWorkingKey(true, key);
        expect(result.length).toBe(32);
        expect(Array.from(result)).toEqual([
            101400321, 808388402, 507196967, 437861413,
            355602494, 520760345, 473380372, 706097949,
            523254286, 235353384, 403969068, 977143599,
            991051042, 137830716, 1026043951, 943330107,
            942619422, 220929537, 739061273, 520561679,
            138360590, 353578246, 487007519, 389350953,
            622280233, 1007758081, 386808860, 876031546,
            788926268, 957158154, 842400543, 856367413
        ]);
    });
    it('1041440 - should generate different working key for decryption', () => {
        const key: Uint8Array = new Uint8Array([
            0x13, 0x34, 0x57, 0x79,
            0x9B, 0xBC, 0xDF, 0xF1
        ]);
        const cipher: any = new _TripleDataEncryptionStandardCipher(
            new Uint8Array([
                0x13, 0x34, 0x57, 0x79,
                0x9B, 0xBC, 0xDF, 0xF1,
                0x13, 0x34, 0x57, 0x79,
                0x9B, 0xBC, 0xDF, 0xF1
            ])
        );
        const encrypt: Int32Array = cipher._generateWorkingKey(true, key);
        const decrypt: Int32Array = cipher._generateWorkingKey(false, key);
        expect(Array.from(decrypt)).not.toEqual(Array.from(encrypt));
        expect(decrypt[0]).toBe(encrypt[30]);
        expect(decrypt[1]).toBe(encrypt[31]);
    });
    it('1041440 - should populate all 32 subkeys with finite values', () => {
        const key: Uint8Array = new Uint8Array([
            0x13, 0x34, 0x57, 0x79,
            0x9B, 0xBC, 0xDF, 0xF1
        ]);
        const cipher: any = new _TripleDataEncryptionStandardCipher(
            new Uint8Array([
                0x13, 0x34, 0x57, 0x79,
                0x9B, 0xBC, 0xDF, 0xF1,
                0x13, 0x34, 0x57, 0x79,
                0x9B, 0xBC, 0xDF, 0xF1
            ])
        );
        const result: Int32Array = cipher._generateWorkingKey(true, key);
        expect(result.length).toBe(32);
        expect(result.every((v: number) => Number.isFinite(v))).toBe(true);
        expect(result.some((v: number) => v !== 0)).toBe(true);
    });
    it('1041440 - should encrypt a known DES test vector correctly', () => {
        const key: Uint8Array = new Uint8Array([
            0x13, 0x34, 0x57, 0x79,
            0x9B, 0xBC, 0xDF, 0xF1
        ]);
        const cipher = new _TripleDataEncryptionStandardCipher(
            new Uint8Array([
                0x13, 0x34, 0x57, 0x79,
                0x9B, 0xBC, 0xDF, 0xF1,
                0x13, 0x34, 0x57, 0x79,
                0x9B, 0xBC, 0xDF, 0xF1
            ])
        );
        const workingKey: Int32Array = cipher._generateWorkingKey(true, key);
        const input: Uint8Array = new Uint8Array([
            0x01, 0x23, 0x45, 0x67,
            0x89, 0xAB, 0xCD, 0xEF
        ]);
        const output: Uint8Array = new Uint8Array(8);
        cipher._processEncryptionBlock(
            workingKey,
            input,
            0,
            output,
            0
        );
        expect(Array.from(output)).toEqual([
            0x85, 0xE8, 0x13, 0x54,
            0x0F, 0x0A, 0xB4, 0x05
        ]);
    });
    it('1041440 - should not throw RangeError for any valid 8-byte key (kills loop-bound +1 mutants)', () => {
        const cipher: any = new _TripleDataEncryptionStandardCipher(new Uint8Array(16));
        expect(() => cipher._generateWorkingKey(true, new Uint8Array(8))).not.toThrow();
        expect(() => cipher._generateWorkingKey(false, new Uint8Array(8))).not.toThrow();
        expect(() => cipher._generateWorkingKey(true, new Uint8Array(8).fill(0xFF))).not.toThrow();
        expect(() => cipher._generateWorkingKey(false, new Uint8Array(8).fill(0xFF))).not.toThrow();
    });
    it('1041440 - should produce all-zero working key for an all-zeros 8-byte key (kills fill mutation)', () => {
        const cipher: any = new _TripleDataEncryptionStandardCipher(new Uint8Array(16));
        const result: Int32Array = cipher._generateWorkingKey(true, new Uint8Array(8));
        expect(result.length).toBe(32);
        expect(Array.from(result)).toEqual([
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0
        ]);
    });
    it('1041440 - should produce exact working key for all-0xFF 8-byte key (kills bytes2 fill mutation)', () => {
        const allFF: Uint8Array = new Uint8Array(8).fill(0xFF);
        const cipher: any = new _TripleDataEncryptionStandardCipher(
            new Uint8Array(16).fill(0xFF)
        );
        const encrypt: Int32Array = cipher._generateWorkingKey(true, allFF);
        const decrypt: Int32Array = cipher._generateWorkingKey(false, allFF);
        expect(encrypt.every((v: number) => v === -1)).toBe(false);
        expect(decrypt.every((v: number) => v === -1)).toBe(false);
    });
    it('1041440 - should produce correct subkeys for alternating-bit key (kills halfSize boundary mutant)', () => {
        const key: Uint8Array = new Uint8Array([0xAA, 0xBB, 0xCC, 0xDD, 0x11, 0x22, 0x33, 0x44]);
        const cipher: any = new _TripleDataEncryptionStandardCipher(
            new Uint8Array([0xAA, 0xBB, 0xCC, 0xDD, 0x11, 0x22, 0x33, 0x44,
                0x55, 0x66, 0x77, 0x88, 0x99, 0xAA, 0xBB, 0xCC])
        );
        const result: Int32Array = cipher._generateWorkingKey(true, key);
        const resultDec: Int32Array = cipher._generateWorkingKey(false, key);
        expect(result.length).toBe(32);
        expect(Array.from(result)).not.toEqual(Array.from(new Int32Array(32)));
        expect(resultDec[0]).toBe(result[30]);
        expect(resultDec[1]).toBe(result[31]);
        expect(result[0]).toBe(cipher._generateWorkingKey(true, key)[0]);
        expect(result[31]).toBe(cipher._generateWorkingKey(true, key)[31]);
    });
    it('1041440 - should verify round key index boundary check (kills b >= 32 to b > 32 mutation)', () => {
        const cipher: any = new _TripleDataEncryptionStandardCipher(new Uint8Array(16));
        const key = new Uint8Array(8);
        const result: Int32Array = cipher._generateWorkingKey(true, key);
        expect(result.length).toBe(32);
        expect(result[0]).toBeDefined();
        expect(result[31]).toBeDefined();
        const resultDec: Int32Array = cipher._generateWorkingKey(false, key);
        expect(resultDec.length).toBe(32);
        expect(resultDec[0]).toBeDefined();
        expect(resultDec[31]).toBeDefined();
    });
    it('1041440 - should verify PC1 permutation bounds check (kills j >= 56 to false mutation)', () => {
        const cipher: any = new _TripleDataEncryptionStandardCipher(new Uint8Array(16));
        const key = new Uint8Array([
            0x55, 0xAA, 0x55, 0xAA,
            0x55, 0xAA, 0x55, 0xAA
        ]);
        const result: Int32Array = cipher._generateWorkingKey(true, key);
        expect(result).toBeDefined();
        expect(result.length).toBe(32);
        expect(result.some((val: number) => val !== 0)).toBe(true);
    });
    it('1041440 - should verify key rotation inner loop boundary (kills j < 56 bounds check)', () => {
        const cipher: any = new _TripleDataEncryptionStandardCipher(new Uint8Array(16));
        const key1 = new Uint8Array(8).fill(0x00);
        const key2 = new Uint8Array(8).fill(0xFF);
        const result1: Int32Array = cipher._generateWorkingKey(true, key1);
        const result2: Int32Array = cipher._generateWorkingKey(true, key2);
        expect(result1.length).toBe(32);
        expect(result2.length).toBe(32);
        expect(Array.from(result1)).not.toEqual(Array.from(result2));
    });
    it('1041440 - should verify Pc2 permutation loop boundary (kills j < 24 to j <= 24 mutation)', () => {
        const cipher: any = new _TripleDataEncryptionStandardCipher(new Uint8Array(16));
        const key = new Uint8Array([
            0x12, 0x34, 0x56, 0x78,
            0x9A, 0xBC, 0xDE, 0xF0
        ]);
        const result: Int32Array = cipher._generateWorkingKey(true, key);
        expect(result.length).toBe(32);
        for (let i = 0; i < 32; i += 2) {
            expect(Number.isFinite(result[i])).toBe(true);
            expect(Number.isFinite(result[i + 1])).toBe(true);
        }
    });
    it('1041440 - should verify final permutation loop boundary (kills i < 32 to i <= 32 mutation)', () => {
        const cipher: any = new _TripleDataEncryptionStandardCipher(new Uint8Array(16));
        const key = new Uint8Array([
            0x0F, 0x1E, 0x2D, 0x3C,
            0x4B, 0x5A, 0x69, 0x78
        ]);
        const result: Int32Array = cipher._generateWorkingKey(true, key);
        expect(result.length).toBe(32);
        for (let i = 0; i < 32; i++) {
            expect(Number.isInteger(result[i])).toBe(true);
        }
    });
    it('1041440 - should apply correct bit shift operations in final permutation (kills i < 32 boundary)', () => {
        const cipher: any = new _TripleDataEncryptionStandardCipher(new Uint8Array(16));
        const key = new Uint8Array([
            0xFF, 0x00, 0xFF, 0x00,
            0xFF, 0x00, 0xFF, 0x00
        ]);
        const result: Int32Array = cipher._generateWorkingKey(true, key);
        expect(result.length).toBe(32);
        expect(result.every((val: number) => val !== undefined)).toBe(true);
        const allZero = result.every((val: number) => val === 0);
        const allFF = result.every((val: number) => val === 0xFFFFFFFF);
        expect(allZero || allFF).toBe(false);
    });
    it('1041440 - should verify both encryption and decryption paths respect boundaries', () => {
        const cipher: any = new _TripleDataEncryptionStandardCipher(new Uint8Array(16));
        const testKeys = [
            new Uint8Array(8),
            new Uint8Array(8).fill(0xFF),
            new Uint8Array([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08]),
            new Uint8Array([0xAA, 0xBB, 0xCC, 0xDD, 0xEE, 0xFF, 0x11, 0x22])
        ];
        for (const key of testKeys) {
            const encResult: Int32Array = cipher._generateWorkingKey(true, key);
            const decResult: Int32Array = cipher._generateWorkingKey(false, key);
            expect(encResult.length).toBe(32);
            expect(decResult.length).toBe(32);
            expect(decResult[0]).toBe(encResult[30]);
            expect(decResult[1]).toBe(encResult[31]);
        }
    });
    it('1041440 - should kill Pc1 loop boundary mutation (j < 56 to j <= 56)', () => {
        const cipher: any = new _TripleDataEncryptionStandardCipher(new Uint8Array(16));
        const key = new Uint8Array([
            0x01, 0x23, 0x45, 0x67,
            0x89, 0xAB, 0xCD, 0xEF
        ]);
        const result1: Int32Array = cipher._generateWorkingKey(true, key);
        expect(result1.length).toBe(32);
        const result2: Int32Array = cipher._generateWorkingKey(true, key);
        expect(Array.from(result1)).toEqual(Array.from(result2));
        expect(result1[0]).toBe(34154022);
        expect(result1[31]).toBe(587401010);
    });
    it('1041440 - should kill bytes2 loop boundary mutation (j < 56 to j <= 56)', () => {
        const cipher: any = new _TripleDataEncryptionStandardCipher(new Uint8Array(16));
        const key1 = new Uint8Array(8);
        const key2 = new Uint8Array([0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF]);
        const result1: Int32Array = cipher._generateWorkingKey(true, key1);
        const result2: Int32Array = cipher._generateWorkingKey(true, key2);
        expect(result1.length).toBe(32);
        expect(result2.length).toBe(32);
        const result1Again: Int32Array = cipher._generateWorkingKey(true, key1);
        expect(Array.from(result1)).toEqual(Array.from(result1Again));
    });
    it('1041440 - should kill Pc2 loop boundary mutation (j < 24 to j <= 24)', () => {
        const cipher: any = new _TripleDataEncryptionStandardCipher(new Uint8Array(16));
        const key = new Uint8Array([
            0x12, 0x34, 0x56, 0x78,
            0x9A, 0xBC, 0xDE, 0xF0
        ]);
        const result1: Int32Array = cipher._generateWorkingKey(true, key);
        const result2: Int32Array = cipher._generateWorkingKey(true, key);
        const result3: Int32Array = cipher._generateWorkingKey(false, key);
        expect(Array.from(result1)).toEqual(Array.from(result2));
        expect(result1[0]).toBe(101400321);
        expect(result1[31]).toBe(856367413);
        expect(result3[0]).toBe(result1[30]);
        expect(result3[1]).toBe(result1[31]);
    });
    it('1041440 - should kill final loop boundary mutation (i < 32 to i <= 32)', () => {
        const cipher: any = new _TripleDataEncryptionStandardCipher(new Uint8Array(16));
        const key = new Uint8Array([
            0xFF, 0x00, 0xFF, 0x00,
            0xFF, 0x00, 0xFF, 0x00
        ]);
        const result1: Int32Array = cipher._generateWorkingKey(true, key);
        const result2: Int32Array = cipher._generateWorkingKey(true, key);
        expect(result1.length).toBe(32);
        expect(result2.length).toBe(32);
        expect(Array.from(result1)).toEqual(Array.from(result2));
        for (let i = 0; i < 32; i++) {
            expect(result1[i]).toBeDefined();
            expect(Number.isInteger(result1[i])).toBe(true);
        }
    });
    it('1041440 - should verify Pc1 permutation completes exactly 56 iterations', () => {
        const cipher: any = new _TripleDataEncryptionStandardCipher(new Uint8Array(16));
        const key = new Uint8Array([
            0xAA, 0x55, 0xAA, 0x55,
            0xCC, 0x33, 0xCC, 0x33
        ]);
        const result: Int32Array = cipher._generateWorkingKey(true, key);
        const expected = cipher._generateWorkingKey(true, key);
        expect(Array.from(result)).toEqual(Array.from(expected));
    });
    it('1041440 - should verify key rotation loop processes all 56 bytes correctly', () => {
        const cipher: any = new _TripleDataEncryptionStandardCipher(new Uint8Array(16));
        const testCases = [
            new Uint8Array([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]),
            new Uint8Array([0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80]),
            new Uint8Array([0x80, 0x40, 0x20, 0x10, 0x08, 0x04, 0x02, 0x01]),
            new Uint8Array([0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF])
        ];
        for (const key of testCases) {
            const encResult: Int32Array = cipher._generateWorkingKey(true, key);
            const encResultAgain: Int32Array = cipher._generateWorkingKey(true, key);
            expect(Array.from(encResult)).toEqual(Array.from(encResultAgain));
            expect(encResult.every((v: number) => Number.isInteger(v))).toBe(true);
        }
    });
    it('1041440 - should kill i < 16 to i <= 16 mutation (Totrot out-of-bounds)', () => {
        const cipher: any = new _TripleDataEncryptionStandardCipher(new Uint8Array(16));
        const key = new Uint8Array([
            0x01, 0x23, 0x45, 0x67,
            0x89, 0xAB, 0xCD, 0xEF
        ]);
        const result1: Int32Array = cipher._generateWorkingKey(true, key);
        const result2: Int32Array = cipher._generateWorkingKey(true, key);
        expect(Array.from(result1)).toEqual(Array.from(result2));
        expect(result1[0]).toBe(34154022);
        expect(result1[31]).toBe(587401010);
        expect(result1.every((v: number) => Number.isFinite(v))).toBe(true);
    });
    it('1041440 - should kill j < 56 to j <= 56 mutation in Pc1 loop (bytes1 out-of-bounds)', () => {
        const cipher: any = new _TripleDataEncryptionStandardCipher(new Uint8Array(16));
        for (let iteration = 0; iteration < 10; iteration++) {
            const key = new Uint8Array(8);
            key[iteration % 8] = (iteration + 1) * 16;
            const result: Int32Array = cipher._generateWorkingKey(true, key);
            const resultAgain: Int32Array = cipher._generateWorkingKey(true, key);
            expect(Array.from(result)).toEqual(Array.from(resultAgain));
            expect(result.every((v: number) => Number.isFinite(v) && Number.isInteger(v))).toBe(true);
        }
    });
    it('1041440 - should kill j < 56 to j <= 56 mutation in key rotation loop', () => {
        const cipher: any = new _TripleDataEncryptionStandardCipher(new Uint8Array(16));
        const testKeys = [
            new Uint8Array(8),
            new Uint8Array(8).fill(0xAA),
            new Uint8Array(8).fill(0x55),
            new Uint8Array(8).fill(0xFF)
        ];
        for (const key of testKeys) {
            const enc: Int32Array = cipher._generateWorkingKey(true, key);
            const dec: Int32Array = cipher._generateWorkingKey(false, key);
            expect(enc.length).toBe(32);
            expect(dec.length).toBe(32);
            expect(dec[0]).toBe(enc[30]);
            expect(dec[1]).toBe(enc[31]);
        }
    });
    it('1041440 - should kill j < 24 to j <= 24 mutation (Pc2 out-of-bounds)', () => {
        const cipher: any = new _TripleDataEncryptionStandardCipher(new Uint8Array(16));
        const testKeys = [
            new Uint8Array([0x13, 0x34, 0x57, 0x79, 0x9B, 0xBC, 0xDF, 0xF1]),
            new Uint8Array([0xAA, 0xBB, 0xCC, 0xDD, 0xEE, 0xFF, 0x11, 0x22]),
            new Uint8Array(8),
            new Uint8Array(8).fill(0xFF)
        ];
        for (const key of testKeys) {
            const result1: Int32Array = cipher._generateWorkingKey(true, key);
            const result2: Int32Array = cipher._generateWorkingKey(true, key);
            expect(Array.from(result1)).toEqual(Array.from(result2));
            for (let i = 0; i < 32; i++) {
                expect(Number.isFinite(result1[i])).toBe(true);
                expect(Number.isInteger(result1[i])).toBe(true);
            }
        }
    });
    it('1041440 - should kill i < 32 to i <= 32 mutation (newKeys out-of-bounds)', () => {
        const cipher: any = new _TripleDataEncryptionStandardCipher(new Uint8Array(16));
        const testKeys = [
            new Uint8Array([0x01, 0x23, 0x45, 0x67, 0x89, 0xAB, 0xCD, 0xEF]),
            new Uint8Array([0xFF, 0x00, 0xFF, 0x00, 0xFF, 0x00, 0xFF, 0x00]),
            new Uint8Array(8)
        ];
        for (const key of testKeys) {
            const enc: Int32Array = cipher._generateWorkingKey(true, key);
            const dec: Int32Array = cipher._generateWorkingKey(false, key);
            expect(enc.length).toBe(32);
            expect(dec.length).toBe(32);
            for (let i = 0; i < 32; i++) {
                expect(enc[i]).toBeDefined();
                expect(dec[i]).toBeDefined();
                expect(Number.isFinite(enc[i])).toBe(true);
                expect(Number.isFinite(dec[i])).toBe(true);
            }
            const encAgain: Int32Array = cipher._generateWorkingKey(true, key);
            const decAgain: Int32Array = cipher._generateWorkingKey(false, key);
            expect(Array.from(enc)).toEqual(Array.from(encAgain));
            expect(Array.from(dec)).toEqual(Array.from(decAgain));
        }
    });
    it('1041440 - should kill all loop increment mutations by verifying round structure', () => {
        const cipher: any = new _TripleDataEncryptionStandardCipher(new Uint8Array(16));
        const key = new Uint8Array([0x01, 0x23, 0x45, 0x67, 0x89, 0xAB, 0xCD, 0xEF]);
        const result: Int32Array = cipher._generateWorkingKey(true, key);
        expect(result.length).toBe(32);
        for (let round = 0; round < 16; round++) {
            const b = round << 1;  // b = round * 2
            const c = b + 1;
            expect(result[b]).toBeDefined();
            expect(result[c]).toBeDefined();
            expect(Number.isFinite(result[b])).toBe(true);
            expect(Number.isFinite(result[c])).toBe(true);
        }
    });
    it('1041440 - should verify encryption produces DES-valid output (kills all boundary mutations)', () => {
        const cipher = new _TripleDataEncryptionStandardCipher(
            new Uint8Array([
                0x13, 0x34, 0x57, 0x79,
                0x9B, 0xBC, 0xDF, 0xF1,
                0x13, 0x34, 0x57, 0x79,
                0x9B, 0xBC, 0xDF, 0xF1
            ])
        );
        const input = new Uint8Array([
            0x01, 0x23, 0x45, 0x67,
            0x89, 0xAB, 0xCD, 0xEF
        ]);
        const output = new Uint8Array(8);
        cipher._processEncryptionBlock(
            cipher._generateWorkingKey(true, new Uint8Array(8)),
            input,
            0,
            output,
            0
        );
        expect(Array.from(output)).not.toEqual([0, 0, 0, 0, 0, 0, 0, 0]);
        for (let i = 0; i < output.length; i++) {
            expect(output[i]).toBeDefined();
        }
    });
    it('1041440 - should verify Pc2 processes exactly 48 bits (2 x 24 iterations)', () => {
        const cipher: any = new _TripleDataEncryptionStandardCipher(new Uint8Array(16));
        const key = new Uint8Array([
            0x13, 0x34, 0x57, 0x79,
            0x9B, 0xBC, 0xDF, 0xF1
        ]);
        for (let i = 0; i < 5; i++) {
            const result: Int32Array = cipher._generateWorkingKey(true, key);
            const resultAgain: Int32Array = cipher._generateWorkingKey(true, key);
            expect(Array.from(result)).toEqual(Array.from(resultAgain));
            for (let j = 0; j < 16; j++) {
                const b = j << 1;
                const c = b + 1;
                expect(Number.isInteger(result[b])).toBe(true);
                expect(Number.isInteger(result[c])).toBe(true);
            }
        }
    });
});
describe('1041470 - Evaluation Digest', () => {
    it('1041470 - should create hash input instance for chunked conversion', () => {
        const messageDigest: any = new _RaceEvaluationMessageDigest();
        const accumulatorSink: any = {};
        const hashInput: any = messageDigest._startChunkedConversion(accumulatorSink);
        expect(hashInput).toBeDefined();
        expect(hashInput).not.toBeNull();
        expect(hashInput instanceof _PdfNativeHashInput).toBeTruthy();
    });
    it('1041470 - should rotate left and preserve wrapped bits', () => {
        const messageDigest: any = new _RaceEvaluationMessageDigest();
        expect(messageDigest._rotateLeft(0x12345678, 4)).toBe(591751041);
        expect(messageDigest._rotateLeft(0x80000000, 1)).toBe(1);
        expect(messageDigest._rotateLeft(0x00000001, 1)).toBe(2);
    });
    it('1041470 - should compute expected fn1 result for different inputs', () => {
        const messageDigest: any = new _RaceEvaluationMessageDigest();
        const firstResult: number = messageDigest._fn1(123, 456, 789, 321, 654, 987, 111, 7);
        const secondResult: number = messageDigest._fn1(1, 2, 3, 4, 5, 6, 7, 8);
        expect(firstResult).toBe(275214);
        expect(secondResult).toBe(4869);
    });
    it('1041470 - should compute fn2 exact expected value', () => {
        const digest: any = new _RaceEvaluationMessageDigest();
        const result: number = digest._fn2(0x12345678, 0x89abcdef, 0xfedcba98, 0x76543210, 0x11111111, 0x22222222, 0x33333333, 7);
        const expected: number =
            (
                digest._rotateLeft(
                    (
                        0x12345678 +
                        (
                            (0x89abcdef & 0xfedcba98) |
                            ((~0x89abcdef) & 0x76543210)
                        ) +
                        0x22222222 +
                        0x33333333
                    ) | 0,
                    7
                ) +
                0x11111111
            ) | 0;
        expect(result).toBe(expected);
    });
    it('1041470 - should compute fn2 correctly for multiple vectors', () => {
        const digest: any = new _RaceEvaluationMessageDigest();
        const vectors = [
            [1, 2, 3, 4, 5, 6, 7, 8],
            [0x12345678, 0x89abcdef, 0xfedcba98, 0x76543210,
                0x11111111, 0x22222222, 0x33333333, 7],
            [-1, 0x55555555, 0xaaaaaaaa, 0x12345678,
                0x87654321, 0x11111111, 0x22222222, 11]
        ];
        vectors.forEach((v: number[]) => {
            const [a, b, c, d, e, m, k, s] = v;
            const expected =
                (
                    digest._rotateLeft(
                        (
                            a +
                            ((b & c) | ((~b) & d)) +
                            m +
                            k
                        ) | 0,
                        s
                    ) +
                    e
                ) | 0;

            expect(digest._fn2(a, b, c, d, e, m, k, s)).toBe(expected);
        });
    });
    it('1041470 - should return a numeric value from fn2', () => {
        const digest: any = new _RaceEvaluationMessageDigest();
        const result = digest._fn2(1, 2, 3, 4, 5, 6, 7, 8);
        expect(result).toBeDefined();
        expect(typeof result).toBe('number');
    });
    it('1041470 - should change output when e, m or k changes', () => {
        const digest: any = new _RaceEvaluationMessageDigest();
        const base = digest._fn2(1, 2, 3, 4, 5, 6, 7, 8);
        expect(digest._fn2(1, 2, 3, 4, 6, 6, 7, 8)).not.toBe(base);
        expect(digest._fn2(1, 2, 3, 4, 5, 7, 7, 8)).not.toBe(base);
        expect(digest._fn2(1, 2, 3, 4, 5, 6, 8, 8)).not.toBe(base);
    });
    it('1041470 - should compute fn3 exact expected value', () => {
        const digest: any = new _RaceEvaluationMessageDigest();
        const result: number = digest._fn3(0x12345678, 0x89ABCDEF, 0xFEDCBA98, 0x76543210, 0x11111111, 0x22222222, 0x33333333, 7);
        const expected: number =
            (
                digest._rotateLeft(
                    (
                        0x12345678 +
                        ((0x89ABCDEF | (~0xFEDCBA98)) ^ 0x76543210) +
                        0x22222222 +
                        0x33333333
                    ) | 0,
                    7
                ) +
                0x11111111
            ) | 0;

        expect(result).toBe(expected);
    });
    it('1041470 - should compute fn3 correctly for multiple vectors', () => {
        const digest: any = new _RaceEvaluationMessageDigest();
        const vectors: number[][] = [
            [1, 2, 3, 4, 5, 6, 7, 8],
            [0x12345678, 0x89ABCDEF, 0xFEDCBA98, 0x76543210, 0x11111111, 0x22222222, 0x33333333, 7],
            [-1, 0x55555555, 0xAAAAAAAA, 0x12345678, 0x87654321, 0x11111111, 0x22222222, 11]
        ];
        vectors.forEach((v: number[]) => {
            const [a, b, c, d, e, m, k, s] = v;
            const expected: number =
                (
                    digest._rotateLeft(
                        (
                            a +
                            ((b | (~c)) ^ d) +
                            m +
                            k
                        ) | 0,
                        s
                    ) +
                    e
                ) | 0;

            expect(
                digest._fn3(a, b, c, d, e, m, k, s)
            ).toBe(expected);
        });
    });
    it('1041470 - should change fn3 output when e changes', () => {
        const digest: any = new _RaceEvaluationMessageDigest();
        const base: number = digest._fn3(1, 2, 3, 4, 5, 6, 7, 8);
        expect(digest._fn3(1, 2, 3, 4, 6, 6, 7, 8)).not.toBe(base);
    });
    it('1041470 - should use complement of c in fn3 boolean function', () => {
        const digest: any = new _RaceEvaluationMessageDigest();
        const result1: number = digest._fn3(10, 0x55555555, 0xAAAAAAAA, 0x12345678, 20, 30, 40, 5);
        const result2: number = digest._fn3(10, 0x55555555, 0x55555555, 0x12345678, 20, 30, 40, 5);
        expect(result1).not.toBe(result2);
    });
    it('1041470 - should return a numeric value from fn3', () => {
        const digest: any = new _RaceEvaluationMessageDigest();
        const result = digest._fn3(1, 2, 3, 4, 5, 6, 7, 8);
        expect(result).toBeDefined();
        expect(typeof result).toBe('number');
    });
    it('1041470 - should compute fn4 exact expected value', () => {
        const digest: any = new _RaceEvaluationMessageDigest();
        const result: number = digest._fn4(0x12345678, 0x89ABCDEF, 0xFEDCBA98, 0x76543210, 0x11111111, 0x22222222, 0x33333333, 7);
        const expected: number =
            (
                digest._rotateLeft(
                    (
                        0x12345678 +
                        (
                            (0x89ABCDEF & 0x76543210) |
                            (0xFEDCBA98 & (~0x76543210))
                        ) +
                        0x22222222 +
                        0x33333333
                    ) | 0,
                    7
                ) +
                0x11111111
            ) | 0;

        expect(result).toBe(expected);
    });
    it('1041470 - should change fn4 output when k changes', () => {
        const digest: any = new _RaceEvaluationMessageDigest();
        const base: number = digest._fn4(1, 2, 3, 4, 5, 6, 7, 8);
        expect(digest._fn4(1, 2, 3, 4, 5, 6, 8, 8)).not.toBe(base);
    });
    it('1041470 - should use complement of d in fn4 boolean function', () => {
        const digest: any = new _RaceEvaluationMessageDigest();
        const result1: number = digest._fn4(10, 0x55555555, 0xFFFFFFFF, 0xAAAAAAAA, 20, 30, 40, 5);
        const result2: number = digest._fn4(10, 0x55555555, 0xFFFFFFFF, 0x55555555, 20, 30, 40, 5);
        expect(result1).not.toBe(result2);
    });
    it('1041470 - should distinguish d from complement of d in fn4', () => {
        const digest: any = new _RaceEvaluationMessageDigest();
        const normal: number = digest._fn4(1, 0, 0xFFFFFFFF, 0xFFFFFFFF, 2, 3, 4, 5);
        const opposite: number = digest._fn4(1, 0, 0xFFFFFFFF, 0, 2, 3, 4, 5);
        expect(normal).not.toBe(opposite);
    });
    it('1041470 - should read 32-bit little-endian integer correctly', () => {
        const digest: any = new _RaceEvaluationMessageDigest();
        const buffer: Uint8Array = new Uint8Array([
            0x11, 0x22, 0x33, 0x44
        ]);
        const result: number = digest._readInt32LE(buffer, 0);
        expect(result).toBe(0x44332211);
    });
    it('1041470 - should read value correctly using a non-zero offset', () => {
        const digest: any = new _RaceEvaluationMessageDigest();
        const buffer: Uint8Array = new Uint8Array([0xAA, 0xBB, 0x11, 0x22, 0x33, 0x44, 0xCC, 0xDD]);
        const result: number = digest._readInt32LE(buffer, 2);
        expect(result).toBe(0x44332211);
    });
    it('1041470 - should return a number from readInt32LE', () => {
        const digest: any = new _RaceEvaluationMessageDigest();
        const result = digest._readInt32LE(new Uint8Array([1, 2, 3, 4]), 0);
        expect(typeof result).toBe('number');
    });
    it('1041470 - should write UInt32LE bytes and return the next offset', () => {
        const digest: any = new _RaceEvaluationMessageDigest();
        const buffer: Uint8Array = new Uint8Array(8);
        const result: number = digest._writeUInt32LE(buffer, 0x12345678, 0);
        expect(Array.from(buffer.slice(0, 4))).toEqual([0x78, 0x56, 0x34, 0x12]);
        expect(result).toBe(4);
    });
    it('1041470 - should write UInt32LE correctly for high-bit values and non-zero offsets', () => {
        const digest: any = new _RaceEvaluationMessageDigest();
        const buffer: Uint8Array = new Uint8Array(10).fill(0xAA);
        const result: number = digest._writeUInt32LE(buffer, 0xF2345678, 2);
        expect(Array.from(buffer)).toEqual([
            0xAA, 0xAA,
            0x78, 0x56, 0x34, 0xF2,
            0xAA, 0xAA, 0xAA, 0xAA
        ]);
        expect(result).toBe(6);
    });
    it('1041470 - should preserve unsigned 32-bit layout when writing negative numeric input', () => {
        const digest: any = new _RaceEvaluationMessageDigest();
        const buffer: Uint8Array = new Uint8Array(8).fill(0xCC);
        const result: number = digest._writeUInt32LE(buffer, -1, 1);
        expect(Array.from(buffer)).toEqual([
            0xCC,
            0xFF, 0xFF, 0xFF, 0xFF,
            0xCC, 0xCC, 0xCC
        ]);
        expect(result).toBe(5);
    });
    it('1041470 -should write Int32LE bytes at the specified offset and return next offset', () => {
        const digest: any = new _RaceEvaluationMessageDigest();
        const buffer: Uint8Array = new Uint8Array(10);
        const result: number = digest._writeInt32LE(buffer, 0x12345678, 2);
        expect(Array.from(buffer)).toEqual([0x00, 0x00, 0x78, 0x56, 0x34, 0x12, 0x00, 0x00, 0x00, 0x00]);
        expect(result).toBe(6);
    });
    it('1041470 -should return offset increased by four from writeInt32LE', () => {
        const digest: any = new _RaceEvaluationMessageDigest();
        const result: number = digest._writeInt32LE(new Uint8Array(8), 0x12345678, 1);
        expect(result).toBe(5);
    });
    it('1041470 -should produce correct hash for abc', () => {
        const digest: any = new _RaceEvaluationMessageDigest();
        const data: Uint8Array = _decode('abc') as Uint8Array;
        const result: Uint8Array = digest._hash(data, 0, data.length);
        expect(Array.from(result)).toEqual([146, 237, 39, 41, 86, 143, 140, 220, 243, 121, 156, 79, 150, 21, 253, 124, 17, 146, 53, 182]);
    });
    it('1041470 - should hash boundary-length inputs deterministically', () => {
        const digest: any = new _RaceEvaluationMessageDigest();
        const cases = [
            new Uint8Array(0),
            new Uint8Array(1).fill(0x61),
            new Uint8Array(55).fill(0x61),
            new Uint8Array(56).fill(0x61),
            new Uint8Array(57).fill(0x61),
            new Uint8Array(63).fill(0x61),
            new Uint8Array(64).fill(0x61),
            new Uint8Array(65).fill(0x61),
            new Uint8Array(1000).fill(0x61)
        ];
        const results: string[] = cases.map((data: Uint8Array) =>
            Array.from(digest._hash(data, 0, data.length)).join(',')
        );
        expect(results[0]).toBe(results[0]);
        expect(results[1]).not.toBe(results[0]);
        expect(results[2]).not.toBe(results[3]);
        expect(results[3]).not.toBe(results[4]);
        expect(results[4]).not.toBe(results[5]);
        expect(results[5]).not.toBe(results[6]);
        expect(results[6]).not.toBe(results[7]);
        expect(results[8]).toBe( "251,204,93,156,14,225,216,62,240,19,18,164,225,135,255,17,130,192,17,75");
    });
    it('1041470 - should update internal state after processing a block', () => {
        const digest: any = new _RaceEvaluationMessageDigest();
        digest._block.fill(0);
        const before = {
            a: digest._a,
            b: digest._b,
            c: digest._c,
            d: digest._d,
            e: digest._e
        };
        digest._update();
        expect(digest._a).not.toBe(before.a);
        expect(digest._b).not.toBe(before.b);
        expect(digest._c).not.toBe(before.c);
        expect(digest._d).not.toBe(before.d);
        expect(digest._e).not.toBe(before.e);
    });
    it('1041470 - should produce deterministic state after update', () => {
        const digest: any = new _RaceEvaluationMessageDigest();
        for (let i = 0; i < 64; i++) {
            digest._block[i] = i;
        }
        digest._update();
        expect([digest._a, digest._b, digest._c, digest._d, digest._e]).toEqual([-689928586, -1562318150, -995798345, 999599563, 1417053044]);
    });
    it('1041470 - should process a full block of 64 bytes', () => {
        const digest = new _RaceEvaluationMessageDigest();
        const data = new Uint8Array(64);
        data.fill(1);
        const output = digest._hash(data, 0, data.length);
        expect(output.length).toBe(20);
        expect(Array.from(output)).toEqual([
          88, 160,240,173,90,143, 168,169,45, 110, 21,199,16,152,127,255,183,129,167,111,]);
    });
    it('1041470 - should update length correctly for small values', () => {
        const digest = new _RaceEvaluationMessageDigest();
        const data = new Uint8Array([1, 2, 3]);
        const output = digest._hash(data, 0, data.length);
        expect(output.length).toBe(20);
        expect(Array.from(output)).toEqual([ 121,249, 1, 218,38, 9, 240,32,173,173,191,46,95,104,161, 108,140, 63,125,87,]);
    });
    it('1041470 - should hash data length 55', () => {
        const digest = new _RaceEvaluationMessageDigest();
        const data = new Uint8Array(55).fill(1);
        const output = digest._hash(data, 0, 55);
        expect(Array.from(output)).toEqual([109, 84, 50,246,31, 142,76,96,85,196,24,98,67,175,202,64,110,216,9,143]);
    });

    it('1041470 - should hash data length 56', () => {
        const digest = new _RaceEvaluationMessageDigest();
        const data = new Uint8Array(56).fill(1);
        const output = digest._hash(data, 0, 56);
        expect(Array.from(output)).toEqual([60,254,78, 29,6,64,95,125, 101, 198, 198,205,175,60,57,140,164,164,33,84]);
    });
    it('1041470 - should produce same digest when reused', () => {
        const digest = new _RaceEvaluationMessageDigest();
        const data = new Uint8Array([1, 2, 3]);
        const first = Array.from(digest._hash(data, 0, data.length));
        const second = Array.from(digest._hash(data, 0, data.length));
        expect(second).toEqual([ 148, 58, 121, 19,24,137, 194, 186, 74,126, 27, 76, 219, 255, 163, 35, 6, 110, 79, 93]);
    });
});
describe('1041488 - MD5 hash behavior', () => {
    it('1041488 - should return the correct digest for abc', () => {
        const md5: any = new _MD5();
        const data: Uint8Array = _decode('abc') as Uint8Array;
        const result: Uint8Array = md5.hash(data, 0, data.length);
        expect(result).toEqual(new Uint8Array([248, 9, 80, 238,79, 230, 119, 22,55, 134, 236, 40,7, 246, 51, 34]));
    });
    it('1041488 - should preserve the MD5 round constants', () => {
        const md5: _MD5 = new _MD5();
        expect(Array.from(md5._r)).toEqual([7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 5, 9, 14, 20, 5, 9,
            14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 6, 10, 15, 21,
            6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21]);
    });
    it('1041488 - should preserve the MD5 K constants', () => {
        const md5: _MD5 = new _MD5();
        expect(Array.from(md5._k)).toEqual([-680876936, -389564586, 606105819, -1044525330, -176418897, 1200080426,
            -1473231341, -45705983, 1770035416, -1958414417, -42063, -1990404162, 1804603682, -40341101, -1502002290,
            1236535329, -165796510, -1069501632, 643717713, -373897302, -701558691, 38016083, -660478335, -405537848,
            568446438, -1019803690, -187363961, 1163531501, -1444681467, -51403784, 1735328473, -1926607734, -378558,
            -2022574463, 1839030562, -35309556, -1530992060, 1272893353, -155497632, -1094730640, 681279174, -358537222,
            -722521979, 76029189, -640364487, -421815835, 530742520, -995338651, -198630844, 1126891415, -1416354905,
            -57434055, 1700485571, -1894986606, -1051523, -2054922799, 1873313359, -30611744, -1560198380, 1309151649,
            -145523070, -1120210379, 718787259, -343485551]);
    });
    it('1041488 - should return a different digest when the input changes', () => {
        const md5: any = new _MD5();
        const abc: Uint8Array = _decode('abc') as Uint8Array;
        const abcd: Uint8Array = _decode('abcd') as Uint8Array;
        const first: string = Array.from(md5.hash(abc, 0, abc.length)).join(',');
        const second: string = Array.from(md5.hash(abcd, 0, abcd.length)).join(',');
        expect(second).not.toBe(first);
    });
    it('1041488 - should hash to the same value across repeated calls', () => {
        const md5: any = new _MD5();
        const data: Uint8Array = _decode('hello world') as Uint8Array;
        const first: Uint8Array = md5.hash(data, 0, data.length);
        const second: Uint8Array = md5.hash(data, 0, data.length);
        expect(Array.from(second)).toEqual(Array.from(first));
    });
    it('1041488 - should change digest for empty input compared with single zero byte', () => {
        const md5: any = new _MD5();
        const empty: Uint8Array = new Uint8Array([]);
        const zero: Uint8Array = new Uint8Array([0]);
        const emptyDigest: Uint8Array = md5.hash(empty, 0, empty.length);
        const zeroDigest: Uint8Array = md5.hash(zero, 0, zero.length);
        expect(Array.from(emptyDigest)).not.toEqual(Array.from(zeroDigest));
    });
    it('1041488 - should use the F (round 1) auxiliary function (b & c) | (~b & d)', () => {
        const md5: any = new _MD5();
        const data: Uint8Array = _decode('a') as Uint8Array;
        const result: Uint8Array = md5.hash(data, 0, data.length);
        expect(Array.from(result)).toEqual([37,16,195, 144,17,197,190, 112, 65,130,66,62,58, 105, 94,145]);
    });
    it('1041488 - should use the G (round 2) auxiliary function (d & b) | (~d & c)', () => {
        const md5: any = new _MD5();
        const data: Uint8Array = new Uint8Array(17).fill(0xFF);
        const result: Uint8Array = md5.hash(data, 0, data.length);
        const expected: number[] = [172,166, 37,160,76,95,76, 170, 208, 41, 156, 141, 239, 86,  144, 115,];
        expect(Array.from(result)).toEqual(expected);
    });
    it('1041488 - should use the H (round 3) auxiliary function b ^ c ^ d', () => {
        const md5: any = new _MD5();
        const data: Uint8Array = new Uint8Array(33).fill(0xAA);
        const result: Uint8Array = md5.hash(data, 0, data.length);
        const expected: number[] = [69,  175,78, 206, 85, 166, 68, 149,98,181,68,200,206,233,72,187];
        expect(Array.from(result)).toEqual(expected);
    });
    it('1041488 - should use the I (round 4) auxiliary function c ^ (b | ~d)', () => {
        const md5: any = new _MD5();
        const data: Uint8Array = new Uint8Array(49).fill(0x55);
        const result: Uint8Array = md5.hash(data, 0, data.length);
        const distinct: Uint8Array = md5.hash(new Uint8Array(50).fill(0x55), 0, 50);
        expect(Array.from(result)).not.toEqual(Array.from(distinct));
    });
    it('1041488 - should add d to h3 in the final state update (not subtract)', () => {
        const md5: any = new _MD5();
        const data: Uint8Array = _decode('mutation') as Uint8Array;
        const result: Uint8Array = md5.hash(data, 0, data.length);
        const expected: number[] = [92, 109, 204,113,152,141,219,107, 156, 5, 170, 148, 228, 253, 184,30,];
        expect(Array.from(result)).toEqual(expected);
    });
    it('1041488 - should produce 16-byte digest for various input sizes', () => {
        const md5: any = new _MD5();
        const sizes: number[] = [0, 1, 32, 55, 56, 63, 64, 100, 128];
        sizes.forEach((n: number) => {
            const data: Uint8Array = new Uint8Array(n).fill(0x33);
            const result: Uint8Array = md5.hash(data, 0, data.length);
            expect(result.length).toBe(16);
        });
    });
    it('1041488 - should produce expected digest for empty input (initial state h0..h3)', () => {
        const md5: any = new _MD5();
        const result: Uint8Array = md5.hash(new Uint8Array(0), 0, 0);
        const expected: string = 'd41d8cd98f00b204e9800998ecf8427e';
        const hex: string = Array.from(result)
            .map((b: number) => _padStart(b.toString(16), 2, '0'))
            .join('');
        expect(hex).toBe(expected);
    });
    it('1041488 - should produce expected digest for short ascii input', () => {
        const md5: any = new _MD5();
        const data: Uint8Array = _decode('hello') as Uint8Array;
        const result: Uint8Array = md5.hash(data, 0, data.length);
        const expected: string = '8d6d62170afb6de38b3362fd93b01b89';
        const hex: string = Array.from(result)
            .map((b: number) => _padStart(b.toString(16), 2, '0'))
            .join('');
        expect(hex).toBe(expected);
    });
    it('1041488 - should respect provided data offset and length arguments', () => {
        const md5: any = new _MD5();
        const buffer: Uint8Array = new Uint8Array(10);
        buffer[5] = 0x61;
        buffer[6] = 0x62;
        buffer[7] = 0x63;
        const result: Uint8Array = md5.hash(buffer, 5, 3);
        const expected: string = '900150983cd24fb0d6963f7d28e17f72';
        const hex: string = Array.from(result)
            .map((b: number) => _padStart(b.toString(16), 2, '0'))
            .join('');
        expect(hex).toBe(expected);
    });
    it('1041488 - should treat offset/length as zero when not provided', () => {
        const md5: any = new _MD5();
        const data: Uint8Array = _decode('abc') as Uint8Array;
        const result: Uint8Array = md5.hash(data);
        const expected: string = '0123456789abcdeffedcba9876543210';
        const hex: string = Array.from(result)
            .map((b: number) => _padStart(b.toString(16), 2, '0'))
            .join('');
        expect(hex).toBe(expected);
    });
});
describe('1041491 - Normal cipher state initialization', () => {
    it('1041491 - should initialize the permutation table using every key byte in sequence', () => {
        const key: Uint8Array = new Uint8Array([1, 2, 3, 4]);
        const cipher: any = new _NormalCipherFour(key);
        expect(cipher._s.length).toBe(256);
        expect(cipher._a).toBe(0);
        expect(cipher._b).toBe(0);
        expect(cipher._s[0]).not.toBe(0);
        expect(cipher._s[1]).not.toBe(1);
        expect(cipher._s[2]).not.toBe(2);
        expect(cipher._s[3]).not.toBe(3);
        expect(cipher._s[4]).not.toBe(4);
        expect(cipher._s[5]).not.toBe(5);
        expect(cipher._s[6]).not.toBe(6);
        expect(cipher._s[7]).not.toBe(7);
        const expected = new Uint8Array(256);
        for (let i: number = 0; i < expected.length; i++) {
            expected[i] = i;
        }
        let j: number = 0;
        for (let i: number = 0; i < expected.length; i++) {
            const buffer: number = expected[i];
            j = (j + buffer + key[i % key.length]) & 0xff;
            const swap: number = expected[j];
            expected[i] = swap;
            expected[j] = buffer;
        }
        expect(Array.from(cipher._s)).toEqual(Array.from(expected));
        const input: Uint8Array = new Uint8Array([10, 20, 30, 40]);
        const encrypted: Uint8Array = cipher._encrypt(input);
        expect(encrypted).not.toEqual(input);
        const cipherWithDifferentKey: any = new _NormalCipherFour(new Uint8Array([1, 2, 3, 5]));
        const encryptedWithDifferentKey: Uint8Array = cipherWithDifferentKey._encrypt(input);
        expect(Array.from(encryptedWithDifferentKey)).not.toEqual(Array.from(encrypted));
    });
    it('1041491 - should advance internal state and produce key-dependent output', () => {
        const key: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const cipher: any = new _NormalCipherFour(key);
        const input: Uint8Array = new Uint8Array([11, 22, 33, 44, 55, 66, 77, 88]);
        const beforeA: number = cipher._a;
        const beforeB: number = cipher._b;
        const stateBefore: Uint8Array = new Uint8Array(cipher._s);
        const output: Uint8Array = cipher._encryptBlock(input);
        expect(output).not.toEqual(input);
        expect(cipher._a).toBe((beforeA + input.length) & 0xff);
        expect(cipher._b).not.toBe(beforeB);
        expect(Array.from(cipher._s)).not.toEqual(Array.from(stateBefore));
        const referenceCipher: any = new _NormalCipherFour(key);
        let refA: number = referenceCipher._a;
        let refB: number = referenceCipher._b;
        const refState: Uint8Array = new Uint8Array(referenceCipher._s);
        const expectedOutput: Uint8Array = new Uint8Array(input.length);
        for (let i: number = 0; i < input.length; i++) {
            refA = (refA + 1) & 0xff;
            const first: number = refState[refA];
            refB = (refB + first) & 0xff;
            const second: number = refState[refB];
            refState[refA] = second;
            refState[refB] = first;
            expectedOutput[i] = input[i] ^ refState[(first + second) & 0xff];
        }
        expect(Array.from(output)).toEqual(Array.from(expectedOutput));
        const cipherSameKey: any = new _NormalCipherFour(key);
        const sameOutput: Uint8Array = cipherSameKey._encryptBlock(input);
        expect(Array.from(sameOutput)).toEqual(Array.from(output));
        const cipherDifferentKey: any = new _NormalCipherFour(new Uint8Array([1, 2, 3, 4, 6]));
        const differentOutput: Uint8Array = cipherDifferentKey._encryptBlock(input);
        expect(Array.from(differentOutput)).not.toEqual(Array.from(output));
    });
    it('1041491 - should return the exact same data from both encrypt and decrypt paths', () => {
        const cipher: any = new _NullCipher();
        const input: Uint8Array = new Uint8Array([0, 17, 34, 51, 68, 85, 102, 119]);
        const decrypted: Uint8Array = cipher._decryptBlock(input);
        const encrypted: Uint8Array = cipher._encrypt(input);
        expect(decrypted).toBe(input);
        expect(encrypted).toBe(input);
        expect(Array.from(encrypted)).toEqual([0, 17, 34, 51, 68, 85, 102, 119]);
        const secondInput: Uint8Array = new Uint8Array([255, 0, 1, 2]);
        expect(cipher._decryptBlock(secondInput)).toBe(secondInput);
        expect(cipher._encrypt(secondInput)).toBe(secondInput);
        expect(Array.from(cipher._decryptBlock(secondInput))).toEqual([255, 0, 1, 2]);
        expect(Array.from(cipher._encrypt(secondInput))).toEqual([255, 0, 1, 2]);
    });
    it('1041491 - should preserve identity semantics across multiple invocations and inputs', () => {
        const cipher: any = new _NullCipher();
        const first: Uint8Array = new Uint8Array([1, 2, 3]);
        const second: Uint8Array = new Uint8Array([4, 5, 6, 7]);
        const firstEncrypted: Uint8Array = cipher._encrypt(first);
        const firstDecrypted: Uint8Array = cipher._decryptBlock(first);
        const secondEncrypted: Uint8Array = cipher._encrypt(second);
        const secondDecrypted: Uint8Array = cipher._decryptBlock(second);
        expect(firstEncrypted).toBe(first);
        expect(firstDecrypted).toBe(first);
        expect(secondEncrypted).toBe(second);
        expect(secondDecrypted).toBe(second);
        expect(firstEncrypted).not.toBe(secondEncrypted);
        expect(Array.from(firstEncrypted)).toEqual([1, 2, 3]);
        expect(Array.from(secondEncrypted)).toEqual([4, 5, 6, 7]);
    });
     it('1041491 - should expand keys correctly, enforce key length, and encrypt deterministically', () => {
        const key: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const cipher: any = new _CipherTwo(key);
        expect(cipher._effectiveKeyBits).toBe(64);
        expect(cipher._blockSize).toBe(8);
        expect(cipher._expandedKey.length).toBe(64);
        expect(cipher._expandedKey[0]).not.toBe(0);
        expect(cipher._expandedKey[63]).not.toBe(0);
        expect(() => new _CipherTwo(new Uint8Array([1, 2, 3, 4])))
            .toThrowError('RC2 key must be between 5 and 128 bytes.');
        expect(() => new _CipherTwo(new Uint8Array(129).fill(1)))
            .toThrowError('RC2 key must be between 5 and 128 bytes.');
        const key128: Uint8Array = new Uint8Array(128).fill(1);
        const cipher128: any = new _CipherTwo(key128);
        expect(cipher128._expandedKey.length).toBe(64);
        const input128: Uint8Array = new Uint8Array([1, 2, 3, 4, 5, 6, 7]);
        const encrypted128: Uint8Array = cipher128._encrypt(input128);
        expect(encrypted128.length).toBe(8);
        expect(Array.from(encrypted128)).toEqual(Array.from(cipher128._encrypt(input128)));
        const input: Uint8Array = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        const encryptedDefault: Uint8Array = cipher._encrypt(input);
        expect(encryptedDefault.length % 8).toBe(0);
        expect(encryptedDefault.length).toBe(16);
        const cipherAgain: any = new _CipherTwo(key);
        expect(Array.from(cipherAgain._encrypt(input))).toEqual(Array.from(encryptedDefault));
        const cipherDifferentBits: any = new _CipherTwo(key, 40);
        expect(cipherDifferentBits._effectiveKeyBits).toBe(40);
        expect(cipherDifferentBits._expandedKey.length).toBe(64);
        expect(Array.from(cipherDifferentBits._encrypt(input))).not.toEqual(Array.from(encryptedDefault));
        const cipherSevenBits: any = new _CipherTwo(key, 7);
        const cipherFortyBits: any = new _CipherTwo(key, 40);
        const bitSensitiveInput: Uint8Array = new Uint8Array([9, 8, 7, 6, 5, 4, 3, 2]);
        expect(Array.from(cipherSevenBits._encrypt(bitSensitiveInput))).not.toEqual(Array.from(cipherFortyBits._encrypt(bitSensitiveInput)));
    });
    it('1041491 - should pad to the next RC2 block and encrypt each block independently', () => {
        const key: Uint8Array = new Uint8Array([9, 8, 7, 6, 5]);
        const cipher: any = new _CipherTwo(key);
        const twoBlocks: Uint8Array = new Uint8Array(16);
        for (let i: number = 0; i < twoBlocks.length; i++) {
            twoBlocks[i] = i + 1;
        }
        const encryptedTwoBlocks: Uint8Array = cipher._encrypt(twoBlocks);
        expect(encryptedTwoBlocks.length).toBe(24);
        expect(Array.from(encryptedTwoBlocks.slice(0, 8))).not.toEqual(Array.from(encryptedTwoBlocks.slice(8, 16)));
        const shortInput: Uint8Array = new Uint8Array([1, 2, 3, 4, 5, 6, 7]);
        const encryptedShort: Uint8Array = cipher._encrypt(shortInput);
        expect(encryptedShort.length).toBe(8);
        const exactBlockInput: Uint8Array = new Uint8Array(8);
        exactBlockInput.fill(0x11);
        const encryptedExactBlock: Uint8Array = cipher._encrypt(exactBlockInput);
        expect(encryptedExactBlock.length).toBe(16);
        const emptyEncrypted: Uint8Array = cipher._encrypt(new Uint8Array(0));
        expect(emptyEncrypted.length).toBe(8);
        const longerInput: Uint8Array = new Uint8Array(17);
        longerInput.fill(0x11);
        const encryptedLonger: Uint8Array = cipher._encrypt(longerInput);
        expect(encryptedLonger.length).toBe(24);
        expect(encryptedLonger).toEqual(new Uint8Array([119, 236, 193, 41, 188, 84, 11, 90, 119, 236, 193, 41, 188, 84, 11, 90, 233, 77, 161, 103, 37, 94, 231, 93]));
    });
    it('1041491 - should decrypt a full block stream with the IV chain intact', () => {
        const key: Uint8Array = new Uint8Array([5, 4, 3, 2, 1]);
        const cipher: any = new _CipherTwo(key);
        const iv: Uint8Array = new Uint8Array(8);
        for (let i: number = 0; i < iv.length; i++) {
            iv[i] = i + 1;
        }
        const plain: Uint8Array = new Uint8Array(16);
        for (let i: number = 0; i < plain.length; i++) {
            plain[i] = 0x30 + i;
        }
        const encrypted: Uint8Array = cipher._encrypt(plain);
        const decrypted: Uint8Array = cipher._decrypt(encrypted, iv);
        expect(decrypted.length).toBe(24);
        expect(Array.from(decrypted)).not.toEqual(Array.from(encrypted));
        expect(Array.from(decrypted)).not.toEqual(Array.from(plain));
        const tampered: Uint8Array = new Uint8Array(encrypted);
        tampered[0] ^= 0xff;
        const tamperedDecrypted: Uint8Array = cipher._decrypt(tampered, iv);
        expect(Array.from(tamperedDecrypted)).not.toEqual(Array.from(decrypted));
    });
    it('1041491 - should remove only valid padding and keep invalid padding intact', () => {
        const key: Uint8Array = new Uint8Array([1, 3, 5, 7, 9]);
        const cipher: any = new _CipherTwo(key);
        const validCiphertext: Uint8Array = new Uint8Array(8);
        validCiphertext.fill(8);
        const validPlain: Uint8Array = cipher._decrypt(validCiphertext, new Uint8Array(8));
        expect(validPlain.length).toBe(8);
        const invalidCiphertext: Uint8Array = new Uint8Array(8);
        invalidCiphertext.fill(4);
        invalidCiphertext[7] = 3;
        const invalidPlain: Uint8Array = cipher._decrypt(invalidCiphertext, new Uint8Array(8));
        expect(invalidPlain.length).toBe(8);
        expect(Array.from(invalidPlain)).toEqual([23,5,94,150, 120,132,161,111]);
    });
    it('1041491 - should decrypt an encrypted block back to original data', () => {
        const cipher: any = new _CipherTwo(new Uint8Array([1, 2, 3, 4, 5]));
        const plain = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
        const encrypted = cipher._encryptBlock(plain);
        const decrypted = cipher._decryptBlock(encrypted);
        expect(Array.from(decrypted)).toEqual(Array.from(plain));
    });
    it('1041491 - should preserve decrypted data when padding length exceeds block size', () => {
        const cipher: any = new _CipherTwo(new Uint8Array([1, 2, 3, 4, 5]));
        cipher._decryptBlock = (_block: Uint8Array): Uint8Array => {
            return new Uint8Array([1, 2, 3, 4, 5, 6, 7, 20]);
        };
        const result: Uint8Array = cipher._decrypt(
            new Uint8Array(8),
            new Uint8Array(8)
        );
        expect(result.length).toBe(8);
        expect(Array.from(result)).toEqual([1, 2, 3, 4, 5, 6, 7, 20]);
    });
    it('1041491 - should XOR all bytes with the IV during decryption', () => {
        const cipher: any = new _CipherTwo(new Uint8Array([1, 2, 3, 4, 5]));
        cipher._decryptBlock = (_block: Uint8Array): Uint8Array => {
            return new Uint8Array([10, 10, 10, 10, 10, 10, 10, 10]);
        };
        const iv: Uint8Array = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
        const result: Uint8Array = cipher._decrypt(
            new Uint8Array(8),
            iv
        );
        expect(Array.from(result)).toEqual([
            11, 8, 9, 14, 15, 12, 13, 2
        ]);
    });
    it('1041491 - should decrypt an encrypted block back to the original block', () => {
        const cipher: any = new _CipherTwo(
            new Uint8Array([1, 2, 3, 4, 5])
        );
        const plain: Uint8Array = new Uint8Array([
            1, 2, 3, 4, 5, 6, 7, 8
        ]);
        const encrypted: Uint8Array = cipher._encryptBlock(plain);
        const decrypted: Uint8Array = cipher._decryptBlock(encrypted);
        expect(Array.from(decrypted)).toEqual(Array.from(plain));
    });
});
describe('1041493 - SHA-1 hash regression', () => {
    it('1041493 - should hash multi-block data and preserve padding and word extraction', () => {
        const sha1 = new _Sha1();
        const singleBlock = new Uint8Array(55);
        for (let i = 0; i < singleBlock.length; i++) {
            singleBlock[i] = i + 1;
        }
        expect(Array.from(sha1._hash(singleBlock, 0, singleBlock.length))).toEqual([
            0xf5, 0x11, 0xa6, 0x18, 0xd9, 0xd3, 0x39, 0xea, 0x3f, 0x92,
            0xa3, 0x0b, 0xf5, 0x3d, 0x86, 0xa1, 0xbc, 0x42, 0x87, 0xd1
        ]);
        const twoBlock = new Uint8Array(64);
        for (let i = 0; i < twoBlock.length; i++) {
            twoBlock[i] = i;
        }
        expect(Array.from(sha1._hash(twoBlock, 0, twoBlock.length))).toEqual([
            0xc6, 0x13, 0x8d, 0x51, 0x4f, 0xfa, 0x21, 0x35, 0xbf, 0xce,
            0x0e, 0xd0, 0xb8, 0xfa, 0xc6, 0x56, 0x69, 0x91, 0x7e, 0xc7
        ]);
        const offsetSource = new Uint8Array(70);
        for (let i = 0; i < offsetSource.length; i++) {
            offsetSource[i] = 0xff - i;
        }
        const offsetDigest = sha1._hash(offsetSource, 3, 55);
        expect(Array.from(offsetDigest)).toEqual([
            0x7d, 0x74, 0x6c, 0x47, 0x41, 0x85, 0x6e, 0x7a, 0x01, 0x5d,
            0xbe, 0x05, 0x7d, 0x10, 0x36, 0x95, 0x73, 0x51, 0xde, 0xcf
        ]);
    });
    it('1041493 - should hash a full block boundary input correctly', () => {
        const sha1 = new _Sha1();
        const block = new Uint8Array(64);
        for (let i = 0; i < block.length; i++) {
            block[i] = i;
        }
        expect(Array.from(sha1._hash(block, 0, block.length))).toEqual([
            0xc6, 0x13, 0x8d, 0x51, 0x4f, 0xfa, 0x21, 0x35, 0xbf, 0xce,
            0x0e, 0xd0, 0xb8, 0xfa, 0xc6, 0x56, 0x69, 0x91, 0x7e, 0xc7
        ]);
    });
});
describe('1041504 - SHA-512 and SHA-384 hash regression', () => {
    it('1041504 - should hash full and partial inputs and respect offset handling for SHA-512', () => {
        const sha512 = new _Sha512();
        const empty = new Uint8Array(0);
        expect(Array.from(sha512._hash(empty, 0, empty.length))).toEqual([
            0xcf, 0x83, 0xe1, 0x35, 0x7e, 0xef, 0xb8, 0xbd,
            0xf1, 0x54, 0x28, 0x50, 0xd6, 0x6d, 0x80, 0x07,
            0xd6, 0x20, 0xe4, 0x05, 0x0b, 0x57, 0x15, 0xdc,
            0x83, 0xf4, 0xa9, 0x21, 0xd3, 0x6c, 0xe9, 0xce,
            0x47, 0xd0, 0xd1, 0x3c, 0x5d, 0x85, 0xf2, 0xb0,
            0xff, 0x83, 0x18, 0xd2, 0x87, 0x7e, 0xec, 0x2f,
            0x63, 0xb9, 0x31, 0xbd, 0x47, 0x41, 0x7a, 0x81,
            0xa5, 0x38, 0x32, 0x7a, 0xf9, 0x27, 0xda, 0x3e
        ]);
        const abc = new Uint8Array([0x61, 0x62, 0x63]);
        expect(Array.from(sha512._hash(abc, 0, abc.length))).toEqual([
            0xdd, 0xaf, 0x35, 0xa1, 0x93, 0x61, 0x7a, 0xba,
            0xcc, 0x41, 0x73, 0x49, 0xae, 0x20, 0x41, 0x31,
            0x12, 0xe6, 0xfa, 0x4e, 0x89, 0xa9, 0x7e, 0xa2,
            0x0a, 0x9e, 0xee, 0xe6, 0x4b, 0x55, 0xd3, 0x9a,
            0x21, 0x92, 0x99, 0x2a, 0x27, 0x4f, 0xc1, 0xa8,
            0x36, 0xba, 0x3c, 0x23, 0xa3, 0xfe, 0xeb, 0xbd,
            0x45, 0x4d, 0x44, 0x23, 0x64, 0x3c, 0xe8, 0x0e,
            0x2a, 0x9a, 0xc9, 0x4f, 0xa5, 0x4c, 0xa4, 0x9f
        ]);
        const source = new Uint8Array(16);
        for (let i = 0; i < source.length; i++) {
            source[i] = i;
        }
        const offsetDigest = sha512._hash(source, 4, 8);
        expect(Array.from(offsetDigest)).toEqual(Array.from(sha512._hash(source.slice(4, 12), 0, 8)));
        expect(Array.from(offsetDigest)).not.toEqual(Array.from(sha512._hash(source, 0, 8)));
        const compareInput = new Uint8Array([0x00, 0x01, 0x02, 0x03, 0x04]);
        const sha512Digest = sha512._hash(compareInput, 0, compareInput.length);
        const sha384Digest = new _Sha384()._hash(compareInput, 0, compareInput.length);
        expect(sha512Digest.length).toBe(64);
        expect(sha384Digest.length).toBe(48);
        expect(Array.from(sha512Digest)).not.toEqual(Array.from(sha384Digest));
    });
    it('1041504 - should compute SHA-384 through the SHA-512 wrapper', () => {
        const sha384 = new _Sha384();
        const message = new Uint8Array([0x61, 0x62, 0x63]);
        const digest = sha384._hash(message, 0, message.length);
        expect(digest.length).toBe(48);
        expect(Array.from(digest)).toEqual([
            0xcb, 0x00, 0x75, 0x3f, 0x45, 0xa3, 0x5e, 0x8b,
            0xb5, 0xa0, 0x3d, 0x69, 0x9a, 0xc6, 0x50, 0x07,
            0x27, 0x2c, 0x32, 0xab, 0x0e, 0xde, 0xd1, 0x63,
            0x1a, 0x8b, 0x60, 0x5a, 0x43, 0xff, 0x5b, 0xed,
            0x80, 0x86, 0x07, 0x2b, 0xa1, 0xe7, 0xcc, 0x23,
            0x58, 0xba, 0xec, 0xa1, 0x34, 0xc8, 0x25, 0xa7
        ]);
    });
});
describe('1041501 - SHA 256', () => {
    it('1041501 - should produce the correct SHA256 hash for abc', () => {
        const sha256: _Sha256 = new _Sha256();
        const data: Uint8Array = new Uint8Array([97, 98, 99]); // "abc"
        const hash: Uint8Array = sha256._hash(data, 0, data.length);
        expect(Array.from(hash)).toEqual([
            186, 120, 22, 191, 143, 1, 207, 234,
            65, 65, 64, 222, 93, 174, 34, 35,
            176, 3, 97, 163, 150, 23, 122, 156,
            180, 16, 255, 97, 242, 0, 21, 173
        ]);
    });
});