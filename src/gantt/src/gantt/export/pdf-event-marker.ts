import {
    PointF, PdfColor, PdfPage, PdfGraphics, PdfPen, PdfBrush, PdfSolidBrush,
    SizeF, PdfFont, PdfStandardFont, PdfFontFamily, PdfStringFormat,
    PdfTextAlignment, PdfFontStyle
} from '@syncfusion/ej2-pdf-export';
import { TimelineDetails, IEventMarkerInfo, IGanttStyle } from './../base/interface';
import { Gantt } from '../base/gantt';
import { pixelToPoint } from '../base/utils';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { PdfBorders } from './../export/pdf-base/pdf-borders';

export class EventMarker {
    public parent: Gantt;
    public renderHeight: number = 0;
    constructor(parent?: Gantt) {
        this.parent = parent;
    }
    public fontFamily: PdfFontFamily;
    public progressFontColor: PdfColor;
    public drawEventMarker(page: PdfPage, startPoint: PointF, cumulativeWidth: number, detail: TimelineDetails,
                           eventMarker: IEventMarkerInfo, cumulativeHeight: number, ganttStyles: IGanttStyle): void {
        const taskGraphics: PdfGraphics = page.graphics;
        const pageSize: SizeF = page.getClientSize();
        let font: PdfFont = new PdfStandardFont(PdfFontFamily.Helvetica, 10);
        if (!isNullOrUndefined(this.parent.pdfExportModule['helper']['exportProps'].ganttStyle) &&
            this.parent.pdfExportModule['helper']['exportProps'].ganttStyle.font) {
            font = this.parent.pdfExportModule['helper']['exportProps'].ganttStyle.font;
        }
        /* eslint-disable-next-line */
        let strSize: any;
        if (!isNullOrUndefined(eventMarker.label)) {
            strSize = font.measureString(eventMarker.label);
        }

        const triangle: number = 8;
        const eventLine: PdfPen = ganttStyles.eventMarker.lineStyle;
        eventLine.dashStyle = ganttStyles.eventMarker.lineStyle.dashStyle;
        if (detail.startDate <= eventMarker.date && eventMarker.date <= detail.endDate) {
            const enventFormat: PdfStringFormat = new PdfStringFormat();
            enventFormat.alignment = PdfTextAlignment.Center;
            const textFormat: PdfStringFormat = !isNullOrUndefined(ganttStyles.eventMarker.label.format) ?
                ganttStyles.eventMarker.label.format : enventFormat;
            const eventBrush: PdfBrush = new PdfSolidBrush(ganttStyles.eventMarker.label.backgroundColor);
            const fontColor: PdfSolidBrush = (ganttStyles.eventMarker.label && ganttStyles.eventMarker.label.fontColor) ?
                new PdfSolidBrush(ganttStyles.eventMarker.label.fontColor) : null;
            let customizedFont: PdfFont = this.getPdfFont(ganttStyles);
            if (isNullOrUndefined(customizedFont)) {
                customizedFont = font;
            }
            let defaultBorder: PdfBorders = ganttStyles.eventMarker.label.borders ? ganttStyles.eventMarker.label.borders : null;
            if (ganttStyles.eventMarker.label.borderColor) {
                const pdfborders: PdfBorders = new PdfBorders();
                pdfborders.all = new PdfPen(new PdfColor(ganttStyles.eventMarker.label.borderColor));
                defaultBorder = pdfborders;
            }
            const border: any = (!isNullOrUndefined(defaultBorder) && !isNullOrUndefined(defaultBorder.left)) ? defaultBorder.left : null;
            let padding: any = { left: 0, right: 0, top: 0, bottom: 0 };
            if (!isNullOrUndefined(ganttStyles) && !isNullOrUndefined(ganttStyles.eventMarker) &&
                !isNullOrUndefined(ganttStyles.eventMarker.label) && !isNullOrUndefined(ganttStyles.eventMarker.label.padding)) {
                padding = ganttStyles.eventMarker.label.padding;
            }
            const customizedFontBrush: PdfPen = !isNullOrUndefined(ganttStyles.eventMarker.label.fontBrush) ?
                new PdfPen(ganttStyles.eventMarker.label.fontBrush) : null;
            const left: number = this.parent.dataOperation.getTaskLeft(
                this.parent.dateValidationModule.getDateFromFormat(eventMarker.date, true),
                false, this.parent.defaultCalendarContext, true
            );
            const diff: number = 10;
            if (this.parent.pdfExportModule.gantt.taskbar.isAutoFit()) {
                taskGraphics.drawLine(eventLine, new PointF(startPoint.x + (left - cumulativeWidth) + diff, cumulativeHeight),
                                      new PointF(startPoint.x + (left - cumulativeWidth) + diff, this.renderHeight));
                if (!isNullOrUndefined(eventMarker.label) && eventMarker.label.length > 0) {
                    const renderBox: number = cumulativeHeight + pixelToPoint(parseFloat(eventMarker.top)) + (strSize.height * 2);
                    if (renderBox < this.renderHeight) {
                        taskGraphics.save();
                        taskGraphics.translateTransform(
                            startPoint.x + (left - cumulativeWidth) + 7 + diff, cumulativeHeight +
                            pixelToPoint(parseFloat(eventMarker.top)) + strSize.height / 2);
                        taskGraphics.rotateTransform(45);
                        taskGraphics.drawRectangle(border, eventBrush, 0, 0, triangle, triangle);
                        taskGraphics.restore();
                        taskGraphics.drawRectangle(
                            border, eventBrush, startPoint.x + (left - cumulativeWidth) + 7 + diff,
                            cumulativeHeight + pixelToPoint(parseFloat(eventMarker.top)),
                            strSize.width + 10, strSize.height * 2);
                        taskGraphics.drawString(
                            eventMarker.label, customizedFont, customizedFontBrush, fontColor, (startPoint.x +
                                (left - cumulativeWidth) + 12 + diff) - (padding.left + padding.right),
                            (cumulativeHeight + pixelToPoint(parseFloat(eventMarker.top)) +
                            pixelToPoint(strSize.height / 2)) - (padding.top + padding.bottom),
                            strSize.width, strSize.height, textFormat);
                    }
                }
            }
            else {
                taskGraphics.drawLine(
                    eventLine, new PointF(startPoint.x + pixelToPoint(left - cumulativeWidth) + diff, cumulativeHeight),
                    new PointF(startPoint.x + pixelToPoint(left - cumulativeWidth) + diff, this.renderHeight));
                if (!isNullOrUndefined(eventMarker.label) && eventMarker.label.length > 0) {
                    const renderBox: number = cumulativeHeight + pixelToPoint(parseFloat(eventMarker.top)) + (strSize.height * 2);
                    if (renderBox < this.renderHeight) {
                        taskGraphics.save();
                        taskGraphics.translateTransform(
                            startPoint.x + pixelToPoint(left - cumulativeWidth) + 7 + diff,
                            cumulativeHeight + pixelToPoint(parseFloat(eventMarker.top)) + strSize.height / 2);
                        taskGraphics.rotateTransform(45);
                        taskGraphics.drawRectangle(border, eventBrush, 0, 0, triangle, triangle);
                        taskGraphics.restore();
                        taskGraphics.drawRectangle(
                            border, eventBrush, startPoint.x + pixelToPoint(left - cumulativeWidth) + 7 + diff,
                            cumulativeHeight + pixelToPoint(parseFloat(eventMarker.top)), strSize.width + 10, strSize.height * 2);
                        taskGraphics.drawString(
                            eventMarker.label, customizedFont, customizedFontBrush, fontColor,
                            (startPoint.x + pixelToPoint(left - cumulativeWidth) + 12 + diff) - (padding.left + padding.right),
                            (cumulativeHeight + pixelToPoint(parseFloat(eventMarker.top) + 1) +
                            pixelToPoint(strSize.height / 2)) - (padding.top + padding.bottom),
                            strSize.width, strSize.height, textFormat);
                    }
                }
            }
        }
    }
    private getPdfFont(ganttStyle: IGanttStyle): PdfFont {
        let font: PdfFont;
        if (ganttStyle && ganttStyle.eventMarker && ganttStyle.eventMarker.label &&
            (ganttStyle.eventMarker.label.fontSize || ganttStyle.eventMarker.label.fontStyle ||
            ganttStyle.eventMarker.label.fontFamily)) {
            const fontSize: number = ganttStyle.eventMarker.label.fontSize ? ganttStyle.eventMarker.label.fontSize : 9;
            const fontFamily: PdfFontFamily = ganttStyle.eventMarker.label.fontFamily ?
                ganttStyle.eventMarker.label.fontFamily : this.fontFamily;
            const fontStyle: PdfFontStyle = ganttStyle.eventMarker.label.fontStyle ?
                ganttStyle.eventMarker.label.fontStyle : PdfFontStyle.Regular;
            font = new PdfStandardFont(fontFamily, fontSize, fontStyle);
        }
        return font;
    }
}
