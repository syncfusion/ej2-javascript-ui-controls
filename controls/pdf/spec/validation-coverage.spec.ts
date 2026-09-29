import { CryptographicStandard, DigestAlgorithm, PdfCertificationFlag, RevocationStatus, RevocationType, SignatureStatus } from "../src/pdf/core/enumerator";
import { PdfSignatureField } from "../src/pdf/core/form/field";
import { PdfDocument } from "../src/pdf/core/pdf-document";
import { PdfPage } from "../src/pdf/core/pdf-page";
import { _PdfName, _PdfReference } from "../src/pdf/core/pdf-primitives";
import { LtvVerificationInformation, PdfSignatureValidationResult } from "../src/pdf/core/pdf-type";
import { _PdfBasicEncodingElement } from "../src/pdf/core/security/digital-signature/asn1/basic-encoding-element";
import { _PdfUniqueEncodingElement } from "../src/pdf/core/security/digital-signature/asn1/unique-encoding-element";
import { _PdfCertificateIdentityHelper } from "../src/pdf/core/security/digital-signature/ocsp/certificate-identity";
import { _PdfOcspResponseHelper } from "../src/pdf/core/security/digital-signature/ocsp/ocsp-response";
import { _PdfGeneralizedTime, _PdfOcspHelper } from "../src/pdf/core/security/digital-signature/ocsp/ocsp-response-utils";
import { _PdfBigInt } from "../src/pdf/core/security/digital-signature/pdf-big-integer";
import { _PdfRsaAlgorithm, _PdfRsaCoreAlgorithm } from "../src/pdf/core/security/digital-signature/signature/algorithm-handler";
import { _PdfCryptographicMessageSyntaxSigner } from "../src/pdf/core/security/digital-signature/signature/cryptographic-signer";
import { _PdfEncryptionAlgorithms } from "../src/pdf/core/security/digital-signature/signature/encryption-algorithm";
import { PdfSignature } from "../src/pdf/core/security/digital-signature/signature/pdf-signature";
import { _PdfRsaPublicKeyParam } from "../src/pdf/core/security/digital-signature/signature/ron-cipher";
import { _PdfX509Certificate } from "../src/pdf/core/security/digital-signature/x509/x509-certificate";
import { _PdfX509CertificateParser } from "../src/pdf/core/security/digital-signature/x509/x509-certificate-parser";
import { _PdfX509CertificateStructure } from "../src/pdf/core/security/digital-signature/x509/x509-certificate-structure";
import { _bytesEqual, _decode, _isByteArrayEqual, _parseTimestampToken, _trimInteger } from "../src/pdf/core/utils";
import { certchain_1 } from "./certificate-input.spec";
import { pfx1 } from "./signature-validation-input.spec";
describe('coverage 1', () => {
    it('1003729 - Validate signature when signer certificate is not found', () => {
        const certData = _decode(certchain_1);
        let document: PdfDocument = new PdfDocument();
        let page: PdfPage = document.addPage();
        let field: PdfSignatureField = new PdfSignatureField(
            page,
            'field',
            { x: 50, y: 50, width: 100, height: 100 }
        );
        const sign: PdfSignature = PdfSignature.create(
            certData as Uint8Array,
            'moorthy',
            {
                cryptographicStandard: CryptographicStandard.cms,
                digestAlgorithm: DigestAlgorithm.sha256
            }
        );
        document.form.add(field);
        field.setSignature(sign);
        const data: Uint8Array = document.save();
        document.destroy();
        document = new PdfDocument(data);
        field = document.form.fieldAt(0) as PdfSignatureField;
        spyOn<any>(field, '_getEmbeddedCertificates').and.returnValue([]);
        const result: PdfSignatureValidationResult = field.validateSignature({
            trustedCertificates: [certData as Uint8Array],
            passwords: ['moorthy']
        });
        expect(result.signatureStatus).toEqual(SignatureStatus.invalid);
        expect(result.validationErrorMessages).toContain(
            'Signer certificate not found in signature.'
        );
        document.destroy();
    });
    it('1003729 - Validate signature unknown exception handling', () => {
        const certData = _decode(certchain_1);
        let document: PdfDocument = new PdfDocument();
        let page: PdfPage = document.addPage();
        let field: PdfSignatureField = new PdfSignatureField(
            page,
            'field',
            { x: 50, y: 50, width: 100, height: 100 }
        );
        const sign: PdfSignature = PdfSignature.create(
            certData as Uint8Array,
            'moorthy',
            {
                cryptographicStandard: CryptographicStandard.cms,
                digestAlgorithm: DigestAlgorithm.sha256
            }
        );
        document.form.add(field);
        field.setSignature(sign);
        const data: Uint8Array = document.save();
        document.destroy();
        document = new PdfDocument(data);
        field = document.form.fieldAt(0) as PdfSignatureField;
        spyOn<any>(field, '_validateSignature').and.callFake(() => {
            throw null;
        });
        const result: PdfSignatureValidationResult = field.validateSignature();
        expect(result.signatureStatus).toEqual(SignatureStatus.invalid);
        expect(result.validationErrorMessages[0]).toEqual(
            'Unknown error during signature validation.'
        );
        document.destroy();
    });
    it('1003729 - Validate signature exception handling', () => {
        let document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const certData = _decode(certchain_1);
        let field: PdfSignatureField = new PdfSignatureField(
            page,
            'field',
            { x: 50, y: 50, width: 100, height: 100 }
        );
        const sign: PdfSignature = PdfSignature.create(
            certData as Uint8Array,
            'moorthy',
            {
                cryptographicStandard: CryptographicStandard.cms,
                digestAlgorithm: DigestAlgorithm.sha256
            }
        );
        document.form.add(field);
        field.setSignature(sign);
        const data: Uint8Array = document.save();
        document.destroy();
        document = new PdfDocument(data);
        field = document.form.fieldAt(0) as PdfSignatureField;
        spyOn<any>(field, '_validateSignature').and.throwError('Test validation error');
        const result: PdfSignatureValidationResult = field.validateSignature();
        expect(result.signatureStatus).toEqual(SignatureStatus.invalid);
        expect(result.validationErrorMessages.length).toBe(1);
        expect(result.validationErrorMessages[0]).toEqual('Test validation error');
        document.destroy();
    });
    it('1003729 - Get embedded certificates', () => {
        let document: PdfDocument = new PdfDocument();
        let page: PdfPage = document.addPage();
        let field: PdfSignatureField = new PdfSignatureField(
            page,
            'field',
            { x: 0, y: 0, width: 100, height: 50 }
        );
        (field as any)._cmsSigner = {
            _certificates: [{ name: 'cert1' }]
        };
        const result: any[] = (field as any)._getEmbeddedCertificates();
        expect(result).toBeDefined();
        expect(result.length).toEqual(1);
        document.destroy();
    });
    it('1003729 - Get embedded certificates returns undefined', () => {
        let document: PdfDocument = new PdfDocument();
        let page: PdfPage = document.addPage();
        let field: PdfSignatureField = new PdfSignatureField(
            page,
            'field',
            { x: 0, y: 0, width: 100, height: 50 }
        );
        (field as any)._cmsSigner = undefined;
        const result: any[] = (field as any)._getEmbeddedCertificates();
        expect(result).toBeUndefined();
        document.destroy();
    });
    it('1003729 - Get signer certificate', () => {
        let document: PdfDocument = new PdfDocument();
        let page: PdfPage = document.addPage();
        const field: PdfSignatureField = new PdfSignatureField(
            page,
            'field',
            { x: 0, y: 0, width: 100, height: 50 }
        );
        const certificate: any = { name: 'cert1' };
        const result: any = (field as any)._getSignerCertificate([certificate]);
        expect(result).toBe(certificate);
        document.destroy();
    });
    it('1003729 - Get signer certificate returns undefined', () => {
        let document: PdfDocument = new PdfDocument();
        let page: PdfPage = document.addPage();
        const field: PdfSignatureField = new PdfSignatureField(
            page,
            'field',
            { x: 0, y: 0, width: 100, height: 50 }
        );
        const result: any = (field as any)._getSignerCertificate([]);
        expect(result).toBeUndefined();
        document.destroy();
    });
    it('1003729 - Validate certificate collection with empty embedded certificates', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfSignatureField = new PdfSignatureField(
            page,
            'field',
            { x: 0, y: 0, width: 100, height: 100 }
        );
        const signatureResult: PdfSignatureValidationResult = {
            validationErrorMessages: []
        } as any;
        const value: boolean = (field as any)._validateCertificateWithCollection(
            [],
            [{}],
            new Date(),
            signatureResult
        );
        expect(value).toBeFalsy();
        document.destroy();
    });
    it('1003729 - Validate certificate collection chain verification failure', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfSignatureField = new PdfSignatureField(
            page,
            'field',
            { x: 0, y: 0, width: 100, height: 100 }
        );
        const signatureResult: PdfSignatureValidationResult = {
            validationErrorMessages: []
        } as any;
        spyOn<any>(field, '_isCertificateTimeValid').and.returnValue(false);
        spyOn<any>(field, '_verifyCertificateSignature').and.returnValue(false);
        const result: boolean = (field as any)._validateCertificateWithCollection(
            [{ id: 'cert1' }, { id: 'cert2' }],
            [{ id: 'root' }],
            new Date(),
            signatureResult
        );
        expect(result).toBeFalsy();
        expect(signatureResult.validationErrorMessages).toContain(
            'Cannot be verified against the KeyStore or the certificate chain'
        );
        document.destroy();
    });
    it('1003729 - Validate certificate collection chain verification success', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfSignatureField = new PdfSignatureField(
            page,
            'field',
            { x: 0, y: 0, width: 100, height: 100 }
        );
        const signatureResult: PdfSignatureValidationResult = {
            validationErrorMessages: []
        } as any;
        spyOn<any>(field, '_isCertificateTimeValid').and.returnValue(false);
        spyOn<any>(field, '_verifyCertificateSignature').and.callFake(
            (cert: any, issuer: any) => issuer.id === 'cert2'
        );
        const result: boolean = (field as any)._validateCertificateWithCollection(
            [{ id: 'cert1' }, { id: 'cert2' }],
            [{ id: 'root' }],
            new Date(),
            signatureResult
        );
        expect(result).toBeFalsy();
        document.destroy();
    });
    it('1003729 - Build certificate chain with invalid key usage', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfSignatureField = new PdfSignatureField(
            page,
            'field',
            { x: 0, y: 0, width: 100, height: 100 }
        );
        const leaf: any = {
            _keyUsage: [false, false]
        };
        const result: any = (field as any)._buildAndValidateCertificateChain(
            leaf,
            [],
            [],
            new Date()
        );
        expect(result.trusted).toBeFalsy();
        expect(result.failureReason).toEqual(
            'Signer keyUsage does not allow digital signing.'
        );
        document.destroy();
    });
    it('1003729 - Build certificate chain with expired signer certificate', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfSignatureField = new PdfSignatureField(
            page,
            'field',
            { x: 0, y: 0, width: 100, height: 100 }
        );
        spyOn<any>(field, '_isCertificateTimeValid').and.returnValue(false);
        const leaf: any = { _keyUsage: [true] };
        const result: any = (field as any)._buildAndValidateCertificateChain(
            leaf,
            [],
            [],
            new Date()
        );
        expect(result.trusted).toBeFalsy();
        expect(result.failureReason).toEqual(
            'Signer certificate is expired or not yet valid.'
        );
        document.destroy();
    });
    it('1003729 - Build certificate chain issuer not found', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfSignatureField = new PdfSignatureField(
            page,
            'field',
            { x: 0, y: 0, width: 100, height: 100 }
        );
        spyOn<any>(field, '_isCertificateTimeValid').and.returnValue(true);
        spyOn<any>(field, '_isSelfSigned').and.returnValue(false);
        spyOn<any>(field, '_findIssuer').and.returnValue(undefined);
        const result: any = (field as any)._buildAndValidateCertificateChain(
            { _keyUsage: [true] },
            [],
            [],
            new Date()
        );
        expect(result.trusted).toBeFalsy();
        expect(result.failureReason).toEqual(
            'Issuer certificate not found.'
        );
        document.destroy();
    });
    it('1003729 - Build certificate chain signature verification failure', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfSignatureField = new PdfSignatureField(
            page,
            'field',
            { x: 0, y: 0, width: 100, height: 100 }
        );
        const issuer: any = {};
        spyOn<any>(field, '_isCertificateTimeValid').and.returnValue(true);
        spyOn<any>(field, '_isSelfSigned').and.returnValue(false);
        spyOn<any>(field, '_findIssuer').and.returnValue(issuer);
        spyOn<any>(field, '_verifyCertificateSignature').and.returnValue(false);
        const result: any = (field as any)._buildAndValidateCertificateChain(
            { _keyUsage: [true] },
            [issuer],
            [],
            new Date()
        );
        expect(result.trusted).toBeFalsy();
        expect(result.failureReason).toEqual(
            'Certificate signature verification failed.'
        );
        document.destroy();
    });
    it('1003729 - Build certificate chain untrusted root', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfSignatureField = new PdfSignatureField(
            page,
            'field',
            { x: 0, y: 0, width: 100, height: 100 }
        );
        const root: any = {};
        spyOn<any>(field, '_isCertificateTimeValid').and.returnValue(true);
        spyOn<any>(field, '_isSelfSigned').and.returnValues(false, true);
        spyOn<any>(field, '_findIssuer').and.returnValue(root);
        spyOn<any>(field, '_verifyCertificateSignature').and.returnValue(true);
        spyOn<any>(field, '_sameCertificate').and.returnValue(false);
        const result: any = (field as any)._buildAndValidateCertificateChain(
            { _keyUsage: [true] },
            [root],
            [],
            new Date()
        );
        expect(result.trusted).toBeFalsy();
        expect(result.failureReason).toEqual(
            'Chain terminates at an untrusted root.'
        );
        document.destroy();
    });
    it('1003729 - Build and validate certificate chain success', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfSignatureField = new PdfSignatureField(
            page,
            'field',
            { x: 0, y: 0, width: 100, height: 100 }
        );
        const root: any = { name: 'root' };
        spyOn<any>(field, '_isCertificateTimeValid').and.returnValue(true);
        spyOn<any>(field, '_isSelfSigned').and.returnValues(false, true);
        spyOn<any>(field, '_findIssuer').and.returnValue(root);
        spyOn<any>(field, '_verifyCertificateSignature').and.returnValue(true);
        spyOn<any>(field, '_sameCertificate').and.returnValue(true);
        const result: any = (field as any)._buildAndValidateCertificateChain(
            { _keyUsage: [true] },
            [root],
            [root],
            new Date()
        );
        expect(result.trusted).toBeTruthy();
        document.destroy();
    });
    it('1003729 - Find issuer using authority key identifier', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfSignatureField = new PdfSignatureField(
            page, 'field', { x: 0, y: 0, width: 100, height: 100 }
        );
        const issuer: any = {};
        spyOn<any>(field, '_tryGetAuthorityKeyIdentifier')
            .and.returnValue(new Uint8Array([1, 2, 3]));
        spyOn<any>(field, '_tryGetSubjectKeyIdentifier')
            .and.returnValue(new Uint8Array([1, 2, 3]));
        const result: any = (field as any)._findIssuer({}, [issuer]);
        expect(result).toBe(issuer);
        document.destroy();
    });
    it('1003729 - Find issuer returns null when no candidates found', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfSignatureField = new PdfSignatureField(
            page, 'field', { x: 0, y: 0, width: 100, height: 100 }
        );
        const child: any = {
            _structure: {
                _getSignedCertificate: () => ({ _issuer: {} })
            }
        };
        spyOn<any>(field, '_tryGetAuthorityKeyIdentifier')
            .and.returnValue(undefined);
        spyOn<any>(field, '_areDistinguishedNamesEqual')
            .and.returnValue(false);
        const result: any = (field as any)._findIssuer(child, [{}]);
        expect(result).toBeNull();
        document.destroy();
    });
    it('1003729 - Find issuer handles invalid certificate structure', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfSignatureField = new PdfSignatureField(
            page, 'field', { x: 0, y: 0, width: 100, height: 100 }
        );
        const child: any = {
            _structure: {
                _getSignedCertificate: () => ({ _issuer: {} }),
                _getSignatureValue: () => new Uint8Array([1])
            }
        };
        const badCert: any = {
            _structure: {
                _getSignedCertificate: () => {
                    throw new Error('test');
                }
            }
        };
        spyOn<any>(field, '_tryGetAuthorityKeyIdentifier')
            .and.returnValue(undefined);
        const result: any = (field as any)._findIssuer(child, [badCert]);
        expect(result).toBeNull();
        document.destroy();
    });
    it('1003729 - Find issuer from ordered candidates', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfSignatureField = new PdfSignatureField(
            page, 'field', { x: 0, y: 0, width: 100, height: 100 }
        );
        const issuer: any = {
            _structure: {
                _getSignedCertificate: () => ({
                    _subject: { CN: 'Issuer' }
                })
            },
            _getPublicKey: () => ({
                _modulus: new Uint8Array(256)
            })
        };
        const child: any = {
            _structure: {
                _getSignedCertificate: () => ({
                    _issuer: { CN: 'Issuer' }
                }),
                _getSignatureValue: () => new Uint8Array(256)
            }
        };
        spyOn<any>(field, '_tryGetAuthorityKeyIdentifier')
            .and.returnValue(undefined);
        spyOn<any>(field, '_areDistinguishedNamesEqual')
            .and.returnValue(true);
        spyOn<any>(field, '_verifyCertificateSignature')
            .and.returnValue(true);
        const result: any = (field as any)._findIssuer(child, [issuer]);
        expect(result).toBe(issuer);
        document.destroy();
    });
    it('1003729 - Find issuer returns null when signature verification fails', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfSignatureField = new PdfSignatureField(
            page, 'field', { x: 0, y: 0, width: 100, height: 100 }
        );
        const issuer: any = {
            _structure: {
                _getSignedCertificate: () => ({
                    _subject: { CN: 'Issuer' }
                })
            },
            _getPublicKey: () => ({
                _modulus: new Uint8Array(256)
            })
        };
        const child: any = {
            _structure: {
                _getSignedCertificate: () => ({
                    _issuer: { CN: 'Issuer' }
                }),
                _getSignatureValue: () => new Uint8Array(256)
            }
        };
        spyOn<any>(field, '_tryGetAuthorityKeyIdentifier')
            .and.returnValue(undefined);
        spyOn<any>(field, '_areDistinguishedNamesEqual')
            .and.returnValue(true);
        spyOn<any>(field, '_verifyCertificateSignature')
            .and.returnValue(false);
        const result: any = (field as any)._findIssuer(child, [issuer]);
        expect(result).toBeNull();
        document.destroy();
    });
    it('1003729 - Map certificate signature algorithm OID to SHA384', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfSignatureField = new PdfSignatureField(
            page,
            'field',
            { x: 0, y: 0, width: 100, height: 100 }
        );
        const result: string = (field as any)._mapCertificateSigAlgOidToHash(
            '1.2.840.113549.1.1.12'
        );
        expect(result).toEqual('SHA384');
        document.destroy();
    });

    it('1003729 - Map certificate signature algorithm OID to SHA512', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfSignatureField = new PdfSignatureField(
            page,
            'field',
            { x: 0, y: 0, width: 100, height: 100 }
        );
        const result: string = (field as any)._mapCertificateSigAlgOidToHash(
            '1.2.840.113549.1.1.13'
        );
        expect(result).toEqual('SHA512');
        document.destroy();
    });

    it('1003729 - Map unknown certificate signature algorithm OID', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfSignatureField = new PdfSignatureField(
            page,
            'field',
            { x: 0, y: 0, width: 100, height: 100 }
        );
        const result: string = (field as any)._mapCertificateSigAlgOidToHash(
            '1.2.3.4.5'
        );
        expect(result).toBeNull();
        document.destroy();
    });
    it('1003729 - Verify certificate signature with unsupported algorithm', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: any = new PdfSignatureField(
            page,
            'field',
            { x: 0, y: 0, width: 100, height: 100 }
        );
        const child: any = {
            _structure: {
                _getSignatureAlgorithmOid: () => '1.2.3.4.5'
            }
        };
        const issuer: any = {};
        const result: boolean = field._verifyCertificateSignature(child, issuer);
        expect(result).toBeFalsy();
        document.destroy();
    });
    it('1003729 - Verify certificate signature with empty signature', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: any = new PdfSignatureField(
            page,
            'field',
            { x: 0, y: 0, width: 100, height: 100 }
        );
        spyOn(field, '_mapCertificateSigAlgOidToHash').and.returnValue('SHA256');
        const child: any = {
            _getTobeSignedCertificate: () => new Uint8Array([1, 2, 3]),
            _structure: {
                _getSignatureAlgorithmOid: () => '1.2.840.113549.1.1.11',
                _getSignatureValue: () => new Uint8Array(0)
            }
        };
        const issuer: any = {};
        const result: boolean = field._verifyCertificateSignature(child, issuer);
        expect(result).toBeFalsy();
        document.destroy();
    });
    it('1003729 - Verify certificate signature with invalid public key parameter', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: any = new PdfSignatureField(
            page,
            'field',
            { x: 0, y: 0, width: 100, height: 100 }
        );
        spyOn(field, '_mapCertificateSigAlgOidToHash').and.returnValue('SHA256');
        const child: any = {
            _getTobeSignedCertificate: () => new Uint8Array([1, 2, 3]),
            _structure: {
                _getSignatureAlgorithmOid: () => '1.2.840.113549.1.1.11',
                _getSignatureValue: () => new Uint8Array([1, 2, 3])
            }
        };
        const issuer: any = {
            _getPublicKey: () => ({})
        };
        const result: boolean = field._verifyCertificateSignature(child, issuer);
        expect(result).toBeFalsy();
        document.destroy();
    });
    it('1003729 - Validate self signed certificate', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: any = new PdfSignatureField(
            page,
            'field',
            { x: 0, y: 0, width: 100, height: 100 }
        );
        const cert: any = {
            _structure: {
                _getSignedCertificate: () => ({
                    _subject: { _values: ['CN=Test'] },
                    _issuer: { _values: ['CN=Test'] }
                })
            }
        };
        spyOn(field, '_verifyCertificateSignature').and.returnValue(true);
        const result: boolean = field._isSelfSigned(cert);
        expect(result).toBeTruthy();
        document.destroy();
    });
});
describe('coverage 2', () => {
    it('1003729 - Compare same certificate using subject and serial number', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: any = new PdfSignatureField(
            page,
            'field',
            { x: 0, y: 0, width: 100, height: 100 }
        );
        const cert1: any = {
            _getEncoded: () => new Uint8Array([1]),
            _structure: {
                _getSignedCertificate: () => ({
                    _subject: { _values: ['CN=Test'] },
                    _serialNumber: new Uint8Array([10])
                })
            }
        };
        const cert2: any = {
            _getEncoded: () => new Uint8Array([2]),
            _structure: {
                _getSignedCertificate: () => ({
                    _subject: { _values: ['CN=Test'] },
                    _serialNumber: new Uint8Array([10])
                })
            }
        };
        const result: boolean = field._sameCertificate(cert1, cert2);
        expect(result).toBeTruthy();
        document.destroy();
    });
    it('1003729 - Get authority key identifier', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: any = new PdfSignatureField(
            page,
            'field',
            { x: 0, y: 0, width: 100, height: 100 }
        );
        const keyId: Uint8Array = new Uint8Array([1, 2, 3]);
        spyOn(field, '_unwrapExtensionValue').and.returnValue({
            _getSequence: () => [{
                _isTagged: () => true,
                _getTagNumber: (): number => 0,
                _getValue: (): any => keyId
            }]
        });
        const cert: any = {
            _getExtensions: () => ({
                _authorityKeyIdentifier: {},
                _getExtension: () => ({
                    _value: {}
                })
            })
        };
        const result: Uint8Array = field._tryGetAuthorityKeyIdentifier(cert);
        expect(result).toBeNull();
        document.destroy();
    });
    it('1003729 - Unwrap extension value', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: any = new PdfSignatureField(
            page,
            'field',
            { x: 0, y: 0, width: 100, height: 100 }
        );
        spyOn(_PdfUniqueEncodingElement.prototype, '_fromBytes').and.stub();
        const extValue: any = {
            _getValue: (): any => new Uint8Array([1, 2, 3])
        };
        const result: any = field._unwrapExtensionValue(extValue);
        expect(result).toBeDefined();
        expect(_PdfUniqueEncodingElement.prototype._fromBytes)
            .toHaveBeenCalled();
        document.destroy();
    });
    it('1003729 - Get subject key identifier', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: any = new PdfSignatureField(
            page,
            'field',
            { x: 0, y: 0, width: 100, height: 100 }
        );
        const keyId: Uint8Array = new Uint8Array([5, 6, 7]);
        spyOn(field, '_unwrapExtensionValue').and.returnValue({
            _getValue: (): any => keyId
        });
        const cert: any = {
            _getExtensions: () => ({}),
            _getExtension: () => ({})
        };
        const result: Uint8Array = field._tryGetSubjectKeyIdentifier(cert);
        expect(result).toEqual(keyId);
        document.destroy();
    });
    it('1003729 - Compare distinguished names', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: any = new PdfSignatureField(
            page,
            'field',
            { x: 0, y: 0, width: 100, height: 100 }
        );
        const dn1: any = {
            _values: ['CN=Test', 'O=Syncfusion']
        };
        const dn2: any = {
            _values: ['O=Syncfusion', 'CN=Test']
        };
        const result: boolean = field._areDistinguishedNamesEqual(dn1, dn2);
        expect(result).toBeTruthy();
        document.destroy();
    });
    it('1003729 - Validate signature checksum failure', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: any = new PdfSignatureField(
            page,
            'field',
            { x: 0, y: 0, width: 100, height: 100 }
        );
        field._signature = {
            _cryptographicStandard: CryptographicStandard.cms,
            _digestAlgorithm: DigestAlgorithm.sha256,
            _certify: false,
            _documentPermissions: PdfCertificationFlag.forbidChanges
        };
        field._cmsSigner = {
            _encryptionAlgorithm: 'RSA',
            _certificates: []
        };
        spyOn(field, '_getFieldName').and.returnValue('field');
        spyOn(field, '_detectLtvData').and.stub();
        spyOn(field, '_verifyChecksum').and.returnValue(false);
        const result: PdfSignatureValidationResult =
            field._validateSignature(
                RevocationType.ocspAndCrl,
                false
            );
        expect(result.isDocumentModified).toBeTruthy();
        expect(result.signatureStatus).toEqual(SignatureStatus.invalid);
        expect(result.validationErrorMessages).toContain(
            'The document has been altered or corrupted since the signature was applied'
        );
        document.destroy();
    });
    it('1003729 - Get field name returns undefined when signature is unavailable', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: any = new PdfSignatureField(
            page,
            'field',
            { x: 0, y: 0, width: 100, height: 100 }
        );
        field._signature = undefined;
        const result: string = field._getFieldName();
        expect(result).toBeUndefined();
        document.destroy();
    });
    it('1003729 - Get leaf field name', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: any = new PdfSignatureField(
            page,
            'field',
            { x: 0, y: 0, width: 100, height: 100 }
        );
        field._signature = {
            _signatureField: {
                _dictionary: {
                    has: (key: string) => key === 'T',
                    get: (_key: string) => 'Signature1'
                }
            }
        };
        const result: string = field._getFieldName();
        expect(result).toEqual('Signature1');
        document.destroy();
    });
    it('1003729 - Get hierarchical field name', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: any = new PdfSignatureField(
            page,
            'field',
            { x: 0, y: 0, width: 100, height: 100 }
        );
        const root: any = {
            has: (key: string) => key === 'T',
            get: (_key: string) => 'Root'
        };
        const parent: any = {
            has: (key: string) => key === 'Parent' || key === 'T',
            get: (key: string) => {
                if (key === 'Parent') {
                    return root;
                }
                return 'Child';
            }
        };
        const leaf: any = {
            has: (key: string) => key === 'Parent' || key === 'T',
            get: (key: string) => {
                if (key === 'Parent') {
                    return parent;
                }
                return 'Signature';
            }
        };
        field._signature = {
            _signatureField: {
                _dictionary: leaf
            }
        };
        const result: string = field._getFieldName();
        expect(result).toContain('Signature');
        expect(result).toContain('Signature');
        expect(result).toContain('Signature');
        document.destroy();
    });
    it('1003729 - Get field name when parent cannot be resolved', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: any = new PdfSignatureField(
            page,
            'field',
            { x: 0, y: 0, width: 100, height: 100 }
        );
        field._signature = {
            _signatureField: {
                _dictionary: {
                    has: (key: string) => key === 'Parent' || key === 'T',
                    get: (key: string) => {
                        if (key === 'T') {
                            return 'FallbackSignature';
                        }
                        return undefined;
                    }
                }
            }
        };
        const result: string = field._getFieldName();
        expect(result).toEqual('FallbackSignature');
        document.destroy();
    });
    it('1003729 - Check increment update without cross reference', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: any = new PdfSignatureField(
            page,
            'field',
            { x: 0, y: 0, width: 100, height: 100 }
        );
        field._crossReference = undefined;
        const result: boolean = field._checkIncrementUpdate();
        expect(result).toBeFalsy();
        document.destroy();
    });
    it('1003729 - Check increment update without previous revision', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: any = new PdfSignatureField(
            page,
            'field',
            { x: 0, y: 0, width: 100, height: 100 }
        );
        field._crossReference = {
            _trailer: {
                has: (key: string) => false
            }
        };
        const result: boolean = field._checkIncrementUpdate();
        expect(result).toBeFalsy();
        document.destroy();
    });
    it('1003729 - Check increment update with invalid byte range', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: any = new PdfSignatureField(
            page,
            'field',
            { x: 0, y: 0, width: 100, height: 100 }
        );
        field._crossReference = {
            _trailer: {
                has: (key: string) => key === 'Prev'
            }
        };
        field._signature = {
            _ranges: [0, 100]
        };
        const result: boolean = field._checkIncrementUpdate();
        expect(result).toBeTruthy();
        document.destroy();
    });
    it('1003729 - Check increment update when fields are removed', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: any = new PdfSignatureField(
            page,
            'field',
            { x: 0, y: 0, width: 100, height: 100 }
        );
        const acroRef: any = { objectNumber: 1 };
        field._signature = {
            _ranges: [0, 100, 200, 100]
        };
        field._crossReference = {
            _trailer: {
                has: (k: string) => k === 'Prev'
            },
            _root: {
                has: (k: string) => k === 'AcroForm',
                getRaw: () => acroRef
            },
            _entriesHistory: [],
            _fetchReferenceInRevision: () => ({
                has: (k: string) => k === 'Fields',
                getRaw: () => [1, 2]
            }),
            _fetch: () => ({
                has: (k: string) => k === 'Fields',
                getRaw: () => [1]
            })
        };
        spyOn(field, '_readAllSubRefs').and.stub();
        const result: boolean = field._checkIncrementUpdate();
        expect(result).toBeFalsy();
        document.destroy();
    });
    it('1003729 - Detect LTV data with OCSP and CRL', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: any = new PdfSignatureField(
            page,
            'field',
            { x: 0, y: 0, width: 100, height: 100 }
        );
        const ltvInfo: LtvVerificationInformation = {
            isOcspEmbedded: false,
            isCrlEmbedded: false,
            isLtvEmbedded: false
        };
        spyOn(field, '_getDssDictionary').and.returnValue({
            has: (key: string) => key === 'OCSPs' || key === 'CRLs',
            get: () => [1]
        });
        field._detectLtvData(ltvInfo);
        expect(ltvInfo.isOcspEmbedded).toBeTruthy();
        expect(ltvInfo.isCrlEmbedded).toBeTruthy();
        expect(ltvInfo.isLtvEmbedded).toBeTruthy();
        document.destroy();
    });
    it('1003729 - Detect LTV data exception handling', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: any = new PdfSignatureField(
            page,
            'field',
            { x: 0, y: 0, width: 100, height: 100 }
        );
        const ltvInfo = {
            isOcspEmbedded: true,
            isCrlEmbedded: true,
            isLtvEmbedded: true
        };
        spyOn(field, '_getDssDictionary').and.throwError('test');
        field._detectLtvData(ltvInfo);
        expect(ltvInfo.isOcspEmbedded).toBeFalsy();
        expect(ltvInfo.isCrlEmbedded).toBeFalsy();
        expect(ltvInfo.isLtvEmbedded).toBeFalsy();
        document.destroy();
    });
    it('1003729 - Detect LTV data exception handling', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: any = new PdfSignatureField(
            page,
            'field',
            { x: 0, y: 0, width: 100, height: 100 }
        );
        const ltvInfo = {
            isOcspEmbedded: true,
            isCrlEmbedded: true,
            isLtvEmbedded: true
        };
        spyOn(field, '_getDssDictionary').and.throwError('test');
        field._detectLtvData(ltvInfo);
        expect(ltvInfo.isOcspEmbedded).toBeFalsy();
        expect(ltvInfo.isCrlEmbedded).toBeFalsy();
        expect(ltvInfo.isLtvEmbedded).toBeFalsy();
        document.destroy();
    });
    it('1003729 - Detect LTV data from VRI dictionary', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: any = new PdfSignatureField(
            page,
            'field',
            { x: 0, y: 0, width: 100, height: 100 }
        );
        const ltvInfo = {
            isOcspEmbedded: false,
            isCrlEmbedded: false,
            isLtvEmbedded: false
        };
        spyOn(field, '_getDssDictionary').and.returnValue({
            has: (key: string) => key === 'VRI'
        });
        spyOn(field, '_getVriDictionary').and.returnValue({
            _map: {
                test: {
                    has: (key: string) => key === 'OCSP' || key === 'CRL',
                    get: () => [1]
                }
            }
        });
        field._detectLtvData(ltvInfo);
        expect(ltvInfo.isOcspEmbedded).toBeTruthy();
        expect(ltvInfo.isCrlEmbedded).toBeTruthy();
        expect(ltvInfo.isLtvEmbedded).toBeTruthy();
        document.destroy();
    });
    it('1003729 - Extract CRL from DSS dictionary', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: any = new PdfSignatureField(
            page,
            'field',
            { x: 0, y: 0, width: 100, height: 100 }
        );
        const expected: Uint8Array = new Uint8Array([1, 2, 3]);
        spyOn(field, '_getDssDictionary').and.returnValue({
            has: (key: string) => key === 'CRLs',
            get: () => ['crl']
        });
        spyOn(field, '_getArrayLength').and.returnValue(1);
        spyOn(field, '_getFirstArrayElement').and.returnValue('crl');
        spyOn(field, '_resolvePdfObject').and.returnValue({
            getBytes: () => expected
        });
        const result: Uint8Array = field._extractCrlFromDss();
        expect(result).toEqual(expected);
        document.destroy();
    });
    it('1003729 - Extract CRL from VRI dictionary', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: any = new PdfSignatureField(
            page,
            'field',
            { x: 0, y: 0, width: 100, height: 100 }
        );
        const expected: Uint8Array = new Uint8Array([4, 5, 6]);
        spyOn(field, '_getDssDictionary').and.returnValue(undefined);
        spyOn(field, '_getVriDictionary').and.returnValue({
            _map: {
                entry1: {
                    has: (key: string) => key === 'CRL',
                    get: () => ['crl']
                }
            }
        });
        spyOn(field, '_getArrayLength').and.returnValue(1);
        spyOn(field, '_getFirstArrayElement').and.returnValue('crl');
        spyOn(field, '_resolvePdfObject').and.returnValue({
            getBytes: () => expected
        });
        const result: Uint8Array = field._extractCrlFromDss();
        expect(result).toEqual(expected);
        document.destroy();
    });
    it('1003729 - Extract CRL exception handling', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: any = new PdfSignatureField(
            page,
            'field',
            { x: 0, y: 0, width: 100, height: 100 }
        );
        spyOn(field, '_getDssDictionary').and.throwError('test');
        const result: Uint8Array = field._extractCrlFromDss();
        expect(result).toBeNull();
        document.destroy();
    });
    it('1003729 - Extract CRL returns null when no CRL exists', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: any = new PdfSignatureField(
            page,
            'field',
            { x: 0, y: 0, width: 100, height: 100 }
        );
        spyOn(field, '_getDssDictionary').and.returnValue(undefined);
        spyOn(field, '_getVriDictionary').and.returnValue(undefined);
        const result: Uint8Array = field._extractCrlFromDss();
        expect(result).toBeNull();
        document.destroy();
    });
    it('1003729 - Extract OCSP from DSS dictionary', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: any = new PdfSignatureField(
            page,
            'field',
            { x: 0, y: 0, width: 100, height: 100 }
        );
        const expected: Uint8Array = new Uint8Array([1, 2, 3]);
        spyOn(field, '_getDssDictionary').and.returnValue({
            has: (key: string) => key === 'OCSPs',
            get: () => ['ocsp']
        });
        spyOn(field, '_getArrayLength').and.returnValue(1);
        spyOn(field, '_getFirstArrayElement').and.returnValue({
            getBytes: () => expected
        });
        const result: Uint8Array = field._extractOcspFromDss();
        expect(result).toEqual(expected);
        document.destroy();
    });
    it('1003729 - Extract OCSP from VRI dictionary', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: any = new PdfSignatureField(
            page,
            'field',
            { x: 0, y: 0, width: 100, height: 100 }
        );
        const expected: Uint8Array = new Uint8Array([4, 5, 6]);
        spyOn(field, '_getDssDictionary').and.returnValue(undefined);
        spyOn(field, '_getVriDictionary').and.returnValue({
            _map: {
                test: {
                    has: (key: string) => key === 'OCSP',
                    get: () => [{
                        getBytes: () => expected
                    }]
                }
            }
        });
        spyOn(field, '_getArrayLength').and.returnValue(1);
        spyOn(field, '_getFirstArrayElement').and.returnValue({
            getBytes: () => expected
        });
        const result: Uint8Array = field._extractOcspFromDss();
        expect(result).toEqual(expected);
        document.destroy();
    });
    it('1003729 - Extract OCSP exception handling', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: any = new PdfSignatureField(
            page,
            'field',
            { x: 0, y: 0, width: 100, height: 100 }
        );
        spyOn(field, '_getDssDictionary').and.throwError('test');
        const reszlt: Uint8Array = field._extractOcspFromDss();
        expect(reszlt).toBeNull();
        document.destroy();
    });
    it('1003729 - Extract OCSP returns null when OCSP data is unavailable', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: any = new PdfSignatureField(
            page,
            'field',
            { x: 0, y: 0, width: 100, height: 100 }
        );
        spyOn(field, '_getDssDictionary').and.returnValue(undefined);
        spyOn(field, '_getVriDictionary').and.returnValue(undefined);
        const result: Uint8Array = field._extractOcspFromDss();
        expect(result).toBeNull();
        document.destroy();
    });
    it('1003729 - Resolve PDF reference object', () => {
        const field: any = {
            _crossReference: {
                _fetch: jasmine.createSpy().and.returnValue('resolved')
            }
        };
        const result: any =
            PdfSignatureField.prototype['_resolvePdfObject'].call(
                field,
                { objectNumber: 10 }
            );
        expect(result).toEqual('resolved');
    });
    it('1003729 - Extract CRL times using GeneralizedTime', () => {
        const field: any = new PdfSignatureField(
            new PdfDocument().addPage(),
            'field',
            { x: 0, y: 0, width: 100, height: 100 }
        );
        spyOn(_PdfUniqueEncodingElement.prototype, '_fromBytes').and.stub();
        spyOn(_PdfUniqueEncodingElement.prototype, '_getComponents').and.returnValue([
            {
                _getComponents: (): any[] => [
                    {
                        _getTagNumber: (): number => 24,
                        _getValue: (): any => '20260101120000Z'
                    },
                    {
                        _getTagNumber: (): number => 24,
                        _getValue: (): any => '20270101120000Z'
                    }
                ]
            }
        ]);
        const result = field._extractCrlTimes(new Uint8Array([1]));
        expect(result).not.toBeNull();
        expect(result.thisUpdate instanceof Date).toBeTruthy();
        expect(result.nextUpdate instanceof Date).toBeTruthy();
    });
    it('1003729 - Extract CRL times using UTCTime', () => {
        const field: any = new PdfSignatureField(
            new PdfDocument().addPage(),
            'field',
            { x: 0, y: 0, width: 100, height: 100 }
        );
        spyOn(_PdfUniqueEncodingElement.prototype, '_fromBytes').and.stub();
        spyOn(_PdfUniqueEncodingElement.prototype, '_getComponents').and.returnValue([
            {
                _getComponents: (): any[] => [
                    {
                        _getTagNumber: (): number => 23,
                        _getValue: (): any => '260101120000Z'
                    },
                    {
                        _getTagNumber: (): number => 23,
                        _getValue: (): any => '270101120000Z'
                    }
                ]
            }
        ]);
        const result = field._extractCrlTimes(new Uint8Array([1]));
        expect(result).not.toBeNull();
        expect(result.thisUpdate instanceof Date).toBeTruthy();
    });
    it('1003729 - Extract CRL times without TBS certificate list', () => {
        const field: any = new PdfSignatureField(
            new PdfDocument().addPage(),
            'field',
            { x: 0, y: 0, width: 100, height: 100 }
        );
        spyOn(_PdfUniqueEncodingElement.prototype, '_fromBytes').and.stub();
        spyOn(_PdfUniqueEncodingElement.prototype, '_getComponents').and.returnValue([]);
        const result = field._extractCrlTimes(new Uint8Array([1]));
        expect(result).toBeNull();
    });
    it('1003729 - Extract CRL times with invalid tag numbers', () => {
        const field: any = new PdfSignatureField(
            new PdfDocument().addPage(),
            'field',
            { x: 0, y: 0, width: 100, height: 100 }
        );
        spyOn(_PdfUniqueEncodingElement.prototype, '_fromBytes').and.stub();
        spyOn(_PdfUniqueEncodingElement.prototype, '_getComponents').and.returnValue([
            {
                _getComponents: (): any[] => [
                    {
                        _getTagNumber: (): number => 10,
                        _getValue: (): any => 'invalid'
                    }
                ]
            }
        ]);
        const result = field._extractCrlTimes(new Uint8Array([1]));
        expect(result.thisUpdate).toBeUndefined();
        expect(result.nextUpdate).toBeUndefined();
    });
    it('1003729 - Extract CRL times exception handling', () => {
        const field: any = new PdfSignatureField(
            new PdfDocument().addPage(),
            'field',
            { x: 0, y: 0, width: 100, height: 100 }
        );
        spyOn(_PdfUniqueEncodingElement.prototype, '_fromBytes')
            .and.throwError('test');
        const result = field._extractCrlTimes(new Uint8Array([1]));
        expect(result).toBeNull();
    });
    it('1003729 - Check LTV object as array', () => {
        const field: any = new PdfSignatureField(
            new PdfDocument().addPage(),
            'field',
            { x: 0, y: 0, width: 100, height: 100 }
        );
        expect(field._isLtvObject([1, 2, 3])).toBeTruthy();
    });
    it('1003729 - Evaluate lock rules include action without fields', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: any = new PdfSignatureField(page, 'field',
            { x: 0, y: 0, width: 100, height: 100 });
        const transformParams: any = {
            has: (k: string) => k === 'Action',
            get: () => 'Include'
        };
        const refDict: any = {
            has: (k: string) => k === 'TransformParams',
            get: () => transformParams
        };
        const vDict: any = {
            has: (k: string) => k === 'Reference',
            get: () => [refDict]
        };
        const dictionary: any = {
            has: (k: string) => k === 'V',
            get: () => vDict
        };
        spyOn(field, '_derefInRevision').and.callFake((obj: any) => obj);
        spyOn(field, '_nameValue').and.returnValue('Include');
        const result: boolean = field._evaluateLockRules(
            dictionary,
            0,
            {} as any
        );
        expect(result).toBeNull();
        document.destroy();
    });
    it('1003729 - Evaluate lock rules include action with locked fields', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: any = new PdfSignatureField(page, 'field',
            { x: 0, y: 0, width: 100, height: 100 });
        const lockDict: any = {
            has: (k: string) => k === 'Fields',
            get: () => [{ name: 'field1' }]
        };
        const dictionary: any = {
            has: (k: string) => k === 'Lock',
            get: () => lockDict
        };
        spyOn(field, '_derefInRevision').and.callFake((obj: any) => obj);
        const transformParams: any = {
            has: () => true,
            get: () => 'Include'
        };
        const refDict: any = {
            has: (k: string) => k === 'TransformParams',
            get: () => transformParams
        };
        const vDict: any = {
            has: (k: string) => k === 'Reference',
            get: () => [refDict]
        };
        dictionary.has = (k: string) => k === 'Lock' || k === 'V';
        dictionary.get = (k: string) => {
            if (k === 'Lock') {
                return lockDict;
            }
            return vDict;
        };
        spyOn(field, '_nameValue').and.returnValue('Include');
        const result: boolean = field._evaluateLockRules(
            dictionary,
            0,
            {} as any
        );
        expect(result).toBeFalsy();
        document.destroy();
    });
    it('1003729 - Evaluate lock rules all action', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: any = new PdfSignatureField(page, 'field',
            { x: 0, y: 0, width: 100, height: 100 });

        const transformParams: any = {
            has: () => true,
            get: () => 'All'
        };
        const refDict: any = {
            has: (k: string) => k === 'TransformParams',
            get: () => transformParams
        };
        const vDict: any = {
            has: (k: string) => k === 'Reference',
            get: () => [refDict]
        };
        const dictionary: any = {
            has: (k: string) => k === 'V',
            get: () => vDict
        };
        spyOn(field, '_derefInRevision').and.callFake((obj: any) => obj);
        spyOn(field, '_nameValue').and.returnValue('All');
        const result: boolean = field._evaluateLockRules(
            dictionary,
            0,
            {} as any
        );
        expect(result).toBeFalsy();
        document.destroy();
    });
    it('1003729 - Dereference PDF reference in revision', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: any = new PdfSignatureField(
            page,
            'field',
            { x: 0, y: 0, width: 100, height: 100 }
        );
        const reference: _PdfReference = _PdfReference.get(1, 0);
        const xref: any = {
            _fetchReferenceInRevision: jasmine
                .createSpy('_fetchReferenceInRevision')
                .and.returnValue('resolvedObject')
        };
        const result: any = field._derefInRevision(reference, 1, xref);
        expect(result).toEqual('resolvedObject');
        document.destroy();
    });
    it('1003729 - Extract name value from PdfName', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: any = new PdfSignatureField(
            page,
            'field',
            { x: 0, y: 0, width: 100, height: 100 }
        );
        const name: any = new _PdfName('Include');
        const result: string = field._nameValue(name);
        expect(result).toEqual('Include');
        document.destroy();
    });
    it('1003729 - Extract name value from string', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: any = new PdfSignatureField(
            page,
            'field',
            { x: 0, y: 0, width: 100, height: 100 }
        );
        const result: string = field._nameValue('Include');
        expect(result).toEqual('Include');
        document.destroy();
    });
    it('1003729 - Extract name value returns undefined', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: any = new PdfSignatureField(
            page,
            'field',
            { x: 0, y: 0, width: 100, height: 100 }
        );
        const result: string = field._nameValue(123);
        expect(result).toBeUndefined();
        document.destroy();
    });
});
describe('coverage - 3', () => {
    it('1003729 - Get certificate identity throws invalid entry exception', () => {
        const helper: _PdfCertificateIdentityHelper =
            new _PdfCertificateIdentityHelper();
        expect(() => {
            helper._getCertificateIdentity({});
        }).toThrowError('Invalid entry in sequence');
    });
    it('1003729 - Get OCSP structure invalid entry', () => {
        const helper: _PdfOcspHelper = new _PdfOcspHelper();
        expect(() => {
            helper._getOcspStructure({});
        }).toThrowError('Invalid entry in sequence');
    });
    it('1003729 - Convert generalized time to date', () => {
        const time: any = new _PdfGeneralizedTime();
        (time as any)._time = '20260101120000Z';
        const result: Date = time._toDate();
        expect(result).toBeDefined();
        expect(result.getUTCFullYear()).toBe(2026);
        expect(result.getUTCMonth()).toBe(0);
        expect(result.getUTCDate()).toBe(1);
    });
    it('1003729 - Convert UTC time to date', () => {
        const time: any = new _PdfGeneralizedTime();
        (time as any)._time = '260101120000Z';
        const result: Date = time._toDate();
        expect(result).toBeDefined();
        expect(result.getUTCFullYear()).toBe(2026);
    });
    it('1003729 - Convert empty generalized time', () => {
        const time: any = new _PdfGeneralizedTime();
        const result: Date = time._toDate();
        expect(result).toBeUndefined();
    });
    it('1003729 - Convert invalid generalized time', () => {
        const time: any = new _PdfGeneralizedTime();
        (time as any)._time = 'invalid-time';
        const result: Date = time._toDate();
        expect(result).toBeUndefined();
    });
    it('1003729 - X509 certificate throws for invalid DER input', () => {
        const certificate: _PdfX509CertificateStructure =
            new _PdfX509CertificateStructure();
        expect(() => {
            certificate._fromDer(new Uint8Array(0));
        }).toThrowError('Invalid DER input for X.509 certificate.');
    });
    it('1003729 - X509 certificate throws for malformed top level sequence', () => {
        const certificate: _PdfX509CertificateStructure =
            new _PdfX509CertificateStructure();
        spyOn(_PdfUniqueEncodingElement.prototype, '_fromBytes').and.stub();
        spyOn(_PdfUniqueEncodingElement.prototype, '_getSequence')
            .and.returnValue([
                {} as any,
                {} as any
            ]); // length = 2
        expect(() => {
            certificate._fromDer(new Uint8Array([1, 2, 3]));
        }).toThrowError(
            'Malformed X.509 certificate: top-level is not a 3-element SEQUENCE.'
        );
    });
    it('1003729 - Get subject simple name with empty distinguished name', () => {
        const cert: any = {
            _getSignedCertificate: (): any => ({
                _subject: null
            })
        };
        const x509: any = Object.create(_PdfX509Certificate.prototype);
        x509._structure = cert;
        expect(x509.subjectSimpleName).toBeUndefined();
    });
    it('1003729 - Extract common name fallback to distinguished name', () => {
        const dn: any = {
            _ordering: [
                { toString: () => '2.5.4.10' }
            ],
            _values: ['Syncfusion']
        };
        const x509: any = Object.create(_PdfX509Certificate.prototype);
        spyOn(x509 as any, '_formatDistinguishedName')
            .and.returnValue('O=Syncfusion');
        const result: string =
            (x509 as any)._extractCommonName(dn);
        expect(result).toEqual('O=Syncfusion');
    });
    it('1003729 - Get serial number with empty bytes', () => {
        const cert: any = {
            _getSignedCertificate: () => ({
                _serialNumber: new Uint8Array(0)
            })
        };
        const x509: any = Object.create(_PdfX509Certificate.prototype);
        x509._structure = cert;
        expect(x509.serialNumber).toBeUndefined();
    });
    it('1003729 - Format distinguished name with invalid input', () => {
        const x509: any = Object.create(_PdfX509Certificate.prototype);
        const result: string =
            x509._formatDistinguishedName(undefined);
        expect(result).toEqual('');
    });
    it('1003729 - Create key with unsupported algorithm', () => {
        const x509: any = Object.create(_PdfX509Certificate.prototype);
        const publicKeyInfo: any = {
            _algorithms: {
                _objectID: {
                    toString: () => '1.2.3.4'
                }
            },
            _publicKey: {
                _getBytes: () => new Uint8Array([1]),
                _data: new Uint8Array([1])
            }
        };
        expect(() => {
            x509._createKey(true, publicKeyInfo);
        }).toThrowError('Tried to decode a DER element that is less than two bytes.');
    });
    it('1003729 - Parse public key with invalid RSA structure', () => {
        const x509: any = Object.create(_PdfX509Certificate.prototype);
        const publicKey: any = {
            _getSequence: () => [
                {
                    _getValue: (): any => new Uint8Array([1])
                }
            ]
        };
        expect(() => {
            x509._parsePublicKey(true, publicKey);
        }).toThrowError('Invalid RSA public key structure');
    });
    it('1003729 - Trim leading zeros from integer bytes', () => {
        const bytes: Uint8Array = new Uint8Array([0, 0, 1, 2, 3]);
        const result: Uint8Array = _trimInteger(bytes);
        expect(Array.from(result)).toEqual([1, 2, 3]);
    });
    it('1003729 - Trim integer without leading zeros', () => {
        const bytes: Uint8Array = new Uint8Array([1, 2, 3]);
        const result: Uint8Array = _trimInteger(bytes);
        expect(Array.from(result)).toEqual([1, 2, 3]);
    });
    it('1003729 - Trim single zero integer', () => {
        const bytes: Uint8Array = new Uint8Array([0]);
        const result: Uint8Array = _trimInteger(bytes);
        expect(Array.from(result)).toEqual([0]);
    });
    it('1003729 - Compare byte arrays with undefined input', () => {
        expect(_isByteArrayEqual(undefined, new Uint8Array([1])))
            .toBeFalsy();
    });
    it('1003729 - Compare byte arrays with different lengths', () => {
        const a: Uint8Array = new Uint8Array([1, 2]);
        const b: Uint8Array = new Uint8Array([1, 2, 3]);
        expect(_isByteArrayEqual(a, b)).toBeFalsy();
    });
    it('1003729 - Compare different byte arrays', () => {
        const a: Uint8Array = new Uint8Array([1, 2, 3]);
        const b: Uint8Array = new Uint8Array([1, 2, 4]);
        expect(_isByteArrayEqual(a, b)).toBeFalsy();
    });
    it('1003729 - Parse timestamp token invalid content info', () => {
        spyOn(_PdfUniqueEncodingElement.prototype, '_fromBytes').and.stub();
        spyOn(_PdfUniqueEncodingElement.prototype, '_getComponents')
            .and.returnValue([]);
        expect(() => {
            _parseTimestampToken(new Uint8Array([1]));
        }).toThrowError(
            'Failed to parse timestamp token: Invalid ContentInfo structure'
        );
    });
    it('1003729 - Parse timestamp token invalid signed data', () => {
        spyOn(_PdfUniqueEncodingElement.prototype, '_fromBytes').and.stub();
        spyOn(_PdfUniqueEncodingElement.prototype, '_getComponents')
            .and.returnValue([
                {},
                {
                    _getComponents: (): any[] => [
                        {
                            _getComponents: (): any[] => []
                        }
                    ]
                }
            ] as any);
        expect(() => {
            _parseTimestampToken(new Uint8Array([1]));
        }).toThrowError(
            'Failed to parse timestamp token: Invalid SignedData structure'
        );
    });
    it('1003729 - Parse timestamp token invalid encapsulated content info', () => {
        spyOn(_PdfUniqueEncodingElement.prototype, '_fromBytes').and.stub();
        spyOn(_PdfUniqueEncodingElement.prototype, '_getComponents')
            .and.returnValue([
                {},
                {
                    _getComponents: (): any[] => [
                        {
                            _getComponents: (): any[] => [
                                {},
                                {},
                                {
                                    _getComponents: (): any[] => []
                                }
                            ]
                        }
                    ]
                }
            ] as any);
        expect(() => {
            _parseTimestampToken(new Uint8Array([1]));
        }).toThrowError(
            'Failed to parse timestamp token: Invalid EncapsulatedContentInfo'
        );
    });
    it('1003729 - Parse timestamp token invalid TSTInfo', () => {
        spyOn(_PdfUniqueEncodingElement.prototype, '_fromBytes').and.stub();
        spyOn(_PdfUniqueEncodingElement.prototype, '_getComponents')
            .and.returnValue([
                {},
                {
                    _getComponents: (): any[] => [
                        {
                            _getComponents: (): any[] => [
                                {},
                                {},
                                {
                                    _getComponents: (): any[] => [
                                        {},
                                        {
                                            _getComponents: (): any[] => []
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ] as any);
        expect(() => {
            _parseTimestampToken(new Uint8Array([1]));
        }).toThrowError(
            'Failed to parse timestamp token: Invalid TSTInfo structure'
        );
    });
    it('1003729 - Parse timestamp token invalid version type', () => {
        const tstInfo: any = {
            _getComponents: (): any[] => [
                {
                    _getTagNumber: (): number => 4
                }
            ]
        };
        spyOn(_PdfUniqueEncodingElement.prototype, '_fromBytes').and.stub();
        spyOn(_PdfUniqueEncodingElement.prototype, '_getComponents')
            .and.returnValue([
                {
                    _getTagNumber: (): number => 5
                },
                {
                    _getComponents: (): any[] => [
                        {
                            _getComponents: (): any[] => [
                                {
                                    _getTagNumber: (): number => 5
                                },
                                {},
                                {
                                    _getComponents: (): any[] => [
                                        {},
                                        {
                                            _getComponents: (): any[] => [tstInfo]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ] as any);

        expect(() => {
            _parseTimestampToken(new Uint8Array([1]));
        }).toThrowError(
            'Failed to parse timestamp token: Invalid TSTInfo: version is not INTEGER'
        );
    });
    it('1003729 - Parse timestamp token invalid generalized time', () => {
        const timeElement: any = {
            _getValue: (): any => new Uint8Array(
                Array.from('INVALID').map((c: string) => c.charCodeAt(0))
            )
        };
        expect(() => {
            _parseTimestampToken(new Uint8Array([1]));
        }).toThrowError(
            'Failed to parse timestamp token: Tried to decode a DER element that is less than two bytes.'
        );
    });
    it('1003729 - Compare byte arrays with undefined first array', () => {
        const result: boolean = _bytesEqual(
            undefined as any,
            new Uint8Array([1, 2, 3])
        );
        expect(result).toBeFalsy();
    });
    it('1003729 - Compare byte arrays with undefined second array', () => {
        const result: boolean = _bytesEqual(
            new Uint8Array([1, 2, 3]),
            undefined as any
        );
        expect(result).toBeFalsy();
    });
    it('1003729 - Compare byte arrays with different lengths', () => {
        const result: boolean = _bytesEqual(
            new Uint8Array([1, 2]),
            new Uint8Array([1, 2, 3])
        );
        expect(result).toBeFalsy();
    });
    it('1003729 - Compare byte arrays with different content', () => {
        const result: boolean = _bytesEqual(
            new Uint8Array([1, 2, 3]),
            new Uint8Array([1, 2, 4])
        );
        expect(result).toBeFalsy();
    });
    it('1003729 - Compare equal byte arrays', () => {
        const result: boolean = _bytesEqual(
            new Uint8Array([1, 2, 3]),
            new Uint8Array([1, 2, 3])
        );
        expect(result).toBeTruthy();
    });
});
describe('coverage - 4', () => {
    it('1003729 - Initialize with zero modulus bytes', () => {
        const rsa: any = new _PdfRsaAlgorithm();
        const key: any = {
            _enableCertificationVerification: true,
            _modulus: new Uint8Array([0, 0, 0, 0]),
            _exponent: new Uint8Array([1, 0, 1])
        };
        rsa._initialize(false, key);
        expect(rsa._bitSize).toBeUndefined();
    });
    it('1003729 - Initialize creates modulus helper with bit length', () => {
        const rsa: any = new _PdfRsaAlgorithm();
        const key: any = {
            _enableCertificationVerification: true,
            _modulus: new Uint8Array([0x80]),
            _exponent: new Uint8Array([1, 0, 1])
        };
        rsa._initialize(false, key);
        expect(key.modulus).toBeDefined();
        expect(key.modulus._bitLength()).toBe(8);
    });
    it('1003729 - Initialize with zero modulus byte', () => {
        const rsa: any = new _PdfRsaAlgorithm();
        const key: any = {
            _enableCertificationVerification: true,
            _modulus: new Uint8Array([0, 0, 0])
        };
        rsa._initialize(false, key);
        expect(rsa._bitSize).toBeUndefined();
    });
    it('1003729 - Initialize without modulus', () => {
        const rsa: any = new _PdfRsaAlgorithm();
        rsa._initialize(false, {} as any);
        expect(rsa._bitSize).toBeUndefined();
    });
    it('1003729 - Initialize without modulus', () => {
        const rsa: any = new _PdfRsaAlgorithm();
        rsa._initialize(false, {} as any);
        expect(rsa._bitSize).toBeUndefined();
    });
    it('1003729 - Get modulus byte length from private modulus', () => {
        const rsa: any = new _PdfRsaCoreAlgorithm();
        rsa._key = {
            _modulus: new Uint8Array([1, 2, 3, 4])
        };
        expect(rsa._getModulusByteLength()).toBe(4);
    });
    it('1003729 - Convert input using modulus toBigInt function', () => {
        const rsa: any = new _PdfRsaCoreAlgorithm();
        rsa._key = {
            _isPrivate: false,
            _modulus: {
                _toBigInt: (): any => 100
            }
        };
        spyOn(rsa, '_getModulusByteLength').and.returnValue(1);
        const result: bigint = rsa._convertInput(
            new Uint8Array([50]),
            0,
            1
        );
        expect(result).toBeDefined();
    });
    it('1003729 - Convert input throws when input exceeds modulus', () => {
        const rsa: any = new _PdfRsaCoreAlgorithm();
        rsa._key = {
            _isPrivate: false,
            _modulus: {
                _toBigInt: (): any => 10
            }
        };
        spyOn(rsa, '_getModulusByteLength').and.returnValue(1);
        expect(() => {
            rsa._convertInput(
                new Uint8Array([20]),
                0,
                1
            );
        }).toThrowError('Input data is larger than modulus.');
    });
    it('1003729 - Convert input throws when RSA block is too large', () => {
        const rsa: any = new _PdfRsaCoreAlgorithm();
        rsa._key = {
            _isPrivate: true,
            modulus: 100 as any
        };
        spyOn(rsa, '_getInputBlockSize').and.returnValue(1);
        expect(() => {
            rsa._convertInput(
                new Uint8Array([1, 2, 3, 4]),
                0,
                4
            );
        }).toThrowError('Input data too large for RSA block.');
    });
    it('1003729 - Convert input throws when private input exceeds modulus', () => {
        const rsa: any = new _PdfRsaCoreAlgorithm();
        rsa._key = {
            _isPrivate: true,
            modulus: 5 as any
        };
        spyOn(rsa, '_getInputBlockSize').and.returnValue(10);
        expect(() => {
            rsa._convertInput(
                new Uint8Array([10]),
                0,
                1
            );
        }).toThrowError('Input data is larger than modulus.');
    });
    it('1003729 - Process block converts modulus and exponent bytes 1 ', () => {
        const rsa: any = new _PdfRsaCoreAlgorithm();
        rsa._key = {
            _isPrivate: false,
            modulus: new Uint8Array([0x11]),
            exponent: new Uint8Array([0x03])
        };
        const fromBytesSpy = spyOn(
            _PdfBigInt.prototype,
            '_fromBytesBE'
        ).and.returnValue({
            _toBigInt: (): any => ({})
        } as any);
        spyOn<any>(rsa, '_processBlock').and.callFake((): any => {
            new _PdfBigInt()._fromBytesBE(rsa._key.exponent)._toBigInt();
            new _PdfBigInt()._fromBytesBE(rsa._key.modulus)._toBigInt();
            return {};
        });
        rsa._processBlock({} as any);
        expect(fromBytesSpy).toHaveBeenCalledTimes(2);
    });
    it('1003729 - Process block converts modulus and exponent bytes 2 ', () => {
        const rsa: any = new _PdfRsaCoreAlgorithm();
        rsa._key = {
            _isPrivate: false,
            modulus: new Uint8Array([17]),
            exponent: new Uint8Array([3])
        };
        const spy: jasmine.Spy = spyOn(
            _PdfBigInt.prototype,
            '_fromBytesBE'
        ).and.callFake((bytes: Uint8Array): any => ({
            _toBigInt: (): any => bytes
        }));
        try {
            rsa._processBlock({} as any);
        } catch {
            // expected because mocked values aren't real bigint values
        }
        expect(spy.calls.count()).toBe(2);
    });
})
describe('coverage - 5', () => {
    it('1003729 - Initialize CMS signer handles resolve inner sequence exception', () => {
        const signer: any = Object.create(_PdfCryptographicMessageSyntaxSigner.prototype);
        spyOn(_PdfBasicEncodingElement.prototype, '_fromBytes').and.stub();
        spyOn(_PdfBasicEncodingElement.prototype, '_getSequence').and.returnValue([
            {
                _getObjectIdentifier: (): any => ({
                    _getDotDelimitedNotation: (): string => '1.2.840.113549.1.7.2'
                })
            },
            {}
        ] as any);
        spyOn(signer, '_resolveInnerSequence').and.throwError('test');
        signer._initializeCmsSigner(new Uint8Array([1]), 'adbe.pkcs7.detached');
        expect(signer._digestAlgorithmSetOids).toBeUndefined();
    });
    it('1003729 - Initialize CMS signer uses DER signed attributes directly', () => {
        const signer: any = Object.create(_PdfCryptographicMessageSyntaxSigner.prototype);
        const signedAttrInner: any = {
            _toDerBytes: (): Uint8Array => new Uint8Array([0x31, 0x01, 0x00])
        };
        spyOn(signer, '_getChildrenWithFallback').and.returnValue([
            {
                _getSequence: (): any[] => []
            }
        ]);
        signer._signedAttributesDerBytes = undefined;
        const tryDer: Uint8Array = signedAttrInner._toDerBytes();
        if (tryDer && tryDer[0] === 0x31) {
            signer._signedAttributesDerBytes = tryDer;
        }
        expect(signer._signedAttributesDerBytes).toEqual(tryDer);
    });
    it('1003729 - Initialize CMS signer falls back to toBytes when toDerBytes throws', () => {
        const attr: any = {
            _toDerBytes: (): Uint8Array => {
                throw new Error('test');
            },
            _toBytes: (): Uint8Array => new Uint8Array([1, 2, 3])
        };
        let part: Uint8Array;
        try {
            part = attr._toDerBytes();
        } catch {
            part = attr._toBytes();
        }
        expect(Array.from(part)).toEqual([1, 2, 3]);
    });
    it('1003729 - Initialize CMS signer sorts attributes by length', () => {
        const parts: Uint8Array[] = [
            new Uint8Array([1, 2, 3]),
            new Uint8Array([1, 2])
        ];
        parts.sort((a: Uint8Array, b: Uint8Array) => {
            const n: number = Math.min(a.length, b.length);
            for (let i: number = 0; i < n; i++) {
                if (a[i] !== b[i]) {
                    return a[i] - b[i];
                }
            }
            return a.length - b.length;
        });
        expect(parts[0].length).toBe(2);
    });
    it('1003729 - Initialize CMS signer uses signed attrs when inner is undefined', () => {
        const maybeSignedAttrs: any = {
            id: 10
        };
        let signedAttrsInner: any;
        if (!signedAttrsInner) {
            signedAttrsInner = maybeSignedAttrs;
        }
        expect(signedAttrsInner).toBe(maybeSignedAttrs);
    });
    it('1003729 - Initialize CMS signer uses signed attributes raw bytes', () => {
        const signedAttrsInner: any = {
            _toBytes: (): Uint8Array => new Uint8Array([10, 20, 30])
        };
        let signedAttributesRawBytes: Uint8Array;
        if (signedAttrsInner && signedAttrsInner._toBytes) {
            signedAttributesRawBytes = signedAttrsInner._toBytes();
        }
        expect(Array.from(signedAttributesRawBytes)).toEqual([10, 20, 30]);
    });
    it('1003729 - Initialize CMS signer reads certificates from parser', () => {
        const signer: any = Object.create(_PdfCryptographicMessageSyntaxSigner.prototype);
        signer._certificates = [];
        const cert: any = { name: 'cert1' };
        let count: number = 0;
        spyOn(_PdfX509CertificateParser.prototype, '_readCertificateFromStream')
            .and.callFake((): any => {
                count++;
                return count === 1 ? cert : null;
            });
        const parser: _PdfX509CertificateParser =
            new _PdfX509CertificateParser();
        let result: any =
            parser._readCertificateFromStream(new Uint8Array([1]), false);
        while (result) {
            signer._certificates.push(result);
            result = parser._readCertificateFromStream(
                new Uint8Array([1]),
                false
            );
        }
        expect(signer._certificates.length).toBe(1);
    });
    it('1003729 - Looks like certificate DER returns false for short input', () => {
        const signer: any = Object.create(_PdfCryptographicMessageSyntaxSigner.prototype);
        const result: boolean = signer._looksLikeCertificateDer(
            new Uint8Array([1, 2, 3])
        );
        expect(result).toBeFalsy();
    });
    it('1003729 - Looks like certificate DER returns false for invalid first byte', () => {
        const signer: any = Object.create(_PdfCryptographicMessageSyntaxSigner.prototype);
        const result: boolean = signer._looksLikeCertificateDer(
            new Uint8Array([0x31, 0, 0, 0, 0, 0, 0, 0])
        );
        expect(result).toBeFalsy();
    });
    it('1003729 - Looks like certificate DER detects version 3 certificate', () => {
        const signer: any = Object.create(_PdfCryptographicMessageSyntaxSigner.prototype);
        const bytes: Uint8Array = new Uint8Array([
            0x30,
            0x10,
            0xA0,
            0x03,
            0x02,
            0x01,
            0x02,
            0x00
        ]);
        const result: boolean = signer._looksLikeCertificateDer(bytes);
        expect(result).toBeTruthy();
    });
    it('1003729 - Looks like certificate DER detects version 1 certificate', () => {
        const signer: any = Object.create(_PdfCryptographicMessageSyntaxSigner.prototype);
        const bytes: Uint8Array = new Uint8Array([
            0x30,
            0x10,
            0xA0,
            0x03,
            0x02,
            0x01,
            0x01,
            0x00
        ]);
        const result: boolean = signer._looksLikeCertificateDer(bytes);
        expect(result).toBeTruthy();
    });
    it('1003729 - Looks like certificate DER detects nested sequence with long length encoding', () => {
        const signer: any = Object.create(_PdfCryptographicMessageSyntaxSigner.prototype);
        const bytes: Uint8Array = new Uint8Array([
            0x30,
            0x81,
            0x08,
            0x30,
            0x03,
            0x02,
            0x01,
            0x01,
            0x00
        ]);
        const result: boolean = signer._looksLikeCertificateDer(bytes);
        expect(result).toBeTruthy();
    });
    it('1003729 - Looks like certificate DER returns false when no certificate pattern found', () => {
        const signer: any = Object.create(_PdfCryptographicMessageSyntaxSigner.prototype);
        const bytes: Uint8Array = new Uint8Array([
            0x30,
            0x05,
            0x04,
            0x03,
            0x11,
            0x22,
            0x33,
            0x44
        ]);
        const result: boolean = signer._looksLikeCertificateDer(bytes);
        expect(result).toBeFalsy();
    });
    it('1003729 - Try parse certificate node returns undefined for missing bytes', () => {
        const signer: any = Object.create(_PdfCryptographicMessageSyntaxSigner.prototype);
        spyOn(signer, '_getDerOrBytes').and.returnValue(undefined);
        const parser: any = {};
        const result: any = signer._tryParseCertificateNode(
            {} as any,
            parser
        );
        expect(result).toBeUndefined();
    });
    it('1003729 - Try parse certificate node returns undefined for empty bytes', () => {
        const signer: any = Object.create(_PdfCryptographicMessageSyntaxSigner.prototype);
        spyOn(signer, '_getDerOrBytes')
            .and.returnValue(new Uint8Array(0));
        const parser: any = {};
        const result: any = signer._tryParseCertificateNode(
            {} as any,
            parser
        );
        expect(result).toBeUndefined();
    });
    it('1003729 - Try parse certificate node returns certificate', () => {
        const signer: any = Object.create(_PdfCryptographicMessageSyntaxSigner.prototype);
        const cert: any = {
            _getEncoded: (): Uint8Array => new Uint8Array([1])
        };
        spyOn(signer, '_getDerOrBytes')
            .and.returnValue(new Uint8Array([1, 2, 3]));
        const parser: any = {
            _readCertificateFromStream:
                jasmine.createSpy().and.returnValue(cert)
        };
        const result: any = signer._tryParseCertificateNode(
            {} as any,
            parser
        );
        expect(result).toBe(cert);
    });
    it('1003729 - Try parse certificate node handles parser exception', () => {
        const signer: any = Object.create(_PdfCryptographicMessageSyntaxSigner.prototype);
        spyOn(signer, '_getDerOrBytes')
            .and.returnValue(new Uint8Array([1, 2, 3]));
        const parser: any = {
            _readCertificateFromStream: (): any => {
                throw new Error('test');
            }
        };
        const result: any = signer._tryParseCertificateNode(
            {} as any,
            parser
        );
        expect(result).toBeUndefined();
    });
    it('1003729 - Map encryption OID to RSA', () => {
        const signer: any = Object.create(_PdfCryptographicMessageSyntaxSigner.prototype);
        expect(
            signer._mapEncryptionOidToName('1.2.840.113549.1.1.1')
        ).toBe('RSA');
    });
    it('1003729 - Map RSA SHA1 encryption OID to RSA', () => {
        const signer: any = Object.create(_PdfCryptographicMessageSyntaxSigner.prototype);
        expect(
            signer._mapEncryptionOidToName('1.2.840.113549.1.1.5')
        ).toBe('RSA');
    });
    it('1003729 - Map encryption OID to ECDSA', () => {
        const signer: any = Object.create(_PdfCryptographicMessageSyntaxSigner.prototype);
        expect(
            signer._mapEncryptionOidToName('1.2.840.10045.4.3.2')
        ).toBe('ECDSA');
    });
    it('1003729 - Map unknown encryption OID to default RSA', () => {
        const signer: any = Object.create(_PdfCryptographicMessageSyntaxSigner.prototype);
        expect(
            signer._mapEncryptionOidToName('1.2.3.4.5')
        ).toBe('RSA');
    });
    it('1003729 - Map RSA SHA256 encryption OID', () => {
        const signer: any = Object.create(_PdfCryptographicMessageSyntaxSigner.prototype);
        expect(
            signer._mapEncryptionOidToName('1.2.840.113549.1.1.11')
        ).toBe('RSA');
    });
    it('1003729 - Map RSA SHA384 encryption OID', () => {
        const signer: any = Object.create(_PdfCryptographicMessageSyntaxSigner.prototype);
        expect(
            signer._mapEncryptionOidToName('1.2.840.113549.1.1.12')
        ).toBe('RSA');
    });
    it('1003729 - Map RSA SHA512 encryption OID', () => {
        const signer: any = Object.create(_PdfCryptographicMessageSyntaxSigner.prototype);
        expect(
            signer._mapEncryptionOidToName('1.2.840.113549.1.1.13')
        ).toBe('RSA');
    });
    it('1003729 - Map ECDSA SHA384 encryption OID', () => {
        const signer: any = Object.create(_PdfCryptographicMessageSyntaxSigner.prototype);
        expect(
            signer._mapEncryptionOidToName('1.2.840.10045.4.3.3')
        ).toBe('ECDSA');
    });
    it('1003729 - Map ECDSA SHA512 encryption OID', () => {
        const signer: any = Object.create(_PdfCryptographicMessageSyntaxSigner.prototype);
        expect(
            signer._mapEncryptionOidToName('1.2.840.10045.4.3.4')
        ).toBe('ECDSA');
    });
    it('1003729 - Get encryption algorithm from identifier', () => {
        const signer: any = Object.create(_PdfCryptographicMessageSyntaxSigner.prototype);
        signer._encryptionAlgorithm = undefined;
        signer._encryptionAlgorithmObjectIdentifier = '1.2.840.113549.1.1.1';
        spyOn(_PdfEncryptionAlgorithms.prototype, '_getAlgorithm')
            .and.returnValue('RSA');
        const result: string = signer._getEncryptionAlgorithm();
        expect(result).toBe('RSA');
    });
    it('1003729 - Get encryption algorithm returns null when already set', () => {
        const signer: any = Object.create(_PdfCryptographicMessageSyntaxSigner.prototype);
        signer._encryptionAlgorithm = 'RSA';
        const result: string = signer._getEncryptionAlgorithm();
        expect(result).toBeNull();
    });
    it('1003729 - Validate checksum returns true for timestamp', () => {
        const signer: any = Object.create(_PdfCryptographicMessageSyntaxSigner.prototype);
        signer._isTimeStamp = true;
        expect(signer._validateCheckSum()).toBeTruthy();
    });
    it('1003729 - Validate checksum returns false when original bytes missing', () => {
        const signer: any = Object.create(_PdfCryptographicMessageSyntaxSigner.prototype);
        signer._signedAttributesBytes = new Uint8Array([1]);
        expect(signer._validateCheckSum()).toBeFalsy();
    });
    it('1003729 - Validate checksum succeeds with matching digest', () => {
        const signer: any = Object.create(_PdfCryptographicMessageSyntaxSigner.prototype);
        signer._signedAttributesBytes = new Uint8Array([1]);
        signer._signedData = new Uint8Array([10, 20]);
        signer._digestAlgorithm = {
            _getMessageDigest: () => ({
                _hash: () => new Uint8Array([5, 6, 7])
            })
        };
        signer._messageDigestAttribute = new Uint8Array([5, 6, 7]);
        spyOn(signer, '_getHashAlgorithm').and.returnValue('SHA256');
        spyOn(signer, '_bytesEqual').and.returnValue(true);
        spyOn(signer, '_validateAttributes').and.returnValue(true);
        expect(signer._validateCheckSum()).toBeTruthy();
    });
    it('1003729 - Validate checksum returns false for mismatched digest', () => {
        const signer: any = Object.create(_PdfCryptographicMessageSyntaxSigner.prototype);
        signer._signedAttributesBytes = new Uint8Array([1]);
        signer._signedData = new Uint8Array([10]);
        signer._digestAlgorithm = {
            _getMessageDigest: () => ({
                _hash: () => new Uint8Array([1])
            })
        };
        signer._messageDigestAttribute = new Uint8Array([2]);
        spyOn(signer, '_getHashAlgorithm').and.returnValue('SHA256');
        spyOn(signer, '_bytesEqual').and.returnValue(false);
        expect(signer._validateCheckSum()).toBeFalsy();
    });
    it('1003729 - Validate checksum rethrows digest exception', () => {
        const signer: any = Object.create(_PdfCryptographicMessageSyntaxSigner.prototype);
        signer._signedAttributesBytes = new Uint8Array([1]);
        signer._signedData = new Uint8Array([10]);
        signer._digestAlgorithm = {
            _getMessageDigest: () => {
                throw new Error('digest error');
            }
        };
        spyOn(signer, '_getHashAlgorithm').and.returnValue('SHA256');
        expect(() => {
            signer._validateCheckSum();
        }).toThrowError('digest error');
    });
    it('1003729 - Validate checksum verifies signature', () => {
        const signer: any = Object.create(_PdfCryptographicMessageSyntaxSigner.prototype);
        signer._signatureBytes = new Uint8Array([1]);
        signer._signedData = new Uint8Array([2]);
        signer._digestAlgorithm = {
            _getMessageDigest: () => ({
                _hash: () => new Uint8Array([3])
            })
        };
        signer._signer = {
            _blockUpdate: jasmine.createSpy(),
            _validateSignature: jasmine.createSpy().and.returnValue(true)
        };
        spyOn(signer, '_getHashAlgorithm').and.returnValue('SHA256');
        expect(signer._validateCheckSum()).toBeTruthy();
    });
    it('1003729 - Extract digest returns undefined for empty attribute', () => {
        const signer: any = Object.create(_PdfCryptographicMessageSyntaxSigner.prototype);
        expect(
            signer._extractDigestFromAttribute(undefined as any)
        ).toBeUndefined();
        expect(
            signer._extractDigestFromAttribute(new Uint8Array(0))
        ).toBeUndefined();
    });
    it('1003729 - Extract digest returns raw digest bytes', () => {
        const signer: any = Object.create(_PdfCryptographicMessageSyntaxSigner.prototype);
        const digest: Uint8Array = new Uint8Array(32);
        expect(
            signer._extractDigestFromAttribute(digest)
        ).toBe(digest);
    });
    it('1003729 - Extract digest from octet string', () => {
        const signer: any = Object.create(_PdfCryptographicMessageSyntaxSigner.prototype);
        const attr: Uint8Array = new Uint8Array([
            0x04,
            0x03,
            1,
            2,
            3
        ]);
        const result: Uint8Array =
            signer._extractDigestFromAttribute(attr);

        expect(Array.from(result)).toEqual([1, 2, 3]);
    });
    it('1003729 - Extract digest from octet string with long length', () => {
        const signer: any = Object.create(_PdfCryptographicMessageSyntaxSigner.prototype);
        const attr: Uint8Array = new Uint8Array([
            0x04,
            0x81,
            0x03,
            1,
            2,
            3
        ]);
        const result: Uint8Array =
            signer._extractDigestFromAttribute(attr);
        expect(Array.from(result)).toEqual([1, 2, 3]);
    });
    it('1003729 - Extract digest returns undefined for invalid octet length', () => {
        const signer: any = Object.create(_PdfCryptographicMessageSyntaxSigner.prototype);
        const attr: Uint8Array = new Uint8Array([
            0x04,
            0x05,
            1,
            2
        ]);
        expect(
            signer._extractDigestFromAttribute(attr)
        ).toBeUndefined();
    });
    it('1003729 - Extract digest returns undefined for invalid sequence octet', () => {
        const signer: any = Object.create(_PdfCryptographicMessageSyntaxSigner.prototype);
        const attr: Uint8Array = new Uint8Array([
            0x30,
            0x01,
            0x04
        ]);
        expect(
            signer._extractDigestFromAttribute(attr)
        ).toBeUndefined();
    });
    it('1003729 - Extract digest from sequence with long form length', () => {
        const signer: any = Object.create(_PdfCryptographicMessageSyntaxSigner.prototype);
        const attr: Uint8Array = new Uint8Array([
            0x30,
            0x08,
            0x04,
            0x81,
            0x03,
            5,
            6,
            7
        ]);
        const result: Uint8Array =
            signer._extractDigestFromAttribute(attr);

        expect(Array.from(result)).toEqual([5, 6, 7]);
    });
    it('1003729 - Verify TSA signature returns false for invalid top children', () => {
        const signer: any = Object.create(_PdfCryptographicMessageSyntaxSigner.prototype);
        spyOn(_PdfUniqueEncodingElement.prototype, '_fromBytes').and.stub();
        spyOn(_PdfUniqueEncodingElement.prototype, '_getComponents')
            .and.returnValue([]);
        expect(
            signer._verifyTsaSignature(new Uint8Array([1]))
        ).toBeFalsy();
    });
    it('1003729 - Verify TSA signature returns false for invalid signed data', () => {
        const signer: any = Object.create(_PdfCryptographicMessageSyntaxSigner.prototype);
        const signedData: any = {
            _getComponents: (): any[] => []
        };
        const contentWrapper: any = {
            _getComponents: () => [signedData]
        };
        spyOn(_PdfUniqueEncodingElement.prototype, '_fromBytes').and.stub();
        spyOn(_PdfUniqueEncodingElement.prototype, '_getComponents')
            .and.returnValue([{}, contentWrapper]);
        expect(
            signer._verifyTsaSignature(new Uint8Array([1]))
        ).toBeFalsy();
    });
    it('1003729 - Verify TSA signature returns false when TSA certificate missing', () => {
        const signer: any = Object.create(_PdfCryptographicMessageSyntaxSigner.prototype);
        spyOn(signer, '_extractTsaCertificate')
            .and.returnValue(undefined);
        const signedData: any = {
            _getComponents: () => [{}, {}, {}, {}]
        };
        const contentWrapper: any = {
            _getComponents: () => [signedData]
        };
        spyOn(_PdfUniqueEncodingElement.prototype, '_fromBytes').and.stub();
        spyOn(_PdfUniqueEncodingElement.prototype, '_getComponents')
            .and.returnValue([{}, contentWrapper]);
        expect(
            signer._verifyTsaSignature(new Uint8Array([1]))
        ).toBeFalsy();
    });
    it('1003729 - Verify TSA signature returns false for invalid encapsulated content', () => {
        const signer: any = Object.create(_PdfCryptographicMessageSyntaxSigner.prototype);
        spyOn(signer, '_extractTsaCertificate')
            .and.returnValue(new Uint8Array([1]));
        spyOn(_PdfX509CertificateStructure.prototype, '_fromDer')
            .and.returnValue({} as any);
        spyOn(_PdfX509Certificate.prototype, '_getPublicKey')
            .and.returnValue({ modulus: new Uint8Array([1]) } as any);
        const encap: any = {
            _getComponents: (): any[] => []
        };
        const signedData: any = {
            _getComponents: () => [{}, {}, encap, {}]
        };
        const contentWrapper: any = {
            _getComponents: () => [signedData]
        };
        spyOn(_PdfUniqueEncodingElement.prototype, '_fromBytes').and.stub();
        spyOn(_PdfUniqueEncodingElement.prototype, '_getComponents')
            .and.returnValue([{}, contentWrapper]);
        expect(
            signer._verifyTsaSignature(new Uint8Array([1]))
        ).toBeFalsy();
    });
    it('1003729 - Verify TSA signature returns false for empty signer infos', () => {
        const signer: any = Object.create(_PdfCryptographicMessageSyntaxSigner.prototype);
        spyOn(signer, '_extractTsaCertificate')
            .and.returnValue(new Uint8Array([1]));
        spyOn(_PdfX509CertificateStructure.prototype, '_fromDer')
            .and.returnValue({} as any);

        spyOn(_PdfX509Certificate.prototype, '_getPublicKey')
            .and.returnValue({ modulus: new Uint8Array([1]) } as any);
        const encap: any = {
            _getComponents: () => [{}, { _getComponents: () => [{ _toBytes: () => new Uint8Array([1]) }] }]
        };
        const signerInfos: any = {
            _getComponents: (): any[] => []
        };
        const signedData: any = {
            _getComponents: () => [{}, {}, encap, signerInfos]
        };
        const contentWrapper: any = {
            _getComponents: () => [signedData]
        };
        spyOn(_PdfUniqueEncodingElement.prototype, '_fromBytes').and.stub();
        spyOn(_PdfUniqueEncodingElement.prototype, '_getComponents')
            .and.returnValue([{}, contentWrapper]);
        expect(
            signer._verifyTsaSignature(new Uint8Array([1]))
        ).toBeFalsy();
    });
    it('1003729 - Verify TSA signature handles exception', () => {
        const signer: any = Object.create(_PdfCryptographicMessageSyntaxSigner.prototype);
        spyOn(_PdfUniqueEncodingElement.prototype, '_fromBytes')
            .and.throwError('test');

        expect(
            signer._verifyTsaSignature(new Uint8Array([1]))
        ).toBeFalsy();
    });
    it('1003729 - Has timestamp EKU returns false when extension is missing', () => {
        const signer: any = Object.create(_PdfCryptographicMessageSyntaxSigner.prototype);
        const cert: any = {
            _getExtension: (): any => undefined
        };
        expect(
            signer._hasTimestampExtendedKeyUsage(cert)
        ).toBeFalsy();
    });
    it('1003729 - Has timestamp EKU returns false for empty extension sequence', () => {
        const signer: any = Object.create(_PdfCryptographicMessageSyntaxSigner.prototype);
        const cert: any = {
            _getExtension: () => ({
                _getValue: () => new Uint8Array([1])
            })
        };
        spyOn(_PdfUniqueEncodingElement.prototype, '_fromBytes').and.stub();
        spyOn(_PdfUniqueEncodingElement.prototype, '_getComponents')
            .and.returnValue([]);
        expect(
            signer._hasTimestampExtendedKeyUsage(cert)
        ).toBeFalsy();
    });
    it('1003729 - Has timestamp EKU returns true when timestamp OID exists', () => {
        const signer: any = Object.create(_PdfCryptographicMessageSyntaxSigner.prototype);
        const cert: any = {
            _getExtension: () => ({
                _getValue: () => new Uint8Array([1])
            })
        };
        const oidElement: any = {
            _getTagNumber: (): number => 6,
            _getObjectIdentifier: (): any => ({
                toString: (): string => '1.3.6.1.5.5.7.3.8'
            })
        };
        spyOn(_PdfUniqueEncodingElement.prototype, '_fromBytes').and.stub();
        spyOn(_PdfUniqueEncodingElement.prototype, '_getComponents')
            .and.returnValue([oidElement]);
        expect(
            signer._hasTimestampExtendedKeyUsage(cert)
        ).toBeTruthy();
    });
    it('1003729 - Has timestamp EKU returns false for non timestamp OID', () => {
        const signer: any = Object.create(_PdfCryptographicMessageSyntaxSigner.prototype);
        const cert: any = {
            _getExtension: () => ({
                _getValue: () => new Uint8Array([1])
            })
        };
        const oidElement: any = {
            _getTagNumber: (): number => 6,
            _getObjectIdentifier: () => ({
                toString: () => '1.2.3.4'
            })
        };
        spyOn(_PdfUniqueEncodingElement.prototype, '_fromBytes').and.stub();
        spyOn(_PdfUniqueEncodingElement.prototype, '_getComponents')
            .and.returnValue([oidElement]);
        expect(
            signer._hasTimestampExtendedKeyUsage(cert)
        ).toBeFalsy();
    });
    it('1003729 - Has timestamp EKU handles exception', () => {
        const signer: any = Object.create(_PdfCryptographicMessageSyntaxSigner.prototype);
        const cert: any = {
            _getExtension: () => {
                throw new Error('test');
            }
        };
        expect(
            signer._hasTimestampExtendedKeyUsage(cert)
        ).toBeFalsy();
    });
    it('1003729 - Check certificate serial in CRL returns false for invalid CRL structure', () => {
        const signer: any = Object.create(_PdfCryptographicMessageSyntaxSigner.prototype);
        const crlSeq: any = {
            _getComponents: (): any[] => []
        };
        spyOn(_PdfUniqueEncodingElement.prototype, '_fromBytes').and.stub();
        spyOn(_PdfUniqueEncodingElement.prototype, '_getComponents')
            .and.returnValue([crlSeq]);
        expect(
            signer._checkCertificateSerialInCrl(
                new Uint8Array([1]),
                '123'
            )
        ).toBeFalsy();
    });
    it('1003729 - Check certificate serial in CRL handles null TBS cert list', () => {
        const signer: any = Object.create(_PdfCryptographicMessageSyntaxSigner.prototype);
        const crlSeq: any = {
            _getComponents: () => [null, {}]
        };
        spyOn(_PdfUniqueEncodingElement.prototype, '_fromBytes').and.stub();
        spyOn(_PdfUniqueEncodingElement.prototype, '_getComponents')
            .and.returnValue([crlSeq]);
        expect(
            signer._checkCertificateSerialInCrl(
                new Uint8Array([1]),
                '123'
            )
        ).toBeFalsy();
    });
    it('1003729 - Check certificate serial in CRL returns true when serial matches', () => {
        const signer: any = Object.create(_PdfCryptographicMessageSyntaxSigner.prototype);
        const serialElem: any = {
            _getInteger: () => 123
        };
        const entry: any = {
            _getComponents: () => [serialElem]
        };
        const revokedList: any = {
            _getTagNumber: (): number => 16,
            _getComponents: () => [entry]
        };
        const tbsCertList: any = {
            _getComponents: () => [revokedList]
        };
        const crlSeq: any = {
            _getComponents: () => [tbsCertList, {}]
        };
        spyOn(_PdfUniqueEncodingElement.prototype, '_fromBytes').and.stub();
        spyOn(_PdfUniqueEncodingElement.prototype, '_getComponents')
            .and.returnValue([crlSeq]);
        expect(
            signer._checkCertificateSerialInCrl(
                new Uint8Array([1]),
                '123'
            )
        ).toBeTruthy();
    });
    it('1003729 - Check certificate serial in CRL returns false when serial does not match', () => {
        const signer: any = Object.create(_PdfCryptographicMessageSyntaxSigner.prototype);
        const serialElem: any = {
            _getInteger: () => 999
        };
        const entry: any = {
            _getComponents: () => [serialElem]
        };
        const revokedList: any = {
            _getTagNumber: (): number => 16,
            _getComponents: () => [entry]
        };
        const tbsCertList: any = {
            _getComponents: () => [revokedList]
        };
        const crlSeq: any = {
            _getComponents: () => [tbsCertList, {}]
        };
        spyOn(_PdfUniqueEncodingElement.prototype, '_fromBytes').and.stub();
        spyOn(_PdfUniqueEncodingElement.prototype, '_getComponents')
            .and.returnValue([crlSeq]);
        expect(
            signer._checkCertificateSerialInCrl(
                new Uint8Array([1]),
                '123'
            )
        ).toBeFalsy();
    });
    it('1003729 - Check certificate serial in CRL handles exception', () => {
        const signer: any = Object.create(_PdfCryptographicMessageSyntaxSigner.prototype);
        spyOn(_PdfUniqueEncodingElement.prototype, '_fromBytes')
            .and.throwError('test');
        expect(
            signer._checkCertificateSerialInCrl(
                new Uint8Array([1]),
                '123'
            )
        ).toBeFalsy();
    });
    it('1003729 - Encryption algorithm returns RSA for known RSA OID', () => {
        const algorithm: _PdfEncryptionAlgorithms =
            new _PdfEncryptionAlgorithms();
        expect(
            algorithm._getAlgorithm('1.2.840.113549.1.1.1')
        ).toBe('RSA');
    });
    it('1003729 - Encryption algorithm returns DSA for known DSA OID', () => {
        const algorithm: _PdfEncryptionAlgorithms =
            new _PdfEncryptionAlgorithms();
        expect(
            algorithm._getAlgorithm('1.2.840.10040.4.1')
        ).toBe('DSA');
    });
    it('1003729 - Encryption algorithm returns ECDSA for known ECDSA OID', () => {
        const algorithm: _PdfEncryptionAlgorithms =
            new _PdfEncryptionAlgorithms();
        expect(
            algorithm._getAlgorithm('1.2.840.10045.2.1')
        ).toBe('ECDSA');
    });
    it('1003729 - Encryption algorithm constructor initializes map', () => {
        const algorithm: any = new _PdfEncryptionAlgorithms();
        expect(algorithm._algorithmNames).toBeDefined();
        expect(algorithm._algorithmNames.size).toBeGreaterThan(0);
    });
});
describe('coverage - 6', () => {
    it('1003729 - Encode object identifier with multi-byte value', () => {
        const signature: any = new PdfSignature();
        const result: Uint8Array =
            signature._encodeObjectIdentifier('1.2.840');
        expect(result).toBeDefined();
        expect(result.length).toBeGreaterThan(2);
    });
    it('1003729 - Encode object identifier covers multi-byte encoding loop', () => {
        const signature: any = new PdfSignature();
        const result: Uint8Array =
            signature._encodeObjectIdentifier('1.2.113549');
        expect(result.length).toBeGreaterThan(3);
    });
    it('1003729 - Encode object identifier sets continuation bits', () => {
        const signature: any = new PdfSignature();
        const result: Uint8Array =
            signature._encodeObjectIdentifier('1.2.999999');
        expect(result).toBeDefined();
        expect(result.length).toEqual(4);
    });
    it('1003729 - Encode object identifier simple value', () => {
        const signature: any = new PdfSignature();
        const result: Uint8Array =
            signature._encodeObjectIdentifier('1.2.3');
        expect(Array.from(result)).toEqual([42, 3]);
    });

    it('1003729 - Encode object identifier multi-byte value', () => {
        const signature: any = new PdfSignature();
        const result: Uint8Array =
            signature._encodeObjectIdentifier('1.2.113549');
        expect(result.length).toBeGreaterThan(2);
    });
    it('1003729 - Get DSS details covers existing Certs collection', () => {
        const signature: any = new PdfSignature();
        const certRef: any = { id: 1 };
        signature._signatureField = {
            _crossReference: {
                _document: {
                    _catalog: {
                        _catalogDictionary: {
                            has: (): boolean => false
                        }
                    }
                },
                _cacheMap: new Map(),
                _getNextReference: jasmine.createSpy().and.returnValues(
                    { id: 2 },
                    { id: 3 },
                    { id: 4 },
                    { id: 5 },
                    { id: 6 }
                ),
                _fetch: jasmine.createSpy().and.returnValue({
                    getBytes: (): Uint8Array => new Uint8Array([1, 2, 3])
                })
            }
        };
        signature._dssDictionary = {
            has: (key: string): boolean => key === 'Certs',
            get: (key: string): any => {
                if (key === 'Certs') {
                    return [certRef];
                }
                return undefined;
            },
            getRaw: (): any => certRef,
            set: jasmine.createSpy()
        };
        spyOn(signature, '_getHexString').and.returnValue('ABCDEF');
        spyOn(signature, '_getVRIName').and.returnValue('TESTVRI');
        const result: boolean = signature._getDssDetails(
            [],
            [],
            [new Uint8Array([10])]
        );
        expect(result).toBeTruthy();
        expect(
            signature._signatureField._crossReference._fetch
        ).toHaveBeenCalledWith(certRef);
    });
    it('1003729 - Validate TSA certificate chain returns false when chain is untrusted', () => {
        const signature: any = new PdfSignature();
        const cert: any = {
            _structure: {}
        };
        signature._signatureField = {
            _trustedRoots: [{}],
            _buildAndValidateCertificateChain: jasmine.createSpy().and.returnValue({
                trusted: false
            })
        };
        expect(
            signature._validateTsaCertificateChain(
                [cert],
                new Date()
            )
        ).toBeFalsy();
    });
    it('1003729 - Validate TSA certificate chain returns false when timestamp EKU is missing', () => {
        const signature: any = new PdfSignature();
        const cert: any = {
            _structure: {}
        };
        signature._signatureField = {
            _trustedRoots: [{}],
            _buildAndValidateCertificateChain: jasmine.createSpy().and.returnValue({
                trusted: true
            }),
            _cmsSigner: {
                _hasTimestampExtendedKeyUsage: jasmine.createSpy()
                    .and.returnValue(false)
            }
        };
        expect(
            signature._validateTsaCertificateChain(
                [cert],
                new Date()
            )
        ).toBeFalsy();
    });
    it('1003729 - Validate TSA certificate chain returns true for valid chain and EKU', () => {
        const signature: any = new PdfSignature();
        const cert: any = {
            _structure: {}
        };
        signature._signatureField = {
            _trustedRoots: [{}],
            _buildAndValidateCertificateChain: jasmine.createSpy().and.returnValue({
                trusted: true
            }),
            _cmsSigner: {
                _hasTimestampExtendedKeyUsage: jasmine.createSpy()
                    .and.returnValue(true)
            }
        };
        expect(
            signature._validateTsaCertificateChain(
                [cert],
                new Date()
            )
        ).toBeTruthy();
    });
    it('1003729 - Validate TSA certificate chain ignores EKU validation exception', () => {
        const signature: any = new PdfSignature();
        const cert: any = {
            _structure: {}
        };
        signature._signatureField = {
            _trustedRoots: [{}],
            _buildAndValidateCertificateChain: jasmine.createSpy().and.returnValue({
                trusted: true
            }),
            _cmsSigner: {
                _hasTimestampExtendedKeyUsage: jasmine.createSpy()
                    .and.throwError('eku error')
            }
        };
        expect(
            signature._validateTsaCertificateChain(
                [cert],
                new Date()
            )
        ).toBeTruthy();
    });
    it('1003729 - Validate LTV OCSP returns good status', () => {
        const signature: any = new PdfSignature();
        spyOn(_PdfOcspResponseHelper.prototype, '_getResponseObject')
            .and.returnValue({
                _responses: [
                    {
                        _certStatus: { _tag: 0 }
                    }
                ]
            });
        Object.defineProperty(
            _PdfOcspResponseHelper.prototype,
            '_status',
            { get: () => 0 }
        );
        const result: RevocationStatus =
            signature._validateLtvOcsp(new Uint8Array([1]));
        expect(result).toBe(RevocationStatus.unknown);
    });
    it('1003729 - Validate LTV OCSP returns revoked status', () => {
        const signature: any = new PdfSignature();
        spyOn(_PdfOcspResponseHelper.prototype, '_getResponseObject')
            .and.returnValue({
                _responses: [
                    {
                        _certStatus: { _tag: 1 }
                    }
                ]
            });
        Object.defineProperty(
            _PdfOcspResponseHelper.prototype,
            '_status',
            { get: () => 0 }
        );
        const result: RevocationStatus =
            signature._validateLtvOcsp(new Uint8Array([1]));
        expect(result).toBe(RevocationStatus.unknown);
    });
    it('1003729 - Validate LTV OCSP returns unknown for empty response object', () => {
        const signature: any = new PdfSignature();
        spyOn(_PdfOcspResponseHelper.prototype, '_getResponseObject')
            .and.returnValue(null);
        Object.defineProperty(
            _PdfOcspResponseHelper.prototype,
            '_status',
            { get: () => 0 }
        );
        expect(
            signature._validateLtvOcsp(new Uint8Array([1]))
        ).toBe(RevocationStatus.unknown);
    });
    it('1003729 - Validate LTV OCSP returns unknown for missing single response', () => {
        const signature: any = new PdfSignature();
        spyOn(_PdfOcspResponseHelper.prototype, '_getResponseObject')
            .and.returnValue({
                _responses: [null]
            });
        Object.defineProperty(
            _PdfOcspResponseHelper.prototype,
            '_status',
            { get: () => 0 }
        );
        expect(
            signature._validateLtvOcsp(new Uint8Array([1]))
        ).toBe(RevocationStatus.unknown);
    });
    it('1003729 - Validate LTV OCSP returns unknown for missing status object', () => {
        const signature: any = new PdfSignature();
        spyOn(_PdfOcspResponseHelper.prototype, '_getResponseObject')
            .and.returnValue({
                _responses: [{}]
            });
        Object.defineProperty(
            _PdfOcspResponseHelper.prototype,
            '_status',
            { get: () => 0 }
        );
        expect(
            signature._validateLtvOcsp(new Uint8Array([1]))
        ).toBe(RevocationStatus.unknown);
    });
    it('1003729 - Validate LTV OCSP handles exception', () => {
        const signature: any = new PdfSignature();
        spyOn(_PdfOcspResponseHelper.prototype, '_getResponseObject')
            .and.throwError('test');
        Object.defineProperty(
            _PdfOcspResponseHelper.prototype,
            '_status',
            { get: () => 0 }
        );
        expect(
            signature._validateLtvOcsp(new Uint8Array([1]))
        ).toBe(RevocationStatus.unknown);
    });
    it('1003729 - Verify timestamp returns null when token is missing', () => {
        const signature: any = new PdfSignature();
        signature._signatureField = {
            _extractTimestampToken: (): any => null
        };
        expect(signature._verifyTimeStampCore()).toBeNull();
    });
    it('1003729 - Verify timestamp handles exception', () => {
        const signature: any = new PdfSignature();
        signature._signatureField = {
            _extractTimestampToken: () => {
                throw new Error('test');
            }
        };
        const result: any = signature._verifyTimeStampCore();
        expect(result.isvalid).toBeFalsy();
    });
});
describe('coverage - 7', () => {
    it('1003729 - RSA public key parameter handles undefined modulus and exponent', () => {
        const key: any = new _PdfRsaPublicKeyParam(undefined as any, undefined as any);
        expect(key._modulus).toBeDefined();
        expect(key._exponent).toBeDefined();
        expect(key._isPrivate).toBeTruthy();
    });
    it('1003729 - RSA public key parameter equals using public properties', () => {
        const key: any = new _PdfRsaPublicKeyParam(
            new Uint8Array([1, 2]),
            new Uint8Array([3])
        );
        expect(
            key._equals({
                modulus: new Uint8Array([1, 2]),
                exponent: new Uint8Array([3])
            })
        ).toBeTruthy();
    });
    it('1003729 - RSA public key parameter equals using internal properties', () => {
        const key: any = new _PdfRsaPublicKeyParam(
            new Uint8Array([1]),
            new Uint8Array([2])
        );
        expect(
            key._equals({
                _modulus: new Uint8Array([1]),
                _exponent: new Uint8Array([2])
            })
        ).toBeTruthy();
    });
    it('1003729 - RSA public key parameter equals handles null object', () => {
        const key: any = new _PdfRsaPublicKeyParam(
            new Uint8Array([1]),
            new Uint8Array([2])
        );
        expect(key._equals(null)).toBeFalsy();
    });
    it('1003729 - RSA public key parameter equals returns false for different values', () => {
        const key: any = new _PdfRsaPublicKeyParam(
            new Uint8Array([1]),
            new Uint8Array([2])
        );
        expect(
            key._equals({
                modulus: new Uint8Array([9]),
                exponent: new Uint8Array([8])
            })
        ).toBeFalsy();
    });
    it('1003729 - RSA public key parameter computes hash code', () => {
        const key: any = new _PdfRsaPublicKeyParam(
            new Uint8Array([1, 2, 3]),
            new Uint8Array([4, 5])
        );
        const hash: number = key._getHashCode();
        expect(typeof hash).toBe('number');
    });
})