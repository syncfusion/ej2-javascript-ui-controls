
/**
 * Provides an internal sink that accumulates hash or encoding results,
 * tracking appended byte events and the latest result.
 *
 * @private
 */
export class _PdfNativeAccumulatorSink {
    /**
     * Holds the most recently computed result bytes.
     *
     * @private
     */
    _result: Uint8Array;
    /**
     * Maintains the ordered list of events appended to the sink.
     *
     * @private
     */
    _events: Array<{bytes: Uint8Array}> = [];
    /* eslint-disable */
    /**
     * Appends a new byte event to the sink and updates the current result.
     *
     * @private
     * @param {{bytes: Uint8Array}} event The event containing the bytes to add. // eslint-disable-line
     * @returns {void} nothing.
     */
    _add(event: {bytes: Uint8Array}): void {
        this._events.push(event);
        this._result = event.bytes;
    }
    /* eslint-enable */
    /**
     * Sets the accumulator result and replaces the internal event list with a single entry.
     *
     * @private
     * @param {Uint8Array} result The byte sequence to assign as the current result.
     * @returns {void} nothing.
     */
    _setResult(result: Uint8Array): void {
        this._result = result;
        this._events = [{bytes: result}];
    }
    /**
     * Retrieves the most recently stored result bytes from the accumulator.
     *
     * @private
     * @returns {Uint8Array | null} The latest events byte value, or the stored result if no events exist.
     */
    _getResult(): Uint8Array | null {
        if (this._events.length > 0) {
            return this._events[this._events.length - 1].bytes;
        }
        return this._result;
    }
}

/**
 * Provides an internal buffered hash input adapter that accepts byte chunks
 * and emits the final digest to an accumulator sink on close.
 *
 * @private
 */
export class _PdfNativeHashInput {
    private _hasher: any; //eslint-disable-line
    private _outputSink: _PdfNativeAccumulatorSink;
    private _buffer: number[] = [];
    private _closed: boolean = false;
    constructor(hasher: any, outputSink: _PdfNativeAccumulatorSink) { //eslint-disable-line
        this._hasher = hasher;
        this._outputSink = outputSink;
    }
    /**
     * Appends a chunk of data to the internal buffer for later hashing.
     *
     * @private
     * @param {Uint8Array} data The byte array to append.
     * @throws {Error} Thrown if data is added after the input is closed.
     * @returns {void} nothing.
     */
    _add(data: Uint8Array): void {
        if (this._closed) {
            throw new Error('Cannot add data to closed hash input');
        }
        for (let i: number = 0; i < data.length; i++) {
            this._buffer.push(data[<number>i]);
        }
    }
    /**
     * Finalizes the input, computes the hash over the buffered data, and pushes the result
     * to the output sink. Subsequent calls are ignored.
     *
     * @private
     * @returns {void} This method does not return a value.
     */
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
/**
 * Represents an internal ASN.1 AlgorithmIdentifier encoder that produces
 * DER-encoded bytes for an algorithm OID with a NULL parameter.
 *
 * @private
 */
export class _PdfNativeAlgorithmIdentifier {
    private _oid: string;
    constructor(oid: string) {
        this._oid = oid;
    }
    /**
     * Encodes the algorithm identifier as DER: SEQUENCE { OBJECT IDENTIFIER, NULL }.
     *
     * @private
     * @returns {Uint8Array} The DER-encoded AlgorithmIdentifier bytes.
     */
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
    /**
     * Encodes a dotted string object identifier (e.g., "1.2.840.113549") into DER form.
     *
     * @private
     * @param {string} oidString The dotted OID string to encode.
     * @returns {Uint8Array} The DER-encoded OBJECT IDENTIFIER bytes.
     */
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
