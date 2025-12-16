import { _PdfAbstractSyntaxElement } from './abstract-syntax';
import { _ConstructionType, _RealEncodingBase, _TagClassType, _UniversalType } from './enumerator';
import { _PdfCharacterString } from './character-string';
import { _convertBytesToText } from './utils';
import { _PdfUniqueEncodingElement } from './unique-encoding-element';
import { _stringToBytes } from '../../../utils';
import { _PdfObjectIdentifier } from './identifier-mapping';
export class _PdfBasicEncodingElement extends _PdfAbstractSyntaxElement {
    _lengthEncodingPreference: _EncodingLength = _EncodingLength.definite;
    private _value: Uint8Array | _PdfAbstractSyntaxElement[] = new Uint8Array(0);
    private _currentValueLength: number;
    _period: number = '.'.charCodeAt(0);
    _comma: number = ','.charCodeAt(0);
    _z: number = 'Z'.charCodeAt(0);
    _plus: number = '+'.charCodeAt(0);
    _minus: number = '-'.charCodeAt(0);
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
    _getValue(): Uint8Array {
        if (this._value instanceof Uint8Array) {
            return this._value;
        }
        const bytes: Uint8Array = this._encodeSequence(this._value);
        this._value = bytes;
        return bytes;
    }
    _setValue(value: Uint8Array): void {
        this._currentValueLength = value.length;
        this._value = value;
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
    _setBitString(value: Uint8ClampedArray): void {
        this._setValue(this._encodeBitString(value));
    }
    _getOctetString(): Uint8Array {
        return this._serialize('OCTET STRING');
    }
    _setOctetString(value: Uint8Array): void {
        this._setValue(new Uint8Array(value));
    }
    _getObjectDescriptor(): string {
        const bytes: Uint8Array = this._serialize('ObjectDescriptor');
        return this._decodeObjectDescriptor(bytes);
    }
    _setObjectDescriptor(value: string): void {
        this._setValue(this._encodeObjectDescriptor(value));
    }
    _getUtf8String(): string {
        return _convertBytesToText(this._serialize('UTF8String'));
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
        return this._decodedSequence(this._getValue());
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
        this._setSequence(value);
    }
    _getSequenceOf(): _PdfAbstractSyntaxElement[] {
        if (this._construction !== _ConstructionType.constructed) {
            throw new Error('Set or sequence cannot be primitively constructed.');
        }
        if (Array.isArray(this._value)) {
            return this._value;
        }
        return this._decodedSequence(this._getValue());
    }
    _setSequenceOf(value: _PdfAbstractSyntaxElement[]): void {
        this._construct(value);
        this._construction = _ConstructionType.constructed;
    }
    _getAbstractSetOf():  _PdfAbstractSyntaxElement[] {
        return this._getSequence();
    }
    _setAbstractSetOf(value:  _PdfAbstractSyntaxElement[]): void {
        this._setSequence(value);
    }
    _getNumericString(): string {
        const bytes: Uint8Array = this._serialize('NumericString');
        return this._decodeNumericString(bytes);
    }
    _setNumericString(value: string): void {
        this._setValue(this._encodeNumericString(value));
    }
    _getPrintableString(): string {
        const bytes: Uint8Array = this._serialize('PrintableString');
        return this._decodePrintableString(bytes);
    }
    _setPrintableString(value: string): void {
        this._setValue(this._encodePrintableString(value));
    }
    _getTeleprinterText(): Uint8Array {
        return this._serialize('TeletexString');
    }
    _setTeleprinterText(value: Uint8Array): void {
        this._setValue(new Uint8Array(value));
    }
    _getVideoTextInformation(): Uint8Array {
        return this._serialize('VideotexString');
    }
    _setVideoTextInformation(value: Uint8Array): void {
        this._setValue(new Uint8Array(value));
    }
    _getInternationalAlphabetString(): string {
        return _convertBytesToText(this._serialize('IA5String'));
    }
    _setInternationalAlphabetString(value: string): void {
        this._setValue(_stringToBytes(value) as Uint8Array);
    }
    _getGraphicString(): string {
        const bytes: Uint8Array = this._serialize('GraphicString');
        return this._decodeGraphicString(bytes);
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
    _getGeneralString(): string {
        const bytes: Uint8Array = this._serialize('GeneralString');
        return this._decodeGeneralString(bytes);
    }
    _setCharacterString(value: _PdfCharacterString): void {
        this._setValue(this._encodeCharacterString(value));
        this._construction = _ConstructionType.constructed;
    }
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
    _setBmpString(value: string): void {
        const buf: Uint8Array = new Uint8Array(value.length << 1);
        for (let i: number = 0; i < value.length; i++) {
            const code: number = value.charCodeAt(i);
            buf[i << 1] = code >>> 8;
            buf[(i << 1) + 1] = code & 0xff;
        }
        this._setValue(buf);
    }
    _construct(els: _PdfAbstractSyntaxElement[]): void {
        this._currentValueLength = 0;
        this._value = els;
    }
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
    _fromBerSequence(sequence: (_PdfAbstractSyntaxElement)[]): _PdfBasicEncodingElement {
        const ret: _PdfBasicEncodingElement = new _PdfBasicEncodingElement(
            _TagClassType.universal,
            _ConstructionType.constructed,
            _UniversalType.sequence
        );
        ret._setSequence(sequence.filter((element: _PdfAbstractSyntaxElement) => Boolean(element)) as _PdfBasicEncodingElement[]);
        return ret;
    }
    _fromSet(set: (_PdfBasicEncodingElement)[]): _PdfBasicEncodingElement {
        const ret: _PdfBasicEncodingElement = new _PdfBasicEncodingElement(
            _TagClassType.universal,
            _ConstructionType.constructed,
            _UniversalType.abstractSyntaxSet
        );
        ret._setAbstractSetValue(set.filter((element: _PdfBasicEncodingElement) => Boolean(element)) as _PdfBasicEncodingElement[]);
        return ret;
    }
    _fromSetOf(set: (_PdfBasicEncodingElement)[]): _PdfBasicEncodingElement {
        const ret: _PdfBasicEncodingElement = new _PdfBasicEncodingElement(
            _TagClassType.universal,
            _ConstructionType.constructed,
            _UniversalType.abstractSyntaxSet
        );
        ret._setAbstractSetOf(set.filter((element: _PdfBasicEncodingElement) => Boolean(element)) as _PdfBasicEncodingElement[]);
        return ret;
    }
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
    _setInner(value: _PdfAbstractSyntaxElement): void {
        this._construction = _ConstructionType.constructed;
        this._value = [ value ];
    }
    _fromBytes(bytes: Uint8Array): number {
        if (bytes.length < 2) {
            throw new Error('Tried to decode a BER element that is less than two bytes.');
        }
        if ((this._recursionCount + 1) > this._nestingRecursionLimit) {
            throw new Error();
        }
        let cursor: number = 0;
        switch (bytes[<number>cursor] & 0b11000000) {
        case (0b00000000):
            this._tagClass = _TagClassType.universal;
            break;
        case (0b01000000):
            this._tagClass = _TagClassType.application;
            break;
        case (0b10000000):
            this._tagClass = _TagClassType.context;
            break;
        case (0b11000000):
            this._tagClass = _TagClassType.abstractSyntaxPrivate;
            break;
        }
        this._construction = ((bytes[<number>cursor] & 0b00100000)
            ? _ConstructionType.constructed : _ConstructionType.primitive);
        this._setTagNumber((bytes[<number>cursor] & 0b00011111));
        cursor++;
        if (this._getTagNumber() >= 31) {
            if (bytes[<number>cursor] === 0b10000000) {
                throw new Error('Leading padding byte on long tag number encoding.');
            }
            this._setTagNumber(0);
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
        }
        if ((bytes[<number>cursor] & 0b10000000) === 0b10000000) {
            const numberOfLengthOctets: number = (bytes[<number>cursor] & 0x7F);
            if (numberOfLengthOctets) {
                if (numberOfLengthOctets === 0b01111111) {
                    throw new Error('Length byte with undefined meaning encountered.');
                }
                if (numberOfLengthOctets > 4) {
                    throw new Error(`Element length too long to decode to an integer. Content octets occupied ${numberOfLengthOctets} bytes.`);
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
                lengthNumberOctets.forEach((octet: any) => { // eslint-disable-line
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
                this._setValue(bytes.slice(cursor, (cursor + length)));
                return (cursor + length);
            } else {
                if (this._construction !== _ConstructionType.constructed) {
                    throw new Error(
                        'Invalid format: indefinite-length elements must be constructed, not primitive.');
                }
                const startOfValue: number = ++cursor;
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
                if (sentinel === bytes.length && (bytes[sentinel - 1] !== 0x00 || bytes[sentinel - 2] !== 0x00)) {
                    throw new Error(
                        'Invalid format: indefinite-length ASN1 elements must end with an End-of-Content marker');
                }
                this._setValue(bytes.slice(startOfValue, (sentinel - 2)));
                return sentinel;
            }
        } else {
            const length: number = (bytes[cursor++] & 0x7F);
            if ((cursor + length) > bytes.length) {
                throw new Error('ASN1 element was truncated.');
            }
            this._setValue(bytes.slice(cursor, (cursor + length)));
            return (cursor + length);
        }
    }
    _lengthLength(valueLength?: number): number {
        if (this._lengthEncodingPreference === _EncodingLength.indefinite) {
            return 1;
        }
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
    _tagAndLengthBytes (): Uint8Array {
        const tagBytes: number[] = [ 0x00 ];
        tagBytes[0] |= (this._tagClass << 6);
        tagBytes[0] |= (
            (this._lengthEncodingPreference === _EncodingLength.indefinite)
            || this._construction === _ConstructionType.constructed) ? (1 << 5) : 0;
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
        let lengthOctets: number[] = [ 0x00 ];
        const value: number = this._valueLength();
        switch (this._lengthEncodingPreference) {
        case (_EncodingLength.definite): {
            if (value < 127) {
                lengthOctets[0] = value;
            } else {
                lengthOctets = [ 0, 0, 0, 0 ];
                for (let i: number = 0; i < 4; i++) {
                    lengthOctets[<number>i] = ((value >>> ((3 - i) << 3)) & 0xFF);
                }
                let startOfNonPadding: number = 0;
                for (let i: number = 0; i < (lengthOctets.length - 1); i++) {
                    if (lengthOctets[<number>i] === 0x00) {
                        startOfNonPadding++;
                    }
                }
                lengthOctets = lengthOctets.slice(startOfNonPadding);
                lengthOctets.unshift(0b10000000 | lengthOctets.length);
            }
            break;
        }
        case (_EncodingLength.indefinite): {
            lengthOctets = [ 0b10000000 ];
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
    _serialize(dataType: string): Uint8Array {
        if (this._construction === _ConstructionType.primitive) {
            return this._getValue();
        }
        if ((this._recursionCount + 1) > this._nestingRecursionLimit) {
            throw new Error(`Exceeded recursion limit while deconstructing ${dataType}`);
        }
        const parts: Uint8Array[] = [];
        const substrings: _PdfAbstractSyntaxElement[] = this._getSequence();
        for (const substring of substrings) {
            if (substring._tagClass !== _TagClassType.universal) {
                throw new Error(`Invalid tag class in constructed ${dataType}. Must be universal`);
            }
            if (substring._getTagNumber() !== _UniversalType.octetString) {
                throw new Error(`Invalid tag number in constructed ${dataType}. Must be 4 (Octet string).`);
            }
            substring._recursionCount = this._recursionCount + 1;
            parts.push(substring._serialize(dataType));
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
    _decodeBoolean(value: Uint8Array): boolean {
        if (value.length !== 1) {
            throw new Error('Invalid Boolean format: Boolean values must be exactly one byte.');
        }
        return (value[0] !== 0);
    }
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
                'external does not know of an encoding option ' +
                `having tag number ${encodingElement._getTagNumber()}.`
            );
        }
    }
}
export enum _EncodingLength {
    definite,
    indefinite,
}
