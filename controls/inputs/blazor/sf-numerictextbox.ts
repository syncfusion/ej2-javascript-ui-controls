import { BlazorDotnetObject, Browser, EventHandler, getNumericObject, getValue, Internationalization } from '@syncfusion/ej2-base';

/**
 * Blazor numeric texbot interop handler
 */

const INTREGEXP: RegExp = new RegExp('^(-)?(\\d*)$');
const ENTER: number = 13;
const ARROW_UP: number = 38;
const ARROW_DOWN: number = 40;
const BACK_SPACE: number = 8;
const WHEEL_DELTA: number = 120;
const DELTA: number = 3;
const LEFT_BUTTON: number = 0;
const RIGHT_BUTTON: number = 3;
const MOBILE_INTERVEL_TIME: number = 600;
const INTERVEL_TIME: number = 10;
const TIMEOUT: number = 150;
const MOUSE_BUTTON: number = 2;
const IE_VERSION: string = '11.0';
const INCREMENT: string = 'increment';
const DECREMENT: string = 'decrement';
const MOUSE_MOVE: string = 'mouseleave';
const ROOT: string = 'e-input-group-icon';
const MOUSE_UP: string = 'mouseup';
const MOUSE_WHEEL: string = 'mousewheel DOMMouseScroll';
const SERVER_ACTION: string = 'ServerAction';
const SERVER_VALUE_UPDATE: string = 'ServerupdateValue';
const SPIN_UP: string = 'e-spin-up';
const SPIN_DOWN: string = 'e-spin-down';
const DECIMAL: string = 'decimal';
const FOCUS: string = 'focus';
const BLUR: string = 'blur';
const KEY_PRESS: string = 'keypress';
const KEY_DOWN: string = 'keydown';
class SfNumericTextBox {
    public element: BlazorNumericElement | HTMLInputElement;
    private wrapperElement: HTMLElement;
    private isFocused: boolean;
    private isCalled: boolean;
    private spinDown: HTMLElement;
    private spinUp: HTMLElement;
    private timeOut: any; // tslint:disable-line
    private isPrevFocused: boolean;
    public dotNetRef: BlazorDotnetObject;
    public options: INumericOptions;
    constructor(wrapperElement: HTMLElement, element: BlazorNumericElement, dotnetRef: BlazorDotnetObject, options: INumericOptions) {
        this.wrapperElement = wrapperElement;
        this.element = element;
        this.options = options;
        this.element.blazor__instance = this;
        this.dotNetRef = dotnetRef;
    }
    public initialize(): void {
        this.spinButtonEvents();
        EventHandler.add(this.element, FOCUS, this.focusHandler, this);
        EventHandler.add(this.element, BLUR, this.focusOutHandler, this);
        EventHandler.add(this.element, KEY_PRESS, this.keyPressHandler, this);
        EventHandler.add(this.element, KEY_DOWN, this.keyDownHandler, this);
    }
    private keyPressHandler(event: KeyboardEvent): boolean {
        if (!this.options.enabled || this.options.readonly) { return true; }
        let action: number = event.keyCode;
        if (!Browser.isDevice && Browser.info.version === IE_VERSION && action === ENTER) {
            let inputValue: string = (this.element as HTMLInputElement).value;
            let parsedInput: number = new Internationalization(this.options.locale).getNumberParser({ format: 'n' })(inputValue);
            this.dotNetRef.invokeMethodAsync(SERVER_VALUE_UPDATE, parsedInput, event);
            return true;
        }
        if (event.which === LEFT_BUTTON || event.metaKey || event.ctrlKey || action === BACK_SPACE || action === ENTER) { return true; }
        let currentChar: string = String.fromCharCode(event.which);
        let text: string = (this.element as HTMLInputElement).value;
        let inputElement: HTMLInputElement = this.element as HTMLInputElement;
        text = text.substring(0, inputElement.selectionStart) + currentChar + text.substring(inputElement.selectionEnd);
        if (!this.numericRegex().test(text)) {
            event.preventDefault();
            event.stopPropagation();
            return false;
        } else {
            return true;
        }
    };
    private keyDownHandler(event: KeyboardEvent): void {
        if (!this.options.readonly) {
            if (event.keyCode === ARROW_UP) {
                event.preventDefault();
                this.dotNetRef.invokeMethodAsync(SERVER_ACTION, INCREMENT, event);
            } else if (event.keyCode === ARROW_DOWN) {
                event.preventDefault();
                this.dotNetRef.invokeMethodAsync(SERVER_ACTION, DECREMENT, event);
            }
        }
    };
    private numericRegex(): RegExp {
        let numericObject: Object = getNumericObject(this.options.locale);
        let decimalSeparator: string = getValue(DECIMAL, numericObject);
        let fractionRule: string = '*';
        if (decimalSeparator === '.') {
            decimalSeparator = '\\' + decimalSeparator;
        }
        if (this.options.decimals === 0 && this.options.validateDecimalOnType) {
            return INTREGEXP;
        }
        if (this.options.decimals && this.options.validateDecimalOnType) {
            fractionRule = '{0,' + this.options.decimals + '}';
        }
        return new RegExp('^(-)?(((\\d+(' + decimalSeparator + '\\d' + fractionRule +
            ')?)|(' + decimalSeparator + '\\d' + fractionRule + ')))?$');
    };
    private mouseWheel(event: MouseWheelEvent): void {
        event.preventDefault();
        let delta: number;
        let rawEvent: WheelEvent = event;
        if (rawEvent.wheelDelta) {
            delta = rawEvent.wheelDelta / WHEEL_DELTA;
        } else if (rawEvent.detail) {
            delta = -rawEvent.detail / DELTA;
        }
        if (delta > 0) {
            this.dotNetRef.invokeMethodAsync(SERVER_ACTION, INCREMENT, event);
        } else if (delta < 0) {
            this.dotNetRef.invokeMethodAsync(SERVER_ACTION, DECREMENT, event);
        }
    }
    private focusHandler(event: MouseEvent | FocusEvent | TouchEvent | KeyboardEvent): void {
        this.isFocused = true;
        if (!Browser.isDevice) {
            EventHandler.add(this.element, MOUSE_WHEEL, this.mouseWheel, this);
        }
    }
    private focusOutHandler(event: MouseEvent | FocusEvent | TouchEvent | KeyboardEvent): void {
        this.isFocused = false;
        event.preventDefault();
        if (!Browser.isDevice) {
            EventHandler.remove(this.element, MOUSE_WHEEL, this.mouseWheel);
        }

    }
    private mouseDownOnSpinner(event: MouseEvent): void {
        if (this.isFocused) {
            this.isPrevFocused = true;
            event.preventDefault();
        }
        let target: HTMLElement = <HTMLElement>event.currentTarget;
        let action: string = (target.classList.contains(SPIN_UP)) ? INCREMENT : DECREMENT;
        EventHandler.add(target, MOUSE_MOVE, this.mouseUpClick, this);
        // tslint:disable
        this.timeOut = setInterval(
            () => {
                this.isCalled = true;
                this.dotNetRef.invokeMethodAsync(SERVER_ACTION, action, event);
            }, TIMEOUT);
        EventHandler.add(document, MOUSE_UP, this.mouseUpClick, this);
    }
    private mouseUpOnSpinner(event: MouseEvent): void {
        if (this.isPrevFocused) {
            (this.element as HTMLInputElement).focus();
            if (!Browser.isDevice) {
                this.isPrevFocused = false;
            }
        }
        if (!Browser.isDevice) {
            event.preventDefault();
        }
        if (!this.getElementData(event)) {
            return;
        }
        let target: HTMLElement = <HTMLElement>event.currentTarget;
        let action: string = (target.classList.contains(SPIN_UP)) ? INCREMENT : DECREMENT;
        EventHandler.remove(target, MOUSE_MOVE, this.mouseUpClick);
        if (!this.isCalled) {
            this.dotNetRef.invokeMethodAsync(SERVER_ACTION, action, event);
        }
        this.isCalled = false;
        EventHandler.remove(document, MOUSE_UP, this.mouseUpClick);
    }
    private touchMoveOnSpinner(event: MouseEvent): void {
        let target: Element = document.elementFromPoint(event.clientX, event.clientY);
        if (!(target.classList.contains(ROOT))) {
            clearInterval(this.timeOut);
        }
    }
    private getElementData(event: MouseEvent): boolean {
        if ((event.which && event.which === RIGHT_BUTTON) || (event.button && event.button === MOUSE_BUTTON)
            || !this.options.enabled || this.options.readonly) {
            return false;
        }
        clearInterval(this.timeOut);
        return true;
    }
    private mouseUpClick(event: MouseEvent): void {
        event.stopPropagation();
        clearInterval(this.timeOut);
        this.isCalled = false;
        EventHandler.remove(this.spinUp, MOUSE_MOVE, this.mouseUpClick);
        EventHandler.remove(this.spinDown, MOUSE_MOVE, this.mouseUpClick);
    }
    public selectRange(formatValue: string): void {
        if (!Browser.isDevice && Browser.info.version === IE_VERSION) {
            (this.element as HTMLInputElement).setSelectionRange(0, formatValue.length);
        } else {
            let delay: number = (Browser.isDevice && Browser.isIos) ? MOBILE_INTERVEL_TIME : INTERVEL_TIME;
            setTimeout(
                () => {
                    (this.element as HTMLInputElement).setSelectionRange(0, formatValue.length);
                },
                delay);
        }
    }
    public isDevice(): boolean {
        return Browser.isDevice as boolean;
    }
    public spinButtonEvents(): void {
        this.spinDown = this.wrapperElement ? this.wrapperElement.querySelector('.' + SPIN_DOWN) : null;
        this.spinUp = this.wrapperElement ? this.wrapperElement.querySelector('.' + SPIN_UP) : null;
        if (this.spinDown && this.spinUp) {
            this.unBindSpinButton();
            this.bindSpinButton();
        }
    }
    private bindSpinButton(): void {
        EventHandler.add(this.spinUp, Browser.touchStartEvent, this.mouseDownOnSpinner, this);
        EventHandler.add(this.spinDown, Browser.touchStartEvent, this.mouseDownOnSpinner, this);
        EventHandler.add(this.spinUp, Browser.touchEndEvent, this.mouseUpOnSpinner, this);
        EventHandler.add(this.spinDown, Browser.touchEndEvent, this.mouseUpOnSpinner, this);
        EventHandler.add(this.spinUp, Browser.touchMoveEvent, this.touchMoveOnSpinner, this);
        EventHandler.add(this.spinDown, Browser.touchMoveEvent, this.touchMoveOnSpinner, this);
    }
    private unBindSpinButton(): void {
        EventHandler.remove(this.spinUp, Browser.touchStartEvent, this.mouseDownOnSpinner);
        EventHandler.remove(this.spinDown, Browser.touchStartEvent, this.mouseDownOnSpinner);
        EventHandler.remove(this.spinUp, Browser.touchEndEvent, this.mouseUpOnSpinner);
        EventHandler.remove(this.spinDown, Browser.touchEndEvent, this.mouseUpOnSpinner);
        EventHandler.remove(this.spinUp, Browser.touchMoveEvent, this.touchMoveOnSpinner);
        EventHandler.remove(this.spinDown, Browser.touchMoveEvent, this.touchMoveOnSpinner);
    }
}
// tslint:disable
let NumericTextBox: object = {
    initialize(wrapperElement: HTMLElement, element: BlazorNumericElement, dotnetRef: BlazorDotnetObject, options: INumericOptions): void {
        new SfNumericTextBox(wrapperElement, element, dotnetRef, options);
        element.blazor__instance.initialize();
    },
    isDevice(element: BlazorNumericElement): boolean {
        return element.blazor__instance.isDevice();
    },
    selectRange(inputEle: BlazorNumericElement, formatValue: string): void {
        inputEle.blazor__instance.selectRange(formatValue);
    },
    propertyChanges(element: BlazorNumericElement, options: INumericOptions): void {
        element.blazor__instance.options = options;
    },
    focusIn(inputEle: HTMLElement): void {
        inputEle.focus();
    },
    focusOut(inputEle: HTMLElement): void {
        inputEle.blur();
    },
    spinButtonEvents(inputEle: BlazorNumericElement) {
        inputEle.blazor__instance.spinButtonEvents();
    }
};
interface BlazorNumericElement extends HTMLElement {
    blazor__instance: SfNumericTextBox;
}
interface INumericOptions {
    readonly: boolean;
    enabled: boolean;
    locale: string;
    validateDecimalOnType: boolean;
    decimals: number;
}
export default NumericTextBox;
