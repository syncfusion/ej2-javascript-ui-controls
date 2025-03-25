/**
 * Defines the behavior of a funnel series
 */

import { AccPoints, AccumulationSeries } from '../model/acc-base';
import { Size, PathOption, Rect } from '@syncfusion/ej2-svg-base';
import { ChartLocation, ColorValue, appendChildElement, colorNameToHex, convertHexToColor, getElement, removeElement } from '../../common/utils/helper';
import { AccumulationChart } from '../accumulation';
import { TriangularBase } from './triangular-base';

/**
 * The `FunnelSeries` module is used to render the `Funnel` Series.
 */
export class FunnelSeries extends TriangularBase {
    /**
     * Defines the path of a funnel segment
     *
     * @private
     * @param {AccPoints} point - The point data.
     * @param {AccumulationSeries} series - The series for which the segment is rendered.
     * @param {AccumulationChart} chart - The accumulation chart control.
     * @returns {string} - Get segment data.
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

        const direction: string = this.findPath(polygon, point, series);

        return direction;
    }

    /**
     * Renders a funnel segment.
     *
     * @private
     * @param {AccPoints} point - The point data.
     * @param {AccumulationSeries} series - The series for which the segment is rendered.
     * @param {AccumulationChart} chart - The accumulation chart control.
     * @param {PathOption} options - The rendering options for the segment.
     * @param {Element} seriesGroup - The group element to contain the funnel segments.
     * @param {boolean} redraw - Specifies whether to redraw the segment.
     * @param {string} previousRadius - Specifies the previous radius of the pie when animating the individual series point.
     * @param {Object[]} previousCenter - Specifies the previous center of the pie when animating the individual series point.
     * @param {boolean} pointAnimation - Specifies whether the point based animation is enabled.
     * @returns {void}
     */
    public renderPoint(
        point: AccPoints, series: AccumulationSeries, chart: AccumulationChart, options: PathOption,
        seriesGroup: Element, redraw: boolean, previousRadius?: number, previousCenter?: ChartLocation,
        pointAnimation?: boolean
    ): void {
        if (!point.visible) {
            removeElement(options.id);
            return null;
        }
        let previousDirection: string;
        const direction: string = this.getSegmentData(point, series, chart);
        point.midAngle = 0;
        options.d = direction;
        if (pointAnimation && document.getElementById(options.id)) {
            previousDirection = document.getElementById(options.id).getAttribute('d');
        }
        const element: Element = chart.renderer.drawPath(options);
        element.setAttribute('role', series.accessibility.accessibilityRole ? series.accessibility.accessibilityRole : 'img');
        element.setAttribute('tabindex', (point.index === 0 && series.accessibility.focusable) ? String(series.accessibility.tabIndex) : '-1');
        element.setAttribute('aria-label', series.accessibility.accessibilityDescription ? series.accessibility.accessibilityDescription : (point.x + ':' + point.y + '%. ' + series.name));
        appendChildElement(
            false, seriesGroup, element, redraw, pointAnimation ? pointAnimation : undefined, pointAnimation ? 'x' : undefined, pointAnimation ? 'y' : undefined,
            undefined, pointAnimation ? previousDirection : undefined, undefined, undefined, undefined,
            pointAnimation ? chart.duration : undefined
        );
        if (point.isExplode) {
            chart.accBaseModule.explodePoints(point.index, chart, true);
        }
    }

    /**
     * Renders the Trapezoidal funnel series in an accumulation chart.
     *
     * @param {AccumulationSeries} series - The series data for the Trapezoidal  funnel.
     * @param {AccPoints[]} points - The data points for the series.
     * @param {AccumulationChart} chart - The instance of the accumulation chart.
     * @param {PathOption[]} options - The path options for rendering the Trapezoidal funnel.
     * @param {Element} seriesGroup - The group element for the series.
     * @param {boolean} redraw - Specifies whether to redraw the series.
     * @returns {void} - This method does not return a value.
     */
    public renderTrapezoidalFunnel(
        series: AccumulationSeries, points: AccPoints[], chart: AccumulationChart,
        options: PathOption[], seriesGroup: Element, redraw: boolean): void {
        const funnelWidth: number = series.triangleSize.width;
        const funnelHeight: number = series.triangleSize.height;
        const horizontalMargin: number = (chart.initialClipRect.width - funnelWidth) / 2;
        const leftMargin: number = horizontalMargin + chart.initialClipRect.x;
        const funnelTop: number = chart.initialClipRect.y + (chart.initialClipRect.height - funnelHeight) / 2;
        const maxPointValue: number = Math.max(...points.map((d: AccPoints) => d.y));
        const barPadding: number = 10;
        let currentVerticalOffset: number = 0;
        const polygonGroup: Element = redraw ? getElement(chart.element.id + '_Series_' + series.index + '_Polygon') :
            chart.renderer.createGroup({ id: chart.element.id + '_Series_' + series.index + '_Polygon' });
        for (let i: number = 0; i < series.points.length; i++) {
            const point: AccPoints = series.points[i as number];
            const pathOption: PathOption = options[point.index];
            if (!point.visible) {
                removeElement(pathOption.id);
                removeElement(pathOption.id + '_polygon');
                continue;
            }
            const availableHeight: number = funnelHeight - barPadding * (points.length - 1);
            const barHeight: number = availableHeight / points.length;
            const barWidth: number = funnelWidth * (point.y / maxPointValue);
            const visiblePointIndex: number = points.indexOf(point);
            const nextBarWidth: number = visiblePointIndex < points.length - 1 ?
                funnelWidth * (points[visiblePointIndex + 1].y / maxPointValue) : 0;
            const x: number = leftMargin + (funnelWidth - barWidth) / 2;
            const y: number = funnelTop + currentVerticalOffset;
            const cornerRadius: number = Math.min(series.borderRadius, barHeight / 2);
            const rectPath: string =
            'M' + (x + cornerRadius) + ' ' + y + ' ' +
            'L' + (x + barWidth - cornerRadius) + ' ' + y + ' ' +
            'A' + cornerRadius + ' ' + cornerRadius + ' 0 0 1 ' + (x + barWidth) + ' ' + (y + cornerRadius) + ' ' +
            'L' + (x + barWidth) + ' ' + (y + barHeight - cornerRadius) + ' ' +
            'A' + cornerRadius + ' ' + cornerRadius + ' 0 0 1 ' + (x + barWidth - cornerRadius) + ' ' + (y + barHeight) + ' ' +
            'L' + (x + cornerRadius) + ' ' + (y + barHeight) + ' ' +
            'A' + cornerRadius + ' ' + cornerRadius + ' 0 0 1 ' + x + ' ' + (y + barHeight - cornerRadius) + ' ' +
            'L' + x + ' ' + (y + cornerRadius) + ' ' +
            'A' + cornerRadius + ' ' + cornerRadius + ' 0 0 1 ' + (x + cornerRadius) + ' ' + y + ' ' +
            'Z';
            point.midAngle = 0;
            pathOption.d = rectPath;
            const element: Element = chart.renderer.drawPath(pathOption);
            element.setAttribute('role', series.accessibility.accessibilityRole ? series.accessibility.accessibilityRole : 'img');
            element.setAttribute('tabindex', (point.index === 0 && series.accessibility.focusable) ? String(series.accessibility.tabIndex) : '-1');
            element.setAttribute('aria-label', series.accessibility.accessibilityDescription ? series.accessibility.accessibilityDescription : (point.x + ':' + point.y + '%. ' + series.name));
            appendChildElement(false, seriesGroup, element, redraw);
            if (visiblePointIndex < points.length - 1) {
                const polygonOption: PathOption = new PathOption(
                    pathOption.id + '_polygon',
                    this.lightenColor(pathOption.fill),
                    pathOption['stroke-width'] * 0.4, this.lightenColor(pathOption.stroke), pathOption.opacity,
                    pathOption['stroke-dasharray'], ''
                );
                const trapezoidPoints: number[][] = [
                    [(funnelWidth - barWidth) / 2 + leftMargin + cornerRadius, y + barHeight],
                    [(funnelWidth + barWidth) / 2 + leftMargin - cornerRadius, y + barHeight],
                    [(funnelWidth + nextBarWidth) / 2 + leftMargin, y + barHeight + barPadding],
                    [(funnelWidth - nextBarWidth) / 2 + leftMargin, y + barHeight + barPadding]
                ];
                const trapezoidPath: string = '' +
                    'M' + trapezoidPoints[0][0] + ' ' + trapezoidPoints[0][1] + ' ' +
                    'L' + trapezoidPoints[1][0] + ' ' + trapezoidPoints[1][1] + ' ' +
                    'L' + trapezoidPoints[2][0] + ' ' + trapezoidPoints[2][1] + ' ' +
                    'L' + trapezoidPoints[3][0] + ' ' + trapezoidPoints[3][1] + ' ' + 'Z';

                polygonOption.d = trapezoidPath;
                const polygon: Element = chart.renderer.drawPath(polygonOption);
                appendChildElement(false, polygonGroup, polygon, redraw);
            } else {
                removeElement(pathOption.id + '_polygon');
            }
            currentVerticalOffset += barHeight + barPadding;
            point.region = new Rect(x, y, barWidth, barHeight);
            point.symbolLocation = {
                x: point.region.x + point.region.width / 2,
                y: point.region.y + point.region.height / 2
            };
            point.labelOffset = {
                x: point.symbolLocation.x + point.region.width / 2,
                y: point.symbolLocation.y + point.region.height / 2
            };
            if (point.isExplode) {
                chart.accBaseModule.explodePoints(point.index, chart, true);
            }
        }
        appendChildElement(false, chart.getSeriesElement(), seriesGroup, redraw);
        appendChildElement(false, chart.getSeriesElement(), polygonGroup, redraw);
    }

    /**
     * Function to lighten a color by blending it with white.
     *
     * @param {string} color - The main color in hex format (e.g., '#1e90ff').
     * @returns {string} - The lightened color in hex format.
     */
    public lightenColor(color: string): string {
        const rgbValue: ColorValue = convertHexToColor(colorNameToHex(color));
        return 'rgb(' + rgbValue.r + ',' + rgbValue.g + ',' + rgbValue.b + ',' + 0.4 + ')';
    }

    /**
     * To get the module name of the funnel series.
     *
     * @returns {string} - Get module name.
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
         * Destroys the funnel series.
         */
    }

}
