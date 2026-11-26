import { Gantt } from '../base/gantt';
import { isNullOrUndefined, formatUnit, remove, SanitizeHtmlHelper, initializeCSPTemplate } from '@syncfusion/ej2-base';
import * as cls from '../base/css-constants';
import { IGanttData, ITaskData, ITaskSegment, TimelineFormat } from '../base/interface';
import { SCurveField } from '../base/enum';
import { SCurveDataModel, SCurveSettingsModel } from '../models/scurve-settings-model';

/**
 * Cumulative S-Curve value for a single date.
 */
export interface ISCurvePoint {
    date: Date;
    percentage: number;
    value?: number;
}

/**
 * Rendered S-Curve point with its dataset reference and chart coordinates.
 */
export interface ISCurveChartPoint extends ISCurvePoint {
    x: number;
    y: number;
    field: SCurveField;
    dataset: SCurveDataModel;
}

interface ISCurveSegment {
    start: Date;
    end: Date;
    duration: number;       // normalized to days
    width: number;          // rendered segment width, in pixels
    progressWidth: number;  // rendered progress width; -1 means unstarted
}

interface ISCurveTask {
    taskId: string | undefined;
    taskName: string | undefined;
    start: Date;
    end: Date;
    duration: number;
    earned: number;
    calendarContext: ITaskData['calendarContext'];
    isAutoSchedule: boolean;
    segments: ISCurveSegment[];
    totalDuration: number;
}

const SVG_NS: string = 'http://www.w3.org/2000/svg';
const PLOT_OFFSET: number = 10;
const MARKER_RADIUS: number = 4;

/**
 * Renders the Timeline S-Curve (cumulative Progress / Duration) as an SVG overlay in the chart rows container.
 * The overlay is display-only and is not created when `sCurveSettings.visible` is false.
 */
export class SCurve {
    public parent: Gantt;
    public svgElement: SVGSVGElement;
    private dataCache: { [field: string]: ISCurvePoint[] } = {};
    private cacheSignature: string = null;
    private chartPoints: ISCurveChartPoint[][] = [];

    constructor(gantt: Gantt) {
        this.parent = gantt;
        this.svgElement = null;
        this.parent.on('refreshDayMarkers', this.updateCoordinates, this);
        this.parent.on('updateHeight', this.updateCoordinates, this);
        this.parent.on('destroy', this.destroy, this);
    }

    private isEnabled(): boolean {
        const settings: SCurveSettingsModel = this.parent.sCurveSettings;
        const isLoadOnDemand: boolean = this.parent.loadChildOnDemand && !!this.parent.taskFields.hasChildMapping;
        return !!settings && settings.visible && !!settings.dataSet && settings.dataSet.length > 0 && !isLoadOnDemand;
    }

    private getContainer(): HTMLElement {
        return this.parent.ganttChartModule ? this.parent.ganttChartModule.chartBodyContent : null;
    }

    /**
     * Entry point: validates visibility and datasets, creates the SVG and draws every dataset.
     *
     * @returns {void}
     * @private
     */
    public renderSCurve(): void {
        const container: HTMLElement = this.getContainer();
        if (!container || !this.isEnabled() || this.parent.isDestroyed) {
            this.removeSvg();
            return;
        }
        const datasets: SCurveDataModel[] = this.parent.sCurveSettings.dataSet;
        const points: ISCurveChartPoint[][] = [];
        let hasPoints: boolean = false;
        for (let i: number = 0; i < datasets.length; i++) {
            const dataset: SCurveDataModel = datasets[i as number];
            const list: ISCurveChartPoint[] = (dataset.field === 'Progress' || dataset.field === 'Duration') ?
                this.getChartPoints(dataset) : [];
            hasPoints = hasPoints || list.length > 0;
            points.push(list);
        }
        if (!hasPoints) {
            this.removeSvg();
            return;
        }
        this.chartPoints = points;
        if (!this.svgElement || !container.contains(this.svgElement)) {
            this.svgElement = document.createElementNS(SVG_NS, 'svg') as SVGSVGElement;
            this.svgElement.setAttribute('class', cls.scurveSvg);
            this.svgElement.setAttribute('role', 'group');
            this.svgElement.setAttribute('aria-label', this.parent.localeObj.getConstant('sCurve'));
            this.svgElement.style.position = 'absolute';
            this.svgElement.style.pointerEvents = 'none';
            this.svgElement.style.zIndex = '10';
            container.appendChild(this.svgElement);
        }
        this.updateSvgBounds();
        while (this.svgElement.firstChild) {
            this.svgElement.removeChild(this.svgElement.firstChild);
        }
        for (let i: number = 0; i < points.length; i++) {
            if (points[i as number].length > 0) {
                this.createPath(points[i as number], datasets[i as number]);
                this.createMarkers(points[i as number], datasets[i as number]);
            }
        }
        this.updateTop();
    }

    /**
     * Recalculates dataset values only when the source task data changed, then redraws.
     *
     * @returns {void}
     * @private
     */
    public refreshSCurve(): void {
        if (!this.isEnabled()) {
            this.removeSvg();
            return;
        }
        const signature: string = this.getSignature();
        if (signature !== this.cacheSignature) {
            this.dataCache = {};
            this.cacheSignature = signature;
        } else if (this.isRenderedStateCurrent()) {
            return;
        }
        this.renderSCurve();
    }

    private isRenderedStateCurrent(): boolean {
        const container: HTMLElement = this.getContainer();
        if (!this.svgElement || !container || !container.contains(this.svgElement)) {
            return false;
        }
        const datasets: SCurveDataModel[] = this.parent.sCurveSettings.dataSet;
        if (this.chartPoints.length !== datasets.length) {
            return false;
        }
        const paths: NodeListOf<Element> = this.svgElement.querySelectorAll('.' + cls.scurveLine);
        let expected: number = 0;
        for (let i: number = 0; i < this.chartPoints.length; i++) {
            if (this.chartPoints[i as number].length > 0) {
                const dataset: SCurveDataModel = datasets[i as number];
                const color: string = dataset.color;
                const path: Element = paths[expected as number];
                if (!path || this.chartPoints[i as number][0].dataset !== dataset ||
                    this.chartPoints[i as number][0].field !== dataset.field ||
                    path.getAttribute('data-color') !== color) {
                    return false;
                }
                expected++;
            } else if (datasets[i as number].field === 'Progress' || datasets[i as number].field === 'Duration') {
                return false;
            }
        }
        return paths.length === expected;
    }

    /**
     * Recomputes only X/Y coordinates (zoom, unit size, height); dataset values are reused from cache.
     *
     * @returns {void}
     * @private
     */
    public updateCoordinates(): void {
        if (!this.svgElement || this.parent.isDestroyed) {
            return;
        }
        if (!this.isEnabled()) {
            this.removeSvg();
            return;
        }
        const signature: string = this.getSignature();
        if (signature !== this.cacheSignature) {
            this.dataCache = {};
            this.cacheSignature = signature;
            this.renderSCurve();
            return;
        }
        if (!this.isRenderedStateCurrent()) {
            this.renderSCurve();
            return;
        }
        this.updateSvgBounds();
        const circles: NodeListOf<Element> = this.svgElement.querySelectorAll('.' + cls.scurvePoint);
        const paths: NodeListOf<Element> = this.svgElement.querySelectorAll('.' + cls.scurveLine);
        let circleIndex: number = 0;
        let pathIndex: number = 0;
        for (let i: number = 0; i < this.chartPoints.length; i++) {
            const list: ISCurveChartPoint[] = this.chartPoints[i as number];
            if (list.length === 0) {
                continue;
            }
            for (let j: number = 0; j < list.length; j++) {
                const point: ISCurveChartPoint = list[j as number];
                point.x = this.getX(point.date);
                point.y = this.getY(point.percentage);
                const circle: Element = circles[circleIndex++];
                if (circle) {
                    circle.setAttribute('cx', String(point.x));
                    circle.setAttribute('cy', String(point.y));
                }
            }
            paths[pathIndex++].setAttribute('d', this.getPathData(list));
        }
    }

    /**
     * Keeps the SVG top aligned with the event marker container.
     *
     * @param {number} scrollTop - optional vertical offset.
     * @returns {void}
     * @private
     */
    public updateTop(scrollTop?: number): void {
        if (!this.svgElement) {
            return;
        }
        if (isNullOrUndefined(scrollTop)) {
            const content: HTMLElement = this.parent.treeGrid.element.querySelector('.e-content');
            scrollTop = content ? content.scrollTop : 0;
            if (this.parent.virtualScrollModule && this.parent.enableVirtualization) {
                scrollTop = scrollTop - this.parent.virtualScrollModule.getTopPosition();
            }
        }
        this.svgElement.style.top = formatUnit(scrollTop);
    }

    private getChartHeight(): number {
        const height: number = this.parent.getContentHeight();
        return height > 0 ? height : this.getContainer().offsetHeight;
    }

    private getChartWidth(): number {
        const timeline: { totalTimelineWidth: number; wholeTimelineWidth: number } = this.parent.timelineModule;
        return this.parent.enableTimelineVirtualization ? timeline.wholeTimelineWidth : timeline.totalTimelineWidth;
    }

    private updateSvgBounds(): void {
        const height: number = this.getChartHeight();
        const width: number = this.getChartWidth();
        this.svgElement.style.height = formatUnit(height);
        this.svgElement.style.width = formatUnit(width);
        this.svgElement.style.left = '0px';
        this.svgElement.style.padding = '0px';
        this.svgElement.setAttribute('height', String(height));
        this.svgElement.setAttribute('width', String(width));
    }

    private getExportX(date: Date, cells: TimelineFormat[]): number {
        let left: number = 0;
        const time: number = date.getTime();
        for (let i: number = 0; i < cells.length; i++) {
            const cell: TimelineFormat = cells[i as number];
            const width: number = cell.width || 0;
            if (!cell.startDate || !cell.endDate) {
                left += width;
                continue;
            }
            const startTime: number = cell.startDate.getTime();
            const endTime: number = cell.endDate.getTime();
            if (time < startTime) {
                break;
            }
            if (time <= endTime) {
                let position: number = 0;
                if (time >= endTime) {
                    position = 1;
                } else if (time > startTime) {
                    const startLeft: number = this.parent.dataOperation.getTaskLeft(
                        cell.startDate, false, this.parent.defaultCalendarContext);
                    const endLeft: number = this.parent.dataOperation.getTaskLeft(
                        cell.endDate, false, this.parent.defaultCalendarContext);
                    const dateLeft: number = this.parent.dataOperation.getTaskLeft(
                        date, false, this.parent.defaultCalendarContext);
                    const intervalWidth: number = endLeft - startLeft;
                    position = intervalWidth > 0 ? (dateLeft - startLeft) / intervalWidth :
                        (time - startTime) / (endTime - startTime);
                    position = Math.max(0, Math.min(1, position));
                }
                left += width * position;
                break;
            }
            left += width;
        }
        let timelineWidth: number = 0;
        for (let i: number = 0; i < cells.length; i++) {
            timelineWidth += cells[i as number].width || 0;
        }
        return this.parent.enableRtl ? timelineWidth - left : left;
    }

    private getX(date: Date): number {
        const left: number = this.parent.dataOperation.getTaskLeft(date, false, this.parent.defaultCalendarContext, true);
        return this.parent.enableRtl ? this.getChartWidth() - left : left;
    }

    private getY(percentage: number): number {
        const chartHeight: number = this.getChartHeight();
        const plot: number = chartHeight - (PLOT_OFFSET * 2);
        return (chartHeight - PLOT_OFFSET) - (percentage / 100) * plot;
    }

    /**
     * Converts a calculated dataset into chart coordinates.
     *
     * @param {SCurveDataModel} dataset - dataset configuration.
     * @param {TimelineFormat[]} [cells] - optional timeline cells used to generate points (PDF export).
     * @returns {ISCurveChartPoint[]} chart points.
     * @private
     */
    public getChartPoints(dataset: SCurveDataModel, cells?: TimelineFormat[]): ISCurveChartPoint[] {
        const values: ISCurvePoint[] = this.calculateDataset(dataset.field, cells);
        const result: ISCurveChartPoint[] = [];
        for (let i: number = 0; i < values.length; i++) {
            result.push({
                date: values[i as number].date,
                percentage: values[i as number].percentage,
                x: cells ? this.getExportX(values[i as number].date, cells) : this.getX(values[i as number].date),
                y: this.getY(values[i as number].percentage),
                field: dataset.field,
                dataset: dataset,
                value: values[i as number].value
            });
        }
        return result;
    }

    private getPathData(list: ISCurveChartPoint[]): string {
        let data: string = '';
        for (let i: number = 0; i < list.length; i++) {
            data += (i === 0 ? 'M' : ' L') + list[i as number].x + ',' + list[i as number].y;
        }
        return data;
    }

    private createPath(list: ISCurveChartPoint[], dataset: SCurveDataModel): void {
        const path: SVGPathElement = document.createElementNS(SVG_NS, 'path') as SVGPathElement;
        const color: string = dataset.color;
        path.setAttribute('class', cls.scurveLine);
        path.setAttribute('d', this.getPathData(list));
        path.setAttribute('data-field', (dataset.field as string));
        path.style.fill = 'none';
        path.style.stroke = color;
        path.setAttribute('data-color', color);
        path.style.pointerEvents = 'none';
        this.svgElement.appendChild(path);
    }

    private createMarkers(list: ISCurveChartPoint[], dataset: SCurveDataModel): void {
        const datasetIndex: number = this.parent.sCurveSettings.dataSet.indexOf(dataset);
        const color: string = dataset.color;
        for (let i: number = 0; i < list.length; i++) {
            const point: ISCurveChartPoint = list[i as number];
            const circle: SVGCircleElement = document.createElementNS(SVG_NS, 'circle') as SVGCircleElement;
            circle.setAttribute('class', cls.scurvePoint);
            circle.setAttribute('cx', String(point.x));
            circle.setAttribute('cy', String(point.y));
            circle.setAttribute('r', String(MARKER_RADIUS));
            circle.style.fill = color;
            circle.style.stroke = color;
            circle.setAttribute('role', 'img');
            circle.setAttribute('aria-label', this.getFieldText(point.field) + ' ' +
                this.parent.getFormatedDate(point.date) + ' ' + point.percentage + '%');
            circle.setAttribute('data-field', point.field);
            circle.setAttribute('data-time', String(point.date.getTime()));
            circle.setAttribute('data-percentage', String(point.percentage));
            circle.setAttribute('data-value', String(point.value));
            circle.setAttribute('data-dataset-index', String(datasetIndex));
            circle.style.pointerEvents = 'auto';
            this.svgElement.appendChild(circle);
        }
    }

    private getFieldText(field: SCurveField): string {
        return this.parent.localeObj.getConstant(field === 'Progress' ? 'progress' : 'duration');
    }

    /**
     * Returns tooltip data for an S-Curve marker element.
     *
     * @param {Element} target - hovered circle.
     * @returns {Object} tooltip data.
     * @private
     */
    public getTooltipData(target: Element): { field: string; name: string; date: Date; percentage: number;
        value: number; } {
        const field: SCurveField = target.getAttribute('data-field') as SCurveField;
        const date: Date = new Date(Number(target.getAttribute('data-time')));
        return {
            field: field,
            name: this.getFieldText(field),
            date: date,
            percentage: Number(target.getAttribute('data-percentage')),
            value: Number(target.getAttribute('data-value'))
        };
    }

    /**
     * Builds the default tooltip content for an S-Curve marker.
     *
     * @param {Element} target - hovered circle.
     * @returns {string} html content.
     * @private
     */
    public getDefaultTooltipContent(target: Element): string | Function {
        const info: { name: string; date: Date; percentage: number } = this.getTooltipData(target);
        let name: string = info.name;
        let date: string = this.parent.getFormatedDate(info.date);

        if (this.parent.enableHtmlSanitizer) {
            name = SanitizeHtmlHelper.sanitize(name);
            date = SanitizeHtmlHelper.sanitize(date);
        }

        const dateText: string = this.parent.localeObj.getConstant('sCurveDate');
        const valueRow: string =
            '<tr><td class="e-gantt-tooltip-label">' + name +
            '</td><td class=' + cls.templatePadding +
            '>: </td><td class = "e-gantt-tooltip-value">' + info.percentage + '%</td></tr>';

        const dateRow: string =
            '<tr><td class="e-gantt-tooltip-label">' + dateText +
            '</td><td class=' + cls.templatePadding +
            '>: </td><td class = "e-gantt-tooltip-value">' + date + '</td></tr>';

        const contentTemp: Function = function(): string {
            return '<table class="e-gantt-tooltiptable"><tbody>' +
                valueRow + dateRow +
                '</tbody></table>';
        };

        const content: string | Function = initializeCSPTemplate(contentTemp);
        return content;
    }

    /**
     * Signature of every task value that affects the curve; scroll, filter and sort do not change it.
     *
     * @returns {string} signature.
     */
    private getSignature(): string {
        const tasks: ISCurveTask[] = this.getParticipatingTasks();
        const cells: TimelineFormat[] = this.getIntervalCells();
        let signature: string = String(tasks.length) + '#' + cells.length;
        for (let i: number = 0; i < cells.length; i++) {
            const date: Date = cells[i as number].endDate || cells[i as number].startDate;
            signature += ',' + (date ? date.getTime() : '');
        }
        for (let i: number = 0; i < tasks.length; i++) {
            const task: ISCurveTask = tasks[i as number];
            signature += '|' + task.start.getTime() + ',' + task.end.getTime() + ',' + task.duration + ',' + task.earned;
        }
        return signature;
    }

    /**
     * Rendered timeline cells of the point-generation tier: the bottom tier of a dual-tier timeline, or the
     * only configured tier of a single-tier timeline. The cells already honour the tier unit and count.
     *
     * @returns {TimelineFormat[]} rendered cells.
     */
    private getIntervalCells(): TimelineFormat[] {
        const timeline: Gantt['timelineModule'] = this.parent.timelineModule;
        if (!timeline) {
            return [];
        }
        const useTopTier: boolean = timeline.isSingleTier && timeline.bottomTier === 'None';
        return (useTopTier ? timeline.topTierCollection : timeline.bottomTierCollection) || [];
    }

    private getExportIntervalCells(): TimelineFormat[] {
        const timeline: Gantt['timelineModule'] = this.parent.timelineModule;
        if (!timeline) {
            return [];
        }
        const useTopTier: boolean = timeline.isSingleTier && timeline.bottomTier === 'None';
        if (this.parent.enableTimelineVirtualization) {
            const pdfCells: TimelineFormat[] = useTopTier ?
                timeline.pdfExportTopTierCollection : timeline.pdfExportBottomTierCollection;
            if (pdfCells && pdfCells.length > 0) {
                return pdfCells;
            }
        }
        return this.getIntervalCells();
    }

    private getIntervalDates(tasks: ISCurveTask[], cells: TimelineFormat[] = this.getIntervalCells()): Date[] {
        const dates: Date[] = [];
        if (tasks.length === 0) {
            return dates;
        }
        let startTime: number = tasks[0].start.getTime();
        let endTime: number = tasks[0].end.getTime();
        for (let i: number = 1; i < tasks.length; i++) {
            startTime = Math.min(startTime, tasks[i as number].start.getTime());
            endTime = Math.max(endTime, tasks[i as number].end.getTime());
        }
        for (let i: number = 0; i < cells.length; i++) {
            const date: Date = cells[i as number].endDate || cells[i as number].startDate;
            if (date instanceof Date && !isNaN(date.getTime()) &&
                date.getTime() >= startTime && date.getTime() <= endTime) {
                dates.push(new Date(date.getTime()));
            }

        }
        dates.push(new Date(startTime));
        dates.push(new Date(endTime));
        dates.sort((first: Date, second: Date) => first.getTime() - second.getTime());
        const uniqueDates: Date[] = [];
        for (let i: number = 0; i < dates.length; i++) {
            if (i === 0 || dates[i as number].getTime() !== dates[i - 1].getTime()) {
                uniqueDates.push(dates[i as number]);
            }
        }
        return uniqueDates;
    }

    /**
     * Leaf, scheduled tasks from the complete (unfiltered) data source.
     *
     * @returns {ISCurveTask[]} participating tasks.
     */
    private getParticipatingTasks(): ISCurveTask[] {
        const tasks: ISCurveTask[] = [];
        const flat: IGanttData[] = this.parent.flatData || [];
        // Resource View lists a task once per assigned resource. Count each logical task once.
        const isResourceView: boolean = this.parent.viewType === 'ResourceView';
        const counted: { [taskId: string]: boolean } = {};
        for (let i: number = 0; i < flat.length; i++) {
            const record: IGanttData = flat[i as number];
            const prop: ITaskData = record.ganttProperties;
            if (!prop || record.hasChildRecords || (record.childRecords && record.childRecords.length > 0) ||
                !(prop.startDate instanceof Date) || isNaN(prop.startDate.getTime())) {
                continue;
            }
            if (isResourceView && !isNullOrUndefined(prop.taskId)) {
                const key: string = String(prop.taskId);
                if (counted[key as string]) {
                    continue;
                }
                counted[key as string] = true;
            }
            const end: Date = (prop.endDate instanceof Date && !isNaN(prop.endDate.getTime())) ? prop.endDate : null;
            const isMilestone: boolean = !!prop.isMilestone || prop.duration === 0;
            if (isNullOrUndefined(prop.duration) || isNaN(prop.duration) || (!isMilestone && !end)) {
                continue;
            }
            const hasSegments: boolean = !isNullOrUndefined(prop.segments) && prop.segments.length > 1;
            const segments: ISCurveSegment[] = [];
            const sourceSegments: ITaskSegment[] = prop.segments || [];
            for (let j: number = 0; j < sourceSegments.length; j++) {
                const segment: ITaskSegment = sourceSegments[j as number];
                if (segment.startDate instanceof Date && segment.endDate instanceof Date &&
                    !isNaN(segment.startDate.getTime()) && !isNaN(segment.endDate.getTime())) {
                    segments.push({
                        start: segment.startDate,
                        end: segment.endDate,
                        duration: this.parent.dataOperation['getDurationInDay'](
                            segment.duration, prop.durationUnit
                        ),
                        width: segment.width,
                        progressWidth: segment.progressWidth
                    });
                }
            }
            const workingDuration: number = isMilestone ? 0 : this.parent.dataOperation['getDurationInDay'](prop.duration, prop.durationUnit);
            const durationInDay: number = (!isMilestone && hasSegments) ?
                this.parent.dataOperation['getDurationInDay'](this.parent.dataOperation.totalDuration(prop.segments), prop.durationUnit) : workingDuration;
            const progress: number = isMilestone ? 0 : (isNullOrUndefined(prop.progress) ? 0 : Number(prop.progress));
            const totalDurationDays: number =
                        this.parent.dataOperation.getDuration(
                            prop.startDate,
                            end || prop.startDate,
                            'day',
                            prop.isAutoSchedule !== false,
                            false,
                            false,
                            prop.calendarContext || this.parent.defaultCalendarContext
                        ) || 0;
            if (isNaN(progress) || progress < 0 || progress > 100 || isNaN(durationInDay)) {
                continue;
            }
            tasks.push({
                taskId: prop.taskId,
                taskName: prop.taskName,
                start: prop.startDate,
                end: end || prop.startDate,
                duration: durationInDay,
                earned: durationInDay * progress / 100,
                calendarContext: prop.calendarContext || this.parent.defaultCalendarContext,
                isAutoSchedule: prop.isAutoSchedule !== false,
                segments: segments,
                totalDuration: totalDurationDays
            });
        }
        return tasks;
    }

    /**
     * Builds `{date, percentage}[]` for the given field (cached until source data changes).
     *
     * @param {SCurveField} field - Progress or Duration.
     * @param {TimelineFormat[]} [cells] - optional timeline cells used to generate points; when given, the result is not cached.
     * @returns {ISCurvePoint[]} calculated points.
     * @private
     */
    public calculateDataset(field: SCurveField, cells?: TimelineFormat[]): ISCurvePoint[] {
        if (!cells && this.dataCache[field as string]) {
            return this.dataCache[field as string];
        }
        const tasks: ISCurveTask[] = this.getParticipatingTasks();
        let total: number = 0;
        for (let i: number = 0; i < tasks.length; i++) {
            total += tasks[i as number].duration;
        }
        const result: ISCurvePoint[] = [];
        if (tasks.length > 0 && total > 0) {
            const dates: Date[] = this.getIntervalDates(tasks, cells);
            for (let i: number = 0; i < dates.length; i++) {
                const cumulative: number = this.getCumulative(field, tasks, dates[i as number]);
                const percentage: number = Math.round(cumulative / total * 100);
                result.push({ date: dates[i as number], percentage: percentage, value: field === 'Duration' ? cumulative : percentage });
            }
        }
        if (!cells) {
            this.dataCache[field as string] = result;
        }
        return result;
    }

    private getCumulative(field: SCurveField, tasks: ISCurveTask[], date: Date): number {
        let cumulative: number = 0;
        const time: number = date.getTime();
        for (let i: number = 0; i < tasks.length; i++) {
            const task: ISCurveTask = tasks[i as number];
            if (task.duration === 0 || time < task.start.getTime()) {
                continue;
            }
            if (field === 'Progress' && task.segments.length > 0) {
                cumulative += this.getSplitTaskProgress(task, date);
            }
            else if (time >= task.end.getTime()) {
                cumulative += field === 'Duration' ? task.duration : task.earned;
            } else if (field === 'Duration') {
                cumulative += task.duration * this.getElapsedRatio(task, date);
            } else {
                cumulative += Math.min(task.earned, this.getElapsedDays(task, date));
            }
        }
        return cumulative;
    }

    private getElapsedDays(task: ISCurveTask, date: Date): number {
        const elapsed: number = this.parent.dataOperation.getDuration(task.start, date, 'day', task.isAutoSchedule, false, false,
                                                                      task.calendarContext);
        if (isNullOrUndefined(elapsed)) {
            const span: number = task.end.getTime() - task.start.getTime();
            return span > 0 ? task.duration * (date.getTime() - task.start.getTime()) / span : 0;
        }
        return Math.max(0, elapsed);
    }

    private getElapsedRatio(task: ISCurveTask, date: Date): number {
        const dataOperation: Gantt['dataOperation'] = this.parent.dataOperation;
        const elapsed: number = dataOperation.getDuration(task.start, date, 'day', task.isAutoSchedule, false, false,
                                                          task.calendarContext);
        const whole: number = task.totalDuration;
        if (isNullOrUndefined(elapsed) || isNullOrUndefined(whole) || whole <= 0) {
            const span: number = task.end.getTime() - task.start.getTime();
            return span > 0 ? (date.getTime() - task.start.getTime()) / span : 0;
        }
        return Math.min(1, Math.max(0, elapsed / whole));
    }

    private getSplitTaskProgress(task: ISCurveTask, date: Date): number {
        let cumulative: number = 0;
        const time: number = date.getTime();

        for (let i: number = 0; i < task.segments.length; i++) {
            const segment: ISCurveSegment = task.segments[i as number];
            const width: number = segment.width;
            const progressWidth: number = segment.progressWidth;

            // -1 is the taskbar's "unstarted segment" marker.
            const ratio: number = width > 0 && progressWidth > 0
                ? Math.min(1, progressWidth / width)
                : 0;
            const earned: number = segment.duration * ratio;

            if (time < segment.start.getTime()) {
                continue;
            }
            if (time >= segment.end.getTime()) {
                cumulative += earned;
                continue;
            }
            const elapsed: number = this.parent.dataOperation.getDuration(segment.start,
                                                                          date, 'day', task.isAutoSchedule, false, false, task.calendarContext);

            if (!isNullOrUndefined(elapsed)) {
                cumulative += Math.min(earned, Math.max(0, elapsed));
            } else {
                const span: number = segment.end.getTime() - segment.start.getTime();
                const elapsedRatio: number = span > 0
                    ? Math.max(0, Math.min(1, (time - segment.start.getTime()) / span))
                    : 0;
                cumulative += Math.min(earned, segment.duration * elapsedRatio);
            }
        }

        return cumulative;
    }

    /**
     * Returns the calculated points and colors of every dataset (used by PDF export).
     *
     * @returns {Object[]} export data per dataset.
     * @private
     */
    public getExportData(): { points: ISCurveChartPoint[]; color: string }[] {
        const result: { points: ISCurveChartPoint[]; color: string }[] = [];
        if (!this.isEnabled()) {
            return result;
        }
        const datasets: SCurveDataModel[] = this.parent.sCurveSettings.dataSet;
        const cells: TimelineFormat[] = this.getExportIntervalCells();
        for (let i: number = 0; i < datasets.length; i++) {
            const dataset: SCurveDataModel = datasets[i as number];
            const color: string = dataset.color || (dataset.field === 'Duration' ? '#e3165b' : '#4d831e');
            if (dataset.field === 'Progress' || dataset.field === 'Duration') {
                const points: ISCurveChartPoint[] = this.getChartPoints(dataset, cells);
                if (points.length > 0) {
                    result.push({ points: points, color: color });
                }
            }
        }
        return result;
    }

    private removeSvg(): void {
        if (this.svgElement) {
            remove(this.svgElement);
            this.svgElement = null;
        }
        this.chartPoints = [];
    }

    /**
     * Removes the SVG and clears caches.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        if (!this.parent || this.parent.isDestroyed) {
            return;
        }
        this.removeSvg();
        this.dataCache = {};
        this.cacheSignature = null;
        this.parent.off('refreshDayMarkers', this.updateCoordinates);
        this.parent.off('updateHeight', this.updateCoordinates);
        this.parent.off('destroy', this.destroy);
    }

    public getModuleName(): string {
        return 'sCurve';
    }
}
