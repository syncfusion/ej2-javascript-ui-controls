import { BlazorDotnetObject, Browser, EventHandler, isNullOrUndefined } from '@syncfusion/ej2-base';
import { getScrollableParent } from '@syncfusion/ej2-popups';

const HSV_CONTAINER: string = '.e-hsv-container';
const COLOR_PICKER: string = '.e-split-colorpicker';
const HSV_COLOR: string = '.e-hsv-color';
const SET_OFFSET: string = 'SetOffset';
const DROPDOWN_BTN: string = '.e-dropdown-btn';
const HANDLER: string = '.e-handler';
const MODEL: string = '.e-colorpicker.e-modal';
const EMPTY: string = '';
const CONTAINER: string = '.e-container';
const SPLIT_BUTTON: string = '.sf-colorpicker';
const INPUTS: string = '.e-selected-value';
const CONTROL_BTN: string = '.e-switch-ctrl-btn';
const PIXEL: string = 'px';
const SCROLL: string = 'scroll';
const DEFAULT: string = '100%';
/**
 * Client side scripts for Blazor color picker
 */
class SfColorPicker {
    private element: BlazorColorPickerElement;
    private dotnetRef: BlazorDotnetObject;
    constructor(element: BlazorColorPickerElement, dotnetRef: BlazorDotnetObject, inline: boolean) {
        this.element = element;
        this.dotnetRef = dotnetRef;
        this.element.blazor__instance = this;
        if (inline) {
            this.addScrollEvents(true);
            this.setPaletteWidth(this.element.querySelector(CONTAINER), false);
        }
    }
    public getOffset(element: HTMLElement): Offset {
        let colorPicker: HTMLElement = element.querySelector(HSV_CONTAINER);
        if (!colorPicker) { return { IsDevice: Browser.isDevice}; }
        let offset: ClientRect = colorPicker.getBoundingClientRect();
        let color: HTMLElement = colorPicker.querySelector(HSV_COLOR);
        let handler: HTMLElement = colorPicker.querySelector(HANDLER) as HTMLElement;
        if (handler) { handler.focus(); }
        return { Left: offset.left, Top: offset.top, Width: offset.width, Height: offset.height, Right: offset.right, ClientLeft:
            color.offsetLeft, ClientTop: color.offsetTop, ClientWidth: color.offsetWidth, ClientHeight: color.offsetHeight,
            IsDevice: Browser.isDevice };
    }
    private setOffset(element: HTMLElement, zIndex?: number): void {
        let offset: Offset = this.getOffset(element);
        if (zIndex && !Browser.isDevice) {
            this.setZIndex(this.element, zIndex, COLOR_PICKER); this.setZIndex(this.element, zIndex, DROPDOWN_BTN);
        }
        if (offset) { this.dotnetRef.invokeMethodAsync(SET_OFFSET, offset); }
    }
    private setZIndex(element: HTMLElement, zIndex: number, cls: string): void {
        let btnEle: HTMLElement = element.querySelector(cls);
        if (btnEle) { btnEle.style.zIndex = zIndex + 1 + EMPTY; }
    }
    public setPaletteWidth(container: HTMLElement, modeSwitch: boolean, zIndex?: number): void {
        if (Browser.isDevice && !isNullOrUndefined(zIndex)) {
            let model: HTMLElement = container.querySelector(MODEL);
            if (model) {
                model.style.zIndex = (zIndex - 1) + EMPTY;
                document.body.insertBefore(model, container.parentElement);
                model.style.display = EMPTY;
            }
        }
        if (container.querySelector(HSV_CONTAINER)) {
            container.style.width = EMPTY;
        } else {
            let width: number = parseInt(getComputedStyle(container).borderBottomWidth, 10);
            container.style.width = (container.children[0] as HTMLElement).offsetWidth + width + width + PIXEL;
            let containers: HTMLElement = container.querySelector(INPUTS);
            if (containers) {
                containers.style.width = DEFAULT;
                containers = container.querySelector(CONTROL_BTN);
                if (containers) { containers.style.width = DEFAULT; }
            }
        }
        if (modeSwitch) {
            // tslint:disable-next-line:no-any
            let colorPickerBtn: any = this.element.querySelector(SPLIT_BUTTON);
            if (colorPickerBtn && !isNullOrUndefined(colorPickerBtn.blazor__instance)) {
                colorPickerBtn.blazor__instance.setPosition(true);
            }
        }
    }
    private scrollHandler(e: MouseEvent): void {
        if (!this.element.parentElement) {
            EventHandler.remove(e.target as Element, SCROLL, this.scrollHandler);
            return;
        }
        this.setOffset(this.element);
    }
    public addScrollEvents(add: boolean): void {
        let elements: HTMLElement[] = getScrollableParent(this.element);
        for (let element of elements) {
            add ? EventHandler.add(element, SCROLL, this.scrollHandler, this) :
                EventHandler.remove(element, SCROLL, this.scrollHandler);
        }
    }
}
interface BlazorColorPickerElement extends HTMLElement {
    blazor__instance: SfColorPicker;
}
interface Offset {
    Left?: number;
    Top?: number;
    Width?: number;
    Height?: number;
    Right?: number;
    ClientLeft?: number;
    ClientTop?: number;
    ClientWidth?: number;
    ClientHeight?: number;
    IsDevice: Boolean;
}
// tslint:disable-next-line:variable-name
let ColorPicker: object = {
    initialize(element: BlazorColorPickerElement, dotnetRef: BlazorDotnetObject, inline: boolean): Offset {
        if (!isNullOrUndefined(element)) {
            new SfColorPicker(element, dotnetRef, inline); return element.blazor__instance.getOffset(element);
        }
        return null;
    },
    getOffset(element: BlazorColorPickerElement, container: HTMLElement): Offset {
        if (!isNullOrUndefined(element) && !isNullOrUndefined(element.blazor__instance) && !isNullOrUndefined(container)) {
            element.blazor__instance.setPaletteWidth(container, true);
            return element.blazor__instance.getOffset(container);
        }
        return null;
    },
    destroy(element: BlazorColorPickerElement): void {
        if (!isNullOrUndefined(element)) { element.blazor__instance.addScrollEvents(false); }
    }
};

export default ColorPicker;