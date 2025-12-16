import { _bytesToString } from '../../../utils';
import { _PdfAbstractSyntaxElement } from '../asn1/abstract-syntax';
import { _PdfBasicEncodingElement } from '../asn1/basic-encoding-element';
import { _PdfUniqueEncodingElement } from '../asn1/unique-encoding-element';
import { _PdfObjectIdentifier } from '../asn1/identifier-mapping';
export class _PdfX509Name {
    _ordering: _PdfObjectIdentifier[] = [];
    _values: string[] = [];
    private _added: boolean[] = [];
    private _sequence: _PdfAbstractSyntaxElement[];
    private _defaultSymbols: Map<string, string>;
    private readonly _countryNameOid: string = '2.5.4.6';
    private readonly _organizationNameOid: string = '2.5.4.10';
    private readonly _organizationalUnitNameOid: string = '2.5.4.11';
    private readonly _titleOid: string = '2.5.4.12';
    private readonly _commonNameOid: string = '2.5.4.3';
    constructor(sequence: _PdfAbstractSyntaxElement[]) {
        this._sequence = sequence;
        this._defaultSymbols = new Map([
            [this._countryNameOid, 'C'],
            [this._organizationNameOid, 'O'],
            [this._organizationalUnitNameOid, 'OU'],
            [this._titleOid, 'T'],
            [this._commonNameOid, 'CN']
        ]);
        sequence.forEach((element: _PdfAbstractSyntaxElement) => {
            if (element) {
                const sequence: _PdfAbstractSyntaxElement[] = element._getSequence();
                sequence.forEach((setElement: _PdfAbstractSyntaxElement, idx: number) => {
                    let sequences: _PdfAbstractSyntaxElement[] = [];
                    if (setElement) {
                        sequences = setElement._getSequence();
                    }
                    if (sequences && sequences.length >= 2) {
                        const oid: _PdfObjectIdentifier = new _PdfObjectIdentifier()._fromBytes(sequences[0]._getValue());
                        this._ordering.push(oid);
                        const valueElement: _PdfAbstractSyntaxElement = sequences[1];
                        let value: string = '';
                        if (valueElement instanceof _PdfUniqueEncodingElement || valueElement instanceof _PdfBasicEncodingElement) {
                            value = _bytesToString(valueElement._getOctetString());
                        }
                        this._values.push(value);
                        this._added.push(idx !== 0);
                    }
                });
            }
        });
    }
}
