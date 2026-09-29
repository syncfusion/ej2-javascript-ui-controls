import { _PdfAbstractSyntaxElement } from '../src/pdf/core/security/digital-signature/asn1/abstract-syntax';
import { _ConstructionType, _TagClassType, _UniversalType } from '../src/pdf/core/security/digital-signature/asn1/enumerator';
import { _PdfObjectIdentifier } from '../src/pdf/core/security/digital-signature/asn1/identifier-mapping';
import { _PdfUniqueEncodingElement } from '../src/pdf/core/security/digital-signature/asn1/unique-encoding-element';
import { _PdfCertificateIdentity, _PdfCertificateIdentityHelper } from '../src/pdf/core/security/digital-signature/ocsp/certificate-identity';
import { _PdfAlgorithms } from '../src/pdf/core/security/digital-signature/x509/x509-algorithm';
import { _encodeObjectIdentifier } from '../src/pdf/core/utils';
function createAlgorithm(oid: string): _PdfAlgorithms {
    var algorithm: _PdfAlgorithms = new _PdfAlgorithms();
    algorithm._objectID =
        new _PdfObjectIdentifier()._fromString(oid);
    return algorithm;
}
function createPrimitive(tag: _UniversalType, bytes: Uint8Array): _PdfUniqueEncodingElement {
    var element: _PdfUniqueEncodingElement =
        new _PdfUniqueEncodingElement(
            _TagClassType.universal,
            _ConstructionType.primitive,
            tag
        );
    element._setValue(bytes);
    return element;
}
function createIssuerName(): _PdfUniqueEncodingElement {
    return createPrimitive(
        _UniversalType.octetString,
        new Uint8Array([1, 2, 3])
    );
}
function createIssuerKey(): _PdfUniqueEncodingElement {
    return createPrimitive(
        _UniversalType.octetString,
        new Uint8Array([4, 5, 6])
    );
}
function createSerialNumber(): Uint8Array {
    return new Uint8Array([7]);
}
function createIdentity(
    oid: string
): _PdfCertificateIdentityHelper {
    return new _PdfCertificateIdentityHelper(
        createAlgorithm(oid),
        createIssuerName(),
        createIssuerKey(),
        createSerialNumber()
    );
}
function getOidValue(identity: _PdfCertificateIdentityHelper): Uint8Array {
    var outerElements: any[] =
        identity._getASN1()._getSequence();
    var identityElements: any[] =
        outerElements[0]._getSequence();
    var algorithmElements: any[] =
        identityElements[0]._getSequence();
    return algorithmElements[0]._getValue();
}
function expectEncodedOid(identity: _PdfCertificateIdentityHelper, expectedBytes: number[]): void {
    var actual: number[] = Array.from(
        getOidValue(identity)
    );
    expect(actual).toEqual(expectedBytes);
}
describe('_PdfCertificateIdentityHelper survived mutants', function () {
    it('Mutant 6: keeps the _id property configurable',
        function () {
            var descriptor:
                PropertyDescriptor | undefined =
                Object.getOwnPropertyDescriptor(
                    _PdfCertificateIdentity.prototype,
                    '_id'
                );
            expect(descriptor).toBeDefined();
            expect(descriptor && descriptor.configurable).toBe(true);
        }
    );
    it('Mutant 12: does not assign fields when serialNumber is absent',
        function () {
            var identity: any = new _PdfCertificateIdentityHelper(createAlgorithm('1.2.840.113549.2.5'), createIssuerName(),
                createIssuerKey(),
                undefined
            );
            expect(identity._hash).toBeUndefined();
            expect(identity._issuerName).toBeUndefined();
            expect(identity._issuerKey).toBeUndefined();
            expect(identity._serialNumber).toBeUndefined();
        }
    );
    it('Mutant 17: does not assign fields when hashAlgorithm is absent',
        function () {
            var identity: any =
                new _PdfCertificateIdentityHelper(
                    undefined,
                    createIssuerName(),
                    createIssuerKey(),
                    createSerialNumber()
                );
            expect(identity._hash).toBeUndefined();
            expect(identity._issuerName).toBeUndefined();
            expect(identity._issuerKey).toBeUndefined();
            expect(identity._serialNumber).toBeUndefined();
        }
    );
    it('Mutant 24: keeps the _serialNumber property configurable',
        function () {
            var descriptor:
                PropertyDescriptor | undefined =
                Object.getOwnPropertyDescriptor(
                    _PdfCertificateIdentityHelper
                        .prototype,
                    '_serialNumber'
                );
            expect(descriptor).toBeDefined();
            expect(descriptor && descriptor.configurable).toBe(true);
        }
    );
    it('Mutant 35: returns undefined without evaluating later branches',
        function () {
            var identity:
                _PdfCertificateIdentityHelper =
                createIdentity(
                    '1.2.840.113549.2.5'
                );
            expect(identity._getCertificateIdentity(undefined)).toBeUndefined();
        }
    );
    it('Mutant 36: returns null when the input is null',
        function () {
            var identity:
                _PdfCertificateIdentityHelper =
                createIdentity(
                    '1.2.840.113549.2.5'
                );
            expect(identity._getCertificateIdentity(null)).toBeNull();
        }
    );
    it('Mutant 37: returns undefined when the input is undefined',
        function () {
            var identity:
                _PdfCertificateIdentityHelper =
                createIdentity(
                    '1.2.840.113549.2.5'
                );
            expect(identity._getCertificateIdentity(undefined)).toBeUndefined();
        }
    );
    it('Mutant 40: returns an existing helper instance unchanged',
        function () {
            var identity:
                _PdfCertificateIdentityHelper =
                createIdentity(
                    '1.2.840.113549.2.5'
                );
            var existing:
                _PdfCertificateIdentityHelper =
                createIdentity(
                    '1.3.14.3.2.26'
                );
            expect(identity._getCertificateIdentity(existing)).toBe(existing);
        }
    );
    it('Mutant 49: does not always remove the first two OID characters',
        function () {
            var identity:
                _PdfCertificateIdentityHelper =
                createIdentity(
                    '1.2.840.113549.2.5'
                );
            expectEncodedOid(
                identity,
                [42, 134, 72, 134, 247, 13, 2, 5]
            );
        }
    );
    it('Mutant 50: removes a leading zero-dot OID prefix',
        function () {
            var identity:
                _PdfCertificateIdentityHelper =
                createIdentity(
                    '0.1.3.14.3.2.26'
                );
            expectEncodedOid(
                identity,
                [1, 3, 14, 3, 2, 26]
            );
        }
    );
    it('Mutant 51: requires both zero and dot prefix checks',
        function () {
            var identity:
                _PdfCertificateIdentityHelper =
                createIdentity(
                    '1.2.840.113549.2.5'
                );
            expectEncodedOid(
                identity,
                [42, 134, 72, 134, 247, 13, 2, 5]
            );
        }
    );
    it('Mutant 52: does not force the first prefix comparison to true',
        function () {
            var identity:
                _PdfCertificateIdentityHelper =
                createIdentity(
                    '1.3.14.3.2.26'
                );
            expectEncodedOid(
                identity,
                [43, 14, 3, 2, 26]
            );
        }
    );
    it('Mutant 53: requires the first OID character to equal zero',
        function () {
            var identity:
                _PdfCertificateIdentityHelper =
                createIdentity(
                    '1.2.840.113549.2.5'
                );
            expectEncodedOid(
                identity,
                [42, 134, 72, 134, 247, 13, 2, 5]
            );
        }
    );
    it('Mutant 54: checks the first OID character instead of the complete OID',
        function () {
            var identity:
                _PdfCertificateIdentityHelper =
                createIdentity(
                    '0.1.3.14.3.2.26'
                );
            expectEncodedOid(
                identity,
                [1, 3, 14, 3, 2, 26]
            );
        }
    );
    it('Mutant 55: compares the first OID character with zero',
        function () {
            var identity:
                _PdfCertificateIdentityHelper =
                createIdentity(
                    '0.1.2.840.113549.2.5'
                );
            expectEncodedOid(
                identity,
                [1, 2, 134, 72, 134, 247, 13, 2, 5]
            );
        }
    );
    it('Mutant 56: does not force the second prefix comparison to true',
        function () {
            var identity:
                _PdfCertificateIdentityHelper =
                createIdentity(
                    '01.2.840.113549.2.5'
                );
            expectEncodedOid(
                identity,
                [42, 134, 72, 134, 247, 13, 2, 5]
            );
        }
    );
    it('Mutant 57: requires the second OID character to equal dot',
        function () {
            var identity:
                _PdfCertificateIdentityHelper =
                createIdentity(
                    '0.1.3.14.3.2.26'
                );
            expectEncodedOid(
                identity,
                [1, 3, 14, 3, 2, 26]
            );
        }
    );
    it('Mutant 58: checks the second OID character instead of the complete OID',
        function () {
            var identity:
                _PdfCertificateIdentityHelper =
                createIdentity(
                    '0.1.2.840.113549.2.5'
                );
            expectEncodedOid(
                identity,
                [1, 2, 134, 72, 134, 247, 13, 2, 5]
            );
        }
    );
    it('Mutant 59: compares the second OID character with dot',
        function () {
            var identity:
                _PdfCertificateIdentityHelper =
                createIdentity(
                    '0.1.3.14.3.2.26'
                );
            expectEncodedOid(
                identity,
                [1, 3, 14, 3, 2, 26]
            );
        }
    );
    it('Mutant 60: executes the zero-dot normalization block',
        function () {
            var identity:
                _PdfCertificateIdentityHelper =
                createIdentity(
                    '0.1.2.840.113549.2.5'
                );
            expectEncodedOid(
                identity,
                [1, 2, 134, 72, 134, 247, 13, 2, 5]
            );
        }
    );
    it('Mutant 64: places the certificate identity sequence in the outer sequence',
        function () {
            var identity:
                _PdfCertificateIdentityHelper =
                createIdentity(
                    '1.2.840.113549.2.5'
                );
            var outerElements: any[] =
                identity._getASN1()._getSequence();
            expect(
                outerElements.length
            ).toBe(1);
            expect(
                outerElements[0]
                    ._getSequence()
                    .length
            ).toBe(4);
        }
    );
    it('should not trim a valid oid that does not start with 0.', () => {
        const helper: _PdfCertificateIdentityHelper = new _PdfCertificateIdentityHelper();
        (helper as any)._hash = {
            _objectID: {
                _getDotDelimitedNotation: () => '1.3.14.3.2.26'
            }
        };
        (helper as any)._issuerName = new _PdfUniqueEncodingElement();
        (helper as any)._issuerKey = new _PdfUniqueEncodingElement();
        (helper as any).serialNumber = new Uint8Array([1]);
        const result: any = helper._getASN1();
        const sequence: any[] = result._getSequence();
        const innerSequence: any[] = sequence[0]._getSequence();
        const oidBytes: Uint8Array =
            innerSequence[0]._getSequence()[0]._getValue();
        expect(oidBytes).toEqual(
            _encodeObjectIdentifier('1.3.14.3.2.26')
        );
    });
    it('should assign constructor values when all parameters are provided', () => {
        const algorithm: any = new _PdfAlgorithms();
        const issuerName: any =
            new _PdfUniqueEncodingElement(
                _TagClassType.universal,
                _ConstructionType.primitive,
                _UniversalType.octetString
            );
        const issuerKey: any =
            new _PdfUniqueEncodingElement(
                _TagClassType.universal,
                _ConstructionType.primitive,
                _UniversalType.octetString
            );
        const serial: Uint8Array = new Uint8Array([10, 20]);
        const helper: _PdfCertificateIdentityHelper =
            new _PdfCertificateIdentityHelper(
                algorithm,
                issuerName,
                issuerKey,
                serial
            );
        expect(helper._serialNumber).toEqual(serial);
    });
    it('should not remove prefix when oid does not start with 0', () => {
        const helper: _PdfCertificateIdentityHelper =
            new _PdfCertificateIdentityHelper();
        (helper as any)._hash = {
            _objectID: {
                _getDotDelimitedNotation: (): string => {
                    return '1.2.840.113549.1.1.11';
                }
            }
        };
        (helper as any)._issuerName =
            new _PdfUniqueEncodingElement(
                _TagClassType.universal,
                _ConstructionType.primitive,
                _UniversalType.octetString
            );
        (helper as any)._issuerKey =
            new _PdfUniqueEncodingElement(
                _TagClassType.universal,
                _ConstructionType.primitive,
                _UniversalType.octetString
            );
        (helper as any).serialNumber = new Uint8Array([1]);
        const result: _PdfUniqueEncodingElement =
            helper._getASN1() as _PdfUniqueEncodingElement;
        const outerSequence: _PdfAbstractSyntaxElement[] =
            result._getSequence();
        const innerSequence: _PdfAbstractSyntaxElement[] =
            outerSequence[0]._getSequence();
        const algorithmSequence: _PdfAbstractSyntaxElement[] =
            innerSequence[0]._getSequence();
        const oidElement: _PdfAbstractSyntaxElement =
            algorithmSequence[0];
        expect(oidElement._getValue()).toEqual(
            _encodeObjectIdentifier('1.2.840.113549.1.1.11')
        );
    });
    it('should not trim oid when second character is not a dot', () => {
        const helper: any = new _PdfCertificateIdentityHelper();
        helper._hash = {
            _objectID: {
                _getDotDelimitedNotation: (): string => '012345'
            }
        };
        helper._issuerName = new _PdfUniqueEncodingElement();
        helper._issuerKey = new _PdfUniqueEncodingElement();
        helper.serialNumber = new Uint8Array([1]);
        const asn1: any = helper._getASN1();
        const oidElement =
            asn1._getSequence()[0]
                ._getSequence()[0]
                ._getSequence()[0];
        expect(oidElement._getValue()).toEqual(
            _encodeObjectIdentifier('012345')
        );
    });
});
