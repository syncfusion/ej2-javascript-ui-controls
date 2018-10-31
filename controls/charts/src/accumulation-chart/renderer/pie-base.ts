/**
 * Accumulation charts base file
 */
import { Animation, AnimationOptions, isNullOrUndefined } from '@syncfusion/ej2-base';
import { AccumulationChart } from '../accumulation';
import { stringToNumber, ChartLocation, degreeToLocation, Rect, getAnimationFunction, getElement } from '../../common/utils/helper';
import { animationComplete } from '../../common/model/constants';
import { AccumulationLabelPosition } from '../model/enum';
import { AccumulationSeries } from '../model/acc-base';
import { AccumulationBase } from './accumulation-base';

/**
 * PieBase class used to do pie base calculations.
 */
export class PieBase extends AccumulationBase {
    protected startAngle: number;
    protected totalAngle: number;
    protected innerRadius: number;

    public center: ChartLocation;
    public radius: number;
    public labelRadius: number;

    /**
     * To initialize the property values.
     * @private
     */
    public initProperties(chart: AccumulationChart, series: AccumulationSeries): void {
        this.accumulation = chart;
        let size: number = Math.min(chart.initialClipRect.width, chart.initialClipRect.height);
        this.initAngles(series);
        this.radius = stringToNumber(series.radius, size / 2);
        this.innerRadius = stringToNumber(series.innerRadius, this.radius);
        this.labelRadius = series.dataLabel.position === 'Inside' ? (((this.radius - this.innerRadius) / 2) + this.innerRadius) :
            (this.radius + stringToNumber(series.dataLabel.connectorStyle.length || '4%', size / 2));
        chart.explodeDistance = series.explode ? stringToNumber(series.explodeOffset, this.radius) : 0;
        this.findCenter(chart, series);
        this.defaultLabelBound(series, series.dataLabel.visible, series.dataLabel.position);
        this.totalAngle -= 0.001;
    }
    /**
     * To find the center of the accumulation.
     * @private
     */
    public findCenter(accumulation: AccumulationChart, series: AccumulationSeries): void {
        this.accumulation = accumulation;
        this.center = {
            x: stringToNumber('50%', accumulation.initialClipRect.width) + (accumulation.initialClipRect.x),
            y: stringToNumber('50%', accumulation.initialClipRect.height) + (accumulation.initialClipRect.y)
        };
        let accumulationRect: Rect = this.getSeriesBound(series);
        let accumulationRectCenter: ChartLocation = new ChartLocation(
            accumulationRect.x + accumulationRect.width / 2, accumulationRect.y + accumulationRect.height / 2);
        this.center.x += (this.center.x - accumulationRectCenter.x);
        this.center.y += (this.center.y - accumulationRectCenter.y);
        this.accumulation.center = this.center;
    }

    /**
     * To find angles from series.
     */
    private initAngles(series: AccumulationSeries): void {
        let endAngle: number = isNullOrUndefined(series.endAngle) ? series.startAngle : series.endAngle;
        this.totalAngle = (endAngle - series.startAngle) % 360;
        this.startAngle = series.startAngle - 90;
        this.totalAngle = this.totalAngle <= 0 ? (360 + this.totalAngle) : this.totalAngle;
        this.startAngle = (this.startAngle < 0 ? (this.startAngle + 360) : this.startAngle) % 360;
    }

    /**
     * To calculate data-label bound
     * @private
     */
    public defaultLabelBound(series: AccumulationSeries, visible: boolean, position: AccumulationLabelPosition): void {
        let accumulationBound: Rect = this.getSeriesBound(series);
        series.accumulationBound = accumulationBound;
        series.labelBound = new Rect(
            accumulationBound.x, accumulationBound.y, accumulationBound.width + accumulationBound.x,
            accumulationBound.height + accumulationBound.y);
        if (visible && position === 'Outside') {
            series.labelBound = new Rect(Infinity, Infinity, -Infinity, -Infinity);
        }
    }

    /**
     * To calculate series bound
     * @private
     */
    public getSeriesBound(series: AccumulationSeries): Rect {
        let rect: Rect = new Rect(Infinity, Infinity, -Infinity, -Infinity);
        this.initAngles(series);
        let start: number = this.startAngle;
        let total: number = this.totalAngle;
        let end: number = (this.startAngle + total) % 360;
        end = (end === 0) ? 360 : end;
        series.findMaxBounds(rect, this.getRectFromAngle(start));
        series.findMaxBounds(rect, this.getRectFromAngle(end));
        series.findMaxBounds(rect, new Rect(this.center.x, this.center.y, 0, 0));
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
        let length: number = nextQuandrant === lastQuadrant ? 0 : Math.floor(total / 90);
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
     * To get rect location size from angle
     */
    private getRectFromAngle(angle: number): Rect {
        let location: ChartLocation = degreeToLocation(angle, this.radius, this.center);
        return new Rect(location.x, location.y, 0, 0);
    }
    /**
     * To get path arc direction
     */
    protected getPathArc(center: ChartLocation, start: number, end: number, radius: number, innerRadius: number): string {
        let degree: number = end - start; degree = degree < 0 ? (degree + 360) : degree;
        let flag: number = (degree < 180) ? 0 : 1;
        if (!innerRadius && innerRadius === 0) {
            return this.getPiePath(center, degreeToLocation(start, radius, center), degreeToLocation(end, radius, center), radius, flag);
        } else {
            return this.getDoughnutPath(
                center, degreeToLocation(start, radius, center), degreeToLocation(end, radius, center), radius,
                degreeToLocation(start, innerRadius, center), degreeToLocation(end, innerRadius, center), innerRadius, flag);
        }
    }
    /**
     * To get pie direction
     */
    protected getPiePath(center: ChartLocation, start: ChartLocation, end: ChartLocation, radius: number, clockWise: number): string {
        return 'M ' + center.x + ' ' + center.y + ' L ' + start.x + ' ' + start.y + ' A ' + radius + ' ' +
            radius + ' 0 ' + clockWise + ' 1 ' + end.x + ' ' + end.y + ' Z';
    }
    /**
     * To get doughnut direction
     */
    protected getDoughnutPath(center: ChartLocation, start: ChartLocation, end: ChartLocation, radius: number,
                              innerStart: ChartLocation, innerEnd: ChartLocation, innerRadius: number, clockWise: number): string {
        return 'M ' + start.x + ' ' + start.y + ' A ' + radius + ' ' + radius + ' 0 ' + clockWise +
            ' 1 ' + end.x + ' ' + end.y + ' L ' + innerEnd.x + ' ' + innerEnd.y + ' A ' + innerRadius +
            ' ' + innerRadius + ' 0 ' + clockWise + ',0 ' + innerStart.x + ' ' + innerStart.y + ' Z';
    }
    /**
     * Method to start animation for pie series.
     */
    protected doAnimation(slice: Element, series: AccumulationSeries): void {
        let startAngle: number = series.startAngle - 85;
        let value: number;
        let radius: number = Math.max(this.accumulation.availableSize.height, this.accumulation.availableSize.width) * 0.75;
        radius += radius * (0.414); // formula r + r / 2 * (1.414 -1)
        let effect: Function = getAnimationFunction('Linear'); // need to check animation type
        new Animation({}).animate(<HTMLElement>slice, {
            duration: series.animation.duration,
            delay: series.animation.delay,
            progress: (args: AnimationOptions): void => {
                value = effect(args.timeStamp, startAngle, this.totalAngle, args.duration);
                slice.setAttribute('d', this.getPathArc(this.center, startAngle, value, radius, 0));
            },
            end: (args: AnimationOptions) => {
                slice.setAttribute('d', this.getPathArc(this.center, 0, 359.99999, radius, 0));
                this.accumulation.trigger(animationComplete, { series: series, accumulation: this.accumulation, chart: this.accumulation });
                let datalabelGroup: Element = getElement(this.accumulation.element.id + '_datalabel_Series_' + series.index);
                (datalabelGroup as HTMLElement).style.visibility = this.accumulation.isDestroyed ? 'hidden' : 'visible';
            }
        });
    }


}