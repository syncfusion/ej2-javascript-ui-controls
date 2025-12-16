import { _PdfDictionary, _isName, _PdfName } from './../pdf-primitives';
import { FormatError, _stringToBytes, _areArrayEqual } from './../utils';
import { _MD5 } from './encryptors/messageDigest5';
import { _AdvancedEncryption, _BasicEncryption } from './encryptors/basic-encryption';
import { _NormalCipherFour, _NullCipher } from './encryptors/normal-cipher';
import { _Cipher } from './encryptors/cipher';
import { _CipherTransform } from './encryptors/cipher-tranform';
import { _AdvancedEncryption128Cipher, _AdvancedEncryption256Cipher } from './encryptors/advance-cipher';
export class _PdfEncryptor {
    _filterName: string;
    _dictionary: _PdfDictionary;
    _algorithm: number;
    _messageDigest: _MD5;
    _encryptionKey: Uint8Array;
    _cipherDictionary: _PdfDictionary;
    _string: _PdfName;
    _stream: _PdfName;
    _eff: _PdfName;
    _isUserPassword: boolean = true;
    _hasUserPasswordOnly: boolean = false;
    _encryptOnlyAttachment: boolean = false;
    _encryptMetaData: boolean = true;
    _defaultPasswordBytes: Uint8Array = new Uint8Array([0x28, 0xbf, 0x4e, 0x5e, 0x4e, 0x75, 0x8a, 0x41, 0x64, 0x00, 0x4e, 0x56, 0xff,
        0xfa, 0x01, 0x08, 0x2e, 0x2e, 0x00, 0xb6, 0xd0, 0x68, 0x3e, 0x80, 0x2f, 0x0c, 0xa9, 0xfe, 0x64, 0x53, 0x69, 0x7a]);
    get _md5(): _MD5 {
        if (typeof this._messageDigest === 'undefined' || this._messageDigest === null) {
            this._messageDigest = new _MD5();
        }
        return this._messageDigest;
    }
    constructor(dictionary: _PdfDictionary, id: string, password?: string) {
        if (password === null || typeof password === 'undefined') {
            password = '';
        }
        const filter: _PdfName = dictionary.get('Filter');
        if (!_isName(filter, 'Standard')) {
            throw new FormatError('unknown encryption method');
        }
        this._filterName = filter.name;
        this._dictionary = dictionary;
        const algorithm: number = dictionary.get('V');
        if (!Number.isInteger(algorithm) || (algorithm !== 1 && algorithm !== 2 && algorithm !== 4 && algorithm !== 5)) {
            throw new FormatError('unsupported encryption algorithm');
        }
        this._algorithm = algorithm;
        let keyLength: number = dictionary.get('Length');
        if (!keyLength) {
            if (algorithm <= 3) {
                keyLength = 40;
            } else {
                const cfDictionary: _PdfDictionary = dictionary.get('CF');
                const streamCryptoName: _PdfName = dictionary.get('StmF');
                if (cfDictionary && streamCryptoName) {
                    cfDictionary.suppressEncryption = true;
                    const handlerDictionary: _PdfDictionary = cfDictionary.get(streamCryptoName.name);
                    keyLength = (handlerDictionary && handlerDictionary.get('Length')) || 128;
                    if (keyLength < 40) {
                        keyLength <<= 3;
                    }
                }
            }
        }
        if (!Number.isInteger(keyLength) || keyLength < 40 || keyLength % 8 !== 0) {
            throw new FormatError('invalid key length');
        }
        const ownerPassword: Uint8Array = (_stringToBytes(dictionary.get('O'), false, true) as Uint8Array).subarray(0, 32);
        const userPassword: Uint8Array = (_stringToBytes(dictionary.get('U'), false, true) as Uint8Array).subarray(0, 32);
        const flag: number = dictionary.get('P');
        const revision: number = dictionary.get('R');
        this._encryptMetaData = (algorithm === 4 || algorithm === 5) && dictionary.get('EncryptMetadata') !== false;
        const fileIdBytes: Uint8Array = (_stringToBytes(id, false, true) as Uint8Array);
        let passwordBytes: Uint8Array;
        if (password) {
            if (revision === 6) {
                password = encodeURIComponent(password);
            }
            passwordBytes = _stringToBytes(password, false, true) as Uint8Array;
        }
        let encryptionKey: Uint8Array;
        if (algorithm !== 5) {
            encryptionKey = this._prepareKeyData(fileIdBytes,
                                                 passwordBytes,
                                                 ownerPassword,
                                                 userPassword,
                                                 flag,
                                                 revision,
                                                 keyLength,
                                                 this._encryptMetaData);
            if (encryptionKey) {
                this._isUserPassword = true;
                if (password) {
                    const decodedPassword: Uint8Array = this._decodeUserPassword(passwordBytes, ownerPassword, revision, keyLength);
                    const ownerEncryptionKey: Uint8Array = this._prepareKeyData(fileIdBytes,
                                                                                decodedPassword,
                                                                                ownerPassword,
                                                                                userPassword,
                                                                                flag,
                                                                                revision,
                                                                                keyLength,
                                                                                this._encryptMetaData);
                    if (ownerEncryptionKey && _areArrayEqual(ownerEncryptionKey, encryptionKey)) {
                        this._hasUserPasswordOnly = true;
                    }
                }
            }
        } else {
            const ownerValidationKey: Uint8Array = _stringToBytes(dictionary.get('O'), false, true) as Uint8Array;
            const ownerValidationSalt: Uint8Array = ownerValidationKey.subarray(32, 40);
            const ownerKeySalt: Uint8Array = ownerValidationKey.subarray(40, 48);
            const userValidationKey: Uint8Array = _stringToBytes(dictionary.get('U'), false, true) as Uint8Array;
            const uBytes: Uint8Array = userValidationKey.subarray(0, 48);
            const userValidationSalt: Uint8Array = userValidationKey.subarray(32, 40);
            const userKeySalt: Uint8Array = userValidationKey.subarray(40, 48);
            const ownerEncryption: Uint8Array = _stringToBytes(dictionary.get('OE'), false, true) as Uint8Array;
            const userEncryption: Uint8Array = _stringToBytes(dictionary.get('UE'), false, true) as Uint8Array;
            let algorithm: _AdvancedEncryption | _BasicEncryption;
            if (revision === 6) {
                algorithm = new _AdvancedEncryption();
            } else {
                algorithm = new _BasicEncryption();
            }
            let p: Uint8Array;
            if (passwordBytes) {
                p = passwordBytes.subarray(0, Math.min(127, passwordBytes.length));
            } else {
                p = new Uint8Array([]);
            }
            if (algorithm._checkUserPassword(p, userValidationSalt, userPassword)) {
                encryptionKey = this._createEncryptionKey(true,
                                                          p,
                                                          ownerKeySalt,
                                                          uBytes,
                                                          userKeySalt,
                                                          ownerEncryption,
                                                          userEncryption,
                                                          algorithm);
                this._isUserPassword = true;
                if (password.length && algorithm._checkOwnerPassword(p, ownerValidationSalt, uBytes, ownerPassword)) {
                    this._hasUserPasswordOnly = true;
                }
            } else if (password.length && algorithm._checkOwnerPassword(p, ownerValidationSalt, uBytes, ownerPassword)) {
                encryptionKey = this._createEncryptionKey(false,
                                                          passwordBytes,
                                                          ownerKeySalt,
                                                          uBytes,
                                                          userKeySalt,
                                                          ownerEncryption,
                                                          userEncryption,
                                                          algorithm);
                this._isUserPassword = false;
            }
        }
        if (!encryptionKey) {
            if (password) {
                const decodedPassword: Uint8Array = this._decodeUserPassword(passwordBytes, ownerPassword, revision, keyLength);
                encryptionKey = this._prepareKeyData(fileIdBytes,
                                                     decodedPassword,
                                                     ownerPassword,
                                                     userPassword,
                                                     flag,
                                                     revision,
                                                     keyLength,
                                                     this._encryptMetaData);
                this._isUserPassword = false;
            } else {
                throw new Error('Cannot open an encrypted document. The password is invalid.');
            }
        }
        if (algorithm >= 4) {
            const cipherDictionary: _PdfDictionary = dictionary.get('CF');
            if (cipherDictionary) {
                cipherDictionary.suppressEncryption = true;
                if (cipherDictionary.has('StdCF')) {
                    const standardCryptFilter: _PdfDictionary = cipherDictionary.get('StdCF');
                    if (standardCryptFilter && standardCryptFilter.has('AuthEvent')) {
                        const event: _PdfName = standardCryptFilter.get('AuthEvent');
                        if (event && event.name === 'EFOpen') {
                            this._encryptOnlyAttachment = true;
                        }
                    }
                }
            }
            this._cipherDictionary = cipherDictionary;
            this._stream = dictionary.get('StmF') || _PdfName.get('Identity');
            this._string = dictionary.get('StrF') || _PdfName.get('Identity');
            this._eff = dictionary.get('EFF') || this._stream;
        }
        if (!encryptionKey && !this._encryptOnlyAttachment) {
            throw new Error('Cannot open an encrypted document. The password is invalid.');
        }
        this._encryptionKey = encryptionKey;
    }
    _createEncryptionKey(isUserKey: boolean,
                         password: Uint8Array,
                         ownerKeySalt: Uint8Array,
                         uBytes: Uint8Array,
                         userKeySalt: Uint8Array,
                         ownerEncryption: Uint8Array,
                         userEncryption: Uint8Array,
                         algorithm: _AdvancedEncryption | _BasicEncryption): Uint8Array {
        if (isUserKey) {
            return algorithm._getUserKey(password, userKeySalt, userEncryption);
        } else {
            return algorithm._getOwnerKey(password, ownerKeySalt, uBytes, ownerEncryption);
        }
    }
    _prepareKeyData(id: Uint8Array,
                    password: Uint8Array,
                    ownerPassword: Uint8Array,
                    userPassword: Uint8Array,
                    flags: number,
                    revision: number,
                    keyLength: number,
                    encryptMetaData: boolean): Uint8Array {
        const hashData: Uint8Array = new Uint8Array(40 + ownerPassword.length + id.length);
        let i: number = 0;
        let j: number = 0;
        let n: number;
        if (password) {
            n = Math.min(32, password.length);
            for (; i < n; ++i) {
                hashData[<number>i] = password[<number>i];
            }
        }
        while (i < 32) {
            hashData[i++] = this._defaultPasswordBytes[j++];
        }
        for (j = 0, n = ownerPassword.length; j < n; ++j) {
            hashData[i++] = ownerPassword[<number>j];
        }
        hashData[i++] = flags & 0xff;
        hashData[i++] = (flags >> 8) & 0xff;
        hashData[i++] = (flags >> 16) & 0xff;
        hashData[i++] = (flags >>> 24) & 0xff;
        for (j = 0, n = id.length; j < n; ++j) {
            hashData[i++] = id[<number>j];
        }
        if (revision >= 4 && !encryptMetaData) {
            hashData[i++] = 0xff;
            hashData[i++] = 0xff;
            hashData[i++] = 0xff;
            hashData[i++] = 0xff;
        }
        let hash: Uint8Array = this._md5.hash(hashData, 0, i);
        const keyLengthInBytes: number = keyLength >> 3;
        if (revision >= 3) {
            for (j = 0; j < 50; ++j) {
                hash = this._md5.hash(hash, 0, keyLengthInBytes);
            }
        }
        const encryptionKey: Uint8Array = hash.subarray(0, keyLengthInBytes);
        let cipher: _NormalCipherFour;
        let checkData: Uint8Array;
        if (revision >= 3) {
            for (i = 0; i < 32; ++i) {
                hashData[<number>i] = this._defaultPasswordBytes[<number>i];
            }
            for (j = 0, n = id.length; j < n; ++j) {
                hashData[i++] = id[<number>j];
            }
            cipher = new _NormalCipherFour(encryptionKey);
            checkData = cipher._encryptBlock(this._md5.hash(hashData, 0, i));
            n = encryptionKey.length;
            const derivedKey: Uint8Array = new Uint8Array(n);
            for (j = 1; j <= 19; ++j) {
                for (let k: number = 0; k < n; ++k) {
                    derivedKey[<number>k] = encryptionKey[<number>k] ^ j;
                }
                cipher = new _NormalCipherFour(derivedKey);
                checkData = cipher._encryptBlock(checkData);
            }
            for (j = 0, n = checkData.length; j < n; ++j) {
                if (userPassword[<number>j] !== checkData[<number>j]) {
                    return null;
                }
            }
        } else {
            cipher = new _NormalCipherFour(encryptionKey);
            checkData = cipher._encryptBlock(this._defaultPasswordBytes);
            for (j = 0, n = checkData.length; j < n; ++j) {
                if (userPassword[<number>j] !== checkData[<number>j]) {
                    return null;
                }
            }
        }
        return encryptionKey;
    }
    _decodeUserPassword(password: Uint8Array, ownerPassword: Uint8Array, revision: number, keyLength: number): Uint8Array {
        const hashData: Uint8Array = new Uint8Array(32);
        let i: number = 0;
        let j: number = 0;
        const n: number = Math.min(32, password.length);
        for (; i < n; ++i) {
            hashData[<number>i] = password[<number>i];
        }
        while (i < 32) {
            hashData[i++] = this._defaultPasswordBytes[j++];
        }
        let hash: Uint8Array = this._md5.hash(hashData, 0, i);
        const keyLengthInBytes: number = keyLength >> 3;
        if (revision >= 3) {
            for (j = 0; j < 50; ++j) {
                hash = this._md5.hash(hash, 0, hash.length);
            }
        }
        let cipher: _NormalCipherFour;
        let userPassword: Uint8Array;
        if (revision >= 3) {
            userPassword = ownerPassword;
            const derivedKey: Uint8Array = new Uint8Array(keyLengthInBytes);
            for (j = 19; j >= 0; j--) {
                for (let k: number = 0; k < keyLengthInBytes; ++k) {
                    derivedKey[<number>k] = hash[<number>k] ^ j;
                }
                cipher = new _NormalCipherFour(derivedKey);
                userPassword = cipher._encryptBlock(userPassword);
            }
        } else {
            cipher = new _NormalCipherFour(hash.subarray(0, keyLengthInBytes));
            userPassword = cipher._encryptBlock(ownerPassword);
        }
        return userPassword;
    }
    _createCipherTransform(objectNumber: number, generationNumber: number): _CipherTransform {
        if (this._algorithm === 4 || this._algorithm === 5) {
            const stringCipher: _Cipher = this._buildCipherConstructor(this._cipherDictionary,
                                                                       this._string,
                                                                       objectNumber,
                                                                       generationNumber,
                                                                       this._encryptionKey);
            const streamCipher: _Cipher = this._buildCipherConstructor(this._cipherDictionary,
                                                                       this._stream,
                                                                       objectNumber,
                                                                       generationNumber,
                                                                       this._encryptionKey);
            return new _CipherTransform(stringCipher, streamCipher);
        }
        const key: Uint8Array = this._buildObjectKey(objectNumber, generationNumber, this._encryptionKey, false);
        return new _CipherTransform(new _NormalCipherFour(key), new _NormalCipherFour(key));
    }
    _buildCipherConstructor(cipherDictionary: _PdfDictionary,
                            name: _PdfName,
                            objectNumber: number,
                            generationNumber: number,
                            key: Uint8Array): _Cipher {
        const cryptFilter: _PdfDictionary = cipherDictionary.get(name.name);
        let cfm: _PdfName;
        if (cryptFilter) {
            cfm = cryptFilter.get('CFM');
        }
        if (!cfm) {
            return new _NullCipher();
        }
        switch (cfm.name) {
        case 'None':
            return new _NullCipher();
        case 'AESV2':
            return new _AdvancedEncryption128Cipher(this._buildObjectKey(objectNumber, generationNumber, key, true));
        case 'AESV3':
            return new _AdvancedEncryption256Cipher(key);
        case 'V2':
            return new _NormalCipherFour(this._buildObjectKey(objectNumber, generationNumber, key, false));
        }
        throw new FormatError('Unknown cryptography method');
    }
    _buildObjectKey(objectNumber: number,
                    generationNumber: number,
                    encryptionKey: Uint8Array,
                    isAdvancedEncryption: boolean = false): Uint8Array {
        const key: Uint8Array = new Uint8Array(encryptionKey.length + 9);
        let i: number;
        for (i = 0; i < encryptionKey.length; ++i) {
            key[<number>i] = encryptionKey[<number>i];
        }
        key[i++] = objectNumber & 0xff;
        key[i++] = (objectNumber >> 8) & 0xff;
        key[i++] = (objectNumber >> 16) & 0xff;
        key[i++] = generationNumber & 0xff;
        key[i++] = (generationNumber >> 8) & 0xff;
        if (isAdvancedEncryption) {
            key[i++] = 0x73;
            key[i++] = 0x41;
            key[i++] = 0x6c;
            key[i++] = 0x54;
        }
        const hash: Uint8Array = this._md5.hash(key, 0, i);
        return hash.subarray(0, Math.min(encryptionKey.length + 5, 16));
    }
}
export class _Word64 {
    high: number;
    low: number;
    constructor(high: number, low: number) {
        this.high = high | 0;
        this.low = low | 0;
    }
    and(word: _Word64): void {
        this.high &= word.high;
        this.low &= word.low;
    }
    or(word: _Word64): void {
        this.high |= word.high;
        this.low |= word.low;
    }
    not(): void {
        this.high = ~this.high;
        this.low = ~this.low;
    }
    xor(word: _Word64): void {
        this.high ^= word.high;
        this.low ^= word.low;
    }
    shiftRight(places: number): void {
        if (places >= 32) {
            this.low = (this.high >>> (places - 32)) | 0;
            this.high = 0;
        } else {
            this.low = (this.low >>> places) | (this.high << (32 - places));
            this.high = (this.high >>> places) | 0;
        }
    }
    shiftLeft(places: number): void {
        if (places >= 32) {
            this.high = this.low << (places - 32);
            this.low = 0;
        } else {
            this.high = (this.high << places) | (this.low >>> (32 - places));
            this.low <<= places;
        }
    }
    rotateRight(places: number): void {
        let low: number;
        let high: number;
        if (places & 32) {
            high = this.low;
            low = this.high;
        } else {
            low = this.low;
            high = this.high;
        }
        places &= 31;
        this.low = (low >>> places) | (high << (32 - places));
        this.high = (high >>> places) | (low << (32 - places));
    }
    add(word: _Word64): void {
        const lowAdd: number = (this.low >>> 0) + (word.low >>> 0);
        let highAdd: number = (this.high >>> 0) + (word.high >>> 0);
        if (lowAdd > 0xffffffff) {
            highAdd += 1;
        }
        this.low = lowAdd | 0;
        this.high = highAdd | 0;
    }
    copyTo(bytes: Uint8Array, offset: number): void {
        bytes[<number>offset] = (this.high >>> 24) & 0xff;
        bytes[offset + 1] = (this.high >> 16) & 0xff;
        bytes[offset + 2] = (this.high >> 8) & 0xff;
        bytes[offset + 3] = this.high & 0xff;
        bytes[offset + 4] = (this.low >>> 24) & 0xff;
        bytes[offset + 5] = (this.low >> 16) & 0xff;
        bytes[offset + 6] = (this.low >> 8) & 0xff;
        bytes[offset + 7] = this.low & 0xff;
    }
    assign(word: _Word64): void {
        this.high = word.high;
        this.low = word.low;
    }
}
