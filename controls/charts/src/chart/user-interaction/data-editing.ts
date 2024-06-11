import { Chart } from '../chart';
import { ChartData } from '../utils/get-data';
import { SeriesModel } from '../series/chart-series-model';
import { PointData, getTransform, firstToLowerCase } from '../../common/utils/helper';
import { dragStart, drag, dragEnd } from '../../common/model/constants';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { Rect } from '@syncfusion/ej2-svg-base';
import { Series } from '../series/chart-series';
import { Axis } from '../axis/axis';
import { DragSettingsModel } from '../../common/model/base-model';

/**
 * `DataEditing` module handles data editing.
 */
export class DataEditing {
    private chart: Chart;
    private seriesIndex: number;
    private pointIndex: number;
    /**
     * It is used to identify point is dragging for data editing in other modules.
     *
     * @private
     */
    public isPointDragging: boolean = false;

    /**
     * Initializes the event manager for the chart.
     *
     * @param {Chart} chart - The chart instance.
     */
    constructor(chart: Chart) {
        this.chart = chart;
    }
    /**
     * Point drag start here.
     *
     * @returns {void}
     */
    public pointMouseDown(): void {
        const chart: Chart = this.chart;
        let series: SeriesModel;
        const data: ChartData = new ChartData(chart);
        const pointData: PointData = data.getData();
        const isZooming: boolean = chart.zoomSettings.enableSelectionZooming || chart.zoomSettings.enablePinchZooming;
        if (pointData.point && (data.insideRegion || !pointData.series.isRectSeries)) {
            this.seriesIndex = pointData.series.index;
            this.pointIndex = pointData.point.index;
            series = chart.series[this.seriesIndex];
            if (series.dragSettings.enable && !isZooming) {
                chart.trigger(dragStart, {
                    series: pointData.series, seriesIndex: this.seriesIndex, pointIndex: this.pointIndex, point: pointData.point,
                    oldValue: chart.visibleSeries[this.seriesIndex].yData[this.pointIndex],
                    newValue: chart.visibleSeries[this.seriesIndex].points[this.pointIndex].yValue
                });
                chart.isPointMouseDown = true;
                chart.zoomSettings.enableDeferredZooming = false;
            }
        }
    }

    /**
     * Handles the mouse move event on chart data points.
     *
     * @param {PointerEvent | TouchEvent} event - The pointer event or touch event.
     * @returns {void}
     */
    public pointMouseMove(event: PointerEvent | TouchEvent): void {
        const chart: Chart = this.chart;
        let series: SeriesModel;
        if (event.type === 'touchmove' && event.preventDefault) {
            event.preventDefault();
        }
        const data: ChartData = new ChartData(chart);
        const pointData: PointData = data.getData();
        if (pointData.series.dragSettings.enable && pointData.point && (data.insideRegion || !pointData.series.isRectSeries)) {
            this.getCursorStyle(pointData);
        } else {
            (chart.svgObject as SVGElement).style.cursor = 'null';
        }
        if (chart.isPointMouseDown) {
            series = chart.series[this.seriesIndex];
            if (series.type.indexOf('Spline') > -1) {
                chart[firstToLowerCase(series.type) + 'SeriesModule'].findSplinePoint(<Series>series);
            }
            this.pointDragging(this.seriesIndex, this.pointIndex);
        }
    }
    /**
     * Gets the cursor style based on the point data.
     *
     * @param {PointData} pointData - The data associated with the chart point.
     * @returns {void}
     */
    private getCursorStyle(pointData: PointData): void {
        const chart: Chart = this.chart;
        if (pointData.series.type.indexOf('Stacking') > -1) {
            (chart.svgObject as SVGElement).style.cursor = '';
        } else if (pointData.series.type === 'Bar' && chart.isTransposed) {
            (chart.svgObject as SVGElement).style.cursor = 'ns-resize';
        } else if (chart.isTransposed || pointData.series.type === 'Bar') {
            (chart.svgObject as SVGElement).style.cursor = 'ew-resize';
        } else {
            (chart.svgObject as SVGElement).style.cursor = 'ns-resize';
        }
    }
    /**
     * Handles the dragging behavior of a specific point.
     *
     * @param {number} si - Series index.
     * @param {number} pi - Point index.
     * @returns {void}
     */
    private pointDragging(si: number, pi: number): void {
        const chart: Chart = this.chart;
        const yValueArray: number[] = []; let y: number; let ySize: number; let yValue: number;
        const series: Series = chart.visibleSeries[si as number];
        const pointDrag: DragSettingsModel = series.dragSettings;
        const xAxis: Axis = series.xAxis;
        const yAxis: Axis = series.yAxis;
        // To get drag region for column and bar series
        const extra: number = series.isRectSeries ? 1 : 0;
        const axis: Rect = getTransform(xAxis, yAxis, chart.requireInvertedAxis);
        if (series.type === 'Bar') {
            y = chart.isTransposed ? (axis.y + axis.height) - chart.mouseY : chart.mouseX - axis.x;
            ySize = chart.isTransposed ? axis.height : axis.width;
        } else {
            y = chart.isTransposed ? chart.mouseX - axis.x : (axis.y + axis.height) - chart.mouseY;
            ySize = chart.isTransposed ? axis.width : axis.height;
        }
        yValue = yAxis.isAxisInverse ? (1 - (y / ySize)) : (y / ySize);
        yValue = (yValue * yAxis.visibleRange.delta) + yAxis.visibleRange.min;
        const minRange: number = yAxis.minimum !== null ? yAxis.visibleRange.min + extra : (isNullOrUndefined(pointDrag.minY) ?
            (yValue) : pointDrag.minY);
        const maxRange: number = yAxis.maximum !== null ? yAxis.visibleRange.max + extra : (isNullOrUndefined(pointDrag.maxY) ?
            (yValue) : pointDrag.maxY);
        if (maxRange >= yValue && minRange <= yValue) {
            series.points[pi as number].yValue = series.points[pi as number].y = chart.dragY = (yAxis.valueType === 'Logarithmic') ?
                Math.pow(yAxis.logBase, yValue) : parseFloat(yValue.toFixed(2));
            series.points[pi as number].interior = pointDrag.fill;
            for (let i: number = 0; i < series.points.length; i++) {
                yValueArray[i as number] = series.points[i as number].yValue;
            }
            series.yMin = Math.min.apply(null, yValueArray);
            series.yMax = Math.max.apply(null, yValueArray);
            this.isPointDragging = true;
            chart.refreshBound();
            chart.trigger(drag, {
                seriesIndex: si, pointIndex: pi, series: series, point: series.points[pi as number],
                oldValue: chart.visibleSeries[this.seriesIndex].yData[this.pointIndex], newValue: series.points[pi as number].yValue
            });
        }
    }

    /**
     * Point drag ends here.
     *
     * @returns {void}
     */
    public pointMouseUp(): void {
        const chart: Chart = this.chart;
        if (chart.isPointMouseDown) {
            if (chart.series[this.seriesIndex].dragSettings.enable) {
                chart.trigger(dragEnd, {
                    series: chart.series[this.seriesIndex], point: chart.visibleSeries[this.seriesIndex].points[this.pointIndex],
                    seriesIndex: this.seriesIndex,
                    pointIndex: this.pointIndex, oldValue: chart.visibleSeries[this.seriesIndex].yData[this.pointIndex],
                    newValue: chart.visibleSeries[this.seriesIndex].points[this.pointIndex].yValue
                });
                chart.visibleSeries[this.seriesIndex].points[this.pointIndex].y =
                chart.visibleSeries[this.seriesIndex].points[this.pointIndex].yValue;
                chart.isPointMouseDown = false;
                this.isPointDragging = false;
                this.seriesIndex = this.pointIndex = undefined;
            }
        }
    }
    /**
     * Get module name.
     *
     * @returns {string} - Returns the module name.
     */
    protected getModuleName(): string {
        // Returns te module name
        return 'DataEditing';
    }
    /**
     * To destroy the DataEditing.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        // Destroy method performed here.
    }
}
