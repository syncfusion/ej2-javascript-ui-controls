
/**
 * Encoding class: Contains the details about encoding type, whether to write a Unicode byte order mark (BOM).
 * ```typescript
 * let encoding : Encoding = new Encoding();
 * encoding.type = 'Utf8';
 * encoding.getBytes('Encoding', 0, 5);
 * ```
 */
export class Encoding {

    private emitBOM: boolean = true;
    private encodingType: EncodingType = 'Ansi';


    /**
     * Gets a value indicating whether to write a Unicode byte order mark.
     * @returns {boolean} True to specify that a Unicode byte order mark is written; otherwise, false.
     */
    get includeBom(): boolean {
        return this.emitBOM;
    }

    /**
     * Gets the encoding type.
     * @returns {EncodingType} The current encoding type.
     */
    get type(): EncodingType {
        return this.encodingType;
    }

    /**
     * Sets the encoding type.
     * @param {EncodingType} value - The encoding type to set.
     */
    set type(value: EncodingType) {
        this.encodingType = value;
    }

    /**
     * Initializes a new instance of the Encoding class. A parameter specifies whether to write a Unicode byte order mark.
     * @param {boolean} [includeBom] - True to specify that a Unicode byte order mark is written; otherwise, false.
     */
    constructor(includeBom?: boolean) {
        this.initBOM(includeBom);
    }
    /**
     * Initialize the includeBom to emit BOM or not.
     * @param {boolean} includeBom - Indicates whether to emit a BOM.
     * @returns {void} Nothing is returned.
     */
    private initBOM(includeBom: boolean): void {
        if (includeBom === undefined || includeBom === null) {
            this.emitBOM = true;
        } else {
            this.emitBOM = includeBom;
        }
    }

    /**
     * Calculates the number of bytes produced by encoding the characters in the specified string
     * @param  {string} chars - The string containing the set of characters to encode
     * @returns {number} - The number of bytes produced by encoding the specified characters
     */
    public getByteCount(chars: string): number {
        const byteCount: number = 0;
        validateNullOrUndefined(chars, 'string');
        if (chars === '') {
            const byte: number = this.utf8Len(chars.charCodeAt(0));
            return byte;
        }
        if (this.type === null || this.type === undefined) {
            this.type = 'Ansi';
        }
        return this.getByteCountInternal(chars, 0, chars.length);
    }
    /**
     * Returns the number of bytes required to represent a character in UTF-8.
     * @param {number} codePoint - The Unicode code point of the character.
     * @returns {number} The number of bytes needed for the given code point.
     */
    private utf8Len(codePoint: number): number {
        const bytes: number = codePoint <= 0x7F ? 1 :
            codePoint <= 0x7FF ? 2 :
                codePoint <= 0xFFFF ? 3 :
                    codePoint <= 0x1FFFFF ? 4 : 0;
        return bytes;
    }
    /**
     * Determines if the given code unit is a high surrogate.
     * For 4-byte characters, returns true; otherwise, false.
     * @param {number} codeUnit - The Unicode code unit to check.
     * @returns {boolean} True if the code unit is a high surrogate; otherwise, false.
     */
    private isHighSurrogate(codeUnit: number): boolean {
        return codeUnit >= 0xD800 && codeUnit <= 0xDBFF;
    }
    /**
     * Generates the code point from a surrogate pair for a 4-byte character.
     * @param {number} highCodeUnit - The high surrogate code unit.
     * @param {number} lowCodeUnit - The low surrogate code unit.
     * @returns {number} The combined Unicode code point.
     */
    private toCodepoint(highCodeUnit: number, lowCodeUnit: number): number {
        highCodeUnit = (0x3FF & highCodeUnit) << 10;
        const u: number = highCodeUnit | (0x3FF & lowCodeUnit);
        return u + 0x10000;
    }
    /**
     * Gets the byte count for a specific range of characters.
     * @param {string} chars - The string containing characters.
     * @param {number} charIndex - The starting index of the character range.
     * @param {number} charCount - The number of characters to process.
     * @returns {number} The total byte count for the specified characters.
     */
    private getByteCountInternal(chars: string, charIndex: number, charCount: number): number {
        let byteCount: number = 0;
        if (this.encodingType === 'Utf8' || this.encodingType === 'Unicode') {
            const isUtf8: boolean = this.encodingType === 'Utf8';
            for (let i: number = 0; i < charCount; i++) {
                const charCode: number = chars.charCodeAt(isUtf8 ? charIndex : charIndex++);
                if (this.isHighSurrogate(charCode)) {
                    if (isUtf8) {
                        const high: number = charCode;
                        const low: number = chars.charCodeAt(++charIndex);
                        byteCount += this.utf8Len(this.toCodepoint(high, low));
                    } else {
                        byteCount += 4;
                        ++i;
                    }
                } else {
                    if (isUtf8) {
                        byteCount += this.utf8Len(charCode);
                    } else {
                        byteCount += 2;
                    }
                }
                if (isUtf8) {
                    charIndex++;
                }
            }
            return byteCount;
        } else {
            byteCount = charCount;
            return byteCount;
        }
    }
    /**
     * Encodes a set of characters from the specified string into the ArrayBuffer.
     * @param {string} s - The string containing the set of characters to encode.
     * @param {number} charIndex - The index of the first character to encode.
     * @param {number} charCount - The number of characters to encode.
     * @returns {ArrayBuffer} The ArrayBuffer that contains the resulting sequence of bytes.
     */
    public getBytes(s: string, charIndex: number, charCount: number): ArrayBuffer {
        validateNullOrUndefined(s, 'string');
        validateNullOrUndefined(charIndex, 'charIndex');
        validateNullOrUndefined(charCount, 'charCount');

        if (charIndex < 0 || charCount < 0) {
            throw new RangeError('Argument Out Of Range Exception: charIndex or charCount is less than zero');
        }
        if (s.length - charIndex < charCount) {
            throw new RangeError('Argument Out Of Range Exception: charIndex and charCount do not denote a valid range in string');
        }
        let bytes: ArrayBuffer;
        if (s === '') {
            bytes = new ArrayBuffer(0);
            return bytes;
        }
        if (this.type === null || this.type === undefined) {
            this.type = 'Ansi';
        }
        const byteCount: number = this.getByteCountInternal(s, charIndex, charCount);
        switch (this.type) {
        case 'Utf8':
            bytes = this.getBytesOfUtf8Encoding(byteCount, s, charIndex, charCount);
            return bytes;
        case 'Unicode':
            bytes = this.getBytesOfUnicodeEncoding(byteCount, s, charIndex, charCount);
            return bytes;
        default:
            bytes = this.getBytesOfAnsiEncoding(byteCount, s, charIndex, charCount);
            return bytes;
        }
    }

    /**
     * Decodes a sequence of bytes from the specified ArrayBuffer into a string.
     * @param {ArrayBuffer} bytes - The ArrayBuffer containing the sequence of bytes to decode.
     * @param {number} index - The index of the first byte to decode.
     * @param {number} count - The number of bytes to decode.
     * @returns {string} The string that contains the resulting set of characters.
     */
    public getString(bytes: ArrayBuffer, index: number, count: number): string {
        validateNullOrUndefined(bytes, 'bytes');
        validateNullOrUndefined(index, 'index');
        validateNullOrUndefined(count, 'count');
        if (index < 0 || count < 0) {
            throw new RangeError('Argument Out Of Range Exception: index or count is less than zero');
        }
        if (bytes.byteLength - index < count) {
            throw new RangeError('Argument Out Of Range Exception: index and count do not denote a valid range in bytes');
        }
        if (bytes.byteLength === 0 || count === 0) {
            return '';
        }
        if (this.type === null || this.type === undefined) {
            this.type = 'Ansi';
        }
        let out: string = '';
        const byteCal: Uint8Array = new Uint8Array(bytes);
        switch (this.type) {
        case 'Utf8': {
            const s: string = this.getStringOfUtf8Encoding(byteCal, index, count);
            return s;
        }
        case 'Unicode': {
            const byteUnicode: Uint16Array = new Uint16Array(bytes);
            out = this.getStringofUnicodeEncoding(byteUnicode, index, count);
            return out;
        }
        default: {
            let j: number = index;
            // tslint:disable-next-line:typedef
            const arr = byteCal as Uint8Array;
            for (let i: number = 0; i < count; i++) {
                const c: number = arr[j]; // eslint-disable-line security/detect-object-injection
                out += String.fromCharCode(c);
                j++;
            }
            return out;
        }
        }
    }
    private getBytesOfAnsiEncoding(byteCount: number, s: string, charIndex: number, charCount: number): ArrayBuffer {
        const bytes: ArrayBuffer = new ArrayBuffer(byteCount);
        const bufview: Uint8Array = new Uint8Array(bytes);
        let k: number = 0;
        for (let i: number = 0; i < charCount; i++) {
            const charcode: number = s.charCodeAt(charIndex++);
            if (charcode < 0x800) {
                bufview[k] = charcode; // eslint-disable-line security/detect-object-injection
            } else {
                bufview[k] = 63; // eslint-disable-line security/detect-object-injection
            }
            k++;
        }
        return bytes;
    }
    private getBytesOfUtf8Encoding(byteCount: number, s: string, charIndex: number, charCount: number): ArrayBuffer {
        const bytes: ArrayBuffer = new ArrayBuffer(byteCount);
        const uint: Uint8Array = new Uint8Array(bytes);
        let index: number = charIndex;
        let j: number = 0;
        for (let i: number = 0; i < charCount; i++) {
            const charcode: number = s.charCodeAt(index);
            if (charcode <= 0x7F) {  // 1 byte character 2^7
                uint[j] = charcode; // eslint-disable-line security/detect-object-injection
            } else if (charcode < 0x800) {     // 2 byte character 2^11
                uint[j] = 0xc0 | (charcode >> 6); // eslint-disable-line security/detect-object-injection
                uint[++j] = 0x80 | (charcode & 0x3f);

            } else if ((charcode < 0xd800 || charcode >= 0xe000)) { // 3 byte character 2^16
                uint[j] = 0xe0 | (charcode >> 12); // eslint-disable-line security/detect-object-injection
                uint[++j] = 0x80 | ((charcode >> 6) & 0x3f);
                uint[++j] = 0x80 | (charcode & 0x3f);

            } else {
                uint[j] = 0xef; // eslint-disable-line security/detect-object-injection
                uint[++j] = 0xbf;
                uint[++j] = 0xbd; // U+FFFE "replacement character"
            }
            ++j;
            ++index;
        }
        return bytes;
    }
    private getBytesOfUnicodeEncoding(byteCount: number, s: string, charIndex: number, charCount: number): ArrayBuffer {
        const bytes: ArrayBuffer = new ArrayBuffer(byteCount);
        const uint16: Uint16Array = new Uint16Array(bytes);
        for (let i: number = 0; i < charCount; i++) {
            const charcode: number = s.charCodeAt(i);
            uint16[i] = charcode; // eslint-disable-line security/detect-object-injection
        }
        return bytes;
    }
    private getStringOfUtf8Encoding(byteCal: Uint8Array, index: number, count: number): string {
        let j: number = 0;
        let i: number = index;
        let s: string = '';
        for (j; j < count; j++) {
            let c: number = byteCal[i++];
            while (i > byteCal.length) {
                return s;
            }
            if (c > 127) {
                if (c > 191 && c < 224 && i < count) {
                    c = (c & 31) << 6 | byteCal[i] & 63; // eslint-disable-line security/detect-object-injection
                } else if (c > 223 && c < 240 && i < byteCal.byteLength) {
                    c = (c & 15) << 12 | (byteCal[i] & 63) << 6 | byteCal[++i] & 63; // eslint-disable-line security/detect-object-injection
                } else if (c > 239 && c < 248 && i < byteCal.byteLength) {
                    c = (c & 7) << 18 | (byteCal[i] & 63) << 12 | (byteCal[++i] & 63) << 6 | byteCal[++i] & 63; // eslint-disable-line security/detect-object-injection
                }
                ++i;
            }
            s += String.fromCharCode(c); // 1 byte(ASCII) character
        }
        return s;
    }
    private getStringofUnicodeEncoding(byteUni: Uint16Array, index: number, count: number): string {
        if (count > byteUni.length) {
            throw new RangeError('ArgumentOutOfRange_Count');
        }
        const byte16: Uint16Array = new Uint16Array(count);
        let out: string = '';
        for (let i: number = 0; i < count && i < byteUni.length; i++) {
            byte16[i] = byteUni[index++]; // eslint-disable-line security/detect-object-injection
        }
        out = String.fromCharCode.apply(null, byte16);
        return out;

    }

    /**
     * Clears the encoding instance.
     * @returns {void} Nothing is returned.
     */
    public destroy(): void {
        this.emitBOM = undefined;
        this.encodingType = undefined;
    }
}

/**
 * EncodingType : Specifies the encoding type
 */
export type EncodingType =
    /**
     * Specifies the Ansi encoding
     */
    'Ansi' |
    /**
     * Specifies the utf8 encoding
     */
    'Utf8' |
    /**
     * Specifies the Unicode encoding
     */
    'Unicode';


/**
 * Checks if the object is null or undefined and throws an error if it is.
 * @param {Object} value - The object to check.
 * @param {string} message - The name or description of the argument for error reporting.
 * @returns {void} Nothing is returned; an error is thrown if validation fails.
 * @throws {Error} If the value is null or undefined.
 * @private
 */
export function validateNullOrUndefined(value: Object, message: string): void {
    if (value === null || value === undefined) {
        throw new Error('ArgumentException: ' + message + ' cannot be null or undefined');
    }
}
