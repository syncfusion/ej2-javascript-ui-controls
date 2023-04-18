/* eslint-disable valid-jsdoc */
/* eslint-disable jsdoc/require-returns */
/* eslint-disable @typescript-eslint/ban-types */
import { withInRange, getPoint, drawSymbol, getElement } from '../../common/utils/helper';
import { markerAnimate, TransformToVisible, ChartLocation, appendChildElement } from '../../common/utils/helper';
import { PathOption, Rect, Size } from '@syncfusion/ej2-svg-base';
import { Chart } from '../chart';
import { Series, Points } from './chart-series';
import { MarkerSettingsModel } from '../series/chart-series-model';
import { IPointRenderEventArgs } from '../../chart/model/chart-interface';
import { pointRender } from '../../common/model/constants';
import { Axis, VisibleRangeModel } from '../../chart/axis/axis';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { BorderModel } from '../../common/model/base-model';
import { ChartShape } from '../utils/enum';

/**
 * `ScatterSeries` module is used to render the scatter series.
 */

export class ScatterSeries {

    /**
     * Render the scatter series.
     *
     * @returns {void}
     * @private
     */

    public render(series: Series, xAxis: Axis, yAxis: Axis, isInverted: boolean): void {
        // Scatter series DataLabel is not rendered after selecting StackingColumn
        series.isRectSeries = false;
        const marker: MarkerSettingsModel = series.marker;
        const visiblePoints: Points[] = this.enableComplexProperty(series);
        let argsData: IPointRenderEventArgs;
        const getCoordinate: Function = series.chart.chartAreaType === 'PolarRadar' ? TransformToVisible : getPoint;
        let startLocation: ChartLocation;
        const redraw: boolean = series.chart.redraw;
        const scatterBorder: BorderModel = {
            width: this.isLineShapeMarker(marker.shape) ? series.width : series.border.width,
            color: this.isLineShapeMarker(marker.shape) ? series.interior : series.border.color };
        for (const point of visiblePoints) {
            startLocation = (redraw && point.symbolLocations) ? point.symbolLocations[0] : null;
            point.symbolLocations = []; point.regions = [];
            if (point.visible && withInRange(visiblePoints[point.index - 1], point, visiblePoints[point.index + 1], series)) {
                argsData = {
                    cancel: false, name: pointRender, series: series, point: point,
                    fill: series.setPointColor(point, series.interior),
                    border: series.setBorderColor(point, scatterBorder),
                    height: marker.height, width: marker.width, shape: marker.shape
                };
                series.chart.trigger(pointRender, argsData);
                if (!argsData.cancel) {
                    point.symbolLocations.push(
                        getCoordinate(point.xValue, point.yValue, xAxis, yAxis, isInverted, series)
                    );
                    point.color = argsData.fill;
                    this.refresh(series, point, argsData, startLocation);
                } else {
                    point.marker = { visible: true };
                }
            }
        }
    }

    private isLineShapeMarker(shape: ChartShape): boolean
    {
        return shape === 'HorizontalLine' || shape === 'VerticalLine' || shape === 'Cross';
    }

    /**
     * To improve the chart performance.
     *
     * @returns {void}
     * @private
     */

    public enableComplexProperty(series: Series): Points[] {
        const tempPoints2: Points[] = [];
        const tempPoints: Points[] = [];
        const yVisibleRange: VisibleRangeModel = series.yAxis.visibleRange;
        const xVisibleRange: VisibleRangeModel = series.xAxis.visibleRange;
        const areaBounds: Rect = series.clipRect;
        const seriesPoints: Points[] = <Points[]>series.points;
        const yTolerance: number = Math.abs(yVisibleRange.delta / areaBounds.height);
        const xTolerance: number = Math.abs(xVisibleRange.delta / areaBounds.width);
        let prevYValue: number = (seriesPoints[0] && seriesPoints[0].y > yTolerance) ? 0 : yTolerance;
        let prevXValue: number = (seriesPoints[0] && seriesPoints[0].x > xTolerance) ? 0 : xTolerance;
        let yVal: number = 0;
        let xVal: number = 0;
        for (const currentPoint of seriesPoints) {
            currentPoint.symbolLocations = [];
            yVal = currentPoint.yValue ? currentPoint.yValue : yVisibleRange.min;
            xVal = currentPoint.xValue ? currentPoint.xValue : xVisibleRange.min;
            if (Math.abs(prevYValue - yVal) >= yTolerance || Math.abs(prevXValue - xVal) >= xTolerance) {
                tempPoints.push(currentPoint);
                prevYValue = yVal;
                prevXValue = xVal;
            }
        }
        let currentTempPoint: Points;
        for (let i: number = 0; i < tempPoints.length; i++) {
            currentTempPoint = tempPoints[i as number];
            if (isNullOrUndefined(currentTempPoint.x) || currentTempPoint.x === '') {
                continue;
            } else {
                tempPoints2.push(currentTempPoint);
            }
        }
        return tempPoints2;
    }
    /**
     * To append scatter element
     *
     * @param {Series} series series
     * @param {Points} point point
     * @param {IPointRenderEventArgs} argsData argsData
     * @param {ChartLocation} startLocation startLocation
     * @returns {void}
     */
    private refresh(series: Series, point: Points, argsData: IPointRenderEventArgs, startLocation: ChartLocation): void {
        const chart: Chart = series.chart;
        let circlePath: String;
        let previousPath: string;
        const marker: MarkerSettingsModel = series.marker;
        const imageURL : string = argsData.point.marker.imageUrl || marker.imageUrl;
        const shapeOption: PathOption = new PathOption(
            chart.element.id + '_Series_' + series.index + '_Point_' + point.index, argsData.fill,
            argsData.border.width, argsData.border.color, series.opacity, null
        );
        if (chart.redraw && getElement(shapeOption.id)) {
            circlePath = argsData.shape === 'Circle' ? 'c' : '';
            previousPath = getElement(shapeOption.id).getAttribute('d');
        }
        appendChildElement(
            series.chart.enableCanvas, series.seriesElement, drawSymbol(
                point.symbolLocations[0], argsData.shape, new Size(argsData.width, argsData.height),
                imageURL, shapeOption, point.x.toString() + ':' + point.yValue.toString(),
                series.chart.svgRenderer, series.clipRect
            ),
            chart.redraw, true, circlePath + 'x', circlePath + 'y',
            startLocation, previousPath
        );
        point.regions.push(new Rect(
            point.symbolLocations[0].x - marker.width, point.symbolLocations[0].y - marker.height,
            2 * marker.width, 2 * marker.height
        ));
        point.marker = {
            border: argsData.border, fill: argsData.fill,
            height: argsData.height, visible: true,
            width: argsData.width, shape: argsData.shape, imageUrl: imageURL
        };
        if (series.chart.enableCanvas) {
            series.chart.markerRender.render(series);
        }
    }
    /**
     * Animates the series.
     *
     * @param  {Series} series - Defines the series to animate.
     * @returns {void}
     */
    public doAnimation(series: Series): void {
        const duration: number = series.animation.duration;
        const delay: number = series.animation.delay;
        const rectElements: NodeList = series.seriesElement.childNodes;
        let count: number = 1;
        for (const point of series.points) {
            if (!point.symbolLocations.length || !rectElements[count as number]) {
                continue;
            }
            markerAnimate(
                <HTMLElement>rectElements[count as number], delay, duration, series,
                point.index, point.symbolLocations[0], false
            );
            count++;
        }
    }
    /**
     * Get module name.
     */
    protected getModuleName(): string {
        /**
         * Returns the module name of the series
         */
        return 'ScatterSeries';
    }

    /**
     * To destroy the scatter.
     *
     * @returns {void}
     */

    public destroy(): void {
        /**
         * Destroy method calling here
         */
    }

}
