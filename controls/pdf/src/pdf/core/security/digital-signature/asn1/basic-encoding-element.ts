import { _PdfAbstractSyntaxElement } from './abstract-syntax';
import { _ConstructionType, _RealEncodingBase, _TagClassType, _UniversalType } from './enumerator';
import { _PdfCharacterString } from './character-string';
import { _convertBytesToText } from './utils';
import { _PdfUniqueEncodingElement } from './unique-encoding-element';
import { _stringToBytes } from '../../../utils';
import { _PdfObjectIdentifier } from './identifier-mapping';
/**
 * Basic BER/DER encoding element providing encoding/decoding helpers for primitive and constructed types.
 *
 * @private
 */
export class _PdfBasicEncodingElement extends _PdfAbstractSyntaxElement {
    /**
     * Preferred length encoding to use when serializing this element.
     *
     * @private
     */
    _lengthEncodingPreference: _EncodingLength = _EncodingLength.definite;
    /**
     * Internal storage for this element's value; may be raw bytes or child elements.
     */
    private _value: Uint8Array | _PdfAbstractSyntaxElement[] = new Uint8Array(0);
    /**
     * Cached current computed value length when available.
     */
    private _currentValueLength: number;
    /**
     * ASCII code for period `.` used by string parsing helpers.
     *
     * @private
     */
    _period: number = '.'.charCodeAt(0);
    /**
     * ASCII code for comma `,` used by string parsing helpers.
     *
     * @private
     */
    _comma: number = ','.charCodeAt(0);
    /**
     * ASCII code for `Z` used by time/date parsing helpers.
     *
     * @private
     */
    _z: number = 'Z'.charCodeAt(0);
    /**
     * ASCII code for plus `+` used by time/date parsing helpers.
     *
     * @private
     */
    _plus: number = '+'.charCodeAt(0);
    /**
     * ASCII code for minus `-` used by time/date parsing helpers.
     *
     * @private
     */
    _minus: number = '-'.charCodeAt(0);
    /**
     * Initializes a basic encoding element with optional tag class, construction, tag number and value.
     *
     * @private
     * @param {_TagClassType} tagClass The tag class for the element.
     * @param {_ConstructionType} construction Whether the element is primitive or constructed.
     * @param {number} tagNumber The numeric tag number.
     * @param {any} value Optional initial value to encode.
     */
    constructor(tagClass: _TagClassType = _TagClassType.universal,
                construction: _ConstructionType = _ConstructionType.primitive,
                tagNumber: number = _UniversalType.endOfContent,
                value: any = undefined) { // eslint-disable-line
        super();
        this._encode(value);
        this._tagClass = tagClass;
        this._construction = construction;
        this._setTagNumber(tagNumber);
    }
    /**
     * Returns the raw value bytes for this element, encoding constructed content if necessary.
     *
     * @private
     * @returns {Uint8Array} The raw value bytes.
     */
    _getValue(): Uint8Array {
        if (this._value instanceof Uint8Array) {
            return this._value;
        }
        const bytes: Uint8Array = this._encodeSequence(this._value);
        this._value = bytes;
        return bytes;
    }
    /**
     * Sets the raw value bytes for this element and updates cached length.
     *
     * @private
     * @param {Uint8Array} value The value bytes to assign.
     * @returns {void} nothing.
     */
    _setValue(value: Uint8Array): void {
        this._currentValueLength = value.length;
        this._value = value;
    }
    /**
     * Decodes and returns the boolean value for this element.
     *
     * @private
     * @returns {boolean} The decoded boolean.
     */
    _getBooleanValue(): boolean {
        if (this._construction !== _ConstructionType.primitive) {
            throw new Error('boolean cannot be constructed.');
        }
        return this._decodeBoolean(this._getValue());
    }
    /**
     * Encodes and sets a boolean value for this element.
     *
     * @private
     * @param {boolean} value The boolean to set.
     * @returns {void} nothing.
     */
    _setBooleanValue(value: boolean): void {
        this._setValue(this._encodeBoolean(value));
    }
    /**
     * Returns the bit string content for this element, concatenating parts if constructed.
     *
     * @private
     * @returns {Uint8ClampedArray} The bit string.
     */
    _getBitString(): Uint8ClampedArray {
        if (this._construction === _ConstructionType.primitive) {
            return this._decodeBitString(this._getValue());
        }
        if ((this._recursionCount + 1) > this._nestingRecursionLimit) {
            throw new Error();
        }
        const appendy: boolean[] = [];
        const substrings: _PdfAbstractSyntaxElement[] = this._getSequence();
        for (const substring of substrings.slice(0, (substrings.length - 1))) {
            const value: Uint8Array = substring._getValue();
            if (substring._construction === _ConstructionType.primitive
                && value.length > 0
                && value[0] !== 0x00) {
                throw new Error(
                    'Only the final part of a multi-part bit string may start with a non-zero value.'
                );
            }
        }
        for (const substring of substrings) {
            if (substring._tagClass !== this._tagClass) {
                throw new Error('Invalid tag class in recursively-encoded bit string.');
            }
            if (substring._getTagNumber() !== this._getTagNumber()) {
                throw new Error('Invalid tag class in recursively-encoded bit string.');
            }
            substring._recursionCount = (this._recursionCount + 1);
            appendy.push(...Array.from(substring._getBitString()).map((b: number) => b !== 0));
        }
        return new Uint8ClampedArray(appendy.map((b: boolean) => (b ? 1 : 0)));
    }
    /**
     * Encodes and sets a bit string value for this element.
     *
     * @private
     * @param {Uint8ClampedArray} value The bit string to assign.
     * @returns {void} nothing.
     */
    _setBitString(value: Uint8ClampedArray): void {
        this._setValue(this._encodeBitString(value));
    }
    /**
     * Returns the octet string bytes for this element.
     *
     * @private
     * @returns {Uint8Array} The octet string bytes.
     */
    _getOctetString(): Uint8Array {
        return this._serialize('OCTET STRING');
    }
    /**
     * Sets the octet string value for this element.
     *
     * @private
     * @param {Uint8Array} value The octet string bytes to assign.
     * @returns {void} nothing.
     */
    _setOctetString(value: Uint8Array): void {
        this._setValue(new Uint8Array(value));
    }
    /**
     * Returns the object descriptor string for this element.
     *
     * @private
     * @returns {string} The object descriptor.
     */
    _getObjectDescriptor(): string {
        const bytes: Uint8Array = this._serialize('ObjectDescriptor');
        return this._decodeObjectDescriptor(bytes);
    }
    /**
     * Encodes and sets the object descriptor string for this element.
     *
     * @private
     * @param {string} value The descriptor to assign.
     * @returns {void} nothing.
     */
    _setObjectDescriptor(value: string): void {
        this._setValue(this._encodeObjectDescriptor(value));
    }
    /**
     * Returns the UTF-8 string value for this element.
     *
     * @private
     * @returns {string} The UTF-8 decoded string.
     */
    _getUtf8String(): string {
        return _convertBytesToText(this._serialize('UTF8String'));
    }
    /**
     * Sets the UTF-8 string value for this element.
     *
     * @private
     * @param {string} value The UTF-8 string to assign.
     * @returns {void} nothing.
     */
    _setUtf8String(value: string): void {
        this._setValue(_stringToBytes(value) as Uint8Array);
    }
    /**
     * Returns the sequence child elements for this constructed element.
     *
     * @private
     * @returns {_PdfAbstractSyntaxElement[]} The sequence elements.
     */
    _getSequence(): _PdfAbstractSyntaxElement[] {
        if (this._construction !== _ConstructionType.constructed) {
            throw new Error('Set or sequence cannot be primitively constructed.');
        }
        if (Array.isArray(this._value)) {
            return this._value;
        }
        return this._decodedSequence(this._getValue());
    }
    /**
     * Sets the sequence child elements for this element and marks it constructed.
     *
     * @private
     * @param {_PdfAbstractSyntaxElement[]} value The sequence elements to assign.
     * @returns {void} nothing.
     */
    _setSequence(value: _PdfAbstractSyntaxElement[]): void {
        this._construct(value);
        this._construction = _ConstructionType.constructed;
    }
    /**
     * Returns the elements for an abstract SET value after uniqueness validation.
     *
     * @private
     * @returns {_PdfAbstractSyntaxElement[]} The set elements.
     */
    _getAbstractSetValue(): _PdfAbstractSyntaxElement[] {
        const ret: _PdfAbstractSyntaxElement[] = this._getSequence();
        if (!this._isUniquelyTagged(ret)) {
            throw new Error('Duplicate tag in Set.');
        }
        return ret;
    }
    /**
     * Sets the elements for an abstract SET value.
     *
     * @private
     * @param {_PdfAbstractSyntaxElement[]} value The set elements to assign.
     * @returns {void} nothing.
     */
    _setAbstractSetValue(value: _PdfAbstractSyntaxElement[]): void {
        this._setSequence(value);
    }
    /**
     * Returns the elements when this is a `SEQUENCE OF`.
     *
     * @private
     * @returns {_PdfAbstractSyntaxElement[]} The sequence-of elements.
     */
    _getSequenceOf(): _PdfAbstractSyntaxElement[] {
        if (this._construction !== _ConstructionType.constructed) {
            throw new Error('Set or sequence cannot be primitively constructed.');
        }
        if (Array.isArray(this._value)) {
            return this._value;
        }
        return this._decodedSequence(this._getValue());
    }
    /**
     * Sets the elements when this is a `SEQUENCE OF` and marks constructed.
     *
     * @private
     * @param {_PdfAbstractSyntaxElement[]} value The elements to assign.
     * @returns {void} nothing.
     */
    _setSequenceOf(value: _PdfAbstractSyntaxElement[]): void {
        this._construct(value);
        this._construction = _ConstructionType.constructed;
    }
    /**
     * Returns the elements when this is a `SET OF`.
     *
     * @private
     * @returns {_PdfAbstractSyntaxElement[]} The set-of elements.
     */
    _getAbstractSetOf():  _PdfAbstractSyntaxElement[] {
        return this._getSequence();
    }
    /**
     * Sets the elements when this is a `SET OF`.
     *
     * @private
     * @param {_PdfAbstractSyntaxElement[]} value The elements to assign.
     * @returns {void} nothing.
     */
    _setAbstractSetOf(value:  _PdfAbstractSyntaxElement[]): void {
        this._setSequence(value);
    }
    /**
     * Returns the numeric string value for this element.
     *
     * @private
     * @returns {string} The numeric string.
     */
    _getNumericString(): string {
        const bytes: Uint8Array = this._serialize('NumericString');
        return this._decodeNumericString(bytes);
    }
    /**
     * Sets the numeric string value for this element.
     *
     * @private
     * @param {string} value The numeric string to assign.
     * @returns {void} nothing.
     */
    _setNumericString(value: string): void {
        this._setValue(this._encodeNumericString(value));
    }
    /**
     * Returns the printable string value for this element.
     *
     * @private
     * @returns {string} The printable string.
     */
    _getPrintableString(): string {
        const bytes: Uint8Array = this._serialize('PrintableString');
        return this._decodePrintableString(bytes);
    }
    /**
     * Sets the printable string value for this element.
     *
     * @private
     * @param {string} value The printable string to assign.
     * @returns {void} nothing.
     */
    _setPrintableString(value: string): void {
        this._setValue(this._encodePrintableString(value));
    }
    /**
     * Returns teleprinter (Teletex) text bytes for this element.
     *
     * @private
     * @returns {Uint8Array} The teleprinter bytes.
     */
    _getTeleprinterText(): Uint8Array {
        return this._serialize('TeletexString');
    }
    /**
     * Sets teleprinter (Teletex) text bytes for this element.
     *
     * @private
     * @param {Uint8Array} value The bytes to assign.
     * @returns {void} nothing.
     */
    _setTeleprinterText(value: Uint8Array): void {
        this._setValue(new Uint8Array(value));
    }
    /**
     * Returns videotex information bytes for this element.
     *
     * @private
     * @returns {Uint8Array} The videotex bytes.
     */
    _getVideoTextInformation(): Uint8Array {
        return this._serialize('VideotexString');
    }
    /**
     * Sets videotex information bytes for this element.
     *
     * @private
     * @param {Uint8Array} value The bytes to assign.
     * @returns {void} nothing.
     */
    _setVideoTextInformation(value: Uint8Array): void {
        this._setValue(new Uint8Array(value));
    }
    /**
     * Returns the IA5 (international alphabet) string for this element.
     *
     * @private
     * @returns {string} The IA5 string.
     */
    _getInternationalAlphabetString(): string {
        return _convertBytesToText(this._serialize('IA5String'));
    }
    /**
     * Sets the IA5 (international alphabet) string for this element.
     *
     * @private
     * @param {string} value The IA5 string to assign.
     * @returns {void} nothing.
     */
    _setInternationalAlphabetString(value: string): void {
        this._setValue(_stringToBytes(value) as Uint8Array);
    }
    /**
     * Returns the graphic string for this element.
     *
     * @private
     * @returns {string} The graphic string.
     */
    _getGraphicString(): string {
        const bytes: Uint8Array = this._serialize('GraphicString');
        return this._decodeGraphicString(bytes);
    }
    /**
     * Sets the graphic string value for this element.
     *
     * @private
     * @param {string} value The graphic string to assign.
     * @returns {void} nothing.
     */
    _setGraphicString(value: string): void {
        this._setValue(this._encodeGraphicString(value));
    }
    /**
     * Returns the visible string for this element.
     *
     * @private
     * @returns {string} The visible string.
     */
    _getVisibleString(): string {
        return this._decodeVisibleString(this._getValue());
    }
    /**
     * Sets the visible string value for this element.
     *
     * @private
     * @param {string} value The visible string to assign.
     * @returns {void} nothing.
     */
    _setVisibleString(value: string): void {
        this._setValue(this._encodeVisibleString(value));
    }
    /**
     * Returns the general string for this element.
     *
     * @private
     * @returns {string} The general string.
     */
    _getGeneralString(): string {
        const bytes: Uint8Array = this._serialize('GeneralString');
        return this._decodeGeneralString(bytes);
    }
    /**
     * Sets a character string (complex structure) for this element and marks it constructed.
     *
     * @private
     * @param {_PdfCharacterString} value The character string structure to assign.
     * @returns {void} nothing.
     */
    _setCharacterString(value: _PdfCharacterString): void {
        this._setValue(this._encodeCharacterString(value));
        this._construction = _ConstructionType.constructed;
    }
    /**
     * Returns the universal (UTF-32) string for this element.
     *
     * @private
     * @returns {string} The universal string.
     */
    _getUniversalString(): string {
        const valueBytes: Uint8Array = this._serialize('UniversalString');
        if (valueBytes.length % 4) {
            throw new Error('Unicode string encoded on non-mulitple of four bytes.');
        }
        let ret: string = '';
        for (let i: number = 0; i < valueBytes.length; i += 4) {
            ret += String.fromCharCode(
                (valueBytes[i + 0] << 24)
                + (valueBytes[i + 1] << 16)
                + (valueBytes[i + 2] <<  8)
                + (valueBytes[i + 3] <<  0)
            );
        }
        return ret;
    }
    /**
     * Sets the universal (UTF-32) string for this element.
     *
     * @private
     * @param {string} value The universal string to assign.
     * @returns {void} nothing.
     */
    _setUniversalString(value: string): void {
        const buf: Uint8Array = new Uint8Array(value.length << 2);
        for (let i: number = 0; i < value.length; i++) {
            buf[(i << 2)]      = value.charCodeAt(i) >>> 24;
            buf[(i << 2) + 1]  = value.charCodeAt(i) >>> 16;
            buf[(i << 2) + 2]  = value.charCodeAt(i) >>> 8;
            buf[(i << 2) + 3]  = value.charCodeAt(i);
        }
        this._setValue(buf);
    }
    /**
     * Returns the BMP (UTF-16BE) string for this element.
     *
     * @private
     * @returns {string} The BMP string.
     */
    _getBmpString(): string {
        const valueBytes: Uint8Array = this._serialize('BMPString');
        if (valueBytes.length % 2 !== 0) {
            throw new Error('BMPString encoded on non-multiple of two bytes.');
        }
        if (typeof TextDecoder !== 'undefined') {
            return new TextDecoder('utf-16be').decode(valueBytes);
        }
        let result: string = '';
        for (let i: number = 0; i < valueBytes.length; i += 2) {
            const code: number = (valueBytes[<number>i] << 8) | valueBytes[i + 1];
            result += String.fromCharCode(code);
        }
        return result;
    }
    /**
     * Sets the BMP (UTF-16BE) string for this element.
     *
     * @private
     * @param {string} value The BMP string to assign.
     * @returns {void} nothing.
     */
    _setBmpString(value: string): void {
        const buf: Uint8Array = new Uint8Array(value.length << 1);
        for (let i: number = 0; i < value.length; i++) {
            const code: number = value.charCodeAt(i);
            buf[i << 1] = code >>> 8;
            buf[(i << 1) + 1] = code & 0xff;
        }
        this._setValue(buf);
    }
    /**
     * Constructs this element from provided child elements (internal helper).
     *
     * @private
     * @param {_PdfAbstractSyntaxElement[]} els The child elements to set.
     * @returns {void} nothing.
     */
    _construct(els: _PdfAbstractSyntaxElement[]): void {
        this._currentValueLength = undefined;
        this._value = els;
    }
    /**
     * Encodes a JavaScript value into the appropriate ASN.1 encoding for this element.
     *
     * @private
     * @param {any} value The value to encode.
     * @returns {void} nothing.
     */
    _encode(value: any): void { // eslint-disable-line
        switch (typeof value) {
        case ('undefined'): {
            this._setValue(new Uint8Array(0));
            break;
        }
        case ('boolean'): {
            this._setTagNumber(_UniversalType.abstractSyntaxBoolean);
            this._setBooleanValue(value);
            break;
        }
        case ('number'): {
            if (Number.isInteger(value)) {
                this._setTagNumber(_UniversalType.integer);
                this._setInteger(value);
            }
            break;
        }
        case ('string'): {
            this._setTagNumber(_UniversalType.utf8String);
            this._setUtf8String(value);
            break;
        }
        case ('object'): {
            if (!value) {
                this._setTagNumber(_UniversalType.nullValue);
                this._setValue(new Uint8Array(0));
            } else if (value instanceof Uint8Array) {
                this._setTagNumber(_UniversalType.octetString);
                this._setOctetString(value);
            } else if (value instanceof Uint8ClampedArray) {
                this._setTagNumber(_UniversalType.bitString);
                this._setBitString(value);
            } else if (value instanceof _PdfAbstractSyntaxElement) {
                this._construction = _ConstructionType.constructed;
                this._setSequence([ value as _PdfBasicEncodingElement ]);
            } else if (Array.isArray(value) &&
                value.every((v: _PdfAbstractSyntaxElement) => v instanceof _PdfAbstractSyntaxElement)) {
                this._construction = _ConstructionType.constructed;
                this._setAbstractSetValue(Array.from(value) as _PdfAbstractSyntaxElement[]);
            } else if (value instanceof _PdfObjectIdentifier) {
                this._setTagNumber(_UniversalType.objectIdentifier);
                this._setObjectIdentifier(value);
            } else if (Array.isArray(value)) {
                this._construction = _ConstructionType.constructed;
                this._setTagNumber(_UniversalType.sequence);
                this._setSequence(value.map((sub: any): _PdfBasicEncodingElement => { // eslint-disable-line
                    const ret: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();
                    ret._encode(sub);
                    return ret;
                }));
            } else {
                throw new Error(`Cannot encode value of type ${value.constructor.name}.`);
            }
            break;
        }
        default: {
            throw new Error(`Cannot encode value of type ${typeof value}.`);
        }
        }
    }
    /**
     * Wraps a BER sequence into a `_PdfBasicEncodingElement` representing a SEQUENCE.
     *
     * @private
     * @param {_PdfAbstractSyntaxElement[]} sequence The sequence elements.
     * @returns {_PdfBasicEncodingElement} The constructed sequence element.
     */
    _fromBerSequence(sequence: (_PdfAbstractSyntaxElement)[]): _PdfBasicEncodingElement {
        const ret: _PdfBasicEncodingElement = new _PdfBasicEncodingElement(
            _TagClassType.universal,
            _ConstructionType.constructed,
            _UniversalType.sequence
        );
        ret._setSequence(sequence.filter((element: _PdfAbstractSyntaxElement) => Boolean(element)) as _PdfBasicEncodingElement[]);
        return ret;
    }
    /**
     * Wraps a set of basic encoding elements into a `_PdfBasicEncodingElement` representing a SET.
     *
     * @private
     * @param {_PdfBasicEncodingElement[]} set The set elements.
     * @returns {_PdfBasicEncodingElement} The constructed set element.
     */
    _fromSet(set: (_PdfBasicEncodingElement)[]): _PdfBasicEncodingElement {
        const ret: _PdfBasicEncodingElement = new _PdfBasicEncodingElement(
            _TagClassType.universal,
            _ConstructionType.constructed,
            _UniversalType.abstractSyntaxSet
        );
        ret._setAbstractSetValue(set.filter((element: _PdfBasicEncodingElement) => Boolean(element)) as _PdfBasicEncodingElement[]);
        return ret;
    }
    /**
     * Wraps a set-of elements into a `_PdfBasicEncodingElement` representing a SET OF.
     *
     * @private
     * @param {_PdfBasicEncodingElement[]} set The set-of elements.
     * @returns {_PdfBasicEncodingElement} The constructed set-of element.
     */
    _fromSetOf(set: (_PdfBasicEncodingElement)[]): _PdfBasicEncodingElement {
        const ret: _PdfBasicEncodingElement = new _PdfBasicEncodingElement(
            _TagClassType.universal,
            _ConstructionType.constructed,
            _UniversalType.abstractSyntaxSet
        );
        ret._setAbstractSetOf(set.filter((element: _PdfBasicEncodingElement) => Boolean(element)) as _PdfBasicEncodingElement[]);
        return ret;
    }
    /**
     * Retrieves the single inner element for explicitly-encoded elements.
     *
     * @private
     * @param {boolean} [isCertificateParsing] Optional flag to relax trailing bytes validation.
     * @returns {_PdfAbstractSyntaxElement} The inner element.
     */
    _getInner(isCertificateParsing?: boolean): _PdfAbstractSyntaxElement {
        if (this._construction !== _ConstructionType.constructed) {
            throw new Error(
                'An explicitly-encoded element cannot be encoded using '
                + 'primitive construction.'
            );
        }
        if (Array.isArray(this._value)) {
            if (this._value.length !== 1) {
                throw new Error(
                    `An explicitly-encoding element contained ${this._value.length} encoded elements.`);
            }
            return this._value[0];
        }
        const ret: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();
        const readBytes: number = ret._fromBytes(this._value);
        if (readBytes !== this._value.length && !isCertificateParsing) {
            throw new Error(
                'An explicitly-encoding element contained more than one single '
                + 'encoded element. The tag number of the first decoded '
                + `element was ${ret._getTagNumber()}, and it was encoded on `
                + `${readBytes} bytes.`
            );
        }
        return ret;
    }
    /**
     * Sets a single inner element and marks this element as constructed.
     *
     * @private
     * @param {_PdfAbstractSyntaxElement} value The inner element to assign.
     * @returns {void} nothing.
     */
    _setInner(value: _PdfAbstractSyntaxElement): void {
        this._construction = _ConstructionType.constructed;
        this._value = [ value ];
    }
    /**
     * Decodes this element from the provided BER/DER bytes and returns number of bytes consumed.
     *
     * @private
     * @param {Uint8Array} bytes The input bytes to decode.
     * @returns {number} The number of bytes consumed.
     */
    _fromBytes(bytes: Uint8Array): number {
        if (bytes.length < 2) {
            throw new Error('Tried to decode a BER element that is less than two bytes.');
        }
        if ((this._recursionCount + 1) > this._nestingRecursionLimit) {
            throw new Error();
        }
        let cursor: number = 0;
        const first: number = bytes[<number>cursor];
        switch (first & 0b11000000) {
        case 0b00000000:
            this._tagClass = _TagClassType.universal;
            break;
        case 0b01000000:
            this._tagClass = _TagClassType.application;
            break;
        case 0b10000000:
            this._tagClass = _TagClassType.context;
            break;
        case 0b11000000:
            this._tagClass = _TagClassType.abstractSyntaxPrivate;
            break;
        }
        this._construction = ((first & 0b00100000) ? _ConstructionType.constructed : _ConstructionType.primitive);
        let tagNumber: number = (first & 0b00011111);
        cursor++;
        if (tagNumber >= 31) {
            if (cursor >= bytes.length) {
                throw new Error('ASN1 tag number appears to have been truncated.');
            }
            if (bytes[<number>cursor] === 0x80) {
                throw new Error('Leading padding byte on long tag number encoding.');
            }
            tagNumber = 0;
            let running: boolean = true;
            while (running) {
                if (cursor >= bytes.length) {
                    throw new Error('ASN1 tag number appears to have been truncated.');
                }
                const b: number = bytes[cursor++];
                tagNumber = (tagNumber << 7) | (b & 0x7F);
                if ((b & 0x80) === 0) {
                    running = false;
                }
            }
            if (tagNumber < 31) {
                throw new Error('ASN1 tag number could have been encoded in short form.');
            }
            this._setTagNumber(tagNumber);
        } else {
            this._setTagNumber(tagNumber);
        }
        if (cursor >= bytes.length) {
            throw new Error('Element length bytes appear to have been truncated.');
        }
        const lenOctet: number = bytes[cursor++];
        if ((lenOctet & 0x80) === 0x80) {
            const numberOfLengthOctets: number = (lenOctet & 0x7F);
            if (numberOfLengthOctets === 0) {
                if (this._construction !== _ConstructionType.constructed) {
                    throw new Error('Invalid format: indefinite-length elements must be constructed, not primitive.');
                }
                const startOfValue: number = cursor;
                let sentinel: number = cursor;
                while (sentinel < bytes.length) {
                    const child: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();
                    sentinel += child._fromBytes(bytes.subarray(sentinel));
                    if (child._tagClass === _TagClassType.universal
                        && child._construction === _ConstructionType.primitive
                        && child._getTagNumber() === _UniversalType.endOfContent
                        && child._getValue().length === 0) {
                        break;
                    }
                }
                if (sentinel === bytes.length &&
                    (bytes[sentinel - 1] !== 0x00 || bytes[sentinel - 2] !== 0x00)) {
                    throw new Error('Invalid format: indefinite-length ASN1 elements must end with an End-of-Content marker');
                }
                this._setValue(bytes.slice(startOfValue, sentinel - 2));
                return sentinel;
            }
            const n: number = numberOfLengthOctets;
            if (cursor + n > bytes.length) {
                throw new Error('Element length bytes appear to have been truncated.');
            }
            let length: number = 0;
            for (let i: number = 0; i < n; i++) {
                length = (length << 8) | bytes[cursor + i];
            }
            cursor += n;
            if ((cursor + length) < cursor) {
                throw new Error('ASN1 element too large.');
            }
            if ((cursor + length) > bytes.length) {
                throw new Error('ASN1 element truncated.');
            }
            this._setValue(bytes.slice(cursor, cursor + length));
            return cursor + length;
        } else {
            const length: number = (lenOctet & 0x7F);
            if ((cursor + length) > bytes.length) {
                throw new Error('ASN1 element was truncated.');
            }
            this._setValue(bytes.slice(cursor, cursor + length));
            return cursor + length;
        }
    }
    /**
     * Computes the number of bytes required to encode the length field for a value length.
     *
     * @private
     * @param {number} [valueLength] Optional explicit value length to evaluate.
     * @returns {number} The number of bytes used to encode the length.
     */
    _lengthLength(valueLength?: number): number {
        if (this._lengthEncodingPreference === _EncodingLength.indefinite) {
            return 1;
        }
        const len: number = (valueLength !== null && typeof valueLength !== 'undefined')
            ? valueLength
            : this._valueLength();
        if (len < 128) {
            return 1;
        }
        let n: number = 0;
        let v: number = len;
        while (v > 0) {
            n++; v >>>= 8;
        }
        return 1 + n;
    }
    /**
     * Returns the length in bytes of this element's encoded value.
     *
     * @private
     * @returns {number} The value length.
     */
    _valueLength(): number {
        if (typeof this._currentValueLength !== 'undefined' && this._currentValueLength !== null && !Array.isArray(this._value)) {
            return this._currentValueLength;
        }
        if (!Array.isArray(this._value)) {
            const value: Uint8Array = this._getValue();
            this._currentValueLength = value.length;
            return value.length;
        }
        let len: number = 0;
        for (const element of this._value as _PdfAbstractSyntaxElement[]) {
            len += (element as any)._tagValueLength(); // eslint-disable-line
        }
        this._currentValueLength = len;
        return len;
    }
    /**
     * Produces the tag and length bytes for this element.
     *
     * @private
     * @returns {Uint8Array} The tag-and-length bytes.
     */
    _tagAndLengthBytes(): Uint8Array {
        const tagBytes: number[] = [0x00];
        tagBytes[0] |= (this._tagClass << 6);
        tagBytes[0] |= ((this._lengthEncodingPreference === _EncodingLength.indefinite) ||
            this._construction === _ConstructionType.constructed) ? (1 << 5) : 0;

        const tagNumber: number = this._getTagNumber();
        if (tagNumber < 31) {
            tagBytes[0] |= tagNumber;
        } else {
            tagBytes[0] |= 0b00011111;
            let number: number = tagNumber;
            const encodedNumber: number[] = [];
            do {
                encodedNumber.unshift(number & 0x7F);
                number >>>= 7;
            } while (number > 0);
            for (let i: number = 0; i < encodedNumber.length - 1; i++) {
                encodedNumber[<number>i] |= 0x80;
            }
            tagBytes.push(...encodedNumber);
        }
        let lengthOctets: number[] = [];
        const valueLen: number = this._valueLength();
        switch (this._lengthEncodingPreference) {
        case _EncodingLength.definite: {
            if (valueLen < 128) {
                lengthOctets = [valueLen];
            } else {
                const octets: number[] = [];
                let v: number = valueLen;
                while (v > 0) {
                    octets.unshift(v & 0xff); v >>>= 8;
                }
                lengthOctets = [0x80 | octets.length, ...octets];
            }
            break;
        }
        case _EncodingLength.indefinite: {
            lengthOctets = [0x80];
            break;
        }
        default:
            throw new Error('An unsupported length encoding preference was detected');
        }
        const ret: Uint8Array = new Uint8Array(tagBytes.length + lengthOctets.length);
        ret.set(tagBytes, 0);
        ret.set(lengthOctets, tagBytes.length);
        return ret;
    }
    /**
     * Serializes this element into an array of buffers representing tag, length and value parts.
     *
     * @private
     * @returns {Uint8Array[]} Array of buffers.
     */
    _toBuffers(): Uint8Array[] {
        const buffers: Uint8Array[] = [];
        buffers.push(this._tagAndLengthBytes());
        if (Array.isArray(this._value)) {
            for (const el of this._value) {
                const subBuffers: Uint8Array[] = el._toBuffers();
                for (const buf of subBuffers) {
                    buffers.push(buf);
                }
            }
        } else {
            buffers.push(this._value);
        }
        if (this._lengthEncodingPreference === _EncodingLength.indefinite) {
            buffers.push(new Uint8Array(2));
        }
        return buffers;
    }
    /**
     * Serializes constructed content into a single value buffer for the provided data type hint.
     *
     * @private
     * @param {string} dataType A textual hint for the data type being serialized.
     * @returns {Uint8Array} The serialized value bytes.
     */
    _serialize(dataType: string): Uint8Array {
        if (this._construction === _ConstructionType.primitive) {
            return this._getValue();
        }
        if ((this._recursionCount + 1) > this._nestingRecursionLimit) {
            throw new Error(`Exceeded recursion limit while deconstructing ${dataType}`);
        }
        const parts: Uint8Array[] = [];
        const substrings: _PdfAbstractSyntaxElement[] = this._getSequence();
        const parentTag: number = this._getTagNumber();
        for (const substring of substrings) {
            if (parentTag === _UniversalType.octetString) {
                if (substring._tagClass !== _TagClassType.universal ||
                    substring._getTagNumber() !== _UniversalType.octetString) {
                    throw new Error('Invalid constructed OCTET STRING: children must be OCTET STRING (tag 4).');
                }
            } else {
                if (substring._tagClass !== this._tagClass ||
                    substring._getTagNumber() !== parentTag) {
                    throw new Error(`Invalid constructed ${dataType}: children must be of the same type as the parent.`);
                }
            }
            substring._recursionCount = this._recursionCount + 1;
            parts.push(substring._getValue());
        }
        const totalLength: number = parts.reduce((sum: number, part: Uint8Array) => sum + part.length, 0);
        const result: Uint8Array = new Uint8Array(totalLength);
        let offset: number = 0;
        for (const part of parts) {
            result.set(part, offset);
            offset += part.length;
        }
        return result;
    }
    /**
     * Returns the component elements when this element represents constructed content.
     *
     * @private
     * @returns {_PdfAbstractSyntaxElement[]} Component elements.
     */
    _getComponents(): _PdfAbstractSyntaxElement[] {
        if (Array.isArray(this._value)) {
            return this._value;
        }
        const encodedElements: _PdfBasicEncodingElement[] = [];
        let i: number = 0;
        while (i < this._value.length) {
            const next: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();
            i += next._fromBytes(this._getValue().subarray(i));
            encodedElements.push(next);
        }
        return encodedElements;
    }
    /**
     * Decodes an ASN.1 BIT STRING from bytes into a bit array.
     *
     * @private
     * @param {Uint8Array} value The bytes to decode.
     * @returns {Uint8ClampedArray} The decoded bit array.
     */
    _decodeBitString(value: Uint8Array): Uint8ClampedArray {
        if (value.length === 0) {
            throw new Error('ASN1 Bit String cannot be encoded on zero bytes!');
        }
        if (value.length === 1 && value[0] !== 0) {
            throw new Error('ASN1 Bit String encoded with deceptive first byte!');
        }
        if (value[0] > 7) {
            throw new Error('First byte of an ASN1 Bit String must be <= 7!');
        }
        const ret: number[] = [];
        for (let i: number = 1; i < value.length; i++) {
            const values: number = value[<number>i];
            ret.push(
                ((values & 0b10000000) ? 1 : 0),
                ((values & 0b01000000) ? 1 : 0),
                ((values & 0b00100000) ? 1 : 0),
                ((values & 0b00010000) ? 1 : 0),
                ((values & 0b00001000) ? 1 : 0),
                ((values & 0b00000100) ? 1 : 0),
                ((values & 0b00000010) ? 1 : 0),
                ((values & 0b00000001) ? 1 : 0)
            );
        }
        ret.length -= value[0];
        return new Uint8ClampedArray(ret);
    }
    /**
     * Decodes an ASN.1 BOOLEAN from bytes.
     *
     * @private
     * @param {Uint8Array} value The bytes to decode.
     * @returns {boolean} The decoded boolean.
     */
    _decodeBoolean(value: Uint8Array): boolean {
        if (value.length !== 1) {
            throw new Error('Invalid Boolean format: Boolean values must be exactly one byte.');
        }
        return (value[0] !== 0);
    }
    /**
     * Decodes a sequence of basic encoding elements from bytes.
     *
     * @private
     * @param {Uint8Array} value The bytes to decode.
     * @returns {_PdfBasicEncodingElement[]} Decoded elements.
     */
    _decodedSequence(value: Uint8Array): _PdfBasicEncodingElement[] {
        const encodedElements: _PdfBasicEncodingElement[] = [];
        let i: number = 0;
        while (i < value.length) {
            const next: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();
            i += next._fromBytes(value.subarray(i));
            encodedElements.push(next);
        }
        return encodedElements;
    }
    /**
     * Determines the numeric base used for REAL encoding from a control byte.
     *
     * @private
     * @param {number} byte The control byte to inspect.
     * @returns {number} The numeric base (2, 8, or 16).
     */
    _getRealEncodingBase(byte: number): number {
        switch (byte & 0b00110000) {
        case _RealEncodingBase.base2:
            return 2;
        case _RealEncodingBase.base8:
            return 8;
        case _RealEncodingBase.base16:
            return 16;
        default:
            throw new Error('Impossible real encoding base encountered.');
        }
    }
    /**
     * Encodes a `_PdfCharacterString` structure into bytes suitable for this element.
     *
     * @private
     * @param {_PdfCharacterString} value The character-string structure to encode.
     * @returns {Uint8Array} The encoded bytes.
     */
    _encodeCharacterString (value: _PdfCharacterString): Uint8Array {
        return this._encodeSequence([
            value._identification,
            new _PdfUniqueEncodingElement(
                _TagClassType.universal,
                _ConstructionType.primitive,
                _UniversalType.octetString,
                value._stringValue
            )
        ]);
    }
    /**
     * Decodes a sequence of unique encoding elements from bytes.
     *
     * @private
     * @param {Uint8Array} value The bytes to decode.
     * @returns {_PdfUniqueEncodingElement[]} Decoded unique elements.
     */
    _decodeSequence(value: Uint8Array): _PdfUniqueEncodingElement[] {
        if (value.length === 0) {
            return [];
        }
        const encodedElements: _PdfUniqueEncodingElement[] = [];
        let i: number = 0;
        while (i < value.length) {
            const next: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
            const consumed: number = next._fromBytes(value.subarray(i));
            i += consumed;
            encodedElements.push(next);
        }
        return encodedElements;
    }
    /**
     * Wraps a sequence of abstract syntax elements into a unique encoding element.
     *
     * @private
     * @param {_PdfAbstractSyntaxElement[]} sequence The sequence elements.
     * @returns {_PdfUniqueEncodingElement} The wrapped unique element.
     */
    _fromSequence(sequence: (_PdfAbstractSyntaxElement)[]): _PdfUniqueEncodingElement {
        const ret: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement(
            _TagClassType.universal,
            _ConstructionType.constructed,
            _UniversalType.sequence
        );
        ret._setSequence(sequence.filter((element: _PdfAbstractSyntaxElement) => Boolean(element)));
        return ret;
    }
    /**
     * Returns the external encoding represented by an encoding element, mapping tag options to values.
     *
     * @private
     * @param {_PdfAbstractSyntaxElement} encodingElement The encoding element describing the external.
     * @returns {_PdfAbstractSyntaxElement|Uint8Array|Uint8ClampedArray} The decoded external payload.
     */
    _getExternalEncoding(encodingElement: _PdfAbstractSyntaxElement): _PdfAbstractSyntaxElement | Uint8Array | Uint8ClampedArray {
        switch (encodingElement._getTagNumber()) {
        case 0:
            return encodingElement._getInner();
        case 1:
            return encodingElement._getOctetString();
        case 2:
            return encodingElement._getBitString();
        default:
            throw new Error(
                'external does not know of an encoding option ' +
                `having tag number ${encodingElement._getTagNumber()}.`
            );
        }
    }
    /**
     * Returns the total encoded length of this element including tag and length fields.
     *
     * @private
     * @returns {number} The combined tag+length+value length in bytes.
     */
    _tagValueLength(): number {
        const value: number = this._valueLength();
        return this._tagLength() + this._lengthLength(value) + value;
    }
}
/**
 * Represents the internal encoding length type used for defining whether the structure
 * uses definite or indefinite length encoding.
 *
 * @private
 */
export enum _EncodingLength {
    definite,
    indefinite,
}
