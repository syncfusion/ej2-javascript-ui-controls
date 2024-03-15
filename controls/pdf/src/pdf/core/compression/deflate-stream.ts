import { _Inflater } from './inflater';

export class _DeflateStream {
    _data: number[];
    _leaveOpen: boolean;
    _offset: number;
    _buffer: number[];
    _inflater: _Inflater;
    constructor(data: number[], offset: number, leaveOpen: boolean) {
        this._offset = offset;
        this._data = data;
        this._leaveOpen = leaveOpen;
        this._inflater = new _Inflater();
        this._buffer = Array<number>(8192).fill(0);
    }
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
    _readBytes(): {buffer: number[], count: number} {
        if (this._offset >= this._data.length) {
            return {buffer: [], count: 0};
        } else {
            let count: number = 0;
            for (let i: number = 0; i < this._buffer.length && i + this._offset < this._data.length; i++) {
                this._buffer[Number.parseInt(i.toString(), 10)] = this._data[this._offset + i];
                count++;
            }
            this._offset += count;
            return {buffer: this._buffer, count: count};
        }
    }
}
