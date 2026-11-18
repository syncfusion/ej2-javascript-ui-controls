/**
 * OPC and Office Open XML package constants from the local corpus.
 *
 * Citations:
 * - Content types / relationships namespaces: ECMA-376-2 Open Packaging Conventions
 * - officeDocument transitional URI: ECMA-376-1 / MS-OI29500
 * - officeDocument strict URI: `http://purl.oclc.org/ooxml/officeDocument/relationships/officeDocument`
 *
 * Do not invent relationship types or content types here.
 */

/** OPC content types markup namespace (ECMA-376-2). */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const CONTENT_TYPES_NS: 'http://schemas.openxmlformats.org/package/2006/content-types' = 'http://schemas.openxmlformats.org/package/2006/content-types';

/** OPC relationships markup namespace (ECMA-376-2). */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const RELATIONSHIPS_NS: 'http://schemas.openxmlformats.org/package/2006/relationships' = 'http://schemas.openxmlformats.org/package/2006/relationships';

/**
 * Package-relationship type for the office document part (Transitional).
 * ECMA-376-1 / Office Open XML.
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const OFFICE_DOCUMENT_REL_TYPE_TRANSITIONAL: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument' = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument';

/**
 * Package-relationship type for the office document part (Strict).
 * MS-OI29500 / ECMA-376 Strict.
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const OFFICE_DOCUMENT_REL_TYPE_STRICT: 'http://purl.oclc.org/ooxml/officeDocument/relationships/officeDocument' = 'http://purl.oclc.org/ooxml/officeDocument/relationships/officeDocument';

/** ZIP / package path for content types. */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const CONTENT_TYPES_ZIP_NAME: '[Content_Types].xml' = '[Content_Types].xml';

/** ZIP path for package-level relationships. */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const PACKAGE_RELS_ZIP_NAME: '_rels/.rels' = '_rels/.rels';

/** OPC absolute part name for content types. */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const CONTENT_TYPES_PART_NAME: '/[Content_Types].xml' = '/[Content_Types].xml';

/** OPC absolute part name for package relationships. */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const PACKAGE_RELS_PART_NAME: '/_rels/.rels' = '/_rels/.rels';

/**
 * True when `type` is an officeDocument relationship (Strict or Transitional).
 *
 * @param {string} type - The type parameter.
 * @returns {boolean} - Returns the result.
 */
export function isOfficeDocumentRelationshipType(type: string): boolean {
    return type === OFFICE_DOCUMENT_REL_TYPE_TRANSITIONAL || type === OFFICE_DOCUMENT_REL_TYPE_STRICT;
}

/**
 * SpreadsheetML main namespace (Transitional).
 * ECMA-376-1 / `sml.xsd`.
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const SPREADSHEETML_NS_TRANSITIONAL: 'http://schemas.openxmlformats.org/spreadsheetml/2006/main' = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main';

/**
 * Office document relationships markup namespace (used as `r:` on sheet/@id).
 * ECMA-376-1.
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const OFFICE_DOCUMENT_RELATIONSHIPS_NS: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships' = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';

/**
 * Workbook part content type (Transitional SpreadsheetML).
 * ECMA-376-1.
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const WORKBOOK_CONTENT_TYPE_TRANSITIONAL: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml' = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml';

/**
 * Worksheet part content type (Transitional SpreadsheetML).
 * ECMA-376-1.
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const WORKSHEET_CONTENT_TYPE_TRANSITIONAL: 'application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml' = 'application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml';

/**
 * Worksheet relationship type (Transitional).
 * ECMA-376-1 officeDocument relationships.
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const WORKSHEET_REL_TYPE_TRANSITIONAL: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet' = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet';

/**
 * Worksheet relationship type (Strict).
 * MS-OI29500 / ECMA-376 Strict.
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const WORKSHEET_REL_TYPE_STRICT: 'http://purl.oclc.org/ooxml/officeDocument/relationships/worksheet' = 'http://purl.oclc.org/ooxml/officeDocument/relationships/worksheet';

/**
 * True when `type` is a worksheet relationship (Strict or Transitional).
 *
 * @param {string} type - The type parameter.
 * @returns {boolean} - Returns the result.
 */
export function isWorksheetRelationshipType(type: string): boolean {
    return type === WORKSHEET_REL_TYPE_TRANSITIONAL || type === WORKSHEET_REL_TYPE_STRICT;
}

/**
 * Shared strings part content type (Transitional SpreadsheetML).
 * ECMA-376-1 §12.3.15 Shared String Table Part.
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const SHARED_STRINGS_CONTENT_TYPE: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml' = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml';

/**
 * Shared strings relationship type (Transitional).
 * ECMA-376-4 §10.2.15 / officeDocument relationships.
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const SHARED_STRINGS_REL_TYPE_TRANSITIONAL: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings' = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings';

/**
 * Shared strings relationship type (Strict).
 * ECMA-376-1 §12.3.15.
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const SHARED_STRINGS_REL_TYPE_STRICT: 'http://purl.oclc.org/ooxml/officeDocument/relationships/sharedStrings' = 'http://purl.oclc.org/ooxml/officeDocument/relationships/sharedStrings';

/**
 * Default absolute part name for the shared string table.
 * ECMA-376-1 §12.3.15.
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const DEFAULT_SHARED_STRINGS_PART_NAME: '/xl/sharedStrings.xml' = '/xl/sharedStrings.xml';

/**
 * True when `type` is a sharedStrings relationship (Strict or Transitional).
 *
 * @param {string} type - The type parameter.
 * @returns {boolean} - Returns the result.
 */
export function isSharedStringsRelationshipType(type: string): boolean {
    return type === SHARED_STRINGS_REL_TYPE_TRANSITIONAL || type === SHARED_STRINGS_REL_TYPE_STRICT;
}

/**
 * Table definition part content type (Transitional SpreadsheetML).
 * ECMA-376-1 §12.3.21 Table Definition Part.
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const TABLE_CONTENT_TYPE: 'application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml' = 'application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml';

/**
 * Table relationship type (worksheet → table part, Transitional).
 * ECMA-376-4 §10.2 officeDocument relationships.
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const TABLE_REL_TYPE_TRANSITIONAL: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/table' = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/table';

/**
 * Table relationship type (worksheet → table part, Strict).
 * ECMA-376-1 §12.3.21 Table Definition Part (`purl.oclc.org` form).
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const TABLE_REL_TYPE_STRICT: 'http://purl.oclc.org/ooxml/officeDocument/relationships/table' = 'http://purl.oclc.org/ooxml/officeDocument/relationships/table';

/**
 * True when `type` is a table relationship (Strict or Transitional).
 *
 * @param {string} type - The type parameter.
 * @returns {boolean} - Returns the result.
 */
export function isTableRelationshipType(type: string): boolean {
    return type === TABLE_REL_TYPE_TRANSITIONAL || type === TABLE_REL_TYPE_STRICT;
}

/**
 * Styles part content type (Transitional SpreadsheetML).
 * ECMA-376-1 §12.3.20 Styles Part.
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const STYLES_CONTENT_TYPE: 'application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml' = 'application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml';

/**
 * Styles relationship type (Transitional).
 * ECMA-376-4 officeDocument relationships.
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const STYLES_REL_TYPE_TRANSITIONAL: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles' = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles';

/**
 * Styles relationship type (Strict).
 * MS-OI29500 / ECMA-376 Strict.
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const STYLES_REL_TYPE_STRICT: 'http://purl.oclc.org/ooxml/officeDocument/relationships/styles' = 'http://purl.oclc.org/ooxml/officeDocument/relationships/styles';

/**
 * Default absolute part name for the styles part.
 * ECMA-376-1 §12.3.20.
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const DEFAULT_STYLES_PART_NAME: '/xl/styles.xml' = '/xl/styles.xml';

/**
 * True when `type` is a styles relationship (Strict or Transitional).
 *
 * @param {string} type - The type parameter.
 * @returns {boolean} - Returns the result.
 */
export function isStylesRelationshipType(type: string): boolean {
    return type === STYLES_REL_TYPE_TRANSITIONAL || type === STYLES_REL_TYPE_STRICT;
}

/**
 * Theme part relationship type (Transitional).
 * ECMA-376-4 §12.2.7 Theme Part.
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const THEME_REL_TYPE_TRANSITIONAL: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme' = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme';

/**
 * Theme part relationship type (Strict).
 * ECMA-376-1 §14.2.7 Theme Part.
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const THEME_REL_TYPE_STRICT: 'http://purl.oclc.org/ooxml/officeDocument/relationships/theme' = 'http://purl.oclc.org/ooxml/officeDocument/relationships/theme';

/**
 * True when `type` is a theme relationship (Strict or Transitional).
 * Theme Override is a different part and is not accepted here.
 *
 * @param {string} type - The type parameter.
 * @returns {boolean} - Returns the result.
 */
export function isThemeRelationshipType(type: string): boolean {
    return type === THEME_REL_TYPE_TRANSITIONAL || type === THEME_REL_TYPE_STRICT;
}

/**
 * Hyperlink relationship type (Transitional).
 * ECMA-376-4 officeDocument relationships / worksheet hyperlinks.
 * Citation: ECMA-376-1 §18.3.1.47; officeDocument `…/relationships/hyperlink`.
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const HYPERLINK_REL_TYPE_TRANSITIONAL: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink' = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink';

/**
 * Hyperlink relationship type (Strict).
 * MS-OI29500 / ECMA-376 Strict.
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const HYPERLINK_REL_TYPE_STRICT: 'http://purl.oclc.org/ooxml/officeDocument/relationships/hyperlink' = 'http://purl.oclc.org/ooxml/officeDocument/relationships/hyperlink';

/**
 * True when `type` is a hyperlink relationship (Strict or Transitional).
 *
 * @param {string} type - The type parameter.
 * @returns {boolean} - Returns the result.
 */
export function isHyperlinkRelationshipType(type: string): boolean {
    return type === HYPERLINK_REL_TYPE_TRANSITIONAL || type === HYPERLINK_REL_TYPE_STRICT;
}

/**
 * Core properties part content type (OPC).
 * ECMA-376-2 / opc-coreProperties; Override PartName `/docProps/core.xml`.
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const CORE_PROPERTIES_CONTENT_TYPE: 'application/vnd.openxmlformats-package.core-properties+xml' = 'application/vnd.openxmlformats-package.core-properties+xml';

/**
 * Extended (application) properties part content type.
 * ECMA-376-1 shared-documentPropertiesExtended; `/docProps/app.xml`.
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const EXTENDED_PROPERTIES_CONTENT_TYPE: 'application/vnd.openxmlformats-officedocument.extended-properties+xml' = 'application/vnd.openxmlformats-officedocument.extended-properties+xml';

/**
 * Custom properties part content type (opaque preserve only in M1).
 * ECMA-376-1 shared-documentPropertiesCustom.
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const CUSTOM_PROPERTIES_CONTENT_TYPE: 'application/vnd.openxmlformats-officedocument.custom-properties+xml' = 'application/vnd.openxmlformats-officedocument.custom-properties+xml';

/**
 * Package-relationship type for the core properties part.
 * ECMA-376-2 §9.3 / OPC metadata relationships.
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const CORE_PROPERTIES_REL_TYPE: 'http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties' = 'http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties';

/**
 * Package-relationship type for extended properties (`app.xml`).
 * ECMA-376-1 officeDocument relationships.
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const EXTENDED_PROPERTIES_REL_TYPE_TRANSITIONAL: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties' = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties';

/**
 * Extended properties relationship type (Strict).
 * MS-OI29500 / ECMA-376 Strict.
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const EXTENDED_PROPERTIES_REL_TYPE_STRICT: 'http://purl.oclc.org/ooxml/officeDocument/relationships/extended-properties' = 'http://purl.oclc.org/ooxml/officeDocument/relationships/extended-properties';

/**
 * Package-relationship type for custom properties (`custom.xml`).
 * ECMA-376-1 officeDocument relationships — preserved, not authored yet.
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const CUSTOM_PROPERTIES_REL_TYPE_TRANSITIONAL: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/custom-properties' = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/custom-properties';

/**
 * Custom properties relationship type (Strict).
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const CUSTOM_PROPERTIES_REL_TYPE_STRICT: 'http://purl.oclc.org/ooxml/officeDocument/relationships/custom-properties' = 'http://purl.oclc.org/ooxml/officeDocument/relationships/custom-properties';

/**
 * Default absolute part name for core properties.
 * ECMA-376-2 / common Office layout `docProps/core.xml`.
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const DEFAULT_CORE_PROPERTIES_PART_NAME: '/docProps/core.xml' = '/docProps/core.xml';

/**
 * Default absolute part name for extended properties.
 * ECMA-376-1 / common Office layout `docProps/app.xml`.
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const DEFAULT_EXTENDED_PROPERTIES_PART_NAME: '/docProps/app.xml' = '/docProps/app.xml';

/**
 * Default absolute part name for custom properties (opaque).
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const DEFAULT_CUSTOM_PROPERTIES_PART_NAME: '/docProps/custom.xml' = '/docProps/custom.xml';

/**
 * Core properties markup namespace (`cp:`).
 * ECMA-376-2 opc-coreProperties.xsd.
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const CORE_PROPERTIES_NS: 'http://schemas.openxmlformats.org/package/2006/metadata/core-properties' = 'http://schemas.openxmlformats.org/package/2006/metadata/core-properties';

/**
 * Dublin Core elements namespace (`dc:`).
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const DUBLIN_CORE_NS: 'http://purl.org/dc/elements/1.1/' = 'http://purl.org/dc/elements/1.1/';

/**
 * Dublin Core terms namespace (`dcterms:`).
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const DUBLIN_CORE_TERMS_NS: 'http://purl.org/dc/terms/' = 'http://purl.org/dc/terms/';

/**
 * XML Schema instance namespace (`xsi:`) — used on dcterms created/modified.
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const XML_SCHEMA_INSTANCE_NS: 'http://www.w3.org/2001/XMLSchema-instance' = 'http://www.w3.org/2001/XMLSchema-instance';

/**
 * Extended properties markup namespace (unprefixed root `Properties`).
 * shared-documentPropertiesExtended.xsd.
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const EXTENDED_PROPERTIES_NS: 'http://schemas.openxmlformats.org/officeDocument/2006/extended-properties' = 'http://schemas.openxmlformats.org/officeDocument/2006/extended-properties';

/**
 * Variant types namespace (`vt:`) used inside extended/custom properties.
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const DOC_PROPS_VTYPES_NS: 'http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes' = 'http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes';

/**
 * True when `type` is a core-properties package relationship.
 *
 * @param {string} type - The type parameter.
 * @returns {boolean} - Returns the result.
 */
export function isCorePropertiesRelationshipType(type: string): boolean {
    return type === CORE_PROPERTIES_REL_TYPE;
}

/**
 * True when `type` is an extended-properties relationship (Strict or Transitional).
 *
 * @param {string} type - The type parameter.
 * @returns {boolean} - Returns the result.
 */
export function isExtendedPropertiesRelationshipType(type: string): boolean {
    return type === EXTENDED_PROPERTIES_REL_TYPE_TRANSITIONAL || type === EXTENDED_PROPERTIES_REL_TYPE_STRICT;
}

/**
 * True when `type` is a custom-properties relationship (Strict or Transitional).
 *
 * @param {string} type - The type parameter.
 * @returns {boolean} - Returns the result.
 */
export function isCustomPropertiesRelationshipType(type: string): boolean {
    return type === CUSTOM_PROPERTIES_REL_TYPE_TRANSITIONAL || type === CUSTOM_PROPERTIES_REL_TYPE_STRICT;
}

/**
 * Drawing part content type used by spreadsheetDrawing parts.
 * ECMA-376-1 / dml-spreadsheetDrawing.xsd (CT_WsDr).
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const DRAWING_CONTENT_TYPE: 'application/vnd.openxmlformats-officedocument.drawing+xml' = 'application/vnd.openxmlformats-officedocument.drawing+xml';

/**
 * Drawing relationship type (Transitional).
 * ECMA-376-1 officeDocument relationships / worksheet drawings.
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const DRAWING_REL_TYPE_TRANSITIONAL: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/drawing' = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/drawing';

/**
 * Drawing relationship type (Strict).
 * MS-OI29500 / ECMA-376 Strict.
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const DRAWING_REL_TYPE_STRICT: 'http://purl.oclc.org/ooxml/officeDocument/relationships/drawing' = 'http://purl.oclc.org/ooxml/officeDocument/relationships/drawing';

/**
 * True when `type` is a drawing relationship (Strict or Transitional).
 *
 * @param {string} type - The type parameter.
 * @returns {boolean} - Returns the result.
 */
export function isDrawingRelationshipType(type: string): boolean {
    return type === DRAWING_REL_TYPE_TRANSITIONAL || type === DRAWING_REL_TYPE_STRICT;
}

/**
 * VML drawing part content type (legacy form controls / comments chrome).
 * Citation: XlsIO `ContentTypes` / Office Open XML package conventions for
 * `vmlDrawingN.vml` under `/xl/drawings/`.
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const VML_DRAWING_CONTENT_TYPE: 'application/vnd.openxmlformats-officedocument.vmlDrawing' = 'application/vnd.openxmlformats-officedocument.vmlDrawing';

/**
 * VML drawing relationship type (Transitional).
 * Citation: XlsIO `RelationTypes.VmlDrawing` /
 * `http://schemas.openxmlformats.org/officeDocument/2006/relationships/vmlDrawing`.
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const VML_DRAWING_REL_TYPE_TRANSITIONAL: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/vmlDrawing' = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/vmlDrawing';

/**
 * VML drawing relationship type (Strict).
 * MS-OI29500 / ECMA-376 Strict mirror of the Transitional vmlDrawing rel.
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const VML_DRAWING_REL_TYPE_STRICT: 'http://purl.oclc.org/ooxml/officeDocument/relationships/vmlDrawing' = 'http://purl.oclc.org/ooxml/officeDocument/relationships/vmlDrawing';

/**
 * True when `type` is a VML drawing relationship (Strict or Transitional).
 *
 * @param {string} type - The type parameter.
 * @returns {boolean} - Returns the result.
 */
export function isVmlDrawingRelationshipType(type: string): boolean {
    return type === VML_DRAWING_REL_TYPE_TRANSITIONAL || type === VML_DRAWING_REL_TYPE_STRICT;
}

/**
 * DrawingML (dml-main) namespace.
 * ECMA-376-1 / dml-main.xsd (a: prefix in text-box context).
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const DRAWINGML_MAIN_NS_TRANSITIONAL: 'http://schemas.openxmlformats.org/drawingml/2006/main' = 'http://schemas.openxmlformats.org/drawingml/2006/main';

/**
 * DrawingML spreadsheet drawing namespace (xdr: prefix).
 * ECMA-376-1 / dml-spreadsheetDrawing.xsd.
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const DRAWINGML_SPREADSHEET_NS_TRANSITIONAL: 'http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing' = 'http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing';

/**
 * Chart part content type (DrawingML chart).
 * ECMA-376-1 / dml-chart.xsd (`c:chartSpace`).
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const CHART_CONTENT_TYPE: 'application/vnd.openxmlformats-officedocument.drawingml.chart+xml' = 'application/vnd.openxmlformats-officedocument.drawingml.chart+xml';

/**
 * Chart relationship type (Transitional).
 * ECMA-376-1 officeDocument relationships / chart parts.
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const CHART_REL_TYPE_TRANSITIONAL: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/chart' = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/chart';

/**
 * Chart relationship type (Strict).
 * MS-OI29500 / ECMA-376 Strict.
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const CHART_REL_TYPE_STRICT: 'http://purl.oclc.org/ooxml/officeDocument/relationships/chart' = 'http://purl.oclc.org/ooxml/officeDocument/relationships/chart';

/**
 * True when `type` is a chart relationship (Strict or Transitional).
 *
 * @param {string} type - The type parameter.
 * @returns {boolean} - Returns the result.
 */
export function isChartRelationshipType(type: string): boolean {
    return type === CHART_REL_TYPE_TRANSITIONAL || type === CHART_REL_TYPE_STRICT;
}

/**
 * DrawingML chart namespace (`c:` prefix).
 * ECMA-376-1 / dml-chart.xsd.
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const DRAWINGML_CHART_NS_TRANSITIONAL: 'http://schemas.openxmlformats.org/drawingml/2006/chart' = 'http://schemas.openxmlformats.org/drawingml/2006/chart';

/**
 * ChartEx part content type (Excel 2016+ extended charts).
 * [MS-ODRAWXML] §2.1.5 ChartEx.
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const CHARTEX_CONTENT_TYPE: 'application/vnd.ms-office.chartex+xml' = 'application/vnd.ms-office.chartex+xml';

/**
 * ChartEx relationship type (drawing → ChartEx part).
 * [MS-ODRAWXML] §2.1.5 / office 2014 relationships.
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const CHARTEX_REL_TYPE: 'http://schemas.microsoft.com/office/2014/relationships/chartEx' = 'http://schemas.microsoft.com/office/2014/relationships/chartEx';

/**
 * True when `type` is a ChartEx relationship.
 *
 * @param {string} type - The type parameter.
 * @returns {boolean} - Returns the result.
 */
export function isChartExRelationshipType(type: string): boolean {
    return type === CHARTEX_REL_TYPE;
}

/**
 * ChartEx / DrawingML chartex namespace (`cx:` prefix).
 * [MS-ODRAWXML] §2.24 / drawing/2014/chartex.
 * Used as `a:graphicData/@uri` and on the drawing `chart` CT_RelId reference.
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const DRAWINGML_CHARTEX_NS: 'http://schemas.microsoft.com/office/drawing/2014/chartex' = 'http://schemas.microsoft.com/office/drawing/2014/chartex';

/**
 * Persons part content type ([MS-XLSX] §2.1.18).
 * Root `personList` — workbook-level author store for threaded comments.
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const PERSON_CONTENT_TYPE: 'application/vnd.ms-excel.person+xml' = 'application/vnd.ms-excel.person+xml';

/**
 * Persons relationship type ([MS-XLSX] §2.1.18).
 * Source: workbook part → `/xl/persons/person.xml`.
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const PERSON_REL_TYPE: 'http://schemas.microsoft.com/office/2017/10/relationships/person' = 'http://schemas.microsoft.com/office/2017/10/relationships/person';

/**
 * True when `type` is a persons relationship.
 *
 * @param {string} type - The type parameter.
 * @returns {boolean} - Returns the result.
 */
export function isPersonRelationshipType(type: string): boolean {
    return type === PERSON_REL_TYPE;
}

/**
 * Threaded comments part content type ([MS-XLSX] §2.1.17).
 * Root `ThreadedComments` — per worksheet.
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const THREADED_COMMENTS_CONTENT_TYPE: 'application/vnd.ms-excel.threadedcomments+xml' = 'application/vnd.ms-excel.threadedcomments+xml';

/**
 * Threaded comments relationship type ([MS-XLSX] §2.1.17).
 * Source: worksheet part → threaded comments part.
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const THREADED_COMMENTS_REL_TYPE: 'http://schemas.microsoft.com/office/2017/10/relationships/threadedComment' = 'http://schemas.microsoft.com/office/2017/10/relationships/threadedComment';

/**
 * True when `type` is a threaded-comments relationship.
 *
 * @param {string} type - The type parameter.
 * @returns {boolean} - Returns the result.
 */
export function isThreadedCommentsRelationshipType(type: string): boolean {
    return type === THREADED_COMMENTS_REL_TYPE;
}

/**
 * SpreadsheetML 2018 threaded comments namespace ([MS-XLSX] §5.23).
 * Used by `personList` and `ThreadedComments` roots.
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const THREADED_COMMENTS_NS: 'http://schemas.microsoft.com/office/spreadsheetml/2018/threadedcomments' = 'http://schemas.microsoft.com/office/spreadsheetml/2018/threadedcomments';

/**
 * Legacy comments part content type (ECMA-376-1 §18.7).
 * Used for threaded-comment placeholder comments ([MS-XLSX] §2.3.7.3).
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const COMMENTS_CONTENT_TYPE: 'application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml' = 'application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml';

/**
 * Legacy comments relationship type (Transitional).
 * ECMA-376-1 officeDocument relationships / comments parts.
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const COMMENTS_REL_TYPE_TRANSITIONAL: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/comments' = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/comments';

/**
 * Legacy comments relationship type (Strict).
 * MS-OI29500 / ECMA-376 Strict.
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const COMMENTS_REL_TYPE_STRICT: 'http://purl.oclc.org/ooxml/officeDocument/relationships/comments' = 'http://purl.oclc.org/ooxml/officeDocument/relationships/comments';

/**
 * True when `type` is a legacy comments relationship (Strict or Transitional).
 *
 * @param {string} type - The type parameter.
 * @returns {boolean} - Returns the result.
 */
export function isCommentsRelationshipType(type: string): boolean {
    return type === COMMENTS_REL_TYPE_TRANSITIONAL || type === COMMENTS_REL_TYPE_STRICT;
}

/**
 * Pivot cache definition part content type (Transitional SpreadsheetML).
 * ECMA-376-1 Part 1 content-type listing.
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const PIVOT_CACHE_DEFINITION_CONTENT_TYPE: 'application/vnd.openxmlformats-officedocument.spreadsheetml.pivotCacheDefinition+xml' = 'application/vnd.openxmlformats-officedocument.spreadsheetml.pivotCacheDefinition+xml';

/**
 * Pivot cache records part content type (Transitional SpreadsheetML).
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const PIVOT_CACHE_RECORDS_CONTENT_TYPE: 'application/vnd.openxmlformats-officedocument.spreadsheetml.pivotCacheRecords+xml' = 'application/vnd.openxmlformats-officedocument.spreadsheetml.pivotCacheRecords+xml';

/**
 * Pivot table part content type (Transitional SpreadsheetML).
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const PIVOT_TABLE_CONTENT_TYPE: 'application/vnd.openxmlformats-officedocument.spreadsheetml.pivotTable+xml' = 'application/vnd.openxmlformats-officedocument.spreadsheetml.pivotTable+xml';

/** Workbook → pivot cache definition relationship type (Transitional). */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const PIVOT_CACHE_DEFINITION_REL_TYPE: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/pivotCacheDefinition' = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/pivotCacheDefinition';

/** Pivot cache definition → pivot cache records relationship type (Transitional). */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const PIVOT_CACHE_RECORDS_REL_TYPE: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/pivotCacheRecords' = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/pivotCacheRecords';

/** Worksheet → pivot table relationship type (Transitional). */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const PIVOT_TABLE_REL_TYPE: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/pivotTable' = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/pivotTable';

/** Workbook → sheet metadata relationship type (ECMA-376-1 §18.9, `metadata.xml`). */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
/** @private */
export const SHEET_METADATA_REL_TYPE: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/sheetMetadata' = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/sheetMetadata';

/** Sheet metadata part content type. */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
/** @private */
export const SHEET_METADATA_CONTENT_TYPE: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheetMetadata+xml' = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheetMetadata+xml';

/** Rich Value Data part ([MS-XLSX] §2.1.10). */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
/** @private */
export const RD_RICH_VALUE_REL_TYPE: 'http://schemas.microsoft.com/office/2017/06/relationships/rdRichValue' = 'http://schemas.microsoft.com/office/2017/06/relationships/rdRichValue';
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
/** @private */
export const RD_RICH_VALUE_CONTENT_TYPE: 'application/vnd.ms-excel.rdrichvalue+xml' = 'application/vnd.ms-excel.rdrichvalue+xml';

/** Rich Value Structure part ([MS-XLSX] §2.1.11). */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
/** @private */
export const RD_RICH_VALUE_STRUCTURE_REL_TYPE: 'http://schemas.microsoft.com/office/2017/06/relationships/rdRichValueStructure' = 'http://schemas.microsoft.com/office/2017/06/relationships/rdRichValueStructure';
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
/** @private */
export const RD_RICH_VALUE_STRUCTURE_CONTENT_TYPE: 'application/vnd.ms-excel.rdrichvaluestructure+xml' = 'application/vnd.ms-excel.rdrichvaluestructure+xml';

/** Rich Value Types part ([MS-XLSX] §2.1.12). */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
/** @private */
export const RD_RICH_VALUE_TYPES_REL_TYPE: 'http://schemas.microsoft.com/office/2017/06/relationships/rdRichValueTypes' = 'http://schemas.microsoft.com/office/2017/06/relationships/rdRichValueTypes';
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
/** @private */
export const RD_RICH_VALUE_TYPES_CONTENT_TYPE: 'application/vnd.ms-excel.rdrichvaluetypes+xml' = 'application/vnd.ms-excel.rdrichvaluetypes+xml';

/** Rich Value Rels part ([MS-XLSX] §2.1.21). */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
/** @private */
export const RICH_VALUE_REL_REL_TYPE: 'http://schemas.microsoft.com/office/2022/10/relationships/richValueRel' = 'http://schemas.microsoft.com/office/2022/10/relationships/richValueRel';
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
/** @private */
export const RICH_VALUE_REL_CONTENT_TYPE: 'application/vnd.ms-excel.richvaluerel+xml' = 'application/vnd.ms-excel.richvaluerel+xml';

/** Image relationship type (part → media). */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
/** @private */
export const IMAGE_RELATIONSHIP_TYPE: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/image' = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/image';
