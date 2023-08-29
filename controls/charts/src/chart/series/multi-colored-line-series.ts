/* eslint-disable valid-jsdoc */
/* eslint-disable jsdoc/require-param */
import { withInRange, getPoint } from '../../common/utils/helper';
import { PathOption } from '@syncfusion/ej2-svg-base';
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
     *
     * @returns {void}
     * @private
     */
    public render(series: Series, xAxis: Axis, yAxis: Axis, isInverted: boolean): void {
        let previous: Points = null;
        let startPoint: string = 'M';
        const visiblePoints: Points[] = this.enableComplexProperty(series);
        const options: PathOption[] = [];
        let direction: string = '';
        let lastPoint: Points;
        let segmentPoint: Points = null;
        const segments : ChartSegmentModel[] = this.sortSegments(series, series.segments);
        for (const point of visiblePoints) {
            point.regions = [];
            if (point.visible && withInRange(visiblePoints[point.index - 1], point, visiblePoints[point.index + 1], series)) {
                lastPoint = point;
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
                    if (this.setPointColor(point, segmentPoint, series, series.segmentAxis === 'X', segments) && direction !== '') {
                        options.push(new PathOption(series.chart.element.id + '_Series_' + series.index + '_Point_' + segmentPoint.index,
                            'none', series.width, series.setPointColor(segmentPoint, series.interior), series.opacity, series.dashArray, direction));
                        startPoint = 'M';
                        direction = '';
                    }
                }
                previous = point; 
                segmentPoint = point;
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
                'none', series.width, series.setPointColor(lastPoint, series.interior),
                series.opacity, series.dashArray, direction
            ));
        }
        this.applySegmentAxis(series, options, segments);
        this.renderMarker(series);
    }

    /**
     * Animates the series.
     *
     * @param  {Series} series - Defines the series to animate.
     * @returns {void}
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
     *
     * @returns {void}
     * @private
     */

    public destroy(): void {
        /**
         * Destroy method performed here
         */
    }
}
