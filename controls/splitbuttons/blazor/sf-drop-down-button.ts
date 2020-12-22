import { BlazorDotnetObject, closest, isNullOrUndefined, EventHandler, Browser } from '@syncfusion/ej2-base';
import { getScrollableParent, getZindexPartial } from '@syncfusion/ej2-popups';
import { upDownKeyHandler, setBlankIconStyle } from '../src/common/common';

const HIDDEN: string = 'hidden';
const TRANSPARENT: string = 'e-transparent';
const EMPTY: string = '';
const PIXEL: string = 'px';
const DOT: string = '.';
const HASH: string = '#';
const BTN_CLICK: string = 'BtnClick';
const DROPDOWN: string = 'e-dropdown-menu';
const COLOR_PICKER: string = 'e-colorpicker-container';
const HSV_MODEL: string = 'e-hsv-model';
const MODEL: string = '.e-colorpicker.e-modal';
const CONTAINER: string = '.e-container';
const ITEM: string = 'e-item';
const FOCUSED: string = 'e-focused';
const WRAPPER: string = 'e-split-btn-wrapper';
const ELEMENT: string = 'e-dropdown-btn';
const MOUSEDOWN: string = 'mousedown touchstart';
const KEYDOWN: string = 'keydown';
const CLICK: string = 'click';
const SCROLL: string = 'scroll';
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
        this.addScrollEvents(true);
    }
    public openPopup(blankIcon: boolean): void {
        this.popup.style.visibility = HIDDEN;
        document.body.appendChild(this.popup);
        if (blankIcon) { setBlankIconStyle(this.popup); }
        this.popup.classList.remove(TRANSPARENT);
        let zIndex: number = getZindexPartial(this.element);
        let isColorPicker: boolean = this.element.parentElement.classList.contains(COLOR_PICKER);
        if (isColorPicker) {
            (this.element.parentElement as BlazorColorPickerElement).blazor__instance.setPaletteWidth(
                this.popup.querySelector(CONTAINER), false, zIndex);
        }
        this.setPosition(isColorPicker);
        EventHandler.remove(document, MOUSEDOWN, this.mouseDownHandler);
        this.addEventListener();
        this.popup.style.zIndex = zIndex + EMPTY;
        this.popup.style.visibility = EMPTY;
        if (isColorPicker) { (this.element.parentElement as BlazorColorPickerElement).blazor__instance.setOffset(this.popup, zIndex); }
        if (this.popup.firstElementChild) { (this.popup.firstElementChild as HTMLElement).focus(); }
    }
    private setPosition(isColorPicker?: boolean): void {
        let left: number; let top: number;
        let btnOffset: ClientRect = this.element.getBoundingClientRect();
        let popupOffset: ClientRect = this.popup.getBoundingClientRect();
        if (isColorPicker && Browser.isDevice) {
            left = ((document.documentElement.clientWidth / 2) - (popupOffset.width / 2)) + pageXOffset;
            top = ((document.documentElement.clientHeight / 2) - (popupOffset.height / 2)) + pageYOffset;
        } else {
            left = btnOffset.left + pageXOffset;
            top = btnOffset.bottom + pageYOffset;
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
        }
        this.popup.style.left = Math.ceil(left) + PIXEL;
        this.popup.style.top = Math.ceil(top) + PIXEL;
    }
    private mouseDownHandler(e: MouseEvent & TouchEvent): void {
        if (this.popup.parentElement) {
            let target: Element = e.target as Element;
            let prevent: boolean = true;
            if (!Browser.isDevice && target.classList.contains(HSV_MODEL)) {
                let ref: ClientRect = target.parentElement.getBoundingClientRect();
                let btn: ClientRect = this.element.getBoundingClientRect();
                prevent = (e.clientX >= ref.left && e.clientX <= ref.right && e.clientY >= ref.top && e.clientY <= ref.bottom) ||
                    (e.clientX >= btn.left && e.clientX <= btn.right && e.clientY >= btn.top && e.clientY <= btn.bottom);
            }
            if (!prevent || (!closest(target, HASH + this.getDropDownButton().id) && !closest(e.target as Element, HASH + this.popup.id) &&
                !closest(e.target as Element, MODEL))) {
                this.dotNetRef.invokeMethodAsync(BTN_CLICK, null);
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
                this.dotNetRef.invokeMethodAsync(BTN_CLICK, null);
                element.focus();
                this.removeEventListener();
            }
        } else {
            let ul: HTMLElement = this.popup.firstElementChild as HTMLElement;
            if (e.keyCode === ESC || e.keyCode === TAB) {
                e.stopPropagation();
                this.dotNetRef.invokeMethodAsync(BTN_CLICK, null);
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
    private scrollHandler(e: MouseEvent): void {
        if (!this.popup || !document.getElementById(this.popup.id)) {
            let ddb: HTMLElement = this.getDropDownButton();
            if (!ddb || !document.getElementById(ddb.id)) {
                EventHandler.remove(e.target as Element, SCROLL, this.scrollHandler);
            }
            return;
        }
        let isColorPicker: boolean = this.element.parentElement.classList.contains(COLOR_PICKER);
        this.setPosition(isColorPicker);
        if (isColorPicker) {
            (this.element.parentElement as BlazorColorPickerElement).blazor__instance.setOffset(this.popup);
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
            if (reposition) {
                let ddb: HTMLElement = this.getDropDownButton();
                if (ddb && document.getElementById(ddb.id)) {
                    this.addScrollEvents(false); this.element.appendChild(this.popup);
                }
            }
        }
    }
    private addScrollEvents(add: boolean): void {
        let elements: HTMLElement[] = getScrollableParent(this.element);
        for (let element of elements) {
            add ? EventHandler.add(element, SCROLL, this.scrollHandler, this) :
                EventHandler.remove(element, SCROLL, this.scrollHandler);
        }
    }
}

// tslint:disable-next-line:variable-name
let DropDownButton: object = {
    openPopup(element: BlazorDropDownMenuElement, popup: HTMLElement, dotnetRef: BlazorDotnetObject, blankIcon: boolean): void {
        if (!isNullOrUndefined(element)) {
            if (isNullOrUndefined(element.blazor__instance)) {
                new SfDropDownButton(element, popup, dotnetRef);
            } else {
                element.blazor__instance.popup = popup;
            }
            element.blazor__instance.openPopup(blankIcon);
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
interface BlazorColorPickerElement extends HTMLElement {
    // tslint:disable-next-line:no-any
    blazor__instance: any;
}

export default DropDownButton;