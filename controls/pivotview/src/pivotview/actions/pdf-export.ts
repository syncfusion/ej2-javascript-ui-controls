import {
    PdfGrid, PdfPen, PointF, PdfGridRow, PdfDocument, PdfPage, PdfFont,
    PdfStandardFont, PdfFontFamily, PdfSolidBrush, PdfColor, PdfStringFormat,
    PdfVerticalAlignment, PdfTextAlignment, PdfFontStyle, PdfPageTemplateElement, RectangleF, PdfTrueTypeFont, PdfBorders, PdfGridCell
} from '@syncfusion/ej2-pdf-export';
import { PivotView } from '../base/pivotview';
import * as events from '../../common/base/constant';
import { BeforeExportEventArgs, PdfThemeStyle, PdfBorder, PdfTheme, PdfCellRenderArgs } from '../../common/base/interface';
import { IAxisSet, IPivotValues, IPageSettings, IDataOptions, PivotEngine } from '../../base/engine';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { PdfBorderStyle } from '../../common/base/enum';
import { OlapEngine } from '../../base/olap/engine';
import { PivotUtil } from '../../base/util';

/**
 * @hidden
 * `PDFExport` module is used to handle the PDF export action.
 */
export class PDFExport {
    private parent: PivotView;
    private gridStyle: PdfTheme;
    private engine: PivotEngine | OlapEngine;

    /**
     * Constructor for the PivotGrid PDF Export module.
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
        return 'pdfExport';
    }

    private addPage(eventParams: { document: PdfDocument; args: BeforeExportEventArgs }): PdfPage {
        let page: PdfPage = eventParams.document.pages.add();
        let header: string = eventParams.args.header;
        let footer: string = eventParams.args.footer;
        let font: PdfFont = new PdfStandardFont(PdfFontFamily.TimesRoman, 15, PdfFontStyle.Regular);
        let brush: PdfSolidBrush = new PdfSolidBrush(new PdfColor(0, 0, 0));
        let pen: PdfPen = new PdfPen(new PdfColor(0, 0, 0), .5);
        /** Header and Footer to be set */
        let headerTemplate: PdfPageTemplateElement =
            new PdfPageTemplateElement(new RectangleF(0, 0, page.graphics.clientSize.width, 20));
        headerTemplate.graphics.drawString(header, font, pen, brush, 0, 0, new PdfStringFormat(PdfTextAlignment.Center));
        eventParams.document.template.top = headerTemplate;
        let footerTemplate: PdfPageTemplateElement =
            new PdfPageTemplateElement(new RectangleF(0, 0, page.graphics.clientSize.width, 20));
        footerTemplate.graphics.drawString(footer, font, pen, brush, 0, 0, new PdfStringFormat(PdfTextAlignment.Center));
        eventParams.document.template.bottom = footerTemplate;
        return page;
    }

    private hexDecToRgb(hexDec: string): { r: number; g: number; b: number } {
        if (hexDec === null || hexDec === '' || hexDec.length !== 7) {
            throw new Error('please set valid hex value for color..');
        }
        hexDec = hexDec.substring(1);
        let bigint: number = parseInt(hexDec, 16);
        let r: number = (bigint >> 16) & 255;
        let g: number = (bigint >> 8) & 255;
        let b: number = bigint & 255;
        return { r: r, g: g, b: b };
    }

    private getFontStyle(theme: PdfThemeStyle): PdfFontStyle {
        let fontType: PdfFontStyle = PdfFontStyle.Regular;
        if (!isNullOrUndefined(theme) && theme.bold) {
            fontType |= PdfFontStyle.Bold;
        }
        if (!isNullOrUndefined(theme) && theme.italic) {
            fontType |= PdfFontStyle.Italic;
        }
        if (!isNullOrUndefined(theme) && theme.underline) {
            fontType |= PdfFontStyle.Underline;
        }
        if (!isNullOrUndefined(theme) && theme.strikeout) {
            fontType |= PdfFontStyle.Strikeout;
        }
        return fontType;
    }

    private getBorderStyle(borderStyle: PdfBorder): PdfBorders {
        let borders: PdfBorders = new PdfBorders();
        if (!isNullOrUndefined(borderStyle)) {
            let borderWidth: number = borderStyle.width;
            // set border width
            let width: number = (!isNullOrUndefined(borderWidth) && typeof borderWidth === 'number') ? borderWidth * 0.75 : undefined;
            // set border color
            let color: PdfColor = new PdfColor(196, 196, 196);
            if (!isNullOrUndefined(borderStyle.color)) {
                let borderColor: { r: number; g: number; b: number } = this.hexDecToRgb(borderStyle.color);
                color = new PdfColor(borderColor.r, borderColor.g, borderColor.b);
            }
            let pen: PdfPen = new PdfPen(color, width);
            // set border dashStyle 'Solid <default>, Dash, Dot, DashDot, DashDotDot'
            if (!isNullOrUndefined(borderStyle.dashStyle)) {
                pen.dashStyle = this.getDashStyle(borderStyle.dashStyle);
            }
            borders.all = pen;
        } else {
            let pdfColor: PdfColor = new PdfColor(234, 234, 234);
            borders.all = new PdfPen(pdfColor);
        }
        return borders;
    }

    private getDashStyle(dashType: PdfBorderStyle): number {
        switch (dashType) {
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

    private getStyle(): ITheme {
        let border: PdfBorders = new PdfBorders();
        if (!isNullOrUndefined(this.gridStyle)) {
            let fontFamily: number = !isNullOrUndefined(this.gridStyle.header.fontName) ?
                this.getFontFamily(this.gridStyle.header.fontName) : PdfFontFamily.Helvetica;
            let fontStyle: PdfFontStyle = this.getFontStyle(this.gridStyle.header);
            let fontSize: number = !isNullOrUndefined(this.gridStyle.header.fontSize) ? this.gridStyle.header.fontSize : 10.5;
            let pdfColor: PdfColor = new PdfColor();
            if (!isNullOrUndefined(this.gridStyle.header.fontColor)) {
                let penBrushColor: { r: number; g: number; b: number } = this.hexDecToRgb(this.gridStyle.header.fontColor);
                pdfColor = new PdfColor(penBrushColor.r, penBrushColor.g, penBrushColor.b);
            }
            let font: PdfStandardFont | PdfTrueTypeFont = new PdfStandardFont(fontFamily, fontSize, fontStyle);
            if (!isNullOrUndefined(this.gridStyle.header.font)) {
                font = this.gridStyle.header.font;
            }
            return {
                border: this.getBorderStyle(this.gridStyle.header.border), font: font, brush: new PdfSolidBrush(pdfColor)
            };
        } else {
            return {
                brush: new PdfSolidBrush(new PdfColor()),
                border: border, font: undefined
            };
        }
    }

    private setRecordThemeStyle(row: PdfGridRow, border: PdfBorders): PdfGridRow {
        if (!isNullOrUndefined(this.gridStyle) && !isNullOrUndefined(this.gridStyle.record)) {
            let fontFamily: number = !isNullOrUndefined(this.gridStyle.record.fontName) ?
                this.getFontFamily(this.gridStyle.record.fontName) : PdfFontFamily.Helvetica;
            let fontSize: number = !isNullOrUndefined(this.gridStyle.record.fontSize) ? this.gridStyle.record.fontSize : 9.75;
            let fontStyle: PdfFontStyle = this.getFontStyle(this.gridStyle.record);
            let font: PdfStandardFont | PdfTrueTypeFont = new PdfStandardFont(fontFamily, fontSize, fontStyle);
            if (!isNullOrUndefined(this.gridStyle.record.font)) {
                font = this.gridStyle.record.font;
            }
            row.style.setFont(font);
            let pdfColor: PdfColor = new PdfColor();
            if (!isNullOrUndefined(this.gridStyle.record.fontColor)) {
                let penBrushColor: { r: number; g: number; b: number } = this.hexDecToRgb(this.gridStyle.record.fontColor);
                pdfColor = new PdfColor(penBrushColor.r, penBrushColor.g, penBrushColor.b);
            }
            row.style.setTextBrush(new PdfSolidBrush(pdfColor));
        }
        let borderRecord: PdfBorders = this.gridStyle && this.gridStyle.record &&
            this.gridStyle.record.border ? this.getBorderStyle(this.gridStyle.record.border) : border;
        row.style.setBorder(borderRecord);
        return row;
    }

    /**
     * Method to perform pdf export.
     * @hidden
     */
    /* eslint-disable  */
    public exportToPDF(): void {
        this.engine = this.parent.dataType === 'olap' ? this.parent.olapEngineModule : this.parent.engineModule;
        let eventParams: { document: PdfDocument, args: BeforeExportEventArgs } = this.applyEvent();
        let headerStyle: ITheme = this.getStyle();
        let indent: number = this.parent.renderModule.maxIndent ? this.parent.renderModule.maxIndent : 5;
        let firstColumnWidth: number = 100 + (indent * 20);
        let size: number = Math.floor((540 - firstColumnWidth) / 90) + 1;
        /** Fill data and export */
        let dataCollIndex: number = 0; let pivotValues: IPivotValues = eventParams.args.dataCollections[dataCollIndex];
        for (let vLen: number = 0; eventParams.args.allowRepeatHeader && size > 1 && vLen < pivotValues.length; vLen++) {
            for (let vCnt: number = size; pivotValues[vLen] && vCnt < pivotValues[vLen].length; vCnt += size) {
                (pivotValues[vLen] as IAxisSet[]).splice(vCnt, 0, pivotValues[vLen][0] as IAxisSet);
            }
        }
        let colLength: number = pivotValues && pivotValues.length > 0 ? pivotValues[0].length : 0;
        let integratedCnt: number = 0;
        do {
            let page: PdfPage = this.addPage(eventParams); let pdfGrid: PdfGrid = new PdfGrid();
            let pageSize: number = size > 1 ? size : 5;
            if (pivotValues && pivotValues.length > 0) {
                pdfGrid.columns.add(pivotValues[0].length - integratedCnt >= pageSize ? pageSize : pivotValues[0].length - integratedCnt);
                let rowLen: number = pivotValues.length;
                let actualrCnt: number = 0; let maxLevel: number = 0;
                for (let rCnt: number = 0; rCnt < rowLen; rCnt++) {
                    if (pivotValues[rCnt]) {
                        let isColHeader: boolean = !(pivotValues[rCnt][0] && (pivotValues[rCnt][0] as IAxisSet).axis === 'row');
                        let colLen: number = pivotValues[rCnt].length > (integratedCnt + pageSize) ? (integratedCnt + pageSize) :
                            pivotValues[rCnt].length;
                        if (isColHeader) {
                            pdfGrid.headers.add(1);
                        }
                        let pdfGridRow: PdfGridRow = !isColHeader ? pdfGrid.rows.addRow() : pdfGrid.headers.getHeader(actualrCnt);
                        if (isColHeader) {
                            pdfGridRow.style.setBorder(headerStyle.border);
                            if (headerStyle.font) {
                                pdfGridRow.style.setFont(headerStyle.font);
                            }
                            pdfGridRow.style.setTextBrush(headerStyle.brush);
                        } else {
                            this.setRecordThemeStyle(pdfGridRow, headerStyle.border);
                        }
                        let localCnt: number = 0; let isEmptyRow: boolean = true;
                        for (let cCnt: number = integratedCnt; cCnt < colLen; cCnt++) {
                            let isValueCell: boolean = false;
                            if (pivotValues[rCnt][cCnt]) {
                                let pivotCell: IAxisSet = (pivotValues[rCnt][cCnt] as IAxisSet);
                                if (!(pivotCell.level === -1 && !pivotCell.rowSpan)) {
                                    let cellValue: string | number = pivotCell.formattedText;
                                    cellValue = pivotCell.type === 'grand sum' ? this.parent.localeObj.getConstant('grandTotal') :
                                        (pivotCell.type === 'sum' ?
                                            cellValue.toString().replace('Total', this.parent.localeObj.getConstant('total')) : cellValue);
                                    if (!(pivotCell.level === -1 && !pivotCell.rowSpan)) {
                                        pdfGridRow.cells.getCell(localCnt).columnSpan = pivotCell.colSpan ?
                                            (pageSize - localCnt < pivotCell.colSpan ? pageSize - localCnt : pivotCell.colSpan) : 1;
                                        if (isColHeader && pivotCell.rowSpan && pivotCell.rowSpan > 1) {
                                            pdfGridRow.cells.getCell(localCnt).rowSpan = pivotCell.rowSpan ? pivotCell.rowSpan : 1;
                                        }
                                        pdfGridRow.cells.getCell(localCnt).value = cellValue ? cellValue.toString() : '';
                                    }
                                    if (cellValue !== '') {
                                        isEmptyRow = false;
                                    }
                                }
                                maxLevel = pivotCell.level > maxLevel ? pivotCell.level : maxLevel;
                                isValueCell = pivotCell.axis === 'value';
                                cCnt = cCnt + (pdfGridRow.cells.getCell(localCnt).columnSpan ?
                                    (pdfGridRow.cells.getCell(localCnt).columnSpan - 1) : 0);
                                localCnt = localCnt + (pdfGridRow.cells.getCell(localCnt).columnSpan ?
                                    (pdfGridRow.cells.getCell(localCnt).columnSpan - 1) : 0);
                                if (pivotCell.style) {
                                    pdfGridRow = this.applyStyle(pdfGridRow, pivotCell, localCnt);
                                }
                                let args: PdfCellRenderArgs = {
                                    style: (pivotCell && pivotCell.isSum) ? { bold: true } : undefined,
                                    pivotCell: pivotCell,
                                    cell: pdfGridRow.cells.getCell(localCnt)
                                };
                                this.parent.trigger(events.onPdfCellRender, args);
                                if (args.style) {
                                    this.processCellStyle(pdfGridRow.cells.getCell(localCnt), args);
                                }
                            } else {
                                let args: PdfCellRenderArgs = {
                                    style: undefined,
                                    pivotCell: undefined,
                                    cell: pdfGridRow.cells.getCell(localCnt)
                                };
                                this.parent.trigger(events.onPdfCellRender, args);
                                if (args.style) {
                                    this.processCellStyle(pdfGridRow.cells.getCell(localCnt), args);
                                }
                                pdfGridRow.cells.getCell(localCnt).value = '';
                                if (cCnt === 0 && isColHeader && this.parent.dataSourceSettings.columns &&
                                    this.parent.dataSourceSettings.columns.length > 0) {
                                    pdfGrid.headers.getHeader(0).cells.getCell(0).rowSpan++;
                                } else if (cCnt !== 0 && isColHeader && this.parent.dataSourceSettings.columns &&
                                    this.parent.dataSourceSettings.columns.length > 0 &&
                                    pdfGrid.headers.getHeader(0).cells.getCell(0).rowSpan <
                                    Object.keys(this.engine.headerContent).length) {
                                    pdfGrid.headers.getHeader(0).cells.getCell(0).rowSpan++;
                                }
                            }
                            let stringFormat: PdfStringFormat = new PdfStringFormat();
                            if (this.parent.dataType === 'olap') {
                                let indent: number = (!isColHeader && localCnt === 0 && (pivotValues[rCnt][cCnt] as IAxisSet)) ?
                                    (this.parent.renderModule.indentCollection[(pivotValues[rCnt][cCnt] as IAxisSet).rowIndex]) : 0;
                                stringFormat.paragraphIndent = indent * 15;
                                maxLevel = maxLevel > indent ? maxLevel : indent;
                            } else {
                                stringFormat.paragraphIndent = (!isColHeader && localCnt === 0 && (pivotValues[rCnt][cCnt] as IAxisSet) &&
                                    (pivotValues[rCnt][cCnt] as IAxisSet).level !== -1) ?
                                    (pivotValues[rCnt][cCnt] as IAxisSet).level * 15 : 0;
                            }
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
                pdfGrid.columns.getColumn(0).width = 100 + (maxLevel * 20);
            }
            if (integratedCnt === 0 && this.parent.dataSourceSettings.columns && this.parent.dataSourceSettings.columns.length > 0) {
                pdfGrid.headers.getHeader(0).cells.getCell(0).rowSpan--;
            }
            pdfGrid.draw(page, new PointF(10, 20));
            integratedCnt = integratedCnt + pageSize;
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

    private getFontFamily(family: string): number {
        switch (family) {
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

    private getFont(theme: any): PdfFont {
        if (theme.style.font) {
            return theme.style.font;
        }
        let fontSize: number = (theme.cell.cellStyle.font && theme.cell.cellStyle.font.fontSize) ? theme.cell.cellStyle.font.fontSize :
            (!isNullOrUndefined(theme.style.fontSize)) ? (theme.style.fontSize * 0.75) : 9.75;

        let fontFamily: number = (!isNullOrUndefined(theme.style.fontFamily)) ?
            (this.getFontFamily(theme.style.fontFamily)) : PdfFontFamily.TimesRoman;
        let fontStyle: PdfFontStyle = PdfFontStyle.Regular;
        if (!isNullOrUndefined(theme.style.bold) && theme.style.bold) {
            fontStyle |= PdfFontStyle.Bold;
        }
        if (!isNullOrUndefined(theme.style.italic) && theme.style.italic) {
            fontStyle |= PdfFontStyle.Italic;
        }
        if (!isNullOrUndefined(theme.style.underline) && theme.style.underline) {
            fontStyle |= PdfFontStyle.Underline;
        }
        if (!isNullOrUndefined(theme.style.strikeout) && theme.style.strikeout) {
            fontStyle |= PdfFontStyle.Strikeout;
        }
        return new PdfStandardFont(fontFamily, fontSize, fontStyle);
    }

    private processCellStyle(gridCell: PdfGridCell, arg: PdfCellRenderArgs): void {
        if (!isNullOrUndefined(arg.style.backgroundColor)) {
            let backColor: { r: number, g: number, b: number } = this.hexDecToRgb(arg.style.backgroundColor);
            gridCell.style.backgroundBrush = new PdfSolidBrush(new PdfColor(backColor.r, backColor.g, backColor.b));
        }
        if (!isNullOrUndefined(arg.style.textBrushColor)) {
            let textBrushColor: { r: number, g: number, b: number } = this.hexDecToRgb(arg.style.textBrushColor);
            gridCell.style.textBrush = new PdfSolidBrush(new PdfColor(textBrushColor.r, textBrushColor.g, textBrushColor.b));
        }
        if (!isNullOrUndefined(arg.style.textPenColor)) {
            let textColor: { r: number, g: number, b: number } = this.hexDecToRgb(arg.style.textPenColor);
            gridCell.style.textPen = new PdfPen(new PdfColor(textColor.r, textColor.g, textColor.b));
        }
        if (!isNullOrUndefined(arg.style.fontFamily) || !isNullOrUndefined(arg.style.fontSize) || !isNullOrUndefined(arg.style.bold) ||
            !isNullOrUndefined(arg.style.italic) || !isNullOrUndefined(arg.style.underline) || !isNullOrUndefined(arg.style.strikeout)) {
            gridCell.style.font = this.getFont(arg);
        }
        if (!isNullOrUndefined(arg.style.border)) {
            let border: PdfBorders = new PdfBorders();
            let borderWidth: number = arg.style.border.width;
            // set border width
            let width: number = (!isNullOrUndefined(borderWidth) && typeof borderWidth === 'number') ? (borderWidth * 0.75) : (undefined);
            // set border color
            let color: PdfColor = new PdfColor(196, 196, 196);
            if (!isNullOrUndefined(arg.style.border.color)) {
                let borderColor: { r: number, g: number, b: number } = this.hexDecToRgb(arg.style.border.color);
                color = new PdfColor(borderColor.r, borderColor.g, borderColor.b);
            }
            let pen: PdfPen = new PdfPen(color, width);
            // set border dashStyle 'Solid <default>, Dash, Dot, DashDot, DashDotDot'
            if (!isNullOrUndefined(arg.style.border.dashStyle)) {
                pen.dashStyle = this.getDashStyle(arg.style.border.dashStyle);
            }
            border.all = pen;
            gridCell.style.borders = border;
        }
    }

    private applyEvent(): { document: PdfDocument, args: BeforeExportEventArgs } {
        /** Event trigerring */
        let clonedValues: IPivotValues;
        let currentPivotValues: IPivotValues = PivotUtil.getClonedPivotValues(this.engine.pivotValues);
        if (this.parent.exportAllPages && this.parent.enableVirtualization && this.parent.dataType !== 'olap') {
            let pageSettings: IPageSettings = this.engine.pageSettings;
            this.engine.pageSettings = null;
            (this.engine as PivotEngine).generateGridData(this.parent.dataSourceSettings as IDataOptions);
            this.parent.applyFormatting(this.engine.pivotValues);
            clonedValues = PivotUtil.getClonedPivotValues(this.engine.pivotValues);
            this.engine.pivotValues = currentPivotValues;
            this.engine.pageSettings = pageSettings;
        } else {
            clonedValues = currentPivotValues;
        }
        let style: PdfTheme;
        let args: BeforeExportEventArgs = {
            fileName: 'default', header: '', footer: '', dataCollections: [clonedValues], allowRepeatHeader: true, style: style
        };
        let argument: BeforeExportEventArgs;
        this.parent.trigger(events.beforeExport, args, (observedArgs: BeforeExportEventArgs) => {
            this.gridStyle = observedArgs.style;
            argument = observedArgs;
        });
        let document: PdfDocument = new PdfDocument();
        return { document: document, args: argument };
    }

    /**
     * To destroy the pdf export module.
     * @returns {void}
     * @hidden
     */
    public destroy(): void {
    }
}

/**
 * @hidden
 */
interface ITheme {
    fontColor?: string;
    fontName?: string;
    fontSize?: number;
    bold?: boolean;
    border?: PdfBorders;
    font?: PdfStandardFont | PdfTrueTypeFont;
    brush?: PdfSolidBrush;
    backgroundBrush?: PdfSolidBrush;
}
