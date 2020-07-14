import { ChartLocation, StackValues, getPoint, withInRange } from '../../common/utils/helper';
import { PathOption, Rect } from '@syncfusion/ej2-svg-base';
import { Chart } from '../chart';
import { Series, Points } from './chart-series';
import { LineBase } from './line-base';
import { AnimationModel } from '../../common/model/base-model';
import { Axis } from '../../chart/axis/axis';

/**
 * `StackingStepAreaSeries` module used to render the Stacking Step Area series.
 */

export class StackingStepAreaSeries extends LineBase {

    /**
     * Render the Stacking step area series.
     * @return {void}
     * @private
     */
    public render(stackSeries: Series, xAxis: Axis, yAxis: Axis, isInverted: boolean): void {
        let currentPointLocation: ChartLocation; let secondPoint: ChartLocation;
        let start: ChartLocation = null; let direction: string = '';
        let stackedvalue: StackValues = stackSeries.stackedValues;
        let visiblePoint: Points[] = this.enableComplexProperty(stackSeries);
        let origin: number = Math.max(stackSeries.yAxis.visibleRange.min, stackedvalue.startValues[0]);
        let pointsLength: number = visiblePoint.length; let options: PathOption; let point: Points;
        let point2: ChartLocation; let point3: ChartLocation; let xValue: number; let lineLength: number;
        let prevPoint: Points = null; let validIndex: number; let startPoint: number = 0;
        if (xAxis.valueType === 'Category' && xAxis.labelPlacement === 'BetweenTicks') {
            lineLength = 0.5;
        } else {
            lineLength = 0;
        }
        for (let i: number = 0; i < pointsLength; i++) {
            point = visiblePoint[i]; xValue = point.xValue;
            point.symbolLocations = []; point.regions = [];
            if (point.visible && withInRange(visiblePoint[i - 1], point, visiblePoint[i + 1], stackSeries)) {
                if (start === null) {
                    start = new ChartLocation(xValue, 0);
                    currentPointLocation = getPoint(xValue - lineLength, origin, xAxis, yAxis, isInverted);
                    direction += ('M' + ' ' + (currentPointLocation.x) + ' ' + (currentPointLocation.y) + ' ');
                    currentPointLocation = getPoint(xValue - lineLength, stackedvalue.endValues[i], xAxis, yAxis, isInverted);
                    direction += ('L' + ' ' + (currentPointLocation.x) + ' ' + (currentPointLocation.y) + ' ');
                }
                if (prevPoint != null) {
                    currentPointLocation = getPoint(point.xValue, stackedvalue.endValues[i], xAxis, yAxis, isInverted);
                    secondPoint = getPoint(prevPoint.xValue, stackedvalue.endValues[prevPoint.index], xAxis, yAxis, isInverted);
                    direction += ('L' + ' ' + (currentPointLocation.x) + ' ' + (secondPoint.y) +
                        ' L' + ' ' + (currentPointLocation.x) + ' ' + (currentPointLocation.y) + ' ');
                } else if (stackSeries.emptyPointSettings.mode === 'Gap') {
                    currentPointLocation = getPoint(point.xValue, stackedvalue.endValues[i], xAxis, yAxis, isInverted);
                    direction += 'L' + ' ' + (currentPointLocation.x) + ' ' + (currentPointLocation.y) + ' ';
                }
                visiblePoint[i].symbolLocations.push(
                    getPoint(visiblePoint[i].xValue, stackedvalue.endValues[i], xAxis, yAxis, isInverted, stackSeries));
                visiblePoint[i].regions.push(new Rect(
                    visiblePoint[i].symbolLocations[0].x - stackSeries.marker.width,
                    visiblePoint[i].symbolLocations[0].y - stackSeries.marker.height,
                    2 * stackSeries.marker.width, 2 * stackSeries.marker.height
                ));
                prevPoint = point;
            }
            // If we set the empty point mode is Gap or next point of the current point is false, we will close the series path.
            if (visiblePoint[i + 1] && !visiblePoint[i + 1].visible && stackSeries.emptyPointSettings.mode !== 'Drop') {
                for (let j: number = i; j >= startPoint; j--) {
                    if (j !== 0 && (stackedvalue.startValues[j] < stackedvalue.startValues[j - 1] ||
                        stackedvalue.startValues[j] > stackedvalue.startValues[j - 1])) {
                        currentPointLocation = getPoint(
                            visiblePoint[j].xValue, stackedvalue.startValues[j], xAxis, yAxis, isInverted, stackSeries);
                        direction = direction.concat('L' + ' ' + (currentPointLocation.x) + ' ' + (currentPointLocation.y) + ' ');
                        currentPointLocation = getPoint(
                            visiblePoint[j].xValue, stackedvalue.startValues[j - 1], xAxis, yAxis, isInverted, stackSeries);
                    } else {
                        currentPointLocation = getPoint(
                            visiblePoint[j].xValue, stackedvalue.startValues[j], xAxis, yAxis, isInverted, stackSeries);
                    }
                    direction = direction.concat('L' + ' ' + (currentPointLocation.x) + ' ' + (currentPointLocation.y) + ' ');
                }
                startPoint = i + 1;
                start = null;
                prevPoint = null;
            }
        }
        // For category axis
        if ((pointsLength > 1) && direction !== '') {
            start = { 'x': visiblePoint[pointsLength - 1].xValue + lineLength, 'y': stackedvalue.endValues[pointsLength - 1] };
            secondPoint = getPoint(start.x, start.y, xAxis, yAxis, isInverted);
            direction += ('L' + ' ' + (secondPoint.x) + ' ' + (secondPoint.y) + ' ');
            start = { 'x': visiblePoint[pointsLength - 1].xValue + lineLength, 'y': stackedvalue.startValues[pointsLength - 1] };
            secondPoint = getPoint(start.x, start.y, xAxis, yAxis, isInverted);
            direction += ('L' + ' ' + (secondPoint.x) + ' ' + (secondPoint.y) + ' ');
        }
        // To close the stacked step area series path in reverse order
        for (let j: number = pointsLength - 1; j >= startPoint; j--) {
            let index: number;
            if (visiblePoint[j].visible) {
                point2 = getPoint(visiblePoint[j].xValue, stackedvalue.startValues[j], xAxis, yAxis, isInverted, stackSeries);
                direction = direction.concat('L' + ' ' + (point2.x) + ' ' + (point2.y) + ' ');
            }
            if (j !== 0 && !visiblePoint[j - 1].visible) {
                index = this.getNextVisiblePointIndex(visiblePoint, j);
            }
            if (j !== 0) {
                validIndex = index ? index : j - 1;
                point3 = getPoint(
                    visiblePoint[validIndex].xValue, stackedvalue.startValues[validIndex], xAxis, yAxis, isInverted, stackSeries);
                direction = direction.concat('L' + ' ' + (point2.x) + ' ' + (point3.y) + ' ');
            }
        }
        options = new PathOption(
            stackSeries.chart.element.id + '_Series_' + stackSeries.index, stackSeries.interior,
            stackSeries.border.width, stackSeries.border.color, stackSeries.opacity, stackSeries.dashArray, direction
        );
        this.appendLinePath(options, stackSeries, '');
        this.renderMarker(stackSeries);
    }
    /**
     * Animates the series.
     * @param  {Series} series - Defines the series to animate.
     * @return {void}
     */
    public doAnimation(series: Series): void {
        let option: AnimationModel = series.animation;
        this.doLinearAnimation(series, option);
    }
    /**
     * To destroy the stacking step area.
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
        return 'StackingStepAreaSeries';
    }
    /**
     * To get the nearest visible point
     * @param points 
     * @param j 
     */
    private getNextVisiblePointIndex(points: Points[], j: number): number {
        let index: number;
        for (index = j - 1; index >= 0; index--) {
            if (!points[index].visible) {
                continue;
            } else {
                return index;
            }
        }
        return 0;
    }
}