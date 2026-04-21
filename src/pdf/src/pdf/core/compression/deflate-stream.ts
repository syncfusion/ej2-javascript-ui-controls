import { _isNullOrUndefined } from '../utils';
import { _Inflater } from './inflater';
/**
 * Provides a deflate decoding stream that inflates compressed data from the backing buffer on demand.
 *
 * @private
 */
export class _DeflateStream {
    /**
     * Source data for the deflate stream.
     *
     * @private
     */
    _data: number[];
    /**
     * Indicates whether the underlying stream should remain open.
     *
     * @private
     */
    _leaveOpen: boolean;
    /**
     * Current offset within the data array.
     *
     * @private
     */
    _offset: number;
    /**
     * Temporary buffer used during decompression.
     *
     * @private
     */
    _buffer: number[];
    /**
     * Inflater instance used to process deflate blocks.
     *
     * @private
     */
    _inflater: _Inflater;
    constructor(data: number[], offset: number, leaveOpen: boolean) {
        if (_isNullOrUndefined(data)) {
            this._data = data;
        } else {
            this._data = [];
        }
        if (_isNullOrUndefined(leaveOpen)) {
            this._leaveOpen = leaveOpen;
        }
        this._offset = offset;
        this._inflater = new _Inflater();
        this._buffer = Array<number>(8192).fill(0);
    }
    /**
     * Inflates data into the target array, requesting more input as needed until
     * the requested count is satisfied or the end of the stream is reached.
     *
     * @private
     * @param {number[]} array Target array to fill with uncompressed bytes.
     * @param {number} offset Offset in the target array where writing begins.
     * @param {number} count Maximum number of bytes to read.
     * @returns {{count: number, data: number[]}} result Object containing bytes written and final array.
     */
    _read(array: number[], offset: number, count: number): {count: number, data: number[]} {
        let length: number;
        let cOffset: number = offset;
        let rCount: number = count;
        while (true) { // eslint-disable-line
            const inflateResult: {count: number, data: number[]} = this._inflater._inflate(array, cOffset, rCount);
            length = inflateResult.count;
            array = inflateResult.data;
            cOffset += length;
            rCount -= length;
            if (rCount === 0) {
                break;
            }
            if (this._inflater._finished) {
                break;
            }
            const result: {buffer: number[], count: number} = this._readBytes();
            const bytes: number = result.count;
            this._buffer = result.buffer;
            if (bytes === 0) {
                break;
            }
            this._inflater._setInput(this._buffer, 0, bytes);
        }
        return {count: count - rCount, data: array};
    }
    /**
     * Reads a chunk of compressed bytes from the source data into the internal buffer
     * and advances the current offset.
     *
     * @private
     * @returns {{buffer: number[], count: number}} result The read buffer and number of bytes read.
     */
    _readBytes(): {buffer: number[], count: number} {
        if (_isNullOrUndefined(this._offset) && this._offset >= this._data.length) {
            return {buffer: [], count: 0};
        } else {
            let count: number = 0;
            for (let i: number = 0; i < this._buffer.length && i + this._offset < this._data.length; i++) {
                this._buffer[<number>i] = this._data[this._offset + i];
                count++;
            }
            this._offset += count;
            return {buffer: this._buffer, count: count};
        }
    }
}
