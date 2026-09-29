import { _AdvancedEncryption128Cipher, _AdvancedEncryption256Cipher } from '../src/pdf/core/security/encryptors/advance-cipher';
import { _AdvancedEncryption, _BasicEncryption, _EncryptionKey } from '../src/pdf/core/security/encryptors/basic-encryption';
import { _Sha256 } from '../src/pdf/core/security/encryptors/secureHash-algorithm256';
import { _Sha512 } from '../src/pdf/core/security/encryptors/secureHash-algorithm512';
describe('_EncryptionKey SHA-256 getter mutation coverage', () => {
    it('should create and return a SHA-256 instance when cached value is undefined', () => {
        // Arrange
        const encryption: _BasicEncryption = new _BasicEncryption();
        encryption._sha256Obj = undefined;
        // Act
        const result: _Sha256 = encryption._sha256;
        // Assert
        expect(result).toBeDefined();
        expect(result instanceof _Sha256).toBe(true);
        expect(encryption._sha256Obj).toBe(result);
    });
    it('should create and return a SHA-256 instance when cached value is null', () => {
        // Arrange
        const encryption: _BasicEncryption = new _BasicEncryption();
        encryption._sha256Obj = null;
        // Act
        const result: _Sha256 = encryption._sha256;
        // Assert
        expect(result).toBeDefined();
        expect(result instanceof _Sha256).toBe(true);
        expect(encryption._sha256Obj).toBe(result);
        expect(encryption._sha256Obj).not.toBeNull();
    });
    it('should return the existing SHA-256 instance without replacing it', () => {
        // Arrange
        const encryption: _BasicEncryption = new _BasicEncryption();
        const existingHash: _Sha256 = new _Sha256();
        encryption._sha256Obj = existingHash;
        // Act
        const result: _Sha256 = encryption._sha256;
        // Assert
        expect(result).toBe(existingHash);
        expect(encryption._sha256Obj).toBe(existingHash);
    });
});
describe('_EncryptionKey SHA-512 getter mutation coverage', () => {
    it('should create and return a SHA-512 instance when cached value is undefined', () => {
        // Arrange
        const encryption: _BasicEncryption = new _BasicEncryption();
        encryption._sha512Obj = undefined;
        // Act
        const result: _Sha512 = encryption._sha512;
        // Assert
        expect(result).toBeDefined();
        expect(result instanceof _Sha512).toBe(true);
        expect(encryption._sha512Obj).toBe(result);
    });
    it('should create and return a SHA-512 instance when cached value is null', () => {
        // Arrange
        const encryption: _BasicEncryption = new _BasicEncryption();
        encryption._sha512Obj = null;
        // Act
        const result: _Sha512 = encryption._sha512;
        // Assert
        expect(result).toBeDefined();
        expect(result instanceof _Sha512).toBe(true);
        expect(encryption._sha512Obj).toBe(result);
        expect(encryption._sha512Obj).not.toBeNull();
    });
    it('should return the existing SHA-512 instance without replacing it', () => {
        // Arrange
        const encryption: _BasicEncryption = new _BasicEncryption();
        const existingHash: _Sha512 = new _Sha512();
        encryption._sha512Obj = existingHash;
        // Act
        const result: _Sha512 = encryption._sha512;
        // Assert
        expect(result).toBe(existingHash);
        expect(encryption._sha512Obj).toBe(existingHash);
    });
});
describe('_BasicEncryption constructor mutation coverage', () => {
    it('should construct a BasicEncryption object with inherited hash getters', () => {
        // Arrange
        const encryption: _BasicEncryption = new _BasicEncryption();
        // Act
        const sha256: _Sha256 = encryption._sha256;
        const sha512: _Sha512 = encryption._sha512;
        // Assert
        expect(encryption instanceof _BasicEncryption).toBe(true);
        expect(encryption instanceof _EncryptionKey).toBe(true);
        expect(sha256 instanceof _Sha256).toBe(true);
        expect(sha512 instanceof _Sha512).toBe(true);
    });
});
describe('_AdvancedEncryption constructor mutation coverage', () => {
    it('should construct an AdvancedEncryption object with inherited hash getters', () => {
        // Arrange
        const encryption: _AdvancedEncryption = new _AdvancedEncryption();
        // Act
        const sha256: _Sha256 = encryption._sha256;
        const sha512: _Sha512 = encryption._sha512;
        // Assert
        expect(encryption instanceof _AdvancedEncryption).toBe(true);
        expect(encryption instanceof _EncryptionKey).toBe(true);
        expect(sha256 instanceof _Sha256).toBe(true);
        expect(sha512 instanceof _Sha512).toBe(true);
    });
});
describe('_AdvancedEncryption owner-password mutation coverage', () => {
    it('should return true and hash owner data using the correct offsets', () => {
        // Arrange
        const encryption: _AdvancedEncryption = new _AdvancedEncryption();
        const password: Uint8Array = new Uint8Array([10, 11, 12]);
        const ownerValidationSalt: Uint8Array =
            new Uint8Array([20, 21, 22, 23, 24, 25, 26, 27]);
        const userBytes: Uint8Array = new Uint8Array(48);
        const ownerPassword: Uint8Array = new Uint8Array(32);
        for (let index: number = 0; index < userBytes.length; index++) {
            userBytes[index] = index + 40;
        }
        for (let index: number = 0; index < ownerPassword.length; index++) {
            ownerPassword[index] = index + 1;
        }
        const originalHash:
            (passwordData: Uint8Array,
             inputData: Uint8Array,
             currentUserBytes: Uint8Array) => Uint8Array =
            encryption._hash;
        let receivedPassword: Uint8Array = new Uint8Array(0);
        let receivedInput: Uint8Array = new Uint8Array(0);
        let receivedUserBytes: Uint8Array = new Uint8Array(0);
        encryption._hash = (
            passwordData: Uint8Array,
            inputData: Uint8Array,
            currentUserBytes: Uint8Array
        ): Uint8Array => {
            receivedPassword = passwordData;
            receivedInput = inputData;
            receivedUserBytes = currentUserBytes;
            return ownerPassword;
        };
        // Act
        const result: boolean = encryption._checkOwnerPassword(
            password,
            ownerValidationSalt,
            userBytes,
            ownerPassword
        );
        encryption._hash = originalHash;
        // Assert
        expect(result).toBe(true);
        expect(receivedPassword).toBe(password);
        expect(receivedUserBytes).toBe(userBytes);
        expect(receivedInput.length).toBe(password.length + 56);
        expect(receivedInput[0]).toBe(10);
        expect(receivedInput[1]).toBe(11);
        expect(receivedInput[2]).toBe(12);
        expect(receivedInput[password.length]).toBe(20);
        expect(receivedInput[password.length + 7]).toBe(27);
        expect(
            receivedInput[password.length + ownerValidationSalt.length]
        ).toBe(40);
        expect(receivedInput[receivedInput.length - 1]).toBe(87);
    });
    it('should return false when the calculated owner hash does not match', () => {
        // Arrange
        const encryption: _AdvancedEncryption = new _AdvancedEncryption();
        const password: Uint8Array = new Uint8Array([1, 2]);
        const validationSalt: Uint8Array =
            new Uint8Array([3, 4, 5, 6, 7, 8, 9, 10]);
        const userBytes: Uint8Array = new Uint8Array(48);
        const calculatedHash: Uint8Array = new Uint8Array(32);
        const ownerPassword: Uint8Array = new Uint8Array(32);
        calculatedHash[0] = 35;
        ownerPassword[0] = 36;
        const originalHash:
            (passwordData: Uint8Array,
             inputData: Uint8Array,
             currentUserBytes: Uint8Array) => Uint8Array =
            encryption._hash;
        encryption._hash = (
            _passwordData: Uint8Array,
            _inputData: Uint8Array,
            _currentUserBytes: Uint8Array
        ): Uint8Array => {
            return calculatedHash;
        };
        // Act
        const result: boolean = encryption._checkOwnerPassword(
            password,
            validationSalt,
            userBytes,
            ownerPassword
        );
        encryption._hash = originalHash;
        // Assert
        expect(result).toBe(false);
    });
});
describe('_AdvancedEncryption user-password mutation coverage', () => {
    it('should return true and pass an empty user-byte array to hash', () => {
        // Arrange
        const encryption: _AdvancedEncryption = new _AdvancedEncryption();
        const password: Uint8Array = new Uint8Array([10, 11, 12]);
        const validationSalt: Uint8Array =
            new Uint8Array([20, 21, 22, 23, 24, 25, 26, 27]);
        const userPassword: Uint8Array = new Uint8Array(32);
        for (let index: number = 0; index < userPassword.length; index++) {
            userPassword[index] = index + 1;
        }
        const originalHash:
            (passwordData: Uint8Array,
             inputData: Uint8Array,
             currentUserBytes: Uint8Array) => Uint8Array =
            encryption._hash;
        let receivedInput: Uint8Array = new Uint8Array(0);
        let receivedUserBytes: Uint8Array = new Uint8Array([255]);
        encryption._hash = (
            _passwordData: Uint8Array,
            inputData: Uint8Array,
            currentUserBytes: Uint8Array
        ): Uint8Array => {
            receivedInput = inputData;
            receivedUserBytes = currentUserBytes;
            return userPassword;
        };
        // Act
        const result: boolean = encryption._checkUserPassword(
            password,
            validationSalt,
            userPassword
        );
        encryption._hash = originalHash;
        // Assert
        expect(result).toBe(true);
        expect(receivedUserBytes.length).toBe(0);
        expect(receivedInput.length).toBe(password.length + 8);
        expect(receivedInput[0]).toBe(10);
        expect(receivedInput[2]).toBe(12);
        expect(receivedInput[password.length]).toBe(20);
        expect(receivedInput[receivedInput.length - 1]).toBe(27);
    });
    it('should return false when the calculated user hash does not match', () => {
        // Arrange
        const encryption: _AdvancedEncryption = new _AdvancedEncryption();
        const password: Uint8Array = new Uint8Array([1]);
        const validationSalt: Uint8Array = new Uint8Array(8);
        const calculatedHash: Uint8Array = new Uint8Array(32);
        const userPassword: Uint8Array = new Uint8Array(32);
        calculatedHash[0] = 1;
        userPassword[0] = 2;
        const originalHash:
            (passwordData: Uint8Array,
             inputData: Uint8Array,
             currentUserBytes: Uint8Array) => Uint8Array =
            encryption._hash;
        encryption._hash = (
            _passwordData: Uint8Array,
            _inputData: Uint8Array,
            _currentUserBytes: Uint8Array
        ): Uint8Array => {
            return calculatedHash;
        };
        // Act
        const result: boolean = encryption._checkUserPassword(
            password,
            validationSalt,
            userPassword
        );
        encryption._hash = originalHash;
        // Assert
        expect(result).toBe(false);
    });
});
describe('_AdvancedEncryption user-key mutation coverage', () => {
    it('should decrypt user data with encryption disabled and a zero initialization vector', () => {
        // Arrange
        const encryption: _AdvancedEncryption = new _AdvancedEncryption();
        const password: Uint8Array = new Uint8Array([1, 2, 3]);
        const userKeySalt: Uint8Array =
            new Uint8Array([4, 5, 6, 7, 8, 9, 10, 11]);
        const userEncryption: Uint8Array = new Uint8Array(32);
        const encryptionKey: Uint8Array = new Uint8Array(32);
        for (let index: number = 0; index < userEncryption.length; index++) {
            userEncryption[index] = index + 20;
            encryptionKey[index] = index + 70;
        }
        const originalHash:
            (passwordData: Uint8Array,
             inputData: Uint8Array,
             currentUserBytes: Uint8Array) => Uint8Array =
            encryption._hash;
        let receivedUserBytes: Uint8Array = new Uint8Array([255]);
        encryption._hash = (
            _passwordData: Uint8Array,
            _inputData: Uint8Array,
            currentUserBytes: Uint8Array
        ): Uint8Array => {
            receivedUserBytes = currentUserBytes;
            return encryptionKey;
        };
        const expectedCipher: _AdvancedEncryption256Cipher =
            new _AdvancedEncryption256Cipher(encryptionKey);
        const expectedResult: Uint8Array = expectedCipher._decryptBlock(
            userEncryption,
            false,
            new Uint8Array(16)
        );
        // Act
        const result: Uint8Array = encryption._getUserKey(
            password,
            userKeySalt,
            userEncryption
        );
        encryption._hash = originalHash;
        // Assert
        expect(receivedUserBytes.length).toBe(0);
        expect(Array.from(result)).toEqual(Array.from(expectedResult));
    });
});
describe('_AdvancedEncryption iterative-hash boundary mutation coverage', () => {
    it('should execute exactly 64 encryption iterations for a zero trailing byte', () => {
        // Arrange
        const encryption: _AdvancedEncryption = new _AdvancedEncryption();
        const password: Uint8Array = new Uint8Array([1]);
        const input: Uint8Array = new Uint8Array([2]);
        const userBytes: Uint8Array = new Uint8Array(0);
        const sha256: _Sha256 = encryption._sha256;
        const sha512: _Sha512 = encryption._sha512;
        const originalSha256Hash = sha256._hash;
        const originalSha512Hash = sha512._hash;
        const originalEncrypt = _AdvancedEncryption128Cipher.prototype._encrypt;
        let encryptionCount: number = 0;
        sha256._hash = (
            _input: Uint8Array,
            _offset: number,
            _length: number
        ): Uint8Array => {
            return new Uint8Array(32);
        };
        sha512._hash = (
            _input: Uint8Array,
            _offset: number,
            _length: number,
            _isMode384?: boolean
        ): Uint8Array => {
            return new Uint8Array(64);
        };
        _AdvancedEncryption128Cipher.prototype._encrypt = function (
            _inputData: Uint8Array,
            _initializationVector: Uint8Array
        ): Uint8Array {
            encryptionCount++;
            return new Uint8Array(16);
        };
        // Act
        const result: Uint8Array = encryption._hash(
            password,
            input,
            userBytes
        );
        sha256._hash = originalSha256Hash;
        sha512._hash = originalSha512Hash;
        _AdvancedEncryption128Cipher.prototype._encrypt = originalEncrypt;
        // Assert
        expect(encryptionCount).toBe(64);
        expect(result.length).toBe(32);
    });
    it('should stop when the trailing encrypted byte equals the loop boundary', () => {
        // Arrange
        const encryption: _AdvancedEncryption = new _AdvancedEncryption();
        const password: Uint8Array = new Uint8Array([1]);
        const input: Uint8Array = new Uint8Array([2]);
        const userBytes: Uint8Array = new Uint8Array(0);
        const sha256: _Sha256 = encryption._sha256;
        const sha512: _Sha512 = encryption._sha512;
        const originalSha256Hash = sha256._hash;
        const originalSha512Hash = sha512._hash;
        const originalEncrypt = _AdvancedEncryption128Cipher.prototype._encrypt;
        let encryptionCount: number = 0;
        sha256._hash = (
            _input: Uint8Array,
            _offset: number,
            _length: number
        ): Uint8Array => {
            return new Uint8Array(32);
        };
        sha512._hash = (
            _input: Uint8Array,
            _offset: number,
            _length: number,
            _isMode384?: boolean
        ): Uint8Array => {
            return new Uint8Array(64);
        };
        _AdvancedEncryption128Cipher.prototype._encrypt = function (
            _inputData: Uint8Array,
            _initializationVector: Uint8Array
        ): Uint8Array {
            encryptionCount++;
            const encryptedData: Uint8Array = new Uint8Array(16);
            if (encryptionCount === 64) {
                encryptedData[15] = 32;
            }
            return encryptedData;
        };
        // Act
        const result: Uint8Array = encryption._hash(
            password,
            input,
            userBytes
        );
        sha256._hash = originalSha256Hash;
        sha512._hash = originalSha512Hash;
        _AdvancedEncryption128Cipher.prototype._encrypt = originalEncrypt;
        // Assert
        expect(encryptionCount).toBe(64);
        expect(result.length).toBe(32);
    });
    it('should use SHA-512 when encrypted remainder is two', () => {
        // Arrange
        const encryption: _AdvancedEncryption = new _AdvancedEncryption();
        const password: Uint8Array = new Uint8Array([1]);
        const input: Uint8Array = new Uint8Array([2]);
        const userBytes: Uint8Array = new Uint8Array(0);
        const sha256: _Sha256 = encryption._sha256;
        const sha512: _Sha512 = encryption._sha512;
        const originalSha256Hash = sha256._hash;
        const originalSha512Hash = sha512._hash;
        const originalEncrypt = _AdvancedEncryption128Cipher.prototype._encrypt;
        let sha512Count: number = 0;
        let sha384Count: number = 0;
        sha256._hash = (
            _input: Uint8Array,
            _offset: number,
            _length: number
        ): Uint8Array => {
            return new Uint8Array(32);
        };
        sha512._hash = (
            _input: Uint8Array,
            _offset: number,
            _length: number,
            isMode384?: boolean
        ): Uint8Array => {
            if (isMode384 === true) {
                sha384Count++;
            } else {
                sha512Count++;
            }
            return new Uint8Array(64);
        };
        _AdvancedEncryption128Cipher.prototype._encrypt = function (
            _inputData: Uint8Array,
            _initializationVector: Uint8Array
        ): Uint8Array {
            const encryptedData: Uint8Array = new Uint8Array(16);
            encryptedData[0] = 2;
            return encryptedData;
        };
        // Act
        const result: Uint8Array = encryption._hash(
            password,
            input,
            userBytes
        );
        sha256._hash = originalSha256Hash;
        sha512._hash = originalSha512Hash;
        _AdvancedEncryption128Cipher.prototype._encrypt = originalEncrypt;
        // Assert
        expect(sha512Count).toBe(64);
        expect(sha384Count).toBe(0);
        expect(result.length).toBe(32);
    });
    it('should use SHA-384 when encrypted remainder is one', () => {
        // Arrange
        const encryption: _AdvancedEncryption = new _AdvancedEncryption();
        const password: Uint8Array = new Uint8Array([1]);
        const input: Uint8Array = new Uint8Array([2]);
        const userBytes: Uint8Array = new Uint8Array(0);
        const sha256: _Sha256 = encryption._sha256;
        const sha512: _Sha512 = encryption._sha512;
        const originalSha256Hash = sha256._hash;
        const originalSha512Hash = sha512._hash;
        const originalEncrypt = _AdvancedEncryption128Cipher.prototype._encrypt;
        let sha512Count: number = 0;
        let sha384Count: number = 0;
        sha256._hash = (
            _input: Uint8Array,
            _offset: number,
            _length: number
        ): Uint8Array => {
            return new Uint8Array(32);
        };
        sha512._hash = (
            _input: Uint8Array,
            _offset: number,
            _length: number,
            isMode384?: boolean
        ): Uint8Array => {
            if (isMode384 === true) {
                sha384Count++;
            } else {
                sha512Count++;
            }
            return new Uint8Array(64);
        };
        _AdvancedEncryption128Cipher.prototype._encrypt = function (
            _inputData: Uint8Array,
            _initializationVector: Uint8Array
        ): Uint8Array {
            const encryptedData: Uint8Array = new Uint8Array(16);
            encryptedData[0] = 1;
            return encryptedData;
        };
        // Act
        const result: Uint8Array = encryption._hash(
            password,
            input,
            userBytes
        );
        sha256._hash = originalSha256Hash;
        sha512._hash = originalSha512Hash;
        _AdvancedEncryption128Cipher.prototype._encrypt = originalEncrypt;
        // Assert
        expect(sha384Count).toBe(64);
        expect(sha512Count).toBe(0);
        expect(result.length).toBe(32);
    });
    it('should use SHA-256 when encrypted remainder is zero', () => {
        // Arrange
        const encryption: _AdvancedEncryption = new _AdvancedEncryption();
        const password: Uint8Array = new Uint8Array([1]);
        const input: Uint8Array = new Uint8Array([2]);
        const userBytes: Uint8Array = new Uint8Array(0);
        const sha256: _Sha256 = encryption._sha256;
        const sha512: _Sha512 = encryption._sha512;
        const originalSha256Hash = sha256._hash;
        const originalSha512Hash = sha512._hash;
        const originalEncrypt = _AdvancedEncryption128Cipher.prototype._encrypt;
        let sha256Count: number = 0;
        let sha512Count: number = 0;
        sha256._hash = (
            _input: Uint8Array,
            _offset: number,
            _length: number
        ): Uint8Array => {
            sha256Count++;
            return new Uint8Array(32);
        };
        sha512._hash = (
            _input: Uint8Array,
            _offset: number,
            _length: number,
            _isMode384?: boolean
        ): Uint8Array => {
            sha512Count++;
            return new Uint8Array(64);
        };
        _AdvancedEncryption128Cipher.prototype._encrypt = function (
            _inputData: Uint8Array,
            _initializationVector: Uint8Array
        ): Uint8Array {
            return new Uint8Array(16);
        };
        // Act
        const result: Uint8Array = encryption._hash(
            password,
            input,
            userBytes
        );
        sha256._hash = originalSha256Hash;
        sha512._hash = originalSha512Hash;
        _AdvancedEncryption128Cipher.prototype._encrypt = originalEncrypt;
        // Assert
        expect(sha256Count).toBe(65);
        expect(sha512Count).toBe(0);
        expect(result.length).toBe(32);
    });
});
describe('_AdvancedEncryption _getUserKey mutation coverage', () => {
    it('should decrypt user encryption bytes with false and a 16-byte zero initialization vector', () => {
        // Arrange
        const encryption: _AdvancedEncryption =
            new _AdvancedEncryption();
        const password: Uint8Array =
            new Uint8Array([10, 20, 30]);
        const userKeySalt: Uint8Array =
            new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
        const userEncryption: Uint8Array =
            new Uint8Array(32);
        const derivedKey: Uint8Array =
            new Uint8Array(32);
        const expectedResult: Uint8Array =
            new Uint8Array([90, 91, 92]);
        for (let index: number = 0;
            index < userEncryption.length; index++) {
            userEncryption[index] = index + 40;
            derivedKey[index] = index + 80;
        }
        const originalHash:
            (
                currentPassword: Uint8Array,
                input: Uint8Array,
                userBytes: Uint8Array
            ) => Uint8Array = encryption._hash;
        const originalDecryptBlock:
            (
                input: Uint8Array,
                isEncryption: boolean,
                initializationVector: Uint8Array
            ) => Uint8Array =
            _AdvancedEncryption256Cipher.prototype._decryptBlock;
        let receivedInput: Uint8Array =
            new Uint8Array(0);
        let receivedEncryptionFlag: boolean = true;
        let receivedInitializationVector: Uint8Array =
            new Uint8Array(0);
        let receivedHashInput: Uint8Array =
            new Uint8Array(0);
        let receivedUserBytes: Uint8Array =
            new Uint8Array([255]);
        encryption._hash = (
            _currentPassword: Uint8Array,
            input: Uint8Array,
            userBytes: Uint8Array
        ): Uint8Array => {
            receivedHashInput = input;
            receivedUserBytes = userBytes;
            return derivedKey;
        };
        _AdvancedEncryption256Cipher.prototype._decryptBlock =
            function (
                input: Uint8Array,
                isEncryption: boolean,
                initializationVector: Uint8Array
            ): Uint8Array {
                receivedInput = input;
                receivedEncryptionFlag = isEncryption;
                receivedInitializationVector =
                    initializationVector;
                return expectedResult;
            };
        // Act
        const result: Uint8Array =
            encryption._getUserKey(
                password,
                userKeySalt,
                userEncryption
            );
        encryption._hash = originalHash;
        _AdvancedEncryption256Cipher.prototype._decryptBlock =
            originalDecryptBlock;
        // Assert
        expect(result).toBe(expectedResult);
        expect(receivedInput).toBe(userEncryption);
        expect(receivedEncryptionFlag).toBe(false);
        expect(receivedInitializationVector.length).toBe(16);
        expect(receivedInitializationVector).toEqual(
            new Uint8Array(16)
        );
        expect(receivedUserBytes.length).toBe(0);
        expect(receivedHashInput).toEqual(
            new Uint8Array([
                10, 20, 30,
                1, 2, 3, 4, 5, 6, 7, 8
            ])
        );
    });
});