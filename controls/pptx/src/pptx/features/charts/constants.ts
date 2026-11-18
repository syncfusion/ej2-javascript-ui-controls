/**
 * DrawingML chart URI and feature id for the optional charts module.
 *
 * @remarks
 * Graphic-data URI matches ECMA-376 / core {@link DRAWINGML_CHART_URI}.
 * Feature id is registered only when the optional `./charts` entry loads
 * (TASK-1066 CH-0). Authoring APIs land in later Phase 9 tasks.
 *
 * Citation: ECMA-376-1 §20.1.2 (`a:graphicData/@uri`);
 * `http://schemas.openxmlformats.org/drawingml/2006/chart`.
 *
 * @packageDocumentation
 */
import { DRAWINGML_CHART_URI as CORE_DRAWINGML_CHART_URI } from '../../core/presentation/shapetype';
/**
 * Exact `a:graphicData/@uri` for classic DrawingML charts.
 *
 * @remarks
 * Same value as core `DRAWINGML_CHART_URI`
 * (`http://schemas.openxmlformats.org/drawingml/2006/chart`).
 *
 * @public
 */
export const DRAWINGML_CHART_URI: string = CORE_DRAWINGML_CHART_URI;
/**
 * Feature registry id for the optional charts module.
 *
 * @public
 */
export const CHARTS_FEATURE_ID: string = 'charts';
/**
 * Chart part content type (ECMA-376 Part 1 §14.2.1).
 *
 * @remarks
 * Root element is `chartSpace`. Citation (local corpus):
 * `specs/ecma/ECMA-376-1_5th_edition_december_2016/…Part 1…` §14.2.1 —
 * Content Type: `application/vnd.openxmlformats-officedocument.drawingml.chart+xml`.
 *
 * @public
 */
export const CHART_CONTENT_TYPE: string = 'application/vnd.openxmlformats-officedocument.drawingml.chart+xml';
/**
 * Chart part relationship type (Transitional).
 *
 * @remarks
 * Slide (and other hosts) target Chart parts with this type.
 * Citation: ECMA-376 Part 4 §12.2.1 —
 * `http://schemas.openxmlformats.org/officeDocument/2006/relationships/chart`.
 *
 * @public
 */
export const CHART_RELATIONSHIP_TYPE: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/chart';
/**
 * Chart Drawing (userShapes) part content type (ECMA-376 Part 1 §14.2.2).
 *
 * @remarks
 * Citation: §14.2.2 Content Type —
 * `application/vnd.openxmlformats-officedocument.drawingml.chartshapes+xml`.
 *
 * @public
 */
export const CHART_USER_SHAPES_CONTENT_TYPE: string = 'application/vnd.openxmlformats-officedocument.drawingml.chartshapes+xml';
/**
 * Chart Drawing relationship type (Transitional) — chart → userShapes.
 *
 * @remarks
 * Citation: ECMA-376 Part 4 §12.2.2 —
 * `http://schemas.openxmlformats.org/officeDocument/2006/relationships/chartUserShapes`.
 *
 * @public
 */
export const CHART_USER_SHAPES_RELATIONSHIP_TYPE: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/chartUserShapes';
/**
 * Chart Colors part content type ([MS-ODRAWXML] 2.1.1).
 *
 * @remarks
 * Citation: `specs/microsoft/[MS-ODRAWXML].md` 2.1.1 —
 * `application/vnd.ms-office.chartcolorstyle+xml`. Sibling of the Chart part.
 *
 * @public
 */
export const CHART_COLOR_STYLE_CONTENT_TYPE: string = 'application/vnd.ms-office.chartcolorstyle+xml';
/**
 * Chart Colors relationship type ([MS-ODRAWXML] 2.1.1).
 *
 * @remarks
 * Citation: `specs/microsoft/[MS-ODRAWXML].md` 2.1.1 —
 * `http://schemas.microsoft.com/office/2012/relationships/chartColorStyle`.
 *
 * @public
 */
export const CHART_COLOR_STYLE_RELATIONSHIP_TYPE: string = 'http://schemas.microsoft.com/office/2012/relationships/chartColorStyle';
/**
 * Chart Style part content type ([MS-ODRAWXML] 2.1.2).
 *
 * @remarks
 * Citation: `specs/microsoft/[MS-ODRAWXML].md` 2.1.2 —
 * `application/vnd.ms-office.chartstyle+xml`. Sibling of the Chart part.
 *
 * @public
 */
export const CHART_STYLE_CONTENT_TYPE: string = 'application/vnd.ms-office.chartstyle+xml';
/**
 * Chart Style relationship type ([MS-ODRAWXML] 2.1.2).
 *
 * @remarks
 * Citation: `specs/microsoft/[MS-ODRAWXML].md` 2.1.2 —
 * `http://schemas.microsoft.com/office/2012/relationships/chartStyle`.
 *
 * @public
 */
export const CHART_STYLE_RELATIONSHIP_TYPE: string = 'http://schemas.microsoft.com/office/2012/relationships/chartStyle';
/**
 * Embedded Package relationship type (Transitional; chart → workbook embedding).
 *
 * @remarks
 * Chart data for PresentationML is stored in an embedded SpreadsheetML package
 * (Part 1 §14.2.1 / §15.2.11). Citation: ECMA-376 Part 4 §13.2.9 —
 * `http://schemas.openxmlformats.org/officeDocument/2006/relationships/package`.
 * TASK-1067 classifies the relationship only; it does **not** open embeddings.
 *
 * @public
 */
export const EMBEDDED_PACKAGE_RELATIONSHIP_TYPE: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/package';
