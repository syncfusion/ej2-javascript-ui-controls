
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
     * Gets a value indicating whether to write a Unicode byte order mark
     * @returns boolean- true to specify that a Unicode byte order mark is written; otherwise, false
     */
    get includeBom(): boolean {
        return this.emitBOM;
    }

    /**
     * Gets the encoding type.
     * @returns EncodingType
     */
    get type(): EncodingType {
        return this.encodingType;
    }

    /**
     * Sets the encoding type.
     * @param  {EncodingType} value
     */
    set type(value: EncodingType) {
        this.encodingType = value;
    }

    /**
     * Initializes a new instance of the Encoding class. A parameter specifies whether to write a Unicode byte order mark 
     * @param  {boolean} includeBom?-true to specify that a Unicode byte order mark is written; otherwise, false.
     */
    constructor(includeBom?: boolean) {
        this.initBOM(includeBom);
    }
    /**
     * Initialize the includeBom to emit BOM or Not
     * @param  {boolean} includeBom
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
        let byteCount: number = 0;
        validateNullOrUndefined(chars, 'string');
        if (chars === '') {
            let byte: number = this.utf8Len(chars.charCodeAt(0));
            return byte;
        }
        if (this.type === null || this.type === undefined) {
            this.type = 'Ansi';
        }
        return this.getByteCountInternal(chars, 0, chars.length);
    }
    /**
     * Return the Byte of character
     * @param  {number} codePoint
     * @returns {number}
     */
    private utf8Len(codePoint: number): number {
        let bytes: number = codePoint <= 0x7F ? 1 :
            codePoint <= 0x7FF ? 2 :
                codePoint <= 0xFFFF ? 3 :
                    codePoint <= 0x1FFFFF ? 4 : 0;
        return bytes;
    }
    /**
     * for 4 byte character return surrogate pair true, otherwise false
     * @param  {number} codeUnit
     * @returns {boolean}
     */
    private isHighSurrogate(codeUnit: number): boolean {
        return codeUnit >= 0xD800 && codeUnit <= 0xDBFF;
    }
    /**
     * for 4byte character generate the surrogate pair
     * @param  {number} highCodeUnit
     * @param  {number} lowCodeUnit
     */
    private toCodepoint(highCodeUnit: number, lowCodeUnit: number): number {
        highCodeUnit = (0x3FF & highCodeUnit) << 10;
        let u: number = highCodeUnit | (0x3FF & lowCodeUnit);
        return u + 0x10000;
    }
    /**
     * private method to get the byte count for specific charindex and count
     * @param  {string} chars
     * @param  {number} charIndex
     * @param  {number} charCount
     */
    private getByteCountInternal(chars: string, charIndex: number, charCount: number): number {
        let byteCount: number = 0;
        if (this.encodingType === 'Utf8' || this.encodingType === 'Unicode') {
            let isUtf8: boolean = this.encodingType === 'Utf8';
            for (let i: number = 0; i < charCount; i++) {
                let charCode: number = chars.charCodeAt(isUtf8 ? charIndex : charIndex++);
                if (this.isHighSurrogate(charCode)) {
                    if (isUtf8) {
                        let high: number = charCode;
                        let low: number = chars.charCodeAt(++charIndex);
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
     * @param  {string} s- The string containing the set of characters to encode
     * @param  {number} charIndex-The index of the first character to encode.
     * @param  {number} charCount- The number of characters to encode.
     * @returns {ArrayBuffer} - The ArrayBuffer that contains the resulting sequence of bytes.
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
        let byteCount: number = this.getByteCountInternal(s, charIndex, charCount);
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
     * Decodes a sequence of bytes from the specified ArrayBuffer into the string.
     * @param  {ArrayBuffer} bytes- The ArrayBuffer containing the sequence of bytes to decode.
     * @param  {number} index- The index of the first byte to decode.
     * @param  {number} count- The number of bytes to decode.
     * @returns {string} - The string that contains the resulting set of characters. 
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
        let byteCal: Uint8Array = new Uint8Array(bytes);
        switch (this.type) {
            case 'Utf8':
                let s: string = this.getStringOfUtf8Encoding(byteCal, index, count);
                return s;
            case 'Unicode':
                let byteUnicode: Uint16Array = new Uint16Array(bytes);
                out = this.getStringofUnicodeEncoding(byteUnicode, index, count);
                return out;
            default:
                let j: number = index;
                for (let i: number = 0; i < count; i++) {
                    let c: number = byteCal[j];
                    out += String.fromCharCode(c);  // 1 byte(ASCII) character                  
                    j++;
                }
                return out;
        }
    }
    private getBytesOfAnsiEncoding(byteCount: number, s: string, charIndex: number, charCount: number): ArrayBuffer {
        let bytes: ArrayBuffer = new ArrayBuffer(byteCount);
        let bufview: Uint8Array = new Uint8Array(bytes);
        let k: number = 0;
        for (let i: number = 0; i < charCount; i++) {
            let charcode: number = s.charCodeAt(charIndex++);
            if (charcode < 0x800) {
                bufview[k] = charcode;
            } else {
                bufview[k] = 63;  //replacement character '?'
            }
            k++;
        }
        return bytes;
    }
    private getBytesOfUtf8Encoding(byteCount: number, s: string, charIndex: number, charCount: number): ArrayBuffer {
        let bytes: ArrayBuffer = new ArrayBuffer(byteCount);
        let uint: Uint8Array = new Uint8Array(bytes);
        let index: number = charIndex;
        let j: number = 0;
        for (let i: number = 0; i < charCount; i++) {
            let charcode: number = s.charCodeAt(index);
            if (charcode <= 0x7F) {  // 1 byte character 2^7
                uint[j] = charcode;
            } else if (charcode < 0x800) {     // 2 byte character 2^11
                uint[j] = 0xc0 | (charcode >> 6);
                uint[++j] = 0x80 | (charcode & 0x3f);

            } else if ((charcode < 0xd800 || charcode >= 0xe000)) {    // 3 byte character 2^16        
                uint[j] = 0xe0 | (charcode >> 12);
                uint[++j] = 0x80 | ((charcode >> 6) & 0x3f);
                uint[++j] = 0x80 | (charcode & 0x3f);

            } else {
                uint[j] = 0xef;
                uint[++j] = 0xbf;
                uint[++j] = 0xbd; // U+FFFE "replacement character"
            }
            ++j;
            ++index;
        }
        return bytes;
    }
    private getBytesOfUnicodeEncoding(byteCount: number, s: string, charIndex: number, charCount: number): ArrayBuffer {
        let bytes: ArrayBuffer = new ArrayBuffer(byteCount);
        let uint16: Uint16Array = new Uint16Array(bytes);
        for (let i: number = 0; i < charCount; i++) {
            let charcode: number = s.charCodeAt(i);
            uint16[i] = charcode;
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
                    c = (c & 31) << 6 | byteCal[i] & 63;
                } else if (c > 223 && c < 240 && i < byteCal.byteLength) {
                    c = (c & 15) << 12 | (byteCal[i] & 63) << 6 | byteCal[++i] & 63;
                } else if (c > 239 && c < 248 && i < byteCal.byteLength) {
                    c = (c & 7) << 18 | (byteCal[i] & 63) << 12 | (byteCal[++i] & 63) << 6 | byteCal[++i] & 63;
                }
                ++i;
            }
            s += String.fromCharCode(c);          // 1 byte(ASCII) character                          
        }
        return s;
    }
    private getStringofUnicodeEncoding(byteUni: Uint16Array, index: number, count: number): string {
        if (count > byteUni.length) {
            throw new RangeError('ArgumentOutOfRange_Count');
        }
        let byte16: Uint16Array = new Uint16Array(count);
        let out: string = '';
        for (let i: number = 0; i < count && i < byteUni.length; i++) {
            byte16[i] = byteUni[index++];
        }
        out = String.fromCharCode.apply(null, byte16);
        return out;

    }

    /**
     * To clear the encoding instance
     * @return {void} 
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
 * To check the object is null or undefined and throw error if it is null or undefined
 * @param {Object} value - object to check is null or undefined
 * @return {boolean}
 * @throws {ArgumentException} - if the value is null or undefined
 * @private
 */
export function validateNullOrUndefined(value: Object, message: string): void {
    if (value === null || value === undefined) {
        throw new Error('ArgumentException: ' + message + ' cannot be null or undefined');
    }
}