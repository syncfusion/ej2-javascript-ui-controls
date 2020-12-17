import {
    PointF, PdfColor, PdfStringLayouter, PdfStringLayoutResult, PdfPage, PdfSection, PdfGraphics, PdfPen, PdfBrush, PdfSolidBrush,
    RectangleF, SizeF, PdfFont, PdfStandardFont, PdfFontStyle, PdfFontFamily, PdfStringFormat, PdfVerticalAlignment,
    PdfTextAlignment, PdfWordWrapType
} from '@syncfusion/ej2-pdf-export';
import { TimelineDetails, TaskLabel } from './../base/interface';
import { Gantt } from '../base/gantt';
import { pixelToPoint } from '../base/utils';
import { isNullOrUndefined } from '@syncfusion/ej2-base';

/**
 * @hidden
 */
export class PdfGanttTaskbarCollection {
    public endDate?: Date;
    /** Defines the duration of task. */
    public duration?: number;
    /** Defines the duration unit of task. */
    public durationUnit?: string;
    /** Defines the task is auto schedule-able or not. */
    public isAutoSchedule?: boolean;
    /** Defines the task is milestone or not. */
    public isMilestone?: boolean;
    /** Defines the left of task.
     * @hidden
     */
    public left?: number;
    /** Defines the progress of task. */
    public progress?: number;
    /** Defines the progress width of task. */
    public progressWidth?: number;
    /** Defines the start date of task. */
    public startDate?: Date;
    /** Defines the id of task. */
    public taskId?: string;
    /** Defines the parent id of task. */
    public parentId?: string;
    /** Defines the name of task. */
    public taskName?: string;
    /** Defines the width of task. */
    public width?: number;
    /** Defines the unique id of task. */
    public uniqueID?: string;
    /** Defines the total progress of task. */
    public totalProgress?: number;
    /** Defines the total duration of task. */
    public totalDuration?: number;
    /**
     * @private
     */
    public unscheduledTaskBy?: string;
    /**
     * @private
     */
    public unscheduleStarteDate?: Date;
    /**
     * @private
     */
    public unscheduleEndDate?: Date;
    public isParentTask?: boolean;
    public isScheduledTask?: boolean;
    public height: number;
    public fontFamily: PdfFontFamily;
    public gridLineColor: PdfColor;
    public progressFontColor: PdfColor;
    public taskColor: PdfColor;
    public labelColor: PdfColor;
    public taskBorderColor: PdfColor;
    public progressColor: PdfColor;
    public milestoneColor: PdfColor;
    public taskbar: PdfGanttTaskbarCollection[];
    public parent: Gantt;
    public isCompleted: boolean;
    /**
     * @private
     */
    public leftTaskLabel: TaskLabel = {};
    /**
     * @private
     */
    public rightTaskLabel: TaskLabel = {};
    public startPage: number = -1;
    public endPage: number = -1;
    public isStartPoint: boolean;
    public taskStartPoint: PointF;
    public add(): PdfGanttTaskbarCollection {
        return new PdfGanttTaskbarCollection(this.parent);
    }
    constructor(parent?: Gantt) {
        this.parent = parent;
    }
    /**
     * Get the next PDF page
     */
    private GetNextPage(page: PdfPage): PdfPage {
        let section: PdfSection = page.section;
        let nextPage: PdfPage = null;
        let index: number = section.indexOf(page);
        if (index === section.count - 1) {
            nextPage = (section.add() as PdfPage);
        } else {
            nextPage = (section.getPages()[index + 1] as PdfPage);
        }
        return nextPage;
    }
    /**
     * Draw the taskbar, chart back ground
     * @private
     */
    /* tslint:disable */
    public drawTaskbar(page: PdfPage, startPoint: PointF, detail: TimelineDetails, cumulativeWidth: number, rowHeight: number, taskbar: PdfGanttTaskbarCollection): boolean {
        let taskGraphics: PdfGraphics = page.graphics;
        let isNextPage: boolean = false;
        let pageSize: SizeF = page.getClientSize();
        let yPoint: number = startPoint.y + rowHeight;
        //code for while current pdf page is exceed 
        if (yPoint > pageSize.height) {
            page = this.GetNextPage(page);
            taskGraphics = page.graphics;
            startPoint.y = 0;
            if (this.parent.pdfExportModule.gantt.enableHeader) {
                this.parent.pdfExportModule.gantt.chartHeader.drawPageTimeline(page, startPoint, detail);
                startPoint.y = pixelToPoint(this.parent.timelineModule.isSingleTier ? 45 : 60);
            }
            isNextPage = true;
        }
        this.drawLeftLabel(page, startPoint, detail, cumulativeWidth);
        //Draw Taskbar
        let font: PdfFont = new PdfStandardFont(this.fontFamily, 9, PdfFontStyle.Regular);
        let fontColor: PdfPen = null;
        let fontBrush: PdfBrush = new PdfSolidBrush(this.progressFontColor);
        let progressFormat: PdfStringFormat = new PdfStringFormat();
        progressFormat.lineAlignment = PdfVerticalAlignment.Middle;
        progressFormat.alignment = PdfTextAlignment.Right;
        let pageIndex: number = -1;
        if (!taskbar.isMilestone) {
            let taskbarPen: PdfPen = new PdfPen(taskbar.taskBorderColor);
            let taskBrush: PdfBrush = new PdfSolidBrush(taskbar.taskColor);
            let progressPen: PdfPen = new PdfPen(taskbar.progressColor);
            let progressBrush: PdfBrush = new PdfSolidBrush(taskbar.progressColor);
            let adjustHeight: number = pixelToPoint((this.parent.rowHeight - this.height) / 2.0);
            pageIndex = page.section.indexOf(page);
            let startDate: Date = isNullOrUndefined(this.unscheduleStarteDate) ? this.startDate : this.unscheduleStarteDate;
            let endDate: Date = isNullOrUndefined(this.unscheduleEndDate) ? this.endDate : this.unscheduleEndDate;
            //Task start and end date both are in the range of header split up start and end date
            if (detail.startDate <= startDate && endDate <= detail.endDate) {
                if (!this.isStartPoint) {
                    this.taskStartPoint = { ...startPoint };
                    this.isStartPoint = true;
                }
                if (!this.isScheduledTask && this.unscheduledTaskBy !== 'duration') {
                    this.drawUnscheduledTask(taskGraphics, startPoint, cumulativeWidth, adjustHeight);
                } else {
                    taskGraphics.drawRectangle(taskbarPen, taskBrush, startPoint.x + pixelToPoint(this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight, pixelToPoint(taskbar.width), pixelToPoint(taskbar.height));
                    if (this.progress > 0 && this.progressWidth > 0 && this.isScheduledTask) {
                        taskGraphics.drawRectangle(progressPen, progressBrush, startPoint.x + pixelToPoint(this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight, pixelToPoint(taskbar.progressWidth), pixelToPoint(taskbar.height));
                        if (!isNullOrUndefined(this.parent.taskFields.progress) && !isNullOrUndefined(this.parent.labelSettings.taskLabel)) {
                            taskGraphics.drawString(this.progress.toString(), font, fontColor, fontBrush, startPoint.x + pixelToPoint(this.left - cumulativeWidth), startPoint.y + adjustHeight, pixelToPoint(this.progressWidth), pixelToPoint(this.height), progressFormat);
                        }
                    }
                }
                this.isCompleted = true;
                this.startPage = pageIndex;
                this.endPage = pageIndex;
            }
            //Task start date is in the range of header split up start and end date
            else if (detail.startDate <= startDate && detail.endDate >= startDate && (endDate >= detail.endDate)) {
                if (!this.isStartPoint) {
                    this.taskStartPoint = { ...startPoint };
                    this.isStartPoint = true;
                }
                let renderWidth: number = 0;
                this.width = this.width - (detail.totalWidth - (this.left - cumulativeWidth));
                renderWidth = (detail.totalWidth - (this.left - cumulativeWidth));
                if (!this.isScheduledTask && this.unscheduledTaskBy !== 'duration') {
                    this.drawUnscheduledTask(taskGraphics, startPoint, cumulativeWidth, adjustHeight);
                } else {
                    taskGraphics.drawRectangle(taskbarPen, taskBrush, startPoint.x + pixelToPoint(this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight, pixelToPoint(renderWidth), pixelToPoint(taskbar.height));
                    if (this.progress > 0 && this.progressWidth > 0 && this.isScheduledTask) {
                        let progressBoundsWidth: number = 0;
                        if (this.progressWidth <= renderWidth) {
                            progressBoundsWidth = this.progressWidth;
                        } else {
                            progressBoundsWidth = renderWidth;
                        }
                        taskGraphics.drawRectangle(progressPen, progressBrush, startPoint.x + pixelToPoint(this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight, pixelToPoint(progressBoundsWidth), pixelToPoint(taskbar.height));
                        this.progressWidth -= progressBoundsWidth;
                        if (this.progressWidth === 0 && this.progress !== 0 && this.parent.labelSettings.taskLabel) {
                            taskGraphics.drawString(this.progress.toString(), font, fontColor, fontBrush, startPoint.x + pixelToPoint(this.left - cumulativeWidth), (startPoint.y + adjustHeight), pixelToPoint(progressBoundsWidth), pixelToPoint(this.height), progressFormat);
                        }
                    }
                }
                this.left = 0;
                this.isCompleted = false;
                this.startPage = pageIndex;
            }
            //Task end date is in the range of header split up start and end date 
            else if (endDate <= detail.endDate && detail.startDate <= endDate && !this.isCompleted) {
                if (!this.isStartPoint) {
                    this.taskStartPoint = { ...startPoint };
                    this.isStartPoint = true;
                }
                taskGraphics.drawRectangle(taskbarPen, taskBrush, startPoint.x + pixelToPoint(taskbar.left + 0.5), startPoint.y + adjustHeight, pixelToPoint(taskbar.width), pixelToPoint(taskbar.height));
                if (this.isScheduledTask) {
                    taskGraphics.drawRectangle(progressPen, progressBrush, startPoint.x + pixelToPoint(taskbar.left + 0.5), startPoint.y + adjustHeight, pixelToPoint(taskbar.progressWidth), pixelToPoint(taskbar.height));
                    if (this.progressWidth === 0 && this.progress !== 0) {
                        taskGraphics.drawString(this.progress.toString(), font, fontColor, fontBrush, startPoint.x + pixelToPoint(this.left), (startPoint.y + adjustHeight), pixelToPoint(this.progressWidth), pixelToPoint(this.height), progressFormat);
                    }
                }
                this.isCompleted = true;
                this.endPage = pageIndex;
            }
            //Header splitup start and end date with in the task start and end date.
            //So the task is takes entire width of page.
            else if (startDate < detail.startDate && endDate > detail.endDate) {
                if (!this.isStartPoint) {
                    this.taskStartPoint = { ...startPoint };
                    this.isStartPoint = true;
                }
                taskGraphics.drawRectangle(taskbarPen, taskBrush, startPoint.x + pixelToPoint(taskbar.left) + 0.5, startPoint.y + adjustHeight, pixelToPoint(detail.totalWidth), pixelToPoint(taskbar.height));
                if (this.progress > 0 && this.progressWidth > 0 && this.isScheduledTask) {
                    let progressBoundsWidth: number = 0;
                    if (this.progressWidth <= detail.totalWidth) {
                        progressBoundsWidth = this.progressWidth;
                    } else {
                        progressBoundsWidth = detail.totalWidth;
                    }
                    taskGraphics.drawRectangle(progressPen, progressBrush, startPoint.x + pixelToPoint(taskbar.left) + 0.5, startPoint.y + adjustHeight, pixelToPoint(progressBoundsWidth), pixelToPoint(taskbar.height));
                    this.progressWidth -= progressBoundsWidth;
                    if (this.progressWidth === 0 && this.progress !== 0) {
                        taskGraphics.drawString(this.progress.toString(), font, fontColor, fontBrush, startPoint.x + pixelToPoint(this.left), (startPoint.y + adjustHeight), pixelToPoint(progressBoundsWidth), pixelToPoint(this.height), progressFormat);
                    }
                }
                this.isCompleted = false;
                this.width -= detail.totalWidth;
            }
        } else {
            this.drawMilestone(page, startPoint, detail, cumulativeWidth);
        }
        this.drawRightLabel(page, startPoint, detail, cumulativeWidth);
        return isNextPage;
    }
    /* tslint:enable */
    /**
     * Draw task right side label
     */
    private drawRightLabel(page: PdfPage, startPoint: PointF, detail: TimelineDetails, cumulativeWidth: number): void {
        let graphics: PdfGraphics = page.graphics;
        let left: number;
        if (this.rightTaskLabel.isLeftCalculated) {
            left = this.rightTaskLabel.left;
        } else {
            left = pixelToPoint(this.rightTaskLabel.left);
        }
        let actualLeft: number = left - pixelToPoint(cumulativeWidth) + startPoint.x;
        if (detail.startPoint <= left && left < detail.endPoint &&
            !isNullOrUndefined(this.rightTaskLabel.value) && !this.rightTaskLabel.isCompleted) {
            let result: PdfStringLayoutResult = this.getWidth(this.rightTaskLabel.value, detail.endPoint - left, 15);
            let font: PdfFont = new PdfStandardFont(this.fontFamily, 9);
            let adjustHeight: number = (pixelToPoint(this.parent.rowHeight) - result.actualSize.height) / 2;
            let point: PointF = new PointF(actualLeft, startPoint.y + adjustHeight);
            let size: SizeF = new SizeF(result.actualSize.width, result.actualSize.height);
            let labelBounds: RectangleF = new RectangleF(point, size);
            let labelFormat: PdfStringFormat = new PdfStringFormat();
            labelFormat.alignment = PdfTextAlignment.Right;
            labelFormat.lineAlignment = PdfVerticalAlignment.Middle;
            if (result.actualSize.width > 0) {
                let fontColor: PdfPen = null;
                let fontBrush: PdfBrush = new PdfSolidBrush(this.labelColor);
                /* tslint:disable-next-line */
                graphics.drawString(result.lines[0].text, font, fontColor, fontBrush, labelBounds.x, labelBounds.y, result.actualSize.width, result.actualSize.height, labelFormat);
                if (result.remainder !== null) {
                    this.rightTaskLabel.value = result.remainder;
                    this.rightTaskLabel.left = detail.endPoint;
                    this.rightTaskLabel.isLeftCalculated = true;
                } else {
                    this.rightTaskLabel.isCompleted = true;
                }
            } else {
                this.rightTaskLabel.left = detail.endPoint;
            }
        }
    }
    /**
     * Draw task left task label
     */
    private drawLeftLabel(page: PdfPage, startPoint: PointF, detail: TimelineDetails, cumulativeWidth: number): void {
        let graphics: PdfGraphics = page.graphics;
        let left: number;
        if (!isNullOrUndefined(this.leftTaskLabel.value)) {
            let labelLeft: number = 0;
            labelLeft = this.left;
            if (!this.leftTaskLabel.isLeftCalculated) {
                let result: PdfStringLayoutResult = this.getWidth(this.leftTaskLabel.value, Number.MAX_VALUE, 15);
                /* tslint:disable-next-line */
                let reduceLeft: number = this.isMilestone ? Math.floor(this.parent.chartRowsModule.taskBarHeight / 2) + 33 : 33; // 33 indicates default timeline cell width
                left = pixelToPoint(labelLeft - reduceLeft) - result.actualSize.width;
                this.leftTaskLabel.left = left;
                this.leftTaskLabel.isLeftCalculated = true;
            } else {
                left = this.leftTaskLabel.left;
            }
            let actualLeft: number = left - pixelToPoint(cumulativeWidth) + startPoint.x;
            if (detail.startPoint <= left && left < detail.endPoint && !isNullOrUndefined(this.leftTaskLabel.value)
                && !this.leftTaskLabel.isCompleted) {
                let result: PdfStringLayoutResult = this.getWidth(this.leftTaskLabel.value, detail.endPoint - left, 15);
                let font: PdfFont = new PdfStandardFont(this.fontFamily, 9);
                let adjustHeight: number = (pixelToPoint(this.parent.rowHeight) - result.actualSize.height) / 2;
                let rightLabelpoint: PointF = new PointF(actualLeft, startPoint.y + adjustHeight);
                let rightLabelSize: SizeF = new SizeF(result.actualSize.width, result.actualSize.height);
                let rightLabelBounds: RectangleF = new RectangleF(rightLabelpoint, rightLabelSize);
                let rightLabelFormat: PdfStringFormat = new PdfStringFormat();
                rightLabelFormat.alignment = PdfTextAlignment.Right;
                rightLabelFormat.lineAlignment = PdfVerticalAlignment.Middle;
                if (result.actualSize.width > 0) {
                    let fontColor: PdfPen = null;
                    let fontBrush: PdfBrush = new PdfSolidBrush(this.labelColor);
                    /* tslint:disable-next-line */
                    graphics.drawString(result.lines[0].text, font, fontColor, fontBrush, rightLabelBounds.x, rightLabelBounds.y, result.actualSize.width, result.actualSize.height, rightLabelFormat);
                    if (result.remainder !== null) {
                        this.leftTaskLabel.value = result.remainder;
                        this.leftTaskLabel.left = detail.endPoint;
                    } else {
                        this.leftTaskLabel.isCompleted = true;
                    }
                } else {
                    this.leftTaskLabel.left = detail.endPoint;
                }
            }
        }
    }
    private getWidth(value: string, width: number, height: number): PdfStringLayoutResult {
        let font: PdfFont = new PdfStandardFont(this.fontFamily, 9);
        let layouter: PdfStringLayouter = new PdfStringLayouter();
        let progressFormat: PdfStringFormat = new PdfStringFormat();
        progressFormat.alignment = PdfTextAlignment.Left;
        progressFormat.wordWrap = PdfWordWrapType.Character;
        progressFormat.lineAlignment = PdfVerticalAlignment.Middle;
        /* tslint:disable-next-line */
        let result: PdfStringLayoutResult = layouter.layout(value, font, progressFormat, new SizeF(width, height), false, new SizeF(width, height));
        return result;
    }
    /**
     * Draw Unscheduled Task
     */
    private drawUnscheduledTask(taskGraphics: PdfGraphics, startPoint: PointF, cumulativeWidth: number, adjustHeight: number): void {
        let taskBrush: PdfBrush = new PdfSolidBrush(this.taskColor);
        /* tslint:disable-next-line */
        taskGraphics.drawRectangle(taskBrush, startPoint.x + pixelToPoint(this.left - cumulativeWidth), startPoint.y + adjustHeight, pixelToPoint(3), pixelToPoint(this.height));
    }
    /**
     * Draw milestone task
     */
    private drawMilestone(page: PdfPage, startPoint: PointF, detail: TimelineDetails, cumulativeWidth: number): void {
        if (detail.startDate <= this.startDate && this.startDate <= detail.endDate) {
            let taskGraphics: PdfGraphics = page.graphics;
            let pageIndex: number = page.section.indexOf(page);
            this.taskStartPoint = { ...startPoint };
            let milestonePen: PdfPen = new PdfPen(this.milestoneColor);
            let adjustHeight: number = pixelToPoint(((this.parent.rowHeight - this.height) / 2.0));
            let milestoneBrush: PdfBrush = new PdfSolidBrush(this.milestoneColor);
            taskGraphics.save(); //saving graphics state  
            let height: number = Math.floor(this.parent.chartRowsModule.taskBarHeight * 0.6);
            /* tslint:disable-next-line */
            taskGraphics.translateTransform(startPoint.x + pixelToPoint(this.left - cumulativeWidth), startPoint.y + adjustHeight - (this.parent.chartRowsModule.taskBarHeight * 0.7) / 2);
            taskGraphics.rotateTransform(45); //apply rotation
            /* tslint:disable-next-line */
            taskGraphics.drawRectangle(milestonePen, milestoneBrush, 0, 0, pixelToPoint(height), pixelToPoint(height));
            taskGraphics.restore(); //restoring graphics state 
            this.endPage = this.startPage = pageIndex;
        }
    }
}