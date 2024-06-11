import { getPoint, withInRange, ChartLocation, TransformToVisible } from '../../common/utils/helper';
import { PathOption } from '@syncfusion/ej2-svg-base';
import { Chart } from '../chart';
import { Series, Points } from './chart-series';
import { AnimationModel } from '../../common/model/base-model';
import { Axis } from '../../chart/axis/axis';
import { MultiColoredSeries } from './multi-colored-base';

/**
 * `AreaSeries` module is used to render the area series.
 */
export class AreaSeries extends MultiColoredSeries {

    /**
     * Renders the area series on the chart.
     *
     * @param {Series} series - The series to be rendered.
     * @param {Axis} xAxis - The X-axis associated with the series.
     * @param {Axis} yAxis - The Y-axis associated with the series.
     * @param {boolean} isInverted - Indicates whether the chart is inverted or not.
     * @param {boolean} pointAnimate - Specifies whether the point has to be animated or not.
     * @param {boolean} pointUpdate - Specifies whether the point has to be updated or not.
     * @returns {void}
     * @private
     */
    public render(series: Series, xAxis: Axis, yAxis: Axis, isInverted: boolean, pointAnimate?: boolean, pointUpdate?: boolean): void {
        let startPoint: ChartLocation = null;
        let direction: string = '';
        const isPolar: boolean = (series.chart && series.chart.chartAreaType === 'PolarRadar');
        let origin: number = Math.max(<number>series.yAxis.visibleRange.min, 0);
        if (isPolar) {
            const connectPoints: { first: Points, last: Points } = this.getFirstLastVisiblePoint(series.points);
            origin = connectPoints.first.yValue;
        }
        let currentXValue: number;
        const isDropMode: boolean = (series.emptyPointSettings && series.emptyPointSettings.mode === 'Drop');
        const borderWidth: number = series.border.width ? series.border.width : 0;
        const borderColor: string = series.border.color ? series.border.color : series.interior;
        const getCoordinate: Function = series.chart.chartAreaType === 'PolarRadar' ? TransformToVisible : getPoint;
        const visiblePoints: Points[] = this.enableComplexProperty(series);
        let point: Points;
        let emptyPointDirection:  string = '';
        for (let i: number = 0; i < visiblePoints.length; i++) {
            point = visiblePoints[i as number];
            currentXValue = point.xValue;
            point.symbolLocations = [];
            point.regions = [];
            if (point.visible && withInRange(visiblePoints[i - 1], point, visiblePoints[i + 1], series)) {
                direction += this.getAreaPathDirection(
                    currentXValue, origin, series, isInverted, getCoordinate, startPoint,
                    'M'
                );
                startPoint = startPoint || new ChartLocation(currentXValue, origin);
                // First Point to draw the area path
                direction += this.getAreaPathDirection(
                    currentXValue, point.yValue, series, isInverted, getCoordinate, null,
                    'L'
                );
                if (visiblePoints[i + 1] && (!visiblePoints[i + 1].visible &&
                    (!isPolar || (isPolar && this.withinYRange(visiblePoints[i + 1], yAxis)))) && !isDropMode) {
                    direction += this.getAreaEmptyDirection(
                        { 'x': currentXValue, 'y': origin },
                        startPoint, series, isInverted, getCoordinate
                    );
                    startPoint = null;
                }
                this.storePointLocation(point, series, isInverted, getCoordinate);
            }
        }
        if (isPolar && direction !== '') {
            let endPoint: string = '';
            const chart: Chart = this.chart;
            endPoint += this.getAreaPathDirection(0, origin, series, isInverted, getCoordinate, null, 'L');
            if (xAxis.isAxisInverse || yAxis.isAxisInverse) {
                direction += (series.type === 'Polar' ? chart.polarSeriesModule.getPolarIsInversedPath(xAxis, endPoint) :
                    chart.radarSeriesModule.getRadarIsInversedPath(xAxis, endPoint));
            }
            direction = direction.concat(direction + ' ' + 'Z');
        }

        this[pointAnimate ? 'addAreaPath' : 'appendLinePath'](
            new PathOption(
                series.chart.element.id + '_Series_' + series.index, series.interior,
                0, 'transparent', series.opacity, series.dashArray,
                ((direction !== '') ? (direction + this.getAreaPathDirection(
                    series.points[series.points.length - 1].xValue,
                    series.chart.chartAreaType === 'PolarRadar' ?
                        series.points[series.points.length - 1].yValue : origin,
                    series, isInverted, getCoordinate, null, 'L'
                )) : '')
            ),
            series, ''
        );

        /**
         * To draw border for the path directions of area
         */
        if (series.border.width !== 0) {
            emptyPointDirection = this.removeEmptyPointsBorder(direction);
            this[pointAnimate ? 'addAreaPath' : 'appendLinePath'](
                new PathOption(
                    series.chart.element.id + '_Series_border_' + series.index, 'transparent',
                    borderWidth, borderColor, 1, series.dashArray,
                    emptyPointDirection
                ),
                series, ''
            );

        }
        if (!pointUpdate) {this.renderMarker(series); }

    }

    /**
     * To animate point for area series.
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
        return 'AreaSeries';
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

}
