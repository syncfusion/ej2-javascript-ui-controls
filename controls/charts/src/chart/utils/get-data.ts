/* eslint-disable jsdoc/require-param-type */
/* eslint-disable jsdoc/require-param-description */
/* eslint-disable valid-jsdoc */
/* eslint-disable jsdoc/require-returns */
/* eslint-disable jsdoc/require-param */
import { Chart } from '../chart';
import { withInBounds, PointData, getValueXByPoint, getValueYByPoint, AccPointData, sort, Point3D } from '../../common/utils/helper';
import { Rect } from '@syncfusion/ej2-svg-base';
import { Series, Points } from '../series/chart-series';

/**
 * To get the data on mouse move.
 *
 * @private
 */
export class ChartData {
    /** @private */
    public chart: Chart;
    public lierIndex: number;
    /** @private */
    public currentPoints: PointData[] | AccPointData[] | Point3D[] = [];
    /** @private */
    public previousPoints: PointData[] | AccPointData[] | Point3D[] = [];
    public insideRegion: boolean = false;
    public commonXvalues: number[] = [];

    /**
     * Constructor for the data.
     *
     * @private
     */

    constructor(chart: Chart) {
        this.chart = chart;
        this.lierIndex = 0;
    }
    /**
     * Method to get the Data.
     *
     * @private
     */

    public getData(): PointData {
        const chart: Chart = this.chart;
        let point: Points = null;
        let series: Series = null;
        let width: number; let height: number;
        let mouseX: number; let mouseY: number;
        for (let len: number = chart.visibleSeries.length, i: number = len - 1; i >= 0; i--) {
            series = chart.visibleSeries[i as number];
            width = (series.type === 'Scatter' || series.drawType === 'Scatter' || (series.marker.visible))
                ? (series.marker.height + 5) / 2 : 0;
            height = (series.type === 'Scatter' || series.drawType === 'Scatter' || (series.marker.visible))
                ? (series.marker.width + 5) / 2 : 0;
            mouseX = chart.mouseX; mouseY = chart.mouseY;
            if (series.dragSettings.enable && series.isRectSeries) {
                if (!(series.type === 'Bar' && chart.isTransposed) && (chart.isTransposed || series.type === 'Bar')) {
                    const markerWidth: number = series.marker.width / 2;
                    mouseX = series.yAxis.isAxisInverse ? mouseX + markerWidth : mouseX - markerWidth;
                } else {
                    const markerHeight: number = series.marker.height / 2;
                    mouseY = series.yAxis.isAxisInverse ? mouseY - markerHeight : mouseY + markerHeight;
                }
            }
            if (series.visible && withInBounds(mouseX, mouseY, series.clipRect, width, height)) {
                point = this.getRectPoint(series, series.clipRect, mouseX, mouseY);
            }
            if (point) {
                return new PointData(point, series);
            }
        }
        return new PointData(point, series);
    }

    public isSelected(chart : Chart) : boolean {
        return ((chart.selectionMode.indexOf('Drag') > -1 || chart.selectionMode.indexOf('Lasso') > -1 ) && chart.selectionModule &&
                chart.selectionModule.rectPoints !== null);
    }

    private getRectPoint(series: Series, rect: Rect, x: number, y: number): Points {
        const chart: Chart = this.chart;
        let fromCenterX: number; let fromCenterY: number;
        let clickAngle: number; let arcAngle: number = 0;
        let startAngle: number; let endAngle: number;
        let distanceFromCenter: number;
        if (chart.isScrolling) {
            return null;
        }
        for (const point of series.points) {
            if (!point.regionData) {
                if (!point.regions || !point.regions.length) {
                    continue;
                }
            }
            if (point.regionData && this.chart.chartAreaType === 'PolarRadar' && series.drawType.indexOf('Column') > -1) {
                fromCenterX = x - (series.clipRect.width / 2 + series.clipRect.x);
                fromCenterY = y - (series.clipRect.height / 2 + series.clipRect.y);
                arcAngle = 2 * Math.PI * (point.regionData.currentXPosition < 0 ? 1 + point.regionData.currentXPosition
                    : point.regionData.currentXPosition);
                clickAngle = (Math.atan2(fromCenterY, fromCenterX) + 0.5 * Math.PI - arcAngle) % (2 * Math.PI);
                clickAngle = clickAngle < 0 ? 2 * Math.PI + clickAngle : clickAngle;
                clickAngle = clickAngle + 2 * Math.PI * series.chart.primaryXAxis.startAngle;
                startAngle = point.regionData.startAngle;
                startAngle -= arcAngle;
                startAngle = startAngle < 0 ? 2 * Math.PI + startAngle : startAngle;
                endAngle = point.regionData.endAngle;
                endAngle -= arcAngle;
                endAngle = endAngle < 0 ? 2 * Math.PI + endAngle : endAngle;
                distanceFromCenter = Math.sqrt(Math.pow(Math.abs(fromCenterX), 2) + Math.pow(Math.abs(fromCenterY), 2));
                if (clickAngle >= startAngle && clickAngle <= endAngle &&
                    (((distanceFromCenter >= point.regionData.innerRadius && distanceFromCenter <= point.regionData.radius) ||
                        (distanceFromCenter <= point.regionData.innerRadius && distanceFromCenter >= point.regionData.radius))
                        && distanceFromCenter <= series.chart.radius)) {
                    return point;
                }
            }
            if ((series.dragSettings.enable && series.isRectSeries) || (series.isRectSeries && series.marker.visible)) {
                if (this.isPointInThresholdRegion(x, y, point, rect, series)) {
                    this.insideRegion = true;
                    return point;
                }
            }
            if (!this.insideRegion && this.checkRegionContainsPoint(point.regions, rect, x, y)) {
                return point;
            } else if (this.insideRegion && this.checkRegionContainsPoint(point.regions, rect, x, y)) {
                return point;
            }
        }
        return null;
    }

    /**
     * Checks whether the region contains a point
     */
    private checkRegionContainsPoint(regionRect: Rect[], rect: Rect, x: number, y: number): boolean {
        return regionRect.some((region: Rect, index: number) => {
            this.lierIndex = index;
            return withInBounds(
                x, y,
                new Rect(
                    (this.chart.chartAreaType === 'Cartesian' ? rect.x : 0) + region.x,
                    (this.chart.chartAreaType === 'Cartesian' ? rect.y : 0) + region.y,
                    region.width, region.height
                )
            );
        });
    }
    /**
     * To check the point in threshold region for column and bar series
     *
     * @param {number} x X coordinate
     * @param {number} y Y coodinate
     * @param {Points} point point
     * @param {Rect} rect point rect region
     * @param {Series} series series
     */
    private isPointInThresholdRegion(x: number, y: number, point: Points, rect: Rect, series: Series): boolean {
        const isBar: boolean = series.type === 'Bar';
        const isInversed: boolean = series.yAxis.isAxisInverse;
        const isTransposed: boolean = series.chart.isTransposed;
        const heightValue: number = 10; let yValue: number = 0;
        let xValue: number = 0;
        let width: number;
        let height: number = width = 2 * heightValue;
        if (isInversed && isTransposed) {
            if (isBar) {
                yValue = point.regions[0].height - heightValue;
                width = point.regions[0].width;
            } else {
                xValue = -heightValue;
                height = point.regions[0].height;
            }
        } else if (isInversed || point.yValue < 0) {
            if (isBar) {
                xValue = -heightValue;
                height = point.regions[0].height;
            } else {
                yValue = point.regions[0].height - heightValue;
                width = point.regions[0].width;
            }
        } else if (isTransposed) {
            if (isBar) {
                yValue = -heightValue;
                width = point.regions[0].width;
            } else {
                xValue = point.regions[0].width - heightValue;
                height = point.regions[0].height;
            }
        } else {
            if (isBar) {
                xValue = point.regions[0].width - heightValue;
                height = point.regions[0].height;
            } else {
                yValue = -heightValue;
                width = point.regions[0].width;
            }
        }
        return point.regions.some((region: Rect) => {
            return withInBounds(
                x, y,
                new Rect(
                    (this.chart.chartAreaType === 'Cartesian' ? rect.x : 0) + region.x + xValue,
                    (this.chart.chartAreaType === 'Cartesian' ? rect.y : 0) + region.y + yValue,
                    width, height
                )
            );
        });
    }
    /**
     * @private
     */
    public getClosest(series: Series, value: number, xvalues?: number[]): number {
        let closest: number; let data: number;
        const xData: number[] = xvalues ? xvalues : series.xData;
        const xLength: number = xData.length;
        let leftSideNearest: number = 0.5;
        let rightSideNearest: number = 0.5;
        if (series.xAxis.valueType === 'DateTime' && series.points.length === 1) {
            leftSideNearest = series.xAxis.visibleRange.min;
            rightSideNearest = series.xAxis.visibleRange.max;
            for (let index: number = 0; index < series.chart.visibleSeries.length; index++) {
                let visibleSeries: Series = series.chart.visibleSeries[index as number];
                if (visibleSeries.xMin >= leftSideNearest && visibleSeries.xMin < series.xMin) {
                    leftSideNearest = visibleSeries.xMin + 0.1;
                }
                if (visibleSeries.xMax <= rightSideNearest && visibleSeries.xMax > series.xMax) {
                    rightSideNearest = visibleSeries.xMax - 0.1;
                }
                if (visibleSeries.points.length > 1) {
                    if (visibleSeries.xMax >= leftSideNearest && visibleSeries.xMax < series.xMin) {
                        leftSideNearest = visibleSeries.xMax + 0.1;
                    }
                    if (visibleSeries.xMin <= rightSideNearest && visibleSeries.xMin > series.xMax) {
                        rightSideNearest = visibleSeries.xMin - 0.1;
                    }
                }
            }
            if (leftSideNearest !== series.xAxis.visibleRange.min) {
                leftSideNearest = Math.abs(series.xMin - leftSideNearest) / 2;
            }
            if (rightSideNearest !== series.xAxis.visibleRange.max) {
                rightSideNearest = Math.abs(series.xMax - rightSideNearest) / 2;
            }
        }
        if (value >= <number>series.xMin - leftSideNearest && value <= <number>series.xMax + rightSideNearest) {
            for (let i: number = 0; i < xLength; i++) {
                data = xData[i as number];
                if (closest == null || Math.abs(data - value) < Math.abs(closest - value)) {
                    closest = data;
                }
            }
        }
        const isDataExist: boolean = series.xData.indexOf(closest) !== -1;
        if (isDataExist) {
            return closest;
        } else {
            return null;
        }
    }

    private binarySearch(target: number, list: Points[]): Points {
        let first: number = 0;
        let last: number = list.length;
        let position: number = -1;
        let found: boolean = false;
        let middle: number;

        while (found === false && first <= last) {
            middle = Math.floor((first + last) / 2);
            if (list[middle as number].xValue === target){
                found = true;
                position = middle;
            } else if (list[middle as number].xValue > target) {
                last = middle - 1;
            } else {
                first = middle + 1;
            }
        }
        return position !== -1 ? list[position as number] : null;
    }

    public getClosestX(chart: Chart, series: Series, xvalues?: number[]): PointData {
        let value: number;
        const rect: Rect = series.clipRect;
        if (chart.mouseX <= rect.x + rect.width && chart.mouseX >= rect.x) {
            if (!chart.requireInvertedAxis) {
                value = getValueXByPoint(chart.mouseX - rect.x, rect.width, series.xAxis);
            } else {
                value = getValueYByPoint(chart.mouseY - rect.y, rect.height, series.xAxis);
            }
        }
        const closest: number = this.getClosest(series, value, xvalues);
        const point: Points = ((closest || closest === 0) && series.points.length > 0) ? this.binarySearch(closest, sort(series.points, ['xValue']) as Points[]) : null;
        if (point && point.visible) {
            if (!(this.chart.chartAreaType === 'Cartesian' && ((series.category == 'Indicator' && series.name == 'Histogram') ||
                (point.symbolLocations && point.symbolLocations.length > 0 && point.symbolLocations[0].x >= 0 && point.symbolLocations[0].x <= rect.width)))) {
                return null;
            }
            return new PointData(point, series);
        }
        return null;
    }

    /**
     * Merge all visible series X values for shared tooltip (EJ2-47072)
     *
     * @param visibleSeries
     * @private
     */
    public mergeXvalues(visibleSeries: Series[]): number[] {
        if (visibleSeries.length && (!this.commonXvalues.length || (this.commonXvalues.length !== visibleSeries[0].xData.length))) {
            this.commonXvalues = visibleSeries[0].xData;
            for (let index: number = 1; index < visibleSeries.length; index++) {
                this.commonXvalues = this.getDistinctValues(this.commonXvalues, visibleSeries[index as number].xData);
            }
        }
        return this.commonXvalues;
    }

    public commonXValue(visibleSeries: Series[]): number[] {
        const commonXValues: number[] = [];
        for (let j: number = 0; j < visibleSeries.length; j++) {
            for (let i: number = 0; (visibleSeries[j as number].points && i < visibleSeries[j as number].points.length); i++) {
                const point: Points = visibleSeries[j as number].points[i as number];
                if (point && (point.index === 0 || point.index === visibleSeries[j as number].points.length - 1 ||
                    (point.symbolLocations && point.symbolLocations.length > 0))) {
                    commonXValues.push(point.xValue);
                }
            }
        }
        return commonXValues;
    }


    private getDistinctValues(first: number[] = [], second: number[] = []): number[] {
        const intial: object = {};
        const result: number[] = [];
        let index: number;

        for (index = 0; index < first.length; index++) {
            const temp: number = first[index as number];
            if (!intial[temp as number]) {
                intial[temp as number] = true;
                result.push(temp);
            }
        }
        for (index = 0; index < second.length; index++) {
            const temp: number = second[index as number];
            if (!intial[temp as number]) {
                intial[temp as number] = true;
                result.push(temp);
            }
        }
        return result;
    }
}
