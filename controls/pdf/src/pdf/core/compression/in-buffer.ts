import { _toUnsigned } from './../utils';

export class _InBuffer {
    _buffer: number[];
    _begin: number;
    _end: number;
    _bBuffer: number;
    _bInBuffer: number;
    constructor() {
        this._bBuffer = 0;
        this._bInBuffer = 0;
        this._begin = 0;
        this._end = 0;
    }
    get _bytes(): number {
        return (this._end - this._begin) + Math.floor(this._bInBuffer / 8);
    }
    _needsInput(): boolean {
        return this._begin === this._end;
    }
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
    _getBitMask(count: number): number {
        return (_toUnsigned(1, 32) << count) - 1;
    }
    _getBits(count: number): number {
        if (!this._availableBits(count)) {
            return -1;
        }
        const result: number = this._bBuffer & this._getBitMask(count);
        this._bBuffer >>= count;
        this._bInBuffer -= count;
        return result;
    }
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
    _setInput(buffer: number[], offset: number, length: number): void {
        this._buffer = buffer;
        this._begin = offset;
        this._end = offset + length;
    }
    _skipBits(n: number): void {
        this._bBuffer >>= n;
        this._bInBuffer -= n;
    }
    _skipByteBoundary(): void {
        this._bBuffer >>= this._bInBuffer % 8;
        this._bInBuffer = this._bInBuffer - (this._bInBuffer % 8);
    }
}
