/* eslint-disable jsdoc/require-returns */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable valid-jsdoc */
/* eslint-disable jsdoc/require-param */
import { ChartLocation, StackValues, getPoint, withInRange, TransformToVisible } from '../../common/utils/helper';
import { PathOption, Rect } from '@syncfusion/ej2-svg-base';
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
     *
     * @returns {void}
     * @private
     */
    public render(series: Series, xAxis: Axis, yAxis: Axis, isInverted: boolean): void {
        const polarAreaType: boolean = series.chart.chartAreaType === 'PolarRadar';
        const getCoordinate: Function = polarAreaType ? TransformToVisible : getPoint;
        let lineDirection: string = '';
        const visiblePoints: Points[] = this.enableComplexProperty(series);
        const pointsLength: number = visiblePoints.length;
        const stackedvalue: StackValues = series.stackedValues;
        const origin: number = polarAreaType ?
            Math.max(series.yAxis.visibleRange.min, stackedvalue.endValues[0]) :
            Math.max(series.yAxis.visibleRange.min, stackedvalue.startValues[0]);
        let startPoint: number = 0;
        let point1: ChartLocation;
        let point2: ChartLocation;
        if (pointsLength > 0) {
            point1 = getCoordinate(visiblePoints[0].xValue, origin, xAxis, yAxis, isInverted, series);
            lineDirection = lineDirection.concat('M' + ' ' + (point1.x) + ' ' + (point1.y) + ' ');
        }
        const isPolar: boolean = (series.chart && series.chart.chartAreaType === 'PolarRadar');
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
                if (!isPolar && series.emptyPointSettings.mode !== 'Drop') {
                    for (let j: number = i - 1; j >= startPoint; j--) {
                        point2 = getCoordinate(visiblePoints[j].xValue, stackedvalue.startValues[j], xAxis, yAxis, isInverted, series);
                        lineDirection = lineDirection.concat('L' + ' ' + (point2.x) + ' ' + (point2.y) + ' ');
                    }
                    if (visiblePoints[i + 1] && (visiblePoints[i + 1].visible &&
                        (!isPolar || (isPolar && this.withinYRange(visiblePoints[i + 1], yAxis))))) {
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
            const connectPoints: { first: Points, last: Points } = this.getFirstLastVisiblePoint(series.points);
            const chart: Chart = this.chart;
            point1 = { 'x': connectPoints.first.xValue, 'y': stackedvalue.endValues[connectPoints.first.index] };
            point2 = getCoordinate(point1.x, point1.y, xAxis, yAxis, isInverted, series);
            lineDirection += ('L' + ' ' + (point2.x) + ' ' + (point2.y) + ' ');
            if (this.chart.visible === 1 && (xAxis.isInversed || yAxis.isInversed)) {
                this.chart.enableAnimation = false;
                lineDirection = (series.type === 'Polar' ? chart.polarSeriesModule.getPolarIsInversedPath(xAxis, lineDirection) :
                    chart.radarSeriesModule.getRadarIsInversedPath(xAxis, lineDirection));
            }
        }
        if (!isPolar || (isPolar && series.index !== this.getFirstSeriesIndex(series.chart.visibleSeries))) {
            for (let j: number = pointsLength - 1; j >= startPoint; j--) {
                if (isPolar && !visiblePoints[j].visible) {
                    continue;
                }
                const previousSeries: Series = this.getPreviousSeries(series);
                if (previousSeries.emptyPointSettings.mode !== 'Drop' || !previousSeries.points[j].isEmpty) {
                    point2 = getCoordinate(visiblePoints[j].xValue, stackedvalue.startValues[j], xAxis, yAxis, isInverted, series);
                    if (stackedvalue.startValues[j] === stackedvalue.endValues[j]) {
                        point2.y = Math.floor(point2.y);
                     }
                    lineDirection = lineDirection.concat(((j === (pointsLength - 1) && polarAreaType) ? 'M' : 'L')
                        + ' ' + (point2.x) + ' ' + (point2.y) + ' ');
                }
            }
        }
        const options: PathOption = new PathOption(
            series.chart.element.id + '_Series_' + series.index, series.interior, series.border.width, series.border.color,
            series.opacity, series.dashArray, lineDirection);
        this.appendLinePath(options, series, '');
        this.renderMarker(series);
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
    /**
     * To destroy the stacking area.
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
        const seriesCollection: Series[] = series.chart.visibleSeries;
        for (let i: number = 0, length: number = seriesCollection.length; i < length; i++) {
            if (series.index === seriesCollection[i].index && i !== 0) {
                return seriesCollection[i - 1];
            }
        }
        return seriesCollection[0];
    }
    /**
     * To find the first visible series index
     *
     * @param {Series[]} seriesCollection first visible series index
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
