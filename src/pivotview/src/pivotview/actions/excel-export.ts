import { Workbook } from '@syncfusion/ej2-excel-export';
import { ExcelRow, ExcelCell, ExcelColumn, BeforeExportEventArgs } from '../../common/base/interface';
import * as events from '../../common/base/constant';
import { PivotView } from '../base/pivotview';
import { IAxisSet, IPivotValues } from '../../base/engine';
import { IPageSettings } from '../../base/engine';

/**
 * @hidden
 * `ExcelExport` module is used to handle the Excel export action.
 */
export class ExcelExport {
    private parent: PivotView;

    /**
     * Constructor for the PivotGrid Excel Export module.
     * @hidden
     */
    constructor(parent?: PivotView) {
        this.parent = parent;
    }

    /**
     * For internal use only - Get the module name.
     * @private
     */
    protected getModuleName(): string {
        return 'excelExport';
    }

    /**
     * Method to perform excel export.
     * @hidden
     */
    public exportToExcel(type: string): void {
        /** Event trigerring */
        if (this.parent.enableVirtualization) {
            let pageSettings: IPageSettings = this.parent.engineModule.pageSettings;
            this.parent.engineModule.pageSettings = null;
            this.parent.engineModule.generateGridData(this.parent.dataSource);
            this.parent.engineModule.pageSettings = pageSettings;
        }
        let args: BeforeExportEventArgs = {
            fileName: 'default', header: '', footer: '', dataCollections: [this.parent.engineModule.pivotValues]
        };
        this.parent.trigger(events.beforeExport, args);
        let fileName: string = args.fileName;
        let header: string = args.header;
        let footer: string = args.footer;
        let dataCollections: IPivotValues[] = args.dataCollections;

        /** Fill data and export */
        /* tslint:disable-next-line:no-any */
        let workSheets: any = [];
        for (let dataColl: number = 0; dataColl < dataCollections.length; dataColl++) {
            let pivotValues: IPivotValues = dataCollections[dataColl];
            let colLen: number = 0;
            let rowLen: number = pivotValues.length;
            let actualrCnt: number = 0;
            let formatList: string[] = this.parent.renderModule.getFormatList();
            let rows: ExcelRow[] = [];
            let maxLevel: number = 0;
            for (let rCnt: number = 0; rCnt < rowLen; rCnt++) {
                if (pivotValues[rCnt]) {
                    actualrCnt++;
                    colLen = pivotValues[rCnt].length;
                    let cells: ExcelCell[] = [];
                    for (let cCnt: number = 0; cCnt < colLen; cCnt++) {
                        if (pivotValues[rCnt][cCnt]) {
                            let pivotCell: IAxisSet = (pivotValues[rCnt][cCnt] as IAxisSet);
                            if (!(pivotCell.level === -1 && !pivotCell.rowSpan)) {
                                let cellValue: string | number = pivotCell.axis === 'value' ? pivotCell.value : pivotCell.formattedText;
                                if (pivotCell.type === 'grand sum') {
                                    cellValue = this.parent.localeObj.getConstant('grandTotal');
                                } else if (pivotCell.type === 'sum') {
                                    cellValue = cellValue.toString().replace('Total', this.parent.localeObj.getConstant('total'));
                                } else {
                                    cellValue = cellValue === '0' ? '' : cellValue;
                                }
                                if (!(pivotCell.level === -1 && !pivotCell.rowSpan)) {
                                    cells.push({
                                        index: cCnt + 1, value: cellValue,
                                        colSpan: pivotCell.colSpan, rowSpan: pivotCell.rowSpan,
                                    });
                                    if (pivotCell.axis === 'value') {
                                        cells[cells.length - 1].style = {
                                            numberFormat: formatList[(cCnt - 1) % this.parent.dataSource.values.length],
                                            bold: false,
                                            wrapText: true
                                        };
                                        if (pivotCell.style) {
                                            cells[cells.length - 1].style.backColor = pivotCell.style.backgroundColor;
                                            cells[cells.length - 1].style.fontColor = pivotCell.style.color;
                                            cells[cells.length - 1].style.fontName = pivotCell.style.fontFamily;
                                            cells[cells.length - 1].style.fontSize = Number(pivotCell.style.fontSize.split('px')[0]);
                                        }
                                    } else {
                                        cells[cells.length - 1].style = {
                                            bold: true,
                                            vAlign: 'Center',
                                            wrapText: true,
                                            indent: cCnt === 1 ? pivotCell.level * 10 : 0
                                        };
                                        if (pivotCell.axis === 'row' && cCnt === 0) {
                                            cells[cells.length - 1].style.hAlign = 'Left';
                                            cells[cells.length - 1].style.indent = pivotCell.level * 2;
                                            maxLevel = pivotCell.level > maxLevel ? pivotCell.level : maxLevel;
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
                    rows.push({ index: actualrCnt, cells: cells });
                }
            }
            let columns: ExcelColumn[] = [];
            for (let cCnt: number = 0; cCnt < colLen; cCnt++) {
                columns.push({ index: cCnt + 1, width: 100 });
            }
            if (maxLevel > 0) {
                columns[0].width = 100 + (maxLevel * 20);
            }
            workSheets.push({ columns: columns, rows: rows });
        }
        let book: Workbook = new Workbook({ worksheets: workSheets }, type === 'Excel' ? 'xlsx' : 'csv');
        book.save(fileName + (type === 'Excel' ? '.xlsx' : '.csv'));
    }
}
