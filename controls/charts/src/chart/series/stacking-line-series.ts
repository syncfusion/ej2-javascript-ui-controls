/* eslint-disable jsdoc/require-returns */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable valid-jsdoc */
/* eslint-disable jsdoc/require-param */
import { ChartLocation, StackValues, getPoint, withInRange, TransformToVisible } from '../../common/utils/helper';
import { PathOption, Rect } from '@syncfusion/ej2-svg-base';
import { Series, Points } from './chart-series';
import { LineBase } from './line-base';
import { AnimationModel } from '../../common/model/base-model';
import { Axis } from '../axis/axis';

/**
 * `StackingLineSeries` module used to render the Stacking Line series.
 */

export class StackingLineSeries extends LineBase {

    /**
     * Render the Stacking line series.
     *
     * @returns {void}
     * @private
     */
    public render(series: Series, xAxis: Axis, yAxis: Axis, isInverted: boolean): void {
        const polarType: boolean = series.chart.chartAreaType === 'PolarRadar';
        const getCoordinate: Function = polarType ? TransformToVisible : getPoint;
        let direction: string = '';
        const visiblePts: Points[] = this.enableComplexProperty(series);
        const pointsLength: number = visiblePts.length;
        const stackedvalue: StackValues = series.stackedValues;
        let pointIndex: number; let nextPointIndex: number;
        let point1: ChartLocation;
        let point2: ChartLocation;
        for (let i: number = 0; i < pointsLength; i++) {
            visiblePts[i as number].regions = []; visiblePts[i as number].symbolLocations = [];
            pointIndex = visiblePts[i as number].index;
            if (visiblePts[i as number].visible && withInRange(visiblePts[i - 1], visiblePts[i as number], visiblePts[i + 1], series)) {
                point1 = getCoordinate(
                    visiblePts[i as number].xValue, stackedvalue.endValues[pointIndex as number],
                    xAxis, yAxis, isInverted, series
                );
                direction = direction.concat((i ? 'L' : 'M') + ' ' + (point1.x) + ' ' + (point1.y) + ' ');
                visiblePts[i as number].symbolLocations.push(
                    getCoordinate(
                        visiblePts[i as number].xValue, stackedvalue.endValues[pointIndex as number], xAxis, yAxis,
                        isInverted, series
                    )
                );
                visiblePts[i as number].regions.push(new Rect(
                    visiblePts[i as number].symbolLocations[0].x - series.marker.width,
                    visiblePts[i as number].symbolLocations[0].y - series.marker.height,
                    2 * series.marker.width, 2 * series.marker.height
                ));
            } else {
                if (series.emptyPointSettings.mode !== 'Drop') {
                    if (visiblePts[i + 1] && visiblePts[i + 1].visible) {
                        nextPointIndex = visiblePts[i + 1].index;
                        point1 = getCoordinate(
                            visiblePts[i + 1].xValue, stackedvalue.endValues[nextPointIndex as number],
                            xAxis, yAxis, isInverted, series
                        );
                        direction = direction.concat('M' + ' ' + (point1.x) + ' ' + (point1.y) + ' ');
                    }
                }
            }
        }
        if (series.chart.chartAreaType === 'PolarRadar' && visiblePts.length > 1) {
            point1 = { 'y': stackedvalue.endValues[0], 'x': series.points[0].xValue };
            point2 = getCoordinate(point1.x, point1.y, xAxis, yAxis, isInverted, series);
            direction += ('L' + ' ' + (point2.x) + ' ' + (point2.y) + ' ');
        }
        const options: PathOption = new PathOption(
            series.chart.element.id + '_Series_' + series.index, 'none', series.width, series.interior,
            series.opacity, series.dashArray, direction);
        this.appendLinePath(options, series, '');
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
     * To destroy the stacking line.
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
        return 'StackingLineSeries';
    }
}
