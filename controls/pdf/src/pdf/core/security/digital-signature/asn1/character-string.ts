import { _PdfAbstractSyntaxElement } from './abstract-syntax';
export class _PdfCharacterString {
    _identification: _PdfAbstractSyntaxElement;
    _stringValue: Uint8Array;
    constructor(identification: _PdfAbstractSyntaxElement, stringValue: Uint8Array) {
        this._identification = identification;
        this._stringValue = stringValue;
    }
    _toString(): string {
        return (
            'CHARACTER STRING { ' +
            `identification ${this._identification._toString()} ` +
            `dataValue ${Array.from(this._stringValue).map((byte: number) => byte.toString(16)).join('')} ` +
            '}'
        );
    }
    _toJson(): any {// eslint-disable-line
        return {
            identification: this._identification._toJson(),
            dataValue: Array.from(this._stringValue).map((byte: number) => byte.toString(16)).join('')
        };
    }
}
