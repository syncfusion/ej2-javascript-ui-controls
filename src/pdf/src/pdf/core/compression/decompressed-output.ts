import { _copyRange } from './../utils';
import { _InBuffer } from './in-buffer';

export class _DecompressedOutput {
    constructor() {
        this._dOutput = Array<number>(_DecompressedOutput._dOutSize).fill(0);
        this._end = 0;
        this._usedBytes = 0;
    }
    static _dOutSize: number = 32768;
    static _dOutMask: number = 32767;
    _dOutput: number[];
    _end: number = 0;
    _usedBytes: number = 0;
    get _unusedBytes(): number {
        return _DecompressedOutput._dOutSize - this._usedBytes;
    }
    _write(b: number): void {
        this._dOutput[this._end++] = b;
        this._end &= _DecompressedOutput._dOutMask;
        ++this._usedBytes;
    }
    _writeLD(length: number, distance: number): void {
        this._usedBytes += length;
        let copyStart: number = (this._end - distance) & _DecompressedOutput._dOutMask;
        const border: number = _DecompressedOutput._dOutSize - length;
        if (copyStart <= border && this._end < border) {
            if (length <= distance) {
                _copyRange(this._dOutput, this._end, this._dOutput, copyStart, copyStart + length);
                this._end += length;
            } else {
                while (length-- > 0) {
                    this._dOutput[this._end++] = this._dOutput[copyStart++];
                }
            }
        } else {
            while (length-- > 0) {
                this._dOutput[this._end++] = this._dOutput[copyStart++];
                this._end &= _DecompressedOutput._dOutMask;
                copyStart &= _DecompressedOutput._dOutMask;
            }
        }
    }
    _copyFrom(input: _InBuffer, length: number): number {
        length = Math.min(Math.min(length, _DecompressedOutput._dOutSize - this._usedBytes), input._bytes);
        let copied: number;
        const tailLen: number = _DecompressedOutput._dOutSize - this._end;
        if (length > tailLen) {
            copied = input._copyTo(this._dOutput, this._end, tailLen);
            if (copied === tailLen) {
                copied += input._copyTo(this._dOutput, 0, length - tailLen);
            }
        } else {
            copied = input._copyTo(this._dOutput, this._end, length);
        }
        this._end = (this._end + copied) & _DecompressedOutput._dOutMask;
        this._usedBytes += copied;
        return copied;
    }
    _copyTo(output: number[], offset: number, length: number): {count: number, data: number[]} {
        let end: number;
        if (length > this._usedBytes) {
            end = this._end;
            length = this._usedBytes;
        } else {
            end = (this._end - this._usedBytes + length) & _DecompressedOutput._dOutMask;
        }
        const copied: number = length;
        const tailLen: number = length - end;
        let sourceStart: number = _DecompressedOutput._dOutSize - tailLen;
        if (tailLen > 0) {
            for (let i: number = 0; i < tailLen && i + sourceStart < this._dOutput.length && i + offset < output.length; i++) {
                output[offset + i] = this._dOutput[sourceStart + i];
            }
            const sourceStartIndex: number = _DecompressedOutput._dOutSize - tailLen;
            _copyRange(output, offset, this._dOutput, sourceStartIndex, sourceStartIndex + tailLen);
            offset += tailLen;
            length = end;
        }
        sourceStart = end - length;
        const sourceStartIndex: number = end - length;
        _copyRange(output, offset, this._dOutput, sourceStartIndex, end);
        this._usedBytes -= copied;
        return {'count': copied, 'data': output};
    }
}
