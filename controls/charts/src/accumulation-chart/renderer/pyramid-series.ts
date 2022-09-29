/* eslint-disable jsdoc/require-returns */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable jsdoc/require-param */
/* eslint-disable valid-jsdoc */
/**
 * Defines the behavior of a pyramid series
 */

import { AccPoints, AccumulationSeries } from '../model/acc-base';
import { PathOption, Size, removeElement } from '@syncfusion/ej2-svg-base';
import { ChartLocation, appendChildElement } from '../../common/utils/helper';
import { AccumulationChart } from '../accumulation';
import { TriangularBase } from './triangular-base';

/**
 * PyramidSeries module used to render `Pyramid` Series.
 */
export class PyramidSeries extends TriangularBase {

    /**
     * Defines the path of a pyramid segment
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

        const direction: string = this.findPath(polygon);

        return direction;
    }

    /**
     * Initializes the size of the pyramid segments
     *
     * @private
     */
    protected initializeSizeRatio(points: AccPoints[], series: AccumulationSeries): void {
        if (series.pyramidMode === 'Linear') {
            super.initializeSizeRatio(points, series, true);
        } else { this.calculateSurfaceSegments(series); }
    }

    /**
     * Defines the size of the pyramid segments, the surface of that will reflect the values
     */
    private calculateSurfaceSegments(series: AccumulationSeries): void {
        const count: number = series.points.length;
        const sumOfValues: number = series.sumOfPoints;
        const y: number[] = [];
        const height: number[] = [];
        const gapRatio: number = Math.min(0, Math.max(series.gapRatio, 1));
        const gapHeight: number = gapRatio / (count - 1);
        const preSum: number = this.getSurfaceHeight(0, sumOfValues);
        let currY: number = 0;

        for (let i: number = 0; i < count; i++) {
            if (series.points[i].visible) {
                y[i] = currY;
                height[i] = this.getSurfaceHeight(currY, Math.abs(series.points[i].y));
                currY += height[i] + gapHeight * preSum;
            }
        }

        const coef: number = 1 / (currY - gapHeight * preSum);
        for (let i: number = 0; i < count; i++) {
            if (series.points[i].visible) {
                series.points[i].yRatio = coef * y[i];
                series.points[i].heightRatio = coef * height[i];
            }
        }
    }

    /**
     * Finds the height of pyramid segment
     */
    private getSurfaceHeight(y: number, surface: number): number {
        const result: number = this.solveQuadraticEquation(1, 2 * y, -surface);
        return result;
    }

    /**
     * Solves quadratic equation
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
     * Renders a pyramid segment
     */
    private renderPoint(
        point: AccPoints, series: AccumulationSeries, chart: AccumulationChart,
        options: PathOption, seriesGroup: Element, redraw: boolean
    ): void {
        if (!point.visible) {
            removeElement(options.id);
            return null;
        }
        options.d = this.getSegmentData(point, series, chart);
        point.midAngle = 0;
        let element: Element = chart.renderer.drawPath(options);
        element.setAttribute("tabindex", point.index === 0 ? "0" : "");
        element.setAttribute('aria-label', (point.x + ": " + point.y + '%. ' + series.name));
        appendChildElement(false, seriesGroup, element, redraw);
        if (point.isExplode) {
            chart.accBaseModule.explodePoints(point.index, chart, true);
        }
    }


    /**
     * To get the module name of the Pyramid series.
     */
    protected getModuleName(): string {
        return 'PyramidSeries';
    }

    /**
     * To destroy the pyramid series
     *
     * @returns {void}
     * @private
     */

    public destroy(): void {
        /**
         * Destroys the pyramid series
         */
    }

}
