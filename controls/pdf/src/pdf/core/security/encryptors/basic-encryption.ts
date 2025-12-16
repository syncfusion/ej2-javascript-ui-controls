import { _areArrayEqual } from '../../utils';
import { _AdvancedEncryption128Cipher, _AdvancedEncryption256Cipher } from './advance-cipher';
import { _Sha256 } from './secureHash-algorithm256';
import { _Sha512 } from './secureHash-algorithm512';
export abstract class _EncryptionKey {
    _sha256Obj: _Sha256;
    get _sha256(): _Sha256 {
        if (typeof this._sha256Obj === 'undefined' || this._sha256Obj === null) {
            this._sha256Obj = new _Sha256();
        }
        return this._sha256Obj;
    }
    _sha512Obj: _Sha512;
    get _sha512(): _Sha512 {
        if (typeof this._sha512Obj === 'undefined' || this._sha512Obj === null) {
            this._sha512Obj = new _Sha512();
        }
        return this._sha512Obj;
    }
    abstract _checkOwnerPassword(password: Uint8Array,
        ownerValidationSalt: Uint8Array,
        userBytes: Uint8Array,
        ownerPassword: Uint8Array): boolean;
    abstract _checkUserPassword(password: Uint8Array, userValidationSalt: Uint8Array, userPassword: Uint8Array): boolean;
    abstract _getOwnerKey(password: Uint8Array, ownerKeySalt: Uint8Array, userBytes: Uint8Array, ownerEncryption: Uint8Array): Uint8Array;
    abstract _getUserKey(password: Uint8Array, userKeySalt: Uint8Array, userEncryption: Uint8Array): Uint8Array;
}
// PDF17 encryption support
export class _BasicEncryption extends _EncryptionKey {
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
    _checkUserPassword(password: Uint8Array, userValidationSalt: Uint8Array, userPassword: Uint8Array): boolean {
        const hashData: Uint8Array = new Uint8Array(password.length + 8);
        hashData.set(password, 0);
        hashData.set(userValidationSalt, password.length);
        const result: Uint8Array = this._sha256._hash(hashData, 0, hashData.length);
        return _areArrayEqual(result, userPassword);
    }
    _getOwnerKey(password: Uint8Array, ownerKeySalt: Uint8Array, userBytes: Uint8Array, ownerEncryption: Uint8Array): Uint8Array {
        const hashData: Uint8Array = new Uint8Array(password.length + 56);
        hashData.set(password, 0);
        hashData.set(ownerKeySalt, password.length);
        hashData.set(userBytes, password.length + ownerKeySalt.length);
        const key: Uint8Array = this._sha256._hash(hashData, 0, hashData.length);
        return (new _AdvancedEncryption256Cipher(key))._decryptBlock(ownerEncryption, false, new Uint8Array(16));
    }
    _getUserKey(password: Uint8Array, userKeySalt: Uint8Array, userEncryption: Uint8Array): Uint8Array {
        const hashData: Uint8Array = new Uint8Array(password.length + 8);
        hashData.set(password, 0);
        hashData.set(userKeySalt, password.length);
        const key: Uint8Array = this._sha256._hash(hashData, 0, hashData.length);
        return (new _AdvancedEncryption256Cipher(key))._decryptBlock(userEncryption, false, new Uint8Array(16));
    }
}
// PDF20 encryption support
export class _AdvancedEncryption extends _EncryptionKey {
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
    _getOwnerKey(password: Uint8Array, ownerKeySalt: Uint8Array, userBytes: Uint8Array, ownerEncryption: Uint8Array): Uint8Array {
        const hashData: Uint8Array = new Uint8Array(password.length + 56);
        hashData.set(password, 0);
        hashData.set(ownerKeySalt, password.length);
        hashData.set(userBytes, password.length + ownerKeySalt.length);
        const key: Uint8Array = this._hash(password, hashData, userBytes);
        return (new _AdvancedEncryption256Cipher(key))._decryptBlock(ownerEncryption, false, new Uint8Array(16));
    }
    _getUserKey(password: Uint8Array, userKeySalt: Uint8Array, userEncryption: Uint8Array): Uint8Array {
        const hashData: Uint8Array = new Uint8Array(password.length + 8);
        hashData.set(password, 0);
        hashData.set(userKeySalt, password.length);
        const key: Uint8Array = this._hash(password, hashData, new Uint8Array([]));
        const cipher: _AdvancedEncryption256Cipher = new _AdvancedEncryption256Cipher(key);
        return cipher._decryptBlock(userEncryption, false, new Uint8Array(16));
    }
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
