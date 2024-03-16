import {
    PointF, PdfColor, PdfStringLayouter, PdfStringLayoutResult, PdfPage, PdfSection, PdfGraphics, PdfPen, PdfBrush, PdfSolidBrush,
    RectangleF, SizeF, PdfFont, PdfStandardFont, PdfFontStyle, PdfFontFamily, PdfStringFormat, PdfVerticalAlignment,
    PdfTextAlignment, PdfWordWrapType, PdfDashStyle, PdfBrushes
} from '@syncfusion/ej2-pdf-export';
import { TimelineDetails, TaskLabel, IEventMarkerInfo } from './../base/interface';
import { Gantt } from '../base/gantt';
import { pixelToPoint, pointToPixel } from '../base/utils';
import { isNullOrUndefined } from '@syncfusion/ej2-base';

export class EventMarker {
    public parent: Gantt;
    constructor(parent?: Gantt) {
        this.parent = parent;
    }
    public fontFamily: PdfFontFamily;
    public progressFontColor: PdfColor;
    public drawEventMarker(page: PdfPage, startPoint: PointF, cumulativeWidth: number, detail: TimelineDetails, eventMarker: IEventMarkerInfo, cumulativeHeight: number): void {
        let taskGraphics: PdfGraphics = page.graphics;
        const pageSize: SizeF = page.getClientSize();
        let font: PdfFont = new PdfStandardFont(PdfFontFamily.Helvetica, 10);
        if (!isNullOrUndefined(this.parent.pdfExportModule['helper']['exportProps'].ganttStyle) &&
            this.parent.pdfExportModule['helper']['exportProps'].ganttStyle.font) {
            font = this.parent.pdfExportModule['helper']['exportProps'].ganttStyle.font;
        }
        let strSize
        if (!isNullOrUndefined(eventMarker.label)) {
            strSize = font.measureString(eventMarker.label);
        }

        const triangle: number = 8;
        const eventLine: PdfPen = new PdfPen(new PdfColor(0, 0, 0))
        eventLine.dashStyle = PdfDashStyle.Dash;
        if (detail.startDate <= eventMarker.date && eventMarker.date <= detail.endDate) {
            const enventFormat: PdfStringFormat = new PdfStringFormat();
            enventFormat.alignment = PdfTextAlignment.Center;
            const eventBrush: PdfBrush = new PdfSolidBrush(new PdfColor(253, 191, 100));
            let left: number = this.parent.dataOperation.getTaskLeft(
                this.parent.dateValidationModule.getDateFromFormat(eventMarker.date, true), false, true);
            let diff: number = 10;
            if (this.parent.pdfExportModule.gantt.taskbar.isAutoFit()) {
                taskGraphics.drawLine(eventLine, new PointF(startPoint.x + (left - cumulativeWidth) + diff, cumulativeHeight), new PointF(startPoint.x + (left - cumulativeWidth) + diff, pageSize.height));
                if (!isNullOrUndefined(eventMarker.label) && eventMarker.label.length > 0){
                    taskGraphics.save();
                    taskGraphics.translateTransform(startPoint.x + (left - cumulativeWidth) + 7 + diff, cumulativeHeight + pixelToPoint(50) + strSize.height / 2)
                    taskGraphics.rotateTransform(45);
                    taskGraphics.drawRectangle(null, eventBrush, 0, 0, triangle, triangle);
                    taskGraphics.restore();
                    taskGraphics.drawRectangle(null, eventBrush, startPoint.x + (left - cumulativeWidth) + 7 + diff, cumulativeHeight + pixelToPoint(50), strSize.width + 10, strSize.height * 2);
                    taskGraphics.drawString(eventMarker.label, font, null, PdfBrushes.Black, startPoint.x + (left - cumulativeWidth) + 12 + diff, cumulativeHeight + pixelToPoint(50) + pixelToPoint(strSize.height / 2), strSize.width, strSize.height, enventFormat);

                }
            }
            else {
                taskGraphics.drawLine(eventLine, new PointF(startPoint.x + pixelToPoint(left - cumulativeWidth) + diff, cumulativeHeight), new PointF(startPoint.x + pixelToPoint(left - cumulativeWidth) + diff, pageSize.height));
                if (!isNullOrUndefined(eventMarker.label) && eventMarker.label.length > 0) {
                    taskGraphics.save();
                    taskGraphics.translateTransform(startPoint.x + pixelToPoint(left - cumulativeWidth) + 7 + diff, cumulativeHeight + pixelToPoint(50) + strSize.height / 2)
                    taskGraphics.rotateTransform(45);
                    taskGraphics.drawRectangle(null, eventBrush, 0, 0, triangle, triangle);
                    taskGraphics.restore();
                    taskGraphics.drawRectangle(null, eventBrush, startPoint.x + pixelToPoint(left - cumulativeWidth) + 7 + diff, cumulativeHeight + pixelToPoint(50), strSize.width + 10, strSize.height * 2);
                    taskGraphics.drawString(eventMarker.label, font, null, PdfBrushes.Black, startPoint.x + pixelToPoint(left - cumulativeWidth) + 12 + diff, cumulativeHeight + pixelToPoint(50) + pixelToPoint(strSize.height / 2), strSize.width, strSize.height, enventFormat);
                }
            }
        }
    }
}
