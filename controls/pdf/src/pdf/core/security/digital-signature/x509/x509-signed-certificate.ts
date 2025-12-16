import { _ConstructionType, _TagClassType, _UniversalType } from '../asn1/enumerator';
import { _PdfAbstractSyntaxElement } from '../asn1/abstract-syntax';
import { _PdfUniqueEncodingElement } from '../asn1/unique-encoding-element';
import { _PdfAlgorithms } from './x509-algorithm';
import { _PdfUniqueBitString } from './x509-bit-string-handler';
import { _PdfPublicKeyInformation } from './x509-certificate-key';
import { _PdfX509Extensions } from './x509-extensions';
import { _PdfX509Name } from './x509-name';
import { _PdfX509Time } from './x509-time';
export class _PdfSignedCertificate {
    _sequence: _PdfAbstractSyntaxElement[];
    _version: number;
    _serialNumber: Uint8Array;
    _signature: _PdfAlgorithms;
    _issuer: _PdfX509Name;
    _startDate: _PdfX509Time;
    _endDate: _PdfX509Time;
    _subject: _PdfX509Name;
    _publicKeyInformation: _PdfPublicKeyInformation;
    _issuerID?: _PdfUniqueBitString;
    _subjectID?: _PdfUniqueBitString;
    _extensions?: _PdfX509Extensions;
    constructor(sequenceElement: _PdfAbstractSyntaxElement) {
        this._sequence = sequenceElement._getSequence();
        let seqStart: number = 0;
        if (this._sequence[0]._getTagNumber() === 0 && this._sequence[0]._tagClass === 2) {
            this._version = 2;
        } else {
            seqStart = -1;
            this._version = 0;
        }
        this._serialNumber = this._sequence[seqStart + 1]._getValue();
        this._signature = new _PdfAlgorithms(this._sequence[seqStart + 2]);
        this._issuer = new _PdfX509Name(this._sequence[seqStart + 3]._getSequence());
        const dates: _PdfAbstractSyntaxElement[] = this._sequence[seqStart + 4]._getSequence();
        this._startDate = new _PdfX509Time(dates[0]);
        this._endDate = new _PdfX509Time(dates[1]);
        this._subject = new _PdfX509Name(this._sequence[seqStart + 5]._getSequence());
        this._publicKeyInformation = new _PdfPublicKeyInformation()._getPublicKeyInformation(
            this._sequence[seqStart + 6]
        );
        const base: number = seqStart + 6;
        for (let i: number = this._sequence.length - 1; i > base; i--) {
            const extra: _PdfAbstractSyntaxElement = this._sequence[<number>i];
            const derString: _PdfUniqueBitString = new _PdfUniqueBitString();
            switch (extra._getTagNumber()) {
            case 1:
                this._issuerID = derString._getUniqueBitStringFromTag(extra, false);
                break;
            case 2:
                this._subjectID = derString._getUniqueBitStringFromTag(extra, false);
                break;
            case 3:
                this._extensions = new _PdfX509Extensions()._getInstance(extra);
                break;
            }
        }
    }
    _getVersion(): number {
        return this._version + 1;
    }
    _getDistinguishEncoded(): Uint8Array {
        const der: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
        der._tagClass = _TagClassType.universal;
        der._construction = _ConstructionType.constructed;
        der._setTagNumber(_UniversalType.sequence);
        der._setSequence(this._sequence);
        return der._toBytes();
    }
}
