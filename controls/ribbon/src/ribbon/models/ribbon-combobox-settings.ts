import { ChildProperty, Event, EmitType, Property, Complex } from '@syncfusion/ej2-base';
import { BeforeOpenEventArgs, ChangeEventArgs, FieldSettings, FieldSettingsModel, FilteringEventArgs, FilterType, PopupEventArgs } from '@syncfusion/ej2-dropdowns';
import { SelectEventArgs, SortOrder } from '@syncfusion/ej2-lists';

/**
 * Defines the ribbon combobox item.
 */
export class RibbonComboBoxSettings extends ChildProperty<RibbonComboBoxSettings>{

    /**
     * Specifies whether to show the filter bar (search box) of the combobox.
     * The filter action retrieves matched items through the filtering event based on the characters typed in the search TextBox.
     * If no match is found, the value of the noRecordsTemplate property will be displayed.
     *
     * @default false
     */
    @Property(false)
    public allowFiltering: boolean;

    /**
     * Specifies whether to suggest a first matched item in input when searching.
     * No action happens when no matches found.
     *
     * @default true
     */
    @Property(true)
    public autofill: boolean;

    /**
     * Defines the CSS class to customize the appearance of the combobox.
     *
     * @default ''
     */
    @Property('')
    public cssClass: string;

    /**
     * Defines the list of items to shown in the combobox.
     *
     * @default []
     */
    @Property([])
    public dataSource: { [key: string]: Object }[] | string[] | number[] | boolean[];

    /**
     * Specifies the mapping for the columns of the data table bind to the combobox.
     * * text - Maps the text column from data table for each list item.
     * * value - Maps the value column from data table for each list item.
     * * iconCss - Maps the icon class column from data table for each list item.
     * * groupBy - Group the list items with it's related items by mapping groupBy field.
     *
     * @default {text: null, value: null, iconCss: null, groupBy: null}
     */
    @Complex<FieldSettingsModel>({ text: null, value: null, iconCss: null, groupBy: null }, FieldSettings)
    public fields: FieldSettingsModel;

    /**
     * Specifies filter type to be considered on search action.
     * The `FilterType` and its supported data types are
     *
     * <table>
     * <tr>
     * <td colSpan=1 rowSpan=1>
     * FilterType<br/></td><td colSpan=1 rowSpan=1>
     * Description<br/></td><td colSpan=1 rowSpan=1>
     * Supported Types<br/></td></tr>
     * <tr>
     * <td colSpan=1 rowSpan=1>
     * StartsWith<br/></td><td colSpan=1 rowSpan=1>
     * Checks whether a value begins with the specified value.<br/></td><td colSpan=1 rowSpan=1>
     * String<br/></td></tr>
     * <tr>
     * <td colSpan=1 rowSpan=1>
     * EndsWith<br/></td><td colSpan=1 rowSpan=1>
     * Checks whether a value ends with specified value.<br/><br/></td><td colSpan=1 rowSpan=1>
     * <br/>String<br/></td></tr>
     * <tr>
     * <td colSpan=1 rowSpan=1>
     * Contains<br/></td><td colSpan=1 rowSpan=1>
     * Checks whether a value contains with specified value.<br/><br/></td><td colSpan=1 rowSpan=1>
     * <br/>String<br/></td></tr>
     * </table>
     *
     * @default Contains
     */
    @Property('Contains')
    public filterType: FilterType;

    /**
     * Specifies the template content for the footer container of the popup list.
     *
     * @default null
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    @Property(null)
    public footerTemplate: string | Function;

    /**
     * Specifies the template content for the group headers present in the popup list.
     *
     * @default null
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    @Property(null)
    public groupTemplate: string | Function;

    /**
     * Specifies the template content for the header container of the popup list.
     *
     * @default null
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    @Property(null)
    public headerTemplate: string | Function;

    /**
     * Specifies the index of the selected item in the combobox.
     *
     * @default null
     */
    @Property(null)
    public index: number;

    /**
     * Specifies the template content for each list item present in the popup.
     *
     * @default null
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    @Property(null)
    public itemTemplate: string | Function;
    /**
     * Specifies the template content for the popup list of combobox when no data is available.
     *
     * @default 'No records found'
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    @Property('No records found')
    public noRecordsTemplate: string | Function;

    /**
     * Specifies a short hint that describes the expected value of the combobox.
     *
     * @default null
     */
    @Property(null)
    public placeholder: string;

    /**
     * Specifies the height of the popup list.
     *
     * @default '300px'
     * @aspType string
     */
    @Property('300px')
    public popupHeight: string | number;

    /**
     * Specifies the width of the popup list.
     * By default, the popup width sets based on the width of the combobox.
     *
     * @default '100%'
     * @aspType string
     */
    @Property('100%')
    public popupWidth: string | number;

    /**
     * Specifies whether to show or hide the clear button.
     * When the clear button is clicked, `value`, `text`, and `index` properties are reset to null.
     *
     * @default true
     */
    @Property(true)
    public showClearButton: boolean;
    /**
     * Specifies the order in which the data source needs to be sorted. The available type of sort orders are
     * * `None` - The data source is not sorted.
     * * `Ascending` - The data source is sorted in ascending order.
     * * `Descending` - The data source is sorted in descending order.
     *
     * @default null
     * @asptype object
     * @aspjsonconverterignore
     */
    @Property<SortOrder>('None')
    public sortOrder: SortOrder;

    /**
     * Defines the display text of the selected item in the combobox.
     *
     * @default null
     *
     */
    @Property(null)
    public text: string;

    /**
     * Defines the value of the selected item in the combobox.
     *
     * @default null
     * @isGenericType true
     */
    @Property(null)
    public value: number | string | boolean;

    /**
     * Specifies the width of the combobox.
     * By default, the combobox width sets based on the width of its parent container.
     *
     * @default '150px'
     * @aspType string
     */
    @Property('150px')
    public width: string | number;

    /**
     * Event triggers before opening the popup.
     *
     * @event beforeOpen
     */
    @Event()
    public beforeOpen: EmitType<BeforeOpenEventArgs>;

    /**
     * Event triggers when an item in a popup is selected or when the model value is changed by user.
     *
     * @event change
     */
    @Event()
    public change: EmitType<ChangeEventArgs>;

    /**
     * Event triggers when the popup is closed.
     *
     * @event close
     */
    @Event()
    public close: EmitType<PopupEventArgs>;

    /**
     * Event triggers once the combobox is created.
     *
     * @event created
     */
    @Event()
    public created: EmitType<Event>;

    /**
     * Event triggers on typing a character in the combobox.
     *
     * @event filtering
     */
    @Event()
    public filtering: EmitType<FilteringEventArgs>;

    /**
     * Event triggers when the popup is opened
     *
     * @event open
     */
    @Event()
    public open: EmitType<PopupEventArgs>;

    /**
     * Event triggers when an item in the popup is selected.
     *
     * @event select
     */
    @Event()
    public select: EmitType<SelectEventArgs>;

    /**
     * @param {Object} prop - Gets the property of combobox.
     * @param {boolean} muteOnChange - Gets the boolean value of muteOnChange.
     * @returns {void}
     * @private
     */
    public setProperties(prop: Object, muteOnChange: boolean): void {
        super.setProperties(prop, muteOnChange);
    }
}
