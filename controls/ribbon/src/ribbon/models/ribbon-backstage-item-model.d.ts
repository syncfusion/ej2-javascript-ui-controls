import { ChildProperty, Property, Event, EmitType, BaseEventArgs } from '@syncfusion/ej2-base';
import {BackstageItemClickArgs} from "./ribbon-backstage-item";

/**
 * Interface for a class BackstageItem
 */
export interface BackstageItemModel {

    /**
     * Specifies the text for backstage item.
     *
     * @default ''
     */
    text?: string;

    /**
     * Defines a unique identifier for the backstage item.
     *
     * @default ''
     */
    id?: string;

    /**
     * Specifies the keytip content.
     *
     * @default ''
     */
    keyTip?: string;

    /**
     * Specifies the backstage item’s content as selector.
     *
     * @default ''
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    content?: string | Function;

    /**
     * Specifies the icon css class for backstage back button.
     *
     * @default ''
     */
    iconCss?: string;

    /**
     * Specifies the separator between the backstage items.
     *
     * @default false
     */
    separator?: boolean;

    /**
     * Specifies whether the item is placed in Footer section of backstage.
     *
     * @default false
     */
    isFooter?: boolean;

    /**
     * Event triggers when backstage item is clicked.
     *
     * @event backStageItemClick
     */
    backStageItemClick?: EmitType<BackstageItemClickArgs>;

}