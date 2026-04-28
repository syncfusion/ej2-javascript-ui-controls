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
     * Extract and return the public key parameters for this certificate.
     *
     * @private
     * @returns {_PdfCipherParameter} The parsed public key parameters.
     */
    _getPublicKey(): _PdfCipherParameter {
        const signed: _PdfSignedCertificate = this._structure._getSignedCertificate();
        return this._createKey(signed._publicKeyInformation);
    }
    /**
     * Create a cipher parameter object from SubjectPublicKeyInfo.
     *
     * @private
     * @param {_PdfPublicKeyInformation} publicKeyInfo - Parsed public key information.
     * @returns {_PdfCipherParameter} The created cipher parameter instance.
     */
    _createKey(publicKeyInfo: _PdfPublicKeyInformation): _PdfCipherParameter {
        const algOID: string = publicKeyInfo._algorithms._objectID.toString();
        const publicKeyElement: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
        publicKeyElement._fromBytes(publicKeyInfo._publicKey._getBytes());
        this._publicKeyBytes = publicKeyInfo._publicKey._data;
        if (algOID === '1.2.840.113549.1.1.1') {
            return this._parsePublicKey(publicKeyElement);
        }
        throw new Error('Unsupported Algorithm');
    }
    /**
     * Parse an ASN.1 public key element (e.g., RSA modulus/exponent) into parameters.
     *
     * @private
     * @param {_PdfAbstractSyntaxElement} publicKey - ASN.1 element containing public key data.
     * @returns {_PdfCipherParameter} The parsed cipher parameters.
     */
    _parsePublicKey(publicKey: _PdfAbstractSyntaxElement): _PdfCipherParameter {
        const seq: _PdfAbstractSyntaxElement[] = publicKey._getSequence();
        if (!seq || seq.length < 2) {
            throw new Error('Invalid RSA public key structure');
        }
        const modulus: Uint8Array = seq[0]._getValue();
        const exponent: Uint8Array = seq[1]._getValue();
        return new _PdfRonCipherParameter(true, modulus, exponent);
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
