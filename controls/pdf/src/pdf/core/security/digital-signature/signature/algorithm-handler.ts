import { _bytesToBigInt, _bigIntToBytes, _modPow, _createRandomInRange, _modInverse, _getBigInt } from '../../../utils';
import { _PdfCipherParameter, _PdfRonCipherParameter } from '../x509/x509-cipher-handler';
import { _PdfBigInt } from '../pdf-big-integer';
import { _ICipherBlock } from './pdf-interfaces';
/**
 * Provides the internal RSA core operations, including modular exponentiation,
 * CRT optimization for private keys, and block size management.
 *
 * @private
 */
export class _PdfRsaCoreAlgorithm {
    private _key: any; // eslint-disable-line
    private _isEncryption: boolean;
    private _bitSize: number;
    /**
     * Gets the maximum input block size in bytes based on the key size and operation mode.
     *
     * @private
     * @returns {number} The allowed input block size in bytes.
     */
    _getInputBlockSize(): number{
        return this._isEncryption ? (this._bitSize - 1) >>> 3 : (this._bitSize + 7) >>> 3;
    }
    /**
     * Gets the maximum output block size in bytes based on the key size and operation mode.
     *
     * @private
     * @returns {number} The output block size in bytes.
     */
    _getOutputBlockSize(): number {
        return this._isEncryption ? (this._bitSize + 7) >>> 3 : (this._bitSize - 1) >>> 3;
    }
    /**
     * Initializes the RSA core engine with the specified mode and key parameters.
     *
     * @private
     * @param {boolean} isEncryption Specifies whether to operate in encryption mode.
     * @param {_PdfCipherParameter} parameters The RSA key parameters to use.
     * @returns {void} nothing.
     */
    _initialize(isEncryption: boolean, parameters: _PdfCipherParameter): void {
        this._key = parameters;
        this._isEncryption = isEncryption;
        let modCandidate: any;  // eslint-disable-line
        if (this._key && this._key.modulus) {
            this._bitSize = this._key.modulus._bitLength();
            modCandidate = this._key.modulus;
        }
        if (this._key instanceof _PdfRonCipherParameter) {
            this._bitSize = this._key._modulus.length * 8;
            modCandidate = this._key._modulus;
        } else if (
            this._key &&
            this._key._enableCertificationVerification &&
            this._key._modulus instanceof Uint8Array) {
            this._bitSize = this._key._modulus.length * 8;
            modCandidate = this._key._modulus;
        }
        if (modCandidate) {
            if (typeof modCandidate._bitLength === 'function') {
                this._bitSize = modCandidate._bitLength();
            } else if (modCandidate instanceof Uint8Array) {
                const bytes: Uint8Array = modCandidate;
                let firstNonZero: number = 0;
                while (firstNonZero < bytes.length && bytes[<number>firstNonZero] === 0) {
                    firstNonZero++;
                }
                if (firstNonZero === bytes.length) {
                    this._bitSize = 0;
                } else {
                    const firstByte: number = bytes[<number>firstNonZero];
                    const leadingBits: number = Math.floor(Math.log2(firstByte)) + 1;
                    this._bitSize = ((bytes.length - firstNonZero - 1) * 8) + leadingBits;
                }
                if (!(this._key.modulus)) {
                    (this._key as any).modulus = {  // eslint-disable-line
                        _bitLength: () => this._bitSize,
                        _toBigInt: () => _bytesToBigInt(bytes)
                    };
                }
                if ((this._key as any)._exponent instanceof Uint8Array || this._key.exponent instanceof  Uint8Array&& !(this._key as any).exponent) {  // eslint-disable-line
                    const expBytes: Uint8Array = (this._key as any)._exponent;  // eslint-disable-line
                    (this._key as any).exponent = {  // eslint-disable-line
                        _toBigInt: () => _bytesToBigInt(expBytes)
                    };
                }
            } else {
                try {
                    this._bitSize = modCandidate._bitLength();
                } catch {
                    this._bitSize = 0;
                }
            }
        } else {
            this._bitSize = 0;
        }
    }
    /**
     * Gets the length of the RSA modulus in bytes.
     *
     * @returns {number} The modulus length in bytes; otherwise, 0 if no modulus is available.
     * @private
     */
    _getModulusByteLength(): number {
        if (this._key._modulus) {
            return (this._key._modulus instanceof Uint8Array) ? this._key._modulus.length : 0;
        } else {
            const m: any = this._key.modulus; // eslint-disable-line
            return (m instanceof Uint8Array) ? m.length : 0;
        }
    }
    /**
     * Converts a segment of bytes into a bigint suitable for RSA modular operations,
     * validating the block size and modulus constraints.
     *
     * @private
     * @param {Uint8Array} bytes The source byte array.
     * @param {number} offset The starting index within the array.
     * @param {number} length The number of bytes to read.
     * @returns {bigint} The bigint representation of the input block.
     */
    _convertInput(bytes: Uint8Array, offset: number, length: number): bigint {
        const subBytes: Uint8Array = bytes.subarray(offset, offset + length);
        if (!this._key._isPrivate) {
            const kMod: number = this._getModulusByteLength();
            const kSig: number = subBytes.length;
            if (kSig !== kMod) {
                throw new Error(
                    `Signature length (${kSig}) does not match modulus length (${kMod}). Wrong issuer public key.`
                );
            }
            const input: bigint = _bytesToBigInt(subBytes);
            let modBigInt: bigint;
            if (this._key.modulus) {
                modBigInt = typeof (this._key.modulus as any)._toBigInt === 'function'  // eslint-disable-line
                    ? (this._key.modulus as any)._toBigInt()  // eslint-disable-line
                    : _bytesToBigInt(this._key.modulus as Uint8Array);
            } else {
                modBigInt = typeof (this._key._modulus as any)._toBigInt === 'function'  // eslint-disable-line
                    ? (this._key._modulus as any)._toBigInt()  // eslint-disable-line
                    : _bytesToBigInt(this._key._modulus as Uint8Array);
            }
            if (input >= modBigInt) {
                throw new Error('Input data is larger than modulus.');
            }
            return input;
        }
        if (subBytes.length > this._getInputBlockSize() + 1) {
            throw new Error('Input data too large for RSA block.');
        }
        const input: bigint = _bytesToBigInt(subBytes);
        if (input >= this._key.modulus) {
            throw new Error('Input data is larger than modulus.');
        }
        return input;
    }
    /**
     * Converts a bigint result back into a byte array, padding as required for encryption output size.
     *
     * @private
     * @param {bigint} result The bigint value to convert.
     * @returns {Uint8Array} The converted byte array.
     */
    _convertOutput(result: bigint): Uint8Array {
        const output: Uint8Array = _bigIntToBytes(result);
        const outSize: number = this._getOutputBlockSize();
        if (output.length < outSize) {
            const paddedOutput: Uint8Array = new Uint8Array(outSize);
            paddedOutput.set(output, outSize - output.length);
            return paddedOutput;
        }
        return output;
    }
    /**
     * Processes a single RSA block using modular exponentiation. If a CRT private key is present,
     * uses the CRT optimization; otherwise, falls back to standard exponentiation.
     *
     * @private
     * @param {bigint} input The bigint block to process.
     * @returns {bigint} The processed bigint result.
     */
    _processBlock(input: bigint): bigint {
        const bigInt: (value: string | number | boolean) => bigint = _getBigInt();
        const privateKey: any = this._key; // eslint-disable-line
        if (privateKey._isPrivate && privateKey.p && privateKey.q) {
            const p: bigint = privateKey.p._toBigInt();
            const q: bigint = privateKey.q._toBigInt();
            const dP: bigint = privateKey.dP._toBigInt();
            const dQ: bigint = privateKey.dQ._toBigInt();
            const qInv: bigint = privateKey.inverse._toBigInt();
            const mP: bigint = _modPow(input % p, dP, p);
            const mQ: bigint = _modPow(input % q, dQ, q);
            let h: bigint = (mP - mQ) * qInv;
            h = h % p;
            if (h < bigInt('0')) {
                h += p;
            }
            let m: bigint = h * q;
            m = m + mQ;
            return m;
        }
        let expBigInt: bigint;
        let modBigInt: bigint;
        if (this._key.modulus && this._key.modulus instanceof Uint8Array && this._key.exponent
            && this._key.exponent instanceof Uint8Array) {
            expBigInt = new _PdfBigInt()._fromBytesBE(this._key.exponent)._toBigInt();
            modBigInt = new _PdfBigInt()._fromBytesBE(this._key.modulus)._toBigInt();
        } else if (this._key._modulus && this._key._modulus instanceof Uint8Array && this._key._exponent &&
            this._key._exponent instanceof Uint8Array && this._key._enableCertificationVerification) {
            expBigInt = new _PdfBigInt()._fromBytesBE(this._key._exponent)._toBigInt();
            modBigInt = new _PdfBigInt()._fromBytesBE(this._key._modulus)._toBigInt();
        } else {
            expBigInt =  this._key.exponent._toBigInt();
            modBigInt = this._key.modulus._toBigInt();
        }
        return _modPow(input, expBigInt, modBigInt);
    }
}
/**
 * Provides the internal RSA block cipher wrapper built on top of the RSA core,
 * exposing block size and processing methods for encryption/decryption.
 *
 * @private
 */
export class _PdfRsaAlgorithm implements _ICipherBlock {
    private _rsaCoreEngine: _PdfRsaCoreAlgorithm = new _PdfRsaCoreAlgorithm();
    private _key: any; //eslint-disable-line
    /**
     * Gets the internal algorithm name.
     *
     * @private
     * @returns {string} The algorithm name, i.e., "RSA".
     */
    _getAlgorithmName(): string {
        return 'RSA';
    }
    /**
     * Gets the maximum input block size in bytes for the current key and mode.
     *
     * @private
     * @returns {number} The input block size in bytes.
     */
    _getInputBlock(): number {
        return this._rsaCoreEngine._getInputBlockSize();
    }
    /**
     * Gets the maximum output block size in bytes for the current key and mode.
     *
     * @private
     * @returns {number} The output block size in bytes.
     */
    _getOutputBlock(): number {
        return this._rsaCoreEngine._getOutputBlockSize();
    }
    /**
     * Initializes the RSA algorithm with the specified mode and parameters.
     *
     * @private
     * @param {boolean} isEncryption Specifies whether to operate in encryption mode.
     * @param {_PdfCipherParameter} parameter The RSA key parameters to use.
     * @returns {void} nothing.
     */
    _initialize(isEncryption: boolean, parameter: _PdfCipherParameter): void {
        this._rsaCoreEngine._initialize(isEncryption, parameter);
        this._key = parameter;
    }
    /**
     * Processes a single block of input using RSA. Applies blinding when a private key is used
     * and a public exponent is available to mitigate timing attacks.
     *
     * @private
     * @param {Uint8Array} bytes The input buffer containing the block data.
     * @param {number} offset The starting index of the block within the buffer.
     * @param {number} length The number of bytes to process from the buffer.
     * @returns {Uint8Array} The processed output block.
     */
    _processBlock(bytes: Uint8Array, offset: number, length: number): Uint8Array {
        const bigInt: (value: string | number | boolean) => bigint = _getBigInt();
        if (!this._key) {
            throw new Error('RSA engine not initialized.');
        }
        const input: bigint = this._rsaCoreEngine._convertInput(bytes, offset, length);
        let result: bigint;
        const privateKey: any = this._key; // eslint-disable-line
        if (privateKey._isPrivate && privateKey.publicExponent) {
            const e: bigint = privateKey.publicExponent._toBigInt();
            const m: bigint = this._key.modulus._toBigInt();
            const r: bigint = _createRandomInRange(bigInt(1), m - bigInt(1));
            const blindedInput: bigint = (_modPow(r, e, m) * input) % m;
            const blindedResult: bigint = this._rsaCoreEngine._processBlock(blindedInput);
            const rInverse: bigint = _modInverse(r, m);
            result = (blindedResult * rInverse) % m;
        } else {
            result = this._rsaCoreEngine._processBlock(input);
        }
        return this._rsaCoreEngine._convertOutput(result);
    }
}
