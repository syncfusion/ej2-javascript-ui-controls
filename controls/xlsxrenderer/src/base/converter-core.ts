import { isNullOrUndefined } from '@syncfusion/ej2-base';
import {
    PdfDocument, PdfPage, PdfGraphics, PdfTemplate, PdfPen, PdfBrush,
    PdfFont, PdfStandardFont, PdfFontFamily, PdfFontStyle, PdfStringFormat, PdfTextAlignment,
    PdfVerticalAlignment, _PdfWordWrapType, PdfPageOrientation,
    Size, Rectangle, PdfBitmap, PdfPageSettings, PdfMargins
} from '@syncfusion/ej2-pdf';

import {
    LayoutOptions, ExcelOrder, ExcelHAlign, ExcelVAlign, ExcelLineStyle, ExcelPattern,
    CellType, WarningType, GridLinesDisplayStyle, Rgba, IBorders, ICellStyle, ICell,
    IMergedRegion, IPicture, IChart, IPageSetup, IWorksheet, IWorkbook,
    ExcelToPdfConverterSettings, defaultSettings, ExcelToPdfConverterException,
    ExcelPrintLocation, ExcelFormControlType, ExcelShapeType, IDrawingShape,
    normalizeColor, toPdfColor, sanitizeTextForFont, measurePdfText,
    decodeImageBytes, isJpegBytes, isPngBytes, RangeParser, UnitConverter,
    ISortedCommentItem, IHeaderFooterPageGroup
} from '../common/index';
import {
    ItemSizeHelper, pxToPt, PageSetupOption, IPageSetupHost, PageBreaker,
    ExcelToPdfCoreLayoutSetting as ExcelToPdfLayoutSetting,
    ILayoutHost, ICorePdfSectionLike as IPdfSectionLike, getExcelSheetSize
} from '../layout/index';
import {
    BorderRenderer, CfRenderer, ChartRenderer,
    CommentRenderer, HeaderFooterRenderer,
    RichTextRenderer, ShapeRenderer
} from '../renderer/index';

const NEW_LINE: string = '\n';
const CARRIAGE_RETURN: string = '\r';
const TEXT_NUMBER_FORMAT: string = '@';
const BLACK: Rgba = { r: 0, g: 0, b: 0, a: 255 };

class SplitText {
    text: string = ''; font!: PdfFont; brush!: PdfBrush; format!: PdfStringFormat;
    originRect!: Rectangle; row: number = 0; adjacentColumn: number = 0; pageTemplate!: PdfTemplate;
}

/**
 * Core conversion pipeline executing workbook layout calculation, page pagination,
 * cell formatting, vector AutoShape rendering, charts, and PDF document generation.
 */
export class ExcelToPdfConverterCore {
    private workBook: IWorkbook;
    private workSheet!: IWorksheet;
    private settings: ExcelToPdfConverterSettings;
    private effectiveLayoutOptions: LayoutOptions;
    private pdfDocument!: PdfDocument;
    private currentPage!: PdfPage;
    private pdfPageTemplate!: PdfTemplate;
    private pdfGraphics!: PdfGraphics;
    private pdfTemplateCollection: PdfTemplate[] = [];
    private pageCollection: PdfPage[] = [];
    private pageSetup!: IPageSetup;
    private mergedRegions: Map<number, { first: boolean; rowSpan: number; colSpan: number; firstKey: number }> = new Map();
    private columnWidthGetter!: ItemSizeHelper;
    private rowHeightGetter!: ItemSizeHelper;
    private splitTexts: SplitText[] = [];
    private sheetUsedRange!: IMergedRegion;
    private leftMargin: number = 0; private rightMargin: number = 0; private topMargin: number = 0; private bottomMargin: number = 0;
    private sheetWidth: number = 0; private sheetHeight: number = 0;
    private scaledPageWidth: number = 0; private scaledPageHeight: number = 0;
    private isNewPage: boolean = false; private isCancelled: boolean = false;
    private isPrintTitleRowPage: boolean = false; private isPrintTitleColumnPage: boolean = false;
    private titleRowHeight: number = 0; private titleColumnWidth: number = 0;
    private printTitleRows: { first: number; last: number } | undefined;
    private printTitleColumns: { first: number; last: number } | undefined;
    private fontCache: Map<string, PdfFont> = new Map();
    private hasContent: boolean = true;
    private isFirstRowOfPage: boolean = true; private isFirstColumnOfPage: boolean = true;
    private pageHeaderFooter: IHeaderFooterPageGroup[] = [];
    private pageSetupOption!: PageSetupOption;
    private PageBreaker!: PageBreaker;

    constructor(workbook: IWorkbook, settings?: Partial<ExcelToPdfConverterSettings>) {
        this.workBook = workbook;
        const defaults: ExcelToPdfConverterSettings = defaultSettings();
        this.settings = Object.assign({}, defaults, settings);
        this.effectiveLayoutOptions = this.settings.layoutOptions;
    }

    public convert(): PdfDocument | null {
        this.convertDocument();
        return this.isCancelled ? null : this.pdfDocument;
    }

    public static getLayoutOptions(pageSetup: IPageSetup): LayoutOptions {
        if (!pageSetup.isFitToPage) { return pageSetup.zoom === 100 ? LayoutOptions.NoScaling : LayoutOptions.CustomScaling; }
        if (pageSetup.fitToPagesWide === 1 && pageSetup.fitToPagesTall === 1) { return LayoutOptions.FitSheetOnOnePage; }
        if (pageSetup.fitToPagesWide === 1 && pageSetup.fitToPagesTall === 0) { return LayoutOptions.FitAllColumnsOnOnePage; }
        if (pageSetup.fitToPagesWide === 0 && pageSetup.fitToPagesTall === 1) { return LayoutOptions.FitAllRowsOnOnePage; }
        return LayoutOptions.CustomScaling;
    }

    private getEffectiveSettings(): ExcelToPdfConverterSettings {
        if (this.effectiveLayoutOptions === this.settings.layoutOptions) {
            return this.settings;
        }
        return Object.assign({}, this.settings, { layoutOptions: this.effectiveLayoutOptions });
    }

    private convertDocument(): void {
        const layoutOptions: LayoutOptions = this.settings.layoutOptions;
        this.pdfDocument = new PdfDocument();
        const sheets: IWorksheet[] = this.workBook.worksheets;
        const sheetsCount: number = sheets.length;
        const ordered: IWorksheet[] = sheets.slice().sort(
            (firstSheet: IWorksheet, secondSheet: IWorksheet) => firstSheet.tabIndex - secondSheet.tabIndex
        );
        for (let sheetIndex: number = 0; sheetIndex < ordered.length; sheetIndex++) {
            const currentWorkSheet: IWorksheet = ordered[sheetIndex as number];
            this.workSheet = currentWorkSheet;
            this.drawWorkSheet(this.workSheet, sheetsCount, layoutOptions);
            if (this.isCancelled) { return; }
        }
        const rawTitle: string = this.workBook.title || '';
        const resolvedTitle: string = this.settings.showFileNameWithExtension
            ? rawTitle
            : rawTitle.replace(/\.[^/.]+$/, '');
        HeaderFooterRenderer.drawAllHeaderFooters(
            this.pdfDocument,
            this.pageCollection,
            this.pageHeaderFooter,
            this.settings.showHeader,
            this.settings.showFooter,
            resolvedTitle
        );
        if (this.settings.exportDocumentProperties) { this.setDocumentProperties(); }
    }

    private raiseWarning(description: string, type: WarningType): void {
        if (this.settings.onWarning && this.settings.onWarning(type, description) === true) { this.isCancelled = true; }
    }

    private drawWorkSheet(worksheet: IWorksheet, sheetsCount: number, layoutOptions: LayoutOptions): void {
        const hasPrintArea: boolean = !isNullOrUndefined(worksheet.pageSetup.printArea) && worksheet.pageSetup.printArea.length > 0;
        this.sheetUsedRange = hasPrintArea
            ? worksheet.usedRange
            : this.getActualUsedRange(worksheet, worksheet.usedRange, true, true, false);
        this.buildMergedRegions(worksheet);
        this.columnWidthGetter = null as unknown as ItemSizeHelper;
        this.rowHeightGetter = null as unknown as ItemSizeHelper;
        this.ensureSizeGetters();
        this.pageSetupOption = new PageSetupOption(worksheet, this.sheetUsedRange, this.createPageSetupHost());
        this.PageBreaker = new PageBreaker(this.pageSetupOption);
        this.isNewPage = false; this.splitTexts = [];
        const skip: boolean = this.settings.onSheetBeforeDrawn ? this.settings.onSheetBeforeDrawn(worksheet.index) === true : false;
        if (skip) { return; }
        if (this.settings.onProgress) { this.settings.onProgress(sheetsCount, worksheet.index); }
        const usedRange: IMergedRegion = this.sheetUsedRange;
        const hasData: boolean = !worksheet.isEmpty && (usedRange.lastRow > 0 || usedRange.lastColumn > 0);
        const canRenderVisibility: boolean = worksheet.visible || this.settings.includeHiddenSheets === true;
        const hasCharts: boolean = !isNullOrUndefined(worksheet.charts) && worksheet.charts.length > 0;
        const hasRenderableContent: boolean = hasData || worksheet.pictures.length > 0 ||
            hasCharts || this.settings.isConvertBlankSheet;
        if (canRenderVisibility && hasRenderableContent) {
            this.hasContent = false;
            this.pdfTemplateCollection = [];
            this.effectiveLayoutOptions = layoutOptions === LayoutOptions.Automatic
                ? ExcelToPdfConverterCore.getLayoutOptions(worksheet.pageSetup)
                : layoutOptions;
            const printAreaList: IMergedRegion[] = worksheet.pageSetup.printArea || [];
            const areas: IMergedRegion[] = this.pageSetupOption.hasPrintArea
                ? this.pageSetupOption.printAreas
                : (hasPrintArea ? printAreaList : [usedRange]);
            this.drawSheet(worksheet, areas);
            if (worksheet.pageSetup.printComments === ExcelPrintLocation.PrintSheetEnd) {
                this.drawCommentsAtSheetEnd(worksheet);
            }
        } else if (this.settings.throwWhenExcelFileIsEmpty) {
            if (canRenderVisibility && this.hasContent) {
                const emptyDocMsg: string = 'The Empty Excel Document cannot be converted to an PDF document. ' +
                    'You can disable this exception by using Boolean ThrowWhenExcelFileIsEmpty property to True or False.';
                throw new ExcelToPdfConverterException(emptyDocMsg);
            }
        }
        if (this.settings.onSheetAfterDrawn) { this.settings.onSheetAfterDrawn(worksheet.index); }
        this.mergedRegions.clear();
    }

    private ensureSizeGetters(): void {
        const worksheet: IWorksheet = this.workSheet;
        this.columnWidthGetter = new ItemSizeHelper((columnIndex: number) => worksheet.getColumnWidthPx(columnIndex));
        this.rowHeightGetter = new ItemSizeHelper((rowIndex: number) => worksheet.getRowHeightPx(rowIndex));
    }

    private cellKey(column: number, row: number): number { return row * 16384 * 4 + column; }

    private buildMergedRegions(worksheet: IWorksheet): void {
        this.mergedRegions.clear();
        for (const mergedRegion of worksheet.mergedRegions) {
            const firstKey: number = this.cellKey(mergedRegion.firstColumn, mergedRegion.firstRow);
            for (let rowIndex: number = mergedRegion.firstRow; rowIndex <= mergedRegion.lastRow; rowIndex++) {
                for (let colIndex: number = mergedRegion.firstColumn; colIndex <= mergedRegion.lastColumn; colIndex++) {
                    this.mergedRegions.set(this.cellKey(colIndex, rowIndex), {
                        first: rowIndex === mergedRegion.firstRow && colIndex === mergedRegion.firstColumn,
                        rowSpan: mergedRegion.lastRow - mergedRegion.firstRow + 1,
                        colSpan: mergedRegion.lastColumn - mergedRegion.firstColumn + 1,
                        firstKey
                    });
                }
            }
        }
    }
    private isMerged(cell: ICell): boolean { return this.mergedRegions.has(this.cellKey(cell.column, cell.row)); }
    private checkMergedRegion(region: IMergedRegion): boolean {
        if (this.mergedRegions.size === 0) { return false; }
        for (let rowIndex: number = region.firstRow; rowIndex <= region.lastRow; rowIndex++) {
            for (let colIndex: number = region.firstColumn; colIndex <= region.lastColumn; colIndex++) {
                if (this.mergedRegions.has(this.cellKey(colIndex, rowIndex))) { return true; }
            }
        }
        return false;
    }

    private requiredWidth(excelSheetWidth: number, sheetHeight: number, excelSheetHeight: number): number {
        return excelSheetHeight > 0 ? (excelSheetWidth * sheetHeight) / excelSheetHeight : excelSheetWidth;
    }

    private requiredHeight(excelSheetWidth: number, sheetWidth: number, excelSheetHeight: number): number {
        return excelSheetWidth > 0 ? (excelSheetHeight * sheetWidth) / excelSheetWidth : excelSheetHeight;
    }

    private createPageSetupHost(): IPageSetupHost {
        return {
            maxRowCount: this.workBook.maxRowCount,
            maxColumnCount: this.workBook.maxColumnCount,
            getActualUsedRange: (sheet: IWorksheet, range: IMergedRegion, checkRow: boolean, checkColumn: boolean, isPrintArea: boolean) =>
                this.getActualUsedRange(sheet, range, checkRow, checkColumn, isPrintArea)
        };
    }

    private createLayoutHost(): ILayoutHost {
        return {
            topMargin: this.topMargin,
            bottomMargin: this.bottomMargin,
            leftMargin: this.leftMargin,
            rightMargin: this.rightMargin,
            sheetWidth: this.sheetWidth,
            sheetHeight: this.sheetHeight,
            pageSetupOption: this.pageSetupOption,
            customPaperSize: this.settings.customPaperSize,
            requiredWidth: (excelSheetWidth: number, sheetHeight: number, excelSheetHeight: number) =>
                this.requiredWidth(excelSheetWidth, sheetHeight, excelSheetHeight),
            requiredHeight: (excelSheetWidth: number, sheetWidth: number, excelSheetHeight: number) =>
                this.requiredHeight(excelSheetWidth, sheetWidth, excelSheetHeight)
        };
    }

    private get hostSheetWidth(): number {
        return this.sheetWidth;
    }

    private set hostSheetWidth(value: number) {
        this.sheetWidth = value;
    }

    private get hostSheetHeight(): number {
        return this.sheetHeight;
    }

    private set hostSheetHeight(value: number) {
        this.sheetHeight = value;
    }

    private getActualUsedRange(
        worksheet: IWorksheet,
        usedRange: IMergedRegion,
        checkRow: boolean,
        checkColumn: boolean,
        _isPrintArea: boolean = false
    ): IMergedRegion {
        void _isPrintArea;
        let lastRow: number = usedRange.lastRow;
        let lastColumn: number = usedRange.lastColumn;
        if (checkRow) {
            let foundRow: number = -1;
            for (let rowIndex: number = usedRange.lastRow; rowIndex >= usedRange.firstRow && foundRow < 0; rowIndex--) {
                if (!worksheet.isRowVisible(rowIndex)) { continue; }
                for (let colIndex: number = usedRange.firstColumn; colIndex <= usedRange.lastColumn; colIndex++) {
                    if (worksheet.isColumnVisible(colIndex)) {
                        const cell: ICell = worksheet.getCell(rowIndex, colIndex);
                        if (cell.cellType !== CellType.Blank || this.cellHasVisibleFormat(cell)) { foundRow = rowIndex; break; }
                    }
                }
            }
            if (foundRow > 0) { lastRow = foundRow; }
        }
        if (checkColumn) {
            let foundCol: number = -1;
            for (let colIndex: number = usedRange.firstColumn; colIndex <= usedRange.lastColumn; colIndex++) {
                for (let rowIndex: number = usedRange.firstRow; rowIndex <= lastRow; rowIndex++) {
                    if (worksheet.isRowVisible(rowIndex) && worksheet.isColumnVisible(colIndex)) {
                        const cell: ICell = worksheet.getCell(rowIndex, colIndex);
                        if (cell.cellType !== CellType.Blank || this.cellHasVisibleFormat(cell)) { foundCol = colIndex; break; }
                    }
                }
            }
            if (foundCol > 0) { lastColumn = foundCol; }
        }
        for (const mergedRegion of worksheet.mergedRegions) {
            lastRow = Math.max(lastRow, mergedRegion.lastRow);
            lastColumn = Math.max(lastColumn, mergedRegion.lastColumn);
        }
        for (const picture of worksheet.pictures) {
            if (picture.bottomRow && picture.bottomRow > 0 && picture.bottomRow <= 1048576) {
                lastRow = Math.max(lastRow, picture.bottomRow);
            }
            if (picture.rightColumn && picture.rightColumn > 0 && picture.rightColumn <= 16384) {
                lastColumn = Math.max(lastColumn, picture.rightColumn);
            }
        }
        if (worksheet.charts && worksheet.charts.length > 0) {
            for (const chart of worksheet.charts) {
                if (chart.bottomRow && chart.bottomRow > 0 && chart.bottomRow <= 1048576) {
                    lastRow = Math.max(lastRow, chart.bottomRow);
                }
                if (chart.rightColumn && chart.rightColumn > 0 && chart.rightColumn <= 16384) {
                    lastColumn = Math.max(lastColumn, chart.rightColumn);
                }
            }
        }
        if (worksheet.shapes && worksheet.shapes.length > 0) {
            for (const shp of worksheet.shapes) {
                if (shp.bottomRow && shp.bottomRow > 0 && shp.bottomRow <= 1048576) {
                    lastRow = Math.max(lastRow, shp.bottomRow);
                }
                if (shp.rightColumn && shp.rightColumn > 0 && shp.rightColumn <= 16384) {
                    lastColumn = Math.max(lastColumn, shp.rightColumn);
                }
            }
        }
        return { firstRow: usedRange.firstRow, firstColumn: usedRange.firstColumn, lastRow, lastColumn };
    }

    private hasVisibleStyle(worksheet: IWorksheet, region: IMergedRegion): boolean {
        for (let rowIndex: number = region.firstRow; rowIndex <= region.lastRow; rowIndex++) {
            if (rowIndex > 0 && worksheet.isRowVisible(rowIndex)) {
                for (let colIndex: number = region.firstColumn; colIndex <= region.lastColumn; colIndex++) {
                    if (colIndex > 0 && worksheet.isColumnVisible(colIndex)) {
                        const cell: ICell = worksheet.getCell(rowIndex, colIndex);
                        if (cell.cellType !== CellType.Blank || this.cellHasVisibleFormat(cell)) { return true; }
                    }
                }
            }
        }
        return false;
    }
    private cellHasVisibleFormat(cell: ICell): boolean {
        const cellStyle: ICellStyle = cell.style;
        const hasCommentOrCf: boolean = !isNullOrUndefined(cell.comment) ||
            !isNullOrUndefined(cell.dataBar) || !isNullOrUndefined(cell.iconSet);
        const hasBorderOrPattern: boolean = BorderRenderer.checkCellBorderStyle(cellStyle.borders) ||
            (cellStyle.fillPattern !== ExcelPattern.None);
        const isWhiteFill: boolean = cellStyle.fillColor.r === 255 &&
            cellStyle.fillColor.g === 255 && cellStyle.fillColor.b === 255;
        const hasColoredFill: boolean = cellStyle.fillColor.a !== 0 && !isWhiteFill;
        return hasCommentOrCf || hasBorderOrPattern || hasColoredFill;
    }

    private canDrawShape(range: IMergedRegion): boolean {
        for (const picture of this.workSheet.pictures) {
            const hasDimensions: boolean = picture.height > 0 || picture.width > 0;
            if (hasDimensions && this.canDrawShapeIn(range.firstRow, range.lastRow, range.firstColumn, range.lastColumn, picture).draw) {
                return true;
            }
        }
        if (this.workSheet.charts && this.workSheet.charts.length > 0) {
            for (const chart of this.workSheet.charts) {
                const shapeLikeChart: IPicture = chart as unknown as IPicture;
                const hasDimensions: boolean = chart.height > 0 || chart.width > 0;
                if (hasDimensions && this.canDrawShapeIn(
                    range.firstRow, range.lastRow, range.firstColumn, range.lastColumn, shapeLikeChart
                ).draw) {
                    return true;
                }
            }
        }
        if (this.workSheet.shapes && this.workSheet.shapes.length > 0) {
            for (const shp of this.workSheet.shapes) {
                const shapeLikePic: IPicture = shp as unknown as IPicture;
                const hasDimensions: boolean = shp.height > 0 || shp.width > 0;
                if (hasDimensions && this.canDrawShapeIn(
                    range.firstRow, range.lastRow, range.firstColumn, range.lastColumn, shapeLikePic
                ).draw) {
                    return true;
                }
            }
        }
        return false;
    }

    private canDrawShapeIn(
        firstRow: number,
        lastRow: number,
        firstColumn: number,
        lastColumn: number,
        shape: IPicture
    ): { draw: boolean; inBetween: boolean } {
        const isInRow: boolean = (firstRow <= shape.topRow && lastRow >= shape.topRow) ||
            (firstRow <= shape.bottomRow && lastRow >= shape.bottomRow);
        const inBetweenRow: boolean = firstRow > shape.topRow && shape.bottomRow > lastRow;
        const isInColumn: boolean = (firstColumn <= shape.leftColumn && lastColumn >= shape.leftColumn) ||
            (firstColumn <= shape.rightColumn && lastColumn >= shape.rightColumn);
        const inBetweenColumn: boolean = firstColumn > shape.leftColumn && shape.rightColumn > lastColumn;
        const inBetween: boolean = (inBetweenColumn && isInRow) || (inBetweenRow && isInColumn) || (inBetweenColumn && inBetweenRow);
        if (inBetween) {
            return { draw: true, inBetween };
        }
        return { draw: (isInColumn && isInRow), inBetween };
    }

    private addPage(pageSetup: IPageSetup): PdfPage {
        const pageSettings: PdfPageSettings = new PdfPageSettings();
        pageSettings.orientation = pageSetup.orientation === 'Portrait' ? PdfPageOrientation.portrait : PdfPageOrientation.landscape;
        pageSettings.size = (!isNullOrUndefined(pageSetup.paperSize) || !isNullOrUndefined(this.settings.customPaperSize))
            ? getExcelSheetSize(pageSetup.paperSize, this.settings.customPaperSize)
            : { width: pageSetup.paperWidth, height: pageSetup.paperHeight };
        const margins: PdfMargins = new PdfMargins();
        margins.left = this.leftMargin;
        margins.right = this.rightMargin;
        margins.top = this.topMargin;
        margins.bottom = this.bottomMargin;
        pageSettings.margins = margins;
        const page: PdfPage = this.pdfDocument.addPage(pageSettings);
        this.pageCollection.push(page);
        return page;
    }

    private drawTemplateOnPage(page: PdfPage, template: PdfTemplate, xPos: number, yPos: number, width: number, height: number): void {
        page.graphics.drawTemplate(template, { x: xPos, y: yPos, width: width, height: height });
    }

    private getPdfFont(style: ICellStyle): PdfFont {
        const key: string = [style.fontName, style.fontSize, style.bold, style.italic, style.underline, style.strikeout].join('|');
        const cachedFont: PdfFont | undefined = this.fontCache.get(key);
        if (cachedFont) { return cachedFont; }
        let resolved: PdfFont | null = this.settings.fontResolver
            ? this.settings.fontResolver(style.fontName, style.fontSize, style.bold, style.italic)
            : null;
        if (!resolved) {
            let fontStyle: PdfFontStyle = PdfFontStyle.regular;
            if (style.bold && style.italic) { fontStyle = PdfFontStyle.bold | PdfFontStyle.italic; }
            else if (style.bold) { fontStyle = PdfFontStyle.bold; }
            else if (style.italic) { fontStyle = PdfFontStyle.italic; }
            if (style.underline) { fontStyle = fontStyle | PdfFontStyle.underline; }
            if (style.strikeout) { fontStyle = fontStyle | PdfFontStyle.strikeout; }
            const lowerFontName: string = style.fontName.toLowerCase();
            const fontFamily: PdfFontFamily = lowerFontName.indexOf('times') >= 0
                ? PdfFontFamily.timesRoman
                : lowerFontName.indexOf('courier') >= 0 ? PdfFontFamily.courier : PdfFontFamily.helvetica;
            resolved = this.pdfDocument.embedFont(fontFamily, style.fontSize, fontStyle);
        }
        this.fontCache.set(key, resolved);
        return resolved;
    }

    private drawSheet(worksheet: IWorksheet, printAreas: IMergedRegion[]): void {
        const pageSetup: IPageSetup = worksheet.pageSetup;
        this.pageSetup = pageSetup;
        this.pdfTemplateCollection = [];

        this.leftMargin = UnitConverter.resolveMarginPoints(pageSetup.leftMargin);
        this.rightMargin = UnitConverter.resolveMarginPoints(pageSetup.rightMargin);
        this.topMargin = UnitConverter.resolveMarginPoints(pageSetup.topMargin);
        this.bottomMargin = UnitConverter.resolveMarginPoints(pageSetup.bottomMargin);

        const sheetPageStartIndex: number = this.pageCollection.length;
        for (const shapeName of worksheet.unsupportedShapeNames) {
            const warningMsg: string = 'Shape : "' + shapeName + '" in the worksheet "' +
                worksheet.name + '" is not supported';
            this.raiseWarning(warningMsg, WarningType.DrawingObjects);
        }

        if (!(pageSetup.printArea && pageSetup.printArea.length) && this.splitTexts.length === 0) {
            let removeCount: number = 0;
            for (let areaIndex: number = printAreas.length - 1; areaIndex >= 0; areaIndex--) {
                const areaList: IMergedRegion[] = printAreas;
                const area: IMergedRegion = areaList[areaIndex as number];
                const canDraw: boolean = this.canDrawShape(area) || this.checkMergedRegion(area) ||
                    this.hasVisibleStyle(worksheet, area);
                if (canDraw) { break; }
                removeCount++;
            }
            if (removeCount !== 0 && removeCount < printAreas.length) { printAreas = printAreas.slice(0, printAreas.length - removeCount); }
        }

        this.printTitleRows = this.pageSetupOption.hasPrintTitleRows
            ? { first: this.pageSetupOption.printTitleFirstRow, last: this.pageSetupOption.printTitleLastRow }
            : pageSetup.printTitleRows;
        this.printTitleColumns = this.pageSetupOption.hasPrintTitleColumns
            ? { first: this.pageSetupOption.printTitleFirstColumn, last: this.pageSetupOption.printTitleLastColumn }
            : pageSetup.printTitleColumns;
        this.titleRowHeight = this.pageSetupOption.hasPrintTitleRows
            ? this.pageSetupOption.titleRowHeight
            : (this.printTitleRows ? pxToPt(this.rowHeightGetter.getTotal(this.printTitleRows.first, this.printTitleRows.last)) : 0);
        this.titleColumnWidth = this.pageSetupOption.hasPrintTitleColumns
            ? this.pageSetupOption.titleColumnWidth
            : (this.printTitleColumns
                ? pxToPt(this.columnWidthGetter.getTotal(this.printTitleColumns.first, this.printTitleColumns.last))
                : 0);

        const layoutHost: ILayoutHost = this.createLayoutHost();
        const layoutSetting: ExcelToPdfLayoutSetting = new ExcelToPdfLayoutSetting(layoutHost);
        const paperDims: { width: number; height: number } =
            (!isNullOrUndefined(pageSetup.paperSize) || !isNullOrUndefined(this.settings.customPaperSize))
                ? getExcelSheetSize(pageSetup.paperSize, this.settings.customPaperSize)
                : { width: pageSetup.paperWidth, height: pageSetup.paperHeight };
        const isLandscape: boolean = pageSetup.orientation === 'Landscape';
        const pdfSection: IPdfSectionLike = {
            pageSettings: {
                size: paperDims,
                orientation: isLandscape ? PdfPageOrientation.landscape : PdfPageOrientation.portrait,
                width: isLandscape ? Math.max(paperDims.width, paperDims.height) : Math.min(paperDims.width, paperDims.height),
                height: isLandscape ? Math.min(paperDims.width, paperDims.height) : Math.max(paperDims.width, paperDims.height)
            }
        };
        for (const range of printAreas) {
            let sheetFirstRow: number = range.firstRow; let sheetFirstColumn: number = range.firstColumn;
            const sheetLastRow: number = range.lastRow; const sheetLastColumn: number = range.lastColumn;
            const hasBreaks: boolean = pageSetup.rowBreaks.length > 0 || pageSetup.columnBreaks.length > 0;
            if (!hasBreaks && !(pageSetup.printArea && pageSetup.printArea.length)) { sheetFirstColumn = 1; sheetFirstRow = 1; }

            const widthValue: number = pxToPt(this.columnWidthGetter.getTotal(sheetFirstColumn, sheetLastColumn));
            const heightValue: number = pxToPt(this.rowHeightGetter.getTotal(sheetFirstRow, sheetLastRow));
            let usedRangeWidth: number = widthValue; let usedRangeHeight: number = heightValue;
            let rows: number[] = []; let columns: number[] = [];
            let rowCount: number = 0; let columnCount: number = 0;
            this.sheetHeight = 0; this.sheetWidth = 0;
            const effectiveOptions: LayoutOptions = this.effectiveLayoutOptions;
            const effectiveSettings: ExcelToPdfConverterSettings = this.getEffectiveSettings();
            const headerOffsetLeft: number = effectiveSettings.renderHeadings ? 24 : 0;
            const headerOffsetTop: number = effectiveSettings.renderHeadings ? 16 : 0;
            const availH: number = pdfSection.pageSettings.height - (this.topMargin + this.bottomMargin) - headerOffsetTop;
            const availW: number = pdfSection.pageSettings.width - (this.leftMargin + this.rightMargin) - headerOffsetLeft;
            switch (effectiveOptions) {
            case LayoutOptions.FitSheetOnOnePage: {
                layoutSetting.fitSheetOnPage(pdfSection, pageSetup, usedRangeWidth, usedRangeHeight);
                this.sheetHeight = layoutHost.sheetHeight;
                this.sheetWidth = layoutHost.sheetWidth;
                rows = [sheetFirstRow, sheetLastRow];
                columns = [sheetFirstColumn, sheetLastColumn];
                rowCount = 1;
                columnCount = 1;
                break;
            }
            case LayoutOptions.FitAllColumnsOnOnePage: {
                layoutSetting.fitAllColumnOnOnePage(pdfSection, pageSetup, usedRangeWidth);
                this.sheetHeight = layoutHost.sheetHeight;
                this.sheetWidth = layoutHost.sheetWidth;
                columns = [sheetFirstColumn, sheetLastColumn];
                columnCount = 1;
                const rowBreak: { result: Int32Array; rowStartIndex: number } = this.PageBreaker.rowBreaker(
                    sheetFirstRow, sheetLastRow, this.sheetHeight, this.rowHeightGetter, effectiveSettings
                );
                rows = Array.from(rowBreak.result.slice(0, rowBreak.rowStartIndex + 1));
                rows[rowBreak.rowStartIndex as number] = sheetLastRow;
                rowCount = rowBreak.rowStartIndex;
                break;
            }
            case LayoutOptions.FitAllRowsOnOnePage: {
                layoutSetting.fitAllRowsOnOnePage(pdfSection, pageSetup, usedRangeHeight);
                this.sheetHeight = layoutHost.sheetHeight;
                this.sheetWidth = layoutHost.sheetWidth;
                rows = [sheetFirstRow, sheetLastRow];
                rowCount = 1;
                const colBreak: { result: Int32Array; columnStartIndex: number } = this.PageBreaker.columnBreaker(
                    sheetFirstColumn, sheetLastColumn, this.sheetWidth, this.columnWidthGetter, effectiveSettings
                );
                columns = Array.from(colBreak.result.slice(0, colBreak.columnStartIndex + 1));
                columns[colBreak.columnStartIndex as number] = sheetLastColumn;
                columnCount = colBreak.columnStartIndex;
                break;
            }
            case LayoutOptions.CustomScaling: {
                layoutSetting.customScaling(pdfSection, pageSetup, usedRangeWidth, usedRangeHeight);
                this.sheetHeight = layoutHost.sheetHeight;
                this.sheetWidth = layoutHost.sheetWidth;
                const rowBreak: { result: Int32Array; rowStartIndex: number } = this.PageBreaker.rowBreaker(
                    sheetFirstRow, sheetLastRow, this.sheetHeight, this.rowHeightGetter, effectiveSettings
                );
                rows = Array.from(rowBreak.result.slice(0, rowBreak.rowStartIndex + 1));
                rows[rowBreak.rowStartIndex as number] = sheetLastRow;
                rowCount = rowBreak.rowStartIndex;
                const colBreak: { result: Int32Array; columnStartIndex: number } = this.PageBreaker.columnBreaker(
                    sheetFirstColumn, sheetLastColumn, this.sheetWidth, this.columnWidthGetter, effectiveSettings
                );
                columns = Array.from(colBreak.result.slice(0, colBreak.columnStartIndex + 1));
                columns[colBreak.columnStartIndex as number] = sheetLastColumn;
                columnCount = colBreak.columnStartIndex;
                break;
            }
            default: {
                layoutSetting.noScaling(pdfSection, pageSetup);
                this.sheetHeight = availH > 0 ? availH : (layoutHost.sheetHeight - headerOffsetTop);
                this.sheetWidth = availW > 0 ? availW : (layoutHost.sheetWidth - headerOffsetLeft);
                const rowBreak: { result: Int32Array; rowStartIndex: number } = this.PageBreaker.rowBreaker(
                    sheetFirstRow, sheetLastRow, this.sheetHeight, this.rowHeightGetter, effectiveSettings
                );
                rows = Array.from(rowBreak.result.slice(0, rowBreak.rowStartIndex + 1));
                rows[rowBreak.rowStartIndex as number] = sheetLastRow;
                rowCount = rowBreak.rowStartIndex;
                const colBreak: { result: Int32Array; columnStartIndex: number } = this.PageBreaker.columnBreaker(
                    sheetFirstColumn, sheetLastColumn, this.sheetWidth, this.columnWidthGetter, effectiveSettings
                );
                columns = Array.from(colBreak.result.slice(0, colBreak.columnStartIndex + 1));
                columns[colBreak.columnStartIndex as number] = sheetLastColumn;
                columnCount = colBreak.columnStartIndex;
                break;
            }
            }

            if (this.sheetHeight <= 0) {
                this.sheetHeight = availH > 0 ? availH : 792;
            }
            if (this.sheetWidth <= 0) {
                this.sheetWidth = availW > 0 ? availW : 612;
            }

            const originalSheetWidth: number = this.sheetWidth;
            const originalSheetHeight: number = this.sheetHeight;
            const visit: (
                firstCol: number, lastCol: number, firstR: number, lastR: number, rIdx: number, cIdx: number
            ) => void = (
                firstColumn: number, lastColumn: number, firstRow: number, lastRow: number, rowIdx: number, colIdx: number
            ): void => {
                this.isPrintTitleRowPage = this.pageSetupOption.rowIndexList.indexOf(rowIdx) >= 0;
                this.isPrintTitleColumnPage = this.pageSetupOption.columnIndexList.indexOf(colIdx) >= 0 ||
                    (effectiveOptions === LayoutOptions.FitAllColumnsOnOnePage && this.pageSetupOption.hasPrintTitleColumns);
                if (this.isPrintTitleColumnPage && this.printTitleColumns && this.sheetWidth > this.titleColumnWidth &&
                    firstColumn >= this.printTitleColumns.first && firstColumn <= this.printTitleColumns.last) {
                    firstColumn = this.printTitleColumns.last + 1;
                }
                this.updateSheetWidthHeight(firstColumn, firstRow);
                if (firstColumn > lastColumn) { return; }
                const pageRegion: IMergedRegion = { firstRow, firstColumn, lastRow, lastColumn };
                const hasShapesOrStyles: boolean = this.canDrawShape(pageRegion) ||
                    this.checkMergedRegion(pageRegion) || this.hasVisibleStyle(worksheet, pageRegion);
                const isBlank: boolean = !(this.checkSplitText(firstRow, lastRow) || hasShapesOrStyles);
                if (!isBlank || this.settings.isConvertBlankPage) {
                    if (effectiveOptions === LayoutOptions.CustomScaling && !pageSetup.isFitToPage) {
                        const values: number[] = this.PageBreaker.calculateFontValue(effectiveSettings);
                        const valW: number = values[0 as number];
                        const valH: number = values[1 as number];
                        this.pdfPageTemplate = new PdfTemplate({ width: this.sheetWidth / valW, height: this.sheetHeight / valH });
                        this.sheetWidth = this.pdfPageTemplate.size.width;
                        this.sheetHeight = this.pdfPageTemplate.size.height;
                    } else if (effectiveOptions === LayoutOptions.FitAllColumnsOnOnePage ||
                        effectiveOptions === LayoutOptions.FitAllRowsOnOnePage) {
                        this.pdfPageTemplate = new PdfTemplate({ width: this.sheetWidth + 3, height: this.sheetHeight + 3 });
                    } else {
                        this.pdfPageTemplate = new PdfTemplate({
                            width: this.sheetWidth + headerOffsetLeft,
                            height: this.sheetHeight + headerOffsetTop
                        });
                    }
                    this.pdfTemplateCollection.push(this.pdfPageTemplate);
                    this.initializePdfPage();
                    this.updateScaledPage(this.pdfPageTemplate, this.currentPage, pageSetup, usedRangeWidth, usedRangeHeight);
                    this.drawRow(worksheet, firstColumn, lastColumn, firstRow, lastRow, 0, 0, this.sheetWidth, isBlank);
                    const page: PdfPage = this.currentPage;
                    let startX: number = 0;
                    if (pageSetup.centerHorizontally) {
                        const width: number = page.size.width - (this.leftMargin + this.rightMargin);
                        if (this.scaledPageWidth <= width) {
                            startX = (width - this.scaledPageWidth) / 2;
                        }
                    }
                    this.drawTemplateOnPage(page, this.pdfPageTemplate, startX, 0, this.scaledPageWidth, this.scaledPageHeight);
                }
            };

            const colsList: number[] = columns;
            const rowsList: number[] = rows;
            if (pageSetup.order === ExcelOrder.DownThenOver) {
                let columnIndex: number = 0;
                const colVal: number = colsList[columnIndex as number];
                let firstColumn: number = colVal === 0 ? 1 : colVal;
                columnIndex++;
                let lastColumn: number = colsList[columnIndex as number];
                for (let column: number = 0; column < columnCount; column++) {
                    let rowIndex: number = 0;
                    let firstRow: number = rowsList[rowIndex as number];
                    rowIndex++;
                    let lastRow: number = rowsList[rowIndex as number];
                    for (let row: number = 0; row < rowCount; row++) {
                        visit(firstColumn, lastColumn, firstRow, lastRow, rowIndex, columnIndex);
                        rowIndex++;
                        firstRow = lastRow + 1;
                        lastRow = rowsList[rowIndex as number];
                        this.sheetHeight = originalSheetHeight;
                        this.sheetWidth = originalSheetWidth;
                    }
                    columnIndex++;
                    firstColumn = lastColumn + 1;
                    lastColumn = colsList[columnIndex as number];
                    this.sheetHeight = originalSheetHeight;
                    this.sheetWidth = originalSheetWidth;
                }
            } else {
                let rowIndex: number = 0;
                let firstRow: number = rowsList[rowIndex as number];
                rowIndex++;
                let lastRow: number = rowsList[rowIndex as number];
                for (let row: number = 0; row < rowCount; row++) {
                    let columnIndex: number = 0;
                    let firstColumn: number = colsList[columnIndex as number];
                    columnIndex++;
                    let lastColumn: number = colsList[columnIndex as number];
                    for (let column: number = 0; column < columnCount; column++) {
                        visit(firstColumn, lastColumn, firstRow, lastRow, rowIndex, columnIndex);
                        columnIndex++;
                        firstColumn = lastColumn + 1;
                        lastColumn = colsList[columnIndex as number];
                        this.sheetHeight = originalSheetHeight;
                        this.sheetWidth = originalSheetWidth;
                    }
                    rowIndex++;
                    firstRow = lastRow + 1;
                    lastRow = rowsList[rowIndex as number];
                    this.sheetHeight = originalSheetHeight;
                    this.sheetWidth = originalSheetWidth;
                }
            }
            usedRangeWidth = 0; usedRangeHeight = 0;
        }

        const addedPagesCount: number = this.pageCollection.length - sheetPageStartIndex;
        const hasHeaderOrFooter: boolean = Boolean(
            pageSetup.leftHeader || pageSetup.centerHeader ||
            pageSetup.rightHeader || pageSetup.leftFooter || pageSetup.centerFooter || pageSetup.rightFooter
        );
        if (hasHeaderOrFooter) {
            this.pageHeaderFooter.push({
                pageStartIndex: sheetPageStartIndex,
                pageCount: addedPagesCount,
                setup: pageSetup,
                sheetName: worksheet.name
            });
        }

        this.isPrintTitleRowPage = false; this.isPrintTitleColumnPage = false;
        if (this.splitTexts.length > 0 && this.splitTexts.some((splitItem: SplitText) => splitItem.text.trim().length > 0)) {
            this.drawSplitText();
        } else {
            this.splitTexts = [];
        }
    }

    private checkSplitText(firstRow: number, lastRow: number): boolean {
        return this.splitTexts.some((splitItem: SplitText) => {
            const inRowRange: boolean = splitItem.row >= firstRow && splitItem.row <= lastRow;
            return inRowRange && splitItem.adjacentColumn !== 0;
        });
    }

    private updateSheetWidthHeight(firstColumn: number, firstRow: number): void {
        switch (this.effectiveLayoutOptions) {
        case LayoutOptions.NoScaling:
        case LayoutOptions.FitAllColumnsOnOnePage:
        case LayoutOptions.FitAllRowsOnOnePage:
        case LayoutOptions.FitSheetOnOnePage: {
            const targetWidth: number = this.sheetWidth;
            const targetHeight: number = this.sheetHeight;
            const titleColWidth: number = this.isPrintTitleColumnPage ? this.titleColumnWidth : 0;
            const titleRowHeight: number = this.isPrintTitleRowPage ? this.titleRowHeight : 0;
            let colIndex: number = firstColumn;
            let rowIndex: number = firstRow;
            while (colIndex <= this.workBook.maxColumnCount &&
                targetWidth >= titleColWidth + pxToPt(this.columnWidthGetter.getTotal(firstColumn, colIndex))) {
                this.sheetWidth = titleColWidth + pxToPt(this.columnWidthGetter.getTotal(firstColumn, colIndex));
                colIndex++;
                if (colIndex - firstColumn > 2000) { break; }
            }
            while (rowIndex <= this.workBook.maxRowCount &&
                targetHeight >= titleRowHeight + pxToPt(this.rowHeightGetter.getTotal(firstRow, rowIndex))) {
                this.sheetHeight = titleRowHeight + pxToPt(this.rowHeightGetter.getTotal(firstRow, rowIndex));
                rowIndex++;
                if (rowIndex - firstRow > 5000) { break; }
            }
            this.sheetWidth += 1.5; this.sheetHeight += 1.5;
            break;
        }
        default: break;
        }
    }

    private initializePdfPage(): void {
        this.currentPage = this.addPage(this.pageSetup);
        if (this.pageCollection.length > 1) { this.isNewPage = true; }
        this.pdfGraphics = this.pdfPageTemplate ? this.pdfPageTemplate.graphics : this.currentPage.graphics;
    }

    private getScaledPage(originalWidth: number, originalHeight: number, maxWidth: number, maxHeight: number, fitPage: boolean): void {
        if (!fitPage) {
            if (originalWidth <= maxWidth) { maxWidth = originalWidth; }
            let newHeight: number = originalHeight * maxWidth / originalWidth;
            if (newHeight > maxHeight) { maxWidth = originalWidth * maxHeight / originalHeight; newHeight = maxHeight; }
            this.scaledPageWidth = maxWidth; this.scaledPageHeight = maxHeight; return;
        }
        let width: number = 0; let height: number = 0;
        const aspectRatio: number = originalWidth / originalHeight;
        if (maxHeight > 0 && maxWidth > 0) {
            if (originalWidth < maxWidth && originalHeight < maxHeight) { width = originalWidth; height = originalHeight; }
            else if (aspectRatio > 1) {
                width = maxWidth; height = width / aspectRatio;
                if (height > maxHeight) { height = maxHeight; width = height * aspectRatio; }
            } else {
                height = maxHeight;
                width = this.effectiveLayoutOptions === LayoutOptions.FitAllColumnsOnOnePage ? maxWidth : height * aspectRatio;
                if (width > maxWidth) { width = maxWidth; height = width / aspectRatio; }
            }
        } else if (maxHeight === 0 && originalWidth > maxWidth) {
            width = maxWidth; height = width / aspectRatio; width = Math.trunc(height * aspectRatio);
        } else if (maxWidth === 0 && originalHeight >= maxHeight) {
            height = maxHeight; width = height * aspectRatio;
        } else { width = originalWidth; height = originalHeight; }
        this.scaledPageWidth = width; this.scaledPageHeight = height;
    }

    private updateScaledPage(template: PdfTemplate, page: PdfPage, pageSetup: IPageSetup, usedWidth: number, usedHeight: number): void {
        const layoutOption: LayoutOptions = this.effectiveLayoutOptions;
        const pageSize: Size = page.size;
        const templateWidth: number = template.size.width;
        const templateHeight: number = template.size.height;
        const contentWidth: number = pageSize.width - (this.leftMargin + this.rightMargin);
        const contentHeight: number = pageSize.height - (this.topMargin + this.bottomMargin);
        if (layoutOption !== LayoutOptions.NoScaling && layoutOption !== LayoutOptions.CustomScaling) {
            this.getScaledPage(templateWidth, templateHeight, contentWidth, contentHeight, true);
        } else if (layoutOption === LayoutOptions.CustomScaling) {
            const hasSinglePageFit: boolean = (pageSetup.fitToPagesWide === 1 && pageSetup.fitToPagesTall === 0) ||
                (pageSetup.fitToPagesWide === 0 && pageSetup.fitToPagesTall === 1);
            const fitsInsideWidth: boolean = (usedWidth + (this.leftMargin + this.rightMargin)) <= pageSize.width;
            const fitsInsideHeight: boolean = (usedHeight + (this.topMargin + this.bottomMargin)) < pageSize.height;
            const fitsWithinOnePageWide: boolean = pageSetup.fitToPagesWide === 1 && (fitsInsideHeight || fitsInsideWidth);
            if (!pageSetup.isFitToPage) {
                this.scaledPageWidth = contentWidth;
                this.scaledPageHeight = contentHeight;
            } else if (hasSinglePageFit || fitsWithinOnePageWide) {
                this.getScaledPage(templateWidth, templateHeight, contentWidth, contentHeight, true);
            } else {
                this.getScaledPage(
                    templateWidth - (this.leftMargin + this.rightMargin), templateHeight, pageSize.width, contentHeight, true
                );
            }
        } else {
            this.scaledPageWidth = templateWidth > contentWidth ? contentWidth : templateWidth;
            this.scaledPageHeight = templateHeight > contentHeight ? contentHeight : templateHeight;
        }
    }

    private calculateCenterHorizontally(widthValue: number, pageSetup: IPageSetup): number {
        let startX: number = 0;
        if (pageSetup.centerHorizontally) {
            const pageWidth: number = this.currentPage.size.width;
            const availableWidth: number = pageWidth - (this.leftMargin + this.rightMargin);
            if (this.scaledPageWidth <= availableWidth) {
                startX += (availableWidth - this.scaledPageWidth) / 2;
                if (this.pdfPageTemplate.size.width > widthValue) {
                    startX += (this.scaledPageWidth - ((this.scaledPageWidth * widthValue) / this.pdfPageTemplate.size.width)) / 2;
                }
            } else {
                if (this.effectiveLayoutOptions === LayoutOptions.CustomScaling && !pageSetup.isFitToPage) {
                    widthValue = widthValue * pageSetup.zoom / 100;
                }
                if (widthValue < this.scaledPageWidth) {
                    const effectiveWidth: number = this.scaledPageWidth === pageWidth ? availableWidth : this.scaledPageWidth;
                    startX += (effectiveWidth - widthValue) / 2;
                }
            }
        }
        return startX;
    }

    private calculateCenterVertically(heightValue: number, pageSetup: IPageSetup): number {
        let startY: number = 0;
        if (pageSetup.centerVertically) {
            if (this.effectiveLayoutOptions === LayoutOptions.CustomScaling && !pageSetup.isFitToPage) {
                heightValue = heightValue * pageSetup.zoom / 100;
            }
            const pageHeight: number = this.currentPage.size.height;
            const availableHeight: number = pageHeight - (this.topMargin + this.bottomMargin);
            if (this.scaledPageHeight < availableHeight) {
                startY += (availableHeight - this.scaledPageHeight) / 2;
                if (this.pdfPageTemplate.size.height > heightValue) {
                    startY += (this.scaledPageHeight - ((this.scaledPageHeight * heightValue) / this.pdfPageTemplate.size.height)) / 2;
                }
            } else if (heightValue < this.scaledPageHeight) {
                const effectiveHeight: number = this.scaledPageHeight === pageHeight ? availableHeight : this.scaledPageHeight;
                startY += (effectiveHeight - heightValue) / 2;
            }
        }
        return startY;
    }

    private drawRow(
        worksheet: IWorksheet, startColumn: number, endColumn: number, startRow: number, endRow: number,
        xValue: number, yValue: number, originalWidth: number, _isBlank: boolean
    ): void {
        void _isBlank;
        const rangeHeight: number = pxToPt(this.rowHeightGetter.getTotal(startRow, endRow));
        let rangeWidth: number = pxToPt(this.columnWidthGetter.getTotal(startColumn, endColumn));
        if (rangeWidth > originalWidth) { rangeWidth = originalWidth; }
        const headingOffsetLeft: number = this.settings.renderHeadings ? 24 : 0;
        const headingOffsetTop: number = this.settings.renderHeadings ? 16 : 0;
        const startX: number = (this.pdfGraphics === this.currentPage.graphics
            ? this.calculateCenterHorizontally(rangeWidth, worksheet.pageSetup)
            : 0) + headingOffsetLeft;
        let startY: number = (this.pdfGraphics === this.currentPage.graphics
            ? this.calculateCenterVertically(rangeHeight, worksheet.pageSetup)
            : 0) + headingOffsetTop;
        const titleRowRange: { first: number; last: number } | undefined = this.printTitleRows;
        const titleColumnRange: { first: number; last: number } | undefined = this.printTitleColumns;
        if (this.isPrintTitleRowPage && titleRowRange) {
            this.drawRowCore(
                worksheet, startColumn, endColumn, titleRowRange.first, titleRowRange.last,
                xValue, yValue, originalWidth, startX, startY, rangeWidth, this.titleRowHeight
            );
            startY += this.titleRowHeight;
            if (titleRowRange.first === startRow) { startRow = startRow + titleRowRange.last; }
        }
        let runningStartX: number = startX;
        if (this.isPrintTitleColumnPage && titleColumnRange) {
            this.drawRowCore(
                worksheet, titleColumnRange.first, titleColumnRange.last, startRow, endRow,
                xValue, yValue, originalWidth, runningStartX, startY, this.titleColumnWidth, rangeHeight
            );
            runningStartX += this.titleColumnWidth;
            if (titleColumnRange.first === startColumn) { startColumn = startColumn + titleColumnRange.last; }
        }
        this.drawRowCore(
            worksheet, startColumn, endColumn, startRow, endRow,
            xValue, yValue, originalWidth, runningStartX, startY, rangeWidth, rangeHeight
        );
        this.isPrintTitleColumnPage = false; this.isPrintTitleRowPage = false;
    }

    private drawRowCore(
        worksheet: IWorksheet, startColIndex: number, endColIndex: number, startRowIndex: number, endRowIndex: number,
        _xValue: number, _yValue: number, originalWidth: number, startX: number, startY: number,
        rangeWidth: number, rangeHeight: number
    ): void {
        const graphics: PdfGraphics = this.pdfGraphics;
        this.drawCellsBackground(
            worksheet, startRowIndex, startColIndex, endRowIndex, endColIndex, graphics, originalWidth, startX, startY
        );
        if (worksheet.mergedRegions.length > 0) {
            this.drawMergeBackground(
                worksheet, startRowIndex, startColIndex, endRowIndex, endColIndex, graphics, originalWidth, startX, startY
            );
        }
        if ((this.settings.displayGridLines === GridLinesDisplayStyle.Auto && worksheet.pageSetup.printGridlines) ||
            this.settings.displayGridLines === GridLinesDisplayStyle.Visible) {
            this.drawLines(
                worksheet, startRowIndex, startColIndex, endRowIndex, endColIndex,
                graphics, rangeWidth, rangeHeight, startX, startY
            );
        }
        this.drawCells(worksheet, startRowIndex, startColIndex, endRowIndex, endColIndex, graphics, originalWidth, startX, startY);
        this.iterateMerges(worksheet, startRowIndex, startColIndex, endRowIndex, endColIndex, graphics, originalWidth, startX, startY);
        this.drawShapes(worksheet, startRowIndex, startColIndex, endRowIndex, endColIndex, startX, startY);
        if (this.settings.renderHeadings) {
            this.drawHeadings(
                worksheet, startColIndex, endColIndex, startRowIndex, endRowIndex,
                graphics, originalWidth, startX, startY
            );
        }
    }

    private drawHeadings(
        _worksheet: IWorksheet, firstColumn: number, lastColumn: number, firstRow: number, lastRow: number,
        graphics: PdfGraphics, _originalWidth: number, startX: number, startY: number
    ): void {
        const headerFont: PdfFont = this.pdfDocument.embedFont(PdfFontFamily.helvetica, 8, PdfFontStyle.regular);
        const headerBrush: PdfBrush = new PdfBrush({ r: 242, g: 242, b: 242 });
        const borderPen: PdfPen = new PdfPen({ r: 180, g: 180, b: 180 }, 0.5);
        const textBrush: PdfBrush = new PdfBrush({ r: 60, g: 60, b: 60 });
        const headerHeight: number = 16;
        const headerWidth: number = 24;
        const cornerRect: Rectangle = { x: startX - headerWidth, y: startY - headerHeight, width: headerWidth, height: headerHeight };
        graphics.drawRectangle(cornerRect, headerBrush);
        graphics.drawRectangle(cornerRect, borderPen);
        let curColX: number = startX;
        for (let colIdx: number = firstColumn; colIdx <= lastColumn; colIdx++) {
            const colW: number = pxToPt(this.columnWidthGetter.getSize(colIdx));
            const colRect: Rectangle = { x: curColX, y: startY - headerHeight, width: colW, height: headerHeight };
            graphics.drawRectangle(colRect, headerBrush);
            graphics.drawRectangle(colRect, borderPen);
            let colName: string = '';
            let tempCol: number = colIdx;
            while (tempCol > 0) {
                const rem: number = (tempCol - 1) % 26;
                colName = String.fromCharCode(65 + rem) + colName;
                tempCol = Math.floor((tempCol - 1) / 26);
            }
            const strSize: Size = headerFont.measureString(colName);
            const textX: number = curColX + (colW - strSize.width) / 2;
            const textY: number = startY - headerHeight + (headerHeight - strSize.height) / 2;
            graphics.drawString(colName, headerFont, { x: textX, y: textY, width: colW, height: headerHeight }, textBrush);
            curColX += colW;
        }
        let curRowY: number = startY;
        for (let rowIdx: number = firstRow; rowIdx <= lastRow; rowIdx++) {
            const rowH: number = pxToPt(this.rowHeightGetter.getSize(rowIdx));
            const rowRect: Rectangle = { x: startX - headerWidth, y: curRowY, width: headerWidth, height: rowH };
            graphics.drawRectangle(rowRect, headerBrush);
            graphics.drawRectangle(rowRect, borderPen);
            const rowStr: string = String(rowIdx);
            const strSize: Size = headerFont.measureString(rowStr);
            const textX: number = startX - headerWidth + (headerWidth - strSize.width) / 2;
            const textY: number = curRowY + (rowH - strSize.height) / 2;
            graphics.drawString(rowStr, headerFont, { x: textX, y: textY, width: headerWidth, height: rowH }, textBrush);
            curRowY += rowH;
        }
    }

    private drawLines(
        worksheet: IWorksheet, firstRow: number, firstColumn: number, lastRow: number, lastColumn: number,
        graphics: PdfGraphics, width: number, _height: number, startX: number, startY: number
    ): void {
        const pen: PdfPen = new PdfPen({ r: 0, g: 0, b: 0 }, 1);
        const skipCol: Map<number, Set<number>> = new Map();
        const skipRow: Map<number, Set<number>> = new Map();
        for (const mergedRegion of worksheet.mergedRegions) {
            if (mergedRegion.firstRow > lastRow) { continue; }
            for (let rowIndex: number = mergedRegion.firstRow; rowIndex < mergedRegion.lastRow; rowIndex++) {
                if (!skipCol.has(rowIndex)) { skipCol.set(rowIndex, new Set()); }
                const skipSet: Set<number> | undefined = skipCol.get(rowIndex);
                for (let colIndex: number = mergedRegion.firstColumn; colIndex <= mergedRegion.lastColumn; colIndex++) {
                    if (colIndex >= firstColumn && colIndex <= lastColumn && skipSet) { skipSet.add(colIndex); }
                }
            }
            for (let colIndex: number = mergedRegion.firstColumn; colIndex < mergedRegion.lastColumn; colIndex++) {
                if (!skipRow.has(colIndex)) { skipRow.set(colIndex, new Set()); }
                const skipSet: Set<number> | undefined = skipRow.get(colIndex);
                for (let rowIndex: number = mergedRegion.firstRow; rowIndex <= mergedRegion.lastRow; rowIndex++) {
                    if (rowIndex >= firstRow && rowIndex <= lastRow && skipSet) { skipSet.add(rowIndex); }
                }
            }
        }
        let cursorX: number = startX;
        let cursorY: number = startY;
        pen.width = 1; graphics.drawLine(pen, { x: cursorX, y: cursorY }, { x: width + cursorX, y: cursorY });
        pen.width = 0.1;
        for (let rowIndex: number = firstRow; rowIndex <= lastRow; rowIndex++) {
            cursorY += pxToPt(this.rowHeightGetter.getSize(rowIndex));
            cursorX = startX;
            const skips: Set<number> | undefined = skipCol.get(rowIndex);
            if (skips && skips.size) {
                for (let colIndex: number = firstColumn; colIndex <= lastColumn; colIndex++) {
                    if (skips.has(colIndex)) { continue; }
                    const cellX: number = startX + pxToPt(this.columnWidthGetter.getTotal(firstColumn, colIndex - 1));
                    const cellW: number = pxToPt(this.columnWidthGetter.getSize(colIndex));
                    graphics.drawLine(pen, { x: cellX, y: cursorY }, { x: cellX + cellW, y: cursorY });
                }
            } else {
                graphics.drawLine(pen, { x: startX, y: cursorY }, { x: width + cursorX, y: cursorY });
            }
        }
        cursorX = startX;
        pen.width = 1;
        graphics.drawLine(pen, { x: startX, y: cursorY }, { x: width + cursorX, y: cursorY });
        const topEdgeY: number = startY - 0.5;
        const bottomEdgeY: number = cursorY + 0.5;
        graphics.drawLine(pen, { x: cursorX, y: topEdgeY }, { x: cursorX, y: bottomEdgeY });
        pen.width = 0.1;
        for (let colIndex: number = firstColumn; colIndex <= lastColumn; colIndex++) {
            cursorX += pxToPt(this.columnWidthGetter.getSize(colIndex));
            const skips: Set<number> | undefined = skipRow.get(colIndex);
            if (skips && skips.size) {
                for (let rowIndex: number = firstRow; rowIndex <= lastRow; rowIndex++) {
                    if (skips.has(rowIndex)) { continue; }
                    const cellY: number = startY + pxToPt(this.rowHeightGetter.getTotal(firstRow, rowIndex - 1));
                    const cellH: number = pxToPt(this.rowHeightGetter.getSize(rowIndex));
                    graphics.drawLine(pen, { x: cursorX, y: cellY }, { x: cursorX, y: cellY + cellH });
                }
            } else {
                graphics.drawLine(pen, { x: cursorX, y: topEdgeY }, { x: cursorX, y: bottomEdgeY });
            }
        }
        pen.width = 1;
        graphics.drawLine(pen, { x: cursorX, y: topEdgeY }, { x: cursorX, y: bottomEdgeY });
    }

    private drawCellsBackground(
        worksheet: IWorksheet, firstRow: number, firstColumn: number, lastRow: number, lastColumn: number,
        graphics: PdfGraphics, originalWidth: number, startX: number, startY: number
    ): void {
        const autoGrid: boolean = this.settings.displayGridLines === GridLinesDisplayStyle.Auto;
        const isAutoPrintGrid: boolean = autoGrid && worksheet.pageSetup.printGridlines;
        const gridVisible: boolean = isAutoPrintGrid || this.settings.displayGridLines === GridLinesDisplayStyle.Visible;
        for (let rowIndex: number = firstRow; rowIndex <= lastRow; rowIndex++) {
            const cellY: number = pxToPt(this.rowHeightGetter.getTotal(firstRow, rowIndex - 1)) + startY;
            const height: number = pxToPt(this.rowHeightGetter.getSize(rowIndex));
            for (let columnIndex: number = firstColumn; height > 0 && columnIndex <= lastColumn; columnIndex++) {
                const cell: ICell = worksheet.getCell(rowIndex, columnIndex);
                if ((cell.style.fillPattern === ExcelPattern.None && !cell.dataBar) || this.isMerged(cell)) { continue; }
                let cellX: number = pxToPt(this.columnWidthGetter.getTotal(firstColumn, columnIndex - 1)) + startX;
                const width: number = pxToPt(this.columnWidthGetter.getSize(columnIndex));
                if (this.settings.enableRtl) { cellX = originalWidth - cellX - width; }
                let drawLeft: number = cellX;
                let drawWidth: number = width;
                let drawTop: number = cellY;
                let drawHeight: number = height;
                if (gridVisible) {
                    const gridHalfWidth: number = 0.5;
                    if (columnIndex === firstColumn) { drawLeft += gridHalfWidth; drawWidth -= gridHalfWidth; }
                    else if (columnIndex === lastColumn) { drawWidth -= gridHalfWidth; }
                    if (rowIndex === firstRow) { drawTop += gridHalfWidth; drawHeight -= gridHalfWidth; }
                    else if (rowIndex === lastRow) { drawHeight -= gridHalfWidth; }
                }
                this.drawCellBackground(cell, { x: drawLeft, y: drawTop, width: drawWidth, height: drawHeight }, graphics);
            }
        }
    }
    private drawCellBackground(cell: ICell, rect: Rectangle, graphics: PdfGraphics): void {
        if (rect.height <= 0 || rect.width <= 0) { return; }
        const cellStyle: ICellStyle = cell.style;
        if (cellStyle.fillPattern !== ExcelPattern.None) {
            if (this.pageSetup.blackAndWhite) {
                graphics.drawRectangle(rect, new PdfBrush({ r: 255, g: 255, b: 255 }));
            } else {
                graphics.drawRectangle(rect, new PdfBrush(toPdfColor(normalizeColor(cellStyle.fillColor))));
            }
        }
        if (cell.dataBar) {
            CfRenderer.drawDataBar(graphics, rect, cell.dataBar, this.pageSetup.blackAndWhite);
        }
    }

    private drawMergeBackground(
        worksheet: IWorksheet, firstRow: number, firstColumn: number, lastRow: number, lastColumn: number,
        graphics: PdfGraphics, originalWidth: number, startX: number, startY: number
    ): void {
        for (const mergedRegion of this.cacheMerges(firstRow, firstColumn, lastRow, lastColumn)) {
            const rect: Rectangle = this.getMergedRectangle(mergedRegion, firstRow, firstColumn, lastRow, lastColumn, startX, startY);
            if (this.settings.enableRtl) { rect.x = originalWidth - rect.x - rect.width; }
            const cell: ICell = worksheet.getCell(mergedRegion.firstRow, mergedRegion.firstColumn);
            if (cell.style.fillPattern !== ExcelPattern.None || cell.dataBar) { this.drawCellBackground(cell, rect, graphics); }
        }
    }
    private cacheMerges(firstRow: number, firstColumn: number, lastRow: number, lastColumn: number): IMergedRegion[] {
        const result: IMergedRegion[] = [];
        const exclude: Set<number> = new Set();
        for (let rowIndex: number = firstRow; rowIndex <= lastRow; rowIndex++) {
            for (let colIndex: number = firstColumn; colIndex <= lastColumn; colIndex++) {
                const mergeInfo: {
                    first: boolean;
                    firstKey: number;
                    rowSpan: number;
                    colSpan: number;
                } | undefined = this.mergedRegions.get(this.cellKey(colIndex, rowIndex));
                if (!mergeInfo) { continue; }
                if (mergeInfo.first) {
                    result.push({
                        firstRow: rowIndex,
                        lastRow: rowIndex + mergeInfo.rowSpan - 1,
                        firstColumn: colIndex,
                        lastColumn: colIndex + mergeInfo.colSpan - 1
                    });
                } else if (!exclude.has(mergeInfo.firstKey)) {
                    const mergeFirstRow: number = Math.floor(mergeInfo.firstKey / (16384 * 4));
                    const mergeFirstCol: number = mergeInfo.firstKey - mergeFirstRow * 16384 * 4;
                    if (mergeFirstRow < firstRow || mergeFirstCol < firstColumn) {
                        exclude.add(mergeInfo.firstKey);
                        const anchorInfo: {
                            first: boolean;
                            firstKey: number;
                            rowSpan: number;
                            colSpan: number;
                        } | undefined = this.mergedRegions.get(mergeInfo.firstKey);
                        if (anchorInfo) {
                            result.push({
                                firstRow: mergeFirstRow,
                                lastRow: mergeFirstRow + anchorInfo.rowSpan - 1,
                                firstColumn: mergeFirstCol,
                                lastColumn: mergeFirstCol + anchorInfo.colSpan - 1
                            });
                        }
                    }
                }
            }
        }
        return result;
    }

    private getMergedRectangle(
        mergedRegion: IMergedRegion,
        firstRow: number,
        firstColumn: number,
        lastRow: number,
        _lastColumn: number,
        startX: number,
        startY: number
    ): Rectangle {
        void _lastColumn;
        const rectY: number = pxToPt(this.rowHeightGetter.getTotal(firstRow, mergedRegion.firstRow - 1)) + startY;
        const rectX: number = pxToPt(this.columnWidthGetter.getTotal(firstColumn, mergedRegion.firstColumn - 1)) + startX;
        const clampedLastRow: number = Math.min(mergedRegion.lastRow, lastRow);
        const height: number = pxToPt(this.rowHeightGetter.getTotal(mergedRegion.firstRow, clampedLastRow));
        const width: number = pxToPt(this.columnWidthGetter.getTotal(mergedRegion.firstColumn, mergedRegion.lastColumn));
        return { x: rectX, y: rectY, width, height };
    }

    private drawCells(
        worksheet: IWorksheet, firstRow: number, firstColumn: number, lastRow: number, lastColumn: number,
        graphics: PdfGraphics, originalWidth: number, startX: number, startY: number
    ): void {
        this.isFirstRowOfPage = true;
        for (let rowIndex: number = firstRow; rowIndex <= lastRow; rowIndex++) {
            const cellY: number = pxToPt(this.rowHeightGetter.getTotal(firstRow, rowIndex - 1)) + startY;
            const height: number = pxToPt(this.rowHeightGetter.getSize(rowIndex));
            this.isFirstColumnOfPage = true;
            if (height > 0) {
                for (let columnIndex: number = firstColumn; columnIndex <= lastColumn; columnIndex++) {
                    const cell: ICell = worksheet.getCell(rowIndex, columnIndex);
                    const hasNoCellText: boolean = !cell.displayText || cell.displayText.trim().length === 0;
                    if (!worksheet.hasCellData(rowIndex, columnIndex) && this.splitTexts.length === 0 && hasNoCellText) {
                        if (!this.cellHasVisibleFormat(cell)) { continue; }
                    }
                    let cellX: number = pxToPt(this.columnWidthGetter.getTotal(firstColumn, columnIndex - 1)) + startX;
                    if (this.settings.enableRtl) { cellX = originalWidth - cellX; }
                    if (this.isMerged(cell)) { continue; }
                    const width: number = pxToPt(this.columnWidthGetter.getSize(columnIndex));
                    if (this.settings.enableRtl) { cellX -= width; }
                    if (width > 0) {
                        const rect: Rectangle = { x: cellX, y: cellY, width, height };
                        const adjacentRect: Rectangle = this.getAdjacentCells(worksheet, cell, rect);
                        this.drawCell(cell, rect, adjacentRect, graphics, 0, cell.row === lastRow ? 1 : 0, false);
                        this.isFirstColumnOfPage = false;
                    }
                }
                this.isFirstRowOfPage = false;
            }
        }
    }

    private getAdjacentCells(worksheet: IWorksheet, cell: ICell, rect: Rectangle): Rectangle {
        const cellStyle: ICellStyle = cell.style;
        const isExcludedAlign: boolean = cellStyle.hAlign === ExcelHAlign.Justify ||
            cellStyle.hAlign === ExcelHAlign.Fill;
        if (cell.isBlank || cell.cellType === CellType.Number || cellStyle.wrapText ||
            cellStyle.vAlign === ExcelVAlign.Justify || isExcludedAlign ||
            cellStyle.shrinkToFit || cell.hasFilterButton) {
            return rect;
        }
        if (this.isMerged(cell)) { return rect; }
        const font: PdfFont = this.getPdfFont(cellStyle);
        const requiredWidth: number = this.measureText(this.sanitizeTextForFont(cell.displayText, font), font).width;
        const currentWidth: number = rect.width;
        if (requiredWidth <= currentWidth) { return rect; }
        let stepDirection: number = 1;
        if (!this.settings.enableRtl) { if (cellStyle.hAlign === ExcelHAlign.Right) { stepDirection = -1; } }
        else if (cellStyle.hAlign === ExcelHAlign.Left) { stepDirection = -1; }
        let lastColumnIndex: number = cell.column;
        const maxCol: number = this.workBook.maxColumnCount;
        const isBlankAt: (colIndex: number) => boolean = (columnIndex: number): boolean => {
            if (columnIndex < 1 || columnIndex > maxCol) { return false; }
            const adjacentCell: ICell = worksheet.getCell(cell.row, columnIndex);
            if (adjacentCell.displayText && adjacentCell.displayText.trim().length > 0) { return false; }
            if (worksheet.hasCellData(cell.row, columnIndex)) { return false; }
            const hasStyleFlags: boolean = adjacentCell.hasStyle && (
                BorderRenderer.checkCellBorderStyle(adjacentCell.style.borders) ||
                adjacentCell.style.fillPattern !== ExcelPattern.None
            );
            if (hasStyleFlags) { return false; }
            return !this.isMerged(adjacentCell);
        };
        if (cellStyle.hAlign === ExcelHAlign.Center) {
            let expandLeft: number = 0;
            let expandRight: number = 0;
            const halfOverflow: number = (requiredWidth - currentWidth) / 2;
            let columnIndex: number = cell.column + 1;
            while (isBlankAt(columnIndex) && expandRight < halfOverflow) {
                expandRight += pxToPt(this.columnWidthGetter.getSize(columnIndex));
                columnIndex++;
            }
            columnIndex = cell.column - 1;
            while (isBlankAt(columnIndex) && expandLeft < halfOverflow) {
                expandLeft += pxToPt(this.columnWidthGetter.getSize(columnIndex));
                columnIndex--;
            }
            return { x: rect.x - expandLeft, y: rect.y, width: rect.width + expandLeft + expandRight, height: rect.height };
        }
        let addedWidth: number = 0;
        while (isBlankAt(lastColumnIndex + stepDirection) && currentWidth + addedWidth < requiredWidth) {
            addedWidth += pxToPt(this.columnWidthGetter.getSize(lastColumnIndex + stepDirection));
            lastColumnIndex += stepDirection;
        }
        if (addedWidth === 0) { return rect; }
        return stepDirection > 0
            ? { x: rect.x, y: rect.y, width: rect.width + addedWidth, height: rect.height }
            : { x: rect.x - addedWidth, y: rect.y, width: rect.width + addedWidth, height: rect.height };
    }

    private drawCell(
        cell: ICell, cellRect: Rectangle, adjacentRect: Rectangle, graphics: PdfGraphics,
        mergedWidth: number, lastCell: number, isMergedCell: boolean
    ): void {
        const style: ICellStyle = cell.style;
        const cellText: string = this.getPrintText(cell);
        if (cellText !== '' && cell.cellType !== CellType.Blank) {
            const font: PdfFont = this.getPdfFont(style);
            let text: string = this.sanitizeTextForFont(cellText, font);
            if (!style.wrapText) { text = text.split(NEW_LINE).join('').split(CARRIAGE_RETURN).join(''); }
            let color: Rgba = normalizeColor(style.fontColor);
            if (this.pageSetup.blackAndWhite) { color = BLACK; }
            const brush: PdfBrush = new PdfBrush(toPdfColor(color));
            const stringFormat: PdfStringFormat = new PdfStringFormat();
            stringFormat.alignment = this.getHorizontalAlignment(cell);
            stringFormat.lineAlignment = style.vAlign === ExcelVAlign.Center
                ? PdfVerticalAlignment.middle
                : style.vAlign === ExcelVAlign.Top ? PdfVerticalAlignment.top : PdfVerticalAlignment.bottom;
            const formatObj: Record<string, unknown> = stringFormat as unknown as Record<string, unknown>;
            const wordWrapSetting: _PdfWordWrapType = style.wrapText || stringFormat.alignment === PdfTextAlignment.justify
                ? _PdfWordWrapType.word
                : _PdfWordWrapType.none;
            formatObj['_wordWrapType'] = wordWrapSetting;
            const rect: Rectangle = { x: adjacentRect.x, y: adjacentRect.y, width: adjacentRect.width, height: adjacentRect.height };
            if (cell.hasFilterButton) {
                rect.width = Math.max(0, rect.width - 14);
            }
            let textWidth: number = this.measureText(text, font, stringFormat).width;
            if (style.indent > 0) {
                const indentValue: number = style.indent * 7.2;
                if (stringFormat.alignment === PdfTextAlignment.left) {
                    rect.x += indentValue;
                    rect.width -= formatObj['_wordWrapType'] === _PdfWordWrapType.word ? indentValue : 0;
                } else if (stringFormat.alignment === PdfTextAlignment.right) {
                    rect.width -= indentValue;
                    if (formatObj['_wordWrapType'] === _PdfWordWrapType.word) {
                        rect.x += indentValue;
                        rect.width -= indentValue;
                    }
                }
            }
            if (style.hAlign === ExcelHAlign.Fill) {
                text = this.fillText(rect, text, font, stringFormat);
                textWidth = this.measureText(text, font, stringFormat).width;
            }
            const borders: IBorders = style.borders;
            if (stringFormat.alignment === PdfTextAlignment.left) {
                const padding: number = 3.0;
                const leftWidth: number = BorderRenderer.getBorderWidth(borders.left) * 0.5;
                const rightWidth: number = BorderRenderer.getBorderWidth(borders.right) * 0.5;
                const hasBorder: boolean = borders.left.lineStyle !== ExcelLineStyle.None ||
                    borders.right.lineStyle !== ExcelLineStyle.None;
                rect.x += hasBorder ? leftWidth + padding : padding;
                rect.width -= hasBorder ? leftWidth + rightWidth + padding * 2 : rightWidth + padding * 2;
            } else if (stringFormat.alignment === PdfTextAlignment.right) {
                const padding: number = 2.0;
                rect.width -= BorderRenderer.getBorderWidth(borders.right) + padding;
            } else if (stringFormat.alignment === PdfTextAlignment.justify) {
                const leftWidth: number = BorderRenderer.getBorderWidth(borders.left);
                const rightWidth: number = BorderRenderer.getBorderWidth(borders.right);
                rect.x += leftWidth + 2.0;
                rect.width -= leftWidth + rightWidth + 3.0;
            }
            if (stringFormat.lineAlignment === PdfVerticalAlignment.top) {
                rect.y += BorderRenderer.getBorderWidth(borders.top);
            } else if (stringFormat.lineAlignment === PdfVerticalAlignment.bottom &&
                BorderRenderer.getBorderWidth(borders.bottom) > BorderRenderer.getBorderWidth(borders.top)) {
                rect.y -= BorderRenderer.getBorderWidth(borders.bottom) - BorderRenderer.getBorderWidth(borders.top);
            }

            const pastPageEdge: boolean = Math.ceil(adjacentRect.x + adjacentRect.width) >=
                Math.ceil(this.pdfPageTemplate.size.width);
            if (textWidth > adjacentRect.width && pastPageEdge &&
                !this.isMerged(cell) && formatObj['_wordWrapType'] !== _PdfWordWrapType.word) {
                const splitText: SplitText = new SplitText();
                splitText.text = text;
                splitText.font = font;
                splitText.brush = brush;
                splitText.format = stringFormat;
                splitText.originRect = {
                    x: adjacentRect.x - this.pdfPageTemplate.size.width,
                    y: adjacentRect.y,
                    width: adjacentRect.width,
                    height: adjacentRect.height
                };
                splitText.row = cell.row;
                splitText.adjacentColumn = cell.column + 1;
                splitText.pageTemplate = this.pdfPageTemplate;
                this.splitTexts.push(splitText);
            }

            if (cell.iconSet) {
                const iconSize: number = CfRenderer.iconSize(cellRect.height, style.fontSize);
                const iconY: number = cellRect.y + (cellRect.height - iconSize) / 2;
                CfRenderer.drawIcon(graphics, cell.iconSet.set, cell.iconSet.index, cellRect.x + 3, iconY, iconSize);
                rect.x += iconSize + 4;
                rect.width -= iconSize + 4;
            }

            if (cell.richText && cell.richText.length > 0 && style.rotation === 0) {
                RichTextRenderer.drawRichText(
                    cell.richText,
                    rect,
                    graphics,
                    style,
                    (cellStyle: ICellStyle) => this.getPdfFont(cellStyle),
                    this.pageSetup.blackAndWhite,
                    stringFormat.alignment,
                    stringFormat.lineAlignment,
                    style.wrapText
                );
            } else if (style.rotation !== 0 && style.rotation !== 255) {
                this.drawRotatedText(rect, style, text, graphics, font, brush, stringFormat);
            } else {
                this.drawString(text, font, brush, rect, stringFormat, graphics, textWidth, style, cellRect, adjacentRect);
            }
        } else if (cell.iconSet) {
            const iconSize: number = CfRenderer.iconSize(adjacentRect.height, style.fontSize);
            const iconY: number = adjacentRect.y + (adjacentRect.height - iconSize) / 2;
            CfRenderer.drawIcon(graphics, cell.iconSet.set, cell.iconSet.index, adjacentRect.x + 2, iconY, iconSize);
        }
        if (cell.hasStyle && BorderRenderer.checkCellBorderStyle(style.borders)) {
            BorderRenderer.drawBordersAsMSExcel(
                this.workSheet,
                style.borders,
                cellRect,
                graphics,
                cell,
                lastCell,
                this.settings.enableRtl,
                this.isFirstColumnOfPage,
                this.isFirstRowOfPage,
                this.pageSetup.blackAndWhite
            );
        }
        if (cell.comment) {
            this.drawCommentIndicator(graphics, cellRect, cell.comment.isThreaded);
            if (this.pageSetup.printComments === ExcelPrintLocation.PrintInPlace) {
                if (!cell.comment.isThreaded && cell.comment.isVisible === true) {
                    CommentRenderer.drawInPlaceBalloon(
                        cell.comment, cellRect, graphics, this.pageSetup.blackAndWhite, this.sheetWidth
                    );
                }
            }
        }
        if (cell.hasFilterButton) {
            this.drawFilterButton(graphics, cellRect);
        } else if (cell.hasDropdownButton) {
            this.drawFilterButton(graphics, cellRect);
        }
        void mergedWidth;
        void isMergedCell;
    }

    private drawFilterButton(graphics: PdfGraphics, cellRect: Rectangle): void {
        const btnWidth: number = 11;
        const btnHeight: number = 11;
        const btnX: number = cellRect.x + cellRect.width - btnWidth - 2;
        const btnY: number = cellRect.y + (cellRect.height - btnHeight) / 2;
        if (btnX > cellRect.x) {
            const btnRect: Rectangle = { x: btnX, y: btnY, width: btnWidth, height: btnHeight };
            const bgBrush: PdfBrush = new PdfBrush({ r: 240, g: 240, b: 240 });
            const borderPen: PdfPen = new PdfPen({ r: 180, g: 180, b: 180 }, 0.5);
            graphics.drawRectangle(btnRect, bgBrush);
            graphics.drawRectangle(btnRect, borderPen);
            const arrowPen: PdfPen = new PdfPen({ r: 80, g: 80, b: 80 }, 0.7);
            const arrowY: number = btnY + 4;
            const arrowX: number = btnX + 3;
            graphics.drawLine(arrowPen, { x: arrowX, y: arrowY }, { x: arrowX + 5, y: arrowY });
            graphics.drawLine(arrowPen, { x: arrowX + 1, y: arrowY + 1.5 }, { x: arrowX + 4, y: arrowY + 1.5 });
            graphics.drawLine(arrowPen, { x: arrowX + 2, y: arrowY + 3 }, { x: arrowX + 3, y: arrowY + 3 });
        }
    }

    private drawCommentIndicator(graphics: PdfGraphics, cellRect: Rectangle, isThreaded?: boolean): void {
        const indicatorSize: number = 4;
        const color: { r: number; g: number; b: number } = isThreaded
            ? { r: 147, g: 112, b: 219 }
            : { r: 255, g: 0, b: 0 };
        const brush: PdfBrush = new PdfBrush(color);
        for (let indicatorIndex: number = 0; indicatorIndex < indicatorSize; indicatorIndex++) {
            const rectW: number = indicatorSize - indicatorIndex;
            const rectX: number = cellRect.x + cellRect.width - indicatorSize + indicatorIndex;
            graphics.drawRectangle(
                { x: rectX, y: cellRect.y, width: rectW, height: 1 },
                brush
            );
        }
    }

    private drawCommentsAtSheetEnd(worksheet: IWorksheet): void {
        const collected: ISortedCommentItem[] = [];
        const used: IMergedRegion = worksheet.usedRange;
        for (let row: number = 1; row <= used.lastRow; row++) {
            for (let col: number = 1; col <= used.lastColumn; col++) {
                const cell: ICell = worksheet.getCell(row, col);
                if (cell && cell.comment) {
                    const colLetter: string = RangeParser.columnIndexToLetter(col);
                    collected.push({
                        row: row,
                        column: col,
                        cellAddress: colLetter + row,
                        comment: cell.comment
                    });
                }
            }
        }
        if (collected.length === 0) {
            return;
        }
        const rows: { labelCol: string; valueCol: string }[] = CommentRenderer.buildEndCommentRows(collected);
        const fontName: PdfFontFamily = PdfFontFamily.helvetica;
        const boldFont: PdfFont = new PdfStandardFont(fontName, 9, PdfFontStyle.bold);
        const regularFont: PdfFont = new PdfStandardFont(fontName, 9, PdfFontStyle.regular);
        const textBrush: PdfBrush = new PdfBrush({ r: 0, g: 0, b: 0 });
        const borderPen: PdfPen = new PdfPen({ r: 210, g: 210, b: 210 }, 0.5);

        const labelFormat: PdfStringFormat = new PdfStringFormat();
        labelFormat.alignment = PdfTextAlignment.right;
        labelFormat.lineAlignment = PdfVerticalAlignment.top;

        const valueFormat: PdfStringFormat = new PdfStringFormat();
        valueFormat.alignment = PdfTextAlignment.left;
        valueFormat.lineAlignment = PdfVerticalAlignment.top;

        let endPage: PdfPage = this.addPage(this.pageSetup);
        let graphics: PdfGraphics = endPage.graphics;
        let pageWidth: number = endPage.size.width;
        let pageHeight: number = endPage.size.height;
        const marginX: number = 36;
        let startY: number = 36;
        const labelWidth: number = 80;
        let valueWidth: number = pageWidth - marginX * 2 - labelWidth;

        const rowsList: { labelCol: string; valueCol: string }[] = rows;
        for (let rowIndex: number = 0; rowIndex < rowsList.length; rowIndex++) {
            const rowData: { labelCol: string; valueCol: string } = rowsList[rowIndex as number];
            const safeLabel: string = sanitizeTextForFont(rowData.labelCol, boldFont);
            const safeValue: string = sanitizeTextForFont(rowData.valueCol, regularFont);
            const valueMeasure: Size = measurePdfText(safeValue, regularFont);
            const labelMeasure: Size = measurePdfText(safeLabel, boldFont);
            const rowHeight: number = Math.max(22, Math.max(valueMeasure.height, labelMeasure.height) + 6);

            if (startY + rowHeight > pageHeight - 36) {
                endPage = this.addPage(this.pageSetup);
                graphics = endPage.graphics;
                pageWidth = endPage.size.width;
                pageHeight = endPage.size.height;
                startY = 36;
                valueWidth = pageWidth - marginX * 2 - labelWidth;
            }

            graphics.drawString(
                safeLabel, boldFont,
                { x: marginX, y: startY + 2, width: labelWidth - 8, height: rowHeight },
                textBrush, labelFormat
            );
            graphics.drawString(
                safeValue, regularFont,
                { x: marginX + labelWidth, y: startY + 2, width: valueWidth, height: rowHeight },
                textBrush, valueFormat
            );
            graphics.drawLine(
                borderPen,
                { x: marginX, y: startY + rowHeight },
                { x: marginX + labelWidth + valueWidth, y: startY + rowHeight }
            );
            startY += rowHeight;
        }
    }

    private sanitizeTextForFont(text: string, font: PdfFont): string {
        return sanitizeTextForFont(text, font);
    }
    private measureText(text: string, font: PdfFont, stringFormat?: PdfStringFormat): Size {
        return measurePdfText(text, font, stringFormat);
    }
    private getPrintText(cell: ICell): string { return cell.displayText; }
    private fillText(bounds: Rectangle, text: string, font: PdfFont, stringFormat: PdfStringFormat): string {
        let result: string = text;
        const unitWidth: number = this.measureText(text, font, stringFormat).width;
        let accumulatedWidth: number = unitWidth;
        if (unitWidth <= 0) { return text; }
        while (bounds.width > accumulatedWidth + unitWidth) {
            result += text;
            accumulatedWidth += unitWidth;
        }
        return result;
    }

    private getHorizontalAlignment(cell: ICell): PdfTextAlignment {
        const style: ICellStyle = cell.style;
        switch (style.hAlign) {
        case ExcelHAlign.Right:
            return PdfTextAlignment.right;
        case ExcelHAlign.Center:
        case ExcelHAlign.CenterAcrossSelection:
            return PdfTextAlignment.center;
        case ExcelHAlign.Justify:
            return PdfTextAlignment.justify;
        case ExcelHAlign.General:
            if (style.rotation === 255) { return PdfTextAlignment.center; }
            switch (cell.cellType) {
            case CellType.Number:
                return style.numberFormat === TEXT_NUMBER_FORMAT ? PdfTextAlignment.left : PdfTextAlignment.right;
            case CellType.Boolean:
            case CellType.Error:
                return PdfTextAlignment.center;
            default:
                return PdfTextAlignment.left;
            }
        default:
            return PdfTextAlignment.left;
        }
    }

    private drawString(
        text: string, font: PdfFont, brush: PdfBrush, rect: Rectangle, stringFormat: PdfStringFormat,
        graphics: PdfGraphics, textWidth: number, style: ICellStyle, cellRect: Rectangle, adjacentRect: Rectangle
    ): void {
        if (!text) { return; }
        const formatObj: Record<string, unknown> = stringFormat as unknown as Record<string, unknown>;
        const isWordWrap: boolean = formatObj['_wordWrapType'] === _PdfWordWrapType.word;
        if (style.shrinkToFit && !isWordWrap && textWidth > rect.width) {
            const fontHeight: number = this.measureText(text, font, stringFormat).height;
            const template: PdfTemplate = new PdfTemplate({ width: textWidth, height: fontHeight });
            const scaledHeight: number = template.size.height / (textWidth / rect.width);
            template.graphics.drawString(
                text, font, { x: 0, y: 0, width: template.size.width, height: template.size.height }, brush, stringFormat
            );
            let drawY: number = rect.y;
            if (stringFormat.lineAlignment === PdfVerticalAlignment.middle) {
                drawY = rect.y + (rect.height - scaledHeight) / 2;
            } else if (stringFormat.lineAlignment === PdfVerticalAlignment.bottom) {
                drawY = rect.y + (rect.height - scaledHeight);
            }
            graphics.drawTemplate(template, { x: rect.x, y: drawY, width: rect.width, height: scaledHeight });
            return;
        }
        if (isWordWrap || (adjacentRect.width > cellRect.width && rect.width >= textWidth) || rect.width >= textWidth) {
            graphics.drawString(text, font, rect, brush, stringFormat);
            return;
        }
        const bounds: Rectangle = { x: rect.x, y: rect.y, width: textWidth, height: rect.height };
        if (stringFormat.alignment === PdfTextAlignment.center) {
            bounds.x = rect.x + (rect.width - textWidth) / 2;
        } else if (stringFormat.alignment === PdfTextAlignment.right) {
            bounds.x = rect.x + (rect.width - textWidth);
        }
        const graphicsObj: Record<string, unknown> = graphics as unknown as Record<string, unknown>;
        const saveFn: () => unknown = graphicsObj['save'] as () => unknown;
        const restoreFn: (s: unknown) => void = graphicsObj['restore'] as (s: unknown) => void;
        const state: unknown = saveFn.call(graphics);
        graphics.setClip(rect);
        graphics.drawString(text, font, bounds, brush, stringFormat);
        restoreFn.call(graphics, state);
    }

    private drawRotatedText(
        rect: Rectangle,
        style: ICellStyle,
        text: string,
        graphics: PdfGraphics,
        font: PdfFont,
        brush: PdfBrush,
        stringFormat: PdfStringFormat
    ): void {
        const angle: number = style.rotation > 90 ? -(style.rotation - 90) : style.rotation;
        const graphicsObj: Record<string, unknown> = graphics as unknown as Record<string, unknown>;
        const saveFn: () => unknown = graphicsObj['save'] as () => unknown;
        const restoreFn: (s: unknown) => void = graphicsObj['restore'] as (s: unknown) => void;
        const translateFn: (p: { x: number; y: number }) => void =
            graphicsObj['translateTransform'] as (p: { x: number; y: number }) => void;
        const rotateFn: (deg: number) => void = graphicsObj['rotateTransform'] as (deg: number) => void;
        const state: unknown = saveFn.call(graphics);
        if (style.rotation === 255) {
            text = text.split('').join('\n');
            stringFormat.alignment = PdfTextAlignment.center;
            graphics.drawString(text, font, rect, brush, stringFormat);
            restoreFn.call(graphics, state);
            return;
        }
        if (angle <= 0) {
            translateFn.call(graphics, { x: rect.x, y: rect.y + rect.height });
        } else {
            translateFn.call(graphics, { x: rect.x + rect.width, y: rect.y });
        }
        rotateFn.call(graphics, -angle);
        const formatObj: Record<string, unknown> = stringFormat as unknown as Record<string, unknown>;
        formatObj['_wordWrapType'] = _PdfWordWrapType.word;
        graphics.drawString(text, font, { x: 0, y: 0, width: rect.width, height: rect.height }, brush, stringFormat);
        restoreFn.call(graphics, state);
    }

    private iterateMerges(
        worksheet: IWorksheet, firstRow: number, firstColumn: number, lastRow: number, lastColumn: number,
        graphics: PdfGraphics, originalWidth: number, startX: number, startY: number
    ): void {
        for (const mergedRegion of this.cacheMerges(firstRow, firstColumn, lastRow, lastColumn)) {
            this.drawMerge(worksheet, mergedRegion, firstRow, firstColumn, lastRow, lastColumn, graphics, originalWidth, startX, startY);
        }
    }
    private drawMerge(
        worksheet: IWorksheet, mergedRegion: IMergedRegion, firstRow: number, firstColumn: number,
        lastRow: number, lastColumn: number, graphics: PdfGraphics, originalWidth: number,
        startX: number, startY: number
    ): void {
        const rect: Rectangle = this.getMergedRectangle(mergedRegion, firstRow, firstColumn, lastRow, lastColumn, startX, startY);
        if (this.settings.enableRtl) { rect.x = originalWidth - rect.x - rect.width; }
        const cell: ICell = worksheet.getCell(mergedRegion.firstRow, mergedRegion.firstColumn);
        if (rect.height > 0 && rect.width > 0) {
            const lastCell: number = mergedRegion.lastRow === lastRow ? 1 : mergedRegion.lastRow > lastRow ? 2 : 0;
            this.drawCell(cell, rect, rect, graphics, rect.width, lastCell, true);
        }
    }

    private drawShapes(
        worksheet: IWorksheet, firstRow: number, firstColumn: number,
        lastRow: number, lastColumn: number, startX: number, startY: number
    ): void {
        for (const picture of worksheet.pictures) {
            if (!picture.visible || !(picture.height > 0 && picture.width > 0)) { continue; }
            this.drawImage(picture, firstRow, firstColumn, lastRow, lastColumn, startX, startY);
        }
        if (worksheet.charts && worksheet.charts.length > 0) {
            for (const chart of worksheet.charts) {
                if (!(chart.height > 0 && chart.width > 0)) { continue; }
                this.drawChart(chart, firstRow, firstColumn, lastRow, lastColumn, startX, startY);
            }
        }
        if (worksheet.shapes && worksheet.shapes.length > 0) {
            for (const shape of worksheet.shapes) {
                if (!shape.visible || !(shape.height > 0 && shape.width > 0)) { continue; }
                this.drawCustomShape(shape, firstRow, firstColumn, lastRow, lastColumn, startX, startY);
            }
        }
    }

    private computeShapeRect(
        shape: IPicture, firstRow: number, firstColumn: number,
        lastRow: number, lastColumn: number, startX: number, startY: number
    ): Rectangle | null {
        const visibilityCheck: { draw: boolean; inBetween: boolean } =
            this.canDrawShapeIn(firstRow, lastRow, firstColumn, lastColumn, shape);
        if (!visibilityCheck.draw) { return null; }
        const firstColPos: number = pxToPt(this.columnWidthGetter.getTotal(firstColumn - 1)) - startX;
        let firstRowPos: number = pxToPt(this.rowHeightGetter.getTotal(firstRow - 1)) - startY;
        const rect: Rectangle = {
            x: pxToPt(shape.left),
            y: pxToPt(shape.top),
            width: pxToPt(shape.width),
            height: pxToPt(shape.height)
        };
        if (this.workSheet.isRightToLeft) {
            rect.x = this.pdfPageTemplate.size.width - (rect.width + rect.x + startX);
        } else {
            if (firstRowPos > 0 && (!this.isPrintTitleRowPage || firstColPos > 0)) { firstRowPos -= startY; }
            if (firstColPos > 0 && this.isNewPage) { firstRowPos += startY; }
            rect.x -= firstColPos;
            rect.y -= firstRowPos;
        }
        return rect;
    }

    private drawChart(
        chart: IChart, firstRow: number, firstColumn: number,
        lastRow: number, lastColumn: number, startX: number, startY: number
    ): void {
        const rect: Rectangle | null = this.computeShapeRect(
            chart as unknown as IPicture, firstRow, firstColumn, lastRow, lastColumn, startX, startY
        );
        if (!rect) { return; }
        const font: PdfFont = this.pdfDocument.embedFont(PdfFontFamily.helvetica, 8, PdfFontStyle.regular);
        ChartRenderer.renderChart(this.pdfGraphics, chart, rect, font);
    }

    private drawImage(
        picture: IPicture, firstRow: number, firstColumn: number,
        lastRow: number, lastColumn: number, startX: number, startY: number
    ): void {
        const rect: Rectangle | null = this.computeShapeRect(picture, firstRow, firstColumn, lastRow, lastColumn, startX, startY);
        if (!rect || !picture.data) { return; }
        const rawBytes: Uint8Array | null = decodeImageBytes(picture.data);
        if (rawBytes && (isJpegBytes(rawBytes) || isPngBytes(rawBytes))) {
            const bitmap: PdfBitmap = new PdfBitmap(rawBytes);
            this.pdfGraphics.drawImage(bitmap, rect);
        }
    }

    private drawCustomShape(
        shape: IDrawingShape, firstRow: number, firstColumn: number,
        lastRow: number, lastColumn: number, startX: number, startY: number
    ): void {
        const rect: Rectangle | null = this.computeShapeRect(
            shape as unknown as IPicture, firstRow, firstColumn, lastRow, lastColumn, startX, startY
        );
        if (!rect) { return; }
        const graphics: PdfGraphics = this.pdfGraphics;
        if (shape.shapeType !== ExcelShapeType.FormControl) {
            ShapeRenderer.renderAutoShape(graphics, shape, rect);
            return;
        }
        const fillCol: { r: number; g: number; b: number } = shape.fillColor
            ? toPdfColor(shape.fillColor) : { r: 245, g: 245, b: 245 };
        const borderCol: { r: number; g: number; b: number } = shape.borderColor
            ? toPdfColor(shape.borderColor) : { r: 120, g: 120, b: 120 };
        const borderPen: PdfPen = new PdfPen(borderCol, shape.borderWidth || 1);
        const fillBrush: PdfBrush = new PdfBrush(fillCol);
        if (shape.formControlType === ExcelFormControlType.CheckBox || shape.type === 'checkbox') {
            const boxSize: number = 6;
            const boxY: number = (rect.y + (rect.height / 2)) - 3;
            const boxX: number = rect.x + 2.7;
            const boxRect: Rectangle = { x: boxX, y: boxY, width: boxSize, height: boxSize };
            graphics.drawRectangle(boxRect, new PdfBrush({ r: 255, g: 255, b: 255 }));
            graphics.drawRectangle(boxRect, new PdfPen({ r: 100, g: 100, b: 100 }, 0.4));
            if (shape.checked) {
                const markPen: PdfPen = new PdfPen({ r: 0, g: 0, b: 0 }, 0.8);
                const markX: number = boxX + 0.4;
                const markY: number = boxY + 0.3;
                graphics.drawLine(markPen, { x: markX + 1.5, y: markY + 3 }, { x: markX + 2.2, y: markY + 4 });
                graphics.drawLine(markPen, { x: markX + 2.2, y: markY + 4 }, { x: markX + 4, y: markY + 1.4 });
            }
            if (shape.text) {
                const textFont: PdfFont = new PdfStandardFont(PdfFontFamily.helvetica, 8);
                const labelX: number = rect.x + 12.8;
                const labelW: number = Math.max(100, rect.width - 12.8);
                const textRect: Rectangle = { x: labelX, y: rect.y + (rect.height - 9) / 2, width: labelW, height: rect.height };
                graphics.drawString(shape.text, textFont, textRect, new PdfBrush({ r: 0, g: 0, b: 0 }));
            }
            return;
        }
        if (shape.formControlType === ExcelFormControlType.OptionButton || shape.type === 'radio') {
            const radSize: number = 5.8;
            const radY: number = (rect.y + (rect.height / 2)) - 2.9;
            const radX: number = rect.x + 3;
            const radRect: Rectangle = { x: radX, y: radY, width: radSize, height: radSize };
            graphics.drawEllipse(radRect, new PdfBrush({ r: 255, g: 255, b: 255 }));
            graphics.drawEllipse(radRect, new PdfPen({ r: 100, g: 100, b: 100 }, 0.4));
            if (shape.checked) {
                const dotSize: number = 3.6;
                const dotRect: Rectangle = { x: radX + 1.1, y: radY + 1.1, width: dotSize, height: dotSize };
                graphics.drawEllipse(dotRect, new PdfBrush({ r: 0, g: 0, b: 0 }));
            }
            if (shape.text) {
                const textFont: PdfFont = new PdfStandardFont(PdfFontFamily.helvetica, 8);
                const labelX: number = rect.x + 12.8;
                const labelW: number = Math.max(100, rect.width - 12.8);
                const textRect: Rectangle = { x: labelX, y: rect.y + (rect.height - 9) / 2, width: labelW, height: rect.height };
                graphics.drawString(shape.text, textFont, textRect, new PdfBrush({ r: 0, g: 0, b: 0 }));
            }
            return;
        }
        if (shape.formControlType === ExcelFormControlType.GroupBox) {
            const font: PdfFont = new PdfStandardFont(PdfFontFamily.helvetica, 8, PdfFontStyle.bold);
            const labelText: string = shape.text || '';
            const textMeasure: Size = this.measureText(labelText, font);
            const lineY: number = rect.y + 6;
            const pen: PdfPen = new PdfPen({ r: 180, g: 180, b: 180 }, 1);
            if (labelText) {
                const labelRect: Rectangle = { x: rect.x + 10, y: rect.y, width: textMeasure.width, height: 12 };
                graphics.drawString(labelText, font, labelRect, new PdfBrush({ r: 60, g: 60, b: 60 }));
                graphics.drawLine(pen, { x: rect.x, y: lineY }, { x: rect.x + 8, y: lineY });
                graphics.drawLine(pen, { x: rect.x + 12 + textMeasure.width, y: lineY }, { x: rect.x + rect.width, y: lineY });
            } else {
                graphics.drawLine(pen, { x: rect.x, y: lineY }, { x: rect.x + rect.width, y: lineY });
            }
            graphics.drawLine(pen, { x: rect.x, y: lineY }, { x: rect.x, y: rect.y + rect.height });
            graphics.drawLine(pen, { x: rect.x, y: rect.y + rect.height }, { x: rect.x + rect.width, y: rect.y + rect.height });
            graphics.drawLine(pen, { x: rect.x + rect.width, y: lineY }, { x: rect.x + rect.width, y: rect.y + rect.height });
            return;
        }
        if (shape.formControlType === ExcelFormControlType.ComboBox) {
            graphics.drawRectangle(rect, new PdfBrush({ r: 255, g: 255, b: 255 }));
            graphics.drawRectangle(rect, new PdfPen({ r: 172, g: 172, b: 172 }, 0.4));
            const btnW: number = Math.min(rect.height, rect.width);
            const btnX: number = rect.x + rect.width - btnW;
            const btnRect: Rectangle = { x: btnX, y: rect.y, width: btnW, height: rect.height };
            graphics.drawRectangle(btnRect, new PdfBrush({ r: 224, g: 224, b: 224 }));
            graphics.drawRectangle(btnRect, new PdfPen({ r: 172, g: 172, b: 172 }, 0.4));
            const p0x: number = btnRect.x + btnW / 2;
            const p0y: number = btnRect.y + btnRect.height - (btnRect.height - (btnW / 4) + 0.1) / 2;
            const p1x: number = btnRect.x + btnW / 4;
            const p1y: number = btnRect.y + (btnRect.height - (btnW / 4) + 0.1) / 2;
            const p2x: number = btnRect.x + (3 * btnW) / 4;
            const p2y: number = p1y;
            const arrowPen: PdfPen = new PdfPen({ r: 0, g: 0, b: 0 }, 0.6);
            graphics.drawLine(arrowPen, { x: p1x, y: p1y }, { x: p2x, y: p2y });
            graphics.drawLine(arrowPen, { x: p2x, y: p2y }, { x: p0x, y: p0y });
            graphics.drawLine(arrowPen, { x: p0x, y: p0y }, { x: p1x, y: p1y });
            const midY: number = (p0y + p1y) / 2;
            graphics.drawLine(arrowPen, { x: (p1x + p0x) / 2, y: midY }, { x: (p2x + p0x) / 2, y: midY });
            if (shape.text) {
                const font: PdfFont = new PdfStandardFont(PdfFontFamily.helvetica, 8);
                const comboRect: Rectangle = {
                    x: rect.x + 3,
                    y: rect.y + (rect.height - 9) / 2,
                    width: Math.max(10, rect.width - btnW - 6),
                    height: rect.height
                };
                graphics.drawString(shape.text, font, comboRect, new PdfBrush({ r: 0, g: 0, b: 0 }));
            }
            return;
        }
        if (shape.formControlType === ExcelFormControlType.ListBox) {
            graphics.drawRectangle(rect, new PdfBrush({ r: 255, g: 255, b: 255 }));
            graphics.drawRectangle(rect, new PdfPen({ r: 160, g: 160, b: 160 }, 1));
            const scrollW: number = Math.min(12, rect.width * 0.2);
            const scrollRect: Rectangle = { x: rect.x + rect.width - scrollW, y: rect.y, width: scrollW, height: rect.height };
            graphics.drawRectangle(scrollRect, new PdfBrush({ r: 240, g: 240, b: 240 }));
            graphics.drawRectangle(scrollRect, new PdfPen({ r: 200, g: 200, b: 200 }, 0.5));
            if (shape.text) {
                const font: PdfFont = new PdfStandardFont(PdfFontFamily.helvetica, 8);
                const listRect: Rectangle = { x: rect.x + 3, y: rect.y + 3, width: rect.width - scrollW - 6, height: rect.height };
                graphics.drawString(shape.text, font, listRect, new PdfBrush({ r: 0, g: 0, b: 0 }));
            }
            return;
        }
        if (shape.formControlType === ExcelFormControlType.Spinner || shape.formControlType === ExcelFormControlType.ScrollBar) {
            graphics.drawRectangle(rect, new PdfBrush({ r: 240, g: 240, b: 240 }));
            graphics.drawRectangle(rect, new PdfPen({ r: 160, g: 160, b: 160 }, 1));
            const halfH: number = rect.height / 2;
            const arrowPen: PdfPen = new PdfPen({ r: 80, g: 80, b: 80 }, 0.8);
            const divPen: PdfPen = new PdfPen({ r: 200, g: 200, b: 200 }, 0.5);
            graphics.drawLine(divPen, { x: rect.x, y: rect.y + halfH }, { x: rect.x + rect.width, y: rect.y + halfH });
            const midX: number = rect.x + rect.width / 2;
            graphics.drawLine(arrowPen, { x: midX, y: rect.y + halfH * 0.3 }, { x: midX - 3, y: rect.y + halfH * 0.7 });
            graphics.drawLine(arrowPen, { x: midX, y: rect.y + halfH * 0.3 }, { x: midX + 3, y: rect.y + halfH * 0.7 });
            graphics.drawLine(arrowPen, { x: midX, y: rect.y + halfH + halfH * 0.7 }, { x: midX - 3, y: rect.y + halfH + halfH * 0.3 });
            graphics.drawLine(arrowPen, { x: midX, y: rect.y + halfH + halfH * 0.7 }, { x: midX + 3, y: rect.y + halfH + halfH * 0.3 });
            return;
        }
        if (shape.formControlType === ExcelFormControlType.Button || shape.type === 'button') {
            graphics.drawRectangle(rect, new PdfBrush({ r: 240, g: 240, b: 240 }));
            graphics.drawRectangle(rect, new PdfPen({ r: 172, g: 172, b: 172 }, 0.5));
            const whitePen: PdfPen = new PdfPen({ r: 255, g: 255, b: 255 }, 0.5);
            const grayPen: PdfPen = new PdfPen({ r: 120, g: 120, b: 120 }, 0.5);
            graphics.drawLine(whitePen, { x: rect.x + 1, y: rect.y + 1 }, { x: rect.x + rect.width - 1, y: rect.y + 1 });
            graphics.drawLine(whitePen, { x: rect.x + 1, y: rect.y + 1 }, { x: rect.x + 1, y: rect.y + rect.height - 1 });
            graphics.drawLine(
                grayPen, { x: rect.x + 1, y: rect.y + rect.height - 1 },
                { x: rect.x + rect.width - 1, y: rect.y + rect.height - 1 }
            );
            graphics.drawLine(
                grayPen, { x: rect.x + rect.width - 1, y: rect.y + 1 },
                { x: rect.x + rect.width - 1, y: rect.y + rect.height - 1 }
            );
            if (shape.text) {
                const textFont: PdfFont = new PdfStandardFont(PdfFontFamily.helvetica, 8);
                const format: PdfStringFormat = new PdfStringFormat();
                format.alignment = PdfTextAlignment.center;
                format.lineAlignment = PdfVerticalAlignment.middle;
                const btnTextRect: Rectangle = { x: rect.x + 2, y: rect.y + 1, width: rect.width - 4, height: rect.height - 2 };
                graphics.drawString(shape.text, textFont, btnTextRect, new PdfBrush({ r: 0, g: 0, b: 0 }), format);
            }
            return;
        }
        if (shape.formControlType === ExcelFormControlType.Label || shape.type === 'textbox') {
            if (shape.fillColor) {
                graphics.drawRectangle(rect, fillBrush);
            }
            if (shape.borderColor) {
                graphics.drawRectangle(rect, borderPen);
            }
            if (shape.text) {
                const textFont: PdfFont = new PdfStandardFont(PdfFontFamily.helvetica, 8);
                const format: PdfStringFormat = new PdfStringFormat();
                format.alignment = PdfTextAlignment.left;
                format.lineAlignment = PdfVerticalAlignment.middle;
                const lblRect: Rectangle = { x: rect.x + 2, y: rect.y + 1, width: rect.width - 4, height: rect.height - 2 };
                graphics.drawString(shape.text, textFont, lblRect, new PdfBrush({ r: 0, g: 0, b: 0 }), format);
            }
            return;
        }
        graphics.drawRectangle(rect, fillBrush);
        graphics.drawRectangle(rect, borderPen);
        if (shape.text) {
            const textFont: PdfFont = new PdfStandardFont(PdfFontFamily.helvetica, 8);
            const format: PdfStringFormat = new PdfStringFormat();
            format.alignment = PdfTextAlignment.left;
            format.lineAlignment = PdfVerticalAlignment.middle;
            const shapeRect: Rectangle = { x: rect.x + 3, y: rect.y + 2, width: rect.width - 6, height: rect.height - 4 };
            graphics.drawString(shape.text, textFont, shapeRect, new PdfBrush({ r: 0, g: 0, b: 0 }), format);
        }
    }

    private drawSplitText(): void {
        while (this.splitTexts.length > 0) {
            this.pdfPageTemplate = new PdfTemplate({ width: this.sheetWidth, height: this.sheetHeight });
            this.pdfTemplateCollection.push(this.pdfPageTemplate);
            this.initializePdfPage();
            let widthValue: number = 0; let heightValue: number = 0;
            for (let splitIndex: number = 0; splitIndex < this.splitTexts.length; splitIndex++) {
                const splitItem: SplitText = this.splitTexts[splitIndex as number];
                if (splitItem.text.length > 1024) { splitItem.text = splitItem.text.substring(0, 1024); }
                const rect: Rectangle = splitItem.originRect;
                const safeSplitText: string = this.sanitizeTextForFont(splitItem.text, splitItem.font);
                const splitTextWidth: number = this.measureText(safeSplitText, splitItem.font).width;
                if (rect.width < splitTextWidth) { rect.width = splitTextWidth; }
                this.pdfPageTemplate.graphics.drawString(safeSplitText, splitItem.font, rect, splitItem.brush, splitItem.format);
                if (rect.x + rect.width <= this.pdfPageTemplate.size.width) {
                    this.splitTexts.splice(splitIndex, 1);
                    splitIndex--;
                    widthValue = Math.max(widthValue, rect.x + rect.width);
                } else {
                    splitItem.originRect = {
                        x: rect.x - this.pdfPageTemplate.size.width,
                        y: rect.y,
                        width: rect.width,
                        height: rect.height
                    };
                    widthValue = this.pdfPageTemplate.size.width;
                }
                heightValue = Math.max(heightValue, rect.y + rect.height);
            }
            const page: PdfPage = this.currentPage;
            this.updateScaledPage(this.pdfPageTemplate, page, this.pageSetup, widthValue, heightValue);
            this.drawTemplateOnPage(page, this.pdfPageTemplate, 0, 0, this.scaledPageWidth, this.scaledPageHeight);
        }
    }

    private setDocumentProperties(): void {
        if (!this.pdfDocument) { return; }
        this.pdfDocument.setDocumentInformation({
            author: this.workBook.author || '',
            title: this.workBook.title || '',
            modificationDate: new Date()
        });
    }

    public dispose(): void {
        this.fontCache.clear();
        this.splitTexts = [];
        this.pdfTemplateCollection = [];
        this.pageCollection = [];
        this.mergedRegions.clear();
        this.pageHeaderFooter = [];
        this.currentPage = null as unknown as PdfPage;
        this.pdfPageTemplate = null as unknown as PdfTemplate;
        this.pdfGraphics = null as unknown as PdfGraphics;
        this.columnWidthGetter = null as unknown as ItemSizeHelper;
        this.rowHeightGetter = null as unknown as ItemSizeHelper;
    }
}
