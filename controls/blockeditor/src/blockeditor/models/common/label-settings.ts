import { ChildProperty, Collection, Property } from '@syncfusion/ej2-base';
import { LabelItem } from './label-item';
import { LabelItemModel } from './index';

/**
 * Configures settings related to Label popup in the editor.
 * This property utilizes the LabelSettingsModel to specify various options and behaviors for paste operations.
 */
export class LabelSettings extends ChildProperty<LabelSettings> {

    /**
     * Specifies the label items for the label popup.
     * This property is an array of LabelItemModel instances defining label-related options.
     * By default, predefined labels are provided.
     *
     * @default []
     */
    @Collection<LabelItemModel>([], LabelItem)
    public labelItems: LabelItemModel[];

    /**
     * Specifies the trigger character for labels.
     * This property defines the character that triggers the label popup to open.
     * By default, the trigger character is set to $
     *
     * @default '$'
     */
    @Property('$')
    public triggerChar: string;
}
