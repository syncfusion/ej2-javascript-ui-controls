import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { IWorksheet, IPageSetup, IMergedRegion, RangeParser } from '../common/index';
import { ItemSizeHelper, pxToPt } from './item-size';

/**
 * Interface representing the host environment supplying sheet boundary limits and range clipping.
 */
export interface IPageSetupHost {
    /** Maximum allowable row count. */
    maxRowCount: number;
    /** Maximum allowable column count. */
    maxColumnCount: number;
    /**
     * Resolves the actual non-empty cell range within the requested boundary.
     *
     * @param {IWorksheet} sheet The worksheet instance.
     * @param {IMergedRegion} range Bounding range region.
     * @param {boolean} checkRow Whether to evaluate row boundaries.
     * @param {boolean} checkColumn Whether to evaluate column boundaries.
     * @param {boolean} isPrintArea Whether the query pertains to a print area.
     * @returns {IMergedRegion} The trimmed actual used range.
     */
    getActualUsedRange(
        sheet: IWorksheet,
        range: IMergedRegion,
        checkRow: boolean,
        checkColumn: boolean,
        isPrintArea: boolean
    ): IMergedRegion;
}

/**
 * Parses and manages page setup options including print areas, repeat title rows/columns, and page breaks.
 */
export class PageSetupOption {
    /** Hash token used to identify invalid title definitions. */
    private static Hash: string = '#';
    /** 0-based horizontal page break row indices. */
    private horizontalIds: number[] = [];
    /** 0-based vertical page break column indices. */
    private verticalIds: number[] = [];
    /** Parsed title column tokens (e.g. `["$A", "$B"]`). */
    private colCollections: string[] | null = null;
    /** Parsed title row tokens (e.g. `["$1", "$2"]`). */
    private rowCollections: string[] | null = null;
    /** Tracked column break page boundary indices. */
    private colIndexes: number[] = [];
    /** Tracked row break page boundary indices. */
    private rowIndexes: number[] = [];
    /** Normalized list of print area regions. */
    private printAreasList: IMergedRegion[] | null = null;
    /** Cached repeat title columns total width in points. */
    private titleColWidth: number = 0;
    /** Cached repeat title rows total height in points. */
    private titleRowHeightValue: number = 0;
    /** Flag indicating whether the title row or column definition is syntactically invalid. */
    private isInvalidTitleRowOrColumn: boolean = false;
    /** Indicates whether headers/footers differ on the first page. */
    public differentFirstPageHF: boolean = false;
    private sheet: IWorksheet;
    private usedRange: IMergedRegion;
    private host?: IPageSetupHost;

    /**
     * Initializes a new instance of the `PageSetupOption` class.
     *
     * @param {IWorksheet} sheet The worksheet containing page setup settings.
     * @param {IMergedRegion} usedRange The computed used range of the worksheet.
     * @param {IPageSetupHost} [host] Optional host providing boundary constraints.
     */
    constructor(sheet: IWorksheet, usedRange: IMergedRegion, host?: IPageSetupHost) {
        this.sheet = sheet;
        this.usedRange = usedRange;
        this.host = host;
        if (!isNullOrUndefined(this.sheet.pageSetup.printTitleRowsText) && this.sheet.pageSetup.printTitleRowsText.length > 0) {
            this.parseTitleRows();
        }
        if (!isNullOrUndefined(this.sheet.pageSetup.printTitleColumnsText) && this.sheet.pageSetup.printTitleColumnsText.length > 0) {
            this.parseTitleColumns();
        }
        if (this.hasPrintArea) {
            this.parsePrintArea();
        }
        if (this.hasVerticalBreak) {
            this.parseVerticalBreaks();
        }
        if (this.hasHorizontalBreak) {
            this.parseHorizontalBreaks();
        }
    }

    /**
     * Parses manual horizontal page breaks from the worksheet page setup.
     *
     * @returns {void}
     */
    private parseHorizontalBreaks(): void {
        for (const rowBreak of this.sheet.pageSetup.rowBreaks) {
            const zeroBasedRow: number = rowBreak - 1;
            if (this.horizontalIds.indexOf(zeroBasedRow) < 0) {
                this.horizontalIds.push(zeroBasedRow);
            }
        }
    }

    /**
     * Parses manual vertical page breaks from the worksheet page setup.
     *
     * @returns {void}
     */
    private parseVerticalBreaks(): void {
        for (const colBreak of this.sheet.pageSetup.columnBreaks) {
            const zeroBasedCol: number = colBreak - 1;
            if (this.verticalIds.indexOf(zeroBasedCol) < 0) {
                this.verticalIds.push(zeroBasedCol);
            }
        }
    }

    /**
     * Splits a title address string by sheet delimiter and range separator.
     *
     * @param {string} value The raw print title address.
     * @returns {string[]} Array containing starting and ending tokens.
     */
    private getSplittedTitle(value: string): string[] {
        const parts: string[] = value.split('!');
        return parts[parts.length > 1 ? 1 : 0].split(':');
    }

    /**
     * Validates whether title tokens do not designate specific single cell coordinates.
     *
     * @param {string[]} cellNames Title range tokens.
     * @returns {boolean} True if the title specification represents full rows or columns.
     */
    private isPrintTitleValid(cellNames: string[]): boolean {
        for (const cellName of cellNames) {
            if (cellName && /^\$?[A-Za-z]{1,3}\$?\d+$/.test(cellName)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Parses repeat title row tokens from `printTitleRowsText`.
     *
     * @returns {void}
     */
    private parseTitleRows(): void {
        const rowTitle: string | undefined = this.sheet.pageSetup.printTitleRowsText;
        if (!rowTitle || rowTitle === '') {
            return;
        }
        const rowTokens: string[] = this.getSplittedTitle(rowTitle);
        if (/^\d+$/.test(rowTokens[0].replace(/^\$/, '').trim()) && this.isPrintTitleValid(rowTokens)) {
            this.rowCollections = rowTokens;
        } else {
            this.isInvalidTitleRowOrColumn = true;
        }
    }

    /**
     * Parses repeat title column tokens from `printTitleColumnsText`.
     *
     * @returns {void}
     */
    private parseTitleColumns(): void {
        const colTitle: string | undefined = this.sheet.pageSetup.printTitleColumnsText;
        if (!colTitle || colTitle === '') {
            return;
        }
        const columnTokens: string[] = this.getSplittedTitle(colTitle);
        if (columnTokens[0].indexOf(PageSetupOption.Hash) < 0 && this.isPrintTitleValid(columnTokens)) {
            this.colCollections = columnTokens;
        } else {
            this.isInvalidTitleRowOrColumn = true;
        }
    }

    /**
     * Normalizes and clips defined worksheet print areas to actual used limits.
     *
     * @returns {void}
     */
    private parsePrintArea(): void {
        this.printAreasList = [];
        const areas: IMergedRegion[] = !isNullOrUndefined(this.sheet.pageSetup.printArea) ? this.sheet.pageSetup.printArea : [];
        if (areas.length === 0) {
            this.printAreasList.push(this.usedRange);
            return;
        }
        for (const area of areas) {
            this.printAreasList.push(this.updateRange(area));
        }
    }

    /**
     * Clips full-sheet print areas (e.g. `1:1048576` or `A:XFD`) to actual used contents.
     *
     * @param {IMergedRegion} range Raw print area merged region.
     * @returns {IMergedRegion} Clipped merged region.
     */
    private updateRange(range: IMergedRegion): IMergedRegion {
        if (isNullOrUndefined(this.host)) {
            return range;
        }
        const maxRow: number = this.host.maxRowCount;
        const maxColumn: number = this.host.maxColumnCount;
        const usedRange: IMergedRegion = this.usedRange;
        if (range.firstRow === 1 && range.lastRow === maxRow) {
            const clipped: IMergedRegion = {
                firstRow: usedRange.firstRow,
                firstColumn: range.firstColumn,
                lastRow: usedRange.lastRow,
                lastColumn: range.lastColumn
            };
            const actualRange: IMergedRegion = this.host.getActualUsedRange(this.sheet, clipped, true, false, true);
            return {
                firstRow: actualRange.firstRow,
                firstColumn: clipped.firstColumn,
                lastRow: actualRange.lastRow,
                lastColumn: clipped.lastColumn
            };
        }
        if (range.firstColumn === 1 && range.lastColumn === maxColumn) {
            const clipped: IMergedRegion = {
                firstRow: range.firstRow,
                firstColumn: usedRange.firstColumn,
                lastRow: range.lastRow,
                lastColumn: usedRange.lastColumn
            };
            const actualRange: IMergedRegion = this.host.getActualUsedRange(this.sheet, clipped, false, true, true);
            return {
                firstRow: clipped.firstRow,
                firstColumn: actualRange.firstColumn,
                lastRow: clipped.lastRow,
                lastColumn: actualRange.lastColumn
            };
        }
        const isNotMatchingLast: boolean = range.lastColumn !== usedRange.lastColumn && range.lastRow !== usedRange.lastRow;
        const isFullExtent: boolean = range.lastRow === maxRow && range.lastColumn === maxColumn;
        if (isNotMatchingLast && isFullExtent) {
            return {
                firstRow: range.firstRow,
                firstColumn: usedRange.firstColumn - 2,
                lastRow: range.lastRow,
                lastColumn: usedRange.lastColumn
            };
        }
        return range;
    }

    /**
     * Gets the number of pages wide to fit content.
     *
     * @returns {number} Pages wide count.
     */
    public get fitPagesWide(): number {
        return this.sheet.pageSetup.fitToPagesWide;
    }

    /**
     * Gets the number of pages tall to fit content.
     *
     * @returns {number} Pages tall count.
     */
    public get fitPagesTall(): number {
        return this.sheet.pageSetup.fitToPagesTall;
    }

    /**
     * Gets the collection of 0-based horizontal page break row indices.
     *
     * @returns {number[]} Array of row break indices.
     */
    public get horizontalBreaks(): number[] {
        return this.horizontalIds;
    }

    /**
     * Gets the collection of 0-based vertical page break column indices.
     *
     * @returns {number[]} Array of column break indices.
     */
    public get verticalBreaks(): number[] {
        return this.verticalIds;
    }

    /**
     * Gets the target worksheet.
     *
     * @returns {IWorksheet} Target worksheet.
     */
    public get worksheet(): IWorksheet {
        return this.sheet;
    }

    /**
     * Gets the worksheet page setup configuration.
     *
     * @returns {IPageSetup} Worksheet page setup.
     */
    public get pageSetup(): IPageSetup {
        return this.sheet.pageSetup;
    }

    /**
     * Gets the tracked row index page boundaries list.
     *
     * @returns {number[]} Row index list.
     */
    public get rowIndexList(): number[] {
        return this.rowIndexes;
    }

    /**
     * Gets the tracked column index page boundaries list.
     *
     * @returns {number[]} Column index list.
     */
    public get columnIndexList(): number[] {
        return this.colIndexes;
    }

    /**
     * Indicates whether repeat title rows are configured and valid.
     *
     * @returns {boolean} True if repeat title rows exist.
     */
    public get hasPrintTitleRows(): boolean {
        const hasText: boolean = !isNullOrUndefined(this.sheet.pageSetup.printTitleRowsText) &&
            this.sheet.pageSetup.printTitleRowsText.length > 0 &&
            !isNullOrUndefined(this.rowCollections) &&
            !this.isInvalidTitleRowOrColumn;
        return hasText || !isNullOrUndefined(this.sheet.pageSetup.printTitleRows);
    }

    /**
     * Indicates whether repeat title columns are configured and valid.
     *
     * @returns {boolean} True if repeat title columns exist.
     */
    public get hasPrintTitleColumns(): boolean {
        const hasText: boolean = !isNullOrUndefined(this.sheet.pageSetup.printTitleColumnsText) &&
            this.sheet.pageSetup.printTitleColumnsText.length > 0 &&
            !isNullOrUndefined(this.colCollections) &&
            !this.isInvalidTitleRowOrColumn;
        return hasText || !isNullOrUndefined(this.sheet.pageSetup.printTitleColumns);
    }

    /**
     * Indicates whether one or more print areas are defined.
     *
     * @returns {boolean} True if print areas exist.
     */
    public get hasPrintArea(): boolean {
        return !isNullOrUndefined(this.sheet.pageSetup.printArea) && this.sheet.pageSetup.printArea.length > 0;
    }

    /**
     * Indicates whether manual vertical page breaks exist.
     *
     * @returns {boolean} True if vertical page breaks exist.
     */
    public get hasVerticalBreak(): boolean {
        return this.sheet.pageSetup.columnBreaks.length !== 0;
    }

    /**
     * Indicates whether manual horizontal page breaks exist.
     *
     * @returns {boolean} True if horizontal page breaks exist.
     */
    public get hasHorizontalBreak(): boolean {
        return this.sheet.pageSetup.rowBreaks.length !== 0;
    }

    /**
     * Gets the 1-based first row index of repeat title rows.
     *
     * @returns {number} 1-based first row index.
     */
    public get printTitleFirstRow(): number {
        if (!isNullOrUndefined(this.rowCollections)) {
            return parseInt(this.rowCollections[0].replace(/^\$/, ''), 10);
        }
        return !isNullOrUndefined(this.sheet.pageSetup.printTitleRows) ? this.sheet.pageSetup.printTitleRows.first : 0;
    }

    /**
     * Gets the 1-based last row index of repeat title rows.
     *
     * @returns {number} 1-based last row index.
     */
    public get printTitleLastRow(): number {
        if (!isNullOrUndefined(this.rowCollections)) {
            return parseInt(this.rowCollections[this.rowCollections.length > 1 ? 1 : 0].replace(/^\$/, ''), 10);
        }
        return !isNullOrUndefined(this.sheet.pageSetup.printTitleRows) ? this.sheet.pageSetup.printTitleRows.last : 0;
    }

    /**
     * Gets the 1-based first column index of repeat title columns.
     *
     * @returns {number} 1-based first column index.
     */
    public get printTitleFirstColumn(): number {
        if (!isNullOrUndefined(this.colCollections)) {
            return RangeParser.columnLetterToIndex(this.colCollections[0].replace(/^\$/, ''));
        }
        return !isNullOrUndefined(this.sheet.pageSetup.printTitleColumns) ? this.sheet.pageSetup.printTitleColumns.first : 0;
    }

    /**
     * Gets the 1-based last column index of repeat title columns.
     *
     * @returns {number} 1-based last column index.
     */
    public get printTitleLastColumn(): number {
        if (!isNullOrUndefined(this.colCollections)) {
            return RangeParser.columnLetterToIndex(this.colCollections[this.colCollections.length > 1 ? 1 : 0].replace(/^\$/, ''));
        }
        return !isNullOrUndefined(this.sheet.pageSetup.printTitleColumns) ? this.sheet.pageSetup.printTitleColumns.last : 0;
    }

    /**
     * Gets the combined height of repeat title rows in points.
     *
     * @returns {number} Title row height in points.
     */
    public get titleRowHeight(): number {
        if (this.titleRowHeightValue === 0) {
            const sizeHelper: ItemSizeHelper = new ItemSizeHelper((rowIndex: number) => this.sheet.getRowHeightPx(rowIndex));
            return this.getRowHeight(sizeHelper);
        }
        return this.titleRowHeightValue;
    }

    /**
     * Gets the combined width of repeat title columns in points.
     *
     * @returns {number} Title column width in points.
     */
    public get titleColumnWidth(): number {
        if (this.titleColWidth === 0) {
            const sizeHelper: ItemSizeHelper = new ItemSizeHelper((colIndex: number) => this.sheet.getColumnWidthPx(colIndex));
            return this.getColumnWidth(sizeHelper);
        }
        return this.titleColWidth;
    }

    /**
     * Gets the list of defined print area merged regions.
     *
     * @returns {IMergedRegion[]} Print area list.
     */
    public get printAreas(): IMergedRegion[] {
        if (isNullOrUndefined(this.printAreasList) || this.printAreasList.length === 0) {
            return [this.usedRange];
        }
        return this.printAreasList.slice();
    }

    /**
     * Computes total height in points across all repeat title rows.
     *
     * @param {ItemSizeHelper} rowHeightHelper Helper to query row heights.
     * @returns {number} Total height in points.
     */
    private getRowHeight(rowHeightHelper: ItemSizeHelper): number {
        this.titleRowHeightValue = 0;
        if (!this.hasPrintTitleRows) {
            return 0;
        }
        for (let rowIndex: number = this.printTitleFirstRow; rowIndex <= this.printTitleLastRow; rowIndex++) {
            this.titleRowHeightValue += pxToPt(rowHeightHelper.getSize(rowIndex));
        }
        return this.titleRowHeightValue;
    }

    /**
     * Computes total width in points across all repeat title columns.
     *
     * @param {ItemSizeHelper} columnWidthHelper Helper to query column widths.
     * @returns {number} Total width in points.
     */
    private getColumnWidth(columnWidthHelper: ItemSizeHelper): number {
        this.titleColWidth = 0;
        if (!this.hasPrintTitleColumns) {
            return 0;
        }
        for (let colIndex: number = this.printTitleFirstColumn; colIndex <= this.printTitleLastColumn; colIndex++) {
            this.titleColWidth += pxToPt(columnWidthHelper.getSize(colIndex));
        }
        return this.titleColWidth;
    }

    /**
     * Evaluates whether a given row range overlaps with title rows.
     *
     * @param {number} startIndex Starting row index.
     * @param {number} endIndex Ending row index.
     * @returns {boolean} True if title rows should be injected into the page.
     */
    public checkRowBounds(startIndex: number, endIndex: number): boolean {
        return !(this.printTitleLastRow < startIndex ||
            (this.printTitleFirstRow < startIndex && this.printTitleLastRow >= startIndex && this.printTitleLastRow < endIndex));
    }

    /**
     * Evaluates whether a given column range starts after repeat title columns.
     *
     * @param {number} startIndex Starting column index.
     * @returns {boolean} True if title columns should be injected into the page.
     */
    public checkColumnBounds(startIndex: number): boolean {
        return this.printTitleFirstColumn < startIndex;
    }
}
