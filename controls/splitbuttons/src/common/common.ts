import { ChildProperty, extend, deleteObject, Property, BaseEventArgs, addClass } from '@syncfusion/ej2-base';
import { ItemModel } from './common-model';
/**
 * Defines the icon position of Split Button.
 */
export type SplitButtonIconPosition = 'Left' | 'Top';

/**
 * @param props 
 * @param model
 */
export function getModel(props: Object, model: string[]): Object {
    let obj: Object = extend({}, props);
    for (let prop of Object.keys(obj)) {
        if ((model).indexOf(prop) < 0) {
            deleteObject(obj, prop);
        }
    }
    return obj as Object;
}

/** @hidden */
export function upDownKeyHandler(ul: HTMLElement, keyCode: number): void {
    let defaultIdx: number = keyCode === 40 ? 0 : ul.childElementCount - 1;
    let liIdx: number = defaultIdx;
    let li: Element;
    let selectedLi: Element = ul.querySelector('.e-selected');
    if (selectedLi) { selectedLi.classList.remove('e-selected'); }
    for (let i: number = 0, len: number = ul.children.length; i < len; i++) {
      if (ul.children[i].classList.contains('e-focused')) {
        li = ul.children[i];
        liIdx = i;
        li.classList.remove('e-focused');
        keyCode === 40 ? liIdx++ : liIdx--;
        if (liIdx === (keyCode === 40 ? ul.childElementCount : -1)) {
          liIdx = defaultIdx;
        }
      }
    }
    li = ul.children[liIdx];
    liIdx = isValidLI(ul, li, liIdx, keyCode);
    if (liIdx !== -1) {
      addClass([ul.children[liIdx]], 'e-focused');
      (ul.children[liIdx] as HTMLElement).focus();
    }
}

function isValidLI(ul: HTMLElement, li: Element, index: number, keyCode: number, count: number = 0): number {
    if (li.classList.contains('e-separator') || li.classList.contains('e-disabled')) {
        if (index === (keyCode === 40 ? ul.childElementCount - 1 : 0)) {
            index = keyCode === 40 ? 0 : ul.childElementCount - 1;
        } else {
            keyCode === 40 ? index++ : index--;
        }
    }
    li = ul.children[index];
    if (li.classList.contains('e-separator') || li.classList.contains('e-disabled')) {
        count++;
        if (count === ul.childElementCount) {
            return index = -1;
        }
        index = isValidLI(ul, li, index, keyCode, count);
    }
    return index;
}

/** @hidden */
export function setBlankIconStyle(popup: HTMLElement): void {
    let blankIconList: HTMLElement[] = [].slice.call(popup.getElementsByClassName('e-blank-icon'));
    if (!blankIconList.length) { return; }
    let iconLi: HTMLElement = popup.querySelector('.e-item:not(.e-blank-icon):not(.e-separator)') as HTMLElement;
    if (iconLi.classList.contains('e-url')) { iconLi = iconLi.querySelector('.e-menu-url'); }
    let icon: HTMLElement = iconLi.querySelector('.e-menu-icon') as HTMLElement;
    let cssProp: { padding: string, margin: string };
    let enableRtl: boolean = popup.classList.contains('e-rtl');
    if (enableRtl) {
        cssProp = { padding: 'paddingRight', margin: 'marginLeft' };
    } else {
        cssProp = { padding: 'paddingLeft', margin: 'marginRight' };
    }
    // tslint:disable
    let size: string = `${parseInt(getComputedStyle(icon).fontSize, 10) + parseInt(
        (enableRtl ? (getComputedStyle(icon) as any)[cssProp.margin] : (getComputedStyle(icon) as any)[cssProp.margin]), 10)
        + parseInt(getComputedStyle(iconLi).paddingLeft, 10)}px`;
    blankIconList.forEach((li: HTMLElement): void => {
        if (li.classList.contains('e-url')) {
            ((li.querySelector('.e-menu-url') as HTMLElement).style as any)[cssProp.padding] = size;
        } else {
            (li.style as any)[cssProp.padding] = size;
        }
    });
    // tslint:enable
}

/**
 * Defines the items of Split Button/DropDownButton.
 */
export class Item extends ChildProperty<Item> {
    /**
     * Defines class/multiple classes separated by a space for the item that is used to include an icon.
     * Action item can include font icon and sprite image.
     * @default ''
     */
    @Property('')
    public iconCss: string;

    /**
     * Specifies the id for item.
     * @default ''
     */
    @Property('')
    public id: string;

    /**
     * Specifies separator between the items. Separator are horizontal lines used to group action items.
     * @default false
     */
    @Property(false)
    public separator: boolean;

    /**
     * Specifies text for item.
     * @default ''
     */
    @Property('')
    public text: string;

    /**
     * Specifies url for item that creates the anchor link to navigate to the url provided.
     * @default ''
     */
    @Property('')
    public url: string;

    /**
     * Used to enable or disable the item.
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