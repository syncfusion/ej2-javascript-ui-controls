import { GroupableView } from '../../core/containers/container';
import { Diagram } from '../../diagram';
import { ConnectorModel } from '../connector-model';
import { NodeModel, TextModel } from '../node-model';
import { PointModel } from '../../primitives/point-model';
import { EventState, ChangeType, State, DiagramAction, HistoryChangeAction, KeyModifiers, MouseButtons, LayoutType, LayoutState } from '../../enum/enum';
import { SelectorModel } from '../../objects/node-model';
import { DiagramModel } from '../../diagram-model';
import { Connector } from '../../objects/connector';
import { OrthogonalSegmentModel, StraightSegmentModel, BezierSegmentModel } from '../../objects/connector-model';
import { UserHandleModel } from '../../interaction/selector-model';
import { FixedUserHandleModel } from '../../objects/fixed-user-handle-model';
import { ShapeAnnotation, PathAnnotation } from '../../objects/annotation';
import { PointPortModel } from '../../objects/port-model';
import { KeyGestureModel } from '../../diagram/keyboard-commands-model';
import { Node } from '../../objects/node';
import { Size } from '../../primitives/size';
import { ShapeAnnotationModel, PathAnnotationModel } from '../annotation-model';
import { PaletteModel } from '../../../symbol-palette';
import { NodeFixedUserHandleModel, ConnectorFixedUserHandleModel } from '../fixed-user-handle-model';
import { DropInfo } from '@syncfusion/ej2-base';
import { AnnotationModel } from '../annotation-model';

/**
 * IElement interface defines the base of the diagram objects (node/connector)
 */
export interface IElement {
    /** returns the wrapper of the diagram element */
    wrapper: GroupableView;
    // eslint-disable-next-line @typescript-eslint/ban-types
    init(diagram: Diagram, getDescription?: Function): void;
}

/**
 * IDataLoadedEventArgs notifies after data is loaded.
 */
export interface IDataLoadedEventArgs {
    /** returns the instance of the diagram. */
    diagram: Diagram;
}
/**
 * ISelectionChangeEventArgs notifies when the node/connector are select.
 *
 */
export interface ISelectionChangeEventArgs {
    /** returns the collection of nodes and connectors that must be removed from selection list */
    oldValue: (NodeModel | ConnectorModel | AnnotationModel)[];
    /** returns the collection of nodes and connectors that must be added to selection list  */
    newValue: (NodeModel | ConnectorModel | AnnotationModel)[];
    /**
     Triggers before and after adding the selection to the object
     */
    state: EventState;
    /** returns the actual cause of the event */
    cause: DiagramAction;
    /** returns whether the item is added or removed from the selection list  */
    type: ChangeType;
    /** returns whether or not to cancel the selection change event  */
    cancel: boolean;
}
/**
 * ILayoutUpdatedEventArgs notifies when the layout rendering state changes.
 */
export interface ILayoutUpdatedEventArgs {
    /** returns whether the layout rendering has started or completed. */
    state: LayoutState;
    /** returns the type of layout being rendered. */
    type: LayoutType;
}
/**
 * IBlazorSelectionChangeEventArgs notifies when the node/connector are select in Blazor
 *
 */
export interface IBlazorSelectionChangeEventArgs {
    /** returns the collection of nodes and connectors that have to be removed from selection list */
    oldValue: DiagramEventObjectCollection;
    /** returns the collection of nodes and connectors that have to be added to selection list  */
    newValue: DiagramEventObjectCollection;
    /**
     * Triggers before and after adding the selection to the object
     * in the diagram which can be differentiated through `state` argument.
     * We can cancel the event only before the selection of the object
     */
    state: EventState;
    /** returns the actual cause of the event  */
    cause: DiagramAction;
    /** returns whether the item is added or removed from the selection list  */
    type: ChangeType;
    /** returns whether or not to cancel the selection change event  */
    cancel: boolean;
}

/**
 * ISizeChangeEventArgs notifies when the node are resized
 *
 */
export interface ISizeChangeEventArgs {
    /** returns the node that is selected for resizing
     *
     */
    source?: SelectorModel;
    /** returns the state of size change event (Start, Progress, Completed) */
    state: State;
    /** returns the previous width, height, offsetX and offsetY values of the element that is being resized.
     *
     */
    oldValue: SelectorModel;
    /** returns the new width, height, offsetX and offsetY values of the element that is being resized.
     *
     */
    newValue: SelectorModel;
    /** specify whether or not to cancel the event */
    cancel: boolean;
}

/**
 * IRotationEventArgs notifies when the node/connector are rotated
 *
 */
export interface IRotationEventArgs {
    /** returns the node that is selected for rotation
     *
     */
    source?: SelectorModel;
    /** returns the state of rotate event (Start, Progress, Completed) */
    state: State;
    /** returns the previous rotation angle
     *
     */
    oldValue: SelectorModel;
    /** returns the new rotation angle
     *
     */
    newValue: SelectorModel;
    /** returns whether to cancel the change or not */
    cancel: boolean;
}
/**
 * IConnectorInitEventArgs notifies when the connector is initiated
 */
export interface IConnectorInitEventArgs {
    /** returns connector that is being changed
     *
     */
    element?: ConnectorModel;
}

/**
 * DiagramCollectionObject is the interface for the diagram objects
 *
 */
export interface DiagramEventObjectCollection {
    /** returns the collection of node
     *
     */
    nodes?: NodeModel[];
    /** returns the collection of connector
     *
     */
    connectors?: ConnectorModel[];
    /**
     * @private
     * Returns the collection of node id
     *
     */
    nodeCollection?: string[];
    /**
     * @private
     * Returns the collection of connector id
     *
     */
    connectorCollection?: string[];
}

/**
 * DiagramObject is the interface for the diagram object
 *
 */

export interface DiagramEventObject {
    /** returns the  node
     *
     */
    node?: NodeModel;
    /** returns the  connector
     *
     */
    connector?: ConnectorModel;
    /**
     * @private
     * returns the id of node
     *
     */
    nodeId?: string;
    /**
     * @private
     * returns the id of connector
     *
     */
    connectorId?: string;
}

/**
 * fixedUserHandleClickEventArgs notifies when the fixed user handle gets clicked
 *
 */
/**   @private  */
export interface BlazorFixedUserHandleClickEventArgs {
    /** returns the fixed user handle of nodes/connector.
     */
    fixedUserHandle: DiagramFixedUserHandle;
    /** returns the selected nodes/connector. */
    element: DiagramEventObject;
}

/**
 * fixedUserHandleClickEventArgs notifies when the fixed user handle gets clicked
 *
 */
export interface FixedUserHandleClickEventArgs {
    /** returns the fixed user handle of nodes/connector.
     */
    fixedUserHandle: NodeFixedUserHandleModel | ConnectorFixedUserHandleModel;
    /** returns the selected nodes/connector */
    element: NodeModel | ConnectorModel;
}
/**
 * DiagramFixedUserHandle is the interface for the fixed user handle
 *
 */
/**   @private  */
export interface DiagramFixedUserHandle {
    /** returns the  node fixed user handle
     *
     */
    nodeFixedUserHandle?: NodeFixedUserHandleModel;
    /** returns the  connector fixed user handle
     */
    connectorFixedUserHandle?: ConnectorFixedUserHandleModel;
}


/**
 * ICollectionChangeEventArgs notifies while the node/connector are added or removed.
 *
 */
export interface ICollectionChangeEventArgs {
    /** returns the element that is going to added or removed from the diagram. */
    element: NodeModel | ConnectorModel;
    /** returns the action of diagram */
    cause: DiagramAction;
    /** returns the string of the DiagramAction*/
    diagramAction: string;
    /** returns the state of collection change event (Changing, Changed, Canceled) */
    state: EventState;
    /** returns the type of the collection change. */
    type: ChangeType;
    /** returns whether to cancel the change or not. */
    cancel: boolean;
    /** returns the lane index */
    laneIndex?: Number;
    /** returns a parent node of the target node */
    parentId?: string;
}
/**
 * IBlazorCollectionChangeEventArgs notifies while the node/connector are added or removed in the diagram
 *
 */
export interface IBlazorCollectionChangeEventArgs {
    /** returns the action of diagram */
    cause: DiagramAction;
    /** returns the state of the event */
    state: EventState;
    /** returns the type of the collection change */
    type: ChangeType;
    /** returns whether to cancel the change or not */
    cancel: boolean;
    /** returns the selected element  */
    element?: DiagramEventObject;
}
/**
 * IBlazorSegmentCollectionChangeEventArgs notifies while the segment of the connectors changes
 *
 */
export interface IBlazorSegmentCollectionChangeEventArgs {
    /** returns the selected element
     *
     */
    element: ConnectorModel;
    /** returns the selected element  */
    removeSegments?: OrthogonalSegmentModel[];
    /** returns the action of diagram */
    addSegments?: OrthogonalSegmentModel[];
    /** returns the type of the collection change */
    type: ChangeType;
    /** returns whether to cancel the change or not */
    cancel: boolean;
}
/**
 * UserHandleEventsArgs notifies while the user handle gets clicked.
 *
 */
export interface UserHandleEventsArgs {
    /** returns the user handle object that is being clicked. */
    element: UserHandleModel;
}
/**
 * FixedUserHandleEventsArgs notifies while the fixed user handle gets clicked.
 *
 */
export interface FixedUserHandleEventsArgs {
    /** returns the fixed user handle object that is being clicked. */
    element: FixedUserHandleModel;
}

/**
 * ISegmentCollectionChangeEventArgs notifies while the segments are added or removed from the connector.
 *
 */
export interface ISegmentCollectionChangeEventArgs {
    /** returns the selected element
     *
     */
    element: ConnectorModel;
    /** returns the collection of segment that must be removed from connector segment collection */
    removeSegments?: (OrthogonalSegmentModel | StraightSegmentModel | BezierSegmentModel)[];
    /**returns the collection of segment that must be added to connector segment collection */
    addSegments?: (OrthogonalSegmentModel | StraightSegmentModel | BezierSegmentModel)[];
    /** returns the type of the collection change */
    type: ChangeType;
    /** returns whether to cancel the change or not */
    cancel: boolean;
}

/**
 * IPropertyChangeEventArgs notifies when the node/connector property changed
 *
 */
export interface IPropertyChangeEventArgs {
    /** returns the selected element. */
    element: (NodeModel | ConnectorModel | Diagram);
    /** returns the action of diagram. */
    cause: DiagramAction;
    /** returns the string of the DiagramAction*/
    diagramAction: string;
    /** returns the old value of the property that is being changed */
    oldValue: DiagramModel | NodeModel | ConnectorModel;
    /** returns the new value of the node property that is being changed */
    newValue: DiagramModel | NodeModel | ConnectorModel;
}

/**
 * PropertyChangeObject notifies whether it is node or connector
 */

export interface DiagramPropertyChangeObject {
    /** returns the new source node or target node of the connector
     *
     */
    node?: NodeModel;
    /** returns the new source node or target node of the connector
     *
     */
    connector?: ConnectorModel;
    diagram?: DiagramModel;
}

/**
 * IBlazorPropertyChangeEventArgs notifies when the node/connector property changed
 *
 */
export interface IBlazorPropertyChangeEventArgs {
    /** returns the selected element */
    element: DiagramPropertyChangeObject;
    /** returns the action is nudge or not */
    cause: DiagramAction;
    /** returns the string of the DiagramAction*/
    diagramAction: string;
    /** returns the old value of the property that is being changed */
    oldValue: DiagramPropertyChangeObject;
    /** returns the new value of the node property that is being changed */
    newValue: DiagramPropertyChangeObject;
}

/**
 * IDraggingEventArgs notifies when the node/connector are dragged
 *
 */
export interface IDraggingEventArgs {
    /** returns the node or connector that is being dragged. */
    source: SelectorModel;
    /** returns the state of drag event (Starting, dragging, completed) */
    state: State;
    /** returns the previous node or connector that is dragged */
    oldValue: SelectorModel;
    /** returns the current node or connector that is being dragged */
    newValue: SelectorModel;
    /** returns the target node or connector that is dragged */
    target: NodeModel | ConnectorModel;
    /** returns the offset of the selected items */
    targetPosition: PointModel;
    /** returns the object that can be dropped over the element */
    allowDrop: boolean;
    /** returns whether to cancel the change or not */
    cancel: boolean;
}
export interface ConnectorValue {
    nodeId: string;
    portId: string;
}

/**
 * BlazorConnectionObject interface for the connector object
 *
 */
export interface BlazorConnectionObject {
    /** returns the new source node or target node of the connector
     *
     */
    connector?: ConnectorModel;
    connectorTargetValue?: ConnectorValue;
    connectorSourceValue?: ConnectorValue;
}

/**
 * IBlazorConnectionChangeEventArgs notifies when the connector are connect or disconnect
 *
 */
export interface IBlazorConnectionChangeEventArgs {
    /** returns the new source node or target node of the connector
     *
     */
    connector?: ConnectorModel;
    /** returns the previous source or target node of the element */
    oldValue: BlazorConnectionObject;
    /** returns the current source or target node of the element */
    newValue: BlazorConnectionObject;
    /** returns the connector end  */
    connectorEnd: string;
    /** returns the state of connection end point dragging(starting, dragging, completed) */
    state: EventState;
    /** returns whether to cancel the change or not */
    cancel: boolean;
}

/**
 * IBlazorDragLeaveEventArgs notifies when the element leaves from  the diagram
 *
 */
export interface IBlazorDragLeaveEventArgs {
    /** returns the id of the diagram */
    diagramId: string;
    /** returns the node or connector that is dragged outside of the diagram */
    element: DiagramEventObject;
}

/**
 * IBlazorDraggingEventArgs notifies when the node/connector are dragged
 */
export interface IBlazorDraggingEventArgs {
    /** returns the node or connector that is being dragged
     *
     */
    source?: SelectorModel;
    /** returns the state of drag event (Starting, dragging, completed) */
    state: State;
    /** returns the previous node or connector that is dragged
     *
     */
    oldValue: SelectorModel;
    /** returns the current node or connector that is being dragged
     *
     */
    newValue: SelectorModel;
    /** returns the target node or connector that is dragged */
    target: DiagramEventObject;
    /** returns the offset of the selected items */
    targetPosition: PointModel;
    /** returns the object that can be dropped over the element */
    allowDrop: boolean;
    /** returns whether to cancel the change or not */
    cancel: boolean;
}

/**
 * IConnectionChangeEventArgs notifies when the connector is connected or disconnect from the node.
 *
 */
export interface IConnectionChangeEventArgs {
    /** returns the selected connector */
    connector: ConnectorModel;
    /** returns the previous source or target node of the element */
    oldValue: Connector | { nodeId: string, portId: string };
    /** returns the new source or target node of the element */
    newValue: Connector | { nodeId: string, portId: string };
    /** returns the connector end  */
    connectorEnd: string;
    /** returns the state of connection end point dragging (starting, dragging, completed) */
    state: EventState;
    /** returns whether to cancel the change or not */
    cancel: boolean;
}

/**
 * IEndChangeEventArgs notifies when the connector end point is resized
 *
 */
export interface IEndChangeEventArgs {
    /** returns the connector, the source / target point which is being dragged
     *
     */
    connector: ConnectorModel;
    /** returns the previous point of the connector */
    oldValue: PointModel;
    /** returns the current point of the connector */
    newValue: PointModel;
    /** returns the target node of the element */
    targetNode: string;
    /** returns the target port of the element */
    targetPort: string;
    /** returns the source node of the element */
    sourceNode?: string;
    /** returns the source port of the element */
    sourcePort?: string;
    /** returns the state of connection end point dragging (starting, dragging, completed) */
    state: State;
    /** returns whether to cancel the change or not */
    cancel: boolean;
}

/**
 * Animation - Animation notifies when the animation is taken place.
 *
 */
export interface Animation {
    /** returns the state of animation event (Start, Progress, Completed) */
    state: State;
}

/**
 * IClickEventArgs - IClickEventArgs notifies while click on the objects or diagram.
 *
 */
export interface IClickEventArgs {
    /** returns the object that is clicked or instance of the diagram */
    element: SelectorModel | Diagram;
    /** returns the object position that is actually clicked */
    position: PointModel;
    /** returns the number of times clicked */
    count: number;
    /** returns the object that is clicked or instance of the diagram */
    actualObject: SelectorModel | Diagram;
    /** returns the button clicked */
    button?: MouseButtons;
}

/**
 * IBlazorClickEventArgs notifies while click on the objects or diagram
 *
 */
export interface IBlazorClickEventArgs {
    /** returns the object that is clicked or id of the diagram */
    element: DiagramClickEventObject;
    /** returns the object position that is actually clicked */
    position: PointModel;
    /** returns the number of times clicked */
    count: number;
    /** returns the actual object that is clicked or id of the diagram */
    actualObject: DiagramClickEventObject;
    /** returns the button clicked */
    button?: MouseButtons;
}

/**
 * IDoubleClickEventArgs - IDoubleClickEventArgs notifies while double click on the diagram or its objects
 *
 */
export interface IDoubleClickEventArgs {
    /** returns the object that is clicked or instance of the diagram */
    source: SelectorModel | Diagram;
    /** returns the object position that is actually clicked */
    position: PointModel;
    /** returns the number of times clicked */
    count: number;
}

/**
 * ClickedObject notifies whether it is node or connector
 */

export interface DiagramClickEventObject {
    /** returns the selected items
     *
     */
    selector?: SelectorModel;
    diagram?: Diagram;
}

/**
 * IDoubleClickEventArgs notifies while double click on the diagram or its objects
 *
 */
export interface IBlazorDoubleClickEventArgs {
    /** returns the object that is clicked or id of the diagram */
    source: DiagramClickEventObject;
    /** returns the object position that is actually clicked */
    position: PointModel;
    /** returns the number of times clicked */
    count: number;
}

export interface IMouseEventArgs {
    /** returns a parent node of the target node or connector */
    element: NodeModel | ConnectorModel | SelectorModel;
    /** returns when mouse hover to the target node or connector */
    actualObject: Object;
    /** returns the target object over which the selected object is dragged */
    targets: (NodeModel | ConnectorModel)[];
}

/**
 * MouseEventElement notifies whether it is node or connector or selector model
 */

export interface DiagramMouseEventObject {
    /** returns the new source node or target node of the connector
     *
     */
    node?: NodeModel;
    /** returns the new source node or target node of the connector
     *
     */
    connector?: ConnectorModel;
    selector?: SelectorModel;
}

/**
 * MouseEventElement notifies whether it is node or connector or selector model
 */

// eslint-disable-next-line no-redeclare
export interface DiagramEventObjectCollection {
    /** returns the collection of node
     * ObservableCollection<DiagramNode>
     */
    node?: NodeModel[];
    /** returns the collection of connectors
     * ObservableCollection<DiagramConnector>
     */
    connector?: ConnectorModel[];
}

export interface IBlazorMouseEventArgs {
    /** returns a parent node of the target node or connector */
    element: DiagramMouseEventObject;
    /** returns when mouse hover to the target node or connector */
    actualObject: DiagramMouseEventObject;
    /** returns the target object over which the selected object is dragged */
    targets: DiagramEventObjectCollection;
}

/**
 * elementDraw triggered when node or connector are drawn with drawing tool
 *
 */
export interface  IElementDrawEventArgs{
    /**returns the node or connector which we draw with drawing tool */
    source: NodeModel|ConnectorModel;
    /**returns the state of drawing tool event */
    state: State;
    /**returns the node or connector about to be drawn */
    objectType: string;
    /**returns the node shape name or connector type */
    elementType: string;
    /**returns whether to cancel the drawing shape or connector in the start state */
    cancel: boolean;
}

/**
 * scrollArgs notifies when the scroller had updated
 *
 */
export interface ScrollValues {
    /** returns the horizontaloffset of the scroller */
    HorizontalOffset: number;
    /** returns the verticalOffset of the scroller */
    VerticalOffset: number;
    /** returns the CurrentZoom of the scroller */
    CurrentZoom: number;
    /** returns the ViewportWidth of the scroller */
    ViewportWidth: number;
    /** returns the ViewportHeight of the scroller */
    ViewportHeight: number;
}

/**
 * IBlazorScrollChangeEventArgs notifies when the scroller has changed
 *
 */
export interface IBlazorScrollChangeEventArgs {
    /** returns the object that is clicked or id of the diagram */
    sourceId: string;
    /** returns the previous delay value between subsequent auto scrolls */
    oldValue: ScrollValues;
    /** returns the new delay value between subsequent auto scrolls */
    newValue: ScrollValues;
    /** returns the pan state of the object */
    panState: State;
}
/**
 * IScrollChangeEventArgs - IScrollChangeEventArgs notifies when the scroller has changed
 *
 */
export interface IScrollChangeEventArgs {
    /** returns the object that is clicked or instance of the diagram */
    source: SelectorModel | Diagram;
    /** returns the previous delay value between subsequent auto scrolls */
    oldValue: ScrollValues;
    /** returns the new delay value between subsequent auto scrolls */
    newValue: ScrollValues;
    /** returns the pan state of scroll change event (Start, Progress, Completed) */
    panState: State;
}

/**
 * IMouseWheelEventArgs - Event triggers whenever the user rotates the mouse wheel either upwards or downwards
 *
 */
export interface IMouseWheelEventArgs {
    /** returns the DOM Object */
    event: WheelEvent ;
    /** specifies whether to cancel the mouse wheel interaction in the diagram */
    cancel: boolean;
}

/**
 * IPaletteSelectionChangeArgs - IPaletteSelectionChangeArgs notifies when the selection objects change in the symbol palette.
 *
 */
export interface IPaletteSelectionChangeArgs {
    /** returns the old palette item that is selected. */
    oldValue: string;
    /** returns the new palette item that is selected. */
    newValue: string;
}

/**
 * IPaletteExpandArgs - IPaletteExpandArgs notifies when the palette items are expanded or collapsed in the symbol palette
 *
 */
export interface IPaletteExpandArgs {
    /** returns the index of the palette item selected. */
    index: number;
    /** returns the value whether the palette item is expanded */
    isExpanded: boolean;
    /** cancels the palette item expand or collapse */
    cancel: boolean;
    /** returns the content of the palette item that is selected */
    content: HTMLElement;
    /** returns the palette item selected */
    element: HTMLElement;
    /** returns the properties of the palette item selected */
    palette: PaletteModel;
}

/**
 * IDragEnterEventArgs - IDragEnterEventArgs notifies when the element enters into the diagram from symbol palette
 *
 */
export interface IDragEnterEventArgs {
    /** returns the node or connector that is to be dragged into diagram. */
    source: Object;
    /** returns the node or connector that is dragged into diagram. */
    element: NodeModel | ConnectorModel;
    /**returns the instance of the diagram. */
    diagram: DiagramModel;
    /** returns whether to add or remove the symbol from diagram*/
    cancel: boolean;
    /** returns the node or connector that been dragged into diagram from other component */
    dragData: DropInfo;
    /** returns the node or connector that been returned into the diagram */
    dragItem: NodeModel | ConnectorModel;
}

/**
 * IBlazorDragEnterEventArgs notifies when the element enter into the diagram from symbol palette
 *
 */
export interface IBlazorDragEnterEventArgs {
    /** returns the node or connector that is to be dragged into diagram */
    source: Object;
    /** returns the node or connector that is dragged into diagram */
    element: DiagramEventObject;
    /** returns the id of the diagram */
    diagramId: string;
    /** parameter returns whether to add or remove the symbol from diagram */
    cancel: boolean;
}

/**
 * IDragLeaveEventArgs - IDragLeaveEventArgs notifies when the element leaves from the diagram
 *
 */
export interface IDragLeaveEventArgs {
    /** returns the instance of the diagram */
    diagram: DiagramModel;
    /** returns the node or connector that is dragged outside of the diagram
     *
     */
    element: SelectorModel;
}

/**
 * IDragOverEventArgs - IDragOverEventArgs notifies when an element drags over another diagram element
 *
 */
export interface IDragOverEventArgs {
    /** returns the instance of the diagram */
    diagram: DiagramModel;
    /** returns the node or connector that is dragged over diagram
     *
     */
    element: SelectorModel;
    /** returns the node/connector over which the symbol is dragged
     *
     */
    target: SelectorModel;
    /** returns the mouse position of the node/connector */
    mousePosition: PointModel;
}

/**
 * ITextEditEventArgs - ITextEditEventArgs notifies when the label of an element undergoes editing
 */
export interface ITextEditEventArgs {
    /** returns the old text value of the element. */
    oldValue: string;
    /** returns the new text value of the element. */
    newValue: string;
    /** returns a node or connector in which annotation is being edited. */
    element: NodeModel | ConnectorModel;
    /** returns an annotation which is being edited. */
    annotation: ShapeAnnotationModel | PathAnnotationModel | TextModel;
    /** returns whether to cancel the event. */
    cancel: boolean;
}

/**
 * IBlazorTextEditEventArgs notifies when the label of an element under goes editing
 */
export interface IBlazorTextEditEventArgs {
    /** Returns the old text value of the element */
    oldValue: string;
    /** Returns the new text value of the element that is being changed */
    newValue: string;
    /** Returns a node or connector in which annotation is being edited */
    element: DiagramEventObject;
    /** Returns a annotation which is being edited */
    annotation: DiagramEventAnnotation;
    /** Returns whether or not to cancel the event */
    cancel: boolean;
}

/**
 * DiagramObject is the interface for the diagram object
 *
 */

export interface DiagramEventAnnotation {
    /** returns the  node annotation
     */
    nodeAnnotation?: ShapeAnnotationModel;
    /** returns the  connector annotationAnnotation
     */
    connectorAnnotation?: PathAnnotationModel;
    /**
     * @private
     * returns the id of node
     *
     */
    annotationId?: string;
    /** returns the  text node
     *
     */
    textNode?: TextModel;
}
/**
 * IBlazorHistoryChangeArgs notifies while the node/connector are added or removed
 *
 */
export interface IBlazorHistoryChangeArgs {
    /** returns an array of objects, where each object represents the changes made in last undo/redo */
    change: ChangedObject;
    /** returns the cause of the event */
    cause: string;
    /** returns a collection of objects that are changed in the last undo/redo */
    source?: DiagramEventObjectCollection;
    /** returns the event action */
    action?: HistoryChangeAction;

}
/**
 * IHistoryChangeArgs - IHistoryChangeArgs notifies when the undo/redo operation perform.
 *
 */
export interface IHistoryChangeArgs {
    /** returns a collection of objects that are changed in the last undo/redo */
    source: (NodeModel | ConnectorModel)[];
    /** returns a string array of changed property of node/connector */
    sourceId: string[];
    /** returns an array of objects, where each object represents the changes made in last undo/redo */
    change: SelectorModel;
    /** returns the cause of the event */
    cause: string;
    /** returns the event action */
    action?: HistoryChangeAction;

}
/**
 * IBlazorChangeArgs
 *
 */
export interface ChangedObject {
    /** returns the type of the entry */
    entryType: string;
    /** returns a collection of objects that are changed in the last undo/redo */
    oldValue: ChangedValues;
    /** returns an array of objects, where each object represents the changes made in last undo/redo */
    newValue: ChangedValues;
}

export interface ChangedValues {
    /** returns a object's offset x  */
    offsetX?: number;
    /** returns a object's offset y  */
    offsetY?: number;
    /** returns a object's width  */
    width?: number;
    /** returns a object's height */
    height?: number;
    /** returns a object's rotateangle  */
    rotateAngle?: number;
}


/**
 * ICustomHistoryChangeArgs - ICustomHistoryChangeArgs notifies when the custom undo/redo operation perform.
 *
 */
export interface ICustomHistoryChangeArgs {
    /** returns the type of the entry that means undo or redo */
    entryType: string;
    /** returns a collection of objects that are changed in the last undo/redo */
    oldValue: NodeModel | ConnectorModel | SelectorModel | DiagramModel | ShapeAnnotation | PathAnnotation | PointPortModel;
    /** returns an array of objects, where each object represents the changes made in last undo/redo */
    newValue: NodeModel | ConnectorModel | SelectorModel | DiagramModel | ShapeAnnotation | PathAnnotation | PointPortModel;
}

/**
 * ICustomHistoryChangeArgs notifies when the label of an element under goes editing
 *
 */
export interface IBlazorCustomHistoryChangeArgs {
    /** returns the type of the entry that means undo or redo */
    entryType: string;
    /** returns a collection of objects that are changed in the last undo/redo */
    oldValue: HistoryChangeEventObject;
    /** returns an array of objects, where each object represents the changes made in last undo/redo */
    newValue: HistoryChangeEventObject;
}

export interface HistoryChangeEventObject {
    /** returns a node objects
     *
     */
    node?: Node;
    /** returns a connector objects
     *
     */
    connector?: ConnectorModel;
    /** returns a selector objects
     *
     */
    selector?: SelectorModel;
    /** returns a diagram objects  */
    diagram?: DiagramModel;
    /** returns a shape annotation objects
     */
    shapeAnnotation?: ShapeAnnotation;
    /** returns a path annotation objects
     */
    pathAnnotation?: PathAnnotation;
    /** returns port objects  */
    pointPortModel?: PointPortModel;
    /** returns the custom objects  */
    object?: object;
}


/**
 * DiagramDropObject notifies when the element is dropped in the diagram in blazor
 *
 */
export interface DiagramEventDropObject {
    /** returns a node objects
     *
     */
    node?: NodeModel;
    /** returns a connector objects
     *
     */
    connector?: ConnectorModel;
    /** returns a diagram objects  */
    diagramId?: string;
}
/**
 * IBlazorDropEventArgs notifies when the element is dropped in the diagram in blazor
 *
 */
export interface IBlazorDropEventArgs {
    /** returns node or connector that is being dropped */
    element: DiagramEventObject;
    /** returns the object from where the element is dragged */
    source?: Object;
    /** returns the object over which the object will be dropped */
    target: DiagramEventDropObject;
    /** returns the position of the object */
    position: PointModel;
    /** returns whether or not to cancel the drop event */
    cancel: boolean;
}

/**
 * IDropEventArgs - IDropEventArgs notifies when the element is dropped in the diagram
 *
 */
export interface IDropEventArgs {
    /** returns node or connector that is being dropped into diagram */
    element: NodeModel | ConnectorModel | SelectorModel;
    /** returns the object from where the element is dragged. */
    source?: Object;
    /** returns the object over which the object will be dropped. */
    target: NodeModel | ConnectorModel | DiagramModel;
    /** returns the position of the dropped object. */
    position: PointModel;
    /** returns whether or not to cancel the drop event */
    cancel: boolean;
}

/**
 * ISegmentChangeEventArgs - ISegmentChangeEventArgs triggered when we drag the segment thumb of Orthogonal/ Straight /Bezier connector
 */
export interface ISegmentChangeEventArgs {
    /** Returns the connector, the segment of which is being dragged */
    source: ConnectorModel;
    /** Returns the current state of segment change event (Start, Progress, Completed)  */
    state: State;
    /** Returns the segment with the newly changed values */
    newValue: OrthogonalSegmentModel | StraightSegmentModel | BezierSegmentModel;
    /** Returns the segment with the values before the event triggered.  */
    oldValue: OrthogonalSegmentModel | StraightSegmentModel | BezierSegmentModel;
    /** Returns whether to cancel the change or not when the event state is Start.  */
    cancel: boolean;
    /** Returns the segment which is being dragged  */
    segment: OrthogonalSegmentModel | StraightSegmentModel | BezierSegmentModel;
}

/**
 * Interface for command
 * ICommandExecuteEventArgs – ICommandExecuteEventArgs notifies when custom command executed in the diagram.
 */
export interface ICommandExecuteEventArgs {
    /** Sets the key value, on recognition of which the command will be executed */
    gesture: KeyGestureModel;
}

/** @private */
export interface StackEntryObject {
    targetIndex?: number;
    target?: NodeModel;
    sourceIndex?: number;
    source?: NodeModel;
}
/**
 * IExpandStateChangeEventArgs - IExpandStateChangeEventArgs notifies when the node is expanded or collapsed.
 */
export interface IExpandStateChangeEventArgs {
    /**returns node that is being expanded or collapsed.
     *
     */
    element?: NodeModel;
    /** returns whether or not to expanded. */
    state?: boolean;
}

/**
 * IImageLoadEventArgs - IImageLoadEventArgs notifies while the image node is loaded.
 *
 */
export interface IImageLoadEventArgs {
    /** returns the node in which image is loaded
     *
     */
    element: NodeModel;
    /** returns the size of an image element. */
    size: Size;
}

/**
 * IKeyEventArgs - IKeyEventArgs notifies while perform the key actions in the diagram.
 *
 */
export interface IKeyEventArgs {
    /** Returns the selected element of the diagram
     *
     */
    element?: SelectorModel;
    /** Returns the text content of the label currently editing */
    text?: string;
    /** Returns the id of the text box element in editing mode. */
    target?: string;
    /** Returns the label which is currently editing */
    label?: object;
    /** Returns value of the key action */
    key?: string;
    /** Returns a number which represents an actual key pressed. */
    keyCode?: number;
    /** Returns any, modifier keys were pressed when the flick gesture occurred. */
    keyModifiers?: KeyModifiers;
    /** Returns a value which represents an elements old position before nudge. */
    oldValue?: ElementOffset;
    /** Returns a value which represents an elements new position after nudge. */
    newValue?: ElementOffset;
}

export interface ElementOffset {
    /** returns a object's offset x  */
    offsetX?: number;
    /** returns a object's offset y  */
    offsetY?: number;
}

/**
 * ILoadEventArgs - ILoadEventArgs defines the event arguments when diagram rendering is initialized.
 */
export interface ILoadEventArgs {
    /** Returns the name of the event. */
    name?: string
    /** Returns the diagram instance. */
    diagram?: Diagram;
}
/**
 * ILoadedEventArgs - ILoadedEventArgs defines the event arguments after the diagram elements finished loading using loadDiagram method.
 */
export interface ILoadedEventArgs {
    /** Returns the event name . */
    name?: string
    /** Returns the diagram model properties. */
    diagram?: Diagram;
}
