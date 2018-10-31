import { Animation, AnimationOptions } from '@syncfusion/ej2-base';
import { DoubleRange } from '../utils/double-range';
import { PathOption, appendChildElement, redrawElement, pathAnimation, valueToCoefficient } from '../../common/utils/helper';
import { getAnimationFunction, getPoint, Rect, ChartLocation, getMinPointsDelta } from '../../common/utils/helper';
import { Chart } from '../chart';
import { Column, Row } from '../axis/axis';
import { Series, Points } from './chart-series';
import { AnimationModel, BorderModel } from '../../common/model/base-model';
import { IPointRenderEventArgs } from '../../common/model/interface';
import { pointRender } from '../../common/model/constants';


/**
 * Column Series Base
 */

export class ColumnBase {

    /**
     * To get the position of the column series.
     * @return {DoubleRange}
     * @private
     */
    protected getSideBySideInfo(series: Series): DoubleRange {

        if (series.chart.enableSideBySidePlacement && !series.position) {
            this.getSideBySidePositions(series);
        }
        let position: number = !series.chart.enableSideBySidePlacement ? 0 : series.position;
        let rectCount: number = !series.chart.enableSideBySidePlacement ? 1 : series.rectCount;
        series.isRectSeries = true;
        let visibleSeries: Series[] = series.chart.visibleSeries;
        let seriesSpacing: number = series.chart.enableSideBySidePlacement ? series.columnSpacing : 0; // Column Spacing
        let pointSpacing: number = (series.columnWidth === null) ? ((series.type === 'Histogram') ? 1 : 0.7) :
            series.columnWidth; // Column width
        let minimumPointDelta: number = getMinPointsDelta(series.xAxis, visibleSeries);
        let width: number = minimumPointDelta * pointSpacing;
        let radius: number;
        let location: number = (position) / rectCount - 0.5;
        let doubleRange: DoubleRange = new DoubleRange(location, location + (1 / rectCount));
        if (!(isNaN(doubleRange.start) || isNaN(doubleRange.end))) {
            doubleRange = new DoubleRange(doubleRange.start * width, doubleRange.end * width);
            radius = seriesSpacing * doubleRange.delta;
            doubleRange = new DoubleRange(doubleRange.start + radius / 2, doubleRange.end - radius / 2);
        }
        return doubleRange;
    }
    /**
     * To get the rect values.
     * @return {Rect}
     * @private
     */
    protected getRectangle(x1: number, y1: number, x2: number, y2: number, series: Series): Rect {
        let point1: ChartLocation = getPoint(x1, y1, series.xAxis, series.yAxis, series.chart.requireInvertedAxis);
        let point2: ChartLocation = getPoint(x2, y2, series.xAxis, series.yAxis, series.chart.requireInvertedAxis);
        return new Rect(
            Math.min(point1.x, point2.x), Math.min(point1.y, point2.y),
            Math.abs(point2.x - point1.x), Math.abs(point2.y - point1.y)
        );
    }

    /**
     * To get the position of each series.
     * @return {void}
     * @private
     */
    private getSideBySidePositions(series: Series): void {
        let chart: Chart = series.chart;
        for (let columnItem of chart.columns) {
            for (let item of chart.rows) {
                this.findRectPosition(series.findSeriesCollection(<Column>columnItem, <Row>item, false));
            }
        }
    }
    private findRectPosition(seriesCollection: Series[]): void {
        let stackingGroup: string[] = [];
        let vSeries: RectPosition = { rectCount: 0, position: null };
        seriesCollection.forEach((value: Series) => {
            if (value.type.indexOf('Stacking') !== -1) {
                if (value.stackingGroup) {
                    if (stackingGroup[value.stackingGroup] === undefined) {
                        value.position = vSeries.rectCount;
                        stackingGroup[value.stackingGroup] = vSeries.rectCount++;
                    } else {
                        value.position = stackingGroup[value.stackingGroup];
                    }
                } else {
                    if (vSeries.position === null) {
                        value.position = vSeries.rectCount;
                        vSeries.position = vSeries.rectCount++;
                    } else {
                        value.position = vSeries.position;
                    }
                }
            } else {
                value.position = vSeries.rectCount++;
            }
        });
        seriesCollection.forEach((value: Series) => {
            value.rectCount = vSeries.rectCount;
        });
    }

    /**
     * Updates the symbollocation for points
     * @return void
     * @private
     */
    protected updateSymbolLocation(point: Points, rect: Rect, series: Series): void {
        if (!series.chart.requireInvertedAxis) {
            this.updateXRegion(point, rect, series);
        } else {
            this.updateYRegion(point, rect, series);
        }
        if (series.type === 'Histogram') {
            point.minimum = +point.x - series.histogramValues.binWidth / 2;
            point.maximum = +point.x + series.histogramValues.binWidth / 2;
        }
    }

    /**
     * Update the region for the point.
     * @return {void}
     * @private
     */
    protected updateXRegion(point: Points, rect: Rect, series: Series): void {
        point.regions.push(rect);
        point.symbolLocations.push({
            x: rect.x + (rect.width) / 2,
            y: (series.seriesType === 'BoxPlot' || series.seriesType.indexOf('HighLow') !== -1 ||
                (point.yValue >= 0 === !series.yAxis.isInversed)) ? rect.y : (rect.y + rect.height)
        });
        if (series.type === 'RangeColumn') {
            point.symbolLocations.push({
                x: rect.x + (rect.width) / 2,
                y: rect.y + rect.height
            });
        }
    }
    /**
     * Update the region for the point in bar series.
     * @return {void}
     * @private
     */
    protected updateYRegion(point: Points, rect: Rect, series: Series): void {
        point.regions.push(rect);
        point.symbolLocations.push({
            x: (series.seriesType === 'BoxPlot' || series.seriesType.indexOf('HighLow') !== -1 ||
                (point.yValue >= 0 === !series.yAxis.isInversed)) ? rect.x + rect.width : rect.x,
            y: rect.y + rect.height / 2
        });
        if (series.type === 'RangeColumn') {
            point.symbolLocations.push({
                x: rect.x,
                y: rect.y + rect.height / 2
            });
        }
    }
    /**
     * To render the marker for the series. 
     * @return {void}
     * @private
     */
    public renderMarker(series: Series): void {
        if (series.marker && series.marker.visible) {
            series.chart.markerRender.render(series);
        }
    }

    /**
     * To trigger the point rendering event.
     * @return {void}
     * @private
     */
    protected triggerEvent(series: Series, point: Points, fill: string, border: BorderModel): IPointRenderEventArgs {
        let argsData: IPointRenderEventArgs = {
            cancel: false, name: pointRender, series: series, point: point,
            fill: series.setPointColor(point, fill),
            border: series.setBorderColor(point, border)
        };
        series.chart.trigger(pointRender, argsData);
        point.color = argsData.fill;
        return argsData;
    }

    /**
     * To draw the rectangle for points.
     * @return {void}
     * @private
     */
    protected drawRectangle(
        series: Series, point: Points, rect: Rect, argsData: IPointRenderEventArgs
    ): void {
        let chart: Chart = series.chart;
        let check: number = chart.requireInvertedAxis ? rect.height : rect.width;
        if (check <= 0) {
            return null;
        }
        let direction: string = this.calculateRoundedRectPath(
            rect, series.cornerRadius.topLeft, series.cornerRadius.topRight, series.cornerRadius.bottomLeft,
            series.cornerRadius.bottomRight);
        let name: string = series.category === 'Indicator' ? chart.element.id + '_Indicator_' + series.index + '_' + series.name +
            '_Point_' + point.index : chart.element.id + '_Series_' + series.index + '_Point_' + point.index;
        let previousElement: Element = redrawElement(chart.redraw, name);
        let previousDirection: string = previousElement ? previousElement.getAttribute('d') : '';
        let options: PathOption = new PathOption(
            name, argsData.fill, argsData.border.width, argsData.border.color, series.opacity, series.dashArray, direction);
        let element: HTMLElement = chart.renderer.drawPath(options) as HTMLElement;
        switch (series.seriesType) {
            case 'XY':
                element.setAttribute('aria-label', point.x.toString() + ':' + point.yValue.toString());
                break;
            case 'HighLow':
                element.setAttribute('aria-label', point.x.toString() + ':' + point.high.toString() + ':' + point.low.toString());
                break;
        }
        appendChildElement(series.seriesElement, element, chart.redraw);
        pathAnimation(element, direction, chart.redraw, previousDirection);
    }
    /**
     * To animate the series.
     * @return {void}
     * @private
     */
    public animate(series: Series): void {
        let rectElements: NodeList = series.seriesElement.childNodes;
        let count: number = series.category === 'Indicator' ? 0 : 1;
        for (let point of series.points) {
            if (!point.symbolLocations.length && !(series.type === 'BoxAndWhisker' && point.regions.length)) {
                continue;
            }
            this.animateRect(<HTMLElement>rectElements[count], series, point);
            count++;
        }
    }
    /**
     * To animate the series.
     * @return {void}
     * @private
     */
    private animateRect(element: HTMLElement, series: Series, point: Points): void {
        let option: AnimationModel = series.animation;
        let effect: Function = getAnimationFunction('Linear');
        let isPlot: boolean = point.yValue < 0;
        let x: number;
        let y: number;
        let elementHeight: number = +point.regions[0].height;
        let elementWidth: number = +point.regions[0].width;
        let centerX: number;
        let centerY: number;
        if (!series.chart.requireInvertedAxis) {
            x = +point.regions[0].x;
            if (series.type.indexOf('Stacking') > -1) {
                y = (1 - valueToCoefficient(0, series.yAxis)) * (series.yAxis.rect.height);
                centerX = x;
                centerY = y;
            } else {
                y = +point.regions[0].y;
                centerY = (series.seriesType.indexOf('HighLow') !== -1 || series.type.indexOf('Waterfall') !== -1) ? y + elementHeight / 2 :
                    (isPlot !== series.yAxis.isInversed) ? y : y + elementHeight;
                centerX = isPlot ? x : x + elementWidth;
            }
        } else {
            y = +point.regions[0].y;
            if (series.type.indexOf('Stacking') > -1) {
                x = (valueToCoefficient(0, series.yAxis)) * series.yAxis.rect.width;
                centerX = x;
                centerY = y;
            } else {
                x = +point.regions[0].x;
                centerY = isPlot ? y : y + elementHeight;
                centerX = (series.seriesType.indexOf('HighLow') !== -1 || series.type.indexOf('Waterfall') !== -1) ? x + elementWidth / 2 :
                    (isPlot !== series.yAxis.isInversed) ? x + elementWidth : x;
            }
        }

        let value: number;
        element.style.visibility = 'hidden';
        new Animation({}).animate(element, {
            duration: option.duration,
            delay: option.delay,
            progress: (args: AnimationOptions): void => {
                if (args.timeStamp >= args.delay) {
                    element.style.visibility = 'visible';
                    if (!series.chart.requireInvertedAxis) {
                        elementHeight = elementHeight ? elementHeight : 1;
                        value = effect(args.timeStamp - args.delay, 0, elementHeight, args.duration);
                        element.setAttribute('transform', 'translate(' + centerX + ' ' + centerY +
                            ') scale(1,' + (value / elementHeight) + ') translate(' + (-centerX) + ' ' + (-centerY) + ')');
                    } else {
                        elementWidth = elementWidth ? elementWidth : 1;
                        value = effect(args.timeStamp - args.delay, 0, elementWidth, args.duration);
                        element.setAttribute('transform', 'translate(' + centerX + ' ' + centerY +
                            ') scale(' + (value / elementWidth) + ', 1) translate(' + (-centerX) + ' ' + (-centerY) + ')');
                    }
                }
            },
            end: (model: AnimationOptions) => {
                element.setAttribute('transform', 'translate(0,0)');
                let seriesElement: Element = series.seriesElement;
                if (element === seriesElement.lastElementChild || point.index === series.points.length - 1 ||
                    (series.type === 'Waterfall' && element === seriesElement.children[seriesElement.childElementCount - 2])) {
                    series.chart.trigger('animationComplete', { series: series });
                    if (series.type === 'Waterfall') {
                        let rectElements: NodeList = seriesElement.childNodes;
                        for (let i: number = 0; i < rectElements.length; i++) {
                            if ((rectElements[i] as HTMLElement).id.indexOf('Connector') !== -1) {
                                (rectElements[i] as HTMLElement).style.visibility = 'visible';
                                (rectElements[i] as HTMLElement).setAttribute('transform', 'translate(0,0)');
                            }
                        }
                    }
                }
            }
        });
    }
    /**
     * To get rounded rect path direction
     */
    private calculateRoundedRectPath(
        rect: Rect, topLeft: number, topRight: number,
        bottomLeft: number, bottomRight: number
    ): string {
        return 'M' + ' ' + rect.x + ' ' + (topLeft + rect.y) +
            ' Q ' + rect.x + ' ' + rect.y + ' ' + (rect.x + topLeft) + ' ' +
            rect.y + ' ' + 'L' + ' ' + (rect.x + rect.width - topRight) + ' ' + rect.y +
            ' Q ' + (rect.x + rect.width) + ' ' + rect.y + ' ' +
            (rect.x + rect.width) + ' ' + (rect.y + topRight) + ' ' + 'L ' +
            (rect.x + rect.width) + ' ' + (rect.y + rect.height - bottomRight)
            + ' Q ' + (rect.x + rect.width) + ' ' + (rect.y + rect.height) + ' ' + (rect.x + rect.width - bottomRight) + ' ' +
            (rect.y + rect.height) + ' ' + 'L ' + (rect.x + bottomLeft) + ' ' + (rect.y + rect.height) + ' Q ' + rect.x + ' ' +
            (rect.y + rect.height) + ' ' + rect.x + ' ' + (rect.y + rect.height - bottomLeft) + ' ' + 'L' + ' ' + rect.x + ' ' +
            (topLeft + rect.y) + ' ' + 'Z';
    }
}
export interface RectPosition {
    position: number;
    rectCount: number;
}