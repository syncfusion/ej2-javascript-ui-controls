import { Workbook } from '@syncfusion/ej2-excel-export';
import { ExcelRow, ExcelCell, ExcelColumn, BeforeExportEventArgs, ExportCompleteEventArgs } from '../../common/base/interface';
import * as events from '../../common/base/constant';
import { PivotView } from '../base/pivotview';
import { IAxisSet, IPivotValues, PivotEngine } from '../../base/engine';
import { IPageSettings, IMatrix2D } from '../../base/engine';
import { OlapEngine } from '../../base/olap/engine';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { PivotExportUtil } from '../../base/export-util';
import { ExcelExportProperties, ExcelFooter, ExcelHeader, ExcelHeaderQueryCellInfoEventArgs, ExcelQueryCellInfoEventArgs, ExcelStyle } from '@syncfusion/ej2-grids';

/**
 * @hidden
 * `ExcelExport` module is used to handle the Excel export action.
 */
export class ExcelExport {
    private parent: PivotView;
    private engine: PivotEngine | OlapEngine;
    private rows: ExcelRow[];
    private actualrCnt: number = 0;
    private blobData: Promise<{ blobData: Blob; }>;
    private book: Workbook;

    /**
     * Constructor for the PivotGrid Excel Export module.
     *
     * @param {PivotView} parent - Instance of pivot table.
     * @hidden
     */
    constructor(parent?: PivotView) {
        this.parent = parent;
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

    private addHeaderAndFooter(excelExportProperties?: ExcelHeader | ExcelFooter, stringValue?: string, type?: string, rowCount?: number)
        : void {
        let cells: ExcelCell[] = [];
        if (!isNullOrUndefined(excelExportProperties.rows)) {
            this.actualrCnt = (type === 'footer') ? this.actualrCnt + rowCount - (excelExportProperties.rows[0].cells.length) : this.actualrCnt;
            const row: ExcelRow[] = excelExportProperties.rows;
            for (let i: number = 0; i < row.length; i++) {
                for (let j: number = 0; j < row[i as number].cells.length; j++) {
                    cells = [];
                    cells.push({
                        index: i + 1, value: row[i as number].cells[j as number].value,
                        colSpan: row[i as number].cells[j as number].colSpan, rowSpan: row[i as number].cells[j as number].rowSpan,
                        style: row[i as number].cells[j as number].style
                    });
                    this.actualrCnt++;
                    this.rows.push({ index: this.actualrCnt, cells: cells });
                }
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

    public exportToExcel(type: string, exportProperties?: ExcelExportProperties, isBlob?: boolean): void {
        this.rows = []; this.actualrCnt = 0;
        const isHeaderSet: boolean = !isNullOrUndefined(exportProperties) && !isNullOrUndefined(exportProperties.header);
        const isFooterSet: boolean = !isNullOrUndefined(exportProperties) && !isNullOrUndefined(exportProperties.footer);
        const isFileNameSet: boolean = !isNullOrUndefined(exportProperties) && !isNullOrUndefined(exportProperties.fileName);
        this.engine = this.parent.dataType === 'olap' ? this.parent.olapEngineModule : this.parent.engineModule;
        /** Event trigerring */
        let clonedValues: IPivotValues;
        const currentPivotValues: IPivotValues = PivotExportUtil.getClonedPivotValues(this.engine.pivotValues);
        const customFileName: string = isFileNameSet ? exportProperties.fileName : 'default.xlsx';
        if (this.parent.exportAllPages && (this.parent.enableVirtualization || this.parent.enablePaging) && this.parent.dataType !== 'olap') {
            const pageSettings: IPageSettings = this.engine.pageSettings; this.engine.pageSettings = null;
            (this.engine as PivotEngine).isPagingOrVirtualizationEnabled = false;
            (this.engine as PivotEngine).generateGridData(this.parent.dataSourceSettings, true);
            this.parent.applyFormatting(this.engine.pivotValues);
            clonedValues = PivotExportUtil.getClonedPivotValues(this.engine.pivotValues);
            this.engine.pivotValues = currentPivotValues;
            this.engine.pageSettings = pageSettings;
            (this.engine as PivotEngine).isPagingOrVirtualizationEnabled = true;
        } else {
            clonedValues = currentPivotValues;
        }
        const args: BeforeExportEventArgs = {
            fileName: customFileName, header: '', footer: '', dataCollections: [clonedValues], excelExportProperties: exportProperties
        };
        let fileName: string; let header: string;
        let footer: string; let dataCollections: IPivotValues[];
        this.parent.trigger(events.beforeExport, args, (observedArgs: BeforeExportEventArgs) => {
            fileName = observedArgs.fileName; header = observedArgs.header;
            footer = observedArgs.footer; dataCollections = observedArgs.dataCollections;
        });
        if (!isHeaderSet && isNullOrUndefined(args.excelExportProperties) && header !== '') {
            this.addHeaderAndFooter({}, header, 'header', undefined);
        }
        else if (!isNullOrUndefined(args.excelExportProperties) && !isNullOrUndefined(args.excelExportProperties.header)) {
            this.addHeaderAndFooter(args.excelExportProperties.header, '', 'header', args.excelExportProperties.header.headerRows);
        }
        /** Fill data and export */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const workSheets: any = [];
        for (let dataColl: number = 0; dataColl < dataCollections.length; dataColl++) {
            const pivotValues: IPivotValues = dataCollections[dataColl as number]; let colLen: number = 0;
            const rowLen: number = pivotValues.length;
            const formatList: { [key: string]: string } = this.parent.renderModule.getFormatList();
            let maxLevel: number = 0;
            for (let rCnt: number = 0; rCnt < rowLen; rCnt++) {
                if (pivotValues[rCnt as number]) {
                    this.actualrCnt++; colLen = pivotValues[rCnt as number].length; const cells: ExcelCell[] = [];
                    for (let cCnt: number = 0; cCnt < colLen; cCnt++) {
                        if (pivotValues[rCnt as number][cCnt as number]) {
                            const pivotCell: IAxisSet = (pivotValues[rCnt as number][cCnt as number] as IAxisSet);
                            if (pivotCell && pivotCell.axis === 'value' && pivotCell.formattedText === '') {
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                pivotCell.value = pivotCell.formattedText as any;
                            }
                            const field: string = (this.parent.dataSourceSettings.valueAxis === 'row' &&
                                this.parent.dataType === 'olap' && pivotCell.rowOrdinal &&
                                (this.engine as OlapEngine).tupRowInfo[pivotCell.rowOrdinal]) ?
                                (this.engine as OlapEngine).tupRowInfo[pivotCell.rowOrdinal].measureName :
                                pivotCell.actualText as string;
                            const styles: ExcelStyle = (pivotCell.axis === 'row') ? { hAlign: 'Left', bold: true, wrapText: true } : { numberFormat: formatList[field as string], bold: false, wrapText: true };
                            const headerStyle: ExcelStyle = { bold: true, vAlign: 'Center', wrapText: true, indent: cCnt === 0 ? pivotCell.level * 10 : 0 };
                            if (!(pivotCell.level === -1 && !pivotCell.rowSpan)) {
                                const aggMatrix: IMatrix2D = this.parent.engineModule.aggregatedValueMatrix;
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
                                if (!(pivotCell.level === -1 && !pivotCell.rowSpan)) {
                                    cells.push({
                                        index: cCnt + 1, value: cellValue,
                                        colSpan: pivotCell.colSpan, rowSpan: (pivotCell.rowSpan === -1 ? 1 : pivotCell.rowSpan)
                                    });
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    const lastCell: any = cells[cells.length - 1];
                                    if (pivotCell.axis === 'value') {
                                        if (isNaN(pivotCell.value) || pivotCell.formattedText === '' ||
                                            pivotCell.formattedText === undefined || isNullOrUndefined(pivotCell.value)) {
                                            lastCell.value = type === 'Excel' ? null : '';
                                        }
                                        styles.numberFormat = typeof cellValue === 'string' ? undefined : styles.numberFormat;
                                        lastCell.style = !isNullOrUndefined(lastCell.value) ? styles : { bold: false, wrapText: true };
                                    } else {
                                        lastCell.style = headerStyle;
                                        if (pivotCell.axis === 'row' && cCnt === 0) {
                                            lastCell.style = styles;
                                            if (this.parent.dataType === 'olap') {
                                                const indent: number = this.parent.renderModule.indentCollection[rCnt as number];
                                                lastCell.style.indent = indent * 2;
                                                maxLevel = maxLevel > indent ? maxLevel : indent;
                                            } else {
                                                const levelName: string = pivotCell.valueSort ? pivotCell.valueSort.levelName.toString() : '';
                                                const memberPos: number = pivotCell.actualText ?
                                                    pivotCell.actualText.toString().
                                                        split(this.parent.dataSourceSettings.valueSortSettings.headerDelimiter).length : 0;
                                                const levelPosition: number = levelName.
                                                    split(this.parent.dataSourceSettings.valueSortSettings.headerDelimiter).length -
                                                    (memberPos ? memberPos - 1 : memberPos);
                                                const level: number = levelPosition ? (levelPosition - 1) : 0;
                                                lastCell.style.indent = level * 2;
                                                maxLevel = level > maxLevel ? level : maxLevel;
                                            }
                                        }
                                    }
                                    if (pivotCell.style || lastCell.style.backColor || lastCell.style.backgroundColor ||
                                        lastCell.style.fontColor || lastCell.style.fontName || lastCell.style.fontSize) {
                                        lastCell.style.backColor = lastCell.style.backgroundColor ? lastCell.style.backgroundColor
                                            : pivotCell.style.backgroundColor;
                                        lastCell.style.fontColor = lastCell.style.fontColor ? lastCell.style.fontColor
                                            : pivotCell.style.color;
                                        lastCell.style.fontName = lastCell.style.fontName ? lastCell.style.fontName
                                            : pivotCell.style.fontFamily;
                                        lastCell.style.fontSize = lastCell.style.fontSize ? Number(lastCell.style.fontSize) : Number(pivotCell.style.fontSize.split('px')[0]);
                                    }
                                    lastCell.style.borders = { color: '#000000', lineStyle: 'Thin' };
                                    let excelHeaderQueryCellInfoArgs: ExcelHeaderQueryCellInfoEventArgs;
                                    let excelQueryCellInfoArgs: ExcelQueryCellInfoEventArgs;
                                    if (pivotCell.axis === 'column') {
                                        excelHeaderQueryCellInfoArgs = {
                                            style: headerStyle,
                                            cell: pivotCell
                                        };
                                        this.parent.trigger(events.excelHeaderQueryCellInfo, excelHeaderQueryCellInfoArgs);
                                    }
                                    else {
                                        excelQueryCellInfoArgs = {
                                            style: styles,
                                            cell: pivotCell,
                                            column: undefined,
                                            data: pivotValues,
                                            value: cellValue
                                        };
                                        this.parent.trigger(events.excelQueryCellInfo, excelQueryCellInfoArgs);
                                    }
                                    lastCell.value = (pivotCell.axis === 'column') ? (excelHeaderQueryCellInfoArgs.cell as IAxisSet).formattedText : excelQueryCellInfoArgs.value;
                                    lastCell.style = (pivotCell.axis === 'column') ? excelHeaderQueryCellInfoArgs.style : excelQueryCellInfoArgs.style;
                                }
                            }
                            cCnt = cCnt + (pivotCell.colSpan ? (pivotCell.colSpan - 1) : 0);
                        } else {
                            const pivotCell: IAxisSet = { formattedText: '' };
                            let excelHeaderQueryCellInfoArgs: ExcelHeaderQueryCellInfoEventArgs;
                            if (pivotCell) {
                                excelHeaderQueryCellInfoArgs = {
                                    style: undefined,
                                    cell: pivotCell
                                };
                                this.parent.trigger(events.excelHeaderQueryCellInfo, excelHeaderQueryCellInfoArgs);
                            }
                            cells.push({
                                index: cCnt + 1, colSpan: 1, rowSpan: 1, value: pivotCell.formattedText,
                                style: excelHeaderQueryCellInfoArgs.style
                            });
                        }
                    }
                    this.rows.push({ index: this.actualrCnt, cells: cells });
                }
            }
            if (isFooterSet) {
                this.addHeaderAndFooter(exportProperties.footer, '', 'footer', exportProperties.footer.footerRows);
            }
            else if (!isFooterSet && footer !== '' && isNullOrUndefined(args.excelExportProperties)) {
                this.addHeaderAndFooter({}, footer, 'footer', undefined);
            }
            else if (!isNullOrUndefined(args.excelExportProperties) && !isNullOrUndefined(args.excelExportProperties.footer)) {
                this.addHeaderAndFooter(args.excelExportProperties.footer, '', 'footer', args.excelExportProperties.footer.footerRows);
            }
            const columns: ExcelColumn[] = [];
            for (let cCnt: number = 0; cCnt < colLen; cCnt++) {
                columns.push({ index: cCnt + 1, width: 100 });
            }
            if (maxLevel > 0) {
                columns[0].width = 100 + (maxLevel * 20);
            }
            workSheets.push({ columns: columns, rows: this.rows });
        }
        this.book = new Workbook({ worksheets: workSheets }, type === 'Excel' ? 'xlsx' : 'csv', undefined, this.parent.currencyCode);
        const fileExtension: string = fileName.split('.').pop();
        if (!isBlob) {
            this.book.save(fileExtension === 'xlsx' || fileExtension === 'csv' ?
                fileName : (fileName + (type === 'Excel' ? '.xlsx' : '.csv')));
        }
        else {
            this.blobData = this.book.saveAsBlob(fileExtension === 'xlsx' || type === 'Excel' ?
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' : 'text/csv');
        }
        const exportCompleteEventArgs: ExportCompleteEventArgs = {
            type: type,
            promise: isBlob ? this.blobData : null
        };
        this.parent.trigger(events.exportComplete, exportCompleteEventArgs);
    }

    /**
     * To destroy the excel export module
     *
     * @returns {void}
     * @hidden
     */

    public destroy(): void {
        if (this.engine) {
            this.engine = null;
        }
        if (this.blobData) {
            this.blobData = null;
        }
        if (this.book) {
            this.book = null;
        }
    }
}
