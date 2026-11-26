import { IEventMarkerInfo, TimelineDetails, IGanttData } from './../base/interface';
import { PdfGanttTaskbarCollection } from './pdf-taskbar';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { PageDetail } from '../base/interface';
import { PdfLayoutResult, PointF, PdfPage, PdfGraphics, SizeF, PdfPen, PdfColor } from '@syncfusion/ej2-pdf-export';
import { Gantt } from '../base/gantt';
import { PdfTreeGrid} from './pdf-treegrid';
import { PdfExportProperties } from '../base/interface';
import { PdfTimeline } from './pdf-timeline';
import { pixelToPoint, pointToPixel } from '../base/utils';
import { Timeline } from '../renderer/timeline';
import { PdfGanttPredecessor } from './pdf-connector-line';
import { TimelineViewMode } from '../base/enum';
import {EventMarker} from './pdf-event-marker';
import { ProgressLine } from '../actions/progress-line';
import { IPdfProgressLinePage, IPdfProgressLineRow, PdfProgressLine } from './pdf-progress-line';
import { PdfSCurve } from './pdf-scurve';

/**
 *
 */
export class PdfGantt extends PdfTreeGrid {
    public taskbarCollection: PdfGanttTaskbarCollection[];
    public predecessorCollection: PdfGanttPredecessor[];
    private taskbars: PdfGanttTaskbarCollection;
    private totalPages: number;
    private exportProps: PdfExportProperties = {};
    private perColumnPages: number;
    private headerDetails: TimelineDetails[];
    public pdfPageDetail: PageDetail[];
    public result: PdfLayoutResult;
    public timelineStartDate: Date;
    private startPoint: PointF;
    private startPageIndex: number;
    public borderColor: PdfColor;
    public predecessor: PdfGanttPredecessor;
    public chartHeader: PdfTimeline;
    public chartPageIndex: number;
    public eventMarker : EventMarker;
    public sCurve: PdfSCurve;
    public changeCloneProjectDates: boolean = false;
    public changeCloneTimelineDates: boolean = false;
    public currentPage: number = 0;
    public parent: Gantt;
    public progressLineRecords: IGanttData[] = [];
    private progressLineRenderer: PdfProgressLine;

    constructor(parent: Gantt) {
        super();
        this.parent = parent;
        this.progressLineRenderer = new PdfProgressLine(parent);
        this.chartHeader = new PdfTimeline(this);
        this.eventMarker = new EventMarker(parent);
        this.sCurve = new PdfSCurve(parent);
        this.predecessor = new PdfGanttPredecessor(parent, this);
        this.headerDetails = [];
        this.pdfPageDetail = [];
        this.taskbarCollection = [];
        this.predecessorCollection = [];
    }
    public get taskbar(): PdfGanttTaskbarCollection {
        if (isNullOrUndefined(this.taskbars)) {
            this.taskbars = new PdfGanttTaskbarCollection(this.parent);
        }
        return this.taskbars;
    }
    public drawChart(result: PdfLayoutResult): void {
        this.result = result;
        this.totalPages = this.result.page.section.count;
        this.perColumnPages = this.totalPages / this.layouter.columnRanges.length;
        this.calculateRange();
        this.drawGantttChart();
        this.drawPageBorder();
    }

    //Calcualte the header range for each pdf page based on schedule start and end date.
    private calculateRange(): void {
        const lastColumnRange: number[] = this.layouter.columnRanges[this.layouter.columnRanges.length - 1];
        let totalColumnWidth: number = 0;
        let isPageFinished: boolean = true;
        let pageWidth: number = 0;
        let remainWidth: number = 0;
        let point: number = 0;
        let endDays1: number;
        const headerWidth: number = pixelToPoint(this.chartHeader.width);
        const timelineSettings: Timeline = this.parent.timelineModule;
        const isFitToFullGrid: boolean = this.parent.pdfExportModule.helper['shouldProcessChart']();

        for (let index: number = lastColumnRange[0]; index <= lastColumnRange[1]; index++) {
            totalColumnWidth += this.layouter.treegrid.columns.getColumn(index).width;
        }
        totalColumnWidth += 0.5;
        if (totalColumnWidth + 100 < this.result.page.getClientSize().width || !isFitToFullGrid) {
            remainWidth = this.result.page.getClientSize().width - totalColumnWidth;
            this.chartPageIndex = this.startPageIndex = this.totalPages - this.perColumnPages;
            isPageFinished = false;
            this.startPoint = new PointF(totalColumnWidth, 0);
        } else {
            this.result.page.section.add();
            this.chartPageIndex = this.startPageIndex = this.totalPages;
            isPageFinished = true;
            this.startPoint = new PointF(point, 0);
        }
        while (Math.round(point) < Math.round(headerWidth)) {
            if (isPageFinished) {
                pageWidth = this.result.page.getClientSize().width;
            } else {
                pageWidth = remainWidth;
                isPageFinished = true;
            }
            const detail: TimelineDetails = {};
            const range: number[] = [];
            const convertedWidth: number = pixelToPoint(this.chartHeader.bottomTierCellWidth);
            let width: number = 0;
            if (this.chartHeader.bottomTierCellWidth !== 0) {
                width = (Math.floor(pageWidth / convertedWidth) * convertedWidth);
            }
            range[0] = point;
            // Calculate time offset if project starts with a specific time (not midnight)
            let timeOffsetWidth: number = 0;
            if (point === 0 && this.parent.timelineModule.timelineStartDate) {
                const startDate: Date = this.parent.timelineModule.timelineStartDate;
                const hours: number = startDate.getHours();
                const minutes: number = startDate.getMinutes();
                const seconds: number = startDate.getSeconds();
                // Calculate time offset ratio based on the schedule type
                if (hours !== 0 || minutes !== 0 || seconds !== 0) {
                    let scheduleType: TimelineViewMode = timelineSettings.customTimelineSettings.bottomTier.unit;
                    if (scheduleType === 'None') {
                        scheduleType = timelineSettings.customTimelineSettings.topTier.unit;
                    }
                    let timeOffsetRatio: number = 0;
                    // Calculate the fractional offset based on timeline unit
                    if (scheduleType === 'Minutes') {
                        timeOffsetRatio = seconds / 60;
                    } else if (scheduleType === 'Hour') {
                        const totalMinutesInHour: number = 60;
                        timeOffsetRatio = minutes / totalMinutesInHour;
                    } else if (scheduleType === 'Day' || scheduleType === 'Week') {
                        const totalSecondsInDay: number = 24 * 60 * 60;
                        const currentSeconds: number = (hours * 60 * 60) + (minutes * 60) + seconds;
                        timeOffsetRatio = currentSeconds / totalSecondsInDay;
                    }
                    // Calculate the width to subtract for the partial cell at the start
                    if (timeOffsetRatio > 0) {
                        timeOffsetWidth = convertedWidth * timeOffsetRatio;
                        width = width - timeOffsetWidth;
                    }
                }
            }
            if (headerWidth - point <= width) {
                range[1] = headerWidth;
                detail.totalWidth = pointToPixel(headerWidth - point);
            } else {
                range[1] = point + width;
                detail.totalWidth = pointToPixel(width);
            }
            detail.startPoint = range[0];
            detail.endPoint = range[1];
            if (this.parent.projectStartDate && this.parent.cloneProjectStartDate.getHours() === 0 &&
                this.parent.cloneProjectStartDate.getMinutes() === 0
            && this.parent.cloneProjectStartDate.getSeconds() === 0 ) {
                this.changeCloneProjectDates = true;
                this.parent.cloneProjectStartDate.setHours(8);
            }
            if (this.parent.timelineSettings.viewStartDate &&
                !isNullOrUndefined(this.parent.cloneTimelineStartDate) &&
                this.parent.cloneTimelineStartDate.getHours() === 0 &&
                this.parent.cloneTimelineStartDate.getMinutes() === 0 &&
                this.parent.cloneTimelineStartDate.getSeconds() === 0) {
                this.changeCloneTimelineDates = true;
                this.parent.cloneTimelineStartDate.setHours(8);
            }
            const timelineStartDate: Date = this.parent.dataOperation.getDateFromFormat(this.parent.timelineModule.timelineStartDate);
            let count: number = timelineSettings.customTimelineSettings.bottomTier.count;
            if (isNullOrUndefined(count)) {
                count = timelineSettings.customTimelineSettings.topTier.count;
            }
            const scheduleType: TimelineViewMode = timelineSettings.customTimelineSettings.bottomTier.unit === 'None' ?
                timelineSettings.customTimelineSettings.topTier.unit : timelineSettings.customTimelineSettings.bottomTier.unit;
            switch (scheduleType) {
            case 'Minutes':
            {
                detail.startDate = new Date(timelineStartDate.getTime());
                const sDays: number = Math.floor(pointToPixel(detail.startPoint) / (this.chartHeader.bottomTierCellWidth));
                detail.startDate.setMinutes(detail.startDate.getMinutes() + sDays * count);
                detail.startDate.setSeconds(detail.startDate.getSeconds() + 1);
                detail.endDate = new Date(detail.startDate.getTime());
                const eDays: number = Math.floor(pointToPixel(detail.endPoint - detail.startPoint)
                    / (this.chartHeader.bottomTierCellWidth));
                detail.endDate.setMinutes(detail.endDate.getMinutes() + eDays * count);
                break;
            }
            case 'Hour':
            {
                detail.startDate = new Date(timelineStartDate.getTime());
                const startHours: number = Math.floor(pointToPixel(detail.startPoint) / (this.chartHeader.bottomTierCellWidth));
                let currentDate: Date = new Date(detail.startDate.getTime());

                if (!this.parent.timelineSettings.showWeekend) {
                    currentDate = this.calculateHoursWithoutNonworkingDays(currentDate, startHours, count);
                    detail.startDate = new Date(currentDate.getTime());
                } else {
                    detail.startDate.setHours(detail.startDate.getHours() + startHours * count);
                    detail.startDate.setMinutes(detail.startDate.getMinutes() + 1);
                }

                let endHours: number = 0;
                if (this.parent.pdfExportModule.gantt.taskbar.isAutoFit()) {
                    endHours = Math.floor((detail.endPoint - detail.startPoint)
                    / pixelToPoint(this.chartHeader.bottomTierCellWidth));
                }
                else {
                    endHours = Math.floor((detail.endPoint - detail.startPoint)
                    / pointToPixel(this.chartHeader.bottomTierCellWidth));
                }
                currentDate = new Date(detail.startDate.getTime());
                if (!this.parent.timelineSettings.showWeekend) {
                    currentDate = this.calculateHoursWithoutNonworkingDays(currentDate, endHours, count);
                } else {
                    currentDate.setHours(currentDate.getHours() + endHours * count);
                }
                detail.endDate = new Date(currentDate.getTime());
                break;
            }
            case 'Day':
            {
                detail.startDate = new Date(timelineStartDate.getTime());
                const startDays: number = Math.round(detail.startPoint / pixelToPoint(this.chartHeader.bottomTierCellWidth));
                let currentDate: Date = new Date(detail.startDate.getTime());
                if (!this.parent.timelineSettings.showWeekend) {
                    detail.startDate = this.calculateDaysWithoutNonworkingDays(detail.startDate, startDays * count);
                }
                else {
                    detail.startDate.setDate(detail.startDate.getDate() + startDays * count);
                }
                const endDays: number = Math.round((detail.endPoint - detail.startPoint)
                    / pixelToPoint(this.chartHeader.bottomTierCellWidth)) - 1;
                const startdate: Date = detail.startDate;
                startdate.setHours(0, 0, 0, 0);
                currentDate = new Date(detail.startDate.getTime());
                if (!this.parent.timelineSettings.showWeekend) {
                    currentDate = this.calculateDaysWithoutNonworkingDays(currentDate, endDays * count);
                }
                else {
                    currentDate.setDate(currentDate.getDate() + endDays * count);
                }
                const secondsToAdd: number = this.parent.workingTimeRanges[this.parent.workingTimeRanges.length - 1].to * 1000;
                detail.endDate = new Date(currentDate.getTime());
                detail.endDate.setTime(detail.endDate.getTime() + secondsToAdd);
                break;
            }
            case 'Week':
            {
                detail.startDate = new Date(timelineStartDate.getTime());
                const startDaysCount: number = Math.floor((detail.startPoint /
                                                          pixelToPoint(this.chartHeader.bottomTierCellWidth)) * 7);
                if (!this.parent.timelineSettings.showWeekend) {
                    detail.startDate = this.calculateDaysWithoutNonworkingDays(detail.startDate, startDaysCount * count);
                }
                else {
                    detail.startDate.setDate(detail.startDate.getDate() + startDaysCount * count);
                }

                // If this page does not start at the very beginning, force its start
                // to be the next Sunday after the previous page's endDate to avoid
                // using the bottom-tier start as the page end.
                if (detail.startPoint !== 0) {
                    const prevDetail: TimelineDetails = this.headerDetails[this.headerDetails.length - 1];
                    if (prevDetail && prevDetail.endDate) {
                        const nextSunday: Date = new Date(prevDetail.endDate.getTime());
                        nextSunday.setHours(0, 0, 0, 0);
                        // Advance until we find the first Sunday strictly after previous endDate
                        while (nextSunday.getTime() <= prevDetail.endDate.getTime() || nextSunday.getDay() !== 0) {
                            nextSunday.setDate(nextSunday.getDate() + 1);
                        }
                        detail.startDate = nextSunday;
                    }
                }
                // Handle exclusive endPoint: subtract 1 point so the calculation maps
                // to the last included position; use floor to get inclusive last day.
                const effectiveEndPoint: number = Math.max(detail.endPoint - 1, detail.startPoint);
                const endDaysCount: number = Math.floor((effectiveEndPoint / pixelToPoint(this.chartHeader.bottomTierCellWidth)) * 7);
                detail.endDate = new Date(timelineStartDate.getTime());
                if (!this.parent.timelineSettings.showWeekend) {
                    detail.endDate = this.calculateDaysWithoutNonworkingDays(detail.endDate, endDaysCount * count);
                }
                else {
                    detail.endDate.setDate(detail.endDate.getDate() + endDaysCount * count);
                }
                break;
            }
            case 'Month':
            {
                detail.startDate = new Date(timelineStartDate.getTime());
                const startDays2: number = (detail.startPoint / pixelToPoint(this.chartHeader.bottomTierCellWidth) * 31);
                detail.startDate.setDate(detail.startDate.getDate() + startDays2 * count);
                const endDays2: number = Math.round((detail.endPoint - detail.startPoint)
                                                    / pixelToPoint(this.chartHeader.bottomTierCellWidth)) * 31 - 1;
                detail.endDate = new Date(detail.startDate.getTime());
                detail.endDate.setDate(detail.startDate.getDate() + endDays2 * count);
                break;
            }
            case 'Year':
            {
                detail.startDate = new Date(timelineStartDate.getTime());
                const startDays3: number = (detail.startPoint / pixelToPoint(this.chartHeader.bottomTierCellWidth) * 365);
                detail.startDate.setDate(detail.startDate.getDate() + startDays3 * count);
                const endDays3: number = Math.round((detail.endPoint - detail.startPoint)
                    / pixelToPoint(this.chartHeader.bottomTierCellWidth)) * 365 - 1;
                detail.endDate = new Date(detail.startDate.getTime());
                detail.endDate.setDate(detail.startDate.getDate() + endDays3 * count);
                break;
            }
            }
            this.headerDetails.push(detail);
            point += width;
        }
    }
    /**
     * Calculates the end date by adding the specified number of working hours to the current date,
     * excluding any non-working days as specified in the nonWorkingDayIndex.
     *
     * @param {Date} currentDate - The starting date from which to begin adding working hours.
     * @param {number} startHours - The number of hours to add to the current date.
     * @param {number} count - A multiplier to apply to the startHours, typically representing a scaling factor.
     * @returns {Date} - A new Date object representing the calculated date/time after working hours have been added.
     *
     */
    private calculateHoursWithoutNonworkingDays(currentDate: Date, startHours: number, count: number): Date {
        let totalHours: number = 0;
        while (totalHours < startHours * count) {
            currentDate.setHours(currentDate.getHours() + 1);
            if (this.parent.nonWorkingDayIndex.indexOf(currentDate.getDay()) === -1) {
                totalHours++;
            }
            if (this.parent.nonWorkingDayIndex.indexOf(currentDate.getDay()) !== -1) {
                currentDate.setHours(24, 0, 0, 0);
            }
        }
        return currentDate;
    }
    /**
     * Calculates the end date by adding the specified number of working days to the current date,
     * excluding any non-working days as defined in the nonWorkingDayIndex.
     *
     * @param {Date} startDate - The starting date from which to begin adding working days.
     * @param {number} daysToAdd - The number of days to add to the current date.
     * @param {number} count - A multiplier applied to daysToAdd, typically representing the number of units.
     * @returns {Date} - A new Date object representing the calculated date after working days have been added.
     *
     */
    private calculateDaysWithoutNonworkingDays(startDate: Date, daysToAdd: number): Date {
        const result: Date = new Date(startDate.getTime());
        const nonWorkingDays: number = this.parent.nonWorkingDayIndex.length;
        const workingDaysInWeek: number = 7 - nonWorkingDays;
        const fullWeeks: number = Math.floor(daysToAdd / workingDaysInWeek);
        let remainingDays: number = daysToAdd % workingDaysInWeek;
        result.setDate(result.getDate() + fullWeeks * 7);
        // Process remaining days
        while (remainingDays > 0) {
            result.setDate(result.getDate() + 1);
            if (this.parent.nonWorkingDayIndex.indexOf(result.getDay()) === -1) {
                remainingDays--;
            }
        }
        return result;
    }

    private drawPageBorder(): void {
        const pages: PdfPage[] = this.result.page.section.getPages() as PdfPage[];
        for (let index: number = 0; index < pages.length; index++) {
            const page: PdfPage = pages[index as number];
            const graphics: PdfGraphics = page.graphics;
            const pageSize: SizeF = page.getClientSize();
            const pen: PdfPen = new PdfPen(new PdfColor(this.ganttStyle.chartGridLineColor));
            graphics.drawRectangle(pen, 0, 0, pageSize.width, pageSize.height);
        }
    }
    //Draw the gantt chart side
    private drawGantttChart(): void {
        let taskbarPoint: PointF = this.startPoint;
        const pagePoint: PointF = new PointF();
        let pageStartX: number = 0;
        let cumulativeWidth: number = 0;
        let cumulativeHeight: number = 0;
        let pageData: PageDetail;
        const statusDateX: number = ProgressLine.getStatusDateX(this.parent);
        const hasProgressLine: boolean = !isNullOrUndefined(statusDateX);
        const statusX: number = hasProgressLine ? statusDateX - this.parent.dataOperation.getTaskLeft(
            this.headerDetails[0].startDate, false, this.parent.defaultCalendarContext, true
        ) : statusDateX;
        const isAutoFit: boolean = this.parent.pdfExportModule.gantt.taskbar.isAutoFit();
        const taskbarProgressX: number[] = this.progressLineRecords.map((record: IGanttData) =>
            ProgressLine.getProgressX(record));
        this.headerDetails.forEach((detail: TimelineDetails, index: number): void => {
            this.currentPage = 0;
            const page: PdfPage = this.result.page.section.getPages()[this.startPageIndex] as PdfPage;
            page['contentWidth'] = (this.parent.pdfExportModule.gantt.taskbar.isAutoFit()) ? pointToPixel(this.headerDetails[index as number].endPoint - this.headerDetails[index as number].startPoint) : this.headerDetails[index as number].endPoint - this.headerDetails[index as number].startPoint;
            this.chartHeader.drawTimeline(page, this.startPoint, detail, 0);
            const headerHeightPoint: number = this.enableHeader ? this.layouter.headerHeight : 0;
            taskbarPoint.y = taskbarPoint.y + headerHeightPoint;
            pageStartX = taskbarPoint.x;
            cumulativeHeight = headerHeightPoint;
            this.headerDetails[this.headerDetails.indexOf(detail)].startIndex = this.startPageIndex;
            this.headerDetails[this.headerDetails.indexOf(detail)].pageStartPoint = taskbarPoint;
            const progressLineRows: IPdfProgressLineRow[] = [];
            const progressLinePages: IPdfProgressLinePage[] = [];
            const progressLinePageMap: { [key: number]: IPdfProgressLinePage } = {};
            let globalRowTop: number = 0;
            for (let i: number = 0; i < this.taskbarCollection.length; i++) {
                const task: PdfGanttTaskbarCollection = this.taskbarCollection[i as number];
                const rowHeight: number = this.rows.getRow(i + this.headerRowCount).height;
                const pdfPage: PdfPage = this.result.page.section.getPages()[this.startPageIndex] as PdfPage;
                const graphics: PdfGraphics = pdfPage.graphics;
                const pen: PdfPen = new PdfPen(new PdfColor(this.ganttStyle.chartGridLineColor));
                let lineWidth: number;
                if (page['contentWidth'] && (this.parent.gridLines === 'Both' || this.parent.gridLines === 'Horizontal')) {
                    lineWidth = this.chartHeader.timelineWidth;
                    graphics.drawRectangle(pen, pageStartX, taskbarPoint.y, page['contentWidth'] + 0.5 , rowHeight);
                }
                const isNextPage: boolean = task.drawTaskbar(
                    pdfPage, taskbarPoint, detail, cumulativeWidth, rowHeight,
                    this.taskbarCollection[parseInt(i.toString(), 10)], lineWidth, index);
                if (isNextPage) {
                    if (this.enableHeader) {
                        taskbarPoint.y = this.layouter.headerHeight;
                    } else {
                        taskbarPoint.y = 0;
                    }
                    this.startPageIndex++;
                    pageData = {};
                    pageData.height = cumulativeHeight;
                    pageData.pageStartX = pageStartX;
                    pageData.startPoint = Object.assign({}, pagePoint);
                    if (this.parent.pdfExportModule.gantt.taskbar.isAutoFit()) {
                        pageData.width = (detail.totalWidth);
                    }
                    else {
                        pageData.width = pixelToPoint(detail.totalWidth);
                    }
                    this.pdfPageDetail.push(pageData);
                    pagePoint.y += pageData.height;
                    if (this.enableHeader) {
                        cumulativeHeight = this.chartHeader.height;
                    } else {
                        taskbarPoint.y = 0;
                        cumulativeHeight = 0;
                    }
                }
                if (hasProgressLine) {
                    const rowPage: PdfPage = this.result.page.section.getPages()[this.startPageIndex] as PdfPage;
                    const rowTop: number = taskbarPoint.y;
                    const chartWidth: number = rowPage['contentWidth'];
                    const taskbarTop: number = this.parent.renderBaseline ?
                        pixelToPoint((this.parent.rowHeight - task.height) / 4.5) :
                        pixelToPoint((this.parent.rowHeight - task.height) / 2);
                    const isManualParent: boolean = task.isParentTask && !task.isAutoSchedule;
                    const taskbarCenter: number = task.isMilestone ?
                        globalRowTop + task.getMilestoneCenterOffset() :
                        globalRowTop + taskbarTop +
                        (isManualParent ? 10 + pixelToPoint(12) / 2 : pixelToPoint(task.height) / 2);
                    progressLineRows.push({
                        globalTop: globalRowTop,
                        rowHeight: rowHeight,
                        taskbarCenter: taskbarCenter,
                        progressX: taskbarProgressX[i as number]
                    });
                    if (chartWidth > 0) {
                        let pageLayout: IPdfProgressLinePage = progressLinePageMap[this.startPageIndex];
                        if (!pageLayout) {
                            pageLayout = {
                                page: rowPage,
                                left: pageStartX,
                                top: rowTop,
                                right: pageStartX + chartWidth,
                                bottom: rowTop + rowHeight,
                                globalTop: globalRowTop
                            };
                            progressLinePageMap[this.startPageIndex] = pageLayout;
                            progressLinePages.push(pageLayout);
                        } else {
                            pageLayout.bottom = rowTop + rowHeight;
                        }
                    }
                }
                taskbarPoint.y += rowHeight;
                globalRowTop += rowHeight;
                cumulativeHeight += rowHeight;
                this.eventMarker.renderHeight = this.layouter.pageHeightCollection[this.currentPage].totalHeight;
                this.parent.eventMarkerColloction.map((eventMarker: IEventMarkerInfo) => {
                    const timelimeHeight: number = this.layouter.headerHeight;
                    if (this.currentPage !== 0) {
                        this.eventMarker.renderHeight = this.layouter.pageHeightCollection[this.currentPage].totalHeight + timelimeHeight;
                    }
                    const pdfPage: PdfPage = this.result.page.section.getPages()[this.startPageIndex] as PdfPage;
                    this.eventMarker.drawEventMarker(pdfPage, taskbarPoint, cumulativeWidth, detail, eventMarker, timelimeHeight,
                                                     this.ganttStyle);
                });
            }

            if (hasProgressLine) {
                this.progressLineRenderer.drawProgressLine(
                    this.progressLineRecords, statusX, progressLineRows, progressLinePages, detail, isAutoFit
                );
            }
            const timelineHeight: number = pixelToPoint(this.parent.timelineModule.isSingleTier ? 45 : 60);
            const firstPageIndex: number = this.headerDetails[index as number].startIndex;
            for (let k: number = firstPageIndex; k <= this.startPageIndex; k++) {
                const sCurvePage: PdfPage = this.result.page.section.getPages()[k as number] as PdfPage;
                const pageHeight: { totalHeight: number } = this.layouter.pageHeightCollection[k - firstPageIndex];
                if (pageHeight) {
                    const contentWidth: number = sCurvePage['contentWidth'];
                    const isAutoFit: boolean = this.parent.pdfExportModule.gantt.taskbar.isAutoFit();
                    const curveWidth: number = contentWidth ? (isAutoFit ? pixelToPoint(contentWidth) : contentWidth) :
                        detail.totalWidth;
                    this.sCurve.drawSCurve(sCurvePage, taskbarPoint, cumulativeWidth, detail, timelineHeight,
                                           pageHeight.totalHeight - timelineHeight, curveWidth);
                }
            }
            this.headerDetails[index as number].endIndex = this.startPageIndex;
            cumulativeWidth += detail.totalWidth;
            pageData = {};
            pageData.height = cumulativeHeight;
            pageData.pageStartX = pageStartX;
            pageData.startPoint = Object.assign({}, pagePoint);
            if (this.parent.pdfExportModule.gantt.taskbar.isAutoFit()) {
                pageData.width = (detail.totalWidth);
            }
            else {
                pageData.width = pixelToPoint(detail.totalWidth);
            }
            this.pdfPageDetail.push(pageData);
            pagePoint.x += pageData.width;
            pagePoint.y = 0;
            if (this.enableHeader) {
                cumulativeHeight = this.chartHeader.height;
            } else {
                taskbarPoint.y = 0;
            }
            if (this.headerDetails.indexOf(detail) !== this.headerDetails.length - 1) {
                this.result.page.section.add();
                this.startPageIndex = this.result.page.section.count - 1;
                taskbarPoint = this.startPoint = new PointF(0, 0);
            }
        });
        // Draw predecessor line.
        for (let i: number = 0; i < this.predecessorCollection.length; i++) {
            const predecessor: PdfGanttPredecessor = this.predecessorCollection[i as number];
            predecessor.drawPredecessor(this);
        }
    }
}
