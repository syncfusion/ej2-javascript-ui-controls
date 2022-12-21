/* eslint-disable valid-jsdoc */
/* eslint-disable jsdoc/require-param */
import { withInRange } from '../../common/utils/helper';
import { Rect } from '@syncfusion/ej2-svg-base';
import { DoubleRange } from '../utils/double-range';
import { Series } from './chart-series';
import { ColumnBase } from './column-base';
import { IPointRenderEventArgs } from '../../chart/model/chart-interface';

/**
 * `BarSeries` module is used to render the bar series.
 */
export class BarSeries extends ColumnBase {
    /**
     * Render Bar series.
     *
     * @returns {void}
     * @private
     */
    public render(series: Series): void {
        const origin: number = Math.max(series.yAxis.visibleRange.min, 0);
        const sideBySideInfo: DoubleRange = this.getSideBySideInfo(series);
        let rect: Rect;
        let argsData: IPointRenderEventArgs;
        for (const pointBar of series.points) {
            pointBar.symbolLocations = [];
            pointBar.regions = [];
            if (pointBar.visible && withInRange(series.points[pointBar.index - 1], pointBar, series.points[pointBar.index + 1], series)) {
                rect = this.getRectangle(pointBar.xValue + sideBySideInfo.start, pointBar.yValue,
                                         pointBar.xValue + sideBySideInfo.end, origin, series);
                rect.height = series.columnWidthInPixel ? series.columnWidthInPixel : rect.height;
                rect.y = series.columnWidthInPixel ? rect.y - (((series.columnWidthInPixel / 2) * series.rectCount) -
                    (series.columnWidthInPixel * series.index)) : rect.y;
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
     *
     * @param  {Series} series - Defines the series to animate.
     * @returns {void}
     */
    public doAnimation(series: Series): void {
        this.animate(series);
    }
    /**
     * To destroy the bar series.
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
     * Get module name
     */

    protected getModuleName(): string {
        return 'BarSeries';
    }
}
