import { ChildProperty, Collection, Property } from '@syncfusion/ej2-base';import { RibbonGroup } from './ribbon-group';import { RibbonGroupModel } from './ribbon-group-model';

/**
 * Interface for a class RibbonTab
 */
export interface RibbonTabModel {

    /**
     * Specifies the keytip content.
     *
     * @default ''
     */
    keyTip?: string;

    /**
     * Defines a unique identifier for the tab.
     *
     * @default ''
     */
    id?: string;

    /**
     * Defines one or more CSS classes to customize the appearance of tab.
     *
     * @default ''
     */
    cssClass?: string;

    /**
     * Defines the list of ribbon groups.
     *
     * @default []
     * @aspType List<RibbonGroup>
     */
    groups?: RibbonGroupModel[];

    /**
     * Defines the content of tab header.
     *
     * @default ''
     */
    header?: string;

}