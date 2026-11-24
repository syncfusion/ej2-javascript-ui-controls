export * from './border-style-map';
export * from './borders';
export * from './collections';
export * from './format';
export * from './paddings';
export * from './tbl-pr-positioning';
export * from './tbl-pr';
export * from './tc-pr';
export * from './tr-pr';
import { DetachedObjectError } from '../../core/errors/docx-error';
import { parseBodyBlocks, serializeBodyBlocks, BodyBlockParseContext } from '../document/body-blocks';
import { WordDocument, Body } from '../document/document';
import { FeatureBlock } from '../document/feature-block';
import { Paragraph, BlockContent } from '../document/paragraph';
import { BodyItem } from '../document/body-item';
import { registerAlwaysOnBodyFeatureBootstrap } from '../document/body-always-on';
import { registerBodyItemAdapter, FeatureBodyBlock } from '../document/body-item-adapters';
import { registerTypedCollectionHooks } from '../document/typed-body-collections';
import { elementChildren, isWml, wmlAttr, wmlElement } from '../document/wml';
import { OpenXmlElement } from '../../core/xml/index';
import {
    featureId,
    registerFeature,
    registerFeatureBlockHandler,
    registerFeatureBlockParagraphWalker,
    visitBlocksInDocumentOrder
} from '../../core/registry/index';
import {
    CnfStyle,
    NormalizedCnfStyle,
    hasAnyCnfStyleFlag,
    normalizeCnfStyle,
    parseDecimalVal,
    readTableCaption,
    readTableColumnBandSize,
    readTableDescription,
    readTableIndent,
    readTableLayout,
    readTableLook,
    readTablePreferredWidth,
    readTableRowBandSize,
    readTableShading,
    readTableStyle,
    pointToTwips,
    twipsToPoint,
    wmlAttrVal,
    writeTableCaption,
    writeTableColumnBandSize,
    writeTableDescription,
    writeTableIndent,
    writeTableLayout,
    writeTableLook,
    writeTablePreferredWidth,
    writeTableRowBandSize,
    writeTableStyle,
    TableAlignment,
    TableBorder,
    TableBorders,
    TableCellBorders,
    TableCellMargins,
    TableLayout,
    TableLook,
    TableRowHeight,
    TableRowHeightRule,
    TableShading,
    TableWidth
} from './tbl-pr';
import {
    BuiltinTableStyle,
    ConditionalFormattingType,
    resolveStyleForTarget,
    styleCollectionFor,
    stylesFor,
    TableStyle
} from '../styles/index';
import {
    readRowAlignment,
    readRowCnfStyle,
    readRowHeight,
    readRowIsHeader,
    writeRowAlignment,
    writeRowCnfStyle,
    writeRowHeight,
    writeRowIsHeader
} from './tr-pr';
import {
    readCellCnfStyle,
    readCellPreferredWidth,
    readCellShading,
    readGridSpan,
    readVerticalMerge,
    writeCellCnfStyle,
    writeCellPreferredWidth,
    writeCellShading,
    writeGridSpan,
    writeVerticalMerge,
    TableCellTextDirection,
    TableCellVerticalAlignment,
    VerticalMerge
} from './tc-pr';
import {
    CellMerge,
    CellFormat,
    CellFormatHost,
    TableHorizontalOrigin,
    RowFormat,
    RowFormatHost,
    TableFormat,
    TableFormatHost,
    TablePositioning,
    TableVerticalOrigin
} from './format';
import {
    TableCellCollection,
    TableCellCollectionHost,
    TableRowCollection,
    TableRowCollectionHost
} from './collections';
import { DocxStyle } from '../styles/style';
import { ConditionalFormattingStyleCollection } from '../styles/table-style';
import { PageSetup as DocPageSetup } from '../document/page-setup';
import { Sections } from '../document/sections';
import { FeatureId } from '../../core/registry/feature-registry';


/**
 * Alias for {@link TableRowHeightRule} .
 *
 * @public
 */
export type TableRowHeightType = TableRowHeightRule;

/**
 * AutoFit modes for {@link Table.autoFit}, follows the standard behaviour.
 *
 * - {@link AutoFitType.FitToContent}: auto layout; clear fixed preferred widths.
 * - {@link AutoFitType.FitToWindow}: auto layout; table 100% width; cell % widths.
 * - {@link AutoFitType.FixedColumnWidth}: fixed layout; cell DXA widths from grid.
 *
 * @public
 */
export enum AutoFitType {
    /** Specifies the fit to content type. */
    FitToContent = 'fitToContent',
    /** Specifies the fit to window type. */
    FitToWindow = 'fitToWindow',
    /** Specifies the fixed column width type. */
    FixedColumnWidth = 'fixedColumnWidth'
}

function autoWidthZero(): TableWidth {
    return { type: 'auto', value: twipsToPoint(0) };
}

const DEFAULT_GRID_COL_TWIPS: number = 1440;
const PCT_100_FIFTIETHS: number = 5000;
/** Default page content width in points when no section is available (Letter − 72 − 72). */
const DEFAULT_PAGE_CLIENT_WIDTH_POINTS: number = 468;

/**
 * Distribute `totalTwips` across `columnCount` equal columns without losing remainder.
 *
 * @param {number} totalTwips - The total twips.
 * @param {number} columnCount - The column count.
 * @returns {number[]} The result.
 * @private
 */
function equalColumnTwips(totalTwips: number, columnCount: number): number[] {
    const cols: number = columnCount > 0 ? columnCount : 1;
    const safeTotal: number = totalTwips > 0 ? Math.floor(totalTwips) : DEFAULT_GRID_COL_TWIPS * cols;
    const base: number = Math.floor(safeTotal / cols);
    const remainder: number = safeTotal - base * cols;
    const out: number[] = [];
    for (let i: number = 0; i < cols; i += 1) {
        out.push(base + (i < remainder ? 1 : 0));
    }
    return out;
}

/**
 * Build `w:tblGrid` from explicit column widths in twips.
 *
 * @param {ReadonlyArray<number>} widthsTwips - The widths twips.
 * @returns {OpenXmlElement} The result.
 * @private
 */
function tblGridFromTwips(widthsTwips: ReadonlyArray<number>): OpenXmlElement {
    const cols: OpenXmlElement[] = [];
    for (const w of widthsTwips) {
        cols.push(
            wmlElement('gridCol', {
                attributes: [wmlAttr('w', String(w > 0 ? w : DEFAULT_GRID_COL_TWIPS))]
            })
        );
    }
    return wmlElement('tblGrid', { children: cols });
}

/**
 * @private
 */
export interface MergeRegion {
    readonly fromRow: number;
    readonly fromColumn: number;
    readonly toRow: number;
    readonly toColumn: number;
    readonly origin: TableCell;
    readonly continuations: ReadonlyArray<TableCell>;
}

/**
 * @private
 */
export interface MergeCellsRange {
    readonly fromRow: number;
    readonly fromColumn: number;
    readonly toRow: number;
    readonly toColumn: number;
}

const TABLES: FeatureId = featureId('tables');

function cellColumnSpan(cell: TableCell): number {
    const span: number = cell.gridSpan;
    return span !== undefined && span > 0 ? span : 1;
}

function findCoveringCell(
    row: TableRow,
    gridColumn: number
): { cell: TableCell; startColumn: number; cellIndex: number } | undefined {
    let cursor: number = 0;
    const cells: TableCell[] = row.listCells();
    for (const [i, cell] of cells.entries()) {
        if (cell === undefined) {
            continue;
        }
        const span: number = cellColumnSpan(cell);
        if (gridColumn >= cursor && gridColumn < cursor + span) {
            return { cell: cell, startColumn: cursor, cellIndex: i };
        }
        cursor += span;
    }
    return undefined;
}

function cellStartColumn(row: TableRow, target: TableCell): number {
    let cursor: number = 0;
    const cells: TableCell[] = row.listCells();
    for (const cell of cells) {
        if (cell === target) {
            return cursor;
        }
        cursor += cellColumnSpan(cell);
    }
    return -1;
}

function cellHasVisibleText(cell: TableCell): boolean {
    return cell.text.trim().length > 0;
}


/**
 * A table — ordered grid of rows and cells with table-level formatting.
 *
 * Create with {@link Body.appendTable} then size via {@link Table.resetCells}.
 *
 * @public
 */
export class Table extends BodyItem implements FeatureBlock, TableRowCollectionHost<TableRow>, TableFormatHost {
    private readonly prefixMarkup: OpenXmlElement[];
    private tblPr: OpenXmlElement;
    private tblGrid: OpenXmlElement;
    private tableRows: TableRow[];
    private documentOwner: WordDocument | undefined;
    private readonly rowsInstance: TableRowCollection<TableRow>;
    private readonly tableFormatInstance: TableFormat;
    private conditionalFormattingDirty: boolean;

    /**
     * @param {OpenXmlElement[]} prefixMarkup - The prefix markup.
     * @param {OpenXmlElement} tblPr - The tbl pr.
     * @param {OpenXmlElement} tblGrid - The tbl grid.
     * @param {TableRow[]} rows - The rows.
     * @private
     */
    constructor(
        prefixMarkup: OpenXmlElement[],
        tblPr: OpenXmlElement,
        tblGrid: OpenXmlElement,
        /**
         * Gets or sets the rows.
         */
        rows: TableRow[]
    ) {
        super();
        this.prefixMarkup = prefixMarkup;
        this.tblPr = tblPr;
        this.tblGrid = tblGrid;
        this.tableRows = rows;
        this.documentOwner = undefined;
        this.rowsInstance = new TableRowCollection<TableRow>(this);
        this.tableFormatInstance = new TableFormat(this);
        this.conditionalFormattingDirty = false;
    }

    /**
     * Gets the rows collection.
     */
    get rows(): TableRowCollection<TableRow> {
        return this.rowsInstance;
    }

    /**
     * @returns {TableRow[]} The result.
     * @private
     */
    listRows(): TableRow[] {
        return this.tableRows;
    }

    /**
     * @param {TableRow[]} rows - The rows.
     * @returns {void} Nothing is returned.
     * @private
     */
    replaceRows(rows: TableRow[]): void {
        if (rows.length < 1) {
            throw new DetachedObjectError('A table must retain at least one row');
        }
        const previous: TableRow[] = this.tableRows;
        for (const row of previous) {
            if (rows.indexOf(row) === -1) {
                row.setOwnerTable(undefined);
            }
        }
        this.tableRows = rows;
        for (const row of rows) {
            row.setOwnerTable(this);
        }
        this.rowsInstance.syncFromHost();
        this.markConditionalFormattingDirty();
    }

    /**
     * @returns {TableRow} The result.
     * @private
     */
    createEmptyRow(): TableRow {
        return this.buildEmptyRow();
    }

    /**
     * @param {TableRow} row - The row.
     * @returns {void} Nothing is returned.
     * @private
     */
    bindRow(row: TableRow): void {
        row.setOwnerTable(this);
        if (this.documentOwner !== undefined) {
            row.bindDocument(this.documentOwner);
            const cells: TableCell[] = row.listCells();
            for (const cell of cells) {
                cell.bindDocument(this.documentOwner);
            }
        }
    }

    /**
     * @returns {number} The result.
     * @private
     */
    minRowCount(): number {
        return 1;
    }

    /**
     * @returns {OpenXmlElement} The result.
     * @private
     */
    readTblPr(): OpenXmlElement {
        return this.tblPr;
    }

    /**
     * @param {OpenXmlElement} next - The next.
     * @returns {void} Nothing is returned.
     * @private
     */
    writeTblPr(next: OpenXmlElement): void {
        this.tblPr = next;
    }

    /**
     * Word parity: copy table back fill onto every cell as direct `w:tcPr/w:shd`
     * (`val="clear"` `color="auto"` `fill=<wire>`). Clearing table backColor
     * removes cell fills that still match the previous painted fill so independent
     * cell colors are left alone when possible.
     *
     * @param {string | undefined} fill - The fill.
     * @returns {void} Nothing is returned.
     * @private
     */
    applyTableBackColorToCells(fill: string | undefined): void {
        const rows: TableRow[] = this.tableRows;
        for (const row of rows) {
            const cells: TableCell[] = row.listCells();
            for (const cell of cells) {
                const prev: TableShading = readCellShading(cell.readTcPr());
                if (fill === undefined) {
                    // Clear only when the cell has no independent shading beyond
                    // the clear/auto bag (or empty fill).
                    if (prev === undefined) {
                        continue;
                    }
                    const onlyPaintedFill: boolean =
                        (prev.pattern === undefined || prev.pattern === 'clear') &&
                        (prev.color === undefined || prev.color === 'auto');
                    if (!onlyPaintedFill) {
                        continue;
                    }
                    cell.writeTcPr(writeCellShading(cell.readTcPr(), undefined));
                    continue;
                }
                const pattern: string =
                    prev !== undefined &&
                    prev.pattern !== undefined &&
                    prev.pattern.length > 0
                        ? prev.pattern
                        : 'clear';
                const color: string =
                    prev !== undefined && prev.color !== undefined && prev.color.length > 0
                        ? prev.color
                        : 'auto';
                const next: TableShading = {
                    fill: fill,
                    color: color,
                    pattern: pattern
                };
                cell.writeTcPr(writeCellShading(cell.readTcPr(), next));
            }
        }
    }

    /**
     * Gets the formatting of the table.
     */
    get tableFormat(): TableFormat {
        return this.tableFormatInstance;
    }

    /**
     * Gets or sets the accessibility title.
     */
    get title(): string | undefined {
        return readTableCaption(this.tblPr);
    }
    set title(value: string | undefined) {
        this.tblPr = writeTableCaption(this.tblPr, value);
    }

    /**
     * Gets or sets the alternative text description of the table.
     */
    get description(): string | undefined {
        return readTableDescription(this.tblPr);
    }
    set description(value: string | undefined) {
        this.tblPr = writeTableDescription(this.tblPr, value);
    }

    /**
     * Gets or sets the left indent in points.
     */
    get indentFromLeft(): number | undefined {
        return readTableIndent(this.tblPr);
    }
    set indentFromLeft(value: number | undefined) {
        this.tblPr = writeTableIndent(this.tblPr, value);
    }

    /**
     * Gets or sets the effective table width in points from the sum of grid column widths .
     */
    get width(): number {
        const gridWidths: number[] = this.gridColumnWidthsTwips();
        let totalTwips: number = 0;
        for (const value of gridWidths) {
            totalTwips += value;
        }
        if (totalTwips <= 0) {
            return 0;
        }
        return twipsToPoint(totalTwips);
    }
    set width(value: number) {
        if (!isFinite(value) || value < 0) {
            throw new RangeError(
                'Table width must be a non-negative finite number of points, got ' + String(value)
            );
        }
        this.tblPr = writeTablePreferredWidth(this.tblPr, {
            type: 'dxa',
            value: value
        });
    }

    /**
     * @private
     */
    get preferredWidth(): TableWidth | undefined {
        return readTablePreferredWidth(this.tblPr);
    }
    set preferredWidth(value: TableWidth | undefined) {
        this.tblPr = writeTablePreferredWidth(this.tblPr, value);
    }

    /**
     * @private
     */
    get layout(): TableLayout {
        return readTableLayout(this.tblPr);
    }
    set layout(value: TableLayout) {
        this.tblPr = writeTableLayout(this.tblPr, value);
    }

    /**
     * @private
     */
    get look(): TableLook | undefined {
        return readTableLook(this.tblPr);
    }
    set look(value: TableLook | undefined) {
        this.tblPr = writeTableLook(this.tblPr, value);
    }

    /**
     * Gets or sets the number of rows in each band of the table style. If undefined, the default value of 1 is used.
     *
     * @public
     */
    get rowBandSize(): number | undefined {
        return readTableRowBandSize(this.tblPr);
    }
    set rowBandSize(value: number | undefined) {
        if (value !== undefined && !isFinite(value)) {
            throw new RangeError(
                'Table rowBandSize must be a finite number or undefined, got ' + String(value)
            );
        }
        this.tblPr = writeTableRowBandSize(
            this.tblPr,
            value !== undefined ? Math.trunc(value) : undefined
        );
        this.markConditionalFormattingDirty();
    }

    /**
     * Gets or sets the number of columns in each band of the table style. If undefined, the default value of 1 is used.
     *
     * @public
     */
    get columnBandSize(): number | undefined {
        return readTableColumnBandSize(this.tblPr);
    }
    set columnBandSize(value: number | undefined) {
        if (value !== undefined && !isFinite(value)) {
            throw new RangeError(
                'Table columnBandSize must be a finite number or undefined, got ' + String(value)
            );
        }
        this.tblPr = writeTableColumnBandSize(
            this.tblPr,
            value !== undefined ? Math.trunc(value) : undefined
        );
        this.markConditionalFormattingDirty();
    }

    /**
     * Gets or sets the canonical table style id, when assigned.
     *
     * @public
     */
    get styleId(): string | undefined {
        return readTableStyle(this.tblPr);
    }
    set styleId(value: string | undefined) {
        this.tblPr = writeTableStyle(this.tblPr, value);
        this.markConditionalFormattingDirty();
    }

    /**
     * Gets the style id of the applied table style.
     *
     * @public
     */
    get styleName(): string | undefined {
        return readTableStyle(this.tblPr);
    }

    /**
     * Applies a built-in, custom, or named table style to the table.
     *
     * @returns {void}
     * @param {string | TableStyle | BuiltinTableStyle} style - Specifies the style.
     * @throws DetachedObjectError when the table is not bound to a document.
     * @public
     */
    applyStyle(style: string | TableStyle | BuiltinTableStyle): void {
        if (this.documentOwner === undefined) {
            throw new DetachedObjectError(
                'Cannot apply a table style to a table that is not attached to a document'
            );
        }
        let requested: string;
        if (typeof style === 'string') {
            requested = style;
        } else {
            requested = style.styleId;
        }
        const resolved: DocxStyle = resolveStyleForTarget(
            stylesFor(this.documentOwner),
            requested,
            'table'
        );
        this.tblPr = writeTableStyle(this.tblPr, resolved.styleId);
        this.markConditionalFormattingDirty();
    }

    /**
     * Gets or sets a value indicating whether the table style applies special formatting to the first row. The default value is false.
     *
     * @public
     */
    get applyStyleForFirstRow(): boolean {
        const look: TableLook = this.look;
        return look !== undefined && look.firstRow === true;
    }
    set applyStyleForFirstRow(value: boolean) {
        this.mergeTableLook({ firstRow: value === true });
    }

    /**
     * Gets or sets a value indicating whether the table style applies special formatting to the last row. The default value is false.
     *
     * @public
     */
    get applyStyleForLastRow(): boolean {
        const look: TableLook = this.look;
        return look !== undefined && look.lastRow === true;
    }
    set applyStyleForLastRow(value: boolean) {
        this.mergeTableLook({ lastRow: value === true });
    }

    /**
     * Gets or sets a value indicating whether the table style applies special formatting to the first column. The default value is false.
     *
     * @public
     */
    get applyStyleForFirstColumn(): boolean {
        const look: TableLook = this.look;
        return look !== undefined && look.firstCol === true;
    }
    set applyStyleForFirstColumn(value: boolean) {
        this.mergeTableLook({ firstCol: value === true });
    }

    /**
     * Gets or sets a value indicating whether the table style applies special formatting to the last column. The default value is false.
     *
     * @public
     */
    get applyStyleForLastColumn(): boolean {
        const look: TableLook = this.look;
        return look !== undefined && look.lastCol === true;
    }
    set applyStyleForLastColumn(value: boolean) {
        this.mergeTableLook({ lastCol: value === true });
    }

    /**
     * Gets or sets a value indicating whether the table style formats alternating rows differently. The default value is true.
     *
     * @public
     */
    get applyStyleForBandedRows(): boolean {
        const look: TableLook = this.look;
        if (look === undefined) {
            return true;
        }
        return look.noHBand !== true;
    }
    set applyStyleForBandedRows(value: boolean) {
        this.mergeTableLook({ noHBand: value !== true });
    }

    /**
     * Gets or sets a value indicating whether the table style formats alternating columns differently. The default value is true.
     *
     * @public
     */
    get applyStyleForBandedColumns(): boolean {
        const look: TableLook = this.look;
        if (look === undefined) {
            return true;
        }
        return look.noVBand !== true;
    }
    set applyStyleForBandedColumns(value: boolean) {
        this.mergeTableLook({ noVBand: value !== true });
    }

    /**
     * Merge one or more `w:tblLook` flags without clearing unrelated flags.
     *
     * @param {TableLook} partial - The partial.
     * @returns {void} Nothing is returned.
     * @private
     */
    private mergeTableLook(partial: TableLook): void {
        const current: TableLook = this.look;
        const next: TableLook = {
            firstRow: partial.firstRow !== undefined
                ? partial.firstRow
                : current !== undefined ? current.firstRow : undefined,
            lastRow: partial.lastRow !== undefined
                ? partial.lastRow
                : current !== undefined ? current.lastRow : undefined,
            firstCol: partial.firstCol !== undefined
                ? partial.firstCol
                : current !== undefined ? current.firstCol : undefined,
            lastCol: partial.lastCol !== undefined
                ? partial.lastCol
                : current !== undefined ? current.lastCol : undefined,
            noHBand: partial.noHBand !== undefined
                ? partial.noHBand
                : current !== undefined ? current.noHBand : undefined,
            noVBand: partial.noVBand !== undefined
                ? partial.noVBand
                : current !== undefined ? current.noVBand : undefined
        };
        this.tblPr = writeTableLook(this.tblPr, next);
        this.markConditionalFormattingDirty();
    }

    /**
     * Marks row and cell conditional style membership for recalculation.
     * Paragraph `w:pPr/w:cnfStyle` is not authored on dirty paths (Word parity).
     *
     * @returns {void} Nothing is returned.
     * @private
     */
    markConditionalFormattingDirty(): void {
        this.conditionalFormattingDirty = true;
    }

    /**
     * Recalculate conditional table-style membership masks on rows and cells
     * (`w:trPr` / `w:tcPr`). Does not write `w:pPr/w:cnfStyle` — Word emits
     * membership on row/cell only; paragraph cnf is cleared when styles are
     * removed or when a dirty recompute runs so authored output stays clean.
     * Nested tables own their own cascade.
     *
     * @returns {void} Nothing is returned.
     * @private
     */
    updateConditionalFormatting(): void {
        const styleId: string = this.styleId;
        const rows: TableRow[] = this.tableRows;
        const rowCount: number = rows.length;

        const clearParagraphCnf: (cell: TableCell) => void = (cell: TableCell): void => {
            const paragraphs: ReadonlyArray<Paragraph> = cell.listParagraphs();
            for (const paragraph of paragraphs) {
                paragraph.setConditionalFormatting(undefined);
            }
        };

        const clearAllCnf: () => void = (): void => {
            for (let r: number = 0; r < rowCount; r += 1) {
                // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
                const row: TableRow = rows[r]!;
                row.setConditionalFormatting(undefined);
                const cells: TableCell[] = row.listCells();
                for (const cell of cells) {
                    cell.setConditionalFormatting(undefined);
                    clearParagraphCnf(cell);
                }
            }
        };

        if (styleId === undefined || styleId.length === 0) {
            clearAllCnf();
            this.conditionalFormattingDirty = false;
            return;
        }

        let tableStyle: TableStyle | undefined;
        const doc: WordDocument = this.documentOwner;
        if (doc !== undefined) {
            try {
                tableStyle = styleCollectionFor(doc).getTableStyle(styleId);
            } catch (_e) {
                tableStyle = undefined;
            }
        }
        if (tableStyle === undefined) {
            // No resolvable table style: preserve source cnf unless dirty.
            this.conditionalFormattingDirty = false;
            return;
        }
        const condStyles: ConditionalFormattingStyleCollection = tableStyle.conditionalFormattingStyles;
        if (condStyles.count === 0) {
            this.conditionalFormattingDirty = false;
            return;
        }

        const hasType: (type: string) => boolean = (type: string): boolean =>
            condStyles.findByType(type as never) !== undefined;

        const applyFirstRow: boolean = this.applyStyleForFirstRow;
        const applyLastRow: boolean = this.applyStyleForLastRow;
        const applyFirstCol: boolean = this.applyStyleForFirstColumn;
        const applyLastCol: boolean = this.applyStyleForLastColumn;
        const applyHBand: boolean = this.applyStyleForBandedRows;
        const applyVBand: boolean = this.applyStyleForBandedColumns;

        for (let r: number = 0; r < rowCount; r += 1) {
            // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
            const row: TableRow = rows[r]!;
            const rowIndex: number = r;

            // Row trPr cnf: row-level flags only (existing band-size-aware path
            // retained for trPr; gated on style conditional types).
            const isFirstRow: boolean =
                hasType(ConditionalFormattingType.FirstRow) && applyFirstRow && rowIndex === 0;
            const isLastRow: boolean =
                hasType(ConditionalFormattingType.LastRow) &&
                applyLastRow &&
                rowIndex !== 0 &&
                rowIndex === rowCount - 1;
            let oddHBand: boolean = false;
            let evenHBand: boolean = false;
            if (
                hasType(ConditionalFormattingType.OddRowBand) &&
                applyHBand &&
                rowIndex !== rowCount - 1 &&
                rowIndex % 2 === 1
            ) {
                oddHBand = true;
            }
            if (
                hasType(ConditionalFormattingType.EvenRowBand) &&
                applyHBand &&
                rowIndex !== 0 &&
                rowIndex !== rowCount - 1 &&
                rowIndex % 2 === 0
            ) {
                evenHBand = true;
            }

            const rowFlags: NormalizedCnfStyle = normalizeCnfStyle({
                firstRow: isFirstRow,
                lastRow: isLastRow,
                oddHBand: oddHBand,
                evenHBand: evenHBand
            });
            row.setConditionalFormatting(rowFlags);

            const cells: TableCell[] = row.listCells();
            const cellCount: number = cells.length;
            for (let c: number = 0; c < cellCount; c += 1) {
                // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
                const cell: TableCell = cells[c]!;
                const cellIndex: number = c;
                const cellState: NormalizedCnfStyle = normalizeCnfStyle({
                    firstColumn:
                        hasType(ConditionalFormattingType.FirstColumn) &&
                        cellIndex === 0 &&
                        applyFirstCol,
                    lastColumn:
                        hasType(ConditionalFormattingType.LastColumn) &&
                        cellIndex !== 0 &&
                        cellIndex === cellCount - 1 &&
                        applyLastCol,
                    oddVBand:
                        hasType(ConditionalFormattingType.OddColumnBand) &&
                        cellIndex !== cellCount - 1 &&
                        cellIndex % 2 === 1 &&
                        applyVBand,
                    evenVBand:
                        hasType(ConditionalFormattingType.EvenColumnBand) &&
                        cellIndex !== 0 &&
                        cellIndex !== cellCount - 1 &&
                        cellIndex % 2 === 0 &&
                        applyVBand,
                    firstRowLastColumn:
                        hasType(ConditionalFormattingType.TopRightCell) &&
                        rowIndex === 0 &&
                        cellIndex !== 0 &&
                        cellIndex === cellCount - 1 &&
                        applyFirstRow &&
                        applyLastCol,
                    firstRowFirstColumn:
                        hasType(ConditionalFormattingType.TopLeftCell) &&
                        rowIndex === 0 &&
                        cellIndex === 0 &&
                        applyFirstRow &&
                        applyFirstCol,
                    lastRowLastColumn:
                        hasType(ConditionalFormattingType.BottomRightCell) &&
                        rowIndex !== 0 &&
                        rowIndex === rowCount - 1 &&
                        cellIndex !== 0 &&
                        cellIndex === cellCount - 1 &&
                        applyLastRow &&
                        applyLastCol,
                    lastRowFirstColumn:
                        hasType(ConditionalFormattingType.BottomLeftCell) &&
                        rowIndex !== 0 &&
                        rowIndex === rowCount - 1 &&
                        cellIndex === 0 &&
                        applyLastRow &&
                        applyFirstCol
                });

                // Word writes cnf on trPr/tcPr only — never author pPr/cnfStyle.
                if (hasAnyCnfStyleFlag(cellState)) {
                    cell.setConditionalFormatting(cellState);
                } else {
                    cell.setConditionalFormatting(undefined);
                }
                clearParagraphCnf(cell);
            }
        }
        this.conditionalFormattingDirty = false;
    }

    /**
     * Owning document when bound.
     *
     * @private
     */
    get owner(): WordDocument | undefined {
        return this.documentOwner;
    }

    /**
     * Rebuild the table to `rowCount` × `columnCount` empty cells.
     *
     * Authoring path: empty cells (no auto paragraph), fixed layout, equal
     * client-width columns, and `TableGrid` when document-bound.
     *
     * @returns {void}
     * @param {number} rowCount - Specifies the row count.
     * @param {number} columnCount - Specifies the column count.
     */
    resetCells(rowCount: number, columnCount: number): void {
        if (rowCount < 1 || columnCount < 1) {
            throw new RangeError('Table must have at least one row and one column');
        }
        const rows: TableRow[] = [];
        for (let r: number = 0; r < rowCount; r += 1) {
            rows.push(this.buildEmptyRowWithColumns(columnCount));
        }
        this.tableRows = rows;
        this.rowsInstance.syncFromHost();
        if (this.documentOwner !== undefined) {
            this.bindDocument(this.documentOwner);
        }
        applyAuthoringTableDefaults(this, columnCount);
        // The library paints table backColor onto every cell; rebuilds must re-apply
        // because paint-at-setter only walks cells that existed when backColor was set.
        this.reapplyTableBackColorToCells();
        this.markConditionalFormattingDirty();
    }

    /**
     * Resizes the table to fit its content, to fit the window, or to use fixed column widths.
     *
     * @param {AutoFitType} autoFitType - Specifies how the table is resized.
     * @returns {void} Nothing is returned.
     */
    autoFit(autoFitType: AutoFitType): void {
        switch (autoFitType) {
        case AutoFitType.FitToContent:
            this.applyFitToContent();
            return;
        case AutoFitType.FitToWindow:
            this.applyFitToWindow();
            return;
        case AutoFitType.FixedColumnWidth:
            this.applyFixedColumnWidth();
            return;
        default: {
            const _exhaustive: never = autoFitType;
            throw new RangeError('Unsupported AutoFitType: ' + String(_exhaustive));
        }
        }
    }

    /**
     * Append an empty row with the current column count.
     * Prefer {@link Table.rows}.add for new code.
     *
     * @returns {TableRow} - Returns the TableRow.
     */
    appendRow(): TableRow {
        return this.rowsInstance.add();
    }

    /**
     * Insert an empty row at `index` (0 … rows.length inclusive).
     * Prefer {@link Table.rows}.insert for new code.
     *
     * @returns {TableRow} - Returns the TableRow.
     * @param {number} index - Specifies the index.
     */
    insertRow(index: number): TableRow {
        return this.rowsInstance.insert(index);
    }

    /**
     * Remove a row that currently belongs to this table.
     * Prefer {@link Table.rows}.remove for new code.
     *
     * @returns {void}
     * @param {TableRow} row - Specifies the row.
     */
    removeRow(row: TableRow): void {
        this.rowsInstance.remove(row);
    }

    /**
     * Merge contiguous structural cells in one row (inclusive cell indexes).
     *
     * @returns {void}
     * @param {number} rowIndex - Specifies the row index.
     * @param {number} startCellIndex - Specifies the start cell index.
     * @param {number} endCellIndex - Specifies the end cell index.
     */
    applyHorizontalMerge(rowIndex: number, startCellIndex: number, endCellIndex: number): void {
        if (
            !Number.isInteger(rowIndex) ||
            !Number.isInteger(startCellIndex) ||
            !Number.isInteger(endCellIndex)
        ) {
            throw new RangeError('applyHorizontalMerge indexes must be integers');
        }
        if (startCellIndex > endCellIndex) {
            throw new RangeError('applyHorizontalMerge range is inverted or empty');
        }
        // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
        const row: TableRow = this.tableRows[rowIndex];
        if (row === undefined) {
            throw new RangeError('applyHorizontalMerge row index is out of bounds');
        }
        const cells: TableCell[] = row.listCells();
        if (startCellIndex < 0 || endCellIndex >= cells.length) {
            throw new RangeError('applyHorizontalMerge cell index is out of bounds');
        }
        if (startCellIndex === endCellIndex) {
            return;
        }
        // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
        const startCell: TableCell = cells[startCellIndex]!;
        // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
        const endCell: TableCell = cells[endCellIndex]!;
        const fromColumn: number = cellStartColumn(row, startCell);
        const toColumn: number = cellStartColumn(row, endCell) + cellColumnSpan(endCell) - 1;
        if (fromColumn < 0 || toColumn < fromColumn) {
            throw new RangeError('applyHorizontalMerge could not resolve grid columns');
        }
        this.mergeCells({
            fromRow: rowIndex,
            fromColumn: fromColumn,
            toRow: rowIndex,
            toColumn: toColumn
        });
    }

    /**
     * Vertical merge along one grid column across inclusive row indexes.
     *
     * @returns {void}
     * @param {number} columnIndex - Specifies the column index.
     * @param {number} startRowIndex - Specifies the start row index.
     * @param {number} endRowIndex - Specifies the end row index.
     */
    applyVerticalMerge(columnIndex: number, startRowIndex: number, endRowIndex: number): void {
        if (
            !Number.isInteger(columnIndex) ||
            !Number.isInteger(startRowIndex) ||
            !Number.isInteger(endRowIndex)
        ) {
            throw new RangeError('applyVerticalMerge indexes must be integers');
        }
        if (startRowIndex > endRowIndex) {
            throw new RangeError('applyVerticalMerge range is inverted or empty');
        }
        if (startRowIndex < 0 || endRowIndex >= this.tableRows.length) {
            throw new RangeError('applyVerticalMerge row index is out of bounds');
        }
        if (columnIndex < 0 || columnIndex >= this.columnCount()) {
            throw new RangeError('applyVerticalMerge column index is out of bounds');
        }
        if (startRowIndex === endRowIndex) {
            return;
        }
        this.mergeCells({
            fromRow: startRowIndex,
            fromColumn: columnIndex,
            toRow: endRowIndex,
            toColumn: columnIndex
        });
    }


    /**
     * @param {MergeCellsRange} range - The range.
     * @returns {TableCell} The result.
     * @private
     */
    mergeCells(range: MergeCellsRange): TableCell {
        let ts330: any;
        let ts331: any;
        const fromRow: number = range.fromRow;
        const fromColumn: number = range.fromColumn;
        const toRow: number = range.toRow;
        const toColumn: number = range.toColumn;
        if (
            !Number.isInteger(fromRow) ||
            !Number.isInteger(fromColumn) ||
            !Number.isInteger(toRow) ||
            !Number.isInteger(toColumn)
        ) {
            throw new RangeError('mergeCells range coordinates must be integers');
        }
        if (fromRow > toRow || fromColumn > toColumn) {
            throw new RangeError('mergeCells range is inverted or empty');
        }
        if (fromRow < 0 || fromColumn < 0 || toRow >= this.tableRows.length) {
            throw new RangeError('mergeCells range is out of bounds');
        }
        const colCount: number = this.columnCount();
        if (toColumn >= colCount) {
            throw new RangeError('mergeCells range is out of bounds');
        }
        const rowSpan: number = toRow - fromRow + 1;
        const colSpan: number = toColumn - fromColumn + 1;
        if (rowSpan === 1 && colSpan === 1) {
            // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
            const singleRow: TableRow = this.tableRows[fromRow];
            if (singleRow === undefined) {
                throw new RangeError('mergeCells range is out of bounds');
            }
            const single: { cell: TableCell; startColumn: number; cellIndex: number; } = findCoveringCell(singleRow, fromColumn);
            if (single === undefined) {
                throw new RangeError('mergeCells range is out of bounds');
            }
            return single.cell;
        }
        const absorbed: TableCell[] = [];
        let origin: TableCell | undefined;
        for (let r: number = fromRow; r <= toRow; r += 1) {
            // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
            const row: TableRow = this.tableRows[r];
            if (row === undefined) {
                throw new RangeError('mergeCells range is out of bounds');
            }
            let c: number = fromColumn;
            while (c <= toColumn) {
                const hit: { cell: TableCell; startColumn: number; cellIndex: number; } = findCoveringCell(row, c);
                if (hit === undefined) {
                    throw new RangeError('mergeCells range is out of bounds');
                }
                if (
                    hit.startColumn < fromColumn ||
                    hit.startColumn + cellColumnSpan(hit.cell) - 1 > toColumn
                ) {
                    throw new RangeError(
                        'mergeCells range partially overlaps an existing merged cell'
                    );
                }
                if (r === fromRow && hit.startColumn === fromColumn) {
                    origin = hit.cell;
                } else if (hit.cell !== origin) {
                    absorbed.push(hit.cell);
                }
                c = hit.startColumn + cellColumnSpan(hit.cell);
            }
        }
        if (origin === undefined) {
            throw new RangeError('mergeCells could not resolve origin cell');
        }
        for (const cell of absorbed) {
            this.moveCellContentInto(origin, cell);
        }
        const preMergeSpan: Map<TableCell, number> = new Map<TableCell, number>();
        for (let r: number = fromRow; r <= toRow; r += 1) {
            // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
            const snapRow: TableRow = this.tableRows[r];
            if (snapRow === undefined) {
                throw new RangeError('mergeCells range is out of bounds');
            }
            const snapCells: TableCell[] = snapRow.listCells();
            for (const cell of snapCells) {
                preMergeSpan.set(cell, cellColumnSpan(cell));
            }
        }
        if (colSpan > 1) {
            origin.gridSpan = colSpan;
        } else {
            origin.gridSpan = undefined;
        }
        if (rowSpan > 1) {
            origin.verticalMerge = 'restart';
        } else {
            origin.verticalMerge = undefined;
        }
        for (let r: number = fromRow; r <= toRow; r += 1) {
            // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
            const row: TableRow = this.tableRows[r];
            if (row === undefined) {
                throw new RangeError('mergeCells range is out of bounds');
            }
            const keep: TableCell[] = [];
            let cursor: number = 0;
            let placedMergeCell: boolean = false;
            const rowCells: TableCell[] = row.listCells();
            for (const cell of rowCells) {
                const span: number = ((ts330 = preMergeSpan.get(cell)), ts330 != null ? ts330 : cellColumnSpan(cell));
                const cellStart: number = cursor;
                const cellEnd: number = cursor + span - 1;
                cursor += span;
                const overlaps: boolean = cellEnd >= fromColumn && cellStart <= toColumn;
                if (!overlaps) {
                    keep.push(cell);
                    continue;
                }
                if (r === fromRow && cell === origin) {
                    keep.push(cell);
                    placedMergeCell = true;
                    continue;
                }
                if (r > fromRow && cellStart === fromColumn && !placedMergeCell) {
                    cell.gridSpan = colSpan > 1 ? colSpan : undefined;
                    cell.verticalMerge = 'continue';
                    this.ensureAtLeastOneParagraph(cell);
                    keep.push(cell);
                    placedMergeCell = true;
                    continue;
                }
            }
            if (r > fromRow && !placedMergeCell) {
                const contCell: TableCell = this.createBoundEmptyCell();
                contCell.gridSpan = colSpan > 1 ? colSpan : undefined;
                contCell.verticalMerge = 'continue';
                let insertAt: number = 0;
                let g: number = 0;
                while (insertAt < keep.length && g < fromColumn) {
                    // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
                    const kept: TableCell = keep[insertAt];
                    if (kept === undefined) {
                        break;
                    }
                    g += ((ts331 = preMergeSpan.get(kept)), ts331 != null ? ts331 : cellColumnSpan(kept));
                    insertAt += 1;
                }
                keep.splice(insertAt, 0, contCell);
            }
            if (keep.length < 1) {
                throw new DetachedObjectError('mergeCells would leave a row with no cells');
            }
            row.replaceCells(keep);
        }
        this.markConditionalFormattingDirty();
        return origin;
    }

    /**
     * @param {TableCell} cell - The cell.
     * @returns {ReadonlyArray<TableCell>} The result.
     * @private
     */
    splitCell(cell: TableCell): ReadonlyArray<TableCell> {
        const region: MergeRegion = this.getMergeRegion(cell);
        if (region === undefined || region.origin !== cell) {
            throw new RangeError('splitCell requires a merge origin cell in this table');
        }
        const fromRow: number = region.fromRow;
        const fromColumn: number = region.fromColumn;
        const toRow: number = region.toRow;
        const toColumn: number = region.toColumn;
        const released: TableCell[] = [];
        const regionCells: TableCell[] = [region.origin];
        for (const cell of region.continuations) {
            regionCells.push(cell);
        }
        for (let r: number = fromRow; r <= toRow; r += 1) {
            // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
            const row: TableRow = this.tableRows[r];
            if (row === undefined) {
                continue;
            }
            const next: TableCell[] = [];
            let cursor: number = 0;
            const structuralCells: TableCell[] = row.listCells();
            for (const structural of structuralCells) {
                const span: number = cellColumnSpan(structural);
                const start: number = cursor;
                cursor += span;
                let inRegion: boolean = false;
                for (const cell of regionCells) {
                    if (cell === structural) {
                        inRegion = true;
                        break;
                    }
                }
                if (!inRegion) {
                    next.push(structural);
                    continue;
                }
                for (let c: number = start; c < start + span; c += 1) {
                    if (c < fromColumn || c > toColumn) {
                        const piece: TableCell = this.createBoundEmptyCell();
                        this.ensureAtLeastOneParagraph(piece);
                        next.push(piece);
                        released.push(piece);
                        continue;
                    }
                    let piece: TableCell;
                    if (r === fromRow && c === fromColumn) {
                        piece = region.origin;
                        piece.gridSpan = undefined;
                        piece.verticalMerge = undefined;
                    } else if (c === start && structural !== region.origin) {
                        piece = structural;
                        piece.gridSpan = undefined;
                        piece.verticalMerge = undefined;
                        this.ensureAtLeastOneParagraph(piece);
                    } else {
                        piece = this.createBoundEmptyCell();
                        this.ensureAtLeastOneParagraph(piece);
                    }
                    next.push(piece);
                    released.push(piece);
                }
            }
            if (next.length < 1) {
                throw new DetachedObjectError('splitCell would leave a row with no cells');
            }
            row.replaceCells(next);
        }
        this.markConditionalFormattingDirty();
        return released;
    }

    /**
     * @param {TableCell} cell - The cell.
     * @returns {MergeRegion | undefined} The result.
     * @private
     */
    getMergeRegion(cell: TableCell): MergeRegion | undefined {
        let rowIndex: number = -1;
        for (const [i, row] of this.tableRows.entries()) {
            const rowCells: TableCell[] = row == null ? undefined : row.listCells();
            if (rowCells !== undefined && rowCells.indexOf(cell) !== -1) {
                rowIndex = i;
                break;
            }
        }
        if (rowIndex < 0) {
            return undefined;
        }
        // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
        const row: TableRow = this.tableRows[rowIndex];
        if (row === undefined) {
            return undefined;
        }
        const startCol: number = cellStartColumn(row, cell);
        if (startCol < 0) {
            return undefined;
        }
        const span: number = cellColumnSpan(cell);
        const vMerge: VerticalMerge = cell.verticalMerge;
        if (span <= 1 && vMerge === undefined) {
            return undefined;
        }
        let originRow: number = rowIndex;
        let originCell: TableCell = cell;
        if (vMerge === 'continue') {
            let foundRestart: boolean = false;
            for (let r: number = rowIndex - 1; r >= 0; r -= 1) {
                // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
                const aboveRow: TableRow = this.tableRows[r];
                if (aboveRow === undefined) {
                    break;
                }
                const above: { cell: TableCell; startColumn: number; cellIndex: number; } = findCoveringCell(aboveRow, startCol);
                if (above === undefined || above.startColumn !== startCol) {
                    break;
                }
                if (cellColumnSpan(above.cell) !== span) {
                    break;
                }
                if (above.cell.verticalMerge === 'restart') {
                    originRow = r;
                    originCell = above.cell;
                    foundRestart = true;
                    break;
                }
                if (above.cell.verticalMerge === 'continue') {
                    continue;
                }
                break;
            }
            if (!foundRestart) {
                return {
                    fromRow: rowIndex,
                    fromColumn: startCol,
                    toRow: rowIndex,
                    toColumn: startCol + span - 1,
                    origin: cell,
                    continuations: []
                };
            }
        }
        const originSpan: number = cellColumnSpan(originCell);
        // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
        const originRowObj: TableRow = this.tableRows[originRow];
        if (originRowObj === undefined) {
            return undefined;
        }
        const fromColumn: number = cellStartColumn(originRowObj, originCell);
        if (fromColumn < 0) {
            return undefined;
        }
        const toColumn: number = fromColumn + originSpan - 1;
        let toRow: number = originRow;
        const continuations: TableCell[] = [];
        if (originCell.verticalMerge === 'restart') {
            for (let r: number = originRow + 1; r < this.tableRows.length; r += 1) {
                // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
                const contRow: TableRow = this.tableRows[r];
                if (contRow === undefined) {
                    break;
                }
                const hit: { cell: TableCell; startColumn: number; cellIndex: number; } = findCoveringCell(contRow, fromColumn);
                if (
                    hit === undefined ||
                    hit.startColumn !== fromColumn ||
                    cellColumnSpan(hit.cell) !== originSpan ||
                    hit.cell.verticalMerge !== 'continue'
                ) {
                    break;
                }
                toRow = r;
                continuations.push(hit.cell);
            }
        }
        if (originSpan <= 1 && originCell.verticalMerge === undefined) {
            return undefined;
        }
        return {
            fromRow: originRow,
            fromColumn: fromColumn,
            toRow: toRow,
            toColumn: toColumn,
            origin: originCell,
            continuations: continuations
        };
    }

    private moveCellContentInto(target: TableCell, source: TableCell): void {
        if (target === source) {
            return;
        }
        const needBreak: boolean = cellHasVisibleText(target) && cellHasVisibleText(source);
        if (needBreak) {
            const br: Paragraph = new Paragraph(undefined);
            target.appendRawBlock({ type: 'paragraph', paragraph: br });
        }
        const moved: BlockContent[] = source.listBlocks().slice();
        source.replaceItems([]);
        for (const content of moved) {
            target.appendRawBlock(content);
        }
        this.ensureAtLeastOneParagraph(source);
    }

    private ensureAtLeastOneParagraph(cell: TableCell): void {
        // Merge path only: WordprocessingML cells require ≥1 paragraph after content moves.
        if (cell.listParagraphs().length === 0) {
            cell.appendParagraph();
        }
    }

    private createBoundEmptyCell(): TableCell {
        const cell: TableCell = new TableCell(this.documentOwner, []);
        if (this.documentOwner !== undefined) {
            cell.bindDocument(this.documentOwner);
        }
        this.paintTableBackColorOntoCell(cell);
        return cell;
    }

    /**
     * Re-paint every cell from current `w:tblPr/w:shd` fill (Word parity).
     * No-op when table shading has no fill.
     *
     * @returns {void} Nothing is returned.
     * @private
     */
    reapplyTableBackColorToCells(): void {
        const shd: TableShading = readTableShading(this.tblPr);
        const fill: string = shd === undefined ? undefined : shd.fill;
        if (fill === undefined || fill.length === 0) {
            return;
        }
        this.applyTableBackColorToCells(fill);
    }

    /**
     * Copy table-level back fill onto one newly created cell.
     *
     * @param {TableCell} cell - The cell.
     * @returns {void} Nothing is returned.
     * @private
     */
    paintTableBackColorOntoCell(cell: TableCell): void {
        const shd: TableShading = readTableShading(this.tblPr);
        if (shd === undefined || shd.fill === undefined || shd.fill.length === 0) {
            return;
        }
        const pattern: string =
            shd.pattern !== undefined && shd.pattern.length > 0 ? shd.pattern : 'clear';
        const color: string = shd.color !== undefined && shd.color.length > 0 ? shd.color : 'auto';
        const next: TableShading = {
            fill: shd.fill,
            color: color,
            pattern: pattern
        };
        cell.writeTcPr(writeCellShading(cell.readTcPr(), next));
    }

    /**
     * @param {WordDocument} document - The document.
     * @returns {void} Nothing is returned.
     * @private
     */
    bindDocument(document: WordDocument): void {
        this.documentOwner = document;
        for (const row of this.tableRows) {
            row.bindDocument(document);
            const cells: TableCell[] = row.listCells();
            for (const cell of cells) {
                cell.bindDocument(document);
            }
        }
    }

    /**
     * @returns {OpenXmlElement} The result.
     * @private
     */
    toOpenXml(): OpenXmlElement {
        if (this.conditionalFormattingDirty) {
            this.updateConditionalFormatting();
        }
        const children: OpenXmlElement[] = [];
        for (const element of this.prefixMarkup) {
            children.push(element);
        }
        children.push(this.tblPr);
        children.push(this.tblGrid);
        for (const row of this.tableRows) {
            children.push(row.toOpenXml());
        }
        return wmlElement('tbl', { children: children });
    }

    private columnCount(): number {
        let gridCols: number = 0;
        const kids: ReadonlyArray<OpenXmlElement> = elementChildren(this.tblGrid);
        for (const element of kids) {
            if (isWml(element, 'gridCol')) {
                gridCols += 1;
            }
        }
        if (gridCols > 0) {
            return gridCols;
        }
        const firstRow: TableRow = this.tableRows[0];
        if (firstRow === undefined) {
            return 1;
        }
        const first: number = firstRow.listCells().length;
        return first > 0 ? first : 1;
    }

    private gridColumnWidthsTwips(): number[] {
        const widths: number[] = [];
        const kids: ReadonlyArray<OpenXmlElement> = elementChildren(this.tblGrid);
        for (const child of kids) {
            if (!isWml(child, 'gridCol')) {
                continue;
            }
            const raw: number = parseDecimalVal(wmlAttrVal(child, 'w'));
            widths.push(raw !== undefined && raw > 0 ? raw : DEFAULT_GRID_COL_TWIPS);
        }
        if (widths.length > 0) {
            return widths;
        }
        const cols: number = this.columnCount();
        const out: number[] = [];
        for (let i: number = 0; i < cols; i += 1) {
            out.push(DEFAULT_GRID_COL_TWIPS);
        }
        return out;
    }

    private cellWidthFromGridTwips(
        gridWidths: ReadonlyArray<number>,
        startColumn: number,
        span: number
    ): number {
        let total: number = 0;
        for (let i: number = 0; i < span; i += 1) {
            const w: number = gridWidths[startColumn + i];
            total += w !== undefined && w > 0 ? w : DEFAULT_GRID_COL_TWIPS;
        }
        return total > 0 ? total : DEFAULT_GRID_COL_TWIPS * Math.max(span, 1);
    }

    private applyFitToContent(): void {
        this.layout = 'autoFit';
        this.preferredWidth = autoWidthZero();
        for (const row of this.tableRows) {
            const cells: TableCell[] = row.listCells();
            for (const cell of cells) {
                cell.preferredWidth = autoWidthZero();
            }
        }
    }

    private applyFitToWindow(): void {
        const gridWidths: number[] = this.gridColumnWidthsTwips();
        let tableWidthTwips: number = 0;
        for (const value of gridWidths) {
            tableWidthTwips += value;
        }
        const divisor: number = tableWidthTwips > 0 ? tableWidthTwips : DEFAULT_GRID_COL_TWIPS;
        this.layout = 'autoFit';
        this.preferredWidth = {
            type: 'pct',
            value: twipsToPoint(PCT_100_FIFTIETHS)
        };
        for (const row of this.tableRows) {
            let cursor: number = 0;
            const cells: TableCell[] = row.listCells();
            for (const cell of cells) {
                const span: number = cellColumnSpan(cell);
                const existing: TableWidth = cell.preferredWidth;
                if ((existing == null ? undefined : existing.type) !== 'pct') {
                    const cellTwips: number = this.cellWidthFromGridTwips(gridWidths, cursor, span);
                    const fiftieths: number = Math.max(
                        0,
                        Math.round((cellTwips / divisor) * PCT_100_FIFTIETHS)
                    );
                    cell.preferredWidth = {
                        type: 'pct',
                        value: twipsToPoint(fiftieths)
                    };
                }
                cursor += span;
            }
        }
    }

    private applyFixedColumnWidth(): void {
        const gridWidths: number[] = this.gridColumnWidthsTwips();
        this.layout = 'fixed';
        this.preferredWidth = autoWidthZero();
        for (const row of this.tableRows) {
            let cursor: number = 0;
            const cells: TableCell[] = row.listCells();
            for (const cell of cells) {
                const span: number = cellColumnSpan(cell);
                const cellTwips: number = this.cellWidthFromGridTwips(gridWidths, cursor, span);
                cell.preferredWidth = {
                    type: 'dxa',
                    value: twipsToPoint(cellTwips)
                };
                cursor += span;
            }
        }
    }

    private buildEmptyRow(): TableRow {
        return this.buildEmptyRowWithColumns(this.columnCount());
    }

    private buildEmptyRowWithColumns(columnCount: number): TableRow {
        const cells: TableCell[] = [];
        for (let c: number = 0; c < columnCount; c += 1) {
            cells.push(this.createBoundEmptyCell());
        }
        const row: TableRow = new TableRow([], undefined, cells, this);
        if (this.documentOwner !== undefined) {
            row.bindDocument(this.documentOwner);
            for (const cell of cells) {
                cell.bindDocument(this.documentOwner);
            }
        }
        return row;
    }

    /**
     * @param {TableCell} cell - The cell.
     * @returns {number} The result.
     * @private
     * Effective cell width in points from the table grid (and cell span).
     */
    effectiveCellWidthPoints(cell: TableCell): number {
        const rows: TableRow[] = this.tableRows;
        for (const row of rows) {
            const cells: TableCell[] = row.listCells();
            let cursor: number = 0;
            for (const cellItem9 of cells) {
                const current: TableCell = cellItem9!;
                const span: number = cellColumnSpan(current);
                if (current === cell) {
                    const twips: number = this.cellWidthFromGridTwips(
                        this.gridColumnWidthsTwips(),
                        cursor,
                        span
                    );
                    return twipsToPoint(twips);
                }
                cursor += span;
            }
        }
        return twipsToPoint(DEFAULT_GRID_COL_TWIPS);
    }

    /**
     * Create an independent copy of this table.
     * All rows, cells, formatting, and grid structure are cloned.
     *
     * The cloned table is detached and ready for attachment to a body.
     *
     * @returns {Table} Cloned table.
     * @public
     */
    clone(): Table {
        // Clone prefix markup
        const clonedPrefixMarkup: OpenXmlElement[] = [];
        for (const element of this.prefixMarkup) {
            clonedPrefixMarkup.push(element);
        }

        // Clone table properties
        const clonedTblPr: OpenXmlElement = this.tblPr;

        // Clone table grid
        const clonedTblGrid: OpenXmlElement = this.tblGrid;

        // Clone all rows
        const clonedRows: TableRow[] = [];
        for (const row of this.tableRows) {
            clonedRows.push(row.clone());
        }

        // Create the cloned table
        const cloned: Table = new Table(clonedPrefixMarkup, clonedTblPr, clonedTblGrid, clonedRows);

        // Bind the cloned rows and cells to the new table
        for (const row of clonedRows) {
            cloned.bindRow(row);
        }

        return cloned;
    }
}

/**
 * One row of a table — ordered cells with row-level formatting.
 *
 * @public
 */
export class TableRow implements TableCellCollectionHost<TableCell, Table>, RowFormatHost {
    private readonly rowExtras: OpenXmlElement[];
    private trPr: OpenXmlElement | undefined;
    private tableCells: TableCell[];
    private boundDocument: WordDocument | undefined;
    private ownerTableRef: Table | undefined;
    private readonly cellsInstance: TableCellCollection<TableCell>;
    private readonly rowFormatInstance: RowFormat;

    /**
     * @param {OpenXmlElement[]} extras - The extras.
     * @param {OpenXmlElement | undefined} trPr - The tr pr.
     * @param {TableCell[]} cells - The cells.
     * @param {Table} ownerTable - The owner table.
     * @private
     */
    constructor(
        extras: OpenXmlElement[],
        trPr: OpenXmlElement | undefined,
        /**
         * Gets or sets the cells.
         */
        cells: TableCell[],
        /**
         * Gets or sets the owner table.
         */
        ownerTable?: Table
    ) {
        this.rowExtras = extras;
        this.trPr = trPr;
        this.tableCells = cells;
        this.boundDocument = undefined;
        this.ownerTableRef = ownerTable;
        this.cellsInstance = new TableCellCollection<TableCell>(this);
        this.rowFormatInstance = new RowFormat(this);
        for (const cellItem9 of cells) {
            cellItem9!.setOwnerRow(this);
        }
    }

    /**
     * @param {Table | undefined} table - The table.
     * @returns {void} Nothing is returned.
     * @private
     */
    setOwnerTable(table: Table | undefined): void {
        this.ownerTableRef = table;
    }

    /**
     * Gets the cells collection.
     */
    get cells(): TableCellCollection<TableCell> {
        return this.cellsInstance;
    }

    /**
     * @returns {TableCell[]} The result.
     * @private
     */
    listCells(): TableCell[] {
        return this.tableCells;
    }

    /**
     * @param {TableCell[]} cells - The cells.
     * @returns {void} Nothing is returned.
     * @private
     * Replace structural cells in this row (merge/split internal).
     */
    replaceCells(cells: TableCell[]): void {
        if (cells.length < 1) {
            throw new DetachedObjectError('A table row must retain at least one cell');
        }
        const previous: TableCell[] = this.tableCells;
        for (const cell of previous) {
            if (cells.indexOf(cell) === -1) {
                cell.setOwnerRow(undefined);
            }
        }
        this.tableCells = cells;
        for (const cellItem9 of cells) {
            cellItem9!.setOwnerRow(this);
        }
        this.cellsInstance.syncFromHost();
        if (this.ownerTableRef !== undefined) {
            this.ownerTableRef.markConditionalFormattingDirty();
        }
    }

    /**
     * @returns {TableCell} The result.
     * @private
     */
    createEmptyCell(): TableCell {
        const cell: TableCell = new TableCell(this.boundDocument, []);
        cell.setOwnerRow(this);
        if (this.boundDocument !== undefined) {
            cell.bindDocument(this.boundDocument);
        }
        if (this.ownerTableRef !== undefined) {
            this.ownerTableRef.paintTableBackColorOntoCell(cell);
        }
        return cell;
    }

    /**
     * @param {TableCell} cell - The cell.
     * @returns {void} Nothing is returned.
     * @private
     */
    bindCell(cell: TableCell): void {
        cell.setOwnerRow(this);
        if (this.boundDocument !== undefined) {
            cell.bindDocument(this.boundDocument);
        }
    }

    /**
     * @returns {number} The result.
     * @private
     */
    minCellCount(): number {
        return 1;
    }

    /**
     * @returns {Table | undefined} The result.
     * @private
     * Host probe for {@link TableCellCollection} (nullable; does not throw).
     */
    getOwnerTableOrUndefined(): Table | undefined {
        return this.ownerTableRef;
    }

    /**
     * @returns {OpenXmlElement | undefined} The result.
     * @private
     */
    readTrPr(): OpenXmlElement | undefined {
        return this.trPr;
    }

    /**
     * @param {OpenXmlElement | undefined} next - The next.
     * @returns {void} Nothing is returned.
     * @private
     */
    writeTrPr(next: OpenXmlElement | undefined): void {
        this.trPr = next;
    }

    /**
     * Gets the formatting of the row.
     */
    get rowFormat(): RowFormat {
        return this.rowFormatInstance;
    }

    /**
     * Gets the owning table.
     */
    get ownerTable(): Table {
        if (this.ownerTableRef === undefined) {
            throw new DetachedObjectError('This row is no longer attached to a table');
        }
        return this.ownerTableRef;
    }

    /**
     * Gets or sets the row height in points.
     */
    get height(): number {
        const bag: TableRowHeight = readRowHeight(this.trPr);
        return bag === undefined ? 0 : bag.value;
    }
    set height(value: number) {
        if (!isFinite(value) || value < 0) {
            throw new RangeError(
                'Row height must be a non-negative finite number of points, got ' + String(value)
            );
        }
        const prev: TableRowHeight = readRowHeight(this.trPr);
        const rule: TableRowHeightRule =
            prev !== undefined
                ? prev.rule
                : TableRowHeightRule.Auto;
        if (value === 0 && rule === TableRowHeightRule.Auto) {
            this.trPr = writeRowHeight(this.trPr, undefined);
            return;
        }
        this.trPr = writeRowHeight(this.trPr, { value: value, rule: rule });
    }

    /**
     * Gets or sets the height type.
     */
    get heightType(): TableRowHeightType {
        const bag: TableRowHeight = readRowHeight(this.trPr);
        return bag === undefined ? ('auto' as TableRowHeightType) : bag.rule;
    }
    set heightType(value: TableRowHeightType) {
        if (
            value !== ('auto' as TableRowHeightType) &&
            value !== ('exact' as TableRowHeightType) &&
            value !== ('atLeast' as TableRowHeightType)
        ) {
            throw new RangeError('Invalid row heightType: ' + String(value));
        }
        const prev: TableRowHeight = readRowHeight(this.trPr);
        const heightValue: number = prev !== undefined ? prev.value : 0;
        if (value === ('auto' as TableRowHeightType) && heightValue === 0) {
            this.trPr = writeRowHeight(this.trPr, undefined);
            return;
        }
        this.trPr = writeRowHeight(this.trPr, { value: heightValue, rule: value });
    }

    /**
     * Gets or sets a value indicating whether the header option is enabled.
     */
    get isHeader(): boolean {
        return readRowIsHeader(this.trPr) === true;
    }
    set isHeader(value: boolean) {
        this.trPr = writeRowIsHeader(this.trPr, value === true ? true : undefined);
    }

    /**
     * @param {WordDocument} document - The document.
     * @returns {void} Nothing is returned.
     * @private
     * Records the owning document so appended cells bind to it.
     */
    bindDocument(document: WordDocument): void {
        this.boundDocument = document;
        for (const cell of this.tableCells) {
            cell.bindDocument(document);
        }
    }

    /**
     * @private
     * Serializes the row back to its `w:tr` element.
     */
    /**
     * Gets the table style conditions that apply to the row.
     *
     * @returns {CnfStyle | undefined} - Returns the table style conditions that apply to the row.
     * @public
     */
    getConditionalFormatting(): CnfStyle | undefined {
        return readRowCnfStyle(this.trPr);
    }

    /**
     * Write or clear row conditional formatting membership.
     *
     * @returns {void}
     * @param {NormalizedCnfStyle | CnfStyle | undefined} state - Specifies the state.
     * @public
     */
    setConditionalFormatting(state: NormalizedCnfStyle | CnfStyle | undefined): void {
        this.trPr = writeRowCnfStyle(this.trPr, state);
    }

    /**
     * Converts the row to its OpenXML element.
     *
     * @returns {OpenXmlElement} Returns the OpenXML element of the row.
     *
     * @private
     */
    toOpenXml(): OpenXmlElement {
        const children: OpenXmlElement[] = [];
        for (const element of this.rowExtras) {
            children.push(element);
        }
        if (this.trPr !== undefined) {
            children.push(this.trPr);
        }
        for (const cell of this.tableCells) {
            children.push(cell.toOpenXml());
        }
        return wmlElement('tr', { children: children });
    }

    /**
     * Create an independent copy of this row.
     * All cells and row formatting are cloned.
     *
     * The cloned row is detached and ready for attachment to a table.
     *
     * @returns {TableRow} Cloned row.
     * @public
     */
    clone(): TableRow {
        // Clone row extras
        const clonedExtras: OpenXmlElement[] = [];
        for (const element of this.rowExtras) {
            clonedExtras.push(element);
        }

        // Clone row properties (if any)
        const clonedTrPr: OpenXmlElement | undefined = this.trPr;

        // Clone all cells
        const clonedCells: TableCell[] = [];
        for (const cell of this.tableCells) {
            clonedCells.push(cell.clone());
        }

        // Create the cloned row
        const cloned: TableRow = new TableRow(clonedExtras, clonedTrPr, clonedCells);

        return cloned;
    }
}

/**
 * One cell of a table — a body container for paragraphs and nested tables,
 * with cell-level settings such as width and formatting.
 *
 * Nested tables: call {@link Body.appendTable} on the cell, then
 * {@link Table.resetCells} for size.
 *
 * @public
 */
export class TableCell extends Body implements CellFormatHost {
    private tcPrValue: OpenXmlElement | undefined;
    private readonly cellFormatInstance: CellFormat;
    private ownerRowRef: TableRow | undefined;
    /**
     * Marks this body as a table-cell owner for {@link Paragraph.isInCell}.
     *
     * @private
     */
    readonly bodyOwnerKind: string = 'tableCell';

    /**
     * @param {WordDocument | undefined} document - The document.
     * @param {ReadonlyArray<BlockContent>} blocks - The blocks.
     * @private
     */
    constructor(document: WordDocument | undefined, blocks: ReadonlyArray<BlockContent>) {
        super(document, blocks);
        this.tcPrValue = undefined;
        this.cellFormatInstance = new CellFormat(this);
        this.ownerRowRef = undefined;
        this.reattachNestedTables();
    }

    /**
     * @param {TableRow | undefined} row - The row.
     * @returns {void} Nothing is returned.
     * @private
     */
    setOwnerRow(row: TableRow | undefined): void {
        this.ownerRowRef = row;
    }

    /**
     * @param {OpenXmlElement | undefined} tcPr - The tc pr.
     * @returns {void} Nothing is returned.
     * @private
     * Apply `w:tcPr` after parse (constructor only takes body blocks).
     */
    applyTcPr(tcPr: OpenXmlElement | undefined): void {
        this.tcPrValue = tcPr;
    }

    /**
     * @returns {OpenXmlElement | undefined} The result.
     * @private
     */
    readTcPr(): OpenXmlElement | undefined {
        return this.tcPrValue;
    }

    /**
     * @param {OpenXmlElement | undefined} next - The next.
     * @returns {void} Nothing is returned.
     * @private
     */
    writeTcPr(next: OpenXmlElement | undefined): void {
        this.tcPrValue = next;
    }

    /**
     * Gets the formatting of the cell.
     */
    get cellFormat(): CellFormat {
        return this.cellFormatInstance;
    }

    /**
     * Number of grid columns this cell spans (`w:tcPr/w:gridSpan`).
     *
     * @private
     * Merge plumbing writes this value; public surface is
     * {@link CellFormat.columnSpan}.
     */
    get gridSpan(): number | undefined {
        return readGridSpan(this.tcPrValue);
    }
    set gridSpan(span: number | undefined) {
        this.tcPrValue = writeGridSpan(this.tcPrValue, span);
        const row: TableRow = this.ownerRowRef;
        if (row !== undefined) {
            const table: Table = row.getOwnerTableOrUndefined();
            if (table !== undefined) {
                table.markConditionalFormattingDirty();
            }
        }
    }

    /**
     * Vertical merge wire state (`w:tcPr/w:vMerge`): `'restart'` | `'continue'`.
     *
     * @private
     * Merge algorithm uses this; public surface is
     * {@link CellFormat.verticalMerge} ({@link CellMerge}).
     */
    get verticalMerge(): VerticalMerge | undefined {
        return readVerticalMerge(this.tcPrValue);
    }
    set verticalMerge(merge: VerticalMerge | undefined) {
        this.tcPrValue = writeVerticalMerge(this.tcPrValue, merge);
    }

    /**
     * Outer width of the cell as authored (`w:tcPr/w:tcW`).
     *
     * @private
     */
    get preferredWidth(): TableWidth | undefined {
        return readCellPreferredWidth(this.tcPrValue);
    }
    set preferredWidth(value: TableWidth | undefined) {
        this.tcPrValue = writeCellPreferredWidth(this.tcPrValue, value);
    }

    /**
     * Gets or sets the preferred width of the cell, in points.
     */
    get width(): number {
        const preferred: TableWidth = readCellPreferredWidth(this.tcPrValue);
        if (preferred !== undefined && preferred.type === 'dxa') {
            return preferred.value;
        }
        const row: TableRow = this.ownerRowRef;
        if (row === undefined) {
            return twipsToPoint(DEFAULT_GRID_COL_TWIPS);
        }
        let table: Table | undefined;
        try {
            table = row.ownerTable;
        } catch (_e) {
            table = undefined;
        }
        if (table === undefined) {
            return twipsToPoint(DEFAULT_GRID_COL_TWIPS);
        }
        return table.effectiveCellWidthPoints(this);
    }
    set width(value: number) {
        if (!isFinite(value) || value < 0) {
            throw new RangeError(
                'Cell width must be a non-negative finite number of points, got ' + String(value)
            );
        }
        this.tcPrValue = writeCellPreferredWidth(this.tcPrValue, {
            type: 'dxa',
            value: value
        });
    }

    /**
     * Gets or sets the plain text of the cell, concatenated across all paragraphs.
     */
    get text(): string {
        const parts: string[] = [];
        const paras: ReadonlyArray<Paragraph> = this.listParagraphs();
        for (const paragraph of paras) {
            parts.push(paragraph.text);
        }
        return parts.join('');
    }
    set text(value: string) {
        let paragraph: Paragraph = this.listParagraphs()[0];
        if (paragraph === undefined) {
            paragraph = this.appendParagraph();
        }
        // Clear existing modeled text by replacing with a single paragraph text.
        // Prefer appendText on a fresh empty paragraph path when possible.
        const current: string = paragraph.text;
        if (current.length > 0 || value.length === 0) {
            // Rebuild: remove all body blocks and put one paragraph with text.
            this.replaceItems([]);
            paragraph = this.appendParagraph({ text: value });
            return;
        }
        paragraph.appendText(value);
    }

    /**
     * Gets the nested tables contained in this cell body (feature blocks).
     */
    get nestedTables(): ReadonlyArray<Table> {
        const result: Table[] = [];
        const blocks: ReadonlyArray<BlockContent> = this.listBlocks();
        for (const block of blocks) {
            if (block.type === 'feature' && block.featureId === TABLES && block.value instanceof Table) {
                result.push(block.value);
            }
        }
        return result;
    }

    /**
     * @param {WordDocument} document - The document.
     * @returns {void} Nothing is returned.
     * @private
     * Binds the cell (and nested tables) to a document on attachment.
     */
    bindDocument(document: WordDocument): void {
        this.setOwningDocument(document);
        this.reattachNestedTables();
        const blocks: ReadonlyArray<BlockContent> = this.listBlocks();
        for (const block of blocks) {
            if (block.type === 'feature' && block.featureId === TABLES && block.value instanceof Table) {
                block.value.bindDocument(document);
            }
        }
    }

    /**
     * @returns {void} Nothing is returned.
     * @private
     * Re-attach nested table ownership after construction / content moves.
     */
    private reattachNestedTables(): void {
        let doc: WordDocument | undefined;
        try {
            doc = this.owningDocument();
        } catch (_e) {
            doc = undefined;
        }
        const blocks: ReadonlyArray<BlockContent> = this.listBlocks();
        for (const block of blocks) {
            if (block.type === 'feature' && block.featureId === TABLES && block.value instanceof Table) {
                if (doc !== undefined) {
                    block.value.bindDocument(doc);
                }
            }
        }
    }

    /**
     * @private
     * Serializes the cell back to its `w:tc` element.
     */
    /**
     * Gets the table style conditions that apply to the cell.
     *
     * @returns {CnfStyle | undefined} - Returns the table style conditions that apply to the cell.
     * @public
     */
    getConditionalFormatting(): CnfStyle | undefined {
        return readCellCnfStyle(this.tcPrValue);
    }

    /**
     * Write or clear cell conditional formatting membership.
     *
     * @returns {void}
     * @param {NormalizedCnfStyle | CnfStyle | undefined} state - Specifies the state.
     * @public
     */
    setConditionalFormatting(state: NormalizedCnfStyle | CnfStyle | undefined): void {
        this.tcPrValue = writeCellCnfStyle(this.tcPrValue, state);
    }

    /**
     * Converts the cell to its OpenXML element.
     *
     * @returns {OpenXmlElement} Returns the OpenXML element of the cell.
     *
     * @private
     */
    toOpenXml(): OpenXmlElement {
        const children: OpenXmlElement[] = [];
        if (this.tcPrValue !== undefined) {
            children.push(this.tcPrValue);
        }
        const blocks: ReadonlyArray<BlockContent> = this.listBlocks();
        if (blocks.length === 0) {
            // WordprocessingML cells require ≥1 paragraph on the wire; keep the
            // public DOM empty and emit a serialize-only empty `w:p`.
            children.push(wmlElement('p'));
        } else {
            const serialized: OpenXmlElement[] = serializeBodyBlocks(blocks);
            for (const element of serialized) {
                children.push(element);
            }
        }
        return wmlElement('tc', { children: children });
    }

    /**
     * Create an independent copy of this cell.
     * All block content (paragraphs, nested tables) and cell formatting are cloned.
     *
     * The cloned cell is detached and ready for attachment to a table row.
     *
     * @returns {TableCell} Cloned cell.
     * @public
     */
    clone(): TableCell {
        // Clone cell properties
        const clonedTcPr: OpenXmlElement | undefined = this.tcPrValue;

        // Clone all blocks (paragraphs and nested tables)
        const clonedBlocks: BlockContent[] = [];
        const blocks: ReadonlyArray<BlockContent> = this.listBlocks();
        for (const block of blocks) {
            if (block.type === 'paragraph') {
                clonedBlocks.push({
                    type: 'paragraph',
                    paragraph: block.paragraph.clone()
                });
            } else if (block.type === 'feature' && block.featureId === TABLES && block.value instanceof Table) {
                // Clone nested table
                clonedBlocks.push({
                    type: 'feature',
                    featureId: TABLES,
                    value: block.value.clone()
                });
            } else {
                // Preserve feature and opaque blocks as-is for now
                clonedBlocks.push(block);
            }
        }

        // Create the cloned cell
        const cloned: TableCell = new TableCell(undefined, clonedBlocks);

        // Apply cloned tcPr if any
        if (clonedTcPr !== undefined) {
            cloned.tcPrValue = clonedTcPr;
        }

        return cloned;
    }
}

function defaultTblPr(): OpenXmlElement {
    return wmlElement('tblPr');
}

function defaultTblGrid(columnCount: number): OpenXmlElement {
    const widths: number[] = equalColumnTwips(DEFAULT_GRID_COL_TWIPS * columnCount, columnCount);
    return tblGridFromTwips(widths);
}

/**
 * Client width available for equal column distribution (points).
 * Top-level uses page width − left/right margins; falls back to Letter − 72 − 72.
 *
 * @param {Table} table - The table.
 * @returns {number} The result.
 * @private
 */
function resolveClientWidthPoints(table: Table): number {
    const doc: WordDocument = table['documentOwner'] as WordDocument | undefined;
    if (doc !== undefined) {
        try {
            const sections: Sections = doc.sections;
            if (sections !== undefined && sections.count > 0) {
                const setup: DocPageSetup = sections[0]!.pageSetup;
                const pageWidth: number = setup.pageSize.width;
                const left: number = setup.margins.left;
                const right: number = setup.margins.right;
                const client: number = pageWidth - left - right;
                if (isFinite(client) && client > 0) {
                    return client;
                }
            }
        } catch (_e) {
            /* fall through */
        }
    }
    return DEFAULT_PAGE_CLIENT_WIDTH_POINTS;
}

/**
 * Apply create-path defaults: TableGrid (when bound), fixed layout, equal widths.
 *
 * @param {Table} table - The table.
 * @param {number} columnCount - The column count.
 * @returns {void} Nothing is returned.
 * @private
 */
function applyAuthoringTableDefaults(table: Table, columnCount: number): void {
    const cols: number = columnCount > 0 ? columnCount : 1;
    const clientPoints: number = resolveClientWidthPoints(table);
    const totalTwips: number = pointToTwips(clientPoints);
    const widths: number[] = equalColumnTwips(totalTwips, cols);
    table['tblGrid'] = tblGridFromTwips(widths);
    table.layout = 'fixed';
    let sum: number = 0;
    for (const value of widths) {
        sum += value;
    }
    table['tblPr'] = writeTablePreferredWidth(table['tblPr'], {
        type: 'dxa',
        value: twipsToPoint(sum)
    });
    const rows: TableRow[] = table.listRows();
    for (const row of rows) {
        let cursor: number = 0;
        const cells: TableCell[] = row.listCells();
        for (const cellItem9 of cells) {
            const cell: TableCell = cellItem9!;
            const span: number = cellColumnSpan(cell);
            let cellTwips: number = 0;
            for (let s: number = 0; s < span; s += 1) {
                const w: number = widths[cursor + s];
                cellTwips += w !== undefined && w > 0 ? w : DEFAULT_GRID_COL_TWIPS;
            }
            cell.preferredWidth = {
                type: 'dxa',
                value: twipsToPoint(cellTwips > 0 ? cellTwips : DEFAULT_GRID_COL_TWIPS)
            };
            cursor += span;
        }
    }
    const doc: WordDocument = table['documentOwner'] as WordDocument | undefined;
    if (doc !== undefined) {
        try {
            table.applyStyle(BuiltinTableStyle.TableGrid);
        } catch (_e) {
            table['tblPr'] = writeTableStyle(table['tblPr'], BuiltinTableStyle.TableGrid);
        }
    } else {
        table['tblPr'] = writeTableStyle(table['tblPr'], BuiltinTableStyle.TableGrid);
    }
}

/**
 * Create an empty table with empty cells (no auto-injected paragraphs).
 * Authoring defaults (style/layout/equal widths) are applied by appendTable/resetCells.
 *
 * @param {number} rowCount - The row count.
 * @param {number} columnCount - The column count.
 * @returns {Table} The result.
 * @private
 */
export function createTable(rowCount: number, columnCount: number): Table {
    if (rowCount < 1 || columnCount < 1) {
        throw new RangeError('Table must have at least one row and one column');
    }
    const rows: TableRow[] = [];
    for (let r: number = 0; r < rowCount; r += 1) {
        const cells: TableCell[] = [];
        for (let c: number = 0; c < columnCount; c += 1) {
            cells.push(new TableCell(undefined, []));
        }
        rows.push(new TableRow([], undefined, cells));
    }
    const table: Table = new Table([], defaultTblPr(), defaultTblGrid(columnCount), rows);
    for (const row of rows) {
        row.setOwnerTable(table);
    }
    return table;
}

function parseOwningDocument(ctx: BodyBlockParseContext): WordDocument | undefined {
    try {
        return ctx.owningDocument();
    } catch (_e) {
        return undefined;
    }
}

function parseTable(element: OpenXmlElement, ctx: BodyBlockParseContext): Table | undefined {
    let ts332: any;
    if (!isWml(element, 'tbl')) {
        return undefined;
    }
    const prefix: OpenXmlElement[] = [];
    let tblPr: OpenXmlElement | undefined;
    let tblGrid: OpenXmlElement | undefined;
    const rows: TableRow[] = [];
    const kids: ReadonlyArray<OpenXmlElement> = elementChildren(element);
    for (const child of kids) {
        if (isWml(child, 'tblPr') && tblPr === undefined) {
            tblPr = child;
            continue;
        }
        if (isWml(child, 'tblGrid') && tblGrid === undefined) {
            tblGrid = child;
            continue;
        }
        if (isWml(child, 'tr')) {
            rows.push(parseRow(child, ctx));
            continue;
        }
        if (tblPr === undefined) {
            prefix.push(child);
        }
    }
    if (tblPr === undefined) {
        tblPr = defaultTblPr();
    }
    if (tblGrid === undefined) {
        const firstRow: TableRow = rows[0];
        const cols: number = ((ts332 =
            firstRow == null ? undefined : firstRow.listCells().length),
        ts332 != null ? ts332 : 1);
        tblGrid = defaultTblGrid(Math.max(cols, 1));
    }
    if (rows.length < 1) {
        // Enforce ≥1 row for modeled tables.
        const paragraph: Paragraph = new Paragraph(undefined);
        const cell: TableCell = new TableCell(parseOwningDocument(ctx), [
            { type: 'paragraph', paragraph: paragraph }
        ]);
        rows.push(new TableRow([], undefined, [cell]));
    }
    const table: Table = new Table(prefix, tblPr, tblGrid, rows);
    for (const row of rows) {
        row.setOwnerTable(table);
        if (parseOwningDocument(ctx) !== undefined) {
            row.bindDocument(parseOwningDocument(ctx));
        }
    }
    if (parseOwningDocument(ctx) !== undefined) {
        table.bindDocument(parseOwningDocument(ctx));
    }
    return table;
}

function parseRow(element: OpenXmlElement, ctx: BodyBlockParseContext): TableRow {
    const extras: OpenXmlElement[] = [];
    let trPr: OpenXmlElement | undefined;
    const cells: TableCell[] = [];
    const kids: ReadonlyArray<OpenXmlElement> = elementChildren(element);
    for (const child of kids) {
        if (isWml(child, 'trPr') && trPr === undefined) {
            trPr = child;
            continue;
        }
        if (isWml(child, 'tc')) {
            cells.push(parseCell(child, ctx));
            continue;
        }
        extras.push(child);
    }
    if (cells.length < 1) {
        const paragraph: Paragraph = new Paragraph(undefined);
        cells.push(
            new TableCell(parseOwningDocument(ctx), [{ type: 'paragraph', paragraph: paragraph }])
        );
    }
    return new TableRow(extras, trPr, cells);
}

function parseCell(element: OpenXmlElement, ctx: BodyBlockParseContext): TableCell {
    let tcPr: OpenXmlElement | undefined;
    const content: OpenXmlElement[] = [];
    const kids: ReadonlyArray<OpenXmlElement> = elementChildren(element);
    for (const child of kids) {
        if (isWml(child, 'tcPr') && tcPr === undefined) {
            tcPr = child;
            continue;
        }
        content.push(child);
    }
    const blocks: BlockContent[] = parseBodyBlocks(content, ctx);
    const cell: TableCell = new TableCell(parseOwningDocument(ctx), blocks);
    cell.applyTcPr(tcPr);
    return cell;
}

let registered: boolean = false;

/**
 * @returns {void} Nothing is returned.
 * @private
 * Test hook
 */
export function resetTablesFeatureForTests(): void {
    registered = false;
}

function visitTableParagraphs(table: Table, visit: (paragraph: Paragraph) => void): void {
    const rows: TableRow[] = table.listRows();
    for (const row of rows) {
        const cells: TableCell[] = row.listCells();
        for (const cellItem9 of cells) {
            // Nested feature blocks (tables, content controls) use registered walkers.
            visitBlocksInDocumentOrder(cellItem9!.listBlocks(), visit);
        }
    }
}

/**
 * @returns {void} Nothing is returned.
 * @private
 * Register the tables feature block handler. Idempotent.
 */
export function registerTablesFeature(): void {
    if (registered) {
        return;
    }
    registered = true;
    registerFeature({ id: TABLES });
    registerFeatureBlockHandler({
        featureId: TABLES,
        wmlLocalName: 'tbl',
        tryParse: parseTable
    });
    registerFeatureBlockParagraphWalker({
        featureId: TABLES,
        visitParagraphs(block: FeatureBlock, visit: (paragraph: Paragraph) => void): void {
            if (block instanceof Table) {
                visitTableParagraphs(block, visit);
            }
        }
    });
    registerBodyItemAdapter({
        project(block: FeatureBodyBlock): Table {
            if (block.featureId === TABLES && block.value instanceof Table) {
                return block.value;
            }
            return undefined;
        },
        toBlock(item: BodyItem): { type: 'feature'; featureId: FeatureId; value: Table; } {
            if (item instanceof Table) {
                return { type: 'feature', featureId: TABLES, value: item };
            }
            return undefined;
        },
        isInstance(item: unknown): item is BodyItem {
            return item instanceof Table;
        }
    });
    registerTypedCollectionHooks({
        isTable(item: BodyItem): boolean {
            return item instanceof Table;
        },
        createTable(): BodyItem {
            return createTable(1, 1);
        }
    });
}

/**
 * Feature id constant for the tables module (used by host features that embed
 * table blocks, e.g. text box bodies in the drawing module).
 *
 * @private
 */
export const TABLES_FEATURE_ID: FeatureId = TABLES;

/**
 * Type guard for a tables feature block on a {@link BodyItem} list.
 *
 * @param {BodyItem | BlockContent | unknown} block - The block.
 * @returns {Object} The result.
 * @private
 */
export function isTableBlock(block: BodyItem | BlockContent | unknown): block is {
    readonly type: 'feature';
    readonly featureId: typeof TABLES;
    readonly value: Table;
} {
    if (block instanceof Table) {
        return true;
    }
    if (typeof block !== 'object' || block === null) {
        return false;
    }
    const candidate: { type?: unknown; featureId?: unknown; value?: unknown } = block as {
        type?: unknown;
        featureId?: unknown;
        value?: unknown;
    };
    return (
        candidate.type === 'feature' &&
        candidate.featureId === TABLES &&
        candidate.value instanceof Table
    );
}

/**
 *  True when `value` is a public Table body item instance.
 *
 * @param {unknown} value - The value.
 * @returns {*} The result.
 * @private
 */
export function isTableBodyItem(value: unknown): value is Table {
    return value instanceof Table;
}

Object.defineProperty(Body.prototype, 'appendTable', {
    value(this: Body): Table {
        // Always 1×1; callers size the grid with Table.resetCells(rows, columns).
        const table: Table = createTable(1, 1);
        this.appendRawBlock({ type: 'feature', featureId: TABLES, value: table });
        try {
            const doc: WordDocument = this.owningDocument();
            table.bindDocument(doc);
        } catch (_e) {
            /* detached body during construction */
        }
        // Authoring defaults: TableGrid, fixed layout, equal client-width columns.
        applyAuthoringTableDefaults(table, 1);
        // Trailing empty paragraph after the table in the same container (not inside a cell).
        const blocks: ReadonlyArray<BlockContent> = this.listBlocks();
        const last: BlockContent = blocks.length > 0 ? blocks[blocks.length - 1] : undefined;
        let alreadyTrailingEmpty: boolean = false;
        if (last !== undefined && last.type === 'paragraph' && last.paragraph !== undefined) {
            alreadyTrailingEmpty = last.paragraph.items.length === 0;
        }
        if (!alreadyTrailingEmpty) {
            this.appendParagraph();
        }
        return table;
    },
    writable: true,
    configurable: true
});

Object.defineProperty(WordDocument.prototype, 'appendTable', {
    value(this: WordDocument): Table {
        return this.firstSectionBody().appendTable();
    },
    writable: true,
    configurable: true
});

registerAlwaysOnBodyFeatureBootstrap(() => {
    registerTablesFeature();
});
registerTablesFeature();
