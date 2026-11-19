/**
 * Detect a DrawingML table under a `graphicFrame` shape and bind a {@link Table}.
 *
 * @remarks
 * Detection path (spec 014):
 * `kind === 'graphicFrame'` → `a:graphic` → `a:graphicData` with exact table URI →
 * child `a:tbl` with `a:tblGrid`. URI match without `tbl` is not a table handle
 * (opaque preserve). Citation: Transitional `pml.xsd` `CT_GraphicalObjectFrame`;
 * `dml-main.xsd` `CT_Table` / element `tbl`.
 */
import { DML_NS } from '../../core/shapes/constants';
import { findChild, getAttr } from '../../core/shapes/dom-utils';
import { PictureMediaAccess } from '../../core/pictures/index';
import { Shape, ShapeElementKind, ShapeMaterializer } from '../../core/shapes/shape';
import { SecurityLimits } from '../../core/security/limits';
import { DRAWINGML_TABLE_URI } from './constants';
import { Table } from './table';
import { OoxmlElement } from '../../core/xml/dom';   
/**
 * Returns a {@link Table} when `shape` is a table graphic frame; otherwise `undefined`.
 *
 * @public
 * @param {Shape} shape - Shape handle from the slide/group walk (`graphicFrame` or other).
 * @returns {Table | undefined} Bound table, or `undefined` for non-tables / wrong URI / missing `a:tbl`.
 */
export function asTable(shape: Shape): Table | undefined {
    if (shape instanceof Table) {
        return shape;
    }
    if (shape.elementKind !== 'graphicFrame') {
        return undefined;
    }
    const frame: OoxmlElement = shape.getHostElement(); 
    const graphic: OoxmlElement = findChild(frame, DML_NS, 'graphic');
    if (graphic === undefined) {
        return undefined;
    }
    const graphicData: OoxmlElement = findChild(graphic, DML_NS, 'graphicData');
    if (graphicData === undefined) {
        return undefined;
    }
    const uri: string = getAttr(graphicData, '', 'uri');
    if (uri !== DRAWINGML_TABLE_URI) {
        return undefined;
    }
    const tbl: OoxmlElement = findChild(graphicData, DML_NS, 'tbl');
    if (tbl === undefined) {
        return undefined;
    }
    // Required tblGrid per CT_Table — missing grid → not a table handle.
    if (findChild(tbl, DML_NS, 'tblGrid') === undefined) {
        return undefined;
    }
    return new Table(tbl, shape.getSecurityLimits(), shape.getPartName(), (): void => { shape.notifyAdapterMutation(); });
}
/**
 * Walk hook. Same detection as {@link asTable}. The returned handle is that
 * {@link Table} with the graphic-frame identity copied on, so `slide.shapes[n]`
 * is `instanceof Table` and still a {@link Shape}. No XML write.
 *
 * @internal
 */
export function materializeTableShape(element: OoxmlElement, elementKind: ShapeElementKind, id: string, name: string,
                                      limits: SecurityLimits, partName: string | undefined, media: PictureMediaAccess | undefined,
                                      groupDepth: number, onMutate: (() => void) | undefined, hostRoot: OoxmlElement | undefined,
                                      groupAncestors: ReadonlyArray<OoxmlElement>): Shape | undefined {
    if (elementKind !== 'graphicFrame') {
        return undefined;
    }
    const probe: Shape = new Shape(element, elementKind, id, name, limits, partName, media, groupDepth, onMutate, hostRoot,
        groupAncestors);
    const table: Table | undefined = asTable(probe);
    if (table === undefined) {
        return undefined;
    }
    table.adoptFrame(probe);
    return table; 
}
/** @internal */
export const tableShapeMaterializer: ShapeMaterializer = materializeTableShape;   
