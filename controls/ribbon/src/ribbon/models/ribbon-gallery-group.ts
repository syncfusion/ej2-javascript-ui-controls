import { ChildProperty, Collection, Property } from "@syncfusion/ej2-base";
import { RibbonGalleryItemModel } from "./ribbon-gallery-item-model";
import { RibbonGalleryItem } from "./ribbon-gallery-item";

/**
 * Defines the ribbon gallery group.
 */
export class RibbonGalleryGroup extends ChildProperty<RibbonGalleryGroup>  {

    /**
     * Defines the properties for collection of gallery items in Ribbon.
     *
     * @default []
     * @aspType List<RibbonGalleryItem>
     */
    @Collection<RibbonGalleryItemModel>([], RibbonGalleryItem)
    public items: RibbonGalleryItemModel[];

    /**
     * Defines the header for the group items present in Ribbon Gallery popup.
     * 
     * @default ''
     */
    @Property('')
    public header: string;

    /**
     * Defines the width of the gallery items.
     * 
     * @default 'auto'
     */
    @Property('auto')
    public itemWidth: string;
    
    /**
     * Defines the height of the gallery item.
     * 
     * @default 'auto'
     */
    @Property('auto')
    public itemHeight: string;

    /**
     * Defines the CSS class to customize the gallery groups.
     * 
     * @default ''
     */
    @Property('')
    public cssClass: string;
}