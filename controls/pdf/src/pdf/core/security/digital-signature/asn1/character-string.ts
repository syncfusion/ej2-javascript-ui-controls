import { _PdfAbstractSyntaxElement } from './abstract-syntax';
/**
 * Represents an internal PDF character string structure used for parsing and serializing PDF syntax elements.
 *
 * @private
 */
export class _PdfCharacterString {
    /**
     * Represents the internal identification element associated with the character string.
     *
     * @private
     */
    _identification: _PdfAbstractSyntaxElement;
    /**
     * Represents the raw byte sequence stored in the character string.
     *
     * @private
     */
    _stringValue: Uint8Array;
    constructor(identification: _PdfAbstractSyntaxElement, stringValue: Uint8Array) {
        this._identification = identification;
        this._stringValue = stringValue;
    }
    /**
     * Converts the internal character string into a readable textual representation.
     *
     * @private
     * @returns {string} A formatted string describing the identification and data value.
     */
    _toString(): string {
        return (
            'CHARACTER STRING { ' +
            `identification ${this._identification._toString()} ` +
            `dataValue ${Array.from(this._stringValue).map((byte: number) => byte.toString(16)).join('')} ` +
            '}'
        );
    }
    /**
     * Converts the internal character string into a JSON-compatible representation.
     *
     * @private
     * @returns {any} A JSON object containing identification and data value information.
     */
    _toJson(): any {// eslint-disable-line
        return {
            identification: this._identification._toJson(),
            dataValue: Array.from(this._stringValue).map((byte: number) => byte.toString(16)).join('')
        };
    }
}
