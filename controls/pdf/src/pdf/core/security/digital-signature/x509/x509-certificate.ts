import { _ConstructionType } from '../asn1/enumerator';
import { _PdfAbstractSyntaxElement } from '../asn1/abstract-syntax';
import { _PdfBasicEncodingElement } from '../asn1/basic-encoding-element';
import { _PdfUniqueEncodingElement } from '../asn1/unique-encoding-element';
import { _PdfObjectIdentifier } from '../asn1/identifier-mapping';
import { _isBasicEncodingElement } from '../asn1/utils';
import { _PdfPublicKeyInformation } from './x509-certificate-key';
import { _PdfX509CertificateStructure } from './x509-certificate-structure';
import { _PdfCipherParameter, _PdfRonCipherParameter } from './x509-cipher-handler';
import { _PdfX509ExtensionBase, _PdfX509Extensions } from './x509-extensions';
import { _PdfSignedCertificate } from './x509-signed-certificate';
import { _PdfSignerUtilities } from '../signature/signature-utilities';
import { _ISigner } from '../signature/pdf-interfaces';
import { _padStart } from '../../../utils';
import { _PdfX509Name } from './x509-name';
/**
 * Wrapper around X.509 certificate data and helpers to extract keys and extensions.
 *
 * @private
 */
export class _PdfX509Certificate extends _PdfX509ExtensionBase {
    /**
     * Parsed certificate structure backing this certificate.
     *
     * @private
     * @type {_PdfX509CertificateStructure}
     */
    _structure: _PdfX509CertificateStructure;
    /**
     * Raw public key bytes extracted from the certificate (if available).
     *
     * @private
     * @type {Uint8Array}
     */
    _publicKeyBytes: Uint8Array;
    /**
     * Key usage bits parsed from the certificate extensions.
     *
     * @private
     * @type {boolean[]}
     */
    _keyUsage: boolean[] = [];
    constructor(certificate: _PdfX509CertificateStructure) {
        super();
        this._structure = certificate;
        const keyUsageOid: _PdfObjectIdentifier = new _PdfObjectIdentifier()._fromString('2.5.29.15');
        const keyUsageExt: _PdfAbstractSyntaxElement = this._getExtension(keyUsageOid);
        if (keyUsageExt) {
            const rawBytes: Uint8Array = keyUsageExt._getValue();
            const asn1Element: _PdfAbstractSyntaxElement = _isBasicEncodingElement(rawBytes)
                ? new _PdfBasicEncodingElement()
                : new _PdfUniqueEncodingElement();
            asn1Element._fromBytes(rawBytes);
            const bitStringElement: _PdfAbstractSyntaxElement = asn1Element._construction === _ConstructionType.constructed
                ? asn1Element._getInner()
                : asn1Element;
            const bitBytes: Uint8Array = bitStringElement._getValue();
            const unusedBits: number = bitBytes[0];
            const bits: Uint8Array = bitBytes.slice(1);
            const length: number = (bits.length * 8) - unusedBits;
            this._keyUsage = Array.from({ length: Math.max(9, length) }, (value: any, i: number) => { // eslint-disable-line
                return (bits[Math.floor(i / 8)] & (0x80 >> (i % 8))) !== 0;
            });
        } else {
            this._keyUsage = null;
        }
    }
    /**
     * Extracts all certificate properties into a single plain object.
     *
     * @returns {Object} An object containing all certificate property values.
     */
    _extractProperties(): {
        subject: string;
        issuer: string;
        subjectSimpleName: string;
        issuerSimpleName: string;
        serialNumber: string;
        validFrom: Date;
        validTo: Date;
        version: number;
        signatureAlgorithm: string;
        issuerUniqueId: Uint8Array;
        subjectUniqueId: Uint8Array; } {
        const signed: _PdfSignedCertificate = this._structure && typeof this._structure._getSignedCertificate === 'function'
            ? this._structure._getSignedCertificate() : undefined;
        const serialBytes: Uint8Array = signed ? signed._serialNumber : undefined;
        return {
            subject: signed ? this._formatDistinguishedName(signed._subject) : '',
            issuer: signed ? this._formatDistinguishedName(signed._issuer) : '',
            subjectSimpleName: signed ? this._extractCommonName(signed._subject) : '',
            issuerSimpleName: signed ? this._extractCommonName(signed._issuer) : '',
            serialNumber: (serialBytes && serialBytes.length > 0)
                ? Array.from(serialBytes).map((b: number) => _padStart(b.toString(16), 2, '0')).join('') : '',
            validFrom: (signed && signed._startDate && typeof signed._startDate._toDate === 'function')
                ? signed._startDate._toDate() : undefined,
            validTo: (signed && signed._endDate && typeof signed._endDate._toDate === 'function')
                ? signed._endDate._toDate() : undefined,
            version: (signed && typeof signed._getVersion === 'function') ? signed._getVersion() : 0,
            signatureAlgorithm: (signed && signed._signature && signed._signature._objectID)
                ? signed._signature._objectID.toString() : '',
            issuerUniqueId: (signed && signed._issuerID && signed._issuerID._data)
                ? signed._issuerID._data : undefined,
            subjectUniqueId: (signed && signed._subjectID && signed._subjectID._data)
                ? signed._subjectID._data : undefined
        };
    }
    /**
     * Extracts the CN (Common Name) value from a distinguished name object.
     *
     * @private
     * @param {any} dn The distinguished name to extract CN from.
     * @returns {string} The CN value, or full formatted DN as fallback.
     */
    private _extractCommonName(dn: any): string { //eslint-disable-line
        if (!dn || !dn._ordering || !dn._values) {
            return '';
        }
        const cnOid: string = '2.5.4.3';
        for (let i: number = 0; i < dn._ordering.length; i++) {
            const oid: string = dn._ordering[<number>i] ? dn._ordering[<number>i].toString() : '';
            if (oid === cnOid) {
                return dn._values[<number>i] || '';
            }
        }
        return this._formatDistinguishedName(dn);
    }
    /**
     * Formats an X.509 distinguished name into a readable string.
     *
     * @private
     * @param {_PdfX509Name} input The distinguished name to format.
     * @returns {string} Formatted DN string such as `"CN=Test, O=Org, C=US"`.
     */
    private _formatDistinguishedName(input: _PdfX509Name): string {
        if (!input || !input._ordering || !input._values) {
            return '';
        }
        const symbolMap: { [key: string]: string } = {
            '2.5.4.3': 'CN',
            '2.5.4.6': 'C',
            '2.5.4.7': 'L',
            '2.5.4.8': 'ST',
            '2.5.4.10': 'O',
            '2.5.4.11': 'OU',
            '1.2.840.113549.1.9.1': 'E',
            '2.5.4.12': 'T',
            '2.5.4.5': 'SN'
        };
        const parts: string[] = [];
        for (let i: number = 0; i < input._ordering.length; i++) {
            const oid: string = input._ordering[<number>i] ? input._ordering[<number>i].toString() : '';
            const label: string = symbolMap[<string>oid] || oid;
            const value: string = input._values[<number>i] || '';
            parts.push(`${label}=${value}`);
        }
        return parts.join(', ');
    }
    /**
     * Retrieve the certificate extensions wrapper when present.
     *
     * @private
     * @returns {_PdfX509Extensions} Certificate extensions container.
     */
    _getExtensions(): _PdfX509Extensions {
        const signed: _PdfSignedCertificate = this._structure._getSignedCertificate();
        return signed._getVersion() === 3 ? signed._extensions : new _PdfX509Extensions();
    }
    /**
     * Retrieves the certificate public key and converts it into a cipher parameter instance.
     *
     * @private
     * @param {boolean} [isPrivate=true] - Indicates whether the returned key parameter represents a private key. When false, a public key parameter is created.
     * @returns {_PdfCipherParameter} The generated key parameter object.
     */
    _getPublicKey(isPrivate: boolean = true): _PdfCipherParameter {
        const signed: _PdfSignedCertificate = this._structure._getSignedCertificate();
        return this._createKey(isPrivate, signed._publicKeyInformation);
    }
    /**
     * Create a cipher parameter object from SubjectPublicKeyInfo.
     *
     * @private
     * @param {boolean} isPrivate - Indicates whether the resulting parameter should9 * be created as a private or public key representation
     * @param {_PdfPublicKeyInformation} publicKeyInfo - The SubjectPublicKeyInfo11 * containing the algorithm identifier and encoded public key data.
     * @returns {_PdfCipherParameter} The generated cipher parameter object.
     * @throws {Error} Thrown if the public key algorithm is not supported.
     */
    _createKey(isPrivate: boolean, publicKeyInfo: _PdfPublicKeyInformation): _PdfCipherParameter {
        const algOID: string = publicKeyInfo._algorithms._objectID.toString();
        const publicKeyElement: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
        publicKeyElement._fromBytes(publicKeyInfo._publicKey._getBytes());
        this._publicKeyBytes = publicKeyInfo._publicKey._data;
        if (algOID === '1.2.840.113549.1.1.1') {
            return this._parsePublicKey(isPrivate, publicKeyElement);
        }
        throw new Error('Unsupported Algorithm');
    }
    /**
     * Parse an ASN.1 public key element (e.g., RSA modulus/exponent) into parameters.
     *
     * @private
     * @param {boolean} isPrivate - Indicates whether the resulting parameter should9 * be marked as a private or public key representation.
     * @param {_PdfAbstractSyntaxElement} publicKey - The ASN.1 encoded RSA public key11 * structure containing the modulus and public exponent values.
     * @returns {_PdfCipherParameter} The parsed RSA key parameters.
     * @throws {Error} Thrown if the RSA public key structure is invalid or incomplete.
     */
    _parsePublicKey(isPrivate: boolean, publicKey: _PdfAbstractSyntaxElement): _PdfCipherParameter {
        const seq: _PdfAbstractSyntaxElement[] = publicKey._getSequence();
        if (!seq || seq.length < 2) {
            throw new Error('Invalid RSA public key structure');
        }
        const modulus: Uint8Array = seq[0]._getValue();
        const exponent: Uint8Array = seq[1]._getValue();
        return new _PdfRonCipherParameter(isPrivate, modulus, exponent);
    }
    /**
     * Return the DER bytes for the tbsCertificate (to-be-signed certificate).
     *
     * @private
     * @returns {Uint8Array} DER-encoded tbsCertificate bytes.
     */
    _getTobeSignedCertificate(): Uint8Array {
        const signed: _PdfSignedCertificate = this._structure._getSignedCertificate();
        return signed._getDistinguishEncoded();
    }
    /**
     * Return the DER encoding for the entire certificate structure.
     *
     * @private
     * @returns {Uint8Array} DER-encoded certificate bytes.
     */
    _getEncoded(): Uint8Array {
        const asn1Element: Uint8Array = this._structure._getDerEncoded();
        return asn1Element;
    }
    /**
     * Alias for `_getEncoded` returning the encoded certificate bytes.
     *
     * @private
     * @returns {Uint8Array} DER-encoded certificate bytes.
     */
    _getEncodedString(): Uint8Array {
        return this._getEncoded();
    }
    /**
     * Verifies the certificate signature using the provided public key.
     *
     * @private
     * @param {_PdfCipherParameter} key The public key parameters used to verify the signature.
     * @returns {void} This method does not return a value. Throws an error if validation fails.
     */
    _verify(key: _PdfCipherParameter): void {
        const sigName: string = this._structure._signatureAlgorithmIdentifier._objectID.toString();
        const su: _PdfSignerUtilities = new _PdfSignerUtilities();
        const signature: _ISigner = su._getSigner(sigName);
        this._checkSignature(key, signature);
    }
    /**
     * Validates the certificate signature against the given public key and signer.
     *
     * @private
     * @param {_PdfCipherParameter} publicKey The public key used for signature verification.
     * @param {_ISigner} signature The initialized signer corresponding to the certificate algorithm.
     * @returns {void} This method does not return a value. Throws an error if validation fails.
     */
    private _checkSignature(publicKey: _PdfCipherParameter, signature: _ISigner): void {
        const IssuerName: string = this._structure._signatureAlgorithmIdentifier._objectID._getDotDelimitedNotation();
        const SubjectName: string = this._structure._toBeSignedCertificate._signature._objectID._getDotDelimitedNotation();
        if (!(IssuerName === SubjectName)) {
            throw new Error('signature algorithm in TBS certificate not same as outer certificate');
        }
        signature._initialize(false, publicKey);
        const b: Uint8Array = this._getTobeSignedCertificate();
        signature._blockUpdate(b, 0, b.length);
        const sig: Uint8Array = this._structure._signature._getBytes();
        const ok: boolean = signature._validateSignature(sig);
        if (!ok) {
            throw new Error('Public key presented not for certificate signature');
        }
    }
}
/**
 * Simple container for a certificate and cached hash state.
 *
 * @private
 */
export class _PdfX509Certificates {
    /**
     * The contained X.509 certificate.
     *
     * @private
     * @type {_PdfX509Certificate}
     */
    _certificate: _PdfX509Certificate;
    /**
     * Cached hash value for this certificate (implementation specific).
     *
     * @private
     * @type {number}
     */
    _hashValue: number;
    /**
     * True when `_hashValue` has been computed and stored.
     *
     * @private
     * @type {boolean}
     */
    _hashValueSet: boolean = false;
    constructor(certificates: _PdfX509Certificate) {
        this._certificate = certificates;
    }
}
