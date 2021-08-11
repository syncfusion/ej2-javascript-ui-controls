import {
    IGrid, PdfExportProperties, PdfHeader, PdfFooter, PdfHeaderFooterContent,
    PdfTheme, PdfThemeStyle, PdfBorder, PdfQueryCellInfoEventArgs, ExportDetailDataBoundEventArgs, ExportGroupCaptionEventArgs,
    AggregateQueryCellInfoEventArgs, ExportHelperArgs, PdfHeaderQueryCellInfoEventArgs
} from '../base/interface';
import { Column } from './../models/column';
import { Row } from './../models/row';
import * as events from '../base/constant';
import { PdfDocument, PdfPage, PdfGrid, PdfBorders, PdfPen, PdfFont, PdfPaddings } from '@syncfusion/ej2-pdf-export';
import { PdfGridRow, PdfStandardFont, PdfFontFamily, PdfFontStyle, PdfBitmap } from '@syncfusion/ej2-pdf-export';
import { PdfStringFormat, PdfTextAlignment, PdfColor, PdfSolidBrush, PdfTextWebLink } from '@syncfusion/ej2-pdf-export';
import { PdfVerticalAlignment, PdfGridCell, RectangleF, PdfPageTemplateElement } from '@syncfusion/ej2-pdf-export';
import { PointF, PdfPageNumberField, PdfCompositeField, PdfSection } from '@syncfusion/ej2-pdf-export';
import { PdfPageCountField, SizeF, PdfPageSettings, PdfPageOrientation } from '@syncfusion/ej2-pdf-export';
import { PdfTrueTypeFont } from '@syncfusion/ej2-pdf-export';
import { ExportHelper, ExportValueFormatter } from './export-helper';
import { Data } from '../actions/data';
import { ReturnType } from '../base/type';
import { SummaryModelGenerator, GroupSummaryModelGenerator, CaptionSummaryModelGenerator } from '../services/summary-model-generator';
import { AggregateColumnModel } from '../models/aggregate-model';
import { compile, getEnumValue, isNullOrUndefined, detach } from '@syncfusion/ej2-base';
import { CellType, PdfPageSize, PdfDashStyle, PdfPageNumberType, ExportType } from '../base/enum';
import { DataManager, Query, Group } from '@syncfusion/ej2-data';
import { getValue } from '@syncfusion/ej2-base';
import { Grid } from '../base/grid';
import { Cell } from '../models/cell';
import {
    getUid, getPrintGridModel, measureColumnDepth, isExportColumns,
    updateColumnTypeForExportColumns, prepareColumns
} from '../base/util';
import { ColumnModel } from '../models/models';

/**
 * `PDF Export` module is used to handle the exportToPDF action.
 *
 * @hidden
 */
export class PdfExport {
    private parent: IGrid;
    private isExporting: boolean;
    private data: Data;
    private pdfDocument: PdfDocument;
    private hideColumnInclude: boolean = false;
    private currentViewData: boolean = false;
    private customDataSource: boolean = false;
    private exportValueFormatter: ExportValueFormatter;
    private gridTheme: PdfTheme;
    private isGrouping: boolean = false;
    private helper: ExportHelper;
    private isBlob: boolean;
    private blobPromise: Promise<{ blobData: Blob }>;
    private globalResolve: Function;
    private gridPool: Object;
    private headerOnPages: number[] = [];
    private drawPosition: Object = { xPosition: 0, yPosition: 0 };
    private pdfPageSettings: PdfPageSettings;

    /**
     * Constructor for the Grid PDF Export module
     *
     * @param {IGrid} parent - specifies the IGrid
     * @hidden
     */
    constructor(parent?: IGrid) {
        this.parent = parent;
        this.helper = new ExportHelper(parent);
        this.gridPool = {};
    }

    /**
     * For internal use only - Get the module name.
     *
     * @returns {string} returns the module name
     */
    private getModuleName(): string {
        return 'PdfExport';
    }
    private init(parent: IGrid): void {
        this.exportValueFormatter = new ExportValueFormatter(parent.locale);
        this.pdfDocument = undefined;
        this.hideColumnInclude = false;
        this.currentViewData = false;
        this.parent = parent;
        this.isGrouping = false;
        this.isExporting = true;
        parent.id = getUid('main-grid');
        this.gridPool[parent.id] = false;
        this.pdfPageSettings = new PdfPageSettings();
    }

    private exportWithData(parent: IGrid, pdfDoc: Object, resolve: Function, returnType: Object,
                           pdfExportProperties: PdfExportProperties, isMultipleExport: boolean, reject: Function): void {
        this.init(parent);
        if (!isNullOrUndefined(pdfDoc)) {
            this.pdfDocument = <PdfDocument>pdfDoc;
        } else {
            this.pdfDocument = new PdfDocument();
        }
        this.processExport(parent, returnType as ReturnType, pdfExportProperties, isMultipleExport).then(() => {
            this.isExporting = false;
            parent.trigger(events.pdfExportComplete, this.isBlob ? { promise: this.blobPromise } : {});
            this.parent.log('exporting_complete', this.getModuleName());
            resolve(this.pdfDocument);
        }).catch((e: Error) => {
            reject(this.pdfDocument);
            this.parent.trigger(events.actionFailure, e);
        });
    }

    /**
     * Used to map the input data
     *
     * @param {IGrid} parent - specifies the IGrid
     * @param {PdfExportProperties} pdfExportProperties - specifies the PdfExportProperties
     * @param {boolean} isMultipleExport - specifies the isMultipleExport
     * @param {Object} pdfDoc - specifies the pdfDoc
     * @param {boolean} isBlob - speciies whether it is Blob or not
     * @returns {void}
     */
    public Map(
        parent?: IGrid, pdfExportProperties?: PdfExportProperties,
        isMultipleExport?: boolean, pdfDoc?: Object, isBlob?: boolean): Promise<Object> {
        this.data = new Data(this.parent);
        this.isBlob = isBlob;
        this.gridPool = {};
        let query: Query = new Query();
        if (parent.childGrid && !(!isNullOrUndefined(pdfExportProperties) && pdfExportProperties.hierarchyExportMode === 'None')) {
            parent.expandedRows = getPrintGridModel(parent).expandedRows;
        }
        const args: Object = {
            requestType: 'beforePdfExport', cancel: false,
            headerPageNumbers: [], gridDrawPosition: { xPosition: 0, yPosition: 0 }, generateQuery : false
        };
        const gridObject: string = 'gridObject';
        args[gridObject] = parent;
        const can: string = 'cancel';
        const generateQuery : string = 'generateQuery';
        const header: string = 'headerPageNumbers';
        const drawPos: string = 'gridDrawPosition';
        parent.trigger(events.beforePdfExport, args);
        if (args[can] === true) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            return new Promise((resolve: Function, reject: Function) => {
                return resolve();
            });
        }
        if (isExportColumns(pdfExportProperties)) {
            updateColumnTypeForExportColumns(pdfExportProperties, parent);
        }
        if (args[generateQuery]) {
            query = ExportHelper.getQuery(parent, this.data);
        }
        this.headerOnPages = args[header];
        this.drawPosition = args[drawPos];
        this.parent.log('exporting_begin', this.getModuleName());
        if (!isNullOrUndefined(pdfExportProperties) && !isNullOrUndefined(pdfExportProperties.dataSource)
            && pdfExportProperties.dataSource instanceof DataManager) {
            return new Promise((resolve: Function, reject: Function) => {
                (<DataManager>pdfExportProperties.dataSource).executeQuery(query).then((returnType: Object) => {
                    this.exportWithData(parent, pdfDoc, resolve, returnType, pdfExportProperties, isMultipleExport, reject);
                });
            });
        } else if (!isNullOrUndefined(pdfExportProperties) && pdfExportProperties.exportType === 'CurrentPage') {
            return new Promise((resolve: Function, reject: Function) => {
                this.exportWithData(parent, pdfDoc, resolve, this.parent.getCurrentViewRecords(), pdfExportProperties,
                                    isMultipleExport, reject);
            });
        } else {
            const allPromise: Promise<Object>[] = [];
            allPromise.push(this.data.getData({}, ExportHelper.getQuery(parent, this.data)));
            allPromise.push(this.helper.getColumnData(<Grid>parent));
            return new Promise((resolve: Function, reject: Function) => {
                Promise.all(allPromise).then((e: ReturnType[]) => {
                    this.init(parent);
                    if (!isNullOrUndefined(pdfDoc)) {
                        this.pdfDocument = <PdfDocument>pdfDoc;
                    } else {
                        this.pdfDocument = new PdfDocument();
                    }
                    this.processExport(parent, e[0], pdfExportProperties, isMultipleExport).then(() => {
                        this.isExporting = false;
                        parent.trigger(events.pdfExportComplete, this.isBlob ? { promise: this.blobPromise } : {});
                        this.parent.log('exporting_complete', this.getModuleName());
                        resolve(this.pdfDocument);
                    }).catch((e: Error) => {
                        reject(this.pdfDocument);
                        this.parent.trigger(events.actionFailure, e);
                    });
                });
            });
        }
    }

    private processExport(gObj: IGrid, returnType: ReturnType,
                          pdfExportProperties: PdfExportProperties, isMultipleExport: boolean): Promise<Object> {
        const section: PdfSection = this.pdfDocument.sections.add() as PdfSection;
        let pdfGrid: PdfGrid;
        this.processSectionExportProperties(section, pdfExportProperties);
        const pdfPage: PdfPage = section.pages.add();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return new Promise((resolve: Function, reject: Function) => {
            pdfGrid = <PdfGrid>this.processGridExport(gObj, returnType, pdfExportProperties);
            this.globalResolve = resolve;
            this.gridPool[gObj.id] = true;
            this.helper.checkAndExport(this.gridPool, this.globalResolve);
        }).then(() => {
            // draw the grid
            const xPosition: string = 'xPosition';
            const yPosition: string = 'yPosition';
            pdfGrid.draw(pdfPage, this.drawPosition[xPosition], this.drawPosition[yPosition]);
            this.drawHeader(pdfExportProperties);
            if (!isMultipleExport) {
                // save the PDF
                if (!this.isBlob) {
                    if (!isNullOrUndefined(pdfExportProperties) && pdfExportProperties.fileName) {
                        this.pdfDocument.save(pdfExportProperties.fileName);
                    } else {
                        this.pdfDocument.save('Export.pdf');
                    }
                } else {
                    this.blobPromise = this.pdfDocument.save();
                }
                this.pdfDocument.destroy();
                delete gObj.expandedRows;
            }
            return this.pdfDocument;
        });
    }

    private processSectionExportProperties(section: PdfSection, pdfExportProperties: PdfExportProperties): PdfSection {
        if (!isNullOrUndefined(pdfExportProperties) && (!isNullOrUndefined(pdfExportProperties.pageOrientation)
            || !isNullOrUndefined(pdfExportProperties.pageSize))) {
            this.pdfPageSettings.orientation = (pdfExportProperties.pageOrientation === 'Landscape') ?
                PdfPageOrientation.Landscape : PdfPageOrientation.Portrait;
            this.pdfPageSettings.size = this.getPageSize(pdfExportProperties.pageSize);
            section.setPageSettings(this.pdfPageSettings);
        }
        return section;
    }

    private processGridExport(gObj: IGrid, returnType: ReturnType, pdfExportProperties: PdfExportProperties): PdfGrid {
        let allowHorizontalOverflow: boolean = true;
        const isFrozen: boolean = this.parent.isFrozenGrid() && !this.parent.getFrozenColumns();
        if (!isNullOrUndefined(pdfExportProperties)) {
            this.gridTheme = pdfExportProperties.theme;
            allowHorizontalOverflow = isNullOrUndefined(pdfExportProperties.allowHorizontalOverflow) ?
                true : pdfExportProperties.allowHorizontalOverflow;
        }
        const helper: ExportHelper = new ExportHelper(gObj, this.helper.getForeignKeyData());
        const dataSource: Object[] | Group = this.processExportProperties(pdfExportProperties, returnType.result);
        let columns: Column[] = isExportColumns(pdfExportProperties) ?
            prepareColumns(pdfExportProperties.columns, gObj.enableColumnVirtualization) :
            helper.getGridExportColumns(isFrozen ? gObj.getColumns() : gObj.columns as Column[]);
        columns = columns.filter((columns: Column) => { return isNullOrUndefined(columns.commands); });
        let isGrouping: boolean = false;
        if (gObj.groupSettings.columns.length) {
            isGrouping = true;
        }

        if (gObj.childGrid && !isNullOrUndefined(pdfExportProperties)) {
            gObj.hierarchyPrintMode = pdfExportProperties.hierarchyExportMode || 'Expanded';
        }

        // create a grid
        let pdfGrid: PdfGrid = new PdfGrid();

        // get header theme style
        const headerThemeStyle: IThemeStyles = this.getHeaderThemeStyle();

        let border: PdfBorders = headerThemeStyle.border;
        const headerFont: PdfFont = headerThemeStyle.font;
        const headerBrush: PdfSolidBrush = headerThemeStyle.brush;
        const returnValue: { rows: Row<Column>[], columns: Column[] } = helper.getHeaders(columns, this.hideColumnInclude);

        // Column collection with respect to the records in the grid
        const gridColumns: Column[] = returnValue.columns;

        // process grid header content
        pdfGrid = this.processGridHeaders(gObj.groupSettings.columns.length, pdfGrid, returnValue.rows,
                                          gridColumns, border, headerFont, headerBrush, gObj, allowHorizontalOverflow, columns);

        // set alignment, width and type of the values of the column
        this.setColumnProperties(gridColumns, pdfGrid, helper, gObj, allowHorizontalOverflow);
        const captionThemeStyle: IThemeStyles = this.getSummaryCaptionThemeStyle();
        if (!isNullOrUndefined(dataSource) && dataSource.length) {
            if (isGrouping) {
                if (!isNullOrUndefined(captionThemeStyle.border)) {
                    border = captionThemeStyle.border;
                }
                this.processGroupedRecords(pdfGrid, dataSource, gridColumns, gObj, border, 0, captionThemeStyle.font, captionThemeStyle.
                    brush, captionThemeStyle.backgroundBrush, returnType, pdfExportProperties, helper, 0);
            } else {
                this.processRecord(border, gridColumns, gObj, dataSource, pdfGrid, 0, pdfExportProperties, helper, 0);
            }
            if (!isNullOrUndefined(returnType.aggregates)) {
                const summaryModel: SummaryModelGenerator = new SummaryModelGenerator(gObj);
                let sRows: Row<AggregateColumnModel>[];
                let column: Column[] =  summaryModel.getColumns();
                column = column.filter((col: Column) => { return isNullOrUndefined(col.commands) && col.type !== 'checkbox'; });
                if (gObj.aggregates.length && this.parent !== gObj) {
                    gObj.aggregateModule.prepareSummaryInfo();
                }
                if (this.customDataSource) {
                    sRows = summaryModel.generateRows(dataSource, <SummaryData>returnType.aggregates);
                } else if (this.currentViewData) {
                    sRows = summaryModel.generateRows(this.parent.getCurrentViewRecords(), <SummaryData>returnType.aggregates);
                } else if (isGrouping) {
                    sRows = summaryModel.generateRows((<Group>dataSource).records, <SummaryData>returnType.aggregates);
                } else {
                    sRows = summaryModel.generateRows(returnType.result, <SummaryData>returnType.aggregates, null, null, column);
                }
                this.processAggregates(sRows, pdfGrid, border, captionThemeStyle.font,
                                       captionThemeStyle.brush, captionThemeStyle.backgroundBrush, false);
            }
        } else {
            const row: PdfGridRow = pdfGrid.rows.addRow();
            row.style.setBorder(border);
        }
        return pdfGrid;
    }

    private getSummaryCaptionThemeStyle(): IThemeStyles {
        if (!isNullOrUndefined(this.gridTheme) && !isNullOrUndefined(this.gridTheme.caption)) {
            const fontSize: number = !isNullOrUndefined(this.gridTheme.caption.fontSize) ? this.gridTheme.caption.fontSize : 9.75;
            const fontFamily: number = !isNullOrUndefined(this.gridTheme.caption.fontName) ?
                this.getFontFamily(this.gridTheme.caption.fontName) : PdfFontFamily.Helvetica;
            const fontStyle: PdfFontStyle = this.getFontStyle(this.gridTheme.caption);
            let pdfColor: PdfColor = new PdfColor(0, 0, 0);
            if (!isNullOrUndefined(this.gridTheme.caption.fontColor)) {
                const penBrushColor: { r: number, g: number, b: number } = this.hexToRgb(this.gridTheme.caption.fontColor);
                pdfColor = new PdfColor(penBrushColor.r, penBrushColor.g, penBrushColor.b);
            }
            const borderCaption: PdfBorders = this.gridTheme.caption.border ? this.getBorderStyle(this.gridTheme.caption.border) : null;
            let font: PdfStandardFont | PdfTrueTypeFont = new PdfStandardFont(fontFamily, fontSize, fontStyle);
            if (!isNullOrUndefined(this.gridTheme.caption.font)) {
                font = this.gridTheme.caption.font;
            }
            return { font: font, brush: new PdfSolidBrush(pdfColor), backgroundBrush: new PdfSolidBrush(new PdfColor(246, 246, 246)),
                border: borderCaption};
        } else {
            //Material theme
            return { font: new PdfStandardFont(PdfFontFamily.Helvetica, 9.75), brush: new PdfSolidBrush(new PdfColor(0, 0, 0)),
                backgroundBrush: new PdfSolidBrush(new PdfColor(246, 246, 246)) };
        }
    }

    private getGridPdfFont(args: PdfTheme): void {
        const fontFamily: string = 'fontFamily';
        const fontSize: string = 'fontSize';
        const fontStyle: string = 'fontStyle';
        const isTrueType: string = 'isTrueType';
        let style: number = 0;
        if (args.header && args.header.font) {
            const headerFont: string = args.header.font[fontFamily];
            const headerSize: number = args.header.font[fontSize];
            const headerStyle: string = args.header.font[fontStyle];
            style = (isNullOrUndefined(PdfFontStyle[headerStyle]) ? 0 : PdfFontStyle[headerStyle]);
            if (args.header.font[isTrueType]) {
                args.header.font = new PdfTrueTypeFont(headerFont, headerSize, style);
            } else {
                const fontFamily: number = !isNullOrUndefined(headerFont) ?
                    this.getFontFamily(headerFont) : PdfFontFamily.Helvetica;
                args.header.font = new PdfStandardFont(fontFamily, headerSize, style);
            }
        }
        if (args.caption && args.caption.font) {
            const captionFont: string = args.caption.font[fontFamily];
            const captionSize: number = args.caption.font[fontSize];
            const captionStyle: string = args.caption.font[fontStyle];
            style = (isNullOrUndefined(PdfFontStyle[captionStyle]) ? 0 : PdfFontStyle[captionStyle]);
            if (args.caption.font[isTrueType]) {
                args.caption.font = new PdfTrueTypeFont(captionFont, captionSize, style);
            } else {
                const fontFamily: number = !isNullOrUndefined(captionFont) ?
                    this.getFontFamily(captionFont) : PdfFontFamily.Helvetica;
                args.caption.font = new PdfStandardFont(fontFamily, captionSize, style);
            }
        }
        if (args.record && args.record.font) {
            const recordFont: string = args.record.font[fontFamily];
            const recordSize: number = args.record.font[fontSize];
            const recordStyle: string = args.record.font[fontStyle];
            style = (isNullOrUndefined(PdfFontStyle[recordStyle]) ? 0 : PdfFontStyle[recordStyle]);
            if (args.record.font[isTrueType]) {
                args.record.font = new PdfTrueTypeFont(recordFont, recordSize, style);
            } else {
                const fontFamily: number = !isNullOrUndefined(recordFont) ?
                    this.getFontFamily(recordFont) : PdfFontFamily.Helvetica;
                args.record.font = new PdfStandardFont(fontFamily, recordSize, style);
            }
        }
    }

    private getHeaderThemeStyle(): IThemeStyles {
        const border: PdfBorders = new PdfBorders();
        if (!isNullOrUndefined(this.gridTheme) && !isNullOrUndefined(this.gridTheme.header)) {
            const fontFamily: number = !isNullOrUndefined(this.gridTheme.header.fontName) ?
                this.getFontFamily(this.gridTheme.header.fontName) : PdfFontFamily.Helvetica;
            const fontStyle: PdfFontStyle = this.getFontStyle(this.gridTheme.header);
            const fontSize: number = !isNullOrUndefined(this.gridTheme.header.fontSize) ? this.gridTheme.header.fontSize : 10.5;
            let pdfColor: PdfColor = new PdfColor();
            if (!isNullOrUndefined(this.gridTheme.header.fontColor)) {
                const penBrushColor: { r: number, g: number, b: number } = this.hexToRgb(this.gridTheme.header.fontColor);
                pdfColor = new PdfColor(penBrushColor.r, penBrushColor.g, penBrushColor.b);
            }

            let font: PdfStandardFont | PdfTrueTypeFont = new PdfStandardFont(fontFamily, fontSize, fontStyle);
            if (!isNullOrUndefined(this.gridTheme.header.font)) {
                font = this.gridTheme.header.font;
            }
            return { border: this.getBorderStyle(this.gridTheme.header.border), font: font, brush: new PdfSolidBrush(pdfColor) };
        } else {
            //Material theme
            border.all = new PdfPen(new PdfColor(234, 234, 234));
            return { border: border, font: new PdfStandardFont(PdfFontFamily.Helvetica, 10.5),
                brush: new PdfSolidBrush(new PdfColor(102, 102, 102)) };
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private processGroupedRecords(pdfGrid: PdfGrid, dataSource: any, gridColumns: Column[], gObj: IGrid, border: PdfBorders, level: number,
                                  font: PdfFont, brush: PdfSolidBrush, backgroundBrush: PdfSolidBrush, returnType: ReturnType,
                                  pdfExportProperties: PdfExportProperties, helper: ExportHelper, index: number): void {
        const groupIndex: number = level;
        for (const dataSourceItems of dataSource) {
            const row: PdfGridRow = pdfGrid.rows.addRow();
            const col: Column = gObj.getColumnByField(dataSourceItems.field);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const args: any = {
                value: dataSourceItems.key,
                column: col,
                style: undefined,
                isForeignKey: col.isForeignColumn()
            };
            const value: string = this.parent.getColumnByField(dataSourceItems.field).headerText + ': ' + (!col.enableGroupByFormat ? this.exportValueFormatter.formatCellValue(args) : dataSourceItems.key) + ' - ' + dataSourceItems.count + (dataSource.count > 1 ? ' items' : ' item');
            const cArgs: ExportGroupCaptionEventArgs = { captionText: value, type: 'PDF' };
            this.parent.trigger(events.exportGroupCaption, cArgs, (cArgs: ExportGroupCaptionEventArgs) => {
                row.cells.getCell(groupIndex).value = cArgs.captionText;
                row.cells.getCell(groupIndex + 1).style.stringFormat = new PdfStringFormat(PdfTextAlignment.Left);
                row.style.setBorder(border);
                row.style.setFont(font);
                row.style.setTextBrush(brush);
                row.style.setBackgroundBrush(backgroundBrush);
                let sRows: Row<AggregateColumnModel>[];
                const captionSummaryModel: CaptionSummaryModelGenerator = new CaptionSummaryModelGenerator(gObj);
                if (!isNullOrUndefined(dataSourceItems.items.records)) {
                    sRows = captionSummaryModel.generateRows(dataSourceItems.items.records, dataSourceItems);
                } else {
                    sRows = captionSummaryModel.generateRows(dataSourceItems.items, dataSourceItems);
                }
                if (!isNullOrUndefined(sRows) && sRows.length === 0) {
                    row.cells.getCell(groupIndex + 1).columnSpan = pdfGrid.columns.count - (groupIndex + 1);
                }
                if (!isNullOrUndefined(dataSource.childLevels) && dataSource.childLevels > 0) {
                    this.processAggregates(sRows, pdfGrid, border, font, brush, backgroundBrush, true, row, groupIndex);
                    this.processGroupedRecords(pdfGrid, dataSourceItems.items, gridColumns, gObj, border, (groupIndex + 1), font, brush,
                                               backgroundBrush, returnType, pdfExportProperties, helper, index);
                    const groupSummaryModel: GroupSummaryModelGenerator = new GroupSummaryModelGenerator(gObj);
                    sRows = groupSummaryModel.generateRows(dataSourceItems.items.records, dataSourceItems);
                    this.processAggregates(sRows, pdfGrid, border, font, brush, backgroundBrush, false);
                } else {
                    this.processAggregates(sRows, pdfGrid, border, font, brush, backgroundBrush, true, row, groupIndex);
                    index = this.processRecord(border, gridColumns, gObj, dataSourceItems.items,
                                               pdfGrid, (groupIndex + 1), pdfExportProperties, helper, index);
                    const groupSummaryModel: GroupSummaryModelGenerator = new GroupSummaryModelGenerator(gObj);
                    sRows = groupSummaryModel.generateRows(dataSourceItems.items, dataSourceItems);
                    const isGroupedFooter: boolean = true ;
                    this.processAggregates(sRows, pdfGrid, border, font, brush, backgroundBrush, false, null, null, isGroupedFooter);
                }
            });
        }
    }
    private processGridHeaders(childLevels: number, pdfGrid: PdfGrid, rows: Row<Column>[],
                               gridColumn: Column[], border: PdfBorders, headerFont: PdfFont, headerBrush: PdfSolidBrush, grid: IGrid,
                               allowHorizontalOverflow: boolean, eCols: Column[]): PdfGrid {
        const columnCount: number = gridColumn.length + childLevels;
        const depth: number = measureColumnDepth(eCols);
        const cols: Column[] | string[] | ColumnModel[] = eCols;
        let index: number = 0;
        if (this.parent.allowGrouping) {
            index = this.parent.groupSettings.columns.length;
        }
        pdfGrid.columns.add(columnCount);
        pdfGrid.headers.add(rows.length);
        const applyTextAndSpan: Function = (rowIdx: number, colIdx: number, col: Column, rowSpan: number, colSpan: number) => {
            const gridHeader: PdfGridRow = pdfGrid.headers.getHeader(rowIdx);
            const pdfCell: PdfGridCell = gridHeader.cells.getCell(colIdx);
            const cell: Cell<Column> = rows[rowIdx].cells[colIdx];
            if (!isNullOrUndefined((col as Column).headerTextAlign)) {
                pdfCell.style.stringFormat = this.getHorizontalAlignment(col.headerTextAlign);
            }
            if (rowSpan > 0) {
                pdfCell.rowSpan = rowSpan;
                pdfCell.style.stringFormat = this.getVerticalAlignment('Bottom', pdfCell.style.stringFormat, col.textAlign);
            }
            if (colSpan > 0) {
                pdfCell.columnSpan = colSpan;
            }
            gridHeader.style.setBorder(border);
            gridHeader.style.setFont(headerFont);
            gridHeader.style.setTextBrush(headerBrush);
            pdfCell.value = col.headerText;
            if (!isNullOrUndefined(cell) && (cell.cellType === CellType.HeaderIndent || cell.cellType === CellType.DetailHeader)) {
                pdfCell.value = '';
                pdfCell.width = 20;
            }
            const args: Object = {
                cell: pdfCell,
                gridCell: cell,
                style: pdfCell.style
            };
            this.parent.trigger(events.pdfHeaderQueryCellInfo, args);
            const evtArgs: PdfHeaderQueryCellInfoEventArgs = args;
            if (!isNullOrUndefined(evtArgs.image)) {
                pdfCell.value = new PdfBitmap(evtArgs.image.base64);
            }
            if (!isNullOrUndefined(evtArgs.hyperLink)) {
                pdfCell.value = this.setHyperLink(evtArgs);
            }
        };
        const recuHeader: Function = (cols: Column[], depth: number, spanCnt: number, colIndex: number,
                                      rowIndex: number, isRoot: boolean) => {
            let cidx: number = 0;
            for (let i: number = 0; i < cols.length; i++) {
                if (isRoot) {
                    cidx = cidx + spanCnt + (i === 0 ? 0 : -1);
                    colIndex = cidx;
                    spanCnt = 0;
                }
                if (!isRoot && !cols[i].visible) {
                    colIndex = colIndex - 1;
                }
                if ((cols[i] as Column).columns && (cols[i] as Column).columns.length) {
                    const newSpanCnt: number = recuHeader((cols[i] as Column).columns, depth - 1, 0, i + colIndex, rowIndex + 1, false);
                    applyTextAndSpan(rowIndex, i + colIndex + index, cols[i] as Column, 0, newSpanCnt);
                    spanCnt = spanCnt + newSpanCnt;
                    colIndex = colIndex + newSpanCnt - 1;
                } else if (cols[i].visible || this.hideColumnInclude) {
                    spanCnt++;
                    applyTextAndSpan(rowIndex, i + colIndex + index, cols[i] as Column, depth, 0);
                }
            }
            return spanCnt;
        };
        recuHeader(cols, depth, 0, 0, 0, true);
        if (pdfGrid.columns.count >= 6 && allowHorizontalOverflow) {
            pdfGrid.style.allowHorizontalOverflow = true;
        }
        return pdfGrid;
    }
    private processExportProperties(pdfExportProperties: PdfExportProperties, dataSource: Object[]): Object[] {
        if (!isNullOrUndefined(pdfExportProperties)) {
            if (!isNullOrUndefined(pdfExportProperties.theme)) {
                this.gridTheme = pdfExportProperties.theme;
            }
            const clientSize: SizeF = this.pdfPageSettings.size;
            this.drawHeader(pdfExportProperties);
            if (!isNullOrUndefined(pdfExportProperties.footer)) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const footer: any = pdfExportProperties.footer;
                const position: PointF = new PointF(0, ((clientSize.width - 80) - (footer.fromBottom * 0.75)));
                const size: SizeF = new SizeF((clientSize.width - 80), (footer.height * 0.75));
                const bounds: RectangleF = new RectangleF(position, size);
                this.pdfDocument.template.bottom = this.drawPageTemplate(new PdfPageTemplateElement(bounds), footer);
            }
            if (!isNullOrUndefined(pdfExportProperties.includeHiddenColumn) && !this.isGrouping) {
                this.hideColumnInclude = pdfExportProperties.includeHiddenColumn;
            }
            if (!isNullOrUndefined(pdfExportProperties.dataSource)) {
                if (!(pdfExportProperties.dataSource instanceof DataManager)) {
                    dataSource = pdfExportProperties.dataSource as Object[];
                }
                this.customDataSource = true;
                this.currentViewData = false;
            } else if (!isNullOrUndefined(pdfExportProperties.exportType)) {
                if (pdfExportProperties.exportType === 'CurrentPage') {
                    dataSource = this.parent.currentViewData;
                    this.currentViewData = true;
                    this.customDataSource = false;
                } else {
                    this.currentViewData = false;
                    this.customDataSource = false;
                }
            } else {
                this.currentViewData = false;
                this.customDataSource = false;
            }
        } else {
            this.currentViewData = false;
            this.customDataSource = false;
        }
        return dataSource;
    }

    private drawHeader(pdfExportProperties: PdfExportProperties): void {
        const clientSize: SizeF = this.pdfPageSettings.size;
        if (!isNullOrUndefined(pdfExportProperties) && !isNullOrUndefined(pdfExportProperties.header)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const header: any = pdfExportProperties.header;
            const position: PointF = new PointF(0, header.fromTop);
            const size: SizeF = new SizeF((clientSize.width - 80), (header.height * 0.75));
            const bounds: RectangleF = new RectangleF(position, size);
            if (!this.headerOnPages.length) {
                this.pdfDocument.template.top = this.drawPageTemplate(new PdfPageTemplateElement(bounds), header);
            } else {
                const headerTemplate: PdfPageTemplateElement = this.drawPageTemplate(new PdfPageTemplateElement(bounds), header);
                this.headerOnPages.filter((index: number) => {
                    if (index - 1 >= 0 && index - 1 < this.pdfDocument.pages.count - 1) {
                        this.pdfDocument.pages.getPageByIndex(index - 1).graphics
                            .drawPdfTemplate(headerTemplate.template, new PointF(0, 0));
                    }
                });
            }
        }
    }

    private drawPageTemplate(template: PdfPageTemplateElement, element: PdfHeader | PdfFooter): PdfPageTemplateElement {
        for (const content of element.contents) {
            this.processContentValidation(content);
            switch (content.type) {
            case 'Text':
                if (content.value === '' || content.value === undefined || content.value === null || typeof content.value !== 'string') {
                    throw new Error('please enter the valid input value in text content...');
                }
                this.drawText(template, content);
                break;
            case 'PageNumber':
                this.drawPageNumber(template, content);
                break;
            case 'Image':
                if (content.src === undefined || content.src === null || content.src === '') {
                    throw new Error('please enter the valid base64 string in image content...');
                }
                this.drawImage(template, content);
                break;
            case 'Line':
                this.drawLine(template, content);
                break;
            default:
                throw new Error('Please set valid content type...');
            }
        }
        return template;
    }

    private processContentValidation(content: PdfHeaderFooterContent): void {
        if (content.type === undefined || content.type === null) {
            throw new Error('please set valid content type...');
        } else {
            if (content.type === 'Line') {
                if (content.points === undefined || content.points === null) {
                    throw new Error('please enter valid points in ' + content.type + ' content...');
                } else {
                    if (content.points.x1 === undefined || content.points.x1 === null || typeof content.points.x1 !== 'number') {
                        throw new Error('please enter valid x1 co-ordinate in ' + content.type + ' points...');
                    }
                    if (content.points.y1 === undefined || content.points.y1 === null || typeof content.points.y1 !== 'number') {
                        throw new Error('please enter valid y1 co-ordinate in ' + content.type + ' points...');
                    }
                    if (content.points.x2 === undefined || content.points.x2 === null || typeof content.points.x2 !== 'number') {
                        throw new Error('please enter valid x2 co-ordinate in ' + content.type + ' points...');
                    }
                    if (content.points.y2 === undefined || content.points.y2 === null || typeof content.points.y2 !== 'number') {
                        throw new Error('please enter valid y2 co-ordinate in ' + content.type + ' points...');
                    }
                }
            } else {
                if (content.position === undefined || content.position === null) {
                    throw new Error('please enter valid position in ' + content.type + ' content...');
                } else {
                    if (content.position.x === undefined || content.position.x === null || typeof content.position.x !== 'number') {
                        throw new Error('please enter valid x co-ordinate in ' + content.type + ' position...');
                    }
                    if (content.position.y === undefined || content.position.y === null || typeof content.position.y !== 'number') {
                        throw new Error('please enter valid y co-ordinate in ' + content.type + ' position...');
                    }
                }
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private drawText(pageTemplate: PdfPageTemplateElement, content: any): void {
        const font: PdfFont = this.getFont(content);
        let brush: PdfSolidBrush = this.getBrushFromContent(content);
        let pen: PdfPen = null;
        if (!isNullOrUndefined(content.style.textPenColor)) {
            const penColor: { r: number, g: number, b: number } = this.hexToRgb(content.style.textPenColor);
            pen = new PdfPen(new PdfColor(penColor.r, penColor.g, penColor.b));
        }
        if (brush == null && pen == null) {
            brush = new PdfSolidBrush(new PdfColor(0, 0, 0));
        }
        const value: string = content.value.toString();
        const x: number = content.position.x * 0.75;
        const y: number = content.position.y * 0.75;
        const format: PdfStringFormat = new PdfStringFormat();
        const result: { format: PdfStringFormat, size: SizeF } = this.setContentFormat(content, format);
        if (result !== null && !isNullOrUndefined(result.format) && !isNullOrUndefined(result.size)) {
            pageTemplate.graphics.drawString(value, font, pen, brush, x, y, result.size.width, result.size.height, result.format);
        } else {
            pageTemplate.graphics.drawString(value, font, pen, brush, x, y, format);
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private drawPageNumber(documentHeader: PdfPageTemplateElement, content: any): void {
        const font: PdfFont = this.getFont(content);
        let brush: PdfSolidBrush = null;
        if (!isNullOrUndefined(content.style.textBrushColor)) {
            const brushColor: { r: number, g: number, b: number } = this.hexToRgb(content.style.textBrushColor);
            brush = new PdfSolidBrush(new PdfColor(brushColor.r, brushColor.g, brushColor.b));
        } else {
            brush = new PdfSolidBrush(new PdfColor(0, 0, 0));
        }
        const pageNumber: PdfPageNumberField = new PdfPageNumberField(font, brush);
        pageNumber.numberStyle = this.getPageNumberStyle(content.pageNumberType);
        let compositeField: PdfCompositeField;
        let format: string;
        if (!isNullOrUndefined(content.format)) {
            const total: string = '$total';
            const current: string = '$current';
            if ((content.format as string).indexOf(total) !== -1 && (content.format as string).indexOf(current) !== -1) {
                const pageCount: PdfPageCountField = new PdfPageCountField(font);
                pageCount.numberStyle = this.getPageNumberStyle(content.pageNumberType);
                if ((content.format as string).indexOf(total) > (content.format as string).indexOf(current)) {
                    format = (content.format as string).replace(current, '0');
                    format = format.replace(total, '1');
                } else {
                    format = (content.format as string).replace(current, '1');
                    format = format.replace(total, '0');
                }
                compositeField = new PdfCompositeField(font, brush, format, pageNumber, pageCount);
            } else if ((content.format as string).indexOf(current) !== -1 && (content.format as string).indexOf(total) === -1) {
                format = (content.format as string).replace(current, '0');
                compositeField = new PdfCompositeField(font, brush, format, pageNumber);
            } else {
                const pageCount: PdfPageCountField = new PdfPageCountField(font);
                format = (content.format as string).replace(total, '0');
                compositeField = new PdfCompositeField(font, brush, format, pageCount);
            }
        } else {
            format = '{0}';
            compositeField = new PdfCompositeField(font, brush, format, pageNumber);
        }
        const x: number = content.position.x * 0.75;
        const y: number = content.position.y * 0.75;
        const result: { format: PdfStringFormat, size: SizeF } = this.setContentFormat(content, compositeField.stringFormat);
        if (result !== null && !isNullOrUndefined(result.format) && !isNullOrUndefined(result.size)) {
            compositeField.stringFormat = result.format;
            compositeField.bounds = new RectangleF(x, y, result.size.width, result.size.height);
        }
        compositeField.draw(documentHeader.graphics, x, y);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private drawImage(documentHeader: PdfPageTemplateElement, content: any): void {
        const x: number = content.position.x * 0.75;
        const y: number = content.position.y * 0.75;
        const width: number = (!isNullOrUndefined(content.size)) ? (content.size.width * 0.75) : undefined;
        const height: number = (!isNullOrUndefined(content.size)) ? (content.size.height * 0.75) : undefined;
        const image: PdfBitmap = new PdfBitmap(content.src);
        if (!isNullOrUndefined(width)) {
            documentHeader.graphics.drawImage(image, x, y, width, height);
        } else {
            documentHeader.graphics.drawImage(image, x, y);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private drawLine(documentHeader: PdfPageTemplateElement, content: any): void {
        const x1: number = content.points.x1 * 0.75;
        const y1: number = content.points.y1 * 0.75;
        const x2: number = content.points.x2 * 0.75;
        const y2: number = content.points.y2 * 0.75;
        const pen: PdfPen = this.getPenFromContent(content);
        if (!isNullOrUndefined(content.style) && content.style !== null) {
            if (!isNullOrUndefined(content.style.penSize) && content.style.penSize !== null && typeof content.style.penSize === 'number') {
                pen.width = content.style.penSize * 0.75;
            }
            pen.dashStyle = this.getDashStyle(content.style.dashStyle);
        }
        documentHeader.graphics.drawLine(pen, x1, y1, x2, y2);
    }

    private processAggregates(
        sRows: Row<AggregateColumnModel>[], pdfGrid: PdfGrid, border: PdfBorders, font: PdfFont,
        brush: PdfSolidBrush, backgroundBrush: PdfSolidBrush, isCaption: boolean,
        captionRow?: PdfGridRow, groupIndex?: number, isGroupedFooter?: boolean
    ): void {
        for (const row of sRows) {
            let leastCaptionSummaryIndex: number = -1;
            let index: number = 0;
            let isEmpty: boolean = true;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const value: any[] = [];
            for (let i: number = 0; i < pdfGrid.columns.count; i++) {
                let cell: Cell<AggregateColumnModel> = row.cells[index];
                if (cell.cellType === CellType.DetailFooterIntent) {
                    i--; index++;
                    continue;
                }
                if (!this.hideColumnInclude) {
                    while (cell.visible === undefined) {
                        if (cell.cellType === CellType.DetailFooterIntent) {
                            continue;
                        }
                        if (!isNullOrUndefined(captionRow)) {
                            if (!isNullOrUndefined(captionRow.cells.getCell(i).value)) {
                                const args: AggregateQueryCellInfoEventArgs = { row: row, type: 'GroupCaption', style: captionRow.cells };
                                this.parent.trigger(events.pdfAggregateQueryCellInfo, args);
                                value.push('');
                                value.push(captionRow.cells.getCell(i).value);
                                isEmpty = false;
                                if (!isCaption) {
                                    i += 1;
                                }
                            } else {
                                value.push('');
                            }
                        } else {
                            value.push('');
                        }
                        i += 1;
                        index = index + 1;
                        cell = row.cells[index];
                    }
                    while (!isNullOrUndefined(cell.visible) && !cell.visible) {
                        index = index + 1;
                        cell = row.cells[index];
                    }
                }
                if (cell.isDataCell) {
                    let templateFn: { [x: string]: Function } = {};
                    if (!isNullOrUndefined(cell.column.footerTemplate) || !isNullOrUndefined(cell.column.groupCaptionTemplate)
                        || !isNullOrUndefined(cell.column.groupFooterTemplate)) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const result: any = this.getTemplateFunction(templateFn, i, leastCaptionSummaryIndex, cell);
                        templateFn = result.templateFunction;
                        leastCaptionSummaryIndex = result.leastCaptionSummaryIndex;
                        let txt: NodeList;
                        const data: Object = row.data[cell.column.field ? cell.column.field : cell.column.columnName];
                        if (this.parent.isReact || this.parent.isVue) {
                            txt = (templateFn[getEnumValue(CellType, cell.cellType)](data, this.parent));
                            if (this.parent.isReact) {
                                this.parent.renderTemplates();
                            }
                        } else {
                            txt = (templateFn[getEnumValue(CellType, cell.cellType)](data));
                        }
                        value.push((<Text>txt[0]).textContent);
                        isEmpty = false;
                    } else {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const result: any = this.getSummaryWithoutTemplate(row.data[cell.column.field]);
                        if (!isNullOrUndefined(result)) {
                            value.push(result);
                        }
                    }
                } else {
                    value.push('');
                }
                if (isEmpty && value[i] !== '' && !isNullOrUndefined(value[i]) && value[i] !== null) {
                    isEmpty = false;
                }
                index += 1;
            }
            if (isCaption) {
                for (let i: number = (this.parent.groupSettings.columns.length) + 1; i < value.length - 1; i++) {
                    value[i] = value[i + 1]; }}
            if (!isEmpty) {
                if (!isCaption) {
                    const gridRow: PdfGridRow = pdfGrid.rows.addRow();
                    gridRow.style.setBorder(border);
                    gridRow.style.setFont(font);
                    gridRow.style.setTextBrush(brush);
                    gridRow.style.setBackgroundBrush(backgroundBrush);
                    const args: AggregateQueryCellInfoEventArgs = {
                        row: row, type: isGroupedFooter ? 'GroupFooter' : 'Footer', style: gridRow.cells
                    };
                    this.parent.trigger(events.pdfAggregateQueryCellInfo, args);
                    for (let i: number = 0; i < pdfGrid.columns.count; i++) {
                        gridRow.cells.getCell(i).value = value[i].toString();
                    }
                } else {
                    for (let i: number = 0; i < pdfGrid.columns.count; i++) {
                        captionRow.cells.getCell(i).value = value[i].toString();
                        if (i === (groupIndex + 1) && leastCaptionSummaryIndex !== -1 && leastCaptionSummaryIndex !== 1) {
                            captionRow.cells.getCell(i).columnSpan = leastCaptionSummaryIndex - (groupIndex + 1);
                        } else if (i === (groupIndex + 1) && leastCaptionSummaryIndex === -1) {
                            captionRow.cells.getCell(i).columnSpan = pdfGrid.columns.count - (groupIndex + 1);
                        }
                    }
                }
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private getTemplateFunction(templateFn: any, index: number, leastCaptionSummaryIndex: number, cell: any): any {
        if (!isNullOrUndefined(cell.column.footerTemplate) &&  cell.cellType === CellType.Summary) {
            templateFn[getEnumValue(CellType, CellType.Summary)] = compile(cell.column.footerTemplate);
        } else if (!isNullOrUndefined(cell.column.groupCaptionTemplate)) {
            if (leastCaptionSummaryIndex === -1) {
                leastCaptionSummaryIndex = index;
            }
            templateFn[getEnumValue(CellType, CellType.CaptionSummary)] = compile(cell.column.groupCaptionTemplate);
        } else {
            templateFn[getEnumValue(CellType, CellType.GroupSummary)] = compile(cell.column.groupFooterTemplate);
        }
        return { templateFunction: templateFn, leastCaptionSummaryIndex: leastCaptionSummaryIndex };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private getSummaryWithoutTemplate(data: any): any {
        if (!isNullOrUndefined(data.Sum)) {
            return data.Sum;
        } else if (!isNullOrUndefined(data.Average)) {
            return data.Average;
        } else if (!isNullOrUndefined(data.Max)) {
            return data.Max;
        } else if (!isNullOrUndefined(data.Min)) {
            return data.Min;
        } else if (!isNullOrUndefined(data.Count)) {
            return data.Count;
        } else if (!isNullOrUndefined(data.TrueCount)) {
            return data.TrueCount;
        } else if (!isNullOrUndefined(data.FalseCount)) {
            return data.FalseCount;
        } else if (!isNullOrUndefined(data.Custom)) {
            return data.Custom;
        }
    }

    /**
     * Set alignment, width and type of the values of the column
     *
     * @param {Column[]} gridColumns - specifies the grid column
     * @param {PdfGrid} pdfGrid - specifies the pdfGrid
     * @param {ExportHelper} helper - specifies the helper
     * @param {IGrid} gObj - specifies the IGrid
     * @param {boolean} allowHorizontalOverflow - specifies the allowHorizontalOverflow
     * @returns {void}
     */
    private setColumnProperties(gridColumns: Column[], pdfGrid: PdfGrid, helper: ExportHelper, gObj: IGrid,
                                allowHorizontalOverflow: boolean): void {
        const startIndex: number = gObj.groupSettings.columns.length;
        for (let i: number = 0; i < startIndex; i++) {
            pdfGrid.columns.getColumn(i).width = 20;
        }
        for (let i: number = 0; i < gridColumns.length; i++) {
            if (!isNullOrUndefined(gridColumns[i].textAlign)) {
                pdfGrid.columns.getColumn(i + startIndex).format = this.getHorizontalAlignment(gridColumns[i].textAlign);
            }
            // Need to add width consideration with % value
            if (pdfGrid.style.allowHorizontalOverflow && !isNullOrUndefined(gridColumns[i].width) && allowHorizontalOverflow) {
                pdfGrid.columns.getColumn(i + startIndex).width = typeof gridColumns[i].width === 'number' ?
                    gridColumns[i].width as number * 0.75 : helper.getConvertedWidth(gridColumns[i].width as string) * 0.75;
            }
        }
    }

    /**
     * set default style properties of each rows in exporting grid
     *
     * @param {PdfGridRow} row - specifies the PdfGridRow
     * @param {PdfBorders} border - specifies the PdfBorders
     * @returns {PdfGrid} returns the pdfgrid
     * @private
     */
    private setRecordThemeStyle(row: PdfGridRow, border: PdfBorders): PdfGridRow {
        if (!isNullOrUndefined(this.gridTheme) && !isNullOrUndefined(this.gridTheme.record)) {
            const fontFamily: number = !isNullOrUndefined(this.gridTheme.record.fontName) ?
                this.getFontFamily(this.gridTheme.record.fontName) : PdfFontFamily.Helvetica;
            const fontSize: number = !isNullOrUndefined(this.gridTheme.record.fontSize) ? this.gridTheme.record.fontSize : 9.75;
            const fontStyle: PdfFontStyle = this.getFontStyle(this.gridTheme.record);
            let font: PdfStandardFont | PdfTrueTypeFont  = new PdfStandardFont(fontFamily, fontSize, fontStyle);
            if (!isNullOrUndefined(this.gridTheme.record.font)) {
                font = this.gridTheme.record.font;
            }
            row.style.setFont(font);
            let pdfColor: PdfColor = new PdfColor();
            if (!isNullOrUndefined(this.gridTheme.record.fontColor)) {
                const penBrushColor: { r: number, g: number, b: number } = this.hexToRgb(this.gridTheme.record.fontColor);
                pdfColor = new PdfColor(penBrushColor.r, penBrushColor.g, penBrushColor.b);
            }
            row.style.setTextBrush(new PdfSolidBrush(pdfColor));
        } else {
            row.style.setTextBrush(new PdfSolidBrush(new PdfColor(0, 0, 0)));
        }
        const borderRecord: PdfBorders = this.gridTheme && this.gridTheme.record &&
        this.gridTheme.record.border ? this.getBorderStyle(this.gridTheme.record.border) : border;
        row.style.setBorder(borderRecord);
        return row;
    }

    /**
     * generate the formatted cell values
     *
     * @param {PdfBorders} border - specifies the border
     * @param {Column[]} columns - specifies the columns
     * @param {IGrid} gObj - specifies the IGrid
     * @param {Object[]} dataSource - specifies the datasource
     * @param {PdfGrid} pdfGrid - specifies the pdfGrid
     * @param {number} startIndex - specifies the startindex
     * @param {PdfExportProperties} pdfExportProperties - specifies the pdfExportProperties
     * @param {ExportHelper} helper - specifies the helper
     * @param {number} rowIndex - specifies the rowIndex
     * @returns {number} returns the number of records
     * @private
     */
    private processRecord(border: PdfBorders, columns: Column[], gObj: IGrid, dataSource: Object[],
                          pdfGrid: PdfGrid, startIndex: number, pdfExportProperties: PdfExportProperties,
                          helper: ExportHelper, rowIndex?: number): number {
        const rows: Row<Column>[] = helper.getGridRowModel(columns, dataSource, gObj, rowIndex);
        for (const row of rows) {
            rowIndex++;
            // create a new row and set default style properties
            const gridRow: PdfGridRow = this.setRecordThemeStyle(pdfGrid.rows.addRow(), border);
            const cellLength: number = row.cells.length;
            for (let j: number = 0; j < cellLength; j++) {
                const gridCell: Cell<Column> = row.cells[j];
                if (gridCell.cellType !== CellType.Data) {
                    continue;
                }
                const column: Column = gridCell.column;
                const field: string = column.field;
                const cellValue: string = !isNullOrUndefined(field) ? (column.valueAccessor as Function)(field, row.data, column) : '';
                let value: string = !isNullOrUndefined(cellValue) ? cellValue : '';
                let foreignKeyData: Object;
                if (column.isForeignColumn && column.isForeignColumn()) {
                    foreignKeyData = helper.getFData(value, column);
                    value = getValue(column.foreignKeyValue, foreignKeyData);
                }
                const data: Object = row.data;
                const cell: PdfGridCell = gridRow.cells.getCell(j);
                const args: ExportHelperArgs = {
                    data: data,
                    value: value,
                    column: column,
                    style: undefined,
                    colSpan: 1,
                    cell: cell
                };
                args.value = args.column.type === 'boolean' && typeof args.value === 'string' ? args.value :
                    this.exportValueFormatter.formatCellValue(args);
                this.parent.trigger(events.pdfQueryCellInfo, args);
                if (!isNullOrUndefined(args.image)) {
                    args.value = new PdfBitmap(args.image.base64);
                }
                cell.value = args.value;
                if (!isNullOrUndefined(args.hyperLink)) {
                    cell.value = this.setHyperLink(args);
                }
                if (!isNullOrUndefined(args.style)) {
                    this.processCellStyle(cell, args);
                }
                if (args.colSpan > 1) {
                    if ((j + 1 + args.colSpan) > gridRow.cells.count) {
                        args.colSpan = gridRow.cells.count - (j + 1);
                    }
                    cell.columnSpan = args.colSpan;
                    for (let i: number = 1; i < cell.columnSpan; i++) {
                        const spanCell: PdfGridCell = gridRow.cells.getCell(j + i);
                        spanCell.value = '';
                    }
                    j += (args.colSpan - 1);
                }
            }
            if (row.isExpand) {
                const gridRow: PdfGridRow = this.setRecordThemeStyle(pdfGrid.rows.addRow(), border);
                const cell: PdfGridCell = gridRow.cells.getCell(startIndex);
                cell.columnSpan = gridRow.cells.count - (startIndex);
                cell.style.cellPadding = new PdfPaddings(10, 10, 10, 10);
                gObj.isPrinting = true;
                const exportType: ExportType = (!isNullOrUndefined(pdfExportProperties) && pdfExportProperties.exportType) ?
                    pdfExportProperties.exportType : 'AllPages';
                const returnValue: {childGrid: IGrid, element: HTMLElement} =
                this.helper.createChildGrid(gObj, row, exportType, this.gridPool);
                const childGridObj: IGrid = returnValue.childGrid;
                const element: HTMLElement = returnValue.element;
                (<{actionFailure?: Function}>childGridObj).actionFailure =
                helper.failureHandler(this.gridPool, childGridObj, this.globalResolve);
                const args: ExportDetailDataBoundEventArgs = {childGrid: childGridObj, row, cell, exportProperties: pdfExportProperties };
                this.parent.trigger(events.exportDetailDataBound, args);
                (<Grid>childGridObj).beforeDataBound = this.childGridCell(cell, childGridObj, pdfExportProperties);
                childGridObj.appendTo(element);
            }
            this.parent.notify( events.exportRowDataBound, { type: 'pdf', rowObj: row });
        }
        return rowIndex;
    }

    private setHyperLink(args: PdfHeaderQueryCellInfoEventArgs | PdfQueryCellInfoEventArgs): PdfTextWebLink{
        // create the Text Web Link
        const textLink: PdfTextWebLink = new PdfTextWebLink();
        // set the hyperlink
        textLink.url = args.hyperLink.target;
        // set the link text
        textLink.text = args.hyperLink.displayText || args.hyperLink.target;
        // set the font
        textLink.font = new PdfStandardFont(PdfFontFamily.Helvetica, 9.75);
        // set the brush and pen for the text color
        textLink.brush = new PdfSolidBrush(new PdfColor(51, 102, 187));
        return textLink;
    }

    private childGridCell(cell: PdfGridCell, childGridObj: IGrid, pdfExportProperties: PdfExportProperties): (value: Object) => Object {
        return (result: ReturnType): Object => {
            (<Grid>childGridObj).beforeDataBound = null;
            (<{cancel?: boolean}>result).cancel = true;
            cell.value = this.processGridExport(childGridObj, result, pdfExportProperties);
            (<Grid>childGridObj).destroy();
            detach(childGridObj.element);
            this.gridPool[childGridObj.id] = true;
            this.helper.checkAndExport(this.gridPool, this.globalResolve);
            return cell;
        };
    }

    private processCellStyle(cell: PdfGridCell, args: PdfQueryCellInfoEventArgs): void {
        if (!isNullOrUndefined(args.style.backgroundColor)) {
            const backColor: { r: number, g: number, b: number } = this.hexToRgb(args.style.backgroundColor);
            cell.style.backgroundBrush = new PdfSolidBrush(new PdfColor(backColor.r, backColor.g, backColor.b));
        }

        if (!isNullOrUndefined(args.style.textAlignment)) {
            cell.style.stringFormat = this.getHorizontalAlignment(args.style.textAlignment);
        }

        if (!isNullOrUndefined(args.style.cellPadding)) {
            cell.style.cellPadding = args.style.cellPadding;
        }

        if (!isNullOrUndefined(args.style.verticalAlignment)) {
            cell.style.stringFormat = this.getVerticalAlignment(args.style.verticalAlignment, cell.style.stringFormat);
        }

        if (!isNullOrUndefined(args.style.textBrushColor)) {
            const textBrushColor: { r: number, g: number, b: number } = this.hexToRgb(args.style.textBrushColor);
            cell.style.textBrush = new PdfSolidBrush(new PdfColor(textBrushColor.r, textBrushColor.g, textBrushColor.b));
        }

        if (!isNullOrUndefined(args.style.textPenColor)) {
            const textPenColor: { r: number, g: number, b: number } = this.hexToRgb(args.style.textPenColor);
            cell.style.textPen = new PdfPen(new PdfColor(textPenColor.r, textPenColor.g, textPenColor.b));
        }

        if (!isNullOrUndefined(args.style.fontFamily) || !isNullOrUndefined(args.style.fontSize) || !isNullOrUndefined(args.style.bold) ||
        !isNullOrUndefined(args.style.italic) || !isNullOrUndefined(args.style.underline) || !isNullOrUndefined(args.style.strikeout)) {
            cell.style.font = this.getFont(args);
        }

        if (!isNullOrUndefined(args.style.border)) {
            const border: PdfBorders = new PdfBorders();
            const borderWidth: number = args.style.border.width;
            // set border width
            const width: number = (!isNullOrUndefined(borderWidth) && typeof borderWidth === 'number') ? (borderWidth * 0.75) : (undefined);
            // set border color
            let color: PdfColor = new PdfColor(196, 196, 196);
            if (!isNullOrUndefined(args.style.border.color)) {
                const borderColor: { r: number, g: number, b: number } = this.hexToRgb(args.style.border.color);
                color = new PdfColor(borderColor.r, borderColor.g, borderColor.b);
            }
            const pen: PdfPen = new PdfPen(color, width);
            // set border dashStyle 'Solid <default>, Dash, Dot, DashDot, DashDotDot'
            if (!isNullOrUndefined(args.style.border.dashStyle)) {
                pen.dashStyle = this.getDashStyle(args.style.border.dashStyle);
            }
            border.all = pen;
            cell.style.borders = border;
        }

        if (!isNullOrUndefined(args.style.paragraphIndent)) {
            cell.style.stringFormat = new PdfStringFormat();
            cell.style.stringFormat.paragraphIndent = args.style.paragraphIndent;
        }
    }

    /**
     * set text alignment of each columns in exporting grid
     *
     * @param {string} textAlign - specifies the textAlign
     * @param {PdfStringFormat} format - specifies the PdfStringFormat
     * @returns {PdfStringFormat} returns the PdfStringFormat
     * @private
     */
    private getHorizontalAlignment(textAlign: string, format?: PdfStringFormat): PdfStringFormat {
        if (format === undefined) {
            format = new PdfStringFormat();
        }
        switch (textAlign) {
        case 'Right':
            format.alignment = PdfTextAlignment.Right;
            break;
        case 'Center':
            format.alignment = PdfTextAlignment.Center;
            break;
        case 'Justify':
            format.alignment = PdfTextAlignment.Justify;
            break;
        case 'Left':
            format.alignment = PdfTextAlignment.Left;
            break;
        }
        return format;
    }

    /**
     * set vertical alignment of each columns in exporting grid
     *
     * @param {string} verticalAlign - specifies the verticalAlign
     * @param {PdfStringFormat} format - specifies the PdfStringFormat
     * @param {string} textAlign - specifies the text align
     * @returns {PdfStringFormat} returns the PdfStringFormat
     * @private
     */
    private getVerticalAlignment(verticalAlign: string, format?: PdfStringFormat, textAlign?: string): PdfStringFormat {
        if (format === undefined) {
            format = new PdfStringFormat();
            format = this.getHorizontalAlignment(textAlign, format);
        }
        switch (verticalAlign) {
        case 'Bottom':
            format.lineAlignment = PdfVerticalAlignment.Bottom;
            break;
        case 'Middle':
            format.lineAlignment = PdfVerticalAlignment.Middle;
            break;
        case 'Top':
            format.lineAlignment = PdfVerticalAlignment.Top;
            break;
        }
        return format;
    }

    private getFontFamily(fontFamily: string): number {
        switch (fontFamily) {
        case 'TimesRoman':
            return 2;
        case 'Courier':
            return 1;
        case 'Symbol':
            return 3;
        case 'ZapfDingbats':
            return 4;
        default:
            return 0;
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private getFont(content: any): PdfFont {
        if (content.font) {
            return content.font;
        }
        const fontSize: number = (!isNullOrUndefined(content.style.fontSize)) ? (content.style.fontSize * 0.75) : 9.75;
        const fontFamily: number = (!isNullOrUndefined(content.style.fontFamily)) ?
            (this.getFontFamily(content.style.fontFamily)) : PdfFontFamily.TimesRoman;
        let fontStyle: PdfFontStyle = PdfFontStyle.Regular;
        if (!isNullOrUndefined(content.style.bold) && content.style.bold) {
            fontStyle |= PdfFontStyle.Bold;
        }

        if (!isNullOrUndefined(content.style.italic) && content.style.italic) {
            fontStyle |= PdfFontStyle.Italic;
        }

        if (!isNullOrUndefined(content.style.underline) && content.style.underline) {
            fontStyle |= PdfFontStyle.Underline;
        }

        if (!isNullOrUndefined(content.style.strikeout) && content.style.strikeout) {
            fontStyle |= PdfFontStyle.Strikeout;
        }

        return new PdfStandardFont(fontFamily, fontSize, fontStyle);
    }

    private getPageNumberStyle(pageNumberType: PdfPageNumberType): number {
        switch (pageNumberType) {
        case 'LowerLatin':
            return 2;
        case 'LowerRoman':
            return 3;
        case 'UpperLatin':
            return 4;
        case 'UpperRoman':
            return 5;
        default:
            return 1;
        }
    }

    private setContentFormat(content: PdfHeaderFooterContent, format: PdfStringFormat): { format: PdfStringFormat, size: SizeF } {
        if (!isNullOrUndefined(content.size)) {
            const width: number = content.size.width * 0.75;
            const height: number = content.size.height * 0.75;
            format = new PdfStringFormat(PdfTextAlignment.Left, PdfVerticalAlignment.Middle);
            if (!isNullOrUndefined(content.style.hAlign)) {
                switch (content.style.hAlign) {
                case 'Right':
                    format.alignment = PdfTextAlignment.Right;
                    break;
                case 'Center':
                    format.alignment = PdfTextAlignment.Center;
                    break;
                case 'Justify':
                    format.alignment = PdfTextAlignment.Justify;
                    break;
                default:
                    format.alignment = PdfTextAlignment.Left;
                }
            }
            if (!isNullOrUndefined(content.style.vAlign)) {
                format = this.getVerticalAlignment(content.style.vAlign, format);
            }
            return { format: format, size: new SizeF(width, height) };
        }
        return null;
    }

    private getPageSize(pageSize: PdfPageSize): SizeF {
        switch (pageSize) {
        case 'Letter':
            return new SizeF(612, 792);
        case 'Note':
            return new SizeF(540, 720);
        case 'Legal':
            return new SizeF(612, 1008);
        case 'A0':
            return new SizeF(2380, 3368);
        case 'A1':
            return new SizeF(1684, 2380);
        case 'A2':
            return new SizeF(1190, 1684);
        case 'A3':
            return new SizeF(842, 1190);
        case 'A5':
            return new SizeF(421, 595);
        case 'A6':
            return new SizeF(297, 421);
        case 'A7':
            return new SizeF(210, 297);
        case 'A8':
            return new SizeF(148, 210);
        case 'A9':
            return new SizeF(105, 148);
        // case 'A10':
            // return new SizeF(74, 105);
        case 'B0':
            return new SizeF(2836, 4008);
        case 'B1':
            return new SizeF(2004, 2836);
        case 'B2':
            return new SizeF(1418, 2004);
        case 'B3':
            return new SizeF(1002, 1418);
        case 'B4':
            return new SizeF(709, 1002);
        case 'B5':
            return new SizeF(501, 709);
        case 'Archa':
            return new SizeF(648, 864);
        case 'Archb':
            return new SizeF(864, 1296);
        case 'Archc':
            return new SizeF(1296, 1728);
        case 'Archd':
            return new SizeF(1728, 2592);
        case 'Arche':
            return new SizeF(2592, 3456);
        case 'Flsa':
            return new SizeF(612, 936);
        case 'HalfLetter':
            return new SizeF(396, 612);
        case 'Letter11x17':
            return new SizeF(792, 1224);
        case 'Ledger':
            return new SizeF(1224, 792);
        default:
            return new SizeF(595, 842);
        }
    }
    private getDashStyle(dashStyle: PdfDashStyle): number {
        switch (dashStyle) {
        case 'Dash':
            return 1;
        case 'Dot':
            return 2;
        case 'DashDot':
            return 3;
        case 'DashDotDot':
            return 4;
        default:
            return 0;
        }
    }

    private getPenFromContent(content: PdfHeaderFooterContent): PdfPen {
        let pen: PdfPen = new PdfPen(new PdfColor(0, 0, 0));
        if (!isNullOrUndefined(content.style) && content.style !== null && !isNullOrUndefined(content.style.penColor)) {
            const penColor: { r: number, g: number, b: number } = this.hexToRgb(content.style.penColor);
            pen = new PdfPen(new PdfColor(penColor.r, penColor.g, penColor.b));
        }
        return pen;
    }

    private getBrushFromContent(content: PdfHeaderFooterContent): PdfSolidBrush {
        let brush: PdfSolidBrush = null;
        if (!isNullOrUndefined(content.style.textBrushColor)) {
            /* tslint:disable-next-line:max-line-length */
            const brushColor: { r: number, g: number, b: number } = this.hexToRgb(content.style.textBrushColor);
            brush = new PdfSolidBrush(new PdfColor(brushColor.r, brushColor.g, brushColor.b));
        }
        return brush;
    }
    private hexToRgb(hex: string): { r: number, g: number, b: number } {
        if (hex === null || hex === '' || hex.length !== 7) {
            throw new Error('please set valid hex value for color...');
        }
        hex = hex.substring(1);
        const bigint: number = parseInt(hex, 16);
        const r: number = (bigint >> 16) & 255;
        const g: number = (bigint >> 8) & 255;
        const b: number = bigint & 255;
        return { r: r, g: g, b: b };
    }

    private getFontStyle(theme: PdfThemeStyle): PdfFontStyle {
        let fontStyle: PdfFontStyle = PdfFontStyle.Regular;
        if (!isNullOrUndefined(theme) && theme.bold) {
            fontStyle |= PdfFontStyle.Bold;
        }
        if (!isNullOrUndefined(theme) && theme.italic) {
            fontStyle |= PdfFontStyle.Italic;
        }
        if (!isNullOrUndefined(theme) && theme.underline) {
            fontStyle |= PdfFontStyle.Underline;
        }
        if (!isNullOrUndefined(theme) && theme.strikeout) {
            fontStyle |= PdfFontStyle.Strikeout;
        }
        return fontStyle;
    }

    private getBorderStyle(border: PdfBorder): PdfBorders {
        const borders: PdfBorders = new PdfBorders();
        if (!isNullOrUndefined(border)) {
            const borderWidth: number = border.width;
            // set border width
            const width: number = (!isNullOrUndefined(borderWidth) && typeof borderWidth === 'number') ? borderWidth * 0.75 : undefined;
            // set border color
            let color: PdfColor = new PdfColor(196, 196, 196);
            if (!isNullOrUndefined(border.color)) {
                const borderColor: { r: number, g: number, b: number } = this.hexToRgb(border.color);
                color = new PdfColor(borderColor.r, borderColor.g, borderColor.b);
            }
            const pen: PdfPen = new PdfPen(color, width);
            // set border dashStyle 'Solid <default>, Dash, Dot, DashDot, DashDotDot'
            if (!isNullOrUndefined(border.dashStyle)) {
                pen.dashStyle = this.getDashStyle(border.dashStyle);
            }
            borders.all = pen;
        } else {
            borders.all = new PdfPen(new PdfColor(234, 234, 234));
        }
        return borders;
    }

    public destroy(): void {
        //destroy for exporting
    }
}

interface SummaryData {
    aggregates?: Object;
    level?: number;
}

/**
 * @hidden
 */
interface IThemeStyles {
    fontColor?: string;
    fontName?: string;
    fontSize?: number;
    bold?: boolean;
    border?: PdfBorders;
    font?: PdfStandardFont | PdfTrueTypeFont;
    brush?: PdfSolidBrush;
    backgroundBrush?: PdfSolidBrush;
}
