import { FormatError } from '@syncfusion/ej2-pdf';
/**
 * Reader that parses a binary CMap stream and populates a character map.
 *
 * @private
 */
export class _PdfBinaryCharacterMapReader {
    /**
     * Maximum byte length used for temporary buffers while decoding.
     *
     * @private
     */
    _maximumSize: number = 16;
    /**
     * Converts a big-endian byte array (hex) to an unsigned integer.
     *
     * @private
     * @param {Uint8Array} data Byte array containing big-endian bytes.
     * @param {number} size Index of the last byte to include (0-based).
     * @returns {number} The converted unsigned integer.
     */
    _convertHexToInt(data: Uint8Array, size: number): number {
        let n: number = 0;
        for (let i: number = 0; i <= size; i++) {
            n = (n << 8) | data[Number.parseInt(i.toString(), 10)];
        }
        return n >>> 0;
    }
    /**
     * Converts a byte array slice into a JavaScript string (UTF-16 code units).
     *
     * @private
     * @param {any} data Byte array or typed array containing character codes.
     * @param {number} size Last index (0-based) to include in the output.
     * @returns {string} The resulting string from the provided bytes.
     */
    _hexArrayToString(data: any, size: number): string { //eslint-disable-line
        if (size === 1) {
            return String.fromCharCode(data[0], data[1]);
        }
        if (size === 3) {
            return String.fromCharCode(data[0], data[1], data[2], data[3]);
        }
        return String.fromCharCode(...data.subarray(0, size + 1));
    }
    /**
     * Adds two multi-byte big-endian arrays (place-wise) storing the result
     * back into the first array.
     *
     * @private
     * @param {Uint8Array} data Target byte array which receives the sum.
     * @param {Uint8Array} incrementData Byte array to add to the target.
     * @param {number} size Index of the last byte (0-based) to process.
     * @returns {void} nothing.
     */
    _addHexData(data: Uint8Array, incrementData: Uint8Array, size: number): void {
        let c: number = 0;
        for (let i: number = size; i >= 0; i--) {
            c += data[Number.parseInt(i.toString(), 10)] + incrementData[Number.parseInt(i.toString(), 10)];
            data[Number.parseInt(i.toString(), 10)] = c & 255;
            c >>= 8;
        }
    }
    /**
     * Increments a multi-byte big-endian number stored in a byte array.
     *
     * @private
     * @param {Uint8Array} data Byte array holding the big-endian number.
     * @param {number} size Last index (0-based) to increment.
     * @returns {void} nothing.
     */
    _performHexIncrement(data: Uint8Array, size: number): void {
        let c: number = 1;
        for (let i: number = size; i >= 0 && c > 0; i--) {
            c += data[Number.parseInt(i.toString(), 10)];
            data[Number.parseInt(i.toString(), 10)] = c & 255;
            c >>= 8;
        }
    }
    /**
     * Processes the binary CMap stream and populates the provided character map.
     *
     * @private
     * @param {any} data Raw CMap binary data (typed array or buffer).
     * @param {any} characterMap Target character map object to populate.
     * @param {any} enhance Optional callback to resolve useCharacterMap values.
     * @returns {any} The populated character map or the result of `enhance` when used.
     */
    _process(data: any, characterMap: any, enhance: any) { // eslint-disable-line
        const stream: _PdfBinaryCMapStream = new _PdfBinaryCMapStream(data);
        const header: any = stream._readByteData(); // eslint-disable-line
        characterMap.vertical = !!(header & 1);
        let useCharacterMap: any;// eslint-disable-line
        const start: Uint8Array = new Uint8Array(this._maximumSize);
        const end: Uint8Array = new Uint8Array(this._maximumSize);
        const char: Uint8Array = new Uint8Array(this._maximumSize);
        const charCode: Uint8Array = new Uint8Array(this._maximumSize);
        const temp: Uint8Array = new Uint8Array(this._maximumSize);
        let code: number;
        let b: any; // eslint-disable-line
        while ((b = stream._readByteData()) >= 0) { // eslint-disable-line
            const type: number = b >> 5;
            if (type === 7) {
                switch (b & 0x1f) {
                case 0:
                    stream._readStringFromData();
                    break;
                case 1:
                    useCharacterMap = stream._readStringFromData();
                    break;
                }
                continue;
            }
            const sequence: boolean = !!(b & 0x10);
            const dataSize: number = b & 15;
            if (dataSize + 1 > this._maximumSize) {
                throw new FormatError('BinaryCMapReader has encountered an invalid dataSize value.');
            }
            const universalCharset: number = 1;
            const childItemsCount: number = stream._readNumber();
            switch (type) {
            case 0:
                stream._readHexData(start, dataSize);
                stream._readHexDataNumber(end, dataSize);
                this._addHexData(end, start, dataSize);
                characterMap._insertCodeSpaceRange(
                    dataSize + 1,
                    this._convertHexToInt(start, dataSize),
                    this._convertHexToInt(end, dataSize)
                );
                for (let i: number = 1; i < childItemsCount; i++) {
                    this._performHexIncrement(end, dataSize);
                    stream._readHexDataNumber(start, dataSize);
                    this._addHexData(start, end, dataSize);
                    stream._readHexDataNumber(end, dataSize);
                    this._addHexData(end, start, dataSize);
                    characterMap._insertCodeSpaceRange(
                        dataSize + 1,
                        this._convertHexToInt(start, dataSize),
                        this._convertHexToInt(end, dataSize)
                    );
                }
                break;
            case 1:
                stream._readHexData(start, dataSize);
                stream._readHexDataNumber(end, dataSize);
                this._addHexData(end, start, dataSize);
                stream._readNumber();
                for (let i: number = 1; i < childItemsCount; i++) {
                    this._performHexIncrement(end, dataSize);
                    stream._readHexDataNumber(start, dataSize);
                    this._addHexData(start, end, dataSize);
                    stream._readHexDataNumber(end, dataSize);
                    this._addHexData(end, start, dataSize);
                    stream._readNumber();
                }
                break;
            case 2:
                stream._readHexData(char, dataSize);
                code = stream._readNumber();
                characterMap._mapOne(this._convertHexToInt(char, dataSize), code);
                for (let i: number = 1; i < childItemsCount; i++) {
                    this._performHexIncrement(char, dataSize);
                    if (!sequence) {
                        stream._readHexDataNumber(temp, dataSize);
                        this._addHexData(char, temp, dataSize);
                    }
                    code = stream._readSignedData() + (code + 1);
                    characterMap._mapOne(this._convertHexToInt(char, dataSize), code);
                }
                break;
            case 3:
                stream._readHexData(start, dataSize);
                stream._readHexDataNumber(end, dataSize);
                this._addHexData(end, start, dataSize);
                code = stream._readNumber();
                characterMap._mapCharacterIdentifierRange(
                    this._convertHexToInt(start, dataSize),
                    this._convertHexToInt(end, dataSize),
                    code
                );
                for (let i: number = 1; i < childItemsCount; i++) {
                    this._performHexIncrement(end, dataSize);
                    if (!sequence) {
                        stream._readHexDataNumber(start, dataSize);
                        this._addHexData(start, end, dataSize);
                    } else {
                        start.set(end);
                    }
                    stream._readHexDataNumber(end, dataSize);
                    this._addHexData(end, start, dataSize);
                    code = stream._readNumber();
                    characterMap._mapCharacterIdentifierRange(
                        this._convertHexToInt(start, dataSize),
                        this._convertHexToInt(end, dataSize),
                        code
                    );
                }
                break;
            case 4:
                stream._readHexData(char, universalCharset);
                stream._readHexData(charCode, dataSize);
                characterMap._mapOne(
                    this._convertHexToInt(char, universalCharset),
                    this._hexArrayToString(charCode, dataSize)
                );
                for (let i: number = 1; i < childItemsCount; i++) {
                    this._performHexIncrement(char, universalCharset);
                    if (!sequence) {
                        stream._readHexDataNumber(temp, universalCharset);
                        this._addHexData(char, temp, universalCharset);
                    }
                    this._performHexIncrement(charCode, dataSize);
                    stream._readHexSignedData(temp, dataSize);
                    this._addHexData(charCode, temp, dataSize);
                    characterMap._mapOne(
                        this._convertHexToInt(char, universalCharset),
                        this._hexArrayToString(charCode, dataSize)
                    );
                }
                break;
            case 5:
                stream._readHexData(start, universalCharset);
                stream._readHexDataNumber(end, universalCharset);
                this._addHexData(end, start, universalCharset);
                stream._readHexData(charCode, dataSize);
                characterMap._mapRangeToDestination(
                    this._convertHexToInt(start, universalCharset),
                    this._convertHexToInt(end, universalCharset),
                    this._hexArrayToString(charCode, dataSize)
                );
                for (let i: number = 1; i < childItemsCount; i++) {
                    this._performHexIncrement(end, universalCharset);
                    if (!sequence) {
                        stream._readHexDataNumber(start, universalCharset);
                        this._addHexData(start, end, universalCharset);
                    } else {
                        start.set(end);
                    }
                    stream._readHexDataNumber(end, universalCharset);
                    this._addHexData(end, start, universalCharset);
                    stream._readHexData(charCode, dataSize);
                    characterMap._mapRangeToDestination(
                        this._convertHexToInt(start, universalCharset),
                        this._convertHexToInt(end, universalCharset),
                        this._hexArrayToString(charCode, dataSize)
                    );
                }
                break;
            default:
                throw new Error(`BinaryCMapReader.process - unknown type: ${type}`);
            }
        }
        if (useCharacterMap) {
            return enhance(useCharacterMap);
        }
        return characterMap;
    }
}
/**
 * Internal binary reader for compact CMap streams used in PDF font mappings.
 *
 * Provides support for reading variable length encoded integers, signed values,
 * hex blocks, and CMap string entries following the PDF specification.
 *
 * @private
 */
export class _PdfBinaryCMapStream {
    /**
     * Backing buffer containing the binary CMap data.
     *
     * @private
     */
    _buffer: any; //eslint-disable-line
    /**
     * Current reading position within the buffer.
     *
     * @private
     */
    _pos: number;
    /**
     * The end offset of the buffer (exclusive).
     *
     * @private
     */
    _end: number;
    /**
     * Temporary buffer used for decoding variable length base 128 numbers.
     *
     * @private
     */
    _tempBuffer: Uint8Array;
    /**
     * Maximum fixed byte size used for specific hex decoding cases.
     *
     * @private
     */
    _maximumSize: number = 16;
    /**
     * Maximum expected encoded number length for variable length integers.
     *
     * @private
     */
    _maxEncodedNumberSize: number = 19;
    constructor(data: any) { //eslint-disable-line
        this._buffer = data;
        this._pos = 0;
        this._end = data.length;
        this._tempBuffer = new Uint8Array(this._maxEncodedNumberSize);
    }
    /**
     * Reads a single byte from the stream.
     *
     * @private
     * @returns {any} The byte value or -1 if no more data is available. // eslint-disable-line
     */
    _readByteData(): any { //eslint-disable-line
        return (this._pos >= this._end) ? -1 : this._buffer[this._pos++];
    }
    /**
     * Reads an unsigned variable length integer encoded in base 128 format.
     *
     * High bit (0x80) indicates continuation.
     *
     * @private
     * @returns {number} The decoded integer.
     */
    _readNumber(): number {
        let n: number = 0;
        let last: boolean;
        do {
            const b: any = this._readByteData(); //eslint-disable-line
            last = !(b & 0x80);
            n = (n << 7) | (b & 0x7f);
        } while (!last);
        return n;
    }
    /**
     * Reads a signed variable length integer using zig zag encoding.
     *
     * @private
     * @returns {number} The decoded signed integer.
     */
    _readSignedData(): number {
        const n: number = this._readNumber();
        return n & 1 ? ~(n >>> 1) : n >>> 1;
    }
    _readHexData(number: any, size: number): void { //eslint-disable-line
        number.set(this._buffer.subarray(this._pos, this._pos + size + 1));
        this._pos += size + 1;
    }
    /**
     * Reads a block of bytes and copies them into the provided buffer.
     *
     * Reads `size + 1` bytes from the current position.
     *
     * @private
     * @param {any} number Destination buffer. // eslint-disable-line
     * @param {number} size Number of bytes to read.
     * @returns {void} nothing.
     */
    _readHexDataNumber(number: any, size: number): void { //eslint-disable-line
        let last: boolean;
        const stack: any = this._tempBuffer; //eslint-disable-line
        let sp: number = 0;
        do {
            const b: any = this._readByteData(); //eslint-disable-line
            last = !(b & 0x80);
            stack[sp++] = b & 0x7f;
        } while (!last);
        let i: number = size;
        let buffer: number = 0;
        let bufferSize: number = 0;
        while (i >= 0) {
            while (bufferSize < 8 && stack.length > 0) {
                buffer |= stack[--sp] << bufferSize;
                bufferSize += 7;
            }
            number[Number.parseInt(i.toString(), 10)] = buffer & 255;
            i--;
            buffer >>= 8;
            bufferSize -= 8;
        }
    }
    /**
     * Reads a signed hex encoded number and applies sign extension to the output bytes.
     *
     * @private
     * @param {any} number Destination byte array. // eslint-disable-line
     * @param {number} size Number of payload bytes.
     * @returns {void} nothing.
     */
    _readHexSignedData(number: any, size: number): void { //eslint-disable-line
        this._readHexDataNumber(number, size);
        const sign: number = number[Number.parseInt(size.toString(), 10)] & 1 ? 255 : 0;
        let c: number = 0;
        for (let i: number = 0; i <= size; i++) {
            c = ((c & 1) << 8) | number[Number.parseInt(i.toString(), 10)];
            number[Number.parseInt(i.toString(), 10)] = (c >> 1) ^ sign;
        }
    }
    /**
     * Reads a string from the stream:
     * 1. Reads its length as a variable length integer.
     * 2. Reads `length` encoded integers.
     * 3. Converts them to a JavaScript string via char codes.
     *
     * @private
     * @returns {string} The decoded string.
     */
    _readStringFromData(): string {
        const length: number = this._readNumber();
        let buffer: any[] = new Array(length); //eslint-disable-line
        for (let i: number = 0; i < length; i++) {
            buffer[Number.parseInt(i.toString(), 10)] = this._readNumber();
        }
        return String.fromCharCode(...buffer);
    }
}
