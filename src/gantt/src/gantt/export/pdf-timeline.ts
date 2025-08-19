import { PdfGantt } from './pdf-gantt';
import { PdfGanttCellStyle} from './../base/interface';
import {
    PointF, PdfPage, PdfGraphics, PdfColor, PdfPen, PdfBrush, PdfSolidBrush,
    PdfTrueTypeFont, PdfStandardFont, PdfStringFormat, PdfVerticalAlignment,
    PdfTextAlignment, PdfWordWrapType, PdfFontFamily, PdfBrushes, PdfGraphicsState, RectangleF,
    PdfFont,
    PdfFontStyle
} from '@syncfusion/ej2-pdf-export';
import { TimelineDetails, TimelineFormat, IGanttStyle, PdfQueryTimelineCellInfoEventArgs } from '../base/interface';
import { extend, isNullOrUndefined } from '@syncfusion/ej2-base';
import { pixelToPoint, pointToPixel } from '../base/utils';
import { Gantt } from '../base/gantt';
import { PdfPaddings } from './pdf-base';
import { HolidayModel } from '../models/holiday-model';
import { PdfBorders } from './../export/pdf-base/pdf-borders';
/**
 */
export class PdfTimeline {
    public parent: Gantt;
    private gantt: PdfGantt;
    public topTier: TimelineFormat[];
    public bottomTier: TimelineFormat[];
    public width: number;
    public height: number;
    public topTierCellWidth: number;
    public bottomTierCellWidth: number;
    public topTierHeight: number;
    public bottomTierHeight: number;
    private topTierPoint: PointF;
    private bottomTierPoint: PointF;
    private topTierIndex: number;
    private bottomTierIndex: number;
    private prevTopTierIndex: number;
    private prevBottomTierIndex: number;
    public holidayLabel: string;
    public holidayCompleted: boolean = false;
    public holidayNumberOfDays: number;
    public holidayWidth: number = 0;
    public detailsTimeline: TimelineDetails ;
    public fitHolidayCompleted: boolean = false;
    public fromDataHoliday: string| Date;
    public timelineWidth: number = 0;
    public lastWidth: number = 0;
    public fontFamily: PdfFontFamily;
    private topTierValueLeftPadding: number = 8;
    public pageIndex: number;
    public timelineHeight: number = 0;

    constructor(gantt?: PdfGantt) {
        this.width = 0;
        this.gantt = gantt;
        this.parent = gantt.parent;
        this.topTierPoint = new PointF();
        this.bottomTierPoint = new PointF();
        this.topTierIndex = 0;
        this.bottomTierIndex = 0;
        this.prevTopTierIndex = 0;
        this.prevBottomTierIndex = 0;
    }
    /**
     * @private
     * @param {PdfPage} page .
     * @param {PointF} startPoint .
     * @param {TimelineDetails} detail .
     * @param {number} pageIndex .
     * @returns {void}
     */
    public drawTimeline(page: PdfPage, startPoint: PointF, detail: TimelineDetails, pageIndex: number): void {
        this.detailsTimeline = detail;
        this.pageIndex = pageIndex;
        this.timelineHeight = this.gantt.layouter.headerHeight;
        let remainWidth: number = (this.parent.pdfExportModule.gantt.taskbar.isAutoFit()) ?
            pointToPixel(Math.floor(detail.totalWidth)) : Math.round(detail.totalWidth);
        let renderWidth: number = 0;
        this.topTierPoint.x = startPoint.x;
        this.topTierPoint.y = startPoint.y;
        this.prevTopTierIndex = this.topTierIndex;
        this.prevBottomTierIndex = this.bottomTierIndex;
        while (remainWidth > 0) {
            const pHeader: TimelineFormat = this.topTier[this.topTierIndex];
            if (this.topTier.length > this.topTierIndex) {
                let isCompleted: boolean = false;
                if (!this.topTier[this.topTierIndex].isFinished) {
                    if (remainWidth >= pHeader.width) {
                        renderWidth = pHeader.width;
                        pHeader.isFinished = true;
                        pHeader.completedWidth = renderWidth;
                        isCompleted = true;
                    } else {
                        renderWidth = remainWidth;
                        isCompleted = false;
                        pHeader.isFinished = false;
                        pHeader.width = pHeader.width - remainWidth;
                        pHeader.completedWidth = renderWidth;
                    }
                }
                //Primary header Event Arguments
                const reWidth: number = (this.parent.pdfExportModule.gantt.taskbar.isAutoFit()) ? renderWidth : pixelToPoint(renderWidth);
                /* eslint-disable-next-line */
                this.triggerQueryTimelinecell(page, this.topTierPoint.x, this.topTierPoint.y, this.topTierHeight, reWidth,
                                              pHeader.value, true, this.parent.timelineModule.isSingleTier &&
                                              this.parent.timelineSettings.topTier.unit === 'Day' ? pHeader.startDate : null);
                this.topTierPoint.x += reWidth;
                remainWidth -= renderWidth;
                if (isCompleted) {
                    this.topTierIndex++;
                }
            } else {
                remainWidth = 0;
            }
        }
        remainWidth = Math.round(detail.totalWidth);
        const height: number = this.parent.timelineModule.isSingleTier ? 0 : this.topTierHeight;
        this.bottomTierPoint = new PointF(startPoint.x, pixelToPoint(startPoint.y + height));
        while (remainWidth > 0) {
            const secondHeader: TimelineFormat = this.bottomTier[this.bottomTierIndex];
            if (this.bottomTier.length > this.bottomTierIndex) {
                let isCompleted: boolean = true;
                let width: number = secondHeader.width;
                if (remainWidth < width) {
                    width = remainWidth;
                    /* eslint-disable-next-line */
                    isCompleted = false;
                    secondHeader.completedWidth = width;
                }
                //Secondary header Event Arguments
                this.triggerQueryTimelinecell(page, this.bottomTierPoint.x, this.bottomTierPoint.y, this.bottomTierHeight,
                                              (this.parent.pdfExportModule.gantt.taskbar.isAutoFit()) ? width : pixelToPoint(width),
                                              secondHeader.value, false, secondHeader.startDate);
                this.bottomTierPoint.x = (this.parent.pdfExportModule.gantt.taskbar.isAutoFit()) ?
                    this.bottomTierPoint.x + width : this.bottomTierPoint.x + pixelToPoint(width);
                remainWidth -= width;
                secondHeader.completedWidth = width;
                // if (isCompleted) {
                this.bottomTierIndex++;
                // }
                if (remainWidth > 0 && remainWidth < width) {
                    remainWidth = secondHeader.width - 1;
                }
            } else {
                remainWidth = 0;
            }
        }
        this.timelineWidth = this.lastWidth;
    }

    /**
     *
     * @param {PdfPage} page .
     * @param {PointF} startPoint .
     * @param {TimelineDetails}  detail .
     * @returns {void} .
     * Draw the specific gantt chart side header when the taskbar exceeds the page
     * @private
     */
    /* eslint-disable-next-line */
    public drawPageTimeline(page: PdfPage, startPoint: PointF, detail: TimelineDetails,pageIndex:number): void {
        this.pageIndex = pageIndex;
        this.timelineHeight = 0;
        this.topTierPoint = extend({}, {}, startPoint, true) as PointF;
        for (let index: number = this.prevTopTierIndex; index <= this.topTierIndex; index++) {
            if (this.topTier.length > index) {
                const pHeader: TimelineFormat = this.topTier[index as number];
                if (pHeader.completedWidth > 0) {
                    //Primary header Event Arguments
                    /* eslint-disable-next-line */
                    this.triggerQueryTimelinecell(page, this.topTierPoint.x, this.topTierPoint.y, this.topTierHeight, (this.parent.pdfExportModule.gantt.taskbar.isAutoFit()) ? pHeader.completedWidth : pixelToPoint(pHeader.completedWidth) , pHeader.value,
                                                  true, this.parent.timelineModule.isSingleTier &&
                                                    this.parent.timelineSettings.topTier.unit === 'Day' ? pHeader.startDate : null);
                    this.topTierPoint.x += (this.parent.pdfExportModule.gantt.taskbar.isAutoFit()) ?
                        pHeader.completedWidth : pixelToPoint(pHeader.completedWidth);
                }
            }
        }
        this.bottomTierPoint.x = startPoint.x;
        this.bottomTierPoint.y = pixelToPoint(startPoint.y + this.topTierHeight);
        for (let index: number = this.prevBottomTierIndex; index <= this.bottomTierIndex; index++) {
            if (this.bottomTier.length > index) {
                const secondHeader: TimelineFormat = this.bottomTier[index as number];
                if (secondHeader.completedWidth > 0) {
                    //Secondary header Event Arguments
                    /* eslint-disable-next-line */
                    this.triggerQueryTimelinecell(page, this.bottomTierPoint.x, this.bottomTierPoint.y, this.bottomTierHeight,(this.parent.pdfExportModule.gantt.taskbar.isAutoFit()) ? secondHeader.width :pixelToPoint( secondHeader.width) , secondHeader.value, false,secondHeader.startDate);                    this.bottomTierPoint.x = (this.parent.pdfExportModule.gantt.taskbar.isAutoFit()) ?
                        this.bottomTierPoint.x + secondHeader.width : this.bottomTierPoint.x + pixelToPoint(secondHeader.width);
                }
            }
        }
    }
    /**
     * Method to trigger pdf query timelinecell event
     */
    /* eslint-disable-next-line */
    private triggerQueryTimelinecell(page: PdfPage, x: number, y: number, height: number, width: number, value: string, isTopTier: boolean, currentDate?:Date): void {
        const days: number = new Date(currentDate).getDay();
        const graphics: PdfGraphics = page.graphics;
        const timelineStyle: PdfGanttCellStyle = {};
        const ganttStyle: IGanttStyle = this.gantt.ganttStyle;
        timelineStyle.borderColor = new PdfColor(ganttStyle.timeline.borderColor);
        timelineStyle.fontColor = new PdfColor(ganttStyle.timeline.fontColor);
        timelineStyle.fontSize = ganttStyle.timeline.fontSize;
        timelineStyle.fontStyle = ganttStyle.timeline.fontStyle;
        timelineStyle.backgroundColor = new PdfColor(ganttStyle.timeline.backgroundColor);
        if (ganttStyle.timeline.padding) {
            timelineStyle.padding = ganttStyle.timeline.padding;
        }
        const format: PdfStringFormat = this.initializePdfStringFormat(ganttStyle, isTopTier);
        timelineStyle.format = format;
        const eventArgs: PdfQueryTimelineCellInfoEventArgs = {
            timelineCell: timelineStyle,
            value: value
        };
        if (this.parent.pdfQueryTimelineCellInfo) {
            this.parent.trigger('pdfQueryTimelineCellInfo', eventArgs);
        }
        const e: PdfGanttCellStyle = eventArgs.timelineCell;
        let cellBackgroundColor: PdfBrush = new PdfSolidBrush(eventArgs.timelineCell.backgroundColor);
        const nonWorkingDays: number[] = this.parent.nonWorkingDayIndex;
        let isHoliday : boolean = false;
        const holidayContainerColor: PdfSolidBrush = new PdfSolidBrush(ganttStyle.holiday.backgroundColor);
        if (this.parent.highlightWeekends && nonWorkingDays.indexOf(days) !== -1 && (this.parent.timelineModule.bottomTier === 'Day' || this.parent.timelineModule.bottomTier === 'None' && this.parent.timelineModule.topTier === 'Day')) {
            cellBackgroundColor = holidayContainerColor;
            isHoliday = true;
        }
        this.parent.holidays.map((item: HolidayModel) => {
            const fromDate: Date = new Date(item.from);
            const toDate: Date = new  Date(item.to);
            const timelinedate: Date  = new Date(currentDate);
            if (fromDate <= timelinedate && toDate >= timelinedate && (this.parent.timelineModule.bottomTier === 'Day' || (this.parent.timelineModule.bottomTier === 'None' && this.parent.timelineModule.topTier === 'Day'))) {
                cellBackgroundColor = holidayContainerColor;
                if (fromDate.getTime() === timelinedate.getTime()) {
                    this.holidayWidth = x;
                }
                if (toDate.getTime() === timelinedate.getTime()) {
                    this.holidayLabel = item.label;
                    const changeDate: Date  = new Date(item.to);
                    changeDate.setDate(changeDate.getDate() + 1);
                    const day: number = this.parent.dataOperation.getTaskWidth(fromDate, changeDate);
                    this.holidayNumberOfDays = pixelToPoint(day) / width;
                    this.holidayCompleted = true;
                }
                isHoliday = true;
            }
            else if (this.parent.timelineModule.bottomTier !== 'Day') {
                if (this.detailsTimeline.startDate <= fromDate && this.detailsTimeline.endDate >= fromDate) {
                    this.parent.timelineModule.bottomTierCollection.map((items: TimelineFormat) => {
                        if (items.startDate <= fromDate && items.endDate >= fromDate) {
                            if (items.startDate === currentDate) {
                                this.fitHolidayCompleted = true;
                                this.fromDataHoliday = item.from;
                                this.holidayLabel = item.label;
                            }
                        }
                    });
                }
            }
        });

        const timelineborder: any = isHoliday && ganttStyle.holiday && ganttStyle.holiday.borders
            ? ganttStyle.holiday.borders.left
            : isHoliday && ganttStyle.holiday && ganttStyle.holiday.borderColor
                ? new PdfPen(ganttStyle.holiday.borderColor)
                : new PdfPen(eventArgs.timelineCell.borderColor);
        if (!this.parent.pdfExportModule.gantt.taskbar.isAutoFit()) {
            this.lastWidth = x + width;
        }
        const adjustedWidth: number = isHoliday && (ganttStyle.holiday.borderColor || ganttStyle.holiday.borders) ? width - 2 : width;
        // rectangle for timeline header
        graphics.drawRectangle(timelineborder, cellBackgroundColor, x, y, adjustedWidth, pixelToPoint(height));
        const rectPen: PdfPen = (!isTopTier && (this.parent.gridLines === 'Both' || this.parent.gridLines === 'Vertical')) ?
            new PdfPen(ganttStyle.chartGridLineColor) : null;
        const gridLineColor: PdfPen = isHoliday && (ganttStyle.holiday.borderColor || ganttStyle.holiday.borders) ?
            timelineborder : rectPen;
        // rectangle for chart side timeline
        graphics.drawRectangle(gridLineColor, cellBackgroundColor, x, y + pixelToPoint(height), adjustedWidth,
                               this.gantt.layouter.pageHeightCollection[this.pageIndex].totalHeight - this.timelineHeight);
        let font1: PdfTrueTypeFont | PdfFont = new PdfStandardFont(ganttStyle.fontFamily, e.fontSize, e.fontStyle);
        if (ganttStyle.font) {
            font1 = ganttStyle.font;
        }
        const customizedFont: PdfFont = this.getPdfFont(ganttStyle);
        if (!isNullOrUndefined(customizedFont)) {
            font1 = customizedFont;
        }
        const fontColor: PdfSolidBrush = (ganttStyle.holiday && ganttStyle.holiday.fontColor) ?
            new PdfSolidBrush(ganttStyle.holiday.fontColor) : new PdfSolidBrush(new PdfColor(0, 0, 0));
        const fontBrush: PdfPen = (ganttStyle.holiday && ganttStyle.holiday.fontBrush) ?
            new PdfPen(new PdfColor(ganttStyle.holiday.fontBrush)) : null;
        let textFormat: PdfStringFormat = new PdfStringFormat();
        textFormat = (ganttStyle.holiday && ganttStyle.holiday.format) ? ganttStyle.holiday.format : null;
        let padding: any = { left: 0, right: 0, top: 0, bottom: 0 };
        if (!isNullOrUndefined(ganttStyle) && !isNullOrUndefined(ganttStyle.holiday) &&
            !isNullOrUndefined(ganttStyle.holiday.padding)) {
            padding = ganttStyle.holiday.padding;
        }
        let strSize: any;
        if (!isNullOrUndefined(this.holidayLabel)) {
            strSize = font1.measureString(this.holidayLabel);
        }
        if (this.holidayCompleted) {
            const renderHeight: number = ((this.gantt.layouter.pageHeightCollection[this.pageIndex].totalHeight - this.timelineHeight) / 2);
            const state: PdfGraphicsState = graphics.save();
            const fontHieght: number = font1.height;
            const fontSize: number = font1.size;
            graphics.translateTransform(this.holidayWidth + width - ((fontSize / 2) * this.holidayNumberOfDays) -
            fontHieght + (fontHieght / 2) + (width * this.holidayNumberOfDays) / 2, 40);
            graphics.rotateTransform(-90);
            graphics.translateTransform(-( renderHeight),
                                        -((this.holidayWidth + width + fontSize) / ((this.holidayWidth + width) / width)));
            if ((strSize.width + 10) < renderHeight) {
                graphics.drawString(
                    this.holidayLabel,
                    font1,
                    fontBrush,
                    fontColor,
                    5 - (padding.left + padding.right),
                    5 - (padding.top + padding.bottom),
                    strSize.width + 10, strSize.height + 10,
                    textFormat
                );
            }
            graphics.restore(state);
            this.holidayCompleted = false;
        }
        if (this.fitHolidayCompleted) {
            const renderHeight: number = ((this.gantt.layouter.pageHeightCollection[this.pageIndex].totalHeight - this.timelineHeight) / 2);
            const holidayBrush: PdfSolidBrush = holidayContainerColor;
            const fontSize: number = font1.size;
            graphics.drawRectangle(gridLineColor, holidayBrush, x + (width / 2) - fontSize, y +
            pixelToPoint(height), fontSize, renderHeight * 2);
            const state: PdfGraphicsState = graphics.save();
            graphics.translateTransform(x + width + (width / 2) - fontSize, 40);
            graphics.rotateTransform(-90);
            graphics.translateTransform(-(renderHeight),
                                        -((this.holidayWidth + width + fontSize) / ((this.holidayWidth + width) / width)));
            if ((strSize.width + 10) < renderHeight) {
                graphics.drawString(
                    this.holidayLabel,
                    font1,
                    fontBrush,
                    fontColor,
                    5 - (padding.left + padding.right),
                    5 - (padding.top + padding.bottom),
                    strSize.width + 10, strSize.height + 10,
                    textFormat
                );
            }
            graphics.restore(state);
            this.fitHolidayCompleted = false;
        }
        let font: PdfTrueTypeFont | PdfStandardFont = new PdfStandardFont(ganttStyle.fontFamily, e.fontSize, e.fontStyle);
        if (ganttStyle.font) {
            font = ganttStyle.font;
        }
        const textBrush: PdfBrush = new PdfSolidBrush(!isNullOrUndefined(ganttStyle.timeline.fontBrush)
            ? ganttStyle.timeline.fontBrush : eventArgs.timelineCell.fontColor);
        const pLeft: PdfPaddings | number = ganttStyle.timeline.padding ? eventArgs.timelineCell.padding.left : 0;
        const pTop: PdfPaddings | number = ganttStyle.timeline.padding ? eventArgs.timelineCell.padding.top : 0;
        /* eslint-disable-next-line */
        let state = graphics.save();
        graphics.setClip(new RectangleF(x, y, width, pixelToPoint(height)));
        if (isTopTier) {
            x = x + pLeft + this.topTierValueLeftPadding;
        } else {
            x = x + pLeft;
        }
        graphics.drawString(eventArgs.value, font, null, textBrush, x, y + pTop, pixelToPoint(width), pixelToPoint(height), e.format);
        graphics.restore(state);
    }
    /**
     * Initializes and returns a PdfStringFormat based on the provided Gantt style and tier level.
     *
     * @param {IGanttStyle} ganttStyle - The style settings for the Gantt chart which include the timeline format.
     * @param {boolean} isTopTier - A flag indicating whether the format is for the top tier of the timeline.
     * @returns {PdfStringFormat} The initialized PdfStringFormat with appropriate line alignment, text alignment,
     * and word wrap type, as determined by the ganttStyle and isTopTier flag.
     */
    private initializePdfStringFormat(ganttStyle: IGanttStyle, isTopTier: boolean): PdfStringFormat {
        let format: PdfStringFormat = new PdfStringFormat();
        if (isNullOrUndefined(ganttStyle.timeline.format)) {
            if (isTopTier) {
                format.lineAlignment = PdfVerticalAlignment.Middle;
                format.alignment = PdfTextAlignment.Left;
            } else {
                format.lineAlignment = PdfVerticalAlignment.Middle;
                format.alignment = PdfTextAlignment.Center;
                format.wordWrap = PdfWordWrapType.Character;
            }
        } else {
            format = ganttStyle.timeline.format;
        }
        return format;
    }
    private getPdfFont(ganttStyle: IGanttStyle): PdfFont {
        let font: PdfFont;
        if (ganttStyle && ganttStyle.holiday && (ganttStyle.holiday.fontSize || ganttStyle.holiday.fontStyle ||
            ganttStyle.holiday.fontFamily)) {
            const fontSize: number = ganttStyle.holiday.fontSize ? ganttStyle.holiday.fontSize : 9;
            const fontFamily: PdfFontFamily = ganttStyle.holiday.fontFamily ?
                ganttStyle.holiday.fontFamily : this.fontFamily;
            const fontStyle: PdfFontStyle = ganttStyle.holiday.fontStyle ?
                ganttStyle.holiday.fontStyle : PdfFontStyle.Regular;
            font = new PdfStandardFont(fontFamily, fontSize, fontStyle);
        }
        return font;
    }
}
