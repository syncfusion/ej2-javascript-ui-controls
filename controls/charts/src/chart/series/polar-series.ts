import {
    withInRange, PathOption, logBase,
    markerAnimate, PolarArc, valueToCoefficient, firstToLowerCase
} from '../../common/utils/helper';
import { Chart } from '../chart';
import { Series, Points } from './chart-series';
import { PolarRadarPanel } from '../axis/polar-radar-panel';
import { RectPosition } from './column-base';
import { IPointRenderEventArgs } from '../../common/model/interface';
import { AnimationModel } from '../../common/model/base-model';
import { pointRender } from '../../common/model/constants';
import { Animation, AnimationOptions } from '@syncfusion/ej2-base';
import { Axis } from '../axis/axis';

/**
 * `PolarSeries` module is used to render the polar series.
 */

export class PolarSeries extends PolarRadarPanel {
    /**
     * Render Polar Series.
     * @return {void}.
     * @private
     */
    public render(series: Series, xAxis: Axis, yAxis: Axis, inverted: boolean): void {
        let seriesType: string = firstToLowerCase(series.drawType);
        if (series.drawType.indexOf('Column') > -1) {
            this.columnDrawTypeRender(series, xAxis, yAxis);
        } else {
            series.chart[seriesType + 'SeriesModule'].render(series, xAxis, yAxis, inverted);
        }
    }

    /**
     * Render Column DrawType.
     * @return {void}.
     * @private
     */
    public columnDrawTypeRender(series: Series, xAxis: Axis, yAxis: Axis): void {
        let options: PathOption; let argsData: IPointRenderEventArgs;
        let startAngle: number; let endAngle: number; let itemCurrentXPos: number; let radius: number; let inversedValue: number;
        let pointStartAngle: number; let pointEndAngle: number; let x1: number; let x2: number; let y1: number; let y2: number;
        let startValue: number; let endValue: number; let innerRadius: number; let min: number = xAxis.actualRange.min;
        let centerX: number = (series.clipRect.width / 2) + series.clipRect.x; let dStartX: number; let dStartY: number;
        let centerY: number = (series.clipRect.height / 2) + series.clipRect.y; let dEndX: number; let dEndY: number;
        let isRangeColumn: boolean = series.drawType === 'RangeColumn'; let isPolar: boolean = series.type === 'Polar';
        let isLogAxis: boolean = yAxis.valueType === 'Logarithmic'; let isStacking: boolean = series.drawType === 'StackingColumn';
        let direction: string = ''; let sumofYValues: number = 0;
        let interval: number = (series.points[1] ? series.points[1].xValue : 2 * series.points[0].xValue) - series.points[0].xValue;
        let ticks: number = xAxis.valueType === 'Category' && xAxis.labelPlacement === 'BetweenTicks' ? 0 : interval / 2;
        let rangeInterval: number = xAxis.valueType === 'DateTime' ? xAxis.dateTimeInterval : 1;
        this.getSeriesPosition(series);
        let position: number = xAxis.isInversed ? (series.rectCount - 1 - series.position) : series.position;
        do {
            sumofYValues += rangeInterval; min += rangeInterval;
        } while (min <= xAxis.actualRange.max - (xAxis.valueType === 'Category' ? 0 : 1));
        for (let point of series.points) {
            point.symbolLocations = []; point.regions = [];
            if (point.visible && withInRange(series.points[point.index - 1], point, series.points[point.index + 1], series)) {
                inversedValue = xAxis.isInversed ? (xAxis.visibleRange.max - point.xValue) :
                    point.xValue - xAxis.visibleRange.min;
                itemCurrentXPos = (inversedValue) +
                    ((interval / series.rectCount) * position - ticks) + (sumofYValues / 360 * xAxis.startAngle);
                itemCurrentXPos = (((itemCurrentXPos) / (sumofYValues)));
                startAngle = 2 * Math.PI * (itemCurrentXPos + xAxis.startAngle);
                endAngle = 2 * Math.PI * ((itemCurrentXPos + xAxis.startAngle) + (interval / series.rectCount) / (sumofYValues));
                pointStartAngle = startAngle; pointEndAngle = endAngle;
                startAngle = (startAngle - 0.5 * Math.PI); endAngle = (endAngle - 0.5 * Math.PI) - 0.000001;
                if (isStacking || isRangeColumn) {
                    startValue = isRangeColumn ? <number>point.low : series.stackedValues.startValues[point.index];
                    endValue = isRangeColumn ? <number>point.high : series.stackedValues.endValues[point.index];
                    endValue = (isLogAxis ? logBase(endValue === 0 ? 1 : endValue, yAxis.logBase) : endValue);
                    endValue = endValue > yAxis.actualRange.max ? yAxis.actualRange.max : endValue;
                    radius = startValue === endValue ? 0 : series.chart.radius * valueToCoefficient(endValue, yAxis);
                    x1 = centerX + radius * Math.cos(startAngle); x2 = centerX + radius * Math.cos(endAngle);
                    y1 = centerY + radius * Math.sin(startAngle); y2 = centerY + radius * Math.sin(endAngle);
                    innerRadius = series.chart.radius * valueToCoefficient(
                        (startValue === 0 && yAxis.visibleRange.min !== 0) ? yAxis.visibleRange.min : startValue,
                        yAxis);
                    dStartX = centerX + innerRadius * Math.cos(startAngle); dStartY = centerY + innerRadius * Math.sin(startAngle);
                    dEndX = centerX + innerRadius * Math.cos(endAngle); dEndY = centerY + innerRadius * Math.sin(endAngle);
                    if (isPolar) {
                        direction = ('M' + ' ' + x1 + ' ' + y1 + ' ' + 'A' + ' ' + radius + ' ' + radius + ' ' + '0' + ' '
                            + '0' + ' ' + 1 + ' ' + x2 + ' ' + y2 + ' ' + 'L' + ' ' + dEndX + ' ' + dEndY + ' ' +
                            'A' + ' ' + innerRadius + ' ' + innerRadius + ' ' + '1' + ' ' + '0' + ' ' + '0' + ' '
                            + dStartX + ' ' + dStartY + ' ' + 'Z');
                    } else {
                        direction = ('M' + ' ' + x1 + ' ' + y1 + ' ' + 'L' + ' ' + x2 + ' ' + y2 + ' ' + 'L '
                            + dEndX + ' ' + dEndY + ' ' + 'L' + ' ' + dStartX + ' ' + dStartY + ' ' + 'Z');
                    }
                    point.regionData = new PolarArc(pointStartAngle, pointEndAngle, innerRadius, radius, itemCurrentXPos);
                } else {
                    endValue = point.yValue > yAxis.actualRange.max ? yAxis.actualRange.max : point.yValue;
                    radius = series.chart.radius *
                        valueToCoefficient((isLogAxis ? logBase(endValue, yAxis.logBase) : endValue), yAxis);
                    x1 = centerX + radius * Math.cos(startAngle); x2 = centerX + radius * Math.cos(endAngle);
                    y1 = centerY + radius * Math.sin(startAngle); y2 = centerY + radius * Math.sin(endAngle);
                    if (isPolar) {
                        direction = ('M' + ' ' + x1 + ' ' + y1 + ' ' + 'A' + ' ' + radius + ' ' + radius + ' ' + '0' + ' ' +
                            '0' + ' ' + 1 + ' ' + x2 + ' ' + y2 + ' ' + 'L' + ' ' + centerX + ' ' +
                            centerY + ' ' + 'Z');
                    } else {
                        direction = ('M' + ' ' + x1 + ' ' + y1 + ' ' + 'L' + ' ' + x2 + ' ' + y2 + ' ' + 'L' + ' '
                            + centerX + ' ' + centerY + ' ' + 'Z');
                    }
                    point.regionData = new PolarArc(pointStartAngle, pointEndAngle, 0, radius, itemCurrentXPos);
                }
                argsData = this.triggerEvent(series.chart, series, point);
                options = new PathOption(
                    series.chart.element.id + '_Series_' + series.index + '_Point_' + point.index, argsData.fill,
                    argsData.border.width, argsData.border.color, series.opacity, series.dashArray, direction
                );
                if (!argsData.cancel) {
                    this.appendLinePath(options, series, '');
                    if (isPolar) {
                        point.symbolLocations.push({
                            x: centerX + radius * Math.cos((startAngle + (endAngle - startAngle) / 2)),
                            y: centerY + radius * Math.sin((startAngle + (endAngle - startAngle) / 2))
                        });
                        if (isRangeColumn) {
                            point.symbolLocations.push({
                                x: centerX + innerRadius * Math.cos((startAngle + (endAngle - startAngle) / 2)),
                                y: centerY + innerRadius * Math.sin((startAngle + (endAngle - startAngle) / 2))
                            });
                        }
                    } else {
                        point.symbolLocations.push({ x: (x1 + x2) / 2, y: (y1 + y2) / 2 });
                        if (isRangeColumn) {
                            point.symbolLocations.push({ x: (dEndX + dStartX) / 2, y: (dEndY + dStartY) / 2 });
                        }
                    }
                }
            }
        }
        this.renderMarker(series);
        series.isRectSeries = true;
    }

    /**
     * To trigger the point rendering event.
     * @return {void}
     * @private
     */
    public triggerEvent(chart: Chart, series: Series, point: Points): IPointRenderEventArgs {
        let argsData: IPointRenderEventArgs = {
            cancel: false, name: pointRender, series: series, point: point,
            fill: series.setPointColor(point, series.interior),
            border: series.setBorderColor(point, { width: series.border.width, color: series.border.color })
        };
        chart.trigger(pointRender, argsData);
        point.color = argsData.fill;
        return argsData;
    }

    /** get position for column drawtypes
     * @return {void}.
     * @private
     */
    public getSeriesPosition(series: Series): void {
        let chart: Chart = series.chart;
        let seriesCollection: Series[] = [];
        let stackingGroup: string[] = [];
        let vSeries: RectPosition = { rectCount: 0, position: null };
        for (let series of chart.visibleSeries) {
            if (series.visible && (series.type === 'Polar' || series.type === 'Radar') && series.drawType.indexOf('Column') !== -1) {
                seriesCollection.push(series);
            }
        }
        seriesCollection.forEach((series: Series) => {
            if (series.drawType.indexOf('Stacking') !== -1) {
                if (series.stackingGroup) {
                    if (stackingGroup[series.stackingGroup] === undefined) {
                        series.position = vSeries.rectCount;
                        stackingGroup[series.stackingGroup] = vSeries.rectCount++;
                    } else {
                        series.position = stackingGroup[series.stackingGroup];
                    }
                } else {
                    if (vSeries.position === null) {
                        series.position = vSeries.rectCount;
                        vSeries.position = vSeries.rectCount++;
                    } else {
                        series.position = vSeries.position;
                    }
                }
            } else {
                series.position = vSeries.rectCount++;
            }
        });
        seriesCollection.forEach((value: Series) => {
            value.rectCount = vSeries.rectCount;
        });
    }

    /**
     * Animates the series.
     * @param  {Series} series - Defines the series to animate.
     * @return {void}
     */

    public doAnimation(series: Series): void {
        let option: AnimationModel = series.animation;
        let duration: number = series.animation.duration;
        let delay: number = series.animation.delay;
        let rectElements: NodeList = series.seriesElement.childNodes;
        let count: number = 1;
        if (series.drawType === 'Scatter') {
            for (let point of series.points) {
                if (!point.symbolLocations.length || !rectElements[count]) {
                    continue;
                }
                markerAnimate(<HTMLElement>rectElements[count], delay, duration, series, point.index, point.symbolLocations[0], false);
                count++;
            }
        } else {
            for (count = 1; count < rectElements.length; count++) {
                this.doPolarRadarAnimation(<HTMLElement>rectElements[count], delay, duration, series);
            }
        }
    }
    /**
     * To do the Polar Radar draw type column animation.
     * @return {void}
     * @private
     */
    public doPolarRadarAnimation(animateElement: Element, delay: number, duration: number, series: Series): void {
        let chartcenterX: number = series.clipRect.width / 2 + series.clipRect.x;
        let chartcenterY: number = series.clipRect.height / 2 + series.clipRect.y;
        let elementHeight: number = 0;
        (<HTMLElement>animateElement).style.visibility = 'hidden';
        new Animation({}).animate(<HTMLElement>animateElement, {
            duration: duration,
            delay: delay,
            progress: (args: AnimationOptions): void => {
                if (args.timeStamp > args.delay) {
                    args.element.style.visibility = 'visible';
                    elementHeight = ((args.timeStamp - args.delay) / args.duration);
                    animateElement.setAttribute('transform', 'translate(' + chartcenterX
                        + ' ' + chartcenterY + ') scale(' + elementHeight + ') translate(' + (-chartcenterX) + ' ' + (-chartcenterY) + ')');
                }
            },
            end: (model: AnimationOptions) => {
                (<HTMLElement>animateElement).style.visibility = 'visible';
                animateElement.removeAttribute('transform');
                series.chart.trigger('animationComplete', { series: series });
            }
        });
    }
    /**
     * Get module name.
     */

    protected getModuleName(): string {
        /**
         * Returns the module name of the series
         */
        return 'PolarSeries';
    }

    /**
     * To destroy the polar series.
     * @return {void}
     * @private
     */

    public destroy(chart: Chart): void {
        /**
         * Destroy method performed here
         */
    }
}