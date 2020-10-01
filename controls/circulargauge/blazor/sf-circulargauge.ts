import { BlazorDotnetObject, isNullOrUndefined, EventHandler } from '@syncfusion/ej2-base';
import { Animation, Browser } from '@syncfusion/ej2-base';
import { AnimationOptions } from '@syncfusion/ej2-base';

class SfCircularGauge {
    public id: string;
    public element: BlazorCircularGaugeElement;
    public dotNetRef: BlazorDotnetObject;
    public options: ICircularGaugeOptions;
    public individualId: string;
    private isMouseDown: boolean;
    private isRangeDrag: boolean;
    private isPointerDrag: boolean;
    private dragAxisIndex: number;
    private dragElementIndex: number;
    // tslint:disable-next-line:max-line-length
    constructor(id: string, element: BlazorCircularGaugeElement, options: ICircularGaugeOptions, dotnetRef: BlazorDotnetObject, individualId: string) {
        this.id = id;
        this.element = element;
        this.dotNetRef = dotnetRef;
        this.options = options;
        this.element.blazor__instance = this;
        this.individualId = individualId;
    }
    public render(): void {
        this.wireEvents();
    }
    private wireEvents(): void {
        /*! Bind the Event handler */
        EventHandler.add(this.element, Browser.touchStartEvent, this.gaugeOnMouseDown, this);
        EventHandler.add(this.element, Browser.touchMoveEvent, this.gaugeOnMouseMove, this);
        EventHandler.add(this.element, Browser.touchEndEvent, this.gaugeOnMouseEnd, this);
        EventHandler.add(this.element, Browser.touchCancelEvent, this.gaugeOnMouseEnd, this);
        EventHandler.add(this.element, 'click', this.gaugeOnMouseClick, this);
        window.addEventListener(
            (Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize',
            this.gaugeOnResize.bind(this)
        );
    }
    private gaugeOnMouseClick(e: PointerEvent): void {
        let legendItemsId: string[] = ['_Text_', '_Shape_'];
        let targetId: string = (e.target as HTMLElement).id;
        if (targetId.indexOf('Legend') !== -1 && this.options.legendToggleVisibility) {
            for (let i: number = 0; i < legendItemsId.length; i++) {
                let id: string = legendItemsId[i];
                if (targetId.indexOf(id) !== -1) {
                    // tslint:disable-next-line:radix
                    let axisIndex: number = parseInt(targetId.split(this.element.id + '_Legend_Axis_')[1].split(id)[0]);
                    // tslint:disable-next-line:radix
                    let rangeIndex: number = parseInt(targetId.split(this.element.id + '_Legend_Axis_')[1].split(id)[1]);
                    this.dotNetRef.invokeMethodAsync('TriggerLegendClick', e, axisIndex, rangeIndex);
                }
            }
        }
    }
    private gaugeOnResize(): void {
        let elementBounds: HTMLElement = document.getElementById(this.element.id);
        if (elementBounds) {
            elementBounds = elementBounds.parentElement;
            let width: number = elementBounds.clientWidth || elementBounds.offsetWidth;
            let height: number = elementBounds.clientHeight || elementBounds.offsetHeight;
            this.dotNetRef.invokeMethodAsync('TriggerResizeEvent', event, width, height);
        }
    }
    private gaugeOnMouseDown(e: PointerEvent): void {
        let pageText: Element = document.getElementById(this.element.id + '_legend_pagenumber');
        let targetId: string = (e.target as HTMLElement).id;
        if (!isNullOrUndefined(pageText)) {
            let page: number = parseInt(pageText.textContent.split('/')[0], 10);
            if (targetId.indexOf(this.element.id + '_legend_pageup') > -1) {
                this.dotNetRef.invokeMethodAsync('TriggerLegendPageClick', (page - 2), (page - 1));
            } else if (targetId.indexOf(this.element.id + '_legend_pagedown') > -1) {
                this.dotNetRef.invokeMethodAsync('TriggerLegendPageClick', (page), (page + 1));
            }
        }
        // tslint:disable-next-line:max-line-length
        if ((this.options.enablePointerDrag || this.options.enableRangeDrag) && ((event.target as HTMLElement).id.indexOf('Pointer') !== -1 || (event.target as HTMLElement).id.indexOf('_Range_') !== -1)) {
            this.isMouseDown = true;
            let tempString: string = targetId.replace(this.element.id, '').split('_Axis_')[1];
            this.dragAxisIndex = +tempString[0];
            this.dragElementIndex = +tempString[tempString.length - 1];
            if ((event.target as HTMLElement).id.indexOf('Pointer') !== -1) {
                this.isPointerDrag = true;
                this.dotNetRef.invokeMethodAsync('TriggerDragStart', this.dragAxisIndex, this.dragElementIndex, 0, 'Pointer');
            } else {
                this.isRangeDrag = true;
                this.dotNetRef.invokeMethodAsync('TriggerDragStart', this.dragAxisIndex, 0, this.dragElementIndex, 'Range');
            }
        }
    }
    private gaugeOnMouseMove(e: PointerEvent): void {
        let tempString: string; let axisIndex: number; let pointerIndex: number;
        let isRange: boolean; let isPointer: boolean; let isAnnotation: boolean;
        let targetElementId: string = (e.target as HTMLElement).id;
        if (targetElementId.indexOf('Legend') !== -1) {
            let legendElement: Element = document.getElementById(targetElementId);
            if (this.options.legendToggleVisibility) {
                legendElement.setAttribute('cursor', 'pointer');
            } else {
                legendElement.setAttribute('cursor', 'auto');
            }
        }
        let svgElement: HTMLElement = document.getElementById(this.element.id + '_svg');
        let svgRect: ClientRect = svgElement.getBoundingClientRect();
        let axisRect: ClientRect = document.getElementById(this.element.id + '_AxesCollection').getBoundingClientRect();
        // tslint:disable-next-line
        let rect: any = this.element.getBoundingClientRect();
        let mouseY: number = (e.clientY - rect.top) - Math.max(svgRect.top - rect.top, 0);
        let mouseX: number = (e.clientX - rect.left) - Math.max(svgRect.left - rect.left, 0);
        let tooltipGroup: Element = document.getElementById(this.element.id + '_Tooltip');
        let tooltipGroupElement: Element = document.getElementById(this.element.id + '_Tooltip_Group');
        let parentTargetId: string = (e.target as HTMLElement).parentElement.id;
        if (this.options.enableTooltip) {
            rect = {
                // tslint:disable-next-line:max-line-length
                left: Math.abs(rect.left - svgRect.left), top: Math.abs(rect.top - svgRect.top), width: svgRect.width, height: svgRect.height,
                x: Math.abs(rect.left - svgRect.left), y: Math.abs(rect.top - svgRect.top), bottom: 0, right: 0
            };
            if ((targetElementId.indexOf('Annotation') !== -1 || parentTargetId.indexOf('Annotation') !== -1)
                && !isNullOrUndefined(this.options.tooltipType) && this.options.tooltipType.indexOf('Annotation') !== -1) {
                let index: string;
                if (parentTargetId.indexOf('ContentTemplate') !== -1) {
                    let annotIndexString: string = parentTargetId.split('_ContentTemplate')[0];
                    index = annotIndexString[annotIndexString.length - 1];
                }
                // tslint:disable-next-line:max-line-length
                let annotationTemplateElement: Element = document.getElementById(parentTargetId);
                tempString = annotationTemplateElement.id.replace(this.element.id, '').split('_Axis_')[1];
                axisIndex = +tempString[0];
                pointerIndex = +(parentTargetId.indexOf('ContentTemplate') === -1 ? tempString[tempString.length - 1] : index);
                pointerIndex = isNaN(pointerIndex) ? 0 : pointerIndex;
                isRange = false; isPointer = false; isAnnotation = true;
                let annotationidElement: Element;
                if (tooltipGroupElement !== null) {
                    (tooltipGroup as HTMLElement).style.visibility = 'visible';
                    if (tooltipGroup.lastElementChild !== null) {
                        let annotationIndexId: string = this.element.id + '_Tooltip_Annotation_' + pointerIndex + '_Content';
                        annotationidElement = document.getElementById(annotationIndexId);
                        let elementExist: NodeListOf<Element> = document.querySelectorAll('#' + annotationIndexId);
                        if (elementExist.length !== 0) {
                            (annotationidElement as HTMLElement).style.visibility = 'visible';
                        }
                    }
                }
                let annotElementWidth: number = annotationTemplateElement.getBoundingClientRect().width;
                // tslint:disable-next-line:max-line-length
                this.dotNetRef.invokeMethodAsync('TriggerTooltipEvent', event, e.pageX + (annotElementWidth / 2), e.pageY, axisIndex, pointerIndex, isRange, isPointer, isAnnotation, rect, svgRect, axisRect);
            } else {
                if (tooltipGroup !== null) {
                    (tooltipGroup as HTMLElement).style.visibility = 'hidden';
                }
            }
        }
        this.performDragOperation(targetElementId, axisIndex, pointerIndex, mouseX, mouseY, event);
        if (this.options.enableTooltip) {
            // tslint:disable-next-line:max-line-length
            if (targetElementId.indexOf('_Range_') !== -1 && !isNullOrUndefined(this.options.tooltipType) && this.options.tooltipType.indexOf('Range') !== -1 && !this.isMouseDown) {
                tempString = targetElementId.replace(this.element.id, '').split('_Axis_')[1];
                axisIndex = +tempString[0];
                pointerIndex = +tempString[tempString.length - 1];
                isRange = true; isPointer = false; isAnnotation = false;
                let tooltipX: number = 0;
                let tooltipY: number = 0;
                if (this.options.showRangeTooltipAtMousePosition) {
                    // tslint:disable-next-line
                    let mousePosition: any = this.getMousePosition(e.pageX, e.pageY, svgElement);
                    tooltipX = mousePosition.x;
                    tooltipY = mousePosition.y;
                } else {
                    tooltipX = e.pageX;
                    tooltipY = e.pageY;
                }
                if (tooltipGroup !== null) {
                    (tooltipGroup as HTMLElement).style.visibility = 'visible';
                }
                // tslint:disable-next-line:max-line-length
                this.dotNetRef.invokeMethodAsync('TriggerTooltipEvent', event, tooltipX, tooltipY, axisIndex, pointerIndex, isRange, isPointer, isAnnotation, rect, svgRect, axisRect);
            }
            // tslint:disable-next-line:max-line-length
            if ((targetElementId.indexOf('Pointer') !== -1 || targetElementId.indexOf('_Range_') !== -1 || targetElementId.indexOf('Annotation') !== -1 ||
                (parentTargetId.indexOf('Annotation') !== -1 && targetElementId.indexOf('Annotation') === -1))) {
                // tslint:disable-next-line:max-line-length
                if (targetElementId.indexOf('Pointer') !== -1 && (isNullOrUndefined(this.options.tooltipType) || this.options.tooltipType.indexOf('Pointer') !== -1)) {
                    tempString = targetElementId.replace(this.element.id, '').split('_Axis_')[1];
                    axisIndex = +tempString[0];
                    pointerIndex = +tempString[tempString.length - 1];
                    isRange = false; isPointer = true; isAnnotation = false;
                    let tooltipX: number = 0;
                    let tooltipY: number = 0;
                    if (this.options.showPointerTooltipAtMousePosition) {
                        // tslint:disable-next-line
                        let mousePosition: any = this.getMousePosition(e.pageX, e.pageY, svgElement);
                        tooltipX = mousePosition.x;
                        tooltipY = mousePosition.y;
                    } else {
                        tooltipX = e.pageX;
                        tooltipY = e.pageY;
                    }
                    if (tooltipGroup !== null) {
                        (tooltipGroup as HTMLElement).style.visibility = 'visible';
                    }
                    // tslint:disable-next-line:max-line-length
                    this.dotNetRef.invokeMethodAsync('TriggerTooltipEvent', event, tooltipX, tooltipY, axisIndex, pointerIndex, isRange, isPointer, isAnnotation, rect, svgRect, axisRect);
                }
            } else {
                if ((tooltipGroup !== null || tooltipGroupElement && tooltipGroupElement.childElementCount > 0) && !this.isPointerDrag) {
                    (tooltipGroup as HTMLElement).style.visibility = 'hidden';
                }
            }
        }
    }

    // tslint:disable-next-line:max-line-length
    private performDragOperation(targetElementId: string, axisIndex: number, pointerIndex: number, mouseX: number, mouseY: number, event: Event): void {
        if ((this.options.enablePointerDrag && targetElementId.indexOf('Pointer') !== -1) || (this.options.enableRangeDrag &&
            targetElementId.indexOf('_Range_') !== -1) || this.isMouseDown) {
            if (this.isMouseDown) {
                event.preventDefault();
                if (axisIndex !== null && pointerIndex !== null && this.isMouseDown) {
                    if (this.isRangeDrag && this.options.enableRangeDrag) {
                        document.getElementById(this.element.id + '_svg').setAttribute('cursor', 'grabbing');
                        // tslint:disable-next-line:max-line-length
                        this.dotNetRef.invokeMethodAsync('TriggerRangeDragEvent', mouseX, mouseY, this.dragAxisIndex, this.dragElementIndex);
                    } else if (this.isPointerDrag && this.options.enablePointerDrag) {
                        document.getElementById(this.element.id + '_svg').setAttribute('cursor', 'grabbing');
                        // tslint:disable-next-line:max-line-length
                        this.dotNetRef.invokeMethodAsync('TriggerDragEvent', mouseX, mouseY, this.dragAxisIndex, this.dragElementIndex);
                    }
                }
            } else {
                document.getElementById(this.element.id + '_svg').setAttribute('cursor', 'pointer');
            }
        } else {
            document.getElementById(this.element.id + '_svg').setAttribute('cursor', 'auto');
        }
    }

    private gaugeOnMouseEnd(e: PointerEvent): void {
        if (this.isPointerDrag) {
            this.dotNetRef.invokeMethodAsync('TriggerDragEnd', this.dragAxisIndex, this.dragElementIndex, 0, 'Pointer');
        } else if (this.isRangeDrag) {
            this.dotNetRef.invokeMethodAsync('TriggerDragEnd', this.dragAxisIndex, 0, this.dragElementIndex, 'Range');
        }
        this.isMouseDown = false;
        this.isPointerDrag = false;
        this.isRangeDrag = false;
    }

    // tslint:disable-next-line:max-line-length
    private animationRangeProcess(animatedChildElements: Element, options: IRangeAnimationOptions, dotNetRef: BlazorDotnetObject, axisIndex: number, pointerIndex: number): void {
        let sweepAngle: number;
        new Animation({}).animate(<HTMLElement>animatedChildElements, {
            duration: options.duration,
            progress: (args: AnimationOptions): void => {
                sweepAngle = (options.start < options.end || Math.round(options.startAngle) === Math.round(options.endAngle)) ?
                    options.isClockWise ? (options.endAngle - options.startAngle) : (options.endAngle - options.startAngle - 360) :
                    options.isClockWise ? (options.endAngle - options.startAngle - 360) : (options.endAngle - options.startAngle);
                (animatedChildElements as HTMLElement).style.animation = 'None';
                let rangeLinear: number; let roundedActualEnd: number; let roundedOldEnd: number;
                if (options.roundRadius <= 0) {
                    // tslint:disable-next-line:max-line-length
                    rangeLinear = -sweepAngle * Math.cos(args.timeStamp / options.duration * (Math.PI / 2)) + sweepAngle + options.startAngle;
                }
                if (options.isClockWise) {
                    if (options.roundRadius > 0) {
                        // tslint:disable-next-line:max-line-length
                        roundedActualEnd = -sweepAngle * Math.cos(args.timeStamp / options.duration * (Math.PI / 2)) + sweepAngle + Math.floor(options.minimumAngle);
                        roundedOldEnd = -sweepAngle * Math.cos(args.timeStamp / options.duration * (Math.PI / 2)) + sweepAngle + Math.floor(options.minimumAngle + (options.roundRadius / 2));
                        // tslint:disable-next-line:max-line-length
                        dotNetRef.invokeMethodAsync('AnimateRoundedRangeBar', options.midPointX, options.midPointY, Math.floor(options.minimumAngle), roundedActualEnd + 0.0001, options.oldStart, roundedOldEnd + 0.0001, options.radius, options.pointerWidth, pointerIndex, axisIndex);
                    } else {
                        // tslint:disable-next-line:max-line-length
                        dotNetRef.invokeMethodAsync('AnimateRangeBar', options.midPointX, options.midPointY, rangeLinear, options.radius, options.innerRadius, options.minimumAngle, axisIndex, pointerIndex);
                    }
                } else {
                    if (options.roundRadius > 0) {
                        // tslint:disable-next-line:max-line-length
                        roundedActualEnd = -sweepAngle * Math.cos(args.timeStamp / options.duration * (Math.PI / 2)) + sweepAngle + Math.floor(options.oldStart);
                        roundedOldEnd = -sweepAngle * Math.cos(args.timeStamp / options.duration * (Math.PI / 2)) + sweepAngle + Math.floor(options.minimumAngle - options.roundRadius - (options.roundRadius / 2));
                        // tslint:disable-next-line:max-line-length
                        dotNetRef.invokeMethodAsync('AnimateRoundedRangeBar', options.midPointX, options.midPointY, roundedActualEnd, Math.floor(options.oldStart) + 0.0001, roundedOldEnd, Math.floor(options.oldStart + (options.roundRadius / 2)), options.radius, options.pointerWidth, pointerIndex, axisIndex);
                    } else {
                        // tslint:disable-next-line:max-line-length
                        dotNetRef.invokeMethodAsync('AnimateRangeBar', options.midPointX, options.midPointY, options.minimumAngle, options.radius, options.innerRadius, rangeLinear, axisIndex, pointerIndex);
                    }
                }
            },
            end: (args: AnimationOptions): void => {
                dotNetRef.invokeMethodAsync('AnimatePointer', axisIndex, pointerIndex, options.end);
            }
        });
    }
    // tslint:disable-next-line:max-line-length
    private animationProcess(animatedChildElements: Element, options: IPointerAnimationOptions, dotNetRef: BlazorDotnetObject, axisIndex: number, pointerIndex: number): void {
        let sweepAngle: number;
        // tslint:disable-next-line
        new Animation({}).animate(
            <HTMLElement>animatedChildElements,
            {
                duration: options.duration,
                progress: (args: AnimationOptions): void => {
                    sweepAngle = (options.start < options.end || Math.round(options.startAngle) === Math.round(options.endAngle)) ?
                        options.isClockWise ? (options.endAngle - options.startAngle) : (options.endAngle - options.startAngle - 360) :
                        options.isClockWise ? (options.endAngle - options.startAngle - 360) : (options.endAngle - options.startAngle);
                    (animatedChildElements as HTMLElement).style.animation = 'None';
                    // tslint:disable-next-line:max-line-length
                    animatedChildElements.setAttribute('transform', 'rotate(' + (-sweepAngle * Math.cos(args.timeStamp / args.duration * (Math.PI / 2))
                        + sweepAngle + options.startAngle) + ',' + options.midPointX + ',' + options.midPointY + ')');
                },
                end: (model: AnimationOptions): void => {
                    dotNetRef.invokeMethodAsync('AnimatePointer', axisIndex, pointerIndex, options.end);
                }
            });
    }

    // tslint:disable-next-line
    public pointerAnimation(id: string, options: any, dotNetRef: BlazorDotnetObject): void {
        let axisIndex: number; let pointerIndex: number;
        let animationElement: Element = document.getElementById(id);
        let tempString: string = animationElement.id.replace(this.element.id, '').split('_Axis_')[1];
        axisIndex = +tempString[0];
        pointerIndex = +tempString[tempString.length - 1];
        for (let j: number = 0; j < animationElement.childElementCount; j++) {
            let animatedChildElements: Element = animationElement.children[j];
            if (options.pointerType === 'RangeBar') {
                this.animationRangeProcess(animatedChildElements, options, dotNetRef, axisIndex, pointerIndex);
            } else {
                this.animationProcess(animatedChildElements, options, dotNetRef, axisIndex, pointerIndex);
            }
        }
    }

    // tslint:disable-next-line
    private getMousePosition(pageX: number, pageY: number, element: HTMLElement): any {
        let elementRect: ClientRect = element.getBoundingClientRect();
        let pageXOffset: number = element.ownerDocument.defaultView.pageXOffset;
        let pageYOffset: number = element.ownerDocument.defaultView.pageYOffset;
        let clientTop: number = element.ownerDocument.documentElement.clientTop;
        let clientLeft: number = element.ownerDocument.documentElement.clientLeft;
        let positionX: number = elementRect.left + pageXOffset - clientLeft;
        let positionY: number = elementRect.top + pageYOffset - clientTop;
        return { x: (pageX - positionX), y: (pageY - positionY)};
    }
}

interface ICircularGaugeOptions {
    width: string;
    height: string;
    enableRangeDrag: boolean;
    enablePointerDrag: boolean;
    enableTooltip: boolean;
    tooltipType: string[];
    legendToggleVisibility: boolean;
    showRangeTooltipAtMousePosition: boolean;
    showPointerTooltipAtMousePosition: boolean;
}

interface IRangeAnimationOptions {
    start: number;
    duration: number;
    end: number;
    startAngle: number;
    endAngle: number;
    midPointX: number;
    midPointY: number;
    isClockWise: boolean;
    radius: number;
    innerRadius: number;
    minimumAngle: number;
    oldStart: number;
    pointerWidth: number;
    roundRadius: number;
    pointerType: string;
}

interface IPointerAnimationOptions {
    start: number;
    duration: number;
    end: number;
    startAngle: number;
    endAngle: number;
    midPointX: number;
    midPointY: number;
    isClockWise: boolean;
    radius: number;
    innerRadius: number;
    pointerType: string;
}

interface BlazorCircularGaugeElement extends HTMLElement {
    blazor__instance: SfCircularGauge;
}

// tslint:disable
let CircularGauge: object = {
    initialize(element: BlazorCircularGaugeElement, options: ICircularGaugeOptions, dotnetRef: BlazorDotnetObject, individualId: string): void {
        let instance: SfCircularGauge = new SfCircularGauge(element.id, element, options, dotnetRef, individualId);
        instance.render();
        this.getContainerSize(element.id, dotnetRef);
    },
    getContainerSize(id: string, dotnetRef: BlazorDotnetObject): void {
        let elementBounds: Element = document.getElementById(id);
        let width: number = elementBounds.clientWidth;
        let height: number = elementBounds.clientHeight;
        dotnetRef.invokeMethodAsync('GetContainerSize', width, height);
    },
    // tslint:disable-next-line
    animationProcess(element: BlazorCircularGaugeElement, options: any, dotNetRef: BlazorDotnetObject, individualid: string): void {
        if (!isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.pointerAnimation(individualid, options, dotNetRef);
        }
    },
    setPointerDragStatus(element: BlazorCircularGaugeElement, enable: boolean): void {
        if (!isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.options.enablePointerDrag = enable;
        }
    },
    setRangeDragStatus(element: BlazorCircularGaugeElement, enable: boolean): void {
        if (!isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.options.enableRangeDrag = enable;
        }
    },
    setLegendToggle(element: BlazorCircularGaugeElement, enable: boolean): void {
        if (!isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.options.legendToggleVisibility = enable;
        }
    },
    getElementBounds(id: string): object {
        let htmlElement: Element = document.getElementById(id);
        if (htmlElement) {
            let bounds: ClientRect = htmlElement.getBoundingClientRect();
            return {
                width: bounds.width, height: bounds.height, top: bounds.top, bottom: bounds.bottom,
                left: bounds.left, right: bounds.right
            };
        } else {
            return null;
        }
    }
};
export default CircularGauge;