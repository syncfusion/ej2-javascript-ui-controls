import { _ConstructionType, _TagClassType, _UniversalType } from '../asn1/enumerator';
import { _PdfAbstractSyntaxElement } from '../asn1/abstract-syntax';
import { _PdfUniqueEncodingElement } from '../asn1/unique-encoding-element';
import { _PdfObjectIdentifier } from '../asn1/identifier-mapping';
/**
 * Represents algorithm identifier components parsed from ASN.1 AlgorithmIdentifier.
 *
 * @private
 */
export class _PdfAlgorithms {
    /**
     * The ASN.1 element that identifies the algorithm.
     *
     * @private
     * @type {_PdfAbstractSyntaxElement}
     */
    _element: _PdfAbstractSyntaxElement;
    /**
     * The parsed object identifier for the algorithm.
     *
     * @private
     * @type {_PdfObjectIdentifier}
     */
    _objectID: _PdfObjectIdentifier;
    /**
     * Optional ASN.1 parameters element for the algorithm.
     *
     * @private
     * @type {_PdfAbstractSyntaxElement|undefined}
     */
    _parameters?: _PdfAbstractSyntaxElement;
    /**
     * True when the algorithm parameters are present on the element.
     *
     * @private
     * @type {boolean}
     */
    _parametersDefined: boolean;
    constructor(element?: _PdfAbstractSyntaxElement) {
        if (element) {
            this._element = element;
            const list: _PdfAbstractSyntaxElement[] = element._getSequence();
            if (!list || list.length < 1 || list.length > 2) {
                throw new Error('Invalid Algorithm Identifier sequence length');
            }
            const oidElement: _PdfAbstractSyntaxElement = list[0];
            const oidBytes: Uint8Array = oidElement._getValue();
            this._objectID = new _PdfObjectIdentifier()._fromBytes(oidBytes);
            if (list.length === 2) {
                this._parameters = list[1];
                this._parametersDefined = true;
            } else {
                this._parametersDefined = false;
            }
        }
    }
    /**
     * Normalize or construct a `_PdfAlgorithms` instance from an input value.
     *
     * @private
     * @param {any} obj - Candidate object or ASN.1 element to convert.
     * @returns {_PdfAlgorithms} The resolved algorithms instance or undefined.
     */
    _getAlgorithms(obj: any): _PdfAlgorithms { // eslint-disable-line
        if (obj instanceof _PdfAlgorithms) {
            return obj;
        }
        if (obj instanceof _PdfAbstractSyntaxElement) {
            return new _PdfAlgorithms(obj as _PdfAbstractSyntaxElement);
        }
        return undefined;
    }
    /**
     * Return the DER/unique encoding bytes for the underlying element.
     *
     * @private
     * @returns {Uint8Array} The encoded bytes for the algorithm identifier.
     */
    _uniqueEncoderEncode(): Uint8Array {
        if (this._element) {
            return this._element._getValue();// eslint-disable-line
        }
        throw new Error('Cannot DER encode: not a DER element');
    }
    /**
     * Create an ASN.1 NULL unique encoder element.
     *
     * @private
     * @returns {_PdfAbstractSyntaxElement} A DER NULL element.
     */
    _getUniqueEncoderNull(): _PdfAbstractSyntaxElement {
        const derNull: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
        derNull._setTagNumber(5);
        derNull._tagClass = 0;
        derNull._setValue(new Uint8Array(0));
        return derNull;
    }
    /**
     * Build an abstract syntax element representing the AlgorithmIdentifier sequence.
     *
     * @private
     * @returns {_PdfUniqueEncodingElement} The constructed ASN.1 sequence element.
     */
    _getAbstractSyntax(): _PdfUniqueEncodingElement {
        const seq: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement(
            _TagClassType.universal,
            _ConstructionType.constructed,
            _UniversalType.sequence
        );
        const oidElement: _PdfAbstractSyntaxElement = new _PdfUniqueEncodingElement(_TagClassType.universal,
                                                                                    _ConstructionType.primitive,
                                                                                    6);
        const elements: _PdfAbstractSyntaxElement[] = [oidElement];
        seq._setSequence(elements);
        return seq;
    }
}
