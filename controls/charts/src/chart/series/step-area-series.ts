/* eslint-disable jsdoc/require-returns */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable valid-jsdoc */
/* eslint-disable jsdoc/require-param */
import { getPoint, withInRange, ChartLocation } from '../../common/utils/helper';
import { PathOption } from '@syncfusion/ej2-svg-base';
import { Series, Points } from './chart-series';
import { LineBase } from './line-base';
import { AnimationModel } from '../../common/model/base-model';
import { Axis } from '../../chart/axis/axis';

/**
 * `StepAreaSeries` Module used to render the step area series.
 */

export class StepAreaSeries extends LineBase {

    /**
     * Render StepArea series.
     *
     * @returns {void}
     * @private
     */
    public render(series: Series, xAxis: Axis, yAxis: Axis, isInverted: boolean): void {
        let currentPoint: ChartLocation;
        let secondPoint: ChartLocation;
        let start: ChartLocation = null;
        let direction: string = '';
        const visiblePoints: Points[] = this.enableComplexProperty(series);
        const pointsLength: number = visiblePoints.length;
        const origin: number = Math.max(<number>series.yAxis.visibleRange.min, 0);
        let point: Points;
        let xValue: number;
        let lineLength: number;
        let prevPoint: Points = null;
        let emptyPointDirection:  string = '';
        if (xAxis.valueType === 'Category' && xAxis.labelPlacement === 'BetweenTicks') {
            lineLength = 0.5;
        } else {
            lineLength = 0;
        }
        for (let i: number = 0; i < pointsLength; i++) {
            point = visiblePoints[i];
            xValue = point.xValue;
            point.symbolLocations = []; point.regions = [];
            if (point.visible && withInRange(visiblePoints[i - 1], point, visiblePoints[i + 1], series)) {
                if (start === null) {
                    start = new ChartLocation(xValue, 0);
                    // Start point for the current path
                    currentPoint = getPoint(xValue - lineLength, origin, xAxis, yAxis, isInverted);
                    direction += ('M' + ' ' + (currentPoint.x) + ' ' + (currentPoint.y) + ' ');
                    currentPoint = getPoint(xValue - lineLength, point.yValue, xAxis, yAxis, isInverted);
                    direction += ('L' + ' ' + (currentPoint.x) + ' ' + (currentPoint.y) + ' ');
                }
                // First Point to draw the Steparea path
                if (prevPoint != null) {
                    currentPoint = getPoint(point.xValue, point.yValue, xAxis, yAxis, isInverted);
                    secondPoint = getPoint(prevPoint.xValue, prevPoint.yValue, xAxis, yAxis, isInverted);
                    direction += ('L' + ' ' +
                        (currentPoint.x) + ' ' + (secondPoint.y) + ' L' + ' ' + (currentPoint.x) + ' ' + (currentPoint.y) + ' ');
                } else if (series.emptyPointSettings.mode === 'Gap') {
                    currentPoint = getPoint(point.xValue, point.yValue, xAxis, yAxis, isInverted);
                    direction += 'L' + ' ' + (currentPoint.x) + ' ' + (currentPoint.y) + ' ';
                }
                this.storePointLocation(point, series, isInverted, getPoint);
                prevPoint = point;
            }
            if (visiblePoints[i + 1] && !visiblePoints[i + 1].visible && series.emptyPointSettings.mode !== 'Drop') {
                // current start point
                currentPoint = getPoint(xValue + lineLength, origin, xAxis, yAxis, isInverted);
                direction += ('L' + ' ' + (currentPoint.x) + ' ' + (currentPoint.y));
                start = null;
                prevPoint = null;
            }
        }

        if ((pointsLength > 1) && direction !== '') {
            start = { 'x': visiblePoints[pointsLength - 1].xValue + lineLength, 'y': visiblePoints[pointsLength - 1].yValue };
            secondPoint = getPoint(start.x, start.y, xAxis, yAxis, isInverted);
            direction += ('L' + ' ' + (secondPoint.x) + ' ' + (secondPoint.y) + ' ');
            start = { 'x': visiblePoints[pointsLength - 1].xValue + lineLength, 'y': origin };
            secondPoint = getPoint(start.x, start.y, xAxis, yAxis, isInverted);
            direction += ('L' + ' ' + (secondPoint.x) + ' ' + (secondPoint.y) + ' ');
        } else {
            direction = '';
        }

        const options: PathOption = new PathOption(
            series.chart.element.id + '_Series_' + series.index, series.interior,
            0, 'transparent', series.opacity, series.dashArray, direction
        );
        this.appendLinePath(options, series, '');
        
        /**
          * To draw border for the path directions of area
          */
        if (series.border.width != 0) {
            emptyPointDirection = this.removeEmptyPointsBorder(this.getBorderDirection(direction));
            const options: PathOption = new PathOption(
                series.chart.element.id + '_Series_border_' + series.index, 'transparent',
                series.border.width, series.border.color ? series.border.color : series.interior, 1, series.dashArray, emptyPointDirection
            );
            this.appendLinePath(options, series, '');
        }
        this.renderMarker(series);
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
     * To destroy the step Area series.
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
        return 'StepAreaSeries';
    }
}
