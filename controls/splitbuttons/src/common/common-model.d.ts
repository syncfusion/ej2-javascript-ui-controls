import { ChildProperty, extend, deleteObject, Property, BaseEventArgs, addClass } from '@syncfusion/ej2-base';

/**
 * Interface for a class Item
 */
export interface ItemModel {

    /**
     * Defines class/multiple classes separated by a space for the item that is used to include an icon.
     * Action item can include font icon and sprite image.
     * @default ''
     */
    iconCss?: string;

    /**
     * Specifies the id for item.
     * @default ''
     */
    id?: string;

    /**
     * Specifies separator between the items. Separator are horizontal lines used to group action items.
     * @default false
     */
    separator?: boolean;

    /**
     * Specifies text for item.
     * @default ''
     */
    text?: string;

    /**
     * Specifies url for item that creates the anchor link to navigate to the url provided.
     * @default ''
     */
    url?: string;

    /**
     * Used to enable or disable the item.
     * @default false
     */
    disabled?: boolean;

}