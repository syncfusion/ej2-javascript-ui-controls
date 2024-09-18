import { withInRange, StackValues } from '../../common/utils/helper';
import { Rect } from '@syncfusion/ej2-svg-base';
import { DoubleRange } from '../utils/double-range';
import { Points, Series } from './chart-series';
import { ColumnBase } from './column-base';
import { IPointRenderEventArgs } from '../../chart/model/chart-interface';
import { CylinderSeriesOption } from './column-series';


/**
 * The `StackingBarSeries` module is used to render the stacking bar series.
 */
export class StackingBarSeries extends ColumnBase {
    public sideBySideInfo: DoubleRange[] = [];
    /**
     * Render the Stacking bar series.
     *
     * @returns {void}
     * @private
     */
    public rect: Rect;
    public render(series: Series): void {
        this.sideBySideInfo[series.index] = this.getSideBySideInfo(series);
        const stackedValue: StackValues = series.stackedValues;
        for (const pointStack of series.points) {
            this.renderPoint(series, pointStack, this.sideBySideInfo[series.index], stackedValue);
        }
        if (series.visible) {
            this.renderMarker(series);
        }
    }

    public renderPoint(series: Series, pointStack: Points, sideBySideInfo: DoubleRange, stackedValue: StackValues): void {
        pointStack.symbolLocations = [];
        pointStack.regions = [];
        if (pointStack.visible &&
            withInRange(series.points[pointStack.index - 1], pointStack, series.points[pointStack.index + 1], series)) {
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
                    series.chart.visibleSeries[index as number].stackedValues.endValues[pointStack.index] :
                    series.stackedValues.startValues[pointStack.index];
            }
            this.rect = this.getRectangle(pointStack.xValue + sideBySideInfo.start, (!series.visible && series.isLegendClicked) ?
                startvalue : stackedValue.endValues[pointStack.index], pointStack.xValue + sideBySideInfo.end, (!series.visible
                    && series.isLegendClicked) ? startvalue : stackedValue.startValues[pointStack.index], series);
            this.rect.height = series.columnWidthInPixel ? series.columnWidthInPixel : this.rect.height;
            this.rect.y = series.columnWidthInPixel ? this.rect.y - (series.columnWidthInPixel / 2) : this.rect.y;
            const argsData: IPointRenderEventArgs = this.triggerEvent(series, pointStack, series.interior, { width: series.visible ?
                series.border.width : 0, color: series.visible ? series.border.color : '' });
            if (!argsData.cancel) {
                this.drawRectangle(series, pointStack, this.rect, argsData);
                this.updateSymbolLocation(pointStack, this.rect, series);
                if (series.columnFacet === 'Cylinder') {
                    const cylinderSeriesOption: CylinderSeriesOption = {
                        'isColumn': false,
                        'stacking': series.type === 'StackingBar100',
                        'isLastSeries': true
                    };
                    this.drawCylinder(this.options, this.element, cylinderSeriesOption, this.rect, series);
                }
            }
        }
    }

    public updateDirection(series: Series, point: number[]): void {
        const seriesCollection: Series[] = [];
        for (let i: number = 0; i < series.yAxis.series.length; i++) {
            const stackSeries: Series = series.yAxis.series[i as number];
            if (stackSeries.stackingGroup === series.stackingGroup) {
                seriesCollection.push(stackSeries);
            }
        }
        for (let j: number = 0; j < seriesCollection.length; j++) {
            for (let i: number = 0; i < point.length; i++) {
                this.renderPoint(seriesCollection[j as number], seriesCollection[j as number].points[point[i as number]],
                                 this.sideBySideInfo[series.index], seriesCollection[j as number].stackedValues);
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
     * To destroy the stacking bar.
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
        return 'StackingBarSeries';
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
}
