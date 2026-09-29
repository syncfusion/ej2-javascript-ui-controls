import { _PdfCryptographicMessageSyntaxSigner } from '../src/pdf/core/security/digital-signature/signature/cryptographic-signer';
import { _PdfX509Certificate } from '../src/pdf/core/security/digital-signature/x509/x509-certificate';
import { _PdfDigitalIdentifiers } from '../src/pdf/core/security/digital-signature/signature/pdf-object-identifiers';
import { _ICipherParam } from '../src/pdf/core/security/digital-signature/signature/pdf-interfaces';
import { _ConstructionType, _TagClassType, _UniversalType } from '../src/pdf/core/security/digital-signature/asn1/enumerator';
import { _PdfUniqueEncodingElement } from '../src/pdf/core/security/digital-signature/asn1/unique-encoding-element';
import { _PdfAbstractSyntaxElement } from '../src/pdf/core/security/digital-signature/asn1/abstract-syntax';
import { CryptographicStandard } from '../src/pdf/core/enumerator';
import { _PdfX509CertificateParser } from '../src/pdf/core/security/digital-signature/x509/x509-certificate-parser';
import { _PdfBasicEncodingElement } from '../src/pdf/core/security/digital-signature/asn1/basic-encoding-element';
import { PdfSignature } from '../src/pdf/core/security/digital-signature/signature/pdf-signature';
import { _AdvancedEncryptionBaseCipher } from '../src/pdf/core/security/encryptors/cipher';
function createCertificateForConstructorTest(): _PdfX509Certificate {
    const certificate: _PdfX509Certificate = {} as _PdfX509Certificate;
    Object.setPrototypeOf(certificate, _PdfX509Certificate.prototype);
    return certificate;
}
function decodeBase64(value: string): Uint8Array {
    const decoded: string = atob(value);
    const bytes: Uint8Array = new Uint8Array(decoded.length);
    for (let i: number = 0; i < decoded.length; i++) {
        bytes[i] = decoded.charCodeAt(i);
    }
    return bytes;
}
function createCertificate(): _PdfX509Certificate {
    const encoded: Uint8Array = decodeBase64('MIICCjCCAXOgAwIBAgIULsMLqeUaY+JyDeATKwAg0M2Uu0UwDQYJKoZIhvcNAQELBQAwFzEVMBMGA1UEAwwMTXV0YXRpb25UZXN0MB4XDTI2MDgxODA3MzA0NloXDTI2MDgxOTA3MzA0NlowFzEVMBMGA1UEAwwMTXV0YXRpb25UZXN0MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDca+d5RFhiRm7RPdWkb3GyQW9lhDxWfmtugNgQdjq5LFA+VFsLDHo6/L8TAAZ7Y1jz9BBfzZrR70w1lLmS6/AKHv1StrOFFUcNdKA1lR4r6HXdG8H3t1tWDZYvtROolIGVeEDSD/APS1r6+y3mOdmU3+tfIBZxT57CaX2iJjBz+QIDAQABo1MwUTAdBgNVHQ4EFgQUHUCMJsSKlkdddEINSOotCkDz+dowHwYDVR0jBBgwFoAUHUCMJsSKlkdddEINSOotCkDz+dowDwYDVR0TAQH/BAUwAwEB/zANBgkqhkiG9w0BAQsFAAOBgQCpc0R9l+ySPJvBHnJri7wOMCP9+ZJcGSeBK4QwjCUSAWt8iqXEcFsqhQHuPoEPliJKGbbwmlxVbmCS8NXqXBU0eX1g0UzYc5C99KwB2Z3JzK0exRRaZ3B/OWttLTULE/8UxlHib/X6rS1pn0GPouK+49/k2j24j+czbCqqMRkIKg==');
    const parser: _PdfX509CertificateParser = new _PdfX509CertificateParser();
    return parser._readCertificateFromStream(encoded, true);
}
function encodeLength(length: number): number[] {
    if (length < 128) {
        return [length];
    }
    const bytes: number[] = [];
    let remaining: number = length;
    while (remaining > 0) {
        bytes.unshift(remaining & 0xff);
        remaining >>>= 8;
    }
    return [0x80 | bytes.length, ...bytes];
}
function encodeTlv(tag: number, value: Uint8Array): Uint8Array {
    return new Uint8Array([tag, ...encodeLength(value.length), ...Array.from(value)]);
}
function concatenate(parts: Uint8Array[]): Uint8Array {
    const length: number = parts.reduce((sum: number, part: Uint8Array) => sum + part.length, 0);
    const result: Uint8Array = new Uint8Array(length);
    let offset: number = 0;
    for (const part of parts) {
        result.set(part, offset);
        offset += part.length;
    }
    return result;
}
class EmptyEncodedElement extends _PdfUniqueEncodingElement {
    _toBytes(): Uint8Array {
        return new Uint8Array(0);
    }
}
class TestAdvancedEncryptionBaseCipher extends _AdvancedEncryptionBaseCipher {
    constructor(expandedKey?: Uint8Array) {
        super();
        this._cyclesOfRepetition = 10;
        this._keySize = 160;
        this._key = expandedKey ? expandedKey : new Uint8Array(176);
    }
    _expandKey(cipherKey: Uint8Array): Uint8Array {
        return cipherKey;
    }
}
describe('_PdfCryptographicMessageSyntaxSigner constructor mutation coverage', () => {
    it('keeps timestamp-only state disabled for a newly constructed signer', () => {
        // Arrange
        const emptyCmsBytes: Uint8Array = new Uint8Array(0);
        // Act
        const signer: _PdfCryptographicMessageSyntaxSigner =
            new _PdfCryptographicMessageSyntaxSigner(emptyCmsBytes, 'adbe.pkcs7.detached');
        // Assert
        expect(signer._isTimestampOnly).toBeFalsy();
    });
    it('returns before CMS initialization when the byte array is empty', () => {
        // Arrange
        const emptyCmsBytes: Uint8Array = new Uint8Array(0);
        const originalInitializeCmsSigner: (bytes: Uint8Array, subFilter: string) => void =
            _PdfCryptographicMessageSyntaxSigner.prototype._initializeCmsSigner;
        let initializationCount: number = 0;
        _PdfCryptographicMessageSyntaxSigner.prototype._initializeCmsSigner =
            (_bytes: Uint8Array, _subFilter: string): void => {
                initializationCount++;
            };
        // Act
        const signer: _PdfCryptographicMessageSyntaxSigner =
            new _PdfCryptographicMessageSyntaxSigner(emptyCmsBytes, 'adbe.pkcs7.detached');
        _PdfCryptographicMessageSyntaxSigner.prototype._initializeCmsSigner = originalInitializeCmsSigner;
        // Assert
        expect(signer).toBeDefined();
        expect(initializationCount).toBe(0);
        expect(signer._certificates).toBeUndefined();
    });
    it('returns before digest initialization when certificate chain is undefined', () => {
        // Arrange
        const cmsBytes: Uint8Array = new Uint8Array([0x30]);
        const certificateChain: _PdfX509Certificate[] = undefined as any;
        // Act
        const signer: _PdfCryptographicMessageSyntaxSigner =
            new _PdfCryptographicMessageSyntaxSigner(
                cmsBytes as any, certificateChain, undefined as any, false
            );
        // Assert
        expect(signer._certificates).toBeUndefined();
        expect(signer._rsaData).toBeUndefined();
    });
    it('returns before digest initialization when certificate chain is null', () => {
        // Arrange
        const cmsBytes: Uint8Array = new Uint8Array([0x30]);
        const certificateChain: _PdfX509Certificate[] = null as any;
        // Act
        const signer: _PdfCryptographicMessageSyntaxSigner =
            new _PdfCryptographicMessageSyntaxSigner(
                cmsBytes as any, certificateChain, undefined as any, false
            );
        // Assert
        expect(signer._certificates).toBeUndefined();
        expect(signer._rsaData).toBeUndefined();
    });
    it('initializes CMS only when bytes and string subfilter are both supplied', () => {
        // Arrange
        const cmsBytes: Uint8Array = new Uint8Array([0x30]);
        const originalInitializeCmsSigner: (bytes: Uint8Array, subFilter: string) => void =
            _PdfCryptographicMessageSyntaxSigner.prototype._initializeCmsSigner;
        let receivedBytes: Uint8Array;
        let receivedSubFilter: string;
        _PdfCryptographicMessageSyntaxSigner.prototype._initializeCmsSigner =
            (bytes: Uint8Array, subFilter: string): void => {
                receivedBytes = bytes;
                receivedSubFilter = subFilter;
            };
        // Act
        const signer: _PdfCryptographicMessageSyntaxSigner =
            new _PdfCryptographicMessageSyntaxSigner(cmsBytes, 'adbe.pkcs7.detached');
        _PdfCryptographicMessageSyntaxSigner.prototype._initializeCmsSigner = originalInitializeCmsSigner;
        // Assert
        expect(signer).toBeDefined();
        expect(receivedBytes).toBe(cmsBytes);
        expect(receivedSubFilter).toBe('adbe.pkcs7.detached');
    });
    it('uses signing initialization when private key is not a byte array', () => {
        // Arrange
        const privateKey: _ICipherParam = {
            modulus: new Uint8Array([1]),
            exponent: new Uint8Array([1, 0, 1])
        } as unknown as _ICipherParam;
        const certificateArgument: any = 'adbe.pkcs7.detached';
        const rsaEncryptionOid: string = new _PdfDigitalIdentifiers()._rsaEncryption;
        // Act
        const signer: _PdfCryptographicMessageSyntaxSigner =
            new _PdfCryptographicMessageSyntaxSigner(
                privateKey, certificateArgument, 'SHA256', false
            );
        // Assert
        expect((signer as any)._encryptionAlgorithmObjectIdentifier).toBe(rsaEncryptionOid);
        expect(signer._certificates).toEqual([]);
    });
    it('rejects the complete certificate chain when one entry is not an X509 certificate', () => {
        // Arrange
        const certificate: _PdfX509Certificate = createCertificateForConstructorTest();
        const invalidCertificateEntry: _PdfX509Certificate = null as any;
        const certificateChain: _PdfX509Certificate[] = [certificate, invalidCertificateEntry];
        // Act
        const signer: _PdfCryptographicMessageSyntaxSigner =
            new _PdfCryptographicMessageSyntaxSigner(
                null as any, certificateChain, 'SHA256', false
            );
        // Assert
        expect(signer._certificates).toEqual([]);
        expect(signer._certificates.length).toBe(0);
        expect((signer as any)._signatureCertificate).toBeNull();
    });
    it('copies a valid certificate chain instead of retaining the supplied array', () => {
        // Arrange
        const certificate: _PdfX509Certificate = createCertificateForConstructorTest();
        const certificateChain: _PdfX509Certificate[] = [certificate];
        // Act
        const signer: _PdfCryptographicMessageSyntaxSigner =
            new _PdfCryptographicMessageSyntaxSigner(
                null as any, certificateChain, 'SHA256', false
            );
        certificateChain.length = 0;
        // Assert
        expect(signer._certificates).not.toBe(certificateChain);
        expect(signer._certificates.length).toBe(1);
        expect(signer._certificates[0]).toBe(certificate);
    });
});
function createSigner(): _PdfCryptographicMessageSyntaxSigner {
    return new _PdfCryptographicMessageSyntaxSigner(new Uint8Array(0), 'adbe.pkcs7.detached');
}
function createElement(tag: number, value: Uint8Array,
    construction: _ConstructionType = _ConstructionType.primitive,
    tagClass: _TagClassType = _TagClassType.universal): _PdfUniqueEncodingElement {
    const element: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
    element._tagClass = tagClass;
    element._construction = construction;
    element._setTagNumber(tag);
    element._setValue(value);
    return element;
}
function createSequence(elements: _PdfUniqueEncodingElement[]): _PdfUniqueEncodingElement {
    const element: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
    element._tagClass = _TagClassType.universal;
    element._construction = _ConstructionType.constructed;
    element._setTagNumber(_UniversalType.sequence);
    element._setSequence(elements);
    return element;
}
function createSet(elements: _PdfUniqueEncodingElement[]): _PdfUniqueEncodingElement {
    const element: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
    element._tagClass = _TagClassType.universal;
    element._construction = _ConstructionType.constructed;
    element._setTagNumber(_UniversalType.abstractSyntaxSet);
    element._setAbstractSetValue(elements);
    return element;
}
function createContext(tag: number, elements: _PdfUniqueEncodingElement[]): _PdfUniqueEncodingElement {
    const element: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
    element._tagClass = _TagClassType.context;
    element._construction = _ConstructionType.constructed;
    element._setTagNumber(tag);
    element._setSequence(elements);
    return element;
}
function encodeOid(signer: _PdfCryptographicMessageSyntaxSigner, oid: string): _PdfUniqueEncodingElement {
    return createElement(_UniversalType.objectIdentifier, signer._encodeObjectIdentifier(oid));
}
function createSignedAttributes(signer: _PdfCryptographicMessageSyntaxSigner): _PdfUniqueEncodingElement {
    const contentTypeAttribute: _PdfUniqueEncodingElement = createSequence([
        encodeOid(signer, '1.2.840.113549.1.9.3'),
        createSet([encodeOid(signer, '1.2.840.113549.1.7.1')])
    ]);
    const messageDigestAttribute: _PdfUniqueEncodingElement = createSequence([
        encodeOid(signer, '1.2.840.113549.1.9.4'),
        createSet([
            createElement(_UniversalType.octetString, new Uint8Array([5, 6, 7, 8]))
        ])
    ]);
    return createContext(0, [contentTypeAttribute, messageDigestAttribute]);
}
function createMinimalCms(signer: _PdfCryptographicMessageSyntaxSigner,
    includeUnsignedTimestamp: boolean): Uint8Array {
    const digestAlgorithm: _PdfUniqueEncodingElement = createSequence([
        encodeOid(signer, '2.16.840.1.101.3.4.2.1'),
        createElement(_UniversalType.nullValue, new Uint8Array(0))
    ]);
    const digestAlgorithms: _PdfUniqueEncodingElement = createSet([digestAlgorithm]);
    const contentInfo: _PdfUniqueEncodingElement = createSequence([
        encodeOid(signer, '1.2.840.113549.1.7.1')
    ]);
    const issuer: _PdfUniqueEncodingElement = createSequence([]);
    const issuerAndSerial: _PdfUniqueEncodingElement = createSequence([
        issuer,
        createElement(_UniversalType.integer, new Uint8Array([1]))
    ]);
    const signatureAlgorithm: _PdfUniqueEncodingElement = createSequence([
        encodeOid(signer, '1.2.840.113549.1.1.1'),
        createElement(_UniversalType.nullValue, new Uint8Array(0))
    ]);
    const signerInfoElements: _PdfUniqueEncodingElement[] = [
        createElement(_UniversalType.integer, new Uint8Array([1])),
        issuerAndSerial,
        digestAlgorithm,
        createSignedAttributes(signer),
        signatureAlgorithm,
        createElement(_UniversalType.octetString, new Uint8Array([9, 8, 7]))
    ];
    if (includeUnsignedTimestamp) {
        const token: _PdfUniqueEncodingElement = createSequence([
            encodeOid(signer, '1.2.840.113549.1.7.2')
        ]);
        const attribute: _PdfUniqueEncodingElement = createSequence([
            encodeOid(signer, '1.2.840.113549.1.9.16.2.14'),
            createSet([token])
        ]);
        signerInfoElements.push(createContext(1, [attribute]));
    }
    const signerInfos: _PdfUniqueEncodingElement = createSet([createSequence(signerInfoElements)]);
    const signedData: _PdfUniqueEncodingElement = createSequence([
        createElement(_UniversalType.integer, new Uint8Array([1])),
        digestAlgorithms,
        contentInfo,
        signerInfos
    ]);
    const content: _PdfUniqueEncodingElement = createContext(0, [signedData]);
    const root: _PdfUniqueEncodingElement = createSequence([
        encodeOid(signer, '1.2.840.113549.1.7.2'),
        content
    ]);
    return root._toBytes();
}
describe('_PdfCryptographicMessageSyntaxSigner initialize CMS mutation coverage', () => {
    it('returns without changing state when the decoded root sequence has fewer than two elements', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();
        const root: _PdfUniqueEncodingElement = createSequence([
            encodeOid(signer, '1.2.840.113549.1.7.2')
        ]);
        // Act
        signer._initializeCmsSigner(root._toBytes(), 'adbe.pkcs7.detached');
        // Assert
        expect(signer._certificates).toBeUndefined();
        expect(signer._hasTimeStamp).toBeFalsy();
        expect(signer._timeStampTokenBytes).toBeUndefined();
    });
    it('returns when the content type is not signedData', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();
        const root: _PdfUniqueEncodingElement = createSequence([
            encodeOid(signer, '1.2.840.113549.1.7.1'),
            createContext(0, [createSequence([])])
        ]);
        // Act
        signer._initializeCmsSigner(root._toBytes(), 'adbe.pkcs7.detached');
        // Assert
        expect(signer._certificates).toBeUndefined();
        expect(signer._digestAlgorithmSetOids).toBeUndefined();
        expect(signer._signatureBytes).toBeUndefined();
    });
    it('returns when signedData resolves to fewer than three elements', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();
        const signedData: _PdfUniqueEncodingElement = createSequence([
            createElement(_UniversalType.integer, new Uint8Array([1])),
            createSet([])
        ]);
        const root: _PdfUniqueEncodingElement = createSequence([
            encodeOid(signer, '1.2.840.113549.1.7.2'),
            createContext(0, [signedData])
        ]);
        // Act
        signer._initializeCmsSigner(root._toBytes(), 'adbe.pkcs7.detached');
        // Assert
        expect(signer._certificates).toBeUndefined();
        expect(signer._digestAlgorithmSetOids).toBeUndefined();
        expect(signer._signatureBytes).toBeUndefined();
    });
    it('parses the signed-data OID and exact signer information outputs', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();
        const cmsBytes: Uint8Array = createMinimalCms(signer, false);
        // Act
        signer._initializeCmsSigner(cmsBytes, 'adbe.pkcs7.detached');
        // Assert
        expect(signer._digestAlgorithmSetOids).toEqual(['2.16.840.1.101.3.4.2.1']);
        expect(signer._signatureBytes).toEqual(new Uint8Array([9, 8, 7]));
        expect((signer as any)._signerVersion).toBe(1);
        expect((signer as any)._digestAlgorithmObjectIdentifier).toBe('2.16.840.1.101.3.4.2.1');
        expect((signer as any)._encryptionAlgorithmObjectIdentifier).toBe('1.2.840.113549.1.1.1');
        expect((signer as any)._hashAlgorithm).toBe('SHA256');
        expect(signer._hasTimeStamp).toBeFalsy();
    });
    it('stores the timestamp token only when the unsigned attribute reports a token', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();
        const cmsBytes: Uint8Array = createMinimalCms(signer, true);
        // Act
        signer._initializeCmsSigner(cmsBytes, 'adbe.pkcs7.detached');
        // Assert
        expect(signer._hasTimeStamp).toBeTruthy();
        expect(signer._timeStampTokenBytes).toBeDefined();
        expect(signer._timeStampTokenBytes.length).toBeGreaterThan(0);
        expect(signer._isTimestampOnly).toBeFalsy();
    });
    it('stores the complete outer token for ETSI RFC3161', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();
        const cmsBytes: Uint8Array = createMinimalCms(signer, false);
        // Act
        signer._initializeCmsSigner(cmsBytes, 'ETSI.RFC3161');
        // Assert
        expect(signer._isTimestampOnly).toBeTruthy();
        expect(signer._hasTimeStamp).toBeTruthy();
        expect(signer._timeStampTokenBytes).toEqual(cmsBytes);
        expect(signer._timeStampTokenBytes.length).toBe(cmsBytes.length);
    });
    it('returns no timestamp when signer information has no unsigned attribute index', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();
        const signerInformation: _PdfAbstractSyntaxElement[] = [];
        // Act
        const result: { hasTimeStamp: boolean; tokenBytes?: Uint8Array } =
            signer._getSignatureTimeStampToken(signerInformation);
        // Assert
        expect(result.hasTimeStamp).toBeFalsy();
        expect(result.tokenBytes).toBeUndefined();
    });
    it('returns no timestamp for a non-context-one unsigned attribute', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();
        const signerInformation: _PdfAbstractSyntaxElement[] = [
            createSequence([]), createSequence([]), createSequence([]), createSequence([]),
            createSequence([]), createSequence([]), createContext(0, [])
        ];
        // Act
        const result: { hasTimeStamp: boolean; tokenBytes?: Uint8Array } =
            signer._getSignatureTimeStampToken(signerInformation);
        // Assert
        expect(result.hasTimeStamp).toBeFalsy();
        expect(result.tokenBytes).toBeUndefined();
    });
    it('requires every tagged-element predicate before resolving timestamp content', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();
        const token: _PdfUniqueEncodingElement = createSequence([
            encodeOid(signer, '1.2.840.113549.1.7.2')
        ]);
        const attribute: _PdfUniqueEncodingElement = createSequence([
            encodeOid(signer, '1.2.840.113549.1.9.16.2.14'),
            createSet([token])
        ]);
        const unsignedAttributes: _PdfUniqueEncodingElement = createContext(1, [attribute]);
        const signerInformation: _PdfAbstractSyntaxElement[] = [
            createSequence([]), createSequence([]), createSequence([]), createSequence([]),
            createSequence([]), createSequence([]), unsignedAttributes
        ];
        // Act
        const result: { hasTimeStamp: boolean; tokenBytes?: Uint8Array } =
            signer._getSignatureTimeStampToken(signerInformation);
        // Assert
        expect(unsignedAttributes._isTagged()).toBeTruthy();
        expect(unsignedAttributes._getTagNumber()).toBe(1);
        expect(unsignedAttributes._isConstructed()).toBeTruthy();
        expect(result.hasTimeStamp).toBeTruthy();
        expect(result.tokenBytes).toEqual(token._toBytes());
    });
    it('decodes every valid child and stops at the exact content boundary', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();
        const first: _PdfUniqueEncodingElement = createElement(
            _UniversalType.integer,
            new Uint8Array([1])
        );
        const second: _PdfUniqueEncodingElement = createElement(
            _UniversalType.integer,
            new Uint8Array([2])
        );
        const firstBytes: Uint8Array = first._toBytes();
        const secondBytes: Uint8Array = second._toBytes();
        const value: Uint8Array = new Uint8Array(firstBytes.length + secondBytes.length);
        value.set(firstBytes, 0);
        value.set(secondBytes, firstBytes.length);
        const implicitElement: _PdfUniqueEncodingElement =
            signer._createContextConstructed(0, value);
        // Act
        const children: _PdfAbstractSyntaxElement[] =
            signer._decodeChildrenFromContentOctets(implicitElement);
        // Assert
        expect(children.length).toBe(2);
        expect(children[0]._getInteger()).toBe(1);
        expect(children[1]._getInteger()).toBe(2);
    });
    it('resolves children through set sequence components and content-octet fallbacks', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();
        const integer: _PdfUniqueEncodingElement = createElement(
            _UniversalType.integer,
            new Uint8Array([3])
        );
        const setElement: _PdfUniqueEncodingElement = createSet([integer]);
        const sequenceElement: _PdfUniqueEncodingElement = createSequence([integer]);
        const implicitElement: _PdfUniqueEncodingElement =
            signer._createContextConstructed(0, integer._toBytes());
        // Act
        const setChildren: _PdfAbstractSyntaxElement[] =
            signer._getChildrenWithFallback(setElement);
        const sequenceChildren: _PdfAbstractSyntaxElement[] =
            signer._getChildrenWithFallback(sequenceElement);
        const implicitChildren: _PdfAbstractSyntaxElement[] =
            signer._getChildrenWithFallback(implicitElement);
        const missingChildren: _PdfAbstractSyntaxElement[] =
            signer._getChildrenWithFallback(undefined);
        // Assert
        expect(setChildren.length).toBe(1);
        expect(sequenceChildren.length).toBe(1);
        expect(implicitChildren.length).toBe(1);
        expect(implicitChildren[0]._getInteger()).toBe(3);
        expect(missingChildren).toEqual([]);
    });
    it('resolves an inner tagged sequence and rejects a missing element', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();
        const child: _PdfUniqueEncodingElement = createElement(
            _UniversalType.integer,
            new Uint8Array([4])
        );
        const wrapper: _PdfUniqueEncodingElement = createContext(0, [createSequence([child])]);
        // Act
        const resolved: _PdfAbstractSyntaxElement[] = signer._resolveInnerSequence(wrapper);
        const missing: _PdfAbstractSyntaxElement[] = signer._resolveInnerSequence(undefined);
        // Assert
        expect(resolved.length).toBe(1);
        expect(resolved[0]._getInteger()).toBe(4);
        expect(missing).toBeUndefined();
    });
});
describe('_PdfCryptographicMessageSyntaxSigner targeted mutation coverage', () => {
    function encodeOid(signer: _PdfCryptographicMessageSyntaxSigner, oid: string): Uint8Array {
        return encodeTlv(0x06, signer._encodeObjectIdentifier(oid));
    }
    function createSigner(): _PdfCryptographicMessageSyntaxSigner {
        return new _PdfCryptographicMessageSyntaxSigner(new Uint8Array(0), 'adbe.pkcs7.detached');
    }
    function createElement(tag: number, value: Uint8Array,
        construction: _ConstructionType = _ConstructionType.primitive,
        tagClass: _TagClassType = _TagClassType.universal): _PdfUniqueEncodingElement {
        const element: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
        element._tagClass = tagClass;
        element._construction = construction;
        element._setTagNumber(tag);
        element._setValue(value);
        return element;
    }
    function createSequence(elements: _PdfUniqueEncodingElement[]): _PdfUniqueEncodingElement {
        const element: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
        element._tagClass = _TagClassType.universal;
        element._construction = _ConstructionType.constructed;
        element._setTagNumber(_UniversalType.sequence);
        element._setSequence(elements);
        return element;
    }
    function createSet(elements: _PdfUniqueEncodingElement[]): _PdfUniqueEncodingElement {
        const element: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
        element._tagClass = _TagClassType.universal;
        element._construction = _ConstructionType.constructed;
        element._setTagNumber(_UniversalType.abstractSyntaxSet);
        element._setAbstractSetValue(elements);
        return element;
    }
    function buildExpectedBaseAttributes(
        signer: _PdfCryptographicMessageSyntaxSigner,
        digest: Uint8Array
    ): Uint8Array[] {
        const contentTypeOid: Uint8Array = encodeTlv(
            0x06,
            signer._encodeObjectIdentifier('1.2.840.113549.1.9.3')
        );
        const pkcs7DataOid: Uint8Array = encodeTlv(
            0x06,
            signer._encodeObjectIdentifier('1.2.840.113549.1.7.1')
        );
        const messageDigestOid: Uint8Array = encodeTlv(
            0x06,
            signer._encodeObjectIdentifier('1.2.840.113549.1.9.4')
        );
        const contentTypeValue: Uint8Array = encodeTlv(
            0x31,
            pkcs7DataOid
        );
        const contentType: Uint8Array = encodeTlv(
            0x30,
            concatenate([
                contentTypeOid,
                contentTypeValue
            ])
        );
        const digestOctet: Uint8Array = encodeTlv(
            0x04,
            digest
        );
        const digestSet: Uint8Array = encodeTlv(
            0x31,
            digestOctet
        );
        const messageDigest: Uint8Array = encodeTlv(
            0x30,
            concatenate([
                messageDigestOid,
                digestSet
            ])
        );
        return [contentType, messageDigest];
    }
    function buildExpectedSigningCertificateV2(
        signer: _PdfCryptographicMessageSyntaxSigner,
        certificateHash: Uint8Array,
        includeAlgorithm: boolean,
        digestOid: string
    ): Uint8Array {
        const certificateHashOctet: Uint8Array = encodeTlv(
            0x04,
            certificateHash
        );
        const signingCertificateOid: Uint8Array = encodeTlv(
            0x06,
            signer._encodeObjectIdentifier('1.2.840.113549.1.9.16.2.47')
        );
        let certificateIdentifierValue: Uint8Array = certificateHashOctet;
        if (includeAlgorithm) {
            const hashAlgorithmOid: Uint8Array = encodeTlv(
                0x06,
                signer._encodeObjectIdentifier(digestOid)
            );
            const hashAlgorithmSequence: Uint8Array = encodeTlv(
                0x30,
                hashAlgorithmOid
            );
            certificateIdentifierValue = concatenate([
                hashAlgorithmSequence,
                certificateHashOctet
            ]);
        }
        const certificateIdentifier: Uint8Array = encodeTlv(
            0x30,
            certificateIdentifierValue
        );
        const certificates: Uint8Array = encodeTlv(
            0x30,
            certificateIdentifier
        );
        const signingCertificate: Uint8Array = encodeTlv(
            0x30,
            certificates
        );
        const signingCertificateSet: Uint8Array = encodeTlv(
            0x31,
            signingCertificate
        );
        return encodeTlv(
            0x30,
            concatenate([
                signingCertificateOid,
                signingCertificateSet
            ])
        );
    }
    function createContext(tag: number, elements: _PdfUniqueEncodingElement[]): _PdfUniqueEncodingElement {
        const element: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
        element._tagClass = _TagClassType.context;
        element._construction = _ConstructionType.constructed;
        element._setTagNumber(tag);
        element._setSequence(elements);
        return element;
    }
    it('returns false when unsigned attributes are not context tag one', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();
        const signerInformation: _PdfAbstractSyntaxElement[] = [
            createSequence([]), createSequence([]), createSequence([]), createSequence([]),
            createSequence([]), createSequence([]), createContext(0, [])
        ];
        // Act
        const result: { hasTimeStamp: boolean; tokenBytes?: Uint8Array } =
            signer._getSignatureTimeStampToken(signerInformation);
        // Assert
        expect(result.hasTimeStamp).toBeFalsy();
        expect(result.tokenBytes).toBeUndefined();
    });
    it('returns false when unsigned attributes are not constructed', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();
        const primitiveContextOne: _PdfUniqueEncodingElement = createElement(
            1, new Uint8Array(0), _ConstructionType.primitive, _TagClassType.context
        );
        const signerInformation: _PdfAbstractSyntaxElement[] = [
            createSequence([]), createSequence([]), createSequence([]), createSequence([]),
            createSequence([]), createSequence([]), primitiveContextOne
        ];
        // Act
        const result: { hasTimeStamp: boolean; tokenBytes?: Uint8Array } =
            signer._getSignatureTimeStampToken(signerInformation);
        // Assert
        expect(primitiveContextOne._isTagged()).toBeTruthy();
        expect(primitiveContextOne._getTagNumber()).toBe(1);
        expect(primitiveContextOne._isConstructed()).toBeFalsy();
        expect(result.hasTimeStamp).toBeFalsy();
    });
    it('skips an unsigned attribute with a different object identifier', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();
        const token: _PdfUniqueEncodingElement = createSequence([]);
        const attribute: _PdfUniqueEncodingElement = createSequence([
            createElement(_UniversalType.objectIdentifier,
                signer._encodeObjectIdentifier('1.2.840.113549.1.9.4')),
            createSet([token])
        ]);
        const signerInformation: _PdfAbstractSyntaxElement[] = [
            createSequence([]), createSequence([]), createSequence([]), createSequence([]),
            createSequence([]), createSequence([]), createContext(1, [attribute])
        ];
        // Act
        const result: { hasTimeStamp: boolean; tokenBytes?: Uint8Array } =
            signer._getSignatureTimeStampToken(signerInformation);
        // Assert
        expect(result.hasTimeStamp).toBeFalsy();
        expect(result.tokenBytes).toBeUndefined();
    });
    it('returns false with exact empty timestamp token bytes', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();
        const emptyToken: EmptyEncodedElement = new EmptyEncodedElement();
        emptyToken._tagClass = _TagClassType.universal;
        emptyToken._construction = _ConstructionType.primitive;
        emptyToken._setTagNumber(_UniversalType.octetString);
        emptyToken._setValue(new Uint8Array(0));
        const attribute: _PdfUniqueEncodingElement = createSequence([
            createElement(_UniversalType.objectIdentifier,
                signer._encodeObjectIdentifier('1.2.840.113549.1.9.16.2.14')),
            createSet([emptyToken])
        ]);
        const signerInformation: _PdfAbstractSyntaxElement[] = [
            createSequence([]), createSequence([]), createSequence([]), createSequence([]),
            createSequence([]), createSequence([]), createContext(1, [attribute])
        ];
        // Act
        const result: { hasTimeStamp: boolean; tokenBytes?: Uint8Array } =
            signer._getSignatureTimeStampToken(signerInformation);
        // Assert
        expect(result.hasTimeStamp).toBeFalsy();
        expect(result.tokenBytes).toEqual(new Uint8Array(0));
    });
    it('returns true with exact nonempty timestamp token bytes', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();
        const token: _PdfUniqueEncodingElement = createElement(
            _UniversalType.octetString, new Uint8Array([9])
        );
        const attribute: _PdfUniqueEncodingElement = createSequence([
            createElement(_UniversalType.objectIdentifier,
                signer._encodeObjectIdentifier('1.2.840.113549.1.9.16.2.14')),
            createSet([token])
        ]);
        const signerInformation: _PdfAbstractSyntaxElement[] = [
            createSequence([]), createSequence([]), createSequence([]), createSequence([]),
            createSequence([]), createSequence([]), createContext(1, [attribute])
        ];
        // Act
        const result: { hasTimeStamp: boolean; tokenBytes?: Uint8Array } =
            signer._getSignatureTimeStampToken(signerInformation);
        // Assert
        expect(result.hasTimeStamp).toBeTruthy();
        expect(result.tokenBytes).toEqual(new Uint8Array([0x04, 0x01, 0x09]));
    });
    it('returns set children without replacing them with sequence children', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();
        const first: _PdfUniqueEncodingElement = createElement(_UniversalType.integer, new Uint8Array([1]));
        const second: _PdfUniqueEncodingElement = createElement(_UniversalType.integer, new Uint8Array([2]));
        const set: _PdfUniqueEncodingElement = createSet([first, second]);
        // Act
        const children: _PdfAbstractSyntaxElement[] = signer._getChildrenWithFallback(set);
        // Assert
        expect(children.length).toBe(2);
        expect(children[0]._getInteger()).toBe(1);
        expect(children[1]._getInteger()).toBe(2);
    });
    it('returns sequence children when set children are unavailable', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();
        const integer: _PdfUniqueEncodingElement = createElement(_UniversalType.integer, new Uint8Array([3]));
        const sequence: _PdfUniqueEncodingElement = createSequence([integer]);
        // Act
        const children: _PdfAbstractSyntaxElement[] = signer._getChildrenWithFallback(sequence);
        // Assert
        expect(children.length).toBe(1);
        expect(children[0]._getInteger()).toBe(3);
    });
    it('requires both modulus and exponent for an RSA key', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();
        const completeKey: { modulus: Uint8Array; exponent: Uint8Array } = {
            modulus: new Uint8Array([1]), exponent: new Uint8Array([3])
        };
        const modulusOnly: { modulus: Uint8Array } = { modulus: new Uint8Array([1]) };
        const exponentOnly: { exponent: Uint8Array } = { exponent: new Uint8Array([3]) };
        // Act
        const completeResult: boolean = signer._isRsaKey(completeKey as any);
        const modulusResult: boolean = signer._isRsaKey(modulusOnly as any);
        const exponentResult: boolean = signer._isRsaKey(exponentOnly as any);
        // Assert
        expect(completeResult).toBeTruthy();
        expect(modulusResult).toBeFalsy();
        expect(exponentResult).toBeFalsy();
    });
    it('encodes base authenticated attributes with exact DER bytes', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();
        const digest: Uint8Array = new Uint8Array([1, 2, 3]);
        const expectedAttributes: Uint8Array[] = buildExpectedBaseAttributes(signer, digest);
        const expected: Uint8Array = encodeTlv(0x31, concatenate(expectedAttributes));
        // Act
        const result: Uint8Array = signer._getSequenceDataSet(digest);
        // Assert
        expect(result).toEqual(expected);
    });
    it('does not add signing-certificate-v2 outside CAdES', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();
        const certificate: _PdfX509Certificate = createCertificate();
        (signer as any)._signatureCertificate = certificate;
        (signer as any)._digestAlgorithmObjectIdentifier = '2.16.840.1.101.3.4.2.1';
        const digest: Uint8Array = new Uint8Array([4, 5, 6]);
        const expectedAttributes: Uint8Array[] = buildExpectedBaseAttributes(signer, digest);
        const expected: Uint8Array = encodeTlv(0x31, concatenate(expectedAttributes));
        // Act
        const result: Uint8Array = signer._getSequenceDataSet(digest, undefined, undefined,
            CryptographicStandard.cms);
        // Assert
        expect(result).toEqual(expected);
    });
    it('encodes exact SHA256 CAdES signing-certificate-v2 hierarchy', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();
        const certificate: _PdfX509Certificate = createCertificate();
        (signer as any)._signatureCertificate = certificate;
        (signer as any)._digestAlgorithmObjectIdentifier = '2.16.840.1.101.3.4.2.1';
        (signer as any)._hashAlgorithm = 'SHA256';
        const digest: Uint8Array = new Uint8Array([7, 8, 9]);
        const certificateHash: Uint8Array = signer._hashCertificate(certificate);
        const expectedAttributes: Uint8Array[] = buildExpectedBaseAttributes(signer, digest);
        expectedAttributes.push(buildExpectedSigningCertificateV2(
            signer, certificateHash, false, '2.16.840.1.101.3.4.2.1'
        ));
        const expected: Uint8Array = encodeTlv(0x31, concatenate(expectedAttributes));
        // Act
        const result: Uint8Array = signer._getSequenceDataSet(digest, undefined, undefined,
            CryptographicStandard.cades);
        // Assert
        expect(result).toEqual(expected);
    });
    it('encodes exact non-SHA256 CAdES algorithm and certificate hierarchy', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();
        const certificate: _PdfX509Certificate = createCertificate();
        (signer as any)._signatureCertificate = certificate;
        (signer as any)._digestAlgorithmObjectIdentifier = '2.16.840.1.101.3.4.2.2';
        (signer as any)._hashAlgorithm = 'SHA384';
        const digest: Uint8Array = new Uint8Array([10, 11, 12]);
        const certificateHash: Uint8Array = signer._hashCertificate(certificate);
        const expectedAttributes: Uint8Array[] = buildExpectedBaseAttributes(signer, digest);
        expectedAttributes.push(buildExpectedSigningCertificateV2(
            signer, certificateHash, true, '2.16.840.1.101.3.4.2.2'
        ));
        const expected: Uint8Array = encodeTlv(0x31, concatenate(expectedAttributes));
        // Act
        const result: Uint8Array = signer._getSequenceDataSet(digest, undefined, undefined,
            CryptographicStandard.cades);
        // Assert
        expect(result).toEqual(expected);
    });
    it('encodes object identifier boundary values 127 and 128 differently', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();
        // Act
        const belowBoundary: Uint8Array = signer._encodeObjectIdentifier('1.2.127');
        const boundary: Uint8Array = signer._encodeObjectIdentifier('1.2.128');
        // Assert
        expect(belowBoundary).toEqual(new Uint8Array([42, 127]));
        expect(boundary).toEqual(new Uint8Array([42, 129, 0]));
    });
    it('encodes a sequence from an initially empty content array', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();
        const first: _PdfUniqueEncodingElement = createElement(
            _UniversalType.integer, new Uint8Array([1])
        );
        const second: _PdfUniqueEncodingElement = createElement(
            _UniversalType.octetString, new Uint8Array([2, 3])
        );
        // Act
        const result: Uint8Array = signer._encodeSequence([first, second]);
        // Assert
        expect(result).toEqual(new Uint8Array([0x02, 0x01, 0x01, 0x04, 0x02, 0x02, 0x03]));
    });
});
describe('_PdfCryptographicMessageSyntaxSigner encoding mutation coverage', () => {
    function createSigner(): _PdfCryptographicMessageSyntaxSigner {
        return new _PdfCryptographicMessageSyntaxSigner(
            new Uint8Array(0),
            'adbe.pkcs7.detached'
        );
    }
    function createElement(
        tag: number,
        value: Uint8Array,
        construction: _ConstructionType,
        tagClass: _TagClassType
    ): _PdfUniqueEncodingElement {
        const element: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
        element._tagClass = tagClass;
        element._construction = construction;
        element._setTagNumber(tag);
        element._setValue(value);
        return element;
    }
    it('encodes a constructed universal element with the constructed tag bit', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();
        const element: _PdfUniqueEncodingElement = createElement(
            _UniversalType.sequence,
            new Uint8Array([1, 2]),
            _ConstructionType.constructed,
            _TagClassType.universal
        );
        // Act
        const result: Uint8Array = signer._encodeToUniqueElement(element);
        // Assert
        expect(result).toEqual(new Uint8Array([0x30, 0x02, 0x01, 0x02]));
        expect(result[0]).toBe(0x30);
    });
    it('encodes a primitive context element with only the context tag bit', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();
        const element: _PdfUniqueEncodingElement = createElement(
            1,
            new Uint8Array([7]),
            _ConstructionType.primitive,
            _TagClassType.context
        );
        // Act
        const result: Uint8Array = signer._encodeToUniqueElement(element);
        // Assert
        expect(result).toEqual(new Uint8Array([0x81, 0x01, 0x07]));
        expect(result[0]).toBe(0x81);
    });
    it('uses long-form length encoding for exactly 128 content bytes', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();
        const value: Uint8Array = new Uint8Array(128);
        value[0] = 11;
        value[127] = 22;
        const element: _PdfUniqueEncodingElement = createElement(
            _UniversalType.octetString,
            value,
            _ConstructionType.primitive,
            _TagClassType.universal
        );
        // Act
        const result: Uint8Array = signer._encodeToUniqueElement(element);
        // Assert
        expect(result.length).toBe(131);
        expect(result[0]).toBe(0x04);
        expect(result[1]).toBe(0x81);
        expect(result[2]).toBe(0x80);
        expect(result[3]).toBe(11);
        expect(result[130]).toBe(22);
    });
    it('encodes an empty value without adding content bytes', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();
        const element: _PdfUniqueEncodingElement = createElement(
            _UniversalType.octetString,
            new Uint8Array(0),
            _ConstructionType.primitive,
            _TagClassType.universal
        );
        // Act
        const result: Uint8Array = signer._encodeToUniqueElement(element);
        // Assert
        expect(result).toEqual(new Uint8Array([0x04, 0x00]));
        expect(result.length).toBe(2);
    });
    it('sets signed data without changing the encryption OID when algorithm is empty', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();
        const digest: Uint8Array = new Uint8Array([1, 2, 3]);
        const rsaData: Uint8Array = new Uint8Array([4, 5, 6]);
        (signer as any)._encryptionAlgorithmObjectIdentifier = 'existing-oid';
        // Act
        signer._setSignedData(digest, rsaData, '');
        // Assert
        expect(signer._signedData).toBe(digest);
        expect((signer as any)._signedRsaData).toBe(rsaData);
        expect((signer as any)._encryptionAlgorithmObjectIdentifier).toBe('existing-oid');
    });
    it('sets the RSA encryption OID when RSA is selected', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();
        const digest: Uint8Array = new Uint8Array([7]);
        const rsaData: Uint8Array = new Uint8Array([8]);
        // Act
        signer._setSignedData(digest, rsaData, 'RSA');
        // Assert
        expect(signer._signedData).toBe(digest);
        expect((signer as any)._signedRsaData).toBe(rsaData);
        expect((signer as any)._encryptionAlgorithmObjectIdentifier)
            .toBe('1.2.840.113549.1.1.1');
    });
    it('uses long-form certificate length for exactly 128 bytes', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();
        const certificate: Uint8Array = new Uint8Array(128);
        certificate[0] = 31;
        certificate[127] = 63;
        // Act
        const result: Uint8Array = signer._encodeCertificateSet([certificate]);
        // Assert
        expect(result.length).toBe(131);
        expect(result[0]).toBe(0xa0);
        expect(result[1]).toBe(0x81);
        expect(result[2]).toBe(0x80);
        expect(result[3]).toBe(31);
        expect(result[130]).toBe(63);
    });
    it('uses two-byte long-form certificate length for exactly 256 bytes', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();
        const firstCertificate: Uint8Array = new Uint8Array(128);
        const secondCertificate: Uint8Array = new Uint8Array(128);
        firstCertificate[0] = 15;
        secondCertificate[127] = 47;
        // Act
        const result: Uint8Array = signer._encodeCertificateSet([
            firstCertificate,
            secondCertificate
        ]);
        // Assert
        expect(result.length).toBe(260);
        expect(result[0]).toBe(0xa0);
        expect(result[1]).toBe(0x82);
        expect(result[2]).toBe(0x01);
        expect(result[3]).toBe(0x00);
        expect(result[4]).toBe(15);
        expect(result[259]).toBe(47);
    });
    it('creates context constructed content from an element array', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();
        const child: _PdfUniqueEncodingElement = createElement(
            _UniversalType.integer,
            new Uint8Array([5]),
            _ConstructionType.primitive,
            _TagClassType.universal
        );
        // Act
        const result: _PdfUniqueEncodingElement =
            signer._createContextConstructed(2, [child]);
        const encoded: Uint8Array = result._toBytes();
        // Assert
        expect(result._tagClass).toBe(_TagClassType.context);
        expect(result._construction).toBe(_ConstructionType.constructed);
        expect(result._getTagNumber()).toBe(2);
        expect(encoded).toEqual(new Uint8Array([0xa2, 0x03, 0x02, 0x01, 0x05]));
    });
    it('creates context constructed content from raw bytes', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();
        const value: Uint8Array = new Uint8Array([0x02, 0x01, 0x06]);
        // Act
        const result: _PdfUniqueEncodingElement =
            signer._createContextConstructed(3, value);
        const encoded: Uint8Array = result._toBytes();
        // Assert
        expect(result._tagClass).toBe(_TagClassType.context);
        expect(result._construction).toBe(_ConstructionType.constructed);
        expect(result._getTagNumber()).toBe(3);
        expect(result._getValue()).toEqual(value);
        expect(encoded).toEqual(new Uint8Array([0xa3, 0x03, 0x02, 0x01, 0x06]));
    });
});
function createSigningSigner(certificate: _PdfX509Certificate): _PdfCryptographicMessageSyntaxSigner {
    const signer: _PdfCryptographicMessageSyntaxSigner = new _PdfCryptographicMessageSyntaxSigner(
        { modulus: new Uint8Array([1]), exponent: new Uint8Array([1, 0, 1]) } as any,
        [certificate],
        'SHA256',
        true
    );
    return signer;
}
function parseRoot(bytes: Uint8Array): _PdfAbstractSyntaxElement[] {
    const root: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();
    root._fromBytes(bytes);
    return root._getSequence();
}
function findBytes(source: Uint8Array, expected: Uint8Array): boolean {
    if (expected.length === 0 || source.length < expected.length) {
        return false;
    }
    for (let i: number = 0; i <= source.length - expected.length; i++) {
        let matches: boolean = true;
        for (let j: number = 0; j < expected.length; j++) {
            if (source[i + j] !== expected[j]) {
                matches = false;
                break;
            }
        }
        if (matches) {
            return true;
        }
    }
    return false;
}
function getSignedDataChildren(bytes: Uint8Array): _PdfAbstractSyntaxElement[] {
    const root: _PdfAbstractSyntaxElement[] = parseRoot(bytes);
    const contextChildren: _PdfAbstractSyntaxElement[] = root[1]._getComponents();
    return contextChildren[0]._getSequence();
}
function getSignerInformation(bytes: Uint8Array): _PdfAbstractSyntaxElement[] {
    const signedData: _PdfAbstractSyntaxElement[] = getSignedDataChildren(bytes);
    const signerInfoSet: _PdfAbstractSyntaxElement = signedData[signedData.length - 1];
    const signerInfoElements: _PdfAbstractSyntaxElement[] = signerInfoSet._getAbstractSetOf();
    return signerInfoElements[0]._getSequence();
}
describe('_PdfCryptographicMessageSyntaxSigner lines 537 to 611 mutation coverage', () => {
    function decodeBase64(value: string): Uint8Array {
        const decoded: string = atob(value);
        const bytes: Uint8Array = new Uint8Array(decoded.length);
        for (let i: number = 0; i < decoded.length; i++) {
            bytes[i] = decoded.charCodeAt(i);
        }
        return bytes;
    }
    function createCertificate(): _PdfX509Certificate {
        const bytes: Uint8Array = decodeBase64('MIICCjCCAXOgAwIBAgIUCiyxb/5dc03SsLbKIof9msLkyLMwDQYJKoZIhvcNAQELBQAwFzEVMBMGA1UEAwwMTXV0YXRpb25UZXN0MB4XDTI2MDgxODA4MjcyNFoXDTI2MDgxOTA4MjcyNFowFzEVMBMGA1UEAwwMTXV0YXRpb25UZXN0MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC9AE8ct12ugorsmxvETi8srxoTEcsRl5uEwKdbTYD8W6KUSsc66yGmiBj7R92ND7E6Mz3ij+jkRGN90QjnKjN4uim7GYOgcNxxFJDCuXIvtxC5qgwc2H12YAPW/geXNZVcpEMsm4jGxTwI7Pj50qfuZ4bJ9NTTm2ZXVVdYbFpf8QIDAQABo1MwUTAdBgNVHQ4EFgQU/jpDsgtbGWDz+VNUOI8Rw2PM9L8wHwYDVR0jBBgwFoAU/jpDsgtbGWDz+VNUOI8Rw2PM9L8wDwYDVR0TAQH/BAUwAwEB/zANBgkqhkiG9w0BAQsFAAOBgQBd5/u13DJ5sKYkZERZbB6l3OW1y6v4YSeJGQMa77yU/pKd0kkEwy0/EKWHxWLVocGJjLlAQjWbmDrSR6eA+7J7JeDA45As+1aK2/uvxTqd2/5y8w/cW6MB2ALHY3kGsSoru0Pje6ag1kYbLYfD2ebWLk9XLt7npTfjvzSuQlkSUg==');
        const parser: _PdfX509CertificateParser = new _PdfX509CertificateParser();
        return parser._readCertificateFromStream(bytes, true);
    }
    it('uses precomputed digest and RSA content in the signed CMS output', () => {
        // Arrange
        const certificate: _PdfX509Certificate = createCertificate();
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigningSigner(certificate);
        const digest: Uint8Array = new Uint8Array([21, 22, 23, 24]);
        const rsaData: Uint8Array = new Uint8Array([31, 32, 33]);
        signer._setSignedData(digest, rsaData, 'RSA');
        // Act
        const result: Uint8Array = signer._sign(new Uint8Array([41, 42]));
        const signerInformation: _PdfAbstractSyntaxElement[] = getSignerInformation(result);
        // Assert
        expect(findBytes(result, rsaData)).toBeTruthy();
        expect(signerInformation.length).toBe(6);
        expect(signerInformation[5]._getValue()).toEqual(digest);
    });
    it('does not add encapsulated RSA content when RSA data is empty', () => {
        // Arrange
        const certificate: _PdfX509Certificate = createCertificate();
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigningSigner(certificate);
        const digest: Uint8Array = new Uint8Array([51, 52, 53]);
        signer._setSignedData(digest, new Uint8Array(0), 'RSA');
        // Act
        const result: Uint8Array = signer._sign(new Uint8Array([61, 62]));
        const signedData: _PdfAbstractSyntaxElement[] = getSignedDataChildren(result);
        const contentInfo: _PdfAbstractSyntaxElement[] = signedData[2]._getSequence();
        // Assert
        expect(contentInfo.length).toBe(1);
        expect(contentInfo[0]._getObjectIdentifier().toString()).toBe('1.2.840.113549.1.7.1');
    });
    it('serializes the configured certificate exactly once', () => {
        // Arrange
        const certificate: _PdfX509Certificate = createCertificate();
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigningSigner(certificate);
        signer._setSignedData(new Uint8Array([71]), new Uint8Array(0), 'RSA');
        // Act
        const result: Uint8Array = signer._sign(new Uint8Array([72]));
        const signedData: _PdfAbstractSyntaxElement[] = getSignedDataChildren(result);
        const certificates: _PdfAbstractSyntaxElement[] = signedData[3]._getAbstractSetOf();
        // Assert
        expect(certificates.length).toBe(1);
        expect(certificates[0]._toBytes()).toEqual(certificate._getEncoded());
    });
    it('omits signed attributes when second digest is undefined', () => {
        // Arrange
        const certificate: _PdfX509Certificate = createCertificate();
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigningSigner(certificate);
        const digest: Uint8Array = new Uint8Array([81, 82]);
        signer._setSignedData(digest, new Uint8Array(0), 'RSA');
        // Act
        const result: Uint8Array = signer._sign(undefined);
        const signerInformation: _PdfAbstractSyntaxElement[] = getSignerInformation(result);
        // Assert
        expect(signerInformation.length).toBe(5);
        expect(signerInformation[3]._getSequence()[0]._getObjectIdentifier().toString())
            .toBe('1.2.840.113549.1.1.1');
        expect(signerInformation[4]._getValue()).toEqual(digest);
    });
    it('adds signed attributes when second digest is provided', () => {
        // Arrange
        const certificate: _PdfX509Certificate = createCertificate();
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigningSigner(certificate);
        const digest: Uint8Array = new Uint8Array([91, 92]);
        const secondDigest: Uint8Array = new Uint8Array([93, 94, 95]);
        signer._setSignedData(digest, new Uint8Array(0), 'RSA');
        // Act
        const result: Uint8Array = signer._sign(secondDigest);
        const signerInformation: _PdfAbstractSyntaxElement[] = getSignerInformation(result);
        // Assert
        expect(signerInformation.length).toBe(6);
        expect(signerInformation[3]._isTagged()).toBeTruthy();
        expect(signerInformation[3]._getTagNumber()).toBe(0);
        expect(findBytes(signerInformation[3]._toBytes(), secondDigest)).toBeTruthy();
    });
    it('writes issuer and certificate serial number into signer information', () => {
        // Arrange
        const certificate: _PdfX509Certificate = createCertificate();
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigningSigner(certificate);
        signer._setSignedData(new Uint8Array([101]), new Uint8Array(0), 'RSA');
        const expectedSerial: Uint8Array = certificate._structure._getSignedCertificate()._serialNumber;
        // Act
        const result: Uint8Array = signer._sign(new Uint8Array([102]));
        const signerInformation: _PdfAbstractSyntaxElement[] = getSignerInformation(result);
        const issuerAndSerial: _PdfAbstractSyntaxElement[] = signerInformation[1]._getSequence();
        // Assert
        expect(issuerAndSerial.length).toBe(2);
        expect(issuerAndSerial[1]._getValue()).toEqual(expectedSerial);
    });
    it('builds signed data body with certificates', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = new _PdfCryptographicMessageSyntaxSigner(
            new Uint8Array(0), 'adbe.pkcs7.detached'
        );
        const digestAlgorithm: _PdfUniqueEncodingElement = signer._createAsn1Constructed(
            _UniversalType.sequence,
            [signer._createPrimitive(_UniversalType.integer, new Uint8Array([1]))]
        );
        const contentInfo: _PdfUniqueEncodingElement = signer._createAsn1Constructed(
            _UniversalType.sequence,
            [signer._createPrimitive(_UniversalType.integer, new Uint8Array([2]))]
        );
        const certificateElement: _PdfUniqueEncodingElement = signer._createAsn1Constructed(
            _UniversalType.sequence,
            [signer._createPrimitive(_UniversalType.integer, new Uint8Array([3]))]
        );
        const signerInfo: _PdfUniqueEncodingElement = signer._createAsn1Constructed(
            _UniversalType.sequence,
            [signer._createPrimitive(_UniversalType.integer, new Uint8Array([4]))]
        );
        // Act
        const result: _PdfUniqueEncodingElement[] = signer._buildSignedDataBodyElements(
            1, [digestAlgorithm], contentInfo, [certificateElement], signerInfo
        );
        // Assert
        expect(result.length).toBe(5);
        expect(result[0]._getInteger()).toBe(1);
        expect(result[3]._tagClass).toBe(_TagClassType.context);
        expect(result[3]._getTagNumber()).toBe(0);
        expect(result[3]._getAbstractSetOf().length).toBe(1);
        expect(result[4]._getAbstractSetOf()[0]).toBe(signerInfo);
    });
    it('builds signed data body without certificates', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = new _PdfCryptographicMessageSyntaxSigner(
            new Uint8Array(0), 'adbe.pkcs7.detached'
        );
        const digestAlgorithm: _PdfUniqueEncodingElement = signer._createAsn1Constructed(
            _UniversalType.sequence,
            [signer._createPrimitive(_UniversalType.integer, new Uint8Array([1]))]
        );
        const contentInfo: _PdfUniqueEncodingElement = signer._createAsn1Constructed(
            _UniversalType.sequence,
            [signer._createPrimitive(_UniversalType.integer, new Uint8Array([2]))]
        );
        const signerInfo: _PdfUniqueEncodingElement = signer._createAsn1Constructed(
            _UniversalType.sequence,
            [signer._createPrimitive(_UniversalType.integer, new Uint8Array([4]))]
        );
        // Act
        const result: _PdfUniqueEncodingElement[] = signer._buildSignedDataBodyElements(
            1, [digestAlgorithm], contentInfo, [], signerInfo
        );
        // Assert
        expect(result.length).toBe(4);
        expect(result[2]).toBe(contentInfo);
        expect(result[3]._tagClass).toBe(_TagClassType.universal);
        expect(result[3]._getTagNumber()).toBe(_UniversalType.abstractSyntaxSet);
        expect(result[3]._getAbstractSetOf()[0]).toBe(signerInfo);
    });
});
function parseSequence(bytes: Uint8Array): _PdfAbstractSyntaxElement[] {
    const element: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();
    element._fromBytes(bytes);
    return element._getSequence();
}
function createSequenceValue(value: number): _PdfUniqueEncodingElement {
    const child: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
    child._tagClass = _TagClassType.universal;
    child._construction = _ConstructionType.primitive;
    child._setTagNumber(_UniversalType.integer);
    child._setValue(new Uint8Array([value]));
    const sequence: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
    sequence._tagClass = _TagClassType.universal;
    sequence._construction = _ConstructionType.constructed;
    sequence._setTagNumber(_UniversalType.sequence);
    sequence._setSequence([child]);
    return sequence;
}
describe('_PdfCryptographicMessageSyntaxSigner lines 612 to 937 mutation coverage', () => {
    function createSigner(): _PdfCryptographicMessageSyntaxSigner {
        return new _PdfCryptographicMessageSyntaxSigner(new Uint8Array(0), 'adbe.pkcs7.detached');
    }
    function decodeBase64(value: string): Uint8Array {
        const text: string = atob(value);
        const bytes: Uint8Array = new Uint8Array(text.length);
        for (let i: number = 0; i < text.length; i++) {
            bytes[i] = text.charCodeAt(i);
        }
        return bytes;
    }
    function createCertificate(): _PdfX509Certificate {
        const parser: _PdfX509CertificateParser = new _PdfX509CertificateParser();
        return parser._readCertificateFromStream(decodeBase64('MIICDDCCAXWgAwIBAgIUG6kTTZ9oC74V15y18zQA7u8UJj0wDQYJKoZIhvcNAQELBQAwGDEWMBQGA1UEAwwNTXV0YXRpb25SYW5nZTAeFw0yNjA4MTgwOTM3NTJaFw0yNjA4MTkwOTM3NTJaMBgxFjAUBgNVBAMMDU11dGF0aW9uUmFuZ2UwgZ8wDQYJKoZIhvcNAQEBBQADgY0AMIGJAoGBANIBplfNiNFDG+S7cc6RMt54p50WIhCkZ3fLGttfGRN/eUcZ3WNsbg7NFKUJQU+gSXI9hMKmdQaDXj6A31s2cgxz/qvLL6LqV44SjnR4KeAjlSJV7EaAIWuuIg8MiKwPwyto2x0JNU3/+w8eROjd7jD+2u3G08/G5B8548fCkIGBAgMBAAGjUzBRMB0GA1UdDgQWBBRB0ui0Fb4FN68t5+3dq/hunA/TOjAfBgNVHSMEGDAWgBRB0ui0Fb4FN68t5+3dq/hunA/TOjAPBgNVHRMBAf8EBTADAQH/MA0GCSqGSIb3DQEBCwUAA4GBABEMj36Qwjt8vvbA/WEjNcdGv0y7gi2oEsqGjENWp/Rc/giE+4elnRkaZQm/v7yiHjAyC+QhmWmv4A/A6LcBtuXf2Is+SKTXUwfASD8TSIfh4tGKpr1Qsg0NX73hkuWZju4UYleig3V2pYuYDU4SGRChLgeDGrLPRQRKcHLBJkPP'), true);
    }
    function createSigningSigner(certificate: _PdfX509Certificate): _PdfCryptographicMessageSyntaxSigner {
        return new _PdfCryptographicMessageSyntaxSigner(
            { modulus: new Uint8Array([1]), exponent: new Uint8Array([1, 0, 1]) } as any,
            [certificate], 'SHA256', true
        );
    }
    it('builds exact body ordering with and without certificates', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();
        const digest: _PdfUniqueEncodingElement = createSequenceValue(1);
        const content: _PdfUniqueEncodingElement = createSequenceValue(2);
        const certificate: _PdfUniqueEncodingElement = createSequenceValue(3);
        const signerInformation: _PdfUniqueEncodingElement = createSequenceValue(4);
        // Act
        const withCertificate: _PdfUniqueEncodingElement[] = signer._buildSignedDataBodyElements(
            1, [digest], content, [certificate], signerInformation
        );
        const withoutCertificate: _PdfUniqueEncodingElement[] = signer._buildSignedDataBodyElements(
            1, [digest], content, [], signerInformation
        );
        // Assert
        expect(withCertificate.length).toBe(5);
        expect(withCertificate[0]._getInteger()).toBe(1);
        expect(withCertificate[1]._getAbstractSetOf()).toEqual([digest]);
        expect(withCertificate[2]).toBe(content);
        expect(withCertificate[3]._tagClass).toBe(_TagClassType.context);
        expect(withCertificate[3]._getAbstractSetOf()).toEqual([certificate]);
        expect(withCertificate[4]._getAbstractSetOf()).toEqual([signerInformation]);
        expect(withoutCertificate.length).toBe(4);
        expect(withoutCertificate[3]._getAbstractSetOf()).toEqual([signerInformation]);
    });
    it('concatenates element and byte inputs with exact short length', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();
        const element: _PdfUniqueEncodingElement = createSequenceValue(5);
        const raw: Uint8Array = new Uint8Array([6, 7]);
        // Act
        const result: Uint8Array = signer._concatAbstractSyntaxSequence([element, raw]);
        // Assert
        expect(result).toEqual(new Uint8Array([0x30, 0x07, 0x30, 0x03, 0x02, 0x01, 0x05, 0x06, 0x07]));
    });
    it('uses two-byte long-form sequence length at exactly 256 bytes', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();
        const first: Uint8Array = new Uint8Array(128);
        const second: Uint8Array = new Uint8Array(128);
        first[0] = 11;
        second[127] = 22;
        // Act
        const result: Uint8Array = signer._concatAbstractSyntaxSequence([first, second]);
        // Assert
        expect(result.length).toBe(260);
        expect(result[0]).toBe(0x30);
        expect(result[1]).toBe(0x82);
        expect(result[2]).toBe(0x01);
        expect(result[3]).toBe(0x00);
        expect(result[4]).toBe(11);
        expect(result[259]).toBe(22);
    });
    it('extracts the issuer at the exact TBS sequence index', () => {
        // Arrange
        const certificate: _PdfX509Certificate = createCertificate();
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();
        const tbsBytes: Uint8Array = certificate._getTobeSignedCertificate();
        const tbs: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
        tbs._fromBytes(tbsBytes);
        const expectedIssuer: _PdfAbstractSyntaxElement = tbs._getSequence()[3];
        // Act
        const issuer: _PdfUniqueEncodingElement = signer._getIssuer(tbsBytes);
        // Assert
        expect(issuer._toBytes()).toEqual(expectedIssuer._toBytes());
    });
    it('encodes exact timestamp attribute OID and token value', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();
        const token: Uint8Array = new Uint8Array([0x30, 0x03, 0x02, 0x01, 0x01]);
        // Act
        const result: Uint8Array = signer._getTimestampAttributes(token);
        const outerSet: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();
        outerSet._fromBytes(result);
        const attribute: _PdfAbstractSyntaxElement = outerSet._getAbstractSetOf()[0];
        const children: _PdfAbstractSyntaxElement[] = attribute._getSequence();
        // Assert
        expect(children.length).toBe(2);
        expect(children[0]._getObjectIdentifier().toString()).toBe('1.2.840.113549.1.9.16.2.14');
        expect(children[1]._getValue()).toEqual(token);
    });
    it('maps every requested digest name and the default exactly', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();
        // Act
        const sha1: { oid: string; name: string } = signer._getObjectIdentifierName('sha1');
        const sha256: { oid: string; name: string } = signer._getObjectIdentifierName('SHA256');
        const sha384: { oid: string; name: string } = signer._getObjectIdentifierName('SHA384');
        const sha512: { oid: string; name: string } = signer._getObjectIdentifierName('SHA512');
        const fallback: { oid: string; name: string } = signer._getObjectIdentifierName('MD5');
        // Assert
        expect(sha1).toEqual({ oid: '1.3.14.3.2.26', name: 'SHA1' });
        expect(sha256).toEqual({ oid: '2.16.840.1.101.3.4.2.1', name: 'SHA256' });
        expect(sha384).toEqual({ oid: '2.16.840.1.101.3.4.2.2', name: 'SHA384' });
        expect(sha512).toEqual({ oid: '2.16.840.1.101.3.4.2.3', name: 'SHA512' });
        expect(fallback).toEqual({ oid: '2.16.840.1.101.3.4.2.1', name: 'SHA256' });
    });
    it('creates an exact timestamp request for SHA256', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();
        const hash: Uint8Array = new Uint8Array([1, 2, 3, 4]);
        // Act
        const result: Uint8Array = signer._createTimestampRequestWithAlgorithm(
            hash, '2.16.840.1.101.3.4.2.1'
        );
        const request: _PdfAbstractSyntaxElement[] = parseSequence(result);
        const imprint: _PdfAbstractSyntaxElement[] = request[1]._getSequence();
        const algorithm: _PdfAbstractSyntaxElement[] = imprint[0]._getSequence();
        // Assert
        expect(request.length).toBe(4);
        expect(request[0]._getInteger()).toBe(1);
        expect(algorithm[0]._getObjectIdentifier().toString()).toBe('2.16.840.1.101.3.4.2.1');
        expect(imprint[1]._getValue()).toEqual(hash);
        expect(request[2]._getInteger()).toBe(100);
        expect(request[3]._getValue()).toEqual(new Uint8Array([0xff]));
    });
    it('returns the original timestamp response for an incomplete top sequence', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();
        const response: Uint8Array = new Uint8Array([0x30, 0x03, 0x02, 0x01, 0x00]);
        // Act
        const result: Uint8Array = signer._reEncodeTimestampResponse(response);
        // Assert
        expect(result).toBe(response);
        expect(result).toEqual(new Uint8Array([0x30, 0x03, 0x02, 0x01, 0x00]));
    });
    it('re-encodes the timestamp token inner sequence exactly', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();
        const status: _PdfUniqueEncodingElement = createSequenceValue(1);
        const token: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
        token._tagClass = _TagClassType.universal;
        token._construction = _ConstructionType.constructed;
        token._setTagNumber(_UniversalType.sequence);
        token._setSequence([createSequenceValue(2), createSequenceValue(3)]);
        const response: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
        response._tagClass = _TagClassType.universal;
        response._construction = _ConstructionType.constructed;
        response._setTagNumber(_UniversalType.sequence);
        response._setSequence([status, token]);
        // Act
        const result: Uint8Array = signer._reEncodeTimestampResponse(response._toBytes());
        // Assert
        expect(result).toEqual(token._toBytes());
        expect(parseSequence(result).length).toBe(2);
    });
    it('encodes timestamp sequence short and long length boundaries', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();
        const shortElement: _PdfUniqueEncodingElement = signer._createPrimitive(
            _UniversalType.octetString, new Uint8Array(125)
        );
        const boundaryElement: _PdfUniqueEncodingElement = signer._createPrimitive(
            _UniversalType.octetString, new Uint8Array(126)
        );
        // Act
        const shortResult: Uint8Array = signer._encodeTimeStampSequence([shortElement]);
        const boundaryResult: Uint8Array = signer._encodeTimeStampSequence([boundaryElement]);
        // Assert
        expect(shortResult[0]).toBe(0x30);
        expect(shortResult[1]).toBe(0x7f);
        expect(boundaryResult[0]).toBe(0x30);
        expect(boundaryResult[1]).toBe(0x81);
        expect(boundaryResult[2]).toBe(0x80);
    });
    it('encodes sequence lengths at zero 127 128 and 256', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();
        // Act
        const zero: Uint8Array = signer._encodeSequenceLength(0);
        const short: Uint8Array = signer._encodeSequenceLength(127);
        const boundary: Uint8Array = signer._encodeSequenceLength(128);
        const twoByte: Uint8Array = signer._encodeSequenceLength(256);
        // Assert
        expect(zero).toEqual(new Uint8Array([0x00]));
        expect(short).toEqual(new Uint8Array([0x7f]));
        expect(boundary).toEqual(new Uint8Array([0x81, 0x80]));
        expect(twoByte).toEqual(new Uint8Array([0x82, 0x01, 0x00]));
    });
    it('builds an unsigned timestamp attribute with the exact token', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();
        const token: _PdfUniqueEncodingElement = createSequenceValue(9);
        // Act
        const attribute: _PdfUniqueEncodingElement = signer._buildTimestampUnsignedAttribute(token._toBytes());
        const children: _PdfAbstractSyntaxElement[] = attribute._getSequence();
        const values: _PdfAbstractSyntaxElement[] = children[1]._getAbstractSetOf();
        // Assert
        expect(children.length).toBe(2);
        expect(children[0]._getObjectIdentifier().toString()).toBe('1.2.840.113549.1.9.16.2.14');
        expect(values.length).toBe(1);
        expect(values[0]._toBytes()).toEqual(token._toBytes());
    });
    it('creates an implicit context element with the requested tag and value', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();
        const value: Uint8Array = new Uint8Array([0x31, 0x03, 0x02, 0x01, 0x07]);
        // Act
        const result: _PdfUniqueEncodingElement = signer._createContextImplicitFromTimestampValue(1, value);
        // Assert
        expect(result._tagClass).toBe(_TagClassType.context);
        expect(result._getTagNumber()).toBe(1);
        expect(result._getValue()).toEqual(new Uint8Array([0x02, 0x01, 0x07]));
    });
    it('adds a supplied timestamp response in asynchronous signing', async () => {
        // Arrange
        const certificate: _PdfX509Certificate = createCertificate();
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigningSigner(certificate);
        signer._setSignedData(new Uint8Array([10, 11]), new Uint8Array(0), 'RSA');
        const timestampToken: _PdfUniqueEncodingElement = createSequenceValue(12);
        const signature: PdfSignature = {
            _timestampCallback: async (_request: Uint8Array): Promise<{ data: Uint8Array }> => {
                return { data: new Uint8Array(0) };
            }
        } as PdfSignature;
        // Act
        const result: Uint8Array = await signer._signAsync(
            new Uint8Array([13]), signature, timestampToken._toBytes()
        );
        // Assert
        expect(result.length).toBeGreaterThan(0);
        expect(signer._hasTimeStamp).toBeTruthy();
    });
    it('does not add a timestamp when callback returns empty data', async () => {
        // Arrange
        const certificate: _PdfX509Certificate = createCertificate();
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigningSigner(certificate);
        signer._setSignedData(new Uint8Array([20, 21]), new Uint8Array(0), 'RSA');
        let callbackCount: number = 0;
        const signature: PdfSignature = {
            _timestampCallback: async (request: Uint8Array): Promise<{ data: Uint8Array }> => {
                callbackCount++;
                expect(request.length).toBeGreaterThan(0);
                return { data: new Uint8Array(0) };
            }
        } as PdfSignature;
        // Act
        const result: Uint8Array = await signer._signAsync(new Uint8Array([22]), signature);
        // Assert
        expect(result.length).toBeGreaterThan(0);
        expect(callbackCount).toBe(1);
        expect(signer._hasTimeStamp).toBeFalsy();
    });
});


function createInteger(value: number): _PdfUniqueEncodingElement {
    const element: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
    element._tagClass = _TagClassType.universal;
    element._construction = _ConstructionType.primitive;
    element._setTagNumber(_UniversalType.integer);
    element._setValue(new Uint8Array([value]));
    return element;
}

function createImplicitContent(value: Uint8Array): _PdfUniqueEncodingElement {
    const element: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
    element._tagClass = _TagClassType.context;
    element._construction = _ConstructionType.constructed;
    element._setTagNumber(0);
    element._setValue(value);
    return element;
}

describe('_PdfCryptographicMessageSyntaxSigner lines 937 to 955 mutation coverage', () => {
    
function createSequence(elements: _PdfUniqueEncodingElement[]): _PdfUniqueEncodingElement {
    const element: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
    element._tagClass = _TagClassType.universal;
    element._construction = _ConstructionType.constructed;
    element._setTagNumber(_UniversalType.sequence);
    element._setSequence(elements);
    return element;
}
function createSigner(): _PdfCryptographicMessageSyntaxSigner {
    return new _PdfCryptographicMessageSyntaxSigner(
        new Uint8Array(0),
        'adbe.pkcs7.detached'
    );
}
function createSet(elements: _PdfUniqueEncodingElement[]): _PdfUniqueEncodingElement {
    const element: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
    element._tagClass = _TagClassType.universal;
    element._construction = _ConstructionType.constructed;
    element._setTagNumber(_UniversalType.abstractSyntaxSet);
    element._setAbstractSetValue(elements);
    return element;
}


    it('returns an empty child collection for empty content octets', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();
        const implicitElement: _PdfUniqueEncodingElement = createImplicitContent(
            new Uint8Array(0)
        );

        // Act
        const children: _PdfAbstractSyntaxElement[] =
            signer._decodeChildrenFromContentOctets(implicitElement);

        // Assert
        expect(children).toEqual([]);
        expect(children.length).toBe(0);
    });

    it('decodes every content-octet child and stops at the exact boundary', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();
        const first: _PdfUniqueEncodingElement = createInteger(1);
        const second: _PdfUniqueEncodingElement = createInteger(2);
        const firstBytes: Uint8Array = first._toBytes();
        const secondBytes: Uint8Array = second._toBytes();
        const value: Uint8Array = new Uint8Array(firstBytes.length + secondBytes.length);
        value.set(firstBytes, 0);
        value.set(secondBytes, firstBytes.length);
        const implicitElement: _PdfUniqueEncodingElement = createImplicitContent(value);

        // Act
        const children: _PdfAbstractSyntaxElement[] =
            signer._decodeChildrenFromContentOctets(implicitElement);

        // Assert
        expect(children.length).toBe(2);
        expect(children[0]._getInteger()).toBe(1);
        expect(children[1]._getInteger()).toBe(2);
    });

    it('returns existing set children without replacing the collection', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();
        const first: _PdfUniqueEncodingElement = createInteger(3);
        const second: _PdfUniqueEncodingElement = createInteger(4);
        const setElement: _PdfUniqueEncodingElement = createSet([first, second]);

        // Act
        const children: _PdfAbstractSyntaxElement[] =
            signer._getChildrenWithFallback(setElement);

        // Assert
        expect(children.length).toBe(2);
        expect(children[0]).toBe(first);
        expect(children[1]).toBe(second);
        expect(children[0]._getInteger()).toBe(3);
        expect(children[1]._getInteger()).toBe(4);
    });

    it('uses sequence children when an abstract set is unavailable', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();
        const child: _PdfUniqueEncodingElement = createInteger(5);
        const sequenceElement: _PdfUniqueEncodingElement = createSequence([child]);

        // Act
        const children: _PdfAbstractSyntaxElement[] =
            signer._getChildrenWithFallback(sequenceElement);

        // Assert
        expect(children.length).toBe(1);
        expect(children[0]).toBe(child);
        expect(children[0]._getInteger()).toBe(5);
    });

    it('returns an empty fallback collection for a missing element', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();

        // Act
        const children: _PdfAbstractSyntaxElement[] =
            signer._getChildrenWithFallback(undefined);

        // Assert
        expect(children).toEqual([]);
        expect(children.length).toBe(0);
    });
});


describe('_PdfCryptographicMessageSyntaxSigner lines 612 to 937 mutation coverage', () => {
    function createSigner(): _PdfCryptographicMessageSyntaxSigner {
    return new _PdfCryptographicMessageSyntaxSigner(new Uint8Array(0), 'adbe.pkcs7.detached');
}

function decodeBase64(value: string): Uint8Array {
    const text: string = atob(value);
    const bytes: Uint8Array = new Uint8Array(text.length);
    for (let i: number = 0; i < text.length; i++) {
        bytes[i] = text.charCodeAt(i);
    }
    return bytes;
}

function createCertificate(): _PdfX509Certificate {
    const parser: _PdfX509CertificateParser = new _PdfX509CertificateParser();
    return parser._readCertificateFromStream(decodeBase64('MIICDDCCAXWgAwIBAgIUG6kTTZ9oC74V15y18zQA7u8UJj0wDQYJKoZIhvcNAQELBQAwGDEWMBQGA1UEAwwNTXV0YXRpb25SYW5nZTAeFw0yNjA4MTgwOTM3NTJaFw0yNjA4MTkwOTM3NTJaMBgxFjAUBgNVBAMMDU11dGF0aW9uUmFuZ2UwgZ8wDQYJKoZIhvcNAQEBBQADgY0AMIGJAoGBANIBplfNiNFDG+S7cc6RMt54p50WIhCkZ3fLGttfGRN/eUcZ3WNsbg7NFKUJQU+gSXI9hMKmdQaDXj6A31s2cgxz/qvLL6LqV44SjnR4KeAjlSJV7EaAIWuuIg8MiKwPwyto2x0JNU3/+w8eROjd7jD+2u3G08/G5B8548fCkIGBAgMBAAGjUzBRMB0GA1UdDgQWBBRB0ui0Fb4FN68t5+3dq/hunA/TOjAfBgNVHSMEGDAWgBRB0ui0Fb4FN68t5+3dq/hunA/TOjAPBgNVHRMBAf8EBTADAQH/MA0GCSqGSIb3DQEBCwUAA4GBABEMj36Qwjt8vvbA/WEjNcdGv0y7gi2oEsqGjENWp/Rc/giE+4elnRkaZQm/v7yiHjAyC+QhmWmv4A/A6LcBtuXf2Is+SKTXUwfASD8TSIfh4tGKpr1Qsg0NX73hkuWZju4UYleig3V2pYuYDU4SGRChLgeDGrLPRQRKcHLBJkPP'), true);
}

function createSigningSigner(certificate: _PdfX509Certificate): _PdfCryptographicMessageSyntaxSigner {
    return new _PdfCryptographicMessageSyntaxSigner(
        { modulus: new Uint8Array([1]), exponent: new Uint8Array([1, 0, 1]) } as any,
        [certificate], 'SHA256', true
    );
}

function parseSequence(bytes: Uint8Array): _PdfAbstractSyntaxElement[] {
    const element: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();
    element._fromBytes(bytes);
    return element._getSequence();
}

function createSequenceValue(value: number): _PdfUniqueEncodingElement {
    const child: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
    child._tagClass = _TagClassType.universal;
    child._construction = _ConstructionType.primitive;
    child._setTagNumber(_UniversalType.integer);
    child._setValue(new Uint8Array([value]));
    const sequence: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
    sequence._tagClass = _TagClassType.universal;
    sequence._construction = _ConstructionType.constructed;
    sequence._setTagNumber(_UniversalType.sequence);
    sequence._setSequence([child]);
    return sequence;
}

    it('builds exact body ordering with and without certificates', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();
        const digest: _PdfUniqueEncodingElement = createSequenceValue(1);
        const content: _PdfUniqueEncodingElement = createSequenceValue(2);
        const certificate: _PdfUniqueEncodingElement = createSequenceValue(3);
        const signerInformation: _PdfUniqueEncodingElement = createSequenceValue(4);

        // Act
        const withCertificate: _PdfUniqueEncodingElement[] = signer._buildSignedDataBodyElements(
            1, [digest], content, [certificate], signerInformation
        );
        const withoutCertificate: _PdfUniqueEncodingElement[] = signer._buildSignedDataBodyElements(
            1, [digest], content, [], signerInformation
        );

        // Assert
        expect(withCertificate.length).toBe(5);
        expect(withCertificate[0]._getInteger()).toBe(1);
        expect(withCertificate[1]._getAbstractSetOf()).toEqual([digest]);
        expect(withCertificate[2]).toBe(content);
        expect(withCertificate[3]._tagClass).toBe(_TagClassType.context);
        expect(withCertificate[3]._getAbstractSetOf()).toEqual([certificate]);
        expect(withCertificate[4]._getAbstractSetOf()).toEqual([signerInformation]);
        expect(withoutCertificate.length).toBe(4);
        expect(withoutCertificate[3]._getAbstractSetOf()).toEqual([signerInformation]);
    });

    it('concatenates element and byte inputs with exact short length', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();
        const element: _PdfUniqueEncodingElement = createSequenceValue(5);
        const raw: Uint8Array = new Uint8Array([6, 7]);

        // Act
        const result: Uint8Array = signer._concatAbstractSyntaxSequence([element, raw]);

        // Assert
        expect(result).toEqual(new Uint8Array([0x30, 0x07, 0x30, 0x03, 0x02, 0x01, 0x05, 0x06, 0x07]));
    });

    it('uses two-byte long-form sequence length at exactly 256 bytes', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();
        const first: Uint8Array = new Uint8Array(128);
        const second: Uint8Array = new Uint8Array(128);
        first[0] = 11;
        second[127] = 22;

        // Act
        const result: Uint8Array = signer._concatAbstractSyntaxSequence([first, second]);

        // Assert
        expect(result.length).toBe(260);
        expect(result[0]).toBe(0x30);
        expect(result[1]).toBe(0x82);
        expect(result[2]).toBe(0x01);
        expect(result[3]).toBe(0x00);
        expect(result[4]).toBe(11);
        expect(result[259]).toBe(22);
    });

    it('extracts the issuer at the exact TBS sequence index', () => {
        // Arrange
        const certificate: _PdfX509Certificate = createCertificate();
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();
        const tbsBytes: Uint8Array = certificate._getTobeSignedCertificate();
        const tbs: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
        tbs._fromBytes(tbsBytes);
        const expectedIssuer: _PdfAbstractSyntaxElement = tbs._getSequence()[3];

        // Act
        const issuer: _PdfUniqueEncodingElement = signer._getIssuer(tbsBytes);

        // Assert
        expect(issuer._toBytes()).toEqual(expectedIssuer._toBytes());
    });

    it('encodes exact timestamp attribute OID and token value', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();
        const token: Uint8Array = new Uint8Array([0x30, 0x03, 0x02, 0x01, 0x01]);

        // Act
        const result: Uint8Array = signer._getTimestampAttributes(token);
        const outerSet: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();
        outerSet._fromBytes(result);
        const attribute: _PdfAbstractSyntaxElement = outerSet._getAbstractSetOf()[0];
        const children: _PdfAbstractSyntaxElement[] = attribute._getSequence();

        // Assert
        expect(children.length).toBe(2);
        expect(children[0]._getObjectIdentifier().toString()).toBe('1.2.840.113549.1.9.16.2.14');
        expect(children[1]._getValue()).toEqual(token);
    });

    it('maps every requested digest name and the default exactly', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();

        // Act
        const sha1: { oid: string; name: string } = signer._getObjectIdentifierName('sha1');
        const sha256: { oid: string; name: string } = signer._getObjectIdentifierName('SHA256');
        const sha384: { oid: string; name: string } = signer._getObjectIdentifierName('SHA384');
        const sha512: { oid: string; name: string } = signer._getObjectIdentifierName('SHA512');
        const fallback: { oid: string; name: string } = signer._getObjectIdentifierName('MD5');

        // Assert
        expect(sha1).toEqual({ oid: '1.3.14.3.2.26', name: 'SHA1' });
        expect(sha256).toEqual({ oid: '2.16.840.1.101.3.4.2.1', name: 'SHA256' });
        expect(sha384).toEqual({ oid: '2.16.840.1.101.3.4.2.2', name: 'SHA384' });
        expect(sha512).toEqual({ oid: '2.16.840.1.101.3.4.2.3', name: 'SHA512' });
        expect(fallback).toEqual({ oid: '2.16.840.1.101.3.4.2.1', name: 'SHA256' });
    });

    it('creates an exact timestamp request for SHA256', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();
        const hash: Uint8Array = new Uint8Array([1, 2, 3, 4]);

        // Act
        const result: Uint8Array = signer._createTimestampRequestWithAlgorithm(
            hash, '2.16.840.1.101.3.4.2.1'
        );
        const request: _PdfAbstractSyntaxElement[] = parseSequence(result);
        const imprint: _PdfAbstractSyntaxElement[] = request[1]._getSequence();
        const algorithm: _PdfAbstractSyntaxElement[] = imprint[0]._getSequence();

        // Assert
        expect(request.length).toBe(4);
        expect(request[0]._getInteger()).toBe(1);
        expect(algorithm[0]._getObjectIdentifier().toString()).toBe('2.16.840.1.101.3.4.2.1');
        expect(imprint[1]._getValue()).toEqual(hash);
        expect(request[2]._getInteger()).toBe(100);
        expect(request[3]._getValue()).toEqual(new Uint8Array([0xff]));
    });

    it('returns the original timestamp response for an incomplete top sequence', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();
        const response: Uint8Array = new Uint8Array([0x30, 0x03, 0x02, 0x01, 0x00]);

        // Act
        const result: Uint8Array = signer._reEncodeTimestampResponse(response);

        // Assert
        expect(result).toBe(response);
        expect(result).toEqual(new Uint8Array([0x30, 0x03, 0x02, 0x01, 0x00]));
    });

    it('re-encodes the timestamp token inner sequence exactly', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();
        const status: _PdfUniqueEncodingElement = createSequenceValue(1);
        const token: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
        token._tagClass = _TagClassType.universal;
        token._construction = _ConstructionType.constructed;
        token._setTagNumber(_UniversalType.sequence);
        token._setSequence([createSequenceValue(2), createSequenceValue(3)]);
        const response: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
        response._tagClass = _TagClassType.universal;
        response._construction = _ConstructionType.constructed;
        response._setTagNumber(_UniversalType.sequence);
        response._setSequence([status, token]);

        // Act
        const result: Uint8Array = signer._reEncodeTimestampResponse(response._toBytes());

        // Assert
        expect(result).toEqual(token._toBytes());
        expect(parseSequence(result).length).toBe(2);
    });

    it('encodes timestamp sequence short and long length boundaries', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();
        const shortElement: _PdfUniqueEncodingElement = signer._createPrimitive(
            _UniversalType.octetString, new Uint8Array(125)
        );
        const boundaryElement: _PdfUniqueEncodingElement = signer._createPrimitive(
            _UniversalType.octetString, new Uint8Array(126)
        );

        // Act
        const shortResult: Uint8Array = signer._encodeTimeStampSequence([shortElement]);
        const boundaryResult: Uint8Array = signer._encodeTimeStampSequence([boundaryElement]);

        // Assert
        expect(shortResult[0]).toBe(0x30);
        expect(shortResult[1]).toBe(0x7f);
        expect(boundaryResult[0]).toBe(0x30);
        expect(boundaryResult[1]).toBe(0x81);
        expect(boundaryResult[2]).toBe(0x80);
    });

    it('encodes sequence lengths at zero 127 128 and 256', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();

        // Act
        const zero: Uint8Array = signer._encodeSequenceLength(0);
        const short: Uint8Array = signer._encodeSequenceLength(127);
        const boundary: Uint8Array = signer._encodeSequenceLength(128);
        const twoByte: Uint8Array = signer._encodeSequenceLength(256);

        // Assert
        expect(zero).toEqual(new Uint8Array([0x00]));
        expect(short).toEqual(new Uint8Array([0x7f]));
        expect(boundary).toEqual(new Uint8Array([0x81, 0x80]));
        expect(twoByte).toEqual(new Uint8Array([0x82, 0x01, 0x00]));
    });

    it('builds an unsigned timestamp attribute with the exact token', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();
        const token: _PdfUniqueEncodingElement = createSequenceValue(9);

        // Act
        const attribute: _PdfUniqueEncodingElement = signer._buildTimestampUnsignedAttribute(token._toBytes());
        const children: _PdfAbstractSyntaxElement[] = attribute._getSequence();
        const values: _PdfAbstractSyntaxElement[] = children[1]._getAbstractSetOf();

        // Assert
        expect(children.length).toBe(2);
        expect(children[0]._getObjectIdentifier().toString()).toBe('1.2.840.113549.1.9.16.2.14');
        expect(values.length).toBe(1);
        expect(values[0]._toBytes()).toEqual(token._toBytes());
    });

    it('creates an implicit context element with the requested tag and value', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();
        const value: Uint8Array = new Uint8Array([0x31, 0x03, 0x02, 0x01, 0x07]);

        // Act
        const result: _PdfUniqueEncodingElement = signer._createContextImplicitFromTimestampValue(1, value);

        // Assert
        expect(result._tagClass).toBe(_TagClassType.context);
        expect(result._getTagNumber()).toBe(1);
        expect(result._getValue()).toEqual(new Uint8Array([0x02, 0x01, 0x07]));
    });

    it('adds a supplied timestamp response in asynchronous signing', async () => {
        // Arrange
        const certificate: _PdfX509Certificate = createCertificate();
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigningSigner(certificate);
        signer._setSignedData(new Uint8Array([10, 11]), new Uint8Array(0), 'RSA');
        const timestampToken: _PdfUniqueEncodingElement = createSequenceValue(12);
        const signature: PdfSignature = {
            _timestampCallback: async (_request: Uint8Array): Promise<{ data: Uint8Array }> => {
                return { data: new Uint8Array(0) };
            }
        } as PdfSignature;

        // Act
        const result: Uint8Array = await signer._signAsync(
            new Uint8Array([13]), signature, timestampToken._toBytes()
        );

        // Assert
        expect(result.length).toBeGreaterThan(0);
        expect(signer._hasTimeStamp).toBeTruthy();
    });

    it('does not add a timestamp when callback returns empty data', async () => {
        // Arrange
        const certificate: _PdfX509Certificate = createCertificate();
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigningSigner(certificate);
        signer._setSignedData(new Uint8Array([20, 21]), new Uint8Array(0), 'RSA');
        let callbackCount: number = 0;
        const signature: PdfSignature = {
            _timestampCallback: async (request: Uint8Array): Promise<{ data: Uint8Array }> => {
                callbackCount++;
                expect(request.length).toBeGreaterThan(0);
                return { data: new Uint8Array(0) };
            }
        } as PdfSignature;

        // Act
        const result: Uint8Array = await signer._signAsync(new Uint8Array([22]), signature);

        // Assert
        expect(result.length).toBeGreaterThan(0);
        expect(callbackCount).toBe(1);
        expect(signer._hasTimeStamp).toBeFalsy();
    });
});


describe('_PdfCryptographicMessageSyntaxSigner lines 612 to 937 mutation coverage', () => {
    function createSigner(): _PdfCryptographicMessageSyntaxSigner {
    return new _PdfCryptographicMessageSyntaxSigner(new Uint8Array(0), 'adbe.pkcs7.detached');
}

function decodeBase64(value: string): Uint8Array {
    const text: string = atob(value);
    const bytes: Uint8Array = new Uint8Array(text.length);
    for (let i: number = 0; i < text.length; i++) {
        bytes[i] = text.charCodeAt(i);
    }
    return bytes;
}

function createCertificate(): _PdfX509Certificate {
    const parser: _PdfX509CertificateParser = new _PdfX509CertificateParser();
    return parser._readCertificateFromStream(decodeBase64('MIICDDCCAXWgAwIBAgIUG6kTTZ9oC74V15y18zQA7u8UJj0wDQYJKoZIhvcNAQELBQAwGDEWMBQGA1UEAwwNTXV0YXRpb25SYW5nZTAeFw0yNjA4MTgwOTM3NTJaFw0yNjA4MTkwOTM3NTJaMBgxFjAUBgNVBAMMDU11dGF0aW9uUmFuZ2UwgZ8wDQYJKoZIhvcNAQEBBQADgY0AMIGJAoGBANIBplfNiNFDG+S7cc6RMt54p50WIhCkZ3fLGttfGRN/eUcZ3WNsbg7NFKUJQU+gSXI9hMKmdQaDXj6A31s2cgxz/qvLL6LqV44SjnR4KeAjlSJV7EaAIWuuIg8MiKwPwyto2x0JNU3/+w8eROjd7jD+2u3G08/G5B8548fCkIGBAgMBAAGjUzBRMB0GA1UdDgQWBBRB0ui0Fb4FN68t5+3dq/hunA/TOjAfBgNVHSMEGDAWgBRB0ui0Fb4FN68t5+3dq/hunA/TOjAPBgNVHRMBAf8EBTADAQH/MA0GCSqGSIb3DQEBCwUAA4GBABEMj36Qwjt8vvbA/WEjNcdGv0y7gi2oEsqGjENWp/Rc/giE+4elnRkaZQm/v7yiHjAyC+QhmWmv4A/A6LcBtuXf2Is+SKTXUwfASD8TSIfh4tGKpr1Qsg0NX73hkuWZju4UYleig3V2pYuYDU4SGRChLgeDGrLPRQRKcHLBJkPP'), true);
}

function createSigningSigner(certificate: _PdfX509Certificate): _PdfCryptographicMessageSyntaxSigner {
    return new _PdfCryptographicMessageSyntaxSigner(
        { modulus: new Uint8Array([1]), exponent: new Uint8Array([1, 0, 1]) } as any,
        [certificate], 'SHA256', true
    );
}

function parseSequence(bytes: Uint8Array): _PdfAbstractSyntaxElement[] {
    const element: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();
    element._fromBytes(bytes);
    return element._getSequence();
}

function createSequenceValue(value: number): _PdfUniqueEncodingElement {
    const child: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
    child._tagClass = _TagClassType.universal;
    child._construction = _ConstructionType.primitive;
    child._setTagNumber(_UniversalType.integer);
    child._setValue(new Uint8Array([value]));
    const sequence: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
    sequence._tagClass = _TagClassType.universal;
    sequence._construction = _ConstructionType.constructed;
    sequence._setTagNumber(_UniversalType.sequence);
    sequence._setSequence([child]);
    return sequence;
}
    it('builds exact body ordering with and without certificates', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();
        const digest: _PdfUniqueEncodingElement = createSequenceValue(1);
        const content: _PdfUniqueEncodingElement = createSequenceValue(2);
        const certificate: _PdfUniqueEncodingElement = createSequenceValue(3);
        const signerInformation: _PdfUniqueEncodingElement = createSequenceValue(4);

        // Act
        const withCertificate: _PdfUniqueEncodingElement[] = signer._buildSignedDataBodyElements(
            1, [digest], content, [certificate], signerInformation
        );
        const withoutCertificate: _PdfUniqueEncodingElement[] = signer._buildSignedDataBodyElements(
            1, [digest], content, [], signerInformation
        );

        // Assert
        expect(withCertificate.length).toBe(5);
        expect(withCertificate[0]._getInteger()).toBe(1);
        expect(withCertificate[1]._getAbstractSetOf()).toEqual([digest]);
        expect(withCertificate[2]).toBe(content);
        expect(withCertificate[3]._tagClass).toBe(_TagClassType.context);
        expect(withCertificate[3]._getAbstractSetOf()).toEqual([certificate]);
        expect(withCertificate[4]._getAbstractSetOf()).toEqual([signerInformation]);
        expect(withoutCertificate.length).toBe(4);
        expect(withoutCertificate[3]._getAbstractSetOf()).toEqual([signerInformation]);
    });

    it('concatenates element and byte inputs with exact short length', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();
        const element: _PdfUniqueEncodingElement = createSequenceValue(5);
        const raw: Uint8Array = new Uint8Array([6, 7]);

        // Act
        const result: Uint8Array = signer._concatAbstractSyntaxSequence([element, raw]);

        // Assert
        expect(result).toEqual(new Uint8Array([0x30, 0x07, 0x30, 0x03, 0x02, 0x01, 0x05, 0x06, 0x07]));
    });

    it('uses two-byte long-form sequence length at exactly 256 bytes', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();
        const first: Uint8Array = new Uint8Array(128);
        const second: Uint8Array = new Uint8Array(128);
        first[0] = 11;
        second[127] = 22;

        // Act
        const result: Uint8Array = signer._concatAbstractSyntaxSequence([first, second]);

        // Assert
        expect(result.length).toBe(260);
        expect(result[0]).toBe(0x30);
        expect(result[1]).toBe(0x82);
        expect(result[2]).toBe(0x01);
        expect(result[3]).toBe(0x00);
        expect(result[4]).toBe(11);
        expect(result[259]).toBe(22);
    });

    it('extracts the issuer at the exact TBS sequence index', () => {
        // Arrange
        const certificate: _PdfX509Certificate = createCertificate();
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();
        const tbsBytes: Uint8Array = certificate._getTobeSignedCertificate();
        const tbs: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
        tbs._fromBytes(tbsBytes);
        const expectedIssuer: _PdfAbstractSyntaxElement = tbs._getSequence()[3];

        // Act
        const issuer: _PdfUniqueEncodingElement = signer._getIssuer(tbsBytes);

        // Assert
        expect(issuer._toBytes()).toEqual(expectedIssuer._toBytes());
    });

    it('encodes exact timestamp attribute OID and token value', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();
        const token: Uint8Array = new Uint8Array([0x30, 0x03, 0x02, 0x01, 0x01]);

        // Act
        const result: Uint8Array = signer._getTimestampAttributes(token);
        const outerSet: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();
        outerSet._fromBytes(result);
        const attribute: _PdfAbstractSyntaxElement = outerSet._getAbstractSetOf()[0];
        const children: _PdfAbstractSyntaxElement[] = attribute._getSequence();

        // Assert
        expect(children.length).toBe(2);
        expect(children[0]._getObjectIdentifier().toString()).toBe('1.2.840.113549.1.9.16.2.14');
        expect(children[1]._getValue()).toEqual(token);
    });

    it('maps every requested digest name and the default exactly', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();

        // Act
        const sha1: { oid: string; name: string } = signer._getObjectIdentifierName('sha1');
        const sha256: { oid: string; name: string } = signer._getObjectIdentifierName('SHA256');
        const sha384: { oid: string; name: string } = signer._getObjectIdentifierName('SHA384');
        const sha512: { oid: string; name: string } = signer._getObjectIdentifierName('SHA512');
        const fallback: { oid: string; name: string } = signer._getObjectIdentifierName('MD5');

        // Assert
        expect(sha1).toEqual({ oid: '1.3.14.3.2.26', name: 'SHA1' });
        expect(sha256).toEqual({ oid: '2.16.840.1.101.3.4.2.1', name: 'SHA256' });
        expect(sha384).toEqual({ oid: '2.16.840.1.101.3.4.2.2', name: 'SHA384' });
        expect(sha512).toEqual({ oid: '2.16.840.1.101.3.4.2.3', name: 'SHA512' });
        expect(fallback).toEqual({ oid: '2.16.840.1.101.3.4.2.1', name: 'SHA256' });
    });

    it('creates an exact timestamp request for SHA256', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();
        const hash: Uint8Array = new Uint8Array([1, 2, 3, 4]);

        // Act
        const result: Uint8Array = signer._createTimestampRequestWithAlgorithm(
            hash, '2.16.840.1.101.3.4.2.1'
        );
        const request: _PdfAbstractSyntaxElement[] = parseSequence(result);
        const imprint: _PdfAbstractSyntaxElement[] = request[1]._getSequence();
        const algorithm: _PdfAbstractSyntaxElement[] = imprint[0]._getSequence();

        // Assert
        expect(request.length).toBe(4);
        expect(request[0]._getInteger()).toBe(1);
        expect(algorithm[0]._getObjectIdentifier().toString()).toBe('2.16.840.1.101.3.4.2.1');
        expect(imprint[1]._getValue()).toEqual(hash);
        expect(request[2]._getInteger()).toBe(100);
        expect(request[3]._getValue()).toEqual(new Uint8Array([0xff]));
    });

    it('returns the original timestamp response for an incomplete top sequence', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();
        const response: Uint8Array = new Uint8Array([0x30, 0x03, 0x02, 0x01, 0x00]);

        // Act
        const result: Uint8Array = signer._reEncodeTimestampResponse(response);

        // Assert
        expect(result).toBe(response);
        expect(result).toEqual(new Uint8Array([0x30, 0x03, 0x02, 0x01, 0x00]));
    });

    it('re-encodes the timestamp token inner sequence exactly', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();
        const status: _PdfUniqueEncodingElement = createSequenceValue(1);
        const token: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
        token._tagClass = _TagClassType.universal;
        token._construction = _ConstructionType.constructed;
        token._setTagNumber(_UniversalType.sequence);
        token._setSequence([createSequenceValue(2), createSequenceValue(3)]);
        const response: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
        response._tagClass = _TagClassType.universal;
        response._construction = _ConstructionType.constructed;
        response._setTagNumber(_UniversalType.sequence);
        response._setSequence([status, token]);

        // Act
        const result: Uint8Array = signer._reEncodeTimestampResponse(response._toBytes());

        // Assert
        expect(result).toEqual(token._toBytes());
        expect(parseSequence(result).length).toBe(2);
    });

    it('encodes timestamp sequence short and long length boundaries', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();
        const shortElement: _PdfUniqueEncodingElement = signer._createPrimitive(
            _UniversalType.octetString, new Uint8Array(125)
        );
        const boundaryElement: _PdfUniqueEncodingElement = signer._createPrimitive(
            _UniversalType.octetString, new Uint8Array(126)
        );

        // Act
        const shortResult: Uint8Array = signer._encodeTimeStampSequence([shortElement]);
        const boundaryResult: Uint8Array = signer._encodeTimeStampSequence([boundaryElement]);

        // Assert
        expect(shortResult[0]).toBe(0x30);
        expect(shortResult[1]).toBe(0x7f);
        expect(boundaryResult[0]).toBe(0x30);
        expect(boundaryResult[1]).toBe(0x81);
        expect(boundaryResult[2]).toBe(0x80);
    });

    it('encodes sequence lengths at zero 127 128 and 256', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();

        // Act
        const zero: Uint8Array = signer._encodeSequenceLength(0);
        const short: Uint8Array = signer._encodeSequenceLength(127);
        const boundary: Uint8Array = signer._encodeSequenceLength(128);
        const twoByte: Uint8Array = signer._encodeSequenceLength(256);

        // Assert
        expect(zero).toEqual(new Uint8Array([0x00]));
        expect(short).toEqual(new Uint8Array([0x7f]));
        expect(boundary).toEqual(new Uint8Array([0x81, 0x80]));
        expect(twoByte).toEqual(new Uint8Array([0x82, 0x01, 0x00]));
    });

    it('builds an unsigned timestamp attribute with the exact token', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();
        const token: _PdfUniqueEncodingElement = createSequenceValue(9);

        // Act
        const attribute: _PdfUniqueEncodingElement = signer._buildTimestampUnsignedAttribute(token._toBytes());
        const children: _PdfAbstractSyntaxElement[] = attribute._getSequence();
        const values: _PdfAbstractSyntaxElement[] = children[1]._getAbstractSetOf();

        // Assert
        expect(children.length).toBe(2);
        expect(children[0]._getObjectIdentifier().toString()).toBe('1.2.840.113549.1.9.16.2.14');
        expect(values.length).toBe(1);
        expect(values[0]._toBytes()).toEqual(token._toBytes());
    });

    it('creates an implicit context element with the requested tag and value', () => {
        // Arrange
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigner();
        const value: Uint8Array = new Uint8Array([0x31, 0x03, 0x02, 0x01, 0x07]);

        // Act
        const result: _PdfUniqueEncodingElement = signer._createContextImplicitFromTimestampValue(1, value);

        // Assert
        expect(result._tagClass).toBe(_TagClassType.context);
        expect(result._getTagNumber()).toBe(1);
        expect(result._getValue()).toEqual(new Uint8Array([0x02, 0x01, 0x07]));
    });

    it('adds a supplied timestamp response in asynchronous signing', async () => {
        // Arrange
        const certificate: _PdfX509Certificate = createCertificate();
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigningSigner(certificate);
        signer._setSignedData(new Uint8Array([10, 11]), new Uint8Array(0), 'RSA');
        const timestampToken: _PdfUniqueEncodingElement = createSequenceValue(12);
        const signature: PdfSignature = {
            _timestampCallback: async (_request: Uint8Array): Promise<{ data: Uint8Array }> => {
                return { data: new Uint8Array(0) };
            }
        } as PdfSignature;

        // Act
        const result: Uint8Array = await signer._signAsync(
            new Uint8Array([13]), signature, timestampToken._toBytes()
        );

        // Assert
        expect(result.length).toBeGreaterThan(0);
        expect(signer._hasTimeStamp).toBeTruthy();
    });

    it('does not add a timestamp when callback returns empty data', async () => {
        // Arrange
        const certificate: _PdfX509Certificate = createCertificate();
        const signer: _PdfCryptographicMessageSyntaxSigner = createSigningSigner(certificate);
        signer._setSignedData(new Uint8Array([20, 21]), new Uint8Array(0), 'RSA');
        let callbackCount: number = 0;
        const signature: PdfSignature = {
            _timestampCallback: async (request: Uint8Array): Promise<{ data: Uint8Array }> => {
                callbackCount++;
                expect(request.length).toBeGreaterThan(0);
                return { data: new Uint8Array(0) };
            }
        } as PdfSignature;

        // Act
        const result: Uint8Array = await signer._signAsync(new Uint8Array([22]), signature);

        // Assert
        expect(result.length).toBeGreaterThan(0);
        expect(callbackCount).toBe(1);
        expect(signer._hasTimeStamp).toBeFalsy();
    });
});
function getExpandedAes128Key(): Uint8Array {
    return new Uint8Array([
        0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07,
        0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f,
        0xd6, 0xaa, 0x74, 0xfd, 0xd2, 0xaf, 0x72, 0xfa,
        0xda, 0xa6, 0x78, 0xf1, 0xd6, 0xab, 0x76, 0xfe,
        0xb6, 0x92, 0xcf, 0x0b, 0x64, 0x3d, 0xbd, 0xf1,
        0xbe, 0x9b, 0xc5, 0x00, 0x68, 0x30, 0xb3, 0xfe,
        0xb6, 0xff, 0x74, 0x4e, 0xd2, 0xc2, 0xc9, 0xbf,
        0x6c, 0x59, 0x0c, 0xbf, 0x04, 0x69, 0xbf, 0x41,
        0x47, 0xf7, 0xf7, 0xbc, 0x95, 0x35, 0x3e, 0x03,
        0xf9, 0x6c, 0x32, 0xbc, 0xfd, 0x05, 0x8d, 0xfd,
        0x3c, 0xaa, 0xa3, 0xe8, 0xa9, 0x9f, 0x9d, 0xeb,
        0x50, 0xf3, 0xaf, 0x57, 0xad, 0xf6, 0x22, 0xaa,
        0x5e, 0x39, 0x0f, 0x7d, 0xf7, 0xa6, 0x92, 0x96,
        0xa7, 0x55, 0x3d, 0xc1, 0x0a, 0xa3, 0x1f, 0x6b,
        0x14, 0xf9, 0x70, 0x1a, 0xe3, 0x5f, 0xe2, 0x8c,
        0x44, 0x0a, 0xdf, 0x4d, 0x4e, 0xa9, 0xc0, 0x26,
        0x47, 0x43, 0x87, 0x35, 0xa4, 0x1c, 0x65, 0xb9,
        0xe0, 0x16, 0xba, 0xf4, 0xae, 0xbf, 0x7a, 0xd2,
        0x54, 0x99, 0x32, 0xd1, 0xf0, 0x85, 0x57, 0x68,
        0x10, 0x93, 0xed, 0x9c, 0xbe, 0x2c, 0x97, 0x4e,
        0x13, 0x11, 0x1d, 0x7f, 0xe3, 0x94, 0x4a, 0x17,
        0xf3, 0x07, 0xa7, 0x8b, 0x4d, 0x2b, 0x30, 0xc5
    ]);
}

describe('_AdvancedEncryptionBaseCipher survived mutation coverage', () => {
    it('constructor initializes the base cipher state', () => {
        // Arrange and Act
        const cipher: TestAdvancedEncryptionBaseCipher = new TestAdvancedEncryptionBaseCipher();

        // Assert
        expect(cipher instanceof _AdvancedEncryptionBaseCipher).toBeTruthy();
        expect(cipher._buffer).toEqual(new Uint8Array(16));
        expect(cipher._position).toBe(0);
        expect(cipher._s.length).toBe(256);
        expect(cipher._s[0]).toBe(0x63);
        expect(cipher._s[255]).toBe(0x16);
    });

    it('_mixCol initializes every valid byte entry and caches the array', () => {
        // Arrange
        const cipher: TestAdvancedEncryptionBaseCipher = new TestAdvancedEncryptionBaseCipher();

        // Act
        const firstMixColumn: Uint8Array = cipher._mixCol;
        const secondMixColumn: Uint8Array = cipher._mixCol;

        // Assert
        expect(firstMixColumn.length).toBe(256);
        expect(firstMixColumn[0]).toBe(0x00);
        expect(firstMixColumn[127]).toBe(0xfe);
        expect(firstMixColumn[128]).toBe(0x11b & 0xff);
        expect(firstMixColumn[255]).toBe(0x1e5 & 0xff);
        expect(secondMixColumn).toBe(firstMixColumn);
    });

    it('_encryptBlock returns the exact AES-128 FIPS ciphertext', () => {
        // Arrange
        const expandedKey: Uint8Array = getExpandedAes128Key();
        const cipher: TestAdvancedEncryptionBaseCipher = new TestAdvancedEncryptionBaseCipher(expandedKey);
        const input: Uint8Array = new Uint8Array([
            0x00, 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77,
            0x88, 0x99, 0xaa, 0xbb, 0xcc, 0xdd, 0xee, 0xff
        ]);
        const expected: Uint8Array = new Uint8Array([
            0x69, 0xc4, 0xe0, 0xd8, 0x6a, 0x7b, 0x04, 0x30,
            0xd8, 0xcd, 0xb7, 0x80, 0x70, 0xb4, 0xc5, 0x5a
        ]);

        // Act
        const result: Uint8Array = cipher._encryptBlock(input, expandedKey);

        // Assert
        expect(result).toEqual(expected);
        expect(input).toEqual(new Uint8Array([
            0x00, 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77,
            0x88, 0x99, 0xaa, 0xbb, 0xcc, 0xdd, 0xee, 0xff
        ]));
    });

    it('_encrypt returns the exact encrypted block for a zero IV', () => {
        // Arrange
        const expandedKey: Uint8Array = getExpandedAes128Key();
        const cipher: TestAdvancedEncryptionBaseCipher = new TestAdvancedEncryptionBaseCipher(expandedKey);
        const input: Uint8Array = new Uint8Array([
            0x00, 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77,
            0x88, 0x99, 0xaa, 0xbb, 0xcc, 0xdd, 0xee, 0xff
        ]);
        const initialVector: Uint8Array = new Uint8Array(16);
        const expected: Uint8Array = new Uint8Array([
            0x69, 0xc4, 0xe0, 0xd8, 0x6a, 0x7b, 0x04, 0x30,
            0xd8, 0xcd, 0xb7, 0x80, 0x70, 0xb4, 0xc5, 0x5a
        ]);

        // Act
        const result: Uint8Array = cipher._encrypt(input, initialVector);

        // Assert
        expect(result).toEqual(expected);
        expect(result.length).toBe(16);
        expect(cipher._bufferLength).toBe(0);
        expect(cipher._iv).toEqual(expected);
    });

    it('_encrypt returns an empty array when no complete block is produced', () => {
        // Arrange
        const cipher: TestAdvancedEncryptionBaseCipher = new TestAdvancedEncryptionBaseCipher(getExpandedAes128Key());
        const input: Uint8Array = new Uint8Array([0x10, 0x20, 0x30]);
        const initialVector: Uint8Array = new Uint8Array(16);

        // Act
        const result: Uint8Array = cipher._encrypt(input, initialVector);

        // Assert
        expect(result).toEqual(new Uint8Array(0));
        expect(result.length).toBe(0);
        expect(cipher._bufferLength).toBe(3);
        expect(cipher._buffer[0]).toBe(0x10);
        expect(cipher._buffer[1]).toBe(0x20);
        expect(cipher._buffer[2]).toBe(0x30);
        expect(cipher._iv).toBe(initialVector);
    });
});
