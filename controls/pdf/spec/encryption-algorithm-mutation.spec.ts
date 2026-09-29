import { _PdfEncryptionAlgorithms } from "../src/pdf/core/security/digital-signature/signature/encryption-algorithm";
describe('1046124 _PdfEncryptionAlgorithms mutation', () => {
    it('1046124 - Should resolve all ECDSA OIDs', () => {
        const algorithms: any = new _PdfEncryptionAlgorithms();
        expect(algorithms._getAlgorithm('1.2.840.10045.4.1')).toBe('ECDSA');
        expect(algorithms._getAlgorithm('1.2.840.10045.4.3.1')).toBe('ECDSA');
        expect(algorithms._getAlgorithm('1.2.840.10045.4.3.2')).toBe('ECDSA');
        expect(algorithms._getAlgorithm('1.2.840.10045.4.3.3')).toBe('ECDSA');
        expect(algorithms._getAlgorithm('1.2.840.10045.4.3.4')).toBe('ECDSA');
    });
    it('1046124 - Should resolve all RSA OIDs', () => {
        const algorithms: any = new _PdfEncryptionAlgorithms();
        expect(algorithms._getAlgorithm('1.2.840.113549.1.1.11')).toBe('RSA');
        expect(algorithms._getAlgorithm('1.2.840.113549.1.1.12')).toBe('RSA');
        expect(algorithms._getAlgorithm('1.2.840.113549.1.1.13')).toBe('RSA');
        expect(algorithms._getAlgorithm('1.3.14.3.2.29')).toBe('RSA');
        expect(algorithms._getAlgorithm('1.3.36.3.3.1.2')).toBe('RSA');
        expect(algorithms._getAlgorithm('1.3.36.3.3.1.3')).toBe('RSA');
        expect(algorithms._getAlgorithm('1.3.36.3.3.1.4')).toBe('RSA');
    });
    it('1046124 - Should return expected algorithm names for known OIDs', () => {
        const algorithms: any = new _PdfEncryptionAlgorithms();
        expect(algorithms._getAlgorithm('1.2.840.113549.1.1.2')).toBe('RSA');
        expect(algorithms._getAlgorithm('1.2.840.113549.1.1.4')).toBe('RSA');
        expect(algorithms._getAlgorithm('1.2.840.113549.1.1.5')).toBe('RSA');
        expect(algorithms._getAlgorithm('1.2.840.113549.1.1.14')).toBe('RSA');
        expect(algorithms._getAlgorithm('1.2.840.10040.4.1')).toBe('DSA');
        expect(algorithms._getAlgorithm('1.2.840.10045.2.1')).toBe('ECDSA');
        expect(algorithms._getAlgorithm('1.2.643.2.2.19')).toBe('ECGOST3410');
        expect(algorithms._getAlgorithm('1.2.840.113549.1.1.10')).toBe('RSAandMGF1');
    });
    it('1046124 - Should resolve all known encryption algorithm OIDs', () => {
        const algorithms: any = new _PdfEncryptionAlgorithms();
        expect(algorithms._getAlgorithm('1.2.840.113549.1.1.11')).toBe('RSA');
        expect(algorithms._getAlgorithm('1.2.840.113549.1.1.12')).toBe('RSA');
        expect(algorithms._getAlgorithm('1.2.840.113549.1.1.13')).toBe('RSA');
        expect(algorithms._getAlgorithm('1.2.840.10040.4.3')).toBe('DSA');
        expect(algorithms._getAlgorithm('2.16.840.1.101.3.4.3.1')).toBe('DSA');
        expect(algorithms._getAlgorithm('2.16.840.1.101.3.4.3.2')).toBe('DSA');
        expect(algorithms._getAlgorithm('1.3.14.3.2.29')).toBe('RSA');
        expect(algorithms._getAlgorithm('1.3.36.3.3.1.2')).toBe('RSA');
        expect(algorithms._getAlgorithm('1.3.36.3.3.1.3')).toBe('RSA');
        expect(algorithms._getAlgorithm('1.3.36.3.3.1.4')).toBe('RSA');
        expect(algorithms._getAlgorithm('1.2.643.2.2.19')).toBe('ECGOST3410');
        expect(algorithms._getAlgorithm('1.2.840.113549.1.1.10')).toBe('RSAandMGF1');
        expect(algorithms._getAlgorithm('1.2.840.10045.2.1')).toBe('ECDSA');
        expect(algorithms._getAlgorithm('1.2.840.10045.4.1')).toBe('ECDSA');
        expect(algorithms._getAlgorithm('1.2.840.10045.4.3.1')).toBe('ECDSA');
        expect(algorithms._getAlgorithm('1.2.840.10045.4.3.2')).toBe('ECDSA');
        expect(algorithms._getAlgorithm('1.2.840.10045.4.3.3')).toBe('ECDSA');
        expect(algorithms._getAlgorithm('1.2.840.10045.4.3.4')).toBe('ECDSA');
    });
});