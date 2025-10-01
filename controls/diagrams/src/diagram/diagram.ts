/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable valid-jsdoc */
/* eslint-disable valid-jsdoc */
/* eslint-disable prefer-spread */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsdoc/require-returns */
/* eslint-disable valid-jsdoc */
/* eslint-disable jsdoc/require-param */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable valid-jsdoc */
/* eslint-disable jsdoc/require-returns */
import { Component, Property, Complex, Collection, EventHandler, L10n, Droppable, remove, Ajax, isBlazor, blazorTemplates, Fetch } from '@syncfusion/ej2-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { Browser, ModuleDeclaration, Event, EmitType } from '@syncfusion/ej2-base';
import { INotifyPropertyChanged, updateBlazorTemplate, resetBlazorTemplate } from '@syncfusion/ej2-base';
import { DiagramModel } from './diagram-model';
import { CanvasRenderer } from './rendering/canvas-renderer';
import { SvgRenderer } from './rendering/svg-renderer';
import { DiagramRenderer } from './rendering/renderer';
import { BaseAttributes, IKeyDownType } from './rendering/canvas-interface';
import { PageSettings, ScrollSettings } from './diagram/page-settings';
import { PageSettingsModel, ScrollSettingsModel } from './diagram/page-settings-model';
import { DiagramElement } from './core/elements/diagram-element';
import { ServiceLocator } from './objects/service';
import { IElement, IDataLoadedEventArgs, ISelectionChangeEventArgs, IElementDrawEventArgs, IMouseWheelEventArgs, ISegmentChangeEventArgs, ILoadEventArgs, ILoadedEventArgs, ILayoutUpdatedEventArgs } from './objects/interface/IElement';
import { IClickEventArgs, ScrollValues, FixedUserHandleClickEventArgs } from './objects/interface/IElement';
import { ChangedObject, IBlazorTextEditEventArgs, DiagramEventObject, DiagramEventAnnotation } from './objects/interface/IElement';
import { IBlazorDragLeaveEventArgs } from './objects/interface/IElement';
import { UserHandleEventsArgs } from './objects/interface/IElement';
import { FixedUserHandleEventsArgs } from './objects/interface/IElement';
import { IBlazorDropEventArgs, IBlazorScrollChangeEventArgs, IKeyEventArgs } from './objects/interface/IElement';
import { DiagramEventObjectCollection, IBlazorCollectionChangeEventArgs } from './objects/interface/IElement';
import { ICommandExecuteEventArgs, IBlazorDragEnterEventArgs } from './objects/interface/IElement';
import { ISizeChangeEventArgs, IConnectionChangeEventArgs, IEndChangeEventArgs, IDoubleClickEventArgs } from './objects/interface/IElement';
import { ICollectionChangeEventArgs, IPropertyChangeEventArgs, IDraggingEventArgs, IRotationEventArgs } from './objects/interface/IElement';
import { ISegmentCollectionChangeEventArgs, IBlazorPropertyChangeEventArgs } from './objects/interface/IElement';
import { IDragEnterEventArgs, IDragLeaveEventArgs, IDragOverEventArgs, IDropEventArgs } from './objects/interface/IElement';
import { ITextEditEventArgs, IHistoryChangeArgs, IScrollChangeEventArgs } from './objects/interface/IElement';
import { IMouseEventArgs, IBlazorHistoryChangeArgs } from './objects/interface/IElement';
import { IBlazorCustomHistoryChangeArgs, IImageLoadEventArgs } from './objects/interface/IElement';
import { StackEntryObject, IExpandStateChangeEventArgs } from './objects/interface/IElement';
import { ZoomOptions, IPrintOptions, IExportOptions, IFitOptions, ActiveLabel, IEditSegmentOptions, HierarchyData, NodeData, SpaceLevel, IGraph, ConnectorStyle, MermaidStyle } from './objects/interface/interfaces';
import { View, IDataSource, IFields } from './objects/interface/interfaces';
import { GroupableView } from './core/containers/container';
import { Node, BpmnShape, BpmnAnnotation, SwimLane, Path, DiagramShape, UmlActivityShape, FlowShape, BasicShape, UmlClassMethod, MethodArguments, UmlEnumerationMember, UmlClassAttribute, Lane, Shape, Container, Html, Native } from './objects/node';
import { cloneBlazorObject, cloneSelectedObjects, findObjectIndex, getConnectorArrowType, selectionHasConnector, isLabelFlipped, rotateAfterFlip, getSwimLaneChildren, removeUnnecessaryNodes } from './utility/diagram-util';
import { checkBrowserInfo } from './utility/diagram-util';
import { updateDefaultValues, getCollectionChangeEventArguements, getPoint } from './utility/diagram-util';
import { flipConnector, updatePortEdges, alignElement, setConnectorDefaults, getPreviewSize } from './utility/diagram-util';
import { Segment } from './interaction/scroller';
import { Connector, BezierSegment, StraightSegment } from './objects/connector';
import { ConnectorModel, BpmnFlowModel, OrthogonalSegmentModel, RelationShipModel } from './objects/connector-model';
import { SnapSettings } from './diagram/grid-lines';
import { RulerSettings } from './diagram/ruler-settings';
import { removeRulerElements, updateRuler, getRulerSize } from './ruler/ruler';
import { renderRuler, renderOverlapElement } from './ruler/ruler';
import { RulerSettingsModel } from './diagram/ruler-settings-model';
import { SnapSettingsModel } from './diagram/grid-lines-model';
import { NodeModel, TextModel, BpmnShapeModel, BpmnAnnotationModel, HeaderModel, HtmlModel, UmlClassMethodModel, UmlClassAttributeModel, UmlEnumerationMemberModel, UmlClassModel, UmlClassifierShapeModel, BasicShapeModel, FlowShapeModel, PathModel } from './objects/node-model';
import { UmlActivityShapeModel, SwimLaneModel, LaneModel, PhaseModel } from './objects/node-model';
import { Size } from './primitives/size';
import { Keys, KeyModifiers, DiagramTools, AlignmentMode, AnnotationConstraints, NodeConstraints, ScrollActions, TextWrap, UmlClassChildType, TextAnnotationDirection, ConnectorConstraints, DecoratorShapes, FlipMode, Direction } from './enum/enum';
import { RendererAction, State } from './enum/enum';
import { BlazorAction } from './enum/enum';
import { DiagramConstraints, BridgeDirection, AlignmentOptions, SelectorConstraints, PortVisibility, DiagramEvent } from './enum/enum';
import { DistributeOptions, SizingOptions, RenderingMode, DiagramAction, ThumbsConstraints, NudgeDirection } from './enum/enum';
import { RealAction, ElementAction, FlipDirection, Orientation, PortConstraints, HistoryChangeAction } from './enum/enum';
import { PathElement } from './core/elements/path-element';
import { TextElement } from './core/elements/text-element';
import { updateStyle, removeItem, updateConnector, updateShape, setUMLActivityDefaults, findNodeByName } from './utility/diagram-util';
import { setSwimLaneDefaults } from './utility/diagram-util';
import { checkPortRestriction, serialize, deserialize, updateHyperlink, getObjectType, removeGradient, getChild } from './utility/diagram-util';
import { Rect } from './primitives/rect';
import { getPortShape } from './objects/dictionary/common';
import { PathPortModel, PointPortModel, PortModel } from './objects/port-model';
import { ShapeAnnotationModel, AnnotationModel, PathAnnotationModel } from './objects/annotation-model';
import { ShapeAnnotation, PathAnnotation, Annotation } from './objects/annotation';
import { PointModel } from './primitives/point-model';
import { Canvas } from './core/containers/canvas';
import { GridPanel, ColumnDefinition } from './core/containers/grid';
import { DataSourceModel } from './diagram/data-source-model';
import { DataSource } from './diagram/data-source';
import { LayoutModel } from './layout/layout-base-model';
import { Layout, INode, ILayout } from './layout/layout-base';
import { DataBinding, FlowChartData } from './data-binding/data-binding';
import { Selector, Text } from './objects/node';
import { SelectorModel } from './objects/node-model';
import { DiagramEventHandler } from './interaction/event-handlers';
import { CommandHandler } from './interaction/command-manager';
import { DiagramScroller } from './interaction/scroller';
import { Actions, contains, isSelected } from './interaction/actions';
import { ToolBase } from './interaction/tool';
import { BpmnDiagrams } from './objects/bpmn';
import { DiagramContextMenu } from './objects/context-menu';
import { ConnectorBridging } from './objects/connector-bridging';
import { SpatialSearch } from './interaction/spatial-search/spatial-search';
import { HistoryEntry, History } from './diagram/history';
import { UndoRedo } from './objects/undo-redo';
import { ConnectorEditing } from './interaction/connector-editing';
import { Ruler } from '../ruler/index';
import { BeforeOpenCloseMenuEventArgs, MenuEventArgs } from '@syncfusion/ej2-navigations';
import { setAttributeSvg, setAttributeHtml, measureHtmlText, removeElement, createMeasureElements, getDomIndex, clearDecoratorPathCache } from './utility/dom-util';
import { getDiagramElement, getScrollerWidth, getHTMLLayer, createUserHandleTemplates } from './utility/dom-util';
import { getBackgroundLayer, createHtmlElement, createSvgElement, getNativeLayerSvg, getUserHandleLayer } from './utility/dom-util';
import { getPortLayerSvg, getDiagramLayerSvg, applyStyleAgainstCsp } from './utility/dom-util';
import { getAdornerLayerSvg, getSelectorElement, getGridLayerSvg, getBackgroundLayerSvg } from './utility/dom-util';
import { CommandManager, ContextMenuSettings } from './diagram/keyboard-commands';
import { CommandManagerModel, CommandModel, ContextMenuSettingsModel } from './diagram/keyboard-commands-model';
import { canDelete, canInConnect, canOutConnect, canRotate, canVitualize, canDrawThumbs, canBridge } from './utility/constraints-util';
import { canPortInConnect, canPortOutConnect } from './utility/constraints-util';
import { canResize, canSingleSelect, canZoomPan, canZoomTextEdit, canMultiSelect } from './utility/constraints-util';
import { canDragSourceEnd, canDragTargetEnd, canDragSegmentThumb, enableReadOnly, canMove } from './utility/constraints-util';
import { findAnnotation, arrangeChild, getInOutConnectPorts, removeChildNodes, canMeasureDecoratorPath } from './utility/diagram-util';
import { randomId, cloneObject, extendObject, getFunction, getBounds } from './utility/base-util';
import { Snapping } from './objects/snapping';
import { DiagramTooltipModel } from './objects/tooltip-model';
import { TextStyleModel, ShadowModel, StopModel } from './core/appearance-model';
import { TransformFactor } from './interaction/scroller';
import { RadialTree } from './layout/radial-tree';
import { HierarchicalTree } from './layout/hierarchical-tree';
import { ComplexHierarchicalTree } from './layout/complex-hierarchical-tree';
import { MindMap } from './layout/mind-map';
import { DiagramTooltip, initTooltip } from './objects/tooltip';
import { Tooltip } from '@syncfusion/ej2-popups';
import { PrintAndExport } from './print-settings';
import { Port, PointPort, PathPort } from './objects/port';
import { SymmetricLayout, IGraphObject } from './layout/symmetrical-layout';
import { LayoutAnimation } from './objects/layout-animation';
import { canShadow } from './utility/constraints-util';
import { Layer } from './diagram/layer';
import { LayerModel } from './diagram/layer-model';
import { DiagramNativeElement } from './core/elements/native-element';
import { DiagramHtmlElement } from './core/elements/html-element';
import { IconShapeModel } from './objects/icon-model';
import { canAllowDrop } from './utility/constraints-util';
import { checkParentAsContainer, addChildToContainer, updateLaneBoundsAfterAddChild } from './interaction/container-interaction';
import { DataManager } from '@syncfusion/ej2-data';
import { getConnectors, updateConnectorsProperties, phaseDefine, findLane } from './utility/swim-lane-util';
import { swimLaneMeasureAndArrange } from './utility/swim-lane-util';
import { arrangeChildNodesInSwimLane, updateHeaderMaxWidth, updatePhaseMaxWidth } from './utility/swim-lane-util';
import { addLane, addPhase } from './utility/swim-lane-util';
import { ContextMenuItemModel } from './../diagram/objects/interface/interfaces';
import { SerializationSettingsModel } from './diagram/serialization-settings-model';
import { SerializationSettings } from './diagram/serialization-settings';
import { removeSwimLane, removeLane, removePhase, removeLaneChildNode } from './utility/swim-lane-util';
import { RowDefinition } from './core/containers/grid';
import { CustomCursorAction } from './diagram/custom-cursor';
import { CustomCursorActionModel } from './diagram/custom-cursor-model';
import { SymbolSizeModel } from './../diagram/objects/preview-model';
import { LineRouting } from './interaction/line-routing';
import { AvoidLineOverlapping } from './interaction/line-overlapping';
import { LineDistribution } from './interaction/line-distribution';
import { DiagramSettingsModel } from '../diagram/diagram-settings-model';
import { DiagramSettings } from '../diagram/diagram-settings';
import { StackPanel } from './core/containers/stack-panel';
import { UserHandleModel } from './interaction/selector-model';
import { ConnectorFixedUserHandle, NodeFixedUserHandle } from './objects/fixed-user-handle';
import { NodeFixedUserHandleModel, ConnectorFixedUserHandleModel, FixedUserHandleModel } from './objects/fixed-user-handle-model';
import { LinearGradient, RadialGradient } from './core/appearance';
import { SegmentThumbShapes } from './enum/enum';
import { Point } from './primitives/point';
import { Ej1Serialization } from './load-utility/modelProperties';
import { NodeProperties } from './load-utility/nodeProperties';
import { ConnectorProperties } from './load-utility/connectorProperties';
import { PortProperties } from './load-utility/portProperties';
import { LabelProperties } from './load-utility/labelProperties';
import { getClassAttributesChild, getClassMembersChild, getClassNodesChild } from './utility/uml-util';
import { getIntersectionPoints, getPortDirection } from './utility/connector';
import { FlowchartLayout } from './layout/flowChart/flow-chart-layout';
import { dragContainerChild, updateContainerDocks, setSizeForContainer, removeChildFromContainer, updateChildWrapper, addContainerChild, removeChild, dropContainerChild } from './utility/container-util';
import { Overview } from '../overview';
import { identityMatrix, rotateMatrix, transformPointByMatrix, scaleMatrix, Matrix } from './primitives/matrix';
import { UmlSequenceDiagram } from './diagram/sequence-diagram';
import { UmlSequenceDiagramModel } from './diagram/sequence-diagram-model';
/**
 * Represents the Diagram control
 * ```html
 * <div id='diagram'/>
 * ```
 * ```typescript
 * let diagram: Diagram = new Diagram({
 * width:'1000px', height:'500px' });
 * diagram.appendTo('#diagram');
 * ```
 */
export class Diagram extends Component<HTMLElement> implements INotifyPropertyChanged {

    //Module Declarations for diagram
    /**
     * `organizationalChartModule` is used to arrange the nodes in a organizational chart like struture
     *
     * @private
     */
    public organizationalChartModule: HierarchicalTree;

    /**
     * `mindMapChartModule` is used to arrange the nodes in a mind map like structure
     *
     */
    public mindMapChartModule: MindMap;

    /**
     * `radialTreeModule` is used to arrange the nodes in a radial tree like structure
     *
     * @ignoreapilink
     */
    public radialTreeModule: RadialTree;

    /**
     * `complexHierarchicalTreeModule` is used to arrange the nodes in a hierarchical tree like structure
     *
     * @private
     */
    public complexHierarchicalTreeModule: ComplexHierarchicalTree;

    /**
     * `dataBindingModule` is used to populate nodes from given data source
     *
     * @private
     */
    public dataBindingModule: DataBinding;

    /**
     * `snappingModule` is used to Snap the objects
     *
     * @private
     */
    public snappingModule: Snapping;
    /**
     * `ej1SerializationModule` is used to load ej1 json
     *
     * @private
     */

    public ej1SerializationModule: Ej1Serialization;
    /**
     * `printandExportModule` is used to print or export the objects
     *
     * @private
     */
    public printandExportModule: PrintAndExport;

    /**
     * `bpmnModule` is used to add built-in BPMN Shapes to diagrams
     *
     * @private
     */
    public bpmnModule: BpmnDiagrams;

    /**
     * 'symmetricalLayoutModule' is used to render layout in symmetrical method
     *
     * @private
     */
    public symmetricalLayoutModule: SymmetricLayout;

    /**
     * 'flowchartLayoutModule' is used to render flow chart layout
     *
     * @private
     */
    public flowchartLayoutModule: FlowchartLayout;

    /**
     * `bridgingModule` is used to add bridges to connectors
     *
     * @private
     */
    public bridgingModule: ConnectorBridging;

    /**
     * `undoRedoModule` is used to revert and restore the changes
     *
     * @private
     */
    public undoRedoModule: UndoRedo;

    /**
     * `layoutAnimateModule` is used to revert and restore the changes
     *
     * @private
     */
    public layoutAnimateModule: LayoutAnimation;

    /**
     * 'contextMenuModule' is used to manipulate context menu
     *
     * @private
     */
    public contextMenuModule: DiagramContextMenu;

    /**
     * `connectorEditingToolModule` is used to edit the segments for connector
     *
     * @private
     */
    public connectorEditingToolModule: ConnectorEditing;

    /**
     * `lineRoutingModule` is used to connect the node's without overlapping
     *
     * @private
     */
    public lineRoutingModule: LineRouting;

    /**
     * `avoidLineOverlappingModule` is used to connect the connector's without overlapping
     *
     * @private
     */
    public avoidLineOverlappingModule: AvoidLineOverlapping;

    /**
     * `lineDistributionModule` is used to connect the node's without overlapping in automatic layout
     *
     */
    public lineDistributionModule: LineDistribution;

    /**
     * Defines the width of the diagram model.
     * ```html
     * <div id='diagram'/>
     * ```
     * ```typescript
     * let diagram: Diagram = new Diagram({
     * width:'1000px', height:'500px' });
     * diagram.appendTo('#diagram');
     * ```
     *
     * @default '100%'
     */
    @Property('100%')
    public width: string | number;

    /**
     * Split the connector, when the node is dropped onto it and establish connection with that dropped node.
     *
     * @default false
     */
    @Property(false)
    public enableConnectorSplit: boolean;

    /**
     * Defines the diagram rendering mode.
     * * SVG - Renders the diagram objects as SVG elements
     * * Canvas - Renders the diagram in a canvas
     *
     * @default 'SVG'
     */
    @Property('SVG')
    public mode: RenderingMode;

    /**
     * Defines the height of the diagram model.
     *
     * @default '100%'
     */
    @Property('100%')
    public height: string | number;

    /**
     * Defines the segmentThumbShape
     *
     * @default 'Circle'
     */
    @Property('Circle')
    public segmentThumbShape: SegmentThumbShapes;

    /**
     * Specifies the size of the segment thumb. When not set, it defaults to matching the underlying path data.
     *
     * @default 10
     */
    @Property(10)
    public segmentThumbSize: number;

    /**
     * Defines type of menu that appears when you perform right-click operation
     * An object to customize the context menu of diagram
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     * let diagram: Diagram = new Diagram({
     * ...
     *   contextMenuSettings: { show: true },
     * ...
     * });
     * diagram.appendTo('#diagram');
     * ```
     *
     */
    @Complex<ContextMenuSettingsModel>({}, ContextMenuSettings)
    public contextMenuSettings: ContextMenuSettingsModel;

    /**
     * Constraints are used to enable/disable certain behaviors of the diagram.
     * * None - Disables DiagramConstraints constraints
     * * Bridging - Enables/Disables Bridging support for connector
     * * UndoRedo - Enables/Disables the Undo/Redo support
     * * Tooltip - Enables/Disables Tooltip support
     * * UserInteraction - Enables/Disables editing diagram interactively
     * * ApiUpdate - Enables/Disables editing diagram through code
     * * PageEditable - Enables/Disables editing diagrams both interactively and through code
     * * Zoom - Enables/Disables Zoom support for the diagram
     * * PanX - Enables/Disable PanX support for the diagram
     * * PanY - Enables/Disable PanY support for the diagram
     * * Pan - Enables/Disable Pan support the diagram
     *
     * @default 'Default'
     * @aspNumberEnum
     */
    @Property(DiagramConstraints.Default)
    public constraints: DiagramConstraints;

    /**
     * Defines the precedence of the interactive tools. They are,
     * * None - Disables selection, zooming and drawing tools
     * * SingleSelect - Enables/Disables single select support for the diagram
     * * MultipleSelect - Enables/Disable MultipleSelect select support for the diagram
     * * ZoomPan - Enables/Disable ZoomPan support for the diagram
     * * DrawOnce - Enables/Disable ContinuousDraw support for the diagram
     * * ContinuousDraw - Enables/Disable ContinuousDraw support for the diagram
     *
     * @default 'Default'
     * @aspNumberEnum
     * @deprecated
     */

    @Property(DiagramTools.Default)
    public tool: DiagramTools;

    /**
     * Defines the direction of the bridge that is inserted when the segments are intersected
     * * Top - Defines the direction of the bridge as Top
     * * Bottom - Defines the direction of the bridge as Bottom
     * * Left - Sets the bridge direction as left
     * * Right - Sets the bridge direction as right
     *
     * @default top
     */
    @Property('Top')
    public bridgeDirection: BridgeDirection;

    /**
     * Defines the background color of the diagram
     *
     * @default 'transparent'
     */
    @Property('transparent')
    public backgroundColor: string;

    /**
     * Defines the gridlines and defines how and when the objects have to be snapped
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     * let horizontalGridlines: GridlinesModel = {lineColor: 'black', lineDashArray: '1,1' };
     * let verticalGridlines: GridlinesModel = {lineColor: 'black', lineDashArray: '1,1'};
     * let diagram: Diagram = new Diagram({
     * ...
     * snapSettings: { horizontalGridlines, verticalGridlines, constraints: SnapConstraints.ShowLines,
     * snapObjectDistance: 5, snapAngle: 5 },
     * ...
     * });
     * diagram.appendTo('#diagram');
     * ```
     *
     * @default {}
     */
    @Complex<SnapSettingsModel>({}, SnapSettings)
    public snapSettings: SnapSettingsModel;

    /**
     * Defines the properties of both horizontal and vertical guides/rulers to measure the diagram area.
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     * let arrange: Function = (args: IArrangeTickOptions) => {
     * if (args.tickInterval % 10 == 0) {
     * args.tickLength = 25;
     * }
     * }
     * let diagram: Diagram = new Diagram({
     * ...
     * rulerSettings: { showRulers: true,
     * horizontalRuler: { segmentWidth: 50, orientation: 'Horizontal', interval: 10,  arrangeTick: arrange },
     * verticalRuler: {segmentWidth: 200,interval: 20, thickness: 20,
     * tickAlignment: 'LeftOrTop', segmentWidth: 50, markerColor: 'red' }
     * },
     * ...
     * });
     * diagram.appendTo('#diagram');
     * ```
     *
     * @default {}
     */
    @Complex<RulerSettingsModel>({}, RulerSettings)
    public rulerSettings: RulerSettingsModel;

    /**
     * Page settings enable to customize the appearance, width, and height of the Diagram page.
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     * let diagram: Diagram = new Diagram({
     * ...
     * pageSettings: {  width: 800, height: 600, orientation: 'Landscape',
     * background: { color: 'blue' }, boundaryConstraints: 'Infinity'},
     * ...
     * });
     * diagram.appendTo('#diagram');
     * ```
     *
     * @default {}
     */
    @Complex<PageSettingsModel>({}, PageSettings)
    public pageSettings: PageSettingsModel;

    /**
     * Defines the serialization settings of diagram.
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     * let diagram: Diagram = new Diagram({
     * ...
     * serializationSettings: { preventDefaults: true },
     * ...
     * });
     * diagram.appendTo('#diagram');
     * ```
     *
     * @default {}
     */
    @Complex<SerializationSettingsModel>({}, SerializationSettings)
    public serializationSettings: SerializationSettingsModel;

    /**
     * Defines the collection of nodes
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
     * let diagram: Diagram = new Diagram({
     * ...
     * nodes: nodes,
     * ...
     * });
     * diagram.appendTo('#diagram');
     * ```
     *
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Collection<NodeModel>([], Node)
    public nodes: NodeModel[];
    /**
     * Defines the object to be drawn using drawing tool
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     * let diagram: Diagram = new Diagram({
     * ...
     * drawingObject : {id: 'connector3', type: 'Straight'},
     * ...
     * });
     * diagram.appendTo('#diagram');
     * ```
     *
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Property()
    public drawingObject: NodeModel | ConnectorModel;

    /**
     * Defines a collection of objects, used to create link between two points, nodes or ports to represent the relationships between them
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     *       let connectors: ConnectorModel[] = [{
     *           id: 'connector1',
     *           type: 'Straight',
     *           sourcePoint: { x: 100, y: 300 },
     *           targetPoint: { x: 200, y: 400 },
     *       }];
     * let diagram: Diagram = new Diagram({
     * ...
     *       connectors: connectors,
     * ...
     * });
     * diagram.appendTo('#diagram');
     * ```
     *
     * @default []
     */
    @Collection<ConnectorModel>([], Connector)
    public connectors: ConnectorModel[];

    /**
     * Defines the basic elements for the diagram
     *
     * @default []
     * @hidden
     */
    @Property([])
    public basicElements: DiagramElement[];

    /**
     * Defines the tooltip that should be shown when the mouse hovers over a node or connector
     * An object that defines the description, appearance and alignments of tooltip
     *
     * @default {}
     */
    @Complex<DiagramTooltipModel>({}, DiagramTooltip)
    public tooltip: DiagramTooltipModel;

    /**
     * Configures the data source that is to be bound with diagram
     *
     * @default {}
     */
    @Complex<DataSourceModel>({}, DataSource)
    public dataSourceSettings: DataSourceModel;

    /**
     * Allows the user to save custom information/data about diagram
     *
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Property()
    public addInfo: Object;

    /**
     * Customizes the undo redo functionality
     *
     * @default undefined
     */
    @Property()
    public historyManager: History;

    /**
     * Customizes the node template
     *
     * @default undefined
     * @aspType string
     */
    @Property()
    public nodeTemplate: string | Function;

    /**
     * Customizes the annotation template
     *
     * @default undefined
     * @aspType string
     */
    @Property()
    public annotationTemplate: string | Function;

    /**
     * This property represents the template content of a user handle. The user can define any HTML element as a template.
     *
     * @default undefined
     * @aspType string
     */
    @Property()
    public userHandleTemplate: string | Function;

    /**
     * This property allows us to define HTML elements for fixed user handle
     *
     * @default undefined
     * @aspType string
     */
    @Property()
    public fixedUserHandleTemplate: string | Function;

    /**
     * Helps to return the default properties of node
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     * let nodes: NodeModel[] = [{
     *           id: 'node1', height: 100, offsetX: 100, offsetY: 100,
     *           annotations: [{ content: 'Default Shape' }]
     *       },
     *       {
     *           id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 100,
     *           shape: {
     *               type: 'Basic', shape: 'Ellipse'
     *           },
     *           annotations: [{ content: 'Ellipse' }]
     *       }
     *       ];
     * let diagram: Diagram = new Diagram({
     * ...
     * nodes: nodes,
     * getNodeDefaults: (node: NodeModel) => {
     *   let obj: NodeModel = {};
     *   if (obj.width === undefined) {
     *       obj.width = 145;
     *   }
     *   obj.style = { fill: '#357BD2', strokeColor: 'white' };
     *   obj.annotations = [{ style: { color: 'white', fill: 'transparent' } }];
     *   return obj;
     *    },
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
    public getNodeDefaults: Function | string;

    /**
     * Helps to assign the default properties of nodes
     */
    @Property()
    public nodeDefaults: NodeModel;
    /**
     * Helps to return the default properties of connector
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     *       let connectors: ConnectorModel[] = [{
     *           id: 'connector1',
     *           sourcePoint: { x: 100, y: 300 },
     *           targetPoint: { x: 200, y: 400 },
     *       }];
     * let diagram: Diagram = new Diagram({
     * ...
     *   connectors: connectors,
     *   getConnectorDefaults: (connector: ConnectorModel, diagram: Diagram) => {
     *   let connObj: ConnectorModel = {};
     *   connObj.targetDecorator ={ shape :'None' };
     *   connObj.type = 'Orthogonal';
     *   return connObj;
     *   },
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
    public getConnectorDefaults: Function | string;

    /**
     * Helps to assign the default properties of connector
     */
    @Property()
    public connectorDefaults: ConnectorModel;
    /**
     * setNodeTemplate helps to customize the content of a node
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     * let getTextElement: Function = (text: string) => {
     * let textElement: TextElement = new TextElement();
     * textElement.width = 50;
     * textElement.height = 20;
     * textElement.content = text;
     * return textElement;
     * };
     * let nodes: NodeModel[] = [{
     *           id: 'node1', height: 100, offsetX: 100, offsetY: 100,
     *           annotations: [{ content: 'Default Shape' }]
     *       },
     *       {
     *           id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 100
     *       }
     *       ];
     * let diagram: Diagram = new Diagram({
     * ...
     * nodes: nodes,
     * setNodeTemplate : setNodeTemplate,
     * ...
     * });
     * diagram.appendTo('#diagram');
     * ```
     * function setNodeTemplate() {
     * setNodeTemplate: (obj: NodeModel, diagram: Diagram): StackPanel => {
     *   if (obj.id === 'node2') {
     *       let table: StackPanel = new StackPanel();
     *       table.orientation = 'Horizontal';
     *       let column1: StackPanel = new StackPanel();
     *       column1.children = [];
     *       column1.children.push(getTextElement('Column1'));
     *       addRows(column1);
     *       let column2: StackPanel = new StackPanel();
     *       column2.children = [];
     *       column2.children.push(getTextElement('Column2'));
     *       addRows(column2);
     *       table.children = [column1, column2];
     *       return table;
     *   }
     *   return null;
     *   }
     * ...
     * }
     *
     * @aspDefaultValueIgnore
     * @default undefined
     * @deprecated
     */
    @Property()
    public setNodeTemplate: Function | string;

    /**
     * Allows to set accessibility content for diagram objects
     *
     * @aspDefaultValueIgnore
     * @default undefined
     */
    /**
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     * let connector1: ConnectorModel = {
     *          id: 'connector1', type: 'Straight',
     *          sourcePoint: { x: 100, y: 100 },targetPoint: { x: 200, y: 200 },
     *          annotations: [{ 'content': 'label', 'offset': 0, 'alignment': 'Center' }]
     *       };
     * let connector2: ConnectorModel = {
     *           id: 'connector2', type: 'Straight',
     *           sourcePoint: { x: 400, y: 400 }, targetPoint: { x: 600, y: 600 },
     *       };
     * let diagram: Diagram;
     * diagram = new Diagram({
     * width: 1000, height: 1000,
     * connectors: [connector1, connector2],
     * snapSettings: { constraints: SnapConstraints.ShowLines },
     * getDescription: getAccessibility
     * });
     * diagram.appendTo('#diagram');
     * function getAccessibility(obj: ConnectorModel, diagram: Diagram): string {
     * let value: string;
     * if (obj instanceof Connector) {
     * value = 'clicked on Connector';
     * } else if (obj instanceof TextElement) {
     * value = 'clicked on annotation';
     * }
     * else if (obj instanceof Decorator) {
     * value = 'clicked on Decorator';
     * }
     * else { value = undefined; }
     * return value;
     * }
     * ```
     *
     * @deprecated
     */
    @Property()
    public getDescription: Function | string;

    /**
     * Allows to get the custom properties that have to be serialized
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
     *           shape: { type: 'Basic', shape: 'Ellipse' },
     *           annotations: [{ content: 'Path Element' }]
     *       }
     *       ];
     *       let connectors: ConnectorModel[] = [{
     *           id: 'connector1', type: 'Straight',
     *           sourcePoint: { x: 100, y: 300 }, targetPoint: { x: 200, y: 400 },
     *       }];
     * let diagram: Diagram = new Diagram({
     * ...
     * connectors: connectors, nodes: nodes,
     * getCustomProperty: (key: string) => {
     * if (key === 'nodes') {
     * return ['description'];
     * }
     *         return null;
     * }
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
    public getCustomProperty: Function | string;
    /**
     * Allows the user to set custom tool that corresponds to the given action
     *
     * @aspDefaultValueIgnore
     * @default undefined
     */
    /**
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     * function getTool(action: string): ToolBase {
     * let tool: ToolBase;
     * if (action === 'userHandle1') {
     * tool = new CloneTool(diagram.commandHandler, true);
     * }
     * return tool;
     * }
     * class CloneTool extends ToolBase {
     * public mouseDown(args: MouseEventArgs): void {
     * super.mouseDown(args);
     * diagram.copy();
     * diagram.paste();
     * }
     * }
     * let nodes: NodeModel[] = [{
     *           id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,
     *       },
     *       {
     *           id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 100,
     *           shape: { type: 'Basic', shape: 'Ellipse' },
     *       }];
     *       let connectors: ConnectorModel[] = [{
     *           id: 'connector1', type: 'Straight',
     *           sourcePoint: { x: 100, y: 300 }, targetPoint: { x: 200, y: 400 },
     *       }];
     *      let handles: UserHandleModel[] = [
     *          { name: 'handle', margin: { top: 0, bottom: 0, left: 0, right: 0 }, offset: 0,
     *            pathData: 'M 376.892,225.284L 371.279,211.95L 376.892,198.617L 350.225,211.95L 376.892,225.284 Z',
     *            side: 'Top', horizontalAlignment: 'Center', verticalAlignment: 'Center',
     *            pathColor: 'yellow' }];
     * let diagram: Diagram = new Diagram({
     * ...
     *     connectors: connectors, nodes: nodes,
     *     selectedItems: { constraints: SelectorConstraints.All, userHandles: handles },
     *     getCustomTool: getTool
     * ...
     * });
     * diagram.appendTo('#diagram');
     * ```
     *
     * @deprecated
     */
    @Property()
    public getCustomTool: Function | string;

    /**
     * Allows the user to set custom cursor that corresponds to the given action
     *
     * @aspDefaultValueIgnore
     * @default undefined
     */
    /**
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     * function getCursor(action: string, active: boolean): string {
     * let cursor: string;
     * if (active && action === 'Drag') {
     * cursor = '-webkit-grabbing';
     * } else if (action === 'Drag') {
     * cursor = '-webkit-grab'
     * }
     * return cursor;
     * }
     * let nodes: NodeModel[] = [{
     *           id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,
     *       },
     *       {
     *           id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 100,
     *           shape: { type: 'Basic', shape: 'Ellipse' },
     *       }];
     * let handle: UserHandleModel[] = [
     * { name: 'handle', margin: { top: 0, bottom: 0, left: 0, right: 0 }, offset: 0,
     * pathData: 'M 376.892,225.284L 371.279,211.95L 376.892,198.617L 350.225,211.95L 376.892,225.284 Z',
     * side: 'Top', horizontalAlignment: 'Center', verticalAlignment: 'Center',
     * pathColor: 'yellow' }];
     * let diagram: Diagram = new Diagram({
     * ...
     *     nodes: nodes,
     *     selectedItems: { constraints: SelectorConstraints.All, userHandles: handle },
     *     getCustomCursor: getCursor
     * ...
     * });
     * diagram.appendTo('#diagram');
     * ```
     *
     * @deprecated
     */
    @Property()
    public getCustomCursor: Function | string;

    /**
     * A collection of JSON objects where each object represents a custom cursor action. Layer is a named category of diagram shapes.
     *
     * @default []
     */
    @Collection<CustomCursorActionModel>([], CustomCursorAction)
    public customCursor: CustomCursorActionModel[];


    /**
     * Helps to set the undo and redo node selection
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     *       let connectors: ConnectorModel[] = [{
     *           id: 'connector1',
     *           sourcePoint: { x: 100, y: 300 },
     *           targetPoint: { x: 200, y: 400 },
     *       }];
     * let diagram: Diagram = new Diagram({
     * ...
     *   connectors: connectors,
     *   updateSelection: (object: ConnectorModel | NodeModel, diagram: Diagram) => {
     *   let objectCollection = [];
     *   objectCollection.push(obejct);
     *   diagram.select(objectCollection);
     *   },
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
    public updateSelection: Function | string;

    /**
     * Represents the diagram settings
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     * let diagram: Diagram = new Diagram({
     * ...
     * diagramSettings: { inversedAlignment: true  }
     * ...
     * });
     * diagram.appendTo('#diagram');
     * ```
     *
     * @default {}
     */
    @Complex<DiagramSettingsModel>({}, DiagramSettings)
    public diagramSettings: DiagramSettingsModel;

    /** @private */
    public version: number = 17.1;

    /**
     * Defines the collection of selected items, size and position of the selector
     *
     * @default {}
     */
    @Complex<SelectorModel>({}, Selector)
    public selectedItems: SelectorModel;

    /**
     * Defines the current zoom value, zoom factor, scroll status and view port size of the diagram
     *
     * @default {}
     */
    @Complex<ScrollSettingsModel>({}, ScrollSettings)
    public scrollSettings: ScrollSettingsModel;

    /**
     * Layout is used to auto-arrange the nodes in the Diagram area
     *
     * @default {}
     */
    @Complex<LayoutModel>({}, Layout)
    public layout: LayoutModel;

    /**
     * Defines the model for the diagram.
     *
     * ```html
     * <div id='diagram'></div>
     * ```
     *
     * ```typescript
     * const model: UmlSequenceDiagramModel = {
     *     participants: [
     *         {
     *             id: 'User', content: 'User', width: 100, height: 50,
     *             showDestructionMarker: true,
     *             isActor: true,
     *             activationBoxes: [
     *                 { id: 'act1', startMessageID: 'MSG1', endMessageID: 'MSG3' }
     *             ]
     *         },
     *         {
     *             id: 'Server', content: 'Server', width: 100, height: 50,
     *             showDestructionMarker: true,
     *             isActor: false,
     *             activationBoxes: [
     *                 { id: 'act2', startMessageID: 'MSG1', endMessageID: 'MSG3' }
     *             ]
     *         }
     *     ],
     *     messages: [
     *         { id: 'MSG1', content: 'User sends request', fromParticipantID: 'User', toParticipantID: 'Server' },
     *         { id: 'MSG2', content: 'Processing', fromParticipantID: 'Server', toParticipantID: 'Server' },
     *         { id: 'MSG3', content: 'Server sends response', fromParticipantID: 'Server', toParticipantID: 'User' }
     *     ],
     *     fragments: [
     *         {
     *             id: 'frag1', type: 'Optional',
     *             conditions: [
     *                 { content: 'Interactions', messageIds: ['MSG1', 'MSG2', 'MSG3'] }
     *             ]
     *         }
     *     ]
     * };
     *
     * const diagram: Diagram = new Diagram({
     *     // Other properties
     *     model: model
     * });
     *
     * diagram.appendTo('#diagram');
     * ```
     *
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Complex<UmlSequenceDiagramModel>(undefined, UmlSequenceDiagram)
    public model: UmlSequenceDiagramModel;

    /**
     * Defines a set of custom commands and binds them with a set of desired key gestures
     *
     * @default {}
     */
    @Complex<CommandManagerModel>({}, CommandManager)
    public commandManager: CommandManagerModel;

    /**
     * Triggers after diagram is populated from the external data source
     *
     * @event
     * @deprecated
     */
    @Event()
    public dataLoaded: EmitType<IDataLoadedEventArgs>;

    /**
     * Triggers when a symbol is dragged into diagram from symbol palette
     *
     * @event
     */
    @Event()
    public dragEnter: EmitType<IDragEnterEventArgs>;

    /**
     * Triggers when a symbol is dragged outside of the diagram.
     *
     * @event
     */
    @Event()
    public dragLeave: EmitType<IDragLeaveEventArgs>;

    /**
     * Triggers when a symbol is dragged over diagram
     *
     * @event
     * @deprecated
     */
    @Event()
    public dragOver: EmitType<IDragOverEventArgs>;

    /**
     * Triggers when a node, connector or diagram is clicked
     *
     * @event
     */
    @Event()
    public click: EmitType<IClickEventArgs>;

    /**
     * Triggers when a change is reverted or restored(undo/redo)
     *
     * @event
     */
    @Event()
    public historyChange: EmitType<IHistoryChangeArgs>;

    /**
     * Triggers when a custom entry change is reverted or restored(undo/redo)
     *
     * @event
     */
    @Event()
    public historyStateChange: EmitType<IBlazorCustomHistoryChangeArgs>;

    /**
     * Triggers when a node, connector or diagram model is clicked twice
     *
     * @event
     */
    @Event()
    public doubleClick: EmitType<IDoubleClickEventArgs>;

    /**
     * Triggers when editor got focus at the time of node’s label or text node editing.
     *
     * @event
     */
    @Event()
    public textEdit: EmitType<ITextEditEventArgs>;

    /**
     * Triggers when the diagram is zoomed or panned
     *
     * @event
     * @deprecated
     */
    @Event()
    public scrollChange: EmitType<IScrollChangeEventArgs>;

    /**
     * Event triggers whenever the user rotate the mouse wheel either upwards or downwards
     *
     * @event
     */
    @Event()
    public mouseWheel: EmitType<IMouseWheelEventArgs>;

    /**
     * Triggers when the selection is changed in diagram
     *
     * @event
     */
    @Event()
    public selectionChange: EmitType<ISelectionChangeEventArgs>;

    /**
     * Triggers when a node is resized
     *
     * @event
     */
    @Event()
    public sizeChange: EmitType<ISizeChangeEventArgs>;

    /**
     * Triggers when the connection is changed
     *
     * @event
     */
    @Event()
    public connectionChange: EmitType<IConnectionChangeEventArgs>;

    /**
     * Triggers when the connector's source point is changed
     *
     * @event
     * @deprecated
     */
    @Event()
    public sourcePointChange: EmitType<IEndChangeEventArgs>;

    /**
     * Triggers when the connector's target point is changed
     *
     * @event
     * @deprecated
     */
    @Event()
    public targetPointChange: EmitType<IEndChangeEventArgs>;

    /**
     * Triggers once the node or connector property changed.
     *
     * @event
     */
    @Event()
    public propertyChange: EmitType<IPropertyChangeEventArgs>;

    /**
     * Triggers while dragging the elements in diagram
     *
     * @event
     */
    @Event()
    public positionChange: EmitType<IDraggingEventArgs>;

    /**
     * Triggers when a user releases a key.
     *
     * @event
     */
    @Event()
    public keyUp: EmitType<IKeyEventArgs>;

    /**
     * Triggers when a user is pressing a key.
     *
     * @event
     */
    @Event()
    public keyDown: EmitType<IKeyEventArgs>;

    /**
     * Triggers after animation is completed for the diagram elements.
     *
     * @event
     * @deprecated
     */
    @Event()
    public animationComplete: EmitType<Object>;

    /**
     * Triggers when the diagram elements are rotated
     *
     * @event
     */
    @Event()
    public rotateChange: EmitType<IRotationEventArgs>;


    /**
     * Triggers when a node/connector is added/removed to/from the diagram.
     *
     * @deprecated
     * @event
     */
    @Event()
    public collectionChange: EmitType<ICollectionChangeEventArgs>;

    /**
     * Triggers when a node/connector fixedUserHandle is clicked in the diagram.
     *
     * @event
     */
    @Event()
    public fixedUserHandleClick: EmitType<FixedUserHandleClickEventArgs>;

    /**
     * Triggers when a mouseDown on the user handle.
     *
     * @event
     */
    @Event()
    public onUserHandleMouseDown: EmitType<UserHandleEventsArgs>;

    /**
     * Triggers when a mouseUp on the user handle.
     *
     * @event
     */
    @Event()
    public onUserHandleMouseUp: EmitType<UserHandleEventsArgs>;

    /**
     * Triggers when a mouseEnter on the user handle.
     *
     * @event
     */
    @Event()
    public onUserHandleMouseEnter: EmitType<UserHandleEventsArgs>;

    /**
     * Triggers when a mouseLeave on the user handle.
     *
     * @event
     */
    @Event()
    public onUserHandleMouseLeave: EmitType<UserHandleEventsArgs>;

    /**
     * Triggers when a mouseDown on the fixed user handle.
     *
     * @event
     */
    @Event()
    public onFixedUserHandleMouseDown: EmitType<FixedUserHandleEventsArgs>;

    /**
     * Triggers when a mouseUp on the fixed user handle.
     *
     * @event
     */
    @Event()
    public onFixedUserHandleMouseUp: EmitType<FixedUserHandleEventsArgs>;

    /**
     * Triggers when a mouseEnter on the fixed user handle.
     *
     * @event
     */
    @Event()
    public onFixedUserHandleMouseEnter: EmitType<FixedUserHandleEventsArgs>;

    /**
     * Triggers when a mouseLeave on the fixed user handle.
     *
     * @event
     */
    @Event()
    public onFixedUserHandleMouseLeave: EmitType<FixedUserHandleEventsArgs>;

    /**
     * Triggers when a segment is added/removed to/from the connector.
     *
     * @event
     * @deprecated
     */
    @Event()
    public segmentCollectionChange: EmitType<ISegmentCollectionChangeEventArgs>;

    /**
     * Triggers when the image node is loaded.
     *
     * @deprecated
     * @event
     */
    @Event()
    public onImageLoad: EmitType<IImageLoadEventArgs>;

    /**
     * Triggers when the state of the expand and collapse icon change for a node.
     *
     * @deprecated
     * @event
     */
    @Event()
    public expandStateChange: EmitType<IExpandStateChangeEventArgs>;

    /**
     * This event triggers before the diagram load.
     *
     * @event
     */
    @Event()
    public load: EmitType<ILoadEventArgs>;

    /**
     * Triggered when the diagram is rendered completely.
     *
     * @event
     */
    @Event()
    public created: EmitType<Object>;

    /**
     * Triggered when mouse enters a node/connector.
     *
     * @event
     */
    @Event()
    public mouseEnter: EmitType<IMouseEventArgs>;

    /**
     * Triggered when mouse leaves node/connector.
     *
     * @event
     */
    @Event()
    public mouseLeave: EmitType<IMouseEventArgs>;

    /**
     * Triggered when mouse hovers a node/connector.
     *
     * @event
     * @deprecated
     */
    @Event()
    public mouseOver: EmitType<IMouseEventArgs>;

    /**
     *
     * Triggered when an element is drawn using drawing Tool
     *  @event
     */
    @Event()
    public elementDraw: EmitType<IElementDrawEventArgs>;

    /**
     * Triggers before opening the context menu
     *
     * @event
     */
    @Event()
    public contextMenuOpen: EmitType<BeforeOpenCloseMenuEventArgs>;

    /**
     * Triggers before rendering the context menu item
     *
     * @event
     * @deprecated
     */
    @Event()
    public contextMenuBeforeItemRender: EmitType<MenuEventArgs>;

    /**
     * Triggers when a context menu item is clicked
     *
     * @event
     */
    @Event()
    public contextMenuClick: EmitType<MenuEventArgs>;

    /**
     * Triggers when a command executed.
     *
     * @event
     */
    @Event()
    public commandExecute: EmitType<ICommandExecuteEventArgs>;

    /**
     * A collection of JSON objects where each object represents a layer. Layer is a named category of diagram shapes.
     *
     * @default []
     */
    @Collection<LayerModel>([], Layer)
    public layers: LayerModel[];

    /**
     * Triggers when a symbol is dragged and dropped from symbol palette to drawing area
     *
     * @event
     */
    @Event()
    public drop: EmitType<IDropEventArgs>;

    /**
     *This event is triggered when we drag the segment thumb of Orthogonal/ Straight /Bezier connector
     *
     * @event
     * @deprecated
     */
    @Event()
    public segmentChange: EmitType<ISegmentChangeEventArgs>;

    /**
     *This event triggers after the diagram elements finished loading using loadDiagram method
     *
     * @event
     */
    @Event()
    public loaded: EmitType<ILoadedEventArgs>;

    /**
     * Triggers when the layout rendering process in the diagram has either started or completed.
     *
     *  @event
     */
    @Event()
    public layoutUpdated: EmitType<ILayoutUpdatedEventArgs>;

    //private variables
    /** @private */
    public preventDiagramUpdate: boolean;
    /** @private */
    public checkMenu: boolean = false;
    /** @private */
    public parentObject: NodeModel;

    /** @hidden */
    /** @private */
    public localeObj: L10n;
    private defaultLocale: Object;

    /** @private */
    public isServerUpdate: boolean = false;

    /** @private */
    public currentDrawingObject: Node | Connector;
    /** @private */
    public currentSymbol: Node | Connector;

    /** @private */
    public oldNodeObjects: Node[] = [];

    /** @private */
    public oldDiagramObject: object = {};

    /** @private */
    public oldConnectorObjects: Connector[] = [];

    /** @private */
    public diagramRenderer: DiagramRenderer;
    private gridlineSvgLayer: SVGElement;
    private renderer: CanvasRenderer;
    /** @private */
    public tooltipObject: Tooltip;
    /** @private */
    public hRuler: Ruler;
    /** @private */
    public vRuler: Ruler;
    /** @private */
    public droppable: Droppable;
    /** @private */
    public diagramCanvas: HTMLElement;
    /** @private */
    public diagramLayer: HTMLCanvasElement | SVGGElement;
    private diagramLayerDiv: HTMLElement;
    private adornerLayer: SVGElement;
    private eventHandler: DiagramEventHandler;
    private preventOverviewRefresh: boolean = false;
    /** @private */
    public scroller: DiagramScroller;
    /** @private */
    public spatialSearch: SpatialSearch;
    /** @private */
    public commandHandler: CommandHandler;
    /** @private */
    public layerZIndex: number;
    /** @private */
    public layerZIndexTable: {};
    /** @private */
    public nameTable: {};
    /** @private */
    public canEnableBlazorObject: boolean = false;
    /** @private */
    public pathTable: {};
    /** @private */
    public connectorTable: {} = {};
    /** @private */
    public groupTable: {} = {};
    /** @private */
    private htmlLayer: HTMLElement;
    /** @private */
    public diagramActions: DiagramAction;
    /** @private */
    public scrollActions: ScrollActions = ScrollActions.None;
    /** @private */
    public blazorActions: BlazorAction = BlazorAction.Default;
    /** @private */
    public commands: {};
    /** @private */
    public activeLabel: ActiveLabel = { id: '', parentId: '', isGroup: false, text: undefined };
    /** @private */
    public activeLayer: LayerModel;
    /** @private */
    public serviceLocator: ServiceLocator;
    /** @private */
    public views: string[];
    /** @private */
    public isLoading: Boolean;
    /** @private */
    public textEditing: Boolean = false;
    /** @private */
    public isTriggerEvent: Boolean = false;
    /** @private */
    public preventNodesUpdate: Boolean = false;
    /** @private */
    public preventConnectorsUpdate: Boolean = false;
    /** @private */
    public callBlazorModel: Boolean = true;
    /** @private */
    public isRowHeightUpdate: Boolean = false;
    /** @private */
    public selectionConnectorsList: ConnectorModel[] = [];
    /** @private */
    public deleteVirtualObject: boolean = false;
    /** @private */
    public realActions: RealAction;
    /** @private */
    public previousSelectedObject: (NodeModel | ConnectorModel | AnnotationModel)[];
    public canLayout: boolean = true;
    public cancelPositionChange: boolean = false;
    private isRefreshed: boolean = false;
    /** @private */
    public swimlaneChildTable: {} = {};
    /** @private */
    public swimlaneZIndexTable: {} = {};
    /** @private */
    public canExpand: boolean = false;
    /** @private */
    public itemType: string = 'PublicMethod';
    private changedConnectorCollection: ConnectorModel[] = [];
    private changedNodesCollection: NodeModel[] = [];
    private previousNodeCollection: NodeModel[] = [];
    private previousConnectorCollection: ConnectorModel[] = [];
    private crudDeleteNodes: Object[] = [];
    private previousSelectedObjects: (NodeModel | ConnectorModel | AnnotationModel)[] = [];
    // Group update to server when BlazorAction is isGroupAction;
    private blazorAddorRemoveCollection: (NodeModel | ConnectorModel)[] = [];
    private blazorRemoveIndexCollection: number[] = [];
    private diagramid: number = 88123;
    private portCenterPoint: any = [];
    /** @private */
    public selectedObject: { helperObject: NodeModel, actualObject: NodeModel } = { helperObject: undefined, actualObject: undefined };
    /** @private */
    public deleteDependentConnector: boolean = true;
    /** @private */
    public scaleValue: number = 1;
    public routedConnectors: string[] = [];
    /** @private */
    public pathDataStorage: Map<string, PointModel[]> = new Map();
    // To check current action is undo or redo
    private isUndo: boolean = false;
    /**@private */
    public groupBounds: Rect;
    // Groups that either have connectors with flip applied or a non-zero rotation
    /**@private */
    public connectorOrRotatedGroups: NodeModel[] = [];
    // To indicate the connector inside group is flipping.
    /**@private */
    public connectorFlipInProgress: boolean = false;
    // Indicates whether the current action is part of an undo or redo operation
    /** @private */
    public checkUndoRedo: boolean = false;
    /** @private */
    public activeLayerObjectsSet: Set<string> = new Set();
    /** @private */
    public restrictedDeltaValue: PointModel;

    /**@private */
    public isScrollOffsetInverted: boolean = true;
    /**@private */
    public initNodeTemplate: boolean = false;
    /**
     * Stores diagram nodes and connectors temporarily before they are initialized and appended to the nameTable.
     * @private
     */
    public tempTable: {} = {};
    /**
     * Indicates whether the diagram is being refreshed during deserialization.
     * @private
     */
    public deserializing: boolean = false;

    /**
     * Constructor for creating the widget
     */
    constructor(options?: DiagramModel, element?: HTMLElement | string) {
        super(options, <HTMLElement | string>element);
        let child: NodeModel | ConnectorModel;
        let node: NodeModel | ConnectorModel;
        //Removed isBlazor code
        this.ignoreCollectionWatch = true;
        for (let i: number = 0; options && options.nodes && i < options.nodes.length; i++) {
            child = options.nodes[parseInt(i.toString(), 10)];
            node = this.nodes[parseInt(i.toString(), 10)];
            if (child.children && child.children.length > 0) {
                if (!child.style || !child.style.fill) {
                    node.style.fill = 'transparent';
                }
                if (!child.style || !child.style.strokeColor) {
                    node.style.strokeColor = 'transparent';
                }
            }
            if (child.shape && child.shape.type === 'UmlActivity') {
                setUMLActivityDefaults(child, node);
            }
            if (child.shape && (child.shape.type === 'SwimLane' || child.shape.type === 'Container')) {
                setSwimLaneDefaults(child, node);
            }
            // Removed isBlazor code
            if (this.nodeDefaults) {
                updateDefaultValues(node, child, this.nodeDefaults);
            }
            this.updateAnnotationText(node.annotations);
        }
        if (options && options.connectors) {
            for (let i: number = 0; options && options.connectors && i < options.connectors.length; i++) {
                child = options.connectors[parseInt(i.toString(), 10)];
                node = this.connectors[parseInt(i.toString(), 10)];
                //Removed isBlazor code
                if (this.connectorDefaults) {
                    updateDefaultValues(node, child, this.connectorDefaults);
                }
                this.updateAnnotationText(node.annotations);
            }
        }
        for (let i: number = 0; options && options.connectors && i < options.connectors.length; i++) {
            const defaultConnector: ConnectorModel = options.connectors[parseInt(i.toString(), 10)];
            const connector: ConnectorModel = this.connectors[parseInt(i.toString(), 10)];
            if (defaultConnector.shape && defaultConnector.shape.type !== 'None') {
                setConnectorDefaults(defaultConnector, connector);
            }
            //Removed isBlazor code
        }
    }

    private updateAnnotationText(annotations?: PathAnnotationModel[] | ShapeAnnotationModel[]): void {
        //Removed isBlazor code
    }

    private clearCollection(isConnector?: boolean): void {
        const collection: (NodeModel | ConnectorModel)[] = [];
        let obj: NodeModel | ConnectorModel;
        for (const key of Object.keys(this.nameTable)) {
            obj = this.nameTable[`${key}`];
            if (obj && ((isConnector && obj instanceof Connector) || (!isConnector && obj instanceof Node))) {
                collection.push(obj);
            }
        }
        this.clearObjects(collection);
    }
    /**
     * Updates the diagram control when the objects are changed by comparing new and old property values.
     *
     * @param {DiagramModel} newProp - A object that lists the new values of the changed properties.
     * @param {DiagramModel} oldProp - A object that lists the old values of the changed properties.
     */
    /* tslint:disable */
    public onPropertyChanged(newProp: DiagramModel, oldProp: DiagramModel): void {
        // Model Changed
        // Bug 842506: After multiple group node rotations, the undo functionality is not working.
        // Below condition is used to restrict onPropertyChange when we rotate group node using button at runtime.
        if (!(this as any).rotateUsingButton) {
            let newValue: NodeModel | ConnectorModel | DiagramModel;
            let oldValue: NodeModel | ConnectorModel | DiagramModel;
            let isPropertyChanged: boolean = true;
            let refreshLayout: boolean = false;
            let refereshColelction: boolean = false;
            let bpmnAnnotationConnector: ConnectorModel;
            if (this.diagramActions & DiagramAction.Render) {
                for (const prop of Object.keys(newProp)) {
                    switch (prop) {
                    case 'width':
                    case 'height':
                        this.element.style.width = this.getSizeValue(this.width);
                        this.element.style.height = this.getSizeValue(this.height);
                        this.eventHandler.updateViewPortSize(this.element);
                        for (const view of this.views) {
                            const temp: View = this.views[`${view}`];
                            if (!(temp instanceof Diagram)) {
                                temp.updateView(temp);
                            }
                        }
                        break;
                    case 'nodes':
                        if (newProp.nodes.length > 0 && oldProp.nodes.length === 0) {
                            this.clearCollection();
                            refereshColelction = true;
                        } else {
                            for (const key of Object.keys(newProp.nodes)) {
                                const index: number = Number(key);
                                const actualObject: Node = this.nodes[parseInt(index.toString(), 10)] as Node;
                                const changedProp: Node = newProp.nodes[parseInt(index.toString(), 10)] as Node;
                                if (newProp.nodes[parseInt(index.toString(), 10)].style
                                    && newProp.nodes[parseInt(index.toString(), 10)].style.gradient) {
                                    this.updateGradient(newProp.nodes[parseInt(index.toString(), 10)],
                                                        oldProp.nodes[parseInt(index.toString(), 10)],
                                                        (this.nodes[parseInt(index.toString(), 10)] as Node));
                                    (this.nodes[parseInt(index.toString(), 10)] as Node).oldGradientValue
                                        = cloneObject(newProp.nodes[parseInt(index.toString(), 10)].style.gradient);
                                }
                                refreshLayout = refreshLayout || changedProp.excludeFromLayout !== undefined;
                                /* eslint-disable */
                                if (newProp.nodes[index] && newProp.nodes[index].shape
                                    && (newProp.nodes[index].shape as BpmnShape).textAnnotation
                                    && (newProp.nodes[index].shape as BpmnShape).textAnnotation.textAnnotationTarget !== '') {
                                    bpmnAnnotationConnector = cloneObject(this.nameTable[actualObject.inEdges[0]]);
                                }
                                /* eslint-enable */
                                this.nodePropertyChange(actualObject, oldProp.nodes[parseInt(index.toString(), 10)] as Node,
                                                        changedProp, undefined, true, true);
                                const args: IPropertyChangeEventArgs | IBlazorPropertyChangeEventArgs = {
                                    element: cloneBlazorObject(actualObject), cause: this.diagramActions,
                                    diagramAction: this.getDiagramAction(this.diagramActions),
                                    oldValue: cloneBlazorObject(oldProp.nodes[parseInt(index.toString(), 10)]) as Node,
                                    newValue: cloneBlazorObject(newProp.nodes[parseInt(index.toString(), 10)]) as Node
                                };
                                // Removed isBlazor code
                                this.triggerEvent(DiagramEvent.propertyChange, args);
                                if (isPropertyChanged) {
                                    isPropertyChanged = false;
                                }
                            }
                            if (this.mode === 'Canvas') {
                                this.refreshDiagramLayer();
                            }
                        }
                        break;
                    case 'connectors':
                        // eslint-disable-next-line no-case-declarations
                        let oldObject: Connector;
                        if (newProp.connectors.length > 0 && oldProp.connectors.length === 0) {
                            this.clearCollection(true);
                            refereshColelction = true;
                        } else {
                            for (const key of Object.keys(newProp.connectors)) {
                                const index: number = Number(key);
                                const actualObject: Connector = this.connectors[parseInt(index.toString(), 10)] as Connector;
                                const changedProp: Connector = newProp.connectors[parseInt(index.toString(), 10)] as Connector;
                                // 927220: Improper Connector State After Undo When Connecting via Button
                                const changedPoints: any = {
                                    sourcePoint: {x:actualObject.sourcePoint.x,y:actualObject.sourcePoint.y},
                                    targetPoint: {x:actualObject.targetPoint.x,y:actualObject.targetPoint.y}
                                };
                                if (changedProp && (changedProp.sourceDecorator || changedProp.targetDecorator)) {
                                    this.diagramActions |= DiagramAction.DecoratorPropertyChange;
                                }
                                this.connectorPropertyChange(actualObject,
                                                             oldProp.connectors[parseInt(index.toString(), 10)] as Connector,
                                                             changedProp, true, true);
                                // 927220: Improper Connector State After Undo When Connecting via Button
                                if (newProp.connectors[parseInt(index.toString(), 10)].sourceID &&
                                !newProp.connectors[parseInt(index.toString(), 10)].sourcePoint) {
                                    oldProp.connectors[parseInt(index.toString(), 10)].sourcePoint = {
                                        x:changedPoints.sourcePoint.x,
                                        y:changedPoints.sourcePoint.y
                                    };
                                    newProp.connectors[parseInt(index.toString(), 10)].sourcePoint = {
                                        x:actualObject.sourcePoint.x,
                                        y:actualObject.sourcePoint.y
                                    };
                                }
                                if (newProp.connectors[parseInt(index.toString(), 10)].targetID &&
                                !newProp.connectors[parseInt(index.toString(), 10)].targetPoint) {
                                    oldProp.connectors[parseInt(index.toString(), 10)].targetPoint = {
                                        x:changedPoints.targetPoint.x,
                                        y:changedPoints.targetPoint.y
                                    };
                                    newProp.connectors[parseInt(index.toString(), 10)].targetPoint = {
                                        x:actualObject.targetPoint.x,
                                        y:actualObject.targetPoint.y
                                    };
                                }
                                if (changedProp && (changedProp.sourceDecorator || changedProp.targetDecorator)) {
                                    this.diagramActions = this.diagramActions & ~DiagramAction.DecoratorPropertyChange;
                                }
                                const args: IPropertyChangeEventArgs | IBlazorPropertyChangeEventArgs = {
                                    element: cloneBlazorObject(actualObject), cause: this.diagramActions,
                                    diagramAction: this.getDiagramAction(this.diagramActions),
                                    oldValue: cloneBlazorObject(oldProp.connectors[parseInt(index.toString(), 10)]) as Connector,
                                    newValue: cloneBlazorObject(newProp.connectors[parseInt(index.toString(), 10)]) as Connector
                                };
                                // Removed isBlazor code
                                this.triggerEvent(DiagramEvent.propertyChange, args);
                                if (actualObject && actualObject.parentId && this.nameTable[actualObject.parentId].shape.type === 'UmlClassifier') {
                                    this.updateConnectorEdges(this.nameTable[actualObject.parentId] || actualObject);
                                }
                                if (isPropertyChanged) {
                                    isPropertyChanged = false;
                                }
                            }
                            this.updateBridging();
                            if (this.mode === 'Canvas') {
                                this.refreshDiagramLayer();
                            }
                        }
                        break;
                    case 'bridgeDirection':
                        this.updateBridging();
                        if (this.mode === 'Canvas') {
                            this.refreshDiagramLayer();
                        }
                        break;
                    case 'backgroundColor':
                        this.intOffPageBackground();
                        break;
                    case 'pageSettings':
                        this.validatePageSize(); this.updatePage(); break;
                    case 'selectedItems':
                        if (newProp.selectedItems.userHandles && this.selectedItems.wrapper && this.selectedItems.userHandles) {
                            if (this.selectedItems.userHandles.length > 0) {
                                this.renderSelector(true); break;
                            }
                        }
                        if (newProp.selectedItems.constraints) {
                            this.renderSelector(true); break;
                        }
                        break;
                    case 'snapSettings':
                        this.updateSnapSettings(newProp);
                        break;
                    case 'commandManager':
                        this.initCommands();
                        break;
                    case 'layout':
                        refreshLayout = true; break;
                    case 'segmentThumbShape':
                        this.updateSelector();
                        break;
                    case 'dataSourceSettings':
                        this.clear();
                        if (this.layout.type === 'None') {
                            refereshColelction = true;
                        } else {
                            //EJ2-837322- Duplicate nodes and connectors are created after reset for layout type 'None'
                            this.initObjects();
                            refreshLayout = true;
                        }
                        break;
                    case 'tooltip':
                        initTooltip(this);
                        break;
                    case 'rulerSettings':
                        this.updateRulerSettings(newProp);
                        break;
                    case 'layers':
                        this.updateLayer(newProp); break;
                    case 'scrollSettings':
                        this.scrollActions |= ScrollActions.PropertyChange;
                        this.updateScrollSettings(newProp);
                        this.scrollActions &= ~ScrollActions.PropertyChange;
                        break;
                    case 'locale':
                        if (newProp.locale !== oldProp.locale) {
                            // 927339: Diagram Layout Rendering correctly When Locale is Set by removing the line
                            super.refresh();
                        }
                        break;
                    case 'contextMenuSettings':
                        if (newProp.contextMenuSettings.showCustomMenuOnly !== undefined) {
                            this.contextMenuSettings.showCustomMenuOnly = newProp.contextMenuSettings.showCustomMenuOnly;
                        }
                        if (newProp.contextMenuSettings.show !== undefined) {
                            this.contextMenuSettings.show = newProp.contextMenuSettings.show;
                        }
                        if (newProp.contextMenuSettings.items) {
                            const items: ContextMenuItemModel[] = newProp.contextMenuSettings.items;
                            for (const key of Object.keys(items)) {
                                const index: number = Number(key);
                                this.contextMenuSettings.items[parseInt(index.toString(), 10)] = items[parseInt(index.toString(), 10)];
                            }
                            if (this.contextMenuModule) {
                                this.contextMenuModule.refreshItems();
                            } else {
                                console.warn('[WARNING] :: Module "DiagramContextMenu" is not available in Diagram component! You either misspelled the module name or forgot to load it.');
                            }
                        }
                        break;
                    case 'serializationSettings':
                        if (newProp.serializationSettings.preventDefaults !== undefined) {
                            this.serializationSettings.preventDefaults = newProp.serializationSettings.preventDefaults;
                        }
                        break;
                    case 'tool':
                        // 912436: Mouse cursor flickers when entering the diagram canvas after the tool is changed at runtime
                        this.eventHandler.updateTool();
                        break;
                    case 'constraints':
                        if (((newProp.constraints & DiagramConstraints.LineRouting) !==
                            (oldProp.constraints & DiagramConstraints.LineRouting)) ||
                            ((newProp.constraints & DiagramConstraints.AvoidLineOverlapping) !==
                            (oldProp.constraints & DiagramConstraints.AvoidLineOverlapping))) {
                            this.resetSegments();
                        }
                        break;
                    }
                }
                if (refreshLayout && !refereshColelction) {
                    if (oldProp.layout && oldProp.layout.connectionPointOrigin === 'DifferentPoint' && newProp.layout.connectionPointOrigin === 'SamePoint'
                        || (oldProp.layout && newProp.layout && !newProp.layout.enableRouting && oldProp.layout.enableRouting)) {
                        for (let i: number = 0; i < this.nodes.length; i++) {
                            const node: NodeModel = this.nodes[parseInt(i.toString(), 10)];
                            if ((node.ports && node.ports.length > 0)) {
                                const ports: PointPortModel[] = [];
                                for (let j: number = node.ports.length - 1; j >= 0; j--) {
                                    if (node.ports[parseInt(j.toString(), 10)].id.split('_')[1] === 'LineDistribution') {
                                        ports.push(node.ports[parseInt(j.toString(), 10)]);
                                    }
                                }
                                this.removePorts(node as Node, ports);
                            }
                        }
                        for (let j: number = 0; j < this.connectors.length; j++) {
                            const connector: ConnectorModel = this.connectors[parseInt(j.toString(), 10)];
                            const sourcePortid: string = connector.sourcePortID;
                            const targetPortId: string = connector.targetPortID;
                            //const oldSegment: OrthogonalSegmentModel = (connector.segments as OrthogonalSegmentModel);
                            connector.sourcePortID = '';
                            connector.targetPortID = '';
                            (connector as Connector).sourcePortWrapper = undefined;
                            (connector as Connector).targetPortWrapper = undefined;
                            connector.segments = [];
                            this.connectorPropertyChange(connector as Connector, {
                                sourcePortID: sourcePortid, targetPortID: targetPortId
                            } as Connector, { sourcePortID: '', targetPortID: '' } as Connector);
                        }
                    }
                    this.doLayout(); this.renderReactTemplates();
                }
                if (isPropertyChanged && this.propertyChange) {
                    const args: IPropertyChangeEventArgs | IBlazorPropertyChangeEventArgs = {
                        element: cloneBlazorObject(this), cause: this.diagramActions,
                        diagramAction: this.getDiagramAction(this.diagramActions),
                        oldValue: cloneBlazorObject(oldProp), newValue: cloneBlazorObject(newProp)
                    };
                    // Removed isBlazor code
                    this.triggerEvent(DiagramEvent.propertyChange, args);
                }
                /**Feature(EJ2-60228): Need to add Object ID in the history change event argument*/
                if (!refereshColelction && (this.canLogChange()) && (this.modelChanged(newProp, oldProp))) {
                    let propertyObjects: string[] = [];
                    const nodeObjects: string[] = [];
                    const connObjects: string[] = [];
                    let nodeIndex: number;
                    let laneIndex: number;
                    if (newProp.nodes && Object.keys(newProp.nodes).length > 0) {
                        for (const key of Object.keys(newProp.nodes)) {
                            nodeIndex = parseInt(key, 10);
                            nodeObjects.push(this.nodes[parseInt(nodeIndex.toString(), 10)].id);
                            //962315 - Exception when editing lane header annotation at runtime
                            if (newProp.nodes[parseInt(nodeIndex.toString(), 10)]
                                && newProp.nodes[parseInt(nodeIndex.toString(), 10)].shape
                                && (newProp.nodes[parseInt(nodeIndex.toString(), 10)].shape as SwimLaneModel).lanes) {
                                /* eslint-disable */
                                for (const key2 of Object.keys((newProp.nodes[parseInt(nodeIndex.toString(), 10)].shape as SwimLaneModel).lanes)) {
                                    laneIndex = parseInt(key2, 10);
                                }
                                /* eslint-enable */
                            }
                        }
                    }
                    if (newProp.connectors && Object.keys(newProp.connectors).length > 0) {
                        for (const key of Object.keys(newProp.connectors)) {
                            const connIndex: number = parseInt(key, 10);
                            connObjects.push(this.connectors[parseInt(connIndex.toString(), 10)].id);
                        }
                    }
                    propertyObjects = nodeObjects.concat(connObjects);
                    //To prevent history entry for text annotation connector while dragging node.
                    const textCon = connObjects.filter(id => this.nameTable[`${id}`].isBpmnAnnotationConnector);
                    /* eslint-disable */
                    if (textCon.length === 0) {
                        //historyEntry to store BPMNtextAnnotation connector positionchange.
                        if (newProp.nodes && newProp.nodes[nodeIndex] && newProp.nodes[nodeIndex].shape
                            && (newProp.nodes[nodeIndex].shape as BpmnShape).textAnnotation
                            && (newProp.nodes[nodeIndex].shape as BpmnShape).textAnnotation.textAnnotationTarget !== '') {
                            const obj: ConnectorModel = this.nameTable[(this.nodes[parseInt(nodeIndex.toString(), 10)] as Node).inEdges[0]];
                            this.startGroupAction();
                            const connectorEntry: HistoryEntry = {type: 'ConnectionChanged', undoObject: bpmnAnnotationConnector, redoObject: cloneObject(obj), category: 'Internal'};
                            const entry: HistoryEntry = { type: 'PropertyChanged', undoObject: oldProp, redoObject: newProp, category: 'Internal' };
                            if (this.historyManager) {
                                this.addHistoryEntry(connectorEntry);
                                this.addHistoryEntry(entry, propertyObjects);
                            }
                            this.endGroupAction();
                        }
                        else {
                            const entry: HistoryEntry = { type: 'PropertyChanged', undoObject: oldProp, redoObject: newProp, category: 'Internal' };
                            if (this.historyManager && !this.isRowHeightUpdate) {
                                this.addHistoryEntry(entry, propertyObjects);
                                if ((newProp.nodes && newProp.nodes[nodeIndex] && newProp.nodes[nodeIndex].shape
                                    && (newProp.nodes[nodeIndex].shape as SwimLane).lanes
                                    && (newProp.nodes[nodeIndex].shape as SwimLane).lanes[laneIndex]
                                    && (newProp.nodes[nodeIndex].shape as SwimLane).lanes[laneIndex].children)
                                    && !(this.diagramActions & DiagramAction.UndoRedo)) {
                                    this.endGroupAction();
                                }
                            }
                            this.isRowHeightUpdate = false;
                        }
                    }
                }
                this.resetDiagramActions();
                if (refereshColelction) {
                    this.initObjects(true);
                    this.refreshDiagramLayer();
                    if (refreshLayout) {
                        this.doLayout();
                    }
                }
                const scrollAlone: boolean = ((Object.keys(newProp).length === 1) && newProp.scrollSettings !== undefined);
                if (!refereshColelction) {
                    for (const temp of this.views) {
                        const view: View = this.views[`${temp}`];
                        if (!(view instanceof Diagram)) {
                            if (newProp.scrollSettings && newProp.scrollSettings.currentZoom !== oldProp.scrollSettings.currentZoom) {
                                //view.updateHtmlLayer(view);
                            }
                            if (!scrollAlone) {
                                this.refreshCanvasDiagramLayer(view);
                            }
                        }
                    }
                }
            }
        } else {
            (this as any).rotateUsingButton = false;
        }
    }
    /* tslint:enable */
    private updateSnapSettings(newProp: DiagramModel): void {
        if (newProp.snapSettings.constraints !== undefined || newProp.snapSettings.horizontalGridlines ||
            newProp.snapSettings.verticalGridlines || newProp.snapSettings.gridType) {
            this.diagramRenderer.updateGrid(
                this.snapSettings, getGridLayerSvg(this.element.id), this.scroller.transform,
                this.rulerSettings, this.hRuler, this.vRuler
            );
        }
    }

    // This private method has been specially provided to update only the node old gradient value in oldProperty.
    // This issue belong to core team but we fixed in our end.
    // https://syncfusion.atlassian.net/browse/EJ2-49232

    private updateGradient(newProp: NodeModel, oldProp: NodeModel, nodeObj: Node): void {

        if (nodeObj.oldGradientValue) {
            const linearNode: LinearGradient = (nodeObj as NodeModel) as LinearGradient;
            const radialNode: RadialGradient = (nodeObj as NodeModel) as RadialGradient;
            const linearProp: LinearGradient = oldProp.style.gradient as LinearGradient;
            const radialProp: RadialGradient = oldProp.style.gradient as RadialGradient;
            for (const key of Object.keys(newProp.style.gradient)) {
                switch (key) {
                case 'type':
                    if (linearNode.type) {
                        linearProp.type = linearNode.type;
                    }
                    break;
                case 'x1':
                    if (linearNode.x1) {
                        linearProp.x1 = linearNode.x1;
                    }
                    break;
                case 'x2':
                    if (linearNode.x2) {
                        linearProp.x2 = linearNode.x2;
                    }
                    break;
                case 'y1':
                    if (linearNode.y1) {
                        linearProp.y1 = linearNode.y1;
                    }
                    break;
                case 'y2':
                    if (linearNode.y2) {
                        linearProp.y2 = linearNode.y2;
                    }
                    break;
                case 'cx':
                    if (radialNode.cx) {
                        radialProp.cx = radialNode.cx;
                    }
                    break;
                case 'cy':
                    if (radialNode.cy) {
                        radialProp.cy = radialNode.cy;
                    }
                    break;
                case 'fx':
                    if (radialNode.fx) {
                        radialProp.fx = radialNode.fx;
                    }
                    break;
                case 'fy':
                    if (radialNode.fy) {
                        radialProp.fy = radialNode.fy;
                    }
                    break;
                case 'r':
                    if (radialNode.r) {
                        radialProp.r = radialNode.r;
                    }
                    break;
                case 'stops':
                    if ((nodeObj.oldGradientValue as LinearGradient | RadialGradient).stops) {
                        const stops: StopModel[] = ((Object as any).values(cloneObject((nodeObj.oldGradientValue as LinearGradient |
                        RadialGradient).stops))); stops.pop();
                        oldProp.style.gradient.stops = stops;
                    }
                    break;
                }
            }
        }
    }

    private updateRulerSettings(newProp: DiagramModel): void {
        if (newProp.rulerSettings.dynamicGrid !== undefined) {
            this.diagramRenderer.updateGrid(
                this.snapSettings, getGridLayerSvg(this.element.id), this.scroller.transform,
                this.rulerSettings, this.hRuler, this.vRuler
            );
        }
        if (newProp.rulerSettings.showRulers !== undefined) {
            this.intOffPageBackground();
            this.scroller.setSize();
            this.renderRulers();
        } else if (newProp.rulerSettings.horizontalRuler !== undefined ||
            newProp.rulerSettings.verticalRuler !== undefined) {
            if (newProp.rulerSettings.horizontalRuler.thickness !== undefined ||
                newProp.rulerSettings.verticalRuler.thickness !== undefined) {
                removeRulerElements(this);
                this.intOffPageBackground();
                this.scroller.setSize();
                this.renderRulers();
            } else {
                updateRuler(this);
            }
        }
        this.diagramRenderer.updateGrid(
            this.snapSettings, getGridLayerSvg(this.element.id), this.scroller.transform,
            this.rulerSettings, this.hRuler, this.vRuler
        );
    }


    /**
     * Get the properties to be maintained in the persisted state.
     *
     * @returns {string}
     */
    public getPersistData(): string {
        const keyEntity: string[] = ['loaded'];
        return this.addOnPersist(keyEntity);
    }

    /**
     * Initialize nodes, connectors and renderer
     */
    protected preRender(): void {
        this.initializePrivateVariables();
        this.isProtectedOnChange = true;
        this.serviceLocator = new ServiceLocator;
        this.initializeServices();
        this.setCulture();
        const measureWindowElement: string = 'measureElement';
        if (window[`${measureWindowElement}`]) {
            window[`${measureWindowElement}`] = null;
        }
        this.initDiagram();
        this.initViews();
        this.unWireEvents();
        this.wireEvents();
        this.element.classList.add('e-diagram');
    }

    private initializePrivateVariables(): void {
        if (this.element.id === '') {
            const collection: number = document.getElementsByClassName('e-diagram').length;
            this.element.id = 'diagram_' + this.diagramid + '_' + collection;
        }

        this.defaultLocale = {
            Copy: 'Copy',
            Cut: 'Cut',
            Paste: 'Paste',
            Undo: 'Undo',
            Redo: 'Redo',
            SelectAll: 'Select All',
            Grouping: 'Grouping',
            Group: 'Group',
            UnGroup: 'Un Group',
            Order: 'Order',
            BringToFront: 'Bring To Front',
            MoveForward: 'Move Forward',
            SendToBack: 'Send To Back',
            SendBackward: 'Send Backward'
        };

        this.layerZIndex = -1;
        this.layerZIndexTable = {};
        //878837 : initialize parameter for passing container as a parameter
        if (this.swimlaneChildTable === undefined && this.swimlaneZIndexTable === undefined) {
            this.swimlaneChildTable = {};
            this.swimlaneZIndexTable = {};
        }
        if (!this.activeLayerObjectsSet) {
            this.activeLayerObjectsSet = new Set();
        }
        if (!this.isScrollOffsetInverted) {
            this.isScrollOffsetInverted = true;
        }
        if (!this.connectorOrRotatedGroups) {
            this.connectorOrRotatedGroups = [];
        }
        //Bug 959667: Swimlane interaction is not proper after refreshing the diagram at runtime.
        if (this.refreshing && !this.deserializing) {
            if (this.nodes.some((node: NodeModel) => node.shape.type === 'SwimLane')) {
                this.getSwimlaneChildTable();
                this.removeSwimlaneChildOnRefresh();
            }
        }
        this.nameTable = {};
        this.pathTable = {};
        this.groupTable = {};
        this.commands = {};
        if (!this.isLoading) {
            this.views = [];
        }
        this.commandHandler = new CommandHandler(this);
        this.eventHandler = new DiagramEventHandler(this, this.commandHandler);
        this.spatialSearch = new SpatialSearch(this.nameTable);
        this.scroller = new DiagramScroller(this);
    }

    private removeSwimlaneChildOnRefresh(): void {
        const removeNodes = getSwimLaneChildren(this.nodes);
        removeUnnecessaryNodes(removeNodes, this);
        //Bug 959667: To update the margin for swimlane child nodes.
        this.nodes.forEach((node: NodeModel) => {
            const swimLaneShape: SwimLane = node.shape as SwimLane;
            if (swimLaneShape && swimLaneShape.lanes && swimLaneShape.lanes.length > 0) {
                const nodeX: number = node.offsetX - node.wrapper.actualSize.width / 2;
                let nodeY: number = node.offsetY - node.wrapper.actualSize.height / 2;
                // Determine orientation
                const isVertical: boolean = swimLaneShape.orientation === 'Vertical';
                if (isVertical) {
                    if (swimLaneShape.orientation === 'Vertical') {
                        nodeY += (swimLaneShape.header && swimLaneShape.hasHeader) ? swimLaneShape.header.height : 0;
                    }
                }
                // Iterate over lanes using forEach
                swimLaneShape.lanes.forEach((lane: Lane) => {
                    if (lane.children && lane.children.length > 0) {
                        // Iterate over children using forEach
                        lane.children.forEach((childNode: NodeModel) => {
                            const childX: number = childNode.wrapper.offsetX - childNode.width / 2;
                            const childY: number = childNode.wrapper.offsetY - childNode.height / 2;

                            if (isVertical) {
                                childNode.margin.top = childY - nodeY;
                            } else {
                                childNode.margin.left = childX - nodeX;
                            }
                        });
                    }
                });
            }
        });
    }

    private initializeServices(): void {
        this.serviceLocator.register('localization', this.localeObj = new L10n(this.getModuleName(), this.defaultLocale, this.locale));
    }


    /**
     * Method to set culture for chart
     */

    private setCulture(): void {
        this.localeObj = new L10n(this.getModuleName(), this.defaultLocale, this.locale);
    }
    private getSwimlaneChildTable() {
        let children: string[] = []; let node: Node; let grid: GridPanel; let childTable: DiagramElement[];
        let child: Canvas; const gridChild: string = 'childTable';
        for (let i: number = 0; i < this.nodes.length; i++) {
            node = this.nodes[parseInt(i.toString(), 10)] as Node;
            if (node.shape.type === 'SwimLane') {
                grid = node.wrapper.children[0] as GridPanel;
                childTable = grid[`${gridChild}`];
                for (const key of Object.keys(childTable)) {
                    child = childTable[`${key}`];
                    children = getChild(child as Canvas, children);
                }
                for (let i: number = 0; i < children.length; i++) {
                    if (this.nameTable[children[parseInt(i.toString(), 10)]]) {
                        this.swimlaneChildTable[children[parseInt(i.toString(), 10)]]
                            = this.nameTable[children[parseInt(i.toString(), 10)]].zIndex;
                    }
                }
                this.swimlaneZIndexTable[node.id] = node.zIndex;
            }
        }
    }
    /* tslint:disable */
    /**
     * Renders the diagram control with nodes and connectors
     */
    public render(): void {
        if (this.refreshing && this.dataSourceSettings.dataSource && !this.isLoading) {
            this.nodes = []; this.connectors = [];
        }
        //830544-Support to add load event to notify before rendering of diagram
        if (!this.refreshing) {
            const loadEventData: ILoadEventArgs = {
                diagram: this, name: 'load'
            };
            this.trigger('load', loadEventData);
        }
        // Bug 832897: Need to improve performance while rendering layout with large number of nodes.
        this.isRefreshed = false;
        this.ignoreCollectionWatch = true;
        const domTable: string = 'domTable';
        window[`${domTable}`] = {};
        const collapsedNode: NodeModel[] = [];
        //Removed isBlazor code.
        if (this.dataSourceSettings.crudAction.read) {
            this.renderInitialCrud();
        }
        this.initHistory();
        this.diagramRenderer = new DiagramRenderer(this.element.id, new SvgRenderer(), this.mode === 'SVG');
        this.initLayers();
        this.initializeDiagramLayers();
        this.diagramRenderer.setLayers();
        this.initObjects(true);
        const isLayout: boolean = false;
        // Removed isBlazor code.
        const nodes: NodeModel[] = this.nodes;
        for (let i: number = 0; i < nodes.length; i++) {
            if (!nodes[parseInt(i.toString(), 10)].isExpanded) {
                collapsedNode.push(nodes[parseInt(i.toString(), 10)]);
            }
        }
        if (collapsedNode.length) {
            for (let i: number = collapsedNode.length - 1; i >= 0; i--) {
                if (i === 0) {
                    this.commandHandler.expandNode((collapsedNode[parseInt(i.toString(), 10)] as Node), this, false);
                } else {
                    this.commandHandler.expandNode((collapsedNode[parseInt(i.toString(), 10)] as Node), this, true);
                }
            }
        }
        if (this.canLayout) {
            this.doLayout();
        }
        this.updateFromModel();
        if (isLayout) { this.commandHandler.getBlazorOldValues(); }
        if (this.lineRoutingModule) {
            const previousConnectorObject: Object[] = [];
            const updateConnectorObject: Object[] = [];
            const changeConnectors: Object[] = [];
            //Removed isBlazor code.
            // EJ2-65876 - Exception occurs on line routing injection module
            //934719 - Line Routing is never executed during initial rendering
            this.lineRoutingModule.lineRouting(this);
            // Removed isBlazor code.
        } else if (this.constraints & DiagramConstraints.LineRouting) {
            console.warn('[WARNING] :: Module "LineRouting" is not available in Diagram component! You either misspelled the module name or forgot to load it.');
        }
        this.validatePageSize();
        this.renderPageBreaks();
        this.diagramRenderer.renderSvgGridlines(
            this.snapSettings, getGridLayerSvg(this.element.id), this.scroller.transform, this.rulerSettings, this.hRuler, this.vRuler);
        this.commandHandler.initSelectorWrapper();
        /**
         * Used to render context menu
         */
        this.notify('initial-load', {});
        /**
         * Used to load context menu
         */
        this.trigger('load');
        this.scroller.setSize();
        this.scroller.updateScrollOffsets();
        // Bug 832897: Need to improve performance while rendering layout with large number of nodes.
        // If diagram not refreshed, then we will refresh the diagram.
        if (!this.isRefreshed) {
            this.refreshDiagramLayer();
        }
        //Bug 855677: After Serialization, Subprocess Node Dragging Faces Problems After Removing Child Node.
        //Removed refreshDiagramLayer() method in this line as it causes the subprocess child node to be rendered twice in wrapper which causes the issue.
        if (this.scrollSettings.verticalOffset > 0 || this.scrollSettings.horizontalOffset > 0) {
            this.updateScrollOffset();
        }

        /**
         * Used to end the context menu rendering
         */
        if (Browser.isDevice) {
            this.tool = DiagramTools.ZoomPan | DiagramTools.SingleSelect;
        }
        this.notify('initial-end', {});
        this.isProtectedOnChange = false;
        this.tooltipObject = initTooltip(this);
        this.diagramActions = DiagramAction.Render;
        this.initCommands();
        const hiddenUserHandleTemplate: HTMLCollection = document.getElementsByClassName(this.element.id + '_hiddenUserHandleTemplate');
        createUserHandleTemplates(this.userHandleTemplate, hiddenUserHandleTemplate, this.selectedItems, this.element.id);
        //Removed isBlazor code.
        this.isLoading = false;
        this.refreshRoutingConnectors();
        this.renderComplete();
        this.updateFitToPage();
        if (this.refreshing) {
            this.renderReactTemplates();
        }
    }
    /* tslint:enable */
    private updateFitToPage(): void {
        if (this.pageSettings && this.pageSettings.fitOptions && this.pageSettings.fitOptions.canFit) {
            this.fitToPage(this.pageSettings.fitOptions);
        }
    }
    private updateTemplate(): void {
        //Removed blazor code
    }

    //Call back function to the node template
    // private measureNode(node: NodeModel): void {
    //     if (node.shape.type === 'Native' && isBlazor()) {
    //         node.wrapper.measure(new Size(node.width, node.height));
    //         node.wrapper.arrange(node.wrapper.desiredSize);
    //     }
    // }

    private renderInitialCrud(): void {
        /* eslint-disable */
        const tempObj: Diagram = this;
        /* eslint-enable */
        if (tempObj.dataSourceSettings.crudAction.read) {
            const callback: Fetch = new Fetch(
                tempObj.dataSourceSettings.crudAction.read, 'GET'
            );
            callback.onSuccess = (data: string): void => {
                if (tempObj.dataSourceSettings.dataManager) {
                    tempObj.dataSourceSettings.dataManager = JSON.parse(data);
                } else {
                    tempObj.dataSourceSettings.dataSource = JSON.parse(data);
                }
                tempObj.dataBind();
            };
            callback.send().then();
        }
        if (tempObj.dataSourceSettings.connectionDataSource.crudAction.read) {
            const callback: Fetch = new Fetch(
                tempObj.dataSourceSettings.connectionDataSource.crudAction.read, 'GET'
            );
            callback.onSuccess = (data: string): void => {
                tempObj.dataSourceSettings.connectionDataSource.dataManager = JSON.parse(data);
                tempObj.dataBind();
            };
            callback.send().then();
        }
    }

    /**
     * Retrieves the module name associated with the diagram.
     *
     * @returns {string}  Retrieves the module name associated with the diagram.
     */

    public getModuleName(): string {
        return 'diagram';
    }

    /**
     *
     * Returns the name of class Diagram
     * @returns {string}  Returns the module name of the diagram
     * @private
     */
    public getClassName(): string {
        return 'Diagram';
    }
    /* tslint:disable */
    /**
     * To provide the array of modules needed for control rendering
     *
     * @returns {ModuleDeclaration[]} To provide the array of modules needed for control rendering .\
     * @private
     */
    public requiredModules(): ModuleDeclaration[] {
        const modules: ModuleDeclaration[] = [];
        modules.push({
            member: 'Bpmn',
            args: []
        });
        modules.push({
            member: 'Bridging',
            args: []
        });
        modules.push({
            member: 'ConnectorEditingTool',
            args: []
        });
        //Removed isBlazor code
        if (this.constraints & DiagramConstraints.UndoRedo) {
            modules.push({
                member: 'UndoRedo',
                args: []
            });
        }
        if (this.layout.type === 'OrganizationalChart' || this.layout.type === 'HierarchicalTree' ||
            this.layout.enableAnimation) {
            modules.push({
                member: 'LayoutAnimate',
                args: []
            });
        }
        if (this.snapSettings.constraints) {
            modules.push({
                member: 'Snapping',
                args: [this]
            });
        }
        modules.push({
            member: 'Ej1Serialization',
            args: [this]
        });
        modules.push({
            member: 'PrintandExport',
            args: [this]
        });

        if (this.contextMenuSettings.show) {
            modules.push({
                member: 'contextMenu',
                args: [this, this.serviceLocator]
            });
        }

        if (this.layout.type === 'OrganizationalChart' || this.layout.type === 'HierarchicalTree') {
            modules.push({
                member: 'OrganizationalChart',
                args: [this]
            });
        }
        if (this.layout.type === 'ComplexHierarchicalTree') {
            modules.push({
                member: 'ComplexHierarchicalTree',
                args: []
            });
        }
        if (this.layout.type === 'MindMap') {
            modules.push({
                member: 'MindMapChart',
                args: []
            });
        }

        if (this.layout.type === 'RadialTree') {
            modules.push({
                member: 'RadialTree',
                args: []
            });
        }

        if (this.layout.type === 'SymmetricalLayout') {
            modules.push({
                member: 'SymmetricalLayout',
                args: []
            });
        }

        if (this.layout.type === 'Flowchart') {
            modules.push({
                member: 'FlowchartLayout',
                args: []
            });
        }

        if (this.dataSourceSettings.dataManager || this.dataSourceSettings.dataSource ||
            this.dataSourceSettings.crudAction.read || this.dataSourceSettings.connectionDataSource.crudAction.read) {
            modules.push({
                member: 'DataBinding',
                args: []
            });
        }
        if (this.constraints & DiagramConstraints.LineRouting) {
            modules.push({
                member: 'LineRouting',
                args: []
            });
        }
        if (this.constraints & DiagramConstraints.AvoidLineOverlapping) {
            modules.push({
                member: 'AvoidLineOverlapping',
                args: [this]
            });
        }
        if ((this.layout && (this.layout.type === 'ComplexHierarchicalTree' || this.layout.type === 'HierarchicalTree')) || (this.layout.arrangement === 'Linear' || (this.layout.enableRouting))) {
            modules.push({
                member: 'LineDistribution',
                args: []
            });
        }
        return modules;
    }
    /* tslint:enable */
    private removeUserHandlesTemplate(): void {
        if (this.selectedItems.userHandles.length) {
            for (let i: number = 0; i < this.selectedItems.userHandles.length; i++) {
                for (const elementId of this.views) {
                    removeElement(this.selectedItems.userHandles[parseInt(i.toString(), 10)].name + '_template_hiddenUserHandle', elementId);
                }
            }
        }
    }

    /**
     *Destroys the diagram, freeing up its resources.
     *
     * @returns {void} Destroys the diagram, freeing up its resources.
     */
    public destroy(): void {
        clearInterval(this.renderTimer as number);
        this.renderTimer = null;
        if (this.hRuler && this.vRuler) {
            this.hRuler.destroy();
            this.vRuler.destroy();
        }
        this.tooltipObject.destroy();
        this.droppable.destroy();
        this.unWireEvents();
        this.notify('destroy', {});
        super.destroy();
        this.removeUserHandlesTemplate();
        this.clearTemplate();
        if (document.getElementById(this.element.id)) {
            this.element.classList.remove('e-diagram');
            const tooltipelement: HTMLCollection = document.getElementsByClassName('e-diagram-tooltip');
            while (tooltipelement.length > 0) {
                tooltipelement[0].parentNode.removeChild(tooltipelement[0]);
            }
            const content: HTMLElement = document.getElementById(this.element.id + 'content');
            if (content) {
                this.element.removeChild(content);
            }
            const measureWindowElement: string = 'measureElement';
            if (window[`${measureWindowElement}`]) {
                window[`${measureWindowElement}`].usageCount -= 1;
                const measureElementCount: string = 'measureElementCount';
                window[`${measureElementCount}`]--;
                if (window[`${measureElementCount}`] === 0) {
                    window[`${measureWindowElement}`].parentNode.removeChild(window[`${measureWindowElement}`]);
                    window[`${measureWindowElement}`] = null;
                }
            }
            // clear the cache
            clearDecoratorPathCache();
        }
        const domTable: string = 'domTable';
        window[`${domTable}`] = {};

        for (let i: number = 0; i < this.layers.length; i++) {
            const currentLayer: Layer = (this.layers[parseInt(i.toString(), 10)] as Layer);
            currentLayer.zIndexTable = {};
        }

        this.diagramActions = undefined;
    }

    //Wires the mouse events with diagram control
    private wireEvents(): void {
        const startEvent: string = Browser.touchStartEvent;
        const stopEvent: string = Browser.touchEndEvent;
        const moveEvent: string = Browser.touchMoveEvent;
        const cancelEvent: string = Browser.isPointer ? 'pointerleave' : 'mouseleave';
        const isIE11Pointer: boolean = Browser.isPointer;
        const wheelEvent: string = Browser.info.name === 'mozilla' ?
            (isIE11Pointer ? 'mousewheel' : 'DOMMouseScroll') : 'mousewheel';

        EventHandler.add(this.diagramCanvas, startEvent, this.eventHandler.mouseDown, this.eventHandler);
        EventHandler.add(this.diagramCanvas, moveEvent, this.eventHandler.mouseMove, this.eventHandler);
        EventHandler.add(this.diagramCanvas, stopEvent, this.eventHandler.mouseUp, this.eventHandler);
        EventHandler.add(this.diagramCanvas, cancelEvent, this.eventHandler.mouseLeave, this.eventHandler);
        EventHandler.add(this.diagramCanvas, 'keydown', this.eventHandler.keyDown, this.eventHandler);
        EventHandler.add(this.diagramCanvas, 'keyup', this.eventHandler.keyUp, this.eventHandler);
        EventHandler.add(this.diagramCanvas, 'dblclick', this.eventHandler.doubleClick, this.eventHandler);
        EventHandler.add(this.diagramCanvas, 'scroll', this.eventHandler.scrolled, this.eventHandler);
        EventHandler.add(this.diagramCanvas, wheelEvent, this.eventHandler.mouseWheel, this.eventHandler);
        EventHandler.add(<HTMLElement & Window>window, 'resize', this.eventHandler.windowResize, this.eventHandler);
        this.initDroppables();
    }

    //Unwires the mouse events from diagram control
    private unWireEvents(): void {
        const startEvent: string = Browser.touchStartEvent;
        const moveEvent: string = Browser.touchMoveEvent;
        const cancelEvent: string = Browser.isPointer ? 'pointerleave' : 'mouseleave';
        const isIE11Pointer: boolean = Browser.isPointer;
        const wheelEvent: string = Browser.info.name === 'mozilla' ?
            (isIE11Pointer ? 'mousewheel' : 'DOMMouseScroll') : 'mousewheel';

        const stopEvent: string = Browser.touchEndEvent;
        EventHandler.remove(this.diagramCanvas, startEvent, this.eventHandler.mouseDown);
        EventHandler.remove(this.diagramCanvas, moveEvent, this.eventHandler.mouseMove);
        EventHandler.remove(this.diagramCanvas, stopEvent, this.eventHandler.mouseUp);
        EventHandler.remove(this.diagramCanvas, cancelEvent, this.eventHandler.mouseLeave);
        EventHandler.remove(this.diagramCanvas, 'keydown', this.eventHandler.keyDown);
        EventHandler.remove(this.diagramCanvas, 'keyup', this.eventHandler.keyUp);
        EventHandler.remove(this.diagramCanvas, 'dblclick', this.eventHandler.doubleClick);
        EventHandler.remove(this.diagramCanvas, 'scroll', this.eventHandler.scrolled);
        EventHandler.remove(this.diagramCanvas, wheelEvent, this.eventHandler.mouseWheel);
        EventHandler.remove(<HTMLElement & Window>window, 'resize', this.eventHandler.windowResize);
    }

    //public methods - start region


    /**
     * Select a specified collection of nodes and connectors in the diagram. You can specify whether to clear the existing selection and provide an old value if needed. \
     *
     * @returns { void } Select a specified collection of nodes and connectors in the diagram. You can specify whether to clear the existing selection and provide an old value if needed.\
     * @param {NodeModel | ConnectorModel} objects - An array containing the collection of nodes and connectors to be selected.
     * @param {boolean} multipleSelection - Determines whether the existing selection should be cleared (default is false).
     * @param {NodeModel | ConnectorModel} oldValue - Defines the old value
     *
     */
    public select(objects: (NodeModel | ConnectorModel | AnnotationModel)[],
                  multipleSelection?: boolean, oldValue?: (NodeModel | ConnectorModel | AnnotationModel)[]): void {
        //Removed isBlazor code.
        if (objects != null) {
            this.commandHandler.selectObjects(objects, multipleSelection, oldValue);
        }
    }
    /**
     * Returns the diagram action as a string representation.
     * @returns { string }
     * @param { DiagramAction } diagramAction - The diagram action to be converted to a string.
     */
    //Feature (EJ2-18451) : For all client side events, cause argument data type should be string instead of flag enum and value should be easier to understand.
    public getDiagramAction(diagramAction: DiagramAction): string {
        let action: string;
        if (diagramAction === 2 && DiagramAction.Render) {
            action = 'Render';
        }
        else if (diagramAction & DiagramAction.UndoRedo) {
            action = 'UndoRedo';
        }
        else if (diagramAction & DiagramAction.PublicMethod) {
            action = 'PublicMethod';
        }
        else if (diagramAction & DiagramAction.ToolAction) {
            action = 'ToolAction';
        }
        else if (diagramAction & DiagramAction.TextEdit) {
            action = 'TextEdit';
        }
        else if (diagramAction & DiagramAction.Group) {
            action = 'Group';
        }
        else if (diagramAction & DiagramAction.Interactions) {
            action = 'Interactions';
        }
        else if (diagramAction & DiagramAction.PreventHistory) {
            action = 'PreventHistory';
        }
        else if (diagramAction & DiagramAction.DecoratorPropertyChange) {
            action = 'DecoratorPropertyChange';
        }
        else if (diagramAction & DiagramAction.PreventZIndexOnDragging) {
            action = 'PreventZIndexOnDragging';
        }
        else if (diagramAction & DiagramAction.isGroupDragging) {
            action = 'isGroupDragging';
        }
        else if (diagramAction & DiagramAction.DragUsingMouse) {
            action = 'DragUsingMouse';
        }
        return action;
    }

    /**
     *  Select all objects, including nodes and connectors, in the diagram. \
     *
     * @returns { void }  Select all objects, including nodes and connectors, in the diagram.\
     *
     */
    public selectAll(): void {
        let selectedItems: (NodeModel | ConnectorModel)[] = [];
        selectedItems = this.getObjectsOfLayer(this.activeLayer.objects);
        this.select(selectedItems);
    }


    /**
     * Remove a specific object from the current selection in the diagram. \
     *
     * @returns { void } Remove a specific object from the current selection in the diagram.\
     * @param {NodeModel | ConnectorModel} obj -  The object to remove from the selection.
     *
     */
    public unSelect(obj: NodeModel | ConnectorModel): void {
        //Removed isBlazor code.
        if (obj && isSelected(this, obj)) {
            this.commandHandler.unSelect(obj);
            // this.commandHandler.updateBlazorSelector();
        }
    }


    /**
     * Removes all elements from the selection list, clearing the current selection.\
     *
     * @returns { void } Removes all elements from the selection list, clearing the current selection.\
     *
     */
    public clearSelection(): void {
        this.commandHandler.clearSelection(true);
    }


    /**
     *  Updates the dimensions of the diagram viewport. \
     *
     * @returns { void }  Updates the dimensions of the diagram viewport.\
     *
     */
    public updateViewPort(): void {
        const attribute: string[] = this.getZoomingAttribute();
        this.updateBlazorDiagramProperties(attribute);
        this.eventHandler.updateViewPortSize(this.element);
        this.updateBlazorDiagramProperties(attribute, true);
    }

    private cutCommand(): void {
        this.cut();
        this.itemType = 'PublicMethod';
    }


    /**
     *  Removes the selected nodes and connectors from the diagram and moves them to the diagram clipboard for cutting. \
     *
     * @returns { void }  Removes the selected nodes and connectors from the diagram and moves them to the diagram clipboard for cutting. \
     *
     */
    public cut(): void {
        this.commandHandler.cut();
    }


    /**
     *   Adds a process into the sub-process. \
     *
     * @returns { void }  Adds a process into the sub-process. \
     * @param {NodeModel | ConnectorModel} process - A NodeModel representing the process to be added.
     * @param {boolean} parentId - A string representing the parent ID where the process will be added.
     *
     */
    public addProcess(process: NodeModel, parentId: string): void {
        if (this.bpmnModule) {
            this.bpmnModule.addProcess(process, parentId, this);
        }
    }


    /**
     *  Removes a process from the BPMN sub-process. \
     *
     * @returns { void }  Removes a process from the BPMN sub-process.\
     * @param {string} id - The ID of the process to be removed.
     *
     */
    public removeProcess(id: string): void {
        if (this.bpmnModule) {
            this.bpmnModule.removeProcess(id, this);
        }
    }
    private pasteCommand(): void {
        this.paste();
    }


    /**
     * Adds the given objects or the objects in the diagram clipboard to the diagram control. \
     *
     * @returns { void }  Adds the given objects or the objects in the diagram clipboard to the diagram control. \
     * @param {NodeModel[] | ConnectorModel[]} obj - An array of nodes or connectors objects to be added to diagram.
     * @deprecated
     *
     */
    public paste(obj?: (NodeModel | ConnectorModel)[]): void {
        this.commandHandler.paste(obj);
    }

    /**
     *  Fits the diagram to the page with respect to mode and region. \
     *
     * @returns { void }  Fits the diagram to the page with respect to mode and region.\
     * @param {IFitOptions} options - specify the options for fitting the diagram to the page.
     */
    public fitToPage(options?: IFitOptions): void {
        const attribute: string[] = this.getZoomingAttribute();
        this.updateBlazorDiagramProperties(attribute);
        this.scroller.fitToPage(options);
        this.updateBlazorDiagramProperties(attribute, true);
    }


    /**
     * Brings the specified bounds into view within the diagram's viewport. \
     *
     * @returns { void }  Brings the specified bounds into view within the diagram's viewport.\
     * @param {Rect} bound - Representing the bounds to be brought into view.
     *
     */
    public bringIntoView(bound: Rect): void {
        const attribute: string[] = this.getZoomingAttribute();
        this.updateBlazorDiagramProperties(attribute);
        // EJ2-69238 - add true as an extra parameter to calcuate the horizontal and vertical offset
        this.scroller.bringIntoView(bound, true);
        this.updateBlazorDiagramProperties(attribute, true);
    }


    /**
     * Brings the specified bounds to the center of the viewport. \
     *
     * @returns { void }  Brings the specified bounds to the center of the viewport.\
     * @param {Rect} bound - representing the bounds to be centered in the viewport.
     *
     */
    public bringToCenter(bound: Rect): void {
        const attribute: string[] = this.getZoomingAttribute();
        this.updateBlazorDiagramProperties(attribute);
        this.scroller.bringToCenter(bound);
        this.updateBlazorDiagramProperties(attribute, true);
    }

    private copyCommand(): void {
        this.copy();
    }


    /**
     * Copies the selected nodes and connectors from the diagram to the diagram clipboard for copying. \
     *
     * @returns { Object } Copies the selected nodes and connectors from the diagram to the diagram clipboard for copying.\
     *
     */
    public copy(): Object {
        const obj: Object = this.commandHandler.copy();
        return obj;
    }


    /**
     *  Groups the selected nodes and connectors in the diagram. \
     *
     * @returns { void }   Groups the selected nodes and connectors in the diagram.\
     *
     */
    public group(): void {
        let selectedItems: (NodeModel | ConnectorModel)[] = [];
        selectedItems = this.selectedItems.nodes;
        selectedItems = selectedItems.concat(this.selectedItems.connectors);
        if (selectedItems.length > 1) {
            this.callBlazorModel = false;
            this.insertBlazorDiagramObjects(this.selectedItems);
            this.commandHandler.group();
            this.callBlazorModel = true;
            this.commandHandler.getBlazorOldValues();
        }
    }


    /**
     *  UnGroup the selected nodes and connectors in diagram \
     *
     * @returns { void }   UnGroup the selected nodes and connectors in diagram.\
     *
     */
    public unGroup(): void {
        this.callBlazorModel = false;
        this.insertBlazorDiagramObjects(this.selectedItems);
        this.commandHandler.unGroup();
        this.callBlazorModel = true;
        this.commandHandler.getBlazorOldValues();
    }



    /**
     *  Use this method to move the currently selected nodes or connectors to the back of the drawing order. This effectively places them behind other elements in the diagram. \
     *
     * @returns { void }   Use this method to move the currently selected nodes or connectors to the back of the drawing order. This effectively places them behind other elements in the diagram.\
     *
     */
    public sendToBack(): void {
        this.commandHandler.sendToBack();
    }


    /**
     * Specify which layer in the diagram should be considered the active layer. The active layer is the one where new elements will be added and where user interactions are primarily focused. \
     *
     * @returns { void } Specify which layer in the diagram should be considered the active layer. The active layer is the one where new elements will be added and where user interactions are primarily focused. \
     * @param {string} layerName - The name of the layer to set as the active layer.
     *
     */
    public setActiveLayer(layerName: string): void {
        const layer: LayerModel = this.commandHandler.getLayer(layerName);
        this.activeLayer = layer;
        const objects: string[] = layer.objects;
        // Clear the set
        this.activeLayerObjectsSet.clear();
        // Add new objects
        for (const obj of objects) {
            this.activeLayerObjectsSet.add(obj);
        }
    }

    /**
     * add the layer into diagram\
     *
     * @returns { void } Adds the specified layer to the diagram control along with its associated objects.\
     * @param {LayerModel} layer - representing the layer to be added to the diagram.
     * @param {Object[]} layerObject -  An optional array of objects associated with the layer.
     * @blazorArgsType layer|DiagramLayer
     * @deprecated
     *
     */
    public addLayer(layer: LayerModel, layerObject?: Object[]): void {
        this.commandHandler.addLayer(layer, layerObject);
    }



    /**
     * remove the layer from diagram \
     *
     * @returns { void } remove the layer from diagram.\
     * @param {string} layerId - provide the bound value.
     * @deprecated
     *
     */
    public removeLayer(layerId: string): void {
        this.commandHandler.removeLayer(layerId, isBlazor());
    }
    // /* eslint-enable */


    /**
     *Moves objects from one layer to another layer within the diagram. \
     *
     * @returns { void } Moves objects from one layer to another layer within the diagram. \
     * @param {string[]} objects - An array of object IDs represented as strings to be moved.
     * @param {string} targetLayer - The ID of the target layer to which the objects should be moved.
     */
    public moveObjects(objects: string[], targetLayer?: string): void {
        const oldValues: object = cloneObject(this.layers);
        this.enableServerDataBinding(false);
        this.commandHandler.moveObjects(objects, targetLayer);
        //     const result: object = this.commandHandler.deepDiffer.map(oldValues, cloneObject(this.layers));
        //     const diffValue: object = this.commandHandler.deepDiffer.frameObject({}, result);
        //     this.oldDiagramObject = { layers: diffValue };
        //     // this.commandHandler.updateBlazorProperties();
    }
    /* tslint:disable */
    private layerObjectUpdate(): void {
        //Removed isBlazor code.
    }
    /* tslint:enable */


    /**
     * Use this method to change the order of layers in the diagram. This moves the specified layer behind the layer that comes after it in the layer order. \
     *
     * @returns { void } Use this method to change the order of layers in the diagram. This moves the specified layer behind the layer that comes after it in the layer order.\
     * @param {string} layerName - The name of the layer to be moved.
     * @param {string} targetLayer - define the objects id of string array
     *
     */
    public sendLayerBackward(layerName: string): void {
        this.layerObjectUpdate();
        this.commandHandler.sendLayerBackward(layerName);
        // comment blazor code
        // this.commandHandler.updateLayerObject(this.oldDiagramObject, true);
    }


    /**
     * Moves the specified layer forward in the drawing order. \
     *
     * @returns { void } Moves the specified layer forward in the drawing order.\
     * @param {string} layerName - A string representing the name of the layer to be moved forward.
     *
     */
    public bringLayerForward(layerName: string): void {
        this.layerObjectUpdate();
        this.commandHandler.bringLayerForward(layerName);
        // comment blazor code
        // this.commandHandler.updateLayerObject(this.oldDiagramObject);
    }



    /**
     * Clones a layer along with its objects.\
     *
     * @returns { void } Clones a layer along with its objects.\
     * @param {string} layerName - A string representing the name of the layer to be cloned.
     *
     */
    public cloneLayer(layerName: string): void {
        this.commandHandler.cloneLayer(layerName);
    }


    /**
     *Brings the selected nodes or connectors to the front of the drawing order. \
     *
     * @returns { void } Brings the selected nodes or connectors to the front of the drawing order. \
     *
     */
    public bringToFront(): void {
        this.commandHandler.bringToFront();
    }


    /**
     *Sends the selected nodes or connectors forward in the visual order.  \
     *
     * @returns { void } Sends the selected nodes or connectors forward in the visual order. \
     *
     */
    public moveForward(): void {
        this.commandHandler.sendForward();
    }


    /**
     *Sends the selected nodes or connectors one step backward in the z-order.\
     *
     * @returns { void } Sends the selected nodes or connectors one step backward in the z-order.\
     *
     */
    public sendBackward(): void {
        this.commandHandler.sendBackward();
    }


    /**
     *gets the node or connector having the given name \
     *
     * @returns { void } gets the node or connector having the given name.\
     * @param {string} name - define the name of the layer
     *
     */
    public getObject(name: string): {} {
        return this.nameTable[`${name}`];
    }


    /**
     *Retrieves the node object for the given node ID.  \
     *
     * @returns { void } Retrieves the node object for the given node ID. \
     * @param {string} id - The ID of the node for which the node object is to be retrieved.
     *
     */
    public getNodeObject(id: string): NodeModel {
        return cloneObject(this.nameTable[`${id}`]);
    }


    /**
     *Retrieves the connector object for the given node ID. \
     *
     * @returns { void } Retrieves the connector object for the given node ID.\
     * @param {string} id - The ID of the node for which the connector object is to be retrieved.
     *
     */
    public getConnectorObject(id: string): ConnectorModel {
        return cloneObject(this.nameTable[`${id}`]);
    }


    /**
     * Retrieves the active layer. \
     *
     * @returns { void } Retrieves the active layer.\
     *
     */
    public getActiveLayer(): LayerModel {
        return this.activeLayer;
    }

    private nudgeCommand(direction: NudgeDirection, x?: number, y?: number): void {
        if (typeof direction !== 'object' && (this.selectedItems.nodes.length || this.selectedItems.connectors.length) > 0) {
            let type: string;
            if ((x as IKeyDownType).type && (x as IKeyDownType).type === 'KEYDOWN') {
                type = (x as IKeyDownType).type;
            }
            this.nudge(direction, undefined, undefined, type);
        }
    }

    /**
     * Moves the selected objects towards the given direction by a specified distance.
     *
     * @returns { void }  Moves the selected objects towards the given direction by a specified distance.  \
     * @param {NudgeDirection} direction -  Defines the direction in which the objects should be moved.
     * @param {number} x - The horizontal distance by which the selected objects should be moved.
     * @param {number} y -  The vertical distance by which the selected objects should be moved.
     * @param {string} type -  A string that defines the type of nudge action.
     */
    public nudge(direction: NudgeDirection, x?: number, y?: number, type?: string): void {
        let tx: number = 0; let ty: number = 0;
        let negativeDirection: boolean;
        if (direction === 'Left' || direction === 'Right') {
            negativeDirection = (direction === 'Left');
            tx = (negativeDirection ? -1 : 1) * (x ? x : 1);
        } else {
            negativeDirection = (direction === 'Up');
            ty = (negativeDirection ? -1 : 1) * (y ? y : 1);
        }
        if (type === 'KEYDOWN') {
            tx *= 5;
            ty *= 5;
        }
        this.restrictedDeltaValue = { x: 0, y: 0 };
        const obj: SelectorModel = this.selectedItems;
        const annotation: DiagramElement = this.selectedItems.wrapper.children[0];
        if (annotation instanceof TextElement) {
            this.commandHandler.labelDrag(obj.nodes[0], annotation, tx, ty);
        } else {
            const undoObject: object = cloneObject(this.selectedItems);
            this.protectPropertyChange(true);
            this.drag(obj, tx, ty);
            this.protectPropertyChange(false);
            const entry: HistoryEntry = {
                type: 'PositionChanged',
                redoObject: cloneObject(this.selectedItems), undoObject: undoObject, category: 'Internal'
            };
            this.addHistoryEntry(entry);
        }
        this.refreshCanvasLayers();
    }

    private insertBlazorDiagramObjects(actualObject: NodeModel | ConnectorModel | SelectorModel): void {
        //Removed isBlazor code
    }

    /**
     * Drags the given object (nodes, connectors, or selector) by the specified horizontal and vertical distances.
     *
     * @returns { void }  Drags the given object (nodes, connectors, or selector) by the specified horizontal and vertical distances.\
     * @param {NodeModel | ConnectorModel | SelectorModel} obj - representing the nodes, connectors, or selector to be dragged.
     * @param {number} tx - A number representing the horizontal distance by which the given objects should be moved.
     * @param {number} ty - A number representing the vertical distance by which the given objects should be moved.
     */
    public drag(obj: NodeModel | ConnectorModel | SelectorModel, tx: number, ty: number): void {
        this.insertBlazorDiagramObjects(obj);
        //Removed isBlazor code
        if (this.bpmnModule && (obj instanceof Node) && !(this.nameTable[obj.parentId]
        && this.nameTable[obj.parentId].shape.type === 'Container')) {
            const updated: boolean = this.bpmnModule.updateAnnotationDrag(obj as Node, this, tx, ty);
            if (updated) {
                return;
            }
        } else if ((obj instanceof Node) && this.nameTable[obj.parentId]
        && this.nameTable[obj.parentId].shape.type === 'Container') {
            dragContainerChild(obj, this, tx, ty);
            return;
        }
        if (((obj instanceof Selector && obj.wrapper) || (obj && (obj as Node).id === 'helper' && obj.wrapper))
            && this.constraints & DiagramConstraints.RestrictNegativeAxisDragDrop) {
            const bounds: Rect = obj.wrapper.bounds;
            if (bounds) {
                if (this.restrictedDeltaValue.x > 0) {
                    this.restrictedDeltaValue.x -= tx;
                    if (this.restrictedDeltaValue.x > 0) {
                        tx = 0;
                    }
                    else {
                        tx = this.restrictedDeltaValue.x * -1;
                        this.restrictedDeltaValue.x = 0;
                    }
                }
                if (this.restrictedDeltaValue.y > 0) {
                    this.restrictedDeltaValue.y -= ty;
                    if (this.restrictedDeltaValue.y > 0) {
                        ty = 0;
                    }
                    else {
                        ty = this.restrictedDeltaValue.y * -1;
                        this.restrictedDeltaValue.y = 0;
                    }
                }
                if (bounds.x + tx < 0) {
                    const deltaXToZero: number = -(bounds.x + tx);
                    this.restrictedDeltaValue.x += deltaXToZero;
                    tx += deltaXToZero;
                }

                if (bounds.y + ty < 0) {
                    const deltaYToZero: number = -(bounds.y + ty);
                    this.restrictedDeltaValue.y += deltaYToZero;
                    ty += deltaYToZero;
                }
            }
        }
        if (obj instanceof Selector) {
            this.preventConnectorsUpdate = true;

            if (obj.nodes && obj.nodes.length) {
                for (const node of obj.nodes) {
                    this.callBlazorModel = false;
                    this.drag(node, tx, ty);
                    if ((node as Node).parentId) {
                        const parent: Node = this.nameTable[(node as Node).parentId] as Node;
                        if (parent.isLane) {
                            // 909151 - Connector not updating while dragging multiple selection.
                            if (obj.nodes.length > 1) {
                                this.preventConnectorsUpdate = false;
                            }
                            const swimlane: NodeModel = this.nameTable[parent.parentId];
                            updateLaneBoundsAfterAddChild(parent, swimlane, node, this);
                        }
                    }
                }
                this.callBlazorModel = true;
            }
            if (obj.connectors && obj.connectors.length) {
                this.callBlazorModel = false;
                for (const conn of obj.connectors) {
                    this.drag(conn, tx, ty);
                    if (this.selectionConnectorsList.indexOf(conn) === -1) {
                        this.selectionConnectorsList.push(conn);
                    }
                }
                this.callBlazorModel = true;
            }
            this.updateSelector();
            if ((this.diagramActions & DiagramAction.DragUsingMouse)) {
                this.updatePage();
            }
        } else {
            if (obj instanceof Node) {
                if (this.bpmnModule) { this.bpmnModule.updateAnnotationDrag(obj, this, tx, ty); }
            }
            this.commandHandler.drag(obj as NodeModel | ConnectorModel, tx, ty);
        }
        if (obj instanceof Selector) {
            this.preventConnectorsUpdate = false;
            for (const connectors of this.selectionConnectorsList) {
                this.updateConnectorProperties(this.nameTable[connectors.id]);
                if (connectors.shape.type === 'Bpmn' && (connectors.shape as BpmnFlowModel).sequence === 'Default' && (connectors.shape as BpmnFlowModel).flow === 'Sequence') {
                    this.commandHandler.updatePathElementOffset(connectors);
                }
            }
            this.selectionConnectorsList = [];
        }
        // Bug 832880: Need to improve performance while nudging multiple nodes.
        // Removed one if condition here to improve performance.
        if (this.callBlazorModel && (!(this.blazorActions & BlazorAction.interaction)) &&
            (!(this.blazorActions & BlazorAction.GroupClipboardInProcess))) {
            this.commandHandler.getBlazorOldValues();
        }
    }
    private disableStackContainerPadding(wrapper: GroupableView, disable: boolean): void {
        if (wrapper instanceof StackPanel) {
            wrapper.considerPadding = disable;
        }
        if (wrapper.children) {
            for (const child of wrapper.children) {
                this.disableStackContainerPadding(child as GroupableView, false);
            }
        }

    }
    private checkSize(node: NodeModel, sx: number, sy: number): boolean {
        if (!node || !node.wrapper || !node.wrapper.bounds) {
            return true;
        }
        if (node.constraints && (node.constraints & NodeConstraints.AspectRatio)) {
            return true;
        }
        const { width, height }: Rect = node.wrapper.bounds;
        const scaledWidth: number = width * sx;
        const scaledHeight: number = height * sy;
        if ((node.minWidth !== undefined && scaledWidth < node.minWidth) ||
            (node.minHeight !== undefined && scaledHeight < node.minHeight) ||
            (node.maxWidth !== undefined && scaledWidth > node.maxWidth) ||
            (node.maxHeight !== undefined && scaledHeight > node.maxHeight)) {
            return false;
        }
        // Recursively validate children if any
        if (node.children && node.children.length > 0) {
            for (const childId of node.children) {
                const childNode: NodeModel = this.nameTable[`${childId}`];
                if (childNode && !this.checkSize(childNode, sx, sy)) {
                    return false;
                }
            }
        }
        return true;
    }
    /**
     * Use this method to scale one or more objects in the diagram by specifying the horizontal and vertical scaling ratios. You can also provide a pivot point as a reference for scaling.
     *
     * @returns { void } Use this method to scale one or more objects in the diagram by specifying the horizontal and vertical scaling ratios. You can also provide a pivot point as a reference for scaling.\
     * @param {NodeModel | ConnectorModel | SelectorModel} obj - The objects to be resized.
     * @param {number} sx - The horizontal scaling ratio.
     * @param {number} sy - The vertical scaling ratio.
     * @param {PointModel} pivot - The reference point with respect to which the objects will be resized.
     */
    public scale(obj: NodeModel | ConnectorModel | SelectorModel, sx: number, sy: number, pivot: PointModel): boolean {
        this.disableStackContainerPadding(obj.wrapper as GroupableView, false);
        this.insertBlazorDiagramObjects(obj);
        let checkBoundaryConstraints: boolean = true;
        if ((obj as NodeModel | ConnectorModel).id) {
            obj = this.nameTable[(obj as NodeModel | ConnectorModel).id] || obj;
        }
        if (((obj instanceof Selector && obj.wrapper) || (obj && (obj as Node).id === 'helper' && obj.wrapper))
            && this.constraints & DiagramConstraints.RestrictNegativeAxisDragDrop) {
            const bounds: Rect = obj.wrapper.bounds;
            if (bounds) {
                const selectorWrapper: DiagramElement = obj.wrapper;
                const x: number = selectorWrapper.offsetX - selectorWrapper.actualSize.width * selectorWrapper.pivot.x;
                const y: number = selectorWrapper.offsetY - selectorWrapper.actualSize.height * selectorWrapper.pivot.y;
                const refPoint: PointModel = getPoint(
                    x, y, selectorWrapper.actualSize.width, selectorWrapper.actualSize.height,
                    selectorWrapper.rotateAngle, selectorWrapper.offsetX, selectorWrapper.offsetY, pivot);

                const matrix: Matrix = identityMatrix();
                rotateMatrix(matrix, -(obj as Node | Selector).rotateAngle, refPoint.x, refPoint.y);
                scaleMatrix(matrix, sx, sy, refPoint.x, refPoint.y);
                rotateMatrix(matrix, (obj as Node | Selector).rotateAngle, refPoint.x, refPoint.y);
                const midPoint: PointModel = { x: bounds.x + bounds.width * 0.5, y: bounds.y + bounds.height * 0.5 };
                const newMidPoint: PointModel = transformPointByMatrix(matrix, midPoint);
                if ((obj as Node | Selector).rotateAngle % 360 === 0) {
                    const newX: number = newMidPoint.x - (bounds.width * sx * 0.5);
                    if (newX < 0) {
                        sx = Math.round((bounds.width * sx) + newX) / bounds.width;
                    }
                    const newY: number = newMidPoint.y - (bounds.height * sy * 0.5);
                    if (newY < 0) {
                        sy = Math.round((bounds.height * sy) + newY) / bounds.height;
                    }
                }
                else {
                    const corners: PointModel[] = [
                        { x: bounds.x, y: bounds.y },
                        { x: bounds.x + bounds.width, y: bounds.y },
                        { x: bounds.x, y: bounds.y + bounds.height },
                        { x: bounds.x + bounds.width, y: bounds.y + bounds.height }
                    ];
                    const transformed: PointModel[] = corners.map((pt: PointModel) => transformPointByMatrix(matrix, pt));
                    const minX: number = Math.min(...transformed.map((pt: PointModel) => pt.x));
                    const minY: number = Math.min(...transformed.map((pt: PointModel) => pt.y));
                    if (minX < 0 || minY < 0) {
                        sx = 1;
                        sy = 1;
                    }
                }
            }
        }

        if (obj instanceof Selector) {
            if (obj.nodes && obj.nodes.length) {
                this.callBlazorModel = false;
                //952338 - The minimum and maximum width and height constraints are not functioning correctly for group nodes.
                for (const node of obj.nodes) {
                    if (!this.checkSize(node, sx, sy)) {
                        return false;
                    }
                }
                for (const node of obj.nodes) {
                    checkBoundaryConstraints = this.commandHandler.scale(node, sx, sy, pivot, obj);
                    if (!this.commandHandler.checkBoundaryConstraints(undefined, undefined, obj.wrapper.bounds)) {
                        this.commandHandler.scale(node, 1 / sx, 1 / sy, pivot, obj);
                    }
                }
                this.callBlazorModel = true;
            }
            if (obj.connectors && obj.connectors.length) {
                this.callBlazorModel = false;
                for (const conn of obj.connectors) {
                    this.commandHandler.scale(conn, sx, sy, pivot, obj);
                    if (!this.commandHandler.checkBoundaryConstraints(undefined, undefined, obj.wrapper.bounds)) {
                        this.commandHandler.scale(conn, 1 / sx, 1 / sy, pivot, obj);
                    }
                }
                this.callBlazorModel = true;
            }
            const selector: Selector = this.selectedItems as Selector;
            if (!(selectionHasConnector(this, selector))) {
                this.updateSelector();
            }
            this.refreshCanvasLayers();
        } else {
            this.commandHandler.scale(
                obj as NodeModel | ConnectorModel, sx, sy, pivot, ((obj as NodeModel).children ? obj as IElement : undefined));
        }
        if (this.callBlazorModel && (!(this.blazorActions & BlazorAction.interaction)) &&
            (!(this.blazorActions & BlazorAction.GroupClipboardInProcess))) {
            this.commandHandler.getBlazorOldValues();
        }
        this.disableStackContainerPadding(obj.wrapper as GroupableView, true);
        return checkBoundaryConstraints;
    }
    /**
     * Rotates the specified nodes, connectors, or selector by the given angle.
     *
     * @returns { void } Rotates the specified nodes, connectors, or selector by the given angle.\
     * @param {NodeModel | ConnectorModel | SelectorModel} obj - The objects to be rotated
     * @param {number} angle - The angle by which the objects should be rotated (in degrees).
     * @param {PointModel} pivot - The reference point with respect to which the objects will be rotated.
     * @param {boolean} rotateUsingHandle - Whether to rotate using the handle.
     */
    public rotate(obj: NodeModel | ConnectorModel | SelectorModel, angle: number, pivot?: PointModel,
                  rotateUsingHandle?: boolean): boolean {
        // Bug 842506: After multiple group node rotations, the undo functionality is not working.
        // Added below condition to store the current obj to add it as undo element in rotation changed entry.
        let undoObject: any;
        const childTable: any = [];
        if (!rotateUsingHandle) {
            undoObject = cloneObject(obj);

            if (undoObject.nodes && undoObject.nodes.length > 0 && undoObject.nodes[0].children) {
                const elements: any = [];
                if (!(this as any).fromUndo) { (this as any).rotateUsingButton = true; }
                const nodes: (NodeModel | ConnectorModel)[] = this.commandHandler.getAllDescendants(undoObject.nodes[0], elements);
                for (let i: number = 0; i < nodes.length; i++) {
                    const node: NodeModel = this.commandHandler.cloneChild(nodes[parseInt(i.toString(), 10)].id);
                    childTable[nodes[parseInt(i.toString(), 10)].id] = cloneObject(node);
                }
            }
            if (angle < 0) {
                angle = (angle + 360) % 360;
            }
        }
        this.insertBlazorDiagramObjects(obj);
        let checkBoundaryConstraints: boolean;
        if ((obj as NodeModel | ConnectorModel).id) {
            obj = this.nameTable[(obj as NodeModel | ConnectorModel).id] || obj;
        }
        if (obj) {
            pivot = pivot || { x: obj.wrapper.offsetX, y: obj.wrapper.offsetY };
            if (obj instanceof Selector) {
                this.callBlazorModel = false;
                obj.rotateAngle += angle;
                obj.wrapper.rotateAngle += angle;
                const bounds: Rect = getBounds(obj.wrapper);
                checkBoundaryConstraints = this.commandHandler.checkBoundaryConstraints(undefined, undefined, bounds);
                if ((!checkBoundaryConstraints) || (!this.canRotateOnNegativeAxis(obj.wrapper))) {
                    obj.rotateAngle -= angle;
                    obj.wrapper.rotateAngle -= angle;
                    return false;
                }

                let objects: (NodeModel | ConnectorModel)[] = [];
                objects = objects.concat(obj.nodes);
                objects = objects.concat(obj.connectors);
                this.commandHandler.rotateObjects(obj, objects, angle, pivot);
                this.callBlazorModel = true;
            } else {
                this.commandHandler.rotateObjects(obj as NodeModel, [obj] as (NodeModel | ConnectorModel)[], angle, pivot);
            }
        }
        if (this.callBlazorModel && (!(this.blazorActions & BlazorAction.interaction))) {
            this.commandHandler.getBlazorOldValues();
        }
        if (!rotateUsingHandle && !(this as any).fromUndo) {
            // To add history entry for group node rotation.
            if (undoObject.nodes && undoObject.nodes.length > 0 && undoObject.nodes[0].children) {
                const entry: HistoryEntry = {
                    type: 'RotationChanged', redoObject: cloneObject(obj), undoObject: cloneObject(undoObject), category: 'Internal',
                    childTable: childTable
                };
                this.commandHandler.addHistoryEntry(entry);
                this.commandHandler.updateSelector();
            }

        }
        return checkBoundaryConstraints;
    }
    /**
     * Checks if the object can be rotated on the negative axis.
     *
     * @param {GroupableView | TextElement} objWrapper - The object to check (GroupableView or TextElement).
     * @returns {boolean} True if rotation is allowed, otherwise false.
     * @private
     */
    public canRotateOnNegativeAxis(objWrapper: GroupableView | TextElement): boolean {
        return !(this.constraints & DiagramConstraints.RestrictNegativeAxisDragDrop) ||
            (getBounds(objWrapper).left >= 0 && getBounds(objWrapper).top >= 0);
    }
    /**
     * Moves the source point of the given connector by the specified horizontal and vertical distances.
     *
     * @returns { void }  Moves the source point of the given connector by the specified horizontal and vertical distances.\
     * @param {ConnectorModel} obj - representing the connector whose source point needs to be moved.
     * @param {number} tx - A number representing the horizontal distance by which the source point should be moved.
     * @param {number} ty - A number representing the vertical distance by which the source point should be moved.
     */
    public dragSourceEnd(obj: ConnectorModel, tx: number, ty: number): void {
        this.insertBlazorDiagramObjects(obj);
        this.commandHandler.dragSourceEnd(obj, tx, ty);
        if (this.callBlazorModel) {
            this.commandHandler.getBlazorOldValues();
        }
    }

    /**
     * Moves the target point of the given connector by the specified horizontal and vertical distances.
     *
     * @returns { void }   Moves the target point of the given connector by the specified horizontal and vertical distances.\
     * @param {ConnectorModel} obj - representing the connector whose target point needs to be moved.
     * @param {number} tx - A number representing the horizontal distance by which the target point should be moved.
     * @param {number} ty - A number representing the vertical distance by which the target point should be moved.
     */
    public dragTargetEnd(obj: ConnectorModel, tx: number, ty: number): void {
        this.insertBlazorDiagramObjects(obj);
        this.commandHandler.dragTargetEnd(obj, tx, ty);
        if (this.callBlazorModel) {
            this.commandHandler.getBlazorOldValues();
        }
    }

    /**
     * Finds all the objects that are under the given mouse position based on specified criteria.
     *
     * @returns { void }   Finds all the objects that are under the given mouse position based on specified criteria.\
     * @param {PointModel} position - The PointModel that defines the position. The objects under this position will be found.
     * @param {IElement} source - Representing the source object. The objects under this source will be found.
     */
    public findObjectsUnderMouse(position: PointModel, source?: IElement): IElement[] {
        return this.eventHandler.findObjectsUnderMouse(position, source);
    }

    /**
     * Finds the object that is under the given mouse position based on specified criteria.
     *
     * @returns { void }   Finds the object that is under the given mouse position based on specified criteria. \
     * @param {NodeModel[] | ConnectorModel[]}objects - A collection of NodeModel or ConnectorModel objects, from which the target object has to be found.
     * @param {Actions} action - Defines the action used to find the relevant object.
     * @param {boolean} inAction - A boolean indicating the active state of the action.
     */
    public findObjectUnderMouse(
        objects: (NodeModel | ConnectorModel)[], action: Actions, inAction: boolean): IElement {
        return this.eventHandler.findObjectUnderMouse(objects, action, inAction);
    }

    /**
     * Finds the object that is under the given active object (source) based on specified criteria.
     *
     * @returns { void } Finds the object that is under the given active object (source) based on specified criteria.\
     * @param {NodeModel[] | ConnectorModel[]} objects - A collection of node or connector objects, from which the target object has to be found.
     * @param {Actions} action - defines the action used to find the relevant object.
     * @param {boolean} inAction - A boolean indicating the active state of the action.
     * @param {PointModel} position - The PointModel that defines the position
     * @param {IElement} source - Representing the source element.
     */
    public findTargetObjectUnderMouse(
        objects: (NodeModel | ConnectorModel)[], action: Actions, inAction: boolean, position: PointModel, source?: IElement): IElement {
        return this.eventHandler.findTargetUnderMouse(objects, action, inAction, position, source);
    }

    /**
     * Finds the child element of the given object at the given position based on specified criteria.
     *
     * @returns { void } Finds the child element of the given object at the given position based on specified criteria.\
     * @param {IElement} obj - representing the object, the child element of which has to be found.
     * @param {PointModel} position - defines the position. The child element under this position will be found.
     * @param {Diagram} diagram - defines the diagram value.
     * @param {number} padding - A number representing the padding for the search area around the position.
     */
    public findElementUnderMouse(obj: IElement, position: PointModel, diagram: Diagram, padding?: number): DiagramElement {
        return this.eventHandler.findElementUnderMouse(obj, position, diagram, padding);
    }

    /**
     * Defines the action to be done, when the mouse hovers the given element of the given object
     *
     * @returns { void } Defines the action to be done, when the mouse hovers the given element of the given object .\
     * @param {NodeModel | ConnectorModel} obj - Defines the object under mouse
     * @param {DiagramElement} wrapper - Defines the target element of the object under mouse
     * @param {PointModel} position - Defines the current mouse position
     * @param { NodeModel | PointPortModel | ShapeAnnotationModel | PathAnnotationModel} target - Defines the target
     * @private
     */
    public findActionToBeDone(
        obj: NodeModel | ConnectorModel, wrapper: DiagramElement, position: PointModel,
        target?: NodeModel | ConnectorModel | PointPortModel | ShapeAnnotationModel | PathAnnotationModel): Actions {
        return this.eventHandler.findActionToBeDone(obj, wrapper, position, target);
    }
    // Feature 826644: Support to add ports to the connector. Added below method to update connector port on property change.
    private updateConnectorPort(connector: Connector): void {
        if (connector.ports.length) {
            let portContent: PathElement;
            for (const port of connector.ports) {
                portContent = this.getWrapper(connector.wrapper, port.id) as PathElement;
                connector.initPortWrapper((port as Port), connector.intermediatePoints, connector.wrapper.bounds, portContent);
            }
        }
        connector.wrapper.measure(new Size(connector.wrapper.width, connector.wrapper.height));
        connector.wrapper.arrange(connector.wrapper.desiredSize);
    }

    /**
     * Returns the tool that handles the given action.
     *
     * @returns { ToolBase } Returns the tool that handles the given action. \
     * @param {string} action - A string that defines the action that is going to be performed.
     */
    public getTool(action: string): ToolBase {
        let tool: ToolBase;
        const getCustomTool: Function = getFunction(this.getCustomTool);
        if (getCustomTool) {
            tool = getCustomTool(action as Actions);
            if (tool) {
                return tool;
            }
        }
        return this.eventHandler.getTool(action as Actions);
    }

    /**
     * Defines the cursor that corresponds to the given action.
     *
     * @returns { string } Defines the cursor that corresponds to the given action. \
     * @param {string} action - The action for which the cursor is defined.
     * @param {boolean} active - Indicates whether the action is active.
     */
    public getCursor(action: string, active: boolean): string {
        let cursor: string;
        const getCustomCursor: Function = getFunction(this.getCustomCursor);
        if (getCustomCursor) {
            cursor = getCustomCursor(action as Actions, active);
            if (cursor) {
                return cursor;
            }
        }
        if (this.customCursor.length) {
            for (let i: number = 0; i < this.customCursor.length; i++) {
                if (this.customCursor[parseInt(i.toString(), 10)].action === action) {
                    return this.customCursor[parseInt(i.toString(), 10)].cursor;
                }
            }
        }

        return this.eventHandler.getCursor(action as Actions);
    }

    /**
     * Initializes the undo redo actions
     *
     * @returns { void } Initializes the undo redo actions \
     * @private
     */
    public initHistory(): void {
        if (this.undoRedoModule) {
            this.undoRedoModule.initHistory(this);
        }
    }

    /**
     * Adds a history entry for a change in the diagram control to the track.
     *
     * @returns { void } Adds a history entry for a change in the diagram control to the track. \
     * @param {HistoryEntry} entry - The history entry that describes a change in the diagram.
     * @param {string[]} sourceId - An optional array of source IDs associated with the change.
     */
    public addHistoryEntry(entry: HistoryEntry, sourceId?: string[]): void {
        if (this.undoRedoModule && (this.constraints & DiagramConstraints.UndoRedo)
            && (!this.currentSymbol || this.checkCurrentSymbol(this.currentSymbol, entry))) {
            if (entry.undoObject && (entry.undoObject as Node).id === 'helper') {
                return;
            }
            const added: boolean = this.undoRedoModule.addHistoryEntry(entry, this);
            if (entry.type !== 'StartGroup' && entry.type !== 'EndGroup' && added) {
                this.historyChangeTrigger(entry, 'CustomAction', sourceId);
            }
        }
    }
    private checkCurrentSymbol(currentSymbol: Node | Connector, entry: HistoryEntry): boolean {
        let check: boolean = false;
        if (entry.undoObject && entry.redoObject) {
            const undoObjects: NodeModel | ConnectorModel = entry.undoObject as NodeModel | ConnectorModel;
            const redoObject: NodeModel | ConnectorModel = entry.undoObject as NodeModel | ConnectorModel;
            if (redoObject.id && undoObjects.id && redoObject.id !== currentSymbol.id && undoObjects.id !== currentSymbol.id) {
                return check = true;
            } else {
                return check;
            }
        }
        return check;
    }

    /**
     * Adds the given custom change in the diagram control to the track
     *
     * @returns { void } Adds the given custom change in the diagram control to the track \
     * @param {HistoryEntry} entry - Defines the entry/information about a change in diagram
     */
    public addCustomHistoryEntry(entry: HistoryEntry): void {
        //Removed isBlazor code
    }

    /* eslint-disable */
    /** @private */
    public historyChangeTrigger(entry: HistoryEntry, action: HistoryChangeAction, sourceId?: string[]): void {
        const change: {} = {};
        /* eslint-enable */
        const oldValue: string = 'oldValue';
        const newValue: string = 'newValue';
        const type: string = 'type'; const entryType: string = 'entryType';
        let source: (NodeModel | ConnectorModel)[] = [];
        if (entry.category === 'Internal') {
            if (entry && entry.redoObject && (((entry.redoObject as SelectorModel).nodes) instanceof Array) &&
                (((entry.redoObject as SelectorModel).connectors) instanceof Array)) {
                source = ((entry.redoObject as SelectorModel).nodes as object[]).concat((entry.redoObject as SelectorModel).connectors);
            } else {
                if (entry.redoObject) {
                    source.push((entry.redoObject as NodeModel));
                }
            }
            change[`${type}`] = entry.type;
            //Removed isBlazor code
            switch (entry.type) {
            case 'PositionChanged':
                // 909584 - History change event args value is not updated properly
                if (action === 'Undo') {
                    change[`${oldValue}`] = {
                        offsetX: (entry.redoObject as NodeModel).offsetX,
                        offsetY: (entry.redoObject as NodeModel).offsetY
                    };
                    change[`${newValue}`] = {
                        offsetX: (entry.undoObject as NodeModel).offsetX,
                        offsetY: (entry.undoObject as NodeModel).offsetY
                    };
                } else {
                    change[`${oldValue}`] = {
                        offsetX: (entry.undoObject as NodeModel).offsetX,
                        offsetY: (entry.undoObject as NodeModel).offsetY
                    };
                    change[`${newValue}`] = {
                        offsetX: (entry.redoObject as NodeModel).offsetX,
                        offsetY: (entry.redoObject as NodeModel).offsetY
                    };
                }
                break;
            case 'RotationChanged':
                if (action === 'Undo') {
                    change[`${oldValue}`] = { rotateAngle: (entry.redoObject as NodeModel).rotateAngle };
                    change[`${newValue}`] = { rotateAngle: (entry.undoObject as NodeModel).rotateAngle };
                } else {
                    change[`${oldValue}`] = { rotateAngle: (entry.undoObject as NodeModel).rotateAngle };
                    change[`${newValue}`] = { rotateAngle: (entry.redoObject as NodeModel).rotateAngle };
                }
                break;
            case 'SizeChanged':
                if (action === 'Undo') {
                    change[`${oldValue}`] = {
                        offsetX: (entry.redoObject as NodeModel).offsetX, offsetY: (entry.redoObject as NodeModel).offsetY,
                        width: (entry.redoObject as NodeModel).width, height: (entry.redoObject as NodeModel).height
                    };
                    change[`${newValue}`] = {
                        offsetX: (entry.undoObject as NodeModel).offsetX, offsetY: (entry.undoObject as NodeModel).offsetY,
                        width: (entry.undoObject as NodeModel).width, height: (entry.undoObject as NodeModel).height
                    };
                } else {
                    change[`${oldValue}`] = {
                        offsetX: (entry.undoObject as NodeModel).offsetX, offsetY: (entry.undoObject as NodeModel).offsetY,
                        width: (entry.undoObject as NodeModel).width, height: (entry.undoObject as NodeModel).height
                    };
                    change[`${newValue}`] = {
                        offsetX: (entry.redoObject as NodeModel).offsetX, offsetY: (entry.redoObject as NodeModel).offsetY,
                        width: (entry.redoObject as NodeModel).width, height: (entry.redoObject as NodeModel).height
                    };

                }
                break;
            case 'CollectionChanged':
                change[entry.changeType] = source;
                break;
            case 'ConnectionChanged':
                if (action === 'Undo') {
                    change[`${oldValue}`] = {
                        offsetX: (entry.redoObject as NodeModel).offsetX,
                        offsetY: (entry.redoObject as NodeModel).offsetY
                    };
                    change[`${newValue}`] = {
                        offsetX: (entry.undoObject as NodeModel).offsetX,
                        offsetY: (entry.undoObject as NodeModel).offsetY
                    };
                } else {
                    change[`${oldValue}`] = {
                        offsetX: (entry.undoObject as NodeModel).offsetX,
                        offsetY: (entry.undoObject as NodeModel).offsetY
                    };
                    change[`${newValue}`] = {
                        offsetX: (entry.redoObject as NodeModel).offsetX,
                        offsetY: (entry.redoObject as NodeModel).offsetY
                    };
                }
                break;
            }
            /**Feature(EJ2-60228): Need to add Object ID in the history change event argument*/
            const nodeSourceId: string[] = [];
            const connectorSourceId: string[] = [];
            if (sourceId === undefined && entry.type === 'PropertyChanged') {
                for (let i: number = 0; i < Object.keys(entry.undoObject).length; i++) {
                    if (Object.keys(entry.undoObject)[parseInt(i.toString(), 10)] === 'nodes') {
                        for (const key of Object.keys((entry.undoObject as DiagramModel).nodes)) {
                            const undoIndex: number = parseInt(key, 10);
                            nodeSourceId.push((this.nodes[parseInt(undoIndex.toString(), 10)] as NodeModel).id);
                        }
                    }
                }
                for (let i: number = 0; i < Object.keys(entry.undoObject).length; i++) {
                    if (Object.keys(entry.undoObject)[parseInt(i.toString(), 10)] === 'connectors') {
                        for (const key of Object.keys((entry.undoObject as DiagramModel).connectors)) {
                            const undoIndex: number = parseInt(key, 10);
                            connectorSourceId.push((this.connectors[parseInt(undoIndex.toString(), 10)] as ConnectorModel).id);
                        }
                    }
                }
                sourceId = nodeSourceId.concat(connectorSourceId);
            }
            const arg: IHistoryChangeArgs | IBlazorHistoryChangeArgs = {
                cause: entry.category, source: cloneBlazorObject(source) as NodeModel[], change: cloneBlazorObject(change),
                action: action, sourceId: sourceId
            };
            //Removed isBlazor code
            if (source.length) {
                this.triggerEvent(DiagramEvent.historyChange, arg);
            }
        }
    }

    /**
     * Use this method to start a group action, allowing multiple actions to be treated as a single unit during undo/redo operations. This is useful when you want to group related actions together.
     *
     * @returns { void } Use this method to start a group action, allowing multiple actions to be treated as a single unit during undo/redo operations. This is useful when you want to group related actions together. \
     */
    public startGroupAction(): void {
        const entry: HistoryEntry = { type: 'StartGroup', category: 'Internal' };
        if (!(this.diagramActions & DiagramAction.UndoRedo)) {
            this.addHistoryEntry(entry);
        }
    }

    /**
     * Closes the grouping of actions that will be undone/restored as a whole.
     *
     * @returns { void } Closes the grouping of actions that will be undone/restored as a whole.\
     */
    public endGroupAction(): void {
        const entry: HistoryEntry = { type: 'EndGroup', category: 'Internal' };
        if (!(this.diagramActions & DiagramAction.UndoRedo)) {
            this.addHistoryEntry(entry);
        }
    }

    /**
     * Restores the last action that was performed.
     *
     * @returns { void } Restores the last action that was performed. \
     */
    public undo(): void {
        this.canEnableBlazorObject = true;
        this.callBlazorModel = false;
        if (this.undoRedoModule && (this.constraints & DiagramConstraints.UndoRedo)) {
            this.isUndo = true;
            this.undoRedoModule.undo(this);
            this.isUndo = false;
        } else if (this.constraints & DiagramConstraints.UndoRedo) {
            console.warn('[WARNING] :: Module "UndoRedo" is not available in Diagram component! You either misspelled the module name or forgot to load it.');
        }
        this.commandHandler.getBlazorOldValues();
        this.callBlazorModel = true;
        this.canEnableBlazorObject = false;
    }

    /**
     * Reverse an undo action, essentially restoring the state of the component to a previous state after an undo operation has been performed.
     *
     * @returns { void } Reverse an undo action, essentially restoring the state of the component to a previous state after an undo operation has been performed.\
     */
    public redo(): void {
        this.canEnableBlazorObject = true;
        this.callBlazorModel = false;
        if (this.undoRedoModule && (this.constraints & DiagramConstraints.UndoRedo)) {
            this.undoRedoModule.redo(this);
        } else if (this.constraints & DiagramConstraints.UndoRedo) {
            console.warn('[WARNING] :: Module "UndoRedo" is not available in Diagram component! You either misspelled the module name or forgot to load it.');
        }
        this.commandHandler.getBlazorOldValues();
        this.callBlazorModel = true;
        this.canEnableBlazorObject = false;
    }

    private getBlazorDiagramObjects(objects?: (NodeModel | ConnectorModel)[]): void {
        if (objects) {
            for (let j: number = 0; j < objects.length; j++) {
                this.insertBlazorDiagramObjects(objects[parseInt(j.toString(), 10)]);
            }
        } else {
            this.insertBlazorDiagramObjects(this.selectedItems);
        }
        this.callBlazorModel = false;
        this.canEnableBlazorObject = true;
    }

    /**
     * Aligns a group of objects with reference to the first object in the group.
     *
     * @returns { void } Aligns a group of objects with reference to the first object in the group.\
     * @param {AlignmentOptions}option - Defining the factor by which the objects have to be aligned.
     * @param {NodeModel[] | ConnectorModel[]} objects - A collection of node or connector objects to be aligned.
     * @param {AlignmentMode} type - Defines the type to be aligned
     */
    public align(option: AlignmentOptions, objects?: (NodeModel | ConnectorModel)[], type?: AlignmentMode): void {
        this.getBlazorDiagramObjects(objects);
        if (!objects) {
            objects = [];
            objects = objects.concat(this.selectedItems.nodes, this.selectedItems.connectors);
        }
        this.diagramActions = this.diagramActions | DiagramAction.PublicMethod;
        this.commandHandler.align(objects, option, (type ? type : 'Object'));
        this.commandHandler.getBlazorOldValues();
        this.callBlazorModel = true;
        this.canEnableBlazorObject = false;
    }

    /**
     * Arranges a group of objects with equal intervals within the group.
     *
     * @returns { void } Arranges a group of objects with equal intervals within the group.\
     * @param {NodeModel[] | ConnectorModel[]} option - Objects that have to be equally spaced within the group.
     * @param {DistributeOptions} objects - Object defining the factor to distribute the shapes.
     */
    public distribute(option: DistributeOptions, objects?: (NodeModel | ConnectorModel)[]): void {
        this.getBlazorDiagramObjects(objects);
        // Array of connectors that are connected to nodes
        const connectedArray: Connector[] = [];
        if (!objects) {
            objects = [];
            // 977606 - Distribution not working properly when connector is selected
            objects = objects.concat(this.selectedItems.nodes);
            this.selectedItems.connectors.forEach((connector: Connector) => {
                // Check if connector has sourceWrapper
                if (connector.sourceWrapper) {
                    if (connectedArray.indexOf(connector) === -1) {
                        connectedArray.push(connector);
                    }
                }
                // Check if connector has targetWrapper
                else if (connector.targetWrapper) {
                    if (connectedArray.indexOf(connector) === -1) {
                        connectedArray.push(connector);
                    }
                }
                // Add unconnected connector to objects array
                else {
                    if (objects.indexOf(connector) === -1) {
                        objects.push(connector);
                    }
                }
            });
        }
        this.diagramActions = this.diagramActions | DiagramAction.PublicMethod;
        this.commandHandler.distribute(objects, option);
        // 977606 - Distribution not working properly when connector is selected
        for (const connector of connectedArray) {
            this.updateConnectorProperties(connector);
        }
        this.commandHandler.getBlazorOldValues();
        this.canEnableBlazorObject = false;
        this.callBlazorModel = true;
    }

    /**
     * Scales the specified objects to match the size of the first object in the group.
     *
     * @returns { void } Scales the specified objects to match the size of the first object in the group.\
     * @param {SizingOptions} option - Specifies whether the objects should be horizontally scaled, vertically scaled, or both.
     * @param {NodeModel[] | ConnectorModel[]}objects - The collection of objects to be scaled.
     */
    public sameSize(option: SizingOptions, objects?: (NodeModel | ConnectorModel)[]): void {
        this.getBlazorDiagramObjects(objects);
        if (!objects) {
            objects = [];
            objects = objects.concat(this.selectedItems.nodes, this.selectedItems.connectors);
        }
        this.diagramActions = this.diagramActions | DiagramAction.PublicMethod;
        this.commandHandler.sameSize(objects, option);
        this.commandHandler.getBlazorOldValues();
        this.canEnableBlazorObject = false;
        this.callBlazorModel = true;
    }
    private updateBlazorDiagramProperties(attribute: string[], canCall?: boolean): void {
        //Removed isBlazor code
        if (canCall) {
            // this.commandHandler.getDiagramOldValues(this.oldDiagramObject, attribute);
        }
    }

    private getZoomingAttribute(): string[] {
        const attribute: string[] = [];
        attribute.push('scrollSettings');
        attribute.push('snapSettings');
        return attribute;
    }

    /**
     * Scales the diagram control based on the provided zoom factor. You can optionally specify a focused point around which the diagram will be zoomed.
     *
     * @returns { void } Scales the diagram control based on the provided zoom factor. You can optionally specify a focused point around which the diagram will be zoomed.\
     * @param {number} factor - Defines the factor by which the diagram is zoomed.
     * @param {PointModel} focusedPoint - Defines the point with respect to which the diagram will be zoomed.
     */
    public zoom(factor: number, focusedPoint?: PointModel): void {
        const attribute: string[] = this.getZoomingAttribute();
        this.updateBlazorDiagramProperties(attribute);
        this.scroller.zoom(factor, 0, 0, focusedPoint);
        if (!(this.blazorActions & BlazorAction.interaction)) {
            this.updateBlazorDiagramProperties(attribute, true);
        }
    }

    /**
     * Scales the diagram control based on the provided options, which include the desired zoom factor, focus point, and zoom type.
     *
     * @returns { void }  Scales the diagram control based on the provided options, which include the desired zoom factor, focus point, and zoom type.\
     * @param {ZoomOptions} options - An object specifying the zoom factor, focus point, and zoom type.
     *
     */
    public zoomTo(options: ZoomOptions): void {
        const attribute: string[] = this.getZoomingAttribute();
        this.updateBlazorDiagramProperties(attribute);
        let factor: number = options.zoomFactor ? options.zoomFactor : 0.2;
        factor = options.type === 'ZoomOut' ? 1 / (1 + factor) : (1 + factor);
        this.scroller.zoom(factor, 0, 0, options.focusPoint);
        this.updateBlazorDiagramProperties(attribute, true);
    }

    /**
     * Pans the diagram control to the given horizontal and vertical offsets.
     *
     * @returns { void } Pans the diagram control to the given horizontal and vertical offsets.\
     * @param {number} horizontalOffset - The horizontal distance to which the diagram should be scrolled.
     * @param {number} verticalOffset - The vertical distance to which the diagram should be scrolled.
     * @param {PointModel} focusedPoint - representing the focused point during panning.
     * @param {boolean} isInteractiveZoomPan - A boolean indicating whether the panning is interactive zoom pan.
     */
    public pan(horizontalOffset: number, verticalOffset: number, focusedPoint?: PointModel, isInteractiveZoomPan?: boolean): void {
        const attribute: string[] = this.getZoomingAttribute();
        this.updateBlazorDiagramProperties(attribute);
        this.setCursor('grabbing');
        this.scroller.zoom(1, horizontalOffset, verticalOffset, focusedPoint, isInteractiveZoomPan);
        this.updateBlazorDiagramProperties(attribute, true);
    }

    /**
     * Resets the zoom and scroller offsets to their default values.
     *
     * @returns { void } Resets the zoom and scroller offsets to their default values.\
     */
    public reset(): void {
        const attribute: string[] = this.getZoomingAttribute();
        this.updateBlazorDiagramProperties(attribute);
        this.scroller.zoom(
            1 / this.scroller.currentZoom, -this.scroller.horizontalOffset, -this.scroller.verticalOffset,
            { x: 0, y: 0 });
        this.updateBlazorDiagramProperties(attribute, true);
    }

    /**
     * Resets the segments of the connectors to their default state. This removes any custom segments and restores the connectors to their original configuration.
     *
     * @returns { void } Resets the segments of the connectors to their default state. This removes any custom segments and restores the connectors to their original configuration. \
     */
    public resetSegments(): void {
        const previousConnectorObject: Object[] = [];
        const updateConnectorObject: Object[] = [];
        const changeConnectors: Object[] = [];
        //Removed isBlazor code

        if (this.constraints & DiagramConstraints.LineRouting && this.lineRoutingModule) {
            this.lineRoutingModule.lineRouting(this);
        } else {
            this.protectPropertyChange(true);
            let connector: Connector;
            for (let i: number = 0; i < this.connectors.length; i++) {
                connector = this.connectors[parseInt(i.toString(), 10)] as Connector;
                connector.segments = [];
                this.connectorPropertyChange(connector, {} as Connector, { segments: connector.segments } as Connector);
                if (this.avoidLineOverlappingModule) {
                    this.avoidLineOverlappingModule.removeConnector(connector);
                }
            }
            this.protectPropertyChange(false);
        }
        //Removed isBlazor code
    }


    /**
     * setBlazorDiagramProps method
     *
     * @returns {void} setBlazorDiagramProps method .\
     * @param {boolean} arg - provide the eventName value.
     * @private
     */
    public setBlazorDiagramProps(arg: boolean): void {
        const attribute: string[] = this.getZoomingAttribute();
        if (arg) {
            this.updateBlazorDiagramProperties(attribute);
        } else {
            this.updateBlazorDiagramProperties(attribute, true);
        }

    }


    /**
     * getDirection method
     *
     * @returns { Promise<void | object> } getDirection method .\
     * @param {DiagramEvent} eventName - provide the eventName value.
     * @param {Object} args - provide the args value.
     * @private
     */
    public async triggerEvent(eventName: DiagramEvent, args: Object): Promise<void | object> {
        if (args) {
            this.updateEventValue(args as IDropEventArgs);
        }
        const eventArgs: void | object = await this.trigger(DiagramEvent[`${eventName}`], args);
        //Removed isBlazor code.
        return eventArgs;
    }

    private updateEventValue(args: IDropEventArgs): void {
        const element: NodeModel | ConnectorModel | SelectorModel = args.element;
        if ((args as IDropEventArgs).element && element instanceof Selector && (element.nodes.length + element.connectors.length === 1)) {
            args.element = (element.nodes.length === 1) ? element.nodes[0] : element.connectors[0];
        }
    }


    /**
     * Adds the specified node to a lane within a swimlane.
     *
     * @returns { void }     Adds the specified node to a lane within a swimlane. \
     * @param {NodeModel} node - representing the node to be added to the lane.
     * @param {string} swimLane - A string representing the ID of the swimlane containing the lane.
     * @param {string} lane - A string representing the ID of the lane where the node will be added.
     * @deprecated
     */
    public addNodeToLane(node: NodeModel, swimLane: string, lane: string): void {
        if (this.nameTable[`${swimLane}`]) {
            const swimlaneNode: NodeModel = this.nameTable[`${swimLane}`];
            this.protectPropertyChange(true);
            if (this.undoRedoModule) {
                this.historyManager.startGroupAction();
            }
            if (!this.nameTable[node.id]) {
                node.offsetX = swimlaneNode.wrapper.bounds.width + swimlaneNode.wrapper.bounds.x;
                node.offsetY = swimlaneNode.wrapper.bounds.height + swimlaneNode.wrapper.bounds.y;
                node = this.add(node) as NodeModel;
            }
            (node as Node).parentId = '';
            if (!(swimlaneNode.shape as SwimLane).phases.length) {
                const laneId: string = swimLane + lane + '0';
                if (this.nameTable[`${laneId}`]) {
                    //Bug 913801: Adding an existing node into a lane as child won't be interactive.
                    //Added below method call to update the zIndex of newly added child node.
                    this.commandHandler.updateLaneChildrenZindex((node as Node), this.nameTable[`${laneId}`]);
                    addChildToContainer(this, this.nameTable[`${laneId}`], node, undefined, true);
                    updateLaneBoundsAfterAddChild(this.nameTable[`${laneId}`], swimlaneNode, node, this);
                }
            } else {
                for (let i: number = 0; i < (swimlaneNode.shape as SwimLane).phases.length; i++) {
                    const laneId: string = swimLane + lane + i;
                    if (this.nameTable[`${laneId}`] && this.nameTable[`${laneId}`].isLane) {
                        const laneNode: Rect = this.nameTable[`${laneId}`].wrapper.bounds;
                        const focusPoint: PointModel = {
                            x: laneNode.x +
                                (laneNode.x - swimlaneNode.wrapper.bounds.x + node.margin.left + (node.wrapper.bounds.width / 2)),
                            y: laneNode.y + swimlaneNode.wrapper.bounds.y - node.margin.top
                        };
                        if ((swimlaneNode.shape as SwimLane).orientation === 'Horizontal') {
                            focusPoint.y = laneNode.y;
                        } else {
                            focusPoint.x = laneNode.x;
                            const laneHeaderId: string = this.nameTable[`${laneId}`].parentId +
                                (swimlaneNode.shape as SwimLane).lanes[0].id + '_0_header';
                            focusPoint.y = laneNode.y +
                                (swimlaneNode.wrapper.bounds.y - this.nameTable[`${laneHeaderId}`].wrapper.bounds.height +
                                    node.margin.top + (node.wrapper.bounds.height / 2));
                        }
                        //906796: Child nodes not Positioned correctly to the lane when margin values are applied
                        const currentPhase: PhaseModel = (swimlaneNode.shape as SwimLane).phases[parseInt(i.toString(), 10)];
                        if (node.margin.left <= currentPhase.offset) {
                            this.addChildToPhase(node as Node, swimlaneNode, laneId);
                            break;
                        }
                        else if ((laneId === swimLane + lane + ((swimlaneNode.shape as SwimLane).phases.length - 1)) ||
                            laneNode.containsPoint(focusPoint)) {
                            this.addChildToPhase(node as Node, swimlaneNode, laneId);
                            break;
                        }
                    }
                }
            }
            if (this.undoRedoModule) {
                this.historyManager.endGroupAction();
            }
            this.protectPropertyChange(false);
        }
        this.updateDiagramElementQuad();
    }

    //906796: Child nodes not Positioned correctly to the lane when margin values are applied
    private addChildToPhase(node: Node, swimlaneNode: NodeModel, laneId: string): void {
        this.commandHandler.updateLaneChildrenZindex((node as Node), this.nameTable[`${laneId}`]);
        addChildToContainer(this, this.nameTable[`${laneId}`], node, undefined, true);
        updateLaneBoundsAfterAddChild(this.nameTable[`${laneId}`], swimlaneNode, node, this);
    }

    /**
     * Displays a tooltip for the specified diagram object.
     *
     * @param {NodeModel | ConnectorModel} obj - The object for which the tooltip will be shown.
     */

    public showTooltip(obj: NodeModel | ConnectorModel): void {
        if (obj && obj.id && !obj.wrapper) { obj = this.nameTable[obj.id]; }
        const bounds: Rect = getBounds(obj.wrapper);
        let position: PointModel = { x: 0, y: 0 };
        const content: string | HTMLElement = obj.tooltip.content ?
            obj.tooltip.content : 'X:' + Math.round(bounds.x) + ' ' + 'Y:' + Math.round(bounds.y);
        if (obj && obj.tooltip.openOn === 'Custom') {
            if (obj instanceof Node) {
                position = { x: obj.offsetX + (obj.width / 2), y: obj.offsetY + (obj.height / 2) };
            } else {
                position = { x: (obj as ConnectorModel).targetPoint.x, y: (obj as ConnectorModel).targetPoint.x };
            }
            this.commandHandler.showTooltip(
                obj as IElement, position, content, 'SelectTool', true);
        }
    }

    /**
     * Hides the tooltip for the corresponding diagram object.
     *
     * @param {NodeModel | ConnectorModel} obj - The node or connector object for which the tooltip should be hidden.
     */

    public hideTooltip(obj: NodeModel | ConnectorModel): void {
        if (obj && obj.tooltip.openOn === 'Custom') {
            this.tooltipObject.close();
        }
    }

    /**
     * Adds the specified node to the diagram control.
     *
     * @returns { Node }     Adds the specified node to the diagram control.\
     * @param {NodeModel} obj - representing the node to be added to the diagram.
     * @param {boolean} group - A boolean value indicating whether the node should be added to a group.
     * @blazorArgsType obj|DiagramNode
     */
    public addNode(obj: NodeModel, group?: boolean): Node {
        return this.add(obj, group) as Node;
    }

    /**
     * Adds the specified diagram object to the specified group node.
     *
     * @returns { void }     Adds the specified diagram object to the specified group node.\
     * @param {NodeModel} group - The group node to which the diagram object will be added.
     * @param {string | NodeModel | ConnectorModel} child - The diagram object to be added to the group.
     * @blazorArgsType obj|DiagramNode
     */
    public addChildToGroup(group: NodeModel, child: string | NodeModel | ConnectorModel): void {
        const isContainer: boolean = (group && group.shape && group.shape.type === 'Container');
        const severDataBind: boolean = this.allowServerDataBinding;
        this.enableServerDataBinding(false);
        const propChange: boolean = this.isProtectedOnChange; this.protectPropertyChange(true);
        group = this.getObject(group.id) as NodeModel;
        //Removed isBlazor code
        const isHistoryAdded: boolean = (!(this.diagramActions & DiagramAction.UndoRedo) && !(this.diagramActions & DiagramAction.Group) &&
            !(this.diagramActions & DiagramAction.PreventHistory));
        if (isContainer && !(child as Node).id) {
            const existingChild: NodeModel = this.getObject(child as string);
            if (existingChild) {
                child = existingChild;
            } else {
                (child as Node).id = randomId();
            }
        }
        if (isHistoryAdded) {
            this.startGroupAction();
        }
        let id: string = (child as Node).id;
        if (isContainer) {
            addContainerChild((child as Node), group.id, this);
        } else {
            id = this.addChild(group, child);
            //880811- Adding child to group node using addChildToGroup method is not working properly.
            const element: Node | Connector = this.nameTable[child as string] ? this.nameTable[child as string] : child;
            const childElementToMove: HTMLElement = document.getElementById(element.id + '_groupElement');
            const targetGroupElement: HTMLElement = document.getElementById(group.id + '_groupElement');
            if (targetGroupElement && childElementToMove) {
                targetGroupElement.appendChild(childElementToMove);
            }
        }
        if (isHistoryAdded) {
            const childTable: object = {};
            childTable[`${id}`] = cloneObject(this.getObject(id));
            const entry: HistoryEntry = {
                type: 'AddChildToGroupNode', changeType: 'Insert', undoObject: cloneObject(group),
                redoObject: cloneObject(group), category: 'Internal', objectId: id, childTable: childTable
            };
            this.addHistoryEntry(entry);
            this.endGroupAction();
        }
        this.protectPropertyChange(propChange);
        this.enableServerDataBinding(severDataBind);
        this.updateSelector();
        //Removed isBlazor code.
    }

    /**
     * Removes the specified diagram object from the specified group node.
     *
     * @returns { void }     Removes the specified diagram object from the specified group node.\
     * @param {NodeModel} group - The group node to which the diagram object will be removed.
     * @param {string | NodeModel | ConnectorModel} child - The diagram object to be removed from the group.
     */
    public removeChildFromGroup(group: NodeModel, child: string | NodeModel | ConnectorModel): void {
        const isContainer: boolean = (group && group.shape && group.shape.type === 'Container');
        const severDataBind: boolean = this.allowServerDataBinding;
        this.enableServerDataBinding(false);
        const propChange: boolean = this.isProtectedOnChange; this.protectPropertyChange(true);
        group = this.getObject(group.id) as NodeModel;
        const undoGroup: NodeModel = cloneObject(group);
        const isHistoryAdded: boolean = (!(this.diagramActions & DiagramAction.UndoRedo) && !(this.diagramActions & DiagramAction.Group) &&
            !(this.diagramActions & DiagramAction.PreventHistory));

        const id: string = (child as Node).id || (this.nameTable[child as string] ? this.nameTable[child as string].id : child);
        if (isHistoryAdded) {
            this.startGroupAction();
        }
        if (isContainer) {
            if (isHistoryAdded) {
                const childTable: object = {};
                childTable[`${id}`] = cloneObject(this.getObject(id));
                const entry: HistoryEntry = {
                    type: 'RemoveChildFromGroupNode',
                    changeType: 'Remove',
                    undoObject: undoGroup,
                    redoObject: cloneObject(group),
                    category: 'Internal',
                    objectId: id,
                    childTable: childTable
                };
                this.addHistoryEntry(entry);
                removeChild((child as Node), this);
            }
        } else {
            const id: string = this.removeChild(group, child);
            if (isHistoryAdded) {
                const childTable: object = {};
                childTable[`${id}`] = cloneObject(this.getObject(id));
                const entry: HistoryEntry = {
                    type: 'RemoveChildFromGroupNode', changeType: 'Remove', undoObject: cloneObject(undoGroup),
                    redoObject: cloneObject(group), category: 'Internal', objectId: id, childTable: childTable
                };
                this.addHistoryEntry(entry);
            }
            //880811 - diagram elements not updated properly while grouping nodes at runtime
            const element: Node | Connector = this.nameTable[child as string] ? this.nameTable[child as string] : child;
            const elementZindex: number = element.zIndex;
            const layerNum: number = this.layers.indexOf(this.commandHandler.getObjectLayer(element.id));
            const insertBeforeObj: string = this.layers[parseInt(layerNum.toString(), 10)].objects[elementZindex + 1];
            const insertBeforeElement: HTMLElement = document.getElementById(insertBeforeObj + '_groupElement');
            const childElementToMove: HTMLElement = document.getElementById(element.id + '_groupElement');
            const targetGroupElement: HTMLElement = document.getElementById(group.id + '_groupElement');
            if (targetGroupElement && childElementToMove) {
                if (insertBeforeObj && insertBeforeElement) {
                    if (targetGroupElement.contains(insertBeforeElement)) {
                        targetGroupElement.insertBefore(childElementToMove, insertBeforeElement);
                    } else if (targetGroupElement.parentNode.contains(insertBeforeElement) && insertBeforeElement.parentElement
                        === targetGroupElement.parentElement) {
                        targetGroupElement.parentNode.insertBefore(childElementToMove, insertBeforeElement);
                    } else {
                        targetGroupElement.parentNode.appendChild(childElementToMove);
                    }
                } else {
                    targetGroupElement.parentNode.appendChild(childElementToMove);
                }
            }
        }
        if (isHistoryAdded) {
            this.endGroupAction();
        }
        this.protectPropertyChange(propChange);
        this.enableServerDataBinding(severDataBind);
        this.updateSelector();
    }
    /**
     * Retrieves the history stack values for either undo or redo actions.
     *
     * @returns { void } Retrieves the history stack values for either undo or redo actions.\
     * @param {boolean} isUndoStack - If `true`, retrieves the undo stack values; if `false`, retrieves the redo stack values.
     */
    public getHistoryStack(isUndoStack: boolean): HistoryEntry[] {
        //let temp: HistoryEntry[];
        let historyEntry: HistoryEntry[] = [];
        const temp: HistoryEntry[] = isUndoStack ? this.historyManager.undoStack : this.historyManager.redoStack;
        if (this.historyManager.stackLimit !== undefined) {
            for (let i: number = temp.length - 1; i >= 0; i--) {
                historyEntry.push(temp[parseInt(i.toString(), 10)]);
                if (historyEntry.length > this.historyManager.stackLimit) {
                    return historyEntry;
                }
            }
        } else {
            historyEntry = temp;
        }
        return historyEntry;
    }

    /* tslint:disable */
    /**
     * Returns the edges connected to the given node.
     *
     * @returns { string[] } Returns the edges connected to the given node. \
     * @deprecated
     * @param {Object} args - An object containing information about the node for which edges are to be retrieved.
     */
    public getEdges(args: Object): string[] {
        return args['outEdge'] ? this.nameTable[args['id']].outEdges : this.nameTable[args['id']].inEdges;
    }
    /* tslint:enable */

    /**
     * Returns the parent id for the node
     *
     * @returns { string }Returns the parent id for the node .\
     * @deprecated
     * @param {string} id - returns the parent id
     */
    public getParentId(id: string): string {
        return this.nameTable[`${id}`].parentId;
    }

    /**
     * Adds the given connector to diagram control
     * @returns { Connector } Adds the given connector to diagram control .\
     *
     * @param {ConnectorModel} obj - Defines the connector that has to be added to diagram
     * @blazorArgsType obj|DiagramConnector
     */
    public addConnector(obj: ConnectorModel): Connector {
        return this.add(obj) as Connector;
    }

    /* eslint-disable */
    /** @private */
    public UpdateBlazorDiagramModelCollection(
        obj: Node | Connector, copiedObject?: (NodeModel | ConnectorModel)[], multiSelectDelete?: (NodeModel | ConnectorModel)[],
        isBlazorGroupUpdate?: boolean): void {
        /* eslint-enable */
        //Removed isBlazor code
    }
    /**
     *  UpdateBlazorDiagramModel method
     *
     * @returns { void }  UpdateBlazorDiagramModel method .\
     * @param {Node | Connector | ShapeAnnotation | PathAnnotation} obj - provide the obj value.
     * @param {string} objectType - provide the objectType value.
     * @param {number} removalIndex - provide the removalIndex value.
     * @param {number} annotationNodeIndex - provide the annotationNodeIndex value.
     *
     * @private
     */
    public UpdateBlazorDiagramModel(
        obj: Node | Connector | ShapeAnnotation | PathAnnotation,
        objectType: string, removalIndex?: number, annotationNodeIndex?: number): void {
        //Removed isBlazor code
    }
    // eslint-disable-next-line max-len
    private UpdateBlazorLabelOrPortObjects(
        obj: (ShapeAnnotation | PathAnnotation | PortModel)[], objectType: string, removalIndex?: number[], nodeIndex?: number): void {
        //Removed isBlazor code
    }

    /**
     *  addBlazorDiagramObjects method
     *
     * @returns { void }  addBlazorDiagramObjects method .\
     *
     * @private
     */
    public addBlazorDiagramObjects(): void {
        //Removed isBlazor code
    }
    private removeNodeEdges(elementId: string, id: string, isOutEdges: boolean): void {
        const node: Node = this.nameTable[`${elementId}`];
        const edges: string[] = isOutEdges ? node.outEdges : node.inEdges;
        if (edges.length > 0) {
            for (let i: number = 0; i < edges.length; i++) {
                if (edges[parseInt(i.toString(), 10)] === id) {
                    edges.splice(i, 1);
                }
            }
        }
    }
    /**
     *  insertBlazorConnector method
     *
     * @returns { void }  insertBlazorConnector method .\
     * @param {Connector} obj - provide the nodeId value.
     *
     * @private
     */
    public insertBlazorConnector(obj: Connector): void {
        //Removed isBlazor code
    }
    /* tslint:disable */
    /**
     * Adds the provided object, which can be a node, group, or connector, onto the diagram canvas.
     *
     * @returns { Node | Connector }     Adds the provided object, which can be a node, group, or connector, onto the diagram canvas.\
     * @param {NodeModel | ConnectorModel} obj - Specifies the object to be added to the diagram.
     * @param {boolean} group - If a group object is passed, set it to true.
     */
    public add(obj: NodeModel | ConnectorModel, group?: boolean): Node | Connector {
        let newObj: Node | Connector; const propertyChangeValue: boolean = this.isProtectedOnChange; this.protectPropertyChange(true);
        let isTextAnnotationNode: boolean = false;
        if (obj) {
            obj = cloneObject(obj); let args: ICollectionChangeEventArgs | IBlazorCollectionChangeEventArgs;
            args = {
                element: obj, cause: this.diagramActions, diagramAction: this.itemType, state: 'Changing', type: 'Addition', cancel: false
            };
            if (this.parentObject) {
                args.parentId = this.parentObject.id;
            }
            //Removed isBlazor code
            if (obj.id !== 'helper' && !(this.diagramActions & DiagramAction.PreventCollectionChangeOnDragOver)) {
                this.triggerEvent(DiagramEvent.collectionChange, args);
            }
            if (args.cancel && this.drawingObject) {
                this.removeElements(args.element as NodeModel | ConnectorModel);
                this.tooltipObject.close();
                const sourceNodee: NodeModel = this.getObject((args.element as Connector).sourceID);
                let isOutEdgee: boolean;
                if (getObjectType(args.element) === Connector) {
                    if ((args.element as Connector).sourceID) {
                        this.removeNodeEdges((args.element as Connector).sourceID, (args.element as Connector).id, true);
                        if (sourceNodee.ports.length > 0) {
                            for (let i: number = 0; i < sourceNodee.ports.length; i++) {
                                const port: PointPortModel = sourceNodee.ports[parseInt(i.toString(), 10)];
                                if (port.id === (args.element as Connector).sourcePortID) {
                                    if (port.outEdges.length > 0) {
                                        isOutEdgee = false;
                                    } else {
                                        isOutEdgee = true;
                                    }
                                }
                            }
                            this.removePortEdges(sourceNodee, (args.element as Connector).sourcePortID,
                                                 (args.element as Connector).id, isOutEdgee);
                        }
                    }
                    if ((args.element as Connector).targetID) {
                        this.removeNodeEdges((args.element as Connector).targetID, (args.element as Connector).id, false);
                    }
                }
            }
            this.diagramActions = this.diagramActions | DiagramAction.PublicMethod;
            obj.id = obj.id || randomId(); const layers: LayerModel = this.activeLayer;
            // Bug 890792: Exception thrown when adding a node at runtime in the unit test case.
            // The issue arises only when the diagram is not appended to the DOM. In such cases, the diagram will not be rendered, and the activeLayer property is undefined.
            // Check if activeLayer is defined. If activeLayer is defined, then proceed with the operation.
            if (!args.cancel && layers && !layers.lock) {
                if (layers.objects.indexOf(obj.id) < 0 && !layers.lock) {
                    if (!layers.visible) { layers.visible = true; this.dataBind(); }
                    layers.objects.push(obj.id);
                    this.activeLayerObjectsSet.add(obj.id);
                }
                if (getObjectType(obj) === Connector) {
                    newObj = new Connector(this, 'connectors', obj, true); (newObj as Connector).status = 'New';
                    if (this.nameTable[newObj.targetID] && (this.nameTable[newObj.targetID].shape as BpmnShape).shape === 'TextAnnotation') {
                        (newObj as any).isBpmnAnnotationConnector = true;
                        newObj.constraints = newObj.constraints & ~ConnectorConstraints.Delete;
                    }
                    updateDefaultValues(newObj, obj, this.connectorDefaults);
                    (this.connectors as Connector[]).push(newObj); this.initObject(newObj);
                    //Removed isBlazor code
                    if (obj.visible === false) { this.updateElementVisibility(newObj.wrapper, newObj, obj.visible); }
                    this.updateEdges(newObj);
                    this.insertBlazorConnector(newObj);
                } else {
                    newObj = new Node(this, 'nodes', obj, true);
                    updateDefaultValues(newObj, obj, this.nodeDefaults);
                    newObj.parentId = ((obj as Node).parentId) ? (obj as Node).parentId : newObj.parentId;
                    newObj.umlIndex = (obj as Node).umlIndex; (newObj as Node).status = 'New';
                    isTextAnnotationNode = (newObj.shape as BpmnShape).shape === 'TextAnnotation';
                    if (isTextAnnotationNode && !(obj as any).isTextAnnotationCopied) {
                        newObj.inEdges = (obj as Node).inEdges ? (obj as Node).inEdges : newObj.inEdges;
                    }
                    (this.nodes as Node[]).push(newObj);
                    this.initObject(newObj, layers, undefined, group);
                    if (isTextAnnotationNode) {
                        if (this.bpmnModule) {
                            for (let i: number = 0; i < this.bpmnModule.bpmnTextAnnotationConnector.length; i++) {
                                if (this.bpmnModule.bpmnTextAnnotationConnector[parseInt(i.toString(), 10)].wrapper === null) {
                                    this.initConnectors(this.bpmnModule.bpmnTextAnnotationConnector[parseInt(i.toString(), 10)],
                                                        undefined, true);
                                }
                            }
                        }
                    }
                    //Removed isBlazor code
                    this.updateTemplate();
                    if (this.bpmnModule) {
                        if ((newObj.shape as BpmnShape).activity && (newObj.shape as BpmnShape).activity.subProcess.processes &&
                            (newObj.shape as BpmnShape).activity.subProcess.processes.length) {
                            this.bpmnModule.updateDocks(newObj, this);
                        }
                    }
                    if (this.lineRoutingModule && (this.constraints & DiagramConstraints.LineRouting)) {
                        const objects: Object[] = this.spatialSearch.findObjects(newObj.wrapper.outerBounds as Rect);
                        for (let i: number = 0; i < objects.length; i++) {
                            const object: Connector = objects[parseInt(i.toString(), 10)] as Connector;
                            if (object instanceof Connector) {
                                this.connectorPropertyChange(object, {} as Connector, {
                                    sourceID: object.sourceID, targetID: object.targetID, sourcePortID: object.sourcePortID,
                                    targetPortID: object.targetPortID, sourcePoint: object.sourcePoint, targetPoint: object.targetPoint
                                } as Connector);
                            }
                        }
                    } else if (this.constraints & DiagramConstraints.LineRouting) {
                        console.warn('[WARNING] :: Module "LineRouting" is not available in Diagram component! You either misspelled the module name or forgot to load it.');
                    }
                    if ((newObj as Node).umlIndex > -1 && (obj as Node).parentId && this.nameTable[(obj as Node).parentId] &&
                        this.nameTable[(obj as Node).parentId].shape.type === 'UmlClassifier') {
                        const parent: Node = this.nameTable[(obj as Node).parentId];
                        parent.children.splice((newObj as Node).umlIndex, 0, newObj.id);
                        parent.wrapper.children.splice((newObj as Node).umlIndex, 0, newObj.wrapper);
                        parent.wrapper.measure(new Size()); parent.wrapper.arrange(parent.wrapper.desiredSize);
                        this.updateDiagramObject(parent);
                    }
                }
                args = {
                    element: newObj, cause: this.diagramActions, diagramAction: this.itemType, state: 'Changed', type: 'Addition', cancel: false
                };
                if (this.parentObject) {
                    args.parentId = this.parentObject.id;
                }
                //Removed isBlazor code
                if (obj.id !== 'helper' && !(this.diagramActions & DiagramAction.PreventCollectionChangeOnDragOver)) {
                    this.triggerEvent(DiagramEvent.collectionChange, args);
                }
                //952756 - Undo redo of adding elements dynamically is not working properly
                if (!(this.diagramActions & DiagramAction.UndoRedo) && !(this.diagramActions & DiagramAction.Group) &&
                    !(this.diagramActions & DiagramAction.PreventHistory)) {
                    //952756 - Undo redo of adding elements dynamically is not working properly
                    let undoElement: NodeModel | ConnectorModel;
                    if (obj && obj.shape && obj.shape.type === 'SwimLane' || obj && obj.shape && obj.shape.type === 'Bpmn') {
                        undoElement = obj;
                    }
                    else {
                        undoElement = newObj;
                    }
                    const entry: HistoryEntry = {
                        type: 'CollectionChanged', changeType: 'Insert', undoObject: cloneObject(undoElement),
                        redoObject: cloneObject(undoElement), category: 'Internal'
                    };
                    this.addHistoryEntry(entry);
                }
                this.parentObject = undefined;
                if (this.mode === 'SVG') {
                    this.updateSvgNodes(newObj as Node);
                    this.updateTextElementValue(newObj); this.updateDiagramObject(newObj);
                    if (isTextAnnotationNode) {
                        const con = this.nameTable[newObj.inEdges[0]];
                        this.updateDiagramObject(con);
                    }
                    if ((newObj.shape as BpmnShape).activity && (newObj.shape as BpmnShape).activity.subProcess.processes &&
                        (newObj.shape as BpmnShape).activity.subProcess.processes.length) {
                        this.updateProcesses(newObj);
                    }
                    this.updateBridging();
                }
            }
        }
        this.protectPropertyChange(propertyChangeValue); this.resetDiagramActions(DiagramAction.PublicMethod);
        if (newObj && this.layers.length > 1) { this.moveNode(newObj); }
        // Bug 890792: Exception thrown when adding a node at runtime in the unit test case.
        // The issue arises only when the diagram is not appended to the DOM. In such cases, the diagram will not be rendered, and the views property is undefined.
        // Check if views is defined before iterating. If views is defined, then refresh the canvas for each view.
        if (this.views) {
            for (const temp of this.views) {
                const view: View = this.views[`${temp}`];
                if (!(view instanceof Diagram)) { this.refreshCanvasDiagramLayer(view); }
            }
        }
        this.renderReactTemplates();
        this.itemType = 'PublicMethod';
        return newObj;
    }
    /**
     * AddElements method allows us to add diagram elements such as nodes and connectors as a collection into the diagram canvas.
     * @returns {void} -AddElements method.
     * @param { NodeModel[] | ConnectorModel[]} obj -Specifies the colelction object to be added to the diagram.
     * @public method
     **/
    public addElements(obj: NodeModel[] | ConnectorModel[]): void {
        for (let i: number = 0; i < obj.length; i++) {
            this.add(obj[parseInt(i.toString(), 10)]);
        }
        // 930450: Diagram Taking Too Long to Load Due to Complex Hierarchical Tree Layout with Path Nodes
        if (this.pathDataStorage) {
            this.pathDataStorage.clear();
        }
    }
    /**
     * getPathdata from path data storage to access the path elements points
     * @returns {PointModel[]} - Ruturns points of the path data
     * @param {string} key - Path data as key
     *
     * @private
     */
    public getPathData(key: string): PointModel[] {
        // 930450: Diagram Taking Too Long to Load Due to Complex Hierarchical Tree Layout with Path Nodes
        if (!this.pathDataStorage) {
            this.pathDataStorage = new Map();
        }
        if (!this.pathDataStorage.has(key)) {
            return [];
        }
        return this.pathDataStorage.get(key);
    }
    /**
     * setPathdata to path data storage to access the path elements points
     * @returns {void} - Set Path data method
     * @param {string} key - Path data as key
     * @param {PointModel[]} data - Path data's points
     *
     * @private
     */
    public setPathData(key: string, data: PointModel[]): void {
        // 930450: Diagram Taking Too Long to Load Due to Complex Hierarchical Tree Layout with Path Nodes
        const existingData = this.pathDataStorage.get(key) || [];
        // Push data only if existingData is empty
        if (existingData.length === 0) {
            this.pathDataStorage.set(key, data);
        }
    }
    /* tslint:enable */
    private updateSvgNodes(node: Node): void {
        if (node.children) {
            for (const j of node.children) {
                if (this.nameTable[`${j}`] && this.nameTable[`${j}`].parentId) {
                    const child: HTMLElement = getDiagramElement(j + '_groupElement', this.element.id);
                    if (child) {
                        child.parentNode.removeChild(child);
                    }
                }
            }
        }
    }
    /**
     *  updateProcesses method
     *
     * @returns { void }  updateProcesses method .\
     * @param {(Node | Connector)} node - provide the nodeId value.
     *
     * @private
     */
    public updateProcesses(node: (Node | Connector)): void {
        if (this.bpmnModule && node && node.shape && (node.shape as BpmnShape).activity &&
            (node.shape as BpmnShape).activity.subProcess.processes &&
            (node.shape as BpmnShape).activity.subProcess.processes.length) {
            const processes: string[] = (node.shape as BpmnShape).activity.subProcess.processes;
            this.moveSvgNode(node.id);
            for (const j of processes) {
                this.moveSvgNode(j);
                let edges: string[] = [];
                edges = edges.concat(this.nameTable[`${j}`].outEdges, this.nameTable[`${j}`].inEdges);
                for (let i: number = edges.length - 1; i >= 0; i--) {
                    this.moveSvgNode(edges[parseInt(i.toString(), 10)]);
                }
            }
            for (const j of processes) {
                if ((this.nameTable[`${j}`].shape as BpmnShape).activity.subProcess.processes &&
                    (this.nameTable[`${j}`].shape as BpmnShape).activity.subProcess.processes.length) {
                    this.updateProcesses(this.nameTable[`${j}`]);
                }
            }
        } else {
            this.moveSvgNode(node.id);
        }
    }
    /**
     *  moveSvgNode method
     *
     * @returns { void }  moveSvgNode method .\
     * @param {string} nodeId - provide the nodeId value.
     *
     * @private
     */
    public moveSvgNode(nodeId: string): void {
        const child: HTMLElement = getDiagramElement(nodeId + '_groupElement', this.element.id);
        const parent: HTMLElement = child.parentElement;
        child.parentNode.removeChild(child);
        parent.appendChild(child);
    }

    /**
     * Adds the given annotation to the specified node.
     *
     * @returns { void } Adds the given annotation to the specified node.\
     * @param {BpmnAnnotationModel} annotation - Object representing the annotation to be added.
     * @param {NodeModel} node - object representing the node to which the annotation will be added.
     * @deprecated
     */
    public addTextAnnotation(annotation: BpmnAnnotationModel, node: NodeModel): void {
        if (this.bpmnModule) {
            this.getBPMNTextAnnotation(node as Node, this, annotation, true);
        }
    }

    //Splice the InEdge and OutEdge of the for the node with respect to corresponding connectors that is deleting
    private spliceConnectorEdges(connector: ConnectorModel, isSource: boolean): void {
        //let node: Node;
        let edges: string[] = [];
        //let isInEdge: boolean;
        const node: Node = isSource ? this.nameTable[connector.sourceID] : this.nameTable[connector.targetID];
        if (node) {
            edges = isSource ? node.outEdges : node.inEdges;
            for (let i: number = edges.length - 1; i >= 0; i--) {
                if (edges[parseInt(i.toString(), 10)] === connector.id) {
                    edges.splice(i, 1);
                }
            }
            for (let j: number = 0; node.ports && j < node.ports.length; j++) {
                const isInEdge: boolean = isSource ? false : true;
                this.removePortEdges(node, node.ports[parseInt(j.toString(), 10)].id, connector.id, isInEdge);
            }
        }
    }

    /**
     * Remove the dependent connectors if the node is deleted
     * @returns { void } Remove the dependent connectors if the node is deleted .\
     * @param {Node} obj - provide the node value.
     *
     * @private
     */
    public removeDependentConnector(obj: Node | Connector): void {
        if (obj) {
            let connector: ConnectorModel;
            let edges: string[] = [];
            edges = edges.concat(obj.outEdges, obj.inEdges);
            for (let i: number = edges.length - 1; i >= 0; i--) {
                connector = this.nameTable[edges[parseInt(i.toString(), 10)]];
                if (connector) {
                    this.connectorTable[connector.id] = cloneObject(connector);
                    //To check for text annotation connector and remove the dependent text annotation node.
                    if ((connector as any).isBpmnAnnotationConnector) {
                        const targetNode: NodeModel = this.nameTable[connector.targetID];
                        this.removeObjectsFromLayer(connector);
                        const index: number = this.connectors.indexOf(connector);
                        if (index !== -1) {
                            this.connectors.splice(index, 1);
                        }
                        this.removeElements(connector);
                        this.removeFromAQuad(connector as IElement);
                        delete this.nameTable[connector.id];
                        const sourceNode: Node = this.nameTable[connector.sourceID];
                        if (sourceNode) {
                            const index: number = sourceNode.outEdges.indexOf(connector.id);
                            if (index !== -1) {
                                sourceNode.outEdges.splice(index, 1);
                            }
                        }
                        if (obj.id !== connector.targetID) {
                            this.remove(targetNode);
                        }
                    } else {
                        this.remove(connector);
                    }
                }
            }
        }
    }

    /**
     * Remove the dependent connectors if the node is deleted
     * @returns { void } Remove the dependent connectors if the node is deleted .\
     * @param {(NodeModel | ConnectorModel)} obj - provide the node value.
     *
     * @private
     */
    public removeObjectsFromLayer(obj: (NodeModel | ConnectorModel)): void {
        if ((obj as Node).children) {
            for (let i: number = 0; i < (obj as Node).children.length; i++) {
                const object: NodeModel = this.nameTable[(obj as Node).children[parseInt(i.toString(), 10)]];
                if (object) {
                    this.removeObjectsFromLayer(object);
                }
            }
        }
        const layer: number = this.layers.indexOf(this.commandHandler.getObjectLayer(obj.id));
        const objects: string[] = this.layers[parseInt(layer.toString(), 10)].objects;
        const objIndex: number = objects.indexOf(obj.id);
        if (objIndex > -1) {
            if (isSelected(this, obj)) {
                this.unSelect(obj);
            }
            this.layers[parseInt(layer.toString(), 10)].objects.splice(objIndex, 1);
            this.activeLayerObjectsSet.delete(obj.id);
            delete (this.layers[parseInt(layer.toString(), 10)] as Layer).zIndexTable[this.nameTable[obj.id].zIndex];
        }
    }
    /**
     * removeElements method \
     *
     * @returns { string }     removeElements method .\
     * @param {NodeModel | ConnectorModel} currentObj - provide the currentObj value.
     *
     * @private
     */
    public removeElements(currentObj: NodeModel | ConnectorModel): void {
        if (this.mode === 'SVG' || (this.mode === 'Canvas' && currentObj.shape.type === 'Native')) {
            const removeElement: HTMLElement = getDiagramElement(currentObj.id + '_groupElement', this.element.id);
            const object: NodeModel = currentObj as NodeModel;
            if ((object).ports && (object).ports.length > 0) {
                for (let i: number = 0; i < (object).ports.length; i++) {
                    const port: Port = (object).ports[parseInt(i.toString(), 10)] as Port;
                    const removePort: HTMLElement = getDiagramElement(object.id + '_' + port.id + '_groupElement', this.element.id);
                    if (removePort) {
                        removePort.parentNode.removeChild(removePort);
                    }
                }
            }
            if (removeElement) {
                removeElement.parentNode.removeChild(removeElement);
            }
        }
        this.refreshCanvasLayers();
        if (currentObj.wrapper) {
            const children: DiagramElement[] = currentObj.wrapper.children;
            let element: HTMLElement;

            let view: View;
            if (children) {
                for (let i: number = 0; i < children.length; i++) {
                    if (children[parseInt(i.toString(), 10)] instanceof DiagramNativeElement || ((children[parseInt(i.toString(), 10)].id) && (children[parseInt(i.toString(), 10)].id).indexOf('icon_content') > 0)) {
                        if ((children[parseInt(i.toString(), 10)].id).indexOf('icon_content') > 0 && this.mode === 'SVG') {
                            element = getDiagramElement(children[parseInt(i.toString(), 10)].id + '_shape_groupElement', this.element.id);
                            if (element) {
                                element.parentNode.removeChild(element);
                            }
                            element = getDiagramElement(children[parseInt(i.toString(), 10)].id + '_rect_groupElement', this.element.id);
                            if (element) {
                                element.parentNode.removeChild(element);
                            }
                        }
                        for (const elementId of this.views) {
                            removeElement(children[parseInt(i.toString(), 10)].id + '_groupElement', elementId);
                            const nodeIndex: number = this.scroller.removeCollection.indexOf(currentObj.id);
                            this.scroller.removeCollection.splice(nodeIndex, 1);
                        }
                    } else if (children[parseInt(i.toString(), 10)] instanceof DiagramHtmlElement) {
                        for (const elementId of this.views) {
                            if (this.views[`${elementId}`] instanceof Diagram || !this.preventOverviewRefresh) {
                                removeElement(currentObj.id + '_html_element', elementId);
                                removeElement(children[parseInt(i.toString(), 10)].id + '_html_element', elementId);
                                //EJ2-63598 - Added below code to check whether platform is Angular or not.
                                // If angular then we do not remove the node html element wrapper to retain the HTML element in it.
                                let canUpdate: boolean = true;
                                const parent: NodeModel = this.nameTable[(currentObj as Node).parentId];
                                //893691: HTML Template nodes are not visible after Zooming with Virtualisation
                                if ((((this as any).isAngular || (this as any).isReact) || (this as any).isVue) &&
                                    ((parent && (parent as Node).isLane) || (this.constraints & DiagramConstraints.Virtualization))) {
                                    canUpdate = false;
                                }
                                if (canUpdate) {
                                    this.clearTemplate(['nodeTemplate' + '_' + currentObj.id]);
                                    if ((children[parseInt(i.toString(), 10)] as DiagramEventAnnotation).annotationId) {
                                        this.clearTemplate(['annotationTemplate' + '_' + currentObj.id +
                                            ((children[parseInt(i.toString(), 10)] as DiagramEventAnnotation).annotationId)]);
                                    }
                                }
                            }
                        }
                    }
                    removeGradient(children[parseInt(i.toString(), 10)].id);
                }
            }
        }
    }

    private removeCommand(): void {
        // 968828 : update diagramAction for delete an element by delete key
        this.itemType = 'KeyboardDelete';
        this.remove();
        this.itemType = 'PublicMethod';
    }
    /**
     * Removes the specified object from the diagram.
     *
     * @param {NodeModel | ConnectorModel} obj - The node or connector object to be removed from the diagram.
     */
    /* tslint:disable */
    public remove(obj?: NodeModel | ConnectorModel): void {
        let selectedItems: (NodeModel | ConnectorModel)[] = [];
        selectedItems = selectedItems.concat(this.selectedItems.nodes, this.selectedItems.connectors);
        let args: ICollectionChangeEventArgs | IBlazorCollectionChangeEventArgs;
        let groupAction: boolean = false;
        if (obj) {
            obj = this.nameTable[obj.id];
            this.insertBlazorConnector(obj as Connector);
            if (obj && (canDelete(obj) || (this.diagramActions & DiagramAction.Clear))) {
                args = {
                    element: obj, cause: this.diagramActions, diagramAction: this.itemType,
                    state: 'Changing', type: 'Removal', cancel: false
                };
                //Removed isBlazor code
                if (!(this.diagramActions & DiagramAction.Clear) && (obj.id !== 'helper')) {
                    this.triggerEvent(DiagramEvent.collectionChange, args);
                }
                if (!args.cancel) {
                    if (canDelete(obj)) {
                        if (obj && obj.shape && obj.shape.type === 'SwimLane') {
                            removeSwimLane(this, obj as NodeModel);
                        }
                    }
                    if ((!(this.diagramActions & DiagramAction.UndoRedo)) && !(this.diagramActions & DiagramAction.PreventHistory) &&
                        (obj instanceof Node || obj instanceof Connector)) {
                        const entry: HistoryEntry = {
                            type: 'CollectionChanged', changeType: 'Remove', undoObject: cloneObject(obj),
                            redoObject: cloneObject(obj), category: 'Internal'
                        };
                        if (!(this.diagramActions & DiagramAction.Clear)) {
                            if ((obj as Node).children && !(obj as Node).isLane && !(obj as Node).isPhase && (obj as Node).children.length > 0 && this.undoRedoModule && this.layout.type === 'None') {
                                this.historyManager.startGroupAction();
                                groupAction = true;
                            }
                        }
                        //875087 - Restrict removing dependent connectors when moveing between layers
                        if ((obj instanceof Node || obj instanceof Connector) && this.deleteDependentConnector) {
                            this.removeDependentConnector(obj);
                        }
                        if (!(obj as Node).isLane && !(obj as Node).isPhase && !((obj as Node).isHeader
                            && this.nameTable[obj.parentId].shape.type === 'Container')) {
                            if (!(this.diagramActions & DiagramAction.Clear) && !this.isStackChild(obj as Node)) {
                                this.addHistoryEntry(entry);
                            }
                        }
                    }
                    if ((obj.shape as BpmnShape).shape === 'TextAnnotation') {
                        this.removeDependentConnector(obj as Node);
                    }
                    if ((obj as Node).children && !(obj as Node).isLane && !(obj as Node).isPhase &&
                        (!(this.diagramActions & DiagramAction.UndoRedo) || !isBlazor())) {
                        this.deleteGroup(obj as Node);
                    }
                    if ((obj as Node | Connector).parentId) {
                        this.deleteChild(obj, undefined, true);
                        if (this.nameTable[(obj as Node | Connector).parentId] && this.nameTable[(obj as Node | Connector).parentId].shape.type === 'UmlClassifier') {
                            this.updateDiagramObject(this.nameTable[(obj as Node | Connector).parentId]);
                            this.updateConnectorEdges(this.nameTable[(obj as Node | Connector).parentId]);
                        }
                    }
                    let index: number;
                    this.diagramActions = this.diagramActions | DiagramAction.PublicMethod;
                    const currentObj: NodeModel | ConnectorModel = this.nameTable[obj.id];
                    if (currentObj instanceof Node) {
                        if (currentObj.shape.type === 'Bpmn' && this.bpmnModule) {
                            this.bpmnModule.removeBpmnProcesses(currentObj, this);
                        }
                        if (currentObj.parentId && this.nameTable[currentObj.parentId]
                            && this.nameTable[currentObj.parentId].shape.type === 'Container'
                            || currentObj.shape.type === 'Container') {
                            removeChildFromContainer(currentObj,this);
                        }
                        if (currentObj.isLane || currentObj.isPhase || currentObj.shape.type === 'SwimLane') {
                            const swimLaneNode: NodeModel = (currentObj.isLane || currentObj.isPhase) ?
                                this.nameTable[(currentObj as Node).parentId] : this.nameTable[currentObj.id];

                            const grid: GridPanel = swimLaneNode.wrapper.children[0] as GridPanel;
                            if (currentObj.isLane) {
                                removeLane(this, currentObj, swimLaneNode);
                            } else if (currentObj.isPhase) {
                                removePhase(this, currentObj, swimLaneNode);
                            }
                        }
                        index = (this.nodes as NodeModel[]).indexOf(currentObj);
                        // Removed isBlazor code
                        if (index !== -1) {
                            this.crudDeleteNodes.push(this.nameTable[currentObj.id]);
                            this.nodes.splice(index, 1);
                            this.updateNodeEdges(currentObj);
                        }
                    } else {
                        index = this.connectors.indexOf(currentObj as ConnectorModel);
                        //Removed isBlazor code
                        if (index !== -1) {
                            this.crudDeleteNodes.push(this.nameTable[currentObj.id]);
                            this.connectors.splice(index, 1);
                        }
                        this.updateEdges(currentObj as Connector);
                        this.spliceConnectorEdges(obj as ConnectorModel, true);
                        this.spliceConnectorEdges(obj as ConnectorModel, false);
                    }
                    if ((!this.isServerUpdate) && !(this.blazorActions & BlazorAction.GroupClipboardInProcess)) {
                        this.commandHandler.getBlazorOldValues();
                    }
                    if (groupAction) {
                        this.historyManager.endGroupAction();
                    }
                    if (isSelected(this, currentObj)) {
                        this.unSelect(currentObj);
                    }
                    if (!(currentObj as Node).isPhase) {
                        this.removeObjectsFromLayer(obj);
                        if (this.currentDrawingObject) {
                            this.currentDrawingObject.wrapper = undefined;
                        }
                        delete this.nameTable[obj.id];
                        if (selectedItems.length > 0 && selectedItems[0].id === currentObj.id && (currentObj as Node).parentId) {
                            const parentnode = this.nameTable[(currentObj as Node).parentId];
                            if (parentnode && parentnode.isLane && this.nameTable[parentnode.parentId].shape.type === 'SwimLane') {
                                const swimLaneNode: NodeModel = this.nameTable[parentnode.parentId];
                                removeLaneChildNode(this, swimLaneNode, parentnode, currentObj as NodeModel);
                            }

                        }
                        this.removeElements(currentObj);
                        this.updateBridging();
                        if (this.mode !== 'SVG') {
                            this.refreshDiagramLayer();
                        }
                        if (!(this.diagramActions & DiagramAction.Clear)) {
                            this.removeFromAQuad(currentObj as IElement);
                            args = {
                                element: obj, cause: this.diagramActions, diagramAction: this.itemType,
                                state: 'Changed', type: 'Removal', cancel: false
                            };
                            //Removed isBlazor code
                            if (obj.id !== 'helper') {
                                this.triggerEvent(DiagramEvent.collectionChange, args);
                            }
                            this.resetTool();
                        }
                    }
                }
            }
            // EJ2:943679 - Exception occurs while serialize the diagram when annotation is selected
            const selectedObjects: Selector = this.selectedItems as Selector;
            if (selectedObjects.annotation) {
                this.clearSelection();
            }
        } else if (selectedItems.length > 0) {
            if (this.undoRedoModule) {
                this.historyManager.startGroupAction();
                this.blazorActions |= BlazorAction.GroupingInProgress;
                groupAction = true;
            }
            //Removed isBlazor code
            for (let i: number = 0; i < selectedItems.length; i++) {

                const node: Node = selectedItems[parseInt(i.toString(), 10)] as Node;
                const parent: Node = this.nameTable[node.parentId] as Node;
                if (this.nameTable[selectedItems[parseInt(i.toString(), 10)].id]) {
                    //Removed isBlazor code
                    // 912905: Multi-selecting and deleting swimlane objects causes the diagram to break
                    if (parent && parent.shape instanceof SwimLane && !node.isPhase) {
                        if (node.isLane) {
                            const parentHeader: number = (parent.shape as SwimLaneModel).header.id ? parent.shape.header.height : 0;
                            if ((this.selectedItems.wrapper.bounds.x <= parent.wrapper.bounds.x &&
                                this.selectedItems.wrapper.bounds.width >= parent.wrapper.bounds.width &&
                                (parent.shape as SwimLaneModel).orientation === 'Horizontal') ||
                                (this.selectedItems.wrapper.bounds.y <= parent.wrapper.bounds.y + parentHeader &&
                                this.selectedItems.wrapper.bounds.height >= parent.wrapper.bounds.height - parentHeader &&
                                (parent.shape as SwimLaneModel).orientation === 'Vertical')) {
                                if (canDelete(parent) || (parent.shape as SwimLaneModel).lanes.length > 1) {
                                    this.remove(selectedItems[parseInt(i.toString(), 10)]);
                                }
                            }
                        }
                    } else {
                        this.remove(selectedItems[parseInt(i.toString(), 10)]);
                    }
                    //Removed isBlazor code

                }
            }
            if (groupAction) {
                this.blazorActions &= ~BlazorAction.GroupingInProgress;
                this.isServerUpdate = true;
                this.commandHandler.getBlazorOldValues();
                this.UpdateBlazorDiagramModelCollection(undefined, undefined, undefined, true);
                this.historyManager.endGroupAction();
                this.isServerUpdate = false;
            }
            this.clearSelection();
        }
        if (!(obj && (canDelete(obj) || (this.diagramActions & DiagramAction.Clear)))) {
            if ((!(this.diagramActions & DiagramAction.UndoRedo)) && !(this.diagramActions & DiagramAction.PreventHistory) &&
                (obj instanceof Node || obj instanceof Connector)) {
                const entry: HistoryEntry = {
                    type: 'ConnectionChanged', undoObject: cloneObject(obj),
                    redoObject: cloneObject(obj), category: 'Internal'
                };
                if (!(obj as Node).isLane && !(obj as Node).isPhase && !((obj as Node).isHeader
                    && this.nameTable[obj.parentId]
                    && this.nameTable[obj.parentId].shape.type === 'Container')) {
                    if (!(this.diagramActions & DiagramAction.Clear) && !this.isStackChild(obj as Node)) {
                        this.addHistoryEntry(entry);
                    }
                }
            }
        }

        this.tooltipObject.close();
        if (obj && obj.id !== 'helper' && this.lineRoutingModule && (this.constraints & DiagramConstraints.LineRouting) &&
            (obj instanceof Node) && (this.layout.type !== 'ComplexHierarchicalTree')) {
            const INFLATE_MARGIN: number = 40;
            const nodeBounds: Rect = getBounds(obj.wrapper);
            nodeBounds.Inflate(INFLATE_MARGIN);

            const nearbyObjects: Array<NodeModel | ConnectorModel> = this.spatialSearch.findObjects(nodeBounds);
            if (this.avoidLineOverlappingModule) {
                this.avoidLineOverlappingModule.removeConnectors(nearbyObjects);
            }
            this.lineRoutingModule.renderVirtualRegion(this, true);
            for (const item of nearbyObjects) {
                if (item instanceof Connector && item.type === 'Orthogonal') {
                    this.lineRoutingModule.refreshConnectorSegments(this, item, true);
                }
            }
        }
    }
    /* tslint:enable */


    private isStackChild(obj: Node): boolean {
        let isstack: boolean;
        const parent: Node = this.nameTable[obj.parentId];
        if (obj && obj.parentId && parent.container &&
            (parent.container.type === 'Stack' &&
                this.nameTable[(obj as Node).parentId].shape.type !== 'UmlClassifier')) {
            isstack = true;
            const redoElement: StackEntryObject = {
                sourceIndex: parent.wrapper.children.indexOf(obj.wrapper), source: obj,
                target: undefined, targetIndex: undefined
            };
            const entry: HistoryEntry = {
                type: 'StackChildPositionChanged', redoObject: {
                    sourceIndex: undefined, source: obj,
                    target: undefined, targetIndex: undefined
                } as NodeModel,
                undoObject: redoElement as NodeModel,
                category: 'Internal'
            };
            if (!(this.diagramActions & DiagramAction.UndoRedo)) {
                this.addHistoryEntry(entry);
            }
        }
        return isstack;
    }
    /** @private */

    public deleteChild(node: NodeModel | ConnectorModel | string, parentNode?: NodeModel, allowChildInSwimlane?: boolean): void {
        let id: string;
        parentNode = parentNode ? this.nameTable[parentNode.id] : this.nameTable[(node as Node).parentId];
        if (typeof node === 'string') {
            id = node;
        } else {
            id = node.id;
        }
        if (parentNode && parentNode.children) {
            for (let i: number = 0; i < parentNode.children.length; i++) {
                if (parentNode.children[parseInt(i.toString(), 10)] === id) {
                    parentNode.children.splice(i, 1);
                    for (let j: number = 0; j < parentNode.wrapper.children.length; j++) {
                        if (parentNode.wrapper.children[parseInt(j.toString(), 10)].id === id) {
                            parentNode.wrapper.children.splice(j, 1);
                        }
                    }
                    // Bug 841849: Swimlane child are not positioned properly and throw exception after deleting and then undoing.
                    // Added below condition to skip the child deletion inside swimlane when we add phase at runtime and delete swimlane.
                    if (!allowChildInSwimlane) {
                        // EJ2-57179 - Below lines added to remove the childs to swimlane after Redo.
                        const swimlaneNode: NodeModel = this.getObject((parentNode as Node).parentId);
                        if (swimlaneNode && (swimlaneNode as Node).shape instanceof SwimLane) {
                            for (let h: number = 0; h < ((swimlaneNode as Node).shape as SwimLane).lanes.length; h++) {
                                const laneId: string[] = (node as Node).parentId.split((swimlaneNode as Node).id);
                                if (((swimlaneNode as Node).shape as SwimLane).lanes[parseInt(h.toString(), 10)].id
                                    === laneId[1].slice(0, -1)) {
                                    for (let y: number = 0;
                                        y < ((swimlaneNode as Node).shape as SwimLane).lanes[parseInt(h.toString(), 10)].children.length;
                                        y++) {
                                        if ((node as Node).id ===
                                            ((swimlaneNode as Node).shape as SwimLane).lanes[parseInt(
                                                h.toString(), 10)].children[parseInt(y.toString(), 10)].id) {
                                            ((swimlaneNode as Node).shape as SwimLane).lanes[parseInt(
                                                h.toString(), 10)].children.splice(y, 1);
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            parentNode.wrapper.measure(new Size());
            parentNode.wrapper.arrange(parentNode.wrapper.desiredSize);
        }
    }

    /**
     * addChild method \
     *
     * @returns { string }     addChild method .\
     * @param {NodeModel} node - provide the node value.
     * @param {string | NodeModel | ConnectorModel} child - provide the child value.
     * @param {number} index - provide the layoutOrientation value.
     *
     * @private
     */
    public addChild(node: NodeModel, child: string | NodeModel | ConnectorModel, index?: number): string {
        let id: string;
        const parentNode: NodeModel = this.nameTable[node.id];
        if (!parentNode.children) { parentNode.children = []; }
        if (parentNode.children) {
            if (typeof child === 'string') {
                if (this.nameTable[`${child}`]) {
                    id = child;
                }
            } else {
                id = child.id = child.id || randomId();
                this.add(child);
            }
            if (id && (!(child as Node).umlIndex || (child as Node).umlIndex === -1)) {
                const childNode: NodeModel = this.nameTable[`${id}`];
                (childNode as Node).parentId = parentNode.id;
                if (parentNode.container && parentNode.container.type === 'Stack') {
                    this.updateStackProperty(parentNode as Node, childNode as Node);
                }
                if (index) {
                    parentNode.children.splice(index, 0, id);
                    parentNode.wrapper.children.splice(index, 0, childNode.wrapper);
                } else {
                    parentNode.children.push(id);
                    parentNode.wrapper.children.push(childNode.wrapper);
                    // SF-362880 - Below lines added for adding the childs to swimlane after Undo.
                    const swimlane: NodeModel = this.getObject((node as Node).parentId);
                    let childAlreadyInCollection: boolean = false;
                    if (swimlane && (swimlane as Node).shape instanceof SwimLane) {
                        for (let h: number = 0; h < ((swimlane as Node).shape as SwimLane).lanes.length; h++) {
                            const lane: LaneModel = findLane(parentNode as Node, this);
                            if (((swimlane as Node).shape as SwimLane).lanes[parseInt(h.toString(), 10)].id === lane.id) {
                                //Bug 876330: After performing cut operations followed by an undo, lanes and nodes in the swimlane are not rendered properly.
                                // To avoid adding the child node multiple times in the collection.
                                for (let i: number = 0;
                                    i < ((swimlane as Node).shape as SwimLane).lanes[parseInt(h.toString(), 10)].children.length; i++) {
                                    if (((swimlane as Node).shape as SwimLane).lanes[parseInt(
                                        h.toString(), 10)].children[parseInt(i.toString(), 10)].id === childNode.id) {
                                        childAlreadyInCollection = true;
                                        break;
                                    }
                                }
                                if (!childAlreadyInCollection) {
                                    ((swimlane as Node).shape as SwimLane).lanes[parseInt(h.toString(), 10)].children.push(childNode);
                                }
                                break;
                            }
                        }
                    }
                }
                parentNode.wrapper.measure(new Size());
                parentNode.wrapper.arrange(parentNode.wrapper.desiredSize);
                if (!(parentNode as Node).isLane) {
                    this.nameTable[node.id].width = parentNode.wrapper.actualSize.width;
                    this.nameTable[node.id].height = parentNode.wrapper.actualSize.height;
                    this.nameTable[node.id].offsetX = parentNode.wrapper.offsetX;
                    this.nameTable[node.id].offsetY = parentNode.wrapper.offsetY;
                }
                if (parentNode.container !== undefined) {
                    childNode.offsetX = childNode.wrapper.offsetX;
                    childNode.offsetY = childNode.wrapper.offsetY;
                }
                if (!(parentNode as Node).parentId ||
                    ((this.nameTable[(parentNode as Node).parentId] as Node) &&
                        (this.nameTable[(parentNode as Node).parentId] as Node).shape.type !== 'SwimLane')) {
                    this.updateDiagramObject(parentNode);
                }
            }
        }
        return id;
    }

    /**
     * removeChild method \
     *
     * @returns { string }     removeChild method .\
     * @param {NodeModel} node - provide the node value.
     * @param {string | NodeModel | ConnectorModel} child - provide the child value.
     *
     * @private
     */
    public removeChild(node: NodeModel, child: string | NodeModel | ConnectorModel): string {
        let id: string;
        const parentNode: NodeModel = this.nameTable[node.id];
        if (!parentNode.children) {
            parentNode.children = [];
        }
        if (parentNode.children) {
            if (typeof child === 'string') {
                if (this.nameTable[`${child}`]) {
                    id = child;
                }
            } else {
                id = child.id = child.id || randomId();
            }
            if (id && (!(child as Node).umlIndex || (child as Node).umlIndex === -1)) {
                const childNode: NodeModel | ConnectorModel = this.nameTable[`${id}`];
                (childNode as Node | Connector).parentId = '';
                if (parentNode.container && parentNode.container.type === 'Stack') {
                    this.updateStackProperty(parentNode as Node, childNode as Node);
                }
                for (let i: number = 0; i < parentNode.children.length; i++) {
                    if (parentNode.children[parseInt(i.toString(), 10)] === id) {
                        parentNode.children.splice(i, 1);
                        for (let j: number = 0; j < parentNode.wrapper.children.length; j++) {
                            if (parentNode.wrapper.children[parseInt(j.toString(), 10)] === childNode.wrapper) {
                                parentNode.wrapper.children.splice(j, 1);
                            }
                        }
                    }
                }
                parentNode.wrapper.measure(new Size());
                parentNode.wrapper.arrange(parentNode.wrapper.desiredSize);
                if (!(parentNode as Node).isLane) {
                    this.nameTable[node.id].width = parentNode.wrapper.actualSize.width;
                    this.nameTable[node.id].height = parentNode.wrapper.actualSize.height;
                    this.nameTable[node.id].offsetX = parentNode.wrapper.offsetX;
                    this.nameTable[node.id].offsetY = parentNode.wrapper.offsetY;
                }
                if (!(parentNode as Node).parentId ||
                    ((this.nameTable[(parentNode as Node).parentId] as Node) &&
                        (this.nameTable[(parentNode as Node).parentId] as Node).shape.type !== 'SwimLane')) {
                    this.updateDiagramObject(parentNode);
                }
            }
        }
        return id;
    }

    /**
     * Clears all nodes and objects in the diagram, effectively resetting the diagram to an empty state.
     *
     * @returns { void }     Clears all nodes and objects in the diagram, effectively resetting the diagram to an empty state.\
     * @deprecated
     */
    public clear(): void {
        this.clearObjects();
        this.clearLayers();
    }
    //Bug 872106: Layer object in diagram doesnot removed in clear method
    private clearLayers(): void {
        const layerCount: number = this.layers.length;
        for (let i: number = layerCount - 1; i >= 0; i--) {
            this.removeLayer(this.layers[parseInt(i.toString(), 10)].id);
        }
        //Create default layer
        const defaultLayer: LayerModel = {
            id: 'default_layer', visible: true, lock: false, objects: [], zIndex: 0,
            objectZIndex: -1, zIndexTable: {}
        } as Layer;
        this.commandHandler.addLayer(defaultLayer, null, true);
        this.setActiveLayer(this.layers[this.layers.length - 1].id);
    }

    private clearObjects(collection?: (NodeModel | ConnectorModel)[]): void {
        let objects: (NodeModel | ConnectorModel)[] = [];
        if (!collection) {
            objects = objects.concat(this.nodes);
            objects = objects.concat(this.connectors);
        } else {
            objects = collection;
        }
        this.diagramActions = this.diagramActions | DiagramAction.Clear;
        // Removed isBlazor code
        for (const obj of objects) {
            if (this.nameTable[obj.id]) {
                this.remove(obj);
            }
        }
        this.diagramActions = this.diagramActions & ~DiagramAction.Clear;
        this.spatialSearch = new SpatialSearch(this.nameTable);
        this.initHistory();
    }

    private startEditCommad(): void {
        let laneHeader: NodeModel;
        const node: NodeModel = (this.selectedItems.nodes[0]) ? this.selectedItems.nodes[0] : undefined;
        if (node && node instanceof Node) {
            if ((node as Node).isLane && (node as Node).parentId) {
                const swimlane: NodeModel = this.nameTable[(node as Node).parentId];
                const lanes: LaneModel[] = (swimlane.shape as SwimLaneModel).lanes;
                const canvasId: string = (node.id.slice(swimlane.id.length));
                const currentParentId: string = canvasId.substring(0, canvasId.length - 1);
                for (let i: number = 0; i < lanes.length; i++) {
                    if (node.isLane && currentParentId === lanes[parseInt(i.toString(), 10)].id) {
                        laneHeader = this.nameTable[(lanes[parseInt(i.toString(), 10)] as LaneModel).header.id];
                    }
                }
            } else if (node.shape.type === 'SwimLane' && (node.shape as SwimLaneModel).header && (node.shape as SwimLane).hasHeader) {
                const id: string = (node.wrapper.children[0] as GridPanel).rows[0].cells[0].children[0].id;
                laneHeader = this.nameTable[`${id}`];
            }
        }
        this.startTextEdit(laneHeader);
    }

    /* tslint:disable */
    /**
     * Initiate the editing mode for a specific annotation within a node or connector.
     *
     * @returns { void }  Initiate the editing mode for a specific annotation within a node or connector. \
     * @param {NodeModel | ConnectorModel} node - The node or connector containing the annotation to be edited.
     * @param {string} id - The ID of the annotation to be edited within the node or connector.
     */
    public startTextEdit(node?: NodeModel | ConnectorModel, id?: string): void {
        if ((!canZoomPan(this) && !canMultiSelect(this)) || canSingleSelect(this)) {
            this.textEditing = true; const transform: TransformFactor = this.scroller.transform;
            const scale: number = canZoomTextEdit(this) ? transform.scale : 1; const minWidth: number = 90;
            let text: string; let bounds: Size; let attributes: Object; let x: number; let y: number; let textWrapper: DiagramElement;
            if (!node) {
                node = (this.selectedItems.nodes[0]) ? this.selectedItems.nodes[0] : this.selectedItems.connectors[0];
            }
            if (node) {
                //Removed isBlazor code
                //893031: Exception throws while double click on UML Classifier connector
                //Added the condition that the node is not an instance of a connector
                if (node.shape && node.shape.type === 'UmlClassifier' && !(node instanceof Connector)) { node = this.nameTable[(node as Node).children[0]]; }
                let bpmnAnnotation: boolean = false;
                if (!textWrapper) {
                    if (node.shape.type !== 'Text' && node.annotations.length === 0) {
                        if (!(node.constraints & NodeConstraints.ReadOnly)) {
                            this.activeLabel.isGroup = true;
                            this.startGroupAction();
                            this.addLabels(node as Node, [{ id: randomId(), content: '' }]);
                        }
                    }
                    if (!id && ((node.shape.type !== 'Text' && node.annotations.length > 0) || (node.shape.type === 'Text'))) {
                        //(EJ2-840331)-Double click on node annotation will open the edit of invisible annotation
                        if (node.shape.type === 'Text') {
                            id = (node.wrapper.children[0].id).split('_')[1];
                        }
                        else {
                            for (let i: number = node.annotations.length - 1; i >= 0; i--) {
                                if (node.annotations[parseInt(i.toString(), 10)].visibility) {
                                    id = node.annotations[parseInt(i.toString(), 10)].id;
                                }
                            }
                        }
                    }
                    if (id) { textWrapper = this.getWrapper(node.wrapper, id); }
                } else { bpmnAnnotation = true; }
                if (node && textWrapper && !(textWrapper instanceof DiagramHtmlElement) &&
                    (!enableReadOnly(textWrapper, node) || bpmnAnnotation)) {
                    const style: TextStyleModel = ((textWrapper.style) as TextStyleModel); let maxWidth: number;
                    maxWidth = textWrapper.bounds.width < node.wrapper.bounds.width ? textWrapper.bounds.width : node.wrapper.bounds.width;
                    maxWidth = minWidth > maxWidth ? minWidth : maxWidth;
                    let textEditing: HTMLElement = document.getElementById(this.element.id + '_editTextBoxDiv');
                    let textArea: HTMLTextAreaElement = document.getElementById(this.element.id + '_editBox') as HTMLTextAreaElement;
                    text = textArea ? textArea.value : (textWrapper as TextElement).content;
                    this.activeLabel.text = text;
                    if (!textEditing && !textArea) {
                        textEditing = createHtmlElement('div', {});
                        textArea = createHtmlElement('textarea', {}) as HTMLTextAreaElement;
                        this.diagramCanvas.appendChild(textEditing);
                        textEditing.appendChild(textArea);
                        textArea.appendChild(document.createTextNode(text));
                    }
                    bounds = measureHtmlText(textWrapper.style, text, undefined, undefined, maxWidth);
                    if (bounds.isEmpty()) {
                        if (node.shape.type !== 'Text') {
                            bounds = new Size(
                                (findAnnotation(node, (textWrapper.id).split(node.id + '_')[1]) as
                                    PathAnnotationModel | ShapeAnnotationModel).width || 50,
                                (textWrapper.style as TextStyleModel).fontSize);
                        } else {
                            bounds = new Size(
                                ((node as NodeModel).width > 50) ? 50 : (node as NodeModel).width,
                                (textWrapper.style as TextStyleModel).fontSize);
                        }
                    }
                    if ((node as Node).parentId && this.nameTable[(node as Node).parentId].shape.type === 'UmlClassifier') {
                        bounds.width = node.wrapper.bounds.width - 20;
                        x = ((((node.wrapper.bounds.center.x + transform.tx) * transform.scale) - (bounds.width / 2) * scale) - 2.5);
                        y = ((((node.wrapper.bounds.center.y + transform.ty) * transform.scale) - (bounds.height / 2) * scale) - 3);
                        (textWrapper.style as TextStyleModel).textAlign = 'Left';
                    } else {
                        bounds.width = Math.max(bounds.width, 50);
                        x = ((((textWrapper.bounds.center.x + transform.tx) * transform.scale) - (bounds.width / 2) * scale) - 2.5);
                        y = ((((textWrapper.bounds.center.y + transform.ty) * transform.scale) - (bounds.height / 2) * scale) - 3);
                    }
                    if ((textWrapper as TextElement).flippedPoint && isLabelFlipped(textWrapper as TextElement)) {
                        const transX: number = (textWrapper as TextElement).flippedPoint.x - textWrapper.corners.topLeft.x;
                        const transY: number = (textWrapper as TextElement).flippedPoint.y - textWrapper.corners.topLeft.y;
                        x+= transX; y+= transY;
                        (textWrapper as TextElement).flipTransformOffset = { x: transX, y: transY };
                    }
                    attributes = {
                        'id': this.element.id + '_editTextBoxDiv', 'style': 'position: absolute' + ';left:' + x + 'px;top:' +
                            y + 'px;width:' + ((bounds.width + 1) * scale) + 'px;height:' + (bounds.height * scale) +
                            'px; containerName:' + node.id + ';'
                    };
                    setAttributeHtml(textEditing, attributes);
                    //879137 - aria-label missing in annotation textEdit mode.
                    attributes = {
                        'aria-label': text, 'id': this.element.id + '_editBox', 'style': 'width:' + ((bounds.width + 1) * scale) +
                            'px;height:' + (bounds.height * scale) + 'px;resize: none;outline: none;overflow: hidden;' +
                            ';font-family:' + style.fontFamily +
                            ';font-size:' + (style.fontSize * scale) + 'px;text-align:' +
                            ((textWrapper.style as TextStyleModel).textAlign.toLocaleLowerCase()) + ';', 'class': 'e-diagram-text-edit'
                    };
                    setAttributeHtml(textArea, attributes);
                    textArea.style.fontWeight = (style.bold) ? 'bold' : '';
                    textArea.style.fontStyle = (style.italic) ? 'italic' : '';
                    textArea.style.lineHeight = (style.fontSize * 1.2 + 'px;').toString();
                    textArea.style.textDecoration = (style.textDecoration) ? style.textDecoration : '';
                    this.activeLabel.parentId = node.id; this.activeLabel.id = id;
                    textWrapper.visible = false;
                    this.updateDiagramObject(node);
                    this.diagramActions = this.diagramActions | DiagramAction.TextEdit;
                    if (!this.isTriggerEvent) {
                        EventHandler.add(textArea, 'input', this.eventHandler.inputChange, this.eventHandler);
                        EventHandler.add(textArea, 'focusout', this.focusOutEdit, this);
                        textArea.select();
                    }
                }
            }
        }
    }

    private updateConnectorfixedUserHandles(connector: Connector): void {
        if (connector.fixedUserHandles.length) {
            let fixedUserHandleWrapper: DiagramElement;
            for (const fixedUserHandle of connector.fixedUserHandles) {
                fixedUserHandleWrapper = this.getWrapper(connector.wrapper, fixedUserHandle.id) as DiagramElement;
                connector.updateAnnotation(
                    fixedUserHandle as ConnectorFixedUserHandle,
                    connector.intermediatePoints, connector.wrapper.bounds, fixedUserHandleWrapper);
            }
        }
        connector.wrapper.measure(new Size(connector.wrapper.width, connector.wrapper.height));
        connector.wrapper.arrange(connector.wrapper.desiredSize);
    }

    /* tslint:enable */
    private updateNodeExpand(node: Node, visibility: boolean): void {
        for (let i: number = 0; i < node.outEdges.length; i++) {
            const connector: Connector = this.nameTable[node.outEdges[parseInt(i.toString(), 10)]];
            const target: Node = this.nameTable[connector.targetID];
            connector.visible = visibility;
            if (target) {
                if (!visibility) {
                    this.updateElementVisibility(connector.wrapper, connector, false);
                    target.isExpanded = visibility;
                }
                this.updateNodeExpand(target, target.isExpanded);
                target.visible = visibility;
                if (!visibility) {
                    this.updateElementVisibility(target.wrapper, target, false);
                }
            }

        }
    }

    private updateConnectorAnnotation(connector: Connector): void {
        if (connector.annotations.length) {
            let annotationWrapper: TextElement;
            for (const annotation of connector.annotations) {
                annotationWrapper = this.getWrapper(connector.wrapper, annotation.id) as TextElement;
                connector.updateAnnotation(
                    annotation as PathAnnotation,
                    connector.intermediatePoints, connector.wrapper.bounds, annotationWrapper,
                    (this.diagramActions & DiagramAction.Interactions));
            }
        }
        connector.wrapper.measure(new Size(connector.wrapper.width, connector.wrapper.height));
        connector.wrapper.arrange(connector.wrapper.desiredSize);
    }
    private removeChildrenFromLayout(nodes: INode[]): INode[] {
        const nodesCollection: INode[] = []; let node: INode;
        const parentId: string = 'parentId';
        const processId: string = 'processId';
        for (let i: number = 0; i < nodes.length; i++) {
            node = nodes[parseInt(i.toString(), 10)];
            if (!node[`${parentId}`] && !node[`${processId}`]) {
                nodesCollection.push(node);
            }
        }
        return nodesCollection;
    }

    /* tslint:disable */
    /**
     * Automatically updates the diagram objects based on the type of the layout.
     * @returns { ILayout | boolean }  Automatically updates the diagram objects based on the type of the layout.\
     */
    public doLayout(): ILayout | boolean {
        let update: boolean = false; let layout: ILayout;
        const canDoOverlap: boolean = (this.layout.type === 'ComplexHierarchicalTree' || this.layout.type === 'HierarchicalTree');
        const propChange: boolean = this.isProtectedOnChange; this.protectPropertyChange(true);
        const nodes: INode[] = this.removeChildrenFromLayout(this.nodes as INode[]);
        const canEnableRouting: boolean = this.layout.enableRouting && this.layout.type === 'ComplexHierarchicalTree';
        const viewPort: PointModel = { x: this.scroller.viewPortWidth, y: this.scroller.viewPortHeight };
        let isRoutingConnectorsRefreshed: boolean = false;
        if (this.layout.type !== 'None') {
            if (this.organizationalChartModule || this.mindMapChartModule || this.radialTreeModule || this.symmetricalLayoutModule
                || this.complexHierarchicalTreeModule || this.flowchartLayoutModule) {
                // Trigger the layoutUpdated event with the state set to 'Started' and the current layout type.
                const args: ILayoutUpdatedEventArgs = { state: 'Started', type: this.layout.type };
                this.triggerEvent(DiagramEvent.layoutUpdated, args);
            }

            //Bug 862601: Connectors are not rendered properly with lineRouting and lineDistribution enables during doLayout process.
            //Removed initLineDistribution method call here and added it below after the complex hierarchical tree doLayout process.
            if (this.organizationalChartModule) {
                layout = this.organizationalChartModule.updateLayout(
                    nodes, this.nameTable, this.layout as Layout,
                    viewPort, this.dataSourceSettings.id, this.diagramActions);
                update = true;
                if (this.canDistribute(canEnableRouting, canDoOverlap)) {
                    this.lineDistributionModule.initLineDistribution(this.layout as Layout, this);
                }
                if (this.layoutAnimateModule && layout.rootNode && !this.diagramActions) {
                    this.updateNodeExpand(layout.rootNode as Node, layout.rootNode.isExpanded);
                }
                // EJ2-58221 - added to render the layout properly based on parent node isExpanded property.
                else if (!this.layoutAnimateModule && layout.rootNode && !layout.rootNode.isExpanded && !this.canExpand) {
                    this.updateNodeExpand(layout.rootNode as Node, layout.rootNode.isExpanded);
                }
            } else if (this.mindMapChartModule) {
                if (nodes && nodes.length > 0) {
                    this.mindMapChartModule.updateLayout(
                        nodes, this.nameTable, this.layout as Layout,
                        viewPort, this.dataSourceSettings.id, this.dataSourceSettings.root);
                }
                update = true;

            } else if (this.radialTreeModule) {
                this.radialTreeModule.updateLayout(
                    nodes, this.nameTable, this.layout as Layout,
                    viewPort);
                update = true;
            } else if (this.symmetricalLayoutModule) {
                this.symmetricalLayoutModule.maxIteration = this.layout.maxIteration;
                this.symmetricalLayoutModule.springLength = this.layout.springLength;
                this.symmetricalLayoutModule.springFactor = this.layout.springFactor;
                this.symmetricalLayoutModule.updateLayout(
                    nodes as IGraphObject[], this.connectors as IGraphObject[],
                    this.symmetricalLayoutModule, this.nameTable, this.layout as Layout, viewPort);
                update = true;
            } else if (this.complexHierarchicalTreeModule) {
                //Bug 862601: Connectors are not rendered properly with lineRouting and lineDistribution enables during doLayout process.
                //As the initLineDistribution method call removed from above and added below doLayout, we need to set diagram value and clear obstacle collection
                // of connectors.
                if (this.canDistribute(canEnableRouting, canDoOverlap)) {
                    (this.lineDistributionModule as any).diagram = this;
                    const obstacleCollection: string = 'obstaclePointCollection';
                    this.connectors.forEach((connector) => {
                        connector[`${obstacleCollection}`] = [];
                    });
                }
                const nodes: INode[] = this.complexHierarchicalTreeModule.getLayoutNodesCollection(this.nodes as INode[]);
                if (nodes.length > 0) {
                    // eslint-disable-next-line max-len
                    this.complexHierarchicalTreeModule.doLayout(nodes, this.nameTable, this.layout as Layout, viewPort, this);
                }
                update = true;
                //initLineDistribution method call after doLayout.
                if (this.canDistribute(canEnableRouting, canDoOverlap)) {
                    this.lineDistributionModule.initLineDistribution((this.layout as Layout), this);
                }
            } else if (this.flowchartLayoutModule) {
                this.flowchartLayoutModule.updateLayout(this.nodes, this);
                update = true;
            }
            else {
                const moduleName = this.layout.type === 'OrganizationalChart' ? 'HierarchicalTree' : this.layout.type;
                console.warn('[WARNING] :: Module ' + moduleName + ' is not available in Diagram component! You either misspelled the module name or forgot to load it.');
            }
            if (update) {
                this.preventDiagramUpdate = true;
                const connectors: Object = {};
                const updatedNodes: NodeModel[] = nodes as NodeModel[];
                // BLAZ-22230 - Added condition to check if canUpdateTemplate is false means then we can update the template for blazor
                //Removed isBlazor code
                for (const obj of updatedNodes) {
                    const node: Node = obj as Node;
                    if (!this.preventNodesUpdate && (!this.diagramActions || !(this.diagramActions & DiagramAction.PreventIconsUpdate))) {
                        this.updateIcon(node);
                        this.updateDefaultLayoutIcons(node);
                    }
                    this.preventNodesUpdate = true;
                    this.nodePropertyChange(node, {} as Node, { offsetX: node.offsetX, offsetY: node.offsetY } as Node, true);
                    this.preventNodesUpdate = false;
                    node.wrapper.measure(new Size(node.wrapper.width, node.wrapper.height));
                    node.wrapper.arrange(node.wrapper.desiredSize);
                    this.updateDiagramObject(node, true);
                    if (node.inEdges.length > 0) {
                        for (let j: number = 0; j < node.inEdges.length; j++) {
                            const connector: Connector = this.nameTable[node.inEdges[parseInt(j.toString(), 10)]];
                            connectors[connector.id] = connector;
                        }
                    }
                    if (node.outEdges.length > 0) {
                        for (let k: number = 0; k < node.outEdges.length; k++) {
                            const connection: Connector = this.nameTable[node.outEdges[parseInt(k.toString(), 10)]];
                            connectors[connection.id] = connection;
                        }
                    }
                }
                for (const conn of Object.keys(connectors)) {
                    if (canEnableRouting) {
                        this.lineDistributionModule.resetConnectorSegments(this.nameTable[`${conn}`]);
                    }
                    const connector: Connector = connectors[`${conn}`] as Connector;
                    const points: PointModel[] = this.getPoints(connector);
                    if (canEnableRouting) {
                        this.lineDistributionModule.resetRoutingSegments(connector, this, points);
                    }
                    updateConnector(connector, points);
                    if (connector.shape.type === 'Bpmn' && (connector.shape as BpmnFlowModel).sequence === 'Default' && (connector.shape as BpmnFlowModel).flow === 'Sequence') {
                        this.commandHandler.updatePathElementOffset(connector);
                    }
                    connector.wrapper.measure(new Size(undefined, undefined));
                    connector.wrapper.arrange(connector.wrapper.desiredSize);
                    this.updateConnectorAnnotation(connector);
                    this.updateConnectorfixedUserHandles(connector);
                    this.updateQuad(connector);
                    this.updateDiagramObject(connector, true);
                }
                if (canEnableRouting || (this.layout as Layout).connectionPointOrigin === 'DifferentPoint' && this.lineDistributionModule && canDoOverlap) {
                    //Bug 977447: Connectors Overlapping Issue in Complex Hierarchical Tree Layout.
                    if (this.layout.enableRouting) {
                        this.refreshRoutingConnectors();
                        isRoutingConnectorsRefreshed = true;
                    }
                    this.lineDistributionModule.distributeLines((this.layout as Layout), this);
                }
                this.refreshFlowChartConnectors();
                this.preventDiagramUpdate = false;
                this.updatePage();
                if ((!(this.diagramActions & DiagramAction.Render)) || this.mode === 'Canvas') {
                    this.refreshDiagramLayer();
                    this.isRefreshed = true;
                }
            }
            if (!propChange) {
                this.protectPropertyChange(propChange);
            }
        }
        if (update) {
            this.updateDiagramElementQuad();
        }
        if ((this.diagramActions & DiagramAction.Render) && this.layout.enableRouting && !isRoutingConnectorsRefreshed) {
            this.refreshRoutingConnectors();
        }
        if (update) {
            // Trigger the layoutUpdated event with the state set to 'Completed' and the current layout type.
            const args: ILayoutUpdatedEventArgs = { state: 'Completed', type: this.layout.type };
            this.triggerEvent(DiagramEvent.layoutUpdated, args);
        }

        return ((this.blazorActions & BlazorAction.expandNode) ? layout : true);
    }
    //Bug 877799: Optimize the routing segment distance while using enableRouting in layout.
    //Stored the routingConnectors in resetRoutingSegments method and then Refresh the routing connectors after layout completion.
    private refreshRoutingConnectors() {
        const prevProp: boolean = this.isProtectedOnChange;
        this.isProtectedOnChange = true;
        if ((this as any).routingConnectors) {
            for (let i = 0; i < (this as any).routingConnectors.length; i++) {
                const connector = (this as any).routingConnectors[parseInt(i.toString(), 10)];
                const sourceNode = this.nameTable[connector.sourceID];
                const targetNode = this.nameTable[connector.targetID];
                const lineRouting = new LineRouting();
                if (sourceNode.visible && targetNode.visible) {
                    lineRouting.renderVirtualRegion(this, true);
                    lineRouting.refreshConnectorSegments(this, connector, true, true);
                    (this as any).routingConnectors.splice(i, 1);
                    i--;
                }
            }
        }
        this.isProtectedOnChange = prevProp;
    }
    //To update new connector points in flowchart layout
    private refreshFlowChartConnectors() {
        if (this.flowchartLayoutModule) {
            this.flowchartLayoutModule.reRouteFlowChartConnectors((this.layout as any).flowChartData, this);
            for (let i: number = 0; i < this.connectors.length; i++) {
                const connector: ConnectorModel = this.connectors[parseInt(i.toString(), 10)];
                const points = this.getPoints(connector as Connector);
                updateConnector(connector as Connector, points);
                connector.wrapper.measure(new Size(undefined, undefined));
                connector.wrapper.arrange(connector.wrapper.desiredSize);
                this.updateConnectorAnnotation(connector as Connector);
                this.updateConnectorfixedUserHandles(connector as Connector);
                this.updateQuad(connector as Connector);
                this.updateDiagramObject(connector, true);
            }
        }
    }
    //Checks if line distribution is enabled.
    private canDistribute(canEnableRouting: boolean, canDoOverlap: boolean) {
        if ((canEnableRouting && this.lineDistributionModule) || ((this.layout as Layout).connectionPointOrigin === 'DifferentPoint' && this.lineDistributionModule && canDoOverlap) || (this.layout.arrangement === 'Linear' && this.lineDistributionModule)) {
            return true;
        } else {
            if ((canEnableRouting) || ((this.layout as Layout).connectionPointOrigin === 'DifferentPoint' && canDoOverlap) || (this.layout.arrangement === 'Linear')) {
                console.warn('[WARNING] :: Module "LineDistribution" is not available in Diagram component! You either misspelled the module name or forgot to load it.');
            }
            return false;
        }
    }
    /* tslint:enable */
    /**
     * Serializes the diagram control as a string.
     * @returns { string }     Serializes the diagram control as a string. \
     */
    public saveDiagram(): string {
        let children: string[] = []; let node: Node; let grid: GridPanel; let childTable: DiagramElement[];
        let child: Canvas; const gridChild: string = 'childTable';
        for (let i: number = 0; i < this.nodes.length; i++) {
            node = this.nodes[parseInt(i.toString(), 10)] as Node;
            if (node.shape.type === 'SwimLane') {
                grid = node.wrapper.children[0] as GridPanel;
                childTable = grid[`${gridChild}`];
                for (const key of Object.keys(childTable)) {
                    child = childTable[`${key}`];
                    children = getChild(child as Canvas, children);
                }
                for (let i: number = 0; i < children.length; i++) {
                    if (this.nameTable[children[parseInt(i.toString(), 10)]]) {
                        this.swimlaneChildTable[children[parseInt(i.toString(), 10)]]
                            = this.nameTable[children[parseInt(i.toString(), 10)]].zIndex;
                    }
                }
                this.swimlaneZIndexTable[node.id] = node.zIndex;
            }
        }
        return serialize(this);
    }
    /**
     * Converts the given string into a Diagram Control.
     *
     * @returns { Object } Converts the given string into a Diagram Control. \
     * @param {string} data - The string representing the diagram model JSON to be loaded.
     * @param {boolean} isEJ1Data - A boolean indicating whether the JSON data is EJ1 data.
     */
    public loadDiagram(data: string, isEJ1Data?: boolean): Object {
        if (isEJ1Data && this.ej1SerializationModule) {
            const ejDiagram: Diagram = JSON.parse(data);
            data = this.ej1SerializationModule.getSerializedData(ejDiagram);
        } else if (isEJ1Data) {
            console.warn('[WARNING] :: Module "Ej1Serialization" is not available in Diagram component! You either misspelled the module name or forgot to load it.');
        }
        return deserialize(data, this);
    }

    /**
     * Exports the current diagram to a string in Mermaid format.
     * This method converts the current state of the diagram into Mermaid syntax, allowing it to be saved or shared.
     * @returns {string} - A string containing the Mermaid text representation of the current diagram.
     */
    public saveDiagramAsMermaid(): string {
        let mermaidData: string = '';
        if (this.layout && this.layout.type === 'Flowchart') {
            mermaidData = this.saveFlowDiagramInMermaidFormat();
        }
        else if (this.layout && this.layout.type === 'MindMap') {
            mermaidData = this.saveMindmapDiagramInMermaidFormat();
        }
        else {
            mermaidData = this.saveSequenceDiagramAsMermaid();
        }
        return mermaidData;
    }


    /**
     * Converts the diagram to Mermaid format and saves it.
     * If the diagram has a 'MindMap' layout, it will generate a Mermaid mind map.
     * @returns {string} - The Mermaid formatted string representing the diagram.
     */
    private saveMindmapDiagramInMermaidFormat(): string {
        let mermaidData: string = '';
        let dataSourceCollection: string[] = [];

        if (this.layout && this.layout.type === 'MindMap') {
            dataSourceCollection.push('mindmap');

            if (this.nodes.length > 0) {
                const rootNode: NodeModel = this.nodes.filter((node: NodeModel) => (node as Node).inEdges.length === 0)[0];
                const content: string = this.convertMindmapToMermaid(rootNode, 0);
                dataSourceCollection.push(content);

                const outConnectors: string[] = (rootNode as Node).outEdges;
                this.updateTextDataSource(dataSourceCollection, outConnectors, 1);
                dataSourceCollection = dataSourceCollection.filter((data: string) => data.trim() !== '');
                mermaidData = dataSourceCollection.join('\n');
            }
        }
        return mermaidData;
    }


    /**
     * Creates a text data source for sub-level children in a Mermaid diagram.
     * @param {string[]} dataSource - The data source to be updated.
     * @param {string[]} outEdges - The out edges of the current node.
     * @param {number} level - The level of the current node.
     * @returns {void} - Creates a text data source for sub-level children in a Mermaid diagram.
     */
    private updateTextDataSource(dataSource: string[], outEdges: string[], level: number): void {
        let count: number = 0;
        while (count < outEdges.length) {
            const connector: ConnectorModel = this.getObject(outEdges[parseInt(count.toString(), 10)]) as Connector;
            const targetNode: NodeModel = this.getObject(connector.targetID);
            const content: string = this.convertMindmapToMermaid(targetNode, level);
            dataSource.push(content);

            const childOutConnectors: string[] = (targetNode as Node).outEdges;
            if (childOutConnectors.length > 0) {
                this.updateTextDataSource(dataSource, childOutConnectors, level + 1);
            }
            count++;
        }
    }

    /**
     * Returns the text data source for the specified node in Mermaid format.
     * @param {NodeModel} node - The node for which the Mermaid data is to be generated.
     * @param {number} level - The level of the node in the diagram.
     * @returns {string} - The text data source for the specified node in Mermaid format.
     */
    private convertMindmapToMermaid(node: NodeModel, level: number): string {
        const nodeId: string = node.id;
        const spaceCount: number = (level + 1) * 2;
        const spaces: string = ' '.repeat(spaceCount);
        const annotationContent: string = node.annotations.length > 0
            ? node.annotations[0].content.replace(/\n/g, ' ')
            : '';
        let content: string = spaces + annotationContent;
        const spaceWithNodeId: string = spaces + nodeId;

        if (node.shape && node.shape.type === 'Basic') {
            const basicShape: BasicShapeModel = node.shape as BasicShape;
            if (basicShape.shape === 'Rectangle') {
                content = spaceWithNodeId + '[' + annotationContent + ']';
            } else if (basicShape.shape === 'Ellipse') {
                content = spaceWithNodeId + '((' + annotationContent + '))';
            } else if (basicShape.shape === 'Hexagon') {
                content = spaceWithNodeId + '{{' + annotationContent + '}}';
            }
        } else if (node.shape && node.shape.type === 'Flow') {
            const flowShape: FlowShapeModel = node.shape as FlowShape;
            if (flowShape.shape === 'Terminator') {
                content = spaceWithNodeId + '(' + annotationContent + ')';
            }
        } else if (node.shape && node.shape.type === 'Path') {
            const pathShape: PathModel = node.shape as PathModel;
            if (pathShape.data === this.bangShape) {
                content = spaceWithNodeId + '))' + annotationContent + '((';
            } else if (pathShape.data === this.cloudShape) {
                content = spaceWithNodeId + ')' + annotationContent + '(';
            }
        }

        return content;
    }
    /**
     * Converts the flowchart diagram to Mermaid format.
     * @returns {string} - The exported flowchart diagram as Mermaid data.
     */
    private saveFlowDiagramInMermaidFormat(): string {
        const existingIds: string[] = [];
        let mermaidCode: string = 'graph TD\n';
        const graph: IGraph = { nodes: this.nodes, edges: this.connectors };

        // Create a map of node labels for easy access
        // accumulator - The object that stores the node ID and label pairs.
        const nodeLabels: { [key: string]: string } = graph.nodes.reduce((accumulator: { [key: string]: string }, node: NodeModel) => {
            accumulator[node.id] = node.annotations.length ? node.annotations[0].content : '';
            return accumulator;
        }, {} as { [key: string]: string });

        // Iterate through edges to create connections and node definitions
        graph.edges.forEach((edge: ConnectorModel) => {
            const fromNodeId: string = edge.sourceID;
            const toNodeId: string = edge.targetID;
            const fromNodeLabel: string = nodeLabels[`${fromNodeId}`];
            const toNodeLabel: string = nodeLabels[`${toNodeId}`];
            const fromNode: NodeModel = this.nameTable[`${fromNodeId}`];
            const toNode: NodeModel = this.nameTable[`${toNodeId}`];
            let fromNodeShape: string = this.getNodeShape(fromNode);
            let toNodeShape: string = this.getNodeShape(toNode);
            const condition: string = (edge.annotations[0] && edge.annotations[0].content !== '') ? '|' + edge.annotations[0].content + '|' : '';

            if (existingIds.indexOf(fromNodeId) === -1) {
                existingIds.push(fromNodeId);
            } else {
                fromNodeShape = '';
            }
            if (existingIds.indexOf(toNodeId) === -1) {
                existingIds.push(toNodeId);
            } else {
                toNodeShape = '';
            }
            const arrow: string = this.arrowType(edge);
            mermaidCode += `    ${fromNodeId}${fromNodeShape} ${arrow}${condition} ${toNodeId}${toNodeShape}\n`;
        });

        // Add styles for each node
        graph.nodes.forEach((node: NodeModel) => {
            const nodeId: string = node.id;
            const fill: string = node.style.fill;
            const stroke: string = node.style.strokeColor;
            const strokeWidth: string = `${node.style.strokeWidth}px`;
            mermaidCode += `    style ${nodeId} fill:${fill},stroke:${stroke},stroke-width:${strokeWidth};\n`;
        });

        return mermaidCode;
    }

    // Method to get the arrow type from connector
    private arrowType(edge: ConnectorModel): string {
        const decoratorShape: DecoratorShapes = edge.targetDecorator.shape;
        const strokeDash: string = edge.style.strokeDashArray;
        const strokeWidth: number = edge.style.strokeWidth;
        const opacity: number = edge.style.opacity;
        let arrow: string = '';
        if (opacity < 1) {
            arrow = '~~~';
        }
        else if (strokeDash !== '') {
            arrow = '-.->';
        } else if (decoratorShape === 'Arrow') {
            arrow = strokeWidth > 1 ? '==>' : '-->';
        } else if (decoratorShape === 'None') {
            arrow = '---';
        } else {
            arrow = '-->';
        }

        return arrow;
    }

    // Method to get the node shape
    private getNodeShape(node: NodeModel): string {
        const label: string = node.annotations.length > 0 ? node.annotations[0].content : '';
        const shape: string = (node.shape as FlowShape | BasicShape).shape;
        if (shape) {
            switch (shape) {
            case 'Terminator':
                return '([' + label + '])';
            case 'Process':
                return '[' + label + ']';
            case 'Decision':
                return '{' + label + '}';
            case 'Parallelogram':
                return '[/' + label + '/]';
            case 'Ellipse':
                return '((' + label + '))';
            case 'PreDefinedProcess':
                return '[[' + label + ']]';
            default:
                return '[' + label + ']';
            }
        } else {
            const data: string = (node.shape as PathModel).data;
            if (data === 'M 0 0 A 1 1 0 0 0 7 0 A 1 1 0 0 0 0 0 M -1 0 A 1 1 0 0 0 8 0 A 1 1 0 0 0 -1 0') {
                return '(((' + label + ')))';
            } else if (data === 'M 0 0 L 1 -1 L 5 -1 L 6 0 L 0 0') {
                return '[/' + label + '\\]';
            } else if (data === 'M 0 1 L 0 6 C 2 7 4 7 6 6 L 6 1 C 5 0 1 0 0 1 C 1 2 5 2 6 1') {
                return '[(' + label + ')]';
            } else if (data === 'M 0 0 L 12 0 L 14 2 L 2 2 L 0 0') {
                return '[\\' + label + '\\]';
            } else if (data === 'M 0 0 L 5 0 L 4 1 L 1 1 L 0 0') {
                return '[\\' + label + '/]';
            } else if (data === 'M 0 0 L 2 -2 L 11 -2 L 13 0 L 11 2 L 2 2 L 0 0') {
                return '{{' + label + '}}';
            } else {
                return '>' + label + ']';
            }
        }
    }

    /** Loads a diagram from a string containing Mermaid syntax.
     * This method parses the provided Mermaid text data and updates the current diagram accordingly.
     * Currently, only Mindmap and Flowchart diagrams can be loaded.
     * To render the diagram properly, you should set the `Layout.type` to either `MindMap` or `FlowChart`, and ensure that the respective modules are injected.
     * @param {string} data - The Mermaid text data representing the diagram to be loaded.
     * @returns {void} - No return value. The method updates the diagram in place.
     */
    public loadDiagramFromMermaid(data: string): void {
        if (this.layout && this.layout.type === 'Flowchart' && this.flowchartLayoutModule) {
            //Task 896394: To load the mermaid data as flowchart
            this.convertMermaidToFlowChart(data);
        } else if (this.layout && this.layout.type === 'MindMap' && this.mindMapChartModule) {
            //Task 900266: To load the mermaid data as mindmap
            this.convertMermaidToMindmap(data);
        }
        else if (this.isSequenceDiagram(data)) {
            this.loadSequenceDiagramFromMermaid(data);
        }
        else {
            console.warn('[WARNING] :: Module "FlowchartLayout" or "MindMap" is not available in Diagram component! You either misspelled the module name or forgot to load it.');
        }
    }
    /**
     * Counts the number of leading spaces in the specified string.
     * @param {string} word The string to check for leading spaces.
     * @returns { number } The number of leading spaces.
     */
    private countLeadingSpaces(word: string): number {
        let i: number = 0;
        const length: number = word.length;

        // Loop through the string to count leading spaces
        while (i < length && word.charAt(i) === ' ') {
            i++;
        }

        // Return the number of leading spaces
        return i;
    }

    private mermaidNodeBaseCollection: NodeModel[] | ConnectorModel[] = [];
    private convertMermaidToMindmap(data: string): void {
        if (data && this.layout && this.layout.type === 'MindMap' && this.mindMapChartModule) {
            const dataSource: string[] = data.split(/\r?\n/).filter((s: string) => s.trim().length > 0);
            this.clear();
            this.mermaidNodeBaseCollection = [];

            const dataStack: HierarchyData[] = [];
            let root: HierarchyData = null;
            let previousItem: HierarchyData = { text: '', children: [], currentLevel: 0, branch: 'Left' };
            const spaceAndItsLevels: SpaceLevel[] = [];
            const startLevel: number = 1;
            let haveBackticks: boolean = false;
            let isEndBackticks: boolean = false;
            let canCreateMindMap: boolean = false;
            if (dataSource.length > 0) {
                for (let index: number = 0; index < dataSource.length; index++) {
                    const word: string = dataSource[parseInt(index.toString(), 10)];
                    let level: number = 0;
                    let text: string = '';
                    let levelChar: string = ' ';
                    const leadingWhiteSpace: number = this.countLeadingSpaces(word);
                    const isStartBackticks: boolean = word.includes('"`');
                    isEndBackticks = word.includes('`"');
                    haveBackticks = isStartBackticks ? true : haveBackticks;
                    canCreateMindMap = (!haveBackticks && !canCreateMindMap) ? leadingWhiteSpace === 0 && index > 0 : canCreateMindMap;

                    if (haveBackticks && isEndBackticks && !isStartBackticks) {
                        previousItem.text += '\n' + word;
                        haveBackticks = false;
                        continue;
                    }

                    if (!isStartBackticks && haveBackticks) {
                        previousItem.text += '\n' + word;
                        continue;
                    }

                    haveBackticks = isEndBackticks ? false : haveBackticks;
                    if (word.length > 0 && ((/\s/.test(word[0]) && index > 0) || (leadingWhiteSpace === 0))) {
                        const spaceIndex: number = spaceAndItsLevels.findIndex((space: SpaceLevel) =>
                            space.space === leadingWhiteSpace.toString());

                        if (spaceIndex !== -1) {
                            for (let i: number = spaceAndItsLevels.length - 1; i >= 0; i--) {
                                const currentSpace: SpaceLevel = spaceAndItsLevels[parseInt(i.toString(), 10)];
                                const currentKey: number = parseFloat(currentSpace.space);

                                if (currentKey > leadingWhiteSpace) {
                                    spaceAndItsLevels.splice(i, 1); // Remove the element at index i
                                } else if (currentKey < leadingWhiteSpace) {
                                    spaceAndItsLevels.push({ space: leadingWhiteSpace.toString(), level: currentSpace.level + 1 });
                                    level = currentSpace.level + 1;
                                    break;
                                } else if (currentKey === leadingWhiteSpace) {
                                    level = currentSpace.level;
                                    break;
                                }
                            }
                        }
                        else {
                            if (spaceAndItsLevels.length === 0) {
                                spaceAndItsLevels.push({ space: leadingWhiteSpace.toString(), level: startLevel });
                                level = startLevel;
                            } else {
                                for (let i: number = spaceAndItsLevels.length - 1; i >= 0; i--) {
                                    const currentElement: SpaceLevel = spaceAndItsLevels[parseInt(i.toString(), 10)];
                                    const currentKey: number = parseFloat(currentElement.space);

                                    if (currentKey > leadingWhiteSpace) {
                                        spaceAndItsLevels.splice(i, 1); // Remove the element at index i
                                    } else {
                                        const lastElement: SpaceLevel = spaceAndItsLevels[spaceAndItsLevels.length - 1];
                                        spaceAndItsLevels.push({ space: leadingWhiteSpace.toString(), level: lastElement.level + 1 });
                                        break;
                                    }
                                }
                                level = spaceAndItsLevels[spaceAndItsLevels.length - 1].level;
                            }
                        }

                        text = word.trim().replace(/^[+-]/, '');
                        levelChar = ' ';
                    }
                    const currentItem: HierarchyData = {
                        text: text,
                        branch: undefined,
                        children: [],
                        currentLevel: index === 0 ? 0 : level - 1
                    };

                    if (dataStack.length > 0) {
                        while (dataStack.length >= level) {
                            if (dataStack.length === 0) { break; }
                            dataStack.pop();
                        }

                        if (dataStack.length > 0) {
                            dataStack[dataStack.length - 1].children.push(currentItem);
                        }
                    } else {
                        root = currentItem;
                    }

                    dataStack.push(currentItem);
                    previousItem = currentItem;

                }
                // Create dataSource
                const hierarchyDataSource: HierarchyData = dataStack[0];

                if (hierarchyDataSource.text === 'mindmap' || canCreateMindMap) {
                    if (canCreateMindMap) {
                        const nodeDetails: NodeData = this.getNodeDetails(hierarchyDataSource);
                        const nodeObj: NodeModel = {
                            id: nodeDetails.nodeId,
                            shape: nodeDetails.nodeShapeData,
                            annotations: [
                                { content: nodeDetails.annotationContent }
                            ]
                        };
                        (this.mermaidNodeBaseCollection as NodeModel[]).push(nodeObj);
                        this.createDataSource(hierarchyDataSource.children, hierarchyDataSource, nodeObj.id);
                    } else {
                        const hierarchyData: HierarchyData = hierarchyDataSource.children[0];
                        const nodeData: NodeData = this.getNodeDetails(hierarchyData);
                        const node: NodeModel = {
                            id: nodeData.nodeId,
                            shape: nodeData.nodeShapeData,
                            annotations: [
                                { content: nodeData.annotationContent }
                            ]
                        };
                        (this.mermaidNodeBaseCollection as NodeModel[]).push(node);
                        this.createDataSource(hierarchyData.children, hierarchyData, node.id);
                    }
                    this.addElements(this.mermaidNodeBaseCollection);
                    this.doLayout();
                }
            }
        }
    }
    /**
     * provides
     * either constructed internal model equivalent mermaid data
     * or user provided mermaid data used for constructing sequence diagram
     * @returns {string} sequence diagram equivalent mermaid data
     */
    private saveSequenceDiagramAsMermaid(): string {
        const model: UmlSequenceDiagram = this.model as UmlSequenceDiagram;

        if (!model.isLoadedFromMermaid) {
            return model.generateMermaidFromModel();
        }
        else {
            return model.mermaidData;
        }
    }
    private isSequenceDiagram(input: string): boolean {
        // Split the input string into an array of lines, removing any empty lines
        const lines: string[] = input.split(/\r?\n/).filter((line: string) => line.trim().length > 0);

        // Check if the first line equals "sequenceDiagram" (case-sensitive)
        return lines.length > 0 && lines[0].trim() === 'sequenceDiagram';
    }
    /**
     * Generates a UML sequence diagram from the provided mermaid text.
     * @param {string} mermaidText The mermaid syntax defining the sequence diagram.
     * @returns {void}
     */
    private loadSequenceDiagramFromMermaid(mermaidText: string): void {
        this.model = {};

        // parse the mermaid data
        (this.model as UmlSequenceDiagram).parse(mermaidText, this);
        // initialize the parsed nodes & connectors of sequence diagram
        this.initLayerObjects();
        // protect property change in between rendering nodes and connectors
        const propChange: boolean = this.isProtectedOnChange;
        this.protectPropertyChange(true);
        // position the nodes & connect connectors to draw sequence diagram.
        (this.model as UmlSequenceDiagram).loadDiagramFromMermaid(mermaidText, this);
        // refresh diagram layer to render the sequence diagram.
        this.refreshDiagramLayer();
        // disable protect property change
        if (!propChange) {
            this.protectPropertyChange(propChange);
        }
        // fit to page to focus the sequence diagram content
        this.fitToPage({
            mode: 'Page', region: 'Content', margin: { left: 10, top: 10, right: 10, bottom: 10 },
            canZoomIn: true, canZoomOut: true
        });
    }
    /**
     * Creates a data source for the Mermaid diagram based on the provided hierarchy data.
     * @param { HierarchyData[] } data The list of hierarchy data to process.
     * @param { HierarchyData } parent The parent hierarchy data.
     * @param { string } parentId The ID of the parent node.
     * @returns { void }
     */
    private createDataSource(data: HierarchyData[], parent: HierarchyData, parentId: string): void {
        let index: number = 0;

        while (index < data.length) {
            const child: HierarchyData = data[parseInt(index.toString(), 10)];
            const nodeData: NodeData = this.getNodeDetails(child);

            const node: NodeModel = {
                id: nodeData.nodeId,
                shape: nodeData.nodeShapeData,
                annotations: [
                    { content: nodeData.annotationContent }
                ]
            };

            const connector: ConnectorModel = {
                sourceID: parentId,
                targetID: node.id
            };

            (this.mermaidNodeBaseCollection as NodeModel[]).push(node);
            (this.mermaidNodeBaseCollection as ConnectorModel[]).push(connector);

            this.createDataSource(child.children, child, node.id);
            index++;
        }
    }

    private bangShape: string = 'M0 0 a15.470625686645507,15.470625686645507 1 0,0 25.78437614440918,-3.7200001525878905 a15.470625686645507,15.470625686645507 1 0,0 25.78437614440918,0 a15.470625686645507,15.470625686645507 1 0,0 25.78437614440918,0 a15.470625686645507,15.470625686645507 1 0,0 25.78437614440918,3.7200001525878905 a15.470625686645507,15.470625686645507 1 0,0 15.470625686645507,12.276000503540038 a12.376500549316406,12.376500549316406 1 0,0 0,12.648000518798828 a15.470625686645507,15.470625686645507 1 0,0 -15.470625686645507,12.276000503540038 a15.470625686645507,15.470625686645507 1 0,0 -25.78437614440918,5.580000228881835 a15.470625686645507,15.470625686645507 1 0,0 -25.78437614440918,0 a15.470625686645507,15.470625686645507 1 0,0 -25.78437614440918,0 a15.470625686645507,15.470625686645507 1 0,0 -25.78437614440918,-5.580000228881835 a15.470625686645507,15.470625686645507 1 0,0 -10.313750457763673,-12.276000503540038 a12.376500549316406,12.376500549316406 1 0,0 0,-12.648000518798828 a15.470625686645507,15.470625686645507 1 0,0 10.313750457763673,-12.276000503540038 H0 V0 Z';
    private cloudShape: string = 'M0 0 a16.18875045776367,16.18875045776367 0 0,1 26.981250762939453,-10.792500305175782 a37.77375106811523,37.77375106811523 1 0,1 43.17000122070313,-10.792500305175782 a26.981250762939453,26.981250762939453 1 0,1 37.77375106811523,21.585000610351564 a16.18875045776367,16.18875045776367 1 0,1 16.18875045776367,13.020000534057615 a21.585000610351564,21.585000610351564 1 0,1 -16.18875045776367,24.180000991821288 a26.981250762939453,16.18875045776367 1 0,1 -26.981250762939453,16.18875045776367 a37.77375106811523,37.77375106811523 1 0,1 -53.962501525878906,0 a16.18875045776367,16.18875045776367 1 0,1 -26.981250762939453,-16.18875045776367 a16.18875045776367,16.18875045776367 1 0,1 -10.792500305175782,-13.020000534057615 a21.585000610351564,21.585000610351564 1 0,1 10.792500305175782,-24.180000991821288 H0 V0 Z';
    /**
     * Retrieves the node details based on the provided hierarchy data for a mermaid diagram.
     * @param { HierarchyData } hierarchyData The hierarchy data.
     * @returns { NodeData } The node details.
     */
    private getNodeDetails(hierarchyData: HierarchyData): NodeData {
        const pattern: RegExp = /^(.*?)\s*([\\[\\(\\{][\s\S]*?[\]\\)\\}]|[)\\(][\s\S]*|[)\\{][\s\S]*|[)\\(][^{}()\\[\]]*$)/;
        const annotationContent: string = hierarchyData.text;
        const match: RegExpMatchArray = annotationContent.match(pattern);
        let nodeId: string = randomId();
        let annotationText: string = hierarchyData.text;
        let shape: BasicShapeModel | FlowShapeModel | PathModel = { type: 'Basic', shape: 'Rectangle' };

        if (match) {
            nodeId = match[1] ? match[1] : nodeId;
            const content: string = match[2].trim().replace(/["`]/g, '');
            const firstCharacter: string = content.charAt(0);

            if (firstCharacter === '[') {
                annotationText = content.slice(1, -1);
            } else if (firstCharacter === '(') {
                if (content.startsWith('((')) {
                    annotationText = content.slice(2, -1);
                } else {
                    annotationText = content.slice(1, -1);
                }
                shape = content.startsWith('((') ?
                    { type: 'Basic', shape: 'Ellipse' } :
                    { type: 'Flow', shape: 'Terminator' };
            }
            else if (firstCharacter === ')') {
                if (content.startsWith('))')) {
                    annotationText = content.slice(2, -2);
                } else {
                    annotationText = content.slice(1, -1);
                }
                shape = content.startsWith('))') ?
                    { type: 'Path', data: this.bangShape } :
                    { type: 'Path', data: this.cloudShape };
            } else if (firstCharacter === '{') {
                annotationText = content.slice(2, -1);
                shape = { type: 'Basic', shape: 'Hexagon' };
            }
        }

        return {
            nodeId: nodeId,
            annotationContent: annotationText,
            nodeShapeData: shape
        };
    }
    /**
     * To convert the Mermaid data to flowchart diagram
     * @param {string} data - The Mermaid data to be converted to a flowchart diagram.
     * @returns {void}
     */
    private convertMermaidToFlowChart(data: string): void {
        let dataCollection: FlowChartData[] = [];
        this.clear();
        //95490: Error while loading Mermaid diagram
        //Ensure every statement ends with a semicolon and newline, unless it’s already followed by a newline.
        data = data.replace(/;(?!\s*[\n\r])/g, ';\n');
        const lines: string[] = data.trim().split('\n');
        for (let i: number = 1; i < lines.length; i++) {
            let line: string = lines[parseInt(i.toString(), 10)];
            line = line.trim();
            //Remove trailing semicolon if the line does not start with "style" to avoid showing it as a node annotation.
            if (line.endsWith(';') && !line.startsWith('style')) {
                line = line.slice(0, -1).trim();
            }
            // Skip lines that start with specific prefixes
            // "%" - comment line, "end/End" - end of a subgraph/graph
            // "subgraph", "graph", "flowchart" - Not supported by diagram
            const skipPrefixes: string[] = ['%', 'subgraph', 'graph', 'flowchart', 'end', 'End'];
            if (line !== '' && !skipPrefixes.some((prefix: string) => line.startsWith(prefix))) {
                if (line.startsWith('style')) {
                    this.parseStyle(line, dataCollection);
                } else {
                    const lineSplit: string[] = this.getLineSplitting(line);
                    const parts: string[] = [lineSplit[0], lineSplit[1]];
                    const data: FlowChartData[] = this.getNodeData(parts, dataCollection, lineSplit[2]);
                    if (data && data.length > 0) {
                        const lastItem: FlowChartData = data[data.length - 1];
                        lastItem.arrowType = lineSplit[2];
                        if (lineSplit[3] !== '') {
                            if (lastItem.label && (lastItem.label as string[]).some((str: string) => str.trim().length > 0)) {
                                (lastItem.label as string[]).push(lineSplit[3]);
                            } else {
                                lastItem.label = [];
                                lastItem.label[lastItem.parentId.length - 1] = lineSplit[3];
                            }
                        }
                        data.filter((flowData: FlowChartData) =>
                            flowData.parentId && flowData.parentId.length === 0).forEach(function (node: FlowChartData): void {
                            node.parentId = null;
                        });
                        dataCollection = dataCollection.concat(data);
                    }
                }
            }
        }
        this.createFlowChart(dataCollection);
        this.doLayout();
        this.clearHistory();
    }
    /**
     * To convert the dataCollection into flowchart nodes and connectors
     * @param { FlowChartData[] } dataCollection - The data collection to be converted to flowchart nodes and connectors.
     * @returns {void}
     */
    private createFlowChart(dataCollection: FlowChartData[]): void {
        const flowchartNodesAndConnectors: NodeModel[] | ConnectorModel[] = [];
        for (let n: number = 0; n < dataCollection.length; n++) {
            const data: FlowChartData = dataCollection[parseInt(n.toString(), 10)];
            const node: NodeModel = {
                id: data.id,
                shape: data.shape as BasicShapeModel | FlowShapeModel | BpmnShapeModel,
                annotations: [{ content: data.name }],
                style: { fill: data.color, strokeColor: data.stroke, strokeWidth: data.strokeWidth }
            };
            (flowchartNodesAndConnectors as NodeModel[]).push(node);
        }
        for (let c: number = 0; c < dataCollection.length; c++) {
            const data: FlowChartData = dataCollection[parseInt(c.toString(), 10)];
            const connectorStyle: ConnectorStyle = getConnectorArrowType(data) as ConnectorStyle;
            if (data.parentId && data.parentId.length > 1) {
                for (let i: number = 0; i < data.parentId.length; i++) {
                    const connector: ConnectorModel = {
                        id: randomId(),
                        sourceID: data.parentId[parseInt(i.toString(), 10)] as string,
                        targetID: data.id,
                        annotations: [{ content: data.label ? data.label[parseInt(i.toString(), 10)] : '' }],
                        style: {
                            strokeWidth: connectorStyle.strokeWidth ? connectorStyle.strokeWidth : 1,
                            strokeDashArray: connectorStyle.strokeDashArray ? connectorStyle.strokeDashArray : '',
                            opacity: connectorStyle.opacity !== undefined ? connectorStyle.opacity : 1
                        },
                        targetDecorator: { shape: connectorStyle.targetDecorator as DecoratorShapes }
                    };
                    (flowchartNodesAndConnectors as ConnectorModel[]).push(connector);
                }
            } else if (data.parentId && data.parentId.length === 1) {
                const connector: ConnectorModel = {
                    id: randomId(),
                    sourceID: data.parentId[0] as string,
                    targetID: data.id,
                    annotations: [{ content: data.label ? data.label[0] : '' }],
                    style: {
                        strokeWidth: connectorStyle.strokeWidth ? connectorStyle.strokeWidth : 1,
                        strokeDashArray: connectorStyle.strokeDashArray ? connectorStyle.strokeDashArray : '',
                        opacity: connectorStyle.opacity !== undefined ? connectorStyle.opacity : 1
                    },
                    targetDecorator: { shape: connectorStyle.targetDecorator as DecoratorShapes }
                };
                (flowchartNodesAndConnectors as ConnectorModel[]).push(connector);
            }
        }
        this.addElements(flowchartNodesAndConnectors);
    }
    /**
     * Splits the line based on arrow
     * @param { string } line - line to split
     * @returns { string[] } - Splitted line
     */
    private getLineSplitting(line: string): string[] {
        let leftPart: string;
        let rightPart: string;
        let arrowName: string;
        let arrowText: string = '';
        // RegEx to split the line based on arrow
        const regex: RegExp = /^(.*?)\s*(-->|---|--\s*.*?\s*-->|~~~|==>|===|==\s*.*?\s*==>|\s*-\.\s*->|\s*-\.\s*-|\s*-\.\s*.*?\s*\.\s*->|\s*-\..*?\.\s*->)(.*)$/;
        const match: RegExpMatchArray = line.match(regex);
        if (match) {
            leftPart = match[1].trim();
            const arrow: string = match[2].trim();
            rightPart = match[3].trim();

            // Detect and extract arrow text
            const arrowRegex: RegExp = /(-\.|\\-\\-|==|--|~~)(.*?)(\1>|\.->|==>|\\->|~~>)/;
            const arrowTextMatch: RegExpMatchArray = arrow.match(arrowRegex);
            let arrowDetails: any;
            let arrowType: string = '';
            if (arrowTextMatch) {
                const text: string = arrowTextMatch[2].trim() || null;
                const arrowType: string = arrowTextMatch[1] + arrowTextMatch[3];
                arrowDetails = {
                    text: text,
                    arrowType: arrowType
                };
            } else {
                arrowDetails = {
                    text: null,
                    arrowType: arrow
                };
            }
            arrowText = arrowDetails.text !== null ? arrowDetails.text : '';
            arrowType = arrowDetails.arrowType;

            // Identify arrow type
            if (arrowType.includes('-->')) {
                arrowName = 'single-line-arrow';
            } else if (arrowType.includes('---')) {
                arrowName = 'single-line';
            } else if (arrowType.includes('==>')) {
                arrowName = 'double-line-arrow';
            } else if (arrowType.includes('==')) {
                arrowName = 'double-line';
            }
            else if (arrowType.includes('~~~')) {
                arrowName = 'wiggly-arrow';
            } else if (arrowType.includes('-.->') || arrowType.includes('.->')) {
                arrowName = 'dotted-arrow';
            } else if (arrowType.includes('-.-') || arrowType.includes('.-')) {
                arrowName = 'dotted';
            }
            else {
                arrowName = 'single-line-arrow';
            }
        } else {
            //consider single node Data
            leftPart = line.trim();
            rightPart = null;
        }
        return [leftPart, rightPart, arrowName, arrowText];
    }
    /**
     * To parse the style of the node
     * @param { string } line - line to parse
     * @param { FlowChartData[] } dataCollection - data collection
     * @returns { void }
     */
    private parseStyle(line: string, dataCollection: FlowChartData[]): void {
        const styleRegex: RegExp =
            /^style\s+(\w+)\s+fill:([^,]+),stroke:([^,]+),stroke-width:(\d+)px;/;
        if (line.startsWith('style')) {
            const match: RegExpMatchArray = line.match(styleRegex);

            if (match) {
                const id: string = match[1];
                const fill: string = match[2];
                const stroke: string = match[3];
                const strokeWidth: number = parseInt(match[4], 10);
                const data: MermaidStyle = {
                    id: id,
                    fill: fill,
                    stroke: stroke,
                    strokeWidth: strokeWidth
                };
                const matchData: FlowChartData[] = dataCollection.filter((x: FlowChartData) => x.id === data.id);
                matchData[0].color = data.fill;
                matchData[0].stroke = data.stroke;
                matchData[0].strokeWidth = data.strokeWidth;
            }
        }
    }
    /**
     * @param {string[]} lines - The lines to be processed.
     * @param {FlowChartData[]} dataCollection - The data collection to be updated.
     * @param {string} arrowType - The type of arrow.
     * @returns { void }
     */
    private getNodeData(lines: string[], dataCollection: FlowChartData[], arrowType: string): FlowChartData[] {
        const dataArray: FlowChartData[] = [];
        let firstId: string = null;
        let secondId: string = null;
        let isExistCount: number = 0;
        let connectorLabel: string = '';
        for (let i: number = 0; i < lines.length; i++) {
            const line1: string = lines[parseInt(i.toString(), 10)];
            if (line1) {
                const text: string[] = this.splitNested(line1);
                if (text && text[0].includes('|')) {
                    // Extract content outside the '|'
                    const match: RegExpMatchArray = text[0].match(/\|([^|]*)\|/);
                    if (match) {
                        connectorLabel = match[1];
                    }
                    const parts: string[] = text[0].split('|');
                    if (parts.length >= 3) {
                        text[0] = parts[2].trim();
                    }
                }
                //Extract and clean up the first text item by trimming and removing any semicolon at the end
                const id: string = text[0].trim().replace(/;$/, '');
                if (i === 0) {
                    firstId = id;
                } else {
                    secondId = id;
                }
                const exsist: FlowChartData = dataCollection.find((data: FlowChartData) => data.id === id);
                if (!exsist) {
                    const labelShape: string = text.length > 1 ? text[1] : text[0];
                    const shape: BasicShapeModel | FlowShapeModel | PathModel = this.getShape(labelShape);
                    const label: string = labelShape.replace(/[\\[\]\\(\\)\\{\\}\\{\\}\\/>]/g, '');
                    const data: FlowChartData = {
                        id: id,
                        name: label,
                        shape: shape,
                        color: 'white',
                        parentId: [] as string[]
                    } as FlowChartData;
                    dataArray.push(data);
                } else {
                    isExistCount++;
                }
            }
        }
        if (dataArray.length) {
            const lastItem: FlowChartData = dataArray[dataArray.length - 1];
            if (lastItem.id !== firstId) {
                (lastItem.parentId as string[]).push(firstId);
                if (lastItem.label) {
                    (lastItem.label as string[]).push(connectorLabel);
                } else {
                    lastItem.label = [connectorLabel];
                }
            } else {
                const data: FlowChartData = dataCollection.find((data: FlowChartData) => data.id === secondId);
                if (data) {
                    if (data.parentId) {
                        (data.parentId as string[]).push(firstId);
                    } else {
                        data.parentId = [firstId];
                    }
                    if (data.label) {
                        (data.label as string[]).push(connectorLabel);
                    } else {
                        data.label = [connectorLabel];
                    }
                }
            }
        } else if (isExistCount === 2) {
            const [filteredData]: FlowChartData[] = dataCollection.filter((flowData: FlowChartData) => flowData.id === secondId);
            filteredData.parentId = filteredData.parentId || [];
            (filteredData.parentId as string[]).push(firstId);

            filteredData.label = filteredData.label || [];
            (filteredData.label as string[])[filteredData.parentId.length - 1] = connectorLabel;
        }
        if (arrowType) {
            const filteredData: FlowChartData = dataCollection.filter(function (flowData: FlowChartData): boolean
            { return flowData.id === secondId; })[0];
            if (filteredData) {
                filteredData.arrowType = arrowType;
            }
        }
        return dataArray;
    }
    /**
     * To split the text based on the nested brackets
     * @param {string} text - The text to be split based on nested brackets.
     * @returns {string[]} An array of strings split based on the nested brackets.
     */
    private splitNested(text: string): string[] {
        const result: string[] = [];
        let current: string = '';
        let level: number = 0;
        let delimiter: string = '';

        for (const char of text) {
            if (char === '[' || char === '{' || char === '(' || char === '>') {
                if (level === 0) {
                    if (current.trim().length > 0) {
                        result.push(current.trim());
                    }
                    current = char; // Include the delimiter in the current part
                    delimiter = char;
                    level++;
                } else {
                    current += char;
                    level++;
                }
            } else if (char === ']' || char === '}' || char === ')') {
                if (level === 1 && char === delimiter) {
                    current += char; // Include the delimiter in the current part
                    result.push(current.trim());
                    current = '';
                    level--;
                } else if (level > 1) {
                    current += char;
                    level--;
                } else {
                    current += char;
                }
            } else {
                current += char;
            }
        }

        if (current.trim().length > 0) {
            result.push(current.trim());
        }

        return result;
    }
    // Get shape based on the bracket
    private getShape(text: string): BasicShapeModel | FlowShapeModel | PathModel {
        let shape: FlowShapeModel | PathModel | BasicShapeModel = {};
        if (text.startsWith('(((')) {
            shape = { type: 'Path', data: 'M 0 0 A 1 1 0 0 0 7 0 A 1 1 0 0 0 0 0 M -1 0 A 1 1 0 0 0 8 0 A 1 1 0 0 0 -1 0' };
        } else if (text.startsWith('((')) {
            shape = { shape: 'Ellipse', type: 'Basic' };
        } else if (text.startsWith('([')) {
            shape = { type: 'Flow', shape: 'Terminator' };
        } else if (text.startsWith('(')) {
            shape = { type: 'Flow', shape: 'Process' };
        } else if (text.startsWith('[[')) {
            shape = { type: 'Flow', shape: 'PreDefinedProcess' };
        } else if (text.startsWith('[/')) {
            if (text.endsWith('/]')) {
                shape = { type: 'Basic', shape: 'Parallelogram' };
            } else {
                shape = { type: 'Path', data: 'M 0 0 L 1 -1 L 5 -1 L 6 0 L 0 0' };
            }
        } else if (text.startsWith('[(')) {
            shape = { type: 'Path', data: 'M 0 1 L 0 6 C 2 7 4 7 6 6 L 6 1 C 5 0 1 0 0 1 C 1 2 5 2 6 1' };
        } else if (text.startsWith('[\\')) {
            if (text.endsWith('\\]')) {
                shape = { type: 'Path', data: 'M 0 0 L 12 0 L 14 2 L 2 2 L 0 0' };
            } else {
                shape = { type: 'Path', data: 'M 0 0 L 5 0 L 4 1 L 1 1 L 0 0' };
            }
        } else if (text.startsWith('[')) {
            shape = { type: 'Basic', shape: 'Rectangle' };
        } else if (text.startsWith('{{')) {
            shape = { type: 'Path', data: 'M 0 0 L 2 -2 L 11 -2 L 13 0 L 11 2 L 2 2 L 0 0' };
        } else if (text.startsWith('{')) {
            shape = { type: 'Flow', shape: 'Decision' };
        } else if (text.startsWith('>')) {
            shape = { type: 'Path', data: 'M 0 0 L 8 0 L 8 2 L 0 2 L 2 1 L 0 0' };
        }
        return shape;
    }

    /**
     * To  get the html diagram content
     *
     * @returns { string }     getDirection method .\
     * @param {StyleSheetList} styleSheets - defines the collection of style files to be considered while exporting.
     */
    public getDiagramContent(styleSheets?: StyleSheetList): string {
        if (this.printandExportModule) {
            const data: string | SVGElement = this.printandExportModule.getDiagramContent(styleSheets);
            return data;
        } else {
            console.warn('[WARNING] :: Module "PrintAndExport" is not available in Diagram component! You either misspelled the module name or forgot to load it.');
            return '';
        }
    }

    /**
     * Exports a diagram as a image.
     *
     * @returns { void } Exports a diagram as a image.\
     * @param {string} image - A string representing the image content to be exported.
     * @param {IExportOptions} options -An object defining the properties of the image export.
     */
    public exportImage(image: string, options: IExportOptions): void {
        if (this.printandExportModule) {
            this.printandExportModule.exportImages(image, options);
        } else {
            console.warn('[WARNING] :: Module "PrintAndExport" is not available in Diagram component! You either misspelled the module name or forgot to load it.');
        }
    }

    /**
     * Prints the native or HTML nodes of the diagram as an image.
     *
     * @returns { void } Prints the native or HTML nodes of the diagram as an image. \
     * @param {string} image - A string that defines the image content to be printed.
     * @param {IExportOptions} options - An IExportOptions object that defines the properties of the image and printing options.
     */
    public printImage(image: string, options: IExportOptions): void {
        if (this.printandExportModule) {
            options.printOptions = true;
            this.printandExportModule.exportImages(image, options);
        } else {
            console.warn('[WARNING] :: Module "PrintAndExport" is not available in Diagram component! You either misspelled the module name or forgot to load it.');
        }
    }

    /**
     * Define a limit on the number of history entries that the diagram's history manager can store. This can help manage memory usage and control the undo/redo history size. Or
     * Sets the limit for the history entries in the diagram.
     *
     * @returns { void }  Define a limit on the number of history entries that the diagram's history manager can store. This can help manage memory usage and control the undo/redo history size. Or Sets the limit for the history entries in the diagram.
     * @param {number} stackLimit - The limit for the history manager's stack.
     */
    public setStackLimit(stackLimit: number): void {
        if (this.undoRedoModule && stackLimit) {
            this.historyManager.stackLimit = stackLimit;
            this.undoRedoModule.applyLimit(this.historyManager.currentEntry, stackLimit, this, true);
        }
    }

    /**
     * Clears the history of the diagram, removing all the recorded actions from the undo and redo history.
     * @returns { void } Clears the history of the diagram, removing all the recorded actions from the undo and redo history.\
     */
    public clearHistory(): void {
        if (this.undoRedoModule) {
            this.undoRedoModule.clearHistory(this);
        }
    }

    /**
     * Retrieves the bounding rectangle that encloses the entire diagram.
     * @returns { void } TRetrieves the bounding rectangle that encloses the entire diagram. \
     */
    public getDiagramBounds(): Rect {
        if (this.printandExportModule) {
            const bounds: Rect = this.printandExportModule.getDiagramBounds('', {});
            bounds.width = bounds.width > this.scrollSettings.viewPortWidth ?
                bounds.width + (bounds.x > 0 ? bounds.x : 0) : this.scrollSettings.viewPortWidth;
            bounds.height = bounds.height > this.scrollSettings.viewPortHeight ?
                bounds.height + (bounds.y > 0 ? bounds.y : 0) : this.scrollSettings.viewPortHeight;
            bounds.x = bounds.x > 0 ? 0 : bounds.x;
            bounds.y = bounds.y > 0 ? 0 : bounds.y;
            return bounds;
        } else {
            console.warn('[WARNING] :: Module "PrintAndExport" is not available in Diagram component! You either misspelled the module name or forgot to load it.');
            return new Rect();
        }
    }

    /**
     * Exports the diagram as an image or SVG element based on the specified options.
     *
     * @returns { void } Exports the diagram as an image or SVG element based on the specified options.\
     * @param {IExportOptions} options - An object defining how the diagram image should be exported.
     */
    public exportDiagram(options: IExportOptions): string | SVGElement {
        if (this.printandExportModule) {
            const data: string | SVGElement = this.printandExportModule.exportDiagram(options);
            return data;
        } else {
            console.warn('[WARNING] :: Module "PrintAndExport" is not available in Diagram component! You either misspelled the module name or forgot to load it.');
            return '';
        }
    }

    /**
     * Prints the diagram.
     *
     * @returns { void }     Prints the diagram.\
     * @param {IPrintOptions} optons - An IPrintOptions object that defines how the diagram is to be printed.
     */

    public print(options: IPrintOptions): void {
        if (this.printandExportModule) {
            this.printandExportModule.print(options);
        } else {
            console.warn('[WARNING] :: Module "PrintAndExport" is not available in Diagram component! You either misspelled the module name or forgot to load it.');
        }
    }


    /**
     * Adds ports to a node or connector at runtime. \
     *
     * @returns { void }    Adds ports to a node or connector at runtime.\
     * @param { Node | ConnectorModel} obj - object representing the node or connector to which ports will be added.
     * @param {PointPortModel[] | PathPortModel[]} ports - objects representing the ports to be added.
     * @blazorArgsType obj|DiagramNode
     */
    public addPorts(obj: NodeModel | ConnectorModel, ports: PointPortModel[] | PathPortModel[]): void {
        this.protectPropertyChange(true);
        const portCollection: PointPort[] | PathPort[] = [];
        const isAddPortInServer: boolean = true;
        let exist: boolean = false;
        //Removed isBlazor code
        obj = this.nameTable[obj.id] || obj;
        let newObj: PointPort | PathPort;
        if (ports.length > 1) {
            this.startGroupAction();
        }
        for (let i: number = 0; i < ports.length; i++) {
            //907755 - Issue in add/remove port on runtime
            exist = obj.ports.some((port: Port) => port.id === ports[parseInt(i.toString(), 10)].id);
            if (exist) {
                continue;
            }

            if (obj instanceof Node) {
                newObj = new PointPort(obj, 'ports', ports[parseInt(i.toString(), 10)], true);
                obj.ports.push(newObj);
            } else if (obj instanceof Connector) {
                newObj = new PathPort(obj, 'ports', ports[parseInt(i.toString(), 10)], true);
                obj.ports.push(newObj);
            }
            //Removed isBlazor code
            if ((obj as NodeModel).children) {
                // 907773: Add port to Group at runtime Issue Fix
                const container: GroupableView = obj.wrapper;
                for (let k: number = 0; k < container.children.length; k++) {
                    const wrapper: DiagramElement = container.children[parseInt(k.toString(), 10)];
                    if ((wrapper.id).match(container.id)) {
                        (obj as Node).initPort(this.getDescription, wrapper as GroupableView, newObj);
                        break;
                    }
                }
            } else {
                const canvas: GroupableView = obj.wrapper;
                if (obj instanceof Node) {
                    canvas.children.push((obj as Node).initPortWrapper(obj.ports[obj.ports.length - 1] as Port));
                } else if (obj instanceof Connector) {
                    let points: PointModel[] = obj.type === 'Bezier' ? obj.intermediatePoints : obj.getConnectorPoints(obj.type);
                    points = obj.clipDecorators(obj, points);
                    const bounds: Rect = Rect.toBounds(points);
                    // eslint-disable-next-line max-len
                    canvas.children.push((obj as Connector).initPort(obj.ports[obj.ports.length - 1] as Port, points, bounds, undefined));
                }
            }
            if (!(this.diagramActions & DiagramAction.UndoRedo) && !(this.diagramActions & DiagramAction.Group)) {
                const entry: HistoryEntry = {
                    type: 'PortCollectionChanged', changeType: 'Insert', undoObject: cloneObject(newObj),
                    redoObject: cloneObject(obj), category: 'Internal'
                };
                this.addHistoryEntry(entry);
            }
        }
        if (ports.length > 1) {
            this.endGroupAction();
        }
        //Removed isBlazor code
        obj.wrapper.measure(new Size((obj as Node).width, (obj as Node).height));
        obj.wrapper.arrange(obj.wrapper.desiredSize);
        this.updateDiagramObject(obj);
        this.protectPropertyChange(false);
    }


    /**
     * Adds constraints at run time. \
     *
     * @returns { void }Add constraints at run time .\
     * @param {number} constraintsType - The source value for constraints.
     * @param {number} constraintsValue - The target value for constraints.
     *
     */
    public addConstraints(constraintsType: number, constraintsValue: number): number {
        return constraintsType | constraintsValue;
    }


    /**
     * Remove constraints at run time. \
     *
     * @returns { void }Remove constraints at run time.\
     * @param {number} constraintsType - The type of constraints to be removed.
     * @param {number} constraintsValue - The value of constraints to be removed.
     *
     */
    public removeConstraints(constraintsType: number, constraintsValue: number): number {
        return constraintsType & ~constraintsValue;
    }


    /**
     * Add labels in node at the run time in the blazor platform  \
     *
     * @returns { void } Add labels in node at the run time in the blazor platform  \
     * @param {NodeModel} obj - provide the obj value.
     * @param {ShapeAnnotationModel[]} labels - provide the labels value.
     *
     */
    public addNodeLabels(obj: NodeModel, labels: ShapeAnnotationModel[]): void {
        this.addLabels(obj, labels);
    }


    /**
     * Adds labels to a connector at runtime in the Blazor platform.\
     *
     * @returns { void } Adds labels to a connector at runtime in the Blazor platform.\
     * @param {ConnectorModel} obj - The connector to which labels will be added.
     * @param {PathAnnotationModel[]} labels - An array of labels to add to the connector.
     *
     */
    public addConnectorLabels(obj: ConnectorModel, labels: PathAnnotationModel[]): void {
        this.addLabels(obj, labels);
    }


    /**
     * Adds labels to a node or connector at runtime. \
     *
     * @returns { void } Adds labels to a node or connector at runtime.\
     * @param {NodeModel | ConnectorModel} obj - The node or connector to which labels will be added.
     * @param {ShapeAnnotationModel[] | PathAnnotation[] | PathAnnotationModel[]} labels - An array of label objects to be added.
     *
     */
    public addLabels(obj: NodeModel | ConnectorModel, labels: ShapeAnnotationModel[] | PathAnnotation[] | PathAnnotationModel[]): void {
        this.protectPropertyChange(true); const isAddLabelInServer: boolean = true;
        const annotationCollection: (PathAnnotation | ShapeAnnotation)[] = [];
        //Removed isBlazor code
        obj = this.nameTable[obj.id] || obj;
        const canvas: GroupableView = obj.wrapper; let newObj: ShapeAnnotation | PathAnnotation;
        if (labels.length > 1) {
            this.startGroupAction();
        }
        for (let i: number = 0; i < labels.length; i++) {
            if (obj instanceof Node) {
                newObj = new ShapeAnnotation(obj, 'annotations', labels[parseInt(i.toString(), 10)], true);
                (obj as Node).annotations.push(newObj);
                //Removed isBlazor code
                if ((obj as Node).children) {
                    const node: Node = (obj as Node);
                    for (let i: number = 0; i < node.wrapper.children.length; i++) {
                        if (node.wrapper.children[parseInt(i.toString(), 10)].id === node.id + 'group_container') {
                            const container: GroupableView = node.wrapper.children[parseInt(i.toString(), 10)] as GroupableView;
                            container.children.push(
                                obj.initAnnotationWrapper(obj.annotations[obj.annotations.length - 1] as Annotation, this.element.id)
                            );
                        }
                    }
                } else {
                    canvas.children.push(
                        obj.initAnnotationWrapper(obj.annotations[obj.annotations.length - 1] as Annotation, this.element.id)
                    );
                }
            } else if (obj instanceof Connector) {
                newObj = new PathAnnotation(obj, 'annotations', labels[parseInt(i.toString(), 10)], true);
                (obj as Connector).annotations.push(newObj as PathAnnotation);
                //Removed isBlazor code
                const segment: DiagramElement = canvas.children[0];
                const bounds: Rect = new Rect(
                    segment.offsetX - segment.width / 2,
                    segment.offsetY - segment.height / 2, segment.width, segment.height);
                canvas.children.push(obj.getAnnotationElement(
                    obj.annotations[obj.annotations.length - 1] as PathAnnotation,
                    obj.intermediatePoints, bounds, this.getDescription, this.element.id
                ));
            }
            if (!(this.diagramActions & DiagramAction.UndoRedo) && !(this.diagramActions & DiagramAction.Group)) {
                const entry: HistoryEntry = {
                    type: 'LabelCollectionChanged', changeType: 'Insert', undoObject: cloneObject(newObj),
                    redoObject: cloneObject(obj), category: 'Internal'
                };
                this.addHistoryEntry(entry);
            }
        }
        if (labels.length > 1) {
            this.endGroupAction();
        }
        //Removed isBlazor code
        obj.wrapper.measure(new Size(canvas.width, canvas.height));
        obj.wrapper.arrange(canvas.desiredSize);
        this.updateDiagramObject(obj);
        this.protectPropertyChange(false);
        //EJ2-908488 - Added for Update annotations in overview
        this.refreshCanvasLayers();
    }

    /**
     *addChildToUmlNode - Add methods, members and attributes into a UML class runtime. \
     *
     * @returns { void } Add.
     * @param {NodeModel} node - Specifies the existing UmlClass node in the diagram to which you intend to add child elements.
     * @param {UmlClassMethodModel | UmlClassAttributeModel | UmlEnumerationMemberModel} child - Specify the child elements, such as attributes, members, or methods, to be added to the UML class.
     * @param {UmlClassChildType} umlChildType - Specify the enum that you intend to add to the UML class.
     *
     */
    public addChildToUmlNode(node: NodeModel, child: UmlClassMethodModel | UmlClassAttributeModel | UmlEnumerationMemberModel,
                             umlChildType: UmlClassChildType): void {
        let classifier: UmlClassModel;
        let method: UmlClassMethodModel;
        let attribute: UmlClassAttributeModel;
        let member: UmlEnumerationMemberModel;
        const textWrap: TextWrap = 'NoWrap';
        //Members and attributes are exclusively added to the classShape and interfaceShape within the UML node
        if ((node.shape as UmlClassifierShapeModel).classifier === 'Class' || (node.shape as UmlClassifierShapeModel).classifier === 'Interface') {
            if (umlChildType === 'Method') {
                method = new UmlClassMethod(node as MethodArguments, '', child);
                if ((node.shape as UmlClassifierShapeModel).classifier === 'Class') {
                    (node.shape as UmlClassifierShapeModel).classShape.methods.push(method);
                    classifier = (node.shape as UmlClassifierShapeModel).classShape;
                } else if ((node.shape as UmlClassifierShapeModel).classifier === 'Interface') {
                    (node.shape as UmlClassifierShapeModel).interfaceShape.methods.push(method);
                    classifier = (node.shape as UmlClassifierShapeModel).interfaceShape;
                }
                //this method triggers for adding methods at runtime
                getClassMembersChild(node as Node, this, classifier, textWrap);
            } else if (umlChildType === 'Attribute') {
                attribute = new UmlClassAttribute(node as MethodArguments, '', child);
                if ((node.shape as UmlClassifierShapeModel).classifier === 'Class') {
                    (node.shape as UmlClassifierShapeModel).classShape.attributes.push(attribute);
                    classifier = (node.shape as UmlClassifierShapeModel).classShape;
                } else if ((node.shape as UmlClassifierShapeModel).classifier === 'Interface') {
                    (node.shape as UmlClassifierShapeModel).interfaceShape.attributes.push(attribute);
                    classifier = (node.shape as UmlClassifierShapeModel).interfaceShape;
                }
                //this method triggers for adding attributes at runtime
                getClassAttributesChild(node as Node, this, classifier, textWrap);
            }
        } else if ((node.shape as UmlClassifierShapeModel).classifier === 'Enumeration' && umlChildType === 'Member') {
            member = new UmlEnumerationMember(node as UmlEnumerationMember, '', child);
            (node.shape as UmlClassifierShapeModel).enumerationShape.members.push(member);
            classifier = (node.shape as UmlClassifierShapeModel).enumerationShape;
            //this method triggers for adding members at runtime
            getClassNodesChild(node as Node, this, classifier, textWrap);
        }
        //The clearSelection methods is invoked to update the newly added child type dynamically at runtime
        this.clearSelection();
        this.updateSelector();
    }


    /**
     * Dynamically add lanes to a swimlane at runtime. You can specify the swimlane (node), the lanes to be added (lane), and an optional index to determine where the lanes should be inserted. \
     *
     * @returns { void } Dynamically add lanes to a swimlane at runtime. You can specify the swimlane (node), the lanes to be added (lane), and an optional index to determine where the lanes should be inserted.\
     * @param {NodeModel} node - The swimlane to which lanes will be added.
     * @param {LaneModel[]} lane -An array of LaneModel objects representing the lanes to be added.
     * @param {number} index - The index at which the lanes should be inserted.
     *
     */
    public addLanes(node: NodeModel, lane: LaneModel[], index?: number): void {
        node = this.nameTable[node.id] || node;
        for (let i: number = 0; i < lane.length; i++) {
            addLane(this, node, lane[parseInt(i.toString(), 10)], index);
            if (index !== undefined) {
                index += 1;
            }
        }
        this.updateDiagramElementQuad();
    }


    /**
     * Adds phases to a swimlane at runtime.  \
     *
     * @returns { void } Adds phases to a swimlane at runtime. \
     * @param {NodeModel} node - object representing the swimlane to which phases will be added.
     * @param {PhaseModel[]} phases - objects representing the phases to be added.
     *
     */
    public addPhases(node: NodeModel, phases: PhaseModel[]): void {
        node = this.nameTable[node.id] || node;
        for (let i: number = 0; i < phases.length; i++) {
            //897967-Exception thrown when adding Phases at runtime and perform undo Action
            this.protectPropertyChange(true);
            addPhase(this, node, phases[parseInt(i.toString(), 10)]);
            this.protectPropertyChange(false);
        }
        this.updateDiagramElementQuad();
    }


    /**
     *Removes a dynamic lane from a swimlane at runtime. \
     *
     * @returns { void } Removes a dynamic lane from a swimlane at runtime.\
     * @param {NodeModel} node - representing the swimlane to remove the lane from.
     * @param {LaneModel} lane - representing the dynamic lane to be removed.
     *
     */
    public removeLane(node: NodeModel, lane: LaneModel): void {
        if (lane) {
            // 912168- Undoing removed lane throws exception Issue Fix
            const laneHead: NodeModel = this.nameTable[lane.header.id];
            this.diagramActions = this.diagramActions | DiagramAction.PublicMethod;
            removeLane(this, laneHead, node, undefined);
            this.updateDiagramElementQuad();
        }
    }

    /**
     *Removes a phase from a swimlane at runtime.\
     *
     * @returns { void } Removes a phase from a swimlane at runtime.\
     * @param {NodeModel} node - representing the swimlane to remove the phase from.
     * @param {PhaseModel} phase - representing the phase to be removed.
     *
     */
    public removePhase(node: NodeModel, phase: PhaseModel): void {
        const id: string = phase.header.id;
        const phaseObj: NodeModel = this.nameTable[`${id}`];
        removePhase(this, phaseObj, node);
        this.updateDiagramElementQuad();
    }
    //827745-support to edit Segment for Straight connector at runtime.
    /**
     * Used to add or remove intermediate segments to the straight connector.
     *
     * @returns { void }  Used to add or remove intermediate segments to the straight connector.
     * @param {IEditSegmentOptions} editOptions - An object containing various options for adding/removing segments.
     *
     */
    public editSegment(editOptions: IEditSegmentOptions): void {
        if (editOptions.connector.type === 'Straight') {
            const connector: ConnectorModel = editOptions.connector;
            const mode: string = editOptions && editOptions.SegmentEditing ? editOptions.SegmentEditing : 'Toggle';
            const point: PointModel = editOptions.point;
            let hasPoint: boolean; let allowEdit: boolean;
            for (let i: number = 0; i < connector.segments.length; i++) {
                const segment: StraightSegment = (connector.segments)[parseInt(i.toString(), 10)] as StraightSegment;
                if (contains(point, segment.point, connector.hitPadding)) {
                    hasPoint = true;
                    break;
                }
            }
            if ((hasPoint && mode === 'Remove') || (!hasPoint && mode === 'Add')) {
                allowEdit = true;
            }
            if ((connector.type === 'Straight') && (allowEdit || mode === 'Toggle')) {
                this.connectorEditingToolModule.addOrRemoveSegment(connector, point, this.commandHandler);
            }
        }
    }
    private removelabelExtension(
        obj: Node | ConnectorModel, labels: ShapeAnnotationModel[] | PathAnnotationModel[],
        j: number, wrapper: DiagramElement):
        void {
        for (let i: number = 0; i < (wrapper as GroupableView).children.length; i++) {
            const canvas: DiagramElement = (wrapper as GroupableView).children[parseInt(i.toString(), 10)];
            if ((canvas instanceof TextElement) || (canvas instanceof DiagramHtmlElement)) {
                if (canvas.id.match('_' + labels[parseInt(j.toString(), 10)].id + '$')) {
                    for (let k: number = 0; k < obj.annotations.length; k++) {
                        if (canvas.id.match('_' + obj.annotations[parseInt(k.toString(), 10)].id + '$')) {
                            if (!(this.diagramActions & DiagramAction.UndoRedo)) {
                                const entry: HistoryEntry = {
                                    type: 'LabelCollectionChanged', changeType: 'Remove', undoObject: cloneObject(obj.annotations[parseInt(k.toString(), 10)]),
                                    redoObject: cloneObject(obj), category: 'Internal'
                                };
                                this.addHistoryEntry(entry);
                            }
                            obj.annotations.splice(k, 1);
                        }
                    }
                    (wrapper as GroupableView).children.splice(i, 1);
                    if (this.mode === 'SVG') {
                        let element: HTMLElement = getDiagramElement(canvas.id, this.element.id);
                        if (element) {
                            const element: HTMLElement = getDiagramElement(canvas.id, this.element.id);
                            element.parentNode.removeChild(element);
                        }
                        const textElement: HTMLElement = getDiagramElement(canvas.id + '_text', this.element.id);
                        if (textElement) {
                            element = getDiagramElement(canvas.id + '_text', this.element.id);
                            element.parentNode.removeChild(element);
                        }
                        const htmlElement: HTMLElement = getDiagramElement(canvas.id + '_html_element', this.element.id);
                        if (htmlElement) {
                            htmlElement.parentNode.removeChild(htmlElement);
                        }
                    } else {
                        this.refreshCanvasLayers();
                    }
                }
            }
        }
    }


    /**
     * Removes labels from a node or connector at runtime. \
     *
     * @returns { string }    Removes labels from a node or connector at runtime. \
     * @param { Node | ConnectorModel} obj - Representing the node or connector to remove labels from.
     * @param {ShapeAnnotationModel[] | PathAnnotationModel[]} labels - objects representing the labels to be removed.
     *
     */
    public removeLabels(obj: Node | ConnectorModel, labels: ShapeAnnotationModel[] | PathAnnotationModel[]): void {
        const isAddLabelInServer: boolean = true;
        //Removed isBlazor code
        obj = this.nameTable[obj.id] || obj;
        // Removed isBlazor code
        if (labels.length > 1) {
            this.startGroupAction();
        }
        for (let j: number = labels.length - 1; j >= 0; j--) {
            if ((obj as NodeModel).children && (obj as NodeModel).children.length > 0) {
                //Bug 886881: Exception throws while ungrouping a group node with annotations.
                //Added the condition to check the wrapper id is same as the obj id to remove the group node label alone while unGroup.
                const groupWrapper: any = obj.wrapper.children.filter((wrapper: any) => wrapper.id === obj.id + 'group_container');
                if (groupWrapper && groupWrapper.length > 0) {
                    this.removelabelExtension(obj, labels, j, groupWrapper[0]);
                }
            } else {
                this.removelabelExtension(obj, labels, j, obj.wrapper);
            }

        }
        if (labels.length > 1) {
            this.endGroupAction();
        }
        //EJ2-908488 - Added for Update annotations in overview
        this.refreshCanvasLayers();
    }


    private removePortsExtenion(
        obj: Node | Connector, ports: PointPortModel[] | PathPortModel[],
        j: number, wrapper: DiagramElement):
        void {
        for (let i: number = 0; i < (wrapper as GroupableView).children.length; i++) {
            const canvas: DiagramElement = (wrapper as GroupableView).children[parseInt(i.toString(), 10)];
            if (canvas instanceof PathElement) {
                if (canvas.id.match('_' + ports[parseInt(j.toString(), 10)].id + '$')) {
                    for (let k: number = 0; k < obj.ports.length; k++) {
                        if (canvas.id.match('_' + obj.ports[parseInt(k.toString(), 10)].id + '$')) {
                            if (!(this.diagramActions & DiagramAction.UndoRedo)) {
                                const entry: HistoryEntry = {
                                    type: 'PortCollectionChanged', changeType: 'Remove', undoObject: cloneObject(obj.ports[parseInt(k.toString(), 10)]),
                                    redoObject: cloneObject(obj), category: 'Internal'
                                };
                                this.addHistoryEntry(entry);
                            }
                            obj.ports.splice(k, 1);
                        }
                    }
                    (wrapper as GroupableView).children.splice(i, 1);
                    if (this.mode === 'SVG') {
                        const element: HTMLElement = getDiagramElement(canvas.id, this.element.id);
                        // 905159: undo redo the multi-node after the group and ungrouping the multi nodes Issue fix
                        if (element) {
                            element.parentNode.removeChild(element);
                        }
                    } else {
                        this.refreshCanvasLayers();
                    }
                }
            }
        }
    }


    /**
     * Removes Ports at run time. \
     *
     * @returns { void } Removes Ports at run time.\
     * @param {Node} obj - The node or connector to remove ports from.
     * @param {PointPortModel[]} ports - An array of ports to be removed.
     *
     */
    public removePorts(obj: Node | Connector, ports: PointPortModel[] | PathPortModel[]): void {
        const isAddPortInServer: boolean = true;
        //Removed isBlazor code
        obj = this.nameTable[obj.id] || obj;
        const portLength: number = ports.length;
        //Removed isBlazor code
        if (portLength > 1) {
            this.startGroupAction();
        }
        for (let j: number = ports.length - 1; j >= 0; j--) {
            if ((obj as NodeModel).children && (obj as NodeModel).children.length > 0) {
                for (let k: number = 0; k < obj.wrapper.children.length; k++) {
                    //EJ2-66928 Bug- added for ungroup Issue to only remove the grouping ports and not to remove ports of the children nodes
                    const wrapper: DiagramElement = obj.wrapper.children[parseInt(k.toString(), 10)];
                    if ((wrapper.id).match(obj.wrapper.id)) {
                        this.removePortsExtenion(obj, ports, j, obj.wrapper.children[parseInt(k.toString(), 10)]);
                    }
                }
            } else {
                this.removePortsExtenion(obj, ports, j, obj.wrapper);
            }

        }

        if (portLength > 1) {
            this.endGroupAction();
        }
    }

    //public methods - end region



    /**
     * getSizeValue method \
     *
     * @returns { string }     getSizeValue method .\
     * @param {string | number} real - provide the real value.
     * @param {string | number} rulerSize - provide the rulerSize value.
     *
     * @private
     */
    public getSizeValue(real: string | number, rulerSize?: number): string {
        let value: string;
        if (real.toString().indexOf('px') > 0) {
            value = real.toString();
        } else if (real.toString().indexOf('%') > 0) {
            value = rulerSize !== undefined ? '100%' : real.toString();
        } else {
            value = real.toString() + 'px';
        }
        if (rulerSize) {
            const position: Size = getRulerSize(this);
            value = 'calc(' + value + ' - ' + rulerSize + 'px)';
        }
        return value;
    }

    private renderRulers(): void {
        if (this.rulerSettings.showRulers) {
            renderOverlapElement(this);
            renderRuler(this, true);
            renderRuler(this, false);
        } else {
            removeRulerElements(this);
        }
    }

    private intOffPageBackground(): void {
        let position: Size = new Size();
        position = getRulerSize(this);
        const element: HTMLElement = document.getElementById(this.element.id + 'content');
        //Task 913515: Handle null properties for diagram and barcode properties-phase1
        if (!this.width) {
            this.width = '100%';
        }
        if (!this.height) {
            this.height = '100%';
        }
        const width: string = this.getSizeValue(this.width, position.width);
        const height: string = this.getSizeValue(this.height, position.height);
        const style: string = this.rulerSettings.showRulers ?
            'width:' + width + '; height:' + height + ';' +
            'top:' + position.height + 'px;left:' + position.width + 'px;' +
            'overflow: scroll;position:absolute;overflow:auto;' :
            'width:' + width + '; height:' + height + ';position:absolute;' +
            ' left:0px;  top:0px;overflow: auto;';
        const attr: Object = {
            'id': this.element.id + 'content',
            'tabindex': '0',
            'style': style
        };
        if (!element) {
            this.diagramCanvas = createHtmlElement('div', attr);
            this.element.appendChild(this.diagramCanvas);
        } else {
            this.diagramCanvas = element;
            applyStyleAgainstCsp(this.diagramCanvas, style);
        }
        this.diagramCanvas.style.background = this.backgroundColor as string;
    }

    private initDiagram(): void {
        this.intOffPageBackground();
        setAttributeHtml(this.element, {
            style: 'width:' + this.getSizeValue(this.width) + '; height:'
                + this.getSizeValue(this.height) + ';position:relative;overflow:hidden;'
        });
    }
    private renderHiddenUserHandleTemplateLayer(bounds: ClientRect): void {
        //let element: HTMLElement;
        const attributes: object = {
            'class': this.element.id + '_hiddenUserHandleTemplate',
            'style': 'width:' + bounds.width + 'px; height:' + bounds.height + 'px;' + 'visibility:hidden ;  overflow: hidden;'
        };
        const element: HTMLElement = createHtmlElement('div', attributes);
        this.element.appendChild(element);
    }
    private renderBackgroundLayer(bounds: ClientRect, commonStyle: string): void {
        const bgLayer: SVGElement = this.createSvg(this.element.id + '_backgroundLayer_svg', bounds.width, bounds.height);
        applyStyleAgainstCsp(bgLayer, commonStyle);
        const backgroundImage: SVGElement = createSvgElement('g', {
            'id': this.element.id + '_backgroundImageLayer',
            'class': 'e-background-image-layer'
        });
        bgLayer.appendChild(backgroundImage);
        const attr: Object = { 'id': this.element.id + '_backgroundLayer', 'class': 'e-background-layer' };
        const background: SVGElement = createSvgElement('g', attr);
        bgLayer.appendChild(background);
        this.diagramCanvas.appendChild(bgLayer);
    }

    private renderGridLayer(bounds: ClientRect, commonStyle: string): void {
        const svgGridSvg: SVGElement = this.createSvg(this.element.id + '_gridline_svg', bounds.width, bounds.height);
        svgGridSvg.setAttribute('class', 'e-grid-layer');
        const svgGrid: SVGElement = createSvgElement('g', { 'id': this.element.id + '_gridline' });
        const rect: SVGElement = createSvgElement('rect', {
            'id': this.element.id + '_grid_rect', 'x': '0', 'y': '0', 'width': '100%', 'height': '100%'
        });
        if (checkBrowserInfo()) {
            //EJ2-832888-To remove the black grid lines appearing in the safari browser.
            const url: URL = new URL(window.location.href);
            // Check if the URL contains a query string
            if (url.search !== '') {
                rect.setAttribute('fill', 'url(#' + this.element.id + '_pattern)');
            }
            else {
                rect.setAttribute('fill', 'url(' + location.protocol + '//' + location.host + location.pathname +
                    '#' + this.element.id + '_pattern)');
            }
        } else {
            rect.setAttribute('fill', 'url(#' + this.element.id + '_pattern)');
        }
        svgGrid.appendChild(rect);
        svgGridSvg.appendChild(svgGrid);
        this.diagramCanvas.appendChild(svgGridSvg);
        setAttributeSvg(svgGridSvg, { 'style': commonStyle });
    }

    private renderDiagramLayer(bounds: ClientRect, commonStyle: string): void {
        const attributes: Object = {
            'id': this.element.id + '_diagramLayer_div',
            'style': 'width:' + bounds.width + 'px; height:' + bounds.height + 'px;' + commonStyle
        };
        this.diagramLayerDiv = createHtmlElement('div', attributes);
        if (this.mode === 'SVG') {
            const diagramSvg: SVGElement = this.createSvg(this.element.id + '_diagramLayer_svg', bounds.width, bounds.height);
            diagramSvg.style['pointer-events'] = 'none';
            diagramSvg.setAttribute('class', 'e-diagram-layer');
            const diagramLayer: SVGElement = createSvgElement('g', { 'id': this.element.id + '_diagramLayer' });
            const transformationLayer: SVGElement = createSvgElement('g', {});
            this.diagramLayer = diagramLayer as SVGGElement;
            diagramSvg.style['pointer-events'] = 'all';
            transformationLayer.appendChild(diagramLayer);
            diagramSvg.appendChild(transformationLayer);
            this.diagramLayerDiv.appendChild(diagramSvg);
        } else {
            this.diagramLayer = CanvasRenderer.createCanvas(this.element.id + '_diagram', bounds.width, bounds.height);
            applyStyleAgainstCsp(this.diagramLayer, 'position:absolute;left:0px;top:0px;');
            this.diagramLayerDiv.appendChild(this.diagramLayer);
        }
        this.diagramCanvas.appendChild(this.diagramLayerDiv);
    }

    private initLayers(): void {
        const commonStyle: string = 'position:absolute;top:0px;left:0px;overflow:hidden;pointer-events:none;';
        const container: HTMLElement = document.getElementById(this.element.id);
        const bounds: ClientRect = container.getBoundingClientRect();
        //Task 918932: Provide diagram control in powerapps- phase2
        this.setScaleFromElement(bounds, container);
        this.modifyBounds(bounds);
        const scrollerSize: number = getScrollerWidth();
        this.scroller.scrollerWidth = scrollerSize;
        this.scroller.setViewPortSize(bounds.width, bounds.height);
        this.renderRulers();
        const measureWindowElement: string = 'measureElement';
        if (window[`${measureWindowElement}`]) {
            window[`${measureWindowElement}`] = null;
            const measureElements: HTMLElement = document.getElementById('measureElement');
            measureElements.remove();
        }
        createMeasureElements();
        // this.renderBackgroundImageLayer(bounds, commonStyle);
        this.renderBackgroundLayer(bounds, commonStyle);
        this.renderGridLayer(bounds, commonStyle);
        this.renderDiagramLayer(bounds, commonStyle);
        this.renderHTMLLayer(bounds, commonStyle);
        this.renderPortsExpandLayer(bounds, commonStyle);
        this.renderNativeLayer(bounds, commonStyle);
        this.renderAdornerLayer(bounds, commonStyle);
        this.renderHiddenUserHandleTemplateLayer(bounds);
    }
    /**
     * @private
     * @param { ClientRect } bounds - provide the bounds value
     * @param { HTMLElement } container - provide the container value
     * @returns { void }
     *
     */
    public setScaleFromElement(bounds: ClientRect, container: HTMLElement): void {
        const width: number = bounds.width / container.clientWidth;
        this.scaleValue = width;
    }
    /**
     * @private
     * @returns { void }
     * @param { any } bounds - provide the bounds value
     */
    public modifyBounds(bounds: any): void {
        const scale: number = this.scaleValue;
        bounds.x = bounds.x / scale;
        bounds.y = bounds.y / scale;
        bounds.width = bounds.width / scale;
        bounds.height = bounds.height / scale;
    }
    /**
     * @private
     * @returns { number } - Returns offset value
     * @param { number } offset - provide the offset value
     * @param { boolean } isTooltipOffset - provide the isTooltipOffset value
     *
     */
    public modifyClientOffset(offset: number, isTooltipOffset?: boolean): number {
        const scale: number = this.scaleValue;
        let value: number = 0;
        if (isTooltipOffset) {
            value = offset * scale;
        } else {
            value = offset / scale;
        }
        return value;
    }

    private renderAdornerLayer(bounds: ClientRect, commonStyle: string): void {
        const divElement: HTMLElement = createHtmlElement('div', {
            'id': this.element.id + '_diagramAdornerLayer',
            'style': 'width:' + bounds.width + 'px;height:' + bounds.height + 'px;' + commonStyle
        });
        const element: HTMLElement = createHtmlElement('div', {
            'id': this.element.id + '_diagramUserHandleLayer',
            'style': 'width:' + bounds.width + 'px;height:' + bounds.height + 'px;' + commonStyle
        });
        element.setAttribute('class', 'e-userHandle-layer');
        divElement.appendChild(element);
        const svgAdornerSvg: SVGElement = this.createSvg(this.element.id + '_diagramAdorner_svg', bounds.width, bounds.height);
        svgAdornerSvg.setAttribute('class', 'e-adorner-layer');
        svgAdornerSvg.style['pointer-events'] = 'none';
        this.adornerLayer = createSvgElement('g', { 'id': this.element.id + '_diagramAdorner' });
        this.adornerLayer.style[' pointer-events'] = 'all';
        svgAdornerSvg.appendChild(this.adornerLayer);
        divElement.appendChild(svgAdornerSvg);
        this.diagramCanvas.appendChild(divElement);
        const svgSelector: SVGElement = createSvgElement('g', { 'id': this.element.id + '_SelectorElement' });
        this.adornerLayer.appendChild(svgSelector);
        setAttributeSvg(svgAdornerSvg, { style: 'pointer-events:none;' });
    }

    private renderPortsExpandLayer(bounds: ClientRect, commonStyle: string): void {
        const svgPortsSvg: SVGElement = this.createSvg(this.element.id + '_diagramPorts_svg', bounds.width, bounds.height);
        svgPortsSvg.setAttribute('class', 'e-ports-expand-layer');
        const svgPortsLayer: SVGElement = createSvgElement('g', {
            'id': this.element.id + '_diagramPorts',
            'class': 'e-ports-layer',
            'style': 'pointer-events: all;'
        });
        svgPortsSvg.appendChild(svgPortsLayer);
        const svgExpandLayer: SVGElement = createSvgElement('g', {
            'id': this.element.id + '_diagramExpander',
            'class': 'e-expand-layer',
            'style': 'pointer-events: all;'
        });
        svgPortsSvg.appendChild(svgExpandLayer);
        this.diagramCanvas.appendChild(svgPortsSvg);
        setAttributeSvg(svgPortsSvg, { 'style': commonStyle });
    }

    private renderHTMLLayer(bounds: ClientRect, commonStyle: string): void {
        this.htmlLayer = createHtmlElement('div', {
            'id': this.element.id + '_htmlLayer',
            'style': 'width:' + bounds.width + 'px; height:' + bounds.height + 'px;position:absolute;top:0px;' +
                'left:0px;overflow:hidden;pointer-events:none;',
            'class': 'e-html-layer'
        });
        const htmlLayerDiv: HTMLElement = createHtmlElement('div', {
            'id': this.element.id + '_htmlLayer_div',
            'style': 'position:absolute;top:0px;left:0px;pointer-events:all;'
        });
        this.htmlLayer.appendChild(htmlLayerDiv);
        this.diagramCanvas.appendChild(this.htmlLayer);
    }

    private renderNativeLayer(bounds: ClientRect, commonStyle: string): void {
        const nativeLayerSvg: SVGElement = this.createSvg(this.element.id + '_nativeLayer_svg', bounds.width, bounds.height);
        const nativeLayer: SVGElement = createSvgElement('g', { 'id': this.element.id + '_nativeLayer', 'style': 'pointer-events:all;' });
        nativeLayerSvg.appendChild(nativeLayer);
        this.diagramLayerDiv.appendChild(nativeLayerSvg);
        setAttributeSvg(nativeLayerSvg, { 'class': 'e-native-layer', 'style': commonStyle });
    }

    /**
     * createSvg method \
     *
     * @returns { void }     createSvg method .\
     * @param {string} id - provide the source value.
     * @param {string | number} width - provide the source value.
     * @param {string | number} height - provide the source value.
     *
     * @private
     */
    public createSvg(id: string, width: string | number, height: string | number): SVGElement {
        const svgObj: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        setAttributeSvg(svgObj, { 'id': id, 'width': width, 'height': height });
        return svgObj;
    }
    private updateBazorShape(): void {
        for (let i: number = 0; i < this.nodes.length; i++) {
            const node: NodeModel = this.nodes[parseInt(i.toString(), 10)];
            switch (node.shape.type) {
            case 'Bpmn':
                (node.shape as DiagramShape).bpmnShape =
                    (node.shape as BpmnShape).shape; break;
            case 'UmlActivity':
                (node.shape as DiagramShape).umlActivityShape =
                    (node.shape as UmlActivityShape).shape; break;
            case 'Flow':
                (node.shape as DiagramShape).flowShape =
                    (node.shape as FlowShape).shape; break;
            case 'Basic':
                (node.shape as DiagramShape).basicShape =
                    (node.shape as BasicShape).shape; break;
            case 'Text':
                (node.shape as DiagramShape).textContent =
                        (node.shape as Annotation).content; break;

            }
        }
    }

    private initObjects(isLoad?: boolean): void {
        this.updateBazorShape();
        if (!this.isLoading) {
            this.initData();
        }
        this.initLayerObjects();
        this.updateBridging(isLoad);
    }

    /**
     * initLayerObjects method \
     *
     * @returns { void }     initLayerObjects method .\
     *
     * @private
     */
    public initLayerObjects(): void {
        const hasLayers: boolean = this.layers.length > 1; //const set: boolean = false;
        const connectors: Connector[] = [];
        const blazor: string = 'Blazor';
        //Removed isBlazor code
        const tempTabel: {} = {};
        const bpmnTable: {} = {};
        const containerTable: {} = {};

        const tempNode: NodeModel[] = [];
        const groups: string[] = [];

        const i: number = 0;
        const previousNodeObject: Object[] = [];
        const previousConnectorObject: Object[] = [];
        const updateNodeObject: Object[] = [];
        const updateConnectorObject: Object[] = [];
        const changeNodes: Object[] = [];
        const changeConnectors: Object[] = [];
        //Removed isBlazor code
        for (const obj of this.nodes) {
            obj.id = obj.id || randomId();
            this.addToLayer(obj, hasLayers);
            tempTabel[obj.id] = obj;
        }
        for (const obj of this.connectors) {
            obj.id = obj.id || randomId();
            this.addToLayer(obj, hasLayers);
            tempTabel[obj.id] = obj;
        }
        this.tempTable = tempTabel;
        for (const layer of this.layers) {
            for (const obj of layer.objects) {
                if (tempTabel[`${obj}`]) {
                    if (!(tempTabel[`${obj}`] instanceof Connector)) {
                        if ((tempTabel[`${obj}`] as Node).children) {
                            groups.push(obj);
                        } else if ((tempTabel[`${obj}`].shape instanceof BpmnShape) &&
                            (tempTabel[`${obj}`].shape as BpmnShape).activity.subProcess.processes &&
                            (tempTabel[`${obj}`].shape as BpmnShape).activity.subProcess.processes.length > 0) {
                            bpmnTable[tempTabel[`${obj}`].id] = obj;
                        } else if ((tempTabel[`${obj}`].shape instanceof Container) &&
                            (tempTabel[`${obj}`].shape as Container).children &&
                            (tempTabel[`${obj}`].shape as Container).children.length > 0) {
                            containerTable[tempTabel[`${obj}`].id] = obj;
                        }
                        else {
                            this.initNodes(tempTabel[`${obj}`], layer);
                        }
                    } else {
                        const connector: ConnectorModel = tempTabel[`${obj}`];
                        if (connector.sourceID && connector.targetID) {
                            const sourceNode: NodeModel = tempTabel[connector.sourceID];
                            const targetNode: NodeModel = tempTabel[connector.targetID];
                            let flag: boolean = true;
                            if (this.isLoading && ((sourceNode && sourceNode.children && sourceNode.children.length > 0) ||
                                (targetNode && targetNode.children && targetNode.children.length > 0))) {
                                flag = false;
                            }
                            if ((sourceNode && sourceNode.wrapper && targetNode && targetNode.wrapper) && flag) {
                                this.initConnectors(tempTabel[`${obj}`], layer);
                            } else {
                                connectors.push(tempTabel[`${obj}`]);
                            }
                        } else {
                            // 908150: Connector not rendered properly when one end is a group and other end is an endpoint
                            const sourceNode: NodeModel = tempTabel[connector.sourceID];
                            const targetNode: NodeModel = tempTabel[connector.targetID];
                            if ((sourceNode && sourceNode.children && sourceNode.children.length > 0) ||
                            (targetNode && targetNode.children && targetNode.children.length > 0))
                            {
                                connectors.push(tempTabel[`${obj}`]);
                            }
                            else {
                                this.initConnectors(tempTabel[`${obj}`], layer);
                            }
                        }
                    }
                }
            }
            // 930450: Diagram Taking Too Long to Load Due to Complex Hierarchical Tree Layout with Path Nodes
            if (this.pathDataStorage) {
                this.pathDataStorage.clear();
            }
            if (this.bpmnModule) {
                for (const obj of (this.bpmnModule as any).bpmnTextAnnotationConnector) {
                    this.initConnectors(obj as Connector, undefined, true);
                }
            }
        }
        for (const obj of Object.keys(bpmnTable)) {
            this.initObject(tempTabel[`${obj}`]);
            this.bpmnModule.updateDocks(tempTabel[`${obj}`], this);
        }
        //Bug 969383: Margin Properties Fail for Nested Containers with Children.
        //To sort the containerTable to render child containers at first in case of nested containers
        let sortedContainers: string[] = [];
        if (Object.keys(containerTable).length > 0) {
            sortedContainers = this.sortContainersTopologically(containerTable, tempTabel);
        }
        for (const obj of sortedContainers) {
            this.initObject(tempTabel[`${obj}`]);
            updateContainerDocks(tempTabel[`${obj}`], this);
        }
        const alignedGroups: string[] = this.alignGroup(groups, tempTabel);
        for (const obj of alignedGroups) {
            const layer: LayerModel = this.commandHandler.getObjectLayer(obj);
            this.initNodes(tempTabel[`${obj}`], layer);
        }
        for (const connector of connectors) {
            const layer: LayerModel = this.commandHandler.getObjectLayer(connector.id);
            this.initConnectors(connector, layer);
        }
        for (const obj of this.connectorOrRotatedGroups) {
            if (obj.children && obj.flip !== FlipDirection.None && !this.refreshing) {
                this.groupBounds = obj.wrapper.bounds;
                alignElement(obj.wrapper, obj.wrapper.offsetX, obj.wrapper.offsetY, this, obj.wrapper.flip, undefined, undefined);
                for (const childId of obj.children) {
                    const child: ConnectorModel = this.nameTable[`${childId}`];
                    if (child instanceof Connector && child.sourceID && child.targetID) {
                        this.updateConnectorProperties(child);
                    }
                }
                obj.wrapper.measure(new Size(obj.wrapper.actualSize.width, obj.wrapper.actualSize.height));
                obj.wrapper.arrange(obj.wrapper.desiredSize);
            }
        }
        //Removed isBlazor code
    }
    private hasNestingContainer(containerTable: Record<string, any>, tempTabel: Record<string, any>): boolean {
        let hasNesting: boolean = false;
        for (const parentId of Object.keys(containerTable)) {
            const parent: NodeModel = tempTabel[`${parentId}`];
            if (
                parent && parent.shape instanceof Container &&
                Array.isArray(parent.shape.children)
            ) {
                for (const childId of parent.shape.children) {
                    if (containerTable[`${childId}`]) {
                        hasNesting = true;
                        break;
                    }
                }
            }
            if (hasNesting) {
                break;
            }
        }
        return hasNesting;
    }
    private sortContainersTopologically(containerTable: Record<string, any>, tempTabel: Record<string, any>): string[] {
        // 1. Detect nested containers
        const hasNesting: boolean = this.hasNestingContainer(containerTable, tempTabel);
        if (!hasNesting) {
            // No nesting: just return the original order
            return Object.keys(containerTable);
        }
        // Dependency graph: maps containerId to list of its child containerIds
        const dependencyGraph: Record<string, string[]> = {};
        // Track how many parents each container has
        const containerInDegree: Record<string, number> = {};
        // Final sorted order of containerIds
        const sortedContainerIds: string[] = [];
        // Initialize empty dependency graph and in-degree tracker for each container
        for (const containerId of Object.keys(containerTable)) {
            dependencyGraph[`${containerId}`] = [];
            containerInDegree[`${containerId}`] = 0;
        }
        // Build dependency graph: parent -> [children], and track child container in-degree
        for (const parentId of Object.keys(containerTable)) {
            const parentContainer: NodeModel = tempTabel[`${parentId}`];
            // If parentContainer has children that are themselves containers, create dependency
            if (
                parentContainer && parentContainer.shape instanceof Container &&
                Array.isArray(parentContainer.shape.children) &&
                parentContainer.shape.children.length > 0
            ) {
                for (const childId of parentContainer.shape.children as string[]) {
                    if (containerTable[`${childId}`]) {
                        dependencyGraph[`${parentId}`].push(childId);
                        containerInDegree[`${childId}`] = (containerInDegree[`${childId}`] || 0) + 1;
                    }
                }
            }
        }
        // Use Kahn's algorithm for topological sorting
        const processQueue: string[] = [];
        // Start by processing containers without any parents (root containers)
        for (const containerId of Object.keys(containerInDegree)) {
            if (containerInDegree[`${containerId}`] === 0) {
                processQueue.push(containerId);
            }
        }
        // Build the sorted order by traversing dependencies
        while (processQueue.length > 0) {
            const currentId: string = processQueue.shift() as string;
            sortedContainerIds.push(currentId);
            for (const childId of dependencyGraph[`${currentId}`]) {
                containerInDegree[`${childId}`]--;
                if (containerInDegree[`${childId}`] === 0) {
                    processQueue.push(childId);
                }
            }
        }
        // Reverse the result to ensure children are rendered before their parents
        return sortedContainerIds.reverse();
    }
    private alignGroup(parents: string[], tempTabel: {}): string[] {
        let newList: string[] = [];
        const parentist: string[] = [];
        let child: string;
        let childNode: NodeModel;
        let i: number; let j: number;
        for (i = 0; i < parents.length; i++) {
            child = parents[parseInt(i.toString(), 10)];
            childNode = tempTabel[`${child}`]; let node: string;
            if (childNode && childNode.children.length) {
                for (j = 0; j < childNode.children.length; j++) {
                    node = childNode.children[parseInt(j.toString(), 10)];
                    if (parents.indexOf(node) > -1 && (newList.indexOf(node) === -1) &&
                        (parentist.indexOf(node) === -1)) {
                        newList.splice(0, 0, node);
                    }
                }
            }
            if (newList.indexOf(child) === -1) {
                parentist.push(child);
            }
        }
        newList = newList.concat(parentist);
        return newList;
    }
    private addToLayer(obj: NodeModel | ConnectorModel, hasLayers: boolean): void {
        let layer: LayerModel;
        const isSourceId: boolean = false;
        const isTargetId: boolean = false;
        if (hasLayers) {
            layer = this.commandHandler.getObjectLayer(obj.id);
        }
        if (!hasLayers || !layer) {
            if (!this.activeLayerObjectsSet.has(obj.id)) {
                this.activeLayer.objects.push(obj.id);
                this.activeLayerObjectsSet.add(obj.id);
            }
        }
        if ((obj instanceof Node || obj instanceof Connector) &&
            (obj.shape.type !== 'SwimLane' || ((obj as Node).children && (obj as Node).children.length > 0))) {
            if (obj.parentId) {
                const zIndex: number = this.swimlaneZIndexTable[obj.parentId];
                //EJ2-69247 - Unable to select node in swimlane after save and load
                const childzIndex: number = this.swimlaneChildTable[obj.id];
                if ((zIndex && zIndex !== -1) || ((childzIndex && childzIndex !== -1))) {
                    obj.zIndex = this.swimlaneChildTable[obj.id];
                }
            }
            if (obj instanceof Connector && (obj.sourceID && obj.targetID)) {
                //EJ2-69577 - We have removed findNodeInLane method to improve the performance.
                if (this.activeLayerObjectsSet.has(obj.sourceID) &&
                    this.activeLayerObjectsSet.has(obj.targetID)) {
                    this.setZIndex(layer || this.activeLayer, obj);
                }
            } else {
                this.setZIndex(layer || this.activeLayer, obj);
            }
        }
    }
    private updateLayer(newProp: DiagramModel): void {
        for (const key of Object.keys(newProp.layers)) {
            const layerObject: string[] = this.layers[`${key}`].objects;
            for (const obj of layerObject) {
                const node: NodeModel | ConnectorModel = this.nameTable[`${obj}`];
                if (newProp.layers[`${key}`].visible !== undefined) {
                    this.updateElementVisibility(node.wrapper, node as Node, newProp.layers[`${key}`].visible);
                } else if (newProp.layers[`${key}`].lock === true) {
                    this.unSelect(node);
                }
            }
            if (newProp.layers[`${key}`].lock !== undefined) {
                this.layers[`${key}`].lock = newProp.layers[`${key}`].lock;
            }
        }
        if (this.mode !== 'SVG') {
            this.refreshDiagramLayer();
        }
    }
    private updateScrollSettings(newProp: DiagramModel): void {
        const hPan: number = (-this.scroller.horizontalOffset + newProp.scrollSettings.horizontalOffset || 0);
        const vPan: number = (-this.scroller.verticalOffset + newProp.scrollSettings.verticalOffset || 0);
        //diagram scroll offset value is updated in opposite sign value.
        //Bug 951366: Incorrect Scroll Offset Values When scroll diagram Using Scrollbar.
        this.scrollSettings.horizontalOffset = -this.scroller.horizontalOffset || 0;
        this.scrollSettings.verticalOffset = -this.scroller.verticalOffset || 0;
        const oldValue: ScrollValues = {
            VerticalOffset: this.scrollSettings.verticalOffset, HorizontalOffset: this.scrollSettings.horizontalOffset,
            ViewportHeight: this.scrollSettings.viewPortHeight, ViewportWidth: this.scrollSettings.viewPortWidth,
            CurrentZoom: this.scroller.currentZoom
        };
        if (hPan !== 0 || vPan !== 0) {
            this.pan(hPan, vPan);
            //Setting offset property at runtime provides opposite offset values
            this.scrollSettings.horizontalOffset = -this.scroller.horizontalOffset || 0;
            this.scrollSettings.verticalOffset = -this.scroller.verticalOffset || 0;
        }
        const newValue: ScrollValues = {
            VerticalOffset: this.scrollSettings.verticalOffset, HorizontalOffset: this.scrollSettings.horizontalOffset,
            ViewportHeight: this.scrollSettings.viewPortHeight, ViewportWidth: this.scrollSettings.viewPortWidth,
            CurrentZoom: this.scroller.currentZoom
        };
        let panStatus: State = 'Start';
        if (this.realActions & RealAction.PanInProgress) {
            panStatus = 'Progress';
        }
        const arg: IScrollChangeEventArgs | IBlazorScrollChangeEventArgs = {
            oldValue: oldValue as ScrollValues,
            newValue: newValue, source: this,
            panState: panStatus
        };
        //Removed isBlazor code
        this.triggerEvent(DiagramEvent.scrollChange, arg);
        this.commandHandler.updatePanState(true);
        if (this.mode === 'Canvas' && (this.constraints & DiagramConstraints.Virtualization)) {
            this.refreshDiagramLayer();
        }
    }
    /**
     * Refreshes or re-renders the UML sequence diagram based on the latest model data.
     *
     * Use this method when you modify participants, messages, fragments, or layout properties
     * dynamically after the initial rendering, and want those changes to be reflected in the diagram.
     *
     * ```typescript
     * model.participants.push({ id: 'New', content: 'New Participant', ... });
     * diagram.updateFromModel();
     * ```
     *
     * - Recomputes lifeline positions, message lines, and activation boxes.
     * - Ensures the diagram reflects the latest structure and layout.
     *
     * @returns {void}
     */
    public updateFromModel(): void {
        if (this.model.participants.length > 0) {
            // update the diagram with required nodes & connectors collection for sequence diagram.
            (this.model as UmlSequenceDiagram).updateUmlSequenceDiagram(this);
            // initialize nodes & connectors to initialize its wrapper.
            this.initLayerObjects();
            // protect property change in between rendering nodes and connectors
            const propChange: boolean = this.isProtectedOnChange;
            this.protectPropertyChange(true);
            // position the nodes & connect connectors to draw sequence diagram.
            (this.model as UmlSequenceDiagram).render();
            // refresh diagram layer to render the sequence diagram.
            this.refreshDiagramLayer();
            // enable isRefreshed to prevent sequence diagram getting rendered again at diagram render method
            if ((!(this.diagramActions & DiagramAction.Render)) || this.mode === 'Canvas') {
                this.isRefreshed = true;
            }
            // disable protect property change
            if (!propChange) {
                this.protectPropertyChange(propChange);
            }
            // fit to page to focus the sequence diagram content
            this.fitToPage({
                mode: 'Page', region: 'Content', margin: { left: 10, top: 10, right: 10, bottom: 10 },
                canZoomIn: true, canZoomOut: true
            });
        }
    }
    private initData(): void {
        const dataSourceSettings: DataManager = this.dataSourceSettings.dataManager || this.dataSourceSettings.dataSource;
        const adapter: string = 'adaptorName';
        if (this.dataBindingModule && !(this.realActions & RealAction.PreventDataInit)) {
            if (dataSourceSettings && this.dataSourceSettings.connectionDataSource.dataManager) {
                const dataManager: DataManager = this.dataSourceSettings.dataManager || this.dataSourceSettings.dataSource;
                this.nodes = this.generateData(dataManager, true) as NodeModel[];
                this.connectors = this.generateData(
                    this.dataSourceSettings.connectionDataSource.dataManager, false) as ConnectorModel[];
            } else if (dataSourceSettings && dataSourceSettings.dataSource &&
                (dataSourceSettings.dataSource.url || (dataSourceSettings[`${adapter}`] === 'BlazorAdaptor' &&
                    !dataSourceSettings.dataSource.url))) {
                this.dataBindingModule.initSource(this.dataSourceSettings, this);
            } else {
                this.dataBindingModule.initData(this.dataSourceSettings, this);
            }
        } else if (dataSourceSettings && !this.dataBindingModule) {
            console.warn('[WARNING] :: Module "DataBinding" is not available in Diagram component! You either misspelled the module name or forgot to load it.');
        }
    }

    private generateData(dataSource: DataSourceModel | DataManager, isNode: boolean): (NodeModel | ConnectorModel)[] {
        const nodes: (NodeModel | ConnectorModel)[] = [];
        let i: number;
        for (i = 0; i < (dataSource as object[]).length; i++) {
            const row: object = dataSource[parseInt(i.toString(), 10)];
            const node: Connector | Node = isNode ? this.makeData(row as object[], true) : this.makeData(row as object[], false);
            if (node && node.id && (!findNodeByName(nodes, node.id))) {
                nodes.push(node);
            }
        }
        return (nodes);
    }

    private makeData(row: object[], isNode: boolean): Node | Connector {
        let i: number;
        const fields: IFields = isNode ? this.dataSourceSettings as IFields : this.dataSourceSettings.connectionDataSource as IFields;
        const data: Node | Connector = {} as Node | Connector;
        data.id = row[fields.id] ? row[fields.id] : randomId();
        if (fields.sourceID) {
            (data as Connector).sourceID = row[fields.sourceID];
        }
        if (fields.targetID) {
            (data as Connector).targetID = row[fields.targetID];
        }
        if (row[fields.sourcePointX] && row[fields.sourcePointY]) {
            (data as Connector).sourcePoint = { 'x': Number(row[fields.sourcePointX]), 'y': Number(row[fields.sourcePointY]) };
        }
        if (row[fields.targetPointX] && row[fields.targetPointY]) {
            (data as Connector).targetPoint = { 'x': Number(row[fields.targetPointX]), 'y': Number(row[fields.targetPointY]) };
        }
        if (fields.crudAction.customFields && fields.crudAction.customFields.length > 0) {
            for (i = 0; i < fields.crudAction.customFields.length; i++) {
                data[fields.crudAction.customFields[parseInt(i.toString(), 10)]]
                    = row[fields.crudAction.customFields[parseInt(i.toString(), 10)]];
            }
        }
        return data;
    }

    private initNodes(obj: Node, layer: LayerModel): void {
        this.preventDiagramUpdate = true;
        this.initObject(obj as Node, layer);
        this.preventDiagramUpdate = false;
    }

    private initConnectors(obj: Connector, layer: LayerModel, independentObj?: boolean): void {
        this.preventDiagramUpdate = true;
        this.initObject(obj as Connector, layer, independentObj);
        this.updateEdges(obj as Connector);
        this.preventDiagramUpdate = false;
    }

    private setZIndex(layer: LayerModel, obj: NodeModel | ConnectorModel): void {
        //should be changed
        const currentLayer: Layer = (layer as Layer);
        if ((obj).zIndex === Number.MIN_VALUE) {
            while (currentLayer.zIndexTable[currentLayer.objectZIndex + 1]) {
                (layer as Layer).objectZIndex++;
            }
            // obj.zIndex = ++currentLayer.objectZIndex;
            this.setIndex (layer as Layer, obj as NodeModel | ConnectorModel);
        } else {
            const index: number = (obj.zIndex !== null ? obj.zIndex : currentLayer.objectZIndex + 1);
            if (currentLayer.zIndexTable[parseInt(index.toString(), 10)]) {
                const tabelLength: number = Object.keys(currentLayer.zIndexTable).length;
                let j: number = 0;
                for (let i: number = 0; i < tabelLength; i++) {
                    if (i === index) {
                        for (let j: number = tabelLength; j > index; j--) {
                            currentLayer.zIndexTable[parseInt(j.toString(), 10)] = currentLayer.zIndexTable[j - 1];
                            if (this.nameTable[currentLayer.zIndexTable[parseInt(j.toString(), 10)]]) {
                                this.nameTable[currentLayer.zIndexTable[parseInt(j.toString(), 10)]].zIndex = j;
                            }
                        }
                        currentLayer.zIndexTable[parseInt(i.toString(), 10)] = obj.id;
                    }
                    j++;
                }
            }
        }
    }

    private setIndex(layer: Layer, obj: NodeModel | ConnectorModel): void {
        // Helper function to assign object zIndex and increment the objectZIndex of layer
        const assignZIndex: any = (element: NodeModel | ConnectorModel): void => {
            element.zIndex = ++layer.objectZIndex;
            if ((element.shape.type === 'Bpmn' && (element.shape as BpmnShape).activity &&
                (element.shape as BpmnShape).activity.subProcess && (element.shape as BpmnShape).activity.subProcess.processes &&
                (element.shape as BpmnShape).activity.subProcess.processes.length)) {
                const processArray: string[] = (element.shape as BpmnShape).activity.subProcess.processes;
                processArray.forEach((processId: string) => {
                    const processess: (NodeModel | ConnectorModel) = this.nameTable[`${processId}`];
                    if (processess) {
                        processess.zIndex = ++layer.objectZIndex;
                    }
                });
            }
        };
        // Function to handle updating zIndex for child elements
        const updateChildIndex: any = (childId: string): void => {
            // Find if the child is a node or a connector
            const childNode: NodeModel = this.nodes.find((node: NodeModel) => node.id === childId);
            const childConnector: ConnectorModel = this.connectors.find((connector: ConnectorModel) => connector.id === childId);
            if (childNode) {
                if (childNode.children && childNode.children.length > 0) {
                    // Recursively update the z-index for children of group nodes
                    this.setIndex(layer, childNode);
                }
                //934140: Save and Load Functionality Not Working Properly in Subprocess
                else if ((childNode.shape as BpmnShapeModel).activity && (childNode.shape as BpmnShapeModel).activity.subProcess &&
                        (childNode.shape as BpmnShapeModel).activity.subProcess.processes &&
                        (childNode.shape as BpmnShapeModel).activity.subProcess.processes.length > 0) {
                    // Recursively update the z-index for processes of subProcess
                    this.setIndex(layer, childNode);
                }
                else {
                    // Assign zIndex to non-group child node
                    assignZIndex(childNode);
                }
            } else if (childConnector) {
                // Assign zIndex to child connector
                assignZIndex(childConnector);
            }
        };
        // check object is present in current layer
        const currentLayerObject: boolean = layer.objects.indexOf(obj.id) !== -1;
        if (currentLayerObject) {
            if (obj instanceof Node) {
                // Assign zIndex to group or standalone node
                assignZIndex(obj);

                if (obj.shape.type !== 'SwimLane' && obj.children && obj.children.length > 0) {
                    // Update zIndex for each child if there are children
                    for (let k: number = 0; k < obj.children.length; k++) {
                        updateChildIndex(obj.children[parseInt(k.toString(), 10)]);
                    }
                }
                //934140: Save and Load Functionality Not Working Properly in Subprocess
                else if ((obj.shape as BpmnShapeModel).activity && (obj.shape as BpmnShapeModel).activity.subProcess &&
                        (obj.shape as BpmnShapeModel).activity.subProcess.processes &&
                        (obj.shape as BpmnShapeModel).activity.subProcess.processes.length > 0) {
                    // Update zIndex for each processes if there are processes for subProcess
                    for (let i: number = 0; i < (obj.shape as BpmnShapeModel).activity.subProcess.processes.length; i++) {
                        updateChildIndex((obj.shape as BpmnShapeModel).activity.subProcess.processes[parseInt(i.toString(), 10)]);
                    }
                }
            } else {
                // Assign zIndex to a connector
                assignZIndex(obj);
            }
        }
    }

    private initializeDiagramLayers(): void {

        //const tempLayers: LayerModel[] = this.layers;
        for (let i: number = 0; i < this.layers.length; i++) {
            if (this.layers[parseInt(i.toString(), 10)].zIndex !== -1) {
                const temp: LayerModel = this.layers[parseInt(i.toString(), 10)];
                this.layers[parseInt(i.toString(), 10)] = this.layers[this.layers[parseInt(i.toString(), 10)].zIndex];
                this.layers[temp.zIndex] = temp;
            }
        }

        for (const layer of this.layers) {
            layer.zIndex = layer.zIndex !== -1 ? layer.zIndex : this.layers.indexOf(layer);
            this.layerZIndexTable[layer.zIndex] = layer.id;
        }
        for (let i: number = 0; i < this.layers.length; i++) {
            for (let j: number = i + 1; j < this.layers.length; j++) {
                if (this.layers[parseInt(i.toString(), 10)].zIndex > this.layers[parseInt(j.toString(), 10)].zIndex) {
                    const temp: LayerModel = this.layers[parseInt(i.toString(), 10)];
                    this.layers[parseInt(i.toString(), 10)] = this.layers[parseInt(j.toString(), 10)];
                    this.layers[parseInt(j.toString(), 10)] = temp;
                }
            }
        }
        // 966269 - unlayered objects are added to default layer
        if (this.layers.length > 0) {
            const activeLayerId: string = this.activeLayer ? this.activeLayer.id : undefined;
            if (activeLayerId !== 'default_layer') {
                const layerObjectIds: string[] = (this.layers as any).flatMap((layer: LayerModel) => layer.objects);
                const allDiagramObjects: (NodeModel | ConnectorModel)[] =
                    ([] as (NodeModel | ConnectorModel)[]).concat(this.nodes as NodeModel[], this.connectors as ConnectorModel[]);
                const unlayeredObjects: (NodeModel | ConnectorModel)[] = allDiagramObjects.filter(
                    (obj: NodeModel | ConnectorModel) => !(layerObjectIds as any).includes(obj.id)
                );
                if (unlayeredObjects.length > 0) {
                    const unlayeredIds: string[] = unlayeredObjects.map((obj: NodeModel | ConnectorModel) => obj.id);
                    const defaultLayer: LayerModel = {
                        id: 'default_layer',
                        visible: true,
                        lock: false,
                        objects: [],
                        zIndex: 0,
                        objectZIndex: -1,
                        zIndexTable: {}
                    } as LayerModel;
                    this.commandHandler.addLayer(defaultLayer, null, true);
                    const defaultLayerIndex: number = this.layers.findIndex((layer: LayerModel) => layer.id === 'default_layer');
                    if (defaultLayerIndex !== -1) {
                        const [addedLayer]: LayerModel[] = this.layers.splice(defaultLayerIndex, 1);
                        this.layers.unshift(addedLayer);
                        addedLayer.objects = unlayeredIds;
                    }
                }
            }
        }
        if (this.layers.length === 0) {
            const defaultLayer: LayerModel = {
                id: 'default_layer', visible: true, lock: false, objects: [], zIndex: 0,
                objectZIndex: -1, zIndexTable: {}
            } as Layer;
            this.commandHandler.addLayer(defaultLayer, null, true);
        }
        this.setActiveLayer(this.layers[this.layers.length - 1].id);
    }
    /**
     * resetTool method \
     *
     * @returns { void }     resetTool method .\
     *
     * @private
     */
    public resetTool(): void {
        this.eventHandler.resetTool();
    }

    private initObjectExtend(obj: IElement, layer?: LayerModel, independentObj?: boolean): void {
        if (independentObj) {
            const checkBoundaryConstraints: boolean = this.commandHandler.checkBoundaryConstraints(
                undefined, undefined, obj.wrapper.bounds, true);
            //EJ2-71853 - Need to improve performance of diagram while rendering large number of nodes and connectors.
            // Removed the for loop which is iterating through the zindex table and removing the object from the table as it is not covered in any scenario.
            //EJ2-840575 - Order commands not working between Swimlane and other nodes while drag and drop from the palette
            if ((obj as NodeModel).shape.type === 'SwimLane') {
                for (let i: number = 0, a: string[] = Object.keys((layer as Layer).zIndexTable); i < a.length; i++) {
                    if ((layer as Layer).zIndexTable[a[parseInt(i.toString(), 10)]] &&
                        (layer as Layer).zIndexTable[a[parseInt(i.toString(), 10)]] === (obj as NodeModel).id) {
                        delete (layer as Layer).zIndexTable[a[parseInt(i.toString(), 10)]];
                    }
                }
            }
            (layer as Layer).zIndexTable[(obj as Node).zIndex] = (obj as Node).id;
            if (!checkBoundaryConstraints) {
                const node: (NodeModel | ConnectorModel)[] = obj instanceof Node ? this.nodes : this.connectors;
                for (let i: number = 0; i <= node.length; i++) {
                    if (node[parseInt(i.toString(), 10)] && (obj as NodeModel).id
                        === node[parseInt(i.toString(), 10)].id) { node.splice(i, 1); }
                }
                delete (layer as Layer).zIndexTable[(obj as Node).zIndex];
            }
        }
    }

    /* tslint:disable */
    /**
     * initObject method \
     *
     * @returns { void }     initObject method .\
     * @param {End} obj - provide the obj value.
     * @param {End} layer - provide the layer value.
     * @param {LayoutOrientation} independentObj - provide the independentObj value.
     * @param {boolean} group - provide the independentObj value.
     *
     * @private
     */
    public initObject(obj: IElement, layer?: LayerModel, independentObj: boolean = true, group?: boolean): void {
        if (obj !== undefined) {
            if (independentObj) {
                if (!layer) { this.addToLayer(obj, false); layer = this.activeLayer; }
                //Move the common properties like zindex and id to an abstract class
                if ((obj instanceof Node || obj instanceof Connector) &&
                    (obj.shape.type !== 'SwimLane' || ((obj as Node).children && (obj as Node).children.length > 0))) {
                    this.setZIndex(layer, obj);
                }
            }
            if (obj instanceof Node) {
                if (independentObj) {
                    // 939249: Duplicate Ports Added to Group After Grouping and Undoing.
                    if (obj.id !== 'helper' && !(this.diagramActions & DiagramAction.UndoRedo)) {
                        const getDefaults: Function = getFunction(this.getNodeDefaults);
                        if (getDefaults) {
                            const defaults: NodeModel = getDefaults(obj, this);
                            if (defaults && defaults.ports) {
                                for (let i: number = 0; i < defaults.ports.length; i++) {
                                    defaults.ports[parseInt(i.toString(), 10)].inEdges = [];
                                    defaults.ports[parseInt(i.toString(), 10)].outEdges = [];
                                }
                            }
                            if (defaults && defaults !== obj) { extendObject(defaults, obj); }
                        }
                    }
                    this.initNode(obj, this.element.id);
                }
            } else if (obj instanceof Connector) {
                const getDefaults: Function = getFunction(this.getConnectorDefaults);
                if (getDefaults) {
                    const defaults: ConnectorModel = getDefaults(obj, this);
                    if (defaults && defaults !== obj) { extendObject(defaults, obj); }
                    if (obj.segments.length) {
                        if (obj.type !== obj.segments[0].type) { obj.segments = []; }
                    }
                }
                const sourceNode: NodeModel = this.nameTable[obj.sourceID]; const targetNode: NodeModel = this.nameTable[obj.targetID];
                const port: PointPortModel = this.getConnectedPort(sourceNode, obj, true);
                const targetPort: PointPortModel = this.getConnectedPort(targetNode, obj);
                const outPort: PointPortModel = this.findInOutConnectPorts(sourceNode, false);
                const inPort: PointPortModel = this.findInOutConnectPorts(targetNode, true);
                if ((sourceNode !== undefined && canOutConnect(sourceNode)) || ((obj as Connector).sourcePortID !== ''
                    && canPortOutConnect(outPort))) {
                    (obj as Connector).sourceWrapper = this.getEndNodeWrapper(sourceNode, (obj as Connector), true);
                    if ((obj as Connector).sourcePortID) {
                        // eslint-disable-next-line max-len
                        if (port && port.constraints && !(port.constraints & PortConstraints.None) && (port.constraints & PortConstraints.OutConnect)) {
                            ((obj as Connector) as Connector).sourcePortWrapper = this.getWrapper(
                                sourceNode.wrapper, (obj as Connector).sourcePortID);
                        }
                    }
                }
                if ((targetNode !== undefined && canInConnect(targetNode)) || ((obj as Connector).targetPortID !== ''
                    && canPortInConnect(inPort))) {
                    (obj as Connector).targetWrapper = this.getEndNodeWrapper(targetNode, (obj as Connector), false);
                    if ((obj as Connector).targetPortID) {
                        // eslint-disable-next-line max-len
                        if (targetPort && targetPort.constraints && !(targetPort.constraints & PortConstraints.None) && (targetPort.constraints & PortConstraints.InConnect)) {
                            (obj as Connector).targetPortWrapper = this.getWrapper(
                                targetNode.wrapper, (obj as Connector).targetPortID);
                        }
                    }
                }
                if (!independentObj) {
                    const points: PointModel[] = (obj as Connector).getConnectorPoints((obj as Connector).type);
                    updateConnector(obj as Connector, points);
                }
                if (independentObj) { (obj as Connector).init(this); }
                for (let k: number = 0; k < (obj as Connector).wrapper.children.length; k++) {
                    if (this.pathTable[((obj as Connector).wrapper.children[parseInt(k.toString(), 10)] as PathElement).data]) {
                        ((obj as Connector).wrapper.children[parseInt(k.toString(), 10)] as PathElement).absoluteBounds =
                            this.pathTable[((obj as Connector).wrapper.children[parseInt(
                                k.toString(), 10)] as PathElement).data].absoluteBounds;
                    }
                }
                (obj as Connector).wrapper.measure(new Size(undefined, undefined));
                (obj as Connector).wrapper.arrange((obj as Connector).wrapper.desiredSize);
                if (obj instanceof Connector && obj.type === 'Bezier') { this.updateConnectorAnnotation(obj); this.updateConnectorfixedUserHandles(obj); }
                for (let j: number = 0; j < (obj as Connector).wrapper.children.length; j++) {
                    this.pathTable[((obj as Connector).wrapper.children[parseInt(j.toString(), 10)] as PathElement).data] = {};
                    this.pathTable[((obj as Connector).wrapper.children[parseInt(j.toString(), 10)] as PathElement).data].absoluteBounds =
                        ((obj as Connector).wrapper.children[parseInt(j.toString(), 10)] as PathElement).absoluteBounds;
                }
            }
            if (obj instanceof Node && obj.children && obj.container) {
                for (let i: number = 0; i < obj.children.length; i++) {
                    this.nameTable[obj.children[parseInt(i.toString(), 10)]].offsetX
                        = this.nameTable[obj.children[parseInt(i.toString(), 10)]].wrapper.offsetX;
                    this.nameTable[obj.children[parseInt(i.toString(), 10)]].offsetY
                        = this.nameTable[obj.children[parseInt(i.toString(), 10)]].wrapper.offsetY;
                }
            }
            // 908606: The nodes goes outside the subprocess while node rotation  Issue Fix
            if (obj instanceof Node && obj.shape &&
                (obj.shape as BpmnShape).shape === 'Activity' && (obj.shape as BpmnShape).activity.activity === 'SubProcess') {
                if ((obj.shape as BpmnShape).activity.subProcess.processes) {
                    const children: any = (obj.shape as BpmnShape).activity.subProcess.processes;
                    for (let i: number = 0; i < children.length; i++) {
                        if (this.nameTable[children[parseInt(i.toString(), 10)]]) {
                            this.nameTable[children[parseInt(i.toString(), 10)]].offsetX
                            = this.nameTable[children[parseInt(i.toString(), 10)]].wrapper.offsetX;
                            this.nameTable[children[parseInt(i.toString(), 10)]].offsetY
                            = this.nameTable[children[parseInt(i.toString(), 10)]].wrapper.offsetY;
                            // 953053: Selector not updated properly for BPMN Subprocess after Save and Load
                            this.updateQuad(this.nameTable[children[parseInt(i.toString(), 10)]]);
                        }
                    }
                }
            }
            this.initObjectExtend(obj as IElement, layer, independentObj);
            this.nameTable[(obj as Node).id] = obj;
            if (!this.refreshing) {
                //To create text annotation node if we define shape annotations in parent node.
                if (((obj as Node).shape as BpmnShape).annotations && ((obj as Node).shape as BpmnShape).annotations.length > 0) {
                    for (let i: number = 0; i < ((obj as Node).shape as BpmnShape).annotations.length
                        && ((obj as Node).shape as BpmnShape).annotations[parseInt(i.toString(), 10)].text; i++) {
                        this.getBPMNTextAnnotation(
                            (obj as Node), this, ((obj as Node).shape as BpmnShape).annotations[parseInt(i.toString(), 10)], false);
                    }
                }
            }
            if (obj instanceof Node && obj.children) {
                this.preventNodesUpdate = true; this.preventConnectorsUpdate = true;
                if (!group && !obj.container) { this.updateGroupOffset(obj, true); }
                this.groupTable[(obj as Node).id] = obj.children;
                for (let i: number = 0; i < (obj as Node).children.length; i++) {
                    const node: Node | Connector = (this.nameTable[obj.children[parseInt(i.toString(), 10)]]);
                    if (node) { node.parentId = obj.id; }
                }
                // 941671: Undo not functioning correctly after Group, Rotate, and Ungroup Actions in Diagram
                if (!this.isLoading && obj.rotateAngle && !obj.container && !this.isUndo) {
                    this.commandHandler.rotateObjects(obj, [obj], obj.rotateAngle, { x: obj.offsetX, y: obj.offsetY }, false);
                }
                this.preventNodesUpdate = false; this.preventConnectorsUpdate = false;
            }
            if (this['enterObject'] === undefined) {
                this.updateQuad(obj as IElement);
            }
        }
        if ((obj as Node | Connector).visible === false) {
            this.updateElementVisibility((obj as IElement).wrapper, (obj as Node | Connector), false);
        }
    }
    /* tslint:enable */

    private getConnectedPort(node: NodeModel, connector: ConnectorModel, isSource?: boolean): PointPortModel {
        if (node && node.ports) {
            for (const port of node.ports) {
                if (port.id === connector.sourcePortID && isSource) {
                    return port;
                } else if (port.id === connector.targetPortID && !isSource) {
                    return port;
                }
            }
        }
        return null;
    }

    private scaleObject(obj: NodeModel, size: number, isWidth: boolean): void {
        const actualSize: number = isWidth ? obj.wrapper.actualSize.width : obj.wrapper.actualSize.height;
        const sw: number = (isWidth) ? 1 + ((size - actualSize) / actualSize) : 1;
        const sh: number = (isWidth) ? 1 : 1 + ((size - actualSize) / actualSize);

        //const groupOffsetX: number = obj.offsetX; const groupOffsetY: number = obj.offsetY;
        this.realActions |= RealAction.PreventDrag;
        this.scale(obj, sw, sh, { x: 0.5, y: 0.5 });
        this.realActions &= ~RealAction.PreventDrag;
    }

    private updateDefaultLayoutIcons(node: NodeModel): void {
        if (this.layout.type === 'OrganizationalChart' || this.layout.type === 'HierarchicalTree' ||
            this.layout.type === 'ComplexHierarchicalTree') {
            {
                this.updateDefaultLayoutIcon(node, node.expandIcon);
                this.updateDefaultLayoutIcon(node, node.collapseIcon);
            }
        }
    }
    private updateDefaultLayoutIcon(node: NodeModel, icon: IconShapeModel): void {
        if (icon.shape !== 'None') {
            if (icon.horizontalAlignment === 'Auto' && icon.verticalAlignment === 'Auto' &&
                icon.offset.x === .5 && icon.offset.y === 1) {
                const iconWrapper: DiagramElement = this.getWrapper(node.wrapper, 'icon_content');
                let offsetX: number;
                let offsetY: number;
                if (this.layout.orientation === 'TopToBottom' || this.layout.orientation === 'BottomToTop') {
                    offsetX = .5;
                    offsetY = this.layout.orientation === 'TopToBottom' ? 1 : 0;
                } else if (this.layout.orientation === 'RightToLeft' || this.layout.orientation === 'LeftToRight') {
                    offsetX = this.layout.orientation === 'LeftToRight' ? 1 : 0;
                    offsetY = .5;
                }
                iconWrapper.setOffsetWithRespectToBounds(offsetX, offsetY, 'Fraction');
                iconWrapper.horizontalAlignment = 'Center';
                iconWrapper.verticalAlignment = 'Center';
                node.wrapper.measure(new Size(node.wrapper.width, node.wrapper.height));
                node.wrapper.arrange(node.wrapper.desiredSize);
            }
        }
    }


    /**
     * updateGroupOffset method \
     *
     * @returns { void }     updateGroupOffset method .\
     * @param {NodeModel | ConnectorModel} node - provide the source value.
     * @param {boolean} isUpdateSize - provide the target value.
     *
     * @private
     */
    public updateGroupOffset(node: NodeModel | ConnectorModel, isUpdateSize?: boolean): void {
        const isUpdateGroupToBlazor: boolean = false;
        if (((node as Node).children && (node as Node).children.length > 0 && (!(node as Node).container)) || ((node as Node).processId)
            || ((node as Node).parentId && this.nameTable[(node as Node).parentId]
            && this.nameTable[(node as Node).parentId].shape.type === 'Container')){
            const node1: NodeModel = this.nameTable[node.id];
            if (!(this.realActions & RealAction.PreventScale) && !(this.realActions & RealAction.PreventDrag)) {
                if (node1.offsetX && ((this.realActions & RealAction.EnableGroupAction) ||
                    ((!(this.diagramActions & DiagramAction.UndoRedo)) && (!(this.diagramActions & DiagramAction.ToolAction)
                        && !(this.diagramActions & DiagramAction.PublicMethod) && !((node as Node).processId))))) {
                    this.realActions |= RealAction.PreventScale;
                    const diffX: number = (node1.offsetX - node.wrapper.offsetX);
                    node1.offsetX = node.wrapper.offsetX;
                    const diffY: number = (node1.offsetY - node.wrapper.offsetY);
                    node1.offsetY = node.wrapper.offsetY;
                    if ((diffX + diffY) !== 0) {
                        this.drag(node1, diffX, diffY);
                    }
                    this.realActions &= ~RealAction.PreventScale;
                } else {
                    //Removed isBlazor code
                    node1.offsetX = node.wrapper.offsetX;
                }
                if (node1.offsetY && ((this.realActions & RealAction.EnableGroupAction) ||
                    ((!(this.diagramActions & DiagramAction.UndoRedo)) && (!(this.diagramActions & DiagramAction.ToolAction)
                        && !(this.diagramActions & DiagramAction.PublicMethod) && !((node as Node).processId))))) {
                    this.realActions |= RealAction.PreventScale;
                    const diffY: number = (node1.offsetY - node.wrapper.offsetY);
                    node1.offsetY = node.wrapper.offsetY;
                    this.drag(node1, 0, diffY);
                    this.realActions &= ~RealAction.PreventScale;

                } else {
                    //Removed isBlazor code
                    node1.offsetY = node.wrapper.offsetY;
                }
                if (this.diagramActions) {
                    //Removed isBlazor code
                    node1.width = node.wrapper.actualSize.width;
                    node1.height = node.wrapper.actualSize.height;
                }
            }
        }
        if ((node) && node.annotations && node.annotations.length > 0) {
            node.wrapper.children.forEach(function (wrapperChild: any): any {
                if (wrapperChild instanceof Canvas) {
                    wrapperChild.children.forEach(function (child: any): any {
                        if (child && child instanceof TextElement) {
                            child.refreshTextElement();
                        }
                    });
                }
            });
            node.wrapper.measure(new Size((node as Node).width, (node as Node).height), node.id, this.onLoadImageSize.bind(this));
            node.wrapper.arrange(node.wrapper.desiredSize);
        }
        if (isUpdateSize) {
            if (((node as Node).children && (node as Node).children.length > 0)) {
                if (this.nameTable[(node as Node).id].width !== undefined) {
                    this.scaleObject((node as Node), this.nameTable[node.id].width, true);
                } else {
                    //Removed isBlazor code
                    this.nameTable[node.id].width = node.wrapper.actualSize.width;
                }
                if (this.nameTable[node.id].height !== undefined) {
                    this.scaleObject((node as Node), this.nameTable[node.id].height, false);
                } else {
                    //Removed isBlazor code
                    this.nameTable[node.id].height = node.wrapper.actualSize.height;
                }
            }
        }
        //Removed Blazor code
    }

    /* eslint-disable */
    private initNode(obj: Node, diagramId: string, group?: boolean): void {
        const canvas: GroupableView = obj.initContainer(); const portContainer: Canvas = new Canvas(); let content: DiagramElement;
        if (!this.diagramSettings.inversedAlignment) {
            canvas.inversedAlignment = false;
        }
        if (!canvas.children) { canvas.children = []; }
        if (obj.children) {
            canvas.measureChildren = false;
            portContainer.id = obj.id + 'group_container';
            // Bug 853721: Grid lines remain hidden when lane fill is set to transparent.
            // Added below code to set swimlane fill while dragging from palette to diagram.
            if (obj.shape && obj.shape.type === 'SwimLane') {
                portContainer.style.fill = obj.style.fill;
            } else {
                portContainer.style.fill = 'none';
            }
            portContainer.style.strokeColor = 'none';
            portContainer.horizontalAlignment = 'Stretch';
            portContainer.verticalAlignment = 'Stretch';
            //EJ2-865476 - Issue with Pivot Point in group node during resizing
            portContainer.pivot = obj.pivot;
            canvas.style = obj.style;
            //958066 - corner radius is not applied for group on initial rendering
            if (obj.shape && obj.shape.type === 'Basic') {
                canvas.cornerRadius = (obj.shape as BasicShapeModel).cornerRadius;
            }
            canvas.padding.left = obj.padding.left; canvas.padding.right = obj.padding.right; canvas.padding.top = obj.padding.top; canvas.padding.bottom = obj.padding.bottom;
            portContainer.children = []; portContainer.preventContainer = true;
            if (obj.container) { portContainer.relativeMode = 'Object'; }
            if (obj.container && (obj.container.type === 'Grid')) {
                for (let i: number = 0; i < obj.children.length; i++) {
                    const childCollection: Canvas = new Canvas();
                    const child: NodeModel = this.nameTable[obj.children[i]];
                    childCollection.children = []; childCollection.children.push(child.wrapper);
                    if (child) {
                        (canvas as GridPanel).addObject(child.wrapper, child.rowIndex, child.columnIndex, child.rowSpan, child.columnSpan);
                    }
                }
            } else {
                for (let i: number = 0; i < obj.children.length; i++) {
                    if (this.nameTable[obj.children[i]]) {
                        const child: Node = this.nameTable[obj.children[i]];
                        this.updateStackProperty(obj, child, i); canvas.children.push(child.wrapper);
                        canvas.elementActions = canvas.elementActions | ElementAction.ElementIsGroup;
                        child.wrapper.flip = child.wrapper.flip ^=
                            obj.wrapper.flip;
                    }
                }
            }
            if (isNullOrUndefined(obj.container) ||
                (obj.container && (obj.container.type !== 'Grid'))) {
                canvas.children.push(portContainer);
            }
        } else {
            const setNodeTemplate: Function = getFunction(this.setNodeTemplate);
            if (setNodeTemplate && obj.id !== 'helper') { content = setNodeTemplate(obj, this); }
            if (!content) { content = obj.init(this); }
            canvas.children.push(content);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let wrapperContent: any; wrapperContent = getFunction(this.getDescription);
        if (wrapperContent) {
            (obj.children ? canvas : content).description = wrapperContent;
        } else {
            (obj.children ? canvas : content).description = obj.annotations.length ? obj.annotations[0].content : obj.id;
        }
        const container: GroupableView = obj.children ? portContainer : canvas;
        obj.initAnnotations(this.getDescription, container, this.element.id, canVitualize(this) ? true : false, this.annotationTemplate);
        obj.initPorts(this.getDescription, container);
        obj.initIcons(this.getDescription, this.layout, container, diagramId);
        for (let i: number = 0; obj.fixedUserHandles !== undefined, i < obj.fixedUserHandles.length; i++) {
            const fixedUserHandles: DiagramElement = obj.initFixedUserHandles(obj.fixedUserHandles[i], this.fixedUserHandleTemplate, this.element.id);
            container.children.push(fixedUserHandles);
        }
        if (obj.shape.type === 'SwimLane' && obj.wrapper && obj.wrapper.children.length > 0 &&
            obj.wrapper.children[0] instanceof GridPanel) {
            this.setZIndex(this.activeLayer, obj);
            swimLaneMeasureAndArrange(obj);
            arrangeChildNodesInSwimLane(this, obj);
            this.updateLaneAfterAddChild (obj);
            this.updateDiagramElementQuad();
        } else {
            canvas.measure(new Size(obj.width, obj.height), obj.id, this.onLoadImageSize.bind(this));
            if (canvas instanceof GridPanel) {
                canvas.arrange(canvas.desiredSize, true);
            } else { canvas.arrange(canvas.desiredSize); }
        }
        if (obj.shape.type === 'Container') {
            this.updateDiagramElementQuad();
        }
        if (obj.wrapper.flip !== FlipDirection.None && this.isNotContainerOrSubProcess(obj)) {
            if (obj.children && obj.children.length > 0) {
                let hasConnector: boolean = false;
                for (let i: number = 0; i < obj.children.length; i++) {
                    let node: NodeModel = this.nameTable[obj.children[i]];
                    if (node instanceof Connector || obj.rotateAngle !== 0) {
                        hasConnector = true;
                        if (this.connectorOrRotatedGroups.indexOf(obj) == -1) {
                            this.connectorOrRotatedGroups.push(obj);
                        }
                    }
                    if (node) {
                        if (!this.refreshing && !this.commandHandler.cloningInProgress && !(this.diagramActions & DiagramAction.UndoRedo)) {
                            node.flip ^= obj.flip;
                            node.flipMode = obj.flipMode;
                        }
                        if (node.flipMode !== 'None' && node.flipMode !== 'Label' && node.flipMode !== 'LabelText' && node.flipMode !== 'LabelAndLabelText') {
                            this.updatePorts(node as Node, node.flip);
                        } else {
                            this.updatePorts(node as Node, FlipDirection.None);
                        }
                        this.applyWrapperFlip(node);
                        node.wrapper.measure(new Size(node.wrapper.bounds.width, node.wrapper.bounds.height), node.id, this.onLoadImageSize.bind(this));
                        node.wrapper.arrange(node.wrapper.desiredSize);
                    }
                }
                let groupWrapperCanvas: any = obj.wrapper.children[obj.wrapper.children.length-1];
                groupWrapperCanvas.flip = obj.wrapper.flip;
                groupWrapperCanvas.flipMode = obj.wrapper.flipMode;
                for(let j: number = 0; j < groupWrapperCanvas.children.length; j++){
                    var wrapperChild = groupWrapperCanvas.children[j];
                    if (wrapperChild instanceof TextElement) {
                        if (obj.flipMode !== 'Port' && obj.flipMode !== 'None') {
                            wrapperChild.flip = obj.wrapper.flip;
                            wrapperChild.flipMode = obj.wrapper.flipMode;
                        }
                    }
                }
                if (!hasConnector && !this.refreshing && !this.commandHandler.cloningInProgress && !(this.diagramActions & DiagramAction.UndoRedo)) {
                    alignElement(obj.wrapper, obj.wrapper.offsetX, obj.wrapper.offsetY, this, obj.wrapper.flip, undefined, undefined, true);
                }
            } else {
                //To apply flip and flip mode for the text elements of node.
                this.applyWrapperFlip(obj);
            }
        }
        if (obj.shape.type === 'Bpmn') {
            if ((obj.shape as BpmnShape).shape === 'TextAnnotation') {
                let isbpmnTextConnector: boolean = false;
                for (let i: number = 0; i < this.connectors.length; i++) {
                    if (this.connectors[parseInt(i.toString(), 10)].id === (obj.id + "_connector")) {
                        (this.connectors[parseInt(i.toString(), 10)] as any).isBpmnAnnotationConnector = true;
                        isbpmnTextConnector = true;
                        break;
                    }
                }
                if (!isbpmnTextConnector) {
                    this.addBpmnAnnotationConnector(obj, canvas);
                }
            }
        }
        if (obj instanceof Node && obj.container && (obj.width < canvas.outerBounds.width || obj.height < canvas.outerBounds.height) &&
            canvas.bounds.x <= canvas.outerBounds.x && canvas.bounds.y <= canvas.outerBounds.y) {
            obj.width = canvas.width = canvas.outerBounds.width; obj.height = canvas.height = canvas.outerBounds.height;
            canvas.measure(new Size(obj.width, obj.height)); canvas.arrange(canvas.desiredSize);
        }
        if (obj.container && obj.container.type === 'Grid' && obj.children && obj.children.length > 0) {
            this.updateChildPosition(obj);
        }
    }
    private isNotContainerOrSubProcess(obj: NodeModel): boolean {
        return (obj.shape.type !== 'Container' && !(obj.shape.type === 'Bpmn'
        && (obj.shape as BpmnShape).shape === 'Activity'
        && (obj.shape as BpmnShape).activity.activity === 'SubProcess' && (obj.shape as BpmnShape).activity.subProcess.collapsed === false))
    }
    private isNotSwimlaneObject(node: NodeModel): boolean {
        return (node.shape.type !== 'SwimLane' && !(node as Node).isLane && !(node as Node).isPhase && !(node as Node).isHeader);
    }
    private updateLaneAfterAddChild(swimlane: NodeModel) {
        for (let i: number = 0; i < this.nodes.length; i++) {
            const node: NodeModel = this.nodes[parseInt(i.toString(), 10)];
            if ((node as Node).parentId === swimlane.id && !(swimlane.shape as SwimLane).hasHeader) {
                node.width = node.wrapper.width;
                node.height = node.wrapper.height;
            }
        }
    }
    private applyWrapperFlip(obj: NodeModel) {
        if (obj instanceof Node) {
            obj.wrapper.flip = obj.flip;
            obj.wrapper.flipMode = obj.flipMode;
            obj.wrapper.children[0].flip = obj.flip;
            obj.wrapper.children[0].flipMode = obj.flipMode;
            for (let i=0;i<obj.wrapper.children.length;i++) {
                let wrapperChild = obj.wrapper.children[i];
                if(wrapperChild instanceof Canvas) {
                    //To update the flip and flipmode for the node wrapper childs.
                    this.applyWrapperCanvasFlip(wrapperChild,obj);
                }
                else {
                    wrapperChild.flip = obj.flip;
                    wrapperChild.flipMode = obj.flipMode;
                }
            }
        }
    }
    private applyWrapperCanvasFlip(wrapper: Canvas, obj: NodeModel){
        for (let i: number = 0; i < wrapper.children.length; i++) {
            var wrapperChild = wrapper.children[parseInt(i.toString(), 10)];
            if(wrapperChild instanceof Canvas) {
                this.applyWrapperCanvasFlip(wrapperChild,obj);
            }
            else if (obj.flipMode !== 'None') {
                wrapperChild.flip = obj.flip;
                wrapperChild.flipMode = obj.flipMode;
            }
        }
    }
    private addBpmnAnnotationConnector(node: NodeModel, wrapper: GroupableView) {
        if ((node as any).parentObj instanceof Diagram || (node as any).parentObj instanceof Lane) {
            let bpmnAnnotation: BpmnShape = (node.shape as BpmnShape);
            let direction: TextAnnotationDirection = bpmnAnnotation.textAnnotation.textAnnotationDirection;
            let hasTarget: boolean = (bpmnAnnotation.textAnnotation.textAnnotationTarget !== '' && this.nameTable[bpmnAnnotation.textAnnotation.textAnnotationTarget]);
            let targetNode: Node = hasTarget ? this.nameTable[bpmnAnnotation.textAnnotation.textAnnotationTarget] : null;
            let targetWrapper: DiagramElement = targetNode != null ? targetNode.wrapper : null;
            let port = node.ports[0];
            let sourcePoint: PointModel = { x: 0, y: 0 };

            switch (direction) {
                case 'Left':
                    port.offset = { x: 0, y: 0.5 };
                    sourcePoint.x = wrapper.bounds.left - 40;
                    sourcePoint.y = wrapper.bounds.bottom + 30;
                    break;
                case 'Right':
                    port.offset = { x: 1, y: 0.5 };
                    sourcePoint.x = wrapper.bounds.right + 40;
                    sourcePoint.y = wrapper.bounds.bottom + 30;
                    break;
                case 'Top':
                    port.offset = { x: 0.5, y: 0 };
                    sourcePoint.x = wrapper.bounds.right + 30;
                    sourcePoint.y = wrapper.bounds.top - 40;
                    break;
                case 'Bottom':
                    port.offset = { x: 0.5, y: 1 };
                    sourcePoint.x = wrapper.bounds.right + 30;
                    sourcePoint.y = wrapper.bounds.bottom + 40;

                    break;
                default:
                    port.offset = { x: 0, y: 0.5 };
                    sourcePoint.x = wrapper.bounds.left - 40;
                    sourcePoint.y = wrapper.bounds.bottom + 30;
                    if (hasTarget && wrapper != null && targetWrapper != null) {
                        if (wrapper.bounds.left > targetWrapper.bounds.right) {
                            port.offset = { x: 0, y: 0.5 };
                        }
                        else if (wrapper.bounds.right < targetWrapper.bounds.left) {
                            port.offset = { x: 1, y: 0.5 };
                        }
                        else if (wrapper.bounds.bottom > targetWrapper.bounds.top) {
                            port.offset = { x: 0.5, y: 0 };
                        }
                        else if (wrapper.bounds.top < targetWrapper.bounds.bottom) {
                            port.offset = { x: 0.5, y: 1 };
                        }
                    }
                    break;
            }
            let connector: Connector = new Connector(this, 'connectors', {
                id: node.id + "_connector",
                targetID: node.id,
                targetPortID: port.id,
                type: 'Straight',
                shape: {
                    type: "Bpmn", flow: 'Association'
                },
                constraints: ConnectorConstraints.Default & ~(ConnectorConstraints.DragTargetEnd | ConnectorConstraints.Delete),
                isBpmnAnnotationConnector: true,
            }, true)
                ;
            if (hasTarget) {
                connector.sourceID = bpmnAnnotation.textAnnotation.textAnnotationTarget;
            }
            else {
                connector.sourcePoint = sourcePoint;
            }
            const oldProtectOnChange: boolean = this.isProtectedOnChange;
            this.isProtectedOnChange = true;
            node.constraints |= NodeConstraints.InConnect;
            this.connectors.push(connector);
            if (!(this.bpmnModule).bpmnTextAnnotationConnector) {
                (this.bpmnModule).bpmnTextAnnotationConnector = [];
            }
            (this.bpmnModule).bpmnTextAnnotationConnector.push(connector);
            let shadowSet: boolean = (node.constraints & NodeConstraints.Shadow) !== 0;
            let allowMovingSet: boolean = (node.constraints & NodeConstraints.AllowMovingOutsideLane) !== 0;
            node.constraints = NodeConstraints.Default & ~(NodeConstraints.OutConnect | NodeConstraints.InConnect);
            if (shadowSet) {
                node.constraints |= NodeConstraints.Shadow;
            }
            if (allowMovingSet) {
                node.constraints |= NodeConstraints.AllowMovingOutsideLane;
            }
            this.isProtectedOnChange = oldProtectOnChange;
        }
    }

    /** @private */
    private getBPMNTextAnnotation(
        node: Node, diagram: Diagram, annotation: BpmnAnnotationModel, isDynamic: boolean) {

        // create new text annotation node
        let obj: NodeModel = {
            id: annotation.id || randomId(),
            height: annotation.height || 100,
            width: annotation.width || 100,
            annotations: [{ id: (annotation.id ? annotation.id : randomId()) + annotation.text, content: annotation.text }],
            offsetX: node.offsetX + annotation.length *
                Math.cos(annotation.angle * (Math.PI / 180)),
            offsetY: node.offsetY + annotation.length *
                Math.sin(annotation.angle * (Math.PI / 180)),
            shape: { type: 'Bpmn', shape: 'TextAnnotation', textAnnotation: { textAnnotationDirection: 'Auto', textAnnotationTarget: node.id } },
            constraints: NodeConstraints.Default & ~(NodeConstraints.OutConnect | NodeConstraints.InConnect)
        }
        const parentBounds = node.wrapper.bounds;
        const position = { x: obj.offsetX, y: obj.offsetY }
        const direction: string = getPortDirection(position, parentBounds, parentBounds, false);
        let segment: Segment;
        switch (direction) {
            case 'Right':
                segment = {
                    x1: parentBounds.right, y1: parentBounds.top,
                    x2: parentBounds.right, y2: parentBounds.bottom
                };
                break;
            case 'Left':
                segment = {
                    x1: parentBounds.left, y1: parentBounds.top,
                    x2: parentBounds.left, y2: parentBounds.bottom
                };
                break;
            case 'Bottom':
                segment = {
                    x1: parentBounds.right, y1: parentBounds.bottom,
                    x2: parentBounds.left, y2: parentBounds.bottom
                };
                break;
            case 'Top':
                segment = {
                    x1: parentBounds.right, y1: parentBounds.top,
                    x2: parentBounds.left, y2: parentBounds.top
                };
                break;
        }
        const center = parentBounds.center;
        const endPoint = Point.transform(position, annotation.angle, Math.max(parentBounds.width, parentBounds.height));
        let point = getIntersectionPoints(segment, [center, endPoint], false, center);
        if (annotation.length !== undefined && annotation.angle !== undefined && point) {
            point = Point.transform(point, annotation.angle, annotation.length);
            obj.offsetX = point.x;
            obj.offsetY = point.y;
        }
        if (direction === 'Right') {
            obj.offsetX += obj.width / 2;
        } else if (direction === 'Left') {
            obj.offsetX -= obj.width / 2;
        } else if (direction === 'Bottom') {
            obj.offsetY += obj.height / 2;
        } else {
            obj.offsetY -= obj.height / 2;
        }
        if (isDynamic) {
            this.add(obj);
        } else {
            let bpmnTextNode = new Node(this, 'nodes', obj, true);
            diagram.initObject(bpmnTextNode as IElement, undefined, undefined, true);
            diagram.nodes.push(bpmnTextNode);
        }

    }
    /* eslint-enable */
    /**
     * updateDiagramElementQuad method \
     *
     * @returns { void }     updateDiagramElementQuad method .\
     *
     * @private
     */
    public updateDiagramElementQuad(): void {
        for (let i: number = 0; i < this.nodes.length; i++) {
            if (this.nodes[parseInt(i.toString(), 10)].wrapper
            && (this.nodes[parseInt(i.toString(), 10)].wrapper instanceof GroupableView)) {
                this.updateQuad(this.nodes[parseInt(i.toString(), 10)] as IElement);
            }
        }
    }

    private onLoadImageSize(id: string, size: Size): void {
        const obj: NodeModel = this.getObject(id);
        const image: HTMLElement = document.getElementById(id + 'sf-imageNode');
        if (image) {
            image.parentNode.removeChild(image);
        }
        this.nodePropertyChange(obj as Node, {} as Node, { width: size.width, height: size.height } as Node);
        const args: IImageLoadEventArgs = { element: cloneObject(obj), size: size };
        this.triggerEvent(DiagramEvent.onImageLoad, args);
    }

    private updateChildPosition(obj: NodeModel): void {
        for (let i: number = 0; i < obj.children.length; i++) {
            const child: NodeModel = this.getObject(obj.children[parseInt(i.toString(), 10)]);
            child.offsetX = child.wrapper.offsetX;
            child.offsetY = child.wrapper.offsetY;
            if (child.children && child.children.length > 0) {
                this.updateChildPosition(child);
            }
        }
    }

    private canExecute(): boolean {
        return true;
    }

    private updateStackProperty(obj: Node, child: Node, index?: number): void {
        if (obj.container && obj.container.type === 'Stack') {
            if (!child.width) {
                child.wrapper.horizontalAlignment = 'Stretch';
                child.horizontalAlignment = 'Stretch';
            }
            if (!child.height) {
                child.verticalAlignment = 'Stretch';
                child.wrapper.verticalAlignment = 'Stretch';
            }
            if (index && (obj as Node).shape.type === 'UmlClassifier') {
                child.umlIndex = index;
            }

        }
    }
    private initViews(): void {
        if (!this.isLoading) {
            this.views.push(this.element.id);
            this.views[this.element.id] = this;
        }
    }

    private initCommands(): void {

        let i: string;
        const newCommands: CommandModel[] = this.commandManager.commands;
        const commands: {} = {
            'copy': {
                execute: this.copyCommand.bind(this), canExecute: this.canExecute.bind(this),
                gesture: { key: Keys.C, keyModifiers: KeyModifiers.Control }
            },
            'paste': {
                execute: this.pasteCommand.bind(this), canExecute: this.canExecute.bind(this),
                gesture: { key: Keys.V, keyModifiers: KeyModifiers.Control }
            },
            'cut': {
                execute: this.cutCommand.bind(this), canExecute: this.canExecute.bind(this),
                gesture: { key: Keys.X, keyModifiers: KeyModifiers.Control }
            },
            'delete': {
                execute: this.removeCommand.bind(this), canExecute: this.canExecute.bind(this),
                gesture: { key: Keys.Delete }
            },
            'selectAll': {
                execute: this.selectAll.bind(this), canExecute: this.canExecute.bind(this),
                gesture: { key: Keys.A, keyModifiers: KeyModifiers.Control }
            },
            'undo': {
                execute: this.undo.bind(this), canExecute: this.canExecute.bind(this),
                gesture: { key: Keys.Z, keyModifiers: KeyModifiers.Control }
            },
            'redo': {
                execute: this.redo.bind(this), canExecute: this.canExecute.bind(this),
                gesture: { key: Keys.Y, keyModifiers: KeyModifiers.Control }
            },
            'nudgeUp': {

                execute: this.nudgeCommand.bind(this, 'Up'),
                canExecute: this.canExecute.bind(this), gesture: { key: Keys.Up },
                parameter: 'up'
            },
            'nudgeRight': {
                execute: this.nudgeCommand.bind(this, 'Right'),
                canExecute: this.canExecute.bind(this), gesture: { key: Keys.Right },
                parameter: 'right'
            },
            'nudgeDown': {
                execute: this.nudgeCommand.bind(this, 'Down'),
                canExecute: this.canExecute.bind(this), gesture: { key: Keys.Down },
                parameter: 'down'
            },
            'nudgeLeft': {
                execute: this.nudgeCommand.bind(this, 'Left'),
                canExecute: this.canExecute.bind(this), gesture: { key: Keys.Left },
                parameter: 'left'
            },
            'startEdit': {
                execute: this.startEditCommad.bind(this),
                canExecute: this.canExecute.bind(this), gesture: { key: Keys.F2 }
            },
            'endEdit': {
                execute: this.endEditCommand.bind(this),
                canExecute: this.canExecute.bind(this), gesture: { key: Keys.Escape }
            },
            //EJ2-866418-keyboard shortcut keys
            'focusToNextItem': {
                execute: this.navigateItems.bind(this, true),
                canExecute: this.canExecute.bind(this), gesture: { key: Keys.Tab }
            },
            'focusToPreviousItem': {
                execute: this.navigateItems.bind(this, false), canExecute: this.canExecute.bind(this),
                gesture: { key: Keys.Tab, keyModifiers: KeyModifiers.Shift }
            },
            'selectFocusedItem': {
                execute: this.startEditCommad.bind(this),
                canExecute: this.canExecute.bind(this), gesture: { key: Keys.Enter }
            },
            'bold': {
                execute: this.fontStyleCommand.bind(this, 'bold'), canExecute: this.canExecute.bind(this),
                gesture: { key: Keys.B, keyModifiers: KeyModifiers.Control }
            },
            'italic': {
                execute: this.fontStyleCommand.bind(this, 'italic'), canExecute: this.canExecute.bind(this),
                gesture: { key: Keys.I, keyModifiers: KeyModifiers.Control }
            },
            'underline': {
                execute: this.fontStyleCommand.bind(this, 'underline'), canExecute: this.canExecute.bind(this),
                gesture: { key: Keys.U, keyModifiers: KeyModifiers.Control }
            },
            'duplicate': {
                execute: this.duplicateCommand.bind(this), canExecute: this.canExecute.bind(this),
                gesture: { key: Keys.D, keyModifiers: KeyModifiers.Control }
            },
            'group': {
                execute: this.groupCommand.bind(this, 'group'), canExecute: this.canExecute.bind(this),
                gesture: { key: Keys.G, keyModifiers: KeyModifiers.Control }
            },
            'ungroup': {
                execute: this.groupCommand.bind(this, 'ungroup'), canExecute: this.canExecute.bind(this),
                gesture: { key: Keys.U, keyModifiers: KeyModifiers.Control | KeyModifiers.Shift }
            },
            'rotateClockwise': {
                execute: this.rotateCommand.bind(this, 'clockwise'), canExecute: this.canExecute.bind(this),
                gesture: { key: Keys.R, keyModifiers: KeyModifiers.Control }
            },
            'rotateAntiClockwise': {
                execute: this.rotateCommand.bind(this, 'antiClockwise'), canExecute: this.canExecute.bind(this),
                gesture: { key: Keys.L, keyModifiers: KeyModifiers.Control }
            },
            'flipHorizontal': {
                execute: this.flipCommand.bind(this, 'horizontal'), canExecute: this.canExecute.bind(this),
                gesture: { key: Keys.H, keyModifiers: KeyModifiers.Control }
            },
            'flipVertical': {
                execute: this.flipCommand.bind(this, 'vertical'), canExecute: this.canExecute.bind(this),
                gesture: { key: Keys.J, keyModifiers: KeyModifiers.Control }
            },
            'pointerTool': {
                execute: this.toolCommand.bind(this, 'pointer'), canExecute: this.canExecute.bind(this),
                gesture: { key: Keys.Number1, keyModifiers: KeyModifiers.Control }
            },
            'textTool': {
                execute: this.toolCommand.bind(this, 'text'), canExecute: this.canExecute.bind(this),
                gesture: { key: Keys.Number2, keyModifiers: KeyModifiers.Control }
            },
            'connectTool': {
                execute: this.toolCommand.bind(this, 'connect'), canExecute: this.canExecute.bind(this),
                gesture: { key: Keys.Number3, keyModifiers: KeyModifiers.Control }
            },
            'freeForm': {
                execute: this.toolCommand.bind(this, 'freeForm'), canExecute: this.canExecute.bind(this),
                gesture: { key: Keys.Number5, keyModifiers: KeyModifiers.Control }
            },
            'lineTool': {
                execute: this.toolCommand.bind(this, 'line'), canExecute: this.canExecute.bind(this),
                gesture: { key: Keys.Number6, keyModifiers: KeyModifiers.Control }
            },
            'rectangleTool': {
                execute: this.toolCommand.bind(this, 'rectangle'), canExecute: this.canExecute.bind(this),
                gesture: { key: Keys.Number8, keyModifiers: KeyModifiers.Control }
            },
            'ellipseTool': {
                execute: this.toolCommand.bind(this, 'ellipse'), canExecute: this.canExecute.bind(this),
                gesture: { key: Keys.Number9, keyModifiers: KeyModifiers.Control }
            },
            'zoomIn': {
                execute: this.zoomCommand.bind(this, 'zoomIn'), canExecute: this.canExecute.bind(this),
                gesture: { key: Keys.Plus, keyModifiers: KeyModifiers.Control }
            },
            'zoomOut': {
                execute: this.zoomCommand.bind(this, 'zoomOut'), canExecute: this.canExecute.bind(this),
                gesture: { key: Keys.Minus, keyModifiers: KeyModifiers.Control }
            },
            'shiftUp': {
                execute: this.shiftCommand.bind(this, 'Up'),
                canExecute: this.canExecute.bind(this), gesture: { key: Keys.Up, keyModifiers: KeyModifiers.Shift }
            },
            'shiftDown': {
                execute: this.shiftCommand.bind(this, 'Down'),
                canExecute: this.canExecute.bind(this), gesture: { key: Keys.Down, keyModifiers: KeyModifiers.Shift }
            },
            'shiftLeft': {
                execute: this.shiftCommand.bind(this, 'Left'),
                canExecute: this.canExecute.bind(this), gesture: { key: Keys.Left, keyModifiers: KeyModifiers.Shift }
            },
            'shiftRight': {
                execute: this.shiftCommand.bind(this, 'Right'),
                canExecute: this.canExecute.bind(this), gesture: { key: Keys.Right, keyModifiers: KeyModifiers.Shift }
            },
            'alignTextCenter': {
                execute: this.alignCommand.bind(this, 'center'),
                canExecute: this.canExecute.bind(this), gesture: { key: Keys.C, keyModifiers: KeyModifiers.Control | KeyModifiers.Shift }
            },
            'alignTextLeft': {
                execute: this.alignCommand.bind(this, 'right'),
                canExecute: this.canExecute.bind(this), gesture: { key: Keys.L, keyModifiers: KeyModifiers.Control | KeyModifiers.Shift }
            },
            'alignTextRight': {
                execute: this.alignCommand.bind(this, 'left'),
                canExecute: this.canExecute.bind(this), gesture: { key: Keys.R, keyModifiers: KeyModifiers.Control | KeyModifiers.Shift }
            },
            'alignTextTop': {
                execute: this.alignCommand.bind(this, 'top'),
                canExecute: this.canExecute.bind(this), gesture: { key: Keys.E, keyModifiers: KeyModifiers.Control | KeyModifiers.Shift }
            },
            'alignTextCenterVertical': {
                execute: this.alignCommand.bind(this, 'centerVertical'),
                canExecute: this.canExecute.bind(this), gesture: { key: Keys.M, keyModifiers: KeyModifiers.Control | KeyModifiers.Shift }
            },
            'alignTextBottom': {
                execute: this.alignCommand.bind(this, 'bottom'),
                canExecute: this.canExecute.bind(this), gesture: { key: Keys.V, keyModifiers: KeyModifiers.Control | KeyModifiers.Shift }
            },
            'alignJustify': {
                execute: this.alignCommand.bind(this, 'justify'),
                canExecute: this.canExecute.bind(this), gesture: { key: Keys.J, keyModifiers: KeyModifiers.Control | KeyModifiers.Shift }
            },
            'sendToBack': {
                execute: this.orderCommand.bind(this, 'sendToBack'),
                canExecute: this.canExecute.bind(this), gesture: { key: Keys.B, keyModifiers: KeyModifiers.Control | KeyModifiers.Shift }
            },
            'bringToFront': {
                execute: this.orderCommand.bind(this, 'bringToFront'),
                canExecute: this.canExecute.bind(this), gesture: { key: Keys.F, keyModifiers: KeyModifiers.Control | KeyModifiers.Shift }
            },
            'sendBackward': {
                execute: this.orderCommand.bind(this, 'sendBackward'),
                canExecute: this.canExecute.bind(this), gesture: { key: Keys.BracketLeft, keyModifiers: KeyModifiers.Control }
            },
            'bringForward': {
                execute: this.orderCommand.bind(this, 'bringForward'),
                canExecute: this.canExecute.bind(this), gesture: { key: Keys.BracketRight, keyModifiers: KeyModifiers.Control }
            }
        };
        this.initCommandManager(newCommands, commands);
    }

    private overrideCommands(newCommand: CommandModel, commands: {}): void {
        let command: CommandModel;
        for (const key of Object.keys(commands)) {
            command = commands[`${key}`] as CommandModel;
            if (newCommand.gesture.key === command.gesture.key && newCommand.gesture.keyModifiers === command.gesture.keyModifiers) {
                delete commands[`${key}`];
                break;
            }
        }
    }

    private initCommandManager(newCommands: CommandModel[], commands: {}): void {
        let i: number = 0;
        if (newCommands) {
            for (i = 0; i < newCommands.length; i++) {
                if (commands[newCommands[parseInt(i.toString(), 10)].name] && newCommands[parseInt(i.toString(), 10)]) {
                    if (newCommands[parseInt(i.toString(), 10)].canExecute) {
                        commands[newCommands[parseInt(i.toString(), 10)].name].canExecute
                            = newCommands[parseInt(i.toString(), 10)].canExecute;
                    }
                    if (newCommands[parseInt(i.toString(), 10)].execute) {
                        commands[newCommands[parseInt(i.toString(), 10)].name].execute
                            = newCommands[parseInt(i.toString(), 10)].execute;
                    }
                    if (newCommands[parseInt(i.toString(), 10)].gesture.key
                        || newCommands[parseInt(i.toString(), 10)].gesture.keyModifiers) {
                        commands[newCommands[parseInt(i.toString(), 10)].name].gesture
                            = newCommands[parseInt(i.toString(), 10)].gesture;
                    }
                    if (newCommands[parseInt(i.toString(), 10)].parameter !== '') {
                        commands[newCommands[parseInt(i.toString(), 10)].name].parameter
                            = newCommands[parseInt(i.toString(), 10)].parameter;
                    }
                } else {
                    this.overrideCommands(newCommands[parseInt(i.toString(), 10)], commands);
                    commands[newCommands[parseInt(i.toString(), 10)].name] = {
                        execute: newCommands[parseInt(i.toString(), 10)].execute,
                        canExecute: newCommands[parseInt(i.toString(), 10)].canExecute,
                        gesture: newCommands[parseInt(i.toString(), 10)].gesture,
                        parameter: newCommands[parseInt(i.toString(), 10)].parameter
                    };
                }

            }
        }
        this.commands = commands;
    }


    /**
     * updateNodeEdges method \
     *
     * @returns { void }     updateNodeEdges method .\
     * @param {Node} node - provide the source value.
     *
     * @private
     */
    public updateNodeEdges(node: Node): void {
        for (const edge of node.inEdges) {
            if (this.nameTable[`${edge}`]) {
                this.nameTable[`${edge}`].targetID = '';
            }
        }
        for (const edge of node.outEdges) {
            if (this.nameTable[`${edge}`]) {
                this.nameTable[`${edge}`].sourceID = '';
            }
        }
        node.inEdges = [];
        node.outEdges = [];
    }

    /**
     * updateIconVisibility method \
     *
     * @returns { void }     updateIconVisibility method .\
     * @param {Node} node - provide the source value.
     * @param {boolean} visibility - provide the source value.
     *
     * @private
     */
    private updateIconVisibility(node: Node, visibility: boolean): void {
        const prefix: string = `${node.id}_icon`;
        for (const child of node.wrapper.children as DiagramElement[]) {
            if (child.id && child.id.startsWith(prefix)) {
                child.visible = visibility;
                this.updateDiagramContainerVisibility(child, visibility);
            }
        }
    }

    /**
     * updateEdges method \
     *
     * @returns { void }     updateEdges method .\
     * @param {Connector} obj - provide the source value.
     *
     * @private
     */
    public updateEdges(obj: Connector): void {
        if (obj.sourceID !== undefined && obj.sourceID !== '') {
            const object: Node | Connector = this.nameTable[obj.sourceID];
            if (object && object.outEdges && object.outEdges.length === 0) { object.outEdges = []; }
            if (object && object.outEdges && object.outEdges.indexOf(obj.id) === -1) {
                object.outEdges.push(obj.id);
            }
            this.updatePortEdges(object, obj, false);
        }
        if (obj.targetID !== undefined && obj.targetID !== '') {
            const node: Node | Connector = this.nameTable[obj.targetID];
            if (node && node.inEdges && node.inEdges.length === 0) { node.inEdges = []; }
            if (node && node.inEdges && node.inEdges.indexOf(obj.id) === -1) {
                node.inEdges.push(obj.id);
            }
            this.updatePortEdges(node, obj, true);
            if (node && node.visible && node.outEdges) {
                const value: boolean = node.outEdges.length === 0 ? false : true;
                this.updateIconVisibility(node as Node, value);
            }
        }
    }
    /**
     * updatePortEdges method \
     *
     * @returns { void }     updatePortEdges method .\
     * @param {NodeModel} node - provide the source value.
     * @param {ConnectorModel} obj - provide the target value.
     * @param {boolean} isInEdges - provide the layoutOrientation value.
     *
     * @private
     */
    public updatePortEdges(node: NodeModel | ConnectorModel, obj: ConnectorModel, isInEdges: boolean): void {
        if (node) {
            for (let i: number = 0; i < node.ports.length; i++) {
                const port: PointPortModel | PortModel = node.ports[parseInt(i.toString(), 10)];
                const portId: string = (isInEdges) ? obj.targetPortID : obj.sourcePortID;
                if (port.id === portId) {
                    const portEdges: string[] = (isInEdges) ? port.inEdges : port.outEdges;
                    if (portEdges.indexOf(obj.id) === -1) {
                        portEdges.push(obj.id);
                    }
                }
            }
        }
    }

    /**
     * refreshDiagram method \
     *
     * @returns { void }     refreshDiagram method .\
     *
     * @private
     */
    public refreshDiagram(): void {
        this.initLayerObjects();
        this.doLayout();
        this.updateBridging();
        this.scroller.setSize();
        this.addBlazorDiagramObjects();
        //Removed isBlazor code
        this.updateFitToPage();
    }

    private updateCanupdateStyle(element: DiagramElement[], value: boolean): void {
        for (let j: number = 0; j < element.length; j++) {
            if ((element[parseInt(j.toString(), 10)] as GroupableView).children) {
                this.updateCanupdateStyle((element[parseInt(j.toString(), 10)] as GroupableView).children, value);
            }
            element[parseInt(j.toString(), 10)].canApplyStyle = value;
        }
    }

    private getZindexPosition(obj: (NodeModel | ConnectorModel), viewId: string): number {
        let objects: (NodeModel | ConnectorModel)[] = [];
        let index: number = undefined;
        objects = objects.concat(this.nodes);
        objects = objects.concat(this.connectors);
        let type: string;
        let greaterIndex: number;
        if ((obj as Node).children) {
            greaterIndex = this.commandHandler.findMaxZIndex(obj as Node);
        }
        else {
            greaterIndex = obj.zIndex;
        }
        if (obj.zIndex !== Number.MIN_VALUE) {
            for (let i: number = 0; i < objects.length; i++) {
                if (objects[parseInt(i.toString(), 10)].zIndex > greaterIndex) {
                    if (obj.shape.type === 'HTML' || obj.shape.type === 'Native') {
                        type = obj.shape.type === 'HTML' ? 'html' : 'native';
                    }
                    index = getDomIndex(viewId, objects[parseInt(i.toString(), 10)].id, type);
                    break;
                }
            }
        }
        return index;
    }

    /**
     *updateDiagramObject method \
     *
     * @returns { void } updateDiagramObject method .\
     * @param { (NodeModel | ConnectorModel) } obj - provide the obj value.
     * @param { boolean } canIgnoreIndex - provide the canIgnoreIndex value.
     * @param { boolean } isUpdateObject - provide the isUpdateObject value.
     *
     * @private
     */
    public updateDiagramObject(obj: (NodeModel | ConnectorModel), canIgnoreIndex?: boolean, isUpdateObject?: boolean): void {
        let view: View; const domTable: string = 'domTable';
        for (const temp of this.views) {
            view = this.views[`${temp}`];
            if (this.diagramActions) {
                if (view.mode === 'SVG') {
                    const hasLayers: boolean = this.layers.length > 1; let layer: LayerModel;
                    if (hasLayers) {
                        layer = this.commandHandler.getObjectLayer(obj.id);
                    }
                    if ((layer === undefined || (layer && layer.visible)) || isUpdateObject) {
                        const htmlLayer: HTMLElement = getHTMLLayer(this.element.id);
                        if (!window[`${domTable}`][view.element.id + '_diagramLayer']) {
                            window[`${domTable}`][view.element.id + '_diagramLayer'] =
                                document.getElementById(view.element.id + '_diagramLayer');
                        }
                        const diagramElementsLayer: HTMLCanvasElement =
                            window[`${domTable}`][view.element.id + '_diagramLayer'] as HTMLCanvasElement;
                        if (this.diagramActions & DiagramAction.Interactions) {
                            this.updateCanupdateStyle(obj.wrapper.children, true);
                        }
                        const centerPoint: object = this.getMidPoint(obj);
                        this.diagramRenderer.updateNode(
                            obj.wrapper as DiagramElement, diagramElementsLayer,
                            htmlLayer, undefined, canIgnoreIndex ? undefined : this.getZindexPosition(obj, view.element.id),
                            centerPoint, this.portCenterPoint);
                        this.updateCanupdateStyle(obj.wrapper.children, true);
                    }
                }
            }
        }
    }

    //Method used to apply margin for Bezier Curve points.
    private applyMarginBezier(obj: TextElement | PathElement, centerPoint: any): void {
        centerPoint.cx = centerPoint.cx + obj.margin.left;
        centerPoint.cx = centerPoint.cx - obj.margin.right;
        centerPoint.cy = centerPoint.cy + obj.margin.top;
        centerPoint.cy = centerPoint.cy - obj.margin.bottom;
    }

    //Method used to get mid point of Bezier Curve
    private getMidPoint(obj: (NodeModel | ConnectorModel)): object {
        let finalPoint: object[];
        if (obj instanceof Connector && obj.type === 'Bezier') {
            finalPoint = [];
            const totalPoints: PointModel[] = this.getBezierPoints(obj);
            const totalLength: number = Point.getLengthFromListOfPoints(totalPoints);
            // Bug 905077: Fixed improper positioning of multiple annotations for Bezier connectors.
            // Iterated through annotations and ports to correctly determine their positions.
            for (let i: number = 0; i < obj.annotations.length; i++) {
                const centerPoint: number | PointModel = obj.annotations[parseInt(i.toString(), 10)].offset;
                const absoluteLength: number = centerPoint as number * totalLength;
                const position: PointModel = this.commandHandler.getPointAtLength(absoluteLength, totalPoints, 0);
                const annotationPosition: any = { cx: position.x, cy: position.y };
                // EJ2-64114 -Horizontal and Vertical alignment not applied properly for the bezier connector annotation
                for (let j: number = 0; j < obj.wrapper.children.length; j++) {
                    if (obj.wrapper && obj.wrapper.children[parseInt(j.toString(), 10)] instanceof TextElement) {
                        if (obj.wrapper.children[parseInt(j.toString(), 10)].id === obj.id + '_' + obj.annotations[parseInt(i.toString(), 10)].id) {
                            this.applyMarginBezier(obj.wrapper.children[parseInt(j.toString(), 10)] as TextElement, annotationPosition);
                            finalPoint[obj.id + '_' + obj.annotations[parseInt(i.toString(), 10)].id] =
                                this.applyAlignment(obj.wrapper.children[parseInt(j.toString(), 10)] as TextElement,
                                                    annotationPosition, obj.annotations[parseInt(i.toString(), 10)].displacement);
                        }
                    }
                }
            }

            // Bug 835525: Connector Port feature. Below code is used to get the port position for bezier connector.
            for (let i: number = 0; i < obj.ports.length; i++) {
                const portOffset: number = obj.ports[parseInt(i.toString(), 10)].offset;
                const length: number = portOffset * totalLength;
                const portPosition: PointModel = this.commandHandler.getPointAtLength(length, totalPoints, 0);
                const portPoint: any = { cx: portPosition.x, cy: portPosition.y };
                for (let j: number = 0; j < obj.wrapper.children.length; j++) {
                    if (obj.wrapper && obj.wrapper.children[parseInt(j.toString(), 10)] instanceof PathElement &&
                        (obj.wrapper.children[parseInt(j.toString(), 10)] as any).isPathPort) {
                        if (obj.wrapper.children[parseInt(j.toString(), 10)].id === obj.id + '_' + obj.ports[parseInt(i.toString(), 10)].id) {
                            this.applyMarginBezier(obj.wrapper.children[parseInt(j.toString(), 10)] as PathElement, portPoint);
                            this.portCenterPoint[obj.id + '_' + obj.ports[parseInt(i.toString(), 10)].id] =
                                this.applyAlignment(obj.wrapper.children[parseInt(j.toString(), 10)] as PathElement,
                                                    portPoint, obj.ports[parseInt(i.toString(), 10)].displacement);
                        }
                    }
                }
            }
        }
        return finalPoint;
    }

    /**
     * Apply alignment to bezier port
     * @returns {PointModel} return the port alignment points
     * @param {PathElement | TextElement} child - provide the obj value.
     * @param {any} finalPoint - provide final point value.
     * @param {PointModel} displacement - provide displacement value.
     */
    private applyAlignment(child: PathElement | TextElement, finalPoint: any, displacement: PointModel): PointModel {
        switch (child.horizontalAlignment) {
        case 'Auto':
        case 'Left':
            finalPoint.cx = child.inversedAlignment ? finalPoint.cx : (finalPoint.cx - child.desiredSize.width);
            finalPoint.cx += displacement.x;
            break;
        case 'Stretch':
        case 'Center':
            finalPoint.cx -= child.desiredSize.width * child.pivot.x;
            break;
        case 'Right':
            finalPoint.cx = child.inversedAlignment ? (finalPoint.cx - child.desiredSize.width) : finalPoint.cx;
            finalPoint.cx -= displacement.x;
            break;
        }
        switch (child.verticalAlignment) {
        case 'Auto':
        case 'Top':
            finalPoint.cy = child.inversedAlignment ? finalPoint.cy : (finalPoint.cy - child.desiredSize.height);
            finalPoint.cy += displacement.y;
            break;
        case 'Stretch':
        case 'Center':
            finalPoint.cy -= child.desiredSize.height * child.pivot.y;
            break;
        case 'Bottom':
            finalPoint.cy = child.inversedAlignment ? (finalPoint.cy - child.desiredSize.height) : finalPoint.cy;
            finalPoint.cy -= displacement.y;
            break;
        }
        return finalPoint;
    }

    //(EJ2-62683) Method used to get total points in bezier connector
    private getBezierPoints(obj: ConnectorModel): PointModel[] {
        const points: PointModel[] = [];
        let i: number;
        let source: PointModel = { x: obj.sourcePoint.x, y: obj.sourcePoint.y };
        points.push(source as PointModel);
        for (i = 0; i < obj.segments.length; i++) {
            const total: PointModel[] =
                (obj.segments[parseInt(i.toString(), 10)] as BezierSegment).getPoints(
                    obj.segments[parseInt(i.toString(), 10)] as BezierSegment, source);
            // 878719: Resolve ESLint errors
            // eslint-disable-next-line prefer-spread
            points.push.apply(points, total);
            source = points[points.length - 1];
        }
        return points;
    }

    /**
     *updateGridContainer method \
     *
     * @returns { void } updateGridContainer method .\
     * @param { GridPanel } grid - provide the objectArray value.
     *
     * @private
     */
    public updateGridContainer(grid: GridPanel): void {
        let view: View;
        const htmlLayer: HTMLElement = getHTMLLayer(this.element.id);
        for (const temp of this.views) {
            view = this.views[`${temp}`];
            if (view.mode === 'SVG' && this.diagramActions) {
                const diagramElementsLayer: HTMLCanvasElement =
                    document.getElementById(view.element.id + '_diagramLayer') as HTMLCanvasElement;
                this.diagramRenderer.updateNode(grid, diagramElementsLayer, htmlLayer, undefined);
            } else {
                this.refreshCanvasDiagramLayer(view);
            }
        }
    }

    /**
     *Retrieves the node or connector with the given id. \
     *
     * @returns { (NodeModel | ConnectorModel)[] } Retrieves the node or connector with the given id.\
     * @param { string[] } objectArray - The id of the node or connector to be retrieved.
     *
     * @private
     */
    public getObjectsOfLayer(objectArray: string[]): (NodeModel | ConnectorModel)[] {
        const nodeArray: Object[] = [];
        for (const obj of objectArray) {
            if (this.nameTable[`${obj}`]) {
                nodeArray.push(this.nameTable[`${obj}`]);
            }
        }
        return nodeArray;
    }
    /**
     *refreshDiagramLayer method \
     *
     * @returns { void } refreshDiagramLayer method .\
     *
     * @private
     */
    public refreshDiagramLayer(): void {
        let view: View;
        for (const temp of this.views) {
            view = this.views[`${temp}`];
            switch (view.mode) {
            case 'SVG':
                this.refreshSvgDiagramLayer(view);
                break;
            case 'Canvas':
                this.refreshCanvasLayers(view);
                break;
            }
        }
    }

    /**
     *refreshCanvasLayers method \
     *
     * @returns { void } refreshCanvasLayers method .\
     * @param { View } view - provide the view value.
     *
     * @private
     */
    public refreshCanvasLayers(view?: View): void {
        if (!view) {
            for (const temp of this.views) {
                const view: View = this.views[`${temp}`];
                this.refreshCanvasDiagramLayer(view);
            }
        } else {
            this.refreshCanvasDiagramLayer(view);
        }
    }

    private renderBasicElement(view: View): void {
        const htmlLayer: HTMLElement = getHTMLLayer(view.element.id);
        for (let i: number = 0; i < this.basicElements.length; i++) {
            const element: DiagramElement = this.basicElements[parseInt(i.toString(), 10)];
            if (element instanceof GroupableView) {
                element.prevRotateAngle = 0;
            }
            element.measure(new Size(element.width, element.height));
            element.arrange(element.desiredSize);

            view.diagramRenderer.renderElement(element, view.diagramLayer, htmlLayer);
        }
    }

    private refreshElements(view: View): void {
        let isOverView: boolean = false;
        if (!this.isDestroyed) {
            this.clearCanvas(view);
            if (view instanceof Diagram) {
                (view.diagramLayer as HTMLCanvasElement).getContext('2d').setTransform(
                    view.scroller.currentZoom, 0, 0, view.scroller.currentZoom, 0, 0);
                (view.diagramLayer as HTMLCanvasElement).getContext('2d').scale(1.5, 1.5);
            } else {
                isOverView = true;
                const element: HTMLElement = document.getElementById(view.element.id + '_nativeLayer');
                if (element.children.length > 0) {
                    view.updateView(view);
                }
            }
            const htmlLayer: HTMLElement = getHTMLLayer(view.element.id);
            //const bounds: Rect = this.spatialSearch.getPageBounds();

            this.renderDiagramElements(view.diagramLayer, view.diagramRenderer, htmlLayer, undefined, undefined, isOverView);
            for (let i: number = 0; i < this.basicElements.length; i++) {
                const element: DiagramElement = this.basicElements[parseInt(i.toString(), 10)];
                element.measure(new Size(element.width, element.height));
                element.arrange(element.desiredSize);
                view.diagramRenderer.renderElement(element, view.diagramLayer, htmlLayer);
            }
            if (view instanceof Diagram) {
                view.diagramLayer.style.transform = 'scale(' + (2 / 3) + ')';
                view.diagramLayer.style.transformOrigin = '0 0';
            }
            this.renderTimer = null;
        }
    }

    private renderTimer: Object = null;
    /**
     *refreshCanvasDiagramLayer method \
     *
     * @returns { void } refreshCanvasDiagramLayer method .\
     * @param { View } view - provide the view value.
     *
     * @private
     */
    public refreshCanvasDiagramLayer(view: View): void {
        if (view.mode !== 'SVG' && !this.isDestroyed) {
            if (this.basicElements.length > 0) {
                this.renderBasicElement(view);
            }
            if (!this.preventOverviewRefresh) {
                if ((!this.diagramActions || (this.diagramActions & DiagramAction.Render) === 0)
                    || (DiagramAction.ToolAction & this.diagramActions) || canVitualize(this) || (this.scroller.currentZoom !== 1)) {
                    this.refreshElements(view);
                } else if (!this.renderTimer) {
                    this.renderTimer = setTimeout(
                        () => {
                            this.refreshElements(view);
                        },
                        40);
                }
            }
        }
    }


    /**
     *updatePortVisibility method \
     *
     * @returns { void } updatePortVisibility method .\
     * @param { Node } obj - provide the node value.
     * @param { PortVisibility } portVisibility - provide the portVisibility value.
     * @param { Boolean } inverse - provide the inverse value.
     *
     * @private
     */
    public updatePortVisibility(obj: Node | Connector, portVisibility: PortVisibility, inverse?: Boolean): void {
        let portElement: DiagramElement;
        const drawingObject: boolean = !(this.drawingObject && this.drawingObject.shape) ? true : false;
        if ((obj instanceof Node || obj instanceof Connector) && drawingObject && canMove(obj)) {
            const ports: PointPortModel[] | PortModel[] = obj.ports;
            let changed: boolean = false;
            for (let i: number = 0; i < ports.length; i++) {
                portElement = this.getWrapper(obj.wrapper, ports[parseInt(i.toString(), 10)].id);
                if ((portVisibility & PortVisibility.Hover || portVisibility & PortVisibility.Connect)) {
                    if (checkPortRestriction(ports[parseInt(i.toString(), 10)], portVisibility)) {
                        portElement.visible = !inverse;
                        changed = true;
                    }
                }
            }
            if (changed) {
                this.updateDiagramObject(obj);
            }
            //EJ2-59672 - Added the below code to render the ports while hovering over the node
            if (this.mode === 'Canvas') {
                this.refreshCanvasLayers();
            }
        }
    }

    /**
     *refreshSvgDiagramLayer method \
     *
     * @returns { void } refreshSvgDiagramLayer method .\
     * @param { View } view - provide the object value.
     *
     * @private
     */
    public refreshSvgDiagramLayer(view: View): void {
        let element: DiagramElement;
        const diagramElementsLayer: HTMLCanvasElement = document.getElementById(view.element.id + '_diagramLayer') as HTMLCanvasElement;
        const htmlLayer: HTMLElement = getHTMLLayer(view.element.id);
        if (!canVitualize(this)) {
            for (let i: number = 0; i < this.basicElements.length; i++) {
                element = this.basicElements[parseInt(i.toString(), 10)];
                element.measure(new Size(element.width, element.height));
                (element as GridPanel).arrange(element.desiredSize, (!(this.diagramActions & DiagramAction.Render) ? true : false));
                this.diagramRenderer.renderElement(element, diagramElementsLayer, htmlLayer);
            }
            this.renderDiagramElements(diagramElementsLayer, this.diagramRenderer, htmlLayer);
        } else {
            this.scroller.virtualizeElements();
        }
    }

    /**
     *removeVirtualObjects method \
     *
     * @returns { void } removeVirtualObjects method .\
     * @param { Object } clearIntervalVal - provide the object value.
     *
     * @private
     */
    public removeVirtualObjects(clearIntervalVal: Object): void {
        if (this.deleteVirtualObject) {
            this.preventOverviewRefresh = true;
            for (let i: number = 0; i < this.scroller.removeCollection.length; i++) {
                const obj: (NodeModel | ConnectorModel) = this.nameTable[this.scroller.removeCollection[parseInt(i.toString(), 10)]];
                //EJ2-840437 - Exception occurs When Removing connector with Virtualization Enabled
                if (obj !== undefined) {
                    this.removeElements(obj);
                }
            }
            this.deleteVirtualObject = false;
            this.preventOverviewRefresh = false;
        }
        clearInterval(clearIntervalVal as number);
    }
    /**
     *updateTextElementValue method \
     *
     * @returns { void } updateTextElementValue method .\
     * @param {  NodeModel | ConnectorModel } object - provide the object value.
     *
     * @private
     */
    public updateTextElementValue(object: NodeModel | ConnectorModel): void {
        for (let j: number = 0; j < object.wrapper.children.length; j++) {
            const element: TextElement = object.wrapper.children[parseInt(j.toString(), 10)] as TextElement;
            if (element instanceof TextElement) {
                element.canMeasure = true;
                //866384-Annotation Alignment is wrong when virtualisation constraints enabled
                const viewPortHeight: number = this.scroller.viewPortHeight;
                const viewPortWidth: number = this.scroller.viewPortWidth;
                let measureText: boolean = false;
                if ((object as Node).offsetX < viewPortWidth && (object as Node).offsetY < viewPortHeight) {
                    measureText = true;
                }
                if (measureText && canVitualize(this) && element.actualSize.height === undefined
                    && element.actualSize.width === undefined) {
                    object.wrapper.measure(new Size((object as Node).width, (object as Node).height),
                                           object.id, this.onLoadImageSize.bind(this));
                    object.wrapper.arrange(object.wrapper.desiredSize);
                }
                element.measure(new Size((object as Node).width, (object as Node).height));
                element.arrange(element.desiredSize);
            }
        }
    }

    /**
     *updateVirtualObjects method \
     *
     * @returns { void } updateVirtualObjects method .\
     * @param { string[] } collection - provide the collection value.
     * @param { boolean } remove - provide the remove value.
     * @param { string[] } tCollection - provide the htmlLayer value.
     *
     * @private
     */
    public updateVirtualObjects(
        collection: string[], remove: boolean, tCollection?: string[]):
        void {
        const diagramElementsLayer: HTMLCanvasElement = document.getElementById(this.element.id + '_diagramLayer') as HTMLCanvasElement;
        const htmlLayer: HTMLElement = getHTMLLayer(this.element.id);
        if (this.mode === 'SVG') {
            for (let i: number = 0; i < collection.length; i++) {
                const index: number = this.scroller.removeCollection.indexOf(collection[parseInt(i.toString(), 10)]);
                if (index >= 0) {
                    this.scroller.removeCollection.splice(index, 1);
                }
                const object: NodeModel | ConnectorModel = this.nameTable[collection[parseInt(i.toString(), 10)]];
                this.updateTextElementValue(object);
                this.diagramRenderer.renderElement(
                    object.wrapper, diagramElementsLayer, htmlLayer, undefined, undefined, undefined, undefined, object.zIndex);
            }
            for (let k: number = 0; k < tCollection.length; k++) {
                this.scroller.removeCollection.push(tCollection[parseInt(k.toString(), 10)]);
            }
            if (this.scroller.currentZoom !== 1) {
                this.eventHandler.updateVirtualization();
            }
        } else if (this.diagramActions) {
            this.refreshDiagramLayer();
        }
    }

    /**
     *renderDiagramElements method \
     *
     * @returns { void } renderDiagramElements method .\
     * @param { HTMLCanvasElement | SVGElement} canvas - provide the canvas value.
     * @param { DiagramRenderer } renderer - provide the renderer value.
     * @param { HTMLElement } htmlLayer - provide the htmlLayer value.
     * @param {boolean } transform - provide the transform value.
     * @param {boolean } fromExport - provide the fromExport value.
     * @param { boolean } isOverView - provide the isOverView value.
     * @param { boolean } fromSetOverview - provide the fromSetOverview value.
     *
     * @private
     */
    public renderDiagramElements(
        canvas: HTMLCanvasElement | SVGElement, renderer: DiagramRenderer, htmlLayer: HTMLElement,
        transform: boolean = true, fromExport?: boolean, isOverView?: boolean, fromSetOverview?: boolean): void {
        const pageBounds: Rect = this.scroller.getPageBounds();
        pageBounds.x *= this.scroller.currentZoom;
        pageBounds.y *= this.scroller.currentZoom;
        pageBounds.width *= this.scroller.currentZoom;
        pageBounds.height *= this.scroller.currentZoom;
        const difX: number = -this.scroller.horizontalOffset - pageBounds.x;
        const difY: number = -this.scroller.verticalOffset - pageBounds.y;
        let getCenterPoint: object;
        for (const layerId of Object.keys(this.layerZIndexTable)) {
            const layer: LayerModel = this.commandHandler.getLayer(this.layerZIndexTable[`${layerId}`]);
            let left: string;
            let top: string;
            if (this.mode === 'Canvas' && canVitualize(this) && !this.diagramActions) {
                this.scroller.virtualizeElements();
            }
            const id: string[] = (this.mode === 'Canvas' && canVitualize(this) &&
                this.scroller.oldCollectionObjects.length > 0) ?
                this.scroller.oldCollectionObjects : undefined;
            // Sort layer objects to arrange nodes with negative zIndex values at the beginning of the array.
            // Due to the new implementation with order commands, the zIndex of a node may become negative.
            // Therefore, we need to sort the zIndex values, with the least negative values coming first, followed by positive values.
            const layerObjects: string[] = Object.keys(id || (layer as Layer).zIndexTable);
            layerObjects.sort((a: string, b: string) => parseInt(`${a}`, 10) - parseInt(`${b}`, 10));
            for (const node of layerObjects) {
                const renderNode: Node = id ? this.nameTable[id[`${node}`]] : this.nameTable[(layer as Layer).zIndexTable[`${node}`]];
                if (renderNode && !(renderNode.parentId) && layer.visible &&
                    (!(renderNode.processId) || this.refreshing)) {
                    //EJ2-68738 - Overview content not updated properly on zoom out the diagram
                    let transformValue: TransformFactor;
                    //828826 - In canvas mode diagram transform values are not updated properly while Zoom out action
                    if (this.scroller.currentZoom < 1 && this.mode === 'SVG') {
                        transformValue = {
                            tx: (-pageBounds.x) / this.scroller.currentZoom,
                            ty: (-pageBounds.y) / this.scroller.currentZoom,
                            scale: this.scroller.transform.scale
                        };
                    }
                    else {
                        transformValue = {
                            tx: this.scroller.transform.tx,
                            ty: this.scroller.transform.ty,
                            scale: this.scroller.transform.scale
                        };
                    }
                    // Bug 880945: Overview is not updated properly with 4k monitor.
                    //To render the overview elements based on the pageBounds.
                    if (isOverView || fromSetOverview) {
                        transformValue = {
                            tx: (-pageBounds.x) / this.scroller.currentZoom,
                            ty: (-pageBounds.y) / this.scroller.currentZoom,
                            scale: this.scroller.transform.scale
                        };
                    }
                    if (canVitualize(this)) {
                        if (this.scroller.currentZoom < 1) {
                            if (pageBounds.x < 0 || this.scroller.horizontalOffset < 0) {
                                const verticalValue: number = this.scroller.verticalOffset < 0 ? this.scroller.verticalOffset : 0;
                                left = (difX > 0 ? difX : 0) + 'px';
                                top = ((this.realActions & RealAction.vScrollbarMoved) ? 0 : -verticalValue) + 'px';
                            } else {
                                left = 0 + 'px';
                                top = 0 + 'px';
                            }
                            if (this.realActions & RealAction.hScrollbarMoved) {
                                this.realActions = this.realActions & ~RealAction.hScrollbarMoved;
                            }
                            if (this.realActions & RealAction.vScrollbarMoved) {
                                this.realActions = this.realActions & ~RealAction.vScrollbarMoved;
                            }
                        } else {
                            left = (pageBounds.x < 0 ? difX : -this.scroller.horizontalOffset) + 'px';
                            top = (pageBounds.y < 0 ? difY : -this.scroller.verticalOffset) + 'px';
                        }
                        this.diagramLayer.style.left = left;
                        this.diagramLayer.style.top = top;
                        //EJ2-69578 - Overview is not updated properly when we enable virtualization.
                        transformValue.tx = (-pageBounds.x) / transformValue.scale;
                        transformValue.ty = (-pageBounds.y) / transformValue.scale;
                    }
                    let status: boolean = true;
                    if (fromExport) {
                        status = false;
                    }
                    this.updateTextElementValue(renderNode);
                    if (this.refreshing) {
                        if ((renderNode.shape as BpmnShapeModel).activity && (renderNode.shape as BpmnShapeModel).activity.subProcess
                            && (renderNode.shape as BpmnShapeModel).activity.subProcess.processes) {
                            for (let i: number = 0; i < (renderNode.shape as BpmnShapeModel).activity.subProcess.processes.length; i++) {
                                const process: string
                                    = (renderNode.shape as BpmnShapeModel).activity.subProcess.processes[parseInt(i.toString(), 10)];
                                renderNode.wrapper.children.push(this.nameTable[`${process}`].wrapper);
                            }
                            renderNode.wrapper.measure(new Size(renderNode.wrapper.bounds.width, renderNode.wrapper.bounds.height));
                            renderNode.wrapper.arrange(renderNode.wrapper.desiredSize);
                        }
                    }
                    if (renderNode instanceof Connector && renderNode.type === 'Bezier') {
                        getCenterPoint = this.getMidPoint(renderNode);
                        // (EJ2-58802) - Added the below code to add the transform x and y values to center point value in canvas mode
                        if (this.mode === 'Canvas' && transform) {
                            (getCenterPoint as any).cx += transformValue.tx;
                            (getCenterPoint as any).cy += transformValue.ty;
                        }
                    } else {
                        getCenterPoint = null;
                    }
                    renderer.renderElement(
                        renderNode.wrapper, canvas, htmlLayer,
                        (!renderer.isSvgMode && transform) ? transformValue : undefined,
                        undefined, undefined, status && (!this.diagramActions || fromSetOverview),
                        undefined, undefined, getCenterPoint, this.portCenterPoint);
                }
            }
        }
    }

    /**
     *updateBridging method \
     *
     * @returns { void } updateBridging method .\
     * @param {string} isLoad - provide the isLoad value.
     *
     * @private
     */
    public updateBridging(isLoad?: boolean): void {
        if (this.bridgingModule) {
            for (let i: number = 0; i < this.connectors.length; i++) {
                const connector: Connector = this.connectors[parseInt(i.toString(), 10)] as Connector;
                if (!canBridge(connector, this) && this.lineDistributionModule) {
                    continue;
                }
                this.bridgingModule.updateBridging(connector, this);
                const canvas: GroupableView = this.connectors[parseInt(i.toString(), 10)].wrapper;
                if (canvas && canvas.children && canvas.children.length > 0) {
                    const pathSegment: PathElement = canvas.children[0] as PathElement;
                    const data: string = pathSegment.data;
                    if (connector.isBezierEditing && this.selectedItems.connectors[0].id === connector.id || connector.type !== 'Bezier') {
                        this.updateQuad(connector);
                        connector.getSegmentElement(
                            connector, pathSegment,
                            this.layout.type === 'ComplexHierarchicalTree' || this.layout.type === 'HierarchicalTree' ?
                                this.layout.orientation : undefined, undefined, false);
                    }
                    if (pathSegment.data !== data) {
                        canvas.measure(new Size());
                        canvas.arrange(canvas.desiredSize);
                        if (this.mode === 'SVG' && !isLoad) {
                            this.updateDiagramObject(connector);
                        }
                    }
                }
            }
        } else if (this.constraints & DiagramConstraints.Bridging) {
            console.warn('[WARNING] :: Module "ConnectorBridging" is not available in Diagram component! You either misspelled the module name or forgot to load it.');
        }
    }

    /**
     *setCursor method \
     *
     * @returns { void } setCursor method .\
     * @param {string} cursor - provide the width value.
     *
     * @private
     */
    public setCursor(cursor: string): void {
        this.diagramRenderer.setCursor(this.diagramCanvas, cursor);
    }

    /**
     *clearCanvas method \
     *
     * @returns { void } clearCanvas method .\
     * @param {View} view - provide the width value.
     *
     * @private
     */
    public clearCanvas(view: View): void {
        //let width: number;
        //let height: number;
        const width: number = view.contentWidth || (view.diagramLayer as HTMLCanvasElement).width / this.scroller.currentZoom;
        const height: number = view.contentHeight || (view.diagramLayer as HTMLCanvasElement).height / this.scroller.currentZoom;
        if (view.mode !== 'SVG') {
            const ctx: CanvasRenderingContext2D = CanvasRenderer.getContext(view.diagramLayer as HTMLCanvasElement);
            ctx.clearRect(0, 0, width, height);
        }
    }


    /**
     *updateScrollOffset method \
     *
     * @returns { void } updateScrollOffset method .\
     *
     * @private
     */
    public updateScrollOffset(): void {
        this.scroller.setScrollOffset(this.diagramCanvas.scrollLeft, this.diagramCanvas.scrollTop);
        updateRuler(this);
        if (canVitualize(this)) {
            this.scroller.virtualizeElements();
        }
    }


    /**
     *setOffset method \
     *
     * @returns { void } setOffset method .\
     * @param {number} offsetX - provide the width value.
     * @param {number} offsetY - provide the height value.
     *
     * @private
     */
    public setOffset(offsetX: number, offsetY: number): void {
        const domTableKey: string = `${this.element.id}content`;
        const domTable: Record<string, HTMLElement | undefined> = window['domTable'];
        if (!domTable[`${domTableKey}`]) {
            const element: HTMLElement | null = document.getElementById(domTableKey);
            if (element) {
                domTable[`${domTableKey}`] = element;
            }
        }
        const container: HTMLElement | undefined = domTable[`${domTableKey}`];
        if (container) {
            if (container.scrollLeft !== offsetX) {
                container.scrollLeft = offsetX;
            }
            if (container.scrollTop !== offsetY) {
                container.scrollTop = offsetY;
            }
        }
    }

    /**
     *setSize method \
     *
     * @returns { void } setSize method .\
     * @param {number} width - provide the width value.
     * @param {number} height - provide the height value.
     *
     * @private
     */
    public setSize(width: number, height: number): void {
        if (this.diagramLayer && !this.preventDiagramUpdate) {
            const position: Size = getRulerSize(this);
            width -= position.width;
            height -= position.height;
            const bounds: Rect = this.spatialSearch.getPageBounds();
            bounds.x *= this.scroller.currentZoom;
            bounds.y *= this.scroller.currentZoom;
            bounds.width *= this.scroller.currentZoom;
            bounds.height *= this.scroller.currentZoom;
            const factor: number = this.mode === 'SVG' ? 1 : 1.5;
            const diagramLayer: HTMLElement | SVGElement = this.mode === 'SVG' ?
                getDiagramLayerSvg(this.element.id) as SVGElement : this.diagramLayer;
            const w: number = (this.mode === 'Canvas' &&
                (this.constraints & DiagramConstraints.Virtualization)) ? this.scroller.viewPortWidth as number : width;
            const h: number = (this.mode === 'Canvas' &&
                (this.constraints & DiagramConstraints.Virtualization)) ? this.scroller.viewPortHeight as number : height;
            diagramLayer.setAttribute('width', (factor * w).toString());
            diagramLayer.setAttribute('height', (factor * h).toString());
            const hiddenUserHandleTemplate: HTMLElement = document.getElementById(this.element.id + '_diagramUserHandleLayer');
            if (hiddenUserHandleTemplate) {
                hiddenUserHandleTemplate.style.width = width + 'px';
                hiddenUserHandleTemplate.style.height = height + 'px';
            }
            const attr: Object = { 'width': width.toString(), 'height': height.toString() };
            this.diagramLayerDiv.style.width = width + 'px';
            this.diagramLayerDiv.style.height = height + 'px';

            setAttributeSvg(getNativeLayerSvg(this.element.id), attr);

            setAttributeSvg(getPortLayerSvg(this.element.id), attr);

            const adornerSVG: SVGElement = getAdornerLayerSvg(this.element.id);
            setAttributeSvg(adornerSVG, attr);

            (adornerSVG.parentNode as HTMLElement).style.width = width + 'px';
            (adornerSVG.parentNode as HTMLElement).style.height = height + 'px';

            const gridLayer: SVGSVGElement = getGridLayerSvg(this.element.id);
            setAttributeSvg(gridLayer, attr);

            this.diagramRenderer.updateGrid(
                this.snapSettings, gridLayer, this.scroller.transform, this.rulerSettings, this.hRuler, this.vRuler
            );

            setAttributeSvg(getBackgroundLayerSvg(this.element.id), attr);

            this.htmlLayer.style.width = width + 'px';
            this.htmlLayer.style.height = height + 'px';
            if (this.mode !== 'SVG' && !(canVitualize(this))) {
                this.refreshDiagramLayer();
            }
            if (this.mode === 'SVG' && canVitualize(this)) {
                this.scroller.virtualizeElements();
            }
        }
    }

    /**
     *transformLayers method \
     *
     * @returns { void } Defines how to remove the Page breaks .\
     *
     * @private
     */
    public transformLayers(): void {
        const bounds: Rect = this.spatialSearch.getPageBounds();
        bounds.x *= this.scroller.currentZoom;
        bounds.y *= this.scroller.currentZoom;
        bounds.width *= this.scroller.currentZoom;
        bounds.height *= this.scroller.currentZoom;
        this.diagramRenderer.updateGrid(
            this.snapSettings, getGridLayerSvg(this.element.id), this.scroller.transform, this.rulerSettings, this.hRuler, this.vRuler
        );
        this.diagramRenderer.transformLayers(this.scroller.transform, this.mode === 'SVG');
        if (!(this.diagramActions & DiagramAction.DragUsingMouse)) {
            this.updateSelector();
        }
        this.renderPageBreaks(bounds);
    }


    /**
     *Defines how to remove the Page breaks \
     *
     * @returns { void } Defines how to remove the Page breaks .\
     *
     * @private
     */
    public removePageBreaks(): void {
        if (this.diagramLayer) {
            const line: SVGSVGElement = getBackgroundLayer(this.element.id);
            if (line && line.childNodes) {
                const length: number = line.childNodes.length;
                for (let i: number = 0; i < length; i++) {
                    line.removeChild(line.childNodes[0]);
                }
            }
        }
    }

    /**
     * Defines how the page breaks has been rendered \
     *
     * @returns { void } Defines how the page breaks has been rendered .\
     * @param {Rect} bounds - provide the overview value.
     *
     * @private
     */
    public renderPageBreaks(bounds?: Rect): void {
        this.removePageBreaks();
        const backgroundLayer: SVGElement = getBackgroundLayer(this.element.id);
        if (backgroundLayer) {
            let i: number = 0;
            bounds = this.scroller.getPageBounds(true);
            const x: number = (this.scroller.transform.tx + bounds.x) * this.scroller.currentZoom;
            const y: number = (this.scroller.transform.ty + bounds.y) * this.scroller.currentZoom;
            const height: number = bounds.height * this.scroller.currentZoom;
            const width: number = bounds.width * this.scroller.currentZoom;
            DiagramRenderer.renderSvgBackGroundImage(this.pageSettings.background, this.element, x, y, width, height);
            const options: BaseAttributes = {
                id: backgroundLayer.id + 'rect', x: x,
                y: y,
                height: height,
                width: width, angle: 0, stroke: '', strokeWidth: 1,
                fill: this.pageSettings.background.color, opacity: 1,
                pivotX: 0, pivotY: 0, visible: true, dashArray: '0'
            };
            this.diagramRenderer.drawRect(backgroundLayer, options);
            if (this.pageSettings.showPageBreaks) {
                const collection: Segment[] = this.scroller.getPageBreak(bounds);
                for (i = 0; i < collection.length; i++) {
                    this.diagramRenderer.drawLine(backgroundLayer, {
                        class: 'e-diagram-page-break',
                        fill: 'none', stroke: '#aaaaaa', strokeWidth: 1, dashArray: '10 10',
                        opacity: 2, x: 0, y: 0, width: 0, height: 0, angle: 0, pivotX: 0, pivotY: 0, visible: true,
                        startPoint: {
                            x: (collection[parseInt(i.toString(), 10)].x1 + this.scroller.transform.tx) * this.scroller.currentZoom,
                            y: (collection[parseInt(i.toString(), 10)].y1 + this.scroller.transform.ty) * this.scroller.currentZoom
                        },
                        endPoint: {
                            x: (collection[parseInt(i.toString(), 10)].x2 + this.scroller.transform.tx) * this.scroller.currentZoom,
                            y: (collection[parseInt(i.toString(), 10)].y2 + this.scroller.transform.ty) * this.scroller.currentZoom
                        }, id: collection[parseInt(i.toString(), 10)].y1 === collection[parseInt(i.toString(), 10)].y2 ? 'HorizontalLines' : 'VerticalLines'
                    });
                }
            }
        }
    }

    private validatePageSize(): void {
        let temp: number = 0;
        if (this.pageSettings.orientation === 'Portrait') {
            if (this.pageSettings.width > this.pageSettings.height) {
                temp = this.pageSettings.height;
                this.pageSettings.height = this.pageSettings.width;
                this.pageSettings.width = temp;
            }
        } else {
            if (this.pageSettings.height > this.pageSettings.width) {
                temp = this.pageSettings.width;
                this.pageSettings.width = this.pageSettings.height;
                this.pageSettings.height = temp;
            }
        }
    }

    /**
     * setOverview method \
     *
     * @returns { void }     setOverview method .\
     * @param {View} overview - provide the overview value.
     * @param {string} id - provide the boolean value.
     *
     * @private
     */
    public setOverview(overview: View, id?: string): void {
        if (overview) {
            if (overview) {
                this.views.push(overview.id);
                this.views[overview.id] = overview;
                overview.renderDocument(overview);
                overview.diagramRenderer.setLayers();
                overview.initializeOverviewLayers();
                overview.updateView(overview);
                this.renderNodes(overview);
            }
        } else {
            for (let i: number = 0; i < this.views.length; i++) {
                if (this.views[parseInt(i.toString(), 10)] === id) {
                    overview = (this.views[`${id}`]);
                }
            }
            this.views[`${id}`] = undefined;
            const index: number = this.views.indexOf(id);
            this.views.splice(index, 1);
        }
    }

    private renderNodes(overview: View): void {
        if (overview) {
            const renderer: DiagramRenderer = new DiagramRenderer(overview.id, new SvgRenderer(), false);
            const g: HTMLElement = document.getElementById(overview.element.id + '_diagramLayer') as HTMLCanvasElement;
            const htmlLayer: HTMLElement = getHTMLLayer(overview.element.id);
            this.renderDiagramElements(g as HTMLCanvasElement, overview.diagramRenderer || renderer, htmlLayer, undefined, undefined,
                                       undefined, true);
        }
    }

    private updateThumbConstraints(
        node: NodeModel[] | ConnectorModel[] | PathAnnotation[] | ShapeAnnotation[],
        selectorModel: SelectorModel, canInitialize?: boolean): void {

        const state: number = 0;
        const length: number = node.length;
        for (let i: number = 0; i < length; i++) {
            const obj: NodeModel | ConnectorModel | ShapeAnnotation | PathAnnotation = node[parseInt(i.toString(), 10)];
            let hideRotate: boolean = false;
            const hideResize: boolean = false;
            let thumbConstraints: ThumbsConstraints = (selectorModel as Selector).thumbsConstraints;
            let isInsideSwimlane: boolean = false;
            if (this.nameTable[(obj as Node).parentId]) {
                const lane: NodeModel = this.nameTable[(obj as Node).parentId];
                isInsideSwimlane = (lane as Node).isLane;
            }
            if (obj instanceof Node) {
                //Bug 913796: Multiselect swimlane with outside node, drag, rotate is not proper.
                //Hided rotate thumb for swimlane
                hideRotate = (obj.shape.type === 'Bpmn' && ((obj.shape as BpmnShapeModel).shape === 'Activity' &&
                    ((obj.shape as BpmnShapeModel).activity.subProcess.collapsed === false))) || obj.shape.type === 'SwimLane' || isInsideSwimlane;
                // hideResize = (obj.shape.type === 'Bpmn' && (obj.shape as BpmnShapeModel).shape === 'TextAnnotation');
                if (!canRotate(obj) || !(thumbConstraints & ThumbsConstraints.Rotate) || hideRotate) {
                    thumbConstraints = thumbConstraints & ~ThumbsConstraints.Rotate;
                }
                if (!canResize(obj, 'SouthEast') || !(thumbConstraints & ThumbsConstraints.ResizeSouthEast) || hideResize) {
                    thumbConstraints = thumbConstraints & ~ThumbsConstraints.ResizeSouthEast;
                }
                if (!canResize(obj, 'NorthWest') || !(thumbConstraints & ThumbsConstraints.ResizeNorthWest) || hideResize) {
                    thumbConstraints = thumbConstraints & ~ThumbsConstraints.ResizeNorthWest;
                }
                if (!canResize(obj, 'East') || !(thumbConstraints & ThumbsConstraints.ResizeEast) || hideResize) {
                    thumbConstraints = thumbConstraints & ~ThumbsConstraints.ResizeEast;
                }
                if (!canResize(obj, 'West') || !(thumbConstraints & ThumbsConstraints.ResizeWest) || hideResize) {
                    thumbConstraints = thumbConstraints & ~ThumbsConstraints.ResizeWest;
                }
                if (!canResize(obj, 'North') || !(thumbConstraints & ThumbsConstraints.ResizeNorth) || hideResize) {
                    thumbConstraints = thumbConstraints & ~ThumbsConstraints.ResizeNorth;
                }
                if (!canResize(obj, 'South') || !(thumbConstraints & ThumbsConstraints.ResizeSouth) || hideResize) {
                    thumbConstraints = thumbConstraints & ~ThumbsConstraints.ResizeSouth;
                }
                if (!canResize(obj, 'NorthEast') || !(thumbConstraints & ThumbsConstraints.ResizeNorthEast) || hideResize) {
                    thumbConstraints = thumbConstraints & ~ThumbsConstraints.ResizeNorthEast;
                }
                if (!canResize(obj, 'SouthWest') || !(thumbConstraints & ThumbsConstraints.ResizeSouthWest) || hideResize) {
                    thumbConstraints = thumbConstraints & ~ThumbsConstraints.ResizeSouthWest;
                }
            } else if (obj instanceof Connector) {
                if (!canInitialize) { thumbConstraints = thumbConstraints | ThumbsConstraints.Default; }
                if (canDragSourceEnd(obj as Connector)) {
                    thumbConstraints = thumbConstraints | ThumbsConstraints.ConnectorSource;
                } else {
                    thumbConstraints = thumbConstraints & ~ThumbsConstraints.ConnectorSource;
                }
                if (canDragTargetEnd(obj as Connector)) {
                    thumbConstraints = thumbConstraints | ThumbsConstraints.ConnectorTarget;
                } else {
                    thumbConstraints = thumbConstraints & ~ThumbsConstraints.ConnectorTarget;
                }
            } else {
                if (!canInitialize) { thumbConstraints = thumbConstraints | ThumbsConstraints.Default; }
                if (!canResize(obj as ShapeAnnotation | PathAnnotation)) {
                    thumbConstraints = thumbConstraints & ~(ThumbsConstraints.ResizeSouthEast | ThumbsConstraints.ResizeSouthWest |
                        ThumbsConstraints.ResizeSouth | ThumbsConstraints.ResizeEast | ThumbsConstraints.ResizeWest |
                        ThumbsConstraints.ResizeNorth | ThumbsConstraints.ResizeNorthEast | ThumbsConstraints.ResizeNorthWest);
                }
                if (!canRotate(obj as ShapeAnnotation | PathAnnotation)) {
                    thumbConstraints = thumbConstraints & ~ThumbsConstraints.Rotate;
                }
            }
            (selectorModel as Selector).thumbsConstraints = thumbConstraints;
        }
    }

    /**
     * renderSelector method \
     *
     * @returns { void }     renderSelector method .\
     * @param {boolean} multipleSelection - provide the multipleSelection value.
     * @param {boolean} isSwimLane - provide the boolean value.
     * @param { Canvas } canvas - provide the lane or swimlane canvas
     *
     * @private
     */
    public renderSelector(multipleSelection: boolean, isSwimLane?: boolean, canvas?: Canvas): void {
        const isProtectedOnChangeValue: boolean = this.isProtectedOnChange;
        //Removed isBlazor code
        const size: Size = new Size();
        const selectorModel: Selector = this.selectedItems as Selector;

        const selectorConstraints: SelectorConstraints = selectorModel.constraints;
        const rendererActions: RendererAction = this.diagramRenderer.rendererActions;
        const innertemplate: HTMLCollection = document.getElementsByClassName('blazor-inner-template');
        let i: number;
        let div: HTMLElement;
        this.diagramRenderer.rendererActions = this.currentSymbol ?
            this.addConstraints(rendererActions, RendererAction.DrawSelectorBorder) :
            this.removeConstraints(rendererActions, RendererAction.DrawSelectorBorder);
        this.clearSelectorLayer();
        if (this.commandHandler.hasSelection()) {
            if (selectorModel.nodes.length === 1 && selectorModel.connectors.length === 0) {
                selectorModel.rotateAngle = selectorModel.nodes[0].rotateAngle;
                selectorModel.pivot = selectorModel.nodes[0].pivot;
            }
            selectorModel.wrapper.measure(size);
            selectorModel.wrapper.arrange(selectorModel.wrapper.desiredSize);
            selectorModel.width = selectorModel.wrapper.actualSize.width;
            selectorModel.height = selectorModel.wrapper.actualSize.height;
            selectorModel.offsetX = selectorModel.wrapper.offsetX;
            selectorModel.offsetY = selectorModel.wrapper.offsetY;
            if (selectorModel.rotateAngle !== 0) {
                for (const obj of selectorModel.nodes) {
                    obj.offsetX = obj.wrapper.offsetX;
                    obj.offsetY = obj.wrapper.offsetY;
                }

                for (const conn of selectorModel.connectors) {
                    //update connections
                }
            }

            const bounds: Rect = this.spatialSearch.getPageBounds();
            //let selectorElement: (SVGElement | HTMLCanvasElement);
            const selectorElement: (SVGElement | HTMLCanvasElement) = getSelectorElement(this.element.id);
            //let diagramUserHandlelayer: (SVGElement | HTMLElement);
            const diagramUserHandlelayer: (SVGElement | HTMLElement) = getUserHandleLayer(this.element.id);
            selectorModel.thumbsConstraints = ThumbsConstraints.Default;
            if (selectorModel.annotation) {
                this.updateThumbConstraints([selectorModel.annotation] as (ShapeAnnotation[] | PathAnnotation[]), selectorModel);
            } else {
                this.updateThumbConstraints(selectorModel.nodes, selectorModel);
                this.updateThumbConstraints(selectorModel.connectors, selectorModel, true);
            }
            if (selectorModel.annotation) {
                this.renderSelectorForAnnotation(selectorModel, selectorElement);
            } else if (selectorModel.nodes.length + selectorModel.connectors.length === 1 || this.nameTable['helper']) {
                if (selectorModel.nodes[0] instanceof Node) {
                    const node: Node = selectorModel.nodes[0] as Node;
                    if (checkParentAsContainer(this, node)) {
                        if (!isSwimLane && (node.shape.type !== 'UmlClassifier' && !((node as Node).parentId &&
                            this.nameTable[(node as Node).parentId]
                            && this.nameTable[(node as Node).parentId].shape.type === 'UmlClassifier'))) {
                            selectorModel.thumbsConstraints &= ~ThumbsConstraints.Rotate;
                        }
                    }
                    const constraints: boolean = isSwimLane ? true : ((node.constraints & NodeConstraints.HideThumbs) ? true : false);
                    const swimlane: boolean = (node.shape.type === 'SwimLane' || node.isLane || node.isPhase || isSwimLane) ? true : false;
                    this.diagramRenderer.renderResizeHandle(
                        isSwimLane ? canvas : selectorModel.wrapper.children[0],
                        selectorElement, selectorModel.thumbsConstraints, this.scroller.currentZoom,
                        selectorModel.constraints, this.scroller.transform, undefined,
                        canMove(node), constraints, swimlane, selectorModel.handleSize);
                } else if (selectorModel.connectors[0] instanceof Connector && canDrawThumbs(this.diagramRenderer.rendererActions)) {
                    const connector: Connector = selectorModel.connectors[0] as Connector;
                    this.diagramRenderer.renderEndPointHandle(
                        connector, selectorElement, selectorModel.thumbsConstraints, selectorModel.constraints,
                        this.scroller.transform, connector.sourceWrapper !== undefined,
                        connector.targetWrapper !== undefined,
                        (this.connectorEditingToolModule && canDragSegmentThumb(connector)) ? true : false,
                        this.connectorEditingToolModule ? true : false, selectorModel.handleSize);
                }
            } else {
                this.diagramRenderer.renderResizeHandle(
                    selectorModel.wrapper, selectorElement, selectorModel.thumbsConstraints, this.scroller.currentZoom,
                    selectorModel.constraints, this.scroller.transform, undefined,
                    canMove(selectorModel), null, null, selectorModel.handleSize);
            }
            if (!(selectorModel.annotation) && !this.currentSymbol) {
                this.diagramRenderer.renderUserHandler(selectorModel, selectorElement, this.scroller.transform, diagramUserHandlelayer,
                                                       (this.eventHandler as any).currentAction, (this.eventHandler as any).inAction);
                //Removed isBlazor code
            }
        }
        // EJ2-56919 - Add below code to render the selection rectangle for node if selected objects length is greater than one
        if (this.selectedItems.selectedObjects.length > 1) {
            this.updateSelectionRectangle();
        }
        this.isProtectedOnChange = isProtectedOnChangeValue;
    }

    private updateSelectionRectangle(): void {
        const selectorElement: (SVGElement | HTMLCanvasElement) = getSelectorElement(this.element.id);
        let isFirst: boolean = false;
        for (let i: number = 0; i < this.selectedItems.selectedObjects.length; i++) {
            // EJ2-56919 - For first selected object we need to set stroke as 2, so check below condition as i is zero or not
            // For first element we passed isFirst argument(last arg) as true in both render selection line and rectangle method
            isFirst = i === 0 ? true : false;
            if (getObjectType(this.selectedItems.selectedObjects[parseInt(i.toString(), 10)]) === Connector) {
                // EJ2-56919 - If selected object type is connector means then render selection line for connector
                this.diagramRenderer.renderSelectionLine(
                    this.selectedItems.selectedObjects[parseInt(i.toString(), 10)].wrapper.children[0] as PathElement,
                    selectorElement, this.scroller.transform, isFirst);
            } else {
                // EJ2-56919 - If selected object type is node means then render selection rectangle for node
                this.diagramRenderer.renderSelectionRectangle(this.selectedItems.selectedObjects[parseInt(i.toString(), 10)].wrapper,
                                                              selectorElement, this.scroller.transform, isFirst);
            }
        }
    }

    /**
     * updateSelector method \
     *
     * @returns { void }     updateSelector method .\
     *
     * @private
     */
    public updateSelector(): void {
        const severDataBind: boolean = this.allowServerDataBinding;
        this.enableServerDataBinding(false);
        const size: Size = new Size();
        const selector: Selector = this.selectedItems as Selector;
        const selectorConstraints: SelectorConstraints = selector.constraints;
        const innertemplate: HTMLCollection = document.getElementsByClassName('blazor-inner-template');
        let i: number;
        let div: HTMLElement;
        if (!(this.diagramActions & DiagramAction.ToolAction) && this.selectedItems.nodes.length === 1) {
            this.selectedItems.rotateAngle = this.selectedItems.nodes[0].rotateAngle;
            this.selectedItems.wrapper.rotateAngle = this.selectedItems.nodes[0].rotateAngle;
        }
        if (this.selectedItems !== undefined) {
            this.clearSelectorLayer();
            if (selector.wrapper !== null && selector.wrapper.children && selector.wrapper.children.length) {
                let canUpdate: boolean = true;
                let canRender: boolean = true;
                //EJ2-937180- Multiselected shapes Rotation thumb misplacement on Undo after rotate
                selector.wrapper.rotateAngle = selector.rotateAngle;
                if (selectionHasConnector(this, selector)) {
                    const eventHandler: string = 'eventHandler';
                    const rotate: string = this[`${eventHandler}`].action;
                    const isRotate: boolean = rotate.includes('Rotate');
                    const isSelect: boolean = rotate.includes('None') || rotate.includes('Select') || rotate.includes('Drag');
                    if (isRotate || isSelect) {
                        canRender = false;
                    }
                    if (!isSelect) {
                        canUpdate = false;
                    }
                }
                if (canUpdate) {
                    selector.wrapper.measure(size);
                    selector.wrapper.arrange(selector.wrapper.desiredSize);
                }
                if (selector.rotateAngle !== 0 || selector.rotateAngle !== selector.wrapper.prevRotateAngle) {
                    for (const obj of selector.nodes) {
                        obj.offsetX = obj.wrapper.offsetX;
                        obj.offsetY = obj.wrapper.offsetY;
                    }
                }
                selector.width = selector.wrapper.actualSize.width;
                selector.height = selector.wrapper.actualSize.height;
                selector.offsetX = selector.wrapper.offsetX;
                selector.offsetY = selector.wrapper.offsetY;
                //let selectorEle: (SVGElement | HTMLCanvasElement);
                const selectorEle: (SVGElement | HTMLCanvasElement) = getSelectorElement(this.element.id);
                //let diagramUserHandlelayer: (SVGElement | HTMLElement);
                const diagramUserHandlelayer: (SVGElement | HTMLElement) = getUserHandleLayer(this.element.id);
                const canHideResizers: boolean = this.eventHandler.canHideResizers();
                selector.thumbsConstraints = ThumbsConstraints.Default;
                if (selector.annotation) {
                    this.updateThumbConstraints([selector.annotation] as (ShapeAnnotation[] | PathAnnotation[]), selector);
                } else {
                    this.updateThumbConstraints(selector.nodes, selector);
                    this.updateThumbConstraints(selector.connectors, selector, true);
                }
                if ((this.selectedItems.constraints & SelectorConstraints.UserHandle) && (!(selector.annotation)) && !this.currentSymbol) {
                    this.diagramRenderer.renderUserHandler(selector, selectorEle, this.scroller.transform, diagramUserHandlelayer,
                                                           (this.eventHandler as any).currentAction, (this.eventHandler as any).inAction);
                    //Removed isBlazor code
                }
                if (selector.annotation) {
                    this.renderSelectorForAnnotation(selector, selectorEle);
                } else if (selector.nodes.length + selector.connectors.length === 1) {
                    if (selector.connectors[0] instanceof Connector && canDrawThumbs(this.diagramRenderer.rendererActions)) {
                        const connector: Connector = selector.connectors[0] as Connector;
                        this.diagramRenderer.renderEndPointHandle(
                            connector, selectorEle, selector.thumbsConstraints, selectorConstraints,
                            this.scroller.transform, connector.sourceWrapper !== undefined, connector.targetWrapper !== undefined,
                            (this.connectorEditingToolModule && canDragSegmentThumb(connector)) ? true : false,
                            this.connectorEditingToolModule ? true : false, selector.handleSize);
                    } else if (selector.nodes[0] instanceof Node) {
                        const stackPanel: NodeModel = selector.nodes[0];
                        if (checkParentAsContainer(this, selector.nodes[0])) {
                            if (stackPanel.shape.type !== 'UmlClassifier' && !((stackPanel as Node).parentId &&
                                this.nameTable[(stackPanel as Node).parentId]
                                && this.nameTable[(stackPanel as Node).parentId].shape.type === 'UmlClassifier')) {
                                selector.thumbsConstraints &= ~ThumbsConstraints.Rotate;
                            }
                        }
                        const swimlane: boolean = (stackPanel.shape.type === 'SwimLane' || (stackPanel as Node).isLane ||
                            (stackPanel as Node).isPhase) ? true : false;
                        this.diagramRenderer.renderResizeHandle(
                            selector.wrapper.children[0], selectorEle, selector.thumbsConstraints, this.scroller.currentZoom,
                            selector.constraints, this.scroller.transform, canHideResizers, canMove(selector.nodes[0]),
                            (selector.nodes[0].constraints & NodeConstraints.HideThumbs) ? true : false, swimlane, selector.handleSize);
                    }
                } else {
                    if (this.diagramActions & DiagramAction.Interactions) {
                        this.diagramRenderer.rendererActions = this.diagramRenderer.rendererActions | RendererAction.PreventRenderSelector;
                    }
                    if (!(selectionHasConnector(this, selector) && canRender)) {
                        this.diagramRenderer.renderResizeHandle(
                            selector.wrapper, selectorEle, selector.thumbsConstraints, this.scroller.currentZoom,
                            selector.constraints, this.scroller.transform, canHideResizers,
                            canMove(selector), null, null, selector.handleSize
                        );
                    }
                    this.diagramRenderer.rendererActions = this.diagramRenderer.rendererActions & ~RendererAction.PreventRenderSelector;

                }
            }
        }
        // EJ2-56919 - Add below code to render selection rectangle for node if selected objects length is greater than one
        if (this.selectedItems.selectedObjects.length > 1) {
            this.updateSelectionRectangle();
        }
        this.enableServerDataBinding(severDataBind);
    }

    /**
     * renderSelectorForAnnotation method \
     *
     * @returns { void }     renderSelectorForAnnotation method .\
     * @param {Selector} selectorModel - provide the x value.
     * @param {(SVGElement | HTMLCanvasElement)} selectorElement - provide the y value.
     *
     * @private
     */
    //(EJ2-66036)- Annotation interaction not rendered properly
    public renderSelectorForAnnotation(selectorModel: Selector, selectorElement: (SVGElement | HTMLCanvasElement)): void {
        this.diagramRenderer.renderResizeHandle(
            selectorModel.wrapper.children[0], selectorElement, selectorModel.thumbsConstraints,
            this.scroller.currentZoom, selectorModel.constraints, this.scroller.transform, undefined,
            canMove(selectorModel.annotation), undefined, undefined, selectorModel.handleSize);
    }

    /**
     * drawSelectionRectangle method \
     *
     * @returns { void }     drawSelectionRectangle method .\
     * @param {number} x - provide the x value.
     * @param {number} y - provide the y value.
     * @param {number} width - provide the width value.
     * @param {number} height - provide the height value.
     *
     * @private
     */
    public drawSelectionRectangle(x: number, y: number, width: number, height: number): void {
        this.clearSelectorLayer();
        this.diagramRenderer.drawSelectionRectangle(x, y, width, height, this.adornerLayer, this.scroller.transform);
    }
    /**
     * renderHighlighter method \
     *
     * @returns { void }     renderHighlighter method .\
     * @param {DiagramElement} element - provide the node value.
     *
     * @private
     */
    public renderHighlighter(element: DiagramElement): void {
        const adornerSvg: SVGElement = getAdornerLayerSvg(this.element.id);
        this.diagramRenderer.renderHighlighter(element, adornerSvg, this.scroller.transform);
    }


    /**
     * clearHighlighter method \
     *
     * @returns { void }     clearHighlighter method .\
     *
     * @private
     */
    public clearHighlighter(): void {
        const adornerSvg: SVGElement = getAdornerLayerSvg(this.element.id);
        const highlighter: SVGElement =
            (adornerSvg as SVGSVGElement).getElementById(adornerSvg.id + '_highlighter') as SVGElement;
        if (highlighter) {
            highlighter.parentNode.removeChild(highlighter);
        }
    }

    /**
     * getNodesConnectors method \
     *
     * @returns { (NodeModel | ConnectorModel)[] }     getNodesConnectors method .\
     * @param {(NodeModel | ConnectorModel)[]} selectedItems - provide the node value.
     *
     * @private
     */
    public getNodesConnectors(selectedItems: (NodeModel | ConnectorModel)[]): (NodeModel | ConnectorModel)[] {
        for (let i: number = 0; i < this.nodes.length; i++) {
            const node: NodeModel = this.nodes[parseInt(i.toString(), 10)];
            selectedItems.push(node);
        }
        for (let i: number = 0; i < this.connectors.length; i++) {
            const conn: ConnectorModel = this.connectors[parseInt(i.toString(), 10)];
            selectedItems.push(conn);
        }
        return selectedItems;
    }

    /**
     * clearSelectorLayer method \
     *
     * @returns { void }     clearSelectorLayer method .\
     *
     * @private
     */
    public clearSelectorLayer(): void {
        const adornerSvg: SVGElement = getAdornerLayerSvg(this.element.id);
        const innertemplate: HTMLCollection = document.getElementsByClassName('blazor-inner-template');
        let i: number;
        let div: HTMLElement;

        let j: number;

        if (!this.currentSymbol) {
            const selectionRect: SVGElement =
                (adornerSvg as SVGSVGElement).getElementById(this.adornerLayer.id + '_selected_region') as SVGElement;
            if (selectionRect) {
                selectionRect.parentNode.removeChild(selectionRect);
            }
            this.clearHighlighter();
            const childNodes: NodeList = getSelectorElement(this.element.id).childNodes;
            let child: SVGElement;
            //Bug 914365: Node is not resizable using touch interaction
            //Added below code to get the target which we are dragging using touch interaction
            let handleId: string = this.eventHandler.touchArgs ? this.eventHandler.touchArgs.target.id : undefined;
            if (handleId && handleId.includes('bezierLine')) {
                handleId = undefined;
            }
            for (let i: number = childNodes.length; i > 0; i--) {
                //Added below code to prevent the removal of target element from DOM while doing touch move interaction
                if (this.eventHandler && this.eventHandler.touchArgs && this.eventHandler.touchArgs.type === 'touchmove') {
                    this.diagramRenderer.touchMove = true;
                    if (!(handleId && handleId === (childNodes[i - 1] as HTMLElement).id)) {
                        child = childNodes[i - 1] as SVGElement;
                        child.parentNode.removeChild(child);
                    }
                } else {
                    child = childNodes[i - 1] as SVGElement;
                    child.parentNode.removeChild(child);
                }
            }
            //Removed isBlazor code
            if (!isBlazor()) {
                const templates: NodeList = getUserHandleLayer(this.element.id).childNodes;
                for (i = templates.length; i > 0; i--) {
                    (templates[i - 1] as HTMLElement).parentNode.removeChild(templates[i - 1]);
                }
            }
        } else {
            const symbolBorder: SVGElement = (adornerSvg as SVGSVGElement).getElementById('borderRect_symbol') as SVGElement;
            if (symbolBorder) { symbolBorder.parentNode.removeChild(symbolBorder); }
        }
    }

    /**
     * getWrapper method \
     *
     * @returns { void }     getWrapper method .\
     * @param {GroupableView} nodes - provide the node value.
     * @param {string} id - provide the childernCollection value.
     *
     * @private
     */
    public getWrapper(nodes: GroupableView, id: string): DiagramElement {
        let wrapper: DiagramElement;
        id = nodes.id + '_' + id;
        const container: GroupableView = nodes instanceof Canvas ? nodes : this.getPortContainer(this.nameTable[nodes.id]);
        for (let i: number = 0; i < container.children.length; i++) {
            if (id === container.children[parseInt(i.toString(), 10)].id) {
                wrapper = container.children[parseInt(i.toString(), 10)];
            }
        }
        return wrapper;
    }

    /**
     * DiagramElement method \
     *
     * @returns { void }     getEndNodeWrapper method .\
     * @param {NodeModel | ConnectorModel} node - provide the node value.
     * @param {ConnectorModel} connector - provide the childernCollection value.
     * @param {boolean} source - provide the childernCollection value.
     *
     * @private
     */
    public getEndNodeWrapper(node: NodeModel | ConnectorModel, connector: ConnectorModel, source: boolean): DiagramElement {
        if (node.shape.type === 'Bpmn' && node.wrapper.children[0] instanceof Canvas) {
            if ((!isBlazor() && (node.shape as BpmnShape).shape === 'Activity')) {
                if (source && (node.shape as BpmnShape).activity.subProcess.type === 'Transaction'
                    && connector.sourcePortID) {
                    const portId: string = connector.sourcePortID;
                    const parent: Canvas = ((node.wrapper.children[0] as Canvas).children[0] as Canvas).children[2] as Canvas;
                    if (parent.children) {
                        for (const child of parent.children) {
                            if (child.visible && child.id === node.id + '_' + portId) {
                                return (child as Canvas).children[0];
                            }
                        }
                    }
                }
                return ((node.wrapper.children[0] as Canvas).children[0] as Canvas).children[0];
            }
            if ((node.shape as BpmnShape).shape === 'Group') {
                return node.wrapper.children[0];
            }
            return (node.wrapper.children[0] as Canvas).children[0];
        }
        const firstChild: DiagramElement = node.wrapper.children[0];
        if (firstChild && !this.containsMargin(firstChild) && (!(node as Node).children || (node as Node).children.length === 0)) {
            return firstChild;
        }
        return node.wrapper;
    }
    private containsMargin(node: DiagramElement): Boolean {
        return node.margin && (node.margin.left !== 0 || node.margin.top !== 0 || node.margin.right !== 0 || node.margin.bottom !== 0);
    }

    private focusOutEdit(): void {
        this.endEdit();
        // EJ2-57743 - Added below code to refresh the diagram layer after the annotation gets edited in canvas mode.
        if (this.mode === 'Canvas' && this.scroller.currentZoom !== 1) {
            this.refreshDiagramLayer();
        }
    }

    private endEditCommand(): void {
        this.endEdit();
        this.textEditing = false;
        // EJ2-57743 - Added below code to refresh the diagram layer after the annotation gets edited in canvas mode.
        if (this.mode === 'Canvas' && this.scroller.currentZoom !== 1) {
            this.refreshDiagramLayer();
        }
    }
    // EJ2-866418-keyboard shortcut keys method starting
    //Change the text style of nodes,swimlane,textnode
    private fontStyleCommand(format: string): void {
        for (let i: number = 0; i < this.selectedItems.nodes.length; i++) {
            const node: NodeModel = this.selectedItems.nodes[parseInt(i.toString(), 10)];
            if (node.shape.type === 'SwimLane') {
                if ((node.shape as SwimLane).hasHeader) {
                    this.applyStyleText(format, (node.shape as SwimLane).header.annotation);
                }
            }
            if ((node as SwimLane).isLane) {
                const laneHeader: NodeModel = this.getObject((node.shape as LaneModel).header[0].id);
                this.applyStyle(format, laneHeader.annotations);
            }
            if (node.shape.type === 'Text') {
                const textNode: NodeModel = node;
                this.applyStyleText(format, textNode);
            }
            if (node.annotations.length > 0) {
                const annotationLength: ShapeAnnotationModel[] = node.annotations;
                this.applyStyle(format, annotationLength);
            }
        }

        for (let i: number = 0; i < this.selectedItems.connectors.length; i++) {
            if (this.selectedItems.connectors[parseInt(i.toString(), 10)].annotations.length > 0) {
                const annotationLength: PathAnnotationModel[] = this.selectedItems.connectors[parseInt(i.toString(), 10)].annotations;
                this.applyStyle(format, annotationLength);
            }
        }
    }
    private applyStyle(format: string, annotationLength: ShapeAnnotationModel[] | PathAnnotationModel[]): void {
        for (let j: number = 0; j < annotationLength.length; j++) {
            switch (format) {
            case 'bold':
                annotationLength[parseInt(j.toString(), 10)].style.bold = !annotationLength[parseInt(j.toString(), 10)].style.bold;
                break;
            case 'italic':
                annotationLength[parseInt(j.toString(), 10)].style.italic = !annotationLength[parseInt(j.toString(), 10)].style.italic;
                break;
            case 'underline':
                if (annotationLength[parseInt(j.toString(), 10)].style.textDecoration === 'None') {
                    annotationLength[parseInt(j.toString(), 10)].style.textDecoration = 'Underline';
                }
                else if (annotationLength[parseInt(j.toString(), 10)].style.textDecoration === 'Underline') {
                    annotationLength[parseInt(j.toString(), 10)].style.textDecoration = 'None';
                }
                break;
            }
        }
        this.dataBind();
    }
    private applyStyleText(format: string, textNode: any): void {
        switch (format) {
        case 'bold':
            textNode.style.bold = !textNode.style.bold;
            break;
        case 'italic':
            textNode.style.italic = !textNode.style.italic;
            break;
        case 'underline':
            if (textNode.style.textDecoration === 'None') {
                textNode.style.textDecoration = 'Underline';
            }
            else if (textNode.style.textDecoration === 'Underline') {
                textNode.style.textDecoration = 'None';
            }
            break;
        }
        this.dataBind();
    }

    //To duplicate the elements on clicking Ctrl+D
    private duplicateCommand(): void {
        let selectedItems: (NodeModel | ConnectorModel)[] = [];
        selectedItems = selectedItems.concat(this.selectedItems.nodes, this.selectedItems.connectors);
        this.copy();
        this.paste();
    }
    //To group and ungroup the elements
    private groupCommand(group: string): void {
        switch (group) {
        case 'group':
            this.group();
            break;
        case 'ungroup':
            this.unGroup();
            break;
        }
    }
    //To rotate clockwise and anti-clockwise the elements
    private rotateCommand(rotateValue: string): void {
        const selectedItems: SelectorModel = this.selectedItems;
        switch (rotateValue) {
        case 'clockwise':
            this.rotate(selectedItems, 90);
            break;
        case 'antiClockwise':
            this.rotate(selectedItems, -90);
            break;
        }
    }
    //To flip horizontally and vertically the elements
    private flipCommand(flipValue: string): void {
        let selectedItems: (NodeModel | ConnectorModel)[] = [];
        selectedItems = selectedItems.concat(this.selectedItems.nodes, this.selectedItems.connectors);
        for (let i: number = 0; i < selectedItems.length; i++) {
            switch (flipValue) {
            case 'horizontal':
                selectedItems[parseInt(i.toString(), 10)].flip = FlipDirection.Horizontal;
                break;
            case 'vertical':
                selectedItems[parseInt(i.toString(), 10)].flip = FlipDirection.Vertical;
                break;
            }
        }
        this.dataBind();
    }

    //To exceute the tool commands
    private toolCommand(tool: string): void {
        switch (tool) {
        case 'pointer': {
            this.tool = DiagramTools.Default;
            this.dataBind();
            break;
        }
        case 'text': {
            const textnode: NodeModel = {
                shape: { type: 'Text' } as TextModel
            };
            this.drawingObject = textnode;
            this.tool = DiagramTools.DrawOnce;
            this.dataBind();
            break;
        }
        case 'connect': {
            const connectors: ConnectorModel = {
                id: 'connector1',
                type: 'Straight'
            };
            this.drawingObject = connectors;
            this.tool = DiagramTools.DrawOnce;
            this.dataBind();
            break;
        }
        case 'freeForm': {
            const freeform: ConnectorModel = { id: 'connector1', type: 'Freehand' };
            this.drawingObject = freeform;
            this.tool = DiagramTools.DrawOnce;
            this.dataBind();
            break;
        }
        case 'line': {
            const polyline: ConnectorModel = { id: 'connector1', type: 'Polyline' };
            this.drawingObject = polyline;
            this.tool = DiagramTools.DrawOnce;
            this.dataBind();
            break;
        }
        case 'rectangle': {
            const drawingshape: BasicShapeModel = { type: 'Basic', shape: 'Rectangle' };
            const basicNode: NodeModel = {
                shape: drawingshape
            };
            this.drawingObject = basicNode;
            this.tool = DiagramTools.DrawOnce;
            this.dataBind();
            break;
        }
        case 'ellipse': {
            const drawingNode: BasicShapeModel = { type: 'Basic', shape: 'Ellipse' };
            const ellipseNode: NodeModel = {
                shape: drawingNode
            };
            this.drawingObject = ellipseNode;
            this.tool = DiagramTools.DrawOnce;
            this.dataBind();
            break;
        }
        }
    }

    //To zoomin and zoom-out the diagram
    private zoomCommand(zoomValue: string): void {
        switch (zoomValue) {
        case 'zoomIn':
            this.zoomTo({ type: 'ZoomIn', zoomFactor: 0.2 });
            break;
        case 'zoomOut':
            this.zoomTo({ type: 'ZoomOut', zoomFactor: 0.2 });
            break;
        }
    }

    //To move the diagram elements five pixel based on the arrow keys
    private shiftCommand(direction: string): void {
        if (this.selectedItems instanceof Selector && this.selectedItems.wrapper
            && this.constraints & DiagramConstraints.RestrictNegativeAxisDragDrop) {
            const bounds: Rect = this.selectedItems.wrapper.bounds;
            if (bounds) {
                if (direction === 'Left' && bounds.x - 5 < 0) {
                    return;
                }
                if (direction === 'Top' && bounds.y - 5 < 0) {
                    return;
                }
            }
        }
        let tx: number = 0; let ty: number = 0;
        const pixel: number = 5;
        let negativeDirection: boolean;
        if (direction === 'Left' || direction === 'Right') {
            negativeDirection = (direction === 'Left');
            tx = (negativeDirection ? -pixel : pixel);
        } else {
            negativeDirection = (direction === 'Up');
            ty = (negativeDirection ? -pixel : pixel);
        }
        const obj: SelectorModel = this.selectedItems;
        const annotation: DiagramElement = this.selectedItems.wrapper.children[0];
        if (annotation instanceof TextElement) {
            this.commandHandler.labelDrag(obj.nodes[0], annotation, tx, ty);
        } else {
            this.drag(obj, tx, ty);
        }
        for (let i: number = 0; i < this.selectedItems.connectors.length; i++) {
            const connector: SelectorModel = this.selectedItems;
            if (direction === 'Up') {
                this.drag(connector, 0, -5);
            }
            else if (direction === 'Down') {
                this.drag(connector, 0, 5);
            }
            else if (direction === 'Left') {
                this.drag(connector, -5, 0);
            }
            else if (direction === 'Right') {
                this.drag(connector, 5, 0);
            }
        }
    }
    //To execute the text align
    private alignCommand(alignDirection: string): void {
        if (this.selectedItems.nodes.length > 0) {
            for (let i: number = 0; i < this.selectedItems.nodes.length; i++) {
                this.updateNodesAndConnectorAnnotation(this.selectedItems.nodes[parseInt(i.toString(), 10)], alignDirection);
            }
        }
    }
    private updateNodesAndConnectorAnnotation(object: NodeModel | ConnectorModel, alignDirection: string): void {
        let annotation: ShapeAnnotationModel | PathAnnotationModel;
        for (let i: number = 0; i < object.annotations.length; i++) {
            annotation = object.annotations[parseInt(i.toString(), 10)];
            switch (alignDirection) {
            case 'left':
                annotation.horizontalAlignment = 'Left';
                break;
            case 'center':
                annotation.horizontalAlignment = 'Center';
                break;
            case 'right':
                annotation.horizontalAlignment = 'Right';
                break;
            case 'justify':
                annotation.style.textAlign = 'Justify';
                break;
            case 'top':
                annotation.verticalAlignment = 'Top';
                break;
            case 'centerVertical':
                annotation.verticalAlignment = 'Center';
                break;
            case 'bottom':
                annotation.verticalAlignment = 'Bottom';
                break;
            }
            this.dataBind();
        }
    }
    //To execute ordercommands using keyboard shortcuts
    private orderCommand(orderCommand: string): void {
        switch (orderCommand) {
        case 'sendToBack':
            this.sendToBack();
            break;
        case 'bringToFront':
            this.bringToFront();
            break;
        case 'sendBackward':
            this.sendBackward();
            break;
        case 'bringForward':
            this.moveForward();
            break;
        }
    }
    //To execute the selection of elements on clicking tab key
    private navigateItems(tabCommand: boolean): void {
        let currentSelectedNodeIndex: number = 0;
        const lastZIndex: number = (this.activeLayer as Layer).objectZIndex;
        let selectedItems: (NodeModel | ConnectorModel)[] = [];
        let selectables: (NodeModel | ConnectorModel)[] = [];
        selectedItems = selectedItems.concat(this.selectedItems.nodes, this.selectedItems.connectors);
        selectables = selectables.concat(this.nodes, this.connectors);
        if (selectedItems.length > 0) {
            currentSelectedNodeIndex = selectedItems[0].zIndex + (tabCommand ? 1 : -1);
        }
        else {
            currentSelectedNodeIndex = tabCommand ? 0 : lastZIndex;
        }
        if (currentSelectedNodeIndex < 0) {
            currentSelectedNodeIndex = lastZIndex;
        } else if (currentSelectedNodeIndex > lastZIndex) {
            currentSelectedNodeIndex = 0;
        }
        let isSelected: boolean = false;
        do {
            for (let i: number = 0; i < selectables.length; i++) {
                const nextObject: (NodeModel | ConnectorModel) = selectables[parseInt(i.toString(), 10)];
                if (currentSelectedNodeIndex === nextObject.zIndex) {
                    this.clearSelection();
                    this.select([nextObject]);
                    isSelected = true;
                    break; // Exit the loop once a node or connector is selected
                }
            }
            if (!isSelected) {
                if (tabCommand) {
                    currentSelectedNodeIndex++;  // If no selection has been made, increment currentSelectedNodeIndex for Tab command
                }
                else {
                    currentSelectedNodeIndex--;  // If no selection has been made, decrement currentSelectedNodeIndex for shift + Tab
                }
            }
        }
        while (!isSelected);
    }

    /**
     * @private
     */
    /* tslint:disable */
    public async endEdit(): Promise<void> {
        if (this.diagramActions & DiagramAction.TextEdit) {
            const blazor: string = 'Blazor'; const blazorInterop: string = 'sfBlazor';
            let oldValues: Object; let changedvalues: Object; const annotations: Object = {};
            this.enableServerDataBinding(false);
            //Removed isBlazor code
            const textArea: HTMLTextAreaElement = (document.getElementById(this.element.id + '_editBox') as HTMLTextAreaElement);
            if (!isBlazor()) {
                let text: string = textArea.value;
                EventHandler.remove(textArea, 'input', this.eventHandler.inputChange);
                EventHandler.remove(textArea, 'focusout', this.focusOutEdit);
                const element: HTMLElement = document.getElementById(this.element.id + '_editTextBoxDiv');
                let node: NodeModel;
                node = this.nameTable[this.activeLabel.parentId];
                const annotation: ShapeAnnotationModel | PathAnnotationModel | TextModel = findAnnotation(node, this.activeLabel.id);
                // eslint-disable-next-line max-len
                const args: ITextEditEventArgs | IBlazorTextEditEventArgs = { oldValue: this.activeLabel.text, newValue: text, cancel: false, element: node, annotation: annotation };
                //Removed isBlazor code
                element.parentNode.removeChild(element);
                let textWrapper: DiagramElement;
                if (annotation && !(annotation instanceof Text)) {
                    // eslint-disable-next-line max-len
                    const index: string = findObjectIndex(node as NodeModel, (annotation as ShapeAnnotationModel | PathAnnotationModel).id, true);
                    annotations[`${index}`] = { content: annotation.content };
                    oldValues = { annotations: annotations };
                } else {
                    //Removed isBlazor code
                    oldValues = { shape: { content: (node.shape as TextModel).content } };
                }
                let deleteNode: boolean = false;
                if (this.eventHandler['currentAction'] === 'Draw') {
                    deleteNode = this.eventHandler.isAddTextNode(node as Node, true);
                }
                if (!deleteNode && (element.textContent !== text || text !== this.activeLabel.text)) {
                    //Removed isBlaor code
                    this.triggerEvent(DiagramEvent.textEdit, args);
                }
                if (!textWrapper) {
                    textWrapper = this.getWrapper(node.wrapper, this.activeLabel.id);
                }
                let contentModified = false;
                // 970529: Exception Thrown When Editing Node Annotation where id has underscore
                if (annotation && annotation.content !== text && !args.cancel) {
                    contentModified = true;
                    if (!this.activeLabel.isGroup) {
                        this.startGroupAction();
                    }
                    if ((node as Node).parentId && this.nameTable[(node as Node).parentId].shape.type === 'UmlClassifier'
                        && text.indexOf('+') === -1 && text.indexOf('-') === -1 && text.indexOf('#') === -1
                        && text.indexOf('~') === -1 && node.id.indexOf('_umlClass_header') === -1) {
                        text = ' + ' + text;
                    }
                    if ((node as Node).isLane || (node as Node).isPhase) {
                        this.protectPropertyChange(true);
                    }
                    if (!(annotation instanceof Text)) {
                        // eslint-disable-next-line max-len
                        const index: string = findObjectIndex(node as NodeModel, (annotation as ShapeAnnotationModel | PathAnnotationModel).id, true);
                        const changesAnnotation: Object = {};
                        changesAnnotation[`${index}`] = { content: text };
                        changedvalues = { annotations: changesAnnotation };
                    }
                    else {
                        //Removed isBlazor code
                        changedvalues = { shape: { content: text } };
                    }
                    const nodeIndex: string = this.getIndex(node, node.id);
                    if (nodeIndex) {
                        const oldnodes = {};
                        oldnodes[`${nodeIndex}`] = oldValues;
                        const newnodes = {};
                        newnodes[`${nodeIndex}`] = changedvalues;
                        if (getObjectType(node) === Node) {
                            this.onPropertyChanged({ nodes: newnodes } as DiagramModel, { nodes: oldnodes } as DiagramModel);
                        } else {
                            this.onPropertyChanged({ connectors: newnodes } as DiagramModel, { connectors: oldnodes } as DiagramModel);
                        }
                    }
                    this.protectPropertyChange(true);
                    //Removed isBlazor code
                    annotation.content = text;
                    this.protectPropertyChange(false);
                    this.updateSelector();
                    if ((node as Node).isLane || (node as Node).isPhase) {
                        this.protectPropertyChange(false);
                    }
                }
                if (deleteNode) {
                    this.removeObjectsFromLayer(node);
                    this.removeFromAQuad(node as IElement);
                    delete this.nameTable[this.activeLabel.parentId];
                    if (text !== '') {
                        this.clearSelection();
                        const clonedObject: Object = cloneObject(node);
                        node = this.add(clonedObject) as Node;
                        this.updateDiagramObject(node);
                        this.commandHandler.oldSelectedObjects = cloneSelectedObjects(this);
                        this.commandHandler.select(this.nameTable[node.id]);
                        // this.commandHandler.updateBlazorSelector();
                    }
                }
                if (this.selectedItems.nodes.length) {
                    let selectedNode: Node = this.nameTable[this.activeLabel.parentId];
                    let swimLaneNode: Node = this.nameTable[selectedNode.parentId];
                    if ((swimLaneNode && swimLaneNode.shape.type === 'SwimLane') || (selectedNode.shape.type === 'SwimLane')) {
                        const laneHeader: string = 'LaneHeaderParent'; const phaseHeader: string = 'PhaseHeaderParent';
                        if ((selectedNode.shape.type === 'SwimLane')) {
                            swimLaneNode = this.nameTable[this.activeLabel.parentId]; selectedNode = node as Node;
                        }
                        if ((selectedNode.isLane || selectedNode.isPhase)) {
                            const collection: (PhaseModel | LaneModel)[] = selectedNode.isLane ?
                                (swimLaneNode.shape as SwimLaneModel).lanes : (swimLaneNode.shape as SwimLaneModel).phases;
                            for (let j: number = 0; j < collection.length; j++) {
                                if (collection[parseInt(j.toString(), 10)].id === (selectedNode[`${laneHeader}`] || selectedNode[`${phaseHeader}`])) {
                                    collection[parseInt(j.toString(), 10)].header.annotation.content = selectedNode.annotations[0].content;
                                }
                            }

                        } else if (selectedNode.isHeader && (swimLaneNode.shape as SwimLane).hasHeader) {
                            (swimLaneNode.shape as SwimLaneModel).header.annotation.content = selectedNode.annotations[0].content;
                        }
                    }
                    this.dataBind();
                }
                textWrapper.visible = true;
                this.updateDiagramObject(node);
                this.diagramActions = this.diagramActions & ~DiagramAction.TextEdit;
                if (this.activeLabel.isGroup || contentModified) {
                    this.endGroupAction();
                }
                this.activeLabel = { id: '', parentId: '', isGroup: false, text: undefined };
                this.commandHandler.getBlazorOldValues();
                //Removed isBlazor code
                this.enableServerDataBinding(true);
            }
        }
    }


    /**
     * getIndex method \
     *
     * @returns { void }     getIndex method .\
     * @param {NodeModel | ConnectorModel} node - provide the node value.
     * @param {string} id - provide the childernCollection value.
     *
     * @private
     */
    public getIndex(node: NodeModel | ConnectorModel, id: string) {
        //let index: number;
        const collection: (NodeModel | ConnectorModel)[] = (getObjectType(node) === Node) ? this.nodes : this.connectors;
        for (let i: number = 0; i < collection.length; i++) {
            if (collection[parseInt(i.toString(), 10)].id.toString() === id.toString()) {
                return i.toString();
            }
        }
        return null;
    }
    /* tslint:enable */

    //Removed getBlazorTextEditArgs method

    /**
     * canLogChange method \
     *
     * @returns { void }     canLogChange method .\
     *
     * @private
     */
    public canLogChange(): boolean {
        if ((this.diagramActions & DiagramAction.Render) && (!(this.diagramActions & DiagramAction.ToolAction)) &&
            (!(this.diagramActions & DiagramAction.UndoRedo)) && (!(this.diagramActions & DiagramAction.PublicMethod))) {
            return true;
        } else {
            return false;
        }
    }

    private modelChanged(newProp: DiagramModel, oldProp: DiagramModel): boolean {
        if (newProp.connectors || oldProp.connectors || newProp.nodes || oldProp.connectors
            || newProp.pageSettings || oldProp.pageSettings || newProp.bridgeDirection || oldProp.bridgeDirection) {
            return true;
        }
        return false;
    }

    private resetDiagramActions(action?: DiagramAction): void {
        const isAction: boolean = action ? true : false;
        if (this.diagramActions & DiagramAction.UndoRedo && (!isAction || (action === DiagramAction.UndoRedo))) {
            this.diagramActions = this.diagramActions & ~DiagramAction.UndoRedo;
        }
        if (this.diagramActions & DiagramAction.PublicMethod && (!isAction || action === DiagramAction.PublicMethod)) {
            this.diagramActions = this.diagramActions & ~DiagramAction.PublicMethod;
        }
    }

    /**
     * removeNode method \
     *
     * @returns { void }     removeNode method .\
     * @param {NodeModel} node - provide the node value.
     * @param {NodeModel} childrenCollection - provide the childrenCollection value.
     *
     * @private
     */
    public removeNode(node: NodeModel, childrenCollection: string[]): void {
        this.removeObjectsFromLayer(node);
        this.removeFromAQuad(this.nameTable[node.id]);
        const groupElement: HTMLElement = document.getElementById(node.id + '_groupElement');
        delete this.nameTable[node.id];
        if ((node as NodeModel).children) {
            delete this.groupTable[node.id];
        }
        //Removed isBlazor code
        this.nodes.splice(this.nodes.indexOf(node as NodeModel), 1);
        if (groupElement && groupElement.children && groupElement.children.length > 0) {
            let beforeElement: Element = undefined;
            for (let j: number = groupElement.children.length - 1; j >= 0; j--) {
                const childElement: Element = groupElement.children[parseInt(j.toString(), 10)];
                //EJ2-863636 - Nodes Removed from Diagram upon Ungrouping
                if (childrenCollection.length > 0 && childrenCollection.indexOf(childElement.id.split('_groupElement')[0]) !== -1) {
                    if (!beforeElement) {
                        groupElement.parentNode.insertBefore(childElement, groupElement);
                    } else {
                        groupElement.parentNode.insertBefore(childElement, beforeElement);
                    }
                    beforeElement = childElement;
                }
            }
        }
        if (groupElement) {
            groupElement.parentNode.removeChild(groupElement);
        }
    }


    /**
     * deleteGroup method \
     *
     * @returns { void }     deleteGroup method .\
     * @param {NodeModel} node - provide the source value.
     *
     * @private
     */
    public deleteGroup(node: NodeModel): void {
        const elements: (NodeModel | ConnectorModel)[] = [];
        let tempNode: (NodeModel | ConnectorModel)[] = [];
        if (node.children) {
            tempNode = this.commandHandler.getChildren(node, elements);
        }
        this.UpdateBlazorDiagramModelCollection(node as Node);
        for (const nodes of tempNode) {
            if (nodes && this.nameTable[nodes.id]) {
                this.remove(nodes);
            }
        }
    }

    //helper methods - end region
    //property changes - start region
    /** @private */
    /**
     * updateObject method \
     *
     * @returns { void }     updateObject method .\
     * @param {Node | Connector} actualObject - provide the source value.
     * @param {Node | Connector} oldObject - provide the target value.
     * @param {Node | Connector} changedProp - provide the layoutOrientation value.
     *
     * @private
     */
    public updateObject(actualObject: Node | Connector, oldObject: Node | Connector, changedProp: Node | Connector): void {
        if (!(this.diagramActions & DiagramAction.ToolAction)) {
            const bound: Rect = actualObject.wrapper.children[0].bounds;
            const checkBoundaryConstraints: boolean = this.commandHandler.checkBoundaryConstraints(undefined, undefined, bound, true);
            if (!checkBoundaryConstraints) {
                if (actualObject instanceof Node) {
                    const oldNode: Node = oldObject as Node;
                    for (const key of Object.keys(changedProp)) {
                        switch (key) {
                        case 'width':
                            actualObject.width = oldNode.width;
                            break;
                        case 'height':
                            actualObject.height = oldNode.height;
                            break;
                        case 'offsetX':
                            actualObject.offsetX = oldNode.offsetX;
                            break;
                        case 'offsetY':
                            actualObject.offsetY = oldNode.offsetY;
                            break;
                        case 'rotateAngle':
                            actualObject.rotateAngle = oldNode.rotateAngle;
                            break;
                        }
                    }
                    this.nodePropertyChange(actualObject, changedProp as Node, oldObject as Node);
                } else {
                    for (const key of Object.keys(changedProp)) {
                        const oldConnector: Connector = oldObject as Connector;
                        const actualSourcePoint: PointModel = actualObject.sourcePoint;
                        const actualTargetPoint: PointModel = actualObject.targetPoint;
                        switch (key) {
                        case 'sourcePoint':
                            actualSourcePoint.x = oldConnector.sourcePoint.x || actualSourcePoint.x;
                            actualSourcePoint.y = oldConnector.sourcePoint.y || actualSourcePoint.y;
                            break;
                        case 'targetPoint':
                            actualTargetPoint.x = oldConnector.targetPoint.x || actualTargetPoint.x;
                            actualTargetPoint.y = oldConnector.targetPoint.y || actualTargetPoint.y;
                        }

                    }
                    this.connectorPropertyChange(actualObject, changedProp as Connector, oldObject as Connector);
                }
            }
        }
    }

    private nodePropertyChangeExtend(actualObject: Node, oldObject: Node, node: Node, update: boolean): boolean {
        if (node.style !== undefined && actualObject.shape.type !== 'Bpmn') {
            updateStyle(node.style, actualObject.wrapper.children[0]);
            update = true;
        }
        if (node.shadow !== undefined) {
            this.updateShadow(actualObject.shadow, node.shadow);
            update = true;
        }
        if (node.constraints !== undefined) {
            if ((oldObject.constraints & NodeConstraints.Select) &&
                (!(node.constraints & NodeConstraints.Select)) && isSelected(this, actualObject)) {
                this.clearSelection();
            } else {
                this.updateThumbConstraints(this.selectedItems.nodes, this.selectedItems);
                this.updateSelector();
                update = true;
            }
        }
        this.updateTextAnnotationInSwimlane(actualObject, node);
        this.swimLaneNodePropertyChange(actualObject, oldObject, node, update);
        return update;
    }
    //To update text annotation node inside swimlane while dragging the text annotation parent.
    private updateTextAnnotationInSwimlane(actualObject: NodeModel, node: Node): void {
        if ((actualObject as any).hasTextAnnotation && (this as any).isPositionUndo) {
            for (let i: number = 0; i < (actualObject as Node).outEdges.length; i++) {
                const con: ConnectorModel = this.nameTable[(actualObject as Node).outEdges[parseInt(i.toString(), 10)]];
                if ((con as any).isBpmnAnnotationConnector) {
                    const textNode: Node = this.nameTable[con.targetID];
                    this.isProtectedOnChange = true;
                    if ((actualObject as any).laneMargin && textNode) {
                        const dx: number = actualObject.margin.left - (actualObject as any).laneMargin.left;
                        const dy: number = actualObject.margin.top - (actualObject as any).laneMargin.top;
                        textNode.margin.left += dx; textNode.margin.top += dy;
                        textNode.offsetX += dx; textNode.offsetY += dy;
                        textNode.wrapper.offsetX += dx; textNode.wrapper.offsetY += dy;
                        textNode.wrapper.measure(new Size(textNode.wrapper.width, textNode.wrapper.height));
                        textNode.wrapper.arrange(textNode.wrapper.desiredSize);
                        this.updateDiagramObject(textNode);
                    }
                    this.isProtectedOnChange = false;
                }
            }
        }
    }

    /* tslint:disable */
    private swimLaneNodePropertyChange(actualObject: Node, oldObject: Node, node: Node, update: boolean): boolean {
        if ((actualObject.shape.type === 'SwimLane' || actualObject.shape.type === 'Container') && !this.currentSymbol) {
            if (oldObject.shape) {
                const shape: SwimLaneModel = node.shape as SwimLaneModel;
                const actualShape: SwimLaneModel = actualObject.shape as SwimLaneModel;
                const orientation: boolean = (actualShape.orientation === 'Horizontal') ? true : false;
                const padding: number = (actualShape as SwimLane).padding; const oldShape: SwimLaneModel = oldObject.shape as SwimLaneModel;
                const grid: GridPanel = actualObject.wrapper.children[0] as GridPanel;
                let oldObjects: NodeModel; let newObjects: NodeModel; let id: string;
                if (oldShape.lanes || oldShape.phases) {
                    if (oldShape.lanes) {
                        for (const count of Object.keys(shape.lanes)) {
                            const indexValue: number = Number(count);
                            const lane: LaneModel = oldShape.lanes[parseInt(indexValue.toString(), 10)];
                            let laneIndex: number; const newLane: LaneModel = shape.lanes[parseInt(indexValue.toString(), 10)];
                            if (newLane && newLane.header) {
                                id = actualShape.lanes[parseInt(indexValue.toString(), 10)].header.id;
                                oldObjects = lane.header; newObjects = newLane.header;
                                // EJ2-913790  Save Load for header font change won't be as saved
                                if ((newObjects as HeaderModel).annotation && (newObjects as HeaderModel).annotation.content) {
                                    this.nameTable[`${id}`].annotations[0].content = (newObjects as HeaderModel).annotation.content;
                                }
                                if ((newObjects as HeaderModel).annotation && (newObjects as HeaderModel).annotation.style) {
                                    this.nameTable[`${id}`].annotations[0].style = (newObjects as HeaderModel).annotation.style;
                                }
                                // 945079: Swimlane Diagram Header and Phase Annotations Alignment Not Working properly
                                if ((newObjects as HeaderModel).annotation && (newObjects as HeaderModel).annotation.offset) {
                                    this.nameTable[`${id}`].annotations[0].offset = (newObjects as HeaderModel).annotation.offset;
                                }
                                this.nodePropertyChange(this.nameTable[`${id}`], oldObjects as Node, newObjects as Node);
                            }
                            if (lane.children) {
                                for (const childNodeIndex of Object.keys(lane.children)) {
                                    id = actualShape.lanes[parseInt(indexValue.toString(), 10)].children[Number(childNodeIndex)].id;
                                    const node: Node = this.nameTable[`${id}`]; oldObjects = lane.children[Number(childNodeIndex)];
                                    newObjects = (newLane as LaneModel).children[Number(childNodeIndex)];
                                    this.nodePropertyChange(node, oldObjects as Node, newObjects as Node);
                                    const parent: Node = this.nameTable[node.parentId];
                                    //943622-update max width and height of lane child is not working properly
                                    if (!(this.diagramActions & DiagramAction.UndoRedo)) {
                                        this.startGroupAction();
                                        updateLaneBoundsAfterAddChild(parent, actualObject, node, this);
                                    }
                                }
                                this.updateSelector();
                            }
                            if (lane.width && !orientation) {
                                laneIndex = (actualShape.phases && actualShape.phaseSize) ? indexValue + 1 : indexValue;
                                grid.updateColumnWidth(laneIndex, newLane.width, true, padding);
                                this.updateDiagramElementQuad();
                            }
                            if (lane.height && orientation) {
                                laneIndex = (actualShape.header && (actualShape as SwimLane).hasHeader) ? indexValue + 1 : indexValue;
                                laneIndex += (actualShape.phases && actualShape.phaseSize) ? 1 : 0;
                                grid.updateRowHeight(laneIndex, newLane.height, true, padding);
                                this.updateDiagramElementQuad();
                            }
                        }
                    }
                    if (shape.phases) {
                        for (const key of Object.keys(shape.phases)) {
                            const indexValue: number = Number(key);
                            const phase: PhaseModel = shape.phases[parseInt(indexValue.toString(), 10)]; let size: number;
                            const rowIndex: number = (actualShape.header && (actualShape as SwimLane).hasHeader) ? 1 : 0;
                            if (phase && phase.header) {
                                id = actualShape.phases[parseInt(indexValue.toString(), 10)].header.id;
                                oldObjects = oldShape.phases[parseInt(indexValue.toString(), 10)].header; newObjects = phase.header;
                                // EJ2-913790  Save Load for header font change won't be as saved
                                if ((newObjects as HeaderModel).annotation && (newObjects as HeaderModel).annotation.content) {
                                    this.nameTable[`${id}`].annotations[0].content = (newObjects as HeaderModel).annotation.content;
                                }
                                if ((newObjects as HeaderModel).annotation && (newObjects as HeaderModel).annotation.style) {
                                    this.nameTable[`${id}`].annotations[0].style = (newObjects as HeaderModel).annotation.style;
                                }
                                // 945079: Swimlane Diagram Header and Phase Annotations Alignment Not Working properly
                                if ((newObjects as HeaderModel).annotation && (newObjects as HeaderModel).annotation.offset) {
                                    this.nameTable[`${id}`].annotations[0].offset = (newObjects as HeaderModel).annotation.offset;
                                }
                                this.nodePropertyChange(this.nameTable[`${id}`], oldObjects as Node, newObjects as Node);
                            }
                            if (phase.offset) {
                                if (indexValue === 0) { size = phase.offset; } else {
                                    const previousPhase: PhaseModel = actualShape.phases[indexValue - 1];
                                    size = phase.offset - previousPhase.offset;
                                    if (size <= 0) { size = phase.offset; }
                                }
                                if (orientation) {
                                    grid.updateColumnWidth(indexValue, size, true, padding);
                                    updatePhaseMaxWidth(actualObject, this,
                                                        grid.rows[parseInt(
                                                            rowIndex.toString(), 10)].cells[parseInt(indexValue.toString(), 10)],
                                                        indexValue);
                                } else { grid.updateRowHeight(rowIndex + indexValue, size, true, padding); }
                            }
                        }
                    }
                }
                if (shape.phaseSize !== undefined && actualShape.phases.length) {
                    if (shape.phaseSize === 0 || oldShape.phaseSize === 0) {
                        if (oldShape.phaseSize) {
                            if (orientation) {
                                grid.removeRow((actualShape.header && (actualShape as SwimLane).hasHeader) ? 1 : 0);
                                actualObject.height = actualObject.wrapper.height = grid.height;
                            } else {
                                if (actualShape.header && (actualShape as SwimLane).hasHeader) {
                                    grid.rows[0].cells[1].children = grid.rows[0].cells[0].children;
                                    grid.rows[0].cells[1].columnSpan = grid.rows[0].cells[0].columnSpan - 1;
                                    grid.rows[0].cells[0].children = [];
                                }
                                grid.removeColumn(0);
                            }
                        } else {
                            if (orientation) {
                                const rowDef: RowDefinition = new RowDefinition(); rowDef.height = shape.phaseSize;
                                grid.addRow((actualShape.header && (actualShape as SwimLane).hasHeader) ? 1 : 0, rowDef, true);
                                actualObject.height = actualObject.wrapper.height += shape.phaseSize;
                            } else {
                                const colDef: ColumnDefinition = new ColumnDefinition();
                                colDef.width = shape.phaseSize;
                                grid.addColumn(0, colDef, true);
                                if (actualShape.header && (actualShape as SwimLane).hasHeader) {
                                    grid.rows[0].cells[0].children = grid.rows[0].cells[1].children;
                                    grid.rows[0].cells[1].children = []; grid.rows[0].cells[1].columnSpan = 1;
                                    grid.rows[0].cells[1].minWidth = undefined;
                                    grid.rows[0].cells[0].columnSpan = actualShape.lanes.length + 1;
                                }
                            }
                            for (let k: number = 0; k < actualShape.phases.length; k++) {
                                if (actualShape.phases[parseInt(k.toString(), 10)].id === '') { actualShape.phases[parseInt(k.toString(), 10)].id = randomId(); }
                                phaseDefine(
                                    grid, this, actualObject,
                                    (actualShape.header && (actualShape as SwimLane).hasHeader) ? 1 : 0, orientation, k);
                            }
                        }
                    } else {
                        if (orientation) {
                            grid.updateRowHeight(
                                (actualShape.header && (actualShape as SwimLane).hasHeader) ? 1 : 0, shape.phaseSize, false);
                        } else { grid.updateColumnWidth(0, shape.phaseSize, false); }
                    }
                }
                if (actualShape.header && (actualShape as SwimLane | Container).hasHeader && oldShape.header) {
                    let id: string;
                    if (actualObject.shape.type === 'SwimLane') {
                        id = grid.rows[0].cells[0].children[0].id;
                    } else if (actualObject.shape.type === 'Container') {
                        id = grid.children[1].id;
                    }
                    newObjects = shape.header;
                    oldObjects = oldShape.header;
                    // 945079: Swimlane Diagram Header and Phase Annotations Alignment Not Working properly
                    if ((newObjects as HeaderModel).annotation && (newObjects as HeaderModel).annotation.offset) {
                        this.nameTable[`${id}`].annotations[0].offset = (newObjects as HeaderModel).annotation.offset;
                    }
                    this.nodePropertyChange(this.nameTable[`${id}`], oldObjects as Node, newObjects as Node);
                }
                // 969733 : Container Node Moves Irregularly When Editing Header Annotation and Resizing Container
                actualObject.height = grid.height;
                actualObject.width = grid.width;
                if (actualObject.shape.type === 'SwimLane') {
                    actualObject.wrapper.height = grid.height;
                    actualObject.wrapper.width = grid.width;
                }
            } else if (oldObject.constraints) {
                const oldSelectConstraints = (oldObject.constraints & NodeConstraints.Select);
                const newSelectConstraints = (node.constraints & NodeConstraints.Select);
                if (oldSelectConstraints !== newSelectConstraints) {
                    const shape = actualObject.shape as SwimLaneModel;

                    // Header - constraints
                    const headerNode: NodeModel = this.nameTable[actualObject.id + shape.header.id];
                    headerNode.constraints = (!newSelectConstraints) ? headerNode.constraints & ~NodeConstraints.Select :
                        headerNode.constraints | NodeConstraints.Select;

                    // Phase - Constraints
                    let phaseNode: NodeModel;
                    if (shape.phaseSize > 0) {
                        for (let i: number = 0; i < shape.phases.length; i++) {
                            phaseNode = this.nameTable[actualObject.id + shape.phases[parseInt(i.toString(), 10)].id + '_header'];
                            phaseNode.constraints = (!newSelectConstraints) ? phaseNode.constraints & ~NodeConstraints.Select :
                                phaseNode.constraints | NodeConstraints.Select;
                        }
                    }

                    // Header - Constraints
                    let laneNode: NodeModel; let laneHeader: NodeModel;
                    const value: number = shape.phases.length || 1;
                    for (let i: number = 0; i < shape.lanes.length; i++) {
                        for (let l: number = 0; l < value; l++) {
                            laneNode = this.nameTable[actualObject.id + shape.lanes[parseInt(i.toString(), 10)].id + l];
                            laneNode.constraints = (!newSelectConstraints) ? laneNode.constraints & ~NodeConstraints.Select :
                                laneNode.constraints | NodeConstraints.Select;
                            if (l === 0) {
                                laneHeader = this.nameTable[actualObject.id + shape.lanes[parseInt(i.toString(), 10)].id + '_' + l + '_header'];
                                laneHeader.constraints = (!newSelectConstraints) ? laneHeader.constraints & ~NodeConstraints.Select :
                                    laneHeader.constraints | NodeConstraints.Select;
                            }
                        }
                    }
                }
            }
            update = true;
        }
        return update;
    }

    /** @private */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public insertValue(oldNodeObject: any, isNode: boolean): void {
        if (!(this.blazorActions & BlazorAction.GroupClipboardInProcess)) {
            let value: boolean;
            const oldObjects: (Node | Connector)[] = isNode ? this.oldNodeObjects : this.oldConnectorObjects;
            for (let i: number = 0; i < oldObjects.length; i++) {
                if (oldObjects[parseInt(i.toString(), 10)].id === oldNodeObject.id) {
                    value = true;
                }
            }
            if (!value) {
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                isNode ? (this.oldNodeObjects.push(oldNodeObject as Node)) : this.oldConnectorObjects.push(oldNodeObject as Connector);
            }
        }
    }

    /* tslint:disable */
    /** @private */
    // eslint-disable-next-line max-len
    public nodePropertyChange(actualObject: Node, oldObject: Node, node: Node, isLayout?: boolean, rotate?: boolean, propertyChange?: boolean): void {
        if (this.canEnableBlazorObject && actualObject.id !== 'helper') {
            const node: Object = cloneObject(actualObject);
            this.insertValue(node, true);
        }
        const existingBounds: Rect = actualObject.wrapper.outerBounds; const existingInnerBounds: Rect = actualObject.wrapper.bounds;
        let updateConnector = false;

        let i: number; let j: number; let offsetX: number; let offsetY: number; let update: boolean;

        let tx: number; let ty: number;
        let oldBpmnOffsetX = 0;
        let newBpmnOffsetX = 0;
        let oldBpmnOffsetY = 0;
        let newBpmnOffsetY = 0;
        let sizeChanged: boolean = false;
        let offsetChanged: boolean = false;
        let angleChanged: boolean = false;
        if (node.width !== undefined) {
            if (!actualObject.children) {
                actualObject.wrapper.children[0].width = node.width; update = true; updateConnector = true;
                //953540-swimlane scale method does not update properly break
                if (actualObject.shape.type === 'SwimLane') {
                    actualObject.wrapper.width = node.width;
                }
            }
            else if (!actualObject.container) {
                this.scaleObject(actualObject, node.width, true);
            } else {
                actualObject.wrapper.width = node.width;
            }
            sizeChanged = true;
        }
        if (node.height !== undefined) {
            if (!actualObject.children) {
                actualObject.wrapper.children[0].height = node.height; update = true; updateConnector = true;
                //953540-swimlane scale method does not update properly break
                if (actualObject.shape.type === 'SwimLane') {
                    actualObject.wrapper.height = node.height;
                    // 943621 - undo redo of updating height of swimlane is not working.
                    if (actualObject.shape.type === 'SwimLane' && this.isUndo) {
                        const swimlane: SwimLaneModel = actualObject.shape as SwimLaneModel;
                        if (swimlane.header && (swimlane as SwimLane).hasHeader) {
                            const grid: GridPanel = actualObject.wrapper.children[0] as GridPanel;
                            const padding: number = (swimlane as SwimLane).padding;
                            const heightDiff: number = oldObject.height - node.height;
                            const rowDefinitions: RowDefinition[] = grid.rowDefinitions();
                            const lastRowIndex: number = rowDefinitions.length - 1;
                            const adjustedHeight: number = rowDefinitions[parseInt(lastRowIndex.toString(), 10)].height - heightDiff;
                            grid.updateRowHeight(lastRowIndex, adjustedHeight, true, padding, true);
                        }
                    }

                }
            } else if (!actualObject.container) {
                this.scaleObject(actualObject, node.height, false);
            } else {
                actualObject.wrapper.height = node.height;
            }
            sizeChanged = true;
        }
        update = this.nodePropertyChangeExtend(actualObject, oldObject, node, update);
        if (node.constraints !== undefined && canShadow(oldObject) !== canShadow(node)) {
            actualObject.wrapper.children[0].shadow = canShadow(actualObject) ? actualObject.shadow : null;
        }
        if (node.offsetX !== undefined) {
            oldBpmnOffsetX = oldObject.offsetX;
            newBpmnOffsetX = node.offsetX;
            if (actualObject.wrapper.flip !== FlipDirection.None) {
                if (actualObject.offsetX !== actualObject.wrapper.offsetX && oldObject.offsetX !== undefined) {
                    const offsetX = node.offsetX - oldObject.offsetX;
                    actualObject.wrapper.offsetX = actualObject.wrapper.offsetX + offsetX;
                    this.updateFlipOffset(actualObject.wrapper, offsetX, 0, actualObject.wrapper.flip);
                }
                //EJ2-895070: Flipping and moving the node are not working properly
                else {
                    actualObject.wrapper.offsetX = node.offsetX;
                }
            } else {
                actualObject.wrapper.offsetX = node.offsetX;
            }
            update = true;
            updateConnector = true;
            offsetChanged = true;
        }
        if (node.offsetY !== undefined) {
            oldBpmnOffsetY = oldObject.offsetY;
            newBpmnOffsetY = node.offsetY;
            if (actualObject.wrapper.flip !== FlipDirection.None) {
                if (actualObject.offsetY !== actualObject.wrapper.offsetY && oldObject.offsetY !== undefined) {
                    const offsetY = node.offsetY - oldObject.offsetY;
                    actualObject.wrapper.offsetY = actualObject.wrapper.offsetY + offsetY;
                    this.updateFlipOffset(actualObject.wrapper, 0, offsetY, actualObject.wrapper.flip);
                }
                //EJ2-895070: Flipping and moving the node are not working properly
                else {
                    actualObject.wrapper.offsetY = node.offsetY;
                }
            } else {
                actualObject.wrapper.offsetY = node.offsetY;
            }
            update = true;
            updateConnector = true;
            offsetChanged = true;
        }
        if (node.padding !== undefined) {
            actualObject.wrapper.padding.left = node.padding.left !== undefined ? node.padding.left : actualObject.wrapper.padding.left;
            actualObject.wrapper.padding.right = node.padding.right !== undefined ? node.padding.right : actualObject.wrapper.padding.right;
            actualObject.wrapper.padding.top = node.padding.top !== undefined ? node.padding.top : actualObject.wrapper.padding.top;
            actualObject.wrapper.padding.bottom = node.padding.bottom !== undefined ? node.padding.bottom
                : actualObject.wrapper.padding.bottom;
            update = true;
        }
        if (node.pivot !== undefined) {
            actualObject.wrapper.pivot = node.pivot; update = true;
        }
        if (node.minWidth !== undefined) {
            actualObject.wrapper.minWidth = actualObject.wrapper.children[0].minWidth = node.minWidth; update = true;
            updateConnector = true;
            sizeChanged = true;
        }
        if (node.minHeight !== undefined) {
            actualObject.wrapper.minHeight = actualObject.wrapper.children[0].minHeight = node.minHeight; update = true;
            updateConnector = true;
            sizeChanged = true;
        }
        if (node.maxWidth !== undefined) {
            actualObject.wrapper.maxWidth = node.maxWidth; update = true;
            updateConnector = true;
            sizeChanged = true;
        }
        if (node.maxHeight !== undefined) {
            actualObject.wrapper.maxHeight = node.maxHeight; update = true;
            updateConnector = true;
            sizeChanged = true;
        }
        if (this.isNotContainerOrSubProcess(actualObject) && this.isNotSwimlaneObject(actualObject)) {
            if (node.flip !== undefined) {
                const horizontal: boolean = ((node.flip & FlipDirection.Horizontal) ^
                    (actualObject.wrapper.flip & FlipDirection.Horizontal)) === FlipDirection.Horizontal;
                const vertical: boolean = ((node.flip & FlipDirection.Vertical) ^
                    (actualObject.wrapper.flip & FlipDirection.Vertical)) === FlipDirection.Vertical;
                if (horizontal) {
                    actualObject.wrapper.flip ^=  FlipDirection.Horizontal;
                }
                if (vertical) {
                    actualObject.wrapper.flip ^= FlipDirection.Vertical;
                }
                update = true;
                updateConnector = true;
                if (actualObject.children) {
                    const connectorInGroup: string[] = actualObject.children.filter((con: string)=>this.nameTable[`${con}`] &&
                        this.nameTable[`${con}`] instanceof Connector);
                    if (connectorInGroup && connectorInGroup.length > 0) {
                        this.groupBounds = actualObject.wrapper.bounds;
                    } else {
                        this.groupBounds = null;
                    }
                } else {
                    this.groupBounds = null;
                }
                alignElement(actualObject.wrapper, actualObject.offsetX, actualObject.offsetY, this, undefined, horizontal, vertical);
                // Rotates the object after a flip only if exactly one of the directions (horizontal or vertical) is true.
                // This ensures that the rotation is applied only when a single flip is performed, not both or none.
                if (horizontal !== vertical) {
                    rotateAfterFlip(actualObject, this);
                }
                //To update the port and text wrapper element flip
                this.updateWrapperChildFlip(actualObject);
            }
            if (node.flipMode !== undefined) {
                let changeFlipMode: string = '';
                changeFlipMode = actualObject.wrapper.flipMode = node.flipMode;
                update = true;
                updateConnector = true;
                //To update the port and text wrapper element flip mode
                this.updateWrapperChildFlip(actualObject, changeFlipMode as FlipMode);
            }
        }
        if (node.rotateAngle !== undefined && (actualObject.constraints & NodeConstraints.Rotate)) {
            if (actualObject.children && rotate) {
                // eslint-disable-next-line max-len
                this.commandHandler.rotateObjects(actualObject, [actualObject], actualObject.rotateAngle - actualObject.wrapper.rotateAngle, { x: actualObject.offsetX, y: actualObject.offsetY }, false);
            }
            actualObject.wrapper.rotateAngle = node.rotateAngle; update = true;
            updateConnector = true;
            angleChanged = true;
            if (actualObject.processId || (actualObject.parentId && this.nameTable[actualObject.parentId].shape.type === 'Container')) {
                const changes: any = cloneObject(actualObject);
                let target: Node;
                if (actualObject.processId) {
                    target = this.nameTable[actualObject.processId];
                } else {
                    target = this.nameTable[actualObject.parentId];
                }
                changes.margin.top = (actualObject.offsetY - (actualObject.actualSize.height / 2))
                    - (target.offsetY - (target.actualSize.height / 2));
                changes.margin.left = (actualObject.offsetX - (actualObject.actualSize.width / 2))
                    - (target.offsetX - (target.actualSize.width / 2));
                if (changes.margin.left !== actualObject.margin.left || changes.margin.top !== actualObject.margin.top) {
                    this.updateMargin(actualObject, changes);
                }
            }
        }
        if (node.backgroundColor !== undefined) {
            actualObject.wrapper.style.fill = node.backgroundColor;
        }
        if (node.visible !== undefined) { this.updateElementVisibility(actualObject.wrapper, actualObject as Node, actualObject.visible); }
        if (node.shape !== undefined && actualObject.shape.type !== 'Bpmn') {
            update = true; updateShape(node, actualObject, oldObject, this);
            updateConnector = true;
        }
        if (node.margin) {
            update = true;
            this.updateMargin(actualObject, node);
            if (actualObject.parentId && this.nameTable[actualObject.parentId].shape.type === 'Container') {
                updateChildWrapper(actualObject, this);
            }
            updateConnector = true;
            offsetChanged = true;
        }
        if ((((node.shape !== undefined && (node.shape.type === undefined)) || node.width !== undefined ||
            node.maxWidth !== undefined || node.minWidth !== undefined || node.maxHeight !== undefined ||
            node.minHeight !== undefined || node.height !== undefined || node.style !== undefined)
            && actualObject.shape.type === 'Bpmn' && this.bpmnModule)) {
            update = true;
            updateConnector = true;
            this.bpmnModule.updateBPMN(node, oldObject, actualObject, this);
        }
        if (((node.width !== undefined || node.height !== undefined) && actualObject.shape.type === 'Container')) {
            update = true;
            setSizeForContainer(node, oldObject, actualObject, ((actualObject.wrapper as Canvas).children[0] as Canvas), this);
        }
        if (((node.style !== undefined) && actualObject.shape.type === 'Container')) {
            update = true;
            updateStyle(node.style, ((actualObject.wrapper as Canvas).children[0] as Canvas).children[0]);
        }
        if (actualObject.shape.type === 'UmlActivity' && ((!isBlazor() && (actualObject.shape as UmlActivityShapeModel).shape === 'FinalNode'))) {
            update = true;
            updateConnector = true;
            this.updateUMLActivity(node, oldObject, actualObject, this);
        }
        if ((actualObject.shape && actualObject.shape.type === 'UmlClassifier') || (actualObject.parentId &&
            this.nameTable[actualObject.parentId] && this.nameTable[actualObject.parentId].shape.type === 'UmlClassifier')) {
            update = true;
            updateConnector = true;
        }
        if (node.ports !== undefined) {
            for (const key of Object.keys(node.ports)) {
                const index: number = Number(key); update = true; const changedObject: PointPortModel = node.ports[`${key}`];
                const actualPort: PointPortModel = actualObject.ports[parseInt(index.toString(), 10)];
                this.updatePort(changedObject, actualPort, actualObject.wrapper);
                if(actualObject.flip !== FlipDirection.None) {
                    if (actualObject.flipMode === 'Port' || actualObject.flipMode === 'PortAndLabel' || actualObject.flipMode === 'PortAndLabelText' || actualObject.flipMode === 'All') {
                        this.updatePorts(actualObject,actualObject.flip);
                    }
                }
                updateConnector = true;
            }
        }
        if ((node as HeaderModel).annotation !== undefined || node.annotations !== undefined || node.width !== undefined) {
            for (const key of Object.keys(node.annotations || actualObject.annotations)) {
                const index: number = Number(key); update = true;
                let changedObject: ShapeAnnotationModel;
                if ((node as HeaderModel).annotation) {
                    changedObject = (node as HeaderModel).annotation;
                } else {
                    changedObject = node.annotations ? node.annotations[`${key}`] : actualObject.annotations;
                }
                const actualAnnotation: ShapeAnnotationModel = actualObject.annotations[parseInt(index.toString(), 10)];
                if (actualAnnotation) {
                    const updateSize: boolean = actualObject.width ? true : false;
                    this.updateAnnotation(changedObject, actualAnnotation, actualObject.wrapper, actualObject, updateSize);
                    const swimLaneNode: Node = this.nameTable[actualObject.parentId];
                    if ((swimLaneNode && swimLaneNode.shape.type === 'SwimLane')) {
                        const laneHeader: string = 'LaneHeaderParent';
                        const phaseHeader: string = 'PhaseHeaderParent';
                        if ((actualObject.isLane || actualObject.isPhase)) {
                            const collection: (PhaseModel | LaneModel)[] = actualObject.isLane ?
                                (swimLaneNode.shape as SwimLaneModel).lanes : (swimLaneNode.shape as SwimLaneModel).phases;
                            for (let j: number = 0; j < collection.length; j++) {
                                if (collection[parseInt(j.toString(), 10)].id === (actualObject[`${laneHeader}`] || actualObject[`${phaseHeader}`])) {
                                    collection[parseInt(j.toString(), 10)].header.annotation.content = actualObject.annotations[0].content;
                                    collection[parseInt(j.toString(), 10)].header.annotation.style = actualObject.annotations[0].style;
                                    //EJ2-957840: Annotation position changes after interaction and perform save and load
                                    collection[parseInt(j.toString(), 10)].header.annotation.offset.x =
                                        actualObject.annotations[0].offset.x;
                                    collection[parseInt(j.toString(), 10)].header.annotation.offset.y =
                                        actualObject.annotations[0].offset.y;
                                    collection[parseInt(j.toString(), 10)].header.annotation.width = actualObject.annotations[0].width;
                                    collection[parseInt(j.toString(), 10)].header.annotation.height = actualObject.annotations[0].height;
                                    break;
                                }
                            }
                        }
                        //EJ2-957840: Annotation position changes after interaction and perform save and load
                        else if (actualObject.isHeader) {
                            (swimLaneNode.shape as SwimLaneModel).header.annotation.offset.x = actualObject.annotations[0].offset.x;
                            (swimLaneNode.shape as SwimLaneModel).header.annotation.offset.y = actualObject.annotations[0].offset.y;
                            (swimLaneNode.shape as SwimLaneModel).header.annotation.rotateAngle = actualObject.annotations[0].rotateAngle;
                            (swimLaneNode.shape as SwimLaneModel).header.annotation.width = actualObject.annotations[0].width;
                            (swimLaneNode.shape as SwimLaneModel).header.annotation.height = actualObject.annotations[0].height;
                        }
                    }
                    // 969381: restrict child  annotation applied for container header
                    else if (swimLaneNode && (swimLaneNode.shape as Container).type === 'Container' && actualObject.isHeader) {
                        const header: HeaderModel = (swimLaneNode.shape as Container).header;
                        header.annotation.content = actualObject.annotations[0].content;
                        header.annotation.offset = actualObject.annotations[0].offset;
                        header.annotation.width = actualObject.annotations[0].width;
                        header.annotation.height = actualObject.annotations[0].height;
                        header.annotation.rotateAngle = actualObject.annotations[0].rotateAngle;
                    }
                }
            }
        }
        if (node.expandIcon !== undefined || node.collapseIcon !== undefined || node.isExpanded !== undefined) {
            this.updateIcon(actualObject); this.updateDefaultLayoutIcons(actualObject);
            if (node.isExpanded !== undefined) {
                this.canExpand = true;
                //EJ2-844814 - Expand and collapse not working properly at runtime
                this.diagramActions |= DiagramAction.PreventIconsUpdate;
                this.commandHandler.expandNode(actualObject, this);
                this.diagramActions = this.diagramActions & ~DiagramAction.PreventIconsUpdate;
            }
            update = true;
            this.canExpand = false;
        }
        if (node.fixedUserHandles !== undefined) {
            let index: number;
            let changedObject: NodeFixedUserHandleModel;
            let actualfixedUserHandle: NodeFixedUserHandleModel;
            for (const key of Object.keys(node.fixedUserHandles)) {
                index = Number(key); update = true;
                if (node.fixedUserHandles[parseInt(index.toString(), 10)]) {
                    changedObject = node.fixedUserHandles[parseInt(index.toString(), 10)];
                }
                actualfixedUserHandle = actualObject.fixedUserHandles[parseInt(index.toString(), 10)];
                if (actualfixedUserHandle) {
                    this.updateNodefixedUserHandle(changedObject, actualfixedUserHandle, actualObject.wrapper, actualObject);
                }
            }
        }

        if (node.tooltip !== undefined) { this.updateTooltip(actualObject, node); }
        if (update) {
            if (this.bpmnModule !== undefined && ((offsetChanged && !sizeChanged && !(this as any).sizeUndo) || (sizeChanged && actualObject.shape.type === 'Bpmn' && (actualObject.shape as BpmnShape).shape !== 'TextAnnotation')) && !angleChanged) {
                // eslint-disable-next-line max-len
                this.updateBpmnAnnotationPosition(oldBpmnOffsetX, oldBpmnOffsetY, newBpmnOffsetX, newBpmnOffsetY, actualObject, actualObject.wrapper, (actualObject.shape as BpmnShape), (actualObject.shape as BpmnShape).shape === 'TextAnnotation',oldObject, sizeChanged, (this as any).sizeUndo);
            }
            if (this.checkSelectedItem(actualObject) && actualObject.wrapper.children[0] instanceof TextElement) {
                (actualObject.wrapper.children[0] as TextElement).refreshTextElement();
            }
            actualObject.wrapper.measure(new Size(actualObject.wrapper.bounds.width, actualObject.wrapper.bounds.height), actualObject.id,
                                         this.onLoadImageSize.bind(this));
            actualObject.wrapper.arrange(actualObject.wrapper.desiredSize); this.updateObject(actualObject, oldObject, node);
            if (actualObject.shape.type === 'SwimLane' && !this.currentSymbol && !(this.diagramActions & DiagramAction.ToolAction)) {
                updateHeaderMaxWidth(this, actualObject);
                const grid: GridPanel = actualObject.wrapper.children[0] as GridPanel;
                const shape: SwimLaneModel = actualObject.shape as SwimLaneModel;
                const column: number = grid.columnDefinitions().length;
                if (shape.orientation === 'Horizontal') {
                    const index: number = (shape.header && (shape as SwimLane).hasHeader) ? 1 : 0;
                    updatePhaseMaxWidth(actualObject, this, grid.rows[parseInt(index.toString(), 10)].cells[column - 1], column - 1);
                }
                actualObject.wrapper.measure(new Size(actualObject.wrapper.bounds.width, actualObject.wrapper.bounds.height));
                actualObject.wrapper.arrange(actualObject.wrapper.desiredSize);
            }
            if ((!(this.diagramActions & DiagramAction.ToolAction)) || (this.diagramActions & DiagramAction.UndoRedo)) {
                if (this.checkSelectedItem(actualObject)) {
                    this.updateSelector();
                }
            }
            if (existingBounds.equals(existingBounds, actualObject.wrapper.outerBounds) === false) {
                this.updateQuad(actualObject);
                // EJ2-57436 - Added the below code to check if node has parent id or not.
                // If node has parentId means then send the parent node to updatequad method to add the parent node in negative quadrant
                if (actualObject.parentId && this.nameTable[actualObject.parentId]) {
                    const parentNode: NodeModel = this.nameTable[actualObject.parentId];
                    this.updateQuad(parentNode as IElement);
                }
            }
            if (!isLayout) {
                // eslint-disable-next-line max-len
                this.commandHandler.connectorSegmentChange(actualObject, existingInnerBounds, (node.rotateAngle !== undefined) ? true : false);
                // if (updateConnector) {
                //     this.updateConnectorEdges(actualObject);
                // }
            } else {
                if (actualObject && actualObject.visible && actualObject.outEdges) {
                    this.updateIconVisibility(actualObject, (actualObject.outEdges.length === 0 ? false : true));
                }
            }
            if (this.bpmnModule !== undefined) {
                this.bpmnModule.updateDocks(actualObject, this);
            }
            if (actualObject.shape instanceof Container) {
                updateContainerDocks(actualObject, this);
            }
            if (((!node.annotations && !actualObject.isHeader) || (!actualObject.processId && !(actualObject.parentId
                 && this.nameTable[actualObject.parentId].shape.type === 'Container'))) && node.flip === undefined) {
                this.updateGroupOffset(actualObject);
            }
            // if (existingBounds.equals(existingBounds, actualObject.wrapper.outerBounds) === false) { this.updateQuad(actualObject); }

            // EJ2-42005 - The parent of the actualObject is not measured and arranged when a node or connector is selected.
            // The condition restricts the measure and arrange of the actualObject whenever a node or connector is selected.
            // Commented @Dheepshiva
            // let objects: (NodeModel | ConnectorModel)[] = [];
            // objects = objects.concat(this.selectedItems.nodes, this.selectedItems.connectors);
            // if (objects.length === 0) {
            if (actualObject.parentId && this.nameTable[actualObject.parentId]) {
                const parent: NodeModel = this.nameTable[actualObject.parentId];
                parent.wrapper.measure(new Size(parent.wrapper.width, actualObject.wrapper.height));
                parent.wrapper.arrange(parent.wrapper.desiredSize);

                parent.offsetX = parent.wrapper.offsetX;
                parent.offsetY = parent.wrapper.offsetY;
            }
            // }
            if (existingInnerBounds.equals(existingInnerBounds, actualObject.wrapper.bounds) === false) {
                if ((this.eventHandler as any).currentAction !== 'Drag') {
                    this.updateGroupSize(actualObject);
                }
                if (actualObject.children) { this.updateGroupOffset(actualObject); }
            }
            if (actualObject.shape.type === 'SwimLane' && !this.currentSymbol && (this.diagramActions & DiagramAction.Render)) {
                const connectors: string[] = getConnectors(this, (actualObject.wrapper.children[0] as GridPanel), undefined, true);
                updateConnectorsProperties(connectors, this);

            }
            if (!this.preventNodesUpdate) {
                if (!canVitualize(this) || (canVitualize(this) && this.scroller.oldCollectionObjects.indexOf(actualObject.id) > -1)) {
                    if (this.diagramActions & DiagramAction.PreventZIndexOnDragging) {
                        this.updateDiagramObject(actualObject as NodeModel, true);
                    } else {
                        this.updateDiagramObject(actualObject as NodeModel);
                    }
                    if (actualObject.parentId) {
                        const parent = this.nameTable[actualObject.parentId];
                        //Bug 967781: Addressed performance issues when dragging a group node containing multiple child nodes.
                        //Optimization: Suppressed the updateDiagramObject method call during group node drag operations to enhance performance.
                        if (parent.shape.type !== 'BPMN' && !(this.diagramActions & DiagramAction.isGroupDragging)) {
                            if (this.diagramActions & DiagramAction.PreventZIndexOnDragging) {
                                this.updateDiagramObject(parent, true);
                            }
                            else {
                                this.updateDiagramObject(parent);
                            }
                        }
                    }
                }
                if (!isLayout && updateConnector) {
                    if (this.lineRoutingModule && this.diagramActions && (this.constraints & DiagramConstraints.LineRouting) && actualObject.id !== 'helper') {
                        if (!(this.diagramActions & DiagramAction.ToolAction)) {
                            this.lineRoutingModule.renderVirtualRegion(this, true);
                        }
                    } else if (this.diagramActions && (this.constraints & DiagramConstraints.LineRouting) && actualObject.id !== 'helper') {
                        console.warn('[WARNING] :: Module "LineRouting" is not available in Diagram component! You either misspelled the module name or forgot to load it.');
                    }
                    this.updateConnectorEdges(actualObject);
                    if (actualObject.id !== 'helper' && !(this.diagramActions & DiagramAction.ToolAction)) {
                        const objects: Object[] = this.spatialSearch.findObjects(actualObject.wrapper.outerBounds as Rect);
                        for (let i: number = 0; i < objects.length; i++) {
                            const object: Object = objects[parseInt(i.toString(), 10)];
                            if (object instanceof Connector) {
                                this.connectorPropertyChange(objects[parseInt(i.toString(), 10)] as Connector, {} as Connector, {
                                    sourceID: (object as Connector).sourceID,
                                    targetID: (object as Connector).targetID,
                                    sourcePortID: (object as Connector).sourcePortID,
                                    targetPortID: (object as Connector).targetPortID,
                                    sourcePoint: (object as Connector).sourcePoint,
                                    targetPoint: (object as Connector).targetPoint
                                } as Connector);
                            }
                        }
                    }
                }
            }
            if (actualObject.status !== 'New' && this.diagramActions) {
                actualObject.status = 'Update';
            }
        }
        if (!propertyChange) {
            const element: NodeModel = actualObject;
            const args: IPropertyChangeEventArgs = {
                element: element, cause: this.diagramActions, diagramAction: this.getDiagramAction(this.diagramActions),
                oldValue: oldObject, newValue: node
            };
            //Removed isBlazor code
            this.triggerEvent(DiagramEvent.propertyChange, args);
        }
    }
    /**
     * Determines if any selected connector is connected to the specified node.
     *
     * @param {Node} node - The node to check for connection with selected connectors.
     * @returns { boolean } True if the node is connected to at least one selected connector; otherwise, false.
     *
     * @private
     */
    public hasSelectedConnector(node: Node): boolean {
        // Get selected connector IDs once for efficient lookup
        const selectedConIds: string[] = (this.selectedItems.connectors || []).map((con: Connector) => con.id);
        // Get connector IDs from outEdges and InEdges of node
        const connectorArray: string[] = (node.outEdges || []).concat(node.inEdges || []);
        // Check connectorArray contains selected connector
        if (connectorArray.some((id: string) => selectedConIds.indexOf(id) !== -1)) {
            return true;
        }
        return false;
    }
    private updateWrapperChildFlip(actualObject: Node, changeFlipMode?: FlipMode){
        if (actualObject && actualObject.children && actualObject.children.length > 0) {
            for (let i: number = 0; i < actualObject.children.length; i++) {
                const child: string = actualObject.children[parseInt(i.toString(), 10)];
                const updateNode = this.nameTable[`${child}`];
                let modifiedFlipMode: string = '';
                if (!changeFlipMode) {
                    modifiedFlipMode = updateNode.flipMode;
                } else {
                    modifiedFlipMode = changeFlipMode;
                    updateNode.wrapper.flipMode = modifiedFlipMode;
                    updateNode.flipMode = modifiedFlipMode;
                }
                if (modifiedFlipMode === 'None' || modifiedFlipMode === 'Label' || modifiedFlipMode === 'LabelText' || modifiedFlipMode === 'LabelAndLabelText') {
                    this.updatePorts(updateNode, FlipDirection.None);
                }
                else {
                    this.updatePorts(updateNode, updateNode.wrapper.flip);
                }
                //To update the wrapper of node with flip and flip mode.
                this.updateWrapperFlip(updateNode.wrapper, updateNode);
            }

        }
        changeFlipMode = actualObject.flipMode;
        if (changeFlipMode === 'None' || changeFlipMode === 'Label' || changeFlipMode === 'LabelText' || changeFlipMode === 'LabelAndLabelText') {
            this.updatePorts(actualObject, FlipDirection.None);
        }
        else {
            this.updatePorts(actualObject, actualObject.wrapper.flip);
        }
        let wrapperCanvas: Canvas;
        if (actualObject.children) {
            wrapperCanvas = actualObject.wrapper.children[actualObject.wrapper.children.length-1] as Canvas;
        } else {
            wrapperCanvas = actualObject.wrapper as Canvas;
        }
        wrapperCanvas.flip = actualObject.wrapper.flip;
        wrapperCanvas.flipMode = actualObject.flipMode;
        //To update the wrapper of node with flip and flip mode.
        this.updateWrapperFlip(wrapperCanvas, actualObject);
    }
    private updateWrapperFlip(wrapperCanvas: Canvas, obj: NodeModel) {
        for (let k: number = 0; k < wrapperCanvas.children.length;k++) {
            const wrapperChild: DiagramElement =  wrapperCanvas.children[parseInt(k.toString(), 10)];
            if (wrapperChild instanceof TextElement) {
                if (obj.flipMode !== 'None' && obj.flipMode !== 'Port') {
                    wrapperChild.flip = obj.wrapper.flip;
                    wrapperChild.flipMode = obj.flipMode;
                } else {
                    wrapperChild.flip = FlipDirection.None;
                }
            } else if (wrapperChild instanceof Canvas) {
                this.applyWrapperCanvasFlip(wrapperChild, obj);
            }
        }
    }
    //Get resize handle name based on the old and new size properties of node.
    private getResizeHandle(oldX: number, oldY: number, oldWidth: number, oldHeight: number,
                            newX: number, newY: number, newWidth: number, newHeight: number): string | null {
        const dx: number = newX - oldX;
        const dy: number = newY - oldY;
        const dw: number = newWidth - oldWidth;
        const dh: number = newHeight - oldHeight;
        if (dh === 0 && ((dx > 0 && dw > 0) || (dx < 0 && dw < 0))) {
            return  'ResizeEast';
        }
        if (dh=== 0 && ((dx > 0 && dw < 0) || (dx < 0 && dw > 0))) {
            return  'ResizeWest';
        }
        // **North & South Handles (Height Change Only)**
        if (dw === 0 && ((dy > 0 && dh < 0) || (dy < 0 && dh > 0))) {
            return 'ResizeNorth';
        }
        if (dw === 0 && ((dy > 0 && dh > 0) || (dy < 0 && dh < 0))) {
            return 'ResizeSouth';
        }

        // **Diagonal Resizing (Both Width & Height Change)**
        if (((dx > 0 && dw > 0) || (dx < 0 && dw < 0)) && ((dy > 0 && dh > 0) || (dy < 0 && dh < 0))) {
            return 'ResizeSouthEast'; // Bottom-right
        }
        if (((dx > 0 && dw < 0) || (dx < 0 && dw > 0)) && ((dy > 0 && dh > 0) || (dy < 0 && dh < 0))) {
            return 'ResizeSouthWest'; // Bottom-left
        }
        if (((dx > 0 && dw > 0) || (dx < 0 && dw < 0)) && ((dy > 0 && dh < 0) || (dy < 0 && dh > 0))) {
            return 'ResizeNorthEast'; // Top-right
        }
        if (((dx > 0 && dw < 0) || (dx < 0 && dw > 0)) && ((dy > 0 && dh < 0) || (dy < 0 && dh > 0))) {
            return 'ResizeNorthWest'; // Top-left
        }
        return null;
    }
    /**
     * To get new offset used to calculate the text annotation offset while resizing the parent node.
     * getTextAnnotationOffset method \
     *
     * @param {Node} actualObject - The current state of the parent node being resized.
     * @param {NodeModel} textAnnotation - The text annotation attached to the parent node.
     * @param {Node} oldObject - The previous state of the parent node before resizing.
     * @param {number} oldBpmnOffsetX - The previous X offset.
     * @param {number} oldBpmnOffsetY - The previous Y offset.
     * @returns { PointModel }    - Returns new offset
     *
     * @private
     */
    public getTextAnnotationOffset( actualObject: Node, textAnnotation: NodeModel, oldObject: Node,
                                    oldBpmnOffsetX: number, oldBpmnOffsetY: number) {
        const sx = actualObject.width - oldObject.width;
        const sy = actualObject.height - oldObject.height;
        const side: string = this.getTextAnnotationQuadrant(actualObject, textAnnotation);
        const resizeSide = this.getResizeHandle(oldObject.offsetX, oldObject.offsetY, oldObject.width, oldObject.height,
                                                actualObject.offsetX, actualObject.offsetY, actualObject.width, actualObject.height);
        let dx = 0;
        let dy = 0;
        const needsXAdjustment = (side: string) => {
            if (resizeSide === 'ResizeEast' || resizeSide === 'ResizeNorthEast' || resizeSide === 'ResizeSouthEast') {
                return side.includes('East');
            }
            if (resizeSide === 'ResizeWest' || resizeSide === 'ResizeNorthWest' || resizeSide === 'ResizeSouthWest') {
                return side.includes('West');
            }
            return false;
        };
        const needsYAdjustment = (side: string) => {
            if (resizeSide === 'ResizeSouth' || resizeSide === 'ResizeSouthWest' || resizeSide === 'ResizeSouthEast') {
                return side.includes('South');
            }
            if (resizeSide === 'ResizeNorth' || resizeSide === 'ResizeNorthWest' || resizeSide === 'ResizeNorthEast') {
                return side.includes('North');
            }
            return false;
        };
        if (needsXAdjustment(side)) {
            dx = (resizeSide.includes('West') ? -sx : sx);
        }
        if (needsYAdjustment(side)) {
            dy = (resizeSide.includes('North') ? -sy : sy);
        }
        return { x: oldBpmnOffsetX + dx, y: oldBpmnOffsetY + dy };
    }
    //To get which side the text annotation node is placed based on its parent node
    private getTextAnnotationQuadrant(parent: NodeModel, textAnnotation: NodeModel) {
        const left: number = parent.wrapper.bounds.left;
        const right: number  = parent.wrapper.bounds.right;
        const top: number  = parent.wrapper.bounds.top;
        const bottom: number  = parent.wrapper.bounds.bottom;
        const textX: number  = textAnnotation.wrapper.bounds.center.x;
        const textY: number  = textAnnotation.wrapper.bounds.center.y;
        // Check if exactly aligned with any edge
        if (textX >= left && textX <= right) {
            if (textY < top) {
                return 'North';
            }
            if (textY > bottom) {
                return 'South';
            }
        }
        if (textY >= top && textY <= bottom) {
            if (textX < left) {
                return 'West';
            }
            if (textX > right) {
                return 'East';
            }
        }
        // Quadrants
        if (textX < left && textY < top) {
            return 'NorthWest';
        }
        if (textX > right && textY < top) {
            return 'NorthEast';
        }
        if (textX < left && textY > bottom) {
            return 'SouthWest';
        }
        if (textX > right && textY > bottom) {
            return 'SouthEast';
        }
        return '';
    }
    //To update text annotation position while dragging the text annotation's parent node.
    private updateBpmnAnnotationPosition(oldX: number, oldY: number, newX: number, newY: number, node: NodeModel,
                                         wrapper: GroupableView, shape: BpmnShape, isTextAnnotation: boolean, oldObject: Node,
                                         sizeChanged: boolean, isUndo: boolean) {
        let x = newX > oldX ? Math.abs(newX - oldX) : Math.abs(oldX - newX);
        let y = newY > oldY ? Math.abs(newY - oldY) : Math.abs(oldY - newY);
        let laneX; let laneY;
        if ((x === 0 && y === 0) || (Number.isNaN(x) && Number.isNaN(y))) {
            if ((node as any).laneMargin) {
                laneX = node.margin.left - (node as any).laneMargin.left;
                laneY = node.margin.top - (node as any).laneMargin.top;
            }
        }
        const width = node.width;
        const height = node.height;
        let bounds: Rect = new Rect(0, 0, 0, 0);
        if (width !== 0 && height !== 0) {
            bounds = new Rect((newX !== 0 ? newX : node.offsetX) - width / 2,
                              (newY !== 0 ? newY : node.offsetY) - height / 2, width, height);
        }
        //To update text annotation position
        if (isTextAnnotation) {
            const bpmnAnnotation = shape;
            const hasTarget: boolean = bpmnAnnotation.textAnnotation.textAnnotationTarget !== '' && this.nameTable[bpmnAnnotation.textAnnotation.textAnnotationTarget];
            const selectedNode = this.selectedItems.nodes ? this.selectedItems.nodes[0] : undefined;
            const isTextNodeSelected = selectedNode && selectedNode.shape && (selectedNode.shape as BpmnShape).shape === 'TextAnnotation';
            if (hasTarget) {
                //To check whether the text annotation inside the swimlane
                if ((node as Node).parentId === '' || isTextNodeSelected) {

                    if (bpmnAnnotation.textAnnotation.textAnnotationDirection === 'Auto') {
                        if (wrapper.children[0] instanceof Canvas && (wrapper.children[0] as Canvas).children[0] instanceof PathElement) {
                            const diagramCanvas = (wrapper as any).children[0];
                            const parentElement = document.getElementById(diagramCanvas.id + '_groupElement');
                            const elementToRemove = document.getElementById(diagramCanvas.children[0].id + '_groupElement');
                            parentElement.removeChild(elementToRemove);
                            diagramCanvas.children.splice(0, 1);
                            this.isProtectedOnChange = true;
                            this.bpmnModule.setAnnotationPath(bounds, diagramCanvas, node,
                                                              bpmnAnnotation, bpmnAnnotation.textAnnotation.textAnnotationDirection, this);
                            this.isProtectedOnChange = false;
                        }
                    }
                } else {
                    (this as any).isPositionUndo = true;
                    this.updateTextAnnotationInSwimlane(node, node as Node);
                    (this as any).isPositionUndo = false;
                }
            }
            else {   //To update text annotation connector source point.
                if ((node as Node).inEdges.length > 0) {
                    const connectorID: string = (node as Node).inEdges[0];
                    const connector: Connector = this.nameTable[`${connectorID}`];
                    if (connector && (connector as any).isBpmnAnnotationConnector) {
                        connector.sourcePoint =
                        {
                            x: newX > oldX ? connector.sourcePoint.x + x : connector.sourcePoint.x - x,
                            y: newY > oldY ? connector.sourcePoint.y + y : connector.sourcePoint.y - y
                        };
                    }
                }
            }
            const newValue = { ports: [{ offset: node.ports[0].offset }] };
            //To update port offset of text annotation node
            this.nodePropertyChange(node as Node, {} as Node, newValue as Node);
        }
        else {
            for (const id of (node as Node).outEdges) {
                const connector: Connector = this.nameTable[`${id}`];
                if (connector && (connector as any).isBpmnAnnotationConnector) {
                    const targetNode: Node = this.nameTable[connector.targetID];
                    const textAnnotationTargetId: string = (targetNode.shape as BpmnShape).textAnnotation.textAnnotationTarget;
                    const textAnnotationTarget: Node = this.nameTable[`${textAnnotationTargetId}`];
                    if (sizeChanged && !isUndo) {
                        const newResizeOffset: PointModel = this.getTextAnnotationOffset(node as Node, targetNode, oldObject, oldX, oldY);
                        newX = newResizeOffset.x; newY = newResizeOffset.y;
                        x = newX > oldX ? Math.abs(newX - oldX) : Math.abs(oldX - newX);
                        y = newY > oldY ? Math.abs(newY - oldY) : Math.abs(oldY - newY);
                    }
                    if ((targetNode.shape as BpmnShape).shape === 'TextAnnotation' && !isSelected(this, targetNode)
                        && isSelected(this, textAnnotationTarget)) {
                        let oldValue; let newValue;
                        if ((node as any).isResized) {
                            oldValue = { margin: { left: targetNode.margin.left, top: targetNode.margin.top } };
                            const resizeOffset: PointModel = (node as any).resizeDif[targetNode.id];
                            if (resizeOffset) {
                                targetNode.margin.left += resizeOffset.x;
                                targetNode.margin.top += resizeOffset.y;
                                newValue = { margin: { left: targetNode.margin.left, top: targetNode.margin.top } };
                            }
                        }
                        else if (laneX !== undefined && laneY !== undefined) {
                            if (targetNode.parentId) {
                                oldValue = { margin: { left: targetNode.margin.left, top: targetNode.margin.top } };
                                targetNode.margin.left += laneX;
                                targetNode.margin.top += laneY;
                                newValue = { margin: { left: targetNode.margin.left, top: targetNode.margin.top } };
                            } else {
                                oldValue = { offsetX: targetNode.offsetX, offsetY: targetNode.offsetY };
                                targetNode.offsetX += laneX;
                                targetNode.offsetY += laneY;
                                newValue = { offsetX: targetNode.offsetX, offsetY: targetNode.offsetY };
                            }
                        } else {
                            oldValue = { offsetX: targetNode.offsetX, offsetY: targetNode.offsetY };
                            targetNode.offsetX = newX > oldX ? targetNode.offsetX + x : targetNode.offsetX - x;
                            targetNode.offsetY = newY > oldY ? targetNode.offsetY + y : targetNode.offsetY - y;
                            newValue = { offsetX: targetNode.offsetX, offsetY: targetNode.offsetY };
                        }

                        this.nodePropertyChange(targetNode, oldValue as Node, newValue as Node);
                    }
                }
            }
        }
    }

    private updatePorts(actualObject: Node, flip: FlipDirection): void {
        if (actualObject && actualObject.ports.length > 0) {
            for (const key of Object.keys(actualObject.ports)) {
                const index: number = Number(key);
                const actualPort: PointPortModel = actualObject.ports[parseInt(index.toString(), 10)];
                let portWrapper: DiagramElement = this.getWrapper(actualObject.wrapper, actualPort.id);
                portWrapper = updatePortEdges(portWrapper, flip, actualPort);
                portWrapper.relativeMode = 'Point';
                if (actualObject.wrapper.measureChildren === undefined) {
                    actualObject.wrapper.measureChildren = false;
                }
                portWrapper.measure(new Size(portWrapper.width, portWrapper.height));
                portWrapper.arrange(portWrapper.desiredSize);
            }
        }
    }
    private updateFlipOffset(element: GroupableView, diffX: number, diffY: number, flip: FlipDirection): void {
        if (element.hasChildren()) {
            for (const child of element.children) {
                if (flip === FlipDirection.Horizontal || flip === FlipDirection.Both) {
                    child.flipOffset.x = child.flipOffset.x + diffX;
                }
                if (flip === FlipDirection.Vertical || flip === FlipDirection.Both) {
                    child.flipOffset.y = child.flipOffset.y + diffY;
                }
                if (child instanceof Canvas || child instanceof GroupableView) {
                    this.updateFlipOffset(child, diffX, diffY, flip);
                }
            }
        }
    }

    private updateUMLActivity(changedProp: Node, oldObject: Node, actualObject: Node, diagram: Diagram): void {
        const sizeChanged: boolean = changedProp.width !== undefined || changedProp.height !== undefined;
        if (sizeChanged) {
            const innerFinalNode: DiagramElement = (actualObject.wrapper.children[0] as Canvas).children[0];
            innerFinalNode.width = changedProp.width;
            innerFinalNode.height = changedProp.height;
            const outerFinalNode: DiagramElement = (actualObject.wrapper.children[0] as Canvas).children[1];
            outerFinalNode.width = changedProp.width / 1.5;
            outerFinalNode.height = changedProp.height / 1.5;
        }
    }

    /**
     * updateConnectorProperties method \
     *
     * @returns { void }
     * @param {connector} connector - provide the connector value.
     *
     * @private
     */
    public updateConnectorProperties(connector: ConnectorModel): void {
        if (this.preventConnectorsUpdate) {
            const index: number = this.selectionConnectorsList.indexOf(connector);
            if (index === -1 && connector) { this.selectionConnectorsList.push(connector); }
        } else {
            const conn: Connector = {
                sourcePoint: connector.sourcePoint, targetPoint: connector.targetPoint, sourceID: connector.sourceID,
                targetID: connector.targetID, sourcePortID: connector.sourcePortID, targetPortID: connector.targetPortID
            } as Connector;
            this.connectorPropertyChange(connector as Connector, {} as Connector, conn, undefined, true);
        }
    }


    /**
     * updateConnectorEdges method \
     *
     * @returns { void }     Updates the connectorPropertyChange of the diagram container .\
     * @param {Node} actualObject - provide the actualObject value.
     *
     * @private
     */
    public updateConnectorEdges(actualObject: Node | Connector): void {
        // Get selected connector IDs once for efficient lookup
        const selectedConIds: string[] = (this.selectedItems.connectors || []).map((con: Connector) => con.id);

        if (actualObject.inEdges.length > 0) {
            for (let j: number = 0; j < actualObject.inEdges.length; j++) {
                const inEdgeId: string = actualObject.inEdges[parseInt(j.toString(), 10)];
                if ((this.eventHandler as any).currentAction !== 'Drag' || selectedConIds.indexOf(inEdgeId) === -1) {
                    this.updateConnectorProperties(this.nameTable[`${inEdgeId}`]);
                }
            }
        }
        if (actualObject.outEdges.length > 0) {
            for (let k: number = 0; k < actualObject.outEdges.length; k++) {
                const outEdgeId: string = actualObject.outEdges[parseInt(k.toString(), 10)];
                if ((this.eventHandler as any).currentAction !== 'Drag' || selectedConIds.indexOf(outEdgeId) === -1) {
                    this.updateConnectorProperties(this.nameTable[`${outEdgeId}`]);
                }
            }
        }
        // Bug: 909563 - Max Call Stack exception upon dragging group's child connector end point
        if (!(actualObject instanceof Connector) && actualObject.parentId && this.nameTable[actualObject.parentId]) {
            this.updateConnectorEdges(this.nameTable[actualObject.parentId]);
        }
    }
    /* tslint:enable */
    private connectorProprtyChangeExtend(
        actualObject: Connector, oldProp: Connector, newProp: Connector, updateSelector: boolean):
        boolean {
        if (newProp.type !== undefined && newProp.type !== oldProp.type) {
            if (actualObject.segments.length > 0 && newProp.segments === undefined) {
                actualObject.segments = [];
            }
        }
        if ((newProp.shape !== undefined) && actualObject.shape !== undefined &&
            actualObject.shape as BpmnFlowModel && actualObject.shape.type === 'Bpmn' && this.bpmnModule) {
            this.bpmnModule.updateBPMNConnector(actualObject, oldProp, newProp, this);
        }
        if (actualObject.constraints !== undefined) {
            this.updateThumbConstraints(this.selectedItems.connectors, this.selectedItems);
            return updateSelector = true;
        }
        return updateSelector;
    }

    /* tslint:disable */

    /**
     * Updates the connectorPropertyChange of the diagram container \
     *
     * @returns { void }     Updates the connectorPropertyChange of the diagram container .\
     * @param {DiagramElement} actualObject - provide the actualObject value.
     * @param {boolean} oldProp - provide the oldProp value.
     * @param {boolean} newProp - provide the newProp value.
     * @param {boolean} disableBridging - provide the disableBridging value.
     * @param {boolean} propertyChange - provide the propertyChange value.
     *
     * @private
     */
    public connectorPropertyChange(
        actualObject: Connector, oldProp: Connector, newProp: Connector, disableBridging?: boolean, propertyChange?: boolean): void {
        if (this.canEnableBlazorObject) {
            const node: Object = cloneObject(actualObject);
            this.insertValue(node, false);
        }
        const existingBounds: Rect = actualObject.wrapper.bounds; let updateSelector: boolean = false; let points: PointModel[] = [];
        updateSelector = this.connectorProprtyChangeExtend(actualObject, oldProp, newProp, updateSelector);
        let inPort: PointPortModel; let outPort: PointPortModel; let source: Canvas; let target: Canvas;
        if (newProp.visible !== undefined) { this.updateElementVisibility(actualObject.wrapper, actualObject, actualObject.visible); }
        if (newProp.sourcePoint !== undefined || newProp.targetPoint !== undefined
            || newProp.sourceID !== undefined || newProp.targetID !== undefined || newProp.targetPadding !== undefined ||
            newProp.sourcePortID !== undefined || newProp.targetPortID !== undefined || newProp.sourcePadding !== undefined ||
            newProp.type !== undefined || newProp.segments !== undefined || newProp.flip !== undefined) {
            if ((newProp.sourceID !== undefined && newProp.sourceID !== oldProp.sourceID) || newProp.sourcePortID) {
                const sourceNode: Node = this.nameTable[actualObject.sourceID]; outPort = this.findInOutConnectPorts(sourceNode, false);
                if (!sourceNode || (canOutConnect(sourceNode) || (actualObject.sourcePortID !== '' && canPortOutConnect(outPort)))) {
                    actualObject.sourceWrapper = sourceNode ? this.getEndNodeWrapper(sourceNode, actualObject, true) : undefined;
                    if (actualObject.sourcePortID && newProp.sourcePortID === undefined) {
                        actualObject.sourcePortWrapper = sourceNode ? this.getWrapper(
                            sourceNode.wrapper, actualObject.sourcePortID) : undefined;
                    }
                    this.removePortEdges(this.nameTable[oldProp.sourceID] || sourceNode,
                                         oldProp.sourcePortID || actualObject.sourcePortID, actualObject.id, false);
                }
                if (newProp.sourceID !== undefined && oldProp.sourceID !== undefined && oldProp.sourceID !== '') {
                    const oldSource: Node = this.nameTable[oldProp.sourceID];
                    if (oldSource !== undefined && oldSource.outEdges && oldSource.outEdges.indexOf(actualObject.id) !== -1) {
                        removeItem(oldSource.outEdges, actualObject.id);
                    }
                }
                this.updateEdges(actualObject);
            }
            if (newProp.targetID !== undefined && newProp.targetID !== oldProp.targetID) {
                const targetNode: Node = this.nameTable[newProp.targetID]; inPort = this.findInOutConnectPorts(targetNode, true);
                if (!targetNode || (canInConnect(targetNode) || (actualObject.targetPortID !== '' && canPortInConnect(inPort)))) {
                    actualObject.targetWrapper = targetNode ? this.getEndNodeWrapper(targetNode, actualObject, false) : undefined;
                    if (actualObject.targetPortID && newProp.targetPortID === undefined) {
                        actualObject.targetPortWrapper = targetNode ? this.getWrapper(
                            targetNode.wrapper, actualObject.targetPortID) : undefined;
                    }
                    this.removePortEdges(this.nameTable[oldProp.targetID] || targetNode,
                                         oldProp.targetPortID || actualObject.targetPortID, actualObject.id, true);
                }
                if (oldProp !== undefined && oldProp.targetID !== undefined && oldProp.targetID !== '') {
                    const oldTarget: Node = this.nameTable[oldProp.targetID];
                    if (oldTarget !== undefined && oldTarget.inEdges && oldTarget.inEdges.indexOf(actualObject.id) !== -1) {
                        removeItem(oldTarget.inEdges, actualObject.id);
                    }
                }
                this.updateEdges(actualObject);
            }
            if (newProp.sourcePortID !== undefined && newProp.sourcePortID !== oldProp.sourcePortID) {
                if (actualObject.sourceID && this.nameTable[actualObject.sourceID]) {
                    source = this.nameTable[actualObject.sourceID].wrapper;
                }
                const sourceNode: Node = this.nameTable[actualObject.sourceID];
                if (!sourceNode || (canOutConnect(sourceNode) || (actualObject.sourcePortID !== '' && canPortOutConnect(outPort)))) {
                    actualObject.sourcePortWrapper = source ? this.getWrapper(source, newProp.sourcePortID) : undefined;
                }
                else if (actualObject.sourcePortID === '' && !canOutConnect(sourceNode)) {
                    actualObject.sourcePortWrapper = undefined;
                }
            }
            if (newProp.targetPortID !== undefined && newProp.targetPortID !== oldProp.targetPortID) {
                const targetNode: Node = this.nameTable[actualObject.targetID];
                if (actualObject.targetID && this.nameTable[actualObject.targetID]) {
                    target = this.nameTable[actualObject.targetID].wrapper;
                }
                if (!targetNode || (canInConnect(targetNode) || (actualObject.targetPortID !== '' && canPortInConnect(inPort)))) {
                    actualObject.targetPortWrapper = target ? this.getWrapper(target, newProp.targetPortID) : undefined;
                } else if (actualObject.targetPortID === '' && !canInConnect(targetNode)) {
                    actualObject.targetPortWrapper = undefined;
                }
            }
            if (newProp.flip !== undefined) {
                actualObject.flip = newProp.flip;
                // Determine flip directions by XORing connector and wrapper flip values
                const horizontal: boolean = ((actualObject.flip & FlipDirection.Horizontal) ^
                    (actualObject.wrapper.flip & FlipDirection.Horizontal)) === FlipDirection.Horizontal;
                const vertical: boolean = ((actualObject.flip & FlipDirection.Vertical) ^
                    (actualObject.wrapper.flip & FlipDirection.Vertical)) === FlipDirection.Vertical;
                if (horizontal) {
                    actualObject.wrapper.flip ^= FlipDirection.Horizontal;
                }
                if (vertical) {
                    actualObject.wrapper.flip ^= FlipDirection.Vertical;
                }
                flipConnector(actualObject,horizontal, vertical, this);
            }
            //EJ2-867479 - Performance issue in complexhierarchical layout due to linerouting injection
            if (actualObject.type === 'Orthogonal' && this.lineRoutingModule && this.diagramActions &&
                (this.constraints & DiagramConstraints.LineRouting) && !(this.diagramActions & DiagramAction.ToolAction) && this.layout.type !== 'ComplexHierarchicalTree') {
                this.lineRoutingModule.renderVirtualRegion(this, true);
                // EJ2-65876 - Exception occurs on line routing injection module
                if (actualObject.sourceID !== actualObject.targetID && actualObject.segments.length > 1) {
                    //EJ2-69573 - Excecption occurs when calling doLayout method with the lineRouting module
                    this.lineRoutingModule.refreshConnectorSegments(this, actualObject, false);
                }
            }
            points = this.getPoints(actualObject);
        }//Add prop change for zindex, alignments and margin
        if (newProp.style !== undefined) { updateStyle(newProp.style, actualObject.wrapper.children[0]); }
        if (points.length > 0 || newProp.sourceDecorator !== undefined || (newProp.targetDecorator !== undefined
            && (canMeasureDecoratorPath(Object.keys(newProp.targetDecorator)))) || newProp.cornerRadius !== undefined) {
            updateConnector(actualObject, points.length > 0 ? points : actualObject.intermediatePoints, this.diagramActions);
            if (newProp.type !== undefined) { updateSelector = true; }
            if (points.length > 0) {
                actualObject.wrapper.measure(new Size(actualObject.wrapper.width, actualObject.wrapper.height));
                actualObject.wrapper.arrange(actualObject.wrapper.desiredSize);
                // eslint-disable-next-line max-len
                this.updateConnectorAnnotation(actualObject);
                this.updateConnectorPort(actualObject);
                this.updateConnectorfixedUserHandles(actualObject);
                this.updateObject(actualObject, oldProp, newProp);
            } //work-around to update intersected connector bridging
        }
        if ((newProp.sourcePoint || newProp.targetPoint || newProp.segments)
            && this.diagramActions === DiagramAction.Render) { updateSelector = true; }
        if (actualObject.shape.type === 'Bpmn' && (actualObject.shape as BpmnFlowModel).sequence === 'Default' && (actualObject.shape as BpmnFlowModel).flow === 'Sequence') {
            this.commandHandler.updatePathElementOffset(actualObject);
        }
        // eslint-disable-next-line max-len
        if (!disableBridging) { this.updateBridging(); }
        this.updateAnnotations(newProp, actualObject);
        this.updateConnectorPorts(newProp, actualObject);
        this.updatefixedUserHandle(newProp, actualObject);
        actualObject.wrapper.measure(new Size(actualObject.wrapper.width, actualObject.wrapper.height));
        actualObject.wrapper.arrange(actualObject.wrapper.desiredSize);
        if (existingBounds.equals(existingBounds, actualObject.wrapper.bounds) === false && !(this.connectorFlipInProgress)) {
            this.updateQuad(actualObject);
            if ((this.eventHandler as any).currentAction !== 'Drag') {
                this.updateGroupSize(actualObject);
            }
        }
        if (updateSelector === true && this.checkSelectedItem(actualObject) && (!(this.diagramActions & DiagramAction.ToolAction)
            || (this.diagramActions & DiagramAction.UndoRedo))) { this.updateSelector(); }
        if (!this.preventConnectorsUpdate) {
            if (!canVitualize(this) || (canVitualize(this) && this.scroller.oldCollectionObjects.indexOf(actualObject.id) > -1)) {
                if (this.diagramActions & DiagramAction.PreventZIndexOnDragging) {
                    this.updateDiagramObject(actualObject, true);
                } else {
                    this.updateDiagramObject(actualObject);
                }
            }
        }
        this.updateConnectorEdges(actualObject);
        if (this.diagramActions && actualObject.status !== 'New') { actualObject.status = 'Update'; }
        this.triggerPropertyChange(propertyChange, actualObject, oldProp, newProp);
    }
    /* tslint:enable */

    /**
     * getDirection methods \
     *
     * @returns { void }  getDirection methods .\
     * @param {NodeModel} node - provide the node value.
     * @param {string} portId - provide the portId value.
     * @param {string} item - provide the item value.
     * @param {number} isInEdges - provide the isInEdges value.
     *
     * @private
     */
    public removePortEdges(node: NodeModel | ConnectorModel, portId: string, item: string, isInEdges: boolean): void {
        if (node) {
            for (let i: number = 0; i < node.ports.length; i++) {
                const port: PointPortModel | PortModel = node.ports[parseInt(i.toString(), 10)];
                if (port.id === portId) {
                    const portEdge: string[] = (isInEdges) ? port.inEdges : port.outEdges;
                    removeItem(portEdge, item);
                }
            }
        }
    }
    //Removed blazor getpropertyChangeArgs method

    // Feature 826644: Support to add ports to the connector. Added below method to update connector ports
    // on connector property change.
    private updateConnectorPorts(newProp: Connector, actualObject: Connector): void {
        if (newProp.ports !== undefined) {
            for (const key of Object.keys(newProp.ports)) {
                const index: number = Number(key);
                const changedObject: PortModel = newProp.ports[`${key}`];
                const actualPort: PortModel = actualObject.ports[parseInt(index.toString(), 10)];
                this.updatePort(changedObject, actualPort, actualObject.wrapper, actualObject);
            }
        }
    }

    private triggerPropertyChange(propertyChange: boolean, actualObject: Connector, oldProp: Connector, newProp: Connector): void {
        if (!propertyChange) {
            const element: ConnectorModel = actualObject;
            const args: IPropertyChangeEventArgs | IBlazorPropertyChangeEventArgs = {
                element: cloneBlazorObject(element), cause: this.diagramActions, diagramAction: this.getDiagramAction(this.diagramActions),
                oldValue: cloneBlazorObject(oldProp), newValue: cloneBlazorObject(newProp)
            };
            //Removed isBlazor code
            this.triggerEvent(DiagramEvent.propertyChange, args);
        }
    }

    private findInOutConnectPorts(node: NodeModel | ConnectorModel, isInconnect: boolean): PointPortModel {
        let port: PointPortModel = {};
        if (node) {
            port = getInOutConnectPorts(node, isInconnect);
        }
        return port;
    }

    private getPoints(actualObject: Connector, points?: PointModel[]): PointModel[] {
        //let pts: PointModel[];
        //871158: Connector splitting point change with line distribution module injection
        const lineDistributionModule: boolean = (this.lineDistributionModule && this.layout.connectionPointOrigin === 'DifferentPoint') ? true : false;
        const pts: PointModel[] = actualObject.getConnectorPoints(
            actualObject.type, points,
            this.layout.type === 'ComplexHierarchicalTree' || this.layout.type === 'HierarchicalTree' ?
                this.layout.orientation : undefined,
            lineDistributionModule);
        return pts;
    }


    /**
     * update the  opacity  and visibility for the node  once the layout animation starts \
     *
     * @returns { void }  update the  opacity  and visibility for the node  once the layout animation starts .\
     * @param {GroupableView} element - provide the element value.
     * @param {boolean} visible - provide the visible value.
     * @param {number} opacity - provide the opacity value.
     *
     * @private
     */
    public updateNodeProperty(element: GroupableView, visible?: boolean, opacity?: number): void {
        if (visible === undefined) {
            this.updateElementVisibility(element, this.nameTable[element.id], visible);
        } else {
            element.style.opacity = opacity;
            for (let i: number = 0; i < element.children.length; i++) {
                if (element.children[parseInt(i.toString(), 10)] instanceof GroupableView) {
                    this.updateNodeProperty(element.children[parseInt(i.toString(), 10)] as GroupableView, undefined, opacity);
                }
                element.children[parseInt(i.toString(), 10)].style.opacity = opacity;
            }
        }
    }


    /**
     * checkSelected Item for Connector \
     *
     * @returns { void }  checkSelected Item for Connector .\
     * @param {Connector | Node} actualObject - provide the element value.
     *
     * @private
     */
    public checkSelectedItem(actualObject: Connector | Node): boolean {
        const selectorModel: SelectorModel = this.selectedItems;
        let isSelected: boolean = false;
        let selItems: (NodeModel | ConnectorModel)[] = [];
        selItems = selItems.concat(selectorModel.nodes, selectorModel.connectors);
        if (selItems.length > 0) {
            if (actualObject.id === selItems[selItems.length - 1].id) {
                isSelected = true;
            }
        }
        return isSelected;
    }


    /**
     * Updates the visibility of the diagram container \
     *
     * @returns { void }     Updates the visibility of the diagram container .\
     * @param {DiagramElement} element - provide the element value.
     * @param {boolean} visible - provide the target value.
     *
     * @private
     */
    private updateDiagramContainerVisibility(element: DiagramElement, visible: boolean): void {
        if (element instanceof GroupableView) {
            for (let i: number = 0; i < element.children.length; i++) {
                this.updateDiagramContainerVisibility(element.children[parseInt(i.toString(), 10)], visible);
            }
        }
        element.visible = visible;
    }


    /**
     * Updates the visibility of the node/connector \
     *
     * @returns { void }  Updates the visibility of the node/connector .\
     * @param {GroupableView} element - provide the element value.
     * @param {Connector | Node} obj - provide the obj value.
     * @param {boolean} visible - provide the visible value.
     *
     * @private
     */
    public updateElementVisibility(element: GroupableView, obj: Connector | Node, visible: boolean): void {
        if (visible !== undefined) {
            element.visible = visible;
            if (obj instanceof Node) {
                //content
                if (!obj.children) {
                    element.children[0].visible = visible;
                    this.updateDiagramContainerVisibility(element.children[0], visible);
                    if (obj.shape.type === 'Bpmn' && this.bpmnModule) {
                        this.bpmnModule.updateElementVisibility(obj, visible, this);
                    }
                } else {
                    for (const child of obj.children) {
                        this.updateElementVisibility(this.nameTable[`${child}`].wrapper, this.nameTable[`${child}`], visible);
                    }
                }
                if ((obj.shape.type === 'Bpmn') && (obj.shape as BpmnShapeModel).shape === 'TextAnnotation' && this.diagramActions) {
                    const connector: Connector = this.nameTable[obj.inEdges[0]];
                    const oldValue: boolean = connector.visible;
                    connector.visible = visible;
                    this.connectorPropertyChange(connector, { visible: oldValue } as Connector, { visible: visible } as Connector);
                }
                //ports
                if (obj.ports) {
                    for (const port of obj.ports) {
                        if (port.visibility & PortVisibility.Visible) {
                            const wrapper: DiagramElement = this.getWrapper(element, port.id);
                            wrapper.visible = visible;
                        }
                    }
                }
                if (obj.annotations) {
                    for (const annotation of obj.annotations) {
                        const wrapper: DiagramElement = this.getWrapper(element, annotation.id);
                        if (visible) {
                            wrapper.visible = (wrapper as TextElement).annotationVisibility === 'Visible' ? true : false;
                        } else {
                            wrapper.visible = visible;
                        }
                    }
                }
            } else {
                //path and decorators
                //942121: Visibility of BPMN flow connector not correctly applied
                if (obj.shape.type === 'Bpmn') {
                    for (let i: number = 0; i < 4; i++) {
                        element.children[parseInt(i.toString(), 10)].visible = visible;
                    }
                }
                else {
                    for (let i: number = 0; i < 3; i++) {
                        element.children[parseInt(i.toString(), 10)].visible = visible;
                    }
                }
            }
            if (obj.annotations) {
                //annotations
                for (const annotation of obj.annotations) {
                    const wrapper: DiagramElement = this.getWrapper(element, annotation.id);
                    //Bug 855273: Annotation visible property is not working while changing node visibility at runtime.
                    if (visible) {
                        wrapper.visible = (wrapper as TextElement).annotationVisibility === 'Visible' ? true : false;
                    } else {
                        wrapper.visible = visible;
                    }
                }
            }
            if ((obj as NodeModel).expandIcon || (obj as NodeModel).collapseIcon) {
                const wrapper: GroupableView = this.getWrapper(element, 'icon_content') as GroupableView;
                if (wrapper) {
                    for (let i: number = 0; i < wrapper.children.length; i++) {
                        wrapper.children[parseInt(i.toString(), 10)].visible = visible;
                    }
                    wrapper.visible = visible;
                }
                if (obj && obj.visible && (obj as Node).outEdges) {
                    this.updateIconVisibility((obj as Node), ((obj as Node).outEdges.length === 0 ? false : true));
                }
            }
            if (visible === false) {
                this.unSelect(this.nameTable[element.id]);
            }
            if ((obj instanceof Node && !this.preventNodesUpdate) || (obj instanceof Connector && !this.preventConnectorsUpdate)) {
                //Avoid calling updateDiagramObject method during rendering
                if (this.diagramActions) {
                    this.updateDiagramObject(this.nameTable[element.id], undefined, true);
                }
            }
        }
    }

    private updateAnnotations(newProp: Connector, actualObject: Connector): void {
        if (newProp.annotations !== undefined) {
            for (const key of Object.keys(newProp.annotations)) {
                const index: number = Number(key);
                const changedObject: AnnotationModel = newProp.annotations[`${key}`];
                const actualAnnotation: AnnotationModel = actualObject.annotations[parseInt(index.toString(), 10)];
                this.updateAnnotation(changedObject, actualAnnotation, actualObject.wrapper, actualObject);
            }
        }
    }

    private updatefixedUserHandle(newProp: Connector, actualObject: Connector): void {
        if (newProp.fixedUserHandles !== undefined) {
            let index: number;
            let changedObject: ConnectorFixedUserHandleModel;
            let actualAnnotation: ConnectorFixedUserHandleModel;
            for (const key of Object.keys(newProp.fixedUserHandles)) {
                index = Number(key);
                changedObject = newProp.fixedUserHandles[`${key}`];
                actualAnnotation = actualObject.fixedUserHandles[parseInt(index.toString(), 10)];
                this.updateConnectorfixedUserHandle(changedObject, actualAnnotation, actualObject.wrapper, actualObject);
            }
        }
    }

    /**
     * updateConnectorfixedUserHandle method \
     *
     * @returns { void }  updateConnectorfixedUserHandle method .\
     * @param {ConnectorFixedUserHandleModel} changedObject - provide the changedObject value.
     * @param {ConnectorFixedUserHandleModel} actualfixedUserHandle - provide the actualfixedUserHandle value.
     * @param {GroupableView} nodes - provide the nodes value.
     * @param {Object} actualObject - provide the actualObject value.
     * @param {boolean} canUpdateSize - provide the canUpdateSize value.
     *
     * @private
     */
    public updateConnectorfixedUserHandle(
        changedObject: ConnectorFixedUserHandleModel, actualfixedUserHandle: ConnectorFixedUserHandleModel, nodes: GroupableView,
        actualObject?: Object, canUpdateSize?: boolean): void {
        let isMeasure: boolean = false;
        const fixedUserHandleWrapper: Canvas = this.getWrapper(nodes, actualfixedUserHandle.id) as Canvas;
        if (fixedUserHandleWrapper !== undefined) {
            if (changedObject.width !== undefined) {
                fixedUserHandleWrapper.width = changedObject.width;
                isMeasure = true;
            }
            if (changedObject.height !== undefined) {
                fixedUserHandleWrapper.height = changedObject.height;
                isMeasure = true;
            }
            if (actualfixedUserHandle instanceof ConnectorFixedUserHandle &&
                ((changedObject as ConnectorFixedUserHandle).offset !== undefined)) {
                (actualObject as Connector).updateAnnotation(
                    actualfixedUserHandle, (actualObject as Connector).intermediatePoints,
                    (actualObject as Connector).wrapper.bounds, (fixedUserHandleWrapper as Canvas));
            }
            if ((actualfixedUserHandle instanceof ConnectorFixedUserHandle) && (changedObject as ConnectorFixedUserHandle).displacement) {
                if ((changedObject as ConnectorFixedUserHandle).displacement.x !== undefined ||
                    (changedObject as ConnectorFixedUserHandle).displacement.y !== undefined) {
                    isMeasure = true;

                }
            }
            if (changedObject.fill !== undefined) {
                fixedUserHandleWrapper.style.fill = changedObject.fill;
            }
            if (changedObject.handleStrokeColor !== undefined) {
                fixedUserHandleWrapper.style.strokeColor = changedObject.handleStrokeColor;
            }
            if (changedObject.handleStrokeWidth !== undefined) {
                fixedUserHandleWrapper.style.strokeWidth = changedObject.handleStrokeWidth;
            }
            if (changedObject.visibility !== undefined) {
                fixedUserHandleWrapper.visible = changedObject.visibility;
            }
            if (changedObject.cornerRadius !== undefined) {
                fixedUserHandleWrapper.cornerRadius = changedObject.cornerRadius;
            }
            this.updatefixedUserHandleContent(changedObject, isMeasure, fixedUserHandleWrapper, actualObject, actualfixedUserHandle, nodes);
            if (isMeasure === true) {
                fixedUserHandleWrapper.measure(new Size(fixedUserHandleWrapper.width, fixedUserHandleWrapper.height));
                fixedUserHandleWrapper.arrange(fixedUserHandleWrapper.desiredSize);
            }
        }
    }

    /**
     * updateAnnotation method \
     *
     * @returns { void }  updateAnnotation method .\
     * @param {AnnotationModel} changedObject - provide the changedObject value.
     * @param {ShapeAnnotationModel} actualAnnotation - provide the actualAnnotation value.
     * @param {GroupableView} nodes - provide the nodes value.
     * @param {Object} actualObject - provide the actualObject value.
     * @param {boolean} canUpdateSize - provide the canUpdateSize value.
     *
     * @private
     */
    public updateAnnotation(
        changedObject: AnnotationModel, actualAnnotation: ShapeAnnotationModel, nodes: GroupableView,
        actualObject?: Object, canUpdateSize?: boolean): void {
        let isMeasure: boolean = false;
        // eslint-disable-next-line max-len
        const annotationWrapper: TextElement | DiagramHtmlElement = this.getWrapper(nodes, actualAnnotation.id) as TextElement | DiagramHtmlElement;
        if (annotationWrapper !== undefined) {
            if (changedObject.width !== undefined && changedObject.height !== undefined) {
                annotationWrapper.width = changedObject.width; annotationWrapper.height = changedObject.height;
                isMeasure = true;
            }
            if (changedObject.rotateAngle !== undefined) {
                annotationWrapper.rotateAngle = changedObject.rotateAngle;
            }
            if (canUpdateSize && !(annotationWrapper instanceof DiagramHtmlElement)) {
                (annotationWrapper as TextElement).refreshTextElement();
            }
            if (actualAnnotation instanceof PathAnnotation && (changedObject as PathAnnotationModel).segmentAngle !== undefined) {
                annotationWrapper.rotateAngle = actualAnnotation.rotateAngle;
            }
            if ((changedObject).rotationReference !== undefined) {
                (annotationWrapper as TextElement).rotationReference = changedObject.rotationReference;
            }
            if (actualAnnotation instanceof ShapeAnnotation &&
                (changedObject as ShapeAnnotationModel).offset !== undefined) {
                const offset: PointModel = (changedObject as ShapeAnnotationModel).offset;
                isMeasure = true;
                const offsetX: number = offset.x !== undefined ? offset.x :
                    actualAnnotation.offset.x;
                const offsetY: number = offset.y !== undefined ? offset.y :
                    actualAnnotation.offset.y;
                annotationWrapper.setOffsetWithRespectToBounds(offsetX, offsetY, 'Fraction');
                annotationWrapper.relativeMode = 'Point';
                //911103- Text alignment for connectors not updated properly for connectors annotation at run time
            } else if (actualAnnotation instanceof PathAnnotation &&
                ((changedObject as PathAnnotationModel).offset !== undefined ||
                    (changedObject as PathAnnotationModel).segmentAngle !== undefined ||
                    (changedObject as PathAnnotationModel).alignment !== undefined)) {
                (actualObject as Connector).updateAnnotation(
                    actualAnnotation, (actualObject as Connector).intermediatePoints,
                    (actualObject as Connector).wrapper.bounds, (annotationWrapper as TextElement));
            }
            if ((actualAnnotation instanceof PathAnnotation) && (changedObject as PathAnnotation).displacement) {
                if ((changedObject as PathAnnotation).displacement.x !== undefined ||
                    (changedObject as PathAnnotation).displacement.y !== undefined) {
                    isMeasure = true;
                    (actualObject as Connector).updateAnnotation(
                        actualAnnotation, (actualObject as Connector).intermediatePoints,
                        (actualObject as Connector).wrapper.bounds, (annotationWrapper as TextElement));
                }
            }
            if (changedObject.margin !== undefined) {
                isMeasure = true;
                if (changedObject.margin.bottom !== undefined) {
                    annotationWrapper.margin.bottom = changedObject.margin.bottom;
                }
                if (changedObject.margin.top !== undefined) {
                    annotationWrapper.margin.top = changedObject.margin.top;
                }
                if (changedObject.margin.left !== undefined) {
                    annotationWrapper.margin.left = changedObject.margin.left;
                }
                if (changedObject.margin.right !== undefined) {
                    annotationWrapper.margin.right = changedObject.margin.right;
                }
            }
            if (isMeasure || canUpdateSize) {
                annotationWrapper.width = (actualAnnotation.width || (actualObject as Node).width);
                if (actualAnnotation.template) {
                    annotationWrapper.width = (annotationWrapper.width || annotationWrapper.actualSize.width);
                    annotationWrapper.height = (actualAnnotation.height || (actualObject as Node).height ||
                        annotationWrapper.actualSize.height);
                }
            }
            if (changedObject.horizontalAlignment !== undefined) {
                annotationWrapper.horizontalAlignment = changedObject.horizontalAlignment; isMeasure = true;
            }
            if (changedObject.verticalAlignment !== undefined) {
                annotationWrapper.verticalAlignment = changedObject.verticalAlignment; isMeasure = true;
            }
            if (changedObject.visibility !== undefined) {
                annotationWrapper.visible = (nodes.visible && changedObject.visibility) ? true : false;
                (annotationWrapper as TextElement).annotationVisibility = annotationWrapper.visible ? 'Visible' : 'Collapsed';
                // EJ2:943684 - Selection of annotation not removed while turn off the annotation visibility
                const selectedItems: Selector = this.selectedItems as Selector;
                if (!annotationWrapper.visible && selectedItems.annotation) {
                    this.clearSelection();
                }
            }
            if (changedObject.constraints !== undefined) {
                const updateSelector: boolean = false;
                if ((annotationWrapper.constraints & AnnotationConstraints.Select) &&
                    (!(changedObject.constraints & AnnotationConstraints.Select)) &&
                    isSelected(this, actualObject, false, annotationWrapper)) {
                    //updateSelector = true;
                }
                annotationWrapper.constraints = changedObject.constraints;
                if (updateSelector) {
                    this.clearSelection();
                }
            }
            if (changedObject.style !== undefined) {
                updateStyle(changedObject.style, annotationWrapper);
            }
            if (changedObject.hyperlink !== undefined) {
                updateHyperlink(changedObject.hyperlink, annotationWrapper, actualAnnotation);
            }
            this.updateAnnotationContent(changedObject, isMeasure, annotationWrapper, actualObject, actualAnnotation, nodes);
            if (isMeasure === true) {
                annotationWrapper.measure(new Size(annotationWrapper.width, annotationWrapper.height));
                annotationWrapper.arrange(annotationWrapper.desiredSize);
            }
            if (!(annotationWrapper instanceof DiagramHtmlElement)) {
                (annotationWrapper as TextElement).refreshTextElement();
            }
            // this.refresh(); this.refreshDiagramLayer();
        }
    }

    private updatefixedUserHandleContent(
        changedObject: ConnectorFixedUserHandleModel, isMeasure: boolean, fixedUserHandleWrapper: Canvas,
        actualObject: Object, fixedUserHandleAnnotation: ConnectorFixedUserHandleModel, nodes: GroupableView
    ): void {
        if (changedObject !== undefined) {
            this.updateConnectorfixedUserHandleWrapper(fixedUserHandleWrapper, actualObject, fixedUserHandleAnnotation, nodes);
        }
    }
    private updateConnectorfixedUserHandleWrapper(
        fixedUserHandleWrapper: Canvas | DiagramHtmlElement, actualObject: Object,
        actualAnnotation: ConnectorFixedUserHandleModel, nodes: GroupableView
    ): void {
        for (const elementId of this.views) {
            removeElement(fixedUserHandleWrapper.id + '_groupElement', elementId);
            removeElement(fixedUserHandleWrapper.id + '_html_element', elementId);
        }
        if (actualObject instanceof Connector) {
            const canvas: GroupableView = actualObject.wrapper;
            const segment: DiagramElement = canvas.children[0];
            const bounds: Rect = new Rect(
                segment.offsetX - segment.width / 2, segment.offsetY - segment.height / 2, segment.width, segment.height);
            fixedUserHandleWrapper =
                actualObject.getFixedUserHandle(
                    actualObject.fixedUserHandles[actualObject.fixedUserHandles.length - 1] as ConnectorFixedUserHandle,
                    actualObject.intermediatePoints,
                    bounds, undefined, undefined);
        }
        for (let i: number = 0; i < nodes.children.length; i++) {
            if (fixedUserHandleWrapper.id === nodes.children[parseInt(i.toString(), 10)].id) {
                nodes.children.splice(i, 1, fixedUserHandleWrapper);
            }
        }
    }

    private updateAnnotationContent(
        changedObject: AnnotationModel, isMeasure: boolean, annotationWrapper: TextElement | DiagramHtmlElement,
        actualObject: Object, actualAnnotation: ShapeAnnotationModel, nodes: GroupableView
    ): void {
        if (changedObject.content !== undefined) {
            if (annotationWrapper as TextElement) {
                isMeasure = true;
                if ((actualObject as Node).shape.type === 'UmlActivity' &&
                    ((!isBlazor() && ((actualObject as Node).shape as UmlActivityShapeModel).shape === 'StructuredNode'))) {
                    (annotationWrapper as TextElement).content = '<<' + changedObject.content + '>>';
                } else {
                    (annotationWrapper as TextElement).content = changedObject.content;
                }
            }
            if (annotationWrapper instanceof DiagramHtmlElement) {
                this.updateAnnotationWrapper(annotationWrapper, actualObject, actualAnnotation, nodes);
            }
        }
        if (changedObject.template !== undefined) {
            (annotationWrapper as DiagramHtmlElement).content = changedObject.template;
            this.updateAnnotationWrapper(annotationWrapper, actualObject, actualAnnotation, nodes);
        }
    }

    private updateAnnotationWrapper(
        annotationWrapper: TextElement | DiagramHtmlElement, actualObject: Object,
        actualAnnotation: ShapeAnnotationModel, nodes: GroupableView
    ): void {
        for (const elementId of this.views) {
            removeElement(annotationWrapper.id + '_groupElement', elementId);
            removeElement(annotationWrapper.id + '_html_element', elementId);
        }
        if (actualObject instanceof Node) {
            annotationWrapper =
                (actualObject as Node).initAnnotationWrapper(
                    actualAnnotation as Annotation, this.element.id) as DiagramHtmlElement | TextElement;
        } else if (actualObject instanceof Connector) {
            const canvas: GroupableView = actualObject.wrapper;
            const segment: DiagramElement = canvas.children[0];
            const bounds: Rect = new Rect(
                segment.offsetX - segment.width / 2, segment.offsetY - segment.height / 2, segment.width, segment.height);
            annotationWrapper =
                actualObject.getAnnotationElement(
                    actualObject.annotations[actualObject.annotations.length - 1] as PathAnnotation,
                    actualObject.intermediatePoints,
                    bounds, this.getDescription, this.element.id);
        }
        for (let i: number = 0; i < nodes.children.length; i++) {
            if (annotationWrapper.id === nodes.children[parseInt(i.toString(), 10)].id) {
                nodes.children.splice(i, 1, annotationWrapper);
            }
        }
    }

    /**
     * updateNodefixedUserHandle method \
     *
     * @returns { void }  updateNodefixedUserHandle method .\
     * @param {NodeFixedUserHandleModel} changedObject - provide the changedObject value.
     * @param {NodeFixedUserHandleModel} actualfixedUserHandle - provide the actualfixedUserHandle value.
     * @param {GroupableView} nodes - provide the changedObject value.
     * @param {Object} actualObject - provide the changedObject value.
     *
     * @private
     */
    public updateNodefixedUserHandle(
        changedObject: NodeFixedUserHandleModel, actualfixedUserHandle: NodeFixedUserHandleModel, nodes: GroupableView,
        actualObject?: Object): void {
        //let fixedUserHandleWrapper: Canvas;
        let isMeasure: boolean = false;
        const fixedUserHandleWrapper: Canvas = this.getWrapper(nodes, actualfixedUserHandle.id) as Canvas;
        if (fixedUserHandleWrapper !== undefined) {
            if (changedObject.width !== undefined) {
                fixedUserHandleWrapper.actualSize.width = changedObject.width;
                isMeasure = true;
            }
            if (changedObject.height !== undefined) {
                fixedUserHandleWrapper.height = changedObject.height;
                isMeasure = true;
            }
            if (actualfixedUserHandle instanceof NodeFixedUserHandle &&
                (changedObject as NodeFixedUserHandleModel).offset !== undefined) {
                const offset: PointModel = (changedObject as NodeFixedUserHandleModel).offset;
                isMeasure = true;
                const offsetX: number = offset.x !== undefined ? offset.x :
                    actualfixedUserHandle.offset.x;
                const offsetY: number = offset.y !== undefined ? offset.y :
                    actualfixedUserHandle.offset.y;
                fixedUserHandleWrapper.setOffsetWithRespectToBounds(offsetX, offsetY, 'Fraction');
                fixedUserHandleWrapper.relativeMode = 'Point';
            }
            if (changedObject.margin !== undefined) {
                isMeasure = true;
                if (changedObject.margin.bottom !== undefined) {
                    fixedUserHandleWrapper.margin.bottom = changedObject.margin.bottom;
                }
                if (changedObject.margin.top !== undefined) {
                    fixedUserHandleWrapper.margin.top = changedObject.margin.top;
                }
                if (changedObject.margin.left !== undefined) {
                    fixedUserHandleWrapper.margin.left = changedObject.margin.left;
                }
                if (changedObject.margin.right !== undefined) {
                    fixedUserHandleWrapper.margin.right = changedObject.margin.right;
                }
            }
            if (changedObject.visibility !== undefined) {
                fixedUserHandleWrapper.visible = changedObject.visibility;
            }
            if (changedObject.fill !== undefined) {
                fixedUserHandleWrapper.style.fill = changedObject.fill;
            }
            if (changedObject.handleStrokeColor !== undefined) {
                fixedUserHandleWrapper.style.strokeColor = changedObject.handleStrokeColor;
            }
            if (changedObject.handleStrokeWidth !== undefined) {
                fixedUserHandleWrapper.style.strokeWidth = changedObject.handleStrokeWidth;
            }
            if (changedObject.cornerRadius !== undefined) {
                fixedUserHandleWrapper.cornerRadius = changedObject.cornerRadius;
            }
            this.updatefixedUserHandleWrapper(fixedUserHandleWrapper, actualObject, actualfixedUserHandle, nodes);
            if (isMeasure === true) {
                fixedUserHandleWrapper.measure(new Size(fixedUserHandleWrapper.width, fixedUserHandleWrapper.height));
                fixedUserHandleWrapper.arrange(fixedUserHandleWrapper.desiredSize);
            }
        }
    }
    private updatefixedUserHandleWrapper(
        fixedUserHandleWrapper: DiagramElement, actualObject: Object,
        actualAnnotation: FixedUserHandleModel, nodes: GroupableView
    ): void {
        for (const elementId of this.views) {
            removeElement(fixedUserHandleWrapper.id + '_groupElement', elementId);
            removeElement(fixedUserHandleWrapper.id + '_html_element', elementId);
        }
        if (actualObject instanceof Node) {
            fixedUserHandleWrapper = (actualObject as Node).initFixedUserHandles(actualAnnotation, undefined, undefined);
        }
        for (let i: number = 0; i < nodes.children.length; i++) {
            if (fixedUserHandleWrapper.id === nodes.children[parseInt(i.toString(), 10)].id) {
                nodes.children.splice(i, 1, fixedUserHandleWrapper);
            }
        }
    }

    /**
     * updatePort method \
     *
     * @returns { void }  updatePort method .\
     * @param {PointPortModel} changedObject - provide the changedObject value.
     * @param {PointPortModel} actualPort - provide the changedObject value.
     * @param {GroupableView} nodes - provide the changedObject value.
     * @param {Connector} actualObject - The actual connector object to be used.
     * @private
     */
    public updatePort(changedObject: PointPortModel, actualPort: PointPortModel, nodes: GroupableView, actualObject?: Connector): void {
        let isMeasure: boolean = false;
        const portWrapper: DiagramElement = this.getWrapper(nodes, actualPort.id);
        if (portWrapper !== undefined) {

            if (changedObject.offset !== undefined) {
                isMeasure = true;
                if (!actualObject) {
                    const offsetX: number = changedObject.offset.x !== undefined ? changedObject.offset.x :
                        actualPort.offset.x;
                    const offsetY: number = changedObject.offset.y !== undefined ? changedObject.offset.y :
                        actualPort.offset.y;
                    portWrapper.setOffsetWithRespectToBounds(offsetX, offsetY, 'Fraction');
                    portWrapper.relativeMode = 'Point';
                }
                else {
                    if (changedObject.offset !== undefined) {
                        actualObject.updateAnnotation(actualPort as any,
                                                      actualObject.intermediatePoints, actualObject.wrapper.bounds, portWrapper);
                    }
                }
            }
            if (changedObject.width !== undefined) {
                isMeasure = true;
                portWrapper.width = changedObject.width;
            }
            if (changedObject.height !== undefined) {
                isMeasure = true;
                portWrapper.height = changedObject.height;
            }
            if (changedObject.connectionDirection !== undefined) {
                portWrapper.connectionDirection = changedObject.connectionDirection;
            }
            if (changedObject.visibility !== undefined) {
                portWrapper.visible = (nodes.visible && checkPortRestriction(actualPort, PortVisibility.Visible)) ? true : false;
            }
            if (changedObject.margin !== undefined) {
                isMeasure = true;
                if (changedObject.margin.bottom !== undefined) {
                    portWrapper.margin.bottom = changedObject.margin.bottom;
                }
                if (changedObject.margin.top !== undefined) {
                    portWrapper.margin.top = changedObject.margin.top;
                }
                if (changedObject.margin.right !== undefined) {
                    portWrapper.margin.right = changedObject.margin.right;
                }
                if (changedObject.margin.left !== undefined) {
                    portWrapper.margin.left = changedObject.margin.left;
                }
            }
            if (changedObject.horizontalAlignment !== undefined) {
                isMeasure = true;
                portWrapper.horizontalAlignment = changedObject.horizontalAlignment;
            }
            if (changedObject.verticalAlignment !== undefined) {
                isMeasure = true;
                portWrapper.verticalAlignment = changedObject.verticalAlignment;
            }
            if (changedObject.style !== undefined) {
                if (changedObject.style.fill !== undefined) {
                    portWrapper.style.fill = changedObject.style.fill;
                }
                if (changedObject.style.opacity !== undefined) {
                    portWrapper.style.opacity = changedObject.style.opacity;
                }
                if (changedObject.style.strokeColor !== undefined) {
                    portWrapper.style.strokeColor = changedObject.style.strokeColor;
                }
                if (changedObject.style.strokeWidth !== undefined) {
                    portWrapper.style.strokeWidth = changedObject.style.strokeWidth;
                }
                if (changedObject.style.strokeDashArray !== undefined) {
                    portWrapper.style.strokeDashArray = changedObject.style.strokeDashArray;
                }
            }
            if (changedObject.shape !== undefined) {
                if (portWrapper as PathElement) {
                    const pathdata: string = getPortShape(changedObject.shape);
                    (portWrapper as PathElement).data = pathdata;
                    (portWrapper as PathElement).canMeasurePath = true;
                }
            }
            if (changedObject.pathData !== undefined) {
                (portWrapper as PathElement).data = String(changedObject.pathData);
                isMeasure = true;
            }
            if (isMeasure === true) {
                portWrapper.measure(new Size(portWrapper.width, portWrapper.height));
                portWrapper.arrange(portWrapper.desiredSize);
            }
            //this.refresh(); this.refreshDiagramLayer();
        }
    }

    /**
     * updateIcon method \
     *
     * @returns { void }  updateIcon method .\
     * @param {Node} actualObject - provide the obj value.
     *
     * @private
     */
    public updateIcon(actualObject: Node): void {
        const iconContainer: Canvas = this.getWrapper(actualObject.wrapper, 'icon_content') as Canvas;
        const diagramId: string = (this.diagramActions & DiagramAction.Render) ? this.element.id : undefined;
        if (iconContainer) {
            if (this.mode === 'SVG') {
                const icon: HTMLElement = getDiagramElement(actualObject.wrapper.id + '_icon_content', diagramId);
                if (icon) {
                    const iconRect: HTMLElement = getDiagramElement(icon.id + '_rect', diagramId);
                    const iconShape: HTMLElement = getDiagramElement(icon.id + '_shape', diagramId);
                    const nativeContent: HTMLElement = getDiagramElement(iconShape.id + '_native_element', diagramId);
                    if (nativeContent) {
                        nativeContent.parentNode.removeChild(nativeContent);
                    }
                    iconShape.parentNode.removeChild(iconShape);
                    iconRect.parentNode.removeChild(iconRect);
                    icon.parentNode.removeChild(icon);
                }
            }
            const index: number = actualObject.wrapper.children.indexOf(iconContainer);
            actualObject.wrapper.children.splice(index, 1);
        }
        const portContainer: GroupableView = this.getPortContainer(actualObject);
        actualObject.initIcons(this.getDescription, this.layout, portContainer, this.element.id);
    }

    private getPortContainer(actualObject: Node): GroupableView {
        if (actualObject.children) {
            for (let i: number = 0; i < actualObject.wrapper.children.length; i++) {
                if (actualObject.wrapper.children[parseInt(i.toString(), 10)].id === actualObject.id + 'group_container') {
                    return actualObject.wrapper.children[parseInt(i.toString(), 10)] as GroupableView;
                }
            }
        }
        return actualObject.wrapper;
    }

    private updateTooltip(actualObject: NodeModel, node: NodeModel): void {
        if (node.tooltip.content !== undefined) {
            actualObject.tooltip.content = node.tooltip.content;
        }
        if (node.tooltip.position !== undefined) {
            actualObject.tooltip.position = node.tooltip.position;
        }
        if (node.tooltip.height !== undefined) {
            actualObject.tooltip.height = node.tooltip.height;
        }
        if (node.tooltip.width !== undefined) {
            actualObject.tooltip.width = node.tooltip.width;
        }
        if (node.tooltip.showTipPointer !== undefined) {
            actualObject.tooltip.showTipPointer = node.tooltip.showTipPointer;
        }
        if (node.tooltip.relativeMode !== undefined) {
            actualObject.tooltip.relativeMode = node.tooltip.relativeMode;
        }
    }
    /**
     * updateQuad method \
     *
     * @returns { void }  updateQuad method .\
     * @param {IElement} obj - provide the obj value.
     *
     * @private
     */
    public updateQuad(obj: IElement): void {
        const modified: boolean = this.spatialSearch.updateQuad(obj.wrapper);
        if (modified && !this.preventDiagramUpdate) {
            this.updatePage();
        }
    }
    /**
     * removeFromAQuad method \
     *
     * @returns { void }  removeFromAQuad method .\
     * @param {IElement} obj - provide the node value.
     *
     * @private
     */
    public removeFromAQuad(obj: IElement): void {
        if ((obj as NodeModel).children) {
            let child: NodeModel;
            const children: string[] = (obj as NodeModel).children;
            for (let i: number = 0; i < children.length; i++) {
                child = this.nameTable[children[parseInt(i.toString(), 10)]];
                if (child) {
                    this.removeFromAQuad(child as Node);
                }
            }
        }
        this.spatialSearch.removeFromAQuad(obj.wrapper);
        const isSwimLane: boolean = (obj as NodeModel).shape.type === 'SwimLane' ? true : false;
        const modified: boolean = this.spatialSearch.updateBounds(obj.wrapper, isSwimLane);
        if (modified && !this.preventDiagramUpdate) {
            this.updatePage();
        }
    }
    /**
     * updateGroupSize method \
     *
     * @returns { void }  updateGroupSize method .\
     * @param {NodeModel | ConnectorModel} node - provide the node value.
     *
     * @private
     */
    public updateGroupSize(node: NodeModel | ConnectorModel): void {
        let tempNode: NodeModel | ConnectorModel;
        if ((node as Node | Connector).parentId) {
            tempNode = this.nameTable[(node as Node | Connector).parentId];
            if (tempNode) {
                if ((tempNode as Node | Connector).parentId) {
                    this.updateGroupSize(tempNode);
                } else {
                    tempNode.wrapper.measure(new Size());
                    tempNode.wrapper.arrange(tempNode.wrapper.desiredSize);
                    this.updateGroupOffset(tempNode);
                    this.updateDiagramObject(tempNode);
                }
            }
        }
    }

    private updatePage(): void {
        if ((this.diagramActions & DiagramAction.Render) &&
            !(this.diagramActions & DiagramAction.DragUsingMouse)) {
            this.scroller.updateScrollOffsets();
            this.scroller.setSize();
            //updating overview
            for (const temp of this.views) {
                const view: View = this.views[`${temp}`];
                if (!(view instanceof Diagram)) {
                    view.updateView(view);
                }
            }
        }
        if (this.diagramActions & DiagramAction.DragUsingMouse) {
            this.renderPageBreaks();
            // EJ2-826378 - Scroller not updated properly when dragging a node outside the viewport.
            // We need to update the scroller while dragging.
            // If pageSize is defined, we don't need to update the scrollbar.
            // If pageSize is not defined, we need to update the scrollbar because the content is treated as page bounds, and if the content goes beyond the viewport, the scrollbar should be updated.
            if (!(this.pageSettings.width && this.pageSettings.height) || this.pageSettings.multiplePage) {
                this.scroller.updateScrollOffsets();
                this.scroller.setSize();
            }
        }
    }

    /**
     * protectPropertyChange method \
     *
     * @returns { void }  protectPropertyChange method .\
     * @param {boolean} enable - provide the enable value.
     *
     * @private
     */
    public protectPropertyChange(enable: boolean): void {
        this.isProtectedOnChange = enable;
    }

    /**
     * getProtectPropertyChangeValue method \
     *
     * @returns { boolean }  getProtectPropertyChangeValue method .\
     *
     * @private
     */
    public getProtectPropertyChangeValue(): boolean {
        return this.isProtectedOnChange;
    }

    /**
     * enableServerDataBinding method \
     *
     * @returns { void }  enableServerDataBinding method .\
     * @param {boolean} enable - provide the node value.
     *
     * @private
     */
    public enableServerDataBinding(enable: boolean): void {
        //Removed isBlazor code
    }


    /**
     * updateShadow method \
     *
     * @returns { void }  updateShadow method .\
     * @param {ShadowModel} nodeShadow - provide the node value.
     * @param {ShadowModel} changedShadow - provide the Node value.
     *
     * @private
     */
    public updateShadow(nodeShadow: ShadowModel, changedShadow: ShadowModel): void {
        if (changedShadow.angle !== undefined) {
            nodeShadow.angle = changedShadow.angle;
        }
        if (changedShadow.color !== undefined) {
            nodeShadow.color = changedShadow.color;
        }
        if (changedShadow.distance !== undefined) {
            nodeShadow.distance = changedShadow.distance;
        }
        if (changedShadow.opacity !== undefined) {
            nodeShadow.opacity = changedShadow.opacity;
        }
    }


    /**
     * updateMargin method \
     *
     * @returns { void }  updateMargin method .\
     * @param {Node} node - provide the node value.
     * @param {Node} changes - provide the Node value.
     *
     * @private
     */
    public updateMargin(node: Node, changes: Node): void {
        if (changes.margin.top !== undefined) {
            node.margin.top = changes.margin.top;
        }
        if (changes.margin.bottom !== undefined) {
            node.margin.bottom = changes.margin.bottom;
        }
        if (changes.margin.left !== undefined) {
            node.margin.left = changes.margin.left;
        }
        if (changes.margin.right !== undefined) {
            node.margin.right = changes.margin.right;
        }
    }
    private removePreviewChildren(preview: Node): void {
        if (preview.children && preview.children.length &&
            preview.shape && preview.shape.type === 'SwimLane') {
            for (let z: number = 0; z < preview.children.length; z++) {
                const previewChildId: string = preview.children[parseInt(z.toString(), 10)];
                const previewIndex: number = this.nodes.indexOf(this.nameTable[`${previewChildId}`]);
                if (previewIndex >= 0) {
                    this.nodes.splice(previewIndex, 1);
                }
                delete this.nameTable[`${previewChildId}`];
            }
            const previewIndex: number = this.nodes.indexOf(this.nameTable[this.currentSymbol.id]);
            if (previewIndex >= 0) {
                this.nodes.splice(previewIndex, 1);
            }
        } else if (preview.shape.type === 'Container') {
            if ((preview.shape as Container).hasHeader) {
                const headerIndex: number = this.nodes.indexOf(this.nameTable[preview.id +
                                                               (preview.shape as Container).header.id]);
                if (headerIndex >= 0) {
                    this.nodes.splice(headerIndex, 1);
                }
            }
            const previewIndex: number = this.nodes.indexOf(this.nameTable[this.currentSymbol.id]);
            if (previewIndex >= 0) {
                this.nodes.splice(previewIndex, 1);
            }
        }
    }

    private selectDragedNode(newObj: (NodeModel | Connector), args: any, selectedSymbol: HTMLElement): void {
        this.currentSymbol = newObj as Node | Connector;
        if (this.mode !== 'SVG') {
            this.refreshDiagramLayer();
        }
        this.commandHandler.oldSelectedObjects = cloneSelectedObjects(this);
        this.commandHandler.select(newObj);
        // this.commandHandler.updateBlazorSelector();
        this.eventHandler.mouseDown(args.event);
        this.eventHandler.mouseMove(args.event, args);
        this.preventDiagramUpdate = false; this.updatePage(); selectedSymbol.style.opacity = '0';
    }

    //property changes - end region
    /* tslint:disable */
    private initDroppables(): void {
        // initiates droppable event
        let childTable: {} = {};
        let entryTable: {} = {};
        let header: NodeModel;
        let lane: NodeModel;
        const selectedSymbols: string = 'selectedSymbols';
        this.droppable = new Droppable(this.element);
        let dragLeft: number = 5;
        // this.droppable.accept = '.e-dragclone';
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.droppable.over = (args: any) => {
            //Bug 855292: Swimlane dragging from palette jumps out of viewport when multiple page is set as true.
            // Added below code to prevent the negative x value of swimlane bounds when multiple page and ruler is enabled to prevent swimlane jump.
            if (this.rulerSettings.showRulers) {
                const vRuler = document.getElementById(this.element.id + '_vRuler');
                const vRulerWidth = parseFloat(vRuler.style.width);
                dragLeft = vRulerWidth + 1;
            }
            //EJ2-59341- SelectionChange OldValue argument is null
            if (this.previousSelectedObjects.length === 0 && !this.currentSymbol) {
                this.previousSelectedObjects = this.commandHandler.getSelectedObject();
            }
            this.commandHandler.PreventConnectorSplit = true;
            if (!this.currentSymbol) {
                let dragDataHelper = null;
                if (!args.dragData && args.name === 'drag') {
                    const helper = document.getElementsByClassName('e-dragclone')[0];
                    if (helper) {
                        dragDataHelper = helper;
                    }
                }
                if (args.dragData || dragDataHelper) {
                    let newObj: NodeModel | Connector;
                    let isHorizontal: boolean;
                    document.getElementById(this.element.id + 'content').focus();
                    const position: PointModel = this.eventHandler.getMousePosition(args.event);
                    let clonedObject: Object; const selectedSymbol: HTMLElement = dragDataHelper || args.dragData.helper;
                    const paletteId: string = selectedSymbol.getAttribute('paletteId');
                    let nodeDragSize: SymbolSizeModel; let nodePreviewSize: SymbolSizeModel; let paletteDragSize: SymbolSizeModel;
                    let preview: Size;
                    if (!paletteId && args.dragData) {
                        const arg: IDragEnterEventArgs | IBlazorDragEnterEventArgs = {
                            source: null, element: newObj as Node, cancel: false,
                            diagram: this,
                            dragData: args.dragData.draggedElement.ej2_instances[0].dragData,
                            dragItem: newObj
                        };
                        this.triggerEvent(DiagramEvent.dragEnter, arg);
                        let newNode: Node;
                        let newConnector: Connector;
                        // EJ2-61664 - Check whether dragItem is returned from dragEnter event or not.
                        // If it does not returned means then we do not change the treeview object as node
                        if (arg.dragItem) {
                            if ((arg.dragItem as Connector).sourcePoint && (arg.dragItem as Connector).targetPoint) {
                                newConnector = new Connector(this, 'connectors', arg.dragItem, true);
                            } else {
                                newNode = new Node(this, 'nodes', arg.dragItem, true);
                            }
                            newObj = newNode ? newNode : (newConnector as any);
                            this.initObject(newObj as IElement, undefined, undefined, true);
                            this['enterObject'] = newObj;
                            this['enterTable'] = entryTable;
                            if (newObj instanceof Node) {
                                newNode.offsetX = position.x + 5 + (newNode.width) * newNode.pivot.x;
                                newNode.offsetY = position.y + (newNode.height) * newNode.pivot.y;
                            }
                            else if (newObj instanceof Connector) {
                                const newObjBounds: Rect = Rect.toBounds([newObj.sourcePoint, newObj.targetPoint]);
                                const diffx: number = position.x - newObjBounds.left;
                                const diffy: number = position.y - newObjBounds.top;
                                newObj.sourcePoint.x += diffx; newObj.sourcePoint.y += diffy;
                                newObj.targetPoint.x += diffx; newObj.targetPoint.y += diffy;
                            }
                            this.preventDiagramUpdate = true;
                            this.currentSymbol = newObj as Node | Connector;
                            if (this.mode !== 'SVG') {
                                this.refreshDiagramLayer();
                            }
                            this.selectDragedNode(newObj, args, selectedSymbol);
                            delete this['enterObject'];
                            delete this['enterTable'];
                            this.droppable[`${selectedSymbols}`] = selectedSymbol;
                            this.allowServerDataBinding = true;
                        }
                    }
                    if (paletteId) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const sourceElement: Object = (document.getElementById(paletteId) as any).ej2_instances[0];
                        const source: string = 'sourceElement';
                        this.droppable[`${source}`] = sourceElement;
                        const childtable: string = 'childTable';
                        if (sourceElement) {
                            const obj: IElement = sourceElement[`${selectedSymbols}`];
                            const wrapper: DiagramElement = (obj.wrapper.children[0] as GroupableView).children[0];
                            if ((obj as Node).shape.type === 'Native' || (obj as Node).shape.type === 'HTML') {
                                if (((obj as Node).shape as Native | Html).content &&
                                    typeof (((obj as Node).shape as Native | Html).content) === 'function') {
                                    ((obj as Node).shape as Native | Html).content = (wrapper as
                                        DiagramNativeElement | DiagramHtmlElement).template.innerHTML;
                                }
                            }
                            this.allowServerDataBinding = false;
                            clonedObject = cloneObject(sourceElement[`${selectedSymbols}`]);
                            childTable = sourceElement[`${childtable}`];
                            preview = getPreviewSize(sourceElement, clonedObject as Node, wrapper);
                            if (sourceElement[`${selectedSymbols}`] instanceof Node) {
                                if (((obj as Node).shape as BpmnShape).shape === 'TextAnnotation') {
                                    // eslint-disable-next-line max-len
                                    (clonedObject as Node).offsetX = position.x + 11 + ((preview as Size).width) * (clonedObject as Node).pivot.x;
                                    // eslint-disable-next-line max-len
                                    (clonedObject as Node).offsetY = position.y + 11 + ((preview as Size).height) * (clonedObject as Node).pivot.y;
                                } else {
                                    // eslint-disable-next-line max-len
                                    (clonedObject as Node).offsetX = position.x + 5 + ((preview as Size).width) * (clonedObject as Node).pivot.x;
                                    // eslint-disable-next-line max-len
                                    (clonedObject as Node).offsetY = position.y + ((preview as Size).height) * (clonedObject as Node).pivot.y;
                                }
                                let newNode: Node = new Node(this, 'nodes', clonedObject as NodeModel, true);
                                if (newNode.shape.type === 'Bpmn' && (newNode.shape as BpmnShape).activity.subProcess.processes
                                    && (newNode.shape as BpmnShape).activity.subProcess.processes.length) {
                                    (newNode.shape as BpmnShape).activity.subProcess.processes = [];
                                }
                                nodeDragSize = newNode.dragSize;
                                nodePreviewSize = newNode.previewSize;
                                paletteDragSize = sourceElement['symbolDragSize'];
                                const palettePreview: SymbolSizeModel = sourceElement['symbolPreview'];
                                // eslint-disable-next-line max-len
                                newNode.width = nodeDragSize.width || paletteDragSize.width || nodePreviewSize.width || palettePreview.width || newNode.width;
                                // eslint-disable-next-line max-len
                                newNode.height = nodeDragSize.height || paletteDragSize.height || nodePreviewSize.height || palettePreview.height || newNode.height;
                                if (newNode.shape.type === 'SwimLane') {
                                    this.diagramActions |= DiagramAction.PreventHistory;
                                    if ((newNode.shape as SwimLane).isLane) {
                                        newNode.children = [];
                                        header = {
                                            id: 'header' + randomId()
                                        };
                                        if ((newNode.shape as SwimLane).orientation === 'Horizontal') {
                                            header.width = (newNode.shape as SwimLane).lanes[0].header.width;
                                            header.height = (newNode.shape as SwimLane).lanes[0].height;
                                        } else {
                                            header.width = (newNode.shape as SwimLane).lanes[0].width;
                                            header.height = (newNode.shape as SwimLane).lanes[0].header.height;
                                        }
                                        header.style = (newNode.shape as SwimLane).lanes[0].header.style;
                                        header.offsetX = position.x + dragLeft + header.width / 2;
                                        header.offsetY = position.y + header.height / 2;
                                        this.diagramActions |= DiagramAction.PreventCollectionChangeOnDragOver;
                                        header = this.add(header) as NodeModel;
                                        lane = {
                                            id: 'body' + randomId()
                                        };
                                        if ((newNode.shape as SwimLane).orientation === 'Horizontal') {
                                            lane.width = (newNode.shape as SwimLane).lanes[0].width - header.width;
                                            lane.height = (newNode.shape as SwimLane).lanes[0].height;
                                            // eslint-disable-next-line max-len
                                            lane.offsetX = position.x + dragLeft + ((newNode.shape as SwimLane).lanes[0].header.width + (lane.width / 2));
                                            lane.offsetY = position.y + lane.height / 2;
                                        } else {
                                            lane.width = (newNode.shape as SwimLane).lanes[0].width;
                                            lane.height = (newNode.shape as SwimLane).lanes[0].height - header.height;
                                            lane.offsetX = position.x + dragLeft + lane.width / 2;
                                            // eslint-disable-next-line max-len
                                            lane.offsetY = position.y + ((newNode.shape as SwimLane).lanes[0].header.height + (lane.height / 2));
                                        }
                                        lane.style = (newNode.shape as SwimLane).lanes[0].style;
                                        lane = this.add(lane) as NodeModel;
                                        const group: NodeModel = {
                                            id: 'group' + randomId(),
                                            children: [header.id, lane.id]
                                        };
                                        group.shape = newNode.shape;
                                        group.width = (newNode.shape as SwimLane).lanes[0].width;
                                        group.height = (newNode.shape as SwimLane).lanes[0].height;
                                        (group as Node).previewSize = (newNode as Node).previewSize;
                                        (group as Node).dragSize = (newNode as Node).dragSize;
                                        (group as Node).addInfo = (newNode as Node).addInfo;
                                        newNode = this.add(group) as Node;
                                        this.diagramActions &= ~DiagramAction.PreventCollectionChangeOnDragOver;
                                    }
                                    this.diagramActions &= ~DiagramAction.PreventHistory;
                                }
                                if (newNode.shape.type === 'Container') {
                                    this.diagramActions |= DiagramAction.PreventHistory;
                                    this.diagramActions |= DiagramAction.PreventCollectionChangeOnDragOver;
                                    if ((newNode.shape as Container).hasHeader) {
                                        header = {
                                            id: 'header' + randomId()
                                        };
                                        header.width = newNode.width;
                                        header.height = (newNode.shape as Container).header.height;
                                        header.style = (newNode.shape as Container).header.style;
                                    }
                                    const group: NodeModel = {
                                        id: 'group' + randomId()
                                    };
                                    (group as Node).shape = newNode.shape;
                                    ((group as Node).shape as Container).header = header;
                                    (group as Node).width = newNode.width;
                                    (group as Node).height = newNode.height;
                                    (group as Node).previewSize = (newNode as Node).previewSize;
                                    (group as Node).dragSize = (newNode as Node).dragSize;
                                    (group as Node).addInfo = (newNode as Node).addInfo;
                                    (group as Node).offsetX = (newNode as Node).offsetX;
                                    (group as Node).offsetY = (newNode as Node).offsetY;
                                    (group as Node).ports = (newNode as Node).ports;
                                    (group as Node).style = (newNode as Node).style;
                                    newNode = this.add(group) as Node;
                                    this.diagramActions &= ~DiagramAction.PreventCollectionChangeOnDragOver;
                                    this.diagramActions &= ~DiagramAction.PreventHistory;
                                }
                                if ((newNode.shape as SwimLane).isPhase) {
                                    isHorizontal = ((newNode.shape as SwimLane).orientation === 'Horizontal') ? true : false;
                                    if (isHorizontal) {
                                        newNode.offsetX = position.x + dragLeft + (newNode.width || wrapper.actualSize.width) / 2;
                                        newNode.offsetY = position.y;
                                        (newNode.shape as Path).data =
                                            'M' + 20 + ',' + (newNode.height / 2) + ' L' + (newNode.width - 20) + ',' +
                                            (newNode.height / 2) + 'z';
                                        newNode.height = 1;
                                    } else {
                                        newNode.offsetX = position.x + 5;
                                        newNode.offsetY = position.y + (newNode.height || wrapper.actualSize.height) / 2;
                                        (newNode.shape as Path).data =
                                            'M' + (newNode.width / 2) + ',' + 20 + ' L' + (newNode.width / 2) +
                                            ',' + (newNode.height - 20) + 'z';
                                        newNode.width = 1;
                                    }
                                }
                                if (newNode.shape.type === 'UmlClassifier') {
                                    //When dragging a node from the palette to the diagram, set the children, width, and height values to undefined to avoid incorrect values.
                                    newNode.children = newNode.width = newNode.height = undefined;
                                    (clonedObject as Node).children = undefined;
                                    //An empty child type is added during drag enter for every node if no child types are specified in the palette.
                                    if ((newNode.shape as UmlClassifierShapeModel).classifier === 'Class') {
                                        if ((newNode.shape as UmlClassifierShapeModel).classShape.methods.length <= 0
                                            && (newNode.shape as UmlClassifierShapeModel).classShape.attributes.length <= 0) {
                                            (newNode.shape as UmlClassifierShapeModel).classShape.attributes = [
                                                { name: 'Name', type: 'Type', style: {} }
                                            ];
                                        }
                                    }
                                    if ((newNode.shape as UmlClassifierShapeModel).classifier === 'Enumeration') {
                                        if ((newNode.shape as UmlClassifierShapeModel).enumerationShape.members.length <= 0) {
                                            (newNode.shape as UmlClassifierShapeModel).enumerationShape.members = [
                                                {
                                                    name: 'Name'
                                                }
                                            ];
                                        }
                                    }
                                    if ((newNode.shape as UmlClassifierShapeModel).classifier === 'Interface') {
                                        if ((newNode.shape as UmlClassifierShapeModel).interfaceShape.methods.length <= 0
                                            && (newNode.shape as UmlClassifierShapeModel).interfaceShape.attributes.length <= 0) {
                                            (newNode.shape as UmlClassifierShapeModel).interfaceShape.attributes = [
                                                { name: 'Name', type: 'Type', style: {} }
                                            ];
                                        }
                                    }
                                }
                                newObj = newNode;
                                if ((clonedObject as Node).children) {
                                    const parentNode: Node = (clonedObject as Node);
                                    const tempTable: {} = {};
                                    entryTable = this.getChildren(parentNode, tempTable, childTable);
                                    arrangeChild(parentNode, -parentNode.offsetX, -parentNode.offsetY, entryTable, true, this);
                                }
                            } else if (sourceElement[`${selectedSymbols}`] instanceof Connector) {
                                newObj = new Connector(this, 'connectors', clonedObject as ConnectorModel, true);
                                const bounds: Rect = Rect.toBounds([newObj.sourcePoint, newObj.targetPoint]);
                                const tx: number = position.x - bounds.left;
                                const ty: number = position.y - bounds.top;
                                newObj.sourcePoint.x += tx; newObj.sourcePoint.y += ty;
                                newObj.targetPoint.x += tx; newObj.targetPoint.y += ty;
                            }
                            if (!(newObj.shape as SwimLane).isLane && newObj.shape.type !== 'Container') {
                                newObj.id += randomId();
                            }
                            const arg: IDragEnterEventArgs | IBlazorDragEnterEventArgs = {
                                source: sourceElement, element: newObj as Node, cancel: false,
                                diagram: this, dragData: null, dragItem: newObj as Node
                            };
                            //Removed isBlazor code

                            this['enterObject'] = newObj;
                            this['enterTable'] = entryTable;
                            this.triggerEvent(DiagramEvent.dragEnter, arg);
                            if ((newObj instanceof Node) && newObj.shape.type === 'SwimLane' && (newObj.shape as SwimLane).isLane) {
                                const swimLaneObj: NodeModel = arg.element as NodeModel;
                                const laneObj: LaneModel = (swimLaneObj.shape as SwimLane).lanes[0];
                                //let child1: NodeModel; let child2: NodeModel;
                                isHorizontal = ((swimLaneObj.shape as SwimLane).orientation === 'Horizontal') ? true : false;
                                const child1: NodeModel = this.nameTable[newObj.children[0]];
                                const child2: NodeModel = this.nameTable[newObj.children[1]];
                                nodeDragSize = newObj.dragSize;
                                nodePreviewSize = newObj.previewSize;
                                paletteDragSize = sourceElement['symbolDragSize'];
                                laneObj.width = nodeDragSize.width || paletteDragSize.width || nodePreviewSize.width || laneObj.width;
                                laneObj.height = nodeDragSize.height || paletteDragSize.height || nodePreviewSize.height || laneObj.height;
                                if (isHorizontal) {
                                    header.width = laneObj.header.width;
                                    header.height = laneObj.height;
                                    lane.width = laneObj.width - header.width;
                                    lane.height = laneObj.height;
                                    lane.offsetX = position.x + dragLeft + (laneObj.header.width + (child2.width / 2));
                                    lane.offsetY = position.y + child2.height / 2;
                                } else {
                                    header.width = laneObj.width;
                                    header.height = laneObj.header.height;
                                    lane.width = laneObj.width;
                                    lane.height = laneObj.height - header.height;
                                    lane.offsetX = position.x + dragLeft + child2.width / 2;
                                    lane.offsetY = position.y + (laneObj.header.height + (child2.height / 2));
                                }
                                header.offsetX = position.x + dragLeft + child1.width / 2;
                                header.offsetY = position.y + child1.height / 2;
                                newObj.width = laneObj.width;
                                newObj.height = laneObj.height;
                            }
                            if ((newObj instanceof Node) && (newObj.shape as SwimLane).isPhase) {
                                if (isHorizontal) {
                                    newObj.height = 1;
                                } else {
                                    newObj.width = 1;
                                }
                            }
                            let restrictAdding: boolean = false;
                            if ((this.element as any).ej2_instances[0].constraints & DiagramConstraints.RestrictNegativeAxisDragDrop) {
                                if (newObj instanceof Node) {
                                    const x: number = (newObj as Node).offsetX - (newObj as Node).width * (newObj as Node).pivot.x;
                                    const y: number = (newObj as Node).offsetY - (newObj as Node).height * (newObj as Node).pivot.y;
                                    restrictAdding = x < 0 || y < 0;
                                } else if (newObj instanceof Connector) {
                                    const x: number = Math.min((newObj as Connector).sourcePoint.x, (newObj as Connector).targetPoint.x);
                                    const y: number = Math.min((newObj as Connector).sourcePoint.y, (newObj as Connector).targetPoint.y);
                                    restrictAdding = x < 0 || y < 0;
                                }
                                if (restrictAdding) {
                                    (this.element as any).ej2_instances[0].setCursor('not-allowed');
                                }
                            }
                            if (!this.activeLayer.lock && !arg.cancel && !restrictAdding) {
                                this.preventDiagramUpdate = true;
                                if ((newObj as Node).children) {
                                    this.findChild((newObj as Node), entryTable);
                                }
                                this.preventDiagramUpdate = true;
                                if (newObj.zIndex !== Number.MIN_VALUE) {
                                    newObj.zIndex = Number.MIN_VALUE;
                                }
                                if (newObj.shape.type !== 'Container') {
                                    this.initObject(newObj as IElement, undefined, undefined, true);
                                }
                                if (this.bpmnModule) {
                                    for (let i: number = 0; i < this.bpmnModule.bpmnTextAnnotationConnector.length; i++) {
                                        if (this.bpmnModule.bpmnTextAnnotationConnector[parseInt(i.toString(), 10)].wrapper === null) {
                                            this.initConnectors(this.bpmnModule.bpmnTextAnnotationConnector[parseInt(i.toString(), 10)],
                                                                undefined, true);
                                        }
                                    }
                                }
                                this.selectDragedNode(newObj, args, selectedSymbol);
                            }
                            delete this['enterObject'];
                            delete this['enterTable'];
                        }
                        this.droppable[`${selectedSymbols}`] = selectedSymbol;
                        this.allowServerDataBinding = true;
                    }
                }
            } else {
                if (args.event.touches && args.event.touches.length) {
                    this.eventHandler.mouseMove(args.event, args.event.touches);
                }
            }
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.droppable.drop = async (args: any) => {
            this.allowServerDataBinding = false;
            const source: string = 'sourceElement';
            let value: NodeModel | ConnectorModel;
            if (this.currentSymbol) {
                let isPhase: boolean = false; let orientation: Orientation; //let isConnector: boolean;
                const isConnector: boolean = (this.currentSymbol instanceof Connector) ? true : false;
                if (args.event.touches) {
                    this.eventHandler.mouseUp(args.event);
                }
                //let newObj: NodeModel | Connector; let node: Node; let conn: Connector;
                const arg: IDropEventArgs | IBlazorDropEventArgs = {
                    source: this.droppable[`${source}`],
                    element: this.currentSymbol,
                    //EJ2-895314: Connector splits while dropping node on diagram, even after moving node away from connector highlighter
                    target: this.eventHandler['hoverNode'] ||
                        (this.findObjectsUnderMouse(this.eventHandler.getMousePosition(args.event))[0]) || this,
                    cancel: false,
                    position: { x: this.currentSymbol.wrapper.offsetX, y: this.currentSymbol.wrapper.offsetY }
                };
                // Removed isBlazor code
                this.commandHandler.PreventConnectorSplit = false;
                this.triggerEvent(DiagramEvent.drop, arg);
                const id: string = 'id';
                const clonedObject: Object = cloneObject(this.currentSymbol); clonedObject['hasTarget'] = this.currentSymbol['hasTarget'];
                this.removeFromAQuad(this.currentSymbol);
                this.removeObjectsFromLayer(this.nameTable[this.currentSymbol.id]);
                this.removeElements(this.currentSymbol);
                //887625-UML class nodes cloned in diagram canvas while dragging nodes outside diagram page
                if (((this.currentSymbol.shape as SwimLaneModel).isLane ||
                    (this.currentSymbol.shape as SwimLaneModel).isPhase) || this.currentSymbol.shape.type === 'UmlClassifier'
                    || this.currentSymbol.shape.type === 'Container') {
                    this.removeChildInNodes(this.currentSymbol as Node);
                }
                if (arg.cancel) { removeChildNodes(this.currentSymbol as Node, this); }
                if ((this.currentSymbol.shape as SwimLaneModel).isPhase) {
                    isPhase = true;
                    orientation = (this.currentSymbol.shape as SwimLaneModel).orientation;
                    ((clonedObject as Node).shape as SwimLaneModel).phases = (this.currentSymbol.shape as SwimLaneModel).phases;
                }
                this.removePreviewChildren(this.currentSymbol as Node);
                delete this.nameTable[this.currentSymbol.id]; this.currentSymbol = null;
                this.protectPropertyChange(true);
                this.itemType = 'SymbolPalette';
                if (!arg.cancel) {
                    this.startGroupAction();
                    if (clonedObject && (((clonedObject as Node).shape as SwimLaneModel).isLane || isPhase)) {
                        if (isPhase) {
                            ((clonedObject as Node).shape as SwimLaneModel).isPhase = isPhase;
                            ((clonedObject as Node).shape as SwimLaneModel).orientation = orientation;
                        }
                        this.eventHandler.addSwimLaneObject(clonedObject);
                    }
                    //The following condition is designed to ensure that only UML nodes are added to the diagram during the drop operation
                    if (clonedObject && (clonedObject as Node).shape.type === 'UmlClassifier' && !((clonedObject as Node).shape as RelationShipModel).relationship) {
                        (clonedObject as Node).children = undefined;
                        this.clearSelectorLayer();
                        this.add(clonedObject);
                    }
                    if (((clonedObject as Node).shape as BpmnShape).type === 'Bpmn' && ((clonedObject as Node).shape as BpmnShape).annotation
                        && clonedObject['hasTarget']) {
                        const nodeId: string = (((clonedObject as Node).shape as BpmnShape).annotation as BpmnAnnotation).nodeId;
                        ((clonedObject as Node).shape as BpmnShape).annotation.id = (clonedObject as Node).id;
                        this.addTextAnnotation(((clonedObject as Node).shape as BpmnShape).annotation, this.nameTable[`${nodeId}`]);
                        (clonedObject as BpmnAnnotation).nodeId = '';
                    }
                    if (!((clonedObject as Node).shape as SwimLaneModel).isLane && !isPhase && ((clonedObject as Connector).type !== undefined || (clonedObject as Node).shape.type !== 'UmlClassifier')) {
                        if ((clonedObject as Node).children) {
                            this.addChildNodes(clonedObject);
                        }
                        //Bug 880814: Adding element to bpmn expanded subprocess located in swimlane throws an exception.
                        // isTargetSubProcess is checked.
                        if (arg.target && (arg.target instanceof Node) && !isConnector && checkParentAsContainer(this, arg.target)
                            && canAllowDrop(arg.target) && !this.commandHandler.isTargetSubProcess(arg.target)) {
                            addChildToContainer(this, arg.target, clonedObject);
                        } else {
                            // EJ2-62652 - Added below code to empty the segment collection if connector type is bezier
                            if ((clonedObject as Connector).type === 'Bezier' && (clonedObject as Connector).segments.length > 0) {
                                (clonedObject as Connector).segments = [];
                            }
                            value = this.add(clonedObject, true);
                        }
                        //EJ2-864543 - Added symbols don't get correctly selected in MultipleSelect mode in Diagram
                        if ((clonedObject || value) && (canSingleSelect(this) || canMultiSelect(this))) {
                            this.select([this.nameTable[clonedObject[`${id}`]]], false, this.previousSelectedObjects);
                        }
                        //EJ2-909180 - Line routing does not take place when drag and drop from symbol Palatte
                        if (this.lineRoutingModule && (this.constraints & DiagramConstraints.LineRouting)) {
                            this.commandHandler.updateSelectedNodeProperties(this.selectedItems as object);
                        }
                        if (arg.target && arg.target instanceof Connector) {
                            if (this.enableConnectorSplit === true) {
                                if (this.nameTable[clonedObject[`${id}`]] instanceof Node) {
                                    this.commandHandler.connectorSplit(this.nameTable[clonedObject[`${id}`]], arg.target);
                                    this.commandHandler.PreventConnectorSplit = false;
                                }
                            }
                        }
                    }
                } else {
                    this.clearSelectorLayer();
                }
                this.protectPropertyChange(false);
                const newObj: NodeModel | Connector = this.nameTable[clonedObject[`${id}`]];
                if (clonedObject['hasTarget']) {
                    (clonedObject as BpmnAnnotation).nodeId = clonedObject['hasTarget'];
                    this.remove(clonedObject);
                }
                if (this.bpmnModule && newObj instanceof Node && (clonedObject as Node).processId) {
                    newObj.processId = (clonedObject as Node).processId;
                    this.bpmnModule.dropBPMNchild(this.nameTable[newObj.processId], newObj, this);
                }
                // 967788 : selection issue when drag and drop child from palette to container
                if (newObj instanceof Node && (clonedObject as Node).parentId && this.nameTable[(clonedObject as Node).parentId]
                    && this.nameTable[(clonedObject as Node).parentId].shape.type === 'Container') {
                    newObj.parentId = (clonedObject as Node).parentId;
                    dropContainerChild(this.nameTable[newObj.parentId], newObj, this);
                }
                if (!arg.cancel) {
                    this.endGroupAction();
                }
                if (this.mode !== 'SVG') { this.refreshDiagramLayer(); }
                delete this.droppable[`${source}`];
            }
            else {
                const arg: IDropEventArgs | IBlazorDropEventArgs = {
                    source: cloneBlazorObject(args.droppedElement),
                    element: undefined,
                    target: cloneBlazorObject(this.eventHandler['hoverNode'] || (this.eventHandler['lastObjectUnderMouse']) || this), cancel: false,
                    position: undefined
                };
                //Removed is Blazor code.
                this.triggerEvent(DiagramEvent.drop, arg); let clonedObject: Object; const id: string = 'id';
            }
            const selectedSymbols: string = 'selectedSymbols';
            // eslint-disable-next-line max-len
            if (this.droppable[`${selectedSymbols}`] && this.droppable[`${selectedSymbols}`].parentNode) { remove(this.droppable[`${selectedSymbols}`]); } else {
                const draggableElement: HTMLCollection = document.getElementsByClassName('e-dragclone') as HTMLCollection;
                for (let i: number = 0; i < draggableElement.length; i++) {
                    draggableElement[parseInt(i.toString(), 10)].remove();
                }
            }
            this.allowServerDataBinding = true;
            this.previousSelectedObjects = [];
        };

        this.droppable.out = (args: Object) => {
            // EJ2-57221 - Added the below code to check if we drag the node from symbol palette using touch or mouse.
            if ((args as any).evt.type === 'touchmove') {
                this.eventHandler.mouseLeave((args as any).evt);
            }
            if (this.currentSymbol && (!this.eventHandler.focus)) {
                this.unSelect(this.currentSymbol); this.removeFromAQuad(this.currentSymbol);
                if (this.mode !== 'SVG' && this.currentSymbol.shape.type === 'Native') {
                    this.removeElements(this.currentSymbol);
                }
                this.removeObjectsFromLayer(this.nameTable[this.currentSymbol.id]);
                if (this.currentSymbol.shape && (this.currentSymbol.shape as BpmnShape).shape === 'TextAnnotation') {
                    const con = this.nameTable[this.currentSymbol.inEdges[0]];
                    this.removeObjectsFromLayer(this.nameTable[con.id]);
                    this.removeFromAQuad(con);
                    this.removePreviewChildren(con);
                    delete this.nameTable[con.id];
                    const index = this.connectors.indexOf(con);
                    this.connectors.splice(index, 1);
                    this.removeElements(con);
                }
                this.removePreviewChildren(this.currentSymbol as Node);
                delete this.nameTable[this.currentSymbol.id];
                const args: IDragLeaveEventArgs | IBlazorDragLeaveEventArgs = {
                    element: cloneBlazorObject(this.currentSymbol),
                    diagram: this
                };
                //Removed is Blazor code
                this.triggerEvent(DiagramEvent.dragLeave, args);
                if (this.mode !== 'SVG') { this.refreshDiagramLayer(); } else {
                    this.removeElements(this.currentSymbol);
                    //EJ2-833020-To remove the child element from the group node while dragging the group node from palette
                    //EJ2-842739- Error When Dragging Swimlane from Palette to Diagram and Exiting Without Dropping
                    if ((this.currentSymbol as Node).shape.type !== 'SwimLane' && (this.currentSymbol as Node).children && (this.currentSymbol as Node).children.length > 0) {
                        for (let i: number = 0; i < (this.currentSymbol as Node).children.length; i++) {
                            const child: NodeModel = this.nameTable[(this.currentSymbol as Node).children[parseInt(i.toString(), 10)]];
                            this.removeElements(child);
                            delete this.nameTable[(this.currentSymbol as Node).children[parseInt(i.toString(), 10)]];
                        }
                    }
                    if ((this.currentSymbol as Node).shape.type === 'Container' && ((this.currentSymbol as Node).shape as Container).hasHeader) {
                        const child: NodeModel = this.nameTable[this.currentSymbol.id +
                                                                ((this.currentSymbol as Node).shape as Container).header.id];
                        this.removeFromAQuad(child as Node);
                        delete this.nameTable[child.id];
                        this.removeElements(child);
                    }
                }
                this.currentSymbol = null; const selectedSymbols: string = 'selectedSymbols';
                this.droppable[`${selectedSymbols}`].style.opacity = '1';
                const source: string = 'sourceElement';
                delete this.droppable[`${source}`];
                this.diagramRenderer.rendererActions =
                    this.removeConstraints(this.diagramRenderer.rendererActions, RendererAction.DrawSelectorBorder);
                if (this.previousSelectedObject) {
                    this.select(this.previousSelectedObject, this.previousSelectedObject.length > 1 ? true : false);
                }
                this.previousSelectedObject = null;
            }
        };
    }
    // Removed Blazor getBlazorDragLeaveEventArgs method

    private getDropEventArgs(arg: IBlazorDropEventArgs) {
        if ((this.eventHandler['lastObjectUnderMouse'] || this.eventHandler['hoverNode'])) {
            const object: NodeModel | ConnectorModel = this.eventHandler['lastObjectUnderMouse'] || this.eventHandler['hoverNode'];
            // eslint-disable-next-line max-len
            arg.target = getObjectType(object) === Connector ? { connector: cloneBlazorObject(object) as ConnectorModel } : { node: cloneBlazorObject(object) as NodeModel };
        } else {
            (arg as IBlazorDropEventArgs).target.diagramId = this.element.id;
        }
    }


    private removeChildInNodes(node: NodeModel) {
        if (node && node.shape.type !== 'Container') {
            if (node.children) {
                for (let i: number = 0; i < node.children.length; i++) {
                    this.removeChildInNodes(this.nameTable[node.children[parseInt(i.toString(), 10)]]);
                }
            }
            const index: number = this.nodes.indexOf(node as Node);
            if (index !== -1) {
                this.nodes.splice(index, 1);
            }
        } else if (node && node.shape.type === 'Container') {
            if ((node.shape as Container).hasHeader) {
                this.removeChildInNodes(this.nameTable[node.id + (node.shape as Container).header.id]);

            }
            const index: number = this.nodes.indexOf(node);
            if (index !== -1) {
                this.nodes.splice(index, 1);
            }
        }
    }

    private getBlazorDragEventArgs(args: IBlazorDragEnterEventArgs | IDragEnterEventArgs): IBlazorDragEnterEventArgs {
        args = {
            // eslint-disable-next-line max-len
            source: cloneBlazorObject(args.source), element: getObjectType(args.element) === Connector ? { connector: cloneBlazorObject(args.element) }
                : { node: cloneBlazorObject(args.element) },
            cancel: args.cancel, diagramId: this.element.id
        };
        return args as IBlazorDragEnterEventArgs;
    }

    private findChild(node: NodeModel, childTable: {}): void {
        let group: NodeModel;
        let newNode: Node;
        for (let i: number = 0; i < node.children.length; i++) {
            group = childTable[node.children[parseInt(i.toString(), 10)]];
            if (group) {
                if (group.children) {
                    this.findChild(group, childTable);
                }
                group.id = group.id + randomId();
                childTable[group.id] = group;
                node.children[parseInt(i.toString(), 10)] = group.id;
                newNode = new Node(this, 'nodes', group, true);
                this.initObject(newNode, undefined, undefined, true);
                //this.add(group, true);
            }
        }
    }
    private getChildren(node: NodeModel, entryTable: {}, childTable: {}): {} {
        let temp: NodeModel;
        for (let i: number = 0; i < node.children.length; i++) {
            temp = (childTable[node.children[parseInt(i.toString(), 10)]]);
            if (temp) {
                if (temp.children) {
                    entryTable = this.getChildren(temp, entryTable, childTable);
                }
                entryTable[temp.id] = cloneObject(temp);
            }
        }
        return entryTable;
    }
    private addChildNodes(node: NodeModel): void {
        let temp: NodeModel;
        for (let i: number = 0; i < node.children.length; i++) {
            temp = (this.nameTable[node.children[parseInt(i.toString(), 10)]]);
            if (temp) {
                if (temp.children) {
                    this.addChildNodes(temp);
                }
                this.add(temp, true);
            }
        }
    }

    private moveNode(node: NodeModel | ConnectorModel): void {
        const currentLayer: LayerModel = this.commandHandler.getObjectLayer(node.id);
        const index: number = currentLayer.zIndex;
        const length: number = currentLayer.objects.length;
        let targetLayer: LayerModel;
        for (let i: number = 0; i < this.layers.length; i++) {
            if (index === this.layers[parseInt(i.toString(), 10)].zIndex) {
                targetLayer = this.layers[i + 1];
            }
        }
        if (length > 1) {
            // Bug 830365: Exception raised on adding group node in layers dynamically.
            // Added below code to check the group node and iterate its children in layer to find the last object in the layer.
            let num = 2;
            if ((node as NodeModel).children && (node as NodeModel).children.length > 0) {
                while ((node as NodeModel).children.indexOf(currentLayer.objects[length - num]) > -1) {
                    num++;
                }
            }
            if (length - num > -1) {
                this.commandHandler.moveSvgNode(node.id, currentLayer.objects[length - num]);
                this.commandHandler.moveSvgNode(currentLayer.objects[length - num], node.id);
            }
        } else {
            if (targetLayer) {
                const targetObject: string = this.commandHandler.getLayer(this.layerZIndexTable[targetLayer.zIndex]).objects[0];
                if (targetObject) {
                    this.commandHandler.moveSvgNode(node.id, targetObject);
                    this.commandHandler.updateNativeNodeIndex(node.id, targetObject);
                } else {
                    this.moveObjectsUp(node, currentLayer);
                }
            } else {
                this.moveObjectsUp(node, currentLayer);
            }
        }
    }


    /**
     * Moves the node or connector forward within the given layer. \
     *
     * @returns { void }  Moves the node or connector forward within the given layer.\
     * @param {Node | Connector} node - The node or connector to be moved forward within the layer.
     * @param {LayerModel} currentLayer - representing the layer in which the node or connector should be moved.
     *
     */
    public moveObjectsUp(node: NodeModel | ConnectorModel, currentLayer: LayerModel): void {
        let targetLayer: LayerModel;
        for (let i: number = this.layers.length - 1; i >= 0; i--) {
            targetLayer = this.layers[parseInt(i.toString(), 10)];
            if (currentLayer.id !== targetLayer.id) {
                // eslint-disable-next-line max-len
                const targetObject: string = this.commandHandler.getLayer(this.layerZIndexTable[targetLayer.zIndex]).objects[targetLayer.objects.length - 1];
                if (targetObject) {
                    this.commandHandler.moveSvgNode(node.id, targetObject);
                    this.commandHandler.moveSvgNode(targetObject, node.id);
                    break;
                }
            }
        }
    }


    /**
     * Inserts a newly added element into the database. \
     *
     * @returns { void }  Inserts a newly added element into the database.\
     * @param {Node | Connector} node - The node or connector to be inserted into the database.
     *
     */
    public insertData(node?: Node | Connector): object {
        return this.crudOperation(node, 'create', this.getNewUpdateNodes('New'));
    }


    /**
     * Updates user-defined element properties in the existing database. \
     *
     * @returns { void }     Updates user-defined element properties in the existing database.\
     * @param {Node | Connector} node - The source value representing the element to update.
     *
     */
    public updateData(node?: Node | Connector): object {
        return this.crudOperation(node, 'update', this.getNewUpdateNodes('Update'));
    }


    /**
     * Removes the user-deleted element from the existing database.\
     *
     * @returns { void }     Removes the user-deleted element from the existing database.\
     * @param {Node | Connector} node - The node or connector to be removed from the database.
     *
     */
    public removeData(node?: Node | Connector): object {
        return this.crudOperation(node, 'destroy', this.getDeletedNodes());
    }

    /**
     * Evenly distributes the ports on the edges of the specified nodes.
     * Calculates the position of each port based on the total number of ports
     * and distributes them uniformly along the edge(s).
     * @returns { void }  Evenly distributes the ports on the edges of the specified nodes.
     * @param {string[]} nodeIds - An array of node IDs on which the ports need to be distributed.
     */
    public distributePorts(nodeIds: string[]): void {
        for (let n = 0; n < nodeIds.length; n++) {
            const node: Node = this.nameTable[nodeIds[parseInt(n.toString(), 10)]];
            if (!node || !node.ports || !node.width || !node.height) {
                continue;
            }
            for (let i = 0; i < node.ports.length; i++) {
                const port: PointPortModel = node.ports[parseInt(i.toString(), 10)];
                let totalConnectors: number = 0;
                if (port.inEdges && port.inEdges.length) {
                    totalConnectors += port.inEdges.length;
                }
                if (port.outEdges && port.outEdges.length) {
                    totalConnectors += port.outEdges.length;
                }
                if (totalConnectors > 1) {
                    continue;
                }
                const x: number = port.offset.x * node.width;
                const y: number = port.offset.y * node.height;
                const distLeft: number = x;
                const distRight: number = node.width - x;
                const distTop: number = y;
                const distBottom: number = node.height - y;
                const distances: { edge: Direction, value: number }[] = [
                    { edge: 'Left', value: distLeft },
                    { edge: 'Right', value: distRight },
                    { edge: 'Top', value: distTop },
                    { edge: 'Bottom', value: distBottom }
                ];
                const minDist: number = Math.min(distLeft, distRight, distTop, distBottom);
                const minEdges: { edge: Direction, value: number }[] = distances.filter(d => d.value === minDist);
                let chosenEdge: Direction = minEdges[0].edge;
                if (minEdges.length > 1) {
                    let connector: Connector = null;
                    if (port.outEdges && port.outEdges.length > 0) {
                        connector = this.nameTable[port.outEdges[0]];
                    } else if (port.inEdges && port.inEdges.length > 0) {
                        connector = this.nameTable[port.inEdges[0]];
                    }
                    if (connector) {
                        const target: PointModel = connector.targetPoint;
                        if (target) {
                            const nodeLeft: number = node.offsetX - node.width * node.pivot.x;
                            const nodeTop: number = node.offsetY - node.height * node.pivot.y;
                            const portAbs: {
                                x: number;
                                y: number;
                            } = {
                                x: nodeLeft + port.offset.x * node.width,
                                y: nodeTop + port.offset.y * node.height
                            };
                            const dx: number = target.x - portAbs.x;
                            const dy: number = target.y - portAbs.y;
                            const absDx: number = Math.abs(dx); const absDy: number = Math.abs(dy);
                            if (absDx > absDy) {
                                if (dx < 0 && minEdges.some(e => e.edge === 'Left')) {
                                    chosenEdge = 'Left';
                                }
                                else if (dx > 0 && minEdges.some(e => e.edge === 'Right')) {
                                    chosenEdge = 'Right';
                                }
                            } else {
                                if (dy < 0 && minEdges.some(e => e.edge === 'Top')) {
                                    chosenEdge = 'Top';
                                }
                                else if (dy > 0 && minEdges.some(e => e.edge === 'Bottom')) {
                                    chosenEdge = 'Bottom';
                                }
                            }
                        }
                    }
                }
                switch (chosenEdge) {
                case 'Left': {
                    port.offset.x = 0;
                    break;
                }
                case 'Right': {
                    port.offset.x = 1;
                    break;
                }
                case 'Top': {
                    port.offset.y = 0;
                    break;
                }
                case 'Bottom': {
                    port.offset.y = 1;
                    break;
                }
                }
            }
            const edgeGroups: {
                Left: PointPortModel[], Right: PointPortModel[], Top: PointPortModel[],
                Bottom: PointPortModel[]
            } = { Left: [], Right: [], Top: [], Bottom: [] };
            for (let j = 0; j < node.ports.length; j++) {
                const port: PointPortModel = node.ports[parseInt(j.toString(), 10)];
                if (port.offset.x === 0) {
                    edgeGroups.Left.push(port);
                }
                else if (port.offset.x === 1) {
                    edgeGroups.Right.push(port);
                }
                else if (port.offset.y === 0) {
                    edgeGroups.Top.push(port);
                }
                else if (port.offset.y === 1) {
                    edgeGroups.Bottom.push(port);
                }
            }
            (['Left', 'Right', 'Top', 'Bottom']).forEach((edge: Direction) => {
                const ports = edgeGroups[`${edge}`];
                if (ports.length === 0) {
                    return;
                }
                ports.sort(this.callSort(node, edge, this));
                const N: number = ports.length;
                for (let i = 0; i < N; i++) {
                    const port: PointPortModel = ports[parseInt(i.toString(), 10)];
                    let totalConnectors: number = 0;
                    if (port.inEdges && port.inEdges.length) {
                        totalConnectors += port.inEdges.length;
                    }
                    if (port.outEdges && port.outEdges.length) {
                        totalConnectors += port.outEdges.length;
                    }
                    if (totalConnectors > 1) {
                        continue;
                    }
                    const pos: number = (i + 1) / (N + 1);
                    if (edge === 'Left' || edge === 'Right') {
                        port.offset.y = pos;
                    } else {
                        port.offset.x = pos;
                    }
                }
            });
        }
    }

    private getProjectedOffset(
        port: PointPortModel,
        node: Node,
        edge: Direction): PointModel {
        const nodeLeft: number = node.offsetX - node.width * node.pivot.x;
        const nodeTop: number = node.offsetY - node.height * node.pivot.y;
        return { x: nodeLeft + port.offset.x * node.width, y: nodeTop + port.offset.y * node.height };
    }

    private callSort(node: Node, edge: Direction, diagram: Diagram): (a: PointPortModel, b: PointPortModel) => number {
        return (a: PointPortModel, b: PointPortModel) => {
            const aHasConn: number = (a.outEdges && a.outEdges.length) || (a.inEdges && a.inEdges.length);
            const bHasConn: number = (b.outEdges && b.outEdges.length) || (b.inEdges && b.inEdges.length);
            const aVal: PointModel = aHasConn ? diagram.getConnectorTargetOffset(a, node, edge, diagram)
                : diagram.getProjectedOffset(a, node, edge);
            const bVal: PointModel = bHasConn ? diagram.getConnectorTargetOffset(b, node, edge, diagram)
                : diagram.getProjectedOffset(b, node, edge);
            if (edge === 'Top' || edge === 'Bottom') {
                return (aVal.x - bVal.x) === 0 ? (bVal.y - aVal.y) : (aVal.x - bVal.x);
            } else {
                return (aVal.y - bVal.y) === 0 ? (bVal.x - aVal.x) : (aVal.y - bVal.y);
            }
        };
    }

    private getConnectorTargetOffset(
        port: PointPortModel,
        node: Node,
        edge: Direction,
        diagram: Diagram
    ): PointModel {
        let connector: Connector = null;
        if (port.outEdges && port.outEdges.length > 0) {
            connector = diagram.nameTable[port.outEdges[0]];
        } else if (port.inEdges && port.inEdges.length > 0) {
            connector = diagram.nameTable[port.inEdges[0]];
        }
        if (connector) {
            return connector.targetPoint;
        }
        return this.getProjectedOffset(port, node, edge);
    }

    private crudOperation(node: Node | Connector, crud: string, getNodesCollection: IDataSource) {
        if (node) {
            const data: object = this.parameterMap(node, node instanceof Connector ? false : true);
            if (data) {
                // eslint-disable-next-line max-len
                const url: string = node instanceof Connector ? this.dataSourceSettings.connectionDataSource.crudAction[`${crud}`] : this.dataSourceSettings.crudAction[`${crud}`];
                this.raiseAjaxPost(JSON.stringify(data), url);
            }
            return data;
        }
        else {
            const newObjects: IDataSource = getNodesCollection;
            // eslint-disable-next-line max-len
            this.processCrudCollection(newObjects, this.dataSourceSettings.crudAction[`${crud}`], this.dataSourceSettings.connectionDataSource.crudAction[`${crud}`]);
            return newObjects;
        }
    }

    private processCrudCollection(newObjects: IDataSource, nodeCrudAction: string, connectorCrudAction: string): void {
        if (newObjects.nodes) {
            const data: Object[] = [];
            let i: number;
            for (i = 0; i < newObjects.nodes.length; i++) {
                data.push(this.parameterMap(newObjects.nodes[parseInt(i.toString(), 10)] as Node, true));
            }
            if (data && data.length > 0) {
                this.raiseAjaxPost(JSON.stringify(data), nodeCrudAction);
            }
        }
        if (newObjects.connectors) {
            const data: Object[] = [];
            let i: number;
            for (i = 0; i < newObjects.connectors.length; i++) {
                data.push(this.parameterMap(newObjects.connectors[parseInt(i.toString(), 10)] as Connector, false));
            }
            if (data && data.length > 0) {
                this.raiseAjaxPost(JSON.stringify(data), connectorCrudAction);
            }
        }
    }

    private parameterMap(object: Node | Connector, isNode: boolean): object {
        const mappingObj: object = {};
        let i: number;
        const fields: IFields = isNode ? this.dataSourceSettings as IFields : this.dataSourceSettings.connectionDataSource as IFields;
        if (fields.id) {
            mappingObj[fields.id] = object.id;
        }
        if (fields.sourcePointX && fields.sourcePointY) {
            mappingObj[fields.sourcePointX] = (object as Connector).sourcePoint.x;
            mappingObj[fields.sourcePointY] = (object as Connector).sourcePoint.y;
        }
        if (fields.targetPointX && fields.targetPointY) {
            mappingObj[fields.targetPointX] = (object as Connector).targetPoint.x;
            mappingObj[fields.targetPointY] = (object as Connector).targetPoint.y;
        }
        if (fields.sourceID) {
            mappingObj[fields.sourceID] = (object as Connector).sourceID;
        }
        if (fields.targetID) {
            mappingObj[fields.targetID] = (object as Connector).targetID;
        }
        if (fields.crudAction && fields.crudAction.customFields && fields.crudAction.customFields.length > 0) {
            for (i = 0; i < fields.crudAction.customFields.length; i++) {
                mappingObj[fields.crudAction.customFields[parseInt(i.toString(), 10)]]
                    = object[fields.crudAction.customFields[parseInt(i.toString(), 10)]];
            }
        }
        return mappingObj;
    }

    private getNewUpdateNodes(status: string): IDataSource {
        const nodes: NodeModel[] = [];
        const connectors: ConnectorModel[] = [];
        // eslint-disable-next-line guard-for-in
        for (const name in this.nameTable) {
            const node: Node | Connector = this.nameTable[`${name}`];
            if (node.status === status) {
                if (node && node instanceof Connector) {
                    node.status = 'None';
                    connectors.push(node);
                }
                else {
                    node.status = 'None';
                    nodes.push(node as Node);
                }
            }
        }
        return { nodes: nodes, connectors: connectors } as IDataSource;
    }

    private getDeletedNodes(): IDataSource {
        const nodes: NodeModel[] = [];
        const connectors: ConnectorModel[] = [];
        let i: number;
        for (i = 0; i < this.crudDeleteNodes.length; i++) {
            const node: (NodeModel | ConnectorModel) = this.crudDeleteNodes[parseInt(i.toString(), 10)];
            if (node && (node as ConnectorModel).segments) {
                connectors.push(node as ConnectorModel);
            }
            else if (node) {
                nodes.push(node as NodeModel);
            }
        }
        this.crudDeleteNodes = [];
        return { nodes: nodes, connectors: connectors } as IDataSource;
    }

    private raiseAjaxPost(value: string, url: string): void {
        const callback: Fetch = new Fetch(
            url, 'POST', 'application/json'
        );
        const data: string = JSON.stringify(JSON.parse(value));
        callback.send(data).then();
        /* eslint-disable */
        callback.onSuccess = (data: DataManager): void => {

        };
        /* eslint-enable */
    }

    private getHiddenItems(args: BeforeOpenCloseMenuEventArgs): string[] {
        const hiddenItems: string[] = [];
        if (this.contextMenuModule) {
            this.contextMenuModule.hiddenItems = [];
            for (const item of args.items) {
                this.contextMenuModule.ensureItems(item, args.event);
                if (item.items && item.items.length) {
                    for (const newItem of item.items) {
                        this.contextMenuModule.ensureItems(newItem, args.event);
                    }
                }
            }
            return this.contextMenuModule.hiddenItems;
        }
        return hiddenItems;
    }
}
