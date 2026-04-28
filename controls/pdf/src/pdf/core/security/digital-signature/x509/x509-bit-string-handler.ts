import { _ConstructionType, _TagClassType, _UniversalType } from '../asn1/enumerator';
import { _PdfAbstractSyntaxElement } from '../asn1/abstract-syntax';
import { _PdfUniqueEncodingElement } from '../asn1/unique-encoding-element';
/**
 * Represents a unique-encoding BIT STRING with optional padding information.
 *
 * @private
 */
export class _PdfUniqueBitString {
    /**
     * Bit-string raw data bytes (excluding the initial octet that encodes unused bits).
     *
     * @private
     * @type {Uint8Array}
     */
    readonly _data: Uint8Array = new Uint8Array(0);
    /**
     * Count of unused padding bits in the final data octet.
     *
     * @private
     * @type {number}
     */
    readonly _extraBits: number = 0;
    /**
     * Hex character lookup table used for string conversions.
     *
     * @private
     * @type {string[]}
     */
    readonly _table: string[] = [
        '0', '1', '2', '3', '4', '5', '6', '7',
        '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'
    ];
    constructor(data?: Uint8Array, pad?: number) {
        if (data && data.length > 0) {
            this._data = data;
            this._extraBits = typeof pad === 'number' ? pad : 0;
        }
    }
    /**
     * Create a `_PdfUniqueBitString` from ASN.1 BIT STRING octets.
     *
     * @private
     * @param {Uint8Array} bytes - Raw BIT STRING octets (first octet = unused bits).
     * @returns {_PdfUniqueBitString} Parsed unique bit string instance.
     */
    _fromAbstractSyntaxOctets(bytes: Uint8Array): _PdfUniqueBitString {
        return new _PdfUniqueBitString(bytes.subarray(1),  bytes[0]);
    }
    /**
     * Return the raw payload bytes of the bit string (without the initial unused-bits octet).
     *
     * @private
     * @returns {Uint8Array} The raw data bytes.
     */
    _getBytes(): Uint8Array {
        return this._data;
    }
    /**
     * Produce the ASN.1 BIT STRING octets including the unused-bits header octet.
     *
     * @private
     * @returns {Uint8Array} The encoded bit string octets.
     */
    _getUniqueEncoded(): Uint8Array {
        const output: Uint8Array = new Uint8Array(this._data.length + 1);
        output[0] = this._extraBits;
        output.set(this._data, 1);
        return output;
    }
    /**
     * Determine equality with another `_PdfUniqueBitString` instance.
     *
     * @private
     * @param {any} other - Candidate object to compare.
     * @returns {boolean} True when both instances contain identical data and padding.
     */
    _equals(other: any): boolean { // eslint-disable-line
        if (!(other instanceof _PdfUniqueBitString)) {
            return false;
        }
        if (this._extraBits !== other._extraBits) {
            return false;
        }
        if (this._data.length !== other._data.length) {
            return false;
        }
        for (let i: number = 0; i < this._data.length; i++) {
            if (this._data[<number>i] !== other._data[<number>i]) {
                return false;
            }
        }
        return true;
    }
    /**
     * Extract a `_PdfUniqueBitString` from an ASN.1 element tag, handling explicit/implicit forms.
     *
     * @private
     * @param {_PdfAbstractSyntaxElement} tag - ASN.1 element that may contain a bit string.
     * @param {boolean} isExplicit - True when the bit string is explicitly tagged.
     * @returns {_PdfUniqueBitString} The extracted unique bit string.
     */
    _getUniqueBitStringFromTag(tag: _PdfAbstractSyntaxElement, isExplicit: boolean): _PdfUniqueBitString {
        const asn1: _PdfAbstractSyntaxElement = tag._getInner();
        const derString: _PdfUniqueBitString = new _PdfUniqueBitString();
        if (isExplicit || asn1 instanceof _PdfUniqueBitString) {
            return derString._getUniqueBitString(asn1);
        }
        return derString._fromAbstractSyntaxOctets(asn1._getOctetString());
    }
    /**
     * Normalize or validate an input expected to be a `_PdfUniqueBitString`.
     *
     * @private
     * @param {any} obj - Candidate value.
     * @returns {_PdfUniqueBitString} The input if it is already a bit-string instance.
     */
    _getUniqueBitString(obj: any): _PdfUniqueBitString { // eslint-disable-line
        if (obj === null || typeof obj === 'undefined') {
            return null;
        }
        if (obj instanceof _PdfUniqueBitString) {
            return obj;
        }
        throw new Error('Invalid Entry');
    }
    /**
     * Create an ASN.1 abstract-syntax element representing this BIT STRING.
     *
     * @private
     * @returns {_PdfUniqueEncodingElement} ASN.1 element for the bit string.
     */
    _getAbstractSyntax(): _PdfUniqueEncodingElement {
        const element: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement(
            _TagClassType.universal,
            _ConstructionType.primitive,
            _UniversalType.bitString
        );
        element._setValue(this._getUniqueEncoded());
        return element;
    }
}
