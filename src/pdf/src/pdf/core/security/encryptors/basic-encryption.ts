import { _areArrayEqual } from '../../utils';
import { _AdvancedEncryption128Cipher, _AdvancedEncryption256Cipher } from './advance-cipher';
import { _Sha256 } from './secureHash-algorithm256';
import { _Sha512 } from './secureHash-algorithm512';
/**
 * Abstract base for encryption key helpers used internally by PDF encryption.
 *
 * @private
 */
export abstract class _EncryptionKey {
    /**
     * Cached SHA-256 instance used for hashing operations.
     *
     * @private
     */
    _sha256Obj: _Sha256;
    /**
     * Lazily-created SHA-256 instance.
     *
     * @private
     * @returns {_Sha256} The `_Sha256` instance.
     */
    get _sha256(): _Sha256 {
        if (typeof this._sha256Obj === 'undefined' || this._sha256Obj === null) {
            this._sha256Obj = new _Sha256();
        }
        return this._sha256Obj;
    }
    /**
     * Cached SHA-512 instance used for hashing operations.
     *
     * @private
     */
    _sha512Obj: _Sha512;
    /**
     * Lazily-created SHA-512 instance.
     *
     * @private
     * @returns {_Sha512} The `_Sha512` instance.
     */
    get _sha512(): _Sha512 {
        if (typeof this._sha512Obj === 'undefined' || this._sha512Obj === null) {
            this._sha512Obj = new _Sha512();
        }
        return this._sha512Obj;
    }
    /**
     * Check whether the provided password matches the owner password.
     *
     * @private
     * @param {Uint8Array} password - The password to check.
     * @param {Uint8Array} ownerValidationSalt - Salt used for owner validation.
     * @param {Uint8Array} userBytes - User-specific bytes used in hashing.
     * @param {Uint8Array} ownerPassword - Expected owner password hash.
     * @returns {boolean} `true` when the password is valid.
     */
    abstract _checkOwnerPassword(password: Uint8Array,
        ownerValidationSalt: Uint8Array,
        userBytes: Uint8Array,
        ownerPassword: Uint8Array): boolean;
    /**
     * Check whether the provided password matches the user password.
     *
     * @private
     * @param {Uint8Array} password - The password to check.
     * @param {Uint8Array} userValidationSalt - Salt used for user validation.
     * @param {Uint8Array} userPassword - Expected user password hash.
     * @returns {boolean} `true` when the password is valid.
     */
    abstract _checkUserPassword(password: Uint8Array, userValidationSalt: Uint8Array, userPassword: Uint8Array): boolean;
    /**
     * Derive the owner key from the given password and salts.
     *
     * @private
     * @param {Uint8Array} password - The password to derive from.
     * @param {Uint8Array} ownerKeySalt - Salt used for owner key derivation.
     * @param {Uint8Array} userBytes - User-specific bytes used in derivation.
     * @param {Uint8Array} ownerEncryption - Encrypted owner data to decrypt.
     * @returns {Uint8Array} The derived owner key bytes.
     */
    abstract _getOwnerKey(password: Uint8Array, ownerKeySalt: Uint8Array, userBytes: Uint8Array, ownerEncryption: Uint8Array): Uint8Array;
    /**
     * Derive the user key from the given password and salts.
     *
     * @private
     * @param {Uint8Array} password - The password to derive from.
     * @param {Uint8Array} userKeySalt - Salt used for user key derivation.
     * @param {Uint8Array} userEncryption - Encrypted user data to decrypt.
     * @returns {Uint8Array} The derived user key bytes.
     */
    abstract _getUserKey(password: Uint8Array, userKeySalt: Uint8Array, userEncryption: Uint8Array): Uint8Array;
}
// PDF17 encryption support
/**
 * Basic (PDF 1.7) encryption helper implementing `_EncryptionKey`.
 *
 * @private
 */
export class _BasicEncryption extends _EncryptionKey {
    /**
     * Validate the owner password for PDF 1.7-style encryption.
     *
     * @private
     * @param {Uint8Array} password - The candidate password.
     * @param {Uint8Array} ownerValidationSalt - Salt for owner validation.
     * @param {Uint8Array} userBytes - Additional user bytes used in hashing.
     * @param {Uint8Array} ownerPassword - Expected owner password hash.
     * @returns {boolean} `true` when the owner password is valid.
     */
    _checkOwnerPassword(password: Uint8Array,
                        ownerValidationSalt: Uint8Array,
                        userBytes: Uint8Array,
                        ownerPassword: Uint8Array): boolean {
        const hashData: Uint8Array = new Uint8Array(password.length + 56);
        hashData.set(password, 0);
        hashData.set(ownerValidationSalt, password.length);
        hashData.set(userBytes, password.length + ownerValidationSalt.length);
        const result: Uint8Array = this._sha256._hash(hashData, 0, hashData.length);
        return _areArrayEqual(result, ownerPassword);
    }
    /**
     * Validate the user password for PDF 1.7-style encryption.
     *
     * @private
     * @param {Uint8Array} password - The candidate password.
     * @param {Uint8Array} userValidationSalt - Salt for user validation.
     * @param {Uint8Array} userPassword - Expected user password hash.
     * @returns {boolean} `true` when the user password is valid.
     */
    _checkUserPassword(password: Uint8Array, userValidationSalt: Uint8Array, userPassword: Uint8Array): boolean {
        const hashData: Uint8Array = new Uint8Array(password.length + 8);
        hashData.set(password, 0);
        hashData.set(userValidationSalt, password.length);
        const result: Uint8Array = this._sha256._hash(hashData, 0, hashData.length);
        return _areArrayEqual(result, userPassword);
    }
    /**
     * Derive the owner key for PDF 1.7-style encryption.
     *
     * @private
     * @param {Uint8Array} password - The password to derive from.
     * @param {Uint8Array} ownerKeySalt - Salt used for owner key derivation.
     * @param {Uint8Array} userBytes - Additional user bytes used in derivation.
     * @param {Uint8Array} ownerEncryption - Encrypted owner data to decrypt.
     * @returns {Uint8Array} The derived owner key bytes.
     */
    _getOwnerKey(password: Uint8Array, ownerKeySalt: Uint8Array, userBytes: Uint8Array, ownerEncryption: Uint8Array): Uint8Array {
        const hashData: Uint8Array = new Uint8Array(password.length + 56);
        hashData.set(password, 0);
        hashData.set(ownerKeySalt, password.length);
        hashData.set(userBytes, password.length + ownerKeySalt.length);
        const key: Uint8Array = this._sha256._hash(hashData, 0, hashData.length);
        return (new _AdvancedEncryption256Cipher(key))._decryptBlock(ownerEncryption, false, new Uint8Array(16));
    }
    /**
     * Derive the user key for PDF 1.7-style encryption.
     *
     * @private
     * @param {Uint8Array} password - The password to derive from.
     * @param {Uint8Array} userKeySalt - Salt used for user key derivation.
     * @param {Uint8Array} userEncryption - Encrypted user data to decrypt.
     * @returns {Uint8Array} The derived user key bytes.
     */
    _getUserKey(password: Uint8Array, userKeySalt: Uint8Array, userEncryption: Uint8Array): Uint8Array {
        const hashData: Uint8Array = new Uint8Array(password.length + 8);
        hashData.set(password, 0);
        hashData.set(userKeySalt, password.length);
        const key: Uint8Array = this._sha256._hash(hashData, 0, hashData.length);
        return (new _AdvancedEncryption256Cipher(key))._decryptBlock(userEncryption, false, new Uint8Array(16));
    }
}
// PDF20 encryption support
/**
 * Advanced (PDF 2.0) encryption helper implementing `_EncryptionKey`.
 *
 * @private
 */
export class _AdvancedEncryption extends _EncryptionKey {
    /**
     * Validate the owner password for PDF 2.0-style encryption.
     *
     * @private
     * @param {Uint8Array} password - The candidate password.
     * @param {Uint8Array} ownerValidationSalt - Salt for owner validation.
     * @param {Uint8Array} userBytes - Additional user bytes used in hashing.
     * @param {Uint8Array} ownerPassword - Expected owner password hash.
     * @returns {boolean} `true` when the owner password is valid.
     */
    _checkOwnerPassword(password: Uint8Array,
                        ownerValidationSalt: Uint8Array,
                        userBytes: Uint8Array,
                        ownerPassword: Uint8Array): boolean {
        const hashData: Uint8Array = new Uint8Array(password.length + 56);
        hashData.set(password, 0);
        hashData.set(ownerValidationSalt, password.length);
        hashData.set(userBytes, password.length + ownerValidationSalt.length);
        const result: Uint8Array = this._hash(password, hashData, userBytes);
        return _areArrayEqual(result, ownerPassword);
    }
    _checkUserPassword(password: Uint8Array, userValidationSalt: Uint8Array, userPassword: Uint8Array): boolean {
        const hashData: Uint8Array = new Uint8Array(password.length + 8);
        hashData.set(password, 0);
        hashData.set(userValidationSalt, password.length);
        const result: Uint8Array = this._hash(password, hashData, new Uint8Array([]));
        return _areArrayEqual(result, userPassword);
    }
    /**
     * Derive the owner key for PDF 2.0-style encryption.
     *
     * @private
     * @param {Uint8Array} password - The password to derive from.
     * @param {Uint8Array} ownerKeySalt - Salt used for owner key derivation.
     * @param {Uint8Array} userBytes - Additional user bytes used in derivation.
     * @param {Uint8Array} ownerEncryption - Encrypted owner data to decrypt.
     * @returns {Uint8Array} The derived owner key bytes.
     */
    _getOwnerKey(password: Uint8Array, ownerKeySalt: Uint8Array, userBytes: Uint8Array, ownerEncryption: Uint8Array): Uint8Array {
        const hashData: Uint8Array = new Uint8Array(password.length + 56);
        hashData.set(password, 0);
        hashData.set(ownerKeySalt, password.length);
        hashData.set(userBytes, password.length + ownerKeySalt.length);
        const key: Uint8Array = this._hash(password, hashData, userBytes);
        return (new _AdvancedEncryption256Cipher(key))._decryptBlock(ownerEncryption, false, new Uint8Array(16));
    }
    /**
     * Derive the user key for PDF 2.0-style encryption.
     *
     * @private
     * @param {Uint8Array} password - The password to derive from.
     * @param {Uint8Array} userKeySalt - Salt used for user key derivation.
     * @param {Uint8Array} userEncryption - Encrypted user data to decrypt.
     * @returns {Uint8Array} The derived user key bytes.
     */
    _getUserKey(password: Uint8Array, userKeySalt: Uint8Array, userEncryption: Uint8Array): Uint8Array {
        const hashData: Uint8Array = new Uint8Array(password.length + 8);
        hashData.set(password, 0);
        hashData.set(userKeySalt, password.length);
        const key: Uint8Array = this._hash(password, hashData, new Uint8Array([]));
        const cipher: _AdvancedEncryption256Cipher = new _AdvancedEncryption256Cipher(key);
        return cipher._decryptBlock(userEncryption, false, new Uint8Array(16));
    }
    /**
     * Internal iterative hash routine used by PDF 2.0 encryption key derivation.
     *
     * @private
     * @param {Uint8Array} password - The password bytes.
     * @param {Uint8Array} input - Input data for the hash routine.
     * @param {Uint8Array} userBytes - User-specific bytes influencing the result.
     * @returns {Uint8Array} A 32-byte hash used as an intermediate key.
     */
    _hash(password: Uint8Array, input: Uint8Array, userBytes: Uint8Array): Uint8Array {
        let data: Uint8Array = this._sha256._hash(input, 0, input.length).subarray(0, 32);
        let encrypted: Uint8Array = new Uint8Array([0]);
        let i: number = 0;
        while (i < 64 || encrypted[encrypted.length - 1] > i - 32) {
            const combinedLength: number = password.length + data.length + userBytes.length;
            const combinedArray: Uint8Array = new Uint8Array(combinedLength);
            let writeOffset: number = 0;
            combinedArray.set(password, writeOffset);
            writeOffset += password.length;
            combinedArray.set(data, writeOffset);
            writeOffset += data.length;
            combinedArray.set(userBytes, writeOffset);
            const k1: Uint8Array = new Uint8Array(combinedLength * 64);
            for (let j: number = 0, pos: number = 0; j < 64; j++) {
                k1.set(combinedArray, pos);
                pos += combinedLength;
            }
            const cipher: _AdvancedEncryption128Cipher = new _AdvancedEncryption128Cipher(data.subarray(0, 16));
            encrypted = cipher._encrypt(k1, data.subarray(16, 32));
            let remainder: number = 0;
            for (let z: number = 0; z < 16; z++) {
                remainder *= 256 % 3;
                remainder %= 3;
                remainder += (encrypted[<number>z] >>> 0) % 3;
                remainder %= 3;
            }
            if (remainder === 2) {
                data = this._sha512._hash(encrypted, 0, encrypted.length);
            } else if (remainder === 1) {
                data = this._sha512._hash(encrypted, 0, encrypted.length, true);
            } else if (remainder === 0) {
                data = this._sha256._hash(encrypted, 0, encrypted.length);
            }
            i++;
        }
        return data.subarray(0, 32);
    }
}
