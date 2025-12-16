import { _PdfCipherParameter } from '../x509/x509-cipher-handler';
import { _ICipherBlock } from './pdf-interfaces';
export class _PdfCryptographicEncoding implements _ICipherBlock {
    private _cipher: _ICipherBlock;
    private _isEncryption: boolean;
    private _isPrivateKey: boolean;
    constructor(cipher: _ICipherBlock) {
        this._cipher = cipher;
    }
    _getAlgorithmName(): string {
        return `${this._cipher._getAlgorithmName()}/PKCS1Padding`;
    }
    _getInputBlock(): number {
        return this._isEncryption ? this._cipher._getInputBlock() - 10 : this._cipher._getInputBlock();
    }
    _getOutputBlock(): number {
        return this._isEncryption ? this._cipher._getOutputBlock() : this._cipher._getOutputBlock() - 10;
    }
    _initialize(forEncryption: boolean, parameters: _PdfCipherParameter): void {
        this._cipher._initialize(forEncryption, parameters);
        this._isPrivateKey = parameters._isPrivate;
        this._isEncryption = forEncryption;
    }
    _processBlock(input: Uint8Array, inOff: number, length: number): Uint8Array {
        return this._isEncryption ?
            this._encodeBlock(input, inOff, length) :
            this._decodeBlock(input, inOff, length);
    }
    _encodeBlock(input: Uint8Array, inOff: number, inLen: number): Uint8Array {
        if (inLen > this._getInputBlock()) {
            throw new Error('Input data too large for PKCS#1 padding.');
        }
        const block: Uint8Array = new Uint8Array(this._cipher._getInputBlock());
        if (this._isPrivateKey) {
            block[0] = 0x01;
            for (let i: number = 1; i < block.length - inLen - 1; i++) {
                block[<number>i] = 0xFF;
            }
        } else {
            block[0] = 0x02;
            for (let i: number = 1; i < block.length - inLen - 1; i++) {
                let randomByte: number;
                do {
                    randomByte = Math.floor(Math.random() * 255) + 1;
                } while (randomByte === 0);
                block[<number>i] = randomByte;
            }
        }
        block[block.length - inLen - 1] = 0x00;
        block.set(input.subarray(inOff, inOff + inLen), block.length - inLen);
        return this._cipher._processBlock(block, 0, block.length);
    }
    _decodeBlock(input: Uint8Array, inOff: number, inLen: number): Uint8Array {
        const block: Uint8Array = this._cipher._processBlock(input, inOff, inLen);
        if (block.length < this._getOutputBlock()) {
            throw new Error('Data block is truncated.');
        }
        const type: number = block[0];
        if (type !== 1 && type !== 2) {
            throw new Error(`Invalid block type: ${type}.`);
        }
        let separatorIndex: number = -1;
        for (let i: number = 1; i < block.length; i++) {
            if (block[<number>i] === 0x00) {
                separatorIndex = i;
                break;
            }
            if (type === 1 && block[<number>i] !== 0xFF) {
                throw new Error('Invalid PKCS#1 padding: bad padding byte.');
            }
        }
        if (separatorIndex === -1 || separatorIndex < 9) {
            throw new Error('Invalid PKCS#1 padding: separator not found or too short.');
        }
        return block.subarray(separatorIndex + 1);
    }
}
