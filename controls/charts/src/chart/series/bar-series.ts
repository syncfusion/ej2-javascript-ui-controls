import { Rect, withInRange } from '../../common/utils/helper';
import { Chart } from '../chart';
import { DoubleRange } from '../utils/double-range';
import { Series } from './chart-series';
import { ColumnBase } from './column-base';
import { IPointRenderEventArgs } from '../../common/model/interface';

/**
 * `BarSeries` module is used to render the bar series.
 */
export class BarSeries extends ColumnBase {
    /**
     * Render Bar series.
     * @return {void}
     * @private
     */
    public render(series: Series): void {
        let origin: number = Math.max(series.yAxis.visibleRange.min, 0);
        let sideBySideInfo: DoubleRange = this.getSideBySideInfo(series);
        let rect: Rect;
        let argsData: IPointRenderEventArgs;
        for (let pointBar of series.points) {
            pointBar.symbolLocations = [];
            pointBar.regions = [];
            if (pointBar.visible && withInRange(series.points[pointBar.index - 1], pointBar, series.points[pointBar.index + 1], series)) {
                rect = this.getRectangle(pointBar.xValue + sideBySideInfo.start, pointBar.yValue,
                                         pointBar.xValue + sideBySideInfo.end, origin, series);
                argsData = this.triggerEvent(series, pointBar, series.interior,
                                             { width: series.border.width, color: series.border.color });
                if (!argsData.cancel) {
                    this.updateSymbolLocation(pointBar, rect, series);
                    this.drawRectangle(series, pointBar, rect, argsData);
                }
            }
        }
        this.renderMarker(series);
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
     * To destroy the bar series. 
     * @return {void}
     * @private
     */

    protected destroy(chart: Chart): void {
        /**
         * Destroy method performed here
         */
    }

    /**
     * Get module name
     */

    protected getModuleName(): string {
        return 'BarSeries';
    }
}