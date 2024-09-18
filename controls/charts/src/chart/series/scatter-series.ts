import { withInRange, getPoint, drawSymbol, getElement } from '../../common/utils/helper';
import { markerAnimate, TransformToVisible, ChartLocation, appendChildElement } from '../../common/utils/helper';
import { PathOption, Rect, Size } from '@syncfusion/ej2-svg-base';
import { Chart } from '../chart';
import { Series, Points } from './chart-series';
import { MarkerSettingsModel } from '../series/chart-series-model';
import { IPointRenderEventArgs } from '../../chart/model/chart-interface';
import { pointRender } from '../../common/model/constants';
import { Axis } from '../../chart/axis/axis';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { BorderModel } from '../../common/model/base-model';
import { ChartShape } from '../utils/enum';
import { VisibleRangeModel } from '../../common/model/interface';

/**
 * The `ScatterSeries` module is used to render the scatter series.
 */

export class ScatterSeries {

    /**
     * Renders the series.
     *
     * @param {Series} series - The series to be rendered.
     * @param {Axis} xAxis - The x-axis of the chart.
     * @param {Axis} yAxis - The y-axis of the chart.
     * @param {boolean} isInverted - Specifies whether the chart is inverted.
     * @returns {void}
     * @private
     */
    public render(series: Series, xAxis: Axis, yAxis: Axis, isInverted: boolean): void {
        // Scatter series DataLabel is not rendered after selecting StackingColumn
        series.isRectSeries = false;
        const marker: MarkerSettingsModel = series.marker;
        const visiblePoints: Points[] = this.enableComplexProperty(series);
        const getCoordinate: Function = series.chart.chartAreaType === 'PolarRadar' ? TransformToVisible : getPoint;
        const scatterBorder: BorderModel = {
            width: this.isLineShapeMarker(marker.shape) ? series.width : series.border.width,
            color: this.isLineShapeMarker(marker.shape) ? series.interior : series.border.color };
        for (const point of visiblePoints) {
            this.renderPoint(series, point, isInverted, getCoordinate, scatterBorder, visiblePoints);
        }
    }

    public renderPoint(series: Series, point: Points, isInverted: boolean, getCoordinate: Function,
                       scatterBorder: BorderModel, visiblePoints: Points[]): void {
        const redraw: boolean = series.chart.redraw;
        let argsData: IPointRenderEventArgs;
        const startLocation: ChartLocation = (redraw && point.symbolLocations) ? point.symbolLocations[0] : null;
        point.symbolLocations = []; point.regions = [];
        if (point.visible && withInRange(visiblePoints[point.index - 1], point, visiblePoints[point.index + 1], series)) {
            argsData = {
                cancel: false, name: pointRender, series: series, point: point,
                fill: series.setPointColor(point, series.interior),
                border: series.setBorderColor(point, { width: scatterBorder.width, color: scatterBorder.color }),
                height: series.marker.height, width: series.marker.width, shape: series.marker.shape
            };
            series.chart.trigger(pointRender, argsData);
            if (!argsData.cancel) {
                point.symbolLocations.push(
                    getCoordinate(point.xValue, point.yValue, series.xAxis, series.yAxis, isInverted, series)
                );
                point.color = argsData.fill;
                this.refresh(series, point, argsData, startLocation);
            } else {
                point.marker = { visible: true };
            }
        }
    }

    public updateDirection(series: Series, point: number[], isInverted: boolean): void {
        const marker: MarkerSettingsModel = series.marker;
        const visiblePoints: Points[] = this.enableComplexProperty(series);
        const getCoordinate: Function = series.chart.chartAreaType === 'PolarRadar' ? TransformToVisible : getPoint;
        const scatterBorder: BorderModel = {
            width: this.isLineShapeMarker(marker.shape) ? series.width : series.border.width,
            color: this.isLineShapeMarker(marker.shape) ? series.interior : series.border.color };
        for (let i: number = 0; i < point.length; i++) {
            this.renderPoint(series, series.points[point[i as number]], isInverted, getCoordinate, scatterBorder, visiblePoints);
            if (series.marker.dataLabel.visible && series.chart.dataLabelModule) {
                series.chart.dataLabelModule.commonId = series.chart.element.id + '_Series_' + series.index + '_Point_';
                series.chart.dataLabelModule.renderDataLabel(series, series.points[point[i as number]],
                                                             null, series.marker.dataLabel);
            }
        }
    }

    private isLineShapeMarker(shape: ChartShape): boolean
    {
        return shape === 'HorizontalLine' || shape === 'VerticalLine' || shape === 'Cross';
    }

    /**
     * Enables complex properties for the series.
     *
     * @param {Series} series - The series for which complex properties need to be enabled.
     * @returns {Points[]} - Returns the updated points array.
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
            if (!currentPoint.symbolLocations) {
                currentPoint.symbolLocations = [];
            }
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
        let circlePath: string;
        let previousPath: string;
        const marker: MarkerSettingsModel = series.marker;
        const imageURL : string = argsData.point.marker.imageUrl || marker.imageUrl;
        const shapeOption: PathOption = new PathOption(
            chart.element.id + '_Series_' + series.index + '_Point_' + point.index, argsData.fill,
            argsData.border.width, (series.chart.enableCanvas && !argsData.border.color) ? argsData.fill :
                argsData.border.color, series.opacity, null
        );
        if (chart.redraw && getElement(shapeOption.id)) {
            circlePath = argsData.shape === 'Circle' ? 'c' : '';
            previousPath = getElement(shapeOption.id).getAttribute('d');
            const scatterElement: Element = getElement(shapeOption.id);
            startLocation = {
                x: +scatterElement.getAttribute(circlePath + 'x'), y: +scatterElement.getAttribute(circlePath + 'y')
            };
        }
        const element: Element = drawSymbol(
            point.symbolLocations[0], argsData.shape, new Size(argsData.width, argsData.height),
            imageURL, shapeOption, point.x.toString() + ':' + point.yValue.toString(),
            series.chart.renderer, series.clipRect
        );
        appendChildElement(
            series.chart.enableCanvas, series.seriesElement, element,
            chart.redraw, true, circlePath + 'x', circlePath + 'y',
            startLocation, previousPath, false, false, null, chart.duration, true
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
    }
    /**
     * Animates the series.
     *
     * @param  {Series} series - Defines the series to animate.
     * @returns {void}
     * @private
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
     *
     * @returns {string} - Returns the module name.
     */
    protected getModuleName(): string {
        /**
         * Returns the module name of the series.
         */
        return 'ScatterSeries';
    }

    /**
     * To destroy the scatter.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        /**
         * Destroy method calling here.
         */
    }

}
