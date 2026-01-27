import { Component, EventHandler, INotifyPropertyChanged, Property, NotifyPropertyChanges, closest, attributes, append, compile, detach, KeyboardEvents, getValue } from '@syncfusion/ej2-base';
import { ChildProperty, prepend, Collection, getUniqueID, Complex, isNullOrUndefined as isNOU, select, L10n, Browser } from '@syncfusion/ej2-base';
import { formatUnit, addClass, removeClass, NumberFormatOptions, DateFormatOptions, Event, EmitType, AnimationModel, Animation, KeyboardEventArgs } from '@syncfusion/ej2-base';
import { Input, InputObject } from '@syncfusion/ej2-inputs';
import { DataManager, Query, Group, DataOptions } from '@syncfusion/ej2-data';
import { Popup, createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';
import { Grid, Resize, FailureEventArgs, VirtualScroll, Group as GridGroup, Edit, Sort, GridColumnModel } from '@syncfusion/ej2-grids';

import { MultiColumnComboBoxModel } from './multi-column-combo-box-model';
import { ColumnModel, FieldSettingsModel, GridSettingsModel } from './multi-column-combo-box-model';

const DROPDOWNICON: string = 'e-input-group-icon e-multicolumn-list-icon e-icons';
const CONTENT: string = 'e-popup-content';
const ICONANIMATION: string = 'e-icon-anim';
const NODATA: string = 'e-nodata';
const DISABLED: string = 'e-disabled';
const INPUTFOCUS: string = 'e-input-focus';
const MULTICOLUMNLIST: string = 'e-multicolumn-list';
const HIDDENELEMENT: string = 'e-multicolumn-list-hidden';
const MULTICOLUMNGRID: string = 'e-multicolumn-grid';

export class MultiColumnGrid {
    /**
     * Injecting required modules for component.
     *
     * @returns {void}
     * @private
     */
    public InjectModules(): void {
        Grid.Inject(VirtualScroll, GridGroup, Edit, Sort, Resize);
    }
}

/**
 * Defines alignments of text, they are
 * ```props
 * * Left :- Defines Left alignment
 * * Right :- Defines Right alignment
 * * Center :- Defines Center alignment
 * * Justify :- Defines Justify alignment
 * ```
 */
export type TextAlign = 'Left' | 'Right' | 'Center' | 'Justify';

/**
 * Defines modes of GridLine, They are
 * ```props
 * * Both :- Displays both the horizontal and vertical grid lines.
 * * None :- No grid lines are displayed.
 * * Horizontal :- Displays the horizontal grid lines only.
 * * Vertical :- Displays the vertical grid lines only.
 * * Default :- Displays grid lines based on the theme.
 * ```
 */
export type GridLine = 'Both' | 'None' | 'Horizontal' | 'Vertical' | 'Default';

/**
 * Defines floating label type of the input and decides how the label should float on the input.
 */
export type FloatLabelType = 'Never' | 'Always' | 'Auto';

/**
 * Defines the filter type.
 */
export enum FilterType {
    /**
     * Checks whether a value begins with the specified value.
     */
    StartsWith = 'StartsWith',
    /**
     * Checks whether a value ends with specified value.
     */
    EndsWith = 'EndsWith',
    /**
     * Checks whether a value contains with specified value.
     */
    Contains = 'Contains'
}

/**
 * Specifies the sortOrder to sort the data source.
 */
export enum SortOrder {
    /**
     * The datasource is not sorting. Default value is None.
     */
    None = 'None',

    /**
     * The datasource is sorting with ascending order.
     */
    Ascending = 'Ascending',

    /**
     * The data source is sorting with descending order.
     */
    Descending = 'Descending'
}

/**
 * Specifies the type of sorting to be applied for the columns.
 */
export enum SortType {
    /**
     * Allow sorting only one column
     */
    OneColumn = 'OneColumn',
    /**
     * Allow sorting multiple columns
     */
    MultipleColumns = 'MultipleColumns'

}

/**
 * Specifies the type of wrap mode to be applied for the grid cells.
 */
export enum WrapMode {
    /**
     * Specifies that both header and content text wrapping are enabled.
     */
    Both = 'Both',
    /**
     * Specifies that only content text wrapping is enabled.
     */
    Content = 'Content',
    /**
     * Specifies that only header text wrapping is enabled.
     */
    Header = 'Header'
}

/**
 * The fields property maps the columns of the data table and binds the data to the component.
 */
export class FieldSettings extends ChildProperty<FieldSettings> {
    /**
     * Specifies the display text of each list item.
     *
     * @default null
     */
    @Property()
    public text: string;

    /**
     * Specifies the hidden data value mapped to each list item that should contain a unique value.
     *
     * @default null
     */
    @Property()
    public value: string;

    /**
     * Specifies the category under which the list item has to be grouped.
     *
     * @default null
     */
    @Property()
    public groupBy: string;
}

/**
 * Specifies the number of columns and its respective fields to be displayed in the dropdown popup.
 */
export class Column extends ChildProperty<Column> {

    /**
     * Defines the name of the field whose data will be displayed in the column.
     *
     * @default ''
     */
    @Property('')
    public field: string;

    /**
     * Defines the header text of column which is used to display in column header.
     * If headerText is not defined, then field name value will be assigned to header text.
     *
     * @default ''
     */
    @Property('')
    public header: string;

    /**
     * Defines the width of the column in pixels or percentage.
     *
     * @default ''
     */
    @Property('')
    public width: string | number;

    /**
     * Defines the alignment of the column in both header and content cells.
     *
     * @default Left
     */
    @Property('')
    public textAlign: TextAlign;

    /**
     * It is used to change display value with the given format and does not affect the original data.
     * Gets the format from the user which can be standard or custom `number` and `date` formats.
     *
     * @default null
     * @aspType string
     */
    @Property(null)
    public format: string | NumberFormatOptions | DateFormatOptions;

    /**
     * If `displayAsCheckBox` is set to true, it displays the column value as a check box instead of Boolean value.
     *
     * @default false
     */
    @Property(false)
    public displayAsCheckBox: boolean;

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
    @Property(null)
    public template: string | Function;

    /**
     * Defines the column template as string or HTML element ID which is used to add customized element in the column header.
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
     * The CSS styles and attributes of the content cells of a particular column can be customized.
     *
     * @default null
     */
    @Property(null)
    public customAttributes: { [x: string]: Object };
}

/**
 * Specifies the configuration of the columns in the popup content.
 */
export class GridSettings extends ChildProperty<GridSettings> {
    /**
     * If `enableAltRow` is set to true, the grid will render with `e-altrow` CSS class to the alternative row elements.
     *
     * @default false
     */
    @Property(false)
    public enableAltRow: boolean;

    /**
     * Defines the height of rows in the popup content.
     *
     * @default null
     */
    @Property(null)
    public rowHeight: number;

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
    @Property('Default')
    public gridLines: GridLine;

    /**
     * Specifies whether to allow text wrapping of the popup grid content.
     *
     * @default false
     */
    @Property(false)
    public allowTextWrap: boolean;

    /**
     * Specifies the mode for text wrapping in the popup grid content. Options include 'Both', 'Content', and 'Header'.
     *
     * @isenumeration true
     *
     * @default WrapMode.Both
     * @asptype WrapMode
     */
    @Property(WrapMode.Both)
    public textWrapMode: WrapMode | string;

    /**
     * Specifies whether resizing of columns is enabled in the popup grid content.
     *
     * @default false
     */
    @Property(false)
    public allowResizing: boolean;

    /**
     * Triggers during the column resizing.
     *
     * @event resizing
     */
    @Event()
    public resizing: EmitType<ResizeArgs>;

    /**
     * Triggers when the column resizing begins.
     *
     * @event resizeStart
     */
    @Event()
    public resizeStart: EmitType<ResizeArgs>;

    /**
     * Triggers when the column resizing ends.
     *
     * @event resizeStop
     */
    @Event()
    public resizeStop: EmitType<ResizeArgs>;
}

export interface PopupEventArgs {
    /**
     * Specifies the popup Object.
     *
     * @deprecated
     */
    popup: Popup
    /**
     * Illustrates whether the current action needs to be prevented or not.
     */
    cancel?: boolean
    /**
     * Specifies the animation for the popup.
     */
    animation?: AnimationModel
    /**
     * Specifies the original event arguments
     */
    event?: MouseEvent | KeyboardEvent | TouchEvent
}

export interface FilteringEventArgs {
    /**
     * To prevent the internal filtering action.
     */
    preventDefaultAction: boolean
    /**
     * Gets the `keyup` event arguments.
     */
    event: Object
    /**
     * Illustrates whether the current action needs to be prevented or not.
     */
    cancel: boolean
    /**
     * Returns the searched text value.
     */
    text: string
    /**
     * Opens the popup that displays the list of items.
     *
     * @param  {Object[] | DataManager | DataResult } dataSource - Set the data source to filter.
     * @param  {Query} query - Specify the query to filter the data.
     * @param  {FieldSettingsModel} fields - Specify the fields to map the column in the data table.
     * @returns {void}
     */
    updateData(dataSource: { [key: string]: Object }[] | DataManager | DataResult, query?: Query,
        fields?: FieldSettingsModel): void
}

export interface SelectEventArgs {
    /**
     * Returns true if the event is triggered by interaction. Otherwise, it returns false.
     */
    isInteracted: boolean
    /**
     * Returns the selected row data.
     */
    item: Object
    /**
     * Returns the selected item as JSON Object from the data source.
     *
     */
    itemData: { text: string, value: string }
    /**
     * Returns the selected row item.
     *
     */
    itemElement: HTMLElement
    /**
     * Specifies the original event arguments.
     */
    event: MouseEvent | KeyboardEvent | TouchEvent
    /**
     * Specifies whether the current action needs to be prevented or not.
     */
    cancel?: boolean
}

export interface ChangeEventArgs {
    /**
     * Specifies the original event arguments.
     */
    event: MouseEvent | KeyboardEvent | TouchEvent
    /**
     * Specifies whether the current action needs to be prevented or not.
     */
    cancel?: boolean
    /**
     * Returns true if the event is triggered by interaction. Otherwise, it returns false.
     */
    isInteracted: boolean
    /**
     * Returns the selected tr element.
     */
    itemElement: HTMLElement
    /**
     * Returns the selected item as JSON Object from the data source.
     */
    itemData: { text: string, value: string }
    /**
     * Returns the previous selected tr element.
     */
    previousItemElement: HTMLElement
    /**
     * Returns the previous selected item as JSON Object from the data source.
     */
    previousItemData: { text: string, value: string }
    /**
     * Returns the selected value
     *
     * @isGenericType true
     */
    value: number | string
    /**
     * Returns the selected row data.
     */
    item: Object
}

export interface ResizeArgs {
    /**
     * Defines the details about the column that is currently being resized.
     */
    column: ColumnModel

    /**
     * Specifies whether to cancel the resizing operation of the columns.
     *
     * @default false
     */
    cancel: boolean
}

/**
 * @hidden
 */
export interface DataResult {
    result: Object[] | Group[];
    count: number;
    aggregates?: object;
}

/**
 * The `MultiColumnComboBox` allows the user to search and select values from a list. It provides a list of options that can be selected using a filter input.
 * The selected value will be displayed in the input element.
 *
 * ```html
 *  <input type='text' id='multi-column'></input>
 * ```
 * ```typescript
 *  let multiColObj: MultiColumnComboBox = new MultiColumnComboBox();
 *  multiColObj.appendTo('#multi-column');
 * ```
 */

@NotifyPropertyChanges
export class MultiColumnComboBox extends Component<HTMLElement> implements INotifyPropertyChanged {

    /**
     * Accepts the list items either through local or remote service and binds it to the component.
     * It can be an array of JSON Objects or an instance of `DataManager`.
     *
     * {% codeBlock src='multicolumn-combobox/value/index.md' %}{% endcodeBlock %}
     *
     * @default []
     * @isGenericType true
     */
    @Property([])
    public dataSource: Object | DataManager | DataResult;

    /**
     * Gets or sets the display text of the selected item.
     *
     * @default null
     */
    @Property(null)
    public text: string;

    /**
     * Gets or sets the value of the selected item.
     *
     * {% codeBlock src='multicolumn-combobox/value/index.md' %}{% endcodeBlock %}
     *
     * @default null
     */
    @Property(null)
    public value: string;

    /**
     * Gets or sets the index of the selected item in the component.
     *
     * @default null
     */
    @Property(null)
    public index: number | null;

    /**
     * Specifies the width of the component. By default, the component width sets based on the width of its parent container.
     *
     * @default '100%'
     * @aspType string
     */
    @Property('100%')
    public width: string | number;

    /**
     * Specifies the height of the popup list.
     *
     * @default '300px'
     * @aspType string
     */
    @Property('300px')
    public popupHeight: string | number;

    /**
     * Specifies the width of the popup list. By default, the popup width sets based on the width of the component.
     *
     * @default '100%'
     * @aspType string
     */
    @Property('100%')
    public popupWidth: string | number;

    /**
     * Specifies a short hint that describes the expected value of the multicolumn combobox component.
     *
     * @default null
     */
    @Property(null)
    public placeholder: string;

    /**
     * Specifies the filter action retrieves matched items through the filtering event based on the characters typed in the search TextBox.
     * If no match is found, the value of the noRecordsTemplate property will be displayed.
     *
     * {% codeBlock src='multicolumn-combobox/allowFiltering/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    @Property(true)
    public allowFiltering: boolean;

    /**
     * Specifies whether sorting is allowed for the columns in the dropdown list.
     *
     * @default true
     */
    @Property(true)
    public allowSorting: boolean;

    /**
     * Specifies whether to show or hide the clear icon in textbox.
     * When the clear button is clicked, `value`, `text` properties will be reset to null.
     *
     * @default false
     */
    @Property(false)
    public showClearButton: boolean;

    /**
     * Sets CSS classes to the root element of the component that allows customization of appearance.
     *
     * @default ''
     */
    @Property('')
    public cssClass: string;

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
    @Complex<FieldSettingsModel>({ text: null, value: null, groupBy: null }, FieldSettings)
    public fields: FieldSettingsModel;

    /**
     * Specifies the number of columns and its respective fields to be displayed in the dropdown popup.
     *
     * {% codeBlock src='multicolumn-combobox/fields/index.md' %}{% endcodeBlock %}
     *
     * @default []
     */
    @Collection<ColumnModel[]>([], Column)
    public columns: ColumnModel[];

    /**
     * Specifies the configuration of the columns in the popup content.
     *
     * {% codeBlock src='multicolumn-combobox/gridSettings/index.md' %}{% endcodeBlock %}
     *
     * @default {rowHeight: null, gridLines: Default, enableAltRow: false}
     */
    @Complex<GridSettingsModel>({}, GridSettings)
    public gridSettings: GridSettingsModel;

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
    @Property(FilterType.StartsWith)
    public filterType: FilterType | string;

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
    @Property('Never')
    public floatLabelType: FloatLabelType;

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
    @Property(SortOrder.None)
    public sortOrder: SortOrder | string;

    /**
     * Specifies the type of sorting to be applied for the columns.
     * * `OneColumn` - Allow sorting only one column.
     * * `MultipleColumns` - Allow sorting multiple columns.
     *
     * @isenumeration true
     * @default SortType.OneColumn
     * @asptype SortType
     */
    @Property(SortType.OneColumn)
    public sortType: SortType | string;

    /**
     * Defines whether to enable virtual scrolling in the component.
     *
     * @default false
     */
    @Property(false)
    public enableVirtualization: boolean;

    /**
     * Specifies a value that indicates whether the component is disabled or not.
     *
     * @default false
     */
    @Property(false)
    public disabled: boolean;

    /**
     * Specifies the user interactions on the component are disabled.
     *
     * @default false
     */
    @Property(false)
    public readonly: boolean;

    /**
     * Specifies the component’s state between page reloads. If enabled, the list of states for the value will be persisted.
     *
     * @default false
     */
    @Property(false)
    public enablePersistence: boolean;

    /**
     * Accepts the external Query that execute along with data processing.
     *
     * {% codeBlock src='multicolumn-combobox/query/index.md' %}{% endcodeBlock %}
     *
     * @default null
     */
    @Property()
    public query: Query;

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
    @Property(null)
    public itemTemplate: string | Function;

    /**
     * Accepts the template design and assigns it to the footer container of the popup.
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
     * Accepts the template design and assigns it to the group headers present in the popup list.
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
     * Accepts the template and assigns it to the popup content when the data fetch request from the remote server fails.
     *
     * @default 'Request Failed'
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    @Property('Request Failed')
    public actionFailureTemplate: string | Function;

    /**
     * Accepts the template design and assigns it to popup list of component when no data is available on the component.
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
     * Allows additional HTML attributes such as title, name, etc., and accepts n number of attributes in a key-value pair format.
     *
     * {% codeBlock src='multicolumn-combobox/htmlAttributes/index.md' %}{% endcodeBlock %}
     *
     * @default {}
     */
    @Property({})
    public htmlAttributes: { [key: string]: string; };

    /**
     * Event callback that is raised after rendering the control.
     *
     * @event created
     */
    @Event()
    public created: EmitType<Event>;

    /**
     * Triggers when the popup opens.
     *
     * @event open
     */
    @Event()
    public open: EmitType<PopupEventArgs>;
    /**
     * Triggers when the popup is closed.
     *
     * @event close
     */
    @Event()
    public close: EmitType<PopupEventArgs>;

    /**
     * Triggers when the data fetch request from the remote server fails.
     *
     * @event actionFailure
     */
    @Event()
    public actionFailure: EmitType<Object>;

    /**
     * Triggers before fetching data from the remote server.
     *
     * @event actionBegin
     */
    @Event()
    public actionBegin: EmitType<Object>;

    /**
     * Triggers after data is fetched successfully from the remote server.
     *
     * @event actionComplete
     */
    @Event()
    public actionComplete: EmitType<Object>;

    /**
     * Triggers on typing a character in the component.
     *
     * @event filtering
     */
    @Event()
    public filtering: EmitType<FilteringEventArgs>;

    /**
     * Triggers when an item in the popup is selected by the user either with mouse/tap or with keyboard navigation.
     *
     * @event select
     */
    @Event()
    public select: EmitType<SelectEventArgs>;

    /**
     * Triggers when an item in a popup is selected or when the model value is changed by the user.
     *
     * @event change
     */
    @Event()
    public change: EmitType<ChangeEventArgs>;

    /* Private variables */
    private dropdownElement: HTMLElement;
    private inputEle: HTMLInputElement;
    private inputObj: InputObject;
    private inputWrapper: HTMLElement;
    private popupDiv: HTMLElement;
    private popupEle: HTMLElement;
    private popupObj: Popup;
    private gridObj: Grid;
    private gridEle: HTMLElement;
    private isPopupOpen: boolean;
    private footer: HTMLElement;
    private l10n: L10n;
    private noRecord: HTMLElement;
    private previousItemElement: HTMLElement;
    private keyboardModule: KeyboardEvents;
    private keyConfigs: { [key: string]: string };
    private gridInject: MultiColumnGrid = new MultiColumnGrid();
    private prevGridHeight: number;
    private popupRowHeight: number;
    private matchedRowEle: Element;
    private matchedContent: { [key: string]: Object } | undefined;
    private exactMatchedContent: { [key: string]: Object } | undefined;
    private isDataFiltered: boolean;
    private isInitialRender: boolean;
    private isInitialValueRender: boolean;
    private remoteDataLength: number;
    private selectedRowIndex: number;
    private isShowSpinner: boolean = true;
    private hiddenElement: HTMLSelectElement;
    private isLocaleChanged: boolean;
    private gridData: Object | DataManager | DataResult;
    private mainData: Object | DataManager | DataResult;
    private isMainDataUpdated: boolean;
    private isCustomFilter: boolean;
    private customFilterQuery: Query;
    private typedString: string;

    /**
     * *Constructor for creating the component
     *
     * @param {MultiColumnComboBoxModel} options - Specifies the MultiColumnComboBox model.
     * @param {string | HTMLElement} element - Specifies the element to render as component.
     * @private
     */
    public constructor(options?: MultiColumnComboBoxModel, element?: string | HTMLElement) {
        super(options, element);
        this.gridInject.InjectModules();
    }
    /**
     * Initialize the event handler
     *
     * @private
     * @returns {void}
     */
    protected preRender(): void {
        if (!this.element.id) { this.element.id = getUniqueID('e-' + this.getModuleName()); }
        this.keyConfigs = {
            escape: 'escape',
            altUp: 'alt+uparrow',
            altDown: 'alt+downarrow',
            tab: 'tab',
            shiftTab: 'shift+tab',
            end: 'end',
            enter: 'enter',
            home: 'home',
            moveDown: 'downarrow',
            moveUp: 'uparrow'
        };
        this.matchedRowEle = this.matchedContent = this.exactMatchedContent = null;
        this.persistData();
    }

    protected getDirective(): string {
        return 'EJS-MULTICOLUMNCOMBOBOX';
    }

    /**
     * To get component name.
     *
     * @returns {string} - It returns the current module name.
     * @private
     */
    public getModuleName(): string {
        return 'multicolumncombobox';
    }

    /**
     * Get the properties to be maintained in the persisted state.
     *
     * @private
     * @returns {string} - It returns the persisted data.
     */
    protected getPersistData(): string {
        return this.addOnPersist(['value']);
    }

    private persistData (): void {
        if (this.enablePersistence) {
            this.element.id += '_wrapper';
            const data: string = window.localStorage.getItem(this.getModuleName() + this.element.id);
            if (!(isNOU(data) || (data === ''))) {
                this.setProperties(JSON.parse(data), true);
            }
        }
    }

    protected render(): void {
        this.renderInput();
        if ((!isNOU(this.value) || !isNOU(this.text) || !isNOU(this.index)) && !isNOU(this.dataSource)
            && this.dataSource instanceof DataManager)
        {
            this.isInitialValueRender = true;
        }
        if (this.gridData == null) {
            this.setGridData(this.dataSource);
        }
        this.renderGrid();
        this.popupDiv = this.createElement('div', { className: CONTENT });
        this.popupDiv.appendChild(this.gridEle);
        this.setHTMLAttributes();
        this.renderPopup();
        this.wireEvents();
    }

    private setGridData(dataSource: Object | DataManager, query?: Query): void {
        this.trigger('actionBegin', { cancel: false, query: query }, (args: { [key: string]: Object }) => {
            if (!args.cancel) {
                if (dataSource instanceof DataManager) {
                    if (this.isShowSpinner) {
                        this.showHideSpinner(true);
                    }
                    (dataSource as DataManager).executeQuery(this.getQuery(query as Query)).then((e: Object) => {
                        this.gridData = (e as any).result;
                        this.trigger('actionComplete', e, (e: Object) => {
                            this.showHideSpinner(false);
                            if (!this.isMainDataUpdated) {
                                this.mainData = this.gridData;
                                this.remoteDataLength = (this.gridData as any).length;
                                this.isMainDataUpdated = true;
                            }
                            if (this.isInitialValueRender) {
                                this.isInitialValueRender = false;
                                this.initValue(null, null, true);
                            }
                            if (this.popupDiv) {
                                this.updateGridDataSource();
                            }
                        });
                    }).catch((e: any) => {
                        this.trigger('actionFailure', e, null);
                    });
                } else {
                    const dataManager: DataManager = new DataManager(dataSource as DataOptions | JSON[]);
                    const listItems: { [key: string]: Object }[] = <{ [key: string]: Object }[]>(
                        this.getQuery(query as Query)).executeLocal(dataManager);
                    this.gridData = listItems;
                    this.trigger('actionComplete', { result: listItems }, (e: Object) => {
                        if (!this.isMainDataUpdated) {
                            if (this.isCustomFilter && (isNOU(this.dataSource) || (this.dataSource as any).length === 0)) {
                                this.setProperties({ dataSource: listItems }, true);
                            }
                            this.mainData = this.gridData;
                            this.remoteDataLength = (this.gridData as any).length;
                            this.isMainDataUpdated = true;
                        }
                        if (this.popupDiv) {
                            this.updateGridDataSource();
                        }
                    });
                }
            }
        });
    }

    protected getQuery(query: Query): Query {
        let filterQuery: Query;
        if (!this.isCustomFilter && this.allowFiltering) {
            filterQuery = query ? query.clone() : this.query ? this.query.clone() : new Query();
            const filterType: string = this.typedString === '' ? 'contains' : this.filterType;
            if ((this.allowFiltering && this.typedString && this.typedString !== '')) {
                const fields: string = (this.fields.text) ? this.fields.text : '';
                filterQuery.where(fields, filterType, this.typedString, true, false);
            }
        } else {
            filterQuery = (this.customFilterQuery != null) ?
                this.customFilterQuery.clone() : query ? query.clone() : this.query ? this.query.clone() : new Query();
        }
        return filterQuery;
    }

    private setHiddenValue(): void {
        if (isNOU(this.value)) {
            this.hiddenElement.innerHTML = '';
            return;
        }
        const existingOption: HTMLOptionElement = this.hiddenElement.querySelector('option');
        if (!isNOU(existingOption)) {
            existingOption.textContent = this.text;
            existingOption.setAttribute('value', this.value.toString());
        } else if (!isNOU(this.hiddenElement)) {
            const newOption: HTMLOptionElement = document.createElement('option');
            newOption.text = this.text;
            newOption.setAttribute('value', this.value.toString());
            newOption.setAttribute('selected', '');
            this.hiddenElement.appendChild(newOption);
        }
    }

    private renderGrid(): void {
        const gridColumns: ColumnModel[] = this.getGridColumns();
        const sortOrder: string = this.sortOrder.toString().toLowerCase();
        this.gridObj = new Grid({
            dataSource: this.gridData,
            columns: gridColumns,
            allowSorting: this.allowSorting,
            enableStickyHeader: true,
            gridLines: this.gridSettings.gridLines,
            rowHeight: this.gridSettings.rowHeight,
            enableAltRow: this.gridSettings.enableAltRow,
            enableVirtualization: this.enableVirtualization,
            enableRtl: this.enableRtl,
            editSettings: { allowAdding: false },
            allowTextWrap: this.gridSettings.allowTextWrap,
            textWrapSettings: { wrapMode: this.gridSettings.textWrapMode as WrapMode },
            height: this.popupHeight,
            allowResizing: this.gridSettings.allowResizing,
            allowMultiSorting: this.sortType.toString().toLowerCase() === 'multiplecolumns' && this.allowSorting,
            rowTemplate: this.itemTemplate,
            beforeDataBound: () => {
                if (this.dataSource instanceof DataManager && this.isShowSpinner) {
                    this.showHideSpinner(true);
                    this.isShowSpinner = false;
                }
            },
            dataBound: () => { this.onDataBound(); },
            actionFailure: (args: FailureEventArgs) => { this.onActionFailure(args); },
            actionComplete: this.handleActionComplete.bind(this),
            keyPressed: this.handleKeyPressed.bind(this),
            resizing: (args: ResizeArgs) => {
                if (this.gridSettings.resizing) {
                    this.gridSettings.resizing.call(this, args);
                }
            },
            resizeStart: (args: ResizeArgs) => {
                if (this.gridSettings.resizeStart) {
                    this.gridSettings.resizeStart.call(this, args);
                }
            },
            resizeStop: (args: ResizeArgs) => {
                if (this.gridSettings.resizeStop) {
                    this.gridSettings.resizeStop.call(this, args);
                }
            }
        });
        this.gridEle = this.createElement('div', { id: `${this.element.id}_${getUniqueID('grid')}`, className: MULTICOLUMNGRID });
        this.updateGroupByField();
        if (gridColumns.length > 0) {
            // Set first column as primary key to avoid PRIMARY KEY MISSING warning.
            (this.gridObj.columns[0] as GridColumnModel).isPrimaryKey = true;
        }
        if (sortOrder !== 'none') {
            this.gridObj.sortSettings = { columns: [{ field: this.fields.text, direction: sortOrder === 'ascending' ?
                SortOrder.Ascending : SortOrder.Descending }] };
        }
        this.gridObj.appendTo(this.gridEle);
        if ((!isNOU(this.value) || !isNOU(this.text) || !isNOU(this.index)) && !isNOU(this.dataSource) && this.dataSource instanceof Array)
        {
            this.initValue(null, null, true);
        }
    }

    private handleActionComplete(args: { [key: string]: Object }): void {
        if (args.requestType === 'sorting') {
            this.updateRowSelection(args);
        }
        if (Array.isArray(args.rows) && this.isDataFiltered) {
            const rows: Array<{ uid: string }> = args.rows as Array<{ uid: string }>;
            let rowHeight: number = 0;
            rows.forEach((row: { uid: string }) => {
                const rowElement: Element | null = this.gridObj.getRowElementByUID(row.uid);
                if (rowElement) {
                    rowHeight += rowElement.getBoundingClientRect().height;
                }
            });
            this.popupRowHeight = rowHeight || parseFloat(this.popupHeight as string);
            this.updateGridHeight(true, true);
        }
        this.popupObj.refreshPosition();
        this.gridObj.element.querySelector('.e-content').scrollTop = 0;
    }

    private handleKeyPressed(args: KeyboardEventArgs): void {
        if (args.key === 'Enter') {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (args as any).cancel = true;
            if (this.isPopupOpen) {
                this.selectedGridRow(this.gridObj.getRows()[this.gridObj.selectedRowIndex], args, true);
                this.hidePopup(args);
                this.focusIn(args);
            }
        }
        if (this.fields.groupBy) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (args as any).cancel = true;
            this.gridKeyActionHandler(args, true);
        }
    }

    /* eslint-disable @typescript-eslint/no-explicit-any */
    private isRowMatching(data: any, selectedValue: string, selectedText: string): boolean {
        const flattenData: Function = (data: any): string[] => {
            const result: string[] = [];
            if (data && typeof data === 'object') {
                if (Array.isArray(data)) { data.forEach((item: any) => result.push(...flattenData(item))); }
                else { Object.keys(data).forEach((key: string) => result.push(...flattenData(data[`${key}`]))); }
            } else if (data != null) { result.push(String(data)); }
            return result;
        };
        const flattenedValues: string[] = flattenData(data);
        return (flattenedValues.indexOf(selectedValue) !== -1 && flattenedValues.indexOf(selectedText) !== -1);
    }

    private updateRowSelection(args: any): void {
        if (args) {
            const dataRows: { [key: string]: object }[] = args.rows;
            dataRows.forEach((row: any) => {
                this.selectDataRow(row.data, row.index);
            });
        }
    }

    private selectDataRow(data: any, index: number): void {
        const isPresent: boolean = this.isRowMatching(data, this.value ?
            this.value.toString() : '', this.text ? this.text.toString() : '');
        if (isPresent) {
            this.gridObj.selectRow(index);
            const prevOnChange: boolean = this.isProtectedOnChange;
            this.isProtectedOnChange = true;
            this.index = index;
            this.isProtectedOnChange = prevOnChange;
            return;
        }
    }

    private findIndex(arr: Object[], obj: { [key: string]: object }): number {
        return arr.findIndex((item: Object) => {
            // eslint-disable-next-line
            return Object.keys(obj).every((key: string) => (item as any)[key] === obj[key]);
        });
    }

    private getGridColumns(): ColumnModel[] {
        return this.columns.map(({ field, header, width, textAlign, format, displayAsCheckBox, template,
            headerTemplate, customAttributes }: ColumnModel) => ({
            field,
            headerText: header,
            width,
            textAlign: textAlign.toString() === '' && this.enableRtl ? 'Right' : textAlign,
            format,
            displayAsCheckBox,
            template,
            headerTemplate,
            customAttributes,
            type: displayAsCheckBox && !format ? 'boolean' : undefined
        }));
    }

    private updateGroupByField(): void {
        const groupByField: string = this.fields.groupBy;
        const isGroupByValid: boolean = groupByField !== '' && !isNOU(groupByField);
        if (isGroupByValid) {
            if (this.sortType.toString().toLowerCase() !== 'multiplecolumns') { this.gridEle.classList.add('e-multicolumn-group'); }
            const prevOnChange: boolean = this.isProtectedOnChange;
            this.isProtectedOnChange = true;
            this.gridObj.allowGrouping = true;
            this.gridObj.groupSettings = {
                showDropArea: false,
                columns: [groupByField]
            };
            if (this.groupTemplate && isGroupByValid) {
                this.gridObj.groupSettings.captionTemplate = this.groupTemplate;
            }
            if (this.isVue) {
                this.gridObj.isVue = this.isVue;
            }
            this.isProtectedOnChange = prevOnChange;
        }
    }

    private onDataBound(): void {
        if (this.isLocaleChanged) {
            this.isLocaleChanged = false;
            this.unWireEvents();
            this.wireEvents();
        }
        const dataCount: number = (<{ [key: string]: Object }[]>this.dataSource).length;
        const popupChild: HTMLElement = this.popupDiv.querySelector('.' + MULTICOLUMNGRID);
        const hasNoDataClass: boolean = this.popupDiv.classList.contains(NODATA);
        if (dataCount <= 0 && popupChild) {
            this.l10nUpdate();
            this.popupDiv.removeChild(this.gridEle);
            addClass([this.popupDiv], [NODATA]);
        } else if (hasNoDataClass && dataCount >= 1) {
            removeClass([this.popupDiv], [NODATA]);
            const noRecordEle: HTMLElement = this.popupDiv.querySelector('.e-no-records');
            if (noRecordEle) { this.popupDiv.removeChild(noRecordEle); }
        } else if (this.isCustomFilter && !hasNoDataClass && dataCount > 0) {
            this.popupDiv.appendChild(this.gridEle);
        }
        if (this.isInitialRender) {
            const gridContentRow: HTMLElement | null = this.popupDiv.querySelector('.e-gridcontent tr');
            const rowHeight: number = !hasNoDataClass ? gridContentRow ?
                gridContentRow.getBoundingClientRect().height : 0 :
                this.popupDiv.getBoundingClientRect().height;
            this.popupRowHeight = rowHeight;
            this.popupObj.hide();
            this.popupEle.style.visibility = 'unset';
            this.isInitialRender = false;
        }
        const rowElements: NodeListOf<Element> = this.gridObj.element.querySelectorAll('.e-row');
        if (this.isDataFiltered && rowElements.length > 0 && this.inputEle.value !== '') {
            const firstRowEle: Element = rowElements[0];
            firstRowEle.classList.add('e-row-focus');
        }
        if (this.dataSource instanceof DataManager) {
            setTimeout((): void => {
                this.showHideSpinner(false);
            });
        }
    }

    private showHideSpinner(isShow: boolean): void {
        if (isShow) { showSpinner(this.dropdownElement); }
        else { hideSpinner(this.dropdownElement); }
    }

    private onActionFailure(args: FailureEventArgs): void {
        this.trigger('actionFailure', args);
        this.l10nUpdate(true);
        addClass([this.popupDiv], [NODATA]);
    }

    private renderInput(): void {
        const allowedAttributes: string[] = ['aria-expanded', 'aria-readOnly', 'aria-disabled', 'autocomplete',
            'autocapitalize', 'spellcheck', 'tabindex'];
        const setAttributes: Function = (element: HTMLElement, attributes: { [key: string]: string }) => {
            for (const key in attributes) {
                // eslint-disable-next-line no-prototype-builtins
                if (attributes.hasOwnProperty(key) && allowedAttributes.indexOf(key) !== -1 && isNOU(element.getAttribute(key))) {
                    element.setAttribute(key, attributes[key as string]);
                }
            }
        };
        if (this.element.tagName === 'INPUT') {
            this.inputEle = this.element as HTMLInputElement;
            if (isNOU(this.inputEle.getAttribute('role'))) { this.inputEle.setAttribute('role', 'combobox'); }
            if (isNOU(this.inputEle.getAttribute('type'))) { this.inputEle.setAttribute('type', 'text'); }
            setAttributes(this.inputEle, {
                'aria-expanded': 'false',
                'aria-readOnly': this.readonly.toString(),
                'aria-disabled': this.disabled.toString(),
                autocomplete: 'off',
                autocapitalize: 'off',
                spellcheck: 'false',
                tabindex: '0'
            });
        } else {
            this.inputEle = this.createElement('input', { attrs: { role: 'textbox', type: 'text' } }) as HTMLInputElement;
            this.element.parentElement.insertBefore(this.inputEle, this.element);
        }
        this.inputObj = Input.createInput({
            element: this.inputEle,
            buttons: [DROPDOWNICON],
            floatLabelType: this.floatLabelType,
            properties: {
                enabled: !this.disabled,
                readonly: this.readonly,
                placeholder: this.placeholder,
                enableRtl: this.enableRtl,
                showClearButton: this.showClearButton,
                cssClass: this.cssClass
            }
        }, this.createElement);
        this.inputWrapper = this.inputObj.container;
        this.inputWrapper.classList.add(MULTICOLUMNLIST);
        this.inputWrapper.setAttribute('spellcheck', 'false');
        this.hiddenElement = this.createElement('select', {
            attrs: {
                'aria-hidden': 'true',
                'tabindex': '-1',
                'class': HIDDENELEMENT
            }
        }) as HTMLSelectElement;
        prepend([this.hiddenElement], this.inputWrapper);
        const name: string = this.inputEle.getAttribute('name') ? this.inputEle.getAttribute('name') : this.inputEle.getAttribute('id');
        this.hiddenElement.setAttribute('name', name);
        this.inputEle.removeAttribute('name');
        if (!this.hiddenElement.hasAttribute('aria-label')) {
            this.hiddenElement.setAttribute('aria-label', this.getModuleName());
        }
        if (this.element.tagName === this.getDirective()) {
            this.element.appendChild(this.inputWrapper);
        }
        this.setElementWidth(this.width);
        this.dropdownElement = this.inputWrapper.querySelector('.e-input-group-icon.e-multicolumn-list-icon.e-icons');
        createSpinner({
            target: this.dropdownElement
        });
    }

    private setElementWidth(inputWidth: string | number): void {
        if (isNOU(inputWidth)) { return; }
        const ddElement: HTMLElement = this.inputWrapper;
        if (typeof inputWidth === 'number') { ddElement.style.width = formatUnit(inputWidth); }
        else if (typeof inputWidth === 'string') {
            ddElement.style.width = inputWidth.match(/px|%|em/) ? inputWidth : formatUnit(inputWidth);
        }
    }

    private setHTMLAttributes(): void {
        const htmlAttributes: { [key: string]: string } = this.htmlAttributes;
        const inputEle: HTMLInputElement = this.inputEle;
        if (Object.keys(htmlAttributes).length) {
            for (const htmlAttr of Object.keys(htmlAttributes)) {
                switch (htmlAttr) {
                case 'class':
                    this.inputWrapper.classList.add(htmlAttributes[htmlAttr as string]);
                    break;
                case 'disabled':
                    this.setProperties({ enabled: false }, true);
                    this.setEnable();
                    break;
                case 'readonly':
                    this.setProperties({ readonly: true }, true);
                    this.dataBind();
                    break;
                case 'style': {
                    const styles: string = htmlAttributes[htmlAttr as string];
                    this.inputWrapper.style.cssText = '';
                    if (styles) {
                        styles.split(';').forEach((styleProperty: string) => {
                            const [property, value] = styleProperty.split(':').map((part: string) => part.trim());
                            if (property && value) {
                                this.inputWrapper.style.setProperty(property, value);
                            }
                        });
                    }
                    break;
                }
                default: {
                    const defaultAttr: string[] = ['title', 'id', 'placeholder', 'role', 'autocomplete', 'autocapitalize', 'spellcheck', 'minlength', 'maxlength'];
                    const validateAttr: string[] = ['name', 'required'];
                    if (validateAttr.indexOf(htmlAttr) > -1 || htmlAttr.indexOf('data') === 0) {
                        this.hiddenElement.setAttribute(htmlAttr, this.htmlAttributes[`${htmlAttr}`]);
                    } else if (defaultAttr.indexOf(htmlAttr) > -1) {
                        if (htmlAttr === 'placeholder') {
                            Input.setPlaceholder(htmlAttributes[htmlAttr as string], inputEle);
                        } else {
                            inputEle.setAttribute(htmlAttr, htmlAttributes[htmlAttr as string]);
                        }
                    } else {
                        inputEle.setAttribute(htmlAttr, htmlAttributes[htmlAttr as string]);
                    }
                    break;
                }
                }
            }
        }
    }

    /* To set enable property */
    private setEnable(): void {
        Input.setEnabled(!this.disabled, this.inputEle);
        if (!this.disabled) {
            removeClass([this.inputWrapper], DISABLED);
            this.setAriaDisabled('false');
        } else {
            if (this.isPopupOpen) {
                this.hidePopup();
            }
            addClass([this.inputWrapper], DISABLED);
            if (this.inputWrapper && this.inputWrapper.classList.contains(INPUTFOCUS)) {
                removeClass([this.inputWrapper], [INPUTFOCUS]);
            }
            this.setAriaDisabled('true');
        }
    }

    private setAriaDisabled(value: string): void {
        this.inputEle.setAttribute('aria-disabled', value);
        this.inputWrapper.setAttribute('aria-disabled', value);
    }

    private updateFieldValue(fieldValue: string, dataObj: object): string {
        const fieldVal: string = getValue(fieldValue, dataObj).toString();
        return fieldVal;
    }

    private initValue(isRerender?: boolean, isValue?: boolean, isInitial?: boolean): void {
        const prevItemData: { text: string, value: string } = this.gridObj.getSelectedRecords()[0] as { text: string, value: string };
        const prevItemEle: HTMLElement = this.gridObj.getSelectedRows()[0] as HTMLElement;
        let item: { [key: string]: Object };
        let currentValue: string;
        let currentText: string;
        let currentIndex: number;
        const prevOnChange: boolean = this.isProtectedOnChange;
        this.isProtectedOnChange = true;
        this.value = this.value ? this.value.toString() : this.value;
        this.isProtectedOnChange = prevOnChange;
        const updateValues: Function = (dataList: { [key: string]: Object }[]): void => {
            const result: { currentValue: string; currentText: string; currentIndex: number; } = this.updateCurrentValues(item, dataList);
            currentValue = result.currentValue;
            currentText = result.currentText;
            currentIndex = result.currentIndex;
        };
        if ((!isRerender && (!isNOU(this.value) || !isNOU(this.text))) || (isRerender && isValue !== undefined)) {
            const value: string = isRerender ? (isValue ? this.value : this.text) : (!isNOU(this.value) ? this.value : this.text);
            if (!isNOU(this.dataSource) && this.dataSource instanceof DataManager && this.mainData
                && this.isMainDataUpdated) {
                const dataLists: { [key: string]: Object }[] = ((this.query && this.getQuery(this.query as Query).isCountRequired) ||
                    !this.query) ? (this.mainData as any) : (this.mainData as any).result ? (this.mainData as any).result : this.mainData;
                const filteredData: { [key: string]: Object }[] = dataLists.filter((item: { [key: string]: Object }) => {
                    const fieldVal: string = item ? (this.updateFieldValue(isRerender ? (isValue ? this.fields.value :
                        this.fields.text) : !isNOU(this.value) ? this.fields.value : this.fields.text, item)) : null;
                    return fieldVal === value;
                });
                if (filteredData.length > 0) {
                    item = filteredData[0];
                    updateValues(dataLists);
                    this.updateChangeEvent(item, prevItemData, prevItemEle, currentValue, currentText, currentIndex,
                                           isRerender, isInitial);
                    this.gridObj.selectRow(this.index);
                }
            } else if (!isNOU(this.dataSource) && this.dataSource instanceof Array) {
                item = (<{ [key: string]: Object }[]>this.dataSource).filter((data: { [key: string]: Object }) => {
                    const fieldVal: string = this.updateFieldValue(isRerender ? (isValue ? this.fields.value : this.fields.text) :
                        !isNOU(this.value) ? this.fields.value : this.fields.text, data);
                    return fieldVal === value;
                })[0];
                updateValues(this.dataSource);
            }
        } else if (!isNOU(this.index)) {
            if (!isNOU(this.dataSource) && this.dataSource instanceof DataManager  && this.mainData
                && this.isMainDataUpdated) {
                const dataLists: { [key: string]: Object }[] = ((this.query && this.getQuery(this.query as Query).isCountRequired) ||
                    !this.query) ? (this.mainData as any) : (this.mainData as any).result ? (this.mainData as any).result : this.mainData;
                item = dataLists[this.index];
                updateValues(dataLists);
                this.updateChangeEvent(item, prevItemData, prevItemEle, currentValue,
                                       currentText, currentIndex, isRerender, isInitial);
                this.gridObj.selectRow(this.index);
            } else if (!isNOU(this.dataSource) && this.dataSource instanceof Array) {
                if (!this.fields.groupBy) {
                    item = (<{ [key: string]: Object }[]>this.dataSource)[this.index];
                    updateValues(this.dataSource);
                }
                else {
                    setTimeout((): void => {
                        const rows: Element[] = this.gridObj.getRows();
                        if (rows && rows.length > 0) {
                            const rowData: { [key: string]: Object } =
                            this.gridObj.getRowInfo(rows[this.index]).rowData as { [key: string]: Object };
                            const value: string = this.fields.value as string;
                            for (let i: number = 0; i < rows.length; i++) {
                                if (rowData && rowData[parseInt(value.toString(), 10)] ===
                                (<{ [key: string]: Object }[]>this.dataSource)[parseInt(i.toString(), 10)][parseInt(value.toString(), 10)])
                                {
                                    item = rowData;
                                    updateValues(this.dataSource);
                                    this.updateChangeEvent(item, prevItemData, prevItemEle, currentValue, currentText,
                                                           currentIndex, isRerender, isInitial);
                                    this.gridObj.selectRow(this.index);
                                    break;
                                }
                            }
                        }
                    });
                }
            }
        }
        if (!(this.dataSource instanceof DataManager)) {
            this.updateChangeEvent(item, prevItemData, prevItemEle, currentValue, currentText, currentIndex, isRerender, isInitial);
        }
    }

    private updateChangeEvent(item: { [key: string]: Object }, prevItemData: { text: string, value: string }, prevItemEle: HTMLElement,
                              currentValue: string, currentText: string, currentIndex: number,
                              isRerender?: boolean, isInitial?: boolean ): void {
        const fieldValue: string = item ? this.updateFieldValue(this.fields.value, item) : null;
        const ChangeEventArgs: ChangeEventArgs = {
            value: item ? fieldValue : null,
            itemData: { text: currentText, value: currentValue },
            item: this.getDataByValue(this.value),
            previousItemData: prevItemData,
            previousItemElement: prevItemEle,
            itemElement: this.inputWrapper,
            event: null,
            isInteracted: !isRerender
        };
        this.updateValues(currentValue, currentText, currentIndex, ChangeEventArgs, isInitial);
    }

    private updateCurrentValues(item: { [key: string]: Object }, dataList: { [key: string]: Object }[]): { currentValue: string | null,
        currentText: string | null, currentIndex: number } {
        if (!isNOU(item)) {
            const fieldText: string = this.updateFieldValue(this.fields.text, item);
            const fieldValue: string = this.updateFieldValue(this.fields.value, item);
            Input.setValue(fieldText, this.inputEle, this.floatLabelType, this.showClearButton);
            return {
                currentValue: fieldValue,
                currentText: fieldText,
                currentIndex: dataList.indexOf(item)
            };
        }
        return {
            currentValue: null,
            currentText: null,
            currentIndex: null
        };
    }

    private renderPopup(): void {
        this.popupEle = this.createElement('div', {
            id: this.element.id + '_options', className: MULTICOLUMNLIST + ' e-popup ' + (this.cssClass !== null ? this.cssClass : '')
        });
        attributes(this.popupEle, { 'aria-label': this.element.id, 'role': 'dialog' });
        document.body.appendChild(this.popupEle);
        this.createPopup(this.popupEle);
        prepend([this.popupDiv], this.popupEle);
        if (this.footerTemplate) { this.setFooterTemplate(); }
        let popupHeight: string = this.getSize(false);
        this.popupEle.style.maxHeight = popupHeight;
        if (this.footerTemplate) {
            const height: number = Math.round(this.footer.getBoundingClientRect().height);
            popupHeight = formatUnit(parseInt(popupHeight, 10) - height + 'px');
        }
        this.popupDiv.style.maxHeight = popupHeight;
        this.updateGridHeight();
        this.popupEle.style.visibility = 'hidden';
        this.isInitialRender = true;
    }

    private updateGridHeight(isFilter?: boolean, autoHeight?: boolean): void {
        let height: string;
        if (isFilter) {
            const gridContentEle: HTMLElement = this.gridObj.getContent().querySelector('.e-content');
            const scrollBarHeight: number = gridContentEle.offsetHeight - gridContentEle.clientHeight;
            if (this.fields.groupBy !== '' && !isNOU(this.fields.groupBy)) { this.popupRowHeight += this.popupRowHeight; }
            height = autoHeight ? (this.popupRowHeight < this.prevGridHeight ? (this.popupRowHeight + scrollBarHeight) + 'px' : this.prevGridHeight + 'px') : this.prevGridHeight + 'px';
        }
        else {
            this.prevGridHeight = this.popupDiv.getBoundingClientRect().height - this.popupDiv.querySelector('.e-gridheader').getBoundingClientRect().height;
            height = this.prevGridHeight + 'px';
        }
        const prevOnChange: boolean = this.isProtectedOnChange;
        this.isProtectedOnChange = true;
        this.gridObj.height = height;
        this.isProtectedOnChange = prevOnChange;
    }

    private createPopup(element: HTMLElement): void {
        this.popupObj = new Popup(element, {
            width: this.getSize(true),
            targetType: 'relative',
            collision: { X: 'flip', Y: 'flip' },
            relateTo: this.inputWrapper,
            enableRtl: this.enableRtl,
            position: { X: 'left', Y: 'bottom' },
            targetExitViewport: () => {
                if (!Browser.isDevice) {
                    this.hidePopup();
                }
            },
            open: () => {
                this.inputEle.focus();
                this.updateClearIconState();
            }
        });
    }

    private setFooterTemplate(): void {
        if (this.footer) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if ((this as any).isReact && typeof this.footerTemplate === 'function') {
                this.clearTemplate(['footerTemplate']);
            } else {
                this.footer.innerHTML = '';
            }
        } else {
            this.footer = this.createElement('div');
            addClass([this.footer], 'e-popup-footer');
        }
        const compiledString: Function = this.getTemplateFunction(this.footerTemplate);
        const dataCount: number = (<{ [key: string]: Object }[]>this.dataSource).length;
        let tempArr: Element[] = compiledString({ count: dataCount }, this, 'footerTemplate', this.element.id + 'footerTemplate', this.isStringTemplate, undefined, this.footer);
        if (tempArr) {
            tempArr = Array.prototype.slice.call(tempArr);
            append(tempArr, this.footer);
        }
        append([this.footer], this.popupEle);
    }

    private l10nUpdate(actionFailure?: boolean): void {
        if (this.noRecord) {
            this.noRecord.innerHTML = '';
        } else {
            this.noRecord = this.createElement('div');
        }
        if (this.noRecordsTemplate !== 'No records found' || this.actionFailureTemplate !== 'Request Failed') {
            const template: string | Function = actionFailure ? this.actionFailureTemplate : this.noRecordsTemplate;
            const templateId: string = actionFailure ? this.element.id + '_actionFailure' : this.element.id + '_noRecords';
            const templatestring: string = actionFailure ? 'actionFailureTemplate' : 'noRecordsTemplate';
            const compiledString: Function = this.getTemplateFunction(template);
            let tempArr: Element[] = compiledString({}, this, templatestring, templateId, this.isStringTemplate, undefined, this.noRecord);
            if (tempArr) {
                tempArr = Array.prototype.slice.call(tempArr);
                append(tempArr, this.noRecord);
            }
        } else {
            const l10nLocale: Object = { noRecordsTemplate: 'No records found', actionFailureTemplate: 'Request Failed' };
            this.l10n = new L10n('multicolumncombobox', l10nLocale, this.locale);
            this.noRecord.innerHTML = actionFailure ?
                this.l10n.getConstant('actionFailureTemplate') : this.l10n.getConstant('noRecordsTemplate');
        }
        addClass([this.noRecord], 'e-no-records');
        prepend([this.noRecord], this.popupDiv);
        this.popupObj.refreshPosition();
    }

    /**
     * Gets template content based on the template property value.
     *
     * @param {string | Function} template - Template property value.
     * @returns {Function} - Return template function.
     * @hidden
     */
    private getTemplateFunction(template: string | Function): Function {
        if (typeof template === 'string') {
            let content: string = '';
            try {
                const tempEle: HTMLElement = select(template);
                if (tempEle) {
                    //Return innerHTML incase of jsrenderer script else outerHTML
                    content = tempEle.tagName === 'SCRIPT' ? tempEle.innerHTML : tempEle.outerHTML;
                } else {
                    content = template;
                }
            } catch (e) {
                content = template;
            }
            return compile(content);
        } else {
            /* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
            return compile(template as any);
        }
    }

    /*To calculate the width and height of the popup */
    private getSize(ispopupWidth: boolean): string {
        const currentDimension: string | number = ispopupWidth ? this.popupWidth : this.popupHeight;
        let size: string = formatUnit(currentDimension);
        if (size.includes('%')) {
            const dimensionValue: number = ispopupWidth ? this.inputWrapper.offsetWidth : document.documentElement.clientHeight;
            size = (dimensionValue * parseFloat(size) / 100).toString() + 'px';
        } else if (typeof currentDimension === 'string') {
            size = currentDimension.match(/px|em/) ? currentDimension : size;
        }
        return size;
    }

    private selectedGridRow(row: Element, e?: MouseEvent | KeyboardEvent | TouchEvent, isKeyNav?: boolean): void {
        const eventArgs: SelectEventArgs = {
            isInteracted: e ? true : false,
            item: this.gridObj.getSelectedRecords()[0],
            itemElement: row as HTMLElement,
            itemData: this.gridObj.getSelectedRecords()[0] as { text: string, value: string },
            event: e,
            cancel: false
        };
        const selectedRecords: { [key: string]: Object } = this.gridObj.getSelectedRecords()[0] as { [key: string]: Object };
        const dataText: string = selectedRecords ? this.updateFieldValue(this.fields.text, selectedRecords) : '';
        const dataValue: string = selectedRecords ? this.updateFieldValue(this.fields.value, selectedRecords) : '';
        const ChangeEventArgs: ChangeEventArgs = {
            isInteracted: e ? true : false,
            item: selectedRecords,
            itemElement: row as HTMLElement,
            itemData: { text: selectedRecords ? dataText : '', value: selectedRecords ? dataValue : '' },
            event: e,
            cancel: false,
            value: selectedRecords ? dataValue : '',
            previousItemData: { text: this.text, value: this.value },
            previousItemElement: this.previousItemElement
        };
        this.trigger('select', eventArgs, (eventArgs: SelectEventArgs) => {
            if (!eventArgs.cancel && eventArgs.itemData) {
                const event: KeyboardEvent = e as KeyboardEvent;
                const isUpdateVal: boolean = event.key === 'Enter' || event.key === 'Tab' || event.shiftKey && event.key === 'Tab' || event.altKey && event.key === 'ArrowUp';
                if (!isKeyNav || (isKeyNav && isUpdateVal)) {
                    this.updateValues(selectedRecords ? dataValue : '', selectedRecords ? dataText : '', this.gridObj.selectedRowIndex, ChangeEventArgs);
                }
                Input.setValue(selectedRecords ? dataText : '', this.inputEle, this.floatLabelType, this.showClearButton);
                this.setHiddenValue();
                if (!isKeyNav || (isKeyNav && isUpdateVal)) { this.hidePopup(e as KeyboardEventArgs); }
            }
        });
    }

    private updateValues(value: string, text: string, index: number, eventArgs: ChangeEventArgs, isInitial?: boolean): void {
        this.previousItemElement = eventArgs.itemElement;
        const prevOnChange: boolean = this.isProtectedOnChange;
        this.isProtectedOnChange = true;
        this.text = text || this.text;
        this.value = value || this.value;
        this.index = this.selectedRowIndex = !isNOU(index) ? index : this.index;
        this.isProtectedOnChange = prevOnChange;
        this.setHiddenValue();
        if (!isInitial) { this.triggerChangeEvent(eventArgs); }
    }

    private triggerChangeEvent(eventArgs: ChangeEventArgs): void {
        this.trigger('change', eventArgs, (eventArgs: ChangeEventArgs) => {
            if (eventArgs.cancel) {
                return;
            }
        });
    }

    private inputHandler(e: Event): void {
        this.showPopup(null, true);
        this.updateClearIconState();
        if (this.allowFiltering) {
            this.typedString = (<HTMLInputElement>e.target).value.toLowerCase();
            const eventArgs: FilteringEventArgs = {
                preventDefaultAction: false,
                text: this.typedString,
                updateData: (
                    dataSource: { [key: string]: Object }[] | DataManager,
                    query?: Query,
                    fields?: FieldSettingsModel) => {
                    if (eventArgs.cancel) { return; }
                    this.isCustomFilter = true;
                    this.customFilterQuery = query ? query.clone() : query;
                    this.isMainDataUpdated = false;
                    if (query) { this.setGridData(dataSource, query); } else {
                        const filtered: Object | DataManager = this.filterDatas(dataSource as { [key: string]: Object }[],
                                                                                this.typedString).data;
                        this.setGridData(this.typedString !== '' ? filtered : dataSource, query);
                    }
                },
                event: e,
                cancel: false
            };
            this.trigger('filtering', eventArgs, (eventArgs: FilteringEventArgs) => {
                if (!eventArgs.cancel && !eventArgs.preventDefaultAction && !this.isCustomFilter) {
                    this.setGridData(this.dataSource, this.query ? this.query.clone() : null);
                }
            });
        }
        this.updateInputValue((<HTMLInputElement>e.target).value);
    }

    private async updateInputValue(inputValue: string): Promise<void> {
        let data: { [key: string]: Object }[];
        let exactData: { [key: string]: Object }[];
        if (this.dataSource instanceof DataManager) {
            ({ data, exactData } = this.filterDatas(this.mainData as { [key: string]: Object }[], inputValue));
        } else if (Array.isArray(this.dataSource)) {
            ({ data, exactData } = this.filterDatas(this.dataSource, inputValue));
        }
        this.selectFilteredRows(data, exactData);
    }

    private filterDatas(dataSource: { [key: string]: Object }[], inputValue: string): { data: { [key: string]: Object }[],
        exactData: { [key: string]: Object }[] } {
        const data: { [key: string]: Object }[] = dataSource.filter((item: { [key: string]: Object }) => {
            const fieldText: string = this.updateFieldValue(this.fields.text, item);
            return inputValue && fieldText.toLowerCase().startsWith(inputValue.toLowerCase());
        });
        const exactData: { [key: string]: Object }[] = dataSource.filter((item: { [key: string]: Object }) => {
            const fieldText: string = this.updateFieldValue(this.fields.text, item);
            return fieldText === inputValue;
        });
        return { data, exactData };
    }

    private selectFilteredRows(data: { [key: string]: Object }[], exactData: { [key: string]: Object }[]): void {
        if (data.length <= 0) {
            this.matchedRowEle = this.matchedContent = this.exactMatchedContent = null;
            return;
        }
        this.matchedContent = data[0];
        this.exactMatchedContent = exactData[0];
        const selectedIndex: number = this.findIndex(this.gridObj.currentViewData, this.matchedContent);
        this.matchedRowEle = this.gridObj.getRowByIndex(selectedIndex);
    }

    private updateGridDataSource(): void {
        if (this.gridData && (this.gridData as any).length > 0) {
            removeClass([this.popupDiv], [NODATA]);
            const noRecordEle: HTMLElement = this.popupDiv.querySelector('.e-no-records');
            if (noRecordEle) { this.popupDiv.removeChild(noRecordEle); }
            this.gridObj.dataSource = this.gridData;
            this.isDataFiltered = true;
        } else {
            this.l10nUpdate();
            addClass([this.popupDiv], [NODATA]);
        }
    }

    private wireEvents(): void {
        if (!isNOU(this.inputObj.buttons[0])) {
            EventHandler.add(this.inputObj.buttons[0], 'mousedown', this.preventBlur, this);
            EventHandler.add(this.inputObj.buttons[0], 'mousedown', this.dropDownClick, this);
        }
        EventHandler.add(document, 'mousedown', this.onDocumentClick, this);
        EventHandler.add(this.gridEle, 'click', this.onMouseClick, this);
        EventHandler.add(this.inputEle, 'input', this.inputHandler, this);
        EventHandler.add(this.inputEle, 'focus', this.focusIn, this);
        if (this.showClearButton) {
            EventHandler.add(this.inputObj.clearButton, 'mousedown', this.clearText, this);
        }
        EventHandler.add(<HTMLElement & Window><unknown>window, 'resize', this.windowResize, this);
        this.keyboardModule = new KeyboardEvents(
            this.inputWrapper,
            {
                keyAction: this.keyActionHandler.bind(this),
                keyConfigs: this.keyConfigs,
                eventName: 'keydown'
            }
        );
        this.keyboardModule = new KeyboardEvents(
            this.gridEle,
            {
                keyAction: this.gridKeyActionHandler.bind(this),
                keyConfigs: this.keyConfigs,
                eventName: 'keydown'
            }
        );
    }

    private unWireEvents(): void {
        if (!isNOU(this.inputObj.buttons[0])) {
            EventHandler.remove(this.inputObj.buttons[0], 'mousedown', this.preventBlur);
            EventHandler.remove(this.inputObj.buttons[0], 'mousedown', this.dropDownClick);
        }
        EventHandler.remove(document, 'mousedown', this.onDocumentClick);
        EventHandler.remove(this.inputEle, 'input', this.inputHandler);
        EventHandler.remove(this.inputWrapper, 'focus', this.focusIn);
        EventHandler.remove(<HTMLElement & Window><unknown>window, 'resize', this.windowResize);
        EventHandler.remove(this.gridEle, 'click', this.onMouseClick);
        if (this.showClearButton) {
            EventHandler.remove(this.inputObj.clearButton, 'mousedown', this.clearText);
        }
        if (this.keyboardModule) { this.keyboardModule.destroy(); }
    }

    private preventBlur(e: MouseEvent): void {
        e.preventDefault();
    }

    private dropDownClick(e: MouseEvent): void {
        if (this.disabled || this.readonly) { return; }
        const focusedEle: HTMLElement = this.gridEle.querySelector('.e-row-focus');
        if (focusedEle) { focusedEle.classList.remove('e-row-focus'); }
        if (this.isPopupOpen) { this.hidePopup(e); }
        else { this.showPopup(e); }
    }

    private onMouseClick(e: MouseEvent): void {
        const target: Element = <Element>e.target;
        const row: HTMLElement = <HTMLElement>closest(target, '.e-row');
        const selectedRowIndex: number = this.gridObj.selectedRowIndex;
        if (row) {
            if (selectedRowIndex >= 0) { this.selectedGridRow(row, e); }
            else {
                this.gridObj.selectedRowIndex = this.gridObj.getRows().indexOf(row);
                this.gridObj.selectRow(this.gridObj.selectedRowIndex);
                this.hidePopup(e);
            }
        }
    }

    private onDocumentClick(e: MouseEvent): void {
        const target: HTMLElement = e.target as HTMLElement;
        if (this.disabled || this.readonly || !this.isPopupOpen) {
            if (!target.closest('.e-multicolumn-list')) { this.focusOut(); }
            return;
        }
        if ((target.classList.contains('e-multicolumn-list-icon') || closest(target, '.e-multicolumn-list.e-popup'))) { e.preventDefault(); }
        else {
            if (!target.classList.contains('e-multicolumncombobox') && !target.classList.contains('e-clear-icon')) {
                if (!isNOU(this.text)) { this.updateInputValue(this.text); }
                const isClearVal: boolean = this.inputEle.value === '' ? true : false;
                this.updateValuesOnInput(e, null, isClearVal);
            }
        }
    }

    private updateValuesOnInput(mouseEvent?: MouseEvent, keyEvent?: KeyboardEventArgs, isClearValues?: boolean,
                                isKeyDown: boolean = false): void {
        const e: MouseEvent | KeyboardEventArgs = mouseEvent ? mouseEvent : keyEvent;
        const val: { [key: string]: Object } = isKeyDown ? this.matchedContent : this.exactMatchedContent;
        if (!val && (e as KeyboardEventArgs).code !== 'Enter') {
            this.inputEle.value = null;
            this.setProperties({ value: null, index: null, text: null }, true);
        }
        this.hidePopup(e);
        if (this.matchedRowEle && !isClearValues && val) {
            const prevOnChange: boolean = this.isProtectedOnChange;
            this.isProtectedOnChange = true;
            const fieldText: string = this.updateFieldValue(this.fields.text, this.matchedContent);
            const fieldValue: string = this.updateFieldValue(this.fields.value, this.matchedContent);
            this.inputEle.value = fieldText;
            this.value = fieldValue;
            const selectIndex: number = this.findIndex(this.gridObj.currentViewData, this.matchedContent);
            this.index = selectIndex;
            this.text = fieldText;
            this.gridObj.selectRow(selectIndex);
            this.selectedGridRow(this.gridObj.getRowByIndex(selectIndex), e);
            this.previousItemElement = this.gridObj.getSelectedRows()[0] as HTMLElement;
            this.isProtectedOnChange = prevOnChange;
        }
        else {
            if (this.isDataFiltered) {
                this.inputEle.value = '';
                const ChangeEventArgs: ChangeEventArgs = {
                    value: null,
                    itemData: { text: null, value: null },
                    item: null,
                    previousItemData: { text: this.text, value: this.value },
                    previousItemElement: this.previousItemElement,
                    itemElement: null,
                    event: e,
                    isInteracted: true,
                    cancel: false
                };
                const prevOnChange: boolean = this.isProtectedOnChange;
                this.isProtectedOnChange = true;
                this.text = this.value = this.index = null;
                this.gridObj.refreshColumns();
                this.isProtectedOnChange = prevOnChange;
                this.triggerChangeEvent(ChangeEventArgs);
                this.isDataFiltered = false;
                this.matchedContent = this.matchedRowEle = null;
            }
        }
    }

    private clearText(e: MouseEvent): void {
        this.isDataFiltered = true;
        this.updateValuesOnInput(e, null, true);
    }

    private windowResize(): void {
        if (this.popupObj) {
            this.popupObj.setProperties({ width: this.getSize(true) });
            this.popupObj.refreshPosition();
        }
    }

    /* To set cssclass for the dropdowntree */
    private setCssClass(newClass: string, oldClass: string): void {
        const elements: HTMLElement[] = this.popupObj ? [this.inputWrapper, this.popupObj.element] : [this.inputWrapper];
        if (!isNOU(oldClass) && oldClass !== '') {
            removeClass(elements, oldClass.split(' '));
        }
        if (!isNOU(newClass) && newClass !== '') {
            addClass(elements, newClass.split(' '));
        }
    }

    private keyActionHandler(e: KeyboardEventArgs): void {
        switch (e.action) {
        case 'escape':
        case 'altUp':
        case 'shiftTab':
        case 'tab':
            if (this.isPopupOpen) { this.hidePopup(e); }
            else { this.focusOut(); }
            break;
        case 'altDown':
            if (!this.isPopupOpen) {
                this.showPopup(e);
                this.updateSelectedItem(e, false);
            }
            break;
        case 'moveDown':
        case 'moveUp':
            this.updateSelectedItem(e, true, true);
            break;
        case 'enter':
            this.updateValuesOnInput(null, e, false, true);
            this.focusIn(e);
            break;
        case 'home':
        case 'end':
            this.updateSelectedItem(e);
            break;
        }
    }

    private gridKeyActionHandler(e: KeyboardEventArgs, isGroup?: boolean): void {
        const keyActionMap: { [key: string]: string } = {
            'ArrowDown': 'moveDown',
            'ArrowUp': 'moveUp',
            'End': 'end',
            'Home': 'home',
            'Tab': 'tab',
            'Escape': 'escape',
            'Shift+Tab': 'shiftTab',
            'Alt+ArrowUp': 'altUp'
        };
        if (isGroup) {
            const key: string = `${e.altKey ? 'Alt+' : ''}${e.shiftKey ? 'Shift+' : ''}${e.key}`;
            e.action = keyActionMap[key as string] || e.action;
        }
        switch (e.action) {
        case 'escape':
        case 'tab':
        case 'shiftTab':
        case 'altUp':
            if (this.isPopupOpen) {
                e.preventDefault();
                if (e.action !== 'escape') {
                    this.updateSelectedItem(e);
                }
                this.hidePopup(e);
            }
            break;
        case 'moveDown':
        case 'moveUp':
        case 'home':
        case 'end':
            this.updateSelectedItem(e);
            break;
        }
    }

    private updateSelectedItem(e: KeyboardEventArgs, isUpdateIndex: boolean = true, isInputTarget?: boolean): void {
        if (this.isPopupOpen) {
            let index: number = this.fields.groupBy ? (this.gridObj.selectedRowIndex || 0) : this.gridObj.selectedRowIndex;
            const dataLength: number = this.dataSource instanceof DataManager ? this.remoteDataLength :
                (this.dataSource as { [key: string]: Object }[]).length;
            if ((index === -1 && (e.action === 'moveDown' || e.action === 'moveUp')) || (e.action === 'home')) { index = 0; }
            else if ((index >= (dataLength - 1) && e.action === 'moveDown') || (e.action === 'end')) { index = dataLength - 1; }
            else if (e.action === 'moveDown' && (index >= 0 && index <= (dataLength - 1)) && (this.fields.groupBy || isInputTarget)) { index += 1; }
            else if (e.action === 'moveUp' && index > 0 && (this.fields.groupBy) || isInputTarget) { index -= 1; }
            if (!this.enableVirtualization) { this.selectRow(e, isUpdateIndex, index); }
            else { setTimeout((): void => { this.selectRow(e, isUpdateIndex, index); }); }
        }
    }

    private selectRow(e: KeyboardEventArgs, isUpdateIndex: boolean = true, index: number): void {
        this.gridObj.selectRow(index);
        this.gridObj.selectedRowIndex = index;
        const focusedEle: HTMLElement = this.gridEle.querySelector('.e-row-focus');
        if (focusedEle) { focusedEle.classList.remove('e-row-focus'); }
        if (isUpdateIndex) { this.selectedGridRow(this.gridObj.getRows()[parseInt(index.toString(), 10)], e, true); }
    }

    private updateClearIconState(): void {
        const clearIconEle: HTMLElement = this.inputWrapper.querySelector('.e-clear-icon');
        if (clearIconEle) { clearIconEle.style.display = this.inputEle.value === '' ? 'none' : 'flex'; }
    }

    private updateDynamicDataSource(newDataSource: Object | DataManager | DataResult,
                                    oldDataSource: Object | DataManager | DataResult): void {
        if (this.gridObj) {
            let dataLength: number;
            this.isMainDataUpdated = false;
            this.isShowSpinner = true;
            this.setGridData(newDataSource);
            const isRemoteData: boolean = oldDataSource instanceof DataManager;
            if (isRemoteData) {
                (oldDataSource as DataManager).executeQuery(new Query()).then((e: Object) => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    dataLength = (e as any).result.length;
                });
            } else {
                dataLength = (oldDataSource as { [key: string]: Object }[]).length;
            }
            if (dataLength === 0) { this.popupDiv.appendChild(this.gridEle); }
        }
    }

    /**
     * Sets the focus to the component for interaction.component for interaction.
     *
     * @param {FocusEvent | MouseEvent | KeyboardEvent | TouchEvent} e - Specifies the event.
     * @returns {void}
     */
    public focusIn(e?: FocusEvent | MouseEvent | KeyboardEvent | TouchEvent): void {
        if (this.disabled || this.readonly) { return; }
        addClass([this.inputWrapper], [INPUTFOCUS]);
        this.inputEle.focus();
        this.updateClearIconState();
        this.trigger('focus', e);
        if (this.floatLabelType !== 'Never') {
            Input.calculateWidth(this.inputEle, this.inputWrapper);
        }
    }

    /**
     * Moves the focus from the component if the component is already focused.
     *
     * @param {MouseEvent | KeyboardEvent} e - Specifies the event.
     * @returns {void}
     */
    public focusOut(e?: MouseEvent | KeyboardEventArgs): void {
        if (this.disabled || this.readonly) { return; }
        if (this.isPopupOpen) { this.hidePopup(e); }
        if (this.inputWrapper) {
            removeClass([this.inputWrapper], [INPUTFOCUS]);
            const clearIconEle: HTMLElement = this.inputWrapper.querySelector('.e-clear-icon');
            if (clearIconEle) { clearIconEle.style.display = 'none'; }
            if (this.floatLabelType !== 'Never') {
                Input.calculateWidth(this.inputEle, this.inputWrapper);
            }
        }
    }

    /**
     * Opens the popup that displays the list of items.
     *
     * @param {MouseEvent | KeyboardEventArgs | TouchEvent} e - Specifies the event.
     * @param {boolean} isInputOpen - Specifies whether the input is open or not.
     * @returns {void}
     */
    public showPopup(e?: MouseEvent | KeyboardEventArgs | TouchEvent, isInputOpen?: boolean): void {
        const animModel: AnimationModel = { name: 'FadeIn', duration: 100 };
        const eventArgs: PopupEventArgs = { popup: this.popupObj, event: e, cancel: false, animation: animModel };
        this.trigger('open', eventArgs, (eventArgs: PopupEventArgs) => {
            if (!eventArgs.cancel && !this.isPopupOpen) {
                this.isPopupOpen = true;
                this.popupObj.refreshPosition();
                addClass([this.inputWrapper], [ICONANIMATION]);
                attributes(this.inputEle, { 'aria-expanded': 'true', 'aria-owns': this.element.id + '_options', 'aria-controls': this.element.id });
                if (!isInputOpen) {
                    if ((this.value || this.text || this.index)) {
                        this.gridObj.selectRow(this.selectedRowIndex);
                    }
                }
                const contentEle: Element = this.gridObj.getContent();
                if (contentEle) {
                    const activeRow: HTMLElement = contentEle.querySelector('.e-rowcell.e-active');
                    const firstRow: HTMLElement | null = contentEle.querySelector('.e-row');
                    if (activeRow) { this.inputEle.setAttribute('aria-activedescendant', activeRow.parentElement.getAttribute('data-uid')); }
                    else if (firstRow) { this.inputEle.setAttribute('aria-activedescendant', firstRow.getAttribute('data-uid')); }
                }
                this.popupObj.show(new Animation(eventArgs.animation), this.popupEle.firstElementChild as HTMLElement);
            }
        });
    }

    /**
     * Hides the popup if it is in open state.
     *
     * @param {MouseEvent | KeyboardEventArgs | TouchEvent} e - Specifies the event.
     * @returns {void}
     */
    public hidePopup(e?: MouseEvent | KeyboardEventArgs | TouchEvent): void {
        const animModel: AnimationModel = { name: 'FadeOut', duration: 100 };
        const eventArgs: PopupEventArgs = { popup: this.popupObj, event: e || null, cancel: false, animation: animModel };
        const target: HTMLElement | null = e ? e.target as HTMLElement : null;
        this.trigger('close', eventArgs, (eventArgs: PopupEventArgs) => {
            if (!eventArgs.cancel) {
                this.isPopupOpen = false;
                removeClass([this.inputWrapper], [ICONANIMATION]);
                attributes(this.inputEle, { 'aria-expanded': 'false' });
                this.popupObj.hide(new Animation(eventArgs.animation));
                if (target && (target.classList.contains('e-multicolumn-list-icon') || target.classList.contains('e-rowcell'))) {
                    if (!this.value) { this.gridObj.refreshColumns(); }
                    setTimeout((): void => { this.focusIn(e); });
                }
                else { this.focusOut(); }
                this.inputEle.removeAttribute('aria-owns');
                this.inputEle.removeAttribute('aria-activedescendant');
                this.customFilterQuery = null;
            }
        });
        setTimeout((): void => {
            if (this.gridObj) {
                this.gridObj.dataSource = this.allowFiltering ? this.mainData : this.gridData;
                const noRecordEle: HTMLElement = this.popupDiv.querySelector('.e-no-records');
                if (noRecordEle) {
                    this.popupDiv.removeChild(noRecordEle);
                    removeClass([this.popupDiv], [NODATA]);
                }
                this.updateGridHeight(true, false);
            }
        }, 100);
    }

    /**
     * Adds a new item to the popup list. By default, new item appends to the list as the last item,
     * but you can insert based on the index parameter.
     *
     * @param { Object[] } items - Specifies an array of JSON data or a JSON data.
     * @param { number } index - Specifies the index to place the newly added item in the popup list.
     * @returns {void}
     */
    public addItems(items: { [key: string]: Object }[] | { [key: string]: Object }, index?: number): void {
        const prevOnChange: boolean = this.isProtectedOnChange;
        this.isProtectedOnChange = true;
        this.gridObj.editSettings.allowAdding = true;
        this.gridObj.dataBind();
        this.isProtectedOnChange = prevOnChange;
        this.gridObj.addRecord(items, index);
    }

    /* eslint-disable valid-jsdoc, jsdoc/require-returns-description */
    /**
     * Gets all the list items bound on this component.
     *
     * @returns {Element[]}
     */
    public getItems(): Element[] {
        return this.gridObj.getDataRows();
    }

    /**
     * Gets the data Object that matches the given value.
     *
     * @param { string } value - Specifies the value of the list item.
     * @returns {Object}
     */
    public getDataByValue(value: string): { [key: string]: Object } {
        if (!isNOU(this.dataSource) && this.dataSource instanceof Array) {
            return (<{ [key: string]: Object }[]>this.dataSource).filter((item: { [key: string]: Object }) => {
                const fieldValue: string = this.updateFieldValue(this.fields.value, item);
                return fieldValue === value;
            })[0];
        }
        else if (!isNOU(this.dataSource) && this.dataSource instanceof DataManager && this.mainData
            && this.isMainDataUpdated) {
            const dataLists: { [key: string]: Object }[] = ((this.query && this.getQuery(this.query as Query).isCountRequired) ||
                !this.query) ? (this.mainData as any) : (this.mainData as any).result ? (this.mainData as any).result : this.mainData;
            return dataLists.filter((item: { [key: string]: Object }) => {
                const fieldValue: string = this.updateFieldValue(this.fields.value, item);
                return fieldValue === value;
            })[0];
        }
        return null;
    }

    public destroy(): void {
        this.unWireEvents();
        if (this.gridObj) {
            this.gridObj.destroy();
            detach(this.gridObj.element);
        }
        if (this.inputEle) {
            const attrArray: string[] = ['placeholder', 'aria-expanded', 'spellcheck', 'aria-label', 'role', 'type',
                'aria-owns', 'aria-controls', 'aria-readonly', 'autocomplete', 'autocapitalize', 'spellcheck', 'aria-activedescendant'];
            for (let i: number = 0; i < attrArray.length; i++) {
                this.inputEle.removeAttribute(attrArray[i as number]);
            }
            this.inputEle.classList.remove('e-input');
            Input.setValue('', this.inputEle, this.floatLabelType, this.showClearButton);
        }
        if (this.popupEle) {
            this.popupEle.removeAttribute('aria-label');
            this.popupEle.removeAttribute('role');
        }
        if (this.popupObj) {
            this.popupObj.destroy();
            detach(this.popupObj.element);
        }
        if (this.element.tagName !== this.getDirective()) {
            this.inputWrapper.parentElement.insertBefore(this.element, this.inputWrapper);
        }
        if (this.inputObj) {
            detach(this.inputObj.container);
            this.inputObj = null;
        }
        Input.destroy({
            element: this.inputEle,
            floatLabelType: this.floatLabelType,
            properties: this.properties
        });
        detach(this.inputWrapper);
        detach(this.popupDiv);
        this.inputEle = null;
        this.previousItemElement = null;
        this.inputWrapper.innerHTML = '';
        this.inputWrapper = null;
        this.popupDiv = null;
        this.popupObj = null;
        this.gridObj = null;
        this.gridEle = null;
        this.popupEle = null;
        this.footer = null;
        this.noRecord = null;
        this.hiddenElement = null;
        this.dropdownElement = null;
        super.destroy();
    }

    /**
     * Called internally if any of the property value changed.
     *
     * @param  {MultiColumnComboBoxModel} newProp - Specifies new properties
     * @param  {MultiColumnComboBoxModel} oldProp - Specifies old properties
     * @returns {void}
     * @private
     */
    public onPropertyChanged(newProp: MultiColumnComboBoxModel, oldProp?: MultiColumnComboBoxModel): void {
        for (const prop of Object.keys(newProp)) {
            let gridColumns: ColumnModel[];
            switch (prop) {
            case 'width':
            case 'popupWidth':
                if (prop === 'width') { this.setElementWidth(newProp.width); }
                if (this.popupObj) { this.popupObj.element.style.width = this.getSize(true); }
                break;
            case 'popupHeight':
                if (this.popupObj) {
                    const height: string = this.getSize(false);
                    this.popupObj.element.style.maxHeight = height;
                    this.popupDiv.style.maxHeight = height;
                    this.gridObj.height = height;
                }
                break;
            case 'placeholder':
                Input.setPlaceholder(newProp.placeholder, this.inputEle);
                break;
            case 'readonly':
                Input.setReadonly(this.readonly, this.inputEle);
                break;
            case 'disabled':
                Input.setEnabled(!this.disabled, this.inputEle);
                this.setEnable();
                break;
            case 'cssClass':
                this.setCssClass(newProp.cssClass, oldProp.cssClass);
                break;
            case 'floatLabelType':
                Input.removeFloating(this.inputObj);
                Input.addFloating(this.inputEle, this.floatLabelType, this.placeholder);
                break;
            case 'showClearButton':
                Input.setClearButton(newProp.showClearButton, this.inputEle, this.inputObj);
                break;
            case 'value':
                this.initValue(true, true);
                break;
            case 'text':
                this.initValue(true, false);
                break;
            case 'index':
                this.initValue(true);
                break;
            case 'sortOrder':
                if (this.gridObj) {
                    this.gridObj.sortSettings.columns = [{
                        field: this.fields.text, direction: newProp.sortOrder === SortOrder.Ascending ?
                            SortOrder.Ascending : SortOrder.Descending  }];
                }
                break;
            case 'htmlAttributes':
                this.setHTMLAttributes();
                break;
            case 'noRecordsTemplate':
                this.l10nUpdate();
                break;
            case 'actionFailureTemplate':
                this.l10nUpdate(true);
                break;
            case 'footerTemplate':
                this.setFooterTemplate();
                break;
            case 'itemTemplate':
                if (this.gridObj) { this.gridObj.rowTemplate = newProp.itemTemplate; }
                break;
            case 'groupTemplate':
                this.groupTemplate = newProp.groupTemplate;
                this.updateGroupByField();
                break;
            case 'enableRtl':
                if (this.gridObj && this.popupObj) {
                    this.gridObj.enableRtl = newProp.enableRtl;
                    Input.setEnableRtl(newProp.enableRtl, [this.inputWrapper]);
                    this.popupObj.enableRtl = newProp.enableRtl;
                }
                break;
            case 'dataSource':
                this.updateDynamicDataSource(newProp.dataSource, oldProp.dataSource);
                break;
            case 'query':
                this.isMainDataUpdated = false;
                this.setGridData(this.dataSource);
                break;
            case 'gridSettings':
                if (this.gridObj) {
                    this.gridObj.gridLines = newProp.gridSettings.gridLines;
                    this.gridObj.rowHeight = newProp.gridSettings.rowHeight;
                    this.gridObj.enableAltRow = newProp.gridSettings.enableAltRow;
                    this.gridObj.allowResizing = newProp.gridSettings.allowResizing;
                    if (!(isNOU(newProp.gridSettings.allowTextWrap))) {
                        this.gridObj.allowTextWrap = newProp.gridSettings.allowTextWrap;
                    }
                    if (!(isNOU(newProp.gridSettings.textWrapMode))) {
                        this.gridObj.textWrapSettings.wrapMode = newProp.gridSettings.textWrapMode as WrapMode;
                    }
                }
                break;
            case 'fields':
                this.fields = newProp.fields;
                this.updateGroupByField();
                break;
            case 'filterType':
                this.filterType = newProp.filterType;
                break;
            case 'enableVirtualization':
                if (this.gridObj) { this.enableVirtualization = this.gridObj.enableVirtualization = newProp.enableVirtualization; }
                break;
            case 'sortType':
                if (this.gridObj) {
                    this.sortType = newProp.sortType;
                    this.gridObj.allowMultiSorting = this.sortType.toString().toLowerCase() === 'multiplecolumns' && this.allowSorting;
                }
                break;
            case 'allowFiltering':
                this.allowFiltering = newProp.allowFiltering;
                break;
            case 'allowSorting':
                if (this.gridObj) { this.allowSorting = this.gridObj.allowSorting = newProp.allowSorting; }
                break;
            case 'columns':
                if (this.gridObj) {
                    gridColumns = this.getGridColumns();
                    this.gridObj.columns = gridColumns;
                }
                break;
            case 'locale':
                this.isLocaleChanged = true;
                break;
            }
        }
    }
}
