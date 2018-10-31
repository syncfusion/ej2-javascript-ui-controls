import {
    PdfGrid, PdfPen, PointF, PdfGridRow, PdfDocument, PdfPage, PdfGridLayoutResult, PdfFont,
    PdfStandardFont, PdfFontFamily, PdfSolidBrush, PdfColor, PdfStringFormat,
    PdfVerticalAlignment, PdfTextAlignment, PdfFontStyle, PdfPageTemplateElement, RectangleF, PdfLayoutFormat
} from '@syncfusion/ej2-pdf-export';
import { PivotView } from '../base/pivotview';
import * as events from '../../common/base/constant';
import { BeforeExportEventArgs } from '../../common/base/interface';
import { IAxisSet, IPivotValues, IPageSettings } from '../../base/engine';

/**
 * @hidden
 * `PDFExport` module is used to handle the PDF export action.
 */
export class PDFExport {
    private parent: PivotView;

    /**
     * Constructor for the PivotGrid PDF Export module.
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
        return 'pdfExport';
    }

    /**
     * Method to perform pdf export.
     * @hidden
     */
    public exportToPDF(): void {
        let eventParams: { document: PdfDocument, page: PdfPage, args: BeforeExportEventArgs } = this.applyEvent();
        /** Fill data and export */
        let dataCollIndex: number = 0;
        let gridResult: PdfGridLayoutResult;
        let pivotValues: IPivotValues = eventParams.args.dataCollections[dataCollIndex];
        let colLength: number = pivotValues && pivotValues.length > 0 ? pivotValues[0].length : 0;
        let integratedCnt: number = 0;
        do {
            let pdfGrid: PdfGrid = new PdfGrid();
            if (pivotValues && pivotValues.length > 0) {
                pdfGrid.columns.add(pivotValues[0].length - integratedCnt >= 6 ? 6 : pivotValues[0].length - integratedCnt);
                let rowLen: number = pivotValues.length;
                let actualrCnt: number = 0; let maxLevel: number = 0;
                for (let rCnt: number = 0; rCnt < rowLen; rCnt++) {
                    if (pivotValues[rCnt]) {
                        let isColHeader: boolean = !(pivotValues[rCnt][0] && (pivotValues[rCnt][0] as IAxisSet).axis === 'row');
                        let colLen: number = pivotValues[rCnt].length > (integratedCnt + 6) ? (integratedCnt + 6) :
                            pivotValues[rCnt].length;
                        if (isColHeader) {
                            pdfGrid.headers.add(1);
                        }
                        let pdfGridRow: PdfGridRow = !isColHeader ? pdfGrid.rows.addRow() : pdfGrid.headers.getHeader(actualrCnt);
                        let localCnt: number = 0; let isEmptyRow: boolean = true;
                        for (let cCnt: number = integratedCnt; cCnt < colLen; cCnt++) {
                            let isValueCell: boolean = false;
                            if (pivotValues[rCnt][cCnt]) {
                                let pivotCell: IAxisSet = (pivotValues[rCnt][cCnt] as IAxisSet);
                                if (!(pivotCell.level === -1 && !pivotCell.rowSpan)) {
                                    let cellValue: string | number = pivotCell.formattedText;
                                    cellValue = pivotCell.type === 'grand sum' ? this.parent.localeObj.getConstant('grandTotal') :
                                        (pivotCell.type === 'sum' ?
                                            cellValue.toString().replace('Total', this.parent.localeObj.getConstant('total')) :
                                            (cellValue === '0' ? '' : cellValue));
                                    if (!(pivotCell.level === -1 && !pivotCell.rowSpan)) {
                                        pdfGridRow.cells.getCell(localCnt).columnSpan = pivotCell.colSpan ?
                                            (6 - localCnt < pivotCell.colSpan ? 6 - localCnt : pivotCell.colSpan) : 1;
                                        if (isColHeader && pivotCell.rowSpan && pivotCell.rowSpan > 1) {
                                            pdfGridRow.cells.getCell(localCnt).rowSpan = pivotCell.rowSpan ? pivotCell.rowSpan : 1;
                                        }
                                        pdfGridRow.cells.getCell(localCnt).value = cellValue.toString();
                                    }
                                    if (cellValue !== '') {
                                        isEmptyRow = false;
                                    }
                                }
                                maxLevel = pivotCell.level > maxLevel && cCnt === 0 ? pivotCell.level : maxLevel;
                                isValueCell = pivotCell.axis === 'value';
                                cCnt = cCnt + (pdfGridRow.cells.getCell(localCnt).columnSpan ?
                                    (pdfGridRow.cells.getCell(localCnt).columnSpan - 1) : 0);
                                localCnt = localCnt + (pdfGridRow.cells.getCell(localCnt).columnSpan ?
                                    (pdfGridRow.cells.getCell(localCnt).columnSpan - 1) : 0);
                                if (pivotCell.style) {
                                    pdfGridRow = this.applyStyle(pdfGridRow, pivotCell, localCnt);
                                }
                            } else {
                                pdfGridRow.cells.getCell(localCnt).value = '';
                                if (cCnt === 0 && isColHeader && this.parent.dataSource.columns &&
                                    this.parent.dataSource.columns.length > 0) {
                                    pdfGrid.headers.getHeader(0).cells.getCell(0).rowSpan++;
                                }
                            }
                            let stringFormat: PdfStringFormat = new PdfStringFormat();
                            stringFormat.paragraphIndent = (!isColHeader && cCnt === 0 && (pivotValues[rCnt][cCnt] as IAxisSet)) ?
                                (pivotValues[rCnt][cCnt] as IAxisSet).level * 15 : 0;
                            stringFormat.alignment = isValueCell ? PdfTextAlignment.Right : PdfTextAlignment.Left;
                            stringFormat.lineAlignment = PdfVerticalAlignment.Middle;
                            pdfGridRow.cells.getCell(localCnt).style.stringFormat = stringFormat;
                            localCnt++;
                        }
                        if (isEmptyRow) {
                            pdfGridRow.height = 16;
                        }
                        actualrCnt++;
                    }
                }
                if (integratedCnt === 0) {
                    pdfGrid.columns.getColumn(0).width = 100 + (maxLevel * 20);
                }
            }
            let layout: PdfLayoutFormat = new PdfLayoutFormat();
            layout.paginateBounds = new RectangleF(0, 0, 0, 0);
            if (integratedCnt === 0 && this.parent.dataSource.columns && this.parent.dataSource.columns.length > 0) {
                pdfGrid.headers.getHeader(0).cells.getCell(0).rowSpan--;
            }
            if (gridResult) {
                gridResult = pdfGrid.draw(gridResult.page, new PointF(10, gridResult.bounds.y + gridResult.bounds.height + 10), layout);
            } else {
                gridResult = pdfGrid.draw(eventParams.page, new PointF(10, 20), layout);
            }
            integratedCnt = integratedCnt + 6;
            if (integratedCnt >= colLength && eventParams.args.dataCollections.length > (dataCollIndex + 1)) {
                dataCollIndex++;
                pivotValues = eventParams.args.dataCollections[dataCollIndex];
                colLength = pivotValues && pivotValues.length > 0 ? pivotValues[0].length : 0;
                integratedCnt = 0;
            }
        } while (integratedCnt < colLength);
        eventParams.document.save(eventParams.args.fileName + '.pdf');
        eventParams.document.destroy();
    }

    private applyStyle(pdfGridRow: PdfGridRow, pivotCell: IAxisSet, localCnt: number): PdfGridRow {
        let color: { r: number, g: number, b: number } =
            this.parent.conditionalFormattingModule.hexToRgb(pivotCell.style.backgroundColor);
        let brush: PdfSolidBrush = new PdfSolidBrush(new PdfColor(color.r, color.g, color.b));
        pdfGridRow.cells.getCell(localCnt).style.backgroundBrush = brush;
        let size: number = Number(pivotCell.style.fontSize.split('px')[0]);
        let font: PdfFont = new PdfStandardFont(PdfFontFamily.TimesRoman, size, PdfFontStyle.Regular);
        pdfGridRow.cells.getCell(localCnt).style.font = font;
        color = this.parent.conditionalFormattingModule.hexToRgb(pivotCell.style.color);
        brush = new PdfSolidBrush(new PdfColor(color.r, color.g, color.b));
        pdfGridRow.cells.getCell(localCnt).style.textBrush = brush;
        return pdfGridRow;
    }

    private applyEvent(): { document: PdfDocument, page: PdfPage, args: BeforeExportEventArgs } {
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

        let document: PdfDocument = new PdfDocument();
        let page: PdfPage = document.pages.add();

        /** Header and Footer to be set */
        let font: PdfFont = new PdfStandardFont(PdfFontFamily.TimesRoman, 15, PdfFontStyle.Regular);
        let brush: PdfSolidBrush = new PdfSolidBrush(new PdfColor(0, 0, 0));
        let pen: PdfPen = new PdfPen(new PdfColor(0, 0, 0), .5);

        let headerTemplate: PdfPageTemplateElement = new PdfPageTemplateElement(new RectangleF(0, 0, page.graphics.clientSize.width, 20));
        headerTemplate.graphics.drawString(header, font, pen, brush, 0, 0, new PdfStringFormat(PdfTextAlignment.Center));
        document.template.top = headerTemplate;

        let footerTemplate: PdfPageTemplateElement = new PdfPageTemplateElement(new RectangleF(0, 0, page.graphics.clientSize.width, 20));
        footerTemplate.graphics.drawString(footer, font, pen, brush, 0, 0, new PdfStringFormat(PdfTextAlignment.Center));
        document.template.bottom = footerTemplate;
        return { document: document, page: page, args: args };
    }
}