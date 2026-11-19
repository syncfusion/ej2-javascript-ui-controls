/**
 * Discriminant for the content type of a shape element in a shape tree.
 *
 * @remarks
 * Graphic frames are routed by `a:graphicData/@uri`. Chart, diagram, OLE, and
 * media values require their optional detector module; unsupported graphic
 * payloads remain `unknown` and are preserved opaque.
 *
 * Citation: ECMA-376-1 §20.1.2 (`a:graphicData/@uri`).
 */
export type ShapeType = 'shape' | 'picture' | 'table' | 'chart' | 'diagram' | 'ole' | 'media' | 'unknown';
export const DRAWINGML_TABLE_URI: string = 'http://schemas.openxmlformats.org/drawingml/2006/table';
export const DRAWINGML_CHART_URI: string = 'http://schemas.openxmlformats.org/drawingml/2006/chart';
export const DRAWINGML_DIAGRAM_URI: string = 'http://schemas.openxmlformats.org/drawingml/2006/diagram';
export const PRESENTATION_OLE_URI: string = 'http://schemas.openxmlformats.org/presentationml/2006/ole';
export const P14_NS: string = 'http://schemas.microsoft.com/office/powerpoint/2010/main';
