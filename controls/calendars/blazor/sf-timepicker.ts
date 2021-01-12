import { BlazorDotnetObject, Browser, Animation, select, KeyboardEvents, KeyboardEventArgs, extend } from '@syncfusion/ej2-base';
import { formatUnit, closest, EventHandler, isNullOrUndefined, addClass, createElement, removeClass } from '@syncfusion/ej2-base';
import { Popup } from '@syncfusion/ej2-popups';

const ROOT: string = 'e-timepicker';
const POPUPDIMENSION: string = '240px';
const POPUPWRAPPER: string = 'e-popup-wrapper';
const OVERFLOW: string = 'e-time-overflow';
const LISTCLASS: string = 'e-list-item';
const SELECTED: string = 'e-active';
const HOVER: string = 'e-hover';
const NAVIGATION: string = 'e-navigation';
const DISABLED: string = 'e-disabled';
const POPUP_CONTENT: string = 'e-content';
const MODEL_POPUP: string = 'e-timepicker-mob-popup-wrap';
const ARIA_SELECT: string = 'aria-selected';
const LIST_CLICK: string = 'OnListItemClick';
const HIDE_POPUP: string = 'HidePopup';
const TIME_MODAL: string = 'e-time-modal';
const RIGHT: string = 'right';
const LEFT: string = 'left';
const TAB: string = 'tab';
const ENTER: string = 'enter';
const SELECT: string = 'select';
const CLOSE_POPUP: string = 'ClosePopup';
const OFFSETVALUE: number = 4;
const OPENDURATION: number = 300;
const HALFPOSITION: number = 2;
const ANIMATIONDURATION: number = 50;
const DAY: number = new Date().getDate();
const MONTH: number = new Date().getMonth();
const YEAR: number = new Date().getFullYear();
class SfTimePicker {
    public element: BlazorTimePickerElement | HTMLInputElement;
    private containerElement: HTMLElement;
    private popupWrapper: HTMLElement;
    private selectedElement: HTMLElement;
    private listWrapper: HTMLElement;
    private popupObj: Popup;
    private modal: HTMLElement;
    private popupHolder: HTMLElement;
    private keyConfigure: { [key: string]: string };
    private containerStyle: ClientRect;
    private mobilePopupWrapper: HTMLElement;
    public dotNetRef: BlazorDotnetObject;
    public options: ITimePickerOptions;
    private timeCollections: string[];
    // tslint:disable
    constructor(containerElement: HTMLElement, element: BlazorTimePickerElement, dotnetRef: BlazorDotnetObject, options: ITimePickerOptions) {
        this.containerElement = containerElement;
        this.element = element;
        this.options = options;
        this.element.blazor__instance = this;
        this.dotNetRef = dotnetRef;
    }
    public initialize(): void {
        this.keyConfigure = {
            enter: 'enter', escape: 'escape', end: 'end', tab: 'tab', home: 'home', down: 'downarrow',
            up: 'uparrow', left: 'leftarrow', right: 'rightarrow', open: 'alt+downarrow', close: 'alt+uparrow'
        };
        if (!Browser.isDevice) {
            this.keyConfigure = extend(this.keyConfigure, this.options.keyConfigs) as { [key: string]: string };
            new KeyboardEvents(this.containerElement, {
                keyAction: this.inputHandler.bind(this),
                keyConfigs: this.keyConfigure,
                eventName: 'keydown'
            });
        }
    }
    // tslint:disable
    public renderPopup(popupElement: HTMLElement, popupHolderEle: HTMLElement, openEventArgs: PopupObjectArgs, options: ITimePickerOptions): void {
        this.options = options;
        this.popupHolder = popupHolderEle;
        this.timeCollections = [];
        this.listWrapper = popupHolderEle.querySelector('.' + POPUP_CONTENT) as HTMLElement || select('.' + POPUP_CONTENT) as HTMLElement;
        this.getTimeCollection();
        if (!isNullOrUndefined((this.element as HTMLInputElement).value)) {
            this.removeSelection();
            this.selectedElement = this.listWrapper.querySelector(
                'li[data-value = "' + (this.element as HTMLInputElement).value + '"]'
            );
            this.updateSelection(this.selectedElement);
        }
        this.popupCreation(popupElement, options);
        if (Browser.isDevice) {
            this.mobilePopupWrapper = createElement('div', { className: MODEL_POPUP });
            document.body.appendChild(this.mobilePopupWrapper);
        }
        let appendToElement: HTMLElement = openEventArgs.appendTo === 'model' ? this.mobilePopupWrapper : document.body;
        appendToElement.appendChild(this.popupWrapper);
        this.setScrollPosition();
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
        EventHandler.add(document, 'mousedown touchstart', this.documentClickHandler, this);
    }
    private getTimeCollection(): void {
        let liCollections: NodeListOf<Element> = (<HTMLElement[] & NodeListOf<Element>>this.listWrapper.querySelectorAll('.' + LISTCLASS));
        for (let index: number = 0; index < liCollections.length; index++) {
            this.timeCollections.push(liCollections[index].getAttribute('data-value'));
        }
    }
    private updateSelection(selectElement: HTMLElement): void {
        if (selectElement) {
            addClass([selectElement], SELECTED);
            selectElement.setAttribute(ARIA_SELECT, 'true');
        }
    }
    private setScrollPosition(): void {
        if (!isNullOrUndefined(this.selectedElement)) {
            this.findScrollTop(this.selectedElement);
        } else if (this.popupWrapper && this.options.scrollTo && this.checkDateValue(new Date(this.options.scrollTo as string))) {
            this.setScrollTo();
        }
    }
    private checkDateValue(value: Date): Date {
        return (!isNullOrUndefined(value) && value instanceof Date && !isNaN(+value)) ? value : null;
    }
    private findScrollTop(element: HTMLElement): void {
        let listHeight: number = this.getPopupHeight();
        let nextEle: Element = element.nextElementSibling;
        let height: number = nextEle ? (<HTMLElement>nextEle).offsetTop : element.offsetTop;
        let liHeight: number = element.getBoundingClientRect().height;
        if ((height + element.offsetTop) > listHeight) {
            this.popupWrapper.scrollTop = nextEle ? (height - (listHeight / HALFPOSITION + liHeight / HALFPOSITION)) : height;
        } else {
            this.popupWrapper.scrollTop = 0;
        }
    }
    private setScrollTo(): void {
        let element: HTMLElement;
        if (!isNullOrUndefined(this.popupWrapper)) {
            let items: HTMLElement[] = <NodeListOf<HTMLLIElement> & HTMLElement[]>this.popupWrapper.querySelectorAll('.' + LISTCLASS);
            if (items.length) {
                let initialTime: number = new Date(new Date().toDateString() + ' ' + this.timeCollections[0]).setMilliseconds(0);
                let scrollTime: number = this.getDateObject(new Date(this.options.scrollTo as string)).getTime();
                element = items[Math.round((scrollTime - initialTime) / (this.options.step * 60000))];
            }
        } else {
            this.popupWrapper.scrollTop = 0;
        }
        if (!isNullOrUndefined(element)) {
            this.findScrollTop(element);
        } else {
            this.popupWrapper.scrollTop = 0;
        }
    }
    private getDateObject(text: Date): Date {
        if (!isNullOrUndefined(text)) {
            let dateValue: Date = text;
            let value: boolean = !isNullOrUndefined(this.options.value as string);
            if (this.checkDateValue(dateValue)) {
                let date: number = value ? new Date(this.options.value as string).getDate() : DAY;
                let month: number = value ? new Date(this.options.value as string).getMonth() : MONTH;
                let year: number = value ? new Date(this.options.value as string).getFullYear() : YEAR;
                return new Date(year, month, date, dateValue.getHours(), dateValue.getMinutes(), dateValue.getSeconds());
            }
        }
        return null;
    }
    private getPopupHeight(): number {
        let height: number = parseInt(<string>POPUPDIMENSION, 10);
        let popupHeight: number = this.popupWrapper.getBoundingClientRect().height;
        return popupHeight > height ? height : popupHeight;
    }
    private popupCreation(popupElement: HTMLElement, options: ITimePickerOptions): void {
        this.popupWrapper = popupElement;
        this.containerStyle = this.containerElement.getBoundingClientRect();
        if (Browser.isDevice) {
            this.modal = createElement('div');
            this.modal.className = '' + ROOT + ' ' + TIME_MODAL;
            document.body.className += ' ' + OVERFLOW;
            this.modal.style.display = 'block';
            document.body.appendChild(this.modal);
        }
        this.popupObj = new Popup(this.popupWrapper as HTMLElement, {
            width: this.setPopupWidth(this.options.width),
            relateTo: Browser.isDevice ? document.body : this.containerElement,
            position: Browser.isDevice ? { X: 'center', Y: 'center' } : { X: 'left', Y: 'bottom' },
            collision: Browser.isDevice ? { X: 'fit', Y: 'fit' } : { X: 'flip', Y: 'flip' },
            offsetY: OFFSETVALUE,
            targetType: 'relative',
            enableRtl: options.enableRtl,
            zIndex: options.zIndex,
            open: () => {
                this.popupWrapper.style.visibility = 'visible';
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
        if (!Browser.isDevice) {
            this.popupObj.collision = { X: 'none', Y: 'flip' };
        }
        this.popupObj.element.style.maxHeight = POPUPDIMENSION;
    }
    public closePopup(closeEventArgs: PopupObjectArgs, options: ITimePickerOptions): void {
        this.options = options;
        removeClass([document.body], OVERFLOW);
        this.closeEventCallback(closeEventArgs);
    }
    private removeSelection(): void {
        this.removeHover(HOVER);
        if (!isNullOrUndefined(this.popupWrapper)) {
            let items: Element[] = <NodeListOf<Element> & Element[]>this.popupWrapper.querySelectorAll('.' + SELECTED);
            if (items.length) {
                removeClass(items, SELECTED);
                items[0].removeAttribute(ARIA_SELECT);
            }
        }
    }
    private removeHover(className: string): void {
        let hoveredItem: Element[] = this.popupWrapper ?
            <NodeListOf<HTMLLIElement> & Element[]>this.popupWrapper.querySelectorAll('.' + className) : [];
        if (hoveredItem && hoveredItem.length) {
            removeClass(hoveredItem, className);
            if (className === NAVIGATION) {
                hoveredItem[0].removeAttribute(ARIA_SELECT);
            }
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
            let inputWidth: number = this.containerStyle.width * parseFloat(width) / 100;
            width = inputWidth.toString() + 'px';
        }
        return width;
    }
    private closeEventCallback(eventArgs: PopupObjectArgs): void {
        let preventArgs: PopupObjectArgs = eventArgs;
        if (this.isPopupOpen() && !preventArgs.cancel && this.popupObj) {
            let animModel: object = {
                name: 'FadeOut',
                duration: ANIMATIONDURATION,
                delay: 0
            };
            this.popupObj.hide(new Animation(animModel));
        }
        if (Browser.isDevice) {
            if (this.modal) {
                this.modal.style.display = 'none';
                this.modal.outerHTML = '';
                this.modal = null;
            }
            if (!isNullOrUndefined(this.mobilePopupWrapper)) {
                this.mobilePopupWrapper.remove();
                this.mobilePopupWrapper = null;
            }
        }
        EventHandler.remove(document, 'mousedown touchstart', this.documentClickHandler);
    }
    private isPopupOpen(): boolean {
        return this.popupWrapper && this.popupWrapper.classList.contains('' + ROOT);
    }
    private documentClickHandler(event: MouseEvent): void {
        let target: HTMLElement = <HTMLElement>event.target;
        if ((!isNullOrUndefined(this.popupObj) && (this.containerElement.contains(target) ||
            (this.popupObj.element && this.popupObj.element.contains(target)))) && event.type !== 'touchstart') {
            event.preventDefault();
        }
        let clearElement: HTMLElement = this.containerElement.querySelector('.e-clear-icon');
        let timeIconElement: HTMLElement = this.containerElement.querySelector('.e-time-icon.e-icons');
        if (!(closest(target, '.' + POPUPWRAPPER)) && target !== this.element
            && target !== timeIconElement && target !== clearElement && target !== this.containerElement) {
            if (this.isPopupOpen()) {
                this.dotNetRef.invokeMethodAsync(HIDE_POPUP, null);
            }
        }
    }
    private setOverlayIndex(popupWrapper: HTMLElement, timePopupElement: HTMLElement, modal: HTMLElement, isDevice: Boolean): void {
        if (isDevice && !isNullOrUndefined(timePopupElement) && !isNullOrUndefined(modal) && !isNullOrUndefined(popupWrapper)) {
            let index: number = parseInt(timePopupElement.style.zIndex, 10) ? parseInt(timePopupElement.style.zIndex, 10) : 1000;
            modal.style.zIndex = (index - 1).toString();
            popupWrapper.style.zIndex = index.toString();
        }
    }
    public selectInputText(element: BlazorTimePickerElement | HTMLInputElement, isNavigation: boolean, index: number): void {
        if (!Browser.isDevice) {
            (element as HTMLInputElement).setSelectionRange(0, (element as HTMLInputElement).value.length);
            if (isNavigation && this.listWrapper) {
                this.selectedElement = this.listWrapper.querySelectorAll('.' + LISTCLASS)[index] as HTMLElement;
                this.setScrollPosition();
            }
        }
    }
    public isDevice(): Boolean {
        return Browser.isDevice;
    }
    private inputHandler(event: KeyboardEventArgs): void {
        if (event.action !== RIGHT && event.action !== LEFT && event.action !== TAB) { event.preventDefault(); }
        if (event.action === ENTER && this.isPopupOpen()) {
            event.stopPropagation();
        }
        let eventArgs: object = {
            Action: event.action,
            Key: event.key,
            KeyCode: event.keyCode,
            Events: event,
            SelectDate: null,
            FocusedDate: null,
            classList: '',
            Id: null,
            TargetClassList: null
        };
        this.dotNetRef.invokeMethodAsync('KeyboardHandler', eventArgs);
    }
}
// tslint:disable
let TimePicker: object = {
    initialize(containerElement: HTMLElement, element: BlazorTimePickerElement, dotnetRef: BlazorDotnetObject, options: ITimePickerOptions): Boolean {
        new SfTimePicker(containerElement, element, dotnetRef, options);
        if (element && element.blazor__instance) {
            element.blazor__instance.initialize();
            return element.blazor__instance.isDevice();
        }
        return false;
    },
    renderPopup(element: BlazorTimePickerElement, popupElement: HTMLElement, popupHolderEle: HTMLElement, openEventArgs: PopupObjectArgs, options: ITimePickerOptions) {
        if (element && element.blazor__instance && popupElement && popupHolderEle) {
            element.blazor__instance.renderPopup(popupElement, popupHolderEle, openEventArgs, options);
        }
    },
    closePopup(element: BlazorTimePickerElement, closeEventArgs: PopupObjectArgs, options: ITimePickerOptions) {
        if (element && element.blazor__instance) {
            element.blazor__instance.closePopup(closeEventArgs, options);
        }
    },
    selectInputText(element: BlazorTimePickerElement, isNavigation: boolean, index: number): void {
        if (element && element.blazor__instance) {
            element.blazor__instance.selectInputText(element, isNavigation, index);
        }
    },
    focusIn(inputEle: HTMLInputElement): void {
        if (inputEle) { inputEle.focus(); }
    },
    focusOut(inputEle: HTMLElement): void {
        if (inputEle) { inputEle.blur(); }
    }
};

interface BlazorTimePickerElement extends HTMLElement {
    blazor__instance: SfTimePicker;
}
export interface PopupObjectArgs {
    cancel?: boolean;
    event?: MouseEvent | KeyboardEvent | Event;
    appendTo?: string;
}
interface ITimePickerOptions {
    enableRtl: boolean;
    zIndex: number;
    keyConfigs: { [key: string]: string }
    value: Date | string,
    width: string;
    scrollTo: Date | string;
    step: number;
    timeCollections: any;
}

export default TimePicker;
