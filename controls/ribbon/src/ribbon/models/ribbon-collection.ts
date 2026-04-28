import { ChildProperty, Collection, Property } from '@syncfusion/ej2-base';
import { RibbonItem } from './ribbon-item';
import { RibbonItemModel } from './ribbon-item-model';

/**
 * Defines the items of Ribbon.
 */
export class RibbonCollection extends ChildProperty<RibbonCollection>  {

    /**
     * Defines a unique identifier for the collection.
     *
     * @default ''
     */
    @Property('')
    public id: string;

    /**
     * Defines one or more CSS classes to customize the appearance of collection.
     *
     * @default ''
     */
    @Property('')
    public cssClass: string;

    /**
     * Defines the list of ribbon items.
     *
     * @default []
     * @aspType List<RibbonItem>
     */
    @Collection<RibbonItemModel>([], RibbonItem)
    public items: RibbonItemModel[];

    /**
     * @param {Object} prop - Gets the property of collection.
     * @param {boolean} muteOnChange - Gets the boolean value of muteOnChange.
     * @returns {void}
     * @private
     */
    public setProperties(prop: Object, muteOnChange: boolean): void {
        super.setProperties(prop, muteOnChange);
    }

}
