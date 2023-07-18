import {
    IGrid, ExcelExportProperties, ExcelHeader, ExcelFooter, ExcelRow,
    ExcelCell, ExcelTheme, ExcelHeaderQueryCellInfoEventArgs, ExcelStyle, ExportDetailDataBoundEventArgs, ExportGroupCaptionEventArgs,
    AggregateQueryCellInfoEventArgs, ExcelQueryCellInfoEventArgs
} from '../base/interface';
import * as events from '../base/constant';
import { Workbook, Worksheets, Worksheet, Column as ExcelColumn } from '@syncfusion/ej2-excel-export';
import { isNullOrUndefined, getEnumValue, compile, getValue, DateFormatOptions, detach, extend } from '@syncfusion/ej2-base';
import { Data } from '../actions/data';
import { ReturnType } from '../base/type';
import { ExportHelper, ExportValueFormatter } from './export-helper';
import { Row } from '../models/row';
import { Column } from '../models/column';
import { SummaryModelGenerator, GroupSummaryModelGenerator, CaptionSummaryModelGenerator } from '../services/summary-model-generator';
import { AggregateColumnModel } from '../models/aggregate-model';
import { CellType, MultipleExportType, ExcelHAlign, ExportType } from '../base/enum';
import { Query, DataManager, Group } from '@syncfusion/ej2-data';
import { Grid } from '../base/grid';
import { Cell } from '../models/cell';
import { getPrintGridModel, getUid, isExportColumns, updateColumnTypeForExportColumns, prepareColumns,
    measureColumnDepth} from '../base/util';
import { L10n } from '@syncfusion/ej2-base';
import { ServiceLocator } from '../services/service-locator';
import { AutoFilters } from '@syncfusion/ej2-excel-export/src/auto-filters';
import { GroupLazyLoadRenderer } from '../renderer/group-lazy-load-renderer';
import { defaultCurrencyCode } from '@syncfusion/ej2-base';

/**
 * @hidden
 * `ExcelExport` module is used to handle the Excel export action.
 */
export class ExcelExport {
    private parent: IGrid;
    private isExporting: boolean;
    private theme: ExcelTheme;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private book: any = {};
    private workSheet: Worksheets = [];
    private rows: ExcelRow[] = [];
    private columns: ExcelColumn[] = [];
    private styles: ExcelStyle[] = [];
    private data: Data;
    private rowLength: number = 1;
    private footer: ExcelFooter;
    private expType: MultipleExportType = 'AppendToSheet';
    private includeHiddenColumn: boolean = false;
    private isCsvExport: boolean = false;
    private isBlob: boolean;
    private isChild: boolean = false;
    private blobPromise: Promise<{ blobData: Blob }>;
    private exportValueFormatter: ExportValueFormatter;
    private isElementIdChanged: boolean = false;
    private helper: ExportHelper;
    private groupedColLength: number;
    private globalResolve: Function;
    private gridPool: Object = {};
    private locator: ServiceLocator;
    private l10n: L10n;
    private sheet: Worksheet = {} as Worksheet;
    private capTemplate: string;
    private grpFooterTemplates: string[] = [];
    private footerTemplates: string[] = [];
    private aggIndex: number = 0;
    private totalAggregates: number = 0;
    /**
     * Constructor for the Grid Excel Export module.
     *
     * @param {IGrid} parent - specifies the IGrid
     * @param {ServiceLocator} locator - specifies the ServiceLocator
     * @hidden
     */
    constructor(parent?: IGrid, locator?: ServiceLocator) {
        this.parent = parent;
        this.helper = new ExportHelper(parent);
        this.locator = locator;
        this.l10n = this.locator.getService<L10n>('localization');
    }

    /**
     * For internal use only - Get the module name.
     *
     * @returns {string} returns the module name
     */
    private getModuleName(): string {
        return 'ExcelExport';
    }

    private init(gObj: IGrid): void {
        if (gObj.element !== null && gObj.element.id === '') {
            gObj.element.id = new Date().toISOString();
            this.isElementIdChanged = true;
        }
        this.parent = gObj;
        if (this.parent.isDestroyed) { return; }
        this.isExporting = undefined;
        this.book = {};
        this.workSheet = [];
        this.rows = [];
        this.columns = [];
        this.styles = [];
        this.rowLength = 1;
        this.footer = undefined;
        this.expType = 'AppendToSheet';
        this.includeHiddenColumn = false;
        this.exportValueFormatter = new ExportValueFormatter(gObj.locale);
        gObj.id = getUid('main-grid');
        this.gridPool[gObj.id] = false;
    }

    /**
     * Export Grid to Excel file.
     *
     * @param {IGrid} grid - Defines the grid.
     * @param  {exportProperties} exportProperties - Defines the export properties of the Grid.
     * @param  {isMultipleExport} isMultipleExport - Defines is multiple Grid's are exported.
     * @param  {Workbook} workbook - Defined the Workbook if multiple Grid is exported.
     * @param  {boolean} isCsv - true if export to CSV.
     * @param {boolean} isBlob - true if isBlob is enabled.
     * @returns {Promise<any>} - Returns the map for export.
     */
    // eslint-disable-next-line
    public Map(grid: IGrid, exportProperties: ExcelExportProperties, isMultipleExport: boolean, workbook: Workbook, isCsv: boolean, isBlob: boolean): Promise<any> {
        const gObj: IGrid = grid;
        const cancel: string = 'cancel';
        const isBlb: string = 'isBlob';
        const Child: string = 'isChild';
        const csv: string = 'isCsv';
        const workbk: string = 'workbook';
        const isMultiEx: string = 'isMultipleExport';
        this.gridPool = {};
        if (grid.childGrid && !(!isNullOrUndefined(exportProperties) && exportProperties.hierarchyExportMode === 'None')) {
            grid.expandedRows = getPrintGridModel(grid).expandedRows;
        }
        const args: Object = {
            requestType: 'beforeExcelExport', gridObject: gObj, cancel: false,
            isMultipleExport: isMultipleExport, workbook: workbook, isCsv: isCsv, isBlob: isBlob, isChild: this.isChild,
            grpFooterTemplates: this.grpFooterTemplates
        };
        gObj.trigger(events.beforeExcelExport, args);
        if (args[`${cancel}`]) {
            return new Promise((resolve: Function) => {
                return resolve();
            });
        }
        this.parent.log('exporting_begin', this.getModuleName());
        this.data = new Data(gObj);
        this.isExporting = true;
        this.isBlob = args[`${isBlb}`];
        this.isChild = args[`${Child}`];
        this.grpFooterTemplates = args['grpFooterTemplates'];
        if (args[`${csv}`]) {
            this.isCsvExport = args[`${csv}`];
        } else {
            this.isCsvExport = false;
        }
        if (isExportColumns(exportProperties)) {
            updateColumnTypeForExportColumns(exportProperties, gObj);
        }
        return this.processRecords(gObj, exportProperties, args[`${isMultiEx}`], args[`${workbk}`]);
    }

    private exportingSuccess(resolve: Function): void {
        this.isExporting = false;
        this.parent.trigger(events.excelExportComplete, this.isBlob ? { promise: this.blobPromise } : {});
        this.parent.log('exporting_complete', this.getModuleName());
        resolve(this.book);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private processRecords(gObj: IGrid, exportProperties: ExcelExportProperties, isMultipleExport: boolean, workbook: any): Promise<any> {
        if (gObj.allowGrouping && gObj.groupSettings.enableLazyLoading && gObj.groupSettings.columns.length) {
            if (isNullOrUndefined(exportProperties)) {
                exportProperties = { hierarchyExportMode: 'All' };
            } else {
                exportProperties.hierarchyExportMode = exportProperties.hierarchyExportMode || 'All';
            }
        }
        if (!isNullOrUndefined(exportProperties) && !isNullOrUndefined(exportProperties.dataSource)) {
            exportProperties.dataSource = exportProperties.dataSource instanceof DataManager ?
                exportProperties.dataSource : new DataManager (exportProperties.dataSource);
            const query: Query = exportProperties.query ? exportProperties.query : new Query();
            if (isNullOrUndefined(query.isCountRequired) || gObj.aggregates) {
                query.isCountRequired = true;
            }
            return new Promise((resolve: Function) => {
                const dataManager: Promise<Object> = (exportProperties.dataSource as DataManager).executeQuery(query);
                dataManager.then((r: ReturnType) => {
                    this.init(gObj);
                    this.processInnerRecords(gObj, exportProperties, isMultipleExport, workbook, r).then(() => {
                        this.exportingSuccess(resolve);
                    });
                });
            });
        } else if (!isNullOrUndefined(exportProperties) && exportProperties.exportType === 'CurrentPage') {
            return new Promise((resolve: Function) => {
                this.init(gObj);
                this.processInnerRecords(gObj, exportProperties, isMultipleExport, workbook, this.parent.getCurrentViewRecords());
                this.exportingSuccess(resolve);
            });
        } else {
            const allPromise: Promise<Object>[] = [];
            allPromise.push(this.data.getData({}, ExportHelper.getQuery(gObj, this.data)));
            allPromise.push(this.helper.getColumnData(<Grid>gObj));
            return new Promise((resolve: Function, reject: Function) => {
                Promise.all(allPromise).then((e: ReturnType[]) => {
                    this.init(gObj);
                    this.processInnerRecords(gObj, exportProperties, isMultipleExport, workbook, e[0]).then(() => {
                        this.exportingSuccess(resolve);
                    });
                }).catch((e: Error) => {
                    reject(this.book);
                    this.parent.trigger(events.actionFailure, e);
                });
            });
        }
    }

    private processInnerRecords(gObj: IGrid, exportProperties: ExcelExportProperties,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                isMultipleExport: boolean, workbook: any, r: ReturnType | Object[]): Promise<Object> {
        this.groupedColLength = gObj.groupSettings.columns.length;
        let blankRows: number = 5;
        let separator: string;
        let rows: ExcelRow[] = [];
        const colDepth: number = measureColumnDepth(gObj.columns as Column[]);
        const isExportPropertiesPresent: boolean = !isNullOrUndefined(exportProperties);
        if (isExportPropertiesPresent && !isNullOrUndefined(exportProperties.multipleExport)) {
            this.expType = (!isNullOrUndefined(exportProperties.multipleExport.type) ? exportProperties.multipleExport.type : 'AppendToSheet');
            if (!isNullOrUndefined(exportProperties.multipleExport.blankRows)) {
                blankRows = exportProperties.multipleExport.blankRows;
            }
        }
        if (isNullOrUndefined(workbook)) {
            this.workSheet = [];
            this.rows = [];
            this.columns = [];
            this.styles = [];
            this.sheet.images = [];
        } else if (this.expType === 'NewSheet') {
            this.workSheet = workbook.worksheets;
            this.rows = [];
            this.columns = [];
            this.sheet.images = [];
            this.styles = workbook.styles;
        } else {
            this.workSheet = [];
            this.rows = workbook.worksheets[0].rows;
            this.columns = workbook.worksheets[0].columns;
            this.styles = workbook.styles;
            this.sheet.images = workbook.worksheets[0].images;
            this.rowLength = (this.rows[this.rows.length - 1].index + blankRows);
            this.rowLength++;
        }

        if (isExportPropertiesPresent) {
            if (!isNullOrUndefined(isMultipleExport)) {
                if (!isNullOrUndefined(exportProperties.header) && (isMultipleExport || this.expType === 'NewSheet')) {
                    this.processExcelHeader(JSON.parse(JSON.stringify(exportProperties.header)));
                }
                if (!isNullOrUndefined(exportProperties.footer)) {
                    if (this.expType === 'AppendToSheet') {
                        if (!isMultipleExport) {
                            this.footer = JSON.parse(JSON.stringify(exportProperties.footer));
                        }
                    } else {
                        this.footer = JSON.parse(JSON.stringify(exportProperties.footer));
                    }
                }
            } else {
                if (!isNullOrUndefined(exportProperties.header)) {
                    this.processExcelHeader(JSON.parse(JSON.stringify(exportProperties.header)));
                }
                if (!isNullOrUndefined(exportProperties.footer)) {
                    this.footer = JSON.parse(JSON.stringify(exportProperties.footer));
                }
            }
        }
        this.includeHiddenColumn = (isExportPropertiesPresent ? exportProperties.includeHiddenColumn : false);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return new Promise((resolve: Function, reject: Function) => {
            (<{childGridLevel?: number}>gObj).childGridLevel = 0;
            rows = this.processGridExport(gObj, exportProperties, r);
            this.globalResolve = resolve;
            this.gridPool[gObj.id] = true;
            this.helper.checkAndExport(this.gridPool, this.globalResolve);
        }).then(() => {
            const organisedRows: ExcelRow[] = [];
            this.organiseRows(rows, rows[0].index, organisedRows);

            this.rows = this.rows.concat(organisedRows);
            //footer template add
            if (!isNullOrUndefined(this.footer)) {
                if ((this.expType === 'AppendToSheet' && !isMultipleExport) || (this.expType === 'NewSheet')) {
                    this.processExcelFooter(this.footer);
                }
            }

            if (this.columns.length > 0) {
                this.sheet.columns = this.columns;
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.sheet.rows = this.rows as any;
            this.sheet.enableRtl = this.parent.enableRtl;
            if (this.parent.allowFiltering && gObj.getVisibleColumns().length && isExportPropertiesPresent &&
                exportProperties.enableFilter) {
                const headerRowLen: number = exportProperties.header ? exportProperties.header.headerRows ||
                    exportProperties.header.rows.length : 0;
                const autoFilters: AutoFilters = {
                    row: colDepth + headerRowLen, column: this.groupedColLength ? this.groupedColLength + 1 :
                        this.sheet.columns[0].index, lastRow: this.sheet.rows.length, lastColumn: this.sheet.columns.length
                };
                this.sheet.autoFilters = autoFilters;
            }
            this.workSheet.push(this.sheet);

            this.book.worksheets = this.workSheet;
            this.book.styles = this.styles;
            gObj.notify('finalPageSetup', this.book);

            if (!isMultipleExport) {
                if (this.isCsvExport) {
                    if (isExportPropertiesPresent && !isNullOrUndefined(exportProperties.separator)
                    && exportProperties.separator !== ',') {
                        separator = exportProperties.separator;
                    }
                    const book: Workbook = new Workbook(
                        this.book, 'csv', gObj.locale, defaultCurrencyCode, separator
                    );
                    if (!this.isBlob) {
                        if (isExportPropertiesPresent && exportProperties.fileName) {
                            book.save(exportProperties.fileName);
                        } else {
                            book.save('Export.csv');
                        }
                    } else {
                        this.blobPromise = book.saveAsBlob('text/csv');
                    }
                } else {
                    const book: Workbook = new Workbook(this.book, 'xlsx', gObj.locale, defaultCurrencyCode);
                    if (!this.isBlob) {
                        if (isExportPropertiesPresent && exportProperties.fileName) {
                            book.save(exportProperties.fileName);
                        } else {
                            book.save('Export.xlsx');
                        }
                    } else {
                        this.blobPromise = book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                    }
                }
                if (this.isElementIdChanged) {
                    gObj.element.id = '';
                }
                delete gObj.expandedRows;
            }
            return workbook;
        });
    }

    private organiseRows(rows: ExcelRow[], initialIndex: number, organisedRows: ExcelRow[]): number {
        if (!rows.length) {
            return initialIndex;
        }
        for (let i: number = 0; i < rows.length; i++) {
            const row: ExcelRow = rows[parseInt(i.toString(), 10)];
            const childRows: ExcelRow[] = (<{childRows?: ExcelRow[] }>row).childRows;
            if (childRows) {
                row.index = initialIndex++;
                delete (<{childRows?: ExcelRow[] }>row).childRows;
                organisedRows.push(row);
                initialIndex = this.organiseRows(childRows, initialIndex, organisedRows);
            } else {
                row.index = initialIndex++;
                organisedRows.push(row);
            }
        }
        return initialIndex;
    }

    private processGridExport(gObj: IGrid, exportProperties: ExcelExportProperties, r: ReturnType | Object[]): ExcelRow[] {
        let excelRows: ExcelRow[] = [];
        const isFrozen: boolean = this.parent.isFrozenGrid() && !this.parent.getFrozenColumns();
        if (!isNullOrUndefined(exportProperties) && !isNullOrUndefined(exportProperties.theme)) {
            this.theme = exportProperties.theme;
        }
        if (gObj.childGrid && !isNullOrUndefined(exportProperties)) {
            gObj.hierarchyPrintMode = exportProperties.hierarchyExportMode || 'Expanded';
        }
        const helper: ExportHelper = new ExportHelper(gObj, this.helper.getForeignKeyData());
        const gColumns: Column[] = isExportColumns(exportProperties) ?
            prepareColumns(exportProperties.columns, gObj.enableColumnVirtualization) :
            helper.getGridExportColumns(isFrozen ? gObj.getColumns() : gObj.columns as Column[]);
        const headerRow: IHeader = helper.getHeaders(gColumns, this.includeHiddenColumn);
        const groupIndent: number = gObj.groupSettings.columns.length ? gObj.groupSettings.columns.length - 1 : 0;
        excelRows = this.processHeaderContent(gObj, headerRow, groupIndent, excelRows);
        if (!isNullOrUndefined(exportProperties) && Object.keys(exportProperties).length &&
         isNullOrUndefined(exportProperties.dataSource)) {
            if (exportProperties.exportType === 'CurrentPage' && (!gObj.groupSettings.enableLazyLoading
                || gObj.getDataModule().isRemote())) {
                excelRows = this.processRecordContent(gObj, r, headerRow, exportProperties, gObj.currentViewData, excelRows, helper);
            }
            else if ( gObj.groupSettings.enableLazyLoading && !gObj.getDataModule().isRemote()) {
                let groupData: Object[];
                if (!isNullOrUndefined(exportProperties) && Object.keys(exportProperties).length) {
                    const isAllPage: boolean = exportProperties.exportType === 'CurrentPage'
                        ? false : true;
                    const groupQuery: Query = gObj.getDataModule().generateQuery(isAllPage);
                    const lazyloadData: object[] = gObj.getDataModule().dataManager.executeLocal(groupQuery);
                    groupQuery.lazyLoad = [];
                    const fName: string = 'fn';
                    if (!isAllPage) {
                        for (let i: number = 0; i < groupQuery.queries.length; i++) {
                            if (groupQuery.queries[parseInt(i.toString(), 10)]['' + fName] === 'onPage') {
                                groupQuery.queries[parseInt(i.toString(), 10)].e.pageSize = lazyloadData.reduce((acc: number, curr: object) => acc + curr['count'], 0);
                            }
                        }
                    }
                    if (exportProperties.hierarchyExportMode === 'All') {
                        groupData = gObj.getDataModule().dataManager.executeLocal(groupQuery);
                    }
                    else if (exportProperties.hierarchyExportMode === 'Expanded' || exportProperties.hierarchyExportMode === 'None' ||
                    isNullOrUndefined(exportProperties.hierarchyExportMode)) {
                        groupData = gObj.getDataModule().dataManager.executeLocal(groupQuery);
                        const lazQuery: object[] = (this.parent.contentModule as GroupLazyLoadRenderer).lazyLoadQuery;
                        for (let i: number = 0; i < lazQuery.length; i++) {
                            const query: object = lazQuery[parseInt(i.toString(), 10)];
                            const where: object = query[0];
                            for (let j: number = 0; j < groupData.length; j++) {
                                const data: object = groupData[parseInt(j.toString(), 10)];
                                if (data['key'] === where['value']) {
                                    lazyloadData[parseInt(i.toString(), 10)] = groupData[parseInt(j.toString(), 10)];
                                }
                            }
                        }
                        groupData = lazyloadData;
                    }
                }
                else {
                    groupData = gObj.currentViewData;
                }
                excelRows = this.processRecordContent(gObj, r, headerRow, exportProperties, groupData, excelRows, helper);
            }
            else {
                excelRows = this.processRecordContent(gObj, r, headerRow, exportProperties, undefined, excelRows, helper);
            }
        }
        else {
            excelRows = this.processRecordContent(gObj, r, headerRow, exportProperties, undefined, excelRows, helper);
        }
        gObj.notify(events.exportDataBound, { excelRows: excelRows, type: 'excel' });
        this.capTemplate = undefined;
        this.footerTemplates = [];
        this.grpFooterTemplates = [];
        this.aggIndex = 0;
        this.totalAggregates = 0;
        return excelRows;
    }


    private processRecordContent(gObj: IGrid, returnType: ReturnType | Object[], headerRow: IHeader,
                                 exportProperties: ExcelExportProperties, currentViewRecords: Object[], excelRow: ExcelRow[],
                                 helper: ExportHelper): ExcelRow[] {
        let record: Object[] | Group;
        if (!isNullOrUndefined(currentViewRecords) && currentViewRecords.length) {
            record = currentViewRecords;
        } else {
            record = (returnType as ReturnType).result;
        }

        if (!isNullOrUndefined((<Group>record).level)) {
            this.processGroupedRows(gObj, record, headerRow, (<Group>record).level, 0, exportProperties, excelRow, helper);
        } else {
            this.processRecordRows(gObj, record, headerRow, 0, 0, exportProperties, excelRow, helper);
        }
        if (!isNullOrUndefined((returnType as ReturnType).aggregates) && Object.keys((returnType as ReturnType).aggregates).length > 0) {
            if (!isNullOrUndefined(currentViewRecords) && !this.parent.groupSettings.enableLazyLoading) {
                this.processAggregates(gObj, (returnType as ReturnType).result, excelRow, currentViewRecords);
            } else {
                const result: Object[] = ((returnType as ReturnType).result as Group).GroupGuid ?
                    ((returnType as ReturnType).result as Group).records : (returnType as ReturnType).result;
                this.processAggregates(gObj, result, excelRow );
            }
        }
        return excelRow;
    }

    private processGroupedRows(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        gObj: IGrid, dataSource: any, headerRow: IHeader, level: number, startIndex: number,
        excelExportProperties: ExcelExportProperties, excelRows: ExcelRow[], helper: ExportHelper
    ): void {
        for (const item of dataSource) {
            const cells: ExcelCell[] = [];
            const index: number = 1;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const cell: any = {};
            cell.index = (index + level) - 1;
            const col: Column = gObj.getColumnByField(item.field);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const args: any = {
                value: item.key,
                column: col,
                style: undefined,
                isForeignKey: col.isForeignColumn()
            };

            let value: string = gObj.getColumnByField(item.field).headerText +
            ': ' + (!col.enableGroupByFormat ? this.exportValueFormatter.formatCellValue(args) : item.key) + ' - ';
            if (item.count > 1) {
                value += item.count + ' items';
            } else {
                value += item.count + ' item';
            }
            const cArgs: ExportGroupCaptionEventArgs = { captionText: value, type: this.isCsvExport ? 'CSV' : 'Excel', data: item };
            this.parent.trigger(events.exportGroupCaption, cArgs);
            cell.value = cArgs.captionText;
            cell.style = this.getCaptionThemeStyle(this.theme);
            if (!isNullOrUndefined(cArgs.style)) {
                cell.style = this.mergeOptions(cell.style, cArgs.style);
            }
            const captionModelGen: CaptionSummaryModelGenerator = new CaptionSummaryModelGenerator(gObj);
            const groupCaptionSummaryRows: Row<AggregateColumnModel>[] = captionModelGen.generateRows(item);
            this.fillAggregates(gObj, groupCaptionSummaryRows, (dataSource.level + dataSource.childLevels) - 1, excelRows, this.rowLength);
            cells.push(cell);
            if (excelRows[excelRows.length - 1].cells.length > 0) {
                let lIndex: number = dataSource.level + dataSource.childLevels + groupCaptionSummaryRows[0].cells.length;
                let hIndex: number = 0;
                for (const tCell of excelRows[excelRows.length - 1].cells) {
                    if (tCell.index < lIndex) {
                        lIndex = tCell.index;
                    }
                    if (tCell.index > hIndex) {
                        hIndex = tCell.index;
                    }
                    if (cells[cells.length - 1].index !== tCell.index) {
                        cells.push(tCell);
                    }
                }
                if ((lIndex - cell.index) > 1) {
                    cell.colSpan = lIndex - cell.index;
                }
                while (hIndex < (headerRow.columns.length + level + dataSource.childLevels)) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const sCell: any = {};
                    sCell.index = (hIndex + 1);
                    sCell.style = this.getCaptionThemeStyle(this.theme);
                    cells.push(sCell);
                    hIndex++;
                }
            } else {
                let span: number = 0;
                //Calculation for column span when group caption dont have aggregates
                for (const col of headerRow.columns) {
                    if ((col as Column).visible) {
                        span++;
                    }
                }
                cell.colSpan = (dataSource.childLevels + span);
            }
            excelRows[excelRows.length - 1].cells = cells;
            this.rowLength++;
            if (this.groupedColLength < 8 && level > 1) {
                const grouping: Object = { outlineLevel: level - 1, isCollapsed: true };
                excelRows[excelRows.length - 1].grouping = grouping;
            }

            if (!isNullOrUndefined(dataSource.childLevels) && dataSource.childLevels > 0) {
                this.processGroupedRows(gObj, item.items, headerRow, item.items.level, startIndex,
                                        excelExportProperties, excelRows, helper);
                this.processAggregates(gObj, item, excelRows, undefined, (level - 1) + dataSource.childLevels , true);
            } else {
                startIndex = this.processRecordRows(gObj, item.items, headerRow, (level - 1), startIndex,
                                                    excelExportProperties, excelRows, helper);
                this.processAggregates(gObj, item, excelRows, undefined, (level - 1), true);
            }
        }
    }

    private processRecordRows(gObj: IGrid, record: Object[], headerRow: IHeader, level: number, startIndex: number,
                              excelExportProperties: ExcelExportProperties, excelRows: ExcelRow[], helper: ExportHelper): number {
        let index: number = 1;
        let cells: ExcelCell[] = [];
        const columns: Column[] = headerRow.columns;
        const rows: Row<Column>[] = helper.getGridRowModel(columns, record, gObj, startIndex);
        for (const row of rows) {
            cells = [];
            startIndex++;
            index = 1;
            let templateRowHeight: number;
            for (let c: number = 0, len: number = row.cells.length; c < len; c++) {
                const gCell: Cell<Column> = row.cells[parseInt(c.toString(), 10)];
                if (gCell.cellType !== CellType.Data) {
                    continue;
                }
                const column: Column = gCell.column;
                const field: string = column.field;
                const cellValue: string = !isNullOrUndefined(field) ? (column.valueAccessor as Function)(field, row.data, column) : '';
                let value: string = !isNullOrUndefined(cellValue) ? cellValue : '';
                let fkData: Object;
                if (column.isForeignColumn && column.isForeignColumn()) {
                    fkData = helper.getFData(value, column);
                    value = getValue(column.foreignKeyValue, fkData);
                }
                if (!isNullOrUndefined(value)) {
                    let cell: ExcelCell = {};
                    const idx: number = index + level + (<{childGridLevel?: number}>gObj).childGridLevel;
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    let excelCellArgs: any = {
                        data: row.data, column: column, foreignKeyData: fkData,
                        value: value, style: undefined, colSpan: 1, cell: cell
                    };
                    gObj.trigger(events.excelQueryCellInfo, excelCellArgs);
                    if (!isNullOrUndefined(excelCellArgs.image) && !isNullOrUndefined(excelCellArgs.image.base64)) {
                        templateRowHeight = this.setImage(excelCellArgs, idx);
                        if (excelCellArgs.image.height && excelCellArgs.value !== '') {
                            templateRowHeight += 30;
                        }
                    }

                    if (!isNullOrUndefined(excelCellArgs.hyperLink)) {
                        (excelCellArgs.cell as ExcelCell).hyperlink = { target: excelCellArgs.hyperLink.target };
                        excelCellArgs.value = excelCellArgs.hyperLink.displayText || excelCellArgs.value;
                    }
                    cell = excelCellArgs.cell;
                    cell.index = idx;
                    cell.value = excelCellArgs.value;
                    if (excelCellArgs.data === '' && (<{childGridLevel?: number}>gObj).childGridLevel && index === 1) {
                        const style: ExcelStyle = {};
                        style.hAlign = 'left' as ExcelHAlign;
                        excelCellArgs = {style: style};
                        cell.colSpan = gObj.getVisibleColumns().length;
                        cell.value = this.l10n.getConstant('EmptyRecord');
                    }
                    if (excelCellArgs.colSpan > 1) {
                        cell.colSpan = excelCellArgs.colSpan;
                    }
                    if (!isNullOrUndefined(excelCellArgs.style)) {
                        const styleIndex: number = this.getColumnStyle(gObj, index + level);
                        cell.style = this.mergeOptions(this.styles[parseInt(styleIndex.toString(), 10)], excelCellArgs.style);
                    } else {
                        cell.style = { name: gObj.element.id + 'column' + (index + level) } as ExcelStyle;
                    }
                    cells.push(cell);
                }
                index++;

            }
            const excelRow: ExcelRow = { index: this.rowLength++, cells: cells };
            if (!isNullOrUndefined(templateRowHeight)) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (excelRow as any).height = templateRowHeight;
            }
            if (this.groupedColLength && this.groupedColLength < 8 && (level + 1) > 0) {
                excelRow.grouping = { outlineLevel: (level + 1), isCollapsed: true };
                excelRows.push(excelRow);
            } else {
                excelRows.push(excelRow);
            }
            if ((row.isExpand || this.isChild) && !isNullOrUndefined(gObj.childGrid)) {
                gObj.isPrinting = true;
                const exportType: ExportType = (!isNullOrUndefined(excelExportProperties) && excelExportProperties.exportType) ?
                    excelExportProperties.exportType : 'AllPages';
                const returnVal: { childGrid: IGrid, element: HTMLElement } = this.helper.createChildGrid(
                    gObj, row, exportType, this.gridPool
                );
                const childGridObj: IGrid = returnVal.childGrid;
                const element: HTMLElement = returnVal.element;
                (<{actionFailure?: Function}>childGridObj).actionFailure =
                helper.failureHandler(this.gridPool, childGridObj, this.globalResolve);
                (<{childGridLevel?: number}>childGridObj).childGridLevel = (<{childGridLevel?: number}>gObj).childGridLevel + 1;
                const args: ExportDetailDataBoundEventArgs = {childGrid: childGridObj, row, exportProperties: excelExportProperties };
                this.parent.trigger(events.exportDetailDataBound, args);
                (<Grid>childGridObj).beforeDataBound = this.childGridCell(excelRow, childGridObj, excelExportProperties, row);
                childGridObj.appendTo(element);
            }
            gObj.notify(events.exportRowDataBound, { rowObj: row, type: 'excel',  excelRows: excelRows });
        }
        return startIndex;
    }

    private setImage(args: ExcelHeaderQueryCellInfoEventArgs | ExcelQueryCellInfoEventArgs, idx: number): number {
        if (isNullOrUndefined(this.sheet.images)) {
            this.sheet.images = [];
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const excelImage: any = {
            image: args.image.base64, row: this.rowLength, column: idx,
            lastRow: this.rowLength, lastColumn: idx
        };
        if (args.image.width && args.image.height) {
            excelImage.width = args.image.width;
            excelImage.height = args.image.height;
        }
        this.sheet.images.push(excelImage);
        this.columns[idx - 1].width = args.image.width || this.columns[idx - 1].width;
        return args.image.height || 50;
    }

    private childGridCell(excelRow: ExcelRow, childGridObj: IGrid, excelExportProps: ExcelExportProperties,
                          gRow: Row<Column>): (value: Object) => Object {
        return (result: ReturnType): Object => {
            (<Grid>childGridObj).beforeDataBound = null;
            (<{cancel?: boolean}>result).cancel = true;
            if (result.result.length === 0 ) {
                result.result = [''];
            }
            (<{childRows?: ExcelRow[] }>excelRow).childRows = this.processGridExport(childGridObj, excelExportProps, result);
            const intent: number = this.parent.groupSettings.columns.length;
            const rows: ExcelRow[] = (<{childRows?: ExcelRow[] }>excelRow).childRows;
            for (let i: number = 0; i < rows.length; i++) {
                rows[parseInt(i.toString(), 10)].grouping = { outlineLevel: intent + (<{childGridLevel?: number}>childGridObj)
                    .childGridLevel, isCollapsed: !gRow.isExpand, isHidden: !gRow.isExpand};
            }
            (<Grid>childGridObj).destroy();
            detach(childGridObj.element);
            this.gridPool[childGridObj.id] = true;
            this.helper.checkAndExport(this.gridPool, this.globalResolve);
            return excelRow;
        };
    }

    private processAggregates(gObj: IGrid, rec: Object[], excelRows: ExcelRow[], currentViewRecords?: Object[], indent?: number,
                              byGroup?: boolean): ExcelRow[] {
        const summaryModel: SummaryModelGenerator = new SummaryModelGenerator(gObj);
        let columns: Column[] = summaryModel.getColumns();
        columns = columns.filter((col: Column) => { return isNullOrUndefined(col.commands) && col.type !== 'checkbox'; });
        if (gObj.aggregates.length && this.parent !== gObj) {
            gObj.aggregateModule.prepareSummaryInfo();
        }
        let data: Object[] | Group = undefined;
        if (!isNullOrUndefined(currentViewRecords)) {
            data = currentViewRecords;
        } else {
            data = rec;
        }
        if (indent === undefined) {
            indent = 0;
        }
        if (gObj.groupSettings.columns.length > 0 && byGroup) {
            const groupSummaryModel: GroupSummaryModelGenerator = new GroupSummaryModelGenerator(gObj);
            const groupSummaryRows: Row<AggregateColumnModel>[] =
            groupSummaryModel.generateRows(<Object>data, { level: (<Group>data).level });
            if (groupSummaryRows.length > 0) {
                excelRows = this.fillAggregates(gObj, groupSummaryRows, indent, excelRows);
            }
        } else {
            indent = gObj.groupSettings.columns.length > 0 && !byGroup ? gObj.groupSettings.columns.length : indent;
            const sRows: Row<AggregateColumnModel>[] = summaryModel.generateRows(data, (<SummaryData>rec).aggregates, null, null, columns);
            if (sRows.length > 0 && !byGroup) {
                indent = gObj.groupSettings.columns.length ? indent - 1 : indent;
                excelRows = this.fillAggregates(gObj, sRows, indent, excelRows);
            }
        }
        return excelRows;
    }

    private fillAggregates(
        gObj: IGrid, rows: Row<AggregateColumnModel>[], indent: number, excelRows: ExcelRow[], customIndex?: number
    ): ExcelRow[] {
        for (const row of rows) {
            const cells: ExcelCell[] = [];
            let isEmpty: boolean = true;
            let index: number = 0;
            for (const cell of row.cells) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const eCell: any = {};
                if (cell.cellType === CellType.DetailFooterIntent) {
                    continue;
                }
                if ((cell.visible || this.includeHiddenColumn)) {
                    index++;
                    if (cell.isDataCell) {
                        isEmpty = false;
                        const footerTemplate: boolean = !isNullOrUndefined(cell.column.footerTemplate);
                        const groupFooterTemplate: boolean = !isNullOrUndefined(cell.column.groupFooterTemplate);
                        const groupCaptionTemplate: boolean = !isNullOrUndefined(cell.column.groupCaptionTemplate);
                        eCell.index = index + indent + (<{childGridLevel?: number}>gObj).childGridLevel;
                        if (footerTemplate) {
                            eCell.value = this.getAggreateValue(
                                gObj, CellType.Summary, cell.column.footerTemplate, cell, row);
                        } else if (groupFooterTemplate) {
                            eCell.value = this.getAggreateValue(
                                gObj, CellType.GroupSummary, cell.column.groupFooterTemplate, cell, row);
                        } else if (groupCaptionTemplate) {
                            eCell.value = this.getAggreateValue(
                                gObj, CellType.CaptionSummary, cell.column.groupCaptionTemplate, cell, row);
                        } else {
                            for (const key of Object.keys(row.data[cell.column.field])) {
                                if (key === cell.column.type) {
                                    if (!isNullOrUndefined(row.data[cell.column.field].Sum)) {
                                        eCell.value = row.data[cell.column.field][`${cell.column.field} - sum`];
                                    } else if (!isNullOrUndefined(row.data[cell.column.field].Average)) {
                                        eCell.value = row.data[cell.column.field][`${cell.column.field} - average`];
                                    } else if (!isNullOrUndefined(row.data[cell.column.field].Max)) {
                                        eCell.value = row.data[cell.column.field][`${cell.column.field} - max`];
                                    } else if (!isNullOrUndefined(row.data[cell.column.field].Min)) {
                                        eCell.value = row.data[cell.column.field][`${cell.column.field} - min`];
                                    } else if (!isNullOrUndefined(row.data[cell.column.field].Count)) {
                                        eCell.value = row.data[cell.column.field][`${cell.column.field} - count`];
                                    } else if (!isNullOrUndefined(row.data[cell.column.field].TrueCount)) {
                                        eCell.value = row.data[cell.column.field][`${cell.column.field} - truecount`];
                                    } else if (!isNullOrUndefined(row.data[cell.column.field].FalseCount)) {
                                        eCell.value = row.data[cell.column.field][`${cell.column.field} - falsecount`];
                                    } else if (!isNullOrUndefined(row.data[cell.column.field].Custom)) {
                                        eCell.value = row.data[cell.column.field].Custom;
                                    }
                                }
                            }
                        }
                        eCell.style = this.getCaptionThemeStyle(this.theme); //{ name: gObj.element.id + 'column' + index };
                        this.aggregateStyle(cell.column, eCell.style, cell.column.field);
                        const gridCellStyle: {textAlign?: ExcelHAlign} = cell.attributes.style;
                        if (gridCellStyle.textAlign) {
                            eCell.style.hAlign = gridCellStyle.textAlign.toLowerCase() as ExcelHAlign;
                        }
                        const args: AggregateQueryCellInfoEventArgs = {
                            row: row,
                            type: footerTemplate ? 'Footer' : groupFooterTemplate ? 'GroupFooter' : 'GroupCaption',
                            style: eCell
                        };
                        this.parent.trigger(events.excelAggregateQueryCellInfo, args);
                        cells.push(eCell);

                    } else {
                        if (customIndex === undefined) {
                            eCell.index = index + indent + (<{childGridLevel?: number}>gObj).childGridLevel;
                            eCell.style = this.getCaptionThemeStyle(this.theme); //{ name: gObj.element.id + 'column' + index };
                            cells.push(eCell);
                        }
                    }
                }
            }
            if (!isNullOrUndefined(customIndex)) {
                excelRows.push({ index: customIndex, cells: cells });
            } else {
                let row: Object = {};
                const dummyOutlineLevel: string = 'outlineLevel';
                const dummyGrouping: string = 'grouping';
                if (this.groupedColLength < 8 && this.groupedColLength > 0 && !(gObj.groupSettings.enableLazyLoading && isNullOrUndefined(excelRows[excelRows.length - 1][`${dummyGrouping}`]))) {
                    const level: number = excelRows[excelRows.length - 1][`${dummyGrouping}`][`${dummyOutlineLevel}`];
                    const grouping: Object = { outlineLevel: level, isCollapsed: true };
                    row = {index: this.rowLength++, cells: cells, grouping};
                } else {
                    row = {index: this.rowLength++, cells: cells};
                }
                if (!isEmpty) {
                    excelRows.push(row); }
            }
        }
        return excelRows;
    }

    private aggregateStyle(col: AggregateColumnModel, style: ExcelStyle, field: string): void {
        const column: Column = this.parent.getColumnByField(field);
        if (typeof col.format === 'object') {
            const format: DateFormatOptions = col.format;
            style.numberFormat = !isNullOrUndefined(format.format) ? format.format : format.skeleton;
            if (!isNullOrUndefined(format.type)) {
                style.type = format.type.toLowerCase();
            }
        } else {
            style.numberFormat = col.format;
        }
        if (!isNullOrUndefined(column) && isNullOrUndefined(style.type)) {
            style.type = column.type.toLowerCase();
        }
    }

    private getAggreateValue(gObj: IGrid, cellType: CellType, template: string | Function,
                             cell: Cell<AggregateColumnModel>, row: Row<AggregateColumnModel>): NodeList | string {
        const templateFn: { [x: string]: Function } = {};
        templateFn[getEnumValue(CellType, cell.cellType)] = compile(template);
        let txt: NodeList | string;
        const data: Object = row.data[cell.column.field ? cell.column.field : cell.column.columnName];
        if (this.parent.isReact || this.parent.isVue || this.parent.isAngular) {
            if (isNullOrUndefined(cell.column.customAggregate)) {
                if (!isNullOrUndefined(cell.column.footerTemplate)) {
                    txt = this.getAggregateTemplate(this.footerTemplates, gObj.getFooterContentTable(), data, cell);
                }
                else {
                    if (cell.column.groupFooterTemplate) {
                        txt = this.getAggregateTemplate(this.grpFooterTemplates, gObj.getContentTable(), data, cell);
                    }
                    else {
                        this.capTemplate = isNullOrUndefined(this.capTemplate) ?
                            (gObj.getContentTable().querySelector('.e-groupcaptionrow')
                                .querySelector('.e-summarycell.e-templatecell')as HTMLTableCellElement).innerText.split(data[(cell.column.type) as string])[0]
                            : this.capTemplate;
                        txt = this.capTemplate + data[(cell.column.type) as string];
                    }
                }
                return !isNullOrUndefined(txt) ? (txt) : '';
            }
            else {
                if (this.parent.isReact) {
                    for (let i: number = 0; i < this.parent['portals'].length; i++) {
                        if (data['Custom'] && this.parent['portals'][i as number].children.props.Custom === data['Custom']) {
                            return this.parent['portals'][i as number].containerInfo.textContent;
                        }
                    }
                }
                else {
                    txt = (templateFn[getEnumValue(CellType, cell.cellType)](data, this.parent));
                }
            }
        }
        else {
            txt = (templateFn[getEnumValue(CellType, cell.cellType)](data));
        }
        return !isNullOrUndefined(txt[0]) ? (<Text>txt[0]).textContent : '';
    }

    private getAggregateTemplate(template: string[], contentRows: Element, data: object,
                                 cell: Cell<AggregateColumnModel>): string {
        const aggClassName: string = cell.column.groupFooterTemplate ? 'e-groupfooterrow' : 'e-summaryrow';
        if (!template.length) {
            this.totalAggregates = 0;
            this.aggIndex = 0;
            for (let i: number = 0; i < contentRows.querySelectorAll('tr').length; i++) {
                if (contentRows.querySelectorAll('tr')[parseInt(i.toString(), 10)].classList.contains(aggClassName)) {
                    this.totalAggregates++;
                    if (contentRows.querySelectorAll('tr')[parseInt(i.toString(), 10) + 1] &&
                     contentRows.querySelectorAll('tr')[parseInt(i.toString(), 10) + 1].classList.contains('e-groupcaptionrow')) {
                        break;
                    }
                }
            }
        }
        if (template.length < this.totalAggregates) {
            template.push((contentRows.querySelectorAll('.' + aggClassName)[template.length]
                .querySelector('.e-summarycell.e-templatecell')as HTMLTableCellElement).innerText.split(data[(cell.column.type) as string])[0]);
        }
        if (this.parent.groupSettings.enableLazyLoading && cell.column.groupFooterTemplate && this.totalAggregates === 0) {
            this.totalAggregates = template.length;
        }
        this.aggIndex++;
        const aggTemplate: string = template[this.aggIndex - 1] + data[(cell.column.type) as string];
        if (this.aggIndex === this.totalAggregates) {
            this.aggIndex = 0;
        }
        return aggTemplate;
    }


    private mergeOptions(JSON1: Object, JSON2: Object): Object {
        const result: Object = {};
        let attrname: string[] = Object.keys(JSON1);
        for (let index: number = 0; index < attrname.length; index++) {
            if (attrname[parseInt(index.toString(), 10)] !== 'name') {
                result[attrname[parseInt(index.toString(), 10)]] = JSON1[attrname[parseInt(index.toString(), 10)]];
            }
        }
        attrname = Object.keys(JSON2);
        for (let index: number = 0; index < attrname.length; index++) {
            if (attrname[parseInt(index.toString(), 10)] !== 'name') {
                result[attrname[parseInt(index.toString(), 10)]] = JSON2[attrname[parseInt(index.toString(), 10)]];
            }
        }
        return result;
    }

    private getColumnStyle(gObj: IGrid, columnIndex: number): number {
        let index: number = 0;
        for (const style of this.styles) {
            if ((<{name: string}>style).name === gObj.element.id + 'column' + columnIndex) {
                return index;
            }
            index++;
        }
        return undefined;
    }

    private headerRotation(args: ExcelHeaderQueryCellInfoEventArgs): void {
        let degree: number = args.style.rotation;
        if (degree <= 90 && degree >= 0)
        {
            args.style.hAlign = 'Left';
        }
        else if (degree > 90 && degree <= 180)
        {
            args.style.hAlign = 'Right';
        }
        else
        {
            degree = 180;
            args.style.hAlign = 'Right';
        }
        args.style.rotation = degree;
    }

    private processHeaderContent(gObj: IGrid, headerRow: IHeader, indent: number, excelRows: ExcelRow[]): ExcelRow[] {
        const rowIndex: number = 1;
        const gridRows: Row<Column>[] = headerRow.rows;
        // Column collection with respect to the records in the grid
        const gridColumns: Column[] = headerRow.columns;
        const spannedCells: ISpannedCell[] = [];
        if (indent > 0) {
            let index: number = 0;
            while (index !== indent) {
                this.columns.push({ index: index + 1, width: 30 });
                index++;
            }
        }

        for (let col: number = 0; col < gridColumns.length; col++) {
            this.parseStyles(gObj, gridColumns[parseInt(col.toString(), 10)], this.getRecordThemeStyle(this.theme) as ExcelStyle,
                             indent + col + 1);
        }
        let templateRowHeight: number;
        for (let row: number = 0; row < gridRows.length; row++) {
            let currentCellIndex: number = 1 + indent;
            const cells: ExcelCell[] = [];

            for (let column: number = 0; column < gridRows[parseInt(row.toString(), 10)].cells.length; column++) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                let style: any = {};
                const cell: ExcelCell = {};

                const gridCell: Cell<Column> = gridRows[parseInt(row.toString(), 10)].cells[parseInt(column.toString(), 10)];

                if (gridCell.cellType === CellType.HeaderIndent || gridCell.cellType === CellType.DetailHeader) {
                    continue;
                }

                let result: { contains: boolean, index: number } = { contains: true, index: 1 };
                while (result.contains) {
                    result = this.getIndex(spannedCells, rowIndex, currentCellIndex);
                    currentCellIndex = result.index;
                    if (!result.contains) {
                        cell.index = result.index + (<{childGridLevel?: number}>gObj).childGridLevel;
                        break;
                    }
                }
                if (!isNullOrUndefined(gridCell.rowSpan) && gridCell.rowSpan !== 1) {
                    cell.rowSpan = gridCell.rowSpan;
                    for (let i: number = rowIndex; i < gridCell.rowSpan + rowIndex; i++) {
                        const spannedCell: { rowIndex: number, columnIndex: number } = { rowIndex: 0, columnIndex: 0 };
                        spannedCell.rowIndex = i;
                        spannedCell.columnIndex = currentCellIndex;
                        spannedCells.push(spannedCell);
                    }
                }
                if (!isNullOrUndefined(gridCell.colSpan) && gridCell.colSpan !== 1) {
                    cell.colSpan = gridCell.colSpan;
                    currentCellIndex = currentCellIndex + cell.colSpan - 1;
                }
                cell.value = gridCell.column.headerText;

                style = this.getHeaderThemeStyle(this.theme);
                if (!isNullOrUndefined(gridCell.column.textAlign)) {
                    style.hAlign = gridCell.column.textAlign.toLowerCase() as ExcelHAlign;
                }
                if (!isNullOrUndefined(gridCell.column.headerTextAlign)) {
                    style.hAlign = gridCell.column.headerTextAlign.toLowerCase() as ExcelHAlign;
                }

                const excelHeaderCellArgs: ExcelHeaderQueryCellInfoEventArgs = { cell: cell, gridCell: gridCell, style: style };
                gObj.trigger(events.excelHeaderQueryCellInfo, excelHeaderCellArgs);
                if (excelHeaderCellArgs.style.rotation) {
                    this.headerRotation(excelHeaderCellArgs);
                }
                if (!isNullOrUndefined(excelHeaderCellArgs.image) && !isNullOrUndefined(excelHeaderCellArgs.image.base64)) {
                    templateRowHeight = this.setImage(excelHeaderCellArgs, currentCellIndex);
                }

                if (!isNullOrUndefined(excelHeaderCellArgs.hyperLink)) {
                    (excelHeaderCellArgs.cell as ExcelCell).hyperlink = { target: excelHeaderCellArgs.hyperLink.target };
                    cell.value = excelHeaderCellArgs.hyperLink.displayText || cell.value;
                }
                cell.style = excelHeaderCellArgs.style;
                cells.push(cell);
                currentCellIndex++;
            }
            const excelRow: ExcelRow = { index: this.rowLength++, cells: cells };
            if (!isNullOrUndefined(templateRowHeight)) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (excelRow as any).height = templateRowHeight;
            }
            excelRows.push(excelRow);
        }
        return excelRows;
    }

    private getHeaderThemeStyle(theme: ExcelTheme): ExcelTheme {
        let style: ExcelStyle = {};
        style.fontSize = 12;
        style.borders = { color: '#E0E0E0' };
        style.bold = true;
        if (!isNullOrUndefined(theme) && !isNullOrUndefined(theme.header)) {
            style = this.updateThemeStyle((<{header?: Object}>theme).header, style);
        }
        return style as ExcelTheme;
    }

    private updateThemeStyle(themestyle: ExcelTheme, style: ExcelStyle): ExcelStyle {
        return extend(style, themestyle);
    }

    private getCaptionThemeStyle(theme: ExcelTheme): ExcelTheme {
        let style: ExcelStyle = {};
        style.fontSize = 13;
        style.backColor = '#F6F6F6';
        if (!isNullOrUndefined(theme) && !isNullOrUndefined(theme.caption)) {
            style = this.updateThemeStyle((<{caption?: Object}>theme).caption, style);
        }
        return style as ExcelTheme;
    }

    private getRecordThemeStyle(theme: ExcelTheme): ExcelTheme {
        let style: ExcelStyle = {};
        style.fontSize = 13;
        style.borders = { color: '#E0E0E0' };
        if (!isNullOrUndefined(theme) && !isNullOrUndefined(theme.record)) {
            style = this.updateThemeStyle((<{record?: Object}>theme).record, style);
        }
        return style as ExcelTheme;
    }

    private processExcelHeader(header: ExcelHeader): void {
        if (!isNullOrUndefined(header.rows) && (this.expType === 'NewSheet' || this.rowLength === 1)) {
            let noRows: number;
            if (header.headerRows === undefined) {
                this.rowLength = header.rows.length;
            } else {
                this.rowLength = header.headerRows;
            }
            if (this.rowLength < header.rows.length) {
                noRows = this.rowLength;
            } else {
                noRows = header.rows.length;
            }
            this.rowLength++;
            for (let row: number = 0; row < noRows; row++) {
                const json: ExcelRow = header.rows[parseInt(row.toString(), 10)];

                //Row index
                if (!(json.index !== null && !isNullOrUndefined(json.index))) {
                    json.index = (row + 1);
                }
                this.updatedCellIndex(json);
            }
        }
    }

    private updatedCellIndex(json: ExcelRow): void {
        const cellsLength: number = json.cells.length;
        for (let cellId: number = 0; cellId < cellsLength; cellId++) {
            const jsonCell: ExcelCell = json.cells[parseInt(cellId.toString(), 10)];
            //cell index
            if (!(jsonCell.index !== null && !isNullOrUndefined(jsonCell.index))) {
                jsonCell.index = (cellId + 1);
            }
        }
        this.rows.push(json);
    }

    private processExcelFooter(footer: ExcelFooter): void {
        if (!isNullOrUndefined(footer.rows)) {
            let noRows: number;
            if (footer.footerRows === undefined) {
                this.rowLength += footer.rows.length;
            } else {
                if (footer.footerRows > footer.rows.length) {
                    this.rowLength += (footer.footerRows - footer.rows.length);
                    noRows = footer.rows.length;
                } else {
                    noRows = footer.footerRows;
                }
            }

            for (let row: number = 0; row < noRows; row++) {
                const json: ExcelRow = footer.rows[parseInt(row.toString(), 10)];

                //Row index
                if (json.index === null || json.index === undefined) {
                    json.index = this.rowLength++;
                } else {
                    json.index += this.rowLength;
                }
                this.updatedCellIndex(json);
            }
        }
    }

    private getIndex(spannedCells: ISpannedCell[], rowIndex: number, columnIndex: number): { contains: boolean, index: number } {
        for (const spannedCell of spannedCells) {
            if ((spannedCell.rowIndex === rowIndex) && (spannedCell.columnIndex === columnIndex)) {
                columnIndex = columnIndex + 1;
                return { contains: true, index: columnIndex };
            }
        }
        return { contains: false, index: columnIndex };
    }

    private parseStyles(gObj: IGrid, col: Column, style: ExcelStyle, index: number): void {
        if (!isNullOrUndefined(col.format)) {
            if (typeof col.format === 'object') {
                const format: DateFormatOptions = col.format;
                style.numberFormat = !isNullOrUndefined(format.format) ? format.format : format.skeleton;
                if (!isNullOrUndefined(format.type)) {
                    style.type = format.type.toLowerCase();
                }
            } else {
                style.numberFormat = col.format;
                style.type = col.type;
            }
        }
        if (!isNullOrUndefined(col.textAlign)) {
            style.hAlign = col.textAlign.toLowerCase() as ExcelHAlign;
        }
        if (Object.keys(style).length > 0) {
            (<{name?: string}>style).name = gObj.element.id + 'column' + index;
            this.styles.push(style);
        }
        if (!isNullOrUndefined(col.width) && col.width !== 'auto' && !(<{childGridLevel?: number}>gObj).childGridLevel) {
            this.columns.push({ index: index + (<{childGridLevel?: number}>gObj).childGridLevel, width: typeof col.width === 'number' ?
                col.width : this.helper.getConvertedWidth(col.width) });
        }
    }

    public destroy(): void {
        //destroy for exporting
    }
}
interface SummaryData {
    aggregates?: Object;
    level?: number;
}

interface ISpannedCell {
    rowIndex?: number;
    columnIndex?: number;
}

interface IHeader {
    rows?: Row<Column>[];
    columns?: Column[];
}
