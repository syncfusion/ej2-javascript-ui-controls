/**
 * AccumulationChart Tooltip file.
 */
import { Browser, remove } from '@syncfusion/ej2-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { AccPoints, AccumulationSeries } from '../model/acc-base';
import { AccumulationChart } from '../accumulation';
import { TooltipSettingsModel } from '../../common/model/base-model';
import { Index } from '../../common/model/base';
import { AccPointData, withInBounds, indexFinder } from '../../common/utils/helper';
//import { Rect } from '@syncfusion/ej2-svg-base';
import { BaseTooltip } from '../../common/user-interaction/tooltip';
import { ITooltipRenderEventArgs } from '../../chart/model/chart-interface';
import { tooltipRender } from '../../common/model/constants';


/**
 * The `AccumulationTooltip` module is used to render tooltips for the accumulation chart.
 */
export class AccumulationTooltip extends BaseTooltip {
    public accumulation: AccumulationChart;
    constructor(accumulation: AccumulationChart) {
        super(accumulation);
        this.accumulation = accumulation;
        this.addEventListener();
        this.template = this.accumulation.tooltip.template;
    }
    /**
     * Adds an event listener.
     *
     * @hidden
     * @returns {void}
     */
    private addEventListener(): void {
        if (this.accumulation.isDestroyed) { return; }
        this.accumulation.on(Browser.isPointer ? 'pointerleave' : 'mouseleave', this.mouseLeaveHandler, this);
        this.accumulation.on(Browser.touchMoveEvent, this.mouseMoveHandler, this);
        this.accumulation.on(Browser.touchEndEvent, this.mouseUpHandler, this);
    }

    private mouseLeaveHandler(): void {
        this.removeTooltip(this.accumulation.tooltip.fadeOutDuration);
    }

    private mouseUpHandler(e: PointerEvent | TouchEvent): void {
        const control: AccumulationChart = this.accumulation;
        if (control.tooltip.enable && control.isTouch && withInBounds(control.mouseX, control.mouseY, control.initialClipRect)) {
            this.tooltip(e);
            this.removeTooltip(2000);
        }
    }


    private mouseMoveHandler(e: PointerEvent | TouchEvent): void {
        const control: AccumulationChart = this.accumulation;
        // Tooltip for chart series.
        if (control.tooltip.enable && withInBounds(control.mouseX, control.mouseY, control.initialClipRect)) {
            this.tooltip(e);
        }
    }



    /**
     * Renders the tooltip.
     *
     * @param {PointerEvent | TouchEvent} event - The mouse move event or touch event.
     * @returns {void}
     * @private
     */
    public tooltip(event: PointerEvent | TouchEvent): void {
        this.renderSeriesTooltip(this.accumulation,
                                 this.getPieData(event, this.accumulation));
    }

    /**
     * @private
     */

    public renderSeriesTooltip(chart: AccumulationChart, data: AccPointData): void {
        const svgElement: HTMLElement = this.getElement(this.element.id + '_tooltip_svg');
        const isTooltip: boolean = svgElement && parseInt(svgElement.getAttribute('opacity'), 10) > 0;
        const tooltipDiv: HTMLDivElement = this.getTooltipElement(isTooltip);
        const isFirst: boolean = !isTooltip;
        this.currentPoints = [];
        if (data.point && (!this.previousPoints[0] || (this.previousPoints[0].point !== data.point))) {
            if (this.previousPoints[0] && data.point.index === this.previousPoints[0].point.index
                && data.series.index === this.previousPoints[0].series.index) {
                return null;
            }
            if (this.pushData(data, isFirst, tooltipDiv, false)) {
                this.triggerTooltipRender(data, isFirst, this.getTooltipText(data, chart.tooltip), this.findHeader(data));
            }
        } else {
            if (!data.point && this.isRemove) {
                this.removeTooltip(this.accumulation.tooltip.fadeOutDuration);
                this.isRemove = false;
            }
        }
    }

    private triggerTooltipRender(point: AccPointData, isFirst: boolean, textCollection: string,
                                 headerText: string): void {
        //let template: string;
        const tooltip: TooltipSettingsModel = this.chart.tooltip;
        const argsData: ITooltipRenderEventArgs = {
            cancel: false, name: tooltipRender, text: textCollection, point: point.point, textStyle: this.textStyle,
            series: this.accumulation.isBlazor ? {} as AccumulationSeries : point.series, headerText: headerText,
            data: {
                pointX: point.point.x, pointY: point.point.y as Object, seriesIndex: point.series.index,
                pointIndex: point.point.index, pointText: point.point.text, seriesName: point.series.name
            }
        };
        const tooltipSuccess: Function = (argsData: ITooltipRenderEventArgs) => {
            if (!argsData.cancel) {
                this.formattedText = this.formattedText.concat(argsData.text);
                this.text = this.formattedText;
                this.headerText = argsData.headerText;
                this.createTooltip(this.chart, isFirst, { x: (tooltip.location.x !== null) ? tooltip.location.x :
                    point.point.symbolLocation.x, y: (tooltip.location.y !== null) ? tooltip.location.y : point.point.symbolLocation.y },
                                   point.series.clipRect, point.point, !tooltip.enableMarker ? [] : ['Circle'], 0, this.chart.initialClipRect, false,
                                   null, point.point, this.template ? argsData.template : '');
            } else {
                this.removeHighlight();
                remove(this.getElement(this.element.id + '_tooltip'));
            }
            this.isRemove = true;
        };
        tooltipSuccess.bind(this, point);
        this.chart.trigger(tooltipRender, argsData, tooltipSuccess);
    }
    private getPieData(e: PointerEvent | TouchEvent, chart: AccumulationChart): AccPointData {
        const target: Element = e.target as Element;
        const id: Index = indexFinder(target.id, true);
        if (!isNaN(id.series)) {
            const seriesIndex: number = id.series;
            const pointIndex: number = id.point;
            if (!isNullOrUndefined(seriesIndex) && !isNaN(seriesIndex) && !isNullOrUndefined(pointIndex) && !isNaN(pointIndex)) {
                const series: AccumulationSeries = this.getSeriesFromIndex(seriesIndex, chart.visibleSeries);
                if (series.enableTooltip) {
                    return new AccPointData(series.points[pointIndex as number], series);
                }
            }
        }
        return new AccPointData(null, null);
    }
    /**
     * To get series from index.
     *
     * @param {number} index - The index of the series to retrieve.
     * @param {AccumulationSeries[]} visibleSeries - The array of visible series in the accumulation chart.
     * @returns {AccumulationSeries} - The series retrieved from the specified index.
     */
    private getSeriesFromIndex(index: number, visibleSeries: AccumulationSeries[]): AccumulationSeries {
        return <AccumulationSeries>visibleSeries[0];
    }

    private getTooltipText(data: AccPointData, tooltip: TooltipSettingsModel): string {
        const series: AccumulationSeries = data.series;
        let format: string = tooltip.format ? tooltip.format : '${point.x} : <b>${point.y}</b>';
        format = this.accumulation.useGroupingSeparator ? format.replace('${point.y}', '${point.separatorY}') : format;
        return this.parseTemplate(data.point, series, format);
    }

    private findHeader(data: AccPointData): string {
        if (this.header === '') {
            return '';
        }
        this.header = this.parseTemplate(data.point, data.series, this.header);
        if (this.header.replace(/<b>/g, '').replace(/<\/b>/g, '').trim() !== '') {
            return this.header;
        }
        return '';
    }

    private parseTemplate(point: AccPoints, series: AccumulationSeries, format: string): string {
        let value: RegExp;
        let textValue: string;
        const regExp: RegExpConstructor = RegExp;
        for (const dataValue of Object.keys(point)) {
            value = new regExp('${point' + '.' + dataValue + '}', 'gm');
            const pointValue: string = (dataValue === 'x' && this.accumulation.useGroupingSeparator && typeof point[dataValue as string] === 'number') ?
                this.accumulation.intl.formatNumber(point.x as number, { useGrouping: true }) : point[dataValue as string];
            format = format.replace(value.source, pointValue);
        }

        for (const dataValue of Object.keys(Object.getPrototypeOf(series))) {
            value = new regExp('${series' + '.' + dataValue + '}', 'gm');
            textValue = series[dataValue as string];
            format = format.replace(value.source, textValue);
        }
        return format;
    }

    /**
     * Get module name.
     *
     * @returns {string} - Returns the module name.
     */
    protected getModuleName(): string {
        return 'AccumulationTooltip';
    }
    /**
     * To destroy the Tooltip.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        /**
         * Destroy method calling here
         */
    }
}
