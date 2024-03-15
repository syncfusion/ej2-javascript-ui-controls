import { ChildProperty, Collection, EmitType, Property, Event } from "@syncfusion/ej2-base";
import { RibbonGalleryGroupModel } from "./ribbon-gallery-group-model";
import { RibbonGalleryGroup } from "./ribbon-gallery-group";
import { GalleryHoverEventArgs, GalleryItemEventArgs, GalleryPopupEventArgs, GallerySelectEventArgs, GalleryBeforeSelectEventArgs } from "../base/interface";

/**
 * Defines the ribbon gallery settings.
 */
export class RibbonGallerySettings extends ChildProperty<RibbonGallerySettings>  {

    /**
     * Defines the properties for collection of gallery items in the Ribbon.
     *
     * @default []
     * @aspType List<RibbonGalleryGroup>
     */
    @Collection<RibbonGalleryGroupModel>([], RibbonGalleryGroup)
    public groups: RibbonGalleryGroupModel[];

    /**
     * Defines the number of items to be displayed in the Ribbon Gallery.
     *
     * @default 3
     */
    @Property(3)
    public itemCount: number;

    /**
     * Defines the index of current selected gallery item.
     *
     * @default null
     */
    @Property(null)
    public selectedItemIndex: number;

    /**
     * Defines the height of the ribbon gallery popup.
     *
     * @default 'auto'
     */
    @Property('auto')
    public popupHeight: string;

    /**
     * Defines the width of the ribbon gallery popup.
     *
     * @default 'auto'
     */
    @Property('auto')
    public popupWidth: string;

    /**
     * Defines the template for gallery items contents. The current gallery item model passed as context to build the content.
     *
     * @default ''
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    @Property('')
    public template: string | Function;

    /**
     * Defines the template for gallery items in popup. The current gallery item model passed as context to build the content.
     *
     * @default ''
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    @Property('')
    public popupTemplate: string | Function;

    /**
     * Event triggers when the gallery popup opens.
     *
     * @event popupOpen
     */
    @Event()
    public popupOpen: EmitType<GalleryPopupEventArgs>;

    /**
     * Event triggers when the gallery popup closes.
     *
     * @event popupClose
     */
    @Event()
    public popupClose: EmitType<GalleryPopupEventArgs>;

    /**
     * Event triggers when a user hovers over a gallery item.
     *
     * @event itemHover
     */
    @Event()
    public itemHover: EmitType<GalleryHoverEventArgs>;

    /**
     * Event triggers before rendering each gallery item.
     *
     * @event beforeItemRender
     */
    @Event()
    public beforeItemRender: EmitType<GalleryItemEventArgs>;

    /**
     * Event triggers before the gallery items selects.
     *
     * @event beforeSelect
     */
    @Event()
    public beforeSelect: EmitType<GalleryBeforeSelectEventArgs>;

    /**
     * Event triggers when the gallery items selects.
     *
     * @event select
     */
    @Event()
    public select: EmitType<GallerySelectEventArgs>;
}