import { Rect, withInRange } from '../../common/utils/helper';
import { Chart } from '../chart';
import { DoubleRange } from '../utils/double-range';
import { Series } from './chart-series';
import { ColumnBase } from './column-base';
import { IPointRenderEventArgs } from '../../common/model/interface';
/**
 * `RangeColumnSeries` module is used to render the range column series.
 */
export class RangeColumnSeries extends ColumnBase {

    /**
     * Render Range Column series.
     * @return {void}
     * @private
     */

    public render(series: Series): void {
        let rect: Rect;
        let sideBySideInfo: DoubleRange = this.getSideBySideInfo(series);
        //let origin: number = Math.max(<number>series.yAxis.visibleRange.min, 0);
        let argsData: IPointRenderEventArgs;
        for (let rangePoint of series.points) {
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
     * @param  {Series} series - Defines the series to animate.
     * @return {void}
     */

    public doAnimation(series: Series): void {
        this.animate(series);
    }




    /**
     * To destroy the range column series.
     * @return {void}
     * @private
     */

    public destroy(chart: Chart): void {
        /**
         * Destroy method performed here
         */
    }
}