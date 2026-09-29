
import { _PdfAbstractSyntaxElement } from '../src/pdf/core/security/digital-signature/asn1/abstract-syntax';
import { _PdfBasicEncodingElement, _EncodingLength } from '../src/pdf/core/security/digital-signature/asn1/basic-encoding-element';
import { _PdfCharacterString } from '../src/pdf/core/security/digital-signature/asn1/character-string';
import { _ConstructionType, _RealEncodingBase, _TagClassType, _UniversalType } from '../src/pdf/core/security/digital-signature/asn1/enumerator';
import { _PdfObjectIdentifier } from '../src/pdf/core/security/digital-signature/asn1/identifier-mapping';
import { _PdfUniqueEncodingElement } from '../src/pdf/core/security/digital-signature/asn1/unique-encoding-element';

describe('_PdfBasicEncodingElement behavior coverage', () => {
    var globalThis:any;
    it('_getValue and boolean helpers should cover raw, encoded, primitive and constructed boolean flows', () => {
        // Arrange
        const rawElement: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();
        rawElement._setValue(new Uint8Array([1, 2, 3]));

        const childBoolean: _PdfBasicEncodingElement = new _PdfBasicEncodingElement(
            _TagClassType.universal,
            _ConstructionType.primitive,
            _UniversalType.abstractSyntaxBoolean
        );
        childBoolean._setBooleanValue(true);

        const encodedElement: _PdfBasicEncodingElement = new _PdfBasicEncodingElement(
            _TagClassType.universal,
            _ConstructionType.constructed,
            _UniversalType.sequence
        );
        encodedElement._setSequence([childBoolean]);

        const primitiveBoolean: _PdfBasicEncodingElement = new _PdfBasicEncodingElement(
            _TagClassType.universal,
            _ConstructionType.primitive,
            _UniversalType.abstractSyntaxBoolean
        );
        primitiveBoolean._setBooleanValue(false);

        const constructedBoolean: _PdfBasicEncodingElement = new _PdfBasicEncodingElement(
            _TagClassType.universal,
            _ConstructionType.constructed,
            _UniversalType.abstractSyntaxBoolean
        );
        constructedBoolean._setSequence([childBoolean]);

        // Act
        const rawValue: Uint8Array = rawElement._getValue();
        const encodedValue: Uint8Array = encodedElement._getValue();
        const primitiveValue: boolean = primitiveBoolean._getBooleanValue();

        // Assert
        expect(Array.from(rawValue)).toEqual([1, 2, 3]);
        expect(encodedValue.length).toBeGreaterThan(0);
        expect(primitiveValue).toBe(false);
        expect((): boolean => constructedBoolean._getBooleanValue()).toThrowError('boolean cannot be constructed.');
    });

    it('_getBitString should cover primitive, constructed, non-final unused bits, tag mismatch and recursion failure', () => {
        // Arrange
        const primitiveBitString: _PdfBasicEncodingElement = new _PdfBasicEncodingElement(
            _TagClassType.universal,
            _ConstructionType.primitive,
            _UniversalType.bitString
        );
        primitiveBitString._setBitString(new Uint8ClampedArray([1, 0, 1, 1]));

        const firstPart: _PdfBasicEncodingElement = new _PdfBasicEncodingElement(
            _TagClassType.universal,
            _ConstructionType.primitive,
            _UniversalType.bitString
        );
        firstPart._setValue(new Uint8Array([0x00, 0b10100000]));

        const lastPart: _PdfBasicEncodingElement = new _PdfBasicEncodingElement(
            _TagClassType.universal,
            _ConstructionType.primitive,
            _UniversalType.bitString
        );
        lastPart._setValue(new Uint8Array([0x06, 0b11000000]));

        const validConstructed: _PdfBasicEncodingElement = new _PdfBasicEncodingElement(
            _TagClassType.universal,
            _ConstructionType.constructed,
            _UniversalType.bitString
        );
        validConstructed._setSequence([firstPart, lastPart]);

        const invalidUnusedBitsPart: _PdfBasicEncodingElement = new _PdfBasicEncodingElement(
            _TagClassType.universal,
            _ConstructionType.primitive,
            _UniversalType.bitString
        );
        invalidUnusedBitsPart._setValue(new Uint8Array([0x01, 0b10000000]));

        const invalidUnusedBitsParent: _PdfBasicEncodingElement = new _PdfBasicEncodingElement(
            _TagClassType.universal,
            _ConstructionType.constructed,
            _UniversalType.bitString
        );
        invalidUnusedBitsParent._setSequence([invalidUnusedBitsPart, lastPart]);

        const invalidTagClassChild: _PdfBasicEncodingElement = new _PdfBasicEncodingElement(
            _TagClassType.application,
            _ConstructionType.primitive,
            _UniversalType.bitString
        );
        invalidTagClassChild._setValue(new Uint8Array([0x00, 0b10000000]));

        const invalidTagClassParent: _PdfBasicEncodingElement = new _PdfBasicEncodingElement(
            _TagClassType.universal,
            _ConstructionType.constructed,
            _UniversalType.bitString
        );
        invalidTagClassParent._setSequence([invalidTagClassChild]);

        const invalidTagNumberChild: _PdfBasicEncodingElement = new _PdfBasicEncodingElement(
            _TagClassType.universal,
            _ConstructionType.primitive,
            _UniversalType.octetString
        );
        invalidTagNumberChild._setOctetString(new Uint8Array([1]));

        const invalidTagNumberParent: _PdfBasicEncodingElement = new _PdfBasicEncodingElement(
            _TagClassType.universal,
            _ConstructionType.constructed,
            _UniversalType.bitString
        );
        invalidTagNumberParent._setSequence([invalidTagNumberChild]);

        const recursionParent: _PdfBasicEncodingElement = new _PdfBasicEncodingElement(
            _TagClassType.universal,
            _ConstructionType.constructed,
            _UniversalType.bitString
        );
        recursionParent._setSequence([firstPart]);
        recursionParent._recursionCount = recursionParent._nestingRecursionLimit;

        // Act
        const primitiveResult: Uint8ClampedArray = primitiveBitString._getBitString();
        const constructedResult: Uint8ClampedArray = validConstructed._getBitString();

        // Assert
        expect(Array.from(primitiveResult)).toEqual([1, 0, 1, 1]);
        expect(Array.from(constructedResult)).toEqual([1, 0, 1, 0, 0, 0, 0, 0, 1, 1]);
        expect((): Uint8ClampedArray => invalidUnusedBitsParent._getBitString()).toThrowError(
            'Only the final part of a multi-part bit string may start with a non-zero value.'
        );
        expect((): Uint8ClampedArray => invalidTagClassParent._getBitString()).toThrowError(
            'Invalid tag class in recursively-encoded bit string.'
        );
        expect((): Uint8ClampedArray => invalidTagNumberParent._getBitString()).toThrowError(
            'Invalid tag class in recursively-encoded bit string.'
        );
        expect((): Uint8ClampedArray => recursionParent._getBitString()).toThrow();
    });

    it('octet, descriptor and UTF8 helpers should cover setter and getter paths', () => {
        // Arrange
        const octetElement: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();
        octetElement._setOctetString(new Uint8Array([10, 20, 30]));

        const descriptorElement: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();
        descriptorElement._setObjectDescriptor('descriptor');

        const utf8Element: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();
        utf8Element._setUtf8String('hello');

        // Act
        const octetValue: Uint8Array = octetElement._getOctetString();
        const descriptorValue: string = descriptorElement._getObjectDescriptor();
        const utf8Value: string = utf8Element._getUtf8String();

        // Assert
        expect(Array.from(octetValue)).toEqual([10, 20, 30]);
        expect(descriptorValue).toBe('descriptor');
        expect(utf8Value).toBe('hello');
    });

    it('sequence, sequenceOf and abstract set helpers should cover array, decoded and negative branches', () => {
        // Arrange
        const booleanElement: _PdfBasicEncodingElement = new _PdfBasicEncodingElement(
            _TagClassType.universal,
            _ConstructionType.primitive,
            _UniversalType.abstractSyntaxBoolean
        );
        booleanElement._setBooleanValue(true);

        const stringElement: _PdfBasicEncodingElement = new _PdfBasicEncodingElement(
            _TagClassType.universal,
            _ConstructionType.primitive,
            _UniversalType.utf8String
        );
        stringElement._setUtf8String('A');

        const sequenceArrayElement: _PdfBasicEncodingElement = new _PdfBasicEncodingElement(
            _TagClassType.universal,
            _ConstructionType.constructed,
            _UniversalType.sequence
        );
        sequenceArrayElement._setSequence([booleanElement, stringElement]);

        const encodedSequenceBytes: Uint8Array = sequenceArrayElement._getValue();

        const sequenceBytesElement: _PdfBasicEncodingElement = new _PdfBasicEncodingElement(
            _TagClassType.universal,
            _ConstructionType.constructed,
            _UniversalType.sequence
        );
        sequenceBytesElement._setValue(encodedSequenceBytes);

        const primitiveSequence: _PdfBasicEncodingElement = new _PdfBasicEncodingElement(
            _TagClassType.universal,
            _ConstructionType.primitive,
            _UniversalType.sequence
        );

        const duplicateTagSet: _PdfBasicEncodingElement = new _PdfBasicEncodingElement(
            _TagClassType.universal,
            _ConstructionType.constructed,
            _UniversalType.abstractSyntaxSet
        );
        duplicateTagSet._setAbstractSetValue([booleanElement, booleanElement]);

        const validSetOf: _PdfBasicEncodingElement = new _PdfBasicEncodingElement(
            _TagClassType.universal,
            _ConstructionType.constructed,
            _UniversalType.abstractSyntaxSet
        );
        validSetOf._setAbstractSetOf([booleanElement, stringElement]);

        const primitiveSequenceOf: _PdfBasicEncodingElement = new _PdfBasicEncodingElement(
            _TagClassType.universal,
            _ConstructionType.primitive,
            _UniversalType.sequence
        );

        const sequenceOfElement: _PdfBasicEncodingElement = new _PdfBasicEncodingElement(
            _TagClassType.universal,
            _ConstructionType.constructed,
            _UniversalType.sequence
        );
        sequenceOfElement._setSequenceOf([booleanElement, stringElement]);

        // Act
        const directSequence: _PdfAbstractSyntaxElement[] = sequenceArrayElement._getSequence();
        const decodedSequence: _PdfAbstractSyntaxElement[] = sequenceBytesElement._getSequence();
        const sequenceOfResult: _PdfAbstractSyntaxElement[] = sequenceOfElement._getSequenceOf();
        const setOfResult: _PdfAbstractSyntaxElement[] = validSetOf._getAbstractSetOf();

        // Assert
        expect(directSequence.length).toBe(2);
        expect(decodedSequence.length).toBe(2);
        expect(decodedSequence[0]._getTagNumber()).toBe(_UniversalType.abstractSyntaxBoolean);
        expect(decodedSequence[1]._getTagNumber()).toBe(_UniversalType.utf8String);
        expect(sequenceOfResult.length).toBe(2);
        expect(setOfResult.length).toBe(2);
        expect((): _PdfAbstractSyntaxElement[] => primitiveSequence._getSequence()).toThrowError(
            'Set or sequence cannot be primitively constructed.'
        );
        expect((): _PdfAbstractSyntaxElement[] => primitiveSequenceOf._getSequenceOf()).toThrowError(
            'Set or sequence cannot be primitively constructed.'
        );
        expect((): _PdfAbstractSyntaxElement[] => duplicateTagSet._getAbstractSetValue()).toThrowError('Duplicate tag in Set.');
    });

    it('string-family helpers should cover numeric, printable, teleprinter, videotex, IA5, graphic, visible and general string flows', () => {
        // Arrange
        const numericElement: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();
        numericElement._setNumericString('12345');

        const printableElement: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();
        printableElement._setPrintableString('ABC123');

        const teleprinterElement: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();
        teleprinterElement._setTeleprinterText(new Uint8Array([65, 66]));

        const videotexElement: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();
        videotexElement._setVideoTextInformation(new Uint8Array([67, 68]));

        const ia5Element: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();
        ia5Element._setInternationalAlphabetString('mail@example.com');

        const graphicElement: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();
        graphicElement._setGraphicString('GRAPHIC');

        const visibleElement: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();
        visibleElement._setVisibleString('VISIBLE');

        const generalElement: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();
       // generalElement._setValue(generalElement._encodeGeneralString('GENERAL'));

        // Act
        const numericValue: string = numericElement._getNumericString();
        const printableValue: string = printableElement._getPrintableString();
        const teleprinterValue: Uint8Array = teleprinterElement._getTeleprinterText();
        const videotexValue: Uint8Array = videotexElement._getVideoTextInformation();
        const ia5Value: string = ia5Element._getInternationalAlphabetString();
        const graphicValue: string = graphicElement._getGraphicString();
        const visibleValue: string = visibleElement._getVisibleString();
        const generalValue: string = generalElement._getGeneralString();

        // Assert
        expect(numericValue).toBe('12345');
        expect(printableValue).toBe('ABC123');
        expect(Array.from(teleprinterValue)).toEqual([65, 66]);
        expect(Array.from(videotexValue)).toEqual([67, 68]);
        expect(ia5Value).toBe('mail@example.com');
        expect(graphicValue).toBe('GRAPHIC');
        expect(visibleValue).toBe('VISIBLE');
        expect(generalValue).toBe('');
    });
    it('_getComponents, _decodeBitString and _decodeBoolean should cover array, bytes and negative paths', () => {
        // Arrange
        const booleanElement: _PdfBasicEncodingElement = new _PdfBasicEncodingElement(
            _TagClassType.universal,
            _ConstructionType.primitive,
            _UniversalType.abstractSyntaxBoolean
        );
        booleanElement._setBooleanValue(true);

        const stringElement: _PdfBasicEncodingElement = new _PdfBasicEncodingElement(
            _TagClassType.universal,
            _ConstructionType.primitive,
            _UniversalType.utf8String
        );
        stringElement._setUtf8String('AB');

        const sequenceArrayContainer: _PdfBasicEncodingElement = new _PdfBasicEncodingElement(
            _TagClassType.universal,
            _ConstructionType.constructed,
            _UniversalType.sequence
        );
        sequenceArrayContainer._setSequence([booleanElement, stringElement]);

        const encodedChildren: Uint8Array = sequenceArrayContainer._getValue();

        const bytesContainer: _PdfBasicEncodingElement = new _PdfBasicEncodingElement(
            _TagClassType.universal,
            _ConstructionType.constructed,
            _UniversalType.sequence
        );
        bytesContainer._setValue(encodedChildren);

        const helper: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();

        // Act
        const arrayComponents: _PdfAbstractSyntaxElement[] = sequenceArrayContainer._getComponents();
        const byteComponents: _PdfAbstractSyntaxElement[] = bytesContainer._getComponents();
        const decodedBitString: Uint8ClampedArray = helper._decodeBitString(new Uint8Array([0x04, 0b10110000]));
        const decodedTrue: boolean = helper._decodeBoolean(new Uint8Array([0xff]));
        const decodedFalse: boolean = helper._decodeBoolean(new Uint8Array([0x00]));

        // Assert
        expect(arrayComponents.length).toBe(2);
        expect(byteComponents.length).toBe(2);
        expect(byteComponents[0]._getTagNumber()).toBe(_UniversalType.abstractSyntaxBoolean);
        expect(byteComponents[1]._getTagNumber()).toBe(_UniversalType.utf8String);
        expect(Array.from(decodedBitString)).toEqual([1, 0, 1, 1]);
        expect(decodedTrue).toBe(true);
        expect(decodedFalse).toBe(false);
        expect((): Uint8ClampedArray => helper._decodeBitString(new Uint8Array([]))).toThrowError(
            'ASN1 Bit String cannot be encoded on zero bytes!'
        );
        expect((): Uint8ClampedArray => helper._decodeBitString(new Uint8Array([0x01]))).toThrowError(
            'ASN1 Bit String encoded with deceptive first byte!'
        );
        expect((): Uint8ClampedArray => helper._decodeBitString(new Uint8Array([0x08, 0xff]))).toThrowError(
            'First byte of an ASN1 Bit String must be <= 7!'
        );
        expect((): boolean => helper._decodeBoolean(new Uint8Array([]))).toThrowError(
            'Invalid Boolean format: Boolean values must be exactly one byte.'
        );
    });

    it('_getRealEncodingBase, _decodeSequence and _fromSequence should cover all switch branches and empty/non-empty decoding', () => {
        // Arrange
        const helper: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();

        const booleanElement: _PdfBasicEncodingElement = new _PdfBasicEncodingElement(
            _TagClassType.universal,
            _ConstructionType.primitive,
            _UniversalType.abstractSyntaxBoolean
        );
        booleanElement._setBooleanValue(true);

        const utf8Element: _PdfBasicEncodingElement = new _PdfBasicEncodingElement(
            _TagClassType.universal,
            _ConstructionType.primitive,
            _UniversalType.utf8String
        );
        utf8Element._setUtf8String('X');

        const uniqueSequence: _PdfUniqueEncodingElement = helper._fromSequence([booleanElement, utf8Element]);
        const emptyValue: Uint8Array = new Uint8Array(0);
        const encodedUniqueValue: Uint8Array = uniqueSequence._getValue();

        // Act
        const base2: number = helper._getRealEncodingBase(_RealEncodingBase.base2);
        const base8: number = helper._getRealEncodingBase(_RealEncodingBase.base8);
        const base16: number = helper._getRealEncodingBase(_RealEncodingBase.base16);
        const decodedEmpty: _PdfUniqueEncodingElement[] = helper._decodeSequence(emptyValue);
        const decodedSequence: _PdfUniqueEncodingElement[] = helper._decodeSequence(encodedUniqueValue);

        // Assert
        expect(base2).toBe(2);
        expect(base8).toBe(8);
        expect(base16).toBe(16);
        expect(decodedEmpty.length).toBe(0);
        expect(decodedSequence.length).toBe(2);
        expect(decodedSequence[0]._getTagNumber()).toBe(_UniversalType.abstractSyntaxBoolean);
        expect(decodedSequence[1]._getTagNumber()).toBe(_UniversalType.utf8String);
        expect((): number => helper._getRealEncodingBase(0x30)).toThrowError(
            'Impossible real encoding base encountered.'
        );
    });

    it('_getExternalEncoding should cover inner, octet, bit string and default error branches', () => {
        // Arrange
        const helper: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();

        const innerBoolean: _PdfBasicEncodingElement = new _PdfBasicEncodingElement(
            _TagClassType.universal,
            _ConstructionType.primitive,
            _UniversalType.abstractSyntaxBoolean
        );
        innerBoolean._setBooleanValue(true);

        const explicitElement: _PdfBasicEncodingElement = new _PdfBasicEncodingElement(
            _TagClassType.context,
            _ConstructionType.constructed,
            0
        );
        explicitElement._setInner(innerBoolean);

        const octetElement: _PdfBasicEncodingElement = new _PdfBasicEncodingElement(
            _TagClassType.context,
            _ConstructionType.primitive,
            1
        );
        octetElement._setOctetString(new Uint8Array([7, 8]));

        const bitElement: _PdfBasicEncodingElement = new _PdfBasicEncodingElement(
            _TagClassType.context,
            _ConstructionType.primitive,
            2
        );
        bitElement._setBitString(new Uint8ClampedArray([1, 0, 1]));

        const invalidElement: _PdfBasicEncodingElement = new _PdfBasicEncodingElement(
            _TagClassType.context,
            _ConstructionType.primitive,
            3
        );
        invalidElement._setValue(new Uint8Array([0x00]));

        // Act
        const explicitValue: _PdfAbstractSyntaxElement | Uint8Array | Uint8ClampedArray = helper._getExternalEncoding(explicitElement);
        const octetValue: _PdfAbstractSyntaxElement | Uint8Array | Uint8ClampedArray = helper._getExternalEncoding(octetElement);
        const bitValue: _PdfAbstractSyntaxElement | Uint8Array | Uint8ClampedArray = helper._getExternalEncoding(bitElement);

        // Assert
        expect((explicitValue as _PdfAbstractSyntaxElement)._getTagNumber()).toBe(_UniversalType.abstractSyntaxBoolean);
        expect(Array.from(octetValue as Uint8Array)).toEqual([7, 8]);
        expect(Array.from(bitValue as Uint8ClampedArray)).toEqual([1, 0, 1]);
        expect((): _PdfAbstractSyntaxElement | Uint8Array | Uint8ClampedArray => helper._getExternalEncoding(invalidElement)).toThrowError(
            'external does not know of an encoding option having tag number 3.'
        );
    });

    it('_getInner should cover primitive error, array length error, bytes path, relaxed bytes path and _tagValueLength', () => {
        // Arrange
        const firstBoolean: _PdfBasicEncodingElement = new _PdfBasicEncodingElement(
            _TagClassType.universal,
            _ConstructionType.primitive,
            _UniversalType.abstractSyntaxBoolean
        );
        firstBoolean._setBooleanValue(true);

        const secondBoolean: _PdfBasicEncodingElement = new _PdfBasicEncodingElement(
            _TagClassType.universal,
            _ConstructionType.primitive,
            _UniversalType.abstractSyntaxBoolean
        );
        secondBoolean._setBooleanValue(false);

        const primitiveExplicit: _PdfBasicEncodingElement = new _PdfBasicEncodingElement(
            _TagClassType.context,
            _ConstructionType.primitive,
            0
        );

        const invalidArrayExplicit: _PdfBasicEncodingElement = new _PdfBasicEncodingElement(
            _TagClassType.context,
            _ConstructionType.constructed,
            0
        );
        invalidArrayExplicit._setSequence([firstBoolean, secondBoolean]);

        const validArrayExplicit: _PdfBasicEncodingElement = new _PdfBasicEncodingElement(
            _TagClassType.context,
            _ConstructionType.constructed,
            0
        );
        validArrayExplicit._setInner(firstBoolean);

        const firstBuffers: Uint8Array[] = firstBoolean._toBuffers();
        const secondBuffers: Uint8Array[] = secondBoolean._toBuffers();
        const concatenatedBytes: number[] = [];
        for (const buffer of firstBuffers) {
            concatenatedBytes.push(...Array.from(buffer));
        }
        for (const buffer of secondBuffers) {
            concatenatedBytes.push(...Array.from(buffer));
        }

        const bytesExplicit: _PdfBasicEncodingElement = new _PdfBasicEncodingElement(
            _TagClassType.context,
            _ConstructionType.constructed,
            0
        );
        bytesExplicit._setValue(new Uint8Array(concatenatedBytes));

        // Act
        const validInner: _PdfAbstractSyntaxElement = validArrayExplicit._getInner();
        const relaxedInner: _PdfAbstractSyntaxElement = bytesExplicit._getInner(true);
        const totalTagValueLength: number = firstBoolean._tagValueLength();

        // Assert
        expect(validInner._getTagNumber()).toBe(_UniversalType.abstractSyntaxBoolean);
        expect(relaxedInner._getTagNumber()).toBe(_UniversalType.abstractSyntaxBoolean);
        expect(totalTagValueLength).toBeGreaterThan(0);
        expect((): _PdfAbstractSyntaxElement => primitiveExplicit._getInner()).toThrowError(
            'An explicitly-encoded element cannot be encoded using primitive construction.'
        );
        expect((): _PdfAbstractSyntaxElement => invalidArrayExplicit._getInner()).toThrowError(
            'An explicitly-encoding element contained 2 encoded elements.'
        );
        expect((): _PdfAbstractSyntaxElement => bytesExplicit._getInner()).toThrowError();
    });

    it('_fromBytes, _lengthLength, _valueLength, _tagAndLengthBytes and _toBuffers should cover definite and indefinite encoding flows', () => {
        // Arrange
        const shortBooleanBytes: Uint8Array = new Uint8Array([0x01, 0x01, 0xff]);
        const longTagBytes: Uint8Array = new Uint8Array([0x5f, 0x64, 0x01, 0x00]);
        const indefiniteSequenceBytes: Uint8Array = new Uint8Array([0x30, 0x80, 0x01, 0x01, 0xff, 0x00, 0x00]);

        const shortElement: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();
        const longTagElement: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();
        const indefiniteElement: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();

        const definiteShortValueElement: _PdfBasicEncodingElement = new _PdfBasicEncodingElement(
            _TagClassType.universal,
            _ConstructionType.primitive,
            _UniversalType.octetString
        );
        definiteShortValueElement._setOctetString(new Uint8Array([1, 2, 3]));

        const definiteLongValueElement: _PdfBasicEncodingElement = new _PdfBasicEncodingElement(
            _TagClassType.universal,
            _ConstructionType.primitive,
            _UniversalType.octetString
        );
        definiteLongValueElement._setOctetString(new Uint8Array(128));

        const indefiniteOctetElement: _PdfBasicEncodingElement = new _PdfBasicEncodingElement(
            _TagClassType.universal,
            _ConstructionType.primitive,
            _UniversalType.octetString
        );
        indefiniteOctetElement._setOctetString(new Uint8Array([9, 9]));
        indefiniteOctetElement._lengthEncodingPreference = _EncodingLength.indefinite;

        // Act
        const shortConsumed: number = shortElement._fromBytes(shortBooleanBytes);
        const longTagConsumed: number = longTagElement._fromBytes(longTagBytes);
        const indefiniteConsumed: number = indefiniteElement._fromBytes(indefiniteSequenceBytes);

        const shortLengthLength: number = definiteShortValueElement._lengthLength();
        const longLengthLength: number = definiteLongValueElement._lengthLength();
        const cachedValueLength: number = definiteLongValueElement._valueLength();
        const indefiniteLengthLength: number = indefiniteOctetElement._lengthLength();

        const definiteTagAndLength: Uint8Array = definiteShortValueElement._tagAndLengthBytes();
        const indefiniteTagAndLength: Uint8Array = indefiniteOctetElement._tagAndLengthBytes();
        const indefiniteBuffers: Uint8Array[] = indefiniteOctetElement._toBuffers();

        // Assert
        expect(shortConsumed).toBe(3);
        expect(shortElement._getBooleanValue()).toBe(true);

        expect(longTagConsumed).toBe(4);
        expect(longTagElement._tagClass).toBe(_TagClassType.application);
        expect(longTagElement._getTagNumber()).toBe(100);

        expect(indefiniteConsumed).toBe(7);
        expect(indefiniteElement._construction).toBe(_ConstructionType.constructed);
        expect(Array.from(indefiniteElement._getValue())).toEqual([0x01, 0x01, 0xff]);

        expect(shortLengthLength).toBe(1);
        expect(longLengthLength).toBe(2);
        expect(cachedValueLength).toBe(128);
        expect(indefiniteLengthLength).toBe(1);

        expect(Array.from(definiteTagAndLength)).toEqual([0x04, 0x03]);
        expect(Array.from(indefiniteTagAndLength)).toEqual([0x24, 0x80]);
        expect(indefiniteBuffers.length).toBe(3);
        expect(Array.from(indefiniteBuffers[2])).toEqual([0x00, 0x00]);
    });
    

    it('_encode should cover object identifier branch when a valid object identifier is provided', () => {
        // Arrange
        const helperElement: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();
        const objectIdentifier: _PdfObjectIdentifier = new _PdfObjectIdentifier();

        // Act
        helperElement._encode(objectIdentifier);

        // Assert
        expect(helperElement._getTagNumber()).toBe(_UniversalType.objectIdentifier);
        expect(helperElement._getValue().length).toBe(0);
    });

    it('_fromBerSequence, _fromSet and _fromSetOf should filter empty items and return constructed wrappers', () => {
        // Arrange
        const helperElement: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();

        const booleanElement: _PdfBasicEncodingElement = new _PdfBasicEncodingElement(
            _TagClassType.universal,
            _ConstructionType.primitive,
            _UniversalType.abstractSyntaxBoolean
        );
        booleanElement._setBooleanValue(true);

        const stringElement: _PdfBasicEncodingElement = new _PdfBasicEncodingElement(
            _TagClassType.universal,
            _ConstructionType.primitive,
            _UniversalType.utf8String
        );
        stringElement._setUtf8String('B');

        // Act
        const berSequence: _PdfBasicEncodingElement = helperElement._fromBerSequence([
            booleanElement,
            null as unknown as _PdfAbstractSyntaxElement,
            stringElement
        ]);
        const setElement: _PdfBasicEncodingElement = helperElement._fromSet([
            booleanElement,
            null as unknown as _PdfBasicEncodingElement,
            stringElement
        ]);
        const setOfElement: _PdfBasicEncodingElement = helperElement._fromSetOf([
            booleanElement,
            null as unknown as _PdfBasicEncodingElement,
            stringElement
        ]);

        // Assert
        expect(berSequence._construction).toBe(_ConstructionType.constructed);
        expect(berSequence._getTagNumber()).toBe(_UniversalType.sequence);
        expect(berSequence._getSequence().length).toBe(2);
        expect(berSequence._getSequence()[0]._getTagNumber()).toBe(_UniversalType.abstractSyntaxBoolean);
        expect(berSequence._getSequence()[1]._getTagNumber()).toBe(_UniversalType.utf8String);

        expect(setElement._construction).toBe(_ConstructionType.constructed);
        expect(setElement._getTagNumber()).toBe(_UniversalType.abstractSyntaxSet);
        expect(setElement._getSequence().length).toBe(2);

        expect(setOfElement._construction).toBe(_ConstructionType.constructed);
        expect(setOfElement._getTagNumber()).toBe(_UniversalType.abstractSyntaxSet);
        expect(setOfElement._getSequence().length).toBe(2);
    });

    it('_valueLength should cover cached non-array branch, raw non-array branch and constructed array aggregation branch', () => {
        // Arrange
        const cachedValueElement: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();
        cachedValueElement._setValue(new Uint8Array([1, 2, 3, 4]));

        const rawValueElement: _PdfBasicEncodingElement = new _PdfBasicEncodingElement(
            _TagClassType.universal,
            _ConstructionType.constructed,
            _UniversalType.sequence
        );
        const childBoolean: _PdfBasicEncodingElement = new _PdfBasicEncodingElement(
            _TagClassType.universal,
            _ConstructionType.primitive,
            _UniversalType.abstractSyntaxBoolean
        );
        childBoolean._setBooleanValue(true);
        rawValueElement._setSequence([childBoolean]);
        rawValueElement._setValue(rawValueElement._getValue());

        const childInteger: _PdfBasicEncodingElement = new _PdfBasicEncodingElement(
            _TagClassType.universal,
            _ConstructionType.primitive,
            _UniversalType.endOfContent,
            9
        );
        const childString: _PdfBasicEncodingElement = new _PdfBasicEncodingElement(
            _TagClassType.universal,
            _ConstructionType.primitive,
            _UniversalType.endOfContent,
            'AB'
        );

        const constructedArrayElement: _PdfBasicEncodingElement = new _PdfBasicEncodingElement(
            _TagClassType.universal,
            _ConstructionType.constructed,
            _UniversalType.sequence
        );
        constructedArrayElement._setSequence([childInteger, childString]);

        const expectedConstructedLength: number = childInteger._tagValueLength() + childString._tagValueLength();

        // Act
        const cachedLength: number = cachedValueElement._valueLength();
        const rawLength: number = rawValueElement._valueLength();
        const constructedLength: number = constructedArrayElement._valueLength();

        // Assert
        expect(cachedLength).toBe(4);
        expect(rawLength).toBe(rawValueElement._getValue().length);
        expect(constructedLength).toBe(expectedConstructedLength);
    });

    it('_tagAndLengthBytes should cover long tag number encoding and definite long-form length encoding', () => {
        // Arrange
        const longTagElement: _PdfBasicEncodingElement = new _PdfBasicEncodingElement(
            _TagClassType.application,
            _ConstructionType.primitive,
            100
        );
        longTagElement._setValue(new Uint8Array(128));

        // Act
        const tagAndLengthBytes: Uint8Array = longTagElement._tagAndLengthBytes();

        // Assert
        expect(Array.from(tagAndLengthBytes)).toEqual([0x5f, 0x64, 0x81, 0x80]);
    });

    it('_tagAndLengthBytes should cover constructed tag bit for definite constructed values', () => {
        // Arrange
        const childBoolean: _PdfBasicEncodingElement = new _PdfBasicEncodingElement(
            _TagClassType.universal,
            _ConstructionType.primitive,
            _UniversalType.abstractSyntaxBoolean
        );
        childBoolean._setBooleanValue(true);

        const constructedSequence: _PdfBasicEncodingElement = new _PdfBasicEncodingElement(
            _TagClassType.universal,
            _ConstructionType.constructed,
            _UniversalType.sequence
        );
        constructedSequence._setSequence([childBoolean]);

        // Act
        const tagAndLengthBytes: Uint8Array = constructedSequence._tagAndLengthBytes();

        // Assert
        expect(tagAndLengthBytes[0]).toBe(0x30);
        expect(tagAndLengthBytes[1]).toBe(childBoolean._tagValueLength());
    });



    it('_encode should cover unsupported object and unsupported primitive type negative branches', () => {
        // Arrange
        const unsupportedObjectInvoker: () => _PdfBasicEncodingElement = (): _PdfBasicEncodingElement => {
            return new _PdfBasicEncodingElement(
                _TagClassType.universal,
                _ConstructionType.primitive,
                _UniversalType.endOfContent,
                new Date()
            );
        };

    });


});
describe('1041530 - Basic Encoding Element 1', () => {
    it('1041530 - BER bit string recursion boundary', () => {
        const element: any = new _PdfBasicEncodingElement();
        element._construction = _ConstructionType.constructed;
        element._recursionCount = 9;
        element._nestingRecursionLimit = 10;
        const child: any = {_construction: _ConstructionType.primitive,_tagClass: element._tagClass,_getTagNumber: () => element._getTagNumber(),_getValue: () => new Uint8Array([]),_getBitString: () => new Uint8ClampedArray([1])};
        spyOn(element, '_getSequence').and.returnValue([child]);
        expect(() => element._getBitString()).not.toThrow();
    });
    it('1041530 - BER bit string allows empty primitive segment', () => {
        const element: any = new _PdfBasicEncodingElement();
        element._construction = _ConstructionType.constructed;
        const child: any = {_construction: _ConstructionType.primitive,_tagClass: element._tagClass,_getTagNumber: () => element._getTagNumber(),_getValue: () => new Uint8Array([]),_getBitString: () => new Uint8ClampedArray([])};
        spyOn(element, '_getSequence').and.returnValue([child]);
        expect(() => element._getBitString()).not.toThrow();
    });
    it('1041530 - BER bit string should ignore non-primitive segments in validation', () => {
        const element: any = new _PdfBasicEncodingElement();
        element._construction = _ConstructionType.constructed;
        const child: any = {_construction: _ConstructionType.constructed,_tagClass: element._tagClass,_getTagNumber: () => element._getTagNumber(),_getValue: () => new Uint8Array([1]), _getBitString: () => new Uint8ClampedArray([])};
        spyOn(element, '_getSequence').and.returnValue([child]);
        expect(() => element._getBitString()).not.toThrow();
    });
    it('1041530 - BER getObjectDescriptor should serialize with ObjectDescriptor type', () => {
        const el: any = new _PdfBasicEncodingElement();
        const serializeSpy = spyOn(el, '_serialize').and.returnValue(new Uint8Array([65]));
        spyOn(el, '_decodeObjectDescriptor').and.returnValue('decoded');
        const result = el._getObjectDescriptor();
        expect(result).toBe('decoded');
        expect(serializeSpy).toHaveBeenCalledWith('ObjectDescriptor');
    });
    it('1041530 - BER getNumericString should serialize with NumericString type', () => {
        const el: any = new _PdfBasicEncodingElement();
        const serializeSpy = spyOn(el, '_serialize').and.returnValue(new Uint8Array([49, 50, 51]));
        spyOn(el, '_decodeNumericString').and.returnValue('123');
        const result = el._getNumericString();
        expect(result).toBe('123');
        expect(serializeSpy).toHaveBeenCalledWith('NumericString');
    });
    it('1041530 - BER getUniversalString should serialize with UniversalString type', () => {
        const el: any = new _PdfBasicEncodingElement();
        const serializeSpy = spyOn(el, '_serialize').and.returnValue(new Uint8Array([0x00, 0x00, 0x00, 0x41]));
        const result = el._getUniversalString();
        expect(result).toEqual('A');
        expect(serializeSpy).toHaveBeenCalledWith('UniversalString');
    });
    it('1041530 - BER getUniversalString should decode all four bytes correctly', () => {
        const el: any = new _PdfBasicEncodingElement();
        spyOn(el, '_serialize').and.returnValue(new Uint8Array([0x00, 0x00, 0x01, 0x41]));
        const result = el._getUniversalString();
        expect(result).toEqual(String.fromCharCode(0x0141));
    });
    it('1041530 - BER getUniversalString should preserve third byte contribution', () => {
        const el: any = new _PdfBasicEncodingElement();
        spyOn(el, '_serialize').and.returnValue(new Uint8Array([0x00, 0x00, 0x01, 0x41]));
        expect(el._getUniversalString()).toBe('Ł');
    });
    it('1041530 - BER getUniversalString should preserve second byte contribution', () => {
        const el: any = new _PdfBasicEncodingElement();
        spyOn(el, '_serialize').and.returnValue(new Uint8Array([0x00, 0x01, 0x00, 0x41]));
        const result = el._getUniversalString();
        expect(result).toEqual(String.fromCharCode(0x10041));
    });
    it('1041530 - BER getUniversalString should decode non zero second byte correctly', () => {
        const el: any = new _PdfBasicEncodingElement();
        spyOn(el, '_serialize').and.returnValue(new Uint8Array([0x00, 0x01, 0x00, 0x41]));
        const expected = String.fromCharCode((0x00 << 24) +(0x01 << 16) +(0x00 << 8) +0x41);
        expect(el._getUniversalString()).toEqual(expected);
    });
    it('1041530 - BER getUniversalString should use the third byte correctly', () => {
        const el: any = new _PdfBasicEncodingElement();
        spyOn(el, '_serialize').and.returnValue(new Uint8Array([0x00, 0x00, 0x01, 0x41]));
        const result = el._getUniversalString();
        expect(result).toBe(String.fromCharCode(0x0141));
    });
    it('1041530 - BER setUniversalString should encode third byte correctly', () => {
        const el = new _PdfBasicEncodingElement();
        el._setUniversalString('Ł');
        const value = el._getValue();
        expect(Array.from(value)).toEqual([0x00, 0x00, 0x01, 0x41]);
    });
    it('1041530 - BER getBmpString should serialize with BMPString type', () => {
        const el: any = new _PdfBasicEncodingElement();
        const serializeSpy = spyOn(el, '_serialize').and.returnValue(new Uint8Array([0x00, 0x41]));
        el._getBmpString();
        expect(serializeSpy).toHaveBeenCalledWith('BMPString');
    });
    it('1041530 - BER setBmpString should encode exact number of characters', () => {
        const el = new _PdfBasicEncodingElement();
        el._setBmpString('A');
        expect(Array.from(el._getValue())).toEqual([0x00, 0x41]);
    });
    it('1041530 - BER setBmpString should not perform an extra loop iteration', () => {
        const el = new _PdfBasicEncodingElement();
        el._setBmpString('AB');
        expect(Array.from(el._getValue())).toEqual([0x00, 0x41,0x00, 0x42]);
    });
    it('1041530 - BER encode should not treat non integer numbers as integers', () => {
        const el: any = new _PdfBasicEncodingElement();
        const setIntegerSpy = spyOn(el, '_setInteger').and.callThrough();
        el._encode(1.1);
        expect(setIntegerSpy).not.toHaveBeenCalled();
    });
    it('1041530 - BER encode should only call setInteger for integers', () => {
        const el: any = new _PdfBasicEncodingElement();
        const setIntegerSpy = spyOn(el, '_setInteger').and.callThrough();
        el._encode(123);
        expect(setIntegerSpy).toHaveBeenCalledWith(123);
        setIntegerSpy.calls.reset();
        el._encode(1.1);
        expect(setIntegerSpy).not.toHaveBeenCalled();
    });
    it('1041530 - BER encode should reject mixed arrays of ASN1 and non ASN1 values', () => {
        const el = new _PdfBasicEncodingElement();
        const asn1 = new _PdfUniqueEncodingElement();
        expect(() => {el._encode([asn1, {}]);}).toThrow();
    });
    it('1041530 - BER encode array should create encoded sequence elements', () => {
        const el = new _PdfBasicEncodingElement();
        el._encode([1, 2]);
        const sequence = el._getSequence();
        expect(sequence.length).toBe(2);
        expect(sequence[0]).toBeDefined();
        expect(sequence[1]).toBeDefined();
        expect(sequence[0] instanceof _PdfBasicEncodingElement).toBeTruthy();
        expect(sequence[1] instanceof _PdfBasicEncodingElement).toBeTruthy();
    });
    it('1041530 - BER encode array should encode sequence item values', () => {
        const el = new _PdfBasicEncodingElement();
        el._encode([1]);
        const sequence = el._getSequence();
        expect(sequence.length).toBe(1);
        expect(sequence[0] instanceof _PdfBasicEncodingElement).toBeTruthy();
        expect(sequence[0]._getTagNumber()).toBe(_UniversalType.integer);
    });
    it('1041530 - getInner should throw detailed message for multiple encoded elements', () => {
        const el: any = new _PdfBasicEncodingElement();
        el._construction = _ConstructionType.constructed;
        el._value = new Uint8Array([0x02, 0x01, 0x01,0x02, 0x01, 0x02]);
        spyOn(_PdfBasicEncodingElement.prototype, '_fromBytes').and.returnValue(3);
        expect(() => {el._getInner(false);}).toThrowError(/encoded on 3 bytes/);
    });
    it('1041530 - getInner should include byte count in error message', () => {
        const el: any = new _PdfBasicEncodingElement();
        el._construction = _ConstructionType.constructed;
        el._value = new Uint8Array([1, 2, 3, 4]);
        spyOn(_PdfBasicEncodingElement.prototype, '_fromBytes').and.returnValue(2);
        spyOn(_PdfBasicEncodingElement.prototype, '_getTagNumber').and.returnValue(16);
        expect(() => el._getInner(false)).toThrowError(/2 bytes/);
    });
    it('1041530 - getInner should throw detailed explicitly encoded element error', () => {
        const el: any = new _PdfBasicEncodingElement();
        el._construction = _ConstructionType.constructed;
        el._value = new Uint8Array([1, 2, 3, 4]);
        spyOn(_PdfBasicEncodingElement.prototype, '_fromBytes').and.returnValue(2);
        spyOn(_PdfBasicEncodingElement.prototype, '_getTagNumber').and.returnValue(16);
        expect(() => {el._getInner(false);}).toThrowError(/An explicitly-encoding element contained more than one single/);
    });
    it('1041530 - getInner should include encoded byte count text in error message', () => {
        const el: any = new _PdfBasicEncodingElement();
        el._construction = _ConstructionType.constructed;
        el._value = new Uint8Array([1, 2, 3, 4]);
        spyOn(_PdfBasicEncodingElement.prototype, '_fromBytes').and.returnValue(2);
        spyOn(_PdfBasicEncodingElement.prototype, '_getTagNumber').and.returnValue(16);
        expect(() => {el._getInner(false);}).toThrowError(/and it was encoded on/i);
    });
    it('1041530 - getInner should include bytes suffix in error message', () => {
        const el: any = new _PdfBasicEncodingElement();
        el._construction = _ConstructionType.constructed;
        el._value = new Uint8Array([1, 2, 3, 4]);
        spyOn(_PdfBasicEncodingElement.prototype, '_fromBytes').and.returnValue(2);
        spyOn(_PdfBasicEncodingElement.prototype, '_getTagNumber').and.returnValue(16);
        expect(() => {el._getInner(false);}).toThrowError(/2 bytes\./);
    });
    it('1041530 - should stop parsing indefinite length content at EOC marker', () => {
        const bytes = new Uint8Array([0x30, 0x80, 0x02, 0x01, 0x05, 0x00, 0x00, 0x02, 0x01, 0x07]);
        const element = new _PdfBasicEncodingElement();
        const consumed = element._fromBytes(bytes);
        expect(consumed).toBe(7);
        expect(Array.from(element._getValue())).toEqual([0x02, 0x01, 0x05]);
    });
    it('1041530 - should not treat a non-EOC empty-length element as end-of-content', () => {
        const bytes = new Uint8Array([0x30, 0x80,0x05, 0x00,0x02, 0x01, 0x05,0x00, 0x00]);
        const element = new _PdfBasicEncodingElement();
        const consumed = element._fromBytes(bytes);
        expect(consumed).toBe(bytes.length);
        expect(Array.from(element._getValue())).toEqual([0x05, 0x00,0x02, 0x01, 0x05]);
    });
    it('1041530 - should not stop at a universal primitive element before EOC', () => {
        const bytes = new Uint8Array([0x30, 0x80,0x02, 0x01, 0x05,0x02, 0x01, 0x07,0x00, 0x00]);
        const element = new _PdfBasicEncodingElement();
        const consumed = element._fromBytes(bytes);
        expect(consumed).toBe(bytes.length);
        expect(Array.from(element._getValue())).toEqual([0x02, 0x01, 0x05,0x02, 0x01, 0x07]);
    });
    it('1041530 - should not treat a context-specific tag 0 with empty value as end-of-content', () => {
        const bytes = new Uint8Array([0x30, 0x80,0x80, 0x00,0x02, 0x01, 0x05,0x00, 0x00]);
        const element = new _PdfBasicEncodingElement();
        const consumed = element._fromBytes(bytes);
        expect(consumed).toBe(bytes.length);
        expect(Array.from(element._getValue())).toEqual([0x80, 0x00,0x02, 0x01, 0x05]);
    });
    it('1041530 - should not treat a context-specific primitive tag 0 with empty value as end-of-content', () => {
        const bytes = new Uint8Array([0x30, 0x80,0x80, 0x00,0x02, 0x01, 0x05,0x00, 0x00]);
        const element = new _PdfBasicEncodingElement();
        const consumed = element._fromBytes(bytes);
        expect(consumed).toBe(bytes.length);
        expect(Array.from(element._getValue())).toEqual([0x80, 0x00,0x02, 0x01, 0x05]);
    });
    it('1041530 - should stop parsing at a universal end-of-content marker', () => {
        const bytes = new Uint8Array([0x30, 0x80,0x02, 0x01, 0x05,0x00, 0x00,0x02, 0x01, 0x07]);
        const element = new _PdfBasicEncodingElement();
        const consumed = element._fromBytes(bytes);
        expect(consumed).toBe(7);
        expect(Array.from(element._getValue())).toEqual([0x02, 0x01, 0x05]);
    });
    it('1041530 - should not treat a constructed universal tag 0 with empty value as end-of-content', () => {
        const bytes = new Uint8Array([0x30, 0x80,0x20, 0x00,0x02, 0x01, 0x05,0x00, 0x00]);
        const element = new _PdfBasicEncodingElement();
        const consumed = element._fromBytes(bytes);
        expect(consumed).toBe(bytes.length);
        expect(Array.from(element._getValue())).toEqual([0x20, 0x00,0x02, 0x01, 0x05]);
    });
    it('1041530 - should not treat a universal primitive empty NULL element as end-of-content', () => {
        const bytes = new Uint8Array([0x30, 0x80,0x05, 0x00,0x02, 0x01, 0x05,0x00, 0x00]);
        const element = new _PdfBasicEncodingElement();
        const consumed = element._fromBytes(bytes);
        expect(consumed).toBe(bytes.length);
        expect(Array.from(element._getValue())).toEqual([0x05, 0x00,0x02, 0x01, 0x05]);
    });
    it('1041530 - should not treat a NULL element as end-of-content', () => {
        const bytes = new Uint8Array([0x30, 0x80,0x05, 0x00,0x02, 0x01, 0x05,0x00, 0x00]);
        const element = new _PdfBasicEncodingElement();
        const consumed = element._fromBytes(bytes);
        expect(consumed).toBe(bytes.length);
        expect(Array.from(element._getValue())).toEqual([0x05, 0x00,0x02, 0x01, 0x05]);
    });
    it('1041530 - should not treat a universal primitive tag 0 with a non-empty value as end-of-content', () => {
        const bytes = new Uint8Array([0x30, 0x80,0x00, 0x01, 0xFF,0x02, 0x01, 0x05,0x00, 0x00]);
        const element = new _PdfBasicEncodingElement();
        const consumed = element._fromBytes(bytes);
        expect(consumed).toBe(bytes.length);
        expect(Array.from(element._getValue())).toEqual([0x00, 0x01, 0xFF,0x02, 0x01, 0x05])
    });
    it('1041530 - should stop parsing at an end-of-content marker', () => {
        const bytes = new Uint8Array([0x30, 0x80,0x02, 0x01, 0x05,0x00, 0x00,0x02, 0x01, 0x07]);
        const element = new _PdfBasicEncodingElement();
        const consumed = element._fromBytes(bytes);
        expect(consumed).toBe(7);
        expect(Array.from(element._getValue())).toEqual([0x02, 0x01, 0x05]);
    });
    it('1041530 - should stop parsing at EOC marker', () => {
        const bytes = new Uint8Array([0x30, 0x80,0x02, 0x01, 0x05,0x00, 0x00,0x02, 0x01, 0x07]);
        const element = new _PdfBasicEncodingElement();
        const consumed = element._fromBytes(bytes);
        expect(consumed).toBe(7);
        expect(Array.from(element._getValue())).toEqual([0x02, 0x01, 0x05]);
    });
    it('1041530 - should allow trailing bytes after the end-of-content marker', () => {
        const bytes = new Uint8Array([0x30, 0x80,0x02, 0x01, 0x05,0x00, 0x00,0xFF]);
        const element = new _PdfBasicEncodingElement();
        expect(() => element._fromBytes(bytes)).not.toThrow();
    });
    it('1041530 - should throw when an indefinite-length element is missing an end-of-content marker', () => {
        const bytes = new Uint8Array([0x30, 0x80,0x02, 0x01, 0x05]);
        const element = new _PdfBasicEncodingElement();
        expect(() => element._fromBytes(bytes)).toThrow();
    });
    it('1041530 - should throw when the first byte of the EOC marker is non-zero', () => {
        const bytes = new Uint8Array([0x30, 0x80,0x02, 0x01, 0x05,0x01, 0x00]);
        const element = new _PdfBasicEncodingElement();
        expect(() => element._fromBytes(bytes)).toThrowError(/Invalid format: indefinite-length ASN1 elements must end with an End-of-Content marker/);
    });
    it('1041530 - should allow an element with long-form zero length', () => {
        const bytes = new Uint8Array([0x04,0x81, 0x00]);
        const element = new _PdfBasicEncodingElement();
        expect(() => element._fromBytes(bytes)).not.toThrow();
        expect(element._getValue().length).toBe(0);
    });
    it('1041530 - should return 1 for indefinite length encoding', () => {
        const element = new _PdfBasicEncodingElement();
        element._lengthEncodingPreference = _EncodingLength.indefinite;
        expect(element._lengthLength(1000)).toBe(1);
    });
    it('1041530 - should return 1 for indefinite length encoding preference', () => {
        const element = new _PdfBasicEncodingElement();
        element._lengthEncodingPreference = _EncodingLength.indefinite;
        expect(element._lengthLength(128)).toBe(1);
    });
    it('1041530 - should use _valueLength when valueLength is null', () => {
        const element = new _PdfBasicEncodingElement();
        spyOn(element, '_valueLength').and.returnValue(128);
        expect(element._lengthLength(null)).toBe(2);
    });
    it('1041530 - should use the provided valueLength when it is not null', () => {
        const element = new _PdfBasicEncodingElement();
        spyOn(element, '_valueLength').and.returnValue(10);
        expect(element._lengthLength(128)).toBe(2);
    });
    it('1041530 - should return cached current value length when available', () => {
        const element = new _PdfBasicEncodingElement();
        (element as any)._currentValueLength = 10;
        (element as any)._value = new Uint8Array([1, 2, 3]);
        expect(element._valueLength()).toBe(10);
    });
    it('1041530 - should recompute value length when cached length is null', () => {
        const element = new _PdfBasicEncodingElement();
        (element as any)._currentValueLength = null;
        (element as any)._value = new Uint8Array([1, 2, 3]);
        expect(element._valueLength()).toBe(3);
    });
    it('1041530 - should return cached value length when currentValueLength is available', () => {
        const element = new _PdfBasicEncodingElement();
        (element as any)._currentValueLength = 10;
        (element as any)._value = new Uint8Array([1, 2, 3]);
        expect(element._valueLength()).toBe(10);
    });
    it('1041530 - should encode the first tag byte correctly for a primitive universal tag', () => {
        const element = new _PdfBasicEncodingElement();
        element._tagClass = 0;
        element._construction = _ConstructionType.primitive;
        element._lengthEncodingPreference = _EncodingLength.definite;
        spyOn(element, '_getTagNumber').and.returnValue(2);
        spyOn(element, '_valueLength').and.returnValue(0);
        const result = element._tagAndLengthBytes();
        expect(result[0]).toBe(0x02);
        expect(result[1]).toBe(0x00);
    });
    it('1041530 - should encode tag class and constructed bit correctly', () => {
        const element = new _PdfBasicEncodingElement();
        element._tagClass = 2;
        element._construction = _ConstructionType.constructed;
        element._lengthEncodingPreference = _EncodingLength.definite;
        spyOn(element, '_getTagNumber').and.returnValue(3);
        spyOn(element, '_valueLength').and.returnValue(1);
        const result = element._tagAndLengthBytes();
        expect(result[0]).toBe(0xA3);
        expect(result[1]).toBe(0x01);
    });
    it('1041530 - should include the initial tag octet for high tag numbers', () => {
        const element = new _PdfBasicEncodingElement();
        element._tagClass = 0;
        element._construction = _ConstructionType.primitive;
        element._lengthEncodingPreference = _EncodingLength.definite;
        spyOn(element, '_getTagNumber').and.returnValue(31);
        spyOn(element, '_valueLength').and.returnValue(0);
        const result = element._tagAndLengthBytes();
        expect(result[0]).toBe(0x1F);
    });
    it('1041530 - should use high-tag-number encoding when tag number is 31', () => {
        const element = new _PdfBasicEncodingElement();
        element._tagClass = 0;
        element._construction = _ConstructionType.primitive;
        element._lengthEncodingPreference = _EncodingLength.definite;
        spyOn(element, '_getTagNumber').and.returnValue(31);
        spyOn(element, '_valueLength').and.returnValue(0);
        const result = element._tagAndLengthBytes();
        expect(Array.from(result)).toEqual([0x1F,0x1F,0x00]);
    });
    it('1041530 - should append all child buffers without adding undefined entries', () => {
        const child = {_toBuffers: () => [new Uint8Array([1])]};
        const element = new _PdfBasicEncodingElement();
        spyOn(element, '_tagAndLengthBytes').and.returnValue(new Uint8Array([0x30]));
        (element as any)._value = [child];
        (element as any)._lengthEncodingPreference = _EncodingLength.definite;
        const result = element._toBuffers();
        expect(result.length).toBe(2);
        expect(result[0]).toEqual(new Uint8Array([0x30]));
        expect(result[1]).toEqual(new Uint8Array([1]));
        expect(result.some((x: any) => x === undefined)).toBeFalsy();
    });
    it('1041530 - should not push undefined when processing child buffers', () => {
        const child = {_toBuffers: () => [new Uint8Array([1])]};
        const element = new _PdfBasicEncodingElement();
        spyOn(element, '_tagAndLengthBytes').and.returnValue(new Uint8Array([0x30]));
        (element as any)._value = [child];
        const result = element._toBuffers();
        expect(result.length).toBe(2);
        expect(result.every((x: any) => x !== undefined)).toBeTruthy();
    });
    it('1041530 - should allow recursion when recursionCount + 1 equals nestingRecursionLimit', () => {
        const parent = new _PdfBasicEncodingElement();
        const child = new _PdfBasicEncodingElement();
        (parent as any)._construction = _ConstructionType.constructed;
        (parent as any)._recursionCount = 0;
        (parent as any)._nestingRecursionLimit = 1;
        (parent as any)._tagClass = _TagClassType.universal;
        spyOn(parent as any, '_getTagNumber').and.returnValue(_UniversalType.octetString);
        spyOn(parent as any, '_getSequence').and.returnValue([child]);
        (child as any)._tagClass = _TagClassType.universal;
        spyOn(child as any, '_getTagNumber').and.returnValue(_UniversalType.octetString);
        spyOn(child as any, '_getValue').and.returnValue(new Uint8Array([1, 2, 3]));
        expect(() => {(parent as any)._serialize('OCTET STRING');}).not.toThrow();
    });
    it('1041530 - should not throw when recursionCount + 1 equals nestingRecursionLimit', () => {
        const element = new _PdfBasicEncodingElement();
        (element as any)._construction = _ConstructionType.constructed;
        (element as any)._recursionCount = 0;
        (element as any)._nestingRecursionLimit = 1;
        spyOn(element as any, '_getSequence').and.returnValue([]);
        spyOn(element as any, '_getTagNumber').and.returnValue(_UniversalType.octetString);
        expect(() => {(element as any)._serialize('test');}).not.toThrow();
    });
    it('1041530 - should throw when a constructed OCTET STRING contains a non-universal child', () => {
        const parent = new _PdfBasicEncodingElement();
        const child = new _PdfBasicEncodingElement();
        (parent as any)._construction = _ConstructionType.constructed;
        (parent as any)._tagClass = _TagClassType.universal;
        spyOn(parent as any, '_getTagNumber').and.returnValue(_UniversalType.octetString);
        spyOn(parent as any, '_getSequence').and.returnValue([child]);
        (child as any)._tagClass = _TagClassType.context;
        spyOn(child as any, '_getTagNumber').and.returnValue(_UniversalType.octetString);
        expect(() => {(parent as any)._serialize('OCTET STRING');}).toThrowError('Invalid constructed OCTET STRING: children must be OCTET STRING (tag 4).');
    });
    it('1041530 - should allow constructed elements whose children have the same tag class and tag number as the parent', () => {
        const parent = new _PdfBasicEncodingElement();
        const child = new _PdfBasicEncodingElement();
        (parent as any)._construction = _ConstructionType.constructed;
        (parent as any)._tagClass = _TagClassType.context;
        spyOn(parent as any, '_getTagNumber').and.returnValue(5);
        spyOn(parent as any, '_getSequence').and.returnValue([child]);
        (child as any)._tagClass = _TagClassType.context;
        spyOn(child as any, '_getTagNumber').and.returnValue(5);
        spyOn(child as any, '_getValue').and.returnValue(new Uint8Array([1, 2, 3]));
        expect(() => {(parent as any)._serialize('test');}).not.toThrow();
    });
    it('1041530 - should not throw when child has same tag class and tag number as parent', () => {
        const parent = new _PdfBasicEncodingElement();
        const child = new _PdfBasicEncodingElement();
        (parent as any)._construction = _ConstructionType.constructed;
        (parent as any)._tagClass = _TagClassType.context;
        spyOn(parent as any, '_getTagNumber').and.returnValue(5);
        spyOn(parent as any, '_getSequence').and.returnValue([child]);
        (child as any)._tagClass = _TagClassType.context;
        spyOn(child as any, '_getTagNumber').and.returnValue(5);
        spyOn(child as any, '_getValue').and.returnValue(new Uint8Array([1, 2, 3]));
        expect(() => {(parent as any)._serialize('TEST');}).not.toThrow();
    });
    it('1041530 - should increment recursion count for child elements', () => {
        const parent = new _PdfBasicEncodingElement();
        const child = new _PdfBasicEncodingElement();
        (parent as any)._construction = _ConstructionType.constructed;
        (parent as any)._recursionCount = 2;
        (parent as any)._tagClass = _TagClassType.context;
        spyOn(parent as any, '_getTagNumber').and.returnValue(5);
        spyOn(parent as any, '_getSequence').and.returnValue([child]);
        (child as any)._tagClass = _TagClassType.context;
        spyOn(child as any, '_getTagNumber').and.returnValue(5);
        spyOn(child as any, '_getValue').and.callFake(() => {expect((child as any)._recursionCount).toBe(3);return new Uint8Array([1]);});
        (parent as any)._serialize('TEST');
    });
    it('1041530 - should allow a one-byte BIT STRING containing only 0 unused bits', () => {
        const element = new _PdfBasicEncodingElement();
        const result = (element as any)._decodeBitString(new Uint8Array([0]));
        expect(result).toEqual(new Uint8ClampedArray([]));
    });
    it('1041530 - should allow a BIT STRING with 7 unused bits', () => {
        const element = new _PdfBasicEncodingElement();
        expect(() => {(element as any)._decodeBitString(new Uint8Array([7, 0x80]));}).not.toThrow();
    });
    it('1041530 - should decode a BIT STRING with 7 unused bits', () => {
        const element = new _PdfBasicEncodingElement();
        const result = (element as any)._decodeBitString(new Uint8Array([7, 0x80]));
        expect(Array.from(result)).toEqual([1]);
    });
    it('1041530 - should return an empty array without attempting to decode any elements for empty input', () => {
        const element = new _PdfBasicEncodingElement();
        const spy = spyOn(_PdfUniqueEncodingElement.prototype,'_fromBytes').and.callThrough();
        const result = (element as any)._decodeSequence(new Uint8Array([]));
        expect(result).toEqual([]);
        expect(spy).not.toHaveBeenCalled();
    });
    it('1041530 - should expose definite encoding length with value 0', () => {
        expect(_EncodingLength.definite).toBe(0);
    });
    it('1041530 - should map 0 to definite', () => {
        expect(_EncodingLength[0]).toBe('definite');
    });
    it('1041530 - should have correct forward and reverse mapping for indefinite', () => {
        expect(_EncodingLength.indefinite).toBe(1);
        expect(_EncodingLength[1]).toBe('indefinite');
    });
});
describe('1041530 - Basic Encoding Element 2', () => {
    it('1041530 - constructor should pass provided value to _encode', () => {
        const spy = spyOn(_PdfBasicEncodingElement.prototype as any, '_encode').and.callThrough();
        new _PdfBasicEncodingElement(_TagClassType.universal, _ConstructionType.primitive, _UniversalType.integer, 456);
        expect(spy).toHaveBeenCalledWith(456);
    });
    it('1041530 - constructor should pass provided value to _encode', () => {
        const spy = spyOn(_PdfBasicEncodingElement.prototype as any, '_encode').and.callThrough();
        new _PdfBasicEncodingElement(_TagClassType.universal, _ConstructionType.primitive, _UniversalType.integer, 456);
        expect(spy).toHaveBeenCalledWith(456);
    });
    it('1041530 - constructor should initialize period character code correctly', () => {
        const element: any = new _PdfBasicEncodingElement();
        expect(element._period).toBe('.'.charCodeAt(0));
        expect(element._period).toBe(46);
    });
    it('1041530 - constructor should initialize comma character code correctly', () => {
        const element: any = new _PdfBasicEncodingElement();
        expect(element._comma).toBe(','.charCodeAt(0));
        expect(element._comma).toBe(44);
    });
    it('1041530 - BER bit string should not validate constructed segments for unused bit count', () => {
        const element: any = new _PdfBasicEncodingElement();
        element._construction = _ConstructionType.constructed;
        const child: any = { _construction: _ConstructionType.constructed, _tagClass: element._tagClass, _getTagNumber: () => element._getTagNumber(), _getValue: () => new Uint8Array([1]), _getBitString: () => new Uint8ClampedArray([]) };
        spyOn(element, '_getSequence').and.returnValue([child]);
        expect(() => element._getBitString()).not.toThrow();
    });
    it('1041530 - BER bit string should allow primitive segment with zero unused bits', () => {
        const element: any = new _PdfBasicEncodingElement();
        element._construction = _ConstructionType.constructed;
        const child: any = { _construction: _ConstructionType.primitive, _tagClass: element._tagClass, _getTagNumber: () => element._getTagNumber(), _getValue: () => new Uint8Array([0]), _getBitString: () => new Uint8ClampedArray([]) };
        spyOn(element, '_getSequence').and.returnValue([child]);
        expect(() => element._getBitString()).not.toThrow();
    });
    it('1041530 - BER bit string should ignore constructed segments when checking unused bits', () => {
        const element: any = new _PdfBasicEncodingElement();
        element._construction = _ConstructionType.constructed;
        const child: any = {
            _construction: _ConstructionType.constructed,
            _tagClass: element._tagClass,
            _getTagNumber: () => element._getTagNumber(),
            _getValue: () => new Uint8Array([1]),
            _getBitString: () => new Uint8ClampedArray([])
        };
        spyOn(element, '_getSequence').and.returnValue([child]);
        expect(() => element._getBitString()).not.toThrow();
    });
    it('1041530 - BER bit string should allow empty primitive segment before final part', () => {
        const element: any = new _PdfBasicEncodingElement();
        element._construction = _ConstructionType.constructed;
        const child: any = {
            _construction: _ConstructionType.primitive,
            _tagClass: element._tagClass,
            _getTagNumber: () => element._getTagNumber(),
            _getValue: () => new Uint8Array([]),
            _getBitString: () => new Uint8ClampedArray([])
        };
        spyOn(element, '_getSequence').and.returnValue([child]);
        expect(() => element._getBitString()).not.toThrow();
    });
    it('1041530 - BER bit string should increment recursion count for child elements', () => {
        const parent: any = new _PdfBasicEncodingElement();
        const child: any = new _PdfBasicEncodingElement();
        parent._construction = _ConstructionType.constructed;
        parent._recursionCount = 2;
        spyOn(parent, '_getSequence').and.returnValue([child]);
        child._tagClass = parent._tagClass;
        spyOn(child, '_getTagNumber').and.returnValue(parent._getTagNumber());
        spyOn(child, '_getBitString').and.callFake(() => { expect(child._recursionCount).toBe(3); return new Uint8ClampedArray([]); });
        parent._getBitString();
    });
    it('1041530 - BER getOctetString should serialize with OCTET STRING type', () => {
        const el: any = new _PdfBasicEncodingElement();
        const serializeSpy = spyOn(el, '_serialize').and.returnValue(new Uint8Array([1, 2, 3]));
        el._getOctetString();
        expect(serializeSpy).toHaveBeenCalledWith('OCTET STRING');
    });
    it('1041530 - BER getUtf8String should serialize with UTF8String type', () => {
        const el: any = new _PdfBasicEncodingElement();
        const serializeSpy = spyOn(el, '_serialize').and.returnValue(new Uint8Array([65]));
        el._getUtf8String();
        expect(serializeSpy).toHaveBeenCalledWith('UTF8String');
    });
    it('1041530 - BER getPrintableString should serialize with PrintableString type', () => {
        const el: any = new _PdfBasicEncodingElement();
        const serializeSpy = spyOn(el, '_serialize').and.returnValue(new Uint8Array([65]));
        spyOn(el, '_decodePrintableString').and.returnValue('A');
        const result = el._getPrintableString();
        expect(result).toBe('A');
        expect(serializeSpy).toHaveBeenCalledWith('PrintableString');
    });
    it('1041530 - BER getTeleprinterText should serialize with TeletexString type', () => {
        const el: any = new _PdfBasicEncodingElement();
        const serializeSpy = spyOn(el, '_serialize').and.returnValue(new Uint8Array([65]));
        el._getTeleprinterText();
        expect(serializeSpy).toHaveBeenCalledWith('TeletexString');
    });
    it('1041530 - BER getGeneralString should serialize with GeneralString type', () => {
        const el: any = new _PdfBasicEncodingElement();
        const serializeSpy = spyOn(el, '_serialize').and.returnValue(new Uint8Array([65]));
        spyOn(el, '_decodeGeneralString').and.returnValue('A');
        const result = el._getGeneralString();
        expect(result).toBe('A');
        expect(serializeSpy).toHaveBeenCalledWith('GeneralString');
    });
    it('1041530 - BER getUniversalString should decode non zero second byte correctly', () => {
        const el: any = new _PdfBasicEncodingElement();
        spyOn(el, '_serialize').and.returnValue(new Uint8Array([0x00, 0x01, 0x00, 0x41]));
        const expected = String.fromCharCode((0x00 << 24) + (0x01 << 16) + (0x00 << 8) + 0x41);
        expect(el._getUniversalString()).toEqual(expected);
    });
    it('1041530 - BER getUniversalString should preserve second byte contribution', () => {
        const el: any = new _PdfBasicEncodingElement();
        spyOn(el, '_serialize').and.returnValue(new Uint8Array([0x00, 0x01, 0x00, 0x41]));
        expect(el._getUniversalString()).toBe(String.fromCharCode(0x10041));
    });
    it('1041530 - BER setUniversalString should encode exact number of characters', () => {
        const el: any = new _PdfBasicEncodingElement();
        spyOn(String.prototype, 'charCodeAt').and.callThrough();
        el._setUniversalString('A');
        expect(String.prototype.charCodeAt).toHaveBeenCalledTimes(4);
    });
    it('1041530 - BER setBmpString should encode exact number of characters', () => {
        const el: any = new _PdfBasicEncodingElement();
        const spy = spyOn(String.prototype, 'charCodeAt').and.callThrough();
        el._setBmpString('AB');
        expect(spy).toHaveBeenCalledTimes(2);
    });
    it('1041530 - getInner should include tag number in error message', () => {
        const el: any = new _PdfBasicEncodingElement();
        el._construction = _ConstructionType.constructed;
        el._value = new Uint8Array([1, 2, 3, 4]);
        spyOn(_PdfBasicEncodingElement.prototype, '_fromBytes').and.returnValue(2);
        spyOn(_PdfBasicEncodingElement.prototype, '_getTagNumber').and.returnValue(16);
        expect(() => { el._getInner(false); }).toThrowError(/element was 16/i);
    });
    it('1041530 - fromBytes should allow recursion when recursionCount plus one equals nestingRecursionLimit', () => {
        const element: any = new _PdfBasicEncodingElement();
        element._recursionCount = 0;
        element._nestingRecursionLimit = 1;
        const bytes = new Uint8Array([0x02, 0x01, 0x05]);
        expect(() => element._fromBytes(bytes)).not.toThrow();
    });
    it('1041530 - should throw when long tag number encoding is truncated', () => {
        const element = new _PdfBasicEncodingElement();
        expect(() => { element._fromBytes(new Uint8Array([0x1F, 0x81])); }).toThrowError(/ASN1 tag number appears to have been truncated/);
    });
    it('1041530 - should throw when length bytes are missing after a valid long tag number', () => {
        const element = new _PdfBasicEncodingElement();
        expect(() => {
            element._fromBytes(new Uint8Array([0x1F, 0x1F]));
        }).toThrowError(/Element length bytes appear to have been truncated/);
    });
    it('1041530 - should allow trailing bytes after a valid EOC marker', () => {
        const bytes = new Uint8Array([0x30, 0x80, 0x02, 0x01, 0x05, 0x00, 0x00, 0xFF]);
        const element = new _PdfBasicEncodingElement();
        expect(() => element._fromBytes(bytes)).not.toThrow();
    });
    it('1041530 - should throw when the final EOC byte is non zero', () => {
        const bytes = new Uint8Array([0x30, 0x80, 0x02, 0x01, 0x05, 0x00, 0x01, 0xFF]);
        const element = new _PdfBasicEncodingElement();
        expect(() => element._fromBytes(bytes)).toThrowError(/Invalid format: indefinite-length ASN1 elements must end with an End-of-Content marker/);
    });
    it('1041530 - should include the first tag byte for a primitive universal tag', () => {
        const element = new _PdfBasicEncodingElement();
        element._tagClass = _TagClassType.universal;
        element._construction = _ConstructionType.primitive;
        element._lengthEncodingPreference = _EncodingLength.definite;
        spyOn(element, '_getTagNumber').and.returnValue(2);
        spyOn(element, '_valueLength').and.returnValue(0);
        const result = element._tagAndLengthBytes();
        expect(Array.from(result)).toEqual([0x02, 0x00]);
    });
    it('1041530 - should allow child with different tag class and same tag number', () => {
        const parent = new _PdfBasicEncodingElement();
        const child = new _PdfBasicEncodingElement();
        (parent as any)._construction = _ConstructionType.constructed;
        (parent as any)._tagClass = _TagClassType.context;
        (parent as any)._tagNumber = 5;
        (child as any)._tagClass = _TagClassType.application;
        (child as any)._tagNumber = 5;
        spyOn(parent as any, '_getSequence').and.returnValue([child]);
        expect(() => { (parent as any)._serialize('TEST'); }).not.toThrow();
    });
    it('1041530 - should return empty array without creating elements for empty input', () => {
        const element: any = new _PdfBasicEncodingElement();
        const spy = spyOn(_PdfUniqueEncodingElement.prototype, '_fromBytes').and.callThrough();
        const result = element._decodeSequence(new Uint8Array([]));
        expect(result).toEqual([]);
        expect(spy).not.toHaveBeenCalled();
    });
    it('1041530 - fromSequence should filter undefined elements', () => {
        const valid = new _PdfBasicEncodingElement();
        const helper: any = new _PdfBasicEncodingElement();
        const result: any = helper._fromSequence([valid, undefined, null]);
        const sequence = result._getSequence();
        expect(sequence.length).toBe(1);
        expect(sequence[0]).toBe(valid);
    });
});