import { _PdfStream } from './../../base-stream';
import { _ImageFormat } from './../../enumerator';
export abstract class _ImageDecoder {
    _stream: Uint8Array;
    _format: _ImageFormat = _ImageFormat.unknown;
    _height: number = 0;
    _width: number = 0;
    _bitsPerComponent: number = 8;
    _imageData: Uint8Array;
    _imageStream: _PdfStream;
    _maskStream: _PdfStream;
    _position: number = 0;
    _noOfComponents: number = -1;
    _reset(): void {
        this._position = 0;
    }
    _getBuffer(index: number): number {
        return this._stream[Number.parseInt(index.toString(), 10)];
    }
    _read(buffer: Uint8Array, offset: number, count: number): void
    _read(buffer: number[], offset: number, count: number, stream: number[]): {outputBuffer: number[], offset: number, length: number}
    _read(buffer: Uint8Array | number[],
          offset: number,
          count: number,
          stream?: number[]): void | {outputBuffer: number[], offset: number, length: number} {
        if (stream && Array.isArray(stream)) {
            let result: number = 0;
            if (count <= stream.length && stream.length - offset >= count) {
                for (let i: number = 0; i < count; i++) {
                    buffer[Number.parseInt(i.toString(), 10)] = stream[Number.parseInt(offset.toString(), 10)];
                    offset++;
                    result++;
                }
            }
            return {'outputBuffer': buffer as number[], 'offset': offset, 'length': result};
        } else {
            for (let index: number = offset; index < count; index++) {
                const position: number = this._position;
                buffer[Number.parseInt(index.toString(), 10)] = this._getBuffer(position);
                this._position++;
            }
        }
    }
    _readString(length: number): string {
        let result: string = '';
        for (let i: number = 0; i < length; i++) {
            result += String.fromCharCode(this._readByte());
        }
        return result;
    }
    _seek(length: number): void {
        this._position += length;
    }
    _readByte(): number {
        if (this._position < this._stream.byteLength) {
            const value: number = this._getBuffer(this._position);
            this._position += 1;
            return value;
        } else {
            throw new Error('Error decoding JPEG image. Invalid offset.');
        }
    }
    _toUnsigned16(value: number): number {
        value = value & 0xFFFF;
        return value < 0 ? (value + 0x10000) : value;
    }
    _readUnsigned32(offset: number): number {
        const i1: number = this._getBuffer(offset + 3);
        const i2: number = this._getBuffer(offset + 2);
        const i3: number = this._getBuffer(offset + 1);
        const i4: number = this._getBuffer(offset);
        return i1 | (i2 << 8) | (i3 << 16) | (i4 << 24);
    }
    abstract _getImageDictionary(): _PdfStream;
    abstract _initialize(): void;
    abstract _readHeader(): void;
}
