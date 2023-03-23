/* eslint-disable jsdoc/require-param */
/* eslint-disable valid-jsdoc */
/**
 * Defines the behavior of a funnel series
 */

import { AccPoints, AccumulationSeries } from '../model/acc-base';
import { Size, PathOption } from '@syncfusion/ej2-svg-base';
import { ChartLocation, appendChildElement, removeElement } from '../../common/utils/helper';
import { AccumulationChart } from '../accumulation';
import { TriangularBase } from './triangular-base';

/**
 * FunnelSeries module used to render `Funnel` Series.
 */
export class FunnelSeries extends TriangularBase {
    /**
     * Defines the path of a funnel segment
     *
     * @private
     * @returns {string} Get segment data.
     */
    private getSegmentData(point: AccPoints, series: AccumulationSeries, chart: AccumulationChart): string {
        let lineWidth: number;
        let topRadius: number;
        let bottomRadius: number;
        let endTop: number;
        let endBottom: number;
        let minRadius: number;
        let endMin: number;
        let bottomY: number;

        const area: Size = series.triangleSize;
        const offset: number = 0;

        const extraSpace: number = (chart.initialClipRect.width - series.triangleSize.width) / 2;
        const emptySpaceAtLeft: number = extraSpace + chart.initialClipRect.x;
        const seriesTop: number = chart.initialClipRect.y + (chart.initialClipRect.height - area.height) / 2;

        //defines the top and bottom of a segment
        let top: number = point.yRatio * area.height;
        let bottom: number = top + point.heightRatio * area.height;

        const neckSize: Size = series.neckSize;

        lineWidth = neckSize.width + (area.width - neckSize.width) * ((area.height - neckSize.height - top) /
            (area.height - neckSize.height));

        topRadius = (area.width / 2) - lineWidth / 2;

        //Calculating the middle slope change and bottom
        endTop = topRadius + lineWidth;

        if (bottom > area.height - neckSize.height || area.height === neckSize.height) {
            lineWidth = neckSize.width;
        } else {
            lineWidth = neckSize.width + (area.width - neckSize.width) *
                ((area.height - neckSize.height - bottom) / (area.height - neckSize.height));
        }

        bottomRadius = (area.width / 2) - (lineWidth / 2);
        endBottom = bottomRadius + lineWidth;

        if (top >= area.height - neckSize.height) {
            topRadius = bottomRadius = minRadius = (area.width / 2) - neckSize.width / 2;
            endTop = endBottom = endMin = (area.width / 2) + neckSize.width / 2;

        } else if (bottom > (area.height - neckSize.height)) {
            minRadius = bottomRadius = (area.width / 2) - lineWidth / 2;
            endMin = endBottom = minRadius + lineWidth;
            bottomY = area.height - neckSize.height;
        }

        top += seriesTop;
        bottom += seriesTop;
        bottomY += seriesTop;

        const line1: ChartLocation = { x: emptySpaceAtLeft + offset + topRadius, y: top };
        const line2: ChartLocation = { x: emptySpaceAtLeft + offset + endTop, y: top };
        const line4: ChartLocation = { x: emptySpaceAtLeft + offset + endBottom, y: bottom };
        const line5: ChartLocation = { x: emptySpaceAtLeft + offset + bottomRadius, y: bottom };
        let line3: ChartLocation = { x: emptySpaceAtLeft + offset + endBottom, y: bottom };
        let line6: ChartLocation = { x: emptySpaceAtLeft + offset + bottomRadius, y: bottom };
        if (bottomY) {
            line3 = { x: emptySpaceAtLeft + offset + endMin, y: bottomY };
            line6 = { x: emptySpaceAtLeft + offset + minRadius, y: bottomY };
        }

        const polygon: ChartLocation[] = [line1, line2, line3, line4, line5, line6];

        this.setLabelLocation(series, point, polygon);

        const direction: string = this.findPath(polygon);

        return direction;
    }

    /**
     * Renders a funnel segment
     *
     * @private
     * @returns {void} Render point.
     */
    public renderPoint(
        point: AccPoints, series: AccumulationSeries, chart: AccumulationChart, options: PathOption,
        seriesGroup: Element, redraw: boolean
    ): void {
        if (!point.visible) {
            removeElement(options.id);
            return null;
        }
        const direction: string = this.getSegmentData(point, series, chart);
        point.midAngle = 0;
        options.d = direction;
        const element: Element = chart.renderer.drawPath(options);
        element.setAttribute('role', 'img');
        element.setAttribute('tabindex', point.index === 0 ? '0' : '');
        element.setAttribute('aria-label', (point.x + ':' + point.y + '%. ' + series.name));
        appendChildElement(false, seriesGroup, element, redraw);
        if (point.isExplode) {
            chart.accBaseModule.explodePoints(point.index, chart, true);
        }
    }


    /**
     * To get the module name of the funnel series.
     *
     * @returns {string} Get module name.
     */
    protected getModuleName(): string {
        return 'FunnelSeries';
    }

    /**
     * To destroy the funnel series.
     *
     * @returns {void} Destroy method.
     * @private
     */

    public destroy(): void {
        /**
         * Destroys the funnel series
         */
    }

}
