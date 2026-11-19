/**
 * Hand-authored DrawingML table create seeds (`p:graphicFrame` + `a:tbl`).
 *
 * @remarks
 * Internal builders for TASK-1081 / Phase 10. Public `slide.addTable` wiring is
 * TASK-1082. Every element follows Transitional XSD + SF-inspected
 * `corpus/interoperability/sf-table-gridspan` table frame.
 *
 * Citations:
 * - `pml.xsd` `CT_GraphicalObjectFrame` — `nvGraphicFramePr`, required `xfrm`,
 *   required `a:graphic`
 * - `dml-main.xsd` `CT_Table` — `tblPr?`, required `tblGrid`, `tr*`
 * - `CT_TableCol` / `CT_TableRow` — required `@w` / `@h` (EMU)
 * - `CT_TableCell` — `txBody?` (`CT_TextBody`: `bodyPr`, `lstStyle?`, `p+`)
 * - Table URI {@link DRAWINGML_TABLE_URI}
 * - Default style GUID {@link DEFAULT_TABLE_STYLE_LIST_DEF}
 * - SF empty hMerge peer cell: `<a:txBody><a:bodyPr/><a:lstStyle/><a:p/></a:txBody>`
 * - SF 2×2 equal split: `gridCol/@w` = `xfrm` cx / columns; `tr/@h` = cy / rows
 *   (fixture `cx="5080000"` → two `w="2540000"`; `cy="2540000"` → two `h="1270000"`)
 *
 * @packageDocumentation
 */
import { DEFAULT_TABLE_STYLE_LIST_DEF } from '../../core/create/templates';
import { PML_NS } from '../../core/presentation/constants';
import { ShapeBounds } from '../../core/shapes/add-text-box';
import { DML_NS } from '../../core/shapes/constants';
import { coordinateToEmuString, pointsToEmu } from '../../core/util/length-units';
import { OoxmlAttribute, OoxmlElement } from '../../core/xml/dom';
import { DRAWINGML_TABLE_URI } from './constants';
import { arrayAt } from '../../core/util/es5-compat';
/**
 * Default `cNvPr/@name` for a new table frame.
 *
 * @remarks
 * SF fixture uses `"Table 2"`; base name `"Table"` matches chart/text-box pattern
 * (numeric suffix is allocated by callers in TASK-1082).
 *
 * @internal
 */
export const DEFAULT_TABLE_NAME: string = 'Table';
/**
 * Default table frame bounds in **points**: origin, SF-cited extents
 * (wire `5080000` × `2540000` EMU = 400 pt × 200 pt).
 *
 * @remarks
 * From `sf-table-gridspan` `p:xfrm` `a:ext cx="5080000" cy="2540000"` (offset in
 * fixture was `635000`; create defaults use origin like charts/text boxes).
 *
 * @internal
 */
export const DEFAULT_TABLE_BOUNDS: Readonly<ShapeBounds> = Object.freeze({
    x: 0,
    y: 0,
    width: 400,
    height: 200
});
/**
 * Arguments for {@link buildTableGraphicFrame}.
 *
 * @internal
 */
export interface BuildTableGraphicFrameArgs {
    /** `cNvPr/@id` (caller allocates; never renumber survivors). */
    readonly id: string;
    /** `cNvPr/@name`. */
    readonly name: string;
    /** Frame `p:xfrm` bounds in **points**. */
    readonly bounds: ShapeBounds;
    /** Row count (integer ≥ 1). */
    readonly rows: number;
    /** Column count (integer ≥ 1). */
    readonly columns: number;
    /**
     * Per-row heights in **points** (written as `a:tr/@h` EMU). When omitted or
     * empty, equal-split of `bounds.height` (SF-cited). When set, length must
     * equal `rows`; each value must convert to integer EMU ≥ 1.
     */
    readonly rowHeights?: ReadonlyArray<number>;
    /**
     * Per-column widths in **points** (written as `a:gridCol/@w` EMU). When
     * omitted or empty, equal-split of `bounds.width` (SF-cited). When set,
     * length must equal `columns`; each value must convert to integer EMU ≥ 1.
     */
    readonly columnWidths?: ReadonlyArray<number>;
    /**
     * `a:tableStyleId` text. Default {@link DEFAULT_TABLE_STYLE_LIST_DEF}.
     * Pass `null` to omit `a:tblPr` / style id entirely.
     */
    readonly tableStyleId?: string | null;
}
/**
 * Builds a complete table `p:graphicFrame` with inline `a:tbl`.
 *
 * @internal
 * @param {BuildTableGraphicFrameArgs} args - Frame id/name/bounds and grid dimensions.
 * @returns {OoxmlElement} DOM element ready to insert under `p:spTree`.
 */
export function buildTableGraphicFrame(args: BuildTableGraphicFrameArgs): OoxmlElement {
    // Spread only defined optionals so exactOptionalPropertyTypes stays happy.
    const tbl: OoxmlElement = buildTbl({
        rows: args.rows,
        columns: args.columns,
        bounds: args.bounds,
        ...(args.rowHeights !== undefined ? { rowHeights: args.rowHeights } : {}),
        ...(args.columnWidths !== undefined ? { columnWidths: args.columnWidths } : {}),
        ...(args.tableStyleId !== undefined ? { tableStyleId: args.tableStyleId } : {})
    });
    const cNvPr: OoxmlElement = el(PML_NS, 'cNvPr', 'p', [attr('', 'id', args.id), attr('', 'name', args.name)], []);
    const cNvGraphicFramePr: OoxmlElement = el(PML_NS, 'cNvGraphicFramePr', 'p', [], []);
    const nvPr: OoxmlElement = el(PML_NS, 'nvPr', 'p', [], []);
    const nvGraphicFramePr: OoxmlElement = el(PML_NS, 'nvGraphicFramePr', 'p', [], [cNvPr, cNvGraphicFramePr, nvPr]);
    const off: OoxmlElement = el(DML_NS, 'off', 'a', [
        attr('', 'x', coordinateToEmuString(args.bounds.x, 'bounds.x')),
        attr('', 'y', coordinateToEmuString(args.bounds.y, 'bounds.y'))
    ], []);
    const ext: OoxmlElement = el(DML_NS, 'ext', 'a', [
        attr('', 'cx', coordinateToEmuString(args.bounds.width, 'bounds.width')),
        attr('', 'cy', coordinateToEmuString(args.bounds.height, 'bounds.height'))
    ], []);
    // SF fixture may set rot="0"; schema optional — omit (charts omit).
    const xfrmEl: OoxmlElement = el(PML_NS, 'xfrm', 'p', [], [off, ext]);
    const graphicData: OoxmlElement = el(DML_NS, 'graphicData', 'a', [attr('', 'uri', DRAWINGML_TABLE_URI)], [tbl]);
    const graphic: OoxmlElement = el(DML_NS, 'graphic', 'a', [], [graphicData]);
    return el(PML_NS, 'graphicFrame', 'p', [], [nvGraphicFramePr, xfrmEl, graphic]);
}
/**
 * Arguments for {@link buildTbl}.
 *
 * @internal
 */
export interface BuildTblArgs {
    readonly rows: number;
    readonly columns: number;
    readonly bounds: ShapeBounds;
    readonly rowHeights?: ReadonlyArray<number>;
    readonly columnWidths?: ReadonlyArray<number>;
    readonly tableStyleId?: string | null;
}
/**
 * Builds `a:tbl` (`CT_Table`) with grid + empty cells.
 *
 * @internal
 * @param {BuildTblArgs} args - The args value.
 * @returns {OoxmlElement} The result.
 */
export function buildTbl(args: BuildTblArgs): OoxmlElement {
    assertPositiveInteger(args.rows, 'rows');
    assertPositiveInteger(args.columns, 'columns');
    const colWidths: Array<number> = resolveColumnWidthsEmu(args.columns, args.bounds.width, args.columnWidths);
    const rowHeights: Array<number> = resolveRowHeightsEmu(args.rows, args.bounds.height, args.rowHeights);
    const gridCols: OoxmlElement[] = colWidths.map((w: number) => el(DML_NS, 'gridCol', 'a', [attr('', 'w', String(w))], []));
    const tblGrid: OoxmlElement = el(DML_NS, 'tblGrid', 'a', [], gridCols);
    const rows: OoxmlElement[] = [];
    for (let r: number = 0; r < args.rows; r += 1) {
        const cells: OoxmlElement[] = [];
        for (let c: number = 0; c < args.columns; c += 1) {
            cells.push(buildEmptyTableCell());
        }
        const rowH: number = arrayAt(rowHeights, r);
        if (rowH === undefined) {
            throw new RangeError(`missing row height at index ${String(r)}`);
        }
        rows.push(el(DML_NS, 'tr', 'a', [attr('', 'h', String(rowH))], cells));
    }
    const children: OoxmlElement[] = [];
    const styleId: string = args.tableStyleId === null
        ? undefined
        : ((args.tableStyleId !== null && args.tableStyleId !== undefined ? args.tableStyleId : DEFAULT_TABLE_STYLE_LIST_DEF));
    if (styleId !== undefined) {
        // SF: tblPr firstRow="1" bandRow="1" + tableStyleId GUID (CT_TableProperties).
        const tableStyleIdEl: OoxmlElement = el(DML_NS, 'tableStyleId', 'a', [], [], undefined, styleId);
        const tblPr: OoxmlElement = el(DML_NS, 'tblPr', 'a', [attr('', 'firstRow', '1'), attr('', 'bandRow', '1')], [tableStyleIdEl]);
        children.push(tblPr);
    }
    children.push(tblGrid);
    for (let i: number = 0; i < rows.length; i++) {
        const row: OoxmlElement = arrayAt(rows, i);
        children.push(row);

    }
    return el(DML_NS, 'tbl', 'a', [], children);
}
/**
 * Minimal empty `a:tc` with SF-cited empty `a:txBody` (no text run).
 *
 * @remarks SF empty peer cell (hMerge): bodyPr + lstStyle + empty `p`. Schema allows omitting `txBody` (`CT_TableCell`); SF/Office always
 * emit it — include for open-without-repair. No merge attrs. No invented `tcPr` fills/lines.
 * @internal
 * @returns {OoxmlElement} The result.
 */
export function buildEmptyTableCell(): OoxmlElement {
    const bodyPr: OoxmlElement = el(DML_NS, 'bodyPr', 'a', [], []);
    const lstStyle: OoxmlElement = el(DML_NS, 'lstStyle', 'a', [], []);
    const p: OoxmlElement = el(DML_NS, 'p', 'a', [], []);
    const txBody: OoxmlElement = el(DML_NS, 'txBody', 'a', [], [bodyPr, lstStyle, p]);
    return el(DML_NS, 'tc', 'a', [], [txBody]);
}
/**
 * Equal-split (or explicit) column widths in wire EMUs; last column absorbs
 * remainder so sum equals frame width EMU when using equal split.
 *
 * @internal
 * @param {number} columns - The columns value.
 * @param {number | string} frameWidthPoints - Frame width in **points** (`number`) or already-EMU
 * @param {*} explicit - Optional per-column widths in **points**.
 * @returns {number[]} The result.
 */
export function resolveColumnWidthsEmu(columns: number, frameWidthPoints: number | string, explicit?: ReadonlyArray<number>): number[] {
    return resolvePositiveEmuList(columns, frameWidthPoints, explicit, 'columnWidths');
}
/**
 * Equal-split (or explicit) row heights in wire EMUs; last row absorbs remainder.
 *
 * @internal
 * @param {number} rows - The rows value.
 * @param {number | string} frameHeightPoints - Frame height in **points** (`number`) or already-EMU
 * @param {*} explicit - Optional per-row heights in **points**.
 * @returns {number[]} The result.
 */
export function resolveRowHeightsEmu(rows: number, frameHeightPoints: number | string, explicit?: ReadonlyArray<number>): number[] {
    return resolvePositiveEmuList(rows, frameHeightPoints, explicit, 'rowHeights');
}
/**
 *
 * @param {number} count - The count value.
 * @param {number | string} frameExtentPoints - The frameExtentPoints value.
 * @param {*} explicit - The explicit value.
 * @param {string} label - The label value.
 * @returns {number[]} The result.
 */
function resolvePositiveEmuList(count: number, frameExtentPoints: number | string, explicit: ReadonlyArray<number> | undefined,
                                label: string): number[] {
    assertPositiveInteger(count, 'count');
    if (explicit !== undefined && explicit.length > 0) {
        if (explicit.length !== count) {
            throw new RangeError(`${label} length ${String(explicit.length)} must equal dimension ${String(count)}`);
        }
        const out: number[] = [];
        for (let i: number = 0; i < explicit.length; i += 1) {
            const v: number = arrayAt(explicit, i);
            if (v === undefined || typeof v !== 'number' || !Number.isFinite(v)) {
                throw new RangeError(`${label}[${String(i)}] must be a finite number of points`);
            }
            const emu: number = pointsToEmu(v);
            if (!Number.isInteger(emu) || emu < 1) {
                throw new RangeError(`${label}[${String(i)}] must convert to an integer EMU >= 1`);
            }
            out.push(emu);
        }
        return out;
    }
    const total: number = extentToEmu(frameExtentPoints, 'bounds extent');
    if (!Number.isInteger(total) || total < count) {
        throw new RangeError(`bounds extent ${String(total)} EMU must be an integer >= column/row count ${String(count)} for equal split`);
    }
    const base: number = Math.floor(total / count);
    const remainder: number = total - base * count;
    const out: number[] = [];
    for (let i: number = 0; i < count; i += 1) {
        // Put remainder on the last cell so sum === total (SF equal halves when divisible).
        out.push(i === count - 1 ? base + remainder : base);
    }
    return out;
}
/**
 *
 * @param {number | string} value - The value value.
 * @param {string} label - The label value.
 * @returns {number} The result.
 */
function extentToEmu(value: number | string, label: string): number {
    if (typeof value === 'number') {
        return pointsToEmu(value);
    }
    const n: number = Number(value);
    if (!Number.isFinite(n)) {
        throw new RangeError(`${label} is not a finite EMU decimal string`);
    }
    return Math.round(n);
}
/**
 *
 * @param {number} value - The value value.
 * @param {string} label - The label value.
 * @returns {void} Nothing.
 */
function assertPositiveInteger(value: number, label: string): void {
    if (!Number.isInteger(value) || value < 1) {
        throw new RangeError(`${label} must be an integer >= 1`);
    }
}
/**
 *
 * @param {string} namespaceUri - The namespaceUri value.
 * @param {string} localName - The localName value.
 * @param {string} value - The value value.
 * @param {string} prefix - The prefix value.
 * @returns {OoxmlAttribute} The result.
 */
function attr(namespaceUri: string, localName: string, value: string, prefix?: string): OoxmlAttribute {
    if (prefix !== undefined) {
        return { namespaceUri, localName, value, prefix };
    }
    return { namespaceUri, localName, value };
}
/**
 *
 * @param {string} namespaceUri - The namespaceUri value.
 * @param {string} localName - The localName value.
 * @param {string} prefixHint - The prefixHint value.
 * @param {*} attributes - The attributes value.
 * @param {*} children - The children value.
 * @param {*} namespaceDeclarations - Namespace declarations.
 * @param {string} textContent - The textContent value.
 * @returns {OoxmlElement} The result.
 */
function el(namespaceUri: string, localName: string, prefixHint: string, attributes: ReadonlyArray<OoxmlAttribute>,
            children: ReadonlyArray<OoxmlElement>, namespaceDeclarations?: ReadonlyArray<{
                readonly prefix: string;
                readonly uri: string;
            }>, textContent?: string): OoxmlElement {
    const kids: (OoxmlElement | {
        kind: 'text';
        text: string;
    })[] = textContent !== undefined
        ? [...children, { kind: 'text' as 'text', text: textContent }]
        : [...children];
    if (namespaceDeclarations !== undefined && namespaceDeclarations.length > 0) {
        return {
            kind: 'element' as 'element',
            namespaceUri,
            localName,
            attributes,
            children: kids,
            prefixHint,
            namespaceDeclarations
        };
    }
    return {
        kind: 'element' as 'element',
        namespaceUri,
        localName,
        attributes,
        children: kids,
        prefixHint
    };
}
