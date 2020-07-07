import { BlazorDotnetObject, closest, isNullOrUndefined, EventHandler } from '@syncfusion/ej2-base';
import { getZindexPartial } from '@syncfusion/ej2-popups';
import { upDownKeyHandler } from '../src/common/common';

const HIDDEN: string = 'hidden';
const TRANSPARENT: string = 'e-transparent';
const EMPTY: string = '';
const DOT: string = '.';
const HASH: string = '#';
const BTNCLICK: string = 'BtnClick';
const FOCUS: string = 'focus';
const DROPDOWN: string = 'e-dropdown-menu';
const ITEM: string = 'e-item';
const TABIDX: string = 'tabindex';
const FOCUSED: string = 'e-focused';
const WRAPPER: string = 'e-split-btn-wrapper';
const ELEMENT: string = 'e-dropdown-btn';
const MOUSEDOWN: string = 'mousedown touchstart';
const KEYDOWN: string = 'keydown';
const CLICK: string = 'click';
const ESC: number = 27;
const UP: number = 38;
const DOWN: number = 40;
const ENTER: number = 13;
const TAB: number = 9;

/**
 * Dropdown Button Blazor introp module
 */
class SfDropDownButton {
    private element: BlazorDropDownMenuElement;
    private dotNetRef: BlazorDotnetObject;
    public popup: HTMLElement;

    constructor(element: BlazorDropDownMenuElement, popup: HTMLElement, dotnetRef: BlazorDotnetObject) {
        this.element = element;
        this.dotNetRef = dotnetRef;
        this.popup = popup;
        this.element.blazor__instance = this;
    }

    public calculatePosition(): Offset {
        let borderWidth: number = parseInt(getComputedStyle(this.element).borderWidth, 10);
        this.popup.style.visibility = HIDDEN;
        this.popup.classList.remove(TRANSPARENT);
        let popupOffset: ClientRect = this.popup.getBoundingClientRect();
        let left: number = 0 - borderWidth;
        let bottom: number = -popupOffset.height - borderWidth;
        let zIndex: number = getZindexPartial(this.popup);
        let btnOffset: ClientRect = this.element.getBoundingClientRect();
        if (popupOffset.height + btnOffset.bottom > document.documentElement.clientHeight) {
            if (btnOffset.top - popupOffset.height > document.documentElement.clientTop) {
                bottom = btnOffset.height - borderWidth;
            }
        }
        if (popupOffset.width + btnOffset.right > document.documentElement.clientWidth) {
            if (btnOffset.left - popupOffset.width > document.documentElement.clientLeft) {
                left = btnOffset.width - popupOffset.width;
            }
        }
        left = Math.ceil(left); bottom = Math.ceil(bottom);
        this.popup.classList.add(TRANSPARENT);
        this.popup.style.visibility = EMPTY;
        if (this.popup.firstElementChild) { (this.popup.firstElementChild as HTMLElement).focus(); }
        this.addEventListener();
        return <Offset>{ Left: left, Bottom: bottom, ZIndex: zIndex };
    }

    private mouseDownHandler(e: MouseEvent & TouchEvent): void {
        if (!closest(e.target as Element, HASH + this.getDropDownButton().id)) {
            this.dotNetRef.invokeMethodAsync(BTNCLICK, null);
            this.removeEventListener();
        }
    }

    private keydownHandler(e: KeyboardEvent): void {
        let element: HTMLElement = this.getElement();
        if (e.altKey) {
            if (e.keyCode === UP) {
                e.stopPropagation();
                e.preventDefault();
                this.dotNetRef.invokeMethodAsync(BTNCLICK, null);
                element.focus();
                this.removeEventListener();
            }
        } else {
            let ul: HTMLElement = this.popup.firstElementChild as HTMLElement;
            if (e.keyCode === ESC || e.keyCode === TAB) {
                e.stopPropagation();
                this.dotNetRef.invokeMethodAsync(BTNCLICK, null);
                if (e.keyCode === ESC) {
                    e.preventDefault();
                    element.focus();
                } else {
                    if (e.shiftKey) {
                        EventHandler.add(element, FOCUS, this.preventFocus, this);
                        element.tabIndex = -1;
                        element.focus();
                    }
                }
                this.removeEventListener();
            }
            if (!ul || !ul.classList.contains(DROPDOWN)) { return; }
            if (e.keyCode === ENTER) {
                e.preventDefault();
                if ((e.target as Element).classList.contains(ITEM) && (e.target as Element).classList.contains(FOCUSED)) {
                    element.focus();
                    this.removeEventListener();
                } else {
                    e.stopPropagation();
                }
                return;
            }
            if (e.keyCode === UP || e.keyCode === DOWN) {
                if ((e.target as Element).classList.contains(DROPDOWN)) {
                    e.stopPropagation();
                }
                e.preventDefault();
                upDownKeyHandler(ul, e.keyCode);
            }
        }
    }

    private preventFocus(e: FocusEvent): void {
        let element: HTMLElement = this.getElement();
        e.preventDefault();
        EventHandler.remove(element, FOCUS, this.preventFocus);
        element.removeAttribute(TABIDX);
    }

    private getElement(): HTMLElement {
        return (this.element.classList.contains(WRAPPER) ? this.element.firstElementChild : this.element) as HTMLElement;
    }

    private getDropDownButton(): HTMLElement {
        return this.element.classList.contains(WRAPPER) ?
            this.element.getElementsByClassName(ELEMENT)[0] as HTMLElement : this.element;
    }

    public btnClickHandler(e: MouseEvent): void {
        if (closest(e.target as Element, HASH + this.popup.id)) {
            if (closest(e.target as Element, DOT + ITEM)) {
                this.removeEventListener();
                this.getElement().focus();
            }
        } else {
            this.removeEventListener();
        }
    }

    public addEventListener(setFocus?: boolean): void {
        EventHandler.add(document, MOUSEDOWN, this.mouseDownHandler, this);
        EventHandler.add(this.getDropDownButton(), CLICK, this.btnClickHandler, this);
        EventHandler.add(this.popup, KEYDOWN, this.keydownHandler, this);
        if (setFocus && this.popup.firstElementChild) {
            let focusEle: HTMLElement = this.popup.querySelector(DOT + FOCUSED) as HTMLElement;
            focusEle ? focusEle.focus() : (this.popup.firstElementChild as HTMLElement).focus();
        }
    }

    public removeEventListener(): void {
        EventHandler.remove(document, MOUSEDOWN, this.mouseDownHandler);
        EventHandler.remove(this.getDropDownButton(), CLICK, this.btnClickHandler);
        if (this.popup.parentElement) { EventHandler.remove(this.popup, KEYDOWN, this.keydownHandler); }
    }
}

// tslint:disable-next-line:variable-name
let DropDownButton: object = {
    calculatePosition(element: BlazorDropDownMenuElement, popup: HTMLElement, dotnetRef: BlazorDotnetObject): Offset {
        if (isNullOrUndefined(element.blazor__instance)) {
            new SfDropDownButton(element, popup, dotnetRef);
            return element.blazor__instance.calculatePosition();
        }
        element.blazor__instance.popup = popup;
        return element.blazor__instance.calculatePosition();
    },
    addEventListener(element: BlazorDropDownMenuElement): void {
        element.blazor__instance.addEventListener(true);
    },
    removeEventListener(element: BlazorDropDownMenuElement): void {
        element.blazor__instance.removeEventListener();
    }
};

interface BlazorDropDownMenuElement extends HTMLElement {
    blazor__instance: SfDropDownButton;
}

interface Offset {
    Left: number;
    Bottom: number;
    ZIndex: number;
}

export default DropDownButton;