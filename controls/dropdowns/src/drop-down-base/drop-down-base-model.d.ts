import { Component, EventHandler, addClass, append, Property, Event, KeyboardEvents, EmitType, L10n, compile } from '@syncfusion/ej2-base';import { setStyleAttribute, extend, removeClass, prepend, isNullOrUndefined, detach, getValue, AnimationModel } from '@syncfusion/ej2-base';import { NotifyPropertyChanges, INotifyPropertyChanged, rippleEffect, RippleOptions, ChildProperty, Complex } from '@syncfusion/ej2-base';import { DataManager, Query, DataOptions, DataUtil } from '@syncfusion/ej2-data';import { ListBase, SortOrder } from '@syncfusion/ej2-lists';import { Popup } from '@syncfusion/ej2-popups';import { updateBlazorTemplate, resetBlazorTemplate, isBlazor, remove, select } from '@syncfusion/ej2-base';
import {FilterType,SelectEventArgs} from "./drop-down-base";
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class FieldSettings
 */
export interface FieldSettingsModel {

    /**
     * Maps the text column from data table for each list item
     * @default null
     */
    text?: string;

    /**
     * Maps the value column from data table for each list item
     * @default null
     */
    value?: string;

    /**
     * Maps the icon class column from data table for each list item.
     * @default null
     */
    iconCss?: string;

    /**
     * Group the list items with it's related items by mapping groupBy field.
     * @default null
     */
    groupBy?: string;

    /**
     * Allows additional attributes such as title, disabled, etc., to configure the elements 
     * in various ways to meet the criteria.
     * @default null
     */
    htmlAttributes?: string;

}

/**
 * Interface for a class DropDownBase
 */
export interface DropDownBaseModel extends ComponentModel{

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
     *   let customers: DropDownList = new DropDownList({
     *      dataSource:new DataManager({ url:'http://js.syncfusion.com/demos/ejServices/Wcf/Northwind.svc/' }),
     *      query: new Query().from('Customers').select(['ContactName', 'CustomerID']).take(5),
     *      fields: { text: 'ContactName', value: 'CustomerID' },
     *      placeholder: 'Select a customer'
     *   });
     *   customers.appendTo("#list");
     * ```
     * @default {text: null, value: null, iconCss: null, groupBy: null}
     * @deprecated
     */
    fields?: FieldSettingsModel;

    /**
     * Enable or disable persisting component's state between page reloads. 
     * If enabled, following list of states will be persisted.
     * 1. value
     * @default false
     * @deprecated
     */
    enablePersistence?: boolean;

    /**
     * Accepts the template design and assigns it to each list item present in the popup.
     * We have built-in `template engine`
     * 
     * which provides options to compile template string into a executable function. 
     * For EX: We have expression evolution as like ES6 expression string literals. 
     * @default null
     * @deprecated
     */
    itemTemplate?: string;

    /**
     * Accepts the template design and assigns it to the group headers present in the popup list.
     * @default null
     * @deprecated
     */
    groupTemplate?: string;

    /**
     * Accepts the template design and assigns it to popup list of component
     * when no data is available on the component.
     * @default 'No records found'
     * @deprecated
     */
    noRecordsTemplate?: string;

    /**
     * Accepts the template and assigns it to the popup list content of the component
     * when the data fetch request from the remote server fails.
     * @default 'Request failed'
     * @deprecated
     */
    actionFailureTemplate?: string;

    /**
     * Specifies the `sortOrder` to sort the data source. The available type of sort orders are
     * * `None` - The data source is not sorting.
     * * `Ascending` - The data source is sorting with ascending order.
     * * `Descending` - The data source is sorting with descending order.
     * @default null
     * @asptype object
     * @aspjsonconverterignore
     * @deprecated
     */
    sortOrder?: SortOrder;

    /**
     * Specifies a value that indicates whether the component is enabled or not.
     * @default true
     * @deprecated
     */
    enabled?: boolean;

    /**
     * Accepts the list items either through local or remote service and binds it to the component.
     * It can be an array of JSON Objects or an instance of
     * `DataManager`.
     * @default []
     * @deprecated
     */
    dataSource?: { [key: string]: Object }[] | DataManager | string[] | number[] | boolean[];

    /**
     * Accepts the external `Query`
     * which will execute along with the data processing.
     * @default null
     * @deprecated
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
     * @deprecated
     */
    filterType?: FilterType;

    /**
     * When set to ‘false’, consider the `case-sensitive` on performing the search to find suggestions.
     * By default consider the casing.
     * @default true
     * @deprecated
     */
    ignoreCase?: boolean;

    /**
     * specifies the z-index value of the component popup element.
     * @default 1000
     * @deprecated
     */
    zIndex?: number;

    /**
     * ignoreAccent set to true, then ignores the diacritic characters or accents when filtering.
     * @deprecated
     */
    ignoreAccent?: boolean;

    /**
     * Overrides the global culture and localization value for this component. Default global culture is 'en-US'.
     * @default 'en-US'
     * @deprecated
     */
    locale?: string;

    /**
     * Triggers before fetching data from the remote server.
     * @event
     * @blazorProperty 'OnActionBegin'
     * @blazorType ActionBeginEventArgs
     */
    actionBegin?: EmitType<Object>;

    /**
     * Triggers after data is fetched successfully from the remote server.
     * @event
     * @blazorProperty 'OnActionComplete'
     * @blazorType ActionCompleteEventArgs
     */
    actionComplete?: EmitType<Object>;

    /**
     * Triggers when the data fetch request from the remote server fails.
     * @event
     * @blazorProperty 'OnActionFailure'
     */
    actionFailure?: EmitType<Object>;

    /**
     * Triggers when an item in the popup is selected by the user either with mouse/tap or with keyboard navigation.
     * @event
     * @blazorProperty 'OnValueSelect'
     */
    select?: EmitType<SelectEventArgs>;

    /**
     * Triggers when data source is populated in the popup list..
     * @event
     * @blazorProperty 'DataBound'
     * @blazorType DataBoundEventArgs
     */
    dataBound?: EmitType<Object>;

    /**
     * Triggers when the component is created.
     * @event 
     * @blazorProperty 'Created'
     */
    created?: EmitType<Object>;

    /**
     * Triggers when the component is destroyed.
     * @event
     * @blazorProperty 'Destroyed'
     */
    destroyed?: EmitType<Object>;

}