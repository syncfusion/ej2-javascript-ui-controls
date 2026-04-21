import { addClass, createElement as internalCreateElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { ButtonModel, Button } from '@syncfusion/ej2-buttons';

/**
 * Initialize ButtonGroup CSS component with specified properties.
 * ```html
 * <div id='buttongroup'>
 * <button></button>
 * <button></button>
 * <button></button>
 * </div>
 * ```
 * ```typescript
 * createButtonGroup('#buttongroup', {
 *   cssClass: 'e-outline',
 *   buttons: [
 *       { content: 'Day' },
 *       { content: 'Week' },
 *       { content: 'Work Week'}
 *   ]
 * });
 * ```
 *
 * @param {string} selector
 * @param {CreateButtonGroupModel} options
 * @returns HTMLElement
 */

/**
 * Creates button group.
 *
 * @param {string} selector - Specifies the selector.
 * @param {CreateButtonGroupModel} options - Specifies the button group model.
 * @param {Function} createElement - Specifies the element.
 * @returns {HTMLElement} - Button group element.
 */
export function createButtonGroup(selector: string, options: CreateButtonGroupModel = {}, createElement?: Function): HTMLElement {
    let child: Element;
    let btnElem: Element;
    let nextChild: Element;
    let btnModel: ButtonModel | null;
    if (isNullOrUndefined(createElement)) {
        createElement = internalCreateElement;
    }
    const wrapper: HTMLElement = document.querySelector(selector) as HTMLElement;
    addClass([wrapper],  ['e-btn-group', 'e-css']);
    wrapper.setAttribute('role', 'group');
    const childs: HTMLCollection = wrapper.children;
    options.buttons = options.buttons || [] as ButtonModel[];
    for (let i: number = 0, j: number = 0; j < childs.length; i++, j++) {
        child = childs[j as number];
        btnModel = options.buttons[i as number];
        if (btnModel !== null) {
            if (child.tagName === 'BUTTON') {
                btnElem = child;
            } else {
                btnElem = createElement('label');
                nextChild = childs[j + 1];
                if (nextChild) {
                    wrapper.insertBefore(btnElem, nextChild);
                } else {
                    wrapper.appendChild(btnElem);
                }
                if (child.id) {
                    btnElem.setAttribute('for', child.id);
                }
                if (btnModel && btnModel.disabled) {
                    (child as HTMLInputElement).disabled = true;
                }
                j++;
            }
            if (options.cssClass && btnModel && !btnModel.cssClass) {
                btnModel.cssClass = options.cssClass;
            }
            new Button(btnModel || {}, btnElem as HTMLButtonElement);
        }
    }
    return wrapper;
}

export interface CreateButtonGroupModel {
    cssClass?: string;
    buttons?: (ButtonModel | null)[];
}
