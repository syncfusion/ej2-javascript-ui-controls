import { Input, InputObject } from '@syncfusion/ej2-inputs';import { DropDownBase, dropDownBaseClasses, FilteringEventArgs, SelectEventArgs } from '../drop-down-base/drop-down-base';import { FilterType, FieldSettings } from '../drop-down-base/drop-down-base';import { FieldSettingsModel } from '../drop-down-base/drop-down-base-model';import { EventHandler, closest, removeClass, addClass, Complex, Property, ChildProperty, BaseEventArgs, L10n } from '@syncfusion/ej2-base';import { ModuleDeclaration, NotifyPropertyChanges, getComponent, EmitType, Event, extend, detach, attributes } from '@syncfusion/ej2-base';import { getUniqueID, Browser, formatUnit, isNullOrUndefined, getValue } from '@syncfusion/ej2-base';import { prepend, append , isBlazor, BlazorDragEventArgs, resetBlazorTemplate} from '@syncfusion/ej2-base';import { cssClass, Sortable, moveTo, SortOrder } from '@syncfusion/ej2-lists';import { Button } from '@syncfusion/ej2-buttons';import { createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';import { DataManager, Query } from '@syncfusion/ej2-data';
import {SelectionMode,CheckBoxPosition,ToolBarPosition,BeforeItemRenderEventArgs,ListBoxChangeEventArgs,DropEventArgs,DragEventArgs} from "./list-box";
import {DropDownBaseModel} from "../drop-down-base/drop-down-base-model";

/**
 * Interface for a class SelectionSettings
 */
export interface SelectionSettingsModel {

    /**
     * Specifies the selection modes. The possible values are
     * * `Single`: Allows you to select a single item in the ListBox.
     * * `Multiple`: Allows you to select more than one item in the ListBox.
     * @default 'Multiple'
     */
    mode?: SelectionMode;

    /**
     * If 'showCheckbox' is set to true, then 'checkbox' will be visualized in the list item.
     * @default false
     */
    showCheckbox?: boolean;

    /**
     * Allows you to either show or hide the selectAll option on the component.
     * @default false
     */
    showSelectAll?: boolean;

    /**
     * Set the position of the checkbox.
     * @default 'Left'
     */
    checkboxPosition?: CheckBoxPosition;

}

/**
 * Interface for a class ToolbarSettings
 */
export interface ToolbarSettingsModel {

    /**
     * Specifies the list of tools for dual ListBox.
     * The predefined tools are 'moveUp', 'moveDown', 'moveTo', 'moveFrom', 'moveAllTo', and 'moveAllFrom'.
     * @default []
     */
    items?: string[];

    /**
     * Positions the toolbar before/after the ListBox.
     * The possible values are:
     * * Left: The toolbar will be positioned to the left of the ListBox.
     * * Right: The toolbar will be positioned to the right of the ListBox.
     * @default 'Right'
     */
    position?: ToolBarPosition;

}

/**
 * Interface for a class ListBox
 */
export interface ListBoxModel extends DropDownBaseModel{

    /**
     * The `fields` property maps the columns of the data table and binds the data to the component.
     * * text - Maps the text column from data table for each list item.
     * * value - Maps the value column from data table for each list item.
     * * iconCss - Maps the icon class column from data table for each list item.
     * * groupBy - Group the list items with it's related items by mapping groupBy field.
     * ```html
     * <input type="text" tabindex="1" id="list"> </input>
     * ```
     * ```typescript  
     *   let customers: ListBox = new ListBox({
     *      dataSource:new DataManager({ url:'http://js.syncfusion.com/demos/ejServices/Wcf/Northwind.svc/' }),
     *      query: new Query().from('Customers').select(['ContactName', 'CustomerID']).take(5),
     *      fields: { text: 'ContactName', value: 'CustomerID' },
     *      placeholder: 'Select a customer'
     *   });
     *   customers.appendTo("#list");
     * ```
     * @default {text: null, value: null, iconCss: null, groupBy: null}
     */
    fields?: FieldSettingsModel;

    /**
     * Enable or disable persisting ListBox component's state between page reloads. 
     * If enabled, following list of states will be persisted.
     * 1. value
     * @default false
     */
    enablePersistence?: boolean;

    /**
     * Accepts the template design and assigns it to each list item present in the popup.
     * We have built-in `template engine`
     * 
     * which provides options to compile template string into a executable function. 
     * For EX: We have expression evolution as like ES6 expression string literals. 
     * @default null
     */
    itemTemplate?: string;

    /**
     * Specifies the `sortOrder` to sort the ListBox data source. The available type of sort orders are
     * * `None` - The data source is not sorting.
     * * `Ascending` - The data source is sorting with ascending order.
     * * `Descending` - The data source is sorting with descending order.
     * @default None
     */
    sortOrder?: SortOrder;

    /**
     * Specifies a value that indicates whether the ListBox component is enabled or not.
     * @default true
     */
    enabled?: boolean;

    /**
     * Accepts the list items either through local or remote service and binds it to the ListBox component.
     * It can be an array of JSON Objects or an instance of
     * `DataManager`.
     * @default []
     */
    dataSource?: { [key: string]: Object }[] | DataManager | string[] | number[] | boolean[];

    /**
     * Accepts the external `Query`
     * which will execute along with the data processing.
     * @default null
     */
    query?: Query;

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
     * @default 'StartsWith'
     */
    filterType?: FilterType;

    /**
     * Overrides the global culture and localization value for this component. Default global culture is 'en-US'.
     * @default 'en-US'
     */
    locale?: string;

    /**
     * Sets the CSS classes to root element of this component, which helps to customize the
     * complete styles.
     * @default ''
     */
    cssClass?: string;

    /**
     * Sets the specified item to the selected state or gets the selected item in the ListBox.
     * @default []
     * @aspType object
     * @isGenericType true
     */
    value?: string[] | number[] | boolean[];

    /**
     * Sets the height of the ListBox component.
     * @default ''
     */
    height?: number | string;

    /**
     * If 'allowDragAndDrop' is set to true, then you can perform drag and drop of the list item.
     * ListBox contains same 'scope' property enables drag and drop between multiple ListBox.
     * @default false
     */
    allowDragAndDrop?: boolean;

    /**
     * Sets limitation to the value selection.
     * based on the limitation, list selection will be prevented.
     * @default 1000
     */
    maximumSelectionLength?: number;

    /**
     * To enable the filtering option in this component. 
     * Filter action performs when type in search box and collect the matched item through `filtering` event.
     * If searching character does not match, `noRecordsTemplate` property value will be shown.
     * @default false
     */
    allowFiltering?: boolean;

    /**
     * Defines the scope value to group sets of draggable and droppable ListBox.
     * A draggable with the same scope value will be accepted by the droppable.
     * @default ''
     */
    scope?: string;

    /**
     * When set to ‘false’, consider the `case-sensitive` on performing the search to find suggestions.
     * By default consider the casing.
     * @default true
     * @private
     */
    ignoreCase?: boolean;

    /**
     * Triggers while rendering each list item.
     * @event
     * @blazorProperty 'OnItemRender'
     */
    beforeItemRender?: EmitType<BeforeItemRenderEventArgs>;

    /**
     * Triggers on typing a character in the component.
     * @event
     * @blazorProperty 'ItemSelected'
     */
    filtering?: EmitType<FilteringEventArgs>;

    /**
     * Triggers when an item in the popup is selected by the user either with mouse/tap or with keyboard navigation.
     * @event
     * @private
     */
    select?: EmitType<SelectEventArgs>;

    /**
     * Triggers while select / unselect the list item.
     * @event
     * @blazorProperty 'ValueChange'
     */
    change?: EmitType<ListBoxChangeEventArgs>;

    /**
     * Triggers before dropping the list item on another list item.
     * @event
     * @blazorProperty 'OnDrop'
     */
    beforeDrop?: EmitType<DropEventArgs>;

    /**
     * Triggers after dragging the list item.
     * @event
     * @blazorProperty 'DragStart'
     */
    dragStart?: EmitType<DragEventArgs>;

    /**
     * Triggers while dragging the list item.
     * @event
     * @blazorProperty 'Dragging'
     */
    drag?: EmitType<DragEventArgs>;

    /**
     * Triggers before dropping the list item on another list item.
     * @event
     * @blazorProperty 'Dropped'
     */
    drop?: EmitType<DragEventArgs>;

    /**
     * Triggers when data source is populated in the list.
     * @event
     * @private
     */
    dataBound?: EmitType<Object>;

    /**
     * Accepts the template design and assigns it to the group headers present in the list.
     * @default null
     * @private
     */
    groupTemplate?: string;

    /**
     * Accepts the template design and assigns it to list of component
     * when no data is available on the component.
     * @default 'No Records Found'
     * @private
     */
    noRecordsTemplate?: string;

    /**
     * Accepts the template and assigns it to the list content of the ListBox component
     * when the data fetch request from the remote server fails.
     * @default 'The Request Failed'
     * @private
     */
    actionFailureTemplate?: string;

    /**
     * specifies the z-index value of the component popup element.
     * @default 1000
     * @private
     */
    zIndex?: number;

    /**
     * ignoreAccent set to true, then ignores the diacritic characters or accents when filtering.
     * @private
     */
    ignoreAccent?: boolean;

    /**
     * Specifies the toolbar items and its position.
     * @default { items: [], position: 'Right' }
     */
    toolbarSettings?: ToolbarSettingsModel;

    /**
     * Specifies the selection mode and its type.
     * @default { mode: 'Multiple', type: 'Default' }
     */
    selectionSettings?: SelectionSettingsModel;

}