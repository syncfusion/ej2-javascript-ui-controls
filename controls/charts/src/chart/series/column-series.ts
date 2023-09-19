/* eslint-disable valid-jsdoc */
/* eslint-disable jsdoc/require-returns */
import { withInRange } from '../../common/utils/helper';
import { Rect } from '@syncfusion/ej2-svg-base';
import { DoubleRange } from '../utils/double-range';
import { Series } from './chart-series';
import { ColumnBase } from './column-base';
import { IPointRenderEventArgs } from '../../chart/model/chart-interface';

export interface CylinderSeriesOption {
    'isColumn': boolean,
    'stacking': boolean,
    'isLastSeries': boolean
}

/**
 * `ColumnSeries` Module used to render the column series.
 */
export class ColumnSeries extends ColumnBase {

    /**
     * Render Column series.
     *
     * @returns {void}
     * @private
     */
    public rect: Rect;
    public render(series: Series): void {
        const sideBySideInfo: DoubleRange = this.getSideBySideInfo(series);
        const origin: number = Math.max(<number>series.yAxis.visibleRange.min, 0);
        let argsData: IPointRenderEventArgs;
        for (const pointColumn of series.points) {
            pointColumn.symbolLocations = [];
            pointColumn.regions = [];
            if (
                pointColumn.visible && withInRange(
                    series.points[pointColumn.index - 1], pointColumn,
                    series.points[pointColumn.index + 1], series
                )
            ) {
                this.rect = this.getRectangle(
                    pointColumn.xValue + sideBySideInfo.start, pointColumn.yValue,
                    pointColumn.xValue + sideBySideInfo.end, origin, series
                );
                this.rect.width = series.columnWidthInPixel ? series.columnWidthInPixel : this.rect.width;
                this.rect.x = series.columnWidthInPixel ? this.rect.x - (((series.columnWidthInPixel / 2) * series.rectCount) -
                    (series.columnWidthInPixel * series.index)) : this.rect.x;
                const color: string = series.category === 'Indicator' ? pointColumn.color : series.interior;
                argsData = this.triggerEvent(
                    series, pointColumn, color,
                    { width: series.border.width, color: series.border.color }
                );
                if (!argsData.cancel) {
                    this.updateSymbolLocation(pointColumn, this.rect, series);
                    this.drawRectangle(series, pointColumn, this.rect, argsData);
                    if (series.columnFacet === 'Cylinder') {
                        const cylinderSeriesOption: CylinderSeriesOption = {
                            'isColumn': true,
                            'stacking': false,
                            'isLastSeries': true
                        };
                        this.drawCylinder(this.options, this.element, cylinderSeriesOption, this.rect, series);
                    }
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
