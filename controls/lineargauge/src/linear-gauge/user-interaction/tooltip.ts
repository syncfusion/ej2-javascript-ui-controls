/* eslint-disable valid-jsdoc */
/* eslint-disable @typescript-eslint/dot-notation */
import { createElement, Browser } from '@syncfusion/ej2-base';
import { LinearGauge } from '../../linear-gauge';
import { Axis, Pointer, Range } from '../axes/axis';
import { TooltipSettings } from '../model/base';
import { IVisiblePointer, ITooltipRenderEventArgs } from '../model/interface';
import { tooltipRender } from '../model/constant';
import { TooltipPosition} from '../utils/enum';
import { FontModel, BorderModel } from '../model/base-model';
import { Tooltip } from '@syncfusion/ej2-svg-base';
import { RangeModel} from '../axes/axis-model';
import { getElement, GaugeLocation, Size, textFormatter, formatValue, Rect, getMousePosition } from '../utils/helper';
import { getPointer } from '../utils/helper';
import { TooltipTheme } from '@syncfusion/ej2-svg-base/src/tooltip/enum';

/**
 * Represent the tooltip rendering for gauge
 */
export class GaugeTooltip {
    private gauge: LinearGauge;
    private element: HTMLElement;
    private currentAxis: Axis;
    private axisIndex: number;
    private currentPointer: Pointer;
    private currentRange: RangeModel;
    private isTouch: boolean;
    private svgTooltip: Tooltip;
    private textStyle: FontModel;
    private borderStyle: BorderModel;
    private pointerElement: Element;
    private tooltip: TooltipSettings;
    private clearTimeout: number;
    private tooltipId: string;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
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
     *
     * @param pointerElement
     */
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
        let tooltipEle: HTMLElement; let tooltipContent: string;
        if (target.id.indexOf('Pointer') > -1 && this.gauge.tooltip.type.indexOf('Pointer') > -1) {
            this.pointerElement = target;
            const areaRect: ClientRect = this.gauge.element.getBoundingClientRect();
            const current: IVisiblePointer = getPointer(<HTMLElement>this.pointerElement, this.gauge);
            this.currentAxis = current.axis;
            this.axisIndex = current.axisIndex;
            this.currentPointer = current.pointer;
            const customTooltipFormat: boolean = this.tooltip.format && this.tooltip.format.match('{value}') !== null;
            this.tooltip.textStyle.fontFamily = this.gauge.themeStyle.fontFamily || this.tooltip.textStyle.fontFamily;
            this.tooltip.textStyle.opacity = this.gauge.themeStyle.tooltipTextOpacity || this.tooltip.textStyle.opacity;
            tooltipContent = customTooltipFormat ? textFormatter(
                this.tooltip.format, { value: this.currentPointer.currentValue }, this.gauge) :
                formatValue(this.currentPointer.currentValue, this.gauge).toString();
            tooltipEle = this.tooltipCreate(tooltipEle);
            this.tooltipRender(tooltipContent, target, tooltipEle, e, areaRect, pageX, pageY);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (this.gauge as any).renderReactTemplates();
        } else if (target.id.indexOf('Range') > -1 && this.gauge.tooltip.type.indexOf('Range') > -1) {
            this.pointerElement = target;
            const areaRect: ClientRect = this.gauge.element.getBoundingClientRect();
            const current: IVisiblePointer = getPointer(<HTMLElement>this.pointerElement, this.gauge);
            this.currentAxis = current.axis;
            this.axisIndex = current.axisIndex;
            const rangePosition: number = Number(target.id.charAt(target.id.length - 1));
            this.currentRange = this.currentAxis.ranges[rangePosition];
            const startData: string = (this.currentRange.start).toString();
            const endData: string = (this.currentRange.end).toString();
            const rangeTooltipFormat: string = this.gauge.tooltip.rangeSettings.format || this.currentAxis.labelStyle.format;
            const customTooltipFormat: boolean = rangeTooltipFormat && ( rangeTooltipFormat.match('{end}') !== null ||
            rangeTooltipFormat.match('{start}') !== null );
            this.tooltip.rangeSettings.textStyle.fontFamily = this.gauge.themeStyle.fontFamily ||
            this.tooltip.rangeSettings.textStyle.fontFamily;
            this.tooltip.rangeSettings.textStyle.opacity = this.gauge.themeStyle.tooltipTextOpacity ||
            this.tooltip.rangeSettings.textStyle.opacity;
            tooltipContent = customTooltipFormat ? rangeTooltipFormat.replace(/{start}/g, startData).replace(/{end}/g, endData) :
                'Start : ' + startData + '<br>' + 'End : ' + endData;
            tooltipEle = this.tooltipCreate(tooltipEle);
            this.tooltipRender(tooltipContent, target, tooltipEle, e, areaRect, pageX, pageY);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (this.gauge as any).renderReactTemplates();
        } else {
            this.removeTooltip();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (this.gauge as any).clearTemplate();
        }
    }

    private tooltipRender(tooltipContent: string, target: Element, tooltipEle: HTMLElement, e: PointerEvent, areaRect: ClientRect,
                          pageX: number, pageY : number): void {
        let location: GaugeLocation = this.getTooltipLocation();
        if ((this.tooltip.rangeSettings.showAtMousePosition && target.id.indexOf('Range') > -1) ||
            (this.tooltip.showAtMousePosition && target.id.indexOf('Pointer') > -1)) {
            location = getMousePosition(pageX, pageY, this.gauge.svgObject);
        }
        const args: ITooltipRenderEventArgs = {
            name: tooltipRender,
            cancel: false,
            gauge: this.gauge,
            event: e,
            location: location,
            content: tooltipContent,
            tooltip: this.tooltip,
            axis: this.currentAxis,
            pointer: this.currentPointer
        };
        const tooltipPos: string = this.getTooltipPosition();
        location.y += ((this.tooltip.rangeSettings.template && tooltipPos === 'Top') ||
        (this.tooltip.template && tooltipPos === 'Top')) ? 20 : 0;
        location.x += ((this.tooltip.rangeSettings.template && tooltipPos === 'Right') ||
        (this.tooltip.template && tooltipPos === 'Right')) ? 20 : 0;
        this.gauge.trigger(tooltipRender, args, (observedArgs: ITooltipRenderEventArgs) => {
            let template: string = (target.id.indexOf('Range') > -1) ? args.tooltip.rangeSettings.template : args.tooltip.template;
            if (template !== null && Object.keys(template).length === 1) {
                template = template[Object.keys(template)[0]];
            }
            const themes: string = this.gauge.theme.toLowerCase();
            if (!args.cancel) {
                args['tooltip']['properties']['textStyle']['color'] = (target.id.indexOf('Range') > -1) ?
                    this.tooltip.rangeSettings.textStyle.color || this.gauge.themeStyle.tooltipFontColor : this.tooltip.textStyle.color || this.gauge.themeStyle.tooltipFontColor;
                const fillColor: string = (target.id.indexOf('Range') > -1) ? this.tooltip.rangeSettings.fill : this.tooltip.fill;
                this.svgTooltip = this.svgCreate(this.svgTooltip, args, this.gauge, areaRect, fillColor, template, tooltipPos,
                                                 location, target);
                this.svgTooltip.opacity = this.gauge.themeStyle.tooltipFillOpacity || this.svgTooltip.opacity;
                this.svgTooltip.textStyle.fontFamily = (target.id.indexOf('Range') > -1) ?
                this.tooltip.rangeSettings.textStyle.fontFamily || this.gauge.themeStyle.fontFamily : this.tooltip.textStyle.fontFamily || this.gauge.themeStyle.fontFamily;
                this.svgTooltip.appendTo(tooltipEle);
            }
        });
    }
    private tooltipCreate(tooltipEle: HTMLElement): HTMLElement {
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
        return tooltipEle;
    }

    private svgCreate(svgTooltip: Tooltip, args: ITooltipRenderEventArgs, gauge: LinearGauge, areaRect: ClientRect, fill: string,
                      template: string, tooltipPos: string, location: GaugeLocation, target: Element): Tooltip {
        const tooltipBorder : BorderModel = (target.id.indexOf('Range') > -1) ? args.tooltip.rangeSettings.border : args.tooltip.border;
        svgTooltip = new Tooltip({
            enable: true,
            header: '',
            data: { value: args.content },
            template: template,
            content: [args.content],
            shapes: [],
            location: args.location,
            palette: [],
            inverted: !(args.gauge.orientation === 'Horizontal'),
            enableAnimation: args.tooltip.enableAnimation,
            fill: fill || gauge.themeStyle.tooltipFillColor,
            availableSize: gauge.availableSize,
            areaBounds: new Rect(
                (this.gauge.orientation === 'Vertical') ? areaRect.left : location.x,
                (this.gauge.orientation === 'Vertical') ? location.y : (tooltipPos === 'Bottom') ? location.y : areaRect.top,
                tooltipPos === 'Right' ? Math.abs(areaRect.left - location.x) : areaRect.width,
                areaRect.height
            ),
            textStyle: args.tooltip.textStyle,
            border: tooltipBorder,
            theme: args.gauge.theme as TooltipTheme
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((gauge as any).isVue || (gauge as any).isVue3) {
            svgTooltip.controlInstance = gauge;
        }
        return svgTooltip;
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
        const radix: number = 10;
        let lineX: number; let lineY: number;
        const size: Size = new Size(this.gauge.availableSize.width, this.gauge.availableSize.height);
        let x: number; let y: number;
        const lineId: string = this.gauge.element.id + '_AxisLine_' + this.axisIndex;
        const tickID: string = this.gauge.element.id + '_MajorTicksLine_' + this.axisIndex;
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
        const bounds: ClientRect = this.pointerElement.getBoundingClientRect();
        const elementRect: ClientRect = this.gauge.element.getBoundingClientRect();
        x = bounds.left - elementRect.left;
        y = bounds.top - elementRect.top;
        const height: number = bounds.height;
        const width: number = bounds.width;
        const tooltipPosition: TooltipPosition  = (this.pointerElement.id.indexOf('Range') > -1) ? this.tooltip.rangeSettings.position :
            this.tooltip.position;
        if (this.gauge.orientation === 'Vertical') {
            x = (lineX - elementRect.left);
            if (this.pointerElement.id.indexOf('Range') > -1 || this.pointerElement.id.indexOf('BarPointer') > -1) {
                y = (!this.currentAxis.isInversed) ? ((tooltipPosition === 'End') ? y : ((tooltipPosition === 'Start') ?
                    y + height : y + (height / 2))) : ((tooltipPosition === 'End') ? y + height : ((tooltipPosition === 'Start') ?
                    y + height : y + (height / 2)));
            } else {
                y = (this.currentPointer.type === 'Marker') ? y + (height / 2) : (!this.currentAxis.isInversed) ? y : y + height;
            }
        } else {
            y = (lineY - elementRect.top);
            if (this.pointerElement.id.indexOf('Range') > -1 || this.pointerElement.id.indexOf('BarPointer') > -1) {
                x = (!this.currentAxis.isInversed) ? ((tooltipPosition === 'End') ? x + width : ((tooltipPosition === 'Start') ?
                    // eslint-disable-next-line max-len
                    x : x + (width / 2))) : ((tooltipPosition === 'End') ? x : ((tooltipPosition === 'Start') ? x + width : x + (width / 2)));
            } else {
                x = (this.currentPointer.type === 'Marker') ? (x + width / 2) : (!this.currentAxis.isInversed) ? x + width : x;
            }
        }
        const location: GaugeLocation = new GaugeLocation(x, y);
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
     *
     * @return {void}
     * @private
     */
    public destroy(gauge: LinearGauge): void {
        // Destroy method performed here
        this.removeEventListener();
    }
}
