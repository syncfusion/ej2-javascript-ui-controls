import { _PdfCipherParameter } from '../x509/x509-cipher-handler';
import { _ICipherBlock } from './pdf-interfaces';
/**
 * Provides the internal PKCS#1 v1.5 padding wrapper around a block cipher,
 * exposing RSA style input/output block sizing and processing.
 *
 * @private
 */
export class _PdfCryptographicEncoding implements _ICipherBlock {
    private _cipher: _ICipherBlock;
    private _isEncryption: boolean;
    private _isPrivateKey: boolean;
    constructor(cipher: _ICipherBlock) {
        this._cipher = cipher;
    }
    /**
     * Gets the algorithm name with PKCS#1 padding suffix.
     *
     * @private
     * @returns {string} The algorithm name in the form "<cipher>/PKCS1Padding".
     */
    _getAlgorithmName(): string {
        return `${this._cipher._getAlgorithmName()}/PKCS1Padding`;
    }
    /**
     * Gets the maximum input block size in bytes for the current mode with PKCS#1 padding.
     *
     * @private
     * @returns {number} The input block size in bytes.
     */
    _getInputBlock(): number {
        return this._isEncryption ? this._cipher._getInputBlock() - 10 : this._cipher._getInputBlock();
    }
    /**
     * Gets the maximum output block size in bytes for the current mode with PKCS#1 padding.
     *
     * @private
     * @returns {number} The output block size in bytes.
     */
    _getOutputBlock(): number {
        return this._isEncryption ? this._cipher._getOutputBlock() : this._cipher._getOutputBlock() - 10;
    }
    /**
     * Initializes the cryptographic encoding with the specified mode and key parameters.
     *
     * @private
     * @param {boolean} forEncryption Specifies whether to operate in encryption mode.
     * @param {_PdfCipherParameter} parameters The cipher parameters.
     * @returns {void} nothing.
     */
    _initialize(forEncryption: boolean, parameters: _PdfCipherParameter): void {
        this._cipher._initialize(forEncryption, parameters);
        this._isPrivateKey = parameters._isPrivate;
        this._isEncryption = forEncryption;
    }
    /**
     * Processes a single block by applying PKCS#1 padding (on encrypt) or removing it (on decrypt).
     *
     * @private
     * @param {Uint8Array} input The input buffer containing the block.
     * @param {number} inOff The start index within the input buffer.
     * @param {number} length The number of bytes to process.
     * @returns {Uint8Array} The uintarray returns.
     */
    _processBlock(input: Uint8Array, inOff: number, length: number): Uint8Array {
        return this._isEncryption ?
            this._encodeBlock(input, inOff, length) :
            this._decodeBlock(input, inOff, length);
    }
    /**
     * Encodes (pads) a block using PKCS#1 v1.5 padding rules.
     *
     * @private
     * @param {Uint8Array} input The plaintext input buffer.
     * @param {number} inOff The start index within the input buffer.
     * @param {number} inLen The number of bytes to read from the input buffer.
     * @returns {Uint8Array} The padded block ready for RSA processing.
     */
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
    /**
     * Decodes (unpads) a block using PKCS#1 v1.5 padding rules and validates its structure.
     *
     * @private
     * @param {Uint8Array} input The ciphertext input buffer.
     * @param {number} inOff The start index within the input buffer.
     * @param {number} inLen The number of bytes to read from the input buffer.
     * @returns {Uint8Array} The recovered message bytes after removing padding.
     */
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
