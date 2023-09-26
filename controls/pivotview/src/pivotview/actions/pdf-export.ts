import {
    PdfGrid, PdfPen, PointF, PdfGridRow, PdfDocument, PdfPage, PdfFont,
    PdfStandardFont, PdfFontFamily, PdfSolidBrush, PdfColor, PdfStringFormat,
    PdfVerticalAlignment, PdfTextAlignment, PdfFontStyle, PdfPageTemplateElement,
    RectangleF, PdfTrueTypeFont, PdfBorders, PdfGridCell, SizeF, PdfSection, PdfPageOrientation, PdfMargins
} from '@syncfusion/ej2-pdf-export';
import { PivotView } from '../base/pivotview';
import * as events from '../../common/base/constant';
import { BeforeExportEventArgs, PdfThemeStyle, PdfBorder, PdfTheme, PdfCellRenderArgs, ExportCompleteEventArgs, EnginePopulatedEventArgs } from '../../common/base/interface';
import { IAxisSet, IPageSettings, IDataOptions, PivotEngine } from '../../base/engine';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { PdfBorderStyle } from '../../common/base/enum';
import { OlapEngine } from '../../base/olap/engine';
import { PivotExportUtil } from '../../base/export-util';
import { PdfExportProperties, PdfHeaderQueryCellInfoEventArgs, PdfQueryCellInfoEventArgs } from '@syncfusion/ej2-grids';
import { PivotUtil } from '../../base/util';

/**
 * @hidden
 * `PDFExport` module is used to handle the PDF export action.
 */
export class PDFExport {
    private parent: PivotView;
    private gridStyle: PdfTheme;
    private engine: PivotEngine | OlapEngine;
    private document: PdfDocument
    /** @hidden */
    public exportProperties: BeforeExportEventArgs;

    /**
     * Constructor for the PivotGrid PDF Export module.
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
        return 'pdfExport';
    }

    private addPage(eventParams: { document: PdfDocument; args: EnginePopulatedEventArgs },
                    pdfExportProperties?: PdfExportProperties): PdfPage {
        pdfExportProperties = pdfExportProperties ? pdfExportProperties : this.exportProperties.pdfExportProperties;
        const documentSection: PdfSection = eventParams.document.sections.add() as PdfSection;
        const documentHeight: number = eventParams.document.pageSettings.height;
        const documentWidth: number = eventParams.document.pageSettings.width;
        if (this.exportProperties.width || this.exportProperties.height) {
            eventParams.document.pageSettings.orientation = ((this.exportProperties.width > this.exportProperties.height)
                || (!this.exportProperties.height && (this.exportProperties.width > documentHeight)) || (!this.exportProperties.width
                && (documentWidth > this.exportProperties.height))) ? PdfPageOrientation.Landscape : PdfPageOrientation.Portrait;
            eventParams.document.pageSettings.size = new SizeF(this.exportProperties.width ? this.exportProperties.width :
                documentWidth, this.exportProperties.height ? this.exportProperties.height : documentHeight);
        } else {
            eventParams.document.pageSettings.orientation = (this.exportProperties.orientation === 0 || this.exportProperties.orientation)
                ? this.exportProperties.orientation : (!isNullOrUndefined(pdfExportProperties) &&
                !isNullOrUndefined(pdfExportProperties.pageOrientation)) ? (pdfExportProperties.pageOrientation === 'Landscape' ?
                        PdfPageOrientation.Landscape : PdfPageOrientation.Portrait) : PdfPageOrientation.Landscape;
            if (!isNullOrUndefined(pdfExportProperties) && !isNullOrUndefined(pdfExportProperties.pageSize)) {
                eventParams.document.pageSettings.size = PivotUtil.getPageSize(pdfExportProperties.pageSize);
            }
        }
        if (!isNullOrUndefined(this.exportProperties.pdfMargins)) {
            const margins: PdfMargins = eventParams.document.pageSettings.margins;
            margins.top = !isNullOrUndefined(this.exportProperties.pdfMargins.top) ? this.exportProperties.pdfMargins.top : margins.top;
            margins.bottom = !isNullOrUndefined(this.exportProperties.pdfMargins.bottom) ? this.exportProperties.pdfMargins.bottom :
                margins.bottom;
            margins.left = !isNullOrUndefined(this.exportProperties.pdfMargins.left) ? this.exportProperties.pdfMargins.left : margins.left;
            margins.right = !isNullOrUndefined(this.exportProperties.pdfMargins.right) ? this.exportProperties.pdfMargins.right :
                margins.right;
        }
        documentSection.setPageSettings(eventParams.document.pageSettings);
        const page: PdfPage = documentSection.pages.add();
        const header: string = (!isNullOrUndefined(pdfExportProperties) && !isNullOrUndefined(pdfExportProperties.header)
            && !isNullOrUndefined(pdfExportProperties.header.contents) && !isNullOrUndefined(pdfExportProperties.header.contents[0].value))
            ? pdfExportProperties.header.contents[0].value : this.exportProperties.header ? this.exportProperties.header : '';
        const footer: string = (!isNullOrUndefined(pdfExportProperties) && !isNullOrUndefined(pdfExportProperties.footer) &&
            !isNullOrUndefined(pdfExportProperties.footer.contents) && !isNullOrUndefined(pdfExportProperties.footer.contents[0].value)) ?
            pdfExportProperties.footer.contents[0].value : this.exportProperties.footer ? this.exportProperties.footer : '';
        const themeStyle: PdfThemeStyle = (!isNullOrUndefined(pdfExportProperties.theme) &&
            !isNullOrUndefined(pdfExportProperties.theme.record)) ? pdfExportProperties.theme.record : undefined;
        const fontFamily: number = (!isNullOrUndefined(themeStyle) && !isNullOrUndefined(themeStyle.font) &&
            !isNullOrUndefined(themeStyle.font.name)) ? this.getFontFamily(themeStyle.font.name) : PdfFontFamily.TimesRoman;
        const fontSize: number = (!isNullOrUndefined(themeStyle) && !isNullOrUndefined(themeStyle.font) &&
            !isNullOrUndefined(themeStyle.font.size)) ? themeStyle.font.size : 10;
        const fontStyle: PdfFontStyle = !isNullOrUndefined(themeStyle) ? this.getFontStyle(themeStyle) : PdfFontStyle.Regular;
        const font: PdfStandardFont | PdfTrueTypeFont = new PdfStandardFont(fontFamily, fontSize, fontStyle);
        // const font: PdfFont = new PdfStandardFont(PdfFontFamily.TimesRoman, 15, PdfFontStyle.Regular);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const headerCondition: any = (!isNullOrUndefined(pdfExportProperties) && !isNullOrUndefined(pdfExportProperties.header)
            && !isNullOrUndefined(pdfExportProperties.header.contents) && !isNullOrUndefined(pdfExportProperties.header.contents[0].style));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const footerCondition: any = (!isNullOrUndefined(pdfExportProperties) && !isNullOrUndefined(pdfExportProperties.footer)
            && !isNullOrUndefined(pdfExportProperties.footer.contents) && !isNullOrUndefined(pdfExportProperties.footer.contents[0].style));
        const headerColor: { r: number; g: number; b: number } = (headerCondition) ?
            this.hexDecToRgb(pdfExportProperties.header.contents[0].style.textBrushColor) as PdfColor : (new PdfColor(0, 0, 0));
        const brushHeader: PdfSolidBrush = (headerCondition) ? new PdfSolidBrush(new PdfColor(headerColor.r, headerColor.g, headerColor.b))
            : new PdfSolidBrush(new PdfColor(0, 0, 0));
        const footerColor: { r: number; g: number; b: number } = (footerCondition) ?
            this.hexDecToRgb(pdfExportProperties.footer.contents[0].style.textBrushColor) as PdfColor : (new PdfColor(0, 0, 0));
        const brushFooter: PdfSolidBrush = (footerCondition) ? new PdfSolidBrush(new PdfColor(footerColor.r, footerColor.g, footerColor.b))
            : new PdfSolidBrush(new PdfColor(0, 0, 0));
        const pen: PdfPen = new PdfPen(new PdfColor(0, 0, 0), .5);
        /** Header and Footer to be set */
        const headerTemplate: PdfPageTemplateElement =
            new PdfPageTemplateElement(new RectangleF(0, 0, page.graphics.clientSize.width, 20));
        headerTemplate.graphics.drawString(header, font, pen, brushHeader, 0, 0, new PdfStringFormat(PdfTextAlignment.Center));
        eventParams.document.template.top = headerTemplate;
        const footerTemplate: PdfPageTemplateElement =
            new PdfPageTemplateElement(new RectangleF(0, 0, page.graphics.clientSize.width, 20));
        footerTemplate.graphics.drawString(footer, font, pen, brushFooter, 0, 0, new PdfStringFormat(PdfTextAlignment.Center));
        eventParams.document.template.bottom = footerTemplate;
        return page;
    }

    private hexDecToRgb(hexDec: string): { r: number; g: number; b: number } {
        if (hexDec === null || hexDec === '' || hexDec.length !== 7) {
            throw new Error('please set valid hex value for color..');
        }
        hexDec = hexDec.substring(1);
        const bigint: number = parseInt(hexDec, 16);
        const r: number = (bigint >> 16) & 255;
        const g: number = (bigint >> 8) & 255;
        const b: number = bigint & 255;
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
        const borders: PdfBorders = new PdfBorders();
        if (!isNullOrUndefined(borderStyle)) {
            const borderWidth: number = borderStyle.width;
            // set border width
            const width: number = (!isNullOrUndefined(borderWidth) && typeof borderWidth === 'number') ? borderWidth * 0.75 : undefined;
            // set border color
            let color: PdfColor = new PdfColor(196, 196, 196);
            if (!isNullOrUndefined(borderStyle.color)) {
                const borderColor: { r: number; g: number; b: number } = this.hexDecToRgb(borderStyle.color);
                color = new PdfColor(borderColor.r, borderColor.g, borderColor.b);
            }
            const pen: PdfPen = new PdfPen(color, width);
            // set border dashStyle 'Solid <default>, Dash, Dot, DashDot, DashDotDot'
            if (!isNullOrUndefined(borderStyle.dashStyle)) {
                pen.dashStyle = this.getDashStyle(borderStyle.dashStyle);
            }
            borders.all = pen;
        } else {
            const pdfColor: PdfColor = new PdfColor(234, 234, 234);
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
        const border: PdfBorders = new PdfBorders();
        if (!isNullOrUndefined(this.gridStyle)) {
            const fontFamily: number = !isNullOrUndefined(this.gridStyle.header.fontName) ?
                this.getFontFamily(this.gridStyle.header.fontName) : PdfFontFamily.Helvetica;
            const fontStyle: PdfFontStyle = this.getFontStyle(this.gridStyle.header);
            const fontSize: number = !isNullOrUndefined(this.gridStyle.header.fontSize) ? this.gridStyle.header.fontSize : 10.5;
            let pdfColor: PdfColor = new PdfColor();
            if (!isNullOrUndefined(this.gridStyle.header.fontColor)) {
                const penBrushColor: { r: number; g: number; b: number } = this.hexDecToRgb(this.gridStyle.header.fontColor);
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
            const fontFamily: number = !isNullOrUndefined(this.gridStyle.record.fontName) ?
                this.getFontFamily(this.gridStyle.record.fontName) : PdfFontFamily.Helvetica;
            const fontSize: number = !isNullOrUndefined(this.gridStyle.record.fontSize) ? this.gridStyle.record.fontSize : 9.75;
            const fontStyle: PdfFontStyle = this.getFontStyle(this.gridStyle.record);
            let font: PdfStandardFont | PdfTrueTypeFont = new PdfStandardFont(fontFamily, fontSize, fontStyle);
            if (!isNullOrUndefined(this.gridStyle.record.font)) {
                font = this.gridStyle.record.font;
            }
            row.style.setFont(font);
            let pdfColor: PdfColor = new PdfColor();
            if (!isNullOrUndefined(this.gridStyle.record.fontColor)) {
                const penBrushColor: { r: number; g: number; b: number } = this.hexDecToRgb(this.gridStyle.record.fontColor);
                pdfColor = new PdfColor(penBrushColor.r, penBrushColor.g, penBrushColor.b);
            }
            row.style.setTextBrush(new PdfSolidBrush(pdfColor));
        }
        const borderRecord: PdfBorders = this.gridStyle && this.gridStyle.record &&
            this.gridStyle.record.border ? this.getBorderStyle(this.gridStyle.record.border) : border;
        row.style.setBorder(borderRecord);
        return row;
    }

    /**
     * Method to perform pdf export.
     *
     * @param  {PdfExportProperties} pdfExportProperties - Defines the export properties of the Grid.
     * @param  {boolean} isMultipleExport - Define to enable multiple export.
     * @param  {Object} pdfDoc - Defined the PDF document if multiple export is enabled.
     * @param  {boolean} isBlob - If 'isBlob' set to true, then it will be returned as blob data.
     * @returns {Promise<any>}
     * @hidden
     */

    public exportToPDF(pdfExportProperties?: PdfExportProperties, isMultipleExport?: boolean, pdfDoc?: Object, isBlob?: boolean)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        : Promise<any> {
        this.engine = this.parent.dataType === 'olap' ? this.parent.olapEngineModule : this.parent.engineModule;
        this.gridStyle = this.exportProperties.pdfExportProperties.theme;
        const eventParams: { document: PdfDocument, args: EnginePopulatedEventArgs } = this.applyEvent();
        if (!isNullOrUndefined(pdfDoc)) {
            eventParams.document = <PdfDocument>pdfDoc;
        }
        const headerStyle: ITheme = this.getStyle();
        const fileName: string = this.exportProperties.fileName ? this.exportProperties.fileName : (!isNullOrUndefined(pdfExportProperties) && !isNullOrUndefined(pdfExportProperties.fileName)) ? pdfExportProperties.fileName : 'default';
        const indent: number = this.parent.renderModule.maxIndent ? this.parent.renderModule.maxIndent : 5;
        const firstColumnWidth: number = 100 + (indent * 20);
        let size: number = Math.floor((540 - firstColumnWidth) / 90) + 1;
        /** Fill data and export */
        let dataCollIndex: number = 0; let pivotValues: IAxisSet[][] =
            eventParams.args.pivotValues[dataCollIndex as number] as IAxisSet[][];
        if (this.exportProperties.columnSize || this.exportProperties.width || this.exportProperties.height) {
            size = this.exportProperties.columnSize > 0 ? this.exportProperties.columnSize : pivotValues[0].length;
        }
        const allowRepeatHeader: boolean = this.exportProperties.allowRepeatHeader ? this.exportProperties.allowRepeatHeader : true;
        for (let vLen: number = 0; allowRepeatHeader && size > 1 && vLen < pivotValues.length; vLen++) {
            for (let vCnt: number = size; pivotValues[vLen as number] && vCnt < pivotValues[vLen as number].length; vCnt += size) {
                (pivotValues[vLen as number] as IAxisSet[]).splice(vCnt, 0, pivotValues[vLen as number][0] as IAxisSet);
            }
        }
        let colLength: number = pivotValues && pivotValues.length > 0 ? pivotValues[0].length : 0;
        let integratedCnt: number = 0;
        do {
            if (!isNullOrUndefined(pdfExportProperties)) {
                this.exportProperties.header = (!isNullOrUndefined(pdfExportProperties.header) &&
                !isNullOrUndefined(pdfExportProperties.header.contents) && !isNullOrUndefined(pdfExportProperties.header.contents[0].value))
                    ? pdfExportProperties.header.contents[0].value : this.exportProperties.header;
                this.exportProperties.footer = (!isNullOrUndefined(pdfExportProperties.footer) &&
                !isNullOrUndefined(pdfExportProperties.footer.contents) && !isNullOrUndefined(pdfExportProperties.footer.contents[0].value))
                    ? pdfExportProperties.footer.contents[0].value : this.exportProperties.footer;
            }
            const page: PdfPage = this.addPage(eventParams, pdfExportProperties); const pdfGrid: PdfGrid = new PdfGrid();
            const pageSize: number = size > 0 ? size : 5;
            if (pivotValues && pivotValues.length > 0) {
                pdfGrid.columns.add(pivotValues[0].length - integratedCnt >= pageSize ? pageSize : pivotValues[0].length - integratedCnt);
                const rowLen: number = pivotValues.length;
                let actualrCnt: number = 0; let maxLevel: number = 0;
                let columnWidth: number = 0;
                for (let rCnt: number = 0; rCnt < rowLen; rCnt++) {
                    if (pivotValues[rCnt as number]) {
                        const isColHeader: boolean = !(pivotValues[rCnt as number][0] && (pivotValues[rCnt as number][0] as IAxisSet).axis === 'row');
                        const colLen: number = pivotValues[rCnt as number].length > (integratedCnt + pageSize) ? (integratedCnt + pageSize)
                            : pivotValues[rCnt as number].length;
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
                            if (pivotValues[rCnt as number][cCnt as number]) {
                                const pivotCell: IAxisSet = (pivotValues[rCnt as number][cCnt as number] as IAxisSet);
                                let cellValue: string | number = pivotCell.formattedText;
                                cellValue = (this.parent.dataSourceSettings.rows.length === 0 || this.parent.dataSourceSettings.columns.length === 0) ? this.parent.getValuesHeader(pivotCell, 'value') : cellValue;
                                cellValue = pivotCell.type === 'grand sum' ? (this.parent.dataSourceSettings.rows.length === 0 || this.parent.dataSourceSettings.columns.length === 0) ? this.parent.getValuesHeader(pivotCell, 'grandTotal') :
                                    this.parent.localeObj.getConstant('grandTotal') : (pivotCell.type === 'sum' ?
                                    cellValue.toString().replace('Total', this.parent.localeObj.getConstant('total')) : cellValue);
                                if (!(pivotCell.level === -1 && !pivotCell.rowSpan)) {
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
                                let args: PdfCellRenderArgs | PdfQueryCellInfoEventArgs | PdfHeaderQueryCellInfoEventArgs = {
                                    style: undefined,
                                    pivotCell: pivotCell,
                                    cell: pdfGridRow.cells.getCell(localCnt),
                                    column: pdfGrid.columns.getColumn(localCnt)
                                };
                                this.parent.trigger(events.onPdfCellRender, args);
                                if (pivotCell.axis === 'column') {
                                    args = {
                                        style: args.style,
                                        cell: args.cell,
                                        gridCell: args.pivotCell
                                    };
                                    this.parent.trigger(events.pdfHeaderQueryCellInfo, args);
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    pdfGridRow.cells.getCell(localCnt).value = (args.gridCell as any).formattedText ? (args.gridCell as any)
                                        .formattedText : cellValue;
                                }
                                else {
                                    args = {
                                        style: args.style,
                                        cell: args.cell,
                                        column: undefined,
                                        data: args.pivotCell,
                                        value: cellValue
                                    };
                                    this.parent.trigger(events.pdfQueryCellInfo, args);
                                    pdfGridRow.cells.getCell(localCnt).value = args.value ? args.value : cellValue;
                                }
                                if (args.style) {
                                    this.processCellStyle(pdfGridRow.cells.getCell(localCnt), args);
                                }
                            } else {
                                let args: PdfCellRenderArgs | PdfQueryCellInfoEventArgs | PdfHeaderQueryCellInfoEventArgs = {
                                    style: undefined,
                                    pivotCell: undefined,
                                    cell: pdfGridRow.cells.getCell(localCnt),
                                    column: pdfGrid.columns.getColumn(localCnt)
                                };
                                this.parent.trigger(events.onPdfCellRender, args);
                                columnWidth = args.column.width;
                                const pivotCell: IAxisSet = { formattedText: '' };
                                if (pivotCell.axis === 'column') {
                                    args = {
                                        style: args.style,
                                        cell: args.cell,
                                        gridCell: args.pivotCell
                                    };
                                    this.parent.trigger(events.pdfHeaderQueryCellInfo, args);
                                }
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
                            const stringFormat: PdfStringFormat = new PdfStringFormat();
                            if (this.parent.dataType === 'olap') {
                                const indent: number = (!isColHeader && localCnt === 0 &&
                                    (pivotValues[rCnt as number][cCnt as number] as IAxisSet)) ?
                                    (this.parent.renderModule.indentCollection[(pivotValues[rCnt as number][cCnt as number] as IAxisSet)
                                        .rowIndex]) : 0;
                                stringFormat.paragraphIndent = indent * 15;
                                maxLevel = maxLevel > indent ? maxLevel : indent;
                            } else {
                                stringFormat.paragraphIndent = 0;
                                if ((!isColHeader && localCnt === 0 && (pivotValues[rCnt as number][cCnt as number] as IAxisSet) &&
                                    (pivotValues[rCnt as number][cCnt as number] as IAxisSet).level !== -1)) {
                                    const cell: IAxisSet = pivotValues[rCnt as number][cCnt as number] as IAxisSet;
                                    const levelName: string = cell.valueSort ? cell.valueSort.levelName.toString() : '';
                                    const memberPos: number = cell.actualText ?
                                        cell.actualText.toString().split(this.parent.dataSourceSettings.valueSortSettings.headerDelimiter)
                                            .length : 0;
                                    const levelPosition: number =
                                        levelName.split(this.parent.dataSourceSettings.valueSortSettings.headerDelimiter).length -
                                        (memberPos ? memberPos - 1 : memberPos);
                                    const level: number = levelPosition ? (levelPosition - 1) : 0;
                                    stringFormat.paragraphIndent = level * 10;
                                }
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
                pdfGrid.columns.getColumn(0).width = columnWidth > 0 ? columnWidth : 100 + (maxLevel * 20);
            }
            if (integratedCnt === 0 && this.parent.dataSourceSettings.columns && this.parent.dataSourceSettings.columns.length > 0) {
                pdfGrid.headers.getHeader(0).cells.getCell(0).rowSpan--;
            }
            pdfGrid.draw(page, new PointF(10, 20));
            integratedCnt = integratedCnt + pageSize;
            if (integratedCnt >= colLength && eventParams.args.pivotValues.length > (dataCollIndex + 1)) {
                dataCollIndex++;
                pivotValues = eventParams.args.pivotValues[dataCollIndex as number] as IAxisSet[][];
                colLength = pivotValues && pivotValues.length > 0 ? pivotValues[0].length : 0;
                integratedCnt = 0;
            }
        } while (integratedCnt < colLength);
        return new Promise((resolve: Function) => {
            let blobData: Promise<{ blobData: Blob; }>;
            if (isBlob || isMultipleExport) {
                if (isBlob) {
                    blobData = eventParams.document.save();
                }
            } else {
                eventParams.document.save(fileName + '.pdf');
                eventParams.document.destroy();
            }
            const exportCompleteEventArgs: ExportCompleteEventArgs = {
                type: 'PDF',
                promise: isBlob ? blobData : null
            };
            this.parent.trigger(events.exportComplete, exportCompleteEventArgs);
            resolve(eventParams.document);
        });
    }
    /* eslint-enable  */

    private applyStyle(pdfGridRow: PdfGridRow, pivotCell: IAxisSet, localCnt: number): PdfGridRow {
        let color: { r: number, g: number, b: number } =
            this.parent.conditionalFormattingModule.hexToRgb(pivotCell.style.backgroundColor);
        let brush: PdfSolidBrush = new PdfSolidBrush(new PdfColor(color.r, color.g, color.b));
        pdfGridRow.cells.getCell(localCnt).style.backgroundBrush = brush;
        const size: number = Number(pivotCell.style.fontSize.split('px')[0]);
        const font: PdfFont = new PdfStandardFont(PdfFontFamily.TimesRoman, size, PdfFontStyle.Regular);
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private getFont(theme: any): PdfFont {
        if (theme.style.font) {
            return theme.style.font;
        }
        const fontSize: number = (theme.cell.cellStyle.font && theme.cell.cellStyle.font.fontSize) ? theme.cell.cellStyle.font.fontSize :
            (!isNullOrUndefined(theme.style.fontSize)) ? (theme.style.fontSize * 0.75) : 9.75;

        const fontFamily: number = (!isNullOrUndefined(theme.style.fontFamily)) ?
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

    private processCellStyle(gridCell: PdfGridCell, arg?: PdfCellRenderArgs | PdfQueryCellInfoEventArgs | PdfHeaderQueryCellInfoEventArgs)
        : void {
        if (!isNullOrUndefined(arg.style.backgroundColor)) {
            const backColor: { r: number, g: number, b: number } = this.hexDecToRgb(arg.style.backgroundColor);
            gridCell.style.backgroundBrush = new PdfSolidBrush(new PdfColor(backColor.r, backColor.g, backColor.b));
        }
        if (!isNullOrUndefined(arg.style.textBrushColor)) {
            const textBrushColor: { r: number, g: number, b: number } = this.hexDecToRgb(arg.style.textBrushColor);
            gridCell.style.textBrush = new PdfSolidBrush(new PdfColor(textBrushColor.r, textBrushColor.g, textBrushColor.b));
        }
        if (!isNullOrUndefined(arg.style.textPenColor)) {
            const textColor: { r: number, g: number, b: number } = this.hexDecToRgb(arg.style.textPenColor);
            gridCell.style.textPen = new PdfPen(new PdfColor(textColor.r, textColor.g, textColor.b));
        }
        if (!isNullOrUndefined(arg.style.fontFamily) || !isNullOrUndefined(arg.style.fontSize) || !isNullOrUndefined(arg.style.bold) ||
            !isNullOrUndefined(arg.style.italic) || !isNullOrUndefined(arg.style.underline) || !isNullOrUndefined(arg.style.strikeout)) {
            gridCell.style.font = this.getFont(arg);
        }
        if (!isNullOrUndefined(arg.style.border)) {
            const border: PdfBorders = new PdfBorders();
            const borderWidth: number = arg.style.border.width;
            // set border width
            const width: number = (!isNullOrUndefined(borderWidth) && typeof borderWidth === 'number') ? (borderWidth * 0.75) : (undefined);
            // set border color
            let color: PdfColor = new PdfColor(196, 196, 196);
            if (!isNullOrUndefined(arg.style.border.color)) {
                const borderColor: { r: number, g: number, b: number } = this.hexDecToRgb(arg.style.border.color);
                color = new PdfColor(borderColor.r, borderColor.g, borderColor.b);
            }
            const pen: PdfPen = new PdfPen(color, width);
            // set border dashStyle 'Solid <default>, Dash, Dot, DashDot, DashDotDot'
            if (!isNullOrUndefined(arg.style.border.dashStyle)) {
                pen.dashStyle = this.getDashStyle(arg.style.border.dashStyle);
            }
            border.all = pen;
            gridCell.style.borders = border;
        }
    }

    private applyEvent(): { document: PdfDocument, args: EnginePopulatedEventArgs } {
        /** Event trigerring */
        let clonedValues: IAxisSet[][];
        const currentPivotValues: IAxisSet[][] = PivotExportUtil.getClonedPivotValues(this.engine.pivotValues) as IAxisSet[][];
        if (this.parent.exportAllPages && (this.parent.enableVirtualization || this.parent.enablePaging) && this.parent.dataType !== 'olap' && this.parent.dataSourceSettings.mode !== 'Server') {
            const pageSettings: IPageSettings = this.engine.pageSettings;
            this.engine.pageSettings = null;
            (this.engine as PivotEngine).isPagingOrVirtualizationEnabled = false;
            (this.engine as PivotEngine).generateGridData(this.parent.dataSourceSettings as IDataOptions, true);
            this.parent.applyFormatting(this.engine.pivotValues);
            clonedValues = PivotExportUtil.getClonedPivotValues(this.engine.pivotValues) as IAxisSet[][];
            this.engine.pivotValues = currentPivotValues;
            this.engine.pageSettings = pageSettings;
            (this.engine as PivotEngine).isPagingOrVirtualizationEnabled = true;
        } else {
            clonedValues = currentPivotValues;
        }
        const args: EnginePopulatedEventArgs = {
            pivotValues: [clonedValues] as IAxisSet[][]
        };
        this.parent.trigger(events.enginePopulated, args);
        this.document = new PdfDocument();
        return { document: this.document, args: args };
    }

    /**
     * To destroy the pdf export module.
     *
     * @returns {void}
     * @hidden
     */
    public destroy(): void {
        if (this.engine) {
            this.engine = null;
        }
        if (this.exportProperties) {
            this.exportProperties = null;
        }
        if (this.document) {
            this.document = null;
        }
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
