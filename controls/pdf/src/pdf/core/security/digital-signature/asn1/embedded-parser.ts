import { _PdfAbstractSyntaxElement } from './abstract-syntax';
export class _PdfEmbeddedDataValue {
    _identification: _PdfAbstractSyntaxElement;
    _dataValue: Uint8Array;
    constructor(identification: _PdfAbstractSyntaxElement, dataValue: Uint8Array) {
        if (identification && dataValue && dataValue.length > 0) {
            this._identification = identification;
            this._dataValue = dataValue;
        } else {
            throw new Error('Invalid constructor arguments: identification and non-empty dataValue are required.');
        }
    }
    _toString(): string {
        return (
            'EMBEDDED PDV { ' +
            `identification ${this._identification.toString()} ` +
            `dataValue ${Array.from(this._dataValue).map((byte: number) => byte.toString(16)).join('')} ` +
            '}'
        );
    }
    _toJson(): any {// eslint-disable-line
        return {
            identification: this._identification._toJson(),
            dataValue: Array.from(this._dataValue).map((byte: number) => byte.toString(16)).join('')
        };
    }
}
