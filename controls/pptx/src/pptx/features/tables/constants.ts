/**
 * DrawingML table graphicData URI and feature id (optional `tables` module).
 *
 * @remarks
 * The URI is the exact Transitional value on `a:graphicData/@uri` for tables.
 * Element `a:tbl` itself lives in the DrawingML **main** namespace (`DML_NS`), not
 * this URI namespace. Citation: advisory drawing-media routing; `dml-main.xsd`
 * element `tbl` / `CT_Table`.
 *
 * @packageDocumentation
 */
/**
 * Exact `a:graphicData/@uri` for DrawingML tables.
 *
 * @public
 */
export const DRAWINGML_TABLE_URI: string = 'http://schemas.openxmlformats.org/drawingml/2006/table';
/**
 * Feature registry id for the optional tables module.
 *
 * @public
 */
export const TABLES_FEATURE_ID: string = 'tables';
