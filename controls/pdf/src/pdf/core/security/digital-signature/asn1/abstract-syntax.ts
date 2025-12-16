import { _padStart, _stringToBytes } from '../../../utils';
import { _ConstructionType, _TagClassType, _UniversalType } from './enumerator';
import { _PdfObjectIdentifier } from './identifier-mapping';
import { _bufferToInteger, _convertBytesToText, _integerToBuffer, _packBits } from './utils';
import { _isGeneralCharacter, _isGraphicCharacter, _isPrintableCharacter, _validateDate, _validateDateTime, _validateTime, isNumericString } from './syntax-verifier';
export abstract class _PdfAbstractSyntaxElement {
    _recursionCount: number = 0;
    _nestingRecursionLimit: number = 5;
    _name: string = '';
    _tagClass: _TagClassType = _TagClassType.universal;
    _construction: _ConstructionType = _ConstructionType.primitive;
    private _tagNumber: number = 0;
    abstract _getValue(): Uint8Array;
    abstract _setValue(value: Uint8Array): void;
    abstract _getBooleanValue(): boolean;
    abstract _setBooleanValue(value: boolean): void;
    abstract _getBitString(): Uint8ClampedArray;
    abstract _setBitString(value: Uint8ClampedArray): void;
    abstract _getOctetString(): Uint8Array;
    abstract _setOctetString(value: Uint8Array): void;
    abstract _getObjectDescriptor(): string;
    abstract _setObjectDescriptor(value: string): void;
    abstract _getUtf8String(): string;
    abstract _setUtf8String(value: string): void;
    abstract _getSequence(): _PdfAbstractSyntaxElement[];
    abstract _setSequence(value: _PdfAbstractSyntaxElement[]): void;
    abstract _getAbstractSetValue(): _PdfAbstractSyntaxElement[];
    abstract _setAbstractSetValue(value: _PdfAbstractSyntaxElement[]): void;
    abstract _getSequenceOf(): _PdfAbstractSyntaxElement[];
    abstract _setSequenceOf(value: _PdfAbstractSyntaxElement[]): void;
    abstract _getAbstractSetOf(): _PdfAbstractSyntaxElement[];
    abstract _setAbstractSetOf(value: _PdfAbstractSyntaxElement[]): void;
    abstract _getNumericString(): string;
    abstract _setNumericString(value: string): void;
    abstract _getPrintableString(): string;
    abstract _setPrintableString(value: string): void;
    abstract _getTeleprinterText(): Uint8Array;
    abstract _setTeleprinterText(value: Uint8Array): void;
    abstract _getVideoTextInformation(): Uint8Array;
    abstract _setVideoTextInformation(value: Uint8Array): void;
    abstract _getInternationalAlphabetString(): string;
    abstract _setInternationalAlphabetString(value: string): void;
    abstract _getGraphicString(): string;
    abstract _setGraphicString(value: string): void;
    abstract _getVisibleString(): string;
    abstract _setVisibleString(value: string): void;
    abstract _getUniversalString(): string;
    abstract _setUniversalString(value: string): void;
    abstract _getBmpString(): string;
    abstract _setBmpString(value: string): void;
    abstract _getInner(): _PdfAbstractSyntaxElement;
    abstract _getComponents(): _PdfAbstractSyntaxElement[];
    abstract _fromBytes(bytes: Uint8Array): number;
    abstract _construct(els: _PdfAbstractSyntaxElement[]): void;
    abstract _tagAndLengthBytes(): Uint8Array;
    abstract _toBuffers(): Uint8Array[];
    abstract _lengthLength(valueLength?: number): number;
    abstract _valueLength(): number;
    abstract _serialize(dataType: string): Uint8Array;
    _getTagNumber(): number {
        return this._tagNumber;
    }
    _setTagNumber(value: number): void {
        if (!Number.isSafeInteger(value) || value < 0) {
            throw new Error(`Tag ${value} was not a non-negative number.`);
        }
        this._tagNumber = value;
    }
    _getLength(): number {
        const value: Uint8Array = this._getValue();
        return value.length;
    }
    _tagLength(): number {
        const tagNumber: number = this._getTagNumber();
        if (tagNumber < 31) {
            return 1;
        }
        let n: number = tagNumber;
        let i: number = 0;
        while (n !== 0) {
            n >>>= 7;
            i++;
        }
        return i;
    }
    _toBytes(): Uint8Array {
        const buffers: Uint8Array[] = this._toBuffers();
        const totalLength: number = buffers.reduce((sum: number, arr: Uint8Array) => sum + arr.length, 0);
        const result: Uint8Array = new Uint8Array(totalLength);
        let offset: number = 0;
        for (const buffer of buffers) {
            result.set(buffer, offset);
            offset += buffer.length;
        }
        if (result.length >= 4 && result[0] === 48 && result[1] === 130) {
            const actualContentLength: number = result.length - 4;
            const lengthHigh: number = (actualContentLength >> 8) & 0xFF;
            const lengthLow: number = actualContentLength & 0xFF;
            result[2] = lengthHigh;
            result[3] = lengthLow;
        }
        return result;
    }
    _validateSize(name: string, units: string, actualSize: number, min: number, max?: number): void {
        const effectiveMax: number = typeof max === 'undefined' ? Infinity : max;
        if (actualSize < min) {
            throw new Error(
                `${name} must be at least ${min} ${units}, but was ${actualSize} ${units}.`
            );
        }
        if (actualSize > effectiveMax) {
            throw new Error(
                `${name} must not exceed ${effectiveMax} ${units}, but was ${actualSize} ${units}.`
            );
        }
    }
    _validateRange(name: string, actualValue: bigint | number, min: bigint, max?: bigint): void {
        if (actualValue < min) {
            throw new Error(
                `${name} must be at least ${min}, but was ${actualValue}.`
            );
        }
        if (typeof max !== 'undefined' && max !== null && actualValue > max) {
            throw new Error(
                `${name} must not exceed ${max}, but was ${actualValue}.`
            );
        }
    }
    _sizeConstrainedString(min: number, max?: number): Uint8ClampedArray {
        const bitString: Uint8ClampedArray = this._getBitString();
        const ret: Uint8ClampedArray = bitString;
        this._validateSize(this._name || 'Bit string', 'bits', ret.length, min, max);
        return ret;
    }
    _sizeConstrainedUtf8String(min: number, max?: number): string {
        const utf8String: string = this._getUtf8String();
        const ret: string = utf8String;
        this._validateSize(this._name || 'Unicode string', 'characters', ret.length, min, max);
        return ret;
    }
    _sizeConstrainedSequenceOf(min: number, max?: number): _PdfAbstractSyntaxElement[] {
        const sequenceOf: _PdfAbstractSyntaxElement[] = this._getSequenceOf();
        const ret: _PdfAbstractSyntaxElement[] = sequenceOf;
        this._validateSize(this._name || 'Sequence of', 'elements', ret.length, min, max);
        return ret;
    }
    _sizeConstrainedSetOf(min: number, max?: number): _PdfAbstractSyntaxElement[] {
        const sequenceOf: _PdfAbstractSyntaxElement[] = this._getSequenceOf();
        this._validateSize(this._name || 'Set of', 'elements', sequenceOf.length, min, max);
        return sequenceOf;
    }
    _sizeConstrainedNumericString(min: number, max?: number): string {
        const ret: string = this._getNumericString();
        this._validateSize(this._name || 'Numeric string', 'characters', ret.length, min, max);
        return ret;
    }
    _sizeConstrainedPrintableString(min: number, max?: number): string {
        const ret: string = this._getPrintableString();
        this._validateSize(this._name || 'Printable ASCII string', 'characters', ret.length, min, max);
        return ret;
    }
    _sizeConstrainedTextString(min: number, max?: number): Uint8Array {
        const ret: Uint8Array = this._getTeleprinterText();
        this._validateSize(this._name || 'Legacy encoded string', 'characters', ret.length, min, max);
        return ret;
    }
    _sizeConstrainedVideoString(min: number, max?: number): Uint8Array {
        const ret: Uint8Array = this._getVideoTextInformation();
        this._validateSize(this._name || 'Videotex string', 'characters', ret.length, min, max);
        return ret;
    }
    _sizeConstrainedIA5String(min: number, max?: number): string {
        const ret: string = this._getInternationalAlphabetString();
        this._validateSize(this._name || 'ASCII string', 'characters', ret.length, min, max);
        return ret;
    }
    _sizeConstrainedGraphicString(min: number, max?: number): string {
        const ret: string = this._getGraphicString();
        this._validateSize(this._name || 'Graphic string', 'characters', ret.length, min, max);
        return ret;
    }
    _sizeConstrainedVisibleString(min: number, max?: number): string {
        const ret: string = this._getVisibleString();
        this._validateSize(this._name || 'Visible string', 'characters', ret.length, min, max);
        return ret;
    }
    _sizeConstrainedUniversalString(min: number, max?: number): string {
        const ret: string = this._getUniversalString();
        this._validateSize(this._name || 'Unicode string', 'characters', ret.length, min, max);
        return ret;
    }
    _rangeConstrainedNumber(min: bigint, max?: bigint): number {
        const ret: number = this._getInteger();
        this._validateRange(this._name || 'Number', ret, min, max);
        return ret;
    }
    _validateTag(
        permittedClasses: _TagClassType[],
        permittedConstruction: _ConstructionType[],
        permittedNumbers: number[]
    ): number {
        if (permittedClasses.indexOf(this._tagClass) === -1) {
            return -1;
        } else if (permittedConstruction.indexOf(this._construction) === -1) {
            return -2;
        } else if (permittedNumbers.indexOf(this._getTagNumber()) === -1) {
            return -3;
        } else {
            return 0;
        }
    }
    _toElement(): _PdfAbstractSyntaxElement {
        return this;
    }
    _fromElement(el: _PdfAbstractSyntaxElement): void {
        this._tagClass = el._tagClass;
        this._construction = el._construction;
        const tagNumber: number = el._getTagNumber();
        this._setTagNumber(tagNumber);
        const value: Uint8Array = el._getValue();
        this._setValue(value);
    }
    _toString(): string {
        if (this._tagClass === _TagClassType.universal) {
            const tagNumber: number = this._getTagNumber();
            switch (tagNumber) {
            case _UniversalType.endOfContent: return 'END-OF-CONTENT';
            case _UniversalType.abstractSyntaxBoolean: return this._getBooleanValue() ? 'TRUE' : 'FALSE';
            case _UniversalType.integer: return this._getInteger().toString();
            case _UniversalType.octetString:
                return `'${Array
                    .from(this._getOctetString())
                    .map((byte: number) => _padStart(byte.toString(16), 2, '0'))
                    .join('')}'H`;
            case _UniversalType.nullValue: return 'NULL';
            case _UniversalType.objectIdentifier: return this._getObjectIdentifier()._getAbstractSyntaxNotation();
            case _UniversalType.objectDescriptor: return `"${this._getObjectDescriptor()}"`;
            case _UniversalType.external: return '_PdfExternal';
            case _UniversalType.enumerated: return this._getEnumerated().toString();
            case _UniversalType.embeddedDataValue: return 'EMBEDDED PDV';
            case _UniversalType.utf8String: return `"${this._getUtf8String()}"`;
            case _UniversalType.relativeObjectIdentifier: return `{ ${this._getRelativeObjectIdentifier()
                .map((arc: number) => arc.toString()).join('.')} }`;
            case _UniversalType.time: return `"${this._getTime()}"`;
            case _UniversalType.sequence: return `{ ${this._getSequenceOf()
                .map((el: any) => (el.name.length ? `${el.name} ${el.toString()}` : el.toString())) // eslint-disable-line
                .join(' , ')} }`;
            case _UniversalType.abstractSyntaxSet: return `{ ${this._getAbstractSetOf()
                .map((el: any) => (el.name.length ? `${el.name} ${el.toString()}` : el.toString())) // eslint-disable-line
                .join(' , ')} }`;
            case _UniversalType.numericString: return `"${this._getNumericString()}"`;
            case _UniversalType.printableString: return `"${this._getPrintableString()}"`;
            case _UniversalType.teleprinterTextExchange: return 'TeletexString';
            case _UniversalType.videoTextInformationSystem: return 'VideotexString';
            case _UniversalType.internationalAlphabetString: return `"${this._getInternationalAlphabetString()}"`;
            case _UniversalType.characterString: return 'CHARACTER STRING';
            case _UniversalType.date: return `"${this._getDate().toISOString()}"`;
            case _UniversalType.timeOfDay: {
                const tod: Date = this._getTimeOfDay();
                return `"${tod.getUTCHours()}:${tod.getUTCMinutes()}:${tod.getUTCSeconds()}"`;
            }
            case _UniversalType.dateTime: return `"${this._getDateTime().toISOString()}"`;
            case _UniversalType.objectIdResourceIdentifier: return this._getObjectIdResourceIdentifier();
            case _UniversalType.relativeResourceIdentifier: return this._getRelativeResourceIdentifier();
            default: return `[UNIV ${this._getTagNumber()}]: ${this._getValue().toString()}`;
            }
        } else if (this._tagClass === _TagClassType.context) {
            return `[CTXT ${this._getTagNumber()}]: ${this._getValue().toString()}`;
        } else if (this._tagClass === _TagClassType.abstractSyntaxPrivate) {
            return `[PRIV ${this._getTagNumber()}]: ${this._getValue().toString()}`;
        } else {
            return `[APPL ${this._getTagNumber()}]: ${this._getValue().toString()}`;
        }
    }
    _toJson(): unknown {
        if (this._tagClass === _TagClassType.universal) {
            switch (this._getTagNumber()) {
            case _UniversalType.endOfContent:
                return undefined;
            case _UniversalType.abstractSyntaxBoolean:
                return this._getBooleanValue();
            case _UniversalType.integer: {
                const ret: number = this._getInteger();
                return ret;
            }
            case _UniversalType.bitString: {
                const bits: Uint8ClampedArray = this._getBitString();
                return {
                    length: bits.length,
                    value: Array.from(_packBits(bits)).map((byte: number) => byte.toString(16)).join('')
                };
            }
            case _UniversalType.octetString:
                return Array.from(this._getOctetString())
                    .map((byte: number) => byte.toString(16)).join('');
            case _UniversalType.nullValue:
                return null;
            case _UniversalType.objectIdentifier:
                return this._getObjectIdentifier()._toJson();
            case _UniversalType.objectDescriptor:
                return this._getObjectDescriptor();
            case _UniversalType.enumerated:
                return this._getEnumerated().toString();
            case _UniversalType.utf8String:
                return this._getUtf8String();
            case _UniversalType.relativeObjectIdentifier:
                return this._getRelativeObjectIdentifier()
                    .map((arc: number) => arc.toString()).join('.');
            case _UniversalType.teleprinterTextExchange:
                return String.fromCodePoint(...Array.from(this._getTeleprinterText()));
            case _UniversalType.videoTextInformationSystem:
                return String.fromCodePoint(...Array.from(this._getVideoTextInformation()));
            case _UniversalType.graphicString:
                return this._getGraphicString();
            case _UniversalType.visibleString:
                return this._getVisibleString();
            case _UniversalType.universalString:
                return this._getUniversalString();
            case _UniversalType.bmpString:
                return this._getBmpString();
            case _UniversalType.date:
                return this._getDate().toISOString();
            case _UniversalType.timeOfDay: {
                const tod: Date = this._getTimeOfDay();
                return `${tod.getUTCHours()}:${tod.getUTCMinutes()}:${tod.getUTCSeconds()}`;
            }
            case _UniversalType.dateTime:
                return this._getDateTime().toISOString();
            case _UniversalType.objectIdResourceIdentifier:
                return this._getObjectIdResourceIdentifier();
            case _UniversalType.relativeResourceIdentifier:
                return this._getRelativeResourceIdentifier();
            default:
                return undefined;
            }
        }
        return undefined;
    }
    _sortCanonically(elements: _PdfAbstractSyntaxElement[]): _PdfAbstractSyntaxElement[] {
        return elements.sort((a: _PdfAbstractSyntaxElement, b: _PdfAbstractSyntaxElement): number => {
            const aClassOrder: number = a._tagClass as number;
            const bClassOrder: number = b._tagClass as number;
            if (aClassOrder !== bClassOrder) {
                return aClassOrder - bClassOrder;
            }
            const aBytes: Uint8Array = a._toBytes();
            const bBytes: Uint8Array = b._toBytes();
            const minLength: number = Math.min(aBytes.length, bBytes.length);
            for (let i: number = 0; i < minLength; i++) {
                if (aBytes[<number>i] !== bBytes[<number>i]) {
                    return aBytes[<number>i] - bBytes[<number>i];
                }
            }
            return aBytes.length - bBytes.length;
        });
    }
    _isUniquelyTagged(elements: _PdfAbstractSyntaxElement[]): boolean {
        const finds: Set<number> = new Set<number>([]);
        for (let i: number = 0; i < elements.length; i++) {
            const key: number = (
                (elements[<number>i]._tagClass << 30)
                + elements[<number>i]._getTagNumber()
            );
            if (finds.has(key)) {
                return false;
            }
            finds.add(key);
        }
        return true;
    }
    _getInteger(): number {
        if (this._construction !== _ConstructionType.primitive) {
            throw new Error('Number cannot be constructed.');
        }
        const value: Uint8Array = this._getValue();
        return this._decodeInteger(value);
    }
    _setInteger(value: number): void {
        this._setValue(this._encodeInteger(value));
    }
    _getObjectIdentifier (): _PdfObjectIdentifier {
        if (this._construction !== _ConstructionType.primitive) {
            throw new Error('Object identifier cannot be constructed.');
        }
        return this._decodeObjectIdentifier(this._getValue());
    }
    _setObjectIdentifier (value: _PdfObjectIdentifier): void {
        this._setValue(this._encodeObjectIdentifier(value));
    }
    _getEnumerated(): number {
        return Number(this._getInteger());
    }
    _setEnumerated(value: number): void {
        this._setInteger(value);
    }
    _getRelativeObjectIdentifier(): number[] {
        if (this._construction !== _ConstructionType.primitive) {
            throw new Error('Relative oid cannot be constructed.');
        }
        return this._decodeRelativeObjectIdentifier(this._getValue());
    }
    _setRelativeObjectIdentifier(value: number[]): void {
        this._setValue(this._encodeRelativeObjectIdentifier(value));
    }
    _getTime(): string {
        return this._decodeTime(this._getValue());
    }
    _setTime(value: string): void {
        this._setValue(this._encodeTime(value));
    }
    _getDate(): Date {
        return this._decodeDate(this._getValue());
    }
    _setDate(value: Date): void {
        this._setValue(this._encodeDate(value));
    }
    _getTimeOfDay(): Date {
        return this._decodeTimeOfDay(this._getValue());
    }
    _setTimeOfDay(value: Date): void {
        this._setValue(this._encodeTimeOfDay(value));
    }
    _getDateTime(): Date {
        return this._decodeDateTime(this._getValue());
    }
    _setDateTime(value: Date): void {
        this._setValue(this._encodeDateTime(value));
    }
    _getObjectIdResourceIdentifier(): string {
        return this._decodeObjectIdResourceIdentifier(this._getValue());
    }
    _setObjectIdResourceIdentifier(value: string): void {
        this._setValue(this._encodeObjectIdResourceIdentifier(value));
    }
    _getRelativeResourceIdentifier(): string {
        return this._decodeRelativeResourceIdentifier(this._getValue());
    }
    _setRelativeResourceIdentifier(value: string): void {
        this._setValue(this._encodeRelativeResourceIdentifier(value));
    }
    _encodeInteger(value: number): Uint8Array {
        return _integerToBuffer(value);
    }
    _decodeInteger(value: Uint8Array): number {
        if (value.length === 0) {
            throw new Error('Integer or enumeration encoded on zero bytes');
        }
        if (value.length > 2 && ((value[0] === 0xFF && value[1] >= 0b10000000) ||
            (value[0] === 0x00 && value[1] < 0b10000000))) {
            const slice: Uint8Array = value.slice(0, 16);
            const hexString: string = Array.from(slice)
                .map((byte: number) => _padStart(byte.toString(16), 2, '0'))
                .join('');
            throw new Error(
                'Unnecessary padding bytes on . ' +
                `First 16 bytes of the offending value were: 0x${hexString}`
            );
        }
        return _bufferToInteger(value);
    }
    _encodeObjectIdentifier(value: _PdfObjectIdentifier): Uint8Array {
        return value._toBytes();
    }
    _decodeObjectIdentifier(value: Uint8Array): _PdfObjectIdentifier {
        const oid: _PdfObjectIdentifier = new _PdfObjectIdentifier();
        return oid._fromBytes(value);
    }
    _encodeRelativeObjectIdentifier(value: number[]): Uint8Array {
        const result: number[] = [];
        for (const arc of value) {
            if (arc < 128) {
                result.push(arc);
                continue;
            }
            let length: number = 0;
            let tempArc: number = arc;
            while (tempArc > 0) {
                length++;
                tempArc >>>= 7;
            }
            for (let j: number = length - 1; j >= 0; j--) {
                let byte: number = (arc >>> (j * 7)) & 0x7f;
                if (j !== 0) {
                    byte |= 0x80;
                }
                result.push(byte);
            }
        }
        return new Uint8Array(result);
    }
    _decodeRelativeObjectIdentifier(value: Uint8Array): number[] {
        if (value.length === 0) {
            return [];
        } else if (value.length > 1 && (value[value.length - 1] & 0b10000000) !== 0) {
            throw new Error('The relative object identifier is too long and was shortened.');
        }
        const nodes: number[] = [];
        let currentNode: number = 0;
        for (let i: number = 0; i < value.length; i++) {
            const byte: number = value[<number>i];
            if (byte === 0x80 && currentNode === 0) {
                throw new Error('The relative object identifier node has unsupported padding.');
            }
            currentNode <<= 7;
            currentNode += (byte & 0x7f);
            if ((byte & 0x80) === 0) {
                nodes.push(currentNode);
                currentNode = 0;
            }
        }
        return nodes;
    }
    _encodeTime(value: string): Uint8Array {
        return _stringToBytes(value.replace(/,/g, '.')) as Uint8Array;
    }
    _decodeTime(bytes: Uint8Array): string {
        return _convertBytesToText(bytes);
    }
    _encodeDate(date: Date): Uint8Array {
        if (date.getFullYear() < 1582 || date.getFullYear() > 9999) {
            throw new Error(
                `The Date ${date.toISOString()} may not be encoded, because the `
                + 'year must be greater than 1581 and less than 10000.'
            );
        }
        return _stringToBytes(
            _padStart(date.getFullYear().toString(), 4, '0') +
            _padStart((date.getMonth() + 1).toString(), 2, '0') +
            _padStart(date.getDate().toString(), 2, '0')
        ) as Uint8Array;
    }
    _decodeDate(bytes: Uint8Array): Date {
        const str: string = _convertBytesToText(bytes);
        const year: number = parseInt(str.slice(0, 4), 10);
        const month: number = parseInt(str.slice(4, 6), 10) - 1;
        const day: number = parseInt(str.slice(6, 8), 10);
        _validateDate('DATE', year, month, day);
        return new Date(year, month, day);
    }
    _encodeTimeOfDay(time: Date): Uint8Array {
        return _stringToBytes(
            _padStart(time.getHours().toString(), 2, '0')
            + _padStart(time.getMinutes().toString(), 2, '0')
            + _padStart(time.getSeconds().toString(), 2, '0')
        ) as Uint8Array;
    }
    _decodeTimeOfDay(bytes: Uint8Array): Date {
        const str: string = _convertBytesToText(bytes);
        const hours: number = parseInt(str.slice(0, 2), 10);
        const minutes: number = parseInt(str.slice(2, 4), 10);
        const seconds: number = parseInt(str.slice(4, 6), 10);
        _validateTime('TIME-OF-DAY', hours, minutes, seconds);
        const ret: Date = new Date();
        ret.setHours(hours);
        ret.setMinutes(minutes);
        ret.setSeconds(seconds);
        return ret;
    }
    _decodeDateTime(bytes: Uint8Array): Date {
        const str: string = _convertBytesToText(bytes);
        const year: number = parseInt(str.slice(0, 4), 10);
        const month: number = parseInt(str.slice(4, 6), 10) - 1;
        const day: number = parseInt(str.slice(6, 8), 10);
        const hours: number = parseInt(str.slice(8, 10), 10);
        const minutes: number = parseInt(str.slice(10, 12), 10);
        const seconds: number = parseInt(str.slice(12, 14), 10);
        _validateDateTime('DATE-TIME', year, month, day, hours, minutes, seconds);
        return new Date(year, month, day, hours, minutes, seconds);
    }
    _decodeGeneralString(value: Uint8Array): string {
        for (let i: number = 0; i < value.length; i++) {
            const char: number = value[<number>i];
            if (!_isGeneralCharacter(char)) {
                throw new Error('The input must contain only standard ASCII characters.');
            }
        }
        return _convertBytesToText(value);
    }
    _decodeGraphicString(value: Uint8Array): string {
        for (let i: number = 0; i < value.length; i++) {
            const char: number = value[<number>i];
            if (!_isGraphicCharacter(char)) {
                throw new Error(
                    'Only standard printable ASCII characters are allowed.');
            }
        }
        return _convertBytesToText(value);
    }
    _decodeNumericString(value: Uint8Array): string {
        for (let i: number = 0; i < value.length; i++) {
            const char: number = value[<number>i];
            if (!isNumericString(char)) {
                throw new Error('The input must contain only numeric characters and spaces.');
            }
        }
        return _convertBytesToText(value);
    }
    _decodeObjectDescriptor(value: Uint8Array): string {
        for (let i: number = 0; i < value.length; i++) {
            const char: number = value[<number>i];
            if (!_isGraphicCharacter(char)) {
                throw new Error('Only standard printable ASCII characters are allowed in the object descriptor.');
            }
        }
        return _convertBytesToText(value);
    }
    _decodeObjectIdResourceIdentifier(bytes: Uint8Array): string {
        return _convertBytesToText(bytes);
    }
    _decodeRelativeResourceIdentifier(bytes: Uint8Array): string {
        return _convertBytesToText(bytes);
    }
    _decodePrintableString(value: Uint8Array): string {
        const printableStringCharacters: string =
            'etaoinsrhdlucmfywgpbvkxqjzETAOINSRHDLUCMFYWGPBVKXQJZ' +
            '0123456789 \'()+,-./:=?';
        for (let i: number = 0; i < value.length; i++) {
            const char: number = value[<number>i];
            if (!_isPrintableCharacter(char)) {
                throw new Error(
                    'Printable ASCII string can only contain these characters: ' +
                    printableStringCharacters + '. ' +
                    `Encountered character code ${char}.`
                );
            }
        }
        return _convertBytesToText(value);
    }
    _decodeVisibleString(value: Uint8Array): string {
        for (let i: number = 0; i < value.length; i++) {
            const char: number = value[<number>i];
            if (!_isGraphicCharacter(char)) {
                throw new Error(
                    'Visible string can only contain characters between 0x20 and 0x7E. ' +
                    `Encountered character code ${char}.`
                );
            }
        }
        return _convertBytesToText(value);
    }
    _encodeBitString(value: Uint8ClampedArray): Uint8Array {
        if (value.length === 0) {
            return new Uint8Array([0]);
        }
        const byteLength: number = (value.length >>> 3) + (value.length % 8 !== 0 ? 1 : 0);
        const result: Uint8Array = new Uint8Array(byteLength + 1);
        result[0] = 8 - (value.length % 8);
        if (result[0] === 8) {
            result[0] = 0;
        }
        result.set(_packBits(value), 1);
        return result;
    }
    _encodeBoolean(value: boolean): Uint8Array {
        return new Uint8Array([(value ? 0xFF : 0x00)]);
    }
    _encodeDateTime(value: Date): Uint8Array {
        const year: number = value.getFullYear();
        if (year < 1582 || year > 9999) {
            throw new Error('The date cannot be encoded');
        }
        const dateTimeString: string =
            _padStart(year.toString(), 4, '0') +
            _padStart((value.getMonth() + 1).toString(), 2, '0') +
            _padStart(value.getDate().toString(), 2, '0') +
            _padStart(value.getHours().toString(), 2, '0') +
            _padStart(value.getMinutes().toString(), 2, '0') +
            _padStart(value.getSeconds().toString(), 2, '0');
        return _stringToBytes(dateTimeString) as Uint8Array;
    }
    _encodeObjectIdResourceIdentifier(value: string): Uint8Array {
        return _stringToBytes(value) as Uint8Array;
    }
    _encodeRelativeResourceIdentifier(value: string): Uint8Array {
        return _stringToBytes(value) as Uint8Array;
    }
    _encodeSequence(value: _PdfAbstractSyntaxElement[]): Uint8Array {
        const byteArrays: Uint8Array[] = value.map((element: _PdfAbstractSyntaxElement) => element._toBytes());
        const totalLength: number = byteArrays.reduce((sum: number, arr: Uint8Array) => sum + arr.length, 0);
        const result: Uint8Array = new Uint8Array(totalLength);
        let offset: number = 0;
        for (const arr of byteArrays) {
            result.set(arr, offset);
            offset += arr.length;
        }
        return result;
    }
    _encodeNumericString (value: string): Uint8Array {
        return _stringToBytes(value) as Uint8Array;
    }
    _encodePrintableString (value: string): Uint8Array {
        return _stringToBytes(value) as Uint8Array;
    }
    _encodeGraphicString(value: string): Uint8Array {
        return _stringToBytes(value) as Uint8Array;
    }
    _encodeVisibleString(value: string): Uint8Array {
        return _stringToBytes(value) as Uint8Array;
    }
    _encodeObjectDescriptor(value: string): Uint8Array {
        return _stringToBytes(value) as Uint8Array;
    }
    _toEncodedBytes(): Uint8Array {
        return this._toBytes();
    }
}
