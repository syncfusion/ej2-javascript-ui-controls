import { _PdfAbstractSyntaxElement } from '../asn1/abstract-syntax';
import { _PdfAlgorithms } from './x509-algorithm';
import { _PdfUniqueBitString } from './x509-bit-string-handler';
/**
 * Container for public key information (AlgorithmIdentifier + public key BIT STRING).
 *
 * @private
 */
export class _PdfPublicKeyInformation {
    /**
     * Parsed algorithm identifier for the public key.
     *
     * @private
     * @type {_PdfAlgorithms}
     */
    _algorithms: _PdfAlgorithms;
    /**
     * Public key material represented as a unique-encoding BIT STRING.
     *
     * @private
     * @type {_PdfUniqueBitString}
     */
    _publicKey: _PdfUniqueBitString;
    constructor(algorithms?: _PdfAlgorithms, publicKey?: _PdfUniqueBitString) {
        if (algorithms && publicKey) {
            this._algorithms = algorithms;
            this._publicKey = publicKey;
        }
    }
    /**
     * Parse a SubjectPublicKeyInfo ASN.1 sequence into this helper.
     *
     * @private
     * @param {_PdfAbstractSyntaxElement} abstractSyntaxSequence - ASN.1 sequence to parse.
     * @returns {_PdfPublicKeyInformation} Parsed public key information instance.
     */
    _fromAbstractSyntax(abstractSyntaxSequence: _PdfAbstractSyntaxElement): _PdfPublicKeyInformation {
        const sequence: _PdfAbstractSyntaxElement[] = abstractSyntaxSequence._getSequence();
        if (!Array.isArray(sequence) || sequence.length !== 2) {
            throw new Error('Invalid length in sequence');
        }
        const algorithms: _PdfAlgorithms = new _PdfAlgorithms()._getAlgorithms(sequence[0]);
        const publicKey: _PdfUniqueBitString = new _PdfUniqueBitString()._fromAbstractSyntaxOctets(sequence[1]._getValue());
        return new _PdfPublicKeyInformation(algorithms, publicKey);
    }
    /**
     * Normalize an input into a `_PdfPublicKeyInformation` instance.
     *
     * @private
     * @param {any} obj - Candidate object or ASN.1 element.
     * @returns {_PdfPublicKeyInformation} The resolved public key information or undefined.
     */
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
