import { Chart3D } from '../chart3D';
import { Chart3DSeries, Chart3DPoint } from './chart-series';
import { Chart3DStyleOptions, Chart3DVector, Chart3DLocation, Chart3DPointRenderEventArgs, Chart3DRangeValues, Chart3DDepthInfoType  } from '../model/chart3d-Interface';
import { pointRender } from '../../common/model/constants';
export class ColumnSeries3D {
    /**
     * Draws the column 3D series on a 3D chart.
     *
     * @param {Chart3DSeries} series - The 3D series to be drawn.
     * @param {Chart3D} chart - The 3D chart on which the series will be drawn.
     * @returns {void}
     */
    public draw(series: Chart3DSeries, chart: Chart3D): void {
        this.createSegments(series);
        for (let i: number = 0; i < series.visiblePoints.length; i++) {
            const point: Chart3DPoint = series.visiblePoints[i as number];
            if (point.visible) {
                const argsData: Chart3DPointRenderEventArgs = {
                    cancel: false, series: series, point: point,
                    fill: series.setPointColor(point, series.interior)
                };
                chart.trigger(pointRender, argsData);
                point.color = argsData.fill;
                point.plans = null;
                if (!argsData.cancel) {
                    this.update(argsData.series, argsData.point, i, chart);
                } else {
                    point.symbolLocations = null;
                }
            }
        }
    }

    /**
     * Updates a specific point in a column series on a 3D chart.
     *
     * @param {Chart3DSeries} series - The 3D series to which the point belongs.
     * @param {Chart3DPoint} point - The point to be updated.
     * @param {number} pointIndex - The index of the point within the series.
     * @param {Chart3D} chart - The 3D chart to which the series and point belong.
     * @returns {void}
     */
    private update(series: Chart3DSeries, point: Chart3DPoint, pointIndex: number, chart: Chart3D): void {
        const seriesIndex: number = series.index;
        const left: number =  point.left;
        const right: number = point.right;
        const bottom: number = series.yAxis.valueType === 'Logarithmic' ? Math.pow(series.yAxis.logBase, series.yAxis.visibleRange.min) : series.yAxis.visibleRange.min;
        const top: number = series.yAxis.valueType === 'Logarithmic' ? Math.pow(series.yAxis.logBase, series.yAxis.visibleRange.max) : series.yAxis.visibleRange.max;
        const xStart: number = series.xAxis.visibleRange.min;
        const xEnd: number = series.xAxis.visibleRange.max;

        if (!((left >= xStart) && (left <= xEnd)) || !((right >= xStart) && (right <= xEnd))) {
            return;
        }
        let topValue: number;
        if (point.top < 0) {
            topValue = (point.top > bottom) ? point.top : bottom;
        } else {
            topValue = (series.yAxis.valueType && series.yAxis.valueType.toLowerCase() === 'logarithmic') ? point.top : (point.top < top) ? point.top : top;
        }
        const tlpoint: Chart3DLocation = chart.svg3DRenderer.transform3DToVisible(series, (point.left > xStart)
            ? point.left : xStart, topValue, chart);
        const rbpoint: Chart3DLocation = chart.svg3DRenderer.transform3DToVisible(series, (xEnd > point.right) ? point.right : xEnd,
                                                                                  (bottom > point.bottom) ? bottom : point.bottom, chart);
        const tlfVector: Chart3DVector = chart.vector.vector3D(Math.min(tlpoint.x, rbpoint.x), Math.min(tlpoint.y, rbpoint.y),
                                                               point.startDepth);
        const brbVector: Chart3DVector = chart.vector.vector3D(Math.max(tlpoint.x, rbpoint.x), Math.max(tlpoint.y, rbpoint.y),
                                                               point.endDepth);
        const styleOptions: Chart3DStyleOptions = series.setStyle(series);
        const name: string = 'region' + '-series-' + seriesIndex + '-point-' + pointIndex;
        const accessibilityText: string = point.x + ':' + point.yValue + ', ' + series.name;
        if (series.columnFacet === 'Cylinder') {
            chart.polygon.createCylinder(tlfVector, brbVector, chart, pointIndex, series.type, '',
                                         point.color, null, styleOptions.opacity,
                                         name, chart.chart3D);
        } else if (series.columnFacet === 'Rectangle') {
            chart.polygon.createBox(tlfVector, brbVector, chart, pointIndex,
                                    '', point.color, null,
                                    styleOptions.opacity, chart.requireInvertedAxis, name, chart.chart3D, accessibilityText);
        }
    }

    /**
     * Creates segments for a column series within a 3D chart.
     *
     * @param {Chart3DSeries} series - The 3D series for which segments will be created.
     * @returns {void}
     */
    public createSegments(series: Chart3DSeries): void {
        const xValues: number[] | null = series.getXValues(series.visiblePoints);
        const YValues: number[] | null = series.getYValues(series.visiblePoints);
        if (xValues == null || YValues == null) {
            return;
        }
        const sbsInfo: Chart3DRangeValues = series.getSideBySideInfo(series);
        const depthInfo: Chart3DDepthInfoType = series.getSegmentDepth(series);
        const crossValue: number = 0;
        const median: number = sbsInfo.delta / 2;
        const visiblePoints: Chart3DPoint[] = series.visiblePoints;
        const cons: number = 0.2;
        for (let i: number = 0; i < visiblePoints.length; i++) {
            const x1: number = xValues[i as number] + sbsInfo.start;
            const x2: number = xValues[i as number] + sbsInfo.end;
            const y1: number = YValues[i as number];
            const y2: number = crossValue;
            this.setData(x1, y1, x2, y2, depthInfo.start, depthInfo.end, series, visiblePoints[i as number]);
            if (!series.dataLabel.visible) {
                continue;
            }
            visiblePoints[i as number].symbolLocations = { x: 0, y: 0, z: 0 };
            switch (series.dataLabel.position) {
            case 'Top':
                visiblePoints[i as number].symbolLocations.x = x1 + median;
                visiblePoints[i as number].symbolLocations.y = y1;
                visiblePoints[i as number].symbolLocations.z = depthInfo.start;
                break;
            case 'Bottom':
                visiblePoints[i as number].symbolLocations.x = x1 + median;
                visiblePoints[i as number].symbolLocations.y = y2 - cons + series.yAxis.visibleRange.min;
                visiblePoints[i as number].symbolLocations.z = depthInfo.start + (depthInfo.end - depthInfo.start) / 2;
                break;
            default:
                visiblePoints[i as number].symbolLocations.x = x1 + median;
                visiblePoints[i as number].symbolLocations.y = Math.abs(y2 - y1) / 2 + (series.yAxis.visibleRange.min / 2);
                visiblePoints[i as number].symbolLocations.z = depthInfo.start;
                break;
            }
        }
    }

    /**
     * Sets data for a column series in a 3D chart.
     *
     * @param {number} x1 - The x-coordinate of the starting point of the segment.
     * @param {number} y1 - The y-coordinate of the starting point of the segment.
     * @param {number} x2 - The x-coordinate of the ending point of the segment.
     * @param {number} y2 - The y-coordinate of the ending point of the segment.
     * @param {number} start - The starting value of the segment on the axis.
     * @param {number} end - The ending value of the segment on the axis.
     * @param {Chart3DSeries} series - The 3D series to which the segment belongs.
     * @param {Chart3DPoint} point - The point associated with the segment.
     * @returns {void}
     */
    private setData(x1: number, y1: number, x2: number, y2: number, start: number, end: number,
                    series: Chart3DSeries, point: Chart3DPoint): void {
        point.left = x1;
        point.bottom = y2;
        point.top = y1;
        point.right = x2;
        point.startDepth = start;
        point.endDepth = end;
        point.xRange = series.getDoubleRange(point.left, point.right);
        if (!isNaN(point.top) && !isNaN(point.bottom)) {
            point.yRange = series.getDoubleRange(point.top, point.bottom);
        }
    }

    /**
     * To destroy the column series.
     *
     * @returns {void}
     * @private
     */
    protected destroy(): void {
        /**
         * Destroy method performed here
         */
    }

    /**
     * Gets the module name for the Column3D series.
     *
     * @returns {string} - Returns the module name for the Column3D series.
     */
    protected getModuleName(): string {
        return 'ColumnSeries3D';
        /**
         * return the module name
         */
    }
}
