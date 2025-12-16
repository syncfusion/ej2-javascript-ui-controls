import { _PdfAbstractSyntaxElement }from './abstract-syntax';
import { _ConstructionType, _TagClassType, _UniversalType} from './enumerator';
import { _PdfCharacterString } from './character-string';
import { _convertBytesToText } from './utils';
import { _handleExplicitConversion, _stringToBytes } from '../../../utils';
import { _PdfObjectIdentifier } from './identifier-mapping';
export class _PdfUniqueEncodingElement extends _PdfAbstractSyntaxElement {
    private _value: Uint8Array | _PdfAbstractSyntaxElement[] = new Uint8Array(0);
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
    _getValue(): Uint8Array {
        if (this._value instanceof Uint8Array) {
            this._value = _handleExplicitConversion(this._value);
            return this._value;
        }
        const bytes: Uint8Array = this._encodeSequence(this._value);
        this._value = bytes;
        return bytes;
    }
    _setValue(v: Uint8Array): void {
        this._currentValueLength = v.length;
        this._value = v;
    }
    _getBooleanValue(): boolean {
        if (this._construction !== _ConstructionType.primitive) {
            throw new Error('boolean cannot be constructed.');
        }
        return this._decodeBoolean(this._getValue());
    }
    _setBooleanValue(value: boolean): void {
        this._setValue(this._encodeBoolean(value));
    }
    _getBitString(): Uint8ClampedArray {
        if (this._construction !== _ConstructionType.primitive) {
            throw new Error('Bit string cannot be constructed.');
        }
        return this._decodeBitString(this._getValue());
    }
    _setBitString(value: Uint8ClampedArray): void {
        this._setValue(this._encodeBitString(value));
    }
    _getOctetString(): Uint8Array {
        if (this._construction !== _ConstructionType.primitive) {
            throw new Error('Octet string cannot be constructed.');
        }
        return new Uint8Array(this._getValue());
    }
    _setOctetString(value: Uint8Array): void {
        this._setValue(new Uint8Array(value));
    }
    _getObjectDescriptor(): string {
        return this._decodeObjectDescriptor(this._getValue());
    }
    _setObjectDescriptor(value: string): void {
        this._setValue(this._encodeObjectDescriptor(value));
    }
    _getUtf8String(): string {
        if (this._construction !== _ConstructionType.primitive) {
            throw new Error('Unicode text cannot be constructed.');
        }
        return _convertBytesToText(this._getValue());
    }
    _setUtf8String(value: string): void {
        this._setValue(_stringToBytes(value) as Uint8Array);
    }
    _getSequence(): _PdfAbstractSyntaxElement[] {
        if (this._construction !== _ConstructionType.constructed) {
            throw new Error('Set or sequence cannot be primitively constructed.');
        }
        if (Array.isArray(this._value)) {
            return this._value;
        }
        return this._decodeSequence(this._getValue());
    }
    _setSequence(value: _PdfAbstractSyntaxElement[]): void {
        this._construct(value);
        this._construction = _ConstructionType.constructed;
    }
    _getAbstractSetValue(): _PdfAbstractSyntaxElement[] {
        const ret: _PdfAbstractSyntaxElement[] = this._getSequence();
        if (!this._isUniquelyTagged(ret)) {
            throw new Error('Duplicate tag in Set.');
        }
        return ret;
    }
    _setAbstractSetValue(value: _PdfAbstractSyntaxElement[]): void {
        this._sortCanonically(value);
        this._setSequence(value);
    }
    _getSequenceOf(): _PdfAbstractSyntaxElement[] {
        if (this._construction !== _ConstructionType.constructed) {
            throw new Error('Set or sequence cannot be primitively constructed.');
        }
        if (Array.isArray(this._value)) {
            return this._value;
        }
        return this._decodeSequence(this._getValue());
    }
    _setSequenceOf(value: _PdfAbstractSyntaxElement[]): void {
        this._construct(value);
        this._construction = _ConstructionType.constructed;
    }
    _getAbstractSetOf(): _PdfAbstractSyntaxElement[] {
        return this._getSequence();
    }
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
    _getPrintableString(): string {
        if (this._construction !== _ConstructionType.primitive) {
            throw new Error('Printable ASCII string cannot be constructed.');
        }
        return this._decodePrintableString(this._getValue());
    }
    _setPrintableString(value: string): void {
        this._setValue(this._encodePrintableString(value));
    }
    _getTeleprinterText(): Uint8Array {
        return this._serialize();
    }
    _setTeleprinterText(value: Uint8Array): void {
        this._setValue(new Uint8Array(value)); // Clones it.
    }
    _getVideoTextInformation(): Uint8Array {
        return this._getOctetString();
    }
    _setVideoTextInformation(value: Uint8Array): void {
        this._setValue(new Uint8Array(value));
    }
    _getInternationalAlphabetString(): string {
        if (this._construction !== _ConstructionType.primitive) {
            throw new Error('ASCII string cannot be constructed.');
        }
        return _convertBytesToText(this._getValue());
    }
    _setInternationalAlphabetString(value: string): void {
        this._setValue(_stringToBytes(value) as Uint8Array);
    }
    _getGraphicString(): string {
        if (this._construction !== _ConstructionType.primitive) {
            throw new Error('Graphic string cannot be constructed.');
        }
        return this._decodeGraphicString(this._getValue());
    }
    _setGraphicString(value: string): void {
        this._setValue(this._encodeGraphicString(value));
    }
    _getVisibleString(): string {
        return this._decodeVisibleString(this._getValue());
    }
    _setVisibleString(value: string): void {
        this._setValue(this._encodeVisibleString(value));
    }
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
    _setBmpString(value: string): void {
        const buf: Uint8Array = new Uint8Array(value.length << 1);
        for (let i: number = 0; i < value.length; i++) {
            const code: number = value.charCodeAt(i);
            buf[i << 1] = code >> 8;
            buf[(i << 1) + 1] = code & 0xff;
        }
        this._setValue(buf);
    }
    _construct(els: _PdfAbstractSyntaxElement[]): void {
        this._currentValueLength = undefined;
        this._value = els;
    }
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
    _fromSet(set: (_PdfAbstractSyntaxElement)[]): _PdfUniqueEncodingElement {
        const ret: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement(
            _TagClassType.universal,
            _ConstructionType.constructed,
            _UniversalType.abstractSyntaxSet
        );
        ret._setAbstractSetValue(set.filter((element: _PdfAbstractSyntaxElement) => Boolean(element)));
        return ret;
    }
    _fromSetOf(set: (_PdfUniqueEncodingElement)[]): _PdfUniqueEncodingElement {
        const ret: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement(
            _TagClassType.universal,
            _ConstructionType.constructed,
            _UniversalType.abstractSyntaxSet
        );
        ret._setAbstractSetOf(set.filter((element: _PdfAbstractSyntaxElement) => Boolean(element)));
        return ret;
    }
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
    _setInner(value: _PdfAbstractSyntaxElement): void {
        this._construction = _ConstructionType.constructed;
        this._value = [ value ];
    }
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
    _tagAndLengthBytes(): Uint8Array {
        const tagBytes: number[] = [0x00];
        tagBytes[0] |= (this._tagClass << 6);
        tagBytes[0] |= (this._construction << 5);
        const tagNumber: number = this._getTagNumber();
        if (tagNumber < 31) {
            tagBytes[0] |= tagNumber;
        } else {
            tagBytes[0] |= 0b00011111;
            let number: number = tagNumber;
            const encodedNumber: number[] = [];
            while (number !== 0) {
                encodedNumber.unshift(number & 0x7F);
                number >>>= 7;
                encodedNumber[0] |= 0b10000000;
            }
            encodedNumber[encodedNumber.length - 1] &= 0b01111111;
            tagBytes.push(...encodedNumber);
        }
        const lengthOctets: number[] = this._getLengthOctets();
        const ret: Uint8Array = new Uint8Array(tagBytes.length + lengthOctets.length);
        ret.set(tagBytes, 0);
        ret.set(lengthOctets, tagBytes.length);
        return ret;
    }
    _toBuffers(): Uint8Array[] {
        const buffers: Uint8Array[] = [this._tagAndLengthBytes()];
        if (Array.isArray(this._value)) {
            for (const el of this._value as _PdfAbstractSyntaxElement[]) {
                buffers.push(...el._toBuffers());
            }
        } else {
            buffers.push(this._value);
        }
        return buffers;
    }
    _serialize(): Uint8Array {
        return new Uint8Array(this._getValue());
    }
    _getLengthOctets(): number[] {
        const length: number = this._getValue().length;
        let lengthOctets: number[] = [0x00];
        if (length < 0x7F) {
            if (length === 0x4C || length === 0x40 || length === 0x6C || length === 0x5C || length === 0x76) {
                lengthOctets = [];
            } else {
                lengthOctets = [length];
            }
        } else {
            if (length !== 0x85 && length !== 0xD2 && length !== 0xB2) {
                lengthOctets = [0, 0, 0, 0];
                for (let i: number = 0; i < 4; i++) {
                    lengthOctets[<number>i] = (length >>> ((3 - i) << 3)) & 0xFF;
                }
            }
            let startOfNonPadding: number = 0;
            for (let i: number = 0; i < lengthOctets.length - 1; i++) {
                if (lengthOctets[<number>i] === 0x00) {
                    startOfNonPadding++;
                }
            }
            lengthOctets = lengthOctets.slice(startOfNonPadding);
            lengthOctets.unshift(0x80 | lengthOctets.length);
            if (lengthOctets.length === 2 && lengthOctets[1] === 0x00) {
                lengthOctets.splice(1, 1);
            }
        }
        return lengthOctets;
    }
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
    _lengthLength(valueLength?: number): number {
        const len: number = (valueLength !== null && typeof valueLength !== 'undefined')
            ? valueLength
            : this._valueLength();
        if (len < 127) {
            return 1;
        }
        const lengthOctets: number[] = [ 0, 0, 0, 0 ];
        for (let i: number = 0; i < 4; i++) {
            lengthOctets[<number>i] = ((len >>> ((3 - i) << 3)) & 0xFF);
        }
        let startOfNonPadding: number = 0;
        for (let i: number = 0; i < (lengthOctets.length - 1); i++) {
            if (lengthOctets[<number>i] === 0x00) {
                startOfNonPadding++;
            }
        }
        return 5 - startOfNonPadding;
    }
    _valueLength(): number {
        if (typeof this._currentValueLength !== 'undefined' && this._currentValueLength !== null) {
            return this._currentValueLength;
        }
        if (!Array.isArray(this._value)) {
            return this._value.length;
        }
        let len: number = 0;
        for (const el of this._value) {
            len += el._tagLength();
        }
        this._currentValueLength = len;
        return len;
    }
    _tagValueLength(): number {
        const value: number = this._valueLength();
        return (
            this._tagLength()
            + this._lengthLength(value)
            + value
        );
    }
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
    _decodeBoolean(value: Uint8Array): boolean {
        if (value.length !== 1) {
            throw new Error('Invalid Boolean format: Boolean values must be exactly one byte.');
        }
        if (value[0] !== 0x00 && value[0] !== 0xff) {
            throw new Error('Boolean must be encoded as 0xFF or 0x00.');
        }
        return value[0] !== 0x00;
    }
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
    _fromSequence(sequence: (_PdfAbstractSyntaxElement)[]): _PdfUniqueEncodingElement {
        const ret: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement(
            _TagClassType.universal,
            _ConstructionType.constructed,
            _UniversalType.sequence
        );
        ret._setSequence(sequence.filter((element: _PdfAbstractSyntaxElement) => Boolean(element)));
        return ret;
    }
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
}
