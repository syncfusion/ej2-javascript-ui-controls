import { PdfGantt } from './pdf-gantt';
import { PdfGanttCellStyle} from './../base/interface';
import {
    PointF, PdfPage, PdfGraphics, PdfColor, PdfPen, PdfBrush, PdfSolidBrush,
    PdfTrueTypeFont, PdfStandardFont, PdfStringFormat, PdfVerticalAlignment,
    PdfTextAlignment, PdfWordWrapType
} from '@syncfusion/ej2-pdf-export';
import { TimelineDetails, TimelineFormat, IGanttStyle, PdfQueryTimelineCellInfoEventArgs } from '../base/interface';
import { extend, isNullOrUndefined } from '@syncfusion/ej2-base';
import { pixelToPoint } from '../base/utils';
import { Gantt } from '../base/gantt';
import { PdfPaddings } from './pdf-base';

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
        let remainWidth: number = Math.floor(detail.totalWidth);
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
                this.triggerQueryTimelinecell(page, this.topTierPoint.x, this.topTierPoint.y, this.topTierHeight, renderWidth, pHeader.value, true);
                this.topTierPoint.x += pixelToPoint(renderWidth);
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
                /* eslint-disable-next-line */
                this.triggerQueryTimelinecell(page, this.bottomTierPoint.x, this.bottomTierPoint.y, this.bottomTierHeight, width, secondHeader.value, false);
                this.bottomTierPoint.x = this.bottomTierPoint.x + pixelToPoint(width);
                remainWidth -= width;
                secondHeader.completedWidth = width;
                if (isCompleted) {
                    this.bottomTierIndex++;
                }
            } else {
                remainWidth = 0;
            }
        }
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
                    this.triggerQueryTimelinecell(page, this.topTierPoint.x, this.topTierPoint.y, this.topTierHeight, pHeader.completedWidth, pHeader.value, true);
                    this.topTierPoint.x += pixelToPoint(pHeader.completedWidth);
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
                    this.triggerQueryTimelinecell(page, this.bottomTierPoint.x, this.bottomTierPoint.y, this.bottomTierHeight, secondHeader.width, secondHeader.value, false);
                    this.bottomTierPoint.x = this.bottomTierPoint.x + pixelToPoint(secondHeader.width);
                }
            }
        }
    }
    /**
     * Method to trigger pdf query timelinecell event
     */
    /* eslint-disable-next-line */
    private triggerQueryTimelinecell(page: PdfPage, x: number, y: number, height: number, width: number, value: string, isTopTier: boolean): void {
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
        const rectPen: PdfPen = new PdfPen(eventArgs.timelineCell.borderColor);
        const rectBrush: PdfBrush = new PdfSolidBrush(eventArgs.timelineCell.backgroundColor);
        graphics.drawRectangle(rectPen, rectBrush, x, y, pixelToPoint(width), pixelToPoint(height));
        let font: PdfTrueTypeFont | PdfStandardFont = new PdfStandardFont(ganttStyle.fontFamily, e.fontSize, e.fontStyle);
        if (ganttStyle.font) {
            font = ganttStyle.font;
        }        const textBrush: PdfBrush = new PdfSolidBrush(eventArgs.timelineCell.fontColor);
        const pLeft: PdfPaddings | number = ganttStyle.timeline.padding ? eventArgs.timelineCell.padding.left : 0;
        const pTop: PdfPaddings | number = ganttStyle.timeline.padding ? eventArgs.timelineCell.padding.top : 0;
        /* eslint-disable-next-line */
        graphics.drawString(eventArgs.value, font, null, textBrush, x + pLeft, y + pTop, pixelToPoint(width), pixelToPoint(height), e.format);
    }
}
