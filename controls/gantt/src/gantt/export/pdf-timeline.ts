import { PdfGantt } from './pdf-gantt';
import { PdfGanttCellStyle} from './../base/interface';
import {
    PointF, PdfPage, PdfGraphics, PdfColor, PdfPen, PdfBrush, PdfSolidBrush,
    PdfTrueTypeFont, PdfStandardFont, PdfStringFormat, PdfVerticalAlignment,
    PdfTextAlignment, PdfWordWrapType, PdfFontFamily, PdfBrushes, PdfGraphicsState, RectangleF
} from '@syncfusion/ej2-pdf-export';
import { TimelineDetails, TimelineFormat, IGanttStyle, PdfQueryTimelineCellInfoEventArgs } from '../base/interface';
import { extend, isNullOrUndefined } from '@syncfusion/ej2-base';
import { pixelToPoint, pointToPixel } from '../base/utils';
import { Gantt } from '../base/gantt';
import { PdfPaddings } from './pdf-base';
import { HolidayModel } from '../models/holiday-model';
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
    public holidayWidth: number;
    public detailsTimeline: TimelineDetails ;
    public fitHolidayCompleted: boolean = false;
    public fromDataHoliday: string| Date;
    public timelineWidth: number = 0;
    public lastWidth: number = 0;

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
     * @returns {void}
     */
    public drawTimeline(page: PdfPage, startPoint: PointF, detail: TimelineDetails): void {
        this.detailsTimeline = detail;
        let remainWidth: number = (this.parent.pdfExportModule.gantt.taskbar.isAutoFit()) ?
            pointToPixel(Math.floor(detail.totalWidth)) : Math.floor(detail.totalWidth);
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
                /* eslint-disable-next-line */
                this.triggerQueryTimelinecell(page, this.topTierPoint.x, this.topTierPoint.y, this.topTierHeight, renderWidth, pHeader.value, true,this.parent.timelineModule.isSingleTier && this.parent.timelineSettings.topTier.unit === 'Day' ? pHeader.startDate : null);
                this.topTierPoint.x += (this.parent.pdfExportModule.gantt.taskbar.isAutoFit()) ? renderWidth : pixelToPoint(renderWidth);
                remainWidth -= renderWidth;
                if (isCompleted) {
                    this.topTierIndex++;
                }
            } else {
                remainWidth = 0;
            }
        }
        remainWidth = Math.floor(detail.totalWidth);
        const height: number = this.parent.timelineModule.isSingleTier ? 0 : this.topTierHeight;
        this.bottomTierPoint = new PointF(startPoint.x, pixelToPoint(startPoint.y + height));
        while (remainWidth > 0) {
            const secondHeader: TimelineFormat = this.bottomTier[this.bottomTierIndex];
            if (this.bottomTier.length > this.bottomTierIndex) {
                let isCompleted: boolean = true;
                let width: number = secondHeader.width;
                if (remainWidth < width) {
                    width = remainWidth;
                    isCompleted = false;
                    secondHeader.completedWidth = width;
                }
                //Secondary header Event Arguments
                this.triggerQueryTimelinecell(page, this.bottomTierPoint.x, this.bottomTierPoint.y, this.bottomTierHeight, width,
                                              secondHeader.value, false, secondHeader.startDate);
                this.bottomTierPoint.x = (this.parent.pdfExportModule.gantt.taskbar.isAutoFit()) ?
                    this.bottomTierPoint.x + width : this.bottomTierPoint.x + pixelToPoint(width);
                remainWidth -= width;
                secondHeader.completedWidth = width;
                if (isCompleted) {
                    this.bottomTierIndex++;
                }
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
    public drawPageTimeline(page: PdfPage, startPoint: PointF, detail: TimelineDetails): void {
        this.topTierPoint = extend({}, {}, startPoint, true) as PointF;
        for (let index: number = this.prevTopTierIndex; index <= this.topTierIndex; index++) {
            if (this.topTier.length > index) {
                const pHeader: TimelineFormat = this.topTier[index as number];
                if (pHeader.completedWidth > 0) {
                    //Primary header Event Arguments
                    /* eslint-disable-next-line */
                    this.triggerQueryTimelinecell(page, this.topTierPoint.x, this.topTierPoint.y, this.topTierHeight, pHeader.completedWidth, pHeader.value,
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
                    this.triggerQueryTimelinecell(page, this.bottomTierPoint.x, this.bottomTierPoint.y, this.bottomTierHeight, secondHeader.width, secondHeader.value, false,secondHeader.startDate);
                    this.bottomTierPoint.x = (this.parent.pdfExportModule.gantt.taskbar.isAutoFit()) ?
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
        timelineStyle.format = format;
        const eventArgs: PdfQueryTimelineCellInfoEventArgs = {
            timelineCell: timelineStyle,
            value: value
        };
        if (this.parent.pdfQueryTimelineCellInfo) {
            this.parent.trigger('pdfQueryTimelineCellInfo', eventArgs);
        }
        const e: PdfGanttCellStyle = eventArgs.timelineCell;
        let rectPen: PdfPen;
        let rectBrush: PdfBrush = new PdfSolidBrush(eventArgs.timelineCell.backgroundColor);
        const nonWorkingDays: number[] = this.parent.nonWorkingDayIndex;
        if (this.parent.highlightWeekends && nonWorkingDays.indexOf(days) !== -1 && (this.parent.timelineModule.bottomTier === 'Day' || this.parent.timelineModule.bottomTier === 'None' && this.parent.timelineModule.topTier === 'Day')) {
            rectBrush = new PdfSolidBrush(new PdfColor(238, 238, 238));
        }
        this.parent.holidays.map((item: HolidayModel) => {
            const fromDate: Date = new Date(item.from);
            const toDate: Date = new  Date(item.to);
            const timelinedate: Date  = new Date(currentDate);
            if (fromDate <= timelinedate && toDate >= timelinedate && (this.parent.timelineModule.bottomTier === 'Day' || (this.parent.timelineModule.bottomTier === 'None' && this.parent.timelineModule.topTier === 'Day'))) {
                rectBrush = new PdfSolidBrush(new PdfColor(238, 238, 238));
                if (fromDate.getTime() === timelinedate.getTime()) {
                    this.holidayWidth = x;
                }
                if (toDate.getTime() === timelinedate.getTime()) {
                    this.holidayLabel = item.label;
                    const changeDate: Date  = new Date(item.to);
                    changeDate.setDate(changeDate.getDate() + 1);
                    const day: number = this.parent.dataOperation.getTaskWidth(fromDate, changeDate);
                    this.holidayNumberOfDays = day / width;
                    this.holidayCompleted = true;
                }
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
        const rectPen1: PdfPen = new PdfPen(eventArgs.timelineCell.borderColor);
        if (!this.parent.pdfExportModule.gantt.taskbar.isAutoFit()) {
            this.lastWidth = x + width;
        }
        graphics.drawRectangle(rectPen1, rectBrush, x, y, width, pixelToPoint(height));
        if (!isTopTier && (this.parent.gridLines === 'Both' || this.parent.gridLines === 'Vertical')) {
            rectPen = new PdfPen(eventArgs.timelineCell.borderColor);
        }
        else{
            rectPen = null;
        }
        graphics.drawRectangle(rectPen, rectBrush, x, y + pixelToPoint(height), width, page.getClientSize().height);
        if (this.holidayCompleted) {
            const state: PdfGraphicsState = graphics.save();
            const font1: PdfStandardFont = new PdfStandardFont(PdfFontFamily.Helvetica, 10);
            const fontHieght: number = font1.height;
            const fontSize: number = font1.size;
            graphics.translateTransform(this.holidayWidth + width - ((fontSize / 2) * this.holidayNumberOfDays) -
            fontHieght + (fontHieght / 2) + (width * this.holidayNumberOfDays) / 2, 40);
            graphics.rotateTransform(-90);
            graphics.translateTransform(-(page.getClientSize().height / 2), -40);
            graphics.drawString(
                this.holidayLabel,
                font1,
                null,
                PdfBrushes.Black,
                10,
                10,
                null
            );
            graphics.restore(state);
            this.holidayCompleted = false;
        }
        if (this.fitHolidayCompleted) {
            const  holidayBrush: PdfSolidBrush = new PdfSolidBrush(new PdfColor(238, 238, 238));
            const font1: PdfStandardFont = new PdfStandardFont(PdfFontFamily.Helvetica, 10);
            const fontSize: number = font1.size;
            graphics.drawRectangle(null, holidayBrush, x + (width / 2) - fontSize, y +
            pixelToPoint(height), fontSize, page.getClientSize().height);
            const state: PdfGraphicsState = graphics.save();
            graphics.translateTransform(x + width + (width / 2) - fontSize, 40);
            graphics.rotateTransform(-90);
            graphics.translateTransform(-(page.getClientSize().height / 2), -40);
            graphics.drawString(
                this.holidayLabel,
                font1,
                null,
                PdfBrushes.Black,
                10,
                10,
                null
            );
            graphics.restore(state);
            this.fitHolidayCompleted = false;
        }
        let font: PdfTrueTypeFont | PdfStandardFont = new PdfStandardFont(ganttStyle.fontFamily, e.fontSize, e.fontStyle);
        if (ganttStyle.font) {
            font = ganttStyle.font;
        }        const textBrush: PdfBrush = new PdfSolidBrush(eventArgs.timelineCell.fontColor);
        const pLeft: PdfPaddings | number = ganttStyle.timeline.padding ? eventArgs.timelineCell.padding.left : 0;
        const pTop: PdfPaddings | number = ganttStyle.timeline.padding ? eventArgs.timelineCell.padding.top : 0;
        /* eslint-disable-next-line */
        let state = graphics.save();
        graphics.setClip(new RectangleF(x, y, width, pixelToPoint(height)));
        if (isTopTier) {
            x = x + pLeft + 4;
        } else {
            x = x + pLeft;
        }
        graphics.drawString(eventArgs.value, font, null, textBrush, x, y + pTop, pixelToPoint(width), pixelToPoint(height), e.format);
        graphics.restore(state);
    }
}
