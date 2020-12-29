import { EventHandler, BlazorDotnetObject, isNullOrUndefined } from '@syncfusion/ej2-base';
import { formatUnit, setStyleAttribute } from '@syncfusion/ej2-base';
type SliderHandleNumber = 1 | 2;
const SLIDERTRACK: string = 'e-slider-track';
const SLIDERINPUT: string = 'e-slider-input';
const HANDLEFOCUSED: string = 'e-handle-focused';
const HANDLEACTIVE: string = 'e-handle-active';
const SLIDERTABHANDLE: string = 'e-tab-handle';
const HORIZONTAL: string = 'Horizontal';
const RANGE: string = 'e-range';
const DEFAULTSLIDER: string = 'Default';
const MINRANGESLIDER: string = 'MinRange';
const RANGESLIDER: string = 'Range';
const TICK: string = 'e-tick';
const LARGE: string = 'e-large';
const TICKVALUE: string = 'e-tick-value';
const FIRSTBUTTON: string = 'e-first-button';
const SECONDBUTTON: string = 'e-second-button';
const SLIDERLASTTICK: string = 'e-last-tick';
const VISIBILITY: string = 'visibility';
class SfSlider {
    // tslint:disable-next-line:no-any
    private element: any;
    // tslint:disable-next-line:no-any
    private options: any;
    private dotNetRef: BlazorDotnetObject;
    private sliderContainer: HTMLElement;
    private sliderTrack: HTMLElement;
    private hiddenInput: HTMLElement;
    private firstHandle: HTMLElement;
    private secondHandle: HTMLElement;
    private materialHandle: HTMLElement;
    private rangeBar: HTMLElement;
    private handlePos1: number;
    private handlePos2: number;
    private handleVal1: number;
    private handleVal2: number;
    private handlePos: number;
    private handleVal: number;
    private previousHandleVal: number | number[];
    // tslint:disable-next-line:no-any
    private limitBar1: any;
    // tslint:disable-next-line:no-any
    private limitBar2: any;
    private posvalue: number;
    private activeHandle: number = 1;
    private firstChild: HTMLElement;
    private changedEventValue: number | number[];
    private initialRendering: boolean = true;
    private isClicked: boolean = false;
    private isSliderMove: boolean = false;
    private isDragRange: boolean = false;
    private firstPartRemain: number;
    private secondPartRemain: number;
    private minDiff: number;
    private isMaterial: boolean;
    private onResize: EventListener;
    private transition: { [key: string]: string } = {
        handle: 'left .4s cubic-bezier(.25, .8, .25, 1), right .4s cubic-bezier(.25, .8, .25, 1), ' +
            'top .4s cubic-bezier(.25, .8, .25, 1) , bottom .4s cubic-bezier(.25, .8, .25, 1)',
        rangeBar: 'all .4s cubic-bezier(.25, .8, .25, 1)',
        scaleTransform: 'transform .4s cubic-bezier(.25, .8, .25, 1)'
    };
    // tslint:disable-next-line:no-any
    constructor(element: any, dotnetRef: BlazorDotnetObject, props: any) {
        this.element = element;
        this.element.blazor__instance = this;
        this.dotNetRef = dotnetRef;
        this.options = props;
        this.initialRendering = true;
        if (this.options.Value === null) {
            this.options.Value = this.options.Type !== RANGESLIDER ?
                this.options.Min : [this.options.Min, this.options.Max];
        }
        if (this.options.CustomValues) {
            this.options.Min = 0;
            this.options.Max = props.CustomValues.length - 1;
        }
    }
    public initialize(): string {
        this.sliderContainer = this.element.parentElement;
        this.sliderTrack = this.element.querySelector('.' + SLIDERTRACK);
        this.hiddenInput = this.element.parentElement.querySelector('.' + SLIDERINPUT);
        this.setElementWidth(this.options.Width);
        this.setHandler();
        this.setZindex();
        if (!isNullOrUndefined(this.options.Limits)) {
            this.setLimitBarPosition();
        }
        this.isMaterial = this.getTheme(this.sliderContainer) === 'material';
        if (isNullOrUndefined(this.materialHandle) && this.isMaterial && this.options.Tooltip !== null &&
            this.options.Type !== RANGESLIDER) {
            this.materialHandle = document.createElement('div');
            this.materialHandle.className = 'e-handle e-material-handle';
            this.element.appendChild(this.materialHandle);
        }
        this.setValue(false);
        this.updateColorRangeBarPos();
        if (this.initialRendering && this.options.Enabled && !this.options.ReadOnly) {
            this.wireEvents();
        }
        return this.getTheme(this.sliderContainer);
    }
    private rangeBarMousedown(event: MouseEvent & TouchEvent): void {
        event.preventDefault();
        this.changedEventValue = this.options.Value;
        if (this.options.Type === 'Range' && event.target === this.rangeBar) {
            let xPostion: number; let yPostion: number;
            if (event.type === 'mousedown') {
                [xPostion, yPostion] = [event.clientX, event.clientY];
            } else if (event.type === 'touchstart') {
                [xPostion, yPostion] = [event.changedTouches[0].clientX, event.changedTouches[0].clientY];
            }
            if (this.options.Orientation === 'Horizontal') {
                this.firstPartRemain = xPostion - this.rangeBar.getBoundingClientRect().left;
                this.secondPartRemain = this.rangeBar.getBoundingClientRect().right - xPostion;
            } else {
                this.firstPartRemain = yPostion - this.rangeBar.getBoundingClientRect().top;
                this.secondPartRemain = this.rangeBar.getBoundingClientRect().bottom - yPostion;
            }
            this.minDiff = this.handleVal2 - this.handleVal1;

            let focusedElement: Element = this.element.querySelector('.' + SLIDERTABHANDLE);
            if (focusedElement) {
                focusedElement.classList.remove(SLIDERTABHANDLE);
            }
            EventHandler.add(document, 'mousemove touchmove', this.dragRangeBarMove, this);
            EventHandler.add(document, 'mouseup touchend', this.dragRangeBarUp, this);
        }
    }
    private dragRangeBarUp(event: MouseEvent & TouchEvent): void {
        // tslint:disable-next-line:no-any
        if (this.options.Events !== null && (this.options.Events as any).valueChange.hasDelegate &&
            this.options.Value[0] !== this.changedEventValue as number[][0]) {
            this.dotNetRef.invokeMethodAsync('TriggerEvent', {
                PreviousValue: this.changedEventValue,
                Value: this.options.Value,
                isValueChanged: true
            });
        }
        EventHandler.remove(document, 'mousemove touchmove', this.dragRangeBarMove);
        EventHandler.remove(document, 'mouseup touchend', this.dragRangeBarUp);
        this.isDragRange = true;
    }
    private handleValueAdjust(handleValue: number, assignValue: number, handleNumber: SliderHandleNumber): void {
        if (handleNumber === 1) {
            this.handleVal1 = assignValue;
            this.handleVal2 = this.handleVal1 + this.minDiff;
        } else if (handleNumber === 2) {
            this.handleVal2 = assignValue;
            this.handleVal1 = this.handleVal2 - this.minDiff;
        }
        this.handlePos1 = this.checkHandlePosition(this.handleVal1);
        this.handlePos2 = this.checkHandlePosition(this.handleVal2);
    }
    private getLimitValueAndPosition(currentValue: number, minValue: number, maxValue: number, limitBar?: boolean): number[] {
        if (isNullOrUndefined(minValue)) {
            minValue = this.options.Min;
            if (isNullOrUndefined(currentValue) && limitBar) {
                currentValue = minValue;
            }
        }
        if (isNullOrUndefined(maxValue)) {
            maxValue = this.options.Max;
            if (isNullOrUndefined(currentValue) && limitBar) {
                currentValue = maxValue;
            }
        }
        if (currentValue < minValue) {
            currentValue = minValue;
        }
        if (currentValue > maxValue) {
            currentValue = maxValue;
        }
        return [currentValue, this.checkHandlePosition(currentValue)];
    }
    private dragRangeBarMove(event: MouseEvent & TouchEvent): void {
        if (event.type !== 'touchmove') {
            event.preventDefault();
        }
        this.isDragRange = true;
        let pos: { [key: string]: number };
        this.rangeBar.style.transition = 'none';
        this.firstHandle.style.transition = 'none';
        this.secondHandle.style.transition = 'none';
        let xPostion: number; let yPostion: number;
        if (event.type === 'mousemove') {
            [xPostion, yPostion] = [event.clientX, event.clientY];
        } else {
            [xPostion, yPostion] = [event.changedTouches[0].clientX, event.changedTouches[0].clientY];
        }

        if (event.type === 'mousemove') {
            pos = { x: event.clientX, y: event.clientY };
        } else if (event.type === 'touchmove' || event.type === 'touchstart') {
            pos = { x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY };
        }
        // tslint:disable-next-line:no-any
        let limits: any = this.options.Limits;
        if (isNullOrUndefined(limits) || !(limits.enabled && limits.startHandleFixed) && !(limits.enabled && limits.endHandleFixed)) {
            if (!this.options.EnableRtl) {
                pos = { x: xPostion - this.firstPartRemain, y: yPostion + this.secondPartRemain };
            } else {
                pos = { x: xPostion + this.secondPartRemain, y: yPostion + this.secondPartRemain };
            }
            this.handlePos1 = this.xyToPosition(pos);
            this.handleVal1 = this.positionToValue(this.handlePos1);
            if (!this.options.EnableRtl) {
                pos = { x: xPostion + this.secondPartRemain, y: yPostion - this.firstPartRemain };
            } else {
                pos = { x: xPostion - this.firstPartRemain, y: yPostion - this.firstPartRemain };
            }
            this.handlePos2 = this.xyToPosition(pos);
            this.handleVal2 = this.positionToValue(this.handlePos2);
            if (!isNullOrUndefined(this.options.Limits) && this.options.Limits.enabled) {
                let value: number[] = this.getLimitValueAndPosition(this.handleVal1, limits.minStart, limits.minEnd);
                this.handleVal1 = value[0];
                this.handlePos1 = value[1];
                if (this.handleVal1 === limits.minEnd) {
                    this.handleValueAdjust(this.handleVal1, limits.minEnd, 1);
                }
                if (this.handleVal1 === limits.minStart) {
                    this.handleValueAdjust(this.handleVal1, limits.minStart, 1);
                }
                value = this.getLimitValueAndPosition(this.handleVal2, limits.maxStart, limits.maxEnd);
                this.handleVal2 = value[0];
                this.handlePos2 = value[1];
                if (this.handleVal2 === limits.maxStart) {
                    this.handleValueAdjust(this.handleVal2, limits.maxStart, 2);
                }
                if (this.handleVal2 === limits.maxEnd) {
                    this.handleValueAdjust(this.handleVal2, limits.maxEnd, 2);
                }
            }
            if (this.handleVal2 === this.options.Max) {
                this.handleValueAdjust(this.handleVal2, this.options.Max, 2);
            }
            if (this.handleVal1 === this.options.Min) {
                this.handleValueAdjust(this.handleVal1, this.options.Min, 1);
            }
        }
        let previousVal: number | number[] = this.options.IsImmediateValue ? this.previousHandleVal : (this.changedEventValue ?
            this.changedEventValue : this.previousHandleVal);
        this.setHandlePosition(event);
        this.updateValue();
        if (this.options.Type !== DEFAULTSLIDER) {
            this.setRangeBarPosition();
        }
        // tslint:disable-next-line:no-any
        if (this.options.Events !== null && (this.options.Events as any).onChange.hasDelegate &&
            previousVal as number[][0] !== this.options.Value[0]) {
            this.dotNetRef.invokeMethodAsync('TriggerEvent', {
                PreviousValue: previousVal,
                Value: this.options.Value,
                isValueChanged: false
            });
        }
    }
    public wireEvents(): void {
        EventHandler.add(this.element, 'click', this.clickHandler, this);
        EventHandler.add(this.element, 'keydown', this.keyDown, this);
        EventHandler.add(this.element, 'focusout', this.focusOut, this);
        if (this.options.Type === 'Range') {
            EventHandler.add(this.rangeBar, 'mousedown touchstart', this.rangeBarMousedown, this);
        }
        this.onResize = this.reposition.bind(this);
        window.addEventListener('resize', this.onResize);
        this.wireFirstHandleEventArgs();
        if (this.options.Type === 'Range') {
            this.wireSecondHandleEventArgs();
        }
    }
    private wireFirstHandleEventArgs(): void {
        EventHandler.add(this.firstHandle, 'mousedown touchstart', this.handleFocus, this);
    };

    private wireSecondHandleEventArgs(): void {
        EventHandler.add(this.secondHandle, 'mousedown touchstart', this.handleFocus, this);
    };
    public unWireEvents(): void {
        EventHandler.remove(this.element, 'click', this.clickHandler);
        EventHandler.remove(this.element, 'keydown', this.keyDown);
        window.removeEventListener('resize', this.onResize);
        this.unWireFirstHandleEventArgs();
        if (this.options.Type === 'Range') {
            this.unWireSecondHandleEventArgs();
        }
    }
    private unWireFirstHandleEventArgs(): void {
        EventHandler.remove(this.firstHandle, 'mousedown touchstart', this.handleFocus);
    };
    private unWireSecondHandleEventArgs(): void {
        EventHandler.remove(this.secondHandle, 'mousedown touchstart', this.handleFocus);
    };
    private focusOut(): void {
        if (this.options.Tooltip !== null && this.options.Tooltip.isVisible) {
            if (this.options.Type !== RANGESLIDER && !isNullOrUndefined(this.materialHandle)) {
                this.materialHandle.style.transform = 'scale(1)';
            }
            this.dotNetRef.invokeMethodAsync('CloseTooltip');
        }
    }
    private reposition(): void {
        this.initialRendering = false;
        this.initialize();
    }
    private handleValueUpdate(): number {
        let hVal: number;
        if (this.options.Type === RANGESLIDER) {
            hVal = this.activeHandle === 1 ? this.handleVal1 : this.handleVal2;
        } else {
            hVal = this.handleVal1;
        }
        return hVal;
    }
    private keyDown(event: KeyboardEvent): void {
        switch (event.keyCode) {
            case 37:
            case 38:
            case 39:
            case 40:
            case 33:
            case 34:
            case 36:
            case 35:
                event.preventDefault();
                this.buttonClick(event);
                break;
        }
    }
    private buttonClick(args: KeyboardEvent | MouseEvent): void {
        let value: number;
        let enabledRTL: boolean = this.options.EnableRtl && this.options.Orientation === HORIZONTAL;
        let hVal: number = this.handleValueUpdate();
        if (((<KeyboardEvent>args).keyCode === 40) || ((<KeyboardEvent>args).keyCode === 37)
            || (args.currentTarget as HTMLElement).classList.contains(FIRSTBUTTON)) {
            enabledRTL ? (value = this.add(hVal, parseFloat(this.options.Step.toString()), true)) :
                (value = this.add(hVal, parseFloat(this.options.Step.toString()), false));
        } else if (((<KeyboardEvent>args).keyCode === 38) || ((<KeyboardEvent>args).keyCode === 39) ||
            (args.currentTarget as HTMLElement).classList.contains(SECONDBUTTON)) {
            enabledRTL ? (value = this.add(hVal, parseFloat(this.options.Step.toString()), false)) :
                (value = this.add(hVal, parseFloat(this.options.Step.toString()), true));
        } else if (((<KeyboardEvent>args).keyCode === 33
            || (args.currentTarget as HTMLElement).classList.contains(FIRSTBUTTON))) {
            enabledRTL ? (value = this.add(hVal, parseFloat(this.options.Ticks.largeStep.toString()), false)) :
                (value = this.add(hVal, parseFloat(this.options.Ticks.largeStep.toString()), true));
        } else if (((<KeyboardEvent>args).keyCode === 34) ||
            (args.currentTarget as HTMLElement).classList.contains(SECONDBUTTON)) {
            enabledRTL ? (value = this.add(hVal, parseFloat(this.options.Ticks.largeStep.toString()), true)) :
                (value = this.add(hVal, parseFloat(this.options.Ticks.largeStep.toString()), false));
        } else if (((<KeyboardEvent>args).keyCode === 36)) {
            value = parseFloat(this.options.Min.toString());

        } else if (((<KeyboardEvent>args).keyCode === 35)) {
            value = parseFloat(this.options.Max.toString());
        }
        this.options.Value = this.options.Type !== RANGESLIDER ? value : this.activeHandle === 1 ?
            [value, (this.options.Value as number[])[1]] : [(this.options.Value as number[])[0], value];
        if (this.options.Type === RANGESLIDER) {
            if ((this.options.Value as number[])[0] > (this.options.Value as number[])[1] && this.activeHandle === 1) {
                (this.options.Value as number[])[0] = (this.options.Value as number[])[1];
            } else if ((this.options.Value as number[])[1] < (this.options.Value as number[])[0]) {
                (this.options.Value as number[])[1] = (this.options.Value as number[])[0];
            }
        }
        this.setValue();
    }
    private handleFocusOut(): void {
        this.element.focus();
        if (this.firstHandle.classList.contains(HANDLEFOCUSED)) {
            this.firstHandle.classList.remove(HANDLEFOCUSED);
        }
        if (this.firstHandle.classList.contains(HANDLEACTIVE)) {
            this.firstHandle.classList.remove(HANDLEACTIVE);
        }
        if (this.options.Type === 'Range') {
            if (this.secondHandle.classList.contains(HANDLEFOCUSED)) {
                this.secondHandle.classList.remove(HANDLEFOCUSED);
            }
            if (this.secondHandle.classList.contains(HANDLEACTIVE)) {
                this.secondHandle.classList.remove(HANDLEACTIVE);
            }
        }
    }

    private handleFocus(e: MouseEvent & TouchEvent): void {
        this.getHandlePosition(e);
        this.changedEventValue = this.previousHandleVal;
        this.sliderBarClick();
        if (e.currentTarget === this.firstHandle) {
            this.firstHandle.classList.add(HANDLEFOCUSED);
            this.firstHandle.classList.add(HANDLEACTIVE);
        } else {
            this.secondHandle.classList.add(HANDLEFOCUSED);
            this.secondHandle.classList.add(HANDLEACTIVE);
        }
        EventHandler.add(document, 'mousemove touchmove', this.sliderBarMove, this);
        EventHandler.add(document, 'mouseup touchend', this.sliderBarUp, this);
    }

    private sliderBarMove(eventargs: MouseEvent & TouchEvent): void {
        if ((eventargs.type === 'touchmove' && (eventargs.target as HTMLElement).parentElement === this.element) ||
            eventargs.type === 'mousemove') {
            if (eventargs.type !== 'touchmove') {
                eventargs.preventDefault();
            }
            this.isSliderMove = true;
            let pos: { [key: string]: Object };
            if (eventargs.type === 'mousemove') {
                pos = { x: eventargs.clientX, y: eventargs.clientY };
            } else if (eventargs.type === 'touchmove' || eventargs.type === 'touchstart') {
                pos = { x: eventargs.changedTouches[0].clientX, y: eventargs.changedTouches[0].clientY };
            }
            this.handlePos = this.xyToPosition(pos);
            this.handleVal = this.positionToValue(this.handlePos);
            this.handlePos = this.checkHandlePosition(this.handleVal);
            this.firstHandle.style.transition = this.transition.scaleTransform;
            if (this.options.Type === RANGESLIDER) {
                this.secondHandle.style.transition = this.transition.scaleTransform;
            }
            if (this.rangeBar) { this.rangeBar.style.transition = 'none'; }
            if (this.options.Type === RANGESLIDER) {
                if ((this.previousHandleVal as number[]).indexOf(this.handleVal) === -1) {
                    if (this.activeHandle === 1 && this.handleVal <= this.handleVal2 || this.activeHandle === 2 &&
                        this.handleVal >= this.handleVal1) {
                        // tslint:disable-next-line:no-any
                        if (this.options.Events != null && (this.options.Events as any).onChange.hasDelegate &&
                            this.options.IsImmediateValue) {
                            this.callChangeEvent(false);
                        } else {
                            this.sliderBarClick();
                        }
                    }
                }
            } else if (this.previousHandleVal !== this.handleVal) {
                // tslint:disable-next-line:no-any
                if (this.options.Events !== null && (this.options.Events as any).onChange.hasDelegate && this.options.IsImmediateValue) {
                    this.callChangeEvent(false);
                } else {
                    this.sliderBarClick();
                }
            }
        }
    }
    private callChangeEvent(isValueChanged: boolean): void {
        let previousVal: number | number[] = this.options.IsImmediateValue ? this.previousHandleVal : (this.changedEventValue ?
            this.changedEventValue : this.previousHandleVal);
        this.sliderBarClick();
        this.dotNetRef.invokeMethodAsync('TriggerEvent', {
            PreviousValue: previousVal,
            Value: this.options.Value,
            isValueChanged: isValueChanged
        });
    }
    private updateHandleAttributes(attributeName: string, value: string[]): void {
        if (attributeName === 'aria-valuenow') {
            if (this.options.Type === RANGESLIDER) {
                this.firstHandle.setAttribute(attributeName, '[' + value[0] + ',' + value[1] + ']');
                this.secondHandle.setAttribute(attributeName, '[' + value[0] + ',' + value[1] + ']');
            } else {
                this.firstHandle.setAttribute(attributeName, value[0]);
            }
        } else {
            this.firstHandle.setAttribute(attributeName, value[0]);
            if (this.options.Type === RANGESLIDER) {
                this.secondHandle.setAttribute(attributeName, value[0]);
            }
        }
    }
    private getTheme(container: HTMLElement): string {
        let theme: string = window.getComputedStyle(container as Element, ':after').getPropertyValue('content');
        return theme.replace(/['"]+/g, '');
    }
    private setZindex(): void {
        let zIndex: number = 6;
        if (!isNullOrUndefined(this.options.Ticks) && this.options.Ticks.placement !== 'None') {
            this.element.getElementsByTagName('ul')[0].style.zIndex = (zIndex + -7) + '';
            this.element.style.zIndex = (zIndex + 2) + '';
        }
        if (this.getTheme(this.sliderContainer) === 'material' &&
            !isNullOrUndefined(this.options.Ticks) && this.options.Ticks.placement === 'Both') {
            this.element.style.zIndex = (zIndex + 2) + '';
        }
        this.firstHandle.style.zIndex = (zIndex + 3) + '';
        if (this.options.Type === 'Range') {
            this.secondHandle.style.zIndex = (zIndex + 4) + '';
        }
    };
    private sliderBarUp(event: MouseEvent): void {
        this.handleFocusOut();
        EventHandler.remove(document, 'mousemove touchmove', this.sliderBarMove);
        EventHandler.remove(document, 'mouseup touchend', this.sliderBarUp);
        this.isSliderMove = false;
        this.transitionNode();
    }

    private transitionNode(): void {
        this.firstHandle.style.transition = 'none';
        if (this.options.Type === RANGESLIDER) {
            this.secondHandle.style.transition = 'none';
        }
        if (this.rangeBar) { this.rangeBar.style.transition = 'none'; }
    }
    private clickHandler(eventargs: MouseEvent & TouchEvent): void {
        if (this.isDragRange) {
            this.isDragRange = false;
            return;
        }
        eventargs.preventDefault();
        let changedEventVal: number | number[] = this.changedEventValue;
        this.getHandlePosition(eventargs);
        // tslint:disable-next-line:no-any
        if ((this.options.Events != null && (this.options.Events as any).onChange.hasDelegate) ||
            // tslint:disable-next-line:no-any 
            this.options.Events != null && (this.options.Events as any).valueChange.hasDelegate) {
            this.isClicked = true;
            this.sliderBarClick();
            // tslint:disable-next-line:no-any
            if ((this.options.Events as any).onChange.hasDelegate) {
                this.callChangeEvent(false);
            }
            changedEventVal = this.isSliderMove ? this.previousHandleVal : (this.changedEventValue ?
                this.changedEventValue : this.previousHandleVal);
            // tslint:disable-next-line:no-any
            if ((this.options.Events as any).valueChange.hasDelegate) {
                this.dotNetRef.invokeMethodAsync('TriggerEvent', {
                    PreviousValue: changedEventVal,
                    Value: this.options.Value,
                    isValueChanged: true
                });
            }
        } else {
            this.sliderBarClick();
        }
        if (this.isClicked) { this.previousHandleVal = this.options.Value; }
        this.changedEventValue = this.previousHandleVal;
        this.isClicked = false;
    }

    private updateNewHandleValue(handleVal: number, handlePos: number, limitValue: number[]): number[] {
        if (limitValue[0] || limitValue[1]) {
            if (handleVal < limitValue[0]) {
                handleVal = limitValue[0];
                handlePos = this.checkHandlePosition(handleVal);
            } else if (handleVal > limitValue[1]) {
                handleVal = limitValue[1];
                handlePos = this.checkHandlePosition(handleVal);
            }
        }
        return [handleVal, handlePos];
    }
    private sliderBarClick(): void {
        if (this.options.Type !== RANGESLIDER || this.activeHandle === 1 &&
            this.handleVal1 <= this.handleVal2 || this.activeHandle === 2
            && this.handleVal1 <= this.handleVal2) {
            this.firstHandle.style.transition = this.transition.handle;
            if (this.options.Type === RANGESLIDER) {
                this.secondHandle.style.transition = this.transition.handle;
            }
            if (this.rangeBar) { this.rangeBar.style.transition = this.transition.rangeBar; }
            if (this.options.Limits) {
                let limitValue: number[];
                if (this.activeHandle === 1 && !this.options.Limits.startHandleFixed) {
                    limitValue = [this.options.Limits.minStart, this.options.Limits.minEnd];
                    let valAndPos: number[] = this.updateNewHandleValue(this.handleVal, this.handlePos, limitValue);
                    this.updateHandleValue(this.firstHandle, valAndPos[0], valAndPos[1], true);
                    if (this.isMaterial && !isNullOrUndefined(this.materialHandle) && this.options.Type !== RANGESLIDER) {
                        this.updateHandleValue(this.materialHandle, valAndPos[0], valAndPos[1], this.activeHandle === 1);
                    }
                } else if (this.activeHandle === 2 && !this.options.Limits.endHandleFixed) {
                    limitValue = [this.options.Limits.maxStart, this.options.Limits.maxEnd];
                    let valAndPos: number[] = this.updateNewHandleValue(this.handleVal, this.handlePos, limitValue);
                    this.updateHandleValue(this.secondHandle, valAndPos[0], valAndPos[1]);
                }
            } else {
                let currentActiveHandle: HTMLElement = this.activeHandle === 1 ? this.firstHandle : this.secondHandle;
                this.updateHandleValue(currentActiveHandle, this.handleVal, this.handlePos, this.activeHandle === 1);
                if (this.isMaterial && !isNullOrUndefined(this.materialHandle) && this.options.Type !== RANGESLIDER) {
                    this.updateHandleValue(this.materialHandle, this.handleVal, this.handlePos, this.activeHandle === 1);
                }
            }
            if (this.options.Type !== DEFAULTSLIDER) {
                this.setRangeBarPosition();
            }
            this.updateValue();
        }
    }
    private updateHandleValue(handle: HTMLElement, handleVal: number, handlePos: number, isFirstHandle: boolean = false): void {
        this.applyHandlePosition(handle, handlePos);
        if (isFirstHandle) {
            this.handleVal1 = handleVal;
            this.handlePos1 = handlePos;
        } else {
            this.handleVal2 = handleVal;
            this.handlePos2 = handlePos;
        }
        this.updateAriaValue();
    }
    private updateAriaValue(): void {
        if (this.options.Type !== RANGESLIDER) {
            if (this.options.CustomValues) {
                this.updateHandleAttributes('aria-valuenow', [this.options.CustomValues[this.handleVal1].toString()]);
            } else {
                this.updateHandleAttributes('aria-valuenow', [this.handleVal1.toString()]);
            }
        } else {
            if (this.options.CustomValues) {
                this.updateHandleAttributes('aria-valuenow', [this.options.CustomValues[this.handleVal1].toString(),
                this.options.CustomValues[this.handleVal2].toString()]);
            } else {
                this.updateHandleAttributes('aria-valuenow', [this.handleVal1.toString(), this.handleVal2.toString()]);
            }
        }
    }
    private positionToValue(pos: number): number {
        let val: number;
        let diff: number = parseFloat(formatUnit(this.options.Max)) - parseFloat(formatUnit(this.options.Min));
        if (this.options.Orientation === HORIZONTAL) {
            val = (pos / this.element.getBoundingClientRect().width) * diff;
        } else {
            val = (pos / this.element.getBoundingClientRect().height) * diff;
        }
        let total: number = this.add(val, parseFloat(this.options.Min.toString()), true);
        return (total);
    }

    private add(a: number, b: number, addition: boolean): number {
        let precision: number;
        let x: number = Math.pow(10, precision || 3);
        let val: number;
        if (addition) {
            val = (Math.round(a * x) + Math.round(b * x)) / x;
        } else {
            val = (Math.round(a * x) - Math.round(b * x)) / x;
        }
        return val;
    }

    private setElementWidth(width: number | string): void {
        if (!isNullOrUndefined(width)) {
            if (typeof width === 'number') {
                this.sliderContainer.style.width = formatUnit(width);
            } else if (typeof width === 'string') {
                this.sliderContainer.style.width = (width.match(/px|%|em/)) ? <string>(width) : <string>(formatUnit(width));
            }
        }
    }
    private xyToPosition(position: { [key: string]: Object }): number {
        let pos: number;
        let elementAttr: DOMRect | ClientRect = this.element.getBoundingClientRect();
        if (this.options.Min === this.options.Max) {
            return 100;
        }
        if (this.options.Orientation === HORIZONTAL) {
            let left: number = position.x as number - elementAttr.left;
            let num: number = this.element.offsetWidth / 100;
            this.posvalue = (left / num);
        } else {
            let top: number = position.y as number - elementAttr.top;
            let num: number = this.element.offsetHeight / 100;
            this.posvalue = 100 - (top / num);
        }
        let val: number = this.stepValueCalculation(this.posvalue);
        if (val < 0) {
            val = 0;
        } else if (val > 100) {
            val = 100;
        }
        if (this.options.EnableRtl && this.options.Orientation === HORIZONTAL) {
            val = 100 - val;
        }
        if (this.options.Orientation === HORIZONTAL) {
            pos = elementAttr.width * (val / 100);
        } else {
            pos = elementAttr.height * (val / 100);
        }
        return pos;
    }

    private stepValueCalculation(value: number): number {
        if (this.options.Step === 0) {
            this.options.Step = 1;
        }
        let percentStep: number = (parseFloat(formatUnit(this.options.Step))) /
            ((parseFloat(formatUnit(this.options.Max)) - parseFloat(formatUnit(this.options.Min))) / 100);
        let remain: number = value % Math.abs(percentStep);
        if (remain !== 0) {
            if ((percentStep / 2) > remain) {
                value -= remain;
            } else {
                value += Math.abs(percentStep) - remain;
            }
        }
        return value;
    }

    private setLimitBarPosition(): void {
        let attrVal: string;
        this.limitBar1 = this.element.querySelector('.e-limits');
        this.limitBar2 = this.element.querySelector('.e-limit-second');
        if (this.options.Limits.minStart !== null || this.options.Limits.minEnd !== null) {
            if (this.options.Orientation === HORIZONTAL) {
                if (!this.options.EnableRtl) {
                    this.limitBar1.style.left = this.checkHandlePosition(this.options.Limits.minStart) + 'px';
                } else {
                    this.limitBar1.style.left = this.checkHandlePosition(this.options.Max - this.options.Limits.minEnd) + 'px';
                }
                attrVal = 'width';
            } else {
                this.limitBar1.style.bottom = this.checkHandlePosition(this.options.Limits.minStart) + 'px';
                attrVal = 'height';
            }

            let minvalues: number = this.options.Limits.minEnd =
                this.options.Limits.minEnd != null ? this.options.Limits.minEnd : this.options.Max;
            setStyleAttribute(this.limitBar1, {
                [attrVal]: this.checkHandlePosition(minvalues) - this.checkHandlePosition(this.options.Limits.minStart) + 'px'
            });
        }
        if (this.options.Type === RANGESLIDER) {
            if (this.options.Limits.maxStart !== null || this.options.Limits.maxEnd !== null) {
                if (this.options.Orientation === HORIZONTAL) {
                    this.limitBar2.style.left = this.checkHandlePosition(this.options.Limits.maxStart) + 'px';
                } else {
                    this.limitBar2.style.bottom = this.checkHandlePosition(this.options.Limits.maxStart) + 'px';
                }
                let maxvalues: number = this.options.Limits.maxEnd =
                    this.options.Limits.maxEnd != null ? this.options.Limits.maxEnd : this.options.Max;
                setStyleAttribute(this.limitBar2, {
                    [attrVal]: this.checkHandlePosition(maxvalues) - this.checkHandlePosition(this.options.Limits.maxStart) + 'px'
                });
            }
        }
    };

    private setHandler(): void {
        if (this.options.Min > this.options.Max) {
            this.options.Min = this.options.Max;
        }
        this.createFirstHandle();
        this.createSecondHandle();
    }
    private createSecondHandle(): void {
        this.secondHandle = this.element.querySelector('.e-handle-second');
    }

    private createFirstHandle(): void {
        this.firstHandle = this.element.querySelector('.e-handle-first');
    }
    private setValue(makeServerCall: boolean = true): void {
        let firstHandleValue: number = this.options.Type !== RANGESLIDER ?
            this.options.Value as number : (this.options.Value as number[])[0];
        this.handleVal1 = isNullOrUndefined(this.options.Value) ? this.checkHandleValue(parseFloat(this.options.Min.toString())) :
            this.checkHandleValue(parseFloat(firstHandleValue.toString()));
        this.handlePos1 = this.checkHandlePosition(this.handleVal1);
        if (this.options.Limits != null) {
            let valAndPos: number[] =
                this.updateNewHandleValue(this.handleVal1, this.handlePos1, [this.options.Limits.minStart, this.options.Limits.minEnd]);
            this.handleVal1 = valAndPos[0];
            this.handlePos1 = valAndPos[1];
        }
        if (this.options.Type === RANGESLIDER) {
            this.handleVal2 = isNullOrUndefined(this.options.Value) ?
                this.checkHandleValue(parseFloat(this.options.Max.toString())) :
                this.checkHandleValue(parseFloat((this.options.Value as number[])[1].toString()));
            this.handlePos2 = this.checkHandlePosition(this.handleVal2);
            if (this.options.Limits != null) {
                let valAndPos: number[] =
                    this.updateNewHandleValue(this.handleVal2, this.handlePos2, [this.options.Limits.maxStart, this.options.Limits.maxEnd]);
                this.handleVal2 = valAndPos[0];
                this.handlePos2 = valAndPos[1];
            }
        }
        this.setHandlePosition(null);
        if (this.options.Type !== DEFAULTSLIDER) {
            this.setRangeBarPosition();
        }
        if (this.options.Ticks !== null && this.options.Ticks.placement !== 'None') {
            this.setTickValuePosition();
        }
        this.updateValue(makeServerCall);
    }
    private updateColorRangeBarPos(): void {
        if (this.options.ColorRange != null) {
            let trackInfo: HTMLCollection = this.sliderTrack.children;
            for (let i: number = 0; i < this.options.ColorRange.length; i++) {
                if (this.options.Orientation === HORIZONTAL) {
                    if (!this.options.EnableRtl) {
                        (trackInfo[i] as HTMLElement).style.left = !this.options.EnableRtl ?
                            this.checkHandlePosition(this.options.ColorRange[i].start) + 'px' :
                            this.checkHandlePosition(this.options.Max - this.options.ColorRange[i].end) + 'px';
                    }
                    (trackInfo[i] as HTMLElement).style.width =
                        this.checkHandlePosition(this.options.ColorRange[i].end) -
                        this.checkHandlePosition(this.options.ColorRange[i].start) + 'px';
                } else {
                    (trackInfo[i] as HTMLElement).style.bottom =
                        this.checkHandlePosition(this.options.ColorRange[i].start) + 'px';
                    (trackInfo[i] as HTMLElement).style.height =
                        this.checkHandlePosition(this.options.ColorRange[i].end) -
                        this.checkHandlePosition(this.options.ColorRange[i].start) + 'px';
                }
                (trackInfo[i] as HTMLElement).style.removeProperty('display');
            }
        }
    }

    private setTickValuePosition(): void {
        this.firstChild = this.element.querySelector('ul').children[0];
        let firstElementDetails: DOMRect | ClientRect = this.firstChild.getBoundingClientRect();
        let firstChild: DOMRect | ClientRect;
        let otherChild: DOMRect | ClientRect;
        let smallStep: number = this.options.Ticks.smallStep;
        let count: number = Math.abs(parseFloat(formatUnit(this.options.Max)) - parseFloat(formatUnit(this.options.Min))) / smallStep;
        if (this.firstChild.children.length > 0) {
            firstChild = this.firstChild.children[0].getBoundingClientRect();
        }
        let tickElements: HTMLElement[] = [this.element.querySelectorAll('.' + TICK + '.' + LARGE + ' .' + TICKVALUE)];
        let other: HTMLElement[];
        if (this.options.Ticks.placement === 'Both') {
            other = [].slice.call(tickElements[0], 2);
        } else {
            other = [].slice.call(tickElements[0], 1);
        }
        let tickWidth: number = this.options.Orientation !== HORIZONTAL ? firstElementDetails.height * 2 : firstElementDetails.width * 2;
        for (let i: number = 0; i < this.firstChild.children.length; i++) {
            if (this.options.Orientation === HORIZONTAL) {
                if (!this.options.EnableRtl) {
                    (this.firstChild.children[i] as HTMLElement).style.left = -(firstChild.width / 2) + 'px';
                } else {
                    (this.firstChild.children[i] as HTMLElement).style.left = (tickWidth -
                        this.firstChild.children[i].getBoundingClientRect().width) / 2 + 'px';
                }
            } else {
                (this.firstChild.children[i] as HTMLElement).style.top = -(firstChild.width / 2) + 'px';
            }
        }
        for (let i: number = 0; i < other.length; i++) {
            otherChild = other[i].getBoundingClientRect();
            if (this.options.Orientation === HORIZONTAL) {
                setStyleAttribute(other[i], { left: (tickWidth - otherChild.width) / 2 + 'px' });
                if (this.options.EnableRtl && other[i].parentElement.classList.contains('e-last-tick')) {
                    setStyleAttribute(other[i], { left: -(otherChild.width / 2) + 'px' });
                }
            } else {
                setStyleAttribute(other[i], { top: (tickWidth - otherChild.height) / 2 + 'px' });
            }
        }
        if (count === 0) {
            this.firstChild.classList.remove(SLIDERLASTTICK);
        }
        // tslint:disable-next-line:no-any
        let args: any;
        if (this.firstChild != null) {
            if (this.options.Orientation === HORIZONTAL) {
                args = {
                    firstTickPostion: (this.firstChild.children[0] as HTMLElement).style.left
                };
            } else {
                args = {
                    firstTickPostion: -(firstChild.height / 2) + 'px'
                };
            }
        }
        if (other[0] != null) {
            if (this.options.Orientation === HORIZONTAL) {
                args = {
                    otherTicksPosition: other[0].style.left
                };
            } else {
                args = {
                    otherTicksPosition: (tickWidth - otherChild.height) / 2 + 'px'
                };
            }
        }
        if (this.firstChild != null && other[0] != null) {
            if (this.options.Orientation === HORIZONTAL) {
                args = {
                    firstTickPostion: (this.firstChild.children[0] as HTMLElement).style.left,
                    otherTicksPosition: other[0].style.left
                };
            } else {
                args = {
                    firstTickPostion: -(firstChild.height / 2) + 'px',
                    otherTicksPosition: (tickWidth - otherChild.height) / 2 + 'px'
                };
            }
        }
        this.element.querySelector('ul').style.removeProperty(VISIBILITY);
    };

    private setRangeBarPosition(): void {
        this.rangeBar = this.element.querySelector('.' + RANGE);
        if (this.options.Orientation === HORIZONTAL) {
            if (this.options.Type === MINRANGESLIDER) {
                this.options.EnableRtl ? (this.rangeBar.style.right = '0px') : (this.rangeBar.style.left = '0px');
                setStyleAttribute(this.rangeBar, { 'width': isNullOrUndefined(this.handlePos1) ? 0 : this.handlePos1 + 'px' });
            } else {
                this.options.EnableRtl ? (this.rangeBar.style.right =
                    this.handlePos1 + 'px') : (this.rangeBar.style.left = this.handlePos1 + 'px');
                setStyleAttribute(this.rangeBar, { 'width': this.handlePos2 - this.handlePos1 + 'px' });
            }
        } else {
            if (this.options.Type === MINRANGESLIDER) {
                this.rangeBar.style.bottom = '0px';
                setStyleAttribute(this.rangeBar, { 'height': isNullOrUndefined(this.handlePos1) ? 0 : this.handlePos1 + 'px' });
            } else {
                this.rangeBar.style.bottom = this.handlePos1 + 'px';
                setStyleAttribute(this.rangeBar, { 'height': this.handlePos2 - this.handlePos1 + 'px' });
            }
        }
    }

    private setHandlePosition(event: MouseEvent | TouchEvent): void {
        this.updateHandleAttributes('aria-valuemin', [this.options.Min.toString()]);
        this.updateHandleAttributes('aria-valuemax', [this.options.Max.toString()]);
        let pos: number[] = [this.handlePos1, this.handlePos2];
        this.updateHandlePosition(this.firstHandle, pos[0]);
        if (this.isMaterial && this.options.Type !== RANGESLIDER && !isNullOrUndefined(this.materialHandle)) {
            this.updateHandlePosition(this.materialHandle, pos[0]);
        }
        if (this.options.Type === RANGESLIDER) {
            this.updateHandlePosition(this.secondHandle, pos[1]);
        }
        this.updateAriaValue();
    }
    private getHandlePosition(eventargs: MouseEvent & TouchEvent): void {
        eventargs.preventDefault();
        let pos: { [key: string]: Object };
        if (eventargs.type === 'mousedown' || eventargs.type === 'mouseup' || eventargs.type === 'click') {
            pos = { x: eventargs.clientX, y: eventargs.clientY };
        } else if (eventargs.type === 'touchend' || eventargs.type === 'touchstart') {
            pos = { x: eventargs.changedTouches[0].clientX, y: eventargs.changedTouches[0].clientY };
        }
        this.handlePos = this.xyToPosition(pos);
        this.handleVal = this.positionToValue(this.handlePos);
        if (this.handleVal2 < this.handleVal) {
            this.activeHandle = 2;
        } else if (this.handleVal1 > this.handleVal) {
            this.activeHandle = 1;
        } else {
            let diff1: number = this.handleVal > this.handleVal1 ? this.handleVal - this.handleVal1 : this.handleVal1 - this.handleVal;
            let diff2: number = this.handleVal > this.handleVal2 ? this.handleVal - this.handleVal2 : this.handleVal2 - this.handleVal;
            this.activeHandle = diff1 > diff2 ? 2 : 1;
        }
    }

    private updateHandlePosition(handle: HTMLElement, pos: number): void {
        this.applyHandlePosition(handle, pos);
        handle.style.removeProperty(VISIBILITY);
    };

    private applyHandlePosition(handle: HTMLElement, pos: number): void {
        if (this.options.Orientation === HORIZONTAL) {
            if (this.options.EnableRtl) {
                handle.style.right = pos + 'px';
            } else {
                handle.style.left = pos + 'px';
            }
        } else {
            handle.style.bottom = pos + 'px';
        }
        handle.style.transition = this.transition.handle;
    }

    private checkHandleValue(value: number): number {
        if (this.options.Min > this.options.Max) {
            this.options.Min = this.options.Max;
        }
        if (this.options.Min === this.options.Max) {
            return (parseFloat(formatUnit(this.options.Max)));
        }
        let handle: { [key: string]: Object } = this.handleStartEnd() as { [key: string]: Object };
        if (value < handle.start) {
            value = handle.start as number;
        } else if (value > handle.end) { value = handle.end as number; }
        return value;
    }

    private checkHandlePosition(value: number): number {
        let pos: number;
        let elementAttr: DOMRect | ClientRect = this.element.getBoundingClientRect();
        value = (100 * (value - (parseFloat(formatUnit(this.options.Min))))) /
            ((parseFloat(formatUnit(this.options.Max))) - (parseFloat(formatUnit(this.options.Min))));

        if (this.options.Orientation === HORIZONTAL) {
            pos = elementAttr.width * (value / 100);
        } else {
            pos = elementAttr.height * (value / 100);
        }
        if (((parseFloat(formatUnit(this.options.Max))) === (parseFloat(formatUnit(this.options.Min))))) {
            if (this.options.Orientation === HORIZONTAL) {
                pos = elementAttr.width;
            } else {
                pos = elementAttr.height;
            }
        }
        return pos;

    }
    private handleStartEnd(): Object {
        if (this.options.Min > this.options.Max) {
            return {
                start: this.options.Max,
                end: this.options.Min
            };
        } else {
            return {
                start: this.options.Min,
                end: this.options.Max
            };
        }
    }
    private updateValue(makeServerCall: boolean = true): void {
        if (this.options.Type === RANGESLIDER) {
            this.options.Value = [this.handleVal1, this.handleVal2];
        } else {
            this.options.Value = this.handleVal1;
        }
        if (!this.isClicked) { this.previousHandleVal = this.options.Value; }
        if (makeServerCall) {
            setTimeout(
                () => {
                    if (this.isMaterial && this.options.Tooltip !== null && !isNullOrUndefined(this.materialHandle) &&
                        this.options.Type !== RANGESLIDER) {
                        this.materialHandle.style.transform = 'scale(0)';
                    }
                    this.dotNetRef.invokeMethodAsync('UpdateValue', this.options.Value, this.activeHandle);
                },
                300);
        }
    }
    // tslint:disable-next-line:no-any
    public updateLimitData(limits: any): void {
        this.options.Limits = limits;
        this.setLimitBarPosition();
        this.setValue();
    }
    // tslint:disable-next-line:no-any
    public updateTicksData(ticks: any): void {
        this.options.Ticks = ticks;
        this.setTickValuePosition();
    }
    public updateSliderValue(value: number | number[]): void {
        this.options.Value = value;
        this.setValue();
    }
    public updateStepValue(value: number): void {
        this.options.Step = value;
    }
    public destroy(): void {
        (this.element as HTMLElement).style.display = 'none';
        this.unWireEvents();
    }
    public updateTooltipPosition(id: string): void {
        let tooltipContent: HTMLElement = document.getElementById(id);
        if (!isNullOrUndefined(tooltipContent) && this.options.Type !== RANGESLIDER && isNullOrUndefined(this.options.Tooltip.format)) {
            tooltipContent.style.transform = this.options.Tooltip.placement === 'Before' ? 'rotate(45deg)' : 'rotate(225deg)';
        }
    }
    // tslint:disable-next-line:no-any
    public propertyChanges(properties: any): void {
        if (properties.Enabled !== undefined) {
            this.options.Enabled = properties.Enabled;
        }
        if (properties.ReadOnly !== undefined) {
            this.options.ReadOnly = properties.ReadOnly;
        }
        if (properties.Value !== undefined) {
            this.options.Value = properties.Value;
            this.setValue();
        }
        if (properties.Max !== undefined) {
            this.options.Max = properties.Max;
        }
        if (properties.Step !== undefined) {
            this.options.Step = properties.Step;
        }
        if (properties.Min !== undefined) {
            this.options.Min = properties.Min;
        }
        if (properties.IsImmediateValue !== undefined) {
            this.options.IsImmediateValue = properties.IsImmediateValue;
        }
        if (this.options.Enabled && !this.options.ReadOnly) {
            this.wireEvents();
        } else {
            this.unWireEvents();
        }
    }
}

// tslint:disable
let Slider: object = {
    initialize(element: BlazorSliderElement, dotnetRef: BlazorDotnetObject, props: any): string {
        if (element) { new SfSlider(element, dotnetRef, props); }
        if (element && element.blazor__instance) {
            return element.blazor__instance.initialize();
        } else {
            return null;
        }

    },
    updateLimitData(element: BlazorSliderElement, limits: any): void {

        if (element && element.blazor__instance) {
            element.blazor__instance.updateLimitData(limits);
        }
    },
    updateTicksData(element: BlazorSliderElement, ticks: any): void {

        if (element && element.blazor__instance) {
            element.blazor__instance.updateTicksData(ticks);
        }
    },
    updateSliderValue(element: BlazorSliderElement, value: number | number[]) {
        if (element && element.blazor__instance) {
            element.blazor__instance.updateSliderValue(value);
        }
    },
    updateSTepValue(element: BlazorSliderElement, value: number) {
        if (element && element.blazor__instance) {
            element.blazor__instance.updateStepValue(value);
        }
    },
    updatedProperties(element: BlazorSliderElement, properties: any) {
        if (element && element.blazor__instance) {
            element.blazor__instance.propertyChanges(properties);
        }
    },
    destroy(element: BlazorSliderElement) {
        if (element && element.blazor__instance) {
            element.blazor__instance.destroy();
        }
    },
    updateTooltipPosition(element: BlazorSliderElement, id: string) {
        if (element && element.blazor__instance) {
            element.blazor__instance.updateTooltipPosition(id);
        }
    }
};
interface BlazorSliderElement extends HTMLElement {
    blazor__instance: SfSlider;
}

export default Slider;