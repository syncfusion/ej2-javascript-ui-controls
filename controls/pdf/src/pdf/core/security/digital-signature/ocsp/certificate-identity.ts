import { _createAsn1Constructed, _createPrimitive, _encodeObjectIdentifier } from '../../../utils';
import { _PdfAbstractSyntaxElement } from '../asn1/abstract-syntax';
import { _ConstructionType, _TagClassType, _UniversalType } from '../asn1/enumerator';
import { _PdfObjectIdentifier } from '../asn1/identifier-mapping';
import { _PdfUniqueEncodingElement } from '../asn1/unique-encoding-element';
import { _PdfMessageDigestAlgorithms } from '../signature/pdf-digest-algorithms';
import { _PdfAlgorithms } from '../x509/x509-algorithm';
import { _PdfX509Certificate } from '../x509/x509-certificate';
import { _PdfPublicKeyInformation } from '../x509/x509-certificate-key';
import { _PdfCipherParameter } from '../x509/x509-cipher-handler';
import { _PdfX509Name } from '../x509/x509-name';
import { _PdfSignedCertificate } from '../x509/x509-signed-certificate';
import { _PdfSubjectKeyID } from './certificate-utils';
/**
 * Represents a certificate identity used for PDF digital signatures.
 *
 * @private
 */
export class _PdfCertificateIdentity {
    /**
     * Helper object that stores the computed certificate identity data.
     *
     * @private
     */
    private _certificateId: _PdfCertificateIdentityHelper;
    /**
     * Initializes a new instance of the `_PdfCertificateIdentity` class.
     *
     * @private
     * @param {string} hashAlgorithm The hash algorithm name (for example, SHA1, SHA256).
     * @param {_PdfX509Certificate} issuerCert The issuer X.509 certificate.
     * @param {Uint8Array} serialNumber The serial number of the certificate.
     * @throws {Error} Throws an error when the certificate identity cannot be created.
     */
    constructor(hashAlgorithm: string, issuerCert: _PdfX509Certificate, serialNumber: Uint8Array) {
        const algorithms: _PdfAlgorithms = new _PdfAlgorithms();
        algorithms._objectID = new _PdfObjectIdentifier()._fromString(hashAlgorithm);
        algorithms._parameters = algorithms._getUniqueEncoderNull();
        algorithms._parametersDefined = true;
        try {
            const issuerName: _PdfX509Name = new _PdfSignedCertificate(this._getIssuer(issuerCert._getTobeSignedCertificate()))._subject;
            let utilities: _PdfMessageDigestAlgorithms = new _PdfMessageDigestAlgorithms();
            const issuerNameHash: Uint8Array = utilities._digest(this._getDerEncoded(issuerName._sequence), hashAlgorithm);
            const issuerKey: _PdfCipherParameter = issuerCert._getPublicKey();
            const info: _PdfPublicKeyInformation = new _PdfSubjectKeyID()._createSubjectKeyID(issuerKey, issuerCert._publicKeyBytes);
            utilities = new _PdfMessageDigestAlgorithms();
            const issuerKeyHash: Uint8Array = utilities._digest(info._publicKey._getBytes(), hashAlgorithm);
            this._certificateId = new _PdfCertificateIdentityHelper(
                algorithms,
                this._createPrimitive(_UniversalType.octetString, issuerNameHash),
                this._createPrimitive(_UniversalType.octetString, issuerKeyHash),
                serialNumber);
        } catch (e) {
            throw new Error('Invalid certificate ID');
        }
    }
    /**
     * Gets the computed certificate identity helper.
     *
     * @private
     * @returns {_PdfCertificateIdentityHelper} Certificate identity helper instance.
     */
    get _id(): _PdfCertificateIdentityHelper {
        return this._certificateId;
    }
    /**
     * Encodes the given ASN.1 sequence into DER format.
     *
     * @private
     * @param {_PdfAbstractSyntaxElement[]} seq1 ASN.1 elements to be encoded.
     * @returns {Uint8Array} DER-encoded byte representation of the sequence.
     */
    _getDerEncoded(seq1: _PdfAbstractSyntaxElement[]): Uint8Array {
        const der: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
        der._tagClass = _TagClassType.universal;
        der._construction = _ConstructionType.constructed;
        der._setTagNumber(_UniversalType.sequence);
        der._setSequence(seq1);
        return der._toBytes();
    }
    /**
     * Creates a primitive ASN.1 encoding element with the specified tag and value.
     *
     * @private
     * @param {number} tag Universal ASN.1 tag number.
     * @param {Uint8Array} value Byte value to be assigned to the element.
     * @returns {_PdfUniqueEncodingElement} Encoded primitive ASN.1 element.
     */
    _createPrimitive(tag: number, value: Uint8Array): _PdfUniqueEncodingElement {
        const element: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
        element._tagClass = _TagClassType.universal;
        element._construction = _ConstructionType.primitive;
        element._setTagNumber(tag);
        element._setValue(value);
        return element;
    }
    /**
     * Extracts the issuer information from the given
     * "to-be-signed" certificate byte sequence.
     *
     * @private
     * @param {Uint8Array} tbsCertBytes To-be-signed certificate bytes.
     * @returns {_PdfUniqueEncodingElement} Parsed ASN.1 encoding element.
     */
    _getIssuer(tbsCertBytes: Uint8Array): _PdfUniqueEncodingElement {
        const tbsElement: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
        tbsElement._fromBytes(tbsCertBytes);
        return tbsElement;
    }
}
/**
 * Helper class that represents certificate identity information
 * used during PDF digital signature validation.
 *
 * @private
 */
export class _PdfCertificateIdentityHelper {
    /**
     * Hash algorithm used to generate the certificate identity.
     *
     * @private
     */
    private _hash: _PdfAlgorithms;
    /**
     * Hash of the certificate issuer name.
     *
     * @private
     */
    private _issuerName: _PdfAbstractSyntaxElement;
    /**
     * Hash of the issuer public key.
     *
     * @private
     */
    private _issuerKey: _PdfAbstractSyntaxElement;
    /**
     * Certificate serial number.
     *
     * @private
     */
    private serialNumber: Uint8Array;
    /**
     * Initializes a new instance of the `_PdfCertificateIdentityHelper` class.
     *
     * @private
     * @param {_PdfAlgorithms} [hashAlgorithm] Hash algorithm used for identity calculation.
     * @param {_PdfAbstractSyntaxElement} [issuerNameHash] Hash of the issuer name.
     * @param {_PdfAbstractSyntaxElement} [issuerKeyHash] Hash of the issuer public key.
     * @param {Uint8Array} [serialNumber] Certificate serial number.
     */
    constructor(hashAlgorithm?: _PdfAlgorithms,
                issuerNameHash?: _PdfAbstractSyntaxElement,
                issuerKeyHash?: _PdfAbstractSyntaxElement,
                serialNumber?: Uint8Array) {
        if (hashAlgorithm && issuerNameHash && issuerKeyHash && serialNumber) {
            this._hash = hashAlgorithm;
            this._issuerName = issuerNameHash;
            this._issuerKey = issuerKeyHash;
            this.serialNumber = serialNumber;
        }
    }
    /**
     * Gets the certificate serial number.
     *
     * @private
     * @returns {Uint8Array} Certificate serial number.
     */
    get _serialNumber(): Uint8Array {
        return this.serialNumber;
    }
    /**
     * Creates a certificate identity helper from the given ASN.1 sequence.
     *
     * @private
     * @param {_PdfAbstractSyntaxElement} sequence ASN.1 sequence that represents
     * the certificate identity.
     * @returns {_PdfCertificateIdentityHelper} Certificate identity helper instance.
     * @throws {Error} Throws an error if the sequence length is invalid.
     */
    _fromSequence(sequence: _PdfAbstractSyntaxElement): _PdfCertificateIdentityHelper {
        const elements: _PdfAbstractSyntaxElement[] = sequence._getSequence();
        if (elements.length !== 4) {
            throw new Error('Invalid length in sequence');
        }
        const hash: _PdfAlgorithms = new _PdfAlgorithms()._getAlgorithms(elements[0]);
        const issuerName: _PdfAbstractSyntaxElement = elements[1] as _PdfUniqueEncodingElement;
        const issuerKey: _PdfAbstractSyntaxElement = elements[2] as _PdfUniqueEncodingElement;
        const serialNumber: Uint8Array = elements[3]._getValue();
        return new _PdfCertificateIdentityHelper(hash, issuerName, issuerKey, serialNumber);
    }
    /**
     * Gets the certificate identity helper from the specified object.
     *
     * @private
     * @param {*} object Object that represents a certificate identity.
     * @returns {_PdfCertificateIdentityHelper} Certificate identity helper instance.
     * @throws {Error} Throws an error if the object type is invalid.
     */
    _getCertificateIdentity(object: any): _PdfCertificateIdentityHelper { // eslint-disable-line
        if (typeof object === 'undefined' || object === null || object instanceof _PdfCertificateIdentityHelper) {
            return object as _PdfCertificateIdentityHelper;
        }
        if (object instanceof _PdfAbstractSyntaxElement) {
            return this._fromSequence(object);
        }
        throw new Error('Invalid entry in sequence');
    }
    /**
     * Creates and returns the ASN.1 representation of the certificate identity.
     *
     * @private
     * @returns {_PdfAbstractSyntaxElement} ASN.1 encoded certificate identity element.
     */
    _getASN1(): _PdfAbstractSyntaxElement {
        const digestAlgorithms: _PdfUniqueEncodingElement[] = [];
        let algorithmOid: string = this._hash._objectID._getDotDelimitedNotation();
        if (algorithmOid.charAt(0) === '0' && algorithmOid.charAt(1) === '.') {
            algorithmOid = algorithmOid.slice(2);
        }
        const oidEl: _PdfUniqueEncodingElement = _createPrimitive(_UniversalType.objectIdentifier,
                                                                  _encodeObjectIdentifier(algorithmOid));
        const nullEl: _PdfUniqueEncodingElement = _createPrimitive(_UniversalType.nullValue, new Uint8Array(0));
        digestAlgorithms.push(_createAsn1Constructed(_UniversalType.sequence, [oidEl, nullEl]));
        const serial: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement(
            _TagClassType.universal,
            _ConstructionType.primitive,
            _UniversalType.integer
        );
        serial._setValue(this._serialNumber);
        const sequence: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement(
            _TagClassType.universal,
            _ConstructionType.constructed,
            _UniversalType.sequence
        );
        sequence._setSequence([digestAlgorithms[0], this._issuerName, this._issuerKey, serial]);
        const outerSequence: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement(
            _TagClassType.universal,
            _ConstructionType.constructed,
            _UniversalType.sequence
        );
        outerSequence._setSequence([sequence]);
        return outerSequence;
    }
}
