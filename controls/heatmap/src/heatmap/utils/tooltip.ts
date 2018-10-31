/**
 * HeatMap tool tip file
 */

import { createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { HeatMap } from '../heatmap';
import { CurrentRect } from '../utils/helper';
import { Tooltip as tool } from '@syncfusion/ej2-svg-base';
import { Series } from '../series/series';
import { ITooltipEventArgs } from '../model/interface';
import { BubbleTooltipData } from '../model/base';
import { DataModel } from '../datasource/adaptor-model';

/**
 * 
 * The `Tooltip` module is used to render the tooltip for heatmap series.
 */
export class Tooltip {
    /* private */
    private heatMap: HeatMap;
    /* private */
    private isFirst: boolean = true;
    /* private */
    public isFadeout: boolean = false;
    /* private */
    public tooltipObject: tool;
    constructor(heatMap?: HeatMap) {
        this.heatMap = heatMap;
    }

    /**
     * Get module name
     */
    protected getModuleName(): string {
        return 'Tooltip';
    }

    /**
     * To show/hide Tooltip.
     * @private
     */
    public showHideTooltip(isShow: boolean, isFadeout?: boolean): void {
        let ele: HTMLElement = document.getElementById(this.heatMap.element.id + 'Celltooltipcontainer');
        if (!isShow) {
            if (ele && ele.style.visibility !== 'hidden') {
                if (this.tooltipObject && isFadeout) {
                    this.tooltipObject.fadeOut();
                } else {
                    if (this.tooltipObject && this.tooltipObject.element) {
                        let tooltipElement: HTMLElement = this.tooltipObject.element.firstChild as HTMLElement;
                        tooltipElement.setAttribute('opacity', '0');
                    }
                }
                ele.style.visibility = 'hidden';
            }
            this.isFadeout = true;
        } else {
            ele.style.visibility = 'visible';
        }
    }

    /**
     * To destroy the Tooltip.
     * @return {void}
     * @private
     */
    public destroy (heatMap: HeatMap): void {
        /**
         * Destroy method performed here
         */
    };

    /**
     * To add Tooltip to the rect cell.
     * @return {void}
     * @private
     */
    private createTooltip(x: number, y: number, tempTooltipText?: string[]): void {
        let offset: number = null;
        if (this.heatMap.cellSettings.showLabel && this.heatMap.heatMapSeries.checkLabelXDisplay &&
            this.heatMap.heatMapSeries.checkLabelYDisplay) {
            offset = parseInt(this.heatMap.cellSettings.textStyle.size, 10) / 2;
        }
        this.tooltipObject = new tool(
            {
                enableAnimation: false,
                offset: offset,
                location: { x: x, y: y },
                theme: this.heatMap.theme,
                content: tempTooltipText,
                areaBounds:
                    {
                        height: this.heatMap.initialClipRect.height + this.heatMap.initialClipRect.y,
                        width: this.heatMap.initialClipRect.width, x: this.heatMap.initialClipRect.x
                    }
            },
            '#' + this.heatMap.element.id + 'Celltooltipcontainer');
    }

    /**
     * To create div container for tooltip.
     * @return {void}
     * @private
     */
    public createTooltipDiv(heatMap: HeatMap): void {
        let element2: Element = <HTMLElement>createElement('div', {
            id: this.heatMap.element.id + 'Celltooltipcontainer',
            styles: 'position:absolute'
        });
        this.heatMap.element.appendChild(
            createElement(
                'div', {
                    id: this.heatMap.element.id + 'Celltooltipparent',
                    styles: 'position:relative'
                })
                .appendChild(element2));
    }

    /**
     * To get default tooltip content.
     * @private
     */
    private getTooltipContent(currentRect: CurrentRect, hetmapSeries: Series): string[] {
        let value: number|string;
        let content: string[];
        let heatMap: HeatMap = this.heatMap;
        let adaptData: DataModel = this.heatMap.dataSource;
        if (heatMap.bubbleSizeWithColor) {
            let xAxis: string = heatMap.xAxis.title && heatMap.xAxis.title.text !== '' ? heatMap.xAxis.title.text : 'X-Axis';
            let yAxis: string = heatMap.yAxis.title && heatMap.yAxis.title.text !== '' ? heatMap.yAxis.title.text : 'Y-Axis';
            let value1: string = adaptData.isJsonData && adaptData.adaptorType === 'Cell' ?
                (heatMap.dataSource as DataModel).bubbleDataMapping.size : 'Value 1';
            let value2: string = adaptData.isJsonData && adaptData.adaptorType === 'Cell' ?
                (heatMap.dataSource as DataModel).bubbleDataMapping.color : 'Value 2';
            value = hetmapSeries.getFormatedText(
                (currentRect.value as BubbleTooltipData[])[0].bubbleData, this.heatMap.cellSettings.format);
            content = [xAxis + ' : ' + hetmapSeries.hoverXAxisLabel + '<br/>'
                + yAxis + ' : ' + hetmapSeries.hoverYAxisLabel + '<br/>'
                + value1 + ' : ' + value + '<br/>'
                + value2 + ' : '
                + hetmapSeries.getFormatedText(
                    (currentRect.value as BubbleTooltipData[])[1].bubbleData, this.heatMap.cellSettings.format)];
        } else {
            value = currentRect.value as number;
            content = [hetmapSeries.hoverXAxisLabel + ' | ' + hetmapSeries.hoverYAxisLabel + ' : ' +
                hetmapSeries.getFormatedText(value, this.heatMap.cellSettings.format)];
        }
        return content;
    }

    /**
     * To render tooltip.
     * @private
     */
    public renderTooltip(currentRect: CurrentRect) : void {
        let hetmapSeries : Series = this.heatMap.heatMapSeries;
        let tempTooltipText: string[] = [''];
        let showTooltip: boolean = this.heatMap.bubbleSizeWithColor ?
            !isNullOrUndefined(currentRect.value) && !isNullOrUndefined((currentRect.value as BubbleTooltipData[])[0].bubbleData)
                && (currentRect.value as BubbleTooltipData[])[0].bubbleData.toString() !== '' ? true : false
            : isNullOrUndefined(currentRect.value) || (!isNullOrUndefined(currentRect.value) &&
                currentRect.value.toString() === '') ? false : true;
        if (!showTooltip) {
            this.showHideTooltip(false, false);
        } else {
            if (!isNullOrUndefined(this.heatMap.tooltipRender)) {
                // this.tooltipObject.header = '';
                // this.tooltipObject.content = this.getTemplateText(
                //     currentRect, this.heatMap.tooltipTemplate, hetmapSeries.hoverXAxisLabel,
                //     hetmapSeries.hoverYAxisLabel);
                let content: string[] = this.getTooltipContent(currentRect, hetmapSeries);
                let argData: ITooltipEventArgs = {
                    heatmap: this.heatMap,
                    cancel: false,
                    name: 'tooltipRender',
                    value: currentRect.value,
                    xValue: this.heatMap.heatMapSeries.hoverXAxisValue,
                    yValue: this.heatMap.heatMapSeries.hoverYAxisValue,
                    xLabel: this.heatMap.heatMapSeries.hoverXAxisLabel ?
                        this.heatMap.heatMapSeries.hoverXAxisLabel.toString() : null,
                    yLabel: this.heatMap.heatMapSeries.hoverYAxisLabel ?
                        this.heatMap.heatMapSeries.hoverYAxisLabel.toString() : null,
                    content: content
                };
                this.heatMap.trigger('tooltipRender', argData);
                if (!argData.cancel) {
                    tempTooltipText = argData.content;
                } else {
                    if (this.tooltipObject) {
                        this.showHideTooltip(false);
                    }
                    return;
                }

            } else {
                //  this.tooltipObject.header = hetmapSeries.hoverYAxisLabel.toString();
               tempTooltipText = this.getTooltipContent(currentRect, hetmapSeries);
            }
            if (!this.tooltipObject) {
                this.createTooltip(currentRect.x + (currentRect.width / 2), currentRect.y + (currentRect.height / 2), tempTooltipText);
            } else {
                this.tooltipObject.content = tempTooltipText;
            }
            this.showHideTooltip(true);
            this.tooltipObject.enableAnimation = (this.isFirst || this.isFadeout) ? false : true;
            this.isFirst = (this.isFirst) ? false : this.isFirst;
            this.isFadeout = (this.isFadeout) ? false : this.isFadeout;
            this.tooltipObject.location.x = currentRect.x + (currentRect.width / 2);
            this.tooltipObject.location.y = currentRect.y + (currentRect.height / 2);
        }
    }
}