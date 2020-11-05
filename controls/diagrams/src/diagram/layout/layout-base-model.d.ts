import { PointModel } from '../primitives/point-model';import { Rect } from '../primitives/rect';import { MarginModel } from '../core/appearance-model';import { Margin } from '../core/appearance';import { HorizontalAlignment, VerticalAlignment, ConnectionDirection, } from '../enum/enum';import { LayoutOrientation, ConnectorSegments, LayoutType, SubTreeOrientation, SubTreeAlignments, Segments } from '../enum/enum';import { ConnectionPointOrigin, ChildArrangement } from '../enum/enum';import { Property, Complex, ChildProperty } from '@syncfusion/ej2-base';import { OrthogonalSegmentModel, BezierSegmentModel, StraightSegmentModel } from '../objects/connector-model';
import {TreeInfo} from "./layout-base";

/**
 * Interface for a class Layout
 */
export interface LayoutModel {

    /**
     * Sets the name of the node with respect to which all other nodes will be translated
     * @default ''
     */
    fixedNode?: string;

    /**
     * Sets the space that has to be horizontally left between the nodes
     * @default 30
     */
    horizontalSpacing?: number;

    /**
     * connect the node's without overlapping in automatic layout
     * @default 'SamePoint'
     */
    connectionPointOrigin?: ConnectionPointOrigin;

    /**
     * connect the node's without overlapping in automatic layout
     * @default 'Nonlinear'
     */
    arrangement?: ChildArrangement;

    /**
     * Sets the space that has to be Vertically left between the nodes
     * @default 30
     */
    verticalSpacing?: number;

    /**
     * Sets the Maximum no of iteration of the symmetrical layout
     * @default 30
     */
    maxIteration?: number;

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
     * @default 40
     */
    springFactor?: number;

    /**
     * Sets how long edges should be, ideally of the symmetrical layout
     * @default 50
     */
    springLength?: number;

    /**
     * * Defines the space between the viewport and the layout
     * @default { left: 50, top: 50, right: 0, bottom: 0 }
     * @blazorType LayoutMargin
     */
    margin?: MarginModel;

    /**
     * Defines how the layout has to be horizontally aligned
     * * Stretch - Stretches the diagram element throughout its immediate parent
     * * Left - Aligns the diagram element at the left of its immediate parent
     * * Right - Aligns the diagram element at the right of its immediate parent
     * * Center - Aligns the diagram element at the center of its immediate parent
     * * Auto - Aligns the diagram element based on the characteristics of its immediate parent
     * @default 'Auto'
     */
    horizontalAlignment?: HorizontalAlignment;

    /**
     * Defines how the layout has to be vertically aligned
     * * Stretch - Stretches the diagram element throughout its immediate parent
     * * Top - Aligns the diagram element at the top of its immediate parent
     * * Bottom - Aligns the diagram element at the bottom of its immediate parent
     * * Center - Aligns the diagram element at the center of its immediate parent
     * * Auto - Aligns the diagram element based on the characteristics of its immediate parent
     * @default 'Auto'
     */
    verticalAlignment?: VerticalAlignment;

    /**
     * Defines the orientation of layout
     * * TopToBottom - Renders the layout from top to bottom
     * * BottomToTop - Renders the layout from bottom to top
     * * LeftToRight - Renders the layout from left to right
     * * RightToLeft - Renders the layout from right to left
     * @default 'TopToBottom'
     */
    orientation?: LayoutOrientation;

    /**
     * Sets how to define the connection direction (first segment direction & last segment direction).
     * * Auto - Defines the first segment direction based on the type of the layout
     * * Orientation - Defines the first segment direction based on the orientation of the layout
     * * Custom - Defines the first segment direction dynamically by the user
     * @default 'Auto'
     */
    connectionDirection?: ConnectionDirection;

    /**
     * Sets whether the segments have to be customized based on the layout or not
     *  * Default - Routes the connectors like a default diagram
     *  * Layout - Routes the connectors based on the type of the layout
     * @default 'Default'
     */
    connectorSegments?: ConnectorSegments;

    /**
     * Defines the type of the layout
     * * None - None of the layouts is applied
     * * HierarchicalTree - Defines the type of the layout as Hierarchical Tree
     * * OrganizationalChart - Defines the type of the layout as Organizational Chart
     * * ComplexHierarchicalTree - Defines the type of the layout as complex HierarchicalTree
     * * RadialTree - Defines the type of the layout as Radial tree
     * @default 'None'
     */
    type?: LayoutType;

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
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @default undefined
     * @deprecated
     */
    getLayoutInfo?: Function | string;

    /**
     * getLayoutInfo is used to configure every subtree of the organizational chart
     */
    layoutInfo?: TreeInfo;

    /**
     * Defines whether an object should be at the left/right of the mind map. Applicable only for the direct children of the root node
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @default undefined
     * @deprecated
     */
    getBranch?: Function | string;

    /**
     * Aligns the layout within the given bounds
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @default undefined
     */
    bounds?: Rect;

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
     * @default true
     */
    enableAnimation?: boolean;

    /**
     * Defines the root of the hierarchical tree layout
     * @default ''
     */
    root?: string;

}