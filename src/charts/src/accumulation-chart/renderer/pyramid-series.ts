/**
 * Defines the behavior of a pyramid series
 */

import { AccPoints, AccumulationSeries } from '../model/acc-base';
import { PathOption, Size, removeElement } from '@syncfusion/ej2-svg-base';
import { ChartLocation, appendChildElement } from '../../common/utils/helper';
import { AccumulationChart } from '../accumulation';
import { TriangularBase } from './triangular-base';

/**
 * The `PyramidSeries` module is used to render the `Pyramid` series.
 */
export class PyramidSeries extends TriangularBase {

    /**
     * Defines the path of a pyramid segment.
     *
     * @param {AccPoints} point - The points to initialize the segment size.
     * @param {AccumulationSeries} series - The series for which to define the path.
     * @param {AccumulationChart} chart - The accumulation chart control.
     * @returns {string} - The path of the pyramid segment.
     */
    private getSegmentData(point: AccPoints, series: AccumulationSeries, chart: AccumulationChart): string {

        const area: Size = series.triangleSize;

        //top of th series
        const seriesTop: number = chart.initialClipRect.y + (chart.initialClipRect.height - area.height) / 2;

        //consider, if the point is exploded
        const offset: number = 0;
        const extraSpace: number = (chart.initialClipRect.width - series.triangleSize.width) / 2;
        const emptySpaceAtLeft: number = extraSpace + chart.initialClipRect.x;

        //top and bottom
        let top: number = point.yRatio;
        let bottom: number = point.yRatio + point.heightRatio;

        //width of the top and bottom edge
        const topRadius: number = 0.5 * (1 - point.yRatio);
        const bottomRadius: number = 0.5 * (1 - bottom);

        top += seriesTop / area.height;
        bottom += seriesTop / area.height;

        const line1: ChartLocation = {
            x: emptySpaceAtLeft + offset + topRadius * area.width,
            y: top * area.height
        };
        const line2: ChartLocation = {
            x: emptySpaceAtLeft + offset + (1 - topRadius) * area.width,
            y: top * area.height
        };
        const line3: ChartLocation = {
            x: emptySpaceAtLeft + offset + (1 - bottomRadius) * area.width,
            y: bottom * area.height
        };
        const line4: ChartLocation = {
            x: emptySpaceAtLeft + offset + bottomRadius * area.width,
            y: bottom * area.height
        };

        const polygon: ChartLocation[] = [line1, line2, line3, line4];

        this.setLabelLocation(series, point, polygon);

        const direction: string = this.findPath(polygon, point, series);

        return direction;
    }

    /**
     * Initializes the size of the pyramid segments.
     *
     * @private
     * @param {AccPoints[]} points - The points to initialize the segment size.
     * @param {AccumulationSeries} series - The series for which to initialize properties.
     * @returns {void}
     */
    protected initializeSizeRatio(points: AccPoints[], series: AccumulationSeries): void {
        if (series.pyramidMode === 'Linear') {
            super.initializeSizeRatio(points, series, true);
        } else { this.calculateSurfaceSegments(series); }
    }

    /**
     * Defines the size of the pyramid segments, the surface of that will reflect the values.
     *
     * @param {AccumulationSeries} series - The series for which to initialize properties.
     * @returns {void}
     */
    private calculateSurfaceSegments(series: AccumulationSeries): void {
        const count: number = series.points.length;
        const sumOfValues: number = series.sumOfPoints;
        const y: number[] = [];
        const height: number[] = [];
        const gapRatio: number = Math.min(0, Math.max(series.gapRatio, 1));
        const gapHeight: number = series.points.length > 1 ? gapRatio / (count - 1) : 0;
        const preSum: number = this.getSurfaceHeight(0, sumOfValues);
        let currY: number = 0;

        for (let i: number = 0; i < count; i++) {
            if (series.points[i as number].visible) {
                y[i as number] = currY;
                height[i as number] = this.getSurfaceHeight(currY, Math.abs(series.points[i as number].y));
                currY += height[i as number] + gapHeight * preSum;
            }
        }

        const coef: number = 1 / (currY - gapHeight * preSum);
        for (let i: number = 0; i < count; i++) {
            if (series.points[i as number].visible) {
                series.points[i as number].yRatio = coef * y[i as number];
                series.points[i as number].heightRatio = coef * height[i as number];
            }
        }
    }

    /**
     * Finds the height of pyramid segment.
     *
     * @param {number} y - The y-coordinate of the segment's point.
     * @param {number} surface - The surface area of the segment that reflects the values.
     * @returns {number} - The height of the pyramid segment.
     */
    private getSurfaceHeight(y: number, surface: number): number {
        const result: number = this.solveQuadraticEquation(1, 2 * y, -surface);
        return result;
    }

    /**
     * Solves quadratic equation.
     *
     * @param {number} a - Coefficient.
     * @param {number} b - Coefficient.
     * @param {number} c - Coefficient.
     * @returns {number} - The height of the pyramid segment.
     */
    private solveQuadraticEquation(a: number, b: number, c: number): number {
        let root1: number;
        let root2: number;

        const d: number = b * b - 4 * a * c;

        if (d >= 0) {
            const sd: number = Math.sqrt(d);

            root1 = (-b - sd) / (2 * a);
            root2 = (-b + sd) / (2 * a);
            return Math.max(root1, root2);
        }
        return 0;
    }
    /**
     * Renders a pyramid segment.
     *
     * @param {AccPoints} point - The point data.
     * @param {AccumulationSeries} series - The series of the chart.
     * @param {AccumulationChart} chart - The accumulation chart control.
     * @param {PathOption} options - The rendering options for the segment.
     * @param {Element} seriesGroup - The group element to contain the segment.
     * @param {boolean} redraw - Specifies whether to redraw the segment.
     * @param {string} previousRadius - Specifies the previous radius of the pie when animating the individual series point.
     * @param {Object[]} previousCenter - Specifies the previous center of the pie when animating the individual series point.
     * @param {boolean} pointAnimation - Specifies whether the point based animation is enabled.
     * @returns {void}
     */
    private renderPoint(
        point: AccPoints, series: AccumulationSeries, chart: AccumulationChart,
        options: PathOption, seriesGroup: Element, redraw: boolean, previousRadius?: number, previousCenter?: ChartLocation,
        pointAnimation?: boolean
    ): void {
        if (!point.visible) {
            removeElement(options.id);
            return null;
        }
        let previousDirection: string;
        options.d = this.getSegmentData(point, series, chart);
        if (pointAnimation && document.getElementById(options.id)) {
            previousDirection = document.getElementById(options.id).getAttribute('d');
        }
        point.midAngle = 0;
        const element: Element = chart.renderer.drawPath(options);
        element.setAttribute('role', 'img');
        element.setAttribute('tabindex', point.index === 0 ? '0' : '-1');
        element.setAttribute('aria-label', (point.x + ': ' + point.y + '%. ' + series.name));
        appendChildElement(false, seriesGroup, element, redraw, pointAnimation ? pointAnimation : undefined, pointAnimation ?  'x' : undefined, pointAnimation ? 'y' : undefined, undefined, pointAnimation ? previousDirection : undefined, undefined, undefined, undefined, pointAnimation ? chart.duration : undefined);
        if (point.isExplode) {
            chart.accBaseModule.explodePoints(point.index, chart, true);
        }
    }


    /**
     * To get the module name of the Pyramid series.
     *
     * @returns {string} - Returns the module name.
     */
    protected getModuleName(): string {
        return 'PyramidSeries';
    }

    /**
     * To destroy the pyramid series.
     *
     * @returns {void}
     * @private
     */

    public destroy(): void {
        /**
         * Destroys the pyramid series.
         */
    }

}
