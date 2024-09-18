import { getPoint, withInRange, ChartLocation } from '../../common/utils/helper';
import { PathOption } from '@syncfusion/ej2-svg-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { Series, Points } from './chart-series';
import { Axis } from '../../chart/axis/axis';
import { MultiColoredSeries } from './multi-colored-base';
import { ChartSegmentModel } from './chart-series-model';

/**
 * The `MultiColoredAreaSeries` module is used to render area series with multiple colors.
 */

export class MultiColoredAreaSeries extends MultiColoredSeries {

    /**
     * Render the multi colored area series on the chart.
     *
     * @param {Series} series - The series to be rendered.
     * @param {Axis} xAxis - The X-axis associated with the series.
     * @param {Axis} yAxis - The Y-axis associated with the series.
     * @param {boolean} isInverted - Specifies whether the chart is inverted or not.
     * @param {boolean} pointAnimate - Specifies whether the point has to be animated or not.
     * @param {boolean} pointUpdate - Specifies whether the point has to be updated or not.
     * @returns {void}
     * @private
     */
    public render(series: Series, xAxis: Axis, yAxis: Axis, isInverted: boolean, pointAnimate?: boolean, pointUpdate?: boolean): void {
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
        const visiblePoints: Points[] = this.enableComplexProperty(series);
        visiblePoints.map((point: Points, i: number, seriesPoints: Points[]) => {
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
        this.applySegmentAxis(series, options, segments, pointAnimate);
        if (!pointUpdate) {this.renderMarker(series); }
    }
    /**
     * Generate path options for rendering series elements.
     *
     * @param {PathOption[]} options - The array of path options to be updated.
     * @param {Series} series - The series associated with the path options.
     * @param {Points} point - The point associated with the path options.
     * @param {string} direction - The direction of the path options.
     * @param {string} id - The id associated with the path options.
     * @returns {void}
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
     * Generate path options for rendering series border elements.
     *
     * @param {PathOption[]} options - The array of path options to be updated.
     * @param {Series} series - The series associated with the path options.
     * @param {Points} point - The point associated with the path options.
     * @param {string} emptyPointDirection - The direction of the empty point.
     * @param {string} id - The ID associated with the path options.
     * @returns {void}
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
     * To animate point for multicolored area series.
     *
     * @param {Series} series - Specifies the series.
     * @param {number} point - Specifies the point.
     * @returns {void}
     * @private
     */
    public updateDirection(series: Series, point: number[]): void {
        this.render(series, series.xAxis, series.yAxis, series.chart.requireInvertedAxis, false, true);
        for (let i: number = 0; i < point.length; i++) {
            if (series.marker && series.marker.visible) {
                series.chart.markerRender.renderMarker(series, series.points[point[i as number]],
                                                       series.points[point[i as number]].symbolLocations[0], null, true);
            }
            if (series.marker.dataLabel.visible && series.chart.dataLabelModule) {
                series.chart.dataLabelModule.commonId = series.chart.element.id + '_Series_' + series.index + '_Point_';
                series.chart.dataLabelModule.renderDataLabel(series, series.points[point[i as number]],
                                                             null, series.marker.dataLabel);
            }
        }
    }
    /**
     * To destroy the area series.
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
        return 'MultiColoredAreaSeries';
    }

    /**
     * Animates the series.
     *
     * @param  {Series} series - Defines the series to animate.
     * @returns {void}
     * @private
     */
    public doAnimation(series: Series): void {
        this.doLinearAnimation(series, series.animation);
    }

}
