/** 
 * AccumulationChart series file
 */
import { AccPoints, AccumulationSeries } from '../model/acc-base';
import { PathOption, degreeToLocation, getElement, linear } from '../../common/utils/helper';
import { PieBase } from '../renderer/pie-base';
import { AccumulationChart } from '../accumulation';
import { AnimationModel } from '../../common/model/base-model';
import { Animation, AnimationOptions, createElement } from '@syncfusion/ej2-base';
/**
 * PieSeries module used to render `Pie` Series.
 */
export class PieSeries extends PieBase {
    /**
     * To get path option, degree, symbolLocation from the point.
     * @private
     */
    public renderPoint(
        point: AccPoints, series: AccumulationSeries, chart: AccumulationChart, option: PathOption,
        seriesGroup: Element, redraw?: boolean
    ): void {
        let sum: number = series.sumOfPoints;
        let yValue: number = point.visible ? point.y : 0;
        let degree : number  = (sum) ? ((Math.abs(yValue) / sum) * (this.totalAngle)) : null;
        let start : number = Math.PI / 180 * ((90 - (360 - this.startAngle)) - 90);
        option.d = this.getPathOption(point, degree, this.startAngle % 360, yValue);
        point.midAngle = (this.startAngle - (degree / 2)) % 360;
        point.endAngle = this.startAngle % 360;
        point.symbolLocation = degreeToLocation(point.midAngle, (this.radius + this.innerRadius) / 2, this.center);
        if (!redraw) {
            seriesGroup.appendChild(chart.renderer.drawPath(option));
            point.degree = degree;
            point.start = start;
        } else {
           this.refresh(point, degree, start, chart, option, seriesGroup);
        }
    }

    private refresh(
        point: AccPoints, degree : number, start: number, chart: AccumulationChart, option: PathOption, seriesGroup: Element) : void {
       let seriesElement: Element = getElement(option.id);
       let currentStartAngle: number;
       let curentDegree: number;
       new Animation({}).animate(createElement('div'), {
                duration: 300,
                delay: 0,
                progress: (args: AnimationOptions): void => {
                    curentDegree = linear(args.timeStamp, point.degree, (degree - point.degree), args.duration);
                    currentStartAngle = linear(args.timeStamp, point.start, start - point.start, args.duration);
                    currentStartAngle = ((currentStartAngle / (Math.PI / 180)) + 360) % 360;
                    seriesElement.setAttribute('d', this.getPathOption(point, curentDegree, currentStartAngle, point.y));
                    if (point.isExplode) {
                        chart.accBaseModule.explodePoints(point.index, chart, true);
                    }
                    (seriesElement as HTMLElement).style.visibility = 'visible';
                },
                end: (args: AnimationOptions) => {
                    (seriesElement as HTMLElement).style.visibility = point.visible ? 'visible' : 'hidden';
                    seriesElement.setAttribute('d', option.d);
                    point.degree = degree;
                    point.start = start;
                }
            });
    }
    /**
     * To get path option from the point.
     */
    private getPathOption(point: AccPoints, degree: number, startAngle: number, yValue: number): string {
        if (!degree) {
            return '';
        }
        let path: string = this.getPathArc(this.center, startAngle % 360, (startAngle + degree) % 360, this.radius, this.innerRadius);
        this.startAngle += degree;
        return path;
    }
    /**
     * To animate the pie series.
     * @private
     */
    public animateSeries(accumulation: AccumulationChart, option: AnimationModel, series: AccumulationSeries, slice: Element): void {
        let groupId: string = accumulation.element.id + 'SeriesGroup' + series.index;
        if (series.animation.enable && accumulation.animateSeries) {
            let clippath: Element = accumulation.renderer.createClipPath({ id: groupId + '_clipPath' });
            let path: PathOption = new PathOption(groupId + '_slice', 'transparent', 1, 'transparent', 1, '', '');
            let clipslice: Element = accumulation.renderer.drawPath(path);
            clippath.appendChild(clipslice);
            accumulation.svgObject.appendChild(clippath);
            slice.setAttribute('style', 'clip-path:url(#' + clippath.id + ')');
            this.doAnimation(clipslice, series);
        }
    }

    /**
     * To get the module name of the Pie series.
     */
    protected getModuleName(): string {
        return 'PieSeries';
    }

    /**
     * To destroy the pie series.
     * @return {void}
     * @private
     */

    public destroy(accumulation: AccumulationChart): void {
        /**
         * Destroy method calling here
         */
    }
}