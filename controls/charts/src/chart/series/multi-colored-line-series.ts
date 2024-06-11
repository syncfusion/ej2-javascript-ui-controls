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
     * Render the multi colored line series on the chart.
     *
     * @param {Series} series - The series to be rendered.
     * @param {Axis} xAxis - The x-axis of the chart.
     * @param {Axis} yAxis - The y-axis of the chart.
     * @param {boolean} isInverted - Indicates whether the chart is inverted.
     * @param {boolean} pointAnimate - Specifies whether the point has to be animated or not.
     * @param {boolean} pointUpdate - Specifies whether the point has to be updated or not.
     * @returns {void}
     */
    public render(series: Series, xAxis: Axis, yAxis: Axis, isInverted: boolean, pointAnimate?: boolean, pointUpdate?: boolean): void {
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
        this.applySegmentAxis(series, options, segments, pointAnimate);
        if (!pointUpdate) { this.renderMarker(series); }
    }

    /**
     * To animate point for multicolored line series.
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
                const dataLabelElement: Element[] = series.chart.dataLabelModule.renderDataLabel(series, series.points[point[i as number]],
                                                                                                 null, series.marker.dataLabel);
                for (let j: number = 0; j < dataLabelElement.length; j++) {
                    series.chart.dataLabelModule.doDataLabelAnimation(series, dataLabelElement[j as number]);
                }
            }
        }
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
     *
     * @returns {string} - Returns the module name.
     */
    protected getModuleName(): string {
        /**
         * Returns the module name of the series.
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
         * Destroy method performed here.
         */
    }
}
