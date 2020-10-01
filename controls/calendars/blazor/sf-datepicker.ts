import { BlazorDotnetObject, Browser, Animation, closest, EventHandler, isNullOrUndefined, } from '@syncfusion/ej2-base';
import { select, createElement, extend, KeyboardEvents, KeyboardEventArgs, removeClass, formatUnit } from '@syncfusion/ej2-base';
import { Popup } from '@syncfusion/ej2-popups';
const ROOT: string = 'e-datepicker';
const POPUPDIMENSION: string = '240px';
const HALFPOSITION: number = 2;
const POPUP_CONTAINER: string = 'e-popup-wrapper';
const POPUP: string = 'e-popup';
const OVERFLOW: string = 'e-date-overflow';
const TIME_OVERFLOW: string = 'e-time-overflow';
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
    private containerElement: HTMLElement;
    private popupContainer: HTMLElement;
    private calendarElement: HTMLElement;
    private tableBodyElement: HTMLElement;
    private popupObj: Popup;
    private modal: HTMLElement;
    private popupHolder: HTMLElement;
    private defaultKeyConfigs: { [key: string]: string };
    private index: number;
    private mobilePopupContainer: HTMLElement;
    public dotNetRef: BlazorDotnetObject;
    public options: IDatePickerOptions;
    constructor(
        containerElement: HTMLElement,
        element: BlazorDatePickerElement, dotnetRef: BlazorDotnetObject, options: IDatePickerOptions) {
        this.containerElement = containerElement;
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
        if (this.popupObj && this.popupObj.element.classList.contains(POPUP) && this.options.isDatePopup) {
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
        if (Browser.isDevice && options.isDatePopup) {
            this.mobilePopupContainer = createElement('div', { className: 'e-datepick-mob-popup-wrap' });
            document.body.appendChild(this.mobilePopupContainer);
        }
        let appendToElement: HTMLElement = openEventArgs.appendTo === 'model' && this.mobilePopupContainer ? this.mobilePopupContainer
            : document.body;
        appendToElement.appendChild(this.popupContainer);
        this.popupObj.refreshPosition(this.element);
        if (!options.isDatePopup) {
            this.setScrollPosition();
        }
        let openAnimation: object = {
            name: 'FadeIn',
            duration: Browser.isDevice ? 0 : OPENDURATION,
        };
        if (this.options.zIndex === 1000) {
            this.popupObj.show(new Animation(openAnimation), this.element);
        } else {
            this.popupObj.show(new Animation(openAnimation), null);
        }
        this.setOverlayIndex(this.mobilePopupContainer, this.popupObj.element, this.modal, Browser.isDevice);
        EventHandler.add(document, MOUSE_TOUCH_EVENT, this.documentHandler, this);
    }
    protected setOverlayIndex(popupContainer: HTMLElement, popupElement: HTMLElement, modal: HTMLElement, isDevice: Boolean): void {
        if (isDevice && !isNullOrUndefined(popupElement) && !isNullOrUndefined(modal) && !isNullOrUndefined(popupContainer)) {
            let index: number = parseInt(popupElement.style.zIndex, 10) ? parseInt(popupElement.style.zIndex, 10) : 1000;
            modal.style.zIndex = (index - 1).toString();
            popupContainer.style.zIndex = index.toString();
        }
    }
    public closePopup(closeEventArgs: PopupObjectArgs, options: IDatePickerOptions): void {
        this.options = options;
        this.closeEventCallback(closeEventArgs);
    }
    private createCalendar(popupElement: HTMLElement, options: IDatePickerOptions): void {
        this.popupContainer = popupElement;
        this.calendarElement = this.popupContainer.firstElementChild as HTMLElement;
        this.tableBodyElement = select(TBODY, this.calendarElement) as HTMLElement;
        let modelClassName: string = '' + ROOT + ' e-date-modal';
        let modelOverflow: string = ' ' + OVERFLOW;
        if (!options.isDatePopup) {
            modelClassName = 'e-datetimepicker e-time-modal';
            modelOverflow = TIME_OVERFLOW;
        } else {
			this.calendarElement.querySelector(TABLE + ' ' + TBODY).className = '';
		}
        if (Browser.isDevice) {
            this.modal = createElement('div');
            this.modal.className = modelClassName;
            document.body.className += modelOverflow;
            this.modal.style.display = 'block';
            document.body.appendChild(this.modal);
        }
        this.popupObj = new Popup(this.popupContainer as HTMLElement, {
            width: options.isDatePopup ? 'auto' : this.setPopupWidth(this.options.width),
            relateTo: Browser.isDevice ? document.body : this.containerElement,
            position: Browser.isDevice ? { X: 'center', Y: 'center' } : { X: 'left', Y: 'bottom' },
            offsetY: OFFSETVALUE,
            targetType: 'container',
            enableRtl: options.enableRtl,
            zIndex: options.zIndex,
            collision: Browser.isDevice ? { X: 'fit', Y: 'fit' } : { X: 'flip', Y: 'flip' },
            open: () => {
                if (document.activeElement !== this.element as HTMLElement && options.isDatePopup) {
                    this.defaultKeyConfigs = extend(this.defaultKeyConfigs, options.keyConfigs) as { [key: string]: string };
                    (<HTMLElement>this.calendarElement.children[1].firstElementChild).focus();
                    new KeyboardEvents(<HTMLElement>this.calendarElement.children[1].firstElementChild,
                        {
                            eventName: 'keydown',
                            keyAction: this.CalendarKeyActionHandle.bind(this),
                            keyConfigs: this.defaultKeyConfigs
                        });
                    new KeyboardEvents(<HTMLElement>this.containerElement.children[this.index],
                        {
                            eventName: 'keydown',
                            keyAction: this.CalendarKeyActionHandle.bind(this),
                            keyConfigs: this.defaultKeyConfigs
                        });
                }
            }, close: () => {
                this.popupHolder.appendChild(this.popupContainer);
                if (this.popupObj) {
                    this.popupObj.destroy();
                }
                this.dotNetRef.invokeMethodAsync(CLOSE_POPUP);
                this.popupObj = null;
            }, targetExitViewport: () => {
                if (!Browser.isDevice) { this.dotNetRef.invokeMethodAsync(HIDE_POPUP, null); }
            }
        });
        if (!options.isDatePopup) {
            this.popupObj.element.style.maxHeight = POPUPDIMENSION;
        }
    }
    private getPopupHeight(): number {
        let height: number = parseInt(<string>POPUPDIMENSION, 10);
        let popupHeight: number = this.popupContainer.getBoundingClientRect().height;
        return popupHeight > height ? height : popupHeight;
    }
    public setScrollPosition(): void {
        if ((this.popupContainer && this.popupContainer.querySelector('.e-navigation') || this.popupContainer.querySelector('.e-active'))
            && !this.options.isDatePopup) {
            let selectElement: HTMLElement = this.popupContainer.querySelector('.e-navigation') || this.popupContainer.querySelector('.e-active');
            this.findScrollTop(selectElement);
        }
    }
    private findScrollTop(element: HTMLElement): void {
        let listHeight: number = this.getPopupHeight();
        let nextEle: Element = element.nextElementSibling;
        let height: number = nextEle ? (<HTMLElement>nextEle).offsetTop : element.offsetTop;
        let liHeight: number = element.getBoundingClientRect().height;
        if ((height + element.offsetTop) > listHeight) {
            this.popupContainer.scrollTop = nextEle ? (height - (listHeight / HALFPOSITION + liHeight / HALFPOSITION)) : height;
        } else {
            this.popupContainer.scrollTop = 0;
        }
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
            removeClass([document.body], OVERFLOW);
            if (!isNullOrUndefined(this.mobilePopupContainer)) {
                this.mobilePopupContainer.remove();
                this.mobilePopupContainer = null;
            }
        }
        EventHandler.remove(document, MOUSE_TOUCH_EVENT, this.documentHandler);
        if (Browser.isDevice && this.options.allowEdit && !this.options.readonly) {
            this.element.removeAttribute('readonly');
        }
    }
    private documentHandler(e: MouseEvent): void {
        if ((!isNullOrUndefined(this.popupObj) && (this.containerElement.contains(<HTMLElement>e.target) ||
            (this.popupObj.element && this.popupObj.element.contains(<HTMLElement>e.target)))) && e.type !== 'touchstart') {
            e.preventDefault();
        }
        let dateValue: string = this.options.value ? this.options.value.toString() : null;
        let target: HTMLElement = <HTMLElement>e.target;
        if (!(closest(target, '.' + ROOT + '.' + POPUP_CONTAINER))
            && !closest(target, '.' + 'e-datetimepicker' + '.' + POPUP_CONTAINER)
            && !(closest(target, '.' + INPUTCONTAINER) === this.containerElement)
            && (!target.classList.contains(DAY))) {
            this.dotNetRef.invokeMethodAsync(HIDE_POPUP, e);
            this.element.focus();
        } else if (closest(target, '.' + ROOT + '.' + POPUP_CONTAINER)) {
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
        return this.popupContainer && this.popupContainer.classList.contains('' + POPUP_CONTAINER);
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
    private setWidth(width: number | string): string {
        if (typeof width === 'number') {
            width = formatUnit(width);
        } else if (typeof width === 'string') {
            width = (width.match(/px|%|em/)) ? width : formatUnit(width);
        } else {
            width = '100%';
        }
        return width as string;
    }
    private setPopupWidth(width: string | number): string {
        width = this.setWidth(width);
        if (width.indexOf('%') > -1) {
            let containerStyle: ClientRect = this.containerElement.getBoundingClientRect()
            let inputWidth: number = containerStyle.width * parseFloat(width) / 100;
            width = inputWidth.toString() + 'px';
        }
        return width;
    }
}
// tslint:disable
let DatePicker: object = {
    initialize(containerElement: HTMLElement, element: BlazorDatePickerElement,
        dotnetRef: BlazorDotnetObject, options: IDatePickerOptions): void {
        if (element) { new SfDatePicker(containerElement, element, dotnetRef, options); }
        if (element && element.blazor__instance) {
            element.blazor__instance.initialize();
        }
    },
    renderPopup(element: BlazorDatePickerElement, popupElement: HTMLElement, popupHolderEle: HTMLElement,
        openEventArgs: PopupObjectArgs, options: IDatePickerOptions) {
        if (element && element.blazor__instance && popupElement && popupHolderEle) {
            element.blazor__instance.renderPopup(popupElement, popupHolderEle, openEventArgs, options);
        }
    },
    updateScrollPosition(element: BlazorDatePickerElement)
    {
        if (element && element.blazor__instance) {
            element.blazor__instance.setScrollPosition();
        }
    },
    // tslint:disable
    closePopup(element: BlazorDatePickerElement, popupElement: HTMLElement, popupHolderEle: HTMLElement,
        closeEventArgs: PopupObjectArgs, options: IDatePickerOptions) {
        if (element && element.blazor__instance) {
            element.blazor__instance.closePopup(closeEventArgs, options);
        }
    },
    focusIn(inputEle: HTMLElement): void {
        if (inputEle) { inputEle.focus(); }
    },
    focusOut(inputEle: HTMLElement): void {
        if (inputEle) { inputEle.blur(); }
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
    width: string;
    isDatePopup: boolean;
}
export default DatePicker;
