import { _ConstructionType, _TagClassType, _UniversalType } from "../src/pdf/core/security/digital-signature/asn1/enumerator";
import { _PdfUniqueEncodingElement } from "../src/pdf/core/security/digital-signature/asn1/unique-encoding-element";
import { _bytesToString, _getBigInt } from "../src/pdf/core/utils";
describe('1041529 - Abstrct syntax mutation 1', () => {
    it('1041529 - should use default Unicode string name when _name is not set', () => {
        const element: any = new _PdfUniqueEncodingElement();
        element._setUtf8String('');
        try {
            element._sizeConstrainedUtf8String(1);
            fail('Expected exception');
        } catch (e) {
            expect(e.message).toBe(
                'Unicode string must be at least 1 characters, but was 0 characters.'
            );
        }
    });
    it('1041529 - should throw when setting a negative tag number', () => {
        const element = new _PdfUniqueEncodingElement();
        try {
            element._setTagNumber(-1);
            fail('Expected exception');
        } catch (e) {
            expect(e.message).toEqual('Tag -1 was not a non-negative number.');
        }
    });
    it('1041529 - should not throw when max is undefined', () => {
        const element = new _PdfUniqueEncodingElement();
        expect(() => {
            element._validateSize('Size', 'items', 1000, 1, undefined);
        }).not.toThrow();
    });
    it('1041529 - should throw when actual size exceeds the provided max', () => {
        const element = new _PdfUniqueEncodingElement();
        try {
            element._validateSize('Size', 'items', 6, 1, 5);
            fail('Expected exception');
        } catch (e) {
            expect(e.message).toEqual('Size must not exceed 5 items, but was 6 items.');
        }
    });
    it('1041529 - should use default bit string label and units in validation error', () => {
        const element = new _PdfUniqueEncodingElement();
        element._setBitString(new Uint8ClampedArray([1]));
        expect(() => {
            element._sizeConstrainedString(2);
        }).toThrowError(
            /Bit string must be at least 2 bits, but was 1 bits/
        );
    });
    it('1041529 - should use default unicode string label and character units in validation error', () => {
        const element = new _PdfUniqueEncodingElement();
        expect(() => {
            element._sizeConstrainedUtf8String(1);
        }).toThrowError(
            /Unicode string must be at least 1 characters, but was 0 characters/
        );
    });
    it('1041529 - should use default set of label and element units in validation error', () => {
        const element = new _PdfUniqueEncodingElement();
        element._setSequenceOf([]);
        expect(() => {
            element._sizeConstrainedSetOf(1);
        }).toThrowError(
            /Set of must be at least 1 elements, but was 0 elements/
        );
    });
    it('1041529 - should use default numeric string label and character units in validation error', () => {
        const element = new _PdfUniqueEncodingElement();
        element._setNumericString('');
        expect(() => {
            element._sizeConstrainedNumericString(1);
        }).toThrowError(
            /Numeric string must be at least 1 characters, but was 0 characters/
        );
    });
    it('1041529 - should use default printable string label and character units in validation error', () => {
        const element = new _PdfUniqueEncodingElement();
        element._setPrintableString('');
        expect(() => {
            element._sizeConstrainedPrintableString(1);
        }).toThrowError(
            /Printable ASCII string must be at least 1 characters, but was 0 characters/
        );
    });
    it('1041529 - should use default legacy encoded string label and character units in validation error', () => {
        const element = new _PdfUniqueEncodingElement();
        element._setTeleprinterText(new Uint8Array([]));
        expect(() => {
            element._sizeConstrainedTextString(1);
        }).toThrowError(
            /Legacy encoded string must be at least 1 characters, but was 0 characters/
        );
    });
    it('1041529 - should use default videotex string label and character units in validation error', () => {
        const element = new _PdfUniqueEncodingElement();
        element._setVideoTextInformation(new Uint8Array([]));
        expect(() => {
            element._sizeConstrainedVideoString(1);
        }).toThrowError(
            /Videotex string must be at least 1 characters, but was 0 characters/
        );
    });
    it('1041529 - should use default ASCII string label and character units in validation error', () => {
        const element = new _PdfUniqueEncodingElement();
        element._setInternationalAlphabetString('');
        try {
            element._sizeConstrainedIA5String(1);
            fail('Expected exception');
        } catch (e) {
            expect(e.message).toEqual('ASCII string must be at least 1 characters, but was 0 characters.')
        }
    });
    it('1041529 - should use default graphic string label and character units in validation error', () => {
        const element = new _PdfUniqueEncodingElement();
        element._setGraphicString('');
        try {
            element._sizeConstrainedGraphicString(1);
            fail('Expected exception');
        } catch (e) {
            expect(e.message).toEqual('Graphic string must be at least 1 characters, but was 0 characters.');
        }
    });
    it('1041529 - should use default visible string label and character units in validation error', () => {
        const element = new _PdfUniqueEncodingElement();
        element._setVisibleString('');
        try {
            element._sizeConstrainedVisibleString(1);
            fail('Expected exception');
        } catch (e) {
            expect(e.message).toEqual('Visible string must be at least 1 characters, but was 0 characters.');
        }
    });
    it('1041529 - should use default unicode string label and character units in validation error', () => {
        const element = new _PdfUniqueEncodingElement();
        element._setUniversalString('');
        try {
            element._sizeConstrainedUniversalString(1);
            fail('Expected exception');
        } catch (e) {
            expect(e.message).toEqual('Unicode string must be at least 1 characters, but was 0 characters.');
        }
    });
});
describe('1041529 - Abstrct syntax mutation 2', () => {
    it('1041529 - should return octet string in ASN.1 hex format', () => {
        const element = new _PdfUniqueEncodingElement();
        element._setTagNumber(_UniversalType.octetString);
        element._setOctetString(new Uint8Array([0x01, 0x02]));
        expect(element._toString()).toBe("'0102'H");
    });
    it('1041529 - should return quoted object descriptor string', () => {
        const element = new _PdfUniqueEncodingElement();
        element._setTagNumber(_UniversalType.objectDescriptor);
        element._setObjectDescriptor('Test');
        expect(element._toString()).toBe('"Test"');
    });
    it('1041529 - should return quoted utf8 string', () => {
        const element = new _PdfUniqueEncodingElement();
        element._setTagNumber(_UniversalType.utf8String);
        element._setUtf8String('Hello');
        expect(element._toString()).toBe('"Hello"');
    });
    it('1041529 - should return quoted numeric string', () => {
        const element = new _PdfUniqueEncodingElement();
        element._setTagNumber(_UniversalType.numericString);
        element._setNumericString('123');
        expect(element._toString()).toBe('"123"');
    });
    it('1041529 - should return quoted printable string', () => {
        const element = new _PdfUniqueEncodingElement();
        element._setTagNumber(_UniversalType.printableString);
        element._setPrintableString('ABC');
        expect(element._toString()).toBe('"ABC"');
    });
    it('1041529 - should return quoted date string', () => {
        const element = new _PdfUniqueEncodingElement();
        const date = new Date(2024, 0, 1);
        element._setTagNumber(_UniversalType.date);
        element._setDate(date);
        expect(element._toString()).toBe(`"${date.toISOString()}"`);
    });
    it('1041529 - should return time of day with separators', () => {
        const element = new _PdfUniqueEncodingElement();
        const time = new Date();
        time.setUTCHours(1);
        time.setUTCMinutes(2);
        time.setUTCSeconds(3);
        element._setTagNumber(_UniversalType.timeOfDay);
        element._setTimeOfDay(time);
        expect(element._toString()).toContain(':');
        expect(element._toString()).toBe('"1:2:3"');
    });
    it('1041529 - should return quoted date time string', () => {
        const element = new _PdfUniqueEncodingElement();
        const dateTime = new Date(2024, 0, 1, 10, 11, 12);
        element._setTagNumber(_UniversalType.dateTime);
        element._setDateTime(dateTime);
        expect(element._toString()).toBe(`"${dateTime.toISOString()}"`);
    });
    it('1041529 - should return default universal representation', () => {
        const element = new _PdfUniqueEncodingElement(
            _TagClassType.universal,
            _ConstructionType.primitive,
            99
        );
        element._setValue(new Uint8Array([1, 2]));
        expect(element._toString()).toBe('[UNIV 99]: 1,2');
    });
    it('1041529 - should return context representation', () => {
        const element = new _PdfUniqueEncodingElement(
            _TagClassType.context,
            _ConstructionType.primitive,
            1
        );
        element._setValue(new Uint8Array([5]));
        expect(element._toString()).toBe('[CTXT 1]: 5');
    });
    it('1041529 - should return relative object identifier with braces', () => {
        const element = new _PdfUniqueEncodingElement();
        element._setTagNumber(_UniversalType.relativeObjectIdentifier);
        element._setRelativeObjectIdentifier([1, 2, 3]);
        expect(element._toString()).toBe('{ 1.2.3 }');
    });
    it('1041529 - should serialize bit string to json', () => {
        const element = new _PdfUniqueEncodingElement();
        element._setTagNumber(_UniversalType.bitString);
        element._setBitString(new Uint8ClampedArray([1, 0, 1, 0, 1, 0, 1, 0]));
        expect(element._toJson()).toEqual({
            length: 8,
            value: 'aa'
        });
    });
    it('1041529 - should serialize octet string to hex string', () => {
        const element = new _PdfUniqueEncodingElement();
        element._setTagNumber(_UniversalType.octetString);
        element._setOctetString(new Uint8Array([1, 2, 3]));
        expect(element._toJson()).toBe('123');
    });
    it('1041529 - should serialize time of day with hour minute separator', () => {
        const element = new _PdfUniqueEncodingElement();
        const time = new Date();
        time.setHours(1);
        time.setMinutes(2);
        time.setSeconds(3);
        element._setTagNumber(_UniversalType.timeOfDay);
        element._setTimeOfDay(time);
    });
    it('1041529 - should serialize object id resource identifier', () => {
        const element = new _PdfUniqueEncodingElement();
        element._setTagNumber(_UniversalType.objectIdResourceIdentifier);
        element._setObjectIdResourceIdentifier('oid-resource');
        expect(element._toJson()).toBe('oid-resource');
    });
});
describe('1041529 - Abstrct syntax mutation 3', () => {
    it('1041529 - should not throw when max is undefined', () => {
        const bigIntConstructor = _getBigInt();
        const element = new _PdfUniqueEncodingElement();
        expect(() => {
            element._validateRange('Value', 10, bigIntConstructor(0));
        }).not.toThrow();
    });
    it('1041529 - should allow values when max is undefined', () => {
        const bigIntConstructor = _getBigInt();
        const element = new _PdfUniqueEncodingElement();
        expect(() => {
            element._validateRange('Value', 5, bigIntConstructor(0));
        }).not.toThrow();
    });
    it('1041529 - should not throw when max is null', () => {
         const bigIntConstructor = _getBigInt();
        const element = new _PdfUniqueEncodingElement();
        expect(() => {
            element._validateRange('Value', 5, bigIntConstructor(0), null as any);
        }).not.toThrow();
    });
    it('1041529 - should allow value equal to maximum', () => {
        const bigIntConstructor = _getBigInt();
        const element = new _PdfUniqueEncodingElement();
        expect(() => {
            element._validateRange(
                'Value',
                5,
                bigIntConstructor(0),
                bigIntConstructor(5)
            );
        }).not.toThrow();
    });
});
describe('1041529 - Abstrct syntax mutation 4', () => {
    it('1041529 - should return false when duplicate tags exist', () => {
        const element = new _PdfUniqueEncodingElement();
        const elements: any[] = [
            {
                _tagClass: 1,
                _getTagNumber(): number {
                    return 1;
                }
            },
            {
                _tagClass: 1,
                _getTagNumber(): number {
                    return 1;
                }
            }
        ];
        expect(element._isUniquelyTagged(elements)).toBe(false);
    });
    it('1041529 - should return true when all tags are unique', () => {
        const element = new _PdfUniqueEncodingElement();
        const elements: any[] = [
            {
                _tagClass: 1,
                _getTagNumber(): number {
                    return 1;
                }
            },
            {
                _tagClass: 1,
                _getTagNumber(): number {
                    return 2;
                }
            }
        ];
        expect(element._isUniquelyTagged(elements)).toBe(true);
    });
    it('1041529 - should return true for empty elements collection', () => {
        const element = new _PdfUniqueEncodingElement();
        expect(element._isUniquelyTagged([])).toBe(true);
    });
    it('1041529 - should identify uniqueness based on tag class and tag number', () => {
        const element = new _PdfUniqueEncodingElement();
        const elements: any[] = [
            {
                _tagClass: 1,
                _getTagNumber(): number {
                    return 10;
                }
            },
            {
                _tagClass: 2,
                _getTagNumber(): number {
                    return 10;
                }
            }
        ];
        expect(element._isUniquelyTagged(elements)).toBe(true);
    });
    it('1041529 - should use addition when computing uniqueness key', () => {
        const element = new _PdfUniqueEncodingElement();
        const elements: any[] = [
            {
                _tagClass: 1,
                _getTagNumber(): number {
                    return 1;
                }
            },
            {
                _tagClass: 0,
                _getTagNumber(): number {
                    return (1 << 30) + 1;
                }
            }
        ];
        expect(element._isUniquelyTagged(elements)).toBe(false);
    });
    it('1041529 - should return true when all tag keys are unique', () => {
        const element = new _PdfUniqueEncodingElement();
        const elements: any[] = [
            {
                _tagClass: 1,
                _getTagNumber(): number {
                    return 100;
                }
            },
            {
                _tagClass: 1,
                _getTagNumber(): number {
                    return 101;
                }
            }
        ];
        expect(element._isUniquelyTagged(elements)).toBe(true);
    });
    it('1041529 - should return false when duplicate tag keys are found', () => {
        const element = new _PdfUniqueEncodingElement();
        const elements: any[] = [
            {
                _tagClass: 1,
                _getTagNumber(): number {
                    return 100;
                }
            },
            {
                _tagClass: 1,
                _getTagNumber(): number {
                    return 100;
                }
            }
        ];
        expect(element._isUniquelyTagged(elements)).toBe(false);
    });
    it('1041529 - 1041529 - should return false for duplicate tag class and tag number', () => {
        const parent: any = new _PdfUniqueEncodingElement();
        const e1: any = new _PdfUniqueEncodingElement(
            _TagClassType.context,
            _ConstructionType.primitive,
            10
        );
        const e2: any = new _PdfUniqueEncodingElement(
            _TagClassType.context,
            _ConstructionType.primitive,
            10
        );
        expect(parent._isUniquelyTagged([e1, e2])).toBe(false);
    });
    it('1041529 - should return true for same tag number in different tag classes', () => {
        const parent: any = new _PdfUniqueEncodingElement();
        const e1: any = new _PdfUniqueEncodingElement(
            _TagClassType.context,
            _ConstructionType.primitive,
            1
        );
        const e2: any = new _PdfUniqueEncodingElement(
            _TagClassType.application,
            _ConstructionType.primitive,
            1
        );
        expect(parent._isUniquelyTagged([e1, e2])).toBe(true);
    });
    it('1041529 - should throw the expected error when relative oid is constructed', () => {
        const element: any = new _PdfUniqueEncodingElement();
        element._construction = _ConstructionType.constructed;

        expect(() => {
            element._getRelativeObjectIdentifier();
        }).toThrowError(/Relative oid cannot be constructed/);
    });
    it('1041529 - should store the encoded relative object identifier value', () => {
        const element: any = new _PdfUniqueEncodingElement();
        element._setRelativeObjectIdentifier([1, 2, 3]);
        expect(element._getRelativeObjectIdentifier()).toEqual([1, 2, 3]);
    });
    it('1041529 - should allow valid two-byte negative integer without padding error', () => {
        const element: any = new _PdfUniqueEncodingElement();
        expect(() => {
            element._decodeInteger(new Uint8Array([0xFF, 0x80]));
        }).not.toThrow();
    });
    it('1041529 - should not treat non-0xFF leading byte as padded integer', () => {
        const element: any = new _PdfUniqueEncodingElement();
        expect(() => {
            element._decodeInteger(new Uint8Array([0x01, 0x80, 0x00]));
        }).not.toThrow();
    });
    it('1041529 - should not throw when second byte is >= 128 but first byte is not 0xFF', () => {
        const element: any = new _PdfUniqueEncodingElement();
        expect(() => {
            element._decodeInteger(new Uint8Array([0x01, 0xFF, 0x00]));
        }).not.toThrow();
    });
    it('1041529 - should throw for unnecessary positive integer padding bytes', () => {
        const element: any = new _PdfUniqueEncodingElement();
        expect(() => {
            element._decodeInteger(new Uint8Array([0x00, 0x01, 0x02]));
        }).toThrowError(
            /Unnecessary padding bytes on.*0x000102/
        );
    });
    it('1041529 - should throw when padded positive integer has second byte below 128', () => {
        const element: any = new _PdfUniqueEncodingElement();
        expect(() => {
            element._decodeInteger(new Uint8Array([0x00, 0x7F, 0x01]));
        }).toThrowError(
            /Unnecessary padding bytes on.*0x007f01/
        );
    });
    it('1041529 - should include only first 16 bytes in error message', () => {
        const element: any = new _PdfUniqueEncodingElement();
        const value = new Uint8Array([
            0x00, 0x01, 0x02, 0x03,
            0x04, 0x05, 0x06, 0x07,
            0x08, 0x09, 0x0A, 0x0B,
            0x0C, 0x0D, 0x0E, 0x0F,
            0x10, 0x11, 0x12, 0x13
        ]);
        try {
            element._decodeInteger(value);
            fail('Expected exception');
        } catch (e) {
            const message = (e as Error).message;
            expect(message).toContain(
                '0x000102030405060708090a0b0c0d0e0f'
            );
            expect(message).not.toContain(
                '10111213'
            );
        }
    });
    it('1041529 - should show exactly 16 bytes in hex string for padding error with longer array', () => {
        const element: any = new _PdfUniqueEncodingElement();
        const longValue = new Uint8Array([
            0x00, 0x01, 0x02, 0x03,
            0x04, 0x05, 0x06, 0x07,
            0x08, 0x09, 0x0A, 0x0B,
            0x0C, 0x0D, 0x0E, 0x0F,
            0x10, 0x11, 0x12, 0x13
        ]);
        try {
            element._decodeInteger(longValue);
            fail('Expected exception');
        } catch (e) {
            const message = (e as Error).message;
            expect(message).toContain('First 16 bytes');
            const hexMatch = message.match(/0x([0-9a-f]+)/i);
            expect(hexMatch).not.toBeNull();
            if (hexMatch) {
                expect(hexMatch[1].length).toBe(32);
                expect(hexMatch[1].toLowerCase())
                    .toBe('000102030405060708090a0b0c0d0e0f');
            }
        }
    });
    it('1041529 - should truncate offending value to first 16 bytes in error message', () => {
        const element: any = new _PdfUniqueEncodingElement();
        const value = new Uint8Array([
            0x00, 0x01, 0x02, 0x03,
            0x04, 0x05, 0x06, 0x07,
            0x08, 0x09, 0x0A, 0x0B,
            0x0C, 0x0D, 0x0E, 0x0F,
            0x10, 0x11, 0x12, 0x13
        ]);
        expect(() => {
            element._decodeInteger(value);
        }).toThrowError(
            'Unnecessary padding bytes on . First 16 bytes of the offending value were: 0x000102030405060708090a0b0c0d0e0f'
        );
    });
    it('1041529 - should encode relative object identifier value less than 128 as a single byte', () => {
        const element: any = new _PdfUniqueEncodingElement();
        const result = element._encodeRelativeObjectIdentifier([127]);
        expect(Array.from(result)).toEqual([127]);
    });
    it('1041529 - should not attempt to access array element beyond length', () => {
        const element: any = new _PdfUniqueEncodingElement();
        const value = [1, 2, 3];
        expect(() => {
            element._encodeRelativeObjectIdentifier(value);
        }).not.toThrow();
    });
    it('1041529 - should encode relative oid without accessing beyond array bounds', () => {
        const element: any = new _PdfUniqueEncodingElement();
        const value = [10, 20, 30];
        const result = element._encodeRelativeObjectIdentifier(value);
        expect(result.length).toBe(3);
        expect(Array.from(result)).toEqual([10, 20, 30]);
    });
    it('1041529 - should not process undefined value from loop overrun', () => {
        const element: any = new _PdfUniqueEncodingElement();
        const value = [50];
        const result = element._encodeRelativeObjectIdentifier(value);
        expect(result.length).toBe(1);
        expect(result[0]).toBe(50);
    });
    it('1041529 - should include small arc values less than 128 in output', () => {
        const element: any = new _PdfUniqueEncodingElement();
        const result = element._encodeRelativeObjectIdentifier([5]);
        expect(Array.from(result)).toEqual([5]);
        expect(result.length).toBe(1);
    });
    it('1041529 - should handle multiple small arcs correctly', () => {
        const element: any = new _PdfUniqueEncodingElement();
        const result = element._encodeRelativeObjectIdentifier([1, 2, 3]);
        expect(Array.from(result)).toEqual([1, 2, 3]);
        expect(result.length).toBe(3);
    });
    it('1041529 - should not skip arc values below 128', () => {
        const element: any = new _PdfUniqueEncodingElement();
        const smallArcs = [0, 1, 10, 50, 100, 127];
        const result = element._encodeRelativeObjectIdentifier(smallArcs);
        expect(Array.from(result)).toEqual([0, 1, 10, 50, 100, 127]);
        expect(result.length).toBe(6);
    });
    it('1041529 - should push small arc to result array', () => {
        const element: any = new _PdfUniqueEncodingElement();
        const result = element._encodeRelativeObjectIdentifier([42]);
        expect(result.length).toBeGreaterThan(0);
        expect(result[0]).toBe(42);
    });
    it('1041529 - should encode small arc with single byte not multi-byte encoding', () => {
        const element: any = new _PdfUniqueEncodingElement();
        const result = element._encodeRelativeObjectIdentifier([100]);
        expect(Array.from(result)).toEqual([100]);
        expect(result.length).toBe(1);
    });
    it('1041529 - should not multi-byte encode small values', () => {
        const element: any = new _PdfUniqueEncodingElement();
        const result = element._encodeRelativeObjectIdentifier([127]);
        expect(Array.from(result)).toEqual([127]);
        expect(result.length).toBe(1);
    });
    it('1041529 - should continue to next arc after encoding small value', () => {
        const element: any = new _PdfUniqueEncodingElement();
        const result = element._encodeRelativeObjectIdentifier([50, 100, 75]);
        expect(Array.from(result)).toEqual([50, 100, 75]);
        expect(result.length).toBe(3);
    });
    it('1041529 - should return empty array for empty input', () => {
        const element: any = new _PdfUniqueEncodingElement();
        const result = element._decodeRelativeObjectIdentifier(new Uint8Array([]));
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(0);
        expect(result).toEqual([]);
    });
    it('1041529 - should handle empty relative oid without throwing', () => {
        const element: any = new _PdfUniqueEncodingElement();
        expect(() => {
            element._decodeRelativeObjectIdentifier(new Uint8Array([]));
        }).not.toThrow();
    });
    it('1041529 - should return array not undefined for empty input', () => {
        const element: any = new _PdfUniqueEncodingElement();
        const result = element._decodeRelativeObjectIdentifier(new Uint8Array([]));
        expect(result).not.toBeUndefined();
        expect(result).not.toBeNull();
    });
    it('1041529 - should not throw for single-element array with valid value', () => {
        const element: any = new _PdfUniqueEncodingElement();
        expect(() => {
            element._decodeRelativeObjectIdentifier(new Uint8Array([0x05]));
        }).not.toThrow();
    });
    it('1041529 - should allow single-element array ending with non-high-bit', () => {
        const element: any = new _PdfUniqueEncodingElement();
        const result = element._decodeRelativeObjectIdentifier(new Uint8Array([0x42]));
        expect(result).toEqual([0x42]);
    });
    it('1041529 - should not throw for single element with last byte having high bit', () => {
        const element: any = new _PdfUniqueEncodingElement();
        expect(() => {
            element._decodeRelativeObjectIdentifier(new Uint8Array([0xFF]));
        }).not.toThrow();
    });
    it('1041529 - should throw for single byte continuation value with unsupported padding', () => {
        const element: any = new _PdfUniqueEncodingElement();
        expect(() => {
            element._decodeRelativeObjectIdentifier(
                new Uint8Array([0x80])
            );
        }).toThrowError(
            'The relative object identifier node has unsupported padding.'
        );
    });
    it('1041529 - should allow single-element array in validation check', () => {
        const element: any = new _PdfUniqueEncodingElement();
        expect(() => {
            element._decodeRelativeObjectIdentifier(new Uint8Array([0x05]));
        }).not.toThrow();
    });
    it('1041529 - should throw only when length > 1 and last byte has high bit', () => {
        const element: any = new _PdfUniqueEncodingElement();
        expect(() => {
            element._decodeRelativeObjectIdentifier(new Uint8Array([0x05, 0x80]));
        }).toThrowError(/too long and was shortened/);
    });
    it('1041529 - should return empty array for empty input', () => {
        const element: any = new _PdfUniqueEncodingElement();
        const result = element._decodeRelativeObjectIdentifier(
            new Uint8Array([])
        );
        expect(result).toEqual([]);
    });
    it('1041529 - should not treat a single byte as shortened oid', () => {
        const element: any = new _PdfUniqueEncodingElement();
        expect(() => {
            element._decodeRelativeObjectIdentifier(
                new Uint8Array([0x81])
            );
        }).not.toThrowError('The relative object identifier is too long and was shortened.');
    });
    it('1041529 - should distinguish between length > 1 and length >= 1 cases', () => {
        const element: any = new _PdfUniqueEncodingElement();
        expect(() => {
            element._decodeRelativeObjectIdentifier(new Uint8Array([0xFF]));
        }).not.toThrow();
        expect(() => {
            element._decodeRelativeObjectIdentifier(new Uint8Array([0x05, 0xFF]));
        }).toThrowError(/too long and was shortened/);
    });
    it('1041529 - should validate length boundary for incomplete sequences', () => {
        const element: any = new _PdfUniqueEncodingElement();
        const singleResult = element._decodeRelativeObjectIdentifier(new Uint8Array([0x81]));
        expect(singleResult).toBeDefined();
        expect(() => {
            element._decodeRelativeObjectIdentifier(new Uint8Array([0x01, 0x81]));
        }).toThrowError();
    });
    it('1041529 - should allow year 9999 in encodeDate', () => {
        const element: any = new _PdfUniqueEncodingElement();
        const date = new Date(9999, 0, 1);
        date.setFullYear(9999);
        expect(() => {
            element._encodeDate(date);
        }).not.toThrow();
    });
    it('1041529 - should successfully encode maximum allowed year', () => {
        const element: any = new _PdfUniqueEncodingElement();
        const date = new Date(9999, 11, 31);
        date.setFullYear(9999);
        const result = element._encodeDate(date);
        expect(result).toBeDefined();
        expect(result.length).toBeGreaterThan(0);
    });
    it('1041529 - should encode year 9999 with correct format', () => {
        const element: any = new _PdfUniqueEncodingElement();
        const date = new Date(9999, 0, 1);
        date.setFullYear(9999);
        const result = element._encodeDate(date);
        const resultString = _bytesToString(result);
        expect(resultString.startsWith('9999')).toBe(true);
    });
    it('1041529 - should throw for year 10000', () => {
        const element: any = new _PdfUniqueEncodingElement();
        const date = new Date(10000, 0, 1);
        date.setFullYear(10000);
        expect(() => {
            element._encodeDate(date);
        }).toThrowError(/year must be greater than 1581 and less than 10000/);
    });
    it('1041529 - should encode minimum supported year 1582', () => {
        const element: any = new _PdfUniqueEncodingElement();
        const date = new Date(1582, 0, 1);
        const result = element._encodeDate(date);
        const resultString = _bytesToString(result);
        expect(resultString.substring(0, 4)).toBe('1582');
    });
    it('1041529 - should encode minimum supported year 1582', () => {
        const element: any = new _PdfUniqueEncodingElement();
        const date = new Date(1582, 0, 1);
        const result = element._encodeDate(date);
        const resultString = _bytesToString(result);
        expect(resultString.substring(0, 4)).toBe('1582');
    });
    it('1041529 - should encode minimum supported year 1582', () => {
        const element: any = new _PdfUniqueEncodingElement();
        const result = element._encodeDate(
            new Date(1582, 0, 1)
        );
        const value = _bytesToString(result);
        expect(value.substring(0, 4)).toBe('1582');
    });
    it('1041529 - should encode year 1582 with proper padding', () => {
        const element: any = new _PdfUniqueEncodingElement();
        const date = new Date(1582, 0, 1);
        date.setFullYear(1582);
        const result = element._encodeDate(date);
        const resultString = _bytesToString(result);
        expect(resultString.substring(0, 4)).toBe('1582');
    });
    it('1041529 - should maintain 4-digit year format for all valid years', () => {
        const element: any = new _PdfUniqueEncodingElement();
        const testYears = [1582, 1000, 500, 100, 10, 1, 9999];
        for (const year of testYears) {
            if (year >= 1582 && year <= 9999) {
                const date = new Date(year, 0, 1);
                date.setFullYear(year);
                const result = element._encodeDate(date);
                const resultString = _bytesToString(result);
                expect(resultString.substring(0, 4).length).toBe(4);
                expect(resultString.substring(0, 4)).toMatch(/^\d{4}$/);
            }
        }
    });
    it('1041529 - should include DATE label in validation error message', () => {
        const element: any = new _PdfUniqueEncodingElement();
        try {
            element._decodeDate(new Uint8Array([50, 48, 50, 52, 49, 51, 48, 49]));
            fail('Expected exception');
        } catch (e) {
            expect((e as any).message).toContain('DATE');
        }
    });
    it('1041529 - should validate date with proper label in error', () => {
        const element: any = new _PdfUniqueEncodingElement();
        try {
            element._decodeDate(new Uint8Array([50, 48, 50, 52, 48, 49, 51, 50]));
            fail('Expected exception');
        } catch (e) {
            expect((e as any).message).toContain('DATE');
            expect((e as any).message).not.toBe('');
        }
    });
    it('1041529 - should encode minimum supported year 1582', () => {
        const element: any = new _PdfUniqueEncodingElement();
        const result = element._encodeDate(
            new Date(1582, 0, 1)
        );
        const value = _bytesToString(result);
        expect(value.substring(0, 4)).toBe('1582');
    });
    it('1041529 - should use DATE label not empty string for validation', () => {
        const element: any = new _PdfUniqueEncodingElement();
        try {
            element._decodeDate(new Uint8Array([50, 48, 50, 52, 48, 48, 48, 49]));
            fail('Expected exception');
        } catch (e) {
            expect((e as any).message).toContain('DATE');
            expect((e as any).message.length).toBeGreaterThan(4); // Should be more than just label
        }
    });
    it('1041529 - should report DATE validation failure for invalid leap-year day', () => {
        const element: any = new _PdfUniqueEncodingElement();
        expect(() => {
            element._decodeDate(
                new Uint8Array([50, 48, 50, 52, 48, 50, 51, 48]) // 20240230
            );
        }).toThrowError(
            'Day > 29 encountered in DATE with month of February in leap year.'
        );
    });
    it('1041529 - should not use empty label in validation', () => {
        const element: any = new _PdfUniqueEncodingElement();
        try {
            element._decodeDate(new Uint8Array([50, 48, 50, 52, 49, 51, 48, 49]));
            fail('Expected exception');
        } catch (e) {
            expect((e as any).message).not.toMatch(/^\s/);
            expect((e as any).message).toContain('DATE');
        }
    });
    it('1041529 - should include DATE-TIME label in datetime validation error', () => {
        const element: any = new _PdfUniqueEncodingElement();
        try {
            element._decodeDateTime(new Uint8Array([50, 48, 50, 52, 48, 49, 48, 49, 50, 53, 48, 48, 48, 48]));
            fail('Expected exception');
        } catch (e) {
            expect((e as any).message).toContain('DATE-TIME');
        }
    });
    it('1041529 - should validate datetime with proper label in error message', () => {
        const element: any = new _PdfUniqueEncodingElement();
        try {
            element._decodeDateTime(new Uint8Array([50, 48, 50, 52, 48, 49, 48, 49, 49, 50, 54, 49, 48, 48]));
            fail('Expected exception');
        } catch (e) {
            expect((e as any).message).toContain('DATE-TIME');
            expect((e as any).message).not.toBe('');
        }
    });
    it('1041529 - should throw error with DATE-TIME identifier in message', () => {
        const element: any = new _PdfUniqueEncodingElement();
        try {
            element._decodeDateTime(new Uint8Array([50, 48, 50, 52, 48, 49, 48, 49, 49, 50, 51, 48, 54, 49]));
            fail('Expected exception');
        } catch (e) {
            expect((e as any).message).toMatch(/DATE-TIME/);
        }
    });
    it('1041529 - should use DATE-TIME label not empty string for datetime validation', () => {
        const element: any = new _PdfUniqueEncodingElement();
        try {
            element._decodeDateTime(new Uint8Array([50, 48, 50, 52, 48, 48, 48, 49, 49, 50, 51, 48, 48, 48]));
            fail('Expected exception');
        } catch (e) {
            expect((e as any).message).toContain('DATE-TIME');
            expect((e as any).message.length).toBeGreaterThan(8);
        }
    });
    it('1041529 - should identify DATE-TIME validation errors with proper label', () => {
        const element: any = new _PdfUniqueEncodingElement();
        try {
            element._decodeDateTime(new Uint8Array([50, 48, 50, 52, 48, 49, 51, 50, 49, 50, 51, 48, 48, 48]));
            fail('Expected exception');
        } catch (e) {
            expect((e as any).message).toMatch(/DATE-TIME/);
        }
    });
    it('1041529 - should include DATE-TIME label in validation error', () => {
        const element: any = new _PdfUniqueEncodingElement();
        try {
            element._decodeDateTime(
                new Uint8Array([
                    50, 48, 50, 52,
                    49, 51,
                    48, 49,
                    49, 50,
                    51, 48,
                    48, 48
                ])
            );
            fail('Expected exception');
        } catch (e) {
            expect((e as Error).message).toContain('DATE-TIME');
        }
    });
    it('1041529 - should distinguish datetime errors with DATE-TIME label from date errors', () => {
        const element: any = new _PdfUniqueEncodingElement();
        try {
            element._decodeDateTime(new Uint8Array([50, 48, 50, 52, 48, 49, 48, 49, 50, 52, 48, 48, 48, 48]));
            fail('Expected exception');
        } catch (e) {
            expect((e as any).message).toContain('DATE-TIME');
            expect((e as any).message).not.toMatch(/^DATE[^-]/); // Ensure it's DATE-TIME not just DATE
        }
    });
    it('1041529 - should include period at end of visible string error message', () => {
        const element: any = new _PdfUniqueEncodingElement();
        try {
            element._decodeVisibleString(new Uint8Array([0x1F]));
            fail('Expected exception');
        } catch (e) {
            expect((e as any).message).toContain('Encountered character code 31.');
            expect((e as any).message.endsWith('.')).toBe(true);
        }
    });
    it('1041529 - should end error message with period for invalid visible character', () => {
        const element: any = new _PdfUniqueEncodingElement();
        try {
            element._decodeVisibleString(new Uint8Array([0x00]));
            fail('Expected exception');
        } catch (e) {
            expect((e as any).message).toMatch(/\.\s*$/);
        }
    });
    it('1041529 - should properly punctuate visible string validation error', () => {
        const element: any = new _PdfUniqueEncodingElement();
        try {
            element._decodeVisibleString(new Uint8Array([0x7F]));
            fail('Expected exception');
        } catch (e) {
            const message = (e as any).message;
            expect(message).toMatch(/Encountered character code \d+\.$/);
        }
    });
    it('1041529 - should include complete punctuation in error message', () => {
        const element: any = new _PdfUniqueEncodingElement();
        try {
            element._decodeVisibleString(new Uint8Array([0x01]));
            fail('Expected exception');
        } catch (e) {
            expect((e as any).message).not.toMatch(/\d+""$/);
            expect((e as any).message).toMatch(/\d+\.$/);
        }
    });
    it('1041529 - should not remove period from visible string error', () => {
        const element: any = new _PdfUniqueEncodingElement();
        try {
            element._decodeVisibleString(new Uint8Array([0x08]));
            fail('Expected exception');
        } catch (e) {
            expect((e as any).message).toMatch(/Encountered character code \d+\.$/);
            expect((e as any).message).not.toMatch(/\d+$/); // Should NOT end without period
        }
    });
    it('1041529 - should validate visible string with proper sentence ending', () => {
        const element: any = new _PdfUniqueEncodingElement();
        try {
            element._decodeVisibleString(new Uint8Array([0x1B]));
            fail('Expected exception');
        } catch (e) {
            const lastChar = (e as any).message[(e as any).message.length - 1];
            expect(lastChar).toBe('.');
        }
    });
    it('1041529 - should encode empty bit string as single zero byte', () => {
        const element: any = new _PdfUniqueEncodingElement();
        const result = element._encodeBitString(new Uint8ClampedArray([]));
        expect(result.length).toBe(1);
        expect(result[0]).toBe(0);
        expect(Array.from(result)).toEqual([0]);
    });
    it('1041529 - should handle empty bit string without falling through to main logic', () => {
        const element: any = new _PdfUniqueEncodingElement();
        const result = element._encodeBitString(new Uint8ClampedArray([]));
        expect(result).toBeDefined();
        expect(result.length).toBe(1);
    });
    it('1041529 - should return early for empty bit string', () => {
        const element: any = new _PdfUniqueEncodingElement();
        const emptyBits = new Uint8ClampedArray(0);
        const result = element._encodeBitString(emptyBits);
        expect(result).toEqual(new Uint8Array([0]));
    });
    it('1041529 - should not continue processing empty bit string', () => {
        const element: any = new _PdfUniqueEncodingElement();
        const result = element._encodeBitString(new Uint8ClampedArray([]));
        expect(result.length).toBe(1);
        expect(result[0]).toBe(0);
    });
    it('1041529 - should return immediate result for empty bits', () => {
        const element: any = new _PdfUniqueEncodingElement();
        const empty = new Uint8ClampedArray([]);
        const result = element._encodeBitString(empty);
        expect(result.length).not.toBeGreaterThan(1);
        expect(Array.from(result)).toEqual([0]);
    });
    it('1041529 - should distinguish empty bit string from non-empty', () => {
        const element: any = new _PdfUniqueEncodingElement();
        const empty = new Uint8ClampedArray([]);
        const nonEmpty = new Uint8ClampedArray([1, 0, 1]);
        const emptyResult = element._encodeBitString(empty);
        const nonEmptyResult = element._encodeBitString(nonEmpty);
        expect(emptyResult.length).toBe(1);
        expect(Array.from(emptyResult)).toEqual([0]);
        expect(nonEmptyResult.length).toBeGreaterThan(1);
    });
    it('1041529 - should encode empty bit string with correct structure', () => {
        const element: any = new _PdfUniqueEncodingElement();
        const result = element._encodeBitString(new Uint8ClampedArray([]));
        expect(result[0]).toBe(0);
        expect(result.length).toBe(1);
    });
    it('1041529 - should handle empty bit string before calculating byte length', () => {
        const element: any = new _PdfUniqueEncodingElement();
        const empty = new Uint8ClampedArray(0);
        expect(() => {
            element._encodeBitString(empty);
        }).not.toThrow();
        const result = element._encodeBitString(empty);
        expect(result).toEqual(new Uint8Array([0]));
    });
    it('1041529 - should decode DATE-TIME month correctly', () => {
        const element: any = new _PdfUniqueEncodingElement();
        const value = element._decodeDateTime(
            new Uint8Array([
                50, 48, 50, 52,
                48, 49,
                48, 49,
                49, 48,
                49, 49,
                49, 50
            ])
        );
        expect(value.getFullYear()).toBe(2024);
        expect(value.getMonth()).toBe(0);
        expect(value.getDate()).toBe(1);
    });
    it('1041529 - should throw expected error for non-printable character', () => {
        const element: any = new _PdfUniqueEncodingElement();
        expect(() => {
            element._decodePrintableString(new Uint8Array([0x00]));
        }).toThrowError(
            /Printable ASCII string can only contain these characters:.*Encountered character code 0/
        );
    });
    it('1041529 - should throw expected error for invalid visible string character', () => {
        const element: any = new _PdfUniqueEncodingElement();
        expect(() => {
            element._decodeVisibleString(new Uint8Array([0x1F]));
        }).toThrowError(
            /Visible string can only contain characters between 0x20 and 0x7E.*Encountered character code 31/
        );
    });
    it('1041529 - should encode empty bit string as a single zero byte', () => {
        const element: any = new _PdfUniqueEncodingElement();
        const result = element._encodeBitString(new Uint8ClampedArray([]));
        expect(Array.from(result)).toEqual([0]);
    });
    it('1041529 - should accept year 1582 as valid (boundary)', () => {
        const element: any = new _PdfUniqueEncodingElement();
        const date = new Date(1582, 0, 1, 0, 0, 0);
        expect(() => {
            element._encodeDateTime(date);
        }).not.toThrow();
    });
    it('1041529 - should encode year 1582 correctly in datetime string', () => {
        const element: any = new _PdfUniqueEncodingElement();
        const date = new Date(1582, 0, 1, 0, 0, 0);
        const result = element._encodeDateTime(date) as Uint8Array;
        const decoded = Array.from(result)
            .map((b: number) => String.fromCharCode(b))
            .join('');
        expect(decoded.startsWith('1582')).toBe(true);
    });
    it('1041529 - should distinguish between year 1581 (invalid) and 1582 (valid)', () => {
        const element: any = new _PdfUniqueEncodingElement();
        expect(() => {
            element._encodeDateTime(new Date(1581, 0, 1));
        }).toThrowError('The date cannot be encoded');
        expect(() => {
            element._encodeDateTime(new Date(1582, 0, 1));
        }).not.toThrow();
    });
    it('1041529 - should encode minimum supported year 1582', () => {
        const element: any = new _PdfUniqueEncodingElement();
        const date = new Date(1582, 0, 1, 0, 0, 0);
        const result = element._encodeDateTime(date);
        const decoded = String.fromCharCode(...result);
        expect(decoded).toBe('15820101000000');
    });
    it('1041529 - should pad hours with zeros to 2 digits', () => {
        const element: any = new _PdfUniqueEncodingElement();
        const date = new Date(2024, 0, 1, 5, 0, 0); // 5:00:00
        const result = element._encodeDateTime(date);
        const decoded = String.fromCharCode(...(result));
        expect(decoded.substring(8, 10)).toBe('05');
    });
    it('1041529 - should pad single-digit hours correctly', () => {
        const element: any = new _PdfUniqueEncodingElement();
        const date = new Date(2024, 0, 1, 3, 30, 45);
        const result = element._encodeDateTime(date);
        const decoded = String.fromCharCode(...(result));
        expect(decoded.substring(8, 10)).toBe('03');
    });
    it('1041529 - should pad minutes with zeros to 2 digits', () => {
        const element: any = new _PdfUniqueEncodingElement();
        const date = new Date(2024, 0, 1, 12, 7, 0);
        const result = element._encodeDateTime(date);
        const decoded = String.fromCharCode(...result);
        expect(decoded.substring(10, 12)).toBe('07');
    });
    it('1041529 - should pad single-digit minutes correctly', () => {
        const element: any = new _PdfUniqueEncodingElement();
        const date = new Date(2024, 0, 1, 12, 3, 45);
        const result = element._encodeDateTime(date);
        const decoded = String.fromCharCode(...result);
        expect(decoded.substring(10, 12)).toBe('03');
    });
    it('1041529 - should pad seconds with zeros to 2 digits', () => {
        const element: any = new _PdfUniqueEncodingElement();
        const date = new Date(2024, 0, 1, 12, 30, 9); // 12:30:09
        const result = element._encodeDateTime(date);
        const decoded = String.fromCharCode(...result);
        expect(decoded.substring(12, 14)).toBe('09');
    });
    it('1041529 - should pad single-digit seconds correctly', () => {
        const element: any = new _PdfUniqueEncodingElement();
        const date = new Date(2024, 0, 1, 12, 30, 2);
        const result = element._encodeDateTime(date);
        const decoded = String.fromCharCode(...result);
        expect(decoded.substring(12, 14)).toBe('02');
    });
    it('1041529 - should encode complete datetime with all padded values', () => {
        const element: any = new _PdfUniqueEncodingElement();
        const date = new Date(2024, 0, 5, 6, 7, 8);
        const result = element._encodeDateTime(date);
        const decoded = String.fromCharCode(...result);
        expect(decoded).toBe('20240105060708');
        expect(decoded.length).toBe(14);
    });
    it('1041529 - should throw when year is less than 1582', () => {
        const element: any = new _PdfUniqueEncodingElement();
        expect(() => {
            element._encodeDateTime(new Date(1581, 0, 1));
        }).toThrowError(/The date cannot be encoded/);
    });
    it('1041529 - should allow year 9999', () => {
        const element: any = new _PdfUniqueEncodingElement();
        expect(() => {
            element._encodeDateTime(new Date(9999, 0, 1));
        }).not.toThrow();
    });
    it('1041529 - should encode single digit month with leading zero', () => {
        const element: any = new _PdfUniqueEncodingElement();
        const result = element._encodeDateTime(
            new Date(2024, 0, 1, 10, 11, 12)
        );
        expect(_bytesToString(result)).toBe('20240101101112');
    });
    it('1041529 - should concatenate encoded sequence elements', () => {
        const element: any = new _PdfUniqueEncodingElement();
        const child1 = new _PdfUniqueEncodingElement();
        child1._setValue(new Uint8Array([1, 2]));
        const child2 = new _PdfUniqueEncodingElement();
        child2._setValue(new Uint8Array([3, 4]));
        const result = element._encodeSequence([child1, child2]);
        expect(Array.from(result)).toEqual([0, 2, 1, 2, 0, 2, 3, 4]);
    });
})
describe('1041529 - Abstrct syntax mutation 5', () => {
    it('should treat undefined max as unbounded', () => {
        const element: any = new _PdfUniqueEncodingElement();
        expect(() => {element._validateSize('Size','items',Number.MAX_SAFE_INTEGER,0,undefined);}).not.toThrow();
    });
    it('should allow value equal to minimum', () => {
        const bigIntConstructor = _getBigInt();
        const element = new _PdfUniqueEncodingElement();
        expect(() => {element._validateRange('Value',5,bigIntConstructor(5));}).not.toThrow();
    });
    it('1041529 - should return quoted time string', () => {
        const element: any = new _PdfUniqueEncodingElement();
        element._setTagNumber(_UniversalType.time);
        element._setTime('10:11:12');
        expect(element._toString()).toBe('"10:11:12"');
    });
    it('1041529 - should return quoted IA5 string', () => {
        const element = new _PdfUniqueEncodingElement();
        element._setTagNumber(_UniversalType.internationalAlphabetString);
        element._setInternationalAlphabetString('ABC');
        expect(element._toString()).toBe('"ABC"');
    });
    it('1041529 - should return object id resource identifier in toString', () => {
        const element = new _PdfUniqueEncodingElement();
        element._setTagNumber(_UniversalType.objectIdResourceIdentifier);
        element._setObjectIdResourceIdentifier('oid-resource');
        expect(element._toString()).toBe('oid-resource');
    });
    it('1041529 - should serialize object id resource identifier', () => {
        const element = new _PdfUniqueEncodingElement();
        element._setTagNumber(_UniversalType.objectIdResourceIdentifier);
        element._setObjectIdResourceIdentifier('oid-resource');
        expect(element._toJson()).toBe('oid-resource');
    });
    it('1041529 - should not treat 0xFF followed by byte less than 128 as padded', () => {
        const element: any = new _PdfUniqueEncodingElement();
        expect(() => {element._decodeInteger(new Uint8Array([0xFF, 0x7F, 0x01]));
        }).not.toThrow();
    });
    it('1041529 - should not throw when first byte is not 0x00 and second byte is less than 128', () => {
        const element: any = new _PdfUniqueEncodingElement();
        expect(() => {element._decodeInteger(new Uint8Array([0x01, 0x7F, 0x01]));}).not.toThrow();
    });
    it('1041529 - should allow required positive sign padding', () => {
        const element: any = new _PdfUniqueEncodingElement();
        expect(() => {element._decodeInteger(new Uint8Array([0x00, 0x80, 0x01]));
        }).not.toThrow();
    });
    it('1041529 - should not treat 0x80 as unnecessary padding', () => {
        const element: any = new _PdfUniqueEncodingElement();
        expect(() => {element._decodeInteger(new Uint8Array([0x00, 0x80, 0x00]));}).not.toThrow();
    });
    it('1041529 - should encode multiple relative oid arcs correctly', () => {
        const element: any = new _PdfUniqueEncodingElement();
        const result = element._encodeRelativeObjectIdentifier([1, 2, 3]);
        expect(Array.from(result)).toEqual([1, 2, 3]);
    });
    it('1041529 - should encode small relative oid arcs as single bytes', () => {
        const element: any = new _PdfUniqueEncodingElement();
        const result = element._encodeRelativeObjectIdentifier([1]);
        expect(Array.from(result)).toEqual([1]);
    });
    it('1041529 - should zero pad year to four digits when encoding date', () => {
        const element: any = new _PdfUniqueEncodingElement();
        const date = new Date(1582, 0, 1);
        date.setFullYear(1582);
        const result = element._encodeDate(date);
        expect(_bytesToString(result)).toBe('15820101');
    });
    it('1041529 - should zero pad single digit month when encoding date', () => {
        const element: any = new _PdfUniqueEncodingElement();
        const result = element._encodeDate(new Date(2024, 0, 1));
        expect(_bytesToString(result)).toBe('20240101');
    });
    it('1041529 - should throw expected date range error message', () => {
        const element: any = new _PdfUniqueEncodingElement();
        expect(() => {
            element._encodeDate(new Date(1581, 0, 1));
        }).toThrowError(
            /The Date .* may not be encoded, because the year must be greater than 1581 and less than 10000/
        );
    });
    it('1041529 - should zero pad single digit minutes when encoding time of day', () => {
        const element: any = new _PdfUniqueEncodingElement();
        const time = new Date();
        time.setHours(1);
        time.setMinutes(2);
        time.setSeconds(3);
        const result = element._encodeTimeOfDay(time);
        expect(_bytesToString(result)).toBe('010203');
    });
    it('1041529 - should include TIME-OF-DAY in validation error message', () => {
        const element: any = new _PdfUniqueEncodingElement();
        expect(() => {element._decodeTimeOfDay(new Uint8Array([50, 53, 54, 49, 54, 49]));
        }).toThrowError(/TIME-OF-DAY/);
    });
    it('1041529 - should throw TIME-OF-DAY validation error for invalid hours', () => {
        const element: any = new _PdfUniqueEncodingElement();
        expect(() => {
            element._decodeTimeOfDay(
                new Uint8Array([50, 53, 48, 48, 48, 48])
            );
        }).toThrowError(/TIME-OF-DAY/);
    });
    it('should throw expected printable string error message', () => {
        const element: any = new _PdfUniqueEncodingElement();
        try {
            element._decodePrintableString(new Uint8Array([0x00]));
            fail('Expected exception');
        } catch (e) {
            expect(e.message).toBe(
                "Printable ASCII string can only contain these characters: " +
                "etaoinsrhdlucmfywgpbvkxqjzETAOINSRHDLUCMFYWGPBVKXQJZ" +
                "0123456789 '()+,-./:=?. Encountered character code 0."
            );
        }
    });
    it('should throw exact printable string error message', () => {
        const element: any = new _PdfUniqueEncodingElement();
        try {
            element._decodePrintableString(new Uint8Array([0x00]));
            fail('Expected exception');
        } catch (e) {
            expect(e.message).toBe(
                "Printable ASCII string can only contain these characters: " +
                "etaoinsrhdlucmfywgpbvkxqjzETAOINSRHDLUCMFYWGPBVKXQJZ" +
                "0123456789 '()+,-./:=?. Encountered character code 0."
            );
        }
    });
});
describe('1041529 - Validate Size mutation tests', () => {
    it('1041529 - should not throw when actualSize is within bounds with defined max', () => {
        const element: any = new _PdfUniqueEncodingElement();
        expect(() => {
            element._validateSize('Test', 'units', 5, 1, 10);
        }).not.toThrow();
    });
    it('1041529 - should throw when actualSize exceeds defined max', () => {
        const element: any = new _PdfUniqueEncodingElement();
        expect(() => {
            element._validateSize('Test', 'units', 15, 1, 10);
        }).toThrowError(/must not exceed 10 units/);
    });
    it('1041529 - should throw when actualSize is below min', () => {
        const element: any = new _PdfUniqueEncodingElement();
        expect(() => {
            element._validateSize('Test', 'units', 0, 1, 10);
        }).toThrowError(/must be at least 1 units/);
    });
    it('1041529 - should not throw when actualSize equals min boundary', () => {
        const element: any = new _PdfUniqueEncodingElement();
        expect(() => {
            element._validateSize('Test', 'units', 1, 1, 10);
        }).not.toThrow();
    });
    it('1041529 - should not throw when actualSize equals max boundary', () => {
        const element: any = new _PdfUniqueEncodingElement();
        expect(() => {
            element._validateSize('Test', 'units', 10, 1, 10);
        }).not.toThrow();
    });
    it('1041529 - should accept undefined max and not throw for any valid actualSize', () => {
        const element: any = new _PdfUniqueEncodingElement();
        expect(() => {
            element._validateSize('Test', 'units', 1000000, 1, undefined);
        }).not.toThrow();
    });
    it('1041529 - should allow large actualSize when max is undefined', () => {
        const element: any = new _PdfUniqueEncodingElement();
        expect(() => {
            element._validateSize('Test', 'units', Number.MAX_SAFE_INTEGER, 1, undefined);
        }).not.toThrow();
    });
    it('1041529 - should still validate min constraint when max is undefined', () => {
        const element: any = new _PdfUniqueEncodingElement();
        expect(() => {
            element._validateSize('Test', 'units', 0, 1, undefined);
        }).toThrowError(/must be at least 1 units/);
    });
    it('1041529 - should throw with correct message format when exceeding max', () => {
        const element: any = new _PdfUniqueEncodingElement();
        expect(() => {
            element._validateSize('CustomName', 'items', 20, 5, 15);
        }).toThrowError(/CustomName must not exceed 15 items, but was 20 items\./);
    });
    it('1041529 - should throw with correct message format when below min', () => {
        const element: any = new _PdfUniqueEncodingElement();
        expect(() => {
            element._validateSize('CustomName', 'items', 2, 5, 15);
        }).toThrowError(/CustomName must be at least 5 items, but was 2 items\./);
    });
    it('1041529 - should accept zero actualSize when min is zero', () => {
        const element: any = new _PdfUniqueEncodingElement();
        expect(() => {
            element._validateSize('Test', 'units', 0, 0, 10);
        }).not.toThrow();
    });
    it('1041529 - should handle max equal to min', () => {
        const element: any = new _PdfUniqueEncodingElement();
        expect(() => {
            element._validateSize('Test', 'units', 5, 5, 5);
        }).not.toThrow();
    });
    it('1041529 - should throw when actualSize exceeds max equal to min', () => {
        const element: any = new _PdfUniqueEncodingElement();
        expect(() => {
            element._validateSize('Test', 'units', 6, 5, 5);
        }).toThrowError(/must not exceed 5 units/);
    });
    it('1041529 - should throw when actualSize is below max equal to min', () => {
        const element: any = new _PdfUniqueEncodingElement();
        expect(() => {
            element._validateSize('Test', 'units', 4, 5, 5);
        }).toThrowError(/must be at least 5 units/);
    });
    it('1041529 - should return objectIdResourceIdentifier string representation correctly', () => {
        const element = new _PdfUniqueEncodingElement();
        element._setTagNumber(_UniversalType.objectIdResourceIdentifier);
        element._setObjectIdResourceIdentifier('oid-resource-123');
        const result = element._toString();
        expect(result).toBe('oid-resource-123');
        expect(result).not.toContain('[');
    });
    it('1041529 - should correctly distinguish objectIdResourceIdentifier from relativeResourceIdentifier', () => {
        const element1 = new _PdfUniqueEncodingElement();
        element1._setTagNumber(_UniversalType.objectIdResourceIdentifier);
        element1._setObjectIdResourceIdentifier('oid-value');
        const element2 = new _PdfUniqueEncodingElement();
        element2._setTagNumber(_UniversalType.relativeResourceIdentifier);
        element2._setRelativeResourceIdentifier('relative-value');
        expect(element1._toString()).toBe('oid-value');
        expect(element2._toString()).toBe('relative-value');
        expect(element1._toString()).not.toBe(element2._toString());
    });
    it('1041529 - should return exact objectIdResourceIdentifier without modification', () => {
        const element = new _PdfUniqueEncodingElement();
        element._setTagNumber(_UniversalType.objectIdResourceIdentifier);
        const expectedValue = 'oid-resource-identifier-test';
        element._setObjectIdResourceIdentifier(expectedValue);
        expect(element._toString()).toEqual(expectedValue);
    });
    it('1041529 - should return objectIdResourceIdentifier with special characters', () => {
        const element = new _PdfUniqueEncodingElement();
        element._setTagNumber(_UniversalType.objectIdResourceIdentifier);
        element._setObjectIdResourceIdentifier('oid:1.2.3.4.5');
        expect(element._toString()).toBe('oid:1.2.3.4.5');
    });
    it('1041529 - should serialize bit string to hex with empty separator', () => {
        const element = new _PdfUniqueEncodingElement();
        element._setTagNumber(_UniversalType.bitString);
        element._setBitString(new Uint8ClampedArray([0xFF, 0x00]));
        const result = element._toJson() as any;
        expect(result.value).toMatch(/^[0-9a-f]+$/);
        expect(result.value).not.toContain('Stryker');
        expect(result.value.length).toBeGreaterThan(0);
    });
    it('1041529 - should serialize bit string with correct hex digits without extra text', () => {
        const element = new _PdfUniqueEncodingElement();
        element._setTagNumber(_UniversalType.bitString);
        element._setBitString(new Uint8ClampedArray([1, 2, 3]));
        const result = element._toJson() as any;
        expect(result.value).toMatch(/^[0-9a-f]*$/);
        expect(result.value).not.toContain('was');
        expect(result.value).not.toContain('here');
    });
    it('1041529 - should concatenate packed bit string bytes without separator', () => {
        const element: any = new _PdfUniqueEncodingElement();
        element._setTagNumber(_UniversalType.bitString);
        element._setBitString(
            new Uint8ClampedArray([
                1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1
            ])
        );
        const result = element._toJson() as any;
        expect(result.value).not.toContain('Stryker was here!');
    });
    it('1041529 - should serialize time of day with colon between hours and minutes', () => {
        const element = new _PdfUniqueEncodingElement();
        const time = new Date();
        time.setUTCHours(15);
        time.setUTCMinutes(30);
        time.setUTCSeconds(45);
        element._setTagNumber(_UniversalType.timeOfDay);
        element._setTimeOfDay(time);
        const result = element._toJson();
        expect(result).toBe('15:30:45');
        expect(result).toContain(':');
        expect(result).not.toBe('1530:45');
    });
    it('1041529 - should format time of day with proper HH:MM:SS format', () => {
        const element = new _PdfUniqueEncodingElement();
        const time = new Date();
        time.setUTCHours(9);
        time.setUTCMinutes(5);
        time.setUTCSeconds(3);
        element._setTagNumber(_UniversalType.timeOfDay);
        element._setTimeOfDay(time);
        const result = element._toJson();
        expect(result).toMatch(/^\d+:\d+:\d+$/);
        expect(result).not.toMatch(/^\d+\d+:/);
    });
    it('1041529 - should serialize time of day with colon between minutes and seconds', () => {
        const element = new _PdfUniqueEncodingElement();
        const time = new Date();
        time.setUTCHours(12);
        time.setUTCMinutes(34);
        time.setUTCSeconds(56);
        element._setTagNumber(_UniversalType.timeOfDay);
        element._setTimeOfDay(time);
        const result = element._toJson();
        expect(result).toBe('12:34:56');
        expect(result).not.toBe('12:3456');
    });
    it('1041529 - should include both colons in time of day serialization', () => {
        const element = new _PdfUniqueEncodingElement();
        const time = new Date();
        time.setUTCHours(1);
        time.setUTCMinutes(2);
        time.setUTCSeconds(3);
        element._setTagNumber(_UniversalType.timeOfDay);
        element._setTimeOfDay(time);
        const result = element._toJson();
        const colonCount = (result as string).split(':').length - 1;
        expect(colonCount).toBe(2);
    });
    it('1041529 - should verify exact time of day format with multiple colons', () => {
        const element = new _PdfUniqueEncodingElement();
        const time = new Date();
        time.setUTCHours(23);
        time.setUTCMinutes(59);
        time.setUTCSeconds(59);
        element._setTagNumber(_UniversalType.timeOfDay);
        element._setTimeOfDay(time);
        const result = element._toJson();
        expect(result).toEqual('23:59:59');
        expect(result).not.toEqual('2359:59');
        expect(result).not.toEqual('23:5959');
    });
    it('1041529 - should use default Sequence of label in validation error', () => {
        const element: any = new _PdfUniqueEncodingElement();
        element._setSequenceOf([]);
        expect(() => {
            element._sizeConstrainedSequenceOf(1);
        }).toThrowError(
            'Sequence of must be at least 1 elements, but was 0 elements.'
        );
    });
    it('1041529 - should use custom sequence name when provided', () => {
        const element: any = new _PdfUniqueEncodingElement();
        element._name = 'Certificates';
        element._setSequenceOf([]);
        expect(() => {
            element._sizeConstrainedSequenceOf(1);
        }).toThrowError(
            'Certificates must be at least 1 elements, but was 0 elements.'
        );
    });
    it('1041529 - should use elements unit in sequence validation error', () => {
        const element: any = new _PdfUniqueEncodingElement();
        element._setSequenceOf([]);
        expect(() => {
            element._sizeConstrainedSequenceOf(1);
        }).toThrowError(
            'Sequence of must be at least 1 elements, but was 0 elements.'
        );
    });
    it('1041529 - should not treat pre-existing Stryker entry as duplicate tag', () => {
        const element: any = new _PdfUniqueEncodingElement();
        const elements: any[] = [
            {
                _tagClass: 0,
                _getTagNumber(): any {
                    return 'Stryker was here';
                }
            }
        ];
        expect(element._isUniquelyTagged(elements)).toBe(true);
    });
    it('1041529 - should encode exactly one arc without processing an additional iteration', () => {
        const element: any = new _PdfUniqueEncodingElement();
        const result = element._encodeRelativeObjectIdentifier([127]);
        expect(Array.from(result)).toEqual([127]);
        expect(result.length).toBe(1);
    });
});
