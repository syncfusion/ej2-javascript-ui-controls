import { PdfBarcodeSymbology, DigestAlgorithm, CryptographicStandard, PdfTemplateHorizontalAlignment, PdfTemplateVerticalAlignment, PdfTemplateLayerMode, PdfEncryptionType, PdfPermissionFlag, PdfCertificationFlag, RevocationStatus, SignatureStatus, RevocationType, PdfImageStyle, PdfLinkType, BorderOverlapStyle, PdfGridBorderType, PdfDashStyle, PdfSubjectAlternativeNameType, PdfQRVersion, PdfQRErrorCorrectionLevel, PdfQRInputMode, PdfDataMatrixEncoding, PdfDataMatrixSize, PdfBarcodeTextEncoding, Pdf417ErrorCorrectionLevel, PdfBarcodeTextAlignment, PdfBarcodeTextLocation, PdfTextAlignment, PdfShapeType, PdfLayoutType, PdfLayoutBreakType, Pdf3DActivationMode, Pdf3DDeactivationMode, Pdf3DAnimationType, Pdf3DRenderStyle, Pdf3DLightingStyle, Pdf3DProjectionType, PdfPrinterMarkOrientation, DataFormat, PdfPageOrientation, PdfRotationAngle } from './enumerator';
import { PdfFont } from './fonts/pdf-standard-font';
import { PdfStringFormat } from './fonts/pdf-string-format';
import { PdfBrush, PdfPen } from './graphics/pdf-graphics';
import { PdfImage } from './graphics/images/pdf-image';
import { PdfLayoutFormat } from './graphics/pdf-layouter';
import { PdfPageTemplateElement } from './graphics/pdf-page-template-element';
import { PdfTemplate } from './graphics/pdf-template';
import { PdfPage, PdfDestination } from './pdf-page';
import { PdfBitmap } from './graphics/images/pdf-bitmap';
import { PdfPath } from './graphics/pdf-path';
import { PdfCustomMetadata } from './xmp/pdf-custom-metadata';
import { PdfXmpMetadata } from './xmp/pdf-xmp-metadata';
import { PdfAnnotation } from './annotations/annotation';
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
/**
 * Represents four-sided padding values, in points, applied inside a `PdfGrid` cell border.
 *
 * @property {number} left - Optional left padding.
 * @property {number} right - Optional right padding.
 * @property {number} top - Optional top padding.
 * @property {number} bottom - Optional bottom padding.
 */
export type PdfPaddings = {
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
};

/**
 * Specifies the source-column mapping for a `PdfGrid`.
 *
 * @property {string} field - Source property name.
 * @property {string} headerText - Header text; defaults to `field`.
 * @property {number} width - Column width, in points.
 * @property {PdfGridColumnStyle} style - Default column style.
 */
export type PdfColumnInformation = {
    field: string;
    headerText?: string;
    width?: number;
    style?: PdfGridColumnStyle;
};
/**
 * Represents the pen settings used to draw a grid border side.
 *
 * @property {PdfColor} color - Optional color used to draw the border line.
 * @property {PdfDashStyle} style - Optional dash style applied to the border line.
 * @property {number} dashOffset - Optional starting offset for the dash pattern.
 * @property {number[]} dashPattern - Optional custom dash pattern that defines alternating dash and gap lengths.
 */
export type PdfGridPen = {
    color?: PdfColor;
    style?: PdfDashStyle;
    dashOffset?: number;
    dashPattern?: number[];
};
/**
 * Represents side-specific border settings for a `PdfGrid`.
 *
 * Individual side definitions override any lower-precedence border settings
 * applied at the grid, row, column, or cell level.
 *
 * @property {number} width - Optional border line width applied to the specified sides.
 * @property {PdfGridPen} left - Optional pen settings for the left border.
 * @property {PdfGridPen} right - Optional pen settings for the right border.
 * @property {PdfGridPen} top - Optional pen settings for the top border.
 * @property {PdfGridPen} bottom - Optional pen settings for the bottom border.
 */
export type PdfGridBorderPen = {
    width?: number;
    left?: PdfGridPen;
    right?: PdfGridPen;
    top?: PdfGridPen;
    bottom?: PdfGridPen;
};

/**
 * Represents the border configuration for a `PdfGrid`.
 *
 * Allows selection of the border type and customization of
 * individual border sides through a side-aware border pen.
 *
 * @property {PdfGridBorderType} type - Optional border rendering type to be applied to the grid.
 * @property {PdfGridBorderPen} pen - Optional side-aware pen settings used to draw the grid borders.
 */
export type PdfGridBorder = {
    type?: PdfGridBorderType;
    pen?: PdfGridBorderPen;
};
/**
 * Specifies the default style of a `PdfGrid` column.
 *
 * @property {PdfPen | PdfGridBorderPen} border - Cell border.
 * @property {PdfPaddings} padding - Cell padding.
 * @property {PdfBrush | PdfBackgroundImage} background - Cell background (brush or background image).
 * @property {PdfTextProperties} textProperties - Text style.
 * @property {PdfImageProperties} imageProperties - Image style.
 */
export type PdfGridColumnStyle = {
    border?: PdfPen | PdfGridBorderPen;
    padding?: PdfPaddings;
    background?: PdfBrush | PdfBackgroundImage;
    textProperties?: PdfTextProperties;
    imageProperties?: PdfImageProperties;
};
/**
 * Specifies the default style of a `PdfGrid` row.
 *
 * @property {PdfPen | PdfGridBorderPen} border - Row border.
 * @property {PdfPaddings} padding - Row padding.
 * @property {PdfBrush | PdfBackgroundImage} background - Row background (brush or background image).
 * @property {PdfTextProperties} textProperties - Text style.
 * @property {PdfImageProperties} imageProperties - Image style.
 */
export type PdfGridRowStyle = {
    border?: PdfPen | PdfGridBorderPen;
    padding?: PdfPaddings;
    background?: PdfBrush | PdfBackgroundImage;
    textProperties?: PdfTextProperties;
    imageProperties?: PdfImageProperties;
};
/**
 * Represents text-rendering properties for `PdfGrid` cell content.
 *
 * @property {PdfFont} font - Optional rendering font.
 * @property {PdfBrush} color - Optional text brush.
 * @property {PdfTemplateHorizontalAlignment} horizontalAlignment - Optional horizontal text alignment.
 * @property {PdfTemplateVerticalAlignment} verticalAlignment - Optional vertical text alignment.
 */
export type PdfTextProperties = {
    font?: PdfFont;
    color?: PdfBrush;
    horizontalAlignment?: PdfTemplateHorizontalAlignment;
    verticalAlignment?: PdfTemplateVerticalAlignment;
};
/**
 * Represents image-rendering properties for `PdfGrid` cell content.
 *
 * @property {number} width - Optional finite positive width.
 * @property {number} height - Optional finite positive height.
 * @property {PdfTemplateHorizontalAlignment} horizontalAlignment - Optional horizontal image alignment.
 * @property {PdfTemplateVerticalAlignment} verticalAlignment - Optional vertical image alignment.
 * @property {PdfImageStyle} fitType - Optional image fit mode.
 */
export type PdfImageProperties = {
    width?: number;
    height?: number;
    horizontalAlignment?: PdfTemplateHorizontalAlignment;
    verticalAlignment?: PdfTemplateVerticalAlignment;
    fitType?: PdfImageStyle;
};
/**
 * Represents a background image configuration for a `PdfGrid` cell.
 *
 * @property {PdfImage} image - The background image to render.
 * @property {PdfImageProperties} imageProperties - Optional rendering properties.
 */
export type PdfBackgroundImage = {
    image: PdfImage;
    imageProperties?: PdfImageProperties;
};
/**
 * Defines optional layout behavior for a `PdfGrid` rendered inside a parent `PdfGridCell`.
 *
 * @property {boolean} allowPagination - Optional flag indicating whether the child grid may continue across pages.
 * @property {boolean} clipToCell - Optional flag indicating whether child-grid drawing is clipped to the visible content bounds of the parent cell. Defaults to true.
 * @property {number} maximumDepth - Optional maximum permitted child-grid nesting depth. Recommended default is 8.
 */
export type PdfNestedGridSettings = {
    allowPagination?: boolean;
    clipToCell?: boolean;
    maximumDepth?: number;
};
/**
 * Represents cell layout and appearance for a `PdfGrid` cell.
 *
 * @property {PdfPen | PdfGridBorderPen} border - Optional cell border.
 * @property {PdfPaddings} padding - Optional cell padding.
 * @property {number} rowSpan - Optional positive finite row span.
 * @property {number} columnSpan - Optional positive finite column span.
 * @property {PdfBrush | PdfBackgroundImage} background - Optional cell background (brush or background image).
 * @property {PdfTextProperties} textProperties - Optional text-rendering properties.
 * @property {PdfImageProperties} imageProperties - Optional image-rendering properties.
 * @property {PdfNestedGridSettings} nestedGrid - Optional layout behavior when the cell value is a PdfGrid.
 */
export type PdfGridCellStyle = {
    border?: PdfPen | PdfGridBorderPen;
    padding?: PdfPaddings;
    rowSpan?: number;
    columnSpan?: number;
    background?: PdfBrush | PdfBackgroundImage;
    textProperties?: PdfTextProperties;
    imageProperties?: PdfImageProperties;
    nestedGrid?: PdfNestedGridSettings;
};
/**
 * Represents grid-level style for a `PdfGrid`.
 *
 * @property {PdfPen | PdfGridBorder} border - Optional grid-level border.
 * @property {number} space - Optional grid-level spacing applied equally to all four sides, in points.
 * @property {PdfPaddings} padding - Optional grid-level padding.
 * @property {PdfBrush | PdfBackgroundImage} background - Optional grid-level background (brush or background image).
 */
export type PdfGridStyle = {
    border?: PdfPen | PdfGridBorder;
    space?: number;
    padding?: PdfPaddings;
    background?: PdfBrush | PdfBackgroundImage;
    borderOverlapStyle?: BorderOverlapStyle;
    textProperties?: PdfTextProperties;
    imageProperties?: PdfImageProperties;
};
/**
 * Represents an explicit URI, document, or file link action for a `PdfGrid` cell.
 *
 * @property {PdfLinkType} type - The link action type.
 * @property {string} uri - The target URI. Applicable when `type` is `PdfLinkType.externalLink`.
 * @property {string} file - The target file path. Applicable when `type` is `PdfLinkType.file`.
 * @property {PdfDestination} destination - The target destination. Applicable when `type` is `PdfLinkType.internalLink`.
 */
export type PdfLink = {
    type: PdfLinkType;
    uri?: string;
    file?: string;
    destination?: PdfDestination;
};
/**
 * Represents one cell within a `PdfGridRow`.
 *
 * @property {any} value - Optional cell content. Supported values follow the approved content contract.
 * @property {PdfGridCellStyle} style - Optional cell-level style.
 * @property {PdfLink} link - Optional explicit cell link.
 */
export type PdfGridCell = {
    value?: any; // eslint-disable-line
    style?: PdfGridCellStyle;
    link?: PdfLink;
};
/**
 * Represents one row within a `PdfGrid`.
 *
 * @property {number} height - Optional finite positive row height, in points. Measured automatically when omitted.
 * @property {PdfGridRowStyle} style - Optional row-level style.
 * @property {PdfGridCell[]} cells - Required ordered cells.
 */
export type PdfGridRow = {
    height?: number;
    style?: PdfGridRowStyle;
    cells: PdfGridCell[];
};
/**
 * Represents the result of a page-based `PdfGrid.draw` operation.
 *
 * @property {PdfPage} page - The page on which rendering completed.
 * @property {PdfGridRow[]} remainingResult - Optional complete logical record rows not rendered.
 */
export type PdfGridLayoutResult = {
    readonly page: PdfPage;
    readonly bounds: Rectangle;
    readonly remainingResult?: PdfGridRow[];
};
/**
 * Represents the finalized, resolved bounds and text of a single cell used only during rendering.
 *
 * @private
 */
export type _PdfGridRenderCell = {
    bounds: Rectangle;
    text: string;
}
/**
 * Represents the resolved visual descriptor for a single built-in style value.
 *
 * @private
 */
export type _PdfBuiltInDescriptor = {
    borderColor: { r: number; g: number; b: number };
    borderWidth: number;
    headerBackground: { r: number; g: number; b: number } | null;
    bandBackground: { r: number; g: number; b: number } | null;
    headerTextColor: { r: number; g: number; b: number } | null;
    cellSpacingTop?: number;
    cellSpacingBottom?: number;
    cellSpacingLeft?: number;
    cellSpacingRight?: number;
    cellPaddingLeft?: number;
    cellPaddingRight?: number;
    cellPaddingTop?: number;
    cellPaddingBottom?: number;
}
/**
 * Represents a row range rendered on a PDF page.
 *
 * @private
 */
export type _PageSlice = {
    startRow: number;
    endRow: number;
    page: PdfPage;
    drawBounds: Rectangle;
    repeatHeaderCount: number;
};
/**
 * Represents the resolved layout of a grid cell.
 *
 * @private
 */
export type _CellLayout = {
    cellBounds: Rectangle;
    contentBounds: Rectangle;
    border: PdfPen | PdfGridBorderPen;
    background: PdfBrush | PdfBackgroundImage | null;
    cell: PdfGridCell;
    row: PdfGridRow;
    isHeader: boolean;
    colIndex: number;
};
export type _segmentPlan = {
    startCol: number;
    endCol: number;
    width: number;
    isFirstSegment: boolean;
    isLastSegment: boolean;
    validSpanAnchors: Set<number>;
    headers: Array<{
        rowIndex: number;
        cells: Array<{
            cellIndex: number;
            colStart: number;
            colEnd: number;
            colSpan: number;
            rowSpan: number;
            value: object | string | number | boolean | null;
            style: PdfGridColumnStyle;
            bounds: Rectangle;
            contentBounds: Rectangle;
        }>;
        bounds: Rectangle;
    }>;
    logicalRowIndices: Map<number, number>;
}
/**
 * Represents the Border Source of a cell.
 *
 * @private
 */
export type _PdfGridBorderSource = PdfPen | PdfGridBorder | PdfGridBorderPen;
/**
 * Represents the Resolved grid Border of a cell.
 *
 * @private
 */
export type _PdfResolvedGridBorder = {
    left: PdfPen; right: PdfPen; top: PdfPen; bottom: PdfPen;
    renderMode: 'rectangle' | 'lines' | 'none';
};
/**
 * Represents a Subject Alternative Name entry of an X.509 certificate.
 *
 * @property {PdfSubjectAlternativeNameType} type The general-name type.
 * @property {string} value The decoded general-name value.
 */
export type PdfSubjectAlternativeName = {
    /**
     * Specifies the general-name type.
     */
    type: PdfSubjectAlternativeNameType;
    /**
     * Specifies the decoded general-name value.
     */
    value: string;
};
/**
 * Represents a CRL Distribution Point location of an X.509 certificate.
 *
 * @property {string} type The distribution-point location type.
 * @property {string} value The distribution-point location.
 */
export type PdfCrlDistributionPoint = {
    /**
     * Specifies the distribution-point location type.
     */
    type: string;
    /**
     * Specifies the distribution-point location.
     */
    value: string;
};
/**
 * Represents an Authority Information Access entry of an X.509 certificate.
 *
 * @property {string} method The readable access-method name.
 * @property {string} uri The access-location URI.
 */
export type PdfAuthorityInformationAccess = {
    /**
     * Specifies the readable access-method name.
     */
    method: string;
    /**
     * Specifies the access-location URI.
     */
    uri: string;
};
/**
 * Specifies the common optional settings for bidimensional barcodes.
 *
 * @property {number} xDimension - Module dimension in points. Defaults to 1.
 * @property {PdfBarcodeQuietZone} quietZone - Quiet zone around the barcode. Defaults to { all: 0 }.
 * @property {PdfColor} foreColor - Color of the dark modules. Defaults to black.
 * @property {PdfColor} backColor - Color of the light modules and background. Defaults to white.
 *
 */
export type PdfBidimensionalBarcodeOptions = {
    xDimension?: number;
    quietZone?: PdfBarcodeQuietZone;
    foreColor?: PdfColor;
    backColor?: PdfColor;
};
/**
 * Specifies the optional constructor settings for a Data Matrix barcode.
 *
 * @property {PdfDataMatrixEncoding} encoding - Data Matrix encoding mode.
 * @property {PdfDataMatrixSize} symbolSize - Data Matrix symbol size.
 * @property {PdfBarcodeTextEncoding} textEncoding - Text encoding used to convert the content into bytes.
 *
 */
export type PdfDataMatrixBarcodeOptions = PdfBidimensionalBarcodeOptions & {
    encoding?: PdfDataMatrixEncoding;
    symbolSize?: PdfDataMatrixSize;
    textEncoding?: PdfBarcodeTextEncoding;
};
/**
 * Specifies the quiet zone (margin) around a barcode symbol.
 *
 * @property {number} all - Quiet zone on all sides; overridden by specific sides if provided.
 * @property {number} left - Left quiet zone width.
 * @property {number} right - Right quiet zone width.
 * @property {number} top - Top quiet zone width.
 * @property {number} bottom - Bottom quiet zone width.
 *
 */
export type PdfBarcodeQuietZone = {
    all?: number;
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
};
/**
 * Specifies the optional constructor settings for a PDF417 barcode.
 *
 * @property {Pdf417ErrorCorrectionLevel} errorCorrectionLevel - PDF417 error-correction level.
 * @property {number} barHeight - The height of each bar (row). Default is 0, which automatically calculates the height from xDimension.
 *
 */
export type Pdf417BarcodeOptions = PdfBidimensionalBarcodeOptions & {
    errorCorrectionLevel?: Pdf417ErrorCorrectionLevel;
    barHeight?: number;
};
/**
 * Specifies the optional constructor settings for a QR Code barcode.
 *
 * @property {PdfQRInputMode} inputMode - QR Code input mode.
 * @property {PdfQRErrorCorrectionLevel} errorCorrectionLevel - Error-correction level.
 * @property {PdfQRVersion} version - QR Code version.
 * @property {PdfBarcodeTextEncoding} textEncoding - Text encoding used to convert byte segments.
 * @property {PdfQRBarcodeLogo} logo - Logo displayed at the center of the QR Code.
 *
 */
export type PdfQRBarcodeOptions = PdfBidimensionalBarcodeOptions & {
    inputMode?: PdfQRInputMode;
    errorCorrectionLevel?: PdfQRErrorCorrectionLevel;
    version?: PdfQRVersion;
    textEncoding?: PdfBarcodeTextEncoding;
    logo?: PdfQRBarcodeLogo;
};
/**
 * Represents an optional image placed at the center of a QR Code.
 *
 * ```typescript
 * // Create a new PDF document
 * let document: PdfDocument = new PdfDocument();
 * // Add a page to the document
 * let page: PdfPage = document.addPage();
 * // Create QR barcode with centered logo onto the symbol
 * let barcode: PdfQRBarcode = new PdfQRBarcode('https://example.com/verify/12345', {
 *     errorCorrectionLevel: PdfQRErrorCorrectionLevel.High,
 *     logo: {
 *         data: logoBytes,
 *         size: {
 *             width: 32,
 *             height: 32
 *         },
 *         padding: 3
 *     }
 * });
 * // Draw the barcode on the page
 * barcode.draw(page, { x: 40, y: 40, width: 32, height: 32 });
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 *
 * @property {PdfBitmap | Uint8Array} data - The logo image as a `PdfBitmap` or raw supported image bytes.
 * @property {Size} size - Maximum logo size in PDF user-space units.
 * @property {number} padding - Padding around the logo in PDF user-space units. Default: `0`.
 * @property {boolean} preserveAspectRatio - Indicates whether to preserve the source image aspect ratio. Default: `true`.
 * @property {boolean} strictValidation - Indicates whether to reject unsafe logo coverage or protected-pattern overlap. Default: `true`.
 */
export type PdfQRBarcodeLogo = {
    data: PdfBitmap | Uint8Array;
    size?: Size;
    padding?: number;
    preserveAspectRatio?: boolean;
    strictValidation?: boolean;
};
/**
 * Resolved output layout values used by rendering.
 *
 * @private
 */
export type _DmLayout = {
    zone: { left: number; top: number; right: number; bottom: number };
    moduleSize: number;
    totalWidth: number;
    totalHeight: number;
    offsetX: number;
    offsetY: number;
};

/**
 * Immutable result of a Data Matrix encode operation.
 *
 * @private
 */
export type _DataMatrixEncodeResult = {
    readonly rows: number;
    readonly columns: number;
    readonly dataCodewordCount: number;
    readonly errorCodewordCount: number;
    readonly matrix: ReadonlyArray<ReadonlyArray<boolean>>;
};
/**
 * Internal symbol geometry and capacity definition (ISO/IEC 16022 ECC 200).
 * `matrixWidth` and `matrixHeight` describe one data region; the final symbol
 * multiplies them by the region counts and adds the finder borders.
 *
 * @private
 */
export type _DmSymbolInfo = {
    rectangular: boolean;
    dataCapacity: number;
    errorCodewords: number;
    matrixWidth: number;
    matrixHeight: number;
    dataRegions: number;
    rsBlockData: number;
    rsBlockError: number;
};
/**
 * Describes a run of bytes with an associated compaction mode.
 *
 * @private
 */
export type _Pdf417Segment = {
    bytes: Uint8Array;
    mode: 'text' | 'byte';
}
/**
 * Resolved quiet-zone values in graphics units.
 *
 * @private
 */
export type _Pdf417QuietZones = {
    left: number;
    right: number;
    top: number;
    bottom: number;
}
/**
 * Rows and data columns of a PDF417 symbol.
 *
 * @private
 */
export type _Pdf417Dimensions = {
    rows: number;
    columns: number;
}
/**
 * Left and right row indicator codewords of a symbol row.
 *
 * @private
 */
export type _Pdf417RowIndicators = {
    left: number;
    right: number;
}
/**
 * A single encoded segment: mode indicator, character count and data bits.
 *
 * @private
 */
export type _QrSegment = {
    mode: number;
    count: number;
    bits: number[];
}
/**
 * Immutable result of a QR encode operation: the resolved version, the module
 * count per side, the selected data mask and the final module matrix.
 *
 * @private
 */
export type _QrEncodeResult = {
    readonly version: number;
    readonly size: number;
    readonly maskPattern: number;
    readonly matrix: ReadonlyArray<ReadonlyArray<boolean>>;
};
/**
 * Resolved output layout values used by rendering and logo validation.
 *
 * @private
 */
export type _QrLayout = {
    zone: { left: number; top: number; right: number; bottom: number };
    moduleSize: number;
    totalWidth: number;
    totalHeight: number;
    offsetX: number;
    offsetY: number;
};
/**
 * Specifies the barcode settings of a barcode form field.
 *
 * @property {PdfBarcodeSymbology} symbology - The barcode symbology.
 * @property {number} [xDimention] - Optional module (x-dimension) size in points. Values of 1 or less fall back to 4.
 * @property {Pdf417ErrorCorrectionLevel | PdfQRErrorCorrectionLevel} [errorCorrectionLevel] - Optional error correction level.
 * Use `Pdf417ErrorCorrectionLevel` for PDF417 and `PdfQRErrorCorrectionLevel` for QR Code. Ignored for Data Matrix.
 */
export type PdfBarcodeOptions = {
    symbology: PdfBarcodeSymbology;
    xDimention?: number;
    errorCorrectionLevel?: Pdf417ErrorCorrectionLevel | PdfQRErrorCorrectionLevel;
};
/**
 * Specifies the shared optional constructor settings for all supported barcodes.
 *
 * @property {PdfColor} foreColor - Barcode foreground color. Defaults to black.
 * @property {PdfColor} backColor - Barcode background color. Defaults to white.
 * @property {PdfBarcodeQuietZone} quietZone - Quiet-zone margins. Defaults to { all: 0 }.
 *
 */
export type PdfBarcodeOptionsBase = {
    foreColor?: PdfColor;
    backColor?: PdfColor;
    quietZone?: PdfBarcodeQuietZone;
};
/**
 * Specifies the optional constructor settings for unidimensional barcodes.
 *
 * @property {number} narrowBarWidth - Width, in points, of the narrowest bar. Defaults to 1.
 * @property {number} barHeight - Bar height in points. 0 (default) enables automatic height.
 * @property {PdfColor} textColor - Human-readable text color. Defaults to black.
 * @property {number} textGap - Gap, in points, between bars and text. Defaults to 5.
 * @property {boolean} encodeStartStopSymbols - Whether start/stop symbols are displayed in the text. Defaults to false.
 * @property {PdfFont} font - Font used for human-readable text.
 * @property {PdfBarcodeTextAlignment} textAlignment - Horizontal text alignment. Defaults to Center.
 * @property {PdfBarcodeTextLocation} textLocation - Text location relative to the bars. Defaults to Bottom.
 *
 */
export type PdfUnidimensionalBarcodeOptions = PdfBarcodeOptionsBase & {
    narrowBarWidth?: number;
    barHeight?: number;
    textColor?: PdfColor;
    textGap?: number;
    encodeStartStopSymbols?: boolean;
    font?: PdfFont;
    textAlignment?: PdfBarcodeTextAlignment;
    textLocation?: PdfBarcodeTextLocation;
};
/**
 * Immutable logical plan of a unidimensional symbol.
 *
 * @private
 */
export type _UniPlan = {
    /** Alternating bar/space widths in modules, starting with a bar. */
    readonly runs: ReadonlyArray<number>;
    /** Total module count (sum of runs). */
    readonly moduleCount: number;
    /** Human-readable text, independent from the encoded bars. */
    readonly displayText: string;
};
/**
 * Resolved geometry of a symbol, calculated before any graphics operation.
 *
 * @private
 */
export type _UniGeometry = {
    readonly occupied: Rectangle;
    readonly bars: ReadonlyArray<Rectangle>;
    readonly text: { value: string, bounds: Rectangle } | null;
    readonly moduleWidth: number;
};
/**
 * Resolved, validated settings snapshot used while drawing a unidimensional barcode.
 *
 * @private
 */
export type _UniSettings = {
    narrow: number;
    barHeight: number;
    gap: number;
    location: PdfBarcodeTextLocation;
    alignment: PdfTextAlignment;
    left: number;
    right: number;
    top: number;
    bottom: number;
    foreColor: PdfColor;
    backColor: PdfColor;
    textColor: PdfColor;
    font: PdfFont;
};

/**
 * Maps a Codabar symbol to its element widths.
 *
 * @private
 */
export type _CodabarPatternMap = {
    readonly [symbol: string]: string;
};

/**
 * Maps a Code11 symbol to its element widths.
 *
 * @private
 */
export type _Code11PatternMap = {
    readonly [symbol: string]: string;
};

/**
 * Maps a Code 93 symbol to its element widths.
 *
 * @private
 */
export type _Code93PatternMap = {
    readonly [symbol: string]: string;
};
/**
 * Represents a shape element with drawing style and pagination settings.
 *
 * @property {PdfShape} shape The shape geometry to draw.
 * @property {PdfPen} pen The optional pen used to stroke the shape.
 * @property {PdfBrush} brush The optional brush used to fill the shape.
 * @property {{ layoutType?: PdfLayoutType; breakType?: PdfLayoutBreakType; paginationBounds?: Rectangle }} layoutFormat The optional settings used to control shape pagination.
 */
export type PdfShapeElement = {
    shape: PdfShape;
    pen?: PdfPen;
    brush?: PdfBrush;
    layoutFormat?: {
        layoutType?: PdfLayoutType;
        breakType?: PdfLayoutBreakType;
        paginationBounds?: Rectangle;
    };
};
/**
 * Represents a supported shape model.
 */
export type PdfShape = PdfLineShape | PdfBezierCurveShape | PdfArcShape | PdfRectangleShape |
PdfRoundedRectangleShape | PdfEllipseShape | PdfPieShape | PdfPolygonShape | PdfPathShape;
/**
 * Represents a line shape.
 *
 * @property {PdfShapeType.Line} type The line shape type.
 * @property {Point} start The starting point of the line.
 * @property {Point} end The ending point of the line.
 */
export type PdfLineShape = {
    type: PdfShapeType.Line;
    start: Point;
    end: Point;
};
/**
 * Represents a cubic Bezier curve shape.
 *
 * @property {PdfShapeType.BezierCurve} type The Bezier curve shape type.
 * @property {Point} start The starting point of the Bezier curve.
 * @property {Point} first The first control point of the Bezier curve.
 * @property {Point} second The second control point of the Bezier curve.
 * @property {Point} end The ending point of the Bezier curve.
 */
export type PdfBezierCurveShape = {
    type: PdfShapeType.BezierCurve;
    start: Point;
    first: Point;
    second: Point;
    end: Point;
};
/**
 * Represents an arc shape.
 *
 * @property {PdfShapeType.Arc} type The arc shape type.
 * @property {Rectangle} bounds The bounding rectangle of the arc.
 * @property {number} startAngle The starting angle of the arc in degrees.
 * @property {number} sweepAngle The sweep angle of the arc in degrees.
 */
export type PdfArcShape = {
    type: PdfShapeType.Arc;
    bounds: Rectangle;
    startAngle: number;
    sweepAngle: number;
};
/**
 * Represents a rectangle shape.
 *
 * @property {PdfShapeType.Rectangle} type The rectangle shape type.
 * @property {Rectangle} bounds The bounds of the rectangle.
 */
export type PdfRectangleShape = {
    type: PdfShapeType.Rectangle;
    bounds: Rectangle;
};
/**
 * Represents a rounded rectangle shape.
 *
 * @property {PdfShapeType.RoundedRectangle} type The rounded rectangle shape type.
 * @property {Rectangle} bounds The bounds of the rounded rectangle.
 * @property {number} radius The corner radius of the rounded rectangle.
 */
export type PdfRoundedRectangleShape = {
    type: PdfShapeType.RoundedRectangle;
    bounds: Rectangle;
    radius: number;
};
/**
 * Represents an ellipse shape.
 *
 * @property {PdfShapeType.Ellipse} type The ellipse shape type.
 * @property {Rectangle} bounds The bounding rectangle of the ellipse.
 */
export type PdfEllipseShape = {
    type: PdfShapeType.Ellipse;
    bounds: Rectangle;
};
/**
 * Represents a pie shape.
 *
 * @property {PdfShapeType.Pie} type The pie shape type.
 * @property {Rectangle} bounds The bounding rectangle of the pie shape.
 * @property {number} startAngle The starting angle of the pie shape in degrees.
 * @property {number} sweepAngle The sweep angle of the pie shape in degrees.
 */
export type PdfPieShape = {
    type: PdfShapeType.Pie;
    bounds: Rectangle;
    startAngle: number;
    sweepAngle: number;
};
/**
 * Represents a polygon shape.
 *
 * @property {PdfShapeType.Polygon} type The polygon shape type.
 * @property {Point[]} points The points that define the polygon.
 */
export type PdfPolygonShape = {
    type: PdfShapeType.Polygon;
    points: Point[];
};
/**
 * Represents a shape defined by an existing PDF path.
 *
 * @property {PdfShapeType.Path} type The path shape type.
 * @property {PdfPath} path The PDF path containing the shape geometry.
 */
export type PdfPathShape = {
    type: PdfShapeType.Path;
    path: PdfPath;
};
/**
 * Represents the internal state used while laying out a shape across pages.
 *
 * @private
 * @property {PdfShapeElement} element The shape element being laid out.
 * @property {PdfPage} firstPage The page from which layout begins.
 * @property {PdfPage} currentPage The page currently used for layout.
 * @property {Rectangle} currentBounds The available bounds on the current page.
 * @property {Rectangle} shapeBounds The remaining shape bounds to draw.
 * @property {PdfLayoutFormat} format The layout format used for pagination.
 * @property {Rectangle} resultBounds The bounds occupied by the latest layout operation.
 * @property {boolean} isEnd Indicates whether shape layout is complete.
 */
export type _ShapeLayoutContext = {
    element: PdfShapeElement;
    firstPage: PdfPage;
    currentPage: PdfPage;
    currentBounds: Rectangle;
    shapeBounds: Rectangle;
    format: PdfLayoutFormat;
    resultBounds: Rectangle;
    isEnd: boolean;
};
/**
 * Represents a 3D view configuration for Pdf3DAnnotation.
 *
 * @property {string} [name] - The display name of the 3D view.
 * @property {string} [internalName] - The internal name used to identify the 3D view.
 * @property {number[]} [cameraToWorld] - The camera-to-world transformation matrix.
 * @property {number} [centerOfOrbit] - The distance from the camera to the center of orbit.
 * @property {PdfColor} [background] - The background color of the 3D view.
 * @property {Pdf3DProjectionType} [projection] - The projection type used for the 3D view.
 * @property {Pdf3DRenderMode} [renderMode] - The rendering mode used for the 3D artwork.
 * @property {Pdf3DLightingStyle} [lightingStyle] - The lighting style used for the 3D artwork.
 */
export type Pdf3DView = {
    name?: string;
    internalName?: string;
    cameraToWorld?: number[];
    centerOfOrbit?: number;
    background?: PdfColor;
    projection?: Pdf3DProjectionType;
    renderMode?: Pdf3DRenderMode;
    lightingStyle?: Pdf3DLightingStyle;
};
/**
 * Represents the activation settings for Pdf3DAnnotation.
 *
 * @property {Pdf3DActivationMode} [mode] - The event that activates the 3D annotation.
 * @property {Pdf3DDeactivationMode} [deactivationMode] - The event that deactivates the 3D annotation.
 * @property {boolean} [showToolbar] - Indicates whether the 3D toolbar is displayed when activated.
 * @property {boolean} [showNavigationPane] - Indicates whether the 3D navigation pane is displayed.
 */
export type Pdf3DActivation = {
    mode?: Pdf3DActivationMode;
    deactivationMode?: Pdf3DDeactivationMode;
    showToolbar?: boolean;
    showNavigationPane?: boolean;
};
/**
 * Represents the animation settings for Pdf3DAnnotation.
 *
 * @property {Pdf3DAnimationType} [type] - The animation playback type used for the 3D artwork.
 * @property {number} [playCount] - The number of times the 3D animation is played.
 * @property {number} [timeMultiplier] - The multiplier applied to the 3D animation playback speed.
 */
export type Pdf3DAnimation = {
    type?: Pdf3DAnimationType;
    playCount?: number;
    timeMultiplier?: number;
};
/**
 * Represents the color-bar options for a printer-mark annotation.
 *
 * @property {number} [patchWidth] - The width of each color patch.
 * @property {number} [patchHeight] - The height of each color patch.
 * @property {boolean} [includeProcessColors] - Indicates whether process colors are included.
 * @property {boolean} [includeGrayScale] - Indicates whether grayscale patches are included.
 * @property {ReadonlyArray<number>} [graySteps] - The grayscale percentage values.
 * @property {PdfPrinterMarkOrientation} [orientation] - The color-bar orientation.
 */
export type PdfPrinterMarkColorBarOptions = {
    patchWidth?: number;
    patchHeight?: number;
    includeProcessColors?: boolean;
    includeGrayScale?: boolean;
    graySteps?: ReadonlyArray<number>;
    orientation?: PdfPrinterMarkOrientation;
};
/**
 * Represents the fold-mark options for a printer-mark annotation.
 *
 * @property {ReadonlyArray<number>} [positions] - The relative fold-mark positions.
 * @property {PdfPrinterMarkOrientation} [orientation] - The fold-mark orientation.
 * @property {number} [lineLength] - The length of each fold-mark line.
 * @property {boolean} [dashed] - Indicates whether the fold-mark lines are dashed.
 */
export type PdfPrinterMarkFoldOptions = {
    positions?: ReadonlyArray<number>;
    orientation?: PdfPrinterMarkOrientation;
    lineLength?: number;
    dashed?: boolean;
};
/**
 * Represents the page-information options for a printer-mark annotation.
 *
 * @property {string} [text] - The page-information text.
 * @property {boolean} [includePageNumber] - Indicates whether the page number is included.
 * @property {boolean} [includeDate] - Indicates whether the current date is included.
 * @property {number} [fontSize] - The page-information font size.
 * @property {PdfColor} [color] - The page-information text color.
 */
export type PdfPrinterMarkPageInformationOptions = {
    text?: string;
    includePageNumber?: boolean;
    includeDate?: boolean;
    fontSize?: number;
    color?: PdfColor;
};
/**
 * Represents a movie time value.
 *
 * @property {number} value - The movie time value.
 * @property {number} [timeScale] - The number of time units per second.
 */
export type PdfMovieTime = {
    value: number;
    timeScale?: number;
};
/**
 * Represents the rendering settings for a 3D view.
 *
 * @property {Pdf3DRenderStyle} style - The rendering style.
 * @property {PdfColor} [auxiliaryColor] - The auxiliary rendering color.
 * @property {PdfColor} [faceColor] - The face rendering color.
 * @property {number} [opacity] - The rendering opacity.
 * @property {number} [creaseValue] - The angle used to determine edge creases.
 */
export type Pdf3DRenderMode = {
    style: Pdf3DRenderStyle;
    auxiliaryColor?: PdfColor;
    faceColor?: PdfColor;
    opacity?: number;
    creaseValue?: number;
};
/**
 * Represents the information about the PDF document.
 *
 * @property {string} title - The title of the PDF document.
 * @property {string} author - The author of the PDF document.
 * @property {string} subject - The subject of the PDF document.
 * @property {string} keywords - Keywords associated with the PDF document.
 * @property {string} creator - The application or tool that created the PDF.
 * @property {string} producer - The software that produced the PDF.
 * @property {string} language - The language of the PDF content.
 * @property {Date} creationDate - Indicates when the PDF document was originally created.
 * @property {Date} modificationDate - Indicates the most recent date the PDF document was modified.
 */
export type PdfDocumentInformation = {
    title?: string; // Specifies the title of the PDF document (optional)
    author?: string; // Specifies the author name of the PDF document. (optional)
    subject?: string; // Specifies the subject of the PDF document (optional)
    keywords?: string; // Specifies the keywords of the PDF document (optional)
    creator?: string; // Specifies the creator of the PDF document (optional)
    producer?: string; // Specifies the producer of the PDF document (optional)
    language?: string; // Specifies the language of the PDF document (optional)
    creationDate?: Date; // Specifies the creation date of the PDF document (optional)
    modificationDate?: Date; // Specifies the modification date of the PDF document (optional)
    xmpMetadata?: PdfXmpMetadata; // Specifies the metadata information of the PDF document (optional)
    customMetadata?: PdfCustomMetadata; // Specifies the custom metadata information of the PDF document (optional)
};
/**
 * Represents a form-field target identified by its fully qualified field name.
 *
 * @property {string} fieldName - The fully qualified name of the form field.
 */
export type PdfFieldTarget = {
    fieldName: string;
};
/**
 * Represents an annotation target identified by its annotation object.
 *
 * @property {PdfAnnotation} annotation - The annotation used as a Hide Action target.
 */
export type PdfAnnotationTarget = {
    annotation: PdfAnnotation;
};
/**
 * Represents a target supported by a PDF Hide Action.
 */
export type PdfHideTarget = PdfFieldTarget | PdfAnnotationTarget;
/**
 * Represents annotation export settings.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Sets export data format as JSON type to annotation export settings
 * let settings: PdfAnnotationExportSettings = new PdfAnnotationExportSettings();
 * // Set the data format defined in annotation export settings
 * settings.dataFormat = DataFormat.json;
 * // Export annotations to JSON format
 * let json: Uint8Array = document.exportAnnotations(settings);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfAnnotationExportSettings {
    /**
     * @private
     */
    _format: DataFormat = DataFormat.xfdf;
    _exportAppearance: boolean = false;
    /**
     * Gets the data format defined in annotation export settings.
     *
     * @returns {DataFormat} - Returns the data format.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Sets export data format as JSON type to annotation export settings
     * let settings: PdfAnnotationExportSettings = new PdfAnnotationExportSettings();
     * // Export annotations to JSON format
     * let json: Uint8Array = document.exportAnnotations(settings);
     * // Get the data format defined in annotation export settings
     * let dataFormat: DataFormat = settings.dataFormat;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get dataFormat(): DataFormat {
        return this._format;
    }
    /**
     * Sets the data format defined in annotation export settings.
     *
     * @param {DataFormat} format - Specifies the data format.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Sets export data format as JSON type to annotation export settings
     * let settings: PdfAnnotationExportSettings = new PdfAnnotationExportSettings();
     * // Set the data format defined in annotation export settings
     * settings.dataFormat = DataFormat.json;
     * // Export annotations to JSON format
     * let json: Uint8Array = document.exportAnnotations(settings);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set dataFormat(format: DataFormat) {
        this._format = format;
    }
    /**
     * Gets the boolean value indicating whether the appearance of a particular object can be exported or not.
     *
     * @returns {boolean} - Returns the boolean value.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Sets the annotation export settings with enabled export appearance.
     * let settings: PdfAnnotationExportSettings = new PdfAnnotationExportSettings();
     * // Export annotations to XFDF format
     * let xfdf: Uint8Array = document.exportAnnotations(settings);
     * // Get the boolean value indicating whether the appearance of a particular object can be exported or not
     * let appearance: boolean = settings.exportAppearance;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get exportAppearance(): boolean {
        return this._exportAppearance;
    }
    /**
     * Sets the boolean value indicating whether the appearance of a particular object can be exported or not.
     *
     * @param {boolean} value - The boolean value.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Sets the annotation export settings with enabled export appearance.
     * let settings: PdfAnnotationExportSettings = new PdfAnnotationExportSettings();
     * // Set the boolean value indicating whether the appearance of a particular object can be exported or not
     * settings.exportAppearance = true;
     * // Export annotations to XFDF format
     * let xfdf: Uint8Array = document.exportAnnotations(settings);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set exportAppearance(value: boolean) {
        this._exportAppearance = value;
    }
}
/**
 * Represents form fields export settings.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data);
 * // Sets the form field data export settings with output data format.
 * let settings: PdfFormFieldExportSettings = new PdfFormFieldExportSettings();
 * // Set the data format defined in form field export settings.
 * settings.dataFormat = DataFormat.json;
 * // Export form field to JSON format
 * let json: Uint8Array = document.exportFormData(settings);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfFormFieldExportSettings {
    /**
     * @private
     */
    _format: DataFormat = DataFormat.xfdf;
    /**
     * @private
     */
    _exportName: string = '';
    /**
     * @private
     */
    _asPerSpecification: boolean = true;
    /**
     * Gets the data format defined in form field export settings.
     *
     * @returns {DataFormat} - Returns the data format.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Sets the form field data export settings with output data format.
     * let settings: PdfFormFieldExportSettings = new PdfFormFieldExportSettings();
     * // Export form field to JSON format
     * let json: Uint8Array = document.exportFormData(settings);
     * // Get the data format defined in form field export settings
     * let dataFormat: DataFormat = settings.dataFormat;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get dataFormat(): DataFormat {
        return this._format;
    }
    /**
     * Sets the data format defined in form field export settings.
     *
     * @param {DataFormat} format - Specifies the data format.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Sets the form field data export settings with output data format.
     * let settings: PdfFormFieldExportSettings = new PdfFormFieldExportSettings();
     * // Set the data format defined in form field export settings.
     * settings.dataFormat = DataFormat.json;
     * // Export form field to JSON format
     * let json: Uint8Array = document.exportFormData(settings);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set dataFormat(format: DataFormat) {
        this._format = format;
    }
    /**
     * Gets the export name defined in form field export settings.
     *
     * @returns {string} - Returns the string value.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Sets the form field data export settings with export name.
     * let settings: PdfFormFieldExportSettings = new PdfFormFieldExportSettings();
     * // Export form field to JSON format
     * let json: Uint8Array = document.exportFormData(settings);
     * // Get the export name defined in form field export settings
     * let name: boolean = settings.exportName;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get exportName(): string {
        return this._exportName;
    }
    /**
     * Sets the export name defined in form field export settings.
     *
     * @param {string} name - Specifies the export name of the form.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Sets the form field data export settings with export name.
     * let settings: PdfFormFieldExportSettings = new PdfFormFieldExportSettings();
     * // Set the export name defined in form field export settings.
     * settings.exportName = 'JobApplication'.
     * // Export form field to JSON format
     * let json: Uint8Array = document.exportFormData(settings);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set exportName(name: string) {
        this._exportName = name;
    }
    /**
     * Gets the boolean value indicating whether the data in a form field can be exported based on a certain specification.
     *
     * @returns {boolean} - Returns the boolean value.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Sets the boolean value indicating whether the data in a form field can be exported based on a certain specification.
     * let settings: PdfFormFieldExportSettings = new PdfFormFieldExportSettings();
     * // Export form field to JSON format
     * let json: Uint8Array = document.exportFormData(settings);
     * // Get the boolean value indicating whether the data in a form field can be exported based on a certain specification.
     * let asPerSpecification: boolean = settings.asPerSpecification;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get asPerSpecification(): boolean {
        return this._asPerSpecification;
    }
    /**
     * Sets the boolean value indicating whether the data in a form field can be exported based on a certain specification.
     *
     * @param {boolean} value - The boolean value.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Sets the boolean value indicating whether the data in a form field can be exported based on a certain specification.
     * let settings: PdfFormFieldExportSettings = new PdfFormFieldExportSettings();
     * // Set the boolean value indicating whether the data in a form field can be exported based on a certain specification.
     * settings.asPerSpecification = true;
     * // Export form field to JSON format
     * let json: Uint8Array = document.exportFormData(settings);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set asPerSpecification(value: boolean) {
        this._asPerSpecification = value;
    }
}
/**
 * The class provides various settings related to PDF pages.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Create a new PDF page settings instance
 * let pageSettings: PdfPageSettings = new PdfPageSettings();
 * // Sets the margins
 * pageSettings.margins = new PdfMargins(40);
 * // Sets the page size
 * pageSettings.size = {width: 595, height: 842};
 * // Sets the page orientation
 * pageSettings.orientation = PdfPageOrientation.landscape;
 * // Add a new PDF page with page settings
 * page = document.addPage(pageSettings);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfPageSettings {
    _orientation: PdfPageOrientation ;
    /**
     * @private
     */
    _size: Size = {width: 595, height: 842};
    /**
     * @private
     */
    _isOrientation: boolean = false;
    /**
     * @private
     */
    _margins: PdfMargins;
    /**
     * @private
     */
    _rotation: PdfRotationAngle;
    /**
     * Initializes a new instance of the `PdfPageSettings` class
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Create a new PDF page settings instance
     * let pageSettings: PdfPageSettings = new PdfPageSettings();
     * // Sets the margins
     * pageSettings.margins = new PdfMargins(40);
     * // Sets the page size
     * pageSettings.size = {width: 595, height: 842};
     * // Sets the page orientation
     * pageSettings.orientation = PdfPageOrientation.landscape;
     * // Add a new PDF page with page settings
     * page = document.addPage(pageSettings);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    public constructor()
    /**
     * Initializes a new instance of the `PdfPageSettings` class.
     *
     * @param {object} [options] Optional settings to initialize the page.
     * @param {PdfPageOrientation} [options.orientation] Page orientation.
     * @param {Size} [options.size] Page size.
     * @param {PdfMargins} [options.margins] Page margins.
     * @param {PdfRotationAngle} [options.rotation] Page rotation angle.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Create a new PDF page settings with custom options
     * let pageSettings = new PdfPageSettings({
     *   orientation: PdfPageOrientation.landscape,
     *   size: { width: 842, height: 595 },
     *   margins: new PdfMargins(40),
     *   rotation: PdfRotationAngle.angle90
     * });
     * // Add a new PDF page with page settings
     * page = document.addPage(pageSettings);
     * // Destroy the document
     * document.destroy();
     * ```
     */
    public constructor(options: {orientation?: PdfPageOrientation, size?: Size, margins?: PdfMargins, rotation?: PdfRotationAngle})
    /**
     * Initializes a new instance of the `PdfPageSettings` class.
     *
     * @param {object} [options] Optional settings to initialize the page.
     * @param {PdfPageOrientation} [options.orientation] Page orientation.
     * @param {Size} [options.size] Page size.
     * @param {PdfMargins} [options.margins] Page margins.
     * @param {PdfRotationAngle} [options.rotation] Page rotation angle.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Create a new PDF page settings with custom options
     * let pageSettings = new PdfPageSettings({
     *   orientation: PdfPageOrientation.landscape,
     *   size: { width: 842, height: 595 },
     *   margins: new PdfMargins(40),
     *   rotation: PdfRotationAngle.angle90
     * });
     * // Add a new PDF page with page settings
     * page = document.addPage(pageSettings);
     * // Destroy the document
     * document.destroy();
     * ```
     */
    public constructor(options?: {orientation?: PdfPageOrientation, size?: Size, margins?: PdfMargins, rotation?: PdfRotationAngle})
    {
        if (options && 'orientation' in options && options.orientation !== null && typeof options.orientation !== 'undefined') {
            this.orientation = options.orientation;
        } else {
            this._orientation = PdfPageOrientation.portrait;
        }
        if (options && 'size' in options && options.size !== null && typeof options.size !== 'undefined') {
            this.size = options.size;
        } else {
            this._size = {width: 595, height: 842};
        }
        if (options && 'margins' in options && options.margins !== null && typeof options.margins !== 'undefined') {
            this.margins = options.margins;
        } else {
            this._margins = new PdfMargins();
        }
        if (options && 'rotation' in options && options.rotation !== null && typeof options.rotation !== 'undefined') {
            this.rotation = options.rotation;
        } else {
            this._rotation = PdfRotationAngle.angle0;
        }
    }
    /**
     * Gets the orientation of the page.
     *
     * @returns {PdfPageOrientation} The orientation.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Create a new PDF page settings instance
     * let pageSettings: PdfPageSettings = new PdfPageSettings();
     * // Sets the page size
     * pageSettings.size = {width: 842, height: 595};
     * // Gets the page orientation
     * let orientation: PdfPageOrientation = pageSettings.orientation;
     * // Add a new PDF page with page settings
     * page = document.addPage(pageSettings);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get orientation(): PdfPageOrientation {
        return this._orientation;
    }
    /**
     * Sets the orientation of the page.
     *
     * @param {PdfPageOrientation} value The orientation.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Create a new PDF page settings instance
     * let pageSettings: PdfPageSettings = new PdfPageSettings();
     * // Sets the page orientation
     * pageSettings.orientation = PdfPageOrientation.landscape;
     * // Add a new PDF page with page settings
     * page = document.addPage(pageSettings);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set orientation(value: PdfPageOrientation) {
        this._isOrientation = true;
        if (this._orientation !== value) {
            this._orientation = value;
            this._updateSize(value);
        }
    }
    /**
     * Gets the size of the page.
     *
     * @returns {Size} The width and height of the page as number array.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the width and height of the PDF page as number array
     * let size: Size = page.size;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get size(): Size {
        return this._size;
    }
    /**
     * Sets the width and height of the page.
     *
     * @param {Size} value The width and height of the page as number array.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Create a new PDF page settings instance
     * let pageSettings: PdfPageSettings = new PdfPageSettings();
     * // Sets the page size
     * pageSettings.size = {width: 595, height: 842};
     * // Sets the page orientation
     * pageSettings.orientation = PdfPageOrientation.landscape;
     * // Add a new PDF page with page settings
     * page = document.addPage(pageSettings);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set size(value: Size) {
        if (this._isOrientation) {
            this._updateSize(value);
        } else {
            this._size = value;
            this._updateOrientation();
        }
    }
    /**
     * Gets the margin value of the page.
     *
     * @returns {PdfMargins} PDF margins
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Create a new PDF page settings instance
     * let pageSettings: PdfPageSettings = new PdfPageSettings();
     * // Gets the margins
     * let margins: PdfMargins = pageSettings.margins;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get margins(): PdfMargins {
        return this._margins;
    }
    /**
     * Sets the margin value of the page.
     *
     * @param {PdfMargins} value PDF margins
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Create a new PDF page settings instance
     * let pageSettings: PdfPageSettings = new PdfPageSettings();
     * // Sets the margins
     * pageSettings.margins = new PdfMargins(40);
     * // Add a new PDF page with page settings
     * page = document.addPage(pageSettings);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set margins(value: PdfMargins) {
        this._margins = value;
    }
    /**
     * Gets the rotation angle of the PDF page.
     *
     * @returns {PdfRotationAngle} PDF rotation angle
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Create a new PDF page settings instance
     * let pageSettings: PdfPageSettings = new PdfPageSettings();
     * // Gets the rotation angle
     * let rotation: PdfRotationAngle = pageSettings.rotation;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get rotation(): PdfRotationAngle {
        return this._rotation;
    }
    /**
     * Sets the rotation angle of the PDF page.
     *
     * @param {PdfRotationAngle} value PDF rotation angle
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Create a new PDF page settings instance
     * let pageSettings: PdfPageSettings = new PdfPageSettings();
     * // Sets the rotation angle
     * pageSettings.rotation = PdfRotationAngle.angle90;
     * // Add a new PDF page with page settings
     * page = document.addPage(pageSettings);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set rotation(value: PdfRotationAngle) {
        this._rotation = value;
        if (value >= 4) {
            this._rotation = (value % 4) as PdfRotationAngle;
        }
    }
    /**
     * Updates the page size based on the specified dimensions while respecting the current orientation.
     *
     * @private
     * @param {Size} size Page size with `width` and `height`.
     * @returns {void} nothing.
     */
    _updateSize(size: Size): void
    /**
     * Updates the page size by applying the specified orientation to the current size.
     *
     * @private
     * @param {PdfPageOrientation} orientation Page orientation to apply.
     * @returns {void} nothing.
     */
    _updateSize(orientation: PdfPageOrientation): void
    /**
     * Updates the page size using either a `Size` object or a `PdfPageOrientation`, normalizing width/height accordingly.
     *
     * @private
     * @param {Size | PdfPageOrientation} value The target size or orientation.
     * @returns {void} nothing.
     */
    _updateSize(value: Size | PdfPageOrientation): void {
        let pageOrientation: PdfPageOrientation;
        let pageSize: Size;
        if (typeof value !== 'number' && 'width' in value && 'height' in value && typeof value.width !== 'undefined' && typeof value.height !== 'undefined') {
            pageOrientation = this.orientation;
            pageSize = value;
        } else {
            pageOrientation = value as PdfPageOrientation;
            pageSize = this._size;
        }
        if (pageOrientation === PdfPageOrientation.portrait) {
            this._size = {width: Math.min(pageSize.width, pageSize.height), height: Math.max(pageSize.width, pageSize.height)};
        } else {
            this._size = {width: Math.max(pageSize.width, pageSize.height), height: Math.min(pageSize.width, pageSize.height)};
        }
    }
    /**
     * Recomputes the page orientation from the current size (portrait if height ≥ width; otherwise landscape).
     *
     * @private
     * @returns {void} nothing.
     */
    _updateOrientation(): void {
        this._orientation = (this._size.height >= this._size.width) ? PdfPageOrientation.portrait : PdfPageOrientation.landscape;
    }
    /**
     * Computes the drawable content size by subtracting margins from the page size.
     *
     * @private
     * @returns {number[]} A two-element array.
     */
    _getActualSize(): number[] {
        const width: number = this._size.width - (this._margins._left + this._margins._right);
        const height: number = this._size.height - (this._margins._top + this._margins._bottom);
        return [width, height];
    }
}
/**
 * A class representing PDF page margins.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Create a new PDF page settings instance
 * let pageSettings: PdfPageSettings = new PdfPageSettings();
 * // Sets the margins
 * pageSettings.margins = new PdfMargins(40);
 * // Sets the page size
 * pageSettings.size = {width: 595, height: 842};
 * // Sets the page orientation
 * pageSettings.orientation = PdfPageOrientation.landscape;
 * // Add a new PDF page with page settings
 * page = document.addPage(pageSettings);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfMargins {
    /**
     * Left margin value in points.
     *
     * @private
     */
    _left: number;
    /**
     * Right margin value in points.
     *
     * @private
     */
    _right: number;
    /**
     * Top margin value in points.
     *
     * @private
     */
    _top: number;
    /**
     * Bottom margin value in points.
     *
     * @private
     */
    _bottom: number;
    /**
     * Initializes a new instance of the `PdfMargins` class.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Create a new PDF page settings instance
     * let pageSettings: PdfPageSettings = new PdfPageSettings();
     * // Sets the margins
     * pageSettings.margins = new PdfMargins(40);
     * // Sets the page size
     * pageSettings.size = {width: 595, height: 842};
     * // Sets the page orientation
     * pageSettings.orientation = PdfPageOrientation.landscape;
     * // Add a new PDF page with page settings
     * page = document.addPage(pageSettings);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    public constructor()
    /**
     * Initializes a new instance with specified margin values for each page side.
     *
     * @param {number} all The margin value for each side of the page.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Create a new PDF page settings instance
     * let pageSettings: PdfPageSettings = new PdfPageSettings();
     * // Sets the margins
     * pageSettings.margins = new PdfMargins(40);
     * // Sets the page size
     * pageSettings.size = {width: 595, height: 842};
     * // Sets the page orientation
     * pageSettings.orientation = PdfPageOrientation.landscape;
     * // Add a new PDF page with page settings
     * page = document.addPage(pageSettings);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    public constructor(all: number)
    public constructor(all?: number) {
        if (typeof all === 'undefined') {
            this._left = this._right = this._top = this._bottom = 40;
        } else {
            this._left = this._right = this._top = this._bottom = all;
        }
    }
    /**
     * Gets the left margin value of the page.
     *
     * @returns {number} Left margin.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Create a new PDF page settings instance
     * let pageSettings: PdfPageSettings = new PdfPageSettings();
     * // Gets the left margin
     * let left: number = pageSettings.margins.left;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get left(): number {
        return this._left;
    }
    /**
     * Sets the left margin value of the page.
     *
     * @param {number} value Left margin.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Create a new PDF page settings instance
     * let pageSettings: PdfPageSettings = new PdfPageSettings();
     * // Sets the margins
     * let margins: PdfMargins = new PdfMargins();
     * margins.left = 40;
     * margins.right = 40;
     * margins.top = 20;
     * margins.bottom = 20;
     * pageSettings.margins = margins;
     * // Sets the page size
     * pageSettings.size = {width: 595, height: 842};
     * // Sets the page orientation
     * pageSettings.orientation = PdfPageOrientation.landscape;
     * // Add a new PDF page with page settings
     * page = document.addPage(pageSettings);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set left(value: number) {
        this._left = value;
    }
    /**
     * Gets the right margin value of the page.
     *
     * @returns {number} Right margin.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Create a new PDF page settings instance
     * let pageSettings: PdfPageSettings = new PdfPageSettings();
     * // Gets the right margin
     * let right: number = pageSettings.margins.right;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get right(): number {
        return this._right;
    }
    /**
     * Sets the right margin value of the page.
     *
     * @param {number} value - Right margin.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Create a new PDF page settings instance
     * let pageSettings: PdfPageSettings = new PdfPageSettings();
     * // Sets the margins
     * let margins: PdfMargins = new PdfMargins();
     * margins.left = 40;
     * margins.right = 40;
     * margins.top = 20;
     * margins.bottom = 20;
     * pageSettings.margins = margins;
     * // Sets the page size
     * pageSettings.size = {width: 595, height: 842};
     * // Sets the page orientation
     * pageSettings.orientation = PdfPageOrientation.landscape;
     * // Add a new PDF page with page settings
     * page = document.addPage(pageSettings);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set right(value: number) {
        this._right = value;
    }
    /**
     * Gets the top margin value of the page.
     *
     * @returns {number} Top margin.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Create a new PDF page settings instance
     * let pageSettings: PdfPageSettings = new PdfPageSettings();
     * // Gets the top margin
     * let top: number = pageSettings.margins.top;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get top(): number {
        return this._top;
    }
    /**
     *Sets the top margin value of the page.
     *
     * @param {number} value Top margin.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Create a new PDF page settings instance
     * let pageSettings: PdfPageSettings = new PdfPageSettings();
     * // Sets the margins
     * let margins: PdfMargins = new PdfMargins();
     * margins.left = 40;
     * margins.right = 40;
     * margins.top = 20;
     * margins.bottom = 20;
     * pageSettings.margins = margins;
     * // Sets the page size
     * pageSettings.size = {width: 595, height: 842};
     * // Sets the page orientation
     * pageSettings.orientation = PdfPageOrientation.landscape;
     * // Add a new PDF page with page settings
     * page = document.addPage(pageSettings);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set top(value: number) {
        this._top = value;
    }
    /**
     * Get the bottom margin value of the page.
     *
     * @returns {number} Bottom margin.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Create a new PDF page settings instance
     * let pageSettings: PdfPageSettings = new PdfPageSettings();
     * // Gets the bottom margin
     * let bottom: number = pageSettings.margins.bottom;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get bottom(): number {
        return this._bottom;
    }
    /**
     * Sets the bottom margin value of the page.
     *
     * @param {number} value Bottom margin.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Create a new PDF page settings instance
     * let pageSettings: PdfPageSettings = new PdfPageSettings();
     * // Sets the margins
     * let margins: PdfMargins = new PdfMargins();
     * margins.left = 40;
     * margins.right = 40;
     * margins.top = 20;
     * margins.bottom = 20;
     * pageSettings.margins = margins;
     * // Sets the page size
     * pageSettings.size = {width: 595, height: 842};
     * // Sets the page orientation
     * pageSettings.orientation = PdfPageOrientation.landscape;
     * // Add a new PDF page with page settings
     * page = document.addPage(pageSettings);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set bottom(value: number) {
        this._bottom = value;
    }
}
/**
 * Public class to provide data for the document split event, including the split index and PDF data.
 *
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data);
 * document.splitEvent = documentSplitEvent;
 * // Split PDF document by fixed number of pages
 * document.splitByFixedNumber(1);
 * // Event to invoke while splitting PDF document data
 * function documentSplitEvent(sender: PdfDocument, args: PdfDocumentSplitEventArgs): void {
 *  Save.save('output_' + args.splitIndex + '.pdf', new Blob([args.pdfData], { type: 'application/pdf' }));
 * }
 * // Destroy the document
 * document.destroy();
 */
export class PdfDocumentSplitEventArgs {
    private _index: number;
    private _pdfData: Uint8Array;
    /*
     * Initializes a new instance of the `PdfDocumentSplitEventArgs` class.
     *
     * @param {number} splitIndex The fixed number to split PDF document pages. The default value is 1.
     * @param {Uint8Array} pdfData The byte array of the split PDF document data.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * document.splitEvent = documentSplitEvent;
     * // Split PDF document by fixed number of pages
     * document.splitByFixedNumber(1);
     * // Event to invoke while splitting PDF document data
     * function documentSplitEvent(sender: PdfDocument, args: PdfDocumentSplitEventArgs): void {
     *   Save.save('output_' + args.splitIndex + '.pdf', new Blob([args.pdfData], { type: 'application/pdf' }));
     * }
     * // Destroy the document
     * document.destroy();
     */
    constructor(splitIndex: number, pdfData: Uint8Array) {
        this._index = splitIndex;
        this._pdfData = pdfData;
    }
    /*
     * Gets the byte array of the PDF document data.
     *
     * @returns {Uint8Array} The byte array of the PDF document data.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * document.splitEvent = documentSplitEvent;
     * // Split PDF document by fixed number of pages
     * document.splitByFixedNumber(1);
     * // Event to invoke while splitting PDF document data
     * function documentSplitEvent(sender: PdfDocument, args: PdfDocumentSplitEventArgs): void {
     *  Save.save('output_' + args.splitIndex + '.pdf', new Blob([args.pdfData], { type: 'application/pdf' }));
     * }
     * // Destroy the document
     * document.destroy();
     */
    get pdfData(): Uint8Array {
        return this._pdfData;
    }
    /*
     * Gets the split index of the PDF document.
     *
     * @returns {Uint8Array} The index that defines the number of event calls during the PDF document split.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * document.splitEvent = documentSplitEvent;
     * // Split PDF document by fixed number of pages
     * document.splitByFixedNumber(1);
     * // Event to invoke while splitting PDF document data
     * function documentSplitEvent(sender: PdfDocument, args: PdfDocumentSplitEventArgs): void {
     *  Save.save('output_' + args.splitIndex + '.pdf', new Blob([args.pdfData], { type: 'application/pdf' }));
     * }
     * // Destroy the document
     * document.destroy();
     */
    get index(): number {
        return this._index;
    }
}
