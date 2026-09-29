import { _ConstructionType, _TagClassType, _UniversalType } from './../asn1/enumerator';
import { CryptographicStandard, RevocationType } from './../../../enumerator';
import { _PdfAbstractSyntaxElement } from '../asn1/abstract-syntax';
import { _PdfUniqueEncodingElement } from '../asn1/unique-encoding-element';
import { _PdfBasicEncodingElement } from '../asn1/basic-encoding-element';
import { _PdfObjectIdentifier } from '../asn1/identifier-mapping';
import { _PdfX509Certificate } from '../x509/x509-certificate';
import { _PdfX509CertificateParser } from '../x509/x509-certificate-parser';
import { _PdfMessageDigestAlgorithms } from './pdf-digest-algorithms';
import { _ICipherParam, _ISigner } from './pdf-interfaces';
import { _PdfDigitalIdentifiers } from './pdf-object-identifiers';
import { _PdfSignedCertificate } from '../x509/x509-signed-certificate';
import { PdfSignature } from './pdf-signature';
import { _PdfSignerUtilities } from './signature-utilities';
import { _PdfEncryptionAlgorithms } from './encryption-algorithm';
import { _PdfX509CertificateStructure } from '../x509/x509-certificate-structure';
import { _PdfCipherParameter } from '../x509/x509-cipher-handler';
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
    _certificates: _PdfX509Certificate[];
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
    _rsaData: Uint8Array;
    /**
     * Raw signed data bytes when provided externally.
     */
    _signedData: Uint8Array;
    /**
     * Raw signed RSA data bytes when provided externally.
     */
    private _signedRsaData: Uint8Array;
    /**
     * Cached digest used for signature generation.
     */
    private _digest: Uint8Array;
    _signedAttributesBytes: Uint8Array;
    _digestAlgorithmSetOids: any[]; // eslint-disable-line
    _signatureBytes: Uint8Array;
    _messageDigestAttribute: Uint8Array;
    _isTimeStamp: boolean;
    _signer: _ISigner;
    _documentBytes: Uint8Array;
    _signedAttributesDerBytes: Uint8Array;
    _issuerDistinguishedNameBytes: Uint8Array;
    _serialNumberBytes: Uint8Array;
    _digestAlgorithmOidBytes: Uint8Array;
    _encryptionAlgorithm: string;
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
                hashAlgorithm?: string | RevocationType,
                hasRsaData?: boolean) {
        if (privateKey instanceof Uint8Array && privateKey.length === 0 || typeof certChain === 'undefined' || certChain === null ) {
            return;
        }
        if (privateKey instanceof Uint8Array && typeof certChain === 'string') {
            this._initializeCmsSigner(privateKey as Uint8Array, certChain as string);
        } else {
            this._digestAlgorithm = new _PdfMessageDigestAlgorithms();
            this._digestAlgorithmObjectIdentifier = this._digestAlgorithm._getAllowedDigests(hashAlgorithm as string);
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
        if (!sequence || sequence.length < 2) {
            return;
        }
        const oidEl: any = sequence[0]._getObjectIdentifier(); // eslint-disable-line
        const dot: any = oidEl && oidEl._getDotDelimitedNotation && oidEl._getDotDelimitedNotation(); // eslint-disable-line
        if (dot !== '1.2.840.113549.1.7.2') {
            return;
        }
        let innerSequence: _PdfAbstractSyntaxElement[];
        try {
            innerSequence = this._resolveInnerSequence(sequence[1]);
        } catch {
            innerSequence = [];
        }
        if (!innerSequence || innerSequence.length < 3) {
            return;
        }
        this._digestAlgorithmSetOids = [];
        if (innerSequence.length > 1) {
            const digestAlgosSet: _PdfAbstractSyntaxElement[] = this._getChildrenWithFallback(innerSequence[1]) || [];
            for (const algo of digestAlgosSet) {
                const algoSeq: any = (algo as any)._getSequence && (algo as any)._getSequence(); // eslint-disable-line
                if (!algoSeq || algoSeq.length === 0) {
                    continue;
                }
                const algoOidBytes: Uint8Array = (algoSeq[0] as any)._getValue && (algoSeq[0] as any)._getValue(); // eslint-disable-line
                if (algoOidBytes) {
                    this._digestAlgorithmSetOids.push(new _PdfObjectIdentifier()._fromBytes(algoOidBytes).toString());
                }
            }
        }
        if (innerSequence.length > 2) {
            const encapContentInfoSeq: _PdfAbstractSyntaxElement[] = (innerSequence[2] as any)._getSequence && (innerSequence[2] as any)._getSequence(); // eslint-disable-line
            if (encapContentInfoSeq && encapContentInfoSeq.length > 1) {
                const tagged: any = (encapContentInfoSeq[1] as any)._getInner && (encapContentInfoSeq[1] as any)._getInner(); // eslint-disable-line
                const octet: any = tagged && (tagged as any)._getValue && (tagged as any)._getValue(); // eslint-disable-line
                if (octet && octet.length) {
                    this._rsaData = octet;
                }
            }
        }
        const signerInfosContainer: _PdfAbstractSyntaxElement = innerSequence[innerSequence.length - 1];
        const signerInfosSet: _PdfAbstractSyntaxElement[] = this._getChildrenWithFallback(signerInfosContainer) || [];
        if (!signerInfosSet || signerInfosSet.length === 0) {
            return;
        }
        const signerInformationSeq: _PdfAbstractSyntaxElement[] = (signerInfosSet[0] as any)._getSequence && // eslint-disable-line
            (signerInfosSet[0] as any)._getSequence(); // eslint-disable-line
        if (!signerInformationSeq || signerInformationSeq.length < 5) {
            return;
        }
        const v: any = (signerInformationSeq[0] as any)._getInteger && (signerInformationSeq[0] as any)._getInteger(); // eslint-disable-line
        if (typeof v === 'number') {
            this._signerVersion = v;
        }
        const issuerAndSerialSeq: _PdfAbstractSyntaxElement[] = (signerInformationSeq[1] as any)._getSequence && (signerInformationSeq[1] as any)._getSequence(); // eslint-disable-line
        if (issuerAndSerialSeq && issuerAndSerialSeq.length >= 2) {
            const issuerBytes: Uint8Array = (issuerAndSerialSeq[0] as any)._toBytes && (issuerAndSerialSeq[0] as any)._toBytes(); // eslint-disable-line
            const serialBytes: Uint8Array = (issuerAndSerialSeq[1] as any)._getValue && (issuerAndSerialSeq[1] as any)._getValue(); // eslint-disable-line
            if (issuerBytes) {
                this._issuerDistinguishedNameBytes = issuerBytes;
            }
            if (serialBytes) {
                this._serialNumberBytes = serialBytes;
            }
        }
        const digestAlgorithmSeq: _PdfAbstractSyntaxElement[] = (signerInformationSeq[2] as any)._getSequence && // eslint-disable-line
            (signerInformationSeq[2] as any)._getSequence(); // eslint-disable-line
        this._digestAlgorithmOidBytes = digestAlgorithmSeq && digestAlgorithmSeq[0] && (digestAlgorithmSeq[0] as any)._getValue && // eslint-disable-line
            (digestAlgorithmSeq[0] as any)._getValue(); // eslint-disable-line
        if (this._digestAlgorithmOidBytes) {
            this._digestAlgorithmObjectIdentifier = new _PdfObjectIdentifier()._fromBytes(this._digestAlgorithmOidBytes).toString();
        }
        let signedAttributesRawBytes: Uint8Array;
        let messageDigestAttrBytes: Uint8Array;
        const maybeSignedAttrs: _PdfAbstractSyntaxElement = signerInformationSeq[3];
        let signedAttrsInner: _PdfAbstractSyntaxElement;
        let signedAttributes: _PdfAbstractSyntaxElement[] = [];
        if (maybeSignedAttrs) {
            let isCtx0: boolean = false;
            try {
                isCtx0 = (maybeSignedAttrs as any)._isTagged && (maybeSignedAttrs as any)._isTagged() && (maybeSignedAttrs as any)._getTagNumber && // eslint-disable-line
                (maybeSignedAttrs as any)._getTagNumber() === 0; // eslint-disable-line
            } catch {
                /* Ignore*/
            }
            if (isCtx0 && (maybeSignedAttrs as any)._getInner) { // eslint-disable-line
                try {
                    signedAttrsInner = (maybeSignedAttrs as any)._getInner(); // eslint-disable-line
                } catch {
                    /* Ignore*/
                }
            }
            if (!signedAttrsInner) {
                signedAttrsInner = maybeSignedAttrs;
            }
            signedAttributes = this._getChildrenWithFallback(signedAttrsInner);
        }
        if (signedAttributes && signedAttributes.length > 0) {
            let innerSetDer: Uint8Array;
            const tryDer: Uint8Array = signedAttrsInner && (signedAttrsInner as any)._toDerBytes && (signedAttrsInner as any)._toDerBytes(); // eslint-disable-line
            if (tryDer && tryDer.length > 0 && tryDer[0] === 0x31) {
                innerSetDer = tryDer;
            }
            if (!innerSetDer) {
                const parts: Uint8Array[] = [];
                for (const attr of signedAttributes) {
                    let part: Uint8Array;
                    try {
                        part = (attr as any)._toDerBytes ? (attr as any)._toDerBytes() : ((attr as any)._toBytes ? // eslint-disable-line
                            (attr as any)._toBytes() : undefined); // eslint-disable-line
                    } catch {
                        part = (attr as any)._toBytes ? (attr as any)._toBytes() : undefined; // eslint-disable-line
                    }
                    if (part && part.length) {
                        parts.push(part);
                    }
                }
                if (parts.length > 0) {
                    parts.sort((a: any, b: any) => { // eslint-disable-line
                        const n: number = Math.min(a.length, b.length);
                        for (let i: number = 0; i < n; i++) {
                            if (a[<number>i] !== b[<number>i]) {
                                return a[<number>i] - b[<number>i];
                            }
                        }
                        return a.length - b.length;
                    });
                    const innerTotal: number = parts.reduce((s: any, p: any) => s + p.length, 0); // eslint-disable-line
                    const lenBytes: number[] = this._encodeLength(innerTotal);
                    const setBytes: Uint8Array = new Uint8Array(1 + lenBytes.length + innerTotal);
                    setBytes[0] = 0x31;
                    setBytes.set(lenBytes, 1);
                    let pos: number = 1 + lenBytes.length;
                    for (const p of parts) {
                        setBytes.set(p, pos);
                        pos += p.length;
                    }
                    innerSetDer = setBytes;
                }
            }
            if (innerSetDer && innerSetDer.length) {
                this._signedAttributesDerBytes = innerSetDer;
                signedAttributesRawBytes = innerSetDer;
            } else if (signedAttrsInner && (signedAttrsInner as any)._toBytes) { // eslint-disable-line
                signedAttributesRawBytes = (signedAttrsInner as any)._toBytes(); // eslint-disable-line
            }
            for (const attr of signedAttributes) {
                const attrSeq: _PdfAbstractSyntaxElement[] = (attr as any)._getSequence && (attr as any)._getSequence(); // eslint-disable-line
                if (attrSeq && attrSeq.length >= 2) {
                    const attrOid: _PdfObjectIdentifier = (attrSeq[0] as any)._getObjectIdentifier && // eslint-disable-line
                    (attrSeq[0] as any)._getObjectIdentifier(); // eslint-disable-line
                    const attrOidStr: string = attrOid && attrOid._getDotDelimitedNotation && attrOid._getDotDelimitedNotation();
                    if (attrOidStr === '1.2.840.113549.1.9.4') {
                        const attrValuesSet: _PdfAbstractSyntaxElement[] = this._getChildrenWithFallback(attrSeq[1]) || [];
                        if (attrValuesSet.length > 0) {
                            messageDigestAttrBytes = (attrValuesSet[0] as any)._getValue && (attrValuesSet[0] as any)._getValue(); // eslint-disable-line
                        }
                    }
                }
            }
        }
        this._certificates = this._extractCertificatesFromSignedData(innerSequence) || [];
        if (!this._certificates || this._certificates.length === 0) {
            const parser: _PdfX509CertificateParser = new _PdfX509CertificateParser();
            try {
                let cert: _PdfX509Certificate = parser._readCertificateFromStream(bytes, false);
                while (cert) {
                    this._certificates.push(cert);
                    cert = parser._readCertificateFromStream(bytes, false);
                }
            } catch {
                /* Ignore */
            }
        }
        if (this._certificates && this._certificates.length > 0) {
            if (this._issuerDistinguishedNameBytes && this._serialNumberBytes) {
                for (const c of this._certificates) {
                    try {
                        const tbs: Uint8Array = c._getTobeSignedCertificate();
                        const issuerEl: _PdfUniqueEncodingElement = this._getIssuer(tbs);
                        const issuerBytes: Uint8Array = issuerEl && (issuerEl as any)._toBytes && (issuerEl as any)._toBytes(); // eslint-disable-line
                        const signed: any = (c as any)._structure && (c as any)._structure._getSignedCertificate ? // eslint-disable-line
                        (c as any)._structure._getSignedCertificate() : undefined; // eslint-disable-line
                        const serial: Uint8Array = signed ? signed._serialNumber : undefined;
                        if (issuerBytes && serial && this._bytesEqual(issuerBytes, this._issuerDistinguishedNameBytes) &&
                            this._bytesEqual(serial, this._serialNumberBytes)) {
                            this._signatureCertificate = c;
                            break;
                        }
                    } catch {
                        /* Ignore */
                    }
                }
            }
            if (!this._signatureCertificate) {
                this._signatureCertificate = this._certificates[0];
            }
        }
        const hasSignedAttributes: boolean = (this._signedAttributesDerBytes || this._signedAttributesBytes) ? true : false;
        const sigAlgIndex: number = hasSignedAttributes ? 4 : 3;
        const sigValueIndex: number = hasSignedAttributes ? 5 : 4;
        const encryptionAlgorithmSeq: _PdfAbstractSyntaxElement[] = (signerInformationSeq[<number>sigAlgIndex] as any)._getSequence && // eslint-disable-line
        (signerInformationSeq[<number>sigAlgIndex] as any)._getSequence(); // eslint-disable-line
        if (encryptionAlgorithmSeq && encryptionAlgorithmSeq.length > 0) {
            const encOidBytes: Uint8Array = (encryptionAlgorithmSeq[0] as any)._getValue && (encryptionAlgorithmSeq[0] as any)._getValue(); // eslint-disable-line
            if (encOidBytes) {
                this._encryptionAlgorithmObjectIdentifier = new _PdfObjectIdentifier()._fromBytes(encOidBytes).toString();
            }
        }
        try {
            const sigOctet: _PdfAbstractSyntaxElement = signerInformationSeq[<number>sigValueIndex];
            const signatureBytes: Uint8Array = (sigOctet as any)._getValue && (sigOctet as any)._getValue(); // eslint-disable-line
            if (signatureBytes) {
                this._signatureBytes = signatureBytes;
            }
        } catch {
            /* Ignore */
        }
        if (subFilter !== 'ETSI.RFC3161') {
            const res: { hasTimeStamp: boolean; tokenBytes?: Uint8Array } = this._getSignatureTimeStampToken(signerInformationSeq);
            this._hasTimeStamp = res.hasTimeStamp;
            if (res.hasTimeStamp && res.tokenBytes) {
                this._timeStampTokenBytes = res.tokenBytes;
            }
        } else {
            const outerTokenBytes: Uint8Array = stream._toBytes && stream._toBytes();
            this._isTimestampOnly = true;
            this._hasTimeStamp = outerTokenBytes && outerTokenBytes.length > 0;
            this._timeStampTokenBytes = outerTokenBytes;
        }
        if (hasSignedAttributes && signedAttributesRawBytes) {
            this._signedAttributesBytes = signedAttributesRawBytes;
        }
        if (messageDigestAttrBytes) {
            this._messageDigestAttribute = messageDigestAttrBytes;
        }
        if (this._digestAlgorithmObjectIdentifier) {
            this._hashAlgorithm = this._mapDigestOidToName(this._digestAlgorithmObjectIdentifier);
        }
        if (this._encryptionAlgorithmObjectIdentifier) {
            this._encryptionAlgorithm = this._mapEncryptionOidToName(this._encryptionAlgorithmObjectIdentifier);
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
    _getSignatureTimeStampToken(signerInfoSeq: _PdfAbstractSyntaxElement[]): { hasTimeStamp: boolean; tokenBytes?: Uint8Array } {
        const index: number = 6;
        if (!signerInfoSeq || signerInfoSeq.length <= index) {
            return { hasTimeStamp: false };
        }
        const unsignedAttrs: _PdfAbstractSyntaxElement = signerInfoSeq[<number>index];
        if (!unsignedAttrs._isTagged() || unsignedAttrs._getTagNumber() !== 1 || !unsignedAttrs._isConstructed()) {
            return { hasTimeStamp: false };
        }
        const attributes: _PdfAbstractSyntaxElement[] = this._getChildrenWithFallback(unsignedAttrs);
        for (const attr of attributes) {
            const attrSeq: _PdfAbstractSyntaxElement[] = attr._getSequence();
            if (!attrSeq || attrSeq.length < 2) {
                continue;
            }
            const oid: string = attrSeq[0]._getObjectIdentifier()._getDotDelimitedNotation();
            if (oid !== '1.2.840.113549.1.9.16.2.14') {
                continue;
            }
            const attrValues: _PdfAbstractSyntaxElement[] = this._getChildrenWithFallback(attrSeq[1]);
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
    _getChildrenWithFallback(element: _PdfAbstractSyntaxElement): _PdfAbstractSyntaxElement[] {
        if (!element) {
            return [];
        }
        try {
            const set: any = element._getAbstractSetOf(); // eslint-disable-line
            if (set && set.length > 0) {
                return set;
            }
        } catch {
            /* Ignore */
        }
        try {
            const seq: any = element._getSequence(); // eslint-disable-line
            if (seq && seq.length > 0) {
                return seq;
            }
        } catch {
            /* Ignore */
        }
        try {
            const comps: any = element._getComponents(); // eslint-disable-line
            if (comps && comps.length > 0) {
                return comps;
            }
        } catch {
            /* Ignore */
        }
        try {
            return this._decodeChildrenFromContentOctets(element);
        } catch {
            return [];
        }
    }
    _resolveInnerSequence(el: _PdfAbstractSyntaxElement): _PdfAbstractSyntaxElement[] {
        if (!el) {
            return undefined;
        }
        try {
            if ((el as any)._getInner) { // eslint-disable-line
                const maybeInner: any = (el as any)._getInner(); // eslint-disable-line
                return maybeInner ? this._getChildrenWithFallback(maybeInner) : this._getChildrenWithFallback(el);
            }
            return this._getChildrenWithFallback(el);
        } catch {
            return undefined;
        }
    }
    _getDerOrBytes(el: _PdfAbstractSyntaxElement): Uint8Array {
        try {
            const der: any = (el as any)._toDerBytes(); // eslint-disable-line
            if (der && der.length) {
                return der;
            }
        } catch {
            /* Ignore */
        }
        try {
            const b: any = (el as any)._toBytes(); // eslint-disable-line
            if (b && b.length) {
                return b;
            }
        } catch {
            /* Ignore */
        }
        try {
            const v: any = (el as any)._getValue(); // eslint-disable-line
            if (v && v.length) {
                return v;
            }
        } catch {
            /* Ignore */
        }
        return undefined;
    }
    _looksLikeCertificateDer(bytes: Uint8Array): boolean {
        if (!bytes || bytes.length < 8) {
            return false;
        }
        if (bytes[0] !== 0x30) {
            return false;
        }
        const limit: number = Math.min(bytes.length - 5, 80);
        for (let i: number = 0; i < limit; i++) {
            if (bytes[<number>i] === 0xA0 && bytes[i + 1] === 0x03 &&
                bytes[i + 2] === 0x02 && bytes[i + 3] === 0x01 &&
                bytes[i + 4] === 0x02) {
                return true;
            }
            if (bytes[<number>i] === 0xA0 && bytes[i + 1] === 0x03 &&
                bytes[i + 2] === 0x02 && bytes[i + 3] === 0x01 &&
                bytes[i + 4] === 0x01) {
                return true;
            }
        }
        try {
            let pos: number = 1;
            if (bytes[<number>pos] & 0x80) {
                pos += (bytes[<number>pos] & 0x7F) + 1;
            } else {
                pos += 1;
            }
            if (pos < bytes.length && bytes[<number>pos] === 0x30) {
                pos += 1;
                if (bytes[<number>pos] & 0x80) {
                    pos += (bytes[<number>pos] & 0x7F) + 1;
                } else {
                    pos += 1;
                }
                if (pos < bytes.length && bytes[<number>pos] === 0x02) {
                    return true;
                }
            }
        } catch {
            /* Ignore */
        }
        return false;
    }
    _tryParseCertificateNode(node: _PdfAbstractSyntaxElement, parser: _PdfX509CertificateParser): _PdfX509Certificate {
        try {
            const bytes: Uint8Array = this._getDerOrBytes(node);
            if (!bytes || bytes.length === 0) {
                return undefined;
            }
            const cert: _PdfX509Certificate = parser._readCertificateFromStream(bytes, true);
            return cert;
        } catch {
            return undefined;
        }
    }
    _extractCertificatesFromSignedData(innerSequence: _PdfAbstractSyntaxElement[]): _PdfX509Certificate[] {
        const out: _PdfX509Certificate[] = [];
        const parser: _PdfX509CertificateParser = new _PdfX509CertificateParser();
        if (!innerSequence || innerSequence.length < 4) {
            return out;
        }
        const visited: any = new Set<string>(); // eslint-disable-line
        const addCertificate: any = (cert: _PdfX509Certificate): void => { // eslint-disable-line
            if (!cert) {
                return;
            }
            try {
                const key: string = Array.from(cert._getEncoded()).join(',');
                if (!visited.has(key)) {
                    visited.add(key);
                    out.push(cert);
                }
            } catch {
                out.push(cert);
            }
        };
        const walk: any = (node: _PdfAbstractSyntaxElement): void => { // eslint-disable-line
            if (!node) {
                return;
            }
            try {
                const bytes: Uint8Array = this._getDerOrBytes(node);
                if (bytes && bytes.length > 0) {
                    try {
                        const cert: _PdfX509Certificate = parser._readCertificateFromStream(bytes, true);
                        if (cert) {
                            addCertificate(cert);
                        }
                    } catch {
                        /* Ignore */
                    }
                }
            } catch {
                /* Ignore */
            }
            try {
                const children: _PdfAbstractSyntaxElement[] = this._getChildrenWithFallback(node);
                if (children && children.length > 0) {
                    for (const child of children) {
                        walk(child);
                    }
                }
            } catch {
                /* Ignore */
            }
        };
        for (let i: number = 3; i < innerSequence.length - 1; i++) {
            walk(innerSequence[<number>i]);
        }
        return out;
    }
    _mapDigestOidToName(oid: string): string {
        switch (oid) {
        case '1.3.14.3.2.26':
            return 'SHA1';
        case '2.16.840.1.101.3.4.2.1':
            return 'SHA256';
        case '2.16.840.1.101.3.4.2.2':
            return 'SHA384';
        case '2.16.840.1.101.3.4.2.3':
            return 'SHA512';
        case '1.3.36.3.2.1':
            return 'RIPEMD160';
        default:
            return 'SHA256';
        }
    }
    _mapEncryptionOidToName(oid: string): string {
        if (oid === '1.2.840.113549.1.1.1' || oid === '1.2.840.113549.1.1.5' || oid === '1.2.840.113549.1.1.11'
            || oid === '1.2.840.113549.1.1.12' || oid === '1.2.840.113549.1.1.13') {
            return 'RSA';
        }
        if (oid === '1.2.840.10045.4.3.2' || oid === '1.2.840.10045.4.3.3' || oid === '1.2.840.10045.4.3.4') {
            return 'ECDSA';
        }
        return 'RSA';
    }
    _initializeSigner(publicKey: any): _ISigner { // eslint-disable-line
        const signMode: string = `${this._hashAlgorithm}with${this._encryptionAlgorithm}`;
        const util: _PdfSignerUtilities = new _PdfSignerUtilities();
        const signer: _ISigner = util._getSigner(signMode);
        signer._initialize(false, publicKey);
        return signer;
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
    async _signAsync(secondDigest: Uint8Array, signature: PdfSignature, timeStampResponse?: Uint8Array,
                     revocation?: Uint8Array, bytes?: Uint8Array[], sigtype?: CryptographicStandard): Promise<Uint8Array> {
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
    _getEncryptionAlgorithm(): string {
        if (this._encryptionAlgorithm === null || typeof this._encryptionAlgorithm === 'undefined') {
            const algorithm: _PdfEncryptionAlgorithms = new _PdfEncryptionAlgorithms();
            return algorithm._getAlgorithm(this._encryptionAlgorithmObjectIdentifier);
        }
        return null;
    }
    _validateCheckSum(): boolean {
        if (this._isTimeStamp || this._isTimestampOnly) {
            return true;
        }
        const hasSignedAttrs: boolean = !!(this._signedAttributesBytes || this._signedAttributesDerBytes);
        const pickOriginal: any = (): Uint8Array => {// eslint-disable-line
            if (this._signedData && this._signedData.length > 0) {
                return this._signedData;
            }
            if (this._rsaData && this._rsaData.length > 0) {
                return this._rsaData;
            }
            if (this._documentBytes && this._documentBytes.length > 0) {
                return this._documentBytes as Uint8Array;
            }
            return undefined;
        };
        if (hasSignedAttrs) {
            const isRsaDataVerified: boolean = true;
            let hasSameContent: boolean = false;
            let isEncodedDigest: boolean = false;
            const originalBytes: Uint8Array = pickOriginal();
            if (!originalBytes || !originalBytes.length) {
                return false;
            }
            try {
                const digestHasher: any = this._digestAlgorithm._getMessageDigest(this._getHashAlgorithm());// eslint-disable-line
                let messageDigestBytes: Uint8Array = digestHasher._hash(originalBytes, 0, originalBytes.length);
                if (!messageDigestBytes && this._rsaData && this._rsaData.length) {
                    messageDigestBytes = digestHasher._hash(this._rsaData, 0, this._rsaData.length);
                }
                if (this._messageDigestAttribute) {
                    const digestFromAttr: Uint8Array = this._extractDigestFromAttribute(this._messageDigestAttribute);
                    if (digestFromAttr && messageDigestBytes) {
                        hasSameContent = this._bytesEqual(messageDigestBytes, digestFromAttr);
                    }
                    if (!hasSameContent && this._digestAlgorithmOidBytes) {
                        let digestForEncoded: Uint8Array = messageDigestBytes;
                        if (!digestForEncoded && this._rsaData && this._rsaData.length) {
                            digestForEncoded = digestHasher._hash(this._rsaData, 0, this._rsaData.length);
                        }
                        if (digestForEncoded) {
                            const oid: any = Array.from(this._digestAlgorithmOidBytes); // eslint-disable-line
                            const algInner: number = oid.length + 2;
                            const algLen: any = this._encodeLength(algInner); // eslint-disable-line
                            const algId: number[] = [0x30];
                            if (algLen.length === 1 && algLen[0] < 128) {
                                algId.push(algLen[0]);
                            } else {
                                algId.push(0x80 | algLen.length, ...algLen);
                            }
                            algId.push(...oid, 0x05, 0x00);
                            const dLen: number[] = this._encodeLength(digestForEncoded.length);
                            const dOct: number[] = [0x04];
                            if (dLen.length === 1 && dLen[0] < 128) {
                                dOct.push(dLen[0]);
                            } else {
                                dOct.push(0x80 | dLen.length, ...dLen);
                            }
                            dOct.push(...Array.from(digestForEncoded));
                            const totalInner: number = algId.length + dOct.length;
                            const tLen: number[] = this._encodeLength(totalInner);
                            const out: number[] = [0x30];
                            if (tLen.length === 1 && tLen[0] < 128) {
                                out.push(tLen[0]);
                            } else {
                                out.push(0x80 | tLen.length, ...tLen);
                            }
                            out.push(...algId, ...dOct);
                            const encodedDigestBytes: Uint8Array = new Uint8Array(out);
                            isEncodedDigest = this._bytesEqual(encodedDigestBytes, this._messageDigestAttribute);
                        }
                    }
                }
                if (!hasSameContent && messageDigestBytes && this._messageDigestAttribute) {
                    hasSameContent = this._bytesEqual(messageDigestBytes, this._messageDigestAttribute);
                }
            } catch (e) {
                throw new Error(e.message);
            }
            if (hasSameContent || isEncodedDigest) {
                const validateAttrResult1: boolean = this._validateAttributes(this._signedAttributesBytes);
                const validateAttrResult2: boolean = this._validateAttributes(this._signedAttributesDerBytes);
                if (validateAttrResult1 || validateAttrResult2) {
                    return isRsaDataVerified;
                }
                return isRsaDataVerified;
            }
            return false;
        }
        if (this._signer && this._signatureBytes) {
            const originalBytes: Uint8Array = pickOriginal();
            if (!originalBytes || !originalBytes.length) {
                return false;
            }
            try {
                const digestHasher: any = this._digestAlgorithm._getMessageDigest(this._getHashAlgorithm());// eslint-disable-line
                const messageBytes: Uint8Array = digestHasher._hash(originalBytes, 0, originalBytes.length);
                this._signer._blockUpdate(messageBytes, 0, messageBytes.length);
                return this._signer._validateSignature(this._signatureBytes);
            } catch {
                /* Ignore */
            }
            const dataToVerify: Uint8Array = this._signedAttributesDerBytes ||
                this._signedAttributesBytes || this._rsaData || new Uint8Array(0);
            this._signer._blockUpdate(dataToVerify, 0, dataToVerify.length);
            return this._signer._validateSignature(this._signatureBytes);
        }
        return false;
    }
    _validateAttributes(attr: Uint8Array): boolean {
        if (!attr || !attr.length || !this._signatureBytes) {
            return false;
        }
        try {
            const verifier: _ISigner = this._initializeSigner(this._signatureCertificate._getPublicKey());
            verifier._blockUpdate(attr, 0, attr.length);
            const res: boolean = verifier._validateSignature(this._signatureBytes);
            return res;
        } catch (e) {
            return false;
        }
    }
    _extractDigestFromAttribute(attr: Uint8Array): Uint8Array {
        if (!attr || !attr.length) {
            return undefined;
        }
        try {
            if ([20, 32, 48, 64].indexOf(attr.length) !== -1) {
                return attr;
            }
            if (attr[0] === 0x04) {
                let idx: number = 1;
                let len: number = attr[1];
                idx++;
                if (len & 0x80) {
                    const n: number = len & 0x7f;
                    len = 0;
                    for (let i: number = 0; i < n; i++) {
                        len = (len << 8) + attr[idx++];
                    }
                }
                if (idx + len <= attr.length) {
                    return attr.subarray(idx, idx + len);
                }
                return undefined;
            }
            if (attr[0] === 0x30) {
                let idx: number = 1;
                if (idx >= attr.length) {
                    return undefined;
                }
                let len: number = attr[idx++];
                if (len & 0x80) {
                    const n: number = len & 0x7f;
                    len = 0;
                    for (let i: number = 0; i < n && idx < attr.length; i++) {
                        len = (len << 8) + attr[idx++];
                    }
                }
                while (idx < attr.length) {
                    if (attr[<number>idx] === 0x04) {
                        let k: number = idx + 1;
                        if (k >= attr.length) {
                            return undefined;
                        }
                        let l: number = attr[k++];
                        if (l & 0x80) {
                            const n: number = l & 0x7f;
                            l = 0;
                            for (let j: number = 0; j < n && k < attr.length; j++) {
                                l = (l << 8) + attr[k++];
                            }
                        }
                        if (k + l <= attr.length) {
                            return attr.subarray(k, k + l);
                        }
                        return undefined;
                    }
                    idx++;
                }
            }
        } catch {
            return undefined;
        }
        return undefined;
    }
    _bytesEqual(a: Uint8Array, b: Uint8Array): boolean {
        if (!a || !b || a.length !== b.length) {
            return false;
        }
        for (let i: number = 0; i < a.length; i++) {
            if (a[<number>i] !== b[<number>i]) {
                return false;
            }
        }
        return true;
    }
    _verifyRsaPkcs1Signature(hashName: 'SHA1' | 'SHA256' | 'SHA384' | 'SHA512',
                             data: Uint8Array, signature: Uint8Array, publicKey: _ICipherParam): boolean {
        try {
            const util: _PdfSignerUtilities = new _PdfSignerUtilities();
            const signMode: string = `${hashName}withRSA`;
            const verifier: _ISigner = util._getSigner(signMode);
            verifier._initialize(false, publicKey);
            verifier._blockUpdate(data, 0, data.length);
            return verifier._validateSignature(signature) === true;
        } catch {
            return false;
        }
    }
    /**
     * Verifies TSA signature on timestamp token.
     *
     * @private
     * @param {Uint8Array} token Raw timestamp token bytes
     * @returns {boolean} True if TSA signature is valid, false otherwise
     */
    _verifyTsaSignature(token: Uint8Array): boolean {
        try {
            const element: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
            element._fromBytes(token);
            const topChildren: _PdfAbstractSyntaxElement[] = element._getComponents();
            if (!topChildren || topChildren.length < 2) {
                return false;
            }
            const contentWrapper: _PdfAbstractSyntaxElement = topChildren[1];
            const contentChildren: _PdfAbstractSyntaxElement[] = contentWrapper._getComponents();
            const signedDataSeq: _PdfAbstractSyntaxElement = contentChildren[0];
            const signedChildren: _PdfAbstractSyntaxElement[] = signedDataSeq._getComponents();
            if (!signedChildren || signedChildren.length < 4) {
                return false;
            }
            const tsaCertBytes: Uint8Array = this._extractTsaCertificate(token);
            if (!tsaCertBytes) {
                return false;
            }
            const tsaStructure: _PdfX509CertificateStructure = new _PdfX509CertificateStructure();
            tsaStructure._fromDer(tsaCertBytes);
            const tsaCert: _PdfX509Certificate = new _PdfX509Certificate(tsaStructure);
            const publicKey: _PdfCipherParameter = tsaCert._getPublicKey();
            const encapContentInfo: _PdfAbstractSyntaxElement = signedChildren[2];
            const encapChildren: _PdfAbstractSyntaxElement[] = encapContentInfo._getComponents();
            if (!encapChildren || encapChildren.length < 2) {
                return false;
            }
            const eContentWrapper: _PdfAbstractSyntaxElement = encapChildren[1];
            const eContentChildren: _PdfAbstractSyntaxElement[] = eContentWrapper._getComponents();
            const tstInfoBytes: Uint8Array = eContentChildren[0]._toBytes();
            const signerInfos: _PdfAbstractSyntaxElement = signedChildren[signedChildren.length - 1];
            const signerInfosChildren: _PdfAbstractSyntaxElement[] = signerInfos._getComponents();
            if (!signerInfosChildren || signerInfosChildren.length === 0) {
                return false;
            }
            const signerInfo: _PdfAbstractSyntaxElement = signerInfosChildren[0];
            const signerChildren: _PdfAbstractSyntaxElement[] = signerInfo._getComponents();
            let signedAttrs: any = null; // eslint-disable-line
            let signatureAlgorithm: any = null; // eslint-disable-line
            let signatureValue: any = null; // eslint-disable-line
            if (signerChildren.length >= 6) {
                signedAttrs = signerChildren[3];
                signatureAlgorithm = signerChildren[4];
                signatureValue = signerChildren[5];
            } else if (signerChildren.length >= 5) {
                signatureAlgorithm = signerChildren[3];
                signatureValue = signerChildren[4];
            } else {
                return false;
            }
            const digestAlgo: _PdfAbstractSyntaxElement = signerChildren[2];
            const digestOid: string = digestAlgo._getComponents()[0]
                ._getObjectIdentifier().toString();
            const sigOid: string = signatureAlgorithm._getComponents()[0]
                ._getObjectIdentifier().toString();
            let finalAlgorithm: string;
            if (sigOid === '1.2.840.113549.1.1.1') {
                if (digestOid === '1.3.14.3.2.26') {
                    finalAlgorithm = 'SHA-1withRSA';
                } else if (digestOid === '2.16.840.1.101.3.4.2.1') {
                    finalAlgorithm = 'SHA-256withRSA';
                } else if (digestOid === '2.16.840.1.101.3.4.2.2') {
                    finalAlgorithm = 'SHA-384withRSA';
                } else if (digestOid === '2.16.840.1.101.3.4.2.3') {
                    finalAlgorithm = 'SHA-512withRSA';
                } else {
                    return false;
                }
            } else {
                finalAlgorithm = sigOid;
            }
            let signature: Uint8Array = signatureValue._getValue();
            if (signatureValue._tag === 0x03) {
                if (signature.length > 0) {
                    signature = signature.slice(1);
                }
            }
            let modLen: number;
            if ((publicKey as any).modulus) { // eslint-disable-line
                modLen = (publicKey as any).modulus.length; // eslint-disable-line
            } else if ((publicKey as any)._modulus) { // eslint-disable-line
                modLen = (publicKey as any)._modulus.length; // eslint-disable-line
            } else {
                throw new Error('Cannot determine RSA modulus length');
            }
            if (signature.length > modLen) {
                if (signature[0] === 0x00) {
                    signature = signature.slice(1);
                } else {
                    signature = signature.slice(signature.length - modLen);
                }
            }
            if (signature.length < modLen) {
                const padded: Uint8Array = new Uint8Array(modLen);
                padded.set(signature, modLen - signature.length);
                signature = padded;
            }
            let dataToVerify: Uint8Array;
            if (signedAttrs && signedAttrs._construction === _ConstructionType.constructed) {
                const signedAttrsBytes: Uint8Array = signedAttrs._toBytes();
                const derSignedAttrs: Uint8Array = new Uint8Array(signedAttrsBytes);
                derSignedAttrs[0] = 0x31;
                dataToVerify = derSignedAttrs;
            } else {
                dataToVerify = tstInfoBytes;
            }
            const su: _PdfSignerUtilities = new _PdfSignerUtilities();
            const signer: _ISigner = su._getSigner(finalAlgorithm);
            if (!signer) {
                return false;
            }
            signer._initialize(false, publicKey);
            signer._blockUpdate(dataToVerify, 0, dataToVerify.length);
            return signer._validateSignature(signature);
        } catch {
            return false;
        }
    }
    /**
     * Extracts TSA certificate from timestamp token certificates collection.
     *
     * @private
     * @param {Uint8Array} token Raw timestamp token bytes
     * @returns {Uint8Array} TSA certificate bytes
     * @throws {Error} If certificate cannot be extracted
     */
    _extractTsaCertificate(token: Uint8Array): Uint8Array {
        try {
            const element: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
            element._fromBytes(token);
            const topChildren: _PdfAbstractSyntaxElement[] = element._getComponents();
            if (!topChildren || topChildren.length < 2) {
                throw new Error('Invalid ContentInfo structure');
            }
            const contentWrapper: _PdfAbstractSyntaxElement = topChildren[1];
            const contentChildren: _PdfAbstractSyntaxElement[] = contentWrapper._getComponents();
            const signedData: _PdfAbstractSyntaxElement = contentChildren[0];
            const signedChildren: _PdfAbstractSyntaxElement[] = signedData._getComponents();
            if (!signedChildren || signedChildren.length < 4) {
                throw new Error('Invalid SignedData structure');
            }
            const certificatesWrapper: _PdfAbstractSyntaxElement = signedChildren[3];
            if (!certificatesWrapper) {
                throw new Error('No certificates wrapper found');
            }
            let certContainer: _PdfAbstractSyntaxElement = certificatesWrapper;
            if (certificatesWrapper._construction === _ConstructionType.constructed) {
                const wrapperChildren: _PdfAbstractSyntaxElement[] = certificatesWrapper._getComponents();
                if (wrapperChildren.length === 1) {
                    certContainer = wrapperChildren[0];
                }
            }
            const certChildren: _PdfAbstractSyntaxElement[] = certContainer._getComponents();
            if (!certChildren || certChildren.length === 0) {
                throw new Error('No certificates found in timestamp token');
            }
            const firstCert: _PdfAbstractSyntaxElement = certChildren[0];
            if (!firstCert) {
                throw new Error('Failed to extract TSA certificate');
            }
            return firstCert._toBytes();
        } catch (error) {
            throw new Error(`Failed to extract TSA certificate: ${error.message}`);
        }
    }
    /**
     * Checks if certificate has id-kp-timeStamping extended key usage.
     *
     * @private
     * @param {_PdfX509Certificate} cert Certificate to check
     * @returns {boolean} True if certificate has timeStamping EKU
     */
    _hasTimestampExtendedKeyUsage(cert: _PdfX509Certificate): boolean {
        try {
            const ekuOid: _PdfObjectIdentifier = new _PdfObjectIdentifier()._fromString('2.5.29.37');
            const ekuExt: _PdfAbstractSyntaxElement = cert._getExtension(ekuOid);
            if (!ekuExt) {
                return false;
            }
            const rawBytes: Uint8Array = ekuExt._getValue();
            const element: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
            element._fromBytes(rawBytes);
            const seqChildren: _PdfAbstractSyntaxElement[] = element._getComponents();
            if (!seqChildren || seqChildren.length === 0) {
                return false;
            }
            const timestampOid: string = '1.3.6.1.5.5.7.3.8';
            for (let i: number = 0; i < seqChildren.length; i++) {
                const oidElem: _PdfAbstractSyntaxElement = seqChildren[<number>i];
                if (oidElem && oidElem._getTagNumber() === _UniversalType.objectIdentifier) {
                    const oid: string = oidElem._getObjectIdentifier().toString();
                    if (oid === timestampOid) {
                        return true;
                    }
                }
            }
            return false;
        } catch {
            return false;
        }
    }
    /**
     * Checks if certificate serial number appears in CRL revocation list.
     *
     * @private
     * @param {Uint8Array} crlBytes CRL data bytes
     * @param {string} serialNumber Certificate serial number to check
     * @returns {boolean} True if serial found in revoked list
     */
    _checkCertificateSerialInCrl(crlBytes: Uint8Array, serialNumber: string): boolean {
        try {
            const element: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
            element._fromBytes(crlBytes);
            const crlSeq: _PdfAbstractSyntaxElement = element._getComponents()[0];
            const crlChildren: _PdfAbstractSyntaxElement[] = crlSeq._getComponents() || [];
            if (!crlSeq || crlChildren.length < 2) {
                return false;
            }
            const tbsCertList: _PdfAbstractSyntaxElement = crlChildren[0];
            const tbsChildren: _PdfAbstractSyntaxElement[] = tbsCertList._getComponents() || [];
            if (!tbsCertList) {
                return false;
            }
            for (let i: number = 0; i < tbsChildren.length; i++) {
                const child: _PdfAbstractSyntaxElement = tbsChildren[<number>i];
                if (child && child._getTagNumber() === _UniversalType.sequence) {
                    const revokedEntries: _PdfAbstractSyntaxElement[] = child._getComponents();
                    for (let j: number = 0; j < revokedEntries.length; j++) {
                        const entry: _PdfAbstractSyntaxElement = revokedEntries[<number>j];
                        const entryChildren: _PdfAbstractSyntaxElement[] = entry._getComponents() || [];
                        if (entry && entryChildren.length >= 1) {
                            const serialElem: _PdfAbstractSyntaxElement = entryChildren[0];
                            if (serialElem) {
                                const crlSerial: string = serialElem._getInteger().toString();
                                if (crlSerial === serialNumber) {
                                    return true;
                                }
                            }
                        }
                    }
                }
            }
            return false;
        } catch {
            return false;
        }
    }
    _parseX509FromUniqueElement(der: Uint8Array): any { // eslint-disable-line
        const structure: _PdfX509CertificateStructure = new _PdfX509CertificateStructure()._fromDer(der);
        return new _PdfX509Certificate(structure);
    }
    _extractTsaCertificates(token: Uint8Array): any[] { // eslint-disable-line
        const element: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
        element._fromBytes(token);
        const findCertificates = (node: any): any => { // eslint-disable-line
            if (!node) {
                return null;
            }
            if (node._tagClass === _TagClassType.context &&
                node._getTagNumber() === 0) {
                try {
                    const comps: _PdfAbstractSyntaxElement[] = node._getComponents();
                    if (comps && comps.length > 0) {
                        return comps[0];
                    }
                } catch {
                    return null;
                }
            }
            if (node._construction !== _ConstructionType.constructed) {
                return null;
            }
            let children: any[]; // eslint-disable-line
            try {
                children = node._getComponents();
            } catch {
                return null;
            }
            if (!children) {
                return null;
            }
            for (const child of children) {
                const found: any = findCertificates(child); // eslint-disable-line
                if (found) {
                    return found;
                }
            }
            return null;
        };
        const certSet: any = findCertificates(element); // eslint-disable-line
        if (!certSet) {
            return [];
        }
        const certElements: any = certSet._getComponents(); // eslint-disable-line
        const certs: any[] = []; // eslint-disable-line
        for (const certElem of certElements) {
            let actualCert: any = certElem; // eslint-disable-line
            while (actualCert._tagClass === _TagClassType.context) {
                const inner: any = actualCert._getComponents(); // eslint-disable-line
                if (!inner || inner.length === 0) {
                    break;
                }
                actualCert = inner[0];
            }
            if (actualCert._getTagNumber() !== _UniversalType.sequence) {
                continue;
            }
            const raw: Uint8Array = actualCert._toBytes();
            const temp: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
            temp._fromBytes(raw);
            const seq: _PdfAbstractSyntaxElement[] = temp._getSequence();
            if (seq && seq.length > 0 && seq[0]._tagClass === _TagClassType.context) {
                const inner: _PdfAbstractSyntaxElement[] = seq[0]._getComponents();
                if (inner && inner.length > 0) {
                    seq[0] = inner[0];
                }
            }
            if (!seq || seq.length !== 3) {
                continue;
            }
            const structure: _PdfX509CertificateStructure = new _PdfX509CertificateStructure();
            (structure as any)._applySequence(seq); // eslint-disable-line
            certs.push(new _PdfX509Certificate(structure));
        }
        return certs;
    }
}
