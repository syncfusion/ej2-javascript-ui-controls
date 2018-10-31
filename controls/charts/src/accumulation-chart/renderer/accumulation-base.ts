/** 
 * Defines the common functionalities of accumulation series
 */
import { isNullOrUndefined, Animation, createElement, AnimationOptions } from '@syncfusion/ej2-base';
import { ChartLocation, degreeToLocation, getElement, indexFinder, linear } from '../../common/utils/helper';
import { AccumulationChart } from '../accumulation';
import { AccPoints, pointByIndex, AccumulationSeries } from '../model/acc-base';

/**
 * Accumulation Base used to do some base calculation for accumulation chart.
 */
export class AccumulationBase {

    /** @private */
    constructor(accumulation: AccumulationChart) {
        this.accumulation = accumulation;
    }

    private pieCenter: ChartLocation;

    /**
     * Gets the center of the pie
     * @private
     */
    public get center(): ChartLocation {
        return this.pieCenter || (this.accumulation.visibleSeries[0].type === 'Pie' ?
        this.accumulation.pieSeriesModule.center : null );
    }

    /**
     * Sets the center of the pie
     * @private
     */
    public set center(value: ChartLocation) {
        this.pieCenter = value;
    }

    private pieRadius: number;
    /**
     * Gets the radius of the pie
     * @private
     */
    public get radius(): number {
        return this.pieRadius !== undefined ? this.pieRadius :
            this.accumulation.pieSeriesModule.radius;
    }

    /**
     * Sets the radius of the pie
     * @private
     */
    public set radius(value: number) {
        this.pieRadius = value;
    }

    private pieLabelRadius: number;
    /**
     * Gets the label radius of the pie
     * @private
     */
    public get labelRadius(): number {
        return this.pieLabelRadius !== undefined ? this.pieLabelRadius :
             this.accumulation.pieSeriesModule.labelRadius;
    }

    /**
     * Sets the label radius of the pie
     * @private
     */
    public set labelRadius(value: number) {
        this.pieLabelRadius = value;
    }

    /** @private */
    protected accumulation: AccumulationChart;

    /** 
     * Checks whether the series is circular or not
     * @private
     */
    protected isCircular(): boolean {
        return this.accumulation.type === 'Pie';
    }

    /**
     * To process the explode on accumulation chart loading
     * @private
     */
    public processExplode(event: Event): void {
        if ((<HTMLElement>event.target).id.indexOf('_Series_') > -1 || (<HTMLElement>event.target).id.indexOf('_datalabel_') > -1) {
            let pointIndex: number = indexFinder((<HTMLElement>event.target).id).point;
            if (isNaN(pointIndex) || ((<HTMLElement>event.target).id.indexOf('_datalabel_') > -1 &&
                this.accumulation.visibleSeries[0].points[pointIndex].labelPosition === 'Outside')) {
                return null;
            }
            this.explodePoints(pointIndex, this.accumulation);
            this.deExplodeAll(pointIndex, this.accumulation.enableAnimation ? 300 : 0);
        }
    }

    /**
     * To invoke the explode on accumulation chart loading
     * @private
     */
    public invokeExplode(): void {
        let series: AccumulationSeries = this.accumulation.visibleSeries[0];
        let duration: number = this.accumulation.enableAnimation ? 300 : 0;
        for (let point of series.points) {
            if (point.isExplode) {
                this.pointExplode(point.index, point, duration);
            }
        }
        if (this.accumulation.accumulationSelectionModule && this.accumulation.selectionMode !== 'None' &&
            this.accumulation.accumulationSelectionModule.selectedDataIndexes.length) {
            for (let index of this.accumulation.accumulationSelectionModule.selectedDataIndexes) {
                this.explodePoints(index.point, this.accumulation, true);
                this.deExplodeAll(index.point, duration);
            }
        }
    }

    /**
     * To deExplode all points in the series
     * @private
     */
    public deExplodeAll(index: number, animationDuration: number): void {
        let pointId: string = this.accumulation.element.id + '_Series_0_Point_';
        let points: AccPoints[] = this.accumulation.visibleSeries[0].points;
        for (let currentPoint of points) {
            if ((index !== currentPoint.index && !currentPoint.isSliced) || currentPoint.isClubbed) {
                currentPoint.isExplode = false;
                this.deExplodeSlice(currentPoint.index, pointId, animationDuration);
            }
        }
    }

    /**
     * To explode point by index
     * @private
     */
    public explodePoints(index: number, chart: AccumulationChart, explode: boolean = false): void {

        let series: AccumulationSeries = chart.visibleSeries[0];
        let points: AccPoints[] = series.points;
        let point: AccPoints = pointByIndex(index, points);
        let explodePoints : boolean = true;
        let duration: number = this.accumulation.enableAnimation ? 300 : 0;
        if (isNullOrUndefined(point)) {
            return null;
        }
        let clubPointsExploded: boolean =  !explode &&
            (point.isSliced || (series.clubbedPoints.length &&
                points[points.length - 1].index === series.clubbedPoints[series.clubbedPoints.length - 1].index));
        if (series.type === 'Pie' && (clubPointsExploded || point.isClubbed)) {
            explodePoints = this.clubPointExplode(index, point, series, points, chart, duration, explode, clubPointsExploded);
        }
        if (explodePoints) {
          this.pointExplode(index, point, duration, explode);
        }
    }

    private  getSum(points: AccPoints[]) : number {
            let total: number = 0;
            points.map((point: AccPoints) => {
                total += point.visible ? point.y : 0;
            });
            return total;
        };

    private clubPointExplode(index : number, point : AccPoints, series : AccumulationSeries, points: AccPoints[], chart: AccumulationChart,
                             duration : number, explode: boolean = false, clubPointsExploded: boolean = false) : boolean {
         if (point.isClubbed) {
            chart.animateSeries = false;
            points.splice(points.length - 1, 1);
            series.clubbedPoints.map((point: AccPoints) => {
                point.visible = true;
                point.isExplode = true;
            });
            chart.visibleSeries[0].points = points.concat(series.clubbedPoints);
            this.deExplodeAll(index, duration);
            series.sumOfPoints = this.getSum(chart.visibleSeries[0].points);
            chart.refreshChart();
            return false;
        } else if (clubPointsExploded || point.isSliced) {
            chart.animateSeries = false;
            points.splice(points.length - series.clubbedPoints.length, series.clubbedPoints.length);
            let clubPoint: AccPoints = series.generateClubPoint();
            clubPoint.index = points.length;
            clubPoint.color = series.clubbedPoints[0].color;
            points.push(clubPoint);
            series.sumOfPoints = this.getSum(points);
            this.deExplodeAll(index, duration);
            clubPoint.isExplode = false;
            chart.visibleSeries[0].points = points;
            chart.refreshChart();
            this.pointExplode(clubPoint.index, points[clubPoint.index], 0, true);
            clubPoint.isExplode = false;
            this.deExplodeSlice(clubPoint.index, chart.element.id + '_Series_0_Point_', duration);
            if (point.isSliced) {
                return false;
            }
        }return true;
    }
    /**
     * To Explode points
     * @param index 
     * @param point 
     * @param explode 
     */
    private pointExplode(index: number, point: AccPoints, duration: number, explode?: boolean): void {
        let translate: ChartLocation;
        let pointId: string = this.accumulation.element.id + '_Series_0_Point_';
        let chart: AccumulationChart = this.accumulation;
        if (!this.isCircular()) {
            translate = { x: chart.explodeDistance, y: 0 };
        } else {
            translate = degreeToLocation(point.midAngle, chart.explodeDistance, this.center);
        }
        if (this.isExplode(pointId + index) || explode) {
            point.isExplode = true;
            this.explodeSlice(index, translate, pointId, this.center || { x: 0, y: 0 }, duration);
        } else {
            point.isExplode = false;
            this.deExplodeSlice(index, pointId, duration);
        }
    }

    /**
     * To check point is exploded by id
     */
    private isExplode(id: string): boolean {
        let element: Element = getElement(id);
        let transform: string = element ? element.getAttribute('transform') : null;
        return (element && (transform === 'translate(0, 0)' || transform === null || transform === 'translate(0)'));
    }

    /**
     * To deExplode the point by index
     */
    private deExplodeSlice(index: number, sliceId: string, animationDuration: number): void {
        let element: Element = getElement(sliceId + index);
        let transform: string = element ? element.getAttribute('transform') : null;
        if (
            this.accumulation.enableAnimation && element && transform &&
            transform !== 'translate(0, 0)' && transform !== 'translate(0)'
        ) {
            let result: RegExpExecArray = /translate\((-?\d+\.?\d*),?\s*(-?\d+[.]?\d*)?\)/.exec(transform);
            this.performAnimation(
                index, sliceId, 0, 0, +result[1], +result[2] || 0, animationDuration, true
            );
        } else {
            this.performAnimation(
                index, sliceId, 0, 0, 0, 0, animationDuration, true
            );
        }
    }

    /**
     * To translate the point elements by index and position
     */
    private setTranslate(index: number, sliceId: string, position: string): void {
        this.setElementTransform(sliceId + index, position);
        if (this.accumulation.visibleSeries[0].dataLabel.visible) {
            sliceId = this.accumulation.element.id + '_datalabel_Series_0_';
            this.setElementTransform(sliceId + 'shape_' + index, position);
            this.setElementTransform(sliceId + 'text_' + index, position);
            this.setElementTransform(sliceId + 'connector_' + index, position);
        }
    }

    /**
     * To translate the point element by id and position
     */
    private setElementTransform(id: string, position: string): void {
        let element: Element = getElement(id);
        if (element) {
            element.setAttribute('transform', position);
        }
    }

    /**
     * To translate the point elements by index position
     */
    private explodeSlice(
        index: number, translate: ChartLocation, sliceId: string, center: ChartLocation,
        animationDuration: number
    ): void {
            this.performAnimation(index, sliceId, 0, 0, translate.x - center.x, translate.y - center.y, animationDuration);
        }

    /**
     * To Perform animation point explode
     * @param index 
     * @param sliceId 
     * @param start 
     * @param endX 
     * @param endY 
     */
    private performAnimation(
        index: number, sliceId: string, startX: number, startY: number, endX: number, endY: number,
        duration: number, isReverse?: boolean
    ): void {
        if (duration <= 0) {
            this.setTranslate(
                index, sliceId,
                'translate(' + (endX) + ', ' + (endY) + ')'
            );
            return null;
        }
        let xValue: number;
        let yValue: number;
        new Animation({}).animate(createElement('div'), {
            duration: duration,
            progress: (args: AnimationOptions): void => {
                xValue = linear(args.timeStamp, startX, endX, args.duration);
                yValue = linear(args.timeStamp, startY, endY, args.duration);
                this.setTranslate(
                    index, sliceId,
                    'translate(' + (isReverse ? endX - xValue : xValue) + ', ' + (isReverse ? endY - yValue : yValue) + ')'
                );
            },
            end: (model: AnimationOptions) => {
                this.setTranslate(
                    index, sliceId,
                    'translate(' + (isReverse ? startX : endX) + ', ' + (isReverse ? startX : endY) + ')'
                );
            }
        });
    }
}