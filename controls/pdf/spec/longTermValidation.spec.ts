
import { _PdfBaseStream } from '../src/pdf/core/base-stream';
import { CryptographicStandard, DigestAlgorithm, RevocationType } from '../src/pdf/core/enumerator';
import { PdfSignatureField } from '../src/pdf/core/form/field';
import { PdfDocument } from '../src/pdf/core/pdf-document';
import { PdfPage } from '../src/pdf/core/pdf-page';
import { _PdfDictionary, _PdfReference } from '../src/pdf/core/pdf-primitives';
import { _PdfAbstractSyntaxElement } from '../src/pdf/core/security/digital-signature/asn1/abstract-syntax';
import { _ConstructionType, _TagClassType, _UniversalType } from '../src/pdf/core/security/digital-signature/asn1/enumerator';
import { _PdfObjectIdentifier } from '../src/pdf/core/security/digital-signature/asn1/identifier-mapping';
import { _PdfUniqueEncodingElement } from '../src/pdf/core/security/digital-signature/asn1/unique-encoding-element';
import { _PdfCertificateIdentity, _PdfCertificateIdentityHelper } from '../src/pdf/core/security/digital-signature/ocsp/certificate-identity';
import { _PdfCertificateUtility, _PdfSubjectKeyID } from '../src/pdf/core/security/digital-signature/ocsp/certificate-utils';
import { _PdfOcsp, _PdfOcspTag } from '../src/pdf/core/security/digital-signature/ocsp/ocsp-client';
import { _PdfOcspRequestCreator, _PdfRequestCreatorHelper, _PdfRevocationListRequest, _PdfRevocationRequest } from '../src/pdf/core/security/digital-signature/ocsp/ocsp-request';
import { _PdfOcspResponseHelper, _PdfResponseInformation, _PdfRevocationResponseBytes, _PdfRevocationResponseIdentifier } from '../src/pdf/core/security/digital-signature/ocsp/ocsp-response';
import { _PdfOcspStatus, _PdfOneTimeResponseHelper } from '../src/pdf/core/security/digital-signature/ocsp/ocsp-response-model';
import { _PdfGeneralizedTime, _PdfOcspHelper } from '../src/pdf/core/security/digital-signature/ocsp/ocsp-response-utils';
import { _PdfRevocationDistribution, _PdfRevocationDistributionType, _PdfRevocationList, _PdfRevocationName, _PdfRevocationPointList } from '../src/pdf/core/security/digital-signature/ocsp/revocation';
import { PdfSignature } from '../src/pdf/core/security/digital-signature/signature/pdf-signature';
import { PdfSignatureOptions } from '../src/pdf/core/security/digital-signature/signature/signature-properties';
import { _PdfAlgorithms } from '../src/pdf/core/security/digital-signature/x509/x509-algorithm';
import { _PdfUniqueBitString } from '../src/pdf/core/security/digital-signature/x509/x509-bit-string-handler';
import { _PdfX509Certificate } from '../src/pdf/core/security/digital-signature/x509/x509-certificate';
import { _PdfPublicKeyInformation } from '../src/pdf/core/security/digital-signature/x509/x509-certificate-key';
import { _PdfX509Extensions } from '../src/pdf/core/security/digital-signature/x509/x509-extensions';
import { _Sha1 } from '../src/pdf/core/security/encryptors/secureHash-algorithm1';
import { _decode, _encode, _hexStringToByteArray } from '../src/pdf/core/utils';
import { certchain1, EJDOTNETCORE3040, EJDOTNETCORE_4693 } from './inputs.spec';
import { certain1Cert1, certain1Cert2, certain1Pfx, EJDOTNETCORE3040Crl, EJDOTNETCORE3040Pfx, EJDOTNETCORE_4693Crl, EJDOTNETCORE_4693Pfx, externalSign, externalSign1, ltv_10_crl, ltv_10_ocsp, ltv_11_crl, ltv_11_ocsp, ltv_12_crl, ltv_12_ocsp, ltv_13_crl, ltv_13_ocsp, ltv_14_crl, ltv_14_ocsp, ltv_15_ocsp, ltv_16_ocsp, ltv_17_crl, ltv_18_crl, ltv_18_ocsp, ltv_19_crl, ltv_19_ocsp, ltv_1_crl, ltv_1_ocsp, ltv_20_crl_sig1, ltv_20_crl_sig2, ltv_20_ocsp_sig1, ltv_20_ocsp_sig2, ltv_2_crl, ltv_2_ocsp, ltv_3_Crl, ltv_3_ocsp, ltv_4_crl, ltv_4_ocsp, ltv_5_crl, ltv_5_ocsp, ltv_7_crl, ltv_7_ocsp, ltv_8_crl, ltv_8_ocsp, pdf, publicCert1, publicCert2 } from './longTermValidation-inputs.spec';
describe('966967 - Long Term Validation Support', () => {
    function externalSignatureCallback(
        data: Uint8Array,
        options: {
            algorithm: DigestAlgorithm,
            cryptographicStandard: CryptographicStandard
        }
    ): {signedData: Uint8Array, timestampData?: Uint8Array} {
        expect(data).toBeDefined();
        return { signedData: _hexStringToByteArray(externalSign) as Uint8Array };
    }
    function externalSignatureCallback1(
        data: Uint8Array,
        options: {
            algorithm: DigestAlgorithm,
            cryptographicStandard: CryptographicStandard
        }
    ): {signedData: Uint8Array, timestampData?: Uint8Array} {
        expect(data).toBeDefined();
        return { signedData: _hexStringToByteArray(externalSign1) as Uint8Array };
    }
    let signedHash: Uint8Array;
    function externalSignatureCallback2(
        data: Uint8Array,
        options: {
            algorithm: DigestAlgorithm,
            cryptographicStandard: CryptographicStandard
        }
    ): void {
        expect(data).toBeDefined();
        signedHash = _hexStringToByteArray(externalSign1) as Uint8Array;
    }
    async function longTermValidationCallback1(url: string, requestbytes?: Uint8Array): Promise<{ response: Uint8Array }> {
        const kind: 'OCSP' | 'CRL' = requestbytes ? 'OCSP' : 'CRL';
        try {
            let response: Uint8Array;
            if (kind === 'OCSP') {
                response = _decode(ltv_1_ocsp) as Uint8Array;
            } else {
                response = _decode(ltv_1_crl) as Uint8Array;
            }
            return { response: new Uint8Array(response) };
        } catch (error) {
            return { response: new Uint8Array([]) };
        }
    }
    async function longTermValidationCallback2(url: string, requestbytes?: Uint8Array): Promise<{ response: Uint8Array }> {
        const kind: 'OCSP' | 'CRL' = requestbytes ? 'OCSP' : 'CRL';
        try {
            let response: Uint8Array;
            if (kind === 'OCSP') {
                response = _decode(ltv_2_ocsp) as Uint8Array;
            } else {
                response = _decode(ltv_2_crl) as Uint8Array;
            }
            return { response: new Uint8Array(response) };
        } catch (error) {
            return { response: new Uint8Array([]) };
        }
    }
    async function longTermValidationCallback3(url: string, requestbytes?: Uint8Array): Promise<{ response: Uint8Array }> {
        const kind: 'OCSP' | 'CRL' = requestbytes ? 'OCSP' : 'CRL';
        try {
            let response: Uint8Array;
            if (kind === 'OCSP') {
                response = _decode(ltv_3_ocsp) as Uint8Array;
            } else {
                response = _decode(ltv_3_Crl) as Uint8Array;
            }
            return { response: new Uint8Array(response) };
        } catch (error) {
            return { response: new Uint8Array([]) };
        }
    }
    async function longTermValidationCallback4(url: string, requestbytes?: Uint8Array): Promise<{ response: Uint8Array }> {
        const kind: 'OCSP' | 'CRL' = requestbytes ? 'OCSP' : 'CRL';
        try {
            let response: Uint8Array;
            if (kind === 'OCSP') {
                response = _decode(ltv_4_ocsp) as Uint8Array;
            } else {
                response = _decode(ltv_4_crl) as Uint8Array;
            }
            return { response: new Uint8Array(response) };
        } catch (error) {
            return { response: new Uint8Array([]) };
        }
    }
    async function longTermValidationCallback5(url: string, requestbytes?: Uint8Array): Promise<{ response: Uint8Array }> {
        const kind: 'OCSP' | 'CRL' = requestbytes ? 'OCSP' : 'CRL';
        try {
            let response: Uint8Array;
            if (kind === 'OCSP') {
                response = _decode(ltv_5_ocsp) as Uint8Array;
            } else {
                response = _decode(ltv_5_crl) as Uint8Array;
            }
            return { response: new Uint8Array(response) };
        } catch (error) {
            return { response: new Uint8Array([]) };
        }
    }
    async function longTermValidationCallback7(url: string, requestbytes?: Uint8Array): Promise<{ response: Uint8Array }> {
        const kind: 'OCSP' | 'CRL' = requestbytes ? 'OCSP' : 'CRL';
        try {
            let response: Uint8Array;
            if (kind === 'OCSP') {
                response = _decode(ltv_7_ocsp) as Uint8Array;
            } else {
                response = _decode(ltv_7_crl) as Uint8Array;
            }
            return { response: new Uint8Array(response) };
        } catch (error) {
            return { response: new Uint8Array([]) };
        }
    }
    async function longTermValidationCallback8(url: string, requestbytes?: Uint8Array): Promise<{ response: Uint8Array }> {
        const kind: 'OCSP' | 'CRL' = requestbytes ? 'OCSP' : 'CRL';
        try {
            let response: Uint8Array;
            if (kind === 'OCSP') {
                response = _decode(ltv_8_ocsp) as Uint8Array;
            } else {
                response = _decode(ltv_8_crl) as Uint8Array;
            }
            return { response: new Uint8Array(response) };
        } catch (error) {
            return { response: new Uint8Array([]) };
        }
    }
    async function longTermValidationCallback10(url: string, requestbytes?: Uint8Array): Promise<{ response: Uint8Array }> {
        const kind: 'OCSP' | 'CRL' = requestbytes ? 'OCSP' : 'CRL';
        try {
            let response: Uint8Array;
            if (kind === 'OCSP') {
                response = _decode(ltv_10_ocsp) as Uint8Array;
            } else {
                response = _decode(ltv_10_crl) as Uint8Array;
            }
            return { response: new Uint8Array(response) };
        } catch (error) {
            return { response: new Uint8Array([]) };
        }
    }
    async function longTermValidationCallback11(url: string, requestbytes?: Uint8Array): Promise<{ response: Uint8Array }> {
        const kind: 'OCSP' | 'CRL' = requestbytes ? 'OCSP' : 'CRL';
        try {
            let response: Uint8Array;
            if (kind === 'OCSP') {
                response = _decode(ltv_11_ocsp) as Uint8Array;
            } else {
                response = _decode(ltv_11_crl) as Uint8Array;
            }
            return { response: new Uint8Array(response) };
        } catch (error) {
            return { response: new Uint8Array([]) };
        }
    }
    async function longTermValidationCallback12(url: string, requestbytes?: Uint8Array): Promise<{ response: Uint8Array }> {
        const kind: 'OCSP' | 'CRL' = requestbytes ? 'OCSP' : 'CRL';
        try {
            let response: Uint8Array;
            if (kind === 'OCSP') {
                response = _decode(ltv_12_ocsp) as Uint8Array;
            } else {
                response = _decode(ltv_12_crl) as Uint8Array;
            }
            return { response: new Uint8Array(response) };
        } catch (error) {
            return { response: new Uint8Array([]) };
        }
    }
    async function longTermValidationCallback13(url: string, requestbytes?: Uint8Array): Promise<{ response: Uint8Array }> {
        const kind: 'OCSP' | 'CRL' = requestbytes ? 'OCSP' : 'CRL';
        try {
            let response: Uint8Array;
            if (kind === 'OCSP') {
                response = _decode(ltv_13_ocsp) as Uint8Array;
            } else {
                response = _decode(ltv_13_crl) as Uint8Array;
            }
            return { response: new Uint8Array(response) };
        } catch (error) {
            return { response: new Uint8Array([]) };
        }
    }
     async function longTermValidationCallback14(url: string, requestbytes?: Uint8Array): Promise<{ response: Uint8Array }> {
        const kind: 'OCSP' | 'CRL' = requestbytes ? 'OCSP' : 'CRL';
        try {
            let response: Uint8Array;
            if (kind === 'OCSP') {
                response = _decode(ltv_14_ocsp) as Uint8Array;
            } else {
                response = _decode(ltv_14_crl) as Uint8Array;
            }
            return { response: new Uint8Array(response) };
        } catch (error) {
            return { response: new Uint8Array([]) };
        }
    }
     async function longTermValidationCallback15(url: string, requestbytes?: Uint8Array): Promise<{ response: Uint8Array }> {
        const kind: 'OCSP' | 'CRL' = requestbytes ? 'OCSP' : 'CRL';
        try {
            let response: Uint8Array;
            if (kind === 'OCSP') {
                response = _decode(ltv_15_ocsp) as Uint8Array;
            }
            return { response: new Uint8Array(response) };
        } catch (error) {
            return { response: new Uint8Array([]) };
        }
    }
     async function longTermValidationCallback16(url: string, requestbytes?: Uint8Array): Promise<{ response: Uint8Array }> {
        const kind: 'OCSP' | 'CRL' = requestbytes ? 'OCSP' : 'CRL';
        try {
            let response: Uint8Array;
            if (kind === 'OCSP') {
                response = _decode(ltv_16_ocsp) as Uint8Array;
            }
            return { response: new Uint8Array(response) };
        } catch (error) {
            return { response: new Uint8Array([]) };
        }
    }
     async function longTermValidationCallback17(url: string, requestbytes?: Uint8Array): Promise<{ response: Uint8Array }> {
        const kind: 'OCSP' | 'CRL' = requestbytes ? 'OCSP' : 'CRL';
        try {
            let response: Uint8Array;
            if (kind === 'CRL') {
                response = _decode(ltv_17_crl) as Uint8Array;
            }
            return { response: new Uint8Array(response) };
        } catch (error) {
            return { response: new Uint8Array([]) };
        }
    }
    async function longTermValidationCallback18(url: string, requestbytes?: Uint8Array): Promise<{ response: Uint8Array }> {
        const kind: 'OCSP' | 'CRL' = requestbytes ? 'OCSP' : 'CRL';
        try {
            let response: Uint8Array;
            if (kind === 'CRL') {
                response = _decode(ltv_18_crl) as Uint8Array;
            } else if (kind === 'OCSP') {
                response = _decode(ltv_18_ocsp) as Uint8Array;
            }
            return { response: new Uint8Array(response) };
        } catch (error) {
            return { response: new Uint8Array([]) };
        }
    }
    async function longTermValidationCallback19(url: string, requestbytes?: Uint8Array): Promise<{ response: Uint8Array }> {
        const kind: 'OCSP' | 'CRL' = requestbytes ? 'OCSP' : 'CRL';
        try {
            let response: Uint8Array;
            if (kind === 'CRL') {
                response = _decode(ltv_19_crl) as Uint8Array;
            } else if (kind === 'OCSP') {
                response = _decode(ltv_19_ocsp) as Uint8Array;
            }
            return { response: new Uint8Array(response) };
        } catch (error) {
            return { response: new Uint8Array([]) };
        }
    }
    async function longTermValidationCallback20(url: string, requestbytes?: Uint8Array): Promise<{ response: Uint8Array }> {
        const kind: 'OCSP' | 'CRL' = requestbytes ? 'OCSP' : 'CRL';
        try {
            let response: Uint8Array;
            if (kind === 'CRL') {
                response = _decode(ltv_20_crl_sig1) as Uint8Array;
            } else if (kind === 'OCSP') {
                response = _decode(ltv_20_ocsp_sig1) as Uint8Array;
            }
            return { response: new Uint8Array(response) };
        } catch (error) {
            return { response: new Uint8Array([]) };
        }
    }
    async function longTermValidationCallback21(url: string, requestbytes?: Uint8Array): Promise<{ response: Uint8Array }> {
        const kind: 'OCSP' | 'CRL' = requestbytes ? 'OCSP' : 'CRL';
        try {
            let response: Uint8Array;
            if (kind === 'CRL') {
                response = _decode(ltv_20_crl_sig2) as Uint8Array;
            } else if (kind === 'OCSP') {
                response = _decode(ltv_20_ocsp_sig2) as Uint8Array;
            }
            return { response: new Uint8Array(response) };
        } catch (error) {
            return { response: new Uint8Array([]) };
        }
    }
    it('loaded document - certchain 1', async () => {
        let document: PdfDocument = new PdfDocument(certchain1);
        expect(document.pageCount).toEqual(1);
        expect(document.form.count).toEqual(1);
        let field: PdfSignatureField = document.form.fieldAt(0) as PdfSignatureField;
        let sign: PdfSignature = field.getSignature();
        const enabled: boolean = await sign.enableLTV(longTermValidationCallback1);
        expect(enabled).toBeTruthy();
        document.save();
        document.destroy();
    });
    it('new document - certchain 1', async () => {
        let document: PdfDocument = new PdfDocument();
        let page: PdfPage = document.addPage();
        let field: PdfSignatureField = new PdfSignatureField(page, 'field', { x: 50, y: 50, width: 100, height: 100 });
        const certData = certain1Pfx;
        const password = 'moorthy';
        const sign: PdfSignature = PdfSignature.create(
            certData,
            password,
            {
                cryptographicStandard: CryptographicStandard.cms,
                digestAlgorithm: DigestAlgorithm.sha256,
                contactInfo: 'johndoe@owned.us',
                locationInfo: 'Honolulu, Hawaii',
                reason: 'I am author of this document.',
                signedName: 'Signature',
            }
        );
        document.form.add(field);
        field.setSignature(sign);
        let enabled: boolean = await sign.enableLTV(longTermValidationCallback2);
        expect(enabled).toBeTruthy();
        let data = document.save();
        document.destroy();
        document = new PdfDocument(data);
        expect(document.getPage(0).annotations.count).toEqual(0);
        expect(document.form.count).toEqual(1);
        expect(document.pageCount).toEqual(1);
        let catalog: _PdfDictionary = document._catalog._catalogDictionary;
        expect(catalog.has('DSS')).toBeTruthy();
        let dssEntry: _PdfDictionary = catalog.get('DSS');
        expect(dssEntry.has('OCSPs')).toBeTruthy();
        expect(dssEntry.has('CRLs')).toBeTruthy();
        expect(dssEntry.has('VRI')).toBeTruthy();
        let ocspsEntry: _PdfReference[] = dssEntry.get('OCSPs') as [];
        expect(ocspsEntry.length).toEqual(1);
        expect(ocspsEntry[0] instanceof _PdfReference).toBeTruthy();
        let stream = document._crossReference._fetch(ocspsEntry[0]);
        expect(stream instanceof _PdfBaseStream).toBeTruthy();
        expect(stream.getBytes().length).toBeGreaterThan(0);
        let crlsEntry: _PdfReference[] = dssEntry.get('CRLs') as [];
        expect(crlsEntry.length).toEqual(1);
        expect(crlsEntry[0] instanceof _PdfReference).toBeTruthy();
        stream = document._crossReference._fetch(crlsEntry[0]);
        const crlData: Uint8Array = stream.getBytes();
        expect(crlData.length).toEqual(476);
        let expected: Uint8Array = _decode(ltv_2_crl) as Uint8Array;
        expect(crlData.length).toEqual(expected.length);
        expect(crlData.every((val, i) => val === expected[i])).toBeTruthy();
        let vriEntry: _PdfDictionary = dssEntry.get('VRI');
        vriEntry.forEach((key: any, value: any) => {
            let ref: _PdfReference = vriEntry.getRaw(key);
            let dic: _PdfDictionary = document._crossReference._fetch(ref);
            expect(dic.has('OCSP')).toBeTruthy();
            expect(dic.has('CRL')).toBeTruthy();
        });
        document.destroy();
    });
    it('loaded document - Empty', async () => {
        let document: PdfDocument = new PdfDocument();
        document.addPage();
        let data = document.save();
        document.destroy();
        document = new PdfDocument(data);
        let page: PdfPage = document.addPage();
        let field: PdfSignatureField = new PdfSignatureField(page, 'field', { x: 50, y: 50, width: 100, height: 100 });
        const certData = certain1Pfx;
        const password = 'moorthy';
        let sign: PdfSignature = PdfSignature.create(
            certData,
            password,
            {
                cryptographicStandard: CryptographicStandard.cms,
                digestAlgorithm: DigestAlgorithm.sha256,
                contactInfo: 'johndoe@owned.us',
                locationInfo: 'Honolulu, Hawaii',
                reason: 'I am author of this document.',
                signedName: 'Signature',
            }
        );
        document.form.add(field);
        field.setSignature(sign);
        await sign.enableLTV(longTermValidationCallback3);
        data = document.save();
        document.destroy();
        document = new PdfDocument(data);
        expect(document.getPage(0).annotations.count).toEqual(0);
        expect(document.form.count).toEqual(1);
        expect(document.pageCount).toEqual(2);
        let catalog: _PdfDictionary = document._catalog._catalogDictionary;
        expect(catalog.has('DSS')).toBeTruthy();
        let dssEntry: _PdfDictionary = catalog.get('DSS');
        expect(dssEntry.has('OCSPs')).toBeTruthy();
        expect(dssEntry.has('CRLs')).toBeTruthy();
        expect(dssEntry.has('VRI')).toBeTruthy();
        let ocspsEntry: _PdfReference[] = dssEntry.get('OCSPs') as [];
        expect(ocspsEntry.length).toEqual(1);
        expect(ocspsEntry[0] instanceof _PdfReference).toBeTruthy();
        let stream = document._crossReference._fetch(ocspsEntry[0]);
        expect(stream instanceof _PdfBaseStream).toBeTruthy();
        expect(stream.getBytes().length).toBeGreaterThan(0);
        let crlsEntry: _PdfReference[] = dssEntry.get('CRLs') as [];
        expect(crlsEntry.length).toEqual(1);
        expect(crlsEntry[0] instanceof _PdfReference).toBeTruthy();
        stream = document._crossReference._fetch(crlsEntry[0]);
        const crlData: Uint8Array = stream.getBytes();
        expect(crlData.length).toEqual(476);
        let expected: Uint8Array = _decode(ltv_3_Crl) as Uint8Array;
        expect(crlData.length).toEqual(expected.length);
        expect(crlData.every((val, i) => val === expected[i])).toBeTruthy();
        let vriEntry: _PdfDictionary = dssEntry.get('VRI');
        vriEntry.forEach((key: any, value: any) => {
            let ref: _PdfReference = vriEntry.getRaw(key);
            let dic: _PdfDictionary = document._crossReference._fetch(ref);
            expect(dic.has('OCSP')).toBeTruthy();
            expect(dic.has('CRL')).toBeTruthy();
        });
        document.destroy();
    });
     it('new document - different signature properties', async () => {
        let document: PdfDocument = new PdfDocument();
        let page: PdfPage = document.addPage();
        let field: PdfSignatureField = new PdfSignatureField(page, 'field', { x: 50, y: 50, width: 100, height: 100 });
        const certData = certain1Pfx;
        const password = 'moorthy';
        const sign: PdfSignature = PdfSignature.create(
            certData,
            password,
            {
                cryptographicStandard: CryptographicStandard.cades,
                digestAlgorithm: DigestAlgorithm.sha1,
                contactInfo: 'johndoe@owned.us',
                locationInfo: 'Honolulu, Hawaii',
                reason: 'I am author of this document.',
                signedName: 'Signature',
                isLocked: true
            }
        );
        document.form.add(field);
        field.setSignature(sign);
        await sign.enableLTV(longTermValidationCallback4);
        let data = document.save();
        document = new PdfDocument(data);
        expect(document.getPage(0).annotations.count).toEqual(0);
        expect(document.form.count).toEqual(1);
        expect(document.pageCount).toEqual(1);
        let catalog: _PdfDictionary = document._catalog._catalogDictionary;
        expect(catalog.has('DSS')).toBeTruthy();
        let dssEntry: _PdfDictionary = catalog.get('DSS');
        expect(dssEntry.has('OCSPs')).toBeTruthy();
        expect(dssEntry.has('CRLs')).toBeTruthy();
        expect(dssEntry.has('VRI')).toBeTruthy();
        let ocspsEntry: _PdfReference[] = dssEntry.get('OCSPs') as [];
        expect(ocspsEntry.length).toEqual(1);
        expect(ocspsEntry[0] instanceof _PdfReference).toBeTruthy();
        let stream = document._crossReference._fetch(ocspsEntry[0]);
        expect(stream instanceof _PdfBaseStream).toBeTruthy();
        expect(stream.getBytes().length).toBeGreaterThan(0);
        let crlsEntry: _PdfReference[] = dssEntry.get('CRLs') as [];
        expect(crlsEntry.length).toEqual(1);
        expect(crlsEntry[0] instanceof _PdfReference).toBeTruthy();
        stream = document._crossReference._fetch(crlsEntry[0]);
        const crlData: Uint8Array = stream.getBytes();
        expect(crlData.length).toEqual(476);
        let expected: Uint8Array = _decode(ltv_4_crl) as Uint8Array;
        expect(crlData.length).toEqual(expected.length);
        expect(crlData.every((val, i) => val === expected[i])).toBeTruthy();
        let vriEntry: _PdfDictionary = dssEntry.get('VRI');
        vriEntry.forEach((key: any, value: any) => {
            let ref: _PdfReference = vriEntry.getRaw(key);
            let dic: _PdfDictionary = document._crossReference._fetch(ref);
            expect(dic.has('OCSP')).toBeTruthy();
            expect(dic.has('CRL')).toBeTruthy();
        });
        document.destroy();
    });
    it('loaded document (Empty) - different singature properties', async () => {
        let document: PdfDocument = new PdfDocument();
        document.addPage();
        let data = document.save();
        document.destroy();
        document = new PdfDocument(data);
        let page: PdfPage = document.addPage();
        let field: PdfSignatureField = new PdfSignatureField(page, 'field', { x: 50, y: 50, width: 100, height: 100 });
        const certData = certain1Pfx;
        const password = 'moorthy';
        let sign: PdfSignature = PdfSignature.create(
            certData,
            password,
            {
                cryptographicStandard: CryptographicStandard.cades,
                digestAlgorithm: DigestAlgorithm.sha1,
                contactInfo: 'johndoe@owned.us',
                locationInfo: 'Honolulu, Hawaii',
                reason: 'I am author of this document.',
                signedName: 'Signature',
                isLocked: true
            }
        );
        document.form.add(field);
        field.setSignature(sign);
        await sign.enableLTV(longTermValidationCallback5);
        data = document.save();
        document.destroy();
        document = new PdfDocument(data);
        expect(document.getPage(0).annotations.count).toEqual(0);
        expect(document.form.count).toEqual(1);
        expect(document.pageCount).toEqual(2);
        let catalog: _PdfDictionary = document._catalog._catalogDictionary;
        expect(catalog.has('DSS')).toBeTruthy();
        let dssEntry: _PdfDictionary = catalog.get('DSS');
        expect(dssEntry.has('OCSPs')).toBeTruthy();
        expect(dssEntry.has('CRLs')).toBeTruthy();
        expect(dssEntry.has('VRI')).toBeTruthy();
        let ocspsEntry: _PdfReference[] = dssEntry.get('OCSPs') as [];
        expect(ocspsEntry.length).toEqual(1);
        expect(ocspsEntry[0] instanceof _PdfReference).toBeTruthy();
        let stream = document._crossReference._fetch(ocspsEntry[0]);
        expect(stream instanceof _PdfBaseStream).toBeTruthy();
        expect(stream.getBytes().length).toBeGreaterThan(0);
        let crlsEntry: _PdfReference[] = dssEntry.get('CRLs') as [];
        expect(crlsEntry.length).toEqual(1);
        expect(crlsEntry[0] instanceof _PdfReference).toBeTruthy();
        stream = document._crossReference._fetch(crlsEntry[0]);
        const crlData: Uint8Array = stream.getBytes();
        expect(crlData.length).toEqual(476);
        let expected: Uint8Array = _decode(ltv_5_crl) as Uint8Array;
        expect(crlData.length).toEqual(expected.length);
        expect(crlData.every((val, i) => val === expected[i])).toBeTruthy();
        let vriEntry: _PdfDictionary = dssEntry.get('VRI');
        vriEntry.forEach((key: any, value: any) => {
            let ref: _PdfReference = vriEntry.getRaw(key);
            let dic: _PdfDictionary = document._crossReference._fetch(ref);
            expect(dic.has('OCSP')).toBeTruthy();
            expect(dic.has('CRL')).toBeTruthy();
        });
        document.destroy();
    });
    it('new document - EJDOTNETCORE3040', async () => {
        let document: PdfDocument = new PdfDocument();
        let page: PdfPage = document.addPage();
        let field: PdfSignatureField = new PdfSignatureField(page, 'field', { x: 50, y: 50, width: 100, height: 100 });
        const certData = EJDOTNETCORE3040Pfx;
        const password = 'chinnu@123';
        const sign: PdfSignature = PdfSignature.create(
            certData,
            password,
            {
                cryptographicStandard: CryptographicStandard.cms,
                digestAlgorithm: DigestAlgorithm.sha256,
                contactInfo: 'johndoe@owned.us',
                locationInfo: 'Honolulu, Hawaii',
                reason: 'I am author of this document.',
                signedName: 'Signature',
            }
        );
        document.form.add(field);
        field.setSignature(sign);
        let enabled: boolean = await sign.enableLTV(longTermValidationCallback7);
        expect(enabled).toBeTruthy();
        let data = document.save();
        document.destroy();
        document = new PdfDocument(data);
        expect(document.getPage(0).annotations.count).toEqual(0);
        expect(document.form.count).toEqual(1);
        expect(document.pageCount).toEqual(1);
        let catalog: _PdfDictionary = document._catalog._catalogDictionary;
        expect(catalog.has('DSS')).toBeTruthy();
        let dssEntry: _PdfDictionary = catalog.get('DSS');
        expect(dssEntry.has('OCSPs')).toBeTruthy();
        expect(dssEntry.has('CRLs')).toBeTruthy();
        expect(dssEntry.has('VRI')).toBeTruthy();
        let ocspEntry: _PdfReference[] = dssEntry.get('OCSPs') as [];
        expect(ocspEntry.length).toEqual(0);
        let crlsEntry: _PdfReference[] = dssEntry.get('CRLs') as [];
        expect(crlsEntry.length).toBeGreaterThan(0);
        expect(crlsEntry[0] instanceof _PdfReference).toBeTruthy();
        let stream = document._crossReference._fetch(crlsEntry[0]);
        const crlData: Uint8Array = stream.getBytes();
        const out = _decode(ltv_7_crl) as Uint8Array
        expect(crlData.length).toEqual(out.length);
        let expected: Uint8Array = _hexStringToByteArray(EJDOTNETCORE3040Crl) as Uint8Array;
        expect(crlData.length).toEqual(expected.length);
        expect(crlData.every((val, i) => val === expected[i])).toBeTruthy();
        let vriEntry: _PdfDictionary = dssEntry.get('VRI');
        vriEntry.forEach((key: any, value: any) => {
            let ref: _PdfReference = vriEntry.getRaw(key);
            let dic: _PdfDictionary = document._crossReference._fetch(ref);
            expect(dic.has('OCSP')).toBeTruthy();
            expect(dic.has('CRL')).toBeTruthy();
        });
        document.destroy();
    });
    it('new document - EJDOTNETCORE_4693', async () => {
        let document: PdfDocument = new PdfDocument();
        let page: PdfPage = document.addPage();
        let field: PdfSignatureField = new PdfSignatureField(page, 'field', { x: 50, y: 50, width: 100, height: 100 });
        const certData = EJDOTNETCORE_4693Pfx;
        const password = 'moorthy';
        const sign: PdfSignature = PdfSignature.create(
            certData,
            password,
            {
                cryptographicStandard: CryptographicStandard.cms,
                digestAlgorithm: DigestAlgorithm.sha256,
                contactInfo: 'johndoe@owned.us',
                locationInfo: 'Honolulu, Hawaii',
                reason: 'I am author of this document.',
                signedName: 'Signature',
            }
        );
        document.form.add(field);
        field.setSignature(sign);
        let enabled: boolean = await sign.enableLTV(longTermValidationCallback8);
        expect(enabled).toBeTruthy();
        let data = document.save();
        document.destroy();
        document = new PdfDocument(data);
        expect(document.getPage(0).annotations.count).toEqual(0);
        expect(document.form.count).toEqual(1);
        expect(document.pageCount).toEqual(1);
        let catalog: _PdfDictionary = document._catalog._catalogDictionary;
        expect(catalog.has('DSS')).toBeTruthy();
        let dssEntry: _PdfDictionary = catalog.get('DSS');
        expect(dssEntry.has('OCSPs')).toBeTruthy();
        expect(dssEntry.has('CRLs')).toBeTruthy();
        expect(dssEntry.has('VRI')).toBeTruthy();
        let ocspEntry: _PdfReference[] = dssEntry.get('OCSPs') as [];
        expect(ocspEntry.length).toEqual(0);
        let crlsEntry: _PdfReference[] = dssEntry.get('CRLs') as [];
        expect(crlsEntry.length).toBeGreaterThan(0);
        expect(crlsEntry[0] instanceof _PdfReference).toBeTruthy();
        let stream = document._crossReference._fetch(crlsEntry[0]);
        let crlData: Uint8Array = stream.getBytes();
         const out = _decode(ltv_8_crl) as Uint8Array
        expect(crlData.length).toEqual(out.length);
        let expected: Uint8Array = _hexStringToByteArray(EJDOTNETCORE_4693Crl) as Uint8Array;
        expect(crlData.length).toEqual(expected.length);
        expect(crlData.every((val, i) => val === expected[i])).toBeTruthy();
        let vriEntry: _PdfDictionary = dssEntry.get('VRI');
        vriEntry.forEach((key: any, value: any) => {
            let ref: _PdfReference = vriEntry.getRaw(key);
            let dic: _PdfDictionary = document._crossReference._fetch(ref);
            expect(dic.has('OCSP')).toBeTruthy();
            expect(dic.has('CRL')).toBeTruthy();
        });
        document.destroy();
    });
    it('loaded document - EJDOTNETCORE3040', async () => {
        let document: PdfDocument = new PdfDocument(EJDOTNETCORE3040);
        expect(document.pageCount).toEqual(1);
        expect(document.form.count).toEqual(1);
		let field: PdfSignatureField = document.form.fieldAt(0) as PdfSignatureField;
		let sign: PdfSignature = field.getSignature();
		const enabled: boolean = await sign.enableLTV(longTermValidationCallback10);
        expect(enabled).toBeTruthy();
		let data: Uint8Array = document.save();
        document.destroy();
        document = new PdfDocument(data);
        expect(document.getPage(0).annotations.count).toEqual(0);
        expect(document.form.count).toEqual(1);
        expect(document.pageCount).toEqual(1);
        let catalog: _PdfDictionary = document._catalog._catalogDictionary;
        expect(catalog.has('DSS')).toBeTruthy();
        let dssEntry: _PdfDictionary = catalog.get('DSS');
        expect(dssEntry.has('OCSPs')).toBeTruthy();
        expect(dssEntry.has('CRLs')).toBeTruthy();
        expect(dssEntry.has('VRI')).toBeTruthy();
        let ocspEntry: _PdfReference[] = dssEntry.get('OCSPs') as [];
        expect(ocspEntry.length).toEqual(0);
        let crlsEntry: _PdfReference[] = dssEntry.get('CRLs') as [];
        expect(crlsEntry.length).toBeGreaterThan(0);
        expect(crlsEntry[0] instanceof _PdfReference).toBeTruthy();
        let stream = document._crossReference._fetch(crlsEntry[0]);
        const crlData: Uint8Array = stream.getBytes();
         const out = _decode(ltv_10_crl) as Uint8Array
        expect(crlData.length).toEqual(out.length);
        let expected: Uint8Array = _hexStringToByteArray(EJDOTNETCORE3040Crl) as Uint8Array;
        expect(crlData.length).toEqual(expected.length);
        expect(crlData.every((val, i) => val === expected[i])).toBeTruthy();
        let vriEntry: _PdfDictionary = dssEntry.get('VRI');
        vriEntry.forEach((key: any, value: any) => {
            let ref: _PdfReference = vriEntry.getRaw(key);
            let dic: _PdfDictionary = document._crossReference._fetch(ref);
            expect(dic.has('OCSP')).toBeTruthy();
            expect(dic.has('CRL')).toBeTruthy();
        });
        document.destroy();
    });
     it('loaded document - EJDOTNETCORE_4693', async () => {
        let document: PdfDocument = new PdfDocument(EJDOTNETCORE_4693);
        expect(document.pageCount).toEqual(1);
        expect(document.form.count).toEqual(1);
		let field: PdfSignatureField = document.form.fieldAt(0) as PdfSignatureField;
		let sign: PdfSignature = field.getSignature();
		const enabled: boolean = await sign.enableLTV(longTermValidationCallback11);
        expect(enabled).toBeTruthy();
		let data: Uint8Array = document.save();
        document.destroy();
        document = new PdfDocument(data);
        expect(document.getPage(0).annotations.count).toEqual(0);
        expect(document.form.count).toEqual(1);
        expect(document.pageCount).toEqual(1);
        let catalog: _PdfDictionary = document._catalog._catalogDictionary;
        expect(catalog.has('DSS')).toBeTruthy();
        let dssEntry: _PdfDictionary = catalog.get('DSS');
        expect(dssEntry.has('OCSPs')).toBeTruthy();
        expect(dssEntry.has('CRLs')).toBeTruthy();
        expect(dssEntry.has('VRI')).toBeTruthy();
        let ocspEntry: _PdfReference[] = dssEntry.get('OCSPs') as [];
        expect(ocspEntry.length).toEqual(0);
        let crlsEntry: _PdfReference[] = dssEntry.get('CRLs') as [];
        expect(crlsEntry.length).toBeGreaterThan(0);
        expect(crlsEntry[0] instanceof _PdfReference).toBeTruthy();
        let stream = document._crossReference._fetch(crlsEntry[0]);
        let crlData: Uint8Array = stream.getBytes();
         const out = _decode(ltv_11_crl) as Uint8Array
        expect(crlData.length).toEqual(out.length);
        let expected: Uint8Array = _hexStringToByteArray(EJDOTNETCORE_4693Crl) as Uint8Array;
        expect(crlData.length).toEqual(expected.length);
        expect(crlData.every((val, i) => val === expected[i])).toBeTruthy();
        let vriEntry: _PdfDictionary = dssEntry.get('VRI');
        vriEntry.forEach((key: any, value: any) => {
            let ref: _PdfReference = vriEntry.getRaw(key);
            let dic: _PdfDictionary = document._crossReference._fetch(ref);
            expect(dic.has('OCSP')).toBeTruthy();
            expect(dic.has('CRL')).toBeTruthy();
        });
        document.destroy();
    });
    it('External Signing1', async () => {
        let document: PdfDocument = new PdfDocument();
        let page: PdfPage = document.addPage();
        let field: PdfSignatureField = new PdfSignatureField(page, 'field', { x: 50, y: 50, width: 100, height: 100 });
        let sign: PdfSignature = PdfSignature.create(
            externalSignatureCallback,
            {
                cryptographicStandard: CryptographicStandard.cms,
                digestAlgorithm: DigestAlgorithm.sha1,
                contactInfo: 'johndoe@owned.us',
                locationInfo: 'Honolulu, Hawaii',
                reason: 'I am author of this document.',
                signedName: 'Signature',
            }
        );
        document.form.add(field);
        field.setSignature(sign);
        let data = document.save();
        document.destroy();
        document = new PdfDocument(data);
        const publicCert1Bytes: Uint8Array = _decode(publicCert1) as Uint8Array;
        const publicCert2Bytes: Uint8Array = _decode(publicCert2) as Uint8Array;
        page = document.getPage(0);
        expect(document.form.count).toEqual(1);
        field = document.form.fieldAt(0) as PdfSignatureField;
        sign = field.getSignature();
        const options: PdfSignatureOptions = sign.getSignatureOptions();
        expect(options.contactInfo).toEqual('johndoe@owned.us');
        expect(options.reason).toEqual('I am author of this document.');
        expect(options.isLocked).toEqual(false);
        expect(options.cryptographicStandard).toEqual(CryptographicStandard.cms);
        await sign.enableLTV([publicCert1Bytes, publicCert2Bytes], longTermValidationCallback12);
        data = document.save();
        document.destroy();
        document = new PdfDocument(data);
        expect(document.getPage(0).annotations.count).toEqual(0);
        expect(document.form.count).toEqual(1);
        expect(document.pageCount).toEqual(1);
        let catalog: _PdfDictionary = document._catalog._catalogDictionary;
        expect(catalog.has('DSS')).toBeTruthy();
        let dssEntry: _PdfDictionary = catalog.get('DSS');
        expect(dssEntry.has('OCSPs')).toBeTruthy();
        expect(dssEntry.has('CRLs')).toBeTruthy();
        expect(dssEntry.has('VRI')).toBeTruthy();
        let ocspsEntry: _PdfReference[] = dssEntry.get('OCSPs') as [];
        expect(ocspsEntry.length).toEqual(1);
        expect(ocspsEntry[0] instanceof _PdfReference).toBeTruthy();
        let stream = document._crossReference._fetch(ocspsEntry[0]);
        expect(stream instanceof _PdfBaseStream).toBeTruthy();
        expect(stream.getBytes().length).toBeGreaterThan(0);
        let crlsEntry: _PdfReference[] = dssEntry.get('CRLs') as [];
        expect(crlsEntry.length).toEqual(1);
        expect(crlsEntry[0] instanceof _PdfReference).toBeTruthy();
        stream = document._crossReference._fetch(crlsEntry[0]);
        const crlData: Uint8Array = stream.getBytes();
        expect(crlData.length).toEqual(476);
        let expected: Uint8Array = _decode(ltv_12_crl) as Uint8Array;
        expect(crlData.length).toEqual(expected.length);
        expect(crlData.every((val, i) => val === expected[i])).toBeTruthy();
        let vriEntry: _PdfDictionary = dssEntry.get('VRI');
        vriEntry.forEach((key: any, value: any) => {
            let ref: _PdfReference = vriEntry.getRaw(key);
            let dic: _PdfDictionary = document._crossReference._fetch(ref);
            expect(dic.has('OCSP')).toBeTruthy();
            expect(dic.has('CRL')).toBeTruthy();
        });
        document.destroy();
    });
    it('External Signing2', async () => {
        let document: PdfDocument = new PdfDocument();
        let page: PdfPage = document.addPage();
        let field: PdfSignatureField = new PdfSignatureField(page, 'field', { x: 50, y: 50, width: 100, height: 100 });
        const publicCert1Bytes: Uint8Array = _decode(publicCert1) as Uint8Array;
        const publicCert2Bytes: Uint8Array = _decode(publicCert2) as Uint8Array;
        let sign: PdfSignature = PdfSignature.create(
            externalSignatureCallback1,
            [publicCert1Bytes, publicCert2Bytes],
            {
                contactInfo: 'johndoe@owned.us',
                locationInfo: 'Honolulu, Hawaii',
                reason: 'I am author of this document.',
                signedName: 'Signature',
                digestAlgorithm: DigestAlgorithm.sha1,
                cryptographicStandard: CryptographicStandard.cades
            }
        );
        document.form.add(field);
        field.setSignature(sign);
        expect(sign._documentPermissions).toEqual(1);
        let data = document.save();
        document = new PdfDocument(data);
        page = document.getPage(0);
        expect(document.form.count).toEqual(1);
        field = document.form.fieldAt(0) as PdfSignatureField;
        sign = field.getSignature();
        const options: PdfSignatureOptions = sign.getSignatureOptions();
        expect(options.contactInfo).toEqual('johndoe@owned.us');
        expect(options.reason).toEqual('I am author of this document.');
        expect(options.isLocked).toEqual(false);
        let enabled: boolean = await sign.enableLTV([publicCert1Bytes, publicCert2Bytes], longTermValidationCallback13);
        expect(enabled).toBeTruthy();
        data = document.save();
        document.destroy();
        document = new PdfDocument(data);
        expect(document.getPage(0).annotations.count).toEqual(0);
        expect(document.form.count).toEqual(1);
        expect(document.pageCount).toEqual(1);
        let catalog: _PdfDictionary = document._catalog._catalogDictionary;
        expect(catalog.has('DSS')).toBeTruthy();
        let dssEntry: _PdfDictionary = catalog.get('DSS');
        expect(dssEntry.has('OCSPs')).toBeTruthy();
        expect(dssEntry.has('CRLs')).toBeTruthy();
        expect(dssEntry.has('VRI')).toBeTruthy();
        let ocspsEntry: _PdfReference[] = dssEntry.get('OCSPs') as [];
        expect(ocspsEntry.length).toEqual(1);
        expect(ocspsEntry[0] instanceof _PdfReference).toBeTruthy();
        let stream = document._crossReference._fetch(ocspsEntry[0]);
        expect(stream instanceof _PdfBaseStream).toBeTruthy();
        expect(stream.getBytes().length).toBeGreaterThan(0);
        let crlsEntry: _PdfReference[] = dssEntry.get('CRLs') as [];
        expect(crlsEntry.length).toEqual(1);
        expect(crlsEntry[0] instanceof _PdfReference).toBeTruthy();
        stream = document._crossReference._fetch(crlsEntry[0]);
        const crlData: Uint8Array = stream.getBytes();
        expect(crlData.length).toEqual(476);
        let expected: Uint8Array = _decode(ltv_13_crl)as Uint8Array;
        expect(crlData.length).toEqual(expected.length);
        expect(crlData.every((val, i) => val === expected[i])).toBeTruthy();
        let vriEntry: _PdfDictionary = dssEntry.get('VRI');
        vriEntry.forEach((key: any, value: any) => {
            let ref: _PdfReference = vriEntry.getRaw(key);
            let dic: _PdfDictionary = document._crossReference._fetch(ref);
            expect(dic.has('OCSP')).toBeTruthy();
            expect(dic.has('CRL')).toBeTruthy();
        });
        document.destroy();
    });
    it('External Signing3 - deffered', async () => {
        let document: PdfDocument = new PdfDocument();
        let page: PdfPage = document.addPage();
        let field: PdfSignatureField = new PdfSignatureField(page, 'field', { x: 50, y: 50, width: 100, height: 100 });
        const publicCert1Bytes: Uint8Array = _decode(publicCert1) as Uint8Array;
        let sign: PdfSignature = PdfSignature.create(
            externalSignatureCallback2,
            [publicCert1Bytes],
            {
                cryptographicStandard: CryptographicStandard.cms,
                digestAlgorithm: DigestAlgorithm.sha256,
                contactInfo: 'johndoe@owned.us',
                locationInfo: 'Honolulu, Hawaii',
                reason: 'I am author of this document.',
                signedName: 'Signature'
            }
        );
        document.form.add(field);
        field.setSignature(sign);
        expect(sign._documentPermissions).toEqual(1);
        let data = document.save();
        document.destroy();
        document = new PdfDocument(data);
        page = document.getPage(0);
        expect(document.form.count).toEqual(1);
        field = document.form.fieldAt(0) as PdfSignatureField;
        expect(field).toBeDefined();
        expect(field._dictionary.get('V')).toBeTruthy();
        const signedData: Uint8Array = PdfSignature.replaceEmptySignature(data, 'field', signedHash, DigestAlgorithm.sha256, [publicCert1Bytes]);
        document.destroy();
        document = new PdfDocument(data);
        const publicCert2Bytes: Uint8Array = _decode(publicCert2) as Uint8Array;
        page = document.getPage(0);
        expect(document.form.count).toEqual(1);
        field = document.form.fieldAt(0) as PdfSignatureField;
        sign = field.getSignature();
        const options: PdfSignatureOptions = sign.getSignatureOptions();
        expect(options.contactInfo).toEqual('johndoe@owned.us');
        expect(options.reason).toEqual('I am author of this document.');
        expect(options.isLocked).toEqual(false);
        const result = await sign.enableLTV([publicCert1Bytes, publicCert2Bytes], longTermValidationCallback14);
        expect(result).toBeTruthy();
        data = document.save();
        document.destroy();
        document = new PdfDocument(data);
        expect(document.getPage(0).annotations.count).toEqual(0);
        expect(document.form.count).toEqual(1);
        expect(document.pageCount).toEqual(1);
        let catalog: _PdfDictionary = document._catalog._catalogDictionary;
        expect(catalog.has('DSS')).toBeTruthy();
        let dssEntry: _PdfDictionary = catalog.get('DSS');
        expect(dssEntry.has('OCSPs')).toBeTruthy();
        expect(dssEntry.has('CRLs')).toBeTruthy();
        expect(dssEntry.has('VRI')).toBeTruthy();
        let ocspsEntry: _PdfReference[] = dssEntry.get('OCSPs') as [];
        expect(ocspsEntry.length).toEqual(1);
        expect(ocspsEntry[0] instanceof _PdfReference).toBeTruthy();
        let stream = document._crossReference._fetch(ocspsEntry[0]);
        expect(stream instanceof _PdfBaseStream).toBeTruthy();
        expect(stream.getBytes().length).toBeGreaterThan(0);
        let crlsEntry: _PdfReference[] = dssEntry.get('CRLs') as [];
        expect(crlsEntry.length).toEqual(1);
        expect(crlsEntry[0] instanceof _PdfReference).toBeTruthy();
        stream = document._crossReference._fetch(crlsEntry[0]);
        const crlData: Uint8Array = stream.getBytes();
        expect(crlData.length).toEqual(476);
        let expected: Uint8Array = _decode(ltv_14_crl) as Uint8Array;
        expect(crlData.length).toEqual(expected.length);
        expect(crlData.every((val, i) => val === expected[i])).toBeTruthy();
        let vriEntry: _PdfDictionary = dssEntry.get('VRI');
        vriEntry.forEach((key: any, value: any) => {
            let ref: _PdfReference = vriEntry.getRaw(key);
            let dic: _PdfDictionary = document._crossReference._fetch(ref);
            expect(dic.has('OCSP')).toBeTruthy();
            expect(dic.has('CRL')).toBeTruthy();
        });
        document.destroy();
    });
     it('External Signing - Revocation ocsp or crl', async () => {
        let document: PdfDocument = new PdfDocument();
        let page: PdfPage = document.addPage();
        let field: PdfSignatureField = new PdfSignatureField(page, 'field', { x: 50, y: 50, width: 100, height: 100 });
        let sign: PdfSignature = PdfSignature.create(
            externalSignatureCallback,
            {
                cryptographicStandard: CryptographicStandard.cms,
                digestAlgorithm: DigestAlgorithm.sha256,
                contactInfo: 'johndoe@owned.us',
                locationInfo: 'Honolulu, Hawaii',
                reason: 'I am author of this document.',
                signedName: 'Signature',
            }
        );
        document.form.add(field);
        field.setSignature(sign);
        let data = document.save();
        document.destroy();
        document = new PdfDocument(data);
        const publicCert1Bytes: Uint8Array = _decode(publicCert1) as Uint8Array;
        const publicCert2Bytes: Uint8Array = _decode(publicCert2) as Uint8Array;
        page = document.getPage(0);
        expect(document.form.count).toEqual(1);
        field = document.form.fieldAt(0) as PdfSignatureField;
        sign = field.getSignature();
        const options: PdfSignatureOptions = sign.getSignatureOptions();
        expect(options.contactInfo).toEqual('johndoe@owned.us');
        expect(options.reason).toEqual('I am author of this document.');
        expect(options.isLocked).toEqual(false);
        expect(options.cryptographicStandard).toEqual(CryptographicStandard.cms);
        let result = await sign.enableLTV([publicCert1Bytes, publicCert2Bytes], RevocationType.ocspOrCrl, longTermValidationCallback15);
        expect(result).toBeTruthy();
        data = document.save();
        document.destroy();
        document = new PdfDocument(data);
        expect(document.getPage(0).annotations.count).toEqual(0);
        expect(document.form.count).toEqual(1);
        expect(document.pageCount).toEqual(1);
        let catalog: _PdfDictionary = document._catalog._catalogDictionary;
        expect(catalog.has('DSS')).toBeTruthy();
        let dssEntry: _PdfDictionary = catalog.get('DSS');
        expect(dssEntry.has('OCSPs')).toBeTruthy();
        expect(dssEntry.has('CRLs')).toBeTruthy();
        expect(dssEntry.has('VRI')).toBeTruthy();
        let ocspsEntry: _PdfReference[] = dssEntry.get('OCSPs') as [];
        expect(ocspsEntry.length).toBeGreaterThan(0);
        expect(ocspsEntry[0] instanceof _PdfReference).toBeTruthy();
        let stream = document._crossReference._fetch(ocspsEntry[0]);
        expect(stream instanceof _PdfBaseStream).toBeTruthy();
        expect(stream.stream.length).toBeGreaterThan(0);
        let crlsEntry: _PdfReference[] = dssEntry.get('CRLs') as [];
        expect(crlsEntry.length).toEqual(0);
        let vriEntry: _PdfDictionary = dssEntry.get('VRI');
        vriEntry.forEach((key: any, value: any) => {
            let ref: _PdfReference = vriEntry.getRaw(key);
            let dic: _PdfDictionary = document._crossReference._fetch(ref);
            expect(dic.has('OCSP')).toBeTruthy();
            expect(dic.has('CRL')).toBeTruthy();
        });
        document.destroy();
    });
     it('External Signing - Revocation ocsp', async () => {
        let document: PdfDocument = new PdfDocument();
        let page: PdfPage = document.addPage();
        let field: PdfSignatureField = new PdfSignatureField(page, 'field', { x: 50, y: 50, width: 100, height: 100 });
        let sign: PdfSignature = PdfSignature.create(
            externalSignatureCallback,
            {
                cryptographicStandard: CryptographicStandard.cms,
                digestAlgorithm: DigestAlgorithm.sha256,
                contactInfo: 'johndoe@owned.us',
                locationInfo: 'Honolulu, Hawaii',
                reason: 'I am author of this document.',
                signedName: 'Signature',
            }
        );
        document.form.add(field);
        field.setSignature(sign);
        let data = document.save();
        document.destroy();
        document = new PdfDocument(data);
        const publicCert1Bytes: Uint8Array = _decode(publicCert1) as Uint8Array;
        const publicCert2Bytes: Uint8Array = _decode(publicCert2) as Uint8Array;
        page = document.getPage(0);
        expect(document.form.count).toEqual(1);
        field = document.form.fieldAt(0) as PdfSignatureField;
        sign = field.getSignature();
        const options: PdfSignatureOptions = sign.getSignatureOptions();
        expect(options.contactInfo).toEqual('johndoe@owned.us');
        expect(options.reason).toEqual('I am author of this document.');
        expect(options.isLocked).toEqual(false);
        expect(options.cryptographicStandard).toEqual(CryptographicStandard.cms);
        let result = await sign.enableLTV([publicCert1Bytes, publicCert2Bytes], RevocationType.ocsp, longTermValidationCallback16);
        expect(result).toBeTruthy();
        data = document.save();
        document.destroy();
        document = new PdfDocument(data);
        expect(document.getPage(0).annotations.count).toEqual(0);
        expect(document.form.count).toEqual(1);
        expect(document.pageCount).toEqual(1);
        let catalog: _PdfDictionary = document._catalog._catalogDictionary;
        expect(catalog.has('DSS')).toBeTruthy();
        let dssEntry: _PdfDictionary = catalog.get('DSS');
        expect(dssEntry.has('OCSPs')).toBeTruthy();
        expect(dssEntry.has('CRLs')).toBeTruthy();
        expect(dssEntry.has('VRI')).toBeTruthy();
        let ocspsEntry: _PdfReference[] = dssEntry.get('OCSPs') as [];
        expect(ocspsEntry.length).toBeGreaterThan(0);
        expect(ocspsEntry[0] instanceof _PdfReference).toBeTruthy();
        let stream = document._crossReference._fetch(ocspsEntry[0]);
        expect(stream instanceof _PdfBaseStream).toBeTruthy();
        expect(stream.stream.length).toBeGreaterThan(0);
        let crlsEntry: _PdfReference[] = dssEntry.get('CRLs') as [];
        expect(crlsEntry.length).toEqual(0);
        let vriEntry: _PdfDictionary = dssEntry.get('VRI');
        vriEntry.forEach((key: any, value: any) => {
            let ref: _PdfReference = vriEntry.getRaw(key);
            let dic: _PdfDictionary = document._crossReference._fetch(ref);
            expect(dic.has('OCSP')).toBeTruthy();
            expect(dic.has('CRL')).toBeTruthy();
        });
        document.destroy();
     });
    it('External Signing - Revocation crl', async () => {
        let document: PdfDocument = new PdfDocument();
        let page: PdfPage = document.addPage();
        let field: PdfSignatureField = new PdfSignatureField(page, 'field', { x: 50, y: 50, width: 100, height: 100 });
        let sign: PdfSignature = PdfSignature.create(
            externalSignatureCallback,
            {
                cryptographicStandard: CryptographicStandard.cms,
                digestAlgorithm: DigestAlgorithm.sha256,
                contactInfo: 'johndoe@owned.us',
                locationInfo: 'Honolulu, Hawaii',
                reason: 'I am author of this document.',
                signedName: 'Signature',
            }
        );
        document.form.add(field);
        field.setSignature(sign);
        let data = document.save();
        document.destroy();
        document = new PdfDocument(data);
        const publicCert1Bytes: Uint8Array = _decode(publicCert1) as Uint8Array;
        const publicCert2Bytes: Uint8Array = _decode(publicCert2) as Uint8Array;
        page = document.getPage(0);
        expect(document.form.count).toEqual(1);
        field = document.form.fieldAt(0) as PdfSignatureField;
        sign = field.getSignature();
        const options: PdfSignatureOptions = sign.getSignatureOptions();
        expect(options.contactInfo).toEqual('johndoe@owned.us');
        expect(options.reason).toEqual('I am author of this document.');
        expect(options.isLocked).toEqual(false);
        expect(options.cryptographicStandard).toEqual(CryptographicStandard.cms);
        let result = await sign.enableLTV([publicCert1Bytes, publicCert2Bytes], RevocationType.crl, longTermValidationCallback17);
        expect(result).toBeTruthy();
        data = document.save();
        document.destroy();
        document = new PdfDocument(data);
        expect(document.getPage(0).annotations.count).toEqual(0);
        expect(document.form.count).toEqual(1);
        expect(document.pageCount).toEqual(1);
        let catalog: _PdfDictionary = document._catalog._catalogDictionary;
        expect(catalog.has('DSS')).toBeTruthy();
        let dssEntry: _PdfDictionary = catalog.get('DSS');
        expect(dssEntry.has('OCSPs')).toBeTruthy();
        expect(dssEntry.has('CRLs')).toBeTruthy();
        expect(dssEntry.has('VRI')).toBeTruthy();
        let ocspsEntry: _PdfReference[] = dssEntry.get('OCSPs') as [];
        expect(ocspsEntry.length).toEqual(0);
        let crlsEntry: _PdfReference[] = dssEntry.get('CRLs') as [];
        expect(crlsEntry.length).toEqual(1);
        expect(crlsEntry[0] instanceof _PdfReference).toBeTruthy();
        let stream = document._crossReference._fetch(crlsEntry[0]);
        const crlData: Uint8Array = stream.getBytes();
        expect(crlData.length).toEqual(476);
        let expected: Uint8Array = _decode(ltv_17_crl) as Uint8Array;
        expect(crlData.length).toEqual(expected.length);
        expect(crlData.every((val, i) => val === expected[i])).toBeTruthy();
        let vriEntry: _PdfDictionary = dssEntry.get('VRI');
        vriEntry.forEach((key: any, value: any) => {
            let ref: _PdfReference = vriEntry.getRaw(key);
            let dic: _PdfDictionary = document._crossReference._fetch(ref);
            expect(dic.has('OCSP')).toBeTruthy();
            expect(dic.has('CRL')).toBeTruthy();
        });
        document.destroy();
    });
    it('External Signing - public certificates embeded', async () => {
        let document: PdfDocument = new PdfDocument();
        let page: PdfPage = document.addPage();
        let field: PdfSignatureField = new PdfSignatureField(page, 'field', { x: 50, y: 50, width: 100, height: 100 });
        let sign: PdfSignature = PdfSignature.create(
            externalSignatureCallback,
            {
                cryptographicStandard: CryptographicStandard.cms,
                digestAlgorithm: DigestAlgorithm.sha256,
                contactInfo: 'johndoe@owned.us',
                locationInfo: 'Honolulu, Hawaii',
                reason: 'I am author of this document.',
                signedName: 'Signature',
            }
        );
        document.form.add(field);
        field.setSignature(sign);
        let data = document.save();
        document.destroy();
        document = new PdfDocument(data);
        const publicCert1Bytes: Uint8Array = _decode(publicCert1) as Uint8Array;
        const publicCert2Bytes: Uint8Array = _decode(publicCert2) as Uint8Array;
        page = document.getPage(0);
        expect(document.form.count).toEqual(1);
        field = document.form.fieldAt(0) as PdfSignatureField;
        sign = field.getSignature();
        const options: PdfSignatureOptions = sign.getSignatureOptions();
        expect(options.contactInfo).toEqual('johndoe@owned.us');
        expect(options.reason).toEqual('I am author of this document.');
        expect(options.isLocked).toEqual(false);
        expect(options.cryptographicStandard).toEqual(CryptographicStandard.cms);
        let result = await sign.enableLTV([publicCert1Bytes, publicCert2Bytes], RevocationType.ocspAndCrl, true, longTermValidationCallback18);
        expect(result).toBeTruthy();
        data = document.save();
        document.destroy();
        document = new PdfDocument(data);
        expect(document.getPage(0).annotations.count).toEqual(0);
        expect(document.form.count).toEqual(1);
        expect(document.pageCount).toEqual(1);
        let catalog: _PdfDictionary = document._catalog._catalogDictionary;
        expect(catalog.has('DSS')).toBeTruthy();
        let dssEntry: _PdfDictionary = catalog.get('DSS');
        expect(dssEntry.has('OCSPs')).toBeTruthy();
        expect(dssEntry.has('CRLs')).toBeTruthy();
        expect(dssEntry.has('VRI')).toBeTruthy();
        expect(dssEntry.has('Certs')).toBeTruthy();
        let ocspsEntry: _PdfReference[] = dssEntry.get('OCSPs') as [];
        expect(ocspsEntry.length).toEqual(1);
        expect(ocspsEntry[0] instanceof _PdfReference).toBeTruthy();
        let stream = document._crossReference._fetch(ocspsEntry[0]);
        expect(stream instanceof _PdfBaseStream).toBeTruthy();
        expect(stream.getBytes().length).toBeGreaterThan(0);
        let crlsEntry: _PdfReference[] = dssEntry.get('CRLs') as [];
        expect(crlsEntry.length).toEqual(1);
        expect(crlsEntry[0] instanceof _PdfReference).toBeTruthy();
        stream = document._crossReference._fetch(crlsEntry[0]);
        const crlData: Uint8Array = stream.getBytes();
        expect(crlData.length).toEqual(476);
        let expected: Uint8Array = _decode(ltv_18_crl) as Uint8Array
        expect(crlData.length).toEqual(expected.length);
        expect(crlData.every((val, i) => val === expected[i])).toBeTruthy();
        let certEntry: _PdfReference[] = dssEntry.get('Certs') as [];
        expect(certEntry.length).toEqual(2);
        expect(certEntry[0] instanceof _PdfReference).toBeTruthy();
        stream = document._crossReference._fetch(certEntry[0]);
        let certData: Uint8Array = stream.getBytes();
        expect(certData.length).toEqual(1244);
        expected = _hexStringToByteArray(certain1Cert1) as Uint8Array;
        expect(certData.length).toEqual(expected.length);
        expect(certData.every((val, i) => val === expected[i])).toBeTruthy();
        stream = document._crossReference._fetch(certEntry[1]);
        certData = stream.getBytes();
        expect(certData.length).toEqual(1132);
        expected = _hexStringToByteArray(certain1Cert2) as Uint8Array;
        expect(certData.length).toEqual(expected.length);
        expect(certData.every((val, i) => val === expected[i])).toBeTruthy();
        let vriEntry: _PdfDictionary = dssEntry.get('VRI');
        vriEntry.forEach((key: any, value: any) => {
            let ref: _PdfReference = vriEntry.getRaw(key);
            let dic: _PdfDictionary = document._crossReference._fetch(ref);
            expect(dic.has('OCSP')).toBeTruthy();
            expect(dic.has('CRL')).toBeTruthy();
        });
        document.destroy();
    });
    it('mutiple Signature - 1', async () => {
        let document: PdfDocument = new PdfDocument();
        let page = document.addPage();
        let field: PdfSignatureField = new PdfSignatureField(page, 'Signature', { x: 50, y: 50, width: 100, height: 100 });
        let certData = pdf;
        let password = 'syncfusion';
        let sign: PdfSignature = PdfSignature.create(
            certData,
            password,
            {
                cryptographicStandard: CryptographicStandard.cms,
                digestAlgorithm: DigestAlgorithm.sha256,
                contactInfo: 'johndoe@owned.us',
                locationInfo: 'Honolulu, Hawaii',
                reason: 'I am author of this document.',
                signedName: 'Signature'
            }
        );
        document.form.add(field);
        field.setSignature(sign);
        expect(document.form.count).toEqual(1);
        let data = document.save();
        document.destroy();
        let ldoc: PdfDocument = new PdfDocument(data);
        let lpage: PdfPage = ldoc.getPage(0);
        field = new PdfSignatureField(lpage, 'Signature1', { x: 50, y: 50, width: 100, height: 100 });
        certData = certain1Pfx;
        password = 'moorthy';
        sign = PdfSignature.create(
            certData,
            password,
            {
                cryptographicStandard: CryptographicStandard.cms,
                digestAlgorithm: DigestAlgorithm.sha256,
                reason: 'I am author of this document.',
                certify: true
            }
        );
        ldoc.form.add(field);
        field.setSignature(sign);
        await sign.enableLTV(longTermValidationCallback19);
        data = ldoc.save();
        expect(ldoc.form.count).toEqual(2);
        ldoc.destroy();
        document = new PdfDocument(data);
        expect(document.getPage(0).annotations.count).toEqual(0);
        expect(document.form.count).toEqual(2);
        expect(document.pageCount).toEqual(1);
        let catalog: _PdfDictionary = document._catalog._catalogDictionary;
        expect(catalog.has('DSS')).toBeTruthy();
        let dssEntry: _PdfDictionary = catalog.get('DSS');
        expect(dssEntry.has('OCSPs')).toBeTruthy();
        expect(dssEntry.has('CRLs')).toBeTruthy();
        expect(dssEntry.has('VRI')).toBeTruthy();
        let ocspsEntry: _PdfReference[] = dssEntry.get('OCSPs') as [];
        expect(ocspsEntry.length).toEqual(1);
        expect(ocspsEntry[0] instanceof _PdfReference).toBeTruthy();
        let stream = document._crossReference._fetch(ocspsEntry[0]);
        expect(stream instanceof _PdfBaseStream).toBeTruthy();
        expect(stream.getBytes().length).toBeGreaterThan(0);
        let crlsEntry: _PdfReference[] = dssEntry.get('CRLs') as [];
        expect(crlsEntry.length).toEqual(1);
        expect(crlsEntry[0] instanceof _PdfReference).toBeTruthy();
        stream = document._crossReference._fetch(crlsEntry[0]);
        const crlData: Uint8Array = stream.getBytes();
        expect(crlData.length).toEqual(476);
        let vriEntry: _PdfDictionary = dssEntry.get('VRI');
        vriEntry.forEach((key: any, value: any) => {
            let ref: _PdfReference = vriEntry.getRaw(key);
            let dic: _PdfDictionary = document._crossReference._fetch(ref);
            expect(dic.has('OCSP')).toBeTruthy();
            expect(dic.has('CRL')).toBeTruthy();
        });
        document.destroy();
    });
    it('mutiple Signature - 2', async () => {
        let document: PdfDocument = new PdfDocument();
        let page = document.addPage();
        let field: PdfSignatureField = new PdfSignatureField(page, 'Signature', { x: 50, y: 50, width: 100, height: 100 });
        let certData = certain1Pfx;
        let password = 'moorthy';
        let sign: PdfSignature = PdfSignature.create(
            certData,
            password,
            {
                cryptographicStandard: CryptographicStandard.cms,
                digestAlgorithm: DigestAlgorithm.sha256,
                contactInfo: 'johndoe@owned.us',
                locationInfo: 'Honolulu, Hawaii',
                reason: 'I am author of this document.',
                signedName: 'Signature'
            }
        );
        document.form.add(field);
        field.setSignature(sign);
        await sign.enableLTV(longTermValidationCallback20);
        expect(document.form.count).toEqual(1);
        let data = document.save();
        document.destroy();
        let ldoc: PdfDocument = new PdfDocument(data);
        let lpage: PdfPage = ldoc.getPage(0);
        field = new PdfSignatureField(lpage, 'Signature1', { x: 50, y: 50, width: 100, height: 100 });
        sign = PdfSignature.create(
            certData,
            password,
            {
                cryptographicStandard: CryptographicStandard.cms,
                digestAlgorithm: DigestAlgorithm.sha256,
                reason: 'I am author of this document.'
            }
        );
        ldoc.form.add(field);
        field.setSignature(sign);
        await sign.enableLTV(longTermValidationCallback21);
        expect(ldoc.form.count).toEqual(2);
        data = ldoc.save();
        ldoc.destroy();
        document = new PdfDocument(data);
        expect(document.getPage(0).annotations.count).toEqual(0);
        expect(document.form.count).toEqual(2);
        expect(document.pageCount).toEqual(1);
        let catalog: _PdfDictionary = document._catalog._catalogDictionary;
        expect(catalog.has('DSS')).toBeTruthy();
        let dssEntry: _PdfDictionary = catalog.get('DSS');
        expect(dssEntry.has('OCSPs')).toBeTruthy();
        expect(dssEntry.has('CRLs')).toBeTruthy();
        expect(dssEntry.has('VRI')).toBeTruthy();
        let ocspsEntry: _PdfReference[] = dssEntry.get('OCSPs') as [];
        expect(ocspsEntry.length).toEqual(2);
        expect(ocspsEntry[0] instanceof _PdfReference).toBeTruthy();
        let stream = document._crossReference._fetch(ocspsEntry[0]);
        expect(stream instanceof _PdfBaseStream).toBeTruthy();
        expect(stream.getBytes().length).toBeGreaterThan(0);
        let crlsEntry: _PdfReference[] = dssEntry.get('CRLs') as [];
        expect(crlsEntry.length).toEqual(1);
        expect(crlsEntry[0] instanceof _PdfReference).toBeTruthy();
        stream = document._crossReference._fetch(crlsEntry[0]);
        let vriEntry: _PdfDictionary = dssEntry.get('VRI');
        vriEntry.forEach((key: any, value: any) => {
            let ref: _PdfReference = vriEntry.getRaw(key);
            let dic: _PdfDictionary = document._crossReference._fetch(ref);
            expect(dic.has('OCSP')).toBeTruthy();
            expect(dic.has('CRL')).toBeTruthy();
        });
        document.destroy();
    });
});
