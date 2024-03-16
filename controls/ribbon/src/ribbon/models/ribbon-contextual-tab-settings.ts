import { ChildProperty, Event, EmitType, Property, Collection } from '@syncfusion/ej2-base';
import { RibbonTab } from './ribbon-tab';
import { RibbonTabModel } from './ribbon-tab-model';

/**
 * Defines the ribbon contextual tab.
 */
export class RibbonContextualTabSettings extends ChildProperty<RibbonContextualTabSettings>  {

    /**
     * Specifies whether the contextual tab is visible.
     *
     * @default false
     */
    @Property(false)
    public visible: boolean;

    /**
     * Specifies whether the contextual tab is selected.
     *
     * @default false
     */
    @Property(false)
    public isSelected: boolean;

    /**
     * Defines the tab groups to be rendered in ribbon.
     *
     * @default []
     * @aspType List<RibbonTab>
     */
    @Collection<RibbonTabModel>([], RibbonTab)
    public tabs: RibbonTabModel[];

    /**
     * @param {Object} prop - Gets the property of contextual tab.
     * @param {boolean} muteOnChange - Gets the boolean value of muteOnChange.
     * @returns {void}
     * @private
     */
    public setProperties(prop: Object, muteOnChange: boolean): void {
        super.setProperties(prop, muteOnChange);
    }
}
