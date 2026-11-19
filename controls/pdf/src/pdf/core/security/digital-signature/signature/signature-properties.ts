import { CryptographicStandard, DigestAlgorithm, PdfCertificationFlag } from '../../../enumerator';
import { PdfAuthorityInformationAccess, PdfCrlDistributionPoint, PdfSubjectAlternativeName } from '../../../pdf-document-helper';
/**
 * Represents the properties used to configure a PDF signature.
 *
 * @property {CryptographicStandard} cryptographicStandard - The cryptographic standard.
 * @property {DigestAlgorithm} digestAlgorithm - The digest algorithm.
 * @property {string} contactInfo - Contact information of the signer.
 * @property {string} reason - The reason for signing the document.
 * @property {string} locationInfo - The geographical location where the document is signed.
 * @property {boolean} certify - Indicates whether the signature certifies the document.
 * @property {PdfCertificationFlag} documentPermissions - Permissions to apply when certifying the document.
 * @property {string} signedName - The name to display as the signer.
 * @property {boolean} isLocked - Indicates whether the signature field should be locked after signing.
 *
 * ```typescript
 * // Load the document
 * let document: PdfDocument = new PdfDocument(data);
 * // Gets the first page of the document
 * let page: PdfPage = document.getPage(0);
 * // Access the PDF form
 * let form: PdfForm = document.form;
 * // Create a new signature field
 * let field: PdfSignatureField = new PdfSignatureField(page, 'Signature', {x: 10, y: 10, width: 100, height: 50});
 * // Create a new signature using PFX data and private key
 * const sign: PdfSignature = PdfSignature.create(certData, password, { cryptographicStandard: CryptographicStandard.cms, digestAlgorithm: DigestAlgorithm.sha256 });
 * // Sets the signature to the field
 * field.setSignature(sign);
 * // Gets the field Appearance
 * let appearance = field.getAppearance();
 * // Add the field into PDF form
 * form.add(field);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export type PdfSignatureOptions = {
    /**
     * Specifies the cryptographic standard.
     */
    cryptographicStandard?: CryptographicStandard;
    /**
     * Specifies the digest algorithm.
     */
    digestAlgorithm?: DigestAlgorithm;
    /**
     * Specifies the contact information of the signer.
     */
    contactInfo?: string;
    /**
     * Specifies the reason for signing.
     */
    reason?: string;
    /**
     * Specifies the physical location of the signing.
     */
    locationInfo?: string;
    /**
     * Specifies a value indicating certificate document or not.
     */
    certify?: boolean;
    /**
     * Specifies permission for certificated documents.
     */
    documentPermissions?: PdfCertificationFlag;
    /**
     * Specifies the name of the signature.
     */
    signedName?: string;
    /**
     * Specifies a value indicating whether to lock the signature or not.
     */
    isLocked?: boolean;
    /**
     * Specifies a value indicating whether to generate validation appearance.
     */
    isValidationAppearanceEnabled?: boolean;
}
/**
 * Represents information extracted from a PDF certificate.
 *
 * @property {string} issuerName - The name of the certificate authority that issued the certificate.
 * @property {Uint8Array} serialNumber - The unique serial number assigned to the certificate.
 * @property {string} subjectName - The name of the entity to which the certificate was issued.
 * @property {Date} validFrom - The start date from which the certificate is considered valid.
 * @property {Date} validTo - The end date after which the certificate is no longer valid.
 * @property {number} version - The version number of the certificate format.
 *
 * ```typescript
 * //Load the document
 * let document: PdfDocument = new PdfDocument(data);
 * // Gets the first page of the document
 * let page: PdfPage = document.getPage(0);
 * // Access the PDF form
 * let form: PdfForm = document.form;
 * // Create a new signature field
 * let field: PdfSignatureField = new PdfSignatureField(page, 'Signature', {x: 10, y: 10, width: 100, height: 50});
 * // Create a new signature using PFX data and private key
 * const sign: PdfSignature = PdfSignature.create(certData, password, { cryptographicStandard: CryptographicStandard.cms, digestAlgorithm: DigestAlgorithm.sha256 });
 * // Sets the signature to the field
 * field.setSignature(sign);
 * // Gets the certificate information of the signature
 * const certificateInfo: PdfCertificateInformation = sign.getCertificateInformation();
 * // Get the extended key usage names defined by the certificate
 * const extendedKeyUsage: string[] = certificateInfo.extendedKeyUsage;
 * // Get the certificate policies encoded in the certificate
 * const certificatePolicies: PdfCertificatePolicy[] = certificateInfo.certificatePolicies;
 * // Add the field into PDF form
 * form.add(field);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export type PdfCertificateInformation = {
    /**
     * Specifies the simplified issuer name of the certificate, normally the Common Name.
     */
    issuerName: string;
    /**
     * Specifies the complete distinguished name of the certificate issuer.
     */
    issuer: string;
    /**
     * Specifies the structured distinguished-name attributes of the certificate issuer.
     */
    issuerAttributes: PdfDistinguishedName;
    /**
     * Specifies the serial number of the certificate.
     */
    serialNumber: Uint8Array;
    /**
     * Specifies the simplified subject name of the certificate, normally the Common Name.
     */
    subjectName: string;
    /**
     * Specifies the complete distinguished name of the certificate subject.
     */
    subject: string;
    /**
     * Specifies the structured distinguished-name attributes of the certificate subject.
     */
    subjectAttributes: PdfDistinguishedName;
    /**
     * Specifies the date and time before which the certificate is not valid.
     */
    validFrom: Date;
    /**
     * Specifies the date and time after which the certificate is not valid.
     */
    validTo: Date;
    /**
     * Specifies the version number of the certificate.
     */
    version: number;
    /**
     * Specifies the certificate signature algorithm name.
     */
    signatureAlgorithm: string;
    /**
     * Specifies the key usage names defined by the certificate.
     */
    keyUsage: string[];
    /**
     * Specifies the SHA-1 thumbprint of the complete DER-encoded certificate as hexadecimal text.
     */
    sha1Thumbprint: string;
    /**
     * Specifies the extended key usage names defined by the certificate.
     */
    extendedKeyUsage: string[];
    /**
     * Specifies the certificate policies defined by the certificate.
     */
    certificatePolicies: PdfCertificatePolicy[];
    /**
     * Specifies the SHA-1 digest of the certificate public key.
     */
    sha1PublicKeyHash: string;
    /**
     * Specifies the complete DER-encoded X.509 certificate.
     */
    x509Data: string;
    /**
     * Specifies the MD5 digest of the complete DER-encoded certificate.
     */
    md5Thumbprint: string;
    /**
     * Specifies the Subject Key Identifier.
     */
    subjectKeyIdentifier: string;
    /**
     * Specifies the Authority Key Identifier.
     */
    authorityKeyIdentifier: string;
    /**
     * Specifies the Subject Alternative Name entries defined by the certificate.
     */
    subjectAlternativeNames: PdfSubjectAlternativeName[];
    /**
     * Specifies the RFC822 email addresses defined in the Subject Alternative Name extension.
     */
    rfc822EmailAddresses: string[];
    /**
     * Specifies the CRL Distribution Point locations defined by the certificate.
     */
    crlDistributionPoints: PdfCrlDistributionPoint[];
    /**
     * Specifies the Authority Information Access entries defined by the certificate.
     */
    authorityInformationAccess: PdfAuthorityInformationAccess[];
    /**
     * Specifies the certificate public key.
     */
    publicKey: string;
};
/**
 * Represents the distinguished-name attributes of an X.509 certificate.
 *
 * @property {string} commonName The Common Name attribute.
 * @property {string} organization The Organization attribute.
 * @property {string} organizationalUnit The Organizational Unit attribute.
 * @property {string} emailAddress The Email Address attribute.
 * @property {string} country The Country attribute.
 * @property {string} state The State or Province attribute.
 * @property {string} locality The Locality attribute.
 *
 * ```typescript
 * // Load an existing signed PDF document.
 * const document: PdfDocument = new PdfDocument(data);
 * // Get the first signature field from the document form.
 * const field: PdfSignatureField = document.form.fieldAt(0) as PdfSignatureField;
 * // Get the digital signature associated with the signature field.
 * const signature: PdfSignature = field.getSignature();
 * // Get the certificate information associated with the signature.
 * const certificateInfo: PdfCertificateInformation = signature.getCertificateInformation();
 * // Get the distinguished-name attributes of the certificate subject.
 * const subject: PdfDistinguishedName = certificateInfo.subjectAttributes;
 * // Get the Common Name of the certificate subject.
 * const commonName: string = subject.commonName;
 * // Get the Organization of the certificate subject.
 * const organization: string = subject.organization;
 * // Get the Organizational Unit of the certificate subject.
 * const organizationalUnit: string = subject.organizationalUnit;
 * // Get the Email Address of the certificate subject.
 * const emailAddress: string = subject.emailAddress;
 * // Get the Country of the certificate subject.
 * const country: string = subject.country;
 * // Get the State or Province of the certificate subject.
 * const state: string = subject.state;
 * // Get the Locality of the certificate subject.
 * const locality: string = subject.locality;
 * // Destroy the document.
 * document.destroy();
 * ```
 */
export type PdfDistinguishedName = {
    /**
     * Specifies the Common Name attribute.
     */
    commonName: string;
    /**
     * Specifies the Organization attribute.
     */
    organization: string;
    /**
     * Specifies the Organizational Unit attribute.
     */
    organizationalUnit: string;
    /**
     * Specifies the Email Address attribute.
     */
    emailAddress: string;
    /**
     * Specifies the Country attribute.
     */
    country: string;
    /**
     * Specifies the State or Province attribute.
     */
    state: string;
    /**
     * Specifies the Locality attribute.
     */
    locality: string;
};
/**
 * Represents a certificate policy defined by an X.509 certificate.
 *
 * @property {string} policyIdentifier The certificate policy object identifier.
 * @property {string} [description] The policy description when encoded in the certificate.
 * @property {string[]} cpsUrls The certification practice statement (CPS) pointer URLs.
 * @property {PdfCertificatePolicyNotice[]} userNotices The user notice and issuer notice qualifiers.
 *
 * ```typescript
 * // Load an existing signed PDF document.
 * const document: PdfDocument = new PdfDocument(data);
 * // Get the first signature field from the document form.
 * const field: PdfSignatureField = document.form.fieldAt(0) as PdfSignatureField;
 * // Get the digital signature associated with the signature field.
 * const signature: PdfSignature = field.getSignature();
 * // Get the certificate information associated with the signature.
 * const certificateInfo: PdfCertificateInformation = signature.getCertificateInformation();
 * // Get the certificate policies encoded in the certificate.
 * const certificatePolicies: PdfCertificatePolicy[] = certificateInfo.certificatePolicies;
 * // Get the first certificate policy object identifier.
 * const policyIdentifier: string = certificatePolicies[0].policyIdentifier;
 * // Get the policy description when it is encoded in the certificate.
 * const description: string = certificatePolicies[0].description;
 * // Get the certification practice statement pointer URLs of the policy.
 * const cpsUrls: string[] = certificatePolicies[0].cpsUrls;
 * // Get the user notice or legal notice text of the policy.
 * const userNotices: PdfCertificatePolicyNotice[] = certificatePolicies[0].userNotices;
 * // Destroy the document.
 * document.destroy();
 * ```
 */
export type PdfCertificatePolicy = {
    /**
     * Specifies the certificate policy object identifier.
     */
    policyIdentifier: string;
    /**
     * Specifies the policy description when it is encoded in the certificate.
     */
    description?: string;
    /**
     * Specifies the certification practice statement (CPS) pointer URLs.
     */
    cpsUrls: string[];
    /**
     * Specifies the user notice and issuer notice qualifiers from the certificate.
     */
    userNotices: PdfCertificatePolicyNotice[];
};
/**
 * Represents a user notice qualifier of an X.509 certificate policy.
 *
 * @property {string} [explicitText] The human-readable policy notice.
 * @property {string} [organization] The notice organization when available.
 * @property {number[]} [noticeNumbers] The notice-reference numbers in encoded order.
 *
 * ```typescript
 * // Load an existing signed PDF document
 * let document: PdfDocument = new PdfDocument(data);
 * // Get the signature field
 * let field: PdfSignatureField = document.form.fieldAt(0) as PdfSignatureField;
 * // Get the digital signature
 * let signature: PdfSignature = field.getSignature();
 * // Get the signer certificate information
 * let certificate: PdfCertificateInformation = signature.getCertificateInformation();
 * // Get the certificate policies
 * let policies: PdfCertificatePolicy[] = certificate.certificatePolicies;
 * // Get the first policy notice when available
 * if (policies.length > 0 && policies[0].userNotices.length > 0) {
 *     let notice: PdfCertificatePolicyNotice = policies[0].userNotices[0];
 *     let explicitText: string = notice.explicitText;
 *     let organization: string = notice.organization;
 *     let noticeNumbers: readonly number[] = notice.noticeNumbers;
 * }
 * // Destroy the document
 * document.destroy();
 * ```
 */
export type PdfCertificatePolicyNotice = {
    /**
     * Specifies the human-readable policy notice.
     */
    explicitText?: string;
    /**
     * Specifies the notice organization when available.
     */
    organization?: string;
    /**
     * Specifies the notice-reference numbers in encoded order.
     */
    noticeNumbers?: number[];
};
