import { _PdfAbstractSyntaxElement } from "../src/pdf/core/security/digital-signature/asn1/abstract-syntax";
import { _EncodingLength, _PdfBasicEncodingElement } from "../src/pdf/core/security/digital-signature/asn1/basic-encoding-element";
import { _ConstructionType, _RealEncodingBase, _TagClassType, _UniversalType } from "../src/pdf/core/security/digital-signature/asn1/enumerator";
import { _PdfObjectIdentifier } from "../src/pdf/core/security/digital-signature/asn1/identifier-mapping";
import { _PdfUniqueEncodingElement } from "../src/pdf/core/security/digital-signature/asn1/unique-encoding-element";
import { _PdfCertificate } from "../src/pdf/core/security/digital-signature/pdf-certificate";
import { _PdfAlgorithms } from "../src/pdf/core/security/digital-signature/x509/x509-algorithm";
import { _PdfUniqueBitString } from "../src/pdf/core/security/digital-signature/x509/x509-bit-string-handler";
import { _PdfX509Certificate, _PdfX509Certificates } from "../src/pdf/core/security/digital-signature/x509/x509-certificate";
import { _PdfPublicKeyInformation } from "../src/pdf/core/security/digital-signature/x509/x509-certificate-key";
import { _PdfX509CertificateParser } from "../src/pdf/core/security/digital-signature/x509/x509-certificate-parser";
import { _PdfX509CertificateStructure } from "../src/pdf/core/security/digital-signature/x509/x509-certificate-structure";
import { _PdfX509ExtensionBase, _PdfX509Extensions } from "../src/pdf/core/security/digital-signature/x509/x509-extensions";
import { _PdfSignedCertificate } from "../src/pdf/core/security/digital-signature/x509/x509-signed-certificate";
import { _PdfX509Time } from "../src/pdf/core/security/digital-signature/x509/x509-time";
import { _decode, _getBigInt, _stringToBytes } from "../src/pdf/core/utils";
import { certchain_1, pdf_pfx } from "./certificate-input.spec";
describe('Digital signature ASN1 parsing Test', () => {
    it('971516 - 1', () => {
        const pfxBytes: Uint8Array = new Uint8Array(_decode(pdf_pfx));
        const root = new _PdfUniqueEncodingElement();
        root._fromBytes(pfxBytes);
        const pfxSequence = root._getSequence() as _PdfUniqueEncodingElement[];
        expect(Array.isArray(pfxSequence)).toBe(true);
        expect(pfxSequence.length).toBeGreaterThan(2);
        expect(pfxSequence[0]._getTagNumber()).toBe(2);
        const contentInfo = pfxSequence[1];
        expect(contentInfo._getTagNumber()).toBe(16);
        const ciSeq = contentInfo._getSequence() as _PdfUniqueEncodingElement[];
        expect(Array.isArray(ciSeq)).toBe(true);
        expect(ciSeq.length).toBeGreaterThan(1);
        const contentTypeOid = ciSeq[0];
        expect(contentTypeOid._getTagNumber()).toBe(6);
        const dataOid = '1.2.840.113549.1.7.1';
        const oid = contentTypeOid._getObjectIdentifier().toString();
        expect(dataOid).toEqual(oid);
        const explicitWrapper = ciSeq[1];
        const innerElement = explicitWrapper._getSequence()[0];
        expect(innerElement._getValue().length).toEqual(1643);
        expect(ciSeq[1]._getTagNumber()).toEqual(0);
        const macData = pfxSequence[2];
        if (macData) {
            expect(macData._getTagNumber()).toBe(16);
            const macSeq = macData._getSequence() as _PdfUniqueEncodingElement[];
            expect(Array.isArray(macSeq)).toBe(true);
            expect(macSeq.length).toBeGreaterThan(1);
            const macDigest = macSeq[0];
            expect(macDigest._getTagNumber()).toBe(16);
            expect(macDigest._getValue()).toEqual(new Uint8Array([48, 7, 6, 5, 43, 14, 3, 2, 26, 4, 20, 211, 44, 55, 154, 28, 202, 175, 205, 139, 92, 113, 30, 31, 203, 229, 62, 134, 67, 173, 10]))
            const macDigestSeq = macDigest._getSequence() as _PdfUniqueEncodingElement[];
            expect(macDigestSeq[0]._getTagNumber()).toBe(16);
            const macAlgSeq = macDigestSeq[0]._getSequence() as _PdfUniqueEncodingElement[];
            expect(macAlgSeq[0]._getTagNumber()).toBe(6);
            expect(macAlgSeq[0]._getValue()).toEqual(new Uint8Array([43, 14, 3, 2, 26]));
            expect(macDigestSeq[1]._getTagNumber()).toBe(4);
            expect(macDigestSeq[1]._getValue().length).toBeGreaterThan(0);
            const macSalt = macSeq[1];
            expect(macSalt._getTagNumber()).toBe(4);
            expect((macSalt._getValue() as Uint8Array).length).toBeGreaterThan(0);
            expect(macSalt._getValue()).toEqual(new Uint8Array([61, 188, 179, 27, 4, 146, 17, 242, 3, 137, 187, 45, 134, 57, 253, 243, 250, 153, 238, 123]));
            if (macSeq.length > 2) {
                const iterations = macSeq[2];
                expect(iterations._getTagNumber()).toBe(2);
                expect(iterations._getValue() instanceof Uint8Array).toBe(true);
                expect(iterations._getValue()).toEqual(new Uint8Array([7, 208]));
            }
        }
    });
    it('971516 - 2', () => {
        const pfxBytes: Uint8Array = new Uint8Array(_decode(certchain_1));
        const root = new _PdfUniqueEncodingElement();
        root._fromBytes(pfxBytes);
        const pfxSequence = root._getSequence() as _PdfUniqueEncodingElement[];
        expect(Array.isArray(pfxSequence)).toBe(true);
        expect(pfxSequence.length).toBeGreaterThan(2);
        expect(pfxSequence[0]._getTagNumber()).toBe(2);
        const contentInfo = pfxSequence[1];
        expect(contentInfo._getTagNumber()).toBe(16);
        const ciSeq = contentInfo._getSequence() as _PdfUniqueEncodingElement[];
        expect(Array.isArray(ciSeq)).toBe(true);
        expect(ciSeq.length).toBeGreaterThan(1);
        const contentTypeOid = ciSeq[0];
        expect(contentTypeOid._getTagNumber()).toBe(6);
        const dataOid = '1.2.840.113549.1.7.1';
        const oid = contentTypeOid._getObjectIdentifier().toString();
        expect(dataOid).toEqual(oid);
        expect(ciSeq[1]._getValue().length).toEqual(3944);
        expect(ciSeq[1]._getTagNumber()).toEqual(0);
        const macData = pfxSequence[2];
        if (macData) {
            expect(macData._getTagNumber()).toBe(16);
            const macSeq = macData._getSequence() as _PdfUniqueEncodingElement[];
            expect(Array.isArray(macSeq)).toBe(true);
            expect(macSeq.length).toBeGreaterThan(1);
            const macDigest = macSeq[0];
            expect(macDigest._getTagNumber()).toBe(16);
            const macDigestSeq = macDigest._getSequence() as _PdfUniqueEncodingElement[];
            expect(macDigestSeq[0]._getTagNumber()).toBe(16);
            const macAlgSeq = macDigestSeq[0]._getSequence() as _PdfUniqueEncodingElement[];
            expect(macAlgSeq[0]._getTagNumber()).toBe(6);
            expect(macDigestSeq[1]._getTagNumber()).toBe(4);
            expect(macDigestSeq[1]._getValue().length).toBeGreaterThan(0);
            const macSalt = macSeq[1];
            expect(macSalt._getTagNumber()).toBe(4);
            expect((macSalt._getValue() as Uint8Array).length).toBeGreaterThan(0);
            if (macSeq.length > 2) {
                const iterations = macSeq[2];
                expect(iterations._getTagNumber()).toBe(2);
                expect(typeof iterations._getValue() === 'number' || iterations._getValue() instanceof Uint8Array).toBe(true);
            }
        }
    });
});
describe('849274 - Pdf certificate parsing Test', () => {
    it('849274 - 1', () => {
        let cert: _PdfCertificate = new _PdfCertificate(new Uint8Array(_decode(certchain_1)), 'moorthy');
        expect(cert._issuerName).toEqual('Syncfusion CA');
        expect(cert._subjectName).toEqual('Syncfusion CA');
        expect(cert._validFrom).toEqual(new Date('2025-05-28T18:05:52.000Z'));
        expect(cert._validTo).toEqual(new Date('2026-05-28T18:05:52.000Z'));
        expect(cert._version).toEqual(3);
        expect(cert._serialNumber).toEqual(new Uint8Array([52, 130, 0]).reverse())
        expect(cert._isPublicKeyCryptographyCertificate).toEqual(true);
        expect(cert._publicKeyCryptographyCertificate).toBeDefined();
        expect(cert._publicKeyCryptographyCertificate._keyCertificates.size).not.toEqual(0);
        expect(cert._publicKeyCryptographyCertificate._keyCertificates.get('3F5112B8AB5A8259DF3BC44DD40538CFAFA43F61')).toBeDefined();
        expect(cert._publicKeyCryptographyCertificate._chainCertificates.size).toEqual(2);
        const keycertificate: _PdfX509Certificates = cert._publicKeyCryptographyCertificate._keyCertificates.get('3F5112B8AB5A8259DF3BC44DD40538CFAFA43F61') as _PdfX509Certificates;
        const certificate: _PdfX509Certificate = keycertificate._certificate;
        const structure: _PdfX509CertificateStructure = certificate._structure;
        expect(structure._toBeSignedCertificate).toBeDefined();
        const tbscertificate = structure._toBeSignedCertificate;
        expect(tbscertificate._publicKeyInformation._publicKey._data.length).toEqual(270);
        expect(tbscertificate._publicKeyInformation._publicKey._data).toEqual(new Uint8Array([48, 130, 1, 10, 2, 130, 1, 1, 0, 216, 204, 221, 186, 222, 102, 165, 153, 199, 104, 186, 197, 103, 186, 189, 226, 104, 133, 94, 115, 190, 68, 220, 233, 121, 29, 83, 96, 220, 0, 199, 108, 183, 189, 240, 181, 201, 173, 55, 15, 110, 57, 110, 135, 6, 193, 135, 236, 101, 32, 62, 105, 6, 21, 58, 212, 61, 10, 48, 44, 121, 29, 196, 202, 196, 116, 239, 61, 46, 235, 119, 161, 18, 7, 193, 247, 192, 134, 49, 130, 64, 88, 219, 92, 209, 91, 248, 154, 238, 173, 65, 124, 6, 53, 157, 230, 132, 84, 150, 44, 50, 191, 77, 218, 242, 115, 255, 96, 235, 121, 126, 188, 153, 97, 193, 64, 59, 52, 139, 224, 136, 83, 18, 239, 151, 174, 23, 178, 2, 235, 88, 227, 31, 179, 239, 161, 210, 56, 94, 118, 188, 73, 172, 128, 90, 67, 79, 60, 92, 236, 178, 244, 118, 140, 212, 70, 170, 59, 191, 2, 114, 41, 26, 71, 82, 140, 47, 178, 118, 41, 183, 251, 181, 47, 154, 176, 241, 175, 214, 119, 235, 79, 20, 18, 221, 33, 172, 43, 185, 247, 35, 185, 20, 248, 2, 39, 38, 119, 31, 48, 133, 159, 76, 66, 234, 117, 27, 22, 139, 63, 162, 46, 30, 207, 239, 58, 216, 241, 98, 193, 220, 41, 182, 231, 110, 162, 115, 43, 167, 91, 180, 143, 102, 49, 30, 87, 49, 56, 31, 108, 229, 45, 52, 151, 191, 245, 94, 114, 248, 101, 87, 118, 141, 2, 58, 207, 2, 3, 1, 0, 1]));
    });
    it('849274 - 2', () => {
        let cert: _PdfCertificate = new _PdfCertificate(new Uint8Array(_decode(pdf_pfx)), 'syncfusion');
        expect(cert._issuerName).toEqual('Syncfusion');
        expect(cert._subjectName).toEqual('Syncfusion');
        expect(cert._validFrom).toEqual(new Date('2005-12-31T18:30:00.000Z'));
        expect(cert._validTo).toEqual(new Date('2019-12-31T18:30:00.000Z'));
        expect(cert._version).toEqual(3);
        expect(cert._serialNumber).toEqual(new Uint8Array([233, 17, 83, 97, 5, 219, 124, 68, 141, 165, 135, 165, 24, 125, 176, 208]).reverse())
        expect(cert._isPublicKeyCryptographyCertificate).toEqual(true);
        expect(cert._publicKeyCryptographyCertificate).toBeDefined();
        expect(cert._publicKeyCryptographyCertificate._keyCertificates.size).not.toEqual(0);
        expect(cert._publicKeyCryptographyCertificate._keyCertificates.get('01000000')).toBeDefined();
        const keycertificate: _PdfX509Certificates = cert._publicKeyCryptographyCertificate._keyCertificates.get('01000000') as _PdfX509Certificates;
        const certificate: _PdfX509Certificate = keycertificate._certificate;
        const structure: _PdfX509CertificateStructure = certificate._structure;
        expect(structure._toBeSignedCertificate).toBeDefined();
        const tbscertificate = structure._toBeSignedCertificate;
        expect(tbscertificate._publicKeyInformation._publicKey._data.length).toEqual(140);
        expect(tbscertificate._publicKeyInformation._publicKey._data).toEqual(new Uint8Array([48, 129, 137, 2, 129, 129, 0, 148, 42, 109, 37, 253, 231, 234, 188, 187, 17, 131, 161, 82, 142, 118, 149, 143, 181, 141, 159, 12, 103, 41, 100, 104, 247, 64, 234, 67, 162, 231, 241, 194, 12, 90, 146, 92, 51, 110, 19, 178, 181, 141, 95, 26, 56, 6, 87, 204, 16, 206, 158, 84, 57, 8, 74, 219, 34, 9, 8, 205, 51, 121, 16, 150, 254, 39, 18, 53, 223, 61, 227, 251, 91, 132, 26, 128, 228, 91, 204, 246, 223, 210, 189, 96, 189, 180, 199, 169, 182, 27, 51, 185, 35, 59, 80, 83, 35, 254, 26, 83, 118, 118, 180, 30, 247, 61, 219, 232, 92, 34, 24, 219, 108, 114, 96, 66, 41, 2, 232, 152, 45, 134, 25, 140, 71, 18, 183, 2, 3, 1, 0, 1]));
        expect(cert._publicKeyCryptographyCertificate._keys.get('PvkTmp:328d9a0a-b90e-4f62-b715-a2d79ecb2b1d')).toBeDefined();
    });
});
