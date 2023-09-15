import { TimelineDetails } from './../base/interface';
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
    public parent: Gantt;

    constructor(parent: Gantt) {
        super();
        this.parent = parent;
        this.chartHeader = new PdfTimeline(this);
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
        const headerWidth: number = pixelToPoint(this.chartHeader.width);
        const timelineSettings: Timeline = this.parent.timelineModule;

        for (let index: number = lastColumnRange[0]; index <= lastColumnRange[1]; index++) {
            totalColumnWidth += this.layouter.treegrid.columns.getColumn(index).width;
        }
        totalColumnWidth += 0.5;
        if (totalColumnWidth + 100 < this.result.page.getClientSize().width) {
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
            if (headerWidth - point <= width) {
                range[1] = headerWidth;
                detail.totalWidth = pointToPixel(headerWidth - point);
            } else {
                range[1] = point + width;
                detail.totalWidth = pointToPixel(width);
            }
            detail.startPoint = range[0];
            detail.endPoint = range[1];
            if (this.parent.cloneProjectStartDate.getHours() === 0 && this.parent.cloneProjectStartDate.getMinutes() === 0
            && this.parent.cloneProjectStartDate.getSeconds() === 0 ) {
                this.parent.cloneProjectStartDate.setHours(8);
            }
            const timelineStartDate: Date = this.parent.dataOperation.getDateFromFormat(this.parent.timelineModule.timelineStartDate);
            const count: number = isNullOrUndefined(timelineSettings.customTimelineSettings.bottomTier.count) ?
                timelineSettings.customTimelineSettings.topTier.count : timelineSettings.customTimelineSettings.bottomTier.count;
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
                const sDays1: number = Math.floor(pointToPixel(detail.startPoint) / (this.chartHeader.bottomTierCellWidth));
                detail.startDate.setHours(detail.startDate.getHours() + sDays1 * count);
                detail.startDate.setMinutes(detail.startDate.getMinutes() + 1);
                detail.endDate = new Date(detail.startDate.getTime());
                const eDays1: number = Math.floor(pointToPixel(detail.endPoint - detail.startPoint)
                      / (this.chartHeader.bottomTierCellWidth));
                detail.endDate.setHours(detail.endDate.getHours() + eDays1 * count);
                break;
            }
            case 'Day':
            {
                detail.startDate = new Date(timelineStartDate.getTime());
                const startDays: number = (Math.round(detail.startPoint / pixelToPoint(this.chartHeader.bottomTierCellWidth)));
                detail.startDate.setDate(detail.startDate.getDate() + startDays * count);
                const endDays: number = Math.round(((detail.endPoint - detail.startPoint)
                      / pixelToPoint(this.chartHeader.bottomTierCellWidth))) - 1;
                detail.endDate = new Date(detail.startDate.getTime());
                detail.endDate.setDate(detail.startDate.getDate() + endDays * count);
                break;
            }
            case 'Week':
            {
                detail.startDate = new Date(timelineStartDate.getTime());
                const startDays1: number = (detail.startPoint / pixelToPoint(this.chartHeader.bottomTierCellWidth) * 7);
                detail.startDate.setDate(detail.startDate.getDate() + startDays1 * count);
                const endDays1: number = Math.round((detail.endPoint - detail.startPoint)
                      / pixelToPoint(this.chartHeader.bottomTierCellWidth)) * 7 - 1;
                detail.endDate = new Date(detail.startDate.getTime());
                detail.endDate.setDate(detail.startDate.getDate() + endDays1 * count);
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

    private drawPageBorder(): void {
        const pages: PdfPage[] = this.result.page.section.getPages() as PdfPage[];
        for (let index: number = 0; index < pages.length; index++) {
            const page: PdfPage = pages[index as number];
            const graphics: PdfGraphics = page.graphics;
            const pageSize: SizeF = page.getClientSize();
            const pen: PdfPen = new PdfPen(new PdfColor(206, 206, 206));
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
        let totalHeight: number = 0;
        let pageData: PageDetail;
        this.headerDetails.forEach((detail: TimelineDetails, index: number): void => {
            const page: PdfPage = this.result.page.section.getPages()[this.startPageIndex] as PdfPage;
            page['contentWidth'] = pointToPixel(this.headerDetails[index as number].endPoint - this.headerDetails[index as number].startPoint);
            this.chartHeader.drawTimeline(page, this.startPoint, detail);
            taskbarPoint.y = taskbarPoint.y + pixelToPoint(this.parent.timelineModule.isSingleTier ? 45 : 60); // headerHeight
            pageStartX = taskbarPoint.x;
            cumulativeHeight = pixelToPoint(this.parent.timelineModule.isSingleTier ? 45 : 60); // headerHeight
            this.headerDetails[this.headerDetails.indexOf(detail)].startIndex = this.startPageIndex;
            this.headerDetails[this.headerDetails.indexOf(detail)].pageStartPoint = taskbarPoint;
            for (let i: number = 0; i < this.taskbarCollection.length; i++) {
                const task: PdfGanttTaskbarCollection = this.taskbarCollection[i as number];
                const rowHeight: number = this.rows.getRow(i + 1).height;
                const pdfPage: PdfPage = this.result.page.section.getPages()[this.startPageIndex] as PdfPage;
                const graphics = pdfPage.graphics;
                const pen = new PdfPen(new PdfColor(206, 206, 206));
                if (page['contentWidth'] && (this.parent.gridLines == "Both" || this.parent.gridLines == "Horizontal")) {
                    graphics.drawRectangle(pen, pageStartX, taskbarPoint.y, page['contentWidth'] + 0.5, rowHeight);
                }
                /* eslint-disable-next-line */
                const isNextPage: boolean = task.drawTaskbar(pdfPage, taskbarPoint, detail, cumulativeWidth, rowHeight, this.taskbarCollection[i]);
                if (isNextPage) {
                    if (this.enableHeader) {
                        taskbarPoint.y = pixelToPoint(this.parent.timelineModule.isSingleTier ? 45 : 60);
                    } else {
                        taskbarPoint.y = 0;
                    }
                    this.startPageIndex++;
                    pageData = {};
                    pageData.height = cumulativeHeight;
                    pageData.pageStartX = pageStartX;
                    pageData.startPoint = { ...pagePoint };
                    pageData.width = pixelToPoint(detail.totalWidth);
                    this.pdfPageDetail.push(pageData);
                    pagePoint.y += pageData.height;
                    if (this.enableHeader) {
                        cumulativeHeight = this.chartHeader.height;
                    } else {
                        taskbarPoint.y = 0;
                        cumulativeHeight = 0;
                    }
                }
                taskbarPoint.y += rowHeight;
                cumulativeHeight += rowHeight;
                // eslint-disable-next-line
                totalHeight += rowHeight;
            }
            this.headerDetails[index as number].endIndex = this.startPageIndex;
            cumulativeWidth += detail.totalWidth;
            pageData = {};
            pageData.height = cumulativeHeight;
            pageData.pageStartX = pageStartX;
            pageData.startPoint = { ...pagePoint };
            pageData.width = pixelToPoint(detail.totalWidth);
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
