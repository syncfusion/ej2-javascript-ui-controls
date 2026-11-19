import { withInRange, getPoint, drawSymbol, getElement } from '../../common/utils/helper';
import { Size, PathOption, Rect } from '@syncfusion/ej2-svg-base';
import { markerAnimate, appendChildElement, ChartLocation, animateRedrawElement } from '../../common/utils/helper';
import { Series, Points } from './chart-series';
import { MarkerSettingsModel } from '../series/chart-series-model';
import { IPointRenderEventArgs } from '../../chart/model/chart-interface';
import { pointRender } from '../../common/model/constants';
import { Axis } from '../../chart/axis/axis';

/**
 * The `BubbleSeries` module is used to render the bubble series.
 */

export class BubbleSeries {

    /**
     * Render the Bubble series.
     *
     * @param {Series} series - The series to be rendered.
     * @param {Axis} xAxis - The X-axis associated with the series.
     * @param {Axis} yAxis - The Y-axis associated with the series.
     * @param {boolean} isInverted - Indicates whether the chart is inverted or not.
     * @returns {void}
     * @private
     */
    public render(series: Series, xAxis: Axis, yAxis: Axis, isInverted: boolean): void {
        const visiblePoints: Points[] = series.points;
        let radius: number;
        const value: number = Math.max(series.chart.initialClipRect.height, series.chart.initialClipRect.width);
        const percentChange: number = value / 100;
        let maxRadius: number = series.maxRadius * percentChange;
        let minRadius: number = series.minRadius * percentChange;
        let maximumSize: number = null;
        let maxValue: number = null;
        if ((series.maxRadius === null || series.minRadius === null)) {
            for (const value of series.chart.visibleSeries) {
                if (value.type === 'Bubble' && value.visible === true && (value.maxRadius === null || value.minRadius === null)) {
                    maximumSize = value.sizeMax > maximumSize ? value.sizeMax : maximumSize;
                }
            }
            maxValue = (value / 5) / 2;
            minRadius = maxRadius = 1;
            radius = maxValue * maxRadius;
        } else {
            maximumSize = series.sizeMax;
            radius = maxRadius - minRadius;
        }

        for (const bubblePoint of visiblePoints) {
            this.renderPoint(series, bubblePoint, isInverted, radius, maximumSize, minRadius, visiblePoints);
        }
    }

    public renderPoint(series: Series, bubblePoint: Points, isInverted: boolean, radius: number,
                       maximumSize: number, minRadius: number, visiblePoints: Points[], pointUpdate?: boolean): void {
        let startLocation: ChartLocation = series.chart.redraw && bubblePoint.symbolLocations ? bubblePoint.symbolLocations[0] : null;
        bubblePoint.symbolLocations = [];
        bubblePoint.regions = [];
        let segmentRadius: number;
        if (bubblePoint.visible &&
            withInRange(visiblePoints[bubblePoint.index - 1], bubblePoint, visiblePoints[bubblePoint.index + 1], series)) {
            if ((series.maxRadius === null || series.minRadius === null)) {
                segmentRadius = radius * Math.abs(+bubblePoint.size / maximumSize);
            } else {
                segmentRadius = minRadius + radius * Math.abs(+bubblePoint.size / maximumSize);
            }

            segmentRadius = segmentRadius || minRadius;

            const argsData: IPointRenderEventArgs = {
                cancel: false, name: pointRender, series: series, point: bubblePoint,
                fill: series.setPointColor(bubblePoint, series.interior),
                border: series.setBorderColor(bubblePoint, { width: series.border.width, color: series.border.color }),
                height: 2 * segmentRadius, width: 2 * segmentRadius
            };
            series.chart.trigger(pointRender, argsData);
            if (!argsData.cancel) {
                bubblePoint.symbolLocations.push(getPoint(bubblePoint.xValue, bubblePoint.yValue, series.xAxis, series.yAxis, isInverted));
                bubblePoint.color = argsData.fill;
                const shapeOption: PathOption = new PathOption(
                    series.chart.element.id + '_Series_' + series.index + '_Point_' + bubblePoint.index,
                    argsData.fill, argsData.border.width, argsData.border.color, series.opacity, series.border.dashArray
                );
                if (pointUpdate && getElement(shapeOption.id)) {
                    const markerElement: Element = getElement(shapeOption.id);
                    startLocation = {
                        x: +markerElement.getAttribute('cx'), y: +markerElement.getAttribute('cy')
                    };
                }
                const element: Element = drawSymbol(
                    bubblePoint.symbolLocations[0], 'Circle', new Size(argsData.width, argsData.height),
                    series.marker.imageUrl, shapeOption, bubblePoint.x.toString() + ':' + bubblePoint.yValue.toString(),
                    series.chart.svgRenderer, series.clipRect
                );
                appendChildElement(series.chart.enableCanvas, series.seriesElement, element, series.chart.redraw, true,  'cx', 'cy', startLocation, null, false, false, null, series.chart.duration, true);
                bubblePoint.regions.push(
                    new Rect(
                        bubblePoint.symbolLocations[0].x - segmentRadius,
                        bubblePoint.symbolLocations[0].y - segmentRadius,
                        2 * segmentRadius, 2 * segmentRadius
                    )
                );
                bubblePoint.marker = {
                    border: argsData.border, fill: argsData.fill,
                    height: argsData.height, visible: true,
                    shape: 'Circle', width: argsData.width
                };
                if (series.chart.enableCanvas) {
                    series.chart.markerRender.render(series);
                }
                startLocation = series.chart.redraw && !startLocation ? bubblePoint.symbolLocations[0] : startLocation;
                if (series.chart.redraw) {
                    animateRedrawElement(element, series.chart.duration ? series.chart.duration : 300, startLocation, bubblePoint.symbolLocations[0], 'cx', 'cy');
                }
            } else {
                bubblePoint.marker = { visible: false };
            }
        }
    }
    public updateDirection(series: Series, point: number[], isInverted: boolean): void {
        const visiblePoints: Points[] = series.points;
        let radius: number;
        const value: number = Math.max(series.chart.initialClipRect.height, series.chart.initialClipRect.width);
        const percentChange: number = value / 100;
        let maxRadius: number = series.maxRadius * percentChange;
        let minRadius: number = series.minRadius * percentChange;
        let maximumSize: number = null;
        let maxValue: number = null;
        if ((series.maxRadius === null || series.minRadius === null)) {
            for (const value of series.chart.visibleSeries) {
                if (value.type === 'Bubble' && value.visible === true && (value.maxRadius === null || value.minRadius === null)) {
                    maximumSize = value.sizeMax > maximumSize ? value.sizeMax : maximumSize;
                }
            }
            maxValue = (value / 5) / 2;
            minRadius = maxRadius = 1;
            radius = maxValue * maxRadius;
        } else {
            maximumSize = series.sizeMax;
            radius = maxRadius - minRadius;
        }
        for (let i: number = 0; i < point.length; i++) {
            this.renderPoint(series, series.points[point[i as number]], isInverted, radius, maximumSize, minRadius, visiblePoints, true);
            if (series.marker.dataLabel.visible && series.chart.dataLabelModule) {
                series.chart.dataLabelModule.commonId = series.chart.element.id + '_Series_' + series.index + '_Point_';
                series.chart.dataLabelModule.renderDataLabel(series, series.points[point[i as number]],
                                                             null, series.marker.dataLabel);
            }
        }
    }


    /**
     * To destroy the Bubble.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        /**
         * Destroy method calling here.
         */
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
        return 'BubbleSeries';
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
        for (const bubblePoint of series.points) {
            if (!bubblePoint.symbolLocations.length) {
                continue;
            }
            markerAnimate(
                <HTMLElement>rectElements[count as number], delay, duration,
                series, bubblePoint.index, bubblePoint.symbolLocations[0], false
            );
            count++;
        }
    }

}
