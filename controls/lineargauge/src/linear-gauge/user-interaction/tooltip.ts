import { createElement, Browser } from '@syncfusion/ej2-base';
import { LinearGauge } from '../../linear-gauge';
import { Axis, Pointer } from '../axes/axis';
import { TooltipSettings } from '../model/base';
import { IVisiblePointer, ITooltipRenderEventArgs } from '../model/interface';
import { tooltipRender } from '../model/constant';
import { FontModel, BorderModel } from '../model/base-model';
import { Tooltip } from '@syncfusion/ej2-svg-base';
import { getElement, GaugeLocation, Size, textFormatter, formatValue, Rect } from '../utils/helper';
import { getPointer } from '../utils/helper';

/**
 * Represent the tooltip rendering for gauge 
 */
export class GaugeTooltip {
    private gauge: LinearGauge;
    private element: HTMLElement;
    private currentAxis: Axis;
    private axisIndex: number;
    private currentPointer: Pointer;
    private isTouch: boolean;
    private svgTooltip: Tooltip;
    private textStyle: FontModel;
    private borderStyle: BorderModel;
    private pointerElement: Element;
    private tooltip: TooltipSettings;
    private clearTimeout: number;
    private tooltipId: string;
    constructor(gauge: LinearGauge) {
        this.gauge = gauge;
        this.element = gauge.element;
        this.tooltip = <TooltipSettings>gauge.tooltip;
        this.textStyle = this.tooltip.textStyle;
        this.borderStyle = this.tooltip.border;
        this.tooltipId = this.gauge.element.id + '_LinearGauge_Tooltip';
        this.addEventListener();
    }
    /**
     * Internal use for tooltip rendering
     * @param pointerElement 
     */
     /* tslint:disable:no-string-literal */
    public renderTooltip(e: PointerEvent): void {
        let pageX: number; let pageY: number;
        let target: Element; let touchArg: TouchEvent;
        if (e.type.indexOf('touch') !== - 1) {
            this.isTouch = true;
            touchArg = <TouchEvent & PointerEvent>e;
            pageX = touchArg.changedTouches[0].pageX;
            pageY = touchArg.changedTouches[0].pageY;
            target = <Element>touchArg.target;
        } else {
            this.isTouch = e.pointerType === 'touch';
            pageX = e.pageX;
            pageY = e.pageY;
            target = <Element>e.target;
        }
        let tooltipEle: HTMLElement; let tooltipContent: string[] = [];
        if (target.id.indexOf('Pointer') > -1) {
            this.pointerElement = target;
            let areaRect: ClientRect = this.gauge.element.getBoundingClientRect();
            let current: IVisiblePointer = getPointer(<HTMLElement>this.pointerElement, this.gauge);
            this.currentAxis = current.axis;
            this.axisIndex = current.axisIndex;
            this.currentPointer = current.pointer;
            tooltipContent = [textFormatter(this.tooltip.format, { value: this.currentPointer.currentValue }, this.gauge) ||
                formatValue(this.currentPointer.currentValue, this.gauge).toString()];
            if (document.getElementById(this.tooltipId)) {
                tooltipEle = document.getElementById(this.tooltipId);
            } else {
                tooltipEle = createElement('div', {
                    id: this.tooltipId,
                    className: 'EJ2-LinearGauge-Tooltip',
                    styles: 'position: absolute;pointer-events:none;'
                });
                document.getElementById(this.gauge.element.id + '_Secondary_Element').appendChild(tooltipEle);
            }
            let location: GaugeLocation = this.getTooltipLocation();
            let args: ITooltipRenderEventArgs = {
                name: tooltipRender, cancel: false, gauge: this.gauge, event: e, location: location, content: tooltipContent[0],
                tooltip: this.tooltip, axis: this.currentAxis, pointer: this.currentPointer
            };
            let tooltipPos: string = this.getTooltipPosition();
            location.y += (this.tooltip.template && tooltipPos === 'Top') ? 20 : 0;
            location.x += (this.tooltip.template && tooltipPos === 'Right') ? 20 : 0;
            this.gauge.trigger(tooltipRender, args);
            let template: string = args.tooltip.template;
            if (template !== null && Object.keys(template).length === 1) {
                template = template[Object.keys(template)[0]];
            }
            if (!args.cancel) {
                args['tooltip']['properties']['textStyle']['color'] = (this.gauge.theme === 'Highcontrast') ? '#00000' : '#FFFFFF';
                this.svgTooltip = new Tooltip({
                    enable: true,
                    header: '',
                    data: { value: args.pointer.currentValue },
                    template: template,
                    content: [args.content],
                    shapes: [],
                    location: args.location,
                    palette: [],
                    inverted: !(args.gauge.orientation === 'Horizontal'),
                    enableAnimation: args.tooltip.enableAnimation,
                    fill: (this.gauge.theme === 'Highcontrast') ? '#FFFFFF' : args.tooltip.fill,
                    areaBounds: new Rect(
                        areaRect.left,
                        tooltipPos === 'Bottom' ? location.y : areaRect.top,
                        tooltipPos === 'Right' ? Math.abs(areaRect.left - location.x) : areaRect.width,
                        areaRect.height
                    ),
                    textStyle: args.tooltip.textStyle,
                    border: args.tooltip.border,
                    theme: args.gauge.theme
                });
                this.svgTooltip.appendTo(tooltipEle);
            }
        } else {
            clearTimeout(this.clearTimeout);
            this.clearTimeout = setTimeout(this.removeTooltip.bind(this), 2000);
        }
    }

    private getTooltipPosition(): string {
        let position: string;
        if (this.gauge.orientation === 'Vertical') {
            position = (!this.currentAxis.opposedPosition) ? 'Left' : 'Right';
        } else {
            position = (this.currentAxis.opposedPosition) ? 'Top' : 'Bottom';
        }
        return position;
    }

    private getTooltipLocation(): GaugeLocation {
        let location: GaugeLocation;
        let bounds: ClientRect; let radix: number = 10;
        let lineX: number; let lineY: number;
        let size: Size = new Size(this.gauge.availableSize.width, this.gauge.availableSize.height);
        let x: number; let y: number; let height: number; let width: number;
        let lineId: string = this.gauge.element.id + '_AxisLine_' + this.axisIndex;
        let tickID: string = this.gauge.element.id + '_MajorTicksLine_' + this.axisIndex;
        let lineBounds: ClientRect;
        if (getElement(lineId)) {
            lineBounds = getElement(lineId).getBoundingClientRect();
            lineX = lineBounds.left;
            lineY = lineBounds.top;
        } else {
            lineBounds = getElement(tickID).getBoundingClientRect();
            lineX = (!this.currentAxis.opposedPosition) ? (lineBounds.left + lineBounds.width) : lineBounds.left;
            lineY = (!this.currentAxis.opposedPosition) ? (lineBounds.top + lineBounds.height) : lineBounds.top;
        }
        bounds = this.pointerElement.getBoundingClientRect();
        let elementRect: ClientRect = this.gauge.element.getBoundingClientRect();
        x = bounds.left - elementRect.left;
        y = bounds.top - elementRect.top;
        height = bounds.height;
        width = bounds.width;
        if (this.gauge.orientation === 'Vertical') {
            x = (lineX - elementRect.left);
            y = (this.currentPointer.type === 'Marker') ? y + (height / 2) : (!this.currentAxis.isInversed) ? y : y + height;
        } else {
            y = (lineY - elementRect.top);
            x = (this.currentPointer.type === 'Marker') ? (x + width / 2) : (!this.currentAxis.isInversed) ? x + width : x;
        }
        location = new GaugeLocation(x, y);
        return location;
    }

    public removeTooltip(): void {
        if (document.getElementsByClassName('EJ2-LinearGauge-Tooltip').length > 0) {
            document.getElementsByClassName('EJ2-LinearGauge-Tooltip')[0].remove();
        }
    }

    public mouseUpHandler(e: PointerEvent): void {
        this.renderTooltip(e);
        clearTimeout(this.clearTimeout);
        this.clearTimeout = setTimeout(this.removeTooltip.bind(this), 2000);
    }

    /**
     * To bind events for tooltip module
     */
    public addEventListener(): void {
        if (this.gauge.isDestroyed) {
            return;
        }
        this.gauge.on(Browser.touchMoveEvent, this.renderTooltip, this);
        this.gauge.on(Browser.touchEndEvent, this.mouseUpHandler, this);
    }
    /**
     * To unbind events for tooltip module
     */
    public removeEventListener(): void {
        if (this.gauge.isDestroyed) {
            return;
        }
        this.gauge.off(Browser.touchMoveEvent, this.renderTooltip);
        this.gauge.off(Browser.touchEndEvent, this.mouseUpHandler);
    }
    /*
     * Get module name.
     */
    protected getModuleName(): string {
        return 'Tooltip';
    }

    /**
     * To destroy the tooltip. 
     * @return {void}
     * @private
     */
    public destroy(gauge: LinearGauge): void {
        // Destroy method performed here
        this.removeEventListener();
    }
}