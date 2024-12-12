


import {
    PointF, PdfColor, PdfStringLayouter, PdfStringLayoutResult, PdfPage, PdfSection, PdfGraphics, PdfPen, PdfBrush, PdfSolidBrush,
    RectangleF, SizeF, PdfFont, PdfStandardFont, PdfFontStyle, PdfFontFamily, PdfStringFormat, PdfVerticalAlignment,
    PdfTextAlignment, PdfWordWrapType, PdfDashStyle, PdfPath, PdfBitmap, PdfBrushes, PdfLinearGradientBrush
} from '@syncfusion/ej2-pdf-export';
import { TimelineDetails, TaskLabel, IIndicator, Image, ILabel, ITemplateDetails, ITaskData, IGanttStyle, ITaskSegmentStyles } from './../base/interface';
import { Gantt } from '../base/gantt';
import { pixelToPoint, pointToPixel } from '../base/utils';
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
    public splitLineBackground: PdfColor;
    public unscheduledTaskBarColor: PdfColor;
    public manualParentBackground: PdfColor;
    public manualParentProgress: PdfColor;
    public manualChildBackground: PdfColor;
    public manualChildProgress: PdfColor;
    public manuallineColor: PdfColor;
    public manualParentBorder: PdfColor;
    public manualChildBorder: PdfColor
    public baselineBorderColor: PdfColor;
    public taskSegmentStyles : ITaskSegmentStyles[];
    public baselineTop: number;
    public labelColor: PdfColor;
    public taskBorderColor: PdfColor;
    public progressColor: PdfColor;
    public milestoneColor: PdfColor;
    public taskbar: PdfGanttTaskbarCollection[];
    public parent: Gantt;
    public segment: ITaskData[] = [];
    public isSpliterTask: boolean;
    public segmentCollection: ITaskData[] = [];
    public isCompleted: boolean;
    public isCompletedAutotask: boolean;
    public isCompletedBaseline: boolean;
    public autoWidth?: number;
    public autoLeft?: number;
    public indicators: IIndicator[];
    public labelSettings: ILabel;
    public taskbarTemplate: ITemplateDetails;
    public previousWidthofLeftValue: number;
    public previousWidthofLeftImage: number;
    public totalLeftWidth: number;
    public previousWidthofRightValue: number;
    public previousWidthofRightImage: number;
    public remainString: string;
    public stringLeft: number;
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
    public isAutoFit(): boolean {
        return ((this.parent.pdfExportModule && this.parent.pdfExportModule.helper.exportProps &&
            this.parent.pdfExportModule.helper.exportProps.fitToWidthSettings &&
            this.parent.pdfExportModule.helper.exportProps.fitToWidthSettings.isFitToWidth) ||
            this.parent.timelineModule.isZoomedToFit) ? true : false;
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
            if (page['contentWidth'] && (this.parent.gridLines === "Both" || this.parent.gridLines === "Horizontal")) {
                graphics.drawRectangle(pen, startPoint.x, startPoint.y, this.isAutoFit() && this.parent.timelineModule.bottomTier !=="Day" ? page['contentWidth'] + 0.5 : lineWidth, rowHeight);
            }
        }
        this.drawLeftLabel(page, startPoint, detail, cumulativeWidth ,taskbar);
        //Draw Taskbar
        let font: PdfFont = new PdfStandardFont(this.fontFamily, 9, PdfFontStyle.Regular);
        const fontColor: PdfPen = null;
        const fontBrush: PdfBrush = new PdfSolidBrush(this.progressFontColor);
        let customizedFont : PdfFont;
        let customizedFontBrush : PdfBrush;
        let customizedFontColor : PdfPen;
        customizedFont = !isNullOrUndefined(taskbar.taskbarTemplate.value) && taskbar.taskbarTemplate.fontStyle && taskbar.taskbarTemplate.fontStyle.fontFamily && taskbar.taskbarTemplate.fontStyle.fontSize
            ? new PdfStandardFont(taskbar.taskbarTemplate.fontStyle.fontFamily, taskbar.taskbarTemplate.fontStyle.fontSize, taskbar.taskbarTemplate.fontStyle.fontStyle)
            : font;
        customizedFontBrush = !isNullOrUndefined(taskbar.taskbarTemplate.value) && taskbar.taskbarTemplate.fontStyle && taskbar.taskbarTemplate.fontStyle.fontColor
            ? new PdfSolidBrush(taskbar.taskbarTemplate.fontStyle.fontColor)
            : fontBrush;
        customizedFontColor = !isNullOrUndefined(taskbar.taskbarTemplate.value) && taskbar.taskbarTemplate.fontStyle && taskbar.taskbarTemplate.fontStyle.fontBrush
            ? new PdfPen(taskbar.taskbarTemplate.fontStyle.fontBrush)
            : fontColor;
        if (!isNullOrUndefined(this.parent.pdfExportModule['helper']['exportProps'].ganttStyle) &&
            this.parent.pdfExportModule['helper']['exportProps'].ganttStyle.font) {
            font = this.parent.pdfExportModule['helper']['exportProps'].ganttStyle.font;
        }
        let taskLabelFont : PdfFont;
        let taskLabelFontBrush : PdfBrush;
        const ganttStyle: IGanttStyle = this.parent.pdfExportModule['helper']['exportProps'].ganttStyle;
        if(taskbar.labelSettings.taskLabel.fontStyle.fontSize){
            const taskFont : PdfFont = new PdfStandardFont(taskbar.labelSettings.taskLabel.fontStyle.fontFamily,taskbar.labelSettings.taskLabel.fontStyle.fontSize,taskbar.labelSettings.taskLabel.fontStyle.fontStyle);
            taskLabelFont = taskFont;
        }
        else if(ganttStyle && ganttStyle.label && ganttStyle.label.fontBrush) {
            taskLabelFontBrush =  new PdfSolidBrush(ganttStyle.label.fontBrush);
        }
        else{
            taskLabelFont = font;
        }
        if(taskbar.labelSettings.taskLabel.fontStyle.fontColor){
            taskLabelFontBrush =  new PdfSolidBrush(taskbar.labelSettings.taskLabel.fontStyle.fontColor) ;
        }
        else{
            taskLabelFontBrush = fontBrush;
        }
        const progressFormat: PdfStringFormat = new PdfStringFormat();
        progressFormat.lineAlignment = PdfVerticalAlignment.Middle;
        progressFormat.alignment = PdfTextAlignment.Right;
        let isLabelString: boolean = false;
        let updatedWidth: number;
        if (!isNullOrUndefined(this.taskLabel) && (/^[a-zA-Z0-9]/.test(this.taskLabel))){
            if (this.taskLabel === '0' || this.taskLabel === '0%') {
                updatedWidth = this.width;
                progressFormat.alignment = PdfTextAlignment.Left;
            }
        }
        if ((!isNullOrUndefined(this.taskLabel) && (/^[a-zA-Z]/.test(this.taskLabel))) || (!isNullOrUndefined(taskbar.taskbarTemplate.value)) ){
            isLabelString = true;
            progressFormat.alignment = PdfTextAlignment.Left;
        }
        let pageIndex: number = -1;
        const baselinePen: PdfPen = new PdfPen(taskbar.baselineBorderColor);
        const baselineBrush: PdfBrush = new PdfSolidBrush(taskbar.baselineColor);
        const template : ITemplateDetails = taskbar.taskbarTemplate;
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
            const adjustHeightforBaseline: number = pixelToPoint((this.parent.rowHeight - this.height) / 4.5);
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
                if (!this.isScheduledTask && this.unscheduledTaskBy === 'duration') {
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
                        if (template.value || template.image) {
                            let imageWidth: number;
                            if (!isNullOrUndefined(taskbar.taskbarTemplate.image)) {
                                imageWidth = taskbar.taskbarTemplate.image[0].width;
                                const image: PdfBitmap = new PdfBitmap(taskbar.taskbarTemplate.image[0].base64);
                                taskGraphics.drawImage(image, startPoint.x + (this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight, pixelToPoint(taskbar.taskbarTemplate.image[0].width), pixelToPoint(taskbar.taskbarTemplate.image[0].height));
                            }
                            else {
                                imageWidth = 0;
                            }
                            !isNullOrUndefined(taskbar.taskbarTemplate.value) ? taskGraphics.drawString(taskbar.taskbarTemplate.value, customizedFont, customizedFontColor, customizedFontBrush, startPoint.x + (this.left - cumulativeWidth) + 0.5 + imageWidth, startPoint.y + adjustHeight, pixelToPoint(taskbar.width), pixelToPoint(this.height), progressFormat) : '';
                        }
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
                        if (template.value || template.image) {
                            let imageWidth: number;
                            if (!isNullOrUndefined(taskbar.taskbarTemplate.image)) {
                                imageWidth = taskbar.taskbarTemplate.image[0].width;
                                const image: PdfBitmap = new PdfBitmap(taskbar.taskbarTemplate.image[0].base64);
                                taskGraphics.drawImage(image, startPoint.x + pixelToPoint(this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight, pixelToPoint(taskbar.taskbarTemplate.image[0].width), pixelToPoint(taskbar.taskbarTemplate.image[0].height));
                            }
                            else {
                                imageWidth = 0;
                            }
                            !isNullOrUndefined(taskbar.taskbarTemplate.value) ? taskGraphics.drawString(taskbar.taskbarTemplate.value, customizedFont, customizedFontColor, customizedFontBrush, startPoint.x + pixelToPoint(this.left - cumulativeWidth) + 0.5 + imageWidth, startPoint.y + adjustHeight, pixelToPoint(taskbar.width), pixelToPoint(this.height), progressFormat): '';
                        }
                    }
                }

                else if (!this.isScheduledTask && this.unscheduledTaskBy === "endDate"){
                    this.drawUnscheduledTask(taskGraphics, startPoint, cumulativeWidth, adjustHeight);
                }
                else  if (!this.isScheduledTask && this.unscheduledTaskBy !== 'duration') {
                    this.drawUnscheduledTask(taskGraphics, startPoint, cumulativeWidth, adjustHeight);
                } else {
                    if (taskbar.isSpliterTask) {
                        splitline.dashStyle = PdfDashStyle.Dot;
                        if(this.isAutoFit()) {
                            taskGraphics.drawLine(splitline, new PointF(startPoint.x + (this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight + pixelToPoint(taskbar.height / 2)), new PointF((taskbar.width)+startPoint.x + (this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight + pixelToPoint(taskbar.height / 2)))
                        }
                        else {
                            taskGraphics.drawLine(splitline, new PointF(startPoint.x + pixelToPoint(this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight + pixelToPoint(taskbar.height / 2)), new PointF(pixelToPoint(taskbar.width)+startPoint.x + pixelToPoint(this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight + pixelToPoint(taskbar.height / 2)))
                        }
                        taskbar.segment.map((data: any,index: number) => {
                            const segmenttaskbarPen: PdfPen = !isNullOrUndefined(this.taskSegmentStyles) ? new PdfPen(this.taskSegmentStyles[index].taskBorderColor) : taskbarPen;
                            const segmenttaskBrush: PdfBrush = !isNullOrUndefined(this.taskSegmentStyles) ? new PdfSolidBrush(this.taskSegmentStyles[index].taskColor) : taskBrush;
                            if(this.isAutoFit()) {
                                taskGraphics.drawRectangle(segmenttaskbarPen, segmenttaskBrush, startPoint.x + (this.left + data.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight, (data.width), pixelToPoint(taskbar.height));
                                if (template.value || template.image) {
                                    let imageWidth: number;
                                    if (!isNullOrUndefined(taskbar.taskbarTemplate.image)) {
                                        imageWidth = taskbar.taskbarTemplate.image[0].width;
                                        const image: PdfBitmap = new PdfBitmap(taskbar.taskbarTemplate.image[0].base64);
                                        taskGraphics.drawImage(image, startPoint.x + (this.left + data.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight, pixelToPoint(taskbar.taskbarTemplate.image[0].width), pixelToPoint(taskbar.taskbarTemplate.image[0].height));
                                    }
                                    else {
                                        imageWidth = 0;
                                    }
                                    !isNullOrUndefined(taskbar.taskbarTemplate.value) ? taskGraphics.drawString(taskbar.taskbarTemplate.value, customizedFont, customizedFontColor, customizedFontBrush, startPoint.x + (this.left + data.left - cumulativeWidth) + 0.5 + imageWidth, startPoint.y + adjustHeight, pixelToPoint(data.width), pixelToPoint(taskbar.height), progressFormat) : '';
                                }
                            }
                            else {  
                                taskGraphics.drawRectangle(segmenttaskbarPen, segmenttaskBrush, startPoint.x + pixelToPoint(this.left + data.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight, pixelToPoint(data.width), pixelToPoint(taskbar.height));
                                if (template.value || template.image) {
                                    let imageWidth: number;
                                    if (!isNullOrUndefined(taskbar.taskbarTemplate.image)) {
                                        imageWidth = taskbar.taskbarTemplate.image[0].width;
                                        const image: PdfBitmap = new PdfBitmap(taskbar.taskbarTemplate.image[0].base64);
                                        taskGraphics.drawImage(image, startPoint.x + pixelToPoint(this.left + data.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight, pixelToPoint(taskbar.taskbarTemplate.image[0].width), pixelToPoint(taskbar.taskbarTemplate.image[0].height));
                                    }
                                    else {
                                        imageWidth = 0;
                                    }
                                    !isNullOrUndefined(taskbar.taskbarTemplate.value) ? taskGraphics.drawString(taskbar.taskbarTemplate.value, customizedFont, customizedFontColor, customizedFontBrush, startPoint.x + pixelToPoint(this.left + data.left - cumulativeWidth) + 0.5 + imageWidth, startPoint.y + adjustHeight, pixelToPoint(data.width), pixelToPoint(taskbar.height), progressFormat) : '';
                                }
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
                    else {
                         if (this.isAutoFit()) {
                            if (isNullOrUndefined(template.value) && isNullOrUndefined(template.image)) {
                                taskGraphics.drawRectangle(taskbarPen, taskBrush, startPoint.x + (this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight, (taskbar.width), pixelToPoint(taskbar.height));
                            }
                            else{
                                taskGraphics.drawRectangle(taskbarPen, taskBrush, startPoint.x + (this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight, (taskbar.width), pixelToPoint(taskbar.height));
                                let imageWidth : number;
                                if (!isNullOrUndefined(taskbar.taskbarTemplate.image)) {
                                    imageWidth = taskbar.taskbarTemplate.image[0].width / 2.0;
                                    const image: PdfBitmap = new PdfBitmap(taskbar.taskbarTemplate.image[0].base64);
                                    taskGraphics.drawImage(image, startPoint.x + (this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight + (taskbar.height - taskbar.taskbarTemplate.image[0].height ) / 2.0, (taskbar.taskbarTemplate.image[0].width) / 2.0, (taskbar.taskbarTemplate.image[0].height) / 2.0);
                                }
                                else {
                                    imageWidth = 0;
                                }
                                if (taskbar.taskbarTemplate.value) {
                                    if (isLabelString) {
                                        updatedWidth = this.width;
                                    }
                                    taskGraphics.drawString(taskbar.taskbarTemplate.value, customizedFont, customizedFontColor, customizedFontBrush, startPoint.x + (this.left - cumulativeWidth) + imageWidth, startPoint.y + adjustHeight, (updatedWidth), pixelToPoint(this.height), progressFormat);
                                }
                            }
                        }
                        else {
                            if (isNullOrUndefined(template.value) && isNullOrUndefined(template.image)) {
                                taskGraphics.drawRectangle(taskbarPen, taskBrush, startPoint.x + pixelToPoint(this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight, pixelToPoint(taskbar.width), pixelToPoint(taskbar.height));
                            }
                            else {
                                taskGraphics.drawRectangle(taskbarPen, taskBrush, startPoint.x + pixelToPoint(this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight, pixelToPoint(taskbar.width), pixelToPoint(taskbar.height));
                                let imageWidth : number;
                                if (!isNullOrUndefined(taskbar.taskbarTemplate.image)) {
                                    imageWidth = taskbar.taskbarTemplate.image[0].width;
                                    const image: PdfBitmap = new PdfBitmap(taskbar.taskbarTemplate.image[0].base64);
                                    taskGraphics.drawImage(image, startPoint.x + pixelToPoint(this.left - cumulativeWidth) + 1, startPoint.y + adjustHeight + 1 + pixelToPoint((taskbar.height - taskbar.taskbarTemplate.image[0].height) / 2.0), pixelToPoint(taskbar.taskbarTemplate.image[0].width), pixelToPoint(taskbar.taskbarTemplate.image[0].height))
                                }
                                else {
                                    imageWidth = 0;
                                }
                                !isNullOrUndefined(taskbar.taskbarTemplate.value) ? taskGraphics.drawString(taskbar.taskbarTemplate.value,customizedFont, customizedFontColor, customizedFontBrush, startPoint.x + pixelToPoint(this.left - cumulativeWidth) + imageWidth, startPoint.y + adjustHeight, pixelToPoint(updatedWidth), pixelToPoint(this.height), progressFormat) : '';
                            }
                        }
                    }
                    if (this.isScheduledTask && taskbar.isAutoSchedule && !taskbar.isSpliterTask) {
                            if (isNullOrUndefined(template.image) && isNullOrUndefined(template.value)){
                                if (this.isAutoFit()) {
                                    taskGraphics.drawRectangle(progressPen, progressBrush, startPoint.x + (this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight, (taskbar.progressWidth), pixelToPoint(taskbar.height));
                                }
                                else {
                                    taskGraphics.drawRectangle(progressPen, progressBrush, startPoint.x + pixelToPoint(this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight, pixelToPoint(taskbar.progressWidth), pixelToPoint(taskbar.height));
                                }
                                if (!isNullOrUndefined(this.parent.labelSettings.taskLabel) && !isNullOrUndefined(this.taskLabel)) {
                                    if (this.taskLabel !== '0' && this.taskLabel !== '0%') {
                                        updatedWidth = this.progressWidth;
                                    }
                                    if (isLabelString) {
                                        updatedWidth = this.width;
                                    }
                                    if (this.isAutoFit()) {
                                        taskGraphics.drawString(this.taskLabel.toString(), taskLabelFont, fontColor, taskLabelFontBrush, startPoint.x + (this.left - cumulativeWidth), startPoint.y + adjustHeight, (updatedWidth), pixelToPoint(this.height), progressFormat);
                                    }
                                    else {
                                        taskGraphics.drawString(this.taskLabel.toString(), taskLabelFont, fontColor, taskLabelFontBrush, startPoint.x + pixelToPoint(this.left - cumulativeWidth), startPoint.y + adjustHeight, pixelToPoint(updatedWidth), pixelToPoint(this.height), progressFormat);
                                    }
                                }
                            }
                        }
                    else if(taskbar.isSpliterTask){
                        taskbar.segment.map((data: any ,index: number) => {
                            const segmentprogressPen: PdfPen = !isNullOrUndefined(this.taskSegmentStyles) ? new PdfPen(this.taskSegmentStyles[index].progressColor) : progressPen;
                            const segmentprogressBrush: PdfBrush = !isNullOrUndefined(this.taskSegmentStyles) ? new PdfSolidBrush(this.taskSegmentStyles[index].progressColor) : progressBrush;
                            if(this.isAutoFit()) {
                                taskGraphics.drawRectangle(segmentprogressPen, segmentprogressBrush, startPoint.x + (this.left + data.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight, (data.progressWidth), pixelToPoint(taskbar.height));  
                            }
                            else {
                                taskGraphics.drawRectangle(segmentprogressPen, segmentprogressBrush, startPoint.x + pixelToPoint(this.left + data.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight, pixelToPoint(data.progressWidth), pixelToPoint(taskbar.height));  
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
                let width = this.width;
                let renderWidth: number = 0;
                let progressWidth: number = 0;
                let splitRenderwidth : number = 0;
                this.width = this.width - (detail.totalWidth - (this.left - cumulativeWidth));
                renderWidth = (detail.totalWidth - (this.left - cumulativeWidth));
                progressWidth = (detail.totalWidth - (this.left - cumulativeWidth));
                if (width < renderWidth) {
                    renderWidth = width
                }
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
                        if (template.value || template.image) {
                            let imageWidth: number;
                            if (!isNullOrUndefined(taskbar.taskbarTemplate.image)) {
                                imageWidth = taskbar.taskbarTemplate.image[0].width;
                                const image: PdfBitmap = new PdfBitmap(taskbar.taskbarTemplate.image[0].base64);
                                taskGraphics.drawImage(image, startPoint.x + (this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight,  pixelToPoint(taskbar.taskbarTemplate.image[0].width), pixelToPoint(taskbar.taskbarTemplate.image[0].height));
                            }
                            else {
                                imageWidth = 0;
                            }
                            !isNullOrUndefined(taskbar.taskbarTemplate.value) ? taskGraphics.drawString(taskbar.taskbarTemplate.value, customizedFont, customizedFontColor, customizedFontBrush, startPoint.x + (this.left - cumulativeWidth) + 0.5 + imageWidth, startPoint.y + adjustHeight, pixelToPoint(taskbar.width), pixelToPoint(this.height), progressFormat) : '';
                        }
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
                        if (template.value || template.image) {
                            let imageWidth: number;
                            if (!isNullOrUndefined(taskbar.taskbarTemplate.image)) {
                                imageWidth = taskbar.taskbarTemplate.image[0].width;
                                const image: PdfBitmap = new PdfBitmap(taskbar.taskbarTemplate.image[0].base64);
                                taskGraphics.drawImage(image, startPoint.x + pixelToPoint(this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight, pixelToPoint(taskbar.taskbarTemplate.image[0].width), pixelToPoint(taskbar.taskbarTemplate.image[0].height));
                            }
                            else {
                                imageWidth = 0;
                            }
                            !isNullOrUndefined(taskbar.taskbarTemplate.value) ? taskGraphics.drawString(taskbar.taskbarTemplate.value, customizedFont, customizedFontColor, customizedFontBrush, startPoint.x + pixelToPoint(this.left - cumulativeWidth) + 0.5 + imageWidth, startPoint.y + adjustHeight, pixelToPoint(taskbar.width), pixelToPoint(this.height), progressFormat) : '';
                        }
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
                        taskGraphics.translateTransform(startPoint.x + pixelToPoint(this.left - cumulativeWidth) + 0.5,startPoint.y + adjustHeight -2);
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
                    taskGraphics.drawRectangle(null,  manualChildProgressBrush, startPoint.x + (this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight, (progressWidth), pixelToPoint(taskbar.height));
                }
                else {
                    taskGraphics.drawRectangle(null,  manualChildProgressBrush, startPoint.x + pixelToPoint(this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight, pixelToPoint(progressWidth), pixelToPoint(taskbar.height));
                }
                taskbar.progressWidth = taskbar.progressWidth - progressWidth;
             }
               else if (!this.isScheduledTask && this.unscheduledTaskBy !== 'duration') {
                    this.drawUnscheduledTask(taskGraphics, startPoint, cumulativeWidth, adjustHeight);
                }
                else if (!this.isScheduledTask && this.unscheduledTaskBy === "endDate"){
                    this.drawUnscheduledTask(taskGraphics, startPoint, cumulativeWidth, adjustHeight);
                }
                 else {
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
                            const segmenttaskbarPen: PdfPen = !isNullOrUndefined(this.taskSegmentStyles) ? new PdfPen(this.taskSegmentStyles[index].taskBorderColor) : taskbarPen;
                            const segmenttaskBrush: PdfBrush = !isNullOrUndefined(this.taskSegmentStyles) ? new PdfSolidBrush(this.taskSegmentStyles[index].taskColor) : taskBrush;
                            if (this.isAutoFit()) {
                                taskGraphics.drawRectangle(segmenttaskbarPen, segmenttaskBrush, startPoint.x + (this.left - cumulativeWidth) + 0.5 + (data.left), startPoint.y + adjustHeight, (data.width), pixelToPoint(taskbar.height));
                                if (template.value || template.image) {
                                    let imageWidth: number;
                                    if (!isNullOrUndefined(taskbar.taskbarTemplate.image)) {
                                        imageWidth = taskbar.taskbarTemplate.image[0].width;
                                        const image: PdfBitmap = new PdfBitmap(taskbar.taskbarTemplate.image[0].base64);
                                        taskGraphics.drawImage(image, startPoint.x + (this.left - cumulativeWidth) + 0.5 + (data.left), startPoint.y + adjustHeight, (taskbar.taskbarTemplate.image[0].width), (taskbar.taskbarTemplate.image[0].height));
                                    }
                                    else {
                                        imageWidth = 0;
                                    }
                                    !isNullOrUndefined(taskbar.taskbarTemplate.value) ? taskGraphics.drawString(taskbar.taskbarTemplate.value, customizedFont, customizedFontColor, customizedFontBrush,startPoint.x + (this.left - cumulativeWidth) + 0.5 + (data.left) + imageWidth, startPoint.y + adjustHeight, (data.width), (taskbar.height), progressFormat) : '';
                                }
                            }
                            else {
                                taskGraphics.drawRectangle(segmenttaskbarPen, segmenttaskBrush, startPoint.x + pixelToPoint(this.left - cumulativeWidth) + 0.5 + pixelToPoint(data.left), startPoint.y + adjustHeight, pixelToPoint(data.width), pixelToPoint(taskbar.height));
                                if (template.value || template.image) {
                                    let imageWidth: number;
                                    if (!isNullOrUndefined(taskbar.taskbarTemplate.image)) {
                                        imageWidth = taskbar.taskbarTemplate.image[0].width;
                                        const image: PdfBitmap = new PdfBitmap(taskbar.taskbarTemplate.image[0].base64);
                                        taskGraphics.drawImage(image, startPoint.x + pixelToPoint(this.left - cumulativeWidth) + 0.5 + pixelToPoint(data.left), startPoint.y + adjustHeight, pixelToPoint(taskbar.taskbarTemplate.image[0].width), pixelToPoint(taskbar.taskbarTemplate.image[0].height));
                                    }
                                    else {
                                        imageWidth = 0;
                                    }
                                    !isNullOrUndefined(taskbar.taskbarTemplate.value) ? taskGraphics.drawString(taskbar.taskbarTemplate.value, customizedFont, customizedFontColor, customizedFontBrush,startPoint.x + pixelToPoint(this.left - cumulativeWidth) + 0.5 + pixelToPoint(data.left) + imageWidth, startPoint.y + adjustHeight, pixelToPoint(data.width), pixelToPoint(taskbar.height), progressFormat) : '';
                                }
                            }
                            pervwidth = data.left + data.width
                          if( renderWidth >= pervwidth){
                            this.segmentCollection[parseInt(index.toString(), 10)].width = 0;
                            this.segmentCollection[parseInt(index.toString(), 10)].left = 0;
                          }
                          else {                      
                                if (renderWidth >= (pervwidth - data.width)) {
                                    this.segmentCollection[parseInt(index.toString(), 10)].left = 0;
                                }
                                else {
                                    this.segmentCollection[parseInt(index.toString(), 10)].left = ((splitRenderwidth - data.left));
                                }
                                if (renderWidth >= (pervwidth)) {
                                    this.segmentCollection[parseInt(index.toString(), 10)].width = 0;
                                }
                                else {
                                    if (valueChangeBlocker) {
                                        this.segmentCollection[parseInt(index.toString(), 10)].width = pervwidth - renderWidth;
                                        valueChangeBlocker = false;
                                    }
                                }
                            }
                            splitRenderwidth = splitRenderwidth + data.width + data.left;
                        })
                    }
                   
                     else {
                        if (this.isAutoFit()) {
                            if (isNullOrUndefined(template.value) && isNullOrUndefined(template.image)){
                                taskGraphics.drawRectangle(taskbarPen, taskBrush, startPoint.x + (this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight, (renderWidth), pixelToPoint(taskbar.height));
                            }
                            else{
                                taskGraphics.drawRectangle(taskbarPen, taskBrush, startPoint.x + (this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight, (renderWidth), pixelToPoint(taskbar.height));
                                if(!isNullOrUndefined(taskbar.taskbarTemplate.image)){
                                    const image: PdfBitmap = new PdfBitmap(taskbar.taskbarTemplate.image[0].base64);
                                    taskGraphics.drawImage(image, startPoint.x + (this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight  + pixelToPoint((taskbar.height - taskbar.taskbarTemplate.image[0].height) / 0.5), (taskbar.taskbarTemplate.image[0].width/2.0), (taskbar.taskbarTemplate.image[0].height/2.0))
                                }
                                if(!isNullOrUndefined(taskbar.taskbarTemplate.value)){
                                    const imageWidth : number = !isNullOrUndefined(taskbar.taskbarTemplate.image)? taskbar.taskbarTemplate.image[0].width : 0;
                                    taskGraphics.drawString(taskbar.taskbarTemplate.value, customizedFont, customizedFontColor, customizedFontBrush, startPoint.x + (this.left - cumulativeWidth) + imageWidth, (startPoint.y + adjustHeight), pixelToPoint(updatedWidth), pixelToPoint(this.height), progressFormat);
                                }
                            }
                        }
                        else {
                            if (isNullOrUndefined(template.value) && isNullOrUndefined(template.image)){
                                taskGraphics.drawRectangle(taskbarPen, taskBrush, startPoint.x + pixelToPoint(this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight, pixelToPoint(renderWidth), pixelToPoint(taskbar.height));
                            }
                            else {
                                taskGraphics.drawRectangle(taskbarPen, taskBrush, startPoint.x + pixelToPoint(this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight, pixelToPoint(renderWidth), pixelToPoint(taskbar.height));
                                let imageWidth : number;
                                if (!isNullOrUndefined(taskbar.taskbarTemplate.image)) {
                                    imageWidth = taskbar.taskbarTemplate.image[0].width;
                                    const image: PdfBitmap = new PdfBitmap(taskbar.taskbarTemplate.image[0].base64);
                                    taskGraphics.drawImage(image, startPoint.x + pixelToPoint(this.left - cumulativeWidth) + 1, startPoint.y + adjustHeight + 1 + pixelToPoint((taskbar.height - taskbar.taskbarTemplate.image[0].height) / 2.0), pixelToPoint(taskbar.taskbarTemplate.image[0].width), pixelToPoint(taskbar.taskbarTemplate.image[0].height))
                                }
                                else {
                                    imageWidth = 0;
                                }
                                if (!isNullOrUndefined(taskbar.taskbarTemplate.value)) {
                                    this.stringLeft = pixelToPoint(this.left);
                                    const result: PdfStringLayoutResult = this.getWidth(taskbar.taskbarTemplate.value, detail.endPoint - this.stringLeft, 15);
                                    taskGraphics.drawString(result.lines[0].text, customizedFont, customizedFontColor, customizedFontBrush, startPoint.x + pixelToPoint(this.left - cumulativeWidth) + imageWidth, (startPoint.y + adjustHeight), pixelToPoint(updatedWidth), pixelToPoint(this.height), progressFormat);
                                    if (!isNullOrUndefined(result.remainder)) {
                                        this.remainString = result.remainder;
                                        this.stringLeft = detail.endPoint;
                                        // this.rightTaskLabel.isLeftCalculated = true;
                                    }
                                }
                            }
                        }
                        if (taskbar.isAutoSchedule && !taskbar.isSpliterTask) {
                            let progressBoundsWidth: number = 0;
                            if (this.progressWidth <= renderWidth) {
                                progressBoundsWidth = this.progressWidth;
                            } else {
                                progressBoundsWidth = renderWidth;
                            }
                            if (isNullOrUndefined(template.image) && isNullOrUndefined(template.value)) {
                                if (this.isAutoFit()) {
                                    taskGraphics.drawRectangle(progressPen, progressBrush, startPoint.x + (this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight, (progressBoundsWidth), pixelToPoint(taskbar.height));
                                }
                                else {
                                    taskGraphics.drawRectangle(progressPen, progressBrush, startPoint.x + pixelToPoint(this.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight, pixelToPoint(progressBoundsWidth), pixelToPoint(taskbar.height));
                                }
                            }
                            this.progressWidth -= progressBoundsWidth;
                            if (this.parent.labelSettings.taskLabel && !isNullOrUndefined(this.taskLabel)) {
                                updatedWidth = progressBoundsWidth;
                                if (isLabelString) {
                                    updatedWidth = renderWidth;
                                }
                                this.stringLeft = this.left;
                                if(isNullOrUndefined(taskbar.taskbarTemplate.value)){
                                    const result: PdfStringLayoutResult = this.getWidth(this.taskLabel.toString(), detail.endPoint - this.stringLeft, 15);
                                    taskGraphics.drawString(result.lines[0].text, taskLabelFont, fontColor, taskLabelFontBrush, startPoint.x + pixelToPoint(this.left - cumulativeWidth), (startPoint.y + adjustHeight), pixelToPoint(updatedWidth), pixelToPoint(this.height), progressFormat);
                                    if (!isNullOrUndefined(result.remainder)) {
                                        this.remainString = result.remainder;
                                        this.stringLeft = detail.endPoint;
                                        // this.rightTaskLabel.isLeftCalculated = true;
                                    } 
                                }
                                else{
                                    if (this.isAutoFit()) {
                                        taskGraphics.drawString(this.taskLabel.toString(), taskLabelFont, fontColor, taskLabelFontBrush, startPoint.x + (this.left - cumulativeWidth), (startPoint.y + adjustHeight), (updatedWidth), pixelToPoint(this.height), progressFormat);
                                    }
                                    else {
                                        taskGraphics.drawString(this.taskLabel.toString(), taskLabelFont, fontColor, taskLabelFontBrush, startPoint.x + pixelToPoint(this.left - cumulativeWidth), (startPoint.y + adjustHeight), pixelToPoint(updatedWidth), pixelToPoint(this.height), progressFormat);
                                    }
                                }
                            }
                        }
                    }
                  if (taskbar.isSpliterTask) {
                        taskbar.segment.map((data: any, index: number) => {
                            const segmentprogressPen: PdfPen = !isNullOrUndefined(this.taskSegmentStyles) ? new PdfPen(this.taskSegmentStyles[index].progressColor) : progressPen;
                            const segmentprogressBrush: PdfBrush = !isNullOrUndefined(this.taskSegmentStyles) ? new PdfSolidBrush(this.taskSegmentStyles[index].progressColor) : progressBrush; 
                            if (this.isAutoFit()) {
                                taskGraphics.drawRectangle(segmentprogressPen, segmentprogressBrush, startPoint.x + (this.left + data.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight, (data.progressWidth), pixelToPoint(taskbar.height));
                            }
                            else {
                                taskGraphics.drawRectangle(segmentprogressPen, segmentprogressBrush, startPoint.x + pixelToPoint(this.left + data.left - cumulativeWidth) + 0.5, startPoint.y + adjustHeight, pixelToPoint(data.progressWidth), pixelToPoint(taskbar.height));
                            }
                            if (this.segmentCollection[parseInt(index.toString(), 10)].width === 0) {
                                this.segmentCollection[parseInt(index.toString(), 10)].progressWidth = 0
                            }
                            else {
                                if (data.width - this.segmentCollection[parseInt(index.toString(), 10)].width < data.progressWidth && data.width !== this.segmentCollection[index].width) {
                                    this.segmentCollection[parseInt(index.toString(), 10)].progressWidth = data.progressWidth - (data.width - this.segmentCollection[index].width);

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
                if (!this.isScheduledTask && this.unscheduledTaskBy === 'duration') {
                    let brush1: PdfLinearGradientBrush;
                    let brush2: PdfLinearGradientBrush;
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
                        if (template.value || template.image) {
                            let imageWidth: number;
                            if (!isNullOrUndefined(taskbar.taskbarTemplate.image)) {
                                imageWidth = taskbar.taskbarTemplate.image[0].width;
                                const image: PdfBitmap = new PdfBitmap(taskbar.taskbarTemplate.image[0].base64);
                                taskGraphics.drawImage(image, startPoint.x + pixelToPoint(taskbar.left + 0.5), startPoint.y + adjustHeight, pixelToPoint(taskbar.taskbarTemplate.image[0].width), pixelToPoint(taskbar.taskbarTemplate.image[0].height));
                            }
                            else {
                                imageWidth = 0;
                            }
                            !isNullOrUndefined(taskbar.taskbarTemplate.value) ? taskGraphics.drawString(taskbar.taskbarTemplate.value, customizedFont, customizedFontColor, customizedFontBrush,startPoint.x + pixelToPoint(taskbar.left + 0.5) + imageWidth, startPoint.y + adjustHeight, pixelToPoint(taskbar.width), pixelToPoint(this.height), progressFormat) : '';
                        }
                }
                else if (!taskbar.isAutoSchedule && taskbar.isParentTask) {
                    let path1: PdfPath = new PdfPath();
                    path1.addEllipse(0, 0, 5, 5); // Circle with radius 5
                    taskGraphics.save();// Save the current graphics state  
                    let lineStartX = startPoint.x + pixelToPoint(this.left + 0.5);// Calculate the endpoint of the line
                    let lineEndX = pixelToPoint(taskbar.width) + lineStartX - 5;
                    let lineY = startPoint.y + adjustHeight;
                    taskGraphics.drawLine(manualline, lineStartX, lineY, lineEndX, lineY);   // Draw the line first     
                    taskGraphics.translateTransform(lineEndX, lineY - 2); // Now move the origin to the line's end point to draw the circle        
                    taskGraphics.drawPath(manualTaskbarPen, manuallineBrush, path1); // Draw the circle at the end of the line  
                    taskGraphics.restore(); // Restore the graphics state
                    manualline.dashStyle = PdfDashStyle.Solid;  // Ensure the line has a solid style
                }
                else if (!taskbar.isAutoSchedule && !taskbar.isParentTask) {
                    taskGraphics.drawRectangle(manualChildBorderPen, null, startPoint.x + pixelToPoint(this.left + 0.5), startPoint.y + adjustHeight, pixelToPoint(taskbar.width), pixelToPoint(taskbar.height));
                    taskGraphics.save();
                    taskGraphics.setTransparency(0.87);
                    taskGraphics.drawRectangle(null, manualChildBrush, startPoint.x + pixelToPoint(this.left + 0.5), startPoint.y + adjustHeight, pixelToPoint(taskbar.width), pixelToPoint(taskbar.height));
                    taskGraphics.restore();
                    taskGraphics.drawRectangle(null, manualChildProgressBrush, startPoint.x + pixelToPoint(this.left + 0.5), startPoint.y + adjustHeight, pixelToPoint(taskbar.progressWidth), pixelToPoint(taskbar.height));
                }
                else if (!this.isScheduledTask && this.unscheduledTaskBy === "endDate") {
                    this.drawUnscheduledTask(taskGraphics, startPoint, cumulativeWidth, adjustHeight);
                }
                else if (taskbar.isSpliterTask) {
                    splitline.dashStyle = PdfDashStyle.Dot;
                    taskGraphics.drawLine(splitline, new PointF(startPoint.x + pixelToPoint(this.left) + 0.5, startPoint.y + adjustHeight + pixelToPoint(taskbar.height / 2)), new PointF(pixelToPoint(taskbar.width) + startPoint.x + pixelToPoint(this.left), startPoint.y + adjustHeight + pixelToPoint(taskbar.height / 2)))
                    taskbar.segmentCollection.map((data: any,index: number) => {
                        const segmenttaskbarPen: PdfPen = !isNullOrUndefined(this.taskSegmentStyles) ? new PdfPen(this.taskSegmentStyles[index].taskBorderColor) : taskbarPen;
                        const segmenttaskBrush: PdfBrush = !isNullOrUndefined(this.taskSegmentStyles) ? new PdfSolidBrush(this.taskSegmentStyles[index].taskColor) : taskBrush;
                        if (data.width !== 0) {
                            taskGraphics.drawRectangle(segmenttaskbarPen, segmenttaskBrush, startPoint.x + pixelToPoint(taskbar.left + 0.5 + data.left), startPoint.y + adjustHeight, pixelToPoint(data.width), pixelToPoint(taskbar.height));
                            if (template.value || template.image) {
                                let imageWidth: number;
                                if (!isNullOrUndefined(taskbar.taskbarTemplate.image)) {
                                    imageWidth = taskbar.taskbarTemplate.image[0].width;
                                    const image: PdfBitmap = new PdfBitmap(taskbar.taskbarTemplate.image[0].base64);
                                    taskGraphics.drawImage(image, startPoint.x + pixelToPoint(taskbar.left + 0.5 + data.left), startPoint.y + adjustHeight, pixelToPoint(taskbar.taskbarTemplate.image[0].width), pixelToPoint(taskbar.taskbarTemplate.image[0].height));
                                }
                                else {
                                    imageWidth = 0;
                                }
                                !isNullOrUndefined(taskbar.taskbarTemplate.value) ? taskGraphics.drawString(taskbar.taskbarTemplate.value, customizedFont, customizedFontColor, customizedFontBrush, startPoint.x + pixelToPoint(taskbar.left + 0.5 + data.left) + imageWidth, startPoint.y + adjustHeight, pixelToPoint(data.width), pixelToPoint(taskbar.height), progressFormat) : '';
                            }
                        }
                    })
                }
                else {
                    taskGraphics.drawRectangle(taskbarPen, taskBrush, startPoint.x + pixelToPoint(taskbar.left + 0.5), startPoint.y + adjustHeight, pixelToPoint(taskbar.width), pixelToPoint(taskbar.height));
                    if (!isNullOrUndefined(this.remainString)) {
                        var result = this.getWidth(this.remainString, taskbar.width - taskbar.left, 15);
                        taskGraphics.drawString(result.lines[0].text, customizedFont, customizedFontColor, customizedFontBrush, startPoint.x + pixelToPoint(taskbar.left), (startPoint.y + adjustHeight), result.actualSize.width, pixelToPoint(this.height), progressFormat);
                    }
                }
                if (this.isScheduledTask && taskbar.isAutoSchedule && !taskbar.isSpliterTask) {
                    if (isNullOrUndefined(template.image) && isNullOrUndefined(template.value)){
                        taskGraphics.drawRectangle(progressPen, progressBrush, startPoint.x + pixelToPoint(taskbar.left + 0.5), startPoint.y + adjustHeight, pixelToPoint(taskbar.progressWidth), pixelToPoint(taskbar.height));
                    }
                    if (!isNullOrUndefined(this.taskLabel)) {
                        updatedWidth = this.progressWidth;
                        if (isLabelString) {
                            updatedWidth = this.width;
                        }
                        if (isNullOrUndefined(taskbar.taskbarTemplate.value)) {
                            if (isNullOrUndefined(taskbar.taskbarTemplate.value)) {
                                if (!isNullOrUndefined(this.remainString)) {
                                    const result: PdfStringLayoutResult = this.getWidth(this.remainString, detail.endPoint - this.stringLeft, 15);
                                    taskGraphics.drawString(result.lines[0].text, font, fontColor, fontBrush, startPoint.x + pixelToPoint(this.left), (startPoint.y + adjustHeight), pixelToPoint(updatedWidth), pixelToPoint(this.height), progressFormat);
                                }
                            }
                        }
                        if (!isNullOrUndefined(this.taskLabel)) {
                            updatedWidth = this.progressWidth;
                            if (isLabelString) {
                                updatedWidth = this.width;
                            }
                            taskGraphics.drawString(this.taskLabel.toString(), font, fontColor, fontBrush, startPoint.x + pixelToPoint(this.left), (startPoint.y + adjustHeight), pixelToPoint(updatedWidth), pixelToPoint(this.height), progressFormat);
                        }
                    }
                }
                else if (taskbar.isSpliterTask) {
                    taskbar.segmentCollection.map((data: any, index: number) => {
                        const segmentprogressPen: PdfPen = !isNullOrUndefined(this.taskSegmentStyles) ? new PdfPen(this.taskSegmentStyles[index].progressColor) : progressPen;
                        const segmentprogressBrush: PdfBrush = !isNullOrUndefined(this.taskSegmentStyles) ? new PdfSolidBrush(this.taskSegmentStyles[index].progressColor) : progressBrush;
                        taskGraphics.drawRectangle(segmentprogressPen, segmentprogressBrush, startPoint.x + pixelToPoint(taskbar.left + 0.5 + data.left), startPoint.y + adjustHeight, pixelToPoint(data.progressWidth), pixelToPoint(taskbar.height));
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
                if (!this.isScheduledTask && this.unscheduledTaskBy === 'duration') {
                    let brush1: PdfLinearGradientBrush;
                    let brush2: PdfLinearGradientBrush;
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
                        if (template.value || template.image) {
                            let imageWidth: number;
                            if (!isNullOrUndefined(taskbar.taskbarTemplate.image)) {
                                imageWidth = taskbar.taskbarTemplate.image[0].width;
                                const image: PdfBitmap = new PdfBitmap(taskbar.taskbarTemplate.image[0].base64);
                                taskGraphics.drawImage(image, startPoint.x + pixelToPoint(taskbar.left) + 0.5, startPoint.y + adjustHeight, pixelToPoint(taskbar.taskbarTemplate.image[0].width), pixelToPoint(taskbar.taskbarTemplate.image[0].height));
                            }
                            else {
                                imageWidth = 0;
                            }
                            !isNullOrUndefined(taskbar.taskbarTemplate.value) ? taskGraphics.drawString(taskbar.taskbarTemplate.value, customizedFont, customizedFontColor, customizedFontBrush,startPoint.x + pixelToPoint(taskbar.left + 0.5) + imageWidth, startPoint.y + adjustHeight, pixelToPoint(taskbar.width), pixelToPoint(this.height), progressFormat) : 0;
                        }
                }
                else if (!this.isScheduledTask && this.unscheduledTaskBy === "endDate") {
                    this.drawUnscheduledTask(taskGraphics, startPoint, cumulativeWidth, adjustHeight);
                } else if (!taskbar.isAutoSchedule && !taskbar.isParentTask) {
                    taskGraphics.drawRectangle(manualChildBorderPen, null, startPoint.x + pixelToPoint(taskbar.left) + 0.5, startPoint.y + adjustHeight, pixelToPoint(detail.totalWidth), pixelToPoint(taskbar.height));
                    taskGraphics.save();
                    taskGraphics.setTransparency(0.87);
                    taskGraphics.drawRectangle(null, manualChildBrush, startPoint.x + pixelToPoint(taskbar.left) + 0.5, startPoint.y + adjustHeight, pixelToPoint(detail.totalWidth), pixelToPoint(taskbar.height));
                    taskGraphics.restore();
                    let progressBoundsWidth: number = 0;
                    if (this.progressWidth <= detail.totalWidth) {
                        progressBoundsWidth = this.progressWidth;
                    } else {
                        progressBoundsWidth = detail.totalWidth;
                    }
                    if (isNullOrUndefined(template.image) && isNullOrUndefined(template.value)){
                        taskGraphics.drawRectangle(progressPen, progressBrush, startPoint.x + pixelToPoint(taskbar.left) + 0.5, startPoint.y + adjustHeight, pixelToPoint(progressBoundsWidth), pixelToPoint(taskbar.height));
                    }
                    this.progressWidth -= progressBoundsWidth;
                    taskGraphics.drawRectangle(null, manualChildProgressBrush, startPoint.x + pixelToPoint(taskbar.left) + 0.5, startPoint.y + adjustHeight, pixelToPoint(progressBoundsWidth), pixelToPoint(taskbar.height));
                }
                else if (!taskbar.isAutoSchedule && taskbar.isParentTask) {
                    manualline.dashStyle = PdfDashStyle.Solid;
                    taskGraphics.drawLine(manualline, startPoint.x + pixelToPoint(taskbar.left) + 0.5, startPoint.y + adjustHeight, pixelToPoint(detail.totalWidth), startPoint.y + adjustHeight);
                }
                else {
                    taskGraphics.drawRectangle(taskbarPen, taskBrush, startPoint.x + pixelToPoint(taskbar.left) + 0.5, startPoint.y + adjustHeight, pixelToPoint(detail.totalWidth), pixelToPoint(taskbar.height));
                    if (!isNullOrUndefined(taskbar.taskbarTemplate.value)) {
                        if (!isNullOrUndefined(this.remainString)) {
                            const result: PdfStringLayoutResult = this.getWidth(this.remainString, detail.endPoint - this.stringLeft, 15);
                            taskGraphics.drawString(result.lines[0].text, customizedFont, customizedFontColor, customizedFontBrush, startPoint.x + pixelToPoint(taskbar.left) + 0.5, (startPoint.y + adjustHeight), pixelToPoint(detail.totalWidth), pixelToPoint(this.height), progressFormat);
                        }
                    }
                    if (this.isScheduledTask && !taskbar.isParentTask) {
                        let progressBoundsWidth: number = 0;
                        if (this.progressWidth <= detail.totalWidth) {
                            progressBoundsWidth = this.progressWidth;
                        } else {
                            progressBoundsWidth = detail.totalWidth;
                        }
                        if (isNullOrUndefined(template.image) && isNullOrUndefined(template.value)){
                            taskGraphics.drawRectangle(progressPen, progressBrush, startPoint.x + pixelToPoint(taskbar.left) + 0.5, startPoint.y + adjustHeight, pixelToPoint(progressBoundsWidth), pixelToPoint(taskbar.height));
                        }
                        this.progressWidth -= progressBoundsWidth;
                        if (!isNullOrUndefined(this.taskLabel)) {
                            updatedWidth = progressBoundsWidth;
                            if (isLabelString) {
                                updatedWidth = this.width;
                            }
                            taskGraphics.drawString(this.taskLabel.toString(), taskLabelFont, fontColor, taskLabelFontBrush, startPoint.x + pixelToPoint(this.left), (startPoint.y + adjustHeight), pixelToPoint(updatedWidth), pixelToPoint(this.height), progressFormat);
                        }
                    }
                }
                this.isCompleted = false;
                this.width -= detail.totalWidth;
            }
            if (this.parent.renderBaseline && taskbar.baselineStartDate && taskbar.baselineEndDate) {

                if (detail.startDate <= taskbar.baselineStartDate && taskbar.baselineEndDate <= detail.endDate) {
                    if (!this.isStartPoint) {
                        this.taskStartPoint = { ...startPoint };
                        this.isStartPoint = true;
                    }

                    if (this.parent.renderBaseline && taskbar.baselineStartDate && taskbar.baselineEndDate) {
                        if (this.isAutoFit()) {
                            taskGraphics.drawRectangle(baselinePen, baselineBrush, startPoint.x + (taskbar.baselineLeft - cumulativeWidth) + 0.5, startPoint.y + adjustHeight + pixelToPoint(taskbar.height + 3), (taskbar.baselineWidth), pixelToPoint(this.baselineHeight));
                        }
                        else {
                            taskGraphics.drawRectangle(baselinePen, baselineBrush, startPoint.x + pixelToPoint(taskbar.baselineLeft - cumulativeWidth) + 0.5, startPoint.y + adjustHeight + pixelToPoint(taskbar.height + 3), pixelToPoint(taskbar.baselineWidth), pixelToPoint(this.baselineHeight));
                        }
                    }
                    this.isCompletedBaseline = true;
                    this.startPage = pageIndex;
                    this.endPage = pageIndex;
                }
                else if (detail.startDate <= taskbar.baselineStartDate && detail.endDate >= taskbar.baselineStartDate && (taskbar.baselineEndDate >= detail.endDate)) {
                    if (!this.isStartPoint) {
                        this.taskStartPoint = { ...startPoint };
                        this.isStartPoint = true;
                    }
                    let width = this.baselineWidth;
                    let renderWidth: number = 0;
                    renderWidth = (detail.totalWidth - (taskbar.baselineLeft - cumulativeWidth));
                    if (width < renderWidth) {
                        renderWidth = width
                    }
                    if (this.parent.renderBaseline && taskbar.baselineStartDate && taskbar.baselineEndDate) {
                        if (this.isAutoFit()) {
                            taskGraphics.drawRectangle(baselinePen, baselineBrush, startPoint.x + (taskbar.baselineLeft - cumulativeWidth) + 0.5, startPoint.y + adjustHeight + pixelToPoint(taskbar.height + 3), (renderWidth), pixelToPoint(this.baselineHeight));
                        }
                        else {
                            taskGraphics.drawRectangle(baselinePen, baselineBrush, startPoint.x + pixelToPoint(taskbar.baselineLeft - cumulativeWidth) + 0.5, startPoint.y + adjustHeight + pixelToPoint(taskbar.height + 3), pixelToPoint(renderWidth), pixelToPoint(this.baselineHeight));

                        }
                    }

                    taskbar.baselineWidth = taskbar.baselineWidth - renderWidth;


                    this.baselineLeft = 0;
                    this.isCompletedBaseline = false;
                    this.startPage = pageIndex;
                }
                else if (taskbar.baselineEndDate <= detail.endDate && detail.startDate <= taskbar.baselineEndDate && !this.isCompletedBaseline) {
                    if (this.parent.renderBaseline && taskbar.baselineStartDate && taskbar.baselineEndDate) {
                        if (this.isAutoFit()) {
                            taskGraphics.drawRectangle(baselinePen, baselineBrush, startPoint.x + (taskbar.baselineLeft + 0.5), startPoint.y + adjustHeight + pixelToPoint(taskbar.height + 3), (taskbar.baselineWidth), pixelToPoint(this.baselineHeight));
                        }
                        else {
                            taskGraphics.drawRectangle(baselinePen, baselineBrush, startPoint.x + pixelToPoint(taskbar.baselineLeft + 0.5), startPoint.y + adjustHeight + pixelToPoint(taskbar.height + 3), pixelToPoint(taskbar.baselineWidth), pixelToPoint(this.baselineHeight));

                        }
                    }

                    this.isCompletedBaseline = true;
                    this.endPage = pageIndex;
                }
                else if (taskbar.baselineStartDate < detail.startDate && taskbar.baselineEndDate > detail.endDate) {
                    if (this.parent.renderBaseline && taskbar.baselineStartDate && taskbar.baselineEndDate) {
                        if (this.isAutoFit()) {
                            taskGraphics.drawRectangle(baselinePen, baselineBrush, startPoint.x + (taskbar.baselineLeft) + 0.5, startPoint.y + adjustHeight + pixelToPoint(taskbar.height + 3), (detail.totalWidth), pixelToPoint(taskbar.baselineHeight));
                        }
                        else {
                            taskGraphics.drawRectangle(baselinePen, baselineBrush, startPoint.x + pixelToPoint(taskbar.baselineLeft) + 0.5, startPoint.y + adjustHeight + pixelToPoint(taskbar.height + 3), pixelToPoint(detail.totalWidth), pixelToPoint(taskbar.baselineHeight));

                        }
                    }

                    this.isCompletedBaseline = false;
                    this.baselineWidth -= detail.totalWidth;
                }

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
                    let progressWidth: number = 0;
                    renderWidth = (detail.totalWidth - (this.autoLeft - cumulativeWidth));
                    progressWidth = (detail.totalWidth - (this.autoLeft - cumulativeWidth))
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
                        taskGraphics.drawRectangle(null, manualProgressBrush, startPoint.x + pixelToPoint(this.autoLeft - cumulativeWidth) + 0.5, startPoint.y + adjustHeight +10, pixelToPoint(progressWidth), pixelToPoint(12)); 
                    }
                    taskbar.autoWidth = taskbar.autoWidth - renderWidth;
                    taskbar.progressWidth = taskbar.progressWidth - progressWidth;
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
                        taskGraphics.drawRectangle(manualParentBorderPen, null, startPoint.x + pixelToPoint(this.autoLeft + 0.5), startPoint.y + adjustHeight+10, pixelToPoint(taskbar.autoWidth), pixelToPoint(12));
                        taskGraphics.save();
                        taskGraphics.setTransparency(0.87);
                        taskGraphics.drawRectangle(manualBrush, startPoint.x + pixelToPoint(this.autoLeft + 0.5), startPoint.y + adjustHeight+10, pixelToPoint(taskbar.autoWidth), pixelToPoint(12));
                        taskGraphics.restore();
                        taskGraphics.drawRectangle(null, manualProgressBrush, startPoint.x + pixelToPoint(this.autoLeft + 0.5), startPoint.y + adjustHeight+10, pixelToPoint(taskbar.progressWidth), pixelToPoint(12));
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
                        let progressBoundsWidth: number = 0;
                        if (this.progressWidth <= detail.totalWidth) {
                            progressBoundsWidth = this.progressWidth;
                        } else {
                            progressBoundsWidth = detail.totalWidth;
                        }
                        if (this.isAutoFit()) {
                            taskGraphics.drawRectangle(null, manualProgressBrush, startPoint.x + (this.autoLeft + 0.5), startPoint.y + adjustHeight + 10, (progressBoundsWidth), pixelToPoint(12));
                        }
                        else {
                            if (taskbar.progressWidth !== 0) {
                                taskGraphics.drawRectangle(null, manualProgressBrush, startPoint.x + pixelToPoint(this.autoLeft + 0.5), startPoint.y + adjustHeight + 10, pixelToPoint(progressBoundsWidth), pixelToPoint(12))
                            }
                        }
                        this.progressWidth -= progressBoundsWidth;
                        if (this.isAutoFit()) {
                            taskGraphics.drawRectangle(manualParentBorderPen, null, startPoint.x + (this.autoLeft) + 0.5, startPoint.y + adjustHeight + 10, (detail.totalWidth), pixelToPoint(12));
                        }
                        else {
                            taskGraphics.drawRectangle(manualParentBorderPen, null, startPoint.x + pixelToPoint(this.autoLeft) + 0.5, startPoint.y + adjustHeight + 10, pixelToPoint(detail.totalWidth), pixelToPoint(12));
                        }
                        taskGraphics.save();
                        taskGraphics.setTransparency(0.87);
                        
                        if (this.isAutoFit()) {
                            taskGraphics.drawRectangle(null, manualBrush, startPoint.x + (this.autoLeft - cumulativeWidth) + 0.5, startPoint.y + adjustHeight + 10, (detail.totalWidth), pixelToPoint(12));
                        }
                        else {
                            taskGraphics.drawRectangle(null, manualBrush, startPoint.x + pixelToPoint(this.autoLeft) + 0.5, startPoint.y + adjustHeight + 10, pixelToPoint(detail.totalWidth), pixelToPoint(12));
                        }
                        taskGraphics.restore();
                        

                    }
                    this.isCompletedAutotask = false;
                    this.autoWidth -= detail.totalWidth;
                }     
            }
            if(!isNullOrUndefined(taskbar.indicators) && taskbar.indicators.length > 0){
                    
                taskbar.indicators.map((items: IIndicator, index: number) => {
                    const currendate = this.parent.dateValidationModule.getDateFromFormat(items.date, true)
                    if (detail.startDate <= currendate && currendate <= detail.endDate) {
                        const leftValue: number = this.parent.chartRowsModule.getIndicatorleft(items.date);
                        if (!isNullOrUndefined(items.base64)) {
                            const image: PdfBitmap = new PdfBitmap(items.base64);
                            if (this.isAutoFit()) {
                                taskGraphics.drawImage(image, (startPoint.x + (leftValue - cumulativeWidth) + 0.5 + 10) - this.parent.perDayWidth / 2, startPoint.y + adjustHeight, imageSize, imageSize)
                                let state = taskGraphics.save();
                                taskGraphics.setClip(new RectangleF(startPoint.x, startPoint.y, page['contentWidth'], rowHeight));
                                taskGraphics.drawString(items.name, font, null, PdfBrushes.Black, (startPoint.x + (leftValue - cumulativeWidth) + 0.5 + 15 + imageSize) - this.parent.perDayWidth / 2, startPoint.y + adjustHeight, null);
                                taskGraphics.restore(state);
                            }
                            else {
                                taskGraphics.drawImage(image, startPoint.x + pixelToPoint(leftValue - cumulativeWidth) + 0.5 + 10, startPoint.y + adjustHeight, imageSize, imageSize)
                                let state = taskGraphics.save();
                                taskGraphics.setClip(new RectangleF(startPoint.x, startPoint.y, page['contentWidth'], rowHeight));
                                taskGraphics.drawString(items.name, font, null, PdfBrushes.Black, startPoint.x + pixelToPoint(leftValue - cumulativeWidth) + 0.5 + 15 + imageSize, startPoint.y + adjustHeight, null);
                                taskGraphics.restore(state);
                            }
                        }
                    }
                })
            }
        } else {
            this.drawMilestone(page, startPoint, detail, cumulativeWidth, taskbar, false);
            if (this.parent.renderBaseline && taskbar.baselineStartDate && taskbar.baselineEndDate) {
                this.drawMilestone(page, startPoint, detail, cumulativeWidth, taskbar, true);
            }
        }
        this.drawRightLabel(page, startPoint, detail, cumulativeWidth);
        return isNextPage;
    }
    /* eslint-enable */
    /**
     * @param {IGanttStyle} ganttStyle .
     * @returns {PdfFont}
     * Customizes the font based on the Gantt style.
     */
    private getPdfFont(ganttStyle: IGanttStyle): PdfFont {
        let font: PdfFont;
        if (ganttStyle && ganttStyle.label && (ganttStyle.label.fontSize || ganttStyle.label.fontStyle ||
            ganttStyle.label.fontFamily)) {
            const fontSize: number = ganttStyle.label.fontSize ? ganttStyle.label.fontSize : 9;
            const fontFamilyValue: any = ganttStyle.label.fontFamily;
            const fontFamily: PdfFontFamily = ganttStyle.label.fontFamily ?
                fontFamilyValue : this.fontFamily;
            const fontStyleValue: any = ganttStyle.label.fontStyle;
            const fontStyle: PdfFontStyle = ganttStyle.label.fontStyle ?
                this.parent.pdfExportModule.helper['getFontStyle'](fontStyleValue) : PdfFontStyle.Regular;
            font = new PdfStandardFont(fontFamily, fontSize, fontStyle);
        }
        return font;
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
        if (!isNullOrUndefined(this.rightTaskLabel.value)) {
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
                let customizedFont : PdfFont;
                const ganttStyle : IGanttStyle = this.parent.pdfExportModule['helper']['exportProps'].ganttStyle;
                if (!isNullOrUndefined(ganttStyle) && !isNullOrUndefined(ganttStyle.label) && (!isNullOrUndefined(ganttStyle.label.fontSize)
                    || !isNullOrUndefined(ganttStyle.label.fontStyle) ||
                    !isNullOrUndefined(ganttStyle.label.fontFamily))) {
                    customizedFont = this.getPdfFont(ganttStyle);
                }
                if (!isNullOrUndefined(customizedFont)) {
                    font = customizedFont;
                }
                let padding: any = { left: 0, right: 0, top: 0, bottom: 0 };
                if (!isNullOrUndefined(ganttStyle) && !isNullOrUndefined(ganttStyle.label) &&
                    !isNullOrUndefined(ganttStyle.label.padding)) {
                    padding = ganttStyle.label.padding;
                }
                if (!isNullOrUndefined(this.parent.pdfExportModule['helper']['exportProps'].ganttStyle) &&
                    this.parent.pdfExportModule['helper']['exportProps'].ganttStyle.font) {
                    font = this.parent.pdfExportModule['helper']['exportProps'].ganttStyle.font;
                }
                const adjustHeight: number = (pixelToPoint(this.parent.rowHeight) - result.actualSize.height) / 2;
                const point: PointF = new PointF(actualLeft + padding.left, startPoint.y + adjustHeight + padding.top);
                const size: SizeF = new SizeF((page['contentWidth'] - actualLeft) - (padding.left + padding.right),
                                              result.actualSize.height - (padding.top + padding.bottom));
                const labelBounds: RectangleF = new RectangleF(point, size);
                const labelFormat: PdfStringFormat = new PdfStringFormat();
                labelFormat.alignment = PdfTextAlignment.Left;
                labelFormat.lineAlignment = PdfVerticalAlignment.Middle;
                if (!isNullOrUndefined(ganttStyle) && !isNullOrUndefined(ganttStyle.label) && !isNullOrUndefined(ganttStyle.label.format) &&
                                                                        !isNullOrUndefined(ganttStyle.label.format.alignment)) {
                    labelFormat.alignment = ganttStyle.label.format.alignment;
                }
                if (result.actualSize.width > 0) {
                    const fontColor: PdfPen = null;
                    const ganttStyle : IGanttStyle = this.parent.pdfExportModule['helper']['exportProps'].ganttStyle;
                    const fontBrush: PdfBrush = new PdfSolidBrush((ganttStyle && ganttStyle.label && ganttStyle.label.fontBrush) ?
                        ganttStyle.label.fontBrush : this.labelColor);
                    /* eslint-disable-next-line */
                    let labelBrush :PdfBrush = null;
                    if (!isNullOrUndefined(ganttStyle) && !isNullOrUndefined(ganttStyle.label) &&
                                                                            !isNullOrUndefined(ganttStyle.label.backgroundColor)) {
                        labelBrush = new PdfSolidBrush(ganttStyle.label.backgroundColor);
                    }
                    let lablePen: PdfPen = null;
                    if (!isNullOrUndefined(ganttStyle) && !isNullOrUndefined(ganttStyle.label) &&
                                                                            !isNullOrUndefined(ganttStyle.label.borderColor)) {
                        lablePen = new PdfPen(ganttStyle.label.borderColor);
                    }
                    const strSize: SizeF = font.measureString(result.lines[0].text);
                    graphics.drawRectangle(lablePen, labelBrush, labelBounds.x - 3, labelBounds.y, strSize.width + 6, strSize.height);
                    graphics.drawString(result.lines[0].text, font, fontColor, fontBrush, labelBounds.x,
                                        labelBounds.y, size.width, size.height, labelFormat);
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
        else {
            if (!isNullOrUndefined(this.labelSettings.rightLabel.image)) {
                this.previousWidthofRightImage = 0;
                this.previousWidthofRightValue = 0;
                for (let i: number = 0; i < this.labelSettings.rightLabel.image.length; i++) {
                    this.drawRigthlabelImage(page, startPoint, detail, cumulativeWidth,
                                             this.labelSettings.rightLabel.image[i as number]);
                    if (this.labelSettings.rightLabel.value) {
                        const value: string[] = this.labelSettings.rightLabel.value.split(',');
                        if (value) {
                            this.rightTaskLabel.isCompleted = false;
                            this.drawRightLabelValue(page, startPoint, detail, cumulativeWidth, value[i as number]);
                        }
                    }
                }
            }
            else if (this.labelSettings.rightLabel.value) {
                this.drawRightLabelValue(page, startPoint, detail, cumulativeWidth, this.labelSettings.rightLabel.value);
            }
        }
    }
    private drawRigthlabelImage(page: PdfPage, startPoint: PointF, detail: TimelineDetails,
                                cumulativeWidth: number, rightImage: Image): void {
        let left: number;
        const graphics: PdfGraphics = page.graphics;
        let labelBounds: RectangleF;
        if (!isNullOrUndefined(this.labelSettings.rightLabel) && !isNullOrUndefined(this.labelSettings.rightLabel.image)) {
            if (this.labelSettings.isLeftCalculated) {
                left = this.rightTaskLabel.left;
            } else {
                if (this.isAutoFit()) {
                    if (this.labelSettings.rightLabel.image.length > 1) {
                        left = this.rightTaskLabel.left + + this.previousWidthofRightValue;
                        this.previousWidthofRightImage = rightImage.width;
                    } else {
                        left = (this.rightTaskLabel.left);
                    }
                }
                else {
                    let value: string[];
                    if (!isNullOrUndefined(this.labelSettings.rightLabel.value)) {
                        value = this.labelSettings.rightLabel.value.split(',');
                    }
                    if (this.labelSettings.rightLabel.image.length > 1 && value.length > 1) {
                        left = pixelToPoint(this.rightTaskLabel.left) + this.previousWidthofRightValue;
                        this.previousWidthofRightImage = rightImage.width;
                    }
                    else if (this.labelSettings.rightLabel.image.length > 1) {
                        left = pixelToPoint(this.rightTaskLabel.left) + this.previousWidthofRightImage;
                        this.previousWidthofRightImage = rightImage.width;
                    }
                    else {
                        left = pixelToPoint(this.rightTaskLabel.left);
                    }
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
                !isNullOrUndefined(this.labelSettings.rightLabel) && !this.rightTaskLabel.isCompleted) {
                const result: SizeF = new SizeF(rightImage.width, rightImage.height);
                const adjustHeight: number = (pixelToPoint(this.parent.rowHeight) - result.height) / 2;
                const point: PointF = new PointF(actualLeft, startPoint.y + adjustHeight);
                const size: SizeF = new SizeF(result.width, result.height);
                labelBounds = new RectangleF(point, size);
                const image: PdfBitmap = new PdfBitmap(rightImage.base64);
                if (result.width > 0) {
                    graphics.drawImage(image, labelBounds.x, labelBounds.y, result.width, result.height);
                    if (this.labelSettings.rightLabel.value !== null) {
                        this.rightTaskLabel.isLeftCalculated = true;
                    } else {
                        if (isNullOrUndefined(this.labelSettings.rightLabel.value)) {
                            this.rightTaskLabel.isCompleted = true;
                        }

                    }
                } else {
                    this.rightTaskLabel.left = detail.endPoint;
                }
            }
        }
    }
    private drawRightLabelValue(page: PdfPage, startPoint: PointF, detail: TimelineDetails, cumulativeWidth: number,
                                rightString: string): void {
        let left: number;
        const graphics: PdfGraphics = page.graphics;
        if (!isNullOrUndefined(this.labelSettings.rightLabel.value)) {
            if (this.labelSettings.isLeftCalculated) {
                left = this.rightTaskLabel.left;
            } else {
                if (this.isAutoFit()) {
                    if (this.labelSettings.rightLabel.image) {
                        if (this.labelSettings.rightLabel.image.length > 1) {
                            left = this.rightTaskLabel.left + this.previousWidthofRightImage + this.previousWidthofRightValue;
                            if (!isNullOrUndefined(rightString)) {
                                const result: PdfStringLayoutResult = this.getWidthofrightLabel(rightString, detail.endPoint - left, 15);
                                this.previousWidthofRightValue += result.actualSize.width + this.previousWidthofRightImage;
                            }
                        }
                        else {
                            left = this.rightTaskLabel.left + this.labelSettings.rightLabel.image[0].width;
                        }
                    }
                    else {
                        left = (this.rightTaskLabel.left);
                    }

                }
                else {
                    if (this.labelSettings.rightLabel.image) {
                        if (this.labelSettings.rightLabel.image.length > 1) {
                            left = pixelToPoint(this.rightTaskLabel.left) + this.previousWidthofRightImage + this.previousWidthofRightValue;
                            if (!isNullOrUndefined(rightString)) {
                                const result: PdfStringLayoutResult = this.getWidthofrightLabel(rightString, detail.endPoint - left, 15);
                                this.previousWidthofRightValue += result.actualSize.width + this.previousWidthofRightImage;
                            }
                        }
                        else {
                            left = pixelToPoint(this.rightTaskLabel.left) + this.labelSettings.rightLabel.image[0].width;

                        }
                    }
                    else {
                        left = pixelToPoint(this.rightTaskLabel.left);
                    }
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
                !isNullOrUndefined(rightString) && !this.rightTaskLabel.isCompleted) {
                const result: PdfStringLayoutResult = this.getWidthofrightLabel(rightString, detail.endPoint - left, 15);
                let font: PdfFont = new PdfStandardFont(this.fontFamily, 9);
                if (!isNullOrUndefined(this.parent.pdfExportModule['helper']['exportProps'].ganttStyle) &&
                    this.parent.pdfExportModule['helper']['exportProps'].ganttStyle.font) {
                    font = this.parent.pdfExportModule['helper']['exportProps'].ganttStyle.font;
                }
                const adjustHeight: number = (pixelToPoint(this.parent.rowHeight) - result.actualSize.height) / 2;
                const point: PointF = new PointF(actualLeft, startPoint.y + adjustHeight);
                const size: SizeF = new SizeF(result.actualSize.width, result.actualSize.height);
                const labelBound: RectangleF = new RectangleF(point, size);
                const labelFormat: PdfStringFormat = new PdfStringFormat();
                labelFormat.alignment = PdfTextAlignment.Right;
                labelFormat.lineAlignment = PdfVerticalAlignment.Middle;
                if (result.actualSize.width > 0) {
                    const fontColor: PdfPen = null;
                    const fontBrush: PdfBrush = new PdfSolidBrush(this.labelColor);
                    const newFont: PdfFont = (this.labelSettings.rightLabel.fontStyle.fontSize) ? new PdfStandardFont(
                        this.labelSettings.rightLabel.fontStyle.fontFamily, this.labelSettings.rightLabel.fontStyle.fontSize,
                        this.labelSettings.rightLabel.fontStyle.fontStyle) : font;
                    const newFontBrush: PdfBrush = this.labelSettings.rightLabel.fontStyle.fontColor ?  new PdfSolidBrush(
                        this.labelSettings.rightLabel.fontStyle.fontColor) : fontBrush;
                    /* eslint-disable-next-line */
                    graphics.drawString(rightString, newFont, fontColor, newFontBrush, labelBound.x, labelBound.y, result.actualSize.width, result.actualSize.height, labelFormat);
                    if (!isNullOrUndefined(result.remainder) && result.remainder !== null) {
                        this.rightTaskLabel.value = result.remainder;
                        this.rightTaskLabel.left = detail.endPoint;
                        this.rightTaskLabel.isLeftCalculated = true;
                    } else {
                        if (isNullOrUndefined(this.labelSettings.rightLabel.value)) {
                            this.rightTaskLabel.isCompleted = true;
                        }
                    }
                } else {
                    this.rightTaskLabel.left = detail.endPoint;
                }
            }
        }
    }
    /**
     * @param {PdfPage} page .
     * @param {PointF} startPoint .
     * @param {TimelineDetails} detail .
     * @param {number} cumulativeWidth .
     * @param {PdfGanttTaskbarCollection} taskbar .
     * @returns {void}
     * Draw task left task label
     */
    private drawLeftLabel(
        page: PdfPage,
        startPoint: PointF,
        detail: TimelineDetails,
        cumulativeWidth: number,
        taskbar: PdfGanttTaskbarCollection
    ): void {
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
                if (!taskbar.isAutoSchedule && taskbar.isParentTask) {
                    const leftValue: number = taskbar.left - taskbar.autoLeft;
                    if (taskbar.left < taskbar.autoLeft) {
                        actualLeft = left - cumulativeWidth + startPoint.x;
                    }
                    else {
                        actualLeft = left - cumulativeWidth + startPoint.x - leftValue;
                    }
                }
            }
            else {
                actualLeft = left - pixelToPoint(cumulativeWidth) + startPoint.x;
                if (!taskbar.isAutoSchedule && taskbar.isParentTask) {
                    const leftValue: number = pixelToPoint(taskbar.left) - pixelToPoint(taskbar.autoLeft);
                    if (taskbar.left < taskbar.autoLeft) {
                        actualLeft = left - pixelToPoint(cumulativeWidth) + startPoint.x;
                    }
                    else {
                        actualLeft = left - pixelToPoint(cumulativeWidth) + startPoint.x - leftValue;
                    }
                }
            }
            if (detail.startPoint <= left && left < detail.endPoint && !isNullOrUndefined(this.leftTaskLabel.value)
                && !this.leftTaskLabel.isCompleted) {
                const result: PdfStringLayoutResult = this.getWidth(this.leftTaskLabel.value, detail.endPoint - left, 15);
                let font: PdfFont = new PdfStandardFont(this.fontFamily, 9);
                let customizedFont : PdfFont;
                const ganttStyle : IGanttStyle = this.parent.pdfExportModule['helper']['exportProps'].ganttStyle;
                if (!isNullOrUndefined(ganttStyle) && !isNullOrUndefined(ganttStyle.label) && (!isNullOrUndefined(ganttStyle.label.fontSize)
                    || !isNullOrUndefined(ganttStyle.label.fontStyle) ||
                    !isNullOrUndefined(ganttStyle.label.fontFamily))) {
                    customizedFont = this.getPdfFont(ganttStyle);
                }
                if (!isNullOrUndefined(customizedFont)) {
                    font = customizedFont;
                }
                if (!isNullOrUndefined(this.parent.pdfExportModule['helper']['exportProps'].ganttStyle) &&
                    this.parent.pdfExportModule['helper']['exportProps'].ganttStyle.font) {
                    font = this.parent.pdfExportModule['helper']['exportProps'].ganttStyle.font;
                }
                let padding: any = { left: 0, right: 0, top: 0, bottom: 0 };
                if (!isNullOrUndefined(ganttStyle) && !isNullOrUndefined(ganttStyle.label) &&
                         !isNullOrUndefined(ganttStyle.label.padding)) {
                    padding = ganttStyle.label.padding;
                }
                const adjustHeight: number = (pixelToPoint(this.parent.rowHeight) - result.actualSize.height) / 2;
                const rightLabelpoint: PointF = new PointF(actualLeft + padding.left, startPoint.y + adjustHeight + padding.top);
                const rightLabelSize: SizeF = new SizeF(result.actualSize.width - (padding.left + padding.right),
                                                        result.actualSize.height - (padding.top + padding.bottom));
                const rightLabelBounds: RectangleF = new RectangleF(rightLabelpoint, rightLabelSize);
                const rightLabelFormat: PdfStringFormat = new PdfStringFormat();
                rightLabelFormat.alignment = PdfTextAlignment.Right;
                rightLabelFormat.lineAlignment = PdfVerticalAlignment.Middle;
                if (result.actualSize.width > 0) {
                    const fontColor: PdfPen = null;
                    /* eslint-disable-next-line */
                    const fontBrush: PdfBrush = new PdfSolidBrush((ganttStyle && ganttStyle.label && ganttStyle.label.fontBrush) ?
                        ganttStyle.label.fontBrush : this.labelColor);
                    /* eslint-disable-next-line */
                    let labelBrush :PdfBrush = null;
                    if (!isNullOrUndefined(ganttStyle) && !isNullOrUndefined(ganttStyle.label) &&
                                                                            !isNullOrUndefined(ganttStyle.label.backgroundColor)) {
                        labelBrush = new PdfSolidBrush(ganttStyle.label.backgroundColor);
                    }
                    let lablePen: PdfPen = null;
                    if (!isNullOrUndefined(ganttStyle) && !isNullOrUndefined(ganttStyle.label) &&
                                                                            !isNullOrUndefined(ganttStyle.label.borderColor)) {
                        lablePen = new PdfPen(ganttStyle.label.borderColor);
                    }
                    const strSize: SizeF = font.measureString(result.lines[0].text);
                    graphics.drawRectangle(lablePen, labelBrush, rightLabelBounds.x - 3,
                                           rightLabelBounds.y, strSize.width + 6, strSize.height);
                    graphics.drawString(result.lines[0].text, font, fontColor, fontBrush, rightLabelBounds.x,
                                        rightLabelBounds.y, result.actualSize.width, result.actualSize.height, rightLabelFormat);
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
        else {
            if (!isNullOrUndefined(this.labelSettings.leftLabel) && !isNullOrUndefined(this.labelSettings.leftLabel.image)) {
                this.previousWidthofLeftImage = 0;
                this.previousWidthofLeftValue = 0;
                this.totalLeftWidth = 0;
                for (let i: number = 0; i < this.labelSettings.leftLabel.image.length; i++) {
                    let value: string[];
                    let result: PdfStringLayoutResult;
                    if (!isNullOrUndefined(this.labelSettings.leftLabel.value)) {
                        value = this.labelSettings.leftLabel.value.split(',');
                        result = this.getWidth(value[i as number], Number.MAX_VALUE, 15);
                    }
                    const totalstringWidth: number = !isNullOrUndefined(result) ? result.actualSize.width : 0;
                    this.totalLeftWidth += this.labelSettings.leftLabel.image[i as number].width + totalstringWidth;
                }
                for (let i: number = 0; i < this.labelSettings.leftLabel.image.length; i++) {
                    this.drawLeftLabelImage(page, startPoint, detail, cumulativeWidth, this.labelSettings.leftLabel.image[i as number]);
                    if (this.labelSettings.leftLabel.value) {
                        const value: string[] = this.labelSettings.leftLabel.value.split(',');
                        if (value) {
                            this.drawLeftLabelValue(page, startPoint, detail, cumulativeWidth, value[i as number]);
                        }
                    }
                }

            }
            else if (!isNullOrUndefined(this.labelSettings.leftLabel) && !isNullOrUndefined(this.labelSettings.leftLabel.value)) {
                this.drawLeftLabelValue(page, startPoint, detail, cumulativeWidth, this.labelSettings.leftLabel.value);
            }
        }
    }
    private drawLeftLabelImage(page: PdfPage, startPoint: PointF, detail: TimelineDetails, cumulativeWidth: number,
                               leftLabelImage: Image): void {
        const graphics: PdfGraphics = page.graphics;
        let left: number;
        let labelLeft: number = 0;
        labelLeft = this.left;
        if (!isNullOrUndefined(this.labelSettings.leftLabel) && !isNullOrUndefined(this.labelSettings.leftLabel.image)) {
            if (!this.leftTaskLabel.isLeftCalculated) {
                const result: SizeF = new SizeF(leftLabelImage.width, leftLabelImage.height);
                const reduceLeft: number = this.isMilestone ? Math.floor(this.parent.chartRowsModule.taskBarHeight / 2) + 33 : 33; // 33 indicates default timeline cell width
                const value: string[] = this.labelSettings.leftLabel.value.split(',');
                if (this.isAutoFit()) {
                    if (this.labelSettings.leftLabel.image.length > 0 && value.length > 0) {
                        left = labelLeft - this.totalLeftWidth - result.width;
                        this.previousWidthofLeftImage += result.width;
                    } else {
                        left = (labelLeft - reduceLeft) - result.width;
                    }

                }
                else {
                    if (this.labelSettings.leftLabel.image.length > 0 && value.length > 0) {
                        left = pixelToPoint(labelLeft) - this.totalLeftWidth - result.width;
                        this.previousWidthofLeftImage += result.width;
                    }
                    else {
                        left = pixelToPoint(labelLeft - reduceLeft) - result.width;
                    }
                }
                this.leftTaskLabel.left = left;
                this.leftTaskLabel.isLeftCalculated = true;
            } else {
                if (this.labelSettings.leftLabel.image.length > 1) {
                    left = this.leftTaskLabel.left + this.previousWidthofLeftValue;
                }
                else {
                    left = this.leftTaskLabel.left;
                }

            }
            let actualLeft: number;
            if (this.isAutoFit()) {
                actualLeft = left - pixelToPoint(cumulativeWidth) + startPoint.x;
            }
            else {
                actualLeft = left - pixelToPoint(cumulativeWidth) + startPoint.x;
            }
            if (detail.startPoint <= left && left < detail.endPoint && !isNullOrUndefined(leftLabelImage)
                && !this.leftTaskLabel.isCompleted) {
                const result: SizeF = new SizeF(leftLabelImage.width, leftLabelImage.height);
                const adjustHeight: number = (pixelToPoint(this.parent.rowHeight) - result.height) / 2;
                const rightLabelpoint: PointF = new PointF(actualLeft, startPoint.y + adjustHeight);
                const rightLabelSize: SizeF = new SizeF(result.width, result.height);
                const rightLabelBounds: RectangleF = new RectangleF(rightLabelpoint, rightLabelSize);
                const image: PdfBitmap = new PdfBitmap(leftLabelImage.base64);
                if (result.width > 0) {
                    graphics.drawImage(image, rightLabelBounds.x, rightLabelBounds.y, result.width, result.height);
                    this.totalLeftWidth = this.totalLeftWidth - result.width;
                } else {
                    this.leftTaskLabel.left = detail.endPoint;
                }
            }
        }
    }
    private drawLeftLabelValue(page: PdfPage, startPoint: PointF, detail: TimelineDetails,
                               cumulativeWidth: number, leftLabelValue: string): void {
        const graphics: PdfGraphics = page.graphics;
        let left: number;
        if (!isNullOrUndefined(leftLabelValue)) {
            let labelLeft: number = 0;
            labelLeft = this.left;
            if (!this.leftTaskLabel.isLeftCalculated) {
                const result: PdfStringLayoutResult = this.getWidthofLeftLabel(leftLabelValue, Number.MAX_VALUE, 15);
                const reduceLeft: number = this.isMilestone ? Math.floor(this.parent.chartRowsModule.taskBarHeight / 2) + 33 : 33; // 33 indicates default timeline cell width
                const value: string[] = this.labelSettings.leftLabel.value.split(',');
                if (this.isAutoFit()) {
                    const isLeftImageExist: boolean = !isNullOrUndefined(this.labelSettings.leftLabel.image) ? true : false;
                    const imageLength: number = isLeftImageExist ? this.labelSettings.leftLabel.image.length : 0;
                    if (value.length === 1 && isLeftImageExist && imageLength === 1) {
                        left = this.leftTaskLabel.left + this.previousWidthofLeftImage;
                        this.labelSettings.left = left;
                        const result: PdfStringLayoutResult = this.getWidthofLeftLabel(leftLabelValue, Number.MAX_VALUE, 15);
                        this.previousWidthofLeftValue += this.previousWidthofLeftImage + result.actualSize.width;
                    }
                    else if (value.length > 1 && isLeftImageExist && imageLength > 1) {
                        const totalWidth: number = (this.previousWidthofLeftValue !== 0) ? this.previousWidthofLeftValue
                            + this.previousWidthofLeftImage : this.previousWidthofLeftImage;
                        left = this.leftTaskLabel.left + totalWidth;
                        this.labelSettings.left = left;
                        const result: PdfStringLayoutResult = this.getWidthofLeftLabel(leftLabelValue, Number.MAX_VALUE, 15);
                        this.previousWidthofLeftValue += this.previousWidthofLeftImage + result.actualSize.width;
                    }
                    else {
                        left = (labelLeft - reduceLeft) - result.actualSize.width;
                    }
                }
                else {
                    left = pixelToPoint(labelLeft - reduceLeft) - result.actualSize.width;
                }
                this.leftTaskLabel.left = left;
                this.leftTaskLabel.isLeftCalculated = true;
            } else {
                const value: string[] = this.labelSettings.leftLabel.value.split(',');
                if (value.length === 1) {
                    left = this.leftTaskLabel.left + this.previousWidthofLeftImage;
                    this.labelSettings.left = left;
                    const result: PdfStringLayoutResult = this.getWidthofLeftLabel(leftLabelValue, Number.MAX_VALUE, 15);
                    this.previousWidthofLeftValue += this.previousWidthofLeftImage + result.actualSize.width;
                }
                else if (value.length > 1) {
                    const totalWidth: number = (this.previousWidthofLeftValue !== 0) ?
                        this.previousWidthofLeftValue + this.previousWidthofLeftImage
                        : this.previousWidthofLeftImage;
                    left = this.leftTaskLabel.left + totalWidth;
                    this.labelSettings.left = left;
                    const result: PdfStringLayoutResult = this.getWidthofLeftLabel(leftLabelValue, Number.MAX_VALUE, 15);
                    this.previousWidthofLeftValue += this.previousWidthofLeftImage + result.actualSize.width;
                }
                else {
                    left = this.leftTaskLabel.left;
                }
            }
            let actualLeft: number;
            if (this.isAutoFit()) {
                actualLeft = left - pixelToPoint(cumulativeWidth) + startPoint.x;
            }
            else {
                actualLeft = left - pixelToPoint(cumulativeWidth) + startPoint.x;
            }
            if (detail.startPoint <= left && left < detail.endPoint && !isNullOrUndefined(leftLabelValue)
                && !this.leftTaskLabel.isCompleted) {
                const result: PdfStringLayoutResult = this.getWidthofLeftLabel(leftLabelValue, detail.endPoint - left, 15);
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
                    const newFont : PdfFont = (this.labelSettings.leftLabel.fontStyle.fontSize) ? new PdfStandardFont(
                        this.labelSettings.leftLabel.fontStyle.fontFamily, this.labelSettings.leftLabel.fontStyle.fontSize,
                        this.labelSettings.leftLabel.fontStyle.fontStyle) : font;
                    const newFontBrush : PdfBrush = this.labelSettings.leftLabel.fontStyle.fontColor ?
                        new PdfSolidBrush(this.labelSettings.leftLabel.fontStyle.fontColor) : fontBrush;
                    graphics.drawString(leftLabelValue, newFont, fontColor, newFontBrush, rightLabelBounds.x,
                                        rightLabelBounds.y, result.actualSize.width, result.actualSize.height, rightLabelFormat);
                    const value: string[] = this.labelSettings.leftLabel.value.split(',');
                    if ((!isNullOrUndefined(result.remainder)) && result.remainder !== null) {
                        this.leftTaskLabel.value = result.remainder;
                        this.leftTaskLabel.left = detail.endPoint;
                    }
                    else if (!isNullOrUndefined(this.labelSettings.leftLabel.image) &&
                        this.labelSettings.leftLabel.image.length === 1 && value.length === 1) {
                        this.leftTaskLabel.isCompleted = true;
                    }
                } else {
                    this.leftTaskLabel.left = detail.endPoint;
                }
            }
        }
    }
    private getWidth(value: string, width: number, height: number): PdfStringLayoutResult {
        let font: PdfFont;
        font = new PdfStandardFont(this.fontFamily, 9);
        const ganttStyle : IGanttStyle = this.parent.pdfExportModule['helper']['exportProps'].ganttStyle;
        if (ganttStyle && ganttStyle.label && ganttStyle.label.fontSize) {
            font = new PdfStandardFont(this.fontFamily, ganttStyle.label.fontSize);
            height = font.height;
        }
        if (!isNullOrUndefined(ganttStyle) && ganttStyle.font) {
            font = ganttStyle.font;
            height = font.height;
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
    private getWidthofLeftLabel(value: string, width: number, height: number): PdfStringLayoutResult {
        const newFont: PdfFont = new PdfStandardFont(
            this.labelSettings.leftLabel.fontStyle.fontFamily, this.labelSettings.leftLabel.fontStyle.fontSize);
        let font : PdfFont;
        if (this.labelSettings.leftLabel.fontStyle.fontSize) {
            font = newFont;
        }
        else {
            font = new PdfStandardFont(this.fontFamily, 9);
        }
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
    private getWidthofrightLabel(value: string, width: number, height: number): PdfStringLayoutResult {
        const newFont: PdfFont = new PdfStandardFont(
            this.labelSettings.rightLabel.fontStyle.fontFamily, this.labelSettings.rightLabel.fontStyle.fontSize);
        let font : PdfFont;
        if (this.labelSettings.rightLabel.fontStyle.fontSize) {
            font = newFont;
        }
        else {
            font = new PdfStandardFont(this.fontFamily, 9);
        }
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
        if (this.isAutoFit()) {
            taskGraphics.drawRectangle(taskBrush, startPoint.x + (this.left - cumulativeWidth),
                                       startPoint.y + adjustHeight, pixelToPoint(3), pixelToPoint(this.height));
        }
        else {
            taskGraphics.drawRectangle(taskBrush, startPoint.x + pixelToPoint(this.left - cumulativeWidth),
                                       startPoint.y + adjustHeight, pixelToPoint(3), pixelToPoint(this.height));
        }
    }
    /**
     * @param {PdfPage} page .
     * @param {PointF} startPoint .
     * @param {TimelineDetails} detail .
     * @param {number} cumulativeWidth .
     * @param {PdfGanttTaskbarCollection} taskbar .
     * @param {boolean} isBaseline .
     * @returns {void}
    Draw milestone task
     */
    private drawMilestone(page: PdfPage, startPoint: PointF, detail: TimelineDetails,
                          cumulativeWidth: number, taskbar: PdfGanttTaskbarCollection, isBaseline: boolean): void {
        if (detail.startDate <= this.startDate && this.startDate <= detail.endDate) {
            const taskGraphics: PdfGraphics = page.graphics;
            const pageIndex: number = page.section.indexOf(page);
            this.taskStartPoint = { ...startPoint };
            const milestonePen: PdfPen = new PdfPen(this.milestoneColor);
            const adjustHeightforBaselineMilesone: number = pixelToPoint(((this.parent.rowHeight - this.height) / 3.0));
            const adjustHeightforMilesone: number = pixelToPoint(((this.parent.rowHeight - this.height) / 2.0));
            const adjustHeight: number = this.parent.renderBaseline ? adjustHeightforBaselineMilesone : adjustHeightforMilesone;
            const milestoneBrush: PdfBrush = new PdfSolidBrush(this.milestoneColor);
            const baselinePen: PdfPen = new PdfPen(this.baselineBorderColor);
            const baselineBrush: PdfBrush = new PdfSolidBrush(this.baselineColor);
            taskGraphics.save(); //saving graphics state
            const height: number = Math.floor(this.parent.chartRowsModule.taskBarHeight * 0.8);
            if (!isBaseline) {
                if (this.isAutoFit()) {
                    taskGraphics.translateTransform(startPoint.x + (this.left - cumulativeWidth),
                                                    startPoint.y + adjustHeight - (this.parent.chartRowsModule.taskBarHeight * 0.7) / 2);
                }
                else {
                    taskGraphics.translateTransform(startPoint.x + pixelToPoint(this.left - cumulativeWidth),
                                                    startPoint.y + adjustHeight - (this.parent.chartRowsModule.taskBarHeight * 0.7) / 2);
                }
            }
            if (isBaseline) {
                if (this.isAutoFit()) {
                    taskGraphics.translateTransform(startPoint.x + (taskbar.baselineLeft - cumulativeWidth),
                                                    startPoint.y + adjustHeight - (this.parent.chartRowsModule.taskBarHeight * 0.7) / 2);
                }
                else {
                    taskGraphics.translateTransform(startPoint.x + pixelToPoint(taskbar.baselineLeft - cumulativeWidth),
                                                    startPoint.y + adjustHeight - (this.parent.chartRowsModule.taskBarHeight * 0.7) / 2);
                }
            }
            taskGraphics.rotateTransform(45); //apply rotation
            if (this.parent.renderBaseline && this.baselineStartDate && this.baselineEndDate && isBaseline) {
                taskGraphics.drawRectangle(baselinePen, baselineBrush, 2, 2, pixelToPoint(height), pixelToPoint(height));
            }
            if (!isBaseline) {
                taskGraphics.drawRectangle(milestonePen, milestoneBrush, 0, 0, pixelToPoint(height), pixelToPoint(height));
            }
            taskGraphics.restore(); //restoring graphics state
            if (this.isAutoFit()) {
                if (!isNullOrUndefined(taskbar.taskbarTemplate.image)) {
                    const image: PdfBitmap = new PdfBitmap(taskbar.taskbarTemplate.image[0].base64);
                    const x: number = startPoint.x + (this.left - cumulativeWidth) - (this.parent.chartRowsModule.taskBarHeight * 0.7) / 2 +
                    ((this.parent.chartRowsModule.taskBarHeight * 0.7) - taskbar.taskbarTemplate.image[0].height) / 1.0;
                    const width: number = taskbar.taskbarTemplate.image[0].width / 2.0;
                    const height: number = taskbar.taskbarTemplate.image[0].height / 2.0;
                    taskGraphics.drawImage(image, x, startPoint.y + adjustHeight - (this.parent.chartRowsModule.taskBarHeight * 0.7) / 2 +
                    (((this.parent.chartRowsModule.taskBarHeight * 0.7) - taskbar.taskbarTemplate.image[0].height) / 0.5), width , height);
                }
            }
            else{
                if (!isNullOrUndefined(taskbar.taskbarTemplate.image)) {
                    const image: PdfBitmap = new PdfBitmap(taskbar.taskbarTemplate.image[0].base64);
                    const x : number = startPoint.x + pixelToPoint(
                        this.left - cumulativeWidth) - (this.parent.chartRowsModule.taskBarHeight * 0.7) / 2 +
                    pixelToPoint((this.parent.chartRowsModule.taskBarHeight * 0.7) - taskbar.taskbarTemplate.image[0].height) / 1.0;
                    taskGraphics.drawImage(image, x , startPoint.y + adjustHeight - (this.parent.chartRowsModule.taskBarHeight * 0.7) / 2 +
                    pixelToPoint(((this.parent.chartRowsModule.taskBarHeight * 0.7) - taskbar.taskbarTemplate.image[0].height) / 0.5),
                                           pixelToPoint(taskbar.taskbarTemplate.image[0].width),
                                           pixelToPoint(taskbar.taskbarTemplate.image[0].height - 2));
                }
            }
            this.endPage = this.startPage = pageIndex;
        }
    }
}
