import { ChildProperty, Event, EmitType, Property } from '@syncfusion/ej2-base';
import { LabelPosition, ChangeEventArgs } from '@syncfusion/ej2-buttons';

/**
 * Defines the ribbon checkbox item.
 */
export class RibbonCheckBoxSettings extends ChildProperty<RibbonCheckBoxSettings>  {

    /**
     * Defines the whether the checkbox is checked or not.
     *
     * @default false
     */
    @Property(false)
    public checked: boolean;

    /**
     * Defines one or more CSS classes to customize the appearance of checkbox.
     *
     * @default ''
     */
    @Property('')
    public cssClass: string;

    /**
     * Defines the label for the checkbox.
     *
     * @default ''
     */
    @Property('')
    public label: string;

    /**
     * Defines whether the label is position `After` or `Before` the checkbox.
     *
     * @default 'After'
     */
    @Property('After')
    public labelPosition: LabelPosition;

    /**
     * Specifies additional HTML attributes to be applied to the checkbox.
     *
     * @default {}
     */
    @Property({})
    public htmlAttributes: { [key: string]: string };

    /**
     * Event triggers once the checkbox is created.
     *
     * @event created
     */
    @Event()
    public created: EmitType<Event>;

    /**
     * Event triggers when the checkbox state is changed.
     *
     * @event change
     */
    @Event()
    public change: EmitType<ChangeEventArgs>;

    /**
     * @param {Object} prop - Gets the property of checkbox.
     * @param {boolean} muteOnChange - Gets the boolean value of muteOnChange.
     * @returns {void}
     * @private
     */
    public setProperties(prop: Object, muteOnChange: boolean): void {
        super.setProperties(prop, muteOnChange);
    }
}
