/* eslint-disable jsdoc/require-returns */
/* eslint-disable valid-jsdoc */
/* eslint-disable jsdoc/require-param */
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
     * Constructor for DataEditing module.
     *
     * @private
     */
    constructor(chart: Chart) {
        this.chart = chart;
    }
    /**
     * Point drag start here.
     */
    public pointMouseDown(): void {
        const chart: Chart = this.chart;
        let series: SeriesModel;
        const data: ChartData = new ChartData(chart);
        const pointData: PointData = data.getData();
        if (pointData.point && (data.insideRegion || !pointData.series.isRectSeries)) {
            this.seriesIndex = pointData.series.index;
            this.pointIndex = pointData.point.index;
            series = chart.series[this.seriesIndex];
            if (series.dragSettings.enable && !chart.zoomModule) {
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
     * Point dragging.
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
     * Get cursor style.
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
     * Dragging calculation.
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
        // Destroy method performed here
    }
}
