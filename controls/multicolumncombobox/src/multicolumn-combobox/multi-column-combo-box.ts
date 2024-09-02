import { Component, EventHandler, INotifyPropertyChanged, Property, NotifyPropertyChanges, closest, attributes, append, compile, detach, KeyboardEvents, isNullOrUndefined } from '@syncfusion/ej2-base';
import { ChildProperty, prepend, Collection, getUniqueID, Complex, isNullOrUndefined as isNOU, select, L10n, Browser } from '@syncfusion/ej2-base';
import { formatUnit, addClass, removeClass, NumberFormatOptions, DateFormatOptions, Event, EmitType, AnimationModel, Animation, KeyboardEventArgs } from '@syncfusion/ej2-base';
import { Input, InputObject } from '@syncfusion/ej2-inputs';
import { DataManager, Query, Group } from '@syncfusion/ej2-data';
import { Popup } from '@syncfusion/ej2-popups';
import { Grid, FailureEventArgs, VirtualScroll, Group as GridGroup, Edit, Sort, GridColumnModel } from '@syncfusion/ej2-grids';
import { MultiColumnComboBoxModel } from './multi-column-combo-box-model';
import { ColumnModel, FieldSettingsModel, GridSettingsModel } from './multi-column-combo-box-model';

const DROPDOWNICON: string = 'e-input-group-icon e-multicolumn-list-icon e-icons';
const CONTENT: string = 'e-popup-content';
const ICONANIMATION: string = 'e-icon-anim';
const NODATA: string = 'e-nodata';
const DISABLED: string = 'e-disabled';
const INPUTFOCUS: string = 'e-input-focus';
const MULTICOLUMNLIST: string = 'e-multicolumn-list';
const MULTICOLUMNGRID: string = 'e-multicolumn-grid';

export class MultiColumnGrid {
    /**
     * Injecting required modules for component.
     *
     * @returns {void}
     * @private
     */
    public InjectModules(): void {
        Grid.Inject(VirtualScroll, GridGroup, Edit, Sort);
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
 *  <input type="text" id="multi-column"></input>
 * ```
 * ```typescript
 *  let multiColObj: MultiColumnComboBox = new MultiColumnComboBox();
 *  multiColObj.appendTo("#multi-column");
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
    private isDataFiltered: boolean;
    private isInitialRender: boolean;

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
        this.matchedRowEle = this.matchedContent = null;
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
            this.element.id = this.element.id + '_wrapper';
            const data: string = window.localStorage.getItem(this.getModuleName() + this.element.id);
            if (!(isNOU(data) || (data === ''))) {
                this.setProperties(JSON.parse(data), true);
            }
        }
    }

    protected render(): void {
        this.renderGrid();
        this.renderInput();
        this.popupDiv = this.createElement('div', { className: CONTENT });
        this.popupDiv.appendChild(this.gridEle);
        this.setHTMLAttributes();
        this.renderPopup();
        this.wireEvents();
    }

    private renderGrid(): void {
        const gridColumns: ColumnModel[] = this.getGridColumns();
        this.gridObj = new Grid({
            dataSource: this.dataSource,
            columns: gridColumns,
            allowSorting: this.allowSorting,
            enableStickyHeader: true,
            gridLines: this.gridSettings.gridLines,
            rowHeight: this.gridSettings.rowHeight,
            enableAltRow: this.gridSettings.enableAltRow,
            enableVirtualization: this.enableVirtualization,
            enableRtl: this.enableRtl,
            editSettings: { allowAdding: false },
            query: this.query,
            allowTextWrap: this.gridSettings.allowTextWrap,
            textWrapSettings: { wrapMode: this.gridSettings.textWrapMode as WrapMode },
            height: this.popupHeight,
            allowMultiSorting: this.sortType.toString().toLowerCase() === 'multiplecolumns' && this.allowSorting,
            rowTemplate: this.itemTemplate,
            dataBound: () => { this.onDataBound(); },
            actionFailure: (args: FailureEventArgs) => { this.onActionFailure(args); },
            actionBegin: (args: { [key: string]: Object }) => { this.trigger('actionBegin', args); },
            actionComplete: (args: { [key: string]: Object }) => {
                this.trigger('actionComplete', args);
                if (args.requestType === 'sorting') {
                    this.updateRowSelection(args);
                }
                const dataRows: any = args.rows;
                if (this.isDataFiltered && dataRows.length > 0 && this.inputEle.value !== '' && args.requestType !== 'sorting') {
                    const firstRowEle: Element = this.gridObj.getRows()[0];
                    firstRowEle.classList.add('e-row-focus');
                }
                this.popupObj.refreshPosition();
            },
            keyPressed: (args: KeyboardEventArgs) => {
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
        });
        this.gridEle = this.createElement('div', { id: getUniqueID('grid'), className: MULTICOLUMNGRID });
        this.updateGroupByField();
        const sortOrder: string = this.sortOrder.toString().toLowerCase();
        // Set first column as primary key to avoid PRIMARY KEY MISSING warning.
        (this.gridObj.columns[0] as GridColumnModel).isPrimaryKey = true;
        if (sortOrder !== 'none') {
            this.gridObj.sortSettings = { columns: [{ field: this.fields.text, direction: sortOrder === 'ascending' ?
            SortOrder.Ascending : SortOrder.Descending }] };
        }
        this.gridObj.appendTo(this.gridEle);
    }

    // eslint-disable @typescript-eslint/no-explicit-any
    private isRowMatching(data: any, selectedValue: string, selectedText: string): boolean {
        const values: any = (Object as any).values(data).map(String);
        const isRowPresent: boolean = values.includes(selectedValue) && values.includes(selectedText);
        return isRowPresent;
    }

    private updateRowSelection(args: any): void {
        if (args) {
            const dataRows: { [key: string]: object }[] = args.rows;
            dataRows.forEach((row: any) => {
                const data: any = row.data;
                const index: number = row.index;
                this.selectDataRow(data, index);
            });
        }
    }

    private selectDataRow(data: any, index: number): void {
        const isPresent: boolean = this.isRowMatching(data, this.value ? this.value.toString() : '', this.text ? this.text.toString() : '');
        if (isPresent) {
            this.gridObj.selectRow(index);
            const prevOnChange: boolean = this.isProtectedOnChange;
            this.isProtectedOnChange = true;
            this.index = index;
            this.isProtectedOnChange = prevOnChange;
            return;
        }
    }

    private findIndex(arr: any, obj: { [key: string]: object }): number {
        return arr.findIndex((item: any) => {
            return Object.keys(obj).every(key => item[key] === obj[key]);
        });
    };

    // eslint-enable @typescript-eslint/no-explicit-any

    private getGridColumns(): ColumnModel[] {
        return this.columns.map((column: ColumnModel) => {
            let changeType: string;
            if (column.displayAsCheckBox && !column.format) {
                changeType = 'boolean';
            }
            return {
                field: column.field,
                headerText: column.header,
                width: column.width,
                textAlign: (column.textAlign as string) === '' && this.enableRtl ? 'Right' : column.textAlign,
                format: column.format,
                displayAsCheckBox: column.displayAsCheckBox,
                template: column.template,
                headerTemplate: column.headerTemplate,
                customAttributes: column.customAttributes,
                type: changeType
            };
        });
    }

    private updateGroupByField(): void {
        if (this.fields.groupBy !== '' && !isNOU(this.fields.groupBy)) {
            if (this.sortType.toString().toLowerCase() !== 'multiplecolumns') { this.gridEle.classList.add('e-multicolumn-group'); }
            const prevOnChange: boolean = this.isProtectedOnChange;
            this.isProtectedOnChange = true;
            this.gridObj.allowGrouping = true;
            this.gridObj.groupSettings = {
                showDropArea: false,
                columns: [this.fields.groupBy],
                captionTemplate: (this.groupTemplate && this.fields.groupBy !== '' && !isNOU(this.fields.groupBy)) 
                ? this.groupTemplate : "${key}"
            };
            if (this.isVue) {
                this.gridObj.isVue = this.isVue;
            }
            this.isProtectedOnChange = prevOnChange;
        }
    }

    private onDataBound(): void {
        const dataCount: number = (<{ [key: string]: Object }[]>this.dataSource).length;
        const popupChild: HTMLElement = this.popupDiv.querySelector('.' + MULTICOLUMNGRID);
        if (dataCount <= 0 && popupChild) {
            this.l10nUpdate();
            this.popupDiv.removeChild(this.gridEle);
            addClass([this.popupDiv], [NODATA]);
        } else if (this.popupDiv.classList.contains(NODATA) && dataCount >= 1) {
            removeClass([this.popupDiv], [NODATA]);
            const noRecordEle: HTMLElement = this.popupDiv.querySelector('.e-no-records');
            if (noRecordEle) { this.popupDiv.removeChild(noRecordEle); }
        }
        if (this.isInitialRender) {
            const rowHeight: number = !this.popupDiv.classList.contains(NODATA) ? this.popupDiv.querySelector('.e-gridcontent tr').getBoundingClientRect().height : this.popupDiv.getBoundingClientRect().height;
            this.popupRowHeight = rowHeight;
            this.popupObj.hide();
            this.popupEle.style.visibility = 'unset';
            this.isInitialRender = false;
        }
    }

    private onActionFailure(args: FailureEventArgs): void {
        this.trigger('actionFailure', args);
        this.l10nUpdate(true);
        addClass([this.popupDiv], [NODATA]);
    }

    private renderInput(): void {
        if (this.element.tagName === 'INPUT') {
            this.inputEle = this.element as HTMLInputElement;
            if (isNOU(this.inputEle.getAttribute('role'))) { this.inputEle.setAttribute('role', 'combobox'); }
            if (isNOU(this.inputEle.getAttribute('type'))) { this.inputEle.setAttribute('type', 'text'); }
            this.inputEle.setAttribute('aria-expanded', 'false');
            this.inputEle.setAttribute('aria-readOnly', this.readonly.toString());
            this.inputEle.setAttribute('aria-disabled', this.disabled.toString());
            this.inputEle.setAttribute('autocomplete', 'off');
            this.inputEle.setAttribute('autocapitalize', 'off');
            this.inputEle.setAttribute('spellcheck', 'false');
            this.inputEle.setAttribute('tabindex', '0');
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
        if (this.element.tagName === this.getDirective()) {
            this.element.appendChild(this.inputWrapper);
        }
        this.setElementWidth(this.width);
        if (!isNOU(this.value) || !isNOU(this.text) || !isNOU(this.index)) { this.initValue(null, null, true); }
    }

    /* To calculate the width when change via set model */
    private setElementWidth(inputWidth: string | number): void {
        const ddElement: HTMLElement = this.inputWrapper;
        if (!isNOU(inputWidth)) {
            if (typeof inputWidth === 'number') { ddElement.style.width = formatUnit(inputWidth); }
            else if (typeof inputWidth === 'string') {
                ddElement.style.width = (inputWidth.match(/px|%|em/)) ? (inputWidth) : (formatUnit(inputWidth));
            }
        }
    }

    private setHTMLAttributes(): void {
        if (Object.keys(this.htmlAttributes).length) {
            for (const htmlAttr of Object.keys(this.htmlAttributes)) {
                if (htmlAttr === 'class') {
                    this.inputWrapper.classList.add(this.htmlAttributes[`${htmlAttr}`]);
                } else if (htmlAttr === 'disabled') {
                    this.setProperties({ enabled: false }, true);
                    this.setEnable();
                } else if (htmlAttr === 'readonly') {
                    this.setProperties({ readonly: true }, true);
                    this.dataBind();
                } else if (htmlAttr === 'style') {
                    this.inputWrapper.setAttribute('style', this.htmlAttributes[`${htmlAttr}`]);
                } else {
                    const defaultAttr: string[] = ['title', 'id', 'placeholder',
                        'role', 'autocomplete', 'autocapitalize', 'spellcheck', 'minlength', 'maxlength'];
                    if (defaultAttr.indexOf(htmlAttr) > -1) {
                        if (htmlAttr === 'placeholder') {
                            Input.setPlaceholder(this.htmlAttributes[`${htmlAttr}`], this.inputEle);
                        } else {
                            this.inputEle.setAttribute(htmlAttr, this.htmlAttributes[`${htmlAttr}`]);
                        }
                    } else {
                        this.inputEle.setAttribute(htmlAttr, this.htmlAttributes[`${htmlAttr}`]);
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
            this.inputEle.setAttribute('aria-disabled', 'false');
            this.inputWrapper.setAttribute('aria-disabled', 'false');
        } else {
            if (this.isPopupOpen) {
                this.hidePopup();
            }
            addClass([this.inputWrapper], DISABLED);
            if (this.inputWrapper && this.inputWrapper.classList.contains(INPUTFOCUS)) {
                removeClass([this.inputWrapper], [INPUTFOCUS]);
            }
            this.inputEle.setAttribute('aria-disabled', 'true');
            this.inputWrapper.setAttribute('aria-disabled', 'true');
        }
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
        const updateValues = (dataList: { [key: string]: Object }[]) => {
            const result = this.updateCurrentValues(item, dataList);
            currentValue = result.currentValue;
            currentText = result.currentText;
            currentIndex = result.currentIndex;
        };
        if ((!isRerender && (!isNOU(this.value) || !isNOU(this.text))) || (isRerender && isValue !== undefined)) {
            const value: string = isRerender ? (isValue ? this.value : this.text) : (!isNOU(this.value) ? this.value : this.text);
            if (!isNOU(this.dataSource) && this.dataSource instanceof DataManager) {
                (this.dataSource as DataManager).executeQuery(new Query).then((e: Object) => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const dataLists: { [key: string]: Object }[] = (e as any).result;
                    const filteredData: { [key: string]: Object }[] = dataLists.filter((item: { [key: string]: Object }) => {
                        return item[isRerender ? (isValue ? this.fields.value : this.fields.text) :
                            !isNOU(this.value) ? this.fields.value : this.fields.text].toString() === value;
                    });
                    if (filteredData.length > 0) {
                        item = filteredData[0];
                        updateValues(dataLists);
                        this.updateChangeEvent(item, prevItemData, prevItemEle, currentValue, currentText, currentIndex, isRerender, isInitial);
                        this.gridObj.selectRow(this.index);
                    }
                });
            } else if (!isNOU(this.dataSource) && this.dataSource instanceof Array) {
                item = (<{ [key: string]: Object }[]>this.dataSource).filter((data: { [key: string]: Object }) => {
                    return data[isRerender ? (isValue ? this.fields.value : this.fields.text) :
                        !isNOU(this.value) ? this.fields.value : this.fields.text].toString() === value;
                })[0];
                updateValues(this.dataSource);
            }
        } else if (!isNOU(this.index)) {
            if (!isNOU(this.dataSource) && this.dataSource instanceof DataManager) {
                (this.dataSource as DataManager).executeQuery(new Query).then((e: Object) => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const dataLists: { [key: string]: Object }[] = (e as any).result;
                    item = dataLists[this.index];
                    updateValues(dataLists);
                    this.updateChangeEvent(item, prevItemData, prevItemEle, currentValue, currentText, currentIndex, isRerender, isInitial);
                    this.gridObj.selectRow(this.index);
                });
            } else if (!isNOU(this.dataSource) && this.dataSource instanceof Array) {
                item = (<{ [key: string]: Object }[]>this.dataSource)[this.index];
                updateValues(this.dataSource);
            }
        }
        if (!(this.dataSource instanceof DataManager)) {
            this.updateChangeEvent(item, prevItemData, prevItemEle, currentValue, currentText, currentIndex, isRerender, isInitial);
        }
    }

    private updateChangeEvent(item: { [key: string]: Object }, prevItemData: { text: string, value: string }, prevItemEle: HTMLElement,
        currentValue: string, currentText: string, currentIndex: number, isRerender?: boolean, isInitial?: boolean ): void {
        const ChangeEventArgs: ChangeEventArgs = {
            value: item ? item[this.fields.value].toString() : null,
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

    private updateCurrentValues(item: { [key: string]: Object }, dataList: { [key: string]: Object }[]): { currentValue: string | null, currentText: string | null, currentIndex: number } {
        if (!isNOU(item)) {
            Input.setValue(item[this.fields.text].toString(), this.inputEle, this.floatLabelType, this.showClearButton);
            return {
                currentValue: item[this.fields.value].toString(),
                currentText: item[this.fields.text].toString(),
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
            this.footer = this.footer ? this.footer : this.popupEle.querySelector('.e-popup-footer');
            const height: number = Math.round(this.footer.getBoundingClientRect().height);
            popupHeight = formatUnit(parseInt(popupHeight, 10) - height + 'px');
        }
        this.popupDiv.style.maxHeight = popupHeight;
        this.updateGridHeight();
        this.popupEle.style.visibility = 'hidden';
        this.isInitialRender = true;
    }

    private updateGridHeight(isFilter?: boolean, autoHeight?: boolean, dataSourceCount?: number): void {
        let height: string;
        if (isFilter) {
            const gridContentEle: HTMLElement = this.gridObj.getContent().querySelector('.e-content');
            const scrollBarHeight: number = gridContentEle.offsetHeight - gridContentEle.clientHeight;
            let totalRowHeight: number = dataSourceCount * this.popupRowHeight;
            if (this.fields.groupBy !== '' && !isNOU(this.fields.groupBy)) { totalRowHeight += this.popupRowHeight; }
            height = autoHeight ? (totalRowHeight < this.prevGridHeight ? (totalRowHeight + scrollBarHeight) + 'px' : this.prevGridHeight + 'px') : this.prevGridHeight + 'px';
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
        if (size.indexOf('%') > -1) {
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
        const fieldText = selectedRecords ? selectedRecords[this.fields.text].toString() : '';
        const fieldValue = selectedRecords ? selectedRecords[this.fields.value].toString() : '';
        const ChangeEventArgs: ChangeEventArgs = {
            isInteracted: e ? true : false,
            item: selectedRecords,
            itemElement: row as HTMLElement,
            itemData: { text: fieldText, value: fieldValue },
            event: e,
            cancel: false,
            value: fieldValue,
            previousItemData: { text: this.text, value: this.value },
            previousItemElement: this.previousItemElement
        };
        this.trigger('select', eventArgs, (eventArgs: SelectEventArgs) => {
            if (!eventArgs.cancel && eventArgs.itemData) {
                const selectedRecord: { [key: string]: Object } = eventArgs.itemData as { [key: string]: Object };
                const event: KeyboardEvent = e as KeyboardEvent;
                const isUpdateVal: boolean = event.key === 'Enter' || event.key === 'Tab' || event.shiftKey && event.key === 'Tab' || event.altKey && event.key === 'ArrowUp';
                if (!isKeyNav || (isKeyNav && isUpdateVal)) {
                    this.updateValues(selectedRecord[this.fields.value] as string,
                                      selectedRecord[this.fields.text] as string, this.gridObj.selectedRowIndex, ChangeEventArgs);
                }
                Input.setValue(selectedRecord[this.fields.text] as string, this.inputEle, this.floatLabelType, this.showClearButton);
                if (!isKeyNav || (isKeyNav && isUpdateVal)) { this.hidePopup(e as KeyboardEventArgs); }
            }
        });
    }

    private updateValues(value: string, text: string, index: number, eventArgs: ChangeEventArgs, isInitial?: boolean): void {
        this.previousItemElement = eventArgs.itemElement;
        const prevOnChange: boolean = this.isProtectedOnChange;
        this.isProtectedOnChange = true;
        this.text = text ? text : this.text;
        this.value = value ? value : this.value;
        this.index = !isNOU(index) ? index : this.index;
        this.isProtectedOnChange = prevOnChange;
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
            const inputValue: string = (<HTMLInputElement>e.target).value.toLowerCase();
            let customFiltering: boolean = false;
            const eventArgs: FilteringEventArgs = {
                preventDefaultAction: false,
                text: inputValue,
                updateData: (
                    dataSource: { [key: string]: Object }[] | DataManager,
                    query?: Query,
                    fields?: FieldSettingsModel) => {
                    if (eventArgs.cancel) { return; }
                    customFiltering = true;
                    this.filterAction(dataSource, inputValue, query, fields);
                },
                event: e,
                cancel: false
            };
            this.trigger('filtering', eventArgs, (eventArgs: FilteringEventArgs) => {
                if (!eventArgs.cancel && !eventArgs.preventDefaultAction && !customFiltering) {
                    this.filterAction(this.dataSource, inputValue, this.query, this.fields);
                }
            });
        }
        this.updateInputValue((<HTMLInputElement>e.target).value);
    }

    private updateInputValue(inputValue: string): void {
        let data: { [key: string]: Object }[];
        if (this.dataSource instanceof DataManager) {
            const query: Query = new Query();
            (this.dataSource as DataManager).executeQuery(query).then((result: any) => {
                const totaldata: { [key: string]: Object }[] = result.result as { [key: string]: Object }[];
                data = totaldata.filter((item: { [key: string]: Object }) => {
                    return item[this.fields.text].toString().toLowerCase().startsWith(inputValue.toLowerCase());
                });
                this.selectFilteredRows(data);
            });
        } else if (Array.isArray(this.dataSource)) {
            data = this.dataSource.filter((item: { [key: string]: Object }) => {
                return item[this.fields.text].toString().toLowerCase().startsWith(inputValue.toLowerCase());
            });
            this.selectFilteredRows(data);
        }
    }

    private selectFilteredRows(data: { [key: string]: Object }[]): void {
        if (data.length > 0) {
            this.matchedContent = data[0];
        } else {
            this.matchedContent = null;
        }
        if (this.matchedContent) {
            const selectedIndex: number = this.findIndex(this.gridObj.currentViewData, this.matchedContent);
            this.matchedRowEle = this.gridObj.getRowByIndex(selectedIndex);
        } else {
            this.matchedRowEle = null;
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private filterAction(dataSource: any, inputValue: string, query?: Query, fields?: FieldSettingsModel): void {
        let dataLists: { [key: string]: Object }[];
        if (isNullOrUndefined(query) && isNullOrUndefined(fields)) {
            this.updateGridDataSource(dataSource);
        }
        else if (query) {
            new DataManager(dataSource as DataManager).executeQuery(query).then((e: Object) => {
                dataLists = (e as any).result;
                this.updateGridDataSource(dataLists);
            });
        }
        else {
            const filterType: string = this.filterType.toString().toLowerCase();
            const isQuery: Query = query || new Query();
            let filteredData: { [key: string]: Object }[];
            if (dataSource instanceof DataManager) {
                // Handle filtering for DataManager
                (dataSource as DataManager).executeQuery(isQuery).then((e: Object) => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const dataLists: { [key: string]: Object }[] = (e as any).result;
                    const dataLength: number = dataLists.length;
                    filteredData = dataLists.filter(
                        (item: { [key: string]: Object }) => this.filterData(item, filterType, inputValue, fields));
                    this.updateGridDataSource(filteredData, dataLength);
                });
            } else if (Array.isArray(dataSource)) {
                // Handle filtering for array data source
                filteredData = (dataSource as { [key: string]: Object }[]).filter((item: { [key: string]: Object }) =>
                    this.filterData(item, filterType, inputValue, fields));
                this.updateGridDataSource(filteredData);
            }
        }
    }

    private filterData(item: { [key: string]: Object }, filterType: string, inputValue: string, fields: FieldSettingsModel): boolean {
        const itemValue: string = item[fields ? fields.text : this.fields.text].toString().toLowerCase();
        switch (filterType) {
        case 'startswith':
            return itemValue.startsWith(inputValue);
        case 'endswith':
            return itemValue.endsWith(inputValue);
        case 'contains':
            return itemValue.includes(inputValue);
        default:
            return false;
        }
    }

    private updateGridDataSource(dataSource: { [key: string]: Object }[], dataLength?: number): void {
        let autoHeight: boolean = true;
        if (dataSource.length > 0) {
            const length: number = this.dataSource instanceof DataManager ? dataLength : (this.dataSource as { [key: string]: Object }[]).length;
            autoHeight = length !== dataSource.length;
            removeClass([this.popupDiv], [NODATA]);
            const noRecordEle: HTMLElement = this.popupDiv.querySelector('.e-no-records');
            if (noRecordEle) { this.popupDiv.removeChild(noRecordEle); }
            this.gridObj.dataSource = dataSource;
            this.isDataFiltered = true;
        } else {
            this.l10nUpdate();
            addClass([this.popupDiv], [NODATA]);
        }
        this.updateGridHeight(true, autoHeight, dataSource.length);
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
        let selectedRowIndex: number = this.gridObj.selectedRowIndex;
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
        if (this.disabled || this.readonly || !this.isPopupOpen) {
            if (!((e.target as HTMLElement).closest('.e-multicolumn-list'))) { this.focusOut(); }
            return;
        }
        const target: HTMLElement = <HTMLElement>e.target;
        if ((target.classList.contains('e-multicolumn-list-icon') || closest(target, '.e-popup'))) { e.preventDefault(); }
        else {
            if (!target.classList.contains('e-multicolumncombobox') && !target.classList.contains('e-clear-icon')) { this.updateValuesOnInput(e); }
        }
    }

    private updateValuesOnInput(mouseEvent?: MouseEvent, keyEvent?: KeyboardEventArgs, isClearValues?: boolean): void {
        const e: MouseEvent | KeyboardEventArgs = mouseEvent ? mouseEvent : keyEvent;
        this.hidePopup(e);
        if (this.matchedRowEle && !isClearValues) {
            const prevOnChange: boolean = this.isProtectedOnChange;
            this.isProtectedOnChange = true;
            setTimeout((): void => {
                this.inputEle.value = this.matchedContent[this.fields.text].toString();
                this.value = this.matchedContent[this.fields.value].toString();
                const selectIndex: number = this.findIndex(this.gridObj.currentViewData, this.matchedContent);
                this.index = selectIndex;
                this.text = this.matchedContent[this.fields.text].toString();
                this.gridObj.selectRow(selectIndex);
                this.selectedGridRow(this.gridObj.getRowByIndex(selectIndex), e);
                this.previousItemElement = this.gridObj.getSelectedRows()[0] as HTMLElement;
            }, 100);
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
            this.updateValuesOnInput(null, e);
            this.focusIn(e);
            break;
        case 'home':
        case 'end':
            this.updateSelectedItem(e);
            break;
        }
    }

    private gridKeyActionHandler(e: KeyboardEventArgs, isGroup?: boolean): void {
        if (isGroup) {
            if (e.key === 'ArrowDown') { e.action = 'moveDown'; }
            else if (e.key === 'ArrowUp') { e.action = 'moveUp'; }
            else if (e.key === 'End') { e.action = 'end'; }
            else if (e.key === 'Home') { e.action = 'home'; }
            else if (e.key === 'Tab') { e.action = 'tab'; }
            else if (e.key === 'Escape') { e.action = 'escape'; }
            if (e.shiftKey && e.key === 'Tab') { e.action = 'shiftTab'; }
            if (e.altKey && e.key === 'ArrowUp') { e.action = 'altUp'; }
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
            let index: number = !this.fields.groupBy ? this.gridObj.selectedRowIndex : this.gridObj.selectedRowIndex ? this.gridObj.selectedRowIndex : 0;
            if ((index === -1 && (e.action === 'moveDown' || e.action === 'moveUp')) || (e.action === 'home')) { index = 0; }
            else if ((index >= this.gridObj.getRows().length && e.action === 'moveDown') || (e.action === 'end')) { index = this.gridObj.getRows().length - 1; }
            else if (e.action === 'moveDown' && (index >= 0 && index <= this.gridObj.getRows().length) && (this.fields.groupBy || isInputTarget)) { index += 1; }
            else if (e.action === 'moveUp' && index > 0 && (this.fields.groupBy) || isInputTarget) { index -= 1; }
            this.gridObj.selectRow(index);
            this.gridObj.selectedRowIndex = index;
            const focusedEle: HTMLElement = this.gridEle.querySelector('.e-row-focus');
            if (focusedEle) { focusedEle.classList.remove('e-row-focus'); }
            if (isUpdateIndex) { this.selectedGridRow(this.gridObj.getRows()[index], e, true); }
        }
    }

    private updateClearIconState(): void {
        const clearIconEle: HTMLElement = this.inputWrapper.querySelector('.e-clear-icon');
        if (clearIconEle) { clearIconEle.style.display = this.inputEle.value === '' ? 'none' : 'flex'; }
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
        removeClass([this.inputWrapper], [INPUTFOCUS]);
        const clearIconEle: HTMLElement = this.inputWrapper.querySelector('.e-clear-icon');
        if (clearIconEle) { clearIconEle.style.display = 'none'; }
        if (this.floatLabelType !== 'Never') {
            Input.calculateWidth(this.inputEle, this.inputWrapper);
        }
    }

    /**
     * Opens the popup that displays the list of items.
     *
     * @param {MouseEvent | KeyboardEventArgs | TouchEvent} e - Specifies the event.
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
                attributes(this.inputEle, { 'aria-expanded': 'true', 'aria-owns': this.element.id + '_popup', 'aria-controls': this.element.id });
                if (!isInputOpen) {
                    if ((this.value || this.text || this.index)) {
                        const dataRows: Object[] = this.gridObj.currentViewData;
                        dataRows.forEach((data: any, index: number) => {
                            this.selectDataRow(data, index);
                        });
                    }
                    this.focusIn(e);
                }
                const contentEle: Element = this.gridObj.getContent();
                if (contentEle) {
                    const activeRow: HTMLElement = contentEle.querySelector('.e-rowcell.e-active');
                    if (activeRow) { this.inputEle.setAttribute('aria-activedescendant', activeRow.parentElement.getAttribute('data-uid')); }
                    else if (contentEle.querySelector('.e-row')) { this.inputEle.setAttribute('aria-activedescendant', contentEle.querySelector('.e-row').getAttribute('data-uid')); }
                }
                
                this.popupObj.show(new Animation(eventArgs.animation), this.popupEle);
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
        this.trigger('close', eventArgs, (eventArgs: PopupEventArgs) => {
            if (!eventArgs.cancel) {
                this.isPopupOpen = false;
                removeClass([this.inputWrapper], [ICONANIMATION]);
                attributes(this.inputEle, { 'aria-expanded': 'false' });
                this.popupObj.hide(new Animation(eventArgs.animation));
                this.inputEle.value = this.text ? this.text.toString() : '';
                if (e) {
                    const target: HTMLElement = <HTMLElement>e.target;
                    if (target && (target.classList.contains('e-multicolumn-list-icon') || target.classList.contains('e-rowcell'))) {
                        if (!this.value) { this.gridObj.refreshColumns(); }
                        setTimeout((): void => { this.focusIn(e); });
                    }
                    else { this.focusOut(); }
                }
                this.inputEle.removeAttribute('aria-owns');
                this.inputEle.removeAttribute('aria-activedescendant');
            }
        });
        setTimeout((): void => {
            if (this.gridObj) {
                this.gridObj.dataSource = this.dataSource;
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
                return item[this.fields.value].toString() === value;
            })[0];
        }
        else if (!isNOU(this.dataSource) && this.dataSource instanceof DataManager){
            (this.dataSource as DataManager).executeQuery(new Query()).then((e: Object) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const dataLists: { [key: string]: Object }[] = (e as any).result;
                return dataLists.filter((item: { [key: string]: Object }) => {
                    return item[this.fields.value].toString() === value;
                })[0];
            });
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
                this.initValue();
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
                if (this.gridObj) { this.gridObj.dataSource = newProp.dataSource; }
                break;
            case 'query':
                if (this.gridObj) { this.gridObj.query = newProp.query; }
                break;
            case 'gridSettings':
                if (this.gridObj) { 
                    this.gridObj.gridLines = newProp.gridSettings.gridLines;
                    this.gridObj.rowHeight = newProp.gridSettings.rowHeight;
                    this.gridObj.enableAltRow = newProp.gridSettings.enableAltRow;
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
                this.sortType = newProp.sortType;
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
            }
        }
    }
}
