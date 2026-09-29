import { DigestAlgorithm, CryptographicStandard, PdfTemplateHorizontalAlignment, PdfTemplateVerticalAlignment, PdfTemplateLayerMode, PdfEncryptionType, PdfPermissionFlag, PdfCertificationFlag, RevocationStatus, SignatureStatus, RevocationType  } from './enumerator';
import { PdfFont } from './fonts/pdf-standard-font';
import { PdfStringFormat } from './fonts/pdf-string-format';
import { PdfBrush, PdfPen } from './graphics/pdf-graphics';
import { PdfLayoutFormat } from './graphics/pdf-layouter';
import { PdfPageTemplateElement } from './graphics/pdf-page-template-element';
import { PdfTemplate } from './graphics/pdf-template';
/**
 * Represents a bounding rectangle with an origin (x, y) and size (width, height).
 *
 * @property {number} x - The horizontal coordinate of the rectangle's origin.
 * @property {number} y - The vertical coordinate of the rectangle's origin.
 * @property {number} width - The width of the rectangle.
 * @property {number} height - The height of the rectangle.
 */
export type Rectangle = {
    x: number;
    y: number;
    width: number;
    height: number;
};
/**
 * Represents the size.
 *
 * @property {number} width - The width.
 * @property {number} height - The height.
 */
export type Size = {
    width: number;
    height: number;
};
/**
 * Represents a point in a two-dimensional coordinate system.
 *
 * @property {number} x - The x-coordinate of the point.
 * @property {number} y - The y-coordinate of the point.
 */
export type Point = {
    x: number;
    y: number;
};
/**
 * Represents a color using RGB components and an optional transparency flag.
 *
 * @property {number} r - Red component of the color (0 to 255).
 * @property {number} g - Green component of the color (0 to 255).
 * @property {number} b - Blue component of the color (0 to 255).
 * @property {boolean} isTransparent - Optional flag indicating whether the color is transparent.
 */
export type PdfColor = {
    r: number;
    g: number;
    b: number;
    isTransparent?: boolean;
};
/**
 * Represents a text element with layout-aware rendering options.
 *
 * @property {string} text - The text content to render. Must be a non-empty string.
 * @property {PdfFont} font - The font used to render the text.
 * @property {PdfPen} pen - Optional pen used to outline the text.
 * @property {PdfBrush} brush - Optional brush used to fill the text. Defaults to black if not provided.
 * @property {PdfStringFormat} stringFormat - Optional string formatting options such as alignment or line spacing.
 * @property {PdfLayoutFormat} layoutFormat - Optional layout format that controls how the text is arranged within bounds.
 */
export type PdfTextElement = {
    text: string;
    font: PdfFont;
    pen?: PdfPen;
    brush?: PdfBrush;
    stringFormat?: PdfStringFormat;
    layoutFormat?: PdfLayoutFormat;
};
/**
 * A callback function used for external signing of a PDF document with extended options.
 *
 * If public certificates are provided before signing, `data` will be a 256-byte hash
 * that should be signed using the certificate's private key.
 * If no public certificates are provided, `data` will be the full PDF content,
 * and the function should compute the hash using the given algorithm and standard.
 *
 * @param {Uint8Array} data - Either a 256-byte hash or the full PDF data, depending on the signing setup.
 * @param {Object} options - Signing options.
 * @param {DigestAlgorithm} options.algorithm - The digest algorithm to use.
 * @param {CryptographicStandard} options.cryptographicStandard - The cryptographic standard.
 * @returns {{ signedData: Uint8Array, timestampData?: Uint8Array } | void | Promise<{ signedData: Uint8Array; timestampData?: Uint8Array }>}
 */
export type ExternalSignatureCallback = (
    data: Uint8Array,
    options: {
        algorithm: DigestAlgorithm,
        cryptographicStandard: CryptographicStandard
    }
) => {signedData: Uint8Array, timestampData?: Uint8Array} | void | Promise<{ signedData: Uint8Array; timestampData?: Uint8Array }>;
/**
 * A callback function used to obtain the timestamp from a trusted timestamp authority (TSA) server.
 *
 * @param {Uint8Array} data - Request bytes for timestamping.
 * @returns {Promise<Uint8Array>} - Timestamp data obtained from a trusted timestamp authority server.
 */
export type TimestampCallback = (data: Uint8Array) => Promise<{ data: Uint8Array }>;
/**
 * Represents a multilingual language-keyed string map for XMP metadata.
 *
 * @property {string} [lang] - The language tag (e.g., "en-US", "fr-FR") mapped to its string value.
 */
export type PdfXmpLangArray = { [lang: string]: string };
/**
 * Represents page dimension structure for XMP paged text schema.
 *
 * @property {number} width - Width of the page.
 * @property {number} height - Height of the page.
 * @property {string} [unit] - Optional unit of measurement (e.g., "pt", "mm").
 */
export type PdfXmpDimensionsStruct = { width: number; height: number; unit?: string };
/**
 * Represents a thumbnail image structure for XMP Basic schema.
 *
 * @property {number} width - Width of the thumbnail in pixels.
 * @property {number} height - Height of the thumbnail in pixels.
 * @property {string} format - Image format (e.g., "JPEG", "PNG").
 * @property {string} image - Base64-encoded image data.
 */
export type PdfXmpThumbnail = { width: number; height: number; format: string; image: string };
/**
 * Represents the header and footer template settings with support for positional, even, odd, and layer-based rendering.
 *
 * @property {{ template: PdfPageTemplateElement;  templateLayerMode?: PdfTemplateLayerMode; alignment?: PdfTemplateHorizontalAlignment }} top - Optional top template with horizontal alignment and layer configuration.
 * @property {{ template: PdfPageTemplateElement;  templateLayerMode?: PdfTemplateLayerMode; alignment?: PdfTemplateHorizontalAlignment }} bottom - Optional bottom template with horizontal alignment and layer configuration.
 * @property {{ template: PdfPageTemplateElement;  templateLayerMode?: PdfTemplateLayerMode; alignment?: PdfTemplateVerticalAlignment }} left - Optional left-side template with vertical alignment and layer configuration.
 * @property {{ template: PdfPageTemplateElement;  templateLayerMode?: PdfTemplateLayerMode; alignment?: PdfTemplateVerticalAlignment }} right - Optional right-side template with vertical alignment and layer configuration.
 * @property {{ template: PdfPageTemplateElement;  templateLayerMode?: PdfTemplateLayerMode; alignment?: PdfTemplateHorizontalAlignment }} oddTop - Optional top template for odd pages with layer configuration.
 * @property {{ template: PdfPageTemplateElement;  templateLayerMode?: PdfTemplateLayerMode; alignment?: PdfTemplateHorizontalAlignment }} oddBottom - Optional bottom template for odd pages with layer configuration.
 * @property {{ template: PdfPageTemplateElement;  templateLayerMode?: PdfTemplateLayerMode; alignment?: PdfTemplateVerticalAlignment }} oddLeft - Optional left-side template for odd pages with layer configuration.
 * @property {{ template: PdfPageTemplateElement;  templateLayerMode?: PdfTemplateLayerMode; alignment?: PdfTemplateVerticalAlignment }} oddRight - Optional right-side template for odd pages with layer configuration.
 * @property {{ template: PdfPageTemplateElement;  templateLayerMode?: PdfTemplateLayerMode; alignment?: PdfTemplateHorizontalAlignment }} evenTop - Optional top template for even pages with layer configuration.
 * @property {{ template: PdfPageTemplateElement;  templateLayerMode?: PdfTemplateLayerMode; alignment?: PdfTemplateHorizontalAlignment }} evenBottom - Optional top template for even pages with layer configuration.
 * @property {{ template: PdfPageTemplateElement;  templateLayerMode?: PdfTemplateLayerMode; alignment?: PdfTemplateVerticalAlignment }} evenLeft - Optional left-side template for even pages with layer configuration.
 * @property {{ template: PdfPageTemplateElement;  templateLayerMode?: PdfTemplateLayerMode; alignment?: PdfTemplateVerticalAlignment }} evenRight - Optional right-side template for even pages with layer configuration.
 */
export type PdfDocumentTemplate = {
    left?: { template: PdfPageTemplateElement; templateLayerMode?: PdfTemplateLayerMode; alignment?: PdfTemplateVerticalAlignment };
    right?: { template: PdfPageTemplateElement;  templateLayerMode?: PdfTemplateLayerMode; alignment?: PdfTemplateVerticalAlignment };
    top?: { template: PdfPageTemplateElement;  templateLayerMode?: PdfTemplateLayerMode; alignment?: PdfTemplateHorizontalAlignment };
    bottom?: { template: PdfPageTemplateElement;  templateLayerMode?: PdfTemplateLayerMode; alignment?: PdfTemplateHorizontalAlignment };
    evenLeft?: { template: PdfPageTemplateElement;  templateLayerMode?: PdfTemplateLayerMode; alignment?: PdfTemplateVerticalAlignment };
    evenRight?: { template: PdfPageTemplateElement;  templateLayerMode?: PdfTemplateLayerMode; alignment?: PdfTemplateVerticalAlignment };
    evenTop?: { template: PdfPageTemplateElement;  templateLayerMode?: PdfTemplateLayerMode; alignment?: PdfTemplateHorizontalAlignment };
    evenBottom?: { template: PdfPageTemplateElement;  templateLayerMode?: PdfTemplateLayerMode;
        alignment?: PdfTemplateHorizontalAlignment };
    oddLeft?: { template: PdfPageTemplateElement;  templateLayerMode?: PdfTemplateLayerMode; alignment?: PdfTemplateVerticalAlignment };
    oddRight?: { template: PdfPageTemplateElement;  templateLayerMode?: PdfTemplateLayerMode; alignment?: PdfTemplateVerticalAlignment };
    oddTop?: { template: PdfPageTemplateElement;  templateLayerMode?: PdfTemplateLayerMode; alignment?: PdfTemplateHorizontalAlignment };
    oddBottom?: { template: PdfPageTemplateElement;  templateLayerMode?: PdfTemplateLayerMode; alignment?: PdfTemplateHorizontalAlignment };
};
/**
 * Represents security configuration for PDF encryption.
 *
 * @property {PdfEncryptionType} encryptionType - Specifies the type of the algorithm and length of the encryption key (optional).
 * @property {string} userPassword - The user password which is required when the PDF document is opened in a viewer. (optional).
 * @property {string} ownerPassword - The owner password, If the PDF document is password protected you can use the owner password to open the document and change its permissions. (optional)
 * @property {PdfPermissionFlag} permissions - The permission flags, Defines what operations are allowed when the document is opened with user password. (optional).
 *
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data);
 * // Create security options with AES-128 encryption
 * let securityOptions: PdfSecurityOptions = {
 *     encryptionType: PdfEncryptionType.aesBit128,
 *     userPassword: 'user123',
 *     ownerPassword: 'owner456',
 *     permissions: PdfPermissionFlag.print | PdfPermissionFlag.copy
 * };
 * // Apply security settings
 * document.setSecurity(securityOptions);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export type PdfSecurityOptions = {
    encryptionType?: PdfEncryptionType;
    userPassword?: string;
    ownerPassword?: string;
    permissions?: PdfPermissionFlag;
};
/**
 * Internal helper type for template-value caching.
 *
 * @private
 */
export type _PdfTemplateValuePair = {
    template: PdfTemplate;
    value: string;
};
/**
 * Callback to retrieve revocation data.
 *
 * @param {string} url - Specifies the responder endpoint.
 * @param {Uint8Array} [requestbytes] - Specifies the optional request data.
 * @returns {Promise<{ response: Uint8Array }>} Returns a promise that resolves to the responder data.
 */
export type LongTermValidationCallback = (url: string, requestbytes?: any) => Promise<{ response: Uint8Array }>; // eslint-disable-line
/**
 * Represents the result of a PDF signature validation operation.
 *
 * @property {CryptographicStandard} cryptographicStandard - Specifies the cryptographic standard used for the signature.
 * @property {DigestAlgorithm} digestAlgorithm - Specifies the digest algorithm used to generate the signature.
 * @property {boolean} isDocumentModified - Indicates whether the document has been modified after signing.
 * @property {boolean} validityAtCurrentTime - Indicates whether the signature is valid at the current time.
 * @property {boolean} validityAtSignedTime - Indicates whether the signature was valid at the time it was signed.
 * @property {boolean} validityAtTimestampTime - Indicates whether the signature was valid at the timestamp generation time.
 * @property {boolean} isCertificated - Indicates whether the document is certified.
 * @property {PdfCertificationFlag} documentPermissions - Specifies the permissions granted by the certification signature.
 * @property {RevocationResult} revocationResult - Contains revocation validation information.
 * @property {LtvVerificationInformation} ltvVerificationInformation - Contains Long-Term Validation (LTV) verification information.
 * @property {string} signatureAlgorithm - Specifies the signature algorithm used to create the signature.
 * @property {string} signatureName - Specifies the name of the signature field.
 * @property {SignatureStatus} signatureStatus - Specifies the validation status of the signature.
 * @property {string[]} validationErrorMessages - Contains validation error messages generated during signature verification.
 * @property {TimestampInformation} timestampInformation - Contains timestamp validation and certificate information.
 * @property {boolean} isSignatureValid - Indicates whether the signature is valid.
 * @property {PdfSignerCertificate[]} [signerCertificates] - Contains the signer certificate chain and associated revocation details.
 */
export type PdfSignatureValidationResult = {
    cryptographicStandard: CryptographicStandard,
    digestAlgorithm: DigestAlgorithm,
    isDocumentModified: boolean,
    validityAtCurrentTime: boolean,
    validityAtSignedTime: boolean,
    validityAtTimestampTime: boolean,
    isCertifiedSignature: boolean,
    documentPermissions: PdfCertificationFlag,
    revocationResult: RevocationResult,
    ltvVerificationInformation: LtvVerificationInformation,
    signatureAlgorithm: string,
    signatureName: string,
    signatureStatus: SignatureStatus,
    validationErrorMessages: string[],
    timestampInformation: TimestampInformation,
    isSignatureValid: boolean,
    signerCertificates: PdfSignerCertificate[]
};
/**
 * Represents Long-Term Validation (LTV) verification information.
 *
 * @property {boolean} isCrlEmbedded - Indicates whether CRL information is embedded in the document.
 * @property {boolean} isLtvEmbedded - Indicates whether LTV information is embedded in the document.
 * @property {boolean} isOcspEmbedded - Indicates whether OCSP information is embedded in the document.
 */
export type LtvVerificationInformation = {
    isCrlEmbedded: boolean;
    isLtvEmbedded: boolean;
    isOcspEmbedded: boolean;
};
/**
 * Represents certificate revocation validation results.
 *
 * @property {boolean} isRevokedCRL - Indicates whether the certificate was revoked according to CRL validation.
 * @property {RevocationStatus} ocspRevocationStatus - Specifies the revocation status determined through OCSP validation.
 */
export type RevocationResult = {
    isRevokedCRL: boolean;
    ocspRevocationStatus: RevocationStatus;
};
/**
 * Represents revocation information (OCSP or CRL) associated with a certificate in the chain.
 *
 * @property {boolean} isEmbedded - Indicates whether the revocation data is embedded in the PDF.
 * @property {PdfX509CertificateProperties[]} certificates - The certificates associated with the revocation response.
 * @property {Date} validFrom - The date/time from which the revocation response is valid.
 * @property {Date} validTo - The date/time until which the revocation response is valid.
 */
export type PdfRevocationCertificate = {
    isEmbedded: boolean;
    certificates: PdfX509CertificateProperties[];
    validFrom: Date;
    validTo: Date;
};
/**
 * Represents per-certificate revocation and identity details for a signer certificate in the chain.
 *
 * @property {PdfX509CertificateProperties} certificate - The signer or chain certificate.
 * @property {PdfRevocationCertificate} [ocspCertificate] - OCSP revocation information for this certificate, if available.
 * @property {PdfRevocationCertificate} [crlCertificate] - CRL revocation information for this certificate, if available.
 */
export type PdfSignerCertificate = {
    certificate: PdfX509CertificateProperties;
    ocspCertificate?: PdfRevocationCertificate;
    crlCertificate?: PdfRevocationCertificate;
};
/**
 * Represents timestamp validation information associated with a signature.
 *
 * @property {boolean} isDocumentTimestamp - Indicates whether the timestamp is a document timestamp.
 * @property {boolean} isvalid - Indicates whether the timestamp is valid.
 * @property {Date} timestampTime - Specifies the date and time when the timestamp was generated.
 * @property {string} timestampPolicyId - Specifies the timestamp policy identifier.
 * @property {PdfX509CertificateProperties} certificate - Specifies the timestamp authority certificate.
 * @property {PdfSignerCertificate[]} signerCertificates - Specifies the timestamp signer certificate chain.
 */
export type TimestampInformation = {
    isDocumentTimestamp: boolean;
    isValid: boolean;
    timestampTime: Date;
    timestampPolicyId: string;
    certificate: PdfX509CertificateProperties;
    signerCertificates: PdfSignerCertificate[];
};
/**
 * Represents options used to customize digital signature validation.
 *
 * @property {Uint8Array[]} [trustedCertificates] Specifies the trusted certificates used for certificate chain validation.
 * @property {RevocationType} [revocationValidationType] Specifies the revocation validation method to use.
 * @property {Uint8Array} [ocspExternalData] Specifies external OCSP response data used when embedded OCSP information is unavailable.
 * @property {Uint8Array} [crlExternalData] Specifies external CRL data used when embedded CRL information is unavailable.
 * @property {string[]} [passwords] Specifies the passwords associated with the trusted certificate data, if required.
 */
export type PdfSignatureValidationOptions = {
    trustedCertificates?: Uint8Array[];
    revocationValidationType?: RevocationType;
    ocspExternalData?: Uint8Array;
    crlExternalData?: Uint8Array;
    passwords?: string[];
};
/**
 * Represents the properties of an X.509 certificate.
 *
 * @property {string} subject Specifies the full distinguished name (DN) of the certificate subject.
 * @property {string} issuer Specifies the full distinguished name (DN) of the certificate issuer.
 * @property {string} subjectSimpleName Specifies a Common Name (CN) component of the subject distinguished name.
 * @property {string} issuerSimpleName Specifies a  Common Name (CN) component of the issuer distinguished name.
 * @property {string} serialNumber Specifies the unique serial number assigned to the certificate by the issuing authority.
 * @property {Date} validFrom Specifies the date and time from which the certificate is valid.
 * @property {Date} validTo Specifies the date and time until which the certificate remains valid.
 * @property {number} version Specifies the X.509 version of the certificate.
 * @property {string} signatureAlgorithm Specifies the signature algorithm used to sign the certificate.
 * @property {Uint8Array} issuerUniqueId Specifies the optional issuer unique identifier contained in the certificate.
 * @property {Uint8Array} subjectUniqueId Specifies the optional subject unique identifier contained in the certificate.
 */
export type PdfX509CertificateProperties = {
    subject: string;
    issuer: string;
    subjectSimpleName: string;
    issuerSimpleName: string;
    serialNumber: string;
    validFrom: Date;
    validTo: Date;
    version: number;
    signatureAlgorithm: string;
    issuerUniqueId: Uint8Array;
    subjectUniqueId: Uint8Array;
};
