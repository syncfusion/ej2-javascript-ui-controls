import { ChildProperty, Property, Collection } from '@syncfusion/ej2-base';import { RibbonTab } from './ribbon-tab';import { RibbonTabModel } from './ribbon-tab-model';

/**
 * Interface for a class RibbonContextualTabSettings
 */
export interface RibbonContextualTabSettingsModel {

    /**
     * Specifies whether the contextual tab is visible.
     *
     * @default false
     */
    visible?: boolean;

    /**
     * Specifies whether the contextual tab is selected.
     *
     * @default false
     */
    isSelected?: boolean;

    /**
     * Defines the tab groups to be rendered in ribbon.
     *
     * @default []
     * @aspType List<RibbonTab>
     */
    tabs?: RibbonTabModel[];

}