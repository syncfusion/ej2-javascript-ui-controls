import { withInRange, ChartLocation, pathAnimation, getElement } from '../../common/utils/helper';
import { PathOption, Rect } from '@syncfusion/ej2-svg-base';
import { DoubleRange } from '../utils/double-range';
import { Series, Points } from './chart-series';
import { ColumnBase } from './column-base';
import { IPointRenderEventArgs } from '../../chart/model/chart-interface';
import { BorderModel } from '../../common/model/base-model';

/**
 * The `HiloOpenCloseSeries` module is used to render the hilo open close series.
 */
export class HiloOpenCloseSeries extends ColumnBase {
    public sideBySideInfo: DoubleRange[] = [];
    /**
     * Render HiloOpenCloseSeries series.
     *
     * @returns {void}
     * @private
     */

    public render(series: Series): void {
        this.sideBySideInfo[series.index] = this.getSideBySideInfo(series);
        const borderWidth: number = Math.max(series.border.width, 2);
        for (const point of series.points) {
            this.renderPoint(series, point, this.sideBySideInfo[series.index], borderWidth);
        }
    }

    public renderPoint(series: Series, point: Points, sideBySideInfo: DoubleRange, borderWidth: number): void {
        point.symbolLocations = [];
        point.regions = [];
        let highLowRect: Rect;
        let index1: number;
        let index2: number;
        if (point.visible &&
            withInRange(series.points[point.index - 1], point, series.points[point.index + 1], series)) {
            //highlow
            highLowRect = this.getRectangle(
                point.xValue + sideBySideInfo.start, <number>Math.max(<number>point.high, <number>point.low),
                point.xValue + sideBySideInfo.end, <number>Math.min(<number>point.high, <number>point.low), series);

            point.regions.push(this.getRectangle(
                point.xValue + sideBySideInfo.median, <number>Math.max(<number>point.high, <number>point.low),
                point.xValue + sideBySideInfo.median, <number>Math.min(<number>point.high, <number>point.low), series
            ));

            this.updateTickRegion(!series.chart.requireInvertedAxis, point.regions[0], borderWidth);
            //open
            point.regions.push(this.getRectangle(
                point.xValue + sideBySideInfo.start, <number>Math.max(<number>point.open, <number>point.close),
                point.xValue + sideBySideInfo.median, <number>Math.max(<number>point.open, <number>point.close), series
            ));

            //close
            point.regions.push(this.getRectangle(
                point.xValue + sideBySideInfo.median, <number>Math.min(<number>point.open, <number>point.close),
                point.xValue + sideBySideInfo.end, <number>Math.min(<number>point.open, <number>point.close), series
            ));

            const argsData: IPointRenderEventArgs = this.triggerPointRenderEvent(series, point);
            if (!argsData.cancel) {
                this.updateSymbolLocation(point, point.regions[0], series);
                index1 = point.open > point.close ? 1 : 2;
                index2 = point.open > point.close ? 2 : 1;
                const open: ChartLocation = { x: point.regions[index1 as number].x, y: point.regions[index1 as number].y };
                const close: ChartLocation = { x: point.regions[index2 as number].x, y: point.regions[index2 as number].y };
                this.drawHiloOpenClosePath(series, point, open, close, highLowRect, argsData);
            }

            this.updateTickRegion(series.chart.requireInvertedAxis, point.regions[1], borderWidth);
            this.updateTickRegion(series.chart.requireInvertedAxis, point.regions[2], borderWidth);

        }
    }

    public updateDirection(series: Series, point: number[]): void {
        const borderWidth: number = Math.max(series.border.width, 2);
        for (let i: number = 0; i < point.length; i++) {
            this.renderPoint(series, series.points[point[i as number]], this.sideBySideInfo[series.index], borderWidth);
            if (series.marker.dataLabel.visible && series.chart.dataLabelModule) {
                series.chart.dataLabelModule.commonId = series.chart.element.id + '_Series_' + series.index + '_Point_';
                series.chart.dataLabelModule.renderDataLabel(series, series.points[point[i as number]],
                                                             null, series.marker.dataLabel);
            }
        }
    }

    /**
     * Updates the tick region based on the specified parameters.
     *
     * @param {boolean} horizontal - Specifies whether the tick region is horizontal.
     * @param {Rect} region - The region to update.
     * @param {number} borderWidth - The width of the border.
     * @returns {void}
     */
    private updateTickRegion(horizontal: boolean, region: Rect, borderWidth: number): void {
        if (horizontal) {
            region.x -= borderWidth / 2;
            region.width = borderWidth;
        } else {
            region.y -= borderWidth / 2;
            region.height = borderWidth;
        }

    }

    /**
     * Triggers the point render event and returns the event arguments.
     *
     * @param {Series} series - The series associated with the point.
     * @param {Points} point - The data point.
     * @returns {IPointRenderEventArgs} The event arguments.
     */
    private triggerPointRenderEvent(series: Series, point: Points): IPointRenderEventArgs {
        const fill: string = (point.open <= point.close) ? series.bearFillColor || series.chart.themeStyle.bearFillColor :
            series.bullFillColor || series.chart.themeStyle.bullFillColor;
        const border: BorderModel = { color: series.border.color, width: Math.max(series.border.width, 1) };
        return this.triggerEvent(series, point, fill, border);
    }

    /**
     * Draws the path for high, low, open, and close values in the series.
     *
     * @param {Series} series - The series associated with the point.
     * @param {Points} point - The data point.
     * @param {ChartLocation} open - The location of the open value.
     * @param {ChartLocation} close - The location of the close value.
     * @param {Rect} rect - The rectangle bounds.
     * @param {IPointRenderEventArgs} argsData - The event arguments.
     * @returns {void}
     */
    protected drawHiloOpenClosePath(
        series: Series, point: Points, open: ChartLocation, close: ChartLocation, rect: Rect, argsData: IPointRenderEventArgs
    ): void {
        // region highlow
        let direction: string;
        if (series.chart.requireInvertedAxis) {
            direction = ('M' + ' ' + (rect.x) + ' ' + (rect.y + rect.height / 2) + ' ' +
                'L' + ' ' + (rect.x + rect.width) + ' ' + (rect.y + rect.height / 2) + ' ');
            direction += ('M' + ' ' + (open.x) + ' ' + (rect.y + rect.height / 2) + ' ' +
                'L' + ' ' + (open.x) + ' ' + (rect.y + rect.height) + ' ');
            direction += ('M' + ' ' + (close.x) + ' ' + (rect.y + rect.height / 2) + ' ' +
                'L' + ' ' + (close.x) + ' ' + (rect.y) + ' ');
        } else {
            direction = ('M' + ' ' + (rect.x + rect.width / 2) + ' ' + (rect.y + rect.height) + ' ' +
                'L' + ' ' + (rect.x + rect.width / 2) + ' ' + (rect.y) + ' ');

            //region opentick
            direction += ('M' + ' ' + (rect.x) + ' ' + (open.y) + ' ' +
                'L' + ' ' + (rect.x + rect.width / 2 + argsData.border.width / 2) + ' ' + (open.y) + ' ');

            //region closetick
            direction += ('M' + ' ' + (rect.x + rect.width / 2 - argsData.border.width / 2) + ' ' + (close.y) + ' ' +
                'L' + ' ' + (rect.x + rect.width) + ' ' + (close.y) + ' ');
        }

        const options: PathOption = new PathOption(
            series.chart.element.id + '_Series_' + series.index + '_Point_' + ((series.removedPointIndex !== null && series.removedPointIndex <= point.index) ? (point.index + 1) : point.index),
            argsData.fill, argsData.border.width, argsData.fill, series.opacity, series.dashArray, direction);
        pathAnimation(getElement(options.id), direction, series.chart.redraw, null, series.chart.duration);
        const element: HTMLElement =
            series.chart.renderer.drawPath(options, new Int32Array([series.clipRect.x, series.clipRect.y])) as HTMLElement;
        if (series.removedPointIndex !== null && series.removedPointIndex <= point.index) {
            element.id = series.chart.element.id + '_Series_' + series.index + '_Point_' + point.index;
        }
        element.setAttribute('role', 'img');
        element.setAttribute('aria-label', series.accessibility.accessibilityDescriptionFormat ? series.formatAccessibilityDescription(point, series) : (point.x.toString() + ':' + point.high.toString()
            + ':' + point.low.toString() + ':' + point.close.toString() + ':' + point.open.toString()));
        if (!series.chart.enableCanvas) {
            series.seriesElement.appendChild(element);
        }
    }

    /**
     * Get module name.
     *
     * @returns {string} - Returns the module name.
     */
    protected getModuleName(): string {
        return 'HiloOpenCloseSeries';
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
