import { ChildProperty, Property } from '@syncfusion/ej2-base';

/**
 * Defines the ribbon gallery item.
 */
export class RibbonGalleryItem extends ChildProperty<RibbonGalleryItem>  {

    /**
     * Defines the content for the gallery item.
     *
     * @default ''
     */
    @Property('')
    public content: string;

    /**
     * Defines the image or icons for the gallery item.
     *
     * @default ''
     */
    @Property('')
    public iconCss: string;

    /**
     * Specifies additional HTML attributes to be applied to the Ribbon Gallery item.
     *
     * @default {}
     */
    @Property({})
    public htmlAttributes: { [key: string]: string };

    /**
     * Defines the CSS class to customize the gallery items.
     *
     * @default ''
     */
    @Property('')
    public cssClass: string;

    /**
     * Defines whether the item is disabled or not.
     *
     * @default false
     */
    @Property(false)
    public disabled: boolean;
}
