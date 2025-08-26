import { ChildProperty, extend, deleteObject, Property, BaseEventArgs, addClass, isNullOrUndefined } from '@syncfusion/ej2-base';
import { ItemModel } from './common-model';
/**
 * Defines the icon position of Split Button.
 */
export type SplitButtonIconPosition = 'Left' | 'Top';

/**
 * @param {Object} props - Specifies the properties
 * @param {string[]} model - Specifies the model
 * @returns {Object} Component Model
 */
export function getModel(props: Object, model: string[]): Object {

    const obj: Object = extend({}, props);
    for (const prop of Object.keys(obj)) {
        if ((model).indexOf(prop) < 0) {
            deleteObject(obj, prop);
        }
    }

    return obj as Object;
}

/** @hidden
 * @param {HTMLElement} ul - Specifies the UL element
 * @param {number} keyCode - Specifies the keycode
 * @returns {void}
 */
export function upDownKeyHandler(ul: HTMLElement, keyCode: number): void {
    const defaultIdx: number = keyCode === 40 ? 0 : ul.childElementCount - 1;
    let liIdx: number = defaultIdx;
    let li: Element;
    const selectedLi: Element = ul.querySelector('.e-selected');
    if (selectedLi) { selectedLi.classList.remove('e-selected'); }
    for (let i: number = 0, len: number = ul.children.length; i < len; i++) {
        if (ul.children[i as number].classList.contains('e-focused')) {
            li = ul.children[i as number];
            liIdx = i;
            li.classList.remove('e-focused');
            if (keyCode === 40) {
                liIdx++;
            } else {
                liIdx--;
            }
            if (liIdx === (keyCode === 40 ? ul.childElementCount : -1)) {
                liIdx = defaultIdx;
            }
        }
    }
    li = ul.children[liIdx as number];
    liIdx = isValidLI(ul, li, liIdx, keyCode);
    if (liIdx !== -1) {
        addClass([ul.children[liIdx as number]], 'e-focused');
        (ul.children[liIdx as number] as HTMLElement).focus();
    }
}

/**
 * Get Valid LI element
 *
 * @param {HTMLElement} ul - Specifies the UL element
 * @param {Element} li - Specifies the LI element
 * @param {number} index - Specifies the index
 * @param {number} keyCode - Specifies the keycode
 * @param {number} count - Specifies the count
 * @returns {number} - Index
 */
function isValidLI(ul: HTMLElement, li: Element, index: number, keyCode: number, count: number = 0): number {
    if (li.classList.contains('e-separator') || li.classList.contains('e-disabled')) {
        if (index === (keyCode === 40 ? ul.childElementCount - 1 : 0)) {
            index = keyCode === 40 ? 0 : ul.childElementCount - 1;
        } else {
            if (keyCode === 40) {
                index++;
            } else {
                index--;
            }
        }
    }
    li = ul.children[index as number];
    if (li.classList.contains('e-separator') || li.classList.contains('e-disabled')) {
        count++;
        if (count === ul.childElementCount) {
            return index = -1;
        }
        index = isValidLI(ul, li, index, keyCode, count);
    }
    return index;
}

/** @hidden
 * @param {HTMLElement} popup - Specifies the popup element.
 * @param {boolean} blankIcon - Specifies the blankIcon value.
 * @returns {void}
 */
export function setBlankIconStyle(popup: HTMLElement, blankIcon?: boolean): void {
    const blankIconList: HTMLElement[] = [].slice.call(popup.getElementsByClassName('e-blank-icon'));
    if (blankIcon) {
        const menuItem: HTMLElement[] = [].slice.call(popup.getElementsByClassName('e-item'));
        menuItem.forEach((li: HTMLElement): void => {
            if (li.style.paddingLeft || li.style.paddingRight) {
                li.removeAttribute('style');
            }
        });
    }
    if (!blankIconList.length) { return; }
    let iconLi: HTMLElement = popup.querySelector('.e-item:not(.e-blank-icon):not(.e-separator)') as HTMLElement;
    if (isNullOrUndefined(iconLi)) {return; }
    if (iconLi.classList.contains('e-url')) { iconLi = iconLi.querySelector('.e-menu-url'); }
    const icon: HTMLElement = iconLi.querySelector('.e-menu-icon') as HTMLElement;
    let cssProp: { padding: string, margin: string };
    const enableRtl: boolean = popup.classList.contains('e-rtl');
    if (enableRtl) {
        cssProp = { padding: 'paddingRight', margin: 'marginLeft' };
    } else {
        cssProp = { padding: 'paddingLeft', margin: 'marginRight' };
    }
    /* eslint-disable */
    let size: string = `${parseInt(getComputedStyle(icon).fontSize, 10) + parseInt(
        (enableRtl ? (getComputedStyle(icon) as any)[cssProp.margin] : (getComputedStyle(icon) as any)[cssProp.margin]), 10)
        + parseInt(getComputedStyle(iconLi).paddingLeft, 10)}px`;
    blankIconList.forEach((li: HTMLElement): void => {
        if (li.classList.contains('e-url') && (li.querySelector('.e-menu-url') as HTMLElement)) {
            ((li.querySelector('.e-menu-url') as HTMLElement).style as any)[cssProp.padding] = size;
        } else {
            (li.style as any)[cssProp.padding] = size;
        }
    });
    /* eslint-enable */
}

/**
 * Defines the items of Split Button/DropDownButton.
 */
export class Item extends ChildProperty<Item> {
    /**
     * Defines class/multiple classes separated by a space for the item that is used to include an icon.
     * Action item can include font icon and sprite image.
     *
     * @default ''
     */
    @Property('')
    public iconCss: string;

    /**
     * Specifies the id for item.
     *
     * @default ''
     */
    @Property('')
    public id: string;

    /**
     * Specifies separator between the items. Separator are horizontal lines used to group action items.
     *
     * @default false
     */
    @Property(false)
    public separator: boolean;

    /**
     * Specifies text for item.
     *
     * @default ''
     */
    @Property('')
    public text: string;

    /**
     * Specifies url for item that creates the anchor link to navigate to the url provided.
     *
     * @default ''
     */
    @Property('')
    public url: string;

    /**
     * Used to enable or disable the item.
     *
     * @default false
     */
    @Property(false)
    public disabled: boolean;
}

/**
 * Interface for before item render / select event.
 */
export interface MenuEventArgs extends BaseEventArgs {
    element: HTMLElement;
    item: ItemModel;
    event?: Event;
}

/**
 * Interface for before open / close event.
 */
export interface BeforeOpenCloseMenuEventArgs extends BaseEventArgs {
    element: HTMLElement;
    items: ItemModel[];
    event: Event;
    cancel?: boolean;
}

/**
 * Interface for open/close event.
 */
export interface OpenCloseMenuEventArgs extends BaseEventArgs {
    element: HTMLElement;
    items: ItemModel[];
    parentItem?: ItemModel;
}

/**
 * Interface for animation effects.
 */
export type DropDownAnimationEffect = 'None' | 'SlideDown' | 'ZoomIn' | 'FadeIn';
