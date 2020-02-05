/**
 * AccumulationChart Tooltip file
 */
import { Browser, remove } from '@syncfusion/ej2-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { AccPoints, AccumulationSeries, getSeriesFromIndex } from '../model/acc-base';
import { AccumulationChart } from '../accumulation';
import { TooltipSettingsModel } from '../../common/model/base-model';
import { Index } from '../../common/model/base';
import { getElement, AccPointData, withInBounds, indexFinder } from '../../common/utils/helper';
import { Rect } from '@syncfusion/ej2-svg-base';
import { BaseTooltip} from '../../common/user-interaction/tooltip';
import { ITooltipRenderEventArgs } from '../../chart/model/chart-interface';
import { tooltipRender } from '../../common/model/constants';


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
          this.removeTooltip(this.accumulation.tooltip.fadeOutDuration);
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
                                 headerText: string, firstText: boolean = true): void {
        let template: string;
        let argsData: ITooltipRenderEventArgs = {
            cancel: false, name: tooltipRender, text: textCollection, point: point.point, textStyle: this.textStyle,
            series: this.accumulation.isBlazor  ?  {} as AccumulationSeries : point.series,  headerText : headerText,
            data : { pointX: point.point.x , pointY: point.point.y as Object, seriesIndex: point.series.index,
                     pointIndex: point.point.index, pointText: point.point.text, seriesName: point.series.name  }
        };
        let tooltipSuccess: Function = (argsData: ITooltipRenderEventArgs) => {
            if (!argsData.cancel) {
                this.formattedText = this.formattedText.concat(argsData.text);
                this.text = this.formattedText;
                this.headerText = argsData.headerText;
                this.createTooltip(this.chart, isFirst, point.point.symbolLocation,
                                   point.series.clipRect, point.point, ['Circle'], 0, this.chart.initialClipRect,
                                   null, point.point, this.accumulation.tooltip.template ? argsData.template : '');
            } else {
                this.removeHighlight(this.control);
                remove(this.getElement(this.element.id + '_tooltip'));
            }
            this.isRemove = true;
        };
        tooltipSuccess.bind(this, point);
        this.chart.trigger(tooltipRender, argsData, tooltipSuccess);
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
        let format: string = this.accumulation.useGroupingSeparator ? '${point.x} : <b>${point.separatorY}</b>'
        : '${point.x} : <b>${point.y}</b>';
        format = tooltip.format ? tooltip.format : format;
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