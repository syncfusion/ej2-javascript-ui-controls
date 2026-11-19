import { AuthoredTableCellBorders, TableCellBorder, TableBorderGradientUpdate, readTableBorderFills,
    setTableBorderGradients, commitBorderFills, tableBorderLine } from './table-border-fill';
import { DirectFill } from '../../core/shapes/fill-line-types';
import { AuthoredGradientFill } from '../../core/theme/gradient-types';
import { GradientFillOptions } from '../../core/shapes/gradient-fill-options';
import { GradientStopEditor } from '../../core/shapes/gradient-stop-editor';
import { buildGradientFill } from '../../core/shapes/write-gradient-fill';
import { tableFillNamespace, tableGradientElement, readTableFill, readTableGradient, commitTableFill } from './table-fill';
/**
 * Table cell handle bound to a live `a:tc` element.
 *
 * @remarks
 * TASK-1024: cell text via {@link TextBody} on DrawingML `a:txBody`, and basic
 * direct `a:tcPr` attributes. Merge attributes remain read-only. Citation:
 * Transitional `dml-main.xsd` `CT_TableCell`, `CT_TableCellProperties`.
 */
import { SecurityLimits } from '../../core/security/limits';
import { DML_NS } from '../../core/shapes/constants';
import { asMutable, findChild, getAttr, MutableOoxmlElement } from '../../core/shapes/dom-utils';
import { TextBody } from '../../core/text/text-body';
import { OoxmlAttribute, OoxmlElement, OoxmlText } from '../../core/xml/index';
import { DirectTableCellProperties, DirectTableCellPropertiesPatch, TableMergeInfo } from './table-types';
import { arrayAt, objectGet } from '../../core/util/es5-compat';
/** XSD default `marL` / `marR` on `CT_TableCellProperties` (EMU). */
const DEFAULT_MAR_LR: number = 91440;
/** XSD default `marT` / `marB` on `CT_TableCellProperties` (EMU). */
const DEFAULT_MAR_TB: number = 45720;
/** XSD default `vert`. */
const DEFAULT_VERT: string = 'horz';
/** XSD default `anchor`. */
const DEFAULT_ANCHOR: string = 't';
/** XSD default `horzOverflow`. */
const DEFAULT_HORZ_OVERFLOW: string = 'clip';
/**
 * One cell in a DrawingML table grid.
 *
 * @public
 */
export class TableCell {
    private readonly onFillMutate: (() => void) | undefined;
    private readonly assertFillLive: (() => void) | undefined;
    private readonly element: OoxmlElement;
    private readonly limits: SecurityLimits;
    private readonly partName: string | undefined;
    private readonly _row: number;
    private readonly _column: number;
    private readonly _merge: TableMergeInfo;
    private readonly _id: string | undefined;
    /**
     * @internal
     * @param {OoxmlElement} element - The element value.
     * @param {number} row - The row value.
     * @param {number} column - The column value.
     * @param {SecurityLimits} limits - The limits value.
     * @param {string} partName - The partName value.
     * @param {*} onFillMutate - Optional post-commit fill notification.
     * @param {*} assertFillLive - Optional owning-table structural validity check.
     */
    constructor(element: OoxmlElement, row: number, column: number, limits: SecurityLimits, partName?: string,
                onFillMutate?: () => void, assertFillLive?: () => void) {
        this.onFillMutate = onFillMutate; this.assertFillLive = assertFillLive;
        this.element = element;
        this.limits = limits;
        this.partName = partName;
        this._row = row;
        this._column = column;
        this._merge = readMergeInfo(element);
        this._id = readOptionalId(element);
    }
    /**
     * Zero-based row index within the parent table.
     *
     * @returns {number} The result.
     */
    get row(): number {
        return this._row;
    }
    /**
     * Zero-based column index within the parent table.
     *
     * @returns {number} The result.
     */
    get column(): number {
        return this._column;
    }
    /**
     * Read-only merge attributes (`rowSpan`, `gridSpan`, `hMerge`, `vMerge`).
     *
     * @remarks Defaults follow XSD when attributes are omitted. Phase 3 never writes merges.
     * @returns {TableMergeInfo} The result.
     */
    get merge(): TableMergeInfo {
        return this._merge;
    }
    /**
     * Optional `CT_TableCell/@id` when authored.
     *
     * @returns {string | undefined} The result.
     */
    get id(): string | undefined {
        return this._id;
    }
    /**
     * DrawingML text body (`a:txBody`) when present on this cell.
     *
     * @remarks Table cells use `a:txBody` (DrawingML), not `p:txBody`. Returns `undefined` when the cell has no text body; Phase 3 does not
     * invent empty `txBody` markup. Edit runs through {@link TextBody} / {@link TextPart} like shape text.
     * @returns {TextBody | undefined} The result.
     */
    get textBody(): TextBody | undefined {
        const txBody: OoxmlElement = findChild(this.element, DML_NS, 'txBody');
        if (txBody === undefined) {
            return undefined;
        }
        return new TextBody(txBody, this.limits, this.partName);
    }
    /**
     * Alias of {@link TableCell.textBody} (Syncfusion Presentation-style name).
     *
     * @returns {TextBody | undefined} The result.
     */
    get textFrame(): TextBody | undefined {
        return this.textBody;
    }
    /**
     * Direct `a:tcPr` attributes with XSD defaults applied on read.
     *
     * @remarks Defaults apply when `tcPr` or individual attributes are absent. Line/fill children under `tcPr` are not exposed here.
     * @returns {DirectTableCellProperties} The result.
     */
    get directCellProperties(): DirectTableCellProperties {
        const tcPr: OoxmlElement = findChild(this.element, DML_NS, 'tcPr');
        return {
            marL: readIntAttr(tcPr, 'marL', DEFAULT_MAR_LR),
            marR: readIntAttr(tcPr, 'marR', DEFAULT_MAR_LR),
            marT: readIntAttr(tcPr, 'marT', DEFAULT_MAR_TB),
            marB: readIntAttr(tcPr, 'marB', DEFAULT_MAR_TB),
            vert: readStringAttr(tcPr, 'vert', DEFAULT_VERT),
            anchor: readStringAttr(tcPr, 'anchor', DEFAULT_ANCHOR),
            anchorCtr: readBooleanAttr(tcPr, 'anchorCtr', false),
            horzOverflow: readStringAttr(tcPr, 'horzOverflow', DEFAULT_HORZ_OVERFLOW)
        };
    }
    /**
     * Writes understood `a:tcPr` attributes from a patch bag.
     *
     * @param {DirectTableCellPropertiesPatch} patch - Only defined keys are written; omitted keys are left alone.
     * @returns {void} Nothing.
     */
    setDirectCellProperties(patch: DirectTableCellPropertiesPatch): void {
        const keys: Array<keyof DirectTableCellProperties> = Object.keys(patch) as Array<keyof DirectTableCellProperties>;
        if (keys.length === 0) {
            return;
        }
        const tcPr: OoxmlElement = ensureTcPr(this.element);
        for (let i: number = 0; i < keys.length; i++) {
            const key: keyof DirectTableCellProperties = arrayAt(keys, i);
            const value: string | number | boolean | undefined =
                objectGet<string | number | boolean>(patch, String(key));
            if (value === undefined) {
                continue;
            }
            switch (key) {
            case 'marL':
            case 'marR':
            case 'marT':
            case 'marB':
                setUnprefixedAttr(tcPr, key, String(value));
                break;
            case 'vert':
            case 'anchor':
            case 'horzOverflow':
                setUnprefixedAttr(tcPr, key, String(value));
                break;
            case 'anchorCtr':
                setUnprefixedAttr(tcPr, 'anchorCtr', value ? '1' : '0');
                break;
            default: {
                const _exhaustive: never = key;
                void _exhaustive;
                break;
            }
            }

        }
    }

    /**
     * Direct properties fill; missing remains distinct from explicit noFill.
     *
     * @returns {DirectFill} Classification only; styles and table background remain separate.
     */
    get fill(): DirectFill {
        if (this.assertFillLive) { this.assertFillLive(); }
        return readTableFill(this.element, this.partName);
    }
    /**
     * Complete sparse direct gradient, retaining presence, flags, rectangles and references.
     *
     * @returns {AuthoredGradientFill | undefined} Authored data, without style inheritance.
     */
    get gradientFill(): AuthoredGradientFill | undefined {
        if (this.assertFillLive) { this.assertFillLive(); }
        return readTableGradient(this.element, this.partName);
    }
    /**
     * Replaces only direct fill after validating the complete detached gradient.
     *
     * @param {GradientFillOptions} options - Explicit stops and geometry in normalized units.
     * @returns {void} Preserves styles, grid, merges, text, borders and unknown XML.
     * @throws Invalid input or detached host, without mutation or notification.
     */
    setGradientFill(options: GradientFillOptions): void {
        if (this.assertFillLive) { this.assertFillLive(); }
        const fill: OoxmlElement = buildGradientFill(options, tableFillNamespace(this.element, this.partName), this.partName);
        if (commitTableFill(this.element, fill, this.partName) && this.onFillMutate) { this.onFillMutate(); }
    }
    /**
     * Writes explicit noFill without changing any other properties.
     *
     * @returns {void} Notifies after a successful commit.
     */
    setNoFill(): void {
        if (this.assertFillLive) { this.assertFillLive(); }
        const ns: string = tableFillNamespace(this.element, this.partName);
        const fill: OoxmlElement = { kind: 'element', namespaceUri: ns, localName: 'noFill', attributes: [], children: [], prefixHint: 'a' };
        if (commitTableFill(this.element, fill, this.partName) && this.onFillMutate) { this.onFillMutate(); }
    }
    /**
     * Removes only direct fill, making the existing style tier eligible again.
     *
     * @returns {void} Missing fill is a no-op; properties remain intact.
     */
    clearFill(): void {
        if (this.assertFillLive) { this.assertFillLive(); }
        if (commitTableFill(this.element, undefined, this.partName) && this.onFillMutate) { this.onFillMutate(); }
    }
    /**
     * Edits individual stops in the existing direct gradient.
     *
     * @returns {GradientStopEditor} Stale-checked session; dispose after use.
     * @throws Missing direct gradient, detached host or stale replacement.
     */
    editGradientFill(): GradientStopEditor {
        if (this.assertFillLive) { this.assertFillLive(); }
        tableFillNamespace(this.element, this.partName);
        return new GradientStopEditor((): OoxmlElement | undefined => {
            if (this.assertFillLive) { this.assertFillLive(); }
            return tableGradientElement(this.element, this.partName);
        }, this.partName, (): void => { if (this.onFillMutate) { this.onFillMutate(); } });
    }
    /**
     * Complete direct fill carriers for six physical borders, separate from body/style paint.
     *
     * @returns {AuthoredTableCellBorders} Missing line and present line with missing fill stay distinct.
     */
    get borderFills(): AuthoredTableCellBorders {
        if (this.assertFillLive) { this.assertFillLive(); }
        return readTableBorderFills(this.element, this.partName);
    }
    /**
     * Replaces one border's fill while retaining its width, dash, join, markers and extensions.
     *
     * @param {TableCellBorder} border - Physical border; merged continuation cells are not redirected.
     * @param {GradientFillOptions} options - Complete validated gradient replacement.
     * @returns {void} Notifies once after a successful commit.
     */
    setBorderGradientFill(border: TableCellBorder, options: GradientFillOptions): void {
        this.setBorderGradientFills([{ border, gradient: options }]);
    }
    /**
     * Replaces multiple border fills atomically after validating the entire batch.
     *
     * @param {ReadonlyArray<TableBorderGradientUpdate>} updates - Unique border targets and complete gradients.
     * @returns {void} Empty batch is a no-op; success notifies once.
     * @throws Invalid target, duplicate target, gradient or stale cell, without live writes.
     */
    setBorderGradientFills(updates: ReadonlyArray<TableBorderGradientUpdate>): void {
        if (this.assertFillLive) { this.assertFillLive(); }
        if (setTableBorderGradients(this.element, updates, this.partName) && this.onFillMutate) { this.onFillMutate(); }
    }
    /**
     * Writes explicit noFill on one border, keeping other line properties and cell fill intact.
     *
     * @param {TableCellBorder} border - Physical edge.
     * @returns {void} Notifies after commit.
     */
    setBorderNoFill(border: TableCellBorder): void {
        if (this.assertFillLive) { this.assertFillLive(); }
        const ns: string = tableFillNamespace(this.element, this.partName);
        const fill: OoxmlElement = { kind: 'element', namespaceUri: ns, localName: 'noFill', prefixHint: 'a', attributes: [], children: [] };
        if (commitBorderFills(this.element, [{ border, fill }], this.partName) && this.onFillMutate) { this.onFillMutate(); }
    }
    /**
     * Resets only a border fill; line metadata remains available for inherited paint.
     *
     * @param {TableCellBorder} border - Physical edge.
     * @returns {void} Missing fill is a no-op.
     */
    clearBorderFill(border: TableCellBorder): void {
        if (this.assertFillLive) { this.assertFillLive(); }
        if (commitBorderFills(this.element, [{ border, fill: undefined }], this.partName) && this.onFillMutate) { this.onFillMutate(); }
    }
    /**
     * Opens a selective stop session for one existing direct border gradient.
     *
     * @param {TableCellBorder} border - Physical edge.
     * @returns {GradientStopEditor} Session invalidates on replacement, reset, detachment or structural cell change.
     * @throws Missing direct gradient or stale cell.
     */
    editBorderGradientFill(border: TableCellBorder): GradientStopEditor {
        if (this.assertFillLive) { this.assertFillLive(); }
        return new GradientStopEditor((): OoxmlElement | undefined => {
            if (this.assertFillLive) { this.assertFillLive(); }
            const line: OoxmlElement | undefined = tableBorderLine(this.element, border, this.partName);
            if (line === undefined) { return undefined; }
            const choices: ReadonlyArray<string> = ['noFill', 'solidFill', 'gradFill', 'blipFill', 'pattFill', 'grpFill'];
            for (let i: number = 0; i < line.children.length; i++) {
                const child: OoxmlElement | OoxmlText = arrayAt(line.children, i);
                if (child.kind === 'element' && child.namespaceUri === line.namespaceUri && choices.indexOf(child.localName) >= 0) {
                    return child.localName === 'gradFill' ? child : undefined;
                }
            }
            return undefined;
        }, this.partName, (): void => { if (this.onFillMutate) { this.onFillMutate(); } });
    }
    /**
     * Live cell DOM.
     *
     * @returns {OoxmlElement} Bound element.
     * @internal
     */
    getElement(): OoxmlElement {
        return this.element;
    }
}
/**
 *
 * @param {OoxmlElement} tc - The tc value.
 * @returns {TableMergeInfo} The result.
 */
function readMergeInfo(tc: OoxmlElement): TableMergeInfo {
    return {
        rowSpan: readIntAttr(tc, 'rowSpan', 1),
        gridSpan: readIntAttr(tc, 'gridSpan', 1),
        hMerge: readBooleanAttr(tc, 'hMerge', false),
        vMerge: readBooleanAttr(tc, 'vMerge', false)
    };
}
/**
 *
 * @param {OoxmlElement} tc - The tc value.
 * @returns {string | undefined} The result.
 */
function readOptionalId(tc: OoxmlElement): string | undefined {
    const raw: string = getAttr(tc, '', 'id');
    if (raw === undefined || raw.length === 0) {
        return undefined;
    }
    return raw;
}
/**
 *
 * @param {OoxmlElement | undefined} el - The el value.
 * @param {string} localName - The localName value.
 * @param {number} defaultValue - The defaultValue value.
 * @returns {number} The result.
 */
function readIntAttr(el: OoxmlElement | undefined, localName: string, defaultValue: number): number {
    if (el === undefined) {
        return defaultValue;
    }
    const raw: string = getAttr(el, '', localName);
    if (raw === undefined || !/^-?\d+$/u.test(raw)) {
        return defaultValue;
    }
    const n: number = Number(raw);
    return Number.isSafeInteger(n) ? n : defaultValue;
}
/**
 *
 * @param {OoxmlElement | undefined} el - The el value.
 * @param {string} localName - The localName value.
 * @param {string} defaultValue - The defaultValue value.
 * @returns {string} The result.
 */
function readStringAttr(el: OoxmlElement | undefined, localName: string, defaultValue: string): string {
    if (el === undefined) {
        return defaultValue;
    }
    const raw: string = getAttr(el, '', localName);
    if (raw === undefined || raw.length === 0) {
        return defaultValue;
    }
    return raw;
}
/**
 *
 * @param {OoxmlElement | undefined} el - The el value.
 * @param {string} localName - The localName value.
 * @param {boolean} defaultValue - The defaultValue value.
 * @returns {boolean} The result.
 */
function readBooleanAttr(el: OoxmlElement | undefined, localName: string, defaultValue: boolean): boolean {
    if (el === undefined) {
        return defaultValue;
    }
    const raw: string = getAttr(el, '', localName);
    if (raw === undefined) {
        return defaultValue;
    }
    if (raw === '1' || raw.toLowerCase() === 'true') {
        return true;
    }
    if (raw === '0' || raw.toLowerCase() === 'false') {
        return false;
    }
    return defaultValue;
}
/**
 * Ensures `a:tcPr` exists on `tc` in CT_TableCell child order:
 * optional `txBody`, then `tcPr`, then `extLst`.
 *
 * @param {OoxmlElement} tc - The tc value.
 * @returns {OoxmlElement} The result.
 */
function ensureTcPr(tc: OoxmlElement): OoxmlElement {
    const existing: OoxmlElement = findChild(tc, DML_NS, 'tcPr');
    if (existing !== undefined) {
        return existing;
    }
    const tcPr: OoxmlElement = {
        kind: 'element' as 'element',
        namespaceUri: DML_NS,
        localName: 'tcPr',
        attributes: [],
        children: [],
        prefixHint: 'a'
    };
    const mutable: MutableOoxmlElement = asMutable(tc);
    const insertAt: number = tcPrInsertIndex(mutable.children);
    mutable.children.splice(insertAt, 0, tcPr);
    return tcPr;
}
/**
 *
 * @param {*} children - The children value.
 * @returns {number} The result.
 */
function tcPrInsertIndex(children: ReadonlyArray<OoxmlElement | OoxmlText>): number {
    // After last txBody (and any preceding content); before first extLst.
    let afterTxBody: number = 0;
    for (let i: number = 0; i < children.length; i += 1) {
        const child: OoxmlElement | OoxmlText = arrayAt(children, i);
        if (child === undefined || child.kind !== 'element') {
            continue;
        }
        if (child.namespaceUri === DML_NS && child.localName === 'txBody') {
            afterTxBody = i + 1;
        }
    }
    for (let i: number = afterTxBody; i < children.length; i += 1) {
        const child: OoxmlElement | OoxmlText = arrayAt(children, i);
        if (child !== undefined &&
            child.kind === 'element' &&
            child.namespaceUri === DML_NS &&
            child.localName === 'extLst') {
            return i;
        }
    }
    return children.length > afterTxBody ? children.length : afterTxBody;
}
/**
 *
 * @param {OoxmlElement} el - The el value.
 * @param {string} localName - The localName value.
 * @param {string} value - The value value.
 * @returns {void} Nothing.
 */
function setUnprefixedAttr(el: OoxmlElement, localName: string, value: string): void {
    const mutable: MutableOoxmlElement = asMutable(el);
    const next: OoxmlAttribute[] = [];
    let replaced: boolean = false;
    for (let i: number = 0; i < mutable.attributes.length; i++) {
        const a: OoxmlAttribute = arrayAt(mutable.attributes, i);
        if (a.namespaceUri === '' && a.localName === localName) {
            next.push({ ...a, value });
            replaced = true;
        }
        else {
            next.push(a);
        }

    }
    if (!replaced) {
        next.push({ namespaceUri: '', localName, value });
    }
    mutable.attributes = next;
}
