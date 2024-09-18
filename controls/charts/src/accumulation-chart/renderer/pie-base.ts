/**
 * Accumulation charts base file
 */
import { Animation, AnimationOptions, animationMode, isNullOrUndefined } from '@syncfusion/ej2-base';
import { AccumulationChart } from '../accumulation';
import { stringToNumber, ChartLocation, degreeToLocation, getAnimationFunction, getElement } from '../../common/utils/helper';
import { Rect } from '@syncfusion/ej2-svg-base';
import { animationComplete } from '../../common/model/constants';
import { AccumulationLabelPosition } from '../model/enum';
import { AccumulationSeries, AccPoints } from '../model/acc-base';
import { AccumulationBase } from './accumulation-base';
import { AccumulationSeriesModel } from '../model/acc-base-model';

/**
 * The `PieBase` class is used to perform base calculations for the `Pie` series.
 *
 * @private
 */
export class PieBase extends AccumulationBase {
    protected startAngle: number;
    protected totalAngle: number;
    public innerRadius: number;
    public pieBaseCenter: ChartLocation;
    public pieBaseRadius: number;
    public pieBaseLabelRadius: number;
    public isRadiusMapped: boolean;
    public seriesRadius: number;
    public size: number;

    /**
     * To initialize the property values.
     *
     * @private
     * @param {AccumulationChart} chart - The accumulation chart control.
     * @param {AccumulationSeries} series - The series for which the properties are initialized.
     * @returns {void}
     */
    public initProperties(chart: AccumulationChart, series: AccumulationSeries): void {
        this.accumulation = chart;
        this.size = Math.min(chart.initialClipRect.width, chart.initialClipRect.height);
        this.initAngles(series);
        const r: number = parseInt(series.radius, 10);
        if ((series.radius.indexOf('%') !== -1 || typeof r === 'number') && !isNaN(r)) {
            this.isRadiusMapped = false;
            this.pieBaseRadius = stringToNumber(series.radius, this.size / 2);
            this.innerRadius = stringToNumber(series.innerRadius, this.pieBaseRadius);
            this.pieBaseLabelRadius = series.dataLabel.position === 'Inside' ? (((this.pieBaseRadius - this.innerRadius) / 2) + this.innerRadius) :
                (this.pieBaseRadius + stringToNumber(series.dataLabel.connectorStyle.length || '4%', this.size / 2));
        } else {
            const radiusCollection: number[] = [];
            this.isRadiusMapped = true;
            for (let i: number = 0; i < Object.keys(series.points).length; i++) {
                if (series.points[i as number].sliceRadius.indexOf('%') !== -1) {
                    radiusCollection[i as number] = stringToNumber(series.points[i as number].sliceRadius, this.size / 2);
                } else {
                    radiusCollection[i as number] = parseInt(series.points[i as number].sliceRadius, 10);
                }
            }
            const minRadius: number = Math.min.apply(null, radiusCollection);
            const maxRadius: number = Math.max.apply(null, radiusCollection);
            this.pieBaseRadius = this.seriesRadius = maxRadius;
            this.innerRadius = stringToNumber(series.innerRadius, this.seriesRadius);
            this.innerRadius = this.innerRadius > minRadius ? (this.innerRadius / 2) : this.innerRadius;
        }

        // this.radius = stringToNumber(series.radius, size / 2);
        // this.innerRadius = stringToNumber(series.innerRadius, this.radius);
        // this.labelRadius = series.dataLabel.position === 'Inside' ? (((this.radius - this.innerRadius) / 2) + this.innerRadius) :
        //     (this.radius + stringToNumber(series.dataLabel.connectorStyle.length || '4%', size / 2));
        this.radius = this.pieBaseRadius;
        this.labelRadius = this.pieBaseLabelRadius;
        chart.explodeDistance = series.explode ? stringToNumber(series.explodeOffset, this.pieBaseRadius) : 0;
        this.findCenter(chart, series);
        this.center = this.pieBaseCenter;
        if (!chart.redraw) {
            this.defaultLabelBound(series, series.dataLabel.visible, series.dataLabel.position);
        }
        this.totalAngle -= 0.001;
    }
    /*
     * To get label radius of the pie.
     * @private
     */
    public getLabelRadius(series: AccumulationSeriesModel, point: AccPoints): number {

        return series.dataLabel.position === 'Inside' ?
            ((((stringToNumber(point.sliceRadius, this.pieBaseRadius) - this.innerRadius)) / 2) + this.innerRadius) :
            (stringToNumber(point.sliceRadius, this.size / 2) + stringToNumber(
                series.dataLabel.connectorStyle.length || '4%', this.size / 2));

    }

    /**
     * To find the center of the accumulation.
     *
     * @private
     * @param {AccumulationChart} accumulation - The accumulation chart control.
     * @param {AccumulationSeries} series - The series for which the center is calculated.
     * @returns {void}
     */
    public findCenter(accumulation: AccumulationChart, series: AccumulationSeries): void {
        this.accumulation = accumulation;
        this.pieBaseCenter = {
            x: stringToNumber(accumulation.center.x, accumulation.initialClipRect.width) + (accumulation.initialClipRect.x),
            y: stringToNumber(accumulation.center.y, accumulation.initialClipRect.height) + (accumulation.initialClipRect.y)
        };
        const accumulationRect: Rect = this.getSeriesBound(series);
        const accumulationRectCenter: ChartLocation = new ChartLocation(
            accumulationRect.x + accumulationRect.width / 2, accumulationRect.y + accumulationRect.height / 2);
        this.pieBaseCenter.x += (this.pieBaseCenter.x - accumulationRectCenter.x);
        this.pieBaseCenter.y += (this.pieBaseCenter.y - accumulationRectCenter.y);
        this.accumulation.origin = this.pieBaseCenter;
    }

    /**
     * To find angles from series.
     *
     * @param {AccumulationSeries} series - The series for which to calculate angles.
     * @returns {void}
     */
    private initAngles(series: AccumulationSeries): void {
        const endAngle: number = isNullOrUndefined(series.endAngle) ? series.startAngle : series.endAngle;
        this.totalAngle = (endAngle - series.startAngle) % 360;
        this.startAngle = series.startAngle - 90;
        this.totalAngle = this.totalAngle <= 0 ? (360 + this.totalAngle) : this.totalAngle;
        this.startAngle = (this.startAngle < 0 ? (this.startAngle + 360) : this.startAngle) % 360;
    }

    /**
     * To calculate data-label bound.
     *
     * @private
     * @param {AccumulationSeries} series - The series for which to calculate data-label bounds.
     * @param {boolean} visible - Indicates whether the data-labels are visible.
     * @param {AccumulationLabelPosition} position - The position of the data-labels.
     * @returns {void}
     */
    public defaultLabelBound(series: AccumulationSeries, visible: boolean, position: AccumulationLabelPosition): void {
        const accumulationBound: Rect = this.getSeriesBound(series);
        series.accumulationBound = accumulationBound;
        series.labelBound = new Rect(
            accumulationBound.x, accumulationBound.y, accumulationBound.width + accumulationBound.x,
            accumulationBound.height + accumulationBound.y);
        if (visible && position === 'Outside') {
            series.labelBound = new Rect(Infinity, Infinity, -Infinity, -Infinity);
        }
    }

    /**
     * To calculate series bound.
     *
     * @private
     * @param {AccumulationSeries} series - The series for which to calculate the bound.
     * @returns {Rect} - Returns a rect.
     */
    public getSeriesBound(series: AccumulationSeries): Rect {
        const rect: Rect = new Rect(Infinity, Infinity, -Infinity, -Infinity);
        this.initAngles(series);
        const start: number = this.startAngle;
        const total: number = this.totalAngle;
        let end: number = (this.startAngle + total) % 360;
        end = (end === 0) ? 360 : end;
        series.findMaxBounds(rect, this.getRectFromAngle(start));
        series.findMaxBounds(rect, this.getRectFromAngle(end));
        series.findMaxBounds(rect, new Rect(this.pieBaseCenter.x, this.pieBaseCenter.y, 0, 0));
        let nextQuandrant: number = (Math.floor(start / 90) * 90 + 90) % 360;
        let lastQuadrant: number = (Math.floor(end / 90) * 90) % 360;
        lastQuadrant = (lastQuadrant === 0) ? 360 : lastQuadrant;
        if (total >= 90 || lastQuadrant === nextQuandrant) {
            series.findMaxBounds(rect, this.getRectFromAngle(nextQuandrant));
            series.findMaxBounds(rect, this.getRectFromAngle(lastQuadrant));
        }
        if (start === 0 || (start + total >= 360)) {
            series.findMaxBounds(rect, this.getRectFromAngle(0));
        }
        const length: number = nextQuandrant === lastQuadrant ? 0 : Math.floor(total / 90);
        for (let i: number = 1; i < length; i++) {
            nextQuandrant = nextQuandrant + 90;
            if ((nextQuandrant < lastQuadrant || end < start) || total === 360) {
                series.findMaxBounds(rect, this.getRectFromAngle(nextQuandrant));
            }
        }
        rect.width -= rect.x;
        rect.height -= rect.y;
        return rect;
    }
    /**
     * To get rect location size from angle.
     *
     * @param {number} angle - The angle in degrees.
     * @returns {Rect} - The rect representing the location size from angle.
     */
    private getRectFromAngle(angle: number): Rect {
        const location: ChartLocation = degreeToLocation(angle, this.pieBaseRadius, this.pieBaseCenter);
        return new Rect(location.x, location.y, 0, 0);
    }
    /**
     * To get path arc direction.
     *
     * @param {ChartLocation} center - The center coordinates of the arc.
     * @param {number} start - The starting angle of the arc in degrees.
     * @param {number} end - The ending angle of the arc in degrees.
     * @param {number} radius - The radius of the arc.
     * @param {number} innerRadius - The inner radius of the arc.
     * @param {number} borderRadius - The border radius of the arc.
     * @param {boolean} isBorder - It specifies whether it is for rendering a border.
     * @param {AccPoints[]} seriesPoints - The points of the series.
     * @returns {string} - The path string representing the arc direction.
     */
    protected getPathArc(center: ChartLocation, start: number, end: number, radius: number, innerRadius: number,
                         borderRadius?: number, isBorder?: boolean, seriesPoints?: AccPoints[]): string {
        let degree: number = end - start; degree = degree < 0 ? (degree + 360) : degree;
        const flag: number = (degree < 180) ? 0 : 1;
        if (!innerRadius && innerRadius === 0) {
            return this.getPiePath(center, degreeToLocation(start, radius, center), degreeToLocation(end, radius, center), radius,
                                   flag, borderRadius, seriesPoints);
        } else {
            return this.getDoughnutPath(
                center, degreeToLocation(start, radius, center), degreeToLocation(end, radius, center), radius,
                degreeToLocation(start, innerRadius, center), degreeToLocation(end, innerRadius, center), innerRadius, flag,
                borderRadius, isBorder, seriesPoints);
        }
    }
    /**
     * To get pie direction.
     *
     * @param {ChartLocation} center - The center of the pie.
     * @param {ChartLocation} start - The starting location of the pie.
     * @param {ChartLocation} end - The ending location of the pie.
     * @param {number} radius - The radius of the pie.
     * @param {number} clockWise - The direction of the pie.
     * @param {number} cornerRadius - The border radius of the arc.
     * @param {AccPoints[]} seriesPoints - The points of the series.
     * @returns {string} - The path direction for the pie.
     */
    protected getPiePath(center: ChartLocation, start: ChartLocation, end: ChartLocation, radius: number, clockWise: number,
                         cornerRadius: number, seriesPoints: AccPoints[]): string {
        const sliceCount: number = this.sliceCheck(seriesPoints);
        cornerRadius = sliceCount === 1 ? 0 : cornerRadius;
        const startAngle: number = Math.atan2(start.y - center.y, start.x - center.x);
        const endAngle: number = Math.atan2(end.y - center.y, end.x - center.x);
        cornerRadius = this.adjustCornerRadius(startAngle, endAngle, radius, cornerRadius);
        const x1: number = start.x - cornerRadius * Math.cos(startAngle);
        const y1: number = start.y - cornerRadius * Math.sin(startAngle);
        const x2: number = end.x - cornerRadius * Math.cos(Math.PI / 2 + endAngle);
        const y2: number = end.y - cornerRadius * Math.sin(Math.PI / 2 + endAngle);
        const cx2: number = end.x - cornerRadius * Math.cos(endAngle);
        const cy2: number = end.y - cornerRadius * Math.sin(endAngle);
        const cx1: number = start.x + cornerRadius * Math.cos(Math.PI / 2 + startAngle);
        const cy1: number = start.y + cornerRadius * Math.sin(Math.PI / 2 + startAngle);
        return `M ${center.x} ${center.y} L ${x1} ${y1} A ${cornerRadius} ${cornerRadius} 0 0 1 ${cx1} ${cy1} A ${radius} ${radius} 0 ${clockWise} 1 ${x2} ${y2} A ${cornerRadius} ${cornerRadius} 0 0 1 ${cx2} ${cy2} Z`;
    }
    /**
     * To get doughnut direction.
     *
     * @param {ChartLocation} center - The center of the doughnut.
     * @param {ChartLocation} start - The starting location of the outer doughnut.
     * @param {ChartLocation} end - The ending location of the outer doughnut.
     * @param {number} radius - The radius of the outer doughnut.
     * @param {ChartLocation} innerStart - The starting location of the inner doughnut.
     * @param {ChartLocation} innerEnd - The ending location of the inner doughnut.
     * @param {number} innerRadius - The radius of the inner doughnut.
     * @param {number} clockWise - The direction of the doughnut.
     * @param {number} cornerRadius - The border radius of the arc.
     * @param {boolean} isBorder - It specifies whether it is for rendering a border.
     * @param {AccPoints[]} seriesPoints - The points of the series.
     * @returns {string} - The path direction for the doughnut.
     */
    protected getDoughnutPath(center: ChartLocation, start: ChartLocation, end: ChartLocation, radius: number,
                              innerStart: ChartLocation, innerEnd: ChartLocation, innerRadius: number, clockWise: number,
                              cornerRadius: number, isBorder: boolean, seriesPoints: AccPoints[]): string {
        const sliceCount: number = this.sliceCheck(seriesPoints);
        cornerRadius = sliceCount === 1 ? 0 : cornerRadius;
        const startAngle: number = Math.atan2(start.y - innerStart.y, start.x - innerStart.x);
        const endAngle: number = Math.atan2(end.y - innerEnd.y, end.x - innerEnd.x);
        cornerRadius = this.adjustCornerRadius(startAngle, endAngle, innerRadius, cornerRadius);
        cornerRadius = (isBorder && (this.innerRadius === 0)) ? cornerRadius * -1 : cornerRadius;
        const x1: number = start.x - cornerRadius * Math.cos(startAngle);
        const y1: number = start.y - cornerRadius * Math.sin(startAngle);
        const x2: number = end.x - cornerRadius * Math.cos(Math.PI / 2 + endAngle);
        const y2: number = end.y - cornerRadius * Math.sin(Math.PI / 2 + endAngle);
        const x3: number = innerEnd.x + cornerRadius * Math.cos(endAngle);
        const y3: number = innerEnd.y + cornerRadius * Math.sin(endAngle);
        const x4: number = innerStart.x + cornerRadius * Math.cos(Math.PI / 2 + startAngle);
        const y4: number = innerStart.y + cornerRadius * Math.sin(Math.PI / 2 + startAngle);
        const cx1: number = start.x + cornerRadius * Math.cos(Math.PI / 2 + startAngle);
        const cy1: number = start.y + cornerRadius * Math.sin(Math.PI / 2 + startAngle);
        const cx2: number = end.x - cornerRadius * Math.cos(endAngle);
        const cy2: number = end.y - cornerRadius * Math.sin(endAngle);
        const cx3: number = innerEnd.x - cornerRadius * Math.cos(Math.PI / 2 + endAngle);
        const cy3: number = innerEnd.y - cornerRadius * Math.sin(Math.PI / 2 + endAngle);
        const cx4: number = innerStart.x + cornerRadius * Math.cos(startAngle);
        const cy4: number = innerStart.y + cornerRadius * Math.sin(startAngle);
        if (isBorder) {
            return `M ${cx1} ${cy1} A ${radius} ${radius} 0 ${clockWise} 1 ${x2} ${y2} L ${cx3} ${cy3} A ${innerRadius} ${innerRadius} 0 ${clockWise} 0 ${x4} ${y4} Z`;
        }
        else {
            return `M ${x1} ${y1} A ${cornerRadius} ${cornerRadius} 0 0 1 ${cx1} ${cy1} A ${radius} ${radius} 0 ${clockWise} 1 ${x2} ${y2} A ${cornerRadius} ${cornerRadius} 0 0 1 ${cx2} ${cy2} L ${x3} ${y3} A ${cornerRadius} ${cornerRadius} 0 0 1 ${cx3} ${cy3} A ${innerRadius} ${innerRadius} 0 ${clockWise} 0 ${x4} ${y4} A ${cornerRadius} ${cornerRadius} 0 0 1 ${cx4} ${cy4} Z`;
        }
    }
    /**
     * Adjusts the corner radius of a pie chart slice based on the angle of the slice.
     * Ensures that the corner radius does not exceed a value that would cause the arcs
     * of the slice to overlap or create an invalid shape.
     *
     * @param {number} startAngle - The start angle of the pie.
     * @param {number} endAngle - The end angle of the pie.
     * @param {number} radius - The radius of the pie.
     * @param {number} cornerRadius - The border radius of the arc.
     * @returns {number} - The adjusted corner radius of the pie.
     */
    private adjustCornerRadius(startAngle: number, endAngle: number, radius: number, cornerRadius: number): number {
        let anglePerSlice: number = Math.abs(endAngle - startAngle);
        if (anglePerSlice > Math.PI) {
            anglePerSlice = 2 * Math.PI - anglePerSlice; // Handle large angles that cross the -PI to PI boundary
        }
        // Adjust corner radius based on the angle per slice
        const angleFactor: number = anglePerSlice / (2 * Math.PI);
        const adjustedCornerRadius: number = radius * angleFactor;
        return Math.min(cornerRadius, adjustedCornerRadius);
    }
    /**
     * To Check slice count.
     *
     * @param {AccPoints[]} seriesPoints - The points of the series.
     * @returns {number} - The number of visible pie slice.
     */
    private sliceCheck(seriesPoints: AccPoints[]): number {
        let isOneSlice: number = 0;
        for (let index: number = 0; index < seriesPoints.length; index++) {
            const point: AccPoints = seriesPoints[index as number];
            if (point.visible) {
                isOneSlice++;
            }
        }
        return isOneSlice;
    }
    /**
     * Method to start animation for pie series.
     *
     * @param {Element} slice - The slice element to animate.
     * @param {AccumulationSeries} series - The accumulation chart control.
     * @param {Element} groupElement - The group element containing the pie series.
     * @param {number} borderRadius - The border radius of the arc.
     * @param {AccPoints[]} seriesPoints - The points of the series.
     * @returns {void}
     */
    protected doAnimation(slice: Element, series: AccumulationSeries, groupElement: Element,
                          borderRadius : number, seriesPoints: AccPoints[]): void {
        const startAngle: number = series.startAngle - 90;
        const duration: number = this.accumulation.duration ? this.accumulation.duration : series.animation.duration;
        let value: number;
        this.pieBaseCenter.x += 1;
        let radius: number = Math.max(this.accumulation.availableSize.height, this.accumulation.availableSize.width) * 0.75;
        radius += radius * (0.414); // formula r + r / 2 * (1.414 -1)
        const effect: Function = getAnimationFunction('Linear'); // need to check animation type
        new Animation({}).animate(<HTMLElement>slice, {
            duration: (duration === 0 && animationMode === 'Enable') ? 1000 : duration,
            delay: series.animation.delay,
            progress: (args: AnimationOptions): void => {
                value = effect(args.timeStamp, startAngle, this.totalAngle, args.duration);
                slice.setAttribute('d', this.getPathArc(this.pieBaseCenter, startAngle, value, radius, 0, borderRadius, false, seriesPoints));
            },
            end: () => {
                this.pieBaseCenter.x -= 1;
                slice.setAttribute('d', this.getPathArc(this.pieBaseCenter, 0, 359.99999, radius, 0, borderRadius, false, seriesPoints));
                this.accumulation.trigger(animationComplete, this.accumulation.isBlazor ? {} :
                    { series: series, accumulation: this.accumulation, chart: this.accumulation });
                const datalabelGroup: Element = getElement(this.accumulation.element.id + '_datalabel_Series_' + series.index);
                if (datalabelGroup) {
                    (datalabelGroup as HTMLElement).style.visibility = this.accumulation.isDestroyed ? 'hidden' : 'visible';
                }
                (groupElement as HTMLElement).style.cssText = '';
                const annotationElement: HTMLElement = <HTMLElement>getElement(this.accumulation.element.id + '_Annotation_Collections');
                if (annotationElement) {
                    annotationElement.style.visibility = 'visible';
                }
            }
        });
    }


}
