import { BorderModel } from '../../common/model/base-model';
import { ChartLocation, PathOption, StackValues, getPoint, withInRange, Rect, TransformToVisible } from '../../common/utils/helper';
import { Chart } from '../chart';
import { Series, Points } from './chart-series';
import { LineBase } from './line-base';
import { AnimationModel } from '../../common/model/base-model';
import { Axis } from '../../chart/axis/axis';

/**
 * `StackingAreaSeries` module used to render the Stacking Area series.
 */

export class StackingAreaSeries extends LineBase {

    /**
     * Render the Stacking area series.
     * @return {void}
     * @private
     */
    public render(series: Series, xAxis: Axis, yAxis: Axis, isInverted: boolean): void {
        let polarAreaType: boolean = series.chart.chartAreaType === 'PolarRadar';
        let getCoordinate: Function = polarAreaType ? TransformToVisible : getPoint;
        let lineDirection: string = '';
        let visiblePoints: Points[] = <Points[]>series.points;
        let pointsLength: number = visiblePoints.length;
        let stackedvalue: StackValues = series.stackedValues;
        let origin: number = polarAreaType ?
            Math.max(series.yAxis.visibleRange.min, stackedvalue.endValues[0]) :
            Math.max(series.yAxis.visibleRange.min, stackedvalue.startValues[0]);
        let border: BorderModel = series.border;
        let options: PathOption;
        let startPoint: number = 0;
        let point1: ChartLocation = getCoordinate(visiblePoints[0].xValue, origin, xAxis, yAxis, isInverted, series);
        let point2: ChartLocation;
        lineDirection = lineDirection.concat('M' + ' ' + (point1.x) + ' ' + (point1.y) + ' ');
        for (let i: number = 0; i < pointsLength; i++) {
            visiblePoints[i].symbolLocations = []; visiblePoints[i].regions = [];
            if (visiblePoints[i].visible && withInRange(visiblePoints[i - 1], visiblePoints[i], visiblePoints[i + 1], series)) {
                point1 = getCoordinate(
                    visiblePoints[i].xValue, stackedvalue.endValues[i],
                    xAxis, yAxis, isInverted, series
                );
                lineDirection = lineDirection.concat('L' + ' ' + (point1.x) + ' ' + (point1.y) + ' ');
                visiblePoints[i].symbolLocations.push(
                    getCoordinate(
                        visiblePoints[i].xValue, stackedvalue.endValues[i], xAxis, yAxis,
                        isInverted, series
                    )
                );
                visiblePoints[i].regions.push(new Rect(
                    visiblePoints[i].symbolLocations[0].x - series.marker.width,
                    visiblePoints[i].symbolLocations[0].y - series.marker.height,
                    2 * series.marker.width, 2 * series.marker.height
                ));
            } else {
                if (series.emptyPointSettings.mode !== 'Drop') {
                    for (let j: number = i - 1; j >= startPoint; j--) {
                        point2 = getCoordinate(visiblePoints[j].xValue, stackedvalue.startValues[j], xAxis, yAxis, isInverted, series);
                        lineDirection = lineDirection.concat('L' + ' ' + (point2.x) + ' ' + (point2.y) + ' ');
                    }
                    if (visiblePoints[i + 1] && visiblePoints[i + 1].visible) {
                        point1 = getCoordinate(
                            visiblePoints[i + 1].xValue, stackedvalue.startValues[i + 1],
                            xAxis, yAxis, isInverted, series
                        );
                        lineDirection = lineDirection.concat('M' + ' ' + (point1.x) + ' ' + (point1.y) + ' ');
                    }
                    startPoint = i + 1;
                }
            }
        }
        if (series.chart.chartAreaType === 'PolarRadar' && visiblePoints.length > 1) {
            point1 = { 'x': series.points[0].xValue, 'y': stackedvalue.endValues[0] };
            point2 = getCoordinate(point1.x, point1.y, xAxis, yAxis, isInverted, series);
            lineDirection += ('L' + ' ' + (point2.x) + ' ' + (point2.y) + ' ');
        }
        for (let j: number = pointsLength - 1; j >= startPoint; j--) {
            let previousSeries: Series = this.getPreviousSeries(series);
            if (previousSeries.emptyPointSettings.mode !== 'Drop' || !previousSeries.points[j].isEmpty) {
                point2 = getCoordinate(visiblePoints[j].xValue, stackedvalue.startValues[j], xAxis, yAxis, isInverted, series);
                lineDirection = lineDirection.concat(((j === (pointsLength - 1) && polarAreaType) ? 'M' : 'L')
                    + ' ' + (point2.x) + ' ' + (point2.y) + ' ');
            }
        }
        options = new PathOption(
            series.chart.element.id + '_Series_' + series.index, series.interior, series.border.width, series.border.color,
            series.opacity, series.dashArray, lineDirection);
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
     * To destroy the stacking area. 
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
        return 'StackingAreaSeries';
    }
    /**
     * To find previous visible series
     */
    private getPreviousSeries(series: Series): Series {
        let seriesCollection: Series[] = series.chart.visibleSeries;
        for (let i: number = 0, length: number = seriesCollection.length; i < length; i++) {
            if (series.index === seriesCollection[i].index && i !== 0) {
                return seriesCollection[i - 1];
            }
        }
        return seriesCollection[0];
    }

}
