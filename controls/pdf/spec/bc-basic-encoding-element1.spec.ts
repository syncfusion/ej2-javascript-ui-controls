
import { _PdfBasicEncodingElement, _EncodingLength } from '../src/pdf/core/security/digital-signature/asn1/basic-encoding-element';
import { _PdfAbstractSyntaxElement } from '../src/pdf/core/security/digital-signature/asn1/abstract-syntax';
import {
    _ConstructionType,
    _TagClassType,
    _UniversalType
} from '../src/pdf/core/security/digital-signature/asn1/enumerator';
import { _PdfUniqueEncodingElement } from '../src/pdf/core/security/digital-signature/asn1/unique-encoding-element';
import { _PdfCharacterString } from '../src/pdf/core/security/digital-signature/asn1/character-string';
import { _PdfObjectIdentifier } from '../src/pdf/core/security/digital-signature/asn1/identifier-mapping';

describe('_PdfBasicEncodingElement - behaviour/AAA tests for uncovered branches', () => {
    var globalThis: any;
    function _concat(buffers: Uint8Array[]): Uint8Array {
        const total: number = buffers.reduce((sum: number, buffer: Uint8Array) => sum + buffer.length, 0);
        const result: Uint8Array = new Uint8Array(total);
        let offset: number = 0;
        for (const buffer of buffers) {
            result.set(buffer, offset);
            offset += buffer.length;
        }
        return result;
    }

    type _PdfBasicEncodingElementInternals = {
        _value: Uint8Array | _PdfAbstractSyntaxElement[];
        _currentValueLength: number | undefined;
        _nestingRecursionLimit: number;
        _recursionCount: number;
    };

    function _setPrivateValue(
        element: _PdfBasicEncodingElement,
        value: Uint8Array | _PdfAbstractSyntaxElement[]
    ): void {
        (element as unknown as _PdfBasicEncodingElementInternals)._value = value;
    }

    function _setPrivateCurrentValueLength(
        element: _PdfBasicEncodingElement,
        value: number | undefined
    ): void {
        (element as unknown as _PdfBasicEncodingElementInternals)._currentValueLength = value;
    }

    function _setRecursionLimit(
        element: _PdfBasicEncodingElement,
        limit: number
    ): void {
        (element as unknown as _PdfBasicEncodingElementInternals)._nestingRecursionLimit = limit;
    }

    function _setRecursionCount(
        element: _PdfBasicEncodingElement,
        count: number
    ): void {
        (element as unknown as _PdfBasicEncodingElementInternals)._recursionCount = count;
    }

    function _createPrimitive(
        tagNumber: number,
        value: Uint8Array,
        tagClass: _TagClassType = _TagClassType.universal
    ): _PdfBasicEncodingElement {
        const element: _PdfBasicEncodingElement = new _PdfBasicEncodingElement(
            tagClass,
            _ConstructionType.primitive,
            tagNumber
        );
        element._setValue(value);
        return element;
    }

    function _createConstructed(
        tagNumber: number,
        children: _PdfAbstractSyntaxElement[],
        tagClass: _TagClassType = _TagClassType.universal
    ): _PdfBasicEncodingElement {
        const element: _PdfBasicEncodingElement = new _PdfBasicEncodingElement(
            tagClass,
            _ConstructionType.constructed,
            tagNumber
        );
        element._setSequence(children);
        return element;
    }

    it('should throw from _getAbstractSetValue when duplicate tags are detected', () => {
        // Arrange
        const element: _PdfBasicEncodingElement = new _PdfBasicEncodingElement(
            _TagClassType.universal,
            _ConstructionType.constructed,
            _UniversalType.abstractSyntaxSet
        );
        const child: _PdfBasicEncodingElement = _createPrimitive(_UniversalType.integer, new Uint8Array([0x01]));
        spyOn(element, '_getSequence').and.returnValue([child, child]);
        spyOn(element as unknown as { _isUniquelyTagged: (value: _PdfAbstractSyntaxElement[]) => boolean }, '_isUniquelyTagged')
            .and.returnValue(false);

        // Act / Assert
        expect(() => element._getAbstractSetValue()).toThrowError('Duplicate tag in Set.');
    });

    it('should return set elements from _getAbstractSetValue when tags are unique', () => {
        // Arrange
        const element: _PdfBasicEncodingElement = new _PdfBasicEncodingElement(
            _TagClassType.universal,
            _ConstructionType.constructed,
            _UniversalType.abstractSyntaxSet
        );
        const child1: _PdfBasicEncodingElement = _createPrimitive(1, new Uint8Array([0x01]));
        const child2: _PdfBasicEncodingElement = _createPrimitive(2, new Uint8Array([0x02]));
        spyOn(element, '_getSequence').and.returnValue([child1, child2]);
        spyOn(element as unknown as { _isUniquelyTagged: (value: _PdfAbstractSyntaxElement[]) => boolean }, '_isUniquelyTagged')
            .and.returnValue(true);

        // Act
        const result: _PdfAbstractSyntaxElement[] = element._getAbstractSetValue();

        // Assert
        expect(result.length).toBe(2);
        expect(result[0]).toBe(child1);
        expect(result[1]).toBe(child2);
    });

    it('should return cached array from _getSequenceOf when internal value is already an array', () => {
        // Arrange
        const child: _PdfBasicEncodingElement = _createPrimitive(_UniversalType.integer, new Uint8Array([0x01]));
        const element: _PdfBasicEncodingElement = new _PdfBasicEncodingElement(
            _TagClassType.universal,
            _ConstructionType.constructed,
            _UniversalType.sequence
        );
        element._setSequenceOf([child]);

        // Act
        const result: _PdfAbstractSyntaxElement[] = element._getSequenceOf();

        // Assert
        expect(result.length).toBe(1);
        expect(result[0]).toBe(child);
    });

    it('should decode bytes in _getSequenceOf when internal value is encoded bytes instead of array', () => {
        // Arrange
        const child: _PdfBasicEncodingElement = _createPrimitive(_UniversalType.integer, new Uint8Array([0x05]));
        const encodedChild: Uint8Array = _concat(child._toBuffers());

        const element: _PdfBasicEncodingElement = new _PdfBasicEncodingElement(
            _TagClassType.universal,
            _ConstructionType.constructed,
            _UniversalType.sequence
        );
        _setPrivateValue(element, encodedChild);

        // Act
        const result: _PdfAbstractSyntaxElement[] = element._getSequenceOf();

        // Assert
        expect(result.length).toBe(1);
        expect((result[0] as _PdfBasicEncodingElement)._getTagNumber()).toBe(_UniversalType.integer);
    });

    it('should set character string bytes and mark construction as constructed in _setCharacterString', () => {
        // Arrange
        const identification: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement(
            _TagClassType.universal,
            _ConstructionType.primitive,
            _UniversalType.integer,
            1
        );
        const value: _PdfCharacterString = {
            _identification: identification,
            _stringValue: new Uint8Array([0x41, 0x42, 0x43])
        } as unknown as _PdfCharacterString;

        const element: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();

        // Act
        element._setCharacterString(value);

        // Assert
        expect(element._construction).toBe(_ConstructionType.constructed);
        expect(element._getValue().length).toBeGreaterThan(0);
    });

    it('should throw from _getUniversalString when byte length is not a multiple of four', () => {
        // Arrange
        const element: _PdfBasicEncodingElement = _createPrimitive(
            _UniversalType.universalString,
            new Uint8Array([0x00, 0x41, 0x00])
        );

        // Act / Assert
        expect(() => element._getUniversalString()).toThrowError(
            'Unicode string encoded on non-mulitple of four bytes.'
        );
    });

    it('should round-trip _setUniversalString and _getUniversalString', () => {
        // Arrange
        const element: _PdfBasicEncodingElement = new _PdfBasicEncodingElement(
            _TagClassType.universal,
            _ConstructionType.primitive,
            _UniversalType.universalString
        );

        // Act
        element._setUniversalString('AB');
        const result: string = element._getUniversalString();

        // Assert
        expect(result).toBe('AB');
    });

    it('should throw from _getBmpString when byte length is not a multiple of two', () => {
        // Arrange
        const element: _PdfBasicEncodingElement = _createPrimitive(
            _UniversalType.bmpString,
            new Uint8Array([0x00, 0x41, 0x00])
        );

        // Act / Assert
        expect(() => element._getBmpString()).toThrowError(
            'BMPString encoded on non-multiple of two bytes.'
        );
    });


    it('should use TextDecoder branch in _getBmpString when TextDecoder is available', () => {
        // Arrange
        type _TextDecoderLike = {
            new(_encoding?: string): {
                decode(_input: Uint8Array): string;
            };
        };

        const globalObject: { TextDecoder?: _TextDecoderLike } =
            window as unknown as { TextDecoder?: _TextDecoderLike };
        const originalTextDecoder: _TextDecoderLike | undefined = globalObject.TextDecoder;

        class _FakeTextDecoder {
            constructor(_encoding?: string) {
                // no-op
            }

            decode(_input: Uint8Array): string {
                return 'OK_FROM_DECODER';
            }
        }

        Object.defineProperty(globalObject, 'TextDecoder', {
            value: _FakeTextDecoder,
            configurable: true,
            writable: true
        });

        const element: _PdfBasicEncodingElement = _createPrimitive(
            _UniversalType.bmpString,
            new Uint8Array([0x00, 0x41])
        );

        try {
            // Act
            const result: string = element._getBmpString();

            // Assert
            expect(result).toBe('OK_FROM_DECODER');
        } finally {
            // Cleanup
            Object.defineProperty(globalObject, 'TextDecoder', {
                value: originalTextDecoder,
                configurable: true,
                writable: true
            });
        }
    });

    it('should use manual fallback branch in _getBmpString when TextDecoder is undefined', () => {
        // Arrange
        type _TextDecoderLike = {
            new(_encoding?: string): {
                decode(_input: Uint8Array): string;
            };
        };

        const globalObject: { TextDecoder?: _TextDecoderLike } =
            window as unknown as { TextDecoder?: _TextDecoderLike };
        const originalTextDecoder: _TextDecoderLike | undefined = globalObject.TextDecoder;

        Object.defineProperty(globalObject, 'TextDecoder', {
            value: undefined,
            configurable: true,
            writable: true
        });

        const element: _PdfBasicEncodingElement = _createPrimitive(
            _UniversalType.bmpString,
            new Uint8Array([0x00, 0x41, 0x00, 0x42])
        );

        try {
            // Act
            const result: string = element._getBmpString();

            // Assert
            expect(result).toBe('AB');
        } finally {
            // Cleanup
            Object.defineProperty(globalObject, 'TextDecoder', {
                value: originalTextDecoder,
                configurable: true,
                writable: true
            });
        }
    });

    it('should encode BMP string bytes in _setBmpString', () => {
        // Arrange
        const element: _PdfBasicEncodingElement = new _PdfBasicEncodingElement(
            _TagClassType.universal,
            _ConstructionType.primitive,
            _UniversalType.bmpString
        );

        // Act
        element._setBmpString('AB');

        // Assert
        expect(Array.from(element._getValue())).toEqual([0x00, 0x41, 0x00, 0x42]);
    });

    it('should cover _encode boolean branch', () => {
        // Arrange
        const element: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();

        // Act
        element._encode(true);

        // Assert
        expect(element._getTagNumber()).toBe(_UniversalType.abstractSyntaxBoolean);
        expect(element._getBooleanValue()).toBeTruthy();
    });

    it('should cover _encode number integer branch', () => {
        // Arrange
        const element: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();

        // Act
        element._encode(10);

        // Assert
        expect(element._getTagNumber()).toBe(_UniversalType.integer);
    });

    it('should cover _encode null object branch', () => {
        // Arrange
        const element: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();

        // Act
        element._encode(null);

        // Assert
        expect(element._getTagNumber()).toBe(_UniversalType.nullValue);
        expect(element._getValue().length).toBe(0);
    });

    it('should cover _encode Uint8Array branch', () => {
        // Arrange
        const input: Uint8Array = new Uint8Array([1, 2, 3]);
        const element: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();

        // Act
        element._encode(input);

        // Assert
        expect(element._getTagNumber()).toBe(_UniversalType.octetString);
        expect(Array.from(element._getOctetString())).toEqual([1, 2, 3]);
    });

    it('should cover _encode Uint8ClampedArray branch', () => {
        // Arrange
        const input: Uint8ClampedArray = new Uint8ClampedArray([1, 0, 1, 1]);
        const element: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();

        // Act
        element._encode(input);

        // Assert
        expect(element._getTagNumber()).toBe(_UniversalType.bitString);
        expect(Array.from(element._getBitString())).toEqual([1, 0, 1, 1]);
    });

    it('should cover _encode _PdfAbstractSyntaxElement instance branch', () => {
        // Arrange
        const child: _PdfBasicEncodingElement = new _PdfBasicEncodingElement(undefined, undefined, undefined, 5);
        const element: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();

        // Act
        element._encode(child);

        // Assert
        expect(element._construction).toBe(_ConstructionType.constructed);
        expect(element._getSequence().length).toBe(1);
    });

    it('should cover _encode _PdfObjectIdentifier branch', () => {
        // Arrange
        const element: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();
        const identifier: _PdfObjectIdentifier = Object.create(_PdfObjectIdentifier.prototype) as _PdfObjectIdentifier;
        const setObjectIdentifierSpy: jasmine.Spy =
            spyOn(element, '_setObjectIdentifier').and.callFake(() => {
                // no-op
            });

        // Act
        element._encode(identifier);

        // Assert
        expect(element._getTagNumber()).toBe(_UniversalType.objectIdentifier);
        expect(setObjectIdentifierSpy).toHaveBeenCalledWith(identifier);
    });

    it('should cover _encode generic array branch and map each item to a child element', () => {
        // Arrange
        const element: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();

        // Act
        element._encode([1, 'A', true]);

        // Assert
        expect(element._construction).toBe(_ConstructionType.constructed);
        expect(element._getTagNumber()).toBe(_UniversalType.sequence);
        expect(element._getSequence().length).toBe(3);
    });

    it('should cover _encode array-of-_PdfAbstractSyntaxElement instances branch', () => {
        // Arrange
        const element: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();
        const child1: _PdfBasicEncodingElement = _createPrimitive(10, new Uint8Array([0x0A]));
        const child2: _PdfBasicEncodingElement = _createPrimitive(11, new Uint8Array([0x0B]));

        // Act
        element._encode([child1, child2]);

        // Assert
        expect(element._construction).toBe(_ConstructionType.constructed);
        const result: _PdfAbstractSyntaxElement[] = element._getAbstractSetValue();
        expect(result.length).toBe(2);
        expect(result[0]).toBe(child1);
        expect(result[1]).toBe(child2);
    });

    it('should throw for unsupported object types in _encode object branch', () => {
        // Arrange
        class _Unsupported {
            public readonly value: string = 'x';
        }
        const element: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();

        // Act / Assert
        expect(() => element._encode(new _Unsupported())).toThrowError(
            'Cannot encode value of type _Unsupported.'
        );
    });


    it('should throw for unsupported primitive types in _encode default branch', () => {
        // Arrange
        const element: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();
        const unsupportedValue: unknown = (): void => {
            // no-op
        };

        // Act / Assert
        expect(() => element._encode(unsupportedValue)).toThrowError(
            'Cannot encode value of type function.'
        );
    });

    it('should throw from _fromBytes for input shorter than two bytes', () => {
        // Arrange
        const element: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();

        // Act / Assert
        expect(() => element._fromBytes(new Uint8Array([0x04]))).toThrowError(
            'Tried to decode a BER element that is less than two bytes.'
        );
    });

    it('should throw from _fromBytes when recursion limit is exceeded', () => {
        // Arrange
        const element: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();
        _setRecursionLimit(element, 0);
        _setRecursionCount(element, 0);

        // Act / Assert
        expect(() => element._fromBytes(new Uint8Array([0x04, 0x00]))).toThrow();
    });

    it('should decode private tag class branch in _fromBytes', () => {
        // Arrange
        const element: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();

        // Act
        const consumed: number = element._fromBytes(new Uint8Array([0xC1, 0x00]));

        // Assert
        expect(consumed).toBe(2);
        expect(element._tagClass).toBe(_TagClassType.abstractSyntaxPrivate);
    });

    it('should throw from _fromBytes for long tag leading padding byte', () => {
        // Arrange
        const element: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();

        // Act / Assert
        expect(() => element._fromBytes(new Uint8Array([0x1F, 0x80, 0x00]))).toThrowError(
            'Leading padding byte on long tag number encoding.'
        );
    });

    it('should throw from _fromBytes for truncated long tag inside while loop', () => {
        // Arrange
        const element: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();

        // Act / Assert
        expect(() => element._fromBytes(new Uint8Array([0x1F, 0x81]))).toThrowError(
            'ASN1 tag number appears to have been truncated.'
        );
    });

    it('should throw from _fromBytes when long tag could have been encoded in short form', () => {
        // Arrange
        const element: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();

        // Act / Assert
        expect(() => element._fromBytes(new Uint8Array([0x1F, 0x1E, 0x00]))).toThrowError(
            'ASN1 tag number could have been encoded in short form.'
        );
    });

    it('should throw from _fromBytes when length byte is missing after tag parsing', () => {
        // Arrange
        const element: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();

        // Act / Assert
        expect(() => element._fromBytes(new Uint8Array([0x1F, 0x1F]))).toThrowError(
            'Element length bytes appear to have been truncated.'
        );
    });

    it('should throw from _fromBytes for primitive indefinite-length element', () => {
        // Arrange
        const element: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();

        // Act / Assert
        expect(() => element._fromBytes(new Uint8Array([0x04, 0x80]))).toThrowError(
            'Invalid format: indefinite-length elements must be constructed, not primitive.'
        );
    });

    it('should throw from _fromBytes when indefinite-length element has no EOC marker', () => {
        // Arrange
        const element: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();

        // 0x30 => constructed sequence, 0x80 => indefinite length
        // child = INTEGER 5 => 02 01 05
        const bytes: Uint8Array = new Uint8Array([0x30, 0x80, 0x02, 0x01, 0x05]);

        // Act / Assert
        expect(() => element._fromBytes(bytes)).toThrowError(
            'Invalid format: indefinite-length ASN1 elements must end with an End-of-Content marker'
        );
    });

    it('should successfully parse an indefinite-length constructed element with EOC marker', () => {
        // Arrange
        const element: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();

        // 0x30 0x80 [02 01 05] [00 00]
        const bytes: Uint8Array = new Uint8Array([0x30, 0x80, 0x02, 0x01, 0x05, 0x00, 0x00]);

        // Act
        const consumed: number = element._fromBytes(bytes);

        // Assert
        expect(consumed).toBe(7);
        expect(element._construction).toBe(_ConstructionType.constructed);
        expect(element._getValue().length).toBe(3); // only child bytes, excluding EOC
    });

    it('should throw from _fromBytes when long-form length octets are truncated', () => {
        // Arrange
        const element: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();

        // 0x82 means two length octets but only one provided
        const bytes: Uint8Array = new Uint8Array([0x04, 0x82, 0x01]);

        // Act / Assert
        expect(() => element._fromBytes(bytes)).toThrowError(
            'Element length bytes appear to have been truncated.'
        );
    });

    it('should throw from _fromBytes for negative-overflowed large length (ASN1 element too large)', () => {
        // Arrange
        const element: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();

        // length octets = FF FF FF FF => signed bitwise result becomes -1
        const bytes: Uint8Array = new Uint8Array([0x04, 0x84, 0xFF, 0xFF, 0xFF, 0xFF]);

        // Act / Assert
        expect(() => element._fromBytes(bytes)).toThrowError('ASN1 element too large.');
    });

    it('should throw from _fromBytes when long-form content is truncated', () => {
        // Arrange
        const element: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();

        // long length 2, but only one content byte
        const bytes: Uint8Array = new Uint8Array([0x04, 0x81, 0x02, 0xAA]);

        // Act / Assert
        expect(() => element._fromBytes(bytes)).toThrowError('ASN1 element truncated.');
    });

    it('should throw from _fromBytes when short-form content is truncated', () => {
        // Arrange
        const element: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();

        const bytes: Uint8Array = new Uint8Array([0x04, 0x02, 0xAA]);

        // Act / Assert
        expect(() => element._fromBytes(bytes)).toThrowError('ASN1 element was truncated.');
    });


    it('should cover _valueLength non-array branch by caching raw value length', () => {
        // Arrange
        const element: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();
        _setPrivateCurrentValueLength(element, undefined);
        _setPrivateValue(element, new Uint8Array([1, 2, 3, 4]));

        // Act
        const length: number = element._valueLength();

        // Assert
        expect(length).toBe(4);
        expect(
            (element as unknown as _PdfBasicEncodingElementInternals)._currentValueLength
        ).toBe(4);
    });

    it('should cover _valueLength array branch by summing child _tagValueLength values', () => {
        // Arrange
        const child1: _PdfBasicEncodingElement = _createPrimitive(
            _UniversalType.integer,
            new Uint8Array([0x01])
        );
        const child2: _PdfBasicEncodingElement = _createPrimitive(
            _UniversalType.integer,
            new Uint8Array([0x02])
        );
        const element: _PdfBasicEncodingElement = new _PdfBasicEncodingElement(
            _TagClassType.universal,
            _ConstructionType.constructed,
            _UniversalType.sequence
        );
        _setPrivateCurrentValueLength(element, undefined);
        _setPrivateValue(element, [child1, child2]);

        // Act
        const length: number = element._valueLength();

        // Assert
        expect(length).toBe(child1._tagValueLength() + child2._tagValueLength());
        expect(
            (element as unknown as _PdfBasicEncodingElementInternals)._currentValueLength
        ).toBe(length);
    });

    it('should encode long tag number and long definite length in _tagAndLengthBytes', () => {
        // Arrange
        const element: _PdfBasicEncodingElement = new _PdfBasicEncodingElement(
            _TagClassType.universal,
            _ConstructionType.primitive,
            128
        );
        element._setValue(new Uint8Array(256));

        // Act
        const bytes: Uint8Array = element._tagAndLengthBytes();

        // Assert
        expect(bytes[0] & 0x1F).toBe(0x1F);
        expect(bytes[1]).toBe(0x81);
        expect(bytes[2]).toBe(0x00);
        expect(bytes[3]).toBe(0x82);
        expect(bytes[4]).toBe(0x01);
        expect(bytes[5]).toBe(0x00);
    });

    it('should throw from _tagAndLengthBytes for unsupported length encoding preference', () => {
        // Arrange
        const element: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();
        element._lengthEncodingPreference = 999 as _EncodingLength;

        // Act / Assert
        expect(() => element._tagAndLengthBytes()).toThrowError(
            'An unsupported length encoding preference was detected'
        );
    });

    it('should cover array iteration and indefinite terminator branch in _toBuffers', () => {
        // Arrange
        const child1: _PdfBasicEncodingElement = _createPrimitive(_UniversalType.integer, new Uint8Array([0x01]));
        const child2: _PdfBasicEncodingElement = _createPrimitive(_UniversalType.integer, new Uint8Array([0x02]));
        const parent: _PdfBasicEncodingElement = _createConstructed(
            _UniversalType.sequence,
            [child1, child2]
        );
        parent._lengthEncodingPreference = _EncodingLength.indefinite;

        // Act
        const buffers: Uint8Array[] = parent._toBuffers();

        // Assert
        expect(buffers.length).toBeGreaterThan(3);
        expect(Array.from(buffers[buffers.length - 1])).toEqual([0x00, 0x00]);
    });

    it('should return cached array from _getComponents when internal value is already an array', () => {
        // Arrange
        const child: _PdfBasicEncodingElement = _createPrimitive(_UniversalType.integer, new Uint8Array([0x01]));
        const parent: _PdfBasicEncodingElement = _createConstructed(
            _UniversalType.sequence,
            [child]
        );

        // Act
        const result: _PdfAbstractSyntaxElement[] = parent._getComponents();

        // Assert
        expect(result.length).toBe(1);
        expect(result[0]).toBe(child);
    });

    it('should encode a character string structure in _encodeCharacterString', () => {
        // Arrange
        const identification: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement(
            _TagClassType.universal,
            _ConstructionType.primitive,
            _UniversalType.integer,
            1
        );
        const value: _PdfCharacterString = {
            _identification: identification,
            _stringValue: new Uint8Array([0x41, 0x42])
        } as unknown as _PdfCharacterString;

        const element: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();

        // Act
        const bytes: Uint8Array = element._encodeCharacterString(value);

        // Assert
        expect(bytes.length).toBeGreaterThan(0);
    });

    it('should return empty array from _decodeSequence for empty input', () => {
        // Arrange
        const element: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();

        // Act
        const result: _PdfUniqueEncodingElement[] = element._decodeSequence(new Uint8Array(0));

        // Assert
        expect(result).toEqual([]);
    });

    it('should decode one unique element in _decodeSequence for non-empty input', () => {
        // Arrange
        const source: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();
        const seq: _PdfUniqueEncodingElement = source._fromSequence([
            new _PdfUniqueEncodingElement(
                _TagClassType.universal,
                _ConstructionType.primitive,
                _UniversalType.integer,
                5
            )
        ]);
        const encoded: Uint8Array = _concat(seq._toBuffers());
        const outer: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();

        // Act
        const result: _PdfUniqueEncodingElement[] = outer._decodeSequence(encoded);

        // Assert
        expect(result.length).toBe(1);
        expect(result[0]._getTagNumber()).toBe(_UniversalType.sequence);
    });
});
