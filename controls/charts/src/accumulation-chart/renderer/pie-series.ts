/**
 * AccumulationChart series file
 */
import { AccPoints, AccumulationSeries } from '../model/acc-base';
import { PathOption } from '@syncfusion/ej2-svg-base';
import { degreeToLocation, getElement, linear, stringToNumber, indexFinder } from '../../common/utils/helper';
import { PieBase } from '../renderer/pie-base';
import { AccumulationChart } from '../accumulation';
import { AnimationModel } from '../../common/model/base-model';
import { Animation, AnimationOptions, createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Index } from '../../common/model/base';
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
        point.startAngle = this.startAngle;
        let yValue: number = point.visible ? point.y : 0;
        let degree: number = (sum) ? ((Math.abs(yValue) / sum) * (this.totalAngle)) : null;
        let start: number = Math.PI / 180 * ((90 - (360 - this.startAngle)) - 90);
        this.radius = this.isRadiusMapped ? stringToNumber(point.sliceRadius, this.seriesRadius) : this.radius;
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

    public findSeries(e: PointerEvent | TouchEvent): void {
        let innerRadius: number;
        let radius: number;
        const borderGap: number = 3; // Gap between pie/doughnut chart and border
        const width: number = 2; // width of the border
        radius = this.innerRadius === 0 ? this.radius + borderGap : this.innerRadius - borderGap;
        innerRadius = this.innerRadius === 0 ? radius + width : radius - width;
        this.toggleInnerPoint(e, radius, innerRadius);
    }

    public toggleInnerPoint(event: PointerEvent | TouchEvent, radius: number, innerRadius: number): void {
        let target: Element = event.target as Element;
        let id: Index = indexFinder(target.id, true);
        let accumulationId: string = (event.target as Element).id.substring(0, ((event.target as Element).id.indexOf('Series') - 1));
        let borderElement: Element = document.getElementById(accumulationId + 'PointHover_Border');
        let createBorderEle: Element;
        let seriesIndex: number = id.series;
        let pointIndex: number = id.point;
        let srcElem: Element = getElement(accumulationId + '_Series_' + seriesIndex + '_Point_' + pointIndex);
        if (!isNaN(id.series) && srcElem) {
            if (!isNullOrUndefined(seriesIndex) && !isNaN(seriesIndex) && !isNullOrUndefined(pointIndex) && !isNaN(pointIndex)) {
                let point: AccPoints = this.accumulation.visibleSeries[0].points[pointIndex];
                const opacity: number = srcElem.getAttribute('class') === accumulationId + '_ej2_deselected' ?
                    this.accumulation.tooltip.enable ? 0.5 : 0.3 : this.accumulation.tooltip.enable ? 0.5 : 1;
                let innerPie: string = this.getPathArc(
                    this.accumulation.pieSeriesModule.center,
                    point.startAngle % 360,
                    (point.startAngle + point.degree) % 360,
                    radius,
                    innerRadius);
                    // while using annotation as a chart border will appear in both chart.so changed checked the id with target id
                if ((borderElement) && (accumulationId === this.accumulation.element.id) &&
                    (borderElement.getAttribute('d') !== innerPie || point.isExplode)) {
                    borderElement.parentNode.removeChild(borderElement);
                    borderElement = null;
                }
                let seriousGroup: Element = getElement(accumulationId + '_Series_' + seriesIndex);
                if (!borderElement && ((!point.isExplode) || (point.isExplode && event.type !== 'click'))) {
                    let path: PathOption = new PathOption(
                        accumulationId + 'PointHover_Border', point.color, 1, point.color, opacity, '', innerPie);
                    createBorderEle = this.accumulation.renderer.drawPath(path);
                    createBorderEle.removeAttribute('transform');
                    if (this.accumulation.selectionMode !== 'None' && (<Element>event.target).hasAttribute('class')) {
                        this.accumulation.accumulationSelectionModule.addSvgClass(
                            createBorderEle, (<Element>event.target).getAttribute('class'));
                    }
                    seriousGroup.appendChild(createBorderEle);
                    if (point.isExplode && createBorderEle) {
                        let borderExplode: string = srcElem.getAttribute('transform');
                        createBorderEle.setAttribute('transform', borderExplode);
                    }
                }
            }
        } else if (borderElement) {
            this.removeBorder(borderElement, 1000);
            borderElement = null;
        }
    }

    public removeBorder(borderElement: Element, duration: number): void {
        if (borderElement) {
            setTimeout(
                (): void => {
                    if (borderElement.parentNode) {
                    borderElement.parentNode.removeChild(borderElement);
                    }
                },
                duration);
        }
    }

    private refresh(
        point: AccPoints, degree: number, start: number, chart: AccumulationChart, option: PathOption, seriesGroup: Element): void {
        let seriesElement: Element = getElement(option.id);
        let duration: number = chart.duration ? chart.duration : 300;
        let currentStartAngle: number;
        let curentDegree: number;
        new Animation({}).animate(createElement('div'), {
            duration: duration,
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
        let path: string = this.getPathArc(
            this.center,
            startAngle % 360, (startAngle + degree) % 360,
            this.isRadiusMapped ? stringToNumber(point.sliceRadius, this.seriesRadius) : this.radius,
            this.innerRadius
        );
        //let path: string = this.getPathArc(this.center, startAngle % 360, (startAngle + degree) % 360, this.radius, this.innerRadius);
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
            // I263828 pie chart animation issue fixed for safari browser
            slice.setAttribute('style', 'clip-path:url(#' + clippath.id + '); -webkit-clip-path:url(#' + clippath.id + ');');
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