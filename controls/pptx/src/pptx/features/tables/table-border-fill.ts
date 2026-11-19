/** Atomic direct cell-border fills; optional table module only. */
import { OoxmlElement, OoxmlText } from '../../core/xml/dom';
import { asMutable, findChild } from '../../core/shapes/dom-utils';
import { buildGradientFill, GradientFillError } from '../../core/shapes/write-gradient-fill';
import { GradientFillOptions } from '../../core/shapes/gradient-fill-options';
import { replaceLineFill } from '../../core/shapes/mutate-decoration-fill';
import { TextLineFillSnapshot, readDrawingFillChoice } from '../../core/text/character-fills';
import { tableFillNamespace, tableFillProperties } from './table-fill';
import { arrayAt } from '../../core/util/es5-compat';
/** Physical cell border names, matching the existing render snapshot. @public */
export type TableCellBorder = 'left' | 'right' | 'top' | 'bottom' | 'insideDiagonalDown' | 'insideDiagonalUp';
/** One complete gradient replacement in an atomic same-cell batch. @public */
export interface TableBorderGradientUpdate {
    readonly border: TableCellBorder;
    readonly gradient: GradientFillOptions;
}
/** Complete authored border fill carriers; missing line differs from line with missing fill. @public */
export type AuthoredTableCellBorders = Readonly<Record<TableCellBorder, TextLineFillSnapshot>>;
/** Prevalidated fill-only commit plan. */
interface BorderFillUpdate { readonly border: TableCellBorder; readonly fill: OoxmlElement | undefined; }
const BORDERS: ReadonlyArray<TableCellBorder> = ['left', 'right', 'top', 'bottom', 'insideDiagonalDown', 'insideDiagonalUp'];
const HOSTS: ReadonlyArray<string> = ['lnL', 'lnR', 'lnT', 'lnB', 'lnTlToBr', 'lnBlToTr'];
const CELL_FOLLOWING: ReadonlyArray<string> = ['cell3D', 'noFill', 'solidFill', 'gradFill', 'blipFill', 'pattFill', 'grpFill', 'headers', 'extLst'];
/**
 * @param {TableCellBorder} border - Public physical edge name.
 * @param {string} partName - Source identity.
 * @returns {string} Exact DrawingML host.
 * @internal
 */
export function tableBorderHost(border: TableCellBorder, partName?: string): string {
    const index: number = BORDERS.indexOf(border);
    if (index < 0) { throw new GradientFillError(partName, 'border.target'); }
    return arrayAt(HOSTS, index);
}
/**
 * @param {OoxmlElement} cell - Exact physical cell.
 * @param {TableCellBorder} border - Selected border.
 * @param {string} partName - Source identity.
 * @returns {OoxmlElement | undefined} Selected live line.
 * @internal
 */
export function tableBorderLine(cell: OoxmlElement, border: TableCellBorder, partName?: string): OoxmlElement | undefined {
    const ns: string = tableFillNamespace(cell, partName);
    if (cell.localName !== 'tc') { throw new GradientFillError(partName, 'border.host'); }
    const name: string = tableBorderHost(border, partName);
    const properties: OoxmlElement | undefined = tableFillProperties(cell);
    return properties === undefined ? undefined : findChild(properties, ns, name);
}
/**
 * @param {OoxmlElement} cell - Exact physical cell.
 * @param {string} partName - Source identity.
 * @returns {AuthoredTableCellBorders} Complete sparse direct fills, without style resolution.
 * @internal
 */
export function readTableBorderFills(cell: OoxmlElement, partName?: string): AuthoredTableCellBorders {
    /**
     * @param {TableCellBorder} border - Selected edge.
     * @returns {TextLineFillSnapshot} Direct line presence and canonical fill.
     */
    function read(border: TableCellBorder): TextLineFillSnapshot {
        const line: OoxmlElement | undefined = tableBorderLine(cell, border, partName);
        return line === undefined ? { kind: 'missing' } :
            { kind: 'line', fill: readDrawingFillChoice(line, cell.namespaceUri, partName) };
    }
    return { left: read('left'), right: read('right'), top: read('top'), bottom: read('bottom'),
        insideDiagonalDown: read('insideDiagonalDown'), insideDiagonalUp: read('insideDiagonalUp') };
}
/**
 * @param {OoxmlElement} cell - Exact physical cell.
 * @param {ReadonlyArray<TableBorderGradientUpdate>} updates - All updates validated before any live write.
 * @param {string} partName - Source identity.
 * @returns {boolean} Whether one atomic batch committed.
 * @internal
 */
export function setTableBorderGradients(cell: OoxmlElement, updates: ReadonlyArray<TableBorderGradientUpdate>, partName?: string): boolean {
    const ns: string = tableFillNamespace(cell, partName);
    if (cell.localName !== 'tc' || !Array.isArray(updates) || updates.length > BORDERS.length) {
        throw new GradientFillError(partName, 'border.updates');
    }
    const seen: Set<string> = new Set();
    const prepared: Array<{ border: TableCellBorder; fill: OoxmlElement }> = [];
    for (let i: number = 0; i < updates.length; i++) {
        const update: TableBorderGradientUpdate | undefined = arrayAt(updates, i);
        if (update === undefined || update === null) { throw new GradientFillError(partName, 'border.update'); }
        const host: string = tableBorderHost(update.border, partName);
        if (seen.has(host)) { throw new GradientFillError(partName, 'border.duplicate'); }
        seen.add(host); prepared.push({ border: update.border, fill: buildGradientFill(update.gradient, ns, partName) });
    }
    return commitBorderFills(cell, prepared, partName);
}
/**
 * @param {OoxmlElement} cell - Exact physical cell.
 * @param {ReadonlyArray<BorderFillUpdate>} updates - Prevalidated replacements or reset.
 * @param {string} partName - Source identity.
 * @returns {boolean} Whether a batch committed; line metadata and node identities remain intact.
 * @internal
 */
export function commitBorderFills(cell: OoxmlElement,
                                  updates: ReadonlyArray<BorderFillUpdate>, partName?: string): boolean {
    const ns: string = tableFillNamespace(cell, partName);
    if (cell.localName !== 'tc') { throw new GradientFillError(partName, 'border.host'); }
    const old: OoxmlElement | undefined = tableFillProperties(cell);
    const properties: OoxmlElement = old || { kind: 'element', namespaceUri: ns, localName: 'tcPr',
        prefixHint: cell.prefixHint, attributes: [], children: [] };
    const children: Array<OoxmlElement | OoxmlText> = properties.children.slice();
    const plans: Array<{ line: OoxmlElement; children: ReadonlyArray<OoxmlElement | OoxmlText> }> = [];
    updates.forEach((update: BorderFillUpdate): void => {
        const name: string = tableBorderHost(update.border, partName);
        const line: OoxmlElement | undefined = old === undefined ? undefined : findChild(old, ns, name);
        if (line === undefined && update.fill === undefined) { return; }
        const draft: OoxmlElement = line === undefined ? { kind: 'element', namespaceUri: ns, localName: name,
            prefixHint: 'a', attributes: [], children: [] } : { ...line, children: line.children.slice() };
        if (!replaceLineFill(draft, ns, update.fill)) { return; }
        if (line !== undefined) { plans.push({ line, children: draft.children }); return; }
        let at: number = children.length;
        for (let i: number = 0; i < children.length; i++) {
            const child: OoxmlElement | OoxmlText = arrayAt(children, i);
            if (child.kind !== 'element' || child.namespaceUri !== ns) { continue; }
            if (HOSTS.indexOf(child.localName) > HOSTS.indexOf(name) || CELL_FOLLOWING.indexOf(child.localName) >= 0) { at = i; break; }
        }
        children.splice(at, 0, draft);
    });
    if (plans.length === 0 && children.length === properties.children.length) { return false; }
    const cellChildren: Array<OoxmlElement | OoxmlText> = cell.children.slice();
    if (old === undefined) {
        let at: number = cellChildren.length;
        for (let i: number = 0; i < cellChildren.length; i++) {
            const child: OoxmlElement | OoxmlText = arrayAt(cellChildren, i);
            if (child.kind === 'element' && child.namespaceUri === ns && child.localName === 'extLst') { at = i; break; }
        }
        cellChildren.splice(at, 0, properties);
    }
    plans.forEach((plan: { line: OoxmlElement; children: ReadonlyArray<OoxmlElement | OoxmlText> }): void => {
        asMutable(plan.line).children = plan.children.slice();
    });
    asMutable(properties).children = children;
    if (old === undefined) { asMutable(cell).children = cellChildren; }
    return true;
}
