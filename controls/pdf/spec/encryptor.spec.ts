import {
    _PdfEncryptionHelper,
    _PdfEncryptor,
    _Word64
} from '../src/pdf/core/security/encryptor';
import { _PdfDictionary, _PdfName } from '../src/pdf/core/pdf-primitives';
import { FormatError } from '../src/pdf/core/utils';
function createBytes(length: number, initialValue: number): Uint8Array {
    const bytes: Uint8Array = new Uint8Array(length);
    for (let index: number = 0; index < bytes.length; index++) {
        bytes[index] = (initialValue + index) & 0xff;
    }
    return bytes;
}
function bytesToString(bytes: Uint8Array): string {
    let value: string = '';
    for (let index: number = 0; index < bytes.length; index++) {
        value += String.fromCharCode(bytes[index]);
    }
    return value;
}
function expectBytesEqual(
    actual: Uint8Array,
    expected: Uint8Array
): void {
    expect(actual.length).toBe(expected.length);
    for (let index: number = 0; index < expected.length; index++) {
        expect(actual[index]).toBe(expected[index]);
    }
}
function expectBytesDifferent(
    actual: Uint8Array,
    expected: Uint8Array
): void {
    let differenceFound: boolean = actual.length !== expected.length;
    const length: number = Math.min(actual.length, expected.length);
    for (let index: number = 0; index < length; index++) {
        if (actual[index] !== expected[index]) {
            differenceFound = true;
        }
    }
    expect(differenceFound).toBe(true);
}
function createStandardDictionary(
    algorithm: number,
    revision: number,
    keyLength: number,
    ownerEntry: Uint8Array,
    userEntry: Uint8Array,
    permissions: number
): _PdfDictionary {
    const dictionary: _PdfDictionary = new _PdfDictionary();
    dictionary.update('Filter', _PdfName.get('Standard'));
    dictionary.update('V', algorithm);
    dictionary.update('R', revision);
    dictionary.update('Length', keyLength);
    dictionary.update('O', bytesToString(ownerEntry));
    dictionary.update('U', bytesToString(userEntry));
    dictionary.update('P', permissions);
    return dictionary;
}
function createRevisionTwoDictionary(
    password: Uint8Array,
    includeLength: boolean = true
): {
    dictionary: _PdfDictionary;
    id: string;
    encryptionKey: Uint8Array;
} {
    const helper: _PdfEncryptionHelper = new _PdfEncryptionHelper();
    const idBytes: Uint8Array = createBytes(16, 1);
    const id: string = bytesToString(idBytes);
    const ownerEntry: Uint8Array = helper._computeOwnerPassword(
        new Uint8Array(0),
        password,
        2,
        40
    );
    const encryptionKey: Uint8Array = helper._generateKey(
        idBytes,
        password,
        ownerEntry,
        -4,
        2,
        40,
        false
    );
    const userEntry: Uint8Array = helper._computeUserPassword(
        encryptionKey,
        idBytes,
        2
    );
    const dictionary: _PdfDictionary = createStandardDictionary(
        1,
        2,
        40,
        ownerEntry,
        userEntry,
        -4
    );
    if (!includeLength) {
        dictionary.update('Length', 0);
    }
    return {
        dictionary,
        id,
        encryptionKey
    };
}
describe('encryptor survived mutations', () => {
    describe('_Word64 exact output', () => {
        it('shiftRight uses places minus 32', () => {
            // Arrange
            const word: _Word64 = new _Word64(
                0x12345678,
                0x76543210
            );
            // Act
            word.shiftRight(36);
            // Assert
            expect(word.high).toBe(0);
            expect(word.low).toBe(0x01234567);
        });
        it('shiftRight moves complete high into low at 32 bits', () => {
            // Arrange
            const word: _Word64 = new _Word64(
                0x12345678,
                0x76543210
            );
            // Act
            word.shiftRight(32);
            // Assert
            expect(word.high).toBe(0);
            expect(word.low).toBe(0x12345678);
        });
        it('shiftRight combines high and low below 32 bits', () => {
            // Arrange
            const word: _Word64 = new _Word64(
                0x12345678,
                0x76543210
            );
            // Act
            word.shiftRight(8);
            // Assert
            expect(word.high).toBe(0x00123456);
            expect(word.low).toBe(0x78765432);
        });
        it('shiftLeft uses places minus 32', () => {
            // Arrange
            const word: _Word64 = new _Word64(
                0x12345678,
                0x07654321
            );
            // Act
            word.shiftLeft(36);
            // Assert
            expect(word.low).toBe(0);
            expect(word.high).toBe(0x76543210);
        });
        it('shiftLeft moves complete low into high at 32 bits', () => {
            // Arrange
            const word: _Word64 = new _Word64(
                0x12345678,
                0x07654321
            );
            // Act
            word.shiftLeft(32);
            // Assert
            expect(word.low).toBe(0);
            expect(word.high).toBe(0x07654321);
        });
        it('shiftLeft updates low by left shift', () => {
            // Arrange
            const word: _Word64 = new _Word64(0, 15);
            // Act
            word.shiftLeft(4);
            // Assert
            expect(word.high).toBe(0);
            expect(word.low).toBe(240);
        });
        it('add does not carry when low sum equals unsigned maximum', () => {
            // Arrange
            const word: _Word64 = new _Word64(
                5,
                0xfffffffe
            );
            const value: _Word64 = new _Word64(7, 1);
            // Act
            word.add(value);
            // Assert
            expect(word.low).toBe(-1);
            expect(word.high).toBe(12);
        });
        it('add increments high when low sum exceeds unsigned maximum', () => {
            // Arrange
            const word: _Word64 = new _Word64(
                20,
                0xffffffff
            );
            const value: _Word64 = new _Word64(10, 2);
            // Act
            word.add(value);
            // Assert
            expect(word.low).toBe(1);
            expect(word.high).toBe(31);
        });
    });
    describe('_PdfEncryptor constructor guards and defaults', () => {
        it('accepts undefined password as the empty password', () => {
            // Arrange
            const harness = createRevisionTwoDictionary(
                new Uint8Array(0)
            );
            // Act
            const encryptor: _PdfEncryptor = new _PdfEncryptor(
                harness.dictionary,
                harness.id,
                undefined
            );
            // Assert
            expect(encryptor._filterName).toBe('Standard');
            expect(encryptor._algorithm).toBe(1);
            expect(encryptor._isUserPassword).toBe(true);
            expectBytesEqual(
                encryptor._encryptionKey,
                harness.encryptionKey
            );
        });
        it('accepts null password as the empty password', () => {
            // Arrange
            const harness = createRevisionTwoDictionary(
                new Uint8Array(0)
            );
            // Act
            const encryptor: _PdfEncryptor = new _PdfEncryptor(
                harness.dictionary,
                harness.id,
                null as any
            );
            // Assert
            expect(encryptor._filterName).toBe('Standard');
            expect(encryptor._algorithm).toBe(1);
            expect(encryptor._isUserPassword).toBe(true);
            expectBytesEqual(
                encryptor._encryptionKey,
                harness.encryptionKey
            );
        });
        it('accepts algorithm one', () => {
            // Arrange
            const harness = createRevisionTwoDictionary(
                new Uint8Array(0)
            );
            harness.dictionary.update('V', 1);
            // Act
            const encryptor: _PdfEncryptor = new _PdfEncryptor(
                harness.dictionary,
                harness.id,
                ''
            );
            // Assert
            expect(encryptor._algorithm).toBe(1);
        });
        it('accepts algorithm two', () => {
            // Arrange
            const harness = createRevisionTwoDictionary(
                new Uint8Array(0)
            );
            harness.dictionary.update('V', 2);
            // Act
            const encryptor: _PdfEncryptor = new _PdfEncryptor(
                harness.dictionary,
                harness.id,
                ''
            );
            // Assert
            expect(encryptor._algorithm).toBe(2);
        });
        it('uses 40 bits when algorithm one has no Length', () => {
            // Arrange
            const harness = createRevisionTwoDictionary(
                new Uint8Array(0),
                false
            );
            // Act
            const encryptor: _PdfEncryptor = new _PdfEncryptor(
                harness.dictionary,
                harness.id,
                ''
            );
            // Assert
            expect(encryptor._algorithm).toBe(1);
            expect(encryptor._encryptionKey.length).toBe(5);
            expectBytesEqual(
                encryptor._encryptionKey,
                harness.encryptionKey
            );
        });
        it('uses 40 bits when algorithm two has no Length', () => {
            // Arrange
            const harness = createRevisionTwoDictionary(
                new Uint8Array(0),
                false
            );
            harness.dictionary.update('V', 2);
            // Act
            const encryptor: _PdfEncryptor = new _PdfEncryptor(
                harness.dictionary,
                harness.id,
                ''
            );
            // Assert
            expect(encryptor._algorithm).toBe(2);
            expect(encryptor._encryptionKey.length).toBe(5);
        });
        it('accepts exact 40 bit key boundary', () => {
            // Arrange
            const harness = createRevisionTwoDictionary(
                new Uint8Array(0)
            );
            harness.dictionary.update('Length', 40);
            // Act
            const encryptor: _PdfEncryptor = new _PdfEncryptor(
                harness.dictionary,
                harness.id,
                ''
            );
            // Assert
            expect(encryptor._encryptionKey.length).toBe(5);
        });
        it('throws exact error for empty incorrect password', () => {
            // Arrange
            const harness = createRevisionTwoDictionary(
                createBytes(4, 20)
            );
            // Act
            const action: () => _PdfEncryptor =
                () => new _PdfEncryptor(
                    harness.dictionary,
                    harness.id,
                    ''
                );
            // Assert
            expect(action).toThrowError(
                Error,
                'Cannot open an encrypted document. ' +
                'The password is invalid.'
            );
        });
    });
    describe('_PdfEncryptor direct branch results', () => {
        it('_md5 creates and returns message digest', () => {
            // Arrange
            const harness = createRevisionTwoDictionary(
                new Uint8Array(0)
            );
            const encryptor: _PdfEncryptor = new _PdfEncryptor(
                harness.dictionary,
                harness.id,
                ''
            );
            encryptor._messageDigest = undefined;
            // Act
            const result = encryptor._md5;
            // Assert
            expect(result).toBeDefined();
            expect(encryptor._messageDigest).toBe(result);
        });
        it('_md5 returns same cached instance', () => {
            // Arrange
            const harness = createRevisionTwoDictionary(
                new Uint8Array(0)
            );
            const encryptor: _PdfEncryptor = new _PdfEncryptor(
                harness.dictionary,
                harness.id,
                ''
            );
            // Act
            const first = encryptor._md5;
            const second = encryptor._md5;
            // Assert
            expect(first).toBe(second);
            expect(encryptor._messageDigest).toBe(first);
        });
        it('_createEncryptionKey returns user-key branch output', () => {
            // Arrange
            const harness = createRevisionTwoDictionary(
                new Uint8Array(0)
            );
            const encryptor: _PdfEncryptor = new _PdfEncryptor(
                harness.dictionary,
                harness.id,
                ''
            );
            const expected: Uint8Array = createBytes(32, 1);
            const algorithm: any = {
                _getUserKey: (): Uint8Array => expected,
                _getOwnerKey: (): Uint8Array => createBytes(32, 50)
            };
            // Act
            const result: Uint8Array =
                encryptor._createEncryptionKey(
                    true,
                    createBytes(4, 1),
                    createBytes(8, 2),
                    createBytes(48, 3),
                    createBytes(8, 4),
                    createBytes(32, 5),
                    createBytes(32, 6),
                    algorithm
                );
            // Assert
            expect(result).toBe(expected);
        });
        it('_createEncryptionKey returns owner-key branch output', () => {
            // Arrange
            const harness = createRevisionTwoDictionary(
                new Uint8Array(0)
            );
            const encryptor: _PdfEncryptor = new _PdfEncryptor(
                harness.dictionary,
                harness.id,
                ''
            );
            const expected: Uint8Array = createBytes(32, 50);
            const algorithm: any = {
                _getUserKey: (): Uint8Array => createBytes(32, 1),
                _getOwnerKey: (): Uint8Array => expected
            };
            // Act
            const result: Uint8Array =
                encryptor._createEncryptionKey(
                    false,
                    createBytes(4, 1),
                    createBytes(8, 2),
                    createBytes(48, 3),
                    createBytes(8, 4),
                    createBytes(32, 5),
                    createBytes(32, 6),
                    algorithm
                );
            // Assert
            expect(result).toBe(expected);
        });
        it('_buildObjectKey produces different AES object key', () => {
            // Arrange
            const harness = createRevisionTwoDictionary(
                new Uint8Array(0)
            );
            const encryptor: _PdfEncryptor = new _PdfEncryptor(
                harness.dictionary,
                harness.id,
                ''
            );
            const key: Uint8Array = createBytes(16, 1);
            // Act
            const normalKey: Uint8Array =
                encryptor._buildObjectKey(
                    258,
                    3,
                    key,
                    false
                );
            const advancedKey: Uint8Array =
                encryptor._buildObjectKey(
                    258,
                    3,
                    key,
                    true
                );
            // Assert
            expect(normalKey.length).toBe(16);
            expect(advancedKey.length).toBe(16);
            expectBytesDifferent(normalKey, advancedKey);
        });
        it('_buildObjectKey defaults to non advanced encryption', () => {
            // Arrange
            const harness = createRevisionTwoDictionary(
                new Uint8Array(0)
            );
            const encryptor: _PdfEncryptor = new _PdfEncryptor(
                harness.dictionary,
                harness.id,
                ''
            );
            const key: Uint8Array = createBytes(8, 1);
            // Act
            const defaultResult: Uint8Array =
                encryptor._buildObjectKey(
                    66051,
                    1029,
                    key
                );
            const explicitResult: Uint8Array =
                encryptor._buildObjectKey(
                    66051,
                    1029,
                    key,
                    false
                );
            // Assert
            expectBytesEqual(defaultResult, explicitResult);
            expect(defaultResult.length).toBe(13);
        });
    });
    describe('_PdfEncryptor _prepareKeyData', () => {
        it('returns null when revision two user entry differs', () => {
            // Arrange
            const harness = createRevisionTwoDictionary(
                new Uint8Array(0)
            );
            const encryptor: _PdfEncryptor = new _PdfEncryptor(
                harness.dictionary,
                harness.id,
                ''
            );
            const id: Uint8Array = createBytes(16, 1);
            const owner: Uint8Array = createBytes(32, 20);
            const invalidUser: Uint8Array = createBytes(32, 70);
            // Act
            const result: Uint8Array =
                encryptor._prepareKeyData(
                    id,
                    new Uint8Array(0),
                    owner,
                    invalidUser,
                    -4,
                    2,
                    40,
                    false
                );
            // Assert
            expect(result).toBeNull();
        });
        it('uses metadata marker at revision four', () => {
            // Arrange
            const helper: _PdfEncryptionHelper =
                new _PdfEncryptionHelper();
            const harness = createRevisionTwoDictionary(
                new Uint8Array(0)
            );
            const encryptor: _PdfEncryptor = new _PdfEncryptor(
                harness.dictionary,
                harness.id,
                ''
            );
            const id: Uint8Array = createBytes(16, 1);
            const password: Uint8Array = createBytes(8, 20);
            const owner: Uint8Array = createBytes(32, 40);
            const encryptedKey: Uint8Array = helper._generateKey(
                id,
                password,
                owner,
                -4,
                4,
                128,
                false
            );
            const user: Uint8Array = helper._computeUserPassword(
                encryptedKey,
                id,
                4
            );
            // Act
            const result: Uint8Array =
                encryptor._prepareKeyData(
                    id,
                    password,
                    owner,
                    user,
                    -4,
                    4,
                    128,
                    false
                );
            // Assert
            expectBytesEqual(result, encryptedKey);
            expect(result.length).toBe(16);
        });
    });
    describe('_PdfEncryptionHelper exact branch output', () => {
        it('_computeUserPassword revision three keeps exact pad tail', () => {
            // Arrange
            const helper: _PdfEncryptionHelper =
                new _PdfEncryptionHelper();
            const encryptionKey: Uint8Array =
                createBytes(5, 1);
            const fileId: Uint8Array =
                createBytes(16, 33);
            const expectedTail: Uint8Array =
                new Uint8Array([
                    0x28,
                    0xbf,
                    0x4e,
                    0x5e,
                    0x4e,
                    0x75,
                    0x8a,
                    0x41,
                    0x64,
                    0x00,
                    0x4e,
                    0x56,
                    0xff,
                    0xfa,
                    0x01,
                    0x08
                ]);
            // Act
            const result: Uint8Array =
                helper._computeUserPassword(
                    encryptionKey,
                    fileId,
                    3
                );
            // Assert
            expect(result.length).toBe(32);
            expectBytesEqual(
                result.subarray(16),
                expectedTail
            );
        });
        it('_computeUserPassword changes with final key byte', () => {
            // Arrange
            const helper: _PdfEncryptionHelper =
                new _PdfEncryptionHelper();
            const firstKey: Uint8Array =
                createBytes(5, 1);
            const secondKey: Uint8Array =
                createBytes(5, 1);
            const fileId: Uint8Array =
                createBytes(16, 33);
            secondKey[4] ^= 0xff;
            // Act
            const firstResult: Uint8Array =
                helper._computeUserPassword(
                    firstKey,
                    fileId,
                    3
                );
            const secondResult: Uint8Array =
                helper._computeUserPassword(
                    secondKey,
                    fileId,
                    3
                );
            // Assert
            expectBytesDifferent(
                firstResult.subarray(0, 16),
                secondResult.subarray(0, 16)
            );
        });
        it('_computeUserPassword returns revision two output', () => {
            // Arrange
            const helper: _PdfEncryptionHelper =
                new _PdfEncryptionHelper();
            const encryptionKey: Uint8Array =
                createBytes(5, 1);
            const fileId: Uint8Array =
                createBytes(16, 33);
            // Act
            const result: Uint8Array =
                helper._computeUserPassword(
                    encryptionKey,
                    fileId,
                    2
                );
            // Assert
            expect(result.length).toBe(32);
        });
        it('_computeOwnerPassword returns revision two output', () => {
            // Arrange
            const helper: _PdfEncryptionHelper =
                new _PdfEncryptionHelper();
            const userPassword: Uint8Array =
                createBytes(32, 40);
            // Act
            const result: Uint8Array =
                helper._computeOwnerPassword(
                    createBytes(32, 1),
                    userPassword,
                    2,
                    40
                );
            // Assert
            expect(result.length).toBe(32);
            expectBytesDifferent(
                result,
                userPassword
            );
        });
        it('_computeOwnerPassword uses owner byte 31', () => {
            // Arrange
            const helper: _PdfEncryptionHelper =
                new _PdfEncryptionHelper();
            const firstOwner: Uint8Array =
                createBytes(32, 1);
            const secondOwner: Uint8Array =
                createBytes(32, 1);
            const user: Uint8Array =
                createBytes(32, 40);
            secondOwner[31] ^= 0xff;
            // Act
            const firstResult: Uint8Array =
                helper._computeOwnerPassword(
                    firstOwner,
                    user,
                    3,
                    128
                );
            const secondResult: Uint8Array =
                helper._computeOwnerPassword(
                    secondOwner,
                    user,
                    3,
                    128
                );
            // Assert
            expectBytesDifferent(
                firstResult,
                secondResult
            );
        });
        it('_computeOwnerPassword uses user byte 31', () => {
            // Arrange
            const helper: _PdfEncryptionHelper =
                new _PdfEncryptionHelper();
            const owner: Uint8Array =
                createBytes(32, 1);
            const firstUser: Uint8Array =
                createBytes(32, 40);
            const secondUser: Uint8Array =
                createBytes(32, 40);
            secondUser[31] ^= 0xff;
            // Act
            const firstResult: Uint8Array =
                helper._computeOwnerPassword(
                    owner,
                    firstUser,
                    3,
                    128
                );
            const secondResult: Uint8Array =
                helper._computeOwnerPassword(
                    owner,
                    secondUser,
                    3,
                    128
                );
            // Assert
            expectBytesDifferent(
                firstResult,
                secondResult
            );
        });
        it('_computeUserPassword256 dispatches revision six', () => {
            // Arrange
            const helper: _PdfEncryptionHelper =
                new _PdfEncryptionHelper();
            const salt: Uint8Array =
                createBytes(16, 1);
            // Act
            const revisionFive: Uint8Array =
                helper._computeUserPassword256(
                    'password',
                    salt,
                    5
                );
            const revisionSix: Uint8Array =
                helper._computeUserPassword256(
                    'password',
                    salt,
                    6
                );
            // Assert
            expectBytesDifferent(
                revisionFive.subarray(0, 32),
                revisionSix.subarray(0, 32)
            );
            expectBytesEqual(
                revisionSix.subarray(32),
                salt
            );
        });
        it('_computeUserPassword256 revision five keeps salts', () => {
            // Arrange
            const helper: _PdfEncryptionHelper =
                new _PdfEncryptionHelper();
            const salt: Uint8Array =
                createBytes(16, 1);
            // Act
            const result: Uint8Array =
                helper._computeUserPassword256(
                    'password',
                    salt,
                    5
                );
            // Assert
            expect(result.length).toBe(48);
            expectBytesEqual(
                result.subarray(32, 48),
                salt
            );
        });
        it('_computeOwnerPassword256 revision six uses complete U', () => {
            // Arrange
            const helper: _PdfEncryptionHelper =
                new _PdfEncryptionHelper();
            const firstUser: Uint8Array =
                createBytes(48, 1);
            const secondUser: Uint8Array =
                createBytes(48, 1);
            const salt: Uint8Array =
                createBytes(16, 80);
            secondUser[47] ^= 0xff;
            // Act
            const firstResult: Uint8Array =
                helper._computeOwnerPassword256(
                    'password',
                    firstUser,
                    salt,
                    6
                );
            const secondResult: Uint8Array =
                helper._computeOwnerPassword256(
                    'password',
                    secondUser,
                    salt,
                    6
                );
            // Assert
            expectBytesDifferent(
                firstResult.subarray(0, 32),
                secondResult.subarray(0, 32)
            );
            expectBytesEqual(
                firstResult.subarray(32),
                salt
            );
        });
        it('_computeOwnerPassword256 revision five uses complete U', () => {
            // Arrange
            const helper: _PdfEncryptionHelper =
                new _PdfEncryptionHelper();
            const firstUser: Uint8Array =
                createBytes(48, 1);
            const secondUser: Uint8Array =
                createBytes(48, 1);
            const salt: Uint8Array =
                createBytes(16, 80);
            secondUser[47] ^= 0xff;
            // Act
            const firstResult: Uint8Array =
                helper._computeOwnerPassword256(
                    'password',
                    firstUser,
                    salt,
                    5
                );
            const secondResult: Uint8Array =
                helper._computeOwnerPassword256(
                    'password',
                    secondUser,
                    salt,
                    5
                );
            // Assert
            expectBytesDifferent(
                firstResult.subarray(0, 32),
                secondResult.subarray(0, 32)
            );
            expectBytesEqual(
                firstResult.subarray(32),
                salt
            );
        });
        it('_computeUserEncryptionKey revision six differs from five', () => {
            // Arrange
            const helper: _PdfEncryptionHelper =
                new _PdfEncryptionHelper();
            const salt: Uint8Array =
                createBytes(8, 1);
            const key: Uint8Array =
                createBytes(32, 40);
            // Act
            const revisionFive: Uint8Array =
                helper._computeUserEncryptionKey(
                    'password',
                    salt,
                    key,
                    5
                );
            const revisionSix: Uint8Array =
                helper._computeUserEncryptionKey(
                    'password',
                    salt,
                    key,
                    6
                );
            // Assert
            expect(revisionFive.length).toBe(32);
            expect(revisionSix.length).toBe(32);
            expectBytesDifferent(
                revisionFive,
                revisionSix
            );
        });
        it('_computeUserEncryptionKey revision six returns encrypted value', () => {
            // Arrange
            const helper: _PdfEncryptionHelper =
                new _PdfEncryptionHelper();
            const salt: Uint8Array =
                createBytes(8, 1);
            const key: Uint8Array =
                createBytes(32, 40);
            // Act
            const result: Uint8Array =
                helper._computeUserEncryptionKey(
                    'password',
                    salt,
                    key,
                    6
                );
            // Assert
            expect(result.length).toBe(32);
            expectBytesDifferent(
                result,
                key
            );
        });
        it('_computeOwnerEncryptionKey revision six uses final U byte', () => {
            // Arrange
            const helper: _PdfEncryptionHelper =
                new _PdfEncryptionHelper();
            const salt: Uint8Array =
                createBytes(8, 1);
            const firstUser: Uint8Array =
                createBytes(48, 20);
            const secondUser: Uint8Array =
                createBytes(48, 20);
            const key: Uint8Array =
                createBytes(32, 70);
            secondUser[47] ^= 0xff;
            // Act
            const firstResult: Uint8Array =
                helper._computeOwnerEncryptionKey(
                    'password',
                    salt,
                    firstUser,
                    key,
                    6
                );
            const secondResult: Uint8Array =
                helper._computeOwnerEncryptionKey(
                    'password',
                    salt,
                    secondUser,
                    key,
                    6
                );
            // Assert
            expectBytesDifferent(
                firstResult,
                secondResult
            );
        });
        it('_computeOwnerEncryptionKey revision five uses final U byte', () => {
            // Arrange
            const helper: _PdfEncryptionHelper =
                new _PdfEncryptionHelper();
            const salt: Uint8Array =
                createBytes(8, 1);
            const firstUser: Uint8Array =
                createBytes(48, 20);
            const secondUser: Uint8Array =
                createBytes(48, 20);
            const key: Uint8Array =
                createBytes(32, 70);
            secondUser[47] ^= 0xff;
            // Act
            const firstResult: Uint8Array =
                helper._computeOwnerEncryptionKey(
                    'password',
                    salt,
                    firstUser,
                    key,
                    5
                );
            const secondResult: Uint8Array =
                helper._computeOwnerEncryptionKey(
                    'password',
                    salt,
                    secondUser,
                    key,
                    5
                );
            // Assert
            expectBytesDifferent(
                firstResult,
                secondResult
            );
        });
        it('_computeUserPassword256Rev6 keeps exact salts', () => {
            // Arrange
            const helper: _PdfEncryptionHelper =
                new _PdfEncryptionHelper();
            const salt: Uint8Array =
                createBytes(16, 1);
            // Act
            const result: Uint8Array =
                helper._computeUserPassword256Rev6(
                    'password',
                    salt
                );
            // Assert
            expect(result.length).toBe(48);
            expectBytesEqual(
                result.subarray(32, 48),
                salt
            );
        });
        it('_computeOwnerPassword256Rev6 keeps exact salts', () => {
            // Arrange
            const helper: _PdfEncryptionHelper =
                new _PdfEncryptionHelper();
            const user: Uint8Array =
                createBytes(48, 20);
            const salt: Uint8Array =
                createBytes(16, 1);
            // Act
            const result: Uint8Array =
                helper._computeOwnerPassword256Rev6(
                    'password',
                    user,
                    salt
                );
            // Assert
            expect(result.length).toBe(48);
            expectBytesEqual(
                result.subarray(32, 48),
                salt
            );
        });
        it('_computeOwnerPassword256Rev6 uses complete U', () => {
            // Arrange
            const helper: _PdfEncryptionHelper =
                new _PdfEncryptionHelper();
            const firstUser: Uint8Array =
                createBytes(48, 20);
            const secondUser: Uint8Array =
                createBytes(48, 20);
            const salt: Uint8Array =
                createBytes(16, 1);
            secondUser[47] ^= 0xff;
            // Act
            const firstResult: Uint8Array =
                helper._computeOwnerPassword256Rev6(
                    'password',
                    firstUser,
                    salt
                );
            const secondResult: Uint8Array =
                helper._computeOwnerPassword256Rev6(
                    'password',
                    secondUser,
                    salt
                );
            // Assert
            expectBytesDifferent(
                firstResult.subarray(0, 32),
                secondResult.subarray(0, 32)
            );
        });
        it('_generateKey uses revision four metadata marker', () => {
            // Arrange
            const helper: _PdfEncryptionHelper =
                new _PdfEncryptionHelper();
            const id: Uint8Array =
                createBytes(16, 1);
            const password: Uint8Array =
                createBytes(8, 20);
            const owner: Uint8Array =
                createBytes(32, 40);
            // Act
            const encryptedMetadata: Uint8Array =
                helper._generateKey(
                    id,
                    password,
                    owner,
                    -4,
                    4,
                    128,
                    true
                );
            const clearMetadata: Uint8Array =
                helper._generateKey(
                    id,
                    password,
                    owner,
                    -4,
                    4,
                    128,
                    false
                );
            // Assert
            expect(encryptedMetadata.length).toBe(16);
            expect(clearMetadata.length).toBe(16);
            expectBytesDifferent(
                encryptedMetadata,
                clearMetadata
            );
        });
        it('_generateKey ignores metadata flag before revision four', () => {
            // Arrange
            const helper: _PdfEncryptionHelper =
                new _PdfEncryptionHelper();
            const id: Uint8Array =
                createBytes(16, 1);
            const password: Uint8Array =
                createBytes(8, 20);
            const owner: Uint8Array =
                createBytes(32, 40);
            // Act
            const encryptedMetadata: Uint8Array =
                helper._generateKey(
                    id,
                    password,
                    owner,
                    -4,
                    3,
                    128,
                    true
                );
            const clearMetadata: Uint8Array =
                helper._generateKey(
                    id,
                    password,
                    owner,
                    -4,
                    3,
                    128,
                    false
                );
            // Assert
            expectBytesEqual(
                encryptedMetadata,
                clearMetadata
            );
        });
        it('_generateKey uses all 32 password bytes', () => {
            // Arrange
            const helper: _PdfEncryptionHelper =
                new _PdfEncryptionHelper();
            const id: Uint8Array =
                createBytes(16, 1);
            const firstPassword: Uint8Array =
                createBytes(32, 20);
            const secondPassword: Uint8Array =
                createBytes(32, 20);
            const owner: Uint8Array =
                createBytes(32, 40);
            secondPassword[31] ^= 0xff;
            // Act
            const firstResult: Uint8Array =
                helper._generateKey(
                    id,
                    firstPassword,
                    owner,
                    -4,
                    3,
                    128,
                    true
                );
            const secondResult: Uint8Array =
                helper._generateKey(
                    id,
                    secondPassword,
                    owner,
                    -4,
                    3,
                    128,
                    true
                );
            // Assert
            expectBytesDifferent(
                firstResult,
                secondResult
            );
        });
        it('_generateKey uses all owner bytes', () => {
            // Arrange
            const helper: _PdfEncryptionHelper =
                new _PdfEncryptionHelper();
            const id: Uint8Array =
                createBytes(16, 1);
            const password: Uint8Array =
                createBytes(32, 20);
            const firstOwner: Uint8Array =
                createBytes(32, 40);
            const secondOwner: Uint8Array =
                createBytes(32, 40);
            secondOwner[31] ^= 0xff;
            // Act
            const firstResult: Uint8Array =
                helper._generateKey(
                    id,
                    password,
                    firstOwner,
                    -4,
                    3,
                    128,
                    true
                );
            const secondResult: Uint8Array =
                helper._generateKey(
                    id,
                    password,
                    secondOwner,
                    -4,
                    3,
                    128,
                    true
                );
            // Assert
            expectBytesDifferent(
                firstResult,
                secondResult
            );
        });
        it('_generateKey uses all file identifier bytes', () => {
            // Arrange
            const helper: _PdfEncryptionHelper =
                new _PdfEncryptionHelper();
            const firstId: Uint8Array =
                createBytes(16, 1);
            const secondId: Uint8Array =
                createBytes(16, 1);
            const password: Uint8Array =
                createBytes(32, 20);
            const owner: Uint8Array =
                createBytes(32, 40);
            secondId[15] ^= 0xff;
            // Act
            const firstResult: Uint8Array =
                helper._generateKey(
                    firstId,
                    password,
                    owner,
                    -4,
                    3,
                    128,
                    true
                );
            const secondResult: Uint8Array =
                helper._generateKey(
                    secondId,
                    password,
                    owner,
                    -4,
                    3,
                    128,
                    true
                );
            // Assert
            expectBytesDifferent(
                firstResult,
                secondResult
            );
        });
        it('_generateKey returns exact 40 bit result length', () => {
            // Arrange
            const helper: _PdfEncryptionHelper =
                new _PdfEncryptionHelper();
            const id: Uint8Array =
                createBytes(16, 1);
            const password: Uint8Array =
                createBytes(32, 20);
            const owner: Uint8Array =
                createBytes(32, 40);
            // Act
            const result: Uint8Array =
                helper._generateKey(
                    id,
                    password,
                    owner,
                    -4,
                    2,
                    40,
                    true
                );
            // Assert
            expect(result.length).toBe(5);
        });
        it('_generateKey returns exact 128 bit result length', () => {
            // Arrange
            const helper: _PdfEncryptionHelper =
                new _PdfEncryptionHelper();
            const id: Uint8Array =
                createBytes(16, 1);
            const password: Uint8Array =
                createBytes(32, 20);
            const owner: Uint8Array =
                createBytes(32, 40);
            // Act
            const result: Uint8Array =
                helper._generateKey(
                    id,
                    password,
                    owner,
                    -4,
                    3,
                    128,
                    true
                );
            // Assert
            expect(result.length).toBe(16);
        });
        it('_generateKey uses default password when password is null', () => {
            // Arrange
            const helper: _PdfEncryptionHelper =
                new _PdfEncryptionHelper();
            const id: Uint8Array =
                createBytes(16, 1);
            const owner: Uint8Array =
                createBytes(32, 40);
            // Act
            const nullPasswordResult: Uint8Array =
                helper._generateKey(
                    id,
                    null,
                    owner,
                    -4,
                    2,
                    40,
                    true
                );
            const emptyPasswordResult: Uint8Array =
                helper._generateKey(
                    id,
                    new Uint8Array(0),
                    owner,
                    -4,
                    2,
                    40,
                    true
                );
            // Assert
            expectBytesEqual(
                nullPasswordResult,
                emptyPasswordResult
            );
        });
    });
});
describe('_PdfEncryptor constructor guards and defaults', () => {
    it('accepts undefined password as the empty password', () => {
        // Arrange
        const harness = createRevisionTwoDictionary(
            new Uint8Array(0)
        );
        // Act
        const encryptor: _PdfEncryptor = new _PdfEncryptor(
            harness.dictionary,
            harness.id,
            undefined
        );
        // Assert
        expect(encryptor._filterName).toBe('Standard');
        expect(encryptor._algorithm).toBe(1);
        expect(encryptor._isUserPassword).toBe(true);
        expectBytesEqual(
            encryptor._encryptionKey,
            harness.encryptionKey
        );
    });
    it('accepts null password as the empty password', () => {
        // Arrange
        const harness = createRevisionTwoDictionary(
            new Uint8Array(0)
        );
        // Act
        const encryptor: _PdfEncryptor = new _PdfEncryptor(
            harness.dictionary,
            harness.id,
            null as any
        );
        // Assert
        expect(encryptor._filterName).toBe('Standard');
        expect(encryptor._algorithm).toBe(1);
        expect(encryptor._isUserPassword).toBe(true);
        expectBytesEqual(
            encryptor._encryptionKey,
            harness.encryptionKey
        );
    });
    it('throws exact error for non Standard filter', () => {
        // Arrange
        const harness = createRevisionTwoDictionary(
            new Uint8Array(0)
        );
        harness.dictionary.update(
            'Filter',
            _PdfName.get('Custom')
        );
        const expectedError: FormatError = new FormatError(
            'unknown encryption method'
        );
        // Act
        const action: () => _PdfEncryptor = () => {
            return new _PdfEncryptor(
                harness.dictionary,
                harness.id,
                ''
            );
        };
        // Assert
        expect(action).toThrow(expectedError);
    });
    it('rejects algorithm zero', () => {
        // Arrange
        const harness = createRevisionTwoDictionary(
            new Uint8Array(0)
        );
        harness.dictionary.update('V', 0);
        const expectedError: FormatError = new FormatError(
            'unsupported encryption algorithm'
        );
        // Act
        const action: () => _PdfEncryptor = () => {
            return new _PdfEncryptor(
                harness.dictionary,
                harness.id,
                ''
            );
        };
        // Assert
        expect(action).toThrow(expectedError);
    });
    it('rejects algorithm three', () => {
        // Arrange
        const harness = createRevisionTwoDictionary(
            new Uint8Array(0)
        );
        harness.dictionary.update('V', 3);
        const expectedError: FormatError = new FormatError(
            'unsupported encryption algorithm'
        );
        // Act
        const action: () => _PdfEncryptor = () => {
            return new _PdfEncryptor(
                harness.dictionary,
                harness.id,
                ''
            );
        };
        // Assert
        expect(action).toThrow(expectedError);
    });
    it('rejects algorithm seven', () => {
        // Arrange
        const harness = createRevisionTwoDictionary(
            new Uint8Array(0)
        );
        harness.dictionary.update('V', 7);
        const expectedError: FormatError = new FormatError(
            'unsupported encryption algorithm'
        );
        // Act
        const action: () => _PdfEncryptor = () => {
            return new _PdfEncryptor(
                harness.dictionary,
                harness.id,
                ''
            );
        };
        // Assert
        expect(action).toThrow(expectedError);
    });
    it('rejects non integer algorithm', () => {
        // Arrange
        const harness = createRevisionTwoDictionary(
            new Uint8Array(0)
        );
        harness.dictionary.update('V', 1.5);
        const expectedError: FormatError = new FormatError(
            'unsupported encryption algorithm'
        );
        // Act
        const action: () => _PdfEncryptor = () => {
            return new _PdfEncryptor(
                harness.dictionary,
                harness.id,
                ''
            );
        };
        // Assert
        expect(action).toThrow(expectedError);
    });
    it('accepts algorithm one', () => {
        // Arrange
        const harness = createRevisionTwoDictionary(
            new Uint8Array(0)
        );
        harness.dictionary.update('V', 1);
        // Act
        const encryptor: _PdfEncryptor = new _PdfEncryptor(
            harness.dictionary,
            harness.id,
            ''
        );
        // Assert
        expect(encryptor._algorithm).toBe(1);
    });
    it('accepts algorithm two', () => {
        // Arrange
        const harness = createRevisionTwoDictionary(
            new Uint8Array(0)
        );
        harness.dictionary.update('V', 2);
        // Act
        const encryptor: _PdfEncryptor = new _PdfEncryptor(
            harness.dictionary,
            harness.id,
            ''
        );
        // Assert
        expect(encryptor._algorithm).toBe(2);
    });
    it('uses 40 bits when algorithm one has no Length', () => {
        // Arrange
        const harness = createRevisionTwoDictionary(
            new Uint8Array(0),
            false
        );
        // Act
        const encryptor: _PdfEncryptor = new _PdfEncryptor(
            harness.dictionary,
            harness.id,
            ''
        );
        // Assert
        expect(encryptor._algorithm).toBe(1);
        expect(encryptor._encryptionKey.length).toBe(5);
        expectBytesEqual(
            encryptor._encryptionKey,
            harness.encryptionKey
        );
    });
    it('uses 40 bits when algorithm two has no Length', () => {
        // Arrange
        const harness = createRevisionTwoDictionary(
            new Uint8Array(0),
            false
        );
        harness.dictionary.update('V', 2);
        // Act
        const encryptor: _PdfEncryptor = new _PdfEncryptor(
            harness.dictionary,
            harness.id,
            ''
        );
        // Assert
        expect(encryptor._algorithm).toBe(2);
        expect(encryptor._encryptionKey.length).toBe(5);
    });
    it('rejects key length below 40', () => {
        // Arrange
        const harness = createRevisionTwoDictionary(
            new Uint8Array(0)
        );
        harness.dictionary.update('Length', 39);
        const expectedError: FormatError = new FormatError(
            'invalid key length'
        );
        // Act
        const action: () => _PdfEncryptor = () => {
            return new _PdfEncryptor(
                harness.dictionary,
                harness.id,
                ''
            );
        };
        // Assert
        expect(action).toThrow(expectedError);
    });
    it('accepts exact 40 bit key boundary', () => {
        // Arrange
        const harness = createRevisionTwoDictionary(
            new Uint8Array(0)
        );
        harness.dictionary.update('Length', 40);
        // Act
        const encryptor: _PdfEncryptor = new _PdfEncryptor(
            harness.dictionary,
            harness.id,
            ''
        );
        // Assert
        expect(encryptor._algorithm).toBe(1);
        expect(encryptor._encryptionKey.length).toBe(5);
    });
    it('accepts key length divisible by eight', () => {
        // Arrange
        const harness = createRevisionTwoDictionary(
            new Uint8Array(0)
        );
        harness.dictionary.update('Length', 48);
        const helper: _PdfEncryptionHelper =
            new _PdfEncryptionHelper();
        const idBytes: Uint8Array = createBytes(16, 1);
        const passwordBytes: Uint8Array = new Uint8Array(0);
        const ownerEntry: Uint8Array =
            helper._computeOwnerPassword(
                new Uint8Array(0),
                passwordBytes,
                2,
                48
            );
        const encryptionKey: Uint8Array =
            helper._generateKey(
                idBytes,
                passwordBytes,
                ownerEntry,
                -4,
                2,
                48,
                false
            );
        const userEntry: Uint8Array =
            helper._computeUserPassword(
                encryptionKey,
                idBytes,
                2
            );
        harness.dictionary.update(
            'O',
            bytesToString(ownerEntry)
        );
        harness.dictionary.update(
            'U',
            bytesToString(userEntry)
        );
        // Act
        const encryptor: _PdfEncryptor = new _PdfEncryptor(
            harness.dictionary,
            harness.id,
            ''
        );
        // Assert
        expect(encryptor._encryptionKey.length).toBe(6);
        expectBytesEqual(
            encryptor._encryptionKey,
            encryptionKey
        );
    });
    it('rejects key length not divisible by eight', () => {
        // Arrange
        const harness = createRevisionTwoDictionary(
            new Uint8Array(0)
        );
        harness.dictionary.update('Length', 41);
        const expectedError: FormatError = new FormatError(
            'invalid key length'
        );
        // Act
        const action: () => _PdfEncryptor = () => {
            return new _PdfEncryptor(
                harness.dictionary,
                harness.id,
                ''
            );
        };
        // Assert
        expect(action).toThrow(expectedError);
    });
    it('rejects fractional key length', () => {
        // Arrange
        const harness = createRevisionTwoDictionary(
            new Uint8Array(0)
        );
        harness.dictionary.update('Length', 40.5);
        const expectedError: FormatError = new FormatError(
            'invalid key length'
        );
        // Act
        const action: () => _PdfEncryptor = () => {
            return new _PdfEncryptor(
                harness.dictionary,
                harness.id,
                ''
            );
        };
        // Assert
        expect(action).toThrow(expectedError);
    });
    it('throws exact error for empty incorrect password', () => {
        // Arrange
        const harness = createRevisionTwoDictionary(
            createBytes(4, 20)
        );
        // Act
        const action: () => _PdfEncryptor = () => {
            return new _PdfEncryptor(
                harness.dictionary,
                harness.id,
                ''
            );
        };
        // Assert
        expect(action).toThrowError(
            Error,
            'Cannot open an encrypted document. ' +
            'The password is invalid.'
        );
    });
});