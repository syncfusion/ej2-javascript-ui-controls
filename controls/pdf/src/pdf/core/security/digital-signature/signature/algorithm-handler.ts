import { _bytesToBigInt, _bigIntToBytes, _modPow, _createRandomInRange, _modInverse, _getBigInt } from '../../../utils';
import { _PdfCipherParameter } from '../x509/x509-cipher-handler';
import { _ICipherBlock } from './pdf-interfaces';
export class _PdfRsaCoreAlgorithm {
    private _key: any; // eslint-disable-line
    private _isEncryption: boolean;
    private _bitSize: number;
    _getInputBlockSize(): number{
        return this._isEncryption ? (this._bitSize - 1) >>> 3 : (this._bitSize + 7) >>> 3;
    }
    _getOutputBlockSize(): number {
        return this._isEncryption ? (this._bitSize + 7) >>> 3 : (this._bitSize - 1) >>> 3;
    }
    _initialize(isEncryption: boolean, parameters: _PdfCipherParameter): void {
        this._key = parameters;
        this._isEncryption = isEncryption;
        this._bitSize = this._key.modulus._bitLength();
    }
    _convertInput(bytes: Uint8Array, offset: number, length: number): bigint {
        const subBytes: Uint8Array = bytes.subarray(offset, offset + length);
        if (subBytes.length > this._getInputBlockSize() + 1) {
            throw new Error('Input data too large for RSA block.');
        }
        const input: bigint = _bytesToBigInt(subBytes);
        if (input >= this._key.modulus) {
            throw new Error('Input data is larger than modulus.');
        }
        return input;
    }
    _convertOutput(result: bigint): Uint8Array {
        const output: Uint8Array = _bigIntToBytes(result);
        if (this._isEncryption) {
            const outSize: number = this._getOutputBlockSize();
            if (output.length < outSize) {
                const paddedOutput: Uint8Array = new Uint8Array(outSize);
                paddedOutput.set(output, outSize - output.length);
                return paddedOutput;
            }
        }
        return output;
    }
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
        return _modPow(input, this._key.exponent, this._key.modulus);
    }
}
export class _PdfRsaAlgorithm implements _ICipherBlock {
    private _rsaCoreEngine: _PdfRsaCoreAlgorithm = new _PdfRsaCoreAlgorithm();
    private _key: any; //eslint-disable-line
    _getAlgorithmName(): string {
        return 'RSA';
    }
    _getInputBlock(): number {
        return this._rsaCoreEngine._getInputBlockSize();
    }
    _getOutputBlock(): number {
        return this._rsaCoreEngine._getOutputBlockSize();
    }
    _initialize(isEncryption: boolean, parameter: _PdfCipherParameter): void {
        this._rsaCoreEngine._initialize(isEncryption, parameter);
        this._key = parameter;
    }
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
