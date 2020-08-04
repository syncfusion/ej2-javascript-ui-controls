import { BlazorDotnetObject, closest, isNullOrUndefined, EventHandler } from '@syncfusion/ej2-base';
import { getZindexPartial } from '@syncfusion/ej2-popups';
import { upDownKeyHandler, setBlankIconStyle } from '../src/common/common';

const HIDDEN: string = 'hidden';
const TRANSPARENT: string = 'e-transparent';
const EMPTY: string = '';
const PIXEL: string = 'px';
const ZERO: string = '0';
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

    public calculatePosition(blankIcon: boolean): void {
        let btnOffset: ClientRect = this.element.getBoundingClientRect();
        let left: number = btnOffset.left + pageXOffset;
        let top: number = btnOffset.bottom + pageYOffset;
        this.popup.style.visibility = HIDDEN;
        document.body.appendChild(this.popup);
        if (blankIcon) { setBlankIconStyle(this.popup); }
        this.popup.classList.remove(TRANSPARENT);
        let popupOffset: ClientRect = this.popup.getBoundingClientRect();
        let zIndex: number = getZindexPartial(this.element);
        if (btnOffset.bottom + popupOffset.height > document.documentElement.clientHeight) {
            if (top - btnOffset.height - popupOffset.height > document.documentElement.clientTop) {
                top = top - btnOffset.height - popupOffset.height;
            }
        }
        if (btnOffset.left + popupOffset.width > document.documentElement.clientWidth) {
            if (btnOffset.right - popupOffset.width > document.documentElement.clientLeft) {
                left = (left + btnOffset.width) - popupOffset.width;
            }
        }
        left = Math.ceil(left); top = Math.ceil(top);
        EventHandler.remove(document, MOUSEDOWN, this.mouseDownHandler);
        this.addEventListener();
        this.popup.style.left = left + PIXEL;
        this.popup.style.top = top + PIXEL;
        this.popup.style.zIndex = zIndex + EMPTY;
        this.popup.style.visibility = EMPTY;
        if (this.popup.firstElementChild) { (this.popup.firstElementChild as HTMLElement).focus(); }
    }

    private mouseDownHandler(e: MouseEvent & TouchEvent): void {
        if (this.popup.parentElement) {
            if (!closest(e.target as Element, HASH + this.getDropDownButton().id) && !closest(e.target as Element, HASH + this.popup.id)) {
                this.dotNetRef.invokeMethodAsync(BTNCLICK, null);
                this.removeEventListener();
            }
        } else {
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
                }
                element.focus();
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

    private getElement(): HTMLElement {
        return (this.element.classList.contains(WRAPPER) ? this.element.firstElementChild : this.element) as HTMLElement;
    }

    private getDropDownButton(): HTMLElement {
        return this.element.classList.contains(WRAPPER) ?
            this.element.getElementsByClassName(ELEMENT)[0] as HTMLElement : this.element;
    }

    public clickHandler(e: MouseEvent): void {
        if (closest(e.target as Element, DOT + ITEM)) {
            this.removeEventListener(); this.getElement().focus();
        }
    }

    public addEventListener(setFocus?: boolean): void {
        EventHandler.add(document, MOUSEDOWN, this.mouseDownHandler, this);
        EventHandler.add(this.popup, CLICK, this.clickHandler, this);
        EventHandler.add(this.popup, KEYDOWN, this.keydownHandler, this);
        if (setFocus && this.popup.firstElementChild) {
            let focusEle: HTMLElement = this.popup.querySelector(DOT + FOCUSED) as HTMLElement;
            focusEle ? focusEle.focus() : (this.popup.firstElementChild as HTMLElement).focus();
        }
    }

    public removeEventListener(reposition?: boolean): void {
        EventHandler.remove(document, MOUSEDOWN, this.mouseDownHandler);
        if (this.popup.parentElement) {
            EventHandler.remove(this.popup, CLICK, this.clickHandler);
            EventHandler.remove(this.popup, KEYDOWN, this.keydownHandler);
            if (reposition && this.element.parentElement) { this.element.appendChild(this.popup); }
        }
    }
}

// tslint:disable-next-line:variable-name
let DropDownButton: object = {
    calculatePosition(element: BlazorDropDownMenuElement, popup: HTMLElement, dotnetRef: BlazorDotnetObject, blankIcon: boolean): void {
        if (!isNullOrUndefined(element)) {
            if (isNullOrUndefined(element.blazor__instance)) {
                new SfDropDownButton(element, popup, dotnetRef);
            } else {
                element.blazor__instance.popup = popup;
            }
            element.blazor__instance.calculatePosition(blankIcon);
        }
    },
    addEventListener(element: BlazorDropDownMenuElement): void {
        element.blazor__instance.removeEventListener();
        element.blazor__instance.addEventListener(true);
    },
    removeEventListener(element: BlazorDropDownMenuElement): void {
        element.blazor__instance.removeEventListener(true);
    }
};

interface BlazorDropDownMenuElement extends HTMLElement {
    blazor__instance: SfDropDownButton;
}

interface Offset {
    Left: number;
    Top: number;
    ZIndex: number;
}

export default DropDownButton;