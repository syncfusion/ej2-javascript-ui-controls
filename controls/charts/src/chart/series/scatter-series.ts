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

interface ScatterTemplate {
    element: Element; fill: string; width: number; stroke: string; opacity: number;
    dash: string; w: number; h: number; parent: Element;
}

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
        // the canvas circle fast path sets fill / stroke state directly, so it is isolated from the rest of the chart
        const ctx: CanvasRenderingContext2D = series.chart.enableCanvas && !series.chart.redraw ?
            (series.chart.renderer as any).ctx : null;
        if (ctx) { ctx.save(); }
        this.canvasCtx = ctx;
        this.baseLineWidth = ctx ? ctx.lineWidth : 1;
        this.baseTransform = ctx ? ctx.getTransform() : null;
        this.lastFill = null; this.lastStroke = null; this.lastWidth = null;
        for (const point of visiblePoints) {
            this.renderPoint(series, point, isInverted, getCoordinate, scatterBorder, visiblePoints);
        }
        this.canvasCtx = null;
        if (ctx) { ctx.restore(); }
    }
    private canvasCtx: CanvasRenderingContext2D = null;

    private baseLineWidth: number = 1;

    private baseTransform: DOMMatrix = null;


    private lastFill: string = null;

    private lastStroke: string = null;

    private lastWidth: number = null;
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
            argsData.border = {
                width: this.isLineShapeMarker(argsData.shape) ? series.width : series.border.width,
                color: this.isLineShapeMarker(argsData.shape) ? series.interior : series.border.color
            };
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
        return shape.indexOf('Line') > -1 || shape === 'Plus' || shape === 'Cross';
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
    private template: ScatterTemplate = null;

    private refresh(series: Series, point: Points, argsData: IPointRenderEventArgs, startLocation: ChartLocation): void {
        const chart: Chart = series.chart;
        let circlePath: string;
        let previousPath: string;
        const marker: MarkerSettingsModel = series.marker;
        const imageURL : string = argsData.point.marker.imageUrl || marker.imageUrl;
        const pointId: string = chart.element.id + '_Series_' + series.index + '_Point_' + point.index;
        const location: ChartLocation = point.symbolLocations[0];
        const cache: ScatterTemplate = this.template;
        if (!chart.redraw && !chart.enableCanvas && cache && argsData.shape === 'Circle' &&
            cache.fill === argsData.fill && cache.width === argsData.border.width && cache.stroke === argsData.border.color &&
            cache.opacity === series.opacity && cache.dash === series.border.dashArray &&
            cache.w === argsData.width && cache.h === argsData.height && cache.parent === series.seriesElement) {
            // same style as the previous marker: clone it and set only the attributes that differ per point
            const clone: Element = cache.element.cloneNode(false) as Element;
            clone.setAttribute('id', pointId);
            clone.setAttribute('cx', location.x as unknown as string);
            clone.setAttribute('cy', location.y as unknown as string);
            series.seriesElement.appendChild(clone);
        } else {
            const shapeOption: PathOption = new PathOption(
                pointId, argsData.fill,
                argsData.border.width, (series.chart.enableCanvas && !argsData.border.color) ? argsData.fill :
                    argsData.border.color, series.opacity, series.border.dashArray
            );
            if (chart.redraw && getElement(shapeOption.id)) {
                circlePath = argsData.shape === 'Circle' ? 'c' : '';
                previousPath = getElement(shapeOption.id).getAttribute('d');
                const scatterElement: Element = getElement(shapeOption.id);
                startLocation = {
                    x: +scatterElement.getAttribute(circlePath + 'x'), y: +scatterElement.getAttribute(circlePath + 'y')
                };
            }
            const ctx: CanvasRenderingContext2D = this.canvasCtx;
            if (ctx && argsData.shape === 'Circle' && argsData.width === argsData.height &&
                shapeOption.stroke && shapeOption.fill) {
                // same pixels as CanvasRenderer.drawEllipse for a circle (equal radii): one arc at the translated position
                // canvas ignores a line width of 0, so the outer value stays in effect, as it does for drawEllipse
                const lineWidth: number = shapeOption['stroke-width'] > 0 ? shapeOption['stroke-width'] : this.baseLineWidth;
                // same pixels as CanvasRenderer.drawEllipse for a circle (equal radii): one arc, translated as it does.
                // The outer save / restore, the scale(1,1) and its save / restore are not needed, because the fill
                // and stroke state is chained from the previous point instead of reset per point.
                ctx.beginPath();
                ctx.translate(location.x, location.y);
                ctx.translate(series.clipRect.x | 0, series.clipRect.y | 0);
                ctx.arc(0, 0, argsData.width / 2, 0, 2 * Math.PI, false);
                // canvas style state is sticky, so a chained style is only assigned when it actually changes
                if (this.lastFill !== shapeOption.fill) { ctx.fillStyle = shapeOption.fill; this.lastFill = shapeOption.fill; }
                ctx.fill();
                if (this.lastWidth !== lineWidth) { ctx.lineWidth = lineWidth; this.lastWidth = lineWidth; }
                if (this.lastStroke !== shapeOption.stroke) { ctx.strokeStyle = shapeOption.stroke; this.lastStroke = shapeOption.stroke; }
                ctx.stroke();
                ctx.setTransform(this.baseTransform);
                point.regions.push(new Rect(
                    location.x - marker.width, location.y - marker.height, 2 * marker.width, 2 * marker.height
                ));
                point.marker = {
                    border: argsData.border, fill: argsData.fill,
                    height: argsData.height, visible: true,
                    width: argsData.width, shape: argsData.shape, imageUrl: imageURL
                };
                return;
            }
            const element: Element = drawSymbol(
                location, argsData.shape, new Size(argsData.width, argsData.height),
                imageURL, shapeOption, point.x.toString() + ':' + point.yValue.toString(),
                series.chart.renderer, series.clipRect
            );
            appendChildElement(
                series.chart.enableCanvas, series.seriesElement, element,
                chart.redraw, true, circlePath + 'x', circlePath + 'y',
                startLocation, previousPath, false, false, null, chart.duration, true
            );
            this.template = (!chart.redraw && !chart.enableCanvas && argsData.shape === 'Circle' && element) ? {
                element: element.cloneNode(false) as Element, fill: argsData.fill, width: argsData.border.width,
                stroke: shapeOption.stroke, opacity: series.opacity, dash: series.border.dashArray,
                w: argsData.width, h: argsData.height, parent: series.seriesElement
            } : null;
        }
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


