import { _PdfAbstractSyntaxElement }from './abstract-syntax';
import { _ConstructionType, _TagClassType, _UniversalType} from './enumerator';
import { _PdfCharacterString } from './character-string';
import { _convertBytesToText } from './utils';
import { _handleExplicitConversion, _stringToBytes } from '../../../utils';
import { _PdfObjectIdentifier } from './identifier-mapping';
/**
 * Unique BER/DER encoding element used for encodings that require element uniqueness
 * and provides helpers for serialization and decoding of primitive and constructed values.
 *
 * @private
 */
export class _PdfUniqueEncodingElement extends _PdfAbstractSyntaxElement {
    /**
     * Internal storage for this element's value; may be raw bytes or child elements.
     */
    private _value: Uint8Array | _PdfAbstractSyntaxElement[] = new Uint8Array(0);
    /**
     * Cached current computed value length when available.
     */
    private _currentValueLength: number;
    constructor(
        tagClass: _TagClassType = _TagClassType.universal,
        construction: _ConstructionType = _ConstructionType.primitive,
        tagNumber: number = _UniversalType.endOfContent,
        value: any = undefined, //eslint-disable-line
    ) {
        super();
        this._encode(value);
        this._tagClass = tagClass;
        this._construction = construction;
        this._setTagNumber(tagNumber);
    }
    /**
     * Returns the raw value bytes for this element, handling explicit conversions
     * for primitive encodings and concatenating constructed content when necessary.
     *
     * @private
     * @returns {Uint8Array} The raw value bytes.
     */
    _getValue(): Uint8Array {
        if (Array.isArray(this._value)) {
            const encoded: Uint8Array = this._encodeSequence(this._value as _PdfAbstractSyntaxElement[]);
            this._currentValueLength = encoded.length;
            return encoded;
        }
        const prim: Uint8Array = _handleExplicitConversion(this._value as Uint8Array);
        if (prim !== this._value) {
            this._value = prim;
        }
        this._currentValueLength = prim.length;
        return prim;
    }
    /**
     * Sets the raw value bytes for this element and updates the cached length.
     *
     * @param {Uint8Array} v The value bytes to assign.
     * @returns {void} nothing.
     */
    _setValue(v: Uint8Array): void {
        this._currentValueLength = v.length;
        this._value = v;
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
        if (this._construction !== _ConstructionType.primitive) {
            throw new Error('Bit string cannot be constructed.');
        }
        return this._decodeBitString(this._getValue());
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
        if (this._construction !== _ConstructionType.primitive) {
            throw new Error('Octet string cannot be constructed.');
        }
        return new Uint8Array(this._getValue());
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
        return this._decodeObjectDescriptor(this._getValue());
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
        if (this._construction !== _ConstructionType.primitive) {
            throw new Error('Unicode text cannot be constructed.');
        }
        return _convertBytesToText(this._getValue());
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
        return this._decodeSequence(this._getValue());
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
        this._sortCanonically(value);
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
        return this._decodeSequence(this._getValue());
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
    _getAbstractSetOf(): _PdfAbstractSyntaxElement[] {
        return this._getSequence();
    }
    /**
     * Sets the elements when this is a `SET OF`.
     *
     * @private
     * @param {_PdfAbstractSyntaxElement[]} value The elements to assign.
     * @returns {void} nothing.
     */
    _setAbstractSetOf(value: _PdfAbstractSyntaxElement[]): void {
        this._setSequence(value);
    }
    _getNumericString(): string {
        if (this._construction !== _ConstructionType.primitive) {
            throw new Error('Numeric string cannot be constructed.');
        }
        return this._decodeNumericString(this._getValue());
    }
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
        if (this._construction !== _ConstructionType.primitive) {
            throw new Error('Printable ASCII string cannot be constructed.');
        }
        return this._decodePrintableString(this._getValue());
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
        return this._serialize();
    }
    /**
     * Sets teleprinter text bytes for this element.
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
        return this._getOctetString();
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
        if (this._construction !== _ConstructionType.primitive) {
            throw new Error('ASCII string cannot be constructed.');
        }
        return _convertBytesToText(this._getValue());
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
        if (this._construction !== _ConstructionType.primitive) {
            throw new Error('Graphic string cannot be constructed.');
        }
        return this._decodeGraphicString(this._getValue());
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
     * Returns the universal (UTF-32) string for this element.
     *
     * @private
     * @returns {string} The universal string.
     */
    _getUniversalString(): string {
        const values: Uint8Array = this._getValue();
        if (this._construction !== _ConstructionType.primitive) {
            throw new Error('Universal string cannot be constructed.');
        }
        if (values.length % 4) {
            throw new Error('Universal string encoded on non-mulitple of four bytes.');
        }
        let ret: string = '';
        for (let i: number = 0; i < values.length; i += 4) {
            ret += String.fromCharCode(
                (values[i + 0] << 24)
                + (values[i + 1] << 16)
                + (values[i + 2] <<  8)
                + (values[i + 3] <<  0)
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
        const value: Uint8Array = this._getValue();
        if (this._construction !== _ConstructionType.primitive) {
            throw new Error('BMPString cannot be constructed.');
        }
        if (value.length % 2 !== 0) {
            throw new Error('BMPString encoded on non-multiple of two bytes.');
        }
        if (typeof TextDecoder !== 'undefined') {
            return new TextDecoder('utf-16be').decode(value);
        }
        let result: string = '';
        for (let i: number = 0; i < value.length; i += 2) {
            const code: number = (value[<number>i] << 8) | value[i + 1];
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
            buf[i << 1] = code >> 8;
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
    _encode(value: any): void { //eslint-disable-line
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
                this._setSequence([ value as _PdfUniqueEncodingElement ]);
            } else if (Array.isArray(value)) {
                this._construction = _ConstructionType.constructed;
                this._setTagNumber(_UniversalType.sequence);
                this._setSequence(value.map((sub: any): _PdfUniqueEncodingElement => { //eslint-disable-line
                    const ret: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
                    ret._encode(sub);
                    return ret;
                }));
            } else if (value instanceof _PdfObjectIdentifier) {
                this._setTagNumber(_UniversalType.objectIdentifier);
                this._setObjectIdentifier(value);
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
     * Wraps a set of basic encoding elements into a `_PdfUniqueEncodingElement` representing a SET.
     *
     * @private
     * @param {_PdfAbstractSyntaxElement[]} set The set elements.
     * @returns {_PdfUniqueEncodingElement} The constructed set element.
     */
    _fromSet(set: (_PdfAbstractSyntaxElement)[]): _PdfUniqueEncodingElement {
        const ret: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement(
            _TagClassType.universal,
            _ConstructionType.constructed,
            _UniversalType.abstractSyntaxSet
        );
        ret._setAbstractSetValue(set.filter((element: _PdfAbstractSyntaxElement) => Boolean(element)));
        return ret;
    }
    /**
     * Wraps a set-of elements into a `_PdfUniqueEncodingElement` representing a SET OF.
     *
     * @private
     * @param {_PdfUniqueEncodingElement[]} set The set-of elements.
     * @returns {_PdfUniqueEncodingElement} The constructed set-of element.
     */
    _fromSetOf(set: (_PdfUniqueEncodingElement)[]): _PdfUniqueEncodingElement {
        const ret: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement(
            _TagClassType.universal,
            _ConstructionType.constructed,
            _UniversalType.abstractSyntaxSet
        );
        ret._setAbstractSetOf(set.filter((element: _PdfAbstractSyntaxElement) => Boolean(element)));
        return ret;
    }
    /**
     * Retrieves the single inner element for explicitly-encoded elements.
     *
     * @private
     * @returns {_PdfAbstractSyntaxElement} The inner element.
     */
    _getInner(): _PdfAbstractSyntaxElement {
        if (this._construction !== _ConstructionType.constructed) {
            throw new Error(
                'An explicitly-encoded element cannot be encoded using primitive construction.');
        }
        if (Array.isArray(this._value)) {
            if (this._value.length !== 1) {
                throw new Error(
                    `An explicitly-encoding element contained ${this._value.length} encoded elements.`
                );
            }
            return this._value[0];
        }
        const ret: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
        const readBytes: number = ret._fromBytes(this._value);
        if (readBytes !== this._value.length) {
            throw new Error(
                'An explicitly-encoding element contained more than one single ');
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
     * Decodes this element from the provided DER bytes and returns number of bytes consumed.
     *
     * @private
     * @param {Uint8Array} bytes The input bytes to decode.
     * @returns {number} The number of bytes consumed.
     */
    _fromBytes(bytes: Uint8Array): number {
        if (bytes.length < 2) {
            throw new Error('Tried to decode a DER element that is less than two bytes.');
        }
        let cursor: number = 0;
        switch (bytes[<number>cursor] & 0b11000000) {
        case (0b00000000): this._tagClass = _TagClassType.universal; break;
        case (0b01000000): this._tagClass = _TagClassType.application; break;
        case (0b10000000): this._tagClass = _TagClassType.context; break;
        case (0b11000000): this._tagClass = _TagClassType.abstractSyntaxPrivate; break;
        }
        this._construction = ((bytes[<number>cursor] & 0b00100000)
            ? _ConstructionType.constructed : _ConstructionType.primitive);
        this._setTagNumber((bytes[<number>cursor] & 0b00011111));
        cursor++;
        let tagNumber: number = this._getTagNumber();
        if (tagNumber >= 31) {
            if (bytes[<number>cursor] === 0b10000000) {
                throw new Error('Leading padding byte on long tag number encoding.');
            }
            tagNumber = 0;
            const limit: number = (((bytes.length - 1) >= 4) ? 4 : (bytes.length - 1));
            while (cursor < limit) {
                if (!(bytes[cursor++] & 0b10000000)) {
                    break;
                }
            }
            if (bytes[cursor - 1] & 0b10000000) {
                if (limit === (bytes.length - 1)) {
                    throw new Error('ASN1 tag number appears to have been truncated.');
                } else {
                    throw new Error('ASN1 tag number too large.');
                }
            }
            for (let i: number = 1; i < cursor; i++) {
                tagNumber <<= 7;
                tagNumber |= (bytes[<number>i] & 0x7F);
            }
            if (tagNumber < 31) {
                throw new Error('ASN1 tag number could have been encoded in short form.');
            }
        }
        if ((bytes[<number>cursor] & 0b10000000) === 0b10000000) {
            const numberOfLengthOctets: number = (bytes[<number>cursor] & 0x7F);
            if (numberOfLengthOctets === 0b01111111) { // Reserved
                throw new Error('Length byte with undefined meaning encountered.');
            }
            if (numberOfLengthOctets > 4) {
                throw new Error('Element length too long to decode to an integer.');
            }
            if (cursor + numberOfLengthOctets >= bytes.length) {
                throw new Error('Element length bytes appear to have been truncated.');
            }
            cursor++;
            const lengthNumberOctets: Uint8Array = new Uint8Array(4);
            for (let i: number = numberOfLengthOctets; i > 0; i--) {
                lengthNumberOctets[(4 - i)] = bytes[(cursor + numberOfLengthOctets - i)];
            }
            let length: number = 0;
            lengthNumberOctets.forEach((octet: any) => { //eslint-disable-line
                length <<= 8;
                length += octet;
            });
            if ((cursor + length) < cursor) {
                throw new Error('ASN1 element too large.');
            }
            cursor += (numberOfLengthOctets);
            if ((cursor + length) > bytes.length) {
                throw new Error('ASN1 element truncated.');
            }
            if (((length <= 127 && length >= -128) && numberOfLengthOctets > 1)
                || ((length <= 32767 && length >= -32768) && numberOfLengthOctets > 2)
                || ((length <= 8388607 && length >= -8388608) && numberOfLengthOctets > 3)) {
                throw new Error('DER-encoded long-form length encoded on more octets than necessary');
            }
            this._setValue(bytes.slice(cursor, (cursor + length)));
            return (cursor + length);
        } else {
            const length: number = (bytes[cursor++] & 0x7F);
            if ((cursor + length) > bytes.length) {
                throw new Error('ASN1 element was truncated.');
            }
            this._setValue(bytes.slice(cursor, (cursor + length)));
            return (cursor + length);
        }
    }
    /**
     * Produces the tag and length bytes for this element.
     *
     * @private
     * @returns {Uint8Array} The tag-and-length bytes.
     */
    _tagAndLengthBytes(): Uint8Array {
        const tagNumber: number = this._getTagNumber();
        const first: number = ((this._tagClass & 0x03) << 6) | ((this._construction & 0x01) << 5);
        let tagBytes: number[] = [];
        if (tagNumber < 31) {
            tagBytes = [first | (tagNumber & 0x1f)];
        } else {
            tagBytes = [first | 0x1f];
            const tmp: number[] = [];
            let n: number = tagNumber;
            do {
                tmp.unshift(n & 0x7f); n >>>= 7;
            } while (n > 0);
            for (let i: number = 0; i < tmp.length; i++) {
                tagBytes.push(i < tmp.length - 1 ? (tmp[<number>i] | 0x80) : tmp[<number>i]);
            }
        }
        const lengthOctets: number[] = this._getLengthOctets();
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
        const head: Uint8Array = this._tagAndLengthBytes();
        const out: Uint8Array[] = [head];
        if (Array.isArray(this._value)) {
            for (const el of this._value as _PdfUniqueEncodingElement[]) {
                out.push(...el._toBuffers());
            }
        } else {
            out.push(this._serialize());
        }
        return out;
    }
    /**
     * Serializes constructed or primitive content into a single byte buffer.
     *
     * @private
     * @returns {Uint8Array} The serialized value bytes.
     */
    _serialize(): Uint8Array {
        return new Uint8Array(this._getValue());
    }
    /**
     * Returns the length octets for the current value length.
     *
     * @private
     * @returns {number[]} The length octets.
     */
    _getLengthOctets(): number[] {
        const length: number = this._valueLength();
        if (length < 0x80) {
            return [length];
        }
        const octets: number[] = [];
        let v: number = length;
        while (v > 0) {
            octets.unshift(v & 0xff);
            v >>>= 8;
        }
        return [0x80 | octets.length, ...octets];
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
        const encodedElements: _PdfUniqueEncodingElement[] = [];
        let i: number = 0;
        while (i < this._value.length) {
            const next: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
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
            throw new Error('ASN1 bit string cannot be encoded on zero bytes!');
        }
        if (value.length === 1 && value[0] !== 0) {
            throw new Error('ASN1 bit string encoded with deceptive first byte!');
        }
        if (value[0] > 7) {
            throw new Error('First byte of an ASN1 bit string must be <= 7!');
        }
        const ret: number[] = [];
        for (let i: number = 1; i < value.length; i++) {
            const byte: number = value[<number>i];
            ret.push(
                (byte & 0b10000000) ? 1 : 0,
                (byte & 0b01000000) ? 1 : 0,
                (byte & 0b00100000) ? 1 : 0,
                (byte & 0b00010000) ? 1 : 0,
                (byte & 0b00001000) ? 1 : 0,
                (byte & 0b00000100) ? 1 : 0,
                (byte & 0b00000010) ? 1 : 0,
                (byte & 0b00000001) ? 1 : 0
            );
        }
        const unusedBits: number = value[0];
        const trailingBits: number[] = ret.slice(ret.length - unusedBits);
        for (const bit of trailingBits) {
            if (bit !== 0) {
                throw new Error('bit string had a trailing set bit.');
            }
        }
        ret.length -= unusedBits;
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
        if (value[0] !== 0x00 && value[0] !== 0xff) {
            throw new Error('Boolean must be encoded as 0xFF or 0x00.');
        }
        return value[0] !== 0x00;
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
                'External does not know of an encoding option ' +
                `having tag number ${encodingElement._getTagNumber()}.`
            );
        }
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
            const v: Uint8Array = this._getValue();
            this._currentValueLength = v.length;
            return v.length;
        }
        let len: number = 0;
        for (const el of this._value as _PdfAbstractSyntaxElement[]) {
            len += (el as any)._tagValueLength(); //eslint-disable-line
        }
        this._currentValueLength = len;
        return len;
    }
    /**
     * Computes the number of bytes required to encode the length field for a value length.
     *
     * @private
     * @param {number} [valueLength] Optional explicit value length to evaluate.
     * @returns {number} The number of bytes used to encode the length.
     */
    _lengthLength(valueLength?: number): number {
        const len: number = (valueLength !== null && valueLength !== undefined)
            ? valueLength
            : this._valueLength();
        if (len < 128) {
            return 1;
        }
        let n: number = 0;
        let v: number = len;
        while (v > 0) {
            n++;
            v >>>= 8;
        }
        return 1 + n;
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
