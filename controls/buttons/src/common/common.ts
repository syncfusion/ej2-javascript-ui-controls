import { detach, getUniqueID, rippleEffect, setValue, attributes } from '@syncfusion/ej2-base';
import { BaseEventArgs, getValue, addClass, deleteObject } from '@syncfusion/ej2-base';
import { CheckBox } from '../check-box';
import { Switch } from '../switch';

/**
 * Initialize wrapper element for angular.
 * @private
 */
export function wrapperInitialize(
    createElement: CreateElementArgs, tag: string, type: string, element: HTMLInputElement, WRAPPER: string,
    role: string): HTMLInputElement {
    let input: HTMLInputElement = element;
    if (element.tagName === tag) {
        let ejInstance: Object = getValue('ej2_instances', element);
        input = createElement('input', { attrs: { 'type': type } }) as HTMLInputElement;
        let props: string[] = ['change', 'cssClass', 'label', 'labelPosition', 'id'];
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

export function getTextNode(element: HTMLElement): Node {
    let node: Node;
    let childnode: NodeList = element.childNodes;
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
 * @private
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
 * @private
 */
export function createCheckBox(
    createElement: CreateElementArgs, enableRipple: boolean = false, options: CheckBoxUtilModel = {}): Element {
    let wrapper: Element = createElement('div', { className: 'e-checkbox-wrapper e-css' });
    if (options.cssClass) {
        addClass([wrapper], options.cssClass.split(' '));
    }
    if (options.enableRtl) {
        wrapper.classList.add('e-rtl');
    }
    if (enableRipple) {
        let rippleSpan: HTMLElement = createElement('span', { className: 'e-ripple-container' });
        rippleEffect(rippleSpan, { isCenterRipple: true, duration: 400 });
        wrapper.appendChild(rippleSpan);
    }
    let frameSpan: Element = createElement('span', { className: 'e-frame e-icons' });
    if (options.checked) {
        frameSpan.classList.add('e-check');
    }
    wrapper.appendChild(frameSpan);
    if (options.label) {
        let labelSpan: Element = createElement('span', { className: 'e-label', innerHTML: options.label });
        wrapper.appendChild(labelSpan);
    }
    return wrapper;
}

export function rippleMouseHandler(e: MouseEvent, rippleSpan: Element): void {
    if (rippleSpan) {
        let event: MouseEvent = document.createEvent('MouseEvents');
        event.initEvent(e.type, false, true);
        rippleSpan.dispatchEvent(event);
    }
}

/**
 * Append hidden input to given element
 * @private
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
}
/**
 * Interface for change event arguments.
 */
export interface ChangeEventArgs extends BaseEventArgs {
    /** Returns the event parameters of the CheckBox or Switch.
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