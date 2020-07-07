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