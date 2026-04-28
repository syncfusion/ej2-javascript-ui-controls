import { _PdfCipherParameter } from '../x509/x509-cipher-handler';

/**
 * Defines the internal block-cipher contract for RSA-like engines with block sizing and processing.
 *
 * @private
 */
export interface _ICipherBlock {
    /**
     * Gets the internal algorithm name for this cipher implementation.
     *
     * @private
     * @returns {string} The algorithm name.
     */
    _getAlgorithmName(): string;
    /**
     * Gets the maximum input block size in bytes supported by the cipher in the current mode.
     *
     * @private
     * @returns {number} The input block size in bytes.
     */
    _getInputBlock(): number;
    /**
     * Gets the maximum output block size in bytes produced by the cipher in the current mode.
     *
     * @private
     * @returns {number} The output block size in bytes.
     */
    _getOutputBlock(): number;
    /**
     * Initializes the cipher for encryption or decryption with the provided parameters.
     *
     * @private
     * @param {boolean} isEncryption Specifies whether to initialize for encryption (true) or decryption (false).
     * @param {_PdfCipherParameter} parameter The cipher parameters or key material.
     * @returns {void} This method does not return a value.
     */
    _initialize(isEncryption: boolean, parameter: _PdfCipherParameter): void;
    /**
     * Processes a block of data using the configured cipher operation.
     *
     * @private
     * @param {Uint8Array} bytes The input buffer containing data.
     * @param {number} offset The starting index of the block within the buffer.
     * @param {number} length The number of bytes to process.
     * @returns {Uint8Array} The processed output block.
     */
    _processBlock(bytes: Uint8Array, offset: number, length: number): Uint8Array;
}
/**
 * Defines the internal parameter contract for cipher configurations and key material.
 *
 * @private
 */
export interface _ICipherParam {
    /**
     * Determines whether this parameter is equal to another.
     *
     * @private
     * @param {any} other The other parameter instance to compare. // eslint-disable-line
     * @returns {boolean} True if the parameters are equal; otherwise, false.
     */
    _equals(other: any): boolean; // eslint-disable-line
    /**
     * Gets a hash code representing the parameter instance.
     *
     * @private
     * @returns {number} The computed hash code.
     */
    _getHashCode(): number;
}
/**
 * Defines the internal signer contract for generating signatures over streamed data.
 *
 * @private
 */
export interface _ISigner {
    /**
     * Gets the canonical algorithm name for the signer (e.g., "SHA-256").
     *
     * @private
     */
    readonly _algorithmName: string;
    /**
     * Initializes the signer for signature generation or verification.
     *
     * @private
     * @param {boolean} forSigning Specifies whether to prepare for signing (true) or verification (false).
     * @param {_ICipherParam} parameters The key parameters used by the signer.
     * @returns {void} This method does not return a value.
     */
    _initialize(forSigning: boolean, parameters: _ICipherParam): void;
    /**
     * Feeds a segment of bytes into the ongoing signature digest computation.
     *
     * @private
     * @param {Uint8Array} bytes The input buffer to read from.
     * @param {number} offset The starting index within the buffer.
     * @param {number} length The number of bytes to process.
     * @returns {void} This method does not return a value.
     */
    _blockUpdate(bytes: Uint8Array, offset: number, length: number): void;
    /**
     * Finalizes the computation and returns the generated signature bytes.
     *
     * @private
     * @returns {Uint8Array} The computed signature.
     */
    _generateSignature(): Uint8Array | null;
    /**
     * Resets the signer state and internal buffers.
     *
     * @private
     * @returns {void} This method does not return a value.
     */
    _reset(): void;
}


