import { ChildProperty, Collection, EmitType, Property, Event } from '@syncfusion/ej2-base';import { RibbonGalleryGroupModel } from './ribbon-gallery-group-model';import { RibbonGalleryGroup } from './ribbon-gallery-group';import { GalleryHoverEventArgs, GalleryItemEventArgs, GalleryPopupEventArgs, GallerySelectEventArgs, GalleryBeforeSelectEventArgs } from '../base/interface';

/**
 * Interface for a class RibbonGallerySettings
 */
export interface RibbonGallerySettingsModel {

    /**
     * Defines the properties for collection of gallery items in the Ribbon.
     *
     * @default []
     * @aspType List<RibbonGalleryGroup>
     */
    groups?: RibbonGalleryGroupModel[];

    /**
     * Defines the number of items to be displayed in the Ribbon Gallery.
     *
     * @default 3
     */
    itemCount?: number;

    /**
     * Defines the index of current selected gallery item.
     *
     * @default null
     */
    selectedItemIndex?: number;

    /**
     * Defines the height of the ribbon gallery popup.
     *
     * @default 'auto'
     */
    popupHeight?: string;

    /**
     * Defines the width of the ribbon gallery popup.
     *
     * @default 'auto'
     */
    popupWidth?: string;

    /**
     * Defines the template for gallery items contents. The current gallery item model passed as context to build the content.
     *
     * @default ''
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    template?: string | Function;

    /**
     * Defines the template for gallery items in popup. The current gallery item model passed as context to build the content.
     *
     * @default ''
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    popupTemplate?: string | Function;

    /**
     * Event triggers when the gallery popup opens.
     *
     * @event popupOpen
     */
    popupOpen?: EmitType<GalleryPopupEventArgs>;

    /**
     * Event triggers when the gallery popup closes.
     *
     * @event popupClose
     */
    popupClose?: EmitType<GalleryPopupEventArgs>;

    /**
     * Event triggers when a user hovers over a gallery item.
     *
     * @event itemHover
     */
    itemHover?: EmitType<GalleryHoverEventArgs>;

    /**
     * Event triggers before rendering each gallery item.
     *
     * @event beforeItemRender
     */
    beforeItemRender?: EmitType<GalleryItemEventArgs>;

    /**
     * Event triggers before the gallery items selects.
     *
     * @event beforeSelect
     */
    beforeSelect?: EmitType<GalleryBeforeSelectEventArgs>;

    /**
     * Event triggers when the gallery items selects.
     *
     * @event select
     */
    select?: EmitType<GallerySelectEventArgs>;

}