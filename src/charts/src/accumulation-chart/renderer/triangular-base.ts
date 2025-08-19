/**
 * Defines the common behavior of funnel and pyramid series
 */

import { AccPoints, AccumulationSeries } from '../model/acc-base';
import { Rect, Size } from '@syncfusion/ej2-svg-base';
import { stringToNumber, ChartLocation } from '../../common/utils/helper';
import { AccumulationChart } from '../accumulation';
import { AccumulationLabelPosition } from '../model/enum';
import { AccumulationBase } from './accumulation-base';

/**
 * The `TriangularBase` module is used to calculate base functions for funnel and pyramid series.
 *
 * @private
 */
export class TriangularBase extends AccumulationBase {
    /**
     * Initializes the properties of funnel/pyramid series.
     *
     * @private
     * @param {AccumulationChart} chart - The accumulation chart control.
     * @param {AccumulationSeries} series - The series for which to initialize properties.
     * @returns {void}
     */
    public initProperties(chart: AccumulationChart, series: AccumulationSeries): void {
        const actualChartArea: Size = chart.initialClipRect;
        series.triangleSize = new Size(stringToNumber(series.width, actualChartArea.width),
                                       stringToNumber(series.height, actualChartArea.height));

        series.neckSize = new Size(stringToNumber(series.neckWidth, actualChartArea.width),
                                   stringToNumber(series.neckHeight, actualChartArea.height));

        this.defaultLabelBound(series, series.dataLabel.visible, series.dataLabel.position, chart);

        if (series.explodeOffset === '30%') {
            series.explodeOffset = '25px';
        }
        chart.explodeDistance = stringToNumber(series.explodeOffset, actualChartArea.width);
        const points: AccPoints[] = series.points;

        this.initializeSizeRatio(points, series);
    }

    /**
     * Initializes the size of the pyramid/funnel segments.
     *
     * @private
     * @param {AccPoints[]} points - The points to initialize the segment size.
     * @param {AccumulationSeries} series - The series for which to initialize properties.
     * @param {boolean} reverse - Indicates whether the pyramid/funnel segments should be reversed.
     * @returns {void}
     */
    protected initializeSizeRatio(points: AccPoints[], series: AccumulationSeries, reverse: boolean = false): void {

        const sumOfPoints: number = series.sumOfPoints;

        //Limiting the ratio within the range of 0 to 1
        const gapRatio: number = Math.min(Math.max(series.gapRatio, 0), 1);

        //% equivalence of a value 1
        const coEff: number = (sumOfPoints !== 0) ?  1 / (sumOfPoints * (1 + gapRatio / (1 - gapRatio))) : 0;

        const spacing: number = gapRatio / (points.length - 1);
        let y: number = 0;

        //starting from bottom
        for (let i: number = points.length - 1; i >= 0; i--) {
            const index: number = reverse ? points.length - 1 - i : i;
            if (points[index as number].visible) {
                const height: number = coEff * points[index as number].y;
                points[index as number].yRatio = y; points[index as number].heightRatio = height;
                y += height + spacing;
            }
        }
    }

    /**
     * Marks the label location from the set of points that forms a pyramid/funnel segment.
     *
     * @private
     * @param {AccumulationSeries} series - The series for which to mark label locations.
     * @param {AccPoints} point - The point to mark the label location.
     * @param {ChartLocation[]} points - The set of points that forms a pyramid/funnel segment.
     * @returns {void}
     */
    protected setLabelLocation(series: AccumulationSeries, point: AccPoints, points: ChartLocation[]): void {

        const last: number = points.length - 1;
        const bottom: number = series.type === 'Funnel' ? points.length - 2 : points.length - 1;

        const x: number = (points[0].x + points[bottom as number].x) / 2;
        const right: number = (points[1].x + points[bottom - 1].x) / 2;


        point.region = new Rect(x, points[0].y, right - x, points[bottom as number].y - points[0].y);

        point.symbolLocation = {
            x: point.region.x + point.region.width / 2,
            y: point.region.y + point.region.height / 2
        };

        point.labelOffset = {
            x: point.symbolLocation.x - (points[0].x + points[last as number].x) / 2,
            y: point.symbolLocation.y - (points[0].y + points[last as number].y) / 2
        };
    }

    /**
     * Finds the path to connect the list of points.
     *
     * @param {ChartLocation[]} locations - An array of ChartLocation objects representing the points to connect.
     * @param {AccPoints} point - The current AccPoints object containing the data point information.
     * @param {string} path - The initial path string to be modified.
     * @param {number} firstIndex - The index of the first point in the path.
     * @param {number} lastIndex - The index of the last point in the path.
     * @param {AccumulationSeries} series - The series object of the Accumulation.
     * @returns {string} - This string represent the path value of the D attribute.
     * @Private
     */
    protected getPath(
        locations: ChartLocation[],
        point: AccPoints,
        path: string,
        firstIndex: number,
        lastIndex: number,
        series: AccumulationSeries
    ): string {
        const length: number = series.points.length;
        let borderRadius: number = series.borderRadius;
        const min: number = Math.min(point.region.width, point.region.height);
        let funnelMinimum: number = Math.min(series.neckSize.height, series.neckSize.width);
        if (funnelMinimum === 0) {
            funnelMinimum = series.neckSize.height === 0 && series.neckSize.width === 0 ?
                point.region.height : (series.neckSize.width === 0 ? series.neckSize.height : series.neckSize.width);
        }
        borderRadius = borderRadius > min / 2 ? min / 2 : borderRadius;
        if (series.type === 'Funnel') {
            borderRadius = (borderRadius > funnelMinimum / 2) ? funnelMinimum / 2 : borderRadius;
        }
        const angle: number = Math.atan2(locations[1].x - locations[2].x, locations[1].y - locations[2].y);
        const temp: number = borderRadius;
        if (series.type === 'Pyramid') {
            borderRadius = (point.index === lastIndex && length !== 1 && firstIndex !== lastIndex) ? 0 : borderRadius;
            path += (locations[0].x - (temp * Math.sin(-angle))) + ' ' + (locations[0].y + (-temp * Math.cos(angle))) + ' Q' + locations[0].x + ' ' + locations[0].y + ' '
                + (locations[0].x + (borderRadius * Math.sin(-angle))) + ' ' + (locations[0].y + (-borderRadius * Math.cos(-angle)));
            path += ' L' + (locations[1].x + (borderRadius * Math.sin(-angle))) + ' ' + (locations[1].y + (-borderRadius * Math.cos(angle)));
            borderRadius = point.index === lastIndex ? temp : 0;
            path += ' L' + (locations[2].x - (temp * Math.sin(-angle))) + ' ' + (locations[2].y - (-temp * Math.cos(angle))) + ' Q' + locations[2].x + ' ' + locations[2].y
                + ' ' + (locations[2].x - borderRadius) + ' ' + locations[2].y;
            path += ' L' + (locations[3].x + borderRadius) + ' ' + locations[3].y + ' Q' + locations[3].x + ' ' + locations[3].y + ' '
                + (locations[3].x + (temp * Math.sin(-angle))) + ' ' + (locations[3].y - (-temp * Math.cos(angle)));
        }
        if (series.type === 'Funnel') {

            borderRadius = (point.index === firstIndex && length !== 1 && firstIndex !== lastIndex) ? 0 : borderRadius;
            path += locations[0].x + (-(borderRadius * Math.sin(-angle))) + ' ' + (locations[0].y + (-borderRadius * Math.cos(angle))) + ' Q' + locations[0].x
                + ' ' + locations[0].y + ' ' + (locations[0].x + borderRadius) + ' ' + locations[0].y;
            path += ' L' + (locations[1].x - borderRadius) + ' ' + locations[1].y + ' Q' + locations[1].x + ' '
                + locations[1].y + ' ' + (locations[1].x - ((borderRadius * Math.sin(angle)))) + ' ' + (locations[1].y + (-borderRadius * Math.cos(angle)));
            borderRadius = point.index === firstIndex ? temp : 0;
            if (series.neckWidth === '0%') {
                const middle: number = (locations[5].x + (locations[3].x - locations[5].x) / 2);
                path += ' L' + (locations[2].x + (-borderRadius * Math.sin(-angle))) + ' ' + (locations[2].y - (-borderRadius * Math.cos(angle)))
                    + ' Q' + middle + ' ' + locations[2].y + ' ' + (locations[5].x - (-borderRadius * Math.sin(-angle))) + ' ' + (locations[2].y - (-borderRadius * Math.cos(angle)));
            }
            else {
                path = series.neckHeight !== '0%' && locations[2].y !== locations[3].y ? path += ' L' + locations[2].x + ' ' + (locations[2].y) : path;
                const tempX: number = series.neckHeight === '0%' ? ((borderRadius * Math.sin(-angle))) : 0;
                const tempY: number = series.neckHeight === '0%' ? (-borderRadius * Math.cos(angle)) : borderRadius;
                path += ' L' + (locations[3].x - (tempX)) + ' ' + (locations[3].y - (tempY)) + ' Q' + locations[3].x + ' ' + locations[3].y + ' '
                    + (locations[3].x - tempY) + ' ' + locations[3].y;
                path += ' L' + (locations[4].x + tempY) + ' ' + locations[4].y + ' Q' + locations[4].x + ' ' + locations[4].y + ' '
                    + (locations[4 + 1].x + tempX) + ' ' + (locations[4].y - tempY);
                path = series.neckHeight !== '0%' && locations[4].y !== locations[5].y ? path += ' L' + locations[5].x + ' ' + (locations[5].y) : path;
            }
        }
        return path;
    }

    /**
     * Creates a path to connect a list of points.
     *
     * @param {ChartLocation[]} locations - An array of ChartLocation objects representing the points to connect.
     * @param {AccPoints} point - The current AccPoints object containing the data point information.
     * @param {AccumulationSeries} series - The series object of the Accumulation.
     * @returns {string} - This string represent the path value of the D attribute.
     * @Private
     */
    protected findPath(locations: ChartLocation[], point?: AccPoints, series?: AccumulationSeries): string {
        let path: string = 'M ';
        let firstIndex: number = -1;
        let lastIndex: number = -1;
        for (let index: number = 0; index < series.points.length; index++) {
            if (series.points[index as number].visible) {
                if (firstIndex === -1) {
                    firstIndex = index;
                }
                lastIndex = index;
            }
        }
        if (series.borderRadius && (point.index === lastIndex || point.index === firstIndex)) {
            path = this.getPath(locations, point, path, firstIndex, lastIndex, series);
        }
        else {
            for (let i: number = 0; i < locations.length; i++) {
                path += locations[i as number].x + ' ' + locations[i as number].y;
                if (i !== locations.length - 1) {
                    path += ' L ';
                }
            }
        }
        return path + ' Z ';

    }

    /**
     * To calculate data-label bounds.
     *
     * @private
     * @param {AccumulationSeries} series - The series for which to calculate data-label bounds.
     * @param {boolean} visible - Specifies whether the data-labels are visible.
     * @param {AccumulationLabelPosition} position - The position of the data-labels.
     * @param {AccumulationChart} chart - The accumulation chart control.
     * @returns {void}
     */
    public defaultLabelBound(series: AccumulationSeries, visible: boolean, position: AccumulationLabelPosition,
                             chart: AccumulationChart): void {
        const x: number = (chart.initialClipRect.width - series.triangleSize.width) / 2;
        const y: number = (chart.initialClipRect.height - series.triangleSize.height) / 2;

        const accumulationBound: Rect = new Rect(x, y, series.triangleSize.width, series.triangleSize.height);
        series.labelBound = new Rect(
            accumulationBound.x,
            accumulationBound.y,
            accumulationBound.width + accumulationBound.x,
            accumulationBound.height + accumulationBound.y
        );
        series.accumulationBound = accumulationBound;
        if (visible && position === 'Outside') {
            series.labelBound = new Rect(Infinity, Infinity, -Infinity, -Infinity);
        }
    }
}
