import { Input, InputObject, FloatLabelType } from '@syncfusion/ej2-inputs';import { createCheckBox } from '@syncfusion/ej2-buttons';import { NotifyPropertyChanges, INotifyPropertyChanged, Property, Event, EmitType } from '@syncfusion/ej2-base';import { Component, EventHandler, attributes, formatUnit, ChildProperty, remove, L10n, extend } from '@syncfusion/ej2-base';import { addClass, removeClass, detach, prepend, Complex, closest, setValue, getValue, compile, append } from '@syncfusion/ej2-base';import { select, selectAll, isNullOrUndefined as isNOU, matches, Browser } from '@syncfusion/ej2-base';import { DataManager, Query } from '@syncfusion/ej2-data';import { Popup } from '@syncfusion/ej2-popups';import { updateBlazorTemplate, resetBlazorTemplate, isBlazor} from '@syncfusion/ej2-base';import { TreeView, NodeSelectEventArgs, DataBoundEventArgs, FieldsSettingsModel, NodeClickEventArgs } from '@syncfusion/ej2-navigations';import { NodeCheckEventArgs, FailureEventArgs} from '@syncfusion/ej2-navigations';
import {Mode,ExpandOn,SortOrder,DdtBeforeOpenEventArgs,DdtChangeEventArgs,DdtPopupEventArgs,DdtDataBoundEventArgs,DdtFocusEventArgs,DdtSelectEventArgs} from "./drop-down-tree";
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class Fields
 */
export interface FieldsModel {

    /**
     * Binds the field settings for child nodes or mapping field for nested nodes objects that contain array of JSON objects.
     */
    child?: string | FieldsModel;

    /**
     * Specifies the array of JavaScript objects or instance of DataManager to populate the nodes.
     * @default []
     */
    dataSource?: DataManager | { [key: string]: Object }[];

    /**
     * Specifies the mapping field for expand state of the DropDownTree node.
     */
    expanded?: string;

    /**
     * Specifies the mapping field for hasChildren to check whether a node has child nodes or not.
     */
    hasChildren?: string;

    /**
     * Specifies the mapping field for htmlAttributes to be added to the DropDownTree node.
     */
    htmlAttributes?: string;

    /**
     * Specifies the mapping field for icon class of each DropDownTree node that will be added before the text.
     */
    iconCss?: string;

    /**
     * Specifies the mapping field for image URL of each DropDownTree node where image will be added before the text.
     */
    imageUrl?: string;

    /**
     * Specifies the parent ID field mapped in dataSource.
     */
    parentValue?: string;

    /**
     * Defines the external [`Query`](http://ej2.syncfusion.com/documentation/data/api-query.html)
     * that will execute along with data processing.
     * @default null
     */
    query?: Query;

    /**
     * Specifies the mapping field for selected state of the DropDownTree node.
     */
    selected?: string;

    /**
     * Specifies the table name used to fetch data from a specific table in the server.
     */
    tableName?: string;

    /**
     * Specifies the mapping field for text displayed as DropDownTree node's display text.
     */
    text?: string;

    /**
     * Specifies the mapping field for tooltip that will be displayed as hovering text of the DropDownTree node.
     */
    tooltip?: string;

    /**
     * Specifies the ID field mapped in dataSource.
     */
    value?: string;

}

/**
 * Interface for a class TreeSettings
 */
export interface TreeSettingsModel {

    /**
     * Allow us to specify the parent and child nodes to get auto check while we check or uncheck a node.
     * @default false
     */

    autoCheck?: boolean;

    /**
     * Specifies the action on which the node expands or collapses. The available actions are,
     * * `Auto` - In desktop, the expand/collapse operation happens when you double-click the node, and in mobile devices it
     * happens on single-click.
     * * `Click` - The expand/collapse operation happens when you single-click the node in both desktop and mobile devices.
     * * `DblClick` - The expand/collapse operation happens when you double-click the node in both desktop and mobile devices.
     * * `None` - The expand/collapse operation will not happen when you single-click or double-click the node in both desktop
     *  and mobile devices.
     * @default 'Auto'
     */
    expandOn?: ExpandOn;

    /**
     * By default, the load on demand (Lazy load) is set to false. By disabling this property, all the tree nodes are rendered at the
     * beginning itself.
     * @default false
     */
    loadOnDemand?: boolean;

}

/**
 * Interface for a class DropDownTree
 */
export interface DropDownTreeModel extends ComponentModel{

    /**
     * Accepts the template and assigns it to the popup list content of the component
     * when the data fetch request from the remote server fails.
     * @default 'The Request Failed'
     */
    actionFailureTemplate?: string;

    /**
     * Enables or disables multi-selection of nodes. To select multiple nodes:
     * * Select the nodes by holding down the CTRL key while clicking on the nodes.
     * * Select consecutive nodes by clicking the first node to select and hold down the **SHIFT** key
     * and click the last node to select.
     *
     * @default false
     */
    allowMultiSelection?: boolean;

    /**
     * By default, the DropDownTree component fires the change event while focus out the component.
     * If you want to fires the change event on every value selection and remove, then disable the changeOnBlur property. 
     * 
     * @default true
     */
    changeOnBlur?: boolean;

    /**
     * Sets CSS classes to the root element of the component that allows customization of appearance.
     * @default ''
     */
    cssClass?: string;

    /**
     * Sets the delimiter character for ‘default’ , 'box'  ‘delimiter’ visibility modes
     * @default ","
     */
    delimiterChar?: string;

    /**
     *  Specifies a value that indicates whether the DropDownTree component is enabled or not.
     * @default true
     */
    enabled?: boolean;

    /**
     * Specifies the data source and mapping fields to render DropDownTree nodes.
     * @default {value: 'value', text: 'text', dataSource: [], child: 'child', parentValue: 'parentValue', hasChildren: 'hasChildren',
     *  expanded: 'expanded', htmlAttributes: 'htmlAttributes', iconCss: 'iconCss', imageUrl: 'imageUrl',
     *  query: null, selected: 'selected', tableName: null, tooltip: 'tooltip'}
     */
    fields?: FieldsModel;

    /**
     * Specifies whether to display the floating label above the input element.
     * Possible values are:
     * * Never: The label will never float in the input when the placeholder is available.
     * * Always: The floating label will always float above the input.
     * * Auto: The floating label will float above the input after focusing or entering a value in the input.
     * @default Syncfusion.EJ2.Inputs.FloatLabelType.Never
     * @isEnumeration true
     */
    floatLabelType?: FloatLabelType;

    /**
     * Accepts the template design and assigns it to the footer container of the popup list.
     * @default null
     */
    footerTemplate?: string;

    /**
     * Accepts the template design and assigns it to the header container of the popup list.
     * @default null
     */
    headerTemplate?: string;

    /**
     * Specifies a template to render customized content for all the nodes. If the `itemTemplate` property
     * is set, the template content overrides the displayed node text. The property accepts template string
     * [template string](http://ej2.syncfusion.com/documentation/base/template-engine.html)
     * or HTML element ID holding the content.
     * @default null
     */
    itemTemplate?: string;

    /**
     * Allows additional HTML attributes such as title, name, etc., and
     * accepts n number of attributes in a key-value pair format.
     * @default {}
     */
    htmlAttributes?: { [key: string]: string; };

    /**
     * configures visibility mode for component interaction when allowMultiSelection or showCheckBox is enabled
     * * Different modes are:
     * * Box : Selected items will be visualized in chip.
     * * Delimiter : Selected items will be visualized in text content.
     * * Default : On focus in, the component will act in box mode. on blur component will act in delimiter mode.
     */
    mode?: Mode;

    /**
     * Accepts the template design and assigns it to popup list of component
     * when no data is available on the component.
     * @default 'No Records Found'
     */
    noRecordsTemplate?: string;

    /**
     * Specifies a short hint that describes the expected value of the DropDownTree component.
     * @default null
     */
    placeholder?: string;

    /**
     * Specifies the height of the popup list.
     * @default '300px'
     */
    popupHeight?: string | number;

    /**
     * Specifies the width of the popup list. By default, the popup width sets based on the width of
     * the component.
     * @default '100%'
     */
    popupWidth?: string | number;

    /**
     * When set to true, the user interactions on the component are disabled.
     * @default false
     */
    readonly?: boolean;

    /**
     * Allows you to either show or hide the selectAll option on the component.
     * @default false
     */
    showSelectAll?: boolean;

    /**
     * Specifies the selectAllText to be displayed on the component.
     * @default 'Select All'
     */
    selectAllText?: string;

    /**
     * Indicates that the nodes will display CheckBoxes in the DropDownTree.
     * The CheckBox will be displayed next to the expand/collapse icon of the node.
     * @default false
     */
    showCheckBox?: boolean;

    /**
     * Specifies whether to show or hide the clear button.
     * When the clear button is clicked, `value`, `text` properties are reset to null.
     * @default true
     */
    showClearButton?: boolean;

    /**
     * Allows you to either show or hide the DropDown button on the component
     * 
     * @default true
     */
    showDropDownIcon?: boolean;

    /**
     * Specifies a value that indicates whether the nodes are sorted in the ascending or descending order,
     * or are not sorted at all. The available types of sort order are,
     * * `None` - The nodes are not sorted.
     * * `Ascending` - The nodes are sorted in the ascending order.
     * * `Descending` - The nodes are sorted in the ascending order.
     * @default 'None'
     */
    sortOrder?: SortOrder;

    /**
     * Gets or sets the display text of the selected item in the component.
     * @default null
     */
    text?: string;

    /**
     * Configure the TreeView settings.
     * @default {autoCheck: false, loadOnDemand: true}
     */
    treeSettings?: TreeSettingsModel;

    /**
     * Specifies the UnSelectAllText to be displayed on the component.
     * @default 'Unselect All'
     */
    unSelectAllText?: string;

    /**
     * Gets or sets the value of the selected item in the component.
     * @default null
     * @aspType Object
     */
    value?: string[];

    /**
     * Specifies the width of the component. By default, the component width sets based on the width of
     * its parent container. You can also set the width in pixel values.
     * @default '100%'
     */
    width?: string | number;

    /**
     * specifies the z-index value of the component popup element.
     * @default 1000
     */
    zIndex?: number;

    /**
     * Triggers when the data fetch request from the remote server fails.
     * @event
     */
    actionFailure?: EmitType<Object>;

    /**
     * Fires when popup opens before animation.
     * @event
     */
    beforeOpen?: EmitType<DdtBeforeOpenEventArgs>;

    /**
     * Triggers when an item in a popup is selected or when the model value is changed by user.
     * @event
     */
    change?: EmitType<DdtChangeEventArgs>;

    /**
     * Fires when popup close after animation completion.
     * @event
     */
    close?: EmitType<DdtPopupEventArgs>;

    /**
     * Triggers when focus moves out from the component.
     * @event
     */
    blur?: EmitType<Object>;

    /**
     * Triggers when the DropDownTree control is created successfully.
     * @event
     */
    created?: EmitType<Object>;

    /**
     * Triggers when data source is populated in the DropDownTree.
     * @event
     */
    dataBound?: EmitType<DdtDataBoundEventArgs>;

    /**
     * Triggers when the DropDownTree control is destroyed successfully.
     * @event
     */
    destroyed?: EmitType<Object>;

    /**
     * Triggers when the component is focused.
     * @event
     */
    focus?: EmitType<DdtFocusEventArgs>;

    /**
     * Fires when popup opens after animation completion.
     * @event
     */
    open?: EmitType<DdtPopupEventArgs>;

    /**
     * Triggers when an item in the popup is selected by the user either with mouse/tap or with keyboard navigation.
     * @event
     */
    select?: EmitType<DdtSelectEventArgs>;

}