/* eslint-disable valid-jsdoc */
/* eslint-disable jsdoc/require-param */
import { getPoint, withInRange, ChartLocation } from '../../common/utils/helper';
import { PathOption } from '@syncfusion/ej2-svg-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
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
     *
     * @returns {void}
     * @private
     */
    public render(series: Series, xAxis: Axis, yAxis: Axis, isInverted: boolean): void {
        let firstPoint: ChartLocation;
        let startPoint: ChartLocation = null;
        let direction: string = '';
        const origin: number = Math.max(<number>series.yAxis.visibleRange.min, 0);
        const options: PathOption[] = [];
        let startRegion: ChartLocation;
        let previous: Points;
        let rendered: boolean;
        const segments: ChartSegmentModel[] = this.sortSegments(series, series.segments);
        let emptyPointDirection:  string = '';
        series.visiblePoints.map((point: Points, i: number, seriesPoints: Points[]) => {
            point.symbolLocations = [];
            point.regions = [];
            rendered = false;
            if (point.visible && withInRange(seriesPoints[i - 1], point, seriesPoints[i + 1], series)) {
                direction += this.getAreaPathDirection(
                    point.xValue, origin, series, isInverted, getPoint, startPoint, 'M'
                );
                startPoint = startPoint || new ChartLocation(point.xValue, origin);
                firstPoint = getPoint(point.xValue, point.yValue, xAxis, yAxis, isInverted);
                if (previous && this.setPointColor(point, previous, series, series.segmentAxis === 'X', segments)) {
                    rendered = true;
                    startRegion = getPoint(startPoint.x, origin, xAxis, yAxis, isInverted);
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
        if (!isNullOrUndefined(rendered) && !rendered) {
            direction = series.points.length > 1 ?
                (direction + this.getAreaPathDirection(previous.xValue, origin, series, isInverted, getPoint, null, 'L')) : '';
            this.generatePathOption(options, series, previous, direction, '');
        }
        if (series.border.width !== 0) {
            emptyPointDirection = this.removeEmptyPointsBorder(this.getBorderDirection(direction));
            this.generateBorderPathOption(options, series, previous, emptyPointDirection, '');
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
            series.setPointColor(point, series.interior), 0, 'transparent', series.opacity,
            series.dashArray, direction
        ));
    }

    /**
     * To draw border for the path directions of area
     */
    private generateBorderPathOption(
        options: PathOption[], series: Series, point: Points, emptyPointDirection: string, id: string
    ): void {
        options.push(new PathOption(
            series.chart.element.id + '_Series_border_' + series.index + id,
            'transparent', series.border.width, series.border.color ? series.border.color : series.interior, 1,
            series.dashArray, emptyPointDirection
        ));

    }

    /**
     * To destroy the area series.
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
     *
     * @param  {Series} series - Defines the series to animate.
     * @returns {void}
     */

    public doAnimation(series: Series): void {
        this.doLinearAnimation(series, series.animation);
    }

}
