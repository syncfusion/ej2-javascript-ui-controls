import { ChildProperty, extend, deleteObject, Property, BaseEventArgs } from '@syncfusion/ej2-base';
import { ItemModel } from './common-model';
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