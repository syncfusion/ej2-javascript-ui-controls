import { BlazorDotnetObject, Browser, Animation, closest, EventHandler, isNullOrUndefined, } from '@syncfusion/ej2-base';
import { select, createElement, extend, KeyboardEvents, KeyboardEventArgs } from '@syncfusion/ej2-base';
import { Popup } from '@syncfusion/ej2-popups';
const ROOT: string = 'e-datepicker';
const POPUPWRAPPER: string = 'e-popup-wrapper';
const POPUP: string = 'e-popup';
const OVERFLOW: string = 'e-date-overflow';
const CONENT: string = 'e-content';
const FOOTER_CONTAINER: string = 'e-footer-container';
const INPUT_HANDLER: string = 'InputKeyActionHandle';
const TBODY: string = 'tbody';
const TABLE: string = 'table';
const HIDE_POPUP: string = 'HidePopup';
const CLOSE_POPUP: string = 'ClosePopup';
const SHOW_POPUP: string = 'ShowPopup';
const MOUSE_TOUCH_EVENT: string = 'mousedown touchstart';
const SELECTED: string = 'e-selected';
const DAY: string = 'e-day';
const TODAY: string = 'e-today';
const BTN: string = 'e-btn';
const OFFSETVALUE: number = 4;
const OPENDURATION: number = 300;
const INPUTCONTAINER: string = 'e-input-group';
class SfDatePicker {
    public element: BlazorDatePickerElement | HTMLInputElement;
    private wrapperElement: HTMLElement;
    private popupWrapper: HTMLElement;
    private calendarElement: HTMLElement;
    private tableBodyElement: HTMLElement;
    private contentElement: HTMLElement;
    private popupObj: Popup;
    private modal: HTMLElement;
    private popupHolder: HTMLElement;
    private defaultKeyConfigs: { [key: string]: string };
    private index: number;
    private mobilePopupWrapper: HTMLElement;
    public dotNetRef: BlazorDotnetObject;
    public options: IDatePickerOptions;
    constructor(wrapperElement: HTMLElement, element: BlazorDatePickerElement, dotnetRef: BlazorDotnetObject, options: IDatePickerOptions) {
        this.wrapperElement = wrapperElement;
        this.element = element;
        this.options = options;
        this.element.blazor__instance = this;
        this.dotNetRef = dotnetRef;
    }
    public initialize(): void {
        this.defaultKeyConfigs = {
            altUpArrow: 'alt+uparrow',
            altDownArrow: 'alt+downarrow',
            escape: 'escape',
            enter: 'enter',
            controlUp: 'ctrl+38',
            controlDown: 'ctrl+40',
            moveDown: 'downarrow',
            moveUp: 'uparrow',
            moveLeft: 'leftarrow',
            moveRight: 'rightarrow',
            select: 'enter',
            home: 'home',
            end: 'end',
            pageUp: 'pageup',
            pageDown: 'pagedown',
            shiftPageUp: 'shift+pageup',
            shiftPageDown: 'shift+pagedown',
            controlHome: 'ctrl+home',
            controlEnd: 'ctrl+end',
            shiftTab: 'shift+tab',
            tab: 'tab'
        };
        this.defaultKeyConfigs = extend(this.defaultKeyConfigs, this.options.keyConfigs) as { [key: string]: string };
        new KeyboardEvents(
            <HTMLElement>this.element,
            {
                eventName: 'keydown',
                keyAction: this.inputKeyActionHandle.bind(this),
                keyConfigs: this.defaultKeyConfigs
            });
        this.index = this.options.showClearButton ? 2 : 1;
        EventHandler.add(this.element, 'blur', this.inputBlurHandler, this);
    }
    private inputKeyActionHandle(e: KeyboardEventArgs): void {
        let keyEventsArgs: object;
        if (this.popupObj && this.popupObj.element.classList.contains(POPUP)) {
            let focusedDate: Element = this.tableBodyElement.querySelector('tr td.e-focused-date');
            let selectedDate: Element = this.tableBodyElement.querySelector('tr td.' + SELECTED);
            this.tableBodyElement.focus();
            keyEventsArgs = {
                Action: e.action, Key: e.key, Events: e, SelectDate: selectedDate ? selectedDate.id : null,
                FocusedDate: focusedDate ? focusedDate.id : null,
                classList: selectedDate ? selectedDate.classList.toString() : focusedDate ? focusedDate.classList.toString() : 'e-cell',
                Id: focusedDate ? focusedDate.id : selectedDate ? selectedDate.id : null,
                TargetClassList: this.calendarElement.classList.toString()
            };
        } else {
            keyEventsArgs = {
                Action: e.action, Key: e.key, Events: e
            };
        }
        this.dotNetRef.invokeMethodAsync(INPUT_HANDLER, keyEventsArgs);
        if (e.action !== 'select' && this.popupObj && document.body.contains(this.popupObj.element)) {
            e.preventDefault();
        }
    }
    private inputBlurHandler(e: MouseEvent): void {
        if (this.isCalendar() && document.activeElement === this.element) {
            this.dotNetRef.invokeMethodAsync(HIDE_POPUP, e);
        }
    }
    // tslint:disable
    public renderPopup(popupElement: HTMLElement, popupHolderEle: HTMLElement, openEventArgs: PopupObjectArgs, options: IDatePickerOptions): void {
        this.options = options;
        this.popupHolder = popupHolderEle;
        this.createCalendar(popupElement, options);
        if (Browser.isDevice) {
            this.mobilePopupWrapper = createElement('div', { className: 'e-datepick-mob-popup-wrap' });
            document.body.appendChild(this.mobilePopupWrapper);
        }
        let appendToElement: HTMLElement = openEventArgs.appendTo === 'model' ? this.mobilePopupWrapper : document.body;
        appendToElement.appendChild(this.popupWrapper);
        this.popupObj.refreshPosition(this.element);
        let openAnimation: object = {
            name: 'FadeIn',
            duration: Browser.isDevice ? 0 : OPENDURATION,
        };
        if (this.options.zIndex === 1000) {
            this.popupObj.show(new Animation(openAnimation), this.element);
        } else {
            this.popupObj.show(new Animation(openAnimation), null);
        }
        this.setOverlayIndex(this.mobilePopupWrapper, this.popupObj.element, this.modal, Browser.isDevice);
        EventHandler.add(document, MOUSE_TOUCH_EVENT, this.documentHandler, this);
    }
    protected setOverlayIndex(popupWrapper: HTMLElement, popupElement: HTMLElement, modal: HTMLElement, isDevice: Boolean): void {
        if (isDevice && !isNullOrUndefined(popupElement) && !isNullOrUndefined(modal) && !isNullOrUndefined(popupWrapper)) {
            let index: number = parseInt(popupElement.style.zIndex, 10) ? parseInt(popupElement.style.zIndex, 10) : 1000;
            modal.style.zIndex = (index - 1).toString();
            popupWrapper.style.zIndex = index.toString();
        }
    }
    public closePopup(closeEventArgs: PopupObjectArgs, options: IDatePickerOptions): void {
        this.options = options;
        this.closeEventCallback(closeEventArgs);
    }
    private createCalendar(popupElement: HTMLElement, options: IDatePickerOptions): void {
        this.popupWrapper = popupElement;
        this.calendarElement = this.popupWrapper.firstElementChild as HTMLElement;
        this.tableBodyElement = select(TBODY, this.calendarElement) as HTMLElement;
        this.contentElement = select('.' + CONENT, this.calendarElement) as HTMLElement;
        if (Browser.isDevice) {
            this.modal = createElement('div');
            this.modal.className = '' + ROOT + ' e-date-modal';
            document.body.className += ' ' + OVERFLOW;
            this.modal.style.display = 'block';
            document.body.appendChild(this.modal);
        }
        this.calendarElement.querySelector(TABLE + ' ' + TBODY).className = '';
        this.popupObj = new Popup(this.popupWrapper as HTMLElement, {
            relateTo: Browser.isDevice ? document.body : this.wrapperElement,
            position: Browser.isDevice ? { X: 'center', Y: 'center' } : { X: 'left', Y: 'bottom' },
            offsetY: OFFSETVALUE,
            targetType: 'container',
            enableRtl: options.enableRtl,
            zIndex: options.zIndex,
            collision: Browser.isDevice ? { X: 'fit', Y: 'fit' } : { X: 'flip', Y: 'flip' },
            open: () => {
                if (document.activeElement !== this.element as HTMLElement) {
                    this.defaultKeyConfigs = extend(this.defaultKeyConfigs, options.keyConfigs) as { [key: string]: string };
                    (<HTMLElement>this.calendarElement.children[1].firstElementChild).focus();
                    new KeyboardEvents(<HTMLElement>this.calendarElement.children[1].firstElementChild,
                        {
                            eventName: 'keydown',
                            keyAction: this.CalendarKeyActionHandle.bind(this),
                            keyConfigs: this.defaultKeyConfigs
                        });
                    new KeyboardEvents(<HTMLElement>this.wrapperElement.children[this.index],
                        {
                            eventName: 'keydown',
                            keyAction: this.CalendarKeyActionHandle.bind(this),
                            keyConfigs: this.defaultKeyConfigs
                        });
                }
            }, close: () => {
                this.popupHolder.appendChild(this.popupWrapper);
                if (this.popupObj) {
                    this.popupObj.destroy();
                }
                this.dotNetRef.invokeMethodAsync(CLOSE_POPUP);
                this.popupObj = null;
            }, targetExitViewport: () => {
                if (!Browser.isDevice) { this.dotNetRef.invokeMethodAsync(HIDE_POPUP, null); }
            }
        });
    }
    private closeEventCallback(eventArgs: PopupObjectArgs): void {
        let preventArgs: PopupObjectArgs = eventArgs;
        if (this.isCalendar() && !preventArgs.cancel && this.popupObj) {
            this.popupObj.hide();
        }
        if (Browser.isDevice && this.modal) {
            this.modal.style.display = 'none';
            this.modal.outerHTML = '';
            this.modal = null;
        }
        if (Browser.isDevice) {
            if (!isNullOrUndefined(this.mobilePopupWrapper)) {
                this.mobilePopupWrapper.remove();
                this.mobilePopupWrapper = null;
            }
        }
        EventHandler.remove(document, MOUSE_TOUCH_EVENT, this.documentHandler);
        if (Browser.isDevice && this.options.allowEdit && !this.options.readonly) {
            this.element.removeAttribute('readonly');
        }
    }
    private documentHandler(e: MouseEvent): void {
        if ((!isNullOrUndefined(this.popupObj) && (this.wrapperElement.contains(<HTMLElement>e.target) ||
            (this.popupObj.element && this.popupObj.element.contains(<HTMLElement>e.target)))) && e.type !== 'touchstart') {
            e.preventDefault();
        }
        let dateValue: string = this.options.value ? this.options.value.toString() : null;
        let target: HTMLElement = <HTMLElement>e.target;
        if (!(closest(target, '.' + ROOT + '.' + POPUPWRAPPER))
            && !(closest(target, '.' + INPUTCONTAINER) === this.wrapperElement)
            && (!target.classList.contains(DAY))) {
            this.dotNetRef.invokeMethodAsync(HIDE_POPUP, e);
            this.element.focus();
        } else if (closest(target, '.' + ROOT + '.' + POPUPWRAPPER)) {
            if (target.classList.contains(DAY)
                && !isNullOrUndefined((e.target as HTMLElement).parentElement)
                && (e.target as HTMLElement).parentElement.classList.contains(SELECTED)
                && closest(target, '.' + CONENT)
                && closest(target, '.' + CONENT).classList.contains('e-' + this.options.depth.toLowerCase())) {
                this.dotNetRef.invokeMethodAsync(HIDE_POPUP, e);
            } else if (closest(target, '.' + FOOTER_CONTAINER)
                && target.classList.contains(TODAY)
                && target.classList.contains(BTN)
                && (+new Date(dateValue) === +this.generateTodayVal(new Date(dateValue)))) {
                this.dotNetRef.invokeMethodAsync(HIDE_POPUP, e);
            }
        }
    }
    private generateTodayVal(value: Date): Date {
        let tempValue: Date = new Date();
        if (value) {
            tempValue.setHours(value.getHours());
            tempValue.setMinutes(value.getMinutes());
            tempValue.setSeconds(value.getSeconds());
            tempValue.setMilliseconds(value.getMilliseconds());
        } else {
            tempValue = new Date(tempValue.getFullYear(), tempValue.getMonth(), tempValue.getDate(), 0, 0, 0, 0);
        }
        return tempValue;
    }
    private isCalendar(): boolean {
        return this.popupWrapper && this.popupWrapper.classList.contains('' + POPUPWRAPPER);
    }
    private CalendarKeyActionHandle(e: KeyboardEventArgs): void {
        switch (e.action) {
            case this.defaultKeyConfigs.escape:
                if (this.isCalendar()) {
                    this.dotNetRef.invokeMethodAsync(HIDE_POPUP, e);
                } else {
                    this.element.blur();
                }
                break;
            case this.defaultKeyConfigs.enter:
                if (!this.isCalendar()) {
                    this.dotNetRef.invokeMethodAsync(SHOW_POPUP, e);
                }
                break;
            case this.defaultKeyConfigs.tab:
                this.dotNetRef.invokeMethodAsync(HIDE_POPUP, e);
        }
    }
}
// tslint:disable
let DatePicker: object = {
    initialize(wrapperElement: HTMLElement, element: BlazorDatePickerElement,
        dotnetRef: BlazorDotnetObject, options: IDatePickerOptions): void {
        new SfDatePicker(wrapperElement, element, dotnetRef, options);
        element.blazor__instance.initialize();
    },
    renderPopup(element: BlazorDatePickerElement, popupElement: HTMLElement, popupHolderEle: HTMLElement,
        openEventArgs: PopupObjectArgs, options: IDatePickerOptions) {
        if (popupElement && popupHolderEle) {
            element.blazor__instance.renderPopup(popupElement, popupHolderEle, openEventArgs, options);
        }
    },
    // tslint:disable
    closePopup(element: BlazorDatePickerElement, popupElement: HTMLElement, popupHolderEle: HTMLElement,
        closeEventArgs: PopupObjectArgs, options: IDatePickerOptions) {
        element.blazor__instance.closePopup(closeEventArgs, options);
    },
    focusIn(inputEle: HTMLElement): void {
        inputEle.focus();
    },
    focusOut(inputEle: HTMLElement): void {
        inputEle.blur();
    }
};
interface BlazorDatePickerElement extends HTMLElement {
    blazor__instance: SfDatePicker;
}
export interface PopupObjectArgs {
    cancel?: boolean;
    event?: MouseEvent | KeyboardEvent | Event;
    appendTo?: string;
}
interface IDatePickerOptions {
    readonly: boolean;
    enabled: boolean;
    locale: string;
    enableRtl: boolean;
    zIndex: number;
    keyConfigs: { [key: string]: string }
    showClearButton: boolean;
    value: Date,
    allowEdit: boolean;
    depth: string;
}
export default DatePicker;
