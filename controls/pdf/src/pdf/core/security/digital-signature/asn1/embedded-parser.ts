import { _PdfAbstractSyntaxElement } from './abstract-syntax';
/**
 * Represents an internal embedded data value that stores identification information
 * along with its corresponding raw byte content.
 *
 * @private
 */
export class _PdfEmbeddedDataValue {
    /**
     * Represents the internal identification element associated with the embedded data value.
     *
     * @private
     */
    _identification: _PdfAbstractSyntaxElement;
    /**
     * Represents the internal byte sequence containing the embedded data value.
     *
     * @private
     */
    _dataValue: Uint8Array;
    constructor(identification: _PdfAbstractSyntaxElement, dataValue: Uint8Array) {
        if (identification && dataValue && dataValue.length > 0) {
            this._identification = identification;
            this._dataValue = dataValue;
        } else {
            throw new Error('Invalid constructor arguments: identification and non-empty dataValue are required.');
        }
    }
    /**
     * Converts the internal embedded data value into a readable textual representation.
     *
     * @private
     * @returns {string} A formatted string describing the identification and hexadecimal byte content.
     */
    _toString(): string {
        return (
            'EMBEDDED PDV { ' +
            `identification ${this._identification.toString()} ` +
            `dataValue ${Array.from(this._dataValue).map((byte: number) => byte.toString(16)).join('')} ` +
            '}'
        );
    }
    /**
     * Converts the internal embedded data value into a JSON compatible representation.
     *
     * @private
     * @returns {any} A JSON object containing the identification and encoded data value.
     */
    _toJson(): any {// eslint-disable-line
        return {
            identification: this._identification._toJson(),
            dataValue: Array.from(this._dataValue).map((byte: number) => byte.toString(16)).join('')
        };
    }
}
