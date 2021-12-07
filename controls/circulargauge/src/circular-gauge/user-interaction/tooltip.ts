/* eslint-disable max-len */
import { CircularGauge } from '../circular-gauge';
import { Axis, Pointer, Range, Annotation } from '../axes/axis';
import { Tooltip } from '@syncfusion/ej2-svg-base';
import { IVisiblePointer, ITooltipRenderEventArgs } from '../model/interface';
import { stringToNumber, getAngleFromValue, getLocationFromAngle, getPointer, getLabelFormat, Size, GaugeLocation, Rect } from '../utils/helper-common';
import { getMousePosition, getElementSize } from '../utils/helper-tooltip';
import { TooltipSettings } from '../model/base';
import { FontModel, BorderModel } from '../model/base-model';
import { Browser, createElement, remove } from '@syncfusion/ej2-base';
import { tooltipRender } from '../model/constants';

/**
 * Sets and gets the module that handles the tooltip of the circular gauge
 */

export class GaugeTooltip {
    private gauge: CircularGauge;
    private tooltipEle: HTMLElement;
    private currentAxis: Axis;
    private tooltip: TooltipSettings;
    private currentPointer: Pointer;
    private currentRange: Range;
    private currentAnnotation: Annotation;
    private borderStyle: BorderModel;
    private textStyle: FontModel;
    private svgTooltip: Tooltip;
    private tooltipId: string;
    private gaugeId: string;
    private tooltipPosition: string;
    private arrowInverted: boolean;
    private tooltipRect: Rect;
    private clearTimeout: number;
    private pointerEle: Element;
    private annotationTargetElement: HTMLElement;
    /**
     * Constructor for Tooltip module.
     *
     * @param {CircularGauge} gauge - Specifies the instance of the gauge.
     * @private.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
    constructor(gauge: CircularGauge) {
        this.gauge = gauge;
        this.tooltipId = this.gauge.element.id + '_CircularGauge_Tooltip';
        this.tooltip = <TooltipSettings>gauge.tooltip;
        this.textStyle = this.tooltip.textStyle;
        this.borderStyle = this.tooltip.border;
        this.addEventListener();
    }

    // eslint-disable-next-line valid-jsdoc
    /**
     * Method to render the tooltip for circular gauge.
     */
    public renderTooltip(e: PointerEvent): void {
        this.gaugeId = this.gauge.element.getAttribute('id');
        let pageX: number; let pageY: number; let target: Element; let touchArg: TouchEvent;
        let location: GaugeLocation; let samePointerEle: boolean = false; let isTooltipRender: boolean = false;
        if (e.type.indexOf('touch') !== - 1) {
            touchArg = <TouchEvent & PointerEvent>e;
            target = <Element>touchArg.target;
            pageX = touchArg.changedTouches[0].pageX;
            pageY = touchArg.changedTouches[0].pageY;
        } else {
            target = <Element>e.target;
            pageX = e.pageX;
            pageY = e.pageY;
        }

        if ((this.tooltip.type.indexOf('Pointer') > -1) && (target.id.indexOf('_Pointer_') >= 0) &&
            (target.id.indexOf(this.gaugeId) >= 0)) {
            if (this.pointerEle !== null) {
                samePointerEle = (this.pointerEle === target);
            }
            isTooltipRender = true;
            const svgRect: ClientRect = this.gauge.svgObject.getBoundingClientRect();
            const elementRect: ClientRect = this.gauge.element.getBoundingClientRect();
            const axisRect: ClientRect = document.getElementById(this.gauge.element.id + '_AxesCollection').getBoundingClientRect();
            const rect: Rect = new Rect(
                Math.abs(elementRect.left - svgRect.left),
                Math.abs(elementRect.top - svgRect.top),
                svgRect.width, svgRect.height
            );
            const currentPointer: IVisiblePointer = getPointer(target.id, this.gauge);
            this.currentAxis = <Axis>this.gauge.axes[currentPointer.axisIndex];
            this.currentPointer = <Pointer>(this.currentAxis.pointers)[currentPointer.pointerIndex];
            const angle: number = getAngleFromValue(
                this.currentPointer.currentValue, this.currentAxis.visibleRange.max, this.currentAxis.visibleRange.min,
                this.currentAxis.startAngle, this.currentAxis.endAngle, this.currentAxis.direction === 'ClockWise'
            ) % 360;
            const tooltipFormat: string = this.gauge.tooltip.format || this.currentAxis.labelStyle.format;
            const customLabelFormat: boolean = tooltipFormat && tooltipFormat.match('{value}') !== null;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const format: any = this.gauge.intl.getNumberFormat({
                format: getLabelFormat(tooltipFormat), useGrouping: this.gauge.useGroupingSeparator
            });
            this.tooltipElement();
            if (this.tooltipEle.childElementCount !== 0 && !this.gauge.enablePointerDrag && !this.gauge.tooltip.showAtMousePosition) {
                return null;
            }
            const roundValue: number = this.roundedValue(this.currentPointer.currentValue);
            const pointerContent: string = customLabelFormat ?
                tooltipFormat.replace(new RegExp('{value}', 'g'), format(roundValue)) :
                format(roundValue);
            location = getLocationFromAngle(angle, this.currentAxis.currentRadius, this.gauge.midPoint);
            location.x = (this.tooltip.template && ((angle >= 150 && angle <= 250) || (angle >= 330 && angle <= 360) ||
                (angle >= 0 && angle <= 45))) ? (location.x + 10) : location.x;
            let tooltipArgs: ITooltipRenderEventArgs = {
                name: tooltipRender, cancel: false, content: pointerContent, location: location, axis: this.currentAxis,
                tooltip: this.tooltip, pointer: this.currentPointer, event: e, gauge: this.gauge, appendInBodyTag: false, type: 'Pointer'
            };
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const pointerTooltip: any = (tooltipArgs: ITooltipRenderEventArgs) => {
                let template: string = tooltipArgs.tooltip.template;
                if (template !== null && template.length === 1) {
                    template = template[template[0]];
                }
                if (!tooltipArgs.tooltip.showAtMousePosition) {
                    if (template) {
                        const elementSize: Size = getElementSize(template, this.gauge, this.tooltipEle);
                        this.tooltipRect = Math.abs(axisRect.left - svgRect.left) > elementSize.width ?
                            this.findPosition(rect, angle, pointerContent, tooltipArgs.location) : rect;
                    } else {
                        this.findPosition(rect, angle, pointerContent, tooltipArgs.location);
                    }
                } else {
                    tooltipArgs.location = getMousePosition(pageX, pageY, this.gauge.svgObject);
                    this.tooltipRect = rect;
                }
                if (!tooltipArgs.cancel && !samePointerEle) {
                    tooltipArgs.tooltip.textStyle.color = tooltipArgs.tooltip.textStyle.color || this.gauge.themeStyle.tooltipFontColor;
                    tooltipArgs.tooltip.textStyle.fontFamily = this.gauge.themeStyle.fontFamily || tooltipArgs.tooltip.textStyle.fontFamily;
                    tooltipArgs.tooltip.textStyle.opacity = this.gauge.themeStyle.tooltipTextOpacity ||
                                                            tooltipArgs.tooltip.textStyle.opacity;
                    this.svgTooltip = this.svgTooltipCreate(this.svgTooltip, tooltipArgs, template, this.arrowInverted, this.tooltipRect,
                                                            this.gauge, tooltipArgs.tooltip.fill, tooltipArgs.tooltip.textStyle,
                                                            tooltipArgs.tooltip.border);
                    this.svgTooltip.opacity = this.gauge.themeStyle.tooltipFillOpacity || this.svgTooltip.opacity;
                    this.svgTooltip.appendTo(this.tooltipEle);
                    if (template && Math.abs(pageY - this.tooltipEle.getBoundingClientRect().top) <= 0) {
                        this.tooltipEle.style.top = (parseFloat(this.tooltipEle.style.top) + 20) + 'px';
                    }
                }
            };
            this.gauge.trigger(tooltipRender, tooltipArgs, pointerTooltip);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (this.gauge as any).renderReactTemplates();
        } else if ((this.tooltip.type.indexOf('Range') > -1) && (target.id.indexOf('_Range_') >= 0) && (!this.gauge.isDrag) &&
                   (target.id.indexOf(this.gaugeId) >= 0)) {
            isTooltipRender = true;
            const rangeSvgRect: ClientRect = this.gauge.svgObject.getBoundingClientRect();
            const rangeElementRect: ClientRect = this.gauge.element.getBoundingClientRect();
            const rangeAxisRect: ClientRect = document.getElementById(this.gauge.element.id + '_AxesCollection').getBoundingClientRect();
            const rect: Rect = new Rect(
                Math.abs(rangeElementRect.left - rangeSvgRect.left),
                Math.abs(rangeElementRect.top - rangeSvgRect.top),
                rangeSvgRect.width, rangeSvgRect.height
            );
            const currentRange: IVisiblePointer = getPointer(target.id, this.gauge);
            this.currentAxis = <Axis>this.gauge.axes[currentRange.axisIndex];
            this.currentRange = <Range>(this.currentAxis.ranges)[currentRange.pointerIndex];
            const rangeAngle: number = getAngleFromValue(
                (this.currentRange.end - Math.abs((this.currentRange.end - this.currentRange.start) / 2 ) ),
                this.currentAxis.visibleRange.max, this.currentAxis.visibleRange.min,
                this.currentAxis.startAngle, this.currentAxis.endAngle, this.currentAxis.direction === 'ClockWise'
            ) % 360;
            const rangeTooltipFormat: string = this.gauge.tooltip.rangeSettings.format || this.currentAxis.labelStyle.format;
            const customLabelFormat: boolean = rangeTooltipFormat && ( rangeTooltipFormat.match('{end}') !== null ||
            rangeTooltipFormat.match('{start}') !== null );
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const rangeFormat: any = this.gauge.intl.getNumberFormat({
                format: getLabelFormat(rangeTooltipFormat), useGrouping: this.gauge.useGroupingSeparator
            });
            this.tooltipElement();
            const roundStartValue: number = this.roundedValue(this.currentRange.start);
            const roundEndValue: number = this.roundedValue(this.currentRange.end);
            const startData: string = (this.currentRange.start).toString();
            const endData: string = (this.currentRange.end).toString();
            const rangeContent: string = customLabelFormat ?
                rangeTooltipFormat.replace(/{start}/g, startData).replace(/{end}/g, endData) :
                'Start : ' + rangeFormat(roundStartValue) + '<br>' + 'End : ' + rangeFormat(roundEndValue);
            location = getLocationFromAngle(
                rangeAngle, this.currentRange.currentRadius, this.gauge.midPoint
            );
            location.x = (this.tooltip.rangeSettings.template && ((rangeAngle >= 150 && rangeAngle <= 250) ||
            (rangeAngle >= 330 && rangeAngle <= 360) ||
                (rangeAngle >= 0 && rangeAngle <= 45))) ? (location.x + 10) : location.x;
            let rangeTooltipArgs: ITooltipRenderEventArgs = {
                name: tooltipRender, cancel: false, content: rangeContent, location: location, axis: this.currentAxis,
                tooltip: this.tooltip, range: this.currentRange, event: e, gauge: this.gauge, appendInBodyTag: false, type: 'Range'
            };
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const rangeTooltip: any = (rangeTooltipArgs: ITooltipRenderEventArgs) => {
                let rangeTemplate: string = rangeTooltipArgs.tooltip.rangeSettings.template;
                if (rangeTemplate !== null && rangeTemplate.length === 1) {
                    rangeTemplate = rangeTemplate[rangeTemplate[0]];
                }
                if (rangeTemplate) {
                    rangeTemplate = rangeTemplate.replace(/[$]{start}/g, startData);
                    rangeTemplate = rangeTemplate.replace(/[$]{end}/g , endData);
                }
                if (!this.tooltip.rangeSettings.showAtMousePosition) {
                    if (rangeTemplate) {
                        const elementSize: Size = getElementSize(rangeTemplate, this.gauge, this.tooltipEle);
                        this.tooltipRect = Math.abs(rangeAxisRect.left - rangeSvgRect.left) > elementSize.width ?
                            this.findPosition(rect, rangeAngle, rangeContent, rangeTooltipArgs.location) : rect;
                    } else {
                        this.findPosition(rect, rangeAngle, rangeContent, rangeTooltipArgs.location);
                    }
                } else {
                    rangeTooltipArgs.location = getMousePosition(pageX, pageY, this.gauge.svgObject);
                    this.tooltipRect = rect;
                }
                if (!rangeTooltipArgs.cancel) {
                    rangeTooltipArgs.tooltip.rangeSettings.textStyle.color = rangeTooltipArgs.tooltip.rangeSettings.textStyle.color ||
                    this.gauge.themeStyle.tooltipFontColor;
                    rangeTooltipArgs.tooltip.rangeSettings.textStyle.fontFamily = this.gauge.themeStyle.fontFamily ||
                    rangeTooltipArgs.tooltip.rangeSettings.textStyle.fontFamily;
                    rangeTooltipArgs.tooltip.rangeSettings.textStyle.opacity = this.gauge.themeStyle.tooltipTextOpacity ||
                    rangeTooltipArgs.tooltip.rangeSettings.textStyle.opacity;
                    this.svgTooltip = this.svgTooltipCreate (this.svgTooltip, rangeTooltipArgs, rangeTemplate, this.arrowInverted,
                                                             this.tooltipRect, this.gauge, rangeTooltipArgs.tooltip.rangeSettings.fill,
                                                             rangeTooltipArgs.tooltip.rangeSettings.textStyle,
                                                             rangeTooltipArgs.tooltip.rangeSettings.border);
                    this.svgTooltip.opacity = this.gauge.themeStyle.tooltipFillOpacity || this.svgTooltip.opacity;
                    this.svgTooltip.appendTo(this.tooltipEle);
                    if (rangeTemplate && Math.abs(pageY - this.tooltipEle.getBoundingClientRect().top) <= 0) {
                        this.tooltipEle.style.top = (parseFloat(this.tooltipEle.style.top) + 20) + 'px';
                    }
                }
            };
            this.gauge.trigger(tooltipRender, rangeTooltipArgs, rangeTooltip);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (this.gauge as any).renderReactTemplates();
        } else if ((this.tooltip.type.indexOf('Annotation') > -1) && this.checkParentAnnotationId(target) && ((!this.gauge.isDrag)) &&
                   (this.annotationTargetElement.id.indexOf(this.gaugeId) >= 0)) {
            isTooltipRender = true;
            const annotationSvgRect: ClientRect = this.gauge.svgObject.getBoundingClientRect();
            const annotationElementRect: ClientRect = this.gauge.element.getBoundingClientRect();
            const annotationAxisRect: ClientRect = document.getElementById(this.gauge.element.id + '_AxesCollection').getBoundingClientRect();
            const rect: Rect = new Rect(
                Math.abs(annotationElementRect.left - annotationSvgRect.left),
                Math.abs(annotationElementRect.top - annotationSvgRect.top),
                annotationSvgRect.width, annotationSvgRect.height
            );
            const currentAnnotation: IVisiblePointer = getPointer(this.annotationTargetElement.id, this.gauge);
            this.currentAxis = <Axis>this.gauge.axes[currentAnnotation.axisIndex];
            this.currentAnnotation = <Annotation>(this.currentAxis.annotations)[currentAnnotation.pointerIndex];
            const annotationAngle: number = (this.currentAnnotation.angle - 90);
            this.tooltipElement();
            document.getElementById(this.gauge.element.id + '_Secondary_Element').appendChild(this.tooltipEle);
            const annotationContent: string = (this.gauge.tooltip.annotationSettings.format !== null) ?
                this.gauge.tooltip.annotationSettings.format : '' ;
            location = getLocationFromAngle(
                annotationAngle, stringToNumber(this.currentAnnotation.radius, this.currentAxis.currentRadius), this.gauge.midPoint
            );
            location.x = (this.tooltip.annotationSettings.template && ((annotationAngle >= 150 && annotationAngle <= 250) ||
            (annotationAngle >= 330 && annotationAngle <= 360) || (annotationAngle >= 0 && annotationAngle <= 45))) ?
                (location.x + 10) : location.x;
            let annotationTooltipArgs: ITooltipRenderEventArgs = {
                name: tooltipRender, cancel: false, content: annotationContent, location: location, axis: this.currentAxis,
                tooltip: this.tooltip, annotation: this.currentAnnotation, event: e, gauge: this.gauge, appendInBodyTag: false,
                type: 'Annotation'
            };
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const annotationTooltip: any = (annotationTooltipArgs: ITooltipRenderEventArgs) => {
                let annotationTemplate: string = annotationTooltipArgs.tooltip.annotationSettings.template;
                if (annotationTemplate !== null && annotationTemplate.length === 1) {
                    annotationTemplate = annotationTemplate[annotationTemplate[0]];
                }
                const elementSizeAn: ClientRect = this.annotationTargetElement.getBoundingClientRect();
                this.tooltipPosition = 'RightTop';
                this.arrowInverted = true;
                annotationTooltipArgs.location.x = annotationTooltipArgs.location.x + (elementSizeAn.width / 2);
                this.tooltipRect = new Rect(rect.x, rect.y, rect.width, rect.height);
                if (!annotationTooltipArgs.cancel && ( this.gauge.tooltip.annotationSettings.format !== null ||
                    this.gauge.tooltip.annotationSettings.template !== null)) {
                    annotationTooltipArgs.tooltip.annotationSettings.textStyle.color = annotationTooltipArgs.tooltip.textStyle.color ||
                    this.gauge.themeStyle.tooltipFontColor;
                    annotationTooltipArgs.tooltip.annotationSettings.textStyle.fontFamily = this.gauge.themeStyle.fontFamily ||
                    annotationTooltipArgs.tooltip.textStyle.fontFamily;
                    annotationTooltipArgs.tooltip.annotationSettings.textStyle.opacity = this.gauge.themeStyle.tooltipTextOpacity ||
                    annotationTooltipArgs.tooltip.textStyle.opacity;
                    this.svgTooltip = this.svgTooltipCreate(this.svgTooltip, annotationTooltipArgs,
                                                            annotationTemplate, this.arrowInverted, this.tooltipRect,
                                                            this.gauge, annotationTooltipArgs.tooltip.annotationSettings.fill,
                                                            annotationTooltipArgs.tooltip.annotationSettings.textStyle,
                                                            annotationTooltipArgs.tooltip.annotationSettings.border);
                    this.svgTooltip.opacity = this.gauge.themeStyle.tooltipFillOpacity || this.svgTooltip.opacity;
                    this.svgTooltip.appendTo(this.tooltipEle);
                    if (annotationTemplate && Math.abs(pageY - this.tooltipEle.getBoundingClientRect().top) <= 0) {
                        this.tooltipEle.style.top = (parseFloat(this.tooltipEle.style.top) + 20) + 'px';
                    }
                }
            };
            this.gauge.trigger(tooltipRender, annotationTooltipArgs, annotationTooltip);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (this.gauge as any).renderReactTemplates();
        } else {
            this.removeTooltip();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (this.gauge as any).clearTemplate();
        }
        if (isTooltipRender && (this.tooltipEle.style.left).indexOf('-') > -1) {
            this.tooltipEle.style.left = 0 + 'px';
        }
    }

    /**
     * Method to create tooltip svg element.
     *
     * @param {Tooltip} svgTooltip - Specifies the tooltip element.
     * @param {ITooltipRenderEventArgs} tooltipArg - Specifies the tooltip arguments.
     * @param {string} template - Specifies the tooltip template.
     * @param {boolean} arrowInverted - Specifies the boolean value.
     * @param {Rect} tooltipRect - Specifies the rect element.
     * @param {CircularGauge} gauge - Specifies the gauge instance.
     * @param {string} fill - Spcifies the fill color of the tooltip.
     * @param {FontModel} textStyle - Spcifies the text style of the tooltip.
     * @param {BorderModel} border - Specifies the border of the tooltip.
     * @returns {Tooltip} - Returns the tooltip.
     */
    private svgTooltipCreate(svgTooltip: Tooltip, tooltipArg: ITooltipRenderEventArgs, template: string, arrowInverted: boolean,
                             tooltipRect: Rect, gauge: CircularGauge, fill: string, textStyle: FontModel, border: BorderModel ): Tooltip {
        svgTooltip = new Tooltip({
            enable: true,
            data: { value: tooltipArg.content },
            template: template,
            enableAnimation: tooltipArg.tooltip.enableAnimation,
            content: [tooltipArg.content],
            location: tooltipArg.location,
            inverted: arrowInverted,
            areaBounds: tooltipRect,
            fill: fill || gauge.themeStyle.tooltipFillColor,
            textStyle: textStyle,
            availableSize: gauge.availableSize,
            border: border
        });
        return svgTooltip;
    }

    /**
     * Method to create or modify tolltip element.
     *
     * @returns {void}
     */
    private tooltipElement(): void {
        if (document.getElementById(this.tooltipId)) {
            this.tooltipEle = document.getElementById(this.tooltipId);
        } else {
            this.tooltipEle = createElement('div', {
                id: this.tooltipId,
                className: 'EJ2-CircularGauge-Tooltip',
                styles: 'position: absolute;pointer-events:none;'
            });
            document.getElementById(this.gauge.element.id + '_Secondary_Element').appendChild(this.tooltipEle);
        }
    }

    /**
     * Method to get parent annotation element.
     *
     * @param {Element} child - Specifies the annotation element.
     * @returns {boolean} - Returns the boolean value.
     */
    private checkParentAnnotationId(child: Element ): boolean {
        this.annotationTargetElement = child.parentElement;
        while ( this.annotationTargetElement != null) {
            if (( this.annotationTargetElement.id.indexOf('_Annotation_') >= 0)) {
                child =  this.annotationTargetElement;
                return true;
            }
            this.annotationTargetElement =  this.annotationTargetElement.parentElement;
        }
        return false;
    }

    /**
     * Method to apply label rounding places.
     *
     * @param {number} currentValue - Specifies the current value.
     * @returns {number} - Returns the round number.
     */
    private roundedValue(currentValue: number): number {
        const roundNumber: number = this.currentAxis.roundingPlaces ?
            parseFloat(currentValue.toFixed(this.currentAxis.roundingPlaces)) :
            currentValue;
        return roundNumber;
    }

    /**
     * Method to find the position of the tooltip anchor for circular gauge.
     *
     * @param {Rect} rect - Specifies the rect element.
     * @param {number} angle - Specifies the angle.
     * @param {string} text - Specifies the text.
     * @param {GaugeLocation} location - Specifies the location.
     * @returns {Rect} - Returns the rect element.
     */
    private findPosition(rect: Rect, angle: number, text: string, location: GaugeLocation): Rect {
        let addLeft: number; let addTop: number; let addHeight: number; let addWidth: number;
        switch (true) {
        case (angle >= 0 && angle < 45):
            this.arrowInverted = true;
            addLeft = (angle >= 15 && angle <= 30) ? location.y : 0;
            this.tooltipRect = new Rect(rect.x, rect.y + addTop, rect.width, rect.height);
            this.tooltipPosition = 'RightBottom';
            break;
        case (angle >= 45 && angle < 90):
            this.arrowInverted = false;
            this.tooltipRect = new Rect(rect.x, rect.y + location.y, rect.width, rect.height);
            this.tooltipPosition = 'BottomRight';
            break;
        case (angle >= 90 && angle < 135):
            this.arrowInverted = false;
            this.tooltipRect = new Rect(rect.x, rect.y + location.y, rect.width, rect.height);
            this.tooltipPosition = 'BottomLeft';
            break;
        case (angle >= 135 && angle < 180):
            this.arrowInverted = true;
            addTop = (angle >= 150 && angle <= 160) ? location.y : 0;
            this.tooltipRect = new Rect(rect.x - rect.width, rect.y + addTop, rect.width, rect.height);
            this.tooltipPosition = 'LeftBottom';
            break;
        case (angle >= 180 && angle < 225):
            this.arrowInverted = true;
            addHeight = (angle >= 200 && angle <= 225) ? Math.abs(rect.y - location.y) : rect.height;
            this.tooltipRect = new Rect(rect.x - rect.width, rect.y, rect.width, addHeight);
            this.tooltipPosition = 'LeftTop';
            break;
        case (angle >= 225 && angle < 270):
            this.arrowInverted = false;
            addWidth = (angle >= 250 && angle <= 290) ? rect.width : Math.abs(rect.x - location.x);
            this.tooltipRect = new Rect(rect.x, rect.y, addWidth, rect.height);
            this.tooltipPosition = 'TopLeft';
            break;
        case (angle >= 270 && angle < 315):
            this.arrowInverted = false;
            addLeft = (angle >= 270 && angle > 290) ? location.x : 0;
            this.tooltipRect = new Rect(rect.x + addLeft, rect.y, rect.width, rect.height);
            this.tooltipPosition = 'TopRight';
            break;
        case (angle >= 315 && angle <= 360):
            this.arrowInverted = true;
            addHeight = (angle >= 315 && angle <= 340) ? Math.abs(rect.y - location.y) : rect.height;
            this.tooltipRect = new Rect(rect.x, rect.y, rect.width, addHeight);
            this.tooltipPosition = 'RightTop';
            break;
        }
        return this.tooltipRect;
    }
    public removeTooltip(): void {
        if (document.getElementsByClassName('EJ2-CircularGauge-Tooltip').length > 0) {
            const tooltip: Element = document.getElementsByClassName('EJ2-CircularGauge-Tooltip')[0];
            if (tooltip) {
                remove(tooltip);
            }
            this.pointerEle = null;
        }
    }

    public mouseUpHandler(e: PointerEvent): void {
        this.renderTooltip(e);
        clearTimeout(this.clearTimeout);
        this.clearTimeout = setTimeout(this.removeTooltip.bind(this), 2000);
    }

    // eslint-disable-next-line valid-jsdoc
    /**
     * To bind events for tooltip module
     */
    public addEventListener(): void {
        if (this.gauge.isDestroyed) {
            return;
        }
        this.gauge.on(Browser.touchMoveEvent, this.renderTooltip, this);
        this.gauge.on(Browser.touchEndEvent, this.mouseUpHandler, this);
        this.gauge.element.addEventListener('contextmenu', this.removeTooltip);
    }

    // eslint-disable-next-line valid-jsdoc
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

    /**
     * Get module name.
     *
     * @returns {string} - Returns the module name
     */
    protected getModuleName(): string {
        // Returns te module name
        return 'Tooltip';
    }
    /**
     * To destroy the tooltip.
     *
     * @param {CircularGauge} gauge - Specifies the instance of the gauge.
     * @returns {void}
     * @private
     */
    public destroy(gauge: CircularGauge): void {
        // Destroy method performed here
        this.removeEventListener();
    }
}
