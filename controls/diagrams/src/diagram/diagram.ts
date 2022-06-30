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
import { Component, Property, Complex, Collection, EventHandler, L10n, Droppable, remove, Ajax, isBlazor, blazorTemplates } from '@syncfusion/ej2-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { Browser, ModuleDeclaration, Event, EmitType } from '@syncfusion/ej2-base';
import { INotifyPropertyChanged, updateBlazorTemplate, resetBlazorTemplate } from '@syncfusion/ej2-base';
import { DiagramModel } from './diagram-model';
import { CanvasRenderer } from './rendering/canvas-renderer';
import { SvgRenderer } from './rendering/svg-renderer';
import { DiagramRenderer } from './rendering/renderer';
import { BaseAttributes } from './rendering/canvas-interface';
import { PageSettings, ScrollSettings } from './diagram/page-settings';
import { PageSettingsModel, ScrollSettingsModel } from './diagram/page-settings-model';
import { DiagramElement } from './core/elements/diagram-element';
import { ServiceLocator } from './objects/service';
import { IElement, IDataLoadedEventArgs, ISelectionChangeEventArgs } from './objects/interface/IElement';
import { IClickEventArgs, ScrollValues, FixedUserHandleClickEventArgs } from './objects/interface/IElement';
import { ChangedObject, IBlazorTextEditEventArgs, DiagramEventObject, DiagramEventAnnotation } from './objects/interface/IElement';
import { IBlazorDragLeaveEventArgs } from './objects/interface/IElement';
import { UserHandleEventsArgs } from './objects/interface/IElement';
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
import { ZoomOptions, IPrintOptions, IExportOptions, IFitOptions, ActiveLabel } from './objects/interface/interfaces';
import { View, IDataSource, IFields } from './objects/interface/interfaces';
import { Container } from './core/containers/container';
import { Node, BpmnShape, BpmnAnnotation, SwimLane, Path, DiagramShape, UmlActivityShape, FlowShape, BasicShape } from './objects/node';
import { cloneBlazorObject, cloneSelectedObjects, findObjectIndex, selectionHasConnector } from './utility/diagram-util';
import { checkBrowserInfo } from './utility/diagram-util';
import { updateDefaultValues, getCollectionChangeEventArguements } from './utility/diagram-util';
import { flipConnector, updatePortEdges, alignElement, setConnectorDefaults, getPreviewSize } from './utility/diagram-util';
import { Segment } from './interaction/scroller';
import { Connector, BezierSegment } from './objects/connector';
import { ConnectorModel, BpmnFlowModel, OrthogonalSegmentModel } from './objects/connector-model';
import { SnapSettings } from './diagram/grid-lines';
import { RulerSettings } from './diagram/ruler-settings';
import { removeRulerElements, updateRuler, getRulerSize } from './ruler/ruler';
import { renderRuler, renderOverlapElement } from './ruler/ruler';
import { RulerSettingsModel } from './diagram/ruler-settings-model';
import { SnapSettingsModel } from './diagram/grid-lines-model';
import { NodeModel, TextModel, BpmnShapeModel, BpmnAnnotationModel, HeaderModel, HtmlModel } from './objects/node-model';
import { UmlActivityShapeModel, SwimLaneModel, LaneModel, PhaseModel } from './objects/node-model';
import { Size } from './primitives/size';
import { Keys, KeyModifiers, DiagramTools, AlignmentMode, AnnotationConstraints, NodeConstraints, ScrollActions } from './enum/enum';
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
import { PointPortModel, PortModel } from './objects/port-model';
import { ShapeAnnotationModel, AnnotationModel, PathAnnotationModel } from './objects/annotation-model';
import { ShapeAnnotation, PathAnnotation, Annotation } from './objects/annotation';
import { PointModel } from './primitives/point-model';
import { Canvas } from './core/containers/canvas';
import { GridPanel, ColumnDefinition } from './core/containers/grid';
import { DataSourceModel } from './diagram/data-source-model';
import { DataSource } from './diagram/data-source';
import { LayoutModel } from './layout/layout-base-model';
import { Layout, INode, ILayout } from './layout/layout-base';
import { DataBinding } from './data-binding/data-binding';
import { Selector, Text } from './objects/node';
import { SelectorModel } from './objects/node-model';
import { DiagramEventHandler } from './interaction/event-handlers';
import { CommandHandler } from './interaction/command-manager';
import { DiagramScroller } from './interaction/scroller';
import { Actions, isSelected } from './interaction/actions';
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
import { setAttributeSvg, setAttributeHtml, measureHtmlText, removeElement, createMeasureElements, getDomIndex } from './utility/dom-util';
import { getDiagramElement, getScrollerWidth, getHTMLLayer, createUserHandleTemplates } from './utility/dom-util';
import { getBackgroundLayer, createHtmlElement, createSvgElement, getNativeLayerSvg, getUserHandleLayer } from './utility/dom-util';
import { getPortLayerSvg, getDiagramLayerSvg, applyStyleAgainstCsp } from './utility/dom-util';
import { getAdornerLayerSvg, getSelectorElement, getGridLayerSvg, getBackgroundLayerSvg } from './utility/dom-util';
import { CommandManager, ContextMenuSettings } from './diagram/keyboard-commands';
import { CommandManagerModel, CommandModel, ContextMenuSettingsModel } from './diagram/keyboard-commands-model';
import { canDelete, canInConnect, canOutConnect, canRotate, canVitualize, canDrawThumbs } from './utility/constraints-util';
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
import { Port, PointPort } from './objects/port';
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
import { getConnectors, updateConnectorsProperties, phaseDefine } from './utility/swim-lane-util';
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
import { LineDistribution } from './interaction/line-distribution';
import { DiagramSettingsModel } from '../diagram/diagram-settings-model';
import { DiagramSettings } from '../diagram/diagram-settings';
import { BlazorTooltip } from './blazor-tooltip/blazor-Tooltip';
import { StackPanel } from './core/containers/stack-panel';
import { UserHandleModel } from './interaction/selector-model';
import { ConnectorFixedUserHandle, NodeFixedUserHandle } from './objects/fixed-user-handle';
import { NodeFixedUserHandleModel, ConnectorFixedUserHandleModel, FixedUserHandleModel } from './objects/fixed-user-handle-model';
import { LinearGradient, RadialGradient } from './core/appearance';
import { SegmentThumbShapes } from './enum/enum';

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
     * `printandExportModule` is used to print or export the objects
     *
     * @private
     */
    public printandExportModule: PrintAndExport;

    /**
     * `tooltipBlazorModule` is used to render tooltip
     *
     * @private
     */
    public blazorTooltipModule: BlazorTooltip;

    /**
     * `bpmnModule` is used to add built-in BPMN Shapes to diagrams
     *
     * @private
     */
    public bpmnModule: BpmnDiagrams;

    /**
     * 'symmetricalLayoutModule' is usd to render layout in symmetrical method
     *
     * @private
     */
    public symmetricalLayoutModule: SymmetricLayout;

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
     * @default 'Rhombus'
     */
     @Property('Rhombus')
     public segmentThumbShape : SegmentThumbShapes;

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
     */
    @Property()
    public nodeTemplate: string;

    /**
     * Customizes the annotation template
     *
     * @default undefined
     */
    @Property()
    public annotationTemplate: string;

    /**
     * This property represents the template content of a user handle. The user can define any HTML element as a template.
     *
     * @default undefined
     */
    @Property()
    public userHandleTemplate: string;

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
    public tooltipObject: Tooltip | BlazorTooltip;
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
    public selectionConnectorsList: ConnectorModel[] = [];
    /** @private */
    public deleteVirtualObject: boolean = false;
    /** @private */
    public realActions: RealAction;
    /** @private */
    public previousSelectedObject: (NodeModel | ConnectorModel)[];
    public canLayout: boolean = true;
    /** @private */
    public swimlaneChildTable: {} = {};
    /** @private */
    public swimlaneZIndexTable: {} = {};
    /** @private */
    public canExpand: boolean = true;
    private changedConnectorCollection: ConnectorModel[] = [];
    private changedNodesCollection: NodeModel[] = [];
    private previousNodeCollection: NodeModel[] = [];
    private previousConnectorCollection: ConnectorModel[] = [];
    private crudDeleteNodes: Object[] = [];
    private previousSelectedObjects: (NodeModel | ConnectorModel)[] = []; 

    // Group update to server when BlazorAction is isGroupAction;
    private blazorAddorRemoveCollection: (NodeModel | ConnectorModel)[] = [];
    private blazorRemoveIndexCollection: number[] = [];

    private diagramid: number = 88123;
    /** @private */
    public selectedObject: { helperObject: NodeModel, actualObject: NodeModel } = { helperObject: undefined, actualObject: undefined };
    /**
     * Constructor for creating the widget
     */
    constructor(options?: DiagramModel, element?: HTMLElement | string) {
        super(options, <HTMLElement | string>element);
        let child: NodeModel | ConnectorModel;
        let node: NodeModel | ConnectorModel;
        const blazor: string = 'Blazor';
        const canCloneObject: boolean = isBlazor() && window && window[blazor] && !this.dataSourceSettings.dataSource;
        this.ignoreCollectionWatch = true;
        for (let i: number = 0; options && options.nodes && i < options.nodes.length; i++) {
            child = options.nodes[i];
            node = this.nodes[i];
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
            if (child.shape && child.shape.type === 'SwimLane') {
                setSwimLaneDefaults(child, node);
            }
            if (canCloneObject) {
                this.previousNodeCollection.push(cloneObject(node, undefined, undefined, true));
            }
            if (this.nodeDefaults) {
                updateDefaultValues(node, child, this.nodeDefaults);
            }
            this.updateAnnotationText(node.annotations);
        }
        if (options && options.connectors) {
            for (let i: number = 0; options && options.connectors && i < options.connectors.length; i++) {
                child = options.connectors[i];
                node = this.connectors[i];
                if (canCloneObject) {
                    this.previousConnectorCollection.push(cloneObject(node, undefined, undefined, true));
                }
                if (this.connectorDefaults) {
                    updateDefaultValues(node, child, this.connectorDefaults);
                }
                this.updateAnnotationText(node.annotations);
            }
        }
        for (let i: number = 0; options && options.connectors && i < options.connectors.length; i++) {
            const defaultConnector: ConnectorModel = options.connectors[i];
            const connector: ConnectorModel = this.connectors[i];
            if (defaultConnector.shape && defaultConnector.shape.type !== 'None') {
                setConnectorDefaults(defaultConnector, connector);
            }
            if (isBlazor()) {
                const defaultPropChanges: object = cloneObject(this.bulkChanges);
                this.enableServerDataBinding(true);
                this.protectPropertyChange(true);
                const keys: string[] = Object.keys(defaultPropChanges);
                for (let i: number = 0; i < keys.length; i++) {
                    const key: string = keys[i]; const split: string[] = key.split('-');
                    if (split && split[0]) {
                        if (split[0] === 'nodes') {
                            defaultPropChanges[key].sfIndex = Number(split[1]);
                            this.changedNodesCollection.push(defaultPropChanges[key]);
                        }
                        if (split[0] === 'connectors') {
                            defaultPropChanges[key].sfIndex = Number(split[1]);
                            this.changedConnectorCollection.push(defaultPropChanges[key]);
                        }
                    }
                }
            }
        }
    }

    private updateAnnotationText(annotations?: PathAnnotationModel[] | ShapeAnnotationModel[]): void {
        if (isBlazor() && annotations.length > 0) {
            for (let i: number = 0; annotations && i < annotations.length; i++) {
                const label: PathAnnotationModel | ShapeAnnotationModel = annotations[i];
                label.content = label.content.split('\\n').join('\n');
            }
        }
    }

    private callFromServer(arg: object): void {
        const methodName: string = 'methodName';
        const mId: string = 'id';
        if (arg[methodName] === 'getParentID') {
            const id: string = arg[mId];
            return this.nameTable[id].parentId;
        } else if (arg[methodName] === 'getEdges') {
            const outEdge: string = 'outEdge';
            const isOutEdge: boolean = arg[outEdge];
            const id: string = arg[mId];
            if (isOutEdge) {
                return this.nameTable[id].outEdges;
            } else {
                return this.nameTable[id].inEdges;
            }
        } else if (arg[methodName] === 'updateDiagramObjects') {
            const obj: string = 'obj';
            const isAdding: string = 'IsAdding';
            const args: object = arg[obj];

            this.isServerUpdate = true;
            if (arg[isAdding]) {
                const add: string = 'add';
                this[add].apply(this, args);
            } else {
                const remove: string = 'remove';
                this[remove].apply(this, args);
            }
            this.isServerUpdate = false;

        } else if (arg[methodName] === 'invokeLoadDiagramMethod') {
            const data: string = 'data';
            this.loadDiagram(arg[data]);
        }
    }


    private clearCollection(isConnector?: boolean): void {
        const collection: (NodeModel | ConnectorModel)[] = [];
        let obj: NodeModel | ConnectorModel;
        for (const key of Object.keys(this.nameTable)) {
            obj = this.nameTable[key];
            if (obj && ((isConnector && obj instanceof Connector) || (!isConnector && obj instanceof Node))) {
                collection.push(obj);
            }
        }
        this.clearObjects(collection);
    }
    /**
     * Updates the diagram control when the objects are changed
     *
     * @param {DiagramModel} newProp - Lists the new values of the changed properties
     * @param {DiagramModel} oldProp - Lists the old values of the changed properties
     */
    /* tslint:disable */
    public onPropertyChanged(newProp: DiagramModel, oldProp: DiagramModel): void {
        // Model Changed
        let newValue: NodeModel | ConnectorModel | DiagramModel;
        let oldValue: NodeModel | ConnectorModel | DiagramModel;
        let isPropertyChanged: boolean = true;
        let refreshLayout: boolean = false;
        let refereshColelction: boolean = false;
        if (this.diagramActions & DiagramAction.Render) {
            for (const prop of Object.keys(newProp)) {
                switch (prop) {
                    case 'width':
                    case 'height':
                        this.element.style.width = this.getSizeValue(this.width);
                        this.element.style.height = this.getSizeValue(this.height);
                        this.eventHandler.updateViewPortSize(this.element);
                        for (const view of this.views) {
                            const temp: View = this.views[view];
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
                                const actualObject: Node = this.nodes[index] as Node; const changedProp: Node = newProp.nodes[index] as Node;
                                if (newProp.nodes[index].style && newProp.nodes[index].style.gradient) {
                                    this.updateGradient(newProp.nodes[index], oldProp.nodes[index], (this.nodes[index] as Node));
                                    (this.nodes[index] as Node).oldGradientValue = cloneObject(newProp.nodes[index].style.gradient);
                                }
                                refreshLayout = refreshLayout || changedProp.excludeFromLayout !== undefined;
                                this.nodePropertyChange(actualObject, oldProp.nodes[index] as Node, changedProp, undefined, true, true);
                                const args: IPropertyChangeEventArgs | IBlazorPropertyChangeEventArgs = {
                                    element: cloneBlazorObject(actualObject), cause: this.diagramActions,
                                    oldValue: cloneBlazorObject(oldProp.nodes[index]) as Node,
                                    newValue: cloneBlazorObject(newProp.nodes[index]) as Node
                                };
                                if (isBlazor()) {
                                    (args as IBlazorPropertyChangeEventArgs).element = { node: cloneBlazorObject(actualObject) };
                                    (args as IBlazorPropertyChangeEventArgs).oldValue = { node: cloneBlazorObject(oldValue) };
                                    (args as IBlazorPropertyChangeEventArgs).newValue = { node: cloneBlazorObject(newValue) };
                                }
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
                                const actualObject: Connector = this.connectors[index] as Connector;
                                const changedProp: Connector = newProp.connectors[index] as Connector;
                                if (changedProp && (changedProp.sourceDecorator || changedProp.targetDecorator)) {
                                    this.diagramActions |= DiagramAction.DecoratorPropertyChange;
                                }
                                this.connectorPropertyChange(actualObject, oldProp.connectors[index] as Connector, changedProp, true, true);
                                if (changedProp && (changedProp.sourceDecorator || changedProp.targetDecorator)) {
                                    this.diagramActions = this.diagramActions & ~DiagramAction.DecoratorPropertyChange;
                                }
                                const args: IPropertyChangeEventArgs | IBlazorPropertyChangeEventArgs = {
                                    element: cloneBlazorObject(actualObject), cause: this.diagramActions,
                                    oldValue: cloneBlazorObject(oldProp.connectors[index]) as Connector,
                                    newValue: cloneBlazorObject(newProp.connectors[index]) as Connector
                                };
                                if (isBlazor()) {
                                    (args as IBlazorPropertyChangeEventArgs).element = { connector: cloneBlazorObject(actualObject) };
                                    (args as IBlazorPropertyChangeEventArgs).oldValue = { connector: cloneBlazorObject(oldValue) };
                                    (args as IBlazorPropertyChangeEventArgs).newValue = { connector: cloneBlazorObject(newValue) };
                                }
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
                        this.clear(); this.initObjects();
                        if (this.layout.type === 'None') {
                            refereshColelction = true;
                        } else {
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
                            this.realActions |= RealAction.PreventDataInit;
                            super.refresh();
                            this.realActions &= ~RealAction.PreventDataInit;
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
                                this.contextMenuSettings.items[index] = items[index];
                            }
                            if (this.contextMenuModule) {
                                this.contextMenuModule.refreshItems();
                            }
                        }
                        break;
                    case 'serializationSettings':
                        if (newProp.serializationSettings.preventDefaults !== undefined) {
                            this.serializationSettings.preventDefaults = newProp.serializationSettings.preventDefaults;
                        }
                        break;
                }
            }
            if (refreshLayout && !refereshColelction) {
                if (oldProp.layout && oldProp.layout.connectionPointOrigin === 'DifferentPoint' && newProp.layout.connectionPointOrigin === 'SamePoint'
                    || (oldProp.layout && newProp.layout && !newProp.layout.enableRouting && oldProp.layout.enableRouting)) {
                    for (let i: number = 0; i < this.nodes.length; i++) {
                        const node: NodeModel = this.nodes[i];
                        if ((node.ports && node.ports.length > 0)) {
                            const ports: PointPortModel[] = [];
                            for (let j: number = node.ports.length - 1; j >= 0; j--) {
                                if (node.ports[j].id.split('_')[1] === 'LineDistribution') {
                                    ports.push(node.ports[j]);
                                }
                            }
                            this.removePorts(node as Node, ports);
                        }
                    }
                    for (let j: number = 0; j < this.connectors.length; j++) {
                        const connector: ConnectorModel = this.connectors[j];
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
                    oldValue: cloneBlazorObject(oldProp), newValue: cloneBlazorObject(newProp)
                };
                if (isBlazor()) {
                    args.element = { diagram: cloneBlazorObject(this) };
                    args.oldValue = { diagram: cloneBlazorObject(oldValue) };
                    args.newValue = { diagram: cloneBlazorObject(newValue) };
                }
                this.triggerEvent(DiagramEvent.propertyChange, args);
            }
            if (!refereshColelction && (this.canLogChange()) && (this.modelChanged(newProp, oldProp))) {
                const entry: HistoryEntry = { type: 'PropertyChanged', undoObject: oldProp, redoObject: newProp, category: 'Internal' };
                if (this.historyManager) {
                    this.addHistoryEntry(entry);
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
                    const view: View = this.views[temp];
                    if (!(view instanceof Diagram)) {
                        if (newProp.scrollSettings && newProp.scrollSettings.currentZoom !== oldProp.scrollSettings.currentZoom) {
                            view.updateHtmlLayer(view);
                        }
                        if (!scrollAlone) {
                            this.refreshCanvasDiagramLayer(view);
                        }
                    }
                }
            }
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
            let linearNode: LinearGradient = (nodeObj as NodeModel) as LinearGradient;
            let radialNode: RadialGradient = (nodeObj as NodeModel) as RadialGradient;
            let linearProp: LinearGradient = oldProp.style.gradient as LinearGradient;
            let radialProp: RadialGradient = oldProp.style.gradient as RadialGradient;
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
                            let stops: StopModel[] = ((Object as any).values(cloneObject((nodeObj.oldGradientValue as LinearGradient |
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
        if (window[measureWindowElement]) {
            window[measureWindowElement] = null;
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

    private initializeServices(): void {
        this.serviceLocator.register('localization', this.localeObj = new L10n(this.getModuleName(), this.defaultLocale, this.locale));
    }


    /**
     * Method to set culture for chart
     */

    private setCulture(): void {
        this.localeObj = new L10n(this.getModuleName(), this.defaultLocale, this.locale);
    }
    /* tslint:disable */
    /**
     * Renders the diagram control with nodes and connectors
     */
    public render(): void {
        if (this.refreshing && this.dataSourceSettings.dataSource && !this.isLoading) {
            this.nodes = []; this.connectors = [];
        }
        this.ignoreCollectionWatch = true;
        const domTable: string = 'domTable';
        window[domTable] = {};
        const collapsedNode: NodeModel[] = [];
        if (isBlazor()) {
            const changedNodes: NodeModel[] = []; const changedConnectors: ConnectorModel[] = [];
            for (let i: number = 0; i < this.changedNodesCollection.length; i++) {
                changedNodes.push(this.commandHandler.deepDiffer.removeEmptyValues(this.changedNodesCollection[i]));
            }
            for (let i: number = 0; i < this.changedConnectorCollection.length; i++) {
                changedConnectors.push(this.commandHandler.deepDiffer.removeEmptyValues(this.changedConnectorCollection[i]));
            }
            const blazorInterop: string = 'sfBlazor'; const blazor: string = 'Blazor';
            const diagramObject: Object = { nodes: changedNodes, connectors: changedConnectors };
            if (window && window[blazor] && !this.dataSourceSettings.dataSource
                && (changedNodes.length > 0 || changedConnectors.length > 0)) {
                const obj: object = { 'methodName': 'UpdateBlazorProperties', 'diagramobj': diagramObject };
                window[blazorInterop].updateBlazorProperties(obj, this);
            }
        }
        if (this.dataSourceSettings.crudAction.read) {
            this.renderInitialCrud();
        }
        this.initHistory();
        this.diagramRenderer = new DiagramRenderer(this.element.id, new SvgRenderer(), this.mode === 'SVG');
        this.initLayers();
        this.initializeDiagramLayers();
        this.diagramRenderer.setLayers();
        this.initObjects(true);
        let isLayout: boolean = false;
        if (isBlazor() && !this.dataSourceSettings.dataSource && this.layout.type !== 'None') {
            for (const obj of this.nodes) {
                this.insertValue(cloneObject(obj), true);
            }
            for (const obj of this.connectors) {
                this.insertValue(cloneObject(obj), false);
            }
            isLayout = true;
        }
        const nodes: NodeModel[] = this.nodes;
        for (let i: number = 0; i < nodes.length; i++) {
            if (!nodes[i].isExpanded) {
                collapsedNode.push(nodes[i]);
            }
        }
        if (collapsedNode.length) {
            for (let i: number = collapsedNode.length - 1; i >= 0; i--) {
                if (i === 0) {
                    this.commandHandler.expandNode((collapsedNode[i] as Node), this, false);
                } else {
                    this.commandHandler.expandNode((collapsedNode[i] as Node), this, true);
                }
            }
        }
        if (this.canLayout) {
            this.doLayout();
        }
        if (isLayout) { this.commandHandler.getBlazorOldValues(); }
        if (this.lineRoutingModule) {
            const previousConnectorObject: Object[] = [];
            const updateConnectorObject: Object[] = [];
            const changeConnectors: Object[] = [];
            if (isBlazor()) {
                for (const obj of this.connectors) {
                    previousConnectorObject.push(cloneObject(obj, undefined, undefined, true));
                }
            }
            this.lineRoutingModule.lineRouting(this);
            if (isBlazor()) {
                for (const obj of this.connectors) {
                    updateConnectorObject.push(cloneObject(obj, undefined, undefined, true));
                }
                this.commandHandler.getObjectChanges(previousConnectorObject, updateConnectorObject, changeConnectors);
                if (!(this.blazorActions & BlazorAction.ClearObject)) {
                    const blazorInterop: string = 'sfBlazor';
                    const blazor: string = 'Blazor';
                    const diagramObject: Object = { nodes: [], connectors: changeConnectors };
                    if (window && window[blazor]) {
                        const obj: object = { 'methodName': 'UpdateBlazorProperties', 'diagramobj': diagramObject };
                        window[blazorInterop].updateBlazorProperties(obj, this);
                    }
                }
            }
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
        this.refreshDiagramLayer();
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
        if (isBlazor() && this.layout && this.layout.type === 'None') {
            this.updateTemplate();
        }
        this.isLoading = false;
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
        let node: NodeModel;
        let annotation: ShapeAnnotationModel;
        let pathAnnotation: PathAnnotationModel;
        for (let i: number = 0; i < this.nodes.length; i++) {
            node = this.nodes[i];
            if (node.shape.type === 'HTML' || node.shape.type === 'Native') {
                // CR-F170298 Template is not updated properly while render multiple diagram in same page
                updateBlazorTemplate('diagramsf_node_template', 'NodeTemplate', this, true);
                break;
            }
        }
        for (let i: number = 0; i < this.nodes.length; i++) {
            node = this.nodes[i];
            annotation = node.annotations[0];
            if (annotation && annotation.annotationType === 'Template') {
                // CR-F170298 Template is not updated properly while render multiple diagram in same page
                updateBlazorTemplate('diagramsf_annotation_template', 'AnnotationTemplate', this, false);
                break;
            }
        }
        for (let i: number = 0; i < this.connectors.length; i++) {
            pathAnnotation = this.connectors[i].annotations[0];
            if (pathAnnotation && pathAnnotation.annotationType === 'Template') {
                // CR-F170298 Template is not updated properly while render multiple diagram in same page
                updateBlazorTemplate('diagramsf_annotation_template', 'AnnotationTemplate', this, false);
                break;
            }
        }
        for (let i: number = 0; i < this.selectedItems.userHandles.length; i++) {
            if (this.selectedItems.userHandles[i].template) {
                // CR-F170298 Template is not updated properly while render multiple diagram in same page
                updateBlazorTemplate('diagramsf_userHandle_template', 'UserHandleTemplate', this, false);
                break;
            }
        }

    }

    private resetTemplate(): void {
        let htmlNode: NodeModel;
        let templateAnnotation: ShapeAnnotationModel;
        let path: PathAnnotationModel;
        for (let i: number = 0; i < this.nodes.length; i++) {
            htmlNode = this.nodes[i];
            if (htmlNode.shape.type === 'HTML' && (htmlNode.shape as HtmlModel).content === '') {
                resetBlazorTemplate('diagramsf_node_template', 'NodeTemplate');
                break;
            }
        }
        for (let i: number = 0; i < this.nodes.length; i++) {
            htmlNode = this.nodes[i];
            templateAnnotation = htmlNode.annotations[0];
            if (templateAnnotation && templateAnnotation.annotationType === 'Template'
                && (templateAnnotation as HtmlModel).content instanceof HTMLElement) {
                resetBlazorTemplate('diagramsf_annotation_template', 'AnnotationTemplate');
                break;
            }
        }
        for (let i: number = 0; i < this.connectors.length; i++) {
            path = this.connectors[i].annotations[0];
            if (path && path.annotationType === 'Template' && (path as HtmlModel).content instanceof HTMLElement) {
                resetBlazorTemplate('diagramsf_annotation_template', 'AnnotationTemplate');
                break;
            }
        }
        for (let i: number = 0; i < this.selectedItems.userHandles.length; i++) {
            if (this.selectedItems.userHandles[i].template) {
                updateBlazorTemplate('diagramsf_userHandle_template', 'UserHandleTemplate', this, false);
                break;
            }
        }
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
            const callback: Ajax = new Ajax(
                tempObj.dataSourceSettings.crudAction.read, 'GET', false
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
            const callback: Ajax = new Ajax(
                tempObj.dataSourceSettings.connectionDataSource.crudAction.read, 'GET', false
            );
            callback.onSuccess = (data: string): void => {
                tempObj.dataSourceSettings.connectionDataSource.dataManager = JSON.parse(data);
                tempObj.dataBind();
            };
            callback.send().then();
        }
    }

    /**
     * Returns the module name of the diagram
     *
     * @returns {string}  Returns the module name of the diagram
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
        if (isBlazor()) {
            modules.push({
                member: 'BlazorTooltip',
                args: []
            });
        }
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
        if ((this.layout && this.layout.connectionPointOrigin === 'DifferentPoint') || (this.layout.arrangement === 'Linear' || (this.layout.enableRouting))) {
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
                    removeElement(this.selectedItems.userHandles[i].name + '_template_hiddenUserHandle', elementId);
                }
            }
        }
    }

    /**
     *To destroy the diagram
     *
     * @returns {void} To destroy the diagram
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
            if (window[measureWindowElement]) {
                window[measureWindowElement].usageCount -= 1;
                const measureElementCount: string = 'measureElementCount';
                window[measureElementCount]--;
                if (window[measureElementCount] === 0) {
                    window[measureWindowElement].parentNode.removeChild(window[measureWindowElement]);
                    window[measureWindowElement] = null;
                }
            }
        }
        const domTable: string = 'domTable';
        window[domTable] = {};

        for (let i: number = 0; i < this.layers.length; i++) {
            const currentLayer: Layer = (this.layers[i] as Layer);
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
        const isIE11Pointer: Boolean = Browser.isPointer;
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
        const isIE11Pointer: Boolean = Browser.isPointer;
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
     * Selects the given collection of objects \
     *
     * @returns { void } Selects the given collection of objects .\
     * @param {NodeModel | ConnectorModel} objects - Defines the collection of nodes and connectors to be selected
     * @param {boolean} multipleSelection -Defines whether the existing selection has to be cleared or not
     *
     */
    public select(objects: (NodeModel | ConnectorModel)[], multipleSelection?: boolean, oldValue?: (NodeModel | ConnectorModel)[]): void {
        if (isBlazor()) {
            for (let i: number = 0; i < objects.length; i++) {
                objects[i] = this.nameTable[(objects[i] as NodeModel).id];
            }
            objects = this.nameTable[(objects as NodeModel).id] || objects;
        }
        if (objects != null) {
            this.commandHandler.selectObjects(objects, multipleSelection, oldValue);
        }
    }


    /**
     *  Selects the all the objects. \
     *
     * @returns { void }  Selects the all the objects. .\
     *
     */
    public selectAll(): void {
        let selectedItems: (NodeModel | ConnectorModel)[] = [];
        selectedItems = this.getObjectsOfLayer(this.activeLayer.objects);
        this.select(selectedItems);
    }


    /**
     * Removes the given object from selection list \
     *
     * @returns { void } Selects the given collection of objects .\
     * @param {NodeModel | ConnectorModel} obj -  Removes the given object from selection list
     *
     */
    public unSelect(obj: NodeModel | ConnectorModel): void {
        if (isBlazor()) {
            this.commandHandler.oldSelectedObjects = cloneObject(this.selectedItems);
            obj = this.nameTable[(obj as NodeModel).id] || obj;
        }
        if (obj && isSelected(this, obj)) {
            this.commandHandler.unSelect(obj);
            this.commandHandler.updateBlazorSelector();
        }
    }


    /**
     * Removes all elements from the selection list\
     *
     * @returns { void } Removes all elements from the selection list .\
     *
     */
    public clearSelection(): void {
        this.commandHandler.clearSelection(true);
    }


    /**
     *  Update the diagram clipboard dimension \
     *
     * @returns { void }  Update the diagram clipboard dimension .\
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
    }


    /**
     *  Removes the selected nodes and connectors from diagram and moves them to diagram clipboard \
     *
     * @returns { void }  Removes the selected nodes and connectors from diagram and moves them to diagram clipboard .\
     *
     */
    public cut(): void {
        this.commandHandler.cut();
    }


    /**
     *   Add a process into the sub-process \
     *
     * @returns { void }  Add a process into the sub-process.\
     * @param {NodeModel | ConnectorModel} process - provide the process value.
     * @param {boolean} parentId - provide the parentId value.
     *
     */
    public addProcess(process: NodeModel, parentId: string): void {
        if (this.bpmnModule) {
            this.bpmnModule.addProcess(process, parentId, this);
        }
    }


    /**
     *  Remove a process from the sub-processs \
     *
     * @returns { void }  Remove a process from the sub-process.\
     * @param {string} id - provide the id value.
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
     *  Adds the given objects/ the objects in the diagram clipboard to diagram control \
     *
     * @returns { void }  Remove a process from the sub-process.\
     * @param {NodeModel[] | ConnectorModel[]} obj - Defines the objects to be added to diagram
     * @deprecated
     *
     */
    public paste(obj?: (NodeModel | ConnectorModel)[]): void {
        this.commandHandler.paste(obj);
    }

    /**
     *  fit the diagram to the page with respect to mode and region \
     *
     * @returns { void }  fit the diagram to the page with respect to mode and region.\
     * @param {IFitOptions} options - provide the options value.
     *
     */
    public fitToPage(options?: IFitOptions): void {
        const attribute: string[] = this.getZoomingAttribute();
        this.updateBlazorDiagramProperties(attribute);
        this.scroller.fitToPage(options);
        this.updateBlazorDiagramProperties(attribute, true);
    }


    /**
     * bring the specified bounds into the viewport \
     *
     * @returns { void }  bring the specified bounds into the viewport.\
     * @param {Rect} bound - provide the bound value.
     *
     */
    public bringIntoView(bound: Rect): void {
        const attribute: string[] = this.getZoomingAttribute();
        this.updateBlazorDiagramProperties(attribute);
        this.scroller.bringIntoView(bound);
        this.updateBlazorDiagramProperties(attribute, true);
    }


    /**
     * bring the specified bounds to the center of the viewport \
     *
     * @returns { void }  bring the specified bounds to the center of the viewport.\
     * @param {Rect} bound - provide the bound value.
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
     * Copies the selected nodes and connectors to diagram clipboard \
     *
     * @returns { Object } Copies the selected nodes and connectors to diagram clipboard.\
     *
     */
    public copy(): Object {
        const obj: Object = this.commandHandler.copy();
        return obj;
    }


    /**
     *  Group the selected nodes and connectors in diagram \
     *
     * @returns { void }   Group the selected nodes and connectors in diagram.\
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
     *  send the selected nodes or connectors back \
     *
     * @returns { void }   send the selected nodes or connectors back.\
     *
     */
    public sendToBack(): void {
        this.commandHandler.sendToBack();
    }


    /**
     * set the active layer\
     *
     * @returns { void } set the active layer.\
     * @param {string} layerName - defines the name of the layer which is to be active layer.
     *
     */
    public setActiveLayer(layerName: string): void {
        const layer: LayerModel = this.commandHandler.getLayer(layerName);
        this.activeLayer = layer;
    }

    /**
     * add the layer into diagram\
     *
     * @returns { void } add the layer into diagram.\
     * @param {LayerModel} layer - defines the layer model which is to be added
     * @param {Object[]} layerObject - defines the object of the layer
     * @blazorArgsType layer|DiagramLayer
     * @deprecated
     *
     */
    public addLayer(layer: LayerModel, layerObject?: Object[]): void {
        this.commandHandler.addLayer(layer, layerObject);
    }
    /* eslint-disable */
    /**
     *  @private
     */
    private addDiagramLayer(layer: LayerModel, layerObject?: Object[]): void {
        this.commandHandler.addLayer(layer, layerObject, false);
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
    /**
     *  @private
     */
    private removeDiagramLayer(layerId: string): void {
        this.commandHandler.removeLayer(layerId, false);
    }
    /* eslint-enable */


    /**
     * move objects from the layer to another layer from diagram\
     *
     * @returns { void } move objects from the layer to another layer from diagram.\
     * @param {string[]} objects - define the objects id of string array
     * @param {string} targetLayer - define the objects id of string array
     *
     */
    public moveObjects(objects: string[], targetLayer?: string): void {
        const oldValues: object = cloneObject(this.layers);
        this.enableServerDataBinding(false);
        this.commandHandler.moveObjects(objects, targetLayer);
        const result: object = this.commandHandler.deepDiffer.map(oldValues, cloneObject(this.layers));
        const diffValue: object = this.commandHandler.deepDiffer.frameObject({}, result);
        this.oldDiagramObject = { layers: diffValue };
        this.commandHandler.updateBlazorProperties();
    }
    /* tslint:disable */
    private layerObjectUpdate(): void {
        if (isBlazor()) {
            this.enableServerDataBinding(false);
            this.oldDiagramObject['layers'] = [];
            for (let i: number = 0; i < this.layers.length; i++) {
                // tslint:disable-next-line:no-any
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const leyerObject: any = cloneObject(this.layers[i]);
                leyerObject.sfIndex = this.layers[i].zIndex;
                this.oldDiagramObject['layers'].push(leyerObject);
            }
        }
    }
    /* tslint:enable */


    /**
     * move the layer backward \
     *
     * @returns { void } move the layer backward .\
     * @param {string} layerName - define the name of the layer
     * @param {string} targetLayer - define the objects id of string array
     *
     */
    public sendLayerBackward(layerName: string): void {
        this.layerObjectUpdate();
        this.commandHandler.sendLayerBackward(layerName);
        this.commandHandler.updateLayerObject(this.oldDiagramObject, true);
    }


    /**
     * move the layer forward \
     *
     * @returns { void } move the layer forward.\
     * @param {string} layerName - define the name of the layer
     *
     */
    public bringLayerForward(layerName: string): void {
        this.layerObjectUpdate();
        this.commandHandler.bringLayerForward(layerName);
        this.commandHandler.updateLayerObject(this.oldDiagramObject);
    }



    /**
     *clone a layer with its object \
     *
     * @returns { void } move the layer forward.\
     * @param {string} layerName - define the name of the layer
     *
     */
    public cloneLayer(layerName: string): void {
        this.commandHandler.cloneLayer(layerName);
    }


    /**
     *bring the selected nodes or connectors to front \
     *
     * @returns { void } move the layer forward.\
     *
     */
    public bringToFront(): void {
        this.commandHandler.bringToFront();
    }


    /**
     *send the selected nodes or connectors forward \
     *
     * @returns { void } send the selected nodes or connectors forward.\
     *
     */
    public moveForward(): void {
        this.commandHandler.sendForward();
    }


    /**
     *send the selected nodes or connectors back\
     *
     * @returns { void } send the selected nodes or connectors back.\
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
        return this.nameTable[name];
    }


    /**
     * gets the node object for the given node ID \
     *
     * @returns { void } gets the node object for the given node ID.\
     * @param {string} id - define the name of the layer
     *
     */
    public getNodeObject(id: string): NodeModel {
        return cloneObject(this.nameTable[id]);
    }


    /**
     *gets the connector object for the given node ID \
     *
     * @returns { void } gets the connector object for the given node ID.\
     * @param {string} id - define the name of the layer
     *
     */
    public getConnectorObject(id: string): ConnectorModel {
        return cloneObject(this.nameTable[id]);
    }


    /**
     * gets the active layer back \
     *
     * @returns { void } gets the active layer back.\
     *
     */
    public getActiveLayer(): LayerModel {
        return this.activeLayer;
    }

    private nudgeCommand(direction: NudgeDirection, x?: number, y?: number): void {
        if (typeof direction !== 'object' && (this.selectedItems.nodes.length || this.selectedItems.connectors.length) > 0) {
            this.nudge(direction);
        }
    }

    /**
     * Moves the selected objects towards the given direction
     *
     * @returns { void }  Moves the selected objects towards the given direction .\
     * @param {NudgeDirection} direction -  Defines the direction by which the objects have to be moved
     * @param {number} x - Defines the distance by which the selected objects have to be horizontally moved
     * @param {number} y -  Defines the distance by which the selected objects have to be vertically moved
     */
    public nudge(direction: NudgeDirection, x?: number, y?: number): void {
        let tx: number = 0; let ty: number = 0;
        let negativeDirection: boolean;
        if (direction === 'Left' || direction === 'Right') {
            negativeDirection = (direction === 'Left');
            tx = (negativeDirection ? -1 : 1) * (x ? x : 1);
        } else {
            negativeDirection = (direction === 'Up');
            ty = (negativeDirection ? -1 : 1) * (y ? y : 1);
        }
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
        if (isBlazor() && !(this.blazorActions & BlazorAction.interaction)) {
            this.enableServerDataBinding(false);
            if (actualObject instanceof Selector) {
                for (let i: number = 0; i < actualObject.nodes.length; i++) {
                    this.insertBlazorDiagramObjects(actualObject.nodes[i]);
                }
                for (let i: number = 0; i < actualObject.connectors.length; i++) {
                    this.insertBlazorDiagramObjects(actualObject.connectors[i]);
                }
            }
            if (!(actualObject instanceof Selector)) {
                //let object: object;
                if (actualObject && (actualObject as Node).children && (actualObject as Node).children.length > 0) {
                    for (let i: number = 0; i < (actualObject as Node).children.length; i++) {
                        this.insertBlazorDiagramObjects(this.nameTable[(actualObject as Node).children[i]]);
                    }
                }
                const object: object = cloneObject(this.nameTable[(actualObject as NodeModel).id]);
                this.insertValue(object, !(getObjectType(actualObject) === Connector));
            }
        }
    }

    /**
     * Drags the given object by the specified pixels
     *
     * @returns { void }  Drags the given object by the specified pixels .\
     * @param {NodeModel | ConnectorModel | SelectorModel} obj - Defines the nodes/connectors to be dragged
     * @param {number} tx - Defines the distance by which the given objects have to be horizontally moved
     * @param {number} ty - Defines the distance by which the given objects have to be vertically moved
     */
    public drag(obj: NodeModel | ConnectorModel | SelectorModel, tx: number, ty: number): void {
        this.insertBlazorDiagramObjects(obj);
        if (isBlazor() && (obj as NodeModel | Connector).id) {
            obj = this.nameTable[(obj as NodeModel | Connector).id] || obj;
        }
        if (this.bpmnModule && (obj instanceof Node)) {
            const updated: boolean = this.bpmnModule.updateAnnotationDrag(obj as Node, this, tx, ty);
            if (updated) {
                return;
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
                if (connectors.shape.type === 'Bpmn' && (connectors.shape as BpmnFlowModel).sequence === 'Default') {
                    this.commandHandler.updatePathElementOffset(connectors);
                }
            }
            this.selectionConnectorsList = [];
        }
        if (!(this.diagramActions & DiagramAction.ToolAction) && !(this.diagramActions & DiagramAction.DragUsingMouse)) {
            this.updateSelector();
        }
        if (this.callBlazorModel && (!(this.blazorActions & BlazorAction.interaction)) &&
            (!(this.blazorActions & BlazorAction.GroupClipboardInProcess))) {
            this.commandHandler.getBlazorOldValues();
        }
    }
    private disableStackContainerPadding(wrapper: Container, disable: boolean): void {
        if (wrapper instanceof StackPanel) {
            wrapper.considerPadding = disable;
        }
        if (wrapper.children) {
            for (const child of wrapper.children) {
                this.disableStackContainerPadding(child as Container, false);
            }
        }

    }
    /**
     * Scales the given objects by the given ratio
     *
     * @returns { void } Scales the given objects by the given ratio .\
     * @param {NodeModel | ConnectorModel | SelectorModel} obj - Defines the objects to be resized
     * @param {number} sx - Defines the ratio by which the objects have to be horizontally scaled
     * @param {number} sy - Defines the ratio by which the objects have to be vertically scaled
     * @param {PointModel} pivot - Defines the reference point with respect to which the objects will be resized
     */
    public scale(obj: NodeModel | ConnectorModel | SelectorModel, sx: number, sy: number, pivot: PointModel): boolean {
        this.disableStackContainerPadding(obj.wrapper as Container, false);
        this.insertBlazorDiagramObjects(obj);
        let checkBoundaryConstraints: boolean = true;
        if ((obj as NodeModel | ConnectorModel).id) {
            obj = this.nameTable[(obj as NodeModel | ConnectorModel).id] || obj;
        }
        if (obj instanceof Selector) {
            if (obj.nodes && obj.nodes.length) {
                this.callBlazorModel = false;
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
        this.disableStackContainerPadding(obj.wrapper as Container, true);
        return checkBoundaryConstraints;
    }
    /**
     * Rotates the given nodes/connectors by the given angle
     *
     * @returns { void } Rotates the given nodes/connectors by the given angle .\
     * @param {NodeModel | ConnectorModel | SelectorModel} obj - Defines the objects to be rotated
     * @param {number} angle - Defines the angle by which the objects have to be rotated
     * @param {PointModel} pivot - Defines the reference point with reference to which the objects have to be rotated
     */
    public rotate(obj: NodeModel | ConnectorModel | SelectorModel, angle: number, pivot?: PointModel): boolean {
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
                if (!checkBoundaryConstraints) {
                    obj.rotateAngle -= angle;
                    obj.wrapper.rotateAngle -= angle;
                    return checkBoundaryConstraints;
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
        return checkBoundaryConstraints;
    }
    /**
     * Moves the source point of the given connector
     *
     * @returns { void }  Moves the source point of the given connector .\
     * @param {ConnectorModel} obj - Defines the connector, the end points of which has to be moved
     * @param {number} tx - Defines the distance by which the end point has to be horizontally moved
     * @param {number} ty - Defines the distance by which the end point has to be vertically moved
     */
    public dragSourceEnd(obj: ConnectorModel, tx: number, ty: number): void {
        this.insertBlazorDiagramObjects(obj);
        this.commandHandler.dragSourceEnd(obj, tx, ty);
        if (this.callBlazorModel) {
            this.commandHandler.getBlazorOldValues();
        }
    }

    /**
     * Moves the target point of the given connector
     *
     * @returns { void }   Moves the target point of the given connector.\
     * @param {ConnectorModel} obj - Defines the connector, the end points of which has to be moved
     * @param {number} tx - Defines the distance by which the end point has to be horizontally moved
     * @param {number} ty - Defines the distance by which the end point has to be vertically moved
     */
    public dragTargetEnd(obj: ConnectorModel, tx: number, ty: number): void {
        this.insertBlazorDiagramObjects(obj);
        this.commandHandler.dragTargetEnd(obj, tx, ty);
        if (this.callBlazorModel) {
            this.commandHandler.getBlazorOldValues();
        }
    }

    /**
     * Finds all the objects that is under the given mouse position
     *
     * @returns { void }   Finds all the objects that is under the given mouse position.\
     * @param {PointModel} position - Defines the position, the objects under which has to be found
     * @param {IElement} source - Defines the object, the objects under which has to be found
     */
    public findObjectsUnderMouse(position: PointModel, source?: IElement): IElement[] {
        return this.eventHandler.findObjectsUnderMouse(position, source);
    }

    /**
     * Finds the object that is under the given mouse position
     *
     * @returns { void }   Finds the object that is under the given mouse position.\
     * @param {NodeModel[] | ConnectorModel[]}objects - Defines the collection of objects, from which the object has to be found.
     * @param {Actions} action - Defines the action, using which the relevant object has to be found.
     * @param {boolean} inAction - Defines the active state of the action.
     */
    public findObjectUnderMouse(
        objects: (NodeModel | ConnectorModel)[], action: Actions, inAction: boolean): IElement {
        return this.eventHandler.findObjectUnderMouse(objects, action, inAction);
    }

    /**
     * Finds the object that is under the given active object (Source)
     *
     * @returns { void } Finds the object that is under the given active object (Source) .\
     * @param {NodeModel[] | ConnectorModel[]} objects - Defines the collection of objects, from which the object has to be found.
     * @param {Actions} action - Defines the action, using which the relevant object has to be found.
     * @param {boolean} inAction - Defines the active state of the action.
     * @param {PointModel} position - Defines the position.
     * @param {IElement} source - Defines the source.
     */
    public findTargetObjectUnderMouse(
        objects: (NodeModel | ConnectorModel)[], action: Actions, inAction: boolean, position: PointModel, source?: IElement): IElement {
        return this.eventHandler.findTargetUnderMouse(objects, action, inAction, position, source);
    }

    /**
     * Finds the child element of the given object at the given position
     *
     * @returns { void } Finds the child element of the given object at the given position .\
     * @param {IElement} obj - Defines the object, the child element of which has to be found
     * @param {PointModel} position - Defines the position, the child element under which has to be found
     * @param {number} padding - Defines the padding, the child element under which has to be found
     */
    public findElementUnderMouse(obj: IElement, position: PointModel, padding?: number): DiagramElement {
        return this.eventHandler.findElementUnderMouse(obj, position, padding);
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
        target?: NodeModel | PointPortModel | ShapeAnnotationModel | PathAnnotationModel): Actions {
        return this.eventHandler.findActionToBeDone(obj, wrapper, position, target);
    }

    /**
     * Returns the tool that handles the given action
     *
     * @returns { ToolBase } Returns the tool that handles the given action \
     * @param {string} action - Defines the action that is going to be performed
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
     * Defines the cursor that corresponds to the given action
     *
     * @returns { string } Defines the cursor that corresponds to the given action \
     * @param {string} action - Defines the action that is going to be performed
     * @param {boolean} active - Defines the active
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
                if (this.customCursor[i].action === action) {
                    return this.customCursor[i].cursor;
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
     * Adds the given change in the diagram control to the track
     *
     * @returns { void } Adds the given change in the diagram control to the track \
     * @param {HistoryEntry} entry - Defines the entry/information about a change in diagram
     */
    public addHistoryEntry(entry: HistoryEntry): void {
        if (this.undoRedoModule && (this.constraints & DiagramConstraints.UndoRedo)
            && (!this.currentSymbol || this.checkCurrentSymbol(this.currentSymbol, entry))) {
            if (entry.undoObject && (entry.undoObject as Node).id === 'helper') {
                return;
            }
            this.undoRedoModule.addHistoryEntry(entry, this);
            if (entry.type !== 'StartGroup' && entry.type !== 'EndGroup') {
                this.historyChangeTrigger(entry, 'CustomAction');
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
        if (isBlazor() && this.undoRedoModule && (this.constraints & DiagramConstraints.UndoRedo)) {
            entry.type = undefined; entry.category = 'External';
            this.undoRedoModule.addHistoryEntry(entry, this);
        }
    }

    /* eslint-disable */
    /** @private */
    public historyChangeTrigger(entry: HistoryEntry, action: HistoryChangeAction): void {
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
            change[type] = entry.type;
            if (isBlazor()) {
                (change as ChangedObject)[entryType] = entry.type;
            }
            switch (entry.type) {
                case 'PositionChanged':
                    change[oldValue] = {
                        offsetX: (entry.undoObject as NodeModel).offsetX,
                        offsetY: (entry.undoObject as NodeModel).offsetY
                    };
                    change[newValue] = {
                        offsetX: (entry.redoObject as NodeModel).offsetX,
                        offsetY: (entry.redoObject as NodeModel).offsetY
                    };
                    break;
                case 'RotationChanged':
                    change[oldValue] = { rotateAngle: (entry.undoObject as NodeModel).rotateAngle };
                    change[newValue] = { rotateAngle: (entry.redoObject as NodeModel).rotateAngle };
                    break;
                case 'SizeChanged':
                    change[oldValue] = {
                        offsetX: (entry.undoObject as NodeModel).offsetX, offsetY: (entry.undoObject as NodeModel).offsetY,
                        width: (entry.undoObject as NodeModel).width, height: (entry.undoObject as NodeModel).height
                    };
                    change[newValue] = {
                        offsetX: (entry.redoObject as NodeModel).offsetX, offsetY: (entry.redoObject as NodeModel).offsetY,
                        width: (entry.redoObject as NodeModel).width, height: (entry.redoObject as NodeModel).height
                    };
                    break;
                case 'CollectionChanged':
                    change[entry.changeType] = source;
                    break;
                case 'ConnectionChanged':
                    change[oldValue] = {
                        offsetX: (entry.undoObject as NodeModel).offsetX,
                        offsetY: (entry.undoObject as NodeModel).offsetY
                    };
                    change[newValue] = {
                        offsetX: (entry.redoObject as NodeModel).offsetX,
                        offsetY: (entry.redoObject as NodeModel).offsetY
                    };
                    break;
            }
            let arg: IHistoryChangeArgs | IBlazorHistoryChangeArgs;
            arg = {
                cause: entry.category, source: cloneBlazorObject(source) as NodeModel[], change: cloneBlazorObject(change),
                action: action
            };
            if (isBlazor()) {

                arg = {
                    cause: entry.category, change: cloneBlazorObject(change) as ChangedObject,
                    source: { connectors: undefined, nodes: undefined }, action: action
                } as IBlazorHistoryChangeArgs;
                const sourceValue: DiagramEventObjectCollection = (arg as IBlazorHistoryChangeArgs).source;
                sourceValue.connectors = [];
                sourceValue.nodes = [];
                let object: NodeModel | ConnectorModel;
                for (let i: number = 0; i < source.length; i++) {
                    object = cloneBlazorObject(source[i]);
                    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                    (getObjectType(source[i]) === Connector) ?
                        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                        (sourceValue.connectors.push(object as ConnectorModel)) : (sourceValue.nodes.push((object as NodeModel)));
                }
                arg.source = sourceValue;
            }

            if (source.length) {
                this.triggerEvent(DiagramEvent.historyChange, arg);
            }
        }
    }

    /**
     * Starts grouping the actions that will be undone/restored as a whole
     *
     * @returns { void } Starts grouping the actions that will be undone/restored as a whole\
     */
    public startGroupAction(): void {
        const entry: HistoryEntry = { type: 'StartGroup', category: 'Internal' };
        if (!(this.diagramActions & DiagramAction.UndoRedo)) {
            this.addHistoryEntry(entry);
        }
    }

    /**
     * Closes grouping the actions that will be undone/restored as a whole
     *
     * @returns { void } Closes grouping the actions that will be undone/restored as a whole .\
     */
    public endGroupAction(): void {
        const entry: HistoryEntry = { type: 'EndGroup', category: 'Internal' };
        if (!(this.diagramActions & DiagramAction.UndoRedo)) {
            this.addHistoryEntry(entry);
        }
    }

    /**
     * Restores the last action that is performed
     *
     * @returns { void } Restores the last action that is performed .\
     */
    public undo(): void {
        this.canEnableBlazorObject = true;
        this.callBlazorModel = false;
        if (this.undoRedoModule && (this.constraints & DiagramConstraints.UndoRedo)) {
            this.undoRedoModule.undo(this);
        }
        this.commandHandler.getBlazorOldValues();
        this.callBlazorModel = true;
        this.canEnableBlazorObject = false;
    }

    /**
     * Restores the last undone action
     *
     * @returns { void } Restores the last undone action .\
     */
    public redo(): void {
        this.canEnableBlazorObject = true;
        this.callBlazorModel = false;
        if (this.undoRedoModule && (this.constraints & DiagramConstraints.UndoRedo)) {
            this.undoRedoModule.redo(this);
        }
        this.commandHandler.getBlazorOldValues();
        this.callBlazorModel = true;
        this.canEnableBlazorObject = false;
    }

    private getBlazorDiagramObjects(objects?: (NodeModel | ConnectorModel)[]): void {
        if (objects) {
            for (let j: number = 0; j < objects.length; j++) {
                this.insertBlazorDiagramObjects(objects[j]);
            }
        } else {
            this.insertBlazorDiagramObjects(this.selectedItems);
        }
        this.callBlazorModel = false;
        this.canEnableBlazorObject = true;
    }

    /**
     * Aligns the group of objects to with reference to the first object in the group
     *
     * @returns { void } Aligns the group of objects to with reference to the first object in the group .\
     * @param {AlignmentOptions}option - Defines the factor, by which the objects have to be aligned
     * @param {NodeModel[] | ConnectorModel[]} objects - Defines the objects that have to be aligned
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
     * Arranges the group of objects with equal intervals, but within the group of objects
     *
     * @returns { void } Arranges the group of objects with equal intervals, but within the group of objects .\
     * @param {NodeModel[] | ConnectorModel[]} option - Defines the factor to distribute the shapes
     * @param {DistributeOptions} objects - Defines the objects that have to be equally spaced
     */
    public distribute(option: DistributeOptions, objects?: (NodeModel | ConnectorModel)[]): void {
        this.getBlazorDiagramObjects(objects);
        if (!objects) {
            objects = [];
            objects = objects.concat(this.selectedItems.nodes, this.selectedItems.connectors);
        }
        this.diagramActions = this.diagramActions | DiagramAction.PublicMethod;
        this.commandHandler.distribute(objects, option);
        this.commandHandler.getBlazorOldValues();
        this.canEnableBlazorObject = false;
        this.callBlazorModel = true;
    }

    /**
     * Scales the given objects to the size of the first object in the group
     *
     * @returns { void } Scales the given objects to the size of the first object in the group .\
     * @param {SizingOptions} option - Defines whether the node has to be horizontally scaled, vertically scaled or both
     * @param {NodeModel[] | ConnectorModel[]}objects - Defines the collection of objects that have to be scaled
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
        if (isBlazor() && !canCall) {
            //Need to send the client changes into server side for public APIs changes.
            let isServerDataBindEnabled: boolean = this.allowServerDataBinding;
            this.enableServerDataBinding(true);
            for (let i: number = 0; i < attribute.length; i++) {
                this.oldDiagramObject[attribute[i]] = cloneObject(this[attribute[i]]);
            }
            this.enableServerDataBinding(isServerDataBindEnabled);
        }
        if (canCall) {
            this.commandHandler.getDiagramOldValues(this.oldDiagramObject, attribute);
        }
    }

    private getZoomingAttribute(): string[] {
        const attribute: string[] = [];
        attribute.push('scrollSettings');
        attribute.push('snapSettings');
        return attribute;
    }

    /**
     * Scales the diagram control by the given factor
     *
     * @returns { void } Scales the diagram control by the given factor .\
     * @param {number} factor - Defines the factor by which the diagram is zoomed
     * @param {PointModel} focusedPoint - Defines the point with respect to which the diagram has to be zoomed
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
     * Scales the diagram control by the given factor
     *
     * @returns { void }  Scales the diagram control by the given factor .\
     * @param {ZoomOptions} options - used to define the zoom factor, focus point and zoom type.
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
     * Pans the diagram control to the given horizontal and vertical offsets
     *
     * @returns { void } Pans the diagram control to the given horizontal and vertical offsets .\
     * @param {number} horizontalOffset - Defines the horizontal distance to which the diagram has to be scrolled
     * @param {number} verticalOffset - Defines the vertical distance to which the diagram has to be scrolled
     * @param {PointModel} focusedPoint - Provide the focusedPoint value
     */
    public pan(horizontalOffset: number, verticalOffset: number, focusedPoint?: PointModel): void {
        const attribute: string[] = this.getZoomingAttribute();
        this.updateBlazorDiagramProperties(attribute);
        this.setCursor('grabbing');
        this.scroller.zoom(1, horizontalOffset, verticalOffset, focusedPoint);
        this.updateBlazorDiagramProperties(attribute, true);
    }

    /**
     * Resets the zoom and scroller offsets to default values
     *
     * @returns { void } Resets the zoom and scroller offsets to default values .\
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
     * Resets the segments of the connectors
     *
     * @returns { void } Resets the segments of the connectors .\
     */
    public resetSegments(): void {
        const previousConnectorObject: Object[] = [];
        const updateConnectorObject: Object[] = [];
        const changeConnectors: Object[] = [];
        if (isBlazor()) {
            for (const obj of this.connectors) {
                previousConnectorObject.push(cloneObject(obj, undefined, undefined, true));
            }
        }

        if (this.constraints & DiagramConstraints.LineRouting && this.lineRoutingModule) {
            this.lineRoutingModule.lineRouting(this);
        } else {
            this.protectPropertyChange(true);
            let connector: Connector;
            for (let i: number = 0; i < this.connectors.length; i++) {
                connector = this.connectors[i] as Connector;
                connector.segments = [];
                this.connectorPropertyChange(connector, {} as Connector, { segments: connector.segments } as Connector);
            }
            this.protectPropertyChange(false);
        }

        if (isBlazor()) {
            for (const obj of this.connectors) {
                updateConnectorObject.push(cloneObject(obj, undefined, undefined, true));
            }
            this.commandHandler.getObjectChanges(previousConnectorObject, updateConnectorObject, changeConnectors);
            const blazorInterop: string = 'sfBlazor';
            const blazor: string = 'Blazor';
            const diagramObject: Object = { nodes: [], connectors: changeConnectors };
            if (window && window[blazor]) {
                const obj: object = { 'methodName': 'UpdateBlazorProperties', 'diagramobj': diagramObject };
                window[blazorInterop].updateBlazorProperties(obj, this);
            }
        }
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
        let eventArgs: void | object = await this.trigger(DiagramEvent[eventName], args);
        if (isBlazor() && typeof eventArgs === 'string') {
            eventArgs = JSON.parse(eventArgs as string);
        }
        return eventArgs;
    }

    private updateEventValue(args: IDropEventArgs): void {
        const element: NodeModel | ConnectorModel | SelectorModel = args.element;
        if ((args as IDropEventArgs).element && element instanceof Selector && (element.nodes.length + element.connectors.length === 1)) {
            args.element = (element.nodes.length === 1) ? element.nodes[0] : element.connectors[0];
        }
    }


    /**
     * Adds the given node to the lane
     *
     * @returns { void }     Adds the given node to the lane .\
     * @param {NodeModel} node - provide the node value.
     * @param {string} swimLane - provide the swimLane value.
     * @param {string} lane - provide the lane value.
     * @deprecated
     */
    public addNodeToLane(node: NodeModel, swimLane: string, lane: string): void {
        if (this.nameTable[swimLane]) {
            const swimlaneNode: NodeModel = this.nameTable[swimLane];
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
                if (this.nameTable[laneId]) {
                    addChildToContainer(this, this.nameTable[laneId], node, undefined, true);
                    updateLaneBoundsAfterAddChild(this.nameTable[laneId], swimlaneNode, node, this);
                }
            } else {
                for (let i: number = 0; i < (swimlaneNode.shape as SwimLane).phases.length; i++) {
                    const laneId: string = swimLane + lane + i;
                    if (this.nameTable[laneId] && this.nameTable[laneId].isLane) {
                        const laneNode: Rect = this.nameTable[laneId].wrapper.bounds;
                        const focusPoint: PointModel = {
                            x: laneNode.x +
                                (laneNode.x - swimlaneNode.wrapper.bounds.x + node.margin.left + (node.wrapper.bounds.width / 2)),
                            y: laneNode.y + swimlaneNode.wrapper.bounds.y - node.margin.top
                        };
                        if ((swimlaneNode.shape as SwimLane).orientation === 'Horizontal') {
                            focusPoint.y = laneNode.y;
                        } else {
                            focusPoint.x = laneNode.x;
                            const laneHeaderId: string = this.nameTable[laneId].parentId +
                                (swimlaneNode.shape as SwimLane).lanes[0].id + '_0_header';
                            focusPoint.y = laneNode.y +
                                (swimlaneNode.wrapper.bounds.y - this.nameTable[laneHeaderId].wrapper.bounds.height +
                                    node.margin.top + (node.wrapper.bounds.height / 2));
                        }
                        if (laneNode.containsPoint(focusPoint) ||
                            (laneId === swimLane + lane + ((swimlaneNode.shape as SwimLane).phases.length - 1))) {
                            addChildToContainer(this, this.nameTable[laneId], node, undefined, true);
                            updateLaneBoundsAfterAddChild(this.nameTable[laneId], swimlaneNode, node, this);
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
    /**
     * Shows tooltip for corresponding diagram object
     *
     * @param {NodeModel | ConnectorModel} obj - Defines the object for that tooltip has to be shown
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
     * hides tooltip for corresponding diagram object
     *
     * @param {NodeModel | ConnectorModel} obj - Defines the object for that tooltip has to be hide
     */

    public hideTooltip(obj: NodeModel | ConnectorModel): void {
        if (obj && obj.tooltip.openOn === 'Custom') {
            this.tooltipObject.close();
        }
    }

    /**
     * Adds the given node to diagram control
     *
     * @returns { Node }     getDirection method .\
     * @param {NodeModel} obj - Defines the node that has to be added to diagram
     * @param {boolean} group - Defines the node that has to be added to diagram
     * @blazorArgsType obj|DiagramNode
     */
    public addNode(obj: NodeModel, group?: boolean): Node {
        return this.add(obj, group) as Node;
    }

    /**
     * Adds the given diagram object to the group.
     *
     * @returns { void }     Adds the given diagram object to the group.\
     * @param {NodeModel} group - defines where the diagram object to be added.
     * @param {string | NodeModel | ConnectorModel} child - defines the diagram object to be added to the group
     * @blazorArgsType obj|DiagramNode
     */
    public addChildToGroup(group: NodeModel, child: string | NodeModel | ConnectorModel): void {
        const severDataBind: boolean = this.allowServerDataBinding;
        this.enableServerDataBinding(false);
        const propChange: boolean = this.isProtectedOnChange; this.protectPropertyChange(true);
        group = this.getObject(group.id) as NodeModel;
        if (isBlazor()) { this.insertValue(group, true); }
        const isHistoryAdded: boolean = (!(this.diagramActions & DiagramAction.UndoRedo) && !(this.diagramActions & DiagramAction.Group) &&
            !(this.diagramActions & DiagramAction.PreventHistory));
        if (isHistoryAdded) {
            this.startGroupAction();
        }
        const id: string = this.addChild(group, child);
        if (isHistoryAdded) {
            const childTable: object = {};
            childTable[id] = cloneObject(this.getObject(id));
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
        if (isBlazor() && isHistoryAdded) { this.commandHandler.getBlazorOldValues(); }
    }
    /**
     * Will return the history stack values
     *
     * @returns { void } Will return the history stack values .\
     * @param {boolean} isUndoStack - returns the history stack values
     */
    public getHistoryStack(isUndoStack: boolean): HistoryEntry[] {
        //let temp: HistoryEntry[];
        let historyEntry: HistoryEntry[] = [];
        const temp: HistoryEntry[] = isUndoStack ? this.historyManager.undoStack : this.historyManager.redoStack;
        if (this.historyManager.stackLimit !== undefined) {
            for (let i: number = temp.length - 1; i >= 0; i--) {
                historyEntry.push(temp[i]);
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
     * Return the edges for the given node
     *
     * @returns { string[] } Return the edges for the given node .\
     * @deprecated
     * @param {Object} args - return the edge of the given node
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
        return this.nameTable[id].parentId;
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
        if (!(this.blazorActions & BlazorAction.ClearObject)) {
            const blazorInterop: string = 'sfBlazor';
            const blazor: string = 'Blazor';
            if (window && window[blazor]) {
                let updatedModel: object;
                const connectorModelCollection: object[] = []; const updatedModelCollection: object[] = [];
                const objectTypeCollection: string[] = []; let removalIndexCollection: number[] = [];
                if (isBlazorGroupUpdate && !copiedObject) {
                    for (let i: number = 0; i < this.blazorAddorRemoveCollection.length; i++) {
                        objectTypeCollection.push(getObjectType(this.blazorAddorRemoveCollection[i]) === Connector ? 'Connector' : 'Node');
                        updatedModel = cloneBlazorObject(this.blazorAddorRemoveCollection[i]);
                        updatedModelCollection.push(updatedModel);
                        removalIndexCollection = this.blazorRemoveIndexCollection;
                    }
                } else if ((!this.isServerUpdate || multiSelectDelete)) {
                    this.isServerUpdate = true;
                    let updatedModel: object = cloneBlazorObject(obj);
                    const elements: (NodeModel | ConnectorModel)[] = [];
                    let removalIndex: number;
                    let tempNode: (NodeModel | ConnectorModel)[] = [];
                    if (!copiedObject) {
                        if (!multiSelectDelete) {
                            tempNode = this.commandHandler.getChildren(obj as Node, elements);
                        } else {
                            tempNode = multiSelectDelete;
                        }
                        for (let i: number = 0; i < tempNode.length; i++) {
                            updatedModel = cloneBlazorObject(tempNode[i]);
                            updatedModelCollection.push(updatedModel);
                            if (getObjectType(tempNode[i]) === Connector) {
                                removalIndex = this.connectors.indexOf(tempNode[i] as Connector);
                            } else {
                                removalIndex = this.nodes.indexOf(tempNode[i] as Node);
                            }
                            removalIndexCollection.push(removalIndex);
                            objectTypeCollection.push(getObjectType(tempNode[i]) === Connector ? 'Connector' : 'Node');
                        }
                        if (!multiSelectDelete) {
                            updatedModelCollection.push(cloneBlazorObject(obj));
                            removalIndexCollection.push(this.nodes.indexOf(obj as Node));
                            objectTypeCollection.push(getObjectType(obj) === Connector ? 'Connector' : 'Node');
                        }
                    }
                    if (copiedObject && copiedObject.length > 0) {
                        for (let i: number = 0; i < copiedObject.length; i++) {
                            updatedModel = cloneBlazorObject(copiedObject[i]);
                            const isNode: boolean = (copiedObject[i] instanceof Node) ? true : false;
                            /* eslint-disable */
                            isNode ? updatedModelCollection.push(updatedModel) : connectorModelCollection.push(updatedModel);
                            /* eslint-enable */
                            objectTypeCollection.push(getObjectType(copiedObject[i]) === Connector ? 'Connector' : 'Node');
                        }
                    }
                    this.isServerUpdate = false;
                }
                const dgmObj: object = {
                    'methodName': 'UpdateBlazorDiagramObjects',
                    'diagramobj': {
                        'nodeObj': JSON.stringify(updatedModelCollection),
                        'ObjectType': objectTypeCollection,
                        'removalIndex': copiedObject ? undefined : removalIndexCollection,
                        'isMultipleObjects': true, 'annotationIndex': undefined,
                        'connectorObj': JSON.stringify(connectorModelCollection)
                    }
                };
                window[blazorInterop].updateBlazorProperties(dgmObj, this);
                if (isBlazorGroupUpdate && !copiedObject) {
                    this.blazorAddorRemoveCollection = [];
                    this.blazorRemoveIndexCollection = [];
                }
            }
        }
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
        if (!(this.blazorActions & BlazorAction.GroupClipboardInProcess)) {
            const blazorInterop: string = 'sfBlazor';
            const blazor: string = 'Blazor';
            if (window && window[blazor] && !this.isServerUpdate && !(this.diagramActions & DiagramAction.Clear)) {
                const updatedModel: object = cloneBlazorObject(obj);
                const dgmObj: object = {
                    'methodName': 'UpdateBlazorDiagramObjects',
                    'diagramobj': {
                        'nodeObj': JSON.stringify(updatedModel),
                        'ObjectType': objectType, 'removalIndex': removalIndex,
                        'isMultipleObjects': false,
                        'annotationIndex': annotationNodeIndex, 'connectorObj': undefined
                    }
                };
                window[blazorInterop].updateBlazorProperties(dgmObj, this);
            }
        }
    }
    // eslint-disable-next-line max-len
    private UpdateBlazorLabelOrPortObjects(
        obj: (ShapeAnnotation | PathAnnotation | PortModel)[], objectType: string, removalIndex?: number[], nodeIndex?: number): void {
        const blazorInterop: string = 'sfBlazor';
        const blazor: string = 'Blazor';
        if (window && window[blazor] && obj.length > 0 && !this.isServerUpdate && !(this.diagramActions & DiagramAction.Clear)) {
            // eslint-disable-next-line max-len
            const updatedModelCollection: object[] = []; const objectTypeCollection: string[] = []; const nodeIndexCollection: number[] = [];
            for (let i: number = 0; i < obj.length; i++) {
                updatedModelCollection.push(cloneBlazorObject(obj[i]));
                objectTypeCollection.push(objectType);
                nodeIndexCollection.push(nodeIndex);
            }
            const dgmObj: object = {
                'methodName': 'UpdateBlazorDiagramObjects',
                'diagramobj': {
                    'nodeObj': JSON.stringify(updatedModelCollection),
                    'ObjectType': objectTypeCollection, 'removalIndex': removalIndex,
                    'isMultipleObjects': true,
                    'annotationIndex': nodeIndexCollection,
                    'connectorObj': null,
                    'portIndex': (objectType === 'Port') ? nodeIndexCollection : []
                }
            };
            window[blazorInterop].updateBlazorProperties(dgmObj, this);
        }
    }

    /**
     *  addBlazorDiagramObjects method
     *
     * @returns { void }  addBlazorDiagramObjects method .\
     *
     * @private
     */
    public addBlazorDiagramObjects(): void {
        const nodesCollection: object[] = []; const connectorCollection: Object[] = [];
        if (this.dataBindingModule && !(this.realActions & RealAction.PreventDataInit)) {
            for (let i: number = 0; i < this.nodes.length; i++) {
                nodesCollection.push(cloneObject(this.nodes[i], undefined, undefined, true));
            }
            for (let i: number = 0; i < this.connectors.length; i++) {
                connectorCollection.push(cloneObject(this.connectors[i], undefined, undefined, true));
            }
        }
        const blazorInterop: string = 'sfBlazor';
        const blazor: string = 'Blazor';
        if (window && window[blazor]) {
            let obj: object = {
                'methodName': 'AddBlazorObjects',
                'diagramobj': { 'nodeObj': JSON.stringify(nodesCollection), 'isConnector': false }
            };
            window[blazorInterop].updateBlazorProperties(obj, this);
            obj = {
                'methodName': 'AddBlazorObjects',
                'diagramobj': { 'nodeObj': JSON.stringify(connectorCollection), 'isConnector': true }
            };
            window[blazorInterop].updateBlazorProperties(obj, this);
        }
    }
    private removeNodeEdges(elementId: string, id: string, isOutEdges: boolean): void {
        const node: Node = this.nameTable[elementId];
        const edges: string[] = isOutEdges ? node.outEdges : node.inEdges;
        if (edges.length > 0) {
            for (let i: number = 0; i < edges.length; i++) {
                if (edges[i] === id) {
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
        if (isBlazor() && (obj instanceof Connector)) {
            if (obj.sourceID && this.nameTable[obj.sourceID]) {
                this.insertValue(cloneObject(this.nameTable[obj.sourceID]), true);
            }
            if (obj.targetID && this.nameTable[obj.targetID]) {
                this.insertValue(cloneObject(this.nameTable[obj.targetID]), true);
            }
        }
    }
    /* tslint:disable */
    /**
     * Adds the given object to diagram control
     *
     * @returns { Node | Connector }     getDirection method .\
     * @param {NodeModel | ConnectorModel} obj - Defines the object that has to be added to diagram
     * @param {boolean} group - provide the group value.
     */
    public add(obj: NodeModel | ConnectorModel, group?: boolean): Node | Connector {
        let newObj: Node | Connector; const propertyChangeValue: boolean = this.isProtectedOnChange; this.protectPropertyChange(true);
        if (obj) {
            obj = cloneObject(obj); let args: ICollectionChangeEventArgs | IBlazorCollectionChangeEventArgs;
            args = {
                element: obj, cause: this.diagramActions, state: 'Changing', type: 'Addition', cancel: false
            };
            if (this.parentObject) {
                args.parentId = this.parentObject.id;
            }
            if (isBlazor()) {
                args = getCollectionChangeEventArguements(args as IBlazorCollectionChangeEventArgs, obj, 'Changing', 'Addition');
            }
            if (obj.id !== 'helper' && !(this.diagramActions & DiagramAction.PreventCollectionChangeOnDragOver)) {
                this.triggerEvent(DiagramEvent.collectionChange, args);
            }
            if (args.cancel && this.drawingObject) {
                this.removeElements(args.element as NodeModel | ConnectorModel);
                this.tooltipObject.close();
                let sourceNodee: NodeModel = this.getObject((args.element as Connector).sourceID);
                let isOutEdgee: boolean;
                if (getObjectType(args.element) === Connector) {
                    if ((args.element as Connector).sourceID) {
                        this.removeNodeEdges((args.element as Connector).sourceID, (args.element as Connector).id, true);
                        if (sourceNodee.ports.length > 0) {
                            for (let i: number = 0; i < sourceNodee.ports.length; i++) {
                                const port: PointPortModel = sourceNodee.ports[i];
                                if (port.id === (args.element as Connector).sourcePortID) {
                                    if (port.outEdges.length > 0) {
                                        isOutEdgee = false;
                                    } else {
                                        isOutEdgee = true;
                                    }
                                }
                            }
                            this.removePortEdges(sourceNodee, (args.element as Connector).sourcePortID, (args.element as Connector).id, isOutEdgee);
                        }
                    }
                    if ((args.element as Connector).targetID) {
                        this.removeNodeEdges((args.element as Connector).targetID, (args.element as Connector).id, false);
                    }
                }
            }
            this.diagramActions = this.diagramActions | DiagramAction.PublicMethod;
            obj.id = obj.id || randomId(); const layers: LayerModel = this.activeLayer;
            if (!args.cancel && !layers.lock) {
                if (layers.objects.indexOf(obj.id) < 0 && !layers.lock) {
                    if (!layers.visible) { layers.visible = true; this.dataBind(); }
                    layers.objects.push(obj.id);
                }
                if (getObjectType(obj) === Connector) {
                    newObj = new Connector(this, 'connectors', obj, true); (newObj as Connector).status = 'New';
                    updateDefaultValues(newObj, obj, this.connectorDefaults);
                    (this.connectors as Connector[]).push(newObj); this.initObject(newObj);
                    if (isBlazor()) {
                        if ((this.blazorActions & BlazorAction.GroupingInProgress)) {
                            this.blazorAddorRemoveCollection.push(newObj);
                        } else if (this.blazorAddorRemoveCollection.length > 0) {
                            this.isServerUpdate = false; this.blazorAddorRemoveCollection.push(newObj);
                            this.UpdateBlazorDiagramModelCollection(undefined, this.blazorAddorRemoveCollection, undefined, true);
                            this.blazorAddorRemoveCollection = []; this.commandHandler.getBlazorOldValues();
                        } else if ((!this.isServerUpdate) && !(this.blazorActions & BlazorAction.GroupClipboardInProcess)) {
                            this.UpdateBlazorDiagramModel(newObj, 'Connector'); this.commandHandler.getBlazorOldValues();
                        }
                    }
                    if (obj.visible === false) { this.updateElementVisibility(newObj.wrapper, newObj, obj.visible); }
                    this.updateEdges(newObj);
                    this.insertBlazorConnector(newObj);
                } else {
                    newObj = new Node(this, 'nodes', obj, true);
                    updateDefaultValues(newObj, obj, this.nodeDefaults);
                    newObj.parentId = ((obj as Node).parentId) ? (obj as Node).parentId : newObj.parentId;
                    newObj.umlIndex = (obj as Node).umlIndex; (newObj as Node).status = 'New';
                    (this.nodes as Node[]).push(newObj);
                    this.initObject(newObj, layers, undefined, group);
                    if (isBlazor()) {
                        if ((this.blazorActions & BlazorAction.GroupingInProgress)) {
                            this.blazorAddorRemoveCollection.push(newObj);
                        } else if (this.blazorAddorRemoveCollection.length > 0) {
                            this.blazorAddorRemoveCollection.push(newObj); this.isServerUpdate = false;
                            this.UpdateBlazorDiagramModelCollection(undefined, this.blazorAddorRemoveCollection, undefined, true);
                            this.commandHandler.getBlazorOldValues(); this.blazorAddorRemoveCollection = [];
                        } else if ((!this.isServerUpdate) && !(this.blazorActions & BlazorAction.GroupClipboardInProcess)) {
                            this.UpdateBlazorDiagramModel(newObj, 'Node');
                            this.commandHandler.getBlazorOldValues();
                        }
                    }
                    this.updateTemplate();
                    if (this.bpmnModule) {
                        if ((newObj.shape as BpmnShape).annotations && (newObj.shape as BpmnShape).annotations.length !== 0) {
                            for (const obj of this.bpmnModule.getTextAnnotationConn(newObj)) {
                                this.initConnectors(obj as Connector, layers, false);
                            }
                        }
                        if ((newObj.shape as BpmnShape).activity && (newObj.shape as BpmnShape).activity.subProcess.processes &&
                            (newObj.shape as BpmnShape).activity.subProcess.processes.length) {
                            this.bpmnModule.updateDocks(newObj, this);
                        }
                    }
                    if (this.lineRoutingModule && (this.constraints & DiagramConstraints.LineRouting)) {
                        const objects: Object[] = this.spatialSearch.findObjects(newObj.wrapper.outerBounds as Rect);
                        for (let i: number = 0; i < objects.length; i++) {
                            const object: Connector = objects[i] as Connector;
                            if (object instanceof Connector) {
                                this.connectorPropertyChange(object, {} as Connector, {
                                    sourceID: object.sourceID, targetID: object.targetID, sourcePortID: object.sourcePortID,
                                    targetPortID: object.targetPortID, sourcePoint: object.sourcePoint, targetPoint: object.targetPoint
                                } as Connector);
                            }
                        }
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
                    element: newObj, cause: this.diagramActions, state: 'Changed', type: 'Addition', cancel: false
                };
                if (this.parentObject) {
                    args.parentId = this.parentObject.id;
                }
                if (isBlazor()) {
                    args = getCollectionChangeEventArguements(args as IBlazorCollectionChangeEventArgs, obj, 'Changed', 'Addition');
                }
                if (obj.id !== 'helper' && !(this.diagramActions & DiagramAction.PreventCollectionChangeOnDragOver)) {
                    this.triggerEvent(DiagramEvent.collectionChange, args);
                }
                if (!(this.diagramActions & DiagramAction.UndoRedo) && !(this.diagramActions & DiagramAction.Group) &&
                    !(this.diagramActions & DiagramAction.PreventHistory)) {
                    const entry: HistoryEntry = {
                        type: 'CollectionChanged', changeType: 'Insert', undoObject: cloneObject(obj),
                        redoObject: cloneObject(obj), category: 'Internal'
                    };
                    this.addHistoryEntry(entry);
                }
                this.parentObject = undefined;
                if (this.mode === 'SVG') {
                    this.updateSvgNodes(newObj as Node);
                    this.updateTextElementValue(newObj); this.updateDiagramObject(newObj);
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
        for (const temp of this.views) {
            const view: View = this.views[temp];
            if (!(view instanceof Diagram)) { this.refreshCanvasDiagramLayer(view); }
        }
        this.renderReactTemplates();
        return newObj;
    }
    /* tslint:enable */
    private updateSvgNodes(node: Node): void {
        if (node.children) {
            for (const j of node.children) {
                if (this.nameTable[j] && this.nameTable[j].parentId) {
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
                edges = edges.concat(this.nameTable[j].outEdges, this.nameTable[j].inEdges);
                for (let i: number = edges.length - 1; i >= 0; i--) {
                    this.moveSvgNode(edges[i]);
                }
            }
            for (const j of processes) {
                if ((this.nameTable[j].shape as BpmnShape).activity.subProcess.processes &&
                    (this.nameTable[j].shape as BpmnShape).activity.subProcess.processes.length) {
                    this.updateProcesses(this.nameTable[j]);
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
     * Adds the given annotation to the given node
     *
     * @returns { void } Adds the given annotation to the given node .\
     * @param {BpmnAnnotationModel} annotation - Defines the annotation to be added
     * @param {NodeModel} node - Defines the node to which the annotation has to be added
     */
    public addTextAnnotation(annotation: BpmnAnnotationModel, node: NodeModel): void {
        if (this.bpmnModule) {
            const connector: Connector = this.bpmnModule.addAnnotation(node, annotation, this) as Connector;
            this.initConnectors(connector, this.commandHandler.getObjectLayer(node.id), false);
            this.updateDiagramObject(node);
            if (!(this.diagramActions & DiagramAction.UndoRedo) && !(this.diagramActions & DiagramAction.Group)) {
                const entry: HistoryEntry = {
                    type: 'CollectionChanged', changeType: 'Insert', undoObject: cloneObject(annotation),
                    redoObject: cloneObject(annotation), category: 'Internal'
                };
                this.addHistoryEntry(entry);
            }
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
                if (edges[i] === connector.id) {
                    edges.splice(i, 1);
                }
            }
            for (let j: number = 0; node.ports && j < node.ports.length; j++) {
                const isInEdge: boolean = isSource ? false : true;
                this.removePortEdges(node, node.ports[j].id, connector.id, isInEdge);
            }
        }
    }

    /**
     * Remove the dependent connectors if the node is deleted
     * @returns { void } Remove the dependent connectors if the node is deleted .\
     * @param {Node} node - provide the node value.
     *
     * @private
     */
    public removeDependentConnector(node: Node): void {
        if (node) {
            let connector: ConnectorModel;
            let edges: string[] = [];
            edges = edges.concat(node.outEdges, node.inEdges);
            for (let i: number = edges.length - 1; i >= 0; i--) {
                connector = this.nameTable[edges[i]];
                if (connector) {
                    this.connectorTable[connector.id] = cloneObject(connector);
                    this.remove(connector);
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
                const object: NodeModel = this.nameTable[(obj as Node).children[i]];
                if (object) {
                    this.removeObjectsFromLayer(object);
                }
            }
        }
        const layer: number = this.layers.indexOf(this.commandHandler.getObjectLayer(obj.id));
        const objects: string[] = this.layers[layer].objects;
        const objIndex: number = objects.indexOf(obj.id);
        if (objIndex > -1) {
            if (isSelected(this, obj)) {
                this.unSelect(obj);
            }
            this.layers[layer].objects.splice(objIndex, 1);
            delete (this.layers[layer] as Layer).zIndexTable[this.nameTable[obj.id].zIndex];
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
                    const port: Port = (object).ports[i] as Port;
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
                    if (children[i] instanceof DiagramNativeElement || ((children[i].id) && (children[i].id).indexOf('icon_content') > 0)) {
                        if ((children[i].id).indexOf('icon_content') > 0 && this.mode === 'SVG') {
                            element = getDiagramElement(children[i].id + '_shape_groupElement', this.element.id);
                            if (element) {
                                element.parentNode.removeChild(element);
                            }
                            element = getDiagramElement(children[i].id + '_rect_groupElement', this.element.id);
                            if (element) {
                                element.parentNode.removeChild(element);
                            }
                        }
                        for (const elementId of this.views) {
                            removeElement(children[i].id + '_groupElement', elementId);
                            const nodeIndex: number = this.scroller.removeCollection.indexOf(currentObj.id);
                            this.scroller.removeCollection.splice(nodeIndex, 1);
                        }
                    } else if (children[i] instanceof DiagramHtmlElement) {
                        for (const elementId of this.views) {
                            removeElement(currentObj.id + '_html_element', elementId);
                            removeElement(children[i].id + '_html_element', elementId);
                            this.clearTemplate(['nodeTemplate' + '_' + currentObj.id]);
                            if ((children[i] as DiagramEventAnnotation).annotationId) {
                                this.clearTemplate(
                                    ['annotationTemplate' + '_' + currentObj.id + ((children[i] as DiagramEventAnnotation).annotationId)]);
                            }
                        }
                    }
                    removeGradient(children[i].id);
                }
            }
        }
    }

    private removeCommand(): void {
        this.remove();
    }
    /**
     * Removes the given object from diagram
     *
     * @param {NodeModel | ConnectorModel} obj - Defines the object that has to be removed from diagram
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
                    element: obj, cause: this.diagramActions,
                    state: 'Changing', type: 'Removal', cancel: false
                };
                if (isBlazor()) {
                    args = getCollectionChangeEventArguements(args as IBlazorCollectionChangeEventArgs, obj, 'Changing', 'Removal');
                }
                if (!(this.diagramActions & DiagramAction.Clear) && (obj.id !== 'helper')) {
                    this.triggerEvent(DiagramEvent.collectionChange, args);
                }
                if (!args.cancel) {
                    if (canDelete(obj)) {
                        if (obj && obj.shape && obj.shape.type === 'SwimLane') {
                            removeSwimLane(this, obj as NodeModel);
                        }
                    }
                    if (this.bpmnModule) {
                        if (this.bpmnModule.checkAndRemoveAnnotations(obj as NodeModel, this)) {
                            this.refreshCanvasLayers();
                            return;
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
                        if (obj instanceof Node) {
                            this.removeDependentConnector(obj);
                        }
                        if (!(obj as Node).isLane && !(obj as Node).isPhase) {
                            if (!(this.diagramActions & DiagramAction.Clear) && !this.isStackChild(obj as Node)) {
                                this.addHistoryEntry(entry);
                            }
                        }
                    }
                    if ((obj as Node).children && !(obj as Node).isLane && !(obj as Node).isPhase &&
                        (!isBlazor() || !(this.diagramActions & DiagramAction.UndoRedo))) {
                        this.deleteGroup(obj as Node);
                    }
                    if ((obj as Node | Connector).parentId) {
                        this.deleteChild(obj);
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
                        if (isBlazor() && (obj.id !== 'helper')) {
                            if (this.blazorActions & BlazorAction.GroupingInProgress) {
                                this.blazorRemoveIndexCollection.splice(0, 0, index);
                                this.blazorAddorRemoveCollection.splice(0, 0, obj);
                            } else if (this.blazorAddorRemoveCollection.length > 0) {
                                this.commandHandler.getBlazorOldValues();
                                this.blazorRemoveIndexCollection.splice(0, 0, index);
                                this.blazorAddorRemoveCollection.splice(0, 0, obj);
                                this.UpdateBlazorDiagramModelCollection(undefined, undefined, undefined, true);
                            } else if ((!this.isServerUpdate) && !(this.blazorActions & BlazorAction.GroupClipboardInProcess)) {
                                this.UpdateBlazorDiagramModel(obj as Node, 'Node', index);
                            }
                        }
                        if (index !== -1) {
                            this.crudDeleteNodes.push(this.nameTable[currentObj.id]);
                            this.nodes.splice(index, 1);
                            this.updateNodeEdges(currentObj);
                        }
                    } else {
                        index = this.connectors.indexOf(currentObj as ConnectorModel);
                        if (isBlazor()) {
                            if (this.blazorActions & BlazorAction.GroupingInProgress) {
                                this.blazorAddorRemoveCollection.splice(0, 0, obj);
                                this.blazorRemoveIndexCollection.splice(0, 0, index);
                            } else if (this.blazorAddorRemoveCollection.length > 0) {
                                this.commandHandler.getBlazorOldValues();
                                this.blazorAddorRemoveCollection.splice(0, 0, obj);
                                this.blazorRemoveIndexCollection.splice(0, 0, index);
                                this.UpdateBlazorDiagramModelCollection(undefined, undefined, undefined, true);
                            } else if ((!this.isServerUpdate) && !(this.blazorActions & BlazorAction.GroupClipboardInProcess)) {
                                this.UpdateBlazorDiagramModel(obj as Connector, 'Connector', index);
                            }
                        }
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
                                element: obj, cause: this.diagramActions,
                                state: 'Changed', type: 'Removal', cancel: false
                            };
                            if (isBlazor()) {
                                args = getCollectionChangeEventArguements(args as IBlazorCollectionChangeEventArgs, obj, 'Changed', 'Removal');
                            }
                            if (obj.id !== 'helper') {
                                this.triggerEvent(DiagramEvent.collectionChange, args);
                            }
                            this.resetTool();
                        }
                    }
                }
            }
        } else if (selectedItems.length > 0) {
            if (this.undoRedoModule) {
                this.historyManager.startGroupAction();
                this.blazorActions |= BlazorAction.GroupingInProgress;
                groupAction = true;
            }
            if (isBlazor() && selectedItems.length > 1) {
                this.clearSelection();
            }
            for (let i: number = 0; i < selectedItems.length; i++) {

                const node: Node = selectedItems[i] as Node;
                if (this.nameTable[selectedItems[i].id]) {
                    if ((selectedItems[i] instanceof Connector) && this.bpmnModule &&
                        this.bpmnModule.textAnnotationConnectors.indexOf(selectedItems[i] as Connector) > -1) {
                        this.remove(this.nameTable[(selectedItems[i] as Connector).targetID]);
                        return;
                    }
                    if (isBlazor()) {
                        if (!this.isServerUpdate && selectedItems && selectedItems.length > 1) {
                            this.isServerUpdate = true;
                        }
                        if ((selectedItems[i] as Node).parentId) {
                            this.insertBlazorDiagramObjects(this.nameTable[(selectedItems[i] as Node).parentId]);
                        }
                    }
                    this.remove(selectedItems[i]);
                    if (isBlazor() && (selectedItems[i] as Node).parentId) {
                        this.commandHandler.getBlazorOldValues();
                        this.isServerUpdate = false;
                    }

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
            if (!(obj as Node).isLane && !(obj as Node).isPhase) {
                if (!(this.diagramActions & DiagramAction.Clear) && !this.isStackChild(obj as Node)) {
                    this.addHistoryEntry(entry);
                }
            }
        }
    }
        
        this.tooltipObject.close();
        if (isBlazor() && selectedItems && selectedItems.length > 0) {
            let check: boolean = true;
            for (let k = 0; k < selectedItems.length; k++) {
                if (this.nameTable[selectedItems[k].id]) {
                    check = false;
                }
            }
            if (check) {
                this.isServerUpdate = false;
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

    public deleteChild(node: NodeModel | ConnectorModel | string, parentNode?: NodeModel): void {
        let id: string;
        parentNode = parentNode ? this.nameTable[parentNode.id] : this.nameTable[(node as Node).parentId];
        if (typeof node === 'string') {
            id = node;
        } else {
            id = node.id;
        }
        if (parentNode && parentNode.children) {
            for (let i: number = 0; i < parentNode.children.length; i++) {
                if (parentNode.children[i] === id) {
                    parentNode.children.splice(i, 1);
                    for (let j: number = 0; j < parentNode.wrapper.children.length; j++) {
                        if (parentNode.wrapper.children[j].id === id) {
                            parentNode.wrapper.children.splice(j, 1);
                        }
                    }
                    // EJ2-57179 - Below lines added to remove the childs to swimlane after Redo.
                    let swimlaneNode: NodeModel = this.getObject((parentNode as Node).parentId);
                    if (swimlaneNode && (swimlaneNode as Node).shape instanceof SwimLane) {
                        for (let h: number = 0; h < ((swimlaneNode as Node).shape as SwimLane).lanes.length; h++) {
                            let laneId = (node as Node).parentId.split((swimlaneNode as Node).id);
                            if (((swimlaneNode as Node).shape as SwimLane).lanes[h].id === laneId[1].slice(0, -1)) {
                                for (let y: number = 0; y < ((swimlaneNode as Node).shape as SwimLane).lanes[h].children.length; y++) {
                                    if ((node as Node).id === ((swimlaneNode as Node).shape as SwimLane).lanes[h].children[y].id) {
                                        ((swimlaneNode as Node).shape as SwimLane).lanes[h].children.splice(y, 1);
                                        break;
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
                if (this.nameTable[child]) {
                    id = child;
                }
            } else {
                id = child.id = child.id || randomId();
                this.add(child);
            }
            if (id && (!(child as Node).umlIndex || (child as Node).umlIndex === -1)) {
                const childNode: NodeModel = this.nameTable[id];
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
                    let swimlane: NodeModel = this.getObject((node as Node).parentId);
                    if (swimlane && (swimlane as Node).shape instanceof SwimLane) {
                        for (let h: number = 0; h < ((swimlane as Node).shape as SwimLane).lanes.length; h++) {
                            let laneId = (childNode as Node).parentId.split((node as Node).parentId);
                            if (((swimlane as Node).shape as SwimLane).lanes[h].id === laneId[1].slice(0, -1)) {
                                ((swimlane as Node).shape as SwimLane).lanes[h].children.push(childNode);
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
     * Clears all nodes and objects in the diagram
     *
     * @returns { void }     getDirection method .\
     * @deprecated
     */
    public clear(): void {
        this.clearObjects();
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
        if (isBlazor() && blazorTemplates["diagramsf_node_template"]) {
            this.resetTemplate();
            let length: number = blazorTemplates["diagramsf_node_template"].length
            if (length > 0) {
                blazorTemplates["diagramsf_node_template"].splice(0, length - 1);
            }
        }
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
                    if (node.isLane && currentParentId === lanes[i].id) {
                        laneHeader = this.nameTable[(lanes[i] as LaneModel).header.id];
                    }
                }
            } else if (node.shape.type === 'SwimLane' && (node.shape as SwimLaneModel).header && (node.shape as SwimLane).hasHeader) {
                const id: string = (node.wrapper.children[0] as GridPanel).rows[0].cells[0].children[0].id;
                laneHeader = this.nameTable[id];
            }
        }
        this.startTextEdit(laneHeader);
    }

    /* tslint:disable */
    /**
     * Specified annotation to edit mode
     *
     * @returns { void }  Specified annotation to edit mode .\
     * @param {NodeModel | ConnectorModel} node - Defines node/connector that contains the annotation to be edited
     * @param {string} id - Defines annotation id to be edited in the node
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
                if (isBlazor()) {
                    const selectedNode: NodeModel | ConnectorModel = cloneObject(node);
                    if (selectedNode.annotations.length > 0) {
                        this.insertValue(selectedNode, (node instanceof Node) ? true : false);
                    }
                    node = this.nameTable[node.id] || node;
                }
                if (node.shape && node.shape.type === 'UmlClassifier') { node = this.nameTable[(node as Node).children[0]]; }
                let bpmnAnnotation: boolean = false;
                if (this.bpmnModule) {
                    textWrapper = this.bpmnModule.getTextAnnotationWrapper(node as NodeModel, id);
                    if (textWrapper) { node = this.nameTable[node.id.split('_textannotation_')[0]]; }
                }
                if (!textWrapper) {
                    if (node.shape.type !== 'Text' && node.annotations.length === 0) {
                        if (!(node.constraints & NodeConstraints.ReadOnly)) {
                            this.activeLabel.isGroup = true;
                            this.startGroupAction();
                            this.addLabels(node as Node, [{ id: randomId(), content: '' }]);
                        }
                    }
                    if (!id && ((node.shape.type !== 'Text' && node.annotations.length > 0) || (node.shape.type === 'Text'))) {
                        id = (node.shape.type === 'Text') ? (node.wrapper.children[0].id).split('_')[1] : node.annotations[0].id;
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
                    if (node instanceof Connector && node.type === 'Bezier') {
                        let getCenterPoint = this.getMidPoint(node);
                        x = (((((getCenterPoint as any).cx + transform.tx) * transform.scale) - (bounds.width / 2) * scale) - 2.5);
                        y = (((((getCenterPoint as any).cy + transform.ty) * transform.scale) - (bounds.height / 2) * scale) - 3);
                    }
                    attributes = {
                        'id': this.element.id + '_editTextBoxDiv', 'style': 'position: absolute' + ';left:' + x + 'px;top:' +
                            y + 'px;width:' + ((bounds.width + 1) * scale) + 'px;height:' + (bounds.height * scale) +
                            'px; containerName:' + node.id + ';'
                    };
                    setAttributeHtml(textEditing, attributes);
                    attributes = {
                        'id': this.element.id + '_editBox', 'style': 'width:' + ((bounds.width + 1) * scale) +
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
            const connector: Connector = this.nameTable[node.outEdges[i]];
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
            node = nodes[i];
            if (!node[parentId] && !node[processId]) {
                nodesCollection.push(node);
            }
        }
        return nodesCollection;
    }

    /* tslint:disable */
    /**
     * Automatically updates the diagram objects based on the type of the layout
     * @returns { ILayout | boolean }  Automatically updates the diagram objects based on the type of the layout .\
     */
    public doLayout(): ILayout | boolean {
        let update: boolean = false; let layout: ILayout;
        const canDoOverlap: boolean = (this.layout.type === 'ComplexHierarchicalTree' || this.layout.type === 'HierarchicalTree');
        const propChange: boolean = this.isProtectedOnChange; this.protectPropertyChange(true);
        const nodes: INode[] = this.removeChildrenFromLayout(this.nodes as INode[]);
        const canEnableRouting: boolean = this.layout.enableRouting && this.layout.type === 'ComplexHierarchicalTree';
        const viewPort: PointModel = { x: this.scroller.viewPortWidth, y: this.scroller.viewPortHeight };
        if (this.layout.type !== 'None') {
            if (canEnableRouting || ((this.layout as Layout).connectionPointOrigin === 'DifferentPoint' && this.lineDistributionModule && canDoOverlap) || this.layout.arrangement === 'Linear') {
                this.lineDistributionModule.initLineDistribution((this.layout as Layout), this);
            }
            if (this.organizationalChartModule) {
                layout = this.organizationalChartModule.updateLayout(
                    nodes, this.nameTable, this.layout as Layout,
                    viewPort, this.dataSourceSettings.id, this.diagramActions);
                update = true;
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
                const nodes: INode[] = this.complexHierarchicalTreeModule.getLayoutNodesCollection(this.nodes as INode[]);
                if (nodes.length > 0) {
                    // eslint-disable-next-line max-len
                    this.complexHierarchicalTreeModule.doLayout(nodes, this.nameTable, this.layout as Layout, viewPort, this.lineDistributionModule);
                }
                update = true;
            }
            if (update) {
                this.preventDiagramUpdate = true;
                const connectors: Object = {};
                const updatedNodes: NodeModel[] = nodes as NodeModel[];
                // BLAZ-22230 - Added condition to check if canUpdateTemplate is false means then we can update the template for blazor
                if (isBlazor() && !this.commandHandler.canUpdateTemplate) { this.updateTemplate(); }
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
                            const connector: Connector = this.nameTable[node.inEdges[j]];
                            connectors[connector.id] = connector;
                        }
                    }
                    if (node.outEdges.length > 0) {
                        for (let k: number = 0; k < node.outEdges.length; k++) {
                            const connection: Connector = this.nameTable[node.outEdges[k]];
                            connectors[connection.id] = connection;
                        }
                    }
                }
                for (const conn of Object.keys(connectors)) {
                    if (canEnableRouting) {
                        this.lineDistributionModule.resetConnectorSegments(this.nameTable[conn]);
                    }
                    const connector: Connector = connectors[conn] as Connector;
                    const points: PointModel[] = this.getPoints(connector);
                    if (canEnableRouting) {
                        this.lineDistributionModule.resetRoutingSegments(connector, this, points);
                    }
                    updateConnector(connector, points);
                    if (connector.shape.type === 'Bpmn' && (connector.shape as BpmnFlowModel).sequence === 'Default') {
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
                    this.lineDistributionModule.distributeLines((this.layout as Layout), this);
                }
                this.preventDiagramUpdate = false;
                this.updatePage();
                if ((!(this.diagramActions & DiagramAction.Render)) || this.mode === 'Canvas') {
                    this.refreshDiagramLayer();
                }
            }
            if (!propChange) {
                this.protectPropertyChange(propChange);
            }
        }
        if (update) {
            this.updateDiagramElementQuad();
        }
        return ((this.blazorActions & BlazorAction.expandNode) ? layout : isBlazor() ? null : true);
    }
    /* tslint:enable */
    /**
     * Serializes the diagram control as a string
     * @returns { string }     Serializes the diagram control as a string .\
     */
    public saveDiagram(): string {
        let children: string[] = []; let node: Node; let grid: GridPanel; let childTable: DiagramElement[];
        let child: Canvas; const gridChild: string = 'childTable';
        for (let i: number = 0; i < this.nodes.length; i++) {
            node = this.nodes[i] as Node;
            if (node.shape.type === 'SwimLane') {
                grid = node.wrapper.children[0] as GridPanel;
                childTable = grid[gridChild];
                for (const key of Object.keys(childTable)) {
                    child = childTable[key];
                    children = getChild(child as Canvas, children);
                }
                for (let i: number = 0; i < children.length; i++) {
                    if (this.nameTable[children[i]]) {
                        this.swimlaneChildTable[children[i]] = this.nameTable[children[i]].zIndex;
                    }
                }
                this.swimlaneZIndexTable[node.id] = node.zIndex;
            }
        }
        return serialize(this);
    }
    /**
     * Converts the given string as a Diagram Control
     *
     * @returns { Object }      Converts the given string as a Diagram Control .\
     * @param {string} data - Defines the behavior of the diagram to be loaded
     * @deprecated
     */
    public loadDiagram(data: string): Object {
        return deserialize(data, this);
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
        }
        return '';
    }

    /**
     * To export diagram native/html image
     *
     * @returns { void } To export diagram native/html image .\
     * @param {string} image - defines image content to be exported.
     * @param {IExportOptions} options - defines the image properties.
     */
    public exportImage(image: string, options: IExportOptions): void {
        if (this.printandExportModule) {
            this.printandExportModule.exportImages(image, options);
        }
    }

    /**
     * To print native/html nodes of diagram
     *
     * @returns { void } To print native/html nodes of diagram .\
     * @param {string} image - defines image content.
     * @param {IExportOptions} options - defines the properties of the image
     */
    public printImage(image: string, options: IExportOptions): void {
        if (this.printandExportModule) {
            options.printOptions = true;
            this.printandExportModule.exportImages(image, options);
        }
    }

    /**
     * To limit the history entry of the diagram
     *
     * @returns { void }  To limit the history entry of the diagram.\
     * @param {number} stackLimit - defines stackLimit of the history manager.
     */
    public setStackLimit(stackLimit: number): void {
        if (this.undoRedoModule && stackLimit) {
            this.historyManager.stackLimit = stackLimit;
            this.undoRedoModule.applyLimit(this.historyManager.currentEntry, stackLimit, this, true);
        }
    }

    /**
     * To clear history of the diagram
     * @returns { void } To clear history of the diagram .\
     */
    public clearHistory(): void {
        if (this.undoRedoModule) {
            this.undoRedoModule.clearHistory(this);
        }
    }

    /**
     * To get the bound of the diagram
     * @returns { void } To get the bound of the diagram .\
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
        }
        return new Rect();
    }

    /**
     * To export Diagram
     *
     * @returns { void } To export Diagram .\
     * @param {IExportOptions} options - defines the how the image to be exported.
     */
    public exportDiagram(options: IExportOptions): string | SVGElement {
        if (this.printandExportModule) {
            const data: string | SVGElement = this.printandExportModule.exportDiagram(options);
            return data;
        }
        return '';
    }

    /**
     * To print Diagram
     *
     * @returns { void }     To print Diagram .\
     * @param {IPrintOptions} optons - defines how the image to be printed.
     */

    public print(options: IPrintOptions): void {
        if (this.printandExportModule) {
            this.printandExportModule.print(options);
        }
    }


    /**
     * Add ports at the run time \
     *
     * @returns { void }    Remove Labels at the run time .\
     * @param { Node | ConnectorModel} obj - provide the obj value.
     * @param {ShapeAnnotationModel[] | PathAnnotationModel[]} ports - provide the ports value.
     * @blazorArgsType obj|DiagramNode
     */
    public addPorts(obj: NodeModel, ports: PointPortModel[]): void {
        this.protectPropertyChange(true);
        const portCollection: PointPort[] = [];
        let isAddPortInServer: boolean = true;
        if (isBlazor() && obj !== null && (obj.ports.length > 0 && !(this.diagramActions & DiagramAction.UndoRedo))) {
            const index: number = Number(findObjectIndex(obj, (ports[0] as PointPortModel).id, false));
            if (index !== -1) {
                isAddPortInServer = false;
            }
        }
        obj = this.nameTable[obj.id] || obj;
        let newObj: PointPort;
        if (ports.length > 1) {
            this.startGroupAction();
        }
        for (let i: number = 0; i < ports.length; i++) {
            newObj = new PointPort(obj, 'ports', ports[i], true);
            obj.ports.push(newObj);
            if (isBlazor() && isAddPortInServer) {
                portCollection.push(newObj);
            }
            if (obj.children) {
                const container: Container = obj.wrapper;
                (obj as Node).initPort(this.getDescription, (obj.wrapper.children[container.children.length - 1] as Container), newObj);
            } else {
                const canvas: Container = obj.wrapper;
                canvas.children.push((obj as Node).initPortWrapper(obj.ports[obj.ports.length - 1] as Port));
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
        if (isBlazor() && isAddPortInServer) {
            this.UpdateBlazorLabelOrPortObjects(portCollection, 'Port', undefined, this.nodes.indexOf(obj));
        }
        obj.wrapper.measure(new Size(obj.width, obj.height));
        obj.wrapper.arrange(obj.wrapper.desiredSize);
        this.updateDiagramObject(obj);
        this.protectPropertyChange(false);
    }


    /**
     * Add constraints at run time \
     *
     * @returns { void }Add constraints at run time .\
     * @param {number} constraintsType - provide the source value.
     * @param {number} constraintsValue - provide the target value.
     *
     */
    public addConstraints(constraintsType: number, constraintsValue: number): number {
        return constraintsType | constraintsValue;
    }


    /**
     * Remove constraints at run time \
     *
     * @returns { void }Remove constraints at run time .\
     * @param {number} constraintsType - provide the source value.
     * @param {number} constraintsValue - provide the target value.
     *
     */
    public removeConstraints(constraintsType: number, constraintsValue: number): number {
        return constraintsType & ~constraintsValue;
    }


    /**
     * Add labels in node at the run time in the blazor platform \
     *
     * @returns { void } Add labels in node at the run time in the blazor platform .\
     * @param {NodeModel} obj - provide the obj value.
     * @param {ShapeAnnotationModel[]} labels - provide the labels value.
     *
     */
    public addNodeLabels(obj: NodeModel, labels: ShapeAnnotationModel[]): void {
        this.addLabels(obj, labels);
    }


    /**
     * Add labels in connector at the run time in the blazor platform\
     *
     * @returns { void } Add labels in connector at the run time in the blazor platform .\
     * @param {ConnectorModel} obj - provide the obj value.
     * @param {PathAnnotationModel[]} labels - provide the labels value.
     *
     */
    public addConnectorLabels(obj: ConnectorModel, labels: PathAnnotationModel[]): void {
        this.addLabels(obj, labels);
    }


    /**
     * Add Labels at the run time \
     *
     * @returns { void } Add Labels at the run time .\
     * @param {NodeModel | ConnectorModel} obj - provide the obj value.
     * @param {ShapeAnnotationModel[] | PathAnnotation[] | PathAnnotationModel[]} labels - provide the labels value.
     *
     */
    public addLabels(obj: NodeModel | ConnectorModel, labels: ShapeAnnotationModel[] | PathAnnotation[] | PathAnnotationModel[]): void {
        this.protectPropertyChange(true); let isAddLabelInServer: boolean = true;
        const annotationCollection: (PathAnnotation | ShapeAnnotation)[] = [];
        if (isBlazor() && obj != null && obj.annotations.length > 0 && !(this.diagramActions & DiagramAction.UndoRedo)) {
            const index: number = Number(findObjectIndex(obj, (labels[0] as ShapeAnnotationModel | PathAnnotationModel).id, true));
            if (index !== -1) {
                isAddLabelInServer = false;
            }
        }
        obj = this.nameTable[obj.id] || obj;
        const canvas: Container = obj.wrapper; let newObj: ShapeAnnotation | PathAnnotation;
        if (labels.length > 1) {
            this.startGroupAction();
        }
        for (let i: number = 0; i < labels.length; i++) {
            if (obj instanceof Node) {
                newObj = new ShapeAnnotation(obj, 'annotations', labels[i], true);
                (obj as Node).annotations.push(newObj);
                if (isBlazor() && isAddLabelInServer) {
                    annotationCollection.push(newObj);
                }
                if ((obj as Node).children) {
                    const node: Node = (obj as Node);
                    for (let i: number = 0; i < node.wrapper.children.length; i++) {
                        if (node.wrapper.children[i].id === node.id + 'group_container') {
                            const container: Container = node.wrapper.children[i] as Container;
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
                newObj = new PathAnnotation(obj, 'annotations', labels[i], true);
                (obj as Connector).annotations.push(newObj as PathAnnotation);
                if (isBlazor() && isAddLabelInServer) {
                    annotationCollection.push(newObj);
                }
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
        if (isBlazor() && isAddLabelInServer) {
            this.UpdateBlazorLabelOrPortObjects(
                annotationCollection, (obj instanceof Node) ? 'NodeAnnotation' : 'ConnectorAnnotation', undefined,
                (obj instanceof Node) ? this.nodes.indexOf(obj) : this.connectors.indexOf(obj as Connector));
        }
        obj.wrapper.measure(new Size(canvas.width, canvas.height));
        obj.wrapper.arrange(canvas.desiredSize);
        this.updateDiagramObject(obj);
        this.protectPropertyChange(false);
    }



    /**
     * Add dynamic Lanes to swimLane at runtime \
     *
     * @returns { void } Add dynamic Lanes to swimLane at runtime .\
     * @param {NodeModel} node - provide the obj value.
     * @param {LaneModel[]} lane - provide the labels value.
     * @param {number} index - provide the labels value.
     *
     */
    public addLanes(node: NodeModel, lane: LaneModel[], index?: number): void {
        node = this.nameTable[node.id] || node;
        for (let i: number = 0; i < lane.length; i++) {
            addLane(this, node, lane[i], index);
            if (index !== undefined) {
                index += 1;
            }
        }
        this.updateDiagramElementQuad();
    }


    /**
     * Add a phase to a swimLane at runtime \
     *
     * @returns { void } Add a phase to a swimLane at runtime .\
     * @param {NodeModel} node - provide the obj value.
     * @param {PhaseModel[]} phases - provide the labels value.
     *
     */
    public addPhases(node: NodeModel, phases: PhaseModel[]): void {
        node = this.nameTable[node.id] || node;
        for (let i: number = 0; i < phases.length; i++) {
            addPhase(this, node, phases[i]);
        }
        this.updateDiagramElementQuad();
    }


    /**
     *Remove dynamic Lanes to swimLane at runtime \
     *
     * @returns { void } Remove dynamic Lanes to swimLane at runtime .\
     * @param {NodeModel} node - provide the node value.
     * @param {LaneModel} lane - provide the lane value.
     *
     */
    public removeLane(node: NodeModel, lane: LaneModel): void {
        removeLane(this, undefined, node, lane);
        this.updateDiagramElementQuad();
    }


    /**
     *Remove a phase to a swimLane at runtime \
     *
     * @returns { void } Remove a phase to a swimLane at runtime .\
     * @param {NodeModel} node - provide the node value.
     * @param {PhaseModel} phase - provide the phase value.
     *
     */
    public removePhase(node: NodeModel, phase: PhaseModel): void {
        removePhase(this, undefined, node, phase);
        this.updateDiagramElementQuad();
    }

    private removelabelExtension(
        obj: Node | ConnectorModel, labels: ShapeAnnotationModel[] | PathAnnotationModel[],
        j: number, wrapper: DiagramElement):
        void {
        for (let i: number = 0; i < (wrapper as Container).children.length; i++) {
            const canvas: DiagramElement = (wrapper as Container).children[i];
            if ((canvas instanceof TextElement) || (canvas instanceof DiagramHtmlElement)) {
                if (canvas.id.match('_' + labels[j].id + '$')) {
                    for (let k: number = 0; k < obj.annotations.length; k++) {
                        if (canvas.id.match('_' + obj.annotations[k].id + '$')) {
                            if (!(this.diagramActions & DiagramAction.UndoRedo)) {
                                const entry: HistoryEntry = {
                                    type: 'LabelCollectionChanged', changeType: 'Remove', undoObject: cloneObject(obj.annotations[k]),
                                    redoObject: cloneObject(obj), category: 'Internal'
                                };
                                this.addHistoryEntry(entry);
                            }
                            obj.annotations.splice(k, 1);
                        }
                    }
                    (wrapper as Container).children.splice(i, 1);
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
     * Remove Labels at the run time \
     *
     * @returns { string }    Remove Labels at the run time .\
     * @param { Node | ConnectorModel} obj - provide the obj value.
     * @param {ShapeAnnotationModel[] | PathAnnotationModel[]} labels - provide the labels value.
     *
     */
    public removeLabels(obj: Node | ConnectorModel, labels: ShapeAnnotationModel[] | PathAnnotationModel[]): void {
        let isAddLabelInServer: boolean = true;
        if (isBlazor() && obj !== null && !(this.diagramActions & DiagramAction.UndoRedo)) {
            const index: number = (obj.annotations.length > 0) ? Number(findObjectIndex(obj, (labels[0]).id, true)) : -1;
            if (index === -1) {
                isAddLabelInServer = false;
            }
        }
        obj = this.nameTable[obj.id] || obj;
        if (isBlazor() && isAddLabelInServer) {
            const annotationCollection: (PathAnnotation | ShapeAnnotation)[] = [];
            const removalIndexCollection: number[] = [];
            for (let j: number = 0; j < labels.length; j++) {
                const index: number = Number(findObjectIndex(obj, (labels[j] as ShapeAnnotationModel | PathAnnotationModel).id, true));
                removalIndexCollection.push(index);
                annotationCollection.push(labels[j] as (PathAnnotation | ShapeAnnotation));
            }
            this.UpdateBlazorLabelOrPortObjects(
                annotationCollection, (obj instanceof Node) ? 'NodeAnnotation' : 'ConnectorAnnotation',
                removalIndexCollection, (obj instanceof Node) ? this.nodes.indexOf(obj) : this.connectors.indexOf(obj as Connector));
        }
        if (labels.length > 1) {
            this.startGroupAction();
        }
        for (let j: number = labels.length - 1; j >= 0; j--) {
            if ((obj as NodeModel).children && (obj as NodeModel).children.length > 0) {
                for (let k: number = 0; k < obj.wrapper.children.length; k++) {
                    this.removelabelExtension(obj, labels, j, obj.wrapper.children[k]);
                }
            } else {
                this.removelabelExtension(obj, labels, j, obj.wrapper);
            }

        }
        if (labels.length > 1) {
            this.endGroupAction();
        }
    }


    private removePortsExtenion(
        obj: Node, ports: PointPortModel[],
        j: number, wrapper: DiagramElement):
        void {
        for (let i: number = 0; i < (wrapper as Container).children.length; i++) {
            const canvas: DiagramElement = (wrapper as Container).children[i];
            if (canvas instanceof PathElement) {
                if (canvas.id.match('_' + ports[j].id + '$')) {
                    for (let k: number = 0; k < obj.ports.length; k++) {
                        if (canvas.id.match('_' + obj.ports[k].id + '$')) {
                            if (!(this.diagramActions & DiagramAction.UndoRedo)) {
                                const entry: HistoryEntry = {
                                    type: 'PortCollectionChanged', changeType: 'Remove', undoObject: cloneObject(obj.ports[k]),
                                    redoObject: cloneObject(obj), category: 'Internal'
                                };
                                this.addHistoryEntry(entry);
                            }
                            obj.ports.splice(k, 1);
                        }
                    }
                    (wrapper as Container).children.splice(i, 1);
                    if (this.mode === 'SVG') {
                        const element: HTMLElement = getDiagramElement(canvas.id, this.element.id);
                        element.parentNode.removeChild(element);
                    } else {
                        this.refreshCanvasLayers();
                    }
                }
            }
        }
    }


    /**
     * Remove Ports at the run time \
     *
     * @returns { void } checkSourcePointInTarget method .\
     * @param {Node} obj - provide the Connector value.
     * @param {PointPortModel[]} ports - provide the Connector value.
     *
     */
    public removePorts(obj: Node, ports: PointPortModel[]): void {
        let isAddPortInServer: boolean = true;
        if (isBlazor() && obj !== null && !(this.diagramActions & DiagramAction.UndoRedo)) {
            const index: number = (obj.ports.length > 0) ? Number(findObjectIndex(obj, (ports[0] as PointPortModel).id, false)) : -1;
            if (index === -1) {
                isAddPortInServer = false;
            }
        }
        obj = this.nameTable[obj.id] || obj;
        if (isBlazor() && isAddPortInServer) {
            const removalIndexCollection: number[] = [];
            const portCollection: PortModel[] = [];
            for (let j: number = ports.length - 1; j >= 0; j--) {
                const index: number = Number(findObjectIndex(obj, (ports[j] as PortModel).id, false));
                removalIndexCollection.push(index);
                portCollection.push(ports[j] as PortModel);
            }
            this.UpdateBlazorLabelOrPortObjects(portCollection, 'Port', removalIndexCollection, this.nodes.indexOf(obj));
        }
        if (ports.length > 1) {
            this.startGroupAction();
        }
        for (let j: number = ports.length - 1; j >= 0; j--) {
            if ((obj as NodeModel).children && (obj as NodeModel).children.length > 0) {
                for (let k: number = 0; k < obj.wrapper.children.length; k++) {
                    this.removePortsExtenion(obj, ports, j, obj.wrapper.children[k]);
                }
            } else {
                this.removePortsExtenion(obj, ports, j, obj.wrapper);
            }

        }

        if (ports.length > 1) {
            this.endGroupAction();
        }
    }

    //public methods - end region



    /**
     * getSizeValue method \
     *
     * @returns { string }     getSizeValue method .\
     * @param {string | Number} real - provide the real value.
     * @param {string | Number} rulerSize - provide the rulerSize value.
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
        const width: String = this.getSizeValue(this.width, position.width);
        const height: String = this.getSizeValue(this.height, position.height);
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
            rect.setAttribute('fill', 'url(' + location.protocol + '//' + location.host + location.pathname +
                '#' + this.element.id + '_pattern)');
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
        const scrollerSize: number = getScrollerWidth();
        this.scroller.scrollerWidth = scrollerSize;
        this.scroller.setViewPortSize(bounds.width, bounds.height);
        this.renderRulers();
        const measureWindowElement: string = 'measureElement';
        if (window[measureWindowElement]) {
            window[measureWindowElement] = null;
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
     * @param {string | Number} width - provide the source value.
     * @param {string | Number} height - provide the source value.
     *
     * @private
     */
    public createSvg(id: string, width: string | Number, height: string | Number): SVGElement {
        const svgObj: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        setAttributeSvg(svgObj, { 'id': id, 'width': width, 'height': height });
        return svgObj;
    }
    private updateBazorShape(): void {
        for (let i: number = 0; i < this.nodes.length; i++) {
            const node: NodeModel = this.nodes[i];
            switch (node.shape.type) {
                case 'Bpmn':
                    (node.shape as DiagramShape).bpmnShape =
                        (node.shape as BpmnShape).shape ? (node.shape as BpmnShape).shape
                            : (node.shape as DiagramShape).bpmnShape; break;
                case 'UmlActivity':
                    (node.shape as DiagramShape).umlActivityShape =
                        (node.shape as UmlActivityShape).shape ? (node.shape as UmlActivityShape).shape
                            : (node.shape as DiagramShape).umlActivityShape; break;
                case 'Flow':
                    (node.shape as DiagramShape).flowShape =
                        (node.shape as FlowShape).shape ? (node.shape as FlowShape).shape
                            : (node.shape as DiagramShape).flowShape; break;
                case 'Basic':
                    (node.shape as DiagramShape).basicShape =
                        (node.shape as BasicShape).shape ? (node.shape as BasicShape).shape
                            : (node.shape as DiagramShape).basicShape; break;
                case 'Text':
                    (node.shape as DiagramShape).textContent =
                        (node.shape as Annotation).content ? (node.shape as Annotation).content
                            : (node.shape as DiagramShape).textContent; break;

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
        const canCloneObject: boolean = window && window[blazor] && !this.dataSourceSettings.dataSource;
        const tempTabel: {} = {};
        const bpmnTable: {} = {};

        const tempNode: NodeModel[] = [];
        const groups: string[] = [];

        const i: number = 0;
        let previousNodeObject: Object[] = [];
        let previousConnectorObject: Object[] = [];
        const updateNodeObject: Object[] = [];
        const updateConnectorObject: Object[] = [];
        const changeNodes: Object[] = [];
        const changeConnectors: Object[] = [];
        if (isBlazor() && canCloneObject) {
            previousNodeObject = this.previousNodeCollection;
            previousConnectorObject = this.previousConnectorCollection;
        }
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
        for (const layer of this.layers) {
            for (const obj of layer.objects) {
                if (tempTabel[obj]) {
                    if (!(tempTabel[obj] instanceof Connector)) {
                        if ((tempTabel[obj] as Node).children) {
                            groups.push(obj);
                        } else if ((tempTabel[obj].shape instanceof BpmnShape) &&
                            (tempTabel[obj].shape as BpmnShape).activity.subProcess.processes &&
                            (tempTabel[obj].shape as BpmnShape).activity.subProcess.processes.length > 0) {
                            bpmnTable[tempTabel[obj].id] = obj;
                        } else {
                            this.initNodes(tempTabel[obj], layer);
                        }
                    } else {
                        const connector: ConnectorModel = tempTabel[obj];
                        if (connector.sourceID && connector.targetID) {
                            const sourceNode: NodeModel = tempTabel[connector.sourceID];
                            const targetNode: NodeModel = tempTabel[connector.targetID];
                            let flag: boolean = true;
                            if (this.isLoading && ((sourceNode && sourceNode.children && sourceNode.children.length > 0) ||
                                (targetNode && targetNode.children && targetNode.children.length > 0))) {
                                flag = false;
                            }
                            if ((sourceNode && sourceNode.wrapper && targetNode && targetNode.wrapper) && flag) {
                                this.initConnectors(tempTabel[obj], layer);
                            } else {
                                connectors.push(tempTabel[obj]);
                            }
                        } else {
                            this.initConnectors(tempTabel[obj], layer);
                        }
                    }
                }
            }
            if (this.bpmnModule) {
                for (const obj of this.bpmnModule.textAnnotationConnectors) {
                    this.initConnectors(obj as Connector, layer, false);
                }
            }
        }
        for (const obj of Object.keys(bpmnTable)) {
            this.initObject(tempTabel[obj]);
            this.bpmnModule.updateDocks(tempTabel[obj], this);
        }
        const alignedGroups: string[] = this.alignGroup(groups, tempTabel);
        for (const obj of alignedGroups) {
            const layer: LayerModel = this.commandHandler.getObjectLayer(obj);
            this.initNodes(tempTabel[obj], layer);
        }
        for (const connector of connectors) {
            const layer: LayerModel = this.commandHandler.getObjectLayer(connector.id);
            this.initConnectors(connector, layer);
        }
        if (isBlazor() && canCloneObject) {
            for (const obj of this.nodes) {
                updateNodeObject.push(cloneObject(obj, undefined, undefined, true));
            }
            for (const obj of this.connectors) {
                updateConnectorObject.push(cloneObject(obj, undefined, undefined, true));
            }
            this.commandHandler.getObjectChanges(previousNodeObject, updateNodeObject, changeNodes);
            this.commandHandler.getObjectChanges(previousConnectorObject, updateConnectorObject, changeConnectors);
            if (!(this.blazorActions & BlazorAction.ClearObject)) {
                const blazorInterop: string = 'sfBlazor';
                const diagramObject: Object = { nodes: changeNodes, connectors: changeConnectors };
                const obj: object = {
                    'methodName': 'UpdateBlazorProperties',
                    'diagramobj': diagramObject
                };
                window[blazorInterop].updateBlazorProperties(obj, this);
            }
        }
    }
    private alignGroup(parents: string[], tempTabel: {}): string[] {
        let newList: string[] = [];
        const parentist: string[] = [];
        let child: string;
        let childNode: NodeModel;
        let i: number; let j: number;
        for (i = 0; i < parents.length; i++) {
            child = parents[i];
            childNode = tempTabel[child]; let node: string;
            if (childNode && childNode.children.length) {
                for (j = 0; j < childNode.children.length; j++) {
                    node = childNode.children[j];
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
        let isSourceId: boolean = false;
        let isTargetId: boolean = false;
        if (hasLayers) {
            layer = this.commandHandler.getObjectLayer(obj.id);
        }
        if (!hasLayers || !layer) {
            if (this.activeLayer.objects.indexOf(obj.id) === -1) {
                this.activeLayer.objects.push(obj.id);
            }
        }
        if ((obj instanceof Node || obj instanceof Connector) &&
            (obj.shape.type !== 'SwimLane' || ((obj as Node).children && (obj as Node).children.length > 0))) {
            if (obj.parentId) {
                let zIndex: number = this.swimlaneZIndexTable[obj.parentId];
                if (zIndex && zIndex !== -1) {
                    obj.zIndex = this.swimlaneChildTable[obj.id];
                }
            }
            if (obj instanceof Connector && (obj.sourceID && obj.targetID)) {
                if (this.findNodeInLane(obj.sourceID) && this.findNodeInLane(obj.targetID)) {
                    if (this.activeLayer.objects.indexOf(obj.sourceID) !== -1 &&
                        this.activeLayer.objects.indexOf(obj.targetID) !== -1) {
                        this.setZIndex(layer || this.activeLayer, obj);
                    }
                } else {
                    this.setZIndex(layer || this.activeLayer, obj);
                }
            } else {
                this.setZIndex(layer || this.activeLayer, obj);
            }
        }
    }

    /** Check whether node is in lane or not */
    private findNodeInLane(nodeId: string): boolean {
        let temp: boolean = false;
        for (let i: number = 0; i < this.nodes.length; i++) {
            if (this.nodes[i].shape.type !== 'SwimLane') {
                if (this.nodes[i].id === nodeId) {
                    temp = true;
                    break;
                }
            } else {
                let node: SwimLaneModel = this.nodes[i].shape as SwimLaneModel;
                if (node.lanes && node.lanes.length > 0) {
                    for (let j: number = 0; j < node.lanes.length; j++) {
                        if (node.lanes[j].children && node.lanes[j].children.length > 0) {
                            for (let k: number = 0; k < node.lanes[j].children.length; k++) {
                                if (node.lanes[j].children[k].id === nodeId) {
                                    temp = true;
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
        if (temp) {
            return true;
        } else {
            return false;
        }
    }
    private updateLayer(newProp: DiagramModel): void {
        for (const key of Object.keys(newProp.layers)) {
            const layerObject: string[] = this.layers[key].objects;
            for (const obj of layerObject) {
                const node: NodeModel | ConnectorModel = this.nameTable[obj];
                if (newProp.layers[key].visible !== undefined) {
                    this.updateElementVisibility(node.wrapper, node as Node, newProp.layers[key].visible);
                } else if (newProp.layers[key].lock === true) {
                    this.unSelect(node);
                }
            }
            if (newProp.layers[key].lock !== undefined) {
                this.layers[key].lock = newProp.layers[key].lock;
            }
        }
        if (this.mode !== 'SVG') {
            this.refreshDiagramLayer();
        }
    }
    private updateScrollSettings(newProp: DiagramModel): void {
        const hPan: number = (-this.scroller.horizontalOffset + newProp.scrollSettings.horizontalOffset || 0);
        const vPan: number = (this.scroller.verticalOffset - newProp.scrollSettings.verticalOffset || 0);

        const oldValue: ScrollValues = {
            VerticalOffset: this.scrollSettings.verticalOffset, HorizontalOffset: this.scrollSettings.horizontalOffset,
            ViewportHeight: this.scrollSettings.viewPortHeight, ViewportWidth: this.scrollSettings.viewPortWidth,
            CurrentZoom: this.scroller.currentZoom
        };
        if (hPan !== 0 || vPan !== 0) {
            this.pan(hPan, vPan);
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
        let arg: IScrollChangeEventArgs | IBlazorScrollChangeEventArgs = {
            oldValue: oldValue as ScrollValues,
            newValue: newValue, source: this,
            panState: panStatus
        };
        if (isBlazor() && this.scrollChange) {
            arg = {
                oldValue: oldValue,
                newValue: newValue,
                sourceId: this.element.id,
                panState: panStatus
            } as IBlazorScrollChangeEventArgs;
        }
        this.triggerEvent(DiagramEvent.scrollChange, arg);
        this.commandHandler.updatePanState(true);
        if (this.mode === 'Canvas' && (this.constraints & DiagramConstraints.Virtualization)) {
            this.refreshDiagramLayer();
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
                (dataSourceSettings.dataSource.url || (dataSourceSettings[adapter] === 'BlazorAdaptor' &&
                    !dataSourceSettings.dataSource.url))) {
                this.dataBindingModule.initSource(this.dataSourceSettings, this);
            } else {
                this.dataBindingModule.initData(this.dataSourceSettings, this);
            }
        }
    }

    private generateData(dataSource: DataSourceModel | DataManager, isNode: boolean): (NodeModel | ConnectorModel)[] {
        const nodes: (NodeModel | ConnectorModel)[] = [];
        let i: number;
        for (i = 0; i < (dataSource as object[]).length; i++) {
            const row: object = dataSource[i];
            const node: Connector | Node = isNode ? this.makeData(row as object[], true) : this.makeData(row as object[], false);
            if (node && node.id && (!findNodeByName(nodes, node.id) || !findNodeByName(nodes, node.id))) {
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
                data[fields.crudAction.customFields[i]] = row[fields.crudAction.customFields[i]];
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
        if ((obj).zIndex === -1) {
            while (currentLayer.zIndexTable[currentLayer.objectZIndex + 1]) {
                (layer as Layer).objectZIndex++;
            }
            obj.zIndex = ++currentLayer.objectZIndex;
        } else {
            const index: number = obj.zIndex;
            if (currentLayer.zIndexTable[index]) {
                const tabelLength: number = Object.keys(currentLayer.zIndexTable).length;
                let j: number = 0;
                for (let i: number = 0; i < tabelLength; i++) {
                    if (i === index) {
                        for (let j: number = tabelLength; j > index; j--) {
                            currentLayer.zIndexTable[j] = currentLayer.zIndexTable[j - 1];
                            if (this.nameTable[currentLayer.zIndexTable[j]]) {
                                this.nameTable[currentLayer.zIndexTable[j]].zIndex = j;
                            }
                        }
                        currentLayer.zIndexTable[i] = obj.id;
                    }
                    j++;
                }
            }
        }
    }

    private initializeDiagramLayers(): void {

        //const tempLayers: LayerModel[] = this.layers;
        for (let i: number = 0; i < this.layers.length; i++) {
            if (this.layers[i].zIndex !== -1) {
                const temp: LayerModel = this.layers[i];
                this.layers[i] = this.layers[this.layers[i].zIndex];
                this.layers[temp.zIndex] = temp;
            }
        }

        for (const layer of this.layers) {
            layer.zIndex = layer.zIndex !== -1 ? layer.zIndex : this.layers.indexOf(layer);
            this.layerZIndexTable[layer.zIndex] = layer.id;
        }
        for (let i: number = 0; i < this.layers.length; i++) {
            for (let j: number = i + 1; j < this.layers.length; j++) {
                if (this.layers[i].zIndex > this.layers[j].zIndex) {
                    const temp: LayerModel = this.layers[i];
                    this.layers[i] = this.layers[j];
                    this.layers[j] = temp;
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
                undefined, undefined, obj.wrapper.bounds);
            for (let i: number = 0, a = Object.keys((layer as Layer).zIndexTable); i < a.length; i++) {
                if ((layer as Layer).zIndexTable[a[i]] && (layer as Layer).zIndexTable[a[i]] === (obj as NodeModel).id) {
                    delete (layer as Layer).zIndexTable[a[i]];
                }
            }
            (layer as Layer).zIndexTable[(obj as Node).zIndex] = (obj as Node).id;
            if (!checkBoundaryConstraints) {
                const node: (NodeModel | ConnectorModel)[] = obj instanceof Node ? this.nodes : this.connectors;
                for (let i: number = 0; i <= node.length; i++) {
                    if (node[i] && (obj as NodeModel).id === node[i].id) { node.splice(i, 1); }
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
                    if (obj.id !== 'helper') {
                        const getDefaults: Function = getFunction(this.getNodeDefaults);
                        if (getDefaults) {
                            const defaults: NodeModel = getDefaults(obj, this);
                            if (defaults && defaults.ports) {
                                for (let i: number = 0; i < defaults.ports.length; i++) {
                                    defaults.ports[i].inEdges = [];
                                    defaults.ports[i].outEdges = [];
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
                    if (this.pathTable[((obj as Connector).wrapper.children[k] as PathElement).data]) {
                        ((obj as Connector).wrapper.children[k] as PathElement).absoluteBounds =
                            this.pathTable[((obj as Connector).wrapper.children[k] as PathElement).data].absoluteBounds;
                    }
                }
                (obj as Connector).wrapper.measure(new Size(undefined, undefined));
                (obj as Connector).wrapper.arrange((obj as Connector).wrapper.desiredSize);
                if (obj instanceof Connector && obj.type === 'Bezier') { this.updateConnectorAnnotation(obj); this.updateConnectorfixedUserHandles(obj); }
                for (let j: number = 0; j < (obj as Connector).wrapper.children.length; j++) {
                    this.pathTable[((obj as Connector).wrapper.children[j] as PathElement).data] = {};
                    this.pathTable[((obj as Connector).wrapper.children[j] as PathElement).data].absoluteBounds =
                        ((obj as Connector).wrapper.children[j] as PathElement).absoluteBounds;
                }
            }
            if (obj instanceof Node && obj.children && obj.container) {
                for (let i: number = 0; i < obj.children.length; i++) {
                    this.nameTable[obj.children[i]].offsetX = this.nameTable[obj.children[i]].wrapper.offsetX;
                    this.nameTable[obj.children[i]].offsetY = this.nameTable[obj.children[i]].wrapper.offsetY;
                }
            }
            if (this.bpmnModule && obj instanceof Node
                && (obj.shape as BpmnShape).type === 'Bpmn' && (obj.shape as BpmnShape).annotations.length > 0) {
                this.bpmnModule.updateQuad(obj as Node, this);
            }
            this.initObjectExtend(obj as IElement, layer, independentObj);
            this.nameTable[(obj as Node).id] = obj;
            if (obj instanceof Node && obj.children) {
                this.preventNodesUpdate = true; this.preventConnectorsUpdate = true;
                if (!group && !obj.container) { this.updateGroupOffset(obj, true); }
                this.groupTable[(obj as Node).id] = obj.children;
                for (let i: number = 0; i < (obj as Node).children.length; i++) {
                    const node: Node | Connector = (this.nameTable[obj.children[i]]);
                    if (node) { node.parentId = obj.id; }
                }
                if (!this.isLoading && obj.rotateAngle && !obj.container) {
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
        let isUpdateGroupToBlazor: boolean = false;
        if (((node as Node).children && (node as Node).children.length > 0 && (!(node as Node).container)) || ((node as Node).processId)) {
            const node1: NodeModel = this.nameTable[node.id];
            if (!(this.realActions & RealAction.PreventScale) && !(this.realActions & RealAction.PreventDrag)) {
                if (node1.offsetX && ((this.realActions & RealAction.EnableGroupAction) ||
                    ((!(this.diagramActions & DiagramAction.UndoRedo)) && (!(this.diagramActions & DiagramAction.ToolAction)
                        && !(this.diagramActions & DiagramAction.PublicMethod))))) {
                    this.realActions |= RealAction.PreventScale;
                    const diffX: number = (node1.offsetX - node.wrapper.offsetX);
                    node1.offsetX = node.wrapper.offsetX;
                    const diffY: number = (node1.offsetY - node.wrapper.offsetY);
                    node1.offsetY = node.wrapper.offsetY;
                    if ((node as Node).flip === 'None' && (diffX + diffY) !== 0) {
                        this.drag(node1, diffX, diffY);
                    }
                    this.realActions &= ~RealAction.PreventScale;
                } else {
                    if (isBlazor()) {
                        this.insertValue(cloneObject(node1), true); isUpdateGroupToBlazor = true;
                    }
                    node1.offsetX = node.wrapper.offsetX;
                }
                if (node1.offsetY && ((this.realActions & RealAction.EnableGroupAction) ||
                    ((!(this.diagramActions & DiagramAction.UndoRedo)) && (!(this.diagramActions & DiagramAction.ToolAction)
                        && !(this.diagramActions & DiagramAction.PublicMethod))))) {
                    this.realActions |= RealAction.PreventScale;
                    const diffY: number = (node1.offsetY - node.wrapper.offsetY);
                    node1.offsetY = node.wrapper.offsetY;
                    if ((node as Node).flip === 'None') {
                        this.drag(node1, 0, diffY);
                    }
                    this.realActions &= ~RealAction.PreventScale;

                } else {
                    if (isBlazor()) {
                        this.insertValue(cloneObject(node1), true); isUpdateGroupToBlazor = true;
                    }
                    node1.offsetY = node.wrapper.offsetY;
                }
                if (this.diagramActions) {
                    if (isBlazor()) {
                        this.insertValue(cloneObject(node1), true); isUpdateGroupToBlazor = true;
                    }
                    node1.width = node.wrapper.actualSize.width;
                    node1.height = node.wrapper.actualSize.height;
                }
            }
        }
        if (isUpdateSize) {
            if (((node as Node).children && (node as Node).children.length > 0)) {
                if (this.nameTable[(node as Node).id].width !== undefined) {
                    this.scaleObject((node as Node), this.nameTable[node.id].width, true);
                } else {
                    if (isBlazor()) {
                        this.insertValue(cloneObject(this.nameTable[node.id]), true); isUpdateGroupToBlazor = true;
                    }
                    this.nameTable[node.id].width = node.wrapper.actualSize.width;
                }
                if (this.nameTable[node.id].height !== undefined) {
                    this.scaleObject((node as Node), this.nameTable[node.id].height, false);
                } else {
                    if (isBlazor()) {
                        this.insertValue(cloneObject(this.nameTable[node.id]), true); isUpdateGroupToBlazor = true;
                    }
                    this.nameTable[node.id].height = node.wrapper.actualSize.height;
                }
            }
        }
        if (isUpdateGroupToBlazor && !(this.diagramActions & DiagramAction.UndoRedo) &&
            !(this.diagramActions & DiagramAction.ToolAction) &&
            !(this.diagramActions & DiagramAction.PublicMethod)) {
            this.commandHandler.getBlazorOldValues();
        }
    }

    /* eslint-disable */
    private initNode(obj: Node, diagramId: string, group?: boolean): void {
        const canvas: Container = obj.initContainer(); const portContainer: Canvas = new Canvas(); let content: DiagramElement;
        if (!this.diagramSettings.inversedAlignment) {
            canvas.inversedAlignment = false;
        }
        if (!canvas.children) { canvas.children = []; }
        if (obj.children) {
            canvas.measureChildren = false;
            portContainer.id = obj.id + 'group_container';
            portContainer.style.fill = 'none';
            portContainer.style.strokeColor = 'none'; portContainer.horizontalAlignment = 'Stretch';
            portContainer.verticalAlignment = 'Stretch'; canvas.style = obj.style;
            canvas.padding.left = obj.padding.left;canvas.padding.right = obj.padding.right;canvas.padding.top = obj.padding.top;canvas.padding.bottom = obj.padding.bottom;
            portContainer.children = []; portContainer.preventContainer = true;
            if (obj.container) { portContainer.relativeMode = 'Object'; }
            let checkPorts: boolean = (obj.ports && obj.ports.length > 0) ? true : false;
            if (isNullOrUndefined(obj.container) && !checkPorts) {
                canvas.children.push(portContainer);
            }
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
                        child.wrapper.flip = child.wrapper.flip === 'None' ?
                            obj.wrapper.flip : child.wrapper.flip;
                    }
                }
            }
            if (checkPorts || (obj.container && (obj.container.type !== 'Grid'))) {
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
        const container: Container = obj.children ? portContainer : canvas;
        obj.initAnnotations(this.getDescription, container, this.element.id, canVitualize(this) ? true : false, this.annotationTemplate);
        obj.initPorts(this.getDescription, container);
        obj.initIcons(this.getDescription, this.layout, container, diagramId);
        for (let i: number = 0; obj.fixedUserHandles !== undefined, i < obj.fixedUserHandles.length; i++) {
            const fixedUserHandles: DiagramElement = obj.initfixedUserHandles(obj.fixedUserHandles[i]);
            container.children.push(fixedUserHandles);
        }
        if (obj.shape.type === 'SwimLane' && obj.wrapper && obj.wrapper.children.length > 0 &&
            obj.wrapper.children[0] instanceof GridPanel) {
            this.setZIndex(this.activeLayer, obj);
            if (this.connectors.length > 0) {
                for (let i: number = 0; i < this.connectors.length; i++) {
                    let obj: ConnectorModel = this.connectors[i];
                    if ((obj.sourceID && obj.targetID) && (this.activeLayer.objects.indexOf(obj.sourceID) === -1 &&
                        this.activeLayer.objects.indexOf(obj.targetID) === -1)) {
                        this.setZIndex(this.activeLayer, obj);
                    }
                }
            }
            swimLaneMeasureAndArrange(obj);
            arrangeChildNodesInSwimLane(this, obj);
            this.updateDiagramElementQuad();
        } else {
            canvas.measure(new Size(obj.width, obj.height), obj.id, this.onLoadImageSize.bind(this));
            if (canvas instanceof GridPanel) {
                canvas.arrange(canvas.desiredSize, true);
            } else { canvas.arrange(canvas.desiredSize); }
        }
        if (obj.wrapper.flip !== 'None' && obj.wrapper.elementActions & ElementAction.ElementIsGroup) {
            alignElement(obj.wrapper, obj.wrapper.offsetX, obj.wrapper.offsetY, this, obj.wrapper.flip);
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
            if (this.nodes[i].wrapper && (this.nodes[i].wrapper instanceof Container)) {
                this.updateQuad(this.nodes[i] as IElement);
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
            const child: NodeModel = this.getObject(obj.children[i]);
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
            'focusToNextItem': {
                // execute: this.focusToItem.bind(this),
                canExecute: this.canExecute.bind(this), gesture: { key: Keys.Tab }
            },
            'focusToPreviousItem': {
                // execute: this.focusToItem.bind(this),
                canExecute: this.canExecute.bind(this), gesture: { key: Keys.Tab, keyModifiers: KeyModifiers.Control }
            },
            'selectFocusedItem': {
                execute: this.startEditCommad.bind(this),
                canExecute: this.canExecute.bind(this), gesture: { key: Keys.Enter }
            }
        };

        this.initCommandManager(newCommands, commands);
    }

    private overrideCommands(newCommand: CommandModel, commands: {}): void {
        let command: CommandModel;
        for (const key of Object.keys(commands)) {
            command = commands[key] as CommandModel;
            if (newCommand.gesture.key === command.gesture.key && newCommand.gesture.keyModifiers === command.gesture.keyModifiers) {
                delete commands[key];
                break;
            }
        }
    }

    private initCommandManager(newCommands: CommandModel[], commands: {}): void {
        let i: number = 0;
        if (newCommands) {
            for (i = 0; i < newCommands.length; i++) {
                if (commands[newCommands[i].name] && newCommands[i]) {
                    if (newCommands[i].canExecute) {
                        commands[newCommands[i].name].canExecute = newCommands[i].canExecute;
                    }
                    if (newCommands[i].execute) {
                        commands[newCommands[i].name].execute = newCommands[i].execute;
                    }
                    if (newCommands[i].gesture.key || newCommands[i].gesture.keyModifiers) {
                        commands[newCommands[i].name].gesture = newCommands[i].gesture;
                    }
                    if (newCommands[i].parameter !== '') {
                        commands[newCommands[i].name].parameter = newCommands[i].parameter;
                    }
                } else {
                    this.overrideCommands(newCommands[i], commands);
                    commands[newCommands[i].name] = {
                        execute: newCommands[i].execute, canExecute: newCommands[i].canExecute, gesture: newCommands[i].gesture,
                        parameter: newCommands[i].parameter
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
            if (this.nameTable[edge]) {
                this.nameTable[edge].targetID = '';
            }
        }
        for (const edge of node.outEdges) {
            if (this.nameTable[edge]) {
                this.nameTable[edge].sourceID = '';
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
        for (let i: number = 0; i < node.wrapper.children.length; i++) {
            const child: DiagramElement = node.wrapper.children[i];
            if (child.id) {
                const id: string = child.id.split(node.id)[1];
                if (id && id.match('^_icon')) {
                    child.visible = visibility;
                    this.updateDiagramContainerVisibility(child, visibility);
                }
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
            const node: Node = this.nameTable[obj.sourceID];
            if (node && node.outEdges && node.outEdges.length === 0) { node.outEdges = []; }
            if (node && node.outEdges && node.outEdges.indexOf(obj.id) === -1) {
                node.outEdges.push(obj.id);
            }
            this.updatePortEdges(node, obj, false);
        }
        if (obj.targetID !== undefined && obj.targetID !== '') {
            const node: Node = this.nameTable[obj.targetID];
            if (node && node.inEdges && node.inEdges.length === 0) { node.inEdges = []; }
            if (node && node.inEdges && node.inEdges.indexOf(obj.id) === -1) {
                node.inEdges.push(obj.id);
            }
            this.updatePortEdges(node, obj, true);
            if (node && node.visible && node.outEdges) {
                const value: boolean = node.outEdges.length === 0 ? false : true;
                this.updateIconVisibility(node, value);
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
    public updatePortEdges(node: NodeModel, obj: ConnectorModel, isInEdges: boolean): void {
        if (node) {
            for (let i: number = 0; i < node.ports.length; i++) {
                const port: PointPortModel = node.ports[i];
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
        if (isBlazor() && this.layout && this.layout.layoutInfo && this.layout.layoutInfo.isRootInverse && this.nodes.length > 2) {
            const rootNode: Node = this.nodes[0] as Node;
            if (rootNode.outEdges.length > 1) {
                const isProtectedChange: boolean = this.isProtectedOnChange;
                for (let i: number = 1; i < rootNode.outEdges.length; i++) {
                    const connector: ConnectorModel = this.nameTable[rootNode.outEdges[i]];
                    const isAllowServerUpdate: boolean = this.allowServerDataBinding;
                    this.protectPropertyChange(false);
                    this.enableServerDataBinding(false);
                    this.preventDiagramUpdate = true;
                    const target: NodeModel = this.getObject(connector.targetID);
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    if ((target.data as any).Branch === 'Left') {
                        connector.sourcePortID = rootNode.ports[1].id;
                    }
                    this.dataBind();
                    this.preventDiagramUpdate = false;
                    this.enableServerDataBinding(isAllowServerUpdate);
                    this.protectPropertyChange(isProtectedChange);
                }
            }
        }
        if (isBlazor()) {
            let view: View;
            for (const temp of this.views) {
                view = this.views[temp];
                if (view.renderDocument) {
                    view.renderDocument(view);
                    view.diagramRenderer.setLayers();
                    view.updateView(view);
                    this.renderNodes(view);
                }
            }
        }
        this.updateFitToPage();
    }

    private updateCanupdateStyle(element: DiagramElement[], value: boolean): void {
        for (let j: number = 0; j < element.length; j++) {
            if ((element[j] as Container).children) {
                this.updateCanupdateStyle((element[j] as Container).children, value);
            }
            element[j].canApplyStyle = value;
        }
    }

    private getZindexPosition(obj: (NodeModel | ConnectorModel), viewId: string): number {
        let objects: (NodeModel | ConnectorModel)[] = [];
        let index: number = undefined;
        objects = objects.concat(this.nodes);
        objects = objects.concat(this.connectors);
        let type: string;
        if (obj.zIndex !== -1) {
            for (let i: number = 0; i < objects.length; i++) {
                if (objects[i].zIndex > obj.zIndex) {
                    if (obj.shape.type === 'HTML' || obj.shape.type === 'Native') {
                        type = obj.shape.type === 'HTML' ? 'html' : 'native';
                    }
                    index = getDomIndex(viewId, objects[i].id, type);
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
            view = this.views[temp];
            if (this.diagramActions) {
                if (view.mode === 'SVG') {
                    const hasLayers: boolean = this.layers.length > 1; let layer: LayerModel;
                    if (hasLayers) {
                        layer = this.commandHandler.getObjectLayer(obj.id);
                    }
                    if ((layer === undefined || (layer && layer.visible)) || isUpdateObject) {
                        const htmlLayer: HTMLElement = getHTMLLayer(this.element.id);
                        if (!window[domTable][view.element.id + '_diagramLayer']) {
                            window[domTable][view.element.id + '_diagramLayer'] =
                                document.getElementById(view.element.id + '_diagramLayer');
                        }
                        const diagramElementsLayer: HTMLCanvasElement =
                            window[domTable][view.element.id + '_diagramLayer'] as HTMLCanvasElement;
                        if (this.diagramActions & DiagramAction.Interactions) {
                            this.updateCanupdateStyle(obj.wrapper.children, true);
                        }
                        let centerPoint = this.getMidPoint(obj);
                        this.diagramRenderer.updateNode(
                            obj.wrapper as DiagramElement, diagramElementsLayer,
                            htmlLayer, undefined, canIgnoreIndex ? undefined : this.getZindexPosition(obj, view.element.id), centerPoint);
                        this.updateCanupdateStyle(obj.wrapper.children, true);
                    }
                }
            }
        }
    }

    //Method used to apply margin for Bezier Curve points.
    private applyMarginBezier(obj: NodeModel | ConnectorModel, centerPoint: any) {
        for (let i: number = 0; i < obj.wrapper.children.length; i++) {
            if (obj.wrapper && obj.wrapper.children[i] instanceof TextElement) {
                centerPoint.cx = centerPoint.cx + obj.wrapper.children[i].margin.left
                centerPoint.cx = centerPoint.cx - obj.wrapper.children[i].margin.right
                centerPoint.cy = centerPoint.cy + obj.wrapper.children[i].margin.top
                centerPoint.cy = centerPoint.cy - obj.wrapper.children[i].margin.bottom
            }
        }
    }

    //Method used to get mid point of Bezier Curve
    private getMidPoint(obj: (NodeModel | ConnectorModel)) {
        let centerPoint: number | PointModel;
        centerPoint = obj.annotations[0] ? obj.annotations[0].offset : 0.5;
        let finalPoint: object;
        if (obj instanceof Connector && obj.type === 'Bezier') {
            let points = [
                [obj.sourcePoint.x, obj.sourcePoint.y],
                [(obj.segments[0] as BezierSegment).bezierPoint2.x, (obj.segments[0] as BezierSegment).bezierPoint2.y],
                [(obj.segments[0] as BezierSegment).bezierPoint1.x, (obj.segments[0] as BezierSegment).bezierPoint1.y],
                [obj.targetPoint.x, obj.targetPoint.y]
            ];
            let helperPoints: object[] = [];
            for (let i = 1; i < 4; i++) {
                let p = this.findPointOnCurve(points[i - 1], points[i], centerPoint);
                helperPoints.push(p);
            }
            helperPoints.push(this.findPointOnCurve(helperPoints[0], helperPoints[1], centerPoint));
            helperPoints.push(this.findPointOnCurve(helperPoints[1], helperPoints[2], centerPoint));
            helperPoints.push(this.findPointOnCurve(helperPoints[3], helperPoints[4], centerPoint));
            finalPoint = { cx: helperPoints[5][0] - 2, cy: helperPoints[5][1] - 2 }
            this.applyMarginBezier(obj, finalPoint);
        }
        return finalPoint;
    }

    private findPointOnCurve(pointOne: object, pointTwo: object, t: number | any) {
        let pointOnCurve = [
            (pointTwo[0] - pointOne[0]) * t + pointOne[0],
            (pointTwo[1] - pointOne[1]) * t + pointOne[1]
        ];
        return pointOnCurve;
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
            view = this.views[temp];
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
     *getObjectsOfLayer method \
     *
     * @returns { (NodeModel | ConnectorModel)[] } getObjectsOfLayer method .\
     * @param { string[] } objectArray - provide the objectArray value.
     *
     * @private
     */
    public getObjectsOfLayer(objectArray: string[]): (NodeModel | ConnectorModel)[] {
        const nodeArray: Object[] = [];
        for (const obj of objectArray) {
            if (this.nameTable[obj]) {
                nodeArray.push(this.nameTable[obj]);
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
            view = this.views[temp];
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
                const view: View = this.views[temp];
                this.refreshCanvasDiagramLayer(view);
            }
        } else {
            this.refreshCanvasDiagramLayer(view);
        }
    }

    private renderBasicElement(view: View): void {
        const htmlLayer: HTMLElement = getHTMLLayer(view.element.id);
        for (let i: number = 0; i < this.basicElements.length; i++) {
            const element: DiagramElement = this.basicElements[i];
            if (element instanceof Container) {
                element.prevRotateAngle = 0;
            }
            element.measure(new Size(element.width, element.height));
            element.arrange(element.desiredSize);

            view.diagramRenderer.renderElement(element, view.diagramLayer, htmlLayer);
        }
    }

    private refreshElements(view: View): void {
        if (!this.isDestroyed) {
            this.clearCanvas(view);

            if (view instanceof Diagram) {
                (view.diagramLayer as HTMLCanvasElement).getContext('2d').setTransform(
                    view.scroller.currentZoom, 0, 0, view.scroller.currentZoom, 0, 0);
                (view.diagramLayer as HTMLCanvasElement).getContext('2d').scale(1.5, 1.5);
            } else {
                let element: HTMLElement = document.getElementById(view.element.id + '_nativeLayer');
                if (element.children.length > 0) {
                    view.updateView(view);
                }
            }
            const htmlLayer: HTMLElement = getHTMLLayer(view.element.id);
            //const bounds: Rect = this.spatialSearch.getPageBounds();

            this.renderDiagramElements(view.diagramLayer, view.diagramRenderer, htmlLayer);
            for (let i: number = 0; i < this.basicElements.length; i++) {
                const element: DiagramElement = this.basicElements[i];
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


    /**
     *updatePortVisibility method \
     *
     * @returns { void } updatePortVisibility method .\
     * @param { Node } node - provide the node value.
     * @param { PortVisibility } portVisibility - provide the portVisibility value.
     * @param { Boolean } inverse - provide the inverse value.
     *
     * @private
     */
    public updatePortVisibility(node: Node, portVisibility: PortVisibility, inverse?: Boolean): void {
        let portElement: DiagramElement;
        const drawingObject: boolean = !(this.drawingObject && this.drawingObject.shape) ? true : false;
        if (node instanceof Node && drawingObject && canMove(node)) {
            const ports: PointPortModel[] = node.ports;
            let changed: boolean = false;
            for (let i: number = 0; i < ports.length; i++) {
                portElement = this.getWrapper(node.wrapper, ports[i].id);
                if ((portVisibility & PortVisibility.Hover || portVisibility & PortVisibility.Connect)) {
                    if (checkPortRestriction(ports[i], portVisibility)) {
                        portElement.visible = !inverse;
                        changed = true;
                    }
                }
            }
            if (changed) {
                this.updateDiagramObject(node);
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
                element = this.basicElements[i];
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
            for (let i: number = 0; i < this.scroller.removeCollection.length; i++) {
                const obj: (NodeModel | ConnectorModel) = this.nameTable[this.scroller.removeCollection[i]];
                this.removeElements(obj);
            }
            this.deleteVirtualObject = false;

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
            const element: TextElement = object.wrapper.children[j] as TextElement;
            if (element instanceof TextElement) {
                element.canMeasure = true;
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
                const index: number = this.scroller.removeCollection.indexOf(collection[i]);
                if (index >= 0) {
                    this.scroller.removeCollection.splice(index, 1);
                }
                const object: NodeModel | ConnectorModel = this.nameTable[collection[i]];
                this.updateTextElementValue(object);
                this.diagramRenderer.renderElement(
                    object.wrapper, diagramElementsLayer, htmlLayer, undefined, undefined, undefined, undefined, object.zIndex);
            }
            for (let k: number = 0; k < tCollection.length; k++) {
                this.scroller.removeCollection.push(tCollection[k]);
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
     *
     * @private
     */
    public renderDiagramElements(
        canvas: HTMLCanvasElement | SVGElement, renderer: DiagramRenderer, htmlLayer: HTMLElement,
        transform: boolean = true, fromExport?: boolean, isOverView?: boolean): void {
        const pageBounds: Rect = this.scroller.getPageBounds();
        pageBounds.x *= this.scroller.currentZoom;
        pageBounds.y *= this.scroller.currentZoom;
        pageBounds.width *= this.scroller.currentZoom;
        pageBounds.height *= this.scroller.currentZoom;
        const difX: number = -this.scroller.horizontalOffset - pageBounds.x;
        const difY: number = -this.scroller.verticalOffset - pageBounds.y;
        let getCenterPoint: object;
        for (const layerId of Object.keys(this.layerZIndexTable)) {
            const layer: LayerModel = this.commandHandler.getLayer(this.layerZIndexTable[layerId]);
            let left: string;
            let top: string;
            if (this.mode === 'Canvas' && canVitualize(this) && !this.diagramActions) {
                this.scroller.virtualizeElements();
            }
            const id: string[] = (this.mode === 'Canvas' && canVitualize(this) &&
                this.scroller.oldCollectionObjects.length > 0) ?
                this.scroller.oldCollectionObjects : undefined;
            for (const node of Object.keys(id || (layer as Layer).zIndexTable)) {
                const renderNode: Node = id ? this.nameTable[id[node]] : this.nameTable[(layer as Layer).zIndexTable[node]];
                if (renderNode && !(renderNode.parentId) && layer.visible &&
                    (!(renderNode.processId) || this.refreshing)) {
                    const transformValue: TransformFactor = {
                        tx: this.scroller.transform.tx,
                        ty: this.scroller.transform.ty,
                        scale: this.scroller.transform.scale
                    };
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
                        transformValue.tx = this.scroller.horizontalOffset / transformValue.scale;
                        transformValue.ty = this.scroller.verticalOffset / transformValue.scale;
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
                                const process: string = (renderNode.shape as BpmnShapeModel).activity.subProcess.processes[i];
                                renderNode.wrapper.children.push(this.nameTable[process].wrapper);
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
                        undefined, undefined, status && (!this.diagramActions || isOverView), undefined, undefined, getCenterPoint);
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
                const connector: Connector = this.connectors[i] as Connector;
                this.bridgingModule.updateBridging(connector, this);
                const canvas: Container = this.connectors[i].wrapper;
                if (canvas && canvas.children && canvas.children.length > 0) {
                    const pathSegment: PathElement = canvas.children[0] as PathElement;
                    const data: string = pathSegment.data;
                    connector.getSegmentElement(
                        connector, pathSegment,
                        this.layout.type === 'ComplexHierarchicalTree' || this.layout.type === 'HierarchicalTree' ?
                            this.layout.orientation : undefined, undefined, false);
                    if (pathSegment.data !== data) {
                        canvas.measure(new Size());
                        canvas.arrange(canvas.desiredSize);
                        if (this.mode === 'SVG' && !isLoad) {
                            this.updateDiagramObject(connector);
                        }
                    }
                }
            }
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
        const domTable: string = 'domTable';
        if (!window[domTable][this.element.id + 'content']) {
            window[domTable][this.element.id + 'content'] = document.getElementById(this.element.id + 'content');
        }
        const container: HTMLElement = window[domTable][this.element.id + 'content'];
        if (container) {
            container.scrollLeft = offsetX;
            container.scrollTop = offsetY;
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
                            x: (collection[i].x1 + this.scroller.transform.tx) * this.scroller.currentZoom,
                            y: (collection[i].y1 + this.scroller.transform.ty) * this.scroller.currentZoom
                        },
                        endPoint: {
                            x: (collection[i].x2 + this.scroller.transform.tx) * this.scroller.currentZoom,
                            y: (collection[i].y2 + this.scroller.transform.ty) * this.scroller.currentZoom
                        }, id: collection[i].y1 === collection[i].y2 ? 'HorizontalLines' : 'VerticalLines'
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
                overview.updateView(overview);
                this.renderNodes(overview);
            }
        } else {
            for (let i: number = 0; i < this.views.length; i++) {
                if (this.views[i] === id) {
                    overview = (this.views[id]);
                }
            }
            this.views[id] = undefined;
            const index: number = this.views.indexOf(id);
            this.views.splice(index, 1);
        }
    }

    private renderNodes(overview: View): void {
        if (overview) {
            const renderer: DiagramRenderer = new DiagramRenderer(overview.id, new SvgRenderer(), false);
            const g: HTMLElement = document.getElementById(overview.element.id + '_diagramLayer') as HTMLCanvasElement;
            const htmlLayer: HTMLElement = getHTMLLayer(overview.element.id);
            this.renderDiagramElements(g as HTMLCanvasElement, overview.diagramRenderer || renderer, htmlLayer, undefined, undefined, true);
        }
    }

    private updateThumbConstraints(
        node: NodeModel[] | ConnectorModel[] | PathAnnotation[] | ShapeAnnotation[],
        selectorModel: SelectorModel, canInitialize?: boolean): void {

        const state: number = 0;
        const length: number = node.length;
        for (let i: number = 0; i < length; i++) {
            const obj: NodeModel | ConnectorModel | ShapeAnnotation | PathAnnotation = node[i];
            let hideRotate: boolean = false;
            let hideResize: boolean = false;
            let thumbConstraints: ThumbsConstraints = (selectorModel as Selector).thumbsConstraints;
            if (obj instanceof Node) {
                hideRotate = (obj.shape.type === 'Bpmn' && ((obj.shape as BpmnShapeModel).shape === 'Activity' &&
                    ((obj.shape as BpmnShapeModel).activity.subProcess.collapsed === false)) ||
                    (obj.shape as BpmnShapeModel).shape === 'TextAnnotation');
                hideResize = (obj.shape.type === 'Bpmn' && (obj.shape as BpmnShapeModel).shape === 'TextAnnotation');
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
     *
     * @private
     */
    public renderSelector(multipleSelection: boolean, isSwimLane?: boolean): void {
        const isProtectedOnChangeValue: boolean = this.isProtectedOnChange;
        if (isBlazor()) {
            this.isProtectedOnChange = true;
        }
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
            } else if (selectorModel.nodes.length + selectorModel.connectors.length === 1 || this.nameTable["helper"]) {
                if (selectorModel.nodes[0] instanceof Node) {
                    const node: Node = selectorModel.nodes[0] as Node;
                    if (checkParentAsContainer(this, node)) {
                        if (!isSwimLane && (node.shape.type !== 'UmlClassifier' && !((node as Node).parentId &&
                            this.nameTable[(node as Node).parentId]
                            && this.nameTable[(node as Node).parentId].shape.type === 'UmlClassifier'))) {
                            if (!(node.container && (node.container.type === 'Canvas' || node.container.type === 'Grid'))) {
                                selectorModel.nodes[0].constraints &= ~(NodeConstraints.Rotate | NodeConstraints.HideThumbs);
                            }
                            selectorModel.thumbsConstraints &= ~ThumbsConstraints.Rotate;
                        }
                    }
                    const constraints: boolean = isSwimLane ? true : ((node.constraints & NodeConstraints.HideThumbs) ? true : false);
                    const swimlane: boolean = (node.shape.type === 'SwimLane' || node.isLane || node.isPhase || isSwimLane) ? true : false;
                    this.diagramRenderer.renderResizeHandle(
                        selectorModel.wrapper.children[0], selectorElement, selectorModel.thumbsConstraints, this.scroller.currentZoom,
                        selectorModel.constraints, this.scroller.transform, undefined, canMove(node), constraints, swimlane);
                } else if (selectorModel.connectors[0] instanceof Connector && canDrawThumbs(this.diagramRenderer.rendererActions)) {
                    const connector: Connector = selectorModel.connectors[0] as Connector;
                    this.diagramRenderer.renderEndPointHandle(
                        connector, selectorElement, selectorModel.thumbsConstraints, selectorModel.constraints,
                        this.scroller.transform, connector.sourceWrapper !== undefined,
                        connector.targetWrapper !== undefined,
                        (this.connectorEditingToolModule && canDragSegmentThumb(connector)) ? true : false, this.connectorEditingToolModule ? true : false);
                }
            } else {
                this.diagramRenderer.renderResizeHandle(
                    selectorModel.wrapper, selectorElement, selectorModel.thumbsConstraints, this.scroller.currentZoom,
                    selectorModel.constraints, this.scroller.transform, undefined, canMove(selectorModel));
            }
            if (!(selectorModel.annotation) && !this.currentSymbol) {
                this.diagramRenderer.renderUserHandler(selectorModel, selectorElement, this.scroller.transform, diagramUserHandlelayer);
                if (isBlazor() && innertemplate.length > 0) {
                    for (i = 0; i < this.selectedItems.userHandles.length; i++) {
                        const userHandle: UserHandleModel = this.selectedItems.userHandles[i];
                        div = document.getElementById(userHandle.name + '_html_element');
                        div.style.display = 'block';
                    }
                }
            }
        }
        // EJ2-56919 - Add below code to render the selection rectangle for node if selected objects length is greater than one
        if (this.selectedItems.selectedObjects.length > 1) {
            this.updateSelectionRectangle();
        }
        this.isProtectedOnChange = isProtectedOnChangeValue;
    }

    private updateSelectionRectangle() {
        const selectorElement: (SVGElement | HTMLCanvasElement) = getSelectorElement(this.element.id);
        let isFirst: boolean = false;
        for (let i: number = 0; i < this.selectedItems.selectedObjects.length; i++) {
            // EJ2-56919 - For first selected object we need to set stroke as 2, so check below condition as i is zero or not
            // For first element we passed isFirst argument(last arg) as true in both render selection line and rectangle method
            isFirst = i==0? true : false;
            if (getObjectType(this.selectedItems.selectedObjects[i]) === Connector) {
                // EJ2-56919 - If selected object type is connector means then render selection line for connector
                this.diagramRenderer.renderSelectionLine(this.selectedItems.selectedObjects[i].wrapper.children[0] as PathElement, selectorElement, this.scroller.transform, isFirst);
            } else {
                // EJ2-56919 - If selected object type is node means then render selection rectangle for node
                this.diagramRenderer.renderSelectionRectangle(this.selectedItems.selectedObjects[i].wrapper, selectorElement, this.scroller.transform, isFirst);
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
                if (selectionHasConnector(this, selector)) {
                    const eventHandler: string = 'eventHandler';
                    let rotate: string = this[eventHandler].action;
                    let isRotate: boolean = rotate.includes('Rotate');
                    let isSelect: boolean = rotate.includes('None') || rotate.includes('Select') || rotate.includes('Drag');
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
                    this.diagramRenderer.renderUserHandler(selector, selectorEle, this.scroller.transform, diagramUserHandlelayer);
                    if (isBlazor() && innertemplate.length > 0) {
                        for (i = 0; i < this.selectedItems.userHandles.length; i++) {
                            const userHandletemplate: UserHandleModel = this.selectedItems.userHandles[i];
                            div = document.getElementById(userHandletemplate.name + '_html_element');
                            div.style.display = 'block';
                        }
                    }
                }
                if (selector.annotation) {
                    this.renderSelectorForAnnotation(selector, selectorEle);
                } else if (selector.nodes.length + selector.connectors.length === 1) {
                    if (selector.connectors[0] instanceof Connector && canDrawThumbs(this.diagramRenderer.rendererActions)) {
                        const connector: Connector = selector.connectors[0] as Connector;
                        this.diagramRenderer.renderEndPointHandle(
                            connector, selectorEle, selector.thumbsConstraints, selectorConstraints,
                            this.scroller.transform, connector.sourceWrapper !== undefined, connector.targetWrapper !== undefined,
                            (this.connectorEditingToolModule && canDragSegmentThumb(connector)) ? true : false, this.connectorEditingToolModule ? true : false);
                    } else if (selector.nodes[0] instanceof Node) {
                        const stackPanel: NodeModel = selector.nodes[0];
                        if (checkParentAsContainer(this, selector.nodes[0])) {
                            if (stackPanel.shape.type !== 'UmlClassifier' && !((stackPanel as Node).parentId &&
                                this.nameTable[(stackPanel as Node).parentId]
                                && this.nameTable[(stackPanel as Node).parentId].shape.type === 'UmlClassifier')) {
                                if (!(stackPanel.container && (stackPanel.container.type === 'Canvas'
                                    || stackPanel.container.type === 'Grid'))) {
                                    selector.nodes[0].constraints &= ~(NodeConstraints.HideThumbs | NodeConstraints.Rotate);
                                }
                                selector.thumbsConstraints &= ~ThumbsConstraints.Rotate;
                            }
                        }
                        const swimlane: boolean = (stackPanel.shape.type === 'SwimLane' || (stackPanel as Node).isLane ||
                            (stackPanel as Node).isPhase) ? true : false;
                        this.diagramRenderer.renderResizeHandle(
                            selector.wrapper.children[0], selectorEle, selector.thumbsConstraints, this.scroller.currentZoom,
                            selector.constraints, this.scroller.transform, canHideResizers, canMove(selector.nodes[0]),
                            (selector.nodes[0].constraints & NodeConstraints.HideThumbs) ? true : false, swimlane);
                    }
                } else {
                    if (this.diagramActions & DiagramAction.Interactions) {
                        this.diagramRenderer.rendererActions = this.diagramRenderer.rendererActions | RendererAction.PreventRenderSelector;
                    }
                    if (!(selectionHasConnector(this, selector) && canRender)) {
                        this.diagramRenderer.renderResizeHandle(
                            selector.wrapper, selectorEle, selector.thumbsConstraints, this.scroller.currentZoom,
                            selector.constraints, this.scroller.transform, canHideResizers, canMove(selector)
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
    public renderSelectorForAnnotation(selectorModel: Selector, selectorElement: (SVGElement | HTMLCanvasElement)): void {
        this.diagramRenderer.renderResizeHandle(
            selectorModel.wrapper.children[0], selectorElement, selectorModel.thumbsConstraints,
            this.scroller.currentZoom, selectorModel.constraints, this.scroller.transform, undefined, canMove(selectorModel.annotation));
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
            const node: NodeModel = this.nodes[i];
            selectedItems.push(node);
        }
        for (let i: number = 0; i < this.connectors.length; i++) {
            const conn: ConnectorModel = this.connectors[i];
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
            for (let i: number = childNodes.length; i > 0; i--) {
                child = childNodes[i - 1] as SVGElement;
                child.parentNode.removeChild(child);
            }
            if (isBlazor() && !(this.diagramActions & DiagramAction.DragUsingMouse) && innertemplate.length > 0) {
                for (i = 0; i < this.selectedItems.userHandles.length; i++) {
                    const template: UserHandleModel = this.selectedItems.userHandles[i];
                    div = document.getElementById(template.name + '_html_element');
                    div.style.display = 'none';
                }

            } else {
                if (!isBlazor()) {
                    const templates: NodeList = getUserHandleLayer(this.element.id).childNodes;
                    for (i = templates.length; i > 0; i--) {
                        (templates[i - 1] as HTMLElement).parentNode.removeChild(templates[i - 1]);
                    }
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
     * @param {Container} nodes - provide the node value.
     * @param {string} id - provide the childernCollection value.
     *
     * @private
     */
    public getWrapper(nodes: Container, id: string): DiagramElement {
        let wrapper: DiagramElement;
        id = nodes.id + '_' + id;
        const container: Container = nodes instanceof Canvas ? nodes : this.getPortContainer(this.nameTable[nodes.id]);
        for (let i: number = 0; i < container.children.length; i++) {
            if (id === container.children[i].id) {
                wrapper = container.children[i];
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
    public getEndNodeWrapper(node: NodeModel, connector: ConnectorModel, source: boolean): DiagramElement {
        if (node.shape.type === 'Bpmn' && node.wrapper.children[0] instanceof Canvas) {
            if ((!isBlazor() && (node.shape as BpmnShape).shape === 'Activity') ||
                (isBlazor() && (node.shadow as DiagramShape).bpmnShape === 'Activity')) {
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
            return (node.wrapper.children[0] as Canvas).children[0];
        }
        if (!this.containsMargin(node.wrapper.children[0])) {
            if (!node.children) {
                return node.wrapper.children[0];
            }
        }
        return node.wrapper;
    }
    private containsMargin(node: DiagramElement): Boolean {
        return node.margin && (node.margin.left !== 0 || node.margin.top !== 0 || node.margin.right !== 0 || node.margin.bottom !== 0);
    }

    private focusOutEdit(): void {
        this.endEdit();
        // EJ2-57743 - Added below code to refresh the diagram layer after the annotation gets edited in canvas mode.
        if(this.mode === 'Canvas' && this.scroller.currentZoom !== 1) {
            this.refreshDiagramLayer();
        }
    }

    private endEditCommand(): void {
        this.endEdit();
        this.textEditing = false;
        // EJ2-57743 - Added below code to refresh the diagram layer after the annotation gets edited in canvas mode.
        if(this.mode === 'Canvas' && this.scroller.currentZoom !== 1) {
            this.refreshDiagramLayer();
        }
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
            if (isBlazor()) { this.canEnableBlazorObject = true; }
            const textArea: HTMLTextAreaElement = (document.getElementById(this.element.id + '_editBox') as HTMLTextAreaElement);
            if ((isBlazor() && textArea) || !isBlazor()) {
                let text: string = textArea.value;
                EventHandler.remove(textArea, 'input', this.eventHandler.inputChange);
                EventHandler.remove(textArea, 'focusout', this.focusOutEdit);
                const element: HTMLElement = document.getElementById(this.element.id + '_editTextBoxDiv');
                let node: NodeModel;
                node = this.nameTable[this.activeLabel.parentId];
                const annotation: ShapeAnnotationModel | PathAnnotationModel | TextModel = findAnnotation(node, this.activeLabel.id);
                // eslint-disable-next-line max-len
                let args: ITextEditEventArgs | IBlazorTextEditEventArgs = { oldValue: this.activeLabel.text, newValue: text, cancel: false, element: node, annotation: annotation };
                if (isBlazor() && this.textEdit) {
                    args = this.getBlazorTextEditArgs(args);
                }
                let bpmnAnnotation: boolean = false;
                element.parentNode.removeChild(element);
                let textWrapper: DiagramElement;
                if (this.bpmnModule) {
                    node = this.bpmnModule.isBpmnTextAnnotation(this.activeLabel, this);
                    textWrapper = this.bpmnModule.getTextAnnotationWrapper(node, this.activeLabel.id);
                    bpmnAnnotation = node ? true : false;
                    if (bpmnAnnotation) {
                        if (element.textContent !== text || text !== this.activeLabel.text) {
                            if (isBlazor()) {
                                if (this.textEdit && window && window[blazor]) {
                                    const eventObj: object = { 'EventName': 'textEdit', args: JSON.stringify(args) };
                                    args = await window[blazorInterop].updateBlazorDiagramEvents(eventObj, this) || args;
                                }
                            } else { this.triggerEvent(DiagramEvent.textEdit, args); }
                            if (!args.cancel) {
                                this.bpmnModule.updateTextAnnotationContent(node, this.activeLabel, text, this);
                            }
                        }
                    }
                }

                if (!bpmnAnnotation) {
                    node = this.nameTable[this.activeLabel.parentId];
                    const annotation: ShapeAnnotationModel | PathAnnotationModel | TextModel = findAnnotation(node, this.activeLabel.id);
                    if (annotation && !(annotation instanceof Text)) {
                        // eslint-disable-next-line max-len
                        const index: string = findObjectIndex(node as NodeModel, (annotation as ShapeAnnotationModel | PathAnnotationModel).id, true);
                        annotations[index] = { content: annotation.content };
                        oldValues = { annotations: annotations };
                    } else {
                        if (isBlazor() && ((node.shape) as DiagramShape).type === 'Text') {
                            oldValues = { shape: { textContent: (node.shape as DiagramShape).content } };
                        } else {
                            oldValues = { shape: { content: (node.shape as TextModel).content } };
                        }
                    }
                    const deleteNode: boolean = this.eventHandler.isAddTextNode(node as Node, true);
                    if (!deleteNode && (element.textContent !== text || text !== this.activeLabel.text)) {
                        if (isBlazor()) {
                            if (window && window[blazor] && this.textEdit) {
                                const eventObj: object = { 'EventName': 'textEdit', args: JSON.stringify(args) };
                                args = await window[blazorInterop].updateBlazorDiagramEvents(eventObj, this) || args;
                            }
                        } else {
                            this.triggerEvent(DiagramEvent.textEdit, args);
                        }
                    }
                    if (!textWrapper) {
                        textWrapper = this.getWrapper(node.wrapper, this.activeLabel.id);
                    }

                    if (annotation.content !== text && !args.cancel) {
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
                            changesAnnotation[index] = { content: text };
                            changedvalues = { annotations: changesAnnotation };
                        }
                        else {
                            if (isBlazor() && ((node.shape) as DiagramShape).type === 'Text') {
                                changedvalues = { shape: { textContent: text } };
                            } else {
                                changedvalues = { shape: { content: text } };
                            }
                        }
                        const nodeIndex: string = this.getIndex(node, node.id);
                        if (nodeIndex) {
                            const oldnodes = {};
                            oldnodes[nodeIndex] = oldValues;
                            const newnodes = {};
                            newnodes[nodeIndex] = changedvalues;
                            if (getObjectType(node) === Node) {
                                this.onPropertyChanged({ nodes: newnodes } as DiagramModel, { nodes: oldnodes } as DiagramModel);
                            } else {
                                this.onPropertyChanged({ connectors: newnodes } as DiagramModel, { connectors: oldnodes } as DiagramModel);
                            }
                        }
                        this.protectPropertyChange(true);
                        if (isBlazor() && ((node.shape) as DiagramShape).type === 'Text') {
                            (node.shape as DiagramShape).textContent = text;
                        } else {
                            annotation.content = text;
                        }
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
                            this.commandHandler.updateBlazorSelector();
                        }
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
                                if (collection[j].id === (selectedNode[laneHeader] || selectedNode[phaseHeader])) {
                                    collection[j].header.annotation.content = selectedNode.annotations[0].content;
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
                if (this.activeLabel.isGroup) {
                    this.endGroupAction();
                }
                this.activeLabel = { id: '', parentId: '', isGroup: false, text: undefined };
                this.commandHandler.getBlazorOldValues();
                if (isBlazor()) { this.canEnableBlazorObject = false; }
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
            if (collection[i].id.toString() === id.toString()) {
                return i.toString();
            }
        }
        return null;
    }
    /* tslint:enable */

    private getBlazorTextEditArgs(args: IBlazorTextEditEventArgs | ITextEditEventArgs): IBlazorTextEditEventArgs {
        const element: DiagramEventObject = getObjectType(args.element) === Connector ? { connectorId: (args.element as ConnectorModel).id }
            : { nodeId: (args.element as Node).id };
        const annotation: DiagramEventAnnotation = {};
        if (getObjectType(args.element) === Node) {
            if ((args.element as Node).shape.type === 'Text') {
                annotation.textNode = (args.element as NodeModel).shape as TextModel;
            } else {
                annotation.annotationId = (args.element as NodeModel).annotations[0].id;
            }
        } else {
            annotation.annotationId = (args.element as ConnectorModel).annotations[0].id;
        }
        args = {
            oldValue: args.oldValue,
            newValue: args.newValue,
            cancel: args.cancel,
            element: element,
            annotation: annotation
        };
        return args as IBlazorTextEditEventArgs;
    }

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
     * @param {NodeModel} childernCollection - provide the childernCollection value.
     *
     * @private
     */
    public removeNode(node: NodeModel, childernCollection: string[]): void {
        this.removeObjectsFromLayer(node);
        this.removeFromAQuad(this.nameTable[node.id]);
        const groupElement: HTMLElement = document.getElementById(node.id + '_groupElement');
        delete this.nameTable[node.id];
        if ((node as NodeModel).children) {
            delete this.groupTable[node.id];
        }
        if (isBlazor()) {
            for (let i: number = 0; i < this.nodes.length; i++) {
                if (node.id === this.nodes[i].id) {
                    this.UpdateBlazorDiagramModel(node as Node, 'Node', i);
                }
            }
        }
        this.nodes.splice(this.nodes.indexOf(node as NodeModel), 1);
        if (groupElement && groupElement.children && groupElement.children.length > 0) {
            let beforeElement: Element = undefined;
            for (let j: number = groupElement.children.length - 1; j >= 0; j--) {
                const childElement: Element = groupElement.children[j];
                if (childernCollection.length > 0 && childernCollection.indexOf(childElement.id.split('_')[0]) !== -1) {
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
            if (this.nameTable[nodes.id]) {
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
            const checkBoundaryConstraints: boolean = this.commandHandler.checkBoundaryConstraints(undefined, undefined, bound);
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
        this.swimLaneNodePropertyChange(actualObject, oldObject, node, update);
        return update;
    }

    /* tslint:disable */
    private swimLaneNodePropertyChange(actualObject: Node, oldObject: Node, node: Node, update: boolean): boolean {
        if (actualObject.shape.type === 'SwimLane' && !this.currentSymbol) {
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
                            const indexValue: number = Number(count); const lane: LaneModel = oldShape.lanes[indexValue];
                            let laneIndex: number; const newLane: LaneModel = shape.lanes[indexValue];
                            if (newLane && newLane.header) {
                                id = actualShape.lanes[indexValue].header.id;
                                oldObjects = lane.header; newObjects = newLane.header;
                                this.nodePropertyChange(this.nameTable[id], oldObjects as Node, newObjects as Node);
                            }
                            if (lane.children) {
                                for (const childNodeIndex of Object.keys(lane.children)) {
                                    id = actualShape.lanes[indexValue].children[Number(childNodeIndex)].id;
                                    const node: Node = this.nameTable[id]; oldObjects = lane.children[Number(childNodeIndex)];
                                    newObjects = (newLane as LaneModel).children[Number(childNodeIndex)];
                                    this.nodePropertyChange(node, oldObjects as Node, newObjects as Node);
                                }
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
                            const indexValue: number = Number(key); const phase: PhaseModel = shape.phases[indexValue]; let size: number;
                            const rowIndex: number = (actualShape.header && (actualShape as SwimLane).hasHeader) ? 1 : 0;
                            if (phase && phase.header) {
                                id = actualShape.phases[indexValue].header.id;
                                oldObjects = oldShape.phases[indexValue].header; newObjects = phase.header;
                                this.nodePropertyChange(this.nameTable[id], oldObjects as Node, newObjects as Node);
                            }
                            if (phase.offset) {
                                if (indexValue === 0) { size = phase.offset; } else {
                                    const previousPhase: PhaseModel = actualShape.phases[indexValue - 1];
                                    size = phase.offset - previousPhase.offset;
                                    if (size <= 0) { size = phase.offset; }
                                }
                                if (orientation) {
                                    grid.updateColumnWidth(indexValue, size, true, padding);
                                    updatePhaseMaxWidth(actualObject, this, grid.rows[rowIndex].cells[indexValue], indexValue);
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
                                if (actualShape.phases[k].id === '') { actualShape.phases[k].id = randomId(); }
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
                if (actualShape.header && (actualShape as SwimLane).hasHeader && oldShape.header) {
                    const id: string = grid.rows[0].cells[0].children[0].id; const headerNode: Node = this.nameTable[id];
                    this.nodePropertyChange(headerNode, (oldShape.header) as Node, shape.header as Node);
                }
                actualObject.height = actualObject.wrapper.height = grid.height;
                actualObject.width = actualObject.wrapper.width = grid.width;
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
                            phaseNode = this.nameTable[actualObject.id + shape.phases[i].id + '_header'];
                            phaseNode.constraints = (!newSelectConstraints) ? phaseNode.constraints & ~NodeConstraints.Select :
                                phaseNode.constraints | NodeConstraints.Select;
                        }
                    }

                    // Header - Constraints
                    let laneNode: NodeModel; let laneHeader: NodeModel;
                    const value: number = shape.phases.length || 1;
                    for (let i: number = 0; i < shape.lanes.length; i++) {
                        for (let l: number = 0; l < value; l++) {
                            laneNode = this.nameTable[actualObject.id + shape.lanes[i].id + l];
                            laneNode.constraints = (!newSelectConstraints) ? laneNode.constraints & ~NodeConstraints.Select :
                                laneNode.constraints | NodeConstraints.Select;
                            if (l === 0) {
                                laneHeader = this.nameTable[actualObject.id + shape.lanes[i].id + '_' + l + '_header'];
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
                if (oldObjects[i].id === oldNodeObject.id) {
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
        if (node.width !== undefined) {
            if (!actualObject.children) {
                actualObject.wrapper.children[0].width = node.width; update = true; updateConnector = true;
            } else if (!actualObject.container) {
                this.scaleObject(actualObject, node.width, true);
            } else {
                actualObject.wrapper.width = node.width;
            }
        }
        if (node.height !== undefined) {
            if (!actualObject.children) {
                actualObject.wrapper.children[0].height = node.height; update = true; updateConnector = true;
            } else if (!actualObject.container) {
                this.scaleObject(actualObject, node.height, false);
            } else {
                actualObject.wrapper.height = node.height;
            }
        }
        update = this.nodePropertyChangeExtend(actualObject, oldObject, node, update);
        if (node.constraints !== undefined && canShadow(oldObject) !== canShadow(node)) {
            actualObject.wrapper.children[0].shadow = canShadow(actualObject) ? actualObject.shadow : null;
        }
        if (node.offsetX !== undefined) {
            if (actualObject.wrapper.flip !== 'None') {
                if (actualObject.offsetX !== actualObject.wrapper.offsetX && oldObject.offsetX !== undefined) {
                    const offsetX = node.offsetX - oldObject.offsetX;
                    actualObject.wrapper.offsetX = actualObject.wrapper.offsetX + offsetX;
                    this.updateFlipOffset(actualObject.wrapper, offsetX, 0, actualObject.wrapper.flip);
                }
            } else {
                actualObject.wrapper.offsetX = node.offsetX;
            } update = true;
            updateConnector = true;
        }
        if (node.offsetY !== undefined) {
            if (actualObject.wrapper.flip !== 'None') {
                if (actualObject.offsetY !== actualObject.wrapper.offsetY && oldObject.offsetY !== undefined) {
                    const offsetY = node.offsetY - oldObject.offsetY;
                    actualObject.wrapper.offsetY = actualObject.wrapper.offsetY + offsetY;
                    this.updateFlipOffset(actualObject.wrapper, 0, offsetY, actualObject.wrapper.flip);
                }
            } else {
                actualObject.wrapper.offsetY = node.offsetY;
            } update = true;
            updateConnector = true;
        }
        if (node.padding !== undefined) {
            actualObject.wrapper.padding.left =node.padding.left  !==undefined?node.padding.left:actualObject.wrapper.padding.left;
            actualObject.wrapper.padding.right =node.padding.right  !==undefined?node.padding.right:actualObject.wrapper.padding.right;
            actualObject.wrapper.padding.top =node.padding.top !==undefined?node.padding.top:actualObject.wrapper.padding.top;
            actualObject.wrapper.padding.bottom =node.padding.bottom  !==undefined?node.padding.bottom:actualObject.wrapper.padding.bottom;
            update = true;
        }
        if (node.pivot !== undefined) {
            actualObject.wrapper.pivot = node.pivot; update = true;
        }
        if (node.minWidth !== undefined) {
            actualObject.wrapper.minWidth = actualObject.wrapper.children[0].minWidth = node.minWidth; update = true;
            updateConnector = true;
        }
        if (node.minHeight !== undefined) {
            actualObject.wrapper.minHeight = actualObject.wrapper.children[0].minHeight = node.minHeight; update = true;
            updateConnector = true;
        }
        if (node.maxWidth !== undefined) {
            actualObject.wrapper.maxWidth = node.maxWidth; update = true;
            updateConnector = true;
        }
        if (node.maxHeight !== undefined) {
            actualObject.wrapper.maxHeight = node.maxHeight; update = true;
            updateConnector = true;
        }
        if (node.flip !== undefined) {
            actualObject.wrapper.flip = node.flip;
            update = true;
            updateConnector = true;
            if (actualObject.wrapper.elementActions & ElementAction.ElementIsGroup) {
                alignElement(actualObject.wrapper, actualObject.offsetX, actualObject.offsetY, this, node.flip);
                if (actualObject && actualObject.children) {
                    for (const child of actualObject.children) {
                        const updateNode: Node = this.nameTable[child];
                        updateNode.wrapper.flip = node.flip;
                        this.updatePorts(updateNode, node.flip);
                    }
                }
            } else {
                if (actualObject.flipMode && (actualObject.flipMode === 'Port' || actualObject.flipMode === 'All'))
                    this.updatePorts(actualObject, node.flip);
            }
        }
        if (node.rotateAngle !== undefined && (actualObject.constraints & NodeConstraints.Rotate)) {
            if (actualObject.children && rotate) {
                // eslint-disable-next-line max-len
                this.commandHandler.rotateObjects(actualObject, [actualObject], actualObject.rotateAngle - actualObject.wrapper.rotateAngle, { x: actualObject.offsetX, y: actualObject.offsetY }, false);
            }
            actualObject.wrapper.rotateAngle = node.rotateAngle; update = true;
            updateConnector = true;
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
            updateConnector = true;
        }
        if ((((node.shape !== undefined && (node.shape.type === undefined)) || node.width !== undefined
            || node.height !== undefined || node.style !== undefined) && actualObject.shape.type === 'Bpmn' && this.bpmnModule)
            || (isBlazor() && node && node.shape && node.shape.type === 'Bpmn')) {
            update = true;
            updateConnector = true;
            this.bpmnModule.updateBPMN(node, oldObject, actualObject, this);
        }
        if (actualObject.shape.type === 'UmlActivity' && ((!isBlazor() && (actualObject.shape as UmlActivityShapeModel).shape === 'FinalNode') ||
            (isBlazor() && (actualObject.shape as DiagramShape).umlActivityShape === 'FinalNode'))) {
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
                const index: number = Number(key); update = true; const changedObject: PointPortModel = node.ports[key];
                const actualPort: PointPortModel = actualObject.ports[index];
                this.updatePort(changedObject, actualPort, actualObject.wrapper);
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
                    changedObject = node.annotations ? node.annotations[key] : actualObject.annotations;
                }
                const actualAnnotation: ShapeAnnotationModel = actualObject.annotations[index];
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
                                if (collection[j].id === (actualObject[laneHeader] || actualObject[phaseHeader])) {
                                    collection[j].header.annotation.content = actualObject.annotations[0].content;
                                    collection[j].header.annotation.style = actualObject.annotations[0].style;
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
        if (node.expandIcon !== undefined || node.collapseIcon !== undefined || node.isExpanded !== undefined) {
            this.updateIcon(actualObject); this.updateDefaultLayoutIcons(actualObject);
            if (node.isExpanded !== undefined) { this.canExpand = true;  this.commandHandler.expandNode(actualObject, this); }
            update = true;
            this.canExpand = false;
        }
        if (node.fixedUserHandles !== undefined) {
            let index: number;
            let changedObject: NodeFixedUserHandleModel;
            let actualfixedUserHandle: NodeFixedUserHandleModel;
            for (const key of Object.keys(node.fixedUserHandles)) {
                index = Number(key); update = true;
                if (node.fixedUserHandles[index]) {
                    changedObject = node.fixedUserHandles[index];
                }
                actualfixedUserHandle = actualObject.fixedUserHandles[index];
                if (actualfixedUserHandle) {
                    this.updateNodefixedUserHandle(changedObject, actualfixedUserHandle, actualObject.wrapper, actualObject);
                }
            }
        }

        if (node.tooltip !== undefined) { this.updateTooltip(actualObject, node); }
        if (update) {
            if (this.bpmnModule !== undefined) {
                // eslint-disable-next-line max-len
                this.bpmnModule.updateTextAnnotationProp(actualObject, { offsetX: (oldObject.offsetX || actualObject.offsetX), offsetY: (oldObject.offsetY || actualObject.offsetY) } as Node, this);
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
                    updatePhaseMaxWidth(actualObject, this, grid.rows[index].cells[column - 1], column - 1);
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
                    let parentNode: NodeModel = this.nameTable[actualObject.parentId];
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
            if (!node.annotations || !actualObject.processId) {
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
                this.updateGroupSize(actualObject);
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
                }
                if (!isLayout && updateConnector) {
                    if (this.lineRoutingModule && this.diagramActions && (this.constraints & DiagramConstraints.LineRouting) && actualObject.id !== 'helper') {
                        if (!(this.diagramActions & DiagramAction.ToolAction)) {
                            this.lineRoutingModule.renderVirtualRegion(this, true);
                        }
                    }
                    this.updateConnectorEdges(actualObject);
                    if (actualObject.id !== 'helper' && !(this.diagramActions & DiagramAction.ToolAction)) {
                        const objects: Object[] = this.spatialSearch.findObjects(actualObject.wrapper.outerBounds as Rect);
                        for (let i: number = 0; i < objects.length; i++) {
                            const object: Object = objects[i];
                            if (object instanceof Connector) {
                                this.connectorPropertyChange(objects[i] as Connector, {} as Connector, {
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
                element: element, cause: this.diagramActions,
                oldValue: oldObject, newValue: node
            };
            if (isBlazor() && this.propertyChange) {
                (args as IBlazorPropertyChangeEventArgs).element = { node: cloneBlazorObject(element) };
                (args as IBlazorPropertyChangeEventArgs).oldValue = { node: cloneBlazorObject(oldObject) };
                (args as IBlazorPropertyChangeEventArgs).newValue = { node: cloneBlazorObject(node) };
            }
            this.triggerEvent(DiagramEvent.propertyChange, args);
        }
    }

    private updatePorts(actualObject: Node, flip: FlipDirection): void {
        if (actualObject && actualObject.ports.length > 0) {
            for (const key of Object.keys(actualObject.ports)) {
                const index: number = Number(key);
                const actualPort: PointPortModel = actualObject.ports[index];
                let portWrapper: DiagramElement = this.getWrapper(actualObject.wrapper, actualPort.id);
                portWrapper = updatePortEdges(portWrapper, flip, actualPort);
                portWrapper.relativeMode = 'Point';
                portWrapper.measure(new Size(portWrapper.width, portWrapper.height));
                portWrapper.arrange(portWrapper.desiredSize);
            }
        }
    }
    private updateFlipOffset(element: Container, diffX: number, diffY: number, flip: FlipDirection): void {
        if (element.hasChildren()) {
            for (const child of element.children) {
                if (flip === 'Horizontal' || flip === 'Both') {
                    child.flipOffset.x = child.flipOffset.x + diffX;
                }
                if (flip === 'Vertical' || flip === 'Both') {
                    child.flipOffset.y = child.flipOffset.y + diffY;
                }
                if (child instanceof Canvas || child instanceof Container) {
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

    private updateConnectorProperties(connector: ConnectorModel): void {
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
    public updateConnectorEdges(actualObject: Node): void {
        if (actualObject.inEdges.length > 0) {
            for (let j: number = 0; j < actualObject.inEdges.length; j++) {
                this.updateConnectorProperties(this.nameTable[actualObject.inEdges[j]]);
            }
        }
        if (actualObject.outEdges.length > 0) {
            for (let k: number = 0; k < actualObject.outEdges.length; k++) {
                this.updateConnectorProperties(this.nameTable[actualObject.outEdges[k]]);
            }
        }
        if (actualObject.parentId && this.nameTable[actualObject.parentId]) {
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
            if (newProp.flip !== undefined) { actualObject.flip = newProp.flip; flipConnector(actualObject); }
            if (actualObject.type === 'Orthogonal' && this.lineRoutingModule && this.diagramActions &&
                (this.constraints & DiagramConstraints.LineRouting) && !(this.diagramActions & DiagramAction.ToolAction)) {
                this.lineRoutingModule.renderVirtualRegion(this, true);
                this.lineRoutingModule.refreshConnectorSegments(this, actualObject, false);
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
                this.updateConnectorAnnotation(actualObject); this.updateConnectorfixedUserHandles(actualObject); this.updateObject(actualObject, oldProp, newProp);
            } //work-around to update intersected connector bridging
        }
        if ((newProp.sourcePoint || newProp.targetPoint || newProp.segments)
            && this.diagramActions === DiagramAction.Render) { updateSelector = true; }
        if (actualObject.shape.type === 'Bpmn' && (actualObject.shape as BpmnFlowModel).sequence === 'Default') {
            this.commandHandler.updatePathElementOffset(actualObject);
        }
        // eslint-disable-next-line max-len
        if (!disableBridging) { this.updateBridging(); } this.updateAnnotations(newProp, actualObject); this.updatefixedUserHandle(newProp, actualObject);
        actualObject.wrapper.measure(new Size(actualObject.wrapper.width, actualObject.wrapper.height));
        actualObject.wrapper.arrange(actualObject.wrapper.desiredSize);
        if (existingBounds.equals(existingBounds, actualObject.wrapper.bounds) === false) {
            this.updateQuad(actualObject); this.updateGroupSize(actualObject);
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
    public removePortEdges(node: NodeModel, portId: string, item: string, isInEdges: boolean): void {
        if (node) {
            for (let i: number = 0; i < node.ports.length; i++) {
                const port: PointPortModel = node.ports[i];
                if (port.id === portId) {
                    const portEdge: string[] = (isInEdges) ? port.inEdges : port.outEdges;
                    removeItem(portEdge, item);
                }
            }
        }
    }
    private getpropertyChangeArgs(
        element: ConnectorModel, oldProp: Connector, newProp: Connector, args: IBlazorPropertyChangeEventArgs):
        IBlazorPropertyChangeEventArgs {
        (args as IBlazorPropertyChangeEventArgs).element = { connector: cloneBlazorObject(element) };
        (args as IBlazorPropertyChangeEventArgs).oldValue = { connector: cloneBlazorObject(oldProp) };
        (args as IBlazorPropertyChangeEventArgs).newValue = { connector: cloneBlazorObject(newProp) };
        return args;
    }

    private triggerPropertyChange(propertyChange: boolean, actualObject: Connector, oldProp: Connector, newProp: Connector): void {
        if (!propertyChange) {
            const element: ConnectorModel = actualObject;
            let args: IPropertyChangeEventArgs | IBlazorPropertyChangeEventArgs = {
                element: cloneBlazorObject(element), cause: this.diagramActions,
                oldValue: cloneBlazorObject(oldProp), newValue: cloneBlazorObject(newProp)
            };
            if (isBlazor()) {
                args = this.getpropertyChangeArgs(element, oldProp, newProp, args as IBlazorPropertyChangeEventArgs);
            }
            this.triggerEvent(DiagramEvent.propertyChange, args);
        }
    }

    private findInOutConnectPorts(node: NodeModel, isInconnect: boolean): PointPortModel {
        let port: PointPortModel = {};
        if (node) {
            port = getInOutConnectPorts(node, isInconnect);
        }
        return port;
    }

    private getPoints(actualObject: Connector, points?: PointModel[]): PointModel[] {
        //let pts: PointModel[];
        const lineDistributionModule: boolean = this.lineDistributionModule ? true : false;
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
     * @param {Container} element - provide the element value.
     * @param {boolean} visible - provide the visible value.
     * @param {number} opacity - provide the opacity value.
     *
     * @private
     */
    public updateNodeProperty(element: Container, visible?: boolean, opacity?: number): void {
        if (visible === undefined) {
            this.updateElementVisibility(element, this.nameTable[element.id], visible);
        } else {
            element.style.opacity = opacity;
            for (let i: number = 0; i < element.children.length; i++) {
                if (element.children[i] instanceof Container) {
                    this.updateNodeProperty(element.children[i] as Container, undefined, opacity);
                }
                element.children[i].style.opacity = opacity;
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
        if (element instanceof Container) {
            for (let i: number = 0; i < element.children.length; i++) {
                this.updateDiagramContainerVisibility(element.children[i], visible);
            }
        }
        element.visible = visible;
    }


    /**
     * Updates the visibility of the node/connector \
     *
     * @returns { void }  Updates the visibility of the node/connector .\
     * @param {Container} element - provide the element value.
     * @param {Connector | Node} obj - provide the obj value.
     * @param {boolean} visible - provide the visible value.
     *
     * @private
     */
    public updateElementVisibility(element: Container, obj: Connector | Node, visible: boolean): void {
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
                        this.updateElementVisibility(this.nameTable[child].wrapper, this.nameTable[child], visible);
                    }
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
                        wrapper.visible = visible;
                    }
                }
            } else {
                //path and decorators
                for (let i: number = 0; i < 3; i++) {
                    element.children[i].visible = visible;
                }
            }
            if (obj.annotations) {
                //annotations
                for (const annotation of obj.annotations) {
                    const wrapper: DiagramElement = this.getWrapper(element, annotation.id);
                    wrapper.visible = visible;
                }
            }
            if ((obj as NodeModel).expandIcon || (obj as NodeModel).collapseIcon) {
                const wrapper: Container = this.getWrapper(element, 'icon_content') as Container;
                if (wrapper) {
                    for (let i: number = 0; i < wrapper.children.length; i++) {
                        wrapper.children[i].visible = visible;
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
                const changedObject: AnnotationModel = newProp.annotations[key];
                const actualAnnotation: AnnotationModel = actualObject.annotations[index];
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
                changedObject = newProp.fixedUserHandles[key];
                actualAnnotation = actualObject.fixedUserHandles[index];
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
     * @param {Container} nodes - provide the nodes value.
     * @param {Object} actualObject - provide the actualObject value.
     * @param {boolean} canUpdateSize - provide the canUpdateSize value.
     *
     * @private
     */
    public updateConnectorfixedUserHandle(
        changedObject: ConnectorFixedUserHandleModel, actualfixedUserHandle: ConnectorFixedUserHandleModel, nodes: Container,
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
     * @param {Container} nodes - provide the nodes value.
     * @param {Object} actualObject - provide the actualObject value.
     * @param {boolean} canUpdateSize - provide the canUpdateSize value.
     *
     * @private
     */
    public updateAnnotation(
        changedObject: AnnotationModel, actualAnnotation: ShapeAnnotationModel, nodes: Container,
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
            } else if (actualAnnotation instanceof PathAnnotation &&
                ((changedObject as PathAnnotationModel).offset !== undefined ||
                    (changedObject as PathAnnotationModel).segmentAngle !== undefined)) {
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
        actualObject: Object, fixedUserHandleAnnotation: ConnectorFixedUserHandleModel, nodes: Container
    ): void {
        if (changedObject !== undefined) {
            this.updateConnectorfixedUserHandleWrapper(fixedUserHandleWrapper, actualObject, fixedUserHandleAnnotation, nodes);
        }
    }
    private updateConnectorfixedUserHandleWrapper(
        fixedUserHandleWrapper: Canvas, actualObject: Object,
        actualAnnotation: ConnectorFixedUserHandleModel, nodes: Container
    ): void {
        for (const elementId of this.views) {
            removeElement(fixedUserHandleWrapper.id + '_groupElement', elementId);
            removeElement(fixedUserHandleWrapper.id + '_html_element', elementId);
        }
        if (actualObject instanceof Connector) {
            const canvas: Container = actualObject.wrapper;
            const segment: DiagramElement = canvas.children[0];
            const bounds: Rect = new Rect(
                segment.offsetX - segment.width / 2, segment.offsetY - segment.height / 2, segment.width, segment.height);
            fixedUserHandleWrapper =
                actualObject.getfixedUserHandle(
                    actualObject.fixedUserHandles[actualObject.fixedUserHandles.length - 1] as ConnectorFixedUserHandle,
                    actualObject.intermediatePoints,
                    bounds);
        }
        for (let i: number = 0; i < nodes.children.length; i++) {
            if (fixedUserHandleWrapper.id === nodes.children[i].id) {
                nodes.children.splice(i, 1, fixedUserHandleWrapper);
            }
        }
    }

    private updateAnnotationContent(
        changedObject: AnnotationModel, isMeasure: boolean, annotationWrapper: TextElement | DiagramHtmlElement,
        actualObject: Object, actualAnnotation: ShapeAnnotationModel, nodes: Container
    ): void {
        if (changedObject.content !== undefined) {
            if (annotationWrapper as TextElement) {
                isMeasure = true;
                if ((actualObject as Node).shape.type === 'UmlActivity' &&
                    ((isBlazor() && ((actualObject as Node).shape as DiagramShape).umlActivityShape === 'StructuredNode') ||
                        (!isBlazor() && ((actualObject as Node).shape as UmlActivityShapeModel).shape === 'StructuredNode'))) {
                    (annotationWrapper as TextElement).content = '<<' + changedObject.content + '>>';
                } else { (annotationWrapper as TextElement).content = changedObject.content; }
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
        actualAnnotation: ShapeAnnotationModel, nodes: Container
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
            const canvas: Container = actualObject.wrapper;
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
            if (annotationWrapper.id === nodes.children[i].id) {
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
     * @param {Container} nodes - provide the changedObject value.
     * @param {Object} actualObject - provide the changedObject value.
     *
     * @private
     */
    public updateNodefixedUserHandle(
        changedObject: NodeFixedUserHandleModel, actualfixedUserHandle: NodeFixedUserHandleModel, nodes: Container,
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
        actualAnnotation: FixedUserHandleModel, nodes: Container
    ): void {
        for (const elementId of this.views) {
            removeElement(fixedUserHandleWrapper.id + '_groupElement', elementId);
            removeElement(fixedUserHandleWrapper.id + '_html_element', elementId);
        }
        if (actualObject instanceof Node) {
            fixedUserHandleWrapper = (actualObject as Node).initfixedUserHandles(actualAnnotation);
        }
        for (let i: number = 0; i < nodes.children.length; i++) {
            if (fixedUserHandleWrapper.id === nodes.children[i].id) {
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
     * @param {Container} nodes - provide the changedObject value.
     *
     * @private
     */
    public updatePort(changedObject: PointPortModel, actualPort: PointPortModel, nodes: Container): void {
        let isMeasure: boolean = false;
        const portWrapper: DiagramElement = this.getWrapper(nodes, actualPort.id);
        if (portWrapper !== undefined) {

            if (changedObject.offset !== undefined) {
                isMeasure = true;
                const offsetX: number = changedObject.offset.x !== undefined ? changedObject.offset.x :
                    actualPort.offset.x;
                const offsetY: number = changedObject.offset.y !== undefined ? changedObject.offset.y :
                    actualPort.offset.y;
                portWrapper.setOffsetWithRespectToBounds(offsetX, offsetY, 'Fraction');
                portWrapper.relativeMode = 'Point';
            }
            if (changedObject.width !== undefined) {
                isMeasure = true;
                portWrapper.width = changedObject.width;
            }
            if (changedObject.height !== undefined) {
                isMeasure = true;
                portWrapper.height = changedObject.height;
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
        const portContainer: Container = this.getPortContainer(actualObject);
        actualObject.initIcons(this.getDescription, this.layout, portContainer, this.element.id);
    }

    private getPortContainer(actualObject: Node): Container {
        if (actualObject.children) {
            for (let i: number = 0; i < actualObject.wrapper.children.length; i++) {
                if (actualObject.wrapper.children[i].id === actualObject.id + 'group_container') {
                    return actualObject.wrapper.children[i] as Container;
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
                child = this.nameTable[children[i]];
                if (child) {
                    this.removeFromAQuad(child as Node);
                }
            }
        }
        this.spatialSearch.removeFromAQuad(obj.wrapper);
        const modified: boolean = this.spatialSearch.updateBounds(obj.wrapper);
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
                const view: View = this.views[temp];
                if (!(view instanceof Diagram)) {
                    view.updateView(view);
                }
            }
        }
        if (this.diagramActions & DiagramAction.DragUsingMouse) {
            this.renderPageBreaks();
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
        if (isBlazor()) {
            this.allowServerDataBinding = enable;
            if (enable) {
                this.bulkChanges = {};
            }
        }
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
                const previewChildId: string = preview.children[z];
                const previewIndex: number = this.nodes.indexOf(this.nameTable[previewChildId]);
                if (previewIndex >= 0) {
                    this.nodes.splice(previewIndex, 1);
                }
                delete this.nameTable[previewChildId];
            }
            const previewIndex: number = this.nodes.indexOf(this.nameTable[this.currentSymbol.id]);
            if (previewIndex >= 0) {
                this.nodes.splice(previewIndex, 1);
            }
        }
    }

    private selectDragedNode(newObj: (NodeModel | Connector), args: any, selectedSymbol: HTMLElement) {
        this.currentSymbol = newObj as Node | Connector;
        if (this.mode !== 'SVG') {
            this.refreshDiagramLayer();
        }
        this.commandHandler.oldSelectedObjects = cloneSelectedObjects(this);
        this.commandHandler.select(newObj);
        this.commandHandler.updateBlazorSelector();
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
        // this.droppable.accept = '.e-dragclone';
        // eslint-disable-next-line @typescript-eslint/no-explicit-any 
        this.droppable.over = (args: any) => { 
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
                        let arg: IDragEnterEventArgs | IBlazorDragEnterEventArgs = {
                            source: null, element: newObj as Node, cancel: false,
                            diagram: this,
                            dragData: args.dragData.draggedElement.ej2_instances[0].dragData,
                            dragItem: newObj
                        };
                        this.triggerEvent(DiagramEvent.dragEnter, arg);
                        let newNode: Node;
                        let newConnector: Connector;
                        if (arg.dragItem && (arg.dragItem as Connector).sourcePoint && (arg.dragItem as Connector).targetPoint) {
                            newConnector = new Connector(this, 'connectors', arg.dragItem, true);
                        }
                        else if (arg.dragItem) {
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
                        this.droppable[selectedSymbols] = selectedSymbol;
                        this.allowServerDataBinding = true;
                    }
                    if (paletteId) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const sourceElement: Object = (document.getElementById(paletteId) as any).ej2_instances[0];
                        const source: string = 'sourceElement';
                        this.droppable[source] = sourceElement;
                        const childtable: string = 'childTable';
                        if (sourceElement) {
                            const obj: IElement = sourceElement[selectedSymbols];
                            this.allowServerDataBinding = false;
                            clonedObject = cloneObject(sourceElement[selectedSymbols]);
                            childTable = sourceElement[childtable];
                            const wrapper: DiagramElement = (obj.wrapper.children[0] as Container).children[0];
                            preview = getPreviewSize(sourceElement, clonedObject as Node, wrapper);
                            if (sourceElement[selectedSymbols] instanceof Node) {
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
                                        header.offsetX = position.x + 5 + header.width / 2;
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
                                            lane.offsetX = position.x + 5 + ((newNode.shape as SwimLane).lanes[0].header.width + (lane.width / 2));
                                            lane.offsetY = position.y + lane.height / 2;
                                        } else {
                                            lane.width = (newNode.shape as SwimLane).lanes[0].width;
                                            lane.height = (newNode.shape as SwimLane).lanes[0].height - header.height;
                                            lane.offsetX = position.x + 5 + lane.width / 2;
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
                                if ((newNode.shape as SwimLane).isPhase) {
                                    isHorizontal = ((newNode.shape as SwimLane).orientation === 'Horizontal') ? true : false;
                                    if (isHorizontal) {
                                        newNode.offsetX = position.x + 5 + (newNode.width || wrapper.actualSize.width) / 2;
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
                                newObj = newNode;
                                if ((clonedObject as Node).children) {
                                    const parentNode: Node = (clonedObject as Node);
                                    const tempTable: {} = {};
                                    entryTable = this.getChildren(parentNode, tempTable, childTable);
                                    arrangeChild(parentNode, -parentNode.offsetX, -parentNode.offsetY, entryTable, true, this);
                                }
                            } else if (sourceElement[selectedSymbols] instanceof Connector) {
                                newObj = new Connector(this, 'connectors', clonedObject as ConnectorModel, true);
                                const bounds: Rect = Rect.toBounds([newObj.sourcePoint, newObj.targetPoint]);
                                const tx: number = position.x - bounds.left;
                                const ty: number = position.y - bounds.top;
                                newObj.sourcePoint.x += tx; newObj.sourcePoint.y += ty;
                                newObj.targetPoint.x += tx; newObj.targetPoint.y += ty;
                            }
                            if (!(newObj.shape as SwimLane).isLane) {
                                newObj.id += randomId();
                            }
                            let arg: IDragEnterEventArgs | IBlazorDragEnterEventArgs = {
                                source: sourceElement, element: newObj as Node, cancel: false,
                                diagram: this, dragData: null, dragItem: newObj as Node
                            };
                            if (isBlazor()) {
                                arg = this.getBlazorDragEventArgs(arg);
                            }

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
                                    lane.offsetX = position.x + 5 + (laneObj.header.width + (child2.width / 2));
                                    lane.offsetY = position.y + child2.height / 2;
                                } else {
                                    header.width = laneObj.width;
                                    header.height = laneObj.header.height;
                                    lane.width = laneObj.width;
                                    lane.height = laneObj.height - header.height;
                                    lane.offsetX = position.x + 5 + child2.width / 2;
                                    lane.offsetY = position.y + (laneObj.header.height + (child2.height / 2));
                                }
                                header.offsetX = position.x + 5 + child1.width / 2;
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
                            if (!this.activeLayer.lock && !arg.cancel) {
                                this.preventDiagramUpdate = true;
                                if ((newObj as Node).children) {
                                    this.findChild((newObj as Node), entryTable);
                                }
                                this.preventDiagramUpdate = true;
                                if (newObj.zIndex !== -1) {
                                    newObj.zIndex = -1;
                                }
                                this.initObject(newObj as IElement, undefined, undefined, true);
                                this.selectDragedNode(newObj, args, selectedSymbol);
                            }
                            delete this['enterObject'];
                            delete this['enterTable'];
                        }
                        this.droppable[selectedSymbols] = selectedSymbol;
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
                let arg: IDropEventArgs | IBlazorDropEventArgs;
                arg = {
                    source: this.droppable[source],
                    element: this.currentSymbol,
                    target: this.eventHandler['hoverNode'] || this.eventHandler['lastObjectUnderMouse'] || this, cancel: false,
                    position: { x: this.currentSymbol.wrapper.offsetX, y: this.currentSymbol.wrapper.offsetY }
                };
                if (isBlazor()) {
                    arg = {
                        source: cloneBlazorObject(this.droppable[source]),
                        // eslint-disable-next-line max-len
                        element: getObjectType(this.currentSymbol) === Connector ? { connector: cloneBlazorObject(this.currentSymbol) as ConnectorModel } : { node: cloneBlazorObject(this.currentSymbol) as NodeModel },
                        cancel: false, target: {},
                        position: { x: this.currentSymbol.wrapper.offsetX, y: this.currentSymbol.wrapper.offsetY }
                    } as IBlazorDropEventArgs;
                    // eslint-disable-next-line max-len
                    this.getDropEventArgs(arg); arg = await this.triggerEvent(DiagramEvent.drop, arg) as IDropEventArgs | IBlazorDropEventArgs || arg;
                } else {
                    this.commandHandler.PreventConnectorSplit = false;
                    this.triggerEvent(DiagramEvent.drop, arg);
                }
                const id: string = 'id';
                const clonedObject: Object = cloneObject(this.currentSymbol); clonedObject['hasTarget'] = this.currentSymbol['hasTarget'];
                this.removeFromAQuad(this.currentSymbol);
                this.removeObjectsFromLayer(this.nameTable[this.currentSymbol.id]);
                this.removeElements(this.currentSymbol);
                if ((this.currentSymbol.shape as SwimLaneModel).isLane ||
                    (this.currentSymbol.shape as SwimLaneModel).isPhase) {
                    this.removeChildInNodes(this.currentSymbol as Node);
                }
                if (arg.cancel) { removeChildNodes(this.currentSymbol as Node, this); }
                if ((this.currentSymbol.shape as SwimLaneModel).isPhase) {
                    isPhase = true;
                    orientation = (this.currentSymbol.shape as SwimLaneModel).orientation;
                }
                this.removePreviewChildren(this.currentSymbol as Node);
                delete this.nameTable[this.currentSymbol.id]; this.currentSymbol = null;
                this.protectPropertyChange(true);
                if (!arg.cancel) {
                    this.startGroupAction();
                    if (clonedObject && (((clonedObject as Node).shape as SwimLaneModel).isLane || isPhase)) {
                        if (isPhase) {
                            ((clonedObject as Node).shape as SwimLaneModel).isPhase = isPhase;
                            ((clonedObject as Node).shape as SwimLaneModel).orientation = orientation;
                        }
                        this.eventHandler.addSwimLaneObject(clonedObject);
                    }
                    if (((clonedObject as Node).shape as BpmnShape).type === 'Bpmn' && ((clonedObject as Node).shape as BpmnShape).annotation
                        && clonedObject['hasTarget']) {
                        const nodeId: string = (((clonedObject as Node).shape as BpmnShape).annotation as BpmnAnnotation).nodeId;
                        ((clonedObject as Node).shape as BpmnShape).annotation.id = (clonedObject as Node).id;
                        this.addTextAnnotation(((clonedObject as Node).shape as BpmnShape).annotation, this.nameTable[nodeId]);
                        (clonedObject as BpmnAnnotation).nodeId = '';
                    }
                    if (!((clonedObject as Node).shape as SwimLaneModel).isLane && !isPhase) {
                        if ((clonedObject as Node).children) {
                            this.addChildNodes(clonedObject);
                        }
                        if (arg.target && (arg.target instanceof Node) && !isConnector && checkParentAsContainer(this, arg.target)
                            && canAllowDrop(arg.target)) {
                            addChildToContainer(this, arg.target, clonedObject);
                        } else {
                            value = this.add(clonedObject, true);
                        }
                        if ((clonedObject || value) && canSingleSelect(this)) {
                            this.select([this.nameTable[clonedObject[id]]], false, this.previousSelectedObjects);
                        }
                        if(arg.target && arg.target instanceof Connector){  
                            if(this.enableConnectorSplit == true){
                                if (this.nameTable[clonedObject[id]] instanceof Node) {
                                    this.commandHandler.connectorSplit(this.nameTable[clonedObject[id]],arg.target);
                                    this.commandHandler.PreventConnectorSplit = false;
                                }
                            } 
                        }
                    }
                } else {
                    this.clearSelectorLayer();
                }
                this.protectPropertyChange(false);
                const newObj: NodeModel | Connector = this.nameTable[clonedObject[id]];
                if (clonedObject['hasTarget']) {
                    (clonedObject as BpmnAnnotation).nodeId = clonedObject['hasTarget'];
                    this.remove(clonedObject);
                }
                if (this.bpmnModule && newObj instanceof Node && (clonedObject as Node).processId) {
                    newObj.processId = (clonedObject as Node).processId;
                    this.bpmnModule.dropBPMNchild(this.nameTable[newObj.processId], newObj, this);
                }
                if (!arg.cancel) {
                    this.endGroupAction();
                }
                if (this.mode !== 'SVG') { this.refreshDiagramLayer(); }
                delete this.droppable[source];
            }
            else {
                let arg: IDropEventArgs | IBlazorDropEventArgs = {
                    source: cloneBlazorObject(args.droppedElement),
                    element: undefined,
                    target: cloneBlazorObject(this.eventHandler['hoverNode'] || (this.eventHandler['lastObjectUnderMouse']) || this), cancel: false,
                    position: undefined
                };
                if (isBlazor()) {
                    arg = {
                        source: cloneBlazorObject(args.droppedElement),
                        element: undefined,
                        cancel: false,
                        position: undefined,
                        target: {}
                    } as IBlazorDropEventArgs;
                    this.getDropEventArgs(arg);
                }

                this.triggerEvent(DiagramEvent.drop, arg); let clonedObject: Object; const id: string = 'id';
            }
            const selectedSymbols: string = 'selectedSymbols';
            // eslint-disable-next-line max-len
            if (this.droppable[selectedSymbols] && this.droppable[selectedSymbols].parentNode) { remove(this.droppable[selectedSymbols]); } else {
                const draggableElement: HTMLCollection = document.getElementsByClassName('e-dragclone') as HTMLCollection;
                for (let i: number = 0; i < draggableElement.length; i++) {
                    draggableElement[i].remove();
                }
            }
            this.allowServerDataBinding = true;
            this.previousSelectedObjects = [];
        };

        this.droppable.out = (args: Object) => {
            // EJ2-57221 - Added the below code to check if we drag the node from symbol palette using touch or mouse. 
            if ((args as any).evt.type === "touchmove") {
                this.eventHandler.mouseLeave((args as any).evt);
            }
            if (this.currentSymbol && (!this.eventHandler.focus)) {
                this.unSelect(this.currentSymbol); this.removeFromAQuad(this.currentSymbol);
                if (this.mode !== 'SVG' && this.currentSymbol.shape.type === 'Native') {
                    this.removeElements(this.currentSymbol);
                }
                this.removeObjectsFromLayer(this.nameTable[this.currentSymbol.id]);
                this.removePreviewChildren(this.currentSymbol as Node);
                delete this.nameTable[this.currentSymbol.id];
                let args: IDragLeaveEventArgs | IBlazorDragLeaveEventArgs = {
                    element: cloneBlazorObject(this.currentSymbol),
                    diagram: this
                };
                if (isBlazor()) {
                    args = this.getBlazorDragLeaveEventArgs(args);
                }
                this.triggerEvent(DiagramEvent.dragLeave, args);
                if (this.mode !== 'SVG') { this.refreshDiagramLayer(); } else {
                    this.removeElements(this.currentSymbol);
                }
                this.currentSymbol = null; const selectedSymbols: string = 'selectedSymbols';
                this.droppable[selectedSymbols].style.opacity = '1';
                const source: string = 'sourceElement';
                delete this.droppable[source];
                this.diagramRenderer.rendererActions =
                    this.removeConstraints(this.diagramRenderer.rendererActions, RendererAction.DrawSelectorBorder);
                if (this.previousSelectedObject) {
                    this.select(this.previousSelectedObject, this.previousSelectedObject.length > 1 ? true : false);
                }
                this.previousSelectedObject = null;
            }
        };
    }
    private getBlazorDragLeaveEventArgs(args: IBlazorDragLeaveEventArgs | IDragLeaveEventArgs): IBlazorDragLeaveEventArgs {
        args = {
            diagramId: this.element.id,
            element: getObjectType(args.element) === Connector ? { connector: cloneBlazorObject(args.element) }
                : { node: cloneBlazorObject(args.element) }
        };
        return args as IBlazorDragLeaveEventArgs;
    }

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
        if (node) {
            if (node.children) {
                for (let i: number = 0; i < node.children.length; i++) {
                    this.removeChildInNodes(this.nameTable[node.children[i]]);
                }
            }
            const index: number = this.nodes.indexOf(node as Node);
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
            group = childTable[node.children[i]];
            if (group) {
                if (group.children) {
                    this.findChild(group, childTable);
                }
                group.id = group.id + randomId();
                childTable[group.id] = group;
                node.children[i] = group.id;
                newNode = new Node(this, 'nodes', group, true);
                this.initObject(newNode, undefined, undefined, true);
                //this.add(group, true);
            }
        }
    }
    private getChildren(node: NodeModel, entryTable: {}, childTable: {}): {} {
        let temp: NodeModel;
        for (let i: number = 0; i < node.children.length; i++) {
            temp = (childTable[node.children[i]]);
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
            temp = (this.nameTable[node.children[i]]);
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
            if (index === this.layers[i].zIndex) {
                targetLayer = this.layers[i + 1];
            }
        }
        if (length > 1) {
            this.commandHandler.moveSvgNode(node.id, currentLayer.objects[length - 2]);
            this.commandHandler.moveSvgNode(currentLayer.objects[length - 2], node.id);
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
     * moves the node or connector forward within given layer \
     *
     * @returns { void }  moves the node or connector forward within given layer .\
     * @param {Node | Connector} node - provide the source value.
     * @param {LayerModel} currentLayer - provide the source value.
     *
     */
    public moveObjectsUp(node: NodeModel | ConnectorModel, currentLayer: LayerModel): void {
        let targetLayer: LayerModel;
        for (let i: number = this.layers.length - 1; i >= 0; i--) {
            targetLayer = this.layers[i];
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
     * Inserts newly added element into the database \
     *
     * @returns { void }  Inserts newly added element into the database .\
     * @param {Node | Connector} node - provide the source value.
     *
     */
    public insertData(node?: Node | Connector): object {
        return this.crudOperation(node, 'create', this.getNewUpdateNodes('New'));
    }


    /**
     * updates the user defined element properties into the existing database \
     *
     * @returns { void }     Removes the user deleted element from the existing database .\
     * @param {Node | Connector} node - provide the source value.
     *
     */
    public updateData(node?: Node | Connector): object {
        return this.crudOperation(node, 'update', this.getNewUpdateNodes('Update'));
    }


    /**
     * Removes the user deleted element from the existing database \
     *
     * @returns { void }     Removes the user deleted element from the existing database .\
     * @param {Node | Connector} node - provide the source value.
     *
     */
    public removeData(node?: Node | Connector): object {
        return this.crudOperation(node, 'destroy', this.getDeletedNodes());
    }

    private crudOperation(node: Node | Connector, crud: string, getNodesCollection: IDataSource) {
        if (node) {
            const data: object = this.parameterMap(node, node instanceof Connector ? false : true);
            if (data) {
                // eslint-disable-next-line max-len
                const url: string = node instanceof Connector ? this.dataSourceSettings.connectionDataSource.crudAction[crud] : this.dataSourceSettings.crudAction[crud];
                this.raiseAjaxPost(JSON.stringify(data), url);
            }
            return data;
        }
        else {
            const newObjects: IDataSource = getNodesCollection;
            // eslint-disable-next-line max-len
            this.processCrudCollection(newObjects, this.dataSourceSettings.crudAction[crud], this.dataSourceSettings.connectionDataSource.crudAction[crud]);
            return newObjects;
        }
    }

    private processCrudCollection(newObjects: IDataSource, nodeCrudAction: string, connectorCrudAction: string): void {
        if (newObjects.nodes) {
            const data: Object[] = [];
            let i: number;
            for (i = 0; i < newObjects.nodes.length; i++) {
                data.push(this.parameterMap(newObjects.nodes[i] as Node, true));
            }
            if (data && data.length > 0) {
                this.raiseAjaxPost(JSON.stringify(data), nodeCrudAction);
            }
        }
        if (newObjects.connectors) {
            const data: Object[] = [];
            let i: number;
            for (i = 0; i < newObjects.connectors.length; i++) {
                data.push(this.parameterMap(newObjects.connectors[i] as Connector, false));
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
                mappingObj[fields.crudAction.customFields[i]] = object[fields.crudAction.customFields[i]];
            }
        }
        return mappingObj;
    }

    private getNewUpdateNodes(status: string): IDataSource {
        const nodes: NodeModel[] = [];
        const connectors: ConnectorModel[] = [];
        // eslint-disable-next-line guard-for-in
        for (const name in this.nameTable) {
            const node: Node | Connector = this.nameTable[name];
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
            const node: (NodeModel | ConnectorModel) = this.crudDeleteNodes[i];
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
        const callback: Ajax = new Ajax(
            url, 'POST', true, 'application/json'
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
