import {
    PointF, PdfColor, PdfStringLayouter, PdfStringLayoutResult, PdfPage, PdfSection, PdfGraphics, PdfPen, PdfBrush, PdfSolidBrush,
    RectangleF, SizeF, PdfFont, PdfStandardFont, PdfFontStyle, PdfFontFamily, PdfStringFormat, PdfVerticalAlignment,
    PdfTextAlignment, PdfWordWrapType,PdfDashStyle,PdfPath,PdfBitmap,PdfBrushes,PdfLinearGradientBrush
} from '@syncfusion/ej2-pdf-export';
import { TimelineDetails, TaskLabel, IIndicator } from './../base/interface';
import { Gantt } from '../base/gantt';
import { pixelToPoint,pointToPixel } from '../base/utils';
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
    /** Defines the task baselinestartdate. */
    public baselineStartDate?: Date;
    /** Defines the task baselineenddate. */
    public baselineEndDate?: Date;
    /** Defines the task baselineleft. */
    public baselineLeft?: number;
    /** Defines the task baselinewidth. */
    public baselineWidth?: number;
    /** Defines the task baselineHeight . */
    public baselineHeight: number = 8;
    /** Defines the left of task.
     *
     * @hidden
     */
    public left?: number;
    /** Defines the progress of task. */
    public progress?: number;
    /** Defines the progress width of task. */
    public progressWidth?: number;
    /** Defines the autostart date of task. */
    public autoStartDate?: Date;
    /** Defines the autoent date of task. */
    public autoEndDate?: Date;
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
    public baselineColor: PdfColor;
    public splitLineBackground:PdfColor;
    public unscheduledTaskBarColor:PdfColor;
    public manualParentBackground:PdfColor;
    public manualParentProgress:PdfColor;
    public manualChildBackground: PdfColor;
    public manualChildProgress:PdfColor;
    public manuallineColor:PdfColor;
    public manualParentBorder:PdfColor;
    public manualChildBorder :PdfColor
    public baselineBorderColor: PdfColor;
    public baselineTop: number;
    public labelColor: PdfColor;
    public taskBorderColor: PdfColor;
    public progressColor: PdfColor;
    public milestoneColor: PdfColor;
    public taskbar: PdfGanttTaskbarCollection[];
    public parent: Gantt;
    public segment: any = [];
    public isSpliterTask: boolean;
    public segmentCollection:any =[];
    public isCompleted: boolean;
    public isCompletedAutotask :boolean;
    public autoWidth?:number;
    public autoLeft?:number;
    public indicators: IIndicator[];
    /**
     * @private
     */
    public leftTaskLabel: TaskLabel = {};
    /**
     * @private
     */
    public rightTaskLabel: TaskLabel = {};
    public taskLabel: string;
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
     * @param {PdfPage} page .
     * @returns {PdfPage} .
     * Get the next PDF page
     */
    private GetNextPage(page: PdfPage): PdfPage {
        const section: PdfSection = page.section;
        const index: number = section.indexOf(page);
        let nextPage: PdfPage = null;
        if (index === section.count - 1) {
            nextPage = (section.add() as PdfPage);
        } else {
            nextPage = (section.getPages()[index + 1] as PdfPage);
        }
        return nextPage;
    }
    public isAutoFit() {
        return ((this.parent.pdfExportModule && this.parent.pdfExportModule.helper.exportProps && this.parent.pdfExportModule.helper.exportProps.fitToWidthSettings &&
            this.parent.pdfExportModule.helper.exportProps.fitToWidthSettings.isFitToWidth) || this.parent.timelineModule.isZoomedToFit) ? true : false;
    }
    /**
     * Draw the taskbar, chart back ground
     *
     * @private
     */
    /* eslint-disable */
    public drawTaskbar(page: PdfPage, startPoint: PointF, detail: TimelineDetails, cumulativeWidth: number, rowHeight: number, taskbar: PdfGanttTaskbarCollection,lineWidth:number): boolean {
        let taskGraphics: PdfGraphics = page.graphics;
        let isNextPage: boolean = false;
        const pageSize: SizeF = page.getClientSize();
        const yPoint: number = startPoint.y + rowHeight;
        //code for while current pdf page is exceed
        if (yPoint > pageSize.height) {
            page = this.GetNextPage(page);
            page['contentWidth'] = (this.isAutoFit()) ? pointToPixel(detail.endPoint - detail.startPoint) : detail.endPoint - detail.startPoint;
            taskGraphics = page.graphics;
            startPoint.y = 0;
            if (this.parent.pdfExportModule.gantt.enableHeader) {
                this.parent.pdfExportModule.gantt.chartHeader.drawPageTimeline(page, startPoint, detail);
                startPoint.y = pixelToPoint(this.parent.timelineModule.isSingleTier ? 45 : 60);
            }
            isNextPage = true;
            const graphics = page.graphics;
            const pen = new PdfPen(new PdfColor(206, 206, 206));
            if (page['contentWidth'] && (this.parent.gridLines == "Both" || this.parent.gridLines == "Horizontal")) {
                graphics.drawRectangle(pen, startPoint.x, startPoint.y, this.isAutoFit() && this.parent.timelineModule.bottomTier !=="Day" ? page['contentWidth'] + 0.5 : lineWidth, rowHeight);
            }
        }
        this.drawLeftLabel(page, startPoint, detail, cumulativeWidth);
        //Draw Taskbar
        let font: PdfFont = new PdfStandardFont(this.fontFamily, 9, PdfFontStyle.Regular);
        if (!isNullOrUndefined(this.parent.pdfExportModule['helper']['exportProps'].ganttStyle) && 
            this.parent.pdfExportModule['helper']['exportProps'].ganttStyle.font) {
            font = this.parent.pdfExportModule['helper']['exportProps'].ganttStyle.font;
        }
        const fontColor: PdfPen = null;
        const fontBrush: PdfBrush = new PdfSolidBrush(this.progressFontColor);
        const progressFormat: PdfStringFormat = new PdfStringFormat();
        progressFormat.lineAlignment = PdfVerticalAlignment.Middle;
        progressFormat.alignment = PdfTextAlignment.Right;
        let isLabelString: boolean = false;
        let updatedWidth: number;
        if (!isNullOrUndefined(this.taskLabel) && (/^[a-zA-Z]/.test(this.taskLabel))) {
            isLabelString = true;
            progressFormat.alignment = PdfTextAlignment.Left;
        }
        let pageIndex: number = -1;
        let renderBaselineWidth: number = 0;
        if (this.baselineWidth > detail.totalWidth) {
            if (this.parent.timelineModule.isZoomedToFit || this.isAutoFit()) {
                renderBaselineWidth = detail.totalWidth - this.baselineLeft;
            }
            else {
                renderBaselineWidth = detail.totalWidth;
            }
            this.baselineWidth = this.baselineWidth - detail.totalWidth;
        }
        else {
            if ((this.parent.timelineModule.isZoomedToFit || this.isAutoFit()) && this.baselineWidth + this.baselineLeft > detail.totalWidth) {
                renderBaselineWidth = detail.totalWidth - this.baselineLeft;
            }
            else {
                renderBaselineWidth = this.baselineWidth;
            }
        }
        const baselinePen: PdfPen = new PdfPen(taskbar.baselineBorderColor);
        const baselineBrush: PdfBrush = new PdfSolidBrush(taskbar.baselineColor);
        let renderedBaseline: boolean = false;
        if (!taskbar.isMilestone) {
            const taskbarPen: PdfPen = new PdfPen(taskbar.taskBorderColor);
            const taskBrush: PdfBrush = new PdfSolidBrush(taskbar.taskColor);
            const manualParentBorderPen = new PdfPen(taskbar.manualParentBorder);
            const manualChildBorderPen = new PdfPen(taskbar.manualChildBorder)
            const manualTaskbarPen: PdfPen = new PdfPen(taskbar.manuallineColor);
            const manualParentPen: PdfPen = new PdfPen(taskbar.manualParentProgress);
            const manualline:PdfPen =new PdfPen(taskbar.manuallineColor)  
            const manuallineBrush : PdfBrush = new PdfSolidBrush(taskbar.manuallineColor);    
            const splitline:PdfPen =new PdfPen(taskbar.splitLineBackground);
            const manualBrush: PdfBrush = new PdfSolidBrush(taskbar.manualParentBackground);
            const manualChildBrush: PdfBrush = new PdfSolidBrush(taskbar.manualChildBackground);
            const manualChildProgressBrush: PdfBrush = new PdfSolidBrush(taskbar.manualChildProgress);
            const manualProgressBrush: PdfBrush = new PdfSolidBrush(taskbar.manualParentProgress);
            const progressPen: PdfPen = new PdfPen(taskbar.progressColor);
            const progressBrush: PdfBrush = new PdfSolidBrush(taskbar.progressColor);
            const adjustHeightforTaskbar: number = pixelToPoint((this.parent.rowHeight - this.height) / 2.0);
            var adjustHeightforBaseline: number = pixelToPoint((this.parent.rowHeight - this.height) / 4.5);
            const adjustHeight = this.parent.renderBaseline ? adjustHeightforBaseline : adjustHeightforTaskbar;
            pageIndex = page.section.indexOf(page);
            const startDate: Date = isNullOrUndefined(this.unscheduleStarteDate) ? this.startDate : this.unscheduleStarteDate;
            const endDate: Date = isNullOrUndefined(this.unscheduleEndDate) ? this.endDate : this.unscheduleEndDate;
            const imageSize = 10; 
            //Task start and end date both are in the range of header split up start and end date
            if (detail.startDate <= startDate && endDate <= detail.endDate) {
                if (!this.isStartPoint) {
                    this.taskStartPoint = { ...startPoint };
                    this.isStartPoint = true;
                }
                if (!isNullOrUndefined(taskbar.indicators) && taskbar.indicators.length > 0) {
                    taskbar.indicators.map((items: IIndicator, index: number) => {
                        const currendate = this.parent.dateValidationModule.getDateFromFormat(items.date, true)
                        if (detail.startDate <= currendate && currendate <= detail.endDate) {
                            var leftValue = this.parent.chartRowsModule.getIndicatorleft(items.date);
                            if (!isNullOrUndefined(items.base64)) {
                                const image: PdfBitmap = new PdfBitmap(items.base64);
                                if (this.isAutoFit()) {
                                    taskGraphics.drawImage(image, startPoint.x + (leftValue - cumulativeWidth) + 0.5 + 10, startPoint.y + adjustHeight, imageSize, imageSize)
                                    taskGraphics.drawString(items.name, new PdfStandardFont(PdfFontFamily.Helvetica, 10), null, PdfBrushes.Black, startPoint.x + (leftValue - cumulativeWidth) + 0.5 + 10 + imageSize, startPoint.y + adjustHeight, null);

                                }
                                else {
                                    taskGraphics.drawImage(image, startPoint.x + pixelToPoint(leftValue - cumulativeWidth) + 0.5 + 10, startPoint.y + adjustHeight, imageSize, imageSize)

                                    taskGraphics.drawString(items.name, new PdfStandardFont(PdfFontFamily.Helvetica, 10), null, PdfBrushes.Black, startPoint.x + pixelToPoint(leftValue - cumulativeWidth) + 0.5 + 10 + imageSize, startPoint.y + adjustHeight, null);
                                }
                            }
                        }
                    })
                }
                if (!this.isScheduledTask && this.unscheduledTaskBy === 'duration'){
                    let brush1: PdfLinearGradientBrush;
                    let brush2: PdfLinearGradientBrush;
                    if (this.isAutoFit()) {
                        brush1 = new PdfLinearGradientBrush(
                            new PointF(startPoint.x + (this.left - cumulativeWidth) + 0.5 + (taskbar.width) / 2, 0),
                            new PointF(startPoint.x + (this.left - cumulativeWidth), 0),
                            new PdfColor(taskbar.unscheduledTaskBarColor),
                            new PdfColor(255, 255, 255)
                        );
                        taskGraphics.drawRectangle(brush1, startPoint.x + (this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight, (taskbar.width), pixelToPoint(taskbar.height));
                        brush2 = new PdfLinearGradientBrush(
                            new PointF(startPoint.x + (this.left - cumulativeWidth) + 0.5 + (taskbar.width), 0),
                            new PointF(startPoint.x + (this.left - cumulativeWidth) + (taskbar.width) / 2, 0),
                            new PdfColor(255, 255, 255),
                            new PdfColor(taskbar.unscheduledTaskBarColor)
                        );
                        //Draw rectangle to fill linear gradient color
                        taskGraphics.drawRectangle(brush2, startPoint.x + (this.left - cumulativeWidth) + 0.5 + (taskbar.width) / 2, startPoint.y + adjustHeight, (taskbar.width) / 2, pixelToPoint(taskbar.height));
                    }
                    else {
                        brush1 = new PdfLinearGradientBrush(
                            new PointF(startPoint.x + pixelToPoint(this.left - cumulativeWidth) + 0.5 + pixelToPoint(taskbar.width) / 2, 0),
                            new PointF(startPoint.x + pixelToPoint(this.left - cumulativeWidth), 0),
                            new PdfColor(taskbar.unscheduledTaskBarColor),
                            new PdfColor(255, 255, 255)
                        );
                        taskGraphics.drawRectangle(brush1, startPoint.x + pixelToPoint(this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight, pixelToPoint(taskbar.width), pixelToPoint(taskbar.height));
                        brush2 = new PdfLinearGradientBrush(
                            new PointF(startPoint.x + pixelToPoint(this.left - cumulativeWidth) + 0.5 + pixelToPoint(taskbar.width), 0),
                            new PointF(startPoint.x + pixelToPoint(this.left - cumulativeWidth) + pixelToPoint(taskbar.width) / 2, 0),
                            new PdfColor(255, 255, 255),
                            new PdfColor(taskbar.unscheduledTaskBarColor)
                        );
                        //Draw rectangle to fill linear gradient color
                        taskGraphics.drawRectangle(brush2, startPoint.x + pixelToPoint(this.left - cumulativeWidth) + 0.5 + pixelToPoint(taskbar.width) / 2, startPoint.y + adjustHeight, pixelToPoint(taskbar.width) / 2, pixelToPoint(taskbar.height));
                    }
                }
                else if (!this.isScheduledTask && this.unscheduledTaskBy === "endDate"){
                    this.drawUnscheduledTask(taskGraphics, startPoint, cumulativeWidth, adjustHeight);
                }
                else  if (!this.isScheduledTask && this.unscheduledTaskBy !== 'duration') {
                    this.drawUnscheduledTask(taskGraphics, startPoint, cumulativeWidth, adjustHeight);
                } else {
                    if (this.parent.renderBaseline && taskbar.baselineStartDate && taskbar.baselineEndDate) {
                        if(this.isAutoFit()) {
                            taskGraphics.drawRectangle(baselinePen, baselineBrush, startPoint.x + (taskbar.baselineLeft - cumulativeWidth) + 0.5, startPoint.y + adjustHeight + pixelToPoint(taskbar.height + 3), (renderBaselineWidth), pixelToPoint(this.baselineHeight));
                        }
                        else {
                            taskGraphics.drawRectangle(baselinePen, baselineBrush, startPoint.x + pixelToPoint(taskbar.baselineLeft - cumulativeWidth) + 0.5, startPoint.y + adjustHeight + pixelToPoint(taskbar.height + 3), pixelToPoint(renderBaselineWidth), pixelToPoint(this.baselineHeight));
                        }
                        renderedBaseline = true;
                    }
                    if (taskbar.isSpliterTask) {
                        splitline.dashStyle = PdfDashStyle.Dot;
                        if(this.isAutoFit()) {
                            taskGraphics.drawLine(splitline, new PointF(startPoint.x + (this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight + pixelToPoint(taskbar.height / 2)), new PointF((taskbar.width)+startPoint.x + (this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight + pixelToPoint(taskbar.height / 2)))
                        }
                        else {
                            taskGraphics.drawLine(splitline, new PointF(startPoint.x + pixelToPoint(this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight + pixelToPoint(taskbar.height / 2)), new PointF(pixelToPoint(taskbar.width)+startPoint.x + pixelToPoint(this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight + pixelToPoint(taskbar.height / 2)))
                        }
                        taskbar.segment.map((data: any) => {
                            if(this.isAutoFit()) {
                                taskGraphics.drawRectangle(taskbarPen, taskBrush, startPoint.x + (this.left + data.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight, (data.width), pixelToPoint(taskbar.height));
                            }
                            else {
                                taskGraphics.drawRectangle(taskbarPen, taskBrush, startPoint.x + pixelToPoint(this.left + data.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight, pixelToPoint(data.width), pixelToPoint(taskbar.height));
                            }
                        })
                    }
                    else if(!taskbar.isAutoSchedule && taskbar.isParentTask){
                        taskGraphics.save();
                        let path: PdfPath = new PdfPath();
                        path.addEllipse(0, 0, 5, 5); 
                        if(this.isAutoFit()) {
                            taskGraphics.translateTransform(startPoint.x + (this.left - cumulativeWidth) + 0.5,startPoint.y + adjustHeight -2);
                        }
                        else {
                            taskGraphics.translateTransform(startPoint.x + pixelToPoint(this.left - cumulativeWidth) + 0.5,startPoint.y + adjustHeight -2);
                        }
                        taskGraphics.drawPath(manualTaskbarPen, manuallineBrush, path);
                        taskGraphics.restore();
                        
                        let path1: PdfPath = new PdfPath();
                        path1.addEllipse(0, 0, 5, 5);
                        taskGraphics.save();
                        if(this.isAutoFit()) {
                            taskGraphics.translateTransform(startPoint.x + (this.left - cumulativeWidth) + 0.5 +(this.width) ,startPoint.y + adjustHeight -2);              
                        }
                        else {
                            taskGraphics.translateTransform(startPoint.x + pixelToPoint(this.left - cumulativeWidth) + 0.5 +pixelToPoint(this.width) ,startPoint.y + adjustHeight -2);              
                        }
                        taskGraphics.drawPath(manualTaskbarPen, manuallineBrush, path1);
                        taskGraphics.restore();
                         manualline.dashStyle = PdfDashStyle.Solid; 
                         if(this.isAutoFit()) {
                            taskGraphics.drawLine(manualline, new PointF(startPoint.x + (this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight), new PointF((taskbar.width)+startPoint.x + (this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight))
                         }
                         else {
                            taskGraphics.drawLine(manualline, new PointF(startPoint.x + pixelToPoint(this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight), new PointF(pixelToPoint(taskbar.width)+startPoint.x + pixelToPoint(this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight))
                         }
                    }
                    else if(!taskbar.isAutoSchedule && !taskbar.isParentTask){
                        taskGraphics.save();
                        taskGraphics.setTransparency(0.87);
                        if(this.isAutoFit()) {
                            taskGraphics.drawRectangle(manualChildBorderPen, manualChildBrush, startPoint.x + (this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight, (taskbar.width), pixelToPoint(taskbar.height));
                        }
                        else {
                            taskGraphics.drawRectangle(manualChildBorderPen, manualChildBrush, startPoint.x + pixelToPoint(this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight, pixelToPoint(taskbar.width), pixelToPoint(taskbar.height));
                        }
                       taskGraphics.restore();
                       if(this.isAutoFit()) {
                        taskGraphics.drawRectangle(null,  manualChildProgressBrush, startPoint.x + (this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight, (taskbar.progressWidth), pixelToPoint(this.height));
                       }
                       else {
                        taskGraphics.drawRectangle(null,  manualChildProgressBrush, startPoint.x + pixelToPoint(this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight, pixelToPoint(taskbar.progressWidth), pixelToPoint(this.height));
                       }
                    }
                        else{
                            if(this.isAutoFit()) {
                                taskGraphics.drawRectangle(taskbarPen, taskBrush, startPoint.x + (this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight, (taskbar.width), pixelToPoint(taskbar.height));
                            }
                            else {
                                taskGraphics.drawRectangle(taskbarPen, taskBrush, startPoint.x + pixelToPoint(this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight, pixelToPoint(taskbar.width), pixelToPoint(taskbar.height));
                            }
                        }
                        if (this.isScheduledTask && taskbar.isAutoSchedule  && !taskbar.isSpliterTask) {       
                            if(this.isAutoFit()) {
                                taskGraphics.drawRectangle(progressPen, progressBrush, startPoint.x + (this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight, (taskbar.progressWidth), pixelToPoint(taskbar.height));
                            }
                            else {
                                taskGraphics.drawRectangle(progressPen, progressBrush, startPoint.x + pixelToPoint(this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight, pixelToPoint(taskbar.progressWidth), pixelToPoint(taskbar.height));
                            }                 
                        if (!isNullOrUndefined(this.parent.labelSettings.taskLabel) && !isNullOrUndefined(this.taskLabel)) {
                            updatedWidth = this.progressWidth;
                            if (isLabelString) {
                                updatedWidth = this.width;
                            }
                            if(this.isAutoFit()) {
                                taskGraphics.drawString(this.taskLabel.toString(), font, fontColor, fontBrush, startPoint.x + (this.left - cumulativeWidth), startPoint.y + adjustHeight, (updatedWidth), pixelToPoint(this.height), progressFormat);
                            }
                            else {
                                taskGraphics.drawString(this.taskLabel.toString(), font, fontColor, fontBrush, startPoint.x + pixelToPoint(this.left - cumulativeWidth), startPoint.y + adjustHeight, pixelToPoint(updatedWidth), pixelToPoint(this.height), progressFormat);
                            }
                        }
                    }
                    else if(taskbar.isSpliterTask){
                        taskbar.segment.map((data: any) => { 
                            if(this.isAutoFit()) {
                                taskGraphics.drawRectangle(progressPen, progressBrush, startPoint.x + (this.left + data.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight, (data.progressWidth), pixelToPoint(taskbar.height));  
                            }
                            else {
                                taskGraphics.drawRectangle(progressPen, progressBrush, startPoint.x + pixelToPoint(this.left + data.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight, pixelToPoint(data.progressWidth), pixelToPoint(taskbar.height));  
                            }
                        })
                            
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
                if (!isNullOrUndefined(taskbar.indicators) && taskbar.indicators.length > 0) {
                    taskbar.indicators.map((items: IIndicator, index: number) => {
                        const currendate = this.parent.dateValidationModule.getDateFromFormat(items.date, true)
                   if( detail.startDate<= currendate && currendate<=detail.endDate){
                    var leftValue= this.parent.chartRowsModule.getIndicatorleft(items.date)
                    if (!isNullOrUndefined(items.base64)) {
                        const image: PdfBitmap = new PdfBitmap(items.base64);
                    if(this.isAutoFit()) {
                        taskGraphics.drawImage(image,startPoint.x + (leftValue - cumulativeWidth) + 0.5 +10,startPoint.y + adjustHeight,imageSize,imageSize)
                        taskGraphics.drawString(items.name, new PdfStandardFont(PdfFontFamily.Helvetica, 10),null,PdfBrushes.Black,startPoint.x + (leftValue - cumulativeWidth) + 0.5 +10 +imageSize,startPoint.y + adjustHeight , null);
                    }
                    else {
                        taskGraphics.drawImage(image,startPoint.x + pixelToPoint(leftValue - cumulativeWidth) + 0.5 +10,startPoint.y + adjustHeight,imageSize,imageSize)
                        taskGraphics.drawString(items.name, new PdfStandardFont(PdfFontFamily.Helvetica, 10),null,PdfBrushes.Black,startPoint.x + pixelToPoint(leftValue - cumulativeWidth) + 0.5 +10 +imageSize,startPoint.y + adjustHeight , null);
                    }
                }
                   } })
                }
                let renderWidth: number = 0;
                let splitRenderwidth : number = 0;
                if (!isLabelString) {
                    this.width = this.width - (detail.totalWidth - (this.left - cumulativeWidth));
                }
                renderWidth = (detail.totalWidth - (this.left - cumulativeWidth));
                splitRenderwidth = renderWidth;
                if (!this.isScheduledTask && this.unscheduledTaskBy === 'duration'){
                    let brush1: PdfLinearGradientBrush;
                    let brush2: PdfLinearGradientBrush;
                    if (this.isAutoFit()) {
                        brush1 = new PdfLinearGradientBrush(
                            new PointF(startPoint.x + (this.left - cumulativeWidth) + 0.5 + (renderWidth) / 2, 0),
                            new PointF(startPoint.x + (this.left - cumulativeWidth), 0),
                            new PdfColor(taskbar.unscheduledTaskBarColor),
                            new PdfColor(255, 255, 255)
                        );
                        taskGraphics.drawRectangle(brush1, startPoint.x + (this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight, (renderWidth), pixelToPoint(taskbar.height));
                        brush2 = new PdfLinearGradientBrush(
                            new PointF(startPoint.x + (this.left - cumulativeWidth) + 0.5 + (renderWidth), 0),
                            new PointF(startPoint.x + (this.left - cumulativeWidth) + (renderWidth) / 2, 0),
                            new PdfColor(255, 255, 255),
                            new PdfColor(taskbar.unscheduledTaskBarColor)
                        );
                        taskGraphics.drawRectangle(brush2, startPoint.x + (this.left - cumulativeWidth) + 0.5 + (renderWidth) / 2, startPoint.y + adjustHeight, (renderWidth) / 2, pixelToPoint(taskbar.height));
                    }
                    else {
                        brush1 = new PdfLinearGradientBrush(
                            new PointF(startPoint.x + pixelToPoint(this.left - cumulativeWidth) + 0.5 + pixelToPoint(renderWidth) / 2, 0),
                            new PointF(startPoint.x + pixelToPoint(this.left - cumulativeWidth), 0),
                            new PdfColor(taskbar.unscheduledTaskBarColor),
                            new PdfColor(255, 255, 255)
                        );
                        taskGraphics.drawRectangle(brush1, startPoint.x + pixelToPoint(this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight, pixelToPoint(renderWidth), pixelToPoint(taskbar.height));
                        brush2 = new PdfLinearGradientBrush(
                            new PointF(startPoint.x + pixelToPoint(this.left - cumulativeWidth) + 0.5 + pixelToPoint(renderWidth), 0),
                            new PointF(startPoint.x + pixelToPoint(this.left - cumulativeWidth) + pixelToPoint(renderWidth) / 2, 0),
                            new PdfColor(255, 255, 255),
                            new PdfColor(taskbar.unscheduledTaskBarColor)
                        );
                        taskGraphics.drawRectangle(brush2, startPoint.x + pixelToPoint(this.left - cumulativeWidth) + 0.5 + pixelToPoint(renderWidth) / 2, startPoint.y + adjustHeight, pixelToPoint(renderWidth) / 2, pixelToPoint(taskbar.height));
                    }
                } else if (!this.isScheduledTask && this.unscheduledTaskBy !== 'duration') {
                    this.drawUnscheduledTask(taskGraphics, startPoint, cumulativeWidth, adjustHeight);
                }
                else if(!taskbar.isAutoSchedule && taskbar.isParentTask){
                    taskGraphics.save();
                    let path: PdfPath = new PdfPath();
                    path.addEllipse(0, 0, 5, 5);
                    if (this.isAutoFit()) {
                        taskGraphics.translateTransform(startPoint.x + (this.left - cumulativeWidth) + 0.5,startPoint.y + adjustHeight -2);
                    }
                    else {
                        taskGraphics.translateTransform(startPoint.x + (this.left - cumulativeWidth) + 0.5,startPoint.y + adjustHeight -2);
                    }
                    taskGraphics.drawPath(manualTaskbarPen, manuallineBrush, path);
                    taskGraphics.restore();
                    manualline.dashStyle = PdfDashStyle.Solid; 
                    if (this.isAutoFit()) {
                        taskGraphics.drawLine(manualline, new PointF(startPoint.x + (this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight), new PointF((renderWidth)+startPoint.x + (this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight))
                    }
                    else {
                        taskGraphics.drawLine(manualline, new PointF(startPoint.x + pixelToPoint(this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight), new PointF(pixelToPoint(renderWidth)+startPoint.x + pixelToPoint(this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight))
                    }
               }
               else if(!taskbar.isAutoSchedule && !taskbar.isParentTask){
                if (this.isAutoFit()) {
                    taskGraphics.drawRectangle(manualChildBorderPen, null, startPoint.x + (this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight, (renderWidth), pixelToPoint(taskbar.height));
                }
                else {
                    taskGraphics.drawRectangle(manualChildBorderPen, null, startPoint.x + pixelToPoint(this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight, pixelToPoint(renderWidth), pixelToPoint(taskbar.height));
                }
                taskGraphics.save();
                taskGraphics.setTransparency(0.87);
                if (this.isAutoFit()) {
                    taskGraphics.drawRectangle(null, manualChildBrush, startPoint.x + (this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight, (renderWidth), pixelToPoint(taskbar.height));
                }
                else {
                    taskGraphics.drawRectangle(null, manualChildBrush, startPoint.x + pixelToPoint(this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight, pixelToPoint(renderWidth), pixelToPoint(taskbar.height));
                }
                taskGraphics.restore();
                if (this.isAutoFit()) {
                    taskGraphics.drawRectangle(null,  manualChildProgressBrush, startPoint.x + (this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight, (taskbar.progressWidth), pixelToPoint(taskbar.height));
                }
                else {
                    taskGraphics.drawRectangle(null,  manualChildProgressBrush, startPoint.x + pixelToPoint(this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight, pixelToPoint(taskbar.progressWidth), pixelToPoint(taskbar.height));
                }
             }
               else if (!this.isScheduledTask && this.unscheduledTaskBy !== 'duration') {
                    this.drawUnscheduledTask(taskGraphics, startPoint, cumulativeWidth, adjustHeight);
                }
                else if (!this.isScheduledTask && this.unscheduledTaskBy === "endDate"){
                    this.drawUnscheduledTask(taskGraphics, startPoint, cumulativeWidth, adjustHeight);
                }
                 else {
                    if (this.parent.renderBaseline && taskbar.baselineStartDate && taskbar.baselineEndDate) {
                        if (this.isAutoFit()) {
                            taskGraphics.drawRectangle(baselinePen, baselineBrush, startPoint.x + (taskbar.baselineLeft - cumulativeWidth) + 0.5, startPoint.y + adjustHeight + pixelToPoint(taskbar.height + 3), (renderBaselineWidth), pixelToPoint(this.baselineHeight));
                        }
                        else {
                            taskGraphics.drawRectangle(baselinePen, baselineBrush, startPoint.x + pixelToPoint(taskbar.baselineLeft - cumulativeWidth) + 0.5, startPoint.y + adjustHeight + pixelToPoint(taskbar.height + 3), pixelToPoint(renderBaselineWidth), pixelToPoint(this.baselineHeight));
                        }
                        renderedBaseline = true;
                    }
                    if (taskbar.isSpliterTask) {
                        let pervwidth = 0;
                        let valueChangeBlocker :boolean = true;
                        let lineWidth = 0;
                        taskbar.segment.map((item:any)=>{
                            lineWidth = item.left + item.width
                        })
                        splitline.dashStyle=PdfDashStyle.Dot;
                        if (this.isAutoFit()) {
                            taskGraphics.drawLine(splitline,new PointF( startPoint.x + (this.left - cumulativeWidth) + 0.5 , startPoint.y + adjustHeight + pixelToPoint(taskbar.height/2) ), new PointF((lineWidth)+ (this.left - cumulativeWidth) + startPoint.x,startPoint.y + adjustHeight + pixelToPoint(taskbar.height/2)))
                        }
                        else {
                            taskGraphics.drawLine(splitline,new PointF( startPoint.x + pixelToPoint(this.left - cumulativeWidth) + 0.5 , startPoint.y + adjustHeight + pixelToPoint(taskbar.height/2) ), new PointF(pixelToPoint(lineWidth)+ pixelToPoint(this.left - cumulativeWidth) + startPoint.x,startPoint.y + adjustHeight + pixelToPoint(taskbar.height/2)))
                        } 
                        taskbar.segment.map((data:any ,index : number)=>{
                            if (this.isAutoFit()) {
                                taskGraphics.drawRectangle(taskbarPen, taskBrush, startPoint.x + (this.left - cumulativeWidth) + 0.5 + (data.left), startPoint.y + adjustHeight, (data.width), pixelToPoint(taskbar.height));
                            }
                            else {
                                taskGraphics.drawRectangle(taskbarPen, taskBrush, startPoint.x + pixelToPoint(this.left - cumulativeWidth) + 0.5 + pixelToPoint(data.left), startPoint.y + adjustHeight, pixelToPoint(data.width), pixelToPoint(taskbar.height));
                            }
                            pervwidth = data.left + data.width
                          if( renderWidth >= pervwidth){
                            this.segmentCollection[index].width = 0;
                            this.segmentCollection[index].left = 0;
                          }
                          else {                      
                              if (renderWidth >= (pervwidth - data.width)) {
                                  this.segmentCollection[index].left = 0;                                
                              }
                              else{
                                  this.segmentCollection[index].left = ( (splitRenderwidth-data.left));                                 
                              }                        
                              if (renderWidth >= (pervwidth)) {
                                this.segmentCollection[index].width = 0 ;                              
                              }
                              else{ 
                                if(valueChangeBlocker){
                                this.segmentCollection[index].width = pervwidth-renderWidth;
                                valueChangeBlocker = false;
                            }
                              }                          
                        }
                            splitRenderwidth = splitRenderwidth + data.width + data.left;
                        })
                    }
                   
                     else {
                        if (this.isAutoFit()) {
                            taskGraphics.drawRectangle(taskbarPen, taskBrush, startPoint.x + (this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight, (renderWidth), pixelToPoint(taskbar.height));
                        }
                        else {
                            taskGraphics.drawRectangle(taskbarPen, taskBrush, startPoint.x + pixelToPoint(this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight, pixelToPoint(renderWidth), pixelToPoint(taskbar.height));
                        }
                        if (taskbar.isAutoSchedule && !taskbar.isSpliterTask) {
                            let progressBoundsWidth: number = 0;
                            if (this.progressWidth <= renderWidth) {
                                progressBoundsWidth = this.progressWidth;
                            } else {
                                progressBoundsWidth = renderWidth;
                            }
                            if (this.isAutoFit()) {
                                taskGraphics.drawRectangle(progressPen, progressBrush, startPoint.x + (this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight, (progressBoundsWidth), pixelToPoint(taskbar.height));
                            }
                            else {
                                taskGraphics.drawRectangle(progressPen, progressBrush, startPoint.x + pixelToPoint(this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight, pixelToPoint(progressBoundsWidth), pixelToPoint(taskbar.height));
                            }
                            this.progressWidth -= progressBoundsWidth;
                            if (this.parent.labelSettings.taskLabel && !isNullOrUndefined(this.taskLabel)) {
                                updatedWidth = progressBoundsWidth;
                                if (isLabelString) {
                                    updatedWidth = this.width;
                                }
                                taskGraphics.drawString(this.taskLabel.toString(), font, fontColor, fontBrush, startPoint.x + pixelToPoint(this.left - cumulativeWidth), (startPoint.y + adjustHeight), pixelToPoint(updatedWidth), pixelToPoint(this.height), progressFormat);
                            }
                        }
                    }
                    if(taskbar.isSpliterTask && taskbar.isAutoSchedule  && !taskbar.isSpliterTask){
                        let progressBoundsWidth: number = 0;
                        if (this.progressWidth <= renderWidth) {
                            progressBoundsWidth = this.progressWidth;
                        } else {
                            progressBoundsWidth = renderWidth;
                        }
                        if (this.isAutoFit()) {
                            taskGraphics.drawRectangle(progressPen, progressBrush, startPoint.x + (this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight, (progressBoundsWidth), pixelToPoint(taskbar.height));
                        }
                        else {
                            taskGraphics.drawRectangle(progressPen, progressBrush, startPoint.x + pixelToPoint(this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight, pixelToPoint(progressBoundsWidth), pixelToPoint(taskbar.height));
                        }
                        this.progressWidth -= progressBoundsWidth;
                        if (this.parent.labelSettings.taskLabel && !isNullOrUndefined(this.taskLabel)) {
                            updatedWidth = progressBoundsWidth;
                            if (isLabelString) {
                                updatedWidth = this.width;
                            }
                            if (this.isAutoFit()) {
                                taskGraphics.drawString(this.taskLabel.toString(), font, fontColor, fontBrush, startPoint.x + (this.left - cumulativeWidth), (startPoint.y + adjustHeight), (updatedWidth), pixelToPoint(this.height), progressFormat);
                            }
                            else {
                                taskGraphics.drawString(this.taskLabel.toString(), font, fontColor, fontBrush, startPoint.x + pixelToPoint(this.left - cumulativeWidth), (startPoint.y + adjustHeight), pixelToPoint(updatedWidth), pixelToPoint(this.height), progressFormat);
                            }
                        }
                    }
                    else if (taskbar.isSpliterTask) {
                        taskbar.segment.map((data: any, index: number) => {
                            if (this.isAutoFit()) {
                                taskGraphics.drawRectangle(progressPen, progressBrush, startPoint.x + (this.left + data.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight, (data.progressWidth), pixelToPoint(taskbar.height));
                            }
                            else {
                                taskGraphics.drawRectangle(progressPen, progressBrush, startPoint.x + pixelToPoint(this.left + data.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight, pixelToPoint(data.progressWidth), pixelToPoint(taskbar.height));
                            }
                            if (this.segmentCollection[index].width === 0) {
                                this.segmentCollection[index].progressWidth = 0
                            }
                            else {
                                if (data.width - this.segmentCollection[index].width < data.progressWidth && data.width !== this.segmentCollection[index].width) {
                                    this.segmentCollection[index].progressWidth = data.progressWidth - (data.width - this.segmentCollection[index].width);

                                }

                            }

                        })
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
                if (!isNullOrUndefined(taskbar.indicators) && taskbar.indicators.length > 0) {
                    taskbar.indicators.map((items: IIndicator, index: number) => {
                        const currendate = this.parent.dateValidationModule.getDateFromFormat(items.date, true)
                        if (detail.startDate <= currendate && currendate <= detail.endDate) {
                            const leftValue: number = this.parent.chartRowsModule.getIndicatorleft(items.date);
                            if (!isNullOrUndefined(items.base64)) {
                                const image: PdfBitmap = new PdfBitmap(items.base64);
                                if (this.isAutoFit()) {
                                    taskGraphics.drawImage(image, startPoint.x + (leftValue - cumulativeWidth) + 0.5 + 10, startPoint.y + adjustHeight, imageSize, imageSize)
                                    taskGraphics.drawString(items.name, new PdfStandardFont(PdfFontFamily.Helvetica, 10), null, PdfBrushes.Black, startPoint.x + (leftValue - cumulativeWidth) + 0.5 + 10 + imageSize, startPoint.y + adjustHeight, null);
                                }
                                else {
                                    taskGraphics.drawImage(image, startPoint.x + pixelToPoint(leftValue - cumulativeWidth) + 0.5 + 10, startPoint.y + adjustHeight, imageSize, imageSize)
                                    taskGraphics.drawString(items.name, new PdfStandardFont(PdfFontFamily.Helvetica, 10), null, PdfBrushes.Black, startPoint.x + pixelToPoint(leftValue - cumulativeWidth) + 0.5 + 10 + imageSize, startPoint.y + adjustHeight, null);
                                }
                            }
                        }
                    })
                }
                if (this.parent.renderBaseline && taskbar.baselineStartDate && taskbar.baselineEndDate) {
                    if (this.isAutoFit()) {
                        taskGraphics.drawRectangle(baselinePen, baselineBrush, startPoint.x + (taskbar.baselineLeft - cumulativeWidth) + 0.5, startPoint.y + adjustHeight + pixelToPoint(taskbar.height + 3), (renderBaselineWidth), pixelToPoint(this.baselineHeight));
                    }
                    else {
                        taskGraphics.drawRectangle(baselinePen, baselineBrush, startPoint.x + pixelToPoint(taskbar.baselineLeft - cumulativeWidth) + 0.5, startPoint.y + adjustHeight + pixelToPoint(taskbar.height + 3), pixelToPoint(renderBaselineWidth), pixelToPoint(this.baselineHeight));
                    }
                    renderedBaseline = true;
                }
                if (!this.isScheduledTask && this.unscheduledTaskBy === 'duration') {
                    let brush1: PdfLinearGradientBrush;
                    let brush2: PdfLinearGradientBrush;
                    if (this.isAutoFit()) {
                        brush1 = new PdfLinearGradientBrush(
                            new PointF(startPoint.x + (taskbar.left + 0.5) + (taskbar.width) / 2, 0),
                            new PointF(startPoint.x + (taskbar.left + 0.5), 0),
                            new PdfColor(taskbar.unscheduledTaskBarColor),
                            new PdfColor(255, 255, 255)
                        );
                        taskGraphics.drawRectangle(brush1, startPoint.x + (taskbar.left + 0.5), startPoint.y + adjustHeight, (taskbar.width), pixelToPoint(taskbar.height));
                        brush2 = new PdfLinearGradientBrush(
                            new PointF(startPoint.x + (taskbar.left + 0.5) + (taskbar.width), 0),
                            new PointF(startPoint.x + (taskbar.left + 0.5) + (taskbar.width) / 2, 0),
                            new PdfColor(255, 255, 255),
                            new PdfColor(taskbar.unscheduledTaskBarColor)
                        );
                        taskGraphics.drawRectangle(brush2, startPoint.x + (taskbar.left + 0.5) + (taskbar.width) / 2, startPoint.y + adjustHeight, (taskbar.width) / 2, pixelToPoint(taskbar.height));
                    }
                    else {
                        brush1 = new PdfLinearGradientBrush(
                            new PointF(startPoint.x + pixelToPoint(taskbar.left + 0.5) + pixelToPoint(taskbar.width) / 2, 0),
                            new PointF(startPoint.x + pixelToPoint(taskbar.left + 0.5), 0),
                            new PdfColor(taskbar.unscheduledTaskBarColor),
                            new PdfColor(255, 255, 255)
                        );
                        taskGraphics.drawRectangle(brush1, startPoint.x + pixelToPoint(taskbar.left + 0.5), startPoint.y + adjustHeight, pixelToPoint(taskbar.width), pixelToPoint(taskbar.height));
                        brush2 = new PdfLinearGradientBrush(
                            new PointF(startPoint.x + pixelToPoint(taskbar.left + 0.5) + pixelToPoint(taskbar.width), 0),
                            new PointF(startPoint.x + pixelToPoint(taskbar.left + 0.5) + pixelToPoint(taskbar.width) / 2, 0),

                            new PdfColor(255, 255, 255),
                            new PdfColor(taskbar.unscheduledTaskBarColor)
                        );
                        taskGraphics.drawRectangle(brush2, startPoint.x + pixelToPoint(taskbar.left + 0.5) + pixelToPoint(taskbar.width) / 2, startPoint.y + adjustHeight, pixelToPoint(taskbar.width) / 2, pixelToPoint(taskbar.height));
                    }
                }
                else if (!taskbar.isAutoSchedule && taskbar.isParentTask) {
                    let path1: PdfPath = new PdfPath();
                    path1.addEllipse(0, 0, 5, 5);
                    taskGraphics.save();
                    if (this.isAutoFit()) {
                        taskGraphics.translateTransform(startPoint.x + (this.left - cumulativeWidth) + 0.5 + (this.width), startPoint.y + adjustHeight - 2);
                    }
                    else {
                        taskGraphics.translateTransform(startPoint.x + pixelToPoint(this.left - cumulativeWidth) + 0.5 + pixelToPoint(this.width), startPoint.y + adjustHeight - 2);
                    }
                    taskGraphics.drawPath(manualTaskbarPen, manuallineBrush, path1);
                    taskGraphics.restore();
                    manualline.dashStyle = PdfDashStyle.Solid;
                    if (this.isAutoFit()) {
                        taskGraphics.drawLine(manualline, new PointF(startPoint.x + (this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight), new PointF((taskbar.width) + startPoint.x + (this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight))
                    }
                    else {
                        taskGraphics.drawLine(manualline, new PointF(startPoint.x + pixelToPoint(this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight), new PointF(pixelToPoint(taskbar.width) + startPoint.x + pixelToPoint(this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight))
                    }
                }
                else if (!taskbar.isAutoSchedule && !taskbar.isParentTask) {
                    if (this.isAutoFit()) {
                        taskGraphics.drawRectangle(manualChildBorderPen, null, startPoint.x + (this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight, (taskbar.width), pixelToPoint(taskbar.height));
                    }
                    else {
                        taskGraphics.drawRectangle(manualChildBorderPen, null, startPoint.x + pixelToPoint(this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight, pixelToPoint(taskbar.width), pixelToPoint(taskbar.height));
                    }
                    taskGraphics.save();
                    taskGraphics.setTransparency(0.87);
                    if (this.isAutoFit()) {
                        taskGraphics.drawRectangle(null, manualChildBrush, startPoint.x + (this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight, (taskbar.width), pixelToPoint(taskbar.height));
                    }
                    else {
                        taskGraphics.drawRectangle(null, manualChildBrush, startPoint.x + pixelToPoint(this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight, pixelToPoint(taskbar.width), pixelToPoint(taskbar.height));
                    }
                    taskGraphics.restore();
                    if (this.isAutoFit()) {
                        taskGraphics.drawRectangle(null, manualChildProgressBrush, startPoint.x + (this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight, (taskbar.progressWidth), pixelToPoint(taskbar.height));
                    }
                    else {
                        taskGraphics.drawRectangle(null, manualChildProgressBrush, startPoint.x + pixelToPoint(this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight, pixelToPoint(taskbar.progressWidth), pixelToPoint(taskbar.height));
                    }
                }
                else if (!this.isScheduledTask && this.unscheduledTaskBy === "endDate") {
                    this.drawUnscheduledTask(taskGraphics, startPoint, cumulativeWidth, adjustHeight);
                }
                else if (taskbar.isSpliterTask) {
                    splitline.dashStyle = PdfDashStyle.Dot;
                    if (this.isAutoFit()) {
                        taskGraphics.drawLine(splitline, new PointF(startPoint.x + (this.left) + 0.5, startPoint.y + adjustHeight + pixelToPoint(taskbar.height / 2)), new PointF((taskbar.width) + startPoint.x + (this.left), startPoint.y + adjustHeight + pixelToPoint(taskbar.height / 2)))
                    }
                    else {
                        taskGraphics.drawLine(splitline, new PointF(startPoint.x + pixelToPoint(this.left) + 0.5, startPoint.y + adjustHeight + pixelToPoint(taskbar.height / 2)), new PointF(pixelToPoint(taskbar.width) + startPoint.x + pixelToPoint(this.left), startPoint.y + adjustHeight + pixelToPoint(taskbar.height / 2)))
                    }
                    taskbar.segmentCollection.map((data: any) => {
                        if (data.width !== 0) {
                            if (this.isAutoFit()) {
                                taskGraphics.drawRectangle(taskbarPen, taskBrush, startPoint.x + (taskbar.left + 0.5 + data.left), startPoint.y + adjustHeight, (data.width), pixelToPoint(taskbar.height));
                            }
                            else {
                                taskGraphics.drawRectangle(taskbarPen, taskBrush, startPoint.x + pixelToPoint(taskbar.left + 0.5 + data.left), startPoint.y + adjustHeight, pixelToPoint(data.width), pixelToPoint(taskbar.height));
                            }
                        }
                    })
                }
                else {
                    if (this.isAutoFit()) {
                        taskGraphics.drawRectangle(taskbarPen, taskBrush, startPoint.x + (taskbar.left + 0.5), startPoint.y + adjustHeight, (taskbar.width), pixelToPoint(taskbar.height));
                    }
                    else {
                        taskGraphics.drawRectangle(taskbarPen, taskBrush, startPoint.x + pixelToPoint(taskbar.left + 0.5), startPoint.y + adjustHeight, pixelToPoint(taskbar.width), pixelToPoint(taskbar.height));
                    }
                }
                if (this.isScheduledTask && taskbar.isAutoSchedule && !taskbar.isSpliterTask) {
                    if (this.isAutoFit()) {
                        taskGraphics.drawRectangle(progressPen, progressBrush, startPoint.x + (taskbar.left + 0.5), startPoint.y + adjustHeight, (taskbar.progressWidth), pixelToPoint(taskbar.height));
                    }
                    else {
                        taskGraphics.drawRectangle(progressPen, progressBrush, startPoint.x + pixelToPoint(taskbar.left + 0.5), startPoint.y + adjustHeight, pixelToPoint(taskbar.progressWidth), pixelToPoint(taskbar.height));
                    }
                    if (!isNullOrUndefined(this.taskLabel)) {
                        updatedWidth = this.progressWidth;
                        if (isLabelString) {
                            updatedWidth = this.width;
                        }
                        if (this.isAutoFit()) {
                            taskGraphics.drawString(this.taskLabel.toString(), font, fontColor, fontBrush, startPoint.x + (this.left), (startPoint.y + adjustHeight), (updatedWidth), pixelToPoint(this.height), progressFormat);
                        }
                        else {
                            taskGraphics.drawString(this.taskLabel.toString(), font, fontColor, fontBrush, startPoint.x + pixelToPoint(this.left), (startPoint.y + adjustHeight), pixelToPoint(updatedWidth), pixelToPoint(this.height), progressFormat);
                        }
                    }
                }
                else if (taskbar.isSpliterTask) {
                    taskbar.segmentCollection.map((data: any) => {
                        if (this.isAutoFit()) {
                            taskGraphics.drawRectangle(progressPen, progressBrush, startPoint.x + (taskbar.left + 0.5 + data.left), startPoint.y + adjustHeight, (data.progressWidth), pixelToPoint(taskbar.height));
                        }
                        else {
                            taskGraphics.drawRectangle(progressPen, progressBrush, startPoint.x + pixelToPoint(taskbar.left + 0.5 + data.left), startPoint.y + adjustHeight, pixelToPoint(data.progressWidth), pixelToPoint(taskbar.height));
                        }
                    })
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
                if (!isNullOrUndefined(taskbar.indicators) && taskbar.indicators.length > 0) {
                    taskbar.indicators.map((items: IIndicator, index: number) => {
                        const currendate = this.parent.dateValidationModule.getDateFromFormat(items.date, true)
                        if (detail.startDate <= currendate && currendate <= detail.endDate) {
                            const leftValue: number = this.parent.chartRowsModule.getIndicatorleft(items.date);
                            if (!isNullOrUndefined(items.base64)) {
                                const image: PdfBitmap = new PdfBitmap(items.base64);
                                if (this.isAutoFit()) {
                                    taskGraphics.drawImage(image, startPoint.x + (leftValue - cumulativeWidth) + 0.5 + 10, startPoint.y + adjustHeight, imageSize, imageSize)
                                    taskGraphics.drawString(items.name, new PdfStandardFont(PdfFontFamily.Helvetica, 10), null, PdfBrushes.Black, startPoint.x + (leftValue - cumulativeWidth) + 0.5 + 10 + imageSize, startPoint.y + adjustHeight, null);
                                }
                                else {
                                    taskGraphics.drawImage(image, startPoint.x + pixelToPoint(leftValue - cumulativeWidth) + 0.5 + 10, startPoint.y + adjustHeight, imageSize, imageSize)
                                    taskGraphics.drawString(items.name, new PdfStandardFont(PdfFontFamily.Helvetica, 10), null, PdfBrushes.Black, startPoint.x + pixelToPoint(leftValue - cumulativeWidth) + 0.5 + 10 + imageSize, startPoint.y + adjustHeight, null);
                                }
                            }
                        }
                    })
                }
                if (this.parent.renderBaseline && taskbar.baselineStartDate && taskbar.baselineEndDate) {
                    if (this.isAutoFit()) {
                        taskGraphics.drawRectangle(baselinePen, baselineBrush, startPoint.x + (taskbar.baselineLeft - cumulativeWidth) + 0.5, startPoint.y + adjustHeight + pixelToPoint(taskbar.height + 3), (renderBaselineWidth), pixelToPoint(this.baselineHeight));
                    }
                    else {
                        taskGraphics.drawRectangle(baselinePen, baselineBrush, startPoint.x + pixelToPoint(taskbar.baselineLeft - cumulativeWidth) + 0.5, startPoint.y + adjustHeight + pixelToPoint(taskbar.height + 3), pixelToPoint(renderBaselineWidth), pixelToPoint(this.baselineHeight));
                    }
                    renderedBaseline = true;
                }
                if (!this.isScheduledTask && this.unscheduledTaskBy === 'duration') {
                    let brush1: PdfLinearGradientBrush;
                    let brush2: PdfLinearGradientBrush;
                    if (this.isAutoFit()) {
                        brush1 = new PdfLinearGradientBrush(
                            new PointF(startPoint.x + (taskbar.left) + 0.5 + (detail.totalWidth) / 2, 0),
                            new PointF(startPoint.x + (taskbar.left), 0),
                            new PdfColor(taskbar.unscheduledTaskBarColor),
                            new PdfColor(255, 255, 255)
                        );
                        taskGraphics.drawRectangle(brush1, startPoint.x + (taskbar.left) + 0.5, startPoint.y + adjustHeight, (detail.totalWidth), pixelToPoint(taskbar.height));
                        brush2 = new PdfLinearGradientBrush(
                            new PointF(startPoint.x + (taskbar.left) + 0.5 + (detail.totalWidth), 0),
                            new PointF(startPoint.x + (taskbar.left) + (detail.totalWidth) / 2, 0),

                            new PdfColor(255, 255, 255),
                            new PdfColor(taskbar.unscheduledTaskBarColor)
                        );
                        taskGraphics.drawRectangle(brush2, startPoint.x + (taskbar.left) + 0.5 + (detail.totalWidth) / 2, startPoint.y + adjustHeight, (detail.totalWidth) / 2, pixelToPoint(taskbar.height));
                    }
                    else {
                        brush1 = new PdfLinearGradientBrush(
                            new PointF(startPoint.x + pixelToPoint(taskbar.left) + 0.5 + pixelToPoint(detail.totalWidth) / 2, 0),
                            new PointF(startPoint.x + pixelToPoint(taskbar.left), 0),
                            new PdfColor(taskbar.unscheduledTaskBarColor),
                            new PdfColor(255, 255, 255)
                        );
                        taskGraphics.drawRectangle(brush1, startPoint.x + pixelToPoint(taskbar.left) + 0.5, startPoint.y + adjustHeight, pixelToPoint(detail.totalWidth), pixelToPoint(taskbar.height));
                        brush2 = new PdfLinearGradientBrush(
                            new PointF(startPoint.x + pixelToPoint(taskbar.left) + 0.5 + pixelToPoint(detail.totalWidth), 0),
                            new PointF(startPoint.x + pixelToPoint(taskbar.left) + pixelToPoint(detail.totalWidth) / 2, 0),

                            new PdfColor(255, 255, 255),
                            new PdfColor(taskbar.unscheduledTaskBarColor)
                        );
                        taskGraphics.drawRectangle(brush2, startPoint.x + pixelToPoint(taskbar.left) + 0.5 + pixelToPoint(detail.totalWidth) / 2, startPoint.y + adjustHeight, pixelToPoint(detail.totalWidth) / 2, pixelToPoint(taskbar.height));
                    }
                }
                else if (!this.isScheduledTask && this.unscheduledTaskBy === "endDate") {
                    this.drawUnscheduledTask(taskGraphics, startPoint, cumulativeWidth, adjustHeight);
                } else if (!taskbar.isAutoSchedule && !taskbar.isParentTask) {
                    if (this.isAutoFit()) {
                        taskGraphics.drawRectangle(manualChildBorderPen, null, startPoint.x + (this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight, (detail.totalWidth), pixelToPoint(taskbar.height));
                    }
                    else {
                        taskGraphics.drawRectangle(manualChildBorderPen, null, startPoint.x + pixelToPoint(this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight, pixelToPoint(detail.totalWidth), pixelToPoint(taskbar.height));
                    }
                    taskGraphics.save();
                    taskGraphics.setTransparency(0.87);
                    if (this.isAutoFit()) {
                        taskGraphics.drawRectangle(null, manualChildBrush, startPoint.x + (this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight, (detail.totalWidth), pixelToPoint(taskbar.height));
                    }
                    else {
                        taskGraphics.drawRectangle(null, manualChildBrush, startPoint.x + pixelToPoint(this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight, pixelToPoint(detail.totalWidth), pixelToPoint(taskbar.height));
                    }
                    taskGraphics.restore();
                    if (this.isAutoFit()) {
                        taskGraphics.drawRectangle(null, manualChildProgressBrush, startPoint.x + (this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight, (detail.totalWidth), pixelToPoint(taskbar.height));
                    }
                    else {
                        taskGraphics.drawRectangle(null, manualChildProgressBrush, startPoint.x + pixelToPoint(this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight, pixelToPoint(detail.totalWidth), pixelToPoint(taskbar.height));
                    }
                }
                else {
                    if (this.isAutoFit()) {
                        taskGraphics.drawRectangle(taskbarPen, taskBrush, startPoint.x + (taskbar.left) + 0.5, startPoint.y + adjustHeight, (detail.totalWidth), pixelToPoint(taskbar.height));
                    }
                    else {
                        taskGraphics.drawRectangle(taskbarPen, taskBrush, startPoint.x + pixelToPoint(taskbar.left) + 0.5, startPoint.y + adjustHeight, pixelToPoint(detail.totalWidth), pixelToPoint(taskbar.height));
                    }
                }
                if (this.isScheduledTask) {
                    let progressBoundsWidth: number = 0;
                    if (this.progressWidth <= detail.totalWidth) {
                        progressBoundsWidth = this.progressWidth;
                    } else {
                        progressBoundsWidth = detail.totalWidth;
                    }
                    if (this.isAutoFit()) {
                        taskGraphics.drawRectangle(progressPen, progressBrush, startPoint.x + (taskbar.left) + 0.5, startPoint.y + adjustHeight, (progressBoundsWidth), pixelToPoint(taskbar.height));
                    }
                    else {
                        taskGraphics.drawRectangle(progressPen, progressBrush, startPoint.x + pixelToPoint(taskbar.left) + 0.5, startPoint.y + adjustHeight, pixelToPoint(progressBoundsWidth), pixelToPoint(taskbar.height));
                    }
                    this.progressWidth -= progressBoundsWidth;
                    if (!isNullOrUndefined(this.taskLabel)) {
                        updatedWidth = progressBoundsWidth;
                        if (isLabelString) {
                            updatedWidth = this.width;
                        }
                        if (this.isAutoFit()) {
                            taskGraphics.drawString(this.taskLabel.toString(), font, fontColor, fontBrush, startPoint.x + (this.left), (startPoint.y + adjustHeight), (updatedWidth), pixelToPoint(this.height), progressFormat);
                        }
                        else {
                            taskGraphics.drawString(this.taskLabel.toString(), font, fontColor, fontBrush, startPoint.x + pixelToPoint(this.left), (startPoint.y + adjustHeight), pixelToPoint(updatedWidth), pixelToPoint(this.height), progressFormat);
                        }
                    }
                }
                this.isCompleted = false;
                this.width -= detail.totalWidth;
            }
            if(!this.isAutoSchedule && taskbar.isParentTask){
                if (detail.startDate <= taskbar.autoStartDate && taskbar.autoEndDate<= detail.endDate) {     
                    if (!this.isStartPoint) {
                        this.taskStartPoint = { ...startPoint };
                        this.isStartPoint = true;
                    }
                    if (!taskbar.isAutoSchedule && taskbar.isParentTask) {
                        if (this.isAutoFit()) {
                            taskGraphics.drawRectangle(manualParentBorderPen, null, startPoint.x + (this.autoLeft - cumulativeWidth) + 0.5, startPoint.y + adjustHeight + 10, (this.autoWidth), pixelToPoint(12));
                        }
                        else {
                            taskGraphics.drawRectangle(manualParentBorderPen, null, startPoint.x + pixelToPoint(this.autoLeft - cumulativeWidth) + 0.5, startPoint.y + adjustHeight + 10, pixelToPoint(this.autoWidth), pixelToPoint(12));
                        }
                        taskGraphics.save();
                        taskGraphics.setTransparency(0.87);
                        if (this.isAutoFit()) {
                            taskGraphics.drawRectangle(null, manualBrush, startPoint.x + (this.autoLeft - cumulativeWidth) + 0.5, startPoint.y + adjustHeight + 10, (this.autoWidth), pixelToPoint(12));
                        }
                        else {
                            taskGraphics.drawRectangle(null, manualBrush, startPoint.x + pixelToPoint(this.autoLeft - cumulativeWidth) + 0.5, startPoint.y + adjustHeight + 10, pixelToPoint(this.autoWidth), pixelToPoint(12));
                        }
                        taskGraphics.restore();
                        if (this.isAutoFit()) {
                            taskGraphics.drawRectangle(null, manualProgressBrush, startPoint.x + (this.autoLeft - cumulativeWidth) + 0.5, startPoint.y + adjustHeight + 10, (taskbar.progressWidth), pixelToPoint(12));
                        }
                        else {
                            taskGraphics.drawRectangle(null, manualProgressBrush, startPoint.x + pixelToPoint(this.autoLeft - cumulativeWidth) + 0.5, startPoint.y + adjustHeight + 10, pixelToPoint(taskbar.progressWidth), pixelToPoint(12));
                        }
                    }
                
                    this.isCompletedAutotask = true;
                    this.startPage = pageIndex;
                    this.endPage = pageIndex;
                }
                else if (detail.startDate <= taskbar.autoStartDate && detail.endDate >= taskbar.autoStartDate && (taskbar.autoEndDate >= detail.endDate)) {
                    if (!this.isStartPoint) {
                        this.taskStartPoint = { ...startPoint };
                        this.isStartPoint = true;
                    }
                    let renderWidth: number = 0;

                    renderWidth = (detail.totalWidth - (this.autoLeft - cumulativeWidth));
                 if(!taskbar.isAutoSchedule && taskbar.isParentTask){
                    if (this.isAutoFit()) {
                        taskGraphics.drawRectangle(manualParentBorderPen, null, startPoint.x + (this.autoLeft - cumulativeWidth) + 0.5, startPoint.y + adjustHeight +10, (renderWidth), pixelToPoint(12)); 
                    }
                    else {
                        taskGraphics.drawRectangle(manualParentBorderPen, null, startPoint.x + pixelToPoint(this.autoLeft - cumulativeWidth) + 0.5, startPoint.y + adjustHeight +10, pixelToPoint(renderWidth), pixelToPoint(12)); 
                    }
                    taskGraphics.save();
                    taskGraphics.setTransparency(0.87);
                    if (this.isAutoFit()) {
                        taskGraphics.drawRectangle(null, manualBrush, startPoint.x + (this.autoLeft - cumulativeWidth) + 0.5, startPoint.y + adjustHeight +10, (renderWidth), pixelToPoint(12)); 
                    }
                    else {
                        taskGraphics.drawRectangle(null, manualBrush, startPoint.x + pixelToPoint(this.autoLeft - cumulativeWidth) + 0.5, startPoint.y + adjustHeight +10, pixelToPoint(renderWidth), pixelToPoint(12)); 
                    }
                    taskGraphics.restore();
                    if (this.isAutoFit()) {
                        taskGraphics.drawRectangle(null, manualProgressBrush, startPoint.x + (this.autoLeft - cumulativeWidth) + 0.5, startPoint.y + adjustHeight +10, (taskbar.progressWidth), pixelToPoint(12)); 
                    }
                    else {
                        taskGraphics.drawRectangle(null, manualProgressBrush, startPoint.x + pixelToPoint(this.autoLeft - cumulativeWidth) + 0.5, startPoint.y + adjustHeight +10, pixelToPoint(taskbar.progressWidth), pixelToPoint(12)); 
                    }
                    taskbar.autoWidth = taskbar.autoWidth - renderWidth;
                }
                    this.autoLeft = 0;
                    this.isCompletedAutotask = false;
                    this.startPage = pageIndex;
                }
                else if (taskbar.autoEndDate <= detail.endDate && detail.startDate <= taskbar.autoEndDate && !this.isCompletedAutotask) {
                    if (!this.isStartPoint) {
                        this.taskStartPoint = { ...startPoint };
                        this.isStartPoint = true;
                    }
                    else if(!taskbar.isAutoSchedule && taskbar.isParentTask){
                        if (this.isAutoFit()) {
                            taskGraphics.drawRectangle(manualParentBorderPen, null, startPoint.x + (this.autoLeft + 0.5), startPoint.y + adjustHeight+10, (taskbar.autoWidth), pixelToPoint(12));
                        }
                        else {
                            taskGraphics.drawRectangle(manualParentBorderPen, null, startPoint.x + pixelToPoint(this.autoLeft + 0.5), startPoint.y + adjustHeight+10, pixelToPoint(taskbar.autoWidth), pixelToPoint(12));
                        }
                        taskGraphics.save();
                        taskGraphics.setTransparency(0.87);
                        if (this.isAutoFit()) {
                            taskGraphics.drawRectangle(null, manualBrush, startPoint.x + (this.autoLeft + 0.5), startPoint.y + adjustHeight+10, (taskbar.autoWidth), pixelToPoint(12));
                        }
                        else {
                            taskGraphics.drawRectangle(null, manualBrush, startPoint.x + pixelToPoint(this.autoLeft + 0.5), startPoint.y + adjustHeight+10, pixelToPoint(taskbar.autoWidth), pixelToPoint(12));
                        }
                        taskGraphics.restore();
                        if (this.isAutoFit()) {
                            taskGraphics.drawRectangle(null, manualProgressBrush, startPoint.x + (this.autoLeft + 0.5), startPoint.y + adjustHeight+10, (taskbar.progressWidth), pixelToPoint(12));
                        }
                        else {
                            taskGraphics.drawRectangle(null, manualProgressBrush, startPoint.x + pixelToPoint(this.autoLeft + 0.5), startPoint.y + adjustHeight+10, pixelToPoint(taskbar.progressWidth), pixelToPoint(12));
                        }
                    }

                    this.isCompletedAutotask = true;
                    this.endPage = pageIndex;
                }
                else if (taskbar.autoStartDate < detail.startDate && taskbar.autoEndDate > detail.endDate) {
                    if (!this.isStartPoint) {
                        this.taskStartPoint = { ...startPoint };
                        this.isStartPoint = true;
                    }
                    if (!taskbar.isAutoSchedule && taskbar.isParentTask) {
                        if (this.isAutoFit()) {
                            taskGraphics.drawRectangle(manualParentBorderPen, null, startPoint.x + (this.autoLeft - cumulativeWidth) + 0.5, startPoint.y + adjustHeight + 10, (detail.totalWidth), pixelToPoint(12));
                        }
                        else {
                            taskGraphics.drawRectangle(manualParentBorderPen, null, startPoint.x + pixelToPoint(this.autoLeft - cumulativeWidth) + 0.5, startPoint.y + adjustHeight + 10, pixelToPoint(detail.totalWidth), pixelToPoint(12));
                        }
                        taskGraphics.save();
                        taskGraphics.setTransparency(0.87);
                        if (this.isAutoFit()) {
                            taskGraphics.drawRectangle(null, manualBrush, startPoint.x + (this.autoLeft - cumulativeWidth) + 0.5, startPoint.y + adjustHeight + 10, (detail.totalWidth), pixelToPoint(12));
                        }
                        else {
                            taskGraphics.drawRectangle(null, manualBrush, startPoint.x + pixelToPoint(this.autoLeft - cumulativeWidth) + 0.5, startPoint.y + adjustHeight + 10, pixelToPoint(detail.totalWidth), pixelToPoint(12));
                        }
                        taskGraphics.restore();
                        if (this.isAutoFit()) {
                            taskGraphics.drawRectangle(null, manualProgressBrush, startPoint.x + (this.autoLeft + 0.5), startPoint.y + adjustHeight+10, (taskbar.progressWidth), pixelToPoint(12));
                        }
                        else {
                            taskGraphics.drawRectangle(null, manualProgressBrush, startPoint.x + pixelToPoint(this.autoLeft + 0.5), startPoint.y + adjustHeight+10, pixelToPoint(taskbar.progressWidth), pixelToPoint(12));
                        }

                    }
                    this.isCompletedAutotask = false;
                    this.autoWidth -= detail.totalWidth;
                }


            }
        } else {
            this.drawMilestone(page, startPoint, detail, cumulativeWidth);
            if (this.parent.renderBaseline && taskbar.baselineStartDate && taskbar.baselineEndDate) {
                this.drawMilestone(page, startPoint, detail, cumulativeWidth);
            }
        }
        if (this.baselineEndDate >= detail.startDate && !renderedBaseline && detail.startIndex != 1 && this.parent.renderBaseline && taskbar.baselineStartDate && taskbar.baselineEndDate) {
            const adjustHeight: number = pixelToPoint((this.parent.rowHeight - this.height) / 4.5);
            if (this.isAutoFit()) {
                taskGraphics.drawRectangle(baselinePen, baselineBrush, startPoint.x + (taskbar.baselineLeft - cumulativeWidth) + 0.5, startPoint.y + adjustHeight + pixelToPoint(taskbar.height + 3), (renderBaselineWidth), pixelToPoint(this.baselineHeight));
            }
            else {
                taskGraphics.drawRectangle(baselinePen, baselineBrush, startPoint.x + pixelToPoint(taskbar.baselineLeft - cumulativeWidth) + 0.5, startPoint.y + adjustHeight + pixelToPoint(taskbar.height + 3), pixelToPoint(renderBaselineWidth), pixelToPoint(this.baselineHeight));
            }
        }
        this.drawRightLabel(page, startPoint, detail, cumulativeWidth);
        return isNextPage;
    }
    /* eslint-enable */
    /**
     * @param {PdfPage} page .
     * @param {PointF} startPoint .
     * @param {TimelineDetails} detail .
     * @param {number} cumulativeWidth .
     * @returns {void}
     * Draw task right side label
     */
    private drawRightLabel(page: PdfPage, startPoint: PointF, detail: TimelineDetails, cumulativeWidth: number): void {
        let left: number;
        const graphics: PdfGraphics = page.graphics;
        if (this.rightTaskLabel.isLeftCalculated) {
            left = this.rightTaskLabel.left;
        } else {
            if (this.isAutoFit()) {
                left = (this.rightTaskLabel.left);
            }
            else {
                left = pixelToPoint(this.rightTaskLabel.left);
            }
        }
        let actualLeft: number;
        if (this.isAutoFit()) {
            actualLeft = left - (cumulativeWidth) + startPoint.x;
        }
        else {
            actualLeft = left - pixelToPoint(cumulativeWidth) + startPoint.x;
        }
        if (detail.startPoint <= left && left < detail.endPoint &&
            !isNullOrUndefined(this.rightTaskLabel.value) && !this.rightTaskLabel.isCompleted) {
            const result: PdfStringLayoutResult = this.getWidth(this.rightTaskLabel.value, detail.endPoint - left, 15);
            let font: PdfFont = new PdfStandardFont(this.fontFamily, 9);
            if (!isNullOrUndefined(this.parent.pdfExportModule['helper']['exportProps'].ganttStyle) &&
                this.parent.pdfExportModule['helper']['exportProps'].ganttStyle.font) {
                font = this.parent.pdfExportModule['helper']['exportProps'].ganttStyle.font;
            }
            const adjustHeight: number = (pixelToPoint(this.parent.rowHeight) - result.actualSize.height) / 2;
            const point: PointF = new PointF(actualLeft, startPoint.y + adjustHeight);
            const size: SizeF = new SizeF(result.actualSize.width, result.actualSize.height);
            const labelBounds: RectangleF = new RectangleF(point, size);
            const labelFormat: PdfStringFormat = new PdfStringFormat();
            labelFormat.alignment = PdfTextAlignment.Right;
            labelFormat.lineAlignment = PdfVerticalAlignment.Middle;
            if (result.actualSize.width > 0) {
                const fontColor: PdfPen = null;
                const fontBrush: PdfBrush = new PdfSolidBrush(this.labelColor);
                /* eslint-disable-next-line */
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
     * @param {PdfPage} page .
     * @param {PointF} startPoint .
     * @param {TimelineDetails} detail .
     * @param {number} cumulativeWidth .
     * @returns {void}
     * Draw task left task label
     */
    private drawLeftLabel(page: PdfPage, startPoint: PointF, detail: TimelineDetails, cumulativeWidth: number): void {
        const graphics: PdfGraphics = page.graphics;
        let left: number;
        if (!isNullOrUndefined(this.leftTaskLabel.value)) {
            let labelLeft: number = 0;
            labelLeft = this.left;
            if (!this.leftTaskLabel.isLeftCalculated) {
                const result: PdfStringLayoutResult = this.getWidth(this.leftTaskLabel.value, Number.MAX_VALUE, 15);
                const reduceLeft: number = this.isMilestone ? Math.floor(this.parent.chartRowsModule.taskBarHeight / 2) + 33 : 33; // 33 indicates default timeline cell width
                if (this.isAutoFit()) {
                    left = (labelLeft - reduceLeft) - result.actualSize.width;
                }
                else {
                    left = pixelToPoint(labelLeft - reduceLeft) - result.actualSize.width;
                }
                this.leftTaskLabel.left = left;
                this.leftTaskLabel.isLeftCalculated = true;
            } else {
                left = this.leftTaskLabel.left;
            }
            let actualLeft: number;
            if (this.isAutoFit()) {
                actualLeft = left - pixelToPoint(cumulativeWidth) + startPoint.x;
            }
            else {
                actualLeft = left - pixelToPoint(cumulativeWidth) + startPoint.x;
            }
            if (detail.startPoint <= left && left < detail.endPoint && !isNullOrUndefined(this.leftTaskLabel.value)
                && !this.leftTaskLabel.isCompleted) {
                const result: PdfStringLayoutResult = this.getWidth(this.leftTaskLabel.value, detail.endPoint - left, 15);
                let font: PdfFont = new PdfStandardFont(this.fontFamily, 9);
                if (!isNullOrUndefined(this.parent.pdfExportModule['helper']['exportProps'].ganttStyle) && 
                    this.parent.pdfExportModule['helper']['exportProps'].ganttStyle.font) {
                    font = this.parent.pdfExportModule['helper']['exportProps'].ganttStyle.font;
                }
                const adjustHeight: number = (pixelToPoint(this.parent.rowHeight) - result.actualSize.height) / 2;
                const rightLabelpoint: PointF = new PointF(actualLeft, startPoint.y + adjustHeight);
                const rightLabelSize: SizeF = new SizeF(result.actualSize.width, result.actualSize.height);
                const rightLabelBounds: RectangleF = new RectangleF(rightLabelpoint, rightLabelSize);
                const rightLabelFormat: PdfStringFormat = new PdfStringFormat();
                rightLabelFormat.alignment = PdfTextAlignment.Right;
                rightLabelFormat.lineAlignment = PdfVerticalAlignment.Middle;
                if (result.actualSize.width > 0) {
                    const fontColor: PdfPen = null;
                    const fontBrush: PdfBrush = new PdfSolidBrush(this.labelColor);
                    /* eslint-disable-next-line */
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
        if (!isNullOrUndefined(this.parent.pdfExportModule['helper']['exportProps'].ganttStyle) && 
            this.parent.pdfExportModule['helper']['exportProps'].ganttStyle.font) {
            font = this.parent.pdfExportModule['helper']['exportProps'].ganttStyle.font;
        }
        const layouter: PdfStringLayouter = new PdfStringLayouter();
        const progressFormat: PdfStringFormat = new PdfStringFormat();
        progressFormat.alignment = PdfTextAlignment.Left;
        progressFormat.wordWrap = PdfWordWrapType.Character;
        progressFormat.lineAlignment = PdfVerticalAlignment.Middle;
        /* eslint-disable-next-line */
        const result: PdfStringLayoutResult = layouter.layout(value, font, progressFormat, new SizeF(width, height), false, new SizeF(width, height));
        return result;
    }
    /**
     * @param {PdfGraphics} taskGraphics .
     * @param {PointF} startPoint .
     * @param {number} cumulativeWidth .
     * @param {number} adjustHeight .
     * @returns {void}
     * Draw Unscheduled Task
     */
    private drawUnscheduledTask(taskGraphics: PdfGraphics, startPoint: PointF, cumulativeWidth: number, adjustHeight: number): void {
        const taskBrush: PdfBrush = new PdfSolidBrush(this.taskColor);
        /* eslint-disable-next-line */
        if (this.isAutoFit()) {
            taskGraphics.drawRectangle(taskBrush, startPoint.x + (this.left - cumulativeWidth), startPoint.y + adjustHeight, pixelToPoint(3), pixelToPoint(this.height));
        }
        else {
            taskGraphics.drawRectangle(taskBrush, startPoint.x + pixelToPoint(this.left - cumulativeWidth), startPoint.y + adjustHeight, pixelToPoint(3), pixelToPoint(this.height));
        }
    }
    /**
     * @param {PdfPage} page .
     * @param {PointF} startPoint .
     * @param {TimelineDetails} detail .
     * @param {number} cumulativeWidth .
     * @returns {void}
     * Draw milestone task
     */
    private drawMilestone(page: PdfPage, startPoint: PointF, detail: TimelineDetails, cumulativeWidth: number): void {
        if (detail.startDate <= this.startDate && this.startDate <= detail.endDate) {
            const taskGraphics: PdfGraphics = page.graphics;
            const pageIndex: number = page.section.indexOf(page);
            this.taskStartPoint = { ...startPoint };
            const milestonePen: PdfPen = new PdfPen(this.milestoneColor);
            const adjustHeightforBaselineMilesone: number = pixelToPoint(((this.parent.rowHeight - this.height) / 3.0));
            const adjustHeightforMilesone: number = pixelToPoint(((this.parent.rowHeight - this.height) / 2.0));
            const adjustHeight = this.parent.renderBaseline ? adjustHeightforBaselineMilesone : adjustHeightforMilesone
            const milestoneBrush: PdfBrush = new PdfSolidBrush(this.milestoneColor);
            const baselinePen: PdfPen = new PdfPen(this.baselineBorderColor);
            const baselineBrush: PdfBrush = new PdfSolidBrush(this.baselineColor);
            taskGraphics.save(); //saving graphics state
            const height: number = Math.floor(this.parent.chartRowsModule.taskBarHeight * 0.8);
            /* eslint-disable-next-line */
            if (this.isAutoFit()) {
                taskGraphics.translateTransform(startPoint.x + (this.left - cumulativeWidth), startPoint.y + adjustHeight - (this.parent.chartRowsModule.taskBarHeight * 0.7) / 2);
            }
            else {
                taskGraphics.translateTransform(startPoint.x + pixelToPoint(this.left - cumulativeWidth), startPoint.y + adjustHeight - (this.parent.chartRowsModule.taskBarHeight * 0.7) / 2);
            }
            taskGraphics.rotateTransform(45); //apply rotation
            if (this.parent.renderBaseline && this.baselineStartDate && this.baselineEndDate) {
                taskGraphics.drawRectangle(baselinePen, baselineBrush, 2, 2, pixelToPoint(height), pixelToPoint(height));
            }
            taskGraphics.drawRectangle(milestonePen, milestoneBrush, 0, 0, pixelToPoint(height), pixelToPoint(height));
            taskGraphics.restore(); //restoring graphics state
            this.endPage = this.startPage = pageIndex;
        }
    }
}
