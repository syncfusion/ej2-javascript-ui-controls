/**
 * FloatLable Moduel
 * Specifies whether to display the floating label above the input element.
 */
import { removeClass, addClass, detach } from '@syncfusion/ej2-base';
import { attributes, isNullOrUndefined, createElement } from '@syncfusion/ej2-base';
import { FloatLabelType } from '@syncfusion/ej2-inputs';

const FLOATLINE: string = 'e-float-line';
const FLOATTEXT: string = 'e-float-text';
const LABELTOP: string = 'e-label-top';
const LABELBOTTOM: string = 'e-label-bottom';

/* eslint-disable valid-jsdoc */

/**
 * Function to create Float Label element.
 *
 * @param {HTMLDivElement} overAllWrapper - Overall wrapper of multiselect.
 * @param {HTMLElement} searchWrapper - Search wrapper of multiselect.
 * @param {HTMLElement} element - The given html element.
 * @param {HTMLInputElement} inputElement - Specify the input wrapper.
 * @param {number[] | string[] | boolean[]} value - Value of the MultiSelect.
 * @param {FloatLabelType} floatLabelType - Specify the FloatLabel Type.
 * @param {string} placeholder - Specify the PlaceHolder text.
 */
export function createFloatLabel(
    overAllWrapper: HTMLDivElement,
    searchWrapper: HTMLElement, element: HTMLElement,
    inputElement: HTMLInputElement, value: number[] | string[] | boolean[], floatLabelType: FloatLabelType,
    placeholder: string): void {
    const floatLinelement: HTMLElement = createElement('span', { className: FLOATLINE });
    const floatLabelElement: HTMLElement = createElement('label', { className: FLOATTEXT });
    if (!isNullOrUndefined(element.id) && element.id !== '') {
        floatLabelElement.id = 'label_' + element.id.replace(/ /g, '_');
        attributes(element, { 'aria-labelledby': floatLabelElement.id });
    }
    if (!isNullOrUndefined(inputElement.placeholder) && inputElement.placeholder !== '') {
        floatLabelElement.innerText = encodePlaceholder(inputElement.placeholder);
        inputElement.removeAttribute('placeholder');
    }
    floatLabelElement.innerText = encodePlaceholder(placeholder);
    searchWrapper.appendChild(floatLinelement);
    searchWrapper.appendChild(floatLabelElement);
    overAllWrapper.classList.add('e-float-input');
    updateFloatLabelState(value, floatLabelElement);
    if (floatLabelType === 'Always') {
        if (floatLabelElement.classList.contains(LABELBOTTOM)) {
            removeClass([floatLabelElement], LABELBOTTOM);
        }
        addClass([floatLabelElement], LABELTOP);
    }
}

/**
 * Function to update status of the Float Label element.
 *
 * @param {string[] | number[] | boolean[]} value - Value of the MultiSelect.
 * @param {HTMLElement} label - Float label element.
 */
export function updateFloatLabelState(value: string[] | number[] | boolean[], label: HTMLElement): void {
    if (value && value.length > 0) {
        addClass([label], LABELTOP);
        removeClass([label], LABELBOTTOM);
    } else {
        removeClass([label], LABELTOP);
        addClass([label], LABELBOTTOM);
    }
}

/**
 * Function to remove Float Label element.
 *
 * @param {HTMLDivElement} overAllWrapper - Overall wrapper of multiselect.
 * @param {HTMLDivElement} componentWrapper - Wrapper element of multiselect.
 * @param {HTMLElement} searchWrapper - Search wrapper of multiselect.
 * @param {HTMLInputElement} inputElement - Specify the input wrapper.
 * @param {number[] | string[] | boolean[]} value - Value of the MultiSelect.
 * @param {FloatLabelType} floatLabelType - Specify the FloatLabel Type.
 * @param {string} placeholder - Specify the PlaceHolder text.
 */
export function removeFloating(
    overAllWrapper: HTMLDivElement,
    componentWrapper: HTMLDivElement,
    searchWrapper: HTMLElement,
    inputElement: HTMLInputElement,
    value: number[] | string[] | boolean[],
    floatLabelType: FloatLabelType,
    placeholder: string): void {
    const placeholderElement: HTMLElement = componentWrapper.querySelector('.' + FLOATTEXT) as HTMLElement;
    const floatLine: HTMLElement = componentWrapper.querySelector('.' + FLOATLINE) as HTMLElement;
    let placeholderText: string;
    if (!isNullOrUndefined(placeholderElement)) {
        placeholderText = placeholderElement.innerText;
        detach(searchWrapper.querySelector('.' + FLOATTEXT));
        setPlaceHolder(value, inputElement, placeholderText);
        if (!isNullOrUndefined(floatLine)) {
            detach(searchWrapper.querySelector('.' + FLOATLINE));
        }
    } else {
        placeholderText = (placeholder !== null) ? placeholder : '';
        setPlaceHolder(value, inputElement, placeholderText);
    }
    overAllWrapper.classList.remove('e-float-input');
}

/**
 * Function to set the placeholder to the element.
 *
 * @param {number[] | string[] | boolean[]} value - Value of the MultiSelect.
 * @param {HTMLInputElement} inputElement - Specify the input wrapper.
 * @param {string} placeholder - Specify the PlaceHolder text.
 */
export function setPlaceHolder(value: number[] | string[] | boolean[], inputElement: HTMLInputElement, placeholder: string): void {
    if (value && value.length) {
        inputElement.placeholder = '';
    } else {
        inputElement.placeholder = placeholder;
    }
}

/**
 * Function for focusing the Float Element.
 *
 * @param {HTMLDivElement} overAllWrapper - Overall wrapper of multiselect.
 * @param {HTMLDivElement} componentWrapper - Wrapper element of multiselect.
 */
export function floatLabelFocus(overAllWrapper: HTMLDivElement, componentWrapper: HTMLDivElement): void {
    overAllWrapper.classList.add('e-input-focus');
    const label: Element = componentWrapper.querySelector('.' + FLOATTEXT);
    if (!isNullOrUndefined(label)) {
        addClass([label], LABELTOP);
        if (label.classList.contains(LABELBOTTOM)) {
            removeClass([label], LABELBOTTOM);
        }
    }
}
/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Function to focus the Float Label element.
 *
 * @param {HTMLDivElement} overAllWrapper - Overall wrapper of multiselect.
 * @param {HTMLDivElement} componentWrapper - Wrapper element of multiselect.
 * @param {number[] | string[] | boolean[]} value - Value of the MultiSelect.
 * @param {FloatLabelType} floatLabelType - Specify the FloatLabel Type.
 * @param {string} placeholder - Specify the PlaceHolder text.
 */
export function floatLabelBlur(
    overAllWrapper: HTMLDivElement,
    componentWrapper: HTMLDivElement,
    value: number[] | string[] | boolean[],
    floatLabelType: FloatLabelType,
    placeholder: string): void {
/* eslint-enable @typescript-eslint/no-unused-vars */
    overAllWrapper.classList.remove('e-input-focus');
    const label: Element = componentWrapper.querySelector('.' + FLOATTEXT);
    if (value && value.length <= 0 && floatLabelType === 'Auto' && !isNullOrUndefined(label)) {
        if (label.classList.contains(LABELTOP)) {
            removeClass([label], LABELTOP);
        }
        addClass([label], LABELBOTTOM);
    }
}
export function encodePlaceholder(placeholder: string): string {
    let result: string = '';
    if (!isNullOrUndefined(placeholder) && placeholder !== '') {
        const spanElement: HTMLElement = document.createElement('span');
        spanElement.innerHTML = '<input  placeholder="' + placeholder + '"/>';
        const hiddenInput: HTMLInputElement = (spanElement.children[0]) as HTMLInputElement;
        result = hiddenInput.placeholder;
    }
    return result;
}
/* eslint-enable valid-jsdoc */
