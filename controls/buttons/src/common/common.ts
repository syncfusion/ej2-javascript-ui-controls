import { detach, getUniqueID, rippleEffect, setValue, attributes } from '@syncfusion/ej2-base';
import { BaseEventArgs, getValue, addClass, deleteObject } from '@syncfusion/ej2-base';
import { CheckBox } from '../check-box';
import { Switch } from '../switch';

/**
 * Initialize wrapper element for angular.
 *
 * @private
 *
 * @param {CreateElementArgs} createElement - Specifies created element args
 * @param {string} tag - Specifies tag name
 * @param {string} type - Specifies type name
 * @param {HTMLInputElement} element - Specifies input element
 * @param {string} WRAPPER - Specifies wrapper element
 * @param {string} role - Specifies role
 * @returns {HTMLInputElement} - Input Element
 */
export function wrapperInitialize(
    createElement: CreateElementArgs, tag: string, type: string, element: HTMLInputElement, WRAPPER: string,
    role: string): HTMLInputElement {
    let input: HTMLInputElement = element;
    if (element.tagName === tag) {
        const ejInstance: Object = getValue('ej2_instances', element);
        input = createElement('input', { attrs: { 'type': type } }) as HTMLInputElement;
        const props: string[] = ['change', 'cssClass', 'label', 'labelPosition', 'id'];
        for (let index: number = 0, len: number = element.attributes.length; index < len; index++) {
            if (props.indexOf(element.attributes[index].nodeName) === -1) {
                input.setAttribute(element.attributes[index].nodeName, element.attributes[index].nodeValue);
            }
        }
        attributes(element, { 'class': WRAPPER, 'role': role, 'aria-checked': 'false' });
        element.appendChild(input);
        setValue('ej2_instances', ejInstance, input);
        deleteObject(element, 'ej2_instances');
    }
    return input;
}

/**
 * Get the text node.
 *
 * @param {HTMLElement} element - Specifies html element
 * @private
 * @returns {Node} - Text node.
 */
export function getTextNode(element: HTMLElement): Node {
    let node: Node;
    const childnode: NodeList = element.childNodes;
    for (let i: number = 0; i < childnode.length; i++) {
        node = childnode[i];
        if (node.nodeType === 3) {
            return node;
        }
    }
    return null;
}

/**
 * Destroy the button components.
 *
 * @private
 * @param {Switch | CheckBox} ejInst - Specifies eJ2 Instance
 * @param {Element} wrapper - Specifies wrapper element
 * @param {string} tagName - Specifies tag name
 * @returns {void}
 */
export function destroy(ejInst: Switch | CheckBox, wrapper: Element, tagName: string): void {
    if (tagName === 'INPUT') {
        wrapper.parentNode.insertBefore(ejInst.element, wrapper);
        detach(wrapper);
        ejInst.element.checked = false;
        ['name', 'value', 'disabled'].forEach((key: string) => {
            ejInst.element.removeAttribute(key);
        });
    } else {
        ['role', 'aria-checked', 'class'].forEach((key: string) => {
            wrapper.removeAttribute(key);
        });
        wrapper.innerHTML = '';
    }
}

/**
 * Initialize control pre rendering.
 *
 * @private
 * @param {Switch | CheckBox} proxy - Specifies proxy
 * @param {string} control - Specifies control
 * @param {string} wrapper - Specifies wrapper element
 * @param {HTMLInputElement} element - Specifies input element
 * @param {string} moduleName - Specifies module name
 * @returns {void}
 */
export function preRender(proxy: Switch | CheckBox, control: string, wrapper: string, element: HTMLInputElement, moduleName: string): void {
    element = wrapperInitialize(proxy.createElement, control, 'checkbox', element, wrapper, moduleName);
    proxy.element = element;
    if (proxy.element.getAttribute('type') !== 'checkbox') {
        proxy.element.setAttribute('type', 'checkbox');
    }
    if (!proxy.element.id) {
        proxy.element.id = getUniqueID('e-' + moduleName);
    }
}

/**
 * Creates CheckBox component UI with theming and ripple support.
 *
 * @private
 * @param {CreateElementArgs} createElement - Specifies Created Element args
 * @param {boolean} enableRipple - Specifies ripple effect
 * @param {CheckBoxUtilModel} options - Specifies Checkbox util Model
 * @returns {Element} - Checkbox Element
 */
export function createCheckBox(
    createElement: CreateElementArgs, enableRipple: boolean = false, options: CheckBoxUtilModel = {}): Element {
    const wrapper: Element = createElement('div', { className: 'e-checkbox-wrapper e-css' });
    if (options.cssClass) {
        addClass([wrapper], options.cssClass.split(' '));
    }
    if (options.enableRtl) {
        wrapper.classList.add('e-rtl');
    }
    if (enableRipple) {
        const rippleSpan: HTMLElement = createElement('span', { className: 'e-ripple-container' });
        rippleEffect(rippleSpan, { isCenterRipple: true, duration: 400 });
        wrapper.appendChild(rippleSpan);
    }
    const frameSpan: Element = createElement('span', { className: 'e-frame e-icons' });
    if (options.checked) {
        frameSpan.classList.add('e-check');
    }
    wrapper.appendChild(frameSpan);
    if (options.label) {
        const labelSpan: Element = createElement('span', { className: 'e-label'});
        if (options.disableHtmlEncode) {
            labelSpan.textContent = options.label;
        } else {
            labelSpan.innerHTML = options.label;
        }
        wrapper.appendChild(labelSpan);
    }
    return wrapper;
}

/**
 * Handles ripple mouse.
 *
 * @private
 * @param {MouseEvent} e - Specifies mouse event
 * @param {Element} rippleSpan - Specifies Ripple span element
 * @returns {void}
 */
export function rippleMouseHandler(e: MouseEvent, rippleSpan: Element): void {
    if (rippleSpan) {
        const event: MouseEvent = document.createEvent('MouseEvents');
        event.initEvent(e.type, false, true);
        rippleSpan.dispatchEvent(event);
    }
}

/**
 * Append hidden input to given element
 *
 * @private
 * @param {Switch | CheckBox} proxy - Specifies Proxy
 * @param {Element} wrap - Specifies Wrapper ELement
 * @returns {void}
 */
export function setHiddenInput(proxy: Switch | CheckBox, wrap: Element): void {
    if (proxy.element.getAttribute('ejs-for')) {
        wrap.appendChild(proxy.createElement('input', {
            attrs: { 'name': proxy.name || proxy.element.name, 'value': 'false', 'type': 'hidden' }
        }));
    }
}

export interface CheckBoxUtilModel {
    checked?: boolean;
    label?: string;
    enableRtl?: boolean;
    cssClass?: string;
    disableHtmlEncode?: boolean;
}
/**
 * Interface for change event arguments.
 */
export interface ChangeEventArgs extends BaseEventArgs {
    /** Returns the event parameters of the CheckBox or Switch.
     *
     * @blazorType MouseEventArgs
     */
    event?: Event;
    /** Returns the checked value of the CheckBox or Switch. */
    checked?: boolean;
}

export type CreateElementArgs = (
    tag: string,
    prop?: { id?: string, className?: string, innerHTML?: string, styles?: string, attrs?: { [key: string]: string } }
) => HTMLElement;
