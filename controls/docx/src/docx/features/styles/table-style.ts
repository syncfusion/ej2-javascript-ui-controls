/**
 * Table style live model (`w:style/@w:type="table"`).
 *
 * Owns character/paragraph format facades, base table/row/cell property bags,
 * and conditional formatting styles (`w:tblStylePr`). Mutations rewrite the
 * DocxStyle shell and notify the styles host.
 *
 * @public
 */
import { ownGet } from '../../core/compat/object-compat';
import {
    CharacterFormat,
    CharacterFormatHost,
    parseCharacterFormat,
    buildRPrChildrenFromSnapshot
} from '../document/character-format';
import { Color, colorFromWire, colorToHexWire } from '../document/color';
import {
    ParagraphFormat,
    ParagraphFormatHost,
    ParagraphFormatSnapshot,
    parseParagraphFormat,
    buildPPrChildrenFromSnapshot
} from '../document/paragraph-format';
import { elementChildren, isWml, wmlAttr, wmlElement, wValAttribute } from '../document/wml';
import { OpenXmlChild, OpenXmlElement } from '../../core/xml/index';
import {
    TableBorders,
    TableBorder,
    TableCellBorders,
    TableCellMargins,
    TableShading,
    TableWidth,
    TableAlignment,
    TableLayout,
    readTableBorders,
    writeTableBorders,
    readTableCellMargins,
    writeTableCellMargins,
    readTableShading,
    writeTableShading,
    readTablePreferredWidth,
    writeTablePreferredWidth,
    readTableAlignment,
    writeTableAlignment,
    readTableLayout,
    writeTableLayout,
    readTableCellSpacing,
    writeTableCellSpacing,
    readTableIndent,
    writeTableIndent,
    readTableRowBandSize,
    writeTableRowBandSize,
    readTableColumnBandSize,
    writeTableColumnBandSize, TableRowHeight, TableRowHeightRule
} from '../tables/tbl-pr';
import {
    readRowHeight,
    writeRowHeight,
    readRowCantSplit,
    writeRowCantSplit,
    readRowIsHeader,
    writeRowIsHeader
} from '../tables/tr-pr';
import {
    readCellBorders,
    writeCellBorders,
    readCellShading,
    writeCellShading,
    readCellMargins,
    writeCellMargins,
    readCellVerticalAlignment,
    writeCellVerticalAlignment,
    readCellTextDirection,
    writeCellTextDirection,
    readCellPreferredWidth,
    writeCellPreferredWidth,
    readHorizontalMerge,
    writeHorizontalMerge,
    readVerticalMerge,
    writeVerticalMerge,
    TableCellVerticalAlignment,
    TableCellTextDirection,
    VerticalMerge
} from '../tables/tc-pr';
import { Borders, BorderBagHost, BorderEdgeKey, readBorderEdge, writeBorderEdge } from '../tables/borders';
import { Paddings, PaddingsHost } from '../tables/paddings';
import { DocxStyle, parseDocxStyle } from './style';
import { Style } from './style-base';
import { OpenXmlAttribute } from '../../core/xml/model';

/** Conditional formatting type tokens (`w:tblStylePr/@w:type`). */
export enum ConditionalFormattingType {
    WholeTable = 'wholeTable',
    FirstRow = 'firstRow',
    LastRow = 'lastRow',
    FirstColumn = 'firstColumn',
    LastColumn = 'lastColumn',
    OddColumnBand = 'band1Vert',
    EvenColumnBand = 'band2Vert',
    OddRowBand = 'band1Horz',
    EvenRowBand = 'band2Horz',
    TopLeftCell = 'nwCell',
    TopRightCell = 'neCell',
    BottomLeftCell = 'swCell',
    BottomRightCell = 'seCell'
}


const CONDITIONAL_TYPE_SET: { [key: string]: boolean } = {
    wholeTable: true,
    firstRow: true,
    lastRow: true,
    firstColumn: true,
    lastColumn: true,
    band1Vert: true,
    band2Vert: true,
    band1Horz: true,
    band2Horz: true,
    nwCell: true,
    neCell: true,
    swCell: true,
    seCell: true
};

function isConditionalType(value: string): value is ConditionalFormattingType {
    return ownGet(CONDITIONAL_TYPE_SET, value) === true;
}

/**
 * OOXML `w:style` (table) property-group order after metadata:
 * pPr → rPr → tblPr → trPr → tcPr → tblStylePr*.
 * @private
 */
const TABLE_STYLE_PROP_RANK: { [name: string]: number } = {
    pPr: 0,
    rPr: 1,
    tblPr: 2,
    trPr: 3,
    tcPr: 4,
    tblStylePr: 5
};

/**
 * OOXML `w:tblStylePr` child order: pPr → rPr → tblPr → trPr → tcPr.
 * @private
 */
const TBL_STYLE_PR_CHILD_RANK: { [name: string]: number } = {
    pPr: 0,
    rPr: 1,
    tblPr: 2,
    trPr: 3,
    tcPr: 4
};

function stylePropRank(localName: string): number | undefined {
    const rank: number = ownGet(TABLE_STYLE_PROP_RANK, localName);
    return rank !== undefined ? rank : undefined;
}

function tblStylePrChildRank(localName: string): number | undefined {
    const rank: number = ownGet(TBL_STYLE_PR_CHILD_RANK, localName);
    return rank !== undefined ? rank : undefined;
}

/**
 * Stable-sort modeled property groups; preserve relative order of other nodes.
 *
 * @param {ReadonlyArray<OpenXmlElement>} children - The children.
 * @param {Function} rankOf - The rank of.
 * @returns {OpenXmlElement[]} The result.
 * @private
 */
function orderByRank(
    children: ReadonlyArray<OpenXmlElement>,
    rankOf: (localName: string) => number | undefined
): OpenXmlElement[] {
    const preamble: OpenXmlElement[] = [];
    const ranked: { rank: number; el: OpenXmlElement; index: number }[] = [];
    const unknown: { el: OpenXmlElement; index: number }[] = [];

    for (const [i, child] of children.entries()) {
        const rank: number = rankOf(child.localName);
        if (rank === undefined) {
            // Keep unknowns that appear before the first ranked group with preamble;
            // unknowns after ranked groups stay after (ECMA extras / rsid-like).
            if (ranked.length === 0) {
                preamble.push(child);
            } else {
                unknown.push({ el: child, index: i });
            }
            continue;
        }
        ranked.push({ rank, el: child, index: i });
    }

    ranked.sort((a: { rank: number; el: OpenXmlElement; index: number; }, b: { rank: number; el: OpenXmlElement; index: number; }) => {
        if (a.rank !== b.rank) {
            return a.rank - b.rank;
        }
        return a.index - b.index;
    });

    const out: OpenXmlElement[] = preamble.slice();
    for (const entry of ranked) {
        out.push(entry.el);
    }
    // Append trailing unknowns in original order (after property groups).
    unknown.sort((a: { el: OpenXmlElement; index: number; }, b: { el: OpenXmlElement; index: number; }) => a.index - b.index);
    for (const entry of unknown) {
        out.push(entry.el);
    }
    return out;
}

/**
 * Order children of one `w:tblStylePr` (omit empties is caller's job).
 *
 * @param {ReadonlyArray<OpenXmlElement>} children - The children.
 * @returns {OpenXmlElement[]} The result.
 * @private
 */
function orderTblStylePrChildren(children: ReadonlyArray<OpenXmlElement>): OpenXmlElement[] {
    return orderByRank(children, tblStylePrChildRank);
}

/**
 * Rebuild `w:tblStylePr` with schema-ordered children.
 *
 * @param {OpenXmlElement} el - The el.
 * @returns {OpenXmlElement} The result.
 * @private
 */
function orderTblStylePrElement(el: OpenXmlElement): OpenXmlElement {
    const kids: ReadonlyArray<OpenXmlElement> = elementChildren(el);
    if (kids.length <= 1) {
        // Zero or one child — already ordered.
        if (kids.length === 1) {
            return el;
        }
        return el;
    }
    const ordered: OpenXmlElement[] = orderTblStylePrChildren(kids);
    let changed: boolean = false;
    for (const [i, element] of kids.entries()) {
        // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
        if (element !== ordered[i]) {
            changed = true;
            break;
        }
    }
    if (!changed) {
        return el;
    }
    return wmlElement('tblStylePr', {
        attributes: el.attributes,
        namespaceDeclarations: el.namespaceDeclarations,
        children: ordered
    });
}

/**
 * Order `w:style` children for table styles and nested `w:tblStylePr` bodies.
 *
 * @param {OpenXmlElement} el - The el.
 * @returns {OpenXmlElement} The result.
 * @private
 */
function orderTableStyleElement(el: OpenXmlElement): OpenXmlElement {
    const kids: ReadonlyArray<OpenXmlElement> = elementChildren(el);
    const withOrderedConditionals: OpenXmlElement[] = [];
    for (const child of kids) {
        if (isWml(child, 'tblStylePr')) {
            withOrderedConditionals.push(orderTblStylePrElement(child));
        } else {
            withOrderedConditionals.push(child);
        }
    }
    const ordered: OpenXmlElement[] = orderByRank(withOrderedConditionals, stylePropRank);
    let changed: boolean = ordered.length !== kids.length;
    if (!changed) {
        for (const [i, element] of kids.entries()) {
            // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
            if (element !== ordered[i]) {
                changed = true;
                break;
            }
        }
    }
    if (!changed) {
        return el;
    }
    return wmlElement('style', {
        attributes: el.attributes,
        namespaceDeclarations: el.namespaceDeclarations,
        children: ordered
    });
}

/**
 * Host notified when table-style structure mutates.
 *
 * @private
 */
export interface TableStyleHost {
    notifyTableStyleMutation(): void;
}

function attrLocal(el: OpenXmlElement, localName: string): string | undefined {
    for (const a of el.attributes) {
        if (a.localName === localName) {
            return a.value;
        }
    }
    return undefined;
}

/**
 * Base table properties on a table style (`w:tblPr` under `w:style`).
 *
 * @public
 */
export class TableStyleTableProperties {
    private readonly owner: TableStyle;
    private bordersInstance: Borders | undefined;
    private paddingsInstance: Paddings | undefined;

    /**
     *  @private
     *
     * @param {TableStyle} owner - The owner.
     */
    constructor(owner: TableStyle) {
        this.owner = owner;
    }

    private readTblPr(): OpenXmlElement | undefined {
        return this.owner.readBaseChild('tblPr');
    }

    private writeTblPr(next: OpenXmlElement | undefined): void {
        this.owner.writeBaseChild('tblPr', next);
    }

    get borders(): Borders {
        if (this.bordersInstance === undefined) {
            const host: BorderBagHost = {
                readEdge: (key: BorderEdgeKey): TableBorder | undefined => {
                    const pr: OpenXmlElement = this.readTblPr();
                    if (pr === undefined) {
                        return undefined;
                    }
                    const bag: TableBorders = readTableBorders(pr);
                    return bag !== undefined ? readBorderEdge(bag, key) : undefined;
                },
                writeEdge: (key: BorderEdgeKey, edge: TableBorder | undefined): void => {
                    const pr: OpenXmlElement = this.readTblPr() !== undefined ? this.readTblPr()! : wmlElement('tblPr');
                    const current: {
                        top?: TableBorder;
                        left?: TableBorder;
                        bottom?: TableBorder;
                        right?: TableBorder;
                        insideH?: TableBorder;
                        insideV?: TableBorder;
                    } = readTableBorders(pr) !== undefined ? { ...readTableBorders(pr)! } : {};
                    writeBorderEdge(current, key, edge);
                    const keys: string[] = Object.keys(current);
                    const nextBag: TableBorders = keys.length > 0 ? (current as TableBorders) : undefined;
                    this.writeTblPr(writeTableBorders(pr, nextBag));
                }
            };
            this.bordersInstance = new Borders(host);
        }
        return this.bordersInstance;
    }

    get cellSpacing(): number | undefined {
        const pr: OpenXmlElement = this.readTblPr();
        return pr !== undefined ? readTableCellSpacing(pr) : undefined;
    }
    set cellSpacing(value: number | undefined) {
        const pr: OpenXmlElement = this.readTblPr() !== undefined ? this.readTblPr()! : wmlElement('tblPr');
        this.writeTblPr(writeTableCellSpacing(pr, value));
    }

    get leftIndent(): number | undefined {
        const pr: OpenXmlElement = this.readTblPr();
        return pr !== undefined ? readTableIndent(pr) : undefined;
    }
    set leftIndent(value: number | undefined) {
        const pr: OpenXmlElement = this.readTblPr() !== undefined ? this.readTblPr()! : wmlElement('tblPr');
        this.writeTblPr(writeTableIndent(pr, value));
    }

    get paddings(): Paddings {
        if (this.paddingsInstance === undefined) {
            const host: PaddingsHost = {
                read: (): TableCellMargins | undefined => {
                    const pr: OpenXmlElement = this.readTblPr();
                    return pr !== undefined ? readTableCellMargins(pr) : undefined;
                },
                write: (value: TableCellMargins | undefined): void => {
                    const pr: OpenXmlElement = this.readTblPr() !== undefined ? this.readTblPr()! : wmlElement('tblPr');
                    this.writeTblPr(writeTableCellMargins(pr, value));
                }
            };
            this.paddingsInstance = new Paddings(host);
        }
        return this.paddingsInstance;
    }

    /**
     * @private
     */
    get preferredWidth(): TableWidth | undefined {
        const pr: OpenXmlElement = this.readTblPr();
        return pr !== undefined ? readTablePreferredWidth(pr) : undefined;
    }
    set preferredWidth(value: TableWidth | undefined) {
        const pr: OpenXmlElement = this.readTblPr() !== undefined ? this.readTblPr()! : wmlElement('tblPr');
        this.writeTblPr(writeTablePreferredWidth(pr, value));
    }

    /**
     * @private
     */
    get alignment(): TableAlignment | undefined {
        const pr: OpenXmlElement = this.readTblPr();
        return pr !== undefined ? readTableAlignment(pr) : undefined;
    }
    set alignment(value: TableAlignment | undefined) {
        const pr: OpenXmlElement = this.readTblPr() !== undefined ? this.readTblPr()! : wmlElement('tblPr');
        this.writeTblPr(writeTableAlignment(pr, value as TableAlignment));
    }

    /**
     * @private
     */
    get layout(): TableLayout | undefined {
        const pr: OpenXmlElement = this.readTblPr();
        return pr !== undefined ? readTableLayout(pr) : undefined;
    }
    set layout(value: TableLayout | undefined) {
        const pr: OpenXmlElement = this.readTblPr() !== undefined ? this.readTblPr()! : wmlElement('tblPr');
        this.writeTblPr(writeTableLayout(pr, value as TableLayout));
    }

    /**
     * @private
     */
    get shading(): TableShading | undefined {
        const pr: OpenXmlElement = this.readTblPr();
        return pr !== undefined ? readTableShading(pr) : undefined;
    }
    set shading(value: TableShading | undefined) {
        const pr: OpenXmlElement = this.readTblPr() !== undefined ? this.readTblPr()! : wmlElement('tblPr');
        this.writeTblPr(writeTableShading(pr, value));
    }

    /**
     * Rows per horizontal band on the table style (`w:tblStyleRowBandSize/@w:val`).
     * Styles.xml only; does not write document-body tblPr. Absent → `undefined`.
     * Non-finite values throw `RangeError`.
     *
     * @public
     */
    get rowStripe(): number | undefined {
        const pr: OpenXmlElement = this.readTblPr();
        return pr !== undefined ? readTableRowBandSize(pr) : undefined;
    }
    set rowStripe(value: number | undefined) {
        if (value !== undefined && !isFinite(value)) {
            throw new RangeError(
                'TableStyle rowStripe must be a finite number or undefined, got ' + String(value)
            );
        }
        const pr: OpenXmlElement = this.readTblPr() !== undefined ? this.readTblPr()! : wmlElement('tblPr');
        this.writeTblPr(
            writeTableRowBandSize(pr, value !== undefined ? Math.trunc(value) : undefined)
        );
    }

    /**
     * Columns per vertical band on the table style (`w:tblStyleColBandSize/@w:val`).
     * Styles.xml only; does not write document-body tblPr. Absent → `undefined`.
     * Non-finite values throw `RangeError`.
     *
     * @public
     */
    get columnStripe(): number | undefined {
        const pr: OpenXmlElement = this.readTblPr();
        return pr !== undefined ? readTableColumnBandSize(pr) : undefined;
    }
    set columnStripe(value: number | undefined) {
        if (value !== undefined && !isFinite(value)) {
            throw new RangeError(
                'TableStyle columnStripe must be a finite number or undefined, got ' + String(value)
            );
        }
        const pr: OpenXmlElement = this.readTblPr() !== undefined ? this.readTblPr()! : wmlElement('tblPr');
        this.writeTblPr(
            writeTableColumnBandSize(pr, value !== undefined ? Math.trunc(value) : undefined)
        );
    }
}

/**
 * Row properties on a table style (`w:trPr`).
 *
 * @public
 */
export class TableStyleRowProperties {
    private readonly owner: TableStyle | ConditionalFormattingStyle;
    private readonly isConditional: boolean;

    /**
     *  @private
     *
     * @param {TableStyle | ConditionalFormattingStyle} owner - The owner.
     * @param {boolean} isConditional - The is conditional.
     */
    constructor(owner: TableStyle | ConditionalFormattingStyle, isConditional: boolean = false) {
        this.owner = owner;
        this.isConditional = isConditional;
    }

    private readTrPr(): OpenXmlElement | undefined {
        if (this.isConditional) {
            return (this.owner as ConditionalFormattingStyle).readChild('trPr');
        }
        return (this.owner as TableStyle).readBaseChild('trPr');
    }

    private writeTrPr(next: OpenXmlElement | undefined): void {
        if (this.isConditional) {
            (this.owner as ConditionalFormattingStyle).writeChild('trPr', next);
            return;
        }
        (this.owner as TableStyle).writeBaseChild('trPr', next);
    }

    get height(): number | undefined {
        const pr: OpenXmlElement = this.readTrPr();
        const h: TableRowHeight = readRowHeight(pr);
        return h !== undefined ? h.value : undefined;
    }
    set height(value: number | undefined) {
        const pr: OpenXmlElement = this.readTrPr();
        if (value === undefined) {
            this.writeTrPr(writeRowHeight(pr, undefined));
            return;
        }
        const current: TableRowHeight = readRowHeight(pr);
        const rule: TableRowHeightRule = current !== undefined && current.rule !== undefined ? current.rule : TableRowHeightRule.AtLeast;
        this.writeTrPr(writeRowHeight(pr, { value, rule: rule }));
    }

    get allowBreakAcrossPages(): boolean {
        const pr: OpenXmlElement = this.readTrPr();
        const cant: boolean = readRowCantSplit(pr);
        if (cant === undefined) {
            return true;
        }
        return !cant;
    }
    set allowBreakAcrossPages(value: boolean) {
        const pr: OpenXmlElement = this.readTrPr();
        this.writeTrPr(writeRowCantSplit(pr, value ? undefined : true));
    }

    get isHeader(): boolean {
        const pr: OpenXmlElement = this.readTrPr();
        const v: boolean = readRowIsHeader(pr);
        return v === true;
    }
    set isHeader(value: boolean) {
        const pr: OpenXmlElement = this.readTrPr();
        this.writeTrPr(writeRowIsHeader(pr, value ? true : undefined));
    }
}

/**
 * Cell properties on a table style (`w:tcPr`).
 *
 * @public
 */
export class TableStyleCellProperties {
    private readonly owner: TableStyle | ConditionalFormattingStyle;
    private readonly isConditional: boolean;
    private bordersInstance: Borders | undefined;
    private paddingsInstance: Paddings | undefined;

    /**
     *  @private
     *
     * @param {TableStyle | ConditionalFormattingStyle} owner - The owner.
     * @param {boolean} isConditional - The is conditional.
     */
    constructor(owner: TableStyle | ConditionalFormattingStyle, isConditional: boolean = false) {
        this.owner = owner;
        this.isConditional = isConditional;
    }

    private readTcPr(): OpenXmlElement | undefined {
        if (this.isConditional) {
            return (this.owner as ConditionalFormattingStyle).readChild('tcPr');
        }
        return (this.owner as TableStyle).readBaseChild('tcPr');
    }

    private writeTcPr(next: OpenXmlElement | undefined): void {
        if (this.isConditional) {
            (this.owner as ConditionalFormattingStyle).writeChild('tcPr', next);
            return;
        }
        (this.owner as TableStyle).writeBaseChild('tcPr', next);
    }

    get borders(): Borders {
        if (this.bordersInstance === undefined) {
            const host: BorderBagHost = {
                readEdge: (key: BorderEdgeKey): TableBorder | undefined => {
                    const pr: OpenXmlElement = this.readTcPr();
                    if (pr === undefined) {
                        return undefined;
                    }
                    const bag: TableCellBorders = readCellBorders(pr);
                    return bag !== undefined ? readBorderEdge(bag, key) : undefined;
                },
                writeEdge: (key: BorderEdgeKey, edge: TableBorder | undefined): void => {
                    const pr: OpenXmlElement = this.readTcPr() !== undefined ? this.readTcPr()! : wmlElement('tcPr');
                    const current: {
                        tl2br?: TableBorder;
                        tr2bl?: TableBorder;
                        top?: TableBorder;
                        left?: TableBorder;
                        bottom?: TableBorder;
                        right?: TableBorder;
                        insideH?: TableBorder;
                        insideV?: TableBorder;
                    } = readCellBorders(pr) !== undefined ? { ...readCellBorders(pr)! } : {};
                    writeBorderEdge(current, key, edge);
                    const keys: string[] = Object.keys(current);
                    const nextBag: TableCellBorders =
                        keys.length > 0 ? (current as TableCellBorders) : undefined;
                    this.writeTcPr(writeCellBorders(pr, nextBag));
                }
            };
            this.bordersInstance = new Borders(host);
        }
        return this.bordersInstance;
    }

    get paddings(): Paddings {
        if (this.paddingsInstance === undefined) {
            const host: PaddingsHost = {
                read: (): TableCellMargins | undefined => {
                    const pr: OpenXmlElement = this.readTcPr();
                    return pr !== undefined ? readCellMargins(pr) : undefined;
                },
                write: (value: TableCellMargins | undefined): void => {
                    const pr: OpenXmlElement = this.readTcPr() !== undefined ? this.readTcPr()! : wmlElement('tcPr');
                    this.writeTcPr(writeCellMargins(pr, value));
                }
            };
            this.paddingsInstance = new Paddings(host);
        }
        return this.paddingsInstance;
    }

    get backgroundColor(): Color | undefined {
        const pr: OpenXmlElement = this.readTcPr();
        const shd: TableShading = pr !== undefined ? readCellShading(pr) : undefined;
        if (shd === undefined || shd.fill === undefined) {
            return undefined;
        }
        return colorFromWire(shd.fill);
    }
    set backgroundColor(value: Color | undefined) {
        const pr: OpenXmlElement = this.readTcPr() !== undefined ? this.readTcPr()! : wmlElement('tcPr');
        const current: TableShading = readCellShading(pr);
        if (value === undefined) {
            if (current === undefined) {
                return;
            }
            const next: TableShading = { ...current };
            delete (next as { fill?: string }).fill;
            const empty: boolean =
                next.fill === undefined && next.color === undefined && next.pattern === undefined;
            this.writeTcPr(writeCellShading(pr, empty ? undefined : next));
            return;
        }
        const fill: string = colorToHexWire(value);
        if (fill.length === 0) {
            // Transparent → clear fill like character textBackgroundColor path.
            if (current === undefined) {
                return;
            }
            const next: TableShading = { ...current };
            delete (next as { fill?: string }).fill;
            const empty: boolean =
                next.fill === undefined && next.color === undefined && next.pattern === undefined;
            this.writeTcPr(writeCellShading(pr, empty ? undefined : next));
            return;
        }
        // DocIO direct-format bag: clear + auto + fill (same shape as CellFormat.backColor).
        const pattern: string =
            current !== undefined &&
            current.pattern !== undefined &&
            current.pattern.length > 0
                ? current.pattern
                : 'clear';
        const shdColor: string =
            current !== undefined && current.color !== undefined && current.color.length > 0
                ? current.color
                : 'auto';
        const next: TableShading = {
            fill: fill,
            color: shdColor,
            pattern: pattern
        };
        this.writeTcPr(writeCellShading(pr, next));
    }

    get verticalAlignment(): TableCellVerticalAlignment | undefined {
        const pr: OpenXmlElement = this.readTcPr();
        return pr !== undefined ? readCellVerticalAlignment(pr) : undefined;
    }
    set verticalAlignment(value: TableCellVerticalAlignment | undefined) {
        const pr: OpenXmlElement = this.readTcPr() !== undefined ? this.readTcPr()! : wmlElement('tcPr');
        this.writeTcPr(writeCellVerticalAlignment(pr, value));
    }

    get textDirection(): TableCellTextDirection | undefined {
        const pr: OpenXmlElement = this.readTcPr();
        return pr !== undefined ? readCellTextDirection(pr) : undefined;
    }
    set textDirection(value: TableCellTextDirection | undefined) {
        const pr: OpenXmlElement = this.readTcPr() !== undefined ? this.readTcPr()! : wmlElement('tcPr');
        this.writeTcPr(writeCellTextDirection(pr, value));
    }

    /**
     * @private
     */
    get preferredWidth(): TableWidth | undefined {
        const pr: OpenXmlElement = this.readTcPr();
        return pr !== undefined ? readCellPreferredWidth(pr) : undefined;
    }
    set preferredWidth(value: TableWidth | undefined) {
        const pr: OpenXmlElement = this.readTcPr() !== undefined ? this.readTcPr()! : wmlElement('tcPr');
        this.writeTcPr(writeCellPreferredWidth(pr, value));
    }

    /**
     * style-level only; does not mutate body grid merges.
     *
     * @private
     */
    get horizontalMerge(): VerticalMerge | undefined {
        const pr: OpenXmlElement = this.readTcPr();
        return pr !== undefined ? readHorizontalMerge(pr) : undefined;
    }
    set horizontalMerge(value: VerticalMerge | undefined) {
        const pr: OpenXmlElement = this.readTcPr() !== undefined ? this.readTcPr()! : wmlElement('tcPr');
        this.writeTcPr(writeHorizontalMerge(pr, value));
    }

    /**
     * @private
     */
    get verticalMerge(): VerticalMerge | undefined {
        const pr: OpenXmlElement = this.readTcPr();
        return pr !== undefined ? readVerticalMerge(pr) : undefined;
    }
    set verticalMerge(value: VerticalMerge | undefined) {
        const pr: OpenXmlElement = this.readTcPr() !== undefined ? this.readTcPr()! : wmlElement('tcPr');
        this.writeTcPr(writeVerticalMerge(pr, value));
    }
}

/**
 * One conditional formatting block (`w:tblStylePr`).
 *
 * @public
 */
export class ConditionalFormattingStyle
implements CharacterFormatHost, ParagraphFormatHost
{
    private readonly parent: TableStyle;
    private typeValue: ConditionalFormattingType;
    private element: OpenXmlElement;
    private characterFormatInstance: CharacterFormat | undefined;
    private paragraphFormatInstance: ParagraphFormat | undefined;
    private rowPropertiesInstance: TableStyleRowProperties | undefined;
    private cellPropertiesInstance: TableStyleCellProperties | undefined;
    private tablePropertiesInstance: TableStyleTablePropertiesBridge | undefined;

    /**
     *  @private
     *
     * @param {TableStyle} parent - The parent.
     * @param {ConditionalFormattingType} type - The type.
     * @param {OpenXmlElement} element - The element.
     */
    constructor(parent: TableStyle, type: ConditionalFormattingType, element: OpenXmlElement) {
        this.parent = parent;
        this.typeValue = type;
        this.element = element;
    }

    get conditionalFormattingType(): ConditionalFormattingType {
        return this.typeValue;
    }

    get characterFormat(): CharacterFormat {
        if (this.characterFormatInstance === undefined) {
            this.characterFormatInstance = new CharacterFormat(this);
            const rPr: OpenXmlElement = this.readChild('rPr');
            if (rPr !== undefined) {
                this.characterFormatInstance.hydrate(parseCharacterFormat(rPr));
            }
        }
        return this.characterFormatInstance;
    }

    get paragraphFormat(): ParagraphFormat {
        if (this.paragraphFormatInstance === undefined) {
            this.paragraphFormatInstance = new ParagraphFormat(this);
            const pPr: OpenXmlElement = this.readChild('pPr');
            if (pPr !== undefined) {
                this.paragraphFormatInstance.hydrate(parseParagraphFormat(pPr));
            }
        }
        return this.paragraphFormatInstance;
    }

    get rowProperties(): TableStyleRowProperties {
        if (this.rowPropertiesInstance === undefined) {
            this.rowPropertiesInstance = new TableStyleRowProperties(this, true);
        }
        return this.rowPropertiesInstance;
    }

    get cellProperties(): TableStyleCellProperties {
        if (this.cellPropertiesInstance === undefined) {
            this.cellPropertiesInstance = new TableStyleCellProperties(this, true);
        }
        return this.cellPropertiesInstance;
    }

    /** Conditional table properties (`w:tblPr` inside tblStylePr). */
    get tableProperties(): TableStyleTablePropertiesBridge {
        if (this.tablePropertiesInstance === undefined) {
            this.tablePropertiesInstance = new TableStyleTablePropertiesBridge(this);
        }
        return this.tablePropertiesInstance;
    }

    /**
     *  @private
     *
     * @returns {void} Nothing is returned.
     */
    notifyCharacterFormatMutation(): void {
        this.syncFormatsToElement();
        this.parent.replaceConditionalElement(this.typeValue, this.element);
    }

    /**
     *  @private
     *
     * @returns {void} Nothing is returned.
     */
    notifyParagraphFormatMutation(): void {
        this.syncFormatsToElement();
        this.parent.replaceConditionalElement(this.typeValue, this.element);
    }

    /**
     *  @private
     *
     * @returns {void} Nothing is returned.
     */
    notifyStructureMutation(): void {
        this.parent.replaceConditionalElement(this.typeValue, this.element);
    }

    private syncFormatsToElement(): void {
        // Apply format bags without nested notifyStructureMutation mid-sync.
        if (this.characterFormatInstance !== undefined) {
            const kids: OpenXmlElement[] = buildRPrChildrenFromSnapshot(this.characterFormatInstance.snapshot());
            this.writeChildInternal(
                'rPr',
                kids.length > 0 ? wmlElement('rPr', { children: kids }) : undefined,
                false
            );
        }
        if (this.paragraphFormatInstance !== undefined) {
            const kids: OpenXmlElement[] = buildPPrChildrenFromSnapshot(this.paragraphFormatInstance.snapshot());
            this.writeChildInternal(
                'pPr',
                kids.length > 0 ? wmlElement('pPr', { children: kids }) : undefined,
                false
            );
        }
    }

    /**
     *  @private
     *
     * @param {string} localName - The local name.
     * @returns {OpenXmlElement | undefined} The result.
     */
    readChild(localName: string): OpenXmlElement | undefined {
        const kids: ReadonlyArray<OpenXmlElement> = elementChildren(this.element);
        for (const element of kids) {
            if (isWml(element, localName)) {
                return element;
            }
        }
        return undefined;
    }

    /**
     * Replace/remove a property child and keep OOXML child order.
     *
     * @param {string} localName - The local name.
     * @param {OpenXmlElement | undefined} next - The next.
     * @returns {void} Nothing is returned.
     * @private
     */
    writeChild(localName: string, next: OpenXmlElement | undefined): void {
        this.writeChildInternal(localName, next, true);
    }

    private writeChildInternal(
        localName: string,
        next: OpenXmlElement | undefined,
        notifyParent: boolean
    ): void {
        const kids: ReadonlyArray<OpenXmlElement> = elementChildren(this.element);
        const out: OpenXmlElement[] = [];
        let replaced: boolean = false;
        for (const child of kids) {
            if (isWml(child, localName)) {
                if (!replaced && next !== undefined) {
                    out.push(next);
                }
                replaced = true;
                continue;
            }
            out.push(child);
        }
        if (!replaced && next !== undefined) {
            out.push(next);
        }
        const ordered: OpenXmlElement[] = orderTblStylePrChildren(out);
        this.element = wmlElement('tblStylePr', {
            attributes: this.element.attributes,
            namespaceDeclarations: this.element.namespaceDeclarations,
            children: ordered
        });
        if (notifyParent) {
            this.notifyStructureMutation();
        }
    }

    /**
     *  @private
     *
     * @returns {OpenXmlElement} The result.
     */
    toElement(): OpenXmlElement {
        this.syncFormatsToElement();
        // Ensure order even if only opaque trPr/tcPr mutated without CF/PF.
        this.element = orderTblStylePrElement(this.element);
        return this.element;
    }
}

/**
 * Minimal table-props bridge for conditional blocks (borders/shading subset).
 *
 * @public
 */
export class TableStyleTablePropertiesBridge {
    private readonly owner: ConditionalFormattingStyle;
    private bordersInstance: Borders | undefined;

    /**
     *  @private
     *
     * @param {ConditionalFormattingStyle} owner - The owner.
     */
    constructor(owner: ConditionalFormattingStyle) {
        this.owner = owner;
    }

    private readTblPr(): OpenXmlElement | undefined {
        return this.owner.readChild('tblPr');
    }

    private writeTblPr(next: OpenXmlElement | undefined): void {
        this.owner.writeChild('tblPr', next);
    }

    get borders(): Borders {
        if (this.bordersInstance === undefined) {
            const host: BorderBagHost = {
                readEdge: (key: BorderEdgeKey): TableBorder | undefined => {
                    const pr: OpenXmlElement = this.readTblPr();
                    if (pr === undefined) {
                        return undefined;
                    }
                    const bag: TableBorders = readTableBorders(pr);
                    return bag !== undefined ? readBorderEdge(bag, key) : undefined;
                },
                writeEdge: (key: BorderEdgeKey, edge: TableBorder | undefined): void => {
                    const pr: OpenXmlElement = this.readTblPr() !== undefined ? this.readTblPr()! : wmlElement('tblPr');
                    const current: {
                        top?: TableBorder;
                        left?: TableBorder;
                        bottom?: TableBorder;
                        right?: TableBorder;
                        insideH?: TableBorder;
                        insideV?: TableBorder;
                    } = readTableBorders(pr) !== undefined ? { ...readTableBorders(pr)! } : {};
                    writeBorderEdge(current, key, edge);
                    const keys: string[] = Object.keys(current);
                    this.writeTblPr(
                        writeTableBorders(pr, keys.length > 0 ? (current as TableBorders) : undefined)
                    );
                }
            };
            this.bordersInstance = new Borders(host);
        }
        return this.bordersInstance;
    }

    get shading(): TableShading | undefined {
        const pr: OpenXmlElement = this.readTblPr();
        return pr !== undefined ? readTableShading(pr) : undefined;
    }
    set shading(value: TableShading | undefined) {
        const pr: OpenXmlElement = this.readTblPr() !== undefined ? this.readTblPr()! : wmlElement('tblPr');
        this.writeTblPr(writeTableShading(pr, value));
    }
}

/**
 * Collection of conditional formatting styles on a TableStyle.
 *
 * @public
 */
export class ConditionalFormattingStyleCollection {
    private readonly owner: TableStyle;

    /**
     *  @private
     *
     * @param {TableStyle} owner - The owner.
     */
    constructor(owner: TableStyle) {
        this.owner = owner;
    }

    get count(): number {
        return this.owner.listConditional().length;
    }

    item(index: number): ConditionalFormattingStyle {
        const list: ConditionalFormattingStyle[] = this.owner.listConditional();
        if (index < 0 || index >= list.length) {
            throw new RangeError('Conditional formatting index out of range');
        }
        // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
        return list[index]!;
    }

    findByType(type: ConditionalFormattingType): ConditionalFormattingStyle | undefined {
        const list: ConditionalFormattingStyle[] = this.owner.listConditional();
        for (const style of list) {
            if (style.conditionalFormattingType === type) {
                return style;
            }
        }
        return undefined;
    }

    add(type: ConditionalFormattingType): ConditionalFormattingStyle {
        const existing: ConditionalFormattingStyle = this.findByType(type);
        if (existing !== undefined) {
            return existing;
        }
        const el: OpenXmlElement = wmlElement('tblStylePr', {
            attributes: [wmlAttr('type', type)],
            children: []
        });
        return this.owner.addConditionalElement(type, el);
    }

    clear(): void {
        this.owner.clearConditionals();
    }
}

/**
 * Live table style (`w:style` type=table).
 *
 * @public
 */
export class TableStyle extends Style implements CharacterFormatHost, ParagraphFormatHost {
    private host: TableStyleHost | undefined;
    /** Base-style paragraph format (`w:pPr`); character format uses Style base facade. */
    private readonly paragraphFormatValue: ParagraphFormat;
    private tablePropertiesInstance: TableStyleTableProperties | undefined;
    private rowPropertiesInstance: TableStyleRowProperties | undefined;
    private cellPropertiesInstance: TableStyleCellProperties | undefined;
    private conditionalCollection: ConditionalFormattingStyleCollection | undefined;
    private conditionalCache: ConditionalFormattingStyle[] | undefined;

    /**
     *  @private
     *
     * @param {DocxStyle} shell - The shell.
     * @param {TableStyleHost} host - The host.
     */
    constructor(shell: DocxStyle, host?: TableStyleHost) {
        super(shell.styleId, 'table', shell.default, shell.customStyle);
        this.host = host;
        this.paragraphFormatValue = new ParagraphFormat(this);
        this.hydrateFromDocxStyle(shell);
    }

    /**
     *  @private
     *
     * @param {TableStyleHost} host - The host.
     * @returns {void} Nothing is returned.
     */
    bindHost(host: TableStyleHost): void {
        this.host = host;
    }

    /**
     * Style-level paragraph formatting (`w:pPr`). Stable facade identity.
     *
     * @public
     */
    get paragraphFormat(): ParagraphFormat {
        return this.paragraphFormatValue;
    }

    get tableProperties(): TableStyleTableProperties {
        if (this.tablePropertiesInstance === undefined) {
            this.tablePropertiesInstance = new TableStyleTableProperties(this);
        }
        return this.tablePropertiesInstance;
    }

    get rowProperties(): TableStyleRowProperties {
        if (this.rowPropertiesInstance === undefined) {
            this.rowPropertiesInstance = new TableStyleRowProperties(this, false);
        }
        return this.rowPropertiesInstance;
    }

    get cellProperties(): TableStyleCellProperties {
        if (this.cellPropertiesInstance === undefined) {
            this.cellPropertiesInstance = new TableStyleCellProperties(this, false);
        }
        return this.cellPropertiesInstance;
    }

    /**
     * Conditional table formatting styles (`w:tblStylePr`).
     *
     * @public
     */
    get conditionalFormattingStyles(): ConditionalFormattingStyleCollection {
        if (this.conditionalCollection === undefined) {
            this.conditionalCollection = new ConditionalFormattingStyleCollection(this);
        }
        return this.conditionalCollection;
    }

    /**
     * @param {ParagraphFormatSnapshot} snapshot - The snapshot.
     * @returns {void} Nothing is returned.
     * @private
     */
    protected hydrateParagraphFormat(snapshot: ParagraphFormatSnapshot): void {
        // Called from Style.hydrateFromDocxStyle (suppressDirty already true).
        this.paragraphFormatValue.hydrate(snapshot);
    }

    /**
     * @param {OpenXmlChild[]} out - The out.
     * @returns {void} Nothing is returned.
     * @private
     */
    protected serializeParagraphProperties(out: OpenXmlChild[]): void {
        const children: OpenXmlElement[] = this.paragraphFormatValue.buildPPrChildren();
        if (children.length > 0) {
            out.push(wmlElement('pPr', { children }));
        }
    }

    /**
     * Table styles require schema order: meta → pPr → rPr → tblPr → trPr → tcPr → tblStylePr*.
     * Base {@link Style.serialize} emits opaque children before pPr/rPr; reorder here.
     *
     * @returns {OpenXmlElement} The result.
     * @private
     */
    serialize(): OpenXmlElement {
        const raw: OpenXmlElement = super.serialize();
        return orderTableStyleElement(raw);
    }

    /**
     *  @private
     *
     * @returns {void} Nothing is returned.
     */
    notifyCharacterFormatMutation(): void {
        // Base Style facade is source of truth; serialize emits w:rPr.
        super.notifyCharacterFormatMutation();
        this.notifyHost();
    }

    /**
     *  @private
     *
     * @returns {void} Nothing is returned.
     */
    notifyParagraphFormatMutation(): void {
        this.ensureAttached();
        this.markDirty();
        this.notifyHost();
    }

    private notifyHost(): void {
        if (this.host !== undefined) {
            this.host.notifyTableStyleMutation();
        }
    }

    /**
     * @param {string} localName - The local name.
     * @returns {OpenXmlElement | undefined} The result.
     * @private
     * Read a base property child from the style shell (pPr/rPr/tblPr/trPr/tcPr).
     */
    readBaseChild(localName: string): OpenXmlElement | undefined {
        const serialized: OpenXmlElement = this.toDocxStyle().serialize();
        const kids: ReadonlyArray<OpenXmlElement> = elementChildren(serialized);
        for (const element of kids) {
            if (isWml(element, localName)) {
                return element;
            }
        }
        return undefined;
    }

    /**
     * @param {string} localName - The local name.
     * @param {OpenXmlElement | undefined} next - The next.
     * @returns {void} Nothing is returned.
     * @private
     * Replace a base property child and rewrite the DocxStyle shell.
     */
    writeBaseChild(localName: string, next: OpenXmlElement | undefined): void {
        const shell: DocxStyle = this.toDocxStyle();
        const root: OpenXmlElement = shell.serialize();
        const kids: ReadonlyArray<OpenXmlElement> = elementChildren(root);
        const out: OpenXmlElement[] = [];
        let replaced: boolean = false;
        for (const child of kids) {
            if (isWml(child, localName) && localName !== 'tblStylePr') {
                if (!replaced && next !== undefined) {
                    out.push(next);
                }
                replaced = true;
                continue;
            }
            out.push(child);
        }
        if (!replaced && next !== undefined) {
            out.push(next);
        }
        this.replaceShellFromChildren(shell, root, out);
        this.conditionalCache = undefined;
        this.notifyHost();
    }

    private replaceShellFromChildren(
        shell: DocxStyle,
        root: OpenXmlElement,
        children: OpenXmlElement[]
    ): void {
        // Always persist schema-ordered children so hydrate opaque order is stable.
        const orderedRoot: OpenXmlElement = orderTableStyleElement(
            wmlElement('style', {
                attributes: root.attributes,
                namespaceDeclarations: root.namespaceDeclarations,
                children
            })
        );
        const orderedKids: ReadonlyArray<OpenXmlElement> = elementChildren(orderedRoot);
        const parsed: DocxStyle = parseDocxStyle(orderedRoot);
        if (parsed !== undefined) {
            this.replaceShell(parsed);
        } else {
            void shell;
            this.replaceShell(
                new DocxStyle(this.styleId, 'table', undefined, undefined, orderedKids.slice())
            );
        }
    }

    /**
     *  @private
     *
     * @returns {ConditionalFormattingStyle[]} The result.
     */
    listConditional(): ConditionalFormattingStyle[] {
        if (this.conditionalCache !== undefined) {
            return this.conditionalCache;
        }
        const root: OpenXmlElement = this.toDocxStyle().serialize();
        const kids: ReadonlyArray<OpenXmlElement> = elementChildren(root);
        const list: ConditionalFormattingStyle[] = [];
        for (const child of kids) {
            if (!isWml(child, 'tblStylePr')) {
                continue;
            }
            const typeRaw: string = wValAttribute(child) !== undefined ? wValAttribute(child)! : attrLocal(child, 'type');
            if (typeRaw === undefined || !isConditionalType(typeRaw)) {
                continue;
            }
            list.push(new ConditionalFormattingStyle(this, typeRaw, child));
        }
        this.conditionalCache = list;
        return list;
    }

    /**
     *  @private
     *
     * @param {ConditionalFormattingType} type - The type.
     * @param {OpenXmlElement} el - The el.
     * @returns {ConditionalFormattingStyle} The result.
     */
    addConditionalElement(
        type: ConditionalFormattingType,
        el: OpenXmlElement
    ): ConditionalFormattingStyle {
        const orderedEl: OpenXmlElement = orderTblStylePrElement(el);
        const shell: DocxStyle = this.toDocxStyle();
        const root: OpenXmlElement = shell.serialize();
        const kids: OpenXmlElement[] = elementChildren(root).slice();
        kids.push(orderedEl);
        this.replaceShellFromChildren(shell, root, kids);
        this.conditionalCache = undefined;
        this.notifyHost();
        return new ConditionalFormattingStyle(this, type, orderedEl);
    }

    /**
     *  @private
     *
     * @param {ConditionalFormattingType} type - The type.
     * @param {OpenXmlElement} el - The el.
     * @returns {void} Nothing is returned.
     */
    replaceConditionalElement(type: ConditionalFormattingType, el: OpenXmlElement): void {
        const orderedEl: OpenXmlElement = orderTblStylePrElement(el);
        const shell: DocxStyle = this.toDocxStyle();
        const root: OpenXmlElement = shell.serialize();
        const kids: ReadonlyArray<OpenXmlElement> = elementChildren(root);
        const out: OpenXmlElement[] = [];
        let replaced: boolean = false;
        for (const child of kids) {
            if (isWml(child, 'tblStylePr')) {
                const typeRaw: string =
                    wValAttribute(child) !== undefined ? wValAttribute(child)! : attrLocal(child, 'type');
                if (typeRaw === type) {
                    if (!replaced) {
                        out.push(orderedEl);
                        replaced = true;
                    }
                    continue;
                }
            }
            out.push(child);
        }
        if (!replaced) {
            out.push(orderedEl);
        }
        this.replaceShellFromChildren(shell, root, out);
        this.conditionalCache = undefined;
        this.notifyHost();
    }

    /**
     *  @private
     *
     * @returns {void} Nothing is returned.
     */
    clearConditionals(): void {
        const shell: DocxStyle = this.toDocxStyle();
        const root: OpenXmlElement = shell.serialize();
        const kids: OpenXmlElement[] = elementChildren(root).filter((c: OpenXmlElement) => !isWml(c, 'tblStylePr'));
        this.replaceShellFromChildren(shell, root, kids);
        this.conditionalCache = undefined;
        this.notifyHost();
    }
}
