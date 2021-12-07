
import { PointModel } from '../primitives/point-model';
import { Rect } from '../primitives/rect';
import { MarginModel } from '../core/appearance-model';
import { Margin } from '../core/appearance';
import { HorizontalAlignment, VerticalAlignment, ConnectionDirection } from '../enum/enum';
import { LayoutOrientation, ConnectorSegments, LayoutType, SubTreeOrientation, SubTreeAlignments, Segments } from '../enum/enum';
import { ConnectionPointOrigin, ChildArrangement } from '../enum/enum';
import { Property, Complex, ChildProperty } from '@syncfusion/ej2-base';
import { OrthogonalSegmentModel, BezierSegmentModel, StraightSegmentModel } from '../objects/connector-model';

/**
 * Defines the behavior of the automatic layouts
 */
export class Layout extends ChildProperty<Layout> {

    /**
     * Sets the name of the node with respect to which all other nodes will be translated
     *
     * @default ''
     */
    @Property('')
    public fixedNode: string;

    /**
     * Sets the space that has to be horizontally left between the nodes
     *
     * @default 30
     */
    @Property(30)
    public horizontalSpacing: number;

    /**
     * connect the node's without overlapping in automatic layout
     *
     * @default 'SamePoint'
     */
    @Property('SamePoint')
    public connectionPointOrigin: ConnectionPointOrigin;

    /**
     * connect the node's without overlapping in automatic layout
     *
     * @default 'Nonlinear'
     */
    @Property('Nonlinear')
    public arrangement: ChildArrangement;

    /**
     * Sets the space that has to be Vertically left between the nodes
     *
     * @default 30
     */
    @Property(30)
    public verticalSpacing: number;

    /**
     * Sets the Maximum no of iteration of the symmetrical layout
     *
     * @default 30
     */
    @Property(30)
    public maxIteration: number;

    /**
     * Defines the Edge attraction and vertex repulsion forces, i.e., the more sibling nodes repel each other
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     * let diagram: Diagram = new Diagram({
     * ...
     * layout: { type: 'SymmetricalLayout', springLength: 80, springFactor: 0.8,
     * maxIteration: 500, margin: { left: 20, top: 20 } },
     * ...
     * });
     * diagram.appendTo('#diagram');
     * ```
     *
     * @default 40
     */
    @Property(40)
    public springFactor: number;

    /**
     * Sets how long edges should be, ideally of the symmetrical layout
     *
     * @default 50
     */
    @Property(50)
    public springLength: number;

    /**
     * * Defines the space between the viewport and the layout
     *
     * @default { left: 50, top: 50, right: 0, bottom: 0 }
     * @blazorType LayoutMargin
     */
    @Complex<MarginModel>({ left: 50, top: 50, right: 0, bottom: 0 }, Margin)
    public margin: MarginModel;

    /**
     * Defines how the layout has to be horizontally aligned
     * * Stretch - Stretches the diagram element throughout its immediate parent
     * * Left - Aligns the diagram element at the left of its immediate parent
     * * Right - Aligns the diagram element at the right of its immediate parent
     * * Center - Aligns the diagram element at the center of its immediate parent
     * * Auto - Aligns the diagram element based on the characteristics of its immediate parent
     *
     * @default 'Auto'
     */
    @Property('Auto')
    public horizontalAlignment: HorizontalAlignment;

    /**
     * Defines how the layout has to be vertically aligned
     * * Stretch - Stretches the diagram element throughout its immediate parent
     * * Top - Aligns the diagram element at the top of its immediate parent
     * * Bottom - Aligns the diagram element at the bottom of its immediate parent
     * * Center - Aligns the diagram element at the center of its immediate parent
     * * Auto - Aligns the diagram element based on the characteristics of its immediate parent
     *
     * @default 'Auto'
     */
    @Property('Auto')
    public verticalAlignment: VerticalAlignment;

    /**
     * Defines the orientation of layout
     * * TopToBottom - Renders the layout from top to bottom
     * * BottomToTop - Renders the layout from bottom to top
     * * LeftToRight - Renders the layout from left to right
     * * RightToLeft - Renders the layout from right to left
     *
     * @default 'TopToBottom'
     */
    @Property('TopToBottom')
    public orientation: LayoutOrientation;

    /**
     * Sets how to define the connection direction (first segment direction & last segment direction).
     * * Auto - Defines the first segment direction based on the type of the layout
     * * Orientation - Defines the first segment direction based on the orientation of the layout
     * * Custom - Defines the first segment direction dynamically by the user
     *
     * @default 'Auto'
     */
    @Property('Auto')
    public connectionDirection: ConnectionDirection;

    /**
     * Sets whether the segments have to be customized based on the layout or not
     *  * Default - Routes the connectors like a default diagram
     *  * Layout - Routes the connectors based on the type of the layout
     *
     * @default 'Default'
     */
    @Property('Default')
    public connectorSegments: ConnectorSegments;

    /**
     * Defines the type of the layout
     * * None - None of the layouts is applied
     * * HierarchicalTree - Defines the type of the layout as Hierarchical Tree
     * * OrganizationalChart - Defines the type of the layout as Organizational Chart
     * * ComplexHierarchicalTree - Defines the type of the layout as complex HierarchicalTree
     * * RadialTree - Defines the type of the layout as Radial tree
     *
     * @default 'None'
     */
    @Property('None')
    public type: LayoutType;

    /**
     * getLayoutInfo is used to configure every subtree of the organizational chart
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     * let nodes: NodeModel[] = [{
     *           id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,
     *           annotations: [{ content: 'Default Shape' }]
     *       },
     *       {
     *           id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 100,
     *           shape: {
     *               type: 'Basic', shape: 'Ellipse'
     *           },
     *           annotations: [{ content: 'Path Element' }]
     *       }
     *       ];
     *       let connectors: ConnectorModel[] = [{
     *           id: 'connector1',
     *           type: 'Straight',
     *           sourcePoint: { x: 100, y: 300 },
     *           targetPoint: { x: 200, y: 400 },
     *       }];
     * let diagram: Diagram = new Diagram({
     * ...
     *       connectors: connectors, nodes: nodes,
     * 	   layout: {
     * enableAnimation: true,
     * type: 'OrganizationalChart', margin: { top: 20 },
     * getLayoutInfo: (node: Node, tree: TreeInfo) => {
     *       if (!tree.hasSubTree) {
     *           tree.orientation = 'Vertical';
     *           tree.type = 'Alternate';
     *       }
     *   }
     * },
     * ...
     * });
     * diagram.appendTo('#diagram');
     * ```
     *
     * @aspDefaultValueIgnore
     * @default undefined
     * @deprecated
     */
    @Property()
    public getLayoutInfo: Function | string;

    /**
     * getLayoutInfo is used to configure every subtree of the organizational chart
     */
    @Property()
    public layoutInfo: TreeInfo;

    /**
     * Defines whether an object should be at the left/right of the mind map. Applicable only for the direct children of the root node
     *
     * @aspDefaultValueIgnore
     * @default undefined
     * @deprecated
     */
    @Property()
    public getBranch: Function | string;

    /**
     * Aligns the layout within the given bounds
     *
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Property()
    public bounds: Rect;

    /**
     * Enables/Disables animation option when a node is expanded/collapsed
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     * let nodes: NodeModel[] = [{
     *           id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,
     *           annotations: [{ content: 'Default Shape' }]
     *       },
     *       {
     *           id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 100,
     *           shape: {
     *               type: 'Basic', shape: 'Ellipse'
     *           },
     *           annotations: [{ content: 'Path Element' }]
     *       }
     *       ];
     *       let connectors: ConnectorModel[] = [{
     *           id: 'connector1',
     *           type: 'Straight',
     *           sourcePoint: { x: 100, y: 300 },
     *           targetPoint: { x: 200, y: 400 },
     *       }];
     * let diagram: Diagram = new Diagram({
     *     connectors: connectors, nodes: nodes,
     * ...
     * 	   layout: {
     * enableAnimation: true, orientation: 'TopToBottom',
     * type: 'OrganizationalChart', margin: { top: 20 },
     * horizontalSpacing: 30, verticalSpacing: 30,
     * },
     * ...
     * });
     * diagram.appendTo('#diagram');
     * ```
     *
     * @default true
     */
    @Property(true)
    public enableAnimation: boolean;

    /**
     * Enable / Disable connector routing for the layout
     *
     * @default false
     */
    @Property(false)
    public enableRouting: boolean;

    /**
     * Defines the root of the hierarchical tree layout
     *
     * @default ''
     */
    @Property('')
    public root: string;
}

/**
 * Interface for the class node
 */
export interface INode {
    /** returns ID of node */
    id: string;
    /** returns offsetX of node */
    offsetX: number;
    /** returns offsetY of node */
    offsetY: number;
    /** returns actual size of node */
    actualSize: { width: number, height: number };
    /** returns InEdges of node */
    inEdges: string[];
    /** returns outEdges of node */
    outEdges: string[];
    /** returns pivot points of node */
    pivot: PointModel;
    /** returns false if the node to be arranged in layout, else it returns true */
    excludeFromLayout: boolean;
    /** returns true if the node to be expanded, else it returns false */
    isExpanded: boolean;
    /** returns data of the node */
    data: Object;
    /** returns bounds of the node */
    treeBounds?: Bounds;
    /** returns the difference between old position and new position of node */
    differenceX?: number;
    /** returns the difference between old position and new position of node */
    differenceY?: number;
    /** returns true if the node is already visited in layout, else it returns false */
    visited?: boolean;
}

/**
 * Defines the properties of the connector
 */
export interface IConnector {
    id: string;
    sourceID: string;
    targetID: string;
    visited?: boolean;
    visible?: boolean;
    points?: PointModel[];
    type?: Segments;
    segments?: OrthogonalSegmentModel[] | StraightSegmentModel[] | BezierSegmentModel[];
}

/**
 * Defines the properties of the layout bounds
 */
export interface Bounds {
    /** returns the left position, where the layout is rendered  */
    x: number;
    /** returns the top position, where layout is rendered  */
    y: number;
    /** returns the right position, where layout is rendered  */
    right: number;
    /** returns the bottom position, where layout is rendered  */
    bottom: number;
    /** returns how much distance layout is moved  */
    canMoveBy?: number;
}

/**
 * Defines the assistant details for the layout
 */
export interface AssistantsDetails {
    /** returns the root value */
    root: string;
    /** returns the assistant in the string collection  */
    assistants: string[];
}
/**
 * Defines the tree information for the layout
 */
export interface TreeInfo {
    orientation?: SubTreeOrientation;
    type?: SubTreeAlignments;
    offset?: number;
    enableRouting?: boolean;
    children?: string[];
    assistants?: string[];
    level?: number;
    hasSubTree?: boolean;
    rows?: number;
    getAssistantDetails?: AssistantsDetails;
    canEnableSubTree?: boolean;
    isRootInverse?: boolean;
}

/**
 * Contains the properties of the diagram layout
 */
export interface ILayout {
    anchorX?: number;
    anchorY?: number;
    maxLevel?: number;
    nameTable?: Object;
    /**
     * Provides firstLevelNodes node of the diagram layout
     *
     * @default undefined
     */
    firstLevelNodes?: INode[];
    /**
     * Provides centerNode node of the diagram layout
     *
     * @default undefined
     */
    centerNode?: null;
    /**
     * Provides type of the diagram layout
     *
     * @default undefined
     */
    type?: string;
    /**
     * Provides orientation of the diagram layout
     *
     * @default undefined
     */
    orientation?: string;
    graphNodes?: {};
    rootNode?: INode;
    updateView?: boolean;
    /**
     * Provides vertical spacing of the diagram layout
     * @default undefined
     */
    verticalSpacing?: number;
    /**
     * Provides horizontal spacing of the diagram layout
     *
     * @default undefined
     */
    horizontalSpacing?: number;
    levels?: LevelBounds[];
    /**
     * Provides horizontal alignment of the diagram layout
     *
     * @default undefined
     */
    horizontalAlignment?: HorizontalAlignment;
    /**
     * Provides horizontal alignment of the diagram layout
     *
     * @default undefined
     */
    verticalAlignment?: VerticalAlignment;
    /**
     * Provides fixed of the diagram layout
     *
     * @default undefined
     */
    fixedNode?: string;
    /**
     * Provides the layout bounds
     *
     * @default undefined
     */
    bounds?: Rect;
    getLayoutInfo?: Function;
    layoutInfo?: TreeInfo;
    getBranch?: Function;
    getConnectorSegments?: Function;
    level?: number;
    /**
     * Defines the layout margin values
     * @default undefined
     */
    margin?: MarginModel;
    /**
     * Defines objects on the layout
     *
     * @default undefined
     */
    objects?: INode[];
    /**
     * Defines the root of the hierarchical tree layout
     *
     * @default undefined
     */
    root?: string;
}

export interface LevelBounds {
    rBounds: Bounds;
}
