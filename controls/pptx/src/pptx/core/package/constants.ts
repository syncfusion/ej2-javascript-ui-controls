/**
 * Documented OPC / PresentationML content types and relationship type URIs.
 *
 * @remarks
 * Values are taken from ECMA-376 Part 1 (presentation/slide content types) and
 * Transitional relationship URIs used by real PPTX packages. Never invent new
 * strings here.
 */
/** OPC content-types part media type (package-level relationships sibling). */
export const CONTENT_TYPES_PART_NAME: string = '/[Content_Types].xml';
/** Package relationships part name. */
export const PACKAGE_RELS_PART_NAME: string = '/_rels/.rels';
/** OPC relationships part content type (opc-contentTypes / package conventions). */
export const RELATIONSHIPS_CONTENT_TYPE: string = 'application/vnd.openxmlformats-package.relationships+xml';
/** Content-types markup namespace (opc-contentTypes.xsd). */
export const CONTENT_TYPES_NS: string = 'http://schemas.openxmlformats.org/package/2006/content-types';
/** Relationships markup namespace (opc-relationships.xsd). */
export const RELATIONSHIPS_NS: string = 'http://schemas.openxmlformats.org/package/2006/relationships';
/**
 * Presentation main part content types (ECMA-376 Part 1 §13.3.6).
 * A package shall contain exactly one presentation main part.
 */
export const PRESENTATION_MAIN_CONTENT_TYPES: ReadonlyArray<string> = Object.freeze([
    'application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml',
    'application/vnd.openxmlformats-officedocument.presentationml.slideshow.main+xml',
    'application/vnd.openxmlformats-officedocument.presentationml.template.main+xml',
    // Macro-enabled variants: detect and preserve; never execute macros.
    'application/vnd.ms-powerpoint.presentation.macroEnabled.main+xml',
    'application/vnd.ms-powerpoint.slideshow.macroEnabled.main+xml',
    'application/vnd.ms-powerpoint.template.macroEnabled.main+xml'
]);
/** Slide part content type (ECMA-376 Part 1 §13.3.8). */
export const SLIDE_CONTENT_TYPE: string = 'application/vnd.openxmlformats-officedocument.presentationml.slide+xml';
/**
 * Package → presentation relationship type (Transitional URI as used by PPTX fixtures).
 * Part 1 officeDocument relationship family; do not invent alternate strings.
 */
export const OFFICE_DOCUMENT_REL_TYPE: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument';
/**
 * Presentation → slide relationship type (Transitional form, Part 1 §13.3.8).
 */
export const SLIDE_REL_TYPE: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide';
/**
 * Presentation → slide master relationship type (Transitional, ECMA-376 Part 4).
 * Source: `http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster`
 */
export const SLIDE_MASTER_REL_TYPE: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster';
/**
 * Slide master part content type (ECMA-376 Part 1 §13.3.10).
 * Source: `application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml`
 */
export const SLIDE_MASTER_CONTENT_TYPE: string = 'application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml';
/**
 * Slide → slide layout relationship type (Transitional, ECMA-376 Part 4).
 * Source: `http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout`
 */
export const SLIDE_LAYOUT_REL_TYPE: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout';
/**
 * Slide layout part content type (ECMA-376 Part 1).
 * Source: `application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml`
 */
export const SLIDE_LAYOUT_CONTENT_TYPE: string = 'application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml';
/**
 * Theme relationship type (Transitional, ECMA-376 Part 4).
 * Source: `http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme`
 *
 * Commonly slide master → theme; presentation may also target a theme part.
 */
export const THEME_REL_TYPE: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme';
/**
 * Theme part content type (ECMA-376 Part 1).
 * Source: `application/vnd.openxmlformats-officedocument.theme+xml`
 */
export const THEME_CONTENT_TYPE: string = 'application/vnd.openxmlformats-officedocument.theme+xml';
/**
 * Presentation → presentation properties relationship type (Transitional).
 * Source: `http://schemas.openxmlformats.org/officeDocument/2006/relationships/presProps`
 *
 * Citation: ECMA-376 Part 1 §13.3.7 (shall be exactly one, implicit from Presentation);
 * Part 4 §11.2.7 Transitional source URI.
 */
export const PRES_PROPS_REL_TYPE: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/presProps';
/**
 * Presentation properties part content type (ECMA-376 Part 1 §13.3.7).
 * Source: `application/vnd.openxmlformats-officedocument.presentationml.presProps+xml`
 */
export const PRES_PROPS_CONTENT_TYPE: string = 'application/vnd.openxmlformats-officedocument.presentationml.presProps+xml';
/**
 * Presentation → view properties relationship type (Transitional).
 * Source: `http://schemas.openxmlformats.org/officeDocument/2006/relationships/viewProps`
 *
 * Citation: ECMA-376 Part 1 §13.3.13 (zero-or-one); Part 4 §11.2.13 Transitional source URI.
 */
export const VIEW_PROPS_REL_TYPE: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/viewProps';
/**
 * View properties part content type (ECMA-376 Part 1 §13.3.13).
 * Source: `application/vnd.openxmlformats-officedocument.presentationml.viewProps+xml`
 */
export const VIEW_PROPS_CONTENT_TYPE: string = 'application/vnd.openxmlformats-officedocument.presentationml.viewProps+xml';
/**
 * Presentation → table styles relationship type (Transitional).
 * Source: `http://schemas.openxmlformats.org/officeDocument/2006/relationships/tableStyles`
 *
 * Citation: ECMA-376 Part 1 §14.2.9 (no more than one per Presentation);
 * Part 4 §12.2.9 Transitional source URI.
 */
export const TABLE_STYLES_REL_TYPE: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/tableStyles';
/**
 * Table styles part content type (ECMA-376 Part 1 §14.2.9).
 * Source: `application/vnd.openxmlformats-officedocument.presentationml.tableStyles+xml`
 *
 * Root element is DrawingML `a:tblStyleLst` (`dml-main.xsd` `CT_TableStyleList`).
 */
export const TABLE_STYLES_CONTENT_TYPE: string = 'application/vnd.openxmlformats-officedocument.presentationml.tableStyles+xml';
/**
 * Image relationship type (ECMA-376 Part 4 / officeDocument relationships).
 * Source: `http://schemas.openxmlformats.org/officeDocument/2006/relationships/image`
 *
 * Used by `a:blip/@r:embed` and `a:blip/@r:link` targets on slides.
 */
export const IMAGE_REL_TYPE: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/image';
/**
 * PNG image part content type (common media Default / Override).
 * Source: `image/png`
 */
export const IMAGE_PNG_CONTENT_TYPE: string = 'image/png';
/**
 * JPEG image part content type (common media Default / Override).
 * Source: `image/jpeg`
 */
export const IMAGE_JPEG_CONTENT_TYPE: string = 'image/jpeg';
/**
 * Slide → notes slide relationship type (Transitional, ECMA-376 Part 4).
 * Source: `http://schemas.openxmlformats.org/officeDocument/2006/relationships/notesSlide`
 */
export const NOTES_SLIDE_REL_TYPE: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/notesSlide';
/**
 * Notes slide part content type (ECMA-376 Part 1).
 * Source: `application/vnd.openxmlformats-officedocument.presentationml.notesSlide+xml`
 */
export const NOTES_SLIDE_CONTENT_TYPE: string = 'application/vnd.openxmlformats-officedocument.presentationml.notesSlide+xml';
/**
 * Notes master relationship type (Transitional, ECMA-376 Part 4).
 * Source: `http://schemas.openxmlformats.org/officeDocument/2006/relationships/notesMaster`
 *
 * Core preserves notesMaster parts and relationships; semantic notes-master API is out of
 * Phase 3 (optional `notes` module is notes **slide** body only).
 */
export const NOTES_MASTER_REL_TYPE: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/notesMaster';
/**
 * Notes master part content type (ECMA-376 Part 1 §13.3.4).
 * Source: `application/vnd.openxmlformats-officedocument.presentationml.notesMaster+xml`
 */
export const NOTES_MASTER_CONTENT_TYPE: string = 'application/vnd.openxmlformats-officedocument.presentationml.notesMaster+xml';
/**
 * Slide → comments relationship type (Transitional, ECMA-376 Part 4).
 * Source: `http://schemas.openxmlformats.org/officeDocument/2006/relationships/comments`
 *
 * Citation: ECMA-376-1 §13.3.2 Comments part.
 */
export const COMMENTS_REL_TYPE: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/comments';
/**
 * Comments part content type (ECMA-376 Part 1 §13.3.2).
 * Source: `application/vnd.openxmlformats-officedocument.presentationml.comments+xml`
 */
export const COMMENTS_CONTENT_TYPE: string = 'application/vnd.openxmlformats-officedocument.presentationml.comments+xml';
/**
 * Presentation → comment authors relationship type (Transitional, ECMA-376 Part 4).
 * Source: `http://schemas.openxmlformats.org/officeDocument/2006/relationships/commentAuthors`
 *
 * Citation: ECMA-376-1 §13.3.1 Comment Authors part.
 */
export const COMMENT_AUTHORS_REL_TYPE: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/commentAuthors';
/**
 * Comment authors part content type (ECMA-376 Part 1 §13.3.1).
 * Source: `application/vnd.openxmlformats-officedocument.presentationml.commentAuthors+xml`
 */
export const COMMENT_AUTHORS_CONTENT_TYPE: string = 'application/vnd.openxmlformats-officedocument.presentationml.commentAuthors+xml';
/**
 * GIF image part content type (optional insert allowlist entry).
 * Source: `image/gif`
 *
 * Citation: `docs/specs/012-pictures.md` content-type allowlist.
 */
export const IMAGE_GIF_CONTENT_TYPE: string = 'image/gif';
/**
 * Presentation → VBA project relationship type (macro-enabled packages).
 * Source: `http://schemas.microsoft.com/office/2006/relationships/vbaProject`
 *
 * Citation: [MS-OFFMACRO] / [MS-OFFMACRO2] VBA Project part; never invent URI.
 * Target is conventionally `ppt/vbaProject.bin` (opaque MS-OVBA storage).
 */
export const VBA_PROJECT_REL_TYPE: string = 'http://schemas.microsoft.com/office/2006/relationships/vbaProject';
/**
 * VBA project part content type (opaque binary; never parse or execute).
 * Source: `application/vnd.ms-office.vbaProject`
 *
 * Citation: [MS-OFFMACRO] / [MS-OFFMACRO2] VBA Project part; MS-OVBA structure
 * lives inside the part bytes and is out of scope for this library.
 */
export const VBA_PROJECT_CONTENT_TYPE: string = 'application/vnd.ms-office.vbaProject';
/**
 * Package → digital signature origin relationship type (OPC).
 * Source: `http://schemas.openxmlformats.org/package/2006/relationships/digital-signature/origin`
 *
 * Citation: ECMA-376-1 §15.2.7 Digital Signature Origin Part; ECMA-376-2 §6.5.4.3.
 * Target is conventionally `_xmlsignatures/origin.sigs`.
 */
export const DIGITAL_SIGNATURE_ORIGIN_REL_TYPE: string = 'http://schemas.openxmlformats.org/package/2006/relationships/digital-signature/origin';
/**
 * Origin → XML signature part relationship type (OPC).
 * Source: `http://schemas.openxmlformats.org/package/2006/relationships/digital-signature/signature`
 *
 * Citation: ECMA-376-1 §15.2.8 XML Signature Part; ECMA-376-2 §6.5.4.3 EXAMPLE 2.
 */
export const DIGITAL_SIGNATURE_REL_TYPE: string = 'http://schemas.openxmlformats.org/package/2006/relationships/digital-signature/signature';
/**
 * Digital signature origin part content type (opaque package marker).
 * Source: `application/vnd.openxmlformats-package.digital-signature-origin`
 *
 * Citation: ECMA-376-1 §15.2.7; never invent alternate strings.
 */
export const DIGITAL_SIGNATURE_ORIGIN_CONTENT_TYPE: string = 'application/vnd.openxmlformats-package.digital-signature-origin';
/**
 * XML signature part content type (opaque; never parse or validate).
 * Source: `application/vnd.openxmlformats-package.digital-signature+xml`
 *
 * Citation: ECMA-376-1 §15.2.8; W3C XML-Signature content is out of scope.
 */
export const DIGITAL_SIGNATURE_CONTENT_TYPE: string = 'application/vnd.openxmlformats-package.digital-signature+xml';
/**
 * Conventional absolute URI of the digital signature origin part.
 * Source: `/_xmlsignatures/origin.sigs` (ECMA-376-1 §15.2.7).
 */
export const DIGITAL_SIGNATURE_ORIGIN_PART_NAME: string = '/_xmlsignatures/origin.sigs';
/**
 * Package → core properties relationship type (OPC, package-level).
 * Source: `http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties`
 *
 * Citation: ECMA-376-2 §8.2 (a package shall contain at most one Core Properties
 * part, referenced by a core-properties relationship from the package);
 * ECMA-376-2 Annex E Table E.3.
 */
export const CORE_PROPS_REL_TYPE: string = 'http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties';
/**
 * Core properties part content type (Dublin Core / DCTERMS metadata).
 * Source: `application/vnd.openxmlformats-package.core-properties+xml`
 *
 * Citation: ECMA-376-1 §15.2.12.1 (Core File Properties Part); ECMA-376-2 §8.2.
 */
export const CORE_PROPS_CONTENT_TYPE: string = 'application/vnd.openxmlformats-package.core-properties+xml';
/**
 * Package → extended properties relationship type (officeDocument, package-level).
 * Source: `http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties`
 *
 * Citation: ECMA-376-1 §15.2.12.3 (Extended File Properties Part); MS-OE376.
 */
export const EXTENDED_PROPS_REL_TYPE: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties';
/**
 * Extended properties part content type (application-defined file properties).
 * Source: `application/vnd.openxmlformats-officedocument.extended-properties+xml`
 *
 * Citation: ECMA-376-1 §15.2.12.3.
 */
export const EXTENDED_PROPS_CONTENT_TYPE: string = 'application/vnd.openxmlformats-officedocument.extended-properties+xml';
/** OLE compound-file signature used by OFFCRYPTO encrypted OOXML packages. */
export const OLE_CFB_SIGNATURE: ReadonlyArray<number> = Object.freeze([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]);
