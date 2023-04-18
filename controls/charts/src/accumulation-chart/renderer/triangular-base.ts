/* eslint-disable jsdoc/require-returns */
/* eslint-disable jsdoc/require-param */
/* eslint-disable valid-jsdoc */
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
 * TriangularBase is used to calculate base functions for funnel/pyramid series.
 */
export class TriangularBase extends AccumulationBase {
    /**
     * Initializes the properties of funnel/pyramid series
     *
     * @private
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
     * Initializes the size of the pyramid/funnel segments
     *
     * @private
     */
    protected initializeSizeRatio(points: AccPoints[], series: AccumulationSeries, reverse: boolean = false): void {

        const sumOfPoints: number = series.sumOfPoints;

        //Limiting the ratio within the range of 0 to 1
        const gapRatio: number = Math.min(Math.max(series.gapRatio, 0), 1);

        //% equivalence of a value 1
        const coEff: number = 1 / (sumOfPoints * (1 + gapRatio / (1 - gapRatio)));

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
     * Marks the label location from the set of points that forms a pyramid/funnel segment
     *
     * @private
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
     * Finds the path to connect the list of points
     *
     * @private
     */
    protected findPath(locations: ChartLocation[]): string {
        let path: string = 'M';
        for (let i: number = 0; i < locations.length; i++) {
            path += locations[i as number].x + ' ' + locations[i as number].y;
            if (i !== locations.length - 1) {
                path += ' L';
            }
        }
        return path + ' Z';
    }

    /**
     * To calculate data-label bounds
     *
     * @private
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
