import { _padStart, _stringToBytes } from '../../../utils';
import { _ConstructionType, _TagClassType, _UniversalType } from './enumerator';
import { _PdfObjectIdentifier } from './identifier-mapping';
import { _bufferToInteger, _convertBytesToText, _integerToBuffer, _packBits } from './utils';
import { _isGeneralCharacter, _isGraphicCharacter, _isPrintableCharacter, _validateDate, _validateDateTime, _validateTime, isNumericString } from './syntax-verifier';
/**
 * Represents an abstract ASN.1 syntax element with utilities for encoding, decoding, validation and serialization.
 *
 * @private
 */
export abstract class _PdfAbstractSyntaxElement {
    /**
     * Internal recursion tracker used to prevent excessive recursion during parsing.
     *
     * @private
     */
    _recursionCount: number = 0;
    /**
     * Maximum allowed nesting depth to protect against overly deep ASN.1 structures.
     *
     * @private
     */
    _nestingRecursionLimit: number = 5;
    /**
     * Optional element name used for error messages and diagnostics.
     *
     * @private
     */
    _name: string = '';
    /**
     * The ASN.1 tag class for the element (universal, application, context, or private).
     *
     * @private
     */
    _tagClass: _TagClassType = _TagClassType.universal;
    /**
     * Indicates whether the element is primitive or constructed.
     *
     * @private
     */
    _construction: _ConstructionType = _ConstructionType.primitive;
    /**
     * Internal storage for the element tag number.
     */
    private _tagNumber: number = 0;
    /**
     * Retrieves the raw encoded value bytes of this ASN.1 element.
     *
     * @returns {Uint8Array} The encoded value as a `Uint8Array`.
     * @private
     */
    abstract _getValue(): Uint8Array;
    /**
     * Sets the raw encoded value bytes for this ASN.1 element.
     *
     * @param {Uint8Array} The value bytes to assign.
     * @returns {void} nothing.
     * @private
     */
    abstract _setValue(value: Uint8Array): void;
    /**
     * Retrieves the boolean interpretation of this element's value.
     *
     * @returns {boolean} The boolean value.
     * @private
     */
    abstract _getBooleanValue(): boolean;
    /**
     * Sets the boolean interpretation of this element's value.
     *
     * @param {boolean} The boolean to set.
     * @returns {void} nothing.
     * @private
     */
    abstract _setBooleanValue(value: boolean): void;
    /**
     * Retrieves this element's bit string as a `Uint8ClampedArray`.
     *
     * @returns {Uint8ClampedArray} The bit string contents.
     * @private
     */
    abstract _getBitString(): Uint8ClampedArray;
    /**
     * Sets this element's bit string value.
     *
     * @param {Uint8ClampedArray} The bit string to assign.
     * @returns {void} nothing.
     * @private
     */
    abstract _setBitString(value: Uint8ClampedArray): void;
    /**
     * Retrieves this element's octet string as a `Uint8Array`.
     *
     * @returns {Uint8Array} The octet string contents.
     * @private
     */
    abstract _getOctetString(): Uint8Array;
    /**
     * Sets this element's octet string value.
     *
     * @param {Uint8Array} The octet string to assign.
     * @returns {void} nothing.
     * @private
     */
    abstract _setOctetString(value: Uint8Array): void;
    /**
     * Retrieves the object descriptor string for this element.
     *
     * @returns {string} The object descriptor.
     * @private
     */
    abstract _getObjectDescriptor(): string;
    /**
     * Sets the object descriptor string for this element.
     *
     * @param {string} The descriptor to assign.
     * @returns {void} nothing.
     * @private
     */
    abstract _setObjectDescriptor(value: string): void;
    /**
     * Retrieves the UTF-8 string value for this element.
     *
     * @returns {string} The UTF-8 decoded string.
     * @private
     */
    abstract _getUtf8String(): string;
    /**
     * Sets the UTF-8 string value for this element.
     *
     * @param {string} The UTF-8 string to assign.
     * @returns {void} nothing.
     * @private
     */
    abstract _setUtf8String(value: string): void;
    /**
     * Retrieves the child elements when this is a `SEQUENCE`.
     *
     * @returns {_PdfAbstractSyntaxElement[]} The sequence elements.
     * @private
     */
    abstract _getSequence(): _PdfAbstractSyntaxElement[];
    /**
     * Sets the child elements when this is a `SEQUENCE`.
     *
     * @param {_PdfAbstractSyntaxElement[]} The elements to assign.
     * @returns {void} nothing.
     * @private
     */
    abstract _setSequence(value: _PdfAbstractSyntaxElement[]): void;
    /**
     * Retrieves the elements for an abstract `SET` value.
     *
     * @returns {_PdfAbstractSyntaxElement[]} The set elements.
     * @private
     */
    abstract _getAbstractSetValue(): _PdfAbstractSyntaxElement[];
    /**
     * Sets the elements for an abstract `SET` value.
     *
     * @param {_PdfAbstractSyntaxElement[]} The set elements to assign.
     * @returns {void} nothing.
     * @private
     */
    abstract _setAbstractSetValue(value: _PdfAbstractSyntaxElement[]): void;
    /**
     * Retrieves the elements when this is a `SEQUENCE OF`.
     *
     * @returns {_PdfAbstractSyntaxElement[]} The sequence-of elements.
     * @private
     */
    abstract _getSequenceOf(): _PdfAbstractSyntaxElement[];
    /**
     * Sets the elements when this is a `SEQUENCE OF`.
     *
     * @param {_PdfAbstractSyntaxElement} value The elements to assign.
     * @returns {void} nothing.
     * @private
     */
    abstract _setSequenceOf(value: _PdfAbstractSyntaxElement[]): void;
    /**
     * Retrieves the elements when this is a `SET OF`.
     *
     * @returns {_PdfAbstractSyntaxElement[]} The set-of elements.
     * @private
     */
    abstract _getAbstractSetOf(): _PdfAbstractSyntaxElement[];
    /**
     * Sets the elements when this is a `SET OF`.
     *
     * @param {_PdfAbstractSyntaxElement[]} The elements to assign.
     * @returns {void} nothing.
     * @private
     */
    abstract _setAbstractSetOf(value: _PdfAbstractSyntaxElement[]): void;
    /**
     * Retrieves a numeric string value for this element.
     *
     * @returns {string} The numeric string.
     * @private
     */
    abstract _getNumericString(): string;
    /**
     * Sets a numeric string value for this element.
     *
     * @param {string} The numeric string to assign.
     * @returns {void} nothing.
     * @private
     */
    abstract _setNumericString(value: string): void;
    /**
     * Retrieves a printable string value for this element.
     *
     * @returns {string} The printable string.
     * @private
     */
    abstract _getPrintableString(): string;
    /**
     * Sets a printable string value for this element.
     *
     * @param {string} The printable string to assign.
     * @returns {void}
     * @private
     */
    abstract _setPrintableString(value: string): void;
    /**
     * Retrieves legacy teleprinter text bytes for this element.
     *
     * @returns {Uint8Array} The teleprinter text as bytes.
     * @private
     */
    abstract _getTeleprinterText(): Uint8Array;
    /**
     * Sets legacy teleprinter text bytes for this element.
     *
     * @param {Uint8Array} The bytes to assign.
     * @returns {void} nothing.
     * @private
     */
    abstract _setTeleprinterText(value: Uint8Array): void;
    /**
     * Retrieves videotex information bytes for this element.
     *
     * @returns {Uint8Array} The videotex bytes.
     * @private
     */
    abstract _getVideoTextInformation(): Uint8Array;
    /**
     * Sets videotex information bytes for this element.
     *
     * @param {Uint8Array} The videotex bytes to assign.
     * @returns {void} nothing.
     * @private
     */
    abstract _setVideoTextInformation(value: Uint8Array): void;
    /**
     * Retrieves an IA5 (international alphabet) string for this element.
     *
     * @returns {string} The IA5 string.
     * @private
     */
    abstract _getInternationalAlphabetString(): string;
    /**
     * Sets an IA5 string for this element.
     *
     * @param {string} The IA5 string to assign.
     * @returns {void} nothing.
     * @private
     */
    abstract _setInternationalAlphabetString(value: string): void;
    /**
     * Retrieves a graphic string for this element.
     *
     * @returns {string} The graphic string.
     * @private
     */
    abstract _getGraphicString(): string;
    /**
     * Sets a graphic string for this element.
     *
     * @param {string} The graphic string to assign.
     * @returns {void} Nothing.
     * @private
     */
    abstract _setGraphicString(value: string): void;
    /**
     * Retrieves a visible string for this element.
     *
     * @returns {string} The visible string.
     * @private
     */
    abstract _getVisibleString(): string;
    /**
     * Sets a visible string for this element.
     *
     * @param {string} The visible string to assign.
     * @returns {void} Nothing.
     * @private
     */
    abstract _setVisibleString(value: string): void;
    /**
     * Retrieves a universal (UTF-32) string for this element.
     *
     * @returns {string} The universal string.
     * @private
     */
    abstract _getUniversalString(): string;
    /**
     * Sets a universal (UTF-32) string for this element.
     *
     * @param {string} The universal string to assign.
     * @returns {void} nothing.
     * @private
     */
    abstract _setUniversalString(value: string): void;
    /**
     * Retrieves a BMP (16-bit) string for this element.
     *
     * @returns {string} The BMP string.
     * @private
     */
    abstract _getBmpString(): string;
    /**
     * Sets a BMP (16-bit) string for this element.
     *
     * @param {string} The BMP string to assign.
     * @returns {void} Nothing.
     * @private
     */
    abstract _setBmpString(value: string): void;
    /**
     * Retrieves the inner contained element when present.
     *
     * @returns {_PdfAbstractSyntaxElement} The inner ASN.1 element.
     * @private
     */
    abstract _getInner(): _PdfAbstractSyntaxElement;
    /**
     * Retrieves component elements for constructed types.
     *
     * @returns {_PdfAbstractSyntaxElement[]} The component elements.
     * @private
     */
    abstract _getComponents(): _PdfAbstractSyntaxElement[];
    /**
     * Populates this element from the given bytes and returns the number of consumed bytes.
     *
     * @param {Uint8Array} The input bytes to parse.
     * @returns {number} The number of bytes consumed during parsing.
     * @private
     */
    abstract _fromBytes(bytes: Uint8Array): number;
    /**
     * Constructs this element from the provided child elements.
     *
     * @param {_PdfAbstractSyntaxElement[]} The child elements to construct from.
     * @returns {void} nothing.
     * @private
     */
    abstract _construct(els: _PdfAbstractSyntaxElement[]): void;
    /**
     * Produces the tag and length bytes for this element.
     *
     * @returns {Uint8Array} The tag-and-length bytes.
     * @private
     */
    abstract _tagAndLengthBytes(): Uint8Array;
    /**
     * Serializes this element into a sequence of buffers.
     *
     * @returns {Uint8Array} An array of `Uint8Array` buffers representing the element.
     * @private
     */
    abstract _toBuffers(): Uint8Array[];
    /**
     * Determines the length of the length-field for a given value length.
     *
     * @param {number} Optional value length to evaluate.
     * @returns {number} The number of bytes used to encode the length.
     * @private
     */
    abstract _lengthLength(valueLength?: number): number;
    /**
     * Returns the length of the encoded value for this element.
     *
     * @returns {number} The value length in bytes.
     * @private
     */
    abstract _valueLength(): number;
    /**
     * Serializes this element using the given data type hint.
     *
     * @param {string} A hint describing the serialization format.
     * @returns {Uint8Array} The serialized bytes.
     * @private
     */
    abstract _serialize(dataType: string): Uint8Array;
    /**
     * Returns the numeric tag number for this ASN.1 element.
     *
     * @returns {number} The tag number.
     * @private
     */
    _getTagNumber(): number {
        return this._tagNumber;
    }
    /**
     * Sets the numeric tag number for this ASN.1 element.
     *
     * @param {number} value non-negative tag number to assign.
     * @returns {void} nothing.
     * @private
     */
    _setTagNumber(value: number): void {
        if (!Number.isSafeInteger(value) || value < 0) {
            throw new Error(`Tag ${value} was not a non-negative number.`);
        }
        this._tagNumber = value;
    }
    /**
     * Returns the length in bytes of this element's encoded value.
     *
     * @returns {number} The length of the encoded value.
     * @private
     */
    _getLength(): number {
        const value: Uint8Array = this._getValue();
        return value.length;
    }
    /**
     * Calculates how many bytes are needed to encode the tag for this element.
     *
     * @returns {number} The number of bytes used for the tag encoding.
     * @private
     */
    _tagLength(): number {
        const tagNumber: number = this._getTagNumber();
        if (tagNumber < 31) {
            return 1;
        }
        let n: number = tagNumber;
        let digits: number = 0;
        while (n !== 0) {
            n >>>= 7;
            digits++;
        }
        return 1 + digits;
    }
    /**
     * Concatenates this element's buffers into a single `Uint8Array`.
     *
     * @returns {Uint8Array} The serialized bytes for this element.
     * @private
     */
    _toBytes(): Uint8Array {
        const buffers: Uint8Array[] = this._toBuffers();
        const totalLength: number = buffers.reduce((sum: number, arr: Uint8Array) => sum + arr.length, 0);
        const result: Uint8Array = new Uint8Array(totalLength);
        let offset: number = 0;
        for (const buffer of buffers) {
            result.set(buffer, offset);
            offset += buffer.length;
        }
        return result;
    }
    /**
     * Validates that a size lies within the inclusive `[min, max]` bounds.
     *
     * @param {string} name human-readable name used in error messages.
     * @param {string} units string used in error messages.
     * @param {number} actualSize measured size.
     * @param {number} min allowed size.
     * @param {number}  max allowed size.
     * @returns {void} Nothing.
     * @private
     */
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
    /**
     * Validates that a numeric value lies within the inclusive `[min, max]` range.
     *
     * @param {string} name used in error messages.
     * @param {bigint | number} actualValue to validate.
     * @param {bigint} min allowed value.
     * @param {bigint} [max] maximum allowed value.
     * @returns {void}
     * @private
     */
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
    /**
     * Returns a bit string constrained to the given size bounds.
     *
     * @param {number} min allowed length in bits.
     * @param {number} [max] maximum allowed length in bits.
     * @returns {Uint8ClampedArray} The constrained bit string.
     * @private
     */
    _sizeConstrainedString(min: number, max?: number): Uint8ClampedArray {
        const bitString: Uint8ClampedArray = this._getBitString();
        const ret: Uint8ClampedArray = bitString;
        this._validateSize(this._name || 'Bit string', 'bits', ret.length, min, max);
        return ret;
    }
    /**
     * Returns a UTF-8 string constrained by character count.
     *
     * @param {number} min allowed characters.
     * @param {number} [max] maximum allowed characters.
     * @returns {string} The constrained UTF-8 string.
     * @private
     */
    _sizeConstrainedUtf8String(min: number, max?: number): string {
        const utf8String: string = this._getUtf8String();
        const ret: string = utf8String;
        this._validateSize(this._name || 'Unicode string', 'characters', ret.length, min, max);
        return ret;
    }
    /**
     * Returns a `SEQUENCE OF` constrained by element count.
     *
     * @param {number} min allowed elements.
     * @param {number} [max] maximum allowed elements.
     * @returns {_PdfAbstractSyntaxElement} The constrained sequence-of elements.
     * @private
     */
    _sizeConstrainedSequenceOf(min: number, max?: number): _PdfAbstractSyntaxElement[] {
        const sequenceOf: _PdfAbstractSyntaxElement[] = this._getSequenceOf();
        const ret: _PdfAbstractSyntaxElement[] = sequenceOf;
        this._validateSize(this._name || 'Sequence of', 'elements', ret.length, min, max);
        return ret;
    }
    /**
     * Returns a `SET OF` constrained by element count.
     *
     * @param {number} min allowed elements.
     * @param {number} [max] maximum allowed elements.
     * @returns {_PdfAbstractSyntaxElement} The constrained set-of elements.
     * @private
     */
    _sizeConstrainedSetOf(min: number, max?: number): _PdfAbstractSyntaxElement[] {
        const sequenceOf: _PdfAbstractSyntaxElement[] = this._getSequenceOf();
        this._validateSize(this._name || 'Set of', 'elements', sequenceOf.length, min, max);
        return sequenceOf;
    }
    /**
     * Returns a numeric string constrained by character count.
     *
     * @param {number} min allowed characters.
     * @param {number} [max] maximum allowed characters.
     * @returns {string} The constrained numeric string.
     * @private
     */
    _sizeConstrainedNumericString(min: number, max?: number): string {
        const ret: string = this._getNumericString();
        this._validateSize(this._name || 'Numeric string', 'characters', ret.length, min, max);
        return ret;
    }
    /**
     * Returns a printable ASCII string constrained by character count.
     *
     * @param {number} min allowed characters.
     * @param {number} [max] maximum allowed characters.
     * @returns {string} The constrained printable string.
     * @private
     */
    _sizeConstrainedPrintableString(min: number, max?: number): string {
        const ret: string = this._getPrintableString();
        this._validateSize(this._name || 'Printable ASCII string', 'characters', ret.length, min, max);
        return ret;
    }
    /**
     * Returns a legacy encoded text string constrained by character count.
     *
     * @param {number} min allowed characters.
     * @param {number} [max] maximum allowed characters.
     * @returns {string} The constrained text string bytes.
     * @private
     */
    _sizeConstrainedTextString(min: number, max?: number): Uint8Array {
        const ret: Uint8Array = this._getTeleprinterText();
        this._validateSize(this._name || 'Legacy encoded string', 'characters', ret.length, min, max);
        return ret;
    }
    /**
     * Returns a videotex string constrained by character count.
     *
     * @param {number} min allowed characters.
     * @param {number} [max] maximum allowed characters.
     * @returns  {string} The constrained videotex bytes.
     * @private
     */
    _sizeConstrainedVideoString(min: number, max?: number): Uint8Array {
        const ret: Uint8Array = this._getVideoTextInformation();
        this._validateSize(this._name || 'Videotex string', 'characters', ret.length, min, max);
        return ret;
    }
    /**
     * Returns an IA5 (ASCII) string constrained by character count.
     *
     * @param {number} min allowed characters.
     * @param {number} [max] maximum allowed characters.
     * @returns {string} The constrained IA5 string.
     * @private
     */
    _sizeConstrainedIA5String(min: number, max?: number): string {
        const ret: string = this._getInternationalAlphabetString();
        this._validateSize(this._name || 'ASCII string', 'characters', ret.length, min, max);
        return ret;
    }
    /**
     * Returns a graphic string constrained by character count.
     *
     * @param {number} min allowed characters.
     * @param {number} [max] maximum allowed characters.
     * @returns {string} The constrained graphic string.
     * @private
     */
    _sizeConstrainedGraphicString(min: number, max?: number): string {
        const ret: string = this._getGraphicString();
        this._validateSize(this._name || 'Graphic string', 'characters', ret.length, min, max);
        return ret;
    }
    /**
     * Returns a visible string constrained by character count.
     *
     * @param {number} min allowed characters.
     * @param {number} [max] maximum allowed characters.
     * @returns {string} The constrained visible string.
     * @private
     */
    _sizeConstrainedVisibleString(min: number, max?: number): string {
        const ret: string = this._getVisibleString();
        this._validateSize(this._name || 'Visible string', 'characters', ret.length, min, max);
        return ret;
    }
    /**
     * Returns a universal string constrained by character count.
     *
     * @param {number} min allowed characters.
     * @param {number} [max] maximum allowed characters.
     * @returns {string} The constrained universal string.
     * @private
     */
    _sizeConstrainedUniversalString(min: number, max?: number): string {
        const ret: string = this._getUniversalString();
        this._validateSize(this._name || 'Unicode string', 'characters', ret.length, min, max);
        return ret;
    }
    /**
     * Returns an integer value constrained by the specified numeric range.
     *
     * @param {bigint} min allowed value.
     * @param {bigint} [max] maximum allowed value.
     * @returns {number} The constrained number.
     * @private
     */
    _rangeConstrainedNumber(min: bigint, max?: bigint): number {
        const ret: number = this._getInteger();
        this._validateRange(this._name || 'Number', ret, min, max);
        return ret;
    }
    /**
     * Validates this element's tag against permitted classes, constructions and numbers.
     *
     * @param {_TagClassType} permittedClasses Allowed tag classes.
     * @param {_ConstructionType} permittedConstruction Allowed construction types.
     * @param {number[]} permittedNumbers Allowed tag numbers.
     * @returns {number} if valid or a negative error code.
     * @private
     */
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
    /**
     * Returns this object as an ASN.1 element instance.
     *
     * @returns {_PdfAbstractSyntaxElement} This instance.
     * @private
     */
    _toElement(): _PdfAbstractSyntaxElement {
        return this;
    }
    /**
     * Copies tag and value information from another element into this one.
     *
     * @param {_PdfAbstractSyntaxElement} el The source element to copy from.
     * @returns {void} Nothing.
     * @private
     */
    _fromElement(el: _PdfAbstractSyntaxElement): void {
        this._tagClass = el._tagClass;
        this._construction = el._construction;
        const tagNumber: number = el._getTagNumber();
        this._setTagNumber(tagNumber);
        const value: Uint8Array = el._getValue();
        this._setValue(value);
    }
    /**
     * Produces a human-readable string representation for this element.
     *
     * @returns {string} A string describing the element and its value.
     * @private
     */
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
    /* eslint-disable */
    /**
     * Converts this element to a JSON-serializable representation when possible.
     *
     * @returns {unknown} A JSON-friendly value or `undefined` if not representable.
     * @private
     */
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
    /* eslint-ensable */
    /**
     * Sorts elements into canonical order by their encoded bytes.
     *
     * @param  {_PdfAbstractSyntaxElement[]} elements array of elements to sort.
     * @returns {_PdfAbstractSyntaxElement[]} The sorted elements.
     * @private
     */
    _sortCanonically(elements: _PdfAbstractSyntaxElement[]): _PdfAbstractSyntaxElement[] {
        return elements.sort((value1: _PdfAbstractSyntaxElement, value2: _PdfAbstractSyntaxElement) => {
            const element1: Uint8Array = value1._toBytes();
            const element2: Uint8Array = value2._toBytes();
            const n: number = Math.min(element1.length, element2.length);
            for (let i: number = 0; i < n; i++) {
                if (element1[<number>i] !== element2[<number>i]) {
                    return element1[<number>i] - element2[<number>i];
                }
            }
            return element1.length - element2.length;
        });
    }
    /**
     * Determines whether the provided elements have unique (class, tag) pairs.
     *
     * @param {_PdfAbstractSyntaxElement} elements to examine.
     * @returns {boolean} if all elements are uniquely tagged.
     * @private
     */
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
    /**
     * Decodes and returns this element's integer value.
     *
     * @returns {number} The decoded integer.
     * @private
     */
    _getInteger(): number {
        if (this._construction !== _ConstructionType.primitive) {
            throw new Error('Number cannot be constructed.');
        }
        const value: Uint8Array = this._getValue();
        return this._decodeInteger(value);
    }
    /**
     * Encodes and sets this element's integer value.
     *
     * @param {number} value integer to encode and assign.
     * @returns {void} Nothing.
     * @private
     */
    _setInteger(value: number): void {
        this._setValue(this._encodeInteger(value));
    }
    /**
     * Decodes and returns this element's object identifier.
     *
     * @returns {_PdfObjectIdentifier} The decoded `_PdfObjectIdentifier`.
     * @private
     */
    _getObjectIdentifier (): _PdfObjectIdentifier {
        if (this._construction !== _ConstructionType.primitive) {
            throw new Error('Object identifier cannot be constructed.');
        }
        return this._decodeObjectIdentifier(this._getValue());
    }
    /**
     * Encodes and sets this element's object identifier.
     *
     * @param {_PdfObjectIdentifier}  value The object identifier to assign.
     * @returns {void} Nothing.
     * @private
     */
    _setObjectIdentifier (value: _PdfObjectIdentifier): void {
        this._setValue(this._encodeObjectIdentifier(value));
    }
    /**
     * Returns this element's enumerated value as a number.
     *
     * @returns {number} The enumerated value.
     * @private
     */
    _getEnumerated(): number {
        return Number(this._getInteger());
    }
    /**
     * Sets this element's enumerated value.
     *
     * @param {number} value enumerated value to assign.
     * @returns {void} Nothing.
     * @private
     */
    _setEnumerated(value: number): void {
        this._setInteger(value);
    }
    /**
     * Decodes and returns this element's relative object identifier as an array of arcs.
     *
     * @returns {number[]} The relative OID arcs.
     * @private
     */
    _getRelativeObjectIdentifier(): number[] {
        if (this._construction !== _ConstructionType.primitive) {
            throw new Error('Relative oid cannot be constructed.');
        }
        return this._decodeRelativeObjectIdentifier(this._getValue());
    }
    /**
     * Encodes and sets this element's relative object identifier.
     *
     * @param {number[]} value array of arcs to assign.
     * @returns {void} This returns void.
     * @private
     */
    _setRelativeObjectIdentifier(value: number[]): void {
        this._setValue(this._encodeRelativeObjectIdentifier(value));
    }
    /**
     * Decodes and returns this element's time string.
     *
     * @returns {string} The decoded time string.
     * @private
     */
    _getTime(): string {
        return this._decodeTime(this._getValue());
    }
    /**
     * Encodes and sets this element's time string.
     *
     * @param {string} value time string to assign.
     * @returns {void} This returns void.
     * @private
     */
    _setTime(value: string): void {
        this._setValue(this._encodeTime(value));
    }
    /**
     * Decodes and returns this element's date.
     *
     * @returns {Date} The decoded `Date`.
     * @private
     */
    _getDate(): Date {
        return this._decodeDate(this._getValue());
    }
    /**
     * Encodes and sets this element's date.
     *
     * @param {Date} value `Date` to assign.
     * @returns {void} This returns void.
     * @private
     */
    _setDate(value: Date): void {
        this._setValue(this._encodeDate(value));
    }
    /**
     * Decodes and returns this element's time-of-day as a `Date`.
     *
     * @returns {Date} The decoded time-of-day.
     * @private
     */
    _getTimeOfDay(): Date {
        return this._decodeTimeOfDay(this._getValue());
    }
    /**
     * Encodes and sets this element's time-of-day.
     *
     * @param {Date} value `Date` representing the time-of-day.
     * @returns {void}
     * @private
     */
    _setTimeOfDay(value: Date): void {
        this._setValue(this._encodeTimeOfDay(value));
    }
    /**
     * Decodes and returns this element's date-time as a `Date`.
     *
     * @returns {Date} The decoded date-time.
     * @private
     */
    _getDateTime(): Date {
        return this._decodeDateTime(this._getValue());
    }
    /**
     * Encodes and sets this element's date-time.
     *
     * @param {Date} value `Date` to assign.
     * @returns {void} This returns void.
     * @private
     */
    _setDateTime(value: Date): void {
        this._setValue(this._encodeDateTime(value));
    }
    /**
     * Decodes and returns this element's object ID resource identifier.
     *
     * @returns {string} The decoded resource identifier string.
     * @private
     */
    _getObjectIdResourceIdentifier(): string {
        return this._decodeObjectIdResourceIdentifier(this._getValue());
    }
    /**
     * Encodes and sets this element's object ID resource identifier.
     *
     * @param {string} value resource identifier string to assign.
     * @returns {void} This returns void.
     * @private
     */
    _setObjectIdResourceIdentifier(value: string): void {
        this._setValue(this._encodeObjectIdResourceIdentifier(value));
    }
    /**
     * Decodes and returns this element's relative resource identifier.
     *
     * @returns {string} The decoded relative resource identifier.
     * @private
     */
    _getRelativeResourceIdentifier(): string {
        return this._decodeRelativeResourceIdentifier(this._getValue());
    }
    /**
     * Encodes and sets this element's relative resource identifier.
     *
     * @param {string} value relative resource identifier string to assign.
     * @returns {void} this returns void.
     * @private
     */
    _setRelativeResourceIdentifier(value: string): void {
        this._setValue(this._encodeRelativeResourceIdentifier(value));
    }
    /**
     * Encodes a JavaScript number into ASN.1 integer bytes.
     *
     * @param {number} value number to encode.
     * @returns {Uint8Array} The encoded integer bytes.
     * @private
     */
    _encodeInteger(value: number): Uint8Array {
        return _integerToBuffer(value);
    }
    /**
     * Decodes ASN.1 integer bytes into a JavaScript number.
     *
     * @param {Uint8Array} value integer bytes to decode.
     * @returns {number} The decoded number.
     * @private
     */
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
    /**
     * Encodes an object identifier into bytes.
     *
     * @param {_PdfObjectIdentifier} value `_PdfObjectIdentifier` to encode.
     * @returns {Uint8Array} The encoded bytes.
     * @private
     */
    _encodeObjectIdentifier(value: _PdfObjectIdentifier): Uint8Array {
        return value._toBytes();
    }
    /**
     * Decodes bytes into an `_PdfObjectIdentifier` instance.
     *
     * @param {Uint8Array} value bytes to decode.
     * @returns {_PdfObjectIdentifier} The decoded `_PdfObjectIdentifier`.
     * @private
     */
    _decodeObjectIdentifier(value: Uint8Array): _PdfObjectIdentifier {
        const oid: _PdfObjectIdentifier = new _PdfObjectIdentifier();
        return oid._fromBytes(value);
    }
    /**
     * Encodes a relative object identifier into bytes.
     *
     * @param {number[]} value array of relative OID arcs.
     * @returns {Uint8Array} The encoded bytes.
     * @private
     */
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
    /**
     * Decodes bytes into a relative object identifier (array of arcs).
     *
     * @param {Uint8Array} value bytes to decode.
     * @returns {number[]} The decoded arcs.
     * @private
     */
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
    /**
     * Encodes a time string into bytes.
     *
     * @param {string} value time string to encode.
     * @returns  {Uint8Array} The encoded bytes.
     * @private
     */
    _encodeTime(value: string): Uint8Array {
        return _stringToBytes(value.replace(/,/g, '.')) as Uint8Array;
    }
    /**
     * Decodes time bytes into a string.
     *
     * @param {Uint8Array} bytes to decode.
     * @returns {string} The decoded time string.
     * @private
     */
    _decodeTime(bytes: Uint8Array): string {
        return _convertBytesToText(bytes);
    }
    /**
     * Encodes a `Date` into ASN.1 date bytes (YYYYMMDD).
     *
     * @param {Date} date to encode.
     * @returns {Uint8Array} The encoded date bytes.
     * @private
     */
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
    /**
     * Decodes ASN.1 date bytes (YYYYMMDD) into a `Date`.
     *
     * @param {Uint8Array} bytes to decode.
     * @returns {Date} The decoded `Date`.
     * @private
     */
    _decodeDate(bytes: Uint8Array): Date {
        const str: string = _convertBytesToText(bytes);
        const year: number = parseInt(str.slice(0, 4), 10);
        const month: number = parseInt(str.slice(4, 6), 10) - 1;
        const day: number = parseInt(str.slice(6, 8), 10);
        _validateDate('DATE', year, month, day);
        return new Date(year, month, day);
    }
    /**
     * Encodes a time-of-day `Date` into bytes (HHMMSS).
     *
     * @param {Date} time to encode.
     * @returns {Uint8Array} The encoded bytes.
     * @private
     */
    _encodeTimeOfDay(time: Date): Uint8Array {
        return _stringToBytes(
            _padStart(time.getHours().toString(), 2, '0')
            + _padStart(time.getMinutes().toString(), 2, '0')
            + _padStart(time.getSeconds().toString(), 2, '0')
        ) as Uint8Array;
    }
    /**
     * Decodes time-of-day bytes (HHMMSS) into a `Date`.
     *
     * @param {Uint8Array} bytes to decode.
     * @returns {Date} The decoded `Date`.
     * @private
     */
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
    /**
     * Decodes ASN.1 date-time bytes into a `Date`.
     *
     * @param {Uint8Array} bytes to decode.
     * @returns {Date} The decoded `Date`.
     * @private
     */
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
    /**
     * Decodes a GENERAL STRING ensuring only general characters are present.
     *
     * @param {Uint8Array} value to decode.
     * @returns {string} The decoded string.
     * @private
     */
    _decodeGeneralString(value: Uint8Array): string {
        for (let i: number = 0; i < value.length; i++) {
            const char: number = value[<number>i];
            if (!_isGeneralCharacter(char)) {
                throw new Error('The input must contain only standard ASCII characters.');
            }
        }
        return _convertBytesToText(value);
    }
    /**
     * Decodes a GRAPHIC STRING ensuring allowed graphic characters.
     *
     * @param {Uint8Array} value bytes to decode.
     * @returns {string} The decoded string.
     * @private
     */
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
    /**
     * Decodes a NUMERIC STRING ensuring only numeric characters and spaces.
     *
     * @param {Uint8Array} value bytes to decode.
     * @returns {string} The decoded string.
     * @private
     */
    _decodeNumericString(value: Uint8Array): string {
        for (let i: number = 0; i < value.length; i++) {
            const char: number = value[<number>i];
            if (!isNumericString(char)) {
                throw new Error('The input must contain only numeric characters and spaces.');
            }
        }
        return _convertBytesToText(value);
    }
    /**
     * Decodes an OBJECT DESCRIPTOR ensuring only allowed characters.
     *
     * @param {Uint8Array} value bytes to decode.
     * @returns {string} The decoded descriptor string.
     * @private
     */
    _decodeObjectDescriptor(value: Uint8Array): string {
        for (let i: number = 0; i < value.length; i++) {
            const char: number = value[<number>i];
            if (!_isGraphicCharacter(char)) {
                throw new Error('Only standard printable ASCII characters are allowed in the object descriptor.');
            }
        }
        return _convertBytesToText(value);
    }
    /**
     * Decodes an object-id resource identifier into a string.
     *
     * @param {Uint8Array} bytes to decode.
     * @returns {string} The decoded string.
     * @private
     */
    _decodeObjectIdResourceIdentifier(bytes: Uint8Array): string {
        return _convertBytesToText(bytes);
    }
    /**
     * Decodes a relative resource identifier into a string.
     *
     * @param {Uint8Array} bytes to decode.
     * @returns {string} The decoded string.
     * @private
     */
    _decodeRelativeResourceIdentifier(bytes: Uint8Array): string {
        return _convertBytesToText(bytes);
    }
    /**
     * Decodes a PRINTABLE STRING, validating allowed characters.
     *
     * @param {Uint8Array} value bytes to decode.
     * @returns {string} The decoded string.
     * @private
     */
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
    /**
     * Decodes a VISIBLE STRING, validating allowed graphic characters.
     *
     * @param {Uint8Array} value bytes to decode.
     * @returns {string} The decoded string.
     * @private
     */
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
    /**
     * Encodes a bit string into ASN.1 BIT STRING bytes.
     *
     * @param {Uint8ClampedArray} value bit string to encode.
     * @returns {Uint8Array} The encoded bytes.
     * @private
     */
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
    /**
     * Encodes a boolean into ASN.1 boolean bytes.
     *
     * @param {boolean} value boolean to encode.
     * @returns {Uint8Array} The encoded byte array.
     * @private
     */
    _encodeBoolean(value: boolean): Uint8Array {
        return new Uint8Array([(value ? 0xFF : 0x00)]);
    }
    /**
     * Encodes a `Date` into ASN.1 date-time bytes (YYYYMMDDHHMMSS).
     *
     * @param {Date} value The `Date` to encode.
     * @returns {Uint8Array}The encoded bytes.
     * @private
     */
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
    /**
     * Encodes an object-id resource identifier string into bytes.
     *
     * @param {string} value string to encode.
     * @returns {Uint8Array} The encoded bytes.
     * @private
     */
    _encodeObjectIdResourceIdentifier(value: string): Uint8Array {
        return _stringToBytes(value) as Uint8Array;
    }
    /**
     * Encodes a relative resource identifier string into bytes.
     *
     * @param {string} value string to encode.
     * @returns {Uint8Array} The encoded bytes.
     * @private
     */
    _encodeRelativeResourceIdentifier(value: string): Uint8Array {
        return _stringToBytes(value) as Uint8Array;
    }
    /**
     * Encodes a sequence of elements into a contiguous byte array.
     *
     * @param {_PdfAbstractSyntaxElement} value elements to encode.
     * @returns {Uint8Array} The concatenated bytes.
     * @private
     */
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
    /**
     * Encodes a numeric string into bytes.
     *
     * @param {string} value string to encode.
     * @returns {Uint8Array}The encoded bytes.
     * @private
     */
    _encodeNumericString (value: string): Uint8Array {
        return _stringToBytes(value) as Uint8Array;
    }
    /**
     * Encodes a printable string into bytes.
     *
     * @param {string} value string to encode.
     * @returns {Uint8Array} The encoded bytes.
     * @private
     */
    _encodePrintableString (value: string): Uint8Array {
        return _stringToBytes(value) as Uint8Array;
    }
    /**
     * Encodes a graphic string into bytes.
     *
     * @param {string} value string to encode.
     * @returns {Uint8Array} The encoded bytes.
     * @private
     */
    _encodeGraphicString(value: string): Uint8Array {
        return _stringToBytes(value) as Uint8Array;
    }
    /**
     * Encodes a visible string into bytes.
     *
     * @param {string} value to encode.
     * @returns {Uint8Array} The encoded bytes.
     * @private
     */
    _encodeVisibleString(value: string): Uint8Array {
        return _stringToBytes(value) as Uint8Array;
    }
    /**
     * Encodes an object descriptor into bytes.
     *
     * @param {string} value string to encode.
     * @returns {Uint8Array} The encoded bytes.
     * @private
     */
    _encodeObjectDescriptor(value: string): Uint8Array {
        return _stringToBytes(value) as Uint8Array;
    }
    /**
     * Returns the serialized bytes for this element (alias for `_toBytes`).
     *
     * @returns {Uint8Array} The serialized bytes.
     * @private
     */
    _toEncodedBytes(): Uint8Array {
        return this._toBytes();
    }
    /**
     * Indicates whether this element is context-tagged.
     *
     * @returns {boolean} if context tagged.
     * @private
     */
    _isTagged(): boolean {
        return this._tagClass === _TagClassType.context;
    }
    /**
     * Indicates whether this element is constructed.
     *
     * @returns {boolean} if constructed.
     * @private
     */
    _isConstructed(): boolean {
        return this._construction === _ConstructionType.constructed;
    }
}
