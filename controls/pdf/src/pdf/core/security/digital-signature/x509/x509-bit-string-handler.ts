import { _ConstructionType, _TagClassType, _UniversalType } from '../asn1/enumerator';
import { _PdfAbstractSyntaxElement } from '../asn1/abstract-syntax';
import { _PdfUniqueEncodingElement } from '../asn1/unique-encoding-element';
export class _PdfUniqueBitString {
    readonly _data: Uint8Array = new Uint8Array(0);
    readonly _extraBits: number = 0;
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
    _fromAbstractSyntaxOctets(bytes: Uint8Array): _PdfUniqueBitString {
        return new _PdfUniqueBitString(bytes.subarray(1),  bytes[0]);
    }
    _getBytes(): Uint8Array {
        return this._data;
    }
    _getUniqueEncoded(): Uint8Array {
        const output: Uint8Array = new Uint8Array(this._data.length + 1);
        output[0] = this._extraBits;
        output.set(this._data, 1);
        return output;
    }
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
    _getUniqueBitStringFromTag(tag: _PdfAbstractSyntaxElement, isExplicit: boolean): _PdfUniqueBitString {
        const asn1: _PdfAbstractSyntaxElement = tag._getInner();
        const derString: _PdfUniqueBitString = new _PdfUniqueBitString();
        if (isExplicit || asn1 instanceof _PdfUniqueBitString) {
            return derString._getUniqueBitString(asn1);
        }
        return derString._fromAbstractSyntaxOctets(asn1._getOctetString());
    }
    _getUniqueBitString(obj: any): _PdfUniqueBitString { // eslint-disable-line
        if (obj === null || typeof obj === 'undefined') {
            return null;
        }
        if (obj instanceof _PdfUniqueBitString) {
            return obj;
        }
        throw new Error('Invalid Entry');
    }
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
