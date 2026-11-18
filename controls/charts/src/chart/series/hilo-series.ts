import { withInRange } from '../../common/utils/helper';
import { DoubleRange } from '../utils/double-range';
import { Series, Points } from './chart-series';
import { ColumnBase } from './column-base';
import { IPointRenderEventArgs } from '../../chart/model/chart-interface';
import { BorderModel } from '../../common/model/base-model';
import { Rect } from '@syncfusion/ej2-svg-base';

/**
 * The `HiloSeries` module is used to render the hilo series.
 */
export class HiloSeries extends ColumnBase {
    public sideBySideInfo: DoubleRange[] = [];
    /**
     * Render Hiloseries.
     *
     * @returns {void}
     * @private
     */

    public render(series: Series): void {
        this.sideBySideInfo[series.index] = this.getSideBySideInfo(series);
        for (const point of series.points) {
            this.renderPoint(series, point, this.sideBySideInfo[series.index]);
        }
    }
    public renderPoint(series: Series, point: Points, sideBySideInfo: DoubleRange): void {
        point.symbolLocations = []; point.regions = [];
        let region: Rect;
        if (
            point.visible &&
            withInRange(series.points[point.index - 1], point, series.points[point.index + 1], series)
        ) {
            region = this.getRectangle(
                point.xValue + sideBySideInfo.median, <number>point.high,
                point.xValue + sideBySideInfo.median, <number>point.low, series
            );
            const argsData: IPointRenderEventArgs = this.triggerPointRenderEvent(series, point);
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

    public updateDirection(series: Series, point: number[]): void {
        for (let i: number = 0; i < point.length; i++) {
            this.renderPoint(series, series.points[point[i as number]], this.sideBySideInfo[series.index]);
            if (series.marker.dataLabel.visible && series.chart.dataLabelModule) {
                series.chart.dataLabelModule.commonId = series.chart.element.id + '_Series_' + series.index + '_Point_';
                series.chart.dataLabelModule.renderDataLabel(series, series.points[point[i as number]],
                                                             null, series.marker.dataLabel);
            }
        }
    }

    /**
     * Triggers the point render event for the specified series and data point.
     *
     * @param {Series} series - The series associated with the point.
     * @param {Points} point - The data point.
     * @returns {IPointRenderEventArgs} The event arguments.
     */
    private triggerPointRenderEvent(series: Series, point: Points): IPointRenderEventArgs {
        const border: BorderModel = { color: series.fill, width: Math.max(series.border.width, 2) };
        return super.triggerEvent(series, point, series.interior, border);
    }



    /**
     * Get module name.
     *
     * @returns {string} - Returns the module name.
     */
    protected getModuleName(): string {
        return 'HiloSeries';
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
     * To destroy the Hilo series.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        /**
         * Destroys the Hilo Series.
         */
    }
}
