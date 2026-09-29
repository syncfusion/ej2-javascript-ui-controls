import { _PdfBigInt } from "../src/pdf/core/security/digital-signature/pdf-big-integer";
import { _PdfCertificate } from "../src/pdf/core/security/digital-signature/pdf-certificate";
import { _PdfCertificateIdentifier } from "../src/pdf/core/security/digital-signature/pdf-certificate-identifier";
import { _PdfCertificateTable } from "../src/pdf/core/security/digital-signature/pdf-certificate-table";
import { _PdfX509Certificate } from "../src/pdf/core/security/digital-signature/x509/x509-certificate";
import { _PdfX509Extensions } from "../src/pdf/core/security/digital-signature/x509/x509-extensions";
describe('1041521 - PdfCertificate', () => {
    it('1041521 - should load details from a real X509 certificate instance', () => {
        const signedCertificate = {
            _issuer: {
                _ordering: [{ toString: () => '2.5.4.3' }],
                _values: ['Issuer CN']
            },
            _subject: {
                _ordering: [{ toString: () => '2.5.4.3' }],
                _values: ['Subject CN']
            },
            _startDate: {
                _toDate: () => new Date('2024-01-01T00:00:00Z')
            },
            _endDate: {
                _toDate: () => new Date('2025-01-01T00:00:00Z')
            },
            _getVersion: () => 3,
            _serialNumber: new Uint8Array([9, 8, 7]),
            _extensions: new _PdfX509Extensions()
        };
        const structure = {
            _getSignedCertificate: () => signedCertificate
        } as any;
        const x509 = new _PdfX509Certificate(structure);
        const certificate = new _PdfCertificate(x509);
        expect(certificate._issuerName).toBe('Issuer CN');
        expect(certificate._subjectName).toBe('Subject CN');
        expect(certificate._version).toBe(3);
        expect(Array.from(certificate._serialNumber)).toEqual([9, 8, 7]);
        expect(certificate._isPublicKeyCryptographyCertificate).toBe(true);
    });
    it('1041521 - should resolve all mapped OID attributes', () => {
        const certificate = new _PdfCertificate(new Uint8Array([]));
        const name = {
            _ordering: [
                { toString: () => '2.5.4.6' },
                { toString: () => '2.5.4.7' },
                { toString: () => '2.5.4.8' },
                { toString: () => '2.5.4.10' }
            ],
            _values: [
                'US',
                'New York',
                'NY',
                'Syncfusion'
            ]
        } as any;
        expect(certificate._getUniqueAttributes(name, 'C')).toBe('US');
        expect(certificate._getUniqueAttributes(name, 'L')).toBe('New York');
        expect(certificate._getUniqueAttributes(name, 'ST')).toBe('NY');
        expect(certificate._getUniqueAttributes(name, 'O')).toBe('Syncfusion');
    });
});
describe('1041511 - Pdf Certificate Identifier', () => {
    it('1041511 - should not initialize identifier when no parameters are supplied', () => {
        const identifier = new _PdfCertificateIdentifier({});
        expect(identifier._identifier).toBeUndefined();
    });
    it('1041511 - should return false for identifiers with different lengths', () => {
        const a = new _PdfCertificateIdentifier({ id: new Uint8Array([1, 2, 3]) });
        const b = new _PdfCertificateIdentifier({ id: new Uint8Array([1, 2]) });
        expect(a.equals(b)).toBe(false);
    });
    it('1041511 - should return true for matching identifiers', () => {
        const a = new _PdfCertificateIdentifier({ id: new Uint8Array([1, 2, 3]) });
        const b = new _PdfCertificateIdentifier({ id: new Uint8Array([1, 2, 3]) });
        expect(a.equals(b)).toBe(true);
    });
});
describe('1041508 - PdfBigInteger', () => {
    it('1041508 - should default to zero when constructed without a value', () => {
        const value = new _PdfBigInt();
        expect(value._toString()).toBe('0');
        expect(value._bitLength()).toBe(0);
    });
    it('1041508 - should parse decimal digits correctly', () => {
        const value = new _PdfBigInt('12345');
        expect(value._toString()).toBe('12345');
    });
    it('1041508 - should not mutate internal state when converting to bigint', () => {
        const value = new _PdfBigInt('12345');
        value._toBigInt();
        expect(value._toString()).toBe('12345');
    });
    it('1041508 - should preserve embedded zeros during bigint conversion', () => {
        const value = new _PdfBigInt('1002');
        expect(value._toBigInt().toString()).toBe('1002');
    });
    it('1041508 - should remove all leading zeros during bigint conversion', () => {
        const value = new _PdfBigInt('000123');
        expect(value._toBigInt().toString()).toBe('123');
    });
    it('1041508 - should convert zero value to bigint zero', () => {
        const value = new _PdfBigInt('0');
        expect(value._toBigInt().toString()).toBe('0');
    });
    it('1041508 - should add values to an existing bigint', () => {
        const value = new _PdfBigInt('123');
        value._add(1);
        expect(value._toString()).toBe('124');
    });
});
describe('1041518 - PdfCertificate Table', () => {
    it('1041518  - should return null for a missing key', () => {
        const table = new _PdfCertificateTable();
        table._setValue('Issuer', 'value');
        expect(table._get('Subject')).toBeNull();
    });
    it('1041518  - should preserve existing entries when adding a different key', () => {
        const table = new _PdfCertificateTable();
        table._setValue('Issuer', 'issuer-value');
        table._setValue('Subject', 'subject-value');
        expect(table._get('Issuer')).toBe('issuer-value');
        expect(table._get('Subject')).toBe('subject-value');
    });
});