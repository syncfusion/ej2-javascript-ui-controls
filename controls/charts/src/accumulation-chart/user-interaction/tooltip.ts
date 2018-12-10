/**
 * AccumulationChart Tooltip file
 */
import { Browser} from '@syncfusion/ej2-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { AccPoints, AccumulationSeries, getSeriesFromIndex } from '../model/acc-base';
import { AccumulationChart } from '../accumulation';
import { TooltipSettingsModel } from '../../common/model/base-model';
import { Index } from '../../common/model/base';
import { getElement, AccPointData, withInBounds, Rect, indexFinder } from '../../common/utils/helper';
import { BaseTooltip} from '../../common/user-interaction/tooltip';

/**
 * `AccumulationTooltip` module is used to render tooltip for accumulation chart.
 */
export class AccumulationTooltip extends BaseTooltip {
    public accumulation: AccumulationChart;
    constructor(accumulation: AccumulationChart) {
        super(accumulation);
        this.accumulation = accumulation;
        this.addEventListener();
    }
    /**
     * @hidden
     */
    private addEventListener(): void {
        if (this.accumulation.isDestroyed) { return; }
        this.accumulation.on(Browser.isPointer ? 'pointerleave' : 'mouseleave', this.mouseLeaveHandler, this);
        this.accumulation.on(Browser.touchMoveEvent, this.mouseMoveHandler, this);
        this.accumulation.on(Browser.touchEndEvent, this.mouseUpHandler, this);
    }

    private mouseLeaveHandler(e: PointerEvent): void {
          this.removeTooltip(1000);
    }

    private mouseUpHandler(e: PointerEvent | TouchEvent): void {
        let control: AccumulationChart = this.accumulation;
        if (control.tooltip.enable && control.isTouch && withInBounds(control.mouseX, control.mouseY, control.initialClipRect)) {
            this.tooltip(e);
            this.removeTooltip(2000);
        }
    }


    private mouseMoveHandler(e: PointerEvent | TouchEvent): void {
        let control: AccumulationChart = this.accumulation;
        // Tooltip for chart series.    
        if (control.tooltip.enable && withInBounds(control.mouseX, control.mouseY, control.initialClipRect)) {
            this.tooltip(e);
        }
    }



    /**
     * Renders the tooltip.
     * @param  {PointerEvent} event - Mouse move event.
     * @return {void}
     */
    public tooltip(event: PointerEvent | TouchEvent): void {
        let svgElement : HTMLElement = this.getElement(this.element.id + '_tooltip_svg');
        let isTooltip: boolean = svgElement && parseInt(svgElement.getAttribute('opacity'), 10) > 0;
        let tooltipDiv: HTMLDivElement = this.getTooltipElement(isTooltip);
        this.renderSeriesTooltip(event, this.accumulation, !isTooltip, tooltipDiv);
    }

    private renderSeriesTooltip(e: PointerEvent | TouchEvent, chart : AccumulationChart, isFirst: boolean,
                                tooltipDiv: HTMLDivElement) : void {
        let data: AccPointData = this.getPieData(e, chart, chart.mouseX, chart.mouseY);
        let rect : Rect = chart.initialClipRect;
        this.currentPoints = [];
        if (data.point && (!this.previousPoints[0] || (this.previousPoints[0].point !== data.point))) {
            if (this.pushData(data, isFirst, tooltipDiv, false)) {
                if (this.triggerEvent(data, isFirst, this.getTooltipText(data, chart.tooltip))) {
                    this.createTooltip(chart, isFirst, this.findHeader(data), data.point.symbolLocation,
                                       data.series.clipRect, data.point, ['Circle'], 0, rect, null, data.point);
                } else {
                    this.removeHighlight(this.control);
                    this.getElement(this.element.id + '_tooltip').remove();
                }
                this.isRemove = true;
            }
        } else {
            if (!data.point && this.isRemove) {
                this.removeTooltip(1000);
                this.isRemove = false;
            }
        }
    }
    private getPieData(e: PointerEvent | TouchEvent, chart: AccumulationChart, x: number, y: number) : AccPointData {
        let target: Element = e.target as Element;
        let id: Index = indexFinder(target.id, true);
        if (!isNaN(id.series)) {
            let seriesIndex: number = id.series;
            let pointIndex: number = id.point;
            if (!isNullOrUndefined(seriesIndex) && !isNaN(seriesIndex) && !isNullOrUndefined(pointIndex) && !isNaN(pointIndex)) {
                let series: AccumulationSeries = this.getSeriesFromIndex(seriesIndex, chart.visibleSeries);
                if (series.enableTooltip) {
                    return new AccPointData(series.points[pointIndex], series);
                }
            }
        }
        return new AccPointData(null, null);
    }
    /**
     * To get series from index
     */
    private getSeriesFromIndex(index: number, visibleSeries: AccumulationSeries[]): AccumulationSeries {
        return <AccumulationSeries>visibleSeries[0];
    }

    private getTooltipText(data : AccPointData, tooltip: TooltipSettingsModel) : string {
        let series: AccumulationSeries = data.series;
        let format: string = tooltip.format ? tooltip.format : '${point.x} : <b>${point.y}</b>';
        return this.parseTemplate(data.point, series, format);
    }

    private findHeader(data : AccPointData) : string {
        if (this.header === '') {
            return '';
        }
        this.header = this.parseTemplate(data.point, data.series, this.header);
        if (this.header.replace(/<b>/g, '').replace(/<\/b>/g, '').trim() !== '') {
            return this.header;
        }
        return '';
    }

    private parseTemplate(point : AccPoints, series : AccumulationSeries, format : string) : string {
        let value: RegExp;
        let textValue: string;
        for (let dataValue of Object.keys(point)) {
            value = new RegExp('${point' + '.' + dataValue + '}', 'gm');
            format = format.replace(value.source, point[dataValue]);
        }

        for (let dataValue of Object.keys(Object.getPrototypeOf(series))) {
            value = new RegExp('${series' + '.' + dataValue + '}', 'gm');
            textValue = series[dataValue];
            format = format.replace(value.source, textValue);
        }
        return format;
    }

    /**
     * Get module name
     */
    protected getModuleName(): string {
        return 'AccumulationTooltip';
    }
    /**
     * To destroy the Tooltip. 
     * @return {void}
     * @private
     */
    public destroy(chart: AccumulationChart): void {
        /**
         * Destroy method calling here
         */
    }
}