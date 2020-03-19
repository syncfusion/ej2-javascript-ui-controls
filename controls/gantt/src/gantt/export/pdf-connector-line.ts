import { PointF, PdfPage, PdfGraphics, PdfPen, PdfBrush, PdfSolidBrush, RectangleF, PdfColor, SizeF } from '@syncfusion/ej2-pdf-export';
import { IGanttStyle, PageDetail } from './../base/interface';
import { Gantt } from './../base/gantt';
import { pixelToPoint } from '../base/utils';
import { PdfGantt } from './pdf-gantt';
import { PdfGanttTaskbarCollection } from './pdf-taskbar';
import { isNullOrUndefined } from '@syncfusion/ej2-base';

/**
 * @hidden
 */
export class PdfGanttPredecessor {
    public parentLeft?: number;
    public childLeft?: number;
    public parentWidth?: number;
    public childWidth?: number;
    public parentIndex?: number;
    public childIndex?: number;
    public rowHeight?: number;
    public type?: string;
    public milestoneParent?: boolean;
    public milestoneChild?: boolean;
    public lineWidth?: number;
    public connectorLineColor?: PdfColor;
    public pdfGantt?: PdfGantt;
    public parent?: Gantt;
    public ganttStyle: IGanttStyle;
    /**
     * @hidden
     */
    public add(): PdfGanttPredecessor {
        return new PdfGanttPredecessor(this.parent);
    }
    constructor(parent?: Gantt, pdfGantt?: PdfGantt) {
        this.parent = parent;
        this.pdfGantt = pdfGantt;
    }
    /**
     * Calculate the predecesor line point and draw the predecessor
     * @return {void}
     * @private
     */
    public drawPredecessor(pdfGantt: PdfGantt): void {
        this.pdfGantt = pdfGantt;
        let pages: PdfPage[] = pdfGantt.result.page.section.getPages() as PdfPage[];
        let parentTask: PdfGanttTaskbarCollection = pdfGantt.taskbarCollection[this.parentIndex];
        let childTask: PdfGanttTaskbarCollection = pdfGantt.taskbarCollection[this.childIndex];
        let startPage: PdfPage = new PdfPage();
        let endPage: PdfPage = new PdfPage();
        let predecessorType: string = '';
        let parentPageData: PageDetail;
        let childPageData: PageDetail;
        let parentY: number = 0;
        let childY: number = 0;
        switch (this.type) {
            case 'FS':
                if (childTask.startPage > -1 && parentTask.endPage > -1) {
                    startPage = pages[parentTask.endPage];
                    endPage = pages[childTask.startPage];
                    parentPageData = pdfGantt.pdfPageDetail[parentTask.endPage - pdfGantt.chartPageIndex];
                    childPageData = pdfGantt.pdfPageDetail[childTask.startPage - pdfGantt.chartPageIndex];
                    if (this.parentIndex < this.childIndex) {
                        if (this.parentLeft < this.childLeft && this.childLeft > (this.parentLeft + this.parentWidth + 25)) {
                            predecessorType = 'FSType1';
                        } else {
                            predecessorType = 'FSType2';
                        }
                    } else {
                        if (this.parentLeft < this.childLeft && this.childLeft > (this.parentLeft + this.parentWidth + 25)) {
                            predecessorType = 'FSType3';
                        } else {
                            predecessorType = 'FSType4';
                        }
                    }
                } else {
                    return;
                }
                break;
            case 'SF':
                if (childTask.endPage > -1 && parentTask.startPage > -1) {
                    startPage = pages[parentTask.startPage];
                    endPage = pages[childTask.endPage];
                    parentPageData = pdfGantt.pdfPageDetail[parentTask.endPage - pdfGantt.chartPageIndex];
                    childPageData = pdfGantt.pdfPageDetail[childTask.startPage - pdfGantt.chartPageIndex];
                    if (this.parentIndex < this.childIndex) {
                        if (this.parentLeft > this.childLeft + this.childWidth) {
                            predecessorType = 'SFType1';
                        } else {
                            predecessorType = 'SFType2';
                        }
                    } else {
                        if (this.parentLeft > this.childLeft + this.childWidth) {
                            predecessorType = 'SFType3';
                        } else {
                            predecessorType = 'SFType4';
                        }
                    }
                } else {
                    return;
                }
                break;
            case 'FF':
                if (childTask.endPage > -1 && parentTask.endPage > -1) {
                    startPage = pages[parentTask.endPage];
                    endPage = pages[childTask.endPage];
                    parentPageData = pdfGantt.pdfPageDetail[parentTask.endPage - pdfGantt.chartPageIndex];
                    childPageData = pdfGantt.pdfPageDetail[childTask.endPage - pdfGantt.chartPageIndex];
                    if (this.parentIndex < this.childIndex) {
                        if ((this.childLeft + this.childWidth) >= (this.parentLeft + this.parentWidth)) {
                            predecessorType = 'FFType1';
                        } else {
                            predecessorType = 'FFType2';
                        }
                    } else {
                        if ((this.childLeft + this.childWidth) >= (this.parentLeft + this.parentWidth)) {
                            predecessorType = 'FFType3';
                        } else {
                            predecessorType = 'FFType4';
                        }
                    }
                } else {
                    return;
                }
                break;
            case 'SS':
                if (childTask.startPage > -1 && parentTask.startPage > -1) {
                    startPage = pages[parentTask.startPage];
                    endPage = pages[childTask.startPage];
                    parentPageData = pdfGantt.pdfPageDetail[parentTask.startPage - pdfGantt.chartPageIndex];
                    childPageData = pdfGantt.pdfPageDetail[childTask.startPage - pdfGantt.chartPageIndex];
                    if (this.parentIndex < this.childIndex) {
                        if (this.parentLeft >= this.childLeft) {
                            predecessorType = 'SSType1';
                        } else {
                            predecessorType = 'SSType2';
                        }
                    } else {
                        if (this.parentLeft >= this.childLeft) {
                            predecessorType = 'SSType3';
                        } else {
                            predecessorType = 'SSType4';
                        }
                    }
                } else {
                    return;
                }
                break;
        }
        let midPoint: number = Math.round((this.parent.rowHeight - 1) / 2.0);
        midPoint = pixelToPoint(midPoint);
        /* tslint:disable-next-line */
        let point1, point2, point3, point4, point5, point6: PointF;
        point1 = point2 = point3 = point4 = point5 = point6 = new PointF();
        let parentTaskpoint: PointF = { ...parentTask.taskStartPoint };
        let childTaskpoint: PointF = { ...childTask.taskStartPoint };
        parentY = parentTaskpoint.y + parentPageData.startPoint.y;
        childY = childTaskpoint.y + childPageData.startPoint.y;
        let ffpoint1: PointF = new PointF(pixelToPoint(this.parentLeft + this.parentWidth), parentY + midPoint);
        let sspoint1: PointF = new PointF(pixelToPoint(this.parentLeft) - 1, parentY + midPoint);
        let ffpoint3: PointF = new PointF(pixelToPoint(this.childLeft - 20), childY + midPoint);
        let ffpoint4: PointF = new PointF(pixelToPoint(this.childLeft - 6 - this.lineWidth) - 1, childY + midPoint);
        let sspoint4: PointF = new PointF(pixelToPoint(this.childLeft + this.childWidth + 6 + this.lineWidth) + 1, childY + midPoint);
        switch (predecessorType) {
            case 'FSType1':
            case 'FSType3':
                point1 = ffpoint1;
                point2 = new PointF(pixelToPoint(this.childLeft - 20), parentY + midPoint);
                point3 = ffpoint3;
                point4 = ffpoint4;
                this.connectLines(startPage, endPage, point1, point2, point3, point4, childTask, midPoint);
               break;
            case 'FSType2':
                point1 = ffpoint1;
                point2 = new PointF(point1.x + 10, parentY + midPoint);
                point3 = new PointF(point1.x + 10, childY + 2);
                point4 = new PointF(pixelToPoint(this.childLeft - 20), childY + 2);
                point5 = ffpoint3;
                point6 = ffpoint4;
                this.connectLines(startPage, endPage, point1, point2, point3, point4, childTask, midPoint, point5, point6);
                break;
            case 'FSType4':
                point1 = ffpoint1;
                point2 = new PointF(point1.x + 10, parentY + midPoint);
                point3 = new PointF(point1.x + 10, parentY + 2);
                point4 = new PointF(pixelToPoint(this.childLeft - 20), parentY + 2);
                point5 = ffpoint3;
                point6 = ffpoint4;
                this.connectLines(startPage, endPage, point1, point2, point3, point4, childTask, midPoint, point5, point6);
                break;
            case 'FFType1':
            case 'FFType3':
                point1 = new PointF(pixelToPoint(this.parentLeft + this.parentWidth) + 1, parentY + midPoint);
                point2 = new PointF(pixelToPoint(this.childLeft + this.childWidth + 20), parentY + midPoint);
                point3 = new PointF(point2.x, childY + midPoint);
                point4 = sspoint4;
                this.connectLines(startPage, endPage, point1, point2, point3, point4, childTask, midPoint);
                break;
            case 'FFType2':
            case 'FFType4':
                point1 = new PointF(pixelToPoint(this.parentLeft + this.parentWidth) + 1, parentY + midPoint);
                point2 = new PointF(pixelToPoint(this.parentLeft + this.parentWidth + 20), parentY + midPoint);
                point3 = new PointF(point2.x, childY + midPoint);
                point4 = sspoint4;
                this.connectLines(startPage, endPage, point1, point2, point3, point4, childTask, midPoint);
                break;
            case 'SSType1':
            case 'SSType3':
                point1 = sspoint1;
                point2 = new PointF(pixelToPoint(this.childLeft - 20), parentY + midPoint);
                point3 = new PointF(point2.x, childY + midPoint);
                point4 = ffpoint4;
                this.connectLines(startPage, endPage, point1, point2, point3, point4, childTask, midPoint);
                break;
            case 'SSType2':
            case 'SSType4':
                point1 = sspoint1;
                point2 = new PointF(pixelToPoint(this.parentLeft - 20), parentY + midPoint);
                point3 = new PointF(point2.x, childY + midPoint);
                point4 = ffpoint4;
                this.connectLines(startPage, endPage, point1, point2, point3, point4, childTask, midPoint);
                break;
            case 'SFType1':
            case 'SFType3':
                point1 = sspoint1;
                point2 = new PointF(pixelToPoint(this.childLeft + this.childWidth + 20), parentY + midPoint);
                point3 = new PointF(point2.x, childY + midPoint);
                point4 = sspoint4;
                this.connectLines(startPage, endPage, point1, point2, point3, point4, childTask, midPoint);
                break;
            case 'SFType2':
                point1 = sspoint1;
                point2 = new PointF(pixelToPoint(this.parentLeft - 20), parentY + midPoint);
                point3 = new PointF(point2.x, childY + 2);
                point4 = new PointF(pixelToPoint(this.childLeft + this.childWidth + 20), childY + 2);
                point5 = new PointF(point4.x, childY + midPoint);
                point6 = sspoint4;
                this.connectLines(startPage, endPage, point1, point2, point3, point4, childTask, midPoint, point5, point6);
                break;
            case 'SFType4':
                point1 = sspoint1;
                point2 = new PointF(pixelToPoint(this.parentLeft - 20), parentY + midPoint);
                point3 = new PointF(point2.x, parentY + 2);
                point4 = new PointF(pixelToPoint(this.childLeft + this.childWidth + 20), parentY + 2);
                point5 = new PointF(point4.x, childY + midPoint);
                point6 = sspoint4;
                this.connectLines(startPage, endPage, point1, point2, point3, point4, childTask, midPoint, point5, point6);
                break;
        }
    }
    /**
     * @private
     * Method to draw the predecessor lines with calculated connector points
     */
    /* tslint:disable-next-line */
    private connectLines(startPage: PdfPage, endPage: PdfPage, point1: PointF, point2: PointF, point3: PointF, point4: PointF, childTask: PdfGanttTaskbarCollection, midPoint: number, point5?: PointF, point6?: PointF): void {
        this.drawLine(startPage, point1, point2);
        this.drawLine(startPage, point2, point3);
        this.drawLine(startPage, point3, point4);
        if (!isNullOrUndefined(point5) && !isNullOrUndefined(point6)) {
            this.drawLine(startPage, point4, point5);
            this.drawLine(startPage, point5, point6);
        }
        this.drawArrow(endPage, childTask, midPoint);
    }
    /**
     * @private
     * Method to check the predecessor line  occurs within the page
     */
    private contains(rect: RectangleF, x: number, y: number): boolean {
        return rect.x <= x &&
            x < rect.x + rect.width &&
            rect.y <= y &&
            y < rect.y + rect.height;
    }
    /**
     * @private
     * Find the PDF page index of given point
     */
    private findPageIndex(point: PointF): number {
        let pageIndex: number = -1;
        for (let index: number = 0; index < this.pdfGantt.pdfPageDetail.length; index++) {
            let pageData: PageDetail = this.pdfGantt.pdfPageDetail[index];
            let pageRect: RectangleF = new RectangleF(pageData.startPoint.x, pageData.startPoint.y, pageData.width, pageData.height);
            if (this.contains(pageRect, point.x, point.y)) {
                pageIndex = index;
                break;
            }
        }
        return pageIndex;
    }
    /**
     * @private
     * Draw predecessor line
     */
    private drawLine(page: PdfPage, startPoint: PointF, endPoint: PointF): void {
        let pdfPages: PdfPage[] = this.pdfGantt.result.page.section.getPages() as PdfPage[];
        let graphics: PdfGraphics = page.graphics;
        let newEndPoint: PointF = { ...endPoint };
        let newStartPoint: PointF = { ...endPoint };
        let checkStartPoint: PointF = { ...endPoint };
        let pageData: PageDetail = this.pdfGantt.pdfPageDetail[page.section.indexOf(page) - this.pdfGantt.chartPageIndex];
        let pageRect: RectangleF = new RectangleF(pageData.startPoint.x, pageData.startPoint.y, pageData.width, pageData.height);
        let startPointCheck: boolean = this.contains(pageRect, startPoint.x, startPoint.y);
        let endPointCheck: boolean = this.contains(pageRect, endPoint.x, endPoint.y);
        let pageIndex: number = -1;
        startPoint = new PointF(startPoint.x, startPoint.y);
        endPoint = new PointF(endPoint.x, endPoint.y);
        if (!startPointCheck && !endPointCheck) {
            pageIndex = this.findPageIndex(startPoint);
            if (pageIndex > -1) {
                pageData = this.pdfGantt.pdfPageDetail[pageIndex];
                newStartPoint = startPoint;
                newEndPoint = endPoint;
                this.drawLine(pdfPages[pageIndex + this.pdfGantt.chartPageIndex], newStartPoint, newEndPoint);
            }
        } else if (endPointCheck && !startPointCheck) {
            pageIndex = this.findPageIndex(startPoint);
            if (pageIndex > -1) {
                pageData = this.pdfGantt.pdfPageDetail[pageIndex];
                newStartPoint = startPoint;
                newEndPoint = endPoint;
                this.drawLine(pdfPages[pageIndex + this.pdfGantt.chartPageIndex], newStartPoint, newEndPoint);
            }
        } else if (!endPointCheck && startPointCheck) {
            let pageRectLeft: number = pageRect.x;
            let pageRectRight: number = pageRect.x + pageRect.width;
            let pageRectBottom: number = pageRect.y + pageRect.height;
            let pageRectTop: number = pageRect.y;
            if (pageRectLeft > endPoint.x) {
                checkStartPoint.x = endPoint.x = pageRectLeft - 1;
                newStartPoint.x = pageRectLeft - 1;
            } else if (pageRectRight < endPoint.x) {
                checkStartPoint.x = endPoint.x = pageRectRight;
                newStartPoint.x = pageRectRight;
                checkStartPoint.x += 1;
            } else if (pageRectBottom < endPoint.y) {
                checkStartPoint.y = endPoint.y = pageRectBottom;
                newStartPoint.y = pageRectBottom;
                checkStartPoint.y += 1;
                if (this.pdfGantt.enableHeader) {
                    newStartPoint.y += this.parent.timelineModule.isSingleTier ? pixelToPoint(45) : pixelToPoint(62);
                }
            } else if (pageRectTop > endPoint.y) {
                newStartPoint.y = checkStartPoint.y = pageRectTop - 1;
                endPoint.y = pageRectTop;
                if (this.pdfGantt.enableHeader) {
                    checkStartPoint.y += this.parent.timelineModule.isSingleTier ? pixelToPoint(45) : pixelToPoint(62);
                    endPoint.y += this.parent.timelineModule.isSingleTier ? pixelToPoint(45) : pixelToPoint(62);
                }
            }
            pageIndex = this.findPageIndex(checkStartPoint);
            if (pageIndex !== -1) {
                this.drawLine(pdfPages[pageIndex + this.pdfGantt.chartPageIndex], newStartPoint, newEndPoint);
            }
        }
        if (startPointCheck) {
            startPoint = new PointF(startPoint.x, startPoint.y);
            endPoint = new PointF(endPoint.x, endPoint.y);
            startPoint.x = startPoint.x + pageData.pageStartX - pageData.startPoint.x;
            startPoint.y = startPoint.y - pageData.startPoint.y;
            endPoint.x = endPoint.x + pageData.pageStartX - pageData.startPoint.x;
            endPoint.y = endPoint.y - pageData.startPoint.y;
            let brush: PdfBrush = new PdfSolidBrush(this.connectorLineColor);
            let predecessorPen: PdfPen = new PdfPen(brush, pixelToPoint(this.lineWidth));
            graphics.drawLine(predecessorPen, startPoint, endPoint);
        }
    }
    /**
     * @private
     * Draw predecessor arrow
     */
    private drawArrow(page: PdfPage, childTask: PdfGanttTaskbarCollection, midPoint: number): void {
        let pageData: PageDetail = this.pdfGantt.pdfPageDetail[page.section.indexOf(page) - this.pdfGantt.chartPageIndex];
        /* tslint:disable-next-line */
        let pageRect: RectangleF = new RectangleF(new PointF(pageData.startPoint.x, pageData.startPoint.y), new SizeF(pageData.width, pageData.height));
        let startPoint: PointF = new PointF();
        let pdfPages: PdfPage[] = page.section.getPages() as PdfPage[];
        let width: number = 6 + this.lineWidth;
        let point2: PointF;
        if (this.type === 'FS' || this.type === 'SS') {
            startPoint = new PointF(pixelToPoint(this.childLeft) - 1, childTask.taskStartPoint.y + pageData.startPoint.y);
        } else {
            startPoint = new PointF(pixelToPoint(this.childLeft + this.childWidth) + 1, childTask.taskStartPoint.y + pageData.startPoint.y);
        }
        let startPointCheck: boolean = this.contains(pageRect, startPoint.x, startPoint.y);
        if (!startPointCheck) {
            let pageIndex: number = this.findPageIndex(startPoint);
            if (pageIndex > -1) {
                pageData = this.pdfGantt.pdfPageDetail[pageIndex];
                page = pdfPages[pageIndex + this.pdfGantt.chartPageIndex];
            }
        }
        let graphics: PdfGraphics = page.graphics;
        startPoint.x = startPoint.x - pageData.startPoint.x + pageData.pageStartX;
        startPoint.y = startPoint.y - pageData.startPoint.y;
        let point1: PointF = new PointF(startPoint.x, startPoint.y + midPoint);
        if (this.type === 'FS' || this.type === 'SS') {
            point2 = new PointF(point1.x - pixelToPoint(width), point1.y - pixelToPoint(width));
        } else {
            point2 = new PointF(point1.x + pixelToPoint(width), point1.y - pixelToPoint(width));
        }
        let point3: PointF = new PointF(point2.x, point2.y + pixelToPoint(2 * width));
        let brush: PdfBrush = new PdfSolidBrush(this.connectorLineColor);
        let predecessorPen: PdfPen = new PdfPen(brush, pixelToPoint(this.lineWidth));
        graphics.drawLine(predecessorPen, point1, point2);
        graphics.drawLine(predecessorPen, point2, point3);
        graphics.drawLine(predecessorPen, point3, point1);
    }
}
