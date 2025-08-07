/* eslint-disable valid-jsdoc, jsdoc/require-jsdoc, jsdoc/require-returns, jsdoc/require-param */
/**
 * MaskedTextBox base module
 */
import { EventHandler, isNullOrUndefined, merge, attributes, addClass, removeClass, Browser, extend } from '@syncfusion/ej2-base';
import { BaseEventArgs } from '@syncfusion/ej2-base';
import { Input } from '../../input/input';

const ERROR: string = 'e-error';
const INPUTGROUP: string = 'e-input-group';
const FLOATINPUT: string = 'e-float-input';
const UTILMASK: string = 'e-utility-mask';
const TOPLABEL: string = 'e-label-top';
const BOTTOMLABEL: string = 'e-label-bottom';

/**
 * @hidden
 * Built-in masking elements collection.
 */
export const regularExpressions: { [key: string]: string } = {
    '0': '[0-9]',
    '9': '[0-9 ]',
    '#': '[0-9 +-]',
    'L': '[A-Za-z]',
    '?': '[A-Za-z ]',
    '&': '[^\x7f ]+',
    'C': '[^\x7f]+',
    'A': '[A-Za-z0-9]',
    'a': '[A-Za-z0-9 ]'
};

interface MaskFocusEventArgs extends BaseEventArgs {
    /** Returns selectionStart value as zero by default */
    selectionStart?: number
    /** Returns selectionEnd value depends on mask length */
    selectionEnd?: number
    /** Returns the original event arguments. */
    event?: MouseEvent | FocusEvent | TouchEvent | KeyboardEvent
    /** Returns the value of MaskedTextBox. */
    value?: string
    /** Returns the maskedValue of MaskedTextBox. */
    maskedValue?: string
    /** Returns the MaskedTextBox container element */
    container?: HTMLElement
}
/**
 * Generate required masking elements to the MaskedTextBox from user mask input.
 *
 * @hidden
 */
export function createMask(): void {
    attributes(this.element, {
        'role': 'textbox', 'autocomplete': 'off', 'autocapitalize': 'off',
        'spellcheck': 'false', 'aria-live': 'assertive'
    });
    if (this.mask) {
        const splitMask: string[] = this.mask.split(']');
        for (let i: number = 0; i < splitMask.length; i++) {
            if (splitMask[i as number][splitMask[i as number].length - 1] === '\\') {
                splitMask[i as number] = splitMask[i as number] + ']';
                const splitInnerMask: string[] = splitMask[i as number].split('[');
                for (let j: number = 0; j < splitInnerMask.length; j++) {
                    if (splitInnerMask[j as number][splitInnerMask[j as number].length - 1] === '\\') {
                        splitInnerMask[j as number] = splitInnerMask[j as number] + '[';
                    }
                    pushIntoRegExpCollec.call(this, splitInnerMask[j as number]);
                }
            } else {
                const splitInnerMask: string[] = splitMask[i as number].split('[');
                if (splitInnerMask.length > 1) {
                    let chkSpace: boolean = false;
                    for (let j: number = 0; j < splitInnerMask.length; j++) {
                        if (splitInnerMask[j as number] === '\\') {
                            this.customRegExpCollec.push('[');
                            this.hiddenMask += splitInnerMask[j as number] + '[';
                        } else if (splitInnerMask[j as number] === '') {
                            chkSpace = true;
                        } else if ((splitInnerMask[j as number] !== '' && chkSpace) || j === splitInnerMask.length - 1) {
                            this.customRegExpCollec.push('[' + splitInnerMask[j as number] + ']');
                            this.hiddenMask += this.promptChar;
                            chkSpace = false;
                        } else {
                            pushIntoRegExpCollec.call(this, splitInnerMask[j as number]);
                        }
                    }
                } else {
                    pushIntoRegExpCollec.call(this, splitInnerMask[0]);
                }
            }
        }
        this.escapeMaskValue = this.hiddenMask;
        this.promptMask = this.hiddenMask.replace(/[09?LCAa#&]/g, this.promptChar);
        if (!isNullOrUndefined(this.customCharacters)) {
            for (let i: number = 0; i < this.promptMask.length; i++) {
                if (!isNullOrUndefined(this.customCharacters[this.promptMask[i as number]])) {
                    /* eslint-disable-next-line security/detect-non-literal-regexp */
                    this.promptMask = this.promptMask.replace(new RegExp(this.promptMask[i as number], 'g'), this.promptChar);
                }
            }
        }
        let escapeNumber: number = 0;
        if (this.hiddenMask.match(new RegExp(/\\/))) {
            for (let i: number = 0; i < this.hiddenMask.length; i++) {
                let j: number = 0;
                if (i >= 1) {
                    j = i;
                }
                escapeNumber = this.hiddenMask.length - this.promptMask.length;
                j = j - escapeNumber;
                if ((i > 0 && this.hiddenMask[i - 1] !== '\\') && (this.hiddenMask[i as number] === '>' ||
                    this.hiddenMask[i as number] === '<' || this.hiddenMask[i as number] === '|')) {
                    this.promptMask = this.promptMask.substring(0, j) +
                        this.promptMask.substring((i + 1) - escapeNumber, this.promptMask.length);
                    this.escapeMaskValue = this.escapeMaskValue.substring(0, j) +
                        this.escapeMaskValue.substring((i + 1) - escapeNumber, this.escapeMaskValue.length);
                }
                if (this.hiddenMask[i as number] === '\\') {
                    this.promptMask = this.promptMask.substring(0, j) + this.hiddenMask[i + 1] +
                        this.promptMask.substring((i + 2) - escapeNumber, this.promptMask.length);
                    this.escapeMaskValue = this.escapeMaskValue.substring(0, j) + this.escapeMaskValue[i + 1] +
                        this.escapeMaskValue.substring((i + 2) - escapeNumber, this.escapeMaskValue.length);
                }
            }
        } else {
            this.promptMask = this.promptMask.replace(/[>|<]/g, '');
            this.escapeMaskValue = this.hiddenMask.replace(/[>|<]/g, '');
        }
        attributes(this.element, { 'aria-invalid': 'false' });
    }
}

/**
 * Apply mask ability with masking elements to the MaskedTextBox.
 *
 * @hidden
 */
export function applyMask(): void {
    setElementValue.call(this, this.promptMask);
    setMaskValue.call(this, this.value);
}

/**
 * To wire required events to the MaskedTextBox.
 *
 * @hidden
 */
export function wireEvents(): void {
    EventHandler.add(this.element, 'keydown', maskInputKeyDownHandler, this);
    EventHandler.add(this.element, 'keypress', maskInputKeyPressHandler, this);
    EventHandler.add(this.element, 'keyup', maskInputKeyUpHandler, this);
    EventHandler.add(this.element, 'input', maskInputHandler, this);
    EventHandler.add(this.element, 'focus', maskInputFocusHandler, this);
    EventHandler.add(this.element, 'blur', maskInputBlurHandler, this);
    EventHandler.add(this.element, 'paste', maskInputPasteHandler, this);
    EventHandler.add(this.element, 'cut', maskInputCutHandler, this);
    EventHandler.add(this.element, 'drop', maskInputDropHandler, this);
    EventHandler.add(this.element, 'mousedown', maskInputMouseDownHandler, this);
    EventHandler.add(this.element, 'mouseup', maskInputMouseUpHandler, this);
    if (this.enabled) {
        bindClearEvent.call(this);
        if (this.formElement) {
            EventHandler.add(this.formElement, 'reset', resetFormHandler, this);
        }
    }
}

/**
 * To unwire events attached to the MaskedTextBox.
 *
 * @hidden
 */
export function unwireEvents(): void {
    EventHandler.remove(this.element, 'keydown', maskInputKeyDownHandler);
    EventHandler.remove(this.element, 'keypress', maskInputKeyPressHandler);
    EventHandler.remove(this.element, 'keyup', maskInputKeyUpHandler);
    EventHandler.remove(this.element, 'input', maskInputHandler);
    EventHandler.remove(this.element, 'focus', maskInputFocusHandler);
    EventHandler.remove(this.element, 'blur', maskInputBlurHandler);
    EventHandler.remove(this.element, 'paste', maskInputPasteHandler);
    EventHandler.remove(this.element, 'cut', maskInputCutHandler);
    EventHandler.remove(this.element, 'drop', maskInputDropHandler);
    EventHandler.remove(this.element, 'mousedown', maskInputMouseDownHandler);
    EventHandler.remove(this.element, 'mouseup', maskInputMouseUpHandler);
    if (this.formElement) {
        EventHandler.remove(this.formElement, 'reset', resetFormHandler);
    }
}

/**
 * To bind required events to the MaskedTextBox clearButton.
 *
 * @hidden
 */
export function bindClearEvent(): void {
    if (this.showClearButton) {
        EventHandler.add(this.inputObj.clearButton, 'mousedown touchstart', resetHandler, this);
    }
}
function resetHandler(e?: MouseEvent): void {
    e.preventDefault();
    if (!this.inputObj.clearButton.classList.contains('e-clear-icon-hide') || (this.inputObj.container.classList.contains('e-static-clear'))) {
        clear.call(this, e);
        this.value = '';
    }
}
function clear(event: MouseEvent): void {
    const value: string = this.element.value;
    setElementValue.call(this, this.promptMask);
    this.redoCollec.unshift({
        value: this.promptMask, startIndex: this.element.selectionStart, endIndex: this.element.selectionEnd
    });
    triggerMaskChangeEvent.call(this, event, value);
    this.element.setSelectionRange(0, 0);
}
function resetFormHandler(): void {
    if (this.element.tagName === 'EJS-MASKEDTEXTBOX') {
        setElementValue.call(this, this.promptMask);
    } else {
        this.value = this.initInputValue;
    }
}

/**
 * To get masked value from the MaskedTextBox.
 *
 * @hidden
 */
export function unstrippedValue(element: HTMLInputElement): string {
    return element.value;
}

/**
 * To extract raw value from the MaskedTextBox.
 *
 * @hidden
 */
export function strippedValue(element: HTMLInputElement, maskValues: string): string {
    let value: string = '';
    let k: number = 0;
    let checkMask: boolean = false;
    const maskValue: string = (!isNullOrUndefined(maskValues)) ? maskValues : (!isNullOrUndefined(element) &&
        !isNullOrUndefined(this)) ? element.value : maskValues;
    if (maskValue !== this.promptMask) {
        for (let i: number = 0; i < this.customRegExpCollec.length; i++) {
            if (checkMask) {
                checkMask = false;
            }
            if (this.customRegExpCollec[k as number] === '>' || this.customRegExpCollec[k as number] === '<' ||
                this.customRegExpCollec[k as number] === '|' || this.customRegExpCollec[k as number] === '\\') {
                --i;
                checkMask = true;
            }
            if (!checkMask) {
                if ((maskValue[i as number] !== this.promptChar) && (!isNullOrUndefined(this.customRegExpCollec[k as number]) &&
                    ((this._callPasteHandler || (!isNullOrUndefined(this.regExpCollec[this.customRegExpCollec[k as number]]) &&
                        !this.maskedRegExp.includes(this.customRegExpCollec[k as number]))) ||
                        (this.customRegExpCollec[k as number].length > 2 && this.customRegExpCollec[k as number][0] === '[' &&
                            this.customRegExpCollec[k as number][this.customRegExpCollec[k as number].length - 1] === ']') ||
                        (!isNullOrUndefined(this.customCharacters) &&
                            (!isNullOrUndefined(this.customCharacters[this.customRegExpCollec[k as number]]))))) && (maskValue !== '')) {
                    value += maskValue[i as number];
                }
            }
            ++k;
        }
    }
    if (this.mask === null || this.mask === '' && this.value !== undefined) {
        value = maskValue;
    }
    return value;
}

function pushIntoRegExpCollec(value: string): void {
    for (let k: number = 0; k < value.length; k++) {
        this.hiddenMask += value[k as number];
        if (value[k as number] !== '\\') {
            this.customRegExpCollec.push(value[k as number]);
        }
        else if (value[k as number] === '\\' && !isNullOrUndefined(this.regExpCollec[value[k as number + 1]])) {
            this.maskedRegExp.push(value[k as number + 1]);
        }
    }
}

export function maskInputMouseDownHandler(): void {
    this.isClicked = true;
}

export function maskInputMouseUpHandler(): void {
    this.isClicked = false;
}

export function maskInputFocusHandler(event: MouseEvent | FocusEvent | TouchEvent | KeyboardEvent): void {
    const inputElement: HTMLInputElement = this.element;
    let startIndex: number = 0;
    const modelValue: string = strippedValue.call(this, inputElement);
    let toAllowForward: boolean = false;
    let toAllowBackward: boolean = false;
    let eventArgs: MaskFocusEventArgs = {
        selectionStart: inputElement.selectionStart,
        event: event,
        value: this.value,
        maskedValue: inputElement.value,
        container: !isNullOrUndefined(this.inputObj) ?  this.inputObj.container : this.inputObj,
        selectionEnd: inputElement.selectionEnd
    };
    if (!this.isClicked) {
        triggerFocus.call(this, eventArgs, inputElement);
    }
    if (this.mask) {
        if (!(!(modelValue === null || modelValue === '') || this.floatLabelType === 'Always' ||
            this.placeholder === null || this.placeholder === '')) {
            inputElement.value = this.promptMask;
        }
        setTimeout(() => {
            if (inputElement.selectionStart === this.promptMask.length ||
                inputElement.value[inputElement.selectionStart] === this.promptChar) {
                toAllowForward = true;
            } else {
                for (let i: number = inputElement.selectionStart; i < this.promptMask.length; i++) {
                    if (inputElement.value[i as number] !== this.promptChar) {
                        if ((inputElement.value[i as number] !== this.promptMask[i as number])) {
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
            const backSelectionStart: number = inputElement.selectionStart - 1;
            if (backSelectionStart === this.promptMask.length - 1 ||
                inputElement.value[backSelectionStart as number] === this.promptChar) {
                toAllowBackward = true;
            } else {
                for (let i: number = backSelectionStart; i >= 0; i--) {
                    if (inputElement.value[i as number] !== this.promptChar) {
                        if ((inputElement.value[i as number] !== this.promptMask[i as number])) {
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
        if ((this.isClicked || (this.floatLabelType !== 'Always' &&
            ((modelValue === null || modelValue === '') &&
                (this.placeholder !== null && this.placeholder !== ''))))) {
            for (startIndex = 0; startIndex < this.promptMask.length; startIndex++) {
                if (inputElement.value[startIndex as number] === this.promptChar) {
                    setTimeout(() => {
                        if (toAllowForward || toAllowBackward) {
                            inputElement.selectionEnd = startIndex;
                            inputElement.selectionStart = startIndex;
                        }
                        eventArgs = {
                            selectionStart: inputElement.selectionStart,
                            event: event,
                            value: this.value,
                            maskedValue: inputElement.value,
                            container: !isNullOrUndefined(this.inputObj) ?  this.inputObj.container : this.inputObj,
                            selectionEnd: inputElement.selectionEnd
                        };
                        triggerFocus.call(this, eventArgs, inputElement);
                    }, 110);
                    break;
                }
            }
            if (isNullOrUndefined(inputElement.value.match(escapeRegExp(this.promptChar)))) {
                eventArgs = {
                    selectionStart: inputElement.selectionStart,
                    event: event,
                    value: this.value,
                    maskedValue: inputElement.value,
                    container: !isNullOrUndefined(this.inputObj) ?  this.inputObj.container : this.inputObj,
                    selectionEnd: inputElement.selectionEnd
                };
                triggerFocus.call(this, eventArgs, inputElement);
            }
            this.isClicked = false;
        }
    }
}

export function triggerFocus(eventArgs: MaskFocusEventArgs, inputElement: HTMLInputElement): void {
    this.trigger('focus', eventArgs, (eventArgs: MaskFocusEventArgs) => {
        inputElement.selectionStart = eventArgs.selectionStart;
        inputElement.selectionEnd = eventArgs.selectionEnd;
    });
}

export function escapeRegExp(text: string): string {
    return !isNullOrUndefined(text) ? text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&') : text;
}

export function maskInputBlurHandler(event: MouseEvent | FocusEvent | TouchEvent | KeyboardEvent): void {
    this.blurEventArgs = {
        event: event,
        value: this.value,
        maskedValue: this.element.value,
        container: !isNullOrUndefined(this.inputObj) ?  this.inputObj.container : this.inputObj
    };
    this.trigger('blur', this.blurEventArgs);
    if (this.mask) {
        this.isFocus = false;
        if (this.placeholder && this.element.value === this.promptMask && this.floatLabelType !== 'Always') {
            setElementValue.call(this, '');
            const labelElement: HTMLElement = <HTMLElement>this.element.parentNode.querySelector('.e-float-text');
            if (this.floatLabelType === 'Auto' && !isNullOrUndefined(labelElement) && labelElement.classList.contains(TOPLABEL)) {
                removeClass([labelElement], TOPLABEL);
            }
        }
    }
}

function maskInputPasteHandler(event: KeyboardEvent): void {
    if (this.mask && !this.readonly) {
        const sIndex: number = this.element.selectionStart;
        const eIndex: number = this.element.selectionEnd;
        const oldValue: string = this.element.value;
        setElementValue.call(this, '');
        this._callPasteHandler = true;
        setTimeout(
            () => {
                let value: string = this.element.value.replace(/ /g, '');
                if (this.redoCollec.length > 0 && this.redoCollec[0].value === this.element.value) {
                    value = strippedValue.call(this, this.element);
                }
                setElementValue.call(this, oldValue);
                this.element.selectionStart = sIndex;
                this.element.selectionEnd = eIndex;
                let i: number = 0;
                this.maskKeyPress = true;
                do {
                    validateValue.call(this, value[i as number], false, null); ++i;
                } while (i < value.length);
                this.maskKeyPress = false;
                this._callPasteHandler = false;
                if (this.element.value === oldValue) {
                    let i: number = 0;
                    this.maskKeyPress = true;
                    do {
                        validateValue.call(this, value[i as number], false, null); ++i;
                    } while (i < value.length);
                    this.maskKeyPress = false;
                } else {
                    triggerMaskChangeEvent.call(this, event, oldValue);
                }
            },
            1);
    }
}

function maskInputCutHandler(event: KeyboardEvent): void {
    if (this.mask && !this.readonly) {
        const preValue: string = this.element.value;
        const sIndex: number = this.element.selectionStart;
        const eIndex: number = this.element.selectionEnd;
        this.undoCollec.push({ value: this.element.value, startIndex: this.element.selectionStart, endIndex: this.element.selectionEnd });
        const value: string = this.element.value.substring(0, sIndex) + this.promptMask.substring(sIndex, eIndex) +
            this.element.value.substring(eIndex);
        setTimeout(
            () => {
                setElementValue.call(this, value);
                this.element.selectionStart = this.element.selectionEnd = sIndex;
                if (this.element.value !== preValue) {
                    triggerMaskChangeEvent.call(this, event, null);
                }
            },
            0);
    }
}

export function maskInputDropHandler(event: MouseEvent): void {
    event.preventDefault();
}

function maskInputHandler(event: KeyboardEvent): void {
    if (Browser.isIE === true && this.element.value === '' && this.floatLabelType === 'Never') {
        return;
    }
    const eventArgs: Object = { ctrlKey: false, keyCode: 229 };
    extend(event, eventArgs);
    if (this.mask) {
        if (this.element.value === '') {
            this.redoCollec.unshift({
                value: this.promptMask, startIndex: this.element.selectionStart, endIndex: this.element.selectionEnd
            });
        }
        if (this.element.value.length === 1) {
            this.element.value = this.element.value + this.promptMask;
            this.element.setSelectionRange(1, 1);
        }
        if ((!this._callPasteHandler && !Browser.isDevice) || this._callPasteHandler) {
            removeMaskInputValues.call(this, event);
        }
        if (this.element.value.length > this.promptMask.length) {
            const startIndex: number = this.element.selectionStart;
            const addedValues: number = this.element.value.length - this.promptMask.length;
            const value: string = this.element.value.substring(startIndex - addedValues, startIndex);
            this.maskKeyPress = false;
            let i: number = 0;
            do {
                validateValue.call(this, value[i as number], event.ctrlKey, event); ++i;
            } while (i < value.length);
            if (this.element.value !== this.preEleVal) {
                triggerMaskChangeEvent.call(this, event, null);
            }
        }
        const val: string = strippedValue.call(this, this.element);
        this.prevValue = val;
        this.value = val;
        if (val === '') {
            setElementValue.call(this, this.promptMask);
            this.element.setSelectionRange(0, 0);
        }
    }
}

function maskInputKeyDownHandler(event: KeyboardEvent): void {
    if (this.mask && !this.readonly) {
        if (event.keyCode !== 229) {
            if (event.ctrlKey && (event.keyCode === 89 || event.keyCode === 90)) {
                event.preventDefault();
            }
            removeMaskInputValues.call(this, event);
        }
        const startValue: string = this.element.value;
        if (event.ctrlKey && (event.keyCode === 89 || event.keyCode === 90)) {
            let collec: { value: string; startIndex: number; endIndex: number };
            if (event.keyCode === 90 && this.undoCollec.length > 0 && startValue !== this.undoCollec[this.undoCollec.length - 1].value) {
                collec = this.undoCollec[this.undoCollec.length - 1];
                this.redoCollec.unshift({
                    value: this.element.value, startIndex: this.element.selectionStart,
                    endIndex: this.element.selectionEnd
                });
                setElementValue.call(this, collec.value);
                this.element.selectionStart = collec.startIndex;
                this.element.selectionEnd = collec.endIndex;
                this.undoCollec.splice(this.undoCollec.length - 1, 1);
            } else if (event.keyCode === 89 && this.redoCollec.length > 0 && startValue !== this.redoCollec[0].value) {
                collec = this.redoCollec[0];
                this.undoCollec.push({
                    value: this.element.value, startIndex: this.element.selectionStart,
                    endIndex: this.element.selectionEnd
                });
                setElementValue.call(this, collec.value);
                this.element.selectionStart = collec.startIndex;
                this.element.selectionEnd = collec.endIndex;
                this.redoCollec.splice(0, 1);
            }
        }
    }
}

export function mobileRemoveFunction(): void {
    let collec: { value: string; startIndex: number; endIndex: number };
    const sIndex: number = this.element.selectionStart;
    const eIndex: number = this.element.selectionEnd;
    if (this.redoCollec.length > 0) {
        collec = this.redoCollec[0];
        setElementValue.call(this, collec.value);
        if ((collec.startIndex - sIndex) === 1) {
            this.element.selectionStart = collec.startIndex;
            this.element.selectionEnd = collec.endIndex;
        } else {
            this.element.selectionStart = sIndex + 1;
            this.element.selectionEnd = eIndex + 1;
        }
    } else {
        setElementValue.call(this, this.promptMask);
        this.element.selectionStart = this.element.selectionEnd = sIndex;
    }
}

function autoFillMaskInputValues(isRemove: boolean, oldEventVal: string, event: KeyboardEvent): boolean {
    if (event.type === 'input') {
        isRemove = false;
        oldEventVal = this.element.value;
        setElementValue.call(this, this.promptMask);
        setMaskValue.call(this, oldEventVal);
    }
    return isRemove;
}

function removeMaskInputValues(event: KeyboardEvent): void {
    let isRemove: boolean = false;
    let oldEventVal: string;
    let isDeleted: boolean = false;
    if (this.element.value.length < this.promptMask.length) {
        isRemove = true;
        oldEventVal = this.element.value;
        isRemove = autoFillMaskInputValues.call(this, isRemove, oldEventVal, event);
        mobileRemoveFunction.call(this);
    }
    if (this.element.value.length >= this.promptMask.length && event.type === 'input') {
        isRemove = autoFillMaskInputValues.call(this, isRemove, oldEventVal, event);
    }
    const initStartIndex: number = this.element.selectionStart;
    const initEndIndex: number = this.element.selectionEnd;
    let startIndex: number = this.element.selectionStart;
    const endIndex: number = this.element.selectionEnd;
    const maskValue: string = this.hiddenMask.replace(/[>|\\<]/g, '');
    let curMask: string = maskValue[startIndex - 1];
    const deleteEndIndex: number = this.element.selectionEnd;
    if (isRemove || event.keyCode === 8 || event.keyCode === 46) {
        this.undoCollec.push({ value: this.element.value, startIndex: this.element.selectionStart, endIndex: endIndex });
        let multipleDel: boolean = false;
        const preValue: string = this.element.value;
        if (startIndex > 0 || ((event.keyCode === 8 || event.keyCode === 46) && startIndex < this.element.value.length
            && ((this.element.selectionEnd - startIndex) !== this.element.value.length))) {
            let index: number = startIndex;
            if (startIndex !== endIndex) {
                startIndex = endIndex;
                if (event.keyCode === 46) {
                    multipleDel = true;
                }
            } else if (event.keyCode === 46) {
                ++index;
            } else {
                --index;
            }
            for (let k: number = startIndex; (event.keyCode === 8 || isRemove || multipleDel) ? k > index : k < index;
                (event.keyCode === 8 || isRemove || multipleDel) ? k-- : k++) {
                for (let i: number = startIndex; (event.keyCode === 8 || isRemove || multipleDel) ? i > 0 : i < this.element.value.length;
                    (event.keyCode === 8 || isRemove || multipleDel) ? i-- : i++) {
                    let sIndex: number;
                    if (((event.keyCode === 8 || multipleDel) && ((initStartIndex !== initEndIndex && initStartIndex !== startIndex) ||
                        (initStartIndex === initEndIndex))) || isRemove) {
                        curMask = maskValue[i - 1];
                        sIndex = startIndex - 1;
                    } else {
                        curMask = maskValue[i as number];
                        sIndex = startIndex;
                        ++startIndex;
                    }
                    let oldValue: string = this.element.value[sIndex as number];
                    if ((isNullOrUndefined(this.regExpCollec[`${curMask}`]) && (!isNullOrUndefined(this.customCharacters)
                        && isNullOrUndefined(this.customCharacters[`${curMask}`]))
                        && ((this.hiddenMask[sIndex as number] !== this.promptChar && this.customRegExpCollec[sIndex as number][0] !== '['
                        && this.customRegExpCollec[sIndex as number][this.customRegExpCollec[sIndex as number].length - 1] !== ']')))
                        || (this.promptMask[sIndex as number] !== this.promptChar && isNullOrUndefined(this.customCharacters))) {
                        this.element.selectionStart = this.element.selectionEnd = sIndex;
                        event.preventDefault();
                        if (event.keyCode === 46 && !multipleDel) {
                            ++this.element.selectionStart;
                        }
                    } else {
                        const value: string = this.element.value;
                        const prompt: string = this.promptChar;
                        const elementValue: string = value.substring(0, sIndex) + prompt + value.substring(startIndex, value.length);
                        setElementValue.call(this, elementValue);
                        event.preventDefault();
                        if (event.keyCode === 46 && !multipleDel) {
                            sIndex++;
                        }
                        this.element.selectionStart = this.element.selectionEnd = sIndex;
                        isDeleted = true;
                    }
                    startIndex = this.element.selectionStart;
                    if ((!isDeleted && event.keyCode === 8) || multipleDel || (!isDeleted && !(event.keyCode === 46))) {
                        sIndex = startIndex - 1;
                    } else {
                        sIndex = startIndex;
                        isDeleted = false;
                    }
                    oldValue = this.element.value[sIndex as number];
                    if (((initStartIndex !== initEndIndex) && (this.element.selectionStart === initStartIndex))
                        || (this.promptMask[sIndex as number] === this.promptChar) || ((oldValue !== this.promptMask[sIndex as number]) &&
                            (this.promptMask[sIndex as number] !== this.promptChar) && !isNullOrUndefined(this.customCharacters))) {
                        break;
                    }
                }
            }
        }
        if (event.keyCode === 46 && multipleDel && isDeleted) {
            this.element.selectionStart = this.element.selectionEnd = deleteEndIndex;
        }
        if (this.element.selectionStart === 0 && (this.element.selectionEnd === this.element.value.length)) {
            setElementValue.call(this, this.promptMask);
            event.preventDefault();
            this.element.selectionStart = this.element.selectionEnd = startIndex;
        }
        this.redoCollec.unshift({
            value: this.element.value, startIndex: this.element.selectionStart,
            endIndex: this.element.selectionEnd
        });
        if (this.element.value !== preValue) {
            triggerMaskChangeEvent.call(this, event, oldEventVal);
        }
    }
}

function maskInputKeyPressHandler(event: KeyboardEvent): void {
    if (this.mask && !this.readonly) {
        const oldValue: string = this.element.value;
        if (!(event.ctrlKey || event.metaKey) || ((event.ctrlKey || event.metaKey) && event.code !== 'KeyA' && event.code !== 'KeyY'
            && event.code !== 'KeyZ' && event.code !== 'KeyX' && event.code !== 'KeyC' && event.code !== 'KeyV')) {
            this.maskKeyPress = true;
            let key: string = event.key;
            if (key === 'Spacebar') {
                key = String.fromCharCode(event.keyCode);
            }
            if (!key) {
                this.isIosInvalid = true;
                validateValue.call(this, String.fromCharCode(event.keyCode), event.ctrlKey, event);
                event.preventDefault();
                this.isIosInvalid = false;
            } else if (key && key.length === 1) {
                validateValue.call(this, key, event.ctrlKey, event);
                event.preventDefault();
            }
            if (event.keyCode === 32 && key === ' ' && this.promptChar === ' ') {
                this.element.selectionStart = this.element.selectionEnd = this.element.selectionStart - key.length;
            }
        }
        if (this.element.value !== oldValue) {
            triggerMaskChangeEvent.call(this, event, oldValue);
        }
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function triggerMaskChangeEvent(event: KeyboardEvent, oldValue: string): void {
    const prevOnChange : boolean = this.isProtectedOnChange;
    if (!isNullOrUndefined(this.changeEventArgs) && !this.isInitial) {
        const eventArgs: Object = {};
        this.changeEventArgs = { value: this.element.value, maskedValue: this.element.value, isInteraction: false, isInteracted: false };
        if (this.mask) {
            this.changeEventArgs.value = strippedValue.call(this, this.element);
        }
        if (!isNullOrUndefined(event)) {
            this.changeEventArgs.isInteracted = true;
            this.changeEventArgs.isInteraction = true;
            this.changeEventArgs.event = event;
        }
        this.isProtectedOnChange = true;
        this.value = this.changeEventArgs.value;
        this.isProtectedOnChange = prevOnChange;
        merge(eventArgs, this.changeEventArgs);
        /* istanbul ignore next */
        if (this.isAngular && this.preventChange) {
            this.preventChange = false;
        } else {
            this.trigger('change', eventArgs);
        }
    }
    this.preEleVal = this.element.value;
    this.prevValue = strippedValue.call(this, this.element);
}

function maskInputKeyUpHandler(event: KeyboardEvent): void {
    if (this.mask && !this.readonly) {
        let collec: { value: string; startIndex: number; endIndex: number };
        if (!this.maskKeyPress && event.keyCode === 229) {
            let oldEventVal: string;
            if (this.element.value.length === 1) {
                this.element.value = this.element.value + this.promptMask;
                this.element.setSelectionRange(1, 1);
            }
            if (this.element.value.length > this.promptMask.length) {
                const startIndex: number = this.element.selectionStart;
                const addedValues: number = this.element.value.length - this.promptMask.length;
                let val: string = this.element.value.substring(startIndex - addedValues, startIndex);
                if (this.undoCollec.length > 0) {
                    collec = this.undoCollec[this.undoCollec.length - 1];
                    const startIndex: number = this.element.selectionStart;
                    oldEventVal = collec.value;
                    const oldVal: string = collec.value.substring(startIndex - addedValues, startIndex);
                    collec = this.redoCollec[0];
                    val = val.trim();
                    const isSpace: boolean = Browser.isAndroid && val === '';
                    if (!isSpace && oldVal !== val && collec.value.substring(startIndex - addedValues, startIndex) !== val) {
                        validateValue.call(this, val, event.ctrlKey, event);
                    } else if (isSpace) {
                        preventUnsupportedValues.call(
                            this, event, startIndex - 1, this.element.selectionEnd - 1, val, event.ctrlKey, false);
                    }
                } else {
                    oldEventVal = this.promptMask;
                    validateValue.call(this, val, event.ctrlKey, event);
                }
                this.maskKeyPress = false;
                triggerMaskChangeEvent.call(this, event, oldEventVal);
            }
        } else {
            removeMaskError.call(this);
        }
        const val: string = strippedValue.call(this, this.element);
        if (!((this.element.selectionStart === 0) && (this.promptMask === this.element.value) && val === '')
            || (val === '' && this.value !== val)) {
            this.prevValue = val;
            this.value = val;
        }
    } else {
        triggerMaskChangeEvent.call(this, event);
    }
    if (this.element.selectionStart === 0 && this.element.selectionEnd === 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const temp: any = this.element;
        setTimeout(
            () => {
                temp.setSelectionRange(0, 0);
            },
            0);
    }
}

function mobileSwipeCheck(key: string): void {
    if (key.length > 1 && ((this.promptMask.length + key.length) < this.element.value.length)) {
        const elementValue: string = this.redoCollec[0].value.substring(0, this.redoCollec[0].startIndex) + key +
            this.redoCollec[0].value.substring(this.redoCollec[0].startIndex, this.redoCollec[0].value.length);
        setElementValue.call(this, elementValue);
        this.element.selectionStart = this.element.selectionEnd = this.redoCollec[0].startIndex + key.length;
    }
    this.element.selectionStart = this.element.selectionStart - key.length;
    this.element.selectionEnd = this.element.selectionEnd - key.length;
}

function mobileValidation(key: string): void {
    if (!this.maskKeyPress) {
        mobileSwipeCheck.call(this, key);
    }
}

function validateValue(key: string, isCtrlKey: boolean, event: KeyboardEvent): void {
    mobileValidation.call(this, key);
    if (isNullOrUndefined(this) || isNullOrUndefined(key)) {
        return;
    }
    let startIndex: number = this.element.selectionStart;
    const initStartIndex: number = startIndex;
    let curMask: string;
    let allowText: boolean = false;
    const value: string = this.element.value;
    let eventOldVal: string;
    let prevSupport: boolean = false;
    let isEqualVal: boolean = false;
    for (let k: number = 0; k < key.length; k++) {
        const keyValue: string = key[k as number];
        startIndex = this.element.selectionStart;
        if (!this.maskKeyPress && initStartIndex === startIndex) {
            startIndex = startIndex + k;
        }
        if ((!this.maskKeyPress || startIndex < this.promptMask.length)) {
            for (let i: number = startIndex; i < this.promptMask.length; i++) {
                const maskValue: string = this.escapeMaskValue;
                curMask = maskValue[startIndex as number];
                if (this.hiddenMask[startIndex as number] === '\\' && this.hiddenMask[startIndex + 1] === key) {
                    isEqualVal = true;
                }
                if ((isNullOrUndefined(this.regExpCollec[`${curMask}`]) && (isNullOrUndefined(this.customCharacters)
                    || (!isNullOrUndefined(this.customCharacters) && isNullOrUndefined(this.customCharacters[`${curMask}`])))
                    && ((this.hiddenMask[startIndex as number] !== this.promptChar && this.customRegExpCollec[startIndex as number][0] !== '['
                        && this.customRegExpCollec[startIndex as number][this.customRegExpCollec[startIndex as number].length - 1] !== ']')))
                    || ((this.promptMask[startIndex as number] !== this.promptChar) && isNullOrUndefined(this.customCharacters))
                    || (this.promptChar === curMask && this.escapeMaskValue === this.mask)) {
                    this.element.selectionStart = this.element.selectionEnd = startIndex + 1;
                    startIndex = this.element.selectionStart;
                    curMask = this.hiddenMask[startIndex as number];
                }
            }
            if (!isNullOrUndefined(this.customCharacters) && !isNullOrUndefined(this.customCharacters[`${curMask}`])) {
                const customValStr: string = <string>this.customCharacters[`${curMask}`];
                const customValArr: string[] = customValStr.split(',');
                for (let i: number = 0; i < customValArr.length; i++) {
                    /* eslint-disable-next-line security/detect-non-literal-regexp */
                    if (keyValue.match(new RegExp('[' + customValArr[i as number] + ']'))) {
                        allowText = true;
                        break;
                    }
                }
            /* eslint-disable-next-line security/detect-non-literal-regexp */
            } else if (!isNullOrUndefined(this.regExpCollec[`${curMask}`]) && keyValue.match(new RegExp(this.regExpCollec[`${curMask}`]))
                && this.promptMask[startIndex as number] === this.promptChar) {
                allowText = true;
            } else if (this.promptMask[startIndex as number] === this.promptChar && this.customRegExpCollec[startIndex as number][0] === '['
                && this.customRegExpCollec[startIndex as number][this.customRegExpCollec[startIndex as number].length - 1] === ']'
                /* eslint-disable-next-line security/detect-non-literal-regexp */
                && keyValue.match(new RegExp(this.customRegExpCollec[startIndex as number]))) {
                allowText = true;
            }
            if ((!this.maskKeyPress || startIndex < this.hiddenMask.length) && allowText) {
                if (k === 0) {
                    if (this.maskKeyPress) {
                        this.undoCollec.push({ value: value, startIndex: startIndex, endIndex: startIndex });
                    } else {
                        const sIndex: number = this.element.selectionStart;
                        const eIndex: number = this.element.selectionEnd;
                        if (this.redoCollec.length > 0) {
                            eventOldVal = this.redoCollec[0].value;
                            setElementValue.call(this, eventOldVal);
                            this.undoCollec.push(this.redoCollec[0]);
                        } else {
                            this.undoCollec.push({ value: this.promptMask, startIndex: startIndex, endIndex: startIndex });
                            eventOldVal = this.promptMask;
                            setElementValue.call(this, eventOldVal);
                        }
                        this.element.selectionStart = sIndex;
                        this.element.selectionEnd = eIndex;
                    }
                }
                startIndex = this.element.selectionStart;
                applySupportedValues.call(this, event, startIndex, keyValue, eventOldVal, isEqualVal);
                prevSupport = true;
                if (k === key.length - 1) {
                    this.redoCollec.unshift({
                        value: this.element.value, startIndex: this.element.selectionStart, endIndex: this.element.selectionEnd
                    });
                }
                allowText = false;
            } else {
                startIndex = this.element.selectionStart;
                preventUnsupportedValues.call(this, event, startIndex, initStartIndex, key, isCtrlKey, prevSupport);
            }
            if (k === key.length - 1 && !allowText) {
                if (!Browser.isAndroid || (Browser.isAndroid && startIndex < this.promptMask.length)) {
                    this.redoCollec.unshift({
                        value: this.element.value, startIndex: this.element.selectionStart, endIndex: this.element.selectionEnd
                    });
                }
            }
        } else {
            if (key.length === 1 && !isCtrlKey && !isNullOrUndefined(event)) {
                addMaskErrorClass.call(this);
            }
        }
    }
}

function applySupportedValues(event: KeyboardEvent, startIndex: number, keyValue: string, eventOldVal: string, isEqualVal: boolean): void {
    if (this.hiddenMask.length > this.promptMask.length) {
        keyValue = changeToLowerUpperCase.call(this, keyValue, this.element.value);
    }
    if (!isEqualVal) {
        const value: string = this.element.value;
        const elementValue: string = value.substring(0, startIndex) + keyValue + value.substring(startIndex + 1, value.length);
        setElementValue.call(this, elementValue);
        this.element.selectionStart = this.element.selectionEnd = startIndex + 1;
    }
}

function preventUnsupportedValues(event: KeyboardEvent, sIdx: number, idx: number, key: string, ctrl: boolean, chkSupport: boolean): void {
    if (!this.maskKeyPress) {
        const value: string = this.element.value;
        if (sIdx >= this.promptMask.length) {
            setElementValue.call(this, value.substring(0, sIdx));
        } else {
            if (idx === sIdx) {
                setElementValue.call(this, value.substring(0, sIdx) + value.substring(sIdx + 1, value.length));
            } else {
                if (this.promptMask.length === this.element.value.length) {
                    setElementValue.call(this, value.substring(0, sIdx) + value.substring(sIdx, value.length));
                } else {
                    setElementValue.call(this, value.substring(0, idx) + value.substring(idx + 1, value.length));
                }
            }
            this.element.selectionStart = this.element.selectionEnd = (chkSupport ||
                this.element.value[idx as number] !== this.promptChar) ? sIdx : idx;
        }
        addMaskErrorClass.call(this);
    }
    if (key.length === 1 && !ctrl && !isNullOrUndefined(event)) {
        addMaskErrorClass.call(this);
    }
}

function addMaskErrorClass(): void {
    const parentElement: HTMLElement = <HTMLElement>this.element.parentNode;
    let timer: number = 200;
    if (parentElement.classList.contains(INPUTGROUP) || parentElement.classList.contains(FLOATINPUT)) {
        addClass([parentElement], ERROR);
    } else {
        addClass([this.element], ERROR);
    }
    if (this.isIosInvalid === true) {
        timer = 400;
    }
    attributes(this.element, { 'aria-invalid': 'true' });
    setTimeout(
        () => {
            if (!this.maskKeyPress) {
                removeMaskError.call(this);
            }
        },
        timer);
}

function removeMaskError(): void {
    const parentElement: HTMLElement = <HTMLElement>this.element.parentNode;
    if (!isNullOrUndefined( parentElement)) {
        removeClass([parentElement], ERROR);
    }
    removeClass([this.element], ERROR);
    attributes(this.element, { 'aria-invalid': 'false' });
}

/**
 * Validates user input using masking elements '<' , '>' and '|'.
 *
 * @hidden
 */
function changeToLowerUpperCase(key: string, value: string): string {
    let promptMask: string;
    let i: number;
    let curVal: string = value;
    let caseCount: number = 0;
    for (i = 0; i < this.hiddenMask.length; i++) {
        if (this.hiddenMask[i as number] === '\\') {
            promptMask = curVal.substring(0, i) + '\\' + curVal.substring(i, curVal.length);
        }
        if (this.hiddenMask[i as number] === '>' || this.hiddenMask[i as number] === '<' || this.hiddenMask[i as number] === '|') {
            if (this.hiddenMask[i as number] !== curVal[i as number]) {
                promptMask = curVal.substring(0, i) + this.hiddenMask[i as number] + curVal.substring(i, curVal.length);
            }
            ++caseCount;
        }
        if (promptMask) {
            if (((promptMask[i as number] === this.promptChar) && (i > this.element.selectionStart)) ||
                (this.element.value.indexOf(this.promptChar) < 0 && (this.element.selectionStart + caseCount) === i)) {
                caseCount = 0;
                break;
            }
            curVal = promptMask;
        }
    }
    while (i >= 0 && promptMask) {
        if (i === 0 || promptMask[i - 1] !== '\\') {
            if (promptMask[i as number] === '>') {
                key = key.toUpperCase();
                break;
            } else if (promptMask[i as number] === '<') {
                key = key.toLowerCase();
                break;
            } else if (promptMask[i as number] === '|') {
                break;
            }
        }
        --i;
    }
    return key;
}

/**
 * To set updated values in the MaskedTextBox.
 *
 * @hidden
 */
export function setMaskValue(val?: string): void {
    if (this.mask && val !== undefined && (this.prevValue === undefined || this.prevValue !== val)) {
        this.maskKeyPress = true;
        setElementValue.call(this, this.promptMask);
        if (val !== '' && !(val === null && this.floatLabelType === 'Never' && this.placeholder)) {
            this.element.selectionStart = 0;
            this.element.selectionEnd = 0;
        }
        if (val !== null) {
            for (let i: number = 0; i < val.length; i++) {
                validateValue.call(this, val[i as number], false, null);
            }
        }
        const newVal: string = strippedValue.call(this, this.element);
        this.prevValue = newVal;
        this.value = newVal;
        triggerMaskChangeEvent.call(this, null, null);
        this.maskKeyPress = false;
        const labelElement: HTMLElement = <HTMLElement>this.element.parentNode.querySelector('.e-float-text');
        if (this.element.value === this.promptMask && this.floatLabelType === 'Auto' && this.placeholder &&
            !isNullOrUndefined(labelElement) && labelElement.classList.contains(TOPLABEL) && !this.isFocus) {
            removeClass([labelElement], TOPLABEL);
            addClass([labelElement], BOTTOMLABEL);
            setElementValue.call(this, '');
        }
    }
    if (this.mask === null || this.mask === '' && this.value !== undefined) {
        setElementValue.call(this, this.value);
    }
}

/**
 * To set updated values in the input element.
 *
 * @hidden
 */
export function setElementValue(val: string, element?: HTMLInputElement): void {
    if (!this.isFocus && this.floatLabelType === 'Auto' && this.placeholder && isNullOrUndefined(this.value)) {
        val = '';
    }
    const value: string = strippedValue.call(this, (element ? element : this.element), val);
    if (value === null || value === '') {
        Input.setValue(val, (element ? element : this.element), this.floatLabelType, false);
        if (this.showClearButton) {
            this.inputObj.clearButton.classList.add('e-clear-icon-hide');
        }
    } else {
        Input.setValue(val, (element ? element : this.element), this.floatLabelType, this.showClearButton);
    }
}

/**
 * Provide mask support to input textbox through utility method.
 *
 * @hidden
 */
export function maskInput(args: MaskInputArgs): void {
    const inputEle: Object = getMaskInput(args);
    applyMask.call(inputEle);
    const val: string = strippedValue.call(this, this.element);
    this.prevValue = val;
    this.value = val;
    if (args.mask) {
        unwireEvents.call(inputEle);
        wireEvents.call(inputEle);
    }
}

function getMaskInput(args: MaskInputArgs): Object {
    addClass([args.element], UTILMASK);
    const inputEle: Object = {
        element: args.element,
        mask: args.mask,
        promptMask: '',
        hiddenMask: '',
        escapeMaskValue: '',
        promptChar: args.promptChar ? (args.promptChar.length > 1) ? args.promptChar = args.promptChar[0]
            : args.promptChar : '_',
        value: args.value ? args.value : null,
        regExpCollec: regularExpressions,
        customRegExpCollec: [],
        customCharacters: args.customCharacters,
        undoCollec: [],
        redoCollec: [],
        maskKeyPress: false,
        prevValue: ''
    };
    createMask.call(inputEle);
    return inputEle;
}

/**
 * Gets raw value of the textbox which has been masked through utility method.
 *
 * @hidden
 */
export function getVal(args: GetValueInputArgs): string {
    return strippedValue.call(getUtilMaskEle(args), args.element);
}

/**
 * Gets masked value of the textbox which has been masked through utility method.
 *
 * @hidden
 */
export function getMaskedVal(args: GetValueInputArgs): string {
    return unstrippedValue.call(getUtilMaskEle(args), args.element);
}

function getUtilMaskEle(args: GetValueInputArgs): Object {
    let inputEle: Object;
    if (!isNullOrUndefined(args) && args.element.classList.contains(UTILMASK)) {
        inputEle = getMaskInput(args);
    }
    return inputEle;
}

/**
 * Arguments to get the raw and masked value of MaskedTextBox which has been masked through utility method.
 *
 * @hidden
 */
export interface GetValueInputArgs {
    element: HTMLInputElement
    mask: string
    promptChar?: string
    customCharacters?: { [x: string]: Object }
}

/**
 * Arguments to mask input textbox through utility method.
 *
 * @hidden
 */
export interface MaskInputArgs extends GetValueInputArgs {
    value?: string
}

/**
 * Arguments to perform undo and redo functionalities.
 *
 * @hidden
 */
export class MaskUndo {
    public value: string;
    public startIndex: number;
    public endIndex: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const maskUndo: MaskUndo = new MaskUndo();

/* eslint-enable valid-jsdoc, jsdoc/require-jsdoc, jsdoc/require-returns, jsdoc/require-param */
