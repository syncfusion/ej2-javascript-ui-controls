import {
    IGrid, ExcelExportProperties, ExcelHeader, ExcelFooter, ExcelRow,
    ExcelCell, Theme, ThemeStyle, ExcelQueryCellInfoEventArgs, ExcelHeaderQueryCellInfoEventArgs, ExcelStyle
} from '../base/interface';
import * as events from '../base/constant';
import { Workbook } from '@syncfusion/ej2-excel-export';
import { isNullOrUndefined, getEnumValue, compile, extend, getValue } from '@syncfusion/ej2-base';
import { Data } from '../actions/data';
import { ReturnType } from '../base/type';
import { ExportHelper, ExportValueFormatter } from './export-helper';
import { Row } from '../models/row';
import { Column } from '../models/column';
import { SummaryModelGenerator, GroupSummaryModelGenerator, CaptionSummaryModelGenerator } from '../services/summary-model-generator';
import { AggregateColumnModel } from '../models/aggregate-model';
import { CellType, MultipleExportType } from '../base/enum';
import { Query, DataManager } from '@syncfusion/ej2-data';
import { Grid } from '../base/grid';

/**
 * @hidden
 * `ExcelExport` module is used to handle the Excel export action.
 */
export class ExcelExport {
    private parent: IGrid;
    private isExporting: boolean;
    private theme: Theme;
    /* tslint:disable-next-line:no-any */
    private book: any = {};
    /* tslint:disable-next-line:no-any */
    private workSheet: any = [];
    /* tslint:disable-next-line:no-any */
    private rows: any = [];
    /* tslint:disable-next-line:no-any */
    private columns: any = [];
    /* tslint:disable-next-line:no-any */
    private styles: any = [];
    private data: Data;
    private rowLength: number = 1;
    /* tslint:disable-next-line:no-any */
    private footer: any;
    private expType: MultipleExportType = 'AppendToSheet';
    private includeHiddenColumn: boolean = false;
    private isCsvExport: boolean = false;
    private isBlob: boolean;
    private blobPromise: Promise<{ blobData: Blob }>;
    private exportValueFormatter: ExportValueFormatter;
    private isElementIdChanged: boolean = false;
    private helper: ExportHelper;
    private foreignKeyData: { [key: string]: Object[] } = {};
    private groupedColLength: number;

    /**
     * Constructor for the Grid Excel Export module.
     * @hidden
     */
    constructor(parent?: IGrid) {
        this.parent = parent;
        this.helper = new ExportHelper(parent);
    }
    /**
     * For internal use only - Get the module name.
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
        /* tslint:disable-next-line:no-any */
        this.workSheet = [];
        /* tslint:disable-next-line:no-any */
        this.rows = [];
        /* tslint:disable-next-line:no-any */
        this.columns = [];
        /* tslint:disable-next-line:no-any */
        this.styles = [];
        this.rowLength = 1;
        /* tslint:disable-next-line:no-any */
        this.footer = undefined;
        this.expType = 'AppendToSheet';
        this.includeHiddenColumn = false;
        this.exportValueFormatter = new ExportValueFormatter(gObj.locale);
    }

    /**
     * Export Grid to Excel file.
     * @param  {exportProperties} exportProperties - Defines the export properties of the Grid.
     * @param  {isMultipleExport} isMultipleExport - Defines is multiple Grid's are exported.
     * @param  {workbook} workbook - Defined the Workbook if multiple Grid is exported.
     * @param  {isCsv} isCsv - true if export to CSV.
     * @return {Promise<any>} 
     */
    /* tslint:disable-next-line:max-line-length */
    /* tslint:disable-next-line:no-any */
    public Map(grid: IGrid, exportProperties: ExcelExportProperties, isMultipleExport: boolean, workbook: any, isCsv: boolean, isBlob: boolean): Promise<any> {
        let gObj: IGrid = grid;
        let cancel: string = 'cancel';
        let isBlb: string = 'isBlob';
        let csv: string = 'isCsv';
        let workbk: string = 'workbook';
        let isMultiEx: string = 'isMultipleExport';
        let args: Object = {
            requestType: 'beforeExcelExport', gridObject: gObj, cancel: false,
            isMultipleExport: isMultipleExport, workbook: workbook, isCsv: isCsv, isBlob: isBlob
        };
        gObj.trigger(events.beforeExcelExport, args);
        this.data = new Data(gObj);
        this.isExporting = true;
        this.isBlob = args[isBlb];
        if (args[csv]) {
            this.isCsvExport = args[csv];
        } else {
            this.isCsvExport = false;
        }

        return this.processRecords(gObj, exportProperties, args[isMultiEx], args[workbk]);
    }
    /* tslint:disable-next-line:no-any */
    private processRecords(gObj: IGrid, exportProperties: ExcelExportProperties, isMultipleExport: boolean, workbook: any): Promise<any> {
        if (!isNullOrUndefined(exportProperties) && !isNullOrUndefined(exportProperties.dataSource) &&
            exportProperties.dataSource instanceof DataManager) {
            /* tslint:disable-next-line:no-any */
            return new Promise((resolve: Function, reject: Function) => {
                /* tslint:disable-next-line:max-line-length */
                /* tslint:disable-next-line:no-any */
                let dataManager: any = (exportProperties.dataSource as DataManager).executeQuery(new Query());
                dataManager.then((r: ReturnType) => {
                    this.init(gObj);
                    this.processInnerRecords(gObj, exportProperties, isMultipleExport, workbook, r);
                    resolve(this.book);
                });
            });

        } else {
            /* tslint:disable-next-line:no-any */
            let allPromise: Promise<Object>[] = [];
            allPromise.push(this.data.getData({}, ExportHelper.getQuery(gObj, this.data)));
            allPromise.push(this.helper.getColumnData(<Grid>gObj));
            return Promise.all(allPromise).then((e: ReturnType[]) => {
                this.init(gObj);
                this.processInnerRecords(gObj, exportProperties, isMultipleExport, workbook, e[0]);
                return this.book;
            }).catch((e: Error) => {
                this.parent.trigger(events.actionFailure, e);
            });
        }
    }

    /* tslint:disable-next-line:max-line-length */
    /* tslint:disable-next-line:no-any */
    private processInnerRecords(gObj: IGrid, exportProperties: ExcelExportProperties, isMultipleExport: boolean, workbook: any, r: ReturnType): any {
        this.groupedColLength = gObj.groupSettings.columns.length;
        let blankRows: number = 5;
        if (!isNullOrUndefined(exportProperties) && !isNullOrUndefined(exportProperties.multipleExport)) {
            /* tslint:disable-next-line:max-line-length */
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
        } else if (this.expType === 'NewSheet') {
            this.workSheet = workbook.worksheets;
            this.rows = [];
            this.columns = [];
            this.styles = workbook.styles;
        } else {
            this.workSheet = [];
            this.rows = workbook.worksheets[0].rows;
            this.columns = workbook.worksheets[0].columns;
            this.styles = workbook.styles;
            this.rowLength = (this.rows[this.rows.length - 1].index + blankRows);
            this.rowLength++;
        }

        if (!isNullOrUndefined(exportProperties)) {
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
        this.includeHiddenColumn = (!isNullOrUndefined(exportProperties) ? exportProperties.includeHiddenColumn : false);
        /* tslint:disable-next-line:max-line-length */
        /* tslint:disable-next-line:no-any */
        let headerRow: { rows: any[], columns: Column[] } = this.helper.getHeaders(gObj.columns, this.includeHiddenColumn);
        let groupIndent: number = 0;
        /* tslint:disable:no-any */
        if (!isNullOrUndefined(((r.result) as any).level)) {
            groupIndent += ((r.result) as any).level;
            groupIndent += ((r.result) as any).childLevels;
        }
        /* tslint:enable:no-any */
        this.processHeaderContent(gObj, headerRow, exportProperties, groupIndent);
        /* tslint:disable-next-line:max-line-length */
        if (!isNullOrUndefined(exportProperties) && !isNullOrUndefined(exportProperties.dataSource) && !(exportProperties.dataSource instanceof DataManager)) {
            this.processRecordContent(gObj, r, headerRow, isMultipleExport, exportProperties, exportProperties.dataSource as Object[]);
        } else if (!isNullOrUndefined(exportProperties) && exportProperties.exportType === 'CurrentPage') {
            this.processRecordContent(gObj, r, headerRow, isMultipleExport, exportProperties, gObj.currentViewData);
        } else {
            this.processRecordContent(gObj, r, headerRow, isMultipleExport, exportProperties);
        }
        this.isExporting = false;
        gObj.trigger(events.excelExportComplete, this.isBlob ? { promise: this.blobPromise } : {});

    }
    /* tslint:disable-next-line:max-line-length */
    /* tslint:disable-next-line:no-any */
    private processRecordContent(gObj: IGrid, returnType: ReturnType, headerRow: any, isMultipleExport: boolean, exportProperties: ExcelExportProperties, currentViewRecords?: Object[]): void {
        /* tslint:disable-next-line:no-any */
        let column: any[] = gObj.columns;

        /* tslint:disable-next-line:no-any */
        let record: any = undefined;
        if (!isNullOrUndefined(currentViewRecords)) {
            record = currentViewRecords;
        } else {
            record = returnType.result;
        }

        if (!isNullOrUndefined(record.level)) {
            this.processGroupedRows(gObj, record, headerRow, record.level);
        } else {
            this.processRecordRows(gObj, record, headerRow, 0);
        }
        if (!isNullOrUndefined(returnType.aggregates)) {
            if (!isNullOrUndefined(currentViewRecords)) {
                this.processAggregates(gObj, returnType.result, currentViewRecords);
            } else {
                this.processAggregates(gObj, returnType.result);
            }
        }

        //footer template add
        if (!isNullOrUndefined(this.footer)) {
            if ((this.expType === 'AppendToSheet' && !isMultipleExport) || (this.expType === 'NewSheet')) {
                this.processExcelFooter(this.footer);
            }
        }

        /* tslint:disable-next-line:no-any */
        let sheet: any = {};
        if (this.columns.length > 0) {
            sheet.columns = this.columns;
        }
        sheet.rows = this.rows;
        this.workSheet.push(sheet);

        this.book.worksheets = this.workSheet;
        this.book.styles = this.styles;

        if (!isMultipleExport) {
            if (this.isCsvExport) {
                let book: Workbook = new Workbook(this.book, 'csv', gObj.locale);
                if (!this.isBlob) {
                    if (!isNullOrUndefined(exportProperties) && exportProperties.fileName) {
                        book.save(exportProperties.fileName);
                    } else {
                        book.save('Export.csv');
                    }
                } else {
                    this.blobPromise = book.saveAsBlob('text/csv');
                }

            } else {
                let book: Workbook = new Workbook(this.book, 'xlsx', gObj.locale);
                if (!this.isBlob) {
                    if (!isNullOrUndefined(exportProperties) && exportProperties.fileName) {
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
        }
    }
    /* tslint:disable-next-line:no-any */
    private processGroupedRows(gObj: IGrid, dataSource: any, headerRow: any, level: number): void {
        for (let item of dataSource) {
            /* tslint:disable-next-line:no-any */
            let cells: any = [];
            let index: number = 1;
            /* tslint:disable-next-line:no-any */
            let cell: any = {};
            cell.index = index + level;
            let col: Column = gObj.getColumnByField(item.field);
            /* tslint:disable-next-line:no-any */
            let args: any = {
                value: item.key,
                column: col,
                style: undefined,
                isForeignKey: col.isForeignColumn(),
            };

            cell.value = this.parent.getColumnByField(item.field).headerText +
            ': ' + this.exportValueFormatter.formatCellValue(args) + ' - ';
            if (item.count > 1) {
                cell.value += item.count + ' items';
            } else {
                cell.value += item.count + ' item';
            }
            cell.style = this.getCaptionThemeStyle(this.theme);
            let captionModelGen: CaptionSummaryModelGenerator = new CaptionSummaryModelGenerator(gObj);
            let groupCaptionSummaryRows: Row<AggregateColumnModel>[] = captionModelGen.generateRows(item);
            this.fillAggregates(gObj, groupCaptionSummaryRows, dataSource.level + dataSource.childLevels, this.rowLength);
            cells.push(cell);
            if (this.rows[this.rows.length - 1].cells.length > 0) {
                let lIndex: number = dataSource.level + dataSource.childLevels + groupCaptionSummaryRows[0].cells.length;
                let hIndex: number = 0;
                for (let tCell of this.rows[this.rows.length - 1].cells) {
                    if (tCell.index < lIndex) {
                        lIndex = tCell.index;
                    }
                    if (tCell.index > hIndex) {
                        hIndex = tCell.index;
                    }
                    tCell.style = this.getCaptionThemeStyle(this.theme);
                    if (cells[cells.length - 1].index !== tCell.index) {
                        cells.push(tCell);
                    }
                }
                if ((lIndex - cell.index) > 1) {
                    cell.colSpan = lIndex - cell.index;
                }
                while (hIndex < (headerRow.columns.length + level + dataSource.childLevels)) {
                    /* tslint:disable-next-line:no-any */
                    let sCell: any = {};
                    sCell.index = (hIndex + 1);
                    sCell.style = this.getCaptionThemeStyle(this.theme);
                    cells.push(sCell);
                    hIndex++;
                }
            } else {
                let span: number = 0;
                //Calculation for column span when group caption dont have aggregates
                for (let col of headerRow.columns) {
                    if ((col as Column).visible) {
                        span++;
                    }
                }
                cell.colSpan = (dataSource.childLevels + span);
            }
            this.rows[this.rows.length - 1].cells = cells;
            this.rowLength++;
            if (this.groupedColLength < 8 && level > 1) {
                let grouping: Object = { outlineLevel: level - 1, isCollapsed: true };
                this.rows[this.rows.length - 1].grouping = grouping;
            }

            if (!isNullOrUndefined(dataSource.childLevels) && dataSource.childLevels > 0) {
                this.processGroupedRows(gObj, item.items, headerRow, item.items.level);
            } else {
                this.processRecordRows(gObj, item.items, headerRow, (level));
                this.processAggregates(gObj, item, undefined, (level), true);
            }
        }
    }
    /* tslint:disable-next-line:no-any */
    private processRecordRows(gObj: IGrid, record: any, headerRow: any, level: number): void {
        let rLen: number = Object.keys(record).length;
        let index: number = 1;
        /* tslint:disable-next-line:no-any */
        let cells: any = [];
        for (let r: number = 0; r < rLen; r++) {
            cells = [];
            index = 1;
            for (let c: number = 0, len: number = headerRow.columns.length; c < len; c++) {
                /* tslint:disable-next-line:no-any */
                let value: any = !isNullOrUndefined(headerRow.columns[c].field) ? getValue(headerRow.columns[c].field, record[r]) : '';
                let column: Column = headerRow.columns[c] as Column;
                let foreignKeyData: Object;
                // tslint:disable-next-line:max-line-length
                if (column.isForeignColumn && column.isForeignColumn()) {
                    foreignKeyData = this.helper.getFData(value, column);
                    value = getValue(column.foreignKeyValue, foreignKeyData);
                }
                if (!isNullOrUndefined(value)) {
                    /* tslint:disable-next-line:no-any */
                    let excelCellArgs: any = { data: record[r], column: headerRow.columns[c], foreignKeyData: foreignKeyData };
                    let cell: { index?: number, value?: number, colSpan?: number, style?: ExcelStyle | {name : string}} = {};
                    gObj.trigger(events.excelQueryCellInfo, extend(
                        excelCellArgs,
                        <ExcelQueryCellInfoEventArgs>{
                            column: headerRow.columns[c], data: record[r],
                            value: value, style: undefined, colSpan: 1, cell: cell
                        }));
                    cell = excelCellArgs.cell;
                    cell.index = index + level;
                    cell.value = excelCellArgs.value;
                    if (excelCellArgs.colSpan > 1) {
                        cell.colSpan = excelCellArgs.colSpan;
                    }
                    if (!isNullOrUndefined(excelCellArgs.style)) {
                        let styleIndex: number = this.getColumnStyle(gObj, index + level);
                        cell.style = this.mergeOptions(this.styles[styleIndex], excelCellArgs.style);
                    } else {
                        cell.style = { name: gObj.element.id + 'column' + (index + level) };
                    }
                    cells.push(cell);
                }
                index++;

            }
            if (this.groupedColLength < 8 && level > 0) {
                let grouping: Object = { outlineLevel: level, isCollapsed: true };
                this.rows.push({ index: this.rowLength++, cells: cells, grouping: grouping});
            } else {
                this.rows.push({ index: this.rowLength++, cells: cells });
            }
        }
    }
    /* tslint:disable-next-line:no-any */
    private processAggregates(gObj: IGrid, rec: any, currentViewRecords?: Object[], indent?: number, byGroup?: boolean): void {
        let summaryModel: SummaryModelGenerator = new SummaryModelGenerator(gObj);

        /* tslint:disable-next-line:no-any */
        let data: any = undefined;
        if (!isNullOrUndefined(currentViewRecords)) {
            data = currentViewRecords;
        } else {
            data = rec;
        }
        if (indent === undefined) {
            indent = 0;
        }
        if (gObj.groupSettings.columns.length > 0 && byGroup) {
            let groupSummaryModel: GroupSummaryModelGenerator = new GroupSummaryModelGenerator(gObj);
            let groupSummaryRows: Row<AggregateColumnModel>[] = groupSummaryModel.generateRows(<Object>data, { level: data.level });
            if (groupSummaryRows.length > 0) {
                this.fillAggregates(gObj, groupSummaryRows, indent);
            }
        } else {
            indent = gObj.groupSettings.columns.length > 0 && !byGroup ? gObj.groupSettings.columns.length : indent;
            let sRows: Row<AggregateColumnModel>[] = summaryModel.generateRows(data, <SummaryData>rec.aggregates);
            if (sRows.length > 0 && !byGroup) {
                this.fillAggregates(gObj, sRows, indent);
            }
        }

    }
    /* tslint:disable-next-line:no-any */
    private fillAggregates(gObj: IGrid, cells: any, indent: number, customIndex?: number): void {
        for (let row of cells) {
            /* tslint:disable-next-line:no-any */
            let cells: any = [];
            let index: number = 0;
            for (let cell of row.cells) {
                /* tslint:disable-next-line:no-any */
                let eCell: any = {};
                if ((cell.visible || this.includeHiddenColumn)) {
                    index++;
                    if (cell.isDataCell) {
                        eCell.index = index + indent;
                        if (!isNullOrUndefined(cell.column.footerTemplate)) {
                            eCell.value = this.getAggreateValue(CellType.Summary, cell.column.footerTemplate, cell, row);
                        } else if (!isNullOrUndefined(cell.column.groupFooterTemplate)) {
                            eCell.value = this.getAggreateValue(CellType.GroupSummary, cell.column.groupFooterTemplate, cell, row);
                        } else if (!isNullOrUndefined(cell.column.groupCaptionTemplate)) {
                            eCell.value = this.getAggreateValue(CellType.CaptionSummary, cell.column.groupCaptionTemplate, cell, row);
                        } else {
                            for (let key of Object.keys(row.data[cell.column.field])) {
                                if (key === cell.column.type) {
                                    if (!isNullOrUndefined(row.data[cell.column.field].Sum)) {
                                        eCell.value = row.data[cell.column.field].Sum;
                                    } else if (!isNullOrUndefined(row.data[cell.column.field].Average)) {
                                        eCell.value = row.data[cell.column.field].Average;
                                    } else if (!isNullOrUndefined(row.data[cell.column.field].Max)) {
                                        eCell.value = row.data[cell.column.field].Max;
                                    } else if (!isNullOrUndefined(row.data[cell.column.field].Min)) {
                                        eCell.value = row.data[cell.column.field].Min;
                                    } else if (!isNullOrUndefined(row.data[cell.column.field].Count)) {
                                        eCell.value = row.data[cell.column.field].Count;
                                    } else if (!isNullOrUndefined(row.data[cell.column.field].TrueCount)) {
                                        eCell.value = row.data[cell.column.field].TrueCount;
                                    } else if (!isNullOrUndefined(row.data[cell.column.field].FalseCount)) {
                                        eCell.value = row.data[cell.column.field].FalseCount;
                                    } else if (!isNullOrUndefined(row.data[cell.column.field].Custom)) {
                                        eCell.value = row.data[cell.column.field].Custom;
                                    }
                                }
                            }
                        }
                        eCell.style = this.getCaptionThemeStyle(this.theme); //{ name: gObj.element.id + 'column' + index };
                        if (cell.attributes.style.textAlign) {
                            eCell.style.hAlign = cell.attributes.style.textAlign;
                        }
                        cells.push(eCell);

                    } else {
                        if (customIndex === undefined) {
                            eCell.index = index + indent;
                            eCell.style = this.getCaptionThemeStyle(this.theme); //{ name: gObj.element.id + 'column' + index };
                            cells.push(eCell);

                        }
                    }
                }
            }
            if (!isNullOrUndefined(customIndex)) {
                this.rows.push({ index: customIndex, cells: cells });
            } else {
                let row: Object = {};
                if (this.groupedColLength < 8 && this.groupedColLength > 0) {
                    let dummyOutlineLevel: string = 'outlineLevel';
                    let dummyGrouping: string = 'grouping';
                    let level: number = this.rows[this.rows.length - 1][dummyGrouping][dummyOutlineLevel];
                    let grouping: Object = { outlineLevel: level, isCollapsed: true };
                    row = {index: this.rowLength++, cells: cells, grouping};
                } else {
                    row = {index: this.rowLength++, cells: cells};
                }
                this.rows.push(row);
            }
        }
    }
    /* tslint:disable-next-line:no-any */
    private getAggreateValue(cellType: CellType, template: any, cell: any, row: any): string {
        let templateFn: { [x: string]: Function } = {};
        templateFn[getEnumValue(CellType, cell.cellType)] = compile(template);
        /* tslint:disable-next-line:max-line-length */
        let txt: NodeList = (templateFn[getEnumValue(CellType, cell.cellType)](row.data[cell.column.field ? cell.column.field : cell.column.columnName]));
        return (<Text>txt[0]).wholeText;
    }
    /* tslint:disable-next-line:no-any */
    private mergeOptions(JSON1: any, JSON2: any): any {
        /* tslint:disable-next-line:no-any */
        let result: any = {};
        /* tslint:disable-next-line:no-any */
        let attrname: any = Object.keys(JSON1);
        for (let index: number = 0; index < attrname.length; index++) {
            if (attrname[index] !== 'name') {
                result[attrname[index]] = JSON1[attrname[index]];
            }
        }
        attrname = Object.keys(JSON2);
        for (let index: number = 0; index < attrname.length; index++) {
            if (attrname[index] !== 'name') {
                result[attrname[index]] = JSON2[attrname[index]];
            }
        }
        return result;
    }

    private getColumnStyle(gObj: IGrid, columnIndex: number): number {
        let index: number = 0;
        for (let style of this.styles) {
            if (style.name === gObj.element.id + 'column' + columnIndex) {
                return index;
            }
            index++;
        }
        return undefined;
    }
    /* tslint:disable-next-line:no-any */
    private processHeaderContent(gObj: IGrid, headerRow: any, exportProperties: ExcelExportProperties, indent: number): void {
        /* tslint:disable-next-line:no-any */
        let column: any[] = gObj.columns;
        let rowIndex: number = 1;
        /* tslint:disable-next-line:no-any */
        let returnValue: { rows: any[], columns: Column[] } = headerRow;
        /* tslint:enable:no-any */
        let gridRows: Row<Column>[] = returnValue.rows;
        // Column collection with respect to the records in the grid
        let gridColumns: Column[] = returnValue.columns;
        /* tslint:disable-next-line:no-any */
        let spannedCells: any[] = [];
        if (indent > 0) {
            let index: number = 0;
            while (index !== indent) {
                this.columns.push({ index: index + 1, width: 30 });
                index++;
            }
        }
        for (let row: number = 0; row < gridRows.length; row++) {
            let currentCellIndex: number = 1 + indent;
            /* tslint:disable-next-line:no-any */
            let cells: any[] = [];

            for (let column: number = 0; column < gridRows[row].cells.length; column++) {
                /* tslint:disable-next-line:no-any */
                let style: any = {};
                /* tslint:disable-next-line:no-any */
                let cell: any = {};
                /* tslint:disable-next-line:no-any */
                let gridCell: any = gridRows[row].cells[column];
                /* tslint:disable-next-line:no-any */
                let result: any = { contains: true, index: 1 };
                while (result.contains) {
                    result = this.getIndex(spannedCells, rowIndex, currentCellIndex);
                    currentCellIndex = result.index;
                    if (!result.contains) {
                        cell.index = result.index;
                        break;
                    }
                }
                if (!isNullOrUndefined(gridCell.rowSpan) && gridCell.rowSpan !== 1) {
                    cell.rowSpan = gridCell.rowSpan;
                    for (let i: number = rowIndex; i < gridCell.rowSpan + rowIndex; i++) {
                        /* tslint:disable-next-line:no-any */
                        let spannedCell: any = { rowIndex: 0, columnIndex: 0 };
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
                if (!isNullOrUndefined(exportProperties) && !isNullOrUndefined(exportProperties.theme)) {
                    this.theme = exportProperties.theme;
                }
                style = this.getHeaderThemeStyle(this.theme);
                if (!isNullOrUndefined(gridCell.column.textAlign)) {
                    style.hAlign = gridCell.column.textAlign;
                }
                if (!isNullOrUndefined(gridCell.column.headerTextAlign)) {
                    style.hAlign = gridCell.column.headerTextAlign;
                }
                /* tslint:disable-next-line:no-any */
                let excelHeaderCellArgs: any = { cell: cell, gridCell: gridCell, setStyle: style };
                gObj.trigger(events.excelHeaderQueryCellInfo, extend(
                    excelHeaderCellArgs,
                    <ExcelHeaderQueryCellInfoEventArgs>{
                        cell: cell, setStyle: style
                    }));
                cell.style = style;
                cells.push(cell);
                currentCellIndex++;
            }
            this.rows.push({ index: this.rowLength++, cells: cells });
        }

        for (let col: number = 0; col < gridColumns.length; col++) {
            this.parseStyles(gObj, gridColumns[col], this.getRecordThemeStyle(this.theme), indent + col + 1);
        }
    }
    /* tslint:disable-next-line:no-any */
    private getHeaderThemeStyle(theme: Theme): any {
        /* tslint:disable-next-line:no-any */
        let style: any = {};
        style.fontSize = 12;
        style.borders = { color: '#E0E0E0' };
        if (!isNullOrUndefined(theme) && !isNullOrUndefined(theme.header)) {
            style = this.updateThemeStyle(theme.header, style);
        }
        return style;
    }
    /* tslint:disable-next-line:no-any */
    private updateThemeStyle(themestyle: ThemeStyle, style: any): any {
        if (!isNullOrUndefined(themestyle.fontColor)) {
            style.fontColor = themestyle.fontColor;
        }
        if (!isNullOrUndefined(themestyle.fontName)) {
            style.fontName = themestyle.fontName;
        }
        if (!isNullOrUndefined(themestyle.fontSize)) {
            style.fontSize = themestyle.fontSize;
        }
        if (!isNullOrUndefined(themestyle.borders)) {
            if (!isNullOrUndefined(themestyle.borders.color)) {
                style.borders.color = themestyle.borders.color;
            }
            if (!isNullOrUndefined(themestyle.borders.lineStyle)) {
                style.borders.lineStyle = themestyle.borders.lineStyle;
            }
        }
        if (themestyle.bold !== false) {
            style.bold = themestyle.bold;
        }
        return style;
    }
    /* tslint:disable-next-line:no-any */
    private getCaptionThemeStyle(theme: Theme): any {
        /* tslint:disable-next-line:no-any */
        let style: any = {};
        style.fontSize = 13;
        style.backColor = '#F6F6F6';
        if (!isNullOrUndefined(theme) && !isNullOrUndefined(theme.caption)) {
            style = this.updateThemeStyle(theme.caption, style);
        }
        return style;
    }
    /* tslint:disable-next-line:no-any */
    private getRecordThemeStyle(theme: Theme): any {
        /* tslint:disable-next-line:no-any */
        let style: any = {};
        style.fontSize = 13;
        style.borders = { color: '#E0E0E0' };
        if (!isNullOrUndefined(theme) && !isNullOrUndefined(theme.record)) {
            style = this.updateThemeStyle(theme.record, style);
        }
        return style;
    }
    /* tslint:disable-next-line:no-any */
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
                /* tslint:disable-next-line:no-any */
                let json: ExcelRow = header.rows[row];

                //Row index
                if (!(json.index !== null && !isNullOrUndefined(json.index))) {
                    json.index = (row + 1);
                }
                this.updatedCellIndex(json);
            }
        }
    }
    /* tslint:disable-next-line:no-any */
    private updatedCellIndex(json: ExcelRow): void {
        let cellsLength: number = json.cells.length;
        for (let cellId: number = 0; cellId < cellsLength; cellId++) {
            /* tslint:disable-next-line:no-any */
            let jsonCell: ExcelCell = json.cells[cellId];
            //cell index
            if (!(jsonCell.index !== null && !isNullOrUndefined(jsonCell.index))) {
                jsonCell.index = (cellId + 1);
            }
        }
        this.rows.push(json);
    }
    /* tslint:disable-next-line:no-any */
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
                /* tslint:disable-next-line:no-any */
                let json: ExcelRow = footer.rows[row];

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

    /* tslint:disable-next-line:no-any */
    private getIndex(spannedCells: any, rowIndex: number, columnIndex: number): { contains: boolean, index: number } {
        for (let spannedCell of spannedCells) {
            if ((spannedCell.rowIndex === rowIndex) && (spannedCell.columnIndex === columnIndex)) {
                columnIndex = columnIndex + 1;
                return { contains: true, index: columnIndex };
            }
        }
        return { contains: false, index: columnIndex };
    }
    /* tslint:disable-next-line:no-any */
    private parseStyles(gObj: IGrid, col: any, style: any, index: number): void {
        if (!isNullOrUndefined(col.format)) {
            if (typeof col.format === 'object') {
                style.numberFormat = !isNullOrUndefined(col.format.format) ? col.format.format : col.format.skeleton;
                if (!isNullOrUndefined(col.format.type)) {
                    style.type = col.format.type;
                }
            } else {
                style.numberFormat = col.format;
                style.type = col.type;
            }
        }
        if (!isNullOrUndefined(col.textAlign)) {
            style.hAlign = col.textAlign;
        }
        if (Object.keys(style).length > 0) {
            style.name = gObj.element.id + 'column' + index;
            this.styles.push(style);
        }
        if (!isNullOrUndefined(col.width)) {
            /* tslint:disable-next-line:max-line-length */
            this.columns.push({ index: index, width: typeof col.width === 'number' ? col.width : this.helper.getConvertedWidth(col.width) });
        }
    }
    /**
     * To destroy the excel export
     * @return {void}
     * @hidden
     */
    public destroy(): void {
        //destroy for exporting
    }
}
interface SummaryData {
    aggregates?: Object;
    level?: number;
}