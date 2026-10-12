import { getPoint, withInRange } from '../../common/utils/helper';
import { Rect } from '@syncfusion/ej2-svg-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { DoubleRange } from '../utils/double-range';
import { Points, Series } from './chart-series';
import { ColumnBase } from './column-base';
import { IPointRenderEventArgs } from '../../chart/model/chart-interface';

export interface CylinderSeriesOption {
    'isColumn': boolean,
    'stacking': boolean,
    'isLastSeries': boolean
}

/**
 * The `ColumnSeries` module is used to render the column series.
 */
export class ColumnSeries extends ColumnBase {
    public sideBySideInfo: DoubleRange[] = [];
    /**
     * Render Column series.
     *
     * @returns {void}
     * @private
     */
    public rect: Rect;
    public render(series: Series): void {
        this.sideBySideInfo[series.index] = this.getSideBySideInfo(series);
        const origin: number = Math.max(<number>series.yAxis.visibleRange.min, 0);
        for (const pointColumn of series.points) {
            this.renderPoint(series, pointColumn, this.sideBySideInfo[series.index], origin);
        }
        this.renderMarker(series);
    }

    public renderPoint(series: Series, pointColumn: Points, sideBySideInfo: DoubleRange, origin: number): void {
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
            this.rect.width = series.columnWidthInPixel ? (series.columnWidthInPixel - (series.chart.enableSideBySidePlacement ?
                series.columnWidthInPixel * series.columnSpacing : 0)) : this.rect.width;
            const rectCount: number = isNullOrUndefined(series.rectCount) ? 0 : series.rectCount;
            this.rect.x = series.columnWidthInPixel ? this.rect.x - (((series.columnWidthInPixel / 2) * rectCount) -
                    (series.columnWidthInPixel * ((isNullOrUndefined(series.position) ? 0 : series.position)))) -
                    (series.chart.enableSideBySidePlacement ? 0 : (series.columnWidthInPixel / 2)) : this.rect.x;
            const color: string = series.category === 'Indicator' ? pointColumn.color : series.interior;
            const argsData: IPointRenderEventArgs = this.triggerEvent(
                series, pointColumn, color,
                { width: series.border.width, color: series.border.color }
            );
            if (!argsData.cancel) {
                let adjustedYPosition: number = this.rect.y;
                if (pointColumn.yValue < origin && pointColumn.yValue >= 0 && series.chart.zoomModule &&
                    series.chart.zoomModule.isAxisZoomed(series.chart.axisCollections)) {
                    adjustedYPosition = getPoint(pointColumn.xValue + sideBySideInfo.start, pointColumn.yValue,
                                                 series.xAxis, series.yAxis, series.chart.requireInvertedAxis).y;
                }
                this.updateSymbolLocation(pointColumn, new Rect(this.rect.x, adjustedYPosition, this.rect.width, this.rect.height), series);
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

    public updateDirection(series: Series, point: number[]): void {
        const origin: number = Math.max(<number>series.yAxis.visibleRange.min, 0);
        for (let i: number = 0; i < point.length; i++) {
            this.renderPoint(series, series.points[point[i as number]], this.sideBySideInfo[series.index], origin);
            if (series.marker && series.marker.visible) {
                series.chart.markerRender.renderMarker(series, series.points[point[i as number]],
                                                       series.points[point[i as number]].symbolLocations[0], null, true);
            }
            if (series.marker.dataLabel.visible && series.chart.dataLabelModule) {
                series.chart.dataLabelModule.commonId = series.chart.element.id + '_Series_' + series.index + '_Point_';
                series.chart.dataLabelModule.renderDataLabel(series, series.points[point[i as number]],
                                                             null, series.marker.dataLabel);
            }
        }
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
     * Get module name.
     *
     * @returns {string} - Returns the module name.
     */
    protected getModuleName(): string {
        return 'ColumnSeries';
        /**
         * return the module name.
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
         * Destroy method performed here.
         */
    }
}
