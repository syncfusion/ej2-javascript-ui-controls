import { StackValues, withInRange, getVisiblePoints } from '../../common/utils/helper';
import { Rect } from '@syncfusion/ej2-svg-base';
import { DoubleRange } from '../utils/double-range';
import { Series, Points } from './chart-series';
import { ColumnBase } from './column-base';
import { IPointRenderEventArgs } from '../../chart/model/chart-interface';
import { CylinderSeriesOption } from './column-series';

/**
 * The `StackingColumnSeries` module is used to render the stacking column series.
 */
export class StackingColumnSeries extends ColumnBase {
    public sideBySideInfo: DoubleRange[] = [];
    /**
     * Render the Stacking column series.
     *
     * @returns {void}
     * @private
     */
    public rect: Rect;
    public render(series: Series): void {
        series.isRectSeries = true;
        this.sideBySideInfo[series.index] = this.getSideBySideInfo(series);
        const stackedValue: StackValues = series.stackedValues;
        const visiblePoints: Points[] = getVisiblePoints(series);
        for (const point of visiblePoints) {
            this.renderPoint(series, point, this.sideBySideInfo[series.index], stackedValue, visiblePoints);
        }
        if (series.visible) {
            this.renderMarker(series);
        }
    }

    public renderPoint(series: Series, point: Points, sideBySideInfo: DoubleRange,
                       stackedValue: StackValues, visiblePoints: Points[]): void {
        point.symbolLocations = [];
        point.regions = [];
        if (point.visible && withInRange(visiblePoints[point.index - 1], point, visiblePoints[point.index + 1], series)) {
            let index: number;
            let startvalue: number;
            if (!series.visible && series.isLegendClicked) {
                for (let i: number = series.index; i >= 0; i--) {
                    if (series.chart.visibleSeries[i as number].visible) {
                        index = series.chart.visibleSeries[i as number].index;
                        break;
                    }
                }
                startvalue = series.index > 0 && index !== undefined ?
                    series.chart.visibleSeries[index as number].stackedValues.endValues[point.index] :
                    series.stackedValues.startValues[point.index];
            }
            this.rect = this.getRectangle(point.xValue + sideBySideInfo.start, (!series.visible && series.isLegendClicked) ? startvalue :
                stackedValue.endValues[point.index], point.xValue + sideBySideInfo.end, (!series.visible && series.isLegendClicked) ?
                startvalue : stackedValue.startValues[point.index], series);
            if (series.chart.isTransposed && series.columnWidthInPixel) {
                this.rect.height = series.columnWidthInPixel ? series.columnWidthInPixel : this.rect.width;
                this.rect.y -= series.columnWidthInPixel / 2;
            }
            else {
                this.rect.width = series.columnWidthInPixel ? series.columnWidthInPixel : this.rect.width;
            }
            this.rect.x = series.columnWidthInPixel ? series.chart.isTransposed ? this.rect.x : this.rect.x -
                (((series.columnWidthInPixel / 2) * series.rectCount) - (series.columnWidthInPixel * series.position)) : this.rect.x;
            const argsData: IPointRenderEventArgs = this.triggerEvent(series, point, series.interior, { width: series.visible ?
                series.border.width : 0, color: series.visible ? series.border.color : '' });
            if (!argsData.cancel) {
                this.drawRectangle(series, point, this.rect, argsData);
                this.updateSymbolLocation(point, this.rect, series);
                if (series.columnFacet === 'Cylinder') {
                    const cylinderSeriesOption: CylinderSeriesOption = {
                        'isColumn': true,
                        'stacking': series.type === 'StackingColumn100',
                        'isLastSeries': true
                    };
                    this.drawCylinder(this.options, this.element, cylinderSeriesOption, this.rect, series);
                }
            }
        }
    }

    public updateDirection(series: Series, point: number[]): void {
        const seriesCollection: Series[] = [];
        for (let i: number = 0; i < series.xAxis.series.length; i++) {
            const stackSeries: Series = series.xAxis.series[i as number];
            if (stackSeries.stackingGroup === series.stackingGroup) {
                seriesCollection.push(stackSeries);
            }
        }
        for (let j: number = 0; j < seriesCollection.length; j++) {
            const visiblePoints: Points[] = getVisiblePoints(seriesCollection[j as number]);
            for (let i: number = 0; i < point.length; i++) {
                this.renderPoint(seriesCollection[j as number], seriesCollection[j as number].points[point[i as number]],
                                 this.sideBySideInfo[series.index], seriesCollection[j as number].stackedValues, visiblePoints);
                if (series.marker && series.marker.visible) {
                    seriesCollection[j as number].chart.markerRender.renderMarker(
                        seriesCollection[j as number], seriesCollection[j as number].points[point[i as number]],
                        seriesCollection[j as number].points[point[i as number]].symbolLocations[0], null, true);
                }
                if (seriesCollection[j as number].marker.dataLabel.visible && seriesCollection[j as number].chart.dataLabelModule) {
                    seriesCollection[j as number].chart.dataLabelModule.commonId = seriesCollection[j as number].chart.element.id + '_Series_' + seriesCollection[j as number].index + '_Point_';
                    seriesCollection[j as number].chart.dataLabelModule.renderDataLabel(
                        seriesCollection[j as number], seriesCollection[j as number].points[point[i as number]],
                        null, seriesCollection[j as number].marker.dataLabel);
                }
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
     * To destroy the stacking column.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
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
        return 'StackingColumnSeries';
    }
}
