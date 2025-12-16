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
export class _PdfCryptographicMessageSyntaxSigner {
    private _digestAlgorithm: _PdfMessageDigestAlgorithms = new _PdfMessageDigestAlgorithms();
    private _version: number;
    private _signerVersion: number;
    private _certificates: _PdfX509Certificate[];
    private _digestObjectIdentifier: Map<string, any>; // eslint-disable-line
    private _digestAlgorithmObjectIdentifier: string;
    private _signatureCertificate: _PdfX509Certificate;
    private _encryptionAlgorithmObjectIdentifier: string;
    private _hashAlgorithm: string;
    private _rsaData: Uint8Array;
    private _signedData: Uint8Array;
    private _signedRsaData: Uint8Array;
    private _digest: Uint8Array;
    constructor(bytes: Uint8Array)
    constructor(privateKey: _ICipherParam,
        certChain: _PdfX509Certificate[],
        hashAlgorithm: string,
        hasRsaData: boolean)
    constructor(privateKey: _ICipherParam | Uint8Array,
                certChain?: _PdfX509Certificate[],
                hashAlgorithm?: string,
                hasRsaData?: boolean) {
        if (privateKey instanceof Uint8Array) {
            this._initializeCmsSigner(privateKey);
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
            if (certChain) {
                this._certificates = [...certChain];
                this._signatureCertificate = this._certificates[0];
            } else {
                this._certificates = [];
                this._signatureCertificate = null;
            }
            if (privateKey) {
                if (this._isRsaKey(privateKey)) {
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
    _initializeCmsSigner(bytes: Uint8Array): void {
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
        }
    }
    _isRsaKey(key: _ICipherParam): boolean {
        return 'modulus' in key && 'exponent' in key;
    }
    _getHashAlgorithm(): string {
        if (!this._hashAlgorithm) {
            this._hashAlgorithm = this._digestAlgorithm._getDigest(this._digestAlgorithmObjectIdentifier);
        }
        return this._hashAlgorithm;
    }
    _getDigestAlgorithm(): _PdfMessageDigestAlgorithms {
        return this._digestAlgorithm;
    }
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
    _createPrimitiveOid(oid: string): _PdfUniqueEncodingElement {
        const element: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
        element._tagClass = _TagClassType.universal;
        element._construction = _ConstructionType.primitive;
        element._setTagNumber(_UniversalType.objectIdentifier);
        element._setValue(this._encodeObjectIdentifier(oid));
        return element;
    }
    _createPrimitiveOctet(value: Uint8Array): _PdfUniqueEncodingElement {
        const element: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
        element._tagClass = _TagClassType.universal;
        element._construction = _ConstructionType.primitive;
        element._setTagNumber(_UniversalType.octetString);
        element._setValue(value);
        return element;
    }
    _createConstructed(tag: number, elements: _PdfUniqueEncodingElement[]): _PdfUniqueEncodingElement {
        const element: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
        element._tagClass = _TagClassType.universal;
        element._construction = _ConstructionType.constructed;
        element._setTagNumber(tag);
        element._setValue(this._encodeSequence(elements));
        return element;
    }
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
    _encodeSequence(elements: _PdfUniqueEncodingElement[]): Uint8Array {
        const content: number[] = [];
        for (const element of elements) {
            const encoded: Uint8Array = this._encodeToUniqueElement(element);
            content.push(...Array.from(encoded));
        }
        return new Uint8Array(content);
    }
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
    _encodeLength(length: number): number[] {
        const bytes: number[] = [];
        while (length > 0) {
            bytes.unshift(length & 0xFF);
            length >>>= 8;
        }
        return bytes;
    }
    _hashCertificate(certificate: _PdfX509Certificate): Uint8Array {
        const certBytes: Uint8Array = certificate._getEncoded();
        const hasher: any = this._digestAlgorithm._getMessageDigest(this._getHashAlgorithm()); // eslint-disable-line
        return hasher._hash(certBytes, 0, certBytes.length);
    }
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
    _createPrimitive(tag: number, value: Uint8Array): _PdfUniqueEncodingElement {
        const element: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
        element._tagClass = _TagClassType.universal;
        element._construction = _ConstructionType.primitive;
        element._setTagNumber(tag);
        element._setValue(value);
        return element;
    }
    _createAsn1Constructed(tag: number, elements: _PdfUniqueEncodingElement[]): _PdfUniqueEncodingElement {
        const element: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
        element._tagClass = _TagClassType.universal;
        element._construction = _ConstructionType.constructed;
        element._setTagNumber(tag);
        element._setSequence(elements);
        return element;
    }
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
            signerInfoElements.push(this._createContextConstructed(0, authenticatedAttrs));
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
    _getIssuer(tbsCertBytes: Uint8Array): _PdfUniqueEncodingElement {
        const tbsElement: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
        tbsElement._fromBytes(tbsCertBytes);
        const elements: _PdfAbstractSyntaxElement[] = tbsElement._getSequence();
        const issuerElement: _PdfUniqueEncodingElement = elements[3] as _PdfUniqueEncodingElement;
        return issuerElement;
    }
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
}
