import { ChildProperty, Collection, Property } from '@syncfusion/ej2-base';import { RibbonCollectionModel } from './ribbon-collection-model';import { ItemOrientation } from '../base/interface';import { RibbonCollection } from './ribbon-collection';

/**
 * Interface for a class RibbonGroup
 */
export interface RibbonGroupModel {

    /**
     * Specifies the keytip content.
     *
     * @default ''
     */
    keyTip?: string;

    /**
     * Specifies the keytip content for launcher icon.
     *
     * @default ''
     */
    launcherIconKeyTip?: string;

    /**
     * Defines the list of ribbon collections.
     *
     * @default []
     * @aspType List<RibbonCollection>
     */
    collections?: RibbonCollectionModel[];

    /**
     * Defines one or more CSS classes to customize the appearance of group.
     *
     * @default ''
     */
    cssClass?: string;

    /**
     * Defines a unique identifier for the group.
     *
     * @default ''
     */
    id?: string;

    /**
     * Defines whether the group is in collapsed state or not during classic mode.
     *
     * @default false
     */
    isCollapsed?: boolean;

    /**
     * Defines whether the group can be collapsed on resize during classic mode.
     *
     * @default true
     */
    isCollapsible?: boolean;

    /**
     * Defines whether to add a separate popup for the overflow items in the group.
     * If it is set to false, the overflow items will be shown in the common overflow popup present at the right end of the tab content.
     *
     * @default false
     */
    enableGroupOverflow?: boolean;

    /**
     * Defines the CSS class for the icons to be shown in the group overflow dropdown button in classic mode.
     * During overflow, the entire group will be shown in a popup of a dropdown button which appears in the place of the group in ribbon tab.
     *
     * @default ''
     */
    groupIconCss?: string;

    /**
     * Defines the content of group header.
     *
     * @default ''
     */
    header?: string;

    /**
     * Defines whether to orientation in which the items of the group should be arranged.
     *
     * @isenumeration true
     * @default ItemOrientation.Column
     * @aspType ItemOrientation
     */
    orientation?: ItemOrientation | string;

    /**
     * Defines the header shown in overflow popup of Ribbon group.
     *
     * @default ''
     */
    overflowHeader?: string;

    /**
     * Defines the priority order at which the group should be collapsed or expanded.
     * For collapsing value is fetched in ascending order and for expanding value is fetched in descending order.
     *
     * @default 0
     */
    priority?: number;

    /**
     * Defines whether to show or hide the launcher icon for the group.
     *
     * @default false
     */
    showLauncherIcon?: boolean;

}