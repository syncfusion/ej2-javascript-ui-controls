import { Literal } from '../../core/literal-type';
/**
 * SmartArt / DrawingML diagram constants.
 *
 * Citations:
 * - ECMA-376-1 5th ed. §14.2.3–§14.2.6 (diagram parts)
 * - ECMA-376-1 Part 1 Transitional namespaces (schemas.openxmlformats.org)
 * - ECMA-376 Strict namespaces (purl.oclc.org/ooxml/…)
 * - dml-diagram.xsd CT_RelIds / content types
 * - [MS-ODRAWXML] §2.1.3 / §2.10 diagramDrawing extension
 * - Requirement docs/requirements/smart-art-diagrams.md §16.1–§16.2
 */

/** DrawingML diagram namespace (Transitional). dml-diagram.xsd targetNamespace. */
export const DGM_NAMESPACE: Literal<'http://schemas.openxmlformats.org/drawingml/2006/diagram'> =
  'http://schemas.openxmlformats.org/drawingml/2006/diagram';

/** DrawingML diagram namespace (Strict). Accepted on parse only. */
export const DGM_NAMESPACE_STRICT: Literal<'http://purl.oclc.org/ooxml/drawingml/diagram'> = 'http://purl.oclc.org/ooxml/drawingml/diagram';

/** DrawingML main namespace (Transitional). */
export const A_NAMESPACE: Literal<'http://schemas.openxmlformats.org/drawingml/2006/main'> = 'http://schemas.openxmlformats.org/drawingml/2006/main';

/** DrawingML main namespace (Strict). Accepted on parse only. */
export const A_NAMESPACE_STRICT: Literal<'http://purl.oclc.org/ooxml/drawingml/main'> = 'http://purl.oclc.org/ooxml/drawingml/main';

/** Office document relationships namespace (Transitional). */
export const R_NAMESPACE: Literal<'http://schemas.openxmlformats.org/officeDocument/2006/relationships'> =
  'http://schemas.openxmlformats.org/officeDocument/2006/relationships';

/** Office document relationships namespace (Strict). Accepted on parse only. */
export const R_NAMESPACE_STRICT: Literal<'http://purl.oclc.org/ooxml/officeDocument/relationships'> =
  'http://purl.oclc.org/ooxml/officeDocument/relationships';

/** WordprocessingML namespace (Transitional) — host w:drawing. */
export const W_NAMESPACE: Literal<'http://schemas.openxmlformats.org/wordprocessingml/2006/main'> =
  'http://schemas.openxmlformats.org/wordprocessingml/2006/main';

/** WordprocessingML Drawing (wp:) namespace (Transitional). */
export const WP_NAMESPACE: Literal<'http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing'> =
  'http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing';

/**
 * Microsoft Office Drawing diagram extension namespace (`dsp:`).
 * [MS-ODRAWXML] §2.1.3.
 */
export const DSP_NAMESPACE: Literal<'http://schemas.microsoft.com/office/drawing/2008/diagram'> = 'http://schemas.microsoft.com/office/drawing/2008/diagram';

/**
 * Diagram 2010 extension namespace used by `dgm14:recolorImg`.
 * URI of the extension: C62137D5-CB1D-491b-B009-E17868A290BF
 */
export const DGM14_NAMESPACE: Literal<'http://schemas.microsoft.com/office/drawing/2010/diagram'> =
  'http://schemas.microsoft.com/office/drawing/2010/diagram';

/** dgm14:recolorImg extension URI (a:ext/@uri). */
export const DGM14_RECOLOR_IMG_EXT_URI: Literal<'C62137D5-CB1D-491b-B009-E17868A290BF'> = 'C62137D5-CB1D-491b-B009-E17868A290BF';

/**
 * Microsoft dataModelExt extension URI on dataModel/extLst/a:ext.
 * [MS-ODRAWXML] §2.10.1.1 — Word-observed package shape.
 */
export const MS_DIAGRAM_DATA_MODEL_EXT_URI: Literal<'http://schemas.microsoft.com/office/drawing/2008/diagram'> =
  'http://schemas.microsoft.com/office/drawing/2008/diagram';

/**
 * a:graphicData@uri identifying a DrawingML diagram (SmartArt host).
 * ECMA-376 / dml-diagram.xsd; requirement §16.3.
 */
export const DIAGRAM_GRAPHIC_DATA_URI: Literal<'http://schemas.openxmlformats.org/drawingml/2006/diagram'> =
  'http://schemas.openxmlformats.org/drawingml/2006/diagram';

/** Strict form of DIAGRAM_GRAPHIC_DATA_URI — accepted on read. */
export const DIAGRAM_GRAPHIC_DATA_URI_STRICT: Literal<'http://purl.oclc.org/ooxml/drawingml/diagram'> =
  'http://purl.oclc.org/ooxml/drawingml/diagram';

// ── Content types (ECMA-376-1 §14.2.3–§14.2.6; [MS-ODRAWXML] drawing) ──

export const DIAGRAM_DATA_CONTENT_TYPE: Literal<'application/vnd.openxmlformats-officedocument.drawingml.diagramData+xml'> =
  'application/vnd.openxmlformats-officedocument.drawingml.diagramData+xml';

export const DIAGRAM_LAYOUT_CONTENT_TYPE: Literal<'application/vnd.openxmlformats-officedocument.drawingml.diagramLayout+xml'> =
  'application/vnd.openxmlformats-officedocument.drawingml.diagramLayout+xml';

/**
 * Quick style part content type. Note: content type uses `diagramStyle`
 * while the relationship type uses `diagramQuickStyle` (requirement §16.2).
 */
export const DIAGRAM_QUICK_STYLE_CONTENT_TYPE: Literal<'application/vnd.openxmlformats-officedocument.drawingml.diagramStyle+xml'> =
  'application/vnd.openxmlformats-officedocument.drawingml.diagramStyle+xml';

export const DIAGRAM_COLORS_CONTENT_TYPE: Literal<'application/vnd.openxmlformats-officedocument.drawingml.diagramColors+xml'> =
  'application/vnd.openxmlformats-officedocument.drawingml.diagramColors+xml';

/** Microsoft cached diagram drawing part. [MS-ODRAWXML] §2.1.3. */
export const DIAGRAM_DRAWING_CONTENT_TYPE: Literal<'application/vnd.ms-office.drawingml.diagramDrawing+xml'> =
  'application/vnd.ms-office.drawingml.diagramDrawing+xml';

// ── Relationship types ──

export const DIAGRAM_DATA_RELATIONSHIP_TYPE: Literal<'http://schemas.openxmlformats.org/officeDocument/2006/relationships/diagramData'> =
  'http://schemas.openxmlformats.org/officeDocument/2006/relationships/diagramData';

export const DIAGRAM_LAYOUT_RELATIONSHIP_TYPE: Literal<'http://schemas.openxmlformats.org/officeDocument/2006/relationships/diagramLayout'> =
  'http://schemas.openxmlformats.org/officeDocument/2006/relationships/diagramLayout';

export const DIAGRAM_QUICK_STYLE_RELATIONSHIP_TYPE: Literal<'http://schemas.openxmlformats.org/officeDocument/2006/relationships/diagramQuickStyle'> =
  'http://schemas.openxmlformats.org/officeDocument/2006/relationships/diagramQuickStyle';

export const DIAGRAM_COLORS_RELATIONSHIP_TYPE: Literal<'http://schemas.openxmlformats.org/officeDocument/2006/relationships/diagramColors'> =
  'http://schemas.openxmlformats.org/officeDocument/2006/relationships/diagramColors';

/** Microsoft cached drawing relationship. [MS-ODRAWXML] §2.1.3. */
export const DIAGRAM_DRAWING_RELATIONSHIP_TYPE: Literal<'http://schemas.microsoft.com/office/2007/relationships/diagramDrawing'> =
  'http://schemas.microsoft.com/office/2007/relationships/diagramDrawing';

/** Feature id used in run-leaf `{ type: 'feature', featureId: 'diagrams', … }`. */
export const DIAGRAMS_FEATURE_ID: Literal<'diagrams'> = 'diagrams';

/**
 * Soft guards for untrusted diagram graphs (security.md).
 * Surface via typed errors; do not silently truncate.
 */
export const MAX_DIAGRAM_POINTS: Literal<10000> = 10000;
export const MAX_DIAGRAM_CONNECTIONS: Literal<20000> = 20000;

/**
 * True when uri identifies a diagram graphicData (Transitional or Strict).
 *
 * @param {string | null | undefined} uri - The uri.
 * @returns {boolean} The result.
 */
export function isDiagramGraphicDataUri(uri: string | null | undefined): boolean {
    if (uri == null || uri === '') {return false; }
    return uri === DIAGRAM_GRAPHIC_DATA_URI || uri === DIAGRAM_GRAPHIC_DATA_URI_STRICT;
}

/**
 * True when namespace is dgm Transitional or Strict.
 *
 * @param {string | null | undefined} ns - The ns.
 * @returns {boolean} The result.
 */
export function isDgmNamespace(ns: string | null | undefined): boolean {
    if (ns == null || ns === '') {return false; }
    return ns === DGM_NAMESPACE || ns === DGM_NAMESPACE_STRICT;
}

/**
 * True when namespace is DrawingML main Transitional or Strict.
 *
 * @param {string | null | undefined} ns - The ns.
 * @returns {boolean} The result.
 */
export function isANamespace(ns: string | null | undefined): boolean {
    if (ns == null || ns === '') {return false; }
    return ns === A_NAMESPACE || ns === A_NAMESPACE_STRICT;
}

/**
 * True when namespace is relationships Transitional or Strict.
 *
 * @param {string | null | undefined} ns - The ns.
 * @returns {boolean} The result.
 */
export function isRNamespace(ns: string | null | undefined): boolean {
    if (ns == null || ns === '') {return false; }
    return ns === R_NAMESPACE || ns === R_NAMESPACE_STRICT;
}
