import { ChildProperty, Collection, Property } from '@syncfusion/ej2-base';import { RibbonItem } from './ribbon-item';import { RibbonItemModel } from './ribbon-item-model';

/**
 * Interface for a class RibbonCollection
 */
export interface RibbonCollectionModel {

    /**
     * Defines a unique identifier for the collection.
     *
     * @default ''
     */
    id?: string;

    /**
     * Defines one or more CSS classes to customize the appearance of collection.
     *
     * @default ''
     */
    cssClass?: string;

    /**
     * Defines the list of ribbon items.
     *
     * @default []
     * @aspType List<RibbonItem>
     */
    items?: RibbonItemModel[];

}