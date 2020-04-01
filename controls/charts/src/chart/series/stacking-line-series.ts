import { ChartLocation, StackValues, getPoint, withInRange, TransformToVisible } from '../../common/utils/helper';
import { PathOption, Rect } from '@syncfusion/ej2-svg-base';
import { Chart } from '../chart';
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
     * @return {void}
     * @private
     */
    public render(series: Series, xAxis: Axis, yAxis: Axis, isInverted: boolean): void {
        let polarType: boolean = series.chart.chartAreaType === 'PolarRadar';
        let getCoordinate: Function = polarType ? TransformToVisible : getPoint;
        let direction: string = '';
        let visiblePts: Points[] = this.enableComplexProperty(series);
        let pointsLength: number = visiblePts.length;
        let stackedvalue: StackValues = series.stackedValues;
        let startPoint: number = 0;
        let options: PathOption;
        let point1: ChartLocation;
        let point2: ChartLocation;
        for (let i: number = 0; i < pointsLength; i++) {
            visiblePts[i].regions = []; visiblePts[i].symbolLocations = [];
            if (visiblePts[i].visible && withInRange(visiblePts[i - 1], visiblePts[i], visiblePts[i + 1], series)) {
                point1 = getCoordinate(
                    visiblePts[i].xValue, stackedvalue.endValues[i],
                    xAxis, yAxis, isInverted, series
                );
                direction = direction.concat((i ? 'L' : 'M') + ' ' + (point1.x) + ' ' + (point1.y) + ' ');
                visiblePts[i].symbolLocations.push(
                    getCoordinate(
                        visiblePts[i].xValue, stackedvalue.endValues[i], xAxis, yAxis,
                        isInverted, series
                    )
                );
                visiblePts[i].regions.push(new Rect(
                    visiblePts[i].symbolLocations[0].x - series.marker.width,
                    visiblePts[i].symbolLocations[0].y - series.marker.height,
                    2 * series.marker.width, 2 * series.marker.height
                ));
            } else {
                if (series.emptyPointSettings.mode !== 'Drop') {
                    if (visiblePts[i + 1] && visiblePts[i + 1].visible) {
                        point1 = getCoordinate(
                            visiblePts[i + 1].xValue, stackedvalue.endValues[i + 1],
                            xAxis, yAxis, isInverted, series
                        );
                        direction = direction.concat('M' + ' ' + (point1.x) + ' ' + (point1.y) + ' ');
                    }
                    startPoint = i + 1;
                }
            }
        }
        if (series.chart.chartAreaType === 'PolarRadar' && visiblePts.length > 1) {
            point1 = { 'y': stackedvalue.endValues[0], 'x': series.points[0].xValue, };
            point2 = getCoordinate(point1.x, point1.y, xAxis, yAxis, isInverted, series);
            direction += ('L' + ' ' + (point2.x) + ' ' + (point2.y) + ' ');
        }
        options = new PathOption(
            series.chart.element.id + '_Series_' + series.index, 'none', series.width, series.interior,
            series.opacity, series.dashArray, direction);
        this.appendLinePath(options, series, '');
        this.renderMarker(series);
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
     * To destroy the stacking line. 
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
        return 'StackingLineSeries';
    }
}
