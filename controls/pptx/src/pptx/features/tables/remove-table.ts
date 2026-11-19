import { arrayAt } from '../../core/util/es5-compat';
/**
 * Remove an inline DrawingML table from a slide (`removeTable`).
 *
 * @remarks
 * Algorithm (spec 038 / TASK-1086):
 * 1. Resolve `table` → owning `p:graphicFrame` on **this** slide (`a:tbl` identity).
 * 2. If unbound / wrong slide / not a direct `spTree` child → {@link Error}.
 * 3. Splice the frame from `p:spTree` only (no package part GC — tables are inline).
 * 4. Do **not** renumber remaining `cNvPr/@id` values.
 * 5. Do **not** delete `ppt/tableStyles.xml` or other shared parts.
 * 6. Timing / animation targets that still cite the removed id are left as-is
 *    (same non-cleanup as {@link removeChart} — cite `src/pptx/features/charts/remove-chart.ts`;
 *    no orphan-timing product work in this task).
 * 7. Invalidate the {@link Table} handle (`markDetached`); later ops throw
 *    {@link Error}.
 *
 * Citations: req/spec **038**; ADR `2026-09-22-table-create-structural`;
 * AGENTS.md shape-id rule; charts remove frame path without inventing timing strip.
 *
 * @packageDocumentation
 */
import { InvalidPackageError } from '../../core/security/errors';
import { findSpTree } from '../../core/shapes/add-text-box';
import { Shape } from '../../core/shapes/shape';
import { Slide } from '../../core/slideimplementation/slide';
import { OoxmlElement } from '../../core/xml/index';
import { asTable } from './as-table';
import { partNameOptions, TablesError } from './errors';
import { Table } from './table';
/**
 * Removes a table graphic frame from the slide shape tree.
 *
 * @throws {Error} When the handle is detached, not on this slide, or the frame is not a direct `p:spTree` child.
 * @throws {Error} When `p:spTree` is missing.
 * @remarks Does not renumber remaining shape ids. Does not delete `tableStyles` or any other package part. Other shapes and foreign markup
 * stay.
 * @public
 * @param {Slide} slide - Host slide that owns the frame.
 * @param {Table} table - Handle from {@link addTable} or {@link asTable} on this slide.
 * @returns {void} Nothing.
 */
export function removeTable(slide: Slide, table: Table): void {
    const partOpts: { readonly partName?: string; } = partNameOptions(slide.partName);
    if (table.isDetached()) {
        throw new TablesError('Table handle is detached; cannot removeTable again', partOpts);
    }
    const tbl: OoxmlElement = table.getTableElement(); 
    const host: Shape = findHostShapeForTbl(slide, tbl);
    if (host === undefined) {
        throw new TablesError('Table graphic frame is not on this slide', partOpts);
    }
    const frame: OoxmlElement = host.getHostElement(); 
    const root: OoxmlElement = slide.getRoot();
    const spTree: OoxmlElement = findSpTree(root);
    if (spTree === undefined) {
        throw new InvalidPackageError('Slide has no p:spTree; cannot remove table', {
            partName: slide.partName
        });
    }
    const removedFrame: boolean = removeDirectChild(spTree, frame);
    if (!removedFrame) {
        throw new TablesError('Table graphic frame is not a direct child of p:spTree', partOpts);
    }
    table.markDetached();
    slide.notifyMutate();
}
/**
 * Finds a shape on `slide` whose bound table `a:tbl` is the same object as `tbl`.
 *
 * @param {Slide} slide - The slide value.
 * @param {OoxmlElement} tbl - The tbl value.
 * @returns {Shape | undefined} The result.
 */
function findHostShapeForTbl(slide: Slide, tbl: OoxmlElement): Shape | undefined {
    for (let i: number = 0; i < slide.shapes.length; i++) {
        const shape: Shape = arrayAt(slide.shapes, i);
        if (shape.elementKind !== 'graphicFrame') {
            continue;
        }
        const bound: Table = asTable(shape);
        if (bound === undefined) {
            continue;
        }
        if (bound.getTableElement() === tbl) { 
            return shape;
        }

    }
    return undefined;
}
/**
 * @param {object} parent - The parent value.
 * @param {*} parent.children - The parent.children value.
 * @param {*} child - The child value.
 * @returns {boolean} The result.
 */
function removeDirectChild(parent: {
    readonly children: ReadonlyArray<unknown>;
}, child: unknown): boolean {
    const mutable: { children: unknown[]; } = parent as {
        children: unknown[];
    };
    const idx: number = mutable.children.indexOf(child);
    if (idx < 0) {
        return false;
    }
    mutable.children.splice(idx, 1);
    return true;
}
