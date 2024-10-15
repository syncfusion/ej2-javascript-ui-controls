import { ChartLocation, StackValues, getPoint, withInRange, TransformToVisible, animateAddPoints } from '../../common/utils/helper';
import { PathOption, Rect } from '@syncfusion/ej2-svg-base';
import { Chart } from '../chart';
import { Series, Points } from './chart-series';
import { LineBase } from './line-base';
import { AnimationModel } from '../../common/model/base-model';
import { Axis } from '../../chart/axis/axis';

/**
 * The `StackingAreaSeries` module is used to render the stacking area series.
 */

export class StackingAreaSeries extends LineBase {

    /**
     * Render the Stacking area series.
     *
     * @param {Series} series - The series to be rendered.
     * @param {Axis} xAxis - The x-axis of the chart.
     * @param {Axis} yAxis - The y-axis of the chart.
     * @param {boolean} isInverted - Specifies whether the chart is inverted.
     * @param {boolean} pointAnimate - Specifies whether the point has to be animated or not.
     * @param {boolean} pointUpdate - Specifies whether the point has to be updated or not.
     * @returns {void}
     * @private
     */
    public render(series: Series, xAxis: Axis, yAxis: Axis, isInverted: boolean, pointAnimate?: boolean, pointUpdate?: boolean): void {
        const polarAreaType: boolean = series.chart.chartAreaType === 'PolarRadar';
        const getCoordinate: Function = polarAreaType ? TransformToVisible : getPoint;
        let lineDirection: string = '';
        const visiblePoints: Points[] = this.enableComplexProperty(series);
        const pointsLength: number = visiblePoints.length;
        const stackedvalue: StackValues = series.stackedValues;
        let pointIndex: number; let nextPointIndex: number;
        const origin: number = polarAreaType ?
            Math.max(series.yAxis.visibleRange.min, stackedvalue.endValues[0]) :
            Math.max(series.yAxis.visibleRange.min, stackedvalue.startValues[0]);
        let startPoint: number = 0;
        let point1: ChartLocation;
        let point2: ChartLocation;
        let emptyPointDirection:  string = '';
        if (pointsLength > 0) {
            point1 = getCoordinate(visiblePoints[0].xValue, origin, xAxis, yAxis, isInverted, series);
            lineDirection = lineDirection.concat('M' + ' ' + (point1.x) + ' ' + (point1.y) + ' ');
        }
        const isPolar: boolean = (series.chart && series.chart.chartAreaType === 'PolarRadar');
        let index: number;
        for (let i: number = series.index; i >= 0; i--) {
            if (series.chart.visibleSeries[i as number].visible) {
                index = series.chart.visibleSeries[i as number].index;
                break;
            }
        }
        for (let i: number = 0; i < pointsLength; i++) {
            pointIndex = visiblePoints[i as number].index;
            visiblePoints[i as number].symbolLocations = []; visiblePoints[i as number].regions = [];
            if (visiblePoints[i as number].visible && withInRange(visiblePoints[i - 1], visiblePoints[i as number],
                                                                  visiblePoints[i + 1], series)) {
                const startvalue: number = series.index > 0 && index !== undefined ?
                    this.chart.visibleSeries[index as number].stackedValues.endValues[pointIndex as number] :
                    stackedvalue.startValues[pointIndex as number];
                point1 = getCoordinate(
                    visiblePoints[i as number].xValue, (!series.visible && series.isLegendClicked) ? startvalue :
                        stackedvalue.endValues[pointIndex as number], xAxis, yAxis, isInverted, series
                );
                lineDirection = lineDirection.concat('L' + ' ' + (point1.x) + ' ' + (point1.y) + ' ');
                visiblePoints[i as number].symbolLocations.push(
                    getCoordinate(
                        visiblePoints[i as number].xValue, stackedvalue.endValues[pointIndex as number], xAxis, yAxis,
                        isInverted, series
                    )
                );
                visiblePoints[i as number].regions.push(new Rect(
                    visiblePoints[i as number].symbolLocations[0].x - series.marker.width,
                    visiblePoints[i as number].symbolLocations[0].y - series.marker.height,
                    2 * series.marker.width, 2 * series.marker.height
                ));
            } else {
                if (!isPolar && series.emptyPointSettings.mode !== 'Drop') {
                    for (let j: number = i - 1; j >= startPoint; j--) {
                        pointIndex = visiblePoints[j as number].index;
                        point2 = getCoordinate(visiblePoints[j as number].xValue, stackedvalue.startValues[pointIndex as number],
                                               xAxis, yAxis, isInverted, series);
                        lineDirection = lineDirection.concat('L' + ' ' + (point2.x) + ' ' + (point2.y) + ' ');
                    }
                    if (visiblePoints[i + 1] && (visiblePoints[i + 1].visible &&
                        (!isPolar || (isPolar && this.withinYRange(visiblePoints[i + 1], yAxis))))) {
                        nextPointIndex = visiblePoints[i + 1].index;
                        point1 = getCoordinate(
                            visiblePoints[i + 1].xValue, stackedvalue.startValues[nextPointIndex as number],
                            xAxis, yAxis, isInverted, series
                        );
                        lineDirection = lineDirection.concat('M' + ' ' + (point1.x) + ' ' + (point1.y) + ' ');
                    }
                    startPoint = i + 1;
                }
            }
        }

        if (series.chart.chartAreaType === 'PolarRadar' && visiblePoints.length > 1) {
            const connectPoints: { first: Points, last: Points } = this.getFirstLastVisiblePoint(series.points);
            const chart: Chart = this.chart;
            point1 = { 'x': connectPoints.first.xValue, 'y': stackedvalue.endValues[connectPoints.first.index] };
            point2 = getCoordinate(point1.x, point1.y, xAxis, yAxis, isInverted, series);
            lineDirection += ('L' + ' ' + (point2.x) + ' ' + (point2.y) + ' ');
            if (this.chart.visible === 1 && (xAxis.isAxisInverse || yAxis.isAxisInverse)) {
                this.chart.enableAnimation = false;
                lineDirection = (series.type === 'Polar' ? chart.polarSeriesModule.getPolarIsInversedPath(xAxis, lineDirection) :
                    chart.radarSeriesModule.getRadarIsInversedPath(xAxis, lineDirection));
            }
        }
        if (!isPolar || (isPolar && series.index !== this.getFirstSeriesIndex(series.chart.visibleSeries))) {
            for (let j: number = pointsLength - 1; j >= startPoint; j--) {
                pointIndex = visiblePoints[j as number].index;
                if (isPolar && !visiblePoints[j as number].visible) {
                    continue;
                }
                const previousSeries: Series = this.getPreviousSeries(series);
                if (previousSeries.emptyPointSettings.mode !== 'Drop' || !previousSeries.points[j as number].isEmpty) {
                    point2 = getCoordinate(visiblePoints[j as number].xValue, (!series.visible && series.isLegendClicked && series.index > 0
                        && index !== undefined) ? this.chart.visibleSeries[index as number].stackedValues.endValues[pointIndex as number]
                        : stackedvalue.startValues[pointIndex as number], xAxis, yAxis, isInverted, series);
                    if (stackedvalue.startValues[pointIndex as number] === stackedvalue.endValues[pointIndex as number]) {
                        point2.y = Math.floor(point2.y);
                    }
                    lineDirection = lineDirection.concat(((j === (pointsLength - 1) && polarAreaType) ? 'M' : 'L')
                        + ' ' + (point2.x) + ' ' + (point2.y) + ' ');
                }
            }
        }
        const options: PathOption = new PathOption(
            series.chart.element.id + '_Series_' + series.index, series.interior, 0, 'transparent',
            series.opacity, series.dashArray, lineDirection);
        this[pointAnimate ? 'addAreaPath' : 'appendLinePath'](options, series, '');

        /**
         * To draw border for the path directions of area
         */
        if (series.border.width !== 0 && series.visible) {
            emptyPointDirection = this.removeEmptyPointsBorder(this.getBorderDirection(lineDirection));
            const options: PathOption = new PathOption(
                series.chart.element.id + '_Series_border_' + series.index, 'transparent', series.visible ? series.border.width : 0, series.border.color ? series.border.color : series.interior,
                1, series.border.dashArray, emptyPointDirection);
            this[pointAnimate ? 'addAreaPath' : 'appendLinePath'](options, series, '');
        }
        if (!pointUpdate && series.visible) { this.renderMarker(series); }
    }
    /**
     * To animate point for stacking area series.
     *
     * @param {Series} series - Specifies the series.
     * @param {number} point - Specifies the point.
     * @returns {void}
     * @private
     */
    public updateDirection(series: Series, point: number[]): void {
        for (let i: number = 0; i < series.xAxis.series.length; i++) {
            const stackSeries: Series = series.xAxis.series[i as number];
            this.render(stackSeries, stackSeries.xAxis, stackSeries.yAxis, stackSeries.chart.requireInvertedAxis, false, true);
            for (let j: number = 0; j < point.length; j++) {
                if (stackSeries.marker && stackSeries.marker.visible) {
                    stackSeries.chart.markerRender.renderMarker(stackSeries, stackSeries.points[point[j as number]],
                                                                stackSeries.points[point[j as number]].symbolLocations[0], null, true);
                }
                if (stackSeries.marker.dataLabel.visible && stackSeries.chart.dataLabelModule) {
                    stackSeries.chart.dataLabelModule.commonId = stackSeries.chart.element.id + '_Series_' + stackSeries.index + '_Point_';
                    stackSeries.chart.dataLabelModule.
                        renderDataLabel(stackSeries, stackSeries.points[point[j as number]],
                                        null, stackSeries.marker.dataLabel);
                }
            }
        }
    }
    /**
     * Adds a area path to equate the start and end paths.
     *
     * @param {PathOption} options - The options for the path.
     * @param {Series} series - The series to which the path belongs.
     * @param {string} clipRect - The clip rectangle for the path.
     * @returns {void}
     * @private
     */
    public addAreaPath(options: PathOption, series: Series, clipRect: string): void {
        const points: { element: Element; previousDirection: string; } =
            this.appendPathElement(options, series, clipRect);
        if (points.previousDirection !== '' && options.d !== '') {
            const startPathCommands: string[] = points.previousDirection.match(/[MLHVCSQTAZ][^MLHVCSQTAZ]*/g);
            const endPathCommands: string[] = (options.d).match(/[MLHVCSQTAZ][^MLHVCSQTAZ]*/g);
            const maxLength: number = Math.max(startPathCommands.length, endPathCommands.length);
            const minLength: number = Math.min(startPathCommands.length, endPathCommands.length);
            if (startPathCommands.length < endPathCommands.length) {
                for (let i: number = startPathCommands.length; i < endPathCommands.length; i++) {
                    if (endPathCommands.length !== startPathCommands.length) {
                        startPathCommands.splice((startPathCommands.length + 1) / 2, 0,
                                                 startPathCommands.slice((startPathCommands.length - 1) / 2)[0],
                                                 startPathCommands.slice((startPathCommands.length - 1) / 2)[1]);
                    }
                }
                animateAddPoints(points.element, options.d, series.chart.redraw, startPathCommands.join(' '), this.chart.duration);
            } else if (startPathCommands.length > endPathCommands.length) {
                for (let i: number = minLength; i < maxLength; i++) {
                    if (endPathCommands.length !== startPathCommands.length) {
                        endPathCommands.splice(1, 0, endPathCommands[1]);
                        endPathCommands.splice(endPathCommands.length - 1, 0, endPathCommands[endPathCommands.length - 1]);
                    }
                }
                animateAddPoints(points.element, endPathCommands.join(''), series.chart.redraw, points.previousDirection, this.chart.duration, options.d);
            }
            else {
                animateAddPoints(points.element, options.d, series.chart.redraw, points.previousDirection, this.chart.duration);
            }
        }
    }
    /**
     * Animates the series.
     *
     * @param  {Series} series - Defines the series to animate.
     * @returns {void}
     * @private
     */
    public doAnimation(series: Series): void {
        const option: AnimationModel = series.animation;
        this.doLinearAnimation(series, option);
    }
    /**
     * To destroy the stacking area.
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
        return 'StackingAreaSeries';
    }
    /**
     * Retrieves the previous series from the provided series.
     *
     * @param {Series} series - The current series.
     * @returns {Series} - The previous series.
     */
    private getPreviousSeries(series: Series): Series {
        const seriesCollection: Series[] = series.chart.visibleSeries;
        for (let i: number = 0, length: number = seriesCollection.length; i < length; i++) {
            if (series.index === seriesCollection[i as number].index && i !== 0) {
                return seriesCollection[i - 1];
            }
        }
        return seriesCollection[0];
    }
    /**
     * To find the first visible series index.
     *
     * @param {Series[]} seriesCollection - The first visible series index.
     * @returns {number} - Returns the first visible series index.
     */
    private getFirstSeriesIndex(seriesCollection: Series[]): number {
        for (const series of seriesCollection) {
            if (series.visible) {
                return series.index;
            }
        }
        return 0;
    }

}
