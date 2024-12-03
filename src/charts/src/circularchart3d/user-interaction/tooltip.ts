/**
 * Circular 3D chart tooltip.
 */

import { ChildProperty, Complex, Property, extend, remove } from '@syncfusion/ej2-base';
import { BorderModel, FontModel, LocationModel } from '../../common/model/base-model';
import { Border, Font, Location } from '../../common/model/base';
import { CircularChart3D } from '../circularchart3d';
import { removeElement, stopTimer, withInBounds } from '../../common/utils/helper';
import { CircularChart3DPoints, CircularChart3DSeries } from '../renderer/series';
import { CircularChart3DTooltipSettingsModel } from './tooltip-model';
import { Tooltip as SVGTooltip, ITooltipAnimationCompleteArgs, Rect } from '@syncfusion/ej2-svg-base';
import { tooltipRender } from '../../common/model/constants';
import { CircularChart3DTooltipRenderEventArgs } from '../model/pie-interface';
import { CircularChart3DLocation } from '../model/circular3d-base';

/**
 * Represents data for a 3D point in a circular 3D series.
 *
 * @private
 */
export class CircularChart3DPointData {
    /** Gets or sets the 3D point in the circular series. */
    public point: CircularChart3DPoints;
    /** Gets or sets the circular series to which the point belongs. */
    public series: CircularChart3DSeries;
    /** Gets or sets the index of the point in the series. Default is 0. */
    public index: number;

    /**
     * Initializes a new instance of the CircularChart3DPointData class.
     *
     * @param {CircularChart3DPoints} point - The 3D point in the circular series.
     * @param {CircularChart3DSeries} series - The circular series to which the point belongs.
     * @param {number} index - The index of the point in the series. Default is 0.
     */
    constructor(point: CircularChart3DPoints, series: CircularChart3DSeries, index: number = 0) {
        this.point = point;
        this.series = series;
        this.index = index;
    }
}

/**
 * Represents the tooltip settings for a circular 3D chart.
 *
 */
export class CircularChart3DTooltipSettings extends ChildProperty<CircularChart3DTooltipSettings> {

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
    @Complex<FontModel>({ fontFamily: null, size: '12px', fontStyle: 'Normal', fontWeight: null, color: null }, Font)
    public textStyle: FontModel;

    /**
     * The format for customizing the tooltip content.
     *
     * @default null.
     */
    @Property(null)
    public format: string;

    /**
     * A custom template used to format the tooltip content. You can use ${x} and ${y} as placeholder text to display the corresponding data points.
     *
     * @default null.
     * @aspType string
     */
    @Property(null)
    public template: string | Function;

    /**
     * If set to true, tooltip will animate while moving from one point to another.
     *
     * @default false.
     */
    @Property(false)
    public enableAnimation: boolean;

    /**
     * Duration for the tooltip animation.
     *
     * @default 300
     */
    @Property(300)
    public duration: number;

    /**
     * Duration of the fade-out animation for hiding the tooltip.
     *
     * @default 700
     */
    @Property(700)
    public fadeOutDuration: number;

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
     * let pie: CircularChart3D = new CircularChart3D({
     * ...
     * tooltip: {
     * enable: true,
     * location: { x: 100, y: 150 },
     *   },
     * ...
     * });
     * pie.appendTo('#Chart');
     * ```
     */
    @Complex<LocationModel>({ x: null, y: null }, Location)
    public location: LocationModel;

}

/**
 * The `CircularChart3DTooltip` module is used to render tooltips for a circular 3D chart.
 */
export class CircularChartTooltip3D extends ChildProperty<CircularChartTooltip3D> {
    /** @private */
    public control: CircularChart3D;
    /** @private */
    public template: string | Function;
    /** @private */
    public element: HTMLElement;
    /** @private */
    public formattedText: string[];
    /** @private */
    public header: string;
    /** @private */
    public currentPoints: CircularChart3DPointData[] = [];
    /** @private */
    public previousPoints: CircularChart3DPointData[] = [];
    /** @private */
    public tooltipInterval: number;
    /** @private */
    public svgTooltip: SVGTooltip;
    /** @private */
    public isRemove: boolean;
    /** @private */
    public text: string[];
    /** @private */
    public headerText: string;
    /** @private */
    public tooltipRendered: boolean = false;

    /**
     * Handles the mouse leave event for the circular 3D chart.
     *
     * @returns {void}
     */
    public mouseLeaveHandler(): void {
        this.removeTooltip(this.control.tooltip.fadeOutDuration);
    }

    /**
     * Handles the mouse up event for the circular 3D chart.
     *
     * @param {PointerEvent | TouchEvent} event - The mouse or touch event.
     * @param {CircularChart3D} chart - The circular 3D chart instance.
     * @returns {void}
     */
    public mouseUpHandler(event: PointerEvent | TouchEvent, chart: CircularChart3D): void {
        this.control = chart;
        this.element = chart.element;
        const swipeThreshold: number = 10;
        const isWithinSwipeThreshold: boolean = Math.abs(chart.mouseX - chart.cachedX) < swipeThreshold &&
            Math.abs(chart.mouseY - chart.cachedY) < swipeThreshold;
        if (this.control.tooltip.enable && !chart.rotateActivate && isWithinSwipeThreshold
            && withInBounds(this.control.mouseX, this.control.mouseY, this.control.initialClipRect) && this.control.isTouch) {
            this.tooltip(event);
            this.removeTooltip(2000);
            this.tooltipRendered = true;
        }
        else if (this.control.isTouch) {
            this.removeTooltip(0);
        }
    }

    /**
     * Handles the mouse move event for the circular 3D chart.
     *
     * @param {PointerEvent | TouchEvent} event - The mouse or touch event.
     * @param {CircularChart3D} chart - The circular 3D chart instance.
     * @returns {void}
     */
    public mouseMoveHandler(event: PointerEvent | TouchEvent, chart: CircularChart3D): void {
        this.control = chart;
        this.element = chart.element;
        if (!this.tooltipRendered) {
            if (this.control.tooltip.enable && !chart.rotateActivate &&
                withInBounds(this.control.mouseX, this.control.mouseY, this.control.initialClipRect)) {
                this.tooltip(event);
            }
            else {
                this.removeTooltip(0);
            }
        }
        this.tooltipRendered = false;
    }

    /**
     * Displays the tooltip for the circular 3D pie chart on pointer events or touch events.
     *
     * @param  {PointerEvent} event - The event triggering the tooltip display (pointer event or touch event).
     * @returns {void}
     */
    private tooltip(event: PointerEvent | TouchEvent): void {
        this.renderSeriesTooltip(this.control,
                                 this.getPieData(event, this.control));
    }

    /**
     * Gets the HTML element with the specified ID from the document.
     *
     * @param {string} id - The ID of the HTML element to retrieve.
     * @returns {HTMLElement} - The HTML element with the specified ID, or null if not found.
     */
    private getElement(id: string): HTMLElement {
        return document.getElementById(id);
    }

    /**
     * Gets the tooltip element based on the visibility of the tooltip.
     *
     * @param {boolean} isTooltip - A flag indicating whether the tooltip is currently visible.
     * @returns {HTMLDivElement} - The tooltip element is returned, or null if the tooltip is not visible.
     */
    private getTooltipElement(isTooltip: boolean): HTMLDivElement {
        this.header = (this.control.tooltip.header === null) ? '${series.name}' : (this.control.tooltip.header);
        this.formattedText = [];
        const tooltipDiv: HTMLElement = document.getElementById(this.control.element.id + '_tooltip');
        if (!isTooltip && !tooltipDiv) {
            return this.createElement();
        }
        return null;
    }

    /**
     * Creates and returns an HTMLDivElement for the tooltip.
     *
     * @returns {HTMLDivElement} - The created HTMLDivElement for the tooltip.
     */
    private createElement(): HTMLDivElement {
        const tooltipDiv: HTMLDivElement = document.createElement('div');
        tooltipDiv.id = this.element.id + '_tooltip'; tooltipDiv.className = 'ejSVGTooltip';
        tooltipDiv.style.pointerEvents = 'none';
        tooltipDiv.style.position = 'absolute';
        tooltipDiv.style.zIndex = '1';
        return tooltipDiv;
    }

    /**
     * Renders the tooltip for a circular 3D series based on the provided point data.
     *
     * @param {CircularChart3D} chart - The circular 3D chart instance.
     * @param {CircularChart3DPointData} data - The CircularChart3D point data for which the tooltip will be rendered.
     * @returns {void}
     * @private
     */
    public renderSeriesTooltip(chart: CircularChart3D, data: CircularChart3DPointData): void {
        const svgElement: HTMLElement = this.getElement(this.element.id + '_tooltip_svg');
        const isTooltip: boolean = svgElement && parseInt(svgElement.getAttribute('opacity'), 10) > 0;
        const tooltipDiv: HTMLDivElement = this.getTooltipElement(isTooltip);
        const isFirst: boolean = !isTooltip;
        this.template = chart.tooltip.template;
        this.currentPoints = [];
        if (data.point) {
            if (this.pushData(data, tooltipDiv)) {
                this.triggerTooltipRender(data, isFirst, this.getTooltipText(data, chart.tooltip), this.findHeader(data));
            }
        } else {
            if (!data.point && this.isRemove) {
                this.removeTooltip(this.control.tooltip.fadeOutDuration);
                this.isRemove = false;
            }
        }
    }

    /**
     * Removes the tooltip with a specified duration.
     *
     * @param {number} duration - The duration for the tooltip removal animation.
     * @returns {void}
     * @private
     */
    public removeTooltip(duration: number): void {
        const tooltipElement: HTMLElement = this.getElement(this.element.id + '_tooltip');
        this.stopAnimation();
        if (tooltipElement && this.previousPoints.length > 0) {
            this.tooltipInterval = +setTimeout(
                (): void => {
                    if (this.svgTooltip) {
                        this.svgTooltip.fadeOut();
                    }
                },
                duration);
        }
    }

    /**
     * Stops the animation by clearing the tooltip interval.
     *
     * @returns {void}
     */
    private stopAnimation(): void {
        stopTimer(this.tooltipInterval);
    }

    /**
     * Pushes CircularChart3D point data to the currentPoints array and updates the tooltip div if tooltip are enabled for the series.
     *
     * @param {CircularChart3DPointData} data - The CircularChart3D point data to be pushed.
     * @param {HTMLDivElement} tooltipDiv - The tooltip div element to be updated if tooltip are enabled.
     * @returns {boolean} - A flag indicating whether the data was successfully pushed.
     */
    private pushData(data: CircularChart3DPointData, tooltipDiv: HTMLDivElement): boolean {
        if (data.series.enableTooltip) {
            this.currentPoints.push(data);
            this.stopAnimation();
            if (tooltipDiv && !document.getElementById(tooltipDiv.id)) {
                document.getElementById(this.element.id + '_Secondary_Element').appendChild(tooltipDiv);
            }
            return true;
        }
        return false;
    }

    /**
     * Triggers the rendering of a tooltip for a CircularChart3D point data.
     *
     * @param {CircularChart3DPointData} point - The CircularChart3D point data for which the tooltip will be rendered.
     * @param {boolean} isFirst - A flag indicating whether it is the first rendering of the tooltip.
     * @param {string} textCollection - The collection of text to be included in the tooltip.
     * @param {string} headerText - The header text for the tooltip.
     * @returns {void}
     */
    private triggerTooltipRender(point: CircularChart3DPointData, isFirst: boolean, textCollection: string,
                                 headerText: string): void {
        const tooltip: CircularChart3DTooltipSettingsModel = this.control.tooltip;
        const argsData: CircularChart3DTooltipRenderEventArgs = {
            cancel: false, text: textCollection, point: point.point, textStyle: tooltip.textStyle,
            series: point.series, headerText: headerText, template: this.template,
            data: {
                pointX: point.point.x, pointY: point.point.y as Object, seriesIndex: point.series.index,
                pointIndex: point.point.index, pointText: point.point.text, seriesName: point.series.name
            }
        };
        const padding: number = 10;
        const tooltipSuccess: Function = (argsData: CircularChart3DTooltipRenderEventArgs) => {
            if (!argsData.cancel) {
                this.formattedText = this.formattedText.concat(argsData.text);
                this.text = this.formattedText;
                this.headerText = argsData.headerText;
                const location: CircularChart3DLocation = {
                    x: (tooltip.location.x !== null) ? tooltip.location.x : this.control.mouseX,
                    y: (tooltip.location.y !== null) ? tooltip.location.y : this.control.mouseY - padding
                };
                this.createTooltip(
                    this.control, isFirst,
                    location,
                    point.series.clipRect, point.point, 0, this.control.initialClipRect,
                    null, point.point, this.template ? argsData.template : '');
            } else {
                this.removeHighlight();
                remove(this.getElement(this.element.id + '_tooltip'));
            }
            this.isRemove = true;
        };
        tooltipSuccess.bind(this, point);
        this.control.trigger(tooltipRender, argsData, tooltipSuccess);
    }

    /**
     * Gets the CircularChart3D point data associated with a pointer or touch event on the chart.
     *
     * @param {PointerEvent | TouchEvent} event - The pointer or touch event.
     * @param {CircularChart3D} chart - The circular 3D chart instance.
     * @returns {CircularChart3DPointData} - The CircularChart3D point data corresponding to the event.
     */
    private getPieData(event: PointerEvent | TouchEvent, chart: CircularChart3D): CircularChart3DPointData {
        let point: CircularChart3DPoints;
        const series: CircularChart3DSeries = chart.visibleSeries[0];
        const element: Element = <Element>event.target;
        if (element.id.indexOf('point') > -1 && element.id.indexOf('series') > -1) {
            const pointIndex: number = parseInt(element.id.split('point-')[1], 10);
            point = series.points[pointIndex as number];
        }
        else if (element.id.indexOf('-data-label-text') > -1 && series.dataLabel.position === 'Inside') {
            const index: number = parseInt(element.id.split('data-label-text-')[1], 10);
            point = series.points[index as number];
        }
        else if (element.id.indexOf('data-label-series') > -1 && series.dataLabel.position === 'Inside') {
            const index: number = parseInt(element.id.split('data-label-series-0-shape-')[1], 10);
            point = series.points[index as number];
        }
        if (point) {
            const pointData: CircularChart3DPointData = { point: point, series: series, index: point.index };
            return pointData;
        }
        return new CircularChart3DPointData(null, null);
    }

    /**
     * Gets the tooltip text for a circular 3D point data based on the specified tooltip settings.
     *
     * @param {CircularChart3DPointData} data - The circularChart3D point data for which the tooltip text will be generated.
     * @param {CircularChart3DTooltipSettingsModel} tooltip - The tooltip settings to determine the format of the text.
     * @returns {string} - The generated tooltip text.
     */
    private getTooltipText(data: CircularChart3DPointData, tooltip: CircularChart3DTooltipSettingsModel): string {
        const series: CircularChart3DSeries = data.series;
        let format: string = tooltip.format ? tooltip.format : '${point.x} : <b>${point.y}</b>';
        format = this.control.useGroupingSeparator ? format.replace('${point.y}', '${point.separatorY}') : format;
        return this.parseTemplate(data.point, series, format);
    }

    /**
     * Finds the header for circular 3D point data.
     *
     * @param {CircularChart3DPointData} data - The circular 3D point data for which the header will be found.
     * @returns {string} - The found header string.
     */
    private findHeader(data: CircularChart3DPointData): string {
        if (this.header === '') {
            return '';
        }
        this.header = this.parseTemplate(data.point, data.series, this.header);
        if (this.header.replace(/<b>/g, '').replace(/<\/b>/g, '').trim() !== '') {
            return this.header;
        }
        return '';
    }

    /**
     * Parses a template for a circular 3D chart.
     *
     * @param {CircularChart3DPoints} point - The circular 3D series point associated with the template.
     * @param {CircularChart3DSeries} series - The circular 3D series associated with the template.
     * @param {string} format - The format for parsing the template.
     * @returns {string} - The parsed template string.
     */
    private parseTemplate(point: CircularChart3DPoints, series: CircularChart3DSeries, format: string): string {
        let value: RegExp;
        let textValue: string;
        const regExp: RegExpConstructor = RegExp;
        for (const dataValue of Object.keys(point)) {
            value = new regExp('${point' + '.' + dataValue + '}', 'gm');
            format = format.replace(value.source, point[dataValue as string]);
        }

        for (const dataValue of Object.keys(Object.getPrototypeOf(series))) {
            value = new regExp('${series' + '.' + dataValue + '}', 'gm');
            textValue = series[dataValue as string];
            format = format.replace(value.source, textValue);
        }
        return format;
    }

    /**
     * Creates a tooltip for a circularChart3D chart.
     *
     * @param {CircularChart3D} chart - The circular 3D chart instance.
     * @param {boolean} isFirst - A flag indicating whether it is the first tooltip.
     * @param {CircularChart3DLocation} location - The location where the tooltip will be positioned.
     * @param {CircularChart3DLocation} clipLocation - The clipping location for the tooltip.
     * @param {CircularChart3DPoints} point - The circular 3D point associated with the tooltip.
     * @param {number} offset - The offset for the tooltip.
     * @param {Rect} bounds - The bounds of the tooltip.
     * @param {CircularChart3DPointData[]} extraPoints - An array of additional CircularChart3DPointData for the tooltip.
     * @param {CircularChart3DPoints | CircularChart3DPoints[]} templatePoint - The template point or points for the tooltip.
     * @param {string | Function} customTemplate - A custom template for the tooltip, specified as a string or a function.
     * @returns {void}
     */
    private createTooltip(
        chart: CircularChart3D, isFirst: boolean, location: CircularChart3DLocation, clipLocation: CircularChart3DLocation,
        point: CircularChart3DPoints, offset: number, bounds: Rect,
        extraPoints: CircularChart3DPointData[] = null,
        templatePoint: CircularChart3DPoints | CircularChart3DPoints[] = null, customTemplate?: string | Function
    ): void {
        const tooltipModule: CircularChartTooltip3D = chart.circularChartTooltip3DModule;
        if (!tooltipModule || location === null) { // For the tooltip enable is false.
            removeElement(this.control.element.id + '_tooltip');
            return;
        }

        if (isFirst) {
            this.svgTooltip = new SVGTooltip(
                {
                    opacity: chart.tooltip.opacity ? chart.tooltip.opacity : ((this.control.theme === 'Material3' || this.control.theme === 'Material3Dark' || this.control.theme.indexOf('Bootstrap5') > -1) ? 1 : 0.75),
                    header: this.headerText,
                    content: this.text,
                    fill: chart.tooltip.fill,
                    border: chart.tooltip.border,
                    enableAnimation: chart.tooltip.enableAnimation,
                    location: location,
                    shared: false,
                    crosshair: false,
                    shapes: !chart.tooltip.enableMarker ? [] : ['Circle'],
                    clipBounds: clipLocation,
                    areaBounds: bounds,
                    palette: this.findPalette(),
                    template: customTemplate || this.template as string | Function,
                    data: templatePoint,
                    theme: chart.theme,
                    offset: offset,
                    textStyle: chart.tooltip.textStyle,
                    isNegative: false,
                    inverted: false,
                    arrowPadding: 0,
                    availableSize: chart.availableSize,
                    duration: this.control.tooltip.duration,
                    isCanvas: false,
                    isFixed: (this.control.tooltip.location.x !== null || this.control.tooltip.location.y !== null),
                    isTextWrap: chart.tooltip.enableTextWrap,
                    blazorTemplate: { name: 'Template', parent: this.control.tooltip },
                    controlInstance: this.control,
                    enableRTL: chart.enableRtl,
                    controlName: 'Chart',
                    allowHighlight: false,
                    tooltipRender: () => {
                        tooltipModule.removeHighlight();
                        tooltipModule.highlightPoints();
                        tooltipModule.updatePreviousPoint(extraPoints);
                    },
                    animationComplete: (args: ITooltipAnimationCompleteArgs) => {
                        if (args.tooltip.fadeOuted) {
                            tooltipModule.fadeOut();
                        }
                    }
                });
            this.svgTooltip.appendTo(this.getElement(this.element.id + '_tooltip'));
        } else {
            if (this.svgTooltip) {
                this.svgTooltip.location = location;
                this.svgTooltip.content = this.text;
                this.svgTooltip.header = this.headerText;
                this.svgTooltip.offset = offset;
                this.svgTooltip.palette = this.findPalette();
                this.svgTooltip.shapes = !chart.tooltip.enableMarker ? [] : ['Circle'];
                this.svgTooltip.data = templatePoint;
                this.svgTooltip.template = this.template as string | Function;
                this.svgTooltip.controlName = 'Chart';
                this.svgTooltip.crosshair = false;
                this.svgTooltip.textStyle = chart.tooltip.textStyle;
                this.svgTooltip.isNegative = false;
                this.svgTooltip.clipBounds = clipLocation;
                this.svgTooltip.arrowPadding = 0;
                this.svgTooltip.allowHighlight = false;
                this.svgTooltip.dataBind();
            }
        }
        if ((this.control as any).isReact) { (this.control as any).renderReactTemplates(); }
    }

    /**
     * Highlights multiple points in a circular 3D chart series.
     * This method iterates through a collection of points (assuming they are represented by 'i') and applies the highlight effect to each point.
     *
     * @returns {void}
     */
    private highlightPoints(): void {
        for (const item of this.currentPoints) {
            if (item.series.isRectSeries && item.series.category === 'Series') {
                this.highlightPoint(item.series, item.point.index, true);
            }
        }
    }

    /**
     * Removes the highlight from a previously highlighted point in a circular 3D chart series.
     *
     * @returns {void}
     */
    private removeHighlight(): void {
        let item: CircularChart3DPointData;
        for (let i: number = 0, len: number = this.previousPoints.length; i < len; i++) {
            item = this.previousPoints[i as number];
            if (item.series.isRectSeries) {
                if (item.series.visible) {
                    this.highlightPoint(item.series, item.point.index, false);
                }
                continue;
            }
        }
    }

    /**
     * Highlights or un highlights a specific point in a circular 3D chart series.
     *
     * @param {CircularChart3DSeries} series - The circular 3D series to which the point belongs.
     * @param {number} pointIndex - The index of the point to be highlighted or un highlighted.
     * @param {boolean} highlight - A flag indicating whether to highlight (true) or un highlight (false) the point.
     * @returns {void}
     */
    private highlightPoint(series: CircularChart3DSeries, pointIndex: number, highlight: boolean): void {
        if ((this.control.circularChartHighlight3DModule && this.control.highlightMode === 'None') || !this.control.circularChartHighlight3DModule) {
            const elements: NodeListOf<Element> = document.querySelectorAll(`[id*="region-series-0-point-${pointIndex}"]`);
            const pointElements: Element[] = [];
            elements.forEach((pointElement: Element) => {
                const elementIndex: number = parseInt(pointElement.id.split('point-')[1], 10);
                if (elementIndex === pointIndex) {
                    pointElements.push(pointElement as Element);
                }
            });
            const datalabelElement: HTMLElement = document.getElementById(this.control.element.id + '-svg-data-label-text-' + pointIndex);
            const connectorElement: HTMLElement = document.getElementById(this.control.element.id + '-datalabel-series-0-connector-' + pointIndex);
            const shapeElement: HTMLElement = document.getElementById(this.control.element.id + '-svg-data-label-series-0-shape-' + pointIndex);
            if (datalabelElement) { pointElements.push(datalabelElement); }
            if (connectorElement) { pointElements.push(connectorElement); }
            if (shapeElement) { pointElements.push(shapeElement); }
            const seriesElements: Element[] = document.getElementById(this.element.id + '-svg-chart-3d').children as unknown as Element[];
            if (seriesElements) {
                for (const seriesElement of seriesElements) {
                    if (seriesElement.parentElement.id === this.control.groupElement.id) {
                        const selection: boolean = seriesElement.hasAttribute('class') ? seriesElement.getAttribute('class').indexOf('_selection_') === -1 : true;
                        seriesElement.setAttribute('opacity', (highlight && this.control.highlightColor !== 'transparent' && selection ? 0.2 : series.opacity).toString());
                    }
                }
            }
            if (pointElements) {
                pointElements.forEach((element: Element) => {
                    if (element.parentElement.id === this.control.groupElement.id) {
                        element.setAttribute('opacity', (series.opacity).toString());
                    }
                });
            }
        }
    }

    /**
     * Fades out the tooltip associated with the provided CircularChart3DPointData.
     *
     * @returns {void}
     */
    private fadeOut(): void {
        const svgElement: HTMLElement = this.getElement(this.element.id + '_tooltip_svg');
        const isTooltip: boolean = (svgElement && parseInt(svgElement.getAttribute('opacity'), 10) > 0);
        if (!isTooltip) {
            this.currentPoints = [];
            this.removeHighlight();
            this.previousPoints = [];
            this.svgTooltip = null;
            this.control.trigger('animationComplete', {});
        }
    }

    /**
     * Updates the previous point with additional CircularChart3DPointData.
     *
     * @param {CircularChart3DPointData} extraPoints - An array of additional CircularChart3DPointData to update the previous point.
     * @returns {void}
     */
    private updatePreviousPoint(extraPoints: CircularChart3DPointData[]): void {
        if (extraPoints) {
            this.currentPoints = (<CircularChart3DPointData[]>this.currentPoints).concat(extraPoints);
        }
        this.previousPoints = <CircularChart3DPointData[]>extend([], this.currentPoints, null, true);
    }

    /**
     * Finds and returns an array of colors from the current points.
     *
     * @returns {string[]} - An array of color strings.
     */
    private findPalette(): string[] {
        const colors: string[] = [];
        for (const data of this.currentPoints) {
            colors.push(data.point.color);
        }
        return colors;
    }

    /**
     * Gets the module name for the circular 3D tooltip.
     *
     * @returns {string} - The module name.
     */
    protected getModuleName(): string {
        return 'CircularChartTooltip3D';
    }

    /**
     * Destroys the circular 3D tooltip module.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        /**
         * Destroy method calling here.
         */
    }
}

