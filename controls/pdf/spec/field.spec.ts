import { PdfSignatureField } from '../src/pdf/core/form/field';
import {
    PdfCertificationFlag,
    RevocationStatus,
    RevocationType,
    SignatureStatus
} from '../src/pdf/core/enumerator';
import { PdfDocument } from '../src/pdf/core/pdf-document';
import { PdfPage } from '../src/pdf/core/pdf-page';
import { _PdfRonCipherParameter } from '../src/pdf/core/security/digital-signature/x509/x509-cipher-handler';
import { _PdfDictionary, _PdfName, _PdfReference } from '../src/pdf/core/pdf-primitives';
import { _PdfCrossReference, _PdfObjectInformation } from '../src/pdf/core/pdf-cross-reference';
function makeSignatureValidationHarness(): {
    document: PdfDocument;
    page: PdfPage;
    field: PdfSignatureField;
} {
    const document: PdfDocument = new PdfDocument();
    const page: PdfPage = document.addPage();
    const field: PdfSignatureField = new PdfSignatureField(
        page,
        'signatureField',
        { x: 20, y: 20, width: 150, height: 50 }
    );
    document.form.add(field);
    return { document, page, field };
}
describe('PdfSignatureField validateSignature mutation coverage', () => {
    it('validateSignature returns the complete default validation result', () => {
        // Arrange
        const harness: {
            document: PdfDocument;
            page: PdfPage;
            field: PdfSignatureField;
        } = makeSignatureValidationHarness();
        const field: any = harness.field;
        const cmsSigner: any = {};
        const signatureDictionary: any = {
            _cmsSigner: cmsSigner
        };
        const signature: any = {
            _signatureDictionary: signatureDictionary
        };
        const originalValidateSignature: Function = field._validateSignature;
        field._signature = signature;
        field._cmsSigner = cmsSigner;
        field._validateSignature = (
            _revocationType: RevocationType,
            _ocspExternalData: Uint8Array[],
            _crlExternalData: Uint8Array[]
        ): undefined => {
            return undefined;
        };
        // Act
        const result: any = field.validateSignature();
        field._validateSignature = originalValidateSignature;
        // Assert
        expect(result.cryptographicStandard).toBeUndefined();
        expect(result.digestAlgorithm).toBeUndefined();
        expect(result.isDocumentModified).toBeFalsy();
        expect(result.validityAtCurrentTime).toBeFalsy();
        expect(result.validityAtSignedTime).toBeFalsy();
        expect(result.validityAtTimestampTime).toBeFalsy();
        expect(result.isCertifiedSignature).toBeFalsy();
        expect(result.documentPermissions).toBe(PdfCertificationFlag.forbidChanges);
        expect(result.revocationResult).toBeUndefined();
        expect(result.ltvVerificationInformation).toBeDefined();
        expect(result.ltvVerificationInformation.isCrlEmbedded).toBeFalsy();
        expect(result.ltvVerificationInformation.isLtvEmbedded).toBeFalsy();
        expect(result.ltvVerificationInformation.isOcspEmbedded).toBeFalsy();
        expect(result.signatureAlgorithm).toBe('');
        expect(result.signatureName).toBe('');
        expect(result.signatureStatus).toBe(SignatureStatus.unknown);
        expect(result.validationErrorMessages.length).toBe(0);
        expect(result.timestampInformation).toBeDefined();
        expect(result.timestampInformation.isDocumentTimestamp).toBeFalsy();
        expect(result.timestampInformation.isValid).toBeFalsy();
        expect(result.timestampInformation.timestampTime.getTime()).toBe(0);
        expect(result.timestampInformation.timestampPolicyId).toBe('');
        expect(result.timestampInformation.certificate).toBeUndefined();
        expect(result.timestampInformation.signerCertificates).toBeUndefined();
        expect(result.isSignatureValid).toBeFalsy();
        expect(result.signerCertificates.length).toBe(0);
    });
    it('validateSignature gets the signature and marks the field as signed', () => {
        // Arrange
        const harness: {
            document: PdfDocument;
            page: PdfPage;
            field: PdfSignatureField;
        } = makeSignatureValidationHarness();
        const field: any = harness.field;
        const cmsSigner: any = {};
        const signature: any = {
            _signatureDictionary: {
                _cmsSigner: cmsSigner
            }
        };
        const originalGetSignature: Function = field.getSignature;
        const originalValidateSignature: Function = field._validateSignature;
        let getSignatureCallCount: number = 0;
        field._signature = undefined;
        field._isSigned = false;
        field.getSignature = (): any => {
            getSignatureCallCount++;
            return signature;
        };
        field._validateSignature = (
            _revocationType: RevocationType,
            _ocspExternalData: Uint8Array[],
            _crlExternalData: Uint8Array[]
        ): undefined => {
            return undefined;
        };
        // Act
        const result: any = field.validateSignature();
        field.getSignature = originalGetSignature;
        field._validateSignature = originalValidateSignature;
        // Assert
        expect(getSignatureCallCount).toBe(1);
        expect(field._signature).toBe(signature);
        expect(field._isSigned).toBeTruthy();
        expect(result.signatureStatus).toBe(SignatureStatus.unknown);
        expect(result.validationErrorMessages.length).toBe(0);
    });
    it('validateSignature does not get the signature when it is already available', () => {
        // Arrange
        const harness: {
            document: PdfDocument;
            page: PdfPage;
            field: PdfSignatureField;
        } = makeSignatureValidationHarness();
        const field: any = harness.field;
        const cmsSigner: any = {};
        const existingSignature: any = {
            _signatureDictionary: {
                _cmsSigner: cmsSigner
            }
        };
        const originalGetSignature: Function = field.getSignature;
        const originalValidateSignature: Function = field._validateSignature;
        let getSignatureCallCount: number = 0;
        field._signature = existingSignature;
        field._cmsSigner = cmsSigner;
        field._isSigned = false;
        field.getSignature = (): any => {
            getSignatureCallCount++;
            return existingSignature;
        };
        field._validateSignature = (
            _revocationType: RevocationType,
            _ocspExternalData: Uint8Array[],
            _crlExternalData: Uint8Array[]
        ): undefined => {
            return undefined;
        };
        // Act
        const result: any = field.validateSignature();
        field.getSignature = originalGetSignature;
        field._validateSignature = originalValidateSignature;
        // Assert
        expect(getSignatureCallCount).toBe(0);
        expect(field._signature).toBe(existingSignature);
        expect(field._isSigned).toBeFalsy();
        expect(result.signatureStatus).toBe(SignatureStatus.unknown);
    });
    it('validateSignature uses the default revocation options', () => {
        // Arrange
        const harness: {
            document: PdfDocument;
            page: PdfPage;
            field: PdfSignatureField;
        } = makeSignatureValidationHarness();
        const field: any = harness.field;
        const signature: any = {
            _signatureDictionary: {
                _cmsSigner: {}
            }
        };
        const originalValidateSignature: Function = field._validateSignature;
        let receivedRevocationType: RevocationType;
        let receivedValidateRevocation: boolean;
        field._signature = signature;
        field._cmsSigner = signature._signatureDictionary._cmsSigner;
        field._verified = false;
        field._validateSignature = (
            revocationType: RevocationType,
            _ocspExternalData: Uint8Array[],
            _crlExternalData: Uint8Array[]
        ): undefined => {
            receivedRevocationType = revocationType;
            return undefined;
        };
        // Act
        const result: any = field.validateSignature();
        field._validateSignature = originalValidateSignature;
        // Assert
        expect(receivedRevocationType).toBe(RevocationType.ocspAndCrl);
        expect(field._revocationValidationType).toBe(RevocationType.ocspAndCrl);
        expect(field._verified).toBeTruthy();
        expect(result.signatureStatus).toBe(SignatureStatus.unknown);
    });
    it('validateSignature copies the CMS signer only when it is not initialized', () => {
        // Arrange
        const harness: {
            document: PdfDocument;
            page: PdfPage;
            field: PdfSignatureField;
        } = makeSignatureValidationHarness();
        const field: any = harness.field;
        const dictionaryCmsSigner: any = { name: 'dictionary signer' };
        const signature: any = {
            _signatureDictionary: {
                _cmsSigner: dictionaryCmsSigner
            }
        };
        const originalValidateSignature: Function = field._validateSignature;
        field._signature = signature;
        field._cmsSigner = undefined;
        field._validateSignature = (
            _revocationType: RevocationType,
            _ocspExternalData: Uint8Array[],
            _crlExternalData: Uint8Array[]
        ): undefined => {
            return undefined;
        };
        // Act
        const result: any = field.validateSignature();
        field._validateSignature = originalValidateSignature;
        // Assert
        expect(field._cmsSigner).toBe(dictionaryCmsSigner);
        expect(result.signatureStatus).toBe(SignatureStatus.unknown);
        expect(result.validationErrorMessages.length).toBe(0);
    });
    it('validateSignature preserves the existing CMS signer', () => {
        // Arrange
        const harness: {
            document: PdfDocument;
            page: PdfPage;
            field: PdfSignatureField;
        } = makeSignatureValidationHarness();
        const field: any = harness.field;
        const existingCmsSigner: any = { name: 'existing signer' };
        const dictionaryCmsSigner: any = { name: 'dictionary signer' };
        const signature: any = {
            _signatureDictionary: {
                _cmsSigner: dictionaryCmsSigner
            }
        };
        const originalValidateSignature: Function = field._validateSignature;
        field._signature = signature;
        field._cmsSigner = existingCmsSigner;
        field._validateSignature = (
            _revocationType: RevocationType,
            _ocspExternalData: Uint8Array[],
            _crlExternalData: Uint8Array[]
        ): undefined => {
            return undefined;
        };
        // Act
        const result: any = field.validateSignature();
        field._validateSignature = originalValidateSignature;
        // Assert
        expect(field._cmsSigner).toBe(existingCmsSigner);
        expect(field._cmsSigner).not.toBe(dictionaryCmsSigner);
        expect(result.signatureStatus).toBe(SignatureStatus.unknown);
    });
    it('validateSignature does not copy a CMS signer without a signature', () => {
        // Arrange
        const harness: {
            document: PdfDocument;
            page: PdfPage;
            field: PdfSignatureField;
        } = makeSignatureValidationHarness();
        const field: any = harness.field;
        const originalGetSignature: Function = field.getSignature;
        const originalValidateSignature: Function = field._validateSignature;
        field._signature = undefined;
        field._cmsSigner = undefined;
        field.getSignature = (): undefined => {
            return undefined;
        };
        field._validateSignature = (
            _revocationType: RevocationType,
            _ocspExternalData: Uint8Array[],
            _crlExternalData: Uint8Array[]
        ): undefined => {
            return undefined;
        };
        // Act
        const result: any = field.validateSignature();
        field.getSignature = originalGetSignature;
        field._validateSignature = originalValidateSignature;
        // Assert
        expect(field._signature).toBeUndefined();
        expect(field._cmsSigner).toBeUndefined();
        expect(field._isSigned).toBeTruthy();
        expect(result.signatureStatus).toBe(SignatureStatus.unknown);
        expect(result.validationErrorMessages.length).toBe(0);
    });
    it('validateSignature ignores an empty trusted certificate collection', () => {
        // Arrange
        const harness: {
            document: PdfDocument;
            page: PdfPage;
            field: PdfSignatureField;
        } = makeSignatureValidationHarness();
        const field: any = harness.field;
        const signatureDictionary: any = {
            _cmsSigner: {},
            _extractTrustedCertsFromBytes: (
                _certificateData: Uint8Array,
                _password: string
            ): any[] => {
                return [{ name: 'unexpected certificate' }];
            }
        };
        const originalValidateSignature: Function = field._validateSignature;
        let extractionCallCount: number = 0;
        signatureDictionary._extractTrustedCertsFromBytes = (
            _certificateData: Uint8Array,
            _password: string
        ): any[] => {
            extractionCallCount++;
            return [{ name: 'unexpected certificate' }];
        };
        field._signature = {
            _signatureDictionary: signatureDictionary
        };
        field._cmsSigner = signatureDictionary._cmsSigner;
        field._validateSignature = (
            _revocationType: RevocationType,
            _ocspExternalData: Uint8Array[],
            _crlExternalData: Uint8Array[]
        ): undefined => {
            return undefined;
        };
        // Act
        const result: any = field.validateSignature({
            trustedCertificates: []
        });
        field._validateSignature = originalValidateSignature;
        // Assert
        expect(extractionCallCount).toBe(0);
        expect(field._trustedRoots.length).toBe(0);
        expect(result.signatureStatus).toBe(SignatureStatus.unknown);
        expect(result.validationErrorMessages.length).toBe(0);
    });
    it('validateSignature skips non byte certificates and empty byte certificates', () => {
        // Arrange
        const harness: {
            document: PdfDocument;
            page: PdfPage;
            field: PdfSignatureField;
        } = makeSignatureValidationHarness();
        const field: any = harness.field;
        const signatureDictionary: any = {
            _cmsSigner: {}
        };
        const originalValidateSignature: Function = field._validateSignature;
        let extractionCallCount: number = 0;
        signatureDictionary._extractTrustedCertsFromBytes = (
            _certificateData: Uint8Array,
            _password: string
        ): any[] => {
            extractionCallCount++;
            return [{ name: 'unexpected certificate' }];
        };
        field._signature = {
            _signatureDictionary: signatureDictionary
        };
        field._cmsSigner = signatureDictionary._cmsSigner;
        field._validateSignature = (
            _revocationType: RevocationType,
            _ocspExternalData: Uint8Array[],
            _crlExternalData: Uint8Array[]
        ): undefined => {
            return undefined;
        };
        // Act
        const result: any = field.validateSignature({
            trustedCertificates: [
                'invalid certificate' as any,
                new Uint8Array(0)
            ]
        });
        field._validateSignature = originalValidateSignature;
        // Assert
        expect(extractionCallCount).toBe(0);
        expect(field._trustedRoots.length).toBe(0);
        expect(result.signatureStatus).toBe(SignatureStatus.unknown);
        expect(result.validationErrorMessages.length).toBe(0);
    });
    it('validateSignature skips a non byte certificate with a nonzero length', () => {
        // Arrange
        const harness: {
            document: PdfDocument;
            page: PdfPage;
            field: PdfSignatureField;
        } = makeSignatureValidationHarness();
        const field: any = harness.field;
        const signatureDictionary: any = {
            _cmsSigner: {}
        };
        const originalValidateSignature: Function = field._validateSignature;
        let extractionCallCount: number = 0;
        signatureDictionary._extractTrustedCertsFromBytes = (
            _certificateData: Uint8Array,
            _password: string
        ): any[] => {
            extractionCallCount++;
            return [];
        };
        field._signature = {
            _signatureDictionary: signatureDictionary
        };
        field._cmsSigner = signatureDictionary._cmsSigner;
        field._validateSignature = (
            _revocationType: RevocationType,
            _ocspExternalData: Uint8Array[],
            _crlExternalData: Uint8Array[]
        ): undefined => {
            return undefined;
        };
        // Act
        const result: any = field.validateSignature({
            trustedCertificates: [
                [10, 20] as any
            ]
        });
        field._validateSignature = originalValidateSignature;
        // Assert
        expect(extractionCallCount).toBe(0);
        expect(field._trustedRoots.length).toBe(0);
        expect(result.signatureStatus).toBe(SignatureStatus.unknown);
    });
    it('validateSignature skips an empty byte certificate even though it is a Uint8Array', () => {
        // Arrange
        const harness: {
            document: PdfDocument;
            page: PdfPage;
            field: PdfSignatureField;
        } = makeSignatureValidationHarness();
        const field: any = harness.field;
        const signatureDictionary: any = {
            _cmsSigner: {}
        };
        const originalValidateSignature: Function = field._validateSignature;
        let extractionCallCount: number = 0;
        signatureDictionary._extractTrustedCertsFromBytes = (
            _certificateData: Uint8Array,
            _password: string
        ): any[] => {
            extractionCallCount++;
            return [];
        };
        field._signature = {
            _signatureDictionary: signatureDictionary
        };
        field._cmsSigner = signatureDictionary._cmsSigner;
        field._validateSignature = (
            _revocationType: RevocationType,
            _ocspExternalData: Uint8Array[],
            _crlExternalData: Uint8Array[]
        ): undefined => {
            return undefined;
        };
        // Act
        const result: any = field.validateSignature({
            trustedCertificates: [
                new Uint8Array(0)
            ]
        });
        field._validateSignature = originalValidateSignature;
        // Assert
        expect(extractionCallCount).toBe(0);
        expect(field._trustedRoots.length).toBe(0);
        expect(result.signatureStatus).toBe(SignatureStatus.unknown);
    });
    it('validateSignature extracts every trusted certificate using its supplied password', () => {
        // Arrange
        const harness: {
            document: PdfDocument;
            page: PdfPage;
            field: PdfSignatureField;
        } = makeSignatureValidationHarness();
        const field: any = harness.field;
        const firstCertificateData: Uint8Array = new Uint8Array([1, 2]);
        const secondCertificateData: Uint8Array = new Uint8Array([3, 4]);
        const firstExtractedCertificate: any = { name: 'first root' };
        const secondExtractedCertificate: any = { name: 'second root' };
        const receivedCertificateData: Uint8Array[] = [];
        const receivedPasswords: string[] = [];
        const originalValidateSignature: Function = field._validateSignature;
        const originalGetEmbeddedCertificates: Function = field._getEmbeddedCertificates;
        const originalValidateCertificateWithCollection: Function =
            field._validateCertificateWithCollection;
        const signatureDictionary: any = {
            _cmsSigner: {}
        };
        signatureDictionary._extractTrustedCertsFromBytes = (
            certificateData: Uint8Array,
            password: string
        ): any[] => {
            receivedCertificateData.push(certificateData);
            receivedPasswords.push(password);
            if (certificateData === firstCertificateData) {
                return [firstExtractedCertificate];
            }
            return [secondExtractedCertificate];
        };
        field._signature = {
            _signatureDictionary: signatureDictionary,
            getSignedDate: (): Date => new Date(1000)
        };
        field._cmsSigner = signatureDictionary._cmsSigner;
        field._validateSignature = (
            _revocationType: RevocationType,
            _ocspExternalData: Uint8Array[],
            _crlExternalData: Uint8Array[]
        ): undefined => {
            return undefined;
        };
        field._getEmbeddedCertificates = (): any[] => {
            return [{ name: 'embedded signer' }];
        };
        field._validateCertificateWithCollection = (
            _embedded: any[],
            _trustedRoots: any[],
            _signedDate: Date,
            _result: any
        ): boolean => {
            return true;
        };
        // Act
        const result: any = field.validateSignature({
            trustedCertificates: [
                firstCertificateData,
                secondCertificateData
            ],
            passwords: [
                'first-password',
                'second-password'
            ]
        });
        field._validateSignature = originalValidateSignature;
        field._getEmbeddedCertificates = originalGetEmbeddedCertificates;
        field._validateCertificateWithCollection =
            originalValidateCertificateWithCollection;
        // Assert
        expect(receivedCertificateData.length).toBe(2);
        expect(receivedCertificateData[0]).toBe(firstCertificateData);
        expect(receivedCertificateData[1]).toBe(secondCertificateData);
        expect(receivedPasswords[0]).toBe('first-password');
        expect(receivedPasswords[1]).toBe('second-password');
        expect(field._trustedRoots.length).toBe(2);
        expect(field._trustedRoots[0]).toBe(firstExtractedCertificate);
        expect(field._trustedRoots[1]).toBe(secondExtractedCertificate);
        expect(result.signatureStatus).toBe(SignatureStatus.valid);
    });
    it('validateSignature uses an empty password when passwords are not supplied', () => {
        // Arrange
        const harness: {
            document: PdfDocument;
            page: PdfPage;
            field: PdfSignatureField;
        } = makeSignatureValidationHarness();
        const field: any = harness.field;
        const trustedCertificateData: Uint8Array = new Uint8Array([1]);
        const receivedPasswords: string[] = [];
        const originalValidateSignature: Function = field._validateSignature;
        const originalGetEmbeddedCertificates: Function = field._getEmbeddedCertificates;
        const originalValidateCertificateWithCollection: Function =
            field._validateCertificateWithCollection;
        const signatureDictionary: any = {
            _cmsSigner: {}
        };
        signatureDictionary._extractTrustedCertsFromBytes = (
            _certificateData: Uint8Array,
            password: string
        ): any[] => {
            receivedPasswords.push(password);
            return [{ name: 'trusted root' }];
        };
        field._signature = {
            _signatureDictionary: signatureDictionary,
            getSignedDate: (): Date => new Date(1000)
        };
        field._cmsSigner = signatureDictionary._cmsSigner;
        field._validateSignature = (
            _revocationType: RevocationType,
            _ocspExternalData: Uint8Array[],
            _crlExternalData: Uint8Array[]
        ): undefined => {
            return undefined;
        };
        field._getEmbeddedCertificates = (): any[] => {
            return [{ name: 'embedded signer' }];
        };
        field._validateCertificateWithCollection = (
            _embedded: any[],
            _trustedRoots: any[],
            _signedDate: Date,
            _result: any
        ): boolean => {
            return true;
        };
        // Act
        const result: any = field.validateSignature({
            trustedCertificates: [trustedCertificateData]
        });
        field._validateSignature = originalValidateSignature;
        field._getEmbeddedCertificates = originalGetEmbeddedCertificates;
        field._validateCertificateWithCollection =
            originalValidateCertificateWithCollection;
        // Assert
        expect(receivedPasswords.length).toBe(1);
        expect(receivedPasswords[0]).toBe('');
        expect(field._trustedRoots.length).toBe(1);
        expect(result.signatureStatus).toBe(SignatureStatus.valid);
    });
    it('validateSignature uses an empty password when the indexed password is undefined', () => {
        // Arrange
        const harness: {
            document: PdfDocument;
            page: PdfPage;
            field: PdfSignatureField;
        } = makeSignatureValidationHarness();
        const field: any = harness.field;
        const trustedCertificateData: Uint8Array = new Uint8Array([5]);
        const receivedPasswords: string[] = [];
        const originalValidateSignature: Function = field._validateSignature;
        const originalGetEmbeddedCertificates: Function = field._getEmbeddedCertificates;
        const originalValidateCertificateWithCollection: Function =
            field._validateCertificateWithCollection;
        const signatureDictionary: any = {
            _cmsSigner: {}
        };
        signatureDictionary._extractTrustedCertsFromBytes = (
            _certificateData: Uint8Array,
            password: string
        ): any[] => {
            receivedPasswords.push(password);
            return [{ name: 'trusted root' }];
        };
        field._signature = {
            _signatureDictionary: signatureDictionary,
            getSignedDate: (): Date => new Date(1000)
        };
        field._cmsSigner = signatureDictionary._cmsSigner;
        field._validateSignature = (
            _revocationType: RevocationType,
            _ocspExternalData: Uint8Array[],
            _crlExternalData: Uint8Array[]
        ): undefined => {
            return undefined;
        };
        field._getEmbeddedCertificates = (): any[] => {
            return [{ name: 'embedded signer' }];
        };
        field._validateCertificateWithCollection = (
            _embedded: any[],
            _trustedRoots: any[],
            _signedDate: Date,
            _result: any
        ): boolean => {
            return true;
        };
        // Act
        const result: any = field.validateSignature({
            trustedCertificates: [trustedCertificateData],
            passwords: [undefined]
        });
        field._validateSignature = originalValidateSignature;
        field._getEmbeddedCertificates = originalGetEmbeddedCertificates;
        field._validateCertificateWithCollection =
            originalValidateCertificateWithCollection;
        // Assert
        expect(receivedPasswords.length).toBe(1);
        expect(receivedPasswords[0]).toBe('');
        expect(receivedPasswords[0]).not.toBe('Stryker was here');
        expect(field._trustedRoots.length).toBe(1);
        expect(result.signatureStatus).toBe(SignatureStatus.valid);
    });
    it('validateSignature does not overwrite verification options after verification', () => {
        // Arrange
        const harness: {
            document: PdfDocument;
            page: PdfPage;
            field: PdfSignatureField;
        } = makeSignatureValidationHarness();
        const field: any = harness.field;
        const signature: any = {
            _signatureDictionary: {
                _cmsSigner: {}
            }
        };
        const receivedRevocationTypes: RevocationType[] = [];
        const receivedValidationStates: boolean[] = [];
        const originalValidateSignature: Function = field._validateSignature;
        field._signature = signature;
        field._cmsSigner = signature._signatureDictionary._cmsSigner;
        field._verified = false;
        field._validateSignature = (
            revocationType: RevocationType,
            _ocspExternalData: Uint8Array[],
            _crlExternalData: Uint8Array[]
        ): undefined => {
            receivedRevocationTypes.push(revocationType);
            return undefined;
        };
        // Act
        const firstResult: any = field.validateSignature();
        const storedRevocationType: RevocationType =
            field._revocationValidationType;
        const secondResult: any = field.validateSignature({
            revocationValidationType: RevocationType.crl
        });
        field._validateSignature = originalValidateSignature;
        // Assert
        expect(receivedRevocationTypes.length).toBe(2);
        expect(receivedRevocationTypes[0]).toBe(RevocationType.ocspAndCrl);
        expect(receivedRevocationTypes[1]).toBe(RevocationType.crl);
        expect(field._verified).toBeTruthy();
        expect(storedRevocationType).toBe(RevocationType.ocspAndCrl);
        expect(field._revocationValidationType).toBe(
            RevocationType.ocspAndCrl
        );
        expect(firstResult.signatureStatus).toBe(SignatureStatus.unknown);
        expect(secondResult.signatureStatus).toBe(SignatureStatus.unknown);
    });
    it('validateSignature assigns every returned inner validation result property', () => {
        // Arrange
        const harness: {
            document: PdfDocument;
            page: PdfPage;
            field: PdfSignatureField;
        } = makeSignatureValidationHarness();
        const field: any = harness.field;
        const signature: any = {
            _signatureDictionary: {
                _cmsSigner: {}
            }
        };
        const signerCertificate: any = { name: 'signer certificate' };
        const originalValidateSignature: Function = field._validateSignature;
        field._signature = signature;
        field._cmsSigner = signature._signatureDictionary._cmsSigner;
        field._validateSignature = (
            _revocationType: RevocationType,
            _ocspExternalData: Uint8Array[],
            _crlExternalData: Uint8Array[]
        ): any => {
            return {
                isDocumentModified: true,
                validityAtCurrentTime: true,
                validityAtSignedTime: true,
                validityAtTimestampTime: true,
                isCertifiedSignature: true,
                signatureAlgorithm: 'SHA256RSA',
                signatureName: 'Approved signature',
                signatureStatus: SignatureStatus.valid,
                isSignatureValid: true,
                signerCertificates: [signerCertificate],
                ltvVerificationInformation: {
                    isCrlEmbedded: true,
                    isLtvEmbedded: true,
                    isOcspEmbedded: true
                },
                timestampInformation: {
                    isDocumentTimestamp: true,
                    isValid: true,
                    timestampTime: new Date(5000),
                    timestampPolicyId: '1.2.3.4',
                    certificate: signerCertificate,
                    signerCertificates: [signerCertificate]
                }
            };
        };
        // Act
        const result: any = field.validateSignature();
        field._validateSignature = originalValidateSignature;
        // Assert
        expect(result.isDocumentModified).toBeTruthy();
        expect(result.validityAtCurrentTime).toBeTruthy();
        expect(result.validityAtSignedTime).toBeTruthy();
        expect(result.validityAtTimestampTime).toBeTruthy();
        expect(result.isCertifiedSignature).toBeTruthy();
        expect(result.signatureAlgorithm).toBe('SHA256RSA');
        expect(result.signatureName).toBe('Approved signature');
        expect(result.signatureStatus).toBe(SignatureStatus.valid);
        expect(result.isSignatureValid).toBeTruthy();
        expect(result.signerCertificates.length).toBe(1);
        expect(result.signerCertificates[0]).toBe(signerCertificate);
        expect(result.ltvVerificationInformation.isCrlEmbedded).toBeTruthy();
        expect(result.ltvVerificationInformation.isLtvEmbedded).toBeTruthy();
        expect(result.ltvVerificationInformation.isOcspEmbedded).toBeTruthy();
        expect(result.timestampInformation.isDocumentTimestamp).toBeTruthy();
        expect(result.timestampInformation.isValid).toBeTruthy();
        expect(result.timestampInformation.timestampTime.getTime()).toBe(5000);
        expect(result.timestampInformation.timestampPolicyId).toBe('1.2.3.4');
        expect(result.timestampInformation.certificate).toBe(signerCertificate);
        expect(result.timestampInformation.signerCertificates.length).toBe(1);
    });
    it('validateSignature does not assign a missing inner validation result', () => {
        // Arrange
        const harness: {
            document: PdfDocument;
            page: PdfPage;
            field: PdfSignatureField;
        } = makeSignatureValidationHarness();
        const field: any = harness.field;
        const signature: any = {
            _signatureDictionary: {
                _cmsSigner: {}
            }
        };
        const originalValidateSignature: Function = field._validateSignature;
        field._signature = signature;
        field._cmsSigner = signature._signatureDictionary._cmsSigner;
        field._validateSignature = (
            _revocationType: RevocationType,
            _ocspExternalData: Uint8Array[],
            _crlExternalData: Uint8Array[]
        ): undefined => {
            return undefined;
        };
        // Act
        const result: any = field.validateSignature();
        field._validateSignature = originalValidateSignature;
        // Assert
        expect(result.isDocumentModified).toBeFalsy();
        expect(result.signatureAlgorithm).toBe('');
        expect(result.signatureName).toBe('');
        expect(result.signatureStatus).toBe(SignatureStatus.unknown);
        expect(result.isSignatureValid).toBeFalsy();
        expect(result.signerCertificates.length).toBe(0);
    });
    it('validateSignature returns invalid when embedded signer certificates are undefined', () => {
        // Arrange
        const harness: {
            document: PdfDocument;
            page: PdfPage;
            field: PdfSignatureField;
        } = makeSignatureValidationHarness();
        const field: any = harness.field;
        const originalValidateSignature: Function = field._validateSignature;
        const originalGetEmbeddedCertificates: Function = field._getEmbeddedCertificates;
        const signatureDictionary: any = {
            _cmsSigner: {},
            _extractTrustedCertsFromBytes: (
                _certificateData: Uint8Array,
                _password: string
            ): any[] => {
                return [{ name: 'trusted root' }];
            }
        };
        field._signature = {
            _signatureDictionary: signatureDictionary
        };
        field._cmsSigner = signatureDictionary._cmsSigner;
        field._validateSignature = (
            _revocationType: RevocationType,
            _ocspExternalData: Uint8Array[],
            _crlExternalData: Uint8Array[]
        ): undefined => {
            return undefined;
        };
        field._getEmbeddedCertificates = (): undefined => {
            return undefined;
        };
        // Act
        const result: any = field.validateSignature({
            trustedCertificates: [new Uint8Array([1])]
        });
        field._validateSignature = originalValidateSignature;
        field._getEmbeddedCertificates = originalGetEmbeddedCertificates;
        // Assert
        expect(field._trustedRoots.length).toBe(1);
        expect(result.signatureStatus).toBe(SignatureStatus.invalid);
        expect(result.validationErrorMessages.length).toBe(1);
        expect(result.validationErrorMessages[0]).toBe(
            'Signer certificate not found in signature.'
        );
    });
    it('validateSignature returns invalid when embedded signer certificates are empty', () => {
        // Arrange
        const harness: {
            document: PdfDocument;
            page: PdfPage;
            field: PdfSignatureField;
        } = makeSignatureValidationHarness();
        const field: any = harness.field;
        const originalValidateSignature: Function = field._validateSignature;
        const originalGetEmbeddedCertificates: Function = field._getEmbeddedCertificates;
        const originalValidateCertificateWithCollection: Function =
            field._validateCertificateWithCollection;
        let trustedValidationCallCount: number = 0;
        const signatureDictionary: any = {
            _cmsSigner: {},
            _extractTrustedCertsFromBytes: (
                _certificateData: Uint8Array,
                _password: string
            ): any[] => {
                return [{ name: 'trusted root' }];
            }
        };
        field._signature = {
            _signatureDictionary: signatureDictionary
        };
        field._cmsSigner = signatureDictionary._cmsSigner;
        field._validateSignature = (
            _revocationType: RevocationType,
            _ocspExternalData: Uint8Array[],
            _crlExternalData: Uint8Array[]
        ): undefined => {
            return undefined;
        };
        field._getEmbeddedCertificates = (): any[] => {
            return [];
        };
        field._validateCertificateWithCollection = (
            _embedded: any[],
            _trustedRoots: any[],
            _signedDate: Date,
            _result: any
        ): boolean => {
            trustedValidationCallCount++;
            return true;
        };
        // Act
        const result: any = field.validateSignature({
            trustedCertificates: [new Uint8Array([1])]
        });
        field._validateSignature = originalValidateSignature;
        field._getEmbeddedCertificates = originalGetEmbeddedCertificates;
        field._validateCertificateWithCollection =
            originalValidateCertificateWithCollection;
        // Assert
        expect(trustedValidationCallCount).toBe(0);
        expect(result.signatureStatus).toBe(SignatureStatus.invalid);
        expect(result.validationErrorMessages.length).toBe(1);
        expect(result.validationErrorMessages[0]).toBe(
            'Signer certificate not found in signature.'
        );
    });
    it('validateSignature changes unknown status to valid after trusted verification', () => {
        // Arrange
        const harness: {
            document: PdfDocument;
            page: PdfPage;
            field: PdfSignatureField;
        } = makeSignatureValidationHarness();
        const field: any = harness.field;
        const embeddedCertificates: any[] = [{ name: 'embedded certificate' }];
        const trustedCertificate: any = { name: 'trusted certificate' };
        const signedDate: Date = new Date(2000);
        const originalValidateSignature: Function = field._validateSignature;
        const originalGetEmbeddedCertificates: Function = field._getEmbeddedCertificates;
        const originalValidateCertificateWithCollection: Function =
            field._validateCertificateWithCollection;
        let receivedEmbeddedCertificates: any[];
        let receivedTrustedCertificates: any[];
        let receivedSignedDate: Date;
        let receivedResult: any;
        const signatureDictionary: any = {
            _cmsSigner: {},
            _extractTrustedCertsFromBytes: (
                _certificateData: Uint8Array,
                _password: string
            ): any[] => {
                return [trustedCertificate];
            }
        };
        field._signature = {
            _signatureDictionary: signatureDictionary,
            getSignedDate: (): Date => signedDate
        };
        field._cmsSigner = signatureDictionary._cmsSigner;
        field._validateSignature = (
            _revocationType: RevocationType,
            _ocspExternalData: Uint8Array[],
            _crlExternalData: Uint8Array[]
        ): any => {
            return {
                signatureStatus: SignatureStatus.unknown
            };
        };
        field._getEmbeddedCertificates = (): any[] => {
            return embeddedCertificates;
        };
        field._validateCertificateWithCollection = (
            embedded: any[],
            trustedRoots: any[],
            validationDate: Date,
            result: any
        ): boolean => {
            receivedEmbeddedCertificates = embedded;
            receivedTrustedCertificates = trustedRoots;
            receivedSignedDate = validationDate;
            receivedResult = result;
            return true;
        };
        // Act
        const result: any = field.validateSignature({
            trustedCertificates: [new Uint8Array([1])]
        });
        field._validateSignature = originalValidateSignature;
        field._getEmbeddedCertificates = originalGetEmbeddedCertificates;
        field._validateCertificateWithCollection =
            originalValidateCertificateWithCollection;
        // Assert
        expect(receivedEmbeddedCertificates).toBe(embeddedCertificates);
        expect(receivedTrustedCertificates.length).toBe(1);
        expect(receivedTrustedCertificates[0]).toBe(trustedCertificate);
        expect(receivedSignedDate).toBe(signedDate);
        expect(receivedResult).toBe(result);
        expect(result.signatureStatus).toBe(SignatureStatus.valid);
        expect(result.validationErrorMessages.length).toBe(0);
    });
    it('validateSignature preserves a nonunknown status after successful trusted verification', () => {
        // Arrange
        const harness: {
            document: PdfDocument;
            page: PdfPage;
            field: PdfSignatureField;
        } = makeSignatureValidationHarness();
        const field: any = harness.field;
        const originalValidateSignature: Function = field._validateSignature;
        const originalGetEmbeddedCertificates: Function = field._getEmbeddedCertificates;
        const originalValidateCertificateWithCollection: Function =
            field._validateCertificateWithCollection;
        const signatureDictionary: any = {
            _cmsSigner: {},
            _extractTrustedCertsFromBytes: (
                _certificateData: Uint8Array,
                _password: string
            ): any[] => {
                return [{ name: 'trusted root' }];
            }
        };
        field._signature = {
            _signatureDictionary: signatureDictionary,
            getSignedDate: (): Date => new Date(3000)
        };
        field._cmsSigner = signatureDictionary._cmsSigner;
        field._validateSignature = (
            _revocationType: RevocationType,
            _ocspExternalData: Uint8Array[],
            _crlExternalData: Uint8Array[]
        ): any => {
            return {
                signatureStatus: SignatureStatus.invalid
            };
        };
        field._getEmbeddedCertificates = (): any[] => {
            return [{ name: 'embedded certificate' }];
        };
        field._validateCertificateWithCollection = (
            _embedded: any[],
            _trustedRoots: any[],
            _signedDate: Date,
            _result: any
        ): boolean => {
            return true;
        };
        // Act
        const result: any = field.validateSignature({
            trustedCertificates: [new Uint8Array([1])]
        });
        field._validateSignature = originalValidateSignature;
        field._getEmbeddedCertificates = originalGetEmbeddedCertificates;
        field._validateCertificateWithCollection =
            originalValidateCertificateWithCollection;
        // Assert
        expect(result.signatureStatus).toBe(SignatureStatus.invalid);
        expect(result.validationErrorMessages.length).toBe(0);
    });
    it('validateSignature returns invalid when trusted verification fails', () => {
        // Arrange
        const harness: {
            document: PdfDocument;
            page: PdfPage;
            field: PdfSignatureField;
        } = makeSignatureValidationHarness();
        const field: any = harness.field;
        const originalValidateSignature: Function = field._validateSignature;
        const originalGetEmbeddedCertificates: Function = field._getEmbeddedCertificates;
        const originalValidateCertificateWithCollection: Function =
            field._validateCertificateWithCollection;
        const signatureDictionary: any = {
            _cmsSigner: {},
            _extractTrustedCertsFromBytes: (
                _certificateData: Uint8Array,
                _password: string
            ): any[] => {
                return [{ name: 'trusted root' }];
            }
        };
        field._signature = {
            _signatureDictionary: signatureDictionary,
            getSignedDate: (): Date => new Date(4000)
        };
        field._cmsSigner = signatureDictionary._cmsSigner;
        field._validateSignature = (
            _revocationType: RevocationType,
            _ocspExternalData: Uint8Array[],
            _crlExternalData: Uint8Array[]
        ): any => {
            return {
                signatureStatus: SignatureStatus.unknown
            };
        };
        field._getEmbeddedCertificates = (): any[] => {
            return [{ name: 'embedded certificate' }];
        };
        field._validateCertificateWithCollection = (
            _embedded: any[],
            _trustedRoots: any[],
            _signedDate: Date,
            _result: any
        ): boolean => {
            return false;
        };
        // Act
        const result: any = field.validateSignature({
            trustedCertificates: [new Uint8Array([1])]
        });
        field._validateSignature = originalValidateSignature;
        field._getEmbeddedCertificates = originalGetEmbeddedCertificates;
        field._validateCertificateWithCollection =
            originalValidateCertificateWithCollection;
        // Assert
        expect(result.signatureStatus).toBe(SignatureStatus.invalid);
        expect(result.validationErrorMessages.length).toBe(1);
        expect(result.validationErrorMessages[0]).toBe(
            'Cannot be verified against the trusted certificate store or the certificate chain.'
        );
        expect(result.validationErrorMessages[0]).not.toBe('');
    });
    it('validateSignature does not perform trusted verification without trusted roots', () => {
        // Arrange
        const harness: {
            document: PdfDocument;
            page: PdfPage;
            field: PdfSignatureField;
        } = makeSignatureValidationHarness();
        const field: any = harness.field;
        const originalValidateSignature: Function = field._validateSignature;
        const originalGetEmbeddedCertificates: Function = field._getEmbeddedCertificates;
        const originalValidateCertificateWithCollection: Function =
            field._validateCertificateWithCollection;
        let embeddedCertificateCallCount: number = 0;
        let trustedValidationCallCount: number = 0;
        field._signature = {
            _signatureDictionary: {
                _cmsSigner: {}
            }
        };
        field._cmsSigner = field._signature._signatureDictionary._cmsSigner;
        field._validateSignature = (
            _revocationType: RevocationType,
            _ocspExternalData: Uint8Array[],
            _crlExternalData: Uint8Array[]
        ): undefined => {
            return undefined;
        };
        field._getEmbeddedCertificates = (): any[] => {
            embeddedCertificateCallCount++;
            return [{ name: 'embedded certificate' }];
        };
        field._validateCertificateWithCollection = (
            _embedded: any[],
            _trustedRoots: any[],
            _signedDate: Date,
            _result: any
        ): boolean => {
            trustedValidationCallCount++;
            return true;
        };
        // Act
        const result: any = field.validateSignature();
        field._validateSignature = originalValidateSignature;
        field._getEmbeddedCertificates = originalGetEmbeddedCertificates;
        field._validateCertificateWithCollection =
            originalValidateCertificateWithCollection;
        // Assert
        expect(field._trustedRoots.length).toBe(0);
        expect(embeddedCertificateCallCount).toBe(0);
        expect(trustedValidationCallCount).toBe(0);
        expect(result.signatureStatus).toBe(SignatureStatus.unknown);
    });
    it('validateSignature returns the thrown error message', () => {
        // Arrange
        const harness: {
            document: PdfDocument;
            page: PdfPage;
            field: PdfSignatureField;
        } = makeSignatureValidationHarness();
        const field: any = harness.field;
        const originalGetSignature: Function = field.getSignature;
        field._signature = undefined;
        field.getSignature = (): any => {
            throw new Error('Signature validation failed.');
        };
        // Act
        const result: any = field.validateSignature();
        field.getSignature = originalGetSignature;
        // Assert
        expect(result.signatureStatus).toBe(SignatureStatus.invalid);
        expect(result.validationErrorMessages.length).toBe(1);
        expect(result.validationErrorMessages[0]).toBe(
            'Signature validation failed.'
        );
    });
    it('validateSignature returns the default message for an error without a message', () => {
        // Arrange
        const harness: {
            document: PdfDocument;
            page: PdfPage;
            field: PdfSignatureField;
        } = makeSignatureValidationHarness();
        const field: any = harness.field;
        const originalGetSignature: Function = field.getSignature;
        field._signature = undefined;
        field.getSignature = (): any => {
            throw undefined;
        };
        // Act
        const result: any = field.validateSignature();
        field.getSignature = originalGetSignature;
        // Assert
        expect(result.signatureStatus).toBe(SignatureStatus.invalid);
        expect(result.validationErrorMessages.length).toBe(1);
        expect(result.validationErrorMessages[0]).toBe(
            'Unknown error during signature validation.'
        );
    });
    it('validateSignature returns the default message for an error with an empty message', () => {
        // Arrange
        const harness: {
            document: PdfDocument;
            page: PdfPage;
            field: PdfSignatureField;
        } = makeSignatureValidationHarness();
        const field: any = harness.field;
        const originalGetSignature: Function = field.getSignature;
        field._signature = undefined;
        field.getSignature = (): any => {
            throw { message: '' };
        };
        // Act
        const result: any = field.validateSignature();
        field.getSignature = originalGetSignature;
        // Assert
        expect(result.signatureStatus).toBe(SignatureStatus.invalid);
        expect(result.validationErrorMessages.length).toBe(1);
        expect(result.validationErrorMessages[0]).toBe(
            'Unknown error during signature validation.'
        );
    });
});
describe('PdfSignatureField certificate mutation coverage', () => {
    describe('_getEmbeddedCertificates', () => {
        it('_getEmbeddedCertificates returns embedded certificates', () => {
            // Arrange
            const harness: {
                document: PdfDocument;
                page: PdfPage;
                field: PdfSignatureField;
            } = makeSignatureValidationHarness();
            const field: any = harness.field;
            const firstCertificate: any = { name: 'first certificate' };
            const secondCertificate: any = { name: 'second certificate' };
            const embeddedCertificates: any[] = [
                firstCertificate,
                secondCertificate
            ];
            field._cmsSigner = {
                _certificates: embeddedCertificates
            };
            // Act
            const result: any[] = field._getEmbeddedCertificates();
            // Assert
            expect(result).toBe(embeddedCertificates);
            expect(result.length).toBe(2);
            expect(result[0]).toBe(firstCertificate);
            expect(result[1]).toBe(secondCertificate);
        });
        it('_getEmbeddedCertificates returns undefined for empty certificates', () => {
            // Arrange
            const harness: {
                document: PdfDocument;
                page: PdfPage;
                field: PdfSignatureField;
            } = makeSignatureValidationHarness();
            const field: any = harness.field;
            field._cmsSigner = {
                _certificates: []
            };
            // Act
            const result: any[] = field._getEmbeddedCertificates();
            // Assert
            expect(result).toBeUndefined();
            expect(field._cmsSigner._certificates.length).toBe(0);
        });
        it('_getEmbeddedCertificates returns undefined without certificates', () => {
            // Arrange
            const harness: {
                document: PdfDocument;
                page: PdfPage;
                field: PdfSignatureField;
            } = makeSignatureValidationHarness();
            const field: any = harness.field;
            field._cmsSigner = {};
            // Act
            const result: any[] = field._getEmbeddedCertificates();
            // Assert
            expect(result).toBeUndefined();
            expect(field._cmsSigner._certificates).toBeUndefined();
        });
        it('_getEmbeddedCertificates returns undefined without CMS signer', () => {
            // Arrange
            const harness: {
                document: PdfDocument;
                page: PdfPage;
                field: PdfSignatureField;
            } = makeSignatureValidationHarness();
            const field: any = harness.field;
            field._cmsSigner = undefined;
            // Act
            const result: any[] = field._getEmbeddedCertificates();
            // Assert
            expect(result).toBeUndefined();
            expect(field._cmsSigner).toBeUndefined();
        });
    });
    describe('_getSignerCertificate', () => {
        it('_getSignerCertificate returns the first embedded certificate', () => {
            // Arrange
            const harness: {
                document: PdfDocument;
                page: PdfPage;
                field: PdfSignatureField;
            } = makeSignatureValidationHarness();
            const field: any = harness.field;
            const signerCertificate: any = {
                name: 'signer certificate'
            };
            const intermediateCertificate: any = {
                name: 'intermediate certificate'
            };
            const embeddedCertificates: any[] = [
                signerCertificate,
                intermediateCertificate
            ];
            // Act
            const result: any =
                field._getSignerCertificate(embeddedCertificates);
            // Assert
            expect(result).toBe(signerCertificate);
            expect(result).not.toBe(intermediateCertificate);
            expect(embeddedCertificates.length).toBe(2);
        });
        it('_getSignerCertificate returns undefined for an empty collection', () => {
            // Arrange
            const harness: {
                document: PdfDocument;
                page: PdfPage;
                field: PdfSignatureField;
            } = makeSignatureValidationHarness();
            const field: any = harness.field;
            const embeddedCertificates: any[] = [];
            // Act
            const result: any =
                field._getSignerCertificate(embeddedCertificates);
            // Assert
            expect(result).toBeUndefined();
            expect(embeddedCertificates.length).toBe(0);
        });
        it('_getSignerCertificate returns undefined without embedded certificates', () => {
            // Arrange
            const harness: {
                document: PdfDocument;
                page: PdfPage;
                field: PdfSignatureField;
            } = makeSignatureValidationHarness();
            const field: any = harness.field;
            const embeddedCertificates: any[] = undefined;
            // Act
            const result: any =
                field._getSignerCertificate(embeddedCertificates);
            // Assert
            expect(result).toBeUndefined();
            expect(embeddedCertificates).toBeUndefined();
        });
    });
    describe('_validateCertificateWithCollection', () => {
        it('_validateCertificateWithCollection returns false without embedded certificates', () => {
            // Arrange
            const harness: {
                document: PdfDocument;
                page: PdfPage;
                field: PdfSignatureField;
            } = makeSignatureValidationHarness();
            const field: any = harness.field;
            const trustedRoots: any[] = [
                { name: 'trusted root' }
            ];
            const signedDate: Date = new Date(1000);
            const signatureResult: any = {
                validationErrorMessages: []
            };
            // Act
            const result: boolean =
                field._validateCertificateWithCollection(
                    undefined,
                    trustedRoots,
                    signedDate,
                    signatureResult
                );
            // Assert
            expect(result).toBeFalsy();
            expect(signatureResult.validationErrorMessages.length).toBe(0);
        });
        it('_validateCertificateWithCollection returns false for empty embedded certificates', () => {
            // Arrange
            const harness: {
                document: PdfDocument;
                page: PdfPage;
                field: PdfSignatureField;
            } = makeSignatureValidationHarness();
            const field: any = harness.field;
            const embeddedCertificates: any[] = [];
            const trustedRoots: any[] = [
                { name: 'trusted root' }
            ];
            const signedDate: Date = new Date(2000);
            const signatureResult: any = {
                validationErrorMessages: []
            };
            // Act
            const result: boolean =
                field._validateCertificateWithCollection(
                    embeddedCertificates,
                    trustedRoots,
                    signedDate,
                    signatureResult
                );
            // Assert
            expect(result).toBeFalsy();
            expect(embeddedCertificates.length).toBe(0);
            expect(signatureResult.validationErrorMessages.length).toBe(0);
        });
        it('_validateCertificateWithCollection returns false without trusted roots', () => {
            // Arrange
            const harness: {
                document: PdfDocument;
                page: PdfPage;
                field: PdfSignatureField;
            } = makeSignatureValidationHarness();
            const field: any = harness.field;
            const embeddedCertificates: any[] = [
                { name: 'signer certificate' }
            ];
            const signedDate: Date = new Date(3000);
            const signatureResult: any = {
                validationErrorMessages: []
            };
            // Act
            const result: boolean =
                field._validateCertificateWithCollection(
                    embeddedCertificates,
                    undefined,
                    signedDate,
                    signatureResult
                );
            // Assert
            expect(result).toBeFalsy();
            expect(embeddedCertificates.length).toBe(1);
            expect(signatureResult.validationErrorMessages.length).toBe(0);
        });
        it('_validateCertificateWithCollection returns false for empty trusted roots', () => {
            // Arrange
            const harness: {
                document: PdfDocument;
                page: PdfPage;
                field: PdfSignatureField;
            } = makeSignatureValidationHarness();
            const field: any = harness.field;
            const embeddedCertificates: any[] = [
                { name: 'signer certificate' }
            ];
            const trustedRoots: any[] = [];
            const signedDate: Date = new Date(4000);
            const signatureResult: any = {
                validationErrorMessages: []
            };
            // Act
            const result: boolean =
                field._validateCertificateWithCollection(
                    embeddedCertificates,
                    trustedRoots,
                    signedDate,
                    signatureResult
                );
            // Assert
            expect(result).toBeFalsy();
            expect(trustedRoots.length).toBe(0);
            expect(signatureResult.validationErrorMessages.length).toBe(0);
        });
        it('_validateCertificateWithCollection returns true for a time-valid certificate signed by a trusted root', () => {
            // Arrange
            const harness: {
                document: PdfDocument;
                page: PdfPage;
                field: PdfSignatureField;
            } = makeSignatureValidationHarness();
            const field: any = harness.field;
            const signerCertificate: any = {
                name: 'signer certificate'
            };
            const trustedRoot: any = {
                name: 'trusted root'
            };
            const embeddedCertificates: any[] = [
                signerCertificate
            ];
            const trustedRoots: any[] = [
                trustedRoot
            ];
            const signedDate: Date = new Date(5000);
            const signatureResult: any = {
                validationErrorMessages: []
            };
            const originalIsCertificateTimeValid: Function =
                field._isCertificateTimeValid;
            const originalVerifyCertificateSignature: Function =
                field._verifyCertificateSignature;
            let receivedRootCertificate: any;
            let receivedSignedDate: Date;
            let receivedSignerCertificate: any;
            let receivedIssuerCertificate: any;
            let timeValidationCallCount: number = 0;
            let signatureValidationCallCount: number = 0;
            field._isCertificateTimeValid = (
                certificate: any,
                validationDate: Date
            ): boolean => {
                timeValidationCallCount++;
                receivedRootCertificate = certificate;
                receivedSignedDate = validationDate;
                return true;
            };
            field._verifyCertificateSignature = (
                certificate: any,
                issuerCertificate: any
            ): boolean => {
                signatureValidationCallCount++;
                receivedSignerCertificate = certificate;
                receivedIssuerCertificate = issuerCertificate;
                return true;
            };
            // Act
            const result: boolean =
                field._validateCertificateWithCollection(
                    embeddedCertificates,
                    trustedRoots,
                    signedDate,
                    signatureResult
                );
            field._isCertificateTimeValid =
                originalIsCertificateTimeValid;
            field._verifyCertificateSignature =
                originalVerifyCertificateSignature;
            // Assert
            expect(result).toBeTruthy();
            expect(timeValidationCallCount).toBe(1);
            expect(signatureValidationCallCount).toBe(1);
            expect(receivedRootCertificate).toBe(trustedRoot);
            expect(receivedSignedDate).toBe(signedDate);
            expect(receivedSignerCertificate).toBe(signerCertificate);
            expect(receivedIssuerCertificate).toBe(trustedRoot);
            expect(signatureResult.validationErrorMessages.length).toBe(0);
        });
        it('_validateCertificateWithCollection does not verify the root signature when its time is invalid', () => {
            // Arrange
            const harness: {
                document: PdfDocument;
                page: PdfPage;
                field: PdfSignatureField;
            } = makeSignatureValidationHarness();
            const field: any = harness.field;
            const signerCertificate: any = {
                name: 'signer certificate'
            };
            const trustedRoot: any = {
                name: 'trusted root'
            };
            const embeddedCertificates: any[] = [
                signerCertificate
            ];
            const trustedRoots: any[] = [
                trustedRoot
            ];
            const signedDate: Date = new Date(6000);
            const signatureResult: any = {
                validationErrorMessages: []
            };
            const originalIsCertificateTimeValid: Function =
                field._isCertificateTimeValid;
            const originalVerifyCertificateSignature: Function =
                field._verifyCertificateSignature;
            let signatureValidationCallCount: number = 0;
            field._isCertificateTimeValid = (
                _certificate: any,
                _validationDate: Date
            ): boolean => {
                return false;
            };
            field._verifyCertificateSignature = (
                _certificate: any,
                _issuerCertificate: any
            ): boolean => {
                signatureValidationCallCount++;
                return true;
            };
            // Act
            const result: boolean =
                field._validateCertificateWithCollection(
                    embeddedCertificates,
                    trustedRoots,
                    signedDate,
                    signatureResult
                );
            field._isCertificateTimeValid =
                originalIsCertificateTimeValid;
            field._verifyCertificateSignature =
                originalVerifyCertificateSignature;
            // Assert
            expect(result).toBeFalsy();
            expect(signatureValidationCallCount).toBe(0);
            expect(signatureResult.validationErrorMessages.length).toBe(1);
            expect(signatureResult.validationErrorMessages[0]).toBe(
                'Cannot be verified against the KeyStore or the certificate chain'
            );
        });
        it('_validateCertificateWithCollection returns false when root signature verification fails', () => {
            // Arrange
            const harness: {
                document: PdfDocument;
                page: PdfPage;
                field: PdfSignatureField;
            } = makeSignatureValidationHarness();
            const field: any = harness.field;
            const signerCertificate: any = {
                name: 'signer certificate'
            };
            const trustedRoot: any = {
                name: 'trusted root'
            };
            const embeddedCertificates: any[] = [
                signerCertificate
            ];
            const trustedRoots: any[] = [
                trustedRoot
            ];
            const signedDate: Date = new Date(7000);
            const signatureResult: any = {
                validationErrorMessages: []
            };
            const originalIsCertificateTimeValid: Function =
                field._isCertificateTimeValid;
            const originalVerifyCertificateSignature: Function =
                field._verifyCertificateSignature;
            let signatureValidationCallCount: number = 0;
            field._isCertificateTimeValid = (
                _certificate: any,
                _validationDate: Date
            ): boolean => {
                return true;
            };
            field._verifyCertificateSignature = (
                certificate: any,
                issuerCertificate: any
            ): boolean => {
                signatureValidationCallCount++;
                expect(certificate).toBe(signerCertificate);
                expect(issuerCertificate).toBe(trustedRoot);
                return false;
            };
            // Act
            const result: boolean =
                field._validateCertificateWithCollection(
                    embeddedCertificates,
                    trustedRoots,
                    signedDate,
                    signatureResult
                );
            field._isCertificateTimeValid =
                originalIsCertificateTimeValid;
            field._verifyCertificateSignature =
                originalVerifyCertificateSignature;
            // Assert
            expect(result).toBeFalsy();
            expect(signatureValidationCallCount).toBe(1);
            expect(signatureResult.validationErrorMessages.length).toBe(1);
            expect(signatureResult.validationErrorMessages[0]).toBe(
                'Cannot be verified against the KeyStore or the certificate chain'
            );
        });
        it('_validateCertificateWithCollection compares different embedded certificates only', () => {
            // Arrange
            const harness: {
                document: PdfDocument;
                page: PdfPage;
                field: PdfSignatureField;
            } = makeSignatureValidationHarness();
            const field: any = harness.field;
            const firstCertificate: any = {
                name: 'first certificate'
            };
            const secondCertificate: any = {
                name: 'second certificate'
            };
            const trustedRoot: any = {
                name: 'trusted root'
            };
            const embeddedCertificates: any[] = [
                firstCertificate,
                secondCertificate
            ];
            const trustedRoots: any[] = [
                trustedRoot
            ];
            const signedDate: Date = new Date(8000);
            const signatureResult: any = {
                validationErrorMessages: []
            };
            const verifiedCertificates: any[] = [];
            const issuerCertificates: any[] = [];
            const originalIsCertificateTimeValid: Function =
                field._isCertificateTimeValid;
            const originalVerifyCertificateSignature: Function =
                field._verifyCertificateSignature;
            field._isCertificateTimeValid = (
                _certificate: any,
                _validationDate: Date
            ): boolean => {
                return true;
            };
            field._verifyCertificateSignature = (
                certificate: any,
                issuerCertificate: any
            ): boolean => {
                verifiedCertificates.push(certificate);
                issuerCertificates.push(issuerCertificate);
                return false;
            };
            // Act
            const result: boolean =
                field._validateCertificateWithCollection(
                    embeddedCertificates,
                    trustedRoots,
                    signedDate,
                    signatureResult
                );
            field._isCertificateTimeValid =
                originalIsCertificateTimeValid;
            field._verifyCertificateSignature =
                originalVerifyCertificateSignature;
            // Assert
            expect(result).toBeFalsy();
            expect(verifiedCertificates.length).toBe(4);
            expect(verifiedCertificates[0]).toBe(firstCertificate);
            expect(issuerCertificates[0]).toBe(trustedRoot);
            expect(verifiedCertificates[1]).toBe(firstCertificate);
            expect(issuerCertificates[1]).toBe(secondCertificate);
            expect(verifiedCertificates[2]).toBe(secondCertificate);
            expect(issuerCertificates[2]).toBe(trustedRoot);
            expect(verifiedCertificates[3]).toBe(secondCertificate);
            expect(issuerCertificates[3]).toBe(firstCertificate);
            expect(issuerCertificates[1]).not.toBe(firstCertificate);
            expect(issuerCertificates[3]).not.toBe(secondCertificate);
            expect(signatureResult.validationErrorMessages.length).toBe(1);
            expect(signatureResult.validationErrorMessages[0]).toBe(
                'Cannot be verified against the KeyStore or the certificate chain'
            );
        });
        it('_validateCertificateWithCollection does not add an error when the last certificate is verified by the chain', () => {
            // Arrange
            const harness: {
                document: PdfDocument;
                page: PdfPage;
                field: PdfSignatureField;
            } = makeSignatureValidationHarness();
            const field: any = harness.field;
            const firstCertificate: any = {
                name: 'first certificate'
            };
            const secondCertificate: any = {
                name: 'second certificate'
            };
            const trustedRoot: any = {
                name: 'trusted root'
            };
            const embeddedCertificates: any[] = [
                firstCertificate,
                secondCertificate
            ];
            const trustedRoots: any[] = [
                trustedRoot
            ];
            const signedDate: Date = new Date(9000);
            const signatureResult: any = {
                validationErrorMessages: []
            };
            const originalIsCertificateTimeValid: Function =
                field._isCertificateTimeValid;
            const originalVerifyCertificateSignature: Function =
                field._verifyCertificateSignature;
            field._isCertificateTimeValid = (
                _certificate: any,
                _validationDate: Date
            ): boolean => {
                return true;
            };
            field._verifyCertificateSignature = (
                certificate: any,
                issuerCertificate: any
            ): boolean => {
                if (issuerCertificate === trustedRoot) {
                    return false;
                }
                return certificate !== issuerCertificate;
            };
            // Act
            const result: boolean =
                field._validateCertificateWithCollection(
                    embeddedCertificates,
                    trustedRoots,
                    signedDate,
                    signatureResult
                );
            field._isCertificateTimeValid =
                originalIsCertificateTimeValid;
            field._verifyCertificateSignature =
                originalVerifyCertificateSignature;
            // Assert
            expect(result).toBeFalsy();
            expect(signatureResult.validationErrorMessages.length).toBe(0);
        });
        it('_validateCertificateWithCollection adds one error when no certificate is verified by the chain', () => {
            // Arrange
            const harness: {
                document: PdfDocument;
                page: PdfPage;
                field: PdfSignatureField;
            } = makeSignatureValidationHarness();
            const field: any = harness.field;
            const firstCertificate: any = {
                name: 'first certificate'
            };
            const secondCertificate: any = {
                name: 'second certificate'
            };
            const trustedRoot: any = {
                name: 'trusted root'
            };
            const embeddedCertificates: any[] = [
                firstCertificate,
                secondCertificate
            ];
            const trustedRoots: any[] = [
                trustedRoot
            ];
            const signedDate: Date = new Date(10000);
            const signatureResult: any = {
                validationErrorMessages: []
            };
            const originalIsCertificateTimeValid: Function =
                field._isCertificateTimeValid;
            const originalVerifyCertificateSignature: Function =
                field._verifyCertificateSignature;
            field._isCertificateTimeValid = (
                _certificate: any,
                _validationDate: Date
            ): boolean => {
                return true;
            };
            field._verifyCertificateSignature = (
                _certificate: any,
                _issuerCertificate: any
            ): boolean => {
                return false;
            };
            // Act
            const result: boolean =
                field._validateCertificateWithCollection(
                    embeddedCertificates,
                    trustedRoots,
                    signedDate,
                    signatureResult
                );
            field._isCertificateTimeValid =
                originalIsCertificateTimeValid;
            field._verifyCertificateSignature =
                originalVerifyCertificateSignature;
            // Assert
            expect(result).toBeFalsy();
            expect(signatureResult.validationErrorMessages.length).toBe(1);
            expect(signatureResult.validationErrorMessages[0]).toBe(
                'Cannot be verified against the KeyStore or the certificate chain'
            );
        });
        it('_validateCertificateWithCollection does not add an error for a nonlast unverified certificate', () => {
            // Arrange
            const harness: {
                document: PdfDocument;
                page: PdfPage;
                field: PdfSignatureField;
            } = makeSignatureValidationHarness();
            const field: any = harness.field;
            const firstCertificate: any = {
                name: 'first certificate'
            };
            const secondCertificate: any = {
                name: 'second certificate'
            };
            const trustedRoot: any = {
                name: 'trusted root'
            };
            const embeddedCertificates: any[] = [
                firstCertificate,
                secondCertificate
            ];
            const trustedRoots: any[] = [
                trustedRoot
            ];
            const signedDate: Date = new Date(11000);
            const signatureResult: any = {
                validationErrorMessages: []
            };
            const originalIsCertificateTimeValid: Function =
                field._isCertificateTimeValid;
            const originalVerifyCertificateSignature: Function =
                field._verifyCertificateSignature;
            field._isCertificateTimeValid = (
                _certificate: any,
                _validationDate: Date
            ): boolean => {
                return true;
            };
            field._verifyCertificateSignature = (
                certificate: any,
                issuerCertificate: any
            ): boolean => {
                if (issuerCertificate === trustedRoot) {
                    return false;
                }
                return certificate === secondCertificate &&
                    issuerCertificate === firstCertificate;
            };
            // Act
            const result: boolean =
                field._validateCertificateWithCollection(
                    embeddedCertificates,
                    trustedRoots,
                    signedDate,
                    signatureResult
                );
            field._isCertificateTimeValid =
                originalIsCertificateTimeValid;
            field._verifyCertificateSignature =
                originalVerifyCertificateSignature;
            // Assert
            expect(result).toBeFalsy();
            expect(signatureResult.validationErrorMessages.length).toBe(0);
        });
        it('_validateCertificateWithCollection stops chain verification after a matching certificate', () => {
            // Arrange
            const harness: {
                document: PdfDocument;
                page: PdfPage;
                field: PdfSignatureField;
            } = makeSignatureValidationHarness();
            const field: any = harness.field;
            const signerCertificate: any = {
                name: 'signer certificate'
            };
            const matchingIssuerCertificate: any = {
                name: 'matching issuer certificate'
            };
            const remainingCertificate: any = {
                name: 'remaining certificate'
            };
            const trustedRoot: any = {
                name: 'trusted root'
            };
            const embeddedCertificates: any[] = [
                signerCertificate,
                matchingIssuerCertificate,
                remainingCertificate
            ];
            const trustedRoots: any[] = [
                trustedRoot
            ];
            const signedDate: Date = new Date(12000);
            const signatureResult: any = {
                validationErrorMessages: []
            };
            const originalIsCertificateTimeValid: Function =
                field._isCertificateTimeValid;
            const originalVerifyCertificateSignature: Function =
                field._verifyCertificateSignature;
            let signerChainCallCount: number = 0;
            field._isCertificateTimeValid = (
                _certificate: any,
                _validationDate: Date
            ): boolean => {
                return true;
            };
            field._verifyCertificateSignature = (
                certificate: any,
                issuerCertificate: any
            ): boolean => {
                if (issuerCertificate === trustedRoot) {
                    return false;
                }
                if (certificate === signerCertificate) {
                    signerChainCallCount++;
                    return issuerCertificate ===
                        matchingIssuerCertificate;
                }
                return false;
            };
            // Act
            const result: boolean =
                field._validateCertificateWithCollection(
                    embeddedCertificates,
                    trustedRoots,
                    signedDate,
                    signatureResult
                );
            field._isCertificateTimeValid =
                originalIsCertificateTimeValid;
            field._verifyCertificateSignature =
                originalVerifyCertificateSignature;
            // Assert
            expect(result).toBeFalsy();
            expect(signerChainCallCount).toBe(1);
            expect(signatureResult.validationErrorMessages.length).toBe(1);
            expect(signatureResult.validationErrorMessages[0]).toBe(
                'Cannot be verified against the KeyStore or the certificate chain'
            );
        });
    });
});
function makeSignatureFieldHarness(): {
    document: PdfDocument;
    page: PdfPage;
    field: PdfSignatureField;
} {
    const document: PdfDocument = new PdfDocument();
    const page: PdfPage = document.addPage();
    const field: PdfSignatureField = new PdfSignatureField(
        page, 'signature1', { x: 20, y: 20, width: 150, height: 40 }
    );
    document.form.add(field);
    return { document, page, field };
}
function makeCertificateDate(date: Date): any {
    return {
        _toDate: (): Date => date
    };
}
function makeCertificateWithValidity(
    validFrom: any,
    validTo: any
): any {
    return {
        _structure: {
            _getSignedCertificate: (): any => {
                return {
                    _startDate: validFrom,
                    _endDate: validTo
                };
            }
        }
    };
}
function makeComparableCertificate(
    encoded: number[],
    subject: any,
    serialNumber: number[]
): any {
    return {
        _getEncoded: (): Uint8Array => new Uint8Array(encoded),
        _structure: {
            _getSignedCertificate: (): any => {
                return {
                    _subject: subject,
                    _serialNumber: new Uint8Array(serialNumber)
                };
            }
        }
    };
}
describe('PdfSignatureField certificate mutation coverage', () => {
    describe('_buildAndValidateCertificateChain', () => {
        it('allows signing when only nonRepudiation key usage is enabled', () => {
            // Arrange
            const harness: {
                document: PdfDocument;
                page: PdfPage;
                field: PdfSignatureField;
            } = makeSignatureFieldHarness();
            const field: any = harness.field;
            const leaf: any = { _keyUsage: [false, true] };
            const validationTime: Date = new Date(2026, 0, 15);
            const originalTimeValidation: any = field._isCertificateTimeValid;
            const originalSelfSigned: any = field._isSelfSigned;
            const originalSameCertificate: any = field._sameCertificate;
            const originalSignatureVerification: any = field._verifyCertificateSignature;
            field._isCertificateTimeValid = (_certificate: any, _at: Date): boolean => true;
            field._isSelfSigned = (_certificate: any): boolean => true;
            field._sameCertificate = (left: any, right: any): boolean => left === right;
            field._verifyCertificateSignature = (_child: any, _issuer: any): boolean => false;
            // Act
            const result: any = field._buildAndValidateCertificateChain(
                leaf, [], [leaf], validationTime
            );
            field._isCertificateTimeValid = originalTimeValidation;
            field._isSelfSigned = originalSelfSigned;
            field._sameCertificate = originalSameCertificate;
            field._verifyCertificateSignature = originalSignatureVerification;
            // Assert
            expect(result.trusted).toBeFalsy();
            expect(result.chain).toEqual([leaf]);
            expect(result.failureReason).toBe('Root certificate self-signature invalid.');
        });
        it('rejects signing when both supported key usages are disabled', () => {
            // Arrange
            const harness: {
                document: PdfDocument;
                page: PdfPage;
                field: PdfSignatureField;
            } = makeSignatureFieldHarness();
            const field: any = harness.field;
            const leaf: any = { _keyUsage: [false, false] };
            const validationTime: Date = new Date(2026, 0, 15);
            // Act
            const result: any = field._buildAndValidateCertificateChain(
                leaf, [], [], validationTime
            );
            // Assert
            expect(result.trusted).toBeFalsy();
            expect(result.chain).toEqual([leaf]);
            expect(result.failureReason).toBe(
                'Signer keyUsage does not allow digital signing.'
            );
        });
        it('returns issuer validity failure for an invalid issuer', () => {
            // Arrange
            const harness: {
                document: PdfDocument;
                page: PdfPage;
                field: PdfSignatureField;
            } = makeSignatureFieldHarness();
            const field: any = harness.field;
            const leaf: any = { _keyUsage: [true, false] };
            const issuer: any = {};
            const validationTime: Date = new Date(2026, 0, 15);
            const originalTimeValidation: any = field._isCertificateTimeValid;
            const originalSelfSigned: any = field._isSelfSigned;
            const originalFindIssuer: any = field._findIssuer;
            const originalSignatureVerification: any = field._verifyCertificateSignature;
            let validityCallCount: number = 0;
            field._isCertificateTimeValid = (
                certificate: any,
                _at: Date
            ): boolean => {
                validityCallCount++;
                return certificate === leaf;
            };
            field._isSelfSigned = (certificate: any): boolean => certificate === issuer;
            field._findIssuer = (_child: any, _pool: any[]): any => issuer;
            field._verifyCertificateSignature = (
                _child: any,
                _issuer: any
            ): boolean => true;
            // Act
            const result: any = field._buildAndValidateCertificateChain(
                leaf, [issuer], [], validationTime
            );
            field._isCertificateTimeValid = originalTimeValidation;
            field._isSelfSigned = originalSelfSigned;
            field._findIssuer = originalFindIssuer;
            field._verifyCertificateSignature = originalSignatureVerification;
            // Assert
            expect(result.trusted).toBeFalsy();
            expect(result.chain).toEqual([leaf]);
            expect(result.failureReason).toBe(
                'Issuer certificate is expired or not yet valid.'
            );
            expect(validityCallCount).toBe(2);
        });
        it('returns complete untrusted-root failure result', () => {
            // Arrange
            const harness: {
                document: PdfDocument;
                page: PdfPage;
                field: PdfSignatureField;
            } = makeSignatureFieldHarness();
            const field: any = harness.field;
            const leaf: any = { _keyUsage: [true, false] };
            const validationTime: Date = new Date(2026, 0, 15);
            const originalTimeValidation: any = field._isCertificateTimeValid;
            const originalSelfSigned: any = field._isSelfSigned;
            const originalSameCertificate: any = field._sameCertificate;
            field._isCertificateTimeValid = (
                _certificate: any,
                _at: Date
            ): boolean => true;
            field._isSelfSigned = (_certificate: any): boolean => true;
            field._sameCertificate = (
                _trustedRoot: any,
                _chainRoot: any
            ): boolean => false;
            // Act
            const result: any = field._buildAndValidateCertificateChain(
                leaf, [], [{}], validationTime
            );
            field._isCertificateTimeValid = originalTimeValidation;
            field._isSelfSigned = originalSelfSigned;
            field._sameCertificate = originalSameCertificate;
            // Assert
            expect(result.trusted).toBeFalsy();
            expect(result.chain).toEqual([leaf]);
            expect(result.failureReason).toBe(
                'Chain terminates at an untrusted root.'
            );
        });
    });
    describe('_findIssuer', () => {
        it('returns authority key identifier match directly', () => {
            // Arrange
            const harness: {
                document: PdfDocument;
                page: PdfPage;
                field: PdfSignatureField;
            } = makeSignatureFieldHarness();
            const field: any = harness.field;
            const child: any = {};
            const matchingIssuer: any = {};
            const unrelatedIssuer: any = {};
            const authorityKeyIdentifier: Uint8Array = new Uint8Array([4, 5, 6]);
            const originalAuthorityIdentifier: any =
                field._tryGetAuthorityKeyIdentifier;
            const originalSubjectIdentifier: any =
                field._tryGetSubjectKeyIdentifier;
            field._tryGetAuthorityKeyIdentifier = (
                _certificate: any
            ): Uint8Array => authorityKeyIdentifier;
            field._tryGetSubjectKeyIdentifier = (
                certificate: any
            ): Uint8Array => {
                return certificate === matchingIssuer
                    ? new Uint8Array([4, 5, 6])
                    : new Uint8Array([7, 8, 9]);
            };
            // Act
            const result: any = field._findIssuer(
                child, [unrelatedIssuer, matchingIssuer]
            );
            field._tryGetAuthorityKeyIdentifier = originalAuthorityIdentifier;
            field._tryGetSubjectKeyIdentifier = originalSubjectIdentifier;
            // Assert
            expect(result).toBe(matchingIssuer);
            expect(result).not.toBe(unrelatedIssuer);
        });
        it('does not return first pool entry when authority identifier has no match', () => {
            // Arrange
            const harness: {
                document: PdfDocument;
                page: PdfPage;
                field: PdfSignatureField;
            } = makeSignatureFieldHarness();
            const field: any = harness.field;
            const issuerName: any = { name: 'Expected issuer' };
            const child: any = {
                _structure: {
                    _getSignedCertificate: (): any => {
                        return { _issuer: issuerName };
                    },
                    _getSignatureValue: (): Uint8Array => new Uint8Array([1])
                }
            };
            const firstCertificate: any = {
                _structure: {
                    _getSignedCertificate: (): any => {
                        return { _subject: { name: 'Other issuer' } };
                    }
                }
            };
            const originalAuthorityIdentifier: any =
                field._tryGetAuthorityKeyIdentifier;
            const originalSubjectIdentifier: any =
                field._tryGetSubjectKeyIdentifier;
            const originalNameComparison: any =
                field._areDistinguishedNamesEqual;
            field._tryGetAuthorityKeyIdentifier = (
                _certificate: any
            ): Uint8Array => new Uint8Array([1]);
            field._tryGetSubjectKeyIdentifier = (
                _certificate: any
            ): Uint8Array => new Uint8Array([2]);
            field._areDistinguishedNamesEqual = (
                _issuer: any,
                _subject: any
            ): boolean => false;
            // Act
            const result: any = field._findIssuer(child, [firstCertificate]);
            field._tryGetAuthorityKeyIdentifier = originalAuthorityIdentifier;
            field._tryGetSubjectKeyIdentifier = originalSubjectIdentifier;
            field._areDistinguishedNamesEqual = originalNameComparison;
            // Assert
            expect(result).toBeNull();
            expect(result).not.toBe(firstCertificate);
        });
        it('filters null issuer candidates', () => {
            // Arrange
            const harness: {
                document: PdfDocument;
                page: PdfPage;
                field: PdfSignatureField;
            } = makeSignatureFieldHarness();
            const field: any = harness.field;
            const child: any = {
                _structure: {
                    _getSignedCertificate: (): any => {
                        return { _issuer: { name: 'Issuer' } };
                    },
                    _getSignatureValue: (): Uint8Array => new Uint8Array([1])
                }
            };
            const originalAuthorityIdentifier: any =
                field._tryGetAuthorityKeyIdentifier;
            field._tryGetAuthorityKeyIdentifier = (
                _certificate: any
            ): undefined => undefined;
            // Act
            const result: any = field._findIssuer(child, [null]);
            field._tryGetAuthorityKeyIdentifier = originalAuthorityIdentifier;
            // Assert
            expect(result).toBeNull();
        });
        it('filters issuer candidate when certificate parsing throws', () => {
            // Arrange
            const harness: {
                document: PdfDocument;
                page: PdfPage;
                field: PdfSignatureField;
            } = makeSignatureFieldHarness();
            const field: any = harness.field;
            const child: any = {
                _structure: {
                    _getSignedCertificate: (): any => {
                        return { _issuer: { name: 'Issuer' } };
                    },
                    _getSignatureValue: (): Uint8Array => new Uint8Array([1])
                }
            };
            const invalidIssuer: any = {
                _structure: {
                    _getSignedCertificate: (): any => {
                        throw new Error('Invalid certificate structure');
                    }
                }
            };
            const originalAuthorityIdentifier: any =
                field._tryGetAuthorityKeyIdentifier;
            field._tryGetAuthorityKeyIdentifier = (
                _certificate: any
            ): undefined => undefined;
            // Act
            const result: any = field._findIssuer(child, [invalidIssuer]);
            field._tryGetAuthorityKeyIdentifier = originalAuthorityIdentifier;
            // Assert
            expect(result).toBeNull();
            expect(result).not.toBe(invalidIssuer);
        });
        it('filters issuer candidate with undefined signed certificate', () => {
            // Arrange
            const harness: {
                document: PdfDocument;
                page: PdfPage;
                field: PdfSignatureField;
            } = makeSignatureFieldHarness();
            const field: any = harness.field;
            const child: any = {
                _structure: {
                    _getSignedCertificate: (): any => {
                        return { _issuer: { name: 'Issuer' } };
                    },
                    _getSignatureValue: (): Uint8Array => new Uint8Array([1])
                }
            };
            const invalidIssuer: any = {
                _structure: {
                    _getSignedCertificate: (): undefined => undefined
                }
            };
            const originalAuthorityIdentifier: any =
                field._tryGetAuthorityKeyIdentifier;
            field._tryGetAuthorityKeyIdentifier = (
                _certificate: any
            ): undefined => undefined;
            // Act
            const result: any = field._findIssuer(child, [invalidIssuer]);
            field._tryGetAuthorityKeyIdentifier = originalAuthorityIdentifier;
            // Assert
            expect(result).toBeNull();
        });
        it('filters issuer candidate without a subject', () => {
            // Arrange
            const harness: {
                document: PdfDocument;
                page: PdfPage;
                field: PdfSignatureField;
            } = makeSignatureFieldHarness();
            const field: any = harness.field;
            const child: any = {
                _structure: {
                    _getSignedCertificate: (): any => {
                        return { _issuer: { name: 'Issuer' } };
                    },
                    _getSignatureValue: (): Uint8Array => new Uint8Array([1])
                }
            };
            const invalidIssuer: any = {
                _structure: {
                    _getSignedCertificate: (): any => {
                        return { _subject: undefined };
                    }
                }
            };
            const originalAuthorityIdentifier: any =
                field._tryGetAuthorityKeyIdentifier;
            field._tryGetAuthorityKeyIdentifier = (
                _certificate: any
            ): undefined => undefined;
            // Act
            const result: any = field._findIssuer(child, [invalidIssuer]);
            field._tryGetAuthorityKeyIdentifier = originalAuthorityIdentifier;
            // Assert
            expect(result).toBeNull();
        });
    });
    describe('_mapCertificateSigAlgOidToHash', () => {
        it('maps SHA1 certificate signature OID', () => {
            // Arrange
            const harness: {
                document: PdfDocument;
                page: PdfPage;
                field: PdfSignatureField;
            } = makeSignatureFieldHarness();
            const field: any = harness.field;
            // Act
            const result: string = field._mapCertificateSigAlgOidToHash(
                '1.2.840.113549.1.1.5'
            );
            // Assert
            expect(result).toBe('SHA1');
            expect(result).not.toBe('');
        });
        it('maps SHA256 certificate signature OID', () => {
            // Arrange
            const harness: {
                document: PdfDocument;
                page: PdfPage;
                field: PdfSignatureField;
            } = makeSignatureFieldHarness();
            const field: any = harness.field;
            // Act
            const result: string = field._mapCertificateSigAlgOidToHash(
                '1.2.840.113549.1.1.11'
            );
            // Assert
            expect(result).toBe('SHA256');
            expect(result).not.toBe('SHA1');
            expect(result).not.toBe('');
        });
        it('returns null for an empty certificate signature OID', () => {
            // Arrange
            const harness: {
                document: PdfDocument;
                page: PdfPage;
                field: PdfSignatureField;
            } = makeSignatureFieldHarness();
            const field: any = harness.field;
            // Act
            const result: string | null =
                field._mapCertificateSigAlgOidToHash('');
            // Assert
            expect(result).toBeNull();
        });
    });
    describe('_verifyCertificateSignature', () => {
        it('returns false for unsupported signature algorithm', () => {
            // Arrange
            const harness: {
                document: PdfDocument;
                page: PdfPage;
                field: PdfSignatureField;
            } = makeSignatureFieldHarness();
            const field: any = harness.field;
            const child: any = {
                _structure: {
                    _getSignatureAlgorithmOid: (): string => 'unsupported',
                    _getSignatureValue: (): Uint8Array => new Uint8Array([1])
                },
                _getTobeSignedCertificate: (): Uint8Array =>
                    new Uint8Array([2])
            };
            const issuer: any = {
                _getPublicKey: (_isPrivate: boolean): any => null
            };
            // Act
            const result: boolean =
                field._verifyCertificateSignature(child, issuer);
            // Assert
            expect(result).toBeFalsy();
        });
        it('returns false for undefined signature bytes', () => {
            // Arrange
            const harness: {
                document: PdfDocument;
                page: PdfPage;
                field: PdfSignatureField;
            } = makeSignatureFieldHarness();
            const field: any = harness.field;
            const child: any = {
                _structure: {
                    _getSignatureAlgorithmOid: (): string =>
                        '1.2.840.113549.1.1.11',
                    _getSignatureValue: (): undefined => undefined
                },
                _getTobeSignedCertificate: (): Uint8Array =>
                    new Uint8Array([2])
            };
            const issuer: any = {
                _getPublicKey: (_isPrivate: boolean): any => null
            };
            // Act
            const result: boolean =
                field._verifyCertificateSignature(child, issuer);
            // Assert
            expect(result).toBeFalsy();
        });
        it('returns false for empty signature bytes', () => {
            // Arrange
            const harness: {
                document: PdfDocument;
                page: PdfPage;
                field: PdfSignatureField;
            } = makeSignatureFieldHarness();
            const field: any = harness.field;
            const child: any = {
                _structure: {
                    _getSignatureAlgorithmOid: (): string =>
                        '1.2.840.113549.1.1.11',
                    _getSignatureValue: (): Uint8Array => new Uint8Array(0)
                },
                _getTobeSignedCertificate: (): Uint8Array =>
                    new Uint8Array([2])
            };
            const issuer: any = {
                _getPublicKey: (_isPrivate: boolean): any => null
            };
            // Act
            const result: boolean =
                field._verifyCertificateSignature(child, issuer);
            // Assert
            expect(result).toBeFalsy();
        });
        it('requests issuer public key with false and rejects invalid parameter', () => {
            // Arrange
            const harness: {
                document: PdfDocument;
                page: PdfPage;
                field: PdfSignatureField;
            } = makeSignatureFieldHarness();
            const field: any = harness.field;
            const child: any = {
                _structure: {
                    _getSignatureAlgorithmOid: (): string =>
                        '1.2.840.113549.1.1.11',
                    _getSignatureValue: (): Uint8Array =>
                        new Uint8Array([3, 4])
                },
                _getTobeSignedCertificate: (): Uint8Array =>
                    new Uint8Array([1, 2])
            };
            let requestedPrivateKey: boolean = true;
            const issuer: any = {
                _getPublicKey: (isPrivate: boolean): any => {
                    requestedPrivateKey = isPrivate;
                    return {};
                }
            };
            // Act
            const result: boolean =
                field._verifyCertificateSignature(child, issuer);
            // Assert
            expect(requestedPrivateKey).toBeFalsy();
            expect(result).toBeFalsy();
        });
        it('passes supported hash and certificate bytes to CMS verification', () => {
            // Arrange
            const harness: {
                document: PdfDocument;
                page: PdfPage;
                field: PdfSignatureField;
            } = makeSignatureFieldHarness();
            const field: any = harness.field;
            const signedCertificate: Uint8Array = new Uint8Array([1, 2, 3]);
            const signature: Uint8Array = new Uint8Array([4, 5, 6]);
            const publicKey: any = new (_PdfRonCipherParameter as any)();
            const cipherParameter: any = { source: publicKey };
            const child: any = {
                _structure: {
                    _getSignatureAlgorithmOid: (): string =>
                        '1.2.840.113549.1.1.11',
                    _getSignatureValue: (): Uint8Array => signature
                },
                _getTobeSignedCertificate: (): Uint8Array =>
                    signedCertificate
            };
            const issuer: any = {
                _getPublicKey: (_isPrivate: boolean): any => publicKey
            };
            const originalCipherConversion: any = field._toICipherParam;
            const originalCmsSigner: any = field._cmsSigner;
            let receivedHashName: string = '';
            let receivedCertificate: Uint8Array;
            let receivedSignature: Uint8Array;
            let receivedCipherParameter: any;
            field._toICipherParam = (_publicKey: any): any => cipherParameter;
            field._cmsSigner = {
                _verifyRsaPkcs1Signature: (
                    hashName: string,
                    certificateBytes: Uint8Array,
                    signatureBytes: Uint8Array,
                    parameter: any
                ): boolean => {
                    receivedHashName = hashName;
                    receivedCertificate = certificateBytes;
                    receivedSignature = signatureBytes;
                    receivedCipherParameter = parameter;
                    return true;
                }
            };
            // Act
            const result: boolean =
                field._verifyCertificateSignature(child, issuer);
            field._toICipherParam = originalCipherConversion;
            field._cmsSigner = originalCmsSigner;
            // Assert
            expect(result).toBeTruthy();
            expect(receivedHashName).toBe('SHA256');
            expect(receivedCertificate).toBe(signedCertificate);
            expect(receivedSignature).toBe(signature);
            expect(receivedCipherParameter).toBe(cipherParameter);
        });
    });
    describe('_isCertificateTimeValid', () => {
        it('returns false when certificate start date is missing', () => {
            // Arrange
            const harness: {
                document: PdfDocument;
                page: PdfPage;
                field: PdfSignatureField;
            } = makeSignatureFieldHarness();
            const field: any = harness.field;
            const certificate: any = makeCertificateWithValidity(
                undefined,
                makeCertificateDate(new Date(2026, 11, 31))
            );
            const validationTime: Date = new Date(2026, 5, 15);
            // Act
            const result: boolean =
                field._isCertificateTimeValid(certificate, validationTime);
            // Assert
            expect(result).toBeFalsy();
        });
        it('returns false when certificate start date has no conversion function', () => {
            // Arrange
            const harness: {
                document: PdfDocument;
                page: PdfPage;
                field: PdfSignatureField;
            } = makeSignatureFieldHarness();
            const field: any = harness.field;
            const certificate: any = makeCertificateWithValidity(
                { _toDate: 'invalid' },
                makeCertificateDate(new Date(2026, 11, 31))
            );
            const validationTime: Date = new Date(2026, 5, 15);
            // Act
            const result: boolean =
                field._isCertificateTimeValid(certificate, validationTime);
            // Assert
            expect(result).toBeFalsy();
        });
        it('returns false when certificate end date is missing', () => {
            // Arrange
            const harness: {
                document: PdfDocument;
                page: PdfPage;
                field: PdfSignatureField;
            } = makeSignatureFieldHarness();
            const field: any = harness.field;
            const certificate: any = makeCertificateWithValidity(
                makeCertificateDate(new Date(2026, 0, 1)),
                undefined
            );
            const validationTime: Date = new Date(2026, 5, 15);
            // Act
            const result: boolean =
                field._isCertificateTimeValid(certificate, validationTime);
            // Assert
            expect(result).toBeFalsy();
        });
        it('returns false when certificate end date has no conversion function', () => {
            // Arrange
            const harness: {
                document: PdfDocument;
                page: PdfPage;
                field: PdfSignatureField;
            } = makeSignatureFieldHarness();
            const field: any = harness.field;
            const certificate: any = makeCertificateWithValidity(
                makeCertificateDate(new Date(2026, 0, 1)),
                { _toDate: 'invalid' }
            );
            const validationTime: Date = new Date(2026, 5, 15);
            // Act
            const result: boolean =
                field._isCertificateTimeValid(certificate, validationTime);
            // Assert
            expect(result).toBeFalsy();
        });
        it('returns true at exact certificate start date', () => {
            // Arrange
            const harness: {
                document: PdfDocument;
                page: PdfPage;
                field: PdfSignatureField;
            } = makeSignatureFieldHarness();
            const field: any = harness.field;
            const startDate: Date = new Date(2026, 0, 1);
            const endDate: Date = new Date(2026, 11, 31);
            const certificate: any = makeCertificateWithValidity(
                makeCertificateDate(startDate),
                makeCertificateDate(endDate)
            );
            // Act
            const result: boolean =
                field._isCertificateTimeValid(certificate, startDate);
            // Assert
            expect(result).toBeTruthy();
        });
        it('returns true at exact certificate end date', () => {
            // Arrange
            const harness: {
                document: PdfDocument;
                page: PdfPage;
                field: PdfSignatureField;
            } = makeSignatureFieldHarness();
            const field: any = harness.field;
            const startDate: Date = new Date(2026, 0, 1);
            const endDate: Date = new Date(2026, 11, 31);
            const certificate: any = makeCertificateWithValidity(
                makeCertificateDate(startDate),
                makeCertificateDate(endDate)
            );
            // Act
            const result: boolean =
                field._isCertificateTimeValid(certificate, endDate);
            // Assert
            expect(result).toBeTruthy();
        });
        it('returns true strictly inside certificate validity range', () => {
            // Arrange
            const harness: {
                document: PdfDocument;
                page: PdfPage;
                field: PdfSignatureField;
            } = makeSignatureFieldHarness();
            const field: any = harness.field;
            const certificate: any = makeCertificateWithValidity(
                makeCertificateDate(new Date(2026, 0, 1)),
                makeCertificateDate(new Date(2026, 11, 31))
            );
            const validationTime: Date = new Date(2026, 5, 15);
            // Act
            const result: boolean =
                field._isCertificateTimeValid(certificate, validationTime);
            // Assert
            expect(result).toBeTruthy();
        });
        it('returns false before certificate start date', () => {
            // Arrange
            const harness: {
                document: PdfDocument;
                page: PdfPage;
                field: PdfSignatureField;
            } = makeSignatureFieldHarness();
            const field: any = harness.field;
            const certificate: any = makeCertificateWithValidity(
                makeCertificateDate(new Date(2026, 0, 2)),
                makeCertificateDate(new Date(2026, 11, 31))
            );
            const validationTime: Date = new Date(2026, 0, 1);
            // Act
            const result: boolean =
                field._isCertificateTimeValid(certificate, validationTime);
            // Assert
            expect(result).toBeFalsy();
        });
        it('returns false after certificate end date', () => {
            // Arrange
            const harness: {
                document: PdfDocument;
                page: PdfPage;
                field: PdfSignatureField;
            } = makeSignatureFieldHarness();
            const field: any = harness.field;
            const certificate: any = makeCertificateWithValidity(
                makeCertificateDate(new Date(2026, 0, 1)),
                makeCertificateDate(new Date(2026, 11, 30))
            );
            const validationTime: Date = new Date(2026, 11, 31);
            // Act
            const result: boolean =
                field._isCertificateTimeValid(certificate, validationTime);
            // Assert
            expect(result).toBeFalsy();
        });
    });
    describe('_sameCertificate', () => {
        it('returns true when encoded certificates are equal', () => {
            // Arrange
            const harness: {
                document: PdfDocument;
                page: PdfPage;
                field: PdfSignatureField;
            } = makeSignatureFieldHarness();
            const field: any = harness.field;
            const firstCertificate: any = makeComparableCertificate(
                [1, 2, 3], { name: 'First' }, [1]
            );
            const secondCertificate: any = makeComparableCertificate(
                [1, 2, 3], { name: 'Second' }, [2]
            );
            // Act
            const result: boolean =
                field._sameCertificate(firstCertificate, secondCertificate);
            // Assert
            expect(result).toBeTruthy();
        });
        it('returns true when subject and serial number are equal', () => {
            // Arrange
            const harness: {
                document: PdfDocument;
                page: PdfPage;
                field: PdfSignatureField;
            } = makeSignatureFieldHarness();
            const field: any = harness.field;
            const firstSubject: any = { name: 'Trusted Root' };
            const secondSubject: any = { name: 'Trusted Root' };
            const firstCertificate: any = makeComparableCertificate(
                [1], firstSubject, [9, 8, 7]
            );
            const secondCertificate: any = makeComparableCertificate(
                [2], secondSubject, [9, 8, 7]
            );
            const originalNameComparison: any =
                field._areDistinguishedNamesEqual;
            field._areDistinguishedNamesEqual = (
                left: any,
                right: any
            ): boolean => {
                return left.name === right.name;
            };
            // Act
            const result: boolean =
                field._sameCertificate(firstCertificate, secondCertificate);
            field._areDistinguishedNamesEqual = originalNameComparison;
            // Assert
            expect(result).toBeTruthy();
        });
        it('returns false when only distinguished names are equal', () => {
            // Arrange
            const harness: {
                document: PdfDocument;
                page: PdfPage;
                field: PdfSignatureField;
            } = makeSignatureFieldHarness();
            const field: any = harness.field;
            const firstCertificate: any = makeComparableCertificate(
                [1], { name: 'Trusted Root' }, [1]
            );
            const secondCertificate: any = makeComparableCertificate(
                [2], { name: 'Trusted Root' }, [2]
            );
            const originalNameComparison: any =
                field._areDistinguishedNamesEqual;
            field._areDistinguishedNamesEqual = (
                _left: any,
                _right: any
            ): boolean => true;
            // Act
            const result: boolean =
                field._sameCertificate(firstCertificate, secondCertificate);
            field._areDistinguishedNamesEqual = originalNameComparison;
            // Assert
            expect(result).toBeFalsy();
        });
        it('returns false when only serial numbers are equal', () => {
            // Arrange
            const harness: {
                document: PdfDocument;
                page: PdfPage;
                field: PdfSignatureField;
            } = makeSignatureFieldHarness();
            const field: any = harness.field;
            const firstCertificate: any = makeComparableCertificate(
                [1], { name: 'First Root' }, [5, 6]
            );
            const secondCertificate: any = makeComparableCertificate(
                [2], { name: 'Second Root' }, [5, 6]
            );
            const originalNameComparison: any =
                field._areDistinguishedNamesEqual;
            field._areDistinguishedNamesEqual = (
                _left: any,
                _right: any
            ): boolean => false;
            // Act
            const result: boolean =
                field._sameCertificate(firstCertificate, secondCertificate);
            field._areDistinguishedNamesEqual = originalNameComparison;
            // Assert
            expect(result).toBeFalsy();
        });
        it('returns false when subject and serial number are different', () => {
            // Arrange
            const harness: {
                document: PdfDocument;
                page: PdfPage;
                field: PdfSignatureField;
            } = makeSignatureFieldHarness();
            const field: any = harness.field;
            const firstCertificate: any = makeComparableCertificate(
                [1], { name: 'First Root' }, [1]
            );
            const secondCertificate: any = makeComparableCertificate(
                [2], { name: 'Second Root' }, [2]
            );
            const originalNameComparison: any =
                field._areDistinguishedNamesEqual;
            field._areDistinguishedNamesEqual = (
                _left: any,
                _right: any
            ): boolean => false;
            // Act
            const result: boolean =
                field._sameCertificate(firstCertificate, secondCertificate);
            field._areDistinguishedNamesEqual = originalNameComparison;
            // Assert
            expect(result).toBeFalsy();
        });
    });
});
function makeSignatureCertificateHarness(): {
    document: PdfDocument;
    page: PdfPage;
    field: PdfSignatureField;
} {
    const document: PdfDocument = new PdfDocument();
    const page: PdfPage = document.addPage();
    const field: PdfSignatureField = new PdfSignatureField(
        page, 'signature1', { x: 20, y: 20, width: 150, height: 40 }
    );
    document.form.add(field);
    return { document, page, field };
}
describe('PdfSignatureField certificate identifier mutation coverage', () => {
    describe('_tryGetAuthorityKeyIdentifier', () => {
        it('returns null when certificate extensions are unavailable', () => {
            // Arrange
            const harness: {
                document: PdfDocument;
                page: PdfPage;
                field: PdfSignatureField;
            } = makeSignatureCertificateHarness();
            const field: any = harness.field;
            const certificate: any = {
                _getExtensions: (): undefined => undefined
            };
            // Act
            const result: Uint8Array | null =
                field._tryGetAuthorityKeyIdentifier(certificate);
            // Assert
            expect(result).toBeNull();
        });
        it('returns null when authority key identifier extension is unavailable', () => {
            // Arrange
            const harness: {
                document: PdfDocument;
                page: PdfPage;
                field: PdfSignatureField;
            } = makeSignatureCertificateHarness();
            const field: any = harness.field;
            const extensions: any = {
                _authorityKeyIdentifier: '2.5.29.35',
                _getExtension: (_oid: any): undefined => undefined
            };
            const certificate: any = {
                _getExtensions: (): any => extensions
            };
            // Act
            const result: Uint8Array | null =
                field._tryGetAuthorityKeyIdentifier(certificate);
            // Assert
            expect(result).toBeNull();
        });
        it('returns null when authority key identifier extension value is unavailable', () => {
            // Arrange
            const harness: {
                document: PdfDocument;
                page: PdfPage;
                field: PdfSignatureField;
            } = makeSignatureCertificateHarness();
            const field: any = harness.field;
            const extension: any = {
                _value: undefined
            };
            const extensions: any = {
                _authorityKeyIdentifier: '2.5.29.35',
                _getExtension: (_oid: any): any => extension
            };
            const certificate: any = {
                _getExtensions: (): any => extensions
            };
            // Act
            const result: Uint8Array | null =
                field._tryGetAuthorityKeyIdentifier(certificate);
            // Assert
            expect(result).toBeNull();
        });
        it('returns null when unwrapped authority identifier is unavailable', () => {
            // Arrange
            const harness: {
                document: PdfDocument;
                page: PdfPage;
                field: PdfSignatureField;
            } = makeSignatureCertificateHarness();
            const field: any = harness.field;
            const extensionValue: any = {};
            const extension: any = {
                _value: extensionValue
            };
            const extensions: any = {
                _authorityKeyIdentifier: '2.5.29.35',
                _getExtension: (_oid: any): any => extension
            };
            const certificate: any = {
                _getExtensions: (): any => extensions
            };
            const originalUnwrapExtensionValue: any =
                field._unwrapExtensionValue;
            field._unwrapExtensionValue = (_value: any): undefined => undefined;
            // Act
            const result: Uint8Array | null =
                field._tryGetAuthorityKeyIdentifier(certificate);
            field._unwrapExtensionValue = originalUnwrapExtensionValue;
            // Assert
            expect(result).toBeNull();
        });
        it('returns null when authority identifier sequence is undefined', () => {
            // Arrange
            const harness: {
                document: PdfDocument;
                page: PdfPage;
                field: PdfSignatureField;
            } = makeSignatureCertificateHarness();
            const field: any = harness.field;
            const extensionValue: any = {};
            const innerElement: any = {
                _getSequence: (): undefined => undefined
            };
            const extension: any = {
                _value: extensionValue
            };
            const extensions: any = {
                _authorityKeyIdentifier: '2.5.29.35',
                _getExtension: (_oid: any): any => extension
            };
            const certificate: any = {
                _getExtensions: (): any => extensions
            };
            const originalUnwrapExtensionValue: any =
                field._unwrapExtensionValue;
            field._unwrapExtensionValue = (_value: any): any => innerElement;
            // Act
            const result: Uint8Array | null =
                field._tryGetAuthorityKeyIdentifier(certificate);
            field._unwrapExtensionValue = originalUnwrapExtensionValue;
            // Assert
            expect(result).toBeNull();
        });
        it('returns null when authority identifier sequence is empty', () => {
            // Arrange
            const harness: {
                document: PdfDocument;
                page: PdfPage;
                field: PdfSignatureField;
            } = makeSignatureCertificateHarness();
            const field: any = harness.field;
            const extensionValue: any = {};
            const innerElement: any = {
                _getSequence: (): any[] => []
            };
            const extension: any = {
                _value: extensionValue
            };
            const extensions: any = {
                _authorityKeyIdentifier: '2.5.29.35',
                _getExtension: (_oid: any): any => extension
            };
            const certificate: any = {
                _getExtensions: (): any => extensions
            };
            const originalUnwrapExtensionValue: any =
                field._unwrapExtensionValue;
            field._unwrapExtensionValue = (_value: any): any => innerElement;
            // Act
            const result: Uint8Array | null =
                field._tryGetAuthorityKeyIdentifier(certificate);
            field._unwrapExtensionValue = originalUnwrapExtensionValue;
            // Assert
            expect(result).toBeNull();
        });
        it('returns null when sequence member is not tagged', () => {
            // Arrange
            const harness: {
                document: PdfDocument;
                page: PdfPage;
                field: PdfSignatureField;
            } = makeSignatureCertificateHarness();
            const field: any = harness.field;
            const extensionValue: any = {};
            const sequenceElement: any = {
                _isTagged: (): boolean => false,
                _getTagNumber: (): number => 0,
                _getValue: (): Uint8Array => new Uint8Array([1, 2, 3])
            };
            const innerElement: any = {
                _getSequence: (): any[] => [sequenceElement]
            };
            const extension: any = {
                _value: extensionValue
            };
            const extensions: any = {
                _authorityKeyIdentifier: '2.5.29.35',
                _getExtension: (_oid: any): any => extension
            };
            const certificate: any = {
                _getExtensions: (): any => extensions
            };
            const originalUnwrapExtensionValue: any =
                field._unwrapExtensionValue;
            field._unwrapExtensionValue = (_value: any): any => innerElement;
            // Act
            const result: Uint8Array | null =
                field._tryGetAuthorityKeyIdentifier(certificate);
            field._unwrapExtensionValue = originalUnwrapExtensionValue;
            // Assert
            expect(result).toBeNull();
        });
        it('returns null when tagged sequence member has a different tag number', () => {
            // Arrange
            const harness: {
                document: PdfDocument;
                page: PdfPage;
                field: PdfSignatureField;
            } = makeSignatureCertificateHarness();
            const field: any = harness.field;
            const extensionValue: any = {};
            const sequenceElement: any = {
                _isTagged: (): boolean => true,
                _getTagNumber: (): number => 1,
                _getValue: (): Uint8Array => new Uint8Array([1, 2, 3])
            };
            const innerElement: any = {
                _getSequence: (): any[] => [sequenceElement]
            };
            const extension: any = {
                _value: extensionValue
            };
            const extensions: any = {
                _authorityKeyIdentifier: '2.5.29.35',
                _getExtension: (_oid: any): any => extension
            };
            const certificate: any = {
                _getExtensions: (): any => extensions
            };
            const originalUnwrapExtensionValue: any =
                field._unwrapExtensionValue;
            field._unwrapExtensionValue = (_value: any): any => innerElement;
            // Act
            const result: Uint8Array | null =
                field._tryGetAuthorityKeyIdentifier(certificate);
            field._unwrapExtensionValue = originalUnwrapExtensionValue;
            // Assert
            expect(result).toBeNull();
        });
    });
    describe('_unwrapExtensionValue', () => {
        it('returns undefined for undefined extension value', () => {
            // Arrange
            const harness: {
                document: PdfDocument;
                page: PdfPage;
                field: PdfSignatureField;
            } = makeSignatureCertificateHarness();
            const field: any = harness.field;
            // Act
            const result: any = field._unwrapExtensionValue(undefined);
            // Assert
            expect(result).toBeUndefined();
        });
        it('returns undefined when extension value API is not a function', () => {
            // Arrange
            const harness: {
                document: PdfDocument;
                page: PdfPage;
                field: PdfSignatureField;
            } = makeSignatureCertificateHarness();
            const field: any = harness.field;
            const extensionValue: any = {
                _getValue: new Uint8Array([1, 2, 3])
            };
            // Act
            const result: any =
                field._unwrapExtensionValue(extensionValue);
            // Assert
            expect(result).toBeUndefined();
        });
        it('returns undefined when extension contains empty DER bytes', () => {
            // Arrange
            const harness: {
                document: PdfDocument;
                page: PdfPage;
                field: PdfSignatureField;
            } = makeSignatureCertificateHarness();
            const field: any = harness.field;
            const extensionValue: any = {
                _getValue: (): Uint8Array => new Uint8Array(0)
            };
            // Act
            const result: any =
                field._unwrapExtensionValue(extensionValue);
            // Assert
            expect(result).toBeUndefined();
        });
    });
    describe('_tryGetSubjectKeyIdentifier', () => {
        it('returns null when certificate extensions are unavailable', () => {
            // Arrange
            const harness: {
                document: PdfDocument;
                page: PdfPage;
                field: PdfSignatureField;
            } = makeSignatureCertificateHarness();
            const field: any = harness.field;
            const certificate: any = {
                _getExtensions: (): undefined => undefined
            };
            // Act
            const result: Uint8Array | null =
                field._tryGetSubjectKeyIdentifier(certificate);
            // Assert
            expect(result).toBeNull();
        });
        it('returns null when subject key identifier extension is unavailable', () => {
            // Arrange
            const harness: {
                document: PdfDocument;
                page: PdfPage;
                field: PdfSignatureField;
            } = makeSignatureCertificateHarness();
            const field: any = harness.field;
            const certificate: any = {
                _getExtensions: (): any => {
                    return {};
                },
                _getExtension: (_identifier: any): undefined => undefined
            };
            // Act
            const result: Uint8Array | null =
                field._tryGetSubjectKeyIdentifier(certificate);
            // Assert
            expect(result).toBeNull();
        });
        it('returns null when subject key identifier cannot be unwrapped', () => {
            // Arrange
            const harness: {
                document: PdfDocument;
                page: PdfPage;
                field: PdfSignatureField;
            } = makeSignatureCertificateHarness();
            const field: any = harness.field;
            const extensionElement: any = {};
            const certificate: any = {
                _getExtensions: (): any => {
                    return {};
                },
                _getExtension: (_identifier: any): any => extensionElement
            };
            const originalUnwrapExtensionValue: any =
                field._unwrapExtensionValue;
            field._unwrapExtensionValue = (_value: any): undefined => undefined;
            // Act
            const result: Uint8Array | null =
                field._tryGetSubjectKeyIdentifier(certificate);
            field._unwrapExtensionValue = originalUnwrapExtensionValue;
            // Assert
            expect(result).toBeNull();
        });
        it('returns null when unwrapped subject identifier has no value API', () => {
            // Arrange
            const harness: {
                document: PdfDocument;
                page: PdfPage;
                field: PdfSignatureField;
            } = makeSignatureCertificateHarness();
            const field: any = harness.field;
            const extensionElement: any = {};
            const innerElement: any = {
                _getValue: new Uint8Array([1])
            };
            const certificate: any = {
                _getExtensions: (): any => {
                    return {};
                },
                _getExtension: (_identifier: any): any => extensionElement
            };
            const originalUnwrapExtensionValue: any =
                field._unwrapExtensionValue;
            field._unwrapExtensionValue = (_value: any): any => innerElement;
            // Act
            const result: Uint8Array | null =
                field._tryGetSubjectKeyIdentifier(certificate);
            field._unwrapExtensionValue = originalUnwrapExtensionValue;
            // Assert
            expect(result).toBeNull();
        });
        it('returns null when subject key identifier is empty', () => {
            // Arrange
            const harness: {
                document: PdfDocument;
                page: PdfPage;
                field: PdfSignatureField;
            } = makeSignatureCertificateHarness();
            const field: any = harness.field;
            const extensionElement: any = {};
            const innerElement: any = {
                _getValue: (): Uint8Array => new Uint8Array(0)
            };
            const certificate: any = {
                _getExtensions: (): any => {
                    return {};
                },
                _getExtension: (_identifier: any): any => extensionElement
            };
            const originalUnwrapExtensionValue: any =
                field._unwrapExtensionValue;
            field._unwrapExtensionValue = (_value: any): any => innerElement;
            // Act
            const result: Uint8Array | null =
                field._tryGetSubjectKeyIdentifier(certificate);
            field._unwrapExtensionValue = originalUnwrapExtensionValue;
            // Assert
            expect(result).toBeNull();
        });
        it('returns subject key identifier when key bytes are available', () => {
            // Arrange
            const harness: {
                document: PdfDocument;
                page: PdfPage;
                field: PdfSignatureField;
            } = makeSignatureCertificateHarness();
            const field: any = harness.field;
            const expectedKeyIdentifier: Uint8Array =
                new Uint8Array([15, 25, 35]);
            const extensionElement: any = {};
            const innerElement: any = {
                _getValue: (): Uint8Array => expectedKeyIdentifier
            };
            const certificate: any = {
                _getExtensions: (): any => {
                    return {};
                },
                _getExtension: (_identifier: any): any => extensionElement
            };
            const originalUnwrapExtensionValue: any =
                field._unwrapExtensionValue;
            field._unwrapExtensionValue = (_value: any): any => innerElement;
            // Act
            const result: Uint8Array | null =
                field._tryGetSubjectKeyIdentifier(certificate);
            field._unwrapExtensionValue = originalUnwrapExtensionValue;
            // Assert
            expect(result).toBe(expectedKeyIdentifier);
            expect(result.length).toBe(3);
            expect(result[0]).toBe(15);
            expect(result[2]).toBe(35);
        });
    });
    describe('_areDistinguishedNamesEqual', () => {
        it('returns false when first distinguished name is unavailable', () => {
            // Arrange
            const harness: {
                document: PdfDocument;
                page: PdfPage;
                field: PdfSignatureField;
            } = makeSignatureCertificateHarness();
            const field: any = harness.field;
            const secondName: any = {
                _values: ['CN=Signer']
            };
            // Act
            const result: boolean =
                field._areDistinguishedNamesEqual(undefined, secondName);
            // Assert
            expect(result).toBeFalsy();
        });
        it('returns false when second distinguished name is unavailable', () => {
            // Arrange
            const harness: {
                document: PdfDocument;
                page: PdfPage;
                field: PdfSignatureField;
            } = makeSignatureCertificateHarness();
            const field: any = harness.field;
            const firstName: any = {
                _values: ['CN=Signer']
            };
            // Act
            const result: boolean =
                field._areDistinguishedNamesEqual(firstName, undefined);
            // Assert
            expect(result).toBeFalsy();
        });
        it('returns false when distinguished names have different value counts', () => {
            // Arrange
            const harness: {
                document: PdfDocument;
                page: PdfPage;
                field: PdfSignatureField;
            } = makeSignatureCertificateHarness();
            const field: any = harness.field;
            const firstName: any = {
                _values: ['CN=Signer']
            };
            const secondName: any = {
                _values: ['CN=Signer', 'O=Company']
            };
            // Act
            const result: boolean =
                field._areDistinguishedNamesEqual(firstName, secondName);
            // Assert
            expect(result).toBeFalsy();
        });
        it('returns true after trimming and lowercasing name values', () => {
            // Arrange
            const harness: {
                document: PdfDocument;
                page: PdfPage;
                field: PdfSignatureField;
            } = makeSignatureCertificateHarness();
            const field: any = harness.field;
            const firstName: any = {
                _values: ['  CN=SIGNER  ', ' O=COMPANY ']
            };
            const secondName: any = {
                _values: ['cn=signer', 'o=company']
            };
            // Act
            const result: boolean =
                field._areDistinguishedNamesEqual(firstName, secondName);
            // Assert
            expect(result).toBeTruthy();
        });
        it('returns true when equal distinguished-name values have different order', () => {
            // Arrange
            const harness: {
                document: PdfDocument;
                page: PdfPage;
                field: PdfSignatureField;
            } = makeSignatureCertificateHarness();
            const field: any = harness.field;
            const firstName: any = {
                _values: ['CN=Signer', 'O=Company', 'C=IN']
            };
            const secondName: any = {
                _values: ['C=IN', 'CN=Signer', 'O=Company']
            };
            // Act
            const result: boolean =
                field._areDistinguishedNamesEqual(firstName, secondName);
            // Assert
            expect(result).toBeTruthy();
        });
        it('returns false when sorted distinguished-name values differ', () => {
            // Arrange
            const harness: {
                document: PdfDocument;
                page: PdfPage;
                field: PdfSignatureField;
            } = makeSignatureCertificateHarness();
            const field: any = harness.field;
            const firstName: any = {
                _values: ['CN=Signer', 'O=First Company']
            };
            const secondName: any = {
                _values: ['O=Second Company', 'CN=Signer']
            };
            // Act
            const result: boolean =
                field._areDistinguishedNamesEqual(firstName, secondName);
            // Assert
            expect(result).toBeFalsy();
        });
        it('normalizes null distinguished-name values to empty strings', () => {
            // Arrange
            const harness: {
                document: PdfDocument;
                page: PdfPage;
                field: PdfSignatureField;
            } = makeSignatureCertificateHarness();
            const field: any = harness.field;
            const firstName: any = {
                _values: [null, ' CN=Signer ']
            };
            const secondName: any = {
                _values: ['', 'cn=signer']
            };
            // Act
            const result: boolean =
                field._areDistinguishedNamesEqual(firstName, secondName);
            // Assert
            expect(result).toBeTruthy();
        });
        it('returns false when normalization must preserve nonempty values', () => {
            // Arrange
            const harness: {
                document: PdfDocument;
                page: PdfPage;
                field: PdfSignatureField;
            } = makeSignatureCertificateHarness();
            const field: any = harness.field;
            const firstName: any = {
                _values: ['CN=First']
            };
            const secondName: any = {
                _values: ['CN=Second']
            };
            // Act
            const result: boolean =
                field._areDistinguishedNamesEqual(firstName, secondName);
            // Assert
            expect(result).toBeFalsy();
        });
    });
});
function createSignatureValidationField(): {
    document: PdfDocument;
    page: PdfPage;
    field: PdfSignatureField;
} {
    const document: PdfDocument = new PdfDocument();
    const page: PdfPage = document.addPage();
    const field: PdfSignatureField = new PdfSignatureField(
        page,
        'signature1',
        { x: 10, y: 10, width: 150, height: 50 }
    );
    document.form.add(field);
    return { document, page, field };
}
function createValidationCertificate(
    validFrom: Date,
    validTo: Date,
    certificateName: string
): any {
    return {
        certificateName: certificateName,
        _structure: {
            _getSignedCertificate: (): any => {
                return {
                    _startDate: {
                        _toDate: (): Date => {
                            return validFrom;
                        }
                    },
                    _endDate: {
                        _toDate: (): Date => {
                            return validTo;
                        }
                    }
                };
            }
        }
    };
}
function configureSignatureValidation(
    field: PdfSignatureField,
    certificates: any[]
): void {
    const validationField: any = field;
    validationField._signature = {
        _cryptographicStandard: 'CMS',
        _digestAlgorithm: 'SHA256',
        _certify: false,
        _documentPermissions: PdfCertificationFlag.forbidChanges,
        _signedDate: undefined,
        _signatureDictionary: {
            _extractOcspResponderInfo: (_bytes: Uint8Array): any => {
                return undefined;
            }
        }
    };
    validationField._cmsSigner = {
        _encryptionAlgorithm: 'RSA',
        _certificates: certificates
    };
    validationField._getFieldName = (): string => {
        return 'signature1';
    };
    validationField._detectLtvData = (_information: any): void => {
        return;
    };
    validationField._verifyChecksum = (): boolean => {
        return true;
    };
    validationField._checkIncrementUpdate = (): boolean => {
        return false;
    };
    validationField._extractOcspFromDss = (): Uint8Array => {
        return undefined;
    };
    validationField._extractCrlFromDss = (): Uint8Array => {
        return undefined;
    };
    validationField._extractCrlTimes = (_bytes: Uint8Array): any => {
        return undefined;
    };
}
describe('PdfSignatureField _validateSignature mutation coverage', () => {
    it('validates exact default values and checksum failure result', () => {
        // Arrange
        const validationHarness: {
            document: PdfDocument;
            page: PdfPage;
            field: PdfSignatureField;
        } = createSignatureValidationField();
        const validationField: any = validationHarness.field;
        configureSignatureValidation(
            validationHarness.field,
            []
        );
        validationField._verifyChecksum = (): boolean => {
            return false;
        };
        // Act
        const result: any = validationField._validateSignature(
            undefined,
            false,
            undefined,
            undefined
        );
        // Assert
        expect(result.cryptographicStandard).toBe('CMS');
        expect(result.digestAlgorithm).toBe('SHA256');
        expect(result.isDocumentModified).toBeTruthy();
        expect(result.validityAtCurrentTime).toBeFalsy();
        expect(result.validityAtSignedTime).toBeFalsy();
        expect(result.validityAtTimestampTime).toBeFalsy();
        expect(result.isCertifiedSignature).toBeFalsy();
        expect(result.documentPermissions).toBe(
            PdfCertificationFlag.forbidChanges
        );
        expect(result.revocationResult).toBeUndefined();
        expect(result.ltvVerificationInformation).toBeDefined();
        expect(
            result.ltvVerificationInformation.isCrlEmbedded
        ).toBeFalsy();
        expect(
            result.ltvVerificationInformation.isLtvEmbedded
        ).toBeFalsy();
        expect(
            result.ltvVerificationInformation.isOcspEmbedded
        ).toBeFalsy();
        expect(result.signatureAlgorithm).toBe('RSA');
        expect(result.signatureName).toBe('signature1');
        expect(result.signatureStatus).toBe(
            SignatureStatus.invalid
        );
        expect(result.validationErrorMessages.length).toBe(1);
        expect(result.validationErrorMessages[0]).toBe(
            'The document has been altered or corrupted since the signature was applied'
        );
        expect(result.timestampInformation).toBeDefined();
        expect(
            result.timestampInformation.isDocumentTimestamp
        ).toBeFalsy();
        expect(result.timestampInformation.isValid).toBeFalsy();
        expect(
            result.timestampInformation.timestampTime.getTime()
        ).toBe(0);
        expect(
            result.timestampInformation.timestampPolicyId
        ).toBe('');
        expect(
            result.timestampInformation.certificate
        ).toBeUndefined();
        expect(
            result.timestampInformation.signerCertificates
        ).toBeUndefined();
        expect(result.isSignatureValid).toBeFalsy();
        expect(result.signerCertificates.length).toBe(0);
    });
    it('returns exact altered result for incremental update', () => {
        // Arrange
        const validationHarness: {
            document: PdfDocument;
            page: PdfPage;
            field: PdfSignatureField;
        } = createSignatureValidationField();
        const validationField: any = validationHarness.field;
        configureSignatureValidation(
            validationHarness.field,
            []
        );
        validationField._checkIncrementUpdate = (): boolean => {
            return true;
        };
        // Act
        const result: any = validationField._validateSignature(
            undefined,
            false,
            undefined,
            undefined
        );
        // Assert
        expect(result.isDocumentModified).toBeTruthy();
        expect(result.signatureStatus).toBe(
            SignatureStatus.invalid
        );
        expect(result.isSignatureValid).toBeFalsy();
        expect(result.validationErrorMessages.length).toBe(1);
        expect(result.validationErrorMessages[0]).toBe(
            'The document has been altered or corrupted since the signature was applied'
        );
    });
    it('does not validate revocation when validation is false', () => {
        // Arrange
        const validationHarness: {
            document: PdfDocument;
            page: PdfPage;
            field: PdfSignatureField;
        } = createSignatureValidationField();
        const validationField: any = validationHarness.field;
        let validationCount: number = 0;
        configureSignatureValidation(
            validationHarness.field,
            []
        );
        validationField._validateRevocationCore = (
            _validationType: any,
            _ocsp: any,
            _crl: any
        ): any => {
            validationCount++;
            return {
                ocspRevocationStatus: RevocationStatus.good,
                isRevokedCRL: false
            };
        };
        // Act
        const result: any = validationField._validateSignature(
            undefined,
            false,
            undefined,
            undefined
        );
        // Assert
        expect(validationCount).toBe(0);
        expect(result.revocationResult).toBeUndefined();
        expect(result.isSignatureValid).toBeFalsy();
        expect(result.signatureStatus).toBe(
            SignatureStatus.invalid
        );
    });
    it('validates revocation when validation is true', () => {
        // Arrange
        const validationHarness: {
            document: PdfDocument;
            page: PdfPage;
            field: PdfSignatureField;
        } = createSignatureValidationField();
        const validationField: any = validationHarness.field;
        const expectedRevocationResult: any = {
            ocspRevocationStatus: RevocationStatus.good,
            isRevokedCRL: false
        };
        let validationCount: number = 0;
        configureSignatureValidation(
            validationHarness.field,
            []
        );
        validationField._validateRevocationCore = (
            _validationType: any,
            _ocsp: any,
            _crl: any
        ): any => {
            validationCount++;
            return expectedRevocationResult;
        };
        // Act
        const result: any = validationField._validateSignature(
            undefined,
            true,
            undefined,
            undefined
        );
        // Assert
        expect(validationCount).toBe(1);
        expect(result.revocationResult).toBe(
            expectedRevocationResult
        );
        expect(result.isSignatureValid).toBeFalsy();
        expect(result.signatureStatus).toBe(
            SignatureStatus.invalid
        );
    });
    it('skips certificate processing for empty certificates', () => {
        // Arrange
        const validationHarness: {
            document: PdfDocument;
            page: PdfPage;
            field: PdfSignatureField;
        } = createSignatureValidationField();
        const validationField: any = validationHarness.field;
        let ocspExtractionCount: number = 0;
        let crlExtractionCount: number = 0;
        configureSignatureValidation(
            validationHarness.field,
            []
        );
        validationField._validateRevocationCore = (): any => {
            return {
                ocspRevocationStatus: RevocationStatus.good,
                isRevokedCRL: false
            };
        };
        validationField._extractOcspFromDss =
            (): Uint8Array => {
                ocspExtractionCount++;
                return new Uint8Array([1]);
            };
        validationField._extractCrlFromDss =
            (): Uint8Array => {
                crlExtractionCount++;
                return new Uint8Array([2]);
            };
        // Act
        const result: any = validationField._validateSignature(
            undefined,
            true,
            undefined,
            undefined
        );
        // Assert
        expect(result.signerCertificates.length).toBe(0);
        expect(ocspExtractionCount).toBe(0);
        expect(crlExtractionCount).toBe(0);
        expect(result.validityAtSignedTime).toBeFalsy();
        expect(result.validityAtCurrentTime).toBeFalsy();
        expect(result.validityAtTimestampTime).toBeFalsy();
    });
    it('uses timestamp verification result', () => {
        // Arrange
        const validationHarness: {
            document: PdfDocument;
            page: PdfPage;
            field: PdfSignatureField;
        } = createSignatureValidationField();
        const validationField: any = validationHarness.field;
        const expectedTimestampTime: Date = new Date(1000);
        const expectedTimestampInformation: any = {
            isDocumentTimestamp: true,
            isValid: true,
            timestampTime: expectedTimestampTime,
            timestampPolicyId: '1.2.840.113549',
            certificate: undefined,
            signerCertificates: []
        };
        configureSignatureValidation(
            validationHarness.field,
            []
        );
        validationField._signature._verifyTimeStampCore =
            (): any => {
                return expectedTimestampInformation;
            };
        // Act
        const result: any =
            validationField._validateSignature(
                undefined,
                false,
                undefined,
                undefined
            );
        // Assert
        expect(result.timestampInformation).toBe(
            expectedTimestampInformation
        );
        expect(
            result.timestampInformation.isDocumentTimestamp
        ).toBeTruthy();
        expect(
            result.timestampInformation.isValid
        ).toBeTruthy();
        expect(
            result.timestampInformation.timestampTime
        ).toBe(expectedTimestampTime);
        expect(
            result.timestampInformation.timestampPolicyId
        ).toBe('1.2.840.113549');
    })
});
function makeSignatureFieldNameHarness(): {
    document: PdfDocument;
    page: PdfPage;
    field: PdfSignatureField;
    fieldDictionary: _PdfDictionary;
} {
    const document: PdfDocument = new PdfDocument();
    const page: PdfPage = document.addPage();
    const field: PdfSignatureField = new PdfSignatureField(
        page,
        'signature1',
        { x: 10, y: 10, width: 150, height: 50 }
    );
    document.form.add(field);
    const fieldDictionary: _PdfDictionary = new _PdfDictionary();
    const signatureField: any = {
        _dictionary: fieldDictionary
    };
    const signature: any = {
        _signatureField: signatureField
    };
    const validationField: any = field;
    validationField._signature = signature;
    return {
        document,
        page,
        field,
        fieldDictionary
    };
}
describe('PdfSignatureField _getFieldName mutation coverage', () => {
    it('returns undefined when signature is not available', () => {
        // Arrange
        const validationHarness: {
            document: PdfDocument;
            page: PdfPage;
            field: PdfSignatureField;
            fieldDictionary: _PdfDictionary;
        } = makeSignatureFieldNameHarness();
        const validationField: any = validationHarness.field;
        validationField._signature = undefined;
        // Act
        const result: string = validationField._getFieldName();
        // Assert
        expect(result).toBeUndefined();
    });
    it('returns undefined when signature field is not available', () => {
        // Arrange
        const validationHarness: {
            document: PdfDocument;
            page: PdfPage;
            field: PdfSignatureField;
            fieldDictionary: _PdfDictionary;
        } = makeSignatureFieldNameHarness();
        const validationField: any = validationHarness.field;
        validationField._signature = {
            _signatureField: undefined
        };
        // Act
        const result: string = validationField._getFieldName();
        // Assert
        expect(result).toBeUndefined();
    });
    it('returns undefined when field dictionary is not available', () => {
        // Arrange
        const validationHarness: {
            document: PdfDocument;
            page: PdfPage;
            field: PdfSignatureField;
            fieldDictionary: _PdfDictionary;
        } = makeSignatureFieldNameHarness();
        const validationField: any = validationHarness.field;
        validationField._signature = {
            _signatureField: {
                _dictionary: undefined
            }
        };
        // Act
        const result: string = validationField._getFieldName();
        // Assert
        expect(result).toBeUndefined();
    });
    it('returns leaf field name when parent is absent', () => {
        // Arrange
        const validationHarness: {
            document: PdfDocument;
            page: PdfPage;
            field: PdfSignatureField;
            fieldDictionary: _PdfDictionary;
        } = makeSignatureFieldNameHarness();
        const validationField: any = validationHarness.field;
        validationHarness.fieldDictionary.update(
            'T',
            'ApprovalSignature'
        );
        // Act
        const result: string = validationField._getFieldName();
        // Assert
        expect(
            validationHarness.fieldDictionary.has('Parent')
        ).toBeFalsy();
        expect(
            validationHarness.fieldDictionary.has('T')
        ).toBeTruthy();
        expect(
            validationHarness.fieldDictionary.get('T')
        ).toBe('ApprovalSignature');
        expect(result).toBe('ApprovalSignature');
    });
    it('returns undefined when parent and field name are absent', () => {
        // Arrange
        const validationHarness: {
            document: PdfDocument;
            page: PdfPage;
            field: PdfSignatureField;
            fieldDictionary: _PdfDictionary;
        } = makeSignatureFieldNameHarness();
        const validationField: any = validationHarness.field;
        // Act
        const result: string = validationField._getFieldName();
        // Assert
        expect(
            validationHarness.fieldDictionary.has('Parent')
        ).toBeFalsy();
        expect(
            validationHarness.fieldDictionary.has('T')
        ).toBeFalsy();
        expect(result).toBeUndefined();
    });
    it('returns undefined when leaf field name is not a string', () => {
        // Arrange
        const validationHarness: {
            document: PdfDocument;
            page: PdfPage;
            field: PdfSignatureField;
            fieldDictionary: _PdfDictionary;
        } = makeSignatureFieldNameHarness();
        const validationField: any = validationHarness.field;
        validationHarness.fieldDictionary.update('T', 25);
        // Act
        const result: string = validationField._getFieldName();
        // Assert
        expect(
            validationHarness.fieldDictionary.has('T')
        ).toBeTruthy();
        expect(
            typeof validationHarness.fieldDictionary.get('T')
        ).toBe('number');
        expect(result).toBeUndefined();
    });
    it('returns undefined when empty field name is present', () => {
        // Arrange
        const validationHarness: {
            document: PdfDocument;
            page: PdfPage;
            field: PdfSignatureField;
            fieldDictionary: _PdfDictionary;
        } = makeSignatureFieldNameHarness();
        const validationField: any = validationHarness.field;
        validationHarness.fieldDictionary.update('T', '');
        // Act
        const result: string = validationField._getFieldName();
        // Assert
        expect(
            validationHarness.fieldDictionary.has('T')
        ).toBeTruthy();
        expect(
            typeof validationHarness.fieldDictionary.get('T')
        ).toBe('string');
        expect(result).toBe('');
        expect(result.length).toBe(0);
    });
    it('uses direct parent dictionary and returns hierarchical name', () => {
        // Arrange
        const validationHarness: {
            document: PdfDocument;
            page: PdfPage;
            field: PdfSignatureField;
            fieldDictionary: _PdfDictionary;
        } = makeSignatureFieldNameHarness();
        const validationField: any = validationHarness.field;
        const parentDictionary: _PdfDictionary =
            new _PdfDictionary();
        parentDictionary.update('T', 'Customer');
        validationHarness.fieldDictionary.update(
            'Parent',
            parentDictionary
        );
        validationHarness.fieldDictionary.update(
            'T',
            'Approval'
        );
        // Act
        const result: string = validationField._getFieldName();
        // Assert
        expect(
            validationHarness.fieldDictionary.has('Parent')
        ).toBeTruthy();
        expect(
            validationHarness.fieldDictionary.get('Parent')
        ).toBe(parentDictionary);
        expect(parentDictionary.has('T')).toBeTruthy();
        expect(parentDictionary.get('T')).toBe('Customer');
        expect(result).toBe('Customer.undefined.Approval');
    });
    it('returns parent name when child field name is absent', () => {
        // Arrange
        const validationHarness: {
            document: PdfDocument;
            page: PdfPage;
            field: PdfSignatureField;
            fieldDictionary: _PdfDictionary;
        } = makeSignatureFieldNameHarness();
        const validationField: any = validationHarness.field;
        const parentDictionary: _PdfDictionary =
            new _PdfDictionary();
        parentDictionary.update('T', 'Customer');
        validationHarness.fieldDictionary.update(
            'Parent',
            parentDictionary
        );
        // Act
        const result: string = validationField._getFieldName();
        // Assert
        expect(
            validationHarness.fieldDictionary.has('Parent')
        ).toBeTruthy();
        expect(
            validationHarness.fieldDictionary.has('T')
        ).toBeFalsy();
        expect(parentDictionary.has('T')).toBeTruthy();
        expect(result).toBe('Customer.undefined');
    });
    it('returns leaf name when parent value is not a dictionary', () => {
        // Arrange
        const validationHarness: {
            document: PdfDocument;
            page: PdfPage;
            field: PdfSignatureField;
            fieldDictionary: _PdfDictionary;
        } = makeSignatureFieldNameHarness();
        const validationField: any = validationHarness.field;
        validationHarness.fieldDictionary.update(
            'Parent',
            'InvalidParent'
        );
        validationHarness.fieldDictionary.update(
            'T',
            'ApprovalSignature'
        );
        // Act
        const result: string = validationField._getFieldName();
        // Assert
        expect(
            validationHarness.fieldDictionary.has('Parent')
        ).toBeTruthy();
        expect(
            validationHarness.fieldDictionary.get('Parent')
        ).toBe('InvalidParent');
        expect(result).toBe('ApprovalSignature');
    });
    it('fetches parent dictionary from cross reference', () => {
        // Arrange
        const validationHarness: {
            document: PdfDocument;
            page: PdfPage;
            field: PdfSignatureField;
            fieldDictionary: _PdfDictionary;
        } = makeSignatureFieldNameHarness();
        const validationField: any = validationHarness.field;
        const parentReference: _PdfReference =
            new _PdfReference(10, 0);
        const parentDictionary: _PdfDictionary =
            new _PdfDictionary();
        const fetchedReferences: _PdfReference[] = [];
        parentDictionary.update('T', 'Customer');
        validationHarness.fieldDictionary.update(
            'Parent',
            parentReference
        );
        validationHarness.fieldDictionary.update(
            'T',
            'Approval'
        );
        validationField._crossReference = {
            _fetch: (reference: _PdfReference): _PdfDictionary => {
                fetchedReferences.push(reference);
                return parentDictionary;
            }
        };
        // Act
        const result: string = validationField._getFieldName();
        // Assert
        expect(fetchedReferences.length).toBe(1);
        expect(fetchedReferences[0]).toBe(parentReference);
        expect(result).toBe('Customer.undefined.Approval');
    });
    it('returns leaf name when parent reference has no cross reference', () => {
        // Arrange
        const validationHarness: {
            document: PdfDocument;
            page: PdfPage;
            field: PdfSignatureField;
            fieldDictionary: _PdfDictionary;
        } = makeSignatureFieldNameHarness();
        const validationField: any = validationHarness.field;
        const parentReference: _PdfReference =
            new _PdfReference(10, 0);
        validationHarness.fieldDictionary.update(
            'Parent',
            parentReference
        );
        validationHarness.fieldDictionary.update(
            'T',
            'Approval'
        );
        validationField._crossReference = undefined;
        // Act
        const result: string = validationField._getFieldName();
        // Assert
        expect(
            validationHarness.fieldDictionary.get('Parent')
        ).toBe(parentReference);
        expect(validationField._crossReference).toBeUndefined();
        expect(result).toBe('Approval');
    });
    it('returns leaf name when cross reference returns undefined', () => {
        // Arrange
        const validationHarness: {
            document: PdfDocument;
            page: PdfPage;
            field: PdfSignatureField;
            fieldDictionary: _PdfDictionary;
        } = makeSignatureFieldNameHarness();
        const validationField: any = validationHarness.field;
        const parentReference: _PdfReference =
            new _PdfReference(10, 0);
        let fetchCount: number = 0;
        validationHarness.fieldDictionary.update(
            'Parent',
            parentReference
        );
        validationHarness.fieldDictionary.update(
            'T',
            'Approval'
        );
        validationField._crossReference = {
            _fetch: (
                _reference: _PdfReference
            ): _PdfDictionary => {
                fetchCount++;
                return undefined;
            }
        };
        // Act
        const result: string = validationField._getFieldName();
        // Assert
        expect(fetchCount).toBe(1);
        expect(result).toBe('Approval');
    });
    it('builds name from multiple direct parent dictionaries', () => {
        // Arrange
        const validationHarness: {
            document: PdfDocument;
            page: PdfPage;
            field: PdfSignatureField;
            fieldDictionary: _PdfDictionary;
        } = makeSignatureFieldNameHarness();
        const validationField: any = validationHarness.field;
        const rootDictionary: _PdfDictionary =
            new _PdfDictionary();
        const sectionDictionary: _PdfDictionary =
            new _PdfDictionary();
        rootDictionary.update('T', 'Form');
        sectionDictionary.update('T', 'Customer');
        sectionDictionary.update('Parent', rootDictionary);
        validationHarness.fieldDictionary.update(
            'Parent',
            sectionDictionary
        );
        validationHarness.fieldDictionary.update(
            'T',
            'Approval'
        );
        // Act
        const result: string = validationField._getFieldName();
        // Assert
        expect(
            sectionDictionary.has('Parent')
        ).toBeTruthy();
        expect(
            sectionDictionary.get('Parent')
        ).toBe(rootDictionary);
        expect(rootDictionary.has('Parent')).toBeFalsy();
        expect(result).toBe(
            'Form.Customer.undefined.Approval'
        );
    });
    it('skips non-string intermediate parent field name', () => {
        // Arrange
        const validationHarness: {
            document: PdfDocument;
            page: PdfPage;
            field: PdfSignatureField;
            fieldDictionary: _PdfDictionary;
        } = makeSignatureFieldNameHarness();
        const validationField: any = validationHarness.field;
        const rootDictionary: _PdfDictionary =
            new _PdfDictionary();
        const sectionDictionary: _PdfDictionary =
            new _PdfDictionary();
        rootDictionary.update('T', 'Form');
        sectionDictionary.update('T', 25);
        sectionDictionary.update('Parent', rootDictionary);
        validationHarness.fieldDictionary.update(
            'Parent',
            sectionDictionary
        );
        validationHarness.fieldDictionary.update(
            'T',
            'Approval'
        );
        // Act
        const result: string = validationField._getFieldName();
        // Assert
        expect(
            typeof sectionDictionary.get('T')
        ).toBe('number');
        expect(rootDictionary.get('T')).toBe('Form');
        expect(result).toBe('Form.undefined.Approval');
    });
    it('stops at parent without field name and returns leaf output', () => {
        // Arrange
        const validationHarness: {
            document: PdfDocument;
            page: PdfPage;
            field: PdfSignatureField;
            fieldDictionary: _PdfDictionary;
        } = makeSignatureFieldNameHarness();
        const validationField: any = validationHarness.field;
        const unnamedRootDictionary: _PdfDictionary =
            new _PdfDictionary();
        const sectionDictionary: _PdfDictionary =
            new _PdfDictionary();
        sectionDictionary.update('T', 'Customer');
        sectionDictionary.update(
            'Parent',
            unnamedRootDictionary
        );
        validationHarness.fieldDictionary.update(
            'Parent',
            sectionDictionary
        );
        validationHarness.fieldDictionary.update(
            'T',
            'Approval'
        );
        // Act
        const result: string = validationField._getFieldName();
        // Assert
        expect(
            unnamedRootDictionary.has('T')
        ).toBeFalsy();
        expect(
            sectionDictionary.has('T')
        ).toBeTruthy();
        expect(result).toBe(
            'Customer.undefined.Approval'
        );
    });
    it('returns undefined when parent exists without names', () => {
        // Arrange
        const validationHarness: {
            document: PdfDocument;
            page: PdfPage;
            field: PdfSignatureField;
            fieldDictionary: _PdfDictionary;
        } = makeSignatureFieldNameHarness();
        const validationField: any = validationHarness.field;
        const parentDictionary: _PdfDictionary =
            new _PdfDictionary();
        validationHarness.fieldDictionary.update(
            'Parent',
            parentDictionary
        );
        // Act
        const result: string = validationField._getFieldName();
        // Assert
        expect(
            validationHarness.fieldDictionary.has('Parent')
        ).toBeTruthy();
        expect(
            validationHarness.fieldDictionary.has('T')
        ).toBeFalsy();
        expect(parentDictionary.has('T')).toBeFalsy();
        expect(result).toBeUndefined();
    });
    it('returns parent name when leaf field name is unavailable', () => {
        // Arrange
        const validationHarness: {
            document: PdfDocument;
            page: PdfPage;
            field: PdfSignatureField;
            fieldDictionary: _PdfDictionary;
        } = makeSignatureFieldNameHarness();
        const validationField: any = validationHarness.field;
        const parentDictionary: _PdfDictionary = new _PdfDictionary();
        parentDictionary.update('T', 'Customer');
        validationHarness.fieldDictionary.update(
            'Parent',
            parentDictionary
        );
        // Act
        const result: string = validationField._getFieldName();
        // Assert
        expect(
            validationHarness.fieldDictionary.has('Parent')
        ).toBeTruthy();
        expect(
            validationHarness.fieldDictionary.get('Parent')
        ).toBe(parentDictionary);
        expect(parentDictionary.has('T')).toBeTruthy();
        expect(parentDictionary.get('T')).toBe('Customer');
        expect(
            validationHarness.fieldDictionary.has('T')
        ).toBeFalsy();
        expect(result).toBe('Customer.undefined');
    });
    it('returns empty leaf instead of assembled parent name', () => {
        // Arrange
        const validationHarness: {
            document: PdfDocument;
            page: PdfPage;
            field: PdfSignatureField;
            fieldDictionary: _PdfDictionary;
        } = makeSignatureFieldNameHarness();
        const validationField: any = validationHarness.field;
        const parentDictionary: _PdfDictionary =
            new _PdfDictionary();
        parentDictionary.update('T', 'Customer');
        validationHarness.fieldDictionary.update(
            'Parent',
            parentDictionary
        );
        validationHarness.fieldDictionary.update('T', '');
        // Act
        const result: string = validationField._getFieldName();
        // Assert
        expect(
            typeof validationHarness.fieldDictionary.get('T')
        ).toBe('string');
        expect(result).toBe('Customer.undefined.');
        expect(result).not.toBe('Customer.undefined');
    });
});
function makeIncrementUpdateHarness(): {
    document: PdfDocument;
    page: PdfPage;
    field: PdfSignatureField;
    crossReference: _PdfCrossReference;
    trailer: _PdfDictionary;
    catalog: _PdfDictionary;
} {
    const document: PdfDocument = new PdfDocument();
    const page: PdfPage = document.addPage();
    const field: PdfSignatureField = new PdfSignatureField(
        page,
        'Signature1',
        { x: 50, y: 50, width: 120, height: 40 }
    );
    document.form.add(field);
    const crossReference: _PdfCrossReference = field._crossReference;
    const trailer: _PdfDictionary = new _PdfDictionary(crossReference);
    trailer.update('Prev', 10);
    const catalog: _PdfDictionary = new _PdfDictionary(crossReference);
    crossReference._trailer = trailer;
    crossReference._root = catalog;
    return {
        document,
        page,
        field,
        crossReference,
        trailer,
        catalog
    };
}
function setSignatureRanges(
    field: PdfSignatureField,
    ranges: number[],
    certify: boolean = false,
    permission: PdfCertificationFlag = PdfCertificationFlag.forbidChanges
): void {
    field._signature = {
        _ranges: ranges,
        _certify: certify,
        _documentPermissions: permission,
        _isLocked: false
    } as any;
}
function setDictionaryByteRange(
    field: PdfSignatureField,
    ranges: number[],
    useValueDictionary: boolean = false
): void {
    field._signature = undefined;
    if (useValueDictionary) {
        const signatureDictionary: _PdfDictionary =
            new _PdfDictionary(field._crossReference);
        signatureDictionary.update('ByteRange', ranges);
        field._dictionary.update('V', signatureDictionary);
    } else {
        field._dictionary.update('ByteRange', ranges);
    }
}
describe('PdfSignatureField _checkIncrementUpdate mutation coverage', () => {
    it('returns false when cross reference is unavailable', () => {
        // Arrange
        const field: PdfSignatureField = new PdfSignatureField();
        field._crossReference = undefined;
        // Act
        const result: boolean = field._checkIncrementUpdate();
        // Assert
        expect(result).toBeFalsy();
    });
    it('returns false when the trailer has no previous revision', () => {
        // Arrange
        const harness = makeIncrementUpdateHarness();
        const trailerWithoutPreviousRevision: _PdfDictionary =
            new _PdfDictionary(harness.crossReference);
        harness.crossReference._trailer = trailerWithoutPreviousRevision;
        setSignatureRanges(harness.field, [0, 20, 30, 20]);
        // Act
        const result: boolean = harness.field._checkIncrementUpdate();
        // Assert
        expect(result).toBeFalsy();
        harness.document.destroy();
    });
    it('continues validation when the trailer contains Prev', () => {
        // Arrange
        const harness = makeIncrementUpdateHarness();
        harness.field._signature = undefined;
        harness.field._dictionary = new _PdfDictionary(
            harness.crossReference
        );
        // Act
        const result: boolean = harness.field._checkIncrementUpdate();
        // Assert
        expect(result).toBeTruthy();
        harness.document.destroy();
    });
    it('uses the first four signature ranges when more values are present', () => {
        // Arrange
        const harness = makeIncrementUpdateHarness();
        setSignatureRanges(
            harness.field,
            [0, 20, 30, 20, Number.NaN]
        );
        (harness.crossReference as any)._entriesHistory = [];
        // Act
        const result: boolean = harness.field._checkIncrementUpdate();
        // Assert
        expect(result).toBeFalsy();
        harness.document.destroy();
    });
    it('uses signature ranges when exactly four values are present', () => {
        // Arrange
        const harness = makeIncrementUpdateHarness();
        setSignatureRanges(harness.field, [0, 20, 30, 20]);
        harness.field._dictionary = new _PdfDictionary(
            harness.crossReference
        );
        (harness.crossReference as any)._entriesHistory = [];
        // Act
        const result: boolean = harness.field._checkIncrementUpdate();
        // Assert
        expect(result).toBeFalsy();
        harness.document.destroy();
    });
    it('falls back to dictionary ByteRange when signature ranges have fewer than four values', () => {
        // Arrange
        const harness = makeIncrementUpdateHarness();
        harness.field._signature = {
            _ranges: [0, 20, 30],
            _certify: false,
            _documentPermissions: PdfCertificationFlag.forbidChanges
        } as any;
        harness.field._dictionary.update(
            'ByteRange',
            [0, 20, 30, 20]
        );
        (harness.crossReference as any)._entriesHistory = [];
        // Act
        const result: boolean = harness.field._checkIncrementUpdate();
        // Assert
        expect(result).toBeFalsy();
        harness.document.destroy();
    });
    it('falls back to dictionary ByteRange when signature ranges are not an array', () => {
        // Arrange
        const harness = makeIncrementUpdateHarness();
        harness.field._signature = {
            _ranges: '0 20 30 20',
            _certify: false,
            _documentPermissions: PdfCertificationFlag.forbidChanges
        } as any;
        harness.field._dictionary.update(
            'ByteRange',
            [0, 20, 30, 20]
        );
        (harness.crossReference as any)._entriesHistory = [];
        // Act
        const result: boolean = harness.field._checkIncrementUpdate();
        // Assert
        expect(result).toBeFalsy();
        harness.document.destroy();
    });
    it('reads ByteRange from the signature value dictionary', () => {
        // Arrange
        const harness = makeIncrementUpdateHarness();
        setDictionaryByteRange(
            harness.field,
            [0, 20, 30, 20],
            true
        );
        (harness.crossReference as any)._entriesHistory = [];
        // Act
        const result: boolean = harness.field._checkIncrementUpdate();
        // Assert
        expect(result).toBeFalsy();
        harness.document.destroy();
    });
    it('reads ByteRange directly from the field dictionary when V is absent', () => {
        // Arrange
        const harness = makeIncrementUpdateHarness();
        setDictionaryByteRange(
            harness.field,
            [0, 20, 30, 20]
        );
        (harness.crossReference as any)._entriesHistory = [];
        // Act
        const result: boolean = harness.field._checkIncrementUpdate();
        // Assert
        expect(result).toBeFalsy();
        harness.document.destroy();
    });
    it('requires the ByteRange key instead of an empty dictionary key', () => {
        // Arrange
        const harness = makeIncrementUpdateHarness();
        harness.field._signature = undefined;
        harness.field._dictionary.update(
            '',
            [0, 20, 30, 20]
        );
        // Act
        const result: boolean = harness.field._checkIncrementUpdate();
        // Assert
        expect(result).toBeTruthy();
        harness.document.destroy();
    });
    it('rejects a ByteRange containing fewer than four values', () => {
        // Arrange
        const harness = makeIncrementUpdateHarness();
        setDictionaryByteRange(
            harness.field,
            [0, 20, 30]
        );
        // Act
        const result: boolean = harness.field._checkIncrementUpdate();
        // Assert
        expect(result).toBeTruthy();
        harness.document.destroy();
    });
    it('rejects a signature ByteRange containing one non-finite value', () => {
        // Arrange
        const harness = makeIncrementUpdateHarness();
        setSignatureRanges(
            harness.field,
            [0, 20, Number.NaN, 20]
        );
        (harness.crossReference as any)._entriesHistory = [];
        // Act
        const result: boolean = harness.field._checkIncrementUpdate();
        // Assert
        expect(result).toBeTruthy();
        harness.document.destroy();
    });
    it('rejects a dictionary ByteRange containing Infinity', () => {
        // Arrange
        const harness = makeIncrementUpdateHarness();
        setDictionaryByteRange(
            harness.field,
            [0, 20, 30, Number.POSITIVE_INFINITY]
        );
        // Act
        const result: boolean = harness.field._checkIncrementUpdate();
        // Assert
        expect(result).toBeTruthy();
        harness.document.destroy();
    });
    it('rejects a dictionary ByteRange containing a non-numeric value', () => {
        // Arrange
        const harness = makeIncrementUpdateHarness();
        harness.field._signature = undefined;
        harness.field._dictionary.update(
            'ByteRange',
            [0, 20, 'invalid-offset', 20]
        );
        // Act
        const result: boolean = harness.field._checkIncrementUpdate();
        // Assert
        expect(result).toBeTruthy();
        harness.document.destroy();
    });
    it('detects an outside-range revision when certification forbids changes', () => {
        // Arrange
        const harness = makeIncrementUpdateHarness();
        setSignatureRanges(
            harness.field,
            [0, 20, 100, 20],
            true,
            PdfCertificationFlag.forbidChanges
        );
        const modifiedDictionary: _PdfDictionary =
            new _PdfDictionary(harness.crossReference);
        modifiedDictionary.update('Type', _PdfName.get('Catalog'));
        const outsideEntry: _PdfObjectInformation = {
            free: false,
            revisionId: 2,
            gen: 0
        } as _PdfObjectInformation;
        const histories: _PdfObjectInformation[][] = [];
        histories[1] = [outsideEntry];
        (harness.crossReference as any)._entriesHistory = histories;
        const originalPhysicalOffset:
            (entry: _PdfObjectInformation) => number =
            harness.crossReference._getPhysicalOffsetForEntry;
        const originalFetchDictionary:
            (
                objectNumber: number,
                entry: _PdfObjectInformation,
                crossReference: _PdfCrossReference
            ) => _PdfDictionary = harness.field._fetchDictAtEntry;
        harness.crossReference._getPhysicalOffsetForEntry =
            (_entry: _PdfObjectInformation): number => 50;
        harness.field._fetchDictAtEntry =
            (
                _objectNumber: number,
                _entry: _PdfObjectInformation,
                _crossReference: _PdfCrossReference
            ): _PdfDictionary => modifiedDictionary;
        // Act
        const result: boolean = harness.field._checkIncrementUpdate();
        // Assert
        expect(result).toBeTruthy();
        harness.crossReference._getPhysicalOffsetForEntry =
            originalPhysicalOffset;
        harness.field._fetchDictAtEntry = originalFetchDictionary;
        harness.document.destroy();
    });
    it('does not apply forbidChanges when the signature is not certifying', () => {
        // Arrange
        const harness = makeIncrementUpdateHarness();
        setSignatureRanges(
            harness.field,
            [0, 20, 100, 20],
            false,
            PdfCertificationFlag.forbidChanges
        );
        const catalogDictionary: _PdfDictionary =
            new _PdfDictionary(harness.crossReference);
        catalogDictionary.update('Type', _PdfName.get('Catalog'));
        const outsideEntry: _PdfObjectInformation = {
            free: false,
            revisionId: 2,
            gen: 0
        } as _PdfObjectInformation;
        const histories: _PdfObjectInformation[][] = [];
        histories[1] = [outsideEntry];
        (harness.crossReference as any)._entriesHistory = histories;
        const originalPhysicalOffset:
            (entry: _PdfObjectInformation) => number =
            harness.crossReference._getPhysicalOffsetForEntry;
        const originalFetchDictionary:
            (
                objectNumber: number,
                entry: _PdfObjectInformation,
                crossReference: _PdfCrossReference
            ) => _PdfDictionary = harness.field._fetchDictAtEntry;
        harness.crossReference._getPhysicalOffsetForEntry =
            (_entry: _PdfObjectInformation): number => 50;
        harness.field._fetchDictAtEntry =
            (
                _objectNumber: number,
                _entry: _PdfObjectInformation,
                _crossReference: _PdfCrossReference
            ): _PdfDictionary => catalogDictionary;
        // Act
        const result: boolean = harness.field._checkIncrementUpdate();
        // Assert
        expect(result).toBeFalsy();
        harness.crossReference._getPhysicalOffsetForEntry =
            originalPhysicalOffset;
        harness.field._fetchDictAtEntry = originalFetchDictionary;
        harness.document.destroy();
    });
    it('allows a catalog revision for certifying form-fill permission', () => {
        // Arrange
        const harness = makeIncrementUpdateHarness();
        setSignatureRanges(
            harness.field,
            [0, 20, 100, 20],
            true,
            PdfCertificationFlag.allowFormFill
        );
        const catalogDictionary: _PdfDictionary =
            new _PdfDictionary(harness.crossReference);
        catalogDictionary.update('Type', _PdfName.get('Catalog'));
        const outsideEntry: _PdfObjectInformation = {
            free: false,
            revisionId: 2,
            gen: 0
        } as _PdfObjectInformation;
        const histories: _PdfObjectInformation[][] = [];
        histories[1] = [outsideEntry];
        (harness.crossReference as any)._entriesHistory = histories;
        const originalPhysicalOffset:
            (entry: _PdfObjectInformation) => number =
            harness.crossReference._getPhysicalOffsetForEntry;
        const originalFetchDictionary:
            (
                objectNumber: number,
                entry: _PdfObjectInformation,
                crossReference: _PdfCrossReference
            ) => _PdfDictionary = harness.field._fetchDictAtEntry;
        harness.crossReference._getPhysicalOffsetForEntry =
            (_entry: _PdfObjectInformation): number => 50;
        harness.field._fetchDictAtEntry =
            (
                _objectNumber: number,
                _entry: _PdfObjectInformation,
                _crossReference: _PdfCrossReference
            ): _PdfDictionary => catalogDictionary;
        // Act
        const result: boolean = harness.field._checkIncrementUpdate();
        // Assert
        expect(result).toBeFalsy();
        harness.crossReference._getPhysicalOffsetForEntry =
            originalPhysicalOffset;
        harness.field._fetchDictAtEntry = originalFetchDictionary;
        harness.document.destroy();
    });
    it('allows a catalog revision for certifying comment permission', () => {
        // Arrange
        const harness = makeIncrementUpdateHarness();
        setSignatureRanges(
            harness.field,
            [0, 20, 100, 20],
            true,
            PdfCertificationFlag.allowComments
        );
        const catalogDictionary: _PdfDictionary =
            new _PdfDictionary(harness.crossReference);
        catalogDictionary.update('Type', _PdfName.get('Catalog'));
        const outsideEntry: _PdfObjectInformation = {
            free: false,
            revisionId: 2,
            gen: 0
        } as _PdfObjectInformation;
        const histories: _PdfObjectInformation[][] = [];
        histories[1] = [outsideEntry];
        (harness.crossReference as any)._entriesHistory = histories;
        const originalPhysicalOffset:
            (entry: _PdfObjectInformation) => number =
            harness.crossReference._getPhysicalOffsetForEntry;
        const originalFetchDictionary:
            (
                objectNumber: number,
                entry: _PdfObjectInformation,
                crossReference: _PdfCrossReference
            ) => _PdfDictionary = harness.field._fetchDictAtEntry;
        harness.crossReference._getPhysicalOffsetForEntry =
            (_entry: _PdfObjectInformation): number => 50;
        harness.field._fetchDictAtEntry =
            (
                _objectNumber: number,
                _entry: _PdfObjectInformation,
                _crossReference: _PdfCrossReference
            ): _PdfDictionary => catalogDictionary;
        // Act
        const result: boolean = harness.field._checkIncrementUpdate();
        // Assert
        expect(result).toBeFalsy();
        harness.crossReference._getPhysicalOffsetForEntry =
            originalPhysicalOffset;
        harness.field._fetchDictAtEntry = originalFetchDictionary;
        harness.document.destroy();
    });
    it('uses forbidChanges when document permission is null', () => {
        // Arrange
        const harness = makeIncrementUpdateHarness();
        harness.field._signature = {
            _ranges: [0, 20, 100, 20],
            _certify: true,
            _documentPermissions: null,
            _isLocked: false
        } as any;
        const modifiedDictionary: _PdfDictionary =
            new _PdfDictionary(harness.crossReference);
        const outsideEntry: _PdfObjectInformation = {
            free: false,
            revisionId: 2,
            gen: 0
        } as _PdfObjectInformation;
        const histories: _PdfObjectInformation[][] = [];
        histories[1] = [outsideEntry];
        (harness.crossReference as any)._entriesHistory = histories;
        const originalPhysicalOffset:
            (entry: _PdfObjectInformation) => number =
            harness.crossReference._getPhysicalOffsetForEntry;
        const originalFetchDictionary:
            (
                objectNumber: number,
                entry: _PdfObjectInformation,
                crossReference: _PdfCrossReference
            ) => _PdfDictionary = harness.field._fetchDictAtEntry;
        harness.crossReference._getPhysicalOffsetForEntry =
            (_entry: _PdfObjectInformation): number => 50;
        harness.field._fetchDictAtEntry =
            (
                _objectNumber: number,
                _entry: _PdfObjectInformation,
                _crossReference: _PdfCrossReference
            ): _PdfDictionary => modifiedDictionary;
        // Act
        const result: boolean = harness.field._checkIncrementUpdate();
        // Assert
        expect(result).toBeTruthy();
        harness.crossReference._getPhysicalOffsetForEntry =
            originalPhysicalOffset;
        harness.field._fetchDictAtEntry = originalFetchDictionary;
        harness.document.destroy();
    });
    it('handles an AcroForm dictionary without treating it as a reference', () => {
        // Arrange
        const harness = makeIncrementUpdateHarness();
        setSignatureRanges(harness.field, [0, 20, 30, 20]);
        const acroFormDictionary: _PdfDictionary =
            new _PdfDictionary(harness.crossReference);
        acroFormDictionary.update('Fields', []);
        harness.catalog.update('AcroForm', acroFormDictionary);
        (harness.crossReference as any)._entriesHistory = [];
        // Act
        const result: boolean = harness.field._checkIncrementUpdate();
        // Assert
        expect(result).toBeFalsy();
        harness.document.destroy();
    });
    it('handles an AcroForm reference and reads the signed revision', () => {
        // Arrange
        const harness = makeIncrementUpdateHarness();
        setSignatureRanges(harness.field, [0, 20, 30, 20]);
        const acroFormReference: _PdfReference =
            _PdfReference.get(40, 0);
        const acroFormDictionary: _PdfDictionary =
            new _PdfDictionary(harness.crossReference);
        acroFormDictionary.update('Fields', []);
        harness.catalog.update('AcroForm', acroFormReference);
        harness.crossReference._cacheMap.set(
            acroFormReference,
            acroFormDictionary
        );
        (harness.crossReference as any)._entriesHistory = [];
        const originalRevisionFetch:
            (
                reference: _PdfReference,
                revision: number
            ) => any =
            harness.crossReference._fetchReferenceInRevision;
        harness.crossReference._fetchReferenceInRevision =
            (
                _reference: _PdfReference,
                _revision: number
            ): _PdfDictionary => acroFormDictionary;
        // Act
        const result: boolean = harness.field._checkIncrementUpdate();
        // Assert
        expect(result).toBeFalsy();
        harness.crossReference._fetchReferenceInRevision =
            originalRevisionFetch;
        harness.document.destroy();
    });
    it('does not enter signature history when histories stop at the signature object number', () => {
        // Arrange
        const harness = makeIncrementUpdateHarness();
        setSignatureRanges(harness.field, [0, 20, 30, 20]);
        const histories: _PdfObjectInformation[][] = [];
        histories.length = harness.field._ref.objectNumber;
        (harness.crossReference as any)._entriesHistory = histories;
        // Act
        const result: boolean = harness.field._checkIncrementUpdate();
        // Assert
        expect(result).toBeFalsy();
        harness.document.destroy();
    });
    it('reads signature history when histories extend beyond the signature object number', () => {
        // Arrange
        const harness = makeIncrementUpdateHarness();
        setSignatureRanges(harness.field, [0, 20, 100, 20]);
        const signedEntry: _PdfObjectInformation = {
            free: false,
            revisionId: 7,
            gen: 0
        } as _PdfObjectInformation;
        const histories: _PdfObjectInformation[][] = [];
        histories.length = harness.field._ref.objectNumber + 1;
        histories[harness.field._ref.objectNumber] = [signedEntry];
        (harness.crossReference as any)._entriesHistory = histories;
        const originalPhysicalOffset:
            (entry: _PdfObjectInformation) => number =
            harness.crossReference._getPhysicalOffsetForEntry;
        harness.crossReference._getPhysicalOffsetForEntry =
            (_entry: _PdfObjectInformation): number => 10;
        // Act
        const result: boolean = harness.field._checkIncrementUpdate();
        // Assert
        expect(result).toBeFalsy();
        harness.crossReference._getPhysicalOffsetForEntry =
            originalPhysicalOffset;
        harness.document.destroy();
    });
    it('ignores a free signature-history entry', () => {
        // Arrange
        const harness = makeIncrementUpdateHarness();
        setSignatureRanges(harness.field, [0, 20, 100, 20]);
        const freeEntry: _PdfObjectInformation = {
            free: true,
            revisionId: 7,
            gen: 0
        } as _PdfObjectInformation;
        const histories: _PdfObjectInformation[][] = [];
        histories.length = harness.field._ref.objectNumber + 1;
        histories[harness.field._ref.objectNumber] = [freeEntry];
        (harness.crossReference as any)._entriesHistory = histories;
        const originalPhysicalOffset:
            (entry: _PdfObjectInformation) => number =
            harness.crossReference._getPhysicalOffsetForEntry;
        let physicalOffsetCallCount: number = 0;
        harness.crossReference._getPhysicalOffsetForEntry =
            (_entry: _PdfObjectInformation): number => {
                physicalOffsetCallCount++;
                return 10;
            };
        // Act
        const result: boolean = harness.field._checkIncrementUpdate();
        // Assert
        expect(result).toBeFalsy();
        expect(physicalOffsetCallCount).toBe(0);
        harness.crossReference._getPhysicalOffsetForEntry =
            originalPhysicalOffset;
        harness.document.destroy();
    });
    it('ignores an undefined signature-history entry', () => {
        // Arrange
        const harness = makeIncrementUpdateHarness();
        setSignatureRanges(harness.field, [0, 20, 100, 20]);
        const histories: _PdfObjectInformation[][] = [];
        histories.length = harness.field._ref.objectNumber + 1;
        histories[harness.field._ref.objectNumber] = [
            undefined
        ];
        (harness.crossReference as any)._entriesHistory = histories;
        const originalPhysicalOffset:
            (entry: _PdfObjectInformation) => number =
            harness.crossReference._getPhysicalOffsetForEntry;
        let physicalOffsetCallCount: number = 0;
        harness.crossReference._getPhysicalOffsetForEntry =
            (_entry: _PdfObjectInformation): number => {
                physicalOffsetCallCount++;
                return 10;
            };
        // Act
        const result: boolean = harness.field._checkIncrementUpdate();
        // Assert
        expect(result).toBeFalsy();
        expect(physicalOffsetCallCount).toBe(0);
        harness.crossReference._getPhysicalOffsetForEntry =
            originalPhysicalOffset;
        harness.document.destroy();
    });
    it('does not accept a non-finite signature-history physical offset', () => {
        // Arrange
        const harness = makeIncrementUpdateHarness();
        setSignatureRanges(harness.field, [0, 20, 100, 20]);
        const signatureEntry: _PdfObjectInformation = {
            free: false,
            revisionId: 7,
            gen: 0
        } as _PdfObjectInformation;
        const histories: _PdfObjectInformation[][] = [];
        histories.length = harness.field._ref.objectNumber + 1;
        histories[harness.field._ref.objectNumber] = [signatureEntry];
        (harness.crossReference as any)._entriesHistory = histories;
        const originalPhysicalOffset:
            (entry: _PdfObjectInformation) => number =
            harness.crossReference._getPhysicalOffsetForEntry;
        harness.crossReference._getPhysicalOffsetForEntry =
            (_entry: _PdfObjectInformation): number => Number.NaN;
        // Act
        const result: boolean = harness.field._checkIncrementUpdate();
        // Assert
        expect(result).toBeTruthy();
        harness.crossReference._getPhysicalOffsetForEntry =
            originalPhysicalOffset;
        harness.document.destroy();
    });
    it('requires a finite physical offset to also be inside the signed ByteRange', () => {
        // Arrange
        const harness = makeIncrementUpdateHarness();
        setSignatureRanges(harness.field, [0, 20, 100, 20]);
        const signatureEntry: _PdfObjectInformation = {
            free: false,
            revisionId: 7,
            gen: 0
        } as _PdfObjectInformation;
        const histories: _PdfObjectInformation[][] = [];
        histories.length = harness.field._ref.objectNumber + 1;
        histories[harness.field._ref.objectNumber] = [signatureEntry];
        (harness.crossReference as any)._entriesHistory = histories;
        const originalPhysicalOffset:
            (entry: _PdfObjectInformation) => number =
            harness.crossReference._getPhysicalOffsetForEntry;
        harness.crossReference._getPhysicalOffsetForEntry =
            (_entry: _PdfObjectInformation): number => 50;
        // Act
        const result: boolean = harness.field._checkIncrementUpdate();
        // Assert
        expect(result).toBeTruthy();
        harness.crossReference._getPhysicalOffsetForEntry =
            originalPhysicalOffset;
        harness.document.destroy();
    });
    it('accepts a finite physical offset inside the first signed ByteRange', () => {
        // Arrange
        const harness = makeIncrementUpdateHarness();
        setSignatureRanges(harness.field, [0, 20, 100, 20]);
        const signatureEntry: _PdfObjectInformation = {
            free: false,
            revisionId: 7,
            gen: 0
        } as _PdfObjectInformation;
        const histories: _PdfObjectInformation[][] = [];
        histories.length = harness.field._ref.objectNumber + 1;
        histories[harness.field._ref.objectNumber] = [signatureEntry];
        (harness.crossReference as any)._entriesHistory = histories;
        const originalPhysicalOffset:
            (entry: _PdfObjectInformation) => number =
            harness.crossReference._getPhysicalOffsetForEntry;
        harness.crossReference._getPhysicalOffsetForEntry =
            (_entry: _PdfObjectInformation): number => 10;
        // Act
        const result: boolean = harness.field._checkIncrementUpdate();
        // Assert
        expect(result).toBeFalsy();
        harness.crossReference._getPhysicalOffsetForEntry =
            originalPhysicalOffset;
        harness.document.destroy();
    });
    it('accepts a finite physical offset inside the second signed ByteRange', () => {
        // Arrange
        const harness = makeIncrementUpdateHarness();
        setSignatureRanges(harness.field, [0, 20, 100, 20]);
        const signatureEntry: _PdfObjectInformation = {
            free: false,
            revisionId: 7,
            gen: 0
        } as _PdfObjectInformation;
        const histories: _PdfObjectInformation[][] = [];
        histories.length = harness.field._ref.objectNumber + 1;
        histories[harness.field._ref.objectNumber] = [signatureEntry];
        (harness.crossReference as any)._entriesHistory = histories;
        const originalPhysicalOffset:
            (entry: _PdfObjectInformation) => number =
            harness.crossReference._getPhysicalOffsetForEntry;
        harness.crossReference._getPhysicalOffsetForEntry =
            (_entry: _PdfObjectInformation): number => 110;
        // Act
        const result: boolean = harness.field._checkIncrementUpdate();
        // Assert
        expect(result).toBeFalsy();
        harness.crossReference._getPhysicalOffsetForEntry =
            originalPhysicalOffset;
        harness.document.destroy();
    });
    it('does not process signature history when the history collection is empty', () => {
        // Arrange
        const harness = makeIncrementUpdateHarness();
        setSignatureRanges(harness.field, [0, 20, 100, 20]);
        const histories: _PdfObjectInformation[][] = [];
        histories.length = harness.field._ref.objectNumber + 1;
        histories[harness.field._ref.objectNumber] = [];
        (harness.crossReference as any)._entriesHistory = histories;
        const originalPhysicalOffset:
            (entry: _PdfObjectInformation) => number =
            harness.crossReference._getPhysicalOffsetForEntry;
        let physicalOffsetCallCount: number = 0;
        harness.crossReference._getPhysicalOffsetForEntry =
            (_entry: _PdfObjectInformation): number => {
                physicalOffsetCallCount++;
                return 10;
            };
        // Act
        const result: boolean = harness.field._checkIncrementUpdate();
        // Assert
        expect(result).toBeFalsy();
        expect(physicalOffsetCallCount).toBe(0);
        harness.crossReference._getPhysicalOffsetForEntry =
            originalPhysicalOffset;
        harness.document.destroy();
    });
});
