import { Gantt } from '../base/gantt';
import * as cls from '../base/css-constants';
import { IGanttData } from '../base/interface';
import { ChartRows } from '../renderer/chart-rows';
import { isNullOrUndefined } from '@syncfusion/ej2-base';

/**
 * Describes a single segment of the progress line.
 */
export interface IProgressLinePoint {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    taskId: string;
}

const SVG_NS: string = 'http://www.w3.org/2000/svg';

/**
 * ProgressLine module renders a zig-zag line that relates the progress of each task to the configured status date.
 */
export class ProgressLine {
    private parent: Gantt;
    private svgElement: SVGElement;

    constructor(parent: Gantt) {
        this.parent = parent;
        this.wireEvents();
    }

    private wireEvents(): void {
        this.parent.on('refreshProgressLine', this.renderProgressLine, this);
        this.parent.on('refreshDayMarkers', this.renderProgressLine, this);
        this.parent.on('updateHeight', this.renderProgressLine, this);
        this.parent.on('chartScroll', this.onScroll, this);
    }

    private onScroll(): void {
        if (this.parent.enableVirtualization) {
            this.renderProgressLine();
        }
    }

    /**
     * Gets the configured status date.
     *
     * @param {Gantt} parent .
     * @returns {Date} .
     */
    public static getStatusDate(parent: Gantt): Date {
        const value: Date | string = parent.progressLine ? parent.progressLine.statusDate : null;
        if (isNullOrUndefined(value)) {
            return null;
        }
        const date: Date = value instanceof Date ? value : new Date(value);
        return isNaN(date.getTime()) ? null : date;
    }

    private getStatusDate(): Date {
        return ProgressLine.getStatusDate(this.parent);

    }

    /**
     * Converts the status date to its pixel position on the timeline.
     *
     * @param {Gantt} parent .
     * @returns {number} .
     * @private
     */
    public static getStatusDateX(parent: Gantt): number {
        const date: Date = ProgressLine.getStatusDate(parent);
        if (!date) {
            return null;
        }
        return parent.dataOperation.getTaskLeft(date, false, parent.defaultCalendarContext, true);

    }

    public getStatusDateX(): number {
        return ProgressLine.getStatusDateX(this.parent);
    }

    /**
     * Returns the x position at the end of the completed portion of the task bar.
     *
     * @param {IGanttData} data .
     * @returns {number} .
     * @private
     */
    public static getProgressX(data: IGanttData): number {
        const props: IGanttData['ganttProperties'] = data.ganttProperties;
        const progressWidth: number = props.isMilestone || isNullOrUndefined(props.progressWidth) ? 0 : props.progressWidth;
        const left: number = data.hasChildRecords && !props.isAutoSchedule ? props.autoLeft : props.left;
        return left + progressWidth;
    }
    public getProgressX(data: IGanttData): number {
        return ProgressLine.getProgressX(data);

    }


    public static isSkipped(data: IGanttData): boolean {
        const props: IGanttData['ganttProperties'] = data.ganttProperties;
        return !props || isNullOrUndefined(props.left) || isNullOrUndefined(props.startDate) ||
            isNullOrUndefined(props.endDate) && !props.isMilestone || props.progress >= 100;
    }
    private isSkipped(data: IGanttData): boolean {
        return ProgressLine.isSkipped(data);

    }

    /**
     * Computes the ordered list of segments for the given records. Shared by DOM and any future export rendering.
     *
     * @param {Gantt} parent .
     * @param {IGanttData[]} records - Visible records, in row order.
     * @param {number} statusX - Pixel position of the status date.
     * @param {number} startTop - Top offset of the first record.
     * @param {number} rowHeight - Height of each row.
     * @returns {IProgressLinePoint[]} .
     * @private
     */
    public static getProgressLinePoints(parent: Gantt, records: IGanttData[], statusX: number, startTop: number,
                                        rowHeight: number): IProgressLinePoint[] {
        const points: IProgressLinePoint[] = [];
        let prevX: number = statusX;
        let prevY: number = startTop;
        for (let i: number = 0; i < records.length; i++) {
            const rowTop: number = startTop + i * rowHeight;
            const taskId: string = String(records[i as number].ganttProperties ? records[i as number].ganttProperties.rowUniqueID : i);
            if (!ProgressLine.isSkipped(records[i as number])) {
                const x: number = ProgressLine.getProgressX(records[i as number]);

                const chartRows: ChartRows = parent.chartRowsModule;
                const isManualParent: boolean = records[i as number].hasChildRecords &&
                    !records[i as number].ganttProperties.isAutoSchedule;
                const taskbarCenter: number = records[i as number].ganttProperties.isMilestone ?
                    chartRows.milestoneMarginTop + chartRows.milestoneHeight / 2 :
                    isManualParent ? chartRows.taskBarMarginTop + 1 + (chartRows.taskBarHeight * 0.7) :
                        chartRows.taskBarMarginTop + chartRows.taskBarHeight / 2;
                const y: number = rowTop + taskbarCenter;
                points.push({ x1: prevX, y1: prevY, x2: x, y2: y, taskId: taskId });
                prevX = x;
                prevY = y;
            }
            points.push({ x1: prevX, y1: prevY, x2: statusX, y2: rowTop + rowHeight, taskId: taskId });
            prevX = statusX;
            prevY = rowTop + rowHeight;
        }
        return points;
    }
    public getProgressLinePoints(records: IGanttData[], statusX: number, startTop: number, rowHeight: number): IProgressLinePoint[] {

        return ProgressLine.getProgressLinePoints(this.parent, records, statusX, startTop, rowHeight);

    }

    /**
     * Renders (or re-renders) the progress line.
     *
     * @returns {void} .
     * @private
     */
    public renderProgressLine(): void {
        const parent: Gantt = this.parent;
        if (parent.isDestroyed || !parent.ganttChartModule || !parent.ganttChartModule.chartBodyContent) {
            return;
        }
        const statusX: number = this.getStatusDateX();
        const records: IGanttData[] = parent.expandedRecords.slice();
        if (isNullOrUndefined(statusX) || !records || records.length === 0) {
            this.removeContainer();
            return;
        }
        const container: HTMLElement = parent.ganttChartModule.chartBodyContent;
        let startTop: number = 0;
        if (parent.enableVirtualization && parent.virtualScrollModule && container.parentElement.querySelector('.e-virtualtable')) {
            const top: number = parent.virtualScrollModule.getTopPosition();
            startTop = isNaN(top) ? 0 : top;
        }
        const rowHeight: number = parent.rowHeight;
        const width: number = parent.enableTimelineVirtualization ?
            parent.timelineModule.wholeTimelineWidth : parent.timelineModule.totalTimelineWidth;
        const totalRows: number = parent.enableVirtualization ? parent.treeGrid.grid.pageSettings.totalRecordsCount || records.length
            : records.length;
        const height: number = Math.max(totalRows * rowHeight, startTop + records.length * rowHeight);
        const points: IProgressLinePoint[] = this.getProgressLinePoints(records, statusX, startTop, rowHeight);
        this.createSvg(container, width, height);
        const color: string = parent.progressLine.lineColor;
        const lineWidth: number = parent.progressLine.lineWidth > 0 ? parent.progressLine.lineWidth : 2;
        for (let i: number = 0; i < points.length; i++) {
            const point: IProgressLinePoint = points[i as number];
            const line: SVGElement = document.createElementNS(SVG_NS, 'line') as SVGElement;
            line.setAttribute('class', cls.progressLine);
            line.setAttribute('data-task-id', point.taskId);
            line.setAttribute('x1', this.mirror(point.x1, width));
            line.setAttribute('y1', String(point.y1));
            line.setAttribute('x2', this.mirror(point.x2, width));
            line.setAttribute('y2', String(point.y2));
            if (!isNullOrUndefined(color)) {
                line.style.stroke = color;
            }
            line.setAttribute('stroke-width', String(lineWidth));
            line.setAttribute('role', 'presentation');
            this.svgElement.appendChild(line);
        }
    }

    private mirror(x: number, width: number): string {
        return String(this.parent.enableRtl ? width - x : x);
    }

    private createSvg(container: HTMLElement, width: number, height: number): void {
        this.removeContainer();
        const svg: SVGElement = document.createElementNS(SVG_NS, 'svg') as SVGElement;
        svg.setAttribute('class', cls.progressLineContainer);
        svg.setAttribute('aria-hidden', 'true');
        svg.setAttribute('width', String(width));
        svg.setAttribute('height', String(height));
        svg.style.position = 'absolute';
        svg.style.top = '0';
        if (this.parent.enableTimelineVirtualization) {
            const taskTable: HTMLElement = this.parent.chartRowsModule.taskTable;
            if (this.parent.enableRtl) {
                svg.style.left = 'auto';
                svg.style.right = taskTable.style.right || '0px';
            } else {
                svg.style.left = taskTable.style.left || '0px';
                svg.style.right = 'auto';
            }
        } else {
            svg.style.left = '0';
        }
        svg.style.pointerEvents = 'none';
        svg.style.zIndex = '4';
        container.appendChild(svg);
        this.svgElement = svg;
    }

    /**
     * Removes the progress line from the DOM.
     *
     * @returns {void} .
     * @private
     */
    public removeContainer(): void {
        if (this.svgElement && this.svgElement.parentNode) {
            this.svgElement.parentNode.removeChild(this.svgElement);
        }
        this.svgElement = null;
    }

    /**
     * To get module name.
     *
     * @returns {string} .
     */
    public getModuleName(): string {
        return 'progressLine';
    }

    /**
     * @returns {void} .
     * @private
     */
    public destroy(): void {
        this.removeContainer();
        if (!this.parent || this.parent.isDestroyed) {
            return;
        }
        this.parent.off('refreshProgressLine', this.renderProgressLine);
        this.parent.off('refreshDayMarkers', this.renderProgressLine);
        this.parent.off('updateHeight', this.renderProgressLine);
        this.parent.off('chartScroll', this.onScroll);
    }
}
