/* eslint-disable jsdoc/require-returns */
/* eslint-disable prefer-const */
/* eslint-disable valid-jsdoc */
/* eslint-disable jsdoc/require-param */
import { withInRange, StackValues } from '../../common/utils/helper';
import { Rect } from '@syncfusion/ej2-svg-base';
import { DoubleRange } from '../utils/double-range';
import { Series } from './chart-series';
import { ColumnBase } from './column-base';
import { IPointRenderEventArgs } from '../../chart/model/chart-interface';
import { CylinderSeriesOption } from './column-series';


/**
 * `StackingBarSeries` module is used to render the stacking bar series.
 */
export class StackingBarSeries extends ColumnBase {

    /**
     * Render the Stacking bar series.
     *
     * @returns {void}
     * @private
     */
    public rect: Rect;
    public render(series: Series): void {
        let sideBySideInfo: DoubleRange = this.getSideBySideInfo(series);
        let stackedValue: StackValues = series.stackedValues;
        let argsData: IPointRenderEventArgs;
        for (let pointStack of series.points) {
            pointStack.symbolLocations = [];
            pointStack.regions = [];
            if (pointStack.visible &&
                withInRange(series.points[pointStack.index - 1], pointStack, series.points[pointStack.index + 1], series)) {
                this.rect = this.getRectangle(pointStack.xValue + sideBySideInfo.start, stackedValue.endValues[pointStack.index],
                                              pointStack.xValue + sideBySideInfo.end, stackedValue.startValues[pointStack.index], series);
                this.rect.height = series.columnWidthInPixel ? series.columnWidthInPixel : this.rect.height;
                this.rect.y = series.columnWidthInPixel ? this.rect.y - (series.columnWidthInPixel / 2) : this.rect.y;
                argsData = this.triggerEvent(series, pointStack, series.interior,
                                             { width: series.border.width, color: series.border.color });
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
        this.renderMarker(series);
    }
    /**
     * To destroy the stacking bar.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        /**
         * Destroy method performed here
         */
    }
    /**
     * Get module name.
     */
    protected getModuleName(): string {
        return 'StackingBarSeries';
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
}
