import { ChildProperty, Property } from '@syncfusion/ej2-base';

/**
 * Interface for a class RibbonGalleryItem
 */
export interface RibbonGalleryItemModel {

    /**
     * Defines the content for the gallery item.
     *
     * @default ''
     */
    content?: string;

    /**
     * Defines the image or icons for the gallery item.
     *
     * @default ''
     */
    iconCss?: string;

    /**
     * Specifies additional HTML attributes to be applied to the Ribbon Gallery item.
     *
     * @default {}
     */
    htmlAttributes?: { [key: string]: string };

    /**
     * Defines the CSS class to customize the gallery items.
     *
     * @default ''
     */
    cssClass?: string;

    /**
     * Defines whether the item is disabled or not.
     *
     * @default false
     */
    disabled?: boolean;

}