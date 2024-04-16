/* eslint-disable valid-jsdoc */
import { createElement, Browser, isNullOrUndefined, SanitizeHtmlHelper } from '@syncfusion/ej2-base';
import { LinearGauge } from '../../linear-gauge';
import { Axis, Pointer } from '../axes/axis';
import { TooltipSettings } from '../model/base';
import { IVisiblePointer, ITooltipRenderEventArgs } from '../model/interface';
import { tooltipRender } from '../model/constant';
import { TooltipPosition} from '../utils/enum';
import { FontModel, BorderModel } from '../model/base-model';
import { Tooltip } from '@syncfusion/ej2-svg-base';
import { RangeModel} from '../axes/axis-model';
import { getElement, GaugeLocation, textFormatter, formatValue, Rect, getMousePosition, showTooltip, removeTooltip } from '../utils/helper';
import { getPointer } from '../utils/helper';
import { TooltipTheme } from '@syncfusion/ej2-svg-base/src/tooltip/enum';

/**
 * Represent the tooltip rendering for gauge
 *
 * @hidden
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
     * @param {PointerEvent} e - Specifies the pointer event argument
     * @private
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
            const tooltipStyle: FontModel = {
                size: this.tooltip.textStyle.size,
                color: this.tooltip.textStyle.color,
                fontFamily: this.tooltip.textStyle.fontFamily,
                fontWeight: this.tooltip.textStyle.fontWeight,
                fontStyle: this.tooltip.textStyle.fontStyle,
                opacity: this.tooltip.textStyle.opacity
            };
            tooltipStyle.color = tooltipStyle.color || this.gauge.themeStyle.tooltipFontColor;
            tooltipStyle.size = tooltipStyle.size || this.gauge.themeStyle.tooltipFontSize;
            tooltipStyle.fontFamily = tooltipStyle.fontFamily || this.gauge.themeStyle.fontFamily;
            tooltipStyle.fontWeight = tooltipStyle.fontWeight || this.gauge.themeStyle.labelWeight;
            tooltipStyle.opacity = tooltipStyle.opacity || this.gauge.themeStyle.tooltipTextOpacity;
            tooltipContent = customTooltipFormat ? textFormatter(
                this.tooltip.format, { value: this.currentPointer.currentValue }, this.gauge) :
                formatValue(this.currentPointer.currentValue, this.gauge).toString();
            tooltipEle = this.tooltipCreate(tooltipEle);
            this.tooltipRender(tooltipContent, target, tooltipEle, e, areaRect, pageX, pageY, tooltipStyle);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (this.gauge as any).renderReactTemplates();
        } else if (target.id.indexOf('Range') > -1 && this.gauge.tooltip.type.indexOf('Range') > -1) {
            this.pointerElement = target;
            const areaRect: ClientRect = this.gauge.element.getBoundingClientRect();
            const current: IVisiblePointer = getPointer(<HTMLElement>this.pointerElement, this.gauge);
            this.currentAxis = current.axis;
            this.axisIndex = current.axisIndex;
            const rangePosition: number = Number(target.id.charAt(target.id.length - 1));
            this.currentRange = this.currentAxis.ranges[rangePosition as number];
            const startData: string = (this.currentRange.start).toString();
            const endData: string = (this.currentRange.end).toString();
            const rangeTooltipFormat: string = this.gauge.tooltip.rangeSettings.format || this.currentAxis.labelStyle.format;
            const customTooltipFormat: boolean = rangeTooltipFormat && ( rangeTooltipFormat.match('{end}') !== null ||
            rangeTooltipFormat.match('{start}') !== null );
            const rangeTooltipStyle: FontModel = {
                size: this.tooltip.rangeSettings.textStyle.size,
                color: this.tooltip.rangeSettings.textStyle.color,
                fontFamily: this.tooltip.rangeSettings.textStyle.fontFamily,
                fontWeight: this.tooltip.rangeSettings.textStyle.fontWeight,
                fontStyle: this.tooltip.rangeSettings.textStyle.fontStyle,
                opacity: this.tooltip.rangeSettings.textStyle.opacity
            };
            rangeTooltipStyle.color = rangeTooltipStyle.color || this.gauge.themeStyle.tooltipFontColor;
            rangeTooltipStyle.size = rangeTooltipStyle.size || this.gauge.themeStyle.tooltipFontSize;
            rangeTooltipStyle.fontFamily = rangeTooltipStyle.fontFamily || this.gauge.themeStyle.fontFamily;
            rangeTooltipStyle.fontWeight = rangeTooltipStyle.fontWeight || this.gauge.themeStyle.labelWeight;
            rangeTooltipStyle.opacity = rangeTooltipStyle.opacity || this.gauge.themeStyle.tooltipTextOpacity;
            tooltipContent = customTooltipFormat ? rangeTooltipFormat.replace(/{start}/g, startData).replace(/{end}/g, endData) :
                'Start : ' + startData + '<br>' + 'End : ' + endData;
            tooltipEle = this.tooltipCreate(tooltipEle);
            this.tooltipRender(tooltipContent, target, tooltipEle, e, areaRect, pageX, pageY, rangeTooltipStyle);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (this.gauge as any).renderReactTemplates();
        } else if ((target.id === (this.element.id + '_LinearGaugeTitle')) && ((<HTMLElement>event.target).textContent.indexOf('...') > -1)) {
            showTooltip(this.gauge.title, this.gauge);
        } else {
            removeTooltip();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (this.gauge as any).clearTemplate();
        }
    }

    private tooltipRender(tooltipContent: string, target: Element, tooltipEle: HTMLElement, e: PointerEvent, areaRect: ClientRect,
                          pageX: number, pageY : number, tooltipStyle: FontModel): void {
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
        this.gauge.trigger(tooltipRender, args, () => {
            let template: string | Function = (target.id.indexOf('Range') > -1) ? args.tooltip.rangeSettings.template : args.tooltip.template;
            if (template !== null && Object.keys(template as any).length === 1 && typeof template !== 'function') {
                template = template[Object.keys(template as any)[0]];
            }
            if (!args.cancel) {
                const fillColor: string = (target.id.indexOf('Range') > -1) ? this.tooltip.rangeSettings.fill : this.tooltip.fill;
                this.svgTooltip = this.svgCreate(this.svgTooltip, args, this.gauge, areaRect, fillColor, template, tooltipPos,
                                                 location, target, tooltipStyle);
                this.svgTooltip.opacity = this.gauge.themeStyle.tooltipFillOpacity || this.svgTooltip.opacity;
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
                className: 'EJ2-LinearGauge-Tooltip'
            });
            tooltipEle.style.cssText = 'position: absolute;pointer-events:none;z-index: 3;';
            document.getElementById(this.gauge.element.id + '_Secondary_Element').appendChild(tooltipEle);
        }
        return tooltipEle;
    }
    // eslint-disable-next-line max-len
    private svgCreate(svgTooltip: Tooltip, args: ITooltipRenderEventArgs, gauge: LinearGauge, areaRect: ClientRect, fill: string, template: string | Function, tooltipPos: string, location: GaugeLocation, target: Element, textStyle: FontModel): Tooltip {
        const tooltipBorder : BorderModel = (target.id.indexOf('Range') > -1) ? args.tooltip.rangeSettings.border : args.tooltip.border;
        textStyle = {
            color: args.tooltip.textStyle.color || textStyle.color,
            fontFamily: args.tooltip.textStyle.fontFamily || textStyle.fontFamily,
            fontStyle: args.tooltip.textStyle.fontStyle || textStyle.fontStyle,
            fontWeight: args.tooltip.textStyle.fontWeight || textStyle.fontWeight,
            opacity: args.tooltip.textStyle.opacity || textStyle.opacity,
            size: args.tooltip.textStyle.size || textStyle.size
        };
        svgTooltip = new Tooltip({
            enable: true,
            header: '',
            data: { value: args.content },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            template: template as any,
            content: [SanitizeHtmlHelper.sanitize(args.content)],
            shapes: [],
            location: args.location,
            palette: [],
            inverted: !(args.gauge.orientation === 'Horizontal'),
            enableAnimation: args.tooltip.enableAnimation,
            fill: fill || gauge.themeStyle.tooltipFillColor,
            availableSize: gauge.availableSize,
            areaBounds: new Rect(
                (this.gauge.orientation === 'Vertical') ? location.x : areaRect.left,
                (this.gauge.orientation === 'Vertical') ? areaRect.top : (tooltipPos === 'Bottom') ? areaRect.top : location.y,
                tooltipPos === 'Right' ? Math.abs(areaRect.left - location.x) : areaRect.width,
                areaRect.height
            ),
            textStyle: textStyle,
            border: tooltipBorder,
            theme: args.gauge.theme as TooltipTheme,
            enableShadow: true
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
        let lineX: number; let lineY: number;
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
                    x : x + (width / 2))) : ((tooltipPosition === 'End') ? x : ((tooltipPosition === 'Start') ? x + width : x + (width / 2)));
            } else {
                x = (this.currentPointer.type === 'Marker') ? (x + width / 2) : (!this.currentAxis.isInversed) ? x + width : x;
            }
        }
        const location: GaugeLocation = new GaugeLocation(x, y);
        return location;
    }

    public mouseUpHandler(e: PointerEvent): void {
        removeTooltip();
        this.renderTooltip(e);
        clearTimeout(this.clearTimeout);
        this.clearTimeout = setTimeout(removeTooltip.bind(this), 2000);
    }

    /**
     * To bind events for tooltip module
     *
     * @private
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
     *
     * @private
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
     *
     * @return {void}
     * @private
     */
    public destroy(): void {
        this.element = null;
        this.currentAxis = null;
        this.currentPointer = null;
        this.currentRange = null;
        if (!isNullOrUndefined(this.svgTooltip)) {
            this.svgTooltip.destroy();
        }
        this.svgTooltip = null;
        this.textStyle  = null;
        this.borderStyle = null;
        this.pointerElement = null;
        this.tooltip = null;
        this.removeEventListener();
        this.gauge = null;
    }
}
