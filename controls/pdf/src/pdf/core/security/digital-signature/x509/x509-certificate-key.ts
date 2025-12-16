import { _PdfAbstractSyntaxElement } from '../asn1/abstract-syntax';
import { _PdfAlgorithms } from './x509-algorithm';
import { _PdfUniqueBitString } from './x509-bit-string-handler';
export class _PdfPublicKeyInformation {
    _algorithms: _PdfAlgorithms;
    _publicKey: _PdfUniqueBitString;
    constructor(algorithms?: _PdfAlgorithms, publicKey?: _PdfUniqueBitString) {
        if (algorithms && publicKey) {
            this._algorithms = algorithms;
            this._publicKey = publicKey;
        }
    }
    _fromAbstractSyntax(abstractSyntaxSequence: _PdfAbstractSyntaxElement): _PdfPublicKeyInformation {
        const sequence: _PdfAbstractSyntaxElement[] = abstractSyntaxSequence._getSequence();
        if (!Array.isArray(sequence) || sequence.length !== 2) {
            throw new Error('Invalid length in sequence');
        }
        const algorithms: _PdfAlgorithms = new _PdfAlgorithms()._getAlgorithms(sequence[0]);
        const publicKey: _PdfUniqueBitString = new _PdfUniqueBitString()._fromAbstractSyntaxOctets(sequence[1]._getValue());
        return new _PdfPublicKeyInformation(algorithms, publicKey);
    }
    _getPublicKeyInformation(obj: any): _PdfPublicKeyInformation {// eslint-disable-line
        if (obj instanceof _PdfPublicKeyInformation) {
            return obj;
        }
        if (obj && (obj as _PdfAbstractSyntaxElement)._getSequence()) {
            return this._fromAbstractSyntax(obj as _PdfAbstractSyntaxElement);
        }
        return undefined;
    }
}
