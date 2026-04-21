import { CryptographicStandard, DigestAlgorithm, PdfCertificationFlags } from '../../../enumerator';
/**
 * Represents the properties used to configure a PDF signature.
 *
 * @property {CryptographicStandard} cryptographicStandard - The cryptographic standard.
 * @property {DigestAlgorithm} digestAlgorithm - The digest algorithm.
 * @property {string} contactInfo - Contact information of the signer.
 * @property {string} reason - The reason for signing the document.
 * @property {string} locationInfo - The geographical location where the document is signed.
 * @property {boolean} certify - Indicates whether the signature certifies the document.
 * @property {PdfCertificationFlags} documentPermissions - Permissions to apply when certifying the document.
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
    documentPermissions?: PdfCertificationFlags;
    /**
     * Specifies the name of the signature.
     */
    signedName?: string;
    /**
     * Specifies a value indicating whether to lock the signature or not.
     */
    isLocked?: boolean;
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
     * Specifies the issuer name of the certificate.
     */
    issuerName: string;
    /**
     * Specifies the serial number of the certificate.
     */
    serialNumber: Uint8Array;
    /**
     * Specifies the subject name of the certificate.
     */
    subjectName: string;
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
}
