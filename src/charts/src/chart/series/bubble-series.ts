import { withInRange, getPoint, PathOption, drawSymbol, Size, Rect } from '../../common/utils/helper';
import { markerAnimate, appendChildElement, ChartLocation, animateRedrawElement } from '../../common/utils/helper';
import { Chart } from '../chart';
import { Series, Points } from './chart-series';
import { MarkerSettingsModel, } from '../series/chart-series-model';
import { IPointRenderEventArgs } from '../../common/model/interface';
import { pointRender } from '../../common/model/constants';
import { Axis } from '../../chart/axis/axis';

/**
 * `BubbleSeries` module is used to render the bubble series.
 */

export class BubbleSeries {

    /**
     * Render the Bubble series.
     * @return {void}
     * @private
     */

    public render(series: Series, xAxis: Axis, yAxis: Axis, isInverted: boolean): void {
        let marker: MarkerSettingsModel = series.marker;
        let visiblePoints: Points[] = series.points;
        let shapeOption: PathOption;
        let argsData: IPointRenderEventArgs;
        //let bubbleMode: RadiusMode = bubbleOptions.radiusMode;
        let segmentRadius: number; let radius: number;
        let value: number = Math.max(series.chart.initialClipRect.height, series.chart.initialClipRect.width);
        let percentChange: number = value / 100;
        let maxRadius: number = series.maxRadius * percentChange;
        let minRadius: number = series.minRadius * percentChange;
        let maximumSize: number = null;
        let maxValue: number = null;
        let element: Element;
        let startLocation: ChartLocation;
        let redraw: boolean = series.chart.redraw;
        if ((series.maxRadius === null || series.minRadius === null)) {
            for (let value of series.chart.visibleSeries) {
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

        for (let bubblePoint of visiblePoints) {
            startLocation = redraw ? bubblePoint.symbolLocations[0] : null;
            bubblePoint.symbolLocations = [];
            bubblePoint.regions = [];
            if (bubblePoint.visible &&
                withInRange(visiblePoints[bubblePoint.index - 1], bubblePoint, visiblePoints[bubblePoint.index + 1], series)) {
                if ((series.maxRadius === null || series.minRadius === null)) {
                    segmentRadius = radius * Math.abs(+bubblePoint.size / maximumSize);
                } else {
                    segmentRadius = minRadius + radius * Math.abs(+bubblePoint.size / maximumSize);
                }

                segmentRadius = segmentRadius || minRadius;

                argsData = {
                    cancel: false, name: pointRender, series: series, point: bubblePoint,
                    fill: series.setPointColor(bubblePoint, series.interior),
                    border: series.setBorderColor(bubblePoint, { width: series.border.width, color: series.border.color }),
                    height: 2 * segmentRadius, width: 2 * segmentRadius
                };
                series.chart.trigger(pointRender, argsData);
                if (!argsData.cancel) {
                    bubblePoint.symbolLocations.push(getPoint(bubblePoint.xValue, bubblePoint.yValue, xAxis, yAxis, isInverted));
                    bubblePoint.color = argsData.fill;
                    shapeOption = new PathOption(
                        series.chart.element.id + '_Series_' + series.index + '_Point_' + bubblePoint.index,
                        argsData.fill, argsData.border.width, argsData.border.color, series.opacity, null
                    );
                    element = drawSymbol(
                        bubblePoint.symbolLocations[0], 'Circle', new Size(argsData.width, argsData.height),
                        marker.imageUrl, shapeOption, bubblePoint.x.toString() + ':' + bubblePoint.yValue.toString()
                    );
                    appendChildElement(series.seriesElement, element, redraw);
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
                    if (redraw) {
                        animateRedrawElement(element, 300, startLocation, bubblePoint.symbolLocations[0], 'cx', 'cy');
                    }
                } else {
                    bubblePoint.marker = { visible: false };
                }
            }
        }
    }


    /**
     * To destroy the Bubble.
     * @return {void}
     * @private
     */

    public destroy(chart: Chart): void {
        /**
         * Destroy method calling here
         */
    }

    /**
     * Get module name.
     */
    protected getModuleName(): string {
        /**
         * Returns the module name of the series
         */
        return 'BubbleSeries';
    }

    /**
     * Animates the series.
     * @param  {Series} series - Defines the series to animate.
     * @return {void}
     */
    public doAnimation(series: Series): void {
        let duration: number = series.animation.duration;
        let delay: number = series.animation.delay;
        let rectElements: NodeList = series.seriesElement.childNodes;
        let count: number = 1;
        for (let bubblePoint of series.points) {
            if (!bubblePoint.symbolLocations.length) {
                continue;
            }
            markerAnimate(
                <HTMLElement>rectElements[count], delay, duration,
                series, bubblePoint.index, bubblePoint.symbolLocations[0], false
            );
            count++;
        }
    }

}