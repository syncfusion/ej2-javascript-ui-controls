import { BlazorDotnetObject, Browser, closest, EventHandler, isNullOrUndefined, } from '@syncfusion/ej2-base';
import { removeClass, KeyboardEventArgs, addClass, prepend, remove, isUndefined, KeyboardEvents } from '@syncfusion/ej2-base';
import { Popup } from '@syncfusion/ej2-popups';

const POPUPDIMENSION: string = '240px';
const HALFPOSITION: number = 2;
const POPUP: string = 'e-popup';
const OVERFLOW: string = 'e-range-overflow';
const FOOTER_CONTAINER: string = 'e-footer-container';
const INPUT_HANDLER: string = 'InputKeyActionHandle';
const LEFTCALENDER: string = 'e-left-calendar';
const RIGHTCALENDER: string = 'e-right-calendar';
const CALENDAR: string = 'e-calendar';
const NEXTICON: string = 'e-next';
const PREVICON: string = 'e-prev';
const HEADER: string = 'e-header';
const TITLE: string = 'e-title';
const ICONCONTAINER: string = 'e-icon-container';
const TBODY: string = 'tbody';
const TABLE: string = 'table';
const HIDE_POPUP: string = 'HidePopup';
const CLOSE_POPUP: string = 'ClosePopup';
const MOUSE_TOUCH_EVENT: string = 'mousedown touchstart';
const SELECTED: string = 'e-selected';
const OFFSETVALUE: number = 4;
const INPUTCONTAINER: string = 'e-input-group';
const INPUTFOCUS: string = 'e-input-focus';
const FOCUS_DATE: string = 'e-focused-date';
const RANGECONTAINER: string = 'e-date-range-container';
const PRESETS: string = 'e-presets';

class SfDateRangePicker {
    public element: BlazorDateRangePickerElement | HTMLInputElement;
    public dotNetRef: BlazorDotnetObject;
    public options: IDateRangePickerOptions;
    public isDisposed: boolean;
    private containerElement: HTMLElement;
    private popupContainer: HTMLElement;
    private calendarElement: HTMLElement;
    private tableElement: HTMLElement;
    private popupObj: Popup;
    private modal: HTMLElement;
    private popupHolder: HTMLElement;
    private defaultKeyConfigs: { [key: string]: string };
    private mobilePopupContainer: HTMLElement;
    private leftCalPrevIcon: HTMLElement;
    private leftCalNextIcon: HTMLElement;
    private deviceCalPrevIcon: HTMLElement;
    private deviceCalNextIcon: HTMLElement;
    private leftTitle: HTMLElement;
    private rightTitle: HTMLElement;
    private rightCalPrevIcon: HTMLElement;
    private rightCalNextIcon: HTMLElement;
    private isMobile: boolean;
    private leftCalendar: HTMLElement;
    private rightCalendar: HTMLElement;
    constructor(
        containerElement: HTMLElement,
        element: BlazorDateRangePickerElement, dotnetRef: BlazorDotnetObject, options: IDateRangePickerOptions) {
        this.containerElement = containerElement;
        this.element = element;
        this.options = options;
        this.element.blazor__instance = this;
        this.dotNetRef = dotnetRef;
    }
    // tslint:disable
    public initialize(): void {
         this.isMobile = window.matchMedia('(max-width:550px)').matches;
         this.defaultKeyConfigs = {
            altUpArrow: 'alt+uparrow',
            altDownArrow: 'alt+downarrow',
            altRightArrow: 'alt+rightarrow',
            altLeftArrow: 'alt+leftarrow',
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
            shiftTab: 'shift+tab'
        };
        new KeyboardEvents(
            <HTMLElement>this.element,
            { eventName: 'keydown', keyAction: this.keyInputHandler.bind(this), keyConfigs: this.defaultKeyConfigs }
        );
    }
    private keyInputHandler(e: KeyboardEventArgs): void {
        let keyEventsArgs;

              if (this.popupObj && this.popupObj.element.classList.contains(POPUP)) {
                  let ele: Element = closest((e as any).target, '.' + RIGHTCALENDER);
                  ele = isNullOrUndefined(ele) ? this.tableElement.querySelector('.' + LEFTCALENDER) : ele;
                  let isLeftCalendar: boolean = ele.classList.contains(LEFTCALENDER);
                  let focusedDate: HTMLElement = this.tableElement.querySelector('tr td.' + FOCUS_DATE);
                  let selectedDates: HTMLElement[] =  <HTMLElement[] & NodeListOf<Element>>this.tableElement.querySelectorAll('tr td.' + SELECTED);
                  let selectedDate: HTMLElement = selectedDates[selectedDates.length - 1];
                  let tableBodyEle: Element = focusedDate && closest(focusedDate, TBODY) || selectedDate && closest(selectedDate, TBODY);
                  if (!isLeftCalendar && this.leftCalendar.querySelectorAll('tr td.' + FOCUS_DATE).length > 0) {
                      removeClass(this.leftCalendar.querySelectorAll('tr td.' + FOCUS_DATE), FOCUS_DATE);
                  }
                  tableBodyEle && (tableBodyEle as HTMLElement).focus();
                  keyEventsArgs = {
                      Action: e.action,
                      Key: e.key,
                      Events: e,
                      SelectDate: selectedDate ? selectedDate.id : null,
                      FocusedDate: focusedDate ? focusedDate.id : null,
                      classList: selectedDate ? selectedDate.classList.toString() :
                      focusedDate ? focusedDate.classList.toString() : 'e-cell',
                      Id: focusedDate ? focusedDate.id : selectedDate ? selectedDate.id : null,
                      TargetClassList: this.calendarElement.classList.toString(),
                      IsLeftCalendar: isLeftCalendar

                  };
              } else {
                  keyEventsArgs = {
                      Action: e.action,
                      Key: e.key,
                      Events: e
                  };
              }

              if(!this.isDisposed) {
                this.dotNetRef.invokeMethodAsync(INPUT_HANDLER, keyEventsArgs);
              }

              if (e.action !== 'select' && this.popupObj && document.body.contains(this.popupObj.element)) {
                  e.preventDefault();
              }
    }
    public renderPopup(popupElement: HTMLElement, popupHolderEle: HTMLElement, openEventArgs: PopupObjectArgs, options: IDateRangePickerOptions): void {
        this.options = options;
        this.popupHolder = popupHolderEle;
        this.createCalendar(popupElement, options);
        if (Browser.isDevice) {
            this.mobilePopupContainer = this.popupHolder.querySelector('.e-daterangepick-mob-popup-wrap');
            document.body.appendChild(this.mobilePopupContainer);
        }
        let appendToElement: HTMLElement = openEventArgs.appendTo === 'model' && this.mobilePopupContainer ? this.mobilePopupContainer
            : document.body;
        appendToElement.appendChild(this.popupContainer);
        this.presetHeight();
        if (this.options.zIndex === 1000) {
            this.popupObj.show(null, this.element);
        } else {
            this.popupObj.show(null, null);
        }
        this.setOverlayIndex(this.mobilePopupContainer, this.popupObj.element, this.modal, Browser.isDevice);       
        if (Browser.isDevice) {
            document.body.className += ' ' + OVERFLOW;
            this.popupHolder.style.display = 'block';
            this.popupHolder.style.visibility = 'visible';
        }
        EventHandler.add(document, MOUSE_TOUCH_EVENT, this.documentHandler, this);
    }
    protected setOverlayIndex(popupContainer: HTMLElement, popupElement: HTMLElement, modal: HTMLElement, isDevice: Boolean): void {
        if (isDevice && !isNullOrUndefined(popupElement) && !isNullOrUndefined(modal) && !isNullOrUndefined(popupContainer)) {
            let index: number = parseInt(popupElement.style.zIndex, 10) ? parseInt(popupElement.style.zIndex, 10) : 1000;
            modal.style.zIndex = (index - 1).toString();
            popupContainer.style.zIndex = index.toString();
        }
    }
    public closePopup(closeEventArgs: PopupObjectArgs, options: IDateRangePickerOptions): void {
        this.options = options;
        this.closeEventCallback(closeEventArgs);
    }
    public refreshPopup(): void {
        if (this.isPopupOpen()) {
            this.popupObj.refreshPosition();
        }
    }
    private createCalendar(popupElement: HTMLElement, options: IDateRangePickerOptions): void {
        this.popupContainer = popupElement;
        if(options.isCustomWindow) {
            this.calendarElement = this.popupContainer.firstElementChild as HTMLElement;
            this.tableElement = this.calendarElement;
            this.calendarElement.querySelector(TABLE + ' ' + TBODY).className = '';
        }
        let popupWidth: number = this.popupContainer.getBoundingClientRect().width;
        if (Browser.isDevice) {
            this.modal = this.popupHolder.querySelector('.e-range-modal');
            this.modal.style.display = 'block';
            document.body.appendChild(this.modal);
        }
        if(options.isCustomWindow) {
            if (Browser.isDevice) {
                this.deviceCalPrevIcon = <HTMLElement>this.calendarElement.querySelector('.' + CALENDAR + ' .' + PREVICON);
                this.deviceCalNextIcon = <HTMLElement>this.calendarElement.querySelector('.' + CALENDAR + ' .' + NEXTICON);
                if(this.calendarElement.querySelector('.' + CALENDAR + ' .' + ICONCONTAINER)){
                    remove(this.calendarElement.querySelector('.' + CALENDAR + ' .' + ICONCONTAINER));
                }
                this.calendarElement.querySelector('table').setAttribute('tabindex', '-1');
                this.calendarElement.querySelector('.' + CALENDAR + ' .' + HEADER).appendChild(this.deviceCalNextIcon);
                this.calendarElement.querySelector('.' + CALENDAR + ' .' + HEADER).appendChild(this.deviceCalPrevIcon);
                prepend([this.deviceCalPrevIcon], this.calendarElement.querySelector('.' + CALENDAR + ' .' + HEADER));
                if(this.calendarElement.querySelector('.' + CALENDAR + ' .' + FOOTER_CONTAINER))
                {
                    remove(this.calendarElement.querySelector('.' + CALENDAR + ' .' + FOOTER_CONTAINER));
                }
            }
            else
            {
                this.leftCalPrevIcon = <HTMLElement>this.calendarElement.querySelector('.' + LEFTCALENDER + ' .' + PREVICON);
                this.leftCalNextIcon = <HTMLElement>this.calendarElement.querySelector('.' + LEFTCALENDER + ' .' + NEXTICON);
                this.leftTitle = <HTMLElement>this.calendarElement.querySelector('.' + LEFTCALENDER + ' .' + TITLE);
                if(this.calendarElement.querySelector('.' + LEFTCALENDER + ' .' + ICONCONTAINER)){
                    remove(this.calendarElement.querySelector('.' + LEFTCALENDER + ' .' + ICONCONTAINER));
                }
                this.calendarElement.querySelector('.' + LEFTCALENDER + ' .' + HEADER).appendChild(this.leftCalNextIcon);
                this.calendarElement.querySelector('.' + LEFTCALENDER + ' .' + HEADER).appendChild(this.leftCalPrevIcon);
                prepend([this.leftCalPrevIcon], this.calendarElement.querySelector('.' + LEFTCALENDER + ' .' + HEADER));
                this.rightCalPrevIcon = <HTMLElement>this.calendarElement.querySelector('.' + RIGHTCALENDER + ' .' + PREVICON);
                this.rightCalNextIcon = <HTMLElement>this.calendarElement.querySelector('.' + RIGHTCALENDER + ' .' + NEXTICON);
                this.rightTitle = <HTMLElement>this.calendarElement.querySelector('.' + RIGHTCALENDER + ' .' + TITLE);
                if(this.calendarElement.querySelector('.' + RIGHTCALENDER + ' .' + ICONCONTAINER)){
                    remove(this.calendarElement.querySelector('.' + RIGHTCALENDER + ' .' + ICONCONTAINER));
                }
                this.calendarElement.querySelector('table').setAttribute('tabindex', '-1');
                this.calendarElement.querySelector('.' + RIGHTCALENDER + ' .' + HEADER).appendChild(this.rightCalNextIcon);
                this.calendarElement.querySelector('.' + RIGHTCALENDER + ' .' + HEADER).appendChild(this.rightCalPrevIcon);
                prepend([this.rightCalPrevIcon], this.calendarElement.querySelector('.' + RIGHTCALENDER + ' .' + HEADER));
                if(this.calendarElement.querySelector('.' + LEFTCALENDER + ' .' + FOOTER_CONTAINER))
                {
                    remove(this.calendarElement.querySelector('.' + LEFTCALENDER + ' .' + FOOTER_CONTAINER));
                }
                if(this.calendarElement.querySelector('.' + RIGHTCALENDER + ' .' + FOOTER_CONTAINER)){
                    remove(this.calendarElement.querySelector('.' + RIGHTCALENDER + ' .' + FOOTER_CONTAINER));
                }
            }
        }
        this.popupObj = new Popup(this.popupContainer as HTMLElement, {
            relateTo: this.isMobile ? document.body : this.containerElement,
            position: (this.isMobile ?
                (!isUndefined(options.presets && options.presets[0] && options.presets[0].start && options.presets[0].end && options.presets[0].label) ?
                    { X: 'left', Y: 'bottom' } : { X: 'center', Y: 'center' }) :
                    options.enableRtl ? { X: 'left', Y: 'bottom' } : { X: 'right', Y: 'bottom' }),
            offsetX: this.isMobile || options.enableRtl ? 0 : -popupWidth,
            offsetY: OFFSETVALUE,
            collision: this.isMobile ?
                (!isUndefined(options.presets && options.presets[0] && options.presets[0].start && options.presets[0].end && options.presets[0].label) ?
                    { X: 'fit' } : { X: 'fit', Y: 'fit' }) : { X: 'fit', Y: 'flip' },
            targetType: this.isMobile ? 'container' : 'relative',
            enableRtl: options.enableRtl,
            zIndex: options.zIndex,
            open: () => {
                this.leftCalendar = this.calendarElement.querySelector('.' + LEFTCALENDER);
                this.rightCalendar = this.calendarElement.querySelector('.' + RIGHTCALENDER);
                if (!this.isMobile) {
                    //this.defaultKeyConfigs = sf.base.extend(this.defaultKeyConfigs, this.keyConfigs);
                    new KeyboardEvents(this.leftCalendar, {
                        eventName: 'keydown',
                        keyAction: this.keyInputHandler.bind(this),
                        keyConfigs: this.defaultKeyConfigs
                    });
                    new KeyboardEvents(this.rightCalendar, {
                        eventName: 'keydown',
                        keyAction: this.keyInputHandler.bind(this),
                        keyConfigs: this.defaultKeyConfigs
                    });
                    let cancelBtnEle: HTMLElement = this.popupContainer.querySelector('.e-cancel.e-btn');
                    let applyBtnEle: HTMLElement = this.popupContainer.querySelector('.e-apply.e-btn');
                    new KeyboardEvents(cancelBtnEle,
                        {
                            eventName: 'keydown',
                            keyAction: this.keyInputHandler.bind(this),
                            keyConfigs: { tab: 'tab', altRightArrow: 'alt+rightarrow', altLeftArrow: 'alt+leftarrow' }
                        });
                    new KeyboardEvents(applyBtnEle,
                        {
                            eventName: 'keydown',
                            keyAction: this.keyInputHandler.bind(this),
                            keyConfigs: { altRightArrow: 'alt+rightarrow', altLeftArrow: 'alt+leftarrow' }
                        });
                    this.leftCalendar.querySelector('table').focus();
                }
            }, close: () => {
                this.popupHolder.appendChild(this.popupContainer);
                if (this.popupObj) {
                    this.popupObj.destroy();
                }
                if(!this.isDisposed) {
                    this.dotNetRef.invokeMethodAsync(CLOSE_POPUP);
                }
                this.popupObj = null;
            }, targetExitViewport: () => {
                if (!Browser.isDevice && !this.isDisposed) { this.dotNetRef.invokeMethodAsync(HIDE_POPUP, null); }
            }
        });
    }
    private closeEventCallback(eventArgs: PopupObjectArgs): void {
        let preventArgs: PopupObjectArgs = eventArgs;
        if (!preventArgs.cancel && this.popupObj) {
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
    }
    private documentHandler(e: MouseEvent): void {
        if (isNullOrUndefined(this.popupObj)) {
            return;
        }
        let target: HTMLElement = <HTMLElement>e.target;
        if (!this.containerElement.contains(target) ||
            (!isNullOrUndefined(this.popupObj) && !closest(target, '.e-daterangepicker.e-popup'))) {
            if (e.type !== 'touchstart' && e.type === 'mousedown') {
                e.preventDefault();
            }
        }
        if (!(closest(target, '.e-daterangepicker.e-popup'))
            && !(closest(target, '.' + INPUTCONTAINER) === this.containerElement)
            && !(closest(target, '.e-daterangepicker.e-popup') && (!target.classList.contains('e-day')))) {
            if (this.isPopupOpen() && document.body.contains(this.popupObj.element)) {
                this.applyFunction(e);
            }
        } 
    }
    private applyFunction(eve?: MouseEvent): void {
        let isValueChanged: boolean = false;
        if (eve.type !== 'touchstart') {
            eve.preventDefault();
        }
        if (document.activeElement !== this.element) {
            this.element.focus();
            addClass([this.containerElement], [INPUTFOCUS]);
        }
        this.dotNetRef.invokeMethodAsync(HIDE_POPUP, null);
        if (!(closest(eve.target as HTMLElement, '.' + INPUTCONTAINER))
        && (!isValueChanged)) {
            if (document.activeElement === this.element) {
                removeClass([this.containerElement], [INPUTFOCUS]);
                this.element.blur();
            }
        }
    }
    private presetHeight(): void {
        let presets: HTMLElement = this.popupObj && <HTMLElement>this.popupObj.element.querySelector('.' + PRESETS);
        let rangeContainer: HTMLElement = this.popupObj && <HTMLElement>this.popupObj.element.querySelector('.' + RANGECONTAINER);
        if (!isNullOrUndefined(presets) && !isNullOrUndefined(rangeContainer)) {
            presets.style.height = rangeContainer.getBoundingClientRect().height + 'px';
        }
    }
    private getPopupHeight(): number {
        let height: number = parseInt(<string>POPUPDIMENSION, 10);
        let popupHeight: number = this.popupContainer.getBoundingClientRect().height;
        return popupHeight > height ? height : popupHeight;
    }
    public setScrollPosition(): void {
        if (!isNullOrUndefined(this.popupContainer.querySelector('.e-active')) && (this.options.presets)) {
            let selectElement: HTMLElement = this.popupContainer.querySelector('.e-active');
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
    private isPopupOpen(): boolean {
        if (!isNullOrUndefined(this.popupObj) && this.popupObj.element.classList.contains(POPUP)) {
            return true;
        }
        return false;
    }
    public removeFocusDate(popupElement: HTMLElement, cellId: string): void {
        let focusedDates: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>popupElement.querySelectorAll('tr td.e-focused-date');
        if (focusedDates.length > 0) {
            removeClass(focusedDates, FOCUS_DATE);
        }
        var focusedDate = popupElement.querySelectorAll('tr td')
        for (var i = 0; i < focusedDate.length; i++) {
            if (focusedDate[i].getAttribute('id').split('_')[0] == cellId) {
                removeClass(focusedDate, FOCUS_DATE);
                addClass([focusedDate[i]], FOCUS_DATE);
                (closest(focusedDate[i], 'table') as HTMLElement).focus();
            }
        }
    }
}
// tslint:disable
let DateRangePicker: object = {
    initialize(containerElement: HTMLElement, element: BlazorDateRangePickerElement,
        dotnetRef: BlazorDotnetObject, options: IDateRangePickerOptions): void {
        if (element) { new SfDateRangePicker(containerElement, element, dotnetRef, options); }
        if (element && element.blazor__instance) {
            element.blazor__instance.initialize();
        }
    },
    renderPopup(element: BlazorDateRangePickerElement, popupElement: HTMLElement, popupHolderEle: HTMLElement,
        openEventArgs: PopupObjectArgs, options: IDateRangePickerOptions) {
        if (element && element.blazor__instance && popupElement && popupHolderEle) {
            element.blazor__instance.renderPopup(popupElement, popupHolderEle, openEventArgs, options);
        }
    },
    updateScrollPosition(element: BlazorDateRangePickerElement)
    {
        if (element && element.blazor__instance) {
            element.blazor__instance.setScrollPosition();
        }
    },
    removeFocusDate(element: BlazorDateRangePickerElement, popupElement: HTMLElement, cellId: string) {
        if (element && element.blazor__instance && popupElement) {
            element.blazor__instance.removeFocusDate(popupElement, cellId);
        }
    },
    // tslint:disable
    closePopup(element: BlazorDateRangePickerElement, popupElement: HTMLElement, popupHolderEle: HTMLElement,
        closeEventArgs: PopupObjectArgs, options: IDateRangePickerOptions) {
        if (element && element.blazor__instance) {
            element.blazor__instance.closePopup(closeEventArgs, options);
        }
    },
    refreshPopup(element: BlazorDateRangePickerElement) {
        if (element && element.blazor__instance) {
            element.blazor__instance.refreshPopup();
        }
    },
    focusIn(inputEle: HTMLElement): void {
        if (inputEle) { inputEle.focus(); }
    },
    focusOut(inputEle: HTMLElement): void {
        if (inputEle) { inputEle.blur(); }
    },
    destroy(element: BlazorDateRangePickerElement, popupElement: HTMLElement, popupHolderEle: HTMLElement, closeEventArgs: PopupObjectArgs, options: IDateRangePickerOptions) {
        if (element && element.blazor__instance && popupElement && popupElement instanceof HTMLElement && popupHolderEle) {
            element.blazor__instance.isDisposed = true;
            element.blazor__instance.closePopup(closeEventArgs, options);
        }
    }

};
interface BlazorDateRangePickerElement extends HTMLElement {
    blazor__instance: SfDateRangePicker;
}
export interface PopupObjectArgs {
    cancel?: boolean;
    event?: MouseEvent | KeyboardEvent | Event;
    appendTo?: string;
}
interface IDateRangePickerOptions {
    enableRtl: boolean;
    zIndex: number;
    presets: PresetsModel[];
    isCustomWindow: boolean;
}
/**
 * Interface for a class Presets
 */
interface PresetsModel {

    /**
     * Defines the label string of the preset range. 
     */
    label?: string;

    /**
     * Defines the start date of the preset range.
     */
    start?: Date;

    /**
     * Defines the end date of the preset range 
     */
    end?: Date;

}
export default DateRangePicker;
