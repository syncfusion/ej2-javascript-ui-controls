/* eslint-disable jsdoc/require-returns */
/* eslint-disable valid-jsdoc */
/* eslint-disable jsdoc/require-param */
import { withInRange } from '../../common/utils/helper';
import { DoubleRange } from '../utils/double-range';
import { Series, Points } from './chart-series';
import { ColumnBase } from './column-base';
import { IPointRenderEventArgs } from '../../chart/model/chart-interface';
import { BorderModel } from '../../common/model/base-model';
import { Rect } from '@syncfusion/ej2-svg-base';

/**
 * `HiloSeries` module is used to render the hilo series.
 */
export class HiloSeries extends ColumnBase {

    /**
     * Render Hiloseries.
     *
     * @returns {void}
     * @private
     */

    public render(series: Series): void {
        let region: Rect;
        const sideBySideInfo: DoubleRange = this.getSideBySideInfo(series);
        let argsData: IPointRenderEventArgs;
        for (const point of series.points) {
            point.symbolLocations = []; point.regions = [];
            if (
                point.visible &&
                withInRange(series.points[point.index - 1], point, series.points[point.index + 1], series)
            ) {
                region = this.getRectangle(
                    point.xValue + sideBySideInfo.median, <number>point.high,
                    point.xValue + sideBySideInfo.median, <number>point.low, series
                );
                argsData = this.triggerPointRenderEvent(series, point);
                if (!argsData.cancel) {
                    if (!series.chart.requireInvertedAxis) {
                        region.width = argsData.border.width;
                        region.x = region.x - (region.width / 2);
                    } else {
                        region.height = argsData.border.width;
                        region.y = region.y - (region.height / 2);
                    }
                    argsData.border.width = 0;
                    this.updateSymbolLocation(point, region, series);
                    this.drawRectangle(series, point, region, argsData);
                }
            }
        }
    }

    /**
     * To trigger the point rendering event.
     *
     * @returns {void}
     * @private
     */
    private triggerPointRenderEvent(series: Series, point: Points): IPointRenderEventArgs {
        const border: BorderModel = { color: series.fill, width: Math.max(series.border.width, 2) };
        return super.triggerEvent(series, point, series.interior, border);
    }



    /**
     * Get module name.
     */
    protected getModuleName(): string {
        return 'HiloSeries';
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
     * To destroy the Hilo series.
     *
     * @returns {void}
     * @private
     */

    public destroy(): void {
        /**
         * Destroys the Hilo Series
         */
    }
}
