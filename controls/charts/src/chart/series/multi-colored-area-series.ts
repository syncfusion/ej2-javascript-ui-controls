import { getPoint, withInRange, ChartLocation, PathOption } from '../../common/utils/helper';
import { Chart } from '../chart';
import { Series, Points } from './chart-series';
import { Axis } from '../../chart/axis/axis';
import { MultiColoredSeries } from './multi-colored-base';
import { ChartSegmentModel } from './chart-series-model';

/**
 * `MultiColoredAreaSeries` module used to render the area series with multi color.
 */

export class MultiColoredAreaSeries extends MultiColoredSeries {

    /**
     * Render Area series.
     * @return {void}
     * @private
     */
    public render(series: Series, xAxis: Axis, yAxis: Axis, isInverted: boolean): void {
        let firstPoint: ChartLocation;
        let startPoint: ChartLocation = null;
        let direction: string = '';
        let origin: number = Math.max(<number>series.yAxis.visibleRange.min, 0);
        let options: PathOption[] = [];
        let startRegion: ChartLocation;
        let previous: Points;
        let rendered: boolean;
        let segments : ChartSegmentModel[] = this.sortSegments(series, series.segments);
        series.points.map((point: Points, i: number, seriesPoints: Points[]) => {
            point.symbolLocations = [];
            point.regions = [];
            rendered = false;
            if (point.visible && withInRange(seriesPoints[i - 1], point, seriesPoints[i + 1], series)) {
                direction += this.getAreaPathDirection(
                    point.xValue, origin, series, isInverted, getPoint, startPoint, 'M'
                );
                startPoint = startPoint || new ChartLocation(point.xValue, origin);
                firstPoint = getPoint(point.xValue, point.yValue, xAxis, yAxis, isInverted, series);
                if (previous && this.setPointColor(point, previous, series, series.segmentAxis === 'X', segments)) {
                    rendered = true;
                    startRegion = getPoint(startPoint.x, origin, xAxis, yAxis, isInverted, series);
                    direction += ('L' + ' ' + (firstPoint.x) + ' ' + (firstPoint.y) + ' ');
                    direction += ('L' + ' ' + (firstPoint.x) + ' ' + (startRegion.y) + ' ');
                    this.generatePathOption(options, series, previous, direction, '_Point_' + previous.index);
                    direction = 'M' + ' ' + (firstPoint.x) + ' ' + (startRegion.y) + ' ' + 'L' + ' ' +
                        (firstPoint.x) + ' ' + (firstPoint.y) + ' ';
                } else {
                    direction += ('L' + ' ' + (firstPoint.x) + ' ' + (firstPoint.y) + ' ');
                    this.setPointColor(point, null, series, series.segmentAxis === 'X', segments);
                }
                if (seriesPoints[i + 1] && !seriesPoints[i + 1].visible && series.emptyPointSettings.mode !== 'Drop') {
                    direction += this.getAreaEmptyDirection(
                        { 'x': point.xValue, 'y': origin },
                        startPoint, series, isInverted, getPoint
                    );
                    startPoint = null;
                }
                previous = point;
                this.storePointLocation(point, series, isInverted, getPoint);
            }
        });
        if (!rendered) {
            direction = series.points.length > 1 ?
                (direction + this.getAreaPathDirection(previous.xValue, origin, series, isInverted, getPoint, null, 'L')) : '';
            this.generatePathOption(options, series, previous, direction, '');
        }
        this.applySegmentAxis(series, options, segments);
        this.renderMarker(series);
    }
    /**
     * To Store the path directions of the area
     */
    private generatePathOption(
        options: PathOption[], series: Series, point: Points, direction: string, id: string
    ): void {
        options.push(new PathOption(
            series.chart.element.id + '_Series_' + series.index + id,
            series.setPointColor(point, series.interior), series.border.width, series.border.color, series.opacity,
            series.dashArray, direction
        ));
    }

    /**
     * To destroy the area series.
     * @return {void}
     * @private
     */

    public destroy(chart: Chart): void {
        /**
         * Destroy method calling here
         */
    }

    /**
     * Get module name
     */

    protected getModuleName(): string {
        /**
         * Returns the module name of the series
         */
        return 'MultiColoredAreaSeries';
    }

    /**
     * Animates the series.
     * @param  {Series} series - Defines the series to animate.
     * @return {void}
     */

    public doAnimation(series: Series): void {
        this.doLinearAnimation(series, series.animation);
    }

}