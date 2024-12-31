import { Component, EventHandler, INotifyPropertyChanged, Property, NotifyPropertyChanges, closest, attributes, append, compile, detach, KeyboardEvents, getValue } from '@syncfusion/ej2-base';import { ChildProperty, prepend, Collection, getUniqueID, Complex, isNullOrUndefined as isNOU, select, L10n, Browser } from '@syncfusion/ej2-base';import { formatUnit, addClass, removeClass, NumberFormatOptions, DateFormatOptions, Event, EmitType, AnimationModel, Animation, KeyboardEventArgs } from '@syncfusion/ej2-base';import { Input, InputObject } from '@syncfusion/ej2-inputs';import { DataManager, Query, Group } from '@syncfusion/ej2-data';import { Popup } from '@syncfusion/ej2-popups';import { Grid, Resize, FailureEventArgs, VirtualScroll, Group as GridGroup, Edit, Sort, GridColumnModel } from '@syncfusion/ej2-grids';
import {TextAlign,GridLine,WrapMode,ResizeArgs,DataResult,FilterType,FloatLabelType,SortOrder,SortType,PopupEventArgs,FilteringEventArgs,SelectEventArgs,ChangeEventArgs} from "./multi-column-combo-box";
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class MultiColumnGrid
 */
export interface MultiColumnGridModel {

}

/**
 * Interface for a class FieldSettings
 */
export interface FieldSettingsModel {

    /**
     * Specifies the display text of each list item.
     *
     * @default null
     */
    text?: string;

    /**
     * Specifies the hidden data value mapped to each list item that should contain a unique value.
     *
     * @default null
     */
    value?: string;

    /**
     * Specifies the category under which the list item has to be grouped.
     *
     * @default null
     */
    groupBy?: string;

}

/**
 * Interface for a class Column
 */
export interface ColumnModel {

    /**
     * Defines the name of the field whose data will be displayed in the column.
     *
     * @default ''
     */
    field?: string;

    /**
     * Defines the header text of column which is used to display in column header.
     * If headerText is not defined, then field name value will be assigned to header text.
     *
     * @default ''
     */
    header?: string;

    /**
     * Defines the width of the column in pixels or percentage.
     *
     * @default ''
     */
    width?: string | number;

    /**
     * Defines the alignment of the column in both header and content cells.
     *
     * @default Left
     */
    textAlign?: TextAlign;

    /**
     * It is used to change display value with the given format and does not affect the original data.
     * Gets the format from the user which can be standard or custom `number` and `date` formats.
     *
     * @default null
     * @aspType string
     */
    format?: string | NumberFormatOptions | DateFormatOptions;

    /**
     * If `displayAsCheckBox` is set to true, it displays the column value as a check box instead of Boolean value.
     *
     * @default false
     */
    displayAsCheckBox?: boolean;

    /**
     * Defines the column template that renders customized element in each cell of the column.
     * It accepts either template or HTML element ID.
     *
     * @default null
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    template?: string | Function;

    /**
     * Defines the column template as string or HTML element ID which is used to add customized element in the column header.
     *
     * @default null
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    headerTemplate?: string | Function;

    /**
     * The CSS styles and attributes of the content cells of a particular column can be customized.
     *
     * @default null
     */
    customAttributes?: { [x: string]: Object };

}

/**
 * Interface for a class GridSettings
 */
export interface GridSettingsModel {

    /**
     * If `enableAltRow` is set to true, the grid will render with `e-altrow` CSS class to the alternative row elements.
     *
     * @default false
     */
    enableAltRow?: boolean;

    /**
     * Defines the height of rows in the popup content.
     *
     * @default null
     */
    rowHeight?: number;

    /**
     * Defines the mode of grid lines. The available modes are,
     * * `Both`: Displays both horizontal and vertical grid lines.
     * * `None`: No grid lines are displayed.
     * * `Horizontal`: Displays the horizontal grid lines only.
     * * `Vertical`: Displays the vertical grid lines only.
     * * `Default`: Displays grid lines based on the theme.
     *
     * @default Default
     */
    gridLines?: GridLine;

    /**
     * Specifies whether to allow text wrapping of the popup grid content.
     *
     * @default false
     */
    allowTextWrap?: boolean;

    /**
     * Specifies the mode for text wrapping in the popup grid content. Options include 'Both', 'Content', and 'Header'.
     *
     * @isenumeration true
     *
     * @default WrapMode.Both
     * @asptype WrapMode
     */
    textWrapMode?: WrapMode | string;

    /**
     * Specifies whether resizing of columns is enabled in the popup grid content.
     *
     * @default false
     */
    allowResizing?: boolean;

    /**
     * Triggers during the column resizing.
     *
     * @event resizing
     */
    resizing?: EmitType<ResizeArgs>;

    /**
     * Triggers when the column resizing begins.
     *
     * @event resizeStart
     */
    resizeStart?: EmitType<ResizeArgs>;

    /**
     * Triggers when the column resizing ends.
     *
     * @event resizeStop
     */
    resizeStop?: EmitType<ResizeArgs>;

}

/**
 * Interface for a class MultiColumnComboBox
 */
export interface MultiColumnComboBoxModel extends ComponentModel{

    /**
     * Accepts the list items either through local or remote service and binds it to the component.
     * It can be an array of JSON Objects or an instance of `DataManager`.
     *
     * {% codeBlock src='multicolumn-combobox/value/index.md' %}{% endcodeBlock %}
     *
     * @default []
     * @isGenericType true
     */
    dataSource?: Object | DataManager | DataResult;

    /**
     * Gets or sets the display text of the selected item.
     *
     * @default null
     */
    text?: string;

    /**
     * Gets or sets the value of the selected item.
     *
     * {% codeBlock src='multicolumn-combobox/value/index.md' %}{% endcodeBlock %}
     *
     * @default null
     */
    value?: string;

    /**
     * Gets or sets the index of the selected item in the component.
     *
     * @default null
     */
    index?: number | null;

    /**
     * Specifies the width of the component. By default, the component width sets based on the width of its parent container.
     *
     * @default '100%'
     * @aspType string
     */
    width?: string | number;

    /**
     * Specifies the height of the popup list.
     *
     * @default '300px'
     * @aspType string
     */
    popupHeight?: string | number;

    /**
     * Specifies the width of the popup list. By default, the popup width sets based on the width of the component.
     *
     * @default '100%'
     * @aspType string
     */
    popupWidth?: string | number;

    /**
     * Specifies a short hint that describes the expected value of the multicolumn combobox component.
     *
     * @default null
     */
    placeholder?: string;

    /**
     * Specifies the filter action retrieves matched items through the filtering event based on the characters typed in the search TextBox.
     * If no match is found, the value of the noRecordsTemplate property will be displayed.
     *
     * {% codeBlock src='multicolumn-combobox/allowFiltering/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    allowFiltering?: boolean;

    /**
     * Specifies whether sorting is allowed for the columns in the dropdown list.
     *
     * @default true
     */
    allowSorting?: boolean;

    /**
     * Specifies whether to show or hide the clear icon in textbox.
     * When the clear button is clicked, `value`, `text` properties will be reset to null.
     *
     * @default false
     */
    showClearButton?: boolean;

    /**
     * Sets CSS classes to the root element of the component that allows customization of appearance.
     *
     * @default ''
     */
    cssClass?: string;

    /**
     * The `fields` property maps the columns of the data table and binds the data to the component.
     * * text - Maps the text column from data table for each list item.
     * * value - Maps the value column from data table for each list item.
     * * groupBy - Group the list items with it's related items by mapping groupBy field.
     *
     * {% codeBlock src='multicolumn-combobox/fields/index.md' %}{% endcodeBlock %}
     *
     * @default {text: null, value: null, groupBy: null}
     */
    fields?: FieldSettingsModel;

    /**
     * Specifies the number of columns and its respective fields to be displayed in the dropdown popup.
     *
     * {% codeBlock src='multicolumn-combobox/fields/index.md' %}{% endcodeBlock %}
     *
     * @default []
     */
    columns?: ColumnModel[];

    /**
     * Specifies the configuration of the columns in the popup content.
     *
     * {% codeBlock src='multicolumn-combobox/gridSettings/index.md' %}{% endcodeBlock %}
     *
     * @default {rowHeight: null, gridLines: Default, enableAltRow: false}
     */
    gridSettings?: GridSettingsModel;

    /**
     * Determines on which filter type, the component needs to be considered on search action.
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
     * The default value set to `StartsWith`, all the suggestion items which contain typed characters to listed in the suggestion popup.
     *
     * {% codeBlock src='multicolumn-combobox/allowFiltering/index.md' %}{% endcodeBlock %}
     *
     * @isenumeration true
     * @default FilterType.StartsWith
     * @asptype FilterType
     */
    filterType?: FilterType | string;

    /**
     * Specifies whether to display the floating label above the input element.
     * Possible values are:
     * * Never - The label will never float in the input when the placeholder is available.
     * * Always - The floating label will always float above the input.
     * * Auto - The floating label will float above the input after focusing or entering a value in the input.
     *
     * {% codeBlock src='multicolumn-combobox/floatLabelType/index.md' %}{% endcodeBlock %}
     *
     * @default Never
     */
    floatLabelType?: FloatLabelType;

    /**
     * Specifies the sortOrder to sort the data source.
     * The available type of sort orders are,
     * * `None` - The datasource is not sorting. Default value is None.
     * * `Ascending` - The datasource is sorting with ascending order.
     * * `Descending` - The data source is sorting with descending order.
     *
     * @isenumeration true
     * @default SortOrder.None
     * @asptype SortOrder
     */
    sortOrder?: SortOrder | string;

    /**
     * Specifies the type of sorting to be applied for the columns.
     * * `OneColumn` - Allow sorting only one column.
     * * `MultipleColumns` - Allow sorting multiple columns.
     *
     * @isenumeration true
     * @default SortType.OneColumn
     * @asptype SortType
     */
    sortType?: SortType | string;

    /**
     * Defines whether to enable virtual scrolling in the component.
     *
     * @default false
     */
    enableVirtualization?: boolean;

    /**
     * Specifies a value that indicates whether the component is disabled or not.
     *
     * @default false
     */
    disabled?: boolean;

    /**
     * Specifies the user interactions on the component are disabled.
     *
     * @default false
     */
    readonly?: boolean;

    /**
     * Specifies the component’s state between page reloads. If enabled, the list of states for the value will be persisted.
     *
     * @default false
     */
    enablePersistence?: boolean;

    /**
     * Accepts the external Query that execute along with data processing.
     *
     * {% codeBlock src='multicolumn-combobox/query/index.md' %}{% endcodeBlock %}
     *
     * @default null
     */
    query?: Query;

    /**
     * Accepts the template design and assigns it to each items present in the popup.
     *
     * {% codeBlock src='multicolumn-combobox/itemTemplate/index.md' %}{% endcodeBlock %}
     *
     * @default null
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    itemTemplate?: string | Function;

    /**
     * Accepts the template design and assigns it to the footer container of the popup.
     *
     * @default null
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    footerTemplate?: string | Function;

    /**
     * Accepts the template design and assigns it to the group headers present in the popup list.
     *
     * @default null
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    groupTemplate?: string | Function;

    /**
     * Accepts the template and assigns it to the popup content when the data fetch request from the remote server fails.
     *
     * @default 'Request Failed'
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    actionFailureTemplate?: string | Function;

    /**
     * Accepts the template design and assigns it to popup list of component when no data is available on the component.
     *
     * @default 'No records found'
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    noRecordsTemplate?: string | Function;

    /**
     * Allows additional HTML attributes such as title, name, etc., and accepts n number of attributes in a key-value pair format.
     *
     * {% codeBlock src='multicolumn-combobox/htmlAttributes/index.md' %}{% endcodeBlock %}
     *
     * @default {}
     */
    htmlAttributes?: { [key: string]: string; };

    /**
     * Event callback that is raised after rendering the control.
     *
     * @event created
     */
    created?: EmitType<Event>;

    /**
     * Triggers when the popup opens.
     *
     * @event open
     */
    open?: EmitType<PopupEventArgs>;

    /**
     * Triggers when the popup is closed.
     *
     * @event close
     */
    close?: EmitType<PopupEventArgs>;

    /**
     * Triggers when the data fetch request from the remote server fails.
     *
     * @event actionFailure
     */
    actionFailure?: EmitType<Object>;

    /**
     * Triggers before fetching data from the remote server.
     *
     * @event actionBegin
     */
    actionBegin?: EmitType<Object>;

    /**
     * Triggers after data is fetched successfully from the remote server.
     *
     * @event actionComplete
     */
    actionComplete?: EmitType<Object>;

    /**
     * Triggers on typing a character in the component.
     *
     * @event filtering
     */
    filtering?: EmitType<FilteringEventArgs>;

    /**
     * Triggers when an item in the popup is selected by the user either with mouse/tap or with keyboard navigation.
     *
     * @event select
     */
    select?: EmitType<SelectEventArgs>;

    /**
     * Triggers when an item in a popup is selected or when the model value is changed by the user.
     *
     * @event change
     */
    change?: EmitType<ChangeEventArgs>;

}