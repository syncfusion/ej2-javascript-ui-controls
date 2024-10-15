import { ChildProperty, Collection, Property } from '@syncfusion/ej2-base';import { RibbonGalleryItemModel } from './ribbon-gallery-item-model';import { RibbonGalleryItem } from './ribbon-gallery-item';

/**
 * Interface for a class RibbonGalleryGroup
 */
export interface RibbonGalleryGroupModel {

    /**
     * Defines the properties for collection of gallery items in Ribbon.
     *
     * @default []
     * @aspType List<RibbonGalleryItem>
     */
    items?: RibbonGalleryItemModel[];

    /**
     * Defines the header for the group items present in Ribbon Gallery popup.
     *
     * @default ''
     */
    header?: string;

    /**
     * Defines the width of the gallery items.
     *
     * @default 'auto'
     */
    itemWidth?: string;

    /**
     * Defines the height of the gallery item.
     *
     * @default 'auto'
     */
    itemHeight?: string;

    /**
     * Defines the CSS class to customize the gallery groups.
     *
     * @default ''
     */
    cssClass?: string;

}