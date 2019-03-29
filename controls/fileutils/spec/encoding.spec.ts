import { Encoding, EncodingType } from '../src/encoding';

/**
 * Encoding spec modules
 */


describe('Creating instance of Encoding', () => {
    it('Encoding instance with null parameter', () => {
        let encoding: Encoding = new Encoding(null);
        expect(encoding.includeBom).toBe(true);
    });
    it('Encoding instance with true parameter', () => {
        let encoding: Encoding = new Encoding(true);
        expect(encoding.includeBom).toBe(true);
        expect(encoding.type).toBe('Ansi');
    });
    it('Encoding instance with false parameter', () => {
        let encoding: Encoding = new Encoding(false);
        expect(encoding.includeBom).toBe(false);
        expect(encoding.type).toBe('Ansi');
    });
    it('Encoding instance with empty parameter', () => {
        let encoding: Encoding = new Encoding();
        expect(encoding.includeBom).toBe(true);
        expect(encoding.type).toBe('Ansi');
    });
});


/**
 * Validating getBytes method in Ansi Encoding
 * method: getBytes(s:string,index:number,count:number)
 * return Array<number>
 */

describe('Validating getBytes method in Ansi encoding', () => {
    let encoding: Encoding;
    beforeEach((): void => {
        encoding = new Encoding(true);
        encoding.type = 'Ansi';
    });
    afterEach((): void => {
        encoding.destroy();
        encoding = undefined;
    });
    it('string as null parameter,index and count as null', () => {
        expect((): void => { encoding.getBytes(null, null, null); }).toThrow(new Error('ArgumentException: string cannot be null or undefined'));

    });
    it('string as null parameter', () => {
        expect((): void => { encoding.getBytes(null, 0, 1); }).toThrow(new Error('ArgumentException: string cannot be null or undefined'));

    });
    it('valid string,index and count as Null', () => {
        expect((): void => { encoding.getBytes('Stream', null, null); }).toThrow(new Error('ArgumentException: charIndex cannot be null or undefined'));
    });
    it('valid string,index as Null and count as valid value', () => {
        expect((): void => { encoding.getBytes('Stream', null, 1); }).toThrow(new Error('ArgumentException: charIndex cannot be null or undefined'));
    });
    it('valid string,count as null and index as valid value', () => {
        expect((): void => { encoding.getBytes('Stream', 0, null); }).toThrow(new Error('ArgumentException: charCount cannot be null or undefined'));
    });
    it('string as undefined parameter', () => {
        expect((): void => { encoding.getBytes(undefined, undefined, undefined); }).toThrow(new Error('ArgumentException: string cannot be null or undefined'));
    });
    it('string as valid value,index and count as undefined', () => {
        expect((): void => { encoding.getBytes('Stream', undefined, undefined); }).toThrow(new Error('ArgumentException: charIndex cannot be null or undefined'));
    });
    it('string , index and count as undefined parameter', () => {
        expect((): void => { encoding.getBytes(undefined, 0, 1); }).toThrow(new Error('ArgumentException: string cannot be null or undefined'));
    });
    it('valid string,index and count as negative value', () => {
        let s: string = 'StreamWriter';
        expect((): void => { encoding.getBytes(s, -1, -1); }).toThrow(new RangeError('Argument Out Of Range Exception: charIndex or charCount is less than zero'));
    });
    it('valid string,index as negative value and count as 0', () => {
        let s: string = 'StreamWriter';
        expect((): void => { encoding.getBytes(s, -1, 0); }).toThrow(new RangeError('Argument Out Of Range Exception: charIndex or charCount is less than zero'));
    });
    it('valid string,index as 0 and count as negative value', () => {
        let s: string = 'StreamWriter';
        expect((): void => { encoding.getBytes(s, 0, -1); }).toThrow(new RangeError('Argument Out Of Range Exception: charIndex or charCount is less than zero'));
    });
    it('valid string,index and count as 0', () => {
        let s: string = 'a';
        let getBytes: ArrayBuffer = encoding.getBytes(s, 0, 0);
        expect(getBytes.byteLength).toBe(0);
    })
    it('valid string with index and count as valid values', () => {
        let s: string = 'a';
        let getBytes: ArrayBuffer = encoding.getBytes(s, 0, 1);
        let byte: Uint8Array = new Uint8Array(getBytes);
        expect(byte[0]).toBe(97);
    });
    it('empty string with valid index and count as invalid', () => {
        let s: string = '';
        expect((): void => { encoding.getBytes(s, 0, 2) }).toThrow(new RangeError('Argument Out Of Range Exception: charIndex and charCount do not denote a valid range in string'));
    });
    it('Count value greater than string length', () => {
        let s: string = 'Stream';
        expect((): void => { encoding.getBytes(s, 5, 7) }).toThrow(new RangeError('Argument Out Of Range Exception: charIndex and charCount do not denote a valid range in string'));
    });
    it('string with unicode character', () => {
        let s: string = '¥';
        let getBytes: ArrayBuffer = encoding.getBytes(s, 0, 1);
        expect(getBytes.byteLength === 1).toEqual(true);
    });
    it('string with ASCII text', () => {
        let s: string = 'example';
        let getBytes: ArrayBuffer = encoding.getBytes(s, 0, s.length);
        expect(getBytes.byteLength === 7).toEqual(true);
    });
    it('string with ASCII and unicode text', () => {
        let s: string = 'example ¥';
        let getBytes: ArrayBuffer = encoding.getBytes(s, 0, s.length);
        expect(getBytes.byteLength === 9).toEqual(true);
    });
    it('string with valid string, index and count as valid values', () => {
        let s: string = 'example';
        let getBytes: ArrayBuffer = encoding.getBytes(s, 1, 3);
        expect(getBytes.byteLength === 3).toEqual(true);
    });
    it('string with chinese character, index and count as valid value', () => {
        let s: string = '汉字';
        let getBytes: ArrayBuffer = encoding.getBytes(s, 0, 2);
        let byte: Uint8Array = new Uint8Array(getBytes);
        expect(byte[0]).toBe(63);
        expect(byte[1]).toBe(63);
    });
    it('EncodingType with null in getBytes method', () => {
        let encoding: Encoding = new Encoding(true);
        encoding.type = undefined;
        let getBytes: ArrayBuffer = encoding.getBytes('a', 0, 1);
    });

});

/**
 * Validating getBytes method in UTF-8 encoding
 * method: getBytes(s:string,index:number,count:number)
 * return ArrayBuffer
 */
describe('Validating getBytes method in UTF-8 encoding', () => {
    let encoding: Encoding;
    beforeEach((): void => {
        encoding = new Encoding(true);
        encoding.type = 'Utf8';
    });
    afterEach((): void => {
        encoding.destroy();
        encoding = undefined;
    });
    it('string , index and count as null parameter', () => {
        expect((): void => { encoding.getBytes(null, null, null); }).toThrow(new Error('ArgumentException: string cannot be null or undefined'));
    });
    it('string as null parameter, index and count as valid values', () => {
        expect((): void => { encoding.getBytes(null, 0, 1); }).toThrow(new Error('ArgumentException: string cannot be null or undefined'));
    });
    it('string as valid value,index and count as Null', () => {
        expect((): void => { encoding.getBytes('Stream', null, null); }).toThrow(new Error('ArgumentException: charIndex cannot be null or undefined'));
    });
    it('string and count as valid value, index as null', () => {
        expect((): void => { encoding.getBytes('Stream', null, 1); }).toThrow(new Error('ArgumentException: charIndex cannot be null or undefined'));
    });
    it('string and index as valid value, count as null', () => {
        expect((): void => { encoding.getBytes('Stream', 0, null); }).toThrow(new Error('ArgumentException: charCount cannot be null or undefined'));
    });
    it('string as undefined parameter', () => {
        expect((): void => { encoding.getBytes(undefined, undefined, undefined); }).toThrow(new Error('ArgumentException: string cannot be null or undefined'));
    });
    it('string as valid value,index and count as undefined', () => {
        expect((): void => { encoding.getBytes('Stream', undefined, undefined); }).toThrow(new Error('ArgumentException: charIndex cannot be null or undefined'));
    });
    it('string , index and count as undefined parameter', () => {
        expect((): void => { encoding.getBytes(undefined, 0, 1); }).toThrow(new Error('ArgumentException: string cannot be null or undefined'));
    });
    it('string as valid value,index and count as negative value', () => {
        let s: string = 'StreamWriter';
        expect((): void => { encoding.getBytes(s, -1, -1); }).toThrow(new RangeError('Argument Out Of Range Exception: charIndex or charCount is less than zero'));
    });
    it('string as valid value,index as negative value and count as 0', () => {
        let s: string = 'StreamWriter';
        expect((): void => { encoding.getBytes(s, -1, 0); }).toThrow(new RangeError('Argument Out Of Range Exception: charIndex or charCount is less than zero'));
    });
    it('string as valid value,index as 0 and count as negative value', () => {
        let s: string = 'StreamWriter';
        expect((): void => { encoding.getBytes(s, 0, -1); }).toThrow(new RangeError('Argument Out Of Range Exception: charIndex or charCount is less than zero'));
    });
    it('string as valid value,index and count as 0', () => {
        let s: string = 'a';
        let getBytes: ArrayBuffer = encoding.getBytes(s, 0, 1);
        expect(getBytes.byteLength).toBe(1);
    })
    it('valid string with index and count as valid values', () => {
        let s: string = 'a';
        let getBytes: ArrayBuffer = encoding.getBytes(s, 0, 1);
        let byte: Uint8Array = new Uint8Array(getBytes);
        expect(byte[0]).toBe(97);
    });
    it('empty string with valid index and count as invalid', () => {
        let s: string = '';
        expect((): void => { encoding.getBytes(s, 0, 2) }).toThrow(new RangeError('Argument Out Of Range Exception: charIndex and charCount do not denote a valid range in string'));
    });
    it('Count value greater than string length', () => {
        let s: string = 'Hello';
        expect((): void => { encoding.getBytes(s, 5, 6) }).toThrow(new RangeError('Argument Out Of Range Exception: charIndex and charCount do not denote a valid range in string'));
    });
    it('string with unicode character', () => {
        let s: string = '¥';
        let getBytes: ArrayBuffer = encoding.getBytes(s, 0, 1);
        expect(getBytes.byteLength === 2).toEqual(true);
    });
    it('string with as ASCII text', () => {
        let s: string = 'example';
        let getBytes: ArrayBuffer = encoding.getBytes(s, 0, 2);
        expect(getBytes.byteLength === 2).toEqual(true);
    });
    it('string as valid and positive index value and count', () => {
        let s: string = 'example';
        encoding = new Encoding(false);
        let getBytes: ArrayBuffer = encoding.getBytes(s, 1, 5);
        expect(getBytes.byteLength === 5).toEqual(true);
        let text: string = encoding.getString(getBytes, 0, 4);
        expect(text).toBe('xamp');
    });
    it('string with chinese character, index and count as valid value', () => {
        let s: string = '汉字';
        let getBytes: ArrayBuffer = encoding.getBytes(s, 0, s.length);
        expect(getBytes.byteLength).toBe(6);
    });
    it('string with chinese character, index and count as valid value', () => {
        let s: string = '𐍈';
        let getBytes: ArrayBuffer = encoding.getBytes(s, 0, 2);
        expect(getBytes.byteLength).toBe(4);
    });
});
/**
 * Validating getBytes method in Unicode encoding
 * method: getBytes(s:string,index:number,count:number)
 * return ArrayBuffer
 */
describe('Validating getBytes method in Unicode encoding', () => {
    let encoding: Encoding;
    beforeEach((): void => {
        encoding = new Encoding(true);
        encoding.type = 'Unicode';
    });
    afterEach((): void => {
        encoding.destroy();
        encoding = undefined;
    });
    it('string , index and count as null parameter', () => {
        expect((): void => { encoding.getBytes(null, null, null); }).toThrow(new Error('ArgumentException: string cannot be null or undefined'));
    });
    it('string as null parameter, index and count as valid values', () => {
        expect((): void => { encoding.getBytes(null, 0, 1); }).toThrow(new Error('ArgumentException: string cannot be null or undefined'));
    });
    it('string as valid value,index and count as Null', () => {
        expect((): void => { encoding.getBytes('Stream', null, null); }).toThrow(new Error('ArgumentException: charIndex cannot be null or undefined'));
    });
    it('string and count as valid value, index as null', () => {
        expect((): void => { encoding.getBytes('Stream', null, 1); }).toThrow(new Error('ArgumentException: charIndex cannot be null or undefined'));
    });
    it('string and index as valid value, count as null', () => {
        expect((): void => { encoding.getBytes('Stream', 0, null); }).toThrow(new Error('ArgumentException: charCount cannot be null or undefined'));
    });
    it('string as undefined parameter', () => {
        expect((): void => { encoding.getBytes(undefined, undefined, undefined); }).toThrow(new Error('ArgumentException: string cannot be null or undefined'));
    });
    it('string as valid value,index and count as undefined', () => {
        expect((): void => { encoding.getBytes('Stream', undefined, undefined); }).toThrow(new Error('ArgumentException: charIndex cannot be null or undefined'));
    });
    it('string , index and count as undefined parameter', () => {
        expect((): void => { encoding.getBytes(undefined, 0, 1); }).toThrow(new Error('ArgumentException: string cannot be null or undefined'));
    });
    it('string as valid value,index and count as negative value', () => {
        let s: string = 'StreamWriter';
        expect((): void => { encoding.getBytes(s, -1, -1); }).toThrow(new RangeError('Argument Out Of Range Exception: charIndex or charCount is less than zero'));
    });
    it('string as valid value,index as negative value and count as 0', () => {
        let s: string = 'StreamWriter';
        expect((): void => { encoding.getBytes(s, -1, 0); }).toThrow(new RangeError('Argument Out Of Range Exception: charIndex or charCount is less than zero'));
    });
    it('string as valid value,index as 0 and count as negative value', () => {
        let s: string = 'StreamWriter';
        expect((): void => { encoding.getBytes(s, 0, -1); }).toThrow(new RangeError('Argument Out Of Range Exception: charIndex or charCount is less than zero'));
    });
    it('string as valid value,index and count as 0', () => {
        let s: string = 'a';
        let getBytes: ArrayBuffer = encoding.getBytes(s, 0, 1);
        expect(getBytes.byteLength).toBe(2);
    })
    it('valid string with index and count as valid values', () => {
        let s: string = 'a';
        let getBytes: ArrayBuffer = encoding.getBytes(s, 0, 1);
        let byte: Uint8Array = new Uint8Array(getBytes);
        expect(byte[0]).toBe(97);
    });
    it('empty string with valid index and count as invalid', () => {
        let s: string = '';
        expect((): void => { encoding.getBytes(s, 0, 2) }).toThrow(new RangeError('Argument Out Of Range Exception: charIndex and charCount do not denote a valid range in string'));
    });
    it('Count value greater than string length', () => {
        let s: string = 'Hello';
        expect((): void => { encoding.getBytes(s, 5, 6) }).toThrow(new RangeError('Argument Out Of Range Exception: charIndex and charCount do not denote a valid range in string'));
    });
    it('string with unicode character', () => {
        let s: string = '¥';
        let getBytes: ArrayBuffer = encoding.getBytes(s, 0, 1);
        expect(getBytes.byteLength === 2).toEqual(true);
    });
    it('string with as ASCII text', () => {
        let s: string = 'example';
        let getBytes: ArrayBuffer = encoding.getBytes(s, 0, 2);
        expect(getBytes.byteLength === 4).toEqual(true);
    });
    it('string as valid and positive index value and count', () => {
        let s: string = 'example';
        encoding = new Encoding(false);
        encoding.type = 'Unicode';
        let getBytes: ArrayBuffer = encoding.getBytes(s, 1, 5);
        expect(getBytes.byteLength === 10).toEqual(true);
        let text: string = encoding.getString(getBytes, 0, 5);
        expect(text).toBe('examp');
    });
    it('string with chinese character, index and count as valid value', () => {
        let s: string = '汉字';
        let getBytes: ArrayBuffer = encoding.getBytes(s, 0, 2);
        expect(getBytes.byteLength).toBe(4);
    });
    it('string with chinese character, index and count as valid value', () => {
        let s: string = '𐍈';
        let getBytes: ArrayBuffer = encoding.getBytes(s, 0, 2);
        expect(getBytes.byteLength).toBe(4);
    });
});

/**
 * Validating getString method in Ansi Encoding
 * method: getString(bytes:ArrayBuffer,index:number,count:number)
 * return string type
 */
describe('Validating getstring method in Ansi Encoding', () => {
    let encoding: Encoding;
    beforeEach((): void => {
        encoding = new Encoding(true);
        encoding.type = 'Ansi';
        let getBytes = new ArrayBuffer(3);
    });
    afterEach((): void => {
        encoding.destroy();
        encoding = undefined;

    });
    it('bytes,index,count as null parameter', () => {
        expect((): void => { encoding.getString(null, null, null); }).toThrow(new Error('ArgumentException: bytes cannot be null or undefined'));
    });
    it('bytes as null,index and count as 0', () => {
        expect((): void => { encoding.getString(null, 0, 0); }).toThrow(new Error('ArgumentException: bytes cannot be null or undefined'));
    });
    it('valid bytes,index and count as null parameter', () => {
        let getBytes: ArrayBuffer = new ArrayBuffer(1);
        let bytes: Uint8Array = new Uint8Array(getBytes);
        bytes[0] = 97;
        expect((): void => { encoding.getString(getBytes, null, null); }).toThrow(new Error('ArgumentException: index cannot be null or undefined'));

    });
    it('valid bytes and count,index as null parameter', () => {
        let getBytes: ArrayBuffer = new ArrayBuffer(1);
        let bytes: Uint8Array = new Uint8Array(getBytes);
        bytes[0] = 97;
        expect((): void => { encoding.getString(getBytes, null, 1); }).toThrow(new Error('ArgumentException: index cannot be null or undefined'));

    });
    it('valid bytes and index,count as null parameter', () => {
        let getBytes: ArrayBuffer = new ArrayBuffer(1);
        let bytes: Uint8Array = new Uint8Array(getBytes);
        bytes[0] = 97;
        expect((): void => { encoding.getString(getBytes, 0, null); }).toThrow(new Error('ArgumentException: count cannot be null or undefined'));

    });
    it('bytes,index,count as undefined parameter', () => {
        expect((): void => { encoding.getString(undefined, undefined, undefined); }).toThrow(new Error('ArgumentException: bytes cannot be null or undefined'));
    });
    it('bytes as undefined,index and count as 0', () => {
        expect((): void => { encoding.getString(undefined, 0, 0); }).toThrow(new Error('ArgumentException: bytes cannot be null or undefined'));
    });
    it('valid bytes,index and count as undefined parameter', () => {
        let getBytes: ArrayBuffer = new ArrayBuffer(1);
        let bytes: Uint8Array = new Uint8Array(getBytes);
        bytes[0] = 97;
        expect((): void => { encoding.getString(getBytes, undefined, undefined); }).toThrow(new Error('ArgumentException: index cannot be null or undefined'));

    });
    it('valid bytes and count,index as undefined parameter', () => {
        let getBytes: ArrayBuffer = new ArrayBuffer(1);
        let bytes: Uint8Array = new Uint8Array(getBytes);
        bytes[0] = 97;
        expect((): void => { encoding.getString(getBytes, undefined, 1); }).toThrow(new Error('ArgumentException: index cannot be null or undefined'));

    });
    it('valid bytes and index,count as undefined parameter', () => {
        let getBytes: ArrayBuffer = new ArrayBuffer(1);
        let bytes: Uint8Array = new Uint8Array(getBytes);
        bytes[0] = 97;
        expect((): void => { encoding.getString(getBytes, 0, undefined); }).toThrow(new Error('ArgumentException: count cannot be null or undefined'));

    });
    it('valid bytes,index and count as negative value', () => {
        let getBytes: ArrayBuffer = new ArrayBuffer(1);
        let bytes: Uint8Array = new Uint8Array(getBytes);
        bytes[0] = 97;
        expect((): void => { encoding.getString(getBytes, -1, -1); }).toThrow(new RangeError('Argument Out Of Range Exception: index or count is less than zero'));

    });
    it('valid bytes,index as 0 and count as negative value', () => {
        let getBytes: ArrayBuffer = new ArrayBuffer(1);
        let bytes: Uint8Array = new Uint8Array(getBytes);
        bytes[0] = 97;
        expect((): void => { encoding.getString(getBytes, 0, -1); }).toThrow(new RangeError('Argument Out Of Range Exception: index or count is less than zero'));

    });
    it('valid bytes,index as negative value and count as 0', () => {
        let getBytes: ArrayBuffer = new ArrayBuffer(1);
        let bytes: Uint8Array = new Uint8Array(getBytes);
        bytes[0] = 97;
        expect((): void => { encoding.getString(getBytes, -1, 0); }).toThrow(new RangeError('Argument Out Of Range Exception: index or count is less than zero'));

    });
    it('valid bytes,index as negative value and count as valid value', () => {
        let getBytes: ArrayBuffer = new ArrayBuffer(1);
        let bytes: Uint8Array = new Uint8Array(getBytes);
        bytes[0] = 97;
        expect((): void => { encoding.getString(getBytes, -1, 0); }).toThrow(new RangeError('Argument Out Of Range Exception: index or count is less than zero'));

    });
    it('valid bytes, index and count as 0', () => {
        let getBytes: ArrayBuffer = new ArrayBuffer(1);
        let bytes: Uint8Array = new Uint8Array(getBytes);
        bytes[0] = 97;
        let s: string = encoding.getString(bytes, 0, 0);
        expect(s === '').toEqual(true);

    });
    it('valid bytes,index and count as valid value', () => {
        let getBytes: ArrayBuffer = new ArrayBuffer(1);
        let bytes: Uint8Array = new Uint8Array(getBytes);
        bytes[0] = 97;
        let s: string = encoding.getString(getBytes, 0, 1);
        expect(s === 'a').toEqual(true);

    });

    it('bytes, index and count has valid values', () => {
        // let getBytes: ArrayBuffer = new ArrayBuffer(5);
        let bytes: Uint8Array = new Uint8Array([72, 101, 108, 108, 111]);
        let s: string = encoding.getString(bytes, 0, 5);
        expect(s).toBe('Hello');
    });
    it('bytes with length 0,index and count as valid ', () => {
        let bytes: ArrayBuffer = encoding.getBytes('', 0, 0);
        expect(bytes.byteLength).toBe(0);
        let s: string = encoding.getString(bytes, 0, 0);
        expect(s).toBe('');
    });
    it('bytes, index and count as valid value', () => {
        let bytes: Uint8Array = new Uint8Array([72, 101, 108, 108, 111]);
        let s: string = encoding.getString(bytes, 1, 3);
        expect(s).toBe('ell');
    });
    it('bytes and index as valid and count as invalid values', () => {
        let bytes: Uint8Array = new Uint8Array([72, 101, 108, 108, 111]);
        expect(bytes.length).toBe(5);
        expect((): void => { encoding.getString(bytes, 1, 6) }).toThrow(new RangeError('Argument Out Of Range Exception: index and count do not denote a valid range in bytes'));
    });
    it('bytes and count as valid and index as invalid value', () => {
        let bytes: Uint8Array = new Uint8Array([72, 101, 108, 108, 111]);
        expect(bytes.length).toBe(5);
        expect((): void => { encoding.getString(bytes, 6, 5) }).toThrow(new RangeError('Argument Out Of Range Exception: index and count do not denote a valid range in bytes'));
    });
    it('string with chinese character, index and count as valid value', () => {
        let s: string = '汉字';
        let getBytes: Uint8Array = new Uint8Array([216]);

        let text: string = encoding.getString(getBytes, 0, 1);
        expect(text === '汉字').toEqual(false);
    });
    it('bytes with unicode character', () => {
        let s: string = '¥';
        let bytes: ArrayBuffer = encoding.getBytes(s, 0, 1);
        let text: string = encoding.getString(bytes, 0, bytes.byteLength);
        expect(text === '¥').toEqual(true);

    });
    it('EncodingType with null in getString method', () => {
        let encoding: Encoding = new Encoding(true);
        encoding.type = undefined;
        let bytes: Uint8Array = new Uint8Array([72, 101, 108, 108, 111]);
        let s: string = encoding.getString(bytes, 0, bytes.length);
        expect(s).toBe('Hello');
    });
});

/**
 * Validating getString method in utf-8 encoding
 * method: getString(bytes:ArrayBuffer,index:number,count:number)
 * return string type
 */
describe('Validating getstring method in UTF-8 Encoding', () => {
    let encoding: Encoding;
    beforeEach((): void => {
        encoding = new Encoding(true);
        encoding.type = 'Utf8';
    });
    afterEach((): void => {
        encoding.destroy();
        encoding = undefined;

    });
    it('bytes,index,count as null parameter', () => {
        expect((): void => { encoding.getString(null, null, null); }).toThrow(new Error('ArgumentException: bytes cannot be null or undefined'));

    });
    it('bytes as valid values,index and count as null parameter', () => {
        let bytes: Uint8Array = new Uint8Array([72, 101, 108, 108, 111]);
        expect((): void => { encoding.getString(bytes, null, null); }).toThrow(new Error('ArgumentException: index cannot be null or undefined'));

    });
    it('index as null parameter, bytes and count as valid values', () => {
        let bytes: Uint8Array = new Uint8Array([72, 101, 108, 108, 111]);
        expect((): void => { encoding.getString(bytes, null, 1); }).toThrow(new Error('ArgumentException: index cannot be null or undefined'));

    });
    it('count as null parameter, bytes and index as valid values', () => {
        let bytes: Uint8Array = new Uint8Array([72, 101, 108, 108, 111]);
        expect((): void => { encoding.getString(bytes, 0, null); }).toThrow(new Error('ArgumentException: count cannot be null or undefined'));

    });
    it('bytes,index,count as undefined parameter', () => {
        expect((): void => { encoding.getString(undefined, undefined, undefined); }).toThrow(new Error('ArgumentException: bytes cannot be null or undefined'));
    });
    it('bytes as undefined,index and count as 0', () => {
        expect((): void => { encoding.getString(undefined, 0, 0); }).toThrow(new Error('ArgumentException: bytes cannot be null or undefined'));
    });
    it('valid bytes,index and count as undefined parameter', () => {
        let getBytes: ArrayBuffer = new ArrayBuffer(1);
        let bytes: Uint8Array = new Uint8Array(getBytes);
        bytes[0] = 97;
        expect((): void => { encoding.getString(getBytes, undefined, undefined); }).toThrow(new Error('ArgumentException: index cannot be null or undefined'));

    });
    it('valid bytes and count,index as undefined parameter', () => {
        let getBytes: ArrayBuffer = new ArrayBuffer(1);
        let bytes: Uint8Array = new Uint8Array(getBytes);
        bytes[0] = 97;
        expect((): void => { encoding.getString(getBytes, undefined, 1); }).toThrow(new Error('ArgumentException: index cannot be null or undefined'));

    });
    it('valid bytes and index,count as undefined parameter', () => {
        let getBytes: ArrayBuffer = new ArrayBuffer(1);
        let bytes: Uint8Array = new Uint8Array(getBytes);
        bytes[0] = 97;
        expect((): void => { encoding.getString(getBytes, 0, undefined); }).toThrow(new Error('ArgumentException: count cannot be null or undefined'));

    });
    it('index and count as negative value,bytes as valid values', () => {
        let bytes: Uint8Array = new Uint8Array([72, 101, 108, 108, 111]);
        expect((): void => { encoding.getString(bytes, -1, -1); }).toThrow(new RangeError('Argument Out Of Range Exception: index or count is less than zero'));

    });
    it('bytes as valid,index as 0 and count as negative value', () => {
        let bytes: Uint8Array = new Uint8Array([72, 101, 108, 108, 111]);
        expect((): void => { encoding.getString(bytes, 0, -1); }).toThrow(new RangeError('Argument Out Of Range Exception: index or count is less than zero'));

    });
    it('bytes as valid,index as negative value and count as 0', () => {
        let bytes: Uint8Array = new Uint8Array([72, 101, 108, 108, 111]);
        expect((): void => { encoding.getString(bytes, -1, 0); }).toThrow(new RangeError('Argument Out Of Range Exception: index or count is less than zero'));

    });
    it('valid bytes,index and count as 0', () => {
        let bytes: Uint8Array = new Uint8Array([72, 101, 108, 108, 111]);
        let s: string = encoding.getString(bytes, 0, 0);
        expect(s === '').toEqual(true);

    });
    it('bytes,index and count as valid value', () => {
        let bytes: Uint8Array = new Uint8Array([97, 101, 108, 108, 111]);
        let s: string = encoding.getString(bytes, 0, 1);
        expect(s === 'a').toEqual(true);

    });
    it('valid bytes,index as negative value and count as valid value', () => {
        let bytes: Uint8Array = new Uint8Array([72, 101, 108, 108, 111]);
        expect((): void => { encoding.getString(bytes, -1, 0); }).toThrow(new RangeError('Argument Out Of Range Exception: index or count is less than zero'));

    });
    it('bytes and index as valid and count as invalid values', () => {
        let bytes: Uint8Array = new Uint8Array([72, 101, 108, 108, 111]);
        expect(bytes.length).toBe(5);
        expect((): void => { encoding.getString(bytes, 1, 6) }).toThrow(new RangeError('Argument Out Of Range Exception: index and count do not denote a valid range in bytes'));
    });
    it('bytes and count as valid and index as invalid value', () => {
        let bytes: Uint8Array = new Uint8Array([72, 101, 108, 108, 111]);
        expect(bytes.length).toBe(5);
        expect((): void => { encoding.getString(bytes, 6, 5) }).toThrow(new RangeError('Argument Out Of Range Exception: index and count do not denote a valid range in bytes'));
    });
    it('bytes with valid value', () => {
        let bytes: Uint8Array = new Uint8Array([72, 101, 108, 108, 111]);
        let s: string = encoding.getString(bytes, 0, 5);
        expect(s).toBe('Hello');
    });
    it('bytes with unicode character', () => {
        let s: string = '¥';
        let bytes: ArrayBuffer = encoding.getBytes(s, 0, 1);
        let text: string = encoding.getString(bytes, 0, 1);
        expect(text === '¥').toEqual(false);
    });
    it('bytes with unicode character', () => {
        let s: string = '¥';
        let bytes: ArrayBuffer = encoding.getBytes(s, 0, 1);
        let text: string = encoding.getString(bytes, 0, 2);
        expect(text === '¥').toEqual(true);

    });
    it('bytes with length 0,index and count as valid values', () => {
        let bytes: ArrayBuffer = encoding.getBytes('', 0, 0);
        expect(bytes.byteLength).toBe(0);
        let s: string = encoding.getString(bytes, 0, 0);
        expect(s).toBe('');
    });
    it('bytes and index as valid and count as invalid values', () => {
        let bytes: Uint8Array = new Uint8Array([72, 101, 108, 108, 111]);
        expect(bytes.length).toBe(5);
        expect((): void => { encoding.getString(bytes, 1, 6) }).toThrow(new RangeError('Argument Out Of Range Exception: index and count do not denote a valid range in bytes'));
    });
    it('bytes and count as valid and index as invalid value', () => {
        let bytes: Uint8Array = new Uint8Array([72, 101, 108, 108, 111]);
        expect(bytes.length).toBe(5);
        expect((): void => { encoding.getString(bytes, 6, 5) }).toThrow(new RangeError('Argument Out Of Range Exception: index and count do not denote a valid range in bytes'));
    });
    it('string with chinese character, index and count as valid value', () => {
        let s: string = '汉字';
        let getBytes: ArrayBuffer = encoding.getBytes(s, 0, 2);
        let text: string = encoding.getString(getBytes, 0, getBytes.byteLength)
        expect(text).toBe('汉字');
    });
    it('valid string with chinese character', () => {
        let getBytes: Uint8Array = new Uint8Array([240, 141, 160, 128, 240, 141, 189, 136]);
        let text: string = encoding.getString(getBytes, 0, getBytes.length)
        expect(text).toBe('𐍈');
    });
});

/**
 * Validating getString method in unicode encoding
 * method: getString(bytes:ArrayBuffer,index:number,count:number)
 * return string type
 */
describe('Validating getstring method in Unicode Encoding', () => {
    let encoding: Encoding;
    beforeEach((): void => {
        encoding = new Encoding(true);
        encoding.type = 'Unicode';
    });
    afterEach((): void => {
        encoding.destroy();
        encoding = undefined;

    });
    it('bytes,index,count as null parameter', () => {
        expect((): void => { encoding.getString(null, null, null); }).toThrow(new Error('ArgumentException: bytes cannot be null or undefined'));

    });
    it('bytes as valid values,index and count as null parameter', () => {
        let bytes: Uint16Array = new Uint16Array([72, 101, 108, 108, 111]);
        expect((): void => { encoding.getString(bytes, null, null); }).toThrow(new Error('ArgumentException: index cannot be null or undefined'));

    });
    it('index as null parameter, bytes and count as valid values', () => {
        let bytes: Uint16Array = new Uint16Array([72, 101, 108, 108, 111]);
        expect((): void => { encoding.getString(bytes, null, 1); }).toThrow(new Error('ArgumentException: index cannot be null or undefined'));

    });
    it('count as null parameter, bytes and index as valid values', () => {
        let bytes: Uint16Array = new Uint16Array([72, 101, 108, 108, 111]);
        expect((): void => { encoding.getString(bytes, 0, null); }).toThrow(new Error('ArgumentException: count cannot be null or undefined'));

    });
    it('bytes,index,count as undefined parameter', () => {
        expect((): void => { encoding.getString(undefined, undefined, undefined); }).toThrow(new Error('ArgumentException: bytes cannot be null or undefined'));
    });
    it('bytes as undefined,index and count as 0', () => {
        expect((): void => { encoding.getString(undefined, 0, 0); }).toThrow(new Error('ArgumentException: bytes cannot be null or undefined'));
    });
    it('valid bytes,index and count as undefined parameter', () => {
        let getBytes: ArrayBuffer = new ArrayBuffer(2);
        let bytes: Uint16Array = new Uint16Array(getBytes);
        bytes[0] = 97;
        expect((): void => { encoding.getString(getBytes, undefined, undefined); }).toThrow(new Error('ArgumentException: index cannot be null or undefined'));

    });
    it('valid bytes and count,index as undefined parameter', () => {
        let getBytes: ArrayBuffer = new ArrayBuffer(2);
        let bytes: Uint16Array = new Uint16Array(getBytes);
        bytes[0] = 97;
        expect((): void => { encoding.getString(getBytes, undefined, 1); }).toThrow(new Error('ArgumentException: index cannot be null or undefined'));

    });
    it('valid bytes and index,count as undefined parameter', () => {
        let getBytes: ArrayBuffer = new ArrayBuffer(2);
        let bytes: Uint16Array = new Uint16Array(getBytes);
        bytes[0] = 97;
        expect((): void => { encoding.getString(getBytes, 0, undefined); }).toThrow(new Error('ArgumentException: count cannot be null or undefined'));

    });
    it('index and count as negative value,bytes as valid values', () => {
        let bytes: Uint16Array = new Uint16Array([72, 101, 108, 108, 111]);
        expect((): void => { encoding.getString(bytes, -1, -1); }).toThrow(new RangeError('Argument Out Of Range Exception: index or count is less than zero'));

    });
    it('bytes as valid,index as 0 and count as negative value', () => {
        let bytes: Uint16Array = new Uint16Array([72, 101, 108, 108, 111]);
        expect((): void => { encoding.getString(bytes, 0, -1); }).toThrow(new RangeError('Argument Out Of Range Exception: index or count is less than zero'));

    });
    it('bytes as valid,index as negative value and count as 0', () => {
        let bytes: Uint16Array = new Uint16Array([72, 101, 108, 108, 111]);
        expect((): void => { encoding.getString(bytes, -1, 0); }).toThrow(new RangeError('Argument Out Of Range Exception: index or count is less than zero'));

    });
    it('valid bytes,index and count as 0', () => {
        let bytes: Uint16Array = new Uint16Array([72, 101, 108, 108, 111]);
        let s: string = encoding.getString(bytes, 0, 0);
        expect(s === '').toEqual(true);

    });
    it('bytes,index and count as valid value', () => {
        let bytes: Uint16Array = new Uint16Array([97, 101, 108, 108, 111]);
        let s: string = encoding.getString(bytes, 0, 1);
        expect(s === 'a').toEqual(true);

    });
    it('valid bytes,index as negative value and count as valid value', () => {
        let bytes: Uint16Array = new Uint16Array([72, 101, 108, 108, 111]);
        expect((): void => { encoding.getString(bytes, -1, 0); }).toThrow(new RangeError('Argument Out Of Range Exception: index or count is less than zero'));

    });
    it('bytes and index as valid and count as invalid values', () => {
        let bytes: Uint16Array = new Uint16Array([72, 101, 108, 108, 111]);
        expect(bytes.length).toBe(5);
        expect((): void => { encoding.getString(bytes, 1, 12) }).toThrow(new RangeError('Argument Out Of Range Exception: index and count do not denote a valid range in bytes'));
    });
    it('bytes and count as valid and index as invalid value', () => {
        let bytes: Uint16Array = new Uint16Array([72, 101, 108, 108, 111]);
        expect(bytes.length).toBe(5);
        expect((): void => { encoding.getString(bytes, 6, 5) }).toThrow(new RangeError('Argument Out Of Range Exception: index and count do not denote a valid range in bytes'));
    });
    it('bytes with valid value', () => {
        let bytes: Uint16Array = new Uint16Array([72, 101, 108, 108, 111]);
        let s: string = encoding.getString(bytes, 0, 5);
        expect(s).toBe('Hello');
    });
    it('bytes with unicode character', () => {
        let s: string = '¥';
        let bytes: ArrayBuffer = encoding.getBytes(s, 0, 1);
        let text: string = encoding.getString(bytes, 0, 1);
        expect(text === '¥').toEqual(true);
    });
    it('bytes with length 0,index and count as valid values', () => {
        let bytes: ArrayBuffer = encoding.getBytes('', 0, 0);
        expect(bytes.byteLength).toBe(0);
        let s: string = encoding.getString(bytes, 0, 0);
        expect(s).toBe('');
    });
    it('bytes and index as valid and count as invalid values', () => {
        let bytes: Uint8Array = new Uint8Array([72, 101, 108, 108, 111]);
        expect(bytes.length).toBe(5);
        expect((): void => { encoding.getString(bytes, 1, 6) }).toThrow(new RangeError('Argument Out Of Range Exception: index and count do not denote a valid range in bytes'));
    });
    it('bytes and count as valid and index as invalid value', () => {
        let bytes: Uint8Array = new Uint8Array([72, 101, 108, 108, 111]);
        expect(bytes.length).toBe(5);
        expect((): void => { encoding.getString(bytes, 6, 5) }).toThrow(new RangeError('Argument Out Of Range Exception: index and count do not denote a valid range in bytes'));
    });
    it('string with chinese character, index and count as valid value', () => {
        let s: string = '汉字';
        let getBytes: ArrayBuffer = encoding.getBytes(s, 0, 2);
        let text: string = encoding.getString(getBytes, 0, 2)
        expect(text).toBe('汉字');
    });
    it('string with chinese character, index and count as valid value', () => {
        let s: string = '𤭢';
        let getBytes: ArrayBuffer = encoding.getBytes(s, 0, 2);
        let text: string = encoding.getString(getBytes, 0, 2)
        expect(text).toBe('𤭢');
    });
    it('string with chinese character, index and count as valid value', () => {
        let s: string = '𤭢';
        let getBytes: ArrayBuffer = encoding.getBytes(s, 0, 2);
        expect(() => { encoding.getString(getBytes, 0, getBytes.byteLength) }).toThrow(new RangeError('ArgumentOutOfRange_Count'));
    });

});

/**
 * Validating getByteCount Method in Ansi Encoding
 * method: getByteCount(chars:string)
 * return number
 */
describe('Validating getByteCount Method in Ansi Encoding', () => {
    let encoding: Encoding;
    beforeEach(() => {
        encoding = new Encoding();
        encoding.type = 'Ansi';
    });
    afterEach(() => {
        encoding.destroy();
        encoding = undefined;
    });
    it('string as Null', () => {
        expect((): void => { encoding.getByteCount(null); }).toThrow(new Error('ArgumentException: string cannot be null or undefined'));
    });
    it('string as undefined', () => {
        expect((): void => { encoding.getByteCount(undefined); }).toThrow(new Error('ArgumentException: string cannot be null or undefined'));
    });
    it('Empty string', () => {
        let byteCount: number = encoding.getByteCount('');
        expect(byteCount).toBe(0);
    });
    it('valid string with ASCII character', () => {
        let byteCount: number = encoding.getByteCount('Stream');
        expect(byteCount).toBe(6);
    });
    it('valid string with unicode character', () => {
        let byteCount: number = encoding.getByteCount('¥');
        expect(byteCount).toBe(1);
    });
    it('valid string with ascii and unicode text', () => {
        let byteCount: number = encoding.getByteCount('example ¥');
        expect(byteCount).toBe(9);
    });
    it('valid string with chinese character', () => {
        let byteCount: number = encoding.getByteCount('汉字');
        expect(byteCount).toBe(2);
    });
    it('EncodingType with null in getByteCount method', () => {
        let encoding: Encoding = new Encoding(true);
        encoding.type = undefined;
        let byteCount: number = encoding.getByteCount('encoding');
        expect(byteCount).toBe(8);
    });
});

/**
 * Validating getByteCount Method in UTF8 Encoding
 *  method: getByteCount(chars:string)
 */
describe('Validating getByteCount Method in UTF8 Encoding', () => {
    let encoding: Encoding;
    beforeEach(() => {
        encoding = new Encoding();
        encoding.type = 'Utf8';
    });
    afterEach(() => {
        encoding.destroy();
        encoding = undefined;
    });
    it('string as Null', () => {
        expect((): void => { encoding.getByteCount(null); }).toThrow(new Error('ArgumentException: string cannot be null or undefined'));
    });
    it('string as undefined', () => {
        expect((): void => { encoding.getByteCount(undefined); }).toThrow(new Error('ArgumentException: string cannot be null or undefined'));
    });
    it('Empty string', () => {
        let byteCount: number = encoding.getByteCount('');
        expect(byteCount).toBe(0);
    });
    it('valid string with ASCII character', () => {
        let byteCount: number = encoding.getByteCount('Stream');
        expect(byteCount).toBe(6);
    });
    it('valid string with unicode character', () => {
        let byteCount: number = encoding.getByteCount('¥');
        expect(byteCount).toBe(2);
    });
    it('valid string with ascii and unicode character', () => {
        let byteCount: number = encoding.getByteCount('example ¥');
        expect(byteCount).toBe(10);
    });
    it('valid string with chinese character', () => {
        let byteCount: number = encoding.getByteCount('汉字');
        expect(byteCount).toBe(6);
    });
    it('string with chinese character, index and count as valid value', () => {
        let s: string = '𐍈';
        let getBytes: number = encoding.getByteCount(s);
        expect(getBytes).toBe(4);
    });

});
/**
 * Validating getByteCount Method in unicode Encoding
 *  method: getByteCount(chars:string)
 */
describe('Validating getByteCount Method in unicode Encoding', () => {
    let encoding: Encoding;
    beforeEach(() => {
        encoding = new Encoding();
        encoding.type = 'Unicode';
    });
    afterEach(() => {
        encoding.destroy();
        encoding = undefined;
    });
    it('string as Null', () => {
        expect((): void => { encoding.getByteCount(null); }).toThrow(new Error('ArgumentException: string cannot be null or undefined'));
    });
    it('string as undefined', () => {
        expect((): void => { encoding.getByteCount(undefined); }).toThrow(new Error('ArgumentException: string cannot be null or undefined'));
    });
    it('Empty string', () => {
        let byteCount: number = encoding.getByteCount('');
        expect(byteCount).toBe(0);
    });
    it('valid string with ASCII character', () => {
        let byteCount: number = encoding.getByteCount('Stream');
        expect(byteCount).toBe(12);
    });
    it('valid string with unicode character', () => {
        let byteCount: number = encoding.getByteCount('¥');
        expect(byteCount).toBe(2);
    });
    it('valid string with ascii and unicode character', () => {
        let byteCount: number = encoding.getByteCount('example ¥');
        expect(byteCount).toBe(18);
    });
    it('valid string with chinese character', () => {
        let byteCount: number = encoding.getByteCount('汉字');
        expect(byteCount).toBe(4);
    });
    it('string with chinese character, index and count as valid value', () => {
        let s: string = '𐍈';
        let getBytes: number = encoding.getByteCount(s);
        expect(getBytes).toBe(4);
    });

});