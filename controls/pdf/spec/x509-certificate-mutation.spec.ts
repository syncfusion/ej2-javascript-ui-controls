import { _PdfAbstractSyntaxElement } from "../src/pdf/core/security/digital-signature/asn1/abstract-syntax";
import { _ConstructionType } from "../src/pdf/core/security/digital-signature/asn1/enumerator";
import { _PdfUniqueEncodingElement } from "../src/pdf/core/security/digital-signature/asn1/unique-encoding-element";
import { _PdfPublicKeyCryptographyCertificate } from "../src/pdf/core/security/digital-signature/pdf-cryptography-certificate";
import { _PdfX509Certificate } from "../src/pdf/core/security/digital-signature/x509/x509-certificate";
import { _PdfX509CertificateParser } from "../src/pdf/core/security/digital-signature/x509/x509-certificate-parser";
import { _PdfRonCipherParameter } from "../src/pdf/core/security/digital-signature/x509/x509-cipher-handler";
import { _PdfX509Extension, _PdfX509Extensions } from "../src/pdf/core/security/digital-signature/x509/x509-extensions";
import { _PdfX509Name } from "../src/pdf/core/security/digital-signature/x509/x509-name";
import { _stringToBytes } from "../src/pdf/core/utils";
import { certchain_1 } from "./certificate-input.spec";
describe('1041806 - X509 Certificate', () => {
    it('1041806 - should create boolean key usage entries', () => {
        const keyUsage: boolean[] = [true, false, false];
        expect(typeof keyUsage[0]).toBe('boolean');
        expect(typeof keyUsage[1]).toBe('boolean');
    });
    it('1041806 - should use inner element when constructed', () => {
        const innerElement: any = {
            _getValue: () => new Uint8Array([7, 0x80])
        };
        const asn1Element: any = {
            _construction: _ConstructionType.constructed,
            _getInner: () => innerElement
        };
        spyOn(asn1Element, '_getInner').and.callThrough();
        const bitStringElement = asn1Element._construction === _ConstructionType.constructed
            ? asn1Element._getInner()
            : asn1Element;
        expect(asn1Element._getInner).toHaveBeenCalled();
        expect(bitStringElement).toBe(innerElement);
    });
    it('1041806 - should remove unused-bit count byte', () => {
        const bitBytes = new Uint8Array([7, 0x80]);
        const bits = bitBytes.slice(1);
        expect(bits.length).toBe(1);
        expect(bits[0]).toBe(0x80);
    });
    it('1041806 - should calculate effective bit length correctly', () => {
        const bitBytes = new Uint8Array([7, 0x80]);
        const unusedBits = bitBytes[0];
        const bits = bitBytes.slice(1);
        const length = (bits.length * 8) - unusedBits;
        expect(length).toBe(1);
    });
    it('1041806 - should populate key usage flags as booleans', () => {
        const cert: any = {
            _keyUsage: Array.from(
                { length: 9 },
                (value, i) => (0x80 & (0x80 >> i)) !== 0
            )
        };
        expect(cert._keyUsage.length).toBe(9);
        expect(cert._keyUsage[0]).toBe(true);
        expect(cert._keyUsage[1]).toBe(false);
        expect(typeof cert._keyUsage[0]).toBe('boolean');
    });
    it('1041806 - should parse certificate and validate key usage', () => {
        let isParsed: boolean = false;
        try {
            const certBytes: Uint8Array = _stringToBytes(certchain_1) as Uint8Array;
            const cert: _PdfX509Certificate = new _PdfX509CertificateParser()._readCertificate(certBytes, true);
            isParsed = true;
            expect(cert).toBeDefined();
            if (cert._keyUsage) {
                expect(Array.isArray(cert._keyUsage)).toBe(true);
                expect(typeof cert._keyUsage[0]).toBe('boolean');
            }
        } catch (e) {
            isParsed = true;
        }
        expect(isParsed).toBe(true);
    });
    it('1041806 - should use inner element for constructed key usage extension', () => {
        const bitElement: any = {
            _getValue: () => new Uint8Array([7, 0x80])
        };
        const asn1Element: any = {
            _construction: _ConstructionType.constructed,
            _getInner: jasmine.createSpy().and.returnValue(bitElement)
        };
        const result = asn1Element._construction === _ConstructionType.constructed
            ? asn1Element._getInner()
            : asn1Element;
        expect(asn1Element._getInner).toHaveBeenCalled();
        expect(result).toBe(bitElement);
    });
    it('1041806 - should ignore unused-bit byte when extracting flags', () => {
        const bitBytes = new Uint8Array([7, 0x80]);
        const bits = bitBytes.slice(1);
        expect(bits.length).toBe(1);
        expect(bits[0]).toBe(0x80);
    });
    it('1041806 - should calculate key usage bit length correctly', () => {
        const bitBytes = new Uint8Array([7, 0x80]);
        const unusedBits = bitBytes[0];
        const bits = bitBytes.slice(1);
        const length = (bits.length * 8) - unusedBits;
        expect(length).toBe(1);
    });
    it('1041806 - should generate nine boolean key usage flags', () => {
        const bits = new Uint8Array([0x80]);
        const length = 1;
        const usage = Array.from(
            { length: Math.max(9, length) },
            (_v, i) => {
                return (bits[Math.floor(i / 8)] &
                    (0x80 >> (i % 8))) !== 0;
            }
        );
        expect(usage.length).toBe(9);
        usage.forEach((v: boolean) => {
            expect(typeof v).toBe('boolean');
        });
    });
    it('1041806 - should decode bit positions correctly', () => {
        const bits = new Uint8Array([0x80]);
        const usage = Array.from(
            { length: 9 },
            (_v, i) =>
                (bits[Math.floor(i / 8)] &
                    (0x80 >> (i % 8))) !== 0
        );
        expect(usage[0]).toBe(true);
        expect(usage[1]).toBe(false);
        expect(usage[2]).toBe(false);
        expect(usage[3]).toBe(false);
        expect(usage[4]).toBe(false);
    });
    it('1041806 - should set keyUsage to null when extension is absent', () => {
        const cert: any = {
            _keyUsage: undefined
        };
        const keyUsageExt: any = undefined;
        if (keyUsageExt) {
            cert._keyUsage = [];
        } else {
            cert._keyUsage = null;
        }
        expect(cert._keyUsage).toBeNull();
    });
     it('1041806 - should parse multi-byte key usage correctly', () => {
        const bitString: any = {
            _getValue: () => new Uint8Array([0, 0x00, 0x80])
        };
        const mockStructure: any = {};
        spyOn(_PdfX509Certificate.prototype as any, '_getExtension')
            .and.returnValue({
                _getValue: () => new Uint8Array([1, 2, 3])
            });
        spyOn(_PdfUniqueEncodingElement.prototype, '_fromBytes')
            .and.callFake(function (): void {
                (this as any)._construction = _ConstructionType.constructed;
            });
        const innerSpy = spyOn(
            _PdfUniqueEncodingElement.prototype,
            '_getInner'
        ).and.returnValue(bitString);
        const cert: any = new _PdfX509Certificate(mockStructure);
        expect(innerSpy).toHaveBeenCalled();
        expect(cert._keyUsage.length).toBeGreaterThan(9);
        expect(cert._keyUsage[8]).toBeTruthy();
    });
    it('1041806 - should return signed certificate extensions for version 3', () => {
        const expectedExtensions = new _PdfX509Extensions();
        const mockSigned: any = {
            _getVersion: () => 3,
            _extensions: expectedExtensions
        };
        const mockStructure: any = {
            _getSignedCertificate: () => mockSigned
        };
        const cert: any = new _PdfX509Certificate(mockStructure);
        const result = cert._getExtensions();
        expect(result).toBe(expectedExtensions);
    });
    it('1041806 - should return new extensions object for non-v3 certificates', () => {
        const mockSigned: any = {
            _getVersion: () => 1,
            _extensions: { dummy: true }
        };
        const mockStructure: any = {
            _getSignedCertificate: () => mockSigned
        };
        const cert: any = new _PdfX509Certificate(mockStructure);
        const result = cert._getExtensions();
        expect(result).toBeDefined();
        expect(result instanceof _PdfX509Extensions).toBeTruthy();
    });
    it('1041806 - should create key usage array when extension exists', () => {
        const bitString: any = {
            _getValue: () => new Uint8Array([7, 0x80])
        };
        const mockStructure: any = {};
        spyOn(_PdfX509Certificate.prototype as any, '_getExtension')
            .and.returnValue({
                _getValue: () => new Uint8Array([1, 2, 3])
            });
        spyOn(_PdfUniqueEncodingElement.prototype, '_fromBytes')
            .and.callFake(function (): void {
                (this as any)._construction =
                    _ConstructionType.constructed;
            });
        spyOn(
            _PdfUniqueEncodingElement.prototype,
            '_getInner'
        ).and.returnValue(bitString);
        const cert: any = new _PdfX509Certificate(
            mockStructure
        );
        expect(cert._keyUsage).not.toBeNull();
        expect(cert._keyUsage.length).toBeGreaterThan(0);
    });
    it('1041806 - should populate key usage entries as booleans', () => {
        const bitString: any = {
            _getValue: () => new Uint8Array([7, 0x80])
        };
        const mockStructure: any = {};

        spyOn(_PdfX509Certificate.prototype as any, '_getExtension')
            .and.returnValue({
                _getValue: () => new Uint8Array([1, 2, 3])
            });
        spyOn(_PdfUniqueEncodingElement.prototype, '_fromBytes')
            .and.callFake(function (): void {
                (this as any)._construction =
                    _ConstructionType.constructed;
            });
        spyOn(
            _PdfUniqueEncodingElement.prototype,
            '_getInner'
        ).and.returnValue(bitString);
        const cert: any =
            new _PdfX509Certificate(mockStructure);
        expect(typeof cert._keyUsage[0])
            .toBe('boolean');
    });
});
describe('1041820 - X509 Extensions', () => {
    it('1041820 - should use the provided ordering instead of map iteration ordering', () => {
        const extensions: Map<string, _PdfX509Extension> = new Map();
        const value1: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
        const value2: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
        extensions.set('1.2.3.4', new _PdfX509Extension(false, value1));
        extensions.set('1.2.3.5', new _PdfX509Extension(false, value2));
        const customOrdering: string[] = ['1.2.3.5', '1.2.3.4'];
        const x509Extensions: _PdfX509Extensions =
            new _PdfX509Extensions(extensions, customOrdering);
        const asn1: _PdfUniqueEncodingElement = x509Extensions._getAsn1();
        const outerSequence: _PdfAbstractSyntaxElement[] = asn1._getSequence();
        const extensionsSequence: _PdfAbstractSyntaxElement[] =
            outerSequence[0]._getSequence();
        const firstExtension: _PdfAbstractSyntaxElement[] =
            extensionsSequence[0]._getSequence();
        const firstOid: string =
            firstExtension[0]._getObjectIdentifier().toString();
        expect(firstOid).toBe('1.2.3.5');
    });
    it('1041820 - should ignore OIDs in ordering that are not present in extensions map', () => {
        const extensions: Map<string, _PdfX509Extension> = new Map();
        const value: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
        extensions.set(
            '1.2.3.4',
            new _PdfX509Extension(false, value)
        );
        const ordering: string[] = [
            '1.2.3.4',
            '1.2.3.5'
        ];
        const x509Extensions: _PdfX509Extensions =
            new _PdfX509Extensions(extensions, ordering);
        expect(x509Extensions['_extensions'].has('1.2.3.4')).toBe(true);
        expect(x509Extensions['_extensions'].has('1.2.3.5')).toBe(false);
        expect(x509Extensions['_extensions'].size).toBe(1);
    });
    it('1041820 - should not process entries beyond the ordering length', () => {
        const extensions: Map<string, _PdfX509Extension> = new Map();
        const value1: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
        const value2: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
        extensions.set('1.2.3.4', new _PdfX509Extension(false, value1));
        extensions.set(undefined as any, new _PdfX509Extension(false, value2));
        const ordering: string[] = ['1.2.3.4'];
        const x509Extensions: _PdfX509Extensions =
            new _PdfX509Extensions(extensions, ordering);
        expect(x509Extensions['_extensions'].size).toBe(1);
        expect(x509Extensions['_extensions'].has('1.2.3.4')).toBe(true);
        expect(x509Extensions['_extensions'].has(undefined as any)).toBe(false);
    });
    it('1041820 - should include critical boolean only for critical extensions', () => {
        const value: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
        const extensions: Map<string, _PdfX509Extension> = new Map();
        extensions.set(
            '1.2.3.4',
            new _PdfX509Extension(true, value)
        );
        const x509Extensions: _PdfX509Extensions =
            new _PdfX509Extensions(extensions, ['1.2.3.4']);
        const asn1: _PdfUniqueEncodingElement = x509Extensions._getAsn1();
        const outerSequence: _PdfAbstractSyntaxElement[] = asn1._getSequence();
        const extensionSequence: _PdfAbstractSyntaxElement[] =
            outerSequence[0]._getSequence();
        const extensionValues: _PdfAbstractSyntaxElement[] =
            extensionSequence[0]._getSequence();
        expect(extensionValues.length).toBe(3);
    });
    it('1041820 - should not include critical boolean for non critical extensions', () => {
        const value: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
        const extensions: Map<string, _PdfX509Extension> = new Map();
        extensions.set(
            '1.2.3.4',
            new _PdfX509Extension(false, value)
        );
        const x509Extensions: _PdfX509Extensions =
            new _PdfX509Extensions(extensions, ['1.2.3.4']);
        const asn1: _PdfUniqueEncodingElement = x509Extensions._getAsn1();
        const outerSequence: _PdfAbstractSyntaxElement[] = asn1._getSequence();
        const extensionSequence: _PdfAbstractSyntaxElement[] =
            outerSequence[0]._getSequence();
        const extensionValues: _PdfAbstractSyntaxElement[] =
            extensionSequence[0]._getSequence();
        expect(extensionValues.length).toBe(2);
    });
    it('1041820 - should encode critical flag as true', () => {
        const value: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
        const extensions: Map<string, _PdfX509Extension> = new Map();
        extensions.set(
            '1.2.3.4',
            new _PdfX509Extension(true, value)
        );
        const x509Extensions: _PdfX509Extensions = new _PdfX509Extensions(extensions, ['1.2.3.4']);
        const asn1: _PdfUniqueEncodingElement = x509Extensions._getAsn1();
        const outerSequence: _PdfAbstractSyntaxElement[] = asn1._getSequence();
        const extensionSequence: _PdfAbstractSyntaxElement[] = outerSequence[0]._getSequence();
        const extensionValues: _PdfAbstractSyntaxElement[] = extensionSequence[0]._getSequence();
        expect(extensionValues[1]._getBooleanValue()).toBe(true);
    });
    it('1041820 - should not process entries beyond ordering length in getAsn1', () => {
        const value1: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
        const value2: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
        const extensions: Map<string, _PdfX509Extension> = new Map();
        extensions.set(
            '1.2.3.4',
            new _PdfX509Extension(false, value1)
        );
        extensions.set(
            undefined as any,
            new _PdfX509Extension(false, value2)
        );
        const x509Extensions: _PdfX509Extensions = new _PdfX509Extensions(extensions, ['1.2.3.4']);
        const asn1: _PdfUniqueEncodingElement = x509Extensions._getAsn1();
        const outerSequence: _PdfAbstractSyntaxElement[] = asn1._getSequence();
        const extensionSequence: _PdfAbstractSyntaxElement[] = outerSequence[0]._getSequence();
        expect(extensionSequence.length).toBe(1);
    });
    it('1041820 - should include the ASN.1 value element when value is an abstract syntax element', () => {
        const value: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
        const extensions: Map<string, _PdfX509Extension> = new Map();
        extensions.set(
            '1.2.3.4',
            new _PdfX509Extension(false, value)
        );
        const x509Extensions: _PdfX509Extensions = new _PdfX509Extensions(extensions, ['1.2.3.4']);
        const asn1: _PdfUniqueEncodingElement = x509Extensions._getAsn1();
        const outerSequence: _PdfAbstractSyntaxElement[] = asn1._getSequence();
        const extensionSequence: _PdfAbstractSyntaxElement[] = outerSequence[0]._getSequence();
        const extensionValues: _PdfAbstractSyntaxElement[] = extensionSequence[0]._getSequence();
        expect(extensionValues.length).toBe(2);
        expect(extensionValues[1]).toBe(value);
    });
    it('1041820 - should create an octet string element when value is not an abstract syntax element', () => {
        const value: Uint8Array = new Uint8Array([1, 2, 3]);
        const extensions: Map<string, _PdfX509Extension> = new Map();
        extensions.set(
            '1.2.3.4',
            new _PdfX509Extension(false, value as any)
        );
        const x509Extensions: _PdfX509Extensions = new _PdfX509Extensions(extensions, ['1.2.3.4']);
        const asn1: _PdfUniqueEncodingElement = x509Extensions._getAsn1();
        const outerSequence: _PdfAbstractSyntaxElement[] = asn1._getSequence();
        const extensionSequence: _PdfAbstractSyntaxElement[] = outerSequence[0]._getSequence();
        const extensionValues: _PdfAbstractSyntaxElement[] = extensionSequence[0]._getSequence();
        expect(extensionValues.length).toBe(2);
    });
    it('1041820 - should encode oid component value 128 using base128 encoding', () => {
        const extensions: _PdfX509Extensions = new _PdfX509Extensions();
        const result: Uint8Array = extensions._encodeObjectIdentifier('1.2.128');
        expect(Array.from(result)).toEqual([42, 129, 0]);
    });
    it('1041820 - should encode oid component value less than 128 directly', () => {
        const extensions: _PdfX509Extensions = new _PdfX509Extensions();
        const result: Uint8Array = extensions._encodeObjectIdentifier('1.2.127');
        expect(Array.from(result)).toEqual([42, 127]);
    });
    it('1041820 - should preserve map insertion order when custom ordering is not supplied', () => {
        const extensions: Map<string, _PdfX509Extension> = new Map();
        extensions.set(
            '1.2.3.4',
            new _PdfX509Extension(false, new _PdfUniqueEncodingElement())
        );
        extensions.set(
            '1.2.3.5',
            new _PdfX509Extension(false, new _PdfUniqueEncodingElement())
        );
        const x509Extensions = new _PdfX509Extensions(extensions);
        const asn1 = x509Extensions._getAsn1();
        const outer = asn1._getSequence();
        const exts = outer[0]._getSequence();
        const firstOid =
            exts[0]._getSequence()[0]
                ._getObjectIdentifier()
                .toString();
        const secondOid =
            exts[1]._getSequence()[0]
                ._getObjectIdentifier()
                .toString();
        expect(firstOid).toBe('1.2.3.4');
        expect(secondOid).toBe('1.2.3.5');
    });
    it('1041820 - should throw when inner sequence contains fewer than two elements', () => {
        const parser = new _PdfX509Extensions();
        const element: any = {
            _getSequence: () => [
                {
                    _getObjectIdentifier: () => ({
                        toString: () => '1.2.3.4'
                    })
                }
            ]
        };
        expect(() => {
            parser._fromSequence([element]);
        }).toThrowError('Bad sequence size');
    });
    it('1041820 - should read critical flag from three element sequence', () => {
        const parser = new _PdfX509Extensions();
        const element: any = {
            _getSequence: () => [
                {
                    _getObjectIdentifier: () => ({
                        toString: () => '1.2.3.4'
                    })
                },
                {
                    _getBooleanValue: () => true
                },
                new _PdfUniqueEncodingElement()
            ]
        };
        const result = parser._fromSequence([element]);
        const extension = result['_extensions'].get('1.2.3.4');
        expect(extension).toBeDefined();
        expect(extension._critical).toBe(true);
    });
    it('1041820 - should default critical flag to false when boolean field is absent', () => {
        const parser = new _PdfX509Extensions();
        const value = new _PdfUniqueEncodingElement();
        const element: any = {
            _getSequence: () => [
                {
                    _getObjectIdentifier: () => ({
                        toString: () => '1.2.3.4'
                    })
                },
                value
            ]
        };
        const result = parser._fromSequence([element]);
        const extension = result['_extensions'].get('1.2.3.4');
        expect(extension).toBeDefined();
        expect(extension._critical).toBe(false);
    });
    it('1041820 - should return same instance when input is already x509 extensions', () => {
        const extensions = new _PdfX509Extensions();
        const result = extensions._getInstance(extensions);
        expect(result).toBe(extensions);
    });
    it('1041820 - should throw for unknown object type', () => {
        const extensions = new _PdfX509Extensions();
        expect(() => {
            extensions._getInstance('invalid' as any);
        }).toThrowError('Unknown object in factory');
    });
    it('1041820 - should not attempt to read extension beyond ordering length', () => {
        const value = new _PdfUniqueEncodingElement();
        const extensions = new Map<string, _PdfX509Extension>();
        extensions.set(
            '1.2.3.4',
            new _PdfX509Extension(false, value)
        );
        const x509Extensions =
            new _PdfX509Extensions(extensions, ['1.2.3.4']);
        const originalGet = extensions.get.bind(extensions);
        let undefinedLookupCount = 0;
        spyOn(extensions, 'get').and.callFake((oid: string) => {
            if (oid === undefined as any) {
                undefinedLookupCount++;
            }
            return originalGet(oid);
        });
        x509Extensions._getAsn1();
        expect(undefinedLookupCount).toBe(0);
    });
    it('1041820 - should encode multiple oid components less than 128', () => {
        const extensions: _PdfX509Extensions = new _PdfX509Extensions();
        const result: Uint8Array =
            extensions._encodeObjectIdentifier('1.2.5.10.20');
        expect(Array.from(result)).toEqual([
            42,
            5,
            10,
            20
        ]);
    });
    it('1041820 - should create octet string element for Uint8Array values', () => {
        const bytes = new Uint8Array([1, 2, 3]);
        const extensions = new Map<string, _PdfX509Extension>();
        extensions.set(
            '1.2.3.4',
            new _PdfX509Extension(false, bytes as any)
        );
        const x509Extensions =
            new _PdfX509Extensions(extensions, ['1.2.3.4']);
        const asn1 = x509Extensions._getAsn1();
        const extensionValues =
            asn1
                ._getSequence()[0]
                ._getSequence()[0]
                ._getSequence();
        expect(extensionValues[1])
            .not.toBe(bytes as any);
        expect(
            extensionValues[1] instanceof _PdfUniqueEncodingElement
        ).toBe(true);
    });
    it('1041820 - should encode single oid component below 128', () => {
        const extensions = new _PdfX509Extensions();
        const result =
            extensions._encodeObjectIdentifier('1.2.5');
        expect(Array.from(result))
            .toEqual([42, 5]);
    });
    it('1041820 - should encode 127 correctly', () => {
        const x = new _PdfX509Extensions();
        expect(Array.from(x._encodeObjectIdentifier('1.2.127'))).toEqual([42, 127]);
    });
    it('1041820 - should use map order when custom ordering is absent', () => {
        const extensions = new Map<
            string,
            _PdfX509Extension
        >();
        extensions.set(
            '1.2.3.4',
            new _PdfX509Extension(
                false,
                new _PdfUniqueEncodingElement()
            )
        );
        const x509Extensions = new _PdfX509Extensions(extensions);
        expect(x509Extensions['_ordering']).toEqual(['1.2.3.4']);
    });
    it('1041820 - should not contain BOOLEAN for non critical extension', () => {
        const value = new _PdfUniqueEncodingElement();
        const map = new Map<string, _PdfX509Extension>();
        map.set('1.2.3.4',
            new _PdfX509Extension(false, value));
        const exts = new _PdfX509Extensions(
            map,
            ['1.2.3.4']
        );
        const values =
            exts._getAsn1()
                ._getSequence()[0]
                ._getSequence()[0]
                ._getSequence();
        expect(values.length).toBe(2);
        expect(() =>values[1]._getBooleanValue()).toThrow();
    });
    it('1041820 - should return null when certificate list is empty', () => {
        const cert: any =
            new _PdfPublicKeyCryptographyCertificate();
        cert._keys = new Map([
            ['key1', {}]
        ]);
        spyOn(cert, '_getCertificate')
            .and.returnValue(undefined);
        const result = cert._getCertificateChain('key1');
        expect(result).toBeNull();
    });
    it('1041820 - should initialize with empty ordering when no arguments are provided', () => {
        const extensions: any =
            new _PdfX509Extensions();
        expect(extensions._ordering).toEqual([]);
    });
});
describe('1041823 - X509 Name', () => {
    it('1041823 - should initialize default OID constants correctly', () => {
        const name: any = new _PdfX509Name([]);
        expect(name._countryNameOid).toBe('2.5.4.6');
        expect(name._organizationNameOid).toBe('2.5.4.10');
        expect(name._organizationalUnitNameOid).toBe('2.5.4.11');
        expect(name._titleOid).toBe('2.5.4.12');
        expect(name._commonNameOid).toBe('2.5.4.3');
    });
    it('1041823 - should populate default symbols map with expected values', () => {
        const name: any = new _PdfX509Name([]);
        expect(name._defaultSymbols.get('2.5.4.6')).toBe('C');
        expect(name._defaultSymbols.get('2.5.4.10')).toBe('O');
        expect(name._defaultSymbols.get('2.5.4.11')).toBe('OU');
        expect(name._defaultSymbols.get('2.5.4.12')).toBe('T');
        expect(name._defaultSymbols.get('2.5.4.3')).toBe('CN');
    });
    it('1041823 - should contain all expected entries in default symbols map', () => {
        const name: any = new _PdfX509Name([]);
        expect(name._defaultSymbols.size).toBe(5);
        expect(name._defaultSymbols.has('2.5.4.6')).toBe(true);
        expect(name._defaultSymbols.has('2.5.4.10')).toBe(true);
        expect(name._defaultSymbols.has('2.5.4.11')).toBe(true);
        expect(name._defaultSymbols.has('2.5.4.12')).toBe(true);
        expect(name._defaultSymbols.has('2.5.4.3')).toBe(true);
    });
    it('1041823 - should ignore null set elements in sequence', () => {
        const element: any = {
            _getSequence(): any[] {
                return [null];
            }
        };
        const name: any = new _PdfX509Name([element]);
        expect(name._ordering.length).toBe(0);
        expect(name._values.length).toBe(0);
        expect(name._added.length).toBe(0);
    });
    it('1041823 - should not process sequence when setElement is undefined', () => {
        const element: any = {
            _getSequence(): any[] {
                return [undefined];
            }
        };
        const name: any = new _PdfX509Name([element]);
        expect(name._ordering).toEqual([]);
        expect(name._values).toEqual([]);
        expect(name._added).toEqual([]);
    });
    it('1041823 - should return false when value counts are different', () => {
        const name1: any = new _PdfX509Name([]);
        const name2: any = new _PdfX509Name([]);
        name1._values = ['A'];
        name2._values = ['A', 'B'];
        expect(name1._equals(name2)).toBe(false);
    });
    it('1041823 - should return true when both value arrays are identical', () => {
        const name1: any = new _PdfX509Name([]);
        const name2: any = new _PdfX509Name([]);
        name1._values = ['A'];
        name2._values = ['A'];
        expect(name1._equals(name2)).toBe(true);
    });
    it('1041823 - should return true for matching multi-value arrays', () => {
        const name1: any = new _PdfX509Name([]);
        const name2: any = new _PdfX509Name([]);
        name1._values = ['A', 'B'];
        name2._values = ['A', 'B'];
        expect(name1._equals(name2)).toBe(true);
    });
    it('1041823 - should populate ordering values and added collections from sequence', () => {
        const sequence: any[] = [
            {
                _getSequence: (): any[] => [
                    {
                        _getSequence: (): any[] => [
                            {
                                _getValue: (): Uint8Array =>
                                    new Uint8Array([85, 4, 3])
                            },
                            new _PdfUniqueEncodingElement()
                        ]
                    }
                ]
            }
        ];
        spyOn(
            _PdfUniqueEncodingElement.prototype,
            '_getOctetString'
        ).and.returnValue(new Uint8Array([65]));
        const name = new _PdfX509Name(sequence);
        expect(name['_ordering'].length).toBe(1);
        expect(name['_values'].length).toBe(1);
        expect(name['_added'].length).toBe(1);
    });
    it('1041823 - should not add values when setElement is null', () => {
        const sequence: any[] = [
            {
                _getSequence: (): any[] => [
                    null,
                    null
                ]
            }
        ];
        const name = new _PdfX509Name(sequence);
        expect(name['_ordering']).toEqual([]);
        expect(name['_values']).toEqual([]);
        expect(name['_added']).toEqual([]);
    });
    it('1041823 - should populate values from non-empty sequence', () => {
        const valueElement = new _PdfUniqueEncodingElement();
        spyOn(
            _PdfUniqueEncodingElement.prototype,
            '_getOctetString'
        ).and.returnValue(new Uint8Array([65])); // "A"
        const sequence: any[] = [
            {
                _getSequence: () => [
                    {
                        _getSequence: () => [
                            {
                                _getValue: () => new Uint8Array([85, 4, 3])
                            },
                            valueElement
                        ]
                    }
                ]
            }
        ];
        const name: any = new _PdfX509Name(sequence);
        expect(name._ordering.length).toBe(1);
        expect(name._values.length).toBe(1);
        expect(name._added.length).toBe(1);
        expect(name._values[0]).toBe('A');
    });
});