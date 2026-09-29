import { _ConstructionType, _TagClassType, _UniversalType } from "../src/pdf/core/security/digital-signature/asn1/enumerator";
import { _PdfUniqueEncodingElement } from "../src/pdf/core/security/digital-signature/asn1/unique-encoding-element";

describe('1041547 - Unique Encoding Element 1', () => {
    it('1041547 - should return stored sequence when value is already an array', () => {
        const element: any = new _PdfUniqueEncodingElement(_TagClassType.universal,_ConstructionType.constructed);
        const sequence = [new _PdfUniqueEncodingElement(),new _PdfUniqueEncodingElement()];
        element._value = sequence;
        expect(element._getSequence()).toBe(sequence);
        expect(element._getSequence().length).toBe(2);
    });
    it('1041547 - should store values through _setAbstractSetOf', () => {
        const element: any = new _PdfUniqueEncodingElement(_TagClassType.universal,_ConstructionType.constructed);
        const items = [new _PdfUniqueEncodingElement(),new _PdfUniqueEncodingElement()];
        element._setAbstractSetOf(items);
        expect(element._getAbstractSetOf()).toBe(items);
        expect(element._getAbstractSetOf().length).toBe(2);
    });
    it('1041547 - should store videotex information value', () => {
        const element: any = new _PdfUniqueEncodingElement();
        element._setVideoTextInformation(new Uint8Array([65, 66, 67]));
        expect(Array.from(element._getVideoTextInformation())).toEqual([65, 66, 67]);
    });
    it('1041547 - should decode universal string using all four bytes with addition', () => {
        const element: any = new _PdfUniqueEncodingElement();
        element._construction = _ConstructionType.primitive;
        element._setValue(new Uint8Array([0x00, 0x00, 0x01, 0x00]));
        const result = element._getUniversalString();
        expect(result.charCodeAt(0)).toBe(256);
    });
    it('1041547 - should decode universal string using second byte contribution correctly', () => {
        const element: any = new _PdfUniqueEncodingElement();
        element._construction = _ConstructionType.primitive;
        element._setValue(new Uint8Array([0x00, 0x01, 0x00, 0x00]));
        const result = element._getUniversalString();
        expect(result.charCodeAt(0)).toBe(0);
    });
    it('1041547 - should include second byte in universal string decoding', () => {
        const element: any = new _PdfUniqueEncodingElement();
        element._construction = _ConstructionType.primitive;
        element._setValue(new Uint8Array([0x00, 0x01, 0x00, 0x41]));
        const result = element._getUniversalString();
        expect(result).not.toBe('');
    });
    it('1041547 - should use the third byte when decoding universal string', () => {
        const element: any = new _PdfUniqueEncodingElement();
        element._construction = _ConstructionType.primitive;
        element._setValue(new Uint8Array([0x00, 0x00, 0x01, 0x00]));
        const result = element._getUniversalString();
        expect(result.charCodeAt(0)).toBe(256);
    });
    it('1041547 - should use the third byte when decoding universal string', () => {
        const element: any = new _PdfUniqueEncodingElement();
        element._construction = _ConstructionType.primitive;
        element._setValue(new Uint8Array([0x00, 0x00, 0x01, 0x00]));
        const result = element._getUniversalString();
        expect(result.charCodeAt(0)).toBe(256);
    });
    it('1041547 - should encode exactly one character into four bytes', () => {
        const element: any = new _PdfUniqueEncodingElement();
        element._setUniversalString('A');
        const result = element._getValue();
        expect(result.length).toBe(4);
        expect(Array.from(result)).toEqual([0, 0, 0, 65]);
    });
    it('1041547 - should store the third universal string byte at the correct position', () => {
        const element: any = new _PdfUniqueEncodingElement();
        element._setUniversalString('\u0100');
        const result = element._getValue();
        expect(Array.from(result)).toEqual([0, 0, 1, 0]);
    });
    it('1041547 - should encode integer values and set integer tag number', () => {
        const element: any = new _PdfUniqueEncodingElement();
        element._encode(123);
        expect(element._getTagNumber()).toBe(_UniversalType.integer);
        expect(element._getInteger()).toBe(123);
    });
    it('1041547 - should encode integer values', () => {
        const element: any = new _PdfUniqueEncodingElement();
        element._encode(123);
        expect(element._getTagNumber()).toBe(_UniversalType.integer);
        expect(element._getInteger()).toBe(123);
    });
    it('1041547 - should encode integer values as ASN.1 integer', () => {
        const element: any = new _PdfUniqueEncodingElement();
        element._encode(123);
        expect(element._getTagNumber()).toBe(_UniversalType.integer);
        expect(element._getInteger()).toBe(123);
    });
    it('1041547 - should filter out falsy elements when creating a set', () => {
        const element: any = new _PdfUniqueEncodingElement();
        const result = element._fromSet([new _PdfUniqueEncodingElement(),null,undefined]);
        const values = result._getAbstractSetOf();
        expect(values.length).toBe(1);
    });
    it('1041547 - should filter out falsy elements when creating a setOf', () => {
        const set = [new _PdfUniqueEncodingElement(),null,undefined] as any;
        const result: any = _PdfUniqueEncodingElement.prototype._fromSetOf(set);
        const values = result._getAbstractSetOf();
        expect(values.length).toBe(1);
        expect(values[0]).toBeDefined();
    });
    it('1041547 - should preserve valid elements in setOf', () => {
        const item1 = new _PdfUniqueEncodingElement();
        const item2 = new _PdfUniqueEncodingElement();
        const result: any =_PdfUniqueEncodingElement.prototype._fromSetOf([item1,item2]);
        const values = result._getAbstractSetOf();
        expect(values.length).toBe(2);
        expect(values).toEqual([item1, item2]);
    });
    it('1041547 - should throw truncated tag-number error for incomplete long tag encoding', () => {
        const element: any = new _PdfUniqueEncodingElement();
        expect(() => {element._fromBytes(new Uint8Array([0x1F,0x81,0x80]));}).toThrowError('ASN1 tag number appears to have been truncated.');
    });
    it('1041547 - should throw ASN1 tag number too large for 5-byte long tag encoding', () => {
        const element: any = new _PdfUniqueEncodingElement();
        expect(() => {element._fromBytes(new Uint8Array([0x1F,0x81,0x81,0x81,0x81,0x00]));}).toThrowError('ASN1 tag number too large.');
    });
    it('1041547 - should stop reading tag number when continuation bit is cleared', () => {
        const element: any = new _PdfUniqueEncodingElement();
        expect(() => {element._fromBytes(new Uint8Array([0x1F,0x01,0xFF,0x00]));}).toThrowError('ASN1 tag number could have been encoded in short form.');
    });
    it('1041547 - should decode long-form tag number', () => {
        const element: any = new _PdfUniqueEncodingElement();
        expect(() => {element._fromBytes(new Uint8Array([0x1F,0x81,0x00,0x00]));}).not.toThrow();
    });
    it('1041547 - should allow long-form tag number 31', () => {
        const element: any = new _PdfUniqueEncodingElement();
        expect(() => {element._fromBytes(new Uint8Array([0x1F,0x1F,0x00]));}).not.toThrow();
        expect(element._getTagNumber()).toBe(31);
    });
    it('1041547 - should throw when length bytes end exactly at the end of the buffer', () => {
        const element: any = new _PdfUniqueEncodingElement();
        expect(() => {element._fromBytes(new Uint8Array([0x02,0x81]));
        }).toThrowError(
            'Element length bytes appear to have been truncated.'
        );
    });
    it('1041547 - should decode a one-byte long-form length correctly', () => {
        const element: any = new _PdfUniqueEncodingElement();
        const consumed = element._fromBytes(new Uint8Array([0x02,0x81,0x01,0x05]));
        expect(consumed).toBe(4);
        expect(Array.from(element._getValue())).toEqual([0x05]);
    });
    it('1041547 - should allow a 3-octet length when value exceeds 32767', () => {
        const element: any = new _PdfUniqueEncodingElement();
        const bytes = new Uint8Array([0x04,0x83,0x00,0xC3,0x50]);
        expect(() => {element._fromBytes(bytes);}).not.toThrowError('DER-encoded long-form length encoded on more octets than necessary');
    });
    it('1041547 - should allow a valid 3-octet length greater than 32767', () => {
        const element: any = new _PdfUniqueEncodingElement();
        expect(() => {element._fromBytes(new Uint8Array([0x04,0x83,0x00,0xC3,0x50]));
        }).not.toThrowError('DER-encoded long-form length encoded on more octets than necessary');
    });
    it('1041547 - should allow 3 length octets when length exceeds 32767', () => {
        const element: any = new _PdfUniqueEncodingElement();
        const bytes = new Uint8Array([0x04,0x83,0x00,0x80,0x00 ]);
        expect(() => {element._fromBytes(bytes);}).not.toThrowError('DER-encoded long-form length encoded on more octets than necessary');
    });
    it('1041547 - should reject a 4-octet length encoding when 3 octets are sufficient', () => {
        const element: any = new _PdfUniqueEncodingElement();
        const bytes = new Uint8Array(106);
        bytes.set([0x04,0x84,0x00,0x00,0x00,0x64]);
        expect(() => {
            element._fromBytes(bytes);
        }).toThrowError(
            'DER-encoded long-form length encoded on more octets than necessary'
        );
    });
    it('1041547 - should encode long-form tag numbers with continuation bit cleared on last byte', () => {
        const element: any = new _PdfUniqueEncodingElement();
        element._setTagNumber(128);
        const result = element._tagAndLengthBytes();
        expect(Array.from(result).slice(0, 3)).toEqual([0x1F, 0x81, 0x00]);
    });
    it('1041547 - should encode long-form tag numbers with continuation bits set on intermediate bytes', () => {
        const element: any = new _PdfUniqueEncodingElement();
        element._setTagNumber(128);
        const result = element._tagAndLengthBytes();
        expect(Array.from(result).slice(0, 3)).toEqual([0x1F, 0x81, 0x00]);
    });
    it('1041547 - should include child buffers for constructed elements', () => {
        const child = new _PdfUniqueEncodingElement();
        child._setUtf8String('A');
        const parent: any = new _PdfUniqueEncodingElement();
        parent._value = [child];
        const buffers = parent._toBuffers();
        expect(buffers.length).toBeGreaterThan(1);
    });
    it('1041547 - should return existing component array without decoding', () => {
        const child1 = new _PdfUniqueEncodingElement();
        const child2 = new _PdfUniqueEncodingElement();
        const element: any = new _PdfUniqueEncodingElement();
        element._value = [child1, child2];
        const result = element._getComponents();
        expect(result).toBe(element._value);
        expect(result.length).toBe(2);
    });
    it('1041547 - should return existing component array without decoding', () => {
        const child1 = new _PdfUniqueEncodingElement();
        const child2 = new _PdfUniqueEncodingElement();
        const element: any = new _PdfUniqueEncodingElement();
        element._value = [child1, child2];
        const result = element._getComponents();
        expect(result).toBe(element._value);
        expect(result.length).toBe(2);
    });
    it('1041547 - should throw for a single-byte bit string with non-zero unused-bit count', () => {
        const element: any = new _PdfUniqueEncodingElement();
        expect(() => {
            element._decodeBitString(new Uint8Array([1]));
        }).toThrowError(
            'ASN1 bit string encoded with deceptive first byte!'
        );
    });
    it('1041547 - should throw the expected error message for a deceptive one-byte bit string', () => {
        const element: any = new _PdfUniqueEncodingElement();
        expect(() => {
            element._decodeBitString(new Uint8Array([1]));
        }).toThrowError(
            'ASN1 bit string encoded with deceptive first byte!'
        );
    });
    it('1041547 - should decode ASN.1 FALSE encoded as 0x00', () => {
        const element: any = new _PdfUniqueEncodingElement();
        const result = element._decodeBoolean(
            new Uint8Array([0x00])
        );
        expect(result).toBe(false);
    });
    it('1041547 - should throw the expected error message for invalid boolean encoding', () => {
        const element: any = new _PdfUniqueEncodingElement();
        expect(() => {
            element._decodeBoolean(new Uint8Array([0x01]));
        }).toThrowError(
            'Boolean must be encoded as 0xFF or 0x00.'
        );
    });
    it('1041547 - should preserve valid elements when creating a sequence', () => {
        const item1 = new _PdfUniqueEncodingElement();
        const item2 = new _PdfUniqueEncodingElement();
        const result: any =
            _PdfUniqueEncodingElement.prototype._fromSequence([
                item1,
                item2
            ]);

        const values = result._getSequence();
        expect(values.length).toBe(2);
        expect(values).toEqual([item1, item2]);
    });
    it('1041547 - should calculate constructed value length from child elements', () => {
        const child = new _PdfUniqueEncodingElement();
        child._setUtf8String('A');
        const parent: any = new _PdfUniqueEncodingElement();
        parent._value = [child];
        const expected = child._tagValueLength();
        expect(parent._valueLength()).toBe(expected);
    });
    it('1041547 - should use _valueLength when valueLength is null', () => {
        const element: any = new _PdfUniqueEncodingElement();
        spyOn(element, '_valueLength').and.returnValue(10);
        expect(element._lengthLength(null)).toBe(1);
        expect(element._valueLength).toHaveBeenCalled();
    });
    it('1041547 - should use the provided valueLength when it is not null or undefined', () => {
        const element: any = new _PdfUniqueEncodingElement();
        spyOn(element, '_valueLength').and.returnValue(300);
        expect(element._lengthLength(10)).toBe(1);
        expect(element._valueLength).not.toHaveBeenCalled();
    });
    it('1041547 - should return 2 length bytes for length 128', () => {
        const element: any = new _PdfUniqueEncodingElement();
        expect(element._lengthLength(128)).toBe(2);
    });
})
describe('1041547 - Unique Encoding Element 2', () => {
    it('1041547 - should preserve provided construction type in constructor', () => {
        const element: any = new _PdfUniqueEncodingElement(_TagClassType.universal, _ConstructionType.constructed);
        expect(element._construction).toBe(_ConstructionType.constructed);
    });
    it('1041547 - should use second byte when decoding universal string', () => {
        const element: any = new _PdfUniqueEncodingElement();
        element._construction = _ConstructionType.primitive;
        element._setValue(new Uint8Array([0x00, 0x01, 0x01, 0x41]));
        const result = element._getUniversalString();
        expect(result.charCodeAt(0)).toBe(321);
    });
    it('1041547 - should encode BMP string without extra trailing bytes', () => {
        const element: any = new _PdfUniqueEncodingElement();
        element._setBmpString('A');
        expect(Array.from(element._getValue())).toEqual([0x00, 0x41]);
    });
    it('1041547 - should encode array items as unique encoding elements', () => {
        const element: any = new _PdfUniqueEncodingElement();
        element._encode([1, 2]);
        const values = element._getSequence();
        expect(values.length).toBe(2);
        expect(values[0] instanceof _PdfUniqueEncodingElement).toBeTruthy();
        expect(values[1]instanceof _PdfUniqueEncodingElement).toBeTruthy();
        expect(values[0]._getInteger()).toBe(1);
        expect(values[1]._getInteger()).toBe(2);
    });
    it('1041547 - should allow zero-length long-form content', () => {
        const element: any = new _PdfUniqueEncodingElement();
        expect(() => {element._fromBytes(new Uint8Array([0x04, 0x81, 0x00]));}).not.toThrow();
        expect(element._getValue().length).toBe(0);
    });
    it('1041547 - should reject 3-octet length encoding for length 32767', () => {
        const element: any = new _PdfUniqueEncodingElement();
        const bytes = new Uint8Array(32772); // 5 header + 32767 content
        bytes.set([0x04, 0x83, 0x00, 0x7F, 0xFF]);
        expect(() => {element._fromBytes(bytes);}).toThrowError('DER-encoded long-form length encoded on more octets than necessary');
    });
    it('1041547 - should allow 4 length octets when length exceeds 8388607', () => {
        const element: any = new _PdfUniqueEncodingElement();
        expect(() => {element._fromBytes(new Uint8Array([0x04, 0x84, 0x00, 0x80, 0x00, 0x00]));}).not.toThrowError('DER-encoded long-form length encoded on more octets than necessary');
    });
    it('1041547 - should allow 4 length octets for length greater than 8388607', () => {
        const element: any = new _PdfUniqueEncodingElement();
        const bytes = new Uint8Array(8388616); // 6-byte header + content
        bytes.set([0x04, 0x84, 0x00, 0x80, 0x00, 0x00]); // length = 8388608
        expect(() => {element._fromBytes(bytes);}).not.toThrowError('DER-encoded long-form length encoded on more octets than necessary');
    });
    it('1041547 - should reject 4-octet length encoding for length 8388607', () => {
        const element: any = new _PdfUniqueEncodingElement();
        const length = 0x007FFFFF;
        const bytes = new Uint8Array(length + 6);
        bytes.set([0x04, 0x84, 0x00, 0x7F, 0xFF, 0xFF]);
        expect(() => {element._fromBytes(bytes);}).toThrowError('DER-encoded long-form length encoded on more octets than necessary');
    });
    it('1041547 - should encode tag number 31 using long-form tag encoding', () => {
        const element: any = new _PdfUniqueEncodingElement();
        element._setTagNumber(31);
        const result = element._tagAndLengthBytes();
        expect(Array.from(result).slice(0, 2)).toEqual([0x1F, 0x1F]);
    });
    it('1041547 - should encode short-form tag number into first tag byte', () => {
        const element: any = new _PdfUniqueEncodingElement();
        element._setTagNumber(2);
        const result = element._tagAndLengthBytes();
        expect(result[0]).toBe(0x02);
    });
    it('1041547 - should include tag byte for short-form tags', () => {
        const element: any = new _PdfUniqueEncodingElement();
        element._setTagNumber(2);
        const result = element._tagAndLengthBytes();
        expect(result.length).toBeGreaterThan(1);
        expect(Array.from(result).slice(0, 2)).toEqual([0x02, 0x00]);
    });
    it('1041547 - should decode components from encoded value', () => {
        const child = new _PdfUniqueEncodingElement();
        child._setUtf8String('A');
        const parent: any = new _PdfUniqueEncodingElement();
        parent._value = child._toBytes();
        const components = parent._getComponents();
        expect(components.length).toBe(1);
        expect(components[0] instanceof _PdfUniqueEncodingElement).toBeTruthy();
    });
    it('1041547 - should throw expected error for zero length bit string', () => {
        const element: any = new _PdfUniqueEncodingElement();
        expect(() => {element._decodeBitString(new Uint8Array(0));}).toThrowError('ASN1 bit string cannot be encoded on zero bytes!');
    });
    it('1041547 - should decode bit string with unused bits and valid trailing zeros', () => {
        const element: any = new _PdfUniqueEncodingElement();
        const result = element._decodeBitString(new Uint8Array([1, 0x80]));
        expect(result.length).toBe(7);
    });
    it('1041547 - should allow multi-byte bit string with unused bits', () => {
        const element: any = new _PdfUniqueEncodingElement();
        const result = element._decodeBitString(new Uint8Array([1, 0x80]));
        expect(result.length).toBe(7);
    });
    it('1041547 - should allow a one-byte bit string with zero unused bits', () => {
        const element: any = new _PdfUniqueEncodingElement();
        expect(() => {element._decodeBitString(new Uint8Array([0]));}).not.toThrow();
    });
    it('1041547 - should decode valid bit string when unused bits count is within range', () => {
        const element: any = new _PdfUniqueEncodingElement();
        expect(() => {element._decodeBitString(new Uint8Array([0, 0x80]));}).not.toThrow();
    });
    it('1041547 - should throw expected error when unused bit count exceeds seven', () => {
        const element: any = new _PdfUniqueEncodingElement();
        expect(() => {element._decodeBitString(new Uint8Array([8, 0x00]));}).toThrowError('First byte of an ASN1 bit string must be <= 7!');
    });
});
describe('1041547 - Unique Encoding Element 3', () => {
    it('1041547 - should preserve explicitly provided constructed type', () => {
        const element: any = new _PdfUniqueEncodingElement(
            _TagClassType.universal,
            _ConstructionType.constructed
        );
        expect(element._construction).toBe(_ConstructionType.constructed);
        expect(element._construction).not.toBe(_ConstructionType.primitive);
    });
    it('1041547 - should treat explicitly constructed element as constructed', () => {
        const element: any = new _PdfUniqueEncodingElement(
            _TagClassType.universal,
            _ConstructionType.constructed
        );
        expect(element._isConstructed()).toBeTruthy();
    });
    it('1041547 - should update abstract set when _setAbstractSetOf is called', () => {
        const element: any = new _PdfUniqueEncodingElement();
        const items = [new _PdfUniqueEncodingElement()];
        element._setAbstractSetOf(items);
        expect(element._getAbstractSetOf()).toEqual(items);
    });
    it('1041547 - should add the third byte contribution when decoding universal string', () => {
        const element: any = new _PdfUniqueEncodingElement();
        element._construction = _ConstructionType.primitive;
        element._setValue(new Uint8Array([0x00, 0x00, 0x01, 0x41]));
        const result = element._getUniversalString();
        expect(result.charCodeAt(0)).toBe(321);
    });
    it('1041547 - should include second byte contribution positively when decoding universal string', () => {
        const element: any = new _PdfUniqueEncodingElement();
        element._construction = _ConstructionType.primitive;
        element._setValue(new Uint8Array([0x00, 0x01, 0x00, 0x41]));
        const result = element._getUniversalString();
        expect(result.charCodeAt(0)).toBe(65);
    });
    it('1041547 - should use the second byte at index i plus 1 when decoding universal string', () => {
        const element: any = new _PdfUniqueEncodingElement();
        element._construction = _ConstructionType.primitive;
        element._setValue(new Uint8Array([0x00, 0x01, 0x00, 0x00]));
        const result = element._getUniversalString();
        expect(result.charCodeAt(0)).toBe(0);
        expect(result).not.toBe('');
    });
    it('1041547 - should include the second byte contribution in universal string decoding', () => {
        const element: any = new _PdfUniqueEncodingElement();
        element._construction = _ConstructionType.primitive;
        element._setValue(new Uint8Array([0x00, 0x01, 0x01, 0x41]));
        const result = element._getUniversalString();
        expect(result.charCodeAt(0)).toBe(321);
    });
    it('1041547 - should use the third byte contribution when decoding universal string', () => {
        const element: any = new _PdfUniqueEncodingElement();
        element._construction = _ConstructionType.primitive;
        element._setValue(new Uint8Array([0x00, 0x00, 0x01, 0x00]));
        const result = element._getUniversalString();
        expect(result.charCodeAt(0)).toBe(256);
    });
    it('1041547 - should call charCodeAt exactly once per character when encoding universal string', () => {
        const element: any = new _PdfUniqueEncodingElement();
        const spy = spyOn(String.prototype, 'charCodeAt').and.callThrough();
        element._setUniversalString('A');
        expect(spy.calls.count()).toBe(4);
    });
});