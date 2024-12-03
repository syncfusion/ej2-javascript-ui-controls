/**
 * AccumulationChart series file
 */
import { AccPoints, AccumulationSeries } from '../model/acc-base';
import { PathOption } from '@syncfusion/ej2-svg-base';
import { degreeToLocation, getElement, linear, stringToNumber, indexFinder, ChartLocation } from '../../common/utils/helper';
import { PieBase } from '../renderer/pie-base';
import { AccumulationChart } from '../accumulation';
import { AnimationModel } from '../../common/model/base-model';
import { Animation, AnimationOptions, animationMode, createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Index } from '../../common/model/base';
/**
 * The `PieSeries` module is used to render the `Pie` series.
 */
export class PieSeries extends PieBase {
    /**
     * To get path option, degree, symbolLocation from the point.
     *
     * @private
     * @param {AccPoints} point - The point data.
     * @param {AccumulationSeries} series - The series of the chart.
     * @param {AccumulationChart} chart - The accumulation chart control.
     * @param {PathOption} option - The rendering options for the point.
     * @param {Element} seriesGroup - The group element to contain the series elements.
     * @param {boolean} redraw - Specifies whether to redraw the series.
     * @param {string} previousRadius - Specifies the previous radius of the pie when animating the individual series point.
     * @param {Object[]} previousCenter - Specifies the previous center of the pie when animating the individual series point.
     * @param {boolean} pointAnimation - Specifies whether the point based animation is enabled.
     * @returns {void}
     */
    public renderPoint(
        point: AccPoints, series: AccumulationSeries, chart: AccumulationChart, option: PathOption,
        seriesGroup: Element, redraw?: boolean, previousRadius?: number, previousCenter?: ChartLocation, pointAnimation?: boolean
    ): void {
        const sum: number = series.sumOfPoints;
        const seriesPoints : AccPoints[] = this.accumulation.visibleSeries[0].points;
        const borderRadius: number = series.borderRadius;
        point.startAngle = this.startAngle;
        const yValue: number = point.visible ? point.y : 0;
        const degree: number = (sum) ? ((Math.abs(yValue) / sum) * (this.totalAngle)) : null;
        const start: number = Math.PI / 180 * ((90 - (360 - this.startAngle)) - 90);
        this.radius = this.isRadiusMapped ? stringToNumber(point.sliceRadius, this.seriesRadius) : this.radius;
        option.d = this.getPathOption(point, degree, this.startAngle % 360, borderRadius, seriesPoints);
        point.midAngle = (this.startAngle - (degree / 2)) % 360;
        point.endAngle = this.startAngle % 360;
        point.symbolLocation = degreeToLocation(point.midAngle, (this.radius + this.innerRadius) / 2, this.center);
        if (!redraw) {
            const element: Element = chart.renderer.drawPath(option);
            element.setAttribute('role', 'img');
            element.setAttribute('tabindex', point.index === 0 ? '0' : '-1');
            element.setAttribute('aria-label', (point.x + ': ' + point.y + '%. ' + series.name));
            seriesGroup.appendChild(element);
            point.degree = degree;
            point.start = start;
        } else {
            const element: Element = chart.renderer.drawPath(option);
            if (!point.isExplode && pointAnimation) {
                element.setAttribute('transform', 'translate(0, 0)');
            }
            element.setAttribute('role', 'img');
            element.setAttribute('tabindex', point.index === 0 ? '0' : '-1');
            element.setAttribute('aria-label', (point.x + ': ' + point.y + '%. ' + series.name));
            if (point.degree === undefined) {
                point.degree = degree;
                point.start = start;
            }
            seriesGroup.appendChild(element);
            this.refresh(point, degree, start, chart, option, borderRadius, seriesPoints, previousRadius, previousCenter, pointAnimation);
        }
    }

    public findSeries(e: PointerEvent | TouchEvent, borderRadius: number): void {
        const borderGap: number = 3; // Gap between pie/doughnut chart and border
        const width: number = 2; // width of the border
        const radius: number = this.innerRadius === 0 ? this.radius + borderGap : this.innerRadius - borderGap;
        const innerRadius: number = this.innerRadius === 0 ? radius + width : radius - width;
        this.toggleInnerPoint(e, radius, innerRadius, borderRadius);
    }


    public toggleInnerPoint(event: PointerEvent | TouchEvent, radius: number, innerRadius: number, borderRadius: number): void {
        const target: Element = event.target as Element;
        const id: Index = indexFinder(target.id, true);
        const accumulationId: string = (event.target as Element).id.substring(0, ((event.target as Element).id.indexOf('Series') - 1));
        let borderElement: Element = document.getElementById(this.accumulation.element.id + 'PointHover_Border');
        let createBorderEle: Element;
        const seriesPoints : AccPoints[] = this.accumulation.visibleSeries[0].points;
        const seriesIndex: number = id.series;
        const pointIndex: number = id.point;
        const srcElem: Element = getElement(accumulationId + '_Series_' + seriesIndex + '_Point_' + pointIndex);
        if (!isNaN(id.series) && srcElem) {
            if (!isNullOrUndefined(seriesIndex) && !isNaN(seriesIndex) && !isNullOrUndefined(pointIndex) && !isNaN(pointIndex)) {
                const point: AccPoints = this.accumulation.visibleSeries[0].points[pointIndex as number];
                const opacity: number = srcElem.getAttribute('class') === accumulationId + '_ej2_deselected' ?
                    this.accumulation.tooltip.enable ? 0.5 : 0.3 : this.accumulation.tooltip.enable ? 0.5 : 1;
                const innerPie: string = this.getPathArc(
                    this.accumulation.pieSeriesModule.center,
                    point.startAngle % 360,
                    (point.startAngle + point.degree) % 360,
                    radius,
                    innerRadius,
                    borderRadius,
                    true,
                    seriesPoints);
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
                        if (borderExplode) { createBorderEle.setAttribute('transform', borderExplode); }
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
        point: AccPoints, degree: number, start: number, chart: AccumulationChart, option: PathOption,
        borderRadius?: number, seriesPoints?: AccPoints[], previousRadius?: number, previouCenter?: ChartLocation,
        pointAnimation?: boolean): void {
        const seriesElement: Element = getElement(option.id);
        const duration: number = chart.duration ? chart.duration : 300;
        new Animation({}).animate(createElement('div'), {
            duration: duration,
            delay: 0,
            progress: (args: AnimationOptions): void => {
                const curentDegree: number = linear(args.timeStamp, point.degree, (degree - point.degree), args.duration);
                let currentStartAngle: number = linear(args.timeStamp, point.start, start - point.start, args.duration);
                currentStartAngle = ((currentStartAngle / (Math.PI / 180)) + 360) % 360;
                if (previousRadius && previouCenter) {
                    const currentRadius: number = linear(args.timeStamp, previousRadius, (this.radius - previousRadius), args.duration);
                    const previouCenterx: number = linear(args.timeStamp, previouCenter.x, (this.center.x - previouCenter.x),
                                                          args.duration);
                    const previouCentery: number = linear(args.timeStamp, previouCenter.y, (this.center.y - previouCenter.y),
                                                          args.duration);
                    seriesElement.setAttribute('d', this.getPathOption(point, curentDegree, currentStartAngle, borderRadius, seriesPoints, currentRadius, previouCenterx, previouCentery));
                }
                else {
                    seriesElement.setAttribute('d', this.getPathOption(point, curentDegree, currentStartAngle, borderRadius, seriesPoints));
                }
                if (point.isExplode) {
                    chart.accBaseModule.explodePoints(point.index, chart, true, pointAnimation);
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
     *
     * @param {AccPoints} point - The point data.
     * @param {number} degree - The angle of the point.
     * @param {number} startAngle - The start angle of the slice.
     * @param {number} borderRadius - The border radius of the arc.
     * @param {AccPoints[]} seriesPoints - The points of the series.
     * @param {number} previouRadius - The previous radius of the pie.
     * @param {number} previousCenterX - The previous center x of the pie.
     * @param {number} previousCenterY - The previous center y of the pie.
     * @returns {string} - Returns the path option.
     */
    private getPathOption(point: AccPoints, degree: number, startAngle: number,
                          borderRadius?: number, seriesPoints?: AccPoints[], previouRadius?: number,
                          previousCenterX?: number, previousCenterY?: number): string {
        if (!degree) {
            return '';
        }
        const path: string = this.getPathArc(
            previousCenterX ? {x: previousCenterX, y: previousCenterY} : this.center,
            startAngle % 360, (startAngle + degree) % 360,
            this.isRadiusMapped ? stringToNumber(point.sliceRadius, this.size / 2) : previouRadius ? previouRadius : this.radius,
            this.innerRadius,
            borderRadius,
            false,
            seriesPoints
        );
        //const path: string = this.getPathArc(this.center, startAngle % 360, (startAngle + degree) % 360, this.radius, this.innerRadius);
        this.startAngle += degree;
        return path;
    }
    /**
     * To animate the pie series.
     *
     * @private
     * @param {AccumulationChart} accumulation - The accumulation chart control.
     * @param {AnimationModel} option - The animation options.
     * @param {AccumulationSeries} series - The pie series.
     * @param {Element} slice - The slice element to animate.
     * @param {number} borderRadius - The border radius of the arc.
     * @param {AccPoints[]} seriesPoints - The points of the series.
     * @returns {void}
     */
    public animateSeries(accumulation: AccumulationChart, option: AnimationModel, series: AccumulationSeries, slice: Element,
                         borderRadius: number, seriesPoints?: AccPoints[]): void {
        const groupId: string = accumulation.element.id + 'SeriesGroup' + series.index;
        if (((series.animation.enable && animationMode !== 'Disable') || animationMode === 'Enable') && accumulation.animateSeries) {
            const clippath: Element = accumulation.renderer.createClipPath({ id: groupId + '_clipPath' });
            const path: PathOption = new PathOption(groupId + '_slice', 'transparent', 1, 'transparent', 1, '', '');
            const clipslice: Element = accumulation.renderer.drawPath(path);
            clippath.appendChild(clipslice);
            accumulation.svgObject.appendChild(clippath);
            // I263828 pie chart animation issue fixed for safari browser
            (slice as HTMLElement).style.cssText = 'clip-path:url(#' + clippath.id + '); -webkit-clip-path:url(#' + clippath.id + ');';
            this.doAnimation(clipslice, series, slice, borderRadius, seriesPoints);
        }
    }

    /**
     * To get the module name of the Pie series.
     *
     * @returns {string} - Returns the module name.
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
         * Destroy method calling here.
         */
    }
}
