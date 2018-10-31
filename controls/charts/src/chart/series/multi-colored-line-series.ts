import { withInRange, getPoint, PathOption } from '../../common/utils/helper';
import { Chart } from '../chart';
import { Series, Points } from './chart-series';
import { Axis } from '../../chart/axis/axis';
import { MultiColoredSeries } from './multi-colored-base';
import { ChartSegmentModel } from './chart-series-model';

/**
 * `MultiColoredLineSeries` used to render the line series with multi color.
 */

export class MultiColoredLineSeries extends MultiColoredSeries {
    /**
     * Render Line Series.
     * @return {void}.
     * @private
     */
    public render(series: Series, xAxis: Axis, yAxis: Axis, isInverted: boolean): void {
        let previous: Points = null;
        let startPoint: string = 'M';
        let visiblePoints: Points[] = this.improveChartPerformance(series);
        let options: PathOption[] = [];
        let direction: string = '';
        let segments : ChartSegmentModel[] = this.sortSegments(series, series.segments);
        for (let point of visiblePoints) {
            point.regions = [];
            if (point.visible && withInRange(visiblePoints[point.index - 1], point, visiblePoints[point.index + 1], series)) {
                direction += this.getLineDirection(previous, point, series, isInverted, getPoint, startPoint);
                if (previous != null) {
                   if (this.setPointColor(point, previous, series, series.segmentAxis === 'X', segments)) {
                        options.push(new PathOption(
                            series.chart.element.id + '_Series_' + series.index + '_Point_' + previous.index,
                            'none', series.width, series.setPointColor(previous, series.interior),
                            series.opacity, series.dashArray, direction
                        ));
                        startPoint = 'M';
                        direction = '';
                    } else {
                        startPoint = 'L';
                    }
                } else {
                    this.setPointColor(point, null, series, series.segmentAxis === 'X', segments);
                }
                previous = point;
                this.storePointLocation(point, series, isInverted, getPoint);
            } else {
                previous = (series.emptyPointSettings.mode === 'Drop') ? previous : null;
                startPoint = (series.emptyPointSettings.mode === 'Drop') ? startPoint : 'M';
                point.symbolLocations = [];
            }
        }
        if (direction !== '') {
            options.push(new PathOption(
                series.chart.element.id + '_Series_' + series.index,
                'none', series.width, series.setPointColor(visiblePoints[visiblePoints.length - 1], series.interior),
                series.opacity, series.dashArray, direction
            ));
        }
        this.applySegmentAxis(series, options, segments);
        this.renderMarker(series);
    }

    /**
     * Animates the series.
     * @param  {Series} series - Defines the series to animate.
     * @return {void}
     */

    public doAnimation(series: Series): void {
        this.doLinearAnimation(series, series.animation);
    }

    /**
     * Get module name.
     */

    protected getModuleName(): string {
        /**
         * Returns the module name of the series
         */
        return 'MultiColoredLineSeries';
    }

    /**
     * To destroy the line series. 
     * @return {void}
     * @private
     */

    public destroy(chart: Chart): void {
        /**
         * Destroy method performed here
         */
    }
}