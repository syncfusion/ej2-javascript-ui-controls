import { isNullOrUndefined } from '@syncfusion/ej2-base';
import {
    PdfDocument, PdfBitmap, SizeF, PointF, RectangleF, PdfPageTemplateElement,
    PdfFont, PdfSolidBrush, PdfPen, PdfColor, PdfStringFormat, PdfPageNumberField,
    PdfCompositeField, PdfPageCountField, PdfFontFamily, PdfFontStyle, PdfStandardFont,
    PdfTextAlignment, PdfVerticalAlignment, PdfTextWebLink, PdfGridCell,
    PdfGridRow
} from '@syncfusion/ej2-pdf-export';
import { PdfExportProperties, PdfFooter, PdfHeader, PdfHeaderFooterContent, PdfHeaderQueryCellInfoEventArgs, PdfPageNumberType, PdfQueryCellInfoEventArgs, PdfTheme } from '@syncfusion/ej2-grids';
import { PdfBorderStyle } from '../../common/base/enum';
import { IAxisSet } from '../../base/engine';
import { PivotView } from '../base/pivotview';

/**
 * `PDFExportHelper` module is used to add header and footer in PDF document
 *
 * @hidden
 */
export class PDFExportHelper {

    /**
     * Method to draw a header in a PDF document.
     *
     * @param  {PdfExportProperties} pdfExportProperties - It contains the export properties for the table and chart.
     * @param  {PdfDocument} pdfDocument - It contains the current PDF document
     * @returns {void}
     * @hidden
     */
    public drawHeader(pdfExportProperties: PdfExportProperties, pdfDocument: PdfDocument): void {
        const clientSize: SizeF = pdfDocument.pageSettings.size;
        const header: PdfHeader = pdfExportProperties.header;
        const position: PointF = new PointF(0, (header && header.fromTop) ? header.fromTop : 0);
        const size: SizeF = new SizeF((clientSize.width - 80), ((header && header.height) ? header.height * 0.75 : 50));
        const bounds: RectangleF = new RectangleF(position, size);
        pdfDocument.template.top = this.drawPageTemplate(new PdfPageTemplateElement(bounds), header);
    }

    /**
     * Method to draw a footer in a PDF document.
     *
     * @param  {PdfExportProperties} pdfExportProperties -It contains the export properties for table and chart
     * @param  {PdfDocument} pdfDocument - It contains the current PDF document
     * @returns {void}
     * @hidden
     */
    public drawFooter(pdfExportProperties: PdfExportProperties, pdfDocument: PdfDocument): void {
        const clientSize: SizeF = pdfDocument.pageSettings.size;
        const footer: PdfFooter = pdfExportProperties.footer;
        const position: PointF = new PointF(0, ((clientSize.width - 80) - ((footer && footer.fromBottom) ?
            footer.fromBottom * 0.75 : 0)));
        const size: SizeF = new SizeF((clientSize.width - 80), ((footer && footer.height) ? footer.height * 0.75 : 50));
        const bounds: RectangleF = new RectangleF(position, size);
        pdfDocument.template.bottom = this.drawPageTemplate(new PdfPageTemplateElement(bounds), footer);
    }

    private drawPageTemplate(template: PdfPageTemplateElement, element: PdfHeader | PdfFooter): PdfPageTemplateElement {
        for (const content of element.contents) {
            this.processContentValidation(content);
            switch (content.type) {
            case 'Text':
                if (content.value === '' || isNullOrUndefined(content.value) || typeof content.value !== 'string') {
                    throw new Error('please enter the valid input value in text content...');
                }
                this.drawText(template, content);
                break;
            case 'PageNumber':
                this.drawPageNumber(template, content);
                break;
            case 'Image':
                if (isNullOrUndefined(content.src) || content.src === '') {
                    throw new Error('please enter the valid base64 string in image content...');
                }
                this.drawImage(template, content);
                break;
            case 'Line':
                this.drawLine(template, content);
                break;
            }
        }
        return template;
    }

    private processContentValidation(content: PdfHeaderFooterContent): void {
        if (isNullOrUndefined(content.type)) {
            throw new Error('please set valid content type...');
        } else {
            if (content.type === 'Line') {
                if (isNullOrUndefined(content.points)) {
                    throw new Error('please enter valid points in ' + content.type + ' content...');
                } else {
                    if (isNullOrUndefined(content.points.x1) || typeof content.points.x1 !== 'number') {
                        throw new Error('please enter valid x1 co-ordinate in ' + content.type + ' points...');
                    }
                    if (isNullOrUndefined(content.points.y1) || typeof content.points.y1 !== 'number') {
                        throw new Error('please enter valid y1 co-ordinate in ' + content.type + ' points...');
                    }
                    if (isNullOrUndefined(content.points.x2) || typeof content.points.x2 !== 'number') {
                        throw new Error('please enter valid x2 co-ordinate in ' + content.type + ' points...');
                    }
                    if (isNullOrUndefined(content.points.y2) || typeof content.points.y2 !== 'number') {
                        throw new Error('please enter valid y2 co-ordinate in ' + content.type + ' points...');
                    }
                }
            } else {
                if (isNullOrUndefined(content.position)) {
                    throw new Error('please enter valid position in ' + content.type + ' content...');
                } else {
                    if (isNullOrUndefined(content.position.x) || typeof content.position.x !== 'number') {
                        throw new Error('please enter valid x co-ordinate in ' + content.type + ' position...');
                    }
                    if (isNullOrUndefined(content.position.y) || typeof content.position.y !== 'number') {
                        throw new Error('please enter valid y co-ordinate in ' + content.type + ' position...');
                    }
                }
            }
        }
    }

    private drawText(pageTemplate: PdfPageTemplateElement, content: PdfHeaderFooterContent): void {
        const font: PdfFont = this.getFontFromContent(content);
        let brush: PdfSolidBrush = this.getBrushFromContent(content);
        let pen: PdfPen = null;
        if (!isNullOrUndefined(content.style) && !isNullOrUndefined(content.style.textPenColor)) {
            const penColor: { r: number; g: number; b: number } = this.hexDecToRgb(content.style.textPenColor);
            pen = new PdfPen(new PdfColor(penColor.r, penColor.g, penColor.b));
        }
        if (brush == null && pen == null) {
            brush = new PdfSolidBrush(new PdfColor(0, 0, 0));
        }
        const value: string = content.value.toString();
        const x: number = content.position.x * 0.75;
        const y: number = content.position.y * 0.75;
        let format: PdfStringFormat = new PdfStringFormat();
        if (!isNullOrUndefined(content.stringFormat)) {
            format = content.stringFormat;
        }
        const result: { format: PdfStringFormat; size: SizeF } = this.setContentFormat(content, format);
        if (result !== null && !isNullOrUndefined(result.format) && !isNullOrUndefined(result.size)) {
            pageTemplate.graphics.drawString(value, font, pen, brush, x, y, result.size.width, result.size.height, result.format);
        } else {
            pageTemplate.graphics.drawString(value, font, pen, brush, x, y, format);
        }
    }

    private drawPageNumber(documentHeader: PdfPageTemplateElement, content: PdfHeaderFooterContent): void {
        const font: PdfFont = this.getFontFromContent(content);
        let brush: PdfSolidBrush = null;
        if (!isNullOrUndefined(content.style) && !isNullOrUndefined(content.style.textBrushColor)) {
            const brushColor: { r: number; g: number; b: number } = this.hexDecToRgb(content.style.textBrushColor);
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

    private drawImage(documentHeader: PdfPageTemplateElement, content: PdfHeaderFooterContent): void {
        const x: number = content.position.x * 0.75;
        const y: number = content.position.y * 0.75;
        const width: number = (!isNullOrUndefined(content.size) && !isNullOrUndefined(content.size.width)) ?
            (content.size.width * 0.75) : undefined;
        const height: number = (!isNullOrUndefined(content.size) && !isNullOrUndefined(content.size.height)) ?
            (content.size.height * 0.75) : undefined;
        const image: PdfBitmap = new PdfBitmap(content.src);
        if (!isNullOrUndefined(width)) {
            documentHeader.graphics.drawImage(image, x, y, width, height);
        } else {
            documentHeader.graphics.drawImage(image, x, y);
        }
    }

    private drawLine(documentHeader: PdfPageTemplateElement, content: PdfHeaderFooterContent): void {
        const x1: number = content.points.x1 * 0.75;
        const y1: number = content.points.y1 * 0.75;
        const x2: number = content.points.x2 * 0.75;
        const y2: number = content.points.y2 * 0.75;
        const pen: PdfPen = this.getPenFromContent(content);
        if (!isNullOrUndefined(content.style)) {
            if (!isNullOrUndefined(content.style.penSize) && typeof content.style.penSize === 'number') {
                pen.width = content.style.penSize * 0.75;
            }
            pen.dashStyle = this.getDashStyle(content.style.dashStyle);
        }
        documentHeader.graphics.drawLine(pen, x1, y1, x2, y2);
    }

    private getFontFromContent(content: PdfHeaderFooterContent): PdfFont {
        const fontSize: number = (!isNullOrUndefined(content.font) && !isNullOrUndefined((content.font as PdfStandardFont)['fontSize'])) ?
            ((content.font as PdfStandardFont)['fontSize'] * 0.75) : (!isNullOrUndefined(content.style) &&
                !isNullOrUndefined(content.style.fontSize)) ? (content.style.fontSize * 0.75) : 9.75;
        const fontFamily: number = (!isNullOrUndefined(content.font) && !isNullOrUndefined((content.font as PdfStandardFont)['pdfFontFamily']))
            ? (content.font as PdfStandardFont)['pdfFontFamily'] : PdfFontFamily.TimesRoman;
        let fontStyle: PdfFontStyle = PdfFontStyle.Regular;
        if (!isNullOrUndefined(content.font) && !isNullOrUndefined(content.font.bold)) {
            fontStyle |= PdfFontStyle.Bold;
        }
        if (!isNullOrUndefined(content.font) && !isNullOrUndefined(content.font.italic)) {
            fontStyle |= PdfFontStyle.Italic;
        }
        if (!isNullOrUndefined(content.font) && !isNullOrUndefined(content.font.underline)) {
            fontStyle |= PdfFontStyle.Underline;
        }
        if (!isNullOrUndefined(content.font) && !isNullOrUndefined(content.font.strikeout)) {
            fontStyle |= PdfFontStyle.Strikeout;
        }
        return new PdfStandardFont(fontFamily, fontSize, fontStyle);
    }

    private getPenFromContent(content: PdfHeaderFooterContent): PdfPen {
        let pen: PdfPen = new PdfPen(new PdfColor(0, 0, 0));
        if (!isNullOrUndefined(content.style) && content.style !== null && !isNullOrUndefined(content.style.penColor)) {
            const penColor: { r: number; g: number; b: number } = this.hexDecToRgb(content.style.penColor);
            pen = new PdfPen(new PdfColor(penColor.r, penColor.g, penColor.b));
        }
        return pen;
    }

    private getBrushFromContent(content: PdfHeaderFooterContent): PdfSolidBrush {
        let brush: PdfSolidBrush = null;
        if (!isNullOrUndefined(content.style) && !isNullOrUndefined(content.style.textBrushColor)) {
            const brushColor: { r: number; g: number; b: number } = this.hexDecToRgb(content.style.textBrushColor);
            brush = new PdfSolidBrush(new PdfColor(brushColor.r, brushColor.g, brushColor.b));
        }
        return brush;
    }

    private setContentFormat(content: PdfHeaderFooterContent, format: PdfStringFormat): { format: PdfStringFormat; size: SizeF } {
        if (!isNullOrUndefined(content.size)) {
            const width: number = content.size.width * 0.75;
            const height: number = content.size.height * 0.75;
            format = new PdfStringFormat(PdfTextAlignment.Left, PdfVerticalAlignment.Middle);
            if (!isNullOrUndefined(content.style) && !isNullOrUndefined(content.style.hAlign)) {
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
                }
            }
            if (!isNullOrUndefined(content.style) && !isNullOrUndefined(content.style.vAlign)) {
                switch (content.style.vAlign) {
                case 'Bottom':
                    format.lineAlignment = PdfVerticalAlignment.Bottom;
                    break;
                case 'Top':
                    format.lineAlignment = PdfVerticalAlignment.Top;
                    break;
                }
            }
            return { format: format, size: new SizeF(width, height) };
        }
        return null;
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

    /**
     *
     * @param {PdfBorderStyle} dashType - It contains the PDF dash style
     * @returns {number} - It returns PDF dash style
     * @hidden
     */
    public getDashStyle(dashType: PdfBorderStyle): number {
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

    /**
     *
     * @param {string} hexDec - It contains a hexadecimal code as string
     * @returns {number} - It returns RGB as number
     * @hidden
     */
    public hexDecToRgb(hexDec: string): { r: number; g: number; b: number } {
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

    /**
     * Converts the supplied base64 image data into a `PdfBitmap`, applies any optional sizing, and assigns it to the
     * specified PDF grid cell so the image is rendered when exporting to PDF.
     *
     * @param {PdfGridCell} cell - Holds the current cell for customization.
     * @param {Object} image - Holds the image data to insert.
     * @param {string} image.base64 - Base64-encoded image string used to create the bitmap.
     * @param {number} [image.height] - Height to assign to the image when provided.
     * @param {number} [image.width] - Width to assign to the image when provided.
     * @param {PdfGridRow} pdfGridRow - The current PDF grid row;
     * @returns {void}
     * @hidden
     */
    public configureCellImage(
        cell: PdfGridCell, image: { base64: string; height?: number; width?: number }, pdfGridRow: PdfGridRow
    ): void {
        const pdfImage: PdfBitmap = new PdfBitmap(image.base64);
        pdfImage.height = image.height || pdfImage.height;
        pdfImage.width = image.width || pdfImage.width;
        cell.value = pdfImage;
        if (pdfGridRow && pdfGridRow.height < pdfImage.height) {
            pdfGridRow.height = pdfImage.height;
        }
    }

    /**
     * Applies hyperlink formatting to the supplied PDF grid cell when hyperlink metadata is available, ensuring the exported
     * PDF displays a clickable link with consistent styling.
     *
     * @param {PdfGridCell} cell - The PDF grid cell to render as a hyperlink when hyperlink metadata is provided.
     * @param {PdfHeaderQueryCellInfoEventArgs | PdfQueryCellInfoEventArgs} args - Provides hyperlink metadata (target URL and optional display text). When not set, the cell is rendered as plain text.
     * @param {PdfGridRow} pdfGridRow - The current PDF grid row; used to identify header rows for default text styling.
     * @param {IAxisSet} pivotCell - The current pivot cell; used to identify row header/summary regions for default text styling.
     * @param {PivotView} currentPivotInstance - The current PivotView instance; used with pivotCell to determine the row header levels.
     * @returns {void}
     * @hidden
     */
    public setHyperLink(
        cell: PdfGridCell, args: PdfHeaderQueryCellInfoEventArgs | PdfQueryCellInfoEventArgs, pdfGridRow?: PdfGridRow,
        pivotCell?: IAxisSet, currentPivotInstance?: PivotView
    ): void {
        const isHeader: boolean = (pdfGridRow && pdfGridRow.isHeaderRow) || (pivotCell && pivotCell.axis === 'row');
        let headerFontColorApplied: boolean = false;
        let recordFontColorApplied: boolean = false;
        if (currentPivotInstance && currentPivotInstance.pdfExportModule && currentPivotInstance.pdfExportModule.exportProperties &&
            currentPivotInstance.pdfExportModule.exportProperties.pdfExportProperties &&
            currentPivotInstance.pdfExportModule.exportProperties.pdfExportProperties.theme) {
            const theme: PdfTheme = currentPivotInstance.pdfExportModule.exportProperties.pdfExportProperties.theme;
            headerFontColorApplied = theme.header && theme.header.fontColor ? true : false;
            recordFontColorApplied = theme.record && theme.record.fontColor ? true : false;
        }
        if (!isNullOrUndefined(args.hyperLink)) {
            const textLink: PdfTextWebLink = new PdfTextWebLink();
            textLink.url = args.hyperLink.target;
            textLink.text = args.hyperLink.displayText || args.hyperLink.target;
            const fontSize: number = (args && args.style && args.style.fontSize) ? (args.style.fontSize * 0.80) :
                (cell && cell.style && cell.style.font && cell.style.font['fontSize']) ? cell.style.font['fontSize'] : 11;
            const fontFamily: PdfFontFamily | string | number = (args && args.style && args.style.fontFamily) ?
                this.getFontFamily(args.style.fontFamily) : (cell && cell.style && cell.style.font &&
                    (cell.style.font as PdfStandardFont).fontFamily) ? (cell.style.font as PdfStandardFont).fontFamily :
                    PdfFontFamily.Helvetica;
            textLink.font = new PdfStandardFont(fontFamily, fontSize);
            textLink.brush = new PdfSolidBrush(new PdfColor(51, 102, 187));
            cell.value = textLink;
        } else if (isHeader && ((pivotCell.axis === 'row' && !recordFontColorApplied)
            || (pivotCell.axis === 'column' && !headerFontColorApplied))) {
            cell.style.textBrush = new PdfSolidBrush(new PdfColor(102, 102, 102));
        } else if (!isHeader && !recordFontColorApplied && !isNullOrUndefined(pivotCell) && (isNullOrUndefined(pivotCell.style) ||
            (!isNullOrUndefined(pivotCell.style) && isNullOrUndefined(pivotCell.style.backgroundColor)))) {
            cell.style.textBrush = new PdfSolidBrush(new PdfColor(0, 0, 0));
        }
    }

    /**
     * Applies the default header background color to the provided PDF grid cell.
     *
     * @param {PdfGridCell} cell - The PDF grid cell to style.
     * @returns {void}
     * @hidden
     */
    public applyHeaderBackground(cell: PdfGridCell): void {
        const { r, g, b } = this.hexDecToRgb('#f5f5f5');
        cell.style.backgroundBrush = new PdfSolidBrush(new PdfColor(r, g, b));
    }

    /**
     * Converts a font family name string to its corresponding PdfFontFamily enumeration value.
     *
     * @param {string} family - The font family name to convert (e.g., 'TimesRoman', 'Courier', 'Symbol', 'ZapfDingbats').
     * @returns {number} - The PdfFontFamily enumeration value corresponding to the specified font family name.
     * @hidden
     */
    public getFontFamily(family: string): number {
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
}
