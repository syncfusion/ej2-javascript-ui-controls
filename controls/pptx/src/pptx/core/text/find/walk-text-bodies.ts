import { arrayAt } from '../../util/es5-compat';
/**
 * Discover searchable text bodies on a slide (shapes + table cells).
 *
 * @remarks
 * Spec 035 walk order: shape-tree document order (depth-first via
 * walkSlideShapeTree), then for each shape either direct txBody
 * paragraphs or, for DrawingML table graphic frames, cell a:txBody in
 * row-major (r, c) order. Notes / masters / layouts are not walked here.
 *
 * Table discovery uses core DOM only (a:graphic → a:graphicData @uri →
 * a:tbl → a:tr → a:tc → a:txBody) so find does not import
 * src/pptx/features/tables (no core→features cycle). Citation: dml-main
 * CT_Table / CT_TableCell; DRAWINGML_TABLE_URI.
 *
 * @internal
 */
import { SecurityLimits } from '../../security/limits';
import { DRAWINGML_TABLE_URI } from '../../presentation/shapetype';
import { DML_NS } from '../../shapes/constants';
import { findChild, getAttr } from '../../shapes/dom-utils';
import { Shape } from '../../shapes/shape';
import { OoxmlElement, OoxmlText } from '../../xml/dom';
import { TextBody } from '../text-body';
/**
 * One searchable text surface on a slide.
 *
 * @internal
 */
export interface TextBodySurface {
    readonly shape: Shape;
    readonly textBody: TextBody;
    readonly tableRow?: number;
    readonly tableColumn?: number;
}
// eslint-disable-next-line jsdoc/require-returns-check -- generator yields; no return expression
/**
 * Yields text bodies for one shape in search order.
 *
 * @internal
 * @param {Shape} shape - Shape from the flat slide walk (includes group descendants).
 * @returns {IterableIterator} Surfaces in document order for this shape.
 */
export function* iterTextBodiesOnShape(shape: Shape): IterableIterator<TextBodySurface> {
    if (shape.elementKind === 'graphicFrame') {
        const tableSurfaces: Array<TextBodySurface> = collectTableCellSurfaces(shape);
        if (tableSurfaces !== undefined) {
            yield* tableSurfaces;
            return;
        }
    }
    const body: TextBody = shape.textBody;
    if (body !== undefined) {
        yield { shape, textBody: body };
    }
}
/**
 * Row-major table cell text bodies when `shape` is a DrawingML table frame.
 *
 * @internal
 * @param {Shape} shape - The shape value.
 * @returns {*} Surfaces, or `undefined` when not a resolvable table (skip interior).
 */
function collectTableCellSurfaces(shape: Shape): TextBodySurface[] | undefined {
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
    // Prefer same handleability as features asTable: require tblGrid.
    if (findChild(tbl, DML_NS, 'tblGrid') === undefined) {
        return undefined;
    }
    const limits: SecurityLimits = shape.getSecurityLimits();
    const partName: string = shape.getPartName();
    const surfaces: TextBodySurface[] = [];
    let row: number = 0;
    for (let i: number = 0; i < tbl.children.length; i++) {
        const child: OoxmlElement | OoxmlText = arrayAt(tbl.children, i);
        if (child.kind !== 'element' || child.namespaceUri !== DML_NS || child.localName !== 'tr') {
            continue;
        }
        let col: number = 0;
        for (let j: number = 0; j < child.children.length; j++) {
            const cellChild: OoxmlElement | OoxmlText = arrayAt(child.children, j);
            if (cellChild.kind !== 'element' ||
                cellChild.namespaceUri !== DML_NS ||
                cellChild.localName !== 'tc') {
                continue;
            }
            const txBodyEl: OoxmlElement = findChild(cellChild, DML_NS, 'txBody');
            if (txBodyEl !== undefined) {
                surfaces.push({
                    shape,
                    textBody: createTextBody(txBodyEl, limits, partName),
                    tableRow: row,
                    tableColumn: col
                });
            }
            col += 1;

        }
        row += 1;

    }
    return surfaces;
}
/**
 *
 * @param {OoxmlElement} txBody - The txBody value.
 * @param {SecurityLimits} limits - The limits value.
 * @param {string | undefined} partName - The partName value.
 * @returns {TextBody} The result.
 */
function createTextBody(txBody: OoxmlElement, limits: SecurityLimits, partName: string | undefined): TextBody {
    return new TextBody(txBody, limits, partName);
}
