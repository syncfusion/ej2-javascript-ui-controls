import { _PdfObjectIdentifier } from './identifier-mapping';
import { _packBits } from './utils';
export class _PdfExternal {
    _directReference: _PdfObjectIdentifier;
    _indirectReference: number;
    _dataValueDescriptor: string;
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
