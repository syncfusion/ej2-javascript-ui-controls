import { _toUnsigned } from './../utils';

/**
 * Provides a bitwise input buffer supporting incremental bit loading and byte-aligned copying.
 *
 * @private
 */
export class _InBuffer {
    /**
     * Input byte buffer for bit-level reads.
     *
     * @private
     */
    _buffer: number[];
    /**
     * Start index of unread data in the buffer.
     *
     * @private
     */
    _begin: number;
    /**
     * End index of unread data in the buffer.
     *
     * @private
     */
    _end: number;
    /**
     * Bit buffer accumulating incoming bits.
     *
     * @private
     */
    _bBuffer: number;
    /**
     * Number of valid bits currently in the bit buffer.
     *
     * @private
     */
    _bInBuffer: number;
    constructor() {
        this._bBuffer = 0;
        this._bInBuffer = 0;
        this._begin = 0;
        this._end = 0;
    }
    /**
     * Gets the total number of full bytes currently available including pending bit buffer.
     *
     * @private
     * @returns {number} bytes.
     */
    get _bytes(): number {
        return (this._end - this._begin) + Math.floor(this._bInBuffer / 8);
    }
    /**
     * Indicates whether more input bytes are needed for further decoding.
     *
     * @private
     * @returns {boolean} needsInput.
     */
    _needsInput(): boolean {
        return this._begin === this._end;
    }
    /**
     * Ensures the requested number of bits are available by pulling bytes into the bit buffer.
     *
     * @private
     * @param {number} count Number of bits required.
     * @returns {boolean} available.
     */
    _availableBits(count: number): boolean {
        if (this._bInBuffer < count) {
            if (this._needsInput()) {
                return false;
            }
            this._bBuffer |= _toUnsigned(this._buffer[this._begin++], 32) << this._bInBuffer;
            this._bInBuffer += 8;
            if (this._bInBuffer < count) {
                if (this._needsInput()) {
                    return false;
                }
                this._bBuffer |= _toUnsigned(this._buffer[this._begin++], 32) << this._bInBuffer;
                this._bInBuffer += 8;
            }
        }
        return true;
    }
    /**
     * Loads up to 16 bits into the bit buffer and returns the current bit buffer value.
     *
     * @private
     * @returns {number} bitBuffer.
     */
    _load16Bits(): number {
        if (this._bInBuffer < 8) {
            if (this._begin < this._end) {
                this._bBuffer |= _toUnsigned(this._buffer[this._begin++], 32) << this._bInBuffer;
                this._bInBuffer += 8;
            }
            if (this._begin < this._end) {
                this._bBuffer |= _toUnsigned(this._buffer[this._begin++], 32) << this._bInBuffer;
                this._bInBuffer += 8;
            }
        } else if (this._bInBuffer < 16) {
            if (this._begin < this._end) {
                this._bBuffer |= _toUnsigned(this._buffer[this._begin++], 32) << this._bInBuffer;
                this._bInBuffer += 8;
            }
        }
        return this._bBuffer;
    }
    /**
     * Returns a bit mask with the lowest count bits set.
     *
     * @private
     * @param {number} count Number of low bits to set.
     * @returns {number} mask.
     */
    _getBitMask(count: number): number {
        return (_toUnsigned(1, 32) << count) - 1;
    }
    /**
     * Retrieves the specified number of bits from the bit buffer and advances the bit position.
     *
     * @private
     * @param {number} count Number of bits to read.
     * @returns {number} value or -1 when insufficient bits.
     */
    _getBits(count: number): number {
        if (!this._availableBits(count)) {
            return -1;
        }
        const result: number = this._bBuffer & this._getBitMask(count);
        this._bBuffer >>= count;
        this._bInBuffer -= count;
        return result;
    }
    /**
     * Copies bytes into the target array from the buffered bits and underlying input, returning the count copied.
     *
     * @private
     * @param {number[]} output Destination buffer.
     * @param {number} offset Start index in the destination buffer.
     * @param {number} length Maximum number of bytes to copy.
     * @returns {number} copied.
     */
    _copyTo(output: number[], offset: number, length: number): number {
        let bitBuffer: number = 0;
        while (this._bInBuffer > 0 && length > 0) {
            output[offset++] = _toUnsigned(this._bBuffer, 8);
            this._bBuffer >>= 8;
            this._bInBuffer -= 8;
            length--;
            bitBuffer++;
        }
        if (length === 0) {
            return bitBuffer;
        }
        const avail: number = this._end - this._begin;
        if (length > avail) {
            length = avail;
        }
        for (let i: number = 0; i < length && i + this._begin < this._buffer.length && i + offset < output.length; i++) {
            output[offset + i] = this._buffer[this._begin + i];
        }
        this._begin += length;
        return bitBuffer + length;
    }
    /**
     * Sets the underlying input buffer range for subsequent bit loading operations.
     *
     * @private
     * @param {number[]} buffer Source input buffer.
     * @param {number} offset Start index of the input window.
     * @param {number} length Number of bytes available from offset.
     * @returns {void} nothing.
     */
    _setInput(buffer: number[], offset: number, length: number): void {
        this._buffer = buffer;
        this._begin = offset;
        this._end = offset + length;
    }
    /**
     * Skips the specified number of bits in the bit buffer.
     *
     * @private
     * @param {number} n Number of bits to skip.
     * @returns {void} nothing.
     */
    _skipBits(n: number): void {
        this._bBuffer >>= n;
        this._bInBuffer -= n;
    }
    /**
     * Advances to the next byte boundary by discarding any remaining bits in the current byte.
     *
     * @private
     * @returns {void} nothing.
     */
    _skipByteBoundary(): void {
        this._bBuffer >>= this._bInBuffer % 8;
        this._bInBuffer = this._bInBuffer - (this._bInBuffer % 8);
    }
}
