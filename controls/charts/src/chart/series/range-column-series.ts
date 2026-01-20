import { ChartLocation, withInRange } from '../../common/utils/helper';
import { Rect } from '@syncfusion/ej2-svg-base';
import { DoubleRange } from '../utils/double-range';
import { Points, Series } from './chart-series';
import { ColumnBase } from './column-base';
import { IPointRenderEventArgs } from '../../chart/model/chart-interface';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
/**
 * The `RangeColumnSeries` module is used to render the range column series.
 */
export class RangeColumnSeries extends ColumnBase {
    public sideBySideInfo: DoubleRange[] = [];
    /**
     * Renders the Range Column series.
     *
     * @param {Series} series - The series to render.
     * @returns {void}
     * @private
     */
    public render(series: Series): void {
        this.sideBySideInfo[series.index] = this.getSideBySideInfo(series);
        //let origin: number = Math.max(<number>series.yAxis.visibleRange.min, 0);
        for (const rangePoint of series.points) {
            this.renderPoint(series, rangePoint, this.sideBySideInfo[series.index]);
        }
        this.renderMarker(series);
    }

    public renderPoint(series: Series, rangePoint: Points, sideBySideInfo: DoubleRange): void {
        let rect: Rect;
        rangePoint.symbolLocations = []; rangePoint.regions = [];
        if (rangePoint.visible && withInRange(series.points[rangePoint.index - 1], rangePoint, series.points[rangePoint.index + 1],
                                              series)) {
            rect = this.getRectangle(rangePoint.xValue + sideBySideInfo.start, <number>rangePoint.high,
                                     rangePoint.xValue + sideBySideInfo.end, <number>rangePoint.low, series);
            rect.width = series.columnWidthInPixel ? series.columnWidthInPixel : rect.width;
            if (series.columnWidthInPixel) {
                if (series.chart.columns.length === 1) {
                    rect.x =
                        rect.x -
                        ((series.columnWidthInPixel / 2) * (isNullOrUndefined(series.rectCount) ? 0 : series.rectCount)) -
                        (series.columnWidthInPixel * (isNullOrUndefined(series.index) ? 0 : series.index));
                } else {
                    rect.x = rect.x + rect.width / 2 - series.columnWidthInPixel;
                }
            }
            const argsData: IPointRenderEventArgs = this.triggerEvent(series, rangePoint, series.interior,
                                                                      { width: series.border.width, color: series.border.color });
            if (!argsData.cancel) {
                this.updateSymbolLocation(rangePoint, rect, series);
                this.drawRectangle(series, rangePoint, rect, argsData);
            }
        }
    }

    public updateDirection(series: Series, point: number[]): void {
        for (let i: number = 0; i < point.length; i++) {
            this.renderPoint(series, series.points[point[i as number]], this.sideBySideInfo[series.index]);
            if (series.marker && series.marker.visible) {
                series.points[point[i as number]].symbolLocations.map((location: ChartLocation, index: number) => {
                    series.chart.markerRender.renderMarker(series, series.points[point[i as number]], location, index, true);
                });
            }
            if (series.marker.dataLabel.visible && series.chart.dataLabelModule) {
                series.chart.dataLabelModule.commonId = series.chart.element.id + '_Series_' + series.index + '_Point_';
                series.chart.dataLabelModule.renderDataLabel(series, series.points[point[i as number]],
                                                             null, series.marker.dataLabel);
            }
        }
    }

    /**
     * Get module name.
     *
     * @returns {string} - Returns the module name.
     */
    protected getModuleName(): string {
        return 'RangeColumnSeries';
        /**
         * return the module name.
         */
    }

    /**
     * Animates the series.
     *
     * @param  {Series} series - Defines the series to animate.
     * @returns {void}
     * @private
     */
    public doAnimation(series: Series): void {
        this.animate(series);
    }

    /**
     * To destroy the range column series.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        /**
         * Destroy method performed here.
         */
    }
}
