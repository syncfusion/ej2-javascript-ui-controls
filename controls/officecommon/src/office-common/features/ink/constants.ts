import { Literal } from '../../core/literal-type';
/**
 * Cited InkML / Wordprocessing ink constants.
 *
 * Sources:
 * - W3C InkML 1.0 §1 / namespace declaration
 * - ECMA-376 Part 1 content types; [MS-ODRAWXML] §2.1.4 ink part
 * - ECMA-376-1 §17.3.3.2 / [MS-ODRAWXML] §2.1.4 customXml relationship for ink source
 * - [MS-ODRAWXML] §2.15 WordprocessingML 2010 namespace
 * - [MS-ODRAWXML] §2.2.7.6 `wordprocessingInk` graphicData URI
 */

/**
 * InkML namespace URI.
 *
 * Source: W3C InkML 1.0 (`http://www.w3.org/2003/InkML`).
 *
 * @public
 */
export const INKML_NAMESPACE: Literal<'http://www.w3.org/2003/InkML'> = 'http://www.w3.org/2003/InkML';

/**
 * Content type for an InkML part.
 *
 * Source: [MS-ODRAWXML] §2.1.4 / Office content-type vocabulary —
 * `application/inkml+xml`.
 *
 * @public
 */
export const INK_CONTENT_TYPE: Literal<'application/inkml+xml'> = 'application/inkml+xml';

/**
 * Relationship type used by Word documents to bind the ink source part.
 *
 * Source: ECMA-376-1 §17.3.3.2; [MS-ODRAWXML] §2.1.4 —
 * `…/relationships/customXml` (internal target mode).
 *
 * @public
 */
export const INK_SOURCE_RELATIONSHIP_TYPE: Literal<'http://schemas.openxmlformats.org/officeDocument/2006/relationships/customXml'> =
  'http://schemas.openxmlformats.org/officeDocument/2006/relationships/customXml';

/**
 * WordprocessingML 2010 namespace (`w14:`).
 *
 * Source: [MS-ODRAWXML] §2.15 —
 * `http://schemas.microsoft.com/office/word/2010/wordml`.
 *
 * @public
 */
export const WORDML_2010_NAMESPACE: Literal<'http://schemas.microsoft.com/office/word/2010/wordml'> =
  'http://schemas.microsoft.com/office/word/2010/wordml';

/**
 * DrawingML `a:graphicData/@uri` value for wordprocessing ink content.
 *
 * Source: [MS-ODRAWXML] §2.2.7.6 —
 * `http://schemas.microsoft.com/office/word/2010/wordprocessingInk`.
 *
 * @public
 */
export const WORDPROCESSING_INK_URI: Literal<'http://schemas.microsoft.com/office/word/2010/wordprocessingInk'> =
  'http://schemas.microsoft.com/office/word/2010/wordprocessingInk';
