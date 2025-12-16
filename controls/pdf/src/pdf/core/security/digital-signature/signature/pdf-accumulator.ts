export class _PdfNativeAccumulatorSink {
    _result: Uint8Array;
    _events: Array<{bytes: Uint8Array}> = [];
    _add(event: {bytes: Uint8Array}): void {
        this._events.push(event);
        this._result = event.bytes;
    }
    _setResult(result: Uint8Array): void {
        this._result = result;
        this._events = [{bytes: result}];
    }
    _getResult(): Uint8Array | null {
        if (this._events.length > 0) {
            return this._events[this._events.length - 1].bytes;
        }
        return this._result;
    }
}
export class _PdfNativeHashInput {
    private _hasher: any; //eslint-disable-line
    private _outputSink: _PdfNativeAccumulatorSink;
    private _buffer: number[] = [];
    private _closed: boolean = false;
    constructor(hasher: any, outputSink: _PdfNativeAccumulatorSink) { //eslint-disable-line
        this._hasher = hasher;
        this._outputSink = outputSink;
    }
    _add(data: Uint8Array): void {
        if (this._closed) {
            throw new Error('Cannot add data to closed hash input');
        }
        for (let i: number = 0; i < data.length; i++) {
            this._buffer.push(data[<number>i]);
        }
    }
    _close(): void {
        if (this._closed) {
            return;
        }
        this._closed = true;
        if (this._buffer.length > 0) {
            const inputData: Uint8Array = new Uint8Array(this._buffer);
            const result: Uint8Array = this._hasher._hash(inputData, 0, inputData.length);
            this._outputSink._add({bytes: result});
        }
    }
}
export class _PdfNativeAlgorithmIdentifier {
    private _oid: string;
    constructor(oid: string) {
        this._oid = oid;
    }
    _getEncoded(): Uint8Array {
        const oidBytes: Uint8Array = this._encodeObjectIdentifier(this._oid);
        const nullBytes: Uint8Array = new Uint8Array([0x05, 0x00]);
        const contentLength: number = oidBytes.length + nullBytes.length;
        const result: number[] = [];
        result.push(0x30);
        result.push(contentLength);
        result.push(...Array.from(oidBytes));
        result.push(...Array.from(nullBytes));
        return new Uint8Array(result);
    }
    _encodeObjectIdentifier(oidString: string): Uint8Array {
        const parts: number[] = oidString.split('.').map(Number);
        const bytes: number[] = [];
        bytes.push(parts[0] * 40 + parts[1]);
        for (let i: number = 2; i < parts.length; i++) {
            let value: number = parts[<number>i];
            if (value < 128) {
                bytes.push(value);
            } else {
                const temp: number[] = [];
                while (value > 0) {
                    temp.unshift(value & 0x7F);
                    value = Math.floor(value / 128);
                }
                for (let j: number = 0; j < temp.length - 1; j++) {
                    temp[<number>j] |= 0x80;
                }
                bytes.push(...temp);
            }
        }
        const result: number[] = [];
        result.push(0x06);
        result.push(bytes.length);
        result.push(...bytes);
        return new Uint8Array(result);
    }
}
