/**
 * HeatMap tool tip file
 */

import { createElement, Property, Complex, ChildProperty, isNullOrUndefined, select } from '@syncfusion/ej2-base';
import { HeatMap } from '../heatmap';
import { CurrentRect } from '../utils/helper';
import { Tooltip as tool, TooltipTheme } from '@syncfusion/ej2-svg-base';
import { TooltipBorderModel, FontModel } from '../model/base-model';
import { Series } from '../series/series';
import { ITooltipEventArgs } from '../model/interface';
import { BubbleTooltipData, TooltipBorder, Font } from '../model/base';
import { Theme } from '../model/theme';
import { DataModel } from '../datasource/adaptor-model';

/**
 * Configures the color property in Heatmap.
 */
export class TooltipSettings extends ChildProperty<TooltipSettings> {
    /**
     * Custom template to format the ToolTip content.
     *
     * @default ''
     */
    @Property('')
    public template: string;
    /**
     * Specifies the color collection for heat map cell.
     *
     * @default ''
     */
    @Property('')
    public fill: string;
    /**
     * Specifies the cell border style.
     *
     * @default ''
     */
    @Complex<TooltipBorderModel>({}, TooltipBorder)
    public border: TooltipBorderModel;

    /**
     * Specifies the cell label style.
     *
     * @default ''
     */
    @Complex<FontModel>(Theme.tooltipFont, Font)
    public textStyle: FontModel;

}
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
     *
     * @private
     */

    public showHideTooltip(isShow: boolean, isFadeout?: boolean): void {
        const ele: HTMLElement = document.getElementById(this.heatMap.element.id + 'Celltooltipcontainer');
        if (!isShow) {
            if (ele && ele.style.visibility !== 'hidden') {
                if (this.tooltipObject && isFadeout && this.heatMap.isRectBoundary) {
                    this.tooltipObject.fadeOut();
                } else {
                    if (this.tooltipObject && this.tooltipObject.element) {
                        const tooltipElement: HTMLElement = this.tooltipObject.element.firstChild as HTMLElement;
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
     * To add Tooltip to the rect cell.
     *
     * @returns {void}
     * @private
     */

    private createTooltip(currentRect : CurrentRect, x: number, y: number, tempTooltipText?: string[]): void {
        let offset: number = null;
        const element: HTMLElement = select('#' + this.heatMap.element.id + 'Celltooltipcontainer');
        if (this.heatMap.cellSettings.showLabel && this.heatMap.heatMapSeries.checkLabelXDisplay &&
            this.heatMap.heatMapSeries.checkLabelYDisplay) {
            offset = parseInt(this.heatMap.cellSettings.textStyle.size, 10) / 2;
        }
        if (this.heatMap.theme === 'Tailwind') {
            this.heatMap.setProperties({ tooltipSettings : { textStyle : { size : '12px', fontFamily : 'Inter', fontWeight : '500' }}}, true);
        }
        if (this.heatMap.theme === 'TailwindDark') {
            this.heatMap.setProperties({ tooltipSettings : { fill : '#F9FAFB', textStyle : { size: '12px', fontFamily : 'Inter', fontWeight : '500', color : '#1F2937' }}}, true);
        }
        if (this.heatMap.theme === 'Bootstrap5') {
            this.heatMap.setProperties({ tooltipSettings : { textStyle : { size: '14px', fontFamily : 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"', fontWeight : '500' }}}, true);
        }
        if (this.heatMap.theme === 'Bootstrap5Dark') {
            this.heatMap.setProperties({ tooltipSettings : { fill : '#E9ECEF', textStyle : { size: '14px', fontFamily : 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"', fontWeight : '500', color : '#212529' }}}, true);
        }
        if (this.heatMap.theme === 'Fluent') {
            this.heatMap.setProperties({ tooltipSettings : { textStyle : { size: '12px', fontFamily : '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica Neue", sans-serif', fontWeight : '500' }}}, true);
        }
        if (this.heatMap.theme === 'FluentDark') {
            this.heatMap.setProperties({ tooltipSettings : { fill : '#252423', textStyle : { size: '12px', fontFamily : '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica Neue", sans-serif', fontWeight : '500', color : '#F3F2F1' }}}, true);
        }
        this.tooltipObject = new tool(
            {
                opacity: (this.heatMap.theme === 'Tailwind' || this.heatMap.theme === 'TailwindDark' || this.heatMap.theme === 'Bootstrap5' || this.heatMap.theme === 'Bootstrap5Dark' || this.heatMap.theme === 'Fluent' || this.heatMap.theme === 'FluentDark') ? 1 : 0.75,
                enableAnimation: false,
                offset: offset,
                location: { x: x, y: y },
                availableSize: this.heatMap.availableSize,
                data: {
                    xValue: this.heatMap.heatMapSeries.hoverXAxisValue,
                    yValue: this.heatMap.heatMapSeries.hoverYAxisValue,
                    value : currentRect.value,
                    xLabel: this.heatMap.heatMapSeries.hoverXAxisLabel ?
                        this.heatMap.heatMapSeries.hoverXAxisLabel.toString() : null,
                    yLabel: this.heatMap.heatMapSeries.hoverYAxisLabel ?
                        this.heatMap.heatMapSeries.hoverYAxisLabel.toString() : null
                },
                theme: this.heatMap.theme as TooltipTheme,
                content: tempTooltipText,
                fill: this.heatMap.tooltipSettings.fill,
                template: this.heatMap.tooltipSettings.template === '' ? null : this.heatMap.tooltipSettings.template,
                border: {
                    width: this.heatMap.tooltipSettings.border.width,
                    color: this.heatMap.tooltipSettings.border.color
                },
                textStyle: {
                    size: this.heatMap.tooltipSettings.textStyle.size,
                    fontWeight: this.heatMap.tooltipSettings.textStyle.fontWeight.toLowerCase(),
                    color: this.heatMap.tooltipSettings.textStyle.color,
                    fontStyle: this.heatMap.tooltipSettings.textStyle.fontStyle.toLowerCase(),
                    fontFamily: this.heatMap.tooltipSettings.textStyle.fontFamily
                },
                areaBounds:
                    {
                        height: this.heatMap.initialClipRect.height + this.heatMap.initialClipRect.y,
                        width: this.heatMap.initialClipRect.width, x: this.heatMap.initialClipRect.x
                    }


            },
            element);
    }

    /**
     * To create div container for tooltip.
     *
     * @returns {void}
     * @private
     */

    public createTooltipDiv(heatMap: HeatMap): void {
        const position: string = 'absolute';
        const top: number = heatMap.enableCanvasRendering && heatMap.allowSelection ? heatMap.availableSize.height : 0;
        const element2: Element = <HTMLElement>createElement('div', {
            id: this.heatMap.element.id + 'Celltooltipcontainer',
            styles: 'position:' + position + '; z-index: 3;top:-' + top + 'px'
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
     *
     * @private
     */

    private getTooltipContent(currentRect: CurrentRect, hetmapSeries: Series): string[] {
        let value: number | string;
        let content: string[];
        const heatMap: HeatMap = this.heatMap;
        const adaptData: DataModel = this.heatMap.dataSourceSettings;
        if (heatMap.bubbleSizeWithColor) {
            const xAxis: string = heatMap.xAxis.title && heatMap.xAxis.title.text !== '' ? heatMap.xAxis.title.text : 'X-Axis';
            const yAxis: string = heatMap.yAxis.title && heatMap.yAxis.title.text !== '' ? heatMap.yAxis.title.text : 'Y-Axis';
            const value1: string = adaptData.isJsonData && adaptData.adaptorType === 'Cell' ?
                adaptData.bubbleDataMapping.size : 'Value 1';
            const value2: string = adaptData.isJsonData && adaptData.adaptorType === 'Cell' ?
                adaptData.bubbleDataMapping.color : 'Value 2';
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
     *
     * @private
     */

    public  renderTooltip(currentRect: CurrentRect): void {
        const hetmapSeries: Series = this.heatMap.heatMapSeries;
        let tempTooltipText: string[] = [''];
        const showTooltip: boolean = this.heatMap.bubbleSizeWithColor ?
            !isNullOrUndefined(currentRect.value) && !isNullOrUndefined((currentRect.value as BubbleTooltipData[])[0].bubbleData)
                && (currentRect.value as BubbleTooltipData[])[0].bubbleData.toString() !== '' ? true : false
            : isNullOrUndefined(currentRect.value) || (!isNullOrUndefined(currentRect.value) &&
                currentRect.value.toString() === '') ? false : true;
        if (!showTooltip) {
            this.showHideTooltip(false, false);
            if (!currentRect.visible) {
                this.showHideTooltip(false, false);
            }
        } else {
            if (!isNullOrUndefined(this.heatMap.tooltipRender)) {
                // this.tooltipObject.header = '';
                // this.tooltipObject.content = this.getTemplateText(
                //     currentRect, this.heatMap.tooltipTemplate, hetmapSeries.hoverXAxisLabel,
                //     hetmapSeries.hoverYAxisLabel);
                const content: string[] = this.getTooltipContent(currentRect, hetmapSeries);
                const argData: ITooltipEventArgs = {
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
                this.heatMap.trigger('tooltipRender', argData, (observedArgs: ITooltipEventArgs) => {
                    if (!observedArgs.cancel) {
                        tempTooltipText = observedArgs.content;
                        this.tooltipCallback(currentRect, tempTooltipText);
                    } else {
                        if (this.tooltipObject) {
                            this.showHideTooltip(false);
                        }
                    }
                });
            } else {
                //  this.tooltipObject.header = hetmapSeries.hoverYAxisLabel.toString();
                tempTooltipText = this.getTooltipContent(currentRect, hetmapSeries);
                this.tooltipCallback(currentRect, tempTooltipText);
            }
        }
    }
    /**
     * To render tooltip.
     */

    private tooltipCallback(currentRect: CurrentRect, tempTooltipText: string[]): void {
        if (!this.tooltipObject) {
            this.createTooltip(
                currentRect,
                currentRect.x + (currentRect.width / 2),
                currentRect.y + (currentRect.height / 2),
                tempTooltipText);
        } else {
            this.tooltipObject.content = tempTooltipText;
            this.tooltipObject.data = {
                xValue: this.heatMap.heatMapSeries.hoverXAxisValue,
                yValue: this.heatMap.heatMapSeries.hoverYAxisValue,
                xLabel: this.heatMap.heatMapSeries.hoverXAxisLabel ?
                    this.heatMap.heatMapSeries.hoverXAxisLabel.toString() : null,
                yLabel: this.heatMap.heatMapSeries.hoverYAxisLabel ?
                    this.heatMap.heatMapSeries.hoverYAxisLabel.toString() : null,
                value: currentRect.value
            };
        }
        this.showHideTooltip(true);
        this.tooltipObject.enableAnimation = (this.isFirst || this.isFadeout) ? false : true;
        this.isFirst = (this.isFirst) ? false : this.isFirst;
        this.isFadeout = (this.isFadeout) ? false : this.isFadeout;
        this.tooltipObject.location.x = currentRect.x + (currentRect.width / 2);
        this.tooltipObject.location.y = currentRect.y + (currentRect.height / 2);
        if (!currentRect.visible) {
            this.showHideTooltip(false, false);
        }
    }
}
