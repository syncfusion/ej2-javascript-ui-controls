import { Component, EmitType, isUndefined, Browser, compile, isNullOrUndefined, SanitizeHtmlHelper, animationMode } from '@syncfusion/ej2-base';import { Property, INotifyPropertyChanged, NotifyPropertyChanges, ChildProperty, Complex } from '@syncfusion/ej2-base';import { Event, EventHandler, KeyboardEvents, KeyboardEventArgs } from '@syncfusion/ej2-base';import { rippleEffect, Effect, Animation, AnimationOptions, RippleOptions, remove } from '@syncfusion/ej2-base';import { Draggable, DragEventArgs, Droppable, DropEventArgs } from '@syncfusion/ej2-base';import { getElement } from '@syncfusion/ej2-base';import { addClass, removeClass, closest, matches, detach, select, selectAll, isVisible, append } from '@syncfusion/ej2-base';import { DataManager, Query } from '@syncfusion/ej2-data';import { isNullOrUndefined as isNOU, Touch, TapEventArgs, getValue, setValue, extend, merge, attributes } from '@syncfusion/ej2-base';import { ListBase, ListBaseOptions, AriaAttributesMapping, FieldsMapping } from '@syncfusion/ej2-lists';import { createCheckBox, rippleMouseHandler } from '@syncfusion/ej2-buttons';import { Input, InputObject } from '@syncfusion/ej2-inputs';import { createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';
import {ExpandOnSettings,SortOrder,FailureEventArgs,DataBoundEventArgs,DataSourceChangedEventArgs,DrawNodeEventArgs,NodeKeyPressEventArgs,NodeCheckEventArgs,NodeClickEventArgs,NodeExpandEventArgs,DragAndDropEventArgs,NodeEditEventArgs,NodeSelectEventArgs} from "./treeview";
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class FieldsSettings
 */
export interface FieldsSettingsModel {

    /**
     * Binds the field settings for child nodes or mapping field for nested nodes objects that contain array of JSON objects.
     */
    child?: string | FieldsSettingsModel;

    /**
     * Specifies the array of JavaScript objects or instance of DataManager to populate the nodes.
     *
     * @default []
     * @aspDatasourceNullIgnore
     * @isGenericType true
     */
    dataSource?: DataManager | { [key: string]: Object }[];

    /**
     * Specifies the mapping field for expand state of the TreeView node.
     */
    expanded?: string;

    /**
     * Specifies the mapping field for hasChildren to check whether a node has child nodes or not.
     */
    hasChildren?: string;

    /**
     * Specifies the mapping field for htmlAttributes to be added to the TreeView node.
     */
    htmlAttributes?: string;

    /**
     * Specifies the mapping field for icon class of each TreeView node that will be added before the text.
     */
    iconCss?: string;

    /**
     * Specifies the ID field mapped in dataSource.
     */
    id?: string;

    /**
     * Specifies the mapping field for image URL of each TreeView node where image will be added before the text.
     */
    imageUrl?: string;

    /**
     * Specifies the field for checked state of the TreeView node.
     */
    isChecked?: string;

    /**
     * Specifies the parent ID field mapped in dataSource.
     */
    parentID?: string;

    /**
     * Defines the external [`Query`](https://ej2.syncfusion.com/documentation/api/data/query/)
     * that will execute along with data processing.
     *
     * @default null
     */
    query?: Query;

    /**
     * Specifies whether the node can be selected by users or not
     * When set to false, the user interaction is prevented for the corresponding node.
     */
    selectable?: string;

    /**
     * Specifies the mapping field for selected state of the TreeView node.
     */
    selected?: string;

    /**
     * Specifies the table name used to fetch data from a specific table in the server.
     */
    tableName?: string;

    /**
     * Specifies the mapping field for text displayed as TreeView node's display text.
     */
    text?: string;

    /**
     * Specifies the mapping field for tooltip that will be displayed as hovering text of the TreeView node.
     */
    tooltip?: string;

    /**
     * Specifies the mapping field for navigateUrl to be added as hyper-link of the TreeView node.
     */
    navigateUrl?: string;

}

/**
 * Interface for a class ActionSettings
 */
export interface ActionSettingsModel {

    /**
     * Specifies the type of animation.
     *
     * @default 'SlideDown'
     */
    effect?: Effect;

    /**
     * Specifies the duration to animate.
     *
     * @default 400
     */
    duration?: number;

    /**
     * Specifies the animation timing function.
     *
     * @default 'linear'
     */
    easing?: string;

}

/**
 * Interface for a class NodeAnimationSettings
 */
export interface NodeAnimationSettingsModel {

    /**
     * Specifies the animation that applies on collapsing the nodes.
     *
     * @default { effect: 'SlideUp', duration: 400, easing: 'linear' }
     */
    collapse?: ActionSettingsModel;

    /**
     * Specifies the animation that applies on expanding the nodes.
     *
     * @default { effect: 'SlideDown', duration: 400, easing: 'linear' }
     */
    expand?: ActionSettingsModel;

}

/**
 * Interface for a class TreeView
 */
export interface TreeViewModel extends ComponentModel{

    /**
     * Indicates whether the TreeView allows drag and drop of nodes. To drag and drop a node in
     * desktop, hold the mouse on the node, drag it to the target node and drop the node by releasing
     * the mouse. For touch devices, drag and drop operation is performed by touch, touch move
     * and touch end. For more information on drag and drop nodes concept, refer to
     * [Drag and Drop](../../treeview/drag-and-drop/).
     *
     * @default false
     */
    allowDragAndDrop?: boolean;

    /**
     * Enables or disables editing of the text in the TreeView node. When `allowEditing` property is set
     * to true, the TreeView allows you to edit the node by double clicking the node or by navigating to
     * the node and pressing **F2** key. For more information on node editing, refer
     * to [Node Editing](../../treeview/node-editing/).
     *
     * @default false
     */
    allowEditing?: boolean;

    /**
     * Enables or disables multi-selection of nodes. To select multiple nodes:
     * * Select the nodes by holding down the **Ctrl** key while clicking on the nodes.
     * * Select consecutive nodes by clicking the first node to select and hold down the **Shift** key
     * and click the last node to select.
     *
     * For more information on multi-selection, refer to
     * [Multi-Selection](../../treeview/multiple-selection/).
     *
     * @default false
     */
    allowMultiSelection?: boolean;

    /**
     * Enables or disables text wrapping when text exceeds the bounds in the TreeView node.
     * When the allowTextWrap property is set to true, the TreeView node text content will wrap to the next line
     * when it exceeds the width of the TreeView node.
     * The TreeView node height will be adjusted automatically based on the TreeView node content.
     *
     * @default false
     */
    allowTextWrap?: boolean;

    /**
     * Specifies the type of animation applied on expanding and collapsing the nodes along with duration.
     *
     * @default {expand: { effect: 'SlideDown', duration: 400, easing: 'linear' },
     * collapse: { effect: 'SlideUp', duration: 400, easing: 'linear' }}
     */
    animation?: NodeAnimationSettingsModel;

    /**
     * The `checkedNodes` property is used to set the nodes that need to be checked.
     * This property returns the checked nodes ID in the TreeView component.
     * The `checkedNodes` property depends upon the value of `showCheckBox` property.
     * For more information on checkedNodes, refer to
     * [checkedNodes](../../treeview/check-box#checked-nodes).
     * ```html
     * <div id="tree"></div>
     * ```
     * ```typescript
     * let treeObj: TreeView = new TreeView({
     * fields: { dataSource: hierarchicalData, id: 'id', text: 'name', child: 'subChild' },
     * showCheckBox: true,
     * checkedNodes: ['01-01','02']
     * });
     * treeObj.appendTo('#tree');
     * ```
     *
     * @default []
     */
    checkedNodes?: string[];

    /**
     * Determines whether the disabled children will be checked or not if their parent is checked.
     *
     * @default true
     */
    checkDisabledChildren?: boolean;

    /**
     * Specifies one or more than one CSS classes to be added with root element of the TreeView to help customize the appearance of the component.
     * ```html
     * <div id="tree"></div>
     * ```
     * ```typescript
     * let treeObj: TreeView = new TreeView({
     * fields: { dataSource: hierarchicalData, id: 'id', text: 'name', child: 'subChild' },
     * cssClass: 'e-custom e-tree'
     * });
     * treeObj.appendTo('#tree');
     * ```
     * ```css
     * .e-custom .e-tree {
     * max-width: 600px;
     * }
     * .e-custom .e-list-item {
     * padding: 10px 0;
     * }
     * ```
     *
     * @default ''
     */
    cssClass?: string;

    /**
     * Specifies a value that indicates whether the TreeView component is disabled or not.
     * When set to true, user interaction will not be occurred in TreeView.
     *
     * @default false
     */
    disabled?: boolean;

    /**
     * Specifies the target in which the draggable element can be moved and dropped.
     * By default, the draggable element movement occurs in the page.
     * ```html
     * <div id="tree"></div>
     * ```
     * ```typescript
     * let treeObj: TreeView = new TreeView({
     * fields: { dataSource: hierarchicalData, id: 'id', text: 'name', child: 'subChild' },
     * dragArea: '.control_wrapper'
     * });
     * treeObj.appendTo('#tree');
     * ```
     * ```css
     * .control_wrapper {
     * width: 500px;
     * margin-left: 100px;
     * }
     * ```
     *
     * @default null
     */
    dragArea?: HTMLElement | string;

    /**
     * Specifies whether to display or remove the untrusted HTML values in the TreeView component.
     * If 'enableHtmlSanitizer' set to true, the component will sanitize any suspected untrusted strings and scripts before rendering them.
     * ```html
     * <div id="tree"></div>
     * ```
     * ```typescript
     * let treeObj: TreeView = new TreeView({
     * fields: { dataSource: hierarchicalData, id: 'id', text: 'name', child: 'subChild' },
     * enableHtmlSanitizer: true
     * });
     * treeObj.appendTo('#tree');
     * ```
     *
     * @default true
     */
    enableHtmlSanitizer?: boolean;

    /**
     * Enables or disables persisting TreeView state between page reloads. If enabled, following APIs will persist.
     * 1. `selectedNodes` - Represents the nodes that are selected in the TreeView component.
     * 2. `checkedNodes`  - Represents the nodes that are checked in the TreeView component.
     * 3. `expandedNodes` - Represents the nodes that are expanded in the TreeView component.
     *
     * @default false
     */
    enablePersistence?: boolean;

    /**
     * Represents the expanded nodes in the TreeView component. We can set the nodes that need to be
     * expanded or get the ID of the nodes that are currently expanded by using this property.
     * ```html
     * <div id='tree'></div>
     * ```
     * ```typescript
     * <script>
     * var treeObj =  new TreeView({
     * fields: { dataSource: hierarchicalData, id: 'id', text: 'name', child: 'subChild' },
     * expandedNodes: ['01','01-01','02']
     * });
     * treeObj.appendTo('#tree');
     * </script>
     * ```
     *
     * @default []
     */
    expandedNodes?: string[];

    /**
     * Specifies the action on which the node expands or collapses.
     * The available actions :
     * `Click` - The expand/collapse operation happens when you single-click on the node in desktop.
     * `DblClick` - The expand/collapse operation happens when you double-click on the node in desktop.
     * `None` - The expand/collapse operation will not happen.
     * In mobile devices, the node expand/collapse action happens on single tap.
     * Here ExpandOn attribute is set to single click property also can use double click and none property.
     * ```html
     * <div id="tree"></div>
     * ```
     * ```typescript
     * let treeObj: TreeView = new TreeView({
     * fields: { dataSource: hierarchicalData, id: 'id', text: 'name', child: 'subChild' },
     * expandOn: 'Click'
     * });
     * treeObj.appendTo('#tree');
     * ```
     *
     * @default 'Auto'
     */
    expandOn?: ExpandOnSettings;

    /**
     * Specifies the data source and mapping fields to render TreeView nodes.
     *
     * @default {id: 'id', text: 'text', dataSource: [], child: 'child', parentID: 'parentID', hasChildren: 'hasChildren',
     *  expanded: 'expanded', htmlAttributes: 'htmlAttributes', iconCss: 'iconCss', imageUrl: 'imageUrl', isChecked: 'isChecked',
     *  query: null, selected: 'selected', tableName: null, tooltip: 'tooltip', navigateUrl: 'navigateUrl'}
     */
    fields?: FieldsSettingsModel;

    /**
     * On enabling this property, the entire row of the TreeView node gets selected by clicking a node.
     * When disabled only the corresponding node's text gets selected.
     * For more information on Fields concept, refer to
     * [Fields](../../treeview/data-binding#local-data).
     *
     * @default true
     */
    fullRowSelect?: boolean;

    /**
     * By default, the load on demand (Lazy load) is set to true. By disabling this property, all the tree nodes are rendered at the
     * beginning itself.
     *
     * @default true
     */
    loadOnDemand?: boolean;

    /**
     * Overrides the global culture and localization value for this component. Default global culture is 'en-US'.
     *
     * @private
     */
    locale?: string;

    /**
     * Specifies a template to render customized content for all the nodes. If the `nodeTemplate` property
     * is set, the template content overrides the displayed node text. The property accepts template string
     * [template string](https://ej2.syncfusion.com/documentation/common/template-engine/)
     * or HTML element ID holding the content. For more information on template concept, refer to
     * [Template](../../treeview/template/).
     *
     * @default null
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    nodeTemplate?: string | Function;

    /**
     * Represents the selected nodes in the TreeView component. We can set the nodes that need to be
     * selected or get the ID of the nodes that are currently selected by using this property.
     * On enabling `allowMultiSelection` property we can select multiple nodes and on disabling
     * it we can select only a single node.
     * For more information on selectedNodes, refer to
     * [selectedNodes](../../treeview/multiple-selection#selected-nodes).
     * ```html
     * <div id="tree"></div>
     * ```
     * ```typescript
     * let treeObj: TreeView = new TreeView({
     * fields: { dataSource: hierarchicalData, id: 'id', text: 'name', child: 'subChild' },
     * allowMultiSelection: true,
     * selectedNodes: ['01','02']
     * });
     * treeObj.appendTo('#tree');
     * ```
     *
     * @default []
     */
    selectedNodes?: string[];

    /**
     * Specifies a value that indicates whether the nodes are sorted in the ascending or descending order,
     * or are not sorted at all. The available types of sort order are,
     * * `None` - The nodes are not sorted.
     * * `Ascending` - The nodes are sorted in the ascending order.
     * * `Descending` - The nodes are sorted in the ascending order.
     *
     * @default 'None'
     */
    sortOrder?: SortOrder;

    /**
     * Indicates that the nodes will display CheckBoxes in the TreeView.
     * The CheckBox will be displayed next to the expand/collapse icon of the node. For more information on CheckBoxes, refer to
     * [CheckBox](../../treeview/check-box/).
     *
     * @default false
     */
    showCheckBox?: boolean;

    /**
     * Specifies whether the item should be checked or unchecked when the node is clicked.
     *
     * @default false
     */
    checkOnClick?: boolean;

    /**
     * Allow us to specify the parent and child nodes to get auto check while we check or uncheck a node.
     *
     * @default true
     */
    autoCheck?: boolean;

    /**
     * If this property is set to true, then the entire TreeView node will be navigate-able instead of text element.
     *
     * @default false
     */
    fullRowNavigable?: boolean;

    /**
     * Event callback that is raised while any TreeView action failed to fetch the desired results.
     *
     * @event actionFailure
     */
    actionFailure?: EmitType<FailureEventArgs>;

    /**
     * Event callback that is raised when the TreeView component is created successfully.
     *
     * @event created
     */
    created?: EmitType<Object>;

    /**
     * Event callback that is raised when data source is populated in the TreeView.
     *
     * @event dataBound
     */
    dataBound?: EmitType<DataBoundEventArgs>;

    /**
     * Event callback that is raised when data source is changed in the TreeView. The data source will be changed after performing some operation like
     * drag and drop, node editing, adding and removing node.
     *
     * @event dataSourceChanged
     */
    dataSourceChanged?: EmitType<DataSourceChangedEventArgs>;

    /**
     * Event callback that is raised before the TreeView node is appended to the TreeView element. It helps to customize specific nodes.
     *
     * @event drawNode
     */
    drawNode?: EmitType<DrawNodeEventArgs>;

    /**
     * Event callback that is raised when the TreeView control is destroyed successfully.
     *
     * @event destroyed
     */
    destroyed?: EmitType<Object>;

    /**
     * Event callback that is raised when key press is successful. It helps to customize the operations at key press.
     *
     * @event keyPress
     */
    keyPress?: EmitType<NodeKeyPressEventArgs>;

    /**
     * Event callback that is raised when the TreeView node is checked/unchecked successfully.
     *
     * @event nodeChecked
     */
    nodeChecked?: EmitType<NodeCheckEventArgs>;

    /**
     * Event callback that is raised before the TreeView node is to be checked/unchecked.
     *
     * @event nodeChecking
     */
    nodeChecking?: EmitType<NodeCheckEventArgs>;

    /**
     * Event callback that is raised when the TreeView node is clicked successfully.
     *
     * @event nodeClicked
     */
    nodeClicked?: EmitType<NodeClickEventArgs>;

    /**
     * Event callback that is raised when the TreeView node collapses successfully.
     *
     * @event nodeCollapsed
     */
    nodeCollapsed?: EmitType<NodeExpandEventArgs>;

    /**
     * Event callback that is raised before the TreeView node collapses.
     *
     * @event nodeCollapsing
     */
    nodeCollapsing?: EmitType<NodeExpandEventArgs>;

    /**
     * Event callback that is raised when the TreeView node is dragged (moved) continuously.
     *
     * @deprecated
     * @event nodeDragging
     */
    nodeDragging?: EmitType<DragAndDropEventArgs>;

    /**
     * Event callback that is raised when the TreeView node drag (move) starts.
     *
     * @event nodeDragStart
     */
    nodeDragStart?: EmitType<DragAndDropEventArgs>;

    /**
     * Event callback that is raised when the TreeView node drag (move) is stopped.
     *
     * @event nodeDragStop
     */
    nodeDragStop?: EmitType<DragAndDropEventArgs>;

    /**
     * Event callback that is raised when the TreeView node is dropped on target element successfully.
     *
     * @event nodeDropped
     */
    nodeDropped?: EmitType<DragAndDropEventArgs>;

    /**
     * Event callback that is raised when the TreeView node is renamed successfully.
     *
     * @event nodeEdited
     */
    nodeEdited?: EmitType<NodeEditEventArgs>;

    /**
     * Event callback that is raised before the TreeView node is renamed.
     *
     * @event nodeEditing
     */
    nodeEditing?: EmitType<NodeEditEventArgs>;

    /**
     * Event callback that is raised when the TreeView node expands successfully.
     *
     * @event nodeExpanded
     */
    nodeExpanded?: EmitType<NodeExpandEventArgs>;

    /**
     * Event callback that is raised before the TreeView node is to be expanded.
     *
     * @event nodeExpanding
     */
    nodeExpanding?: EmitType<NodeExpandEventArgs>;

    /**
     * Event callback that is raised when the TreeView node is selected/unselected successfully.
     *
     * @event nodeSelected
     */
    nodeSelected?: EmitType<NodeSelectEventArgs>;

    /**
     * Event callback that is raised before the TreeView node is selected/unselected.
     *
     * @event nodeSelecting
     */
    nodeSelecting?: EmitType<NodeSelectEventArgs>;

}