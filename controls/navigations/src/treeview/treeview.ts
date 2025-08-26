import { Component, EmitType, isUndefined, Browser, compile, isNullOrUndefined, SanitizeHtmlHelper, animationMode } from '@syncfusion/ej2-base';
import { Property, INotifyPropertyChanged, NotifyPropertyChanges, ChildProperty, Complex } from '@syncfusion/ej2-base';
import { Event, EventHandler, KeyboardEvents, KeyboardEventArgs } from '@syncfusion/ej2-base';
import { rippleEffect, Effect, Animation, AnimationOptions, RippleOptions, remove } from '@syncfusion/ej2-base';
import { Draggable, DragEventArgs, Droppable, DropEventArgs } from '@syncfusion/ej2-base';
import { getElement } from '@syncfusion/ej2-base';
import { addClass, removeClass, closest, matches, detach, select, selectAll, isVisible, append } from '@syncfusion/ej2-base';
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
const LISTWRAP: string = 'e-text-wrap';
const IELISTWRAP: string = 'e-ie-wrap';
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
const INTERACTION: string = 'e-interaction';
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
const DROPCOUNT: string = 'e-drop-count';
const CHECK: string = 'e-check';
const INDETERMINATE: string = 'e-stop';
const CHECKBOXWRAP: string = 'e-treeview-checkbox';
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
const PREVENTSELECT: string = 'e-prevent';

const treeAriaAttr: TreeAriaAttr = {
    treeRole: 'group',
    itemRole: 'treeitem',
    listRole: 'group',
    itemText: '',
    wrapperRole: ''
};

interface TreeAriaAttr extends AriaAttributesMapping {
    treeRole: string;
    wrapperRole: string;
}

interface ResultData {
    result: { [key: string]: Object }[];
}

interface EJ2Instance extends HTMLElement {
    // eslint-disable-next-line
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
     *
     * Return the expanded/collapsed node as JSON object from data source.
     *
     *
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
     *
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
     *
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
     *
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
     *
     */
    draggedNodeData: { [key: string]: Object };
    /**
     * Returns the dragged/dropped element's target index position
     *
     */
    dropIndex: number;
    /**
     * Returns the dragged/dropped element's target level
     *
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
     *
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
    /**
     * Denotes the cloned element's drop position relative to the dropped node while dragging. The available values are,
     *   1. Inside – Denotes that the cloned element will be appended as the child node of the dropped node.
     *   2. Before - Denotes that the cloned element will be appended before the dropped node.
     *   3. After - Denotes that the cloned element will be appended after the dropped node.
     */
    position: string;
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
     *
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
     *
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
     *
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
     *
     * @isGenericType true
     */
    data: { [key: string]: Object }[];
    /**
     * Return the action which triggers the event
     *
     */
    action: string;
    /**
     * Return the new node data of updated data source
     *
     */
    nodeData: { [key: string]: Object }[];
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
     *
     * @default []
     * @aspDatasourceNullIgnore
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
     * Defines the external [`Query`](https://ej2.syncfusion.com/documentation/api/data/query/)
     * that will execute along with data processing.
     *
     * @default null
     */
    @Property(null)
    public query: Query;

    /**
     * Specifies whether the node can be selected by users or not
     * When set to false, the user interaction is prevented for the corresponding node.
     */
    @Property('selectable')
    public selectable: string;

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
 * ```props
 * Auto :- The expand/collapse operation happens when you double-click on the node in desktop.
 * Click :- The expand/collapse operation happens when you single-click on the node in desktop.
 * DblClick :- The expand/collapse operation happens when you double-click on the node in desktop.
 * None :- The expand/collapse operation will not happen.
 * ```
 */
export type ExpandOnSettings = 'Auto' | 'Click' | 'DblClick' | 'None';

/**
 * Defines the sorting order type for TreeView.
 * ```props
 * None :- Indicates that the nodes are not sorted.
 * Ascending :- Indicates that the nodes are sorted in the ascending order.
 * Descending :- Indicates that the nodes are sorted in the descending order
 * ```
 */
export type SortOrder = 'None' | 'Ascending' | 'Descending';

/**
 * Configures animation settings for the TreeView component.
 */
export class ActionSettings extends ChildProperty<ActionSettings> {
    /**
     * Specifies the type of animation.
     *
     * @default 'SlideDown'
     */
    @Property('SlideDown')
    public effect: Effect;
    /**
     * Specifies the duration to animate.
     *
     * @default 400
     */
    @Property(400)
    public duration: number;
    /**
     * Specifies the animation timing function.
     *
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
     *
     * @default { effect: 'SlideUp', duration: 400, easing: 'linear' }
     */
    @Complex<ActionSettingsModel>({ effect: 'SlideUp', duration: 400, easing: 'linear' }, ActionSettings)
    public collapse: ActionSettingsModel;
    /**
     * Specifies the animation that applies on expanding the nodes.
     *
     * @default { effect: 'SlideDown', duration: 400, easing: 'linear' }
     */
    @Complex<ActionSettingsModel>({ effect: 'SlideDown', duration: 400, easing: 'linear' }, ActionSettings)
    public expand: ActionSettingsModel;
}

/**
 * The TreeView component is used to represent hierarchical data in a tree like structure with advanced
 * functions to perform edit, drag and drop, selection with check-box, and more.
 * ```html
 * <div id="tree"></div>
 * ```
 * ```typescript
 * let treeObj: TreeView = new TreeView();
 * treeObj.appendTo('#tree');
 * ```
 */

@NotifyPropertyChanges
export class TreeView extends Component<HTMLElement> implements INotifyPropertyChanged {

    /* Internal variables */
    private initialRender: boolean;
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
    private touchClass: string;
    private editData: { [key: string]: Object };
    private editFields: FieldsSettingsModel;
    private refreshData: { [key: string]: Object };
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
    private parentCheckData: { [key: string]: Object }[];
    private validArr: { [key: string]: Object }[] = [];
    private validNodes: string[] = [];
    private expandChildren: string[] = [];
    private isFieldChange: boolean = false;
    private changeDataSource: boolean = false;
    private isOffline: boolean;
    private firstTap: Element;
    private hasTemplate: boolean = false;
    private isFirstRender: boolean = false;
    private isBatchMode: boolean;
    private batchParentNode: Set<string> = new Set();
    // Specifies whether the node is dropped or not
    private isNodeDropped: boolean = false;
    private isInteracted: boolean = false;
    private isRightClick: boolean = false;
    private mouseDownStatus: boolean = false;
    private isDropIn: boolean = false;
    private DDTTreeData: { [key: string]: Object }[];
    private OldCheckedData: { [key: string]: Object; }[] = [];
    private isHiddenItem: boolean = false;
    /**
     * Indicates whether the TreeView allows drag and drop of nodes. To drag and drop a node in
     * desktop, hold the mouse on the node, drag it to the target node and drop the node by releasing
     * the mouse. For touch devices, drag and drop operation is performed by touch, touch move
     * and touch end. For more information on drag and drop nodes concept, refer to
     * [Drag and Drop](../../treeview/drag-and-drop/).
     *
     * @default false
     */
    @Property(false)
    public allowDragAndDrop: boolean;

    /**
     * Enables or disables editing of the text in the TreeView node. When `allowEditing` property is set
     * to true, the TreeView allows you to edit the node by double clicking the node or by navigating to
     * the node and pressing **F2** key. For more information on node editing, refer
     * to [Node Editing](../../treeview/node-editing/).
     *
     * @default false
     */
    @Property(false)
    public allowEditing: boolean;

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
    @Property(false)
    public allowMultiSelection: boolean;

    /**
     * Enables or disables text wrapping when text exceeds the bounds in the TreeView node.
     * When the allowTextWrap property is set to true, the TreeView node text content will wrap to the next line
     * when it exceeds the width of the TreeView node.
     * The TreeView node height will be adjusted automatically based on the TreeView node content.
     *
     * @default false
     */
    @Property(false)
    public allowTextWrap: boolean;

    /**
     * Specifies the type of animation applied on expanding and collapsing the nodes along with duration.
     *
     * @default {expand: { effect: 'SlideDown', duration: 400, easing: 'linear' },
     * collapse: { effect: 'SlideUp', duration: 400, easing: 'linear' }}
     */
    @Complex<NodeAnimationSettingsModel>({}, NodeAnimationSettings)
    public animation: NodeAnimationSettingsModel;

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
    @Property()
    public checkedNodes: string[];

    /**
     * Determines whether the disabled children will be checked or not if their parent is checked.
     *
     * @default true
     */
    @Property(true)
    public checkDisabledChildren: boolean;

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
    @Property('')
    public cssClass: string;

    /**
     * Specifies a value that indicates whether the TreeView component is disabled or not.
     * When set to true, user interaction will not be occurred in TreeView.
     *
     * @default false
     */
    @Property(false)
    public disabled: boolean;

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
    @Property(null)
    public dragArea: HTMLElement | string;

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
    @Property(true)
    public enableHtmlSanitizer: boolean;

    /**
     * Enables or disables persisting TreeView state between page reloads. If enabled, following APIs will persist.
     * 1. `selectedNodes` - Represents the nodes that are selected in the TreeView component.
     * 2. `checkedNodes`  - Represents the nodes that are checked in the TreeView component.
     * 3. `expandedNodes` - Represents the nodes that are expanded in the TreeView component.
     *
     * @default false
     */
    @Property(false)
    public enablePersistence: boolean;

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
    @Property()
    public expandedNodes: string[];

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
    @Property('Auto')
    public expandOn: ExpandOnSettings;

    /**
     * Specifies the data source and mapping fields to render TreeView nodes.
     *
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
     *
     * @default true
     */
    @Property(true)
    public fullRowSelect: boolean;

    /**
     * By default, the load on demand (Lazy load) is set to true. By disabling this property, all the tree nodes are rendered at the
     * beginning itself.
     *
     * @default true
     */
    @Property(true)
    public loadOnDemand: boolean;

    /**
     * Overrides the global culture and localization value for this component. Default global culture is 'en-US'.
     *
     * @private
     */
    @Property()
    public locale: string;

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
    @Property()
    public nodeTemplate: string | Function;

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
    @Property()
    public selectedNodes: string[];

    /**
     * Specifies a value that indicates whether the nodes are sorted in the ascending or descending order,
     * or are not sorted at all. The available types of sort order are,
     * * `None` - The nodes are not sorted.
     * * `Ascending` - The nodes are sorted in the ascending order.
     * * `Descending` - The nodes are sorted in the ascending order.
     *
     * @default 'None'
     */
    @Property('None')
    public sortOrder: SortOrder;

    /**
     * Indicates that the nodes will display CheckBoxes in the TreeView.
     * The CheckBox will be displayed next to the expand/collapse icon of the node. For more information on CheckBoxes, refer to
     * [CheckBox](../../treeview/check-box/).
     *
     * @default false
     */
    @Property(false)
    public showCheckBox: boolean;

    /**
     * Specifies whether the item should be checked or unchecked when the node is clicked.
     *
     * @default false
     */
    @Property(false)
    public checkOnClick: boolean;

    /**
     * Allow us to specify the parent and child nodes to get auto check while we check or uncheck a node.
     *
     * @default true
     */
    @Property(true)
    public autoCheck: boolean;

    /**
     * If this property is set to true, then the entire TreeView node will be navigate-able instead of text element.
     *
     * @default false
     */
    @Property(false)
    public fullRowNavigable: boolean;
    /**
     * Event callback that is raised while any TreeView action failed to fetch the desired results.
     *
     * @event actionFailure
     */
    @Event()
    public actionFailure: EmitType<FailureEventArgs>;

    /**
     * Event callback that is raised when the TreeView component is created successfully.
     *
     * @event created
     */
    @Event()
    public created: EmitType<Object>;

    /**
     * Event callback that is raised when data source is populated in the TreeView.
     *
     * @event dataBound
     */
    @Event()
    public dataBound: EmitType<DataBoundEventArgs>;

    /**
     * Event callback that is raised when data source is changed in the TreeView. The data source will be changed after performing some operation like
     * drag and drop, node editing, adding and removing node.
     *
     * @event dataSourceChanged
     */
    @Event()
    public dataSourceChanged: EmitType<DataSourceChangedEventArgs>;

    /**
     * Event callback that is raised before the TreeView node is appended to the TreeView element. It helps to customize specific nodes.
     *
     * @event drawNode
     */
    @Event()
    public drawNode: EmitType<DrawNodeEventArgs>;

    /**
     * Event callback that is raised when the TreeView control is destroyed successfully.
     *
     * @event destroyed
     */
    @Event()
    public destroyed: EmitType<Object>;

    /**
     * Event callback that is raised when key press is successful. It helps to customize the operations at key press.
     *
     * @event keyPress
     */
    @Event()
    public keyPress: EmitType<NodeKeyPressEventArgs>;

    /**
     * Event callback that is raised when the TreeView node is checked/unchecked successfully.
     *
     * @event nodeChecked
     */
    @Event()
    public nodeChecked: EmitType<NodeCheckEventArgs>;

    /**
     * Event callback that is raised before the TreeView node is to be checked/unchecked.
     *
     * @event nodeChecking
     */
    @Event()
    public nodeChecking: EmitType<NodeCheckEventArgs>;

    /**
     * Event callback that is raised when the TreeView node is clicked successfully.
     *
     * @event nodeClicked
     */
    @Event()
    public nodeClicked: EmitType<NodeClickEventArgs>;

    /**
     * Event callback that is raised when the TreeView node collapses successfully.
     *
     * @event nodeCollapsed
     */
    @Event()
    public nodeCollapsed: EmitType<NodeExpandEventArgs>;

    /**
     * Event callback that is raised before the TreeView node collapses.
     *
     * @event nodeCollapsing
     */
    @Event()
    public nodeCollapsing: EmitType<NodeExpandEventArgs>;

    /**
     * Event callback that is raised when the TreeView node is dragged (moved) continuously.
     *
     * @deprecated
     * @event nodeDragging
     */
    @Event()
    public nodeDragging: EmitType<DragAndDropEventArgs>;
    /**
     * Event callback that is raised when the TreeView node drag (move) starts.
     *
     * @event nodeDragStart
     */
    @Event()
    public nodeDragStart: EmitType<DragAndDropEventArgs>;
    /**
     * Event callback that is raised when the TreeView node drag (move) is stopped.
     *
     * @event nodeDragStop
     */
    @Event()
    public nodeDragStop: EmitType<DragAndDropEventArgs>;
    /**
     * Event callback that is raised when the TreeView node is dropped on target element successfully.
     *
     * @event nodeDropped
     */
    @Event()
    public nodeDropped: EmitType<DragAndDropEventArgs>;

    /**
     * Event callback that is raised when the TreeView node is renamed successfully.
     *
     * @event nodeEdited
     */
    @Event()
    public nodeEdited: EmitType<NodeEditEventArgs>;

    /**
     * Event callback that is raised before the TreeView node is renamed.
     *
     * @event nodeEditing
     */
    @Event()
    public nodeEditing: EmitType<NodeEditEventArgs>;

    /**
     * Event callback that is raised when the TreeView node expands successfully.
     *
     * @event nodeExpanded
     */
    @Event()
    public nodeExpanded: EmitType<NodeExpandEventArgs>;

    /**
     * Event callback that is raised before the TreeView node is to be expanded.
     *
     * @event nodeExpanding
     */
    @Event()
    public nodeExpanding: EmitType<NodeExpandEventArgs>;

    /**
     * Event callback that is raised when the TreeView node is selected/unselected successfully.
     *
     * @event nodeSelected
     */
    @Event()
    public nodeSelected: EmitType<NodeSelectEventArgs>;

    /**
     * Event callback that is raised before the TreeView node is selected/unselected.
     *
     * @event nodeSelecting
     */
    @Event()
    public nodeSelecting: EmitType<NodeSelectEventArgs>;
    isFilter: boolean;

    constructor(options?: TreeViewModel, element?: string | HTMLElement) {
        super(options, <HTMLElement | string>element);
    }

    /**
     * Get component name.
     *
     * @returns {string} - returns module name.
     * @private
     */
    public getModuleName(): string {
        return 'treeview';
    }

    /**
     * Initialize the event handler
     *
     * @returns {void}
     */
    protected preRender(): void {
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
            shiftSpace: 'shift+space',
            ctrlSpace: 'ctrl+space'
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
            itemNavigable: this.fullRowNavigable
        };
        this.updateListProp(this.fields);
        this.aniObj = new Animation({});
        this.treeList = [];
        this.isLoaded = false;
        this.isInitalExpand = false;
        this.expandChildren = [];
        this.index = 0;
        this.setTouchClass();
        this.DDTTreeData = JSON.parse(JSON.stringify(this.fields.dataSource));
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
     *
     * @returns {string} - returns the persisted data
     * @hidden
     */
    public getPersistData(): string {
        const keyEntity: string[] = ['selectedNodes', 'checkedNodes', 'expandedNodes'];
        return this.addOnPersist(keyEntity);
    }

    /**
     * To Initialize the control rendering
     *
     * @private
     * @returns {void}
     */
    protected render(): void {
        this.initialRender = true;
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
        this.initialRender = false;
        this.renderComplete();
    }

    private initialize(): void {
        this.element.setAttribute('role', 'tree');
        if (!isNOU(this.fields.dataSource) && Array.isArray(this.fields.dataSource) && this.fields.dataSource.length !== 0) {
            this.element.setAttribute('aria-activedescendant', this.element.id + '_active');
        }
        this.setCssClass(null, this.cssClass);
        this.setEnableRtl();
        this.setFullRow(this.fullRowSelect);
        this.setTextWrap();
        this.nodeTemplateFn = this.templateComplier(this.nodeTemplate);
    }
    private setDisabledMode(): void {
        if (this.disabled) {
            this.element.classList.add(DISABLED);
            this.element.setAttribute('aria-disabled', 'true');
        } else {
            this.element.classList.remove(DISABLED);
            this.element.setAttribute('aria-disabled', 'false');
        }
    }
    private setEnableRtl(): void {
        (this.enableRtl ? addClass : removeClass)([this.element], RTL);
    }

    private setRipple(): void {
        const tempStr: string = '.' + FULLROW + ',.' + TEXTWRAP;
        const rippleModel: RippleOptions = {
            selector: tempStr,
            ignore: '.' + TEXTWRAP + ' > .' + ICON + ',.' + INPUTGROUP + ',.' + INPUT + ', .' + CHECKBOXWRAP
        };
        this.rippleFn = rippleEffect(this.element, rippleModel);
        const iconModel: RippleOptions = {
            selector: '.' + TEXTWRAP + ' > .' + ICON,
            isCenterRipple: true
        };
        this.rippleIconFn = rippleEffect(this.element, iconModel);
    }

    private setFullRow(isEnabled: boolean): void {
        (isEnabled ? addClass : removeClass)([this.element], FULLROWWRAP);
    }

    private setMultiSelect(isEnabled: boolean): void {
        if (isEnabled) {
            this.element.setAttribute('aria-multiselectable', 'true');
        } else {
            this.element.setAttribute('aria-multiselectable', 'false');
        }
    }

    private templateComplier(template: string | Function): Function {
        if (template) {
            this.hasTemplate = true;
            this.element.classList.add(INTERACTION);
            try {
                if (typeof template !== 'function' && document.querySelectorAll(template).length) {
                    return compile(document.querySelector(template).innerHTML.trim());
                } else {
                    return compile(template);
                }
            } catch (e) {
                return compile(template);
            }
        }
        this.element.classList.remove(INTERACTION);
        return undefined;
    }

    private setDataBinding(changeDataSource: boolean): void {
        this.treeList.push('false');
        if (this.fields.dataSource instanceof DataManager) {
            this.isOffline = (this.fields.dataSource as DataManager).dataSource.offline;
            if ((this.fields.dataSource as DataManager).ready) {
                (this.fields.dataSource as DataManager).ready.then((e: Object) => {

                    this.isOffline = (this.fields.dataSource as DataManager).dataSource.offline;
                    if (this.fields.dataSource instanceof DataManager && this.isOffline) {
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
        const columns: string[] = [];
        let query: Query;
        if (!mapper.query) {
            query = new Query();
            const prop: FieldsSettingsModel = this.getActualProperties(mapper);
            for (const col of Object.keys(prop)) {
                if (col !== 'dataSource' && col !== 'tableName' && col !== 'child' && !!(mapper as { [key: string]: Object })[`${col}`]
                    && col !== 'url' && columns.indexOf((mapper as { [key: string]: string })[`${col}`]) === -1) {
                    columns.push((mapper as { [key: string]: string })[`${col}`]);
                }
            }
            query.select(columns);
            if (Object.prototype.hasOwnProperty.call(prop, 'tableName')) {
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
            const rootItems: { [key: string]: Object }[] = this.getChildNodes(this.treeData, undefined, true);
            if (isNOU(rootItems)) {
                this.rootData = [];
            } else {
                this.rootData = rootItems;
            }
        } else {
            this.rootData = this.treeData;
        }
    }

    private isChildObject(): boolean {
        if (typeof this.fields.child === 'object') {
            return true;
        } else {
            return false;
        }
    }

    private renderItems(isSorted: boolean): void {

        this.listBaseOption.ariaAttributes.level = 1;
        const sortedData: { [key: string]: Object }[] = this.getSortedData(this.rootData);
        this.ulElement = ListBase.createList(this.createElement, isSorted ? this.rootData : sortedData, this.listBaseOption);
        this.element.appendChild(this.ulElement);
        const rootNodes: NodeListOf<Element> = this.ulElement.querySelectorAll('.e-list-item');
        if (this.loadOnDemand === false) {
            let i: number = 0;
            while (i < rootNodes.length) {
                this.renderChildNodes(rootNodes[parseInt(i.toString(), 10)], true, null, true);
                i++;
            }
        }
        const parentEle: HTMLElement[] = selectAll('.' + PARENTITEM, this.element);
        if ((parentEle.length === 1 && (rootNodes && rootNodes.length !== 0)) || this.loadOnDemand) {
            this.finalizeNode(this.element);
        }
        this.parentNodeCheck = [];
        this.parentCheckData = [];
        this.updateCheckedStateFromDS();
        if (this.autoCheck && this.showCheckBox && !this.isLoaded) {
            this.updateParentCheckState();
        }
    }

    /**
     * Update the checkedNodes from datasource at initial rendering
     *
     * @returns {void}
     */
    private updateCheckedStateFromDS(): void {
        this.validNodes = [];
        if (this.treeData && this.showCheckBox) {
            if (this.dataType === 1) {
                const mapper: FieldsSettingsModel = this.fields;
                const resultData: { [key: string]: Object }[] = <{ [key: string]: Object }[]>new DataManager(this.treeData).executeLocal(
                    new Query().where(mapper.isChecked, 'equal', true, false));
                for (let i: number = 0; i < resultData.length; i++) {
                    const resultId: string = resultData[parseInt(i.toString(), 10)][this.fields.id]
                        ? resultData[parseInt(i.toString(), 10)][this.fields.id].toString()
                        : null;
                    if (this.checkedNodes.indexOf(resultId) === -1 && !(this.isLoaded)) {
                        this.checkDisabledState(resultId, resultData[i as number]);
                    }

                    if (resultData[parseInt(i.toString(), 10)][this.fields.hasChildren]) {
                        const id: number = <number>resultData[parseInt(i.toString(), 10)][this.fields.id];
                        const childData: { [key: string]: Object }[] = <{ [key: string]: Object }[]>new DataManager(this.treeData).
                            executeLocal(new Query().where(mapper.parentID, 'equal', id, false));
                        for (let child: number = 0; child < childData.length; child++) {
                            const childId: string = childData[parseInt(child.toString(), 10)][this.fields.id]
                                ? childData[parseInt(child.toString(), 10)][this.fields.id].toString()
                                : null;
                            if (this.checkedNodes.indexOf(childId) === -1 && this.autoCheck) {
                                this.checkDisabledState(childId, childData[child as number]);
                            }
                        }
                    }
                }
                for (let i: number = 0; i < this.checkedNodes.length; i++) {
                    const mapper: FieldsSettingsModel = this.fields;
                    const checkState: { [key: string]: Object }[] = <{ [key: string]: Object }[]>new DataManager(this.treeData).
                        executeLocal(new Query().where(mapper.id, 'equal', this.checkedNodes[parseInt(i.toString(), 10)], true));
                    if (checkState[0] && this.autoCheck) {
                        this.getCheckedNodeDetails(mapper, checkState);
                        this.checkIndeterminateState(checkState[0]);
                    }
                    if (checkState.length > 0) {
                        const checkedId: string = checkState[0][this.fields.id] ? checkState[0][this.fields.id].toString() : null;
                        if (this.checkedNodes.indexOf(checkedId) > -1 && this.validNodes.indexOf(checkedId) === -1) {
                            this.validNodes.push(checkedId);
                        }
                    }
                    const checkedData: { [key: string]: Object }[] = <{ [key: string]: Object }[]>new DataManager(this.treeData).
                        executeLocal(new Query().where(mapper.parentID, 'equal', this.checkedNodes[parseInt(i.toString(), 10)], true));
                    for (let index: number = 0; index < checkedData.length; index++) {
                        const checkedId: string = checkedData[parseInt(index.toString(), 10)][this.fields.id]
                            ? checkedData[parseInt(index.toString(), 10)][this.fields.id].toString()
                            : null;
                        if (this.checkedNodes.indexOf(checkedId) === -1 && this.autoCheck) {
                            this.checkDisabledState(checkedId, checkedData[index as number]);
                        }
                        if (this.checkedNodes.indexOf(checkedId) > -1 && this.validNodes.indexOf(checkedId) === -1) {
                            this.validNodes.push(checkedId);
                        }
                    }
                }
            } else if (this.dataType === 2 || (this.fields.dataSource instanceof DataManager &&
                this.isOffline)) {
                for (let index: number = 0; index < this.treeData.length; index++) {
                    const fieldId: string = this.treeData[parseInt(index.toString(), 10)][this.fields.id] ? this.treeData[parseInt(index.toString(), 10)][this.fields.id].toString() : '';
                    if (this.treeData[parseInt(index.toString(), 10)][this.fields.isChecked] &&
                        !(this.isLoaded) && this.checkedNodes.indexOf(fieldId) === -1) {
                        this.checkDisabledState(fieldId, this.treeData[index as number]);
                    }
                    if (this.checkedNodes.indexOf(fieldId) > -1 && this.validNodes.indexOf(fieldId) === -1) {
                        this.validNodes.push(fieldId);
                    }
                    const childItems: { [key: string]: Object }[] = getValue(
                        this.fields.child.toString(),
                        this.treeData[parseInt(index.toString(), 10)]
                    );
                    if (childItems) {
                        this.updateChildCheckState(childItems, this.treeData[parseInt(index.toString(), 10)]);
                    }
                }
                this.validNodes = (this.enablePersistence) ? this.checkedNodes : this.validNodes;
            }
            this.setProperties({ checkedNodes: this.validNodes }, true);
        }
    }
    /**
     * To check whether the list data has sub child and to change the parent check state accordingly
     *
     * @param {FieldsSettingsModel} mapper - The mapper object containing field settings.
     * @param {Object[]} checkNodes - The array of checked nodes.
     * @returns {void}
     * @private
     */
    private getCheckedNodeDetails(mapper: FieldsSettingsModel, checkNodes: { [key: string]: Object }[]): void {
        const id: string = checkNodes[0][this.fields.parentID] ? checkNodes[0][this.fields.parentID].toString() : null;
        let count: number = 0;
        const element: Element = this.element.querySelector('[data-uid="' + checkNodes[0][this.fields.id] + '"]');
        const parentEle: Element = this.element.querySelector('[data-uid="' + checkNodes[0][this.fields.parentID] + '"]');
        if (!element && !parentEle) {
            if (this.parentNodeCheck.indexOf(id) === -1) {
                this.parentNodeCheck.push(id);
            }
            const childNodes: { [key: string]: Object }[] = this.getChildNodes(this.treeData, id);
            for (let i: number = 0; i < childNodes.length; i++) {
                const childId: string = childNodes[parseInt(i.toString(), 10)][this.fields.id]
                    ? childNodes[parseInt(i.toString(), 10)][this.fields.id].toString()
                    : null;
                if (this.checkedNodes.indexOf(childId) !== -1) {
                    count++;
                }
                if (count === childNodes.length && this.checkedNodes.indexOf(id) === -1) {
                    this.checkDisabledState(id);
                }
            }
            const preElement: { [key: string]: Object }[] = <{ [key: string]: Object }[]>new DataManager(this.treeData).
                executeLocal(new Query().where(mapper.id, 'equal', id, true));
            this.getCheckedNodeDetails(mapper, preElement);
        } else if (parentEle) {
            const check: Element = select('.' + CHECK, parentEle);
            if (!check) {
                this.changeState(parentEle, 'indeterminate', null, true, true);
            }
        }
    }
    /**
     * Update the checkedNodes and parent state when all the child Nodes are in checkedstate at initial rendering
     *
     * @returns {void}
     * @private
     */
    private updateParentCheckState(): void {
        const indeterminate: Element[] = selectAll('.' + INDETERMINATE, this.element);
        let childCheckedElement: { [key: string]: Object }[];
        let data: { [key: string]: Object }[] = this.treeData;
        if (this.element.classList.contains('e-filtering')) {
            data = this.DDTTreeData;
        }
        for (let i: number = 0; i < indeterminate.length; i++) {
            const node: Element = closest(indeterminate[parseInt(i.toString(), 10)], '.' + LISTITEM);
            const nodeId: string = node.getAttribute('data-uid').toString();
            let OldCheckedNodes: { [key: string]: Object; }[];
            if (this.element.classList.contains('e-filtering')) {
                OldCheckedNodes = <{ [key: string]: Object }[]>new DataManager(this.OldCheckedData).executeLocal(new Query().where('parentID', 'equal', nodeId, true));
            }
            if (this.dataType === 1) {
                childCheckedElement = <{ [key: string]: Object }[]>new DataManager(data).
                    executeLocal(new Query().where(this.fields.parentID, 'equal', nodeId, true));
            } else {
                childCheckedElement = this.getChildNodes(data, nodeId);
            }
            let count: number = 0;
            if (childCheckedElement) {
                for (let j: number = 0; j < childCheckedElement.length; j++) {
                    const childId: string = childCheckedElement[parseInt(j.toString(), 10)][this.fields.id].toString();
                    if (this.checkedNodes.indexOf(childId) !== -1) {
                        count++;
                    }
                    else if (this.element.classList.contains('e-filtering') && OldCheckedNodes.findIndex((e: { [key: string]: Object; }) => e['id'] === childId) !== -1) {
                        count++;
                    }
                }
                if (count === childCheckedElement.length) {
                    const nodeCheck: string = node.getAttribute('data-uid');
                    if (this.checkedNodes.indexOf(nodeCheck) === -1) {
                        this.checkDisabledState(nodeCheck);
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
     *
     * @param {Object} data - The data object to check for indeterminate state.
     * @returns {void}
     * @private
     */
    private checkIndeterminateState(data: { [key: string]: Object }): void {
        let element: Element;
        if (this.dataType === 1) {
            element = this.element.querySelector('[data-uid="' + data[this.fields.parentID] + '"]');
        } else {
            element = this.element.querySelector('[data-uid="' + data[this.fields.id] + '"]');
        }
        if (element) {
            const ariaChecked: string = element.getAttribute('aria-checked');
            if (ariaChecked !== 'true') {
                this.changeState(element, 'indeterminate', null, true, true);
            }
        } else if (this.dataType === 2) {
            if (this.parentNodeCheck.indexOf(data[this.fields.id].toString()) === -1) {
                this.parentNodeCheck.push(data[this.fields.id].toString());
            }
        }
    }
    /**
     * Update the checkedNodes for child and subchild from datasource (hierarchical datasource) at initial rendering
     *
     * @param {Object[]} childItems - The array of child items to update the checked state.
     * @param {Object} treeData - The tree data object containing field values.
     * @returns {void}
     * @private
     */
    private updateChildCheckState(childItems: { [key: string]: Object }[], treeData: { [key: string]: Object }): void {
        let count: number = 0;
        const checkedParent: string = treeData[this.fields.id] ? treeData[this.fields.id].toString() : '';
        for (let index: number = 0; index < childItems.length; index++) {
            const checkedChild: string = childItems[parseInt(index.toString(), 10)][this.fields.id] ? childItems[parseInt(index.toString(), 10)][this.fields.id].toString() : '';
            if (childItems[parseInt(index.toString(), 10)][this.fields.isChecked] &&
                !(this.isLoaded) && this.checkedNodes.indexOf(checkedChild) === -1) {
                this.checkDisabledState(checkedChild, childItems[index as number]);
            }
            if (this.checkedNodes.indexOf(checkedParent) !== -1 && this.checkedNodes.indexOf(checkedChild) === -1 && this.autoCheck) {
                this.checkDisabledState(checkedChild, childItems[index as number]);
            }
            if (this.checkedNodes.indexOf(checkedChild) !== -1 && this.autoCheck) {
                count++;
            }
            if (this.checkedNodes.indexOf(checkedChild) > -1 && this.validNodes.indexOf(checkedChild) === -1) {
                this.validNodes.push(checkedChild);
            }
            const subChildItems: { [key: string]: Object }[] = getValue(
                this.fields.child.toString(),
                childItems[parseInt(index.toString(), 10)]
            );
            if (subChildItems && subChildItems.length) {
                if (this.parentCheckData.indexOf(treeData) === -1) {this.parentCheckData.push(treeData); }
                this.updateChildCheckState(subChildItems, childItems[parseInt(index.toString(), 10)]);
            }
            if (count === childItems.length && this.autoCheck && this.checkedNodes.indexOf(checkedParent) === -1) {
                this.checkDisabledState(checkedParent, treeData);
            }
        }
        if (count !== 0 && this.autoCheck) {
            this.checkIndeterminateState(treeData);
            for (let len: number = 0; len < this.parentCheckData.length; len++) {
                if ((treeData !== this.parentCheckData[parseInt(len.toString(), 10)]) &&
                    (this.parentCheckData[parseInt(len.toString(), 10)])) {
                    this.checkIndeterminateState(this.parentCheckData[parseInt(len.toString(), 10)]);
                }
            }
        }
        this.parentCheckData = [];
    }

    private beforeNodeCreate(e: ItemCreatedArgs): void {
        if (this.showCheckBox) {
            const checkboxEle: Element = createCheckBox(this.createElement, true, { cssClass: this.touchClass });
            checkboxEle.classList.add(CHECKBOXWRAP);
            const icon: Element = select('div.' + EXPANDABLE + ', div.' + COLLAPSIBLE, e.item);
            const id: string = e.item.getAttribute('data-uid');
            e.item.childNodes[0].insertBefore(checkboxEle, e.item.childNodes[0].childNodes[isNOU(icon) ? 0 : 1]);
            const checkValue: Object = getValue(e.fields.isChecked, e.curData);
            if (this.checkedNodes.indexOf(id) > -1) {
                select('.' + CHECKBOXFRAME, checkboxEle).classList.add(CHECK);
                e.item.setAttribute('aria-checked', 'true');
                this.addCheck(e.item);
            } else if (!isNOU(checkValue) && checkValue.toString() === 'true') {
                select('.' + CHECKBOXFRAME, checkboxEle).classList.add(CHECK);
                e.item.setAttribute('aria-checked', 'true');
                this.addCheck(e.item);
            } else {
                e.item.setAttribute('aria-checked', 'false');
            }
            const frame: Element = select('.' + CHECKBOXFRAME, checkboxEle);
            EventHandler.add(frame, 'mousedown', this.frameMouseHandler, this);
            EventHandler.add(frame, 'mouseup', this.frameMouseHandler, this);
        }
        if (this.fullRowSelect) {
            this.createFullRow(e.item);
        }
        if (this.allowMultiSelection && !e.item.classList.contains(SELECTED)) {
            e.item.setAttribute('aria-selected', 'false');
        }
        const fields: FieldsMapping = e.fields;
        this.addActionClass(e, fields.selected, SELECTED);
        this.addActionClass(e, fields.expanded, EXPANDED);
        e.item.setAttribute('tabindex', '-1');
        EventHandler.add(e.item, 'focus', this.focusIn, this);
        if (!isNOU(this.nodeTemplateFn)) {
            const textEle: Element = e.item.querySelector('.' + LISTTEXT);
            const dataId: string = e.item.getAttribute('data-uid');
            textEle.innerHTML = '';
            this.renderNodeTemplate(e.curData, textEle, dataId);
        }
        const eventArgs: DrawNodeEventArgs = {
            node: e.item as HTMLLIElement,
            nodeData: e.curData,
            text: e.text
        };
        if (!this.isRefreshed) {
            this.trigger('drawNode', eventArgs);
            if (e.curData[this.fields.selectable] === false && !this.showCheckBox) {
                e.item.classList.add(PREVENTSELECT);
                const firstChild: HTMLElement = e.item.firstElementChild as HTMLElement;
                firstChild.style.cursor = 'not-allowed';
            }
        }
    }

    private frameMouseHandler(e: MouseEvent): void {
        const rippleSpan: Element = select('.' + CHECKBOXRIPPLE, (e.target as Element).parentElement);
        rippleMouseHandler(e, rippleSpan);
    }

    private addActionClass(e: ItemCreatedArgs, action: string, cssClass: string): void {
        const data: { [key: string]: Object } = e.curData;
        const actionValue: Object = getValue(action, data);
        if (!isNOU(actionValue) && actionValue.toString() !== 'false') {
            e.item.classList.add(cssClass);
        }
    }

    private getDataType(ds: { [key: string]: Object }[], mapper: FieldsSettingsModel): number {
        if (this.fields.dataSource instanceof DataManager) {
            for (let i: number = 0; i < ds.length; i++) {
                if (this.isOffline) {
                    if ((typeof mapper.child === 'string') && isNOU(getValue(mapper.child, ds[parseInt(i.toString(), 10)])) && !isNOU(getValue(mapper.parentID, ds[parseInt(i.toString(), 10)]))) {
                        return 1;
                    }
                }
                else if ((typeof mapper.child === 'string') && isNOU(getValue(mapper.child, ds[parseInt(i.toString(), 10)]))) {
                    return 1;
                }
            }
            return 2;
        }
        for (let i: number = 0, len: number = ds.length; i < len; i++) {
            if ((typeof mapper.child === 'string') && (!isNOU(getValue(mapper.child, ds[parseInt(i.toString(), 10)])) || (Object.prototype.hasOwnProperty.call(ds[parseInt(i.toString(), 10)], mapper.child)))) {
                return 2;
            }
            if (this.isChildObject()) {
                return 2;
            }
            if (!isNOU(getValue(mapper.parentID, ds[parseInt(i.toString(), 10)])) ||
                !isNOU(getValue(mapper.hasChildren, ds[parseInt(i.toString(), 10)]))) {
                return 1;
            }
        }
        return 1;
    }

    private getGroupedData(dataSource: { [key: string]: Object }[], groupBy: string): { [key: string]: Object }[][] {
        const cusQuery: Query = new Query().group(groupBy);
        const ds: { [key: string]: Object }[] = ListBase.getDataSource(dataSource, cusQuery);
        const grpItem: { [key: string]: Object }[][] = [];
        for (let j: number = 0; j < ds.length; j++) {
            const itemObj: { [key: string]: Object }[] =
                (ds[parseInt(j.toString(), 10)] as { items: { [key: string]: Object }[] } & { [key: string]: Object }).items;
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

    private finalizeNode(element: Element | Document, isFromExpandAll?: boolean, expandChild?: boolean): void {
        if (!isFromExpandAll) {
            this.updateAttributes(element);
        }
        if (!expandChild) {
            const eNodes: HTMLElement[] = selectAll('.' + EXPANDED, element);
            if (!this.loadOnDemand && this.fields.dataSource instanceof DataManager) {
                this.isInitalExpand = this.treeData.filter((e: { [key: string]: Object }) => e[this.fields.expanded] === true).length > 0
                    ? true
                    : this.isInitalExpand;
            }
            if (!this.isInitalExpand) {
                for (let i: number = 0; i < eNodes.length; i++) {
                    this.renderChildNodes(eNodes[parseInt(i.toString(), 10)]);
                }
            }
            removeClass(eNodes, EXPANDED);
        }
        if (!isFromExpandAll) {
            this.updateList();
        }
        if (this.isLoaded) {
            this.updateCheckedProp();
        }
    }

    private updateAttributes(element: Element | Document): void {
        const iNodes: HTMLElement[] = selectAll('.' + IMAGE, element);
        for (let k: number = 0; k < iNodes.length; k++) {
            iNodes[parseInt(k.toString(), 10)].setAttribute('alt', IMAGE);
        }
        if (this.isLoaded) {
            const sNodes: HTMLElement[] = selectAll('.' + SELECTED, element);
            for (let i: number = 0; i < sNodes.length; i++) {
                this.selectNode(sNodes[parseInt(i.toString(), 10)], null);
                break;
            }
            removeClass(sNodes, SELECTED);
        }
        const cNodes: HTMLElement[] = selectAll('.' + LISTITEM + ':not(.' + EXPANDED + ')', element);
        for (let j: number = 0; j < cNodes.length; j++) {
            const icon: Element = select('div.' + ICON, cNodes[parseInt(j.toString(), 10)]);
            if (icon && icon.classList.contains(EXPANDABLE)) {
                this.disableExpandAttr(cNodes[parseInt(j.toString(), 10)]);
            }
        }
    }

    private updateCheckedProp(): void {
        if (this.showCheckBox) {
            const nodes: string[] = [].concat([], this.checkedNodes);
            this.setProperties({ checkedNodes: nodes }, true);
        }
    }

    private ensureIndeterminate(): void {
        if (this.autoCheck) {
            const liElement: HTMLElement[] = selectAll('li', this.element);
            let ulElement: Element;
            for (let i: number = 0; i < liElement.length; i++) {
                if (liElement[parseInt(i.toString(), 10)].classList.contains(LISTITEM)) {
                    ulElement = select('.' + PARENTITEM, liElement[parseInt(i.toString(), 10)]);
                    if (ulElement) {
                        this.ensureParentCheckState(liElement[parseInt(i.toString(), 10)]);
                    } else {
                        this.ensureChildCheckState(liElement[parseInt(i.toString(), 10)]);
                    }
                }
            }
        } else {
            const indeterminate: Element[] = selectAll('.' + INDETERMINATE, this.element);
            for (let i: number = 0; i < indeterminate.length; i++) {
                indeterminate[parseInt(i.toString(), 10)].classList.remove(INDETERMINATE);
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
            const checkedNodes: HTMLElement[] = selectAll('.' + CHECKBOXWRAP + ' .' + CHECK, ulElement);
            const indeterminateNodes: HTMLElement[] = selectAll('.' + INDETERMINATE, ulElement);
            const nodes: HTMLElement[] = selectAll(this.checkDisabledChildren ? '.' + LISTITEM : '.' + LISTITEM + ':not(.' + DISABLE + ')', ulElement);
            const checkBoxEle: Element = element.getElementsByClassName(CHECKBOXWRAP)[0];
            let count: number = nodes.length;
            let checkedCount: number = checkedNodes.length;
            let matchedChildNodes: { [key: string]: Object }[] = [];
            let oldChildCount: { [key: string]: Object }[] = [];
            const dataUid: string = element.getAttribute('data-uid');
            let rootNodeChecked: boolean = true;
            let childNodeChecked: boolean = false;
            nodes.forEach((childNode: HTMLElement) => {
                if (childNode instanceof HTMLElement) {
                    const ariaChecked: string = childNode.getAttribute('aria-checked');
                    if (ariaChecked === 'true') {
                        childNodeChecked = true;
                    } else {
                        rootNodeChecked = false;
                    }
                }
            });
            let parentNodeChecked: boolean = false;
            if (this.element.classList.contains('e-filtering')) {
                const oldCheckedNodes: { [key: string]: Object }[] = <{ [key: string]: Object }[]>new DataManager(this.OldCheckedData).executeLocal(new Query().where('parentID', 'equal', dataUid, true));
                checkedCount = oldCheckedNodes.length;
                const parentNode: { [key: string]: Object }[] = <{ [key: string]: Object }[]>new DataManager(this.OldCheckedData).executeLocal(new Query().where('hasChildren', 'equal', true, true));
                if (parentNode.length > 0 && childNodeChecked && (
                    (this.OldCheckedData.some((oldNode: { id: string }) => oldNode.id === dataUid)) ||
                    this.parentNodeCheck.indexOf(dataUid) !== -1)) {
                    checkedCount = parentNode.length;
                    parentNodeChecked = true;
                }
                let childItems: { [key: string]: Object }[] = [];
                if (this.dataType === 1) {
                    childItems = <{ [key: string]: Object }[]>new DataManager(this.DDTTreeData).executeLocal(new Query().where(this.fields.parentID, 'equal', dataUid, true));
                }
                else {
                    childItems = this.getChildNodes(this.DDTTreeData, dataUid);
                }
                count = childItems.length;
            }

            if (this.autoCheck && this.showCheckBox && !(this.fields.dataSource instanceof DataManager)) {
                const selectedChildNodeDetails: { [key: string]: object }[] = this.getSelectedChildNodeDetails(dataUid);
                matchedChildNodes = selectedChildNodeDetails;
                oldChildCount = <{ [key: string]: Object }[]> new DataManager(this.checkActionNodes)
                    .executeLocal(new Query().where('parentID', 'equal', dataUid, true));
            }

            if (count === 0 && checkedCount === 0) {
                return;
            }
            else if (count === checkedCount || ((parentNodeChecked && count > 0) && ((oldChildCount.length === matchedChildNodes.length)
                || (oldChildCount.length !== matchedChildNodes.length))
                && (oldChildCount.length !== 0 && matchedChildNodes.length !== 0) && rootNodeChecked
                && (this.autoCheck && this.showCheckBox))) {
                this.changeState(checkBoxEle, 'check', null, true, true);
            }
            else if ((checkedCount > 0 && !parentNodeChecked && (this.autoCheck && this.showCheckBox))) {
                this.changeState(checkBoxEle, 'indeterminate', null, true, true);
            }
            else if (checkedCount > 0 || indeterminateNodes.length > 0) {
                this.changeState(checkBoxEle, 'indeterminate', null, true, true);
            } else if (checkedCount === 0) {
                this.changeState(checkBoxEle, 'uncheck', null, true, true);
            }
            const parentUL: Element = closest(element, '.' + PARENTITEM);
            if (!isNOU(parentUL)) {
                const currentParent: Element = closest(parentUL, '.' + LISTITEM);
                this.ensureParentCheckState(currentParent);
            }
        }
    }

    private getSelectedChildNodeDetails(dataUid: string): {[key: string]: Object}[] {
        const childKey: string = typeof this.fields.child === 'string' ? this.fields.child : null;
        const dataId: string = this.fields.id;
        const parentKey: string = this.fields.parentID;

        const matchesDataUid: (childNode: { [key: string]: any }) => boolean = (childNode: { [key: string]: any }): boolean => {
            if (!isNOU(childKey) && childKey in childNode && Array.isArray(childNode[childKey as keyof typeof childNode])) {
                const matchNode: string = childNode[dataId as keyof typeof childNode];
                if (!isNOU(matchNode)) {
                    return matchNode.toString() === dataUid;
                }
            } else {
                const childNodePid: string = childNode[parentKey as keyof typeof childNode];
                if (!isNOU(childNodePid)) {
                    return childNodePid.toString() === dataUid;
                }
            }
            return false;
        };

        return this.checkedNodes
            .map((checkedNodeId: string): { [key: string]: any } => {
                return this.getNodeObject(checkedNodeId);
            })
            .filter((childNode: object | null | undefined): boolean => {
                if (childNode && typeof childNode === 'object' && (childKey in childNode)) {
                    return matchesDataUid(childNode);
                } else if (this.dataType !== 2 && typeof childNode === 'object' && (parentKey in childNode || childKey in childNode)) {
                    return matchesDataUid(childNode);
                }
                return false;
            });
    }
    private ensureChildCheckState(element: Element | Document, e?: MouseEvent | KeyboardEventArgs, isFromExpandAll?: boolean): void {
        if (!isNOU(element)) {
            const childElement: Element = select('.' + PARENTITEM, element);
            let checkBoxes: HTMLElement[];
            if (!isNOU(childElement)) {
                let childCheck: HTMLElement[] = Array.from(childElement.querySelectorAll('li') as NodeListOf<HTMLElement>);
                checkBoxes = selectAll('.' + CHECKBOXWRAP, childElement);
                if (this.isFilter) {
                    checkBoxes = Array.from(checkBoxes).filter((checkbox: Element) => {
                        const dataUID: string | null = checkbox.closest('li').getAttribute('data-uid');
                        return dataUID !== null && this.checkedNodes.indexOf(dataUID) !== -1;
                    });

                    childCheck = Array.from(childCheck).filter((li: HTMLElement) => {
                        const childIds: string | null = li.getAttribute('data-uid');
                        return childIds !== null && this.checkedNodes.indexOf(childIds) !== -1;
                    });

                    if (checkBoxes.length === 0) {
                        checkBoxes = selectAll('.' + CHECKBOXWRAP, childElement);
                        childCheck = Array.from(childElement.querySelectorAll('li') as NodeListOf<HTMLElement>);
                    }
                }
                const isChecked: boolean = element.getElementsByClassName(CHECKBOXFRAME)[0].classList.contains(CHECK);
                const parentCheck: boolean = element.getElementsByClassName(CHECKBOXFRAME)[0].classList.contains(INDETERMINATE);
                let checkedState: string;
                for (let index: number = 0; index < checkBoxes.length; index++) {
                    const childId: string = childCheck[parseInt(index.toString(), 10)].getAttribute('data-uid');
                    if (!isNOU(this.currentLoadData) &&
                        !isNOU(getValue(this.fields.isChecked, this.currentLoadData[parseInt(index.toString(), 10)]))) {
                        checkedState = getValue(this.fields.isChecked, this.currentLoadData[parseInt(index.toString(), 10)]) ? 'check' : 'uncheck';
                        if (this.ele !== -1) {
                            checkedState = isChecked ? 'check' : 'uncheck';
                        }
                        if ((checkedState === 'uncheck') && (!isUndefined(this.parentNodeCheck) && this.autoCheck
                            && this.parentNodeCheck.indexOf(childId) !== -1)) {
                            this.parentNodeCheck.splice(this.parentNodeCheck.indexOf(childId), 1);
                            checkedState = 'indeterminate';
                        }
                    } else {
                        const isNodeChecked: boolean = checkBoxes[parseInt(index.toString(), 10)]
                            .getElementsByClassName(CHECKBOXFRAME)[0]
                            .classList.contains(CHECK);
                        if (isChecked) {
                            checkedState = 'check';
                        } else if (isNodeChecked && !this.isLoaded) {
                            checkedState = 'check';
                        } else if (this.checkedNodes.indexOf(childId) !== -1 && this.isLoaded && (parentCheck || isChecked)) {
                            checkedState = 'check';
                        } else if (childCheck[parseInt(index.toString(), 10)].classList.contains(CHILD) &&
                            (!isUndefined(this.parentNodeCheck) && this.autoCheck
                            && (isChecked || parentCheck) && this.parentNodeCheck.indexOf(childId) !== -1)) {
                            checkedState = 'indeterminate';
                            this.parentNodeCheck.splice(this.parentNodeCheck.indexOf(childId), 1);
                        } else if (this.dataType === 1 && (!isUndefined(this.parentNodeCheck) && this.autoCheck &&
                            (isChecked || parentCheck) && this.parentNodeCheck.indexOf(childId) !== -1)) {
                            checkedState = 'indeterminate';
                            this.parentNodeCheck.splice(this.parentNodeCheck.indexOf(childId), 1);
                        } else {
                            checkedState = 'uncheck';
                        }
                    }
                    this.changeState(checkBoxes[parseInt(index.toString(), 10)], checkedState, e, true, true);
                }
            }
            if (this.autoCheck && this.isLoaded && !isFromExpandAll) {
                this.updateParentCheckState();
            }
        }
    }
    private doCheckBoxAction(nodes: string[] | Element[], doCheck: boolean): void {
        if (!isNOU(nodes)) {
            if (nodes.length > 1 && this.autoCheck) {
                this.isBatchMode = true;
                this.batchParentNode = new Set<string>();
            }
            nodes.reverse();
            for (let len: number = nodes.length - 1; len >= 0; len--) {
                const liEle: Element = this.getElement(nodes[parseInt(len.toString(), 10)]);
                if (isNOU(liEle)) {
                    const node: string = nodes[len - nodes.length] ? nodes[len - nodes.length].toString()
                        : nodes[parseInt(len.toString(), 10)]
                            ? nodes[parseInt(len.toString(), 10)].toString()
                            : null;
                    if (node !== '' && doCheck && node) {
                        this.setValidCheckedNode(node, nodes as string[]);
                        this.dynamicCheckState(node, doCheck);
                    } else if (this.checkedNodes.indexOf(node) !== -1 && node !== '' && !doCheck) {
                        this.checkedNodes.splice(this.checkedNodes.indexOf(node), 1);
                        const childItems: { [key: string]: Object }[] = this.getChildNodes(this.treeData, node);
                        if (childItems) {
                            for (let i: number = 0; i < childItems.length; i++) {
                                const id: string = childItems[parseInt(i.toString(), 10)][this.fields.id]
                                    ? childItems[parseInt(i.toString(), 10)][this.fields.id].toString()
                                    : null;
                                if (this.checkedNodes.indexOf(id) !== -1) {
                                    this.checkedNodes.splice(this.checkedNodes.indexOf(id), 1);
                                    const ele: Element = this.element.querySelector('[data-uid="' + id + '"]');
                                    if (ele) {
                                        this.changeState(ele, 'uncheck', null);
                                    }
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
                const checkBox: Element = select('.' + PARENTITEM + ' .' + CHECKBOXWRAP, liEle);
                this.validateCheckNode(checkBox, !doCheck, liEle, null);
            }
            if (this.isBatchMode && this.autoCheck) {
                this.isBatchMode = false;
                Array.from(this.batchParentNode).forEach((parentId: string) => {
                    const parentLi: Element = this.getElement(parentId);
                    if (parentLi) {
                        this.ensureParentCheckState(parentLi);
                    }
                });
                this.batchParentNode.clear();
            }
        } else {
            const checkBoxes: HTMLElement[] = selectAll('.' + CHECKBOXWRAP, this.element);
            if (this.loadOnDemand) {
                for (let index: number = 0; index < checkBoxes.length; index++) {
                    const liEle: Element = closest(checkBoxes[parseInt(index.toString(), 10)], '.' + LISTITEM);
                    this.updateFieldChecked(checkBoxes[parseInt(index.toString(), 10)], doCheck);
                    this.changeState(checkBoxes[parseInt(index.toString(), 10)], doCheck ? 'check' : 'uncheck', null, null, null, doCheck);
                    this.updateOldCheckedData([this.getNodeData(liEle)]);
                }
            } else {
                for (let index: number = 0; index < checkBoxes.length; index++) {
                    const liEle: Element = closest(checkBoxes[parseInt(index.toString(), 10)], '.' + LISTITEM);
                    this.updateFieldChecked(checkBoxes[parseInt(index.toString(), 10)], doCheck);
                    this.changeState(checkBoxes[parseInt(index.toString(), 10)], doCheck ? 'check' : 'uncheck');
                    this.updateOldCheckedData([this.getNodeData(liEle)]);
                }
            }
        }
        if (nodes) {
            for (let j: number = 0; j < nodes.length - 1; j++) {
                const node: string = nodes[parseInt(j.toString(), 10)] ? nodes[parseInt(j.toString(), 10)].toString() : '';
                if (!doCheck) {
                    this.updateField(this.treeData, this.fields, node, 'isChecked', null);
                }
            }
        }
        if (this.autoCheck) {
            this.updateParentCheckState();
        }
    }

    private updateFieldChecked(checkbox: HTMLElement, doCheck: boolean): void {
        const currLi: Element = closest(checkbox, '.' + LISTITEM);
        const id: string = currLi.getAttribute('data-uid');
        const nodeDetails: { [key: string]: Object } = this.getNodeData(currLi);
        if (nodeDetails.isChecked === 'true' && !doCheck) {
            this.updateField(this.treeData, this.fields, id, 'isChecked', null);
        }
    }
    /**
     * Changes the parent and child  check state while changing the checkedNodes via setmodel
     *
     * @param {string} node - The unique identifier of the node.
     * @param {boolean} doCheck - A boolean value indicating whether to check or uncheck the node.
     * @returns {void}
     * @private
     */
    private dynamicCheckState(node: string, doCheck: boolean): void {
        if (this.dataType === 1) {
            let count: number = 0;
            const resultId: { [key: string]: Object }[] = <{ [key: string]: Object }[]>new DataManager(this.treeData).executeLocal(
                new Query().where(this.fields.id, 'equal', node, true));
            if (resultId[0]) {
                const id: string = resultId[0][this.fields.id] ? resultId[0][this.fields.id].toString() : null;
                const parent: string = resultId[0][this.fields.parentID] ? resultId[0][this.fields.parentID].toString() : null;
                const parentElement: Element = this.element.querySelector('[data-uid="' + parent + '"]');
                const element: Element = this.element.querySelector('[data-uid="' + id + '"]');
                const childNodes: { [key: string]: Object }[] = this.getChildNodes(this.treeData, parent);
                if (childNodes) {
                    for (let i: number = 0; i < childNodes.length; i++) {
                        const childId: string = childNodes[parseInt(i.toString(), 10)][this.fields.id]
                            ? childNodes[parseInt(i.toString(), 10)][this.fields.id].toString()
                            : null;
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
                } else if (this.checkedNodes.indexOf(node) === -1 && !element && parentElement && (id === node) && this.autoCheck
                    && count === 0) {
                    this.changeState(parentElement, 'uncheck', null);
                } else if (!element && !parentElement && (id === node) && this.autoCheck) {
                    this.updateIndeterminate(node, doCheck);
                }
            }
        } else if (this.dataType === 2 || (this.fields.dataSource instanceof DataManager &&
            this.isOffline)) {
            let id: string;
            let parentElement: Element;
            let check: Element;
            for (let i: number = 0; i < this.treeData.length; i++) {
                id = this.treeData[parseInt(i.toString(), 10)][this.fields.id] ? this.treeData[parseInt(i.toString(), 10)][this.fields.id].toString() : '';
                parentElement = this.element.querySelector('[data-uid="' + id + '"]');
                check = parentElement ? select('.' + CHECK, parentElement) : null;
                if (this.checkedNodes.indexOf(id) === -1 && parentElement && check && !doCheck) {
                    this.changeState(parentElement, 'uncheck', null);
                }
                const subChild: { [key: string]: Object }[] = getValue(
                    this.fields.child.toString(),
                    this.treeData[parseInt(i.toString(), 10)]
                );
                if (subChild) {
                    this.updateChildIndeterminate(subChild, id, node, doCheck, id);
                }
            }
        }
    }
    /**
     * updates the parent and child  check state while changing the checkedNodes via setmodel for listData
     *
     * @param {string} node - The unique identifier of the node.
     * @param {boolean} doCheck - A boolean value indicating whether to check or uncheck the node.
     * @returns {void}
     * @private
     */
    private updateIndeterminate(node: string, doCheck: boolean): void {
        const indeterminateData: { [key: string]: Object }[] = this.getTreeData(node);
        let count: number = 0;
        let parent: string;
        if (this.dataType === 1) {
            parent = indeterminateData[0][this.fields.parentID] ? indeterminateData[0][this.fields.parentID].toString() : null;
        }
        const childNodes: { [key: string]: Object }[] = this.getChildNodes(this.treeData, parent);
        if (childNodes) {
            for (let i: number = 0; i < childNodes.length; i++) {
                const childId: string = childNodes[parseInt(i.toString(), 10)][this.fields.id]
                    ? childNodes[parseInt(i.toString(), 10)][this.fields.id].toString()
                    : null;
                if (this.checkedNodes.indexOf(childId) !== -1) {
                    count++;
                }
            }
        }
        const parentElement: Element = this.element.querySelector('[data-uid="' + parent + '"]');
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
                && count !== 0) {
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
     *
     * @param {Object[]} subChild - Array of child nodes
     * @param {string} parent - Parent identifier
     * @param {string} node - Current node identifier
     * @param {boolean} doCheck - Boolean indicating whether to perform a check
     * @param {string} [child] - Optional child identifier
     * @returns {void}
     * @private
     */
    private updateChildIndeterminate
    (subChild: { [key: string]: Object }[], parent: string, node: string, doCheck: boolean, child?: string): void {
        let count: number = 0;
        for (let j: number = 0; j < subChild.length; j++) {
            const subId: string = subChild[parseInt(j.toString(), 10)][this.fields.id] ? subChild[parseInt(j.toString(), 10)][this.fields.id].toString() : '';
            if (this.checkedNodes.indexOf(subId) !== -1) {
                count++;
            }
            const parentElement: Element = this.element.querySelector('[data-uid="' + parent + '"]');
            const indeterminate: Element = parentElement ? select('.' + INDETERMINATE, parentElement) : null;
            const check: Element = parentElement ? select('.' + CHECK, parentElement) : null;
            const element: Element = this.element.querySelector('[data-uid="' + subId + '"]');
            const childElementCheck: Element = element ? select('.' + CHECK, element) : null;
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
                const childElement: Element = this.element.querySelector('[data-uid="' + child + '"]');
                if (doCheck && count !== 0) {
                    this.changeState(childElement, 'indeterminate', null);
                } else if (doCheck && count === subChild.length && this.checkedNodes.indexOf(parent) === -1) {
                    this.checkDisabledState(parent);
                } else if (!doCheck && count === 0 && this.parentNodeCheck.indexOf(parent) !== -1) {
                    this.parentNodeCheck.splice(this.parentNodeCheck.indexOf(parent));
                }
                if (this.parentNodeCheck.indexOf(parent) === -1) {
                    this.parentNodeCheck.push(parent);
                }
            }
            const innerChild: { [key: string]: Object }[] = getValue(this.fields.child.toString(), subChild[parseInt(j.toString(), 10)]);
            if (innerChild) {
                this.updateChildIndeterminate(innerChild, subId, node, doCheck, child);
            }
        }
    }

    private changeState(
        wrapper: HTMLElement | Element, state: string, e?: MouseEvent | KeyboardEventArgs, isPrevent?: boolean, isAdd?: boolean,
        doCheck?: boolean): void {
        let eventArgs: NodeCheckEventArgs;
        const currLi: Element = closest(wrapper, '.' + LISTITEM);
        if (!this.checkDisabledChildren && currLi && (currLi.classList.contains(DISABLE)
            || (this.disableNode && this.disableNode.indexOf(currLi.getAttribute('data-uid')) !== -1))) {
            return;
        }
        if (wrapper === currLi) {
            wrapper = select('.' + CHECKBOXWRAP, currLi);
        }
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
        const frameSpan: Element = wrapper.getElementsByClassName(CHECKBOXFRAME)[0];
        if (state === 'check' && !frameSpan.classList.contains(CHECK)) {
            frameSpan.classList.remove(INDETERMINATE);
            frameSpan.classList.add(CHECK);
            this.addCheck(currLi);
            ariaState = 'true';
        } else if (state === 'uncheck' && (frameSpan.classList.contains(CHECK) || frameSpan.classList.contains(INDETERMINATE))) {
            removeClass([frameSpan], [CHECK, INDETERMINATE]);
            this.removeCheck(currLi);
            ariaState = 'false';
        } else if (state === 'indeterminate' && this.autoCheck) {
            frameSpan.classList.remove(CHECK);
            frameSpan.classList.add(INDETERMINATE);
            this.removeCheck(currLi);
            ariaState = 'mixed';
        }
        ariaState = state === 'check' ? 'true' : state === 'uncheck' ? 'false' : ariaState;
        if (!isNOU(ariaState)) {
            currLi.setAttribute('aria-checked', ariaState);
        }
        if (isAdd) {
            const data: { [key: string]: Object }[] = [].concat([], this.checkActionNodes);
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
                currLi.setAttribute('aria-checked', ariaState);
                eventArgs.data[0].checked = ariaState;
                this.trigger('nodeChecked', eventArgs);
                this.checkActionNodes = [];
            }
        }
    }

    private addCheck(liEle: Element): void {
        const id: string = liEle.getAttribute('data-uid');
        if (!isNOU(id) && this.checkedNodes.indexOf(id) === -1) {
            this.checkDisabledState(id);
        }
    }

    private removeCheck(liEle: Element): void {
        const index: number = this.checkedNodes.indexOf(liEle.getAttribute('data-uid'));
        if (index > -1) {
            this.checkedNodes.splice(index, 1);
        }
    }

    private getCheckEvent(currLi: Element, action: string, e: MouseEvent | KeyboardEventArgs): NodeCheckEventArgs {
        this.checkActionNodes.push(this.getNodeData(currLi));
        const nodeData: { [key: string]: Object }[] = this.checkActionNodes;
        return { action: action, cancel: false, isInteracted: isNOU(e) ? false : true, node: currLi as HTMLLIElement, data: nodeData };
    }

    private finalize(): void {
        const firstUl: Element = select('.' + PARENTITEM, this.element);
        if (!isNullOrUndefined(firstUl)) {
            firstUl.setAttribute('role', treeAriaAttr.treeRole);
            this.setMultiSelect(this.allowMultiSelection);
            this.setNodeFocusable();
            if (this.allowTextWrap) {
                this.updateWrap();
            }
            this.renderReactTemplates();
            this.hasPid = this.rootData[0] ? Object.prototype.hasOwnProperty.call(this.rootData[0], this.fields.parentID) : false;
            this.doExpandAction();
        }
    }

    private setTextWrap(): void {
        (this.allowTextWrap ? addClass : removeClass)([this.element], LISTWRAP);
        if (Browser.isIE) {
            (this.allowTextWrap ? addClass : removeClass)([this.element], IELISTWRAP);
        }
    }

    private updateWrap(ulEle?: HTMLElement): void {
        if (!this.fullRowSelect) { return; }
        const liEle: Element[] = ulEle ? selectAll('.' + LISTITEM, ulEle) : this.liList;
        const length: number = liEle.length;
        for (let i: number = 0; i < length; i++) {
            this.calculateWrap(liEle[parseInt(i.toString(), 10)]);
        }
    }

    private calculateWrap(liEle: Element): void {
        const element: HTMLElement = select('.' + FULLROW, liEle);
        if (element && element.nextElementSibling) {
            element.style.height = this.allowTextWrap ? (element.nextElementSibling as HTMLElement).offsetHeight + 'px' : '';
        }
    }

    private doExpandAction(): void {
        const eUids: string[] = this.expandedNodes;
        if (!this.loadOnDemand && this.fields.dataSource instanceof DataManager) {
            this.isInitalExpand = this.treeData.filter((e: { [key: string]: Object }) => e[this.fields.expanded] === true).length > 0
                ? true
                : this.isInitalExpand;
        }
        if (this.isInitalExpand && eUids.length > 0) {
            this.setProperties({ expandedNodes: [] }, true);

            if (this.fields.dataSource instanceof DataManager) {
                this.expandGivenNodes(eUids);
            } else {
                for (let i: number = 0; i < eUids.length; i++) {
                    const eNode: Element = select('[data-uid="' + eUids[parseInt(i.toString(), 10)] + '"]', this.element);
                    if (!isNOU(eNode)) {
                        const icon: Element = select('.' + EXPANDABLE, select('.' + TEXTWRAP, eNode));
                        if (!isNOU(icon)) {
                            this.expandAction(eNode, icon, null);
                        }
                    } else {
                        if (eUids[parseInt(i.toString(), 10)] && this.expandChildren.indexOf(eUids[parseInt(i.toString(), 10)]) === -1) {
                            this.expandChildren.push(eUids[parseInt(i.toString(), 10)].toString());
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
        this.expandCallback(arr[this.index], () => {
            this.index++;
            if (this.index < arr.length) {
                this.expandGivenNodes(arr);
            } else {
                this.afterFinalized();
            }
        });
        if (this.index > 0) {
            this.index = 0;
        }
    }

    private expandCallback(eUid: string, callback: Function): void {
        const eNode: Element = select('[data-uid="' + eUid + '"]', this.element);
        if (!isNOU(eNode)) {
            const icon: Element = select('.' + EXPANDABLE, select('.' + TEXTWRAP, eNode));
            if (!isNOU(icon)) {
                this.expandAction(eNode, icon, null, false, callback);
            }
            callback();
        } else {
            callback();
        }
    }

    private afterFinalized(): void {
        this.doSelectionAction();
        this.updateCheckedProp();
        this.isAnimate = true;
        this.isInitalExpand = false;
        if ((!this.isLoaded || this.isFieldChange) && !this.isNodeDropped) {
            const eventArgs: DataBoundEventArgs = { data: this.treeData };
            this.trigger('dataBound', eventArgs);
        }
        this.isLoaded = true;
        this.isNodeDropped = false;
    }

    private doSelectionAction(): void {
        const sNodes: HTMLElement[] = selectAll('.' + SELECTED, this.element);
        const sUids: string[] = this.selectedNodes;
        if (sUids.length > 0) {
            this.setProperties({ selectedNodes: [] }, true);
            for (let i: number = 0; i < sUids.length; i++) {
                const sNode: Element = select('[data-uid="' + sUids[parseInt(i.toString(), 10)] + '"]', this.element);
                if (sNode && !(sNode.classList.contains('e-active'))) {
                    this.selectNode(sNode, null, true);
                } else {
                    this.selectedNodes.push(sUids[parseInt(i.toString(), 10)]);
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
            if (!sNodes[parseInt(i.toString(), 10)].classList.contains('e-disable')) {
                this.selectNode(sNodes[parseInt(i.toString(), 10)], null, true);
            }
            if (!this.allowMultiSelection) {
                break;
            }
        }
    }

    private clickHandler(event: TapEventArgs): void {
        const target: Element = Browser.isDevice && event.originalEvent.changedTouches && !Browser.isIos
            ? document.elementFromPoint(event.originalEvent.changedTouches[0].clientX, event.originalEvent.changedTouches[0].clientY)
            : <Element>event.originalEvent.target;
        EventHandler.remove(this.element, 'contextmenu', this.preventContextMenu);
        if (!target || this.dragStartAction) {
            return;
        } else {
            const classList: DOMTokenList = target.classList;
            const li: Element = closest(target, '.' + LISTITEM);
            if (!li || (li.classList.contains(PREVENTSELECT) && !(classList.contains(EXPANDABLE) || classList.contains(COLLAPSIBLE)))) {
                return;
            } else if (event.originalEvent.which !== 3) {
                const rippleElement: Element = select('.' + RIPPLEELMENT, li);
                const rippleIcons: Element = select('.' + ICON, li);
                this.removeHover();
                this.setFocusElement(li);
                const isExpandCollapseIcon: boolean = classList.contains(EXPANDABLE) || classList.contains(COLLAPSIBLE);
                if (this.showCheckBox && !li.classList.contains('e-disable') && !isExpandCollapseIcon) {
                    const checkWrapper: HTMLElement = this.checkOnClick ? select('.' + CHECKBOXWRAP, li) : closest(target, '.' + CHECKBOXWRAP) as HTMLElement;
                    if (!isNOU(checkWrapper)) {
                        const checkElement: Element = select('.' + CHECKBOXFRAME, checkWrapper);
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
            if (event.originalEvent.which === 3) { this.isRightClick = true; }
            this.triggerClickEvent(event.originalEvent, li);
        }
    }

    private nodeCheckedEvent(wrapper: HTMLElement | Element, isCheck: boolean, e: MouseEvent | KeyboardEventArgs): void {
        const eventArgs: NodeCheckEventArgs = this.getCheckEvent(wrapper, isCheck ? 'uncheck' : 'check', e);
        eventArgs.data = eventArgs.data.splice(0, eventArgs.data.length - 1);
        this.trigger('nodeChecked', eventArgs);
    }

    private updateOldCheckedData(data: { [key: string]: Object }[]): void {
        const dataManager: DataManager = new DataManager(data);
        const childItems: { [key: string]: Object }[] = <{ [key: string]: Object }[]>dataManager.executeLocal(new Query().where('isChecked', 'equal', 'true', true));
        const uncheckedItems: { [key: string]: Object }[] = <{ [key: string]: Object }[]>dataManager.executeLocal(new Query().where('isChecked', 'equal', 'false', true));
        if (uncheckedItems.length > 0) {
            const index: number = this.OldCheckedData.findIndex((e: { [key: string]: Object; }) => e['id'] === uncheckedItems[0]['id']);
            if (index !== -1) {
                this.OldCheckedData.splice(index, 1);
                const childNodes: { [key: string]: Object }[] = this.OldCheckedData.filter((e: { [key: string]: Object }) => e['parentID'] === uncheckedItems[0]['id']);
                if (childNodes.length > 0) {
                    childNodes.forEach((child: { [key: string]: object }) => {
                        const childIndex: number = this.OldCheckedData.findIndex((e: { [key: string]: Object }) => e['id'] === child.id);
                        if (childIndex !== -1) {
                            this.OldCheckedData.splice(childIndex, 1);
                        }
                    });
                }
                return;
            }
        }
        if (childItems.length > 0) {
            const index: number = this.OldCheckedData.findIndex((e: { [key: string]: Object; }) => e['id'] === childItems[0]['id']);
            if (index === -1) {
                this.OldCheckedData.push(childItems[0]);
                return;
            }
        }
    }

    private triggerClickEvent(e: MouseEvent, li: Element): void {
        const eventArgs: NodeClickEventArgs = {
            event: e,
            node: li as HTMLLIElement
        };
        this.trigger('nodeClicked', eventArgs);
    }

    private expandNode(currLi: Element, icon: Element, loaded?: boolean): void {
        this.renderReactTemplates();
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
                const ul: HTMLElement = <HTMLElement>select('.' + PARENTITEM, currLi);
                const liEle: HTMLElement = <HTMLElement>currLi;
                if (this.isAnimate && !this.isRefreshed) {
                    this.setHeight(liEle, ul);
                    const activeElement: HTMLElement = <HTMLElement>select('.' + LISTITEM + '.' + ACTIVE, currLi);
                    this.aniObj.animate(ul, {
                        name: this.animation.expand.effect,
                        duration: (this.animation.expand.duration === 0 && animationMode === 'Enable') ? 400 : this.animation.expand.duration,
                        timingFunction: this.animation.expand.easing,
                        begin: (): void => {
                            liEle.style.overflow = 'hidden';
                            if (!isNullOrUndefined(activeElement) && activeElement instanceof HTMLElement) {
                                activeElement.classList.add(ITEM_ANIMATION_ACTIVE);
                            }
                            start = liEle.offsetHeight;
                            const computedStyle: CSSStyleDeclaration = window.getComputedStyle(liEle);
                            const paddingTop: number = parseFloat(computedStyle.paddingTop);
                            const paddingBottom: number = parseFloat(computedStyle.paddingBottom);
                            end = (select('.' + TEXTWRAP, currLi) as HTMLElement).offsetHeight + paddingBottom + paddingTop;
                        },
                        progress: (args: AnimationOptions): void => {
                            args.element.style.display = 'block';
                            this.animateHeight(args, start, end);
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
            const ul: HTMLElement = <HTMLElement>select('.' + PARENTITEM, currLi);
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
        if (this.allowTextWrap && this.isLoaded && this.isFirstRender) {
            this.updateWrap(currLi);
            this.isFirstRender = false;
        }
        if (this.isLoaded && this.expandArgs && !this.isRefreshed) {
            this.expandArgs = this.getExpandEvent(currLi, null);
            this.expandArgs.isInteracted = this.isInteracted;
            this.trigger('nodeExpanded', this.expandArgs);
        }
        if (this.isHiddenItem){
            this.collapseAll([this.getNodeData(currLi).id as string]);
        }
    }

    private addExpand(liEle: Element): void {
        liEle.setAttribute('aria-expanded', 'true');
        removeClass([liEle], NODECOLLAPSED);
        const id: string = liEle.getAttribute('data-uid');
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
            this.isInteracted = colArgs.isInteracted;
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

    private nodeCollapseAction(currLi: Element, icon: Element, colArgs: NodeExpandEventArgs): void {
        removeClass([icon], COLLAPSIBLE);
        addClass([icon], EXPANDABLE);
        let start: number = 0;
        let end: number = 0;
        const ul: HTMLElement = <HTMLElement>select('.' + PARENTITEM, currLi);
        const liEle: HTMLElement = <HTMLElement>currLi;
        const activeElement: HTMLElement = <HTMLElement>select('.' + LISTITEM + '.' + ACTIVE, currLi);
        if (this.isAnimate) {
            this.aniObj.animate(ul, {
                name: this.animation.collapse.effect,
                duration: (this.animation.collapse.duration === 0 && animationMode === 'Enable') ? 400 : this.animation.collapse.duration,
                timingFunction: this.animation.collapse.easing,
                begin: (): void => {
                    liEle.style.overflow = 'hidden';
                    if (!isNullOrUndefined(activeElement) && activeElement instanceof HTMLElement) {
                        activeElement.classList.add(ITEM_ANIMATION_ACTIVE);
                    }
                    start = (<HTMLElement>select('.' + TEXTWRAP, currLi)).offsetHeight;
                    end = liEle.offsetHeight;
                },
                progress: (args: AnimationOptions): void => {
                    this.animateHeight(args, start, end);
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
        this.removeExpand(liEle);
        if (this.isLoaded) {
            colArgs = this.getExpandEvent(liEle, null);
            colArgs.isInteracted = this.isInteracted;
            this.trigger('nodeCollapsed', colArgs);
        }
    }

    private removeExpand(liEle: Element, toRemove?: boolean): void {
        if (toRemove) {
            liEle.removeAttribute('aria-expanded');
        } else {
            this.disableExpandAttr(liEle);
        }
        const index: number = this.expandedNodes.indexOf(liEle.getAttribute('data-uid'));
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
        if (isNullOrUndefined(args.element.parentElement)) {
            return;
        }
        const remaining: number = (args.duration - args.timeStamp) / args.duration;
        const currentHeight: number = (end - start) * remaining + start;
        args.element.parentElement.style.height = currentHeight + 'px';
    }

    private renderChildNodes(
        parentLi: Element, expandChild?: boolean, callback?: Function, loaded?: boolean, isFromExpandAll?: boolean): void {
        const eicon: Element = select('div.' + ICON, parentLi);
        if (isNOU(eicon)) {
            return;
        }
        this.showSpinner(eicon as HTMLElement);
        let childItems: { [key: string]: Object }[];

        if (this.fields.dataSource instanceof DataManager) {
            const level: number = this.parents(parentLi, '.' + PARENTITEM).length;
            const mapper: FieldsSettingsModel = this.getChildFields(this.fields, level, 1);
            if (isNOU(mapper) || isNOU(mapper.dataSource)) {
                detach(eicon);
                this.removeExpand(parentLi, true);
                return;
            }
            this.treeList.push('false');
            if (this.fields.dataSource instanceof DataManager && this.isOffline) {
                this.treeList.pop();
                childItems = this.getChildNodes(this.treeData, parentLi.getAttribute('data-uid'));
                this.loadChild(childItems, mapper, eicon, parentLi, expandChild, callback, loaded);
            } else {
                (mapper.dataSource as DataManager).executeQuery(this.getQuery(mapper,
                                                                              parentLi.getAttribute('data-uid'))).then((e: Object) => {
                    this.treeList.pop();
                    childItems = (e as ResultData).result;
                    if (this.dataType === 1) {
                        this.dataType = 2;
                    }
                    this.loadChild(childItems, mapper, eicon, parentLi, expandChild, callback, loaded);
                }).catch((e: Object) => {
                    this.trigger('actionFailure', { error: e });
                });
            }
        } else {
            childItems = this.getChildNodes(this.treeData, parentLi.getAttribute('data-uid'), false, parseFloat(parentLi.getAttribute('aria-level')) + 1);
            this.currentLoadData = this.getSortedData(childItems);
            if (isNOU(childItems) || childItems.length === 0) {
                detach(eicon);
                if (eicon.classList.contains(LOAD)) {
                    this.hideSpinner(eicon as HTMLElement);
                }
                this.removeExpand(parentLi, true);
                return;
            } else {
                this.listBaseOption.ariaAttributes.level = parseFloat(parentLi.getAttribute('aria-level')) + 1;
                parentLi.appendChild(ListBase.createList(this.createElement, this.currentLoadData, this.listBaseOption));
                this.expandNode(parentLi, eicon, loaded);
                this.setSelectionForChildNodes(childItems);
                this.ensureCheckNode(parentLi, isFromExpandAll);
                this.finalizeNode(parentLi, isFromExpandAll, expandChild);
                this.disableTreeNodes(childItems);
                this.renderSubChild(parentLi, expandChild, loaded, isFromExpandAll);
            }
        }
    }

    private loadChild(childItems: { [key: string]: Object }[], mapper: FieldsSettingsModel, eicon: Element, parentLi: Element,
                      expandChild?: boolean, callback?: Function, loaded?: boolean): void {
        this.currentLoadData = childItems;
        if (isNOU(childItems) || childItems.length === 0) {
            detach(eicon);
            this.removeExpand(parentLi, true);
        } else {
            this.updateListProp(mapper);
            if (this.fields.dataSource instanceof DataManager && !this.isOffline) {
                const id: string = parentLi.getAttribute('data-uid');
                const nodeData: { [key: string]: Object } = this.getNodeObject(id);
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
        if (expandChild) {
            this.expandedNodes.push(parentLi.getAttribute('data-uid'));
        }
        if (this.treeList.length === 0 && !this.isLoaded) {
            this.finalize();
        }
    }

    private disableTreeNodes(childItems: { [key: string]: Object }[]): void {
        if (isNOU(this.disableNode) || this.disableNode.length === 0) {
            return;
        }
        let i: number = 0;
        while (i < childItems.length) {
            const id: string = childItems[parseInt(i.toString(), 10)][this.fields.id]
                ? childItems[parseInt(i.toString(), 10)][this.fields.id].toString()
                : null;
            if (this.disableNode !== undefined && this.disableNode.indexOf(id) !== -1) {
                this.doDisableAction([id]);
            }
            i++;
        }
    }

    /**
     * Sets the child Item in selectedState while rendering the child node
     *
     * @param {Object[]} nodes - Array of nodes
     * @returns {void}
     */
    private setSelectionForChildNodes(nodes: { [key: string]: Object }[]): void {
        if (isNOU(this.selectedNodes) || this.selectedNodes.length === 0) {
            return;
        }
        let i: number;
        for (i = 0; i < nodes.length; i++) {
            const id: string = nodes[parseInt(i.toString(), 10)][this.fields.id]
                ? nodes[parseInt(i.toString(), 10)][this.fields.id].toString()
                : null;
            if (this.selectedNodes !== undefined && this.selectedNodes.indexOf(id) !== -1) {
                this.doSelectionAction();
            }
        }
    }

    private ensureCheckNode(element: Element, isFromExpandAll?: boolean): void {
        if (this.showCheckBox) {
            this.ele = (this.checkedElement) ? this.checkedElement.indexOf(element.getAttribute('data-uid')) : null;
            if (this.autoCheck) {
                this.ensureChildCheckState(element, null, isFromExpandAll);
                if (isFromExpandAll ? (select('.' + CHECK, this.element) || select('.' + INDETERMINATE, this.element)) : true) {
                    this.ensureParentCheckState(element);
                }
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
        if (nodeLevel === dataLevel) {
            return this.getChildMapper(mapper);
        } else {
            return this.getChildFields(this.getChildMapper(mapper), nodeLevel, dataLevel + 1);
        }
    }

    private getChildMapper(mapper: FieldsSettingsModel): FieldsSettingsModel {
        return (typeof mapper.child === 'string' || isNOU(mapper.child)) ? mapper : mapper.child;
    }

    private getChildNodes(
        obj: { [key: string]: Object }[], parentId: string, isRoot: boolean = false, level?: number): { [key: string]: Object }[] {
        let childNodes: { [key: string]: Object }[];
        if (isNOU(obj)) {
            return childNodes;
        }
        if (this.dataType === 1) {
            return this.getChildGroup(this.groupedData, parentId, isRoot);
        }
        if (typeof this.fields.child === 'string') {
            return this.findChildNodes(obj, this.fields.id, parentId) || this.findNestedChildNodes(obj, parentId, level) || [];
        }
        if (this.isChildObject()) {
            let tempField: FieldsSettingsModel = !isNOU(level) ? this.fields : this.fields.child;
            let i: number = 1;
            while (i < level) {
                if (!isNOU(tempField.child)) {
                    tempField = tempField.child as FieldsSettingsModel;
                } else {
                    break;
                }
                i++;
            }
            this.updateListProp(tempField);
            const index: number = obj.findIndex((data: { [key: string]: Object }) =>
                getValue(this.fields.id, data) &&
                getValue(this.fields.id, data).toString() === parentId);
            if (index !== -1) {
                return <{ [key: string]: Object }[]>getValue(('child' as string), obj[parseInt(index.toString(), 10)]);
            }
            if (index === -1) {
                for (let i: number = 0, objlen: number = obj.length; i < objlen; i++) {
                    const tempArray: { [key: string]: Object }[] = getValue('child', obj[parseInt(i.toString(), 10)]);
                    const childIndex: number = !isNOU(tempArray)
                        ? tempArray.findIndex((data: { [key: string]: Object }) =>
                            getValue((this.fields.child as FieldsSettingsModel).id, data) &&
                            getValue((this.fields.child as FieldsSettingsModel).id, data).toString() === parentId)
                        : -1;
                    if (childIndex !== -1) {
                        return <{ [key: string]: Object }[]>getValue('child', tempArray[parseInt(childIndex.toString(), 10)]);
                    }
                    else if (!isNOU(tempArray)) {
                        childNodes = this.getChildNodes(tempArray, parentId, false, level);
                        if (childNodes !== undefined) {
                            break;
                        }
                    }
                }
            }
        }
        return childNodes;
    }

    private findChildNodes(items: { [key: string]: Object }[], idField: string, parentId: string): { [key: string]: Object }[] {
        const index: number = items.findIndex((data: { [key: string]: Object; }) => {
            const value: string = getValue(idField, data);
            return value && value.toString() === parentId;
        });
        if (index !== -1) {
            return getValue(this.fields.child as string, items[index as number]) as { [key: string]: Object }[];
        }
        return null;
    }

    private findNestedChildNodes(items: { [key: string]: Object }[], parentId: string, level?: number): { [key: string]: Object }[] {
        for (const item of items) {
            const tempArray: { [key: string]: Object }[] = getValue(this.fields.child as string, item) as { [key: string]: Object }[];
            if (!isNOU(tempArray)) {
                const childNodes: { [key: string]: Object }[] = this.findChildNodes(tempArray, this.fields.id, parentId);
                if (childNodes) {
                    return childNodes;
                }
                const nestedChildNodes: { [key: string]: Object }[] = this.getChildNodes(tempArray, parentId, false, level);
                if (nestedChildNodes && nestedChildNodes.length > 0) {
                    return nestedChildNodes;
                }
            }
        }
        return undefined;
    }

    private getChildGroup(data: { [key: string]: Object }[][], parentId: string, isRoot: boolean): { [key: string]: Object }[] {
        const childNodes: { [key: string]: Object }[] = [];
        if (isNOU(data)) {
            return childNodes;
        }
        for (let i: number = 0, objlen: number = data.length; i < objlen; i++) {
            if (!isNOU(data[parseInt(i.toString(), 10)][0]) &&
                !isNOU(getValue(this.fields.parentID, data[parseInt(i.toString(), 10)][0]))) {
                if (getValue(this.fields.parentID, data[parseInt(i.toString(), 10)][0]).toString() === parentId) {
                    return data[parseInt(i.toString(), 10)];
                }
            } else if (isRoot) {
                return data[parseInt(i.toString(), 10)];
            }
        }
        return childNodes;
    }

    private renderSubChild(element: Element, expandChild?: boolean, loaded?: boolean, isFromExpandAll?: boolean): void {
        if (expandChild) {
            const cIcons: HTMLElement[] = selectAll('.' + EXPANDABLE, element);
            for (let i: number = 0, len: number = cIcons.length; i < len; i++) {
                const icon: Element = cIcons[parseInt(i.toString(), 10)];
                if (element.querySelector('.e-icons') !== cIcons[parseInt(i.toString(), 10)]) {
                    const curLi: Element = closest(icon, '.' + LISTITEM);
                    this.expandArgs = this.getExpandEvent(curLi, null);
                    if (loaded !== true) {
                        this.trigger('nodeExpanding', this.expandArgs);
                    }
                    this.renderChildNodes(curLi, expandChild, null, loaded, isFromExpandAll);
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
            if (this.checkOnClick) {
                const checkboxElement: HTMLElement = select(' .' + CHECKBOXFRAME, li);
                if (!isNOU(checkboxElement) && checkboxElement.classList.contains(CHECK)) {
                    addClass([li], ACTIVE);
                } else {
                    removeClass([li], ACTIVE);
                }
            }
            this.setFocusElement(li);
            return;
        }
        let eventArgs: NodeSelectEventArgs;
        if (this.isLoaded) {
            eventArgs = this.getSelectEvent(li, 'select', e);
            this.trigger('nodeSelecting', eventArgs, (observedArgs: NodeSelectEventArgs) => {
                if ((!observedArgs.cancel) && !observedArgs.node.classList.contains(PREVENTSELECT)) {
                    this.nodeSelectAction(li, e, observedArgs, multiSelect);
                }
            });
        } else {
            this.nodeSelectAction(li, e, eventArgs, multiSelect);
        }
    }

    private nodeSelectAction(li: Element, e: MouseEvent | KeyboardEventArgs, eventArgs: NodeSelectEventArgs, multiSelect?: boolean): void {
        if (!this.allowMultiSelection || (!multiSelect && (!e || (e && !(e.ctrlKey || e.metaKey))))) {
            this.removeSelectAll();
        }
        if (this.allowMultiSelection && e && e.shiftKey) {
            if (!this.startNode) {
                this.startNode = li;
            }
            let startIndex: number = this.liList.indexOf(<HTMLElement>this.startNode);
            let endIndex: number = this.liList.indexOf(<HTMLElement>li);
            if (startIndex > endIndex) {
                const temp: number = startIndex;
                startIndex = endIndex;
                endIndex = temp;
            }
            for (let i: number = startIndex; i <= endIndex; i++) {
                const currNode: Element = this.liList[parseInt(i.toString(), 10)];
                if (isVisible(currNode) && !currNode.classList.contains('e-disable')) {
                    this.addSelect(currNode);
                }
            }
        } else {
            this.startNode = li;
            this.addSelect(li);
        }
        if (this.isLoaded) {
            eventArgs.nodeData = this.getNodeData(li);
            this.trigger('nodeSelected', eventArgs);
            this.isRightClick = false;
        }
        this.isRightClick = false;
    }
    private unselectNode(li: Element, e: MouseEvent | KeyboardEventArgs): void {
        let eventArgs: NodeSelectEventArgs;
        if (this.isLoaded) {
            eventArgs = this.getSelectEvent(li, 'un-select', e);
            this.trigger('nodeSelecting', eventArgs, (observedArgs: NodeSelectEventArgs) => {
                if (!observedArgs.cancel) {
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
            eventArgs.nodeData = this.getNodeData(li);
            this.trigger('nodeSelected', eventArgs);
        }
    }

    private setFocusElement(li: Element): void {
        if (!isNOU(li)) {
            const focusedNode: Element = this.getFocusedNode();
            if (focusedNode) {
                removeClass([focusedNode], FOCUS);
                focusedNode.setAttribute('tabindex', '-1');
            }
            addClass([li], FOCUS);
            li.setAttribute('tabindex', '0');
            EventHandler.add(li, 'blur', this.focusOut, this);
            this.updateIdAttr(focusedNode, li);
        }
    }

    private addSelect(liEle: Element): void {
        liEle.setAttribute('aria-selected', 'true');
        addClass([liEle], ACTIVE);
        const id: string = liEle.getAttribute('data-uid');
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
        const index: number = this.selectedNodes.indexOf(liEle.getAttribute('data-uid'));
        if (index > -1) {
            this.selectedNodes.splice(index, 1);
        }
    }

    private removeSelectAll(): void {
        const selectedLI: Element[] = <NodeListOf<Element> & Element[]>this.element.querySelectorAll('.' + ACTIVE);
        for (const ele of selectedLI) {
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
        const nodeData: { [key: string]: Object } = this.getNodeData(currLi);
        return { action: action, cancel: false, isInteracted: isNOU(e) ? false : true, node: currLi as HTMLLIElement, nodeData: nodeData };
    }

    private setExpandOnType(): void {
        this.expandOnType = (this.expandOn === 'Auto') ? (Browser.isDevice ? 'Click' : 'DblClick') : this.expandOn;
    }

    private expandHandler(e: TapEventArgs): void {
        const target: Element = Browser.isDevice && e.originalEvent.changedTouches && !Browser.isIos
            ? document.elementFromPoint(e.originalEvent.changedTouches[0].clientX, e.originalEvent.changedTouches[0].clientY)
            : <Element>e.originalEvent.target;
        if (!target || target.classList.contains(INPUT) || target.classList.contains(ROOT) ||
            target.classList.contains(PARENTITEM) || target.classList.contains(LISTITEM) ||
            target.classList.contains(ICON) || this.showCheckBox && closest(target, '.' + CHECKBOXWRAP)) {
            return;
        } else {
            this.expandCollapseAction(closest(target, '.' + LISTITEM), e);
        }
    }

    private expandCollapseAction(currLi: Element, e: TapEventArgs): void {
        const icon: Element = select('div.' + ICON, currLi);
        if (!icon || icon.classList.contains(PROCESS)) {
            return;
        } else {
            const classList: DOMTokenList = icon.classList;
            if (classList.contains(EXPANDABLE)) {
                this.expandAction(currLi, icon, e);
            } else if (classList.contains(COLLAPSIBLE)) {
                this.collapseNode(currLi, icon, e);
            }
        }
    }

    private expandAction(
        currLi: Element, icon: Element, e: MouseEvent | KeyboardEventArgs | TapEventArgs,
        expandChild?: boolean, callback?: Function, isFromExpandAll?: boolean): void {
        if (icon.classList.contains(PROCESS)) {
            return;
        } else {
            addClass([icon], PROCESS);
        }
        if (this.isLoaded && !this.isRefreshed) {
            this.expandArgs = this.getExpandEvent(currLi, e);
            this.isInteracted = this.expandArgs.isInteracted;
            this.trigger('nodeExpanding', this.expandArgs, (observedArgs: NodeExpandEventArgs) => {
                if (observedArgs.cancel) {
                    removeClass([icon], PROCESS);
                }
                else {
                    this.nodeExpandAction(currLi, icon, expandChild, callback, isFromExpandAll);
                }
            });
        }
        else {
            this.nodeExpandAction(currLi, icon, expandChild, callback, isFromExpandAll);
        }
    }

    private nodeExpandAction(currLi: Element, icon: Element, expandChild?: boolean, callback?: Function, isFromExpandAll?: boolean): void {
        const ul: Element = select('.' + PARENTITEM, currLi);
        if (ul && ul.nodeName === 'UL') {
            this.expandNode(currLi, icon);
        } else {
            this.isFirstRender = true;
            this.renderChildNodes(currLi, expandChild, callback, null, isFromExpandAll);
            if (isNullOrUndefined(this.expandChildren) || this.expandChildren.length === 0) {
                return;
            }
            const liEles: Element[] = selectAll('.' + LISTITEM, currLi);
            for (let i: number = 0; i < liEles.length; i++) {
                const id: string = this.getId(liEles[parseInt(i.toString(), 10)]);
                if (this.expandChildren.indexOf(id) !== -1 && this.expandChildren !== undefined) {
                    const icon: Element = select('.' + EXPANDABLE, select('.' + TEXTWRAP, liEles[parseInt(i.toString(), 10)]));
                    if (!isNOU(icon)) {
                        this.expandAction(liEles[parseInt(i.toString(), 10)], icon, null);
                    }
                    this.expandChildren.splice(this.expandChildren.indexOf(id), 1);
                }
            }
        }
    }

    private keyActionHandler(e: KeyboardEventArgs): void {
        const target: Element = <Element>e.target;
        const focusedNode: Element = this.getFocusedNode();
        if (target && target.classList.contains(INPUT)) {
            const inpEle: HTMLInputElement = <HTMLInputElement>target;
            if (e.action === 'enter') {
                inpEle.blur();
            } else if (e.action === 'escape') {
                inpEle.value = this.oldText;
                inpEle.blur();
            }
            return;
        }
        e.preventDefault();
        const eventArgs: NodeKeyPressEventArgs = {
            cancel: false,
            event: e,
            node: focusedNode as HTMLLIElement
        };
        this.trigger('keyPress', eventArgs, (observedArgs: NodeEditEventArgs) => {
            if (!observedArgs.cancel) {
                switch (e.action) {
                case 'space':
                    if (this.showCheckBox) {
                        this.checkNode(e);
                    } else {
                        this.toggleSelect(focusedNode, e);
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
                case 'shiftSpace':
                case 'ctrlSpace':
                    this.toggleSelect(focusedNode, e);
                    break;
                case 'f2':
                    if (this.allowEditing && !focusedNode.classList.contains('e-disable')) {
                        this.createTextbox(focusedNode);
                    }
                    break;
                case 'ctrlA':
                    if (this.allowMultiSelection) {
                        const sNodes: HTMLElement[] = selectAll('.' + LISTITEM + ':not(.' + ACTIVE + ')', this.element);
                        this.selectGivenNodes(sNodes);
                    }
                    break;
                }
            }
        });
    }

    private navigateToFocus(isUp: boolean): void {
        const focusNode: Element = this.getFocusedNode().querySelector('.' + TEXTWRAP);
        const pos: ClientRect = focusNode.getBoundingClientRect();
        const parent: Element = this.getScrollParent(this.element);
        if (!isNOU(parent)) {
            const parentPos: ClientRect = parent.getBoundingClientRect();
            if (pos.bottom > parentPos.bottom) {
                parent.scrollTop += pos.bottom - parentPos.bottom;
            } else if (pos.top < parentPos.top) {
                parent.scrollTop -= parentPos.top - pos.top;
            }
        }
        const isVisible: boolean = this.isVisibleInViewport(focusNode);
        if (!isVisible) {
            focusNode.scrollIntoView(isUp);
        }
    }

    private isVisibleInViewport(txtWrap: Element): boolean {
        const pos: ClientRect = txtWrap.getBoundingClientRect();
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
            const focusedNode: Element = this.getFocusedNode();
            const nextNode: Element = isTowards ? this.getNextNode(focusedNode) : this.getPrevNode(focusedNode);
            this.removeHover();
            this.setFocusElement(nextNode);
            this.toggleSelect(nextNode, e, false);
            this.navigateToFocus(!isTowards);
        } else {
            this.navigateNode(isTowards);
        }
    }

    private checkNode(e: KeyboardEventArgs): void {
        const focusedNode: Element = this.getFocusedNode();
        const checkWrap: Element = select('.' + CHECKBOXWRAP, focusedNode);
        const isChecked: boolean = select(' .' + CHECKBOXFRAME, checkWrap).classList.contains(CHECK);
        if (!focusedNode.classList.contains('e-disable')) {
            if (focusedNode.getElementsByClassName('e-checkbox-disabled').length === 0) {
                this.validateCheckNode(checkWrap, isChecked, focusedNode, e);
            }
        }
    }

    private validateCheckNode(
        checkWrap: HTMLElement | Element, isCheck: boolean, li: HTMLElement | Element, e: KeyboardEventArgs | MouseEvent): void {
        const currLi: Element = closest(checkWrap, '.' + LISTITEM);
        this.checkActionNodes = [];
        const ariaState: string = !isCheck ? 'true' : 'false';
        if (!isNOU(ariaState)) {
            currLi.setAttribute('aria-checked', ariaState);
        }
        const eventArgs: NodeCheckEventArgs = this.getCheckEvent(currLi, isCheck ? 'uncheck' : 'check', e);
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
            if (this.autoCheck) {
                let child: { [key: string]: Object }[] = this.getChildNodes(this.treeData, li.getAttribute('data-uid'));
                if (child !== null) {
                    this.allCheckNode(child, this.checkedElement, null, null, false);
                } else {
                    child = null;
                }
            }
        }
        this.changeState(checkWrap, isCheck ? 'uncheck' : 'check', e, true);
        this.updateActiveClass(li, isCheck);
        if (this.autoCheck) {
            this.ensureChildCheckState(li);
            this.updateOldCheckedData([this.getNodeData(li)]);
            const parentLi: Element = closest(closest(li, '.' + PARENTITEM), '.' + LISTITEM);
            if (this.isBatchMode) {
                const parentId: string = !isNOU(parentLi) ? parentLi.getAttribute('data-uid') : null;
                if (parentId) {
                    this.batchParentNode.add(parentId);
                }
            } else {
                this.ensureParentCheckState(parentLi);
            }
            let doCheck: boolean;
            if (eventArgs.action === 'check') {
                doCheck = true;
            } else if (eventArgs.action === 'uncheck') {
                doCheck = false;
            }
            this.ensureStateChange(li, doCheck);
        }
        this.nodeCheckedEvent(checkWrap, isCheck, e);
    }

    private updateActiveClass(liElement: HTMLElement | Element, checkStatus: boolean | string): void {
        if (this.showCheckBox && this.checkOnClick) {
            if (checkStatus === 'check' || checkStatus === false) {
                this.removeSelectAll();
                addClass([liElement], ACTIVE);
            } else if (checkStatus === 'uncheck' || checkStatus === 'indeterminate' || checkStatus === true) {
                removeClass([liElement], ACTIVE);
            }
        }
    }

    /**
     * Update checkedNodes when UI interaction happens before the child node renders in DOM
     *
     * @param {Element} li - The list item element
     * @param {boolean} [doCheck] - Optional parameter to specify whether to perform a check
     * @returns {void}
     */
    private ensureStateChange(li: Element, doCheck?: boolean): void {
        const childElement: Element = select('.' + PARENTITEM, li);
        const parentIndex: string = li.getAttribute('data-uid');
        const mapper: FieldsSettingsModel = this.fields;
        if (this.dataType === 1 && this.autoCheck) {
            let resultData: { [key: string]: Object }[] = <{ [key: string]: Object }[]>new DataManager(this.treeData).executeLocal(
                new Query().where(mapper.parentID, 'equal', parentIndex, true));

            const childMatchesCheckedNodes: { [key: string]: Object }[] = resultData.filter((item: { [key: string]: any }) => {
                return this.checkedNodes.indexOf(item[mapper.id].toString()) !== -1;
            }, this);

            if (this.checkedNodes.indexOf(parentIndex) !== -1 && childMatchesCheckedNodes.length !== resultData.length && this.isFilter) {
                if (childMatchesCheckedNodes.length > 0) {
                    resultData = childMatchesCheckedNodes;
                }
            }
            for (let i: number = 0; i < resultData.length; i++) {
                const resultId: string = resultData[parseInt(i.toString(), 10)][this.fields.id]
                    ? resultData[parseInt(i.toString(), 10)][this.fields.id].toString()
                    : null;
                const isCheck: string = resultData[parseInt(i.toString(), 10)][this.fields.isChecked]
                    ? resultData[parseInt(i.toString(), 10)][this.fields.isChecked].toString()
                    : null;
                if (this.checkedNodes.indexOf(parentIndex) !== -1 && this.checkedNodes.indexOf(resultId) === -1) {
                    this.checkDisabledState(resultId, resultData[i as number]);
                    const childItems: { [key: string]: Object }[] = this.getChildNodes(this.treeData, resultId);
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
                        const childNodes: { [key: string]: Object }[] = this.getChildNodes(this.treeData, resultId);
                        this.getChildItems(childNodes, doCheck);
                        if (this.parentNodeCheck.indexOf(resultId) !== -1) {
                            this.parentNodeCheck.splice(this.parentNodeCheck.indexOf(resultId), 1);
                        }
                    }
                } else {
                    const childItems: { [key: string]: Object }[] = this.getChildNodes(this.treeData, resultId);
                    this.getChildItems(childItems, doCheck);
                }
            }
        } else if (this.dataType === 1 && !this.autoCheck) {
            if (!doCheck) {
                const checkedData: { [key: string]: Object }[] = <{ [key: string]: Object }[]>new DataManager(this.treeData).executeLocal(
                    new Query().where(mapper.isChecked, 'equal', true, false));

                for (let i: number = 0; i < checkedData.length; i++) {
                    const id: string = checkedData[parseInt(i.toString(), 10)][this.fields.id]
                        ? checkedData[parseInt(i.toString(), 10)][this.fields.id].toString()
                        : null;
                    if (this.checkedNodes.indexOf(id) !== -1) {
                        this.checkedNodes.splice(this.checkedNodes.indexOf(id), 1);
                    }
                    this.updateField(this.treeData, this.fields, id, 'isChecked', null);
                }
                this.checkedNodes = [];
            } else {
                for (let i: number = 0; i < this.treeData.length; i++) {
                    const checkedId: string = this.treeData[parseInt(i.toString(), 10)][this.fields.id]
                        ? this.treeData[parseInt(i.toString(), 10)][this.fields.id].toString()
                        : null;
                    if (this.checkedNodes.indexOf(checkedId) === -1) {
                        this.checkDisabledState(checkedId, this.treeData[i as number]);
                    }
                }
            }
        } else {
            let childItems: { [key: string]: any }[] = this.getChildNodes(this.treeData, parentIndex);
            if (childItems) {
                const filteredChildItems: { [key: string]: any }[] = childItems.filter((item: { [key: string]: any }) => {
                    const itemValue: string = String(item[Object.keys(item)[0]]);
                    return this.checkedNodes.indexOf(itemValue) !== -1;
                });
                if (filteredChildItems.length > 0 && childItems.length && this.isFilter) {
                    childItems = filteredChildItems;
                }
                this.childStateChange(childItems, parentIndex, childElement, doCheck);
            }
        }
    }
    private checkDisabledState(resultId: string, currentItem?: { [key: string]: Object; }): void {
        let requiresUpdate: boolean = this.checkDisabledChildren;
        if (!requiresUpdate) {
            let shouldPreventUpdate: boolean = true;
            if (this.loadOnDemand && this.fields.htmlAttributes) {
                currentItem = isNOU(currentItem) ? currentItem : this.getNodeObject(resultId);
                if (!isNOU(currentItem)) {
                    const htmlAttributes: { [key: string]: string } = currentItem[this.fields.htmlAttributes] as { [key: string]: string };
                    if (htmlAttributes && !isNOU(htmlAttributes.class) && htmlAttributes.class.indexOf(DISABLE) !== -1) {
                        shouldPreventUpdate = false;
                    }
                }
            }
            const liElement: Element = select(`[data-uid="${resultId}"]`, this.element);
            requiresUpdate = liElement ? !liElement.classList.contains(DISABLE)
                : (this.disableNode.indexOf(resultId) === -1 && shouldPreventUpdate);
        }
        if (requiresUpdate) {
            this.checkedNodes.push(resultId);
        }
    }
    private getChildItems(childItems: { [key: string]: Object }[], doCheck?: boolean): void {
        for (let i: number = 0; i < childItems.length; i++) {
            const childId: string = childItems[parseInt(i.toString(), 10)][this.fields.id]
                ? childItems[parseInt(i.toString(), 10)][this.fields.id].toString()
                : null;
            const childIsCheck: string = childItems[parseInt(i.toString(), 10)][this.fields.isChecked]
                ? childItems[parseInt(i.toString(), 10)][this.fields.isChecked].toString()
                : null;
            if (this.checkedNodes.indexOf(childId) !== -1 && !doCheck) {
                this.checkedNodes.splice(this.checkedNodes.indexOf(childId), 1);
            }
            if (this.checkedNodes.indexOf(childId) === -1 && doCheck) {
                this.checkDisabledState(childId, childItems[i as number]);
            }
            if (childIsCheck === 'true' && !doCheck) {
                this.updateField(this.treeData, this.fields, childId, 'isChecked', null);
            }
            const subChildItems: { [key: string]: Object }[] = this.getChildNodes(this.treeData, childId);
            if (subChildItems.length > 0) {
                this.getChildItems(subChildItems, doCheck);
            }
        }
    }
    /**
     * Update checkedNodes when UI interaction happens before the child node renders in DOM for hierarchical DS
     *
     * @param {Object[]} childItems - Array of child items
     * @param {string} parent - Parent identifier
     * @param {Element} childElement - Child DOM element
     * @param {boolean} [doCheck] - Optional parameter to specify whether to perform a check
     * @returns {void}
     */
    private childStateChange(childItems: { [key: string]: Object }[], parent: string, childElement: Element, doCheck?: boolean): void {
        for (let i: number = 0; i < childItems.length; i++) {
            const checkedChild: string = childItems[parseInt(i.toString(), 10)][this.fields.id] ? childItems[parseInt(i.toString(), 10)][this.fields.id].toString() : '';
            const isCheck: string = childItems[parseInt(i.toString(), 10)][this.fields.isChecked]
                ? childItems[parseInt(i.toString(), 10)][this.fields.isChecked].toString()
                : null;
            if (this.autoCheck) {
                if (this.checkedNodes.indexOf(parent) !== -1 && this.checkedNodes.indexOf(checkedChild) === -1) {
                    this.checkDisabledState(checkedChild, childItems[i as number]);
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
                        this.checkDisabledState(checkedChild, childItems[i as number]);
                    }
                }
            }
            const subChild: { [key: string]: Object }[] = this.getChildNodes([childItems[parseInt(i.toString(), 10)]], checkedChild);
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
                const childId: string = getValue(this.fields.id, child[parseInt(length.toString(), 10)]);
                const check: Element = this.element.querySelector('[data-uid="' + childId + '"]');
                //Validates isChecked case while no UI interaction has been performed on the node or it's parent
                if (validateCheck !== false && this.checkedElement.indexOf(childId.toString()) === -1) {
                    if (((check === null && !isNOU(child[parseInt(length.toString(), 10)][this.fields.isChecked]) &&
                        newCheck.indexOf(childId.toString()) === -1)
                        || childCheck === 0 || checked === 2)) {
                        if (child[parseInt(length.toString(), 10)][this.fields.isChecked] !== false || checked === 2) {
                            newCheck.push(childId.toString());
                        } else {
                            childCheck = null;
                        }
                        childCheck = (child[parseInt(length.toString(), 10)][this.fields.isChecked] !== false || checked === 2) ? 0 : null;
                    }
                }
                //Pushes child checked node done thro' UI interaction
                if (newCheck.indexOf(childId.toString()) === -1 && isNOU(checked)) {
                    newCheck.push(childId.toString());
                }
                const hierChildId: { [key: string]: Object }[] = getValue(
                    this.fields.child.toString(),
                    child[parseInt(length.toString(), 10)]
                );
                //Gets if any next level children are available for child nodes
                if (getValue(this.fields.hasChildren, child[parseInt(length.toString(), 10)]) === true || hierChildId) {
                    const id: string = getValue(this.fields.id, child[parseInt(length.toString(), 10)]);
                    let childId: { [key: string]: Object }[];
                    if (this.dataType === 1) {
                        childId = this.getChildNodes(this.treeData, id.toString());
                    }
                    else {
                        childId = hierChildId;
                    }
                    if (childId) {
                        if (isNOU(validateCheck)) {
                            this.allCheckNode(childId, newCheck, checked, childCheck);
                        } else {
                            this.allCheckNode(childId, newCheck, checked, childCheck, validateCheck);
                        }
                        childCheck = null;
                    }
                }
                childCheck = null;
            }
        }
    }

    private openNode(toBeOpened: boolean, e: KeyboardEventArgs): void {
        const focusedNode: Element = this.getFocusedNode();
        const icon: Element = select('div.' + ICON, focusedNode);
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
                const parentLi: Element = closest(closest(focusedNode, '.' + PARENTITEM), '.' + LISTITEM);
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
        const focusedNode: Element = this.getFocusedNode();
        this.focusNextNode(focusedNode, isTowards);
    }

    private navigateRootNode(isBackwards: boolean): void {
        const focusedNode: Element = this.getFocusedNode();
        const rootNode: Element = isBackwards ? this.getRootNode() : this.getEndNode();
        if (!rootNode.classList.contains('e-disable')) {
            this.setFocus(focusedNode, rootNode);
            this.navigateToFocus(isBackwards);
        }
    }

    private getFocusedNode(): Element {
        let selectedItem: Element;
        const fNode: Element = select('.' + LISTITEM + '[tabindex="0"]', this.element);
        if (!isNOU(fNode)) {
            const ariaChecked: string = fNode.getAttribute('aria-checked');
            if (ariaChecked === 'mixed' || ariaChecked === 'false') {
                this.isFilter = false;
            }
        }
        if (isNOU(fNode)) { selectedItem = select('.' + LISTITEM, this.element); }
        return isNOU(fNode) ? (isNOU(selectedItem) ? this.element.firstElementChild : selectedItem) : fNode;
    }

    private focusNextNode(li: Element, isTowards: boolean): void {
        const nextNode: Element = isTowards ? this.getNextNode(li) : this.getPrevNode(li);
        this.setFocus(li, nextNode);
        this.navigateToFocus(!isTowards);
        if (nextNode.classList.contains('e-disable')) {
            const lastChild: HTMLElement = nextNode.lastChild as HTMLElement;
            if (nextNode.previousSibling == null && nextNode.classList.contains('e-level-1')) {
                this.focusNextNode(nextNode, true);
            } else if (nextNode.nextSibling == null && nextNode.classList.contains('e-node-collapsed')) {
                this.focusNextNode(nextNode, false);
            } else if (nextNode.nextSibling == null && lastChild.classList.contains(TEXTWRAP)) {
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
            nextNode = this.liList[parseInt(index.toString(), 10)];
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
            prevNode = this.liList[parseInt(index.toString(), 10)];
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
            rootNode = this.liList[parseInt(index.toString(), 10)];
            index++;
        }
        while (!isVisible(rootNode));
        return rootNode;
    }

    private getEndNode(): Element {
        let index: number = this.liList.length - 1;
        let endNode: Element;
        do {
            endNode = this.liList[parseInt(index.toString(), 10)];
            index--;
        }
        while (!isVisible(endNode));
        return endNode;
    }

    private setFocus(preNode: Element, nextNode: Element): void {
        removeClass([preNode], FOCUS);
        preNode.setAttribute('tabindex', '-1');
        if (!nextNode.classList.contains('e-disable')) {
            addClass([nextNode], FOCUS);
            nextNode.setAttribute('tabindex', '0');
            (<HTMLElement>nextNode).focus();
            EventHandler.add(nextNode, 'blur', this.focusOut, this);
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
            const focusedElement: Element = this.getFocusedNode();
            if (focusedElement.classList.contains('e-disable')) {
                focusedElement.setAttribute('tabindex', '-1');
                this.navigateNode(true);
            } else {
                focusedElement.setAttribute('tabindex', '0');
                addClass([focusedElement], FOCUS);
                EventHandler.add(focusedElement, 'blur', this.focusOut, this);
            }
            this.mouseDownStatus = false;
        }
    }

    private focusOut(event: Event): void {
        const focusedElement: Element = this.getFocusedNode();
        if (event.target === focusedElement) {
            removeClass([focusedElement], FOCUS);
            EventHandler.remove(focusedElement, 'blur', this.focusOut);
        }
    }

    private onMouseOver(e: MouseEvent): void {
        if (Browser.isDevice) {
            return;
        }
        const target: Element = <Element>e.target;
        const classList: DOMTokenList = target.classList;
        const currentLi: Element = closest(target, '.' + LISTITEM);
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
        if (!li.classList.contains(HOVER) && !li.classList.contains(PREVENTSELECT)) {
            this.removeHover();
            addClass([li], HOVER);
        }
    }

    private onMouseLeave(): void {
        this.removeHover();
    }

    private removeHover(): void {
        const hoveredNode: Element[] = selectAll('.' + HOVER, this.element);
        if (hoveredNode && hoveredNode.length) {
            removeClass(hoveredNode, HOVER);
        }
    }

    private getNodeData(currLi: Element, fromDS?: boolean, dragData?: { [key: string]: Object; }): { [key: string]: Object } {
        if (!isNOU(currLi) && currLi.classList.contains(LISTITEM) &&
            !isNOU(closest(currLi, '.' + CONTROL)) && closest(currLi, '.' + CONTROL).classList.contains(ROOT)) {
            const id: string = currLi.getAttribute('data-uid');
            const text: string = this.getText(currLi, fromDS, dragData);
            const pNode: Element = closest(currLi.parentNode, '.' + LISTITEM);
            const pid: string = pNode ? pNode.getAttribute('data-uid') : null;
            const selected: boolean = currLi.classList.contains(ACTIVE);
            const selectable: boolean = currLi.classList.contains(PREVENTSELECT) ? false : true;
            const expanded: boolean = (currLi.getAttribute('aria-expanded') === 'true') ? true : false;
            const hasChildren: boolean = currLi.getAttribute('aria-expanded') !== null ? true : (select('.' + EXPANDABLE, currLi) || select('.' + COLLAPSIBLE, currLi)) != null ? true : false;
            let checked: string = null;
            const checkboxElement: HTMLElement | Element = select('.' + CHECKBOXWRAP, currLi);
            if (this.showCheckBox && checkboxElement) {
                checked = currLi.getAttribute('aria-checked');
            }
            return {
                id: id, text: text, parentID: pid, selected: selected, selectable: selectable, expanded: expanded,
                isChecked: checked, hasChildren: hasChildren
            };
        }
        return { id: '', text: '', parentID: '', selected: false, expanded: false, isChecked: '', hasChildren: false };
    }

    private getText(currLi: Element, fromDS?: boolean, dragData?: { [key: string]: Object; }): string {
        if (fromDS) {
            const nodeData: { [key: string]: Object } = !isNullOrUndefined(dragData) ? dragData : this.getNodeObject(currLi.getAttribute('data-uid'));
            const level: number = parseFloat(currLi.getAttribute('aria-level'));
            const nodeFields: FieldsSettingsModel = this.getFields(this.fields, level, 1);
            return !isNullOrUndefined(dragData) ? dragData.text as string : getValue(nodeFields.text, nodeData);
        }
        return select('.' + LISTTEXT, currLi).textContent;
    }

    private getExpandEvent(currLi: Element, e: MouseEvent | KeyboardEventArgs | TapEventArgs): NodeExpandEventArgs {
        const nodeData: { [key: string]: Object } = this.getNodeData(currLi);
        return { cancel: false, isInteracted: isNOU(e) ? false : true, node: currLi as HTMLLIElement, nodeData: nodeData, event: e };
    }

    private renderNodeTemplate(data: { [key: string]: Object }, textEle: Element, dataId: string): void {

        let tempArr: Element[] = this.nodeTemplateFn(data, this, 'nodeTemplate' + dataId, this.element.id + 'nodeTemplate',
                                                     this.isStringTemplate, undefined, textEle, this.root);
        if (tempArr) {
            tempArr = Array.prototype.slice.call(tempArr);
            append(tempArr, textEle);
        }
    }

    private destroyTemplate(liEle: Element): void {
        this.clearTemplate(['nodeTemplate' + liEle.getAttribute('data-uid')]);
    }

    private reRenderNodes(): void {
        this.updateListProp(this.fields);
        if (Browser.isIE) {
            this.ulElement = this.element.querySelector('.e-list-parent.e-ul');
            this.ulElement.parentElement.removeChild(this.ulElement);
        } else {
            this.element.innerHTML = '';
        }
        if (!isNOU(this.nodeTemplateFn)) {
            this.clearTemplate();
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
        const target: Element = <Element>e.target;
        if (!target || target.classList.contains(ROOT) || target.classList.contains(PARENTITEM) ||
            target.classList.contains(LISTITEM) || target.classList.contains(ICON) ||
            target.classList.contains(INPUT) || target.classList.contains(INPUTGROUP)) {
            return;
        } else {
            const liEle: Element = closest(target, '.' + LISTITEM);
            this.createTextbox(liEle);
        }
    }

    private createTextbox(liEle: Element): void {
        const oldInpEle: HTMLElement = <HTMLElement>select('.' + TREEINPUT, this.element);
        if (oldInpEle) {
            oldInpEle.blur();
        }
        const textEle: Element = select('.' + LISTTEXT, liEle);
        this.updateOldText(liEle);
        const innerEle: HTMLElement = this.createElement('input', { className: TREEINPUT, attrs: { value: this.oldText } });
        const eventArgs: NodeEditEventArgs = this.getEditEvent(liEle, null, innerEle.outerHTML);
        this.trigger('nodeEditing', eventArgs, (observedArgs: NodeEditEventArgs) => {
            if (!observedArgs.cancel) {
                const inpWidth: number = (<HTMLElement>textEle).offsetWidth + 5;
                const widthSize: string = inpWidth + 'px';
                addClass([liEle], EDITING);
                if (!isNOU(this.nodeTemplateFn)) {
                    this.destroyTemplate(liEle);
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if ((this as any).isReact) {
                    setTimeout(() => {
                        this.renderTextBox(eventArgs, textEle, widthSize);
                    }, 5);
                } else {
                    this.renderTextBox(eventArgs, textEle, widthSize);
                }
            }
        });
    }

    private renderTextBox(eventArgs: NodeEditEventArgs, textEle: Element, widthSize: string): void {
        textEle.innerHTML = eventArgs.innerHtml;
        const inpEle: HTMLElement = <HTMLElement>select('.' + TREEINPUT, textEle);
        this.inputObj = Input.createInput(
            {
                element: inpEle as HTMLInputElement,
                properties: {
                    enableRtl: this.enableRtl
                }
            },
            this.createElement);
        this.inputObj.container.style.width = widthSize;
        inpEle.focus();
        const inputEle: HTMLInputElement = <HTMLInputElement>inpEle;
        inputEle.setSelectionRange(0, inputEle.value.length);
        this.wireInputEvents(inpEle);
    }

    private updateOldText(liEle: Element): void {
        const id: string = liEle.getAttribute('data-uid');
        this.editData = this.getNodeObject(id);
        const level: number = parseFloat(liEle.getAttribute('aria-level'));
        this.editFields = this.getFields(this.fields, level, 1);
        this.oldText = getValue(this.editFields.text, this.editData);
    }

    private inputFocusOut(e: MouseEvent): void {
        if (!select('.' + TREEINPUT, this.element)) {
            return;
        }
        let target: Element = <Element>e.target;
        const newText: string = (<HTMLInputElement>target).value;
        const txtEle: HTMLElement = closest(target, '.' + LISTTEXT) as HTMLElement;
        const liEle: Element = closest(target, '.' + LISTITEM);
        detach(this.inputObj.container);
        Input.destroy({ element: (<HTMLInputElement>target), properties: this.properties });
        if (this.fields.dataSource instanceof DataManager && !this.isOffline) {
            this.crudOperation('update', null, liEle, newText, null, null, true);
        } else {
            this.appendNewText(liEle, txtEle, newText, true);
        }
        EventHandler.remove(target, 'blur', this.inputFocusOut);
        this.inputObj = null;
        detach(target);
        target = null;
    }

    private appendNewText(liEle: Element, txtEle: HTMLElement, newText: string, isInput: boolean): void {
        const eventArgs: NodeEditEventArgs = this.getEditEvent(liEle, newText, null);
        this.trigger('nodeEdited', eventArgs, (observedArgs: NodeEditEventArgs) => {
            newText = observedArgs.cancel ? observedArgs.oldText : observedArgs.newText;
            this.updateText(liEle, txtEle, newText, isInput);
            if (observedArgs.oldText !== newText) {
                this.triggerEvent('nodeEdited', [this.getNode(liEle)]);
            }
        });
    }

    private updateText(liEle: Element, txtEle: HTMLElement, newText: string, isInput: boolean): void {
        const newData: { [key: string]: Object } = setValue(this.editFields.text, newText, this.editData);
        if (!isNOU(this.nodeTemplateFn)) {
            txtEle.innerText = '';
            const dataId: string = liEle.getAttribute('data-uid');
            this.renderNodeTemplate(newData, txtEle, dataId);
            this.renderReactTemplates();
        } else {
            if (this.enableHtmlSanitizer) {
                txtEle.innerText = SanitizeHtmlHelper.sanitize(newText);
            } else {
                txtEle.innerHTML = newText;
            }
        }
        if (isInput) {
            removeClass([liEle], EDITING);
            (<HTMLElement>liEle).focus();
            EventHandler.add(liEle, 'blur', this.focusOut, this);
            addClass([liEle], FOCUS);
        }
        if (this.allowTextWrap) { this.calculateWrap(liEle); }
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
        const data: { [key: string]: Object } = this.getNodeData(liEle);
        return { cancel: false, newText: newText, node: liEle as HTMLLIElement, nodeData: data, oldText: this.oldText, innerHtml: inpEle };
    }

    private getNodeObject(id: string): { [key: string]: Object } {
        let childNodes: { [key: string]: Object };
        if (isNOU(id)) {
            return childNodes;
        } else if (this.dataType === 1) {
            for (let i: number = 0, objlen: number = this.treeData.length; i < objlen; i++) {
                const dataId: Object = getValue(this.fields.id, this.treeData[parseInt(i.toString(), 10)]);
                if (!isNOU(this.treeData[parseInt(i.toString(), 10)]) && !isNOU(dataId) && dataId.toString() === id) {
                    return this.treeData[parseInt(i.toString(), 10)];
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
            const dataId: Object = getValue(mapper.id, obj[parseInt(i.toString(), 10)]);
            if (obj[parseInt(i.toString(), 10)] && dataId && dataId.toString() === id) {
                return obj[parseInt(i.toString(), 10)];
            } else if (typeof mapper.child === 'string' && !isNOU(getValue(mapper.child, obj[parseInt(i.toString(), 10)]))) {
                const childData: Object = getValue(mapper.child, obj[parseInt(i.toString(), 10)]);
                newList = this.getChildNodeObject(<{ [key: string]: Object }[]>childData, this.getChildMapper(mapper), id);
                if (newList !== undefined) {
                    break;
                }
            } else if (this.fields.dataSource instanceof DataManager && !isNOU(getValue('child', obj[parseInt(i.toString(), 10)]))) {
                const child: string = 'child';
                newList = this.getChildNodeObject(
                    <{ [key: string]: Object }[]>getValue(child, obj[parseInt(i.toString(), 10)]),
                    this.getChildMapper(mapper),
                    id
                );
                if (newList !== undefined) {
                    break;
                }
            } else if (this.isChildObject()) {
                const children: string = 'child';
                const childData: Object = getValue(children, obj[parseInt(i.toString(), 10)]);
                newList = this.getChildNodeObject(<{ [key: string]: Object }[]>childData, this.getChildMapper(mapper), id);
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

    private initializeDrag(): void {
        let virtualEle: HTMLElement;
        this.dragObj = new Draggable(this.element, {
            enableTailMode: true, enableAutoScroll: true,
            dragArea: this.dragArea,
            dragTarget: '.' + TEXTWRAP,
            enableTapHold: true,
            tapHoldThreshold: 100,
            helper: (e: { sender: MouseEvent & TouchEvent, element: HTMLElement }) => {
                this.dragTarget = <Element>e.sender.target;
                const dragRoot: Element = closest(this.dragTarget, '.' + ROOT);
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
                const cloneEle: Element = <Element>(dragWrap.cloneNode(true));
                if (isNOU(select('div.' + ICON, cloneEle))) {
                    const icon: HTMLElement = this.createElement('div', { className: ICON + ' ' + EXPANDABLE });
                    cloneEle.insertBefore(icon, cloneEle.children[0]);
                }
                const cssClass: string = DRAGITEM + ' ' + ROOT + ' ' + this.cssClass + ' ' + (this.enableRtl ? RTL : '');
                virtualEle = this.createElement('div', { className: cssClass });
                virtualEle.appendChild(cloneEle);
                const nLen: number = this.selectedNodes.length;
                if (nLen > 1 && this.allowMultiSelection && this.dragLi.classList.contains(ACTIVE)) {
                    const cNode: HTMLElement = this.createElement('span', { className: DROPCOUNT, innerHTML: '' + nLen });
                    virtualEle.appendChild(cNode);
                }
                document.body.appendChild(virtualEle);
                document.body.style.cursor = '';
                this.dragData = this.getNodeData(this.dragLi);
                return virtualEle;
            },
            dragStart: (e: DragEventArgs) => {
                addClass([this.element], DRAGGING);
                const listItem: Element = closest(e.target, '.e-list-item'); let level: number;
                if (listItem) {
                    level = parseInt(listItem.getAttribute('aria-level'), 10);
                }
                const eventArgs: DragAndDropEventArgs = this.getDragEvent(e.event, this, null, e.target, null, virtualEle, level);
                if (eventArgs.draggedNode.classList.contains(EDITING)) {
                    this.dragObj.intDestroy(e.event);
                    this.dragCancelAction(virtualEle);
                } else {
                    this.trigger('nodeDragStart', eventArgs, (observedArgs: DragAndDropEventArgs) => {
                        if (observedArgs.cancel) {
                            this.dragObj.intDestroy(e.event);
                            this.dragCancelAction(virtualEle);
                        } else {
                            this.dragStartAction = true;
                        }
                    });
                }
            },
            drag: (e: DragEventArgs) => {
                this.dragObj.setProperties({ cursorAt: { top: (!isNOU(e.event.targetTouches) || Browser.isDevice) ? 60 : -20 } });
                this.dragAction(e, virtualEle);
            },
            dragStop: (e: { event: MouseEvent & TouchEvent, element: HTMLElement, target: Element, helper: HTMLElement }) => {
                if (!e.target) {
                    if (e.helper && e.helper.parentNode) {
                        detach(e.helper);
                    }
                    document.body.style.cursor = '';
                    removeClass([this.element], DRAGGING);
                    this.dragStartAction = false;
                    return;
                }
                removeClass([this.element], DRAGGING);
                if (!e.target.classList.contains('e-sibling')) {
                    this.removeVirtualEle();
                }
                const dropTarget: Element = e.target;
                const preventTargetExpand: boolean = false;
                const dropRoot: Element = (closest(dropTarget, '.' + DROPPABLE));
                // eslint-disable-next-line
                let isHelperElement: boolean = true;
                if (!dropTarget || !dropRoot) {
                    detach(e.helper);
                    document.body.style.cursor = '';
                }
                const listItem: Element = closest(dropTarget, '.e-list-item'); let level: number;
                if (listItem) { level = parseInt(listItem.getAttribute('aria-level'), 10); }
                const eventArgs: DragAndDropEventArgs = this.getDragEvent(e.event, this, dropTarget, <HTMLElement>dropTarget, null,
                                                                          e.helper, level);
                eventArgs.preventTargetExpand = preventTargetExpand;
                this.trigger('nodeDragStop', eventArgs, (observedArgs: DragAndDropEventArgs) => {
                    this.dragParent = observedArgs.draggedParentNode;
                    this.preventExpand = observedArgs.preventTargetExpand;
                    if (observedArgs.cancel) {
                        if (e.helper.parentNode) {
                            detach(e.helper);
                        }
                        document.body.style.cursor = '';
                        isHelperElement = false;
                        if (dropTarget.classList.contains('e-sibling')) {
                            this.removeVirtualEle();
                        }
                    }
                    this.dragStartAction = false;
                });
            }
        });
        this.dropObj = new Droppable(this.element, {
            out: (e: { evt: MouseEvent & TouchEvent, target: Element }) => {
                if (!e.target) {
                    return;
                }
                if (!isNOU(e) && !e.target.classList.contains(SIBLING) &&
                    (this.dropObj.dragData.default && this.dropObj.dragData.default.helper.classList.contains(ROOT))) {
                    document.body.style.cursor = 'not-allowed';
                }
            },
            over: () => {
                document.body.style.cursor = '';
            },
            drop: (e: DropEventArgs) => {
                this.dropAction(e);
                this.removeVirtualEle();
            }
        });
    }
    private dragCancelAction(virtualEle: HTMLElement): void {
        detach(virtualEle);
        removeClass([this.element], DRAGGING);
        this.dragStartAction = false;
    }

    private getOffsetX(event: MouseEvent | TouchEvent, target: HTMLElement): number {
        const touchList: TouchList = (event as TouchEvent).changedTouches;
        if (touchList && touchList.length > 0) {
            return touchList[0].clientX - target.getBoundingClientRect().left;
        }
        else {
            return (event as MouseEvent).offsetX;
        }
    }

    private getOffsetY(event: MouseEvent | TouchEvent, target: HTMLElement): number {
        const touchList: TouchList = (event as TouchEvent).changedTouches;
        if (touchList && touchList.length > 0) {
            return touchList[0].clientY - target.getBoundingClientRect().top;
        } else {
            return (event as MouseEvent).offsetY;
        }
    }

    private dragAction(e: DropEventArgs, virtualEle: HTMLElement): void {
        if (!e.target) {
            return;
        }
        const dropRoot: Element = closest(e.target, '.' + DROPPABLE);
        let dropWrap: Element = closest(e.target, '.' + TEXTWRAP);
        const icon: Element = select('div.' + ICON, virtualEle);
        removeClass([icon], [DROPIN, DROPNEXT, DROPOUT, NODROP]);
        this.isDropIn = false;
        this.removeVirtualEle();
        document.body.style.cursor = '';
        const classList: DOMTokenList = e.target.classList;
        const event: MouseEvent | TouchEvent = e.event;
        const offsetY: number = this.getOffsetY(event, e.target as HTMLElement);
        const offsetX: number = this.getOffsetX(event, e.target as HTMLElement);
        if (this.fullRowSelect && !dropWrap && !isNOU(classList) && classList.contains(FULLROW)) {
            dropWrap = e.target.nextElementSibling;
        }
        if (dropRoot) {
            const dropLi: Element = closest(e.target, '.' + LISTITEM);
            const checkWrapper: HTMLElement = closest(e.target, '.' + CHECKBOXWRAP) as HTMLElement;
            const collapse: Element = closest(e.target, '.' + COLLAPSIBLE);
            const expand: Element = closest(e.target, '.' + EXPANDABLE);
            if (!dropRoot.classList.contains(ROOT) || (dropWrap &&
                (!dropLi.isSameNode(this.dragLi) && !this.isDescendant(this.dragLi, dropLi)))) {
                if (this.hasTemplate && dropLi) {
                    const templateTarget: HTMLElement = select(this.fullRowSelect ? '.' + FULLROW : '.' + TEXTWRAP, dropLi) as HTMLElement;
                    if ((e && (!expand && !collapse) && offsetY < 7 && !checkWrapper) ||
                        (((expand && offsetY < 5) || (collapse && offsetX < 3)))) {
                        const index: number = this.fullRowSelect ? (1) : (0);
                        this.appendIndicator(dropLi, icon, index);
                    } else if (
                        (e && (!expand && !collapse) &&
                        !checkWrapper && templateTarget && offsetY > templateTarget.offsetHeight - 10) ||
                        ((expand && offsetY > 19) || (collapse && offsetX > 19))
                    ) {
                        const index: number = this.fullRowSelect ? (2) : (1);
                        this.appendIndicator(dropLi, icon, index);
                    } else {
                        addClass([icon], DROPIN);
                        this.isDropIn = true;
                    }
                } else {
                    if (
                        (dropLi && e && (!expand && !collapse) && (offsetY < 7) && !checkWrapper) ||
                        (((expand && offsetY < 5) || (collapse && offsetX < 3)))
                    ) {
                        const index: number = this.fullRowSelect ? (1) : (0);
                        this.appendIndicator(dropLi, icon, index);
                    } else if (
                        (dropLi && e && (!expand && !collapse) &&
                        (e.target.offsetHeight > 0 && offsetY > (e.target.offsetHeight - 10)) && !checkWrapper) ||
                        (((expand && offsetY > 19) || (collapse && offsetX > 19)))
                    ) {
                        const index: number = this.fullRowSelect ? (2) : (1);
                        this.appendIndicator(dropLi, icon, index);
                    } else {
                        addClass([icon], DROPIN);
                        this.isDropIn = true;
                    }
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
        const listItem: Element = closest(e.target, '.e-list-item');
        let level: number;
        if (listItem) {
            level = parseInt(listItem.getAttribute('aria-level'), 10);
        }
        const eventArgs: DragAndDropEventArgs = this.getDragEvent(e.event, this, e.target, e.target, null, virtualEle, level);
        if (eventArgs.dropIndicator) {
            removeClass([icon], eventArgs.dropIndicator);
        }
        this.trigger('nodeDragging', eventArgs);
        if (eventArgs.dropIndicator) {
            addClass([icon], eventArgs.dropIndicator);
        }
    }
    private appendIndicator(dropLi: Element, icon: Element, index: number): void {
        addClass([icon], DROPNEXT);
        const virEle: Element = this.createElement('div', { className: SIBLING });
        dropLi.insertBefore(virEle, dropLi.children[parseInt(index.toString(), 10)]);
    }

    private dropAction(e: DropEventArgs): void {
        const event: MouseEvent | TouchEvent = e.event;
        const offsetY: number = this.getOffsetY(event, e.target as HTMLElement);
        const dropTarget: Element = <Element>e.target;
        let dragObj: TreeView;
        let level: number;
        let drop: boolean = false;
        const nodeData: { [key: string]: Object }[] = [];
        let liArray: HTMLElement[] = [];
        const dragInstance: EJ2Instance = <EJ2Instance>e.dragData.draggable;
        for (let i: number = 0; i < dragInstance.ej2_instances.length; i++) {
            if (dragInstance.ej2_instances[parseInt(i.toString(), 10)] instanceof TreeView) {
                dragObj = (dragInstance.ej2_instances[parseInt(i.toString(), 10)] as TreeView);
                break;
            }
        }
        if (dragObj && dragObj.dragTarget) {
            const dragTarget: Element = dragObj.dragTarget;
            const dragLi: Element = (closest(dragTarget, '.' + LISTITEM));
            let dropLi: Element = (closest(dropTarget, '.' + LISTITEM));
            liArray.push(<HTMLElement>dragLi);
            if (dropLi == null && dropTarget.classList.contains(ROOT)) {
                dropLi = dropTarget.firstElementChild;
            }
            detach(e.droppedElement);
            document.body.style.cursor = '';
            if (!dropLi || dropLi.isSameNode(dragLi) || this.isDescendant(dragLi, dropLi)) {
                if (this.fields.dataSource instanceof DataManager === false) {
                    this.preventExpand = false;
                }
                return;
            }
            if (dragObj.allowMultiSelection && dragLi.classList.contains(ACTIVE)) {
                const sNodes: HTMLElement[] = selectAll('.' + ACTIVE, dragObj.element);
                liArray = sNodes;
                if (e.target.offsetHeight <= 33 && offsetY > e.target.offsetHeight - 10 && offsetY > 6) {
                    for (let i: number = sNodes.length - 1; i >= 0; i--) {
                        if (dropLi.isSameNode(sNodes[parseInt(i.toString(), 10)]) ||
                            this.isDescendant(sNodes[parseInt(i.toString(), 10)], dropLi)) {
                            continue;
                        }
                        this.appendNode(dropTarget, sNodes[parseInt(i.toString(), 10)], dropLi, e, dragObj, offsetY);
                    }
                } else {
                    for (let i: number = 0; i < sNodes.length; i++) {
                        if (dropLi.isSameNode(sNodes[parseInt(i.toString(), 10)]) ||
                            this.isDescendant(sNodes[parseInt(i.toString(), 10)], dropLi)) {
                            continue;
                        }
                        this.appendNode(dropTarget, sNodes[parseInt(i.toString(), 10)], dropLi, e, dragObj, offsetY);
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
        const dragData: { [key: string]: Object } = isNullOrUndefined(dragObj) ? null : dragObj.dragData;
        for (let i: number = 0; i < liArray.length; i++) {
            nodeData.push(this.getNodeData(this.getElement(liArray[parseInt(i.toString(), 10)]), true, dragData));
        }
        this.trigger('nodeDropped', this.getDragEvent(e.event, dragObj, dropTarget, e.target, <HTMLLIElement>e.dragData.draggedElement,
                                                      null, level, drop));
        if (dragObj.element.id !== this.element.id) {
            dragObj.triggerEvent('nodeDropped', nodeData);
            this.isNodeDropped = true;
            this.fields.dataSource = this.treeData;
        }
        this.triggerEvent('nodeDropped', nodeData);
    }

    private appendNode(dropTarget: Element, dragLi: Element, dropLi: Element, e: DropEventArgs, dragObj: TreeView, offsetY: number): void {
        const checkWrapper: HTMLElement = closest(dropTarget, '.' + CHECKBOXWRAP) as HTMLElement;
        const collapse: Element = closest(e.target, '.' + COLLAPSIBLE);
        const expand: Element = closest(e.target, '.' + EXPANDABLE);
        if (!dragLi.classList.contains('e-disable') && !checkWrapper && ((expand && e.event.offsetY < 5) || (collapse && e.event.offsetX < 3) || (expand && e.event.offsetY > 19) || (collapse && e.event.offsetX > 19) || (!expand && !collapse))) {
            if (dropTarget.nodeName === 'LI') {
                this.dropAsSiblingNode(dragLi, dropLi, e, dragObj);
            }
            else if (dropTarget.firstElementChild && dropTarget.classList.contains(ROOT)) {
                if (dropTarget.firstElementChild.nodeName === 'UL') {
                    this.dropAsSiblingNode(dragLi, dropLi, e, dragObj);
                }
            }
            else if ((dropTarget.classList.contains('e-icon-collapsible')) || (dropTarget.classList.contains('e-icon-expandable'))) {
                this.dropAsSiblingNode(dragLi, dropLi, e, dragObj);
            }
            else {
                this.dropAsChildNode(dragLi, dropLi, dragObj, null, e, offsetY, null, dropTarget);
            }
        }
        else {
            this.dropAsChildNode(dragLi, dropLi, dragObj, null, e, offsetY, true, dropTarget);
        }
        if (this.showCheckBox) {
            this.ensureIndeterminate();
        }
    }

    private dropAsSiblingNode(dragLi: Element, dropLi: Element, e: DropEventArgs, dragObj: TreeView): void {
        const dropUl: Element = closest(dropLi, '.' + PARENTITEM);
        const dragParentUl: Element = closest(dragLi, '.' + PARENTITEM);
        const dragParentLi: Element = closest(dragParentUl, '.' + LISTITEM);
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
            const target: Element = e.target.closest('li');
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

    private dropAsChildNode(
        dragLi: Element,
        dropLi: Element,
        dragObj: TreeView,
        index?: number,
        e?: DropEventArgs,
        pos?: number,
        isCheck?: boolean,
        dropTarget?: Element
    ): void {
        const dragParentUl: Element = closest(dragLi, '.' + PARENTITEM);
        const dragParentLi: Element = closest(dragParentUl, '.' + LISTITEM);
        const dropParentUl: Element = closest(dropLi, '.' + PARENTITEM);
        let templateTarget: HTMLElement;
        if (e && e.target) {
            templateTarget = select(this.fullRowSelect ? '.' + FULLROW : '.' + TEXTWRAP, dropLi) as HTMLElement;
        }
        if (e && ((pos < 7 && !dropTarget.classList.contains('e-sibling')) || (dropTarget.classList.contains('e-sibling') && !(dropLi.lastChild as Element).classList.contains('e-sibling'))) && !isCheck) {
            dropParentUl.insertBefore(dragLi, dropLi);
            this.moveData(dragLi, dropLi, dropParentUl, true, dragObj);
        } else if (e && (e.target.offsetHeight > 0 && pos > (e.target.offsetHeight - 10)) && !isCheck && !this.hasTemplate) {
            dropParentUl.insertBefore(dragLi, dropLi.nextElementSibling);
            this.moveData(dragLi, dropLi, dropParentUl, false, dragObj);
        } else if (this.hasTemplate && templateTarget && pos > templateTarget.offsetHeight - 10 && !isCheck) {
            dropParentUl.insertBefore(dragLi, dropLi.nextElementSibling);
            this.moveData(dragLi, dropLi, dropParentUl, false, dragObj);
        } else {
            const dropUl: Element = this.expandParent(dropLi);
            const childLi: Element = !isNullOrUndefined(index) ? <Element>dropUl.childNodes[parseInt(index.toString(), 10)] : null;
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
        const dropParentLi: Element = closest(dropUl, '.' + LISTITEM);
        const id: string = this.getId(dragLi);
        const removedData: { [key: string]: Object }[] = dragObj.updateChildField(dragObj.treeData, dragObj.fields, id, null, null, true);
        const refId: string = this.getId(dropLi);
        const index: number = refId ? this.getDataPos(this.treeData, this.fields, refId) : null;
        const parentId: string = this.getId(dropParentLi);
        if (this.dataType === 1) {
            this.updateField(this.treeData, this.fields, parentId, 'hasChildren', true);
            let pos: number = isNOU(index) ? this.treeData.length : (pre ? index : index + 1);
            if (isNOU(parentId) && !this.hasPid) {
                delete removedData[0][this.fields.parentID];
            } else {
                const currPid: string | number = this.isNumberTypeId ? parseFloat(parentId) : parentId;
                setValue(this.fields.parentID, currPid, removedData[0]);
            }
            this.treeData.splice(pos, 0, removedData[0]);
            if (dragObj.element.id !== this.element.id) {
                const childData: { [key: string]: Object }[] = dragObj.removeChildNodes(id);
                pos++;
                for (let i: number = 0, len: number = childData.length; i < len; i++) {
                    this.treeData.splice(pos, 0, childData[parseInt(i.toString(), 10)]);
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
        const dropIcon: Element = select('div.' + EXPANDABLE + ', div.' + COLLAPSIBLE, dropLi);
        if (dropIcon && dropIcon.classList.contains(EXPANDABLE) && this.preventExpand !== true) {
            this.expandAction(dropLi, dropIcon, null);
        }
        let dropUl: Element = select('.' + PARENTITEM, dropLi);
        if (this.preventExpand === true && !dropUl && dropIcon) {
            this.renderChildNodes(dropLi);
        }
        dropUl = select('.' + PARENTITEM, dropLi);
        if (!isNOU(dropUl) && (this.preventExpand && !(dropLi.getAttribute('aria-expanded') === 'true'))) {
            (dropUl as HTMLElement).style.display = 'none';
        }
        if (!isNOU(dropUl) && this.preventExpand === false) {
            (dropUl as HTMLElement).style.display = 'block';
        }
        if (isNOU(dropUl) && this.preventExpand === true) {
            if (isNOU(dropIcon)) {
                ListBase.generateIcon(this.createElement, dropLi as HTMLElement, EXPANDABLE, this.listBaseOption);
            }
            const icon: Element = select('div.' + EXPANDABLE + ', div.' + COLLAPSIBLE, dropLi);
            if (icon) {
                icon.classList.add('e-icon-expandable');
            }
            dropUl = ListBase.generateUL(this.createElement, [], null, this.listBaseOption);
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
            const args: NodeExpandEventArgs & {name: string} = this.expandArgs as NodeExpandEventArgs & {name: string};
            if (isNOU(args) || (args && args.name !== 'nodeExpanding')) {
                this.trigger('nodeExpanding', this.getExpandEvent(dropLi, null));
            }
            if (isNOU(dropIcon)) {
                ListBase.generateIcon(this.createElement, dropLi as HTMLElement, COLLAPSIBLE, this.listBaseOption);
            }
            let icon: Element = select('div.' + EXPANDABLE + ', div.' + COLLAPSIBLE, dropLi);
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
        const collapseIcon: Element = select('div.' + COLLAPSIBLE, dropLi);
        if (!isNOU(dropUl) && collapseIcon && (this.preventExpand && !(dropLi.getAttribute('aria-expanded') === 'true'))) {
            removeClass([collapseIcon], COLLAPSIBLE);
            dropLi.setAttribute('aria-expanded', 'false');
            addClass([collapseIcon], EXPANDABLE);
        }
        return dropUl;
    }

    private updateElement(dragParentUl: Element, dragParentLi: Element): void {
        if (dragParentLi && dragParentUl.childElementCount === 0) {
            const dragIcon: Element = select('div.' + ICON, dragParentLi);
            detach(dragParentUl);
            detach(dragIcon);
            const parentId: string = this.getId(dragParentLi);
            this.updateField(this.treeData, this.fields, parentId, 'hasChildren', false);
            this.removeExpand(dragParentLi, true);
        }
    }

    private updateAriaLevel(dragLi: Element): void {
        const level: number = this.parents(dragLi, '.' + PARENTITEM).length;
        dragLi.setAttribute('aria-level', '' + level);
        this.updateChildAriaLevel(select('.' + PARENTITEM, dragLi), level + 1);
    }

    private updateChildAriaLevel(element: Element, level: number): void {
        if (!isNOU(element)) {
            const cNodes: Element[] = <NodeListOf<Element> & Element[]>element.childNodes;
            for (let i: number = 0, len: number = cNodes.length; i < len; i++) {
                const liEle: Element = cNodes[parseInt(i.toString(), 10)];
                liEle.setAttribute('aria-level', '' + level);
                this.updateChildAriaLevel(select('.' + PARENTITEM, liEle), level + 1);
            }
        }
    }

    private renderVirtualEle(e: DragEventArgs): void {
        let pre: boolean;
        const event: MouseEvent | TouchEvent = e.event;
        const offsetY: number = this.getOffsetY(event, e.target as HTMLElement);
        if (offsetY > e.target.offsetHeight - 2) {
            pre = false;
        } else if (offsetY < 2) {
            pre = true;
        }
        const virEle: Element = this.createElement('div', { className: SIBLING });
        const index: number = this.fullRowSelect ? (pre ? 1 : 2) : (pre ? 0 : 1);
        e.target.insertBefore(virEle, e.target.children[parseInt(index.toString(), 10)]);
    }

    private removeVirtualEle(): void {
        const sibEle: Element = select('.' + SIBLING);
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
        const dropLi: Element = dropTarget ? closest(dropTarget, '.' + LISTITEM) : null;
        const dropData: { [key: string]: Object } = dropLi ? this.getNodeData(dropLi) : null;
        const draggedNode: HTMLLIElement = obj ? obj.dragLi as HTMLLIElement : dragNode;
        const draggedNodeData: { [key: string]: Object } = obj ? obj.dragData : null;
        const newParent: Element[] = dropTarget ? this.parents(dropTarget, '.' + LISTITEM) : null;
        const dragLiParent: Element = obj.dragLi.parentElement;
        let dragParent: Element = obj.dragLi ? closest(dragLiParent, '.' + LISTITEM) : null;
        let targetParent: Element = null;
        let indexValue: number = null;
        const iconCss: string[] = [DROPNEXT, DROPIN, DROPOUT, NODROP];
        let iconClass: string = null;
        const node: Element = (drop === true) ? draggedNode : dropLi;
        const index: Element = node ? closest(node, '.e-list-parent') : null;
        let i: number = 0;
        let position: string = null;
        dragParent = (obj.dragLi && dragParent === null) ? closest(dragLiParent, '.' + ROOT) : dragParent;
        dragParent = (drop === true) ? this.dragParent : dragParent;
        if (cloneEle) {
            while (i < 4) {
                if (select('.' + ICON, cloneEle).classList.contains(iconCss[parseInt(i.toString(), 10)])) {
                    iconClass = iconCss[parseInt(i.toString(), 10)];
                    break;
                }
                i++;
            }
        }
        if (index) {
            let dropTar: number = 0;
            for (i = 0; i < index.childElementCount; i++) {
                dropTar = (drop !== true && index.children[parseInt(i.toString(), 10)] === draggedNode && dropLi !== draggedNode)
                    ? ++dropTar
                    : dropTar;

                if ((drop !== true && index.children[parseInt(i.toString(), 10)].classList.contains('e-hover'))) {
                    indexValue = (event.offsetY >= 23) ? i + 1 : i;
                    break;
                } else if (index.children[parseInt(i.toString(), 10)] === node) {
                    indexValue = (event.offsetY >= 23) ? i : i;
                    break;
                }
            }
            indexValue = (dropTar !== 0) ? --indexValue : indexValue;
            position = this.isDropIn ? 'Inside' : ((event.offsetY < 7) ? 'Before' : 'After');
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
        if (dropTarget && target.offsetHeight <= 33 && event.offsetY < target.offsetHeight - 10 && event.offsetY > 6) {
            targetParent = dropLi;
            if (drop !== true) {
                level = ++level;
                const parent: Element = targetParent ? select('.e-list-parent', targetParent) : null;
                indexValue = (parent) ? parent.children.length : 0;
                if (!(this.fields.dataSource instanceof DataManager) && parent === null && targetParent) {
                    const parent: { [key: string]: Object; }[] = targetParent.hasAttribute('data-uid') ?
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
            position: position
        };
    }

    private addFullRow(toAdd: boolean): void {
        const len: number = this.liList.length;
        if (toAdd) {
            for (let i: number = 0; i < len; i++) {
                this.createFullRow(this.liList[parseInt(i.toString(), 10)]);
            }
        } else {
            for (let i: number = 0; i < len; i++) {
                const rowDiv: Element = select('.' + FULLROW, this.liList[parseInt(i.toString(), 10)]);
                detach(rowDiv);
            }
        }
    }

    private createFullRow(item: HTMLElement): void {
        const rowDiv: Element = this.createElement('div', { className: FULLROW });
        item.insertBefore(rowDiv, item.childNodes[0]);
    }

    private addMultiSelect(toAdd: boolean): void {
        if (toAdd) {
            const liEles: Element[] = selectAll('.' + LISTITEM + ':not([aria-selected="true"])', this.element);
            for (const ele of liEles) {
                ele.setAttribute('aria-selected', 'false');
            }
        } else {
            const liEles: Element[] = selectAll('.' + LISTITEM + '[aria-selected="false"]', this.element);
            for (const ele of liEles) {
                ele.removeAttribute('aria-selected');
            }
        }
    }

    private collapseByLevel(element: Element, level: number, excludeHiddenNodes: boolean, currentLevel?: number): void {
        currentLevel = isNOU(currentLevel) ? 1 : currentLevel;
        if (level > 0 && !isNOU(element)) {
            const cNodes: Element[] = this.getVisibleNodes(excludeHiddenNodes, <NodeListOf<Element> & Element[]>element.childNodes);
            for (let i: number = 0, len: number = cNodes.length; i < len; i++) {
                const liEle: Element = cNodes[parseInt(i.toString(), 10)];
                const icon: Element = select('.' + COLLAPSIBLE, select('.' + TEXTWRAP, liEle));
                if (currentLevel >= level && !isNOU(icon)) {
                    this.collapseNode(liEle, icon, null);
                }
                this.collapseByLevel(select('.' + PARENTITEM, liEle), level, excludeHiddenNodes, currentLevel + 1);
            }
        }
    }

    private collapseAllNodes(excludeHiddenNodes: boolean): void {
        const cIcons: Element[] = this.getVisibleNodes(excludeHiddenNodes, selectAll('.' + COLLAPSIBLE, this.element));
        for (let i: number = 0, len: number = cIcons.length; i < len; i++) {
            const icon: Element = cIcons[parseInt(i.toString(), 10)];
            const liEle: Element = closest(icon, '.' + LISTITEM);
            this.collapseNode(liEle, icon, null);
        }
    }

    private expandByLevel(element: Element, level: number, excludeHiddenNodes: boolean): void {
        if (level > 0 && !isNOU(element)) {
            const eNodes: Element[] = this.getVisibleNodes(excludeHiddenNodes, <NodeListOf<Element> & Element[]>element.childNodes);
            for (let i: number = 0, len: number = eNodes.length; i < len; i++) {
                const liEle: Element = eNodes[parseInt(i.toString(), 10)];
                const icon: Element = select('.' + EXPANDABLE, select('.' + TEXTWRAP, liEle));
                if (!isNOU(icon)) {
                    this.expandAction(liEle, icon, null);
                }
                this.expandByLevel(select('.' + PARENTITEM, liEle), level - 1, excludeHiddenNodes);
            }
        }
    }

    private expandAllNodes(excludeHiddenNodes: boolean): void {
        const eIcons: Element[] = this.getVisibleNodes(excludeHiddenNodes, selectAll('.' + EXPANDABLE, this.element));
        for (const icon of eIcons) {
            const liEle: Element = closest(icon, '.' + LISTITEM);
            this.expandAction(liEle, icon, null, true, null, true);
        }
    }

    private getVisibleNodes(excludeHiddenNodes: boolean, nodes: Element[]): Element[] {
        const vNodes: Element[] = Array.prototype.slice.call(nodes);
        if (excludeHiddenNodes) {
            for (let i: number = 0; i < vNodes.length; i++) {
                if (!isVisible(vNodes[parseInt(i.toString(), 10)])) {
                    vNodes.splice(i, 1);
                    i--;
                }
            }
        }
        return vNodes;
    }

    private removeNode(node: Element): void {
        const dragParentUl: Element = closest(node, '.' + PARENTITEM);
        const dragParentLi: Element = closest(dragParentUl, '.' + LISTITEM);
        if (!isNOU(this.nodeTemplateFn)) {
            this.destroyTemplate(node);
        }
        detach(node);
        this.updateElement(dragParentUl, dragParentLi);
        this.removeData(node);
    }

    private updateInstance(): void {
        this.updateList();
        this.updateSelectedNodes();
        this.updateExpandedNodes();
    }

    private updateList(): void {
        this.liList = Array.prototype.slice.call(selectAll('.' + LISTITEM, this.element));
    }

    private updateSelectedNodes(): void {
        this.setProperties({ selectedNodes: [] }, true);
        const sNodes: HTMLElement[] = selectAll('.' + ACTIVE, this.element);
        this.selectGivenNodes(sNodes);
    }

    private updateExpandedNodes(): void {
        this.setProperties({ expandedNodes: [] }, true);
        const eNodes: Element[] = selectAll('[aria-expanded="true"]', this.element);
        for (let i: number = 0, len: number = eNodes.length; i < len; i++) {
            this.addExpand(eNodes[parseInt(i.toString(), 10)]);
        }
    }

    private removeData(node: Element): void {
        if (this.dataType === 1) {
            const dm: DataManager = new DataManager(this.treeData);
            const id: string = this.getId(node);
            const data: { [key: string]: string | number } = {};
            const newId: string | number = this.isNumberTypeId ? parseFloat(id) : id;
            data[this.fields.id] = newId;
            dm.remove(this.fields.id, data);
            this.removeChildNodes(id);
        } else {
            const id: string = this.getId(node);
            this.updateChildField(this.treeData, this.fields, id, null, null, true);
        }
    }

    private removeChildNodes(parentId: string): { [key: string]: Object }[] {
        const cNodes: { [key: string]: Object }[] = this.getChildGroup(this.groupedData, parentId, false);
        const childData: { [key: string]: Object }[] = [];
        for (let i: number = 0, len: number = cNodes.length; i < len; i++) {
            const dm: DataManager = new DataManager(this.treeData);
            const id: string = getValue(this.fields.id, cNodes[parseInt(i.toString(), 10)]).toString();
            const data: { [key: string]: string | number } = {};
            const currId: string | number = this.isNumberTypeId ? parseFloat(id) : id;
            data[this.fields.id] = currId;
            const nodeData: { [key: string]: string }[] = <{ [key: string]: string }[]>dm.remove(this.fields.id, data);
            childData.push(nodeData[0]);
            this.removeChildNodes(id);
        }
        return childData;
    }

    private doGivenAction(nodes: string[] | Element[], selector: string, toExpand: boolean): void {
        for (let i: number = 0, len: number = nodes.length; i < len; i++) {
            const liEle: Element = this.getElement(nodes[parseInt(i.toString(), 10)]);
            if (isNOU(liEle)) {
                continue;
            }
            const icon: Element = select('.' + selector, select('.' + TEXTWRAP, liEle));
            if (!isNOU(icon)) {
                if (toExpand) {
                    this.expandAction(liEle, icon, null);
                } else {
                    this.collapseNode(liEle, icon, null);
                }
            }
        }
    }

    private addGivenNodes(nodes: { [key: string]: Object }[], dropLi: Element, index: number, isRemote?: boolean, dropEle?: Element): void {
        if (nodes.length === 0) {
            return;
        }
        const sNodes: { [key: string]: Object }[] = this.getSortedData(nodes);
        const level: number = dropLi ? parseFloat(dropLi.getAttribute('aria-level')) + 1 : 1;
        if (isRemote) {
            this.updateMapper(level);
        }
        const li: HTMLElement[] = ListBase.createListItemFromJson(this.createElement, sNodes, this.listBaseOption, level);
        const id: string = this.getId(dropLi);
        let dropIcon1: Element;
        if (!isNullOrUndefined(dropLi)) {
            dropIcon1 = select('div.' + ICON, dropLi);
        }
        if (this.dataType === 1 && dropIcon1 && dropIcon1.classList.contains(EXPANDABLE) && this.preventExpand && !isNOU(this.element.offsetParent) && !this.element.offsetParent.parentElement.classList.contains('e-filemanager')) { this.preventExpand = true; }
        if (this.dataType !== 1) {
            this.addChildData(this.treeData, this.fields, id, nodes, index);
            this.isFirstRender = false;
        }
        let dropUl: Element;
        if (!dropEle) {
            dropUl = dropLi ? this.expandParent(dropLi) : select('.' + PARENTITEM, this.element);
        } else {
            dropUl = dropEle;
        }
        const refNode: Node = !isNullOrUndefined(index) ? dropUl.childNodes[parseInt(index.toString(), 10)] : null;
        if (!this.isFirstRender || this.dataType === 1) {
            const args: NodeExpandEventArgs & {name: string} = this.expandArgs as NodeExpandEventArgs & {name: string};
            if (refNode || this.sortOrder === 'None') {
                for (let i: number = 0; i < li.length; i++) {
                    dropUl.insertBefore(li[parseInt(i.toString(), 10)], refNode);
                }
                if (this.dataType === 1 && !isNullOrUndefined(dropLi) && !this.preventExpand && !isNOU(this.element.offsetParent) && !this.element.offsetParent.parentElement.classList.contains('e-filemanager')) {
                    this.preventExpand = false;
                    const dropIcon: Element = select('div.' + ICON, dropLi);
                    if (dropIcon && dropIcon.classList.contains(EXPANDABLE) && (isNOU(args) || args.name !== 'nodeExpanding')) {
                        this.expandAction(dropLi, dropIcon, null);
                    }
                }
            }
            if (!refNode && ((this.sortOrder === 'Ascending') || (this.sortOrder === 'Descending'))) {
                if (dropUl.childNodes.length === 0) {
                    for (let i: number = 0; i < li.length; i++) {
                        dropUl.insertBefore(li[parseInt(i.toString(), 10)], refNode);
                    }
                    if (this.dataType === 1 && !isNullOrUndefined(dropLi) && !this.preventExpand && !isNOU(this.element.offsetParent) && !this.element.offsetParent.parentElement.classList.contains('e-filemanager')) {
                        this.preventExpand = false;
                        const dropIcon: Element = select('div.' + ICON, dropLi);
                        if (dropIcon && dropIcon.classList.contains(EXPANDABLE) && (isNOU(args) || args.name !== 'nodeExpanding')) {
                            this.expandAction(dropLi, dropIcon, null);
                        }
                    }
                }
                else {
                    const cNodes: NodeListOf<ChildNode> = dropUl.childNodes;
                    for (let i: number = 0; i < li.length; i++) {
                        for (let j: number = 0; j < cNodes.length; j++) {
                            const returnValue: boolean = (this.sortOrder === 'Ascending') ? cNodes[parseInt(j.toString(), 10)].textContent.toUpperCase() > li[parseInt(i.toString(), 10)].innerText.toUpperCase() : cNodes[parseInt(j.toString(), 10)].textContent.toUpperCase() < li[parseInt(i.toString(), 10)].innerText.toUpperCase();
                            if (returnValue) {
                                dropUl.insertBefore(li[parseInt(i.toString(), 10)], cNodes[parseInt(j.toString(), 10)]);
                                break;
                            }
                            dropUl.insertBefore(li[parseInt(i.toString(), 10)], cNodes[cNodes.length]);
                        }
                    }
                }
            }
        }
        if (this.dataType === 1) {
            this.updateField(this.treeData, this.fields, id, 'hasChildren', true);
            const refId: string = this.getId(refNode as Element);
            let pos: number = isNOU(refId) ? this.treeData.length : this.getDataPos(this.treeData, this.fields, refId);
            for (let j: number = 0; j < nodes.length; j++) {
                if (!isNOU(id)) {
                    const currId: string | number = this.isNumberTypeId ? parseFloat(id) : id;
                    setValue(this.fields.parentID, currId, nodes[parseInt(j.toString(), 10)]);
                }
                this.treeData.splice(pos, 0, nodes[parseInt(j.toString(), 10)]);
                pos++;
            }
        }
        this.finalizeNode(dropUl);
    }

    private updateMapper(level: number): void {
        const mapper: FieldsSettingsModel = (level === 1) ? this.fields : this.getChildFields(this.fields, level - 1, 1);
        this.updateListProp(mapper);
    }

    private updateListProp(mapper: FieldsSettingsModel): void {
        const prop: FieldsSettingsModel = this.getActualProperties(mapper);
        this.listBaseOption.fields = prop as FieldsMapping;
        this.listBaseOption.fields.url = Object.prototype.hasOwnProperty.call(prop, 'navigateUrl') ? prop.navigateUrl : 'navigateUrl';
    }

    private getDataPos(obj: { [key: string]: Object }[], mapper: FieldsSettingsModel, id: string): number {
        let pos: number = null;
        for (let i: number = 0, objlen: number = obj.length; i < objlen; i++) {
            const nodeId: Object = getValue(mapper.id, obj[parseInt(i.toString(), 10)]);
            if (obj[parseInt(i.toString(), 10)] && nodeId && nodeId.toString() === id) {
                return i;
            } else if (typeof mapper.child === 'string' && !isNOU(getValue(mapper.child, obj[parseInt(i.toString(), 10)]))) {
                const data: { [key: string]: Object }[] = <{ [key: string]: Object }[]>getValue(
                    mapper.child,
                    obj[parseInt(i.toString(), 10)]
                );
                pos = this.getDataPos(data, this.getChildMapper(mapper), id);
                if (pos !== null) {
                    break;
                }
            } else if (this.fields.dataSource instanceof DataManager && !isNOU(getValue('child', obj[parseInt(i.toString(), 10)]))) {
                const items: { [key: string]: Object }[] = <{ [key: string]: Object }[]>getValue('child', obj[parseInt(i.toString(), 10)]);
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
                obj.splice(index, 0, data[parseInt(k.toString(), 10)]);
                index++;
            }
            return updated;
        }
        for (let i: number = 0, objlen: number = obj.length; i < objlen; i++) {
            const nodeId: Object = getValue(mapper.id, obj[parseInt(i.toString(), 10)]);
            if (obj[parseInt(i.toString(), 10)] && nodeId && nodeId.toString() === id) {
                if ((typeof mapper.child === 'string' && (Object.prototype.hasOwnProperty.call(obj[parseInt(i.toString(), 10)], mapper.child) && obj[parseInt(i.toString(), 10)][mapper.child] !== null)) ||
                    ((this.fields.dataSource instanceof DataManager) && Object.prototype.hasOwnProperty.call(obj[parseInt(i.toString(), 10)], 'child'))) {
                    const key: string = (typeof mapper.child === 'string') ? mapper.child : 'child';
                    let childData: { [key: string]: Object }[] = <{ [key: string]: Object }[]>getValue(
                        key,
                        obj[parseInt(i.toString(), 10)]
                    );
                    if (isNOU(childData)) {
                        childData = [];
                    }
                    index = isNOU(index) ? childData.length : index;
                    for (let k: number = 0, len: number = data.length; k < len; k++) {
                        childData.splice(index, 0, data[parseInt(k.toString(), 10)]);
                        index++;
                    }
                } else {
                    const key: string = (typeof mapper.child === 'string') ? mapper.child : 'child';
                    obj[parseInt(i.toString(), 10)][`${key}`] = data;
                }
                return true;
            } else if (typeof mapper.child === 'string' && !isNOU(getValue(mapper.child, obj[parseInt(i.toString(), 10)]))) {
                const childObj: { [key: string]: Object }[] = <{ [key: string]: Object }[]>getValue(
                    mapper.child,
                    obj[parseInt(i.toString(), 10)]
                );
                updated = this.addChildData(childObj, this.getChildMapper(mapper), id, data, index);
                if (updated !== undefined) {
                    break;
                }
            } else if ((this.fields.dataSource instanceof DataManager) && !isNOU(getValue('child', obj[parseInt(i.toString(), 10)]))) {
                const childData: { [key: string]: Object }[] = <{ [key: string]: Object }[]>getValue('child', obj[parseInt(i.toString(), 10)]);
                updated = this.addChildData(childData, this.getChildMapper(mapper), id, data, index);
                if (updated !== undefined) {
                    break;
                }
            }
        }
        return updated;
    }

    private doDisableAction(nodes: string[] | Element[]): void {
        const validNodes: string[] = this.nodeType(nodes);
        const validID: { [key: string]: Object }[] = this.checkValidId(validNodes);
        this.validArr = [];
        for (let i: number = 0, len: number = validID.length; i < len; i++) {
            const id: string = validID[parseInt(i.toString(), 10)][this.fields.id].toString();
            if (id && this.disableNode.indexOf(id) === -1) {
                this.disableNode.push(id);
            }
            const liEle: Element = this.getElement(id);
            if (liEle) {
                liEle.setAttribute('aria-disabled', 'true');
                addClass([liEle], DISABLE);
            }
        }
    }

    private doEnableAction(nodes: string[] | Element[]): void {
        const strNodes: string[] = this.nodeType(nodes);
        for (let i: number = 0, len: number = strNodes.length; i < len; i++) {
            const liEle: Element = this.getElement(strNodes[parseInt(i.toString(), 10)]);
            const id: string = strNodes[parseInt(i.toString(), 10)];
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
        const validID: string[] = [];
        for (let i: number = 0, len: number = nodes.length; i < len; i++) {
            let id: string;
            if (typeof nodes[parseInt(i.toString(), 10)] == 'string') {
                id = (nodes[parseInt(i.toString(), 10)]) ? nodes[parseInt(i.toString(), 10)].toString() : null;
            } else if (typeof nodes[parseInt(i.toString(), 10)] === 'object') {
                id = nodes[parseInt(i.toString(), 10)] ? (nodes[parseInt(i.toString(), 10)] as Element).getAttribute('data-uid').toString() : null;
            }
            if (validID.indexOf(id) === -1) {
                validID.push(id);
            }
        }
        return validID;
    }

    private checkValidId(node: string[]): { [key: string]: Object }[] {
        if (this.dataType === 1) {
            this.validArr = this.treeData.filter((data: { [key: string]: Object }) => {
                return node.indexOf(data[this.fields.id] ? data[this.fields.id].toString() : null) !== -1;
            });
        } else if (this.dataType === 2) {
            for (let k: number = 0; k < this.treeData.length; k++) {
                const id: string = this.treeData[parseInt(k.toString(), 10)][this.fields.id]
                    ? this.treeData[parseInt(k.toString(), 10)][this.fields.id].toString()
                    : null;

                if (node.indexOf(id) !== -1) {
                    this.validArr.push(this.treeData[parseInt(k.toString(), 10)]);
                }
                const childItems: { [key: string]: Object }[] = getValue(
                    this.fields.child.toString(),
                    this.treeData[parseInt(k.toString(), 10)]
                );
                if (childItems) {
                    this.filterNestedChild(childItems, node);
                }
            }
        }
        return this.validArr;
    }

    private filterNestedChild(treeData: { [key: string]: Object }[], nodes: string[]): void {
        for (let k: number = 0; k < treeData.length; k++) {
            const id: string = treeData[parseInt(k.toString(), 10)][this.fields.id]
                ? treeData[parseInt(k.toString(), 10)][this.fields.id].toString()
                : null;

            if (nodes.indexOf(id) !== -1) {
                this.validArr.push(treeData[parseInt(k.toString(), 10)]);
            }
            const childItems: { [key: string]: Object }[] = getValue(this.fields.child.toString(), treeData[parseInt(k.toString(), 10)]);
            if (childItems) {
                this.filterNestedChild(childItems, nodes);
            }
        }
    }

    private setTouchClass(): void {
        const ele: Element = closest(this.element, '.' + BIGGER);
        this.touchClass = isNOU(ele) ? '' : SMALL;
    }

    private updatePersistProp(): void {
        this.removeField(this.treeData, this.fields, ['selected', 'expanded']);
        const sleNodes: string[] = this.selectedNodes;
        for (let l: number = 0, slelen: number = sleNodes.length; l < slelen; l++) {
            this.updateField(this.treeData, this.fields, sleNodes[parseInt(l.toString(), 10)], 'selected', true);
        }
        const enodes: string[] = this.expandedNodes;
        for (let k: number = 0, nodelen: number = enodes.length; k < nodelen; k++) {
            this.updateField(this.treeData, this.fields, enodes[parseInt(k.toString(), 10)], 'expanded', true);
        }
        if (this.showCheckBox) {
            this.removeField(this.treeData, this.fields, ['isChecked']);
            const cnodes: string[] = this.checkedNodes;
            for (let m: number = 0, nodelen: number = cnodes.length; m < nodelen; m++) {
                this.updateField(this.treeData, this.fields, cnodes[parseInt(m.toString(), 10)], 'isChecked', true);
            }
        }
    }

    private removeField(obj: { [key: string]: Object }[], mapper: FieldsSettingsModel, names: string[]): void {
        if (isNOU(obj) || isNOU(mapper)) {
            return;
        }
        for (let i: number = 0, objlen: number = obj.length; i < objlen; i++) {
            for (let j: number = 0; j < names.length; j++) {
                const field: string = this.getMapperProp(mapper, names[parseInt(j.toString(), 10)]);
                if (!isNOU(obj[parseInt(i.toString(), 10)][`${field}`])) {
                    delete obj[parseInt(i.toString(), 10)][`${field}`];
                }
            }
            if (typeof mapper.child === 'string' && !isNOU(getValue(mapper.child, obj[parseInt(i.toString(), 10)]))) {
                this.removeField(
                    <{ [key: string]: Object }[]>getValue(mapper.child, obj[parseInt(i.toString(), 10)]),
                    this.getChildMapper(mapper),
                    names
                );

            } else if (this.fields.dataSource instanceof DataManager && !isNOU(getValue('child', obj[parseInt(i.toString(), 10)]))) {
                this.removeField(<{ [key: string]: Object }[]>getValue('child', obj[parseInt(i.toString(), 10)]), this.getChildMapper(mapper), names);
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
        if (isNOU(id)) {
            return;
        } else if (this.dataType === 1) {
            const newId: string | number = this.isNumberTypeId ? parseFloat(id) : id;
            const resultData: Object[] = new DataManager(this.treeData).executeLocal(new Query().where(mapper.id, 'equal', newId, false));
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
            const nodeId: Object = getValue(mapper.id, obj[parseInt(i.toString(), 10)]);
            if (obj[parseInt(i.toString(), 10)] && !isNOU(nodeId) && nodeId.toString() === id) {
                if (remove) {
                    removedData = obj.splice(i, 1);
                } else {
                    setValue(this.getMapperProp(mapper, key), value, obj[parseInt(i.toString(), 10)]);
                    removedData = [];
                }
                return removedData;
            } else if (typeof mapper.child === 'string' && !isNOU(getValue(mapper.child, obj[parseInt(i.toString(), 10)]))) {
                const childData: { [key: string]: Object }[] = <{ [key: string]: Object }[]>getValue(
                    mapper.child,
                    obj[parseInt(i.toString(), 10)]
                );
                removedData = this.updateChildField(childData, this.getChildMapper(mapper), id, key, value, remove);
                if (removedData !== undefined) {
                    break;
                }
            } else if (this.fields.dataSource instanceof DataManager && !isNOU(getValue('child', obj[parseInt(i.toString(), 10)]))) {
                const childItems: { [key: string]: Object }[] = <{ [key: string]: Object }[]>getValue('child', obj[parseInt(i.toString(), 10)]);
                removedData = this.updateChildField(childItems, this.getChildMapper(mapper), id, key, value, remove);
                if (removedData !== undefined) {
                    break;
                }
            }
        }
        return removedData;
    }

    private triggerEvent(action: string, node?: { [key: string]: Object }[]): void {
        this.renderReactTemplates();
        if (action === 'addNodes') {
            const nodeData: { [key: string]: Object }[] = [];
            for (let i: number = 0; i < node.length; i++) {
                nodeData.push(
                    this.getNode(
                        this.getElement(
                            isNOU(node[parseInt(i.toString(), 10)][this.fields.id])
                                ? getValue(this.fields.id, node[parseInt(i.toString(), 10)]).toString()
                                : null
                        )
                    )
                );

            }
            node = nodeData;
        }
        const eventArgs: DataSourceChangedEventArgs = { data: this.treeData, action: action, nodeData: node };
        this.trigger('dataSourceChanged', eventArgs);
    }


    private wireInputEvents(inpEle: Element): void {
        EventHandler.add(inpEle, 'blur', this.inputFocusOut, this);
    }

    private wireEditingEvents(toBind: boolean): void {
        if (toBind && !this.disabled) {
            this.touchEditObj = new Touch(this.element, {
                tap: (e: TapEventArgs) => {
                    if (this.isDoubleTapped(e) && e.tapCount === 2) {
                        e.originalEvent.preventDefault();
                        this.editingHandler(e.originalEvent);
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
            this.touchClickObj = new Touch(this.element, {
                tap: (e: TapEventArgs) => {
                    this.clickHandler(e);
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
            this.touchExpandObj = new Touch(this.element, {
                tap: (e: TapEventArgs) => {
                    if ((this.expandOnType === 'Click' || (this.expandOnType === 'DblClick' && this.isDoubleTapped(e) && e.tapCount === 2))
                        && e.originalEvent.which !== 3) {
                        this.expandHandler(e);
                    }
                }
            });
        } else {
            if (this.touchExpandObj) {
                this.touchExpandObj.destroy();
            }
        }
    }

    private mouseDownHandler(e: MouseEvent): void {
        this.mouseDownStatus = true;
        if (e.shiftKey || e.ctrlKey) {
            e.preventDefault();
        }
        if (e.ctrlKey && this.allowMultiSelection) {
            EventHandler.add(this.element, 'contextmenu', this.preventContextMenu, this);
        }
    }

    private preventContextMenu(e: MouseEvent): void {
        e.preventDefault();
    }

    private wireEvents(): void {
        EventHandler.add(this.element, 'mousedown', this.mouseDownHandler, this);
        this.wireClickEvent(true);
        if (this.expandOnType !== 'None') {
            this.wireExpandOnEvent(true);
        }
        EventHandler.add(this.element, 'mouseover', this.onMouseOver, this);
        EventHandler.add(this.element, 'mouseout', this.onMouseLeave, this);
        this.keyboardModule = new KeyboardEvents(
            this.element,
            {
                keyAction: this.keyActionHandler.bind(this),
                keyConfigs: this.keyConfigs,
                eventName: 'keydown'
            }
        );
    }

    private unWireEvents(): void {
        EventHandler.remove(this.element, 'mousedown', this.mouseDownHandler);
        this.wireClickEvent(false);
        this.wireExpandOnEvent(false);
        EventHandler.remove(this.element, 'mouseover', this.onMouseOver);
        EventHandler.remove(this.element, 'mouseout', this.onMouseLeave);
        if (!this.disabled) {
            this.keyboardModule.destroy();
        }
    }

    private parents(element: Element | Node, selector: string): Element[] {
        const matched: Element[] = [];
        let el: Element = <Element>element.parentNode;
        while (!isNOU(el)) {
            if (matches(el, selector)) {
                matched.push(el);
            }
            el = <Element>el.parentNode;
        }
        return matched;
    }

    private isDoubleTapped(e: TapEventArgs): boolean {
        const target: Element = <Element>e.originalEvent.target;
        let secondTap: Element;
        if (target && e.tapCount) {
            if (e.tapCount === 1) {
                this.firstTap = closest(target, '.' + LISTITEM);
            } else if (e.tapCount === 2) {
                secondTap = closest(target, '.' + LISTITEM);
            }
        }
        return (this.firstTap === secondTap);
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
        if (nodes.length > 1 && typeof this.nodeChecked === 'function' && this.nodeChecked.length > 0 ) {
            this.isFilter = true;
        }
        this.uncheckAll(this.checkedNodes);
        this.setIndeterminate(nodes);
        if (nodes.length > 0) {
            this.checkAll(nodes);
        }
    }
    /**
     * Checks whether the checkedNodes entered are valid and sets the valid checkedNodes while changing via setmodel
     *
     * @param {string} node - The unique identifier of the node.
     * @param {string[]} [nodes=[]] - The list of node IDs to check.
     * @returns {void}
     * @private
     */
    private setValidCheckedNode(node: string, nodes: string[] = []): void {
        if (this.dataType === 1) {
            const mapper: FieldsSettingsModel = this.fields;
            const resultData: { [key: string]: Object }[] = <{ [key: string]: Object }[]>new DataManager(this.treeData).executeLocal(
                new Query().where(mapper.id, 'equal', node, true));
            if (resultData[0]) {
                this.setChildCheckState(resultData, node, resultData[0], nodes);
                if (this.autoCheck) {
                    const parent: string = resultData[0][this.fields.parentID] ? resultData[0][this.fields.parentID].toString() : null;
                    const childNodes: { [key: string]: Object }[] = this.getChildNodes(this.treeData, parent);
                    let count: number = 0;
                    for (let len: number = 0; len < childNodes.length; len++) {
                        const childId: string = childNodes[parseInt(len.toString(), 10)][this.fields.id].toString();
                        if (this.checkedNodes.indexOf(childId) !== -1) {
                            count++;
                        }
                    }
                    if (count === childNodes.length && this.checkedNodes.indexOf(parent) === -1 && parent) {
                        this.checkDisabledState(parent);
                    }
                }
            }
        } else if (this.dataType === 2) {
            for (let a: number = 0; a < this.treeData.length; a++) {
                const index: string = this.treeData[parseInt(a.toString(), 10)][this.fields.id] ? this.treeData[parseInt(a.toString(), 10)][this.fields.id].toString() : '';
                if (index === node && this.checkedNodes.indexOf(node) === -1) {
                    this.checkDisabledState(node);
                    break;
                }
                const childItems: { [key: string]: Object }[] = getValue(
                    this.fields.child.toString(),
                    this.treeData[parseInt(a.toString(), 10)]
                );
                if (childItems) {
                    this.setChildCheckState(childItems, node, this.treeData[parseInt(a.toString(), 10)], nodes);
                }
            }
        }
    }
    /**
     * Checks whether the checkedNodes entered are valid and sets the valid checkedNodes while changing via setmodel(for hierarchical DS)
     *
     * @param {Object[]} childItems - The child items to check.
     * @param {string} node - The node to set the check state for.
     * @param {Object} [treeData] - The optional tree data.
     * @param {string[]} [nodes=[]] - The list of node IDs to check.
     * @returns {void}
     * @private
     */
    private setChildCheckState(childItems: { [key: string]: Object; }[], node: string, treeData?: { [key: string]: Object; },
                               nodes: string[] = []): void {
        let checkedParent: string;
        let count: number = 0;
        if (this.dataType === 1) {
            if (treeData) {
                checkedParent = treeData[this.fields.id] ? treeData[this.fields.id].toString() : null;
            }
            for (let index: number = 0; index < childItems.length; index++) {
                const checkNode: string = childItems[parseInt(index.toString(), 10)][this.fields.id]
                    ? childItems[parseInt(index.toString(), 10)][this.fields.id].toString()
                    : null;
                if (treeData && checkedParent && this.autoCheck) {
                    if (this.checkedNodes.indexOf(checkedParent) !== -1 && this.checkedNodes.indexOf(checkNode) === -1) {
                        this.checkDisabledState(checkNode, childItems[index as number]);
                    }
                }
                if (checkNode === node && this.checkedNodes.indexOf(node) === -1) {
                    this.checkDisabledState(node);
                }
                const subChildItems: { [key: string]: Object }[] = this.getChildNodes(this.treeData, checkNode);
                const isParentNodeCheck: boolean = (nodes.length === 1 && nodes[0] === checkNode);

                if (subChildItems.length === node.length || isParentNodeCheck) {
                    this.setChildCheckState(subChildItems, node, treeData);
                }
            }
        } else {
            if (treeData) {
                checkedParent = treeData[this.fields.id] ? treeData[this.fields.id].toString() : '';
            }
            for (let index: number = 0; index < childItems.length; index++) {
                const checkedChild: string = childItems[parseInt(index.toString(), 10)][this.fields.id] ? childItems[parseInt(index.toString(), 10)][this.fields.id].toString() : '';
                const isParentNodeCheck: boolean = ([node].length === 1 && nodes.length === 0);
                if (treeData && checkedParent && this.autoCheck) {
                    if (this.checkedNodes.indexOf(checkedParent) !== -1 && this.checkedNodes.indexOf(checkedChild) === -1
                        && (checkedChild === node || isParentNodeCheck)) {
                        this.checkDisabledState(checkedChild, childItems[index as number]);
                    }
                }
                if (checkedChild === node && this.checkedNodes.indexOf(node) === -1) {
                    this.checkDisabledState(node);
                }
                const subChildItems: { [key: string]: Object }[] = getValue(
                    this.fields.child.toString(),
                    childItems[parseInt(index.toString(), 10)]
                );
                if (subChildItems) {
                    this.setChildCheckState(subChildItems, node, childItems[parseInt(index.toString(), 10)]);
                }
                if (this.checkedNodes.indexOf(checkedChild) !== -1 && this.autoCheck) {
                    count++;
                }
                if (count === childItems.length && this.checkedNodes.indexOf(checkedParent) === -1 && this.autoCheck) {
                    this.checkDisabledState(checkedParent, treeData);
                }
            }
        }
    }
    private setIndeterminate(nodes: string[]): void {
        for (let i: number = 0; i < nodes.length; i++) {
            this.setValidCheckedNode(nodes[parseInt(i.toString(), 10)], nodes);
        }
    }

    private updatePosition(
        id: string,
        newData: { [key: string]: Object },
        isRefreshChild?: boolean,
        childValue?: { [key: string]: Object }[]
    ): void {
        if (this.dataType === 1) {
            let pos: number = this.getDataPos(this.treeData, this.fields, id);
            this.treeData.splice(pos, 1, newData);
            if (isRefreshChild) {
                this.removeChildNodes(id);
                for (let j: number = 0; j < childValue.length; j++) {
                    this.treeData.splice(pos, 0, childValue[parseInt(j.toString(), 10)]);
                    pos++;
                }
            }
            this.groupedData = this.getGroupedData(this.treeData, this.fields.parentID);
        } else {
            this.updateChildPosition(this.treeData, this.fields, id, [newData], undefined);
        }
    }

    private updateChildPosition(
        treeData: { [key: string]: Object }[], mapper: FieldsSettingsModel, currID: string, newData: { [key: string]: Object }[],
        index: number): boolean {
        let found: boolean;
        for (let i: number = 0, objlen: number = treeData.length; i < objlen; i++) {
            const nodeId: Object = getValue(mapper.id, treeData[parseInt(i.toString(), 10)]);
            if (treeData[parseInt(i.toString(), 10)] && nodeId && nodeId.toString() === currID) {
                treeData[parseInt(i.toString(), 10)] = newData[0];
                return true;
            } else if (typeof mapper.child === 'string' && !isNOU(getValue(mapper.child, treeData[parseInt(i.toString(), 10)]))) {
                const childObj: { [key: string]: Object }[] = <{ [key: string]: Object }[]>getValue(
                    mapper.child,
                    treeData[parseInt(i.toString(), 10)]
                );
                found = this.updateChildPosition(childObj, this.getChildMapper(mapper), currID, newData, index);
                if (found !== undefined) {
                    break;
                }
            } else if (this.fields.dataSource instanceof DataManager && !isNOU(getValue('child', treeData[parseInt(i.toString(), 10)]))) {
                const childData: { [key: string]: Object }[] = <{ [key: string]: Object }[]>getValue('child', treeData[parseInt(i.toString(), 10)]);
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

    private crudOperation(
        operation: string,
        nodes?: string[] | Element[],
        target?: string | Element,
        newText?: string,
        newNode?: { [key: string]: Object }[],
        index?: number,
        prevent?: boolean
    ): void {
        const data: DataManager = this.fields.dataSource as DataManager;
        const matchedArr: { [key: string]: Object }[] = [];
        const query: Query = this.getQuery(this.fields);
        const key: string = this.fields.id;
        let crud: Promise<Object>;
        const changes: {
            addedRecords: { [key: string]: Object }[],
            deletedRecords: { [key: string]: Object }[],
            changedRecords: { [key: string]: Object }[]
        } = {
            addedRecords: [],
            deletedRecords: [],
            changedRecords: []
        };
        let nodesID: string[] = [];
        if (nodes) {
            nodesID = this.nodeType(nodes);
        } else if (target) {
            if (typeof target == 'string') {
                nodesID[0] = target.toString();
            } else if (typeof target === 'object') {
                nodesID[0] = target.getAttribute('data-uid').toString();
            }
        }
        for (let i: number = 0, len: number = nodesID.length; i < len; i++) {
            const liEle: Element = this.getElement(nodesID[parseInt(i.toString(), 10)]);
            if (isNullOrUndefined(liEle)) {
                continue;
            }
            const removedData: { [key: string]: Object } = this.getNodeObject(nodesID[parseInt(i.toString(), 10)]);
            matchedArr.push(removedData);
        }
        switch (operation) {
        case 'delete':
            if (nodes.length === 1) {
                crud = data.remove(key, matchedArr[0], query.fromTable, query) as Promise<Object>;
            } else {
                changes.deletedRecords = matchedArr;
                crud = data.saveChanges(changes, key, query.fromTable, query) as Promise<Object>;
            }
            crud.then(() => this.deleteSuccess(nodesID))
                .catch((e: { result: Object[] }) => this.dmFailure(e as { result: Object[] }));
            break;
        case 'update':
            matchedArr[0][this.fields.text] = newText;
            crud = data.update(key, matchedArr[0], query.fromTable, query) as Promise<Object>;
            crud.then(() => this.editSucess(target, newText, prevent))
                .catch((e: { result: Object[] }) => this.dmFailure(e as { result: Object[] }, target, prevent));
            break;
        case 'insert':
            if (newNode.length === 1) {
                crud = data.insert(newNode[0], query.fromTable, query) as Promise<Object>;
            } else {
                const arr: { [key: string]: Object }[] = [];
                for (let i: number = 0, len: number = newNode.length; i < len; i++) {
                    arr.push(newNode[parseInt(i.toString(), 10)]);
                }
                changes.addedRecords = arr;
                crud = data.saveChanges(changes, key, query.fromTable, query) as Promise<Object>;
            }
            crud.then(() => {
                const dropLi: Element = this.getElement(target);
                this.addSuccess(newNode, dropLi, index);
                this.preventExpand = false;
            }).catch((e: { result: Object[] }) => this.dmFailure(e as { result: Object[] }));
            break;
        }
    }

    private deleteSuccess(nodes: string[] | Element[]): void {
        const nodeData: { [key: string]: Object }[] = [];
        for (let i: number = 0, len: number = nodes.length; i < len; i++) {
            const liEle: Element = this.getElement(nodes[parseInt(i.toString(), 10)]);
            nodeData.push(this.getNode(liEle));
            if (isNOU(liEle)) { continue; }
            this.removeNode(liEle);
        }
        this.updateInstance();
        if (this.dataType === 1) {
            this.groupedData = this.getGroupedData(this.treeData, this.fields.parentID);
        }
        this.triggerEvent('removeNode', nodeData);
    }

    private editSucess(target: string | Element, newText: string, prevent: boolean): void {
        const liEle: Element = this.getElement(target);
        const txtEle: HTMLElement = select('.' + LISTTEXT, liEle) as HTMLElement;
        this.appendNewText(liEle, txtEle, newText, prevent);
    }

    private addSuccess(nodes: { [key: string]: Object }[], dropLi: Element, index?: number): void {
        let dropUl: Element;
        const icon: Element = dropLi ? dropLi.querySelector('.' + ICON) : null;
        if (dropLi && icon && icon.classList.contains(EXPANDABLE) &&
            dropLi.querySelector('.' + PARENTITEM) === null) {
            this.renderChildNodes(dropLi, null, () => {
                dropUl = dropLi.querySelector('.' + PARENTITEM);
                this.addGivenNodes(nodes, dropLi, index, true, dropUl);
                this.triggerEvent('addNodes', nodes);
            });
        } else {
            this.addGivenNodes(nodes, dropLi, index, true);
            this.triggerEvent('addNodes', nodes);
        }
    }

    private dmFailure(e: { result: Object[] }, target?: string | Element, prevent?: boolean): void {
        if (target) {
            this.updatePreviousText(target, prevent);
        }
        this.trigger('actionFailure', { error: e });
    }

    private updatePreviousText(target?: string | Element, prevent?: boolean): void {
        const liEle: Element = this.getElement(target);
        const txtEle: HTMLElement = select('.' + LISTTEXT, liEle) as HTMLElement;
        this.updateText(liEle, txtEle, this.oldText, prevent);
    }

    private getHierarchicalParentId(node: string | Element, data: { [key: string]: Object }[], parentsID?: string[]): string[] {
        let index: number = data.findIndex((data: { [key: string]: Object }) =>
            data[this.fields.id] && data[this.fields.id].toString() === node);
        if (index === -1) {
            for (let i: number = 0; i < data.length; i++) {
                const childItems: { [key: string]: Object }[] = getValue(this.fields.child.toString(), data[parseInt(i.toString(), 10)]);
                if (!isNOU(childItems)) {
                    index = childItems.findIndex((data: { [key: string]: Object }) =>
                        data[this.fields.id] && data[this.fields.id].toString() === node);
                    if (index === -1) {
                        this.getHierarchicalParentId(node, childItems, parentsID);
                    }
                    else {
                        parentsID.push(data[parseInt(i.toString(), 10)][this.fields.id].toString());
                        this.getHierarchicalParentId(data[parseInt(i.toString(), 10)][this.fields.id].toString(), this.treeData, parentsID);
                        break;
                    }
                }
            }
        }
        return parentsID;
    }

    /**
     * Called internally if any of the property value changed.
     *
     * @param {TreeViewModel} newProp - The new property value.
     * @param {TreeViewModel} oldProp - The old property value.
     * @returns {void}
     * @private
     */
    public onPropertyChanged(newProp: TreeViewModel, oldProp: TreeViewModel): void {
        for (const prop of Object.keys(newProp)) {
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
                    const sNode: Element = this.getElement(this.selectedNodes[0]);
                    this.isLoaded = false;
                    this.removeSelectAll();
                    this.selectNode(sNode, null);
                    this.isLoaded = true;
                }
                this.setMultiSelect(this.allowMultiSelection);
                this.addMultiSelect(this.allowMultiSelection);
                break;
            case 'allowTextWrap':
                this.setTextWrap();
                this.updateWrap();
                break;
            case 'checkedNodes':
                if (JSON.stringify(oldProp.checkedNodes) !== JSON.stringify(newProp.checkedNodes)) {
                    if (this.showCheckBox) {
                        this.checkedNodes = oldProp.checkedNodes;
                        this.setCheckedNodes(newProp.checkedNodes);
                    }
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
                this.setProperties({ expandedNodes: [] }, true);
                this.collapseAll();
                this.isInitalExpand = true;
                this.setProperties({ expandedNodes: isNOU(newProp.expandedNodes) ? [] : newProp.expandedNodes }, true);
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
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if (!(this as any).isReact || (this as any).isReact && !(this.fields.dataSource instanceof DataManager)) {
                    if (!this.element.classList.contains('e-filtering')) {
                        this.DDTTreeData = JSON.parse(JSON.stringify(this.fields.dataSource));
                    }
                    this.reRenderNodes();
                }
                this.initialRender = false;
                this.isAnimate = true;
                this.isFieldChange = false;
                break;
            case 'fullRowSelect':
                this.setFullRow(this.fullRowSelect);
                this.addFullRow(this.fullRowSelect);
                if (this.allowTextWrap) {
                    this.setTextWrap();
                    this.updateWrap();
                }
                break;
            case 'loadOnDemand':
                if (this.loadOnDemand === false && !this.onLoaded) {
                    const nodes: NodeListOf<Element> = this.element.querySelectorAll('li');
                    let i: number = 0;
                    while (i < nodes.length) {
                        if (nodes[parseInt(i.toString(), 10)].getAttribute('aria-expanded') !== 'true') {
                            this.renderChildNodes(nodes[parseInt(i.toString(), 10)], true, null, true);
                        }
                        i++;
                    }
                    this.onLoaded = true;
                }
                break;
            case 'nodeTemplate':
                this.hasTemplate = false;
                this.nodeTemplateFn = this.templateComplier(this.nodeTemplate);
                this.reRenderNodes();
                break;
            case 'selectedNodes':
                this.removeSelectAll();
                this.setProperties({ selectedNodes: newProp.selectedNodes }, true);
                this.doSelectionAction();
                break;
            case 'showCheckBox':
            case 'checkDisabledChildren':
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
     *
     * @returns {void}
     */
    public destroy(): void {
        this.clearTemplate();
        this.element.removeAttribute('aria-activedescendant');
        this.unWireEvents();
        this.wireEditingEvents(false);
        if (!this.disabled) {
            this.rippleFn();
            this.rippleIconFn();
        }
        this.setCssClass(this.cssClass, null);
        this.setDragAndDrop(false);
        this.setFullRow(false);
        if (this.ulElement && this.ulElement.parentElement) {
            this.ulElement.parentElement.removeChild(this.ulElement);
        }
        this.ulElement = null;
        this.liList = null;
        this.startNode = null;
        this.firstTap = null;
        this.expandArgs = null;
        this.dragLi = null;
        this.dragTarget = null;
        this.dragParent = null;
        this.dragObj = null;
        this.dropObj = null;
        this.inputObj = null;
        this.touchEditObj = null;
        this.touchExpandObj = null;
        this.touchClickObj = null;
        super.destroy();
    }

    /**
     * Adds the collection of TreeView nodes based on target and index position. If target node is not specified,
     * then the nodes are added as children of the given parentID or in the root level of TreeView.
     *
     * @param  { object } nodes - Specifies the array of JSON data that has to be added.
     * @param  { string | Element } target - Specifies ID of TreeView node/TreeView node as target element.
     * @param  { number } index - Specifies the index to place the newly added nodes in the target element.
     * @param { boolean } preventTargetExpand - If set to true, the target parent node will be prevented from auto expanding.
     * @returns {void}
     */
    public addNodes(nodes: { [key: string]: Object }[], target?: string | Element, index?: number,
                    preventTargetExpand?: boolean): void {
        if (isNOU(nodes)) {
            return;
        }
        nodes = JSON.parse(JSON.stringify(nodes));
        let dropLi: Element = this.getElement(target);
        this.preventExpand = preventTargetExpand;
        if (this.fields.dataSource instanceof DataManager) {
            if (!this.isOffline) {
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
                    const pid: Object = getValue(this.fields.parentID, nodes[parseInt(i.toString(), 10)]);
                    dropLi = pid ? this.getElement(pid.toString()) : <Element>pid;
                    if (!isNullOrUndefined(pid) && isNullOrUndefined(dropLi)) {
                        this.isHiddenItem = true;
                        this.preventExpand = false;
                        this.ensureVisible(pid as string);
                        this.preventExpand = preventTargetExpand;
                        this.isHiddenItem = false;
                        dropLi = this.getElement(pid.toString());
                    }
                    this.addGivenNodes([nodes[parseInt(i.toString(), 10)]], dropLi, index);
                }
            }
            this.groupedData = this.getGroupedData(this.treeData, this.fields.parentID);
        }
        const fNode: Element = select('.' + LISTITEM + '[tabindex="0"]', this.element);
        if (isNOU(fNode)) {
            this.setNodeFocusable();
        }
        this.updateCheckedStateFromDS();
        if (this.showCheckBox && dropLi) {
            this.ensureParentCheckState(dropLi);
        }
        if ((this.fields.dataSource instanceof DataManager === false)) {
            this.preventExpand = false;
            this.triggerEvent('addNodes', nodes);
        }
    }

    /**
     * Editing can also be enabled by using the `beginEdit` property, instead of clicking on the
     * TreeView node. On passing the node ID or element through this property, the edit textBox
     * will be created for the particular node thus allowing us to edit it.
     *
     * @param  {string | Element} node - Specifies ID of TreeView node/TreeView node.
     * @returns {void}
     */
    public beginEdit(node: string | Element): void {
        const ele: Element = this.getElement(node);
        if (isNOU(ele) || this.disabled) {
            return;
        }
        this.createTextbox(ele);
    }
    /**
     * Checks all the unchecked nodes. You can also check specific nodes by passing array of unchecked nodes
     * as argument to this method.
     *
     * @param  {string[] | Element[]} nodes - Specifies the array of TreeView nodes ID/array of TreeView node.
     * @returns {void}
     */
    public checkAll(nodes?: string[] | Element[]): void {
        if (this.showCheckBox) {
            this.doCheckBoxAction(nodes, true);
        }
    }

    /**
     * Collapses all the expanded TreeView nodes. You can collapse specific nodes by passing array of nodes as argument to this method.
     * You can also collapse all the nodes excluding the hidden nodes by setting **excludeHiddenNodes** to true. If you want to collapse
     * a specific level of nodes, set **level** as argument to collapseAll method.
     *
     * @param  {string[] | Element[]} nodes - Specifies the array of TreeView nodes ID/ array of TreeView node.
     * @param  {number} level - TreeView nodes will collapse up to the given level.
     * @param  {boolean} excludeHiddenNodes - Whether or not to exclude hidden nodes of TreeView when collapsing all nodes.
     * @returns {void}
     */
    public collapseAll(nodes?: string[] | Element[], level?: number, excludeHiddenNodes?: boolean): void {
        if (!isNOU(nodes)) {
            this.doGivenAction(nodes, COLLAPSIBLE, false);
        } else {
            if (level > 0) {
                this.collapseByLevel(select('.' + PARENTITEM, this.element), level, excludeHiddenNodes);
            } else {
                this.collapseAllNodes(excludeHiddenNodes);
            }
        }
    }

    /**
     * Disables the collection of nodes by passing the ID of nodes or node elements in the array.
     *
     * @param  {string[] | Element[]} nodes - Specifies the array of TreeView nodes ID/array of TreeView nodes.
     * @returns {void}
     */
    public disableNodes(nodes: string[] | Element[]): void {
        if (!isNOU(nodes)) {
            this.doDisableAction(nodes);
        }
    }

    /**
     * Enables the collection of disabled nodes by passing the ID of nodes or node elements in the array.
     *
     * @param  {string[] | Element[]} nodes - Specifies the array of TreeView nodes ID/array of TreeView nodes.
     * @returns {void}
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
     *
     * @param  {string | Element} node - Specifies ID of TreeView node/TreeView nodes.
     * @returns {void}
     */
    public ensureVisible(node: string | Element): void {
        let parentsId: string[] = [];
        if (this.dataType === 1) {
            let nodeData: { [key: string]: Object }[] = this.getTreeData(node);
            while (nodeData.length !== 0 && !isNOU(nodeData[0][this.fields.parentID])) {
                parentsId.push(nodeData[0][this.fields.parentID].toString());
                nodeData = this.getTreeData(nodeData[0][this.fields.parentID].toString());
            }
        }
        else if (this.dataType === 2) {
            parentsId = this.getHierarchicalParentId(node, this.treeData, parentsId);
        }
        this.expandAll(parentsId.reverse(), null, null, this.isHiddenItem);
        const liEle: Element = this.getElement(node);
        if (!isNOU(liEle)) {
            if (typeof node == 'object') {
                const parents: Element[] = this.parents(liEle, '.' + LISTITEM);
                this.expandAll(parents);
            }
            setTimeout(() => { liEle.scrollIntoView({ behavior: 'smooth' }); }, 450);
        }
    }

    /**
     * Expands all the collapsed TreeView nodes. You can expand the specific nodes by passing the array of collapsed nodes
     * as argument to this method. You can also expand all the collapsed nodes by excluding the hidden nodes by setting
     * **excludeHiddenNodes** to true to this method. To expand a specific level of nodes, set **level** as argument to expandAll method.
     *
     * @param  {string[] | Element[]} nodes - Specifies the array of TreeView nodes ID/array of TreeView nodes.
     * @param  {number} level - TreeView nodes will expand up to the given level.
     * @param  {boolean} excludeHiddenNodes - Whether or not to exclude hidden nodes when expanding all nodes.
     * @param  {boolean} preventAnimation - Prevent the expand animation when expanding all nodes.
     * @returns {void}
     */
    public expandAll(nodes?: string[] | Element[], level?: number, excludeHiddenNodes?: boolean, preventAnimation?: boolean): void {
        this.isAnimate = !preventAnimation;
        if (!isNOU(nodes)) {
            this.doGivenAction(nodes, EXPANDABLE, true);
        } else {
            if (level > 0) {
                this.expandByLevel(select('.' + PARENTITEM, this.element), level, excludeHiddenNodes);
            } else {
                this.expandAllNodes(excludeHiddenNodes);
                if (!this.loadOnDemand || this.element.classList.contains('e-filtering')) {
                    this.updateAttributes(this.element);
                    this.updateList();
                }
            }
        }
        this.isAnimate = true;
    }

    /**
     * Gets all the checked nodes including child, whether it is loaded or not.
     *
     * @returns {string[]} - An array of strings representing the unique identifiers of checked nodes.
     */
    public getAllCheckedNodes(): string[] {
        const checkNodes: string[] = this.checkedNodes;
        return checkNodes;
    }

    /**
     * Gets all the disabled nodes including child, whether it is loaded or not.
     *
     * @returns {string[]} An array of strings representing the unique identifiers of disabled nodes.
     */
    public getDisabledNodes(): string[] {
        const disabledNodes: string[] = this.disableNode;
        return disabledNodes;
    }

    /**
     * Gets the node's data such as id, text, parentID, selected, isChecked, and expanded by passing the node element or it's ID.
     *
     * @param  {string | Element} node - Specifies ID of TreeView node/TreeView node.
     * @returns {Object} - The data associated with the specified node.
     */
    public getNode(node: string | Element): { [key: string]: Object } {
        const ele: Element = this.getElement(node);
        return this.getNodeData(ele, true);
    }

    /**
     * To get the updated data source of TreeView after performing some operation like drag and drop, node editing,
     * node selecting/unSelecting, node expanding/collapsing, node checking/unChecking, adding and removing node.
     * * If you pass the ID of TreeView node as arguments for this method then it will return the updated data source
     * of the corresponding node otherwise it will return the entire updated data source of TreeView.
     * * The updated data source also contains custom attributes if you specified in data source.
     *
     * @param  {string | Element} node - Specifies ID of TreeView node/TreeView node.
     * @isGenericType true
     * @returns {Object} - The tree data associated with the specified node or element.
     */
    public getTreeData(node?: string | Element): { [key: string]: Object }[] {
        const id: string = this.getId(node);
        this.updatePersistProp();
        if (isNOU(id)) {
            return this.treeData;
        } else {
            const data: { [key: string]: Object } = this.getNodeObject(id);
            return isNOU(data) ? [] : [data];
        }
    }

    /**
     * Moves the collection of nodes within the same TreeView based on target or its index position.
     *
     * @param  {string[] | Element[]} sourceNodes - Specifies the array of TreeView nodes ID/array of TreeView node.
     * @param  {string | Element} target - Specifies ID of TreeView node/TreeView node as target element.
     * @param  {number} index - Specifies the index to place the moved nodes in the target element.
     * @param { boolean } preventTargetExpand - If set to true, the target parent node will be prevented from auto expanding.
     * @returns {void}
     */
    public moveNodes(sourceNodes: string[] | Element[], target: string | Element, index: number, preventTargetExpand?: boolean): void {
        if (isNOU(sourceNodes) || sourceNodes.length === 0) {
            return;
        }
        let dropLi: Element = this.getElement(target);
        const nodeData: { [key: string]: Object; }[] = [];
        if (isNOU(dropLi)) {
            this.isHiddenItem = true;
            this.ensureVisible(target);
            this.isHiddenItem = false;
            dropLi = this.getElement(target);
        }
        for (let i: number = 0; i < sourceNodes.length; i++) {
            const dragLi: Element = this.getElement(sourceNodes[parseInt(i.toString(), 10)]);
            nodeData.push(this.getNode(dragLi));
            if (isNOU(dragLi) || dropLi.isSameNode(dragLi) || this.isDescendant(dragLi, dropLi)) {
                continue;
            }
            this.preventExpand = preventTargetExpand;
            this.dropAsChildNode(dragLi, dropLi, this, index, null, null, null, dropLi);
        }
        if (this.fields.dataSource instanceof DataManager === false) {
            this.preventExpand = false;
        }
        this.triggerEvent('moveNodes', nodeData);
    }

    /**
     * Refreshes a particular node of the TreeView.
     *
     * @param  {string | Element} target - Specifies the ID of TreeView node or TreeView node as target element.
     * @param  {Object[]} newData - Specifies the new data of TreeView node.
     * @returns {void}
     * ```typescript
     * var treeObj = document.getElementById("treeview").ej2_instances[0];
     * var data = treeObj.getTreeData("01");
     * var newData = {
     *   id: data[0].id,
     *   name: "new Text",
     * };
     * treeObj.refreshNode("01", [newData]);
     * ```
     */
    public refreshNode(target: string | Element, newData: { [key: string]: Object }[]): void {
        if (isNOU(target) || isNOU(newData)) {
            return;
        }
        let isRefreshChild: boolean = false;
        if (this.dataType === 1 && newData.length > 1) {
            isRefreshChild = true;
        } else if (this.dataType === 2 && newData.length === 1) {
            const updatedChildValue: { [key: string]: Object }[] = getValue(this.fields.child.toString(), newData[0]);
            if (!isNOU(updatedChildValue)) {
                isRefreshChild = true;
            }
        }
        let liEle: HTMLElement = this.getElement(target) as HTMLElement;
        const id: string = liEle ? liEle.getAttribute('data-uid') : ((target) ? target.toString() : null);
        this.refreshData = this.getNodeObject(id);
        newData = JSON.parse(JSON.stringify(newData));
        let newNodeData: { [key: string]: Object };
        let parentData: { [key: string]: Object };
        if (this.dataType === 1 && isRefreshChild) {
            for (let k: number = 0; k < newData.length; k++) {
                if (isNOU(newData[parseInt(k.toString(), 10)][this.fields.parentID])) {
                    parentData = newData[parseInt(k.toString(), 10)];
                    newData.splice(k, 1);
                    break;
                }
            }
            newNodeData = extend({}, this.refreshData, parentData) as { [key: string]: Object };
        } else {
            newNodeData = extend({}, this.refreshData, newData[0]) as { [key: string]: Object };
        }
        if (isNOU(liEle)) {
            this.updatePosition(id, newNodeData, isRefreshChild, newData);
            return;
        }
        this.isRefreshed = true;
        const level: number = parseFloat(liEle.getAttribute('aria-level'));
        const newliEle: HTMLElement[] = ListBase.createListItemFromJson(this.createElement, [newNodeData], this.listBaseOption, level);
        const ul: Element = select('.' + PARENTITEM, liEle);
        const childItems: { [key: string]: Object }[] = getValue(this.fields.child.toString(), newNodeData);
        if ((isRefreshChild && ul) || (isRefreshChild && !isNOU(childItems))) {
            const parentEle: Element = liEle.parentElement;
            const index: number = Array.prototype.indexOf.call(parentEle.childNodes, liEle);
            remove(liEle);
            parentEle.insertBefore(newliEle[0], parentEle.childNodes[parseInt(index.toString(), 10)]);
            this.updatePosition(id, newNodeData, isRefreshChild, newData);
            if (isRefreshChild && ul) {
                this.expandAll([id]);
            }
        } else {
            const txtEle: HTMLElement = select('.' + TEXTWRAP, liEle) as HTMLElement;
            const newTextEle: HTMLElement = select('.' + TEXTWRAP, newliEle[0]) as HTMLElement;
            const icon: HTMLElement = select('div.' + ICON, txtEle);
            const newIcon: HTMLElement = select('div.' + ICON, newTextEle);
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
            remove(txtEle);
            const fullEle: HTMLElement = select('.' + FULLROW, liEle);
            fullEle.parentNode.insertBefore(newTextEle, fullEle.nextSibling);
            this.updatePosition(id, newNodeData, isRefreshChild, newData);
        }
        liEle = this.getElement(target) as HTMLElement;
        if (newNodeData[this.fields.tooltip]) {
            liEle.setAttribute('title', newNodeData[this.fields.tooltip] as string);
        }
        if (Object.prototype.hasOwnProperty.call(newNodeData, this.fields.htmlAttributes) && newNodeData[this.fields.htmlAttributes]) {
            const attr: { [key: string]: string } = {};
            merge(attr, newNodeData[this.fields.htmlAttributes]);
            if (attr.class) {
                addClass([liEle], attr.class.split(' '));
                delete attr.class;
            } else {
                attributes(liEle, attr);
            }
        }
        if (this.selectedNodes.indexOf(id) !== -1) {
            liEle.setAttribute('aria-selected', 'true');
            addClass([liEle], ACTIVE);
        }
        this.isRefreshed = false;
        this.triggerEvent('refreshNode', [this.getNode(liEle)]);
    }

    /**
     * Removes the collection of TreeView nodes by passing the array of node details as argument to this method.
     *
     * @param  {string[] | Element[]} nodes - Specifies the array of TreeView nodes ID/array of TreeView node.
     * @returns {void}
     */
    public removeNodes(nodes: string[] | Element[]): void {
        if (!isNOU(nodes)) {
            if (this.fields.dataSource instanceof DataManager && !this.isOffline) {
                this.crudOperation('delete', nodes);
            } else {
                this.deleteSuccess(nodes);
            }
        }
    }

    /**
     * Replaces the text of the TreeView node with the given text only when the `allowEditing` property is enabled.
     *
     * @param  {string | Element} target - Specifies ID of TreeView node/TreeView node as target element.
     * @param  {string} newText - Specifies the new text of TreeView node.
     * @returns {void}
     */
    public updateNode(target: string | Element, newText: string): void {
        if (isNOU(target) || isNOU(newText) || !this.allowEditing) {
            return;
        }
        const liEle: Element = this.getElement(target);
        if (isNOU(liEle)) {
            return;
        }
        const txtEle: HTMLElement = select('.' + LISTTEXT, liEle) as HTMLElement;
        this.updateOldText(liEle);
        const eventArgs: NodeEditEventArgs = this.getEditEvent(liEle, null, null);
        this.trigger('nodeEditing', eventArgs, (observedArgs: NodeEditEventArgs) => {
            if (!observedArgs.cancel) {
                if (this.fields.dataSource instanceof DataManager && !this.isOffline) {

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
     *
     * @param  {string[] | Element[]} nodes - Specifies the array of TreeView nodes ID/array of TreeView node.
     * @returns {void}
     */
    public uncheckAll(nodes?: string[] | Element[]): void {
        if (this.showCheckBox && this.checkedNodes.length > 0) {
            this.doCheckBoxAction(nodes, false);
        }
    }

    private setNodeFocusable(): void {
        const firstNode: Element = select('.' + LISTITEM, this.element);
        if (firstNode) {
            firstNode.setAttribute('tabindex', '0');
            this.updateIdAttr(null, firstNode);
        }
    }
}
