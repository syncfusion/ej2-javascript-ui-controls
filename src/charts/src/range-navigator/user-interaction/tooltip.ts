import { RangeNavigator, RangeSlider } from '../../range-navigator';
import { Tooltip as SVGTooltip } from '@syncfusion/ej2-svg-base';
import { Rect, getElement } from '../../common/utils/helper';
import { stopTimer } from '../../common/utils/helper';
import { RangeTooltipSettingsModel, firstToLowerCase, Axis, FontModel } from '../../index';
import { RangeValueType, IRangeTooltipRenderEventArgs, measureText, createTemplate } from '../../index';
import { createElement } from '@syncfusion/ej2-base';


/**
 * `Tooltip` module is used to render the tooltip for chart series.
 */
export class RangeTooltip {
    public leftTooltip: SVGTooltip;
    public rightTooltip: SVGTooltip;
    private elementId: string;
    public toolTipInterval: number;
    private control: RangeNavigator;
    /**
     * Constructor for tooltip module.
     * @private.
     */
    constructor(range: RangeNavigator) {
        this.control = range;
        this.elementId = range.element.id;
    }
    /**
     * Left tooltip method called here
     * @param rangeSlider 
     */
    public renderLeftTooltip(rangeSlider: RangeSlider): void {
        this.fadeOutTooltip();
        let content: string[] = this.getTooltipContent(rangeSlider.currentStart);
        let contentWidth: number = this.getContentSize(content);
        let rect: Rect = this.control.enableRtl ? rangeSlider.rightRect : rangeSlider.leftRect;
        if (contentWidth > rect.width) {
            rect = rangeSlider.midRect;
        }
        this.leftTooltip = this.renderTooltip(
            rect, this.createElement('_leftTooltip'),
            rangeSlider.startX, content
        );
    }
    /**
     * get the content size
     * @param value 
     */
    private getContentSize(value: string[]): number {
        let width: number;
        let font: FontModel = this.control.tooltip.textStyle;
        if (this.control.tooltip.template) {
            width = createTemplate(
                createElement('div', {
                    id: 'measureElement',
                    styles: 'position: absolute;'
                }),
                0, this.control.tooltip.template, this.control).getBoundingClientRect().width;
        } else {
            // 20 for tooltip padding
            width = measureText(value[0], font).width + 20;
        }
        return width;
    }
    /**
     * Right tooltip method called here
     * @param rangeSlider 
     */
    public renderRightTooltip(rangeSlider: RangeSlider): void {
        this.fadeOutTooltip();
        let content: string[] = this.getTooltipContent(rangeSlider.currentEnd);
        let contentWidth: number = this.getContentSize(content);
        let rect: Rect = this.control.enableRtl ? rangeSlider.leftRect : rangeSlider.rightRect;
        if (contentWidth > rect.width) {
            rect = rangeSlider.midRect;
            rect.x = !this.control.series.length ? rect.x : 0;
        }
        this.rightTooltip = this.renderTooltip(
            rect, this.createElement('_rightTooltip'),
            rangeSlider.endX, content
        );
    }
    /**
     * Tooltip element creation
     * @param id 
     */
    private createElement(id: string): Element {
        if (getElement(this.elementId + id)) {
            return getElement(this.elementId + id);
        } else {
            let element: HTMLElement = document.createElement('div');
            element.id = this.elementId + id;
            element.className = 'ejSVGTooltip';
            element.setAttribute('style', 'pointer-events:none; position:absolute;z-index: 1');
            getElement(this.elementId + '_Secondary_Element').appendChild(element);
            return element;
        }
    }
    /**
     * Tooltip render called here
     * @param bounds 
     * @param parent 
     * @param pointX 
     * @param value 
     */
    private renderTooltip(bounds: Rect, parent: Element, pointX: number, content: string[]): SVGTooltip {
        let control: RangeNavigator = this.control;
        let tooltip: RangeTooltipSettingsModel = control.tooltip;
        let argsData: IRangeTooltipRenderEventArgs = {
            cancel: false, name: 'tooltipRender', text: content,
            textStyle: tooltip.textStyle
        };
        this.control.trigger('tooltipRender', argsData);
        let left: number = control.svgObject.getBoundingClientRect().left -
            control.element.getBoundingClientRect().left;
        if (!argsData.cancel) {
            return new SVGTooltip(
                {
                    location: { x: pointX, y: control.rangeSlider.sliderY },
                    content: argsData.text, marginX: 2,
                    enableShadow: false,
                    marginY: 2, arrowPadding: 8, rx: 0, ry: 0,
                    inverted: control.series.length > 0,
                    areaBounds: bounds, fill: tooltip.fill,
                    theme: this.control.theme,
                    //enableShadow: false,
                    clipBounds: { x: left },
                    border: tooltip.border, opacity: tooltip.opacity,
                    template: tooltip.template,
                    textStyle: argsData.textStyle,
                    data: {
                        'start': this.getTooltipContent(this.control.startValue)[0],
                        'end': this.getTooltipContent(this.control.endValue)[0],
                        'value': content[0]
                    }
                },
                parent as HTMLElement
            );
        } else {
            return null;
        }
    }
    /**
     * Tooltip content processed here
     * @param value 
     */
    private getTooltipContent(value: number): string[] {
        let control: RangeNavigator = this.control;
        let tooltip: RangeTooltipSettingsModel = control.tooltip;
        let xAxis: Axis = control.chartSeries.xAxis;
        let text: string;
        let format: string = tooltip.format || xAxis.labelFormat;
        let isCustom: boolean = format.match('{value}') !== null;
        let valueType: RangeValueType = xAxis.valueType as RangeValueType;
        if (valueType === 'DateTime') {
            text = (control.intl.getDateFormat({
                format: format || 'MM/dd/yyyy',
                type: firstToLowerCase(control.skeletonType),
                skeleton: control.dateTimeModule.getSkeleton(xAxis, null, null)
            }))(new Date(value));
        } else {
            xAxis.format = control.intl.getNumberFormat({
                format: isCustom ? '' : format,
                useGrouping: control.useGroupingSeparator
            });
            text = control.doubleModule.formatValue(
                xAxis, isCustom, format,
                valueType === 'Logarithmic' ? Math.pow(xAxis.logBase, value) : value
            );
        }
        return [text];
    }
    /**
     * Fadeout animation performed here
     */
    private fadeOutTooltip(): void {
        let tooltip: RangeTooltipSettingsModel = this.control.tooltip;
        if (tooltip.displayMode === 'OnDemand') {
            stopTimer(this.toolTipInterval);
            if (this.rightTooltip) {
                this.toolTipInterval = setTimeout(
                    (): void => {
                        this.leftTooltip.fadeOut();
                        this.rightTooltip.fadeOut();
                    },
                    1000
                );
            }
        }
    }
    /**
     * Get module name.
     */
    protected getModuleName(): string {
        return 'RangeTooltip';
    }
    /**
     * To destroy the tooltip.
     * @return {void}
     * @private
     */
    public destroy(chart: RangeNavigator): void {
        // Destroy method called here
    }
}