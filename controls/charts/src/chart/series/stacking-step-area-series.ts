/* eslint-disable max-len */
/* eslint-disable jsdoc/require-returns */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable valid-jsdoc */
/* eslint-disable jsdoc/require-param */
import { ChartLocation, StackValues, getPoint, withInRange } from '../../common/utils/helper';
import { PathOption, Rect } from '@syncfusion/ej2-svg-base';
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
     *
     * @returns {void}
     * @private
     */
    public render(stackSeries: Series, xAxis: Axis, yAxis: Axis, isInverted: boolean): void {
        let currentPointLocation: ChartLocation; let secondPoint: ChartLocation;
        let start: ChartLocation = null; let direction: string = '';
        const stackedvalue: StackValues = stackSeries.stackedValues;
        const visiblePoint: Points[] = this.enableComplexProperty(stackSeries);
        const origin: number = Math.max(stackSeries.yAxis.visibleRange.min, stackedvalue.startValues[0]);
        const pointsLength: number = visiblePoint.length; let options: PathOption; let point: Points;
        let point2: ChartLocation; let point3: ChartLocation; let xValue: number; let lineLength: number;
        let prevPoint: Points = null; let validIndex: number; let startPoint: number = 0;
        let pointIndex: number;
        let emptyPointDirection:  string = '';
        if (xAxis.valueType === 'Category' && xAxis.labelPlacement === 'BetweenTicks') {
            lineLength = 0.5;
        } else {
            lineLength = 0;
        }
        for (let i: number = 0; i < pointsLength; i++) {
            point = visiblePoint[i as number]; xValue = point.xValue;
            point.symbolLocations = []; point.regions = [];
            pointIndex = point.index;
            if (point.visible && withInRange(visiblePoint[i - 1], point, visiblePoint[i + 1], stackSeries)) {
                if (start === null) {
                    start = new ChartLocation(xValue, 0);
                    currentPointLocation = getPoint(xValue - lineLength, origin, xAxis, yAxis, isInverted);
                    direction += ('M' + ' ' + (currentPointLocation.x) + ' ' + (currentPointLocation.y) + ' ');
                    currentPointLocation = getPoint(xValue - lineLength, stackedvalue.endValues[pointIndex as number], xAxis, yAxis, isInverted);
                    direction += ('L' + ' ' + (currentPointLocation.x) + ' ' + (currentPointLocation.y) + ' ');
                }
                if (prevPoint != null) {
                    currentPointLocation = getPoint(point.xValue, stackedvalue.endValues[pointIndex as number], xAxis, yAxis, isInverted);
                    secondPoint = getPoint(prevPoint.xValue, stackedvalue.endValues[prevPoint.index], xAxis, yAxis, isInverted);
                    direction += ('L' + ' ' + (currentPointLocation.x) + ' ' + (secondPoint.y) +
                        ' L' + ' ' + (currentPointLocation.x) + ' ' + (currentPointLocation.y) + ' ');
                } else if (stackSeries.emptyPointSettings.mode === 'Gap') {
                    currentPointLocation = getPoint(point.xValue, stackedvalue.endValues[pointIndex as number], xAxis, yAxis, isInverted);
                    direction += 'L' + ' ' + (currentPointLocation.x) + ' ' + (currentPointLocation.y) + ' ';
                }
                visiblePoint[i as number].symbolLocations.push(
                    getPoint(visiblePoint[i as number].xValue, stackedvalue.endValues[pointIndex as number], xAxis, yAxis, isInverted));
                visiblePoint[i as number].regions.push(new Rect(
                    visiblePoint[i as number].symbolLocations[0].x - stackSeries.marker.width,
                    visiblePoint[i as number].symbolLocations[0].y - stackSeries.marker.height,
                    2 * stackSeries.marker.width, 2 * stackSeries.marker.height
                ));
                prevPoint = point;
            }
            // If we set the empty point mode is Gap or next point of the current point is false, we will close the series path.
            if (visiblePoint[i + 1] && !visiblePoint[i + 1].visible && stackSeries.emptyPointSettings.mode !== 'Drop') {
                let previousPointIndex: number;
                for (let j: number = i; j >= startPoint; j--) {
                    pointIndex = visiblePoint[j as number].index;
                    previousPointIndex = j === 0 ? 0 : visiblePoint[j - 1].index;
                    if (j !== 0 && (stackedvalue.startValues[pointIndex as number] < stackedvalue.startValues[previousPointIndex as number] ||
                        stackedvalue.startValues[pointIndex as number] > stackedvalue.startValues[previousPointIndex as number])) {
                        currentPointLocation = getPoint(
                            visiblePoint[pointIndex as number].xValue, stackedvalue.startValues[pointIndex as number], xAxis, yAxis, isInverted);
                        direction = direction.concat('L' + ' ' + (currentPointLocation.x) + ' ' + (currentPointLocation.y) + ' ');
                        currentPointLocation = getPoint(
                            visiblePoint[pointIndex as number].xValue, stackedvalue.startValues[previousPointIndex as number],
                            xAxis, yAxis, isInverted
                        );
                    } else {
                        currentPointLocation = getPoint(
                            visiblePoint[pointIndex as number].xValue, stackedvalue.startValues[pointIndex as number], xAxis, yAxis, isInverted);
                    }
                    direction = direction.concat('L' + ' ' + (currentPointLocation.x) + ' ' + (currentPointLocation.y) + ' ');
                }
                startPoint = i + 1;
                start = null;
                prevPoint = null;
            }
        }
        if (direction !== '') {
            // For category axis
            if (pointsLength > 1) {
                pointIndex = visiblePoint[pointsLength - 1].index;
                start = { 'x': visiblePoint[pointsLength - 1].xValue + lineLength, 'y': stackedvalue.endValues[pointIndex as number] };
                secondPoint = getPoint(start.x, start.y, xAxis, yAxis, isInverted);
                direction += ('L' + ' ' + (secondPoint.x) + ' ' + (secondPoint.y) + ' ');
                start = { 'x': visiblePoint[pointsLength - 1].xValue + lineLength, 'y': stackedvalue.startValues[pointIndex as number] };
                secondPoint = getPoint(start.x, start.y, xAxis, yAxis, isInverted);
                direction += ('L' + ' ' + (secondPoint.x) + ' ' + (secondPoint.y) + ' ');
            }
            // To close the stacked step area series path in reverse order
            for (let j: number = pointsLength - 1; j >= startPoint; j--) {
                let index: number;
                if (visiblePoint[j as number].visible) {
                    pointIndex = visiblePoint[j as number].index;
                    point2 = getPoint(visiblePoint[j as number].xValue, stackedvalue.startValues[pointIndex as number], xAxis, yAxis, isInverted);
                    direction = direction.concat('L' + ' ' + (point2.x) + ' ' + (point2.y) + ' ');
                }
                if (j !== 0 && !visiblePoint[j - 1].visible) {
                    index = this.getNextVisiblePointIndex(visiblePoint, j);
                }
                if (j !== 0) {
                    validIndex = index ? index : j - 1;
                    pointIndex = index ? visiblePoint[index as number].index : visiblePoint[j - 1].index;
                    point3 = getPoint(
                        visiblePoint[validIndex as number].xValue, stackedvalue.startValues[pointIndex as number],
                        xAxis, yAxis, isInverted);
                    direction = direction.concat('L' + ' ' + (point2.x) + ' ' + (point3.y) + ' ');
                }
            }
            options = new PathOption(
                stackSeries.chart.element.id + '_Series_' + stackSeries.index, stackSeries.interior,
                0, 'transparent', stackSeries.opacity, stackSeries.dashArray, direction
            );
            this.appendLinePath(options, stackSeries, '');
            /**
             * To draw border for the path directions of area
             */
            if (stackSeries.border.width !== 0) {
                emptyPointDirection = this.removeEmptyPointsBorder(this.getBorderDirection(direction));
                options = new PathOption(
                    stackSeries.chart.element.id + '_Series_border_' + stackSeries.index, 'transparent',
                    stackSeries.border.width, stackSeries.border.color ? stackSeries.border.color : stackSeries.interior, 1,
                    stackSeries.dashArray, emptyPointDirection
                );
                this.appendLinePath(options, stackSeries, '');
            }
            this.renderMarker(stackSeries);
        }
    }
    /**
     * Animates the series.
     *
     * @param  {Series} series - Defines the series to animate.
     * @returns {void}
     */
    public doAnimation(series: Series): void {
        const option: AnimationModel = series.animation;
        this.doLinearAnimation(series, option);
    }
    /**
     * To destroy the stacking step area.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
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
     *
     * @param {Points[]} points points
     * @param {number} j index
     */
    private getNextVisiblePointIndex(points: Points[], j: number): number {
        let index: number;
        for (index = j - 1; index >= 0; index--) {
            if (!points[index as number].visible) {
                continue;
            } else {
                return index;
            }
        }
        return 0;
    }
}
