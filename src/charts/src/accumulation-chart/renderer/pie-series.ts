/* eslint-disable jsdoc/require-returns */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable jsdoc/require-param */
/* eslint-disable valid-jsdoc */
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
     *
     * @private
     */
    public renderPoint(
        point: AccPoints, series: AccumulationSeries, chart: AccumulationChart, option: PathOption,
        seriesGroup: Element, redraw?: boolean
    ): void {
        const sum: number = series.sumOfPoints;
        point.startAngle = this.startAngle;
        const yValue: number = point.visible ? point.y : 0;
        const degree: number = (sum) ? ((Math.abs(yValue) / sum) * (this.totalAngle)) : null;
        const start: number = Math.PI / 180 * ((90 - (360 - this.startAngle)) - 90);
        this.radius = this.isRadiusMapped ? stringToNumber(point.sliceRadius, this.seriesRadius) : this.radius;
        option.d = this.getPathOption(point, degree, this.startAngle % 360);
        point.midAngle = (this.startAngle - (degree / 2)) % 360;
        point.endAngle = this.startAngle % 360;
        point.symbolLocation = degreeToLocation(point.midAngle, (this.radius + this.innerRadius) / 2, this.center);
        if (!redraw) {
            seriesGroup.appendChild(chart.renderer.drawPath(option));
            point.degree = degree;
            point.start = start;
        } else {
            seriesGroup.appendChild(chart.renderer.drawPath(option));
            this.refresh(point, degree, start, chart, option);
        }
    }

    public findSeries(e: PointerEvent | TouchEvent): void {
        const borderGap: number = 3; // Gap between pie/doughnut chart and border
        const width: number = 2; // width of the border
        const radius: number = this.innerRadius === 0 ? this.radius + borderGap : this.innerRadius - borderGap;
        const innerRadius: number = this.innerRadius === 0 ? radius + width : radius - width;
        this.toggleInnerPoint(e, radius, innerRadius);
    }

    public toggleInnerPoint(event: PointerEvent | TouchEvent, radius: number, innerRadius: number): void {
        const target: Element = event.target as Element;
        const id: Index = indexFinder(target.id, true);
        const accumulationId: string = (event.target as Element).id.substring(0, ((event.target as Element).id.indexOf('Series') - 1));
        let borderElement: Element = document.getElementById(this.accumulation.element.id + 'PointHover_Border');
        let createBorderEle: Element;
        const seriesIndex: number = id.series;
        const pointIndex: number = id.point;
        const srcElem: Element = getElement(accumulationId + '_Series_' + seriesIndex + '_Point_' + pointIndex);
        if (!isNaN(id.series) && srcElem) {
            if (!isNullOrUndefined(seriesIndex) && !isNaN(seriesIndex) && !isNullOrUndefined(pointIndex) && !isNaN(pointIndex)) {
                const point: AccPoints = this.accumulation.visibleSeries[0].points[pointIndex];
                const opacity: number = srcElem.getAttribute('class') === accumulationId + '_ej2_deselected' ?
                    this.accumulation.tooltip.enable ? 0.5 : 0.3 : this.accumulation.tooltip.enable ? 0.5 : 1;
                const innerPie: string = this.getPathArc(
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
                const seriousGroup: Element = getElement(accumulationId + '_Series_' + seriesIndex);
                if (!borderElement && ((!point.isExplode) || (point.isExplode && event.type !== 'click'))) {
                    const path: PathOption = new PathOption(
                        accumulationId + 'PointHover_Border', point.color, 1, point.color, opacity, '', innerPie);
                    createBorderEle = this.accumulation.renderer.drawPath(path);
                    createBorderEle.removeAttribute('transform');
                    if (this.accumulation.selectionMode !== 'None' && (<Element>event.target).hasAttribute('class')) {
                        this.accumulation.accumulationSelectionModule.addSvgClass(
                            createBorderEle, (<Element>event.target).getAttribute('class'));
                    }
                    seriousGroup.appendChild(createBorderEle);
                    if (point.isExplode && createBorderEle) {
                        const borderExplode: string = srcElem.getAttribute('transform');
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
        point: AccPoints, degree: number, start: number, chart: AccumulationChart, option: PathOption): void {
        const seriesElement: Element = getElement(option.id);
        const duration: number = chart.duration ? chart.duration : 300;
        new Animation({}).animate(createElement('div'), {
            duration: duration,
            delay: 0,
            progress: (args: AnimationOptions): void => {
                const curentDegree: number = linear(args.timeStamp, point.degree, (degree - point.degree), args.duration);
                let currentStartAngle: number = linear(args.timeStamp, point.start, start - point.start, args.duration);
                currentStartAngle = ((currentStartAngle / (Math.PI / 180)) + 360) % 360;
                seriesElement.setAttribute('d', this.getPathOption(point, curentDegree, currentStartAngle));
                if (point.isExplode) {
                    chart.accBaseModule.explodePoints(point.index, chart, true);
                }
                (seriesElement as HTMLElement).style.visibility = 'visible';
            },
            end: () => {
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
    private getPathOption(point: AccPoints, degree: number, startAngle: number): string {
        if (!degree) {
            return '';
        }
        const path: string = this.getPathArc(
            this.center,
            startAngle % 360, (startAngle + degree) % 360,
            this.isRadiusMapped ? stringToNumber(point.sliceRadius, this.seriesRadius) : this.radius,
            this.innerRadius
        );
        //const path: string = this.getPathArc(this.center, startAngle % 360, (startAngle + degree) % 360, this.radius, this.innerRadius);
        this.startAngle += degree;
        return path;
    }
    /**
     * To animate the pie series.
     *
     * @private
     */
    public animateSeries(accumulation: AccumulationChart, option: AnimationModel, series: AccumulationSeries, slice: Element): void {
        const groupId: string = accumulation.element.id + 'SeriesGroup' + series.index;
        if (series.animation.enable && accumulation.animateSeries) {
            const clippath: Element = accumulation.renderer.createClipPath({ id: groupId + '_clipPath' });
            const path: PathOption = new PathOption(groupId + '_slice', 'transparent', 1, 'transparent', 1, '', '');
            const clipslice: Element = accumulation.renderer.drawPath(path);
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
     *
     * @returns {void}
     * @private
     */

    public destroy(): void {
        /**
         * Destroy method calling here
         */
    }
}
