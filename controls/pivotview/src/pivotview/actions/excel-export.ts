import { Workbook } from '@syncfusion/ej2-excel-export';
import { ExcelRow, ExcelCell, ExcelColumn, BeforeExportEventArgs } from '../../common/base/interface';
import * as events from '../../common/base/constant';
import { PivotView } from '../base/pivotview';
import { IAxisSet, IPivotValues, PivotEngine } from '../../base/engine';
import { IPageSettings } from '../../base/engine';
import { OlapEngine } from '../../base/olap/engine';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { PivotExportUtil } from '../../base/export-util';
import { ExcelExportProperties, ExcelFooter, ExcelHeader } from '@syncfusion/ej2-grids';

/**
 * @hidden
 * `ExcelExport` module is used to handle the Excel export action.
 */
export class ExcelExport {
    private parent: PivotView;
    private engine: PivotEngine | OlapEngine;
    private rows: ExcelRow[];
    private actualrCnt: number = 0;

    /**
     * Constructor for the PivotGrid Excel Export module.
     * @param {PivotView} parent - Instance of pivot table.
     * @hidden
     */
    constructor(parent?: PivotView) {   /* eslint-disable-line */
        this.parent = parent;
    }

    /**
     * For internal use only - Get the module name.
     * @returns {string} - string.
     * @private
     */
    protected getModuleName(): string {
        return 'excelExport';
    }

    private addHeaderAndFooter(excelExportProperties?: ExcelHeader | ExcelFooter, stringValue?: string, type?: string, rowCount?: number): void {
        let cells: ExcelCell[] = [];
        if (!isNullOrUndefined(excelExportProperties.rows)) {
            this.actualrCnt = (type === 'footer') ? this.actualrCnt + rowCount - (excelExportProperties.rows[0].cells.length) : this.actualrCnt;
            let row: ExcelRow[] = excelExportProperties.rows;
            for (let i: number = 0; i < row.length; i++) {
                for (let j: number = 0; j < row[i].cells.length; j++) {
                    cells = [];
                    cells.push({
                        index: i + 1, value: row[i].cells[j].value,
                        colSpan: row[i].cells[j].colSpan, rowSpan: row[i].cells[j].rowSpan, style: row[i].cells[j].style
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
                    index: 1, value: stringValue,
                });
                this.rows.push({ index: this.actualrCnt + 1, cells: cells });
                this.actualrCnt = (type === 'header') ? this.actualrCnt + 2 : this.actualrCnt;
            }
        }
    }

    /* eslint-disable */
    /**
     * Method to perform excel export.
     * @hidden
     */
    public exportToExcel(type: string, exportProperties?: ExcelExportProperties): void {
        this.rows = []; this.actualrCnt = 0;
        let isHeaderSet: boolean = !isNullOrUndefined(exportProperties) && !isNullOrUndefined(exportProperties.header);
        let isFooterSet: boolean = !isNullOrUndefined(exportProperties) && !isNullOrUndefined(exportProperties.footer);
        let isFileNameSet: boolean = !isNullOrUndefined(exportProperties) && !isNullOrUndefined(exportProperties.fileName);
        this.engine = this.parent.dataType === 'olap' ? this.parent.olapEngineModule : this.parent.engineModule;
        /** Event trigerring */
        let clonedValues: IPivotValues;
        let currentPivotValues: IPivotValues = PivotExportUtil.getClonedPivotValues(this.engine.pivotValues);
        let customFileName: string = isFileNameSet ? exportProperties.fileName : 'default.xlsx';
        if (isHeaderSet) {
            this.addHeaderAndFooter(exportProperties.header, '', 'header', exportProperties.header.headerRows);
        }
        if (this.parent.exportAllPages && this.parent.enableVirtualization && this.parent.dataType !== 'olap') {
            let pageSettings: IPageSettings = this.engine.pageSettings; this.engine.pageSettings = null;
            (this.engine as PivotEngine).generateGridData(this.parent.dataSourceSettings, true);
            this.parent.applyFormatting(this.engine.pivotValues);
            clonedValues = PivotExportUtil.getClonedPivotValues(this.engine.pivotValues);
            this.engine.pivotValues = currentPivotValues;
            this.engine.pageSettings = pageSettings;
        } else {
            clonedValues = currentPivotValues;
        }
        let args: BeforeExportEventArgs = {
            fileName: customFileName, header: '', footer: '', dataCollections: [clonedValues]
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
            this.addHeaderAndFooter(args.excelExportProperties.header, '', 'header', args.excelExportProperties.header.headerRows)
        }

        /** Fill data and export */
        let workSheets: any = [];
        for (let dataColl: number = 0; dataColl < dataCollections.length; dataColl++) {
            let pivotValues: IPivotValues = dataCollections[dataColl]; let colLen: number = 0; let rowLen: number = pivotValues.length;
            let formatList: { [key: string]: string } = this.parent.renderModule.getFormatList();
            let maxLevel: number = 0;
            for (let rCnt: number = 0; rCnt < rowLen; rCnt++) {
                if (pivotValues[rCnt]) {
                    this.actualrCnt++; colLen = pivotValues[rCnt].length; let cells: ExcelCell[] = [];
                    for (let cCnt: number = 0; cCnt < colLen; cCnt++) {
                        if (pivotValues[rCnt][cCnt]) {
                            let pivotCell: IAxisSet = (pivotValues[rCnt][cCnt] as IAxisSet);
                            if (!(pivotCell.level === -1 && !pivotCell.rowSpan)) {
                                let cellValue: string | number = pivotCell.axis === 'value' ? pivotCell.value : pivotCell.formattedText;
                                let isgetValuesHeader: boolean = ((this.parent.dataSourceSettings.rows.length === 0 && this.parent.dataSourceSettings.valueAxis === 'row')
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
                                        colSpan: pivotCell.colSpan, rowSpan: (pivotCell.rowSpan === -1 ? 1 : pivotCell.rowSpan),
                                    });
                                    if (pivotCell.axis === 'value') {
                                        if (isNaN(pivotCell.value) || pivotCell.formattedText === '' ||
                                            pivotCell.formattedText === undefined || isNullOrUndefined(pivotCell.value)) {
                                            cells[cells.length - 1].value = type === 'Excel' ? null : '';
                                        }
                                        let field: string = (this.parent.dataSourceSettings.valueAxis === 'row' &&
                                            this.parent.dataType === 'olap' && pivotCell.rowOrdinal &&
                                            (this.engine as OlapEngine).tupRowInfo[pivotCell.rowOrdinal]) ?
                                            (this.engine as OlapEngine).tupRowInfo[pivotCell.rowOrdinal].measureName :
                                            pivotCell.actualText as string;
                                        cells[cells.length - 1].style = !isNullOrUndefined(cells[cells.length - 1].value) ? { numberFormat: formatList[field], bold: false, wrapText: true } : { bold: false, wrapText: true };
                                        if (pivotCell.style) {
                                            cells[cells.length - 1].style.backColor = pivotCell.style.backgroundColor;
                                            cells[cells.length - 1].style.fontColor = pivotCell.style.color;
                                            cells[cells.length - 1].style.fontName = pivotCell.style.fontFamily;
                                            cells[cells.length - 1].style.fontSize = Number(pivotCell.style.fontSize.split('px')[0]);
                                        }
                                    } else {
                                        cells[cells.length - 1].style = {
                                            bold: true, vAlign: 'Center', wrapText: true, indent: cCnt === 0 ? pivotCell.level * 10 : 0
                                        };
                                        if (pivotCell.axis === 'row' && cCnt === 0) {
                                            cells[cells.length - 1].style.hAlign = 'Left';
                                            if (this.parent.dataType === 'olap') {
                                                let indent: number = this.parent.renderModule.indentCollection[rCnt];
                                                cells[cells.length - 1].style.indent = indent * 2;
                                                maxLevel = maxLevel > indent ? maxLevel : indent;
                                            } else {
                                                let levelName: string = pivotCell.valueSort ? pivotCell.valueSort.levelName.toString() : '';
                                                let memberPos: number = pivotCell.actualText ?
                                                    pivotCell.actualText.toString().split(this.parent.dataSourceSettings.valueSortSettings.headerDelimiter).length : 0;
                                                let levelPosition: number = levelName.split(this.parent.dataSourceSettings.valueSortSettings.headerDelimiter).length -
                                                    (memberPos ? memberPos - 1 : memberPos);
                                                let level: number = levelPosition ? (levelPosition - 1) : 0;
                                                cells[cells.length - 1].style.indent = level * 2;
                                                maxLevel = level > maxLevel ? level : maxLevel;
                                            }
                                        }
                                    }
                                    cells[cells.length - 1].style.borders = { color: '#000000', lineStyle: 'Thin' };
                                }
                            }
                            cCnt = cCnt + (pivotCell.colSpan ? (pivotCell.colSpan - 1) : 0);
                        } else {
                            cells.push({
                                index: cCnt + 1, value: '', colSpan: 1, rowSpan: 1,
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
                this.addHeaderAndFooter(args.excelExportProperties.footer, '', 'footer', args.excelExportProperties.footer.footerRows)
            }
            let columns: ExcelColumn[] = [];
            for (let cCnt: number = 0; cCnt < colLen; cCnt++) {
                columns.push({ index: cCnt + 1, width: 100 });
            }
            if (maxLevel > 0) {
                columns[0].width = 100 + (maxLevel * 20);
            }
            workSheets.push({ columns: columns, rows: this.rows });
        }
        let book: Workbook = new Workbook({ worksheets: workSheets }, type === 'Excel' ? 'xlsx' : 'csv', undefined, (this.parent as any).currencyCode);
        if ('.xlsx' === fileName.substring(fileName.length - 5, fileName.length) || '.csv' === fileName.substring(fileName.length - 4, fileName.length)) {
            book.save(fileName);
        }
        else {
            book.save(fileName + (type === 'Excel' ? '.xlsx' : '.csv'));
        }
    }

    /**
     * To destroy the excel export module
     * @returns {void}
     * @hidden
     */
    public destroy(): void {
    }
}
