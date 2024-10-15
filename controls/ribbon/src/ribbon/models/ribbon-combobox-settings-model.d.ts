import { ChildProperty, Event, EmitType, Property, Complex } from '@syncfusion/ej2-base';import { BeforeOpenEventArgs, ChangeEventArgs, FieldSettings, FieldSettingsModel, FilteringEventArgs, FilterType, PopupEventArgs } from '@syncfusion/ej2-dropdowns';import { SelectEventArgs, SortOrder } from '@syncfusion/ej2-lists';

/**
 * Interface for a class RibbonComboBoxSettings
 */
export interface RibbonComboBoxSettingsModel {

    /**
     * Specifies whether to show the filter bar (search box) of the combobox.
     * The filter action retrieves matched items through the filtering event based on the characters typed in the search TextBox.
     * If no match is found, the value of the noRecordsTemplate property will be displayed.
     *
     * @default false
     */
    allowFiltering?: boolean;

    /**
     * Specifies whether to suggest a first matched item in input when searching.
     * No action happens when no matches found.
     *
     * @default true
     */
    autofill?: boolean;

    /**
     * Defines the CSS class to customize the appearance of the combobox.
     *
     * @default ''
     */
    cssClass?: string;

    /**
     * Specifies the label text for the overflow item.
     *
     * @default ''
     */
    label?: string;

    /**
     * Defines the list of items to shown in the combobox.
     *
     * @default []
     */
    dataSource?: { [key: string]: Object }[] | string[] | number[] | boolean[];

    /**
     * Specifies the mapping for the columns of the data table bind to the combobox.
     * * text - Maps the text column from data table for each list item.
     * * value - Maps the value column from data table for each list item.
     * * iconCss - Maps the icon class column from data table for each list item.
     * * groupBy - Group the list items with it's related items by mapping groupBy field.
     *
     * @default {text: null, value: null, iconCss: null, groupBy: null}
     */
    fields?: FieldSettingsModel;

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
    filterType?: FilterType;

    /**
     * Specifies the template content for the footer container of the popup list.
     *
     * @default null
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    footerTemplate?: string | Function;

    /**
     * Specifies the template content for the group headers present in the popup list.
     *
     * @default null
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    groupTemplate?: string | Function;

    /**
     * Specifies the template content for the header container of the popup list.
     *
     * @default null
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    headerTemplate?: string | Function;

    /**
     * Specifies the index of the selected item in the combobox.
     *
     * @default null
     */
    index?: number;

    /**
     * Specifies the template content for each list item present in the popup.
     *
     * @default null
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    itemTemplate?: string | Function;

    /**
     * Specifies the template content for the popup list of combobox when no data is available.
     *
     * @default 'No records found'
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    noRecordsTemplate?: string | Function;

    /**
     * Specifies a short hint that describes the expected value of the combobox.
     *
     * @default null
     */
    placeholder?: string;

    /**
     * Specifies the height of the popup list.
     *
     * @default '300px'
     * @aspType string
     */
    popupHeight?: string | number;

    /**
     * Specifies the width of the popup list.
     * By default, the popup width sets based on the width of the combobox.
     *
     * @default '100%'
     * @aspType string
     */
    popupWidth?: string | number;

    /**
     * Specifies whether to show or hide the clear button.
     * When the clear button is clicked, `value`, `text`, and `index` properties are reset to null.
     *
     * @default true
     */
    showClearButton?: boolean;

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
    sortOrder?: SortOrder;

    /**
     * Defines the display text of the selected item in the combobox.
     *
     * @default null
     *
     */
    text?: string;

    /**
     * Defines the value of the selected item in the combobox.
     *
     * @default null
     * @isGenericType true
     */
    value?: number | string | boolean;

    /**
     * Specifies the width of the combobox.
     * By default, the combobox width sets based on the width of its parent container.
     *
     * @default '150px'
     * @aspType string
     */
    width?: string | number;

    /**
     * Specifies additional HTML attributes to be applied to the combobox.
     *
     * @default {}
     */
    htmlAttributes?: { [key: string]: string };

    /**
     * Event triggers before opening the popup.
     *
     * @event beforeOpen
     */
    beforeOpen?: EmitType<BeforeOpenEventArgs>;

    /**
     * Event triggers when an item in a popup is selected or when the model value is changed by user.
     *
     * @event change
     */
    change?: EmitType<ChangeEventArgs>;

    /**
     * Event triggers when the popup is closed.
     *
     * @event close
     */
    close?: EmitType<PopupEventArgs>;

    /**
     * Event triggers once the combobox is created.
     *
     * @event created
     */
    created?: EmitType<Event>;

    /**
     * Event triggers on typing a character in the combobox.
     *
     * @event filtering
     */
    filtering?: EmitType<FilteringEventArgs>;

    /**
     * Event triggers when the popup is opened
     *
     * @event open
     */
    open?: EmitType<PopupEventArgs>;

    /**
     * Event triggers when an item in the popup is selected.
     *
     * @event select
     */
    select?: EmitType<SelectEventArgs>;

}