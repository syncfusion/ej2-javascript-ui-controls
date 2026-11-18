import { Literal } from '../../core/literal-type';
/**
 * DrawingML diagram (SmartArt) package constants — Transitional Office Open XML.
 *
 * @remarks
 * Values are taken from the local standards corpus only. Do not invent content
 * types, relationship URIs, or namespaces.
 *
 * Citations:
 * - Content types: ECMA-376 Part 1 §14.2.3–14.2.6
 * - Root NS + relationship types: ECMA-376 Part 4 §12.2.3–12.2.6
 * - GraphicData URI → `relIds`: [MS-OE376] diagram URI table; [MS-ODRAWXML] §3.7.1
 * @see docs/ooxml-mapping/smart-art.md
 * @packageDocumentation
 */

/**
 * Transitional DrawingML diagram namespace (typical prefix `dgm`).
 *
 * @remarks
 * ECMA-376 Part 4 §12.2.3–12.2.6 list this URI as the root namespace for the
 * Diagram Colors, Data, Layout Definition, and Style parts.
 * @public
 */
export const DIAGRAM_NAMESPACE: Literal<'http://schemas.openxmlformats.org/drawingml/2006/diagram'> =
  'http://schemas.openxmlformats.org/drawingml/2006/diagram';

/**
 * DrawingML main namespace (typical prefix `a`) for `a:graphic` / `a:graphicData`.
 *
 * @remarks
 * Used when identifying diagram hooks: `a:graphicData@uri` equals
 * {@link DIAGRAM_GRAPHIC_DATA_URI} ([MS-OE376], [MS-ODRAWXML] §3.7.1).
 * @public
 */
export const DRAWINGML_MAIN_NAMESPACE: Literal<'http://schemas.openxmlformats.org/drawingml/2006/main'> =
  'http://schemas.openxmlformats.org/drawingml/2006/main';

/**
 * Office document relationships namespace (typical prefix `r`).
 *
 * @remarks
 * `CT_RelIds` attributes `r:dm` / `r:lo` / `r:qs` / `r:cs` are in this namespace
 * (`shared-relationshipReference.xsd`).
 * @public
 */
export const OFFICE_DOCUMENT_RELATIONSHIPS_NAMESPACE: Literal<'http://schemas.openxmlformats.org/officeDocument/2006/relationships'> =
  'http://schemas.openxmlformats.org/officeDocument/2006/relationships';

/**
 * `a:graphicData@uri` value that identifies a diagram (`dgm:relIds`) payload.
 *
 * @remarks
 * Same URI as {@link DIAGRAM_NAMESPACE}. Cited in [MS-OE376] (URI → `relIds`)
 * and [MS-ODRAWXML] §3.7.1 sample markup.
 * @public
 */
export const DIAGRAM_GRAPHIC_DATA_URI: Literal<'http://schemas.openxmlformats.org/drawingml/2006/diagram'> = DIAGRAM_NAMESPACE;

/**
 * Content type for a Diagram Colors part (`colorsDef` root).
 *
 * @remarks
 * ECMA-376 Part 1 §14.2.3.
 * @public
 */
export const DIAGRAM_COLORS_CONTENT_TYPE: Literal<'application/vnd.openxmlformats-officedocument.drawingml.diagramColors+xml'> =
  'application/vnd.openxmlformats-officedocument.drawingml.diagramColors+xml';

/**
 * Content type for a Diagram Data part (`dataModel` root).
 *
 * @remarks
 * ECMA-376 Part 1 §14.2.4.
 * @public
 */
export const DIAGRAM_DATA_CONTENT_TYPE: Literal<'application/vnd.openxmlformats-officedocument.drawingml.diagramData+xml'> =
  'application/vnd.openxmlformats-officedocument.drawingml.diagramData+xml';

/**
 * Content type for a Diagram Layout Definition part (`layoutDef` root).
 *
 * @remarks
 * ECMA-376 Part 1 §14.2.5. Layout parts are not shared across diagrams.
 * @public
 */
export const DIAGRAM_LAYOUT_CONTENT_TYPE: Literal<'application/vnd.openxmlformats-officedocument.drawingml.diagramLayout+xml'> =
  'application/vnd.openxmlformats-officedocument.drawingml.diagramLayout+xml';

/**
 * Content type for a Diagram Style (quick style) part (`styleDef` root).
 *
 * @remarks
 * ECMA-376 Part 1 §14.2.6.
 * @public
 */
export const DIAGRAM_STYLE_CONTENT_TYPE: Literal<'application/vnd.openxmlformats-officedocument.drawingml.diagramStyle+xml'> =
  'application/vnd.openxmlformats-officedocument.drawingml.diagramStyle+xml';

/**
 * Relationship type targeting a Diagram Colors part.
 *
 * @remarks
 * ECMA-376 Part 4 §12.2.3 (Transitional source URI).
 * @public
 */
export const DIAGRAM_COLORS_RELATIONSHIP_TYPE: Literal<'http://schemas.openxmlformats.org/officeDocument/2006/relationships/diagramColors'> =
  'http://schemas.openxmlformats.org/officeDocument/2006/relationships/diagramColors';

/**
 * Relationship type targeting a Diagram Data part.
 *
 * @remarks
 * ECMA-376 Part 4 §12.2.4 (Transitional source URI).
 * @public
 */
export const DIAGRAM_DATA_RELATIONSHIP_TYPE: Literal<'http://schemas.openxmlformats.org/officeDocument/2006/relationships/diagramData'> =
  'http://schemas.openxmlformats.org/officeDocument/2006/relationships/diagramData';

/**
 * Relationship type targeting a Diagram Layout Definition part.
 *
 * @remarks
 * ECMA-376 Part 4 §12.2.5 (Transitional source URI).
 * @public
 */
export const DIAGRAM_LAYOUT_RELATIONSHIP_TYPE: Literal<'http://schemas.openxmlformats.org/officeDocument/2006/relationships/diagramLayout'> =
  'http://schemas.openxmlformats.org/officeDocument/2006/relationships/diagramLayout';

/**
 * Relationship type targeting a Diagram Style (quick style) part.
 *
 * @remarks
 * ECMA-376 Part 4 §12.2.6 (Transitional source URI `diagramQuickStyle`).
 * @public
 */
export const DIAGRAM_QUICK_STYLE_RELATIONSHIP_TYPE: Literal<'http://schemas.openxmlformats.org/officeDocument/2006/relationships/diagramQuickStyle'> =
  'http://schemas.openxmlformats.org/officeDocument/2006/relationships/diagramQuickStyle';

/**
 * Relationship type targeting an Image part (office document package).
 *
 * @remarks
 * ECMA-376 Part 4 Transitional source URI table (`relationships/image`).
 * Diagram Data parts may reference images (Part 1 §14.2.4); remove uses this
 * type when reference-counting exclusive vs shared image parts.
 * @public
 */
export const OFFICE_IMAGE_RELATIONSHIP_TYPE: Literal<'http://schemas.openxmlformats.org/officeDocument/2006/relationships/image'> =
  'http://schemas.openxmlformats.org/officeDocument/2006/relationships/image';

/**
 * All four diagram part content types (Transitional), in package-scan order.
 *
 * @public
 */
export const DIAGRAM_CONTENT_TYPES: ReadonlyArray<string> = Object.freeze([
    DIAGRAM_COLORS_CONTENT_TYPE,
    DIAGRAM_DATA_CONTENT_TYPE,
    DIAGRAM_LAYOUT_CONTENT_TYPE,
    DIAGRAM_STYLE_CONTENT_TYPE
]);

/**
 * All four diagram relationship type URIs (Transitional), matching
 * `dgm:relIds` roles `cs` / `dm` / `lo` / `qs` respectively when ordered as
 * colors, data, layout, quick style.
 *
 * @public
 */
export const DIAGRAM_RELATIONSHIP_TYPES: ReadonlyArray<string> = Object.freeze([
    DIAGRAM_COLORS_RELATIONSHIP_TYPE,
    DIAGRAM_DATA_RELATIONSHIP_TYPE,
    DIAGRAM_LAYOUT_RELATIONSHIP_TYPE,
    DIAGRAM_QUICK_STYLE_RELATIONSHIP_TYPE
]);
