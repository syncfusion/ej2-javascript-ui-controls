import { _ConstructionType, _TagClassType, _UniversalType } from './../asn1/enumerator';
import { CryptographicStandard } from './../../../enumerator';
import { _PdfAbstractSyntaxElement } from '../asn1/abstract-syntax';
import { _PdfUniqueEncodingElement } from '../asn1/unique-encoding-element';
import { _PdfBasicEncodingElement } from '../asn1/basic-encoding-element';
import { _PdfObjectIdentifier } from '../asn1/identifier-mapping';
import { _PdfX509Certificate } from '../x509/x509-certificate';
import { _PdfMessageDigestAlgorithms } from './pdf-digest-algorithms';
import { _ICipherParam } from './pdf-interfaces';
import { _PdfDigitalIdentifiers } from './pdf-object-identifiers';
import { _PdfSignedCertificate } from '../x509/x509-signed-certificate';
import { PdfSignature } from './pdf-signature';
/**
 * Cryptographic Message Syntax signer helper that builds and parses PKCS#7/CMS
 * structures and provides signing utilities used by PDF signature creation.
 *
 * @private
 */
export class _PdfCryptographicMessageSyntaxSigner {
    /**
     * Message digest algorithm helpers used for hashing operations.
     */
    private _digestAlgorithm: _PdfMessageDigestAlgorithms = new _PdfMessageDigestAlgorithms();
    /**
     * Version of the signed-data structure.
     */
    private _version: number;
    /**
     * Signer version number used in signer info.
     */
    private _signerVersion: number;
    /**
     * Certificate chain used for signing.
     */
    private _certificates: _PdfX509Certificate[];
    /**
     * Mapping of digest algorithm OIDs to values used in signed attributes.
     */
    private _digestObjectIdentifier: Map<string, any>; // eslint-disable-line
    /**
     * Object identifier string for the selected digest algorithm.
     */
    private _digestAlgorithmObjectIdentifier: string;
    /**
     * The certificate used to sign the content.
     */
    private _signatureCertificate: _PdfX509Certificate;
    /**
     * Object identifier for the encryption/signature algorithm.
     */
    private _encryptionAlgorithmObjectIdentifier: string;
    /**
     * Cached hash algorithm name derived from digest OID.
     */
    private _hashAlgorithm: string;
    /**
     * RSA-related raw data used during signing.
     */
    private _rsaData: Uint8Array;
    /**
     * Raw signed data bytes when provided externally.
     */
    private _signedData: Uint8Array;
    /**
     * Raw signed RSA data bytes when provided externally.
     */
    private _signedRsaData: Uint8Array;
    /**
     * Cached digest used for signature generation.
     */
    private _digest: Uint8Array;
    /**
     * Indicates whether a timestamp token is present on the signature.
     *
     * @private
     */
    _hasTimeStamp: boolean = false;
    /**
     * Raw timestamp token bytes when present.
     *
     * @private
     */
    _timeStampTokenBytes: Uint8Array;
    /**
     * When true, the signer represents timestamp-only content.
     *
     * @private
     */
    _isTimestampOnly: boolean = false;
    constructor(bytes: Uint8Array, subFilter: string)
    constructor(privateKey: _ICipherParam,
        certChain: _PdfX509Certificate[],
        hashAlgorithm: string,
        hasRsaData: boolean)
    constructor(privateKey: _ICipherParam | Uint8Array,
                certChain?: _PdfX509Certificate[] | string,
                hashAlgorithm?: string,
                hasRsaData?: boolean) {
        if (privateKey instanceof Uint8Array && privateKey.length === 0 || typeof certChain === 'undefined' || certChain === null) {
            return;
        }
        if (privateKey instanceof Uint8Array && typeof certChain === 'string') {
            this._initializeCmsSigner(privateKey, certChain);
        } else {
            this._digestAlgorithm = new _PdfMessageDigestAlgorithms();
            this._digestAlgorithmObjectIdentifier = this._digestAlgorithm._getAllowedDigests(hashAlgorithm);
            if (!this._digestAlgorithmObjectIdentifier) {
                throw new Error(`Unknown hash algorithm: ${hashAlgorithm}`);
            }
            this._version = 1;
            this._signerVersion = 1;
            this._digestObjectIdentifier = new Map<string, any>(); // eslint-disable-line
            this._digestObjectIdentifier.set(this._digestAlgorithmObjectIdentifier, null);
            if (Array.isArray(certChain) && certChain.every((item: _PdfX509Certificate) => item instanceof _PdfX509Certificate)) {
                this._certificates = [...certChain as _PdfX509Certificate[]];
                this._signatureCertificate = this._certificates[0];
            } else {
                this._certificates = [];
                this._signatureCertificate = null;
            }
            if (privateKey) {
                if (this._isRsaKey(privateKey as _ICipherParam)) {
                    const identifier: _PdfDigitalIdentifiers = new _PdfDigitalIdentifiers();
                    this._encryptionAlgorithmObjectIdentifier = identifier._rsaEncryption;
                } else {
                    throw new Error('Unknown key algorithm');
                }
            }
            if (hasRsaData) {
                this._rsaData = new Uint8Array(0);
            }
        }
    }
    /**
     * Initializes a CMS signer from raw bytes and a sub-filter identifier.
     *
     * @private
     * @param {Uint8Array} bytes Encoded CMS signer bytes.
     * @param {string} subFilter Sub-filter identifier (e.g., ETSI.RFC3161).
     * @returns {void}
     */
    _initializeCmsSigner(bytes: Uint8Array, subFilter: string): void {
        const stream: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();
        stream._fromBytes(bytes);
        const sequence: _PdfAbstractSyntaxElement[] = stream._getSequence();
        const oid: _PdfObjectIdentifier = sequence[0]._getObjectIdentifier();
        const dotDelimitedNotation: string = oid._getDotDelimitedNotation();
        if (dotDelimitedNotation === '1.2.840.113549.1.7.2') {
            const inner: _PdfAbstractSyntaxElement = sequence[1]._getInner();
            const innerSequence: _PdfAbstractSyntaxElement[] = inner._getSequence();
            const signerInfosSet: _PdfAbstractSyntaxElement[] = innerSequence[4]._getSequence();
            const signerInformationSeq: _PdfAbstractSyntaxElement[] = signerInfosSet[0]._getSequence();
            const digestAlgorithmSeq: _PdfAbstractSyntaxElement[] = signerInformationSeq[2]._getSequence();
            const digestAlgorithmOidBytes: Uint8Array = digestAlgorithmSeq[0]._getValue();
            const identifier: _PdfObjectIdentifier = new _PdfObjectIdentifier()._fromBytes(digestAlgorithmOidBytes);
            this._digestAlgorithmObjectIdentifier = identifier.toString();
            if (subFilter !== 'ETSI.RFC3161') {
                const { hasTimeStamp, tokenBytes }: any = this._getSignatureTimeStampToken(signerInformationSeq); // eslint-disable-line
                this._hasTimeStamp = hasTimeStamp;
                if (hasTimeStamp && tokenBytes) {
                    this._timeStampTokenBytes = tokenBytes;
                }
            } else {
                const outerTokenBytes: Uint8Array = stream._toBytes();
                this._isTimestampOnly = true;
                this._hasTimeStamp = outerTokenBytes.length > 0;
                this._timeStampTokenBytes = outerTokenBytes;
            }
        }
    }
    /* eslint-disable */
    /**
     * Extracts a signing-time timestamp token from signer info attributes if present.
     *
     * @private
     * @param {_PdfAbstractSyntaxElement} signerInfoSeq The signer info sequence to inspect.
     * @returns {{ hasTimeStamp: boolean; tokenBytes?: Uint8Array }} Timestamp presence and raw token bytes. // eslint-disable-line
     */
    _getSignatureTimeStampToken(
        signerInfoSeq: _PdfAbstractSyntaxElement[]
    ): { hasTimeStamp: boolean; tokenBytes?: Uint8Array } {
        const index: number = 6;
        if (!signerInfoSeq || signerInfoSeq.length <= index) {
            return { hasTimeStamp: false };
        }
        const unsignedAttrs: _PdfAbstractSyntaxElement = signerInfoSeq[<number>index];
        if (!unsignedAttrs._isTagged() || unsignedAttrs._getTagNumber() !== 1 || !unsignedAttrs._isConstructed()) {
            return { hasTimeStamp: false };
        }
        const attributes: _PdfAbstractSyntaxElement[] = this._getChildElement(unsignedAttrs);
        for (const attr of attributes) {
            const attrSeq: _PdfAbstractSyntaxElement[] = attr._getSequence();
            if (!attrSeq || attrSeq.length < 2) {
                continue;
            }
            const oid: string = attrSeq[0]._getObjectIdentifier()._getDotDelimitedNotation();
            if (oid !== '1.2.840.113549.1.9.16.2.14') {
                continue;
            }
            const attrValues: _PdfAbstractSyntaxElement[] = this._getChildElement(attrSeq[1]);
            if (!attrValues || attrValues.length === 0) {
                continue;
            }
            const tokenContentInfo: _PdfAbstractSyntaxElement = attrValues[0];
            const tokenBytes: Uint8Array = tokenContentInfo._toBytes();
            return { hasTimeStamp: tokenBytes.length > 0, tokenBytes };
        }
        return { hasTimeStamp: false };
    }
    /* eslint-enable */
    /**
     * Retrieves child elements for a container, trying abstract-set-of, sequence, or decoding content octets.
     *
     * @private
     * @param {_PdfAbstractSyntaxElement} element The container element.
     * @returns {_PdfAbstractSyntaxElement[]} Child elements.
     */
    _getChildElement(element: _PdfAbstractSyntaxElement): _PdfAbstractSyntaxElement[] {
        let children: _PdfAbstractSyntaxElement[] = [];
        if (element._getAbstractSetOf) {
            children = element._getAbstractSetOf();
        }
        if ((!children || children.length === 0) && element._getSequence) {
            children = element._getSequence();
        }
        if (!children || children.length === 0) {
            children = this._decodeChildrenFromContentOctets(element);
        }
        return children;
    }
    /**
     * Determines whether the provided key parameter represents an RSA key.
     *
     * @private
     * @param {_ICipherParam} key The key parameter object.
     * @returns {boolean} True if the key appears to be RSA.
     */
    _isRsaKey(key: _ICipherParam): boolean {
        return 'modulus' in key && 'exponent' in key;
    }
    /**
     * Returns the hash algorithm name corresponding to the configured digest OID.
     *
     * @private
     * @returns {string} The hash algorithm name.
     */
    _getHashAlgorithm(): string {
        if (!this._hashAlgorithm) {
            this._hashAlgorithm = this._digestAlgorithm._getDigest(this._digestAlgorithmObjectIdentifier);
        }
        return this._hashAlgorithm;
    }
    /**
     * Returns the internal digest algorithm helper.
     *
     * @private
     * @returns {_PdfMessageDigestAlgorithms} Digest algorithm helper instance.
     */
    _getDigestAlgorithm(): _PdfMessageDigestAlgorithms {
        return this._digestAlgorithm;
    }
    /**
     * Builds the authenticated attributes sequence (SET) including message digest and optional revocation info.
     *
     * @private
     * @param {Uint8Array} secondDigest The message digest to include.
     * @param {Uint8Array} [ocsp] Optional OCSP response bytes.
     * @param {Uint8Array[]} [crlBytes] Optional CRL bytes array.
     * @param {CryptographicStandard} [sigtype] Optional cryptographic standard (e.g., CAdES).
     * @returns {Uint8Array} Encoded attribute set bytes.
     */
    _getSequenceDataSet(secondDigest: Uint8Array,
                        ocsp?: Uint8Array,
                        crlBytes?: Uint8Array[],
                        sigtype?: CryptographicStandard): Uint8Array {
        const attributeElements: _PdfUniqueEncodingElement[] = [];
        const contentTypeOid: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
        contentTypeOid._tagClass = _TagClassType.universal;
        contentTypeOid._construction = _ConstructionType.primitive;
        contentTypeOid._setTagNumber(_UniversalType.objectIdentifier);
        contentTypeOid._setValue(this._encodeObjectIdentifier('1.2.840.113549.1.9.3'));
        const pkcs7DataOid: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
        pkcs7DataOid._tagClass = _TagClassType.universal;
        pkcs7DataOid._construction = _ConstructionType.primitive;
        pkcs7DataOid._setTagNumber(_UniversalType.objectIdentifier);
        pkcs7DataOid._setValue(this._encodeObjectIdentifier('1.2.840.113549.1.7.1'));
        const contentTypeSet: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
        contentTypeSet._tagClass = _TagClassType.universal;
        contentTypeSet._construction = _ConstructionType.constructed;
        contentTypeSet._setTagNumber(_UniversalType.abstractSyntaxSet);
        contentTypeSet._setValue(this._encodeSequence([pkcs7DataOid]));
        const contentTypeSeq: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
        contentTypeSeq._tagClass = _TagClassType.universal;
        contentTypeSeq._construction = _ConstructionType.constructed;
        contentTypeSeq._setTagNumber(_UniversalType.sequence);
        contentTypeSeq._setValue(this._encodeSequence([contentTypeOid, contentTypeSet]));
        attributeElements.push(contentTypeSeq);
        const messageDigestOid: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
        messageDigestOid._tagClass = _TagClassType.universal;
        messageDigestOid._construction = _ConstructionType.primitive;
        messageDigestOid._setTagNumber(_UniversalType.objectIdentifier);
        messageDigestOid._setValue(this._encodeObjectIdentifier('1.2.840.113549.1.9.4'));
        const digestOctet: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
        digestOctet._tagClass = _TagClassType.universal;
        digestOctet._construction = _ConstructionType.primitive;
        digestOctet._setTagNumber(_UniversalType.octetString);
        digestOctet._setValue(secondDigest);
        const digestSet: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
        digestSet._tagClass = _TagClassType.universal;
        digestSet._construction = _ConstructionType.constructed;
        digestSet._setTagNumber(_UniversalType.abstractSyntaxSet);
        digestSet._setValue(this._encodeSequence([digestOctet]));
        const messageDigestSeq: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
        messageDigestSeq._tagClass = _TagClassType.universal;
        messageDigestSeq._construction = _ConstructionType.constructed;
        messageDigestSeq._setTagNumber(_UniversalType.sequence);
        messageDigestSeq._setValue(this._encodeSequence([messageDigestOid, digestSet]));
        attributeElements.push(messageDigestSeq);
        if (sigtype === CryptographicStandard.cades && this._signatureCertificate) {
            const certHash: Uint8Array = this._hashCertificate(this._signatureCertificate);
            const certHashOctet: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
            certHashOctet._tagClass = _TagClassType.universal;
            certHashOctet._construction = _ConstructionType.primitive;
            certHashOctet._setTagNumber(_UniversalType.octetString);
            certHashOctet._setValue(certHash);
            const signingCertOid: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
            signingCertOid._tagClass = _TagClassType.universal;
            signingCertOid._construction = _ConstructionType.primitive;
            signingCertOid._setTagNumber(_UniversalType.objectIdentifier);
            signingCertOid._setValue(this._encodeObjectIdentifier('1.2.840.113549.1.9.16.2.47'));
            const sha256String: string = new _PdfMessageDigestAlgorithms()._secureHash256;
            const isSha256: boolean = this._digestAlgorithmObjectIdentifier === this._digestAlgorithm._getAllowedDigests(sha256String);
            let signingCertAttr: _PdfUniqueEncodingElement;
            if (isSha256) {
                const essCertIdV2: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
                essCertIdV2._tagClass = _TagClassType.universal;
                essCertIdV2._construction = _ConstructionType.constructed;
                essCertIdV2._setTagNumber(_UniversalType.sequence);
                essCertIdV2._setValue(this._encodeSequence([certHashOctet]));
                const certsSeq: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
                certsSeq._tagClass = _TagClassType.universal;
                certsSeq._construction = _ConstructionType.constructed;
                certsSeq._setTagNumber(_UniversalType.sequence);
                certsSeq._setValue(this._encodeSequence([essCertIdV2]));
                const signingCertV2: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
                signingCertV2._tagClass = _TagClassType.universal;
                signingCertV2._construction = _ConstructionType.constructed;
                signingCertV2._setTagNumber(_UniversalType.sequence);
                signingCertV2._setValue(this._encodeSequence([certsSeq]));
                const signingCertSet: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
                signingCertSet._tagClass = _TagClassType.universal;
                signingCertSet._construction = _ConstructionType.constructed;
                signingCertSet._setTagNumber(_UniversalType.abstractSyntaxSet);
                signingCertSet._setValue(this._encodeSequence([signingCertV2]));
                signingCertAttr = new _PdfUniqueEncodingElement();
                signingCertAttr._tagClass = _TagClassType.universal;
                signingCertAttr._construction = _ConstructionType.constructed;
                signingCertAttr._setTagNumber(_UniversalType.sequence);
                signingCertAttr._setValue(this._encodeSequence([signingCertOid, signingCertSet]));
            } else {
                const hashAlgOid: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
                hashAlgOid._tagClass = _TagClassType.universal;
                hashAlgOid._construction = _ConstructionType.primitive;
                hashAlgOid._setTagNumber(_UniversalType.objectIdentifier);
                hashAlgOid._setValue(this._encodeObjectIdentifier(this._digestAlgorithmObjectIdentifier));
                const algSeq: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
                algSeq._tagClass = _TagClassType.universal;
                algSeq._construction = _ConstructionType.constructed;
                algSeq._setTagNumber(_UniversalType.sequence);
                algSeq._setValue(this._encodeSequence([hashAlgOid]));
                const essCertIdV2: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
                essCertIdV2._tagClass = _TagClassType.universal;
                essCertIdV2._construction = _ConstructionType.constructed;
                essCertIdV2._setTagNumber(_UniversalType.sequence);
                essCertIdV2._setValue(this._encodeSequence([algSeq, certHashOctet]));
                const certsSeq: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
                certsSeq._tagClass = _TagClassType.universal;
                certsSeq._construction = _ConstructionType.constructed;
                certsSeq._setTagNumber(_UniversalType.sequence);
                certsSeq._setValue(this._encodeSequence([essCertIdV2]));
                const signingCertV2: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
                signingCertV2._tagClass = _TagClassType.universal;
                signingCertV2._construction = _ConstructionType.constructed;
                signingCertV2._setTagNumber(_UniversalType.sequence);
                signingCertV2._setValue(this._encodeSequence([certsSeq]));
                const signingCertSet: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
                signingCertSet._tagClass = _TagClassType.universal;
                signingCertSet._construction = _ConstructionType.constructed;
                signingCertSet._setTagNumber(_UniversalType.abstractSyntaxSet);
                signingCertSet._setValue(this._encodeSequence([signingCertV2]));
                signingCertAttr = new _PdfUniqueEncodingElement();
                signingCertAttr._tagClass = _TagClassType.universal;
                signingCertAttr._construction = _ConstructionType.constructed;
                signingCertAttr._setTagNumber(_UniversalType.sequence);
                signingCertAttr._setValue(this._encodeSequence([signingCertOid, signingCertSet]));
            }
            attributeElements.push(signingCertAttr);
        }
        const attributeSet: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
        attributeSet._tagClass = _TagClassType.universal;
        attributeSet._construction = _ConstructionType.constructed;
        attributeSet._setTagNumber(_UniversalType.abstractSyntaxSet);
        attributeSet._setValue(this._encodeSequence(attributeElements));
        return this._encodeToUniqueElement(attributeSet);
    }
    /**
     * Creates a primitive OBJECT IDENTIFIER element for the provided OID string.
     *
     * @private
     * @param {string} oid Dot-delimited object identifier string.
     * @returns {_PdfUniqueEncodingElement} The created primitive OID element.
     */
    _createPrimitiveOid(oid: string): _PdfUniqueEncodingElement {
        const element: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
        element._tagClass = _TagClassType.universal;
        element._construction = _ConstructionType.primitive;
        element._setTagNumber(_UniversalType.objectIdentifier);
        element._setValue(this._encodeObjectIdentifier(oid));
        return element;
    }
    /**
     * Creates a primitive OCTET STRING element wrapping the provided bytes.
     *
     * @private
     * @param {Uint8Array} value Bytes to wrap.
     * @returns {_PdfUniqueEncodingElement} The created octet element.
     */
    _createPrimitiveOctet(value: Uint8Array): _PdfUniqueEncodingElement {
        const element: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
        element._tagClass = _TagClassType.universal;
        element._construction = _ConstructionType.primitive;
        element._setTagNumber(_UniversalType.octetString);
        element._setValue(value);
        return element;
    }
    /**
     * Creates a constructed element with the given tag and child elements.
     *
     * @private
     * @param {number} tag The tag number for the constructed element.
     * @param {_PdfUniqueEncodingElement[]} elements Child elements to include.
     * @returns {_PdfUniqueEncodingElement} The constructed element.
     */
    _createConstructed(tag: number, elements: _PdfUniqueEncodingElement[]): _PdfUniqueEncodingElement {
        const element: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
        element._tagClass = _TagClassType.universal;
        element._construction = _ConstructionType.constructed;
        element._setTagNumber(tag);
        element._setValue(this._encodeSequence(elements));
        return element;
    }
    /**
     * Encodes a dotted OID string into its ASN.1 byte representation.
     *
     * @private
     * @param {string} oidString Dot-delimited OID string.
     * @returns {Uint8Array} Encoded OID bytes.
     */
    _encodeObjectIdentifier(oidString: string): Uint8Array {
        const parts: number[] = oidString.split('.').map(Number);
        const bytes: number[] = [];
        bytes.push(parts[0] * 40 + parts[1]);
        for (let i: number = 2; i < parts.length; i++) {
            let value: number = parts[<number>i];
            if (value < 128) {
                bytes.push(value);
            } else {
                const temp: number[] = [];
                while (value > 0) {
                    temp.unshift(value & 0x7F);
                    value >>>= 7;
                }
                for (let j: number = 0; j < temp.length - 1; j++) {
                    temp[<number>j] |= 0x80;
                }
                bytes.push(...temp);
            }
        }
        return new Uint8Array(bytes);
    }
    /**
     * Encodes an array of unique elements as a concatenated sequence payload.
     *
     * @private
     * @param {_PdfUniqueEncodingElement[]} elements Elements to encode.
     * @returns {Uint8Array} Concatenated encoded bytes.
     */
    _encodeSequence(elements: _PdfUniqueEncodingElement[]): Uint8Array {
        const content: number[] = [];
        for (const element of elements) {
            const encoded: Uint8Array = this._encodeToUniqueElement(element);
            content.push(...Array.from(encoded));
        }
        return new Uint8Array(content);
    }
    /**
     * Serializes a `_PdfUniqueEncodingElement` into raw bytes including tag/length/value.
     *
     * @private
     * @param {_PdfUniqueEncodingElement} element Element to serialize.
     * @returns {Uint8Array} Serialized bytes.
     */
    _encodeToUniqueElement(element: _PdfUniqueEncodingElement): Uint8Array {
        const result: number[] = [];
        let tag: number = element._getTagNumber();
        if (element._construction === _ConstructionType.constructed) {
            tag |= 0x20;
        }
        if (element._tagClass === _TagClassType.context) {
            tag |= 0x80;
        }
        result.push(tag);
        const contentLength: number = element._getValue() ? element._getValue().length : 0;
        if (contentLength < 128) {
            result.push(contentLength);
        } else {
            const lengthBytes: number[] = this._encodeLength(contentLength);
            result.push(0x80 | lengthBytes.length);
            result.push(...lengthBytes);
        }
        if (element._getValue()) {
            result.push(...Array.from(element._getValue()));
        }
        return new Uint8Array(result);
    }
    /**
     * Encodes a positive integer length into length octets for DER/BER.
     *
     * @private
     * @param {number} length The length to encode.
     * @returns {number[]} Array of octets representing the length.
     */
    _encodeLength(length: number): number[] {
        const bytes: number[] = [];
        while (length > 0) {
            bytes.unshift(length & 0xFF);
            length >>>= 8;
        }
        return bytes;
    }
    /**
     * Computes the digest of a certificate using the configured hash algorithm.
     *
     * @private
     * @param {_PdfX509Certificate} certificate Certificate to hash.
     * @returns {Uint8Array} Digest bytes.
     */
    _hashCertificate(certificate: _PdfX509Certificate): Uint8Array {
        const certBytes: Uint8Array = certificate._getEncoded();
        const hasher: any = this._digestAlgorithm._getMessageDigest(this._getHashAlgorithm()); // eslint-disable-line
        return hasher._hash(certBytes, 0, certBytes.length);
    }
    /**
     * Sets precomputed signed data and selects encryption algorithm identifiers.
     *
     * @private
     * @param {Uint8Array} digest The digest bytes to set.
     * @param {Uint8Array} rsaData Optional RSA data bytes.
     * @param {string} digestEncryptionAlgorithm The encryption algorithm name (e.g., 'RSA').
     * @returns {void}
     */
    _setSignedData(digest: Uint8Array, rsaData: Uint8Array, digestEncryptionAlgorithm: string): void {
        this._signedData = digest;
        this._signedRsaData = rsaData;
        if (digestEncryptionAlgorithm) {
            switch (digestEncryptionAlgorithm) {
            case 'RSA':
                this._encryptionAlgorithmObjectIdentifier = new _PdfDigitalIdentifiers()._rsaEncryption;
                break;
            case 'DSA':
                this._encryptionAlgorithmObjectIdentifier = new _PdfDigitalIdentifiers()._dsaSignature;
                break;
            case 'ECDSA':
                this._encryptionAlgorithmObjectIdentifier = new _PdfDigitalIdentifiers()._ecPublicKey;
                break;
            default:
                throw new Error(`Invalid algorithm: ${digestEncryptionAlgorithm}`);
            }
        }
    }
    /**
     * Encodes a sequence of certificate byte arrays into a constructed ASN.1 context element.
     *
     * @private
     * @param {Uint8Array[]} certificates Array of certificate byte arrays.
     * @returns {Uint8Array} Encoded constructed certificate set.
     */
    _encodeCertificateSet(certificates: Uint8Array[]): Uint8Array {
        const totalLen: number = certificates.reduce((sum: number, arr: Uint8Array) => sum + arr.length, 0);
        let lengthBytes: number[];
        if (totalLen < 128) {
            lengthBytes = [totalLen];
        } else if (totalLen < 256) {
            lengthBytes = [0x81, totalLen];
        } else {
            lengthBytes = [0x82, totalLen >> 8 & 0xff, totalLen & 0xff];
        }
        const out: Uint8Array = new Uint8Array(1 + lengthBytes.length + totalLen);
        out[0] = 0xa0;
        out.set(lengthBytes, 1);
        let pos: number = 1 + lengthBytes.length;
        for (const cert of certificates) {
            out.set(cert, pos);
            pos += cert.length;
        }
        return out;
    }
    /**
     * Creates a primitive encoding element with the specified tag and raw value.
     *
     * @private
     * @param {number} tag The universal tag number.
     * @param {Uint8Array} value The raw value bytes.
     * @returns {_PdfUniqueEncodingElement} The created primitive element.
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
     * Creates an ASN.1 constructed element (SEQUENCE) from provided elements.
     *
     * @private
     * @param {number} tag Tag number for the constructed element.
     * @param {_PdfUniqueEncodingElement[]} elements Child elements.
     * @returns {_PdfUniqueEncodingElement} The constructed element.
     */
    _createAsn1Constructed(tag: number, elements: _PdfUniqueEncodingElement[]): _PdfUniqueEncodingElement {
        const element: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
        element._tagClass = _TagClassType.universal;
        element._construction = _ConstructionType.constructed;
        element._setTagNumber(tag);
        element._setSequence(elements);
        return element;
    }
    /**
     * Creates a context-specific constructed element with the given content.
     *
     * @private
     * @param {number} tag Context tag number.
     * @param {_PdfUniqueEncodingElement[]|Uint8Array} elements Child elements or raw bytes.
     * @returns {_PdfUniqueEncodingElement} The context-constructed element.
     */
    _createContextConstructed(tag: number, elements: _PdfUniqueEncodingElement[] | Uint8Array): _PdfUniqueEncodingElement {
        const element: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
        element._tagClass = _TagClassType.context;
        element._construction = _ConstructionType.constructed;
        element._setTagNumber(tag);
        if (Array.isArray(elements)) {
            element._setSequence(elements);
        } else {
            element._setValue(elements);
        }
        return element;
    }
    /**
     * Produces a synchronous PKCS#7/CMS signature for the provided digest and returns encoded bytes.
     *
     * @private
     * @param {Uint8Array} secondDigest The digest to sign.
     * @param {Uint8Array} [timeStampResponse] Optional timestamp response bytes.
     * @param {Uint8Array} [revocation] Optional revocation data.
     * @param {Uint8Array[]} [bytes] Optional additional byte arrays.
     * @param {CryptographicStandard} [sigtype] Optional cryptographic standard selector.
     * @param {string} [hashAlgorithm] Optional hash algorithm override.
     * @returns {Uint8Array} Encoded PKCS#7/CMS signature bytes.
     */
    _sign(secondDigest: Uint8Array, timeStampResponse?: Uint8Array, revocation?: Uint8Array, bytes?: Uint8Array[], sigtype?: CryptographicStandard, hashAlgorithm?: string): Uint8Array { // eslint-disable-line
        if (this._signedData) {
            this._digest = this._signedData;
            if (this._rsaData) {
                this._rsaData = this._signedRsaData;
            }
        }
        const digestAlgorithms: _PdfUniqueEncodingElement[] = [];
        (this._digestObjectIdentifier as Map<string, any>).forEach((_, oid: string) => { // eslint-disable-line
            const oidEl: _PdfUniqueEncodingElement =
                this._createPrimitive(_UniversalType.objectIdentifier, this._encodeObjectIdentifier(oid));
            const nullEl: _PdfUniqueEncodingElement =
                this._createPrimitive(_UniversalType.nullValue, new Uint8Array(0));
            digestAlgorithms.push(
                this._createAsn1Constructed(_UniversalType.sequence, [oidEl, nullEl])
            );
        });
        const contentInfoElements: _PdfUniqueEncodingElement[] = [
            this._createPrimitive(_UniversalType.objectIdentifier,
                                  this._encodeObjectIdentifier(new _PdfDigitalIdentifiers()._cryptographicData))
        ];
        if (this._rsaData && this._rsaData.length > 0) {
            const octet: _PdfUniqueEncodingElement = this._createPrimitive(_UniversalType.octetString, this._rsaData);
            contentInfoElements.push(this._createContextConstructed(0, [octet]));
        }
        const contentInfoSeq: _PdfUniqueEncodingElement = this._createAsn1Constructed(_UniversalType.sequence, contentInfoElements);
        const certificateElements: _PdfUniqueEncodingElement[] = this._certificates
            .filter((cert: _PdfX509Certificate) => cert)
            .map((cert: _PdfX509Certificate) => {
                const el: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
                el._fromBytes(cert._getEncodedString());
                return el;
            });
        const signerInfoElements: _PdfUniqueEncodingElement[] = [
            this._createPrimitive(_UniversalType.integer, new Uint8Array([this._signerVersion]))
        ];
        if (this._signatureCertificate) {
            const issuerAndSerialElements: _PdfUniqueEncodingElement[] = [];
            const tbsCertBytes: Uint8Array = this._signatureCertificate._getTobeSignedCertificate();
            const issuerElement: _PdfUniqueEncodingElement = this._getIssuer(tbsCertBytes);
            if (issuerElement) {
                issuerAndSerialElements.push(issuerElement);
            }
            let serialValue: Uint8Array;
            const singed: _PdfSignedCertificate = this._signatureCertificate._structure._getSignedCertificate();
            if (this._signatureCertificate._structure && singed && singed._serialNumber) {
                serialValue = singed._serialNumber;
            } else {
                serialValue = new Uint8Array([1]);
            }
            const serialElement: _PdfUniqueEncodingElement = this._createPrimitive(_UniversalType.integer, serialValue);
            issuerAndSerialElements.push(serialElement);
            signerInfoElements.push(this._createAsn1Constructed(_UniversalType.sequence, issuerAndSerialElements));
        }
        const digestAlgSeq: _PdfUniqueEncodingElement = this._createAsn1Constructed(_UniversalType.sequence, [
            this._createPrimitive(_UniversalType.objectIdentifier, this._encodeObjectIdentifier(this._digestAlgorithmObjectIdentifier)),
            this._createPrimitive(_UniversalType.nullValue, new Uint8Array(0))
        ]);
        signerInfoElements.push(digestAlgSeq);
        if (secondDigest) {
            const authenticatedAttrs: Uint8Array = this._getSequenceDataSet(secondDigest, revocation, bytes, sigtype);
            signerInfoElements.push(this._createContextImplicitFromTimestampValue(0, authenticatedAttrs));
        }
        const sigAlgSeq: _PdfUniqueEncodingElement = this._createAsn1Constructed(_UniversalType.sequence, [
            this._createPrimitive(_UniversalType.objectIdentifier,
                                  this._encodeObjectIdentifier(this._encryptionAlgorithmObjectIdentifier)),
            this._createPrimitive(_UniversalType.nullValue, new Uint8Array(0))
        ]);
        signerInfoElements.push(sigAlgSeq);
        signerInfoElements.push(this._createPrimitive(_UniversalType.octetString, this._digest || new Uint8Array(0)));
        const signerInfoSeq: _PdfUniqueEncodingElement = this._createAsn1Constructed(_UniversalType.sequence, signerInfoElements);
        const bodyElements: _PdfUniqueEncodingElement[] = this._buildSignedDataBodyElements(this._version,
                                                                                            digestAlgorithms,
                                                                                            contentInfoSeq,
                                                                                            certificateElements,
                                                                                            signerInfoSeq);
        const signedDataBytes: Uint8Array = this._concatAbstractSyntaxSequence(bodyElements);
        const encodedIdentifier: Uint8Array = this._encodeObjectIdentifier(new _PdfDigitalIdentifiers()._cryptographicSignedData);
        const pkcs7Oid: _PdfUniqueEncodingElement = this._createPrimitive(_UniversalType.objectIdentifier, encodedIdentifier);
        const signedDataContext: _PdfUniqueEncodingElement = this._createContextConstructed(0, signedDataBytes);
        const pkcs7TopSeq: _PdfUniqueEncodingElement = this._createAsn1Constructed(_UniversalType.sequence, [pkcs7Oid, signedDataContext]);
        return pkcs7TopSeq._toBytes();
    }
    /**
     * Builds the body elements array for SignedData including version, digest algorithms, contentInfo, certificates and signerInfo.
     *
     * @private
     * @param {number} version SignedData version.
     * @param {_PdfUniqueEncodingElement[]} digestAlgorithms Digest algorithm elements.
     * @param {_PdfUniqueEncodingElement} contentInfoSeq ContentInfo sequence element.
     * @param {_PdfAbstractSyntaxElement[]} certificateElements Certificate elements.
     * @param {_PdfUniqueEncodingElement} signerInfoSeq SignerInfo element.
     * @returns {_PdfUniqueEncodingElement[]} Array of body elements.
     */
    _buildSignedDataBodyElements(version: number, digestAlgorithms: _PdfUniqueEncodingElement[],
                                 contentInfoSeq: _PdfUniqueEncodingElement, certificateElements: _PdfAbstractSyntaxElement[],
                                 signerInfoSeq: _PdfUniqueEncodingElement): _PdfUniqueEncodingElement[] {
        const bodyElements: _PdfUniqueEncodingElement[] = [];
        bodyElements.push(this._createPrimitive(_UniversalType.integer, new Uint8Array([version])));
        const digestAlgSet: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
        digestAlgSet._tagClass = _TagClassType.universal;
        digestAlgSet._construction = _ConstructionType.constructed;
        digestAlgSet._setTagNumber(_UniversalType.abstractSyntaxSet);
        digestAlgSet._setAbstractSetValue(digestAlgorithms);
        bodyElements.push(digestAlgSet);
        bodyElements.push(contentInfoSeq);
        if (certificateElements.length > 0) {
            const certSet: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
            certSet._tagClass = _TagClassType.context;
            certSet._construction = _ConstructionType.constructed;
            certSet._setTagNumber(0);
            certSet._setAbstractSetValue(certificateElements);
            bodyElements.push(certSet);
        }
        const signerInfoSet: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
        signerInfoSet._tagClass = _TagClassType.universal;
        signerInfoSet._construction = _ConstructionType.constructed;
        signerInfoSet._setTagNumber(_UniversalType.abstractSyntaxSet);
        signerInfoSet._setAbstractSetValue([signerInfoSeq]);
        bodyElements.push(signerInfoSet);
        return bodyElements;
    }
    /**
     * Concatenates a mixture of unique elements and raw byte arrays into a single sequence payload.
     *
     * @private
     * @param {Array<_PdfUniqueEncodingElement|Uint8Array>} elements Elements to concatenate.
     * @returns {Uint8Array} Concatenated bytes.
     */
    _concatAbstractSyntaxSequence(elements: Array<_PdfUniqueEncodingElement | Uint8Array>): Uint8Array {
        const parts: Uint8Array[] = [];
        for (const el of elements) {
            if (el instanceof Uint8Array) {
                parts.push(el);
            } else if (el instanceof _PdfUniqueEncodingElement) {
                parts.push(el._toBytes());
            } else {
                throw new Error('Element for PKCS#7 serialization must be distinguished element or Uint8Array');
            }
        }
        const totalLen: number = parts.reduce((sum: number, part: Uint8Array) => sum + part.length, 0);
        let lenBytes: number[];
        if (totalLen < 128) {
            lenBytes = [totalLen];
        } else if (totalLen < 256) {
            lenBytes = [0x81, totalLen];
        } else {
            lenBytes = [0x82, totalLen >> 8, totalLen & 0xff];
        }
        const out: Uint8Array = new Uint8Array(1 + lenBytes.length + totalLen);
        out[0] = 0x30;
        out.set(lenBytes, 1);
        let pos: number = 1 + lenBytes.length;
        for (const p of parts) {
            out.set(p, pos);
            pos += p.length;
        }
        return out;
    }
    /**
     * Extracts the issuer element from a TBS certificate byte sequence.
     *
     * @private
     * @param {Uint8Array} tbsCertBytes The TBS certificate bytes.
     * @returns {_PdfUniqueEncodingElement} The issuer element.
     */
    _getIssuer(tbsCertBytes: Uint8Array): _PdfUniqueEncodingElement {
        const tbsElement: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
        tbsElement._fromBytes(tbsCertBytes);
        const elements: _PdfAbstractSyntaxElement[] = tbsElement._getSequence();
        const issuerElement: _PdfUniqueEncodingElement = elements[3] as _PdfUniqueEncodingElement;
        return issuerElement;
    }
    /**
     * Wraps a timestamp response into the appropriate attribute structure.
     *
     * @private
     * @param {Uint8Array} timeStampResponse Raw timestamp response bytes.
     * @returns {Uint8Array} Encoded timestamp attribute bytes.
     */
    _getTimestampAttributes(timeStampResponse: Uint8Array): Uint8Array {
        const timestampOid: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
        timestampOid._tagClass = _TagClassType.universal;
        timestampOid._construction = _ConstructionType.primitive;
        timestampOid._setTagNumber(_UniversalType.objectIdentifier);
        timestampOid._setValue(this._encodeObjectIdentifier('1.2.840.113549.1.9.16.2.14'));
        const timestampValue: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
        timestampValue._tagClass = _TagClassType.universal;
        timestampValue._construction = _ConstructionType.constructed;
        timestampValue._setTagNumber(_UniversalType.abstractSyntaxSet);
        timestampValue._setValue(timeStampResponse);
        const timestampSeq: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
        timestampSeq._tagClass = _TagClassType.universal;
        timestampSeq._construction = _ConstructionType.constructed;
        timestampSeq._setTagNumber(_UniversalType.sequence);
        timestampSeq._setValue(this._encodeSequence([timestampOid, timestampValue]));
        const timestampSet: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
        timestampSet._tagClass = _TagClassType.universal;
        timestampSet._construction = _ConstructionType.constructed;
        timestampSet._setTagNumber(_UniversalType.abstractSyntaxSet);
        timestampSet._setValue(this._encodeToUniqueElement(timestampSeq));
        return this._encodeToUniqueElement(timestampSet);
    }
    /**
     * Produces an asynchronous PKCS#7/CMS signature, supporting timestamping via callbacks.
     *
     * @private
     * @param {Uint8Array} secondDigest The digest to sign.
     * @param {PdfSignature} signature Signature context containing callbacks.
     * @param {Uint8Array} [timeStampResponse] Optional timestamp response bytes.
     * @param {Uint8Array} [revocation] Optional revocation data.
     * @param {Uint8Array[]} [bytes] Optional additional byte arrays.
     * @param {CryptographicStandard} [sigtype] Optional cryptographic standard selector.
     * @returns {Promise<Uint8Array>} Encoded PKCS#7/CMS signature bytes.
     */
    async _signAsync(
        secondDigest: Uint8Array,
        signature: PdfSignature,
        timeStampResponse?: Uint8Array,
        revocation?: Uint8Array,
        bytes?: Uint8Array[],
        sigtype?: CryptographicStandard
    ): Promise<Uint8Array> {
        if (this._signedData) {
            this._digest = this._signedData;
            if (this._rsaData) {
                this._rsaData = this._signedRsaData;
            }
        }
        const digestAlgorithms: _PdfUniqueEncodingElement[] = [];
        (this._digestObjectIdentifier as Map<string, any>).forEach((value: any, oid: string) => { // eslint-disable-line
            const oidElement: _PdfUniqueEncodingElement = this._createPrimitive(_UniversalType.objectIdentifier,
                                                                                this._encodeObjectIdentifier(oid));
            const nullElement: _PdfUniqueEncodingElement = this._createPrimitive(_UniversalType.nullValue, new Uint8Array(0));
            digestAlgorithms.push(this._createAsn1Constructed(_UniversalType.sequence, [oidElement, nullElement]));
        });
        const contentInfoElements: _PdfUniqueEncodingElement[] = [
            this._createPrimitive(_UniversalType.objectIdentifier,
                                  this._encodeObjectIdentifier(new _PdfDigitalIdentifiers()._cryptographicData))
        ];
        if (this._rsaData && this._rsaData.length > 0) {
            const octet: _PdfUniqueEncodingElement = this._createPrimitive(_UniversalType.octetString, this._rsaData);
            contentInfoElements.push(this._createContextConstructed(0, [octet]));
        }
        const contentInfoSeq: _PdfUniqueEncodingElement = this._createAsn1Constructed(_UniversalType.sequence, contentInfoElements);
        const certificateElements: _PdfUniqueEncodingElement[] = this._certificates
            .filter((cert: _PdfX509Certificate) => cert)
            .map((cert: _PdfX509Certificate) => {
                const el: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
                el._fromBytes(cert._getEncodedString());
                return el;
            });
        const signerInfoElements: _PdfUniqueEncodingElement[] = [
            this._createPrimitive(_UniversalType.integer, new Uint8Array([this._signerVersion]))
        ];
        if (this._signatureCertificate) {
            const issuerAndSerialElements: _PdfUniqueEncodingElement[] = [];
            const tbsCertBytes: Uint8Array = this._signatureCertificate._getTobeSignedCertificate();
            const issuerElement: _PdfUniqueEncodingElement = this._getIssuer(tbsCertBytes);
            if (issuerElement) {
                issuerAndSerialElements.push(issuerElement);
            }
            const signedCert: _PdfSignedCertificate = this._signatureCertificate._structure._getSignedCertificate();
            let serialValue: Uint8Array;
            if (signedCert && signedCert._serialNumber) {
                serialValue = signedCert._serialNumber;
            } else {
                serialValue = new Uint8Array([1]);
            }
            issuerAndSerialElements.push(this._createPrimitive(_UniversalType.integer, serialValue));
            signerInfoElements.push(this._createAsn1Constructed(_UniversalType.sequence, issuerAndSerialElements));
        }
        const digestAlgSeq: _PdfUniqueEncodingElement = this._createAsn1Constructed(_UniversalType.sequence, [
            this._createPrimitive(_UniversalType.objectIdentifier, this._encodeObjectIdentifier(this._digestAlgorithmObjectIdentifier)),
            this._createPrimitive(_UniversalType.nullValue, new Uint8Array(0))
        ]);
        signerInfoElements.push(digestAlgSeq);
        if (secondDigest) {
            const authenticatedAttrs: Uint8Array = this._getSequenceDataSet(secondDigest, revocation, bytes, sigtype);
            const element: _PdfUniqueEncodingElement = this._createContextImplicitFromTimestampValue(0, authenticatedAttrs);
            signerInfoElements.push(element);
        }
        const sigAlgSeq: _PdfUniqueEncodingElement = this._createAsn1Constructed(_UniversalType.sequence, [
            this._createPrimitive(_UniversalType.objectIdentifier, this._encodeObjectIdentifier(this._encryptionAlgorithmObjectIdentifier)),
            this._createPrimitive(_UniversalType.nullValue, new Uint8Array(0))
        ]);
        signerInfoElements.push(sigAlgSeq);
        signerInfoElements.push(this._createPrimitive(_UniversalType.octetString, this._digest || new Uint8Array(0)));
        if ((!timeStampResponse || timeStampResponse.length === 0) && signature) {
            if (signature._timestampCallback) {
                const { oid }: any = this._getObjectIdentifierName('SHA256'); // eslint-disable-line
                const tsaHash: Uint8Array = this._digestAlgorithm._digest(this._digest, 'SHA256');
                const tsaReq: Uint8Array = this._createTimestampRequestWithAlgorithm(tsaHash, oid);
                const tsResult: {data: Uint8Array} = await signature._timestampCallback(tsaReq);
                if (tsResult && tsResult.data.length > 0) {
                    timeStampResponse = this._reEncodeTimestampResponse(tsResult.data);
                } else {
                    timeStampResponse = undefined;
                }
            } else {
                timeStampResponse = undefined;
            }
        }
        if (timeStampResponse && timeStampResponse.length > 0) {
            const tsUnsignedAttr: _PdfUniqueEncodingElement = this._buildTimestampUnsignedAttribute(timeStampResponse);
            const unsignedAttrSet: _PdfUniqueEncodingElement =
                this._createAsn1Constructed(_UniversalType.abstractSyntaxSet, [tsUnsignedAttr]);
            signerInfoElements.push(this._createContextImplicitFromTimestampValue(1, unsignedAttrSet._toBytes()));
            this._hasTimeStamp = true;
        }
        const signerInfoSeq: _PdfUniqueEncodingElement = this._createAsn1Constructed(_UniversalType.sequence, signerInfoElements);
        const bodyElements: _PdfUniqueEncodingElement[] = this._buildSignedDataBodyElements(this._version, digestAlgorithms,
                                                                                            contentInfoSeq, certificateElements,
                                                                                            signerInfoSeq);
        const signedDataBytes: Uint8Array = this._concatAbstractSyntaxSequence(bodyElements);
        const encodedIdentifier: Uint8Array = this._encodeObjectIdentifier(new _PdfDigitalIdentifiers()._cryptographicSignedData);
        const pkcs7Oid: _PdfUniqueEncodingElement = this._createPrimitive(_UniversalType.objectIdentifier, encodedIdentifier);
        const signedDataContext: _PdfUniqueEncodingElement = this._createContextConstructed(0, signedDataBytes);
        const pkcs7TopSeq: _PdfUniqueEncodingElement = this._createAsn1Constructed(_UniversalType.sequence, [pkcs7Oid, signedDataContext]);
        return pkcs7TopSeq._toBytes();
    }
    /* eslint-disable */
    /**
     * Maps a common algorithm name to its OID and canonical name.
     *
     * @private
     * @param {string} [requested] Optional requested algorithm name.
     * @returns {{ oid: string; name: string }} Object identifier and canonical name. // eslint-disable-line
     */
    _getObjectIdentifierName(requested?: string): { oid: string; name: string } {
        const alg: string = (requested || 'SHA256').toUpperCase();
        switch (alg) {
        case 'SHA1':
            return { oid: '1.3.14.3.2.26', name: 'SHA1' };
        case 'SHA256':
            return { oid: '2.16.840.1.101.3.4.2.1', name: 'SHA256' };
        case 'SHA384':
            return { oid: '2.16.840.1.101.3.4.2.2', name: 'SHA384' };
        case 'SHA512':
            return { oid: '2.16.840.1.101.3.4.2.3', name: 'SHA512' };
        default:
            return { oid: '2.16.840.1.101.3.4.2.1', name: 'SHA256' };
        }
    }
    /* eslint-enable */
    /**
     * Builds a timestamp-request structure using the specified hash and algorithm OID.
     *
     * @private
     * @param {Uint8Array} hash The message hash to include.
     * @param {string} algorithmIdentifier The algorithm OID string.
     * @returns {Uint8Array} Encoded timestamp request bytes.
     */
    _createTimestampRequestWithAlgorithm(hash: Uint8Array, algorithmIdentifier: string): Uint8Array {
        const version: _PdfUniqueEncodingElement = this._createPrimitive(_UniversalType.integer, new Uint8Array([1]));
        const oidEl: _PdfUniqueEncodingElement = this._createPrimitive(_UniversalType.objectIdentifier,
                                                                       this._encodeObjectIdentifier(algorithmIdentifier));
        const nullEl: _PdfUniqueEncodingElement = this._createPrimitive(_UniversalType.nullValue, new Uint8Array(0));
        const algSeq: _PdfUniqueEncodingElement = this._createAsn1Constructed(_UniversalType.sequence, [oidEl, nullEl]);
        const hashedMessage: _PdfUniqueEncodingElement = this._createPrimitive(_UniversalType.octetString, hash);
        const messageImprint: _PdfUniqueEncodingElement = this._createAsn1Constructed(_UniversalType.sequence, [algSeq, hashedMessage]);
        const nonce: _PdfUniqueEncodingElement = this._createPrimitive(_UniversalType.integer, new Uint8Array([100]));
        const certReq: _PdfUniqueEncodingElement = this._createPrimitive(_UniversalType.abstractSyntaxBoolean, new Uint8Array([0xff]));
        const tsReqSeq: _PdfUniqueEncodingElement = this._createAsn1Constructed(_UniversalType.sequence,
                                                                                [version, messageImprint, nonce, certReq]);
        return tsReqSeq._toBytes();
    }
    /**
     * Attempts to re-encode a timestamp response into the expected attribute format.
     *
     * @private
     * @param {Uint8Array} timestampResponse Raw timestamp response bytes.
     * @returns {Uint8Array} Re-encoded timestamp attribute bytes or original input on failure.
     */
    _reEncodeTimestampResponse(timestampResponse: Uint8Array): Uint8Array {
        try {
            const root: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
            root._fromBytes(timestampResponse);
            const topSeq: _PdfAbstractSyntaxElement[] = root._getSequence();
            if (!topSeq || topSeq.length < 2) {
                return timestampResponse;
            }
            const tokenNode: _PdfAbstractSyntaxElement = topSeq[1];
            if (!tokenNode) {
                return timestampResponse;
            }
            const innerElements: _PdfAbstractSyntaxElement[] = tokenNode._getSequence();
            if (!innerElements || innerElements.length === 0) {
                return timestampResponse;
            }
            return this._encodeTimeStampSequence(innerElements);
        } catch {
            return timestampResponse;
        }
    }
    /**
     * Encodes a sequence of ASN.1 elements representing a timestamp token sequence.
     *
     * @private
     * @param {_PdfAbstractSyntaxElement[]} elements Elements to include in the timestamp sequence.
     * @returns {Uint8Array} Encoded sequence bytes.
     */
    _encodeTimeStampSequence(elements: _PdfAbstractSyntaxElement[]): Uint8Array {
        const encodedParts: Uint8Array[] = elements.map((el: _PdfAbstractSyntaxElement) => el._toBytes());
        const totalLength: number = encodedParts.reduce((sum: number, part: Uint8Array) => sum + part.length, 0);
        const sequenceTag: _UniversalType = _UniversalType.sequence | 0x20;
        const lengthBytes: Uint8Array = this._encodeSequenceLength(totalLength);
        const result: Uint8Array = new Uint8Array(1 + lengthBytes.length + totalLength);
        let offset: number = 0;
        result[offset++] = sequenceTag;
        result.set(lengthBytes, offset);
        offset += lengthBytes.length;
        for (const part of encodedParts) {
            result.set(part, offset);
            offset += part.length;
        }
        return result;
    }
    /**
     * Encodes a sequence length into BER/DER length bytes.
     *
     * @private
     * @param {number} length The length to encode.
     * @returns {Uint8Array} Encoded length bytes.
     */
    _encodeSequenceLength(length: number): Uint8Array {
        if (length < 128) {
            return new Uint8Array([length]);
        }
        const bytes: number[] = [];
        while (length > 0) {
            bytes.unshift(length & 0xff);
            length >>= 8;
        }
        return new Uint8Array([0x80 | bytes.length, ...bytes]);
    }
    /**
     * Builds an unsigned attribute containing a timestamp token.
     *
     * @private
     * @param {Uint8Array} tsTokenBytes Raw timestamp token bytes.
     * @returns {_PdfUniqueEncodingElement} The unsigned attribute element.
     */
    _buildTimestampUnsignedAttribute(tsTokenBytes: Uint8Array): _PdfUniqueEncodingElement {
        const timestampToken: string = '1.2.840.113549.1.9.16.2.14';
        const typeOid: _PdfUniqueEncodingElement = this._createPrimitive(
            _UniversalType.objectIdentifier,
            this._encodeObjectIdentifier(timestampToken)
        );
        const tokenEl: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
        tokenEl._fromBytes(tsTokenBytes);
        const valuesSet: _PdfUniqueEncodingElement = this._createAsn1Constructed(_UniversalType.abstractSyntaxSet, [tokenEl]);
        return this._createAsn1Constructed(_UniversalType.sequence, [typeOid, valuesSet]);
    }
    /**
     * Obtains an encoded timestamp from the TSA using the provided callback on the `PdfSignature`.
     *
     * @private
     * @param {Uint8Array} secondDigest The digest to timestamp.
     * @param {PdfSignature} signature The signature context with timestamp callback.
     * @param {string} hashAlgorithm Hash algorithm name to use for TSA request.
     * @returns {Promise<Uint8Array>} Encoded timestamp bytes.
     */
    async _getEncodedTimestamp(
        secondDigest: Uint8Array,
        signature: PdfSignature,
        hashAlgorithm: string
    ): Promise<Uint8Array> {
        const { oid }: any = this._getObjectIdentifierName(hashAlgorithm); // eslint-disable-line
        const tsaReq: Uint8Array = this._createTimestampRequestWithAlgorithm(secondDigest, oid);
        const resp: {data: Uint8Array} = await signature._timestampCallback(tsaReq);
        if (!resp || resp.data.length === 0) {
            throw new Error('Timestamp server returned empty response');
        }
        return this._reEncodeTimestampResponse(resp.data);
    }
    /**
     * Creates a context-specific implicit element from raw timestamp value bytes.
     *
     * @private
     * @param {number} tagNumber The context tag number.
     * @param {Uint8Array} value Raw value bytes.
     * @returns {_PdfUniqueEncodingElement} The created element.
     */
    _createContextImplicitFromTimestampValue(tagNumber: number, value: Uint8Array): _PdfUniqueEncodingElement {
        const el: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
        el._fromBytes(value);
        el._tagClass = _TagClassType.context;
        el._setTagNumber(tagNumber);
        return el;
    }
    /**
     * Decodes child elements from content octets of an implicitly-tagged element.
     *
     * @private
     * @param {_PdfAbstractSyntaxElement} csImplicit Implicitly-tagged container element.
     * @returns {_PdfAbstractSyntaxElement[]} Decoded child elements.
     */
    _decodeChildrenFromContentOctets(csImplicit: _PdfAbstractSyntaxElement): _PdfAbstractSyntaxElement[] {
        const value: Uint8Array = csImplicit._getValue();
        const children: _PdfAbstractSyntaxElement[] = [];
        let cursor: number = 0;
        while (cursor < value.length) {
            const child: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();
            const consumed: number = child._fromBytes(value.subarray(cursor));
            if (consumed <= 0) {
                break;
            }
            children.push(child);
            cursor += consumed;
        }
        return children;
    }
}
