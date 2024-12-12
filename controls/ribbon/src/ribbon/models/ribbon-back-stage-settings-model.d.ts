import { ChildProperty, Property, Complex, Collection } from '@syncfusion/ej2-base';import { BackstageBackButton } from './ribbon-back-button';import { BackstageBackButtonModel } from './ribbon-back-button-model';import { BackstageItem } from './ribbon-backstage-item';import { BackstageItemModel } from './ribbon-backstage-item-model';import { RibbonTooltipModel } from './ribbon-tooltip-model';import { RibbonTooltip } from './ribbon-tooltip';

/**
 * Interface for a class BackStageMenu
 */
export interface BackStageMenuModel {

    /**
     * Defines the text content of backstage menu button.
     *
     * @default 'File'
     */
    text?: string;

    /**
     * Specifies the keytip content.
     *
     * @default ''
     */
    keyTip?: string;

    /**
     * Defines whether to show the backstage menu button.
     *
     * @default false
     */
    visible?: boolean;

    /**
     * Defines the height of the backstage menu.
     *
     * @default 'auto'
     */
    height?: string;

    /**
     * Defines the width of the backstage menu.
     *
     * @default 'auto'
     */
    width?: string;

    /**
     * Defines the selector that points to the element in which backstage will be positioned.
     *
     * @default null
     */
    target?: string | HTMLElement;

    /**
     * Defines the properties of ribbon backstage back button.
     *
     * @default {}
     */
    backButton?: BackstageBackButtonModel;

    /**
     * Defines the properties of ribbon backstage back button.
     *
     * @default []
     * @aspType List<BackstageItem>
     */
    items?: BackstageItemModel[];

    /**
     * Defines the template for Backstage content.
     *
     * @default ''
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    template?: string | Function;

    /**
     * Specifies the tooltip settings for the file menu button.
     *
     * @default {}
     */
    ribbonTooltipSettings?: RibbonTooltipModel;

}