/**
 * Defines the common functionalities of accumulation series
 */
import { isNullOrUndefined, Animation, createElement, AnimationOptions } from '@syncfusion/ej2-base';
import { ChartLocation, degreeToLocation, getElement, indexFinder, linear } from '../../common/utils/helper';
import { Rect } from '@syncfusion/ej2-svg-base';
import { AccumulationChart } from '../accumulation';
import { AccPoints, pointByIndex, AccumulationSeries } from '../model/acc-base';
import { Index } from '../../chart';

/**
 * The `AccumulationBase` class is used to perform base calculations for accumulation charts.
 *
 * @private
 */
export class AccumulationBase {

    /** @private */

    constructor(accumulation: AccumulationChart) {
        this.accumulation = accumulation;
    }

    private pieCenter: ChartLocation;

    /**
     * Gets the center of the pie.
     *
     * @private
     * @returns {ChartLocation} - The center of the pie.
     */
    public get center(): ChartLocation {
        return this.pieCenter || (this.accumulation.visibleSeries[0].type === 'Pie' ?
            this.accumulation.pieSeriesModule.pieBaseCenter : null);
    }

    /**
     * Sets the center of the pie.
     *
     * @private
     * @param {ChartLocation} value - The center point to set.
     */
    public set center(value: ChartLocation) {
        this.pieCenter = value;
    }

    private pieRadius: number;
    /**
     * Gets the radius of the pie.
     *
     * @private
     * @returns {number} - The radius of the pie.
     */
    public get radius(): number {
        return this.pieRadius !== undefined ? this.pieRadius :
            this.accumulation.pieSeriesModule.pieBaseRadius;
    }

    /**
     * Sets the radius of the pie.
     *
     * @private
     * @param {number} value - The radius value to set.
     */
    public set radius(value: number) {
        this.pieRadius = value;
    }

    private pieLabelRadius: number;
    /**
     * Gets the label radius of the pie.
     *
     * @private
     * @returns {number} - The label radius of the pie.
     */
    public get labelRadius(): number {
        return this.pieLabelRadius !== undefined ? this.pieLabelRadius :
            this.accumulation.pieSeriesModule.pieBaseLabelRadius;
    }

    /**
     * Sets the label radius of the pie.
     *
     * @private
     * @param {number} value - The label radius value to set.
     */
    public set labelRadius(value: number) {
        this.pieLabelRadius = value;
    }

    /** @private */
    protected accumulation: AccumulationChart;

    /**
     * Checks whether the series is circular or not.
     *
     * @private
     * @returns {boolean} - True if the series is circular, otherwise false.
     */
    protected isCircular(): boolean {
        return this.accumulation.type === 'Pie';
    }

    /**
     * To check various radius pie.
     *
     * @private
     * @returns {boolean} - True if various radius is enabled, otherwise false.
     */
    protected isVariousRadius(): boolean {
        return this.accumulation.pieSeriesModule.isRadiusMapped;
    }

    /**
     * Determines whether the point at the given index is the first visible point of the series,
     * so it can act as the active series tab stop for keyboard navigation.
     *
     * @param {AccPoints[]} points - The points of the series.
     * @param {number} index - The index of the point being rendered.
     * @returns {boolean} - True when all earlier points are hidden and this point is the first visible one.
     * @private
     */
    protected isFirstVisiblePoint(points: AccPoints[], index: number): boolean {
        for (let i: number = 0; i < index; i++) {
            if (points[i as number].visible) {
                return false;
            }
        }
        return true;
    }

    /**
     * To process the explode on accumulation chart loading.
     *
     * @private
     * @param {Event} event - The event triggered during loading.
     * @returns {void}
     */
    public processExplode(event: Event): void {
        const indexes: Index = indexFinder((event.target as any).id, true);
        const seriesIndex: number = indexes.series;
        const pointIndex: number = indexes.point;

        if (isNaN(pointIndex)) { return null; }

        const series: AccumulationSeries = this.accumulation.visibleSeries[seriesIndex as number];
        if (!series) { return null; }

        // keep your datalabel-outside early return logic as-is, but use seriesIndex
        if (((event.target as any).id.indexOf('_datalabel_') > -1) &&
            series.points[pointIndex  as number] &&
            series.points[pointIndex  as number].labelPosition === 'Outside') {
            return null;
        }

        this.explodePoints(pointIndex, this.accumulation, undefined, undefined, seriesIndex);
        this.deExplodeAll(pointIndex, this.accumulation.enableAnimation ? 300 : 0, seriesIndex);
    }

    /**
     * To invoke the explode on accumulation chart loading.
     *
     * @param {number} seriesIndex - The series index for multi-series support.
     * @private
     * @returns {void}
     */
    public invokeExplode(seriesIndex: number = 0): void {
        const series: AccumulationSeries = this.accumulation.visibleSeries[seriesIndex as number];
        const duration: number = this.accumulation.enableAnimation ? 300 : 0;
        for (const point of series.points) {
            if (point.isExplode && point.y !== 0) {
                this.pointExplode(point.index, point, duration, undefined, undefined, seriesIndex);
            }
        }
        if (this.accumulation.accumulationSelectionModule && this.accumulation.selectionMode !== 'None' &&
            this.accumulation.accumulationSelectionModule.selectedDataIndexes.length) {
            for (const index of this.accumulation.accumulationSelectionModule.selectedDataIndexes) {
                this.explodePoints(index.point, this.accumulation, true, undefined, series.index);
                this.deExplodeAll(index.point, duration);
            }
        }
    }

    /**
     * To deExplode all points in the series.
     * In multi-series mode, de-explodes all matching points across series.
     *
     * @private
     * @param {number} index - The index of the point to explode.
     * @param {number} animationDuration - The duration of the animation.
     * @param {number} seriesIndex - The series index.
     * @returns {void}
     */
    public deExplodeAll(index: number, animationDuration: number, seriesIndex: number = 0): void {
        const pointId: string = this.accumulation.element.id + '_Series_' + seriesIndex + '_Point_';
        const points: AccPoints[] = this.accumulation.visibleSeries[seriesIndex as number].points;

        for (let i: number = 0, pointsArray: AccPoints[] = points; i < pointsArray.length; i++) {
            const currentPoint: AccPoints = points[i as number];
            if ((index !== currentPoint.index && !currentPoint.isSliced) || currentPoint.isClubbed) {
                currentPoint.isExplode = false;
                this.deExplodeSlice(currentPoint.index, pointId, animationDuration);
            }
        }


    }


    /**
     * To explode point by index.
     * In multi-series mode, explodes all matching points across series with same mappingKey.
     *
     * @private
     * @param {number} index - The index of the point to explode.
     * @param {AccumulationChart} chart - The accumulation chart control.
     * @param {boolean} explode - Specifies whether to explode the point (default: false).
     * @param {boolean} pointAnimation - Specifies whether the point based animation is enabled.
     * @param {number} seriesIndex - Index of the series.
     * @returns {void}
     */
    public explodePoints(index: number, chart: AccumulationChart,
                         explode: boolean = false, pointAnimation?: boolean, seriesIndex: number = 0): void {
        const series: AccumulationSeries = chart.visibleSeries[seriesIndex as number];
        const points: AccPoints[] = series.points;
        const point: AccPoints = pointByIndex(index, points);
        let explodePoints: boolean = true;
        const duration: number = this.accumulation.enableAnimation ? 300 : 0;
        if (isNullOrUndefined(point)) {
            return null;
        }
        const clubPointsExploded: boolean = !explode &&
            (point.isSliced || (series.clubbedPoints.length &&
                points[points.length - 1].index === series.clubbedPoints[series.clubbedPoints.length - 1].index));
        if (series.type === 'Pie' && (clubPointsExploded || point.isClubbed)) {
            explodePoints = this.clubPointExplode(index, point, series, points, chart, duration, clubPointsExploded);
        }
        if (explodePoints && point.y !== 0) {
            this.pointExplode(index, point, duration, explode, pointAnimation, series.index);
        }
    }

    private getSum(points: AccPoints[]): number {
        let total: number = 0;
        points.map((point: AccPoints) => {
            total += point.visible ? point.y : 0;
        });
        return total;
    }

    private clubPointExplode(index: number, point: AccPoints, series: AccumulationSeries, points: AccPoints[], chart: AccumulationChart,
                             duration: number, clubPointsExploded: boolean = false): boolean {
        if (point.isClubbed) {
            chart.animateSeries = false;
            points.splice(points.length - 1, 1);
            series.clubbedPoints.map((point: AccPoints) => {
                point.visible = true;
                point.isExplode = true;
            });
            chart.visibleSeries[series.index].points = points.concat(series.clubbedPoints);
            this.deExplodeAll(index, duration);
            series.sumOfPoints = this.getSum(chart.visibleSeries[series.index].points);
            chart.refreshChart();
            return false;
        } else if (clubPointsExploded || point.isSliced) {
            chart.animateSeries = false;
            points.splice(points.length - series.clubbedPoints.length, series.clubbedPoints.length);
            const clubPoint: AccPoints = series.generateClubPoint();
            clubPoint.index = points.length;
            clubPoint.color = series.clubbedPoints[0].color;
            points.push(clubPoint);
            series.sumOfPoints = this.getSum(points);
            this.deExplodeAll(index, duration);
            clubPoint.isExplode = false;
            chart.visibleSeries[series.index].points = points;
            chart.refreshChart();
            this.pointExplode(clubPoint.index, points[clubPoint.index], 0, true, null, series.index);
            clubPoint.isExplode = false;
            this.deExplodeSlice(clubPoint.index, chart.element.id + '_Series_' + series.index + '_Point_', duration);
            if (point.isSliced) {
                return false;
            }
        }
        return true;
    }
    /**
     * To Explode points.
     *
     * @param {number} index - Index of a point.
     * @param {AccPoints} point - To get the point of explode.
     * @param {number} duration - Duration of the explode point.
     * @param {boolean} explode - Either true or false.
     * @param {boolean} pointAnimation - Specifies whether the point based animation is enabled.
     * @param {number} seriesIndex - Index of the series.
     * @returns {void}
     */
    private pointExplode(index: number, point: AccPoints, duration: number,
                         explode?: boolean, pointAnimation?: boolean, seriesIndex?: number   ): void {
        if (seriesIndex === void 0) { seriesIndex = 0; }
        let translate: ChartLocation;
        const pointId: string = this.accumulation.element.id + '_Series_' + seriesIndex + '_Point_';
        const chart: AccumulationChart = this.accumulation;
        const series: AccumulationSeries = chart.visibleSeries[seriesIndex as number];
        const explodeDistance: number = series.type === 'Pie' ? (series && series._explodeDistance
            ? series._explodeDistance : 0 )
            : chart.explodeDistance;

        if (!this.isCircular()) {
            translate = {
                x: ((point.labelRegion && point.labelRegion.x < point.region.x) ? -explodeDistance :
                    explodeDistance), y: 0
            };
        } else {
            translate = degreeToLocation(point.midAngle, explodeDistance, this.center);
        }
        if (this.isExplode(pointId + index) || explode) {
            point.isExplode = true;
            this.explodeSlice(index, translate, pointId, this.center || { x: 0, y: 0 }, duration, pointAnimation);
        } else {
            point.isExplode = false;
            this.deExplodeSlice(index, pointId, duration);
        }
    }

    /**
     * To check point is exploded by id.
     *
     * @param {string} id - The id of the point to check.
     * @returns {boolean} - True if the point is exploded, otherwise false.
     */
    private isExplode(id: string): boolean {
        const element: Element = getElement(id);
        const transform: string = element ? element.getAttribute('transform') : null;
        return (element && (transform === 'translate(0, 0)' || transform === null || transform === 'translate(0)'));
    }

    /**
     * To deExplode the point by index.
     *
     * @param {number} index - The index of the point.
     * @param {string} sliceId - The id of the slice.
     * @param {number} animationDuration - The duration of the animation.
     * @returns {void}
     */
    private deExplodeSlice(index: number, sliceId: string, animationDuration: number): void {
        const element: Element = getElement(sliceId + index);
        const transform: string = element ? element.getAttribute('transform') : null;
        if (
            this.accumulation.enableAnimation && element && transform &&
            transform !== 'translate(0, 0)' && transform !== 'translate(0)'
        ) {
            const result: string[] = transform.split('(')[1].split(')')[0].split(',');
            this.performAnimation(
                index, sliceId, 0, 0, +result[0], +result[1] || 0, animationDuration, true
            );
        } else {
            this.performAnimation(
                index, sliceId, 0, 0, 0, 0, animationDuration, true
            );
        }
    }

    /**
     * To translate the point elements by index and position.
     *
     * @param {number} index - The index of the point.
     * @param {string} sliceId - The id of the slice.
     * @param {string} position - The position to translate the point to.
     * @param {string} transform - The transformation to apply to the point.
     * @returns {void}
     */
    private setTranslate(index: number, sliceId: string, position: string, transform?: string): void {
        this.setElementTransform(sliceId + index, position);
        this.setElementTransform(sliceId + index + '_polygon', position);
        // Extract seriesIndex from sliceId for multi-series support
        const values: string[] = sliceId.split('_');
        const seriesIndex: number = parseInt(values[values.length - 3], 10);
        if (this.accumulation.visibleSeries[seriesIndex as number] &&
            this.accumulation.visibleSeries[seriesIndex as number].dataLabel.visible) {
            sliceId = this.accumulation.element.id + '_datalabel_Series_' + seriesIndex + '_';
            this.setElementTransform(sliceId + 'shape_' + index, position);
            this.setElementTransform(sliceId + 'text_' + index, position + transform);
            this.setElementTransform(sliceId + 'connector_' + index, position);
        }
    }

    /**
     * To translate the point element by id and position.
     *
     * @param {string} id - The id of the point element.
     * @param {string} position - The position to translate the point to.
     * @returns {void}
     */
    private setElementTransform(id: string, position: string): void {
        const element: Element = getElement(id);
        if (element) {
            element.setAttribute('transform', position);
        }
    }

    /**
     * To translate the point elements by index position.
     *
     * @param {number} index - The index of the point.
     * @param {ChartLocation} translate - The translation values (x, y).
     * @param {string} sliceId - The id of the slice.
     * @param {ChartLocation} center - The center point of the accumulation chart.
     * @param {number} animationDuration - The duration of the animation.
     * @param {boolean} pointAnimation - Specifies whether the point based animation is enabled.
     * @returns {void}
     */
    private explodeSlice(
        index: number, translate: ChartLocation, sliceId: string, center: ChartLocation,
        animationDuration: number, pointAnimation?: boolean
    ): void {
        const values: string[] = sliceId.split('_');
        const seriesIndex: number = parseInt(sliceId.split('_')[values.length - 3], 10);
        if (pointAnimation
            && getElement(this.accumulation.element.id + '_Series_' + seriesIndex + '_Point_' + index).getAttribute('transform')) {
            this.setElementTransform(sliceId + index, `translate(${translate.x - center.x}, ${translate.y - center.y})`);
        }
        else {
            this.performAnimation(index, sliceId, 0, 0, translate.x - center.x, translate.y - center.y, animationDuration);
        }
    }

    /**
     * To Perform animation point explode.
     *
     * @param {number} index - Index of the series.
     * @param {string} sliceId - ID of the series.
     * @param {number} startX - X value of start.
     * @param {number} startY - Y value of start.
     * @param {number} endX - X value of end.
     * @param {number} endY - Y value of end.
     * @param {number} duration - Duration of the animation.
     * @param {boolean} isReverse - Duration of the animation.
     * @returns {void}
     */
    private performAnimation(
        index: number, sliceId: string, startX: number, startY: number, endX: number, endY: number,
        duration: number, isReverse?: boolean
    ): void {
        const chart: AccumulationChart = this.accumulation;
        const values: string[] = sliceId.split('_');
        const seriesIndex: number = parseInt(sliceId.split('_')[values.length - 3], 10);
        const point: AccPoints = chart.visibleSeries[seriesIndex as number].points[index as number];
        if (duration <= 0) {
            this.setTranslate(
                index, sliceId,
                'translate(' + (endX) + ', ' + (endY) + ')',
                point.transform
            );
            return null;
        }
        let xValue: number;
        let yValue: number;
        const delay: number = (this.accumulation.series[seriesIndex as number].type === 'Pie')
            && (this.accumulation.animateSeries) && (this.accumulation.series[0].animation.enable)
            ? this.accumulation.series[0].animation.duration : 0;
        new Animation({}).animate(createElement('div'), {
            duration: duration,
            delay: delay,
            progress: (args: AnimationOptions): void => {
                xValue = linear(args.timeStamp, startX, endX, args.duration);
                yValue = linear(args.timeStamp, startY, endY, args.duration);
                this.setTranslate(
                    index, sliceId,
                    'translate(' + (isReverse ? endX - xValue : xValue) + ', ' + (isReverse ? endY - yValue : yValue) + ')',
                    point.transform
                );
            },
            end: () => {
                this.setTranslate(
                    index, sliceId,
                    'translate(' + (isReverse ? startX : endX) + ', ' + (isReverse ? startX : endY) + ')',
                    point.transform
                );
            }
        });
    }



}
