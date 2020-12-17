import { BlazorDotnetObject, EventHandler } from '@syncfusion/ej2-base';

/**
 * Blazor masked textbox interop handler
 */

const UPDATE_MASK_CURSOR: string = 'UpdateMaskCursor';
const UPDATE_MULTIPLE_DELETION: string = 'UpdateMultipleDeletion';
const PASTE_HANDLER: string = 'UpdatePasteValue';
const ERROR: string = 'e-error';
const KEY_DOWN: string = 'keydown';
const KEY_PRESS: string = 'keypress';
const BACK_SPACE: number = 8;
const DELETE: number = 46;
const FOCUS: string = 'focus';
const BLUR: string = 'blur';
const PASTE: string = 'paste';
const CUT: string = 'cut';
const MOUSE_DOWN: string = 'mousedown';
const MOUSE_UP: string = 'mouseup';
const SPACE: number = 32;
class SfMaskedTextBox {
    public element: BlazorMaskElement | HTMLInputElement;
    private wrapperElement: HTMLElement;
    private isFocused: boolean;
    private ismultipledelete: boolean = false;
    private isClicked: boolean = false;
    public dotNetRef: BlazorDotnetObject;
    public options: IMaskOptions;
    constructor(wrapperElement: HTMLElement, element: BlazorMaskElement, dotnetRef: BlazorDotnetObject, options: IMaskOptions) {
        this.wrapperElement = wrapperElement;
        this.isClicked = false;
        this.element = element;
        this.options = options;
        this.element.blazor__instance = this;
        this.dotNetRef = dotnetRef;
    }
    public initialize(): void {

        EventHandler.add(this.element, FOCUS, this.focusHandler, this);
        EventHandler.add(this.element, KEY_DOWN, this.keyDownHandler, this);
        EventHandler.add(this.element, KEY_PRESS, this.keyPressHandler, this);
        EventHandler.add(this.element, PASTE, this.pasteHandler, this);
        EventHandler.add(this.element, CUT, this.cutHandler, this);
        EventHandler.add(this.element, MOUSE_DOWN, this.mouseDownHandler, this);
        EventHandler.add(this.element, MOUSE_UP, this.mouseUpHandler, this);
    }
    private mouseDownHandler(event: MouseEvent): void {
        this.isClicked = true;
    }
    private mouseUpHandler(event: MouseEvent): void {
        this.isClicked = false;
    }
    private keyDownHandler(event: KeyboardEvent): void {
        if (this.options.mask && !this.options.readonly) {
            let inputElement: HTMLInputElement = this.element as HTMLInputElement;
            let startIndex: number = inputElement.selectionStart;
            let endIndex: number = inputElement.selectionEnd;
            if (startIndex !== endIndex && this.options.mask !== null && !event.ctrlKey) {
                if ((event.keyCode >= 48 && event.keyCode <= 90) || (event.keyCode >= 96 && event.keyCode <= 111) ||
                    (event.keyCode >= 186 && event.keyCode <= 192) || (event.keyCode >= 219 && event.keyCode <= 222) ||
                    (event.keyCode === BACK_SPACE || event.keyCode === DELETE || event.keyCode === SPACE)) {
                    this.ismultipledelete = true;
                    let eventArgs: object = {
                        Readonly: false,
                        Enabled: true,
                        Value: inputElement.value,
                        selectionEnd: inputElement.selectionEnd,
                        selectionStart: inputElement.selectionStart,
                        keyValue: event.key,
                        IsMultipleDelete: this.ismultipledelete
                    };
                    // @ts-ignore-start
                    // tslint:disable-next-line:no-any
                    this.dotNetRef.invokeMethodAsync(UPDATE_MULTIPLE_DELETION, eventArgs).then((args: any) => {
                        // @ts-ignore-end
                        inputElement.value = args.inputValue;
                        inputElement.selectionStart = inputElement.selectionEnd = args.cursorPosition;
                        if (event.keyCode !== BACK_SPACE && event.keyCode !== DELETE) {
                            this.ismultipledelete = false;
                            this.keyPressHandler(event);
                        }
                    });
                }
            } else {
                this.ismultipledelete = false;
                if (event.keyCode === BACK_SPACE || event.keyCode === DELETE) { this.keyPressHandler(event); }
            }
        }
    }
    private focusHandler(event: MouseEvent | FocusEvent | TouchEvent | KeyboardEvent): void {
        let inputElement: HTMLInputElement = this.element as HTMLInputElement;
        let startIndex: number = 0;
        let modelValue: string = this.stripValue(inputElement.value);
        let toAllowForward: boolean = false;
        let toAllowBackward: boolean = false;
        if (this.options.mask !== null) {
            if (!(!(modelValue === null || modelValue === '') || this.options.floatLabelType === 'Always' ||
                this.options.placeHolder === null || this.options.placeHolder === '')) { inputElement.value = this.options.maskedValue; }
            setTimeout(() => {
                if (inputElement.selectionStart === this.options.mask.length ||
                    inputElement.value[inputElement.selectionStart] === this.options.promptCharacter) {
                    toAllowForward = true;
                } else {
                    for (let i: number = inputElement.selectionStart; i < this.options.mask.length; i++) {
                        if (inputElement.value[i] !== this.options.promptCharacter) {
                            if ((inputElement.value[i] !== this.options.mask[i])) {
                                toAllowForward = false;
                                break;
                            }
                        } else {
                            toAllowForward = true;
                            break;
                        }
                    }
                }
            });
            setTimeout(() => {
                let backSelectionStart: number = inputElement.selectionStart - 1;
                if (backSelectionStart === this.options.mask.length - 1 ||
                    inputElement.value[backSelectionStart] === this.options.promptCharacter) {
                    toAllowBackward = true;
                } else {
                    for (let i: number = backSelectionStart; i >= 0; i--) {
                        if (inputElement.value[i] !== this.options.promptCharacter) {
                            if ((inputElement.value[i] !== this.options.mask[i])) {
                                toAllowBackward = false;
                                break;
                            }
                        } else {
                            toAllowBackward = true;
                            break;
                        }
                    }
                }
            });
            if ((this.isClicked || (this.options.floatLabelType !== 'Always' &&
                ((modelValue === null || modelValue === '') &&
                    (this.options.placeHolder !== null && this.options.placeHolder !== ''))))) {
                for (startIndex = 0; startIndex < this.options.mask.length; startIndex++) {
                    if (inputElement.value[startIndex] === this.options.promptCharacter) {
                        setTimeout(() => {
                            if (toAllowForward || toAllowBackward) {
                                inputElement.selectionEnd = startIndex;
                                inputElement.selectionStart = startIndex;
                            }
                        });
                        break;
                    }
                }
                this.isClicked = false;
            }
        }
    }

    private stripValue(inputEleValue: string): string {
        let stripVal: string = '';
        if (this.options.mask !== null && inputEleValue != null && inputEleValue !== '') {
            for (let i: number = 0; i < this.options.mask.length; i++) {
                if (this.options.mask[i] !== inputEleValue[i]) {
                    stripVal += inputEleValue[i];
                }
            }
        }
        return stripVal;
    }



    private keyPressHandler(event: KeyboardEvent): void {
        if (this.options.mask && !event.ctrlKey && !this.options.readonly) {
            let inputElement: HTMLInputElement = this.element as HTMLInputElement;
            let startIndex: number = inputElement.selectionStart;
            let endIndex: number = inputElement.selectionEnd;
            let eventArgs: object = {
                Readonly: false,
                Enabled: true,
                Value: inputElement.value,
                selectionEnd: inputElement.selectionEnd,
                selectionStart: inputElement.selectionStart,
                keyValue: event.key,
                IsMultipleDelete: this.ismultipledelete
            };
            event.preventDefault();
            // @ts-ignore-start
            // tslint:disable-next-line:no-any
            this.dotNetRef.invokeMethodAsync(UPDATE_MULTIPLE_DELETION, eventArgs).then((args: any) => {
                // @ts-ignore-end
                inputElement.value = args.inputValue;
                inputElement.selectionStart = inputElement.selectionEnd = args.cursorPosition;
            });
        }
    }
    private pasteHandler(event: ClipboardEvent): void {
        let inputElement: HTMLInputElement = this.element as HTMLInputElement;
        let pasteValue: string = event.clipboardData.getData('text/plain');
        if (pasteValue !== null) {
            let eventArgs: object = {
                Readonly: false,
                Enabled: true,
                Value: inputElement.value,
                selectionEnd: inputElement.selectionEnd,
                selectionStart: inputElement.selectionStart,
                IsMultipleDelete: this.ismultipledelete,
                PasteValue: pasteValue
            };
            event.preventDefault();
            // @ts-ignore-start
            this.dotNetRef.invokeMethodAsync(PASTE_HANDLER, eventArgs).then((index: number) => {
                // @ts-ignore-end
                inputElement.selectionStart = inputElement.selectionEnd = index;

            });
        }
    }
    private cutHandler(event: ClipboardEvent): void {
        if (this.options.mask) {
            let inputElement: HTMLInputElement = this.element as HTMLInputElement;
            let startIndex: number = inputElement.selectionStart;
            let endIndex: number = inputElement.selectionEnd;
            if (startIndex !== endIndex && this.options.mask !== null) {
                this.ismultipledelete = true;
                let selectedText: string = inputElement.value.substring(startIndex, endIndex);
                event.clipboardData.setData('text', selectedText);
                let eventArgs: object = {
                    Value: inputElement.value,
                    selectionEnd: inputElement.selectionEnd,
                    selectionStart: inputElement.selectionStart,
                    IsMultipleDelete: this.ismultipledelete
                };
                // @ts-ignore-start
                // tslint:disable-next-line:no-any
                this.dotNetRef.invokeMethodAsync(UPDATE_MULTIPLE_DELETION, eventArgs).then((args: any) => {
                    // @ts-ignore-end
                    inputElement.value = args.inputValue;
                    inputElement.selectionStart = inputElement.selectionEnd = args.cursorPosition;
                });
                event.preventDefault();
            }
        }
    }
    public propertyChange(options: IMaskOptions): void {
        this.options = options;
    }
}
// tslint:disable
let MaskedTextBox: object = {
    initialize: function initialize(wrapperElement: HTMLElement, element: BlazorMaskElement, dotnetRef: BlazorDotnetObject, options: IMaskOptions) {
        if (element) {
            new SfMaskedTextBox(wrapperElement, element, dotnetRef, options);
        }

        if (element && element.blazor__instance) {
            element.blazor__instance.initialize();
        }
    },
    propertyChange: function propertyChange(inputEle: BlazorMaskElement, options: IMaskOptions) {
        if (inputEle && inputEle.blazor__instance) {
            inputEle.blazor__instance.propertyChange(options);
        }
    },
    focusIn: function focusIn(inputEle: BlazorMaskElement) {
        if (inputEle) {
            inputEle.focus();
        }
    },
    focusOut: function focusOut(inputEle: BlazorMaskElement) {
        if (inputEle) {
            inputEle.blur();
        }
    }
};

interface BlazorMaskElement extends HTMLElement {
    blazor__instance: SfMaskedTextBox;
}

interface IMaskOptions {
    readonly: boolean,
    enabled: boolean,
    value: string,
    selectionEnd: number,
    selectionStart: number,
    isMultipleDelete: boolean,
    mask: string,
    PasteValue: string,
    promptCharacter: string,
    keyValue: string,
    placeHolder: string,
    maskedValue: string,
    floatLabelType: string
}
export default MaskedTextBox;