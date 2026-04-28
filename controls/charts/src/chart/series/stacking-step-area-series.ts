import { ChartLocation, StackValues, animateAddPoints, getPoint, withInRange } from '../../common/utils/helper';
import { PathOption, Rect } from '@syncfusion/ej2-svg-base';
import { Series, Points } from './chart-series';
import { LineBase } from './line-base';
import { AnimationModel } from '../../common/model/base-model';
import { Axis } from '../../chart/axis/axis';
import { StepPosition } from '../utils/enum';

/**
 * The `StackingStepAreaSeries` module is used to render the stacking step area series.
 */

export class StackingStepAreaSeries extends LineBase {

    private prevStep: StepPosition;

    /**
     * Render the Stacking Step Area series.
     *
     * @param {Series} stackSeries - The series to be rendered.
     * @param {Axis} xAxis - The x-axis of the chart.
     * @param {Axis} yAxis - The y-axis of the chart.
     * @param {boolean} isInverted - Specifies whether the chart is inverted.
     * @param {boolean} pointAnimate - Specifies whether the point has to be animated or not.
     * @param {boolean} pointUpdate - Specifies whether the point has to be updated or not.
     * @returns {void}
     * @private
     */
    public render(stackSeries: Series, xAxis: Axis, yAxis: Axis, isInverted: boolean, pointAnimate: boolean, pointUpdate?: boolean): void {
        let currentPointLocation: ChartLocation; let secondPoint: ChartLocation;
        let start: ChartLocation = null; let direction: string = '';
        let borderDirection: string = '';
        const stackedvalue: StackValues = stackSeries.stackedValues;
        const visiblePoint: Points[] = this.enableComplexProperty(stackSeries);
        const origin: number = Math.max(stackSeries.yAxis.visibleRange.min, stackedvalue.startValues[0]);
        const pointsLength: number = visiblePoint.length; let options: PathOption; let point: Points;
        let point2: ChartLocation; let point3: ChartLocation; let xValue: number; let lineLength: number;
        let prevPoint: Points = null; let validIndex: number; let startPoint: number = 0;
        let pointIndex: number;
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
                    currentPointLocation = getPoint(xValue - lineLength, stackedvalue.endValues[pointIndex as number],
                                                    xAxis, yAxis, isInverted);
                    direction += ('L' + ' ' + (currentPointLocation.x) + ' ' + (currentPointLocation.y) + ' ');
                    borderDirection += ('M' + ' ' + (currentPointLocation.x) + ' ' + (currentPointLocation.y) + ' ');
                }
                if (prevPoint != null) {
                    currentPointLocation = getPoint(point.xValue, stackedvalue.endValues[pointIndex as number], xAxis, yAxis, isInverted);
                    secondPoint = getPoint(prevPoint.xValue, stackedvalue.endValues[prevPoint.index], xAxis, yAxis, isInverted);
                    direction += (this.GetStepLineDirection(currentPointLocation, secondPoint, stackSeries.step, 'L', stackSeries, false));
                    borderDirection += (this.GetStepLineDirection(currentPointLocation, secondPoint, stackSeries.step, 'L', stackSeries, true));
                } else if (stackSeries.emptyPointSettings.mode === 'Gap') {
                    currentPointLocation = getPoint(point.xValue, stackedvalue.endValues[pointIndex as number], xAxis, yAxis, isInverted);
                    direction += 'L' + ' ' + (currentPointLocation.x) + ' ' + (currentPointLocation.y) + ' ';
                    borderDirection += 'L' + ' ' + (currentPointLocation.x) + ' ' + (currentPointLocation.y) + ' ';
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
            if (visiblePoint[i + 1] && (!visiblePoint[i + 1].visible && start !== null) && stackSeries.emptyPointSettings.mode !== 'Drop') {
                let previousPointIndex: number;
                for (let j: number = i; j >= startPoint; j--) {
                    pointIndex = visiblePoint[j as number].index;
                    previousPointIndex = j === 0 ? 0 : visiblePoint[j - 1].index;
                    currentPointLocation = getPoint(
                        visiblePoint[pointIndex as number].xValue, stackedvalue.startValues[pointIndex as number],
                        xAxis, yAxis, isInverted);
                    if (j !== 0 && (stackedvalue.startValues[pointIndex as number] <
                        stackedvalue.startValues[previousPointIndex as number] ||
                        stackedvalue.startValues[pointIndex as number] > stackedvalue.startValues[previousPointIndex as number])) {
                        direction = direction.concat('L' + ' ' + (currentPointLocation.x) + ' ' + (currentPointLocation.y) + ' ');
                        secondPoint = getPoint(
                            visiblePoint[previousPointIndex as number].xValue, stackedvalue.startValues[previousPointIndex as number],
                            xAxis, yAxis, isInverted
                        );
                    } else {
                        secondPoint = getPoint(
                            visiblePoint[pointIndex as number].xValue, stackedvalue.startValues[pointIndex as number],
                            xAxis, yAxis, isInverted);
                    }
                    if (visiblePoint[previousPointIndex as number].visible) {
                        direction = direction.concat(this.GetStepLineDirection(secondPoint, currentPointLocation, this.prevStep, 'L', stackSeries));
                    }
                }
                startPoint = i + 2;
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
                borderDirection += ('L' + ' ' + (secondPoint.x) + ' ' + (secondPoint.y) + ' ');
                start = { 'x': visiblePoint[pointsLength - 1].xValue + lineLength, 'y': stackedvalue.startValues[pointIndex as number] };
                secondPoint = getPoint(start.x, start.y, xAxis, yAxis, isInverted);
                direction += ('L' + ' ' + (secondPoint.x) + ' ' + (secondPoint.y) + ' ');
            }
            // To close the stacked step area series path in reverse order
            for (let j: number = pointsLength - 1; j >= startPoint; j--) {
                let index: number;
                if (visiblePoint[j as number].visible) {
                    pointIndex = visiblePoint[j as number].index;
                    point2 = getPoint(visiblePoint[j as number].xValue, stackedvalue.startValues[pointIndex as number],
                                      xAxis, yAxis, isInverted);
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
                    if (!(j !== 0 && !visiblePoint[j - 1].visible)) {
                        direction = direction.concat(this.GetStepLineDirection(point3, point2, this.prevStep, 'L', stackSeries));
                    }
                }
            }
            this.prevStep = stackSeries.step === 'Right' ? 'Left' : stackSeries.step === 'Left' ? 'Right' : stackSeries.step;
            options = new PathOption(
                stackSeries.chart.element.id + '_Series_' + stackSeries.index, stackSeries.interior,
                0, 'transparent', stackSeries.opacity, stackSeries.dashArray, direction
            );
            this[pointAnimate ? 'addPath' : 'appendLinePath'](options, stackSeries, '');
            /**
             * To draw border for the path directions of area
             */
            if (stackSeries.border.width !== 0) {
                options = new PathOption(
                    stackSeries.chart.element.id + '_Series_border_' + stackSeries.index, 'transparent',
                    stackSeries.border.width, stackSeries.border.color ? stackSeries.border.color : stackSeries.interior, 1,
                    stackSeries.border.dashArray, borderDirection
                );
                this[pointAnimate ? 'addPath' : 'appendLinePath'](options, stackSeries, '');
            }
            if (!pointUpdate) {this.renderMarker(stackSeries); }
        }
    }

    /**
     * To animate point for stacking step area series.
     *
     * @param {Series} series - Specifies the series.
     * @param {number} point - Specifies the point.
     * @returns {void}
     * @private
     */
    public updateDirection(series: Series, point: number[]): void {
        for (let i: number = 0; i < series.xAxis.series.length; i++) {
            const stackSeries: Series = series.xAxis.series[i as number];
            this.render(stackSeries, stackSeries.xAxis, stackSeries.yAxis, stackSeries.chart.requireInvertedAxis, false, true);
            for (let j: number = 0; j < point.length; j++) {
                if (stackSeries.marker && stackSeries.marker.visible) {
                    stackSeries.chart.markerRender.renderMarker(stackSeries, stackSeries.points[point[j as number]],
                                                                stackSeries.points[point[j as number]].symbolLocations[0], null, true);
                }
                if (stackSeries.marker.dataLabel.visible && stackSeries.chart.dataLabelModule) {
                    stackSeries.chart.dataLabelModule.commonId = stackSeries.chart.element.id + '_Series_' + stackSeries.index + '_Point_';
                    stackSeries.chart.dataLabelModule.
                        renderDataLabel(stackSeries, stackSeries.points[point[j as number]],
                                        null, stackSeries.marker.dataLabel);
                }
            }
        }
    }
    /**
     * Adds a area path to equate the start and end paths.
     *
     * @param {PathOption} options - The options for the path.
     * @param {Series} series - The series to which the path belongs.
     * @param {string} clipRect - The clip rectangle for the path.
     * @returns {void}
     * @private
     */
    public addPath (options: PathOption, series: Series, clipRect: string): void {
        const points: { element: Element; previousDirection: string; } =
        this.appendPathElement(options, series, clipRect);
        if (points.previousDirection !== '' && options.d !== '') {
            const startPathCommands: string[] = points.previousDirection.match(/[MLHVCSQTAZ][^MLHVCSQTAZ]*/g);
            const endPathCommands: string[] = (options.d).match(/[MLHVCSQTAZ][^MLHVCSQTAZ]*/g);
            const maxLength: number = Math.max(startPathCommands.length, endPathCommands.length);
            const minLength: number = Math.min(startPathCommands.length, endPathCommands.length);
            if (startPathCommands.length < endPathCommands.length) {
                for (let i: number = startPathCommands.length; i < endPathCommands.length; i++) {
                    if (endPathCommands.length !== startPathCommands.length) {
                        startPathCommands.splice((Math.floor((startPathCommands.length / 2)) - 1), 0,
                                                 startPathCommands[Math.floor((startPathCommands.length / 2)) - 1],
                                                 startPathCommands[Math.floor((startPathCommands.length / 2)) - 1]);
                        startPathCommands.splice((Math.floor((startPathCommands.length / 2)) + 2), 0,
                                                 startPathCommands[Math.floor((startPathCommands.length / 2)) + 2],
                                                 startPathCommands[Math.floor((startPathCommands.length / 2)) + 2],
                                                 startPathCommands[Math.floor((startPathCommands.length / 2)) + 2]);
                    }
                }
                animateAddPoints(points.element, options.d, series.chart.redraw, startPathCommands.join(' '), this.chart.duration);
            } else if (startPathCommands.length > endPathCommands.length) {
                for (let i: number = minLength; i < maxLength; i++) {
                    if (endPathCommands.length !== startPathCommands.length) {
                        endPathCommands.splice(2, 0, endPathCommands[2]);
                        endPathCommands.splice(endPathCommands.length - 3, 0, endPathCommands[endPathCommands.length - 3]);
                    }
                }
                animateAddPoints(points.element, endPathCommands.join(''), series.chart.redraw, points.previousDirection, this.chart.duration, options.d);
            }
            else {
                animateAddPoints(points.element, options.d, series.chart.redraw, points.previousDirection, this.chart.duration);
            }
        }
    }
    /**
     * Animates the series.
     *
     * @param  {Series} series - Defines the series to animate.
     * @returns {void}
     * @private
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
        return 'StackingStepAreaSeries';
    }
    /**
     * To get the nearest visible point.
     *
     * @param {Points[]} points points
     * @param {number} j index
     * @returns {number} - Returns the nearest visible point.
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
