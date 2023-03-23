import { ChildProperty, Event, EmitType, Property } from '@syncfusion/ej2-base';

/**
 * Defines the ribbon button item.
 */
export class RibbonButtonSettings extends ChildProperty<RibbonButtonSettings>  {

    /**
     * Defines the content for the button.
     *
     * @default ''
     */
    @Property('')
    public content: string;

    /**
     * Defines one or more CSS classes to customize the appearance of button.
     *
     * @default ''
     */
    @Property('')
    public cssClass: string;

    /**
     * Defines the CSS class for the icons to be shown in button.
     *
     * @default ''
     */
    @Property('')
    public iconCss: string;
    /**
     * Defines whether the button is toggle button or not.
     *
     * @default false
     */
    @Property(false)
    public isToggle: boolean;

    /**
     * Defines whether the button is primary button or not.
     *
     * @default false
     */
    @Property(false)
    public isPrimary: boolean;

    /**
     * Event triggers once the button is created.
     *
     * @event created
     */
    @Event()
    public created: EmitType<Event>;

    /**
     * Event triggers when the button is clicked.
     *
     * @event clicked
     */
    @Event()
    public clicked: EmitType<Event>;

    /**
     * @param {Object} prop - Gets the property of button.
     * @param {boolean} muteOnChange - Gets the boolean value of muteOnChange.
     * @returns {void}
     * @private
     */
    public setProperties(prop: Object, muteOnChange: boolean): void {
        super.setProperties(prop, muteOnChange);
    }
}
