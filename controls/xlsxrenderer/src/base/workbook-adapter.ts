import { Workbook as XlsxWorkbook, Worksheet as XlsxWorksheet, Cell as XlsxCell } from '@syncfusion/ej2-xlsx';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { ConditionalFormattingEngine } from '../renderer/index';
import { getExcelSheetSize } from '../layout/index';
import {
    RangeParser, UnitConverter, formatHexColor, parseHexColor,
    formatNumber, formatText,
    IWorkbook,
    IWorksheet,
    ICell,
    ICellComment,
    ICellCommentReply,
    ICellStyle,
    IRichTextRun,
    IBorder,
    IBorders,
    IPageSetup,
    IMergedRegion,
    IPicture,
    IChart,
    IChartSeriesData,
    Rgba,
    CellType,
    ExcelHAlign,
    ExcelVAlign,
    ExcelLineStyle,
    ExcelPattern,
    ExcelOrder,
    ExcelPrintLocation,
    IAutoFilterRange,
    IShape,
    ExcelShapeType,
    ExcelFormControlType,
    AutoShapeType
} from '../common/index';

/**
 * Adapts an `@syncfusion/ej2-xlsx` Workbook into the normalized converter `IWorkbook` model.
 */
export class XlsxWorkbookAdapter implements IWorkbook {
    /** Collection of adapted worksheets. */
    public worksheets: IWorksheet[] = [];
    /** Maximum allowable row count (Excel standard: 1,048,576). */
    public maxRowCount: number = 1048576;
    /** Maximum allowable column count (Excel standard: 16,384). */
    public maxColumnCount: number = 16384;
    /** Workbook title property. */
    public title?: string;
    /** Workbook author property. */
    public author?: string;

    private xlsxWorkbook: XlsxWorkbook;

    /**
     * Initializes a new instance of the `XlsxWorkbookAdapter` class.
     *
     * @param {XlsxWorkbook} xlsxWorkbook - Source ej2-xlsx workbook instance.
     * @param {Object} options - Optional converter configuration options.
     */
    constructor(xlsxWorkbook: XlsxWorkbook, options?: Record<string, unknown>) {
        this.xlsxWorkbook = xlsxWorkbook;
        if (xlsxWorkbook.worksheets && xlsxWorkbook.worksheets.length > 0) {
            for (let sheetIndex: number = 0; sheetIndex < xlsxWorkbook.worksheets.length; sheetIndex++) {
                const sheetItem: XlsxWorksheet = xlsxWorkbook.worksheets[sheetIndex as number];
                if (sheetItem) {
                    this.worksheets.push(new XlsxWorksheetAdapter(sheetItem, sheetIndex, options, xlsxWorkbook));
                }
            }
        }
    }
}

/**
 * Adapts an `@syncfusion/ej2-xlsx` Worksheet into the normalized converter `IWorksheet` model.
 */
export class XlsxWorksheetAdapter implements IWorksheet {
    public name: string;
    public index: number;
    public tabIndex: number;
    public visible: boolean = true;
    public isEmpty: boolean = false;
    public isRightToLeft: boolean = false;
    public usedRange: IMergedRegion;
    public pageSetup: IPageSetup;
    public mergedRegions: IMergedRegion[] = [];
    public pictures: IPicture[] = [];
    public charts: IChart[] = [];
    public shapes: IShape[] = [];
    public autoFilter?: IAutoFilterRange;
    public unsupportedShapeNames: string[] = [];
    private commentMap: Map<string, ICellComment> = new Map<string, ICellComment>();
    private cellMap: Map<string, ICell> = new Map<string, ICell>();
    private rowMap: Map<number, Record<string, unknown>> = new Map<number, Record<string, unknown>>();
    private colMap: Map<number, Record<string, unknown>> = new Map<number, Record<string, unknown>>();
    private worksheet: XlsxWorksheet;
    private workbook?: XlsxWorkbook;

    /**
     * Initializes a new instance of the `XlsxWorksheetAdapter` class.
     *
     * @param {XlsxWorksheet} worksheet - Source worksheet instance.
     * @param {number} index - 0-based worksheet index.
     * @param {Object} options - Optional converter configuration options.
     * @param {XlsxWorkbook} workbook - Parent workbook instance.
     */
    constructor(worksheet: XlsxWorksheet, index: number, options?: Record<string, unknown>, workbook?: XlsxWorkbook) {
        this.worksheet = worksheet;
        this.workbook = workbook;
        this.name = worksheet.name || ('Sheet' + (index + 1));
        this.index = index;
        this.tabIndex = index;
        const rawWs: Record<string, unknown> = worksheet as unknown as Record<string, unknown>;
        this.visible = worksheet.visibility !== false && rawWs._visibility !== 'hidden';
        this.isRightToLeft = worksheet.isRightToLeft === true;
        const wsRows: Record<string, unknown> = worksheet.rows as unknown as Record<string, unknown>;
        const rowEntries: Record<string, unknown>[] = (wsRows && wsRows['entries']) as Record<string, unknown>[];
        if (rowEntries && rowEntries.length > 0) {
            for (let rowIndex: number = 0; rowIndex < rowEntries.length; rowIndex++) {
                const rowEntry: Record<string, unknown> = rowEntries[rowIndex as number];
                if (rowEntry) {
                    const mappedRowIndex: number = !isNullOrUndefined(rowEntry.index)
                        ? Number(rowEntry.index)
                        : Number(rowEntry.row || (rowIndex + 1));
                    this.rowMap.set(mappedRowIndex, rowEntry);
                }
            }
        }
        const wsCols: Record<string, unknown> = worksheet.columns as unknown as Record<string, unknown>;
        const colListFn: (() => Record<string, unknown>[]) | undefined = wsCols ? wsCols['list'] as () => Record<string, unknown>[] : undefined;
        const colEntries: Record<string, unknown>[] = wsCols
            ? ((wsCols['entries'] as Record<string, unknown>[]) || (colListFn ? colListFn.call(wsCols) : [])) : [];
        if (colEntries && colEntries.length > 0) {
            for (let colIndex: number = 0; colIndex < colEntries.length; colIndex++) {
                const columnEntry: Record<string, unknown> = colEntries[colIndex as number];
                if (columnEntry) {
                    const minCol: number = Number(columnEntry.min);
                    const maxCol: number = Number(columnEntry.max);
                    for (let column: number = minCol; column <= maxCol; column++) {
                        this.colMap.set(column, columnEntry);
                    }
                }
            }
        }
        const rawUsedRange: Record<string, unknown> = rawWs['usedRange'] as Record<string, unknown>;
        let firstRow: number = rawUsedRange && !isNullOrUndefined(rawUsedRange.firstRow) ? Number(rawUsedRange.firstRow) : 1;
        let lastRow: number = rawUsedRange && !isNullOrUndefined(rawUsedRange.lastRow) ? Number(rawUsedRange.lastRow) : 1;
        let firstColumn: number = rawUsedRange && !isNullOrUndefined(rawUsedRange.firstColumn) ? Number(rawUsedRange.firstColumn) : 1;
        let lastColumn: number = rawUsedRange && !isNullOrUndefined(rawUsedRange.lastColumn) ? Number(rawUsedRange.lastColumn) : 1;
        if (rowEntries && rowEntries.length > 0) {
            for (let rowIndex: number = 0; rowIndex < rowEntries.length; rowIndex++) {
                const rowEntry: Record<string, unknown> = rowEntries[rowIndex as number];
                if (rowEntry && Number(rowEntry.index) > lastRow) {
                    lastRow = Number(rowEntry.index);
                }
                if (rowEntry && rowEntry.cells && (rowEntry.cells as Record<string, unknown>).entries) {
                    const rowCells: Record<string, unknown> = rowEntry['cells'] as Record<string, unknown>;
                    const cellEntries: Record<string, unknown>[] = rowCells ? rowCells['entries'] as Record<string, unknown>[] : [];
                    for (let cellIndex: number = 0; cellIndex < cellEntries.length; cellIndex++) {
                        const cellEntry: Record<string, unknown> = cellEntries[cellIndex as number];
                        if (cellEntry && Number(cellEntry.index) > lastColumn) {
                            lastColumn = Number(cellEntry.index);
                        }
                    }
                }
            }
        }
        this.populateComments();
        this.commentMap.forEach((_comment: ICellComment, key: string): void => {
            const parts: string[] = key.split('_');
            const row: number = parseInt(parts[0], 10);
            const col: number = parseInt(parts[1], 10);
            if (row > lastRow) { lastRow = row; }
            if (col > lastColumn) { lastColumn = col; }
            if (row < firstRow || firstRow === 1 && lastRow === 1 && firstColumn === 1 && lastColumn === 1) {
                firstRow = Math.min(firstRow, row);
            }
            if (col < firstColumn) {
                firstColumn = Math.min(firstColumn, col);
            }
        });
        this.usedRange = {
            firstRow: firstRow,
            lastRow: Math.max(firstRow, lastRow),
            firstColumn: firstColumn,
            lastColumn: Math.max(firstColumn, lastColumn)
        };
        const rawAutoFilter: Record<string, unknown> = rawWs['autoFilter'] as Record<string, unknown>;
        if (!isNullOrUndefined(rawAutoFilter) && rawAutoFilter.range) {
            this.autoFilter = {
                filterRange: String(rawAutoFilter.range),
                hasFilterButton: true
            };
        }
        const rawMergedList: unknown = worksheet.mergedCells ? worksheet.mergedCells.list() : [];
        const mergedList: string[] = (rawMergedList || []) as unknown as string[];
        if (mergedList && mergedList.length > 0) {
            for (let mergeIndex: number = 0; mergeIndex < mergedList.length; mergeIndex++) {
                const address: string | undefined = mergedList[mergeIndex as number];
                if (address && address.indexOf(':') !== -1) {
                    const parts: string[] = address.split(':');
                    const start: { row: number; col: number } = RangeParser.parseCellAddress(parts[0 as number] || '') || { row: 1, col: 1 };
                    const end: { row: number; col: number } = RangeParser.parseCellAddress(parts[1 as number] || '') || { row: 1, col: 1 };
                    this.mergedRegions.push({
                        firstRow: start.row,
                        firstColumn: start.col,
                        lastRow: end.row,
                        lastColumn: end.col
                    });
                }
            }
        }
        const pageSetupObj: Record<string, unknown> = (worksheet.pageSetup || {}) as unknown as Record<string, unknown>;
        const marginsObj: Record<string, unknown> = (pageSetupObj['margins'] || {}) as Record<string, unknown>;
        const isLandscape: boolean = pageSetupObj.orientation && String(pageSetupObj.orientation).toLowerCase() === 'landscape';
        const isPrintCommentsVal: number = !isNullOrUndefined(pageSetupObj.printComments)
            ? Number(pageSetupObj.printComments)
            : ExcelPrintLocation.PrintNoComments;
        let printAreaList: { firstRow: number; firstColumn: number; lastRow: number; lastColumn: number }[] | undefined = undefined;
        if (pageSetupObj.printArea) {
            const parsedRange: {
                firstRow: number;
                firstColumn: number;
                lastRow: number;
                lastColumn: number;
            } | null = this.parseRangeAddress(String(pageSetupObj.printArea));
            if (parsedRange) {
                printAreaList = [parsedRange];
            }
        }
        this.pageSetup = {
            leftMargin: !isNullOrUndefined(marginsObj.left) ? Number(marginsObj.left) : 0.7,
            rightMargin: !isNullOrUndefined(marginsObj.right) ? Number(marginsObj.right) : 0.7,
            topMargin: !isNullOrUndefined(marginsObj.top) ? Number(marginsObj.top) : 0.75,
            bottomMargin: !isNullOrUndefined(marginsObj.bottom) ? Number(marginsObj.bottom) : 0.75,
            headerMargin: !isNullOrUndefined(marginsObj.header) ? Number(marginsObj.header) : 0.3,
            footerMargin: !isNullOrUndefined(marginsObj.footer) ? Number(marginsObj.footer) : 0.3,
            orientation: isLandscape ? 'Landscape' : 'Portrait',
            paperWidth: 595.28,
            paperHeight: 841.89,
            zoom: pageSetupObj.zoom ? Number(pageSetupObj.zoom) : 100,
            isFitToPage: pageSetupObj.isFitToPage === true,
            fitToPagesWide: pageSetupObj.fitToWidth ? Number(pageSetupObj.fitToWidth) : 0,
            fitToPagesTall: pageSetupObj.fitToHeight ? Number(pageSetupObj.fitToHeight) : 0,
            order: ExcelOrder.DownThenOver,
            centerHorizontally: pageSetupObj.centerHorizontally === true,
            centerVertically: pageSetupObj.centerVertically === true,
            printGridlines: pageSetupObj.showGridLines === true || rawWs.isGridLinesVisible !== false,
            blackAndWhite: pageSetupObj.blackAndWhite === true,
            firstPageNumber: Number(pageSetupObj.firstPageNumber) || 1,
            autoFirstPageNumber: !pageSetupObj.firstPageNumber,
            printComments: isPrintCommentsVal,
            rowBreaks: [],
            columnBreaks: [],
            leftHeader: '',
            centerHeader: '',
            rightHeader: '',
            leftFooter: '',
            centerFooter: '',
            rightFooter: '',
            printArea: printAreaList
        };
        const rawSheetMeta: Record<string, unknown> = rawWs['sheetMeta'] as Record<string, unknown>;
        const afterXml: unknown = rawSheetMeta && rawSheetMeta['afterSheetDataXml']
            ? rawSheetMeta['afterSheetDataXml']
            : rawWs['afterSheetDataXml'];
        if (Array.isArray(afterXml)) {
            for (let idx: number = 0; idx < afterXml.length; idx++) {
                const xmlStr: string = String(afterXml[idx as number] || '');
                if (xmlStr.indexOf('colBreaks') !== -1) {
                    const matches: RegExpMatchArray | null = xmlStr.match(/<brk[^>]*id="(\d+)"/g);
                    if (matches) {
                        for (let mIdx: number = 0; mIdx < matches.length; mIdx++) {
                            const matchStr: string = matches[mIdx as number] || '';
                            const idM: RegExpMatchArray | null = matchStr.match(/id="(\d+)"/);
                            if (idM && idM[1 as number]) { this.pageSetup.columnBreaks.push(parseInt(idM[1 as number], 10)); }
                        }
                    }
                }
                if (xmlStr.indexOf('rowBreaks') !== -1) {
                    const matches: RegExpMatchArray | null = xmlStr.match(/<brk[^>]*id="(\d+)"/g);
                    if (matches) {
                        for (let mIdx: number = 0; mIdx < matches.length; mIdx++) {
                            const matchStr: string = matches[mIdx as number] || '';
                            const idM: RegExpMatchArray | null = matchStr.match(/id="(\d+)"/);
                            if (idM && idM[1 as number]) { this.pageSetup.rowBreaks.push(parseInt(idM[1 as number], 10)); }
                        }
                    }
                }
            }
        }
        const optionsPageSetup: Record<string, unknown> = options && (options['pageSetup'] as Record<string, unknown>);
        const customPaper: { width: number; height: number } | undefined = options
            ? ((options['customPaperSize'] as { width: number; height: number })
                || (optionsPageSetup ? (optionsPageSetup['customPaperSize'] as { width: number; height: number }) : undefined))
            : undefined;
        const resolvedPaperInput: unknown = optionsPageSetup && optionsPageSetup['paperSize']
            ? optionsPageSetup['paperSize']
            : pageSetupObj['paperSize'];
        if (!isNullOrUndefined(resolvedPaperInput) || !isNullOrUndefined(customPaper)) {
            const paperDims: { width: number; height: number } = getExcelSheetSize(
                resolvedPaperInput as string | number,
                customPaper
            );
            this.pageSetup.paperSize = resolvedPaperInput as string | number;
            this.pageSetup.paperWidth = paperDims.width;
            this.pageSetup.paperHeight = paperDims.height;
        }
        if (optionsPageSetup) {
            if (optionsPageSetup['orientation']) {
                this.pageSetup.orientation = optionsPageSetup['orientation'] as 'Portrait' | 'Landscape';
            }
            if (optionsPageSetup['margins']) {
                const marginOptions: Record<string, unknown> = optionsPageSetup['margins'] as Record<string, unknown>;
                if (!isNullOrUndefined(marginOptions.left)) { this.pageSetup.leftMargin = Number(marginOptions.left); }
                if (!isNullOrUndefined(marginOptions.right)) { this.pageSetup.rightMargin = Number(marginOptions.right); }
                if (!isNullOrUndefined(marginOptions.top)) { this.pageSetup.topMargin = Number(marginOptions.top); }
                if (!isNullOrUndefined(marginOptions.bottom)) { this.pageSetup.bottomMargin = Number(marginOptions.bottom); }
            }
            if (!isNullOrUndefined(optionsPageSetup['printComments'])) {
                this.pageSetup.printComments = Number(optionsPageSetup['printComments']);
            }
        }
        if (rawWs['images'] && (rawWs['images'] as unknown[]).length > 0) {
            const sheetImages: Record<string, unknown>[] = rawWs['images'] as Record<string, unknown>[];
            for (let imgIdx: number = 0; imgIdx < sheetImages.length; imgIdx++) {
                const img: Record<string, unknown> = sheetImages[imgIdx as number];
                if (img && img['bytes'] && (img['bytes'] as unknown[]).length > 0) {
                    const row: number = Number(img.row) || 1;
                    const col: number = Number(img.column) || 1;
                    const bounds: {
                        bottomRow: number;
                        rightColumn: number;
                        width: number;
                        height: number;
                        left: number;
                        top: number;
                    } = this.computeShapeBounds(
                        row,
                        col,
                        Number(img.width) || 0,
                        Number(img.height) || 0,
                        img.left ? Number(img.left) : undefined,
                        img.top ? Number(img.top) : undefined
                    );
                    this.pictures.push({
                        name: String(img.name || ('Image' + (imgIdx + 1))),
                        data: img['bytes'] as Uint8Array | string,
                        visible: true,
                        topRow: row,
                        leftColumn: col,
                        bottomRow: bounds.bottomRow,
                        rightColumn: bounds.rightColumn,
                        width: bounds.width,
                        height: bounds.height,
                        left: bounds.left,
                        top: bounds.top
                    });
                }
            }
        }
        if (rawWs['charts'] && (rawWs['charts'] as unknown[]).length > 0) {
            const sheetCharts: Record<string, unknown>[] = rawWs['charts'] as Record<string, unknown>[];
            for (let chIdx: number = 0; chIdx < sheetCharts.length; chIdx++) {
                const ch: Record<string, unknown> = sheetCharts[chIdx as number];
                if (ch) {
                    const row: number = Number(ch.row) || 1;
                    const col: number = Number(ch.column) || 1;
                    const bounds: {
                        bottomRow: number;
                        rightColumn: number;
                        width: number;
                        height: number;
                        left: number;
                        top: number;
                    } = this.computeShapeBounds(
                        row,
                        col,
                        Number(ch.width) || 360,
                        Number(ch.height) || 216,
                        ch.left ? Number(ch.left) : undefined,
                        ch.top ? Number(ch.top) : undefined
                    );
                    const seriesData: IChartSeriesData[] = [];
                    const chSeries: Record<string, unknown>[] = ch.series as Record<string, unknown>[];
                    if (chSeries && chSeries.length > 0) {
                        for (const seriesItem of chSeries) {
                            const serieFill: Record<string, unknown> = (seriesItem['serieFormat'] as Record<string, unknown>)
                                && (seriesItem['serieFormat'] as Record<string, unknown>)['fill'] as Record<string, unknown>;
                            const serieColor: string | undefined = serieFill && serieFill['foreColor']
                                ? String(serieFill['foreColor']) : undefined;
                            seriesData.push({
                                title: this.parseSeriesTitle(seriesItem.title ? String(seriesItem.title) : undefined),
                                values: seriesItem.values ? this.parseSeriesValues(String(seriesItem.values)) : [],
                                categoryLabels: seriesItem.categoryLabels
                                    ? this.parseSeriesLabels(String(seriesItem.categoryLabels)) : [],
                                color: serieColor
                            });
                        }
                    }
                    let resolvedTitle: string = this.parseSeriesTitle(
                        ch.chartTitle ? String(ch.chartTitle) : (ch.title ? String(ch.title) : undefined)
                    );
                    if (!resolvedTitle) {
                        if (seriesData.length === 1 && seriesData[0].title) {
                            resolvedTitle = String(seriesData[0].title);
                        } else {
                            resolvedTitle = 'Chart Title';
                        }
                    }
                    const primaryCat: Record<string, unknown> = ch.primaryCategoryAxis as Record<string, unknown>;
                    const primaryVal: Record<string, unknown> = ch.primaryValueAxis as Record<string, unknown>;
                    this.charts.push({
                        name: String(ch.name || ('Chart' + (chIdx + 1))),
                        type: String(ch.type || 'ColumnClustered'),
                        chartTitle: resolvedTitle,
                        hasTitle: resolvedTitle.length > 0,
                        hasLegend: ch.hasLegend !== false,
                        legendPosition: String(ch.legendPosition || 'Right'),
                        topRow: row,
                        leftColumn: col,
                        bottomRow: bounds.bottomRow,
                        rightColumn: bounds.rightColumn,
                        width: bounds.width,
                        height: bounds.height,
                        left: bounds.left,
                        top: bounds.top,
                        primaryCategoryAxis: {
                            hasTitle: !isNullOrUndefined(primaryCat && primaryCat.title),
                            title: primaryCat && primaryCat.title ? String(primaryCat.title) : ''
                        },
                        primaryValueAxis: {
                            hasTitle: !isNullOrUndefined(primaryVal && primaryVal.title),
                            title: primaryVal && primaryVal.title ? String(primaryVal.title) : ''
                        },
                        categories: [],
                        series: seriesData
                    });
                }
            }
        }
        for (let chkIdx: number = 0; chkIdx < this.charts.length; chkIdx++) {
            const cObj: IChart = this.charts[chkIdx as number];
            if (cObj && cObj.bottomRow && cObj.bottomRow > this.usedRange.lastRow) {
                this.usedRange.lastRow = cObj.bottomRow;
            }
            if (cObj && cObj.rightColumn && cObj.rightColumn > this.usedRange.lastColumn) {
                this.usedRange.lastColumn = cObj.rightColumn;
            }
        }
        for (let picIdx: number = 0; picIdx < this.pictures.length; picIdx++) {
            const pObj: IPicture = this.pictures[picIdx as number];
            if (pObj && pObj.bottomRow && pObj.bottomRow > this.usedRange.lastRow) {
                this.usedRange.lastRow = pObj.bottomRow;
            }
            if (pObj && pObj.rightColumn && pObj.rightColumn > this.usedRange.lastColumn) {
                this.usedRange.lastColumn = pObj.rightColumn;
            }
        }
        const rawShapesContainer: Record<string, unknown> = rawWs['shapes'] as Record<string, unknown>;
        if (rawShapesContainer) {
            if (typeof rawShapesContainer.ensureLoaded === 'function' && rawShapesContainer.loaded === false) {
                (rawShapesContainer.ensureLoaded as () => void)();
            }
            const containerEntries: unknown[] = rawShapesContainer['entries'] as unknown[];
            if (typeof rawShapesContainer.list === 'function' && (!containerEntries || containerEntries.length === 0)) {
                (rawShapesContainer.list as () => void)();
            }
        }
        const rawShapes: Record<string, unknown>[] = (rawShapesContainer && Array.isArray(rawShapesContainer['entries'])
            ? rawShapesContainer['entries']
            : (Array.isArray(rawShapesContainer) ? rawShapesContainer : (rawWs['drawingObjects'] || []))) as Record<string, unknown>[];

        const sumColumnsWidthPoints: (endColumn1Based: number) => number = (endColumn1Based: number): number => {
            let totalWidthPoints: number = 0;
            for (let columnIndex: number = 1; columnIndex < endColumn1Based; columnIndex++) {
                totalWidthPoints += UnitConverter.pixelsToPoints(this.getColumnWidthPx(columnIndex), 96);
            }
            return totalWidthPoints;
        };
        const sumRowsHeightPoints: (endRow1Based: number) => number = (endRow1Based: number): number => {
            let totalHeightPoints: number = 0;
            for (let rowIndex: number = 1; rowIndex < endRow1Based; rowIndex++) {
                totalHeightPoints += UnitConverter.pixelsToPoints(this.getRowHeightPx(rowIndex), 96);
            }
            return totalHeightPoints;
        };

        if (rawShapes && rawShapes.length > 0) {
            for (let shapeIndex: number = 0; shapeIndex < rawShapes.length; shapeIndex++) {
                const rawShape: Record<string, unknown> = rawShapes[shapeIndex as number];
                if (rawShape) {
                    const isEmuEntry: boolean = !isNullOrUndefined(rawShape.fromRow0) || !isNullOrUndefined(rawShape.fromCol0);
                    const row: number = isEmuEntry
                        ? (Number(rawShape.fromRow0 || 0) + 1)
                        : (Number(rawShape.row || rawShape.topRow) || 1);
                    const col: number = isEmuEntry
                        ? (Number(rawShape.fromCol0 || 0) + 1)
                        : (Number(rawShape.column || rawShape.leftColumn) || 1);
                    const widthPt: number = !isNullOrUndefined(rawShape.widthEmu) && Number(rawShape.widthEmu) > 0
                        ? (Number(rawShape.widthEmu) / 12700)
                        : (!isNullOrUndefined(rawShape.width) ? Number(rawShape.width) : 100);
                    const heightPt: number = !isNullOrUndefined(rawShape.heightEmu) && Number(rawShape.heightEmu) > 0
                        ? (Number(rawShape.heightEmu) / 12700)
                        : (!isNullOrUndefined(rawShape.height) ? Number(rawShape.height) : 40);

                    let rawLeftPt: number | undefined = rawShape.left ? Number(rawShape.left) : undefined;
                    let rawTopPt: number | undefined = rawShape.top ? Number(rawShape.top) : undefined;
                    if (isEmuEntry) {
                        const colStartPt: number = sumColumnsWidthPoints(col);
                        const rowStartPt: number = sumRowsHeightPoints(row);
                        rawLeftPt = colStartPt + (Number(rawShape.colOffEmu || 0) / 12700);
                        rawTopPt = rowStartPt + (Number(rawShape.rowOffEmu || 0) / 12700);
                    }

                    const bounds: {
                        bottomRow: number;
                        rightColumn: number;
                        width: number;
                        height: number;
                        left: number;
                        top: number;
                    } = this.computeShapeBounds(row, col, widthPt, heightPt, rawLeftPt, rawTopPt);
                    const presetRaw: string = String(rawShape.type || rawShape.shapeType || 'rect');
                    const rawType: string = presetRaw.toLowerCase();
                    let mappedType: string = presetRaw;
                    let shapeType: ExcelShapeType = ExcelShapeType.AutoShape;
                    let autoShapeType: AutoShapeType = AutoShapeType.Rectangle;
                    let formControlType: ExcelFormControlType | undefined = undefined;

                    if (rawType.indexOf('text') !== -1) {
                        mappedType = 'textbox';
                        shapeType = ExcelShapeType.TextBox;
                        autoShapeType = AutoShapeType.TextBox;
                    } else if (rawType === 'line' || rawType === 'straightconnector1') {
                        mappedType = 'line';
                        autoShapeType = AutoShapeType.Line;
                    } else if (rawType.indexOf('oval') !== -1 || rawType.indexOf('circle') !== -1 || rawType === 'ellipse') {
                        mappedType = 'oval';
                        autoShapeType = AutoShapeType.Oval;
                    } else if (rawType === 'diamond') {
                        mappedType = 'diamond';
                        autoShapeType = AutoShapeType.Diamond;
                    } else if (rawType.indexOf('triangle') !== -1) {
                        mappedType = 'triangle';
                        autoShapeType = AutoShapeType.IsoscelesTriangle;
                    } else if (rawType.indexOf('check') !== -1) {
                        mappedType = 'checkbox';
                        shapeType = ExcelShapeType.FormControl;
                        formControlType = ExcelFormControlType.CheckBox;
                    } else if (rawType.indexOf('radio') !== -1 || rawType.indexOf('option') !== -1) {
                        mappedType = 'radio';
                        shapeType = ExcelShapeType.FormControl;
                        formControlType = ExcelFormControlType.OptionButton;
                    } else if (rawType.indexOf('button') !== -1) {
                        mappedType = 'button';
                        shapeType = ExcelShapeType.FormControl;
                        formControlType = ExcelFormControlType.Button;
                    } else if (rawType.indexOf('combo') !== -1 || rawType.indexOf('dropdown') !== -1) {
                        mappedType = 'custom';
                        shapeType = ExcelShapeType.FormControl;
                        formControlType = ExcelFormControlType.ComboBox;
                    } else if (rawType.indexOf('list') !== -1) {
                        mappedType = 'custom';
                        shapeType = ExcelShapeType.FormControl;
                        formControlType = ExcelFormControlType.ListBox;
                    } else if (rawType.indexOf('group') !== -1) {
                        mappedType = 'custom';
                        shapeType = ExcelShapeType.FormControl;
                        formControlType = ExcelFormControlType.GroupBox;
                    } else if (rawType.indexOf('spin') !== -1) {
                        mappedType = 'custom';
                        shapeType = ExcelShapeType.FormControl;
                        formControlType = ExcelFormControlType.Spinner;
                    } else if (rawType.indexOf('scroll') !== -1) {
                        mappedType = 'custom';
                        shapeType = ExcelShapeType.FormControl;
                        formControlType = ExcelFormControlType.ScrollBar;
                    }

                    let fillHex: string | undefined = undefined;
                    const fillObj: Record<string, unknown> = rawShape['fill'] as Record<string, unknown>;
                    if (fillObj && fillObj['foreColor']) {
                        fillHex = '#' + String(fillObj['foreColor']).replace(/^#/, '');
                    } else if (rawShape.fillColor) {
                        fillHex = resolveColor(rawShape.fillColor as string | Record<string, unknown>);
                    } else if (typeof rawShape.fill === 'string') {
                        fillHex = resolveColor(rawShape.fill);
                    }
                    const fillColorRgba: Rgba | undefined = fillHex ? parseHexColor(fillHex) : undefined;

                    const lineObj: Record<string, unknown> = rawShape['line'] as Record<string, unknown>;
                    let borderHex: string | undefined = undefined;
                    if (lineObj && lineObj['color']) {
                        borderHex = '#' + String(lineObj['color']).replace(/^#/, '');
                    } else if (rawShape.lineColor) {
                        borderHex = resolveColor(rawShape.lineColor as string | Record<string, unknown>);
                    } else if (rawShape.borderColor) {
                        borderHex = resolveColor(rawShape.borderColor as string | Record<string, unknown>);
                    }
                    const borderColorRgba: Rgba | undefined = borderHex ? parseHexColor(borderHex) : undefined;
                    const borderWidth: number = lineObj && !isNullOrUndefined(lineObj.weight)
                        ? Number(lineObj.weight)
                        : (!isNullOrUndefined(rawShape.lineWidth)
                            ? Number(rawShape.lineWidth)
                            : (!isNullOrUndefined(rawShape.borderWidth) ? Number(rawShape.borderWidth) : 1));
                    const borderDashStyle: string | undefined = lineObj && lineObj.dashStyle ? String(lineObj.dashStyle) : undefined;

                    const fontColorRgba: Rgba | undefined = rawShape['fontColor']
                        ? parseHexColor('#' + String(rawShape.fontColor).replace(/^#/, ''))
                        : undefined;
                    const textExtracted: string = String(rawShape.text || rawShape.caption || '');
                    const shapeRuns: Record<string, unknown>[] = (rawShape['runs'] || []) as Record<string, unknown>[];
                    const richText: IRichTextRun[] | undefined = Array.isArray(shapeRuns) && shapeRuns.length > 0
                        ? shapeRuns.map((run: Record<string, unknown>): IRichTextRun => {
                            const font: Record<string, unknown> = (run['font'] || {}) as Record<string, unknown>;
                            const colorHex: string = font.color ? ('#' + String(font.color).replace(/^#/, '')) : '';
                            const vertAlign: string = String(font.vertAlign || font.verticalAlign || '');
                            return {
                                text: String(run.text || ''),
                                fontName: font.name ? String(font.name) : (font.rFont ? String(font.rFont) : undefined),
                                fontSize: font.size ? Number(font.size) : undefined,
                                bold: font.bold ? Boolean(font.bold) : undefined,
                                italic: font.italic ? Boolean(font.italic) : undefined,
                                underline: font.underline ? (font.underline !== false && String(font.underline).toLowerCase() !== 'none') : undefined,
                                strikeout: font.strike ? Boolean(font.strike) : undefined,
                                fontColor: colorHex ? parseHexColor(colorHex) : undefined,
                                subscript: vertAlign === 'subscript' ? true : (vertAlign ? false : undefined),
                                superscript: vertAlign === 'superscript' ? true : (vertAlign ? false : undefined)
                            };
                        })
                        : undefined;

                    if (bounds.bottomRow > this.usedRange.lastRow) {
                        this.usedRange.lastRow = bounds.bottomRow;
                    }
                    if (bounds.rightColumn > this.usedRange.lastColumn) {
                        this.usedRange.lastColumn = bounds.rightColumn;
                    }
                    this.shapes.push({
                        name: String(rawShape.name || ('Shape' + (shapeIndex + 1))),
                        shapeType: shapeType,
                        autoShapeType: autoShapeType,
                        formControlType: formControlType,
                        type: mappedType,
                        presetType: presetRaw,
                        text: textExtracted,
                        rotation: Number(rawShape.rotation) || 0,
                        checked: Boolean(rawShape.checked || rawShape.isChecked || rawShape.value === 1),
                        visible: rawShape.visible !== false,
                        topRow: row,
                        leftColumn: col,
                        bottomRow: bounds.bottomRow,
                        rightColumn: bounds.rightColumn,
                        width: bounds.width,
                        height: bounds.height,
                        left: bounds.left,
                        top: bounds.top,
                        fillColor: fillColorRgba,
                        borderColor: borderColorRgba,
                        borderWidth: borderWidth,
                        borderDashStyle: borderDashStyle,
                        fontFamily: rawShape.fontName ? String(rawShape.fontName) : undefined,
                        fontSizePt: rawShape.fontSizePt ? Number(rawShape.fontSizePt) : undefined,
                        fontBold: rawShape.fontBold ? Boolean(rawShape.fontBold) : undefined,
                        fontItalic: rawShape.fontItalic ? Boolean(rawShape.fontItalic) : undefined,
                        fontColor: fontColorRgba,
                        textHorizontalAlignment: rawShape.textHorizontalAlignment ? String(rawShape.textHorizontalAlignment) : undefined,
                        textVerticalAlignment: rawShape.textVerticalAlignment ? String(rawShape.textVerticalAlignment) : undefined,
                        richText: richText,
                        pathPoints: (rawShape.pathPoints || rawShape.points) as { x: number; y: number }[]
                    });
                }
            }
        }
        const wsAny: Record<string, unknown> = worksheet as unknown as Record<string, unknown>;
        const vmlControlsObj: Record<string, unknown> = wsAny._formControls as Record<string, unknown>;
        if (vmlControlsObj && typeof vmlControlsObj.ensureLoaded === 'function' && vmlControlsObj.loaded === false) {
            (vmlControlsObj.ensureLoaded as () => void)();
        }
        const addVmlControl: (
            item: Record<string, unknown>,
            type: ExcelFormControlType,
            mappedType: 'button' | 'checkbox' | 'radio' | 'custom',
            defaultW: number,
            defaultH: number
        ) => void = (
            item: Record<string, unknown>,
            type: ExcelFormControlType,
            mappedType: 'button' | 'checkbox' | 'radio' | 'custom',
            defaultW: number,
            defaultH: number
        ): void => {
            if (!item) { return; }
            const row: number = !isNullOrUndefined(item.row)
                ? Number(item.row) : (!isNullOrUndefined(item.topRow) ? Number(item.topRow) : 1);
            const col: number = !isNullOrUndefined(item.column)
                ? Number(item.column) : (!isNullOrUndefined(item.leftColumn) ? Number(item.leftColumn) : 1);
            const widthPt: number = Number(item.width) || defaultW;
            const heightPt: number = Number(item.height) || defaultH;
            const bounds: {
                bottomRow: number;
                rightColumn: number;
                width: number;
                height: number;
                left: number;
                top: number;
            } = this.computeShapeBounds(
                row,
                col,
                widthPt,
                heightPt,
                item.left ? Number(item.left) : undefined,
                item.top ? Number(item.top) : undefined
            );
            let isChecked: boolean = false;
            if (item.checkState === 'checked' || item.checkState === 1 || item.checked === true || item.value === 1) {
                isChecked = true;
            }
            let text: string = String(item.text || item.caption || '');
            if (type === ExcelFormControlType.ComboBox && item.listFillRange) {
                const rangeStr: string = Array.isArray(item.listFillRange)
                    ? (item.listFillRange as unknown[]).join(',')
                    : String(item.listFillRange);
                const items: string[] = this.parseSeriesLabels(rangeStr);
                if (items.length > 0) {
                    const selIdx: number = typeof item.selectedIndex === 'number'
                        && item.selectedIndex >= 0 && item.selectedIndex < items.length ? item.selectedIndex : 0;
                    text = items[selIdx as number] || '';
                }
            }
            if (bounds.bottomRow > this.usedRange.lastRow) {
                this.usedRange.lastRow = bounds.bottomRow;
            }
            if (bounds.rightColumn > this.usedRange.lastColumn) {
                this.usedRange.lastColumn = bounds.rightColumn;
            }
            this.shapes.push({
                name: String(item.name || ('Control_' + this.shapes.length)),
                shapeType: ExcelShapeType.FormControl,
                formControlType: type,
                type: mappedType,
                text: text,
                checked: isChecked,
                visible: item.visible !== false,
                topRow: row,
                leftColumn: col,
                bottomRow: bounds.bottomRow,
                rightColumn: bounds.rightColumn,
                width: bounds.width,
                height: bounds.height,
                left: bounds.left,
                top: bounds.top,
                borderWidth: 1
            });
        };

        const formControlsObj: Record<string, unknown> = wsAny._formControls as Record<string, unknown>;
        const checkList: Record<string, unknown>[] = wsAny['checkBoxes'] as Record<string, unknown>[]
            || (formControlsObj && typeof formControlsObj.listCheckBoxes === 'function'
                ? (formControlsObj.listCheckBoxes as () => Record<string, unknown>[])() : undefined);
        if (checkList && checkList.length > 0) {
            for (let checkIndex: number = 0; checkIndex < checkList.length; checkIndex++) {
                const item: Record<string, unknown> = checkList[checkIndex as number];
                if (item) {
                    addVmlControl(item, ExcelFormControlType.CheckBox, 'checkbox', 80, 16);
                }
            }
        }
        const optList: Record<string, unknown>[] = wsAny['optionButtons'] as Record<string, unknown>[]
            || (formControlsObj && typeof formControlsObj.listOptionButtons === 'function'
                ? (formControlsObj.listOptionButtons as () => Record<string, unknown>[])() : undefined);
        if (optList && optList.length > 0) {
            for (let optionIndex: number = 0; optionIndex < optList.length; optionIndex++) {
                const item: Record<string, unknown> = optList[optionIndex as number];
                if (item) {
                    addVmlControl(item, ExcelFormControlType.OptionButton, 'radio', 80, 16);
                }
            }
        }
        const comboList: Record<string, unknown>[] = wsAny['comboBoxes'] as Record<string, unknown>[]
            || (formControlsObj && typeof formControlsObj.listComboBoxes === 'function'
                ? (formControlsObj.listComboBoxes as () => Record<string, unknown>[])() : undefined);
        if (comboList && comboList.length > 0) {
            for (let comboIndex: number = 0; comboIndex < comboList.length; comboIndex++) {
                const item: Record<string, unknown> = comboList[comboIndex as number];
                if (item) {
                    addVmlControl(item, ExcelFormControlType.ComboBox, 'custom', 96, 20);
                }
            }
        }
        const btnList: Record<string, unknown>[] = wsAny['buttons'] as Record<string, unknown>[]
            || (wsAny['formButtons'] as Record<string, unknown>[])
            || (formControlsObj && typeof formControlsObj.listButtons === 'function'
                ? (formControlsObj.listButtons as () => Record<string, unknown>[])() : undefined);
        if (btnList && btnList.length > 0) {
            for (let buttonIndex: number = 0; buttonIndex < btnList.length; buttonIndex++) {
                const item: Record<string, unknown> = btnList[buttonIndex as number];
                if (item) {
                    addVmlControl(item, ExcelFormControlType.Button, 'button', 72, 24);
                }
            }
        }
        const gboxList: Record<string, unknown>[] = wsAny['groupBoxes'] as Record<string, unknown>[]
            || (formControlsObj && typeof formControlsObj.listGroupBoxes === 'function'
                ? (formControlsObj.listGroupBoxes as () => Record<string, unknown>[])() : undefined);
        if (gboxList && gboxList.length > 0) {
            for (let groupIndex: number = 0; groupIndex < gboxList.length; groupIndex++) {
                const item: Record<string, unknown> = gboxList[groupIndex as number];
                if (item) {
                    addVmlControl(item, ExcelFormControlType.GroupBox, 'custom', 120, 80);
                }
            }
        }
        const lboxList: Record<string, unknown>[] = wsAny['listBoxes'] as Record<string, unknown>[]
            || (formControlsObj && typeof formControlsObj.listListBoxes === 'function'
                ? (formControlsObj.listListBoxes as () => Record<string, unknown>[])() : undefined);
        if (lboxList && lboxList.length > 0) {
            for (let listIndex: number = 0; listIndex < lboxList.length; listIndex++) {
                const item: Record<string, unknown> = lboxList[listIndex as number];
                if (item) {
                    addVmlControl(item, ExcelFormControlType.ListBox, 'custom', 96, 60);
                }
            }
        }
        const labelList: Record<string, unknown>[] = wsAny['formLabels'] as Record<string, unknown>[]
            || (formControlsObj && typeof formControlsObj.listFormLabels === 'function'
                ? (formControlsObj.listFormLabels as () => Record<string, unknown>[])() : undefined);
        if (labelList && labelList.length > 0) {
            for (let labelIndex: number = 0; labelIndex < labelList.length; labelIndex++) {
                const item: Record<string, unknown> = labelList[labelIndex as number];
                if (item) {
                    addVmlControl(item, ExcelFormControlType.Label, 'custom', 80, 16);
                }
            }
        }
        const spinList: Record<string, unknown>[] = wsAny['spinButtons'] as Record<string, unknown>[]
            || (formControlsObj && typeof formControlsObj.listSpinButtons === 'function'
                ? (formControlsObj.listSpinButtons as () => Record<string, unknown>[])() : undefined);
        if (spinList && spinList.length > 0) {
            for (let spinIndex: number = 0; spinIndex < spinList.length; spinIndex++) {
                const item: Record<string, unknown> = spinList[spinIndex as number];
                if (item) {
                    addVmlControl(item, ExcelFormControlType.Spinner, 'custom', 16, 28);
                }
            }
        }
        const scrollList: Record<string, unknown>[] = wsAny['scrollBars'] as Record<string, unknown>[]
            || (formControlsObj && typeof formControlsObj.listScrollBars === 'function'
                ? (formControlsObj.listScrollBars as () => Record<string, unknown>[])() : undefined);
        if (scrollList && scrollList.length > 0) {
            for (let scrollIndex: number = 0; scrollIndex < scrollList.length; scrollIndex++) {
                const item: Record<string, unknown> = scrollList[scrollIndex as number];
                if (item) {
                    addVmlControl(item, ExcelFormControlType.ScrollBar, 'custom', 16, 80);
                }
            }
        }
        if (formControlsObj && formControlsObj['entries'] && Array.isArray(formControlsObj['entries'])) {
            const rawEntries: Record<string, unknown>[] = formControlsObj['entries'] as Record<string, unknown>[];
            for (let formIndex: number = 0; formIndex < rawEntries.length; formIndex++) {
                const entry: Record<string, unknown> = rawEntries[formIndex as number];
                if (entry) {
                    const k: string = String(entry.type || entry.typeName || entry.shapeType || '').toLowerCase();
                    let fType: ExcelFormControlType | null = null;
                    let mType: 'button' | 'checkbox' | 'radio' | 'custom' = 'custom';
                    let defW: number = 80;
                    let defH: number = 20;
                    if (k.indexOf('check') !== -1) {
                        fType = ExcelFormControlType.CheckBox;
                        mType = 'checkbox';
                        defW = 80;
                        defH = 16;
                    } else if (k.indexOf('radio') !== -1 || k.indexOf('option') !== -1) {
                        fType = ExcelFormControlType.OptionButton;
                        mType = 'radio';
                        defW = 80;
                        defH = 16;
                    } else if (k.indexOf('combo') !== -1 || k.indexOf('drop') !== -1) {
                        fType = ExcelFormControlType.ComboBox;
                        mType = 'custom';
                        defW = 96;
                        defH = 20;
                    } else if (k.indexOf('button') !== -1) {
                        fType = ExcelFormControlType.Button;
                        mType = 'button';
                        defW = 72;
                        defH = 24;
                    }
                    if (!isNullOrUndefined(fType)) {
                        const targetRow: number = !isNullOrUndefined(entry.row)
                            ? Number(entry.row) : (!isNullOrUndefined(entry.fromRow0) ? Number(entry.fromRow0) + 1 : 1);
                        const targetCol: number = !isNullOrUndefined(entry.column)
                            ? Number(entry.column) : (!isNullOrUndefined(entry.fromCol0) ? Number(entry.fromCol0) + 1 : 1);
                        const alreadyAdded: boolean = this.shapes.some((s: IShape): boolean =>
                            s.name === entry.name || (s.topRow === targetRow && s.leftColumn === targetCol && s.formControlType === fType));
                        if (!alreadyAdded) {
                            const itemObj: Record<string, unknown> = {
                                name: entry.name || entry.id,
                                row: targetRow,
                                column: targetCol,
                                width: entry.width ? Number(entry.width) : (entry.widthEmu ? Number(entry.widthEmu) / 12700 : defW),
                                height: entry.height ? Number(entry.height) : (entry.heightEmu ? Number(entry.heightEmu) / 12700 : defH),
                                left: entry.left ? Number(entry.left) : undefined,
                                top: entry.top ? Number(entry.top) : undefined,
                                text: entry.text || entry.caption || '',
                                checkState: entry.checkState || entry.checked || entry.value,
                                listFillRange: entry.listFillRange || entry.inputRange,
                                selectedIndex: entry.selectedIndex
                            };
                            addVmlControl(itemObj, fType, mType, defW, defH);
                        }
                    }
                }
            }
        }

        const rawFormControls: Record<string, unknown>[] = (rawWs['formControls'] || []) as Record<string, unknown>[];
        if (rawFormControls && rawFormControls.length > 0) {
            for (let fcIdx: number = 0; fcIdx < rawFormControls.length; fcIdx++) {
                const fc: Record<string, unknown> = rawFormControls[fcIdx as number];
                if (fc) {
                    const row: number = !isNullOrUndefined(fc.rowIndex) ? Number(fc.rowIndex) + 1 : 1;
                    const col: number = !isNullOrUndefined(fc.colIndex) ? Number(fc.colIndex) + 1 : 1;
                    const fcWidthPt: number = !isNullOrUndefined(fc.width) ? UnitConverter.pixelsToPoints(Number(fc.width), 96) : 80;
                    const fcHeightPt: number = !isNullOrUndefined(fc.height) ? UnitConverter.pixelsToPoints(Number(fc.height), 96) : 20;
                    const fcLeftPt: number = !isNullOrUndefined(fc.left) ? UnitConverter.pixelsToPoints(Number(fc.left), 96) : 0;
                    const fcTopPt: number = !isNullOrUndefined(fc.top) ? UnitConverter.pixelsToPoints(Number(fc.top), 96) : 0;
                    const bounds: {
                        bottomRow: number;
                        rightColumn: number;
                        width: number;
                        height: number;
                        left: number;
                        top: number;
                    } = this.computeShapeBounds(row, col, fcWidthPt, fcHeightPt, fcLeftPt, fcTopPt);

                    let mappedType: 'rectangle' | 'textbox' | 'line' | 'oval' | 'button'
                    | 'checkbox' | 'radio' | 'custom' | 'diamond' | 'triangle' | 'arrow' = 'custom';
                    let formControlType: ExcelFormControlType = ExcelFormControlType.CheckBox;
                    const rawTypeStr: string = String(fc.type || '').toLowerCase();

                    if (rawTypeStr.indexOf('check') !== -1) {
                        mappedType = 'checkbox';
                        formControlType = ExcelFormControlType.CheckBox;
                    } else if (rawTypeStr.indexOf('radio') !== -1 || rawTypeStr.indexOf('option') !== -1) {
                        mappedType = 'radio';
                        formControlType = ExcelFormControlType.OptionButton;
                    } else if (rawTypeStr.indexOf('drop') !== -1 || rawTypeStr.indexOf('combo') !== -1) {
                        mappedType = 'custom';
                        formControlType = ExcelFormControlType.ComboBox;
                    }

                    let displayText: string = String(fc.text || '');
                    if (formControlType === ExcelFormControlType.ComboBox && fc.inputRange) {
                        const inputStr: string = Array.isArray(fc.inputRange)
                            ? (fc.inputRange as unknown[]).join(',')
                            : String(fc.inputRange);
                        const items: string[] = this.parseSeriesLabels(inputStr);
                        if (items.length > 0) {
                            const selIdx: number = typeof fc.selectedIndex === 'number'
                                && fc.selectedIndex >= 0 && fc.selectedIndex < items.length ? fc.selectedIndex : 0;
                            displayText = items[selIdx as number] || '';
                        }
                    }

                    if (bounds.bottomRow > this.usedRange.lastRow) {
                        this.usedRange.lastRow = bounds.bottomRow;
                    }
                    if (bounds.rightColumn > this.usedRange.lastColumn) {
                        this.usedRange.lastColumn = bounds.rightColumn;
                    }
                    this.shapes.push({
                        name: String(fc.id || ('FormControl' + (fcIdx + 1))),
                        shapeType: ExcelShapeType.FormControl,
                        formControlType: formControlType,
                        type: mappedType,
                        text: displayText,
                        checked: fc.value === 'Checked' || fc.value === true || fc.checked === true,
                        visible: fc.visible !== false,
                        topRow: row,
                        leftColumn: col,
                        bottomRow: bounds.bottomRow,
                        rightColumn: bounds.rightColumn,
                        width: bounds.width,
                        height: bounds.height,
                        left: bounds.left,
                        top: bounds.top,
                        borderWidth: 1
                    });
                }
            }
        }

        for (let shpIdx: number = 0; shpIdx < this.shapes.length; shpIdx++) {
            const shp: IShape | undefined = this.shapes[shpIdx as number];
            if (shp && shp.visible) {
                if (shp.bottomRow && shp.bottomRow > this.usedRange.lastRow) {
                    this.usedRange.lastRow = shp.bottomRow;
                }
                if (shp.rightColumn && shp.rightColumn > this.usedRange.lastColumn) {
                    this.usedRange.lastColumn = shp.rightColumn;
                }
                if (shp.topRow && shp.topRow > 0 && shp.topRow < this.usedRange.firstRow) {
                    this.usedRange.firstRow = shp.topRow;
                }
                if (shp.leftColumn && shp.leftColumn > 0 && shp.leftColumn < this.usedRange.firstColumn) {
                    this.usedRange.firstColumn = shp.leftColumn;
                }
            }
        }
    }

    private populateComments(): void {
        const rawSheet: Record<string, unknown> = this.worksheet as unknown as Record<string, unknown>;
        const threadedProp: unknown = rawSheet['threadedComments'];
        if (!isNullOrUndefined(threadedProp)) {
            const threadedRecord: Record<string, unknown> = threadedProp as Record<string, unknown>;
            const threadedListFn: (() => Record<string, unknown>[]) | undefined =
                threadedRecord['list'] as () => Record<string, unknown>[];
            const threadList: Record<string, unknown>[] = Array.isArray(threadedProp)
                ? (threadedProp as Record<string, unknown>[])
                : ((threadedRecord['entries'] as Record<string, unknown>[]) ||
                   (threadedListFn ? threadedListFn.call(threadedRecord) : []));
            for (let threadIndex: number = 0; threadIndex < threadList.length; threadIndex++) {
                const thread: Record<string, unknown> = threadList[threadIndex as number];
                if (!isNullOrUndefined(thread)) {
                    let rowIndex: number = !isNullOrUndefined(thread.row)
                        ? Number(thread.row) : (!isNullOrUndefined(thread.row0) ? Number(thread.row0) + 1 : 0);
                    let columnIndex: number = !isNullOrUndefined(thread.column)
                        ? Number(thread.column) : (!isNullOrUndefined(thread.col0) ? Number(thread.col0) + 1 : 0);
                    if (rowIndex === 0 && columnIndex === 0 && Array.isArray(thread.address)) {
                        rowIndex = Number(thread.address[0 as number] || 0) + 1;
                        columnIndex = Number(thread.address[1 as number] || 0) + 1;
                    }
                    if (rowIndex > 0 && columnIndex > 0) {
                        const replies: ICellCommentReply[] = [];
                        const threadReplies: Record<string, unknown>[] = thread['replies'] as Record<string, unknown>[];
                        if (threadReplies && threadReplies.length > 0) {
                            for (let replyIndex: number = 0; replyIndex < threadReplies.length; replyIndex++) {
                                const rep: Record<string, unknown> = threadReplies[replyIndex as number];
                                const repEntry: Record<string, unknown> = rep['entry'] as Record<string, unknown>;
                                const replyCreated: unknown = (repEntry && repEntry['dT'])
                                    || rep['dT'] || rep['createdAt'] || rep['createdTime'];
                                replies.push({
                                    author: rep.author ? String(rep.author) : '',
                                    text: rep.text ? String(rep.text).replace(/\r\n/g, '\n') : '',
                                    createdAt: replyCreated ? new Date(replyCreated as string | number) : undefined
                                });
                            }
                        }
                        const threadEntry: Record<string, unknown> = thread['entry'] as Record<string, unknown>;
                        const threadCreated: unknown = (threadEntry && threadEntry['dT'])
                            || thread.dT || thread.createdAt || thread.createdTime;
                        this.commentMap.set(`${rowIndex}_${columnIndex}`, {
                            text: thread.text ? String(thread.text).replace(/\r\n/g, '\n') : '',
                            author: thread.author ? String(thread.author) : '',
                            createdAt: threadCreated ? new Date(threadCreated as string | number) : undefined,
                            isVisible: true,
                            isThreaded: true,
                            replies: replies
                        });
                    }
                }
            }
        }
        const commentsProp: unknown = rawSheet['comments'];
        if (!isNullOrUndefined(commentsProp)) {
            const commentsRecord: Record<string, unknown> = commentsProp as Record<string, unknown>;
            const commentsListFn: (() => Record<string, unknown>[]) | undefined =
                commentsRecord['list'] as () => Record<string, unknown>[];
            const commentList: Record<string, unknown>[] = Array.isArray(commentsProp)
                ? (commentsProp as Record<string, unknown>[])
                : ((commentsRecord['entries'] as Record<string, unknown>[]) ||
                   (commentsListFn ? commentsListFn.call(commentsRecord) : []));
            for (let commentIndex: number = 0; commentIndex < commentList.length; commentIndex++) {
                const item: Record<string, unknown> = commentList[commentIndex as number];
                if (!isNullOrUndefined(item) && item.text) {
                    const itemFn: ((idx: number) => Record<string, unknown>) | undefined =
                        commentsRecord['item'] as (idx: number) => Record<string, unknown>;
                    const itemIndexed: Record<string, unknown> | undefined = itemFn ? itemFn.call(commentsRecord, commentIndex) : undefined;
                    const itemCheck: unknown = itemIndexed && itemIndexed['isThreadedComments'];
                    const isThreaded: boolean = Boolean(itemCheck || item.isThreadedComments || item.isThreaded);
                    const parsed: { row: number; col: number } | null = item.ref
                        ? RangeParser.parseCellAddress(String(item.ref)) : null;
                    let rowIndex: number = !isNullOrUndefined(item.row)
                        ? Number(item.row)
                        : (!isNullOrUndefined(item.row0) ? Number(item.row0) + 1 : (parsed ? parsed.row : 0));
                    let columnIndex: number = !isNullOrUndefined(item.column)
                        ? Number(item.column)
                        : (!isNullOrUndefined(item.col0) ? Number(item.col0) + 1 : (parsed ? parsed.col : 0));
                    if (rowIndex === 0 && columnIndex === 0 && Array.isArray(item.address)) {
                        rowIndex = Number(item.address[0 as number] || 0) + 1;
                        columnIndex = Number(item.address[1 as number] || 0) + 1;
                    }
                    if (rowIndex > 0 && columnIndex > 0) {
                        if (!isThreaded) {
                            if (!this.commentMap.has(`${rowIndex}_${columnIndex}`)) {
                                this.commentMap.set(`${rowIndex}_${columnIndex}`, {
                                    text: String(item.text).replace(/\r\n/g, '\n'),
                                    author: item.author ? String(item.author) : '',
                                    isVisible: Boolean(item.isVisible),
                                    isThreaded: false
                                });
                            }
                        } else {
                            if (!this.commentMap.has(`${rowIndex}_${columnIndex}`)) {
                                const itemEntry: Record<string, unknown> = item['entry'] as Record<string, unknown>;
                                const createdDate: unknown = (itemEntry && itemEntry['dT'])
                                    || item.dT || item.createdAt || item.createdTime;
                                this.commentMap.set(`${rowIndex}_${columnIndex}`, {
                                    text: String(item.text).replace(/\r\n/g, '\n'),
                                    author: item.author ? String(item.author) : '',
                                    createdAt: createdDate ? new Date(createdDate as string | number) : undefined,
                                    isVisible: true,
                                    isThreaded: true,
                                    replies: []
                                });
                            }
                        }
                    }
                }
            }
            if (commentsProp && typeof commentsProp === 'object' && commentList.length === 0) {
                const commentsCollection: unknown = commentsProp;
                if (typeof (commentsCollection as { forEach?: unknown }).forEach === 'function') {
                    (commentsCollection as { forEach: (fn: (item: Record<string, unknown>) => void) => void }).forEach(
                        (item: Record<string, unknown>): void => {
                            if (!isNullOrUndefined(item)) {
                                const rowIndex: number = !isNullOrUndefined(item.row)
                                    ? Number(item.row) : (!isNullOrUndefined(item.row0) ? Number(item.row0) + 1 : 0);
                                const columnIndex: number = !isNullOrUndefined(item.column)
                                    ? Number(item.column) : (!isNullOrUndefined(item.col0) ? Number(item.col0) + 1 : 0);
                                if (rowIndex > 0 && columnIndex > 0 && !this.commentMap.has(`${rowIndex}_${columnIndex}`)) {
                                    this.commentMap.set(`${rowIndex}_${columnIndex}`, {
                                        text: item.text ? String(item.text).replace(/\r\n/g, '\n') : '',
                                        author: item.author ? String(item.author) : '',
                                        isVisible: Boolean(item.isVisible),
                                        isThreaded: Boolean(item.isThreaded || item.isThreadedComments)
                                    });
                                }
                            }
                        }
                    );
                }
            }
        }
        const notesProp: unknown = rawSheet['notes'];
        if (!isNullOrUndefined(notesProp)) {
            const notesObj: Record<string, unknown> = (notesProp || {}) as Record<string, unknown>;
            const noteList: Record<string, unknown>[] = Array.isArray(notesProp)
                ? notesProp : ((notesObj['entries'] || []) as Record<string, unknown>[]);
            for (let noteIndex: number = 0; noteIndex < noteList.length; noteIndex++) {
                const note: Record<string, unknown> = noteList[noteIndex as number];
                if (!isNullOrUndefined(note)) {
                    let row: number = 0;
                    let col: number = 0;
                    if (Array.isArray(note.address)) {
                        row = Number(note.address[0 as number] || 0) + 1;
                        col = Number(note.address[1 as number] || 0) + 1;
                    } else if (note.ref) {
                        const parsed: { row: number; col: number } | null = RangeParser.parseCellAddress(String(note.ref));
                        if (parsed) { row = parsed.row; col = parsed.col; }
                    } else if (!isNullOrUndefined(note.row)) {
                        row = Number(note.row);
                        col = Number(note.column);
                    }
                    if (row > 0 && col > 0 && !this.commentMap.has(`${row}_${col}`)) {
                        this.commentMap.set(`${row}_${col}`, {
                            text: note.text ? String(note.text).replace(/\r\n/g, '\n') : '',
                            author: note.author ? String(note.author) : '',
                            isVisible: Boolean(note.isVisible),
                            isThreaded: false
                        });
                    }
                }
            }
        }
        const rawSheetRows: Record<string, unknown> = rawSheet['rows'] as Record<string, unknown>;
        const rowEntries: Record<string, unknown>[] = rawSheetRows && rawSheetRows['entries'] ? (rawSheetRows['entries'] as Record<string, unknown>[]) : [];
        for (let rowIdx: number = 0; rowIdx < rowEntries.length; rowIdx++) {
            const rowEntry: Record<string, unknown> = rowEntries[rowIdx as number];
            const rowCellsObj: Record<string, unknown> = rowEntry && (rowEntry['cells'] as Record<string, unknown>);
            if (rowCellsObj && rowCellsObj['entries']) {
                const cellEntries: Record<string, unknown>[] = rowCellsObj['entries'] as Record<string, unknown>[];
                for (let cellIdx: number = 0; cellIdx < cellEntries.length; cellIdx++) {
                    const cEntry: Record<string, unknown> = cellEntries[cellIdx as number];
                    if (cEntry) {
                        const rIdx: number = Number(rowEntry.index);
                        const cIdx: number = Number(cEntry.index);
                        if (!this.commentMap.has(`${rIdx}_${cIdx}`)) {
                            if (cEntry.comment) {
                                const comm: Record<string, unknown> = cEntry['comment'] as Record<string, unknown>;
                                const createdDate: unknown = comm['createdTime'] || comm['createdAt'];
                                const commReplies: Record<string, unknown>[] = comm['replies'] as Record<string, unknown>[];
                                const replies: ICellCommentReply[] = commReplies ? commReplies.map(
                                    (rep: Record<string, unknown>): ICellCommentReply => {
                                        const repDate: unknown = rep.createdTime || rep.createdAt;
                                        return {
                                            author: rep.author ? String(rep.author) : '',
                                            text: rep.text ? String(rep.text).replace(/\r\n/g, '\n') : '',
                                            createdAt: repDate ? new Date(repDate as string | number) : undefined
                                        };
                                    }
                                ) : [];
                                this.commentMap.set(`${rIdx}_${cIdx}`, {
                                    text: comm.text ? String(comm.text).replace(/\r\n/g, '\n') : '',
                                    author: comm.author ? String(comm.author) : '',
                                    createdAt: createdDate ? new Date(createdDate as string | number) : undefined,
                                    isVisible: true,
                                    isThreaded: true,
                                    replies: replies
                                });
                            } else if (cEntry.notes) {
                                this.commentMap.set(`${rIdx}_${cIdx}`, {
                                    text: String(cEntry.notes).replace(/\r\n/g, '\n'),
                                    author: '',
                                    isVisible: false,
                                    isThreaded: false
                                });
                            }
                        }
                    }
                }
            }
        }
    }

    private computeShapeBounds(
        row: number,
        col: number,
        widthPt: number,
        heightPt: number,
        rawLeft?: number,
        rawTop?: number
    ): { bottomRow: number; rightColumn: number; width: number; height: number; left: number; top: number } {
        let leftPt: number = !isNullOrUndefined(rawLeft) ? rawLeft : 0;
        let topPt: number = !isNullOrUndefined(rawTop) ? rawTop : 0;
        if (leftPt === 0 && col > 1) {
            for (let colIndex: number = 1; colIndex < col; colIndex++) {
                leftPt += UnitConverter.pixelsToPoints(this.getColumnWidthPx(colIndex), 96);
            }
        }
        if (topPt === 0 && row > 1) {
            for (let rowIndex: number = 1; rowIndex < row; rowIndex++) {
                topPt += UnitConverter.pixelsToPoints(this.getRowHeightPx(rowIndex), 96);
            }
        }
        let currRow: number = row;
        let remHeightPt: number = heightPt;
        while (remHeightPt > 0 && currRow < 1048576) {
            const rhPt: number = UnitConverter.pixelsToPoints(this.getRowHeightPx(currRow), 96);
            remHeightPt -= (rhPt > 0 ? rhPt : 15);
            currRow++;
        }
        const bottomRow: number = Math.max(row + 1, currRow);
        let currCol: number = col;
        let remWidthPt: number = widthPt;
        while (remWidthPt > 0 && currCol < 16384) {
            const cwPt: number = UnitConverter.pixelsToPoints(this.getColumnWidthPx(currCol), 96);
            remWidthPt -= (cwPt > 0 ? cwPt : 48);
            currCol++;
        }
        const rightColumn: number = Math.max(col + 1, currCol);
        return {
            bottomRow: bottomRow,
            rightColumn: rightColumn,
            width: UnitConverter.pointsToPixels(widthPt, 96),
            height: UnitConverter.pointsToPixels(heightPt, 96),
            left: UnitConverter.pointsToPixels(leftPt, 96),
            top: UnitConverter.pointsToPixels(topPt, 96)
        };
    }

    private getTargetWorksheet(sheetName?: string): XlsxWorksheet {
        if (!sheetName || !this.workbook || !this.workbook.worksheets) { return this.worksheet; }
        const cleanName: string = sheetName.replace(/[']/g, '').trim();
        if (cleanName === this.worksheet.name) { return this.worksheet; }
        for (let sheetIdx: number = 0; sheetIdx < this.workbook.worksheets.length; sheetIdx++) {
            const currentSheet: XlsxWorksheet = this.workbook.worksheets[sheetIdx as number];
            if (currentSheet && currentSheet.name === cleanName) {
                return currentSheet;
            }
        }
        return this.worksheet;
    }

    private parseSeriesTitle(titleRef: string | undefined): string {
        if (!titleRef) { return ''; }
        const clean: string = titleRef.replace(/[$]/g, '');
        if (clean.indexOf('!') !== -1 || /^[A-Za-z]+[0-9]+$/.test(clean)) {
            const parts: string[] = clean.split('!');
            const target: XlsxWorksheet = this.getTargetWorksheet(parts.length > 1 ? parts[0] : undefined);
            const ref: string = parts.length > 1 ? parts[1] : parts[0];
            const bounds: {
                firstRow: number;
                firstColumn: number;
                lastRow: number;
                lastColumn: number;
            } | null = this.parseRangeAddress(ref);
            if (bounds) {
                const cell: XlsxCell = target.cell(bounds.firstRow, bounds.firstColumn);
                if (!isNullOrUndefined(cell) && !isNullOrUndefined(cell.value) && cell.value !== '') {
                    const formatted: { displayText: string; isNumber: boolean } = formatCellValue(cell.value, cell.numberFormat);
                    return !isNullOrUndefined(formatted) && formatted.displayText !== '' ? formatted.displayText : String(cell.value);
                }
            }
        }
        return titleRef;
    }

    private resolveSeriesCells(rangeRef: string): XlsxCell[] {
        const cells: XlsxCell[] = [];
        if (!rangeRef) { return cells; }
        const clean: string = rangeRef.replace(/[$]/g, '');
        const parts: string[] = clean.split('!');
        const target: XlsxWorksheet = this.getTargetWorksheet(parts.length > 1 ? parts[0] : undefined);
        const ref: string = parts.length > 1 ? parts[1] : parts[0];
        const bounds: {
            firstRow: number;
            firstColumn: number;
            lastRow: number;
            lastColumn: number;
        } | null = this.parseRangeAddress(ref);
        if (bounds) {
            for (let rowIndex: number = bounds.firstRow; rowIndex <= bounds.lastRow; rowIndex++) {
                for (let colIndex: number = bounds.firstColumn; colIndex <= bounds.lastColumn; colIndex++) {
                    const cell: XlsxCell = target.cell(rowIndex, colIndex);
                    if (!isNullOrUndefined(cell) && !isNullOrUndefined(cell.value) && cell.value !== '') {
                        cells.push(cell);
                    }
                }
            }
        }
        return cells;
    }

    private parseSeriesValues(rangeRef: string): number[] {
        const values: number[] = [];
        for (const cell of this.resolveSeriesCells(rangeRef)) {
            const num: number = Number(String(cell.value).replace(/,/g, '').trim());
            if (!isNaN(num)) {
                values.push(num);
            }
        }
        return values;
    }

    private parseSeriesLabels(rangeRef: string): string[] {
        const labels: string[] = [];
        for (const cell of this.resolveSeriesCells(rangeRef)) {
            const formatted: { displayText: string; isNumber: boolean } = formatCellValue(cell.value, cell.numberFormat);
            labels.push(!isNullOrUndefined(formatted) && formatted.displayText !== '' ? formatted.displayText : String(cell.value));
        }
        return labels;
    }

    private parseRangeAddress(ref: string): { firstRow: number; firstColumn: number; lastRow: number; lastColumn: number } | null {
        const sides: string[] = ref.split(':');
        if (sides.length === 0) { return null; }
        const startPos: { row: number; col: number } | null = RangeParser.parseCellAddress(sides[0]);
        if (!startPos) { return null; }
        const endPos: { row: number; col: number } | null = sides.length > 1 ? RangeParser.parseCellAddress(sides[1]) : startPos;
        if (!endPos) { return null; }
        return {
            firstRow: Math.min(startPos.row, endPos.row),
            firstColumn: Math.min(startPos.col, endPos.col),
            lastRow: Math.max(startPos.row, endPos.row),
            lastColumn: Math.max(startPos.col, endPos.col)
        };
    }

    /**
     * Retrieves or creates an adapted cell by row and column indices.
     *
     * @param {number} row - 1-based row index.
     * @param {number} column - 1-based column index.
     * @returns {ICell} Cell model.
     */
    public getCell(row: number, column: number): ICell {
        const key: string = `${row}_${column}`;
        if (this.cellMap.has(key)) {
            const cached: ICell | undefined = this.cellMap.get(key);
            if (!isNullOrUndefined(cached)) {
                return cached;
            }
        }
        const createdCell: ICell = this.createCell(row, column);
        this.cellMap.set(key, createdCell);
        return createdCell;
    }

    /**
     * Retrieves column width in pixels (Excel character formula: width * 7 + 5).
     *
     * @param {number} column - 1-based column index.
     * @returns {number} Column width in pixels.
     */
    public getColumnWidthPx(column: number): number {
        if (!this.isColumnVisible(column)) {
            return 0;
        }
        const columnInfo: Record<string, unknown> | undefined = this.colMap.get(column);
        if (columnInfo) {
            const rawWidth: number = Number(columnInfo.width) || 0;
            if (rawWidth > 0) {
                return Math.floor(rawWidth * 7 + 5);
            }
        }
        return 64;
    }

    /**
     * Determines whether a column is visible.
     *
     * @param {number} column - 1-based column index.
     * @returns {boolean} True if visible; false otherwise.
     */
    public isColumnVisible(column: number): boolean {
        const columnEntry: Record<string, unknown> | undefined = this.colMap.get(column);
        return !(columnEntry && (columnEntry.hidden || columnEntry.width === 0));
    }

    /**
     * Retrieves row height in pixels (Excel point formula: height * 96 / 72).
     *
     * @param {number} row - 1-based row index.
     * @returns {number} Row height in pixels.
     */
    public getRowHeightPx(row: number): number {
        if (!this.isRowVisible(row)) {
            return 0;
        }
        const rowEntry: Record<string, unknown> | undefined = this.rowMap.get(row);
        if (rowEntry && !isNullOrUndefined(rowEntry.height)) {
            return Math.round(((Number(rowEntry.height) * 96) / 72) * 100) / 100;
        }
        if (this.worksheet.standardHeight) {
            return Math.round(((this.worksheet.standardHeight * 96) / 72) * 10) / 10;
        }
        return 20;
    }

    /**
     * Determines whether a row is visible.
     *
     * @param {number} row - 1-based row index.
     * @returns {boolean} True if row is visible; false otherwise.
     */
    public isRowVisible(row: number): boolean {
        const rowEntry: Record<string, unknown> | undefined = this.rowMap.get(row);
        if (rowEntry && (rowEntry.hidden === true || rowEntry.height === 0)) {
            return false;
        }
        const rawSheet: Record<string, unknown> = this.worksheet as unknown as Record<string, unknown>;
        if (rawSheet && typeof rawSheet.getHiddenRowHeightInPixels === 'function'
            && (rawSheet.getHiddenRowHeightInPixels as (r: number) => number)(row) === 0) {
            return false;
        }
        return true;
    }

    /**
     * Checks if a cell contains meaningful non-empty value.
     *
     * @param {number} row - 1-based row index.
     * @param {number} column - 1-based column index.
     * @returns {boolean} True if cell contains non-empty value; false otherwise.
     */
    public hasCellData(row: number, column: number): boolean {
        const cell: XlsxCell = this.worksheet.cell(row, column);
        return !isNullOrUndefined(cell) && ((!isNullOrUndefined(cell.value) && cell.value !== '') || (!isNullOrUndefined(cell.formula) && cell.formula !== ''));
    }

    /**
     * Creates and resolves normalized cell model with font, fill, border, alignment, and formatting.
     *
     * @param {number} row - 1-based row index.
     * @param {number} column - 1-based column index.
     * @returns {ICell} Resolved cell structure.
     */
    private createCell(row: number, column: number): ICell {
        const cellWrapper: XlsxCell = this.worksheet.cell(row, column);
        const rowEntry: Record<string, unknown> | undefined = this.rowMap.get(row);
        let cellValue: unknown = cellWrapper ? cellWrapper.value : '';
        const formulaStr: string | undefined = cellWrapper ? cellWrapper.formula : undefined;
        if (cellValue && typeof cellValue === 'object') {
            const valObj: Record<string, unknown> = cellValue as Record<string, unknown>;
            cellValue = valObj['code'] || valObj['text'] || '';
        }
        if (isNullOrUndefined(cellValue) || cellValue === 'NaN' || (typeof cellValue === 'number' && isNaN(cellValue))) {
            cellValue = '';
        }
        if (!cellValue && formulaStr) {
            const sumMatch: RegExpMatchArray | null = formulaStr.replace(/[$]/g, '')
                .match(/^=?\s*SUM\s*\(\s*([A-Za-z0-9]+)\s*:\s*([A-Za-z0-9]+)\s*\)/i);
            if (sumMatch) {
                const range: {
                    firstRow: number;
                    firstColumn: number;
                    lastRow: number;
                    lastColumn: number;
                } | null = this.parseRangeAddress(`${sumMatch[1]}:${sumMatch[2]}`);
                if (range) {
                    let total: number = 0;
                    let hasNum: boolean = false;
                    for (let sumRow: number = range.firstRow; sumRow <= range.lastRow; sumRow++) {
                        for (let sumCol: number = range.firstColumn; sumCol <= range.lastColumn; sumCol++) {
                            const refCell: XlsxCell = this.worksheet.cell(sumRow, sumCol);
                            if (refCell && !isNullOrUndefined(refCell.value) && refCell.value !== '') {
                                const numericValue: number = Number(refCell.value);
                                if (!isNaN(numericValue)) {
                                    total += numericValue;
                                    hasNum = true;
                                }
                            }
                        }
                    }
                    if (hasNum) {
                        cellValue = total;
                    }
                }
            }
        }
        const cellStyleObj: Record<string, unknown> = (cellWrapper && cellWrapper.style
            ? cellWrapper.style
            : (rowEntry ? (rowEntry.style || rowEntry.cellFormat || rowEntry.format) : null)) as Record<string, unknown>;
        let fontColorHex: string = '#000000';
        let bgColorHex: string = '#FFFFFF';
        let isBold: boolean = false;
        let isItalic: boolean = false;
        let isUnderline: boolean = false;
        let isStrikeout: boolean = false;
        let fontName: string = 'Calibri';
        let fontSize: number = 11;
        let horizontalAlign: ExcelHAlign = ExcelHAlign.General;
        let verticalAlign: ExcelVAlign = ExcelVAlign.Bottom;
        let isWrapText: boolean = false;
        let indentLevel: number = 0;
        let isShrinkToFit: boolean = false;
        const leftBorder: IBorder = { lineStyle: ExcelLineStyle.None, color: { r: 0, g: 0, b: 0, a: 255 } };
        const rightBorder: IBorder = { lineStyle: ExcelLineStyle.None, color: { r: 0, g: 0, b: 0, a: 255 } };
        const topBorder: IBorder = { lineStyle: ExcelLineStyle.None, color: { r: 0, g: 0, b: 0, a: 255 } };
        const bottomBorder: IBorder = { lineStyle: ExcelLineStyle.None, color: { r: 0, g: 0, b: 0, a: 255 } };
        if (cellStyleObj) {
            const alignment: Record<string, unknown> = cellStyleObj.alignment as Record<string, unknown>;
            if (alignment) {
                if (alignment.horizontal) { horizontalAlign = mapHAlign(String(alignment.horizontal)); }
                if (alignment.vertical) { verticalAlign = mapVAlign(String(alignment.vertical)); }
                if (alignment.wrapText) { isWrapText = true; }
                if (alignment.indent) { indentLevel = Number(alignment.indent); }
                if (alignment.shrinkToFit) { isShrinkToFit = true; }
            }
            const fontObj: Record<string, unknown> = cellStyleObj.font as Record<string, unknown>;
            if (fontObj) {
                if (fontObj.name) { fontName = String(fontObj.name); }
                if (fontObj.size) { fontSize = Number(fontObj.size); }
                if (fontObj.bold) { isBold = true; }
                if (fontObj.italic) { isItalic = true; }
                if (fontObj.underline) { isUnderline = true; }
                if (fontObj.strike) { isStrikeout = true; }
                if (fontObj.color) {
                    const resolvedFontColor: string = resolveColor(fontObj.color);
                    if (resolvedFontColor) { fontColorHex = resolvedFontColor; }
                }
            }
            const fillObj: Record<string, unknown> = cellStyleObj['fill'] as Record<string, unknown>;
            if (fillObj) {
                const colorSource: unknown = fillObj['fgColor'] || fillObj['bgColor'];
                if (colorSource) {
                    const resolvedBgColor: string = resolveColor(colorSource);
                    if (resolvedBgColor && resolvedBgColor !== '#FFFFFF') { bgColorHex = resolvedBgColor; }
                }
            }
            const bordersObj: Record<string, unknown> = (cellStyleObj.borders || cellStyleObj.border) as Record<string, unknown>;
            if (bordersObj) {
                const mapEdge: (edge: Record<string, unknown> | undefined, target: IBorder) => void = (
                    edge: Record<string, unknown> | undefined,
                    target: IBorder
                ): void => {
                    if (edge && edge.style && edge.style !== 'none') {
                        target.lineStyle = mapLineStyle(String(edge.style));
                        const edgeColor: string = resolveColor(edge.color);
                        if (edgeColor) { target.color = parseHexColor(edgeColor); }
                    }
                };
                mapEdge(bordersObj.left as Record<string, unknown>, leftBorder);
                mapEdge(bordersObj.right as Record<string, unknown>, rightBorder);
                mapEdge(bordersObj.top as Record<string, unknown>, topBorder);
                mapEdge(bordersObj.bottom as Record<string, unknown>, bottomBorder);
            }
        }
        const cellStyle: ICellStyle = {
            fontName: fontName,
            fontSize: fontSize,
            bold: isBold,
            italic: isItalic,
            underline: isUnderline,
            strikeout: isStrikeout,
            fontColor: parseHexColor(fontColorHex),
            fillPattern: bgColorHex && bgColorHex !== '#FFFFFF' ? ExcelPattern.Solid : ExcelPattern.None,
            fillColor: parseHexColor(bgColorHex),
            hAlign: horizontalAlign,
            vAlign: verticalAlign,
            wrapText: isWrapText,
            indent: indentLevel,
            rotation: 0,
            shrinkToFit: isShrinkToFit,
            borders: {
                left: leftBorder,
                right: rightBorder,
                top: topBorder,
                bottom: bottomBorder,
                diagonalDown: { lineStyle: ExcelLineStyle.None, color: { r: 0, g: 0, b: 0, a: 255 } },
                diagonalUp: { lineStyle: ExcelLineStyle.None, color: { r: 0, g: 0, b: 0, a: 255 } }
            },
            numberFormat: cellWrapper ? (cellWrapper.numberFormat || '@') : '@'
        };
        let cellType: CellType = CellType.Blank;
        if (typeof cellValue === 'number') {
            cellType = CellType.Number;
        } else if (typeof cellValue === 'boolean') {
            cellType = CellType.Boolean;
        } else if (cellValue) {
            cellType = CellType.String;
        }
        const richTextRuns: IRichTextRun[] | undefined = extractRichTextRuns(cellWrapper);
        if ((isNullOrUndefined(cellValue) || cellValue === '') && richTextRuns && richTextRuns.length > 0) {
            cellValue = richTextRuns.map((runItem: IRichTextRun): string => runItem.text).join('');
        }
        const isBlank: boolean = (cellValue === '' || isNullOrUndefined(cellValue))
            && !formulaStr && !(richTextRuns && richTextRuns.length > 0);
        if (cellType === CellType.Blank && richTextRuns && richTextRuns.length > 0) {
            cellType = CellType.String;
        }
        const numberFormatStr: string | undefined = cellWrapper ? cellWrapper.numberFormat : undefined;
        const formattedResult: { displayText: string; isNumber: boolean } = formatCellValue(cellValue, numberFormatStr);
        let displayOverride: string | undefined;
        const cfResult: Record<string, unknown> | null = ConditionalFormattingEngine.evaluateSheetCF(
            this.worksheet, this.workbook, row, column, cellValue
        ) as Record<string, unknown> | null;
        if (cfResult) {
            if (cfResult.fillColor) {
                cellStyle.fillPattern = ExcelPattern.Solid;
                cellStyle.fillColor = parseHexColor(String(cfResult.fillColor));
            }
            if (cfResult.textColor) {
                cellStyle.fontColor = parseHexColor(String(cfResult.textColor));
            }
            if (!isNullOrUndefined(cfResult.isBold)) {
                cellStyle.bold = Boolean(cfResult.isBold);
            }
            if (!isNullOrUndefined(cfResult.isItalic)) {
                cellStyle.italic = Boolean(cfResult.isItalic);
            }
            if (!isNullOrUndefined(cfResult.isUnderline)) {
                cellStyle.underline = Boolean(cfResult.isUnderline);
            }
            if (!isNullOrUndefined(cfResult.isStrike)) {
                cellStyle.strikeout = Boolean(cfResult.isStrike);
            }
            if (cfResult.borders) {
                const cfBorders: Record<string, { style?: string; color?: string }> =
                    cfResult.borders as Record<string, { style?: string; color?: string }>;
                const targetBorders: IBorders = cellStyle.borders;
                if (cfBorders.left) {
                    targetBorders.left = {
                        lineStyle: mapLineStyle(String(cfBorders.left.style)),
                        color: cfBorders.left.color ? parseHexColor(cfBorders.left.color) : { r: 0, g: 0, b: 0, a: 255 }
                    };
                }
                if (cfBorders.right) {
                    targetBorders.right = {
                        lineStyle: mapLineStyle(String(cfBorders.right.style)),
                        color: cfBorders.right.color ? parseHexColor(cfBorders.right.color) : { r: 0, g: 0, b: 0, a: 255 }
                    };
                }
                if (cfBorders.top) {
                    targetBorders.top = {
                        lineStyle: mapLineStyle(String(cfBorders.top.style)),
                        color: cfBorders.top.color ? parseHexColor(cfBorders.top.color) : { r: 0, g: 0, b: 0, a: 255 }
                    };
                }
                if (cfBorders.bottom) {
                    targetBorders.bottom = {
                        lineStyle: mapLineStyle(String(cfBorders.bottom.style)),
                        color: cfBorders.bottom.color ? parseHexColor(cfBorders.bottom.color) : { r: 0, g: 0, b: 0, a: 255 }
                    };
                }
            }
            if (cfResult.numberFormat) {
                cellStyle.numberFormat = String(cfResult.numberFormat);
                displayOverride = formatCellValue(cellValue, String(cfResult.numberFormat)).displayText;
            }
        }
        const hasCfVisual: boolean = !isNullOrUndefined(cfResult)
            && (!isNullOrUndefined(cfResult.fillColor)
                || !isNullOrUndefined(cfResult.textColor)
                || !isNullOrUndefined(cfResult.dataBar)
                || !isNullOrUndefined(cfResult.iconSet)
                || !isNullOrUndefined(cfResult.borders));
        return {
            row: row,
            column: column,
            displayText: cfResult && cfResult.hideValue
                ? ''
                : (!isNullOrUndefined(displayOverride) ? displayOverride : formattedResult.displayText),
            isBlank: isBlank,
            cellType: cellType,
            style: cellStyle,
            hasStyle: !isNullOrUndefined(cellStyleObj) || hasCfVisual,
            hyperlink: cellWrapper && cellWrapper.hyperlink ? String(cellWrapper.hyperlink.target || '') : undefined,
            dataBar: cfResult && cfResult.dataBar ? (cfResult.dataBar as ICell['dataBar']) : undefined,
            iconSet: cfResult && cfResult.iconSet ? (cfResult.iconSet as ICell['iconSet']) : undefined,
            hideValue: cfResult ? Boolean(cfResult.hideValue) : undefined,
            richText: richTextRuns,
            comment: this.commentMap.get(`${row}_${column}`)
                || (cellWrapper && (cellWrapper as unknown as Record<string, unknown>)['notes']
                    ? { text: String((cellWrapper as unknown as Record<string, unknown>)['notes']), isThreaded: false, isVisible: true }
                    : undefined),
            hasFilterButton: this.isFilterHeaderCell(row, column),
            hasDropdownButton: this.isCellDropdown(cellWrapper)
        };
    }

    private isCellDropdown(cellWrapper: XlsxCell | undefined): boolean {
        if (!cellWrapper) {
            return false;
        }
        const raw: Record<string, unknown> = cellWrapper as unknown as Record<string, unknown>;
        const rawVal: Record<string, unknown> = raw['validation'] as Record<string, unknown>;
        if (rawVal && rawVal['type'] === 'List' && rawVal['inCellDropDown'] !== false) {
            return true;
        }
        const rawDataVal: Record<string, unknown> = raw['dataValidation'] as Record<string, unknown>;
        if (rawDataVal && rawDataVal['type'] === 'list' && rawDataVal['suppressDropDownArrow'] !== true) {
            return true;
        }
        return false;
    }

    private isFilterHeaderCell(row: number, column: number): boolean {
        if (!this.autoFilter || !this.autoFilter.filterRange) {
            return false;
        }
        const range: {
            firstRow: number;
            firstColumn: number;
            lastRow: number;
            lastColumn: number;
        } | null = this.parseRangeAddress(this.autoFilter.filterRange);
        if (!range) {
            return false;
        }
        return row === range.firstRow && column >= range.firstColumn && column <= range.lastColumn;
    }
}

/**
 * Extracts rich text runs from a cell wrapper if available.
 *
 * @param {XlsxCell | undefined} cellWrapper - Cell wrapper object.
 * @returns {IRichTextRun[] | undefined} Array of rich text runs or undefined.
 */
function extractRichTextRuns(cellWrapper: XlsxCell | undefined): IRichTextRun[] | undefined {
    if (isNullOrUndefined(cellWrapper)) {
        return undefined;
    }
    const raw: Record<string, unknown> = cellWrapper as unknown as Record<string, unknown>;
    const richTextObj: Record<string, unknown> = raw['richText'] as Record<string, unknown>;
    if (raw.hasRichText && richTextObj && typeof richTextObj.getRuns === 'function') {
        const getRunsFn: (() => Record<string, unknown>[]) | undefined = richTextObj ? richTextObj['getRuns'] as () => Record<string, unknown>[] : undefined;
        const runs: Record<string, unknown>[] = getRunsFn ? getRunsFn.call(richTextObj) : [];
        if (runs && runs.length > 0 && (runs.length > 1 || runs.some((runItem: Record<string, unknown>): boolean => !isNullOrUndefined(runItem['font'])))) {
            return runs.map((runItem: Record<string, unknown>): IRichTextRun => {
                const font: Record<string, unknown> = (runItem['font'] || {}) as Record<string, unknown>;
                const colorHex: string = font.color ? resolveColor(font.color) : '';
                const underlineVal: boolean | undefined = !isNullOrUndefined(font.underline)
                    ? (font.underline !== false && String(font.underline).toLowerCase() !== 'none')
                    : undefined;
                return {
                    text: isNullOrUndefined(runItem.text) ? '' : String(runItem.text),
                    fontName: font.name ? String(font.name) : (font.rFont ? String(font.rFont) : undefined),
                    fontSize: !isNullOrUndefined(font.size) ? Number(font.size) : undefined,
                    bold: !isNullOrUndefined(font.bold) ? Boolean(font.bold) : undefined,
                    italic: !isNullOrUndefined(font.italic) ? Boolean(font.italic) : undefined,
                    underline: underlineVal,
                    strikeout: !isNullOrUndefined(font.strike) ? Boolean(font.strike) : undefined,
                    fontColor: colorHex ? parseHexColor(colorHex) : undefined,
                    subscript: font.vertAlign === 'subscript' ? true : (font.vertAlign ? false : undefined),
                    superscript: font.vertAlign === 'superscript' ? true : (font.vertAlign ? false : undefined)
                };
            });
        }
    } else if (Array.isArray(raw.richText) && raw.richText.length > 0) {
        const richList: Record<string, unknown>[] = (raw['richText'] || []) as Record<string, unknown>[];
        return richList.map((run: Record<string, unknown>): IRichTextRun => {
            const runStyle: Record<string, unknown> = (run['style'] || {}) as Record<string, unknown>;
            const colorHex: string = runStyle.color ? resolveColor(runStyle.color) : '';
            const parsedSize: number = runStyle.fontSize ? parseFloat(String(runStyle.fontSize)) : NaN;
            const textDec: string = String(runStyle.textDecoration || '').toLowerCase();
            const vertAlign: string = String(runStyle.verticalAlign || '').toLowerCase();
            return {
                text: isNullOrUndefined(run.text) ? '' : String(run.text),
                fontName: runStyle.fontFamily ? String(runStyle.fontFamily) : undefined,
                fontSize: !isNaN(parsedSize) ? parsedSize : undefined,
                bold: runStyle.fontWeight === 'bold' ? true : (runStyle.fontWeight ? false : undefined),
                italic: runStyle.fontStyle === 'italic' ? true : (runStyle.fontStyle ? false : undefined),
                underline: textDec ? (textDec.indexOf('underline') !== -1) : undefined,
                strikeout: textDec ? (textDec.indexOf('line-through') !== -1 || textDec.indexOf('strike') !== -1) : undefined,
                fontColor: colorHex ? parseHexColor(colorHex) : undefined,
                subscript: vertAlign === 'subscript' ? true : (vertAlign ? false : undefined),
                superscript: vertAlign === 'superscript' ? true : (vertAlign ? false : undefined)
            };
        });
    }
    return undefined;
}

/**
 * Resolves color value from various Excel color object shapes or hex strings.
 *
 * @param {Object} colorObj - Excel color object or string representation.
 * @returns {string} Normalized 7-character hexadecimal color string.
 */
function resolveColor(colorObj: unknown): string {
    if (!colorObj) { return ''; }
    if (typeof colorObj === 'string') { return formatHexColor(colorObj); }
    const colorRecord: Record<string, unknown> = colorObj as Record<string, unknown>;
    if (colorRecord.rgbColor) {
        return formatHexColor(String(colorRecord.rgbColor));
    }
    if (colorRecord.rgb || colorRecord.argb) {
        return formatHexColor(String(colorRecord.rgb || colorRecord.argb));
    }
    if (!isNullOrUndefined(colorRecord.theme)) {
        const themeColors: string[] = [
            '#FFFFFF', '#000000', '#E7E6E6', '#44546A', '#4472C4',
            '#ED7D31', '#A5A5A5', '#FFC000', '#5B9BD5', '#70AD47',
            '#0563C1', '#954F72'
        ];
        const themeIdx: number = Number(colorRecord.theme);
        const baseHex: string = (themeIdx >= 0 && themeIdx < themeColors.length ? themeColors[themeIdx as number] : undefined) || '#000000';
        if (!isNullOrUndefined(colorRecord.tint) && colorRecord.tint !== 0) {
            const tint: number = Number(colorRecord.tint);
            const clean: string = baseHex.startsWith('#') ? baseHex.slice(1) : baseHex;
            let red: number = parseInt(clean.substring(0, 2), 16);
            let green: number = parseInt(clean.substring(2, 4), 16);
            let blue: number = parseInt(clean.substring(4, 6), 16);
            if (tint > 0) {
                red = Math.round(red * (1.0 - tint) + 255 * tint);
                green = Math.round(green * (1.0 - tint) + 255 * tint);
                blue = Math.round(blue * (1.0 - tint) + 255 * tint);
            } else if (tint < 0) {
                red = Math.round(red * (1.0 + tint));
                green = Math.round(green * (1.0 + tint));
                blue = Math.round(blue * (1.0 + tint));
            }
            const toHex: (num: number) => string = (num: number): string => {
                const hex: string = Math.min(255, Math.max(0, num)).toString(16);
                return hex.length < 2 ? '0' + hex : hex;
            };
            return ('#' + toHex(red) + toHex(green) + toHex(blue)).toUpperCase();
        }
        return baseHex;
    }
    return '';
}

/**
 * Maps raw border style name to ExcelLineStyle enum.
 *
 * @param {string} style - Raw border style string.
 * @returns {ExcelLineStyle} Mapped line style.
 */
function mapLineStyle(style: string): ExcelLineStyle {
    if (!style) { return ExcelLineStyle.None; }
    const styleName: string = String(style).toLowerCase();
    switch (true) {
    case styleName.indexOf('thick') !== -1: return ExcelLineStyle.Thick;
    case styleName.indexOf('double') !== -1: return ExcelLineStyle.Double;
    case styleName.indexOf('medium') !== -1: return ExcelLineStyle.Medium;
    case styleName.indexOf('hair') !== -1: return ExcelLineStyle.Hair;
    case styleName.indexOf('dotted') !== -1 || styleName.indexOf('dot') !== -1: return ExcelLineStyle.Dotted;
    case styleName.indexOf('dashed') !== -1 || styleName.indexOf('dash') !== -1: return ExcelLineStyle.Dashed;
    default: return ExcelLineStyle.Thin;
    }
}

/**
 * Maps raw alignment string to ExcelHAlign enum.
 *
 * @param {string} alignment - Horizontal alignment name.
 * @returns {ExcelHAlign} Mapped horizontal alignment.
 */
export function mapHAlign(alignment: string): ExcelHAlign {
    if (!alignment) { return ExcelHAlign.General; }
    switch (String(alignment).toLowerCase()) {
    case 'left': return ExcelHAlign.Left;
    case 'center': return ExcelHAlign.Center;
    case 'right': return ExcelHAlign.Right;
    case 'justify': return ExcelHAlign.Justify;
    case 'fill': return ExcelHAlign.Fill;
    default: return ExcelHAlign.General;
    }
}

/**
 * Maps raw alignment string to ExcelVAlign enum.
 *
 * @param {string} alignment - Vertical alignment name.
 * @returns {ExcelVAlign} Mapped vertical alignment.
 */
export function mapVAlign(alignment: string): ExcelVAlign {
    if (!alignment) { return ExcelVAlign.Bottom; }
    switch (String(alignment).toLowerCase()) {
    case 'top': return ExcelVAlign.Top;
    case 'middle': case 'center': return ExcelVAlign.Center;
    case 'justify': return ExcelVAlign.Justify;
    default: return ExcelVAlign.Bottom;
    }
}

/**
 * Formatted cell result interface.
 */
export interface FormattedCellResult {
    /** Formatted display text. */
    displayText: string;
    /** Whether the cell represents a numeric value. */
    isNumber: boolean;
}

/**
 * Formats cell value according to Excel format code.
 *
 * @param {Object} rawValue - Cell raw value.
 * @param {string | undefined} formatString - Excel number format string.
 * @returns {FormattedCellResult} Formatted display text and type indication.
 */
export function formatCellValue(rawValue: unknown, formatString: string | undefined): FormattedCellResult {
    if (rawValue && typeof rawValue === 'object') {
        const rawObj: Record<string, unknown> = rawValue as Record<string, unknown>;
        if ('code' in rawObj) {
            rawValue = rawObj['code'];
        } else if ('text' in rawObj) {
            rawValue = rawObj['text'];
        }
    }
    if (isNullOrUndefined(rawValue) || rawValue === ''
        || (typeof rawValue === 'number' && isNaN(rawValue))
        || rawValue === 'NaN' || String(rawValue).trim().toLowerCase() === 'nan') {
        return { displayText: '', isNumber: false };
    }
    if (typeof rawValue === 'boolean') {
        return { displayText: rawValue ? 'TRUE' : 'FALSE', isNumber: false };
    }
    const effectiveFormat: string = formatString || 'General';
    if (typeof rawValue !== 'number') {
        return { displayText: formatText(String(rawValue), effectiveFormat).text, isNumber: false };
    }
    const numericValue: number = Number(rawValue);
    if (isNaN(numericValue)) {
        return { displayText: '', isNumber: false };
    }
    if (effectiveFormat === '@') {
        return { displayText: String(numericValue), isNumber: true };
    }
    return { displayText: formatNumber(numericValue, effectiveFormat).text, isNumber: true };
}
