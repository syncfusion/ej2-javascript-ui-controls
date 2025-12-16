import { _RealValueType } from './enumerator';
/**
 * Convert a buffer to an integer.
 *
 * @param {Uint8Array} input - The input buffer as a Uint8Array.
 * @returns {number} The integer value.
 */
export function _bufferToInteger(input: Uint8Array): number {
    const length: number = input.length;
    if (length === 0) {
        return 0;
    }
    if (length > 4) {
        throw new Error('Input too large to convert to number without BigInt.');
    }
    let value: number = 0;
    for (let i: number = 0; i < length; i++) {
        value = (value << 8) | input[<number>i];
    }
    return value;
}
/**
 * Converts an integer into a buffer (Uint8Array) representation.
 *
 * @param {number} int - The integer to convert to a Uint8Array.
 * @returns {Uint8Array} A Uint8Array representing the integer in its encoded form.
 * @throws {Error} Throws an error if the integer is out of range for 32-bit encoding without BigInt.
 */
export function _integerToBuffer(int: number): Uint8Array {
    if (int >= -128 && int <= 127) {
        const array: Uint8Array = new Uint8Array(1);
        const view: DataView = new DataView(array.buffer);
        view.setInt8(0, int);
        return array;
    }
    if (int >= -32768 && int <= 32767) {
        const array: Uint8Array = new Uint8Array(2);
        const view: DataView = new DataView(array.buffer);
        view.setInt16(0, int, false);
        return array;
    }
    if (int >= -8388608 && int <= 8388607) {
        const array: Uint8Array = new Uint8Array(4);
        const view: DataView = new DataView(array.buffer);
        view.setInt32(0, int, false);
        return array.subarray(1);
    }
    if (int >= -2147483648 && int <= 2147483647) {
        const array: Uint8Array = new Uint8Array(4);
        const view: DataView = new DataView(array.buffer);
        view.setInt32(0, int, false);
        return array;
    }
    throw new Error('Integer out of range for 32-bit encoding without BigInt.');
}
/**
 * Decodes a signed big-endian integer from a Uint8Array.
 *
 * @param {Uint8Array} value - The byte array representing the signed integer in big-endian format.
 * @returns {number} The decoded signed integer.
 * @throws {Error} Throws an error if the byte array is longer than 4 bytes
 */
export function _decodeSignedBigEndianInteger(value: Uint8Array): number {
    const length: number = value.length;
    if (length === 0) {
        return 0;
    }
    if (length > 4) {
        throw new Error('Number too long to decode.');
    }
    const padded: Uint8Array = new Uint8Array(4);
    const isNegative: boolean = (value[0] & 0x80) !== 0;
    padded.fill(isNegative ? 0xFF : 0x00, 0, 4 - length);
    padded.set(value, 4 - length);
    const view: DataView = new DataView(padded.buffer);
    return view.getInt32(0, false);
}
/**
 * Decodes an unsigned big-endian integer from a Uint8Array.
 *
 * @param {Uint8Array} value - The byte array representing the unsigned integer in big-endian format.
 * @returns {number} The decoded unsigned integer.
 * @throws {Error} Throws an error if the byte array is longer than 4 bytes, which cannot be decoded.
 */
export function _decodeUnsignedBigEndianInteger(value: Uint8Array): number {
    const length: number = value.length;
    if (length === 0) {
        return 0;
    }
    if (length > 4) {
        throw new Error(`Number on ${length} bytes is too long to decode.`);
    }
    const padded: Uint8Array = new Uint8Array(4);
    padded.set(value, 4 - length);
    const view: DataView = new DataView(padded.buffer);
    return view.getUint32(0, false);
}
/**
 * Dissects a floating-point number into its sign, exponent, and mantissa components.
 *
 * @param {number} value - The floating-point number to dissect.
 * @returns {{ negative: boolean, exponent: number, mantissa: number }} An object.
 */
export function _dissectFloat (value: number): { negative: boolean; exponent: number; mantissa: number } {
    const float: Float64Array = new Float64Array([ value ]);
    const exponentBitMask: number = 0b0111_1111_1111_0000_0000_0000_0000_0000;
    const uints: Uint32Array = new Uint32Array(float.buffer);
    const exponent: number = (((uints[1] & exponentBitMask) >>> 20) - 1023 - 31);
    const mantissa: number = 0x8000_0000 + ((
        ((uints[1] & 0x000F_FFFF) << 11)
        | ((uints[0] & 0xFFE0_0000) >>> 21)
    ));
    return {
        negative: (value < 0),
        exponent,
        mantissa
    };
}
/**
 * Encodes a signed 32-bit integer to a big-endian Uint8Array.
 *
 * @param {number} value - The signed integer to encode. Must be within the range -2147483648 to 2147483647.
 * @returns {Uint8Array} A Uint8Array representing the number in big-endian format.
 * @throws {Error} Throws an error if the number is outside the valid 32-bit signed integer range.
 */
export function _encodeBigEndianSignedInteger (value: number): Uint8Array {
    const minSint32: number = -0x80000000;
    const maxSint32: number = 0x7FFFFFFF;
    if (value < minSint32) {
        throw Error(`Number ${value} too small to be encoded as a big-endian signed integer.`);
    }
    if (value > maxSint32) {
        throw Error(`Number ${value} too big to be encoded as a big-endian signed integer.`);
    }
    if (value <= 127 && value >= -128) {
        return new Uint8Array([
            (value & 255)
        ]);
    } else if (value <= 32767 && value >= -32768) {
        return new Uint8Array([
            ((value >> 8) & 255),
            (value & 255)
        ]);
    } else if (value <= 8388607 && value >= -8388608) {
        return new Uint8Array([
            ((value >> 16) & 255),
            ((value >> 8) & 255),
            (value & 255)
        ]);
    } else {
        return new Uint8Array([
            ((value >> 24) & 255),
            ((value >> 16) & 255),
            ((value >> 8) & 255),
            (value & 255)
        ]);
    }
}
/**
 * Encodes an unsigned 32-bit integer into a big-endian Uint8Array.
 *
 * @param {number} value - The unsigned integer to encode. Must be within the range 0 to 4294967295.
 * @returns {Uint8Array} A Uint8Array representing the number in big-endian format.
 * @throws {Error} Throws an error if the number is outside the valid 32-bit unsigned integer range.
 */
export function _encodeUnsignedBigEndianInteger (value: number): Uint8Array {
    const maxUnit32: number = 0x00FFFFFFFF;
    const minUnit32: number = 0x0000000000;
    if (value < minUnit32) {
        throw new Error(
            `Number ${value} too small to be encoded as a big-endian unsigned integer.`);
    }
    if (value > maxUnit32) {
        throw new Error(
            `Number ${value} too big to be encoded as a big-endian unsigned integer.`);
    }
    const fullBytes: Uint8Array = new Uint8Array(4);
    const view: DataView = new DataView(fullBytes.buffer);
    view.setUint32(0, value, false);
    let startOfNonPadding: number = 0;
    for (let i: number = 0; i < fullBytes.length - 1; i++) {
        if (fullBytes[<number>i] === 0x00) {
            startOfNonPadding++;
        } else {
            break;
        }
    }
    return fullBytes.subarray(startOfNonPadding);
}
/**
 * Encodes a floating-point number into an X690 binary real number format (as a Uint8Array).
 *
 * @param {number} value - The floating-point number to encode.
 * @returns {Uint8Array} A Uint8Array representing the encoded X690 binary real number.
 * @throws {Error} Throws an error if the number is too precise to encode.
 */
export function _encodeX690BinaryRealNumber (value: number): Uint8Array {
    if (value === 0.0) {
        return new Uint8Array(0);
    } else if (Number.isNaN(value)) {
        return new Uint8Array([ _RealValueType.notANumber ]);
    } else if (value === Infinity) {
        return new Uint8Array([ _RealValueType.plusInfinity ]);
    } else if (value === -Infinity) {
        return new Uint8Array([ _RealValueType.minusInfinity ]);
    }
    const floatComponents: { negative: boolean; exponent: number; mantissa: number }
        = _dissectFloat(value);
    while (floatComponents.mantissa !== 0 && (floatComponents.mantissa % 2) === 0) {
        floatComponents.mantissa = floatComponents.mantissa >>> 1;
        floatComponents.exponent++;
    }
    if (floatComponents.exponent <= -1020) {
        throw new Error(
            `Real number ${value} (having exponent ${floatComponents.exponent}) `
            + 'is too precise to encode.'
        );
    }
    const singleByteExponent: boolean = (
        (floatComponents.exponent <= 127)
        && (floatComponents.exponent >= -128)
    );
    const firstByte: number = (
        0b1000_0000
        | (value >= 0 ? 0b0000_0000 : 0b0100_0000)
        | (singleByteExponent ? 0b0000_0000 : 0b0000_0001)
    );
    const exponentBytes: Uint8Array = _encodeBigEndianSignedInteger(floatComponents.exponent);
    const mantissaBytes: Uint8Array = _encodeUnsignedBigEndianInteger(floatComponents.mantissa);
    const ret: Uint8Array = new Uint8Array(1 + exponentBytes.length + mantissaBytes.length);
    ret[0] = firstByte;
    ret.set(exponentBytes, 1);
    ret.set(mantissaBytes, (1 + exponentBytes.length));
    return ret;
}
/**
 * Retrieves the value of a specific bit from a Uint8Array.
 *
 * @param {Uint8Array} from - The Uint8Array from which the bit value is extracted.
 * @param {number} bitIndex - The index of the bit to retrieve (0-indexed).
 * @returns {boolean} `true` if the bit is set (1), otherwise `false`.
 */
export function _getBit (from: Uint8Array, bitIndex: number): boolean {
    return ((from[from.length - (Math.floor(bitIndex / 8) + 1)] & (0x01 << (bitIndex % 8))) > 0);
}
/**
 * Packs a Uint8ClampedArray of bits into a Uint8Array of bytes.
 *
 * @param {Uint8ClampedArray} bits - The array of bits to be packed. Each bit should be 0 or 1.
 * @returns {Uint8Array} A Uint8Array representing the packed bits into bytes.
 */
export function _packBits(bits: Uint8ClampedArray): Uint8Array {
    const bytesNeeded: number = Math.ceil(bits.length / 8);
    const ret: Uint8Array = new Uint8Array(bytesNeeded);
    let byte: number = -1;
    for (let bit: number = 0; bit < bits.length; bit++) {
        const bitMod8: number = bit % 8;
        if (bitMod8 === 0) {
            byte++;
        }
        if (bits[<number>bit] !== 0) {
            ret[<number>byte] |= (0x01 << (7 - bitMod8));
        }
    }
    return ret;
}
/**
 * Sets or clears a bit at a specific index in a Uint8Array.
 *
 * @param {Uint8Array} to - The Uint8Array into which the bit will be set or cleared.
 * @param {number} bitIndex - The index of the bit to set or clear, 0-indexed.
 * @param {boolean} value - A boolean indicating whether to set (true) or clear (false) the bit.
 * @returns {void} This function does not return a value.
 */
export function _setBit(to: Uint8Array, bitIndex: number, value: boolean): void {
    const byteIndex: number = to.length - (Math.floor(bitIndex / 7) + 1);
    if (value) {
        to[<number>byteIndex] |= (0x01 << (bitIndex % 7));
    } else {
        to[<number>byteIndex] &= ~(0x01 << (bitIndex % 7));
    }
}
/**
 * Sets or clears a bit at a specific index in a Uint8Array for Base-256 encoding.
 *
 * @param {Uint8Array} to - The Uint8Array into which the bit will be set or cleared.
 * @param {number} bitIndex - The index of the bit to set or clear, 0-indexed.
 * @param {boolean} value - A boolean indicating whether to set (true) or clear (false) the bit.
 * @returns {void} This function does not return a value.
 */
export function _setBitInBase256(to: Uint8Array, bitIndex: number, value: boolean): void {
    const byteIndex: number = (to.length - (Math.floor(bitIndex / 8) + 1));
    if (value) {
        to[<number>byteIndex] |= (0x01 << (bitIndex % 8));
    } else {
        to[<number>byteIndex] &= ~(0x01 << (bitIndex % 8));
    }
}
/**
 * Decodes a Uint8Array to a string using the specified text encoding.
 *
 * @param {Uint8Array} bytes - The byte array to decode into a string.
 * @param {string} [encoding ='utf-8'] - The text encoding to use for decoding. Defaults to 'utf-8'.
 * @returns {string} The decoded string.
 * @throws {Error} Throws an error if `TextDecoder` is not available.
 */
export function _convertBytesToText(bytes: Uint8Array, encoding: string = 'utf-8'): string {
    if (encoding !== 'utf-8') {
        throw new Error('Only utf-8 encoding is supported in fallback.');
    }
    let result: string = '';
    let i: number = 0;
    while (i < bytes.length) {
        const byte1: number = bytes[i++];
        if (byte1 < 0x80) {
            result += String.fromCharCode(byte1);
        } else if (byte1 >= 0xC0 && byte1 < 0xE0) {
            const byte2: number = bytes[i++];
            result += String.fromCharCode(((byte1 & 0x1F) << 6) | (byte2 & 0x3F));
        } else if (byte1 >= 0xE0 && byte1 < 0xF0) {
            const byte2: number = bytes[i++];
            const byte3: number = bytes[i++];
            result += String.fromCharCode(
                ((byte1 & 0x0F) << 12) |
                ((byte2 & 0x3F) << 6) |
                (byte3 & 0x3F)
            );
        } else if (byte1 >= 0xF0) {
            const byte2: number = bytes[i++];
            const byte3: number = bytes[i++];
            const byte4: number = bytes[i++];
            const codePoint: number =
                ((byte1 & 0x07) << 18) |
                ((byte2 & 0x3F) << 12) |
                ((byte3 & 0x3F) << 6) |
                (byte4 & 0x3F);
            const highSurrogate: number = ((codePoint - 0x10000) >> 10) + 0xD800;
            const lowSurrogate: number = ((codePoint - 0x10000) & 0x3FF) + 0xDC00;
            result += String.fromCharCode(highSurrogate, lowSurrogate);
        }
    }
    return result;
}
/**
 * Checks whether a given Uint8Array is BER-encoded.
 *
 * BER (Basic Encoding Rules) encoding for a sequence starts with the bytes 0x30 0x80
 *
 * @param {Uint8Array} input - The input byte array to check.
 * @returns {boolean} True if the input starts with BER indefinite-length encoding; otherwise, false.
 */
export function _isBasicEncodingElement(input: Uint8Array): boolean {
    for (let i: number = 0; i < input.length - 1; i++) {
        if (input[<number>i] === 0x30 && input[i + 1] === 0x80) {
            return true;
        }
    }
    return false;
}
