import { Component, EmitType, isUndefined, Browser, compile, isNullOrUndefined, BlazorDragEventArgs } from '@syncfusion/ej2-base';
import { Property, INotifyPropertyChanged, NotifyPropertyChanges, ChildProperty, Complex } from '@syncfusion/ej2-base';
import { Event, EventHandler, KeyboardEvents, KeyboardEventArgs } from '@syncfusion/ej2-base';
import { rippleEffect, Effect, Animation, AnimationOptions, RippleOptions } from '@syncfusion/ej2-base';
import { Draggable, DragEventArgs, Droppable, DropEventArgs } from '@syncfusion/ej2-base';
import { updateBlazorTemplate, resetBlazorTemplate , isBlazor, getElement  } from '@syncfusion/ej2-base';
import { addClass, removeClass, closest, matches, detach, select, selectAll, isVisible, createElement, append } from '@syncfusion/ej2-base';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { isNullOrUndefined as isNOU, Touch, TapEventArgs, getValue, setValue, extend, merge, attributes } from '@syncfusion/ej2-base';
import { ListBase, ListBaseOptions, AriaAttributesMapping, FieldsMapping } from '@syncfusion/ej2-lists';
import { createCheckBox, rippleMouseHandler } from '@syncfusion/ej2-buttons';
import { Input, InputObject } from '@syncfusion/ej2-inputs';
import { createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';
import { TreeViewModel, FieldsSettingsModel, NodeAnimationSettingsModel, ActionSettingsModel } from './treeview-model';

const ROOT: string = 'e-treeview';
const CONTROL: string = 'e-control';
const COLLAPSIBLE: string = 'e-icon-collapsible';
const EXPANDABLE: string = 'e-icon-expandable';
const LISTITEM: string = 'e-list-item';
const LISTTEXT: string = 'e-list-text';
const LISTICON: string = 'e-list-icon';
const LISTIMG: string = 'e-list-img';
const LISTURL: string = 'e-list-url';
const PARENTITEM: string = 'e-list-parent';
const HOVER: string = 'e-hover';
const ACTIVE: string = 'e-active';
const LOAD: string = 'e-icons-spinner';
const PROCESS: string = 'e-process';
const ICON: string = 'e-icons';
const TEXTWRAP: string = 'e-text-content';
const INPUT: string = 'e-input';
const INPUTGROUP: string = 'e-input-group';
const TREEINPUT: string = 'e-tree-input';
const EDITING: string = 'e-editing';
const RTL: string = 'e-rtl';
const DRAGITEM: string = 'e-drag-item';
const DROPPABLE: string = 'e-droppable';
const DRAGGING: string = 'e-dragging';
const SIBLING: string = 'e-sibling';
const DROPIN: string = 'e-drop-in';
const DROPNEXT: string = 'e-drop-next';
const DROPOUT: string = 'e-drop-out';
const NODROP: string = 'e-no-drop';
const FULLROWWRAP: string = 'e-fullrow-wrap';
const FULLROW: string = 'e-fullrow';
const SELECTED: string = 'e-selected';
const EXPANDED: string = 'e-expanded';
const NODECOLLAPSED: string = 'e-node-collapsed';
const DISABLE: string = 'e-disable';
const CONTENT: string = 'e-content';
const DOWNTAIL: string = 'e-downtail';
const DROPCOUNT: string = 'e-drop-count';
const CHECK: string = 'e-check';
const INDETERMINATE: string = 'e-stop';
const CHECKBOXWRAP: string = 'e-checkbox-wrapper';
const CHECKBOXFRAME: string = 'e-frame';
const CHECKBOXRIPPLE: string = 'e-ripple-container';
const RIPPLE: string = 'e-ripple';
const RIPPLEELMENT: string = 'e-ripple-element';
const FOCUS: string = 'e-node-focus';
const IMAGE: string = 'e-list-img';
const BIGGER: string = 'e-bigger';
const SMALL: string = 'e-small';
const CHILD: string = 'e-has-child';
const ITEM_ANIMATION_ACTIVE: string = 'e-animation-active';
const DISABLED: string = 'e-disabled';

const treeAriaAttr: TreeAriaAttr = {
    treeRole: 'tree',
    itemRole: 'treeitem',
    listRole: 'group',
    itemText: '',
    wrapperRole: '',
};

interface TreeAriaAttr extends AriaAttributesMapping {
    treeRole: string;
    wrapperRole: string;
}

interface ResultData {
    result: { [key: string]: Object }[];
}

interface EJ2Instance extends HTMLElement {
    ej2_instances: Object[];
}


 /** 
  * Interface for NodeExpand event arguments. 
  */
export interface NodeExpandEventArgs {
    /**
     * If you want to cancel this event then, set cancel as true. Otherwise, false.
     */
    cancel: boolean;
    /**
     * If the event is triggered by interaction, it returns true. Otherwise, it returns false.
     */
    isInteracted: boolean;
    /**
     * Return the expanded/collapsed TreeView node.
     */
    node: HTMLLIElement;
    /**
     * Return the expanded/collapsed node as JSON object from data source.
     * @BlazorType NodeData
     */
    nodeData: { [key: string]: Object };

    event: MouseEvent | KeyboardEventArgs | TapEventArgs;
}

/** 
 * Interface for NodeSelect event arguments.
 */
export interface NodeSelectEventArgs {
    /**
     * Return the name of action like select or un-select.
     */
    action: string;
    /**
     * If you want to cancel this event then, set cancel as true. Otherwise, false.
     */
    cancel: boolean;
    /**
     * If the event is triggered by interaction, it returns true. Otherwise, it returns false.
     */
    isInteracted: boolean;
    /**
     * Return the currently selected TreeView node.
     */
    node: HTMLLIElement;
    /**
     * Return the currently selected node as JSON object from data source.
     * @BlazorType NodeData
     */
    nodeData: { [key: string]: Object };
}

/** 
 * Interface for NodeCheck event arguments.
 */
export interface NodeCheckEventArgs {
    /**
     * Return the name of action like check or un-check.
     */
    action: string;
    /**
     * If you want to cancel this event then, set cancel as true. Otherwise, false.
     */
    cancel: boolean;
    /**
     * If the event is triggered by interaction, it returns true. Otherwise, it returns false.
     */
    isInteracted: boolean;
    /**
     * Return the currently checked TreeView node.
     */
    node: HTMLLIElement;
    /**
     * Return the currently checked node as JSON object from data source.
     * @BlazorType List<NodeData>
     */
    data: { [key: string]: Object }[];
}

/** 
 * Interface for NodeEdit event arguments.
 */
export interface NodeEditEventArgs {
    /**
     * If you want to cancel this event then, set cancel as true. Otherwise, false.
     */
    cancel: boolean;
    /**
     * Return the current TreeView node new text.
     */
    newText: string;
    /**
     * Return the current TreeView node.
     */
    node: HTMLLIElement;
    /**
     * Return the current node as JSON object from data source.
     * @BlazorType NodeData
     */
    nodeData: { [key: string]: Object };
    /**
     * Return the current TreeView node old text.
     */
    oldText: string;
    /**
     * Gets or sets the inner HTML of TreeView node while editing.
     */
    innerHtml: string;
}

/** 
 * Interface for DragAndDrop event arguments.
 */
export interface DragAndDropEventArgs {
    /**
     * If you want to cancel this event then, set cancel as true. Otherwise, false.
     */
    cancel: boolean;
    /**
     * Return the cloned element
     */
    clonedNode: HTMLElement;
    /**
     * Return the actual event.
     */
    event: MouseEvent & TouchEvent;
    /**
     * Return the currently dragged TreeView node.
     */
    draggedNode: HTMLLIElement;
    /**
     * Return the currently dragged node as array of JSON object from data source.
     * @BlazorType NodeData
     */
    draggedNodeData: { [key: string]: Object };
    /**
     * Returns the dragged/dropped element's target index position
     * @isBlazorNullableType true
     */
    dropIndex: number;
    /**
     * Returns the dragged/dropped element's target level
     * @isBlazorNullableType true
     */
    dropLevel: number;
    /**
     * Return the dragged element's source parent
     */
    draggedParentNode: Element;
    /**
     * Return the dragged element's destination parent
     */
    dropTarget: Element;
    /**
     * Return the cloned element's drop status icon while dragging
     */
    dropIndicator: string;
    /**
     * Return the dropped TreeView node.
     */
    droppedNode: HTMLLIElement;
    /**
     * Return the dropped node as array of JSON object from data source.
     * @BlazorType NodeData
     */
    droppedNodeData: { [key: string]: Object };
    /**
     * Return the target element from which drag starts/end.
     */
    target: HTMLElement;
    /**
     * Return boolean value for preventing auto-expanding of parent node.
     */
    preventTargetExpand?: boolean;
}

/** 
 * Interface for DrawNode event arguments.
 */
export interface DrawNodeEventArgs {
    /**
     * Return the current rendering node.
     */
    node: HTMLLIElement;
    /**
     * Return the current rendering node as JSON object.
     * @isGenericType true
     */
    nodeData: { [key: string]: Object };
    /**
     * Return the current rendering node text.
     */
    text: string;
}

/** 
 * Interface for NodeClick event arguments.
 */
export interface NodeClickEventArgs {
    /**
     * Return the actual event.
     */
    event: MouseEvent;
    /**
     * Return the current clicked TreeView node.
     */
    node: HTMLLIElement;
}

/** 
 * Interface for NodeKeyPress event arguments.
 */
export interface NodeKeyPressEventArgs {
    /**
     * If you want to cancel this event then, set cancel as true. Otherwise, false.
     */
    cancel: boolean;
    /**
     * Return the actual event.
     * @blazorType KeyboardEventArgs
     */
    event: KeyboardEventArgs;
    /**
     * Return the current active TreeView node.
     */
    node: HTMLLIElement;
}

/** 
 * Interface for DataBound event arguments.
 */
export interface DataBoundEventArgs {
    /**
     * Return the TreeView data.
     * @isGenericType true
     */
    data: { [key: string]: Object }[];
}

/** 
 * Interface for DataSourceChanged event arguments.
 */
export interface DataSourceChangedEventArgs {
    /**
     * Return the updated TreeView data. The data source will be updated after performing some operation like
     * drag and drop, node editing, adding and removing node. If you want to get updated data source after performing operation like
     * selecting/unSelecting, checking/unChecking, expanding/collapsing the node, then you can use getTreeData method.
     * @isGenericType true
     */
    data: { [key: string]: Object }[];
}

 interface ItemCreatedArgs {
    curData: { [key: string]: Object };
    item: HTMLElement;
    options: ListBaseOptions;
    text: string;
    fields: FieldsMapping;
}

/** 
 * Interface that holds the node details.
 */
export interface NodeData {
    /**
     * Specifies the ID field mapped in dataSource.
     */
    id: string;
    /**
     * Specifies the mapping field for text displayed as TreeView node's display text.
     */
    text: string;
    /**
     * Specifies the parent ID field mapped in dataSource.
     */
    parentID: string;
    /**
     * Specifies the mapping field for selected state of the TreeView node.
     */
    selected: boolean;
    /**
     * Specifies the mapping field for expand state of the TreeView node.
     */
    expanded: boolean;
    /**
     * Specifies the field for checked state of the TreeView node.
     */
    isChecked: string;
    /**
     * Specifies the mapping field for hasChildren to check whether a node has child nodes or not.
     */
    hasChildren: boolean;
}

/** 
 * Interface for Failure event arguments
 */
export interface FailureEventArgs {
    /** Defines the error information. */
    error?: Error;
}

/**
 * Configures the fields to bind to the properties of node in the TreeView component.
 */
export class FieldsSettings extends ChildProperty<FieldsSettings> {

    /**
     * Binds the field settings for child nodes or mapping field for nested nodes objects that contain array of JSON objects.
     */
    @Property('child')
    public child: string | FieldsSettingsModel;

    /**
     * Specifies the array of JavaScript objects or instance of DataManager to populate the nodes.
     * @default []
     * @aspDatasourceNullIgnore
     * @blazorDatasourceNullIgnore
     * @isGenericType true
     */
    @Property([])
    public dataSource: DataManager | { [key: string]: Object }[];

    /**
     * Specifies the mapping field for expand state of the TreeView node.
     */
    @Property('expanded')
    public expanded: string;

    /**
     * Specifies the mapping field for hasChildren to check whether a node has child nodes or not.
     */
    @Property('hasChildren')
    public hasChildren: string;

    /**
     * Specifies the mapping field for htmlAttributes to be added to the TreeView node.
     */
    @Property('htmlAttributes')
    public htmlAttributes: string;

    /**
     * Specifies the mapping field for icon class of each TreeView node that will be added before the text.
     */
    @Property('iconCss')
    public iconCss: string;

    /**
     * Specifies the ID field mapped in dataSource.
     */
    @Property('id')
    public id: string;

    /**
     * Specifies the mapping field for image URL of each TreeView node where image will be added before the text.
     */
    @Property('imageUrl')
    public imageUrl: string;

    /**
     * Specifies the field for checked state of the TreeView node.
     */
    @Property('isChecked')
    public isChecked: string;

    /**
     * Specifies the parent ID field mapped in dataSource.
     */
    @Property('parentID')
    public parentID: string;

    /**
     * Defines the external [`Query`](http://ej2.syncfusion.com/documentation/data/api-query.html)
     * that will execute along with data processing.
     * @default null
     */
    @Property(null)
    public query: Query;

    /**
     * Specifies the mapping field for selected state of the TreeView node.
     */
    @Property('selected')
    public selected: string;

    /**
     * Specifies the table name used to fetch data from a specific table in the server.
     */
    @Property(null)
    public tableName: string;

    /**
     * Specifies the mapping field for text displayed as TreeView node's display text.
     */
    @Property('text')
    public text: string;

    /**
     * Specifies the mapping field for tooltip that will be displayed as hovering text of the TreeView node.
     */
    @Property('tooltip')
    public tooltip: string;

    /**
     * Specifies the mapping field for navigateUrl to be added as hyper-link of the TreeView node.
     */
    @Property('navigateUrl')
    public navigateUrl: string;

}

/**
 * Defines the expand type of the TreeView node.
 */
export type ExpandOnSettings = 'Auto' | 'Click' | 'DblClick' | 'None';

/**
 * Defines the sorting order type for TreeView.
 */
export type SortOrder = 'None' | 'Ascending' | 'Descending';

/**
 * Configures animation settings for the TreeView component.
 */
export class ActionSettings extends ChildProperty<ActionSettings> {
    /**
     * Specifies the type of animation.
     * @default 'SlideDown'
     */
    @Property('SlideDown')
    public effect: Effect;
    /**
     * Specifies the duration to animate.
     * @default 400
     */
    @Property(400)
    public duration: number;
    /**
     * Specifies the animation timing function.
     * @default 'linear'
     */
    @Property('linear')
    public easing: string;
}

/**
 * Configures the animation settings for expanding and collapsing nodes in TreeView.
 */
export class NodeAnimationSettings extends ChildProperty<NodeAnimationSettings> {
    /**
     * Specifies the animation that applies on collapsing the nodes.
     * @default { effect: 'SlideUp', duration: 400, easing: 'linear' }
     */
    @Complex<ActionSettingsModel>({ effect: 'SlideUp', duration: 400, easing: 'linear' }, ActionSettings)
    public collapse: ActionSettingsModel;
    /**
     * Specifies the animation that applies on expanding the nodes.
     * @default { effect: 'SlideDown', duration: 400, easing: 'linear' }
     */
    @Complex<ActionSettingsModel>({ effect: 'SlideDown', duration: 400, easing: 'linear' }, ActionSettings)
    public expand: ActionSettingsModel;
}

/**
 * The TreeView component is used to represent hierarchical data in a tree like structure with advanced
 * functions to perform edit, drag and drop, selection with check-box, and more.
 * ```html
 *  <div id="tree"></div>
 * ```
 * ```typescript
 *  let treeObj: TreeView = new TreeView();
 *  treeObj.appendTo('#tree');
 * ```
 */

@NotifyPropertyChanges
export class TreeView extends Component<HTMLElement> implements INotifyPropertyChanged {

    /* Internal variables */
    private cloneElement: HTMLElement;
    private initialRender: boolean;
    private blazorInitialRender: boolean;
    private treeData: { [key: string]: Object }[];
    private rootData: { [key: string]: Object }[];
    private groupedData: { [key: string]: Object }[][];
    private ulElement: HTMLElement;
    private listBaseOption: ListBaseOptions;
    private dataType: number;
    private rippleFn: Function;
    private rippleIconFn: Function;
    private isNumberTypeId: boolean;
    private expandOnType: string;
    private keyboardModule: KeyboardEvents;
    private liList: HTMLElement[];
    private aniObj: Animation;
    private treeList: string[];
    private isLoaded: boolean;
    private expandArgs: NodeExpandEventArgs;
    private oldText: string;
    private dragObj: Draggable;
    private dropObj: Droppable;
    private dragTarget: Element;
    private dragLi: Element;
    private dragData: { [key: string]: Object };
    private startNode: Element;
    private nodeTemplateFn: Function;
    private currentLoadData: { [key: string]: Object }[];
    private checkActionNodes: { [key: string]: Object }[];
    private touchEditObj: Touch;
    private touchClickObj: Touch;
    private dragStartAction: boolean;
    private touchExpandObj: Touch;
    private inputObj: InputObject;
    private isAnimate: boolean;
    private spinnerElement: HTMLElement;
    private touchClass: string;
    private editData: { [key: string]: Object };
    private editFields: FieldsSettingsModel;
    private refreshData: { [key: string]: Object };
    private refreshFields: FieldsSettingsModel;
    private isRefreshed: boolean = false;
    private keyConfigs: { [key: string]: string };
    private isInitalExpand: boolean;
    private index: number;
    private preventExpand: boolean = false;
    private hasPid: boolean;
    private dragParent: Element;
    private checkedElement: string[] = [];
    private ele: number;
    private disableNode: string[] = [];
    private onLoaded: boolean;
    private parentNodeCheck: string[];
    private parentCheckData :  { [key: string]: Object }[];
    private validArr :  { [key: string]: Object }[] = [];
    private expandChildren: string[] = [];
    private isBlazorPlatform: boolean;
    private isFieldChange: boolean = false;
    private changeDataSource: boolean = false;
    private isBlazorExpandedNodes: string[] = [];
    /**
     * Indicates whether the TreeView allows drag and drop of nodes. To drag and drop a node in
     * desktop, hold the mouse on the node, drag it to the target node and drop the node by releasing
     * the mouse. For touch devices, drag and drop operation is performed by touch, touch move
     * and touch end. For more information on drag and drop nodes concept, refer to
     * [Drag and Drop](../../treeview/drag-and-drop/).
     * @default false
     */
    @Property(false)
    public allowDragAndDrop: boolean;

    /**
     * Enables or disables editing of the text in the TreeView node. When `allowEditing` property is set
     * to true, the TreeView allows you to edit the node by double clicking the node or by navigating to
     * the node and pressing **F2** key. For more information on node editing, refer
     * to [Node Editing](../../treeview/node-editing/).
     * @default false
     */
    @Property(false)
    public allowEditing: boolean;

    /**
     * Enables or disables multi-selection of nodes. To select multiple nodes:
     * * Select the nodes by holding down the CTRL key while clicking on the nodes.
     * * Select consecutive nodes by clicking the first node to select and hold down the **SHIFT** key
     * and click the last node to select.
     *
     * For more information on multi-selection, refer to
     * [Multi-Selection](../../treeview/multiple-selection/).
     * @default false
     */
    @Property(false)
    public allowMultiSelection: boolean;

    /**
     * Specifies the type of animation applied on expanding and collapsing the nodes along with duration.
     * @default {expand: { effect: 'SlideDown', duration: 400, easing: 'linear' },
     * collapse: { effect: 'SlideUp', duration: 400, easing: 'linear' }}
     */
    @Complex<NodeAnimationSettingsModel>({}, NodeAnimationSettings)
    public animation: NodeAnimationSettingsModel;

    /**
     * The `checkedNodes` property is used to set the nodes that need to be checked or
     * get the ID of nodes that are currently checked in the TreeView component.
     * The `checkedNodes` property depends upon the value of `showCheckBox` property.
     * For more information on checkedNodes, refer to
     * [checkedNodes](../../treeview/check-box#checked-nodes).
     * @default []
     */
    @Property()
    public checkedNodes: string[];

    /**
     * Specifies the CSS classes to be added with root element of the TreeView to help customize the appearance of the component.
     * @default ''
     */
    @Property('')
    public cssClass: string;

    /**
     * Specifies a value that indicates whether the TreeView component is disabled or not. 
     * When set to true, user interaction will not be occurred in TreeView. 
     * @default false
     */
    @Property(false)
    public disabled: boolean;

    /**
     * Defines the area in which the draggable element movement will be occurring. Outside that area will be restricted
     * for the draggable element movement. By default, the draggable element movement occurs in the entire page. 
     * @default null
     */
    @Property(null)
    public dragArea: HTMLElement | string;

    /**
     * Defines whether to allow the cross-scripting site or not.
     * @default false
     */
    @Property(false)
    public enableHtmlSanitizer: boolean;

    /**
     * Enables or disables persisting TreeView state between page reloads. If enabled, following APIs will persist.
     * 1. `selectedNodes` - Represents the nodes that are selected in the TreeView component.
     * 2. `checkedNodes`  - Represents the nodes that are checked in the TreeView component.
     * 3. `expandedNodes` - Represents the nodes that are expanded in the TreeView component.
     * @default false
     */
    @Property(false)
    public enablePersistence: boolean;

    /**
     * Represents the expanded nodes in the TreeView component. We can set the nodes that need to be
     * expanded or get the ID of the nodes that are currently expanded by using this property.
     * @default []
     */
    @Property()
    public expandedNodes: string[];

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
    @Property('Auto')
    public expandOn: ExpandOnSettings;

    /**
     * Specifies the data source and mapping fields to render TreeView nodes.
     * @default {id: 'id', text: 'text', dataSource: [], child: 'child', parentID: 'parentID', hasChildren: 'hasChildren',
     *  expanded: 'expanded', htmlAttributes: 'htmlAttributes', iconCss: 'iconCss', imageUrl: 'imageUrl', isChecked: 'isChecked',
     *  query: null, selected: 'selected', tableName: null, tooltip: 'tooltip', navigateUrl: 'navigateUrl'}
     */
    @Complex<FieldsSettingsModel>({}, FieldsSettings)
    public fields: FieldsSettingsModel;

    /**
     * On enabling this property, the entire row of the TreeView node gets selected by clicking a node.
     * When disabled only the corresponding node's text gets selected.
     * For more information on Fields concept, refer to
     * [Fields](../../treeview/data-binding#local-data).
     * @default true
     */
    @Property(true)
    public fullRowSelect: boolean;

    /**
     * By default, the load on demand (Lazy load) is set to true. By disabling this property, all the tree nodes are rendered at the
     * beginning itself.
     * @default true
     */
    @Property(true)
    public loadOnDemand: boolean;

    /**
     * Overrides the global culture and localization value for this component. Default global culture is 'en-US'.
     * @private
     */
    @Property()
    public locale: string;

    /**
     * Specifies a template to render customized content for all the nodes. If the `nodeTemplate` property
     * is set, the template content overrides the displayed node text. The property accepts template string
     * [template string](http://ej2.syncfusion.com/documentation/base/template-engine.html)
     * or HTML element ID holding the content. For more information on template concept, refer to
     * [Template](../../treeview/template/).
     * @default null
     */
    @Property()
    public nodeTemplate: string;

    /**
     * Represents the selected nodes in the TreeView component. We can set the nodes that need to be
     * selected or get the ID of the nodes that are currently selected by using this property.
     * On enabling `allowMultiSelection` property we can select multiple nodes and on disabling
     * it we can select only a single node.
     * For more information on selectedNodes, refer to
     * [selectedNodes](../../treeview/multiple-selection#selected-nodes).
     * @default []
     */
    @Property()
    public selectedNodes: string[];

    /**
     * Specifies a value that indicates whether the nodes are sorted in the ascending or descending order,
     * or are not sorted at all. The available types of sort order are,
     * * `None` - The nodes are not sorted.
     * * `Ascending` - The nodes are sorted in the ascending order.
     * * `Descending` - The nodes are sorted in the ascending order.
     * @default 'None'
     */
    @Property('None')
    public sortOrder: SortOrder;

    /**
     * Indicates that the nodes will display CheckBoxes in the TreeView.
     * The CheckBox will be displayed next to the expand/collapse icon of the node. For more information on CheckBoxes, refer to
     * [CheckBox](../../treeview/check-box/).
     * @default false
     */
    @Property(false)
    public showCheckBox: boolean;

    /**
     * Allow us to specify the parent and child nodes to get auto check while we check or uncheck a node.
     * @default true
     */
    @Property(true)
    public autoCheck: boolean;

    /**
     * If this property is set to true, then the entire TreeView node will be navigate-able instead of text element.
     * @default false
     */
    @Property(false)
    public fullRowNavigable: boolean;

    /** 
     * Triggers when any TreeView action failed to fetch the desired results. 
     * @event 
     * @blazorProperty 'OnActionFailure'
     */
    @Event()
    public actionFailure: EmitType<FailureEventArgs>;

    /**
     * Triggers when the TreeView control is created successfully.
     * @event
     * @blazorProperty 'Created'
     */
    @Event()
    public created: EmitType<Object>;

    /**
     * Triggers when data source is populated in the TreeView.
     * @event
     * @blazorProperty 'DataBound'
     */
    @Event()
    public dataBound: EmitType<DataBoundEventArgs>;

    /**
     * Triggers when data source is changed in the TreeView. The data source will be changed after performing some operation like
     * drag and drop, node editing, adding and removing node.
     * @event
     * @blazorProperty 'DataSourceChanged'
     */
    @Event()
    public dataSourceChanged: EmitType<DataSourceChangedEventArgs>;

    /**
     * Triggers before the TreeView node is appended to the TreeView element. It helps to customize specific nodes.
     * @event
     * @blazorProperty 'OnDrawNode'
     */
    @Event()
    public drawNode: EmitType<DrawNodeEventArgs>;

    /**
     * Triggers when the TreeView control is destroyed successfully.
     * @event
     * @blazorProperty 'Destroyed'
     */
    @Event()
    public destroyed: EmitType<Object>;

    /**
     * Triggers when key press is successful. It helps to customize the operations at key press.
     * @event
     * @blazorProperty 'OnKeyPress'
     */
    @Event()
    public keyPress: EmitType<NodeKeyPressEventArgs>;

    /**
     * Triggers when the TreeView node is checked/unchecked successfully.
     * @event
     * @blazorProperty 'NodeChecked'
     */
    @Event()
    public nodeChecked: EmitType<NodeCheckEventArgs>;

    /**
     * Triggers before the TreeView node is to be checked/unchecked.
     * @event
     * @blazorProperty 'NodeChecking'
     */
    @Event()
    public nodeChecking: EmitType<NodeCheckEventArgs>;

    /**
     * Triggers when the TreeView node is clicked successfully.
     * @event
     * @blazorProperty 'NodeClicked'
     */
    @Event()
    public nodeClicked: EmitType<NodeClickEventArgs>;

    /**
     * Triggers when the TreeView node collapses successfully.
     * @event
     * @blazorProperty 'NodeCollapsed'
     */
    @Event()
    public nodeCollapsed: EmitType<NodeExpandEventArgs>;

    /**
     * Triggers before the TreeView node collapses.
     * @event
     * @blazorProperty 'NodeCollapsing'
     */
    @Event()
    public nodeCollapsing: EmitType<NodeExpandEventArgs>;

    /**
     * Triggers when the TreeView node is dragged (moved) continuously.
     * @deprecated
     * @event
     * @blazorProperty 'NodeDragging'
     */
    @Event()
    public nodeDragging: EmitType<DragAndDropEventArgs>;
    /**
     * Triggers when the TreeView node drag (move) starts.
     * @event
     * @blazorProperty 'OnNodeDragStart'
     */
    @Event()
    public nodeDragStart: EmitType<DragAndDropEventArgs>;
    /**
     * Triggers when the TreeView node drag (move) is stopped.
     * @event
     * @blazorProperty 'OnNodeDragged'
     */
    @Event()
    public nodeDragStop: EmitType<DragAndDropEventArgs>;
    /**
     * Triggers when the TreeView node is dropped on target element successfully.
     * @event
     * @blazorProperty 'NodeDropped'
     */
    @Event()
    public nodeDropped: EmitType<DragAndDropEventArgs>;

    /**
     * Triggers when the TreeView node is renamed successfully.
     * @event
     * @blazorProperty 'NodeEdited'
     */
    @Event()
    public nodeEdited: EmitType<NodeEditEventArgs>;

    /**
     * Triggers before the TreeView node is renamed.
     * @event
     * @blazorProperty 'NodeEditing'
     */
    @Event()
    public nodeEditing: EmitType<NodeEditEventArgs>;

    /**
     * Triggers when the TreeView node expands successfully.
     * @event
     * @blazorProperty 'NodeExpanded'
     */
    @Event()
    public nodeExpanded: EmitType<NodeExpandEventArgs>;

    /**
     * Triggers before the TreeView node is to be expanded.
     * @event
     * @blazorProperty 'NodeExpanding'
     */
    @Event()
    public nodeExpanding: EmitType<NodeExpandEventArgs>;

    /**
     * Triggers when the TreeView node is selected/unselected successfully.
     * @event
     * @blazorProperty 'NodeSelected'
     */
    @Event()
    public nodeSelected: EmitType<NodeSelectEventArgs>;

    /**
     * Triggers before the TreeView node is selected/unselected.
     * @event
     * @blazorProperty 'NodeSelecting'
     */
    @Event()
    public nodeSelecting: EmitType<NodeSelectEventArgs>;

    constructor(options?: TreeViewModel, element?: string | HTMLElement) {
        super(options, <HTMLElement | string>element);
    }

    /**
     * Get component name.
     * @returns string
     * @private
     */
    public getModuleName(): string {
        return 'treeview';
    }

    /**
     * Initialize the event handler
     */
    protected preRender(): void {
        this.isBlazorPlatform = (isBlazor() && this.isServerRendered);
        this.checkActionNodes = [];
        this.parentNodeCheck = [];
        this.dragStartAction = false;
        this.isAnimate = false;
        this.keyConfigs = {
            escape: 'escape',
            end: 'end',
            enter: 'enter',
            f2: 'f2',
            home: 'home',
            moveDown: 'downarrow',
            moveLeft: 'leftarrow',
            moveRight: 'rightarrow',
            moveUp: 'uparrow',
            ctrlDown: 'ctrl+downarrow',
            ctrlUp: 'ctrl+uparrow',
            ctrlEnter: 'ctrl+enter',
            ctrlHome: 'ctrl+home',
            ctrlEnd: 'ctrl+end',
            ctrlA: 'ctrl+A',
            shiftDown: 'shift+downarrow',
            shiftUp: 'shift+uparrow',
            shiftEnter: 'shift+enter',
            shiftHome: 'shift+home',
            shiftEnd: 'shift+end',
            csDown: 'ctrl+shift+downarrow',
            csUp: 'ctrl+shift+uparrow',
            csEnter: 'ctrl+shift+enter',
            csHome: 'ctrl+shift+home',
            csEnd: 'ctrl+shift+end',
            space: 'space',
        };
        this.listBaseOption = {
            expandCollapse: true,
            showIcon: true,
            expandIconClass: EXPANDABLE,
            ariaAttributes: treeAriaAttr,
            expandIconPosition: 'Left',
            itemCreated: (e: ItemCreatedArgs) => {
                this.beforeNodeCreate(e);
            },
            enableHtmlSanitizer: this.enableHtmlSanitizer,
            itemNavigable: this.fullRowNavigable,
        };
        this.updateListProp(this.fields);
        this.aniObj = new Animation({});
        this.treeList = [];
        this.isLoaded = false;
        this.isInitalExpand = false;
        this.expandChildren = [];
        this.index = 0;
        this.setTouchClass();
        if (isNOU(this.selectedNodes)) {
            this.setProperties({ selectedNodes: [] }, true);
        }
        if (isNOU(this.checkedNodes)) {
            this.setProperties({ checkedNodes: [] }, true);
        }
        if (isNOU(this.expandedNodes)) {
            this.setProperties({ expandedNodes: [] }, true);
        } else {
            this.isInitalExpand = true;
        }
    }

    /**
     * Get the properties to be maintained in the persisted state.
     * @returns string
     * @hidden
     */
    public getPersistData(): string {
        let keyEntity: string[] = ['selectedNodes', 'checkedNodes', 'expandedNodes'];
        return this.addOnPersist(keyEntity);
    }

    /**
     * To Initialize the control rendering
     * @private
     */
    protected render(): void {
        this.initialRender = true;
        this.blazorInitialRender = false;
        this.initialize();
        this.setDataBinding(false);
        this.setDisabledMode();
        this.setExpandOnType();
        if (!this.disabled) {
            this.setRipple();
        }
        this.wireEditingEvents(this.allowEditing);
        this.setDragAndDrop(this.allowDragAndDrop);
        if (!this.disabled) {
            this.wireEvents();
        }
        if (!this.isBlazorPlatform) {
            this.initialRender = false;
        }
        this.renderComplete();
    }

    private initialize(): void {
        if (!this.isBlazorPlatform) {
            this.element.setAttribute('role', 'tree');
            this.element.setAttribute('tabindex', '0');
            this.element.setAttribute('aria-activedescendant', this.element.id + '_active');
            this.setCssClass(null, this.cssClass);
            this.setEnableRtl();
            this.setFullRow(this.fullRowSelect);
        }
        this.nodeTemplateFn = this.templateComplier(this.nodeTemplate);
    }
    private setDisabledMode(): void {
        if (this.disabled) {
            this.element.classList.add(DISABLED);
        } else {
            this.element.classList.remove(DISABLED);
        }
    }
    private setEnableRtl(): void {
        this.enableRtl ? addClass([this.element], RTL) : removeClass([this.element], RTL);
    }

    private setRipple(): void {
        let tempStr: string = '.' + FULLROW + ',.' + TEXTWRAP;
        let rippleModel: RippleOptions = {
            selector: tempStr,
            ignore: '.' + TEXTWRAP + ' > .' + ICON + ',.' + INPUTGROUP + ',.' + INPUT + ', .' + CHECKBOXWRAP
        };
        this.rippleFn = rippleEffect(this.element, rippleModel);
        let iconModel: RippleOptions = {
            selector:  '.' + TEXTWRAP + ' > .' + ICON,
            isCenterRipple: true,
        };
        this.rippleIconFn = rippleEffect(this.element, iconModel);
    }

    private setFullRow(isEnabled: boolean): void {
        isEnabled ? addClass([this.element], FULLROWWRAP) : removeClass([this.element], FULLROWWRAP);
    }

    private setMultiSelect(isEnabled: boolean): void {
        let firstUl: Element = select('.' + PARENTITEM, this.element);
        if (isEnabled) {
            firstUl.setAttribute('aria-multiselectable', 'true');
        } else {
            firstUl.removeAttribute('aria-multiselectable');
        }
    }

    private templateComplier(template: string): Function {
        if (template) {
            let e: Object;
            try {
                if (document.querySelectorAll(template).length) {
                    return compile(document.querySelector(template).innerHTML.trim());
                }
            } catch (e) {
                return compile(template);
            }
        }
        return undefined;
    }

    private setDataBinding(changeDataSource: boolean): void {
        this.treeList.push('false');
        if (this.fields.dataSource instanceof DataManager) {
            if ((this.fields.dataSource as DataManager).ready) {
                (this.fields.dataSource as DataManager).ready.then((e: Object) => {
                    if (this.fields.dataSource instanceof DataManager && this.fields.dataSource.dataSource.offline) {
                        this.treeList.pop();
                        this.treeData = (e as ResultData).result;
                        this.isNumberTypeId = this.getType();
                        this.setRootData();
                        this.renderItems(true);
                        if (this.treeList.length === 0 && !this.isLoaded) {
                            this.finalize();
                        }
                    }
                }).catch((e: Object) => {
                    this.trigger('actionFailure', { error: e });
                });
            } else {
                (this.fields.dataSource as DataManager).executeQuery(this.getQuery(this.fields)).then((e: Object) => {
                    this.treeList.pop();
                    this.treeData = (e as ResultData).result;
                    this.isNumberTypeId = this.getType();
                    this.setRootData();
                    if (changeDataSource) {
                        this.changeDataSource = true;
                    }
                    this.renderItems(true);
                    this.changeDataSource = false;
                    if (this.treeList.length === 0 && !this.isLoaded) {
                            this.finalize();
                    }
                }).catch((e: Object) => {
                    this.trigger('actionFailure', { error: e });
                });
            }
        } else {
            this.treeList.pop();
            if (isNOU(this.fields.dataSource)) {
                this.rootData = this.treeData = [];
            } else {
                this.treeData = <{ [key: string]: Object }[]>JSON.parse(JSON.stringify(this.fields.dataSource));
                this.setRootData();
            }
            this.isNumberTypeId = this.getType();
            this.renderItems(false);
        }
        if (this.treeList.length === 0 && !this.isLoaded) {
            this.finalize();
        }
    }

     private getQuery(mapper: FieldsSettingsModel, value: string = null): Query {
        let columns: string[] = [];
        let query: Query;
        if (!mapper.query) {
            query = new Query();
            let prop: FieldsSettingsModel = this.getActualProperties(mapper);
            for (let col of Object.keys(prop)) {
                if (col !== 'dataSource' && col !== 'tableName' && col !== 'child' && !!(mapper as { [key: string]: Object })[col]
                    && col !== 'url' && columns.indexOf((mapper as { [key: string]: string })[col]) === -1) {
                    columns.push((mapper as { [key: string]: string })[col]);
                }
            }
            query.select(columns);
            if (prop.hasOwnProperty('tableName')) {
                query.from(mapper.tableName);
            }
        } else {
            query = mapper.query.clone();
        }
        ListBase.addSorting(this.sortOrder, mapper.text, query);
        if (!isNOU(value) && !isNOU(mapper.parentID)) {
            query.where(mapper.parentID, 'equal', (this.isNumberTypeId ? parseFloat(value) : value));
        }
        return query;
    }

    private getType(): boolean {
        return this.treeData[0] ? ((typeof getValue(this.fields.id, this.treeData[0]) === 'number') ? true : false) : false;
    }

    private setRootData(): void {
        this.dataType = this.getDataType(this.treeData, this.fields);
        if (this.dataType === 1) {
            this.groupedData = this.getGroupedData(this.treeData, this.fields.parentID);
            let rootItems: { [key: string]: Object }[] = this.getChildNodes(this.treeData, undefined, true);
            if (isNOU(rootItems)) {
                this.rootData = [];
            } else {
                this.rootData = rootItems;
            }
        } else {
            this.rootData = this.treeData;
        }
    }

    private renderItems(isSorted: boolean): void {
        // tslint:disable
        if (!this.isBlazorPlatform || (this.isBlazorPlatform && this.fields.dataSource instanceof DataManager && ((this.fields.dataSource as any).adaptorName !== 'BlazorAdaptor')) || this.changeDataSource) {
            this.listBaseOption.ariaAttributes.level = 1;
            let sortedData : { [key: string]: Object }[] = this.getSortedData(this.rootData);
            this.ulElement = ListBase.createList(this.createElement, isSorted ? this.rootData : sortedData, this.listBaseOption);
            this.element.appendChild(this.ulElement);
            let rootNodes: NodeListOf<Element> = this.ulElement.querySelectorAll('.e-list-item');
            if (this.loadOnDemand === false) {
                let i: number = 0;
                while (i < rootNodes.length) {
                    this.renderChildNodes(rootNodes[i], true, null, true);
                    i++;
                }
            }
            let parentEle = selectAll('.' + PARENTITEM, this.element);
            if ((parentEle.length === 1 && (rootNodes && rootNodes.length !== 0)) || this.loadOnDemand) {
                this.finalizeNode(this.element);
            }
        }
        this.updateTemplateForBlazor();
        this.parentNodeCheck = [];
        this.parentCheckData = [];
        this.updateCheckedStateFromDS();
        if (this.autoCheck && this.showCheckBox && !this.isLoaded) {
            this.updateParentCheckState();
        }
    }

    private updateTemplateForBlazor(): void {
        if (this.nodeTemplate && this.isBlazorPlatform && !this.isStringTemplate) {
            this.updateBlazorTemplate();
        }
    }
    /**
     * Update the checkedNodes from datasource at initial rendering
     */
    private updateCheckedStateFromDS(id?: string): void {
        if (this.treeData && this.showCheckBox) {
            if (this.dataType === 1) {
                let mapper: FieldsSettingsModel = this.fields;
                let resultData: { [key: string]: Object }[] = <{ [key: string]: Object }[]>new DataManager(this.treeData).executeLocal(
                    new Query().where(mapper.isChecked, 'equal', true, false));
                for (let i: number = 0; i < resultData.length; i++) {
                    let resultId: string = resultData[i][this.fields.id] ? resultData[i][this.fields.id].toString() : null;
                    let resultPId: string = resultData[i][this.fields.parentID] ? resultData[i][this.fields.parentID].toString() : null;
                    if (this.checkedNodes.indexOf(resultId) === -1 && !(this.isLoaded)) {
                        this.checkedNodes.push(resultId);
                    }

                    if (resultData[i][this.fields.hasChildren]) {
                        let id: number = <number>resultData[i][this.fields.id];
                        let childData: { [key: string]: Object }[] = <{ [key: string]: Object }[]>new DataManager(this.treeData).
                            executeLocal(new Query().where(mapper.parentID, 'equal', id, false));
                        for (let child: number = 0; child < childData.length; child++) {
                            let childId: string = childData[child][this.fields.id] ? childData[child][this.fields.id].toString() : null;
                            if (this.checkedNodes.indexOf(childId) === -1 && this.autoCheck) {
                                this.checkedNodes.push(childId);
                            }
                        }
                    }
                }
                for (let i: number = 0; i < this.checkedNodes.length; i++) {
                    let mapper: FieldsSettingsModel = this.fields;
                    let checkState: { [key: string]: Object }[] = <{ [key: string]: Object }[]>new DataManager(this.treeData).
                        executeLocal(new Query().where(mapper.id, 'equal', this.checkedNodes[i], true));
                    if (checkState[0] && this.autoCheck) {
                        this.getCheckedNodeDetails(mapper, checkState);
                        this.checkIndeterminateState(checkState[0]);
                    }
                    let checkedData: { [key: string]: Object }[] = <{ [key: string]: Object }[]>new DataManager(this.treeData).
                        executeLocal(new Query().where(mapper.parentID, 'equal', this.checkedNodes[i], true));
                    for (let index: number = 0; index < checkedData.length; index++) {
                        let checkedId: string = checkedData[index][this.fields.id] ? checkedData[index][this.fields.id].toString() : null;
                        if (this.checkedNodes.indexOf(checkedId) === -1 && this.autoCheck) {
                            this.checkedNodes.push(checkedId);
                        }
                    }
                }
            } else if (this.dataType === 2 || (this.fields.dataSource instanceof DataManager &&
                this.fields.dataSource.dataSource.offline)) {
                for (let index: number = 0; index < this.treeData.length; index++) {
                    let fieldId: string = this.treeData[index][this.fields.id] ? this.treeData[index][this.fields.id].toString() : '';
                    if (this.treeData[index][this.fields.isChecked] && !(this.isLoaded) && this.checkedNodes.indexOf(fieldId) === -1) {
                        this.checkedNodes.push(fieldId);
                    }
                    let childItems: { [key: string]: Object }[] = getValue(this.fields.child.toString(), this.treeData[index]);
                    if (childItems) {
                        this.updateChildCheckState(childItems, this.treeData[index]);
                    }
                }
            }
        }
    }
    /**
     * To check whether the list data has sub child and to change the parent check state accordingly
     */
    private getCheckedNodeDetails(mapper: FieldsSettingsModel, checkNodes: { [key: string]: Object }[]): void {
        let id: string = checkNodes[0][this.fields.parentID] ? checkNodes[0][this.fields.parentID].toString() : null;
        let count: number = 0;
        let element: Element = this.element.querySelector('[data-uid="' + checkNodes[0][this.fields.id] + '"]');
        let parentEle: Element = this.element.querySelector('[data-uid="' + checkNodes[0][this.fields.parentID] + '"]');
        if (!element && !parentEle) {
            let len: number = this.parentNodeCheck.length;
            if (this.parentNodeCheck.indexOf(id) === -1) {
                this.parentNodeCheck.push(id);
            }
            let childNodes: { [key: string]: Object }[] = this.getChildNodes(this.treeData, id);
            for (let i: number = 0; i < childNodes.length; i++) {
                let childId: string = childNodes[i][this.fields.id] ? childNodes[i][this.fields.id].toString() : null;
                if (this.checkedNodes.indexOf(childId) !== -1) {
                    count++;
                }
                if (count === childNodes.length && this.checkedNodes.indexOf(id) === -1) {
                    this.checkedNodes.push(id);
                }
            }
            let preElement: { [key: string]: Object }[] = <{ [key: string]: Object }[]>new DataManager(this.treeData).
                executeLocal(new Query().where(mapper.id, 'equal', id, true));
            this.getCheckedNodeDetails(mapper, preElement);
        } else if (parentEle) {
            let check: Element = select('.' + CHECK, parentEle);
            if (!check) {
                this.changeState(parentEle, 'indeterminate', null, true, true);
            }
        }
    }
    /**
     * Update the checkedNodes and parent state when all the child Nodes are in checkedstate at initial rendering
     */
    private updateParentCheckState(): void {
        let indeterminate: Element[] = selectAll('.' + INDETERMINATE, this.element);
        let childCheckedElement: { [key: string]: Object }[];
        for (let i: number = 0; i < indeterminate.length; i++) {
            let node: Element = closest(indeterminate[i], '.' + LISTITEM);
            let nodeId: string =  node.getAttribute('data-uid').toString();
            if (this.dataType === 1) {
                childCheckedElement = <{ [key: string]: Object }[]>new DataManager(this.treeData).
                executeLocal(new Query().where(this.fields.parentID, 'equal', nodeId, true));
            } else {
             childCheckedElement = this.getChildNodes(this.treeData, nodeId);
            }
            let count: number = 0;
            if (childCheckedElement) {
                for (let j: number = 0; j < childCheckedElement.length; j++) {
                    let childId: string = childCheckedElement[j][this.fields.id].toString();
                    if (this.checkedNodes.indexOf(childId) !== -1) {
                        count++;
                    }
                }
                if (count === childCheckedElement.length) {
                    let nodeCheck: string = node.getAttribute('data-uid');
                    if (this.checkedNodes.indexOf(nodeCheck) === -1) {
                        this.checkedNodes.push(nodeCheck);
                    }
                    this.changeState(node, 'check', null, true, true);
                } else if (count === 0 && this.checkedNodes.length === 0) {
                    this.changeState(node, 'uncheck', null, true, true);
                }
            }
        }
    }
    /**
     * Change the parent to indeterminate state whenever the child is in checked state which is not rendered in DOM
     */
    private checkIndeterminateState(data: { [key: string]: Object }): void {
        let element: Element;
        if (this.dataType === 1) {
            element = this.element.querySelector('[data-uid="' + data[this.fields.parentID] + '"]');
        } else {
            element = this.element.querySelector('[data-uid="' + data[this.fields.id] + '"]');
        }
        if (element) {
            let ariaChecked: string = element.querySelector('.' + CHECKBOXWRAP).getAttribute('aria-checked');
            if (ariaChecked !== 'true') {
                this.changeState(element, 'indeterminate', null, true, true);
            }
        } else if (this.dataType === 2) {
            let len: number =  this.parentNodeCheck.length;
            if (this.parentNodeCheck.indexOf(data[this.fields.id].toString()) === -1 ) {
                this.parentNodeCheck.push(data[this.fields.id].toString());
            }
        }
    }
    /**
     * Update the checkedNodes for child and subchild from datasource (hierarchical datasource) at initial rendering
     */
    private updateChildCheckState(childItems: { [key: string]: Object }[], treeData: { [key: string]: Object }): void {
        let count: number = 0;
        let checkedParent: string = treeData[this.fields.id] ? treeData[this.fields.id].toString() : '';
        for (let index: number = 0; index < childItems.length; index++) {
            let checkedChild: string = childItems[index][this.fields.id] ? childItems[index][this.fields.id].toString() : '';
            if (childItems[index][this.fields.isChecked] && !(this.isLoaded) && this.checkedNodes.indexOf(checkedChild) === -1) {
                this.checkedNodes.push(checkedChild);
            }
            if (this.checkedNodes.indexOf(checkedParent) !== -1 && this.checkedNodes.indexOf(checkedChild) === -1 && this.autoCheck) {
                this.checkedNodes.push(checkedChild);
            }
            if (this.checkedNodes.indexOf(checkedChild) !== -1 && this.autoCheck) {
                count++;
            }
            let subChildItems: { [key: string]: Object }[] = getValue(this.fields.child.toString(), childItems[index]);
            if (subChildItems) {
                this.parentCheckData.push(treeData);
                this.updateChildCheckState(subChildItems, childItems[index]);
            }
            if (count === childItems.length && this.autoCheck && this.checkedNodes.indexOf(checkedParent) === -1) {
                this.checkedNodes.push(checkedParent);
            }
        }
        if (count !== 0 && this.autoCheck) {
            this.checkIndeterminateState(treeData);
            for (let len: number = 0; len < this.parentCheckData.length; len++) {
                if ((treeData !== this.parentCheckData[len]) && (this.parentCheckData[len])) {
                    this.checkIndeterminateState(this.parentCheckData[len]);
                }
            }
        }
        this.parentCheckData = [];
    }

    private beforeNodeCreate(e: ItemCreatedArgs): void {
        if (this.showCheckBox) {
            let checkboxEle: Element = createCheckBox(this.createElement, true, { cssClass: this.touchClass });
            checkboxEle.setAttribute('role', 'checkbox');
            let icon: Element = select('div.' + ICON, e.item);
            let id: string = e.item.getAttribute('data-uid');
            e.item.childNodes[0].insertBefore(checkboxEle, e.item.childNodes[0].childNodes[isNOU(icon) ? 0 : 1]);
            let checkValue: Object = getValue(e.fields.isChecked, e.curData);
            if (this.checkedNodes.indexOf(id) > -1) {
                select('.' + CHECKBOXFRAME, checkboxEle).classList.add(CHECK);
                checkboxEle.setAttribute('aria-checked', 'true');
                this.addCheck(e.item);
            } else if (!isNOU(checkValue) && checkValue.toString() === 'true') {
                select('.' + CHECKBOXFRAME, checkboxEle).classList.add(CHECK);
                checkboxEle.setAttribute('aria-checked', 'true');
                this.addCheck(e.item);
            } else {
                checkboxEle.setAttribute('aria-checked', 'false');
            }
            let frame: Element = select('.' + CHECKBOXFRAME, checkboxEle);
            EventHandler.add(frame, 'mousedown', this.frameMouseHandler, this);
            EventHandler.add(frame, 'mouseup', this.frameMouseHandler, this);
        }
        if (this.fullRowSelect) {
            this.createFullRow(e.item);
        }
        if (this.allowMultiSelection && !e.item.classList.contains(SELECTED)) {
            e.item.setAttribute('aria-selected', 'false');
        }
        let fields: FieldsMapping = e.fields;
        this.addActionClass(e, fields.selected, SELECTED);
        this.addActionClass(e, fields.expanded, EXPANDED);
        if (!isNOU(this.nodeTemplateFn)) {
            let textEle: Element = e.item.querySelector('.' + LISTTEXT);
            textEle.innerHTML = '';
            let tempArr: Element[]  = this.nodeTemplateFn(e.curData, undefined, undefined, this.element.id + 'nodeTemplate',
                                                          this.isStringTemplate);
            tempArr = Array.prototype.slice.call(tempArr);
            append(tempArr, textEle);
        }
        let eventArgs: DrawNodeEventArgs = {
            node: e.item as HTMLLIElement,
            nodeData: e.curData,
            text: e.text,
        };
        if (!this.isRefreshed) {
            this.trigger('drawNode', eventArgs);
        }
    }

    private frameMouseHandler(e: MouseEvent): void {
        let rippleSpan: Element = select('.' + CHECKBOXRIPPLE, (e.target as Element).parentElement);
        rippleMouseHandler(e, rippleSpan);
    }

    private addActionClass(e: ItemCreatedArgs, action: string, cssClass: string): void {
        let data: { [key: string]: Object } = e.curData;
        let actionValue: Object = getValue(action, data);
        if (!isNOU(actionValue) && actionValue.toString() !== 'false') {
            e.item.classList.add(cssClass);
        }
    }

    private getDataType(ds: { [key: string]: Object }[], mapper: FieldsSettingsModel): number {
        if (this.fields.dataSource instanceof DataManager && ((this.fields.dataSource as any).adaptorName !== 'BlazorAdaptor')) {
            for (let i: number = 0; i < ds.length; i++) {
                if ((typeof mapper.child === 'string') && isNOU(getValue(mapper.child, ds[i]))) {
                    return 1;
                }
            }
            return 2;
        }
        for (let i: number = 0, len: number = ds.length; i < len; i++) {
            if ((typeof mapper.child === 'string') && !isNOU(getValue(mapper.child, ds[i]))) {
                return 2;
            }
            if (!isNOU(getValue(mapper.parentID, ds[i])) || !isNOU(getValue(mapper.hasChildren, ds[i]))) {
                return 1;
            }
        }
        return 1;
    }

    private getGroupedData(dataSource: { [key: string]: Object }[], groupBy: string): { [key: string]: Object }[][] {
        let cusQuery: Query = new Query().group(groupBy);
        let ds: { [key: string]: Object }[] = ListBase.getDataSource(dataSource, cusQuery);
        let grpItem: { [key: string]: Object }[][] = [];
        for (let j: number = 0; j < ds.length; j++) {
            let itemObj: { [key: string]: Object }[] = (ds[j] as { items: { [key: string]: Object }[] } & { [key: string]: Object }).items;
            grpItem.push(itemObj);
        }
        return grpItem;
    }

    private getSortedData(list: { [key: string]: Object }[]): { [key: string]: Object }[] {
        if (list && this.sortOrder !== 'None') {
            list = ListBase.getDataSource(list, ListBase.addSorting(this.sortOrder, this.fields.text));
        }
        return list;
    }

    private finalizeNode(element: Element | Document): void {
        let iNodes: HTMLElement[] = selectAll('.' + IMAGE, element);
        for (let k: number = 0; k < iNodes.length; k++) {
            iNodes[k].setAttribute('alt', IMAGE);
        }
        if (this.isLoaded) {
            let sNodes: HTMLElement[] = selectAll('.' + SELECTED, element);
            for (let i: number = 0; i < sNodes.length; i++) {
                this.selectNode(sNodes[i], null);
                break;
            }
            removeClass(sNodes, SELECTED);
        }
        let cNodes: HTMLElement[] = selectAll('.' + LISTITEM + ':not(.' + EXPANDED + ')', element);
        for (let j: number = 0; j < cNodes.length; j++) {
            let icon: Element = select('div.' + ICON, cNodes[j]);
            if (icon && icon.classList.contains(EXPANDABLE)) {
                this.disableExpandAttr(cNodes[j]);
            }
        }
        let eNodes: HTMLElement[] = selectAll('.' + EXPANDED, element);
        if (!this.isInitalExpand) {
            for (let i: number = 0; i < eNodes.length; i++) {
                this.renderChildNodes(eNodes[i]);
            }
        }
        removeClass(eNodes, EXPANDED);
        this.updateList();
        if (this.isLoaded) {
            this.updateCheckedProp();
        }
    }

    private updateCheckedProp(): void {
        if (this.showCheckBox) {
            let nodes: string[] = [].concat([], this.checkedNodes);
            this.setProperties({ checkedNodes: nodes }, true);
        }
    }

   private ensureIndeterminate(): void {
       if (this.autoCheck) {
            let liElement: HTMLElement[] = selectAll('li', this.element);
            let ulElement: Element;
            for (let i: number = 0; i < liElement.length; i++) {
                if (liElement[i].classList.contains(LISTITEM)) {
                    ulElement = select('.' + PARENTITEM, liElement[i]);
                    if (ulElement) {
                        this.ensureParentCheckState(liElement[i]);
                    } else {
                     this.ensureChildCheckState(liElement[i]);
                    }
                }
            }
       } else {
            let indeterminate: Element[] = selectAll('.' + INDETERMINATE, this.element);
            for ( let i: number = 0; i < indeterminate.length; i++) {
                indeterminate[i].classList.remove(INDETERMINATE);
            }
       }
   }

    private ensureParentCheckState(element: Element): void {
        if (!isNOU(element)) {
            if (element.classList.contains(ROOT)) {
                return;
            }
            let ulElement: Element = element;
            if (element.classList.contains(LISTITEM)) {
                ulElement = select('.' + PARENTITEM, element);
            }
            let checkedNodes: HTMLElement[] = selectAll('.' + CHECK, ulElement);
            let indeterminateNodes: HTMLElement[] = selectAll('.' + INDETERMINATE, ulElement);
            let nodes: HTMLElement[] = selectAll('.' + LISTITEM, ulElement);
            let checkBoxEle: Element = element.getElementsByClassName(CHECKBOXWRAP)[0];
            if (nodes.length === checkedNodes.length) {
                this.changeState(checkBoxEle, 'check', null, true, true);
            } else if (checkedNodes.length > 0 || indeterminateNodes.length > 0 ) {
                this.changeState(checkBoxEle, 'indeterminate', null, true, true);
            } else if (checkedNodes.length === 0) {
                this.changeState(checkBoxEle, 'uncheck', null, true, true);
            }
            let parentUL: Element = closest(element, '.' + PARENTITEM);
            if (!isNOU(parentUL)) {
                let currentParent: Element = closest(parentUL, '.' + LISTITEM);
                this.ensureParentCheckState(currentParent);
            }
        }
    }
    private ensureChildCheckState(element: Element | Document, e?: MouseEvent | KeyboardEventArgs): void {
        if (!isNOU(element)) {
            let childElement: Element = select('.' + PARENTITEM, element);
            let checkBoxes: HTMLElement[];
            if (!isNOU(childElement)) {
                checkBoxes = selectAll('.' + CHECKBOXWRAP, childElement);
                let isChecked: boolean = element.getElementsByClassName(CHECKBOXFRAME)[0].classList.contains(CHECK);
                let parentCheck: boolean = element.getElementsByClassName(CHECKBOXFRAME)[0].classList.contains(INDETERMINATE);
                let childCheck: NodeListOf<HTMLElement> = childElement.querySelectorAll('li');
                let expandState: string = childElement.parentElement.getAttribute('aria-expanded');
                let checkedState: string;
                for (let index: number = 0; index < checkBoxes.length; index++) {
                    let childId: string = childCheck[index].getAttribute('data-uid');
                    if (!isNOU(this.currentLoadData) && !isNOU(getValue(this.fields.isChecked, this.currentLoadData[index]))) {
                        checkedState = getValue(this.fields.isChecked, this.currentLoadData[index]) ? 'check' : 'uncheck';
                        if (this.ele !== -1) {
                            checkedState = isChecked ? 'check' : 'uncheck';
                        }
                        if ((checkedState === 'uncheck') && (!isUndefined(this.parentNodeCheck) && this.autoCheck 
                                && this.parentNodeCheck.indexOf(childId) !== -1)) {
                            this.parentNodeCheck.splice(this.parentNodeCheck.indexOf(childId), 1);
                            checkedState = 'indeterminate';
                        }
                    } else {
                        let isNodeChecked: boolean = checkBoxes[index].getElementsByClassName(CHECKBOXFRAME)[0].classList.contains(CHECK);
                        if (isChecked) {
                            checkedState = 'check';
                        } else if (isNodeChecked && !this.isLoaded) {
                            checkedState = 'check';
                        } else if (this.checkedNodes.indexOf(childId) !== -1 && this.isLoaded && (parentCheck || isChecked )) {
                            checkedState = 'check';
                        } else if (childCheck[index].classList.contains(CHILD) && ( !isUndefined(this.parentNodeCheck) &&  this.autoCheck
                                                        && (isChecked || parentCheck) && this.parentNodeCheck.indexOf(childId) !== -1)) {
                            checkedState = 'indeterminate';
                            this.parentNodeCheck.splice(this.parentNodeCheck.indexOf(childId), 1);
                        } else if (this.dataType === 1 && ( !isUndefined(this.parentNodeCheck) && this.autoCheck &&
                                                            (isChecked || parentCheck) && this.parentNodeCheck.indexOf(childId) !== -1)) {
                            checkedState = 'indeterminate';
                            this.parentNodeCheck.splice(this.parentNodeCheck.indexOf(childId), 1);
                        } else {
                            checkedState = 'uncheck';
                        }
                    }
                    this.changeState(checkBoxes[index], checkedState, e, true, true);
                }
            }
            if (this.autoCheck && this.isLoaded) {
                this.updateParentCheckState();
            }
        }
    }

    private doCheckBoxAction(nodes: string[] | Element[], doCheck: boolean): void {
        let li : HTMLElement[] = selectAll('.' + LISTITEM, this.element);
        if (! isNOU(nodes) ) {
            for (let len: number = nodes.length; len >= 0; len--) {
                let liEle: Element;
                if (nodes.length === 1) {
                 liEle = this.getElement(nodes[len - 1]);
                } else {
                     liEle = this.getElement(nodes[len]);
                }
                if (isNOU(liEle)) {
                    let node: string;
                    node =  nodes[len - nodes.length] ? nodes[len - nodes.length].toString() :  nodes[len] ? nodes[len].toString() : null;
                    if (node !== '' && doCheck && node) {
                        this.setValidCheckedNode(node);
                        this.dynamicCheckState(node,  doCheck);
                    } else if (this.checkedNodes.indexOf(node) !== -1 && node !== '' && !doCheck) {
                        this.checkedNodes.splice(this.checkedNodes.indexOf(node), 1);
                        let childItems: { [key: string]: Object }[] = this.getChildNodes(this.treeData, node);
                        if (childItems) {
                            for (let i : number = 0; i < childItems.length; i++) {
                                let id: string = childItems[i][this.fields.id] ? childItems[i][this.fields.id].toString() : null;
                                if (this.checkedNodes.indexOf(id) !== -1) {
                                    this.checkedNodes.splice(this.checkedNodes.indexOf(id), 1);
                                }
                            }
                            if (this.parentNodeCheck.indexOf(node) !== -1) {
                                this.parentNodeCheck.splice(this.parentNodeCheck.indexOf(node), 1);
                            }
                        }
                        if (node) {
                            this.dynamicCheckState(node, doCheck);
                        }
                        this.updateField(this.treeData, this.fields, node, 'isChecked', null);
                   }
                    continue;
                }
                let checkBox : Element = select('.' + PARENTITEM + ' .' + CHECKBOXWRAP, liEle);
                this.validateCheckNode(checkBox, !doCheck, liEle, null);
            }
        } else {
            let checkBoxes: HTMLElement[] = selectAll('.' + CHECKBOXWRAP, this.element);
            if (this.loadOnDemand) {
                for (let index: number = 0; index < checkBoxes.length; index++) {
                    this.updateFieldChecked(checkBoxes[index], doCheck);
                    this.changeState(checkBoxes[index], doCheck ? 'check' : 'uncheck', null , null, null, doCheck);
                }
            } else {
                for (let index: number = 0; index < checkBoxes.length; index++) {
                    this.updateFieldChecked(checkBoxes[index], doCheck);
                    this.changeState(checkBoxes[index], doCheck ? 'check' : 'uncheck');
                }
            }
        }
        if (nodes) {
            for ( let j: number = 0; j < nodes.length; j++) {
                let node: string =  nodes[j] ? nodes[j].toString() : '';
                if (! doCheck) {
                    this.updateField(this.treeData, this.fields, node, 'isChecked', null);
                }
            }
        }
        if (this.autoCheck) {
            this.updateParentCheckState();
        }
    }

    private updateFieldChecked(checkbox: HTMLElement, doCheck: Boolean) : void {
        let currLi: Element = closest(checkbox, '.' + LISTITEM);
        let id: string = currLi.getAttribute('data-uid');
        let nodeDetails: { [key: string]: Object } = this.getNodeData(currLi);
        if (nodeDetails.isChecked === 'true' && !doCheck) {
            this.updateField(this.treeData, this.fields, id, 'isChecked', null);
        }
    }
    /**
     * Changes the parent and child  check state while changing the checkedNodes via setmodel
     */
    private dynamicCheckState(node: string,  doCheck: boolean): void {
        if (this.dataType === 1) {
            let count: number = 0;
            let resultId: { [key: string]: Object }[] = <{ [key: string]: Object }[]>new DataManager(this.treeData).executeLocal(
                new Query().where(this.fields.id, 'equal', node, true));
            if (resultId[0]) {
                let id: string = resultId[0][this.fields.id] ? resultId[0][this.fields.id].toString() : null;
                let parent: string = resultId[0][this.fields.parentID] ? resultId[0][this.fields.parentID].toString() : null;
                let parentElement: Element = this.element.querySelector('[data-uid="' + parent + '"]');
                let indeterminate: Element = parentElement ? select('.' + INDETERMINATE, parentElement) : null;
                let check: Element = parentElement ? select('.' + CHECK, parentElement) : null;
                let element: Element = this.element.querySelector('[data-uid="' + id + '"]');
                let childNodes : { [key: string]: Object }[] = this.getChildNodes(this.treeData, parent);
                if (childNodes) {
                    for (let i : number = 0; i < childNodes.length; i++ ) {
                        let childId: string = childNodes[i][this.fields.id] ? childNodes[i][this.fields.id].toString() : null;
                        if (this.checkedNodes.indexOf(childId) !== -1) {
                            count++;
                        }
                    }
                }
                if (this.checkedNodes.indexOf(node) !== -1 && parentElement && (id === node) && this.autoCheck) {
                    this.changeState(parentElement, 'indeterminate', null);
                } else if (this.checkedNodes.indexOf(node) === -1 && element && (id === node) && !doCheck) {
                    this.changeState(element, 'uncheck', null);
                } else if (this.checkedNodes.indexOf(node) !== -1 && element && (id === node) && doCheck) {
                    this.changeState(element, 'check', null);
                } else if (this.checkedNodes.indexOf(node) === -1 && !element && parentElement && (id === node) && this.autoCheck
                                                                                                                    && count !== 0) {
                    this.changeState(parentElement, 'indeterminate', null);
                }  else if (this.checkedNodes.indexOf(node) === -1 && !element && parentElement && (id === node) && this.autoCheck
                                                                                                                    && count === 0) {
                    this.changeState(parentElement, 'uncheck', null);
                } else if (!element && !parentElement && (id === node) && this.autoCheck) {
                    this.updateIndeterminate(node, doCheck);
                }
            }
        } else if (this.dataType === 2 || (this.fields.dataSource instanceof DataManager &&
            this.fields.dataSource.dataSource.offline)) {
            let id: string;
            let parentElement: Element;
            let check: Element;
            for (let i: number = 0; i < this.treeData.length; i++) {
                id = this.treeData[i][this.fields.id] ? this.treeData[i][this.fields.id].toString() : '';
                parentElement = this.element.querySelector('[data-uid="' + id + '"]');
                check = parentElement ? select('.' + CHECK, parentElement) : null;
                if (this.checkedNodes.indexOf(id) === -1 && parentElement && check && !doCheck) {
                    this.changeState(parentElement, 'uncheck', null);
                }
                let subChild: { [key: string]: Object }[] = getValue(this.fields.child.toString(), this.treeData[i]);
                if (subChild) {
                    this.updateChildIndeterminate(subChild, id, node, doCheck, id);
                }
            }
        }
    }
     /**
      * updates the parent and child  check state while changing the checkedNodes via setmodel for listData
      */
    private updateIndeterminate(node: string, doCheck: boolean): void {
        let indeterminateData: { [key: string]: Object }[] = this.getTreeData(node);
        let count: number = 0;
        let parent: string;
        if (this.dataType === 1) {
            parent = indeterminateData[0][this.fields.parentID] ? indeterminateData[0][this.fields.parentID].toString() : null;
        }
        let childNodes: { [key: string]: Object }[] = this.getChildNodes(this.treeData, parent);
        if (childNodes) {
            for (let i: number = 0; i < childNodes.length; i++) {
                let childId: string = childNodes[i][this.fields.id] ? childNodes[i][this.fields.id].toString() : null;
                if (this.checkedNodes.indexOf(childId) !== -1) {
                    count++;
                }
            }
        }
        let parentElement: Element = this.element.querySelector('[data-uid="' + parent + '"]');
        if (parentElement && doCheck) {
            this.changeState(parentElement, 'indeterminate', null);
        } else if (!doCheck && parentElement && this.parentNodeCheck.indexOf(parent) === -1 && count !== 0) {
            this.changeState(parentElement, 'indeterminate', null);
        } else if (!doCheck && parentElement && this.parentNodeCheck.indexOf(parent) === -1 && count === 0) {
            this.changeState(parentElement, 'uncheck', null);
        } else if (!parentElement) {
            if (!doCheck && this.checkedNodes.indexOf(parent) === -1 && this.parentNodeCheck.indexOf(parent) !== -1) {
                this.parentNodeCheck.splice(this.parentNodeCheck.indexOf(parent), 1);
            } else if (doCheck && this.checkedNodes.indexOf(parent) === -1 && this.parentNodeCheck.indexOf(parent) === -1) {
                this.parentNodeCheck.push(parent);
            } else if (!doCheck && this.checkedNodes.indexOf(parent) !== -1 && this.parentNodeCheck.indexOf(parent) === -1
                                                                                                            && count !== 0 ) {
                this.parentNodeCheck.push(parent);
            }
            this.updateIndeterminate(parent, doCheck);
            if (this.checkedNodes.indexOf(parent) !== -1 && !doCheck) {
                this.checkedNodes.splice(this.checkedNodes.indexOf(parent), 1);
            }
        }
    }
     /**
      * updates the parent and child  check state while changing the checkedNodes via setmodel for hierarchical data
      */
    private updateChildIndeterminate
        (subChild: { [key: string]: Object }[], parent: string, node: string, doCheck: boolean, child?: string): void {
        let count: number = 0;
        for (let j: number = 0; j < subChild.length; j++) {
            let subId: string = subChild[j][this.fields.id] ? subChild[j][this.fields.id].toString() : '';
            if (this.checkedNodes.indexOf(subId) !== -1) {
                count++;
            }
            let parentElement: Element = this.element.querySelector('[data-uid="' + parent + '"]');
            let indeterminate: Element = parentElement ? select('.' + INDETERMINATE, parentElement) : null;
            let check: Element = parentElement ? select('.' + CHECK, parentElement) : null;
            let element: Element = this.element.querySelector('[data-uid="' + subId + '"]');
            let childElementCheck: Element = element ? select('.' + CHECK, element) : null;
            if (this.checkedNodes.indexOf(node) !== -1 && parentElement && (subId === node) && this.autoCheck) {
                this.changeState(parentElement, 'indeterminate', null);
            } else if (this.checkedNodes.indexOf(node) === -1 && parentElement && !element && (subId === node) && !doCheck) {
                if (this.autoCheck) {
                    this.changeState(parentElement, 'uncheck', null);
                } else {
                    if (count !== 0) {
                        this.changeState(parentElement, 'indeterminate', null);
                    } else {
                        this.changeState(parentElement, 'uncheck', null);
                    }
                }
            } else if (this.checkedNodes.indexOf(node) === -1 && element && (subId === node) && !doCheck) {
                this.changeState(element, 'uncheck', null);
            } else if (this.checkedNodes.indexOf(node) === -1 && indeterminate && (subId === node) && this.autoCheck && count === 0
                && !doCheck) {
                indeterminate.classList.remove(INDETERMINATE);
            } else if (this.checkedNodes.indexOf(node) === -1 && !element && check && (subId === node) && count === 0) {
                this.changeState(parentElement, 'uncheck', null);
            } else if (this.checkedNodes.indexOf(subId) === -1 && element && childElementCheck && count === 0) {
                this.changeState(element, 'uncheck', null);
            } else if (!element && !parentElement && (subId === node) || (this.parentNodeCheck.indexOf(parent) !== -1) && this.autoCheck) {
                let childElement: Element = this.element.querySelector('[data-uid="' + child + '"]');
                if (doCheck && count !== 0) {
                    this.changeState(childElement, 'indeterminate', null);
                } else if (doCheck && count === subChild.length && this.checkedNodes.indexOf(parent) === -1) {
                    this.checkedNodes.push(parent);
                } else if (!doCheck && count === 0 && this.parentNodeCheck.indexOf(parent) !== -1) {
                    this.parentNodeCheck.splice(this.parentNodeCheck.indexOf(parent));
                }
                if (this.parentNodeCheck.indexOf(parent) === -1) {
                    this.parentNodeCheck.push(parent);
                }
            }
            let innerChild: { [key: string]: Object }[] = getValue(this.fields.child.toString(), subChild[j]);
            if (innerChild) {
                this.updateChildIndeterminate(innerChild, subId, node, doCheck, child);
            }
        }
    }

    private changeState(
        wrapper: HTMLElement | Element, state: string, e?: MouseEvent | KeyboardEventArgs, isPrevent?: boolean, isAdd?: boolean,
        doCheck?: boolean): void {
        let eventArgs: NodeCheckEventArgs;
        let currLi: Element = closest(wrapper, '.' + LISTITEM);
        if (!isPrevent) {
            this.checkActionNodes = [];
            eventArgs = this.getCheckEvent(currLi, state, e);
            this.trigger('nodeChecking', eventArgs, (observedArgs: NodeCheckEventArgs) => {
                if (!observedArgs.cancel) {
                    this.nodeCheckAction(wrapper, state, currLi, observedArgs, e, isPrevent, isAdd, doCheck);
                }
            });
        } else {
            this.nodeCheckAction(wrapper, state, currLi, eventArgs, e, isPrevent, isAdd, doCheck);
        }
    }

    private nodeCheckAction(wrapper: HTMLElement | Element, state: string, currLi: Element, eventArgs: NodeCheckEventArgs,
                            e?: MouseEvent | KeyboardEventArgs, isPrevent?: boolean, isAdd?: boolean, doCheck?: boolean): void {
        let ariaState: string;
        let frameSpan: Element = wrapper.getElementsByClassName(CHECKBOXFRAME)[0];
        if (state === 'check' && !frameSpan.classList.contains(CHECK)) {
            frameSpan.classList.remove(INDETERMINATE);
            frameSpan.classList.add(CHECK);
            this.addCheck(currLi);
            ariaState = 'true';
        } else if (state === 'uncheck' && (frameSpan.classList.contains(CHECK) || frameSpan.classList.contains(INDETERMINATE))) {
            removeClass([frameSpan], [CHECK, INDETERMINATE]);
            this.removeCheck(currLi);
            ariaState = 'false';
        } else if (state === 'indeterminate' && !frameSpan.classList.contains(INDETERMINATE) && this.autoCheck) {
            frameSpan.classList.remove(CHECK);
            frameSpan.classList.add(INDETERMINATE);
            this.removeCheck(currLi);
            ariaState = 'mixed';
        }
        ariaState = state === 'check' ? 'true' : state === 'uncheck' ? 'false' : ariaState;
        if (!isNOU(ariaState)) {
            wrapper.setAttribute('aria-checked', ariaState);
        }
        if (isAdd) {
            let data: { [key: string]: Object }[] = [].concat([], this.checkActionNodes);
            eventArgs = this.getCheckEvent(currLi, state, e);
            if (isUndefined(isPrevent)) {
                eventArgs.data = data;
            }
        }
        if (doCheck !== undefined) {
            this.ensureStateChange(currLi, doCheck);
        }
        if (!isPrevent) {
            if (!isNOU(ariaState)) {
                wrapper.setAttribute('aria-checked', ariaState);
                this.allowServerDataBinding = true;
                this.updateServerProperties("check");
                this.allowServerDataBinding = false;
                eventArgs.data[0].checked = ariaState;
                this.trigger('nodeChecked', eventArgs);
                this.checkActionNodes = [];
            }
        }
    }

    private addCheck(liEle: Element): void {
        let id: string = liEle.getAttribute('data-uid');
        if (!isNOU(id) && this.checkedNodes.indexOf(id) === -1) {
            this.checkedNodes.push(id);
        }
    }

    private removeCheck(liEle: Element): void {
        let index: number = this.checkedNodes.indexOf(liEle.getAttribute('data-uid'));
        if (index > -1) {
            this.checkedNodes.splice(index, 1);
        }
    }

    private getCheckEvent(currLi: Element, action: string, e: MouseEvent | KeyboardEventArgs): NodeCheckEventArgs {
        this.checkActionNodes.push(this.getNodeData(currLi));
        let nodeData: { [key: string]: Object }[] = this.checkActionNodes;
        return { action: action, cancel: false, isInteracted: isNOU(e) ? false : true, node: currLi as HTMLLIElement, data: nodeData };
    }

    private finalize(): void {
        let firstUl: Element = select('.' + PARENTITEM, this.element);
        if (!isNullOrUndefined(firstUl)) {
            firstUl.setAttribute('role', treeAriaAttr.treeRole);
            this.setMultiSelect(this.allowMultiSelection);
            let firstNode: Element = select('.' + LISTITEM, this.element);
            if (firstNode) {
                addClass([firstNode], FOCUS);
                this.updateIdAttr(null, firstNode);
            }
            this.hasPid = this.rootData[0] ? this.rootData[0].hasOwnProperty(this.fields.parentID) : false;
            this.doExpandAction();
        }
    }

    private doExpandAction(): void {
        let eUids: string[] = this.expandedNodes;
        if (this.isInitalExpand && eUids.length > 0) {
            this.setProperties({ expandedNodes: [] }, true);
            if (this.isBlazorPlatform && !this.initialRender) {
                return;
            }
              // tslint:disable
            if (this.fields.dataSource instanceof DataManager && ((this.fields.dataSource as any).adaptorName !== 'BlazorAdaptor')) {
                this.expandGivenNodes(eUids);
            } else {
                for (let i: number = 0; i < eUids.length; i++) {
                    let eNode: Element = select('[data-uid="' + eUids[i] + '"]', this.element);
                    if (!isNOU(eNode)) {
                        let icon: Element = select('.' + EXPANDABLE, select('.' + TEXTWRAP, eNode));
                        if (!isNOU(icon)) {
                            this.expandAction(eNode, icon, null);
                        }
                    } else {
                        if (eUids[i] && this.expandChildren.indexOf(eUids[i]) === -1) {
                            this.expandChildren.push(eUids[i].toString());
                        }
                        continue;
                    }
                }
                this.afterFinalized();
            }
        } else {
            this.afterFinalized();
        }
    }

    private expandGivenNodes(arr: string[]): void {
        let proxy: TreeView = this;
        this.expandCallback(arr[this.index], () => {
            proxy.index++;
            if (proxy.index < arr.length) {
                proxy.expandGivenNodes(arr);
            } else {
                proxy.afterFinalized();
            }
        });
    }

    private expandCallback(eUid: string, callback: Function): void {
        let eNode: Element = select('[data-uid="' + eUid + '"]', this.element);
        if (!isNOU(eNode)) {
            let icon: Element = select('.' + EXPANDABLE, select('.' + TEXTWRAP, eNode));
            if (!isNOU(icon)) {
                this.expandAction(eNode, icon, null, false, callback);
            } else {
                callback();
            }
        } else {
            callback();
        }
    }

    private afterFinalized(): void {
        if (!this.isBlazorPlatform || (this.isBlazorPlatform && !this.initialRender)) {
            this.doSelectionAction();
        }
        this.updateCheckedProp();
        if (this.isBlazorPlatform) { 
            if(this.initialRender) {            
                this.setCheckedNodes(this.checkedNodes);
            }
            this.updateInstance();
            this.initialRender = false;
        }
        this.isAnimate = true;
        this.isInitalExpand = false;
        if (!this.isLoaded || this.isFieldChange) {
            let eventArgs: DataBoundEventArgs = { data: this.treeData };
            this.trigger('dataBound', eventArgs);
        }
        this.isLoaded = true;
    }

    private doSelectionAction(): void {
        let sNodes: HTMLElement[] = selectAll('.' + SELECTED, this.element);
        let sUids: string[] = this.selectedNodes;
        if (sUids.length > 0) {
            this.setProperties({ selectedNodes: [] }, true);
            for (let i: number = 0; i < sUids.length; i++) {
                let sNode: Element = select('[data-uid="' + sUids[i] + '"]', this.element);
                if (sNode && !(sNode.classList.contains('e-active'))) {
                    this.selectNode(sNode, null, true);
                }  else {
                    this.selectedNodes.push(sUids[i]);
                }
                if (!this.allowMultiSelection) {
                    break;
                }
            }
        } else {
            this.selectGivenNodes(sNodes);
        }
        removeClass(sNodes, SELECTED);
    }

    private selectGivenNodes(sNodes: HTMLElement[]): void {
        for (let i: number = 0; i < sNodes.length; i++) {
            if (!sNodes[i].classList.contains('e-disable')) {
                this.selectNode(sNodes[i], null, true);
            }
            if (!this.allowMultiSelection) {
                break;
            }
        }
    }

    private clickHandler(event: TapEventArgs): void {
        let target: Element = <Element>event.originalEvent.target;
        EventHandler.remove(this.element, 'contextmenu', this.preventContextMenu);
        if (!target || this.dragStartAction) {
            return;
        } else {
            let classList: DOMTokenList = target.classList;
            let li: Element = closest(target, '.' + LISTITEM);
            if (!li) {
                return;
            } else if (event.originalEvent.which !== 3) {
                let rippleElement: Element =  select('.' + RIPPLEELMENT, li);
                let rippleIcons: Element = select('.' + ICON, li);
                this.removeHover();
                this.setFocusElement(li);
                if (this.showCheckBox && !li.classList.contains('e-disable')) {
                    let checkWrapper: HTMLElement = closest(target, '.' + CHECKBOXWRAP) as HTMLElement;
                    if (!isNOU(checkWrapper)) {
                        let checkElement: Element = select('.' + CHECKBOXFRAME, checkWrapper);
                        this.validateCheckNode(checkWrapper, checkElement.classList.contains(CHECK), li, event.originalEvent);
                        this.triggerClickEvent(event.originalEvent, li);
                        return;
                    }
                }
                if (classList.contains(EXPANDABLE)) {
                    this.expandAction(li, target, event);
                } else if (classList.contains(COLLAPSIBLE)) {
                    this.collapseNode(li, target, event);
                } else if (rippleElement && rippleIcons) {
                    if (rippleIcons.classList.contains(RIPPLE) && rippleIcons.classList.contains(EXPANDABLE)) {
                        this.expandAction(li, rippleIcons, event);
                    } else if (rippleIcons.classList.contains(RIPPLE) && rippleIcons.classList.contains(COLLAPSIBLE)) {
                        this.collapseNode(li, rippleIcons, event);
                    } else if (!classList.contains(PARENTITEM) && !classList.contains(LISTITEM)) {
                        this.toggleSelect(li, event.originalEvent, false);
                    }
                } else {
                    if (!classList.contains(PARENTITEM) && !classList.contains(LISTITEM)) {
                        this.toggleSelect(li, event.originalEvent, false);
                    }
                }
            }
            this.triggerClickEvent(event.originalEvent, li);
        }
    }

    private nodeCheckedEvent(wrapper: HTMLElement | Element, isCheck: boolean, e: MouseEvent | KeyboardEventArgs): void {
        let currLi: Element = closest(wrapper, '.' + LISTITEM);
        let eventArgs: NodeCheckEventArgs = this.getCheckEvent(wrapper, isCheck ? 'uncheck' : 'check', e);
        eventArgs.data = eventArgs.data.splice(0, eventArgs.data.length - 1);
        this.trigger('nodeChecked', eventArgs);
    }

    private triggerClickEvent(e: MouseEvent, li: Element): void {
        let eventArgs: NodeClickEventArgs = {
            event: e,
            node: li as HTMLLIElement,
        };
        this.trigger('nodeClicked', eventArgs);
    }

    private expandNode(currLi: Element, icon: Element, loaded?: boolean): void {
        if (icon.classList.contains(LOAD)) {
            this.hideSpinner(icon as HTMLElement);
        }
        if (!this.initialRender) {
            icon.classList.add('interaction');
        }
        if (loaded !== true || (loaded === true && currLi.classList.contains('e-expanded'))) {
            if (this.preventExpand !== true) {
                removeClass([icon], EXPANDABLE);
                addClass([icon], COLLAPSIBLE);
                let start: number = 0;
                let end: number = 0;
                let proxy: TreeView = this;
                let ul: HTMLElement = <HTMLElement>select('.' + PARENTITEM, currLi);
                let liEle: HTMLElement = <HTMLElement>currLi;
                this.setHeight(liEle, ul);
                let activeElement: HTMLElement = <HTMLElement>select('.' + LISTITEM + '.' + ACTIVE, currLi);
                if (this.isAnimate && !this.isRefreshed) {
                    this.aniObj.animate(ul, {
                        name: this.animation.expand.effect,
                        duration: this.animation.expand.duration,
                        timingFunction: this.animation.expand.easing,
                        begin: (args: AnimationOptions): void => {
                            liEle.style.overflow = 'hidden';
                            if (!isNullOrUndefined(activeElement) && activeElement instanceof HTMLElement) {
                                activeElement.classList.add(ITEM_ANIMATION_ACTIVE);
                            }
                            start = liEle.offsetHeight;
                            end = (<HTMLElement>select('.' + TEXTWRAP, currLi)).offsetHeight;
                        },
                        progress: (args: AnimationOptions): void => {
                            args.element.style.display = 'block';
                            proxy.animateHeight(args, start, end);
                        },
                        end: (args: AnimationOptions): void => {
                            args.element.style.display = 'block';
                            if (!isNullOrUndefined(activeElement) && activeElement instanceof HTMLElement) {
                                activeElement.classList.remove(ITEM_ANIMATION_ACTIVE);
                            }
                            this.expandedNode(liEle, ul, icon);
                        }
                    });
                } else {
                    this.expandedNode(liEle, ul, icon);
                }
            }
        } else {
        let ul: HTMLElement = <HTMLElement>select('.' + PARENTITEM, currLi);
        ul.style.display = 'none';
        if (this.fields.dataSource instanceof DataManager === true) {
            this.preventExpand = false;
        }
    }
        if (this.initialRender) {
            icon.classList.add('interaction');
        }
    }

    private expandedNode(currLi: HTMLElement, ul: HTMLElement, icon: Element): void {
        ul.style.display = 'block';
        currLi.style.display = 'block';
        currLi.style.overflow = '';
        currLi.style.height = '';
        removeClass([icon], PROCESS);
        this.addExpand(currLi);
        this.allowServerDataBinding = true;
        this.updateServerProperties("expand");
        this.allowServerDataBinding = false;
        if (this.isLoaded && this.expandArgs && !this.isRefreshed) {
            this.expandArgs = this.getExpandEvent(currLi, null);
            this.trigger('nodeExpanded', this.expandArgs);
        }
    }

    private addExpand(liEle: Element): void {
        liEle.setAttribute('aria-expanded', 'true');
        removeClass([liEle], NODECOLLAPSED);
        let id: string = liEle.getAttribute('data-uid');
        if (!isNOU(id) && this.expandedNodes.indexOf(id) === -1) {
            this.expandedNodes.push(id);
        }
    }

    private collapseNode(currLi: Element, icon: Element, e: MouseEvent | KeyboardEventArgs | TapEventArgs): void {
        if (icon.classList.contains(PROCESS)) {
            return;
        } else {
            addClass([icon], PROCESS);
        }
        let colArgs: NodeExpandEventArgs;
        if (this.isLoaded) {
            colArgs = this.getExpandEvent(currLi, e);
            this.trigger('nodeCollapsing', colArgs, (observedArgs: NodeExpandEventArgs) => {
                if (observedArgs.cancel) {
                    removeClass([icon], PROCESS);
                } else {
                    this.nodeCollapseAction(currLi, icon, observedArgs);
                }
            });
        } else {
            this.nodeCollapseAction(currLi, icon, colArgs);
        }
    }

    private nodeCollapseAction(currLi: Element, icon: Element, colArgs : NodeExpandEventArgs) : void {
        removeClass([icon], COLLAPSIBLE);
        addClass([icon], EXPANDABLE);
        let start: number = 0;
        let end: number = 0;
        let proxy: TreeView = this;
        let ul: HTMLElement = <HTMLElement>select('.' + PARENTITEM, currLi);
        let liEle: HTMLElement = <HTMLElement>currLi;
        let activeElement: HTMLElement = <HTMLElement>select('.' + LISTITEM + '.' + ACTIVE, currLi);
        if (this.isAnimate) {
            this.aniObj.animate(ul, {
                name: this.animation.collapse.effect,
                duration: this.animation.collapse.duration,
                timingFunction: this.animation.collapse.easing,
                begin: (args: AnimationOptions): void => {
                    liEle.style.overflow = 'hidden';
                    if (!isNullOrUndefined(activeElement) && activeElement instanceof HTMLElement) {
                        activeElement.classList.add(ITEM_ANIMATION_ACTIVE);
                    }
                    start = (<HTMLElement>select('.' + TEXTWRAP, currLi)).offsetHeight;
                    end = liEle.offsetHeight;
                },
                progress: (args: AnimationOptions): void => {
                    proxy.animateHeight(args, start, end);
                },
                end: (args: AnimationOptions): void => {
                    args.element.style.display = 'none';
                    if (!isNullOrUndefined(activeElement) && activeElement instanceof HTMLElement) {
                        activeElement.classList.remove(ITEM_ANIMATION_ACTIVE);
                    }
                    this.collapsedNode(liEle, ul, icon, colArgs);
                }
            });
        } else {
            this.collapsedNode(liEle, ul, icon, colArgs);
        }
    }
    private collapsedNode(liEle: HTMLElement, ul: HTMLElement, icon: Element, colArgs: NodeExpandEventArgs): void {
        ul.style.display = 'none';
        liEle.style.overflow = '';
        liEle.style.height = '';
        removeClass([icon], PROCESS);
        this.allowServerDataBinding = true;
        this.updateServerProperties("expand");
        this.allowServerDataBinding = false;
        this.removeExpand(liEle);
        if (this.isLoaded) {
            this.trigger('nodeCollapsed', colArgs);
        }
    }

    private removeExpand(liEle: Element, toRemove?: boolean): void {
        if (toRemove) {
            liEle.removeAttribute('aria-expanded');
        } else {
            this.disableExpandAttr(liEle);
        }
        let index: number = this.expandedNodes.indexOf(liEle.getAttribute('data-uid'));
        if (index > -1) {
            this.expandedNodes.splice(index, 1);
        }
    }

    private disableExpandAttr(liEle: Element): void {
        liEle.setAttribute('aria-expanded', 'false');
        addClass([liEle], NODECOLLAPSED);
    }

    private setHeight(currLi: HTMLElement, ul: HTMLElement): void {
        ul.style.display = 'block';
        ul.style.visibility = 'hidden';
        currLi.style.height = currLi.offsetHeight + 'px';
        ul.style.display = 'none';
        ul.style.visibility = '';
    }

    private animateHeight(args: AnimationOptions, start: number, end: number): void {
        let remaining: number = (args.duration - args.timeStamp) / args.duration;
        let currentHeight: number = ( end - start ) * remaining + start;
        args.element.parentElement.style.height = currentHeight + 'px';
    }

    private renderChildNodes(parentLi: Element, expandChild?: boolean, callback?: Function, loaded?: boolean): void {
        let eicon: Element = select('div.' + ICON, parentLi);
        if (isNOU(eicon)) {
            return;
        }
        this.showSpinner(eicon as HTMLElement);
        let childItems: { [key: string]: Object }[];
        // tslint:disable
        if (this.fields.dataSource instanceof DataManager && ((this.fields.dataSource as any).adaptorName !== 'BlazorAdaptor'))  {
            let level: number = this.parents(parentLi, '.' + PARENTITEM).length;
            let mapper: FieldsSettingsModel = this.getChildFields(this.fields, level, 1);
            if (isNOU(mapper) || isNOU(mapper.dataSource)) {
                detach(eicon);
                this.removeExpand(parentLi, true);
                return;
            }
            this.treeList.push('false');
            if (this.fields.dataSource instanceof DataManager && (this.fields.dataSource.dataSource.offline)) {
                       this.treeList.pop();
                       childItems = this.getChildNodes(this.treeData, parentLi.getAttribute('data-uid'));
                       this.loadChild(childItems, mapper, eicon, parentLi, expandChild, callback, loaded);
                       this.updateTemplateForBlazor();
            } else {
                    (mapper.dataSource as DataManager).executeQuery(this.getQuery(mapper,
                                                                                  parentLi.getAttribute('data-uid'))).then((e: Object) => {
                    this.treeList.pop();
                    childItems = (e as ResultData).result;
                    if (this.dataType === 1) {
                        this.dataType = 2;
                    }
                    this.loadChild(childItems, mapper, eicon, parentLi, expandChild, callback, loaded);
                    this.updateTemplateForBlazor();
                }).catch((e: Object) => {
                    this.trigger('actionFailure', { error: e });
                });
            }
        } else {
            childItems = this.getChildNodes(this.treeData, parentLi.getAttribute('data-uid'));
            this.currentLoadData = childItems;
            if (isNOU(childItems) || childItems.length === 0) {
                detach(eicon);
                this.removeExpand(parentLi, true);
                return;
            } else {
                if (!this.isBlazorPlatform || !this.initialRender) {
                    this.listBaseOption.ariaAttributes.level = parseFloat(parentLi.getAttribute('aria-level')) + 1;
                    parentLi.appendChild(ListBase.createList(this.createElement, this.getSortedData(childItems), this.listBaseOption));
                }
                this.expandNode(parentLi, eicon, loaded);
                this.setSelectionForChildNodes(childItems);
                this.ensureCheckNode(parentLi);
                this.finalizeNode(parentLi);
                if (this.loadOnDemand && this.nodeTemplate && this.isBlazorPlatform && !this.isStringTemplate) {
                    this.updateBlazorTemplate();
                }
                this.disableTreeNodes(childItems);
                this.renderSubChild(parentLi, expandChild, loaded);
            }
        }
    }

    private loadChild(childItems: { [key: string]: Object }[], mapper: FieldsSettingsModel, eicon: Element, parentLi: Element,
                      expandChild?: boolean, callback?: Function , loaded?: boolean): void {
            this.currentLoadData = childItems;
            if (isNOU(childItems) || childItems.length === 0) {
                    detach(eicon);
                    this.removeExpand(parentLi, true);
            } else {
                this.updateListProp(mapper);
                if (this.fields.dataSource instanceof DataManager && !this.fields.dataSource.dataSource.offline) {
                    let id: string = parentLi.getAttribute('data-uid');
                    let nodeData: { [key: string]: Object } = this.getNodeObject(id);
                    setValue('child', childItems, nodeData);
                    }
                this.listBaseOption.ariaAttributes.level = parseFloat(parentLi.getAttribute('aria-level')) + 1;
                parentLi.appendChild(ListBase.createList(this.createElement, childItems, this.listBaseOption));
                this.expandNode(parentLi, eicon, loaded);
                this.setSelectionForChildNodes(childItems);
                this.ensureCheckNode(parentLi);
                this.finalizeNode(parentLi);
                this.disableTreeNodes(childItems);
                this.renderSubChild(parentLi, expandChild, loaded);
                }
            if (callback) {
                callback();
            }
            if (this.treeList.length === 0 && !this.isLoaded) {
                this.finalize();
            }
    }

    private disableTreeNodes(childItems: { [key: string]: Object }[]): void {
                let i : number = 0;
                while (i < childItems.length) {
                    let id: string = childItems[i][this.fields.id] ? childItems[i][this.fields.id].toString() : null;
                    if (this.disableNode !== undefined && this.disableNode.indexOf(id) !== -1) {
                        this.doDisableAction([id]);
                    }
                    i++;
                }
    }

    /**
     * Sets the child Item in selectedState while rendering the child node
     */
    private setSelectionForChildNodes(nodes: { [key: string]: Object }[]): void {
            let i: number;
            for (i = 0; i < nodes.length; i++) {
                let id: string = nodes[i][this.fields.id]? nodes[i][this.fields.id].toString(): null;
                if (this.selectedNodes !== undefined && this.selectedNodes.indexOf(id) !== -1) {
                    this.doSelectionAction();
                }
            }
    }

    private ensureCheckNode(element: Element): void {
        if (this.showCheckBox) {
            this.ele = (this.checkedElement) ? this.checkedElement.indexOf(element.getAttribute('data-uid')) : null;
            if (this.autoCheck) {
                this.ensureChildCheckState(element);
                this.ensureParentCheckState(element);
            }
        }
        this.currentLoadData = null;
    }

    private getFields(mapper: FieldsSettingsModel, nodeLevel: number, dataLevel: number): FieldsSettingsModel {
        if (nodeLevel === dataLevel) {
            return mapper;
        } else {
            return this.getFields(this.getChildMapper(mapper), nodeLevel, dataLevel + 1);
        }
    }

    private getChildFields(mapper: FieldsSettingsModel, nodeLevel: number, dataLevel: number): FieldsSettingsModel {
        let childData: FieldsSettingsModel;
        if (nodeLevel === dataLevel) {
            return this.getChildMapper(mapper);
        } else {
            return this.getChildFields(this.getChildMapper(mapper), nodeLevel, dataLevel + 1);
        }
    }

    private getChildMapper(mapper: FieldsSettingsModel): FieldsSettingsModel {
        return (typeof mapper.child === 'string' || isNOU(mapper.child)) ? mapper : mapper.child;
    }

    private getChildNodes(obj: { [key: string]: Object }[], parentId: string, isRoot: boolean = false): { [key: string]: Object }[] {
        let childNodes: { [key: string]: Object }[];
        if (isNOU(obj)) {
            return childNodes;
        } else if (this.dataType === 1) {
            return this.getChildGroup(this.groupedData, parentId, isRoot);
        } else {
            if (typeof this.fields.child === 'string') {
                for (let i: number = 0, objlen: number = obj.length; i < objlen; i++) {
                    let dataId: Object = getValue(this.fields.id, obj[i]);
                    if (dataId && dataId.toString() === parentId) {
                        return <{ [key: string]: Object }[]>getValue(this.fields.child, obj[i]);
                    } else if (!isNOU(getValue(this.fields.child, obj[i]))) {
                        childNodes = this.getChildNodes(<{ [key: string]: Object }[]>getValue(this.fields.child, obj[i]), parentId);
                        if (childNodes !== undefined) {
                            break;
                        }
                    }
                }
            }
        }
        return childNodes;
    }

    private getChildGroup(data: { [key: string]: Object }[][], parentId: string, isRoot: boolean): { [key: string]: Object }[] {
        let childNodes: { [key: string]: Object }[];
        if (isNOU(data)) {
            return childNodes;
        }
        for (let i: number = 0, objlen: number = data.length; i < objlen; i++) {
            if (!isNOU(data[i][0]) && !isNOU(getValue(this.fields.parentID, data[i][0]))) {
                if (getValue(this.fields.parentID, data[i][0]).toString() === parentId ) {
                    return data[i];
                }
            } else if (isRoot) {
                return data[i];
            } else {
                return [];
            }
        }
        return childNodes;
    }

    private renderSubChild(element: Element, expandChild?: boolean, loaded?: boolean): void {
        if (expandChild) {
            let cIcons: HTMLElement[] = selectAll('.' + EXPANDABLE, element);
            for (let i: number = 0, len: number = cIcons.length; i < len; i++) {
                let icon: Element = cIcons[i];
                if (element.querySelector('.e-icons') !== cIcons[i]) {
                    let curLi: Element = closest(icon, '.' + LISTITEM);
                    this.expandArgs = this.getExpandEvent(curLi, null);
                    if (loaded !== true) {
                        this.trigger('nodeExpanding', this.expandArgs);
                    }
                    this.renderChildNodes(curLi, expandChild, null, loaded);
                }
            }
        }
    }

    private toggleSelect(li: Element, e: MouseEvent | KeyboardEventArgs, multiSelect?: boolean): void {
        if (!li.classList.contains('e-disable')) {
            if (this.allowMultiSelection && ((e && e.ctrlKey) || multiSelect) && this.isActive(li)) {
                this.unselectNode(li, e);
            } else {
                this.selectNode(li, e, multiSelect);
            }
        }
    }

    private isActive(li: Element): boolean {
        return li.classList.contains(ACTIVE) ? true : false;
    }

    private selectNode(li: Element, e: MouseEvent | KeyboardEventArgs, multiSelect?: boolean): void {
        if (isNOU(li) || (!this.allowMultiSelection && this.isActive(li) && !isNOU(e))) {
            this.setFocusElement(li);
            return;
        }
        let eventArgs: NodeSelectEventArgs;
        if (this.isLoaded) {
            eventArgs = this.getSelectEvent(li, 'select', e);
            this.trigger('nodeSelecting', eventArgs, (observedArgs: NodeSelectEventArgs) => {
                if (!observedArgs.cancel) {
                    this.nodeSelectAction(li, e, observedArgs, multiSelect);
                }
            });
        } else {
            this.nodeSelectAction(li, e, eventArgs, multiSelect);
        }
    }

    private nodeSelectAction(li: Element, e: MouseEvent | KeyboardEventArgs, eventArgs: NodeSelectEventArgs, multiSelect?: boolean) : void{
        if (!this.allowMultiSelection || (!multiSelect && (!e || (e && !e.ctrlKey)))) {
            this.removeSelectAll();
        }
        if (this.allowMultiSelection && e && e.shiftKey) {
            if (!this.startNode) {
                this.startNode = li;
            }
            let startIndex: number = this.liList.indexOf(<HTMLElement>this.startNode);
            let endIndex: number = this.liList.indexOf(<HTMLElement>li);
            if (startIndex > endIndex) {
                let temp: number = startIndex;
                startIndex = endIndex;
                endIndex = temp;
            }
            for (let i: number = startIndex; i <= endIndex; i++) {
                let currNode: Element = this.liList[i];
                if (isVisible(currNode) && !currNode.classList.contains('e-disable')) {
                    this.addSelect(currNode);
                }
            }
        } else {
            this.startNode = li;
            this.addSelect(li);
        }
        this.setFocusElement(li);
        if (this.isLoaded) {
            this.allowServerDataBinding = true;
            this.updateServerProperties("select");
            this.allowServerDataBinding = false;
            eventArgs.nodeData = this.getNodeData(li);
            this.trigger('nodeSelected', eventArgs);
        }
    }
    private unselectNode(li: Element, e: MouseEvent | KeyboardEventArgs): void {
        let eventArgs: NodeSelectEventArgs;
        if (this.isLoaded) {
            eventArgs = this.getSelectEvent(li, 'un-select', e);
            this.trigger('nodeSelecting', eventArgs, (observedArgs: NodeSelectEventArgs) => {
                if (!observedArgs.cancel) {
                    this.allowServerDataBinding = true;
                    this.updateServerProperties("select");
                    this.allowServerDataBinding = false;
                    this.nodeUnselectAction(li, observedArgs);
                }
            });
        } else {
            this.nodeUnselectAction(li, eventArgs);
        }
    }

    private nodeUnselectAction(li: Element, eventArgs: NodeSelectEventArgs): void {
        this.removeSelect(li);
        this.setFocusElement(li);
        if (this.isLoaded) {
            this.allowServerDataBinding = true;
            this.updateServerProperties("select");
            this.allowServerDataBinding = false;
            eventArgs.nodeData = this.getNodeData(li);
            this.trigger('nodeSelected', eventArgs);
        }
    }

    private setFocusElement(li: Element): void {
        if (!isNOU(li)) {
            let focusedNode: Element = this.getFocusedNode();
            if (focusedNode) {
                removeClass([focusedNode], FOCUS);
            }
            addClass([li], FOCUS);
            this.updateIdAttr(focusedNode, li);
        }
    }

    private addSelect(liEle: Element): void {
        liEle.setAttribute('aria-selected', 'true');
        addClass([liEle], ACTIVE);
        let id: string = liEle.getAttribute('data-uid');
        if (!isNOU(id) && this.selectedNodes.indexOf(id) === -1) {
            this.selectedNodes.push(id);
        }
    }

    private removeSelect(liEle: Element): void {
        if (this.allowMultiSelection) {
            liEle.setAttribute('aria-selected', 'false');
        } else {
            liEle.removeAttribute('aria-selected');
        }
        removeClass([liEle], ACTIVE);
        let index: number = this.selectedNodes.indexOf(liEle.getAttribute('data-uid'));
        if (index > -1) {
            this.selectedNodes.splice(index, 1);
        }
    }

    private removeSelectAll(): void {
        let selectedLI: Element[] = <NodeListOf<Element> & Element[]>this.element.querySelectorAll('.' + ACTIVE);
        for (let ele of selectedLI) {
            if (this.allowMultiSelection) {
                ele.setAttribute('aria-selected', 'false');
            } else {
                ele.removeAttribute('aria-selected');
            }
        }
        removeClass(selectedLI, ACTIVE);
        this.setProperties({ selectedNodes: [] }, true);
    }

    private getSelectEvent(currLi: Element, action: string, e: MouseEvent | KeyboardEventArgs): NodeSelectEventArgs {
        let nodeData: { [key: string]: Object } = this.getNodeData(currLi);
        return { action: action, cancel: false, isInteracted: isNOU(e) ? false : true, node: currLi as HTMLLIElement, nodeData: nodeData };
    }

    private setExpandOnType(): void {
        this.expandOnType = (this.expandOn === 'Auto') ? (Browser.isDevice ? 'Click' : 'DblClick') : this.expandOn;
    }

    private expandHandler(e: TapEventArgs): void {
        let target: Element = <Element>e.originalEvent.target;
        if (!target || target.classList.contains(INPUT) || target.classList.contains(ROOT) ||
            target.classList.contains(PARENTITEM) || target.classList.contains(LISTITEM) ||
            target.classList.contains(ICON) || this.showCheckBox && closest(target, '.' + CHECKBOXWRAP)) {
            return;
        } else {
            this.expandCollapseAction(closest(target, '.' + LISTITEM), e);
        }
    }

    private expandCollapseAction(currLi: Element, e: TapEventArgs): void {
        let icon: Element = select('div.' + ICON, currLi);
        if (!icon || icon.classList.contains(PROCESS)) {
            return;
        } else {
            let classList: DOMTokenList = icon.classList;
            if (classList.contains(EXPANDABLE)) {
                this.expandAction(currLi, icon, e);
            } else if (classList.contains(COLLAPSIBLE)) {
                this.collapseNode(currLi, icon, e);
            }
        }
    }

    private expandAction(
        currLi: Element, icon: Element, e: MouseEvent | KeyboardEventArgs | TapEventArgs, expandChild?: boolean, callback?: Function): void {
        if (icon.classList.contains(PROCESS)) {
            return;
        } else {
            addClass([icon], PROCESS);
        }
        if (this.isLoaded && !this.isRefreshed) {
            this.expandArgs = this.getExpandEvent(currLi, e);
            this.trigger('nodeExpanding', this.expandArgs, (observedArgs: NodeExpandEventArgs) => {
                if (observedArgs.cancel) {
                    removeClass([icon], PROCESS);
                }
                else {
                    this.nodeExpandAction(currLi, icon, expandChild, callback);
                }
            });
        }
        else {
            this.nodeExpandAction(currLi, icon, expandChild, callback);
        }
    }

    private nodeExpandAction(currLi: Element, icon: Element, expandChild?: boolean, callback?: Function): void {
        let ul: Element = select('.' + PARENTITEM, currLi);
        if (ul && ul.nodeName === 'UL') {
            this.expandNode(currLi, icon);
        } else {
            this.renderChildNodes(currLi, expandChild, callback);
            let liEles: Element[] = selectAll('.' + LISTITEM, currLi);
            for (let i: number = 0; i < liEles.length; i++) {
                let id: string = this.getId(liEles[i]);
                if (this.expandChildren.indexOf(id) !== -1 && this.expandChildren !== undefined) {
                    let icon: Element = select('.' + EXPANDABLE, select('.' + TEXTWRAP, liEles[i]));
                    if (!isNOU(icon)) {
                        this.expandAction(liEles[i], icon, null);
                    }
                    this.expandChildren.splice(this.expandChildren.indexOf(id), 1);
                }
            }
        }
    }

    private keyActionHandler(e: KeyboardEventArgs): void {
        let target: Element = <Element>e.target;
        let focusedNode: Element = this.getFocusedNode();
        if (target && target.classList.contains(INPUT)) {
            let inpEle: HTMLInputElement = <HTMLInputElement>target;
            if (e.action === 'enter') {
                inpEle.blur();
                this.element.focus();
                addClass([focusedNode], HOVER);
            } else if (e.action === 'escape') {
                inpEle.value = this.oldText;
                inpEle.blur();
                this.element.focus();
                addClass([focusedNode], HOVER);
            }
            return;
        }
        e.preventDefault();
        let eventArgs: NodeKeyPressEventArgs = {
            cancel: false,
            event: e,
            node: focusedNode as HTMLLIElement,
        };
        this.trigger('keyPress', eventArgs, (observedArgs: NodeEditEventArgs) => {
            if (!observedArgs.cancel) {
                switch (e.action) {
                    case 'space':
                        if (this.showCheckBox) {
                            this.checkNode(e);
                        }
                        break;
                    case 'moveRight':
                        this.openNode(this.enableRtl ? false : true, e);
                        break;
                    case 'moveLeft':
                        this.openNode(this.enableRtl ? true : false, e);
                        break;
                    case 'shiftDown':
                        this.shiftKeySelect(true, e);
                        break;
                    case 'moveDown':
                    case 'ctrlDown':
                    case 'csDown':
                        this.navigateNode(true);
                        break;
                    case 'shiftUp':
                        this.shiftKeySelect(false, e);
                        break;
                    case 'moveUp':
                    case 'ctrlUp':
                    case 'csUp':
                        this.navigateNode(false);
                        break;
                    case 'home':
                    case 'shiftHome':
                    case 'ctrlHome':
                    case 'csHome':
                        this.navigateRootNode(true);
                        break;
                    case 'end':
                    case 'shiftEnd':
                    case 'ctrlEnd':
                    case 'csEnd':
                        this.navigateRootNode(false);
                        break;
                    case 'enter':
                    case 'ctrlEnter':
                    case 'shiftEnter':
                    case 'csEnter':
                        this.toggleSelect(focusedNode, e);
                        break;
                    case 'f2':
                        if (this.allowEditing && !focusedNode.classList.contains('e-disable')) {
                            this.createTextbox(focusedNode, e);
                        }
                        break;
                    case 'ctrlA':
                        if (this.allowMultiSelection) {
                            let sNodes: HTMLElement[] = selectAll('.' + LISTITEM + ':not(.' + ACTIVE + ')', this.element);
                            this.selectGivenNodes(sNodes);
                        }
                        break;
                }
            }
        });
    }

    private navigateToFocus(isUp: boolean): void {
        let focusNode: Element = this.getFocusedNode().querySelector('.' + TEXTWRAP);
        let pos: ClientRect = focusNode.getBoundingClientRect();
        let parent: Element = this.getScrollParent(this.element);
        if (!isNOU(parent)) {
            let parentPos: ClientRect = parent.getBoundingClientRect();
            if (pos.bottom > parentPos.bottom) {
                parent.scrollTop += pos.bottom - parentPos.bottom;
            } else if (pos.top < parentPos.top) {
                parent.scrollTop -= parentPos.top - pos.top;
            }
        }
        let isVisible: boolean = this.isVisibleInViewport(focusNode);
        if (!isVisible) {
            focusNode.scrollIntoView(isUp);
        }
    }

    private isVisibleInViewport(txtWrap: Element): boolean {
        let pos: ClientRect = txtWrap.getBoundingClientRect();
        return (pos.top >= 0 && pos.left >= 0 && pos.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        pos.right <= (window.innerWidth || document.documentElement.clientWidth));
    }

    private getScrollParent(node: Element): Element {
        if (isNOU(node)) {
            return null;
        }
        return (node.scrollHeight > node.clientHeight) ? node : this.getScrollParent(node.parentElement);
    }

    private shiftKeySelect(isTowards: boolean, e: KeyboardEventArgs): void {
        if (this.allowMultiSelection) {
            let focusedNode: Element = this.getFocusedNode();
            let nextNode: Element = isTowards ? this.getNextNode(focusedNode) : this.getPrevNode(focusedNode);
            this.removeHover();
            this.setFocusElement(nextNode);
            this.toggleSelect(nextNode, e, false);
            this.navigateToFocus(!isTowards);
        } else {
            this.navigateNode(isTowards);
        }
    }

    private checkNode(e: KeyboardEventArgs): void {
        let focusedNode: Element = this.getFocusedNode();
        let checkWrap: Element = select('.' + CHECKBOXWRAP, focusedNode);
        let isChecked: boolean = select(' .' + CHECKBOXFRAME, checkWrap).classList.contains(CHECK);
        if (!focusedNode.classList.contains('e-disable')) {
            if (focusedNode.getElementsByClassName("e-checkbox-disabled").length == 0) {
                this.validateCheckNode(checkWrap, isChecked, focusedNode, e);
            }
        }
    }

    private validateCheckNode(
        checkWrap: HTMLElement | Element, isCheck: boolean, li: HTMLElement | Element, e: KeyboardEventArgs | MouseEvent): void {
            let currLi: Element = closest(checkWrap, '.' + LISTITEM);
        this.checkActionNodes = [];
        let ariaState: string = !isCheck ? 'true' : 'false';
        if (!isNOU(ariaState)) {
            checkWrap.setAttribute('aria-checked', ariaState);
        }
        let eventArgs: NodeCheckEventArgs = this.getCheckEvent(currLi, isCheck ? 'uncheck' : 'check', e);
        this.trigger('nodeChecking', eventArgs, (observedArgs: NodeCheckEventArgs) => {
            if (!observedArgs.cancel) {
                this.nodeCheckingAction(checkWrap, isCheck, li, observedArgs, e);
            }
        });
    }

    private nodeCheckingAction(checkWrap: HTMLElement | Element, isCheck: boolean, li: HTMLElement | Element,
                               eventArgs: NodeCheckEventArgs, e: KeyboardEventArgs | MouseEvent): void {
        if (this.checkedElement.indexOf(li.getAttribute('data-uid')) === -1) {
            this.checkedElement.push(li.getAttribute('data-uid'));
            let child: { [key: string]: Object }[] = this.getChildNodes(this.treeData, li.getAttribute('data-uid'));
            (child !== null) ? this.allCheckNode(child, this.checkedElement, null, null, false) : child = null;
        }
        this.changeState(checkWrap, isCheck ? 'uncheck' : 'check', e, true);
        if (this.autoCheck) {
            this.ensureChildCheckState(li);
            this.ensureParentCheckState(closest(closest(li, '.' + PARENTITEM), '.' + LISTITEM));
            let doCheck: boolean;
            if (eventArgs.action === 'check') {
                doCheck = true;
            } else if (eventArgs.action === 'uncheck') {
                doCheck = false;
            }
            this.ensureStateChange(li, doCheck);
        }
        this.allowServerDataBinding = true;
        this.updateServerProperties("check");
        this.allowServerDataBinding = false;
        this.nodeCheckedEvent(checkWrap, isCheck, e);
    }

    /**
     * Update checkedNodes when UI interaction happens before the child node renders in DOM
     */
    private ensureStateChange(li: Element, doCheck? : boolean): void {
        let childElement: Element = select('.' + PARENTITEM, li);
        let parentIndex: string = li.getAttribute('data-uid');
        let mapper: FieldsSettingsModel = this.fields;
        if (this.dataType === 1 && this.autoCheck) {
            let resultData: { [key: string]: Object }[] = <{ [key: string]: Object }[]>new DataManager(this.treeData).executeLocal(
                new Query().where(mapper.parentID, 'equal', parentIndex, true));
            for (let i: number = 0; i < resultData.length; i++) {
                let resultId: string = resultData[i][this.fields.id] ? resultData[i][this.fields.id].toString() : null;
                let isCheck: string = resultData[i][this.fields.isChecked] ? resultData[i][this.fields.isChecked].toString() : null;
                if (this.checkedNodes.indexOf(parentIndex) !== -1 && this.checkedNodes.indexOf(resultId) === -1) {
                    this.checkedNodes.push(resultId);
                    let childItems: { [key: string]: Object }[] = this.getChildNodes(this.treeData, resultId);
                    this.getChildItems(childItems, doCheck);
                    if (this.parentNodeCheck.indexOf(resultId) !== -1) {
                        this.parentNodeCheck.splice(this.parentNodeCheck.indexOf(resultId), 1);
                    }
                } else if (this.checkedNodes.indexOf(parentIndex) === -1 && childElement === null &&
                    this.checkedNodes.indexOf(resultId) !== -1) {
                    this.checkedNodes.splice(this.checkedNodes.indexOf(resultId), 1);
                    if (isCheck === 'true') {
                        this.updateField(this.treeData, this.fields, resultId, 'isChecked', null);
                    }
                    if (this.checkedNodes.indexOf(parentIndex) === -1 && childElement === null ||
                        this.parentNodeCheck.indexOf(resultId) !== -1) {
                        let childNodes: { [key: string]: Object }[] = this.getChildNodes(this.treeData, resultId);
                        this.getChildItems(childNodes, doCheck);
                        if (this.parentNodeCheck.indexOf(resultId) !== -1) {
                            this.parentNodeCheck.splice(this.parentNodeCheck.indexOf(resultId), 1);
                        }
                    }
                } else {
                    let childItems: { [key: string]: Object }[] = this.getChildNodes(this.treeData, resultId);
                    this.getChildItems(childItems, doCheck);
                }
            }
        } else if (this.dataType === 1 && !this.autoCheck) {
            if (!doCheck) {
                let checkedData: { [key: string]: Object }[] = <{ [key: string]: Object }[]>new DataManager(this.treeData).executeLocal(
                    new Query().where(mapper.isChecked, 'equal', true, false));

                for (let i: number = 0; i < checkedData.length; i++) {
                    let id: string = checkedData[i][this.fields.id] ? checkedData[i][this.fields.id].toString() : null;
                    if (this.checkedNodes.indexOf(id) !== -1) {
                        this.checkedNodes.splice(this.checkedNodes.indexOf(id), 1);
                    }
                    this.updateField(this.treeData, this.fields, id, 'isChecked', null);
                }
                this.checkedNodes = [];
            } else {
                for (let i : number = 0; i < this.treeData.length; i++) {
                    let checkedId: string = this.treeData[i][this.fields.id] ? this.treeData[i][this.fields.id].toString() : null;
                    if (this.checkedNodes.indexOf(checkedId) === -1) {
                        this.checkedNodes.push(checkedId);
                    }
                }
            }
        } else {
            let childItems: { [key: string]: Object }[] = this.getChildNodes(this.treeData, parentIndex);
            if (childItems) {
                this.childStateChange(childItems, parentIndex, childElement, doCheck);
            }
        }
    }
    private getChildItems(childItems: { [key: string]: Object }[], doCheck ?: boolean ): void {
        for (let i: number = 0; i < childItems.length; i++) {
            let childId: string = childItems[i][this.fields.id] ? childItems[i][this.fields.id].toString() : null;
            let childIsCheck: string = childItems[i][this.fields.isChecked] ? childItems[i][this.fields.isChecked].toString() :
                null;
            if (this.checkedNodes.indexOf(childId) !== -1 && !doCheck) {
                this.checkedNodes.splice(this.checkedNodes.indexOf(childId), 1);
            }
            if (this.checkedNodes.indexOf(childId) === -1 && doCheck) {
                this.checkedNodes.push(childId);
            }
            if (childIsCheck === 'true' && !doCheck) {
                this.updateField(this.treeData, this.fields, childId, 'isChecked', null);
            }
            let subChildItems : { [key: string]: Object }[] = this.getChildNodes(this.treeData, childId);
            if ( subChildItems.length > 0) {
                this.getChildItems(subChildItems, doCheck);
            }
        }
    }
     /**
      * Update checkedNodes when UI interaction happens before the child node renders in DOM for hierarchical DS
      */
    private childStateChange(childItems: { [key: string]: Object }[], parent: string, childElement: Element, doCheck?: boolean): void {
        for (let i: number = 0; i < childItems.length; i++) {
            let checkedChild: string = childItems[i][this.fields.id] ? childItems[i][this.fields.id].toString() : '';
            let isCheck: string = childItems[i][this.fields.isChecked] ? childItems[i][this.fields.isChecked].toString() : null;
            if (this.autoCheck) {
                if (this.checkedNodes.indexOf(parent) !== -1 && this.checkedNodes.indexOf(checkedChild) === -1) {
                    this.checkedNodes.push(checkedChild);
                    if (this.parentNodeCheck.indexOf(checkedChild) !== -1) {
                        this.parentNodeCheck.splice(this.parentNodeCheck.indexOf(checkedChild), 1);
                    }
                } else if (this.checkedNodes.indexOf(parent) === -1 && this.checkedNodes.indexOf(checkedChild) !== -1 && !doCheck) {
                    this.checkedNodes.splice(this.checkedNodes.indexOf(checkedChild), 1);
                    if (isCheck === 'true') {
                        this.updateField(this.treeData, this.fields, checkedChild, 'isChecked', null);
                    }
                }
            } else if (!this.autoCheck) {
                if (!doCheck) {
                    if (this.checkedNodes.indexOf(checkedChild) !== -1) {
                        this.checkedNodes.splice(this.checkedNodes.indexOf(checkedChild), 1);
                    }
                    this.updateField(this.treeData, this.fields, checkedChild, 'isChecked', null);
                    this.checkedNodes = [];
                } else {
                     if (this.checkedNodes.indexOf(checkedChild) === -1) {
                        this.checkedNodes.push(checkedChild);
                    }
                }
            }
            let subChild: { [key: string]: Object }[] = this.getChildNodes([childItems[i]], checkedChild);
            if (subChild) {
                this.childStateChange(subChild, parent, childElement, doCheck);
            }
        }
    }
    //This method can be used to get all child nodes of a parent by passing the children of a parent along with 'validateCheck' set to false
    private allCheckNode(child: { [key: string]: Object }[], newCheck: string[], checked?: number,
                         childCheck?: number, validateCheck?: boolean): void {
        if (child) {
            for (let length: number = 0; length < child.length; length++) {
                let childId: string = getValue(this.fields.id, child[length]);
                let check: Element = this.element.querySelector('[data-uid="' + childId + '"]');
                //Validates isChecked case while no UI interaction has been performed on the node or it's parent
                if (validateCheck !== false && this.checkedElement.indexOf(childId.toString()) === -1) {
                    if (((check === null && !isNOU(child[length][this.fields.isChecked]) && newCheck.indexOf(childId.toString()) === -1)
                          || childCheck === 0 || checked === 2)) {
                              (child[length][this.fields.isChecked] !== false || checked === 2) ? newCheck.push(childId.toString())
                                                                                                : childCheck = null;
                              childCheck = (child[length][this.fields.isChecked] !== false || checked === 2) ? 0 : null;
                           }
                }
                //Pushes child checked node done thro' UI interaction
                if (newCheck.indexOf(childId.toString()) === -1 && isNOU(checked)) {
                    newCheck.push(childId.toString());
                }
                //Gets if any next level children are available for child nodes
                if (getValue(this.fields.hasChildren, child[length]) === true ||
                    getValue(this.fields.child.toString(), child[length])) {
                        let id: string = getValue(this.fields.id, child[length]);
                        let childId: { [key: string]: Object }[] = this.getChildNodes(this.treeData, id.toString());
                        if (childId) {
                            (isNOU(validateCheck)) ? this.allCheckNode(childId, newCheck, checked, childCheck) :
                                                     this.allCheckNode(childId, newCheck, checked, childCheck, validateCheck);
                            childCheck = null;
                        }
                    }
                childCheck = null;
            }
        }
    }

    private openNode(toBeOpened: boolean, e: KeyboardEventArgs): void {
        let focusedNode: Element = this.getFocusedNode();
        let icon: Element = select('div.' + ICON, focusedNode);
        if (toBeOpened) {
            if (!icon) {
                return;
            } else if (icon.classList.contains(EXPANDABLE)) {
                this.expandAction(focusedNode, icon, e);
            } else {
                this.focusNextNode(focusedNode, true);
            }
        } else {
            if (icon && icon.classList.contains(COLLAPSIBLE)) {
                this.collapseNode(focusedNode, icon, e);
            } else {
                let parentLi: Element = closest(closest(focusedNode, '.' + PARENTITEM), '.' + LISTITEM);
                if (!parentLi) {
                    return;
                } else {
                    if (!parentLi.classList.contains('e-disable')) {
                        this.setFocus(focusedNode, parentLi);
                        this.navigateToFocus(true);
                    }
                }
            }
        }
    }

    private navigateNode(isTowards: boolean): void {
        let focusedNode: Element = this.getFocusedNode();
        this.focusNextNode(focusedNode, isTowards);
    }

    private navigateRootNode(isBackwards: boolean): void {
        let focusedNode: Element = this.getFocusedNode();
        let rootNode: Element = isBackwards ? this.getRootNode() : this.getEndNode();
        if (!rootNode.classList.contains('e-disable')) {
            this.setFocus(focusedNode, rootNode);
            this.navigateToFocus(isBackwards);
        }
    }

    private getFocusedNode(): Element {
        let selectedItem : Element;
        let fNode: Element = select('.' + LISTITEM + '.' + FOCUS, this.element);
        if (isNOU(fNode)) { selectedItem = select('.' + LISTITEM, this.element); }
        return isNOU(fNode) ? (isNOU(selectedItem) ? this.element.firstElementChild : selectedItem) : fNode;
    }

    private focusNextNode(li: Element, isTowards: boolean): void {
        let nextNode: Element = isTowards ? this.getNextNode(li) : this.getPrevNode(li);
        this.setFocus(li, nextNode);
        this.navigateToFocus(!isTowards);
        if (nextNode.classList.contains('e-disable')) {
            let lastChild: HTMLElement  = nextNode.lastChild as HTMLElement;
            if (nextNode.previousSibling == null && nextNode.classList.contains('e-level-1')) {
                this.focusNextNode(nextNode, true);
            } else if (nextNode.nextSibling == null && nextNode.classList.contains('e-node-collapsed')) {
                this.focusNextNode(nextNode, false);
            } else if (nextNode.nextSibling == null && lastChild.classList.contains('e-text-content')) {
                this.focusNextNode(nextNode, false);
            } else {
                this.focusNextNode(nextNode, isTowards);
            }
        }
    }

    private getNextNode(li: Element): Element {
        let index: number = this.liList.indexOf(<HTMLElement>li);
        let nextNode: Element;
        do {
            index++;
            nextNode = this.liList[index];
            if (isNOU(nextNode)) {
                return li;
            }
        }
        while (!isVisible(nextNode));
        return nextNode;
    }

    private getPrevNode(li: Element): Element {
        let index: number = this.liList.indexOf(<HTMLElement>li);
        let prevNode: Element;
        do {
            index--;
            prevNode = this.liList[index];
            if (isNOU(prevNode)) {
                return li;
            }
        }
        while (!isVisible(prevNode));
        return prevNode;
    }

    private getRootNode(): Element {
        let index: number = 0;
        let rootNode: Element;
        do {
            rootNode = this.liList[index];
            index++;
        }
        while (!isVisible(rootNode));
        return rootNode;
    }

    private getEndNode(): Element {
        let index: number = this.liList.length - 1;
        let endNode: Element;
        do {
            endNode = this.liList[index];
            index--;
        }
        while (!isVisible(endNode));
        return endNode;
    }

    private setFocus(preNode: Element, nextNode: Element): void {
        removeClass([preNode], [HOVER, FOCUS]);
        if (!nextNode.classList.contains('e-disable')) {
            addClass([nextNode], [HOVER, FOCUS]);
            this.updateIdAttr(preNode, nextNode);
        }
    }

    private updateIdAttr(preNode: Element, nextNode: Element): void {
        this.element.removeAttribute('aria-activedescendant');
        if (preNode) {
            preNode.removeAttribute('id');
        }
        nextNode.setAttribute('id', this.element.id + '_active');
        this.element.setAttribute('aria-activedescendant', this.element.id + '_active');
    }

    private focusIn(): void {
        if (!this.mouseDownStatus) {
            addClass([this.getFocusedNode()], HOVER);
        }
        this.mouseDownStatus = false;
    }

    private focusOut(): void {
        removeClass([this.getFocusedNode()], HOVER);
    }

    private onMouseOver(e: MouseEvent): void {
        let target: Element = <Element>e.target;
        let classList: DOMTokenList = target.classList;
        let currentLi: Element = closest(target, '.' + LISTITEM);
        if (!currentLi || classList.contains(PARENTITEM) || classList.contains(LISTITEM)) {
            this.removeHover();
            return;
        } else {
            if (currentLi && !currentLi.classList.contains('e-disable')) {
                this.setHover(currentLi);
            }
        }
    }

    private setHover(li: Element): void {
        if (!li.classList.contains(HOVER)) {
            this.removeHover();
            addClass([li], HOVER);
        }
    };

    private onMouseLeave(e: MouseEvent): void {
        this.removeHover();
    }

    private removeHover(): void {
        let hoveredNode: Element[] = selectAll('.' + HOVER, this.element);
        if (hoveredNode && hoveredNode.length) {
            removeClass(hoveredNode, HOVER);
        }
    };

    private getNodeData(currLi: Element, fromDS?: boolean): { [key: string]: Object } {
        if (!isNOU(currLi) && currLi.classList.contains(LISTITEM) &&
            !isNOU(closest(currLi, '.' + CONTROL)) && closest(currLi, '.' + CONTROL).classList.contains(ROOT)) {
            let id: string = currLi.getAttribute('data-uid');
            let text: string = this.getText(currLi, fromDS);
            let pNode: Element = closest(currLi.parentNode, '.' + LISTITEM);
            let pid: string = pNode ? pNode.getAttribute('data-uid') : null;
            let selected: boolean = currLi.classList.contains(ACTIVE);
            let expanded: boolean = (currLi.getAttribute('aria-expanded') === 'true') ? true : false;
            let hasChildren: boolean = (currLi.getAttribute('aria-expanded') === null) ? false : true;
            if (this.isBlazorPlatform) {
                hasChildren = currLi.getAttribute('aria-expanded') === 'true' ? true : (currLi.querySelector('.e-icon-expandable') || currLi.querySelector('.e-icon-collapsible')) != null ? true : false;
            }
            let checked: string = null;
            if (this.showCheckBox) {
                checked = select('.' + CHECKBOXWRAP, currLi).getAttribute('aria-checked');
            }
            return {
                id: id, text: text, parentID: pid, selected: selected, expanded: expanded,
                isChecked: checked, hasChildren: hasChildren
            };
        }
        return { id: '', text: '', parentID: '', selected: false, expanded: false, isChecked: '', hasChildren: false };
    }

    private getText(currLi: Element, fromDS?: boolean): string {
        if (fromDS) {
            let nodeData: { [key: string]: Object } = this.getNodeObject(currLi.getAttribute('data-uid'));
            let level: number = parseFloat(currLi.getAttribute('aria-level'));
            let nodeFields: FieldsSettingsModel = this.getFields(this.fields, level, 1);
            return getValue(nodeFields.text, nodeData);
        }
        return select('.' + LISTTEXT, currLi).textContent;
    }

    private getExpandEvent(currLi: Element, e: MouseEvent | KeyboardEventArgs | TapEventArgs ): NodeExpandEventArgs {
        let nodeData: { [key: string]: Object } = this.getNodeData(currLi);
        return { cancel: false, isInteracted: isNOU(e) ? false : true, node: currLi as HTMLLIElement, nodeData: nodeData , event: e };
    }

    private destroyTemplate(nodeTemplate : string) : void {
        this.clearTemplate(['nodeTemplate']);
     }

    private reRenderNodes(): void {
        this.updateListProp(this.fields);
        resetBlazorTemplate(this.element.id + 'nodeTemplate', 'NodeTemplate');
        if (this.isBlazorPlatform) {
            this.ulElement = this.element.querySelector('.e-list-parent.e-ul');
            this.ulElement.parentElement.removeChild(this.ulElement);
        } else {
            this.element.innerHTML = '';
        }
        if (!isNOU(this.nodeTemplateFn)) {
            this.destroyTemplate(this.nodeTemplate);
        }
        this.setTouchClass();
        this.setProperties({ selectedNodes: [], checkedNodes: [], expandedNodes: [] }, true);
        this.checkedElement = [];
        this.isLoaded = false;
        this.setDataBinding(true);
    }

    private setCssClass(oldClass: string, newClass: string): void {
        if (!isNOU(oldClass) && oldClass !== '') {
            removeClass([this.element], oldClass.split(' '));
        }
        if (!isNOU(newClass) && newClass !== '') {
            addClass([this.element], newClass.split(' '));
        }
    }

    private editingHandler(e: MouseEvent): void {
        let target: Element = <Element>e.target;
        if (!target || target.classList.contains(ROOT) || target.classList.contains(PARENTITEM) ||
            target.classList.contains(LISTITEM) || target.classList.contains(ICON) ||
            target.classList.contains(INPUT) || target.classList.contains(INPUTGROUP)) {
            return;
        } else {
            let liEle: Element = closest(target, '.' + LISTITEM);
            this.createTextbox(liEle, e);
        }
    }

    private createTextbox(liEle: Element, e: MouseEvent | KeyboardEventArgs): void {
        let oldInpEle: HTMLElement = <HTMLElement>select('.' + TREEINPUT, this.element);
        if (oldInpEle) {
            oldInpEle.blur();
        }
        let textEle: Element = select('.' + LISTTEXT, liEle);
        this.updateOldText(liEle);
        let innerEle: HTMLElement = this.createElement('input', { className: TREEINPUT, attrs: { value: this.oldText } });
        let eventArgs: NodeEditEventArgs = this.getEditEvent(liEle, null, innerEle.outerHTML);
        this.trigger('nodeEditing', eventArgs, (observedArgs: NodeEditEventArgs) => {
            if (!observedArgs.cancel) {
                let inpWidth: Number = (<HTMLElement>textEle).offsetWidth + 5;
                let style: string = 'width:' + inpWidth + 'px';
                addClass([liEle], EDITING);
                textEle.innerHTML = eventArgs.innerHtml;
                let inpEle: HTMLElement = <HTMLElement>select('.' + TREEINPUT, textEle);
                this.inputObj = Input.createInput(
                    {
                        element: inpEle as HTMLInputElement,
                        properties: {
                            enableRtl: this.enableRtl,
                        }
                    },
                    this.createElement);
                this.inputObj.container.setAttribute('style', style);
                inpEle.focus();
                let inputEle: HTMLInputElement = <HTMLInputElement>inpEle;
                inputEle.setSelectionRange(0, inputEle.value.length);
                this.wireInputEvents(inpEle);
            }
        });
    }

    private updateOldText(liEle: Element): void {
        let id: string = liEle.getAttribute('data-uid');
        this.editData = this.getNodeObject(id);
        let level: number = parseFloat(liEle.getAttribute('aria-level'));
        this.editFields = this.getFields(this.fields, level, 1);
        this.oldText = getValue(this.editFields.text, this.editData);
    }

    private inputFocusOut(e: MouseEvent): void {
        if (!select('.' + TREEINPUT, this.element)) {
            return;
        }
        let target: Element = <Element>e.target;
        let newText: string = (<HTMLInputElement>target).value;
        let txtEle: HTMLElement = closest(target, '.' + LISTTEXT) as HTMLElement;
        let liEle: Element = closest(target, '.' + LISTITEM);
        detach(this.inputObj.container);
        if (this.fields.dataSource instanceof DataManager && !(this.fields.dataSource.dataSource.offline) && ((this.fields.dataSource as any).adaptorName !== 'BlazorAdaptor')) {
           this.crudOperation('update', null, liEle, newText, null, null, true);
        } else {
            this.appendNewText(liEle, txtEle, newText, true);
        }
    }

    private appendNewText(liEle: Element, txtEle: HTMLElement, newText: string, isInput: boolean): void {
        let eventArgs: NodeEditEventArgs = this.getEditEvent(liEle, newText, null);
        this.trigger('nodeEdited', eventArgs, (observedArgs: NodeEditEventArgs) => {
            newText = observedArgs.cancel ? observedArgs.oldText : observedArgs.newText;
            let newData: { [key: string]: Object } = setValue(this.editFields.text, newText, this.editData);
            if (!isNOU(this.nodeTemplateFn)) {
                txtEle.innerText = '';
                let tempArr: Element[] = this.nodeTemplateFn(newData, undefined, undefined, this.element.id + 'nodeTemplate',
                    this.isStringTemplate);
                tempArr = Array.prototype.slice.call(tempArr);
                append(tempArr, txtEle);
                this.updateBlazorTemplate();
            } else {
                txtEle.innerText = newText;
            }
            if (isInput) {
                removeClass([liEle], EDITING);
                (<HTMLElement>txtEle).focus();
            }
            if (observedArgs.oldText !== newText) {
                this.triggerEvent();
            }
        });
    }

    private getElement(ele: string | Element): Element {
        if (isNOU(ele)) {
            return null;
        } else if (typeof ele === 'string') {
            return this.element.querySelector('[data-uid="' + ele + '"]');
        } else if (typeof ele === 'object') {
            return getElement(ele);
        } else {
            return null;
        }
    }

    private getId(ele: string | Element): string {
        if (isNOU(ele)) {
            return null;
        } else if (typeof ele === 'string') {
            return ele;
        } else if (typeof ele === 'object') {
            return (getElement(ele)).getAttribute('data-uid');
        } else {
            return null;
        }
    }

    private getEditEvent(liEle: Element, newText: string, inpEle: string): NodeEditEventArgs {
        let data: { [key: string]: Object } = this.getNodeData(liEle);
        return { cancel: false, newText: newText, node: liEle as HTMLLIElement, nodeData: data, oldText: this.oldText, innerHtml: inpEle };
    }

    private getNodeObject(id: string): { [key: string]: Object } {
        let childNodes: { [key: string]: Object };
        if (isNOU(id)) {
            return childNodes;
        } else if (this.dataType === 1) {
            for (let i: number = 0, objlen: number = this.treeData.length; i < objlen; i++) {
                let dataId: Object = getValue(this.fields.id, this.treeData[i]);
                if (!isNOU(this.treeData[i]) && !isNOU(dataId) && dataId.toString() === id) {
                    return this.treeData[i];
                }
            }
        } else {
            return this.getChildNodeObject(this.treeData, this.fields, id);
        }
        return childNodes;
    }

    private getChildNodeObject(obj: { [key: string]: Object }[], mapper: FieldsSettingsModel, id: string): { [key: string]: Object } {
        let newList: { [key: string]: Object };
        if (isNOU(obj)) {
            return newList;
        }
        for (let i: number = 0, objlen: number = obj.length; i < objlen; i++) {
            let dataId: Object = getValue(mapper.id, obj[i]);
            if (obj[i] && dataId && dataId.toString() === id) {
                return obj[i];
            } else if (typeof mapper.child === 'string' && !isNOU(getValue(mapper.child, obj[i]))) {
                let childData: Object = getValue(mapper.child, obj[i]);
                newList = this.getChildNodeObject(<{ [key: string]: Object }[]>childData, this.getChildMapper(mapper), id);
                if (newList !== undefined) {
                    break;
                }
            } else if (this.fields.dataSource instanceof DataManager && !isNOU(getValue('child', obj[i]))) {
                let child: string = 'child';
                newList = this.getChildNodeObject(<{ [key: string]: Object }[]>getValue(child, obj[i]), this.getChildMapper(mapper), id);
                if (newList !== undefined) {
                    break;
                }
            }
        }
        return newList;
    }

    private setDragAndDrop(toBind: boolean): void {
        if (toBind && !this.disabled) {
            this.initializeDrag();
        } else {
            this.destroyDrag();
        }
    }
    // tslint:disable-next-line:max-func-body-length
    private initializeDrag(): void {
        let virtualEle: HTMLElement; let proxy : TreeView = this;
        this.dragObj = new Draggable(this.element, {
            enableTailMode: true, enableAutoScroll: true,
            dragArea: this.dragArea,
            dragTarget: '.' + TEXTWRAP,
            helper: (e: { sender: MouseEvent & TouchEvent, element: HTMLElement }) => {
                this.dragTarget = <Element>e.sender.target;
                let dragRoot: Element = closest(this.dragTarget, '.' + ROOT);
                let dragWrap: Element = closest(this.dragTarget, '.' + TEXTWRAP);
                this.dragLi = closest(this.dragTarget, '.' + LISTITEM);
                if (this.fullRowSelect && !dragWrap && this.dragTarget.classList.contains(FULLROW)) {
                    dragWrap = this.dragTarget.nextElementSibling;
                }
                if (!this.dragTarget || !e.element.isSameNode(dragRoot) || !dragWrap ||
                    this.dragTarget.classList.contains(ROOT) || this.dragTarget.classList.contains(PARENTITEM) ||
                    this.dragTarget.classList.contains(LISTITEM) || this.dragLi.classList.contains('e-disable')) {
                    return false;
                }
                let cloneEle: Element = <Element>(dragWrap.cloneNode(true));
                if (isNOU(select('div.' + ICON, cloneEle))) {
                    let icon: HTMLElement = proxy.createElement('div', { className: ICON + ' ' + EXPANDABLE });
                    cloneEle.insertBefore(icon, cloneEle.children[0]);
                }
                let cssClass: string =  DRAGITEM + ' ' + ROOT + ' ' + this.cssClass + ' ' + (this.enableRtl ? RTL : '');
                virtualEle = proxy.createElement('div', { className: cssClass });
                virtualEle.appendChild(cloneEle);
                let nLen: number = this.selectedNodes.length;
                if (nLen > 1 && this.allowMultiSelection && this.dragLi.classList.contains(ACTIVE)) {
                    let cNode: HTMLElement = proxy.createElement('span', { className: DROPCOUNT, innerHTML: '' + nLen });
                    virtualEle.appendChild(cNode);
                }
                document.body.appendChild(virtualEle);
                document.body.style.cursor = '';
                this.dragData = this.getNodeData(this.dragLi);
                return virtualEle;
            },
            dragStart: (e: DragEventArgs & BlazorDragEventArgs) => {
                addClass([this.element], DRAGGING);
                let listItem: Element = closest(e.target, '.e-list-item'); let level: number;
                if (listItem) {
                    level = parseInt(listItem.getAttribute('aria-level'), 10);
                }
                let eventArgs: DragAndDropEventArgs = this.getDragEvent(e.event, this, null, e.target, null, virtualEle, level);
                if (eventArgs.draggedNode.classList.contains(EDITING)) {
                    this.dragObj.intDestroy(e.event);
                    this.dragCancelAction(virtualEle);
                } else {
                    this.trigger('nodeDragStart', eventArgs, (observedArgs: DragAndDropEventArgs & BlazorDragEventArgs) => {
                        if (observedArgs.cancel) {
                            this.dragObj.intDestroy(e.event);
                            this.dragCancelAction(virtualEle);
                        } else {
                            this.dragStartAction = true;
                        }
                        if (isBlazor()) {
                            e.bindEvents(getElement(e.dragElement));
                        }
                    });
                }
            },
            drag: (e: DragEventArgs) => {
                this.dragObj.setProperties({ cursorAt: { top: (!isNOU(e.event.targetTouches) || Browser.isDevice) ? 60 : -20 } });
                this.dragAction(e, virtualEle);
            },
            dragStop: (e: { event: MouseEvent & TouchEvent, element: HTMLElement, target: Element, helper: HTMLElement }) => {
                removeClass([this.element], DRAGGING);
                this.removeVirtualEle();
                let dropTarget: Element = e.target;
                let preventTargetExpand: boolean = false;
                let dropRoot: Element = (closest(dropTarget, '.' + DROPPABLE));
                if (!dropTarget || !dropRoot) {
                    detach(e.helper);
                    document.body.style.cursor = '';
                }
                let listItem: Element = closest(dropTarget, '.e-list-item'); let level: number;
                if (listItem) { level = parseInt(listItem.getAttribute('aria-level'), 10); }
                let eventArgs: DragAndDropEventArgs = this.getDragEvent(e.event, this, dropTarget, <HTMLElement>dropTarget, null,
                                                                        e.helper, level);
                eventArgs.preventTargetExpand = preventTargetExpand;
                if ((this.isBlazorPlatform && this.dragStartAction) || !this.isBlazorPlatform) {
                    this.trigger('nodeDragStop', eventArgs, (observedArgs: DragAndDropEventArgs) => {
                        this.dragParent = observedArgs.draggedParentNode;
                        this.preventExpand = observedArgs.preventTargetExpand;
                        if (observedArgs.cancel) {
                            if (e.helper.parentNode) {
                                detach(e.helper);
                            }
                            document.body.style.cursor = '';
                        }
                        this.dragStartAction = false;
                        if( this.isBlazorPlatform) {
                            this.dropAction(e, true );
                        }
                    });
                }
            }
        });
        this.dropObj = new Droppable(this.element, {
            out: (e: { evt: MouseEvent & TouchEvent, target: Element }) => {
                if (!isNOU(e) && !e.target.classList.contains(SIBLING)) {
                    document.body.style.cursor = 'not-allowed';
                }
            },
            over: (e: { evt: MouseEvent & TouchEvent, target: Element }) => {
                document.body.style.cursor = '';
            },
            drop: (e: DropEventArgs) => {
                if(! this.isBlazorPlatform) {
                    this.dropAction(e);
                }
            }
        });
    }
    private dragCancelAction(virtualEle: HTMLElement): void {
        detach(virtualEle);
        removeClass([this.element], DRAGGING);
        this.dragStartAction = false;
    }
    private dragAction(e: DropEventArgs, virtualEle: HTMLElement): void {
        let dropRoot: Element = closest(e.target, '.' + DROPPABLE);
        let dropWrap: Element = closest(e.target, '.' + TEXTWRAP);
        let icon: Element = select('div.' + ICON, virtualEle);
        removeClass([icon], [DROPIN, DROPNEXT, DROPOUT, NODROP]);
        this.removeVirtualEle();
        document.body.style.cursor = '';
        let classList: DOMTokenList = e.target.classList;
        if (this.fullRowSelect && !dropWrap && !isNOU(classList) && classList.contains(FULLROW)) {
            dropWrap = e.target.nextElementSibling;
        }
        if (dropRoot) {
            let dropLi: Element = closest(e.target, '.' + LISTITEM);
            let checkWrapper: HTMLElement = closest(e.target, '.' + CHECKBOXWRAP) as HTMLElement;
            let collapse: Element = closest(e.target, '.' + COLLAPSIBLE);
            let expand: Element = closest(e.target, '.' + EXPANDABLE);
            if (!dropRoot.classList.contains(ROOT) || (dropWrap &&
                (!dropLi.isSameNode(this.dragLi) && !this.isDescendant(this.dragLi, dropLi)))) {
                    if ((dropLi && e && (!expand && !collapse) && (e.event.offsetY < 7) && !checkWrapper) || (((expand && e.event.offsetY < 5) || (collapse && e.event.offsetX <3)))) {
                        addClass([icon], DROPNEXT);
                        let virEle: Element = this.createElement('div', { className: SIBLING });
                        let index: number = this.fullRowSelect ? (1) : (0);
                        dropLi.insertBefore(virEle, dropLi.children[index]);
                    } else if ((dropLi && e && (!expand && !collapse) && (e.target.offsetHeight > 0 && e.event.offsetY > (e.target.offsetHeight - 10)) && !checkWrapper) || (((expand && e.event.offsetY > 19) || (collapse && e.event.offsetX > 19) ))) {
                        addClass([icon], DROPNEXT);
                        let virEle: Element = this.createElement('div', { className: SIBLING });
                        let index: number = this.fullRowSelect ? (2) : (1);
                        dropLi.insertBefore(virEle, dropLi.children[index]);
                    } else {
                        addClass([icon], DROPIN);
                    }
            } else if (e.target.nodeName === 'LI' && (!dropLi.isSameNode(this.dragLi) && !this.isDescendant(this.dragLi, dropLi))) {
                addClass([icon], DROPNEXT);
                this.renderVirtualEle(e);
            } else if (e.target.classList.contains(SIBLING)) {
                addClass([icon], DROPNEXT);
            } else {
               addClass([icon], DROPOUT);
            }
        } else {
            addClass([icon], NODROP);
            document.body.style.cursor = 'not-allowed';
        }
        let listItem: Element = closest(e.target, '.e-list-item');
        let level: number;
        if (listItem) {
            level = parseInt(listItem.getAttribute('aria-level'), 10);
        }
        let eventArgs: DragAndDropEventArgs = this.getDragEvent(e.event, this, e.target, e.target, null, virtualEle, level);
        if (eventArgs.dropIndicator) {
            removeClass([icon], eventArgs.dropIndicator);
        }
        this.trigger('nodeDragging', eventArgs);
        if (eventArgs.dropIndicator) {
            addClass([icon], eventArgs.dropIndicator);
        }
    }
    // tslint:disable
    private dropAction(e: any,  isBlazorDrop ?: boolean): void {
        let offsetY: number = e.event.offsetY;
        let dropTarget: Element = <Element>e.target;
        let dragObj: TreeView;
        let level: number;
        let drop: boolean = false;
        let dragInstance: EJ2Instance;
        if (!isBlazorDrop) {
            dragInstance = <EJ2Instance>e.dragData.draggable;
        } else {
            dragInstance = <EJ2Instance>e.element;
        }
        for (let i: number = 0; i < dragInstance.ej2_instances.length; i++) {
            if (dragInstance.ej2_instances[i] instanceof TreeView) {
                dragObj = (dragInstance.ej2_instances[i] as TreeView);
                break;
            }
        }
        if (dragObj && dragObj.dragTarget) {
        let dragTarget: Element = dragObj.dragTarget;
        let dragLi: Element = (closest(dragTarget, '.' + LISTITEM));
        let dropLi: Element = (closest(dropTarget, '.' + LISTITEM));
        if (dropLi == null && dropTarget.classList.contains(ROOT)) {
            dropLi = dropTarget.firstElementChild;
        }
        if (!isBlazorDrop) {
            detach(e.droppedElement);
        } else {
            detach(e.helper);
        }
        document.body.style.cursor = '';
        if (!dropLi || dropLi.isSameNode(dragLi) || this.isDescendant(dragLi, dropLi)) {
            if (this.fields.dataSource instanceof DataManager === false) {
                this.preventExpand = false;
            }
            return;
        }
        if (dragObj.allowMultiSelection && dragLi.classList.contains(ACTIVE)) {
            let sNodes: HTMLElement[] = selectAll('.' + ACTIVE, dragObj.element);
            if (e.target.offsetHeight <= 33 && offsetY > e.target.offsetHeight - 10 && offsetY > 6 ) {
                for (let i: number = sNodes.length - 1; i >= 0; i--) {
                    if (dropLi.isSameNode(sNodes[i]) || this.isDescendant(sNodes[i], dropLi)) {
                        continue;
                    }
                    this.appendNode(dropTarget, sNodes[i], dropLi, e, dragObj, offsetY);
                }
            } else {
                for (let i: number = 0; i < sNodes.length; i++) {
                    if (dropLi.isSameNode(sNodes[i]) || this.isDescendant(sNodes[i], dropLi)) {
                        continue;
                    }
                    this.appendNode(dropTarget, sNodes[i], dropLi, e, dragObj, offsetY);
                }
            }
        } else {
            this.appendNode(dropTarget, dragLi, dropLi, e, dragObj, offsetY);
        }
        level = parseInt(dragLi.getAttribute('aria-level'), 10);
        drop = true;
        }
        if (this.fields.dataSource instanceof DataManager === false) {
            this.preventExpand = false;
        }
        if (!isBlazorDrop) {
            this.trigger('nodeDropped', this.getDragEvent(e.event, dragObj, dropTarget, e.target, <HTMLLIElement>e.dragData.draggedElement,
                null, level, drop));
        } else {
            this.trigger('nodeDropped', this.getDragEvent(e.event, dragObj, dropTarget, e.target, <HTMLLIElement>e.element,
                null, level, drop));
        }
        this.triggerEvent();
    }

    private appendNode(dropTarget: Element, dragLi: Element, dropLi: Element, e: DropEventArgs, dragObj: TreeView, offsetY: number): void {
        let checkWrapper: HTMLElement = closest(dropTarget, '.' + CHECKBOXWRAP) as HTMLElement;
        let collapse = closest(e.target, '.' + COLLAPSIBLE);
        let expand = closest(e.target, '.' + EXPANDABLE);
        if (!dragLi.classList.contains('e-disable') && !checkWrapper && ((expand && e.event.offsetY  < 5) || (collapse && e.event.offsetX < 3) || (expand && e.event.offsetY > 19) || (collapse && e.event.offsetX > 19) || (!expand && !collapse))) {
                if (dropTarget.nodeName === 'LI') {
                    this.dropAsSiblingNode(dragLi, dropLi, e, dragObj);
                }
                else if (dropTarget.firstElementChild && dropTarget.classList.contains(ROOT)) {
                    if (dropTarget.firstElementChild.nodeName === 'UL') {
                        this.dropAsSiblingNode(dragLi, dropLi, e, dragObj);
                    } 
                }
                else if ((dropTarget.classList.contains('e-icon-collapsible')) || (dropTarget.classList.contains('e-icon-expandable'))){
                    this.dropAsSiblingNode(dragLi, dropLi, e, dragObj);
                }
            else {
                this.dropAsChildNode(dragLi, dropLi, dragObj, null, e, offsetY);
            }
        }
        else {
            this.dropAsChildNode(dragLi, dropLi, dragObj, null, e, offsetY, true);
        }
    }

    private dropAsSiblingNode(dragLi: Element, dropLi: Element, e: DropEventArgs, dragObj: TreeView): void {
        let dropUl: Element = closest(dropLi, '.' + PARENTITEM);
        let dragParentUl: Element = closest(dragLi, '.' + PARENTITEM);
        let dragParentLi: Element = closest(dragParentUl, '.' + LISTITEM);
        let pre: boolean;
        if (e.target.offsetHeight > 0 && e.event.offsetY > e.target.offsetHeight - 2) {
            pre = false;
        } else if (e.event.offsetY < 2) {
            pre = true;
        } else if (e.target.classList.contains('e-icon-expandable') || (e.target.classList.contains('e-icon-collapsible'))) {
            if ((e.event.offsetY < 5) || (e.event.offsetX < 3)) {
                pre = true;
            } else if ((e.event.offsetY > 15) || (e.event.offsetX > 17)) {
                pre = false;
            }
        }
        if ((e.target.classList.contains('e-icon-expandable')) || (e.target.classList.contains('e-icon-collapsible'))) {
            let target:Element = e.target.closest('li');
            dropUl.insertBefore(dragLi, pre ? target : target.nextElementSibling);
        }
        else {
            dropUl.insertBefore(dragLi, pre ? e.target : e.target.nextElementSibling);
        }
        this.moveData(dragLi, dropLi, dropUl, pre, dragObj);
        this.updateElement(dragParentUl, dragParentLi);
        this.updateAriaLevel(dragLi);
        if (dragObj.element.id === this.element.id) {
            this.updateList();
        } else {
            dragObj.updateInstance();
            this.updateInstance();
        }
    }

    private dropAsChildNode(dragLi: Element, dropLi: Element, dragObj: TreeView, index?: number, e?: DropEventArgs, pos?: number, isCheck?: boolean): void {
        let dragParentUl: Element = closest(dragLi, '.' + PARENTITEM);
        let dragParentLi: Element = closest(dragParentUl, '.' + LISTITEM);
        let dropParentUl: Element  = closest(dropLi, '.' + PARENTITEM);
        if (e && (pos < 7) && !isCheck) {
            dropParentUl.insertBefore(dragLi, dropLi);
            this.moveData(dragLi, dropLi, dropParentUl, true, dragObj);
        } else if (e && (e.target.offsetHeight > 0 && pos > (e.target.offsetHeight - 10)) && !isCheck) {
            dropParentUl.insertBefore(dragLi, dropLi.nextElementSibling);
            this.moveData(dragLi, dropLi, dropParentUl, false, dragObj);
        } else {
            let dropUl: Element = this.expandParent(dropLi);
            let childLi: Element = <Element>dropUl.childNodes[index];
            dropUl.insertBefore(dragLi, childLi);
            this.moveData(dragLi, childLi, dropUl, true, dragObj);
        }
        this.updateElement(dragParentUl, dragParentLi);
        this.updateAriaLevel(dragLi);
        if (dragObj.element.id === this.element.id) {
            this.updateList();
        } else {
            dragObj.updateInstance();
            this.updateInstance();
        }
    }

    private moveData(dragLi: Element, dropLi: Element, dropUl: Element, pre: boolean, dragObj: TreeView): void {
        let dropParentLi: Element = closest(dropUl, '.' + LISTITEM);
        let id: string = this.getId(dragLi);
        let removedData: { [key: string]: Object }[] = dragObj.updateChildField(dragObj.treeData, dragObj.fields, id, null, null, true);
        let refId: string = this.getId(dropLi);
        let index: number = this.getDataPos(this.treeData, this.fields, refId);
        let parentId: string = this.getId(dropParentLi);
        if (this.dataType === 1) {
            this.updateField(this.treeData, this.fields, parentId, 'hasChildren', true);
            let pos: number = isNOU(index) ? this.treeData.length : (pre ? index : index + 1);
            if (isNOU(parentId) && !this.hasPid) {
                delete removedData[0][this.fields.parentID];
            } else {
                let currPid : string | number = this.isNumberTypeId ? parseFloat(parentId) : parentId;
                setValue(this.fields.parentID, currPid, removedData[0]);
            }
            this.treeData.splice(pos, 0, removedData[0]);
            if (dragObj.element.id !== this.element.id) {
                let childData: { [key: string]: Object }[] = dragObj.removeChildNodes(id);
                pos++;
                for (let i: number = 0, len: number = childData.length; i < len; i++) {
                    this.treeData.splice(pos, 0, childData[i]);
                    pos++;
                }
                dragObj.groupedData = dragObj.getGroupedData(dragObj.treeData, dragObj.fields.parentID);
            }
            this.groupedData = this.getGroupedData(this.treeData, this.fields.parentID);
        } else {
            this.addChildData(this.treeData, this.fields, parentId, removedData, pre ? index : index + 1);
        }
    }

    private expandParent(dropLi: Element): Element {
        let dropIcon: Element = select('div.' + ICON, dropLi);
        if (dropIcon && dropIcon.classList.contains(EXPANDABLE) && this.preventExpand !== true) {
            this.expandAction(dropLi, dropIcon, null);
        }
        let dropUl: Element = select('.' + PARENTITEM, dropLi);
        if (this.preventExpand === true && !dropUl && dropIcon) {
            this.renderChildNodes(dropLi);
        }
        dropUl = select('.' + PARENTITEM, dropLi);
        if (!isNOU(dropUl) && this.preventExpand === true) {
            (dropUl as HTMLElement).style.display = 'none';
        }
        if (!isNOU(dropUl) && this.preventExpand === false) {
            (dropUl as HTMLElement).style.display = 'block';
        }
        if (isNOU(dropUl) && this.preventExpand === true) {
            if (isNOU(dropIcon)) {
                ListBase.generateIcon(this.createElement, dropLi as HTMLElement, EXPANDABLE, this.listBaseOption);
            }
            let icon: Element = select('div.' + ICON, dropLi);
            if (icon) {
            icon.classList.add('e-icon-expandable');
            }
            dropUl = ListBase.generateUL(this.createElement, [], null,  this.listBaseOption);
            dropLi.appendChild(dropUl);
            if (icon) {
            removeClass([icon], COLLAPSIBLE);
            } else {
            ListBase.generateIcon(this.createElement, dropLi as HTMLElement, EXPANDABLE, this.listBaseOption);
            }
            dropLi.setAttribute('aria-expanded', 'false');
            (dropUl as HTMLElement).style.display = 'none';
        }
        if (isNOU(dropUl)) {
            this.trigger('nodeExpanding', this.getExpandEvent(dropLi, null));
            if (isNOU(dropIcon)) {
            ListBase.generateIcon(this.createElement, dropLi as HTMLElement, COLLAPSIBLE, this.listBaseOption);
            }
            let icon: Element = select('div.' + ICON, dropLi);
            if (icon) {
            removeClass([icon], EXPANDABLE);
            } else {
            ListBase.generateIcon(this.createElement, dropLi as HTMLElement, COLLAPSIBLE, this.listBaseOption);
            icon = select('div.' + ICON, dropLi);
            removeClass([icon], EXPANDABLE);
            }
            dropUl = ListBase.generateUL(this.createElement, [], null, this.listBaseOption);
            dropLi.appendChild(dropUl);
            this.addExpand(dropLi);
            this.trigger('nodeExpanded', this.getExpandEvent(dropLi, null));
        }
        return dropUl;
    }

    private updateElement(dragParentUl: Element, dragParentLi: Element): void {
        if (dragParentLi && dragParentUl.childElementCount === 0) {
            let dragIcon: Element = select('div.' + ICON, dragParentLi);
            detach(dragParentUl);
            detach(dragIcon);
            let parentId: string = this.getId(dragParentLi);
            this.updateField(this.treeData, this.fields, parentId, 'hasChildren', false);
            this.removeExpand(dragParentLi, true);
        }
    }

    private updateAriaLevel(dragLi: Element): void {
        let level: number = this.parents(dragLi, '.' + PARENTITEM).length;
        dragLi.setAttribute('aria-level', '' + level);
        this.updateChildAriaLevel(select('.' + PARENTITEM, dragLi), level + 1);
    }

    private updateChildAriaLevel(element: Element, level: number): void {
        if (!isNOU(element)) {
            let cNodes: Element[] = <NodeListOf<Element> & Element[]>element.childNodes;
            for (let i: number = 0, len: number = cNodes.length; i < len; i++) {
                let liEle: Element = cNodes[i];
                liEle.setAttribute('aria-level', '' + level);
                this.updateChildAriaLevel(select('.' + PARENTITEM, liEle), level + 1);
            }
        }
    }

    private renderVirtualEle(e: DragEventArgs): void {
        let pre: boolean;
        if (e.event.offsetY > e.target.offsetHeight - 2) {
            pre = false;
        } else if (e.event.offsetY < 2) {
            pre = true;
        }
        let virEle: Element = this.createElement('div', { className: SIBLING });
        let index: number = this.fullRowSelect ? (pre ? 1 : 2) : (pre ? 0 : 1);
        e.target.insertBefore(virEle, e.target.children[index]);
    }

    private removeVirtualEle(): void {
        let sibEle: Element = select('.' + SIBLING);
        if (sibEle) {
            detach(sibEle);
        }
    }

    private destroyDrag(): void {
        if (this.dragObj && this.dropObj) {
            this.dragObj.destroy();
            this.dropObj.destroy();
        }
    }

    private getDragEvent(event: MouseEvent & TouchEvent, obj: TreeView, dropTarget: Element, target: HTMLElement,
                         dragNode?: HTMLLIElement, cloneEle?: HTMLElement, level?: number, drop?: boolean): DragAndDropEventArgs {
            let dropLi: Element = dropTarget ? closest(dropTarget, '.' + LISTITEM) : null;
            let dropData: { [key: string]: Object } = dropLi ? this.getNodeData(dropLi) : null;
            let draggedNode: HTMLLIElement = obj ? obj.dragLi as HTMLLIElement : dragNode;
            let draggedNodeData: { [key: string]: Object } = obj ? obj.dragData : null;
            let newParent: Element[] = dropTarget ? this.parents(dropTarget, '.' + LISTITEM) : null;
            let dragLiParent: Element = obj.dragLi.parentElement;
            let dragParent: Element = obj.dragLi ? closest(dragLiParent, '.' + LISTITEM) : null;
            let targetParent: Element = null;
            let indexValue: number = null;
            let iconCss: string[] = [DROPNEXT, DROPIN, DROPOUT, NODROP];
            let iconClass: string = null;
            let node: Element = (drop === true) ? draggedNode : dropLi;
            let index: Element = node ? closest(node, '.e-list-parent') : null;
            let i: number = 0;
            dragParent = (obj.dragLi && dragParent === null) ? closest(dragLiParent, '.' + ROOT) : dragParent;
            dragParent = (drop === true) ? this.dragParent : dragParent;
            if (cloneEle) {
                while (i < 4) {
                    if (select('.' + ICON, cloneEle).classList.contains(iconCss[i])) {
                        iconClass = iconCss[i];
                        break;
                    }
                    i++;
                }
            }
            if (index) {
                let dropTar: number = 0;
                for (i = 0; i < index.childElementCount; i++) {
                    dropTar = (drop !== true && index.children[i] === draggedNode && dropLi !== draggedNode) ? ++dropTar : dropTar;
                    if ((drop !== true && index.children[i].classList.contains('e-hover'))) {
                        indexValue = (event.offsetY >= 23) ? i + 1 : i;
                        break;
                    } else if (index.children[i] === node) {
                        indexValue = (event.offsetY >= 23) ? i : i;
                        break;
                    }
                }
                indexValue = (dropTar !== 0) ? --indexValue : indexValue;
            }
            if (dropTarget) {
                if (newParent.length === 0) {
                    targetParent = null;
                } else if (dropTarget.classList.contains(LISTITEM)) {
                    targetParent = newParent[0];
                } else {
                    targetParent = newParent[1];
                }
            }
            if (dropLi === draggedNode) {
                targetParent = dropLi;
            }
            if ( dropTarget && target.offsetHeight <= 33 && event.offsetY < target.offsetHeight - 10 && event.offsetY > 6) {
                targetParent = dropLi;
                if (drop !== true) {
                    level = ++level;
                    let parent: Element = targetParent ? select('.e-list-parent', targetParent) : null;
                    indexValue = (parent) ? parent.children.length : 0;
                    if (!(this.fields.dataSource instanceof DataManager) && parent === null && targetParent) {
                        let parent: { [key: string]: Object; }[] = targetParent.hasAttribute('data-uid') ?
                        this.getChildNodes(this.fields.dataSource, targetParent.getAttribute('data-uid').toString()) : null;
                        indexValue = (parent) ? parent.length : 0;
                    }
                }
            }
            return {
                cancel: false,
                clonedNode: cloneEle,
                event: event,
                draggedNode: draggedNode,
                draggedNodeData: draggedNodeData,
                droppedNode: dropLi as HTMLLIElement,
                droppedNodeData: dropData,
                dropIndex: indexValue,
                dropLevel: level,
                draggedParentNode: dragParent,
                dropTarget: targetParent,
                dropIndicator: iconClass,
                target: target,
            };
        }

    private addFullRow(toAdd: boolean): void {
        let len: number = this.liList.length;
        if (toAdd) {
            for (let i: number = 0; i < len; i++) {
                this.createFullRow(this.liList[i]);
            }
        } else {
            for (let i: number = 0; i < len; i++) {
                let rowDiv: Element = select('.' + FULLROW, this.liList[i]);
                detach(rowDiv);
            }
        }
    }

    private createFullRow(item: HTMLElement): void {
        let rowDiv: Element = this.createElement('div', { className: FULLROW });
        item.insertBefore(rowDiv, item.childNodes[0]);
    }

    private addMultiSelect(toAdd: boolean): void {
        if (toAdd) {
            let liEles: Element[] = selectAll('.' + LISTITEM + ':not([aria-selected="true"])', this.element);
            for (let ele of liEles) {
                ele.setAttribute('aria-selected', 'false');
            }
        } else {
            let liEles: Element[] = selectAll('.' + LISTITEM + '[aria-selected="false"]', this.element);
            for (let ele of liEles) {
                ele.removeAttribute('aria-selected');
            }
        }
    }

    private collapseByLevel(element: Element, level: number, excludeHiddenNodes: boolean): void {
        if (level > 0 && !isNOU(element)) {
            let cNodes: Element[] = this.getVisibleNodes(excludeHiddenNodes, <NodeListOf<Element> & Element[]>element.childNodes);
            for (let i: number = 0, len: number = cNodes.length; i < len; i++) {
                let liEle: Element = cNodes[i];
                let icon: Element = select('.' + COLLAPSIBLE, select('.' + TEXTWRAP, liEle));
                if (!isNOU(icon)) {
                    this.collapseNode(liEle, icon, null);
                }
                this.collapseByLevel(select('.' + PARENTITEM, liEle), level - 1, excludeHiddenNodes);
            }
        }
    }

    private collapseAllNodes(excludeHiddenNodes: boolean): void {
        let cIcons: Element[] = this.getVisibleNodes(excludeHiddenNodes, selectAll('.' + COLLAPSIBLE, this.element));
        for (let i: number = 0, len: number = cIcons.length; i < len; i++) {
            let icon: Element = cIcons[i];
            let liEle: Element = closest(icon, '.' + LISTITEM);
            this.collapseNode(liEle, icon, null);
        }
    }

    private expandByLevel(element: Element, level: number, excludeHiddenNodes: boolean): void {
        if (level > 0 && !isNOU(element)) {
            let eNodes: Element[] = this.getVisibleNodes(excludeHiddenNodes, <NodeListOf<Element> & Element[]>element.childNodes);
            for (let i: number = 0, len: number = eNodes.length; i < len; i++) {
                let liEle: Element = eNodes[i];
                let icon: Element = select('.' + EXPANDABLE, select('.' + TEXTWRAP, liEle));
                if (!isNOU(icon)) {
                    this.expandAction(liEle, icon, null);
                }
                this.expandByLevel(select('.' + PARENTITEM, liEle), level - 1, excludeHiddenNodes);
            }
        }
    }

    private expandAllNodes(excludeHiddenNodes: boolean): void {
        let eIcons: Element[] = this.getVisibleNodes(excludeHiddenNodes, selectAll('.' + EXPANDABLE, this.element));
        for (let i: number = 0, len: number = eIcons.length; i < len; i++) {
            let icon: Element = eIcons[i];
            let liEle: Element = closest(icon, '.' + LISTITEM);
            this.expandAction(liEle, icon, null, true);
        }
    }

    private getVisibleNodes(excludeHiddenNodes: boolean, nodes: Element[]): Element[] {
        let vNodes: Element[] = Array.prototype.slice.call(nodes);
        if (excludeHiddenNodes) {
            for (let i: number = 0; i < vNodes.length; i++) {
                if (!isVisible(vNodes[i])) {
                    vNodes.splice(i, 1);
                    i--;
                }
            }
        }
        return vNodes;
    }

    private removeNode(node: Element): void {
        let dragParentUl: Element = closest(node, '.' + PARENTITEM);
        let dragParentLi: Element = closest(dragParentUl, '.' + LISTITEM);
        detach(node);
        this.updateElement(dragParentUl, dragParentLi);
        this.updateInstance();
        this.removeData(node);
    }

    private updateInstance(): void {
        this.updateList();
        this.updateSelectedNodes();
        this.updateExpandedNodes();
        this.allowServerDataBinding = false;
        this.updateServerProperties("expand");
        this.updateServerProperties("check");
        this.updateServerProperties("select");
        this.allowServerDataBinding = true;
    }

    private updateServerProperties(action: string): void {
        if(this.isBlazorPlatform ) {
            if(action == "expand") {
                this.isBlazorExpandedNodes = this.expandedNodes;
                this.setProperties({ expandedNodes:  [] }, true);
            }
            else if(action == "check") {
                this.setProperties({ checkedNodes: this.checkedNodes }, true);                             
            }
            else {
                this.setProperties({ selectedNodes: this.selectedNodes }, true);                
            }
        }
    }

    private updateList(): void {
        this.liList = Array.prototype.slice.call(selectAll('.' + LISTITEM, this.element));
    }

    private updateSelectedNodes(): void {
        if (!this.isBlazorPlatform || (this.isBlazorPlatform && !this.initialRender)) {
            this.setProperties({ selectedNodes: [] }, true);
            let sNodes: HTMLElement[] = selectAll('.' + ACTIVE, this.element);
            this.selectGivenNodes(sNodes);
        }
        else if(this.isBlazorPlatform && this.initialRender) {
            let sNodes: HTMLElement[] = selectAll('.' + ACTIVE, this.element);
            for(let a: number = 0; a < sNodes.length; a++)
            {
                let id : string = sNodes[a].getAttribute("data-uid").toString();
                if (!isNOU(id) && this.selectedNodes.indexOf(id) === -1) {
                    this.selectedNodes.push(id);
                }
            }           
        }
    }

    private updateExpandedNodes(): void {
        if (!this.isBlazorPlatform || (this.isBlazorPlatform && !this.initialRender)) {
            this.setProperties({ expandedNodes: [] }, true);
            let eNodes: Element[] = selectAll('[aria-expanded="true"]', this.element);
            for (let i: number = 0, len: number = eNodes.length; i < len; i++) {
                this.addExpand(eNodes[i]);
            }
        }
        else if(this.isBlazorPlatform && this.initialRender) {
            let eNodes: Element[] = selectAll('[aria-expanded="true"]', this.element);
            for(let a: number = 0; a < eNodes.length; a++)
            {
                let id : string = eNodes[a].getAttribute("data-uid").toString();
                if (!isNOU(id) && this.expandedNodes.indexOf(id) === -1) {
                    this.expandedNodes.push(id);
                }
            }
        }
    }

    private removeData(node: Element): void {
        if (this.dataType === 1) {
            let dm: DataManager = new DataManager(this.treeData);
            let id: string = this.getId(node);
            let data: {[key: string]: string | number} = {};
            let newId : string | number = this.isNumberTypeId ? parseFloat(id) : id;
            data[this.fields.id] = newId;
            dm.remove(this.fields.id, data);
            this.removeChildNodes(id);
        } else {
            let id: string = this.getId(node);
            this.updateChildField(this.treeData, this.fields, id, null, null, true);
        }
    }

    private removeChildNodes(parentId: string): { [key: string]: Object }[] {
        let cNodes: { [key: string]: Object }[] = this.getChildGroup(this.groupedData, parentId, false);
        let childData: { [key: string]: Object }[] = [];
        if (cNodes) {
            for (let i: number = 0, len: number = cNodes.length; i < len; i++) {
                let dm: DataManager = new DataManager(this.treeData);
                let id: string = getValue(this.fields.id, cNodes[i]).toString();
                let data: {[key: string]: string | number} = {};
                let currId : string | number = this.isNumberTypeId ? parseFloat(id) : id;
                data[this.fields.id] = currId;
                let nodeData: {[key: string]: string }[] = <{[key: string]: string }[]>dm.remove(this.fields.id, data);
                childData.push(nodeData[0]);
                this.removeChildNodes(id);
            }
        }
        return childData;
    }

    private doGivenAction(nodes: string[] | Element[], selector: string, toExpand: boolean): void {
        for (let i: number = 0, len: number = nodes.length; i < len; i++) {
            let liEle: Element = this.getElement(nodes[i]);
            if (isNOU(liEle)) {
                continue;
            }
            let icon: Element = select('.' + selector, select('.' + TEXTWRAP, liEle));
            if (!isNOU(icon)) {
                toExpand ? this.expandAction(liEle, icon, null) : this.collapseNode(liEle, icon, null);
            }
        }
    }

    private addGivenNodes(nodes: { [key: string]: Object }[], dropLi: Element, index: number, isRemote?: boolean, dropEle?: Element): void {
        if (nodes.length === 0) {
            return;
        }
        let sNodes: { [key: string]: Object }[] = this.getSortedData(nodes);
        let level: number = dropLi ? parseFloat(dropLi.getAttribute('aria-level')) + 1 : 1;
        if (isRemote) {
            this.updateMapper(level);
        }
        let li: HTMLElement[] = ListBase.createListItemFromJson(this.createElement, sNodes, this.listBaseOption, level);
        let dropUl: Element;
        if (!dropEle) {
            dropUl = dropLi ? this.expandParent(dropLi) : select('.' + PARENTITEM, this.element);
        } else {
            dropUl = dropEle;
        }
        let refNode: Node = dropUl.childNodes[index];
        for (let i: number = 0; i < li.length; i++) {
            dropUl.insertBefore(li[i], refNode);
        }
        if (this.nodeTemplate && this.isBlazorPlatform && !this.isStringTemplate) {
            this.updateBlazorTemplate();
        }
        let id: string = this.getId(dropLi);
        if (this.dataType === 1) {
            this.updateField(this.treeData, this.fields, id, 'hasChildren', true);
            let refId: string = this.getId(refNode as Element);
            let pos: number = isNOU(refId) ? this.treeData.length : this.getDataPos(this.treeData, this.fields, refId);
            for (let j: number = 0; j < nodes.length; j++) {
                if (!isNOU(id)) {
                    let currId : string | number = this.isNumberTypeId ? parseFloat(id) : id;
                    setValue(this.fields.parentID, currId, nodes[j]);
                }
                this.treeData.splice(pos, 0, nodes[j]);
                pos++;
            }
        } else {
            this.addChildData(this.treeData, this.fields, id, nodes, index);
        }
        this.finalizeNode(dropUl);
    }

    private updateMapper(level: number): void {
        let mapper: FieldsSettingsModel = (level === 1) ? this.fields : this.getChildFields(this.fields, level - 1, 1);
        this.updateListProp(mapper);
    }

    private updateListProp(mapper: FieldsSettingsModel): void {
        let prop: FieldsSettingsModel = this.getActualProperties(mapper);
        this.listBaseOption.fields = prop as FieldsMapping;
        this.listBaseOption.fields.url = prop.hasOwnProperty('navigateUrl') ? prop.navigateUrl : 'navigateUrl';
    }

    private getDataPos(obj: { [key: string]: Object }[], mapper: FieldsSettingsModel, id: string): number {
        let pos: number = null;
        for (let i: number = 0, objlen: number = obj.length; i < objlen; i++) {
            let nodeId: Object = getValue(mapper.id, obj[i]);
            if (obj[i] && nodeId && nodeId.toString() === id) {
                return i;
            } else if (typeof mapper.child === 'string' && !isNOU(getValue(mapper.child, obj[i]))) {
                let data: { [key: string]: Object }[] = <{ [key: string]: Object }[]>getValue(mapper.child, obj[i]);
                pos = this.getDataPos(data, this.getChildMapper(mapper), id);
                if (pos !== null) {
                    break;
                }
            } else if (this.fields.dataSource instanceof DataManager && !isNOU(getValue('child', obj[i]))) {
                let items: { [key: string]: Object }[] = <{ [key: string]: Object }[]>getValue('child', obj[i]);
                pos = this.getDataPos(items, this.getChildMapper(mapper), id);
                if (pos !== null) {
                    break;
                }
            }
        }
        return pos;
    }

    private addChildData(
        obj: { [key: string]: Object }[], mapper: FieldsSettingsModel, id: string, data: { [key: string]: Object }[],
        index: number): boolean {
        let updated: boolean;
        if (isNOU(id)) {
            index = isNOU(index) ? obj.length : index;
            for (let k: number = 0, len: number = data.length; k < len; k++) {
                obj.splice(index, 0, data[k]);
                index++;
            }
            return updated;
        }
        for (let i: number = 0, objlen: number = obj.length; i < objlen; i++) {
            let nodeId: Object = getValue(mapper.id, obj[i]);
            if (obj[i] && nodeId && nodeId.toString() === id) {
                if ((typeof mapper.child === 'string' && obj[i].hasOwnProperty(mapper.child)) ||
                (this.fields.dataSource instanceof DataManager && obj[i].hasOwnProperty('child'))) {
                    let key: string = (typeof mapper.child === 'string') ? mapper.child : 'child';
                    let childData: { [key: string]: Object }[] = <{ [key: string]: Object }[]>getValue(key, obj[i]);
                    if (isNOU(childData)) {
                        childData = [];
                    }
                    index = isNOU(index) ? childData.length : index;
                    for (let k: number = 0, len: number = data.length; k < len; k++) {
                        childData.splice(index, 0, data[k]);
                        index++;
                    }
                } else {
                    let key: string = (typeof mapper.child === 'string') ? mapper.child : 'child';
                    obj[i][key] = data;
                }
                return true;
            } else if (typeof mapper.child === 'string' && !isNOU(getValue(mapper.child, obj[i]))) {
                let childObj: { [key: string]: Object }[] = <{ [key: string]: Object }[]>getValue(mapper.child, obj[i]);
                updated = this.addChildData(childObj, this.getChildMapper(mapper), id, data, index);
                if (updated !== undefined) {
                    break;
                }
            } else if (this.fields.dataSource instanceof DataManager && !isNOU(getValue('child', obj[i]))) {
                let childData: { [key: string]: Object }[] = <{ [key: string]: Object }[]>getValue('child', obj[i]);
                updated = this.addChildData(childData, this.getChildMapper(mapper), id, data, index);
                if (updated !== undefined) {
                    break;
                }
            }
        }
        return updated;
    }

    private doDisableAction(nodes: string[] | Element[]): void {
        let validNodes: string[] = this.nodeType(nodes);
        let validID: { [key: string]: Object }[]  = this.checkValidId(validNodes);
        this.validArr = [];
        for (let i: number = 0, len: number = validID.length; i < len; i++) {
            let id: string = validID[i][this.fields.id].toString();
              if (id && this.disableNode.indexOf(id) === -1) {
                this.disableNode.push(id);
              }
            let liEle: Element = this.getElement(id);
            if (liEle) {
                liEle.setAttribute('aria-disabled', 'true');
                addClass([liEle], DISABLE);
            }
        }
    }

    private doEnableAction(nodes: string[] | Element[]): void {
        let strNodes: string[] = this.nodeType(nodes);
        for (let i: number = 0, len: number = strNodes.length; i < len; i++) {
            let liEle: Element = this.getElement(strNodes[i]);
            let id: string = strNodes[i];
            if (id && this.disableNode.indexOf(id) !== -1) {
                this.disableNode.splice(this.disableNode.indexOf(id), 1);
            }
            if (liEle) {
                liEle.removeAttribute('aria-disabled');
                removeClass([liEle], DISABLE);
            }
        }
    }

    private nodeType(nodes: string[] | Element[]): string[] {
        let validID: string[] = [];
        for (let i: number = 0, len: number = nodes.length; i < len; i++) {
            let id: string;
            if (typeof nodes[i] == "string") {
                id = (nodes[i]) ? nodes[i].toString() : null;
            } else if (typeof nodes[i] === "object") {
                id =  nodes[i] ? (nodes[i] as Element).getAttribute("data-uid").toString() : null;
            }
            if (validID.indexOf(id) == -1) {
                validID.push(id);
            }
        }
        return validID;
    }

    private checkValidId( node: string[]) : { [key: string]: Object }[] {
        if (this.dataType === 1) {
            this.validArr = this.treeData.filter((data: { [key: string]: Object }) => {
                return node.indexOf(data[this.fields.id] ? data[this.fields.id].toString(): null) !== -1 
            });
        } else if (this.dataType === 2) {
           for (let k: number =0; k < this.treeData.length; k++) {
               let id: string = this.treeData[k][this.fields.id] ?  this.treeData[k][this.fields.id].toString(): null;
               if (node.indexOf(id) !== -1) {
                   this.validArr.push(this.treeData[k]);
               }
               let childItems: { [key: string]: Object }[] = getValue(this.fields.child.toString(), this.treeData[k]);
               if (childItems) {
                  this.filterNestedChild(childItems, node);
               }
           }  
        }
        return this.validArr;
    }
    
    private filterNestedChild(treeData: { [key: string]: Object }[], nodes: string[]): void {
        for (let k: number = 0; k < treeData.length; k++) {
            let id: string = treeData[k][this.fields.id] ?  treeData[k][this.fields.id].toString(): null;
            if (nodes.indexOf(id) !== -1) {
                this.validArr.push(treeData[k]);
            }
            let childItems: { [key: string]: Object }[] = getValue(this.fields.child.toString(), treeData[k]);
            if (childItems) {
                this.filterNestedChild(childItems, nodes)
            }
        }
    }
      
    private setTouchClass(): void {
        let ele: Element = closest(this.element, '.' + BIGGER);
        this.touchClass = isNOU(ele) ? '' : SMALL;
    }

    private updatePersistProp(): void {
        this.removeField(this.treeData, this.fields, ['selected', 'expanded']);
        let sleNodes: string[] = this.selectedNodes;
        for (let l: number = 0, slelen: number = sleNodes.length; l < slelen; l++) {
            this.updateField(this.treeData, this.fields, sleNodes[l], 'selected', true);
        }
        let enodes: string[] = this.expandedNodes;
        if (this.isBlazorPlatform) {
            enodes = this.isBlazorExpandedNodes;
        }
        for (let k: number = 0, nodelen: number = enodes.length; k < nodelen; k++) {
            this.updateField(this.treeData, this.fields, enodes[k], 'expanded', true);
        }
        if (this.showCheckBox) {
            this.removeField(this.treeData, this.fields, ['isChecked']);
            let cnodes: string[] = this.checkedNodes;
            for (let m: number = 0, nodelen: number = cnodes.length; m < nodelen; m++) {
                this.updateField(this.treeData, this.fields, cnodes[m], 'isChecked', true);
            }
        }
    }

    private removeField(obj: { [key: string]: Object }[], mapper: FieldsSettingsModel, names: string[]): void {
        if (isNOU(obj) || isNOU(mapper)) {
            return;
        }
        for (let i: number = 0, objlen: number = obj.length; i < objlen; i++) {
            for (let j: number = 0; j < names.length; j++) {
                let field: string = this.getMapperProp(mapper, names[j]);
                if (!isNOU(obj[i][field])) {
                    delete obj[i][field];
                }
            }
            if (typeof mapper.child === 'string' && !isNOU(getValue(mapper.child, obj[i]))) {
                this.removeField(<{ [key: string]: Object }[]>getValue(mapper.child, obj[i]), this.getChildMapper(mapper), names);
            } else if (this.fields.dataSource instanceof DataManager && !isNOU(getValue('child', obj[i]))) {
                this.removeField(<{ [key: string]: Object }[]>getValue('child', obj[i]), this.getChildMapper(mapper), names);
            }
        }
    }

    private getMapperProp(mapper: FieldsSettingsModel, fieldName: string): string {
        switch (fieldName) {
            case 'selected':
                return !isNOU(mapper.selected) ? mapper.selected : 'selected';
            case 'expanded':
                return !isNOU(mapper.expanded) ? mapper.expanded : 'expanded';
            case 'isChecked':
                return !isNOU(mapper.isChecked) ? mapper.isChecked : 'isChecked';
            case 'hasChildren':
                return !isNOU(mapper.hasChildren) ? mapper.hasChildren : 'hasChildren';
            default:
                return fieldName;
        }
    }

    private updateField(
        obj: { [key: string]: Object }[], mapper: FieldsSettingsModel, id: string, key: string, value: boolean | string): void {
        let childNodes: { [key: string]: Object };
        if (isNOU(id)) {
            return;
        } else if (this.dataType === 1) {
            let newId : string | number = this.isNumberTypeId ? parseFloat(id) : id;
            let resultData: Object[] = new DataManager(this.treeData).executeLocal(new Query().where(mapper.id, 'equal', newId, false));
            setValue(this.getMapperProp(mapper, key), value, resultData[0]);
        } else {
            this.updateChildField(obj, mapper, id, key, value);
        }
    }

    private updateChildField(
        obj: { [key: string]: Object }[], mapper: FieldsSettingsModel, id: string, key: string, value: boolean | string,
        remove?: boolean): { [key: string]: Object }[] {
        let removedData: { [key: string]: Object }[];
        if (isNOU(obj)) {
            return removedData;
        }
        for (let i: number = 0, objlen: number = obj.length; i < objlen; i++) {
            let nodeId: Object = getValue(mapper.id, obj[i]);
            if (obj[i] && nodeId && nodeId.toString() === id) {
                if (remove) {
                    removedData = obj.splice(i, 1);
                } else {
                    setValue(this.getMapperProp(mapper, key), value, obj[i]);
                    removedData = [];
                }
                return removedData;
            } else if (typeof mapper.child === 'string' && !isNOU(getValue(mapper.child, obj[i]))) {
                let childData: { [key: string]: Object }[] = <{ [key: string]: Object }[]>getValue(mapper.child, obj[i]);
                removedData = this.updateChildField(childData, this.getChildMapper(mapper), id, key, value, remove);
                if (removedData !== undefined) {
                    break;
                }
            } else if (this.fields.dataSource instanceof DataManager && !isNOU(getValue('child', obj[i]))) {
                let childItems: { [key: string]: Object }[] = <{ [key: string]: Object }[]>getValue('child', obj[i]);
                removedData = this.updateChildField(childItems, this.getChildMapper(mapper), id, key, value, remove);
                if (removedData !== undefined) {
                    break;
                }
            }
        }
        return removedData;
    }

    private triggerEvent(): void {
        this.updateTemplateForBlazor();
        let eventArgs: DataSourceChangedEventArgs = { data: this.treeData };
        this.trigger('dataSourceChanged', eventArgs);
    }

    private updateBlazorTemplate(): void {
        updateBlazorTemplate(this.element.id + 'nodeTemplate', 'NodeTemplate', this, false);
    }

    private clientUpdateInitial(): void {
        this.blazorInitialRender = true;
    }
    private wireInputEvents(inpEle: Element): void {
        EventHandler.add(inpEle, 'blur', this.inputFocusOut, this);
    }

    private wireEditingEvents(toBind: boolean): void {
        if (toBind && !this.disabled) {
            let proxy: TreeView = this;
            this.touchEditObj = new Touch(this.element, {
                tap: (e: TapEventArgs) => {
                    if (e.tapCount === 2) {
                        e.originalEvent.preventDefault();
                        proxy.editingHandler(e.originalEvent);
                    }
                }
            });
        } else {
            if (this.touchEditObj) {
                this.touchEditObj.destroy();
            }
        }
    }

    private wireClickEvent(toBind: boolean): void {
        if (toBind) {
            let proxy: TreeView = this;
            this.touchClickObj = new Touch(this.element, {
                tap: (e: TapEventArgs) => {
                    proxy.clickHandler(e);
                }
            });
        } else {
            if (this.touchClickObj) {
                this.touchClickObj.destroy();
            }
        }
    }

    private wireExpandOnEvent(toBind: boolean): void {
        if (toBind) {
            let proxy: TreeView = this;
            this.touchExpandObj = new Touch(this.element, {
                tap: (e: TapEventArgs) => {
                    if ((this.expandOnType === 'Click' || (this.expandOnType === 'DblClick' && e.tapCount === 2))
                        && e.originalEvent.which !== 3 ) {
                        proxy.expandHandler(e);
                    }
                }
            });
        } else {
            if (this.touchExpandObj) {
                this.touchExpandObj.destroy();
            }
        }
    }
    private mouseDownStatus: boolean = false;

    private mouseDownHandler(e: MouseEvent): void {
        this.mouseDownStatus = true;
        if (e.shiftKey || e.ctrlKey) {
            e.preventDefault();
        }
        if (e.ctrlKey && this.allowMultiSelection) {
            EventHandler.add(this.element, 'contextmenu', this.preventContextMenu, this);
        }
    };

    private preventContextMenu(e: MouseEvent): void {
        e.preventDefault();
    }

    private wireEvents(): void {
        EventHandler.add(this.element, 'mousedown', this.mouseDownHandler, this);
        this.wireClickEvent(true);
        if (this.expandOnType !== 'None') {
            this.wireExpandOnEvent(true);
        }
        EventHandler.add(this.element, 'focus', this.focusIn, this);
        EventHandler.add(this.element, 'blur', this.focusOut, this);
        EventHandler.add(this.element, 'mouseover', this.onMouseOver, this);
        EventHandler.add(this.element, 'mouseout', this.onMouseLeave, this);
        this.keyboardModule = new KeyboardEvents(
            this.element,
            {
                keyAction: this.keyActionHandler.bind(this),
                keyConfigs: this.keyConfigs,
                eventName: 'keydown',
            }
        );
    }

    private unWireEvents(): void {
        EventHandler.remove(this.element, 'mousedown', this.mouseDownHandler);
        this.wireClickEvent(false);
        this.wireExpandOnEvent(false);
        EventHandler.remove(this.element, 'focus', this.focusIn);
        EventHandler.remove(this.element, 'blur', this.focusOut);
        EventHandler.remove(this.element, 'mouseover', this.onMouseOver);
        EventHandler.remove(this.element, 'mouseout', this.onMouseLeave);
        if (!this.disabled) {
            this.keyboardModule.destroy();
        }
    }

    private parents(element: Element | Node, selector: string): Element[] {
        let matched: Element[] = [];
        let el: Element = <Element>element.parentNode;
        while (!isNOU(el)) {
            if (matches(el, selector)) {
                matched.push(el);
            }
            el = <Element>el.parentNode;
        }
        return matched;
    }

    private isDescendant(parent: Element, child: Element): boolean {
        let node: Element = <Element>child.parentNode;
        while (!isNOU(node)) {
            if (node === parent) {
                return true;
            }
            node = <Element>node.parentNode;
        }
        return false;
    }
    protected showSpinner(element: HTMLElement): void {
        addClass([element], LOAD);
        createSpinner(
            {
                target: element,
                width: Browser.isDevice ? 16 : 14
            },
            this.createElement);
        showSpinner(element);
    }

    protected hideSpinner(element: HTMLElement): void {
        hideSpinner(element);
        element.innerHTML = '';
        removeClass([element], LOAD);
    }

    private setCheckedNodes(nodes: string[]): void {
        nodes = JSON.parse(JSON.stringify(nodes));
        this.uncheckAll(this.checkedNodes);
        this.setIndeterminate(nodes);
        if (nodes.length > 0) {
            this.checkAll(nodes);
        }
    }
    /**
     * Checks whether the checkedNodes entered are valid and sets the valid checkedNodes while changing via setmodel
     */
    private setValidCheckedNode(node: string): void {
        if (this.dataType === 1) {
            let mapper: FieldsSettingsModel = this.fields;
            let resultData: { [key: string]: Object }[] = <{ [key: string]: Object }[]>new DataManager(this.treeData).executeLocal(
                new Query().where(mapper.id, 'equal', node, true));
            if (resultData[0]) {
                this.setChildCheckState(resultData, node, resultData[0]);
                if (this.autoCheck) {
                    let parent: string = resultData[0][this.fields.parentID] ? resultData[0][this.fields.parentID].toString() : null;
                    let childNodes: { [key: string]: Object }[] = this.getChildNodes(this.treeData, parent);
                    let count: number = 0;
                    for (let len: number = 0; len < childNodes.length; len++) {
                        let childId: string = childNodes[len][this.fields.id].toString();
                        if (this.checkedNodes.indexOf(childId) !== -1) {
                            count++;
                        }
                    }
                    if (count === childNodes.length && this.checkedNodes.indexOf(parent) === -1 && parent) {
                        this.checkedNodes.push(parent);
                    }
                }
            }
        } else if (this.dataType === 2) {
            for (let a: number = 0; a < this.treeData.length; a++) {
                let index: string = this.treeData[a][this.fields.id] ? this.treeData[a][this.fields.id].toString() : '';
                if (index === node && this.checkedNodes.indexOf(node) === -1) {
                    this.checkedNodes.push(node);
                    break;
                }
                let childItems: { [key: string]: Object }[] = getValue(this.fields.child.toString(), this.treeData[a]);
                if (childItems) {
                    this.setChildCheckState(childItems, node, this.treeData[a]);
                }
            }
        }
    }
     /**
      * Checks whether the checkedNodes entered are valid and sets the valid checkedNodes while changing via setmodel(for hierarchical DS)
      */
    private setChildCheckState(childItems: { [key: string]: Object }[], node: string,  treeData ? : { [key: string]: Object }): void {
        let checkedParent: string;
        let count: number = 0;
        if (this.dataType === 1) {
            if (treeData) {
                checkedParent = treeData[this.fields.id] ? treeData[this.fields.id].toString() : null;
            }
            for (let index: number = 0; index < childItems.length; index++) {
                let checkNode: string = childItems[index][this.fields.id] ? childItems[index][this.fields.id].toString() : null;
                if (treeData && checkedParent && this.autoCheck) {
                    if (this.checkedNodes.indexOf(checkedParent) !== -1 && this.checkedNodes.indexOf(checkNode) === -1) {
                        this.checkedNodes.push(checkNode);
                    }
                }
                if (checkNode === node && this.checkedNodes.indexOf(node) === -1) {
                    this.checkedNodes.push(node);
                }
                let subChildItems: { [key: string]: Object }[] = this.getChildNodes(this.treeData, checkNode);
                if (subChildItems) {
                    this.setChildCheckState(subChildItems, node, treeData);
                }
            }
        } else {
            if (treeData) {
                checkedParent = treeData[this.fields.id] ? treeData[this.fields.id].toString() : '';
            }
            for (let index: number = 0; index < childItems.length; index++) {
                let checkedChild: string = childItems[index][this.fields.id] ? childItems[index][this.fields.id].toString() : '';
                if (treeData && checkedParent && this.autoCheck) {
                    if (this.checkedNodes.indexOf(checkedParent) !== -1 && this.checkedNodes.indexOf(checkedChild) === -1) {
                        this.checkedNodes.push(checkedChild);
                    }
                }
                if (checkedChild === node && this.checkedNodes.indexOf(node) === -1) {
                    this.checkedNodes.push(node);
                }
                let subChildItems: { [key: string]: Object }[] = getValue(this.fields.child.toString(), childItems[index]);
                if (subChildItems) {
                    this.setChildCheckState(subChildItems, node, childItems[index]);
                }
                if (this.checkedNodes.indexOf(checkedChild) !== -1 && this.autoCheck) {
                    count++;
                }
                if (count === childItems.length && this.checkedNodes.indexOf(checkedParent) === -1 && this.autoCheck) {
                    this.checkedNodes.push(checkedParent);
                }
            }
        }
    }
    private setIndeterminate(nodes: string[]): void {
        for (let i: number = 0; i < nodes.length; i++) {
            this.setValidCheckedNode(nodes[i]);
        }
    }

    private updatePosition(id: string, newData: { [key: string]: Object }, isRefreshChild?: boolean, childValue ?:{ [key: string]: Object }[] ): void {
        if (this.dataType === 1) {
            let pos: number = this.getDataPos(this.treeData, this.fields, id);
            this.treeData.splice(pos, 1, newData);
            if (isRefreshChild){
                this.removeChildNodes(id);
                for (let j: number = 0; j < childValue.length; j++) {
                    this.treeData.splice(pos, 0, childValue[j]);
                    pos++;
                }
            }
            this.groupedData = this.getGroupedData(this.treeData, this.fields.parentID);
        } else {
            this.updateChildPosition(this.treeData, this.fields, id, [newData], undefined)
        }
    }

    private updateChildPosition(
        treeData: { [key: string]: Object }[], mapper: FieldsSettingsModel, currID: string, newData: { [key: string]: Object }[],
        index: number): boolean {
        let found: boolean;
        for (let i: number = 0, objlen: number = treeData.length; i < objlen; i++) {
            let nodeId: Object = getValue(mapper.id, treeData[i]);
            if (treeData[i] && nodeId && nodeId.toString() === currID) {
                treeData[i] = newData[0];
                    return true;
            } else if (typeof mapper.child === 'string' && !isNOU(getValue(mapper.child, treeData[i]))) {
                let childObj: { [key: string]: Object }[] = <{ [key: string]: Object }[]>getValue(mapper.child, treeData[i]);
                found = this.updateChildPosition(childObj, this.getChildMapper(mapper), currID, newData, index);
                if (found !== undefined) {
                    break;
                }
            } else if (this.fields.dataSource instanceof DataManager && !isNOU(getValue('child', treeData[i]))) {
                let childData: { [key: string]: Object }[] = <{ [key: string]: Object }[]>getValue('child', treeData[i]);
                found = this.updateChildPosition(childData, this.getChildMapper(mapper), currID, newData, index);
                if (found !== undefined) {
                    break;
                }
            }
        }
        return found;
    }

    private dynamicState(): void {
        this.setDragAndDrop(this.allowDragAndDrop);
        this.wireEditingEvents(this.allowEditing);
        if (!this.disabled) {
           this.wireEvents();
           this.setRipple();
        } else {
           this.unWireEvents();
           this.rippleFn();
           this.rippleIconFn();
        }
    }

    private crudOperation(operation: string, nodes?: string[] | Element[], target?: string | Element, newText?: string, newNode?: { [key: string]: Object }[], index?: number, prevent?: boolean): void {
        let data: DataManager = this.fields.dataSource as DataManager;
        let matchedArr: { [key: string]: Object }[] = [];
        let query: Query = this.getQuery(this.fields);
        let key: string = this.fields.id;
        let crud: Promise<Object>;
        let changes: { addedRecords: { [key: string]: Object }[], 
        deletedRecords: { [key: string]: Object }[], 
        changedRecords: { [key: string]: Object }[] } = {
            addedRecords: [],
            deletedRecords: [],
            changedRecords: []
        };
        let nodesID: string[] = [];
        if (nodes) {
            nodesID = this.nodeType(nodes);
        } else if (target) {
            if (typeof target == "string") {
                nodesID[0] = target.toString();
            } else if (typeof target === "object") {
                nodesID[0] = target.getAttribute("data-uid").toString();
            }
        }
        for (let i:number = 0, len = nodesID.length; i < len; i++) {
            let liEle:Element = this.getElement(nodesID[i]);
            if (isNullOrUndefined(liEle)) {
                continue;
            }
            let removedData: { [key: string]: Object } = this.getNodeObject(nodesID[i])
            matchedArr.push(removedData);
        }
        switch (operation) {
            case 'delete':
                if (nodes.length == 1) {
                    crud = data.remove(key, matchedArr[0], query.fromTable, query) as Promise<Object>;
                } else {
                    changes.deletedRecords = matchedArr;
                    crud = data.saveChanges(changes, key, query.fromTable, query) as Promise<Object>;
                }
                crud.then((e: any) => this.deleteSuccess(nodesID))
                    .catch((e: { result: Object[] }) => this.dmFailure(e as { result: Object[] }));
                break;
            case 'update':
                matchedArr[0][this.fields.text] = newText;
                crud = data.update(key, matchedArr[0], query.fromTable, query) as Promise<Object>;
                crud.then((e: any) => this.editSucess(target, newText,prevent))
                    .catch((e: { result: Object[] }) => this.dmFailure(e as { result: Object[] }));
                break;
            case 'insert':
                if (newNode.length == 1) {
                    crud = data.insert(newNode[0], query.fromTable, query) as Promise<Object>;
                } else {
                    let arr: { [key: string]: Object }[] = []
                    for (let i:number = 0, len = newNode.length; i < len; i++) {
                        arr.push(newNode[i])
                    }
                    changes.addedRecords = arr;
                    crud = data.saveChanges( changes, key, query.fromTable, query) as Promise<Object>;
                }
                crud.then((e: any) => {
                    let dropLi: Element = this.getElement(target);
                    this.addSuccess(newNode, dropLi, index);
                    this.preventExpand = false;
                }).catch((e: { result: Object[] }) => this.dmFailure(e as { result: Object[] }));
                break;
        }
    }

    private deleteSuccess(nodes: string[] | Element[]): void {
        for (let i: number = 0, len: number = nodes.length; i < len; i++) {
            let liEle: Element = this.getElement(nodes[i]);
            if (isNOU(liEle)) { continue; }
            this.removeNode(liEle);
        }
        if (this.dataType === 1) {
            this.groupedData = this.getGroupedData(this.treeData, this.fields.parentID);
        }
        this.triggerEvent();
    }

    private editSucess(target: any, newText: string, prevent: boolean): void {
        let liEle: Element = this.getElement(target);
        let txtEle: HTMLElement = select('.' + LISTTEXT, liEle) as HTMLElement;
        this.appendNewText(liEle, txtEle, newText, prevent);
    }

    private addSuccess(nodes: { [key: string]: Object }[], dropLi: Element, index?: number): void {
        let dropUl: Element;
        let icon: Element = dropLi ? dropLi.querySelector('.' + ICON) : null;
        let proxy: TreeView = this;
        if (dropLi && icon && icon.classList.contains(EXPANDABLE) &&
            dropLi.querySelector('.' + PARENTITEM) === null) {
            proxy.renderChildNodes(dropLi, null, () => {
                dropUl = dropLi.querySelector('.' + PARENTITEM);
                proxy.addGivenNodes(nodes, dropLi, index, true, dropUl);
                proxy.triggerEvent();
            });
        } else {
            this.addGivenNodes(nodes, dropLi, index, true);
            this.triggerEvent();
        }
    }

    private dmFailure(e: { result: Object[] }): void {
        this.trigger('actionFailure', { error: e });
    }

    /**
     * Called internally if any of the property value changed.
     * @param  {TreeView} newProp
     * @param  {TreeView} oldProp
     * @returns void
     * @private
     */
     // tslint:disable-next-line:max-func-body-length
    public onPropertyChanged(newProp: TreeViewModel, oldProp: TreeViewModel): void {
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'allowDragAndDrop':
                    this.setDragAndDrop(this.allowDragAndDrop);
                    break;
                case 'dragArea':
                    if (this.allowDragAndDrop) {
                        this.dragObj.dragArea = this.dragArea;
                    }
                    break;
                case 'allowEditing':
                    this.wireEditingEvents(this.allowEditing);
                    break;
                case 'allowMultiSelection':
                    if (this.selectedNodes.length > 1) {
                        let sNode: Element =  this.getElement(this.selectedNodes[0]);
                        this.isLoaded = false;
                        this.removeSelectAll();
                        this.selectNode(sNode, null);
                        this.isLoaded = true;
                    }
                    this.setMultiSelect(this.allowMultiSelection);
                    this.addMultiSelect(this.allowMultiSelection);
                    break;
                case 'checkedNodes':
                    if (this.showCheckBox) {
                        this.checkedNodes = oldProp.checkedNodes;
                        this.setCheckedNodes(newProp.checkedNodes);
                    }
                    break;
                case 'autoCheck':
                    if (this.showCheckBox) {
                        this.autoCheck = newProp.autoCheck;
                        this.ensureIndeterminate();
                    }
                    break;
                case 'cssClass':
                    this.setCssClass(oldProp.cssClass, newProp.cssClass);
                    break;
                case 'enableRtl':
                    this.setEnableRtl();
                    break;
                case 'expandedNodes':
                    this.isAnimate = false;
                    if (!this.isBlazorPlatform) {
                        this.setProperties({ expandedNodes: [] }, true);
                    }
                    this.collapseAll();
                    this.isInitalExpand = true;
                    if (!this.isBlazorPlatform) {
                        this.setProperties({ expandedNodes: isNOU(newProp.expandedNodes) ? [] : newProp.expandedNodes }, true);
                    }
                    this.doExpandAction();
                    this.isInitalExpand = false;
                    this.isAnimate = true;
                    break;
                case 'expandOn':
                    this.wireExpandOnEvent(false);
                    this.setExpandOnType();
                    if (this.expandOnType !== 'None' && !this.disabled) {
                            this.wireExpandOnEvent(true);
                        }
                    break;
                case 'disabled':
                    this.setDisabledMode();
                    this.dynamicState();
                     break;
                case 'fields':
                    this.isAnimate = false;
                    this.isFieldChange = true;
                    this.initialRender = true;
                    if(!this.blazorInitialRender) {
                        this.reRenderNodes();
                    }
                    this.blazorInitialRender = false;
                    this.initialRender = false;
                    this.isAnimate = true;
                    this.isFieldChange = false;
                    break;
                case 'fullRowSelect':
                    this.setFullRow(this.fullRowSelect);
                    this.addFullRow(this.fullRowSelect);
                    break;
                case 'loadOnDemand':
                    if (this.loadOnDemand === false  && !this.onLoaded) {
                        let nodes: NodeListOf<Element> = this.element.querySelectorAll('li');
                        let i: number = 0;
                        while (i < nodes.length) {
                            if (nodes[i].getAttribute('aria-expanded') !== 'true') {
                                this.renderChildNodes(nodes[i], true, null, true);
                            }
                            i++;
                        }
                        this.onLoaded = true;
                    }
                    break;
                case 'nodeTemplate':
                    this.nodeTemplateFn = this.templateComplier(this.nodeTemplate);
                    this.reRenderNodes();
                    break;
                case 'selectedNodes':
                    this.removeSelectAll();
                    this.setProperties({ selectedNodes: newProp.selectedNodes }, true);
                    this.doSelectionAction();
                    break;
                case 'showCheckBox':
                    this.reRenderNodes();
                    break;
                case 'sortOrder':
                    this.reRenderNodes();
                    break;
                case 'fullRowNavigable':
                    this.setProperties({ fullRowNavigable: newProp.fullRowNavigable }, true);
                    this.listBaseOption.itemNavigable = newProp.fullRowNavigable;
                    this.reRenderNodes();
                    break;
            }
        }
    }

    /**
     * Removes the component from the DOM and detaches all its related event handlers. It also removes the attributes and classes.
     */
    public destroy(): void {
        resetBlazorTemplate(this.element.id + 'nodeTemplate', 'NodeTemplate');
        this.element.removeAttribute('aria-activedescendant');
        this.element.removeAttribute('tabindex');
        this.unWireEvents();
        this.wireEditingEvents(false);
        if (!this.disabled) {
            this.rippleFn();
            this.rippleIconFn();
        }    
        this.setCssClass(this.cssClass, null);
        this.setDragAndDrop(false);
        this.setFullRow(false);
        if (this.isBlazorPlatform) {
            this.ulElement = this.element.querySelector('.e-list-parent.e-ul');
        }
        if (this.ulElement && this.ulElement.parentElement) {
            this.ulElement.parentElement.removeChild(this.ulElement);
        }
        if (!this.isBlazorPlatform) {
            super.destroy();
        }
    }

    /**
     * Adds the collection of TreeView nodes based on target and index position. If target node is not specified,
     * then the nodes are added as children of the given parentID or in the root level of TreeView.
     * @param  { { [key: string]: Object }[] } nodes - Specifies the array of JSON data that has to be added.
     * @param  { string | Element } target - Specifies ID of TreeView node/TreeView node as target element.
     * @param  { number } index - Specifies the index to place the newly added nodes in the target element.
     * @param { boolean } preventTargetExpand - If set to true, the target parent node will be prevented from auto expanding.
     */
    public addNodes(nodes: { [key: string]: Object }[], target ? : string | Element, index ? : number,
                    preventTargetExpand ? : boolean ): void {
        if (isNOU(nodes)) {
            return;
        }
        nodes = JSON.parse(JSON.stringify(nodes));
        let dropLi: Element = this.getElement(target);
        this.preventExpand = preventTargetExpand;
        if (this.fields.dataSource instanceof DataManager && ((this.fields.dataSource as any).adaptorName !== 'BlazorAdaptor')) {
            if (!(this.fields.dataSource.dataSource.offline) ) {
                this.crudOperation('insert', null, target, null, nodes, index, this.preventExpand);
            } else {
                this.addSuccess(nodes, dropLi, index);
            }
        } else if (this.dataType === 2) {
            this.addGivenNodes(nodes, dropLi, index);
        } else {
            if (dropLi) {
                this.addGivenNodes(nodes, dropLi, index);
            } else {
                nodes = this.getSortedData(nodes);
                for (let i: number = 0; i < nodes.length; i++) {
                    let pid: Object = getValue(this.fields.parentID, nodes[i]);
                    dropLi = pid ? this.getElement(pid.toString()) : <Element>pid;
                    this.addGivenNodes([nodes[i]], dropLi, index);
                }
            }
            this.groupedData = this.getGroupedData(this.treeData, this.fields.parentID);
        }
        if (this.showCheckBox && dropLi) {
            this.ensureParentCheckState(dropLi);
        }
        if ((this.fields.dataSource instanceof DataManager === false) || (this.fields.dataSource instanceof DataManager) && ((this.fields.dataSource as any).adaptorName === 'BlazorAdaptor')) {
            this.preventExpand = false;
            this.triggerEvent();
        }
    }

    /**
     * Instead of clicking on the TreeView node for editing, we can enable it by using
     * `beginEdit` property. On passing the node ID or element through this property, the edit textBox
     * will be created for the particular node thus allowing us to edit it.
     * @param  {string | Element} node - Specifies ID of TreeView node/TreeView node.
     */
    public beginEdit(node: string | Element): void {
        let ele: Element = this.getElement(node);
        if (isNOU(ele) || this.disabled) {
            return;
        }
        this.createTextbox(ele, null);
    }
    /**
     * Checks all the unchecked nodes. You can also check specific nodes by passing array of unchecked nodes
     * as argument to this method.
     * @param  {string[] | Element[]} nodes - Specifies the array of TreeView nodes ID/array of TreeView node.
     */
    public checkAll(nodes ? : string[] | Element[]): void {
        if (this.showCheckBox) {
            this.doCheckBoxAction(nodes, true);
        }
    }

    /**
     * Collapses all the expanded TreeView nodes. You can collapse specific nodes by passing array of nodes as argument to this method.
     * You can also collapse all the nodes excluding the hidden nodes by setting **excludeHiddenNodes** to true. If you want to collapse
     * a specific level of nodes, set **level** as argument to collapseAll method.
     * @param  {string[] | Element[]} nodes - Specifies the array of TreeView nodes ID/ array of TreeView node.
     * @param  {number} level - TreeView nodes will collapse up to the given level.
     * @param  {boolean} excludeHiddenNodes - Whether or not to exclude hidden nodes of TreeView when collapsing all nodes.
     */
    public collapseAll(nodes?: string[] | Element[], level?: number, excludeHiddenNodes?: boolean): void {
        if (!isNOU(nodes)) {
            this.doGivenAction(nodes, COLLAPSIBLE, false);
        } else {
            if ( level > 0) {
                this.collapseByLevel(select('.' + PARENTITEM, this.element), level, excludeHiddenNodes);
            } else {
                this.collapseAllNodes(excludeHiddenNodes);
            }
        }
    }

    /**
     * Disables the collection of nodes by passing the ID of nodes or node elements in the array.
     * @param  {string[] | Element[]} nodes - Specifies the array of TreeView nodes ID/array of TreeView nodes.
     */
    public disableNodes(nodes: string[] | Element[]): void {
        if (!isNOU(nodes)) {
            this.doDisableAction(nodes);
        }
    }

    /**
     * Enables the collection of disabled nodes by passing the ID of nodes or node elements in the array.
     * @param  {string[] | Element[]} nodes - Specifies the array of TreeView nodes ID/array of TreeView nodes.
     */
    public enableNodes(nodes: string[] | Element[]): void {
        if (!isNOU(nodes)) {
            this.doEnableAction(nodes);
        }
    }

    /**
     * Ensures visibility of the TreeView node by using node ID or node element.
     * When many TreeView nodes are present and we need to find a particular node, `ensureVisible` property
     * helps bring the node to visibility by expanding the TreeView and scrolling to the specific node.
     * @param  {string | Element} node - Specifies ID of TreeView node/TreeView nodes.
     */
    public ensureVisible(node: string | Element): void {
        let liEle: Element = this.getElement(node);
        if (isNOU(liEle)) {
            return;
        }
        let parents: Element[] = this.parents(liEle, '.' + LISTITEM);
        this.expandAll(parents);
        setTimeout(() => { liEle.scrollIntoView(true); }, 450);
    }

    /**
     * Expands all the collapsed TreeView nodes. You can expand the specific nodes by passing the array of collapsed nodes
     * as argument to this method. You can also expand all the collapsed nodes by excluding the hidden nodes by setting
     * **excludeHiddenNodes** to true to this method. To expand a specific level of nodes, set **level** as argument to expandAll method.
     * @param  {string[] | Element[]} nodes - Specifies the array of TreeView nodes ID/array of TreeView nodes.
     * @param  {number} level - TreeView nodes will expand up to the given level.
     * @param  {boolean} excludeHiddenNodes - Whether or not to exclude hidden nodes when expanding all nodes.
     */
    public expandAll(nodes?: string[] | Element[], level?: number, excludeHiddenNodes?: boolean): void {
        if (!isNOU(nodes)) {
            this.doGivenAction(nodes, EXPANDABLE, true);
        } else {
            if ( level > 0) {
                this.expandByLevel(select('.' + PARENTITEM, this.element), level, excludeHiddenNodes);
            } else {
                this.expandAllNodes(excludeHiddenNodes);
            }
        }
    }

    /**
     * Gets all the checked nodes including child, whether it is loaded or not.
     */
    public getAllCheckedNodes(): string[] {
        let checkNodes: string[] = this.checkedNodes;
        return checkNodes;
    }

     /**
     * Gets all the disabled nodes including child, whether it is loaded or not.
     */
    public getDisabledNodes(): string[] {
        let disabledNodes: string[] = this.disableNode;
        return disabledNodes;
    }

    /**
     * Get the node's data such as id, text, parentID, selected, isChecked, and expanded by passing the node element or it's ID.
     * @param  {string | Element} node - Specifies ID of TreeView node/TreeView node.
     * @BlazorType NodeData
     */
    public getNode(node: string | Element): { [key: string]: Object } {
        let ele: Element = this.getElement(node);
        return this.getNodeData(ele, true);
    }

    /**
     * To get the updated data source of TreeView after performing some operation like drag and drop, node editing,
     * node selecting/unSelecting, node expanding/collapsing, node checking/unChecking, adding and removing node.
     * * If you pass the ID of TreeView node as arguments for this method then it will return the updated data source
     * of the corresponding node otherwise it will return the entire updated data source of TreeView.
     * * The updated data source also contains custom attributes if you specified in data source.
     * @param  {string | Element} node - Specifies ID of TreeView node/TreeView node.
     * @isGenericType true
     */
    public getTreeData(node?: string | Element): { [key: string]: Object }[] {
        let id: string = this.getId(node);
        this.updatePersistProp();
        if (isNOU(id)) {
            return this.treeData;
        } else {
            let data: { [key: string]: Object } = this.getNodeObject(id);
            return isNOU(data) ? [] : [data];
        }
    }

    /**
     * Moves the collection of nodes within the same TreeView based on target or its index position.
     * @param  {string[] | Element[]} sourceNodes - Specifies the array of TreeView nodes ID/array of TreeView node.
     * @param  {string | Element} target - Specifies ID of TreeView node/TreeView node as target element.
     * @param  {number} index - Specifies the index to place the moved nodes in the target element.
     * @param { boolean } preventTargetExpand - If set to true, the target parent node will be prevented from auto expanding.
     */
    public moveNodes(sourceNodes: string[] | Element[], target: string | Element, index: number, preventTargetExpand ? : boolean): void {
        let dropLi: Element = this.getElement(target);
        if (isNOU(dropLi)) {
            return;
        }
        for (let i: number = 0; i < sourceNodes.length; i++) {
            let dragLi: Element = this.getElement(sourceNodes[i]);
            if (isNOU(dragLi) || dropLi.isSameNode(dragLi) || this.isDescendant(dragLi, dropLi)) {
                continue;
            }
            this.preventExpand = preventTargetExpand;
            this.dropAsChildNode(dragLi, dropLi, this, index);
        }
        if (this.fields.dataSource instanceof DataManager === false) {
            this.preventExpand = false;
        }
        this.triggerEvent();
    }

    /**
     * Refreshes a particular node of the TreeView.
     * @param  {string | Element} target - Specifies the ID of TreeView node or TreeView node as target element.
     * @param  {{ [key: string]: Object }[]} newData - Specifies the new data of TreeView node.
     */
    public refreshNode(target: string | Element, newData: { [key: string]: Object }[]): void {
        if (isNOU(target) || isNOU(newData)) {
            return;
        }
        let id: string;
        let isRefreshChild: boolean = false;
        if (this.dataType == 1 && newData.length > 1) {
            isRefreshChild = true;
        } else if (this.dataType == 2 && newData.length === 1) {
            let updatedChildValue: { [key: string]: Object }[] = getValue(this.fields.child.toString(), newData[0]);
            if (!isNOU(updatedChildValue)) {
                isRefreshChild = true;
            }
        }
        let liEle: HTMLElement = this.getElement(target) as HTMLElement;
        id = liEle ? liEle.getAttribute('data-uid') : ((target) ? target.toString() : null);
        this.refreshData = this.getNodeObject(id);
        newData = JSON.parse(JSON.stringify(newData));
        // tslint:disable
        let newNodeData: any;
        let parentData: { [key: string]: Object };
        if (this.dataType == 1 && isRefreshChild) {
            for (let k: number = 0; k < newData.length; k++) {
                if (isNOU(newData[k][this.fields.parentID])) {
                    parentData = newData[k];
                    newData.splice(k, 1);
                    break;
                }
            }
            newNodeData = extend({}, this.refreshData, parentData);
        } else {
            newNodeData = extend({}, this.refreshData, newData[0]);
        }
        if (isNOU(liEle)) {
            this.updatePosition(id, newNodeData, isRefreshChild, newData);
            return;
        }
        this.isRefreshed = true;
        let level: number = parseFloat(liEle.getAttribute('aria-level'));
        let newliEle: HTMLElement[] = ListBase.createListItemFromJson(this.createElement, [newNodeData], this.listBaseOption, level);
        let ul: Element = select('.' + PARENTITEM, liEle);
        let childItems: { [key: string]: Object }[] = getValue(this.fields.child.toString(), newNodeData);
        if ((isRefreshChild && ul) || (isRefreshChild && !isNOU(childItems))) {
            liEle.innerHTML = newliEle[0].innerHTML;
            this.updatePosition(id, newNodeData, isRefreshChild, newData);
            if (isRefreshChild && ul) {
                this.expandAll([id]);
            }
        } else {
            let txtEle: HTMLElement = select('.' + TEXTWRAP, liEle) as HTMLElement;
            let newTextEle: HTMLElement = select('.' + TEXTWRAP, newliEle[0]) as HTMLElement;
            let icon = select('div.' + ICON, txtEle);
            let newIcon = select('div.' + ICON, newTextEle);
            if (icon && newIcon) {
                if (newIcon.classList.contains(EXPANDABLE) && icon.classList.contains(COLLAPSIBLE)) {
                    removeClass([newIcon], EXPANDABLE);
                    addClass([newIcon], COLLAPSIBLE);
                } else if (newIcon.classList.contains(COLLAPSIBLE) && icon.classList.contains(EXPANDABLE)) {
                    removeClass([newIcon], COLLAPSIBLE);
                    addClass([newIcon], EXPANDABLE);
                } else if (icon.classList.contains('interaction')) {
                    addClass([newIcon], 'interaction');
                }
            }
            txtEle.innerHTML = newTextEle.innerHTML;
            this.updatePosition(id, newNodeData, isRefreshChild, newData);
        }
        if (newNodeData[this.fields.tooltip]) {
            liEle.setAttribute("title", newNodeData[this.fields.tooltip]);
        }
        if (newNodeData.hasOwnProperty(this.fields.htmlAttributes) && newNodeData[this.fields.htmlAttributes]) {
            let attr: { [key: string]: string } = {};
            merge(attr, newNodeData[this.fields.htmlAttributes]);
            if (attr.class) {
                addClass([liEle], attr.class.split(' '));
                delete attr.class;
            } else {
                attributes(liEle, attr);
            }
        }
        this.isRefreshed = false;
        this.triggerEvent();
    }

    /**
     * Removes the collection of TreeView nodes by passing the array of node details as argument to this method.
     * @param  {string[] | Element[]} nodes - Specifies the array of TreeView nodes ID/array of TreeView node.
     */
    public removeNodes(nodes: string[] | Element[]): void {
        if (!isNOU(nodes)) {
            if (this.fields.dataSource instanceof DataManager && !(this.fields.dataSource.dataSource.offline) && ((this.fields.dataSource as any).adaptorName !== 'BlazorAdaptor')) {
                this.crudOperation('delete', nodes);
            } else {
                this.deleteSuccess(nodes)
            }
        }
    }

    /**
     * Replaces the text of the TreeView node with the given text.
     * @param  {string | Element} target - Specifies ID of TreeView node/TreeView node as target element.
     * @param  {string} newText - Specifies the new text of TreeView node.
     */
    public updateNode(target: string | Element, newText: string): void {
        if (isNOU(target) || isNOU(newText) || !this.allowEditing) {
            return;
        }
        let liEle: Element = this.getElement(target);
        if (isNOU(liEle)) {
            return;
        }
        let txtEle: HTMLElement = select('.' + LISTTEXT, liEle) as HTMLElement;
        this.updateOldText(liEle);
        let eventArgs: NodeEditEventArgs = this.getEditEvent(liEle, null, null);
        this.trigger('nodeEditing', eventArgs, (observedArgs: NodeEditEventArgs) => {
            if (!observedArgs.cancel) {
                if (this.fields.dataSource instanceof DataManager && !(this.fields.dataSource.dataSource.offline) && ((this.fields.dataSource as any).adaptorName !== 'BlazorAdaptor')) {
                    
                    this.crudOperation('update', null, target, newText, null, null, false);
                } else {
                    this.appendNewText(liEle, txtEle, newText, false);
                }
            }
        });
    }

    /**
     * Unchecks all the checked nodes. You can also uncheck the specific nodes by passing array of checked nodes
     * as argument to this method.
     * @param  {string[] | Element[]} nodes - Specifies the array of TreeView nodes ID/array of TreeView node.
     */
    public uncheckAll(nodes?: string[] | Element[]): void {
        if (this.showCheckBox) {
            this.doCheckBoxAction(nodes, false);
        }
    }
}