import { withInRange } from '../../common/utils/helper';
import { Rect } from '@syncfusion/ej2-svg-base';
import { DoubleRange } from '../utils/double-range';
import { Points, Series } from './chart-series';
import { ColumnBase } from './column-base';
import { IPointRenderEventArgs } from '../../chart/model/chart-interface';
import { CylinderSeriesOption } from './column-series';

/**
 * `BarSeries` module is used to render the bar series.
 */
export class BarSeries extends ColumnBase {

    public rect: Rect;
    public sideBySideInfo: DoubleRange[] = [];

    /**
     * Render Bar series.
     *
     * @param {Series} series - Defines the series.
     * @returns {void}
     * @private
     */
    public render(series: Series): void {
        const origin: number = Math.max(series.yAxis.visibleRange.min, 0);
        this.sideBySideInfo[series.index] = this.getSideBySideInfo(series);
        for (const pointBar of series.points) {
            this.renderPoint(series, pointBar, this.sideBySideInfo[series.index], origin);
        }
        this.renderMarker(series);
    }

    public renderPoint(series: Series, pointBar: Points, sideBySideInfo: DoubleRange, origin: number): void {
        pointBar.symbolLocations = [];
        pointBar.regions = [];
        if (pointBar.visible && withInRange(series.points[pointBar.index - 1], pointBar, series.points[pointBar.index + 1], series)) {
            this.rect = this.getRectangle(pointBar.xValue + sideBySideInfo.start, pointBar.yValue,
                                          pointBar.xValue + sideBySideInfo.end, origin, series);
            this.rect.height = series.columnWidthInPixel ? series.columnWidthInPixel : this.rect.height;
            this.rect.y = series.columnWidthInPixel ? this.rect.y - (((series.columnWidthInPixel / 2) * series.rectCount) -
                (series.columnWidthInPixel * series.index)) : this.rect.y;
            const argsData: IPointRenderEventArgs = this.triggerEvent(series, pointBar, series.interior,
                                                                      { width: series.border.width, color: series.border.color });
            if (!argsData.cancel) {
                this.updateSymbolLocation(pointBar, this.rect, series);
                this.drawRectangle(series, pointBar, this.rect, argsData);
                if (series.columnFacet === 'Cylinder') {
                    const cylinderSeriesOption: CylinderSeriesOption = {
                        'isColumn': false,
                        'stacking': false,
                        'isLastSeries': true
                    };
                    this.drawCylinder(this.options, this.element, cylinderSeriesOption, this.rect, series);
                }
            }
        }
    }

    public updateDirection(series: Series, point: number[], isInverted: boolean): void {
        const origin: number = Math.max(series.yAxis.visibleRange.min, 0);
        for (let i: number = 0; i < point.length; i++) {
            this.renderPoint(series, series.points[point[i as number]], this.sideBySideInfo[series.index], origin);
            if (series.marker && series.marker.visible) {
                series.chart.markerRender.renderMarker(series, series.points[point[i as number]],
                                                       series.points[point[i as number]].symbolLocations[0], null, true);
            }
            if (series.marker.dataLabel.visible && series.chart.dataLabelModule) {
                series.chart.dataLabelModule.commonId = series.chart.element.id + '_Series_' + series.index + '_Point_';
                const dataLabelElement: Element[] = series.chart.dataLabelModule.renderDataLabel(series, series.points[point[i as number]],
                                                                                                 null, series.marker.dataLabel);
                for (let j: number = 0; j < dataLabelElement.length; j++) {
                    series.chart.dataLabelModule.doDataLabelAnimation(series, dataLabelElement[j as number]);
                }
            }
        }
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
         * Destroy method performed here.
         */
    }

    /**
     * Get module name.
     *
     * @returns {string} - Returns the module name.
     */
    protected getModuleName(): string {
        return 'BarSeries';
    }
}
