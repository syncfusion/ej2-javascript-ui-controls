import { Rect, StackValues, withInRange } from '../../common/utils/helper';
import { Chart } from '../chart';
import { DoubleRange } from '../utils/double-range';
import { Series } from './chart-series';
import { ColumnBase } from './column-base';
import { IPointRenderEventArgs } from '../../common/model/interface';

/**
 * `StackingColumnSeries` module used to render the stacking column series.
 */
export class StackingColumnSeries extends ColumnBase {

    /**
     * Render the Stacking column series.
     * @return {void}
     * @private
     */
    public render(series: Series): void {
        series.isRectSeries = true;
        let sideBySideInfo: DoubleRange = this.getSideBySideInfo(series);
        let rect: Rect;
        let argsData: IPointRenderEventArgs;
        let stackedValue: StackValues = series.stackedValues;
        for (let point of series.points) {
            point.symbolLocations = [];
            point.regions = [];
            if (point.visible && withInRange(series.points[point.index - 1], point, series.points[point.index + 1], series)) {
                rect = this.getRectangle(point.xValue + sideBySideInfo.start, stackedValue.endValues[point.index],
                                         point.xValue + sideBySideInfo.end, stackedValue.startValues[point.index], series);
                argsData = this.triggerEvent(series, point, series.interior,
                                             { width: series.border.width, color: series.border.color });
                if (!argsData.cancel) {
                    this.drawRectangle(series, point, rect, argsData);
                    this.updateSymbolLocation(point, rect, series);
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
     * To destroy the stacking column. 
     * @return {void}
     * @private
     */
    public destroy(chart: Chart): void {
        /**
         * Destroy method performed here
         */
    }
    /**
     * Get module name.
     */
    protected getModuleName(): string {
        return 'StackingColumnSeries';
    }
}


