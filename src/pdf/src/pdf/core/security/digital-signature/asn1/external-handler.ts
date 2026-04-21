import { _PdfObjectIdentifier } from './identifier-mapping';
import { _packBits } from './utils';
/**
 * Represents an internal structure used to describe external PDF data,
 * including object references, descriptors, and encoded content.
 *
 * @private
 */
export class _PdfExternal {
    /**
     * Represents the internal direct object reference associated with the external value.
     *
     * @private
     */
    _directReference: _PdfObjectIdentifier;
    /**
     * Represents the internal indirect reference number linked to the external value.
     *
     * @private
     */
    _indirectReference: number;
    /**
     * Represents the internal data value descriptor that describes the nature of the external content.
     *
     * @private
     */
    _dataValueDescriptor: string;
    /**
     * Represents the internal encoding of the external data, which may include byte arrays,
     * bit strings, or single ASN.1 type encodings.
     *
     * @private
     */
    _encoding: any; //eslint-disable-line
    constructor(directReference: _PdfObjectIdentifier, indirectReference: number,
                dataValueDescriptor: string,
                encoding: any) { //eslint-disable-line
        if (encoding && directReference && dataValueDescriptor && indirectReference) {
            this._directReference = directReference;
            this._indirectReference = indirectReference;
            this._dataValueDescriptor = dataValueDescriptor;
            this._encoding = encoding;
        } else {
            throw new Error('Invalid constructor arguments');
        }
    }
    /**
     * Converts the internal external value into a human readable string representation.
     *
     * @private
     * @returns {string} A formatted textual representation of the external data value.
     */
    _toString(): string {
        let result: string = 'EXTERNAL { ';
        if (this._directReference) {
            result += `directReference ${this._directReference.toString()} `;
        }
        if (this._indirectReference) {
            result += `indirectReference ${this._indirectReference.toString()} `;
        }
        if (this._dataValueDescriptor) {
            result += `dataValueDescriptor '${this._dataValueDescriptor}' `;
        }
        if (this._encoding instanceof Uint8Array) {
            result += `octet-aligned ${Array.from(this._encoding).map((byte: number) => byte.toString(16)).join('')} `;
        } else if (this._encoding instanceof Uint8ClampedArray) {
            result += `arbitrary ${this._encoding.toString()} `;
        } else {
            result += `single-ASN1-type ${this._encoding.toString()} `;
        }
        result += '}';
        return result;
    }
    /**
     * Converts the internal external value into a JSON compatible representation.
     *
     * @private
     * @returns {any} A JSON object containing the external value s references, descriptor,
     * and encoded data.
     */
    _toJson(): any { // eslint-disable-line
        let encoding: any; // eslint-disable-line
        if (this._encoding instanceof Uint8Array) {
            encoding = Array.from(this._encoding)
                .map((byte: number) => byte.toString(16))
                .join('');
        } else if (this._encoding instanceof Uint8ClampedArray) {
            const bits: Uint8ClampedArray = this._encoding;
            encoding = { length: bits.length,
                value: Array.from(_packBits(bits))
                    .map((byte: number) => byte.toString(16))
                    .join('')
            };
        }
        return {
            directReference: this._directReference,
            indirectReference: this._indirectReference,
            dataValueDescriptor: this._dataValueDescriptor,
            encoding
        };
    }
}
