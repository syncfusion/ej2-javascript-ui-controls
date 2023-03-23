import { ChildProperty, Collection, Property } from '@syncfusion/ej2-base';
import { RibbonCollectionModel } from './ribbon-collection-model';
import { ItemOrientation } from '../base/interface';
import { RibbonCollection } from './ribbon-collection';

/**
 * Defines the ribbon group.
 */
export class RibbonGroup extends ChildProperty<RibbonGroup>  {

    /**
     * Defines the list of ribbon collections.
     *
     * @default []
     * @aspType List<RibbonCollection>
     */
    @Collection<RibbonCollectionModel>([], RibbonCollection)
    public collections: RibbonCollectionModel[];

    /**
     * Defines one or more CSS classes to customize the appearance of group.
     *
     * @default ''
     */
    @Property('')
    public cssClass: string;

    /**
     * Defines a unique identifier for the group.
     *
     * @default ''
     */
    @Property('')
    public id: string;

    /**
     * Defines whether the group is in collapsed state or not during classic mode.
     *
     * @default false
     */
    @Property(false)
    public isCollapsed: boolean;

    /**
     * Defines whether the group can be collapsed on resize during classic mode.
     *
     * @default true
     */
    @Property(true)
    public isCollapsible: boolean;

    /**
     * Defines whether to add a separate popup for the overflow items in the group.
     * If it is set to false, the overflow items will be shown in the common overflow popup present at the right end of the tab content.
     *
     * @default false
     */
    @Property(false)
    public enableGroupOverflow: boolean;

    /**
     * Defines the CSS class for the icons to be shown in the group overflow dropdown button in classic mode.
     * During overflow, the entire group will be shown in a popup of a dropdown button which appears in the place of the group in ribbon tab.
     *
     * @default ''
     */
    @Property('')
    public groupIconCss: string;

    /**
     * Defines the content of group header.
     *
     * @default ''
     */
    @Property('')
    public header: string;

    /**
     * Defines whether to orientation in which the items of the group should be arranged.
     *
     * @isenumeration true
     * @default ItemOrientation.Column
     * @aspType ItemOrientation
     */
    @Property('Column')
    public orientation: ItemOrientation | string;

    /**
     * Defines the priority order at which the group should be collapsed or expanded.
     * For collapsing value is fetched in ascending order and for expanding value is fetched in descending order.
     *
     * @default 0
     */
    @Property(0)
    public priority: number;

    /**
     * Defines whether to show or hide the launcher icon for the group.
     *
     * @default false
     */
    @Property(false)
    public showLauncherIcon: boolean;

    /**
     * @param {Object} prop - Gets the property of Group.
     * @param {boolean} muteOnChange - Gets the boolean value of muteOnChange.
     * @returns {void}
     * @private
     */
    public setProperties(prop: Object, muteOnChange: boolean): void {
        super.setProperties(prop, muteOnChange);
    }
}
