import { ChildProperty, Collection, Property } from '@syncfusion/ej2-base';
import { RibbonGroupButtonSelection } from '../base/interface';
import { RibbonGroupButtonItemModel } from './ribbon-group-button-item-model';
import { RibbonGroupButtonItem } from './ribbon-group-button-item';


/**
 * Defines the ribbon group button settings.
 */
export class RibbonGroupButtonSettings extends ChildProperty<RibbonGroupButtonSettings>  {

    /**
     * Defines options for Selection Type.
     *
     * @isenumeration true
     * @default 'Single'
     * @asptype RibbonGroupButtonSelection
     */
    @Property('Single')
    public selection: RibbonGroupButtonSelection;

    /**
     * Defines the properties for collection of button items in Ribbon group button.
     *
     * @default []
     * @aspType List<RibbonGroupButtonItem>
     */
    @Collection<RibbonGroupButtonItemModel>([], RibbonGroupButtonItem)
    public items: RibbonGroupButtonItemModel[];
}
