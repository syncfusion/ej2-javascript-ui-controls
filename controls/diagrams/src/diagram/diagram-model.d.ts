import { Component, Property, Complex, Collection, EventHandler, L10n, Droppable, remove, Ajax, isBlazor, blazorTemplates } from '@syncfusion/ej2-base';import { isNullOrUndefined } from '@syncfusion/ej2-base';import { Browser, ModuleDeclaration, Event, EmitType } from '@syncfusion/ej2-base';import { INotifyPropertyChanged, updateBlazorTemplate, resetBlazorTemplate } from '@syncfusion/ej2-base';import { CanvasRenderer } from './rendering/canvas-renderer';import { SvgRenderer } from './rendering/svg-renderer';import { DiagramRenderer } from './rendering/renderer';import { BaseAttributes } from './rendering/canvas-interface';import { PageSettings, ScrollSettings } from './diagram/page-settings';import { PageSettingsModel, ScrollSettingsModel } from './diagram/page-settings-model';import { DiagramElement } from './core/elements/diagram-element';import { ServiceLocator } from './objects/service';import { IElement, IDataLoadedEventArgs, ISelectionChangeEventArgs } from './objects/interface/IElement';import { IClickEventArgs, ScrollValues, FixedUserHandleClickEventArgs } from './objects/interface/IElement';import { ChangedObject, IBlazorTextEditEventArgs, DiagramEventObject, DiagramEventAnnotation } from './objects/interface/IElement';import { IBlazorDragLeaveEventArgs } from './objects/interface/IElement';import { UserHandleEventsArgs } from './objects/interface/IElement';import { IBlazorDropEventArgs, IBlazorScrollChangeEventArgs, IKeyEventArgs } from './objects/interface/IElement';import { DiagramEventObjectCollection, IBlazorCollectionChangeEventArgs } from './objects/interface/IElement';import { ICommandExecuteEventArgs, IBlazorDragEnterEventArgs } from './objects/interface/IElement';import { ISizeChangeEventArgs, IConnectionChangeEventArgs, IEndChangeEventArgs, IDoubleClickEventArgs } from './objects/interface/IElement';import { ICollectionChangeEventArgs, IPropertyChangeEventArgs, IDraggingEventArgs, IRotationEventArgs } from './objects/interface/IElement';import { ISegmentCollectionChangeEventArgs, IBlazorPropertyChangeEventArgs } from './objects/interface/IElement';import { IDragEnterEventArgs, IDragLeaveEventArgs, IDragOverEventArgs, IDropEventArgs } from './objects/interface/IElement';import { ITextEditEventArgs, IHistoryChangeArgs, IScrollChangeEventArgs } from './objects/interface/IElement';import { IMouseEventArgs, IBlazorHistoryChangeArgs } from './objects/interface/IElement';import { IBlazorCustomHistoryChangeArgs, IImageLoadEventArgs } from './objects/interface/IElement';import { StackEntryObject, IExpandStateChangeEventArgs } from './objects/interface/IElement';import { ZoomOptions, IPrintOptions, IExportOptions, IFitOptions, ActiveLabel } from './objects/interface/interfaces';import { View, IDataSource, IFields } from './objects/interface/interfaces';import { Container } from './core/containers/container';import { Node, BpmnShape, BpmnAnnotation, SwimLane, Path, DiagramShape, UmlActivityShape, FlowShape, BasicShape } from './objects/node';import { cloneBlazorObject, cloneSelectedObjects, findObjectIndex, selectionHasConnector } from './utility/diagram-util';import { checkBrowserInfo } from './utility/diagram-util';import { updateDefaultValues, getCollectionChangeEventArguements } from './utility/diagram-util';import { flipConnector, updatePortEdges, alignElement, setConnectorDefaults, getPreviewSize } from './utility/diagram-util';import { Segment } from './interaction/scroller';import { Connector, BezierSegment } from './objects/connector';import { ConnectorModel, BpmnFlowModel, OrthogonalSegmentModel } from './objects/connector-model';import { SnapSettings } from './diagram/grid-lines';import { RulerSettings } from './diagram/ruler-settings';import { removeRulerElements, updateRuler, getRulerSize } from './ruler/ruler';import { renderRuler, renderOverlapElement } from './ruler/ruler';import { RulerSettingsModel } from './diagram/ruler-settings-model';import { SnapSettingsModel } from './diagram/grid-lines-model';import { NodeModel, TextModel, BpmnShapeModel, BpmnAnnotationModel, HeaderModel, HtmlModel } from './objects/node-model';import { UmlActivityShapeModel, SwimLaneModel, LaneModel, PhaseModel } from './objects/node-model';import { Size } from './primitives/size';import { Keys, KeyModifiers, DiagramTools, AlignmentMode, AnnotationConstraints, NodeConstraints, ScrollActions } from './enum/enum';import { RendererAction, State } from './enum/enum';import { BlazorAction } from './enum/enum';import { DiagramConstraints, BridgeDirection, AlignmentOptions, SelectorConstraints, PortVisibility, DiagramEvent } from './enum/enum';import { DistributeOptions, SizingOptions, RenderingMode, DiagramAction, ThumbsConstraints, NudgeDirection } from './enum/enum';import { RealAction, ElementAction, FlipDirection, Orientation, PortConstraints, HistoryChangeAction } from './enum/enum';import { PathElement } from './core/elements/path-element';import { TextElement } from './core/elements/text-element';import { updateStyle, removeItem, updateConnector, updateShape, setUMLActivityDefaults, findNodeByName } from './utility/diagram-util';import { setSwimLaneDefaults } from './utility/diagram-util';import { checkPortRestriction, serialize, deserialize, updateHyperlink, getObjectType, removeGradient, getChild } from './utility/diagram-util';import { Rect } from './primitives/rect';import { getPortShape } from './objects/dictionary/common';import { PointPortModel, PortModel } from './objects/port-model';import { ShapeAnnotationModel, AnnotationModel, PathAnnotationModel } from './objects/annotation-model';import { ShapeAnnotation, PathAnnotation, Annotation } from './objects/annotation';import { PointModel } from './primitives/point-model';import { Canvas } from './core/containers/canvas';import { GridPanel, ColumnDefinition } from './core/containers/grid';import { DataSourceModel } from './diagram/data-source-model';import { DataSource } from './diagram/data-source';import { LayoutModel } from './layout/layout-base-model';import { Layout, INode, ILayout } from './layout/layout-base';import { DataBinding } from './data-binding/data-binding';import { Selector, Text } from './objects/node';import { SelectorModel } from './objects/node-model';import { DiagramEventHandler } from './interaction/event-handlers';import { CommandHandler } from './interaction/command-manager';import { DiagramScroller } from './interaction/scroller';import { Actions, isSelected } from './interaction/actions';import { ToolBase } from './interaction/tool';import { BpmnDiagrams } from './objects/bpmn';import { DiagramContextMenu } from './objects/context-menu';import { ConnectorBridging } from './objects/connector-bridging';import { SpatialSearch } from './interaction/spatial-search/spatial-search';import { HistoryEntry, History } from './diagram/history';import { UndoRedo } from './objects/undo-redo';import { ConnectorEditing } from './interaction/connector-editing';import { Ruler } from '../ruler/index';import { BeforeOpenCloseMenuEventArgs, MenuEventArgs } from '@syncfusion/ej2-navigations';import { setAttributeSvg, setAttributeHtml, measureHtmlText, removeElement, createMeasureElements, getDomIndex } from './utility/dom-util';import { getDiagramElement, getScrollerWidth, getHTMLLayer, createUserHandleTemplates } from './utility/dom-util';import { getBackgroundLayer, createHtmlElement, createSvgElement, getNativeLayerSvg, getUserHandleLayer } from './utility/dom-util';import { getPortLayerSvg, getDiagramLayerSvg, applyStyleAgainstCsp } from './utility/dom-util';import { getAdornerLayerSvg, getSelectorElement, getGridLayerSvg, getBackgroundLayerSvg } from './utility/dom-util';import { CommandManager, ContextMenuSettings } from './diagram/keyboard-commands';import { CommandManagerModel, CommandModel, ContextMenuSettingsModel } from './diagram/keyboard-commands-model';import { canDelete, canInConnect, canOutConnect, canRotate, canVitualize, canDrawThumbs } from './utility/constraints-util';import { canPortInConnect, canPortOutConnect } from './utility/constraints-util';import { canResize, canSingleSelect, canZoomPan, canZoomTextEdit, canMultiSelect } from './utility/constraints-util';import { canDragSourceEnd, canDragTargetEnd, canDragSegmentThumb, enableReadOnly, canMove } from './utility/constraints-util';import { findAnnotation, arrangeChild, getInOutConnectPorts, removeChildNodes, canMeasureDecoratorPath } from './utility/diagram-util';import { randomId, cloneObject, extendObject, getFunction, getBounds } from './utility/base-util';import { Snapping } from './objects/snapping';import { DiagramTooltipModel } from './objects/tooltip-model';import { TextStyleModel, ShadowModel, StopModel } from './core/appearance-model';import { TransformFactor } from './interaction/scroller';import { RadialTree } from './layout/radial-tree';import { HierarchicalTree } from './layout/hierarchical-tree';import { ComplexHierarchicalTree } from './layout/complex-hierarchical-tree';import { MindMap } from './layout/mind-map';import { DiagramTooltip, initTooltip } from './objects/tooltip';import { Tooltip } from '@syncfusion/ej2-popups';import { PrintAndExport } from './print-settings';import { Port, PointPort } from './objects/port';import { SymmetricLayout, IGraphObject } from './layout/symmetrical-layout';import { LayoutAnimation } from './objects/layout-animation';import { canShadow } from './utility/constraints-util';import { Layer } from './diagram/layer';import { LayerModel } from './diagram/layer-model';import { DiagramNativeElement } from './core/elements/native-element';import { DiagramHtmlElement } from './core/elements/html-element';import { IconShapeModel } from './objects/icon-model';import { canAllowDrop } from './utility/constraints-util';import { checkParentAsContainer, addChildToContainer, updateLaneBoundsAfterAddChild } from './interaction/container-interaction';import { DataManager } from '@syncfusion/ej2-data';import { getConnectors, updateConnectorsProperties, phaseDefine } from './utility/swim-lane-util';import { swimLaneMeasureAndArrange } from './utility/swim-lane-util';import { arrangeChildNodesInSwimLane, updateHeaderMaxWidth, updatePhaseMaxWidth } from './utility/swim-lane-util';import { addLane, addPhase } from './utility/swim-lane-util';import { ContextMenuItemModel } from './../diagram/objects/interface/interfaces';import { SerializationSettingsModel } from './diagram/serialization-settings-model';import { SerializationSettings } from './diagram/serialization-settings';import { removeSwimLane, removeLane, removePhase, removeLaneChildNode } from './utility/swim-lane-util';import { RowDefinition } from './core/containers/grid';import { CustomCursorAction } from './diagram/custom-cursor';import { CustomCursorActionModel } from './diagram/custom-cursor-model';import { SymbolSizeModel } from './../diagram/objects/preview-model';import { LineRouting } from './interaction/line-routing';import { LineDistribution } from './interaction/line-distribution';import { DiagramSettingsModel } from '../diagram/diagram-settings-model';import { DiagramSettings } from '../diagram/diagram-settings';import { BlazorTooltip } from './blazor-tooltip/blazor-Tooltip';import { StackPanel } from './core/containers/stack-panel';import { UserHandleModel } from './interaction/selector-model';import { ConnectorFixedUserHandle, NodeFixedUserHandle } from './objects/fixed-user-handle';import { NodeFixedUserHandleModel, ConnectorFixedUserHandleModel, FixedUserHandleModel } from './objects/fixed-user-handle-model';import { LinearGradient, RadialGradient } from './core/appearance';import { SegmentThumbShapes } from './enum/enum';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class Diagram
 */
export interface DiagramModel extends ComponentModel{

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
    width?: string | number;

    /**
     * Split the connector, when the node is dropped onto it and establish connection with that dropped node.
     *
     * @default false
    */
    enableConnectorSplit?: boolean;

    /**
     * Defines the diagram rendering mode.
     * * SVG - Renders the diagram objects as SVG elements
     * * Canvas - Renders the diagram in a canvas
     *
     * @default 'SVG'
     */
    mode?: RenderingMode;

    /**
     * Defines the height of the diagram model.
     *
     * @default '100%'
     */
    height?: string | number;

    /**
     * Defines the segmentThumbShape 
     * 
     * @default 'Rhombus'
     */
    segmentThumbShape?: SegmentThumbShapes;

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
    contextMenuSettings?: ContextMenuSettingsModel;

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
    constraints?: DiagramConstraints;

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

    tool?: DiagramTools;

    /**
     * Defines the direction of the bridge that is inserted when the segments are intersected
     * * Top - Defines the direction of the bridge as Top
     * * Bottom - Defines the direction of the bridge as Bottom
     * * Left - Sets the bridge direction as left
     * * Right - Sets the bridge direction as right
     *
     * @default top
     */
    bridgeDirection?: BridgeDirection;

    /**
     * Defines the background color of the diagram
     *
     * @default 'transparent'
     */
    backgroundColor?: string;

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
    snapSettings?: SnapSettingsModel;

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
    rulerSettings?: RulerSettingsModel;

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
    pageSettings?: PageSettingsModel;

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
    serializationSettings?: SerializationSettingsModel;

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
    nodes?: NodeModel[];

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
    drawingObject?: NodeModel | ConnectorModel;

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
    connectors?: ConnectorModel[];

    /**
     * Defines the basic elements for the diagram
     *
     * @default []
     * @hidden
     */
    basicElements?: DiagramElement[];

    /**
     * Defines the tooltip that should be shown when the mouse hovers over a node or connector
     * An object that defines the description, appearance and alignments of tooltip
     *
     * @default {}
     */
    tooltip?: DiagramTooltipModel;

    /**
     * Configures the data source that is to be bound with diagram
     *
     * @default {}
     */
    dataSourceSettings?: DataSourceModel;

    /**
     * Allows the user to save custom information/data about diagram
     *
     * @aspDefaultValueIgnore
     * @default undefined
     */
    addInfo?: Object;

    /**
     * Customizes the undo redo functionality
     *
     * @default undefined
     */
    historyManager?: History;

    /**
     * Customizes the node template
     *
     * @default undefined
     */
    nodeTemplate?: string;

    /**
     * Customizes the annotation template
     *
     * @default undefined
     */
    annotationTemplate?: string;

    /**
     * This property represents the template content of a user handle. The user can define any HTML element as a template.
     *
     * @default undefined
     */
    userHandleTemplate?: string;

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
    getNodeDefaults?: Function | string;

    /**
     * Helps to assign the default properties of nodes
     */
    nodeDefaults?: NodeModel;

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
    getConnectorDefaults?: Function | string;

    /**
     * Helps to assign the default properties of connector
     */
    connectorDefaults?: ConnectorModel;

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
    setNodeTemplate?: Function | string;

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
    getDescription?: Function | string;

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
    getCustomProperty?: Function | string;

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
    getCustomTool?: Function | string;

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
    getCustomCursor?: Function | string;

    /**
     * A collection of JSON objects where each object represents a custom cursor action. Layer is a named category of diagram shapes.
     *
     * @default []
     */
    customCursor?: CustomCursorActionModel[];

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
    updateSelection?: Function | string;

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
    diagramSettings?: DiagramSettingsModel;

    /**
     * Defines the collection of selected items, size and position of the selector
     *
     * @default {}
     */
    selectedItems?: SelectorModel;

    /**
     * Defines the current zoom value, zoom factor, scroll status and view port size of the diagram
     *
     * @default {}
     */
    scrollSettings?: ScrollSettingsModel;

    /**
     * Layout is used to auto-arrange the nodes in the Diagram area
     *
     * @default {}
     */
    layout?: LayoutModel;

    /**
     * Defines a set of custom commands and binds them with a set of desired key gestures
     *
     * @default {}
     */
    commandManager?: CommandManagerModel;

    /**
     * Triggers after diagram is populated from the external data source
     *
     * @event
     * @deprecated
     */
    dataLoaded?: EmitType<IDataLoadedEventArgs>;

    /**
     * Triggers when a symbol is dragged into diagram from symbol palette
     *
     * @event
     */
    dragEnter?: EmitType<IDragEnterEventArgs>;

    /**
     * Triggers when a symbol is dragged outside of the diagram.
     *
     * @event
     */
    dragLeave?: EmitType<IDragLeaveEventArgs>;

    /**
     * Triggers when a symbol is dragged over diagram
     *
     * @event
     * @deprecated
     */
    dragOver?: EmitType<IDragOverEventArgs>;

    /**
     * Triggers when a node, connector or diagram is clicked
     *
     * @event
     */
    click?: EmitType<IClickEventArgs>;

    /**
     * Triggers when a change is reverted or restored(undo/redo)
     *
     * @event
     */
    historyChange?: EmitType<IHistoryChangeArgs>;

    /**
     * Triggers when a custom entry change is reverted or restored(undo/redo)
     *
     * @event
     */
    historyStateChange?: EmitType<IBlazorCustomHistoryChangeArgs>;

    /**
     * Triggers when a node, connector or diagram model is clicked twice
     *
     * @event
     */
    doubleClick?: EmitType<IDoubleClickEventArgs>;

    /**
     * Triggers when editor got focus at the time of node’s label or text node editing.
     *
     * @event
     */
    textEdit?: EmitType<ITextEditEventArgs>;

    /**
     * Triggers when the diagram is zoomed or panned
     *
     * @event
     * @deprecated
     */
    scrollChange?: EmitType<IScrollChangeEventArgs>;

    /**
     * Triggers when the selection is changed in diagram
     *
     * @event
     */
    selectionChange?: EmitType<ISelectionChangeEventArgs>;

    /**
     * Triggers when a node is resized
     *
     * @event
     */
    sizeChange?: EmitType<ISizeChangeEventArgs>;

    /**
     * Triggers when the connection is changed
     *
     * @event
     */
    connectionChange?: EmitType<IConnectionChangeEventArgs>;

    /**
     * Triggers when the connector's source point is changed
     *
     * @event
     * @deprecated
     */
    sourcePointChange?: EmitType<IEndChangeEventArgs>;

    /**
     * Triggers when the connector's target point is changed
     *
     * @event
     * @deprecated
     */
    targetPointChange?: EmitType<IEndChangeEventArgs>;

    /**
     * Triggers once the node or connector property changed.
     *
     * @event
     */
    propertyChange?: EmitType<IPropertyChangeEventArgs>;

    /**
     * Triggers while dragging the elements in diagram
     *
     * @event
     */
    positionChange?: EmitType<IDraggingEventArgs>;

    /**
     * Triggers when a user releases a key.
     *
     * @event
     */
    keyUp?: EmitType<IKeyEventArgs>;

    /**
     * Triggers when a user is pressing a key.
     *
     * @event
     */
    keyDown?: EmitType<IKeyEventArgs>;

    /**
     * Triggers after animation is completed for the diagram elements.
     *
     * @event
     * @deprecated
     */
    animationComplete?: EmitType<Object>;

    /**
     * Triggers when the diagram elements are rotated
     *
     * @event
     */
    rotateChange?: EmitType<IRotationEventArgs>;

    /**
     * Triggers when a node/connector is added/removed to/from the diagram.
     *
     * @deprecated
     * @event
     */
    collectionChange?: EmitType<ICollectionChangeEventArgs>;

    /**
     * Triggers when a node/connector fixedUserHandle is clicked in the diagram.
     *
     * @event
     */
    fixedUserHandleClick?: EmitType<FixedUserHandleClickEventArgs>;

    /**
     * Triggers when a mouseDown on the user handle.
     *
     * @event
     */
    onUserHandleMouseDown?: EmitType<UserHandleEventsArgs>;

    /**
     * Triggers when a mouseUp on the user handle.
     *
     * @event
     */
    onUserHandleMouseUp?: EmitType<UserHandleEventsArgs>;

    /**
     * Triggers when a mouseEnter on the user handle.
     *
     * @event
     */
    onUserHandleMouseEnter?: EmitType<UserHandleEventsArgs>;

    /**
     * Triggers when a mouseLeave on the user handle.
     *
     * @event
     */
    onUserHandleMouseLeave?: EmitType<UserHandleEventsArgs>;

    /**
     * Triggers when a segment is added/removed to/from the connector.
     *
     * @event
     * @deprecated
     */
    segmentCollectionChange?: EmitType<ISegmentCollectionChangeEventArgs>;

    /**
     * Triggers when the image node is loaded.
     *
     * @deprecated
     * @event
     */
    onImageLoad?: EmitType<IImageLoadEventArgs>;

    /**
     * Triggers when the state of the expand and collapse icon change for a node.
     *
     * @deprecated
     * @event
     */
    expandStateChange?: EmitType<IExpandStateChangeEventArgs>;

    /**
     * Triggered when the diagram is rendered completely.
     *
     * @event
     */
    created?: EmitType<Object>;

    /**
     * Triggered when mouse enters a node/connector.
     *
     * @event
     */
    mouseEnter?: EmitType<IMouseEventArgs>;

    /**
     * Triggered when mouse leaves node/connector.
     *
     * @event
     */
    mouseLeave?: EmitType<IMouseEventArgs>;

    /**
     * Triggered when mouse hovers a node/connector.
     *
     * @event
     * @deprecated
     */
    mouseOver?: EmitType<IMouseEventArgs>;

    /**
     * Triggers before opening the context menu
     *
     * @event
     */
    contextMenuOpen?: EmitType<BeforeOpenCloseMenuEventArgs>;

    /**
     * Triggers before rendering the context menu item
     *
     * @event
     * @deprecated
     */
    contextMenuBeforeItemRender?: EmitType<MenuEventArgs>;

    /**
     * Triggers when a context menu item is clicked
     *
     * @event
     */
    contextMenuClick?: EmitType<MenuEventArgs>;

    /**
     * Triggers when a command executed.
     *
     * @event
     */
    commandExecute?: EmitType<ICommandExecuteEventArgs>;

    /**
     * A collection of JSON objects where each object represents a layer. Layer is a named category of diagram shapes.
     *
     * @default []
     */
    layers?: LayerModel[];

    /**
     * Triggers when a symbol is dragged and dropped from symbol palette to drawing area
     *
     * @event
     */
    drop?: EmitType<IDropEventArgs>;

}