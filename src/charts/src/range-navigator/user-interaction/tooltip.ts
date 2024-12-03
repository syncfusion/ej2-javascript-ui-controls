import { RangeNavigator, RangeSlider } from '../../range-navigator';
import { Tooltip as SVGTooltip} from '@syncfusion/ej2-svg-base';
import { getElement, createTemplate, firstToLowerCase } from '../../common/utils/helper';
import { stopTimer } from '../../common/utils/helper';
import { Axis } from '../../chart/axis/axis';
import { FontModel } from '../../common/model/base-model';
import { RangeValueType, IRangeTooltipRenderEventArgs, RangeTooltipSettingsModel } from '../../range-navigator/index';
import { Rect, measureText } from '@syncfusion/ej2-svg-base';
import { createElement } from '@syncfusion/ej2-base';
import { StockChart } from '../../stock-chart/stock-chart';


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
     *
     * @param {RangeNavigator} range - The RangeNavigator control.
     * @private
     */
    constructor(range: RangeNavigator) {
        this.control = range;
        this.elementId = range.element.id;
    }
    /**
     * Left tooltip method called here.
     *
     * @param {RangeSlider} rangeSlider - RangeSlider
     * @returns {void}
     */
    public renderLeftTooltip(rangeSlider: RangeSlider): void {
        this.fadeOutTooltip();
        const content: string[] = this.getTooltipContent(rangeSlider.currentStart);
        const contentWidth: number = this.getContentSize(content);
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
     * get the content size.
     *
     * @param {string[]} value - The array of values.
     * @returns {number} - The content size.
     */
    private getContentSize(value: string[]): number {
        let width: number;
        const font: FontModel = this.control.tooltip.textStyle;
        if (this.control.tooltip.template) {
            width = createTemplate(
                createElement('div', {
                    id: 'measureElement',
                    styles: 'position: absolute;'
                }),
                0, this.control.tooltip.template, this.control).getBoundingClientRect().width;
        } else {
            // 20 for tooltip padding
            width = measureText(value[0], font, this.control.themeStyle.tooltipLabelFont).width + 20;
        }
        return width;
    }
    /**
     * Right tooltip method called here.
     *
     * @param {RangeSlider} rangeSlider - RangeSlider
     * @returns {void}
     */
    public renderRightTooltip(rangeSlider: RangeSlider): void {
        this.fadeOutTooltip();
        const content: string[] = this.getTooltipContent(rangeSlider.currentEnd);
        const contentWidth: number = this.getContentSize(content);
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
     * Tooltip element creation.
     *
     * @param {string} id - The element id.
     * @returns {Element} - The created tooltip element.
     */
    private createElement(id: string): Element {
        if (getElement(this.elementId + id)) {
            return getElement(this.elementId + id);
        } else {
            const element: HTMLElement = document.createElement('div');
            element.id = this.elementId + id;
            element.className = 'ejSVGTooltip';
            element.style.cssText = 'pointer-events:none; position:absolute;z-index: 1';
            if (!this.control.stockChart) {
                getElement(this.elementId + '_Secondary_Element').appendChild(element);
            } else {
                const stockChart: StockChart = this.control.stockChart;
                getElement(stockChart.element.id + '_Secondary_Element').appendChild(element);
                element.style.transform = 'translateY(' +   (((stockChart.availableSize.height - stockChart.toolbarHeight - 51) +
                                                                     stockChart.toolbarHeight) + stockChart.titleSize.height) + 'px)';
            }
            return element;
        }
    }
    /**
     * Tooltip render called here.
     *
     * @param {Rect} bounds - bounds
     * @param {Element} parent - parent
     * @param {number} pointX - pointX
     * @param {string[]} content - content
     * @returns {SVGTooltip} - SVGTooltip
     */
    private renderTooltip(bounds: Rect, parent: Element, pointX: number, content: string[]): SVGTooltip {
        const control: RangeNavigator = this.control;
        const tooltip: RangeTooltipSettingsModel = control.tooltip;
        const argsData: IRangeTooltipRenderEventArgs = {
            cancel: false, name: 'tooltipRender', text: content,
            textStyle: tooltip.textStyle
        };
        this.control.trigger('tooltipRender', argsData);
        const left: number = control.svgObject.getBoundingClientRect().left -
            control.element.getBoundingClientRect().left;
        if (!argsData.cancel) {
            return new SVGTooltip(
                {
                    location: { x: pointX, y: control.rangeSlider.sliderY },
                    content: argsData.text, marginX: 2,
                    enableShadow: false,
                    marginY: 2, arrowPadding: 8, rx: 4, ry: 4,
                    inverted: control.series.length > 0,
                    areaBounds: bounds, fill: tooltip.fill ? tooltip.fill : this.control.themeStyle.tooltipBackground,
                    theme: this.control.theme,
                    clipBounds: { x: left },
                    border: tooltip.border, opacity: tooltip.opacity ?  tooltip.opacity : ((this.control.theme === 'Material3' || this.control.theme === 'Material3Dark' || this.control.theme.indexOf('Bootstrap5') > -1) ? 1 : 0.75),
                    template: tooltip.template as string | Function,
                    textStyle: argsData.textStyle,
                    availableSize: control.availableSize,
                    controlName: 'RangeNavigator',
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
     * Tooltip content processed here.
     *
     * @param {number} value - The tooltip value.
     * @returns {string[]} - An array containing the processed tooltip content.
     */
    private getTooltipContent(value: number): string[] {
        const control: RangeNavigator = this.control;
        const tooltip: RangeTooltipSettingsModel = control.tooltip;
        const xAxis: Axis = control.chartSeries.xAxis;
        let text: string;
        const format: string = tooltip.format || xAxis.labelFormat;
        const isCustom: boolean = format.match('{value}') !== null;
        const valueType: RangeValueType = xAxis.valueType as RangeValueType;
        value = (valueType === 'DateTimeCategory' ? parseInt(xAxis.labels[Math.floor(value)], 10) : value);
        if (valueType.indexOf('DateTime') > -1) {
            text = (control.intl.getDateFormat({
                format: format || 'MM/dd/yyyy',
                type: firstToLowerCase(control.skeletonType),
                skeleton: valueType === 'DateTime' ? control.dateTimeModule.getSkeleton(xAxis, null, null) : control.dateTimeCategoryModule.getSkeleton(xAxis, null, null)
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
     * Fadeout animation performed here.
     *
     * @returns {void}
     */
    private fadeOutTooltip(): void {
        const tooltip: RangeTooltipSettingsModel = this.control.tooltip;
        if (tooltip.displayMode === 'OnDemand') {
            stopTimer(this.toolTipInterval);
            if (this.rightTooltip) {
                this.toolTipInterval = +setTimeout(
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
     *
     * @returns {string} - The name of the module.
     */
    protected getModuleName(): string {
        return 'RangeTooltip';
    }
    /**
     * To destroy the tooltip.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        // Destroy method called here
    }
}
