import { ChildProperty, Collection, Property } from '@syncfusion/ej2-base';
import { RibbonGroup } from './ribbon-group';
import { RibbonGroupModel } from './ribbon-group-model';

/**
 * Defines the ribbon tab.
 */
export class RibbonTab extends ChildProperty<RibbonTab>  {

    /**
     * Specifies the keytip content.
     *
     * @default ''
     */
    @Property('')
    public keyTip: string;

    /**
     * Defines a unique identifier for the tab.
     *
     * @default ''
     */
    @Property('')
    public id: string;

    /**
     * Defines one or more CSS classes to customize the appearance of tab.
     *
     * @default ''
     */
    @Property('')
    public cssClass: string;

    /**
     * Defines the list of ribbon groups.
     *
     * @default []
     * @aspType List<RibbonGroup>
     */
    @Collection<RibbonGroupModel>([], RibbonGroup)
    public groups: RibbonGroupModel[];

    /**
     * Defines the content of tab header.
     *
     * @default ''
     */
    @Property('')
    public header: string;

    /**
     * @param {Object} prop - Gets the property of tab.
     * @param {boolean} muteOnChange - Gets the boolean value of muteOnChange.
     * @returns {void}
     * @private
     */
    public setProperties(prop: Object, muteOnChange: boolean): void {
        super.setProperties(prop, muteOnChange);
    }

}
