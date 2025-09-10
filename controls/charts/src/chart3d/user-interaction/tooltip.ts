import { extend, Browser, remove, ChildProperty, Property, Complex } from '@syncfusion/ej2-base';
import { ChartLocation, Point3D } from '../../common/utils/helper';
import { Rect } from '@syncfusion/ej2-svg-base';
import { Chart3DAxis } from '../axis/axis';
import { BaseTooltip } from '../../common/user-interaction/tooltip';
import { tooltipRender } from '../../common/model/constants';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { Chart3D } from '../chart3D';
import {Chart3DSeries , Chart3DPoint } from '../series/chart-series';
import { Chart3DFadeOutMode, Chart3DTooltipRenderEventArgs } from '../model/chart3d-Interface';
import { BorderModel, FontModel, LocationModel } from '../../common/model/base-model';
import { Border, Font } from '../../common/model/base';
import { Location } from '../../common/model/base';
import { valueToCoefficients } from '../utils/chart3dRender';


/**
 * Configures the ToolTips in the chart.
 *
 * @public
 */

export class Chart3DTooltipSettings extends ChildProperty<Chart3DTooltipSettings> {
    /**
     * If set to true, enables the tooltip for the data points.
     *
     * @default false.
     */
    @Property(false)
    public enable: boolean;

    /**
     * If set to true, enables the marker in the chart tooltip.
     *
     * @default true.
     */
    @Property(true)
    public enableMarker: boolean;

    /**
     * The fill color of the tooltip, specified as a valid CSS color string in hex or rgba format.
     *
     * @default null
     */
    @Property(null)
    public fill: string;

    /**
     * The header text for the tooltip. By default, it displays the series name.
     *
     * @default null
     */
    @Property(null)
    public header: string;

    /**
     * The opacity of the tooltip, expressed as a numerical value.
     *
     * @default null
     */
    @Property(null)
    public opacity: number;

    /**
     * Options for customizing the tooltip text appearance.
     */
    @Complex<FontModel>({fontFamily: null, size: '12px', fontStyle: 'Normal', fontWeight: null, color: null}, Font)
    public textStyle: FontModel;

    /**
     * The format for customizing the tooltip content.
     *
     * @default null.
     */
    @Property(null)
    public format: string;

    /**
     * A custom template used to format the Tooltip content. You can use ${x} and ${y} as placeholder text to display the corresponding data points.
     *
     * @default null.
     * @aspType string
     */
    @Property(null)
    public template: string | Function;

    /**
     * If set to true, tooltip will animate while moving from one point to another.
     *
     * @default true.
     */
    @Property(true)
    public enableAnimation: boolean;

    /**
     * Duration for the Tooltip animation.
     *
     * @default 300
     */
    @Property(300)
    public duration: number;

    /**
     * Duration of the fade-out animation for hiding the Tooltip.
     *
     * @default 1000
     */
    @Property(1000)
    public fadeOutDuration: number;

    /**
     * Fade Out duration for the Tooltip hide.
     *
     * @default Move
     */
    @Property('Move')
    public fadeOutMode: Chart3DFadeOutMode ;

    /**
     * To wrap the tooltip long text based on available space.
     * This is only application for chart tooltip.
     *
     * @default false
     */
    @Property(false)
    public enableTextWrap: boolean;


    /**
     * Options for customizing the tooltip borders.
     */
    @Complex<BorderModel>({ color: null, width: null }, Border)
    public border: BorderModel;

    /**
     * Specifies the location of the tooltip, relative to the chart.
     * If x is 20, tooltip moves by 20 pixels to the right of the chart
     * ```html
     * <div id='Chart'></div>
     * ```
     * ```typescript
     * let chart: Chart = new Chart({
     * ...
     * tooltipSettings: {
     * enable: true,
     * location: { x: 100, y: 150 },
     *   },
     * ...
     * });
     * chart.appendTo('#Chart');
     * ```
     */
    @Complex<LocationModel>({ x: null, y: null }, Location)
    public location: LocationModel;

}

/**
 * The `Tooltip` module is used to render the tooltip for chart series.
 */
export class Tooltip3D extends BaseTooltip {
    chart3D: Chart3D;
    /**
     * Constructor for tooltip module.
     *
     * @param {Chart3D} chart - Specifies the chart instance
     * @private
     */
    constructor(chart: Chart3D) {
        super(chart);
        this.chart3D = chart;
        this.commonXvalues = [];
        this.addEventListener();
    }

    /**
     *  tooltip timer ID.
     */
    private timerId: number;

    /**
     * Adds event listeners for handling mouse and touch events on the chart.
     *
     * @returns {void}
     * @private
     */
    private addEventListener(): void {
        if (this.chart.isDestroyed) { return; }
        const cancelEvent: string = Browser.isPointer ? 'pointerleave' : 'mouseleave';
        this.chart.on(cancelEvent, this.mouseLeaveHandler, this);
        this.chart.on('tapHold', this.longPress, this);
        this.chart.on(Browser.touchMoveEvent, this.mouseMoveHandler, this);
        this.chart.on(Browser.touchEndEvent, this.mouseUpHandler, this);
    }

    /**
     * Unbinding events for selection module.
     *
     * @returns {void}
     */
    private removeEventListener(): void {
        if (this.chart.isDestroyed) { return; }
        this.chart.off('pointerleave' || 'mouseleave', this.mouseLeaveHandler);
        this.chart.off('tapHold', this.longPress);
        this.chart.off(Browser.touchMoveEvent, this.mouseLeaveHandler);
        this.chart.off(Browser.touchMoveEvent, this.mouseMoveHandler);
        this.chart.off(Browser.touchEndEvent, this.mouseUpHandler);
    }

    /**
     * Handles the mouse up event for the 3D chart.
     *
     * @param {MouseEvent | PointerEvent | TouchEvent} event - The mouse or touch event.
     * @returns {void}
     * @private
     */
    private mouseUpHandler(event: MouseEvent | PointerEvent | TouchEvent): void {
        const chart: Chart3D = this.control as Chart3D;
        const data: Point3D = this.get3dData(event);
        if (chart.isTouch) {
            this.tooltip(event);
            if (chart.tooltip.fadeOutMode === 'Move') {
                this.removeTooltip(chart.tooltip.fadeOutDuration);
                clearTimeout(this.timerId);
                this.timerId = +setTimeout(() => {
                    this.removeBlurEffect();
                }, 500);
            }
            if (chart.startMove && chart.tooltip.fadeOutMode === 'Move') {
                this.removeTooltip(2000);
                this.removeBlurEffect();
            }
        } else if (!this.findData(data, this.previousPoints[0] as Point3D) && chart.tooltip.fadeOutMode === 'Click') {
            this.removeTooltip(0);
            this.removeBlurEffect();
        }
    }

    /**
     * Handles the mouse leave event for the 3D chart.
     *
     * @returns {void}
     * @private
     */
    private mouseLeaveHandler(): void {
        this.removeTooltip(this.chart.tooltip.fadeOutDuration);
        this.removeBlurEffect();
    }

    /**
     * Handles the mouse move event for the 3D chart.
     *
     * @param {MouseEvent | PointerEvent | TouchEvent} event - The mouse move event.
     * @returns {void}
     * @public
     */
    public mouseMoveHandler(event: MouseEvent | PointerEvent | TouchEvent): void {
        const chart: Chart3D = this.chart3D;
        chart.mouseX = chart.mouseX / chart.scaleX;
        chart.mouseY = chart.mouseY / chart.scaleY;
        // Tooltip for chart series.
        if (!chart.disableTrackTooltip && !chart.rotateActivate) {
            if (!chart.isTouch || (chart.startMove)) {
                this.tooltip(event);
            }
        }
    }

    /**
     * Handles the long press on chart.
     *
     * @returns {boolean} false
     * @private
     */
    private longPress(): boolean {
        return false;
    }

    private styleAdded: boolean;
    /**
     * To create Tooltip styles for series
     *
     * @returns {void}
     */
    public seriesStyles(): void {
        if (!this.styleAdded) {
            const style: HTMLStyleElement = document.createElement('style');
            style.setAttribute('id', this.element.id + '_ej2_chart_tooltip');
            (<HTMLElement>style).innerText += ' .' + this.element.id + '_ej2_tooltipDeselected { opacity:' + (0.2) + ';} ';
            document.body.appendChild(style);
            this.styleAdded = true;
        }
    }

    /**
     * Handles the tooltip display for the 3D chart.
     *
     * @param {MouseEvent | PointerEvent | TouchEvent | KeyboardEvent} e - The event triggering the tooltip display.
     * @returns {void}
     * @public
     */
    public tooltip(e: MouseEvent | PointerEvent | TouchEvent | KeyboardEvent): void {
        const elementId: string = this.element.id + '_tooltip_svg';
        const svgElement: HTMLElement = this.getElement(elementId);
        const isTooltip: boolean = (svgElement && parseInt(svgElement.getAttribute('opacity'), 10) > 0);
        const tooltipDiv: HTMLDivElement = this.getTooltipElement(isTooltip);
        if (this.chart3D.tooltip3DModule) {
            this.renderSeriesTooltip(this.chart3D, !isTooltip, tooltipDiv, e);
        }
    }

    /**
     * Finds the header for the tooltip based on the provided Point3D.
     *
     * @param {Point3D} data - The Point3D used to find the header.
     * @returns {string} - The header for the tooltip.
     * @private
     */
    public findHeader(data: Point3D): string {
        if (this.header === '') {
            return '';
        }
        this.header = this.parseTemplate(data.point, data.series, this.header, data.series.xAxis, data.series.yAxis);
        if (this.header.replace(/<b>/g, '').replace(/<\/b>/g, '').trim() !== '') {
            return this.header;
        }
        return '';
    }

    /**
     * Renders the tooltip for the series in the 3D chart.
     *
     * @param {Chart3D} chart - The 3D chart instance.
     * @param {boolean} isFirst - A boolean indicating whether it is the first series.
     * @param {HTMLDivElement} tooltipDiv - The tooltip div element.
     * @param {MouseEvent | PointerEvent | TouchEvent | KeyboardEvent} e - The event that triggered the tooltip.
     * @returns {void}
     * @private
     */
    private renderSeriesTooltip(chart: Chart3D, isFirst: boolean, tooltipDiv: HTMLDivElement,
                                e: MouseEvent | PointerEvent | TouchEvent | KeyboardEvent): void {
        const data: Point3D = this.get3dData(e);
        this.currentPoints = [];
        if (this.findData(data, this.previousPoints[0] as Point3D) &&
            ((this.previousPoints[0] && !((this.previousPoints[0].point.index === data.point.index && this.previousPoints[0].series.index
                === data.series.index) && this.chart3D.isRemove)) || !this.previousPoints[0])) {
            if (this.pushData((data as Point3D), isFirst, tooltipDiv, true)) {
                this.triggerTooltipRender(data, isFirst, this.getTooltipText(data), this.findHeader(data));
            }
        } else if (!data.point && this.chart3D.isRemove && chart.tooltip.fadeOutMode === 'Move') {
            this.removeTooltip(this.chart.tooltip.fadeOutDuration);
            this.removeBlurEffect();
            this.chart3D.isRemove = false;
        }
        if (data && data.point) {
            this.findMouseValue(data, chart);
        }
    }

    /**
     * Triggers the rendering of the tooltip with the specified point and text information.
     *
     * @param {Point3D} point - The data point for which the tooltip is triggered.
     * @param {boolean} isFirst - A boolean indicating whether it is the first series.
     * @param {string} textCollection - The text information to be displayed in the tooltip.
     * @param {string} headerText - The header text for the tooltip.
     * @returns {void}
     * @private
     */
    public triggerTooltipRender(point: Point3D, isFirst: boolean, textCollection: string,
                                headerText: string): void {
        let tooltipTemplate: string;
        const argsData: Chart3DTooltipRenderEventArgs = {
            cancel: false, text: textCollection, headerText: headerText, template: tooltipTemplate,
            textStyle: this.textStyle,
            data: {
                pointX: point.point.x, pointY: point.point.y, seriesIndex: point.series.index, seriesName: point.series.name,
                pointIndex: point.point.index, pointText: point.point.text
            }
        };
        const borderWidth: number = this.chart.border.width;
        const padding: number = 3;
        const chartTooltipSuccess: Function = (argsData: Chart3DTooltipRenderEventArgs) => {
            if (!argsData.cancel) {
                this.headerText = argsData.headerText;
                this.formattedText = this.formattedText.concat(argsData.text);
                this.text = this.formattedText;
                this.createTooltip(
                    this.chart, isFirst, this.getSymbolLocation(point),
                    point.series.clipRect, point.point, this.chart3D.tooltip.enableMarker ?  ['Circle'] : [],
                    0,
                    new Rect(borderWidth, borderWidth, this.chart.availableSize.width - padding - borderWidth * 2,
                             this.chart.availableSize.height - padding - borderWidth * 2),
                    false, null, this.getTemplateText(point),
                    this.template ? argsData.template : ''
                );
                this.blurEffect( this.chart3D.visibleSeries, point.series);
            } else {
                this.removeHighlight();
                remove(this.getElement(this.element.id + '_tooltip'));
            }
            this.chart3D.isRemove = true;
        };
        chartTooltipSuccess.bind(this, point);
        this.chart.trigger(tooltipRender, argsData, chartTooltipSuccess);
    }

    /**
     * Applies a blur effect to the specified series while removing the effect from others.
     *
     * @param {Chart3DSeries[]} visibleSeries - The array of visible series in the 3D chart.
     * @param {Chart3DSeries} tooltipSeries - The series associated with the tooltip.
     * @returns {void}
     * @private
     */
    private blurEffect(visibleSeries: Chart3DSeries[], tooltipSeries: Chart3DSeries): void {
        if (!this.chart3D.highlight3DModule || (this.chart3D.legendSettings.enableHighlight && this.chart3D.highlightMode === 'None')) {
            const pointElements: HTMLElement[] = [];
            for (const series of visibleSeries) {
                if (series.visible && series.index !== tooltipSeries.index) {
                    const elements: NodeListOf<HTMLElement> = document.querySelectorAll(`[id*="region-series-${series.index}"]`);
                    elements.forEach((el: Element) => {
                        pointElements.push(el as HTMLElement);
                    });
                }
                else if (series.visible) {
                    const tooltipElements: NodeListOf<HTMLElement> = document.querySelectorAll(`[id*="region-series-${series.index}"]`);
                    for (let i: number = 0; i < tooltipElements.length; i++) {
                        const element: HTMLElement = tooltipElements[i as number];
                        const elementClassName: string = element.getAttribute('class') || '';
                        if (elementClassName.indexOf(this.element.id + '_ej2_tooltipDeselected') > -1) {
                            element.setAttribute('class', elementClassName.replace(this.element.id + '_ej2_tooltipDeselected', ''));
                        }
                        this.chart3D.stopElementAnimation(element as HTMLElement, series.index);
                    }
                }
            }
            for (let i: number = 0; i < pointElements.length; i++) {
                if (pointElements[i as number]) {
                    let elementClassName: string = pointElements[i as number].getAttribute('class') || '';
                    elementClassName += ((elementClassName !== '') ? ' ' : '');
                    if (elementClassName.indexOf('_selection_') === -1 && elementClassName.indexOf(this.element.id + '_ej2_tooltipDeselected') === -1) {
                        pointElements[i as number].setAttribute('class', elementClassName + this.element.id + '_ej2_tooltipDeselected');
                    }
                }
            }
        }
    }
    private removeBlurEffect(): void {
        if (!this.chart3D.highlight3DModule || (this.chart3D.legendSettings.enableHighlight && this.chart3D.highlightMode === 'None')) {
            const elements: HTMLCollectionOf<Element> = document.getElementsByClassName(this.element.id + '_ej2_tooltipDeselected');
            while (elements.length > 0) {
                const element: Element = elements[0];
                const elementClassName: string = element.getAttribute('class') || '';
                if (elementClassName.indexOf(this.element.id + '_ej2_tooltipDeselected') > -1) {
                    element.setAttribute('class', elementClassName.replace(this.element.id + '_ej2_tooltipDeselected', ''));
                    const index: number = parseFloat(element.id.split('-series-')[1].split('-point-')[0]);
                    this.chart3D.highlightAnimation(element as HTMLElement, index, 700, 0.2);
                }
            }
        }
    }

    /**
     * Gets the location of the symbol based on the current mouse position in the chart.
     *
     * @param {Point3D} point - The tooltip point.
     * @returns {ChartLocation} - The location of the tooltip.
     * @private
     */
    private getSymbolLocation(point: Point3D): ChartLocation {
        const rect: ClientRect = document.getElementById(this.element.id + '_svg').getBoundingClientRect();
        let upperElement: NodeListOf<Element>;
        if (point.series.columnFacet === 'Cylinder') {
            upperElement = document.querySelectorAll('[id*="' + this.element.id + '-svg-' + (point.series.type.indexOf('Column') === -1 ? '0' : '1') + '-region-series-' + point.series.index + '-point-' + point.point.index + '"]');
        }
        else {
            upperElement = document.querySelectorAll('[id*="' + this.element.id + '-svg-' + (point.series.type.indexOf('Column') === -1 ? '5' : '2') + '-region-series-' + point.series.index + '-point-' + point.point.index + '"]');
        }
        let tooltipElement: ClientRect;
        if (upperElement) {
            if (upperElement.length === 1) {
                tooltipElement = upperElement[0].getBoundingClientRect();
            }
            else {
                for (let i: number = 0; i < upperElement.length; i++) {
                    const element: Element = upperElement[i as number];
                    if (element.id.indexOf('-' + point.point.index + '-back-front') !== -1 || element.id.indexOf('-' + point.point.index + '-front-back') !== -1) {
                        tooltipElement = element.getBoundingClientRect();
                        break;
                    }
                }
            }
            if (upperElement.length !== 0 && !tooltipElement) {
                tooltipElement = upperElement[0].getBoundingClientRect();
            }
        }
        const location: ChartLocation = new ChartLocation((this.chart3D.tooltip.location.x !== null) ? this.chart3D.tooltip.location.x :
            tooltipElement.left - rect.left + (tooltipElement.width / 2), (this.chart3D.tooltip.location.y !== null) ?
            this.chart3D.tooltip.location.y : tooltipElement.top - rect.top + (tooltipElement.height / 2));
        return location;
    }

    /**
     * Gets the tooltip text based on the provided point data.
     *
     * @param {Point3D} pointData - The data of the point for which the tooltip is generated.
     * @returns {string} - The tooltip text.
     * @private
     */
    public getTooltipText(pointData: Point3D): string {
        return this.parseTemplate(pointData.point,
                                  pointData.series, this.getFormat(this.chart3D, pointData.series),
                                  pointData.series.xAxis, pointData.series.yAxis);
    }

    /**
     * Gets the template text based on the provided data.
     *
     * @param {Point3D} data - The data object for which the template text is generated.
     * @returns {Chart3DPoint | Chart3DPoint[]} - The template text.
     * @private
     */
    private getTemplateText(data: Point3D): Chart3DPoint | Chart3DPoint[] {
        if (this.template) {
            const point: Chart3DPoint = extend({}, data.point) as Chart3DPoint;
            point.x = this.formatPointValue(data.point, data.series.xAxis, 'x', true, false);
            point.y = this.formatPointValue(data.point, data.series.yAxis, 'y', false, true);
            return point;
        } else {
            return data.point;
        }
    }

    /**
     * Finds the mouse value based on the provided data and chart.
     *
     * @param {Point3D} data - The data object containing information about the point.
     * @param {Chart3D} chart - The Chart3D instance.
     * @returns {void}
     * @private
     */
    private findMouseValue(data: Point3D, chart: Chart3D): void {
        if (!chart.requireInvertedAxis) {
            this.valueX = valueToCoefficients(data.point.xValue, data.series.xAxis) *
            data.series.xAxis.rect.width + data.series.xAxis.rect.x;
            this.valueY = chart.mouseY;
        } else {
            this.valueY = (1 - valueToCoefficients(data.point.xValue, data.series.xAxis)) * data.series.xAxis.rect.height
                + data.series.xAxis.rect.y;
            this.valueX = chart.mouseX;
        }
    }

    /**
     * Parses the template using the provided point, series, format, xAxis, and yAxis information.
     *
     * @param {Chart3DPoint} point - The point for which the template needs to be parsed.
     * @param {Chart3DSeries} series - The series associated with the point.
     * @param {string} format - The format string.
     * @param {Chart3DAxis} xAxis - The X-axis of the chart.
     * @param {Chart3DAxis} yAxis - The Y-axis of the chart.
     * @returns {string} - The parsed template string.
     * @private
     */
    private parseTemplate(point: Chart3DPoint, series: Chart3DSeries, format: string, xAxis: Chart3DAxis, yAxis: Chart3DAxis): string {
        let val: RegExp;
        let textValue: string;
        const regExp: RegExpConstructor = RegExp;
        for (const dataValue of Object.keys(point)) {
            val = new regExp('${point' + '.' + dataValue + '}', 'gm');
            format = format.replace(
                val.source, this.formatPointValue(
                    point, val.source === '${point.x}' ? xAxis : yAxis,
                    dataValue, val.source === '${point.x}',
                    (
                        val.source === '${point.y}'
                    )
                )
            );
        }

        for (const dataValue of Object.keys(Object.getPrototypeOf(series))) {
            val = new regExp('${series' + '.' + dataValue + '}', 'gm');
            textValue = series[dataValue as string];
            format = format.replace(val.source, textValue);
        }
        return format;
    }

    /**
     * Formats the point value based on the provided point, axis, dataValue, and other flags.
     *
     * @param {Chart3DPoint} point - The point for which the value needs to be formatted.
     * @param {Chart3DAxis} axis - The axis associated with the point.
     * @param {string} dataValue - The data value to be formatted.
     * @param {boolean} isXPoint - Indicates whether the point is on the X-axis.
     * @param {boolean} isYPoint - Indicates whether the point is on the Y-axis.
     * @returns {string} - The formatted point value.
     * @private
     */
    private formatPointValue(point: Chart3DPoint, axis: Chart3DAxis, dataValue: string, isXPoint: boolean, isYPoint: boolean): string {
        let textValue: string;
        let customLabelFormat: boolean;
        let value: string;
        if (axis.valueType !== 'Category' && isXPoint) {
            customLabelFormat = axis.labelFormat && axis.labelFormat.match('{value}') !== null;
            textValue = customLabelFormat ? axis.labelFormat.replace('{value}', axis.format(point[dataValue as string])) :
                axis.format(point[dataValue as string]);
        } else if (isYPoint && !isNullOrUndefined(point[dataValue as string])) {
            customLabelFormat = axis.labelFormat && axis.labelFormat.match('{value}') !== null;
            value = axis.format(point[dataValue as string]);
            textValue = customLabelFormat ? axis.labelFormat.replace('{value}', value) : value;

        } else {
            textValue = point[dataValue as string];
        }
        return textValue;
    }

    /**
     * Gets the format for the tooltip based on the provided chart and series.
     *
     * @param {Chart3D} chart - The 3D chart instance.
     * @param {Chart3DSeries} series - The 3D series for which the tooltip format is needed.
     * @returns {string} - The tooltip format.
     * @private
     */
    private getFormat(chart: Chart3D, series: Chart3DSeries): string {
        if (series.tooltipFormat) {
            return series.tooltipFormat;
        }
        if (!series.tooltipFormat && chart.tooltip.format) {
            return chart.tooltip.format;
        }
        const textX: string = '${point.x}';
        const format: string = textX;
        return format + ' : ' + (chart.theme.indexOf('Tailwind3') > -1 ? '${point.y}' : '<b>${point.y}</b>');
    }

    /**
     * Gets the 3D data (point and series) associated with the provided event in the chart.
     *
     * @param {MouseEvent | PointerEvent | TouchEvent | KeyboardEvent} event - The event for which to retrieve 3D data.
     * @returns {Point3D} - The 3D data object containing the point and series information.
     * @private
     */
    public get3dData(event: MouseEvent | PointerEvent | TouchEvent | KeyboardEvent): Point3D {
        const chart: Chart3D = this.chart3D;
        let point: Chart3DPoint = null;
        let series: Chart3DSeries = null;
        const currentX: number = this.chart3D.mouseX;
        const currentY: number = this.chart3D.mouseY;
        const rect: Rect = this.chart3D.chartAxisLayoutPanel.seriesClipRect;
        let index: string[] | null;
        let pointIndex: number | undefined;
        let seriesIndex: number | undefined;
        const targetElement: HTMLElement = event.target as HTMLElement;
        if (targetElement && currentX > rect.x && currentX < (rect.x + rect.width) &&
            currentY > rect.y && currentY < (rect.y + rect.height)) {
            const nodeName: string | null = targetElement.nodeName;
            if ((nodeName === 'shape' || nodeName === 'path') && targetElement.id.indexOf('region') > 1) {
                index = targetElement.id.match(/(\d+)/g);
                pointIndex = parseInt(index[index.length - 1].toString(), 10);
                seriesIndex = parseInt(index[index.length - 2].toString(), 10);
            }
        }
        if (!isNullOrUndefined(seriesIndex)) {
            series = chart.visibleSeries[seriesIndex as number];
        }
        if ( series) {
            if (series.visible) {
                point = series.points[pointIndex as number];
            }
            if (point) {
                return new Point3D(point, series);
            }
        }
        return new Point3D(point, series);
    }

    /**
     * Finds data based on the provided 3D data and the previous 3D data.
     *
     * @param {Point3D} data - The current 3D data.
     * @param {Point3D} previous - The previous 3D data.
     * @returns {boolean} - Returns true if the data is found based on the conditions.
     * @private
     */
    private findData(data: Point3D, previous: Point3D): boolean {
        return data.point && ((!previous || (previous.point !== data.point)) || (previous.point === data.point));
    }

    /**
     * Gets the module name.
     *
     * @returns {string} - The module name.
     */
    protected getModuleName(): string {
        /**
         * Returns the module name
         */
        return 'Tooltip3D';
    }

    /**
     * To destroy the tooltip.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        /**
         * Destroy method performed here
         */
        this.removeEventListener();
    }
}
