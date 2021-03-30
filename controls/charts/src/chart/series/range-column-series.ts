/* eslint-disable valid-jsdoc */
/* eslint-disable jsdoc/require-returns */
import { withInRange } from '../../common/utils/helper';
import { Rect } from '@syncfusion/ej2-svg-base';
import { DoubleRange } from '../utils/double-range';
import { Series } from './chart-series';
import { ColumnBase } from './column-base';
import { IPointRenderEventArgs } from '../../chart/model/chart-interface';
/**
 * `RangeColumnSeries` module is used to render the range column series.
 */
export class RangeColumnSeries extends ColumnBase {

    /**
     * Render Range Column series.
     *
     * @returns {void}
     * @private
     */

    public render(series: Series): void {
        let rect: Rect;
        const sideBySideInfo: DoubleRange = this.getSideBySideInfo(series);
        //let origin: number = Math.max(<number>series.yAxis.visibleRange.min, 0);
        let argsData: IPointRenderEventArgs;
        for (const rangePoint of series.points) {
            rangePoint.symbolLocations = []; rangePoint.regions = [];
            if (rangePoint.visible && withInRange(series.points[rangePoint.index - 1], rangePoint, series.points[rangePoint.index + 1],
                                                  series)) {
                rect = this.getRectangle(rangePoint.xValue + sideBySideInfo.start, <number>rangePoint.high,
                                         rangePoint.xValue + sideBySideInfo.end, <number>rangePoint.low, series);

                argsData = this.triggerEvent(series, rangePoint, series.interior,
                                             { width: series.border.width, color: series.border.color });
                if (!argsData.cancel) {
                    this.updateSymbolLocation(rangePoint, rect, series);
                    this.drawRectangle(series, rangePoint, rect, argsData);
                }
            }
        }
        this.renderMarker(series);
    }

    /**
     * Get module name.
     */
    protected getModuleName(): string {
        return 'RangeColumnSeries';
        /**
         * return the module name
         */
    }

    /**
     * Animates the series.
     *
     * @param  {Series} series - Defines the series to animate.
     * @returns {void}
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
         * Destroy method performed here
         */
    }
}
