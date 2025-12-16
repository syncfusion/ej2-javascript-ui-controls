import { Workbook, Worksheet, Worksheets } from '@syncfusion/ej2-excel-export';
import { ExcelRow, ExcelCell, ExcelColumn, BeforeExportEventArgs, ExportCompleteEventArgs, ExcelImage, ExcelExportProperties } from '../../common/base/interface';
import * as events from '../../common/base/constant';
import { PivotView } from '../base/pivotview';
import { IAxisSet, PivotEngine } from '../../base/engine';
import { IPageSettings, IMatrix2D } from '../../base/engine';
import { OlapEngine } from '../../base/olap/engine';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { PivotExportUtil } from '../../base/export-util';
import { Column, ExcelFooter, ExcelHeader, ExcelHeaderQueryCellInfoEventArgs, ExcelQueryCellInfoEventArgs, ExcelStyle, ExcelTheme } from '@syncfusion/ej2-grids';
import { DataSourceSettingsModel } from '../../model/datasourcesettings-model';
import { ExcelExportHelper } from './excel-export-helper';

/**
 * @hidden
 * `ExcelExport` module is used to handle the Excel export action.
 */
export class ExcelExport {
    private parent: PivotView;
    private engine: PivotEngine | OlapEngine;
    private rows: ExcelRow[];
    private actualrCnt: number = 0;
    private theme: ExcelTheme;
    /** @hidden */
    public images: ExcelImage[] = [];
    private workSheet: Worksheets = [];
    private columns: ExcelColumn[];
    private isHeaderIncluded: boolean = false;
    private book: Workbook = {} as Workbook;
    private excelExportHelper: ExcelExportHelper;

    /**
     * Constructor for the PivotGrid Excel Export module.
     *
     * @param {PivotView} parent - Instance of pivot table.
     * @hidden
     */
    constructor(parent?: PivotView) {
        this.parent = parent;
        this.excelExportHelper = new ExcelExportHelper(this.parent);
        this.rows = [];
    }

    /**
     * For internal use only - Get the module name.
     *
     * @returns {string} - string.
     * @private
     */
    protected getModuleName(): string {
        return 'excelExport';
    }

    private addHeaderAndFooter(
        excelExportProperties?: ExcelHeader | ExcelFooter, stringValue?: string, type?: string, rowCount?: number
    ): void {
        if (!this.rows) {
            this.rows = [];
        }
        let cells: ExcelCell[] = [];
        if (!isNullOrUndefined(excelExportProperties.rows)) {
            this.actualrCnt = (type === 'footer') ? this.actualrCnt + rowCount - (excelExportProperties.rows[0].cells.length) : this.actualrCnt;
            const row: ExcelRow[] = excelExportProperties.rows;
            for (let i: number = 0; i < row.length; i++) {
                let spanCount: number = 0;
                cells = [];
                const currentRow: ExcelRow = row[i as number];
                for (let j: number = 0; j < currentRow.cells.length; j++) {
                    const cell: ExcelCell = {
                        index: spanCount + 1, value: currentRow.cells[j as number].value,
                        colSpan: currentRow.cells[j as number].colSpan, rowSpan: currentRow.cells[j as number].rowSpan,
                        style: !isNullOrUndefined(this.theme) && !isNullOrUndefined(this.theme.caption) ?
                            this.excelExportHelper.getCaptionThemeStyle(this.theme, currentRow.cells[j as number].style) as ExcelStyle
                            : currentRow.cells[j as number].style
                    };
                    if ((currentRow.cells[j as number] as ExcelCell).hyperlink) {
                        cell.hyperlink = { target: (currentRow.cells[j as number] as ExcelCell).hyperlink.target};
                        cell.value = currentRow.cells[j as number].value ? currentRow.cells[j as number].value :
                            (currentRow.cells[j as number] as ExcelCell).hyperlink.displayText;
                    }
                    cells.push(cell);
                    spanCount = spanCount + cells[j as number].colSpan;
                }
                this.actualrCnt++;
                this.rows.push({ index: this.actualrCnt, cells: cells });
            }
            this.actualrCnt = (type === 'header') ? rowCount : this.actualrCnt;
        }
        else {
            if (stringValue !== '') {
                if (type === 'footer') {
                    this.actualrCnt++;
                }
                cells.push({
                    index: 1, value: stringValue
                });
                this.rows.push({ index: this.actualrCnt + 1, cells: cells });
                this.actualrCnt = (type === 'header') ? this.actualrCnt + 2 : this.actualrCnt;
            }
        }
    }

    /**
     *
     * Method to perform excel export.
     *
     * @hidden
     */

    public exportToExcel(type: string, exportProperties?: ExcelExportProperties, isBlob?: boolean, workBook?: Workbook,
                         isMultipleExport?: boolean, currentPivotInstance?: PivotView): Promise<Workbook> {
        return new Promise((resolve: Function, reject: Function) => {
            try {
                this.actualrCnt = 0;
                let expType: string = 'AppendToSheet';
                let blankRows: number = 5;
                if (!isNullOrUndefined(exportProperties) && !isNullOrUndefined(exportProperties.multipleExport)) {
                    expType = (!isNullOrUndefined(exportProperties.multipleExport.type) ? exportProperties.multipleExport.type : 'AppendToSheet');
                    if (!isNullOrUndefined(exportProperties.multipleExport.blankRows)) {
                        blankRows = exportProperties.multipleExport.blankRows;
                    }
                }
                if (isNullOrUndefined(workBook)) {
                    this.workSheet = [];
                    this.rows = [];
                    this.columns = [];
                    this.images = [];
                } else if (expType === 'NewSheet') {
                    this.rows = [];
                    this.columns = [];
                    this.images = [];
                } else {
                    this.workSheet = [];
                    this.rows = workBook['worksheets'][0].rows;
                    this.columns = workBook['worksheets'][0].columns;
                    this.images = workBook['worksheets'][0].images;
                    this.actualrCnt = (this.rows[this.rows.length - 1].index + (blankRows - 1));
                    this.actualrCnt++;
                }
                this.parent = currentPivotInstance ? currentPivotInstance : this.parent;
                const isHeaderDefined: boolean = !isNullOrUndefined(exportProperties) && !isNullOrUndefined(exportProperties.header);
                const isFooterDefined: boolean = !isNullOrUndefined(exportProperties) && !isNullOrUndefined(exportProperties.footer);
                const isFileNameDefined: boolean = !isNullOrUndefined(exportProperties) && !isNullOrUndefined(exportProperties.fileName);
                this.engine = this.parent.dataType === 'olap' ? this.parent.olapEngineModule : this.parent.engineModule;
                this.theme = !isNullOrUndefined(exportProperties) ? exportProperties.theme : undefined;
                /** Event trigerring */
                let clonedValues: IAxisSet[][];
                const currentPivotValues: IAxisSet[][] = PivotExportUtil.getClonedPivotValues(this.engine.pivotValues) as IAxisSet[][];
                const customFileName: string = isFileNameDefined ? exportProperties.fileName : type === 'CSV' ? 'default.csv' : 'default.xlsx';
                if (this.parent.exportAllPages && (this.parent.enableVirtualization || this.parent.enablePaging)) {
                    const pageSettings: IPageSettings = this.engine.pageSettings;
                    let mdxQuery: string;
                    (this.engine as PivotEngine).isPagingOrVirtualizationEnabled = false;
                    if (this.parent.dataType === 'olap') {
                        this.updateOlapPageSettings(true);
                        mdxQuery = this.parent.olapEngineModule.mdxQuery.slice(0);
                    } else {
                        this.engine.pageSettings = null;
                    }
                    const dataSourceSettings: DataSourceSettingsModel = !isNullOrUndefined(currentPivotInstance) ?
                        currentPivotInstance.dataSourceSettings : this.parent.dataSourceSettings;
                    (this.engine as PivotEngine).generateGridData(dataSourceSettings, true, true);
                    this.parent.applyFormatting(this.engine.pivotValues, dataSourceSettings);
                    clonedValues = PivotExportUtil.getClonedPivotValues(this.engine.pivotValues) as IAxisSet[][];
                    this.engine.pivotValues = currentPivotValues;
                    this.engine.pageSettings = pageSettings;
                    (this.engine as PivotEngine).isPagingOrVirtualizationEnabled = true;
                    if (this.parent.dataType === 'olap') {
                        this.updateOlapPageSettings(false);
                        this.parent.olapEngineModule.mdxQuery = mdxQuery;
                    }
                } else {
                    clonedValues = currentPivotValues;
                }
                const args: BeforeExportEventArgs = {
                    fileName: customFileName, header: '', footer: '', dataCollections: [clonedValues] as IAxisSet[][], excelExportProperties: exportProperties
                };
                let fileName: string; let header: string;
                let footer: string; let dataCollections: IAxisSet[][];
                this.parent.trigger(events.beforeExport, args, (observedArgs: BeforeExportEventArgs) => {
                    fileName = observedArgs.fileName; header = observedArgs.header;
                    footer = observedArgs.footer; dataCollections = observedArgs.dataCollections;
                });
                if ((!this.isHeaderIncluded && expType === 'AppendToSheet') || (expType === 'NewSheet')) {
                    if (!isHeaderDefined && isNullOrUndefined(args.excelExportProperties) && header !== '') {
                        this.addHeaderAndFooter({}, header, 'header', undefined);
                    }
                    else if (!isNullOrUndefined(args.excelExportProperties) && !isNullOrUndefined(args.excelExportProperties.header)) {
                        this.addHeaderAndFooter(args.excelExportProperties.header, '', 'header',
                                                args.excelExportProperties.header.headerRows);
                    }
                    this.isHeaderIncluded = true;
                }
                const includeHiddenColumn: boolean = args.excelExportProperties && args.excelExportProperties.includeHiddenColumn ?
                    args.excelExportProperties.includeHiddenColumn : false;
                const col: Column[] = currentPivotInstance ? currentPivotInstance.grid.getColumns() : this.parent.grid.getColumns();
                const hiddenColumnsIndex: number[] = [];
                if (!includeHiddenColumn) {
                    for (let column: number = 0; column < col.length; column++) {
                        if (!col[column as number].visible) {
                            hiddenColumnsIndex.push(column as number);
                        }
                    }
                }
                let columnCount: number = 0;
                let rowHeight: number = 0;
                for (let dataColl: number = 0; dataColl < dataCollections.length; dataColl++) {
                    const pivotValues: IAxisSet[][] = dataCollections[dataColl as number] as IAxisSet[][]; let colLen: number = 0;
                    const rowLen: number = pivotValues.length;
                    const formatList: { [key: string]: string } = currentPivotInstance ? currentPivotInstance.renderModule.formatList
                        : this.parent.renderModule.formatList;
                    let maxLevel: number = 0;
                    for (let colCount: number = 0; colCount < pivotValues[0 as number].length; colCount++) {
                        if (pivotValues[0 as number][colCount as number] !== null &&
                            pivotValues[0 as number][colCount as number] !== undefined) {
                            columnCount++;
                        }
                    }
                    for (let rCnt: number = 0; rCnt < rowLen; rCnt++) {
                        if (pivotValues[rCnt as number]) {
                            this.actualrCnt++;
                            if (!includeHiddenColumn) {
                                for (const colIndex of hiddenColumnsIndex) {
                                    pivotValues[rCnt as number].splice(colIndex, 1);
                                }
                            }
                            colLen = pivotValues[rCnt as number].length; const cells: ExcelCell[] = [];
                            for (let cCnt: number = 0; cCnt < colLen; cCnt++) {
                                if (pivotValues[rCnt as number][cCnt as number]) {
                                    const pivotCell: IAxisSet = (pivotValues[rCnt as number][cCnt as number] as IAxisSet);
                                    const field: string = (this.parent.dataSourceSettings.valueAxis === 'row' &&
                                        this.parent.dataType === 'olap' && pivotCell.rowOrdinal &&
                                        (this.engine as OlapEngine).tupRowInfo[pivotCell.rowOrdinal]) ?
                                        (this.engine as OlapEngine).tupRowInfo[pivotCell.rowOrdinal].measureName :
                                        pivotCell.actualText as string;
                                    const styles: ExcelStyle = (pivotCell.axis === 'row') ? { hAlign: 'Left', bold: true, wrapText: true } : { numberFormat: formatList[field as string], bold: false, wrapText: true };
                                    const headerStyle: ExcelStyle = { bold: true, vAlign: 'Center', wrapText: true, indent: cCnt === 0 ? pivotCell.level * 10 : 0 };
                                    if (!(pivotCell.level === -1 && !pivotCell.rowSpan)) {
                                        const aggMatrix: IMatrix2D = this.engine.aggregatedValueMatrix;
                                        let cellValue: string | number = pivotCell.axis === 'value' ? ((aggMatrix[rCnt as number] && aggMatrix[rCnt as number][cCnt as number]) ? aggMatrix[rCnt as number][cCnt as number] : (pivotCell.formattedText === '#DIV/0!' ? pivotCell.formattedText : pivotCell.value)) : pivotCell.formattedText;
                                        const isgetValuesHeader: boolean = ((this.parent.dataSourceSettings.rows.length === 0 && this.parent.dataSourceSettings.valueAxis === 'row')
                                            || (this.parent.dataSourceSettings.columns.length === 0 && this.parent.dataSourceSettings.valueAxis === 'column'));
                                        if (pivotCell.type === 'grand sum' && !(this.parent.dataSourceSettings.values.length === 1 && this.parent.dataSourceSettings.valueAxis === 'row' && pivotCell.axis === 'column')) {
                                            cellValue = isgetValuesHeader ? this.parent.getValuesHeader(pivotCell, 'grandTotal') : this.parent.localeObj.getConstant('grandTotal');
                                        } else if (pivotCell.type === 'sum') {
                                            cellValue = cellValue.toString().replace('Total', this.parent.localeObj.getConstant('total'));
                                        } else {
                                            cellValue = (!isNullOrUndefined(pivotCell.valueSort) && (this.parent.localeObj.getConstant('grandTotal') + this.parent.dataSourceSettings.valueSortSettings.headerDelimiter + pivotCell.formattedText
                                                === pivotCell.valueSort.levelName) && isgetValuesHeader) ? this.parent.getValuesHeader(pivotCell, 'value') : cellValue;
                                        }
                                        if (!(pivotCell.level === -1 && !pivotCell.rowSpan) && pivotCell.rowSpan !== 0) {
                                            cells.push({
                                                index: cCnt + 1, value: cellValue,
                                                colSpan: pivotCell.colSpan, rowSpan: (pivotCell.rowSpan === -1 ? 1 : pivotCell.rowSpan)
                                            });
                                            const lastCell: ExcelCell = cells[cells.length - 1];
                                            if (pivotCell.axis === 'value') {
                                                if (isNaN(pivotCell.value) || pivotCell.formattedText === '' ||
                                                    pivotCell.formattedText === undefined || isNullOrUndefined(pivotCell.value)) {
                                                    lastCell.value = type === 'Excel' ? null : '';
                                                }
                                                styles.numberFormat = typeof cellValue === 'string' ? undefined : styles.numberFormat;
                                                lastCell.style = styles;
                                            } else {
                                                lastCell.style = headerStyle;
                                                if (pivotCell.axis === 'row' &&
                                                    (this.parent.isTabular ? cCnt < this.parent.engineModule.rowMaxLevel + 1 :
                                                        cCnt === 0)) {
                                                    lastCell.style = styles;
                                                    if (this.parent.dataType === 'olap') {
                                                        const indent: number = this.parent.renderModule.indentCollection[rCnt as number];
                                                        lastCell.style.indent = indent * 2;
                                                        maxLevel = maxLevel > indent ? maxLevel : indent;
                                                    } else {
                                                        const levelName: string = pivotCell.valueSort ? pivotCell.valueSort.levelName.toString() : '';
                                                        const delimiter: string =
                                                            this.parent.dataSourceSettings.valueSortSettings.headerDelimiter;
                                                        const memberPos: number = pivotCell.actualText ?
                                                            pivotCell.actualText.toString().split(delimiter).length : 0;
                                                        const levelPosition: number = levelName.split(delimiter).length -
                                                            (memberPos ? memberPos - 1 : memberPos);
                                                        const level: number = levelPosition ? (levelPosition - 1) : 0;
                                                        lastCell.style.indent = level * 2;
                                                        maxLevel = level > maxLevel ? level : maxLevel;
                                                    }
                                                }
                                            }
                                            if (pivotCell.style || lastCell.style.backColor || lastCell.style.fontColor ||
                                                lastCell.style.fontName || lastCell.style.fontSize) {
                                                lastCell.style.backColor = lastCell.style.backColor ? lastCell.style.backColor
                                                    : pivotCell.style.backgroundColor;
                                                lastCell.style.fontColor = lastCell.style.fontColor ? lastCell.style.fontColor
                                                    : pivotCell.style.color;
                                                lastCell.style.fontName = lastCell.style.fontName ? lastCell.style.fontName
                                                    : pivotCell.style.fontFamily;
                                                if (!isNullOrUndefined(lastCell.style.fontSize) ||
                                                    !isNullOrUndefined(pivotCell.style.fontSize)) {
                                                    lastCell.style.fontSize = !isNullOrUndefined(lastCell.style.fontSize) ?
                                                        Number(lastCell.style.fontSize) : Number(pivotCell.style.fontSize.split('px')[0]);
                                                }
                                            }
                                            lastCell.style.borders = { color: '#000000', lineStyle: 'thin' };
                                            let excelHeaderQueryCellInfoArgs: ExcelHeaderQueryCellInfoEventArgs;
                                            let excelQueryCellInfoArgs: ExcelQueryCellInfoEventArgs;
                                            if (pivotCell.axis === 'column') {
                                                excelHeaderQueryCellInfoArgs = {
                                                    style: !isNullOrUndefined(this.theme) && !isNullOrUndefined(this.theme.header) ?
                                                        this.excelExportHelper.getHeaderThemeStyle(this.theme, headerStyle) as ExcelStyle
                                                        : headerStyle,
                                                    cell: pivotCell
                                                };
                                                this.parent.trigger(events.excelHeaderQueryCellInfo, excelHeaderQueryCellInfoArgs);
                                            }
                                            else {
                                                excelQueryCellInfoArgs = {
                                                    style: !isNullOrUndefined(this.theme) && !isNullOrUndefined(this.theme.record) ?
                                                        this.excelExportHelper.getRecordThemeStyle(this.theme, styles) as ExcelStyle
                                                        : styles,
                                                    cell: pivotCell,
                                                    column: undefined,
                                                    data: pivotValues,
                                                    value: cellValue,
                                                    colSpan: 1
                                                };
                                                this.parent.trigger(events.excelQueryCellInfo, excelQueryCellInfoArgs);
                                            }
                                            lastCell.value = (pivotCell.axis === 'column') ?
                                                (excelHeaderQueryCellInfoArgs.cell as IAxisSet).formattedText :
                                                excelQueryCellInfoArgs.value;
                                            lastCell.style = (pivotCell.axis === 'column') ? excelHeaderQueryCellInfoArgs.style
                                                : excelQueryCellInfoArgs.style;
                                            if ((excelHeaderQueryCellInfoArgs && excelHeaderQueryCellInfoArgs.image) ||
                                                (excelQueryCellInfoArgs && excelQueryCellInfoArgs.image)) {
                                                rowHeight = this.excelExportHelper.setImage((pivotCell.axis === 'column') ?
                                                    excelHeaderQueryCellInfoArgs : excelQueryCellInfoArgs, cCnt, this.actualrCnt,
                                                                                            rowHeight);
                                            }
                                            if (!isNullOrUndefined(excelHeaderQueryCellInfoArgs) &&
                                                !isNullOrUndefined(excelHeaderQueryCellInfoArgs.hyperLink)) {
                                                lastCell.hyperlink = { target: excelHeaderQueryCellInfoArgs.hyperLink.target };
                                                lastCell.value = excelHeaderQueryCellInfoArgs.hyperLink.displayText || lastCell.value;
                                            } else if (!isNullOrUndefined(excelQueryCellInfoArgs) &&
                                                !isNullOrUndefined(excelQueryCellInfoArgs.hyperLink)) {
                                                lastCell.hyperlink = { target: excelQueryCellInfoArgs.hyperLink.target };
                                                lastCell.value = excelQueryCellInfoArgs.hyperLink.displayText || lastCell.value;
                                            }
                                            if (pivotCell.axis === 'column') {
                                                lastCell.colSpan = (excelHeaderQueryCellInfoArgs.cell as ExcelCell).colSpan;
                                                lastCell.rowSpan = (excelHeaderQueryCellInfoArgs.cell as ExcelCell).rowSpan;
                                            } else {
                                                lastCell.colSpan = excelQueryCellInfoArgs.colSpan > 1 ? excelQueryCellInfoArgs.colSpan :
                                                    (excelQueryCellInfoArgs.cell as ExcelCell).colSpan;
                                                lastCell.rowSpan = (excelQueryCellInfoArgs.cell as ExcelCell).rowSpan;
                                            }
                                        }
                                    }

                                    cCnt = cCnt + (pivotCell.colSpan ? (pivotCell.colSpan - 1) : 0);
                                } else {
                                    const pivotCell: IAxisSet = { formattedText: '', colSpan: 1, rowSpan: 1 };
                                    if (rCnt === 0 && cCnt === 0) {
                                        if (!includeHiddenColumn) {
                                            pivotCell.colSpan = pivotValues[0].length - (columnCount - hiddenColumnsIndex.length);
                                            pivotCell.rowSpan = Object.keys(pivotValues).length - this.engine.rowCount;
                                        }
                                        else {
                                            pivotCell.colSpan = pivotValues[0].length - this.engine.columnCount;
                                            pivotCell.rowSpan = Object.keys(pivotValues).length - this.engine.rowCount;
                                        }
                                    }
                                    let excelHeaderQueryCellInfoArgs: ExcelHeaderQueryCellInfoEventArgs;
                                    if (pivotCell) {
                                        excelHeaderQueryCellInfoArgs = {
                                            style: { borders: { color: '#000000', lineStyle: 'thin' } },
                                            cell: pivotCell
                                        };
                                        this.parent.trigger(events.excelHeaderQueryCellInfo, excelHeaderQueryCellInfoArgs);
                                    }
                                    const cell: { [key: string]: string | number | object }
                                        = excelHeaderQueryCellInfoArgs.cell as { [key: string]: string | number };
                                    cells.push({
                                        index: cCnt + 1, colSpan: cell['colSpan'] as number, rowSpan: cell['rowSpan'] as number,
                                        value: pivotCell.formattedText, style: excelHeaderQueryCellInfoArgs.style
                                    });
                                    if (excelHeaderQueryCellInfoArgs.image) {
                                        rowHeight =
                                            this.excelExportHelper.setImage(excelHeaderQueryCellInfoArgs, cCnt, this.actualrCnt, rowHeight);
                                    }
                                    if (!isNullOrUndefined(excelHeaderQueryCellInfoArgs) &&
                                        !isNullOrUndefined(excelHeaderQueryCellInfoArgs.hyperLink)) {
                                        cell.hyperlink = { target: excelHeaderQueryCellInfoArgs.hyperLink.target };
                                        cell.value = excelHeaderQueryCellInfoArgs.hyperLink.displayText || cell.value;
                                    }
                                }
                            }
                            const row: ExcelRow = { index: this.actualrCnt, cells: cells };
                            if (rowHeight > 0) {
                                row.height = rowHeight;
                                rowHeight = 0;
                            }
                            this.rows.push(row);
                        }
                    }
                    if ((!isMultipleExport && expType === 'AppendToSheet') || expType === 'NewSheet') {
                        if (isFooterDefined) {
                            this.addHeaderAndFooter(exportProperties.footer, '', 'footer', exportProperties.footer.footerRows);
                        }
                        else if (!isFooterDefined && footer !== '' && isNullOrUndefined(args.excelExportProperties)) {
                            this.addHeaderAndFooter({}, footer, 'footer', undefined);
                        }
                        else if (!isNullOrUndefined(args.excelExportProperties) && !isNullOrUndefined(args.excelExportProperties.footer)) {
                            this.addHeaderAndFooter(args.excelExportProperties.footer, '', 'footer', args.excelExportProperties.footer.footerRows);
                        }
                    }
                    if (this.columns.length < col.length) {
                        this.columns = [];
                        for (let cCnt: number = 0; cCnt < colLen; cCnt++) {
                            this.columns.push({ index: cCnt + 1, width: col[cCnt as number].width as number });
                        }
                    }
                    if (maxLevel > 0) {
                        this.columns[0].width = 100 + (maxLevel * 20);
                    }
                    const sheet: Worksheet = { columns: this.columns, rows: this.rows, images: this.images } as Worksheet;
                    this.workSheet.push(sheet);
                    this.book['worksheets'] = this.workSheet;
                }
                let blobData: Promise<{ blobData: Blob; }>;
                if (!isMultipleExport) {
                    const book: Workbook = new Workbook(this.book, type === 'Excel' ? 'xlsx' : 'csv', undefined, this.parent.currencyCode);
                    const fileExtension: string = fileName.split('.').pop();
                    if (!isBlob) {
                        book.save(fileExtension === 'xlsx' || fileExtension === 'csv' ? fileName : (
                            fileName + (type === 'Excel' ? '.xlsx' : '.csv')
                        ));
                    }
                    else {
                        blobData = book.saveAsBlob(fileExtension === 'xlsx' || type === 'Excel' ?
                            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' : 'text/csv');
                    }
                    const exportCompleteEventArgs: ExportCompleteEventArgs = {
                        type: type,
                        promise: isBlob ? blobData : null
                    };
                    this.parent.trigger(events.exportComplete, exportCompleteEventArgs);
                    this.isHeaderIncluded = false;
                }
                resolve(this.book);
            } catch (error) {
                reject(error);
            }
        });
    }

    private updateOlapPageSettings(isUpdate: boolean): void {
        this.parent.olapEngineModule.isExporting = isUpdate ? true : false;
        if (!this.parent.exportSpecifiedPages) {
            this.parent.olapEngineModule.pageSettings = isUpdate ? null : this.parent.olapEngineModule.pageSettings;
            this.parent.olapEngineModule.isPaging = isUpdate ? false : true;
        } else {
            this.parent.olapEngineModule.exportSpeciedPages = this.parent.exportSpecifiedPages = isUpdate ?
                this.parent.exportSpecifiedPages : undefined;
        }
    }

    /**
     * To destroy the excel export module
     *
     * @returns {void}
     * @hidden
     */

    public destroy(): void {
        this.rows = [];
        this.actualrCnt = 0;
        if (this.engine) {
            this.engine = null;
        }
        if (this.rows) {
            this.rows = null;
        }
    }
}
