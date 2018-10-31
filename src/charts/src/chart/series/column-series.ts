import { Rect, withInRange } from '../../common/utils/helper';
import { Chart } from '../chart';
import { DoubleRange } from '../utils/double-range';
import { Series } from './chart-series';
import { ColumnBase } from './column-base';
import { IPointRenderEventArgs } from '../../common/model/interface';

/**
 * `ColumnSeries` Module used to render the column series.
 */
export class ColumnSeries extends ColumnBase {

    /**
     * Render Column series.
     * @return {void}
     * @private
     */

    public render(series: Series): void {
        let rect: Rect;
        let sideBySideInfo: DoubleRange = this.getSideBySideInfo(series);
        let origin: number = Math.max(<number>series.yAxis.visibleRange.min, 0);
        let argsData: IPointRenderEventArgs;
        for (let pointColumn of series.points) {
            pointColumn.symbolLocations = [];
            pointColumn.regions = [];
            if (
                pointColumn.visible && withInRange(
                    series.points[pointColumn.index - 1], pointColumn,
                    series.points[pointColumn.index + 1], series
                )
            ) {
                rect = this.getRectangle(
                    pointColumn.xValue + sideBySideInfo.start, pointColumn.yValue,
                    pointColumn.xValue + sideBySideInfo.end, origin, series
                );
                let color: string = series.category === 'Indicator' ? pointColumn.color : series.interior;
                argsData = this.triggerEvent(
                    series, pointColumn, color,
                    { width: series.border.width, color: series.border.color }
                );
                if (!argsData.cancel) {
                    this.updateSymbolLocation(pointColumn, rect, series);
                    this.drawRectangle(series, pointColumn, rect, argsData);
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
     * Get module name.
     */
    protected getModuleName(): string {
        return 'ColumnSeries';
        /**
         * return the module name
         */
    }

    /**
     * To destroy the column series. 
     * @return {void}
     * @private
     */

    public destroy(chart: Chart): void {
        /**
         * Destroy method performed here
         */
    }
} 