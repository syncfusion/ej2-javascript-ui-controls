import { Component, Property, Complex, Collection, EventHandler, L10n, Droppable, remove } from '@syncfusion/ej2-base';
import { Browser, ModuleDeclaration, Event, EmitType } from '@syncfusion/ej2-base';
import { INotifyPropertyChanged } from '@syncfusion/ej2-base';
import { DiagramModel } from './diagram-model';
import { CanvasRenderer } from './rendering/canvas-renderer';
import { SvgRenderer } from './rendering/svg-renderer';
import { DiagramRenderer } from './rendering/renderer';
import { BaseAttributes } from './rendering/canvas-interface';
import { PageSettings, ScrollSettings } from './diagram/page-settings';
import { PageSettingsModel, ScrollSettingsModel } from './diagram/page-settings-model';
import { DiagramElement } from './core/elements/diagram-element';
import { ServiceLocator } from './objects/service';
import { IElement, IDataLoadedEventArgs, ISelectionChangeEventArgs, IClickEventArgs, ScrollValues } from './objects/interface/IElement';
import { ISizeChangeEventArgs, IConnectionChangeEventArgs, IEndChangeEventArgs, IDoubleClickEventArgs } from './objects/interface/IElement';
import { ICollectionChangeEventArgs, IPropertyChangeEventArgs, IDraggingEventArgs, IRotationEventArgs } from './objects/interface/IElement';
import { IDragEnterEventArgs, IDragLeaveEventArgs, IDragOverEventArgs, IDropEventArgs } from './objects/interface/IElement';
import { ITextEditEventArgs, IHistoryChangeArgs, IScrollChangeEventArgs, IMouseEventArgs } from './objects/interface/IElement';
import { ZoomOptions, IPrintOptions, IExportOptions, IFitOptions, ActiveLabel } from './objects/interface/interfaces';
import { View } from './objects/interface/interfaces';
import { Container } from './core/containers/container';
import { Node, BpmnShape, BpmnAnnotation } from './objects/node';
import { Segment } from './interaction/scroller';
import { Connector } from './objects/connector';
import { ConnectorModel, BpmnFlowModel } from './objects/connector-model';
import { SnapSettings } from './diagram/grid-lines';
import { RulerSettings } from './diagram/ruler-settings';
import { removeRulerElements, updateRuler, getRulerSize } from './ruler/ruler';
import { renderRuler, renderOverlapElement } from './ruler/ruler';
import { RulerSettingsModel } from './diagram/ruler-settings-model';
import { SnapSettingsModel } from './diagram/grid-lines-model';
import { NodeModel, TextModel, BpmnShapeModel, BpmnAnnotationModel } from './objects/node-model';
import { Size } from './primitives/size';
import { Point } from './primitives/point';
import { Keys, KeyModifiers, DiagramTools, AlignmentMode, AnnotationConstraints, NodeConstraints } from './enum/enum';
import { DiagramConstraints, BridgeDirection, AlignmentOptions, SelectorConstraints, PortVisibility, DiagramEvent } from './enum/enum';
import { DistributeOptions, SizingOptions, RenderingMode, DiagramAction, ThumbsConstraints, NudgeDirection } from './enum/enum';
import { RealAction } from './enum/enum';
import { PathElement } from './core/elements/path-element';
import { TextElement } from './core/elements/text-element';
import { updateStyle, removeItem, updateConnector, updateShape } from './utility/diagram-util';
import { checkPortRestriction, serialize, deserialize, updateHyperlink, getObjectType } from './utility/diagram-util';
import { Rect } from './primitives/rect';
import { getPortShape } from './objects/dictionary/common';
import { PointPortModel } from './objects/port-model';
import { ShapeAnnotationModel, AnnotationModel, PathAnnotationModel } from './objects/annotation-model';
import { ShapeAnnotation, PathAnnotation, Annotation } from './objects/annotation';
import { PointModel } from './primitives/point-model';
import { Canvas } from './core/containers/canvas';
import { DataSourceModel } from './diagram/data-source-model';
import { DataSource } from './diagram/data-source';
import { LayoutModel } from './layout/layout-base-model';
import { Layout, INode, ILayout } from './layout/layout-base';
import { DataBinding } from './data-binding/data-binding';
import { Selector } from './interaction/selector';
import { SelectorModel } from './interaction/selector-model';
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
import { BeforeOpenCloseMenuEventArgs, MenuEventArgs, EJ2Instance } from '@syncfusion/ej2-navigations';
import { setAttributeSvg, setAttributeHtml, measureHtmlText, removeElement, createMeasureElements } from './utility/dom-util';
import { getDiagramElement, getScrollerWidth, getHTMLLayer } from './utility/dom-util';
import { getBackgroundLayer, createHtmlElement, createSvgElement, getNativeLayerSvg } from './utility/dom-util';
import { getPortLayerSvg, getDiagramLayerSvg } from './utility/dom-util';
import { getAdornerLayerSvg, getSelectorElement, getGridLayerSvg, getBackgroundLayerSvg } from './utility/dom-util';
import { CommandManager, ContextMenuSettings } from './diagram/keyboard-commands';
import { CommandManagerModel, CommandModel, ContextMenuSettingsModel } from './diagram/keyboard-commands-model';
import { canDelete, canInConnect, canOutConnect, canRotate, canVitualize } from './utility/constraints-util';
import { canResize, canSingleSelect, canZoomPan, canZoomTextEdit } from './utility/constraints-util';
import { canDragSourceEnd, canDragTargetEnd, canDragSegmentThumb, enableReadOnly, canMove } from './utility/constraints-util';
import { findAnnotation, arrangeChild } from './utility/diagram-util';
import { randomId, cloneObject, extendObject, getFunction, getBounds } from './utility/base-util';
import { Snapping } from './objects/snapping';
import { DiagramTooltipModel } from './objects/tooltip-model';
import { TextStyleModel } from './core/appearance-model';
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
     * @private
     */
    public organizationalChartModule: HierarchicalTree;

    /**
     * `mindMapChartModule` is used to arrange the nodes in a mind map like structure
     */
    public mindMapChartModule: MindMap;

    /**
     * `radialTreeModule` is used to arrange the nodes in a radial tree like structure
     */
    public radialTreeModule: RadialTree;

    /**
     * `complexHierarchicalTreeModule` is used to arrange the nodes in a hierarchical tree like structure
     * @private
     */
    public complexHierarchicalTreeModule: ComplexHierarchicalTree;

    /**
     * `dataBindingModule` is used to populate nodes from given data source
     * @private
     */
    public dataBindingModule: DataBinding;

    /**
     * `snappingModule` is used to Snap the objects
     * @private
     */
    public snappingModule: Snapping;

    /**
     * `printandExportModule` is used to print or export the objects
     * @private
     */
    public printandExportModule: PrintAndExport;

    /**
     * `bpmnModule` is used to add built-in BPMN Shapes to diagrams
     * @private
     */
    public bpmnModule: BpmnDiagrams;

    /**
     * 'symmetricalLayoutModule' is usd to render layout in symmetrical method
     * @private
     */
    public symmetricalLayoutModule: SymmetricLayout;

    /**
     * `bridgingModule` is used to add bridges to connectors
     * @private
     */
    public bridgingModule: ConnectorBridging;

    /**
     * `undoRedoModule` is used to revert and restore the changes
     * @private
     */
    public undoRedoModule: UndoRedo;

    /**
     * `layoutAnimateModule` is used to revert and restore the changes
     * @private
     */
    public layoutAnimateModule: LayoutAnimation;

    /**
     * 'contextMenuModule' is used to manipulate context menu
     * @private
     */
    public contextMenuModule: DiagramContextMenu;

    /**
     * `connectorEditingToolModule` is used to edit the segments for connector
     * @private
     */
    public connectorEditingToolModule: ConnectorEditing;

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
     * @default '100%'
     */
    @Property('100%')
    public width: string | number;

    /**
     * Defines the diagram rendering mode.
     * * SVG - Renders the diagram objects as SVG elements
     * * Canvas - Renders the diagram in a canvas
     * @default 'SVG'
     */
    @Property('SVG')
    public mode: RenderingMode;

    /**
     * Defines the height of the diagram model.
     * @default '100%'
     */
    @Property('100%')
    public height: string | number;

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
     * @default 'Default'
     * @aspNumberEnum 
     */

    @Property(DiagramTools.Default)
    public tool: DiagramTools;

    /**
     * Defines the direction of the bridge that is inserted when the segments are intersected
     * * Top - Defines the direction of the bridge as Top
     * * Bottom - Defines the direction of the bridge as Bottom
     * * Left - Sets the bridge direction as left
     * * Right - Sets the bridge direction as right
     * @default top
     */
    @Property('Top')
    public bridgeDirection: BridgeDirection;

    /**
     * Defines the background color of the diagram
     * @default transparent
     */
    @Property('transparent')
    public backgroundColor: String;

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
     * @default {}
     */
    @Complex<PageSettingsModel>({}, PageSettings)
    public pageSettings: PageSettingsModel;

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
     * @default []
     */
    @Collection<ConnectorModel>([], Connector)
    public connectors: ConnectorModel[];

    /**
     * Defines the basic elements for the diagram
     * @default []
     * @hidden
     */
    @Property([])
    public basicElements: DiagramElement[];

    /**
     * Defines the tooltip that should be shown when the mouse hovers over a node or connector
     * An object that defines the description, appearance and alignments of tooltip
     * @default {}
     */
    @Complex<DiagramTooltipModel>({}, DiagramTooltip)
    public tooltip: DiagramTooltipModel;

    /**
     * Configures the data source that is to be bound with diagram
     * @default {}
     */
    @Complex<DataSourceModel>({}, DataSource)
    public dataSourceSettings: DataSourceModel;

    /**
     * Allows the user to save custom information/data about diagram
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Property()
    public addInfo: Object;

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
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Property()
    public getNodeDefaults: Function | string;
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
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Property()
    public getConnectorDefaults: Function | string;
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
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Property()
    public setNodeTemplate: Function | string;

    /**
     * Allows to set accessibility content for diagram objects
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
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Property()
    public getCustomProperty: Function | string;
    /**
     * Allows the user to set custom tool that corresponds to the given action
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
     */
    @Property()
    public getCustomTool: Function | string;

    /**
     * Allows the user to set custom cursor that corresponds to the given action
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
     */
    @Property()
    public getCustomCursor: Function | string;

    /**
     * Defines the collection of selected items, size and position of the selector
     * @default {}
     */
    @Complex<SelectorModel>({}, Selector)
    public selectedItems: SelectorModel;

    /**
     * Defines the current zoom value, zoom factor, scroll status and view port size of the diagram
     * @default {}
     */
    @Complex<ScrollSettingsModel>({}, ScrollSettings)
    public scrollSettings: ScrollSettingsModel;

    /**
     * Layout is used to auto-arrange the nodes in the Diagram area
     * @default {}
     */
    @Complex<LayoutModel>({}, Layout)
    public layout: LayoutModel;

    /**
     * Defines a set of custom commands and binds them with a set of desired key gestures
     * @default {}
     */
    @Complex<CommandManagerModel>({}, CommandManager)
    public commandManager: CommandManagerModel;

    /**
     * Triggers after diagram is populated from the external data source
     * @event
     */
    @Event()
    public dataLoaded: EmitType<IDataLoadedEventArgs>;

    /**
     * Triggers when a symbol is dragged into diagram from symbol palette
     * @event
     */
    @Event()
    public dragEnter: EmitType<IDragEnterEventArgs>;

    /**
     * Triggers when a symbol is dragged outside of the diagram.
     * @event
     */
    @Event()
    public dragLeave: EmitType<IDragLeaveEventArgs>;

    /**
     * Triggers when a symbol is dragged over diagram
     * @event
     */
    @Event()
    public dragOver: EmitType<IDragOverEventArgs>;

    /**
     * Triggers when a node, connector or diagram is clicked
     * @event
     */
    @Event()
    public click: EmitType<IClickEventArgs>;

    /**
     * Triggers when a change is reverted or restored(undo/redo)
     * @event
     */
    @Event()
    public historyChange: EmitType<IHistoryChangeArgs>;

    /**
     * Triggers when a node, connector or diagram model is clicked twice
     * @event
     */
    @Event()
    public doubleClick: EmitType<IDoubleClickEventArgs>;

    /**
     * Triggers when editor got focus at the time of node’s label or text node editing.
     * @event
     */
    @Event()
    public textEdit: EmitType<ITextEditEventArgs>;

    /**
     * Triggers when the diagram is zoomed or panned
     * @event
     */
    @Event()
    public scrollChange: EmitType<IScrollChangeEventArgs>;

    /**
     * Triggers when the selection is changed in diagram
     * @event
     */
    @Event()
    public selectionChange: EmitType<ISelectionChangeEventArgs>;

    /**
     * Triggers when a node is resized
     * @event
     */
    @Event()
    public sizeChange: EmitType<ISizeChangeEventArgs>;

    /**
     * Triggers when the connection is changed
     * @event
     */
    @Event()
    public connectionChange: EmitType<IConnectionChangeEventArgs>;

    /**
     * Triggers when the connector's source point is changed
     * @event
     */
    @Event()
    public sourcePointChange: EmitType<IEndChangeEventArgs>;

    /**
     * Triggers when the connector's target point is changed
     * @event
     */
    @Event()
    public targetPointChange: EmitType<IEndChangeEventArgs>;

    /**
     * Triggers once the node or connector property changed.
     * @event
     */
    @Event()
    public propertyChange: EmitType<IPropertyChangeEventArgs>;

    /**
     * Triggers while dragging the elements in diagram
     * @event
     */
    @Event()
    public positionChange: EmitType<IDraggingEventArgs>;

    /**
     * Triggers after animation is completed for the diagram elements.
     * @event
     */
    @Event()
    public animationComplete: EmitType<Object>;

    /**
     * Triggers when the diagram elements are rotated
     * @event
     */
    @Event()
    public rotateChange: EmitType<IRotationEventArgs>;


    /**
     * Triggers when a node/connector is added/removed to/from the diagram.
     * @event
     */
    @Event()
    public collectionChange: EmitType<ICollectionChangeEventArgs>;


    /**
     * Triggered when the diagram is rendered completely.
     * @event
     */
    @Event()
    public created: EmitType<Object>;

    /**
     * Triggered when mouse enters a node/connector.
     * @event
     */
    @Event()
    public mouseEnter: EmitType<IMouseEventArgs>;

    /**
     * Triggered when mouse leaves node/connector.
     * @event
     */
    @Event()
    public mouseLeave: EmitType<IMouseEventArgs>;

    /**
     * Triggered when mouse hovers a node/connector.
     * @event
     */
    @Event()
    public mouseOver: EmitType<IMouseEventArgs>;

    /**
     * Triggers before opening the context menu
     * @event
     */
    @Event()
    public contextMenuOpen: EmitType<BeforeOpenCloseMenuEventArgs>;

    /**
     * Triggers when a context menu item is clicked
     * @event
     */
    @Event()
    public contextMenuClick: EmitType<MenuEventArgs>;

    /**
     * A collection of JSON objects where each object represents a layer. Layer is a named category of diagram shapes.
     * @default []
     */
    @Collection<LayerModel>([], Layer)
    public layers: LayerModel[];

    /**
     * Triggers when a symbol is dragged and dropped from symbol palette to drawing area
     * @event
     */
    @Event()
    public drop: EmitType<IDropEventArgs>;

    //private variables
    /** @private */
    public preventUpdate: boolean;

    /** @hidden */
    /** @private */
    public localeObj: L10n;
    private defaultLocale: Object;

    /** @private */
    public currentDrawingObject: Node | Connector;
    /** @private */
    public currentSymbol: Node | Connector;
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
    public connectorTable: {} = {};
    /** @private */
    public groupTable: {} = {};
    /** @private */
    private htmlLayer: HTMLElement;
    /** @private */
    public historyList: History;
    /** @private */
    public diagramActions: DiagramAction;
    /** @private */
    public commands: {};
    /** @private */
    public activeLabel: ActiveLabel = { id: '', parentId: '', isGroup: false };
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
    public selectionConnectorsList: ConnectorModel[] = [];
    public realActions: RealAction;
    private deleteVirtualObject: boolean = false;
    /**
     * Constructor for creating the widget
     */
    constructor(options?: DiagramModel, element?: HTMLElement | string) {
        super(options, <HTMLElement | string>element);
        let child: NodeModel;
        let node: NodeModel;
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
        }

    }

    private clearCollection(isConnector?: boolean): void {
        let collection: (NodeModel | ConnectorModel)[] = [];
        let obj: NodeModel | ConnectorModel;
        for (let key of Object.keys(this.nameTable)) {
            obj = this.nameTable[key];
            if (obj && ((isConnector && obj instanceof Connector) || (!isConnector && obj instanceof Node))) {
                collection.push(obj);
            }
        }
        this.clearObjects(collection);
    }
    /**
     * Updates the diagram control when the objects are changed
     * @param newProp Lists the new values of the changed properties
     * @param oldProp Lists the old values of the changed properties
     */
    /* tslint:disable */
    public onPropertyChanged(newProp: DiagramModel, oldProp: DiagramModel): void {
        // Model Changed
        let objectArray: (NodeModel | ConnectorModel)[] = []; let refreshLayout: boolean = false;
        let refereshColelction: boolean = false;
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'width':
                case 'height':
                    this.element.style.width = this.getSizeValue(this.width);
                    this.element.style.height = this.getSizeValue(this.height);
                    this.eventHandler.updateViewPortSize(this.element);
                    for (let view of this.views) {
                        let temp: View = this.views[view];
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
                        for (let key of Object.keys(newProp.nodes)) {
                            let index: number = Number(key);
                            let actualObject: Node = this.nodes[index] as Node; let changedProp: Node = newProp.nodes[index] as Node;
                            refreshLayout = refreshLayout || changedProp.excludeFromLayout !== undefined;
                            this.nodePropertyChange(actualObject, oldProp.nodes[index] as Node, changedProp, undefined, true);
                            objectArray.push(actualObject);
                        }
                        if (this.mode === 'Canvas') {
                            this.refreshDiagramLayer();
                        }
                    }
                    break;
                case 'connectors':
                    let oldObject: Connector;
                    if (newProp.connectors.length > 0 && oldProp.connectors.length === 0) {
                        this.clearCollection(true);
                        refereshColelction = true;
                    } else {
                        for (let key of Object.keys(newProp.connectors)) {
                            let index: number = Number(key);
                            let actualObject: Connector = this.connectors[index] as Connector;
                            let changedProp: Connector = newProp.connectors[index] as Connector;
                            this.connectorPropertyChange(actualObject, oldProp.connectors[index] as Connector, changedProp, true);
                            objectArray.push(actualObject);
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
                case 'dataSourceSettings':
                    this.clear(); this.initObjects(); refreshLayout = true;
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
                    this.updateScrollSettings(newProp); break;
                case 'locale':
                    this.realActions |= RealAction.PreventDataInit;
                    super.refresh();
                    this.realActions &= ~RealAction.PreventDataInit;
                    break;

            }
        }
        if (refreshLayout) { this.doLayout(); }
        let args: IPropertyChangeEventArgs = { element: objectArray, cause: this.diagramActions, oldValue: oldProp, newValue: newProp };
        this.triggerEvent(DiagramEvent.propertyChange, args);
        if (!refereshColelction && (this.canLogChange()) && (this.modelChanged(newProp, oldProp))) {
            let entry: HistoryEntry = { type: 'PropertyChanged', undoObject: oldProp, redoObject: newProp, category: 'Internal' };
            this.addHistoryEntry(entry);
        }
        this.resetDiagramActions();
        if (refereshColelction) {
            this.initObjects(true);
            this.refreshDiagramLayer();
        }
    }
    /* tslint:enable */
    private updateSnapSettings(newProp: DiagramModel): void {
        if (newProp.snapSettings.constraints !== undefined || newProp.snapSettings.horizontalGridlines ||
            newProp.snapSettings.verticalGridlines) {
            this.diagramRenderer.updateGrid(
                this.snapSettings, getGridLayerSvg(this.element.id), this.scroller.transform,
                this.rulerSettings, this.hRuler, this.vRuler
            );
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
     * @return {string}
     */
    public getPersistData(): string {
        let keyEntity: string[] = ['loaded'];
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
        this.initDiagram();
        this.initViews();
        this.unWireEvents();
        this.wireEvents();
        this.element.classList.add('e-diagram');
    }

    private initializePrivateVariables(): void {
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


    /**
     * Renders the diagram control with nodes and connectors
     */
    public render(): void {
        this.initHistory();
        this.diagramRenderer = new DiagramRenderer(this.element.id, new SvgRenderer(), this.mode === 'SVG');
        this.initLayers();
        this.initializeDiagramLayers();
        this.diagramRenderer.setLayers();
        this.initObjects(true);
        this.doLayout();
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
        this.isLoading = false;
    }

    /**
     * Returns the module name of the diagram
     */
    public getModuleName(): string {
        return 'diagram';
    }

    /**
     * To provide the array of modules needed for control rendering
     * @return {ModuleDeclaration[]}
     * @private
     */
    public requiredModules(): ModuleDeclaration[] {

        let modules: ModuleDeclaration[] = [];

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
                args: []
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

        if (this.dataSourceSettings.dataManager || this.dataSourceSettings.data) {
            modules.push({
                member: 'DataBinding',
                args: []
            });
        }
        return modules;
    }

    /**
     * Destroys the diagram control
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

        if (document.getElementById(this.element.id)) {
            this.element.classList.remove('e-diagram');
            let tooltipelement: HTMLCollection = document.getElementsByClassName('e-tooltip-wrap');
            while (tooltipelement.length > 0) {
                tooltipelement[0].parentNode.removeChild(tooltipelement[0]);
            }
            let content: HTMLElement = document.getElementById(this.element.id + 'content');
            if (content) {
                this.element.removeChild(content);
            }
            let measureElement: string = 'measureElement';
            if (window[measureElement]) {
                window[measureElement].usageCount -= 1;
                if (window[measureElement].usageCount === 0) {
                    window[measureElement].parentNode.removeChild(window[measureElement]);
                    window[measureElement] = null;
                }
            }
        }

    }

    /**
     * Wires the mouse events with diagram control
     */
    private wireEvents(): void {
        let startEvent: string = Browser.touchStartEvent;
        let stopEvent: string = Browser.touchEndEvent;
        let moveEvent: string = Browser.touchMoveEvent;
        let cancelEvent: string = Browser.isPointer ? 'pointerleave' : 'mouseleave';
        let isIE11Pointer: Boolean = Browser.isPointer;
        let wheelEvent: string = Browser.info.name === 'mozilla' ?
            (isIE11Pointer ? 'mousewheel' : 'DOMMouseScroll') : 'mousewheel';

        EventHandler.add(this.diagramCanvas, startEvent, this.eventHandler.mouseDown, this.eventHandler);
        EventHandler.add(this.diagramCanvas, moveEvent, this.eventHandler.mouseMove, this.eventHandler);
        EventHandler.add(this.diagramCanvas, stopEvent, this.eventHandler.mouseUp, this.eventHandler);
        EventHandler.add(this.diagramCanvas, cancelEvent, this.eventHandler.mouseLeave, this.eventHandler);
        EventHandler.add(this.diagramCanvas, 'keydown', this.eventHandler.keyDown, this.eventHandler);
        EventHandler.add(this.diagramCanvas, 'dblclick', this.eventHandler.doubleClick, this.eventHandler);
        EventHandler.add(this.diagramCanvas, 'scroll', this.eventHandler.scrolled, this.eventHandler);
        EventHandler.add(this.diagramCanvas, wheelEvent, this.eventHandler.mouseWheel, this.eventHandler);
        EventHandler.add(<HTMLElement & Window>window, 'resize', this.eventHandler.windowResize, this.eventHandler);
        this.initDroppables();
    }

    /**
     * Unwires the mouse events from diagram control
     */
    private unWireEvents(): void {
        let startEvent: string = Browser.touchStartEvent;
        let moveEvent: string = Browser.touchMoveEvent;
        let cancelEvent: string = Browser.isPointer ? 'pointerleave' : 'mouseleave';
        let isIE11Pointer: Boolean = Browser.isPointer;
        let wheelEvent: string = Browser.info.name === 'mozilla' ?
            (isIE11Pointer ? 'mousewheel' : 'DOMMouseScroll') : 'mousewheel';

        let stopEvent: string = Browser.touchEndEvent;
        EventHandler.remove(this.diagramCanvas, startEvent, this.eventHandler.mouseDown);
        EventHandler.remove(this.diagramCanvas, moveEvent, this.eventHandler.mouseMove);
        EventHandler.remove(this.diagramCanvas, stopEvent, this.eventHandler.mouseUp);
        EventHandler.remove(this.diagramCanvas, cancelEvent, this.eventHandler.mouseLeave);
        EventHandler.remove(this.diagramCanvas, 'keydown', this.eventHandler.keyDown);
        EventHandler.remove(this.diagramCanvas, 'dblclick', this.eventHandler.doubleClick);
        EventHandler.remove(this.diagramCanvas, 'scroll', this.eventHandler.scrolled);
        EventHandler.remove(this.diagramCanvas, wheelEvent, this.eventHandler.mouseWheel);
        EventHandler.remove(<HTMLElement & Window>window, 'resize', this.eventHandler.windowResize);
    }

    //public methods - start region

    /**
     * Selects the given collection of objects
     * @param objects Defines the collection of nodes and connectors to be selected
     * @param multipleSelection Defines whether the existing selection has to be cleared or not
     */
    public select(objects: (NodeModel | ConnectorModel)[], multipleSelection?: boolean): void {
        if (objects != null) {
            this.commandHandler.selectObjects(objects, multipleSelection);
        }
    }

    /**
     * Selects the all the objects.
     */
    public selectAll(): void {
        let selectedItems: (NodeModel | ConnectorModel)[] = [];
        selectedItems = this.getObjectsOfLayer(this.activeLayer.objects);
        this.select(selectedItems);
    }

    /**
     * Removes the given object from selection list
     * @param obj Defines the object to be unselected
     */
    public unSelect(obj: NodeModel | ConnectorModel): void {
        if (obj && isSelected(this, obj)) {
            this.commandHandler.unSelect(obj);
        }
    }

    /**
     * Removes all elements from the selection list
     */
    public clearSelection(): void {
        this.commandHandler.clearSelection(true);
    }

    /**
     * Update the diagram clipboard dimension
     */
    public updateViewPort(): void {
        this.eventHandler.updateViewPortSize(this.element);
    }

    private cutCommand(): void {
        this.cut();
    }

    /**
     * Removes the selected nodes and connectors from diagram and moves them to diagram clipboard
     */
    public cut(): void {
        this.commandHandler.cut();
    }

    /**
     * Add a process into the sub-process
     */
    public addProcess(process: NodeModel, parentId: string): void {
        if (this.bpmnModule) {
            this.bpmnModule.addProcess(process, parentId, this);
        }
    }

    /**
     * Remove a process from the sub-process
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
     * Adds the given objects/ the objects in the diagram clipboard to diagram control
     * @param obj Defines the objects to be added to diagram
     */
    public paste(obj?: (NodeModel | ConnectorModel)[]): void {
        this.commandHandler.paste(obj);
    }
    /**
     * fit the diagram to the page with respect to mode and region
     */

    public fitToPage(options?: IFitOptions): void {
        this.scroller.fitToPage(options);
    }
    /**
     * bring the specified bounds into the viewport
     */

    public bringIntoView(bound: Rect): void {
        this.scroller.bringIntoView(bound);
    }
    /**
     * bring the specified bounds to the center of the viewport
     */

    public bringToCenter(bound: Rect): void {
        this.scroller.bringToCenter(bound);
    }

    private copyCommand(): void {
        this.copy();
    }

    /**
     * Copies the selected nodes and connectors to diagram clipboard
     */
    public copy(): Object {
        let obj: Object = this.commandHandler.copy();
        return obj;
    }

    /**
     * Group the selected nodes and connectors in diagram
     */
    public group(): void {
        this.commandHandler.group();
    }

    /**
     * UnGroup the selected nodes and connectors in diagram
     */
    public unGroup(): void {
        this.commandHandler.unGroup();
    }

    /**
     * send the selected nodes or connectors back
     */

    public sendToBack(): void {
        this.commandHandler.sendToBack();
    }
    /**
     * set the active layer
     *  @param layerName defines the name of the layer which is to be active layer
     */
    public setActiveLayer(layerName: string): void {
        let layer: LayerModel = this.commandHandler.getLayer(layerName);
        this.activeLayer = layer;
    }
    /**
     * add the layer into diagram
     * @param layer defines the layer model which is to be added
     * @param layerObject defines the object of the layer
     */
    public addLayer(layer: LayerModel, layerObject?: Object[]): void {
        this.commandHandler.addLayer(layer, layerObject);
    }

    /**
     * remove the layer from diagram
     * @param layerId define the id of the layer
     */
    public removeLayer(layerId: string): void {
        this.commandHandler.removeLayer(layerId);
    }

    /**
     * move objects from the layer to another layer from diagram
     * @param objects define the objects id of string array
     */
    public moveObjects(objects: string[], targetLayer?: string): void {
        this.commandHandler.moveObjects(objects, targetLayer);
    }

    /**
     * move the layer backward
     * @param layerName define the name of the layer
     */
    public sendLayerBackward(layerName: string): void {
        this.commandHandler.sendLayerBackward(layerName);
    }

    /**
     * move the layer forward
     * @param layerName define the name of the layer
     */
    public bringLayerForward(layerName: string): void {
        this.commandHandler.bringLayerForward(layerName);
    }


    /**
     * clone a layer with its object
     * @param layerName define the name of the layer
     */
    public cloneLayer(layerName: string): void {
        this.commandHandler.cloneLayer(layerName);
    }

    /**
     * bring the selected nodes or connectors to front
     */
    public bringToFront(): void {
        this.commandHandler.bringToFront();
    }

    /**
     * send the selected nodes or connectors forward
     */
    public moveForward(): void {
        this.commandHandler.sendForward();
    }

    /**
     * send the selected nodes or connectors back
     */
    public sendBackward(): void {
        this.commandHandler.sendBackward();
    }

    /**
     * gets the node or connector having the given name
     */
    public getObject(name: string): {} {
        return this.nameTable[name];
    }

    /**
     * gets the active layer back
     */
    public getActiveLayer(): LayerModel {
        return this.activeLayer;
    }

    private nudgeCommand(direction: NudgeDirection, x?: number, y?: number): void {
        if (typeof direction !== 'object') {
            this.nudge(direction);
        }
    }

    /**
     * Moves the selected objects towards the given direction
     * @param direction Defines the direction by which the objects have to be moved
     * @param x Defines the distance by which the selected objects have to be horizontally moved
     * @param y Defines the distance by which the selected objects have to be vertically moved
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
        let obj: SelectorModel = this.selectedItems;
        this.drag(obj, tx, ty);
    }

    /**
     * Drags the given object by the specified pixels
     * @param obj Defines the nodes/connectors to be dragged
     * @param tx Defines the distance by which the given objects have to be horizontally moved
     * @param ty Defines the distance by which the given objects have to be vertically moved
     */
    public drag(obj: NodeModel | ConnectorModel | SelectorModel, tx: number, ty: number): void {
        if (this.bpmnModule && (obj instanceof Node)) {
            let updated: boolean = this.bpmnModule.updateAnnotationDrag(obj as Node, this, tx, ty);
            if (updated) {
                return;
            }
        }
        if (obj instanceof Selector) {
            this.preventConnectorsUpdate = true;
            if (obj.nodes && obj.nodes.length) {
                for (let node of obj.nodes) {
                    this.drag(node, tx, ty);
                }
            }
            if (obj.connectors && obj.connectors.length) {
                for (let conn of obj.connectors) {
                    this.drag(conn, tx, ty);
                    if (this.selectionConnectorsList.indexOf(conn) === -1) {
                        this.selectionConnectorsList.push(conn);
                    }
                }
            }
            this.updateSelector();
        } else {
            if (obj instanceof Node) {
                if (this.bpmnModule) { this.bpmnModule.updateAnnotationDrag(obj, this, tx, ty); }
            }
            this.commandHandler.drag(obj as NodeModel | ConnectorModel, tx, ty);
        }
        if (obj instanceof Selector) {
            this.preventConnectorsUpdate = false;
            for (let connectors of this.selectionConnectorsList) {
                this.updateConnectorProperties(this.nameTable[connectors.id]);
            }
            this.selectionConnectorsList = [];
        }
        if (!(this.diagramActions & DiagramAction.ToolAction)) {
            this.updateSelector();
        }
        if (this.mode === 'Canvas') {
            for (let temp of this.views) {
                let view: View;
                view = this.views[temp];
                this.refreshCanvasDiagramLayer(view);
            }
        }
    }

    /**
     * Scales the given objects by the given ratio
     * @param obj Defines the objects to be resized
     * @param sx Defines the ratio by which the objects have to be horizontally scaled
     * @param sy Defines the ratio by which the objects have to be vertically scaled
     * @param pivot Defines the reference point with respect to which the objects will be resized
     */
    public scale(obj: NodeModel | ConnectorModel | SelectorModel, sx: number, sy: number, pivot: PointModel): boolean {
        let checkBoundaryConstraints: boolean = true;
        if (obj instanceof Selector) {
            if (obj.nodes && obj.nodes.length) {
                for (let node of obj.nodes) {
                    checkBoundaryConstraints = this.commandHandler.scale(node, sx, sy, pivot, obj);
                }
            }
            if (obj.connectors && obj.connectors.length) {
                for (let conn of obj.connectors) {
                    this.commandHandler.scale(conn, sx, sy, pivot, obj);
                }
            }
            this.updateSelector();
        } else {
            this.commandHandler.scale(
                obj as NodeModel | ConnectorModel, sx, sy, pivot, ((obj as NodeModel).children ? obj as IElement : undefined));
        }
        return checkBoundaryConstraints;
    }
    /**
     * Rotates the given nodes/connectors by the given angle
     * @param obj Defines the objects to be rotated
     * @param angle Defines the angle by which the objects have to be rotated
     * @param pivot Defines the reference point with reference to which the objects have to be rotated
     */
    public rotate(obj: NodeModel | ConnectorModel | SelectorModel, angle: number, pivot?: PointModel): boolean {
        let checkBoundaryConstraints: boolean;
        if (obj) {
            pivot = pivot || { x: obj.wrapper.offsetX, y: obj.wrapper.offsetY };
            if (obj instanceof Selector) {
                obj.rotateAngle += angle;
                obj.wrapper.rotateAngle += angle;
                let bounds: Rect = getBounds(obj.wrapper);
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
            } else {
                this.commandHandler.rotateObjects(obj as NodeModel, [obj] as (NodeModel | ConnectorModel)[], angle, pivot);
            }
        }
        return checkBoundaryConstraints;
    }
    /**
     * Moves the source point of the given connector
     * @param obj Defines the connector, the end points of which has to be moved
     * @param tx Defines the distance by which the end point has to be horizontally moved
     * @param ty Defines the distance by which the end point has to be vertically moved
     */
    public dragSourceEnd(obj: ConnectorModel, tx: number, ty: number): void {
        this.commandHandler.dragSourceEnd(obj, tx, ty);
    }

    /**
     * Moves the target point of the given connector
     * @param obj Defines the connector, the end points of which has to be moved
     * @param tx Defines the distance by which the end point has to be horizontally moved
     * @param ty Defines the distance by which the end point has to be vertically moved
     */
    public dragTargetEnd(obj: ConnectorModel, tx: number, ty: number): void {
        this.commandHandler.dragTargetEnd(obj, tx, ty);
    }

    /**
     * Finds all the objects that is under the given mouse position
     * @param position Defines the position, the objects under which has to be found
     * @param source Defines the object, the objects under which has to be found
     */
    public findObjectsUnderMouse(position: PointModel, source?: IElement): IElement[] {
        return this.eventHandler.findObjectsUnderMouse(position, source);
    }

    /**
     * Finds the object that is under the given mouse position
     * @param objects Defines the collection of objects, from which the object has to be found.
     * @param action Defines the action, using which the relevant object has to be found.
     * @param inAction Defines the active state of the action.
     */
    public findObjectUnderMouse(
        objects: (NodeModel | ConnectorModel)[], action: Actions, inAction: boolean): IElement {
        return this.eventHandler.findObjectUnderMouse(objects, action, inAction);
    }

    /**
     * Finds the object that is under the given active object (Source)
     * @param objects Defines the collection of objects, from which the object has to be found.
     * @param action Defines the action, using which the relevant object has to be found.
     * @param inAction Defines the active state of the action.
     */
    public findTargetObjectUnderMouse(
        objects: (NodeModel | ConnectorModel)[], action: Actions, inAction: boolean, position: PointModel, source?: IElement): IElement {
        return this.eventHandler.findTargetUnderMouse(objects, action, inAction, position, source);
    }

    /**
     * Finds the child element of the given object at the given position
     * @param obj Defines the object, the child element of which has to be found
     * @param position Defines the position, the child element under which has to be found
     */
    public findElementUnderMouse(obj: IElement, position: PointModel): DiagramElement {
        return this.eventHandler.findElementUnderMouse(obj, position);
    }

    /**
     * Defines the action to be done, when the mouse hovers the given element of the given object
     * @param obj Defines the object under mouse
     * @param wrapper Defines the target element of the object under mouse
     * @param position Defines the current mouse position
     * @private
     */
    public findActionToBeDone(
        obj: NodeModel | ConnectorModel, wrapper: DiagramElement, position: PointModel,
        target?: NodeModel | PointPortModel | ShapeAnnotationModel | PathAnnotationModel): Actions {
        return this.eventHandler.findActionToBeDone(obj, wrapper, position, target);
    }

    /**
     * Returns the tool that handles the given action
     * @param action Defines the action that is going to be performed
     */
    public getTool(action: string): ToolBase {
        let tool: ToolBase;
        let getCustomTool: Function = getFunction(this.getCustomTool);
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
     * @param action Defines the action that is going to be performed
     */
    public getCursor(action: string, active: boolean): string {
        let cursor: string;
        let getCustomCursor: Function = getFunction(this.getCustomCursor);
        if (getCustomCursor) {
            cursor = getCustomCursor(action as Actions, active);
            if (cursor) {
                return cursor;
            }
        }
        return this.eventHandler.getCursor(action as Actions);
    }

    /**
     * Initializes the undo redo actions
     * @private
     */
    public initHistory(): void {
        if (this.undoRedoModule) {
            this.undoRedoModule.initHistory(this);
        }
    }

    /**
     * Adds the given change in the diagram control to the track
     * @param entry Defines the entry/information about a change in diagram
     */
    public addHistoryEntry(entry: HistoryEntry): void {
        if (this.undoRedoModule && (this.constraints & DiagramConstraints.UndoRedo) && !this.currentSymbol) {
            this.undoRedoModule.addHistoryEntry(entry, this);
            if (entry.type !== 'StartGroup' && entry.type !== 'EndGroup') {
                this.historyChangeTrigger(entry);
            }
        }
    }

    /** @private */
    public historyChangeTrigger(entry: HistoryEntry): void {
        let change: {} = {};
        let oldValue: string = 'oldValue';
        let newValue: string = 'newValue';
        let type: string = 'type';
        let source: (NodeModel | ConnectorModel)[] = [];
        if (entry && entry.redoObject && (((entry.redoObject as SelectorModel).nodes) instanceof Array) &&
            (((entry.redoObject as SelectorModel).connectors) instanceof Array)) {
            source = ((entry.redoObject as SelectorModel).nodes as object[]).concat((entry.redoObject as SelectorModel).connectors);
        } else {
            if (entry.redoObject) {
                source.push((entry.redoObject as NodeModel));
            }
        }
        change[type] = entry.type;
        switch (entry.type) {
            case 'PositionChanged':
                change[oldValue] = { offsetX: (entry.undoObject as NodeModel).offsetX, offsetY: (entry.undoObject as NodeModel).offsetY };
                change[newValue] = { offsetX: (entry.redoObject as NodeModel).offsetX, offsetY: (entry.redoObject as NodeModel).offsetY };
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
                change[oldValue] = { offsetX: (entry.undoObject as NodeModel).offsetX, offsetY: (entry.undoObject as NodeModel).offsetY };
                change[newValue] = { offsetX: (entry.redoObject as NodeModel).offsetX, offsetY: (entry.redoObject as NodeModel).offsetY };
                break;
        }
        let arg: IHistoryChangeArgs = {
            cause: entry.category, source: source, change: change
        };
        if (source.length) {
            this.triggerEvent(DiagramEvent.historyChange, arg);
        }
    }

    /**
     * Starts grouping the actions that will be undone/restored as a whole
     */
    public startGroupAction(): void {
        let entry: HistoryEntry = { type: 'StartGroup', category: 'Internal' };
        this.addHistoryEntry(entry);
    }

    /**
     * Closes grouping the actions that will be undone/restored as a whole
     */
    public endGroupAction(): void {
        let entry: HistoryEntry = { type: 'EndGroup', category: 'Internal' };
        this.addHistoryEntry(entry);
    }

    /**
     * Restores the last action that is performed
     */
    public undo(): void {
        if (this.undoRedoModule && (this.constraints & DiagramConstraints.UndoRedo)) {
            this.undoRedoModule.undo(this);
        }
    }

    /**
     * Restores the last undone action
     */
    public redo(): void {
        if (this.undoRedoModule && (this.constraints & DiagramConstraints.UndoRedo)) {
            this.undoRedoModule.redo(this);
        }
    }

    /**
     * Aligns the group of objects to with reference to the first object in the group
     * @param objects Defines the objects that have to be aligned
     * @param option Defines the factor, by which the objects have to be aligned
     */
    public align(option: AlignmentOptions, objects?: (NodeModel | ConnectorModel)[], type?: AlignmentMode): void {
        if (!objects) {
            objects = [];
            objects = objects.concat(this.selectedItems.nodes, this.selectedItems.connectors);
        }
        this.diagramActions = this.diagramActions | DiagramAction.PublicMethod;
        this.commandHandler.align(objects, option, (type ? type : 'Object'));
    }

    /**
     * Arranges the group of objects with equal intervals, but within the group of objects
     * @param objects Defines the objects that have to be equally spaced
     * @param option Defines the factor to distribute the shapes
     */
    public distribute(option: DistributeOptions, objects?: (NodeModel | ConnectorModel)[]): void {
        if (!objects) {
            objects = [];
            objects = objects.concat(this.selectedItems.nodes, this.selectedItems.connectors);
        }
        this.diagramActions = this.diagramActions | DiagramAction.PublicMethod;
        this.commandHandler.distribute(objects, option);
    }

    /**
     * Scales the given objects to the size of the first object in the group
     * @param objects Defines the collection of objects that have to be scaled
     * @param option Defines whether the node has to be horizontally scaled, vertically scaled or both
     */
    public sameSize(option: SizingOptions, objects?: (NodeModel | ConnectorModel)[]): void {
        if (!objects) {
            objects = [];
            objects = objects.concat(this.selectedItems.nodes, this.selectedItems.connectors);
        }
        this.diagramActions = this.diagramActions | DiagramAction.PublicMethod;
        this.commandHandler.sameSize(objects, option);
    }

    /**
     * Scales the diagram control by the given factor
     * @param factor Defines the factor by which the diagram is zoomed
     * @param focusedPoint Defines the point with respect to which the diagram has to be zoomed
     */
    public zoom(factor: number, focusedPoint?: PointModel): void {
        this.scroller.zoom(factor, 0, 0, focusedPoint);
    }

    /**
     * Scales the diagram control by the given factor
     * @param options used to define the zoom factor, focus point and zoom type.
     *
     */
    public zoomTo(options: ZoomOptions): void {
        let factor: number = options.zoomFactor ? options.zoomFactor : 0.2;
        factor = options.type === 'ZoomOut' ? 1 / (1 + factor) : (1 + factor);
        this.scroller.zoom(factor, 0, 0, options.focusPoint);
    }

    /**
     * Pans the diagram control to the given horizontal and vertical offsets
     * @param horizontalOffset Defines the horizontal distance to which the diagram has to be scrolled
     * @param verticalOffset Defines the vertical distance to which the diagram has to be scrolled
     */
    public pan(horizontalOffset: number, verticalOffset: number, focusedPoint?: PointModel): void {
        this.scroller.zoom(1, horizontalOffset, verticalOffset, focusedPoint);
    }

    /**
     * Resets the zoom and scroller offsets to default values
     */
    public reset(): void {
        this.scroller.zoom(
            1 / this.scroller.currentZoom, -this.scroller.horizontalOffset, -this.scroller.verticalOffset,
            { x: 0, y: 0 });
    }

    /** @private */
    public triggerEvent(eventName: DiagramEvent, args: Object): void {
        if (args) {
            this.updateEventValue(args as IDropEventArgs);
        }
        this.trigger(DiagramEvent[eventName], args);
    }

    private updateEventValue(args: IDropEventArgs): void {
        let element: NodeModel | ConnectorModel | SelectorModel = args.element;
        if ((args as IDropEventArgs).element && element instanceof Selector && (element.nodes.length + element.connectors.length === 1)) {
            args.element = (element.nodes.length === 1) ? element.nodes[0] : element.connectors[0];
        }
    }
    /**
     * Adds the given object to diagram control
     * @param obj Defines the object that has to be added to diagram
     */
    public add(obj: NodeModel | ConnectorModel, group?: boolean): Node | Connector {
        let newObj: Node | Connector;
        if (obj) {
            obj = cloneObject(obj);
            let args: ICollectionChangeEventArgs = {
                element: obj, cause: this.diagramActions, state: 'Changing', type: 'Addition', cancel: false
            };
            this.triggerEvent(DiagramEvent.collectionChange, args);
            let activeLayer: LayerModel;
            this.diagramActions = this.diagramActions | DiagramAction.PublicMethod;
            obj.id = obj.id || randomId();
            let layers: LayerModel = this.activeLayer;
            if (!args.cancel && !layers.lock) {
                if (layers.objects.indexOf(obj.id) < 0 && !layers.lock) {
                    if (!layers.visible) {
                        layers.visible = true;
                        this.dataBind();
                    }
                    layers.objects.push(obj.id);
                }
                if (getObjectType(obj) === Connector) {
                    newObj = new Connector(this, 'connectors', obj, true);
                    (this.connectors as Connector[]).push(newObj);
                    this.initObject(newObj);
                    if (obj.visible === false) {
                        this.updateElementVisibility(newObj.wrapper, newObj, obj.visible);
                    }
                    this.updateEdges(newObj);
                } else {
                    newObj = new Node(this, 'nodes', obj, true);
                    //  newObj.processId = (obj as Node).processId;
                    (this.nodes as Node[]).push(newObj);
                    this.initObject(newObj, layers, undefined, group);
                    if (this.bpmnModule) {
                        if ((newObj.shape as BpmnShape).annotations && (newObj.shape as BpmnShape).annotations.length !== 0) {
                            for (let obj of this.bpmnModule.getTextAnnotationConn(newObj)) {
                                this.initConnectors(obj as Connector, layers, false);
                            }
                        }
                        if ((newObj.shape as BpmnShape).activity && (newObj.shape as BpmnShape).activity.subProcess.processes &&
                            (newObj.shape as BpmnShape).activity.subProcess.processes.length) {
                            this.bpmnModule.updateDocks(newObj, this);
                        }
                    }
                }
                args = {
                    element: newObj, cause: this.diagramActions, state: 'Changed', type: 'Addition', cancel: false
                };
                this.triggerEvent(DiagramEvent.collectionChange, args);
                if (!(this.diagramActions & DiagramAction.UndoRedo) && !(this.diagramActions & DiagramAction.Group)) {
                    let entry: HistoryEntry = {
                        type: 'CollectionChanged', changeType: 'Insert', undoObject: cloneObject(obj),
                        redoObject: cloneObject(obj), category: 'Internal'
                    };
                    this.addHistoryEntry(entry);
                }
                if (this.mode === 'SVG') {
                    this.updateSvgNodes(newObj as Node);
                    this.updateDiagramObject(newObj);
                    if ((newObj.shape as BpmnShape).activity && (newObj.shape as BpmnShape).activity.subProcess.processes &&
                        (newObj.shape as BpmnShape).activity.subProcess.processes.length) {
                        this.updateProcesses(newObj);
                    }
                    this.updateBridging();
                }
            }
        }
        this.resetDiagramActions(DiagramAction.PublicMethod);
        return newObj;
    }
    private updateSvgNodes(node: Node): void {
        if (node.children) {
            for (let j of node.children) {
                if (this.nameTable[j] && this.nameTable[j].parentId) {
                    let child: HTMLElement = getDiagramElement(j + '_groupElement', this.element.id);
                    child.parentNode.removeChild(child);
                }
            }
        }
    }
    /** @private */
    public updateProcesses(node: (Node | Connector)): void {
        if (this.bpmnModule && node && node.shape && (node.shape as BpmnShape).activity &&
            (node.shape as BpmnShape).activity.subProcess.processes &&
            (node.shape as BpmnShape).activity.subProcess.processes.length) {
            let processes: string[] = (node.shape as BpmnShape).activity.subProcess.processes;
            this.moveSvgNode(node.id);
            for (let j of processes) {
                this.moveSvgNode(j);
                let edges: string[] = [];
                edges = edges.concat(this.nameTable[j].outEdges, this.nameTable[j].inEdges);
                for (let i: number = edges.length - 1; i >= 0; i--) {
                    this.moveSvgNode(edges[i]);
                }
            }
            for (let j of processes) {
                if ((this.nameTable[j].shape as BpmnShape).activity.subProcess.processes &&
                    (this.nameTable[j].shape as BpmnShape).activity.subProcess.processes.length) {
                    this.updateProcesses(this.nameTable[j]);
                }
            }
        } else {
            this.moveSvgNode(node.id);
        }
    }
    /** @private */
    public moveSvgNode(nodeId: string): void {
        let child: HTMLElement = getDiagramElement(nodeId + '_groupElement', this.element.id);
        let parent: HTMLElement = child.parentElement;
        child.parentNode.removeChild(child);
        parent.appendChild(child);
    }

    /**
     * Adds the given annotation to the given node
     * @param annotation Defines the annotation to be added
     * @param node Defines the node to which the annotation has to be added
     */
    public addTextAnnotation(annotation: BpmnAnnotationModel, node: NodeModel): void {
        if (this.bpmnModule) {
            let connector: Connector = this.bpmnModule.addAnnotation(node, annotation, this) as Connector;
            this.initConnectors(connector, this.commandHandler.getObjectLayer(node.id), false);
            this.updateDiagramObject(node);
            if (!(this.diagramActions & DiagramAction.UndoRedo) && !(this.diagramActions & DiagramAction.Group)) {
                let entry: HistoryEntry = {
                    type: 'CollectionChanged', changeType: 'Insert', undoObject: cloneObject(annotation),
                    redoObject: cloneObject(annotation), category: 'Internal'
                };
                this.addHistoryEntry(entry);
            }
        }
    }

    /**
     * Splice the InEdge and OutEdge of the for the node with respect to corresponding connectors that is deleting
     */
    private spliceConnectorEdges(connector: ConnectorModel, isSource: boolean): void {
        let node: Node;
        let edges: string[] = [];
        node = isSource ? this.nameTable[connector.sourceID] : this.nameTable[connector.targetID];
        if (node) {
            edges = isSource ? node.outEdges : node.inEdges;
            for (let i: number = edges.length - 1; i >= 0; i--) {
                if (edges[i] === connector.id) {
                    edges.splice(i, 1);
                }
            }
        }
    }

    /**
     * Remove the dependent connectors if the node is deleted
     * @private
     */
    public removeDependentConnector(node: Node): void {
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

    /** @private */
    public removeObjectsFromLayer(obj: (NodeModel | ConnectorModel)): void {
        let layer: number = this.layers.indexOf(this.commandHandler.getObjectLayer(obj.id));
        let objects: string[] = this.layers[layer].objects;
        let objIndex: number = objects.indexOf(obj.id);
        if (objIndex > -1) {
            if (isSelected(this, obj)) {
                this.unSelect(obj);
            }
            this.layers[layer].objects.splice(objIndex, 1);
            delete (this.layers[layer] as Layer).zIndexTable[this.nameTable[obj.id].zIndex];
        }
    }

    /** @private */
    public removeElements(currentObj: NodeModel | ConnectorModel): void {
        if (this.mode === 'SVG' || (this.mode === 'Canvas' && currentObj.shape.type === 'Native')) {
            let removeElement: HTMLElement = getDiagramElement(currentObj.id + '_groupElement', this.element.id);
            if (removeElement) {
                removeElement.parentNode.removeChild(removeElement);
            }
        }
        this.refreshCanvasLayers();
        let children: DiagramElement[] = currentObj.wrapper.children;
        let element: HTMLElement;
        let view: View;
        for (let i: number = 0; i < children.length; i++) {
            if (children[i] instanceof DiagramNativeElement || ((children[i].id) && (children[i].id).indexOf('icon_content') > 0)) {
                if ((children[i].id).indexOf('icon_content') > 0 && this.mode === 'SVG') {
                    element = getDiagramElement(children[i].id + '_shape_groupElement', this.element.id);
                    element.parentNode.removeChild(element);
                    element = getDiagramElement(children[i].id + '_rect_groupElement', this.element.id);
                    element.parentNode.removeChild(element);
                }
                for (let elementId of this.views) {
                    removeElement(children[i].id + '_groupElement', elementId);
                }
            } else if (children[i] instanceof DiagramHtmlElement) {
                for (let elementId of this.views) {
                    removeElement(children[i].id + '_html_element', elementId);
                }
            }
        }
    }

    private removeCommand(): void {
        this.remove();
    }
    /**
     * Removes the given object from diagram
     * @param obj Defines the object that has to be removed from diagram
     */
    /* tslint:disable */
    public remove(obj?: NodeModel | ConnectorModel): void {
        let selectedItems: (NodeModel | ConnectorModel)[] = [];
        selectedItems = selectedItems.concat(this.selectedItems.nodes, this.selectedItems.connectors);
        let args: ICollectionChangeEventArgs;
        let groupAction: boolean = false;
        if (obj) {
            obj = this.nameTable[obj.id];
            if (obj && (canDelete(obj) || (this.diagramActions & DiagramAction.Clear))) {
                args = {
                    element: obj, cause: this.diagramActions,
                    state: 'Changing', type: 'Removal', cancel: false
                };
                if (!(this.diagramActions & DiagramAction.Clear)) {
                    this.triggerEvent(DiagramEvent.collectionChange, args);
                }
                if (!args.cancel) {
                    if (this.bpmnModule) {
                        if (this.bpmnModule.checkAndRemoveAnnotations(obj as NodeModel, this)) {
                            this.refreshCanvasLayers();
                            return;
                        }
                    }
                    if ((!(this.diagramActions & DiagramAction.UndoRedo)) &&
                        (obj instanceof Node || obj instanceof Connector)) {
                        let entry: HistoryEntry = {
                            type: 'CollectionChanged', changeType: 'Remove', undoObject: cloneObject(obj),
                            redoObject: cloneObject(obj), category: 'Internal'
                        };
                        if (!(this.diagramActions & DiagramAction.Clear)) {
                            if (selectedItems.length > 0 && this.undoRedoModule && !this.layout.type) {
                                this.historyList.startGroupAction();
                                groupAction = true;
                            }
                        }
                        if (obj instanceof Node) {
                            this.removeDependentConnector(obj);
                        }
                        if (!(this.diagramActions & DiagramAction.Clear)) {
                            this.addHistoryEntry(entry);
                        }
                    }

                    if ((obj as Node).children) {
                        this.deleteGroup(obj as Node);
                    }
                    if ((obj as Node | Connector).parentId) {
                        this.deleteChild(obj);
                    }
                    let index: number;
                    this.diagramActions = this.diagramActions | DiagramAction.PublicMethod;
                    let currentObj: NodeModel | ConnectorModel = this.nameTable[obj.id];
                    if (currentObj instanceof Node) {
                        if (currentObj.shape.type === 'Bpmn' && this.bpmnModule) {
                            this.bpmnModule.removeBpmnProcesses(currentObj, this);
                        }
                        index = (this.nodes as NodeModel[]).indexOf(currentObj);
                        if (index !== -1) {
                            this.nodes.splice(index, 1);
                            this.updateNodeEdges(currentObj);
                        }
                    } else {
                        index = this.connectors.indexOf(currentObj as ConnectorModel);
                        if (index !== -1) {
                            this.connectors.splice(index, 1);
                        }
                        this.updateEdges(currentObj as Connector);
                        this.spliceConnectorEdges(obj as ConnectorModel, true);
                        this.spliceConnectorEdges(obj as ConnectorModel, false);
                    }
                    if (groupAction) {
                        this.historyList.endGroupAction();
                    }
                    if (isSelected(this, currentObj)) {
                        this.unSelect(currentObj);
                    }
                    this.removeObjectsFromLayer(obj);
                    if (this.currentDrawingObject) {
                        this.currentDrawingObject.wrapper = undefined;
                    }

                    delete this.nameTable[obj.id];
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
                        this.triggerEvent(DiagramEvent.collectionChange, args);
                        this.resetTool();
                    }
                }
            }
        } else if (selectedItems.length > 0) {
            if (this.undoRedoModule) {
                this.historyList.startGroupAction();
                groupAction = true;
            }
            for (let i: number = 0; i < selectedItems.length; i++) {
                let node: Node = selectedItems[i] as Node;
                if (this.nameTable[selectedItems[i].id]) {
                    if ((selectedItems[i] instanceof Connector) && this.bpmnModule &&
                        this.bpmnModule.textAnnotationConnectors.indexOf(selectedItems[i] as Connector) > -1) {
                        this.remove(this.nameTable[(selectedItems[i] as Connector).targetID]);
                        return;
                    }
                    this.remove(selectedItems[i]);
                }
            }
            if (groupAction) {
                this.historyList.endGroupAction();
            }
            this.clearSelection();
        }
    }
    /* tslint:enable */


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
                    parentNode.wrapper.children.splice(i, 1);
                }
            }
            parentNode.wrapper.measure(new Size());
            parentNode.wrapper.arrange(parentNode.wrapper.desiredSize);
        }
    }

    /** @private  */
    public addChild(node: NodeModel, child: string | NodeModel | ConnectorModel): void {
        let id: string;
        let parentNode: NodeModel = this.nameTable[node.id];
        if (parentNode.children) {
            if (typeof child === 'string') {
                if (this.nameTable[child]) {
                    id = child;
                }
            } else {
                id = child.id = child.id || randomId();
                this.add(child);
            }
            if (id) {
                let childNode: NodeModel = this.nameTable[id];
                (childNode as Node).parentId = parentNode.id;
                parentNode.children.push(id);
                parentNode.wrapper.children.push(this.nameTable[id].wrapper);
                parentNode.wrapper.measure(new Size());
                parentNode.wrapper.arrange(parentNode.wrapper.desiredSize);
            }
        }

    }

    /**
     * Clears all nodes and objects in the diagram
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
        for (let obj of objects) {
            if (this.nameTable[obj.id]) {
                this.remove(obj);
            }
        }
        this.diagramActions = this.diagramActions & ~DiagramAction.Clear;
        this.spatialSearch = new SpatialSearch(this.nameTable);
        this.initHistory();
    }

    private startEditCommad(): void {
        this.startTextEdit();
    }
    /**
     * Specified annotation to edit mode
     * @param node Defines node/connector that contains the annotation to be edited
     * @param id Defines annotation id to be edited in the node
     */
    public startTextEdit(node?: NodeModel | ConnectorModel, id?: string): void {
        if (!canZoomPan(this) || canSingleSelect(this)) {
            this.textEditing = true;
            let transform: TransformFactor = this.scroller.transform;
            let scale: number = canZoomTextEdit(this) ? transform.scale : 1;
            let minWidth: number = 90;
            let text: string; let bounds: Size; let attributes: Object;
            let x: number; let y: number; let textWrapper: DiagramElement;
            if (!node) {
                node = (this.selectedItems.nodes[0]) ? this.selectedItems.nodes[0] : this.selectedItems.connectors[0];
            }
            if (node) {
                let bpmnAnnotation: boolean = false;
                if (this.bpmnModule) {
                    textWrapper = this.bpmnModule.getTextAnnotationWrapper(node as NodeModel, id);
                    if (textWrapper) {
                        node = this.nameTable[node.id.split('_textannotation_')[0]];
                    }
                }
                if (!textWrapper) {
                    if (node.shape.type !== 'Text' && node.annotations.length === 0) {
                        this.activeLabel.isGroup = true;
                        this.startGroupAction();
                        this.addLabels(node as Node, [{ id: randomId(), content: '' }]);
                    }
                    if (!id && ((node.shape.type !== 'Text' && node.annotations.length > 0) || (node.shape.type === 'Text'))) {
                        id = (node.shape.type === 'Text') ? (node.wrapper.children[0].id).split('_')[1] : node.annotations[0].id;
                    }
                    if (id) {
                        textWrapper = this.getWrapper(node.wrapper, id);
                    }
                } else { bpmnAnnotation = true; }
                if (node && textWrapper &&
                    (!enableReadOnly(textWrapper, node) || bpmnAnnotation)) {
                    let style: TextStyleModel = ((textWrapper.style) as TextStyleModel);
                    let maxWidth: number;
                    maxWidth = textWrapper.bounds.width < node.wrapper.bounds.width ? textWrapper.bounds.width : node.wrapper.bounds.width;
                    maxWidth = minWidth > maxWidth ? minWidth : maxWidth;
                    let textEditing: HTMLElement = document.getElementById(this.element.id + '_editTextBoxDiv');
                    let textArea: HTMLTextAreaElement = document.getElementById(this.element.id + '_editBox') as HTMLTextAreaElement;
                    text = textArea ? textArea.value : (textWrapper as TextElement).content;
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
                    bounds.width = Math.max(bounds.width, 50);
                    x = ((((textWrapper.bounds.center.x + transform.tx) * transform.scale) - (bounds.width / 2) * scale) - 2.5);
                    y = ((((textWrapper.bounds.center.y + transform.ty) * transform.scale) - (bounds.height / 2) * scale) - 3);
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
                    this.activeLabel.parentId = node.id;
                    this.activeLabel.id = id;
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
    private updateNodeExpand(node: Node, visibility: boolean): void {
        for (let i: number = 0; i < node.outEdges.length; i++) {
            let connector: Connector = this.nameTable[node.outEdges[i]];
            let target: Node = this.nameTable[connector.targetID];
            connector.visible = visibility;
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

    /**
     * Automatically updates the diagram objects based on the type of the layout
     */
    public doLayout(): ILayout {
        let update: boolean = false;
        let layout: ILayout;
        let propChange: boolean = this.isProtectedOnChange;
        this.protectPropertyChange(true);
        let viewPort: PointModel = { x: this.scroller.viewPortWidth, y: this.scroller.viewPortHeight };
        if (this.organizationalChartModule) {
            layout = this.organizationalChartModule.updateLayout(
                this.nodes as INode[], this.nameTable, this.layout as Layout, viewPort, this.dataSourceSettings.id);
            update = true;
            if (this.layoutAnimateModule && layout.rootNode && !this.diagramActions) {
                this.updateNodeExpand(layout.rootNode as Node, layout.rootNode.isExpanded);
            }
        } else if (this.mindMapChartModule) {
            this.mindMapChartModule.updateLayout(
                this.nodes as INode[], this.nameTable, this.layout as Layout,
                viewPort, this.dataSourceSettings.id, this.dataSourceSettings.root);
            update = true;

        } else if (this.radialTreeModule) {
            this.radialTreeModule.updateLayout(
                this.nodes as INode[], this.nameTable, this.layout as Layout,
                viewPort);
            update = true;
        } else if (this.symmetricalLayoutModule) {
            this.symmetricalLayoutModule.maxIteration = this.layout.maxIteration;
            this.symmetricalLayoutModule.springLength = this.layout.springLength;
            this.symmetricalLayoutModule.springFactor = this.layout.springFactor;
            this.symmetricalLayoutModule.updateLayout(
                this.nodes as IGraphObject[], this.connectors as IGraphObject[],
                this.symmetricalLayoutModule, this.nameTable, this.layout as Layout, viewPort);
            update = true;
        } else if (this.complexHierarchicalTreeModule) {
            this.complexHierarchicalTreeModule.doLayout(
                this.nodes as INode[], this.nameTable, this.layout as Layout, viewPort);
            update = true;
        }

        if (update) {
            this.preventUpdate = true;
            let connectors: Object = {};
            for (let obj of this.nodes) {
                let node: Node = obj as Node;
                if (!this.preventNodesUpdate) {
                    this.updateIcon(node);
                    this.updateDefaultLayoutIcons(node);
                }
                this.nodePropertyChange(node, {} as Node, { offsetX: node.offsetX, offsetY: node.offsetY } as Node, true);
                node.wrapper.measure(new Size(node.wrapper.width, node.wrapper.height));
                node.wrapper.arrange(node.wrapper.desiredSize);
                this.updateDiagramObject(node);
                if (node.inEdges.length > 0) {
                    for (let j: number = 0; j < node.inEdges.length; j++) {
                        let connector: Connector = this.nameTable[node.inEdges[j]];
                        connectors[connector.id] = connector;
                    }
                }
                if (node.outEdges.length > 0) {
                    for (let k: number = 0; k < node.outEdges.length; k++) {
                        let connection: Connector = this.nameTable[node.outEdges[k]];
                        connectors[connection.id] = connection;
                    }
                }
            }

            for (let conn of Object.keys(connectors)) {
                let connector: Connector = connectors[conn] as Connector;
                let points: PointModel[] = this.getPoints(connector);
                updateConnector(connector, points);
                connector.wrapper.measure(new Size(undefined, undefined));
                connector.wrapper.arrange(connector.wrapper.desiredSize);
                this.updateQuad(connector);
                this.updateDiagramObject(connector);
            }
            this.preventUpdate = false;
            this.updatePage();
            if ((!(this.diagramActions & DiagramAction.Render)) || this.mode === 'Canvas') {
                this.refreshDiagramLayer();
            }
        }
        if (!propChange) {
            this.protectPropertyChange(propChange);
        }
        return layout;
    }
    /**
     * Serializes the diagram control as a string
     */
    public saveDiagram(): string {
        return serialize(this);
    }
    /**
     * Converts the given string as a Diagram Control
     * @param data Defines the behavior of the diagram to be loaded
     */
    public loadDiagram(data: string): Object {
        return deserialize(data, this);
    }

    /**
     * To export Diagram
     * @param options defines the how the image to be exported.
     */
    public exportDiagram(options: IExportOptions): string | SVGElement {
        if (this.printandExportModule) {
            let data: string | SVGElement = this.printandExportModule.exportDiagram(options);
            return data;
        }
        return '';
    }

    /**
     * To print Diagram
     * @param optons defines how the image to be printed.
     */

    public print(options: IPrintOptions): void {
        if (this.printandExportModule) {
            this.printandExportModule.print(options);
        }
    }

    /**
     * Add ports at the run time
     */
    public addPorts(obj: NodeModel, ports: PointPortModel[]): void {
        this.protectPropertyChange(true);
        let newObj: PointPort;
        if (ports.length > 1) {
            this.startGroupAction();
        }
        for (let i: number = 0; i < ports.length; i++) {
            newObj = new PointPort(obj, 'ports', ports[i], true);
            obj.ports.push(newObj);
            if (obj.children) {
                let container: Container = obj.wrapper;
                (obj as Node).initPorts(this.getDescription, (obj.wrapper.children[container.children.length - 1] as Container));
            } else {
                let canvas: Container = obj.wrapper;
                canvas.children.push((obj as Node).initPortWrapper(obj.ports[obj.ports.length - 1] as Port));
            }
            if (!(this.diagramActions & DiagramAction.UndoRedo) && !(this.diagramActions & DiagramAction.Group)) {
                let entry: HistoryEntry = {
                    type: 'PortCollectionChanged', changeType: 'Insert', undoObject: cloneObject(newObj),
                    redoObject: cloneObject(obj), category: 'Internal'
                };
                this.addHistoryEntry(entry);
            }
        }
        if (ports.length > 1) {
            this.endGroupAction();
        }
        obj.wrapper.measure(new Size(obj.width, obj.height));
        obj.wrapper.arrange(obj.wrapper.desiredSize);
        this.updateDiagramObject(obj);
        this.protectPropertyChange(false);
    }

    /**
     * Add constraints at run time
     */
    public addConstraints(constraintsType: number, constraintsValue: number): number {
        return constraintsType | constraintsValue;
    }

    /**
     * Remove constraints at run time
     */
    public removeConstraints(constraintsType: number, constraintsValue: number): number {
        return constraintsType & ~constraintsValue;
    }

    /**
     * Add Labels at the run time
     */
    public addLabels(obj: NodeModel | ConnectorModel, labels: ShapeAnnotationModel[] | PathAnnotation[] | PathAnnotationModel[]): void {
        this.protectPropertyChange(true);
        let canvas: Container = obj.wrapper; let newObj: ShapeAnnotation | PathAnnotation;
        if (labels.length > 1) {
            this.startGroupAction();
        }
        for (let i: number = 0; i < labels.length; i++) {
            if (obj instanceof Node) {
                newObj = new ShapeAnnotation(obj, 'annotations', labels[i], true);
                (obj as Node).annotations.push(newObj);
                if ((obj as Node).children) {
                    let node: Node = (obj as Node);
                    for (let i: number = 0; i < node.wrapper.children.length; i++) {
                        if (node.wrapper.children[i].id === 'group_container') {
                            let container: Container = node.wrapper.children[i] as Container;
                            container.children.push(obj.initAnnotationWrapper(obj.annotations[obj.annotations.length - 1] as Annotation));
                        }
                    }
                } else {
                    canvas.children.push(obj.initAnnotationWrapper(obj.annotations[obj.annotations.length - 1] as Annotation));
                }
            } else if (obj instanceof Connector) {
                newObj = new PathAnnotation(obj, 'annotations', labels[i], true);
                (obj as Connector).annotations.push(newObj as PathAnnotation);
                let segment: DiagramElement = canvas.children[0];
                let bounds: Rect = new Rect(
                    segment.offsetX - segment.width / 2,
                    segment.offsetY - segment.height / 2, segment.width, segment.height);
                canvas.children.push(obj.getAnnotationElement(
                    obj.annotations[obj.annotations.length - 1] as PathAnnotation, obj.intermediatePoints, bounds, this.getDescription));
            }
            if (!(this.diagramActions & DiagramAction.UndoRedo) && !(this.diagramActions & DiagramAction.Group)) {
                let entry: HistoryEntry = {
                    type: 'LabelCollectionChanged', changeType: 'Insert', undoObject: cloneObject(newObj),
                    redoObject: cloneObject(obj), category: 'Internal'
                };
                this.addHistoryEntry(entry);
            }
        }
        if (labels.length > 1) {
            this.endGroupAction();
        }
        obj.wrapper.measure(new Size(canvas.width, canvas.height));
        obj.wrapper.arrange(canvas.desiredSize);
        this.updateDiagramObject(obj);
        this.protectPropertyChange(false);
    }

    private removelabelExtension(
        obj: Node | ConnectorModel, labels: ShapeAnnotationModel[] | PathAnnotationModel[],
        j: number, wrapper: DiagramElement):
        void {
        for (let i: number = 0; i < (wrapper as Container).children.length; i++) {
            let canvas: DiagramElement = (wrapper as Container).children[i];
            if (canvas instanceof TextElement) {
                if (canvas.id.match('_' + labels[j].id + '$')) {
                    for (let k: number = 0; k < obj.annotations.length; k++) {
                        if (canvas.id.match('_' + obj.annotations[k].id + '$')) {
                            if (!(this.diagramActions & DiagramAction.UndoRedo)) {
                                let entry: HistoryEntry = {
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
                            let element: HTMLElement = getDiagramElement(canvas.id, this.element.id);
                            element.parentNode.removeChild(element);
                        }
                        let textElement: HTMLElement = getDiagramElement(canvas.id + '_text', this.element.id);
                        if (textElement) {
                            element = getDiagramElement(canvas.id + '_text', this.element.id);
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
     * Remove Labels at the run time
     */
    public removeLabels(obj: Node | ConnectorModel, labels: ShapeAnnotationModel[] | PathAnnotationModel[]): void {
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
        obj: Node | ConnectorModel, ports: PointPortModel[],
        j: number, wrapper: DiagramElement):
        void {
        for (let i: number = 0; i < (wrapper as Container).children.length; i++) {
            let canvas: DiagramElement = (wrapper as Container).children[i];
            if (canvas instanceof PathElement) {
                if (canvas.id.match('_' + ports[j].id + '$')) {
                    for (let k: number = 0; k < obj.ports.length; k++) {
                        if (canvas.id.match('_' + obj.ports[k].id + '$')) {
                            if (!(this.diagramActions & DiagramAction.UndoRedo)) {
                                let entry: HistoryEntry = {
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
                        let element: HTMLElement = getDiagramElement(canvas.id, this.element.id);
                        element.parentNode.removeChild(element);
                    } else {
                        this.refreshCanvasLayers();
                    }
                }
            }
        }
    }

    /**
     * Remove Ports at the run time
     */
    public removePorts(obj: Node, ports: PointPortModel[]): void {
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


    //helper methods - start region

    /**
     * @private
     * @param real 
     * @param rulerSize 
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
            let position: Size = getRulerSize(this);
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
        let element: HTMLElement = document.getElementById(this.element.id + 'content');
        let width: String = this.getSizeValue(this.width, position.width);
        let height: String = this.getSizeValue(this.height, position.height);
        let style: string = this.rulerSettings.showRulers ?
            'width:' + width + '; height:' + height + ';' +
            'top:' + position.height + 'px;left:' + position.width + 'px;' +
            'overflow: scroll;position:absolute;overflow:auto;' :
            'width:' + width + '; height:' + height + ';position:absolute;' +
            ' left:0px;  top:0px;overflow: auto;';
        let attr: Object = {
            'id': this.element.id + 'content',
            'tabindex': '0',
            'style': style
        };
        if (!element) {
            this.diagramCanvas = createHtmlElement('div', attr);
            this.element.appendChild(this.diagramCanvas);
        } else {
            this.diagramCanvas = element;
            this.diagramCanvas.setAttribute('style', style);
        }
        this.diagramCanvas.style.background = this.backgroundColor as string;
    }

    private initDiagram(): void {
        this.intOffPageBackground();
        setAttributeHtml(this.element, {
            style: 'width:' + this.getSizeValue(this.width) + '; height:'
                + this.getSizeValue(this.height) + ';position:relative;overflow:hidden;'
        });
    };

    private renderBackgroundLayer(bounds: ClientRect, commonStyle: string): void {
        let bgLayer: SVGElement = this.createSvg(this.element.id + '_backgroundLayer_svg', bounds.width, bounds.height);
        bgLayer.setAttribute('style', commonStyle);
        let backgroundImage: SVGElement = createSvgElement('g', {
            'id': this.element.id + '_backgroundImageLayer',
            'class': 'e-background-image-layer'
        });
        bgLayer.appendChild(backgroundImage);
        let attr: Object = { 'id': this.element.id + '_backgroundLayer', 'class': 'e-background-layer' };
        let background: SVGElement = createSvgElement('g', attr);
        bgLayer.appendChild(background);
        this.diagramCanvas.appendChild(bgLayer);
    }

    private renderGridLayer(bounds: ClientRect, commonStyle: string): void {
        let svgGridSvg: SVGElement = this.createSvg(this.element.id + '_gridline_svg', bounds.width, bounds.height);
        svgGridSvg.setAttribute('class', 'e-grid-layer');
        let svgGrid: SVGElement = createSvgElement('g', { 'id': this.element.id + '_gridline', 'width': '100%', 'height': '100%' });
        let rect: SVGElement = createSvgElement('rect', {
            'id': this.element.id + '_grid_rect', 'x': '0', 'y': '0', 'width': '100%', 'height': '100%',
            'fill': 'url(#' + this.element.id + '_pattern)'
        });
        svgGrid.appendChild(rect);
        svgGridSvg.appendChild(svgGrid);
        this.diagramCanvas.appendChild(svgGridSvg);
        setAttributeSvg(svgGridSvg, { 'style': commonStyle });
    }

    private renderDiagramLayer(bounds: ClientRect, commonStyle: string): void {
        let attributes: Object = {
            'id': this.element.id + '_diagramLayer_div',
            'style': 'width:' + bounds.width + 'px; height:' + bounds.height + 'px;' + commonStyle
        };
        this.diagramLayerDiv = createHtmlElement('div', attributes);
        if (this.mode === 'SVG') {
            let diagramSvg: SVGElement = this.createSvg(this.element.id + '_diagramLayer_svg', bounds.width, bounds.height);
            diagramSvg.setAttribute('style', ' pointer-events: none; ');
            diagramSvg.setAttribute('class', 'e-diagram-layer');
            let diagramLayer: SVGElement = createSvgElement('g', { 'id': this.element.id + '_diagramLayer' });
            let transformationLayer: SVGElement = createSvgElement('g', {});
            this.diagramLayer = diagramLayer as SVGGElement;
            diagramLayer.setAttribute('style', 'pointer-events: all;');
            transformationLayer.appendChild(diagramLayer);
            diagramSvg.appendChild(transformationLayer);
            this.diagramLayerDiv.appendChild(diagramSvg);
        } else {
            this.diagramLayer = CanvasRenderer.createCanvas(this.element.id + '_diagram', bounds.width, bounds.height);
            this.diagramLayer.setAttribute('style', 'position:absolute;left:0px;top:0px;');
            this.diagramLayerDiv.appendChild(this.diagramLayer);
        }
        this.diagramCanvas.appendChild(this.diagramLayerDiv);
    }

    private initLayers(): void {
        let commonStyle: string = 'position:absolute;top:0px;left:0px;overflow:hidden;pointer-events:none;';
        let container: HTMLElement = document.getElementById(this.element.id);
        let bounds: ClientRect = container.getBoundingClientRect();
        let scrollerSize: number = getScrollerWidth();
        this.scroller.scrollerWidth = scrollerSize;
        this.scroller.setViewPortSize(bounds.width, bounds.height);
        this.renderRulers();
        createMeasureElements();
        // this.renderBackgroundImageLayer(bounds, commonStyle);
        this.renderBackgroundLayer(bounds, commonStyle);
        this.renderGridLayer(bounds, commonStyle);
        this.renderDiagramLayer(bounds, commonStyle);
        this.renderHTMLLayer(bounds, commonStyle);
        this.renderPortsExpandLayer(bounds, commonStyle);
        this.renderNativeLayer(bounds, commonStyle);
        this.renderAdornerLayer(bounds, commonStyle);
    }

    private renderAdornerLayer(bounds: ClientRect, commonStyle: string): void {
        let divElement: HTMLElement = createHtmlElement('div', {
            'id': this.element.id + '_diagramAdornerLayer',
            'style': 'width:' + bounds.width + 'px;height:' + bounds.height + 'px;' + commonStyle
        });
        let svgAdornerSvg: SVGElement = this.createSvg(this.element.id + '_diagramAdorner_svg', bounds.width, bounds.height);
        svgAdornerSvg.setAttribute('class', 'e-adorner-layer');
        svgAdornerSvg.setAttribute('style', 'pointer-events:none;');
        this.adornerLayer = createSvgElement('g', { 'id': this.element.id + '_diagramAdorner' });
        this.adornerLayer.setAttribute('style', ' pointer-events: all; ');
        svgAdornerSvg.appendChild(this.adornerLayer);
        divElement.appendChild(svgAdornerSvg);
        this.diagramCanvas.appendChild(divElement);
        let svgSelector: SVGElement = createSvgElement('g', { 'id': this.element.id + '_SelectorElement' });
        this.adornerLayer.appendChild(svgSelector);
        setAttributeSvg(svgAdornerSvg, { style: 'pointer-events:none;' });
    }

    private renderPortsExpandLayer(bounds: ClientRect, commonStyle: string): void {
        let svgPortsSvg: SVGElement = this.createSvg(this.element.id + '_diagramPorts_svg', bounds.width, bounds.height);
        svgPortsSvg.setAttribute('class', 'e-ports-expand-layer');
        let svgPortsLayer: SVGElement = createSvgElement('g', {
            'id': this.element.id + '_diagramPorts',
            'class': 'e-ports-layer',
            'style': 'pointer-events: all;'
        });
        svgPortsSvg.appendChild(svgPortsLayer);
        let svgExpandLayer: SVGElement = createSvgElement('g', {
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
        let htmlLayerDiv: HTMLElement = createHtmlElement('div', {
            'id': this.element.id + '_htmlLayer_div',
            'style': 'position:absolute;top:0px;left:0px;pointer-events:all;'
        });
        this.htmlLayer.appendChild(htmlLayerDiv);
        this.diagramCanvas.appendChild(this.htmlLayer);
    }

    private renderNativeLayer(bounds: ClientRect, commonStyle: string): void {
        let nativeLayerSvg: SVGElement = this.createSvg(this.element.id + '_nativeLayer_svg', bounds.width, bounds.height);
        let nativeLayer: SVGElement = createSvgElement('g', { 'id': this.element.id + '_nativeLayer', 'style': 'pointer-events:all;' });
        nativeLayerSvg.appendChild(nativeLayer);
        this.diagramLayerDiv.appendChild(nativeLayerSvg);
        setAttributeSvg(nativeLayerSvg, { 'class': 'e-native-layer', 'style': commonStyle });
    }

    /** @private */
    public createSvg(id: string, width: string | Number, height: string | Number): SVGElement {
        let svgObj: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        setAttributeSvg(svgObj, { 'id': id, 'width': width, 'height': height });
        return svgObj;
    }

    private initObjects(isLoad?: boolean): void {
        if (!this.isLoading) {
            this.initData();
        }
        this.initLayerObjects();
        this.updateBridging(isLoad);
    }

    /** @private */
    public initLayerObjects(): void {
        let hasLayers: boolean = this.layers.length > 1;
        let set: boolean = false;
        let connectors: Connector[] = [];
        let tempTabel: {} = {};
        let bpmnTable: {} = {};
        let tempNode: NodeModel[] = [];
        let groups: string[] = [];
        let i: number = 0;
        for (let obj of this.nodes) {
            obj.id = obj.id || randomId();
            this.addToLayer(obj, hasLayers);
            tempTabel[obj.id] = obj;
        }
        for (let obj of this.connectors) {
            obj.id = obj.id || randomId();
            this.addToLayer(obj, hasLayers);
            tempTabel[obj.id] = obj;
        }
        for (let layer of this.layers) {
            for (let obj of layer.objects) {
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
                        let connector: ConnectorModel = tempTabel[obj];
                        if (connector.sourceID && connector.targetID) {
                            let sourceNode: NodeModel = tempTabel[connector.sourceID];
                            let targetNode: NodeModel = tempTabel[connector.targetID];
                            if (sourceNode && sourceNode.wrapper && targetNode && targetNode.wrapper) {
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
                for (let obj of this.bpmnModule.textAnnotationConnectors) {
                    this.initConnectors(obj as Connector, layer, false);
                }
            }
        }
        for (let obj of Object.keys(bpmnTable)) {
            this.initObject(tempTabel[obj]);
            this.bpmnModule.updateDocks(tempTabel[obj], this);
        }
        for (let obj of groups) {
            let layer: LayerModel = this.commandHandler.getObjectLayer(obj);
            this.initNodes(tempTabel[obj], layer);
        }
        for (let connector of connectors) {
            let layer: LayerModel = this.commandHandler.getObjectLayer(connector.id);
            this.initConnectors(connector, layer);
        }
    }
    private addToLayer(obj: NodeModel | ConnectorModel, hasLayers: boolean): void {
        let layer: LayerModel;
        if (hasLayers) {
            layer = this.commandHandler.getObjectLayer(obj.id);
        }
        if (!hasLayers || !layer) {
            if (this.activeLayer.objects.indexOf(obj.id) === -1) {
                this.activeLayer.objects.push(obj.id);
            }
        }
        this.setZIndex(layer || this.activeLayer, obj);
    }
    private updateLayer(newProp: DiagramModel): void {
        for (let key of Object.keys(newProp.layers)) {
            let layerObject: string[] = this.layers[key].objects;
            for (let obj of layerObject) {
                let node: NodeModel | ConnectorModel = this.nameTable[obj];
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
        let hPan: number = (-this.scroller.horizontalOffset + newProp.scrollSettings.horizontalOffset || 0);
        let vPan: number = (this.scroller.verticalOffset - newProp.scrollSettings.verticalOffset || 0);

        let oldValue: ScrollValues = {
            VerticalOffset: this.scrollSettings.verticalOffset, HorizontalOffset: this.scrollSettings.horizontalOffset,
            ViewportHeight: this.scrollSettings.viewPortHeight, ViewportWidth: this.scrollSettings.viewPortWidth,
            CurrentZoom: this.scroller.currentZoom
        };
        if (hPan !== 0 || vPan !== 0) {
            this.pan(hPan, vPan);
        }
        let newValue: ScrollValues = {
            VerticalOffset: this.scrollSettings.verticalOffset, HorizontalOffset: this.scrollSettings.horizontalOffset,
            ViewportHeight: this.scrollSettings.viewPortHeight, ViewportWidth: this.scrollSettings.viewPortWidth,
            CurrentZoom: this.scroller.currentZoom
        };
        let arg: IScrollChangeEventArgs = {
            oldValue: oldValue, newValue: newValue, source: this
        };
        this.triggerEvent(DiagramEvent.scrollChange, arg);
        if (this.mode === 'Canvas' && (this.constraints & DiagramConstraints.Virtualization)) {
            this.refreshDiagramLayer();
        }
    }

    private initData(): void {
        if (this.dataBindingModule && !(this.realActions & RealAction.PreventDataInit)) {
            if (this.dataSourceSettings.dataManager && this.dataSourceSettings.dataManager.dataSource &&
                this.dataSourceSettings.dataManager.dataSource.url !== undefined) {
                this.dataBindingModule.initSource(this.dataSourceSettings, this);
            } else {
                this.dataBindingModule.initData(this.dataSourceSettings, this);
            }
        }
    }

    private initNodes(obj: Node, layer: LayerModel): void {
        this.preventUpdate = true;
        this.initObject(obj as Node, layer);
        this.preventUpdate = false;
    }

    private initConnectors(obj: Connector, layer: LayerModel, independentObj?: boolean): void {
        this.preventUpdate = true;
        this.initObject(obj as Connector, layer, independentObj);
        this.updateEdges(obj as Connector);
        this.preventUpdate = false;
    }

    private setZIndex(layer: LayerModel, obj: NodeModel | ConnectorModel): void {
        //should be changed
        let currentLayer: Layer = (layer as Layer);
        if ((obj).zIndex === -1) {
            while (currentLayer.zIndexTable[currentLayer.objectZIndex + 1]) {
                (layer as Layer).objectZIndex++;
            }
            obj.zIndex = ++currentLayer.objectZIndex;
        } else {
            let index: number = obj.zIndex;
            if (currentLayer.zIndexTable[index]) {
                let tabelLength: number = Object.keys(currentLayer.zIndexTable).length;
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
        for (let layer of this.layers) {
            layer.zIndex = this.layers.indexOf(layer);
            this.layerZIndexTable[layer.zIndex] = layer.id;
        }
        if (this.layers.length === 0) {
            let defaultLayer: LayerModel = {
                id: 'default_layer', visible: true, lock: false, objects: [], zIndex: 0,
                objectZIndex: -1, zIndexTable: {}
            } as Layer;
            this.commandHandler.addLayer(defaultLayer);
        }
        this.setActiveLayer(this.layers[this.layers.length - 1].id);
    }
    /** @private */
    public resetTool(): void {
        this.eventHandler.resetTool();
    }

    /** @private */
    public initObject(obj: IElement, layer?: LayerModel, independentObj: boolean = true, group?: boolean): void {
        if (obj !== undefined) {
            if (independentObj) {
                if (!layer) {
                    this.addToLayer(obj, false);
                    layer = this.activeLayer;
                }
                //Move the common properties like zindex and id to an abstract class
                if (obj instanceof Node || obj instanceof Connector) {
                    this.setZIndex(layer, obj);
                }
            }
            if (obj instanceof Node) {
                if (independentObj) {
                    let getDefaults: Function = getFunction(this.getNodeDefaults);
                    if (getDefaults) {
                        let defaults: NodeModel = getDefaults(obj, this);
                        if (defaults && defaults !== obj) {
                            extendObject(defaults, obj);
                        }
                    }
                    this.initNode(obj, this.element.id);
                }
            } else if (obj instanceof Connector) {
                let getDefaults: Function = getFunction(this.getConnectorDefaults);
                if (getDefaults) {
                    let defaults: ConnectorModel = getDefaults(obj, this);
                    if (defaults && defaults !== obj) {
                        extendObject(defaults, obj);
                    }
                    if (obj.segments.length) {
                        if (obj.type !== obj.segments[0].type) {
                            obj.segments = [];
                        }
                    }
                }
                let sourceNode: NodeModel = this.nameTable[obj.sourceID];
                let targetNode: NodeModel = this.nameTable[obj.targetID];
                if (sourceNode !== undefined && canOutConnect(sourceNode)) {
                    (obj as Connector).sourceWrapper = this.getEndNodeWrapper(sourceNode, obj, true);
                    if (obj.sourcePortID) {
                        (obj as Connector).sourcePortWrapper = this.getWrapper(
                            sourceNode.wrapper, obj.sourcePortID);
                    }
                }
                if (targetNode !== undefined && canInConnect(targetNode)) {
                    (obj as Connector).targetWrapper = this.getEndNodeWrapper(targetNode, obj, false);
                    if (obj.targetPortID) {
                        (obj as Connector).targetPortWrapper = this.getWrapper(
                            targetNode.wrapper, obj.targetPortID);
                    }
                }
                if (!independentObj) {
                    let points: PointModel[] = obj.getConnectorPoints((obj as Connector).type);
                    updateConnector(obj as Connector, points);
                }
                if (independentObj) {
                    obj.init(this);
                }
                obj.wrapper.measure(new Size(undefined, undefined));
                obj.wrapper.arrange(obj.wrapper.desiredSize);
            }
            if (this.bpmnModule && obj instanceof Node
                && (obj.shape as BpmnShape).type === 'Bpmn' && (obj.shape as BpmnShape).annotations.length > 0) {
                this.bpmnModule.updateQuad(obj as Node, this);
            }
            if (independentObj) {
                let checkBoundaryConstraints: boolean = this.commandHandler.checkBoundaryConstraints(
                    undefined, undefined, obj.wrapper.bounds);
                if (!checkBoundaryConstraints) {
                    let node: (NodeModel | ConnectorModel)[] = obj instanceof Node ? this.nodes : this.connectors;
                    for (let i: number = 0; i <= node.length; i++) {
                        if (node[i] && (obj as NodeModel).id === node[i].id) {
                            node.splice(i, 1);
                        }
                    }
                }
                (layer as Layer).zIndexTable[(obj as Node).zIndex] = (obj as Node).id;
            }
            this.nameTable[(obj as Node).id] = obj;
            if (obj instanceof Node && obj.children) {
                if (!group) {
                    this.updateGroupOffset(obj, true);
                }
                this.groupTable[(obj as Node).id] = obj.children;
                for (let i: number = 0; i < (obj as Node).children.length; i++) {
                    let node: Node | Connector = (this.nameTable[obj.children[i]]);
                    if (node) {
                        node.parentId = obj.id;
                    }
                }
                if (!this.isLoading && obj.rotateAngle) {
                    this.commandHandler.rotateObjects(obj, [obj], obj.rotateAngle, { x: obj.offsetX, y: obj.offsetY }, false);
                }
            }
            this.updateQuad(obj);
        }
        if ((obj as Node | Connector).visible === false) {
            this.updateElementVisibility(obj.wrapper, (obj as Node | Connector), false);
        }
    }

    private scaleObject(obj: NodeModel, size: number, isWidth: boolean): void {
        let actualSize: number = isWidth ? obj.wrapper.actualSize.width : obj.wrapper.actualSize.height;
        let sw: number = (isWidth) ? 1 + ((size - actualSize) / actualSize) : 1;
        let sh: number = (isWidth) ? 1 : 1 + ((size - actualSize) / actualSize);
        let groupOffsetX: number = obj.offsetX; let groupOffsetY: number = obj.offsetY;
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
                let iconWrapper: DiagramElement = this.getWrapper(node.wrapper, 'icon_content');
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
     * @private
     */
    public updateGroupOffset(node: NodeModel | ConnectorModel, isUpdateSize?: boolean): void {
        if (((node as Node).children && (node as Node).children.length > 0) || ((node as Node).processId)) {
            let node1: NodeModel = this.nameTable[node.id];
            if (!(this.realActions & RealAction.PreventScale) && !(this.realActions & RealAction.PreventDrag)) {
                if (node1.offsetX && !(this.diagramActions & DiagramAction.ToolAction)
                    && !(this.diagramActions & DiagramAction.PublicMethod)) {
                    this.realActions |= RealAction.PreventScale;
                    let diffX: number = (node1.offsetX - node.wrapper.offsetX);
                    node1.offsetX = node.wrapper.offsetX;
                    this.drag(node1, diffX, 0);
                    this.realActions &= ~RealAction.PreventScale;
                } else {
                    node1.offsetX = node.wrapper.offsetX;
                }
                if (node1.offsetY && !(this.diagramActions & DiagramAction.ToolAction)) {
                    this.realActions |= RealAction.PreventScale;
                    let diffY: number = (node1.offsetY - node.wrapper.offsetY);
                    node1.offsetY = node.wrapper.offsetY;
                    this.drag(node1, 0, diffY);
                    this.realActions &= ~RealAction.PreventScale;

                } else {
                    node1.offsetY = node.wrapper.offsetY;
                }
                if (this.diagramActions) {
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
                    this.nameTable[node.id].width = node.wrapper.actualSize.width;
                }
                if (this.nameTable[node.id].height !== undefined) {
                    this.scaleObject((node as Node), this.nameTable[node.id].height, false);
                } else {
                    this.nameTable[node.id].height = node.wrapper.actualSize.height;
                }
            }
        }
    }

    private initNode(obj: Node, diagramId: string, group?: boolean): void {
        let canvas: Container = obj.initContainer();
        let portContainer: Canvas = new Canvas();
        let content: DiagramElement;
        if (!canvas.children) { canvas.children = []; }
        if (obj.children) {
            canvas.measureChildren = false;
            for (let i: number = 0; i < obj.children.length; i++) {
                if (this.nameTable[obj.children[i]]) {
                    canvas.children.push(this.nameTable[obj.children[i]].wrapper);
                }
            }
            portContainer.id = 'group_container';
            portContainer.style.fill = 'none';
            portContainer.style.strokeColor = 'none';
            portContainer.horizontalAlignment = 'Stretch';
            portContainer.verticalAlignment = 'Stretch';
            canvas.style = obj.style;
            portContainer.children = [];
            canvas.children.push(portContainer);
        } else {
            let setNodeTemplate: Function = getFunction(this.setNodeTemplate);
            if (setNodeTemplate) {
                content = setNodeTemplate(obj, this);
            }

            if (!content) {
                content = obj.init(this);
            }
            canvas.children.push(content);
        }
        // tslint:disable-next-line:no-any
        let wrapperContent: any;
        wrapperContent = getFunction(this.getDescription);
        if (wrapperContent) {
            (obj.children ? canvas : content).description = wrapperContent;
        } else {
            (obj.children ? canvas : content).description = obj.annotations.length ? obj.annotations[0].content : obj.id;
        }
        let container: Container = obj.children ? portContainer : canvas;
        obj.initAnnotations(this.getDescription, container);
        obj.initPorts(this.getDescription, container);
        obj.initIcons(this.getDescription, this.layout, container, diagramId);
        canvas.measure(new Size(obj.width, obj.height));
        canvas.arrange(canvas.desiredSize);
    }

    private canExecute(): boolean {
        return true;
    }

    private initViews(): void {
        if (!this.isLoading) {
            this.views.push(this.element.id);
            this.views[this.element.id] = this;
        }
    }

    private initCommands(): void {
        let i: string;
        let newCommands: CommandModel[] = this.commandManager.commands;
        let commands: {} = {
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
            },
        };

        this.initCommandManager(newCommands, commands);
    }

    private overrideCommands(newCommand: CommandModel, commands: {}): void {
        let command: CommandModel;
        for (let key of Object.keys(commands)) {
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


    /** @private */
    public updateNodeEdges(node: Node): void {
        for (let edge of node.inEdges) {
            if (this.nameTable[edge]) {
                this.nameTable[edge].targetID = '';
            }
        }
        for (let edge of node.outEdges) {
            if (this.nameTable[edge]) {
                this.nameTable[edge].sourceID = '';
            }
        }
        node.inEdges = [];
        node.outEdges = [];
    }

    /** @private */
    private updateIconVisibility(node: Node, visibility: boolean): void {
        for (let i: number = 0; i < node.wrapper.children.length; i++) {
            let child: DiagramElement = node.wrapper.children[i];
            let id: string = child.id.split(node.id)[1];
            if (child.id && id && id.match('^_icon')) {
                child.visible = visibility;
                this.updateDiagramContainerVisibility(child, visibility);
            }
        }
    }

    /** @private */
    public updateEdges(obj: Connector): void {
        if (obj.sourceID !== undefined && obj.sourceID !== '') {
            let node: Node = this.nameTable[obj.sourceID];
            if (node && node.outEdges && node.outEdges.length === 0) { node.outEdges = []; }
            if (node && node.outEdges && node.outEdges.indexOf(obj.id) === -1) {
                node.outEdges.push(obj.id);
            }
        }
        if (obj.targetID !== undefined && obj.targetID !== '') {
            let node: Node = this.nameTable[obj.targetID];
            if (node && node.inEdges && node.inEdges.length === 0) { node.inEdges = []; }
            if (node && node.inEdges && node.inEdges.indexOf(obj.id) === -1) {
                node.inEdges.push(obj.id);
            }
            if (node && node.visible && node.outEdges) {
                let value: boolean = node.outEdges.length === 0 ? false : true;
                this.updateIconVisibility(node, value);
            }
        }
    }

    /** @private */
    public refreshDiagram(): void {
        this.initLayerObjects();
        this.doLayout();
        this.updateBridging();
        this.scroller.setSize();
    }

    /** @private */
    public updateDiagramObject(obj: (NodeModel | ConnectorModel)): void {
        let view: View;
        for (let temp of this.views) {
            view = this.views[temp];
            if (view.mode === 'SVG' && this.diagramActions) {
                let htmlLayer: HTMLElement = getHTMLLayer(this.element.id);
                let diagramElementsLayer: HTMLCanvasElement =
                    document.getElementById(view.element.id + '_diagramLayer') as HTMLCanvasElement;
                this.diagramRenderer.updateNode(
                    obj.wrapper as DiagramElement, diagramElementsLayer,
                    htmlLayer, undefined);
            } else {
                this.refreshCanvasDiagramLayer(view);
            }
        }
    }

    /** @private  */
    public getObjectsOfLayer(objectArray: string[]): (NodeModel | ConnectorModel)[] {
        let nodeArray: Object[] = [];
        for (let obj of objectArray) {
            if (this.nameTable[obj]) {
                nodeArray.push(this.nameTable[obj]);
            }
        }
        return nodeArray;
    }
    /** @private */
    public refreshDiagramLayer(): void {
        let view: View;
        for (let temp of this.views) {
            view = this.views[temp];
            switch (view.mode) {
                case 'SVG':
                    this.refreshSvgDiagramLayer(view);
                    break;
                case 'Canvas':
                    this.refreshCanvasLayers();
                    break;
            }
        }
    }

    /** @private */
    public refreshCanvasLayers(): void {
        for (let temp of this.views) {
            let view: View = this.views[temp];
            this.refreshCanvasDiagramLayer(view);
        }
    }

    private renderBasicElement(view: View): void {
        let htmlLayer: HTMLElement = getHTMLLayer(view.element.id);
        for (let i: number = 0; i < this.basicElements.length; i++) {
            let element: DiagramElement = this.basicElements[i];
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
            }
            let htmlLayer: HTMLElement = getHTMLLayer(view.element.id);
            let bounds: Rect = this.spatialSearch.getPageBounds();

            this.renderDiagramElements(view.diagramLayer, view.diagramRenderer, htmlLayer);

            if (view instanceof Diagram) {
                view.diagramLayer.style.transform = 'scale(' + (2 / 3) + ')';
                view.diagramLayer.style.transformOrigin = '0 0';
            }
            this.renderTimer = null;
        }
    }

    private renderTimer: Object = null;
    /** @private */
    public refreshCanvasDiagramLayer(view: View): void {
        if (view.mode !== 'SVG' && !this.isDestroyed) {
            if (this.basicElements.length > 0) {
                this.renderBasicElement(view);
            }
            if ((!this.diagramActions || (this.diagramActions & DiagramAction.Render) === 0)
                || (DiagramAction.ToolAction & this.diagramActions) || (this.scroller.currentZoom !== 1)) {
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


    /** @private */
    public updatePortVisibility(node: Node, portVisibility: PortVisibility, inverse?: Boolean): void {
        let portElement: DiagramElement;
        let drawingObject: boolean = !(this.drawingObject && this.drawingObject.shape) ? true : false;
        if (node instanceof Node && drawingObject && canMove(node)) {
            let ports: PointPortModel[] = node.ports;
            let changed: boolean = false;
            for (let i: number = 0; i < ports.length; i++) {
                portElement = this.getWrapper(node.wrapper, ports[i].id);
                if (portVisibility & PortVisibility.Hover || portVisibility & PortVisibility.Connect) {
                    if (checkPortRestriction(ports[i], portVisibility)) {
                        portElement.visible = !inverse;
                        changed = true;
                    }
                }
            }
            if (changed) {
                this.updateDiagramObject(node);
            }
        }
    }

    /** @private */
    public refreshSvgDiagramLayer(view: View): void {
        if (!canVitualize(this)) {
            let container: HTMLElement = document.getElementById(view.element.id);
            let bounds: ClientRect = container.getBoundingClientRect();
            let node: Object; let element: DiagramElement; let connector: Object;
            let diagramElementsLayer: HTMLCanvasElement = document.getElementById(view.element.id + '_diagramLayer') as HTMLCanvasElement;
            let htmlLayer: HTMLElement = getHTMLLayer(view.element.id);
            for (let i: number = 0; i < this.basicElements.length; i++) {
                element = this.basicElements[i];
                element.measure(new Size(element.width, element.height));
                element.arrange(element.desiredSize);
                this.diagramRenderer.renderElement(element, diagramElementsLayer, htmlLayer);
            }
            this.renderDiagramElements(diagramElementsLayer, this.diagramRenderer, htmlLayer);
        } else {
            this.scroller.virtualizeElements();
        }
    }

    private removeVirtualObjects(clearIntervalVal: Object): void {
        if (this.deleteVirtualObject) {
            for (let i: number = 0; i < this.scroller.removeCollection.length; i++) {
                let obj: (NodeModel | ConnectorModel) = this.nameTable[this.scroller.removeCollection[i]];
                this.removeElements(obj);
            }
            this.deleteVirtualObject = false;

        }
        clearInterval(clearIntervalVal as number);
    }

    /** @private */
    public updateVirtualObjects(
        collection: string[], remove: boolean, tCollection?: string[]):
        void {
        let diagramElementsLayer: HTMLCanvasElement = document.getElementById('diagram_diagramLayer') as HTMLCanvasElement;
        let htmlLayer: HTMLElement = getHTMLLayer('diagram');
        let removeObjectInterval: Object;
        for (let i: number = 0; i < collection.length; i++) {
            let index: number = this.scroller.removeCollection.indexOf(collection[i]);
            if (index >= 0) {
                this.scroller.removeCollection.splice(index, 1);
            }
            let object: NodeModel | ConnectorModel = this.nameTable[collection[i]];
            this.diagramRenderer.renderElement(
                object.wrapper, diagramElementsLayer, htmlLayer, undefined, undefined, undefined, undefined, object.zIndex);
        }
        for (let k: number = 0; k < tCollection.length; k++) {
            this.scroller.removeCollection.push(tCollection[k]);
        }
        let delay: number = 50;
        removeObjectInterval = setInterval(
            (args: PointerEvent | TouchEvent) => {
                this.removeVirtualObjects(removeObjectInterval);
            },
            delay);
        setTimeout(
            () => {
                this.deleteVirtualObject = true;
            },
            delay);

    }

    /** @private */
    public renderDiagramElements(
        canvas: HTMLCanvasElement | SVGElement, renderer: DiagramRenderer, htmlLayer: HTMLElement,
        transform: boolean = true, fromExport?: boolean): void {
        for (let layerId of Object.keys(this.layerZIndexTable)) {
            let layer: LayerModel = this.commandHandler.getLayer(this.layerZIndexTable[layerId]);
            let left: string;
            let top: string;
            for (let node of Object.keys((layer as Layer).zIndexTable)) {
                let element: DiagramElement = this.nameTable[(layer as Layer).zIndexTable[node]].wrapper;
                if (!(this.nameTable[(layer as Layer).zIndexTable[node]].parentId)
                    && !(this.nameTable[(layer as Layer).zIndexTable[node]].processId)) {
                    let transformValue: TransformFactor = {
                        tx: this.scroller.transform.tx,
                        ty: this.scroller.transform.ty,
                        scale: this.scroller.transform.scale
                    };
                    if (this.constraints & DiagramConstraints.Virtualization) {
                        if (this.scroller.currentZoom < 1) {
                            let horizonatlValue: number = this.scroller.horizontalOffset < 0 ? this.scroller.horizontalOffset : 0;
                            let verticalValue: number = this.scroller.verticalOffset < 0 ? this.scroller.verticalOffset : 0;
                            left = ((this.realActions & RealAction.hScrollbarMoved) ? 0 : -horizonatlValue) + 'px';
                            top = ((this.realActions & RealAction.vScrollbarMoved) ? 0 : -verticalValue) + 'px';
                            if (this.realActions & RealAction.hScrollbarMoved) {
                                this.realActions = this.realActions & ~RealAction.hScrollbarMoved;
                            }
                            if (this.realActions & RealAction.vScrollbarMoved) {
                                this.realActions = this.realActions & ~RealAction.vScrollbarMoved;
                            }
                        } else {
                            left = -this.scroller.horizontalOffset + 'px';
                            top = -this.scroller.verticalOffset + 'px';
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
                    renderer.renderElement(
                        element, canvas, htmlLayer,
                        (!renderer.isSvgMode && transform) ? transformValue : undefined,
                        undefined, undefined, status);
                }
            }
        }
    }
    /** @private */
    public updateBridging(isLoad?: boolean): void {
        if (this.bridgingModule) {
            for (let i: number = 0; i < this.connectors.length; i++) {
                let connector: Connector = this.connectors[i] as Connector;
                this.bridgingModule.updateBridging(connector, this);
                let canvas: Container = this.connectors[i].wrapper;
                if (canvas) {
                    let pathSegment: PathElement = canvas.children[0] as PathElement;
                    let data: string = pathSegment.data;
                    connector.getSegmentElement(connector, pathSegment);
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

    /** @private */
    public setCursor(cursor: string): void {
        this.diagramRenderer.setCursor(this.diagramCanvas, cursor);
    }

    /** @private */
    public clearCanvas(view: View): void {
        let width: number;
        let height: number;
        width = view.contentWidth || (view.diagramLayer as HTMLCanvasElement).width / this.scroller.currentZoom;
        height = view.contentHeight || (view.diagramLayer as HTMLCanvasElement).height / this.scroller.currentZoom;
        if (view.mode !== 'SVG') {
            let ctx: CanvasRenderingContext2D = CanvasRenderer.getContext(view.diagramLayer as HTMLCanvasElement);
            ctx.clearRect(0, 0, width, height);
        }
    }

    /** @private */
    public updateScrollOffset(): void {
        this.scroller.setScrollOffset(this.diagramCanvas.scrollLeft, this.diagramCanvas.scrollTop);
        updateRuler(this);
        if (canVitualize(this) && this.mode === 'SVG') {
            this.scroller.virtualizeElements();
        }
    }

    /** @private */
    public setOffset(offsetX: number, offsetY: number): void {
        let container: HTMLElement = document.getElementById(this.element.id + 'content');
        if (container) {
            container.scrollLeft = offsetX;
            container.scrollTop = offsetY;
        }
    }

    /** @private */
    public setSize(width: number, height: number): void {
        if (this.diagramLayer && !this.preventUpdate) {
            let position: Size = getRulerSize(this);
            width -= position.width;
            height -= position.height;
            let bounds: Rect = this.spatialSearch.getPageBounds();
            bounds.x *= this.scroller.currentZoom;
            bounds.y *= this.scroller.currentZoom;
            bounds.width *= this.scroller.currentZoom;
            bounds.height *= this.scroller.currentZoom;
            let factor: number = this.mode === 'SVG' ? 1 : 1.5;
            let diagramLayer: HTMLElement | SVGElement = this.mode === 'SVG' ?
                getDiagramLayerSvg(this.element.id) as SVGElement : this.diagramLayer;
            let w: number = (this.mode === 'Canvas' &&
                (this.constraints & DiagramConstraints.Virtualization)) ? this.width as number : width;
            let h: number = (this.mode === 'Canvas' &&
                (this.constraints & DiagramConstraints.Virtualization)) ? this.height as number : height;
            diagramLayer.setAttribute('width', (factor * w).toString());
            diagramLayer.setAttribute('height', (factor * h).toString());
            let attr: Object = { 'width': width.toString(), 'height': height.toString() };
            this.diagramLayerDiv.style.width = width + 'px';
            this.diagramLayerDiv.style.height = height + 'px';

            setAttributeSvg(getNativeLayerSvg(this.element.id), attr);

            setAttributeSvg(getPortLayerSvg(this.element.id), attr);

            let adornerSVG: SVGElement = getAdornerLayerSvg(this.element.id);
            setAttributeSvg(adornerSVG, attr);

            (adornerSVG.parentNode as HTMLElement).style.width = width + 'px';
            (adornerSVG.parentNode as HTMLElement).style.height = height + 'px';

            let gridLayer: SVGSVGElement = getGridLayerSvg(this.element.id);
            setAttributeSvg(gridLayer, attr);

            this.diagramRenderer.updateGrid(
                this.snapSettings, gridLayer, this.scroller.transform, this.rulerSettings, this.hRuler, this.vRuler
            );

            setAttributeSvg(getBackgroundLayerSvg(this.element.id), attr);

            this.htmlLayer.style.width = width + 'px';
            this.htmlLayer.style.height = height + 'px';
            if (this.mode !== 'SVG') {
                this.refreshDiagramLayer();
            }
            if (this.mode === 'SVG' && canVitualize(this)) {
                this.scroller.virtualizeElements();
            }
        }
    }

    /** @private */
    public transformLayers(): void {
        let bounds: Rect = this.spatialSearch.getPageBounds();
        bounds.x *= this.scroller.currentZoom;
        bounds.y *= this.scroller.currentZoom;
        bounds.width *= this.scroller.currentZoom;
        bounds.height *= this.scroller.currentZoom;
        this.diagramRenderer.updateGrid(
            this.snapSettings, getGridLayerSvg(this.element.id), this.scroller.transform, this.rulerSettings, this.hRuler, this.vRuler
        );
        this.diagramRenderer.transformLayers(this.scroller.transform, this.mode === 'SVG');
        this.updateSelector();
        this.renderPageBreaks(bounds);
    }

    /**
     * Defines how to remove the Page breaks
     * @private
     */
    public removePageBreaks(): void {
        if (this.diagramLayer) {
            let line: SVGSVGElement = getBackgroundLayer(this.element.id);
            if (line && line.childNodes) {
                let length: number = line.childNodes.length;
                for (let i: number = 0; i < length; i++) {
                    line.removeChild(line.childNodes[0]);
                }
            }
        }
    }
    /**
     * Defines how the page breaks has been rendered
     * @private
     */
    public renderPageBreaks(bounds?: Rect): void {
        this.removePageBreaks();
        let backgroundLayer: SVGElement = getBackgroundLayer(this.element.id);
        if (backgroundLayer) {
            let i: number = 0;
            bounds = this.scroller.getPageBounds(true);
            let x: number = (this.scroller.transform.tx + bounds.x) * this.scroller.currentZoom;
            let y: number = (this.scroller.transform.ty + bounds.y) * this.scroller.currentZoom;
            let height: number = bounds.height * this.scroller.currentZoom;
            let width: number = bounds.width * this.scroller.currentZoom;
            DiagramRenderer.renderSvgBackGroundImage(this.pageSettings.background, this.element, x, y, width, height);
            let options: BaseAttributes = {
                id: backgroundLayer.id + 'rect', x: x,
                y: y,
                height: height,
                width: width, angle: 0, stroke: '', strokeWidth: 1,
                fill: this.pageSettings.background.color, opacity: 1,
                pivotX: 0, pivotY: 0, visible: true, dashArray: '0',
            };
            this.diagramRenderer.drawRect(backgroundLayer, options);
            if (this.pageSettings.showPageBreaks) {
                let collection: Segment[] = this.scroller.getPageBreak(bounds);
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
            let index: number = this.views.indexOf(id);
            this.views.splice(index, 1);
        }
    }

    private renderNodes(overview: View): void {
        if (overview) {
            let renderer: DiagramRenderer = new DiagramRenderer(overview.id, new SvgRenderer(), false);
            let g: HTMLElement = document.getElementById(overview.element.id + '_diagramLayer') as HTMLCanvasElement;
            let htmlLayer: HTMLElement = getHTMLLayer(overview.element.id);
            this.renderDiagramElements(g as HTMLCanvasElement, overview.diagramRenderer || renderer, htmlLayer);
        }
    }

    private updateThumbConstraints(
        node: NodeModel[] | ConnectorModel[] | PathAnnotation[] | ShapeAnnotation[], selectorModel: SelectorModel): void {
        let state: number = 0;
        let length: number = node.length;
        for (let i: number = 0; i < length; i++) {
            let obj: NodeModel | ConnectorModel | ShapeAnnotation | PathAnnotation = node[i];
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
                thumbConstraints = thumbConstraints | ThumbsConstraints.Default;
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
                thumbConstraints = thumbConstraints | ThumbsConstraints.Default;
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

    /** @private */
    public renderSelector(multipleSelection: boolean): void {
        let size: Size = new Size();
        let selectorModel: Selector = this.selectedItems as Selector;
        let selectorConstraints: SelectorConstraints = selectorModel.constraints;
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
                for (let obj of selectorModel.nodes) {
                    obj.offsetX = obj.wrapper.offsetX;
                    obj.offsetY = obj.wrapper.offsetY;
                }
                for (let conn of selectorModel.connectors) {
                    //update connections
                }
            }

            let bounds: Rect = this.spatialSearch.getPageBounds();
            let selectorElement: (SVGElement | HTMLCanvasElement);
            selectorElement = getSelectorElement(this.element.id);
            selectorModel.thumbsConstraints = ThumbsConstraints.Default;
            if (selectorModel.annotation) {
                this.updateThumbConstraints([selectorModel.annotation] as (ShapeAnnotation[] | PathAnnotation[]), selectorModel);
            } else {
                this.updateThumbConstraints(selectorModel.nodes, selectorModel);
                this.updateThumbConstraints(selectorModel.connectors, selectorModel);
            }
            if (selectorModel.annotation) {
                this.renderSelectorForAnnotation(selectorModel, selectorElement);
            } else if (selectorModel.nodes.length + selectorModel.connectors.length === 1) {
                if (selectorModel.nodes[0] instanceof Node) {
                    this.diagramRenderer.renderResizeHandle(
                        selectorModel.nodes[0].wrapper, selectorElement, selectorModel.thumbsConstraints, this.scroller.currentZoom,
                        selectorModel.constraints, this.scroller.transform, undefined, canMove(selectorModel.nodes[0]));
                } else if (selectorModel.connectors[0] instanceof Connector) {
                    let connector: Connector = selectorModel.connectors[0] as Connector;
                    this.diagramRenderer.renderEndPointHandle(
                        connector, selectorElement, selectorModel.thumbsConstraints, selectorModel.constraints,
                        this.scroller.transform, connector.sourceWrapper !== undefined,
                        connector.targetWrapper !== undefined,
                        (this.connectorEditingToolModule && canDragSegmentThumb(connector)) ? true : false);
                }
            } else {
                this.diagramRenderer.renderResizeHandle(
                    selectorModel.wrapper, selectorElement, selectorModel.thumbsConstraints, this.scroller.currentZoom,
                    selectorModel.constraints, this.scroller.transform, undefined, canMove(selectorModel));
            }
            if (!(selectorModel.annotation)) {
                this.diagramRenderer.renderUserHandler(selectorModel, selectorElement, this.scroller.transform);
            }
        }
    }

    /** @private */
    public updateSelector(): void {
        let size: Size = new Size();
        let selectorModel: Selector = this.selectedItems as Selector;
        let selectorConstraints: SelectorConstraints = selectorModel.constraints;
        if (!(this.diagramActions & DiagramAction.ToolAction) && this.selectedItems.nodes.length === 1) {
            this.selectedItems.rotateAngle = this.selectedItems.nodes[0].rotateAngle;
            this.selectedItems.wrapper.rotateAngle = this.selectedItems.nodes[0].rotateAngle;
        }
        if (this.selectedItems !== undefined) {
            this.clearSelectorLayer();
            if (selectorModel.wrapper !== null && selectorModel.wrapper.children && selectorModel.wrapper.children.length) {
                selectorModel.wrapper.measure(size);
                selectorModel.wrapper.arrange(selectorModel.wrapper.desiredSize);
                if (selectorModel.rotateAngle !== 0 || selectorModel.rotateAngle !== selectorModel.wrapper.prevRotateAngle) {
                    for (let obj of selectorModel.nodes) {
                        obj.offsetX = obj.wrapper.offsetX;
                        obj.offsetY = obj.wrapper.offsetY;
                    }
                }
                selectorModel.width = selectorModel.wrapper.actualSize.width;
                selectorModel.height = selectorModel.wrapper.actualSize.height;
                selectorModel.offsetX = selectorModel.wrapper.offsetX;
                selectorModel.offsetY = selectorModel.wrapper.offsetY;
                let selectorElement: (SVGElement | HTMLCanvasElement);
                selectorElement = getSelectorElement(this.element.id);
                let canHideResizers: boolean = this.eventHandler.canHideResizers();
                selectorModel.thumbsConstraints = ThumbsConstraints.Default;
                if (selectorModel.annotation) {
                    this.updateThumbConstraints([selectorModel.annotation] as (ShapeAnnotation[] | PathAnnotation[]), selectorModel);
                } else {
                    this.updateThumbConstraints(selectorModel.nodes, selectorModel);
                    this.updateThumbConstraints(selectorModel.connectors, selectorModel);
                }
                if ((this.selectedItems.constraints & SelectorConstraints.UserHandle) && (!(selectorModel.annotation))) {
                    this.diagramRenderer.renderUserHandler(selectorModel, selectorElement, this.scroller.transform);
                }
                if (selectorModel.annotation) {
                    this.renderSelectorForAnnotation(selectorModel, selectorElement);
                } else if (selectorModel.nodes.length + selectorModel.connectors.length === 1) {
                    if (selectorModel.connectors[0] instanceof Connector) {
                        let connector: Connector = selectorModel.connectors[0] as Connector;
                        this.diagramRenderer.renderEndPointHandle(
                            connector, selectorElement, selectorModel.thumbsConstraints, selectorConstraints,
                            this.scroller.transform, connector.sourceWrapper !== undefined, connector.targetWrapper !== undefined,
                            (this.connectorEditingToolModule && canDragSegmentThumb(connector)) ? true : false);
                    } else if (selectorModel.nodes[0] instanceof Node) {
                        this.diagramRenderer.renderResizeHandle(
                            selectorModel.nodes[0].wrapper, selectorElement, selectorModel.thumbsConstraints, this.scroller.currentZoom,
                            selectorModel.constraints, this.scroller.transform, canHideResizers, canMove(selectorModel.nodes[0]));
                    }
                } else {
                    this.diagramRenderer.renderResizeHandle(
                        selectorModel.wrapper, selectorElement, selectorModel.thumbsConstraints, this.scroller.currentZoom,
                        selectorModel.constraints, this.scroller.transform, canHideResizers, canMove(selectorModel));
                }
            }
        }
    }

    /** @private */
    public renderSelectorForAnnotation(selectorModel: Selector, selectorElement: (SVGElement | HTMLCanvasElement)): void {
        this.diagramRenderer.renderResizeHandle(
            selectorModel.wrapper.children[0], selectorElement, selectorModel.thumbsConstraints,
            this.scroller.currentZoom, selectorModel.constraints, this.scroller.transform, undefined, canMove(selectorModel.annotation));
    }

    /** @private */
    public drawSelectionRectangle(x: number, y: number, width: number, height: number): void {
        this.clearSelectorLayer();
        this.diagramRenderer.drawSelectionRectangle(x, y, width, height, this.adornerLayer, this.scroller.transform);
    }
    /**
     * @private
     */
    public renderHighlighter(element: DiagramElement): void {
        let adornerSvg: SVGElement = getAdornerLayerSvg(this.element.id);
        this.diagramRenderer.renderHighlighter(element, adornerSvg, this.scroller.transform);
    }


    /**
     * @private
     */
    public clearHighlighter(): void {
        let adornerSvg: SVGElement = getAdornerLayerSvg(this.element.id);
        let highlighter: SVGElement =
            (adornerSvg as SVGSVGElement).getElementById(adornerSvg.id + '_highlighter') as SVGElement;
        if (highlighter) {
            highlighter.parentNode.removeChild(highlighter);
        }
    }

    /** @private */
    public getNodesConnectors(selectedItems: (NodeModel | ConnectorModel)[]): (NodeModel | ConnectorModel)[] {
        for (let i: number = 0; i < this.nodes.length; i++) {
            let node: NodeModel = this.nodes[i];
            selectedItems.push(node);
        }
        for (let i: number = 0; i < this.connectors.length; i++) {
            let conn: ConnectorModel = this.connectors[i];
            selectedItems.push(conn);
        }
        return selectedItems;
    }

    /** @private */
    public clearSelectorLayer(): void {
        let adornerSvg: SVGElement = getAdornerLayerSvg(this.element.id);
        let highlighter: SVGElement =
            (adornerSvg as SVGSVGElement).getElementById(adornerSvg.id + '_highlighter') as SVGElement;

        let selectionRect: SVGElement =
            (adornerSvg as SVGSVGElement).getElementById(this.adornerLayer.id + '_selected_region') as SVGElement;
        if (selectionRect) {
            selectionRect.parentNode.removeChild(selectionRect);
        }
        this.clearHighlighter();
        let childNodes: NodeList = getSelectorElement(this.element.id).childNodes;
        let child: SVGElement;
        for (let i: number = childNodes.length; i > 0; i--) {
            child = childNodes[i - 1] as SVGElement;
            child.parentNode.removeChild(child);
        }
    }

    /** @private */
    public getWrapper(nodes: Container, id: string): DiagramElement {
        let wrapper: DiagramElement;
        id = nodes.id + '_' + id;
        let container: Container = nodes instanceof Canvas ? nodes : this.getPortContainer(this.nameTable[nodes.id]);
        for (let i: number = 0; i < container.children.length; i++) {
            if (id === container.children[i].id) {
                wrapper = container.children[i];
            }
        }
        return wrapper;
    }

    /** @private */
    public getEndNodeWrapper(node: NodeModel, connector: ConnectorModel, source: boolean): DiagramElement {
        if (node.shape.type === 'Bpmn' && node.wrapper.children[0] instanceof Canvas) {
            if ((node.shape as BpmnShape).shape === 'Activity') {
                if (source && (node.shape as BpmnShape).activity.subProcess.type === 'Transaction'
                    && connector.sourcePortID) {
                    let portId: string = connector.sourcePortID;
                    let parent: Canvas = ((node.wrapper.children[0] as Canvas).children[0] as Canvas).children[2] as Canvas;
                    if (parent.children) {
                        for (let child of parent.children) {
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
    }

    private endEditCommand(): void {
        this.endEdit();
    }
    /**
     * @private
     */
    public endEdit(): void {
        if (this.diagramActions & DiagramAction.TextEdit) {
            let textArea: HTMLTextAreaElement = (document.getElementById(this.element.id + '_editBox') as HTMLTextAreaElement);
            let text: string = textArea.value;
            EventHandler.remove(textArea, 'input', this.eventHandler.inputChange);
            EventHandler.remove(textArea, 'focusout', this.focusOutEdit);
            let element: HTMLElement = document.getElementById(this.element.id + '_editTextBoxDiv');
            let args: ITextEditEventArgs = { oldValue: element.textContent, newValue: text, cancel: false };
            let bpmnAnnotation: boolean = false;
            let node: NodeModel;
            element.parentNode.removeChild(element);
            let textWrapper: DiagramElement;
            if (this.bpmnModule) {
                node = this.bpmnModule.isBpmnTextAnnotation(this.activeLabel, this);
                textWrapper = this.bpmnModule.getTextAnnotationWrapper(node, this.activeLabel.id);
                bpmnAnnotation = node ? true : false;
                if (bpmnAnnotation) {
                    if (element.textContent !== text) {
                        this.triggerEvent(DiagramEvent.textEdit, args);
                        if (!args.cancel) {
                            this.bpmnModule.updateTextAnnotationContent(node, this.activeLabel, text, this);
                        }
                    }
                }
            }

            if (!bpmnAnnotation) {
                node = this.nameTable[this.activeLabel.parentId];
                let deleteNode: boolean = this.eventHandler.isAddTextNode(node as Node, true);
                if (!deleteNode && element.textContent !== text) {
                    this.triggerEvent(DiagramEvent.textEdit, args);
                }
                if (!textWrapper) {
                    textWrapper = this.getWrapper(node.wrapper, this.activeLabel.id);
                }

                let annotation: ShapeAnnotationModel | PathAnnotationModel | TextModel = findAnnotation(node, this.activeLabel.id);
                if (annotation.content !== text && !args.cancel) {
                    annotation.content = text;
                    this.dataBind();
                    this.updateSelector();
                }
                if (deleteNode) {
                    this.removeObjectsFromLayer(node);
                    this.removeFromAQuad(node as IElement);
                    delete this.nameTable[this.activeLabel.parentId];
                    if (text !== '') {
                        this.clearSelection();
                        let clonedObject: Object = cloneObject(node);
                        node = this.add(clonedObject) as Node;
                        this.updateDiagramObject(node);
                        this.commandHandler.select(this.nameTable[node.id]);
                    }
                }
            }
            textWrapper.visible = true;
            this.updateDiagramObject(node);
            this.diagramActions = this.diagramActions & ~DiagramAction.TextEdit;
            if (this.activeLabel.isGroup) {
                this.endGroupAction();
            }
            this.activeLabel = { id: '', parentId: '', isGroup: false };
        }
    }
    /** @private */
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
        let isAction: boolean = action ? true : false;
        if (this.diagramActions & DiagramAction.UndoRedo && (!isAction || (action === DiagramAction.UndoRedo))) {
            this.diagramActions = this.diagramActions & ~DiagramAction.UndoRedo;
        }
        if (this.diagramActions & DiagramAction.PublicMethod && (!isAction || action === DiagramAction.PublicMethod)) {
            this.diagramActions = this.diagramActions & ~DiagramAction.PublicMethod;
        }
    }

    /** @private */
    public removeNode(node: NodeModel | ConnectorModel): void {
        this.removeObjectsFromLayer(node);
        this.removeFromAQuad(this.nameTable[node.id]);
        delete this.nameTable[node.id];
        if ((node as NodeModel).children) {
            delete this.groupTable[node.id];
        }
        this.nodes.splice(this.nodes.indexOf(node as NodeModel), 1);
    }

    /** @private */
    public deleteGroup(node: NodeModel): void {
        let elements: (NodeModel | ConnectorModel)[] = [];
        let tempNode: (NodeModel | ConnectorModel)[] = [];
        if (node.children) {
            tempNode = this.commandHandler.getChildren(node, elements);
        }
        for (let nodes of tempNode) {
            if (this.nameTable[nodes.id]) {
                this.remove(nodes);
            }
        }
    }

    //helper methods - end region
    //property changes - start region
    /** @private */
    public updateObject(actualObject: Node | Connector, oldObject: Node | Connector, changedProp: Node | Connector): void {
        if (!(this.diagramActions & DiagramAction.ToolAction)) {
            let bound: Rect = actualObject.wrapper.children[0].bounds;
            let checkBoundaryConstraints: boolean = this.commandHandler.checkBoundaryConstraints(undefined, undefined, bound);
            if (!checkBoundaryConstraints) {
                if (actualObject instanceof Node) {
                    let oldNode: Node = oldObject as Node;
                    for (let key of Object.keys(changedProp)) {
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
                    for (let key of Object.keys(changedProp)) {
                        let oldConnector: Connector = oldObject as Connector;
                        let actualSourcePoint: PointModel = actualObject.sourcePoint;
                        let actualTargetPoint: PointModel = actualObject.targetPoint;
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
        return update;
    }


    /* tslint:disable */
    /** @private */
    public nodePropertyChange(actualObject: Node, oldObject: Node, node: Node, isLayout?: boolean, rotate?: boolean): void {
        let existingBounds: Rect = actualObject.wrapper.outerBounds; let existingInnerBounds: Rect = actualObject.wrapper.bounds;
        let updateConnector = false;
        let i: number; let j: number; let offsetX: number; let offsetY: number; let update: boolean;
        let tx: number; let ty: number;
        if (node.width !== undefined) {
            if (!actualObject.children) {
                actualObject.wrapper.children[0].width = node.width; update = true; updateConnector = true;
            } else {
                this.scaleObject(actualObject, node.width, true);
            }
        }
        if (node.height !== undefined) {
            if (!actualObject.children) {
                actualObject.wrapper.children[0].height = node.height; update = true; updateConnector = true;
            } else {
                this.scaleObject(actualObject, node.height, false);
            }
        }
        update = this.nodePropertyChangeExtend(actualObject, oldObject, node, update);
        if (node.constraints !== undefined && canShadow(oldObject) !== canShadow(node)) {
            actualObject.wrapper.children[0].shadow = canShadow(actualObject) ? actualObject.shadow : null;
        }
        if (node.offsetX !== undefined) {
            actualObject.wrapper.offsetX = node.offsetX; update = true;
            updateConnector = true;
        }
        if (node.offsetY !== undefined) {
            actualObject.wrapper.offsetY = node.offsetY; update = true;
            updateConnector = true;
        }
        if (node.pivot !== undefined) {
            actualObject.wrapper.pivot = node.pivot; update = true;
        }
        if (node.minWidth !== undefined) {
            actualObject.wrapper.minWidth = node.minWidth; update = true;
            updateConnector = true;
        }
        if (node.minHeight !== undefined) {
            actualObject.wrapper.minHeight = node.minHeight; update = true;
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
        if (node.rotateAngle !== undefined) {
            if (actualObject.children && rotate) {
                this.commandHandler.rotateObjects(actualObject, [actualObject], actualObject.rotateAngle - actualObject.wrapper.rotateAngle, { x: actualObject.offsetX, y: actualObject.offsetY }, false)
            }
            actualObject.wrapper.rotateAngle = node.rotateAngle; update = true;
            updateConnector = true;
        }
        if (node.backgroundColor !== undefined) {
            actualObject.wrapper.style.fill = node.backgroundColor
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
        if (((node.shape !== undefined && node.shape.type === undefined) || node.width !== undefined
            || node.height !== undefined || node.style !== undefined) && actualObject.shape.type === 'Bpmn' && this.bpmnModule) {
            update = true;
            updateConnector = true;
            this.bpmnModule.updateBPMN(node, oldObject, actualObject, this);
        }
        if (node.ports !== undefined) {
            for (let key of Object.keys(node.ports)) {
                let index: number = Number(key); update = true; let changedObject: PointPortModel = node.ports[key];
                let actualPort: PointPortModel = actualObject.ports[index];
                this.updatePort(changedObject, actualPort, actualObject.wrapper);
            }
        }
        if (node.annotations !== undefined || node.width !== undefined) {
            for (let key of Object.keys(node.annotations || actualObject.annotations)) {
                let index: number = Number(key); update = true; let changedObject: ShapeAnnotationModel = node.annotations ? node.annotations[key] : actualObject.annotations
                let actualAnnotation: ShapeAnnotationModel = actualObject.annotations[index];
                if (actualAnnotation) {
                    let updateSize: boolean = actualObject.width ? true : false;
                    this.updateAnnotation(changedObject, actualAnnotation, actualObject.wrapper, actualObject, updateSize);
                }
            }
        }
        if (node.expandIcon !== undefined || node.collapseIcon !== undefined || node.isExpanded !== undefined) {
            this.updateIcon(actualObject); this.updateDefaultLayoutIcons(actualObject);
            if (node.isExpanded !== undefined) { this.commandHandler.expandNode(actualObject, this); }
            update = true;
        }
        if (node.tooltip !== undefined) { this.updateTooltip(actualObject, node); }
        if (update) {
            if (!(this.diagramActions & DiagramAction.ToolAction)) {
                if (this.checkSelectedItem(actualObject)) {
                    this.updateSelector();
                }
            }
            if (this.bpmnModule !== undefined) {
                this.bpmnModule.updateTextAnnotationProp(actualObject, { offsetX: (oldObject.offsetX || actualObject.offsetX), offsetY: (oldObject.offsetY || actualObject.offsetY) } as Node, this);
            }
            actualObject.wrapper.measure(new Size(actualObject.wrapper.bounds.width, actualObject.wrapper.bounds.height));
            actualObject.wrapper.arrange(actualObject.wrapper.desiredSize); this.updateObject(actualObject, oldObject, node);
            if (!isLayout) {
                this.commandHandler.connectorSegmentChange(actualObject, existingInnerBounds, (node.rotateAngle !== undefined) ? true : false);
                if (updateConnector) {
                    this.updateConnectorEdges(actualObject);
                }
            } else {
                if (actualObject && actualObject.visible && actualObject.outEdges) {
                    this.updateIconVisibility(actualObject, (actualObject.outEdges.length === 0 ? false : true));
                }
            }
            if (this.bpmnModule !== undefined) {
                this.bpmnModule.updateDocks(actualObject, this);
            }
            this.updateGroupOffset(actualObject);
            if (existingBounds.equals(existingBounds, actualObject.wrapper.outerBounds) === false) { this.updateQuad(actualObject); }

            let objects: (NodeModel | ConnectorModel)[] = [];
            objects = objects.concat(this.selectedItems.nodes, this.selectedItems.connectors);
            if (objects.length === 0) {
                if (actualObject.parentId) {
                    let parent: NodeModel = this.nameTable[actualObject.parentId];
                    parent.wrapper.measure(new Size(parent.wrapper.width, actualObject.wrapper.height));
                    parent.wrapper.arrange(parent.wrapper.desiredSize);

                    parent.offsetX = parent.wrapper.offsetX;
                    parent.offsetY = parent.wrapper.offsetY;
                }
            }
            if (existingInnerBounds.equals(existingInnerBounds, actualObject.wrapper.bounds) === false) {
                this.updateGroupSize(actualObject);
                if (actualObject.children) { this.updateGroupOffset(actualObject); }
            }
            if (this.mode === 'SVG' && !this.preventNodesUpdate) {
                this.updateDiagramObject(actualObject as NodeModel);
            }
        }
    }
    private updateConnectorProperties(connector: ConnectorModel): void {
        if (this.preventConnectorsUpdate) {
            let index: number = this.selectionConnectorsList.indexOf(connector);
            if (index === -1) { this.selectionConnectorsList.push(connector); }
        } else {
            let conn: Connector = {
                sourcePoint: connector.sourcePoint, targetPoint: connector.targetPoint, sourceID: connector.sourceID,
                targetID: connector.targetID, sourcePortID: connector.sourcePortID, targetPortID: connector.targetPortID
            } as Connector;
            this.connectorPropertyChange(connector as Connector, {} as Connector, conn);
        }
    }
    /** @private */
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

    /** @private */
    public connectorPropertyChange(actualObject: Connector, oldProp: Connector, newProp: Connector, disableBridging?: boolean): void {
        let existingBounds: Rect = actualObject.wrapper.bounds; let updateSelector: boolean = false; let points: PointModel[] = [];
        updateSelector = this.connectorProprtyChangeExtend(actualObject, oldProp, newProp, updateSelector);
        if (newProp.visible !== undefined) { this.updateElementVisibility(actualObject.wrapper, actualObject, actualObject.visible); }
        if (newProp.sourcePoint !== undefined || newProp.targetPoint !== undefined
            || newProp.sourceID !== undefined || newProp.targetID !== undefined ||
            newProp.sourcePortID !== undefined || newProp.targetPortID !== undefined ||
            newProp.type !== undefined || newProp.segments !== undefined) {
            if ((newProp.sourceID !== undefined && newProp.sourceID !== oldProp.sourceID) || newProp.sourcePortID) {
                let sourceNode: Node = this.nameTable[actualObject.sourceID];
                if (!sourceNode || canOutConnect(sourceNode)) {
                    actualObject.sourceWrapper = sourceNode ? this.getEndNodeWrapper(sourceNode, actualObject, true) : undefined;
                }
                if (newProp.sourceID !== undefined && oldProp.sourceID !== undefined && oldProp.sourceID !== '') {
                    let oldSource: Node = this.nameTable[oldProp.sourceID];
                    if (oldSource !== undefined && oldSource.outEdges && oldSource.outEdges.indexOf(actualObject.id) !== -1) {
                        removeItem(oldSource.outEdges, actualObject.id);
                    }
                }
                this.updateEdges(actualObject);
            }
            if (newProp.targetID !== undefined && newProp.targetID !== oldProp.targetID) {
                let targetNode: Node = this.nameTable[newProp.targetID];
                if (!targetNode || canInConnect(targetNode)) {
                    actualObject.targetWrapper = targetNode ? this.getEndNodeWrapper(targetNode, actualObject, false) : undefined;
                }
                if (oldProp !== undefined && oldProp.targetID !== undefined && oldProp.targetID !== '') {
                    let oldTarget: Node = this.nameTable[oldProp.targetID];
                    if (oldTarget !== undefined && oldTarget.inEdges && oldTarget.inEdges.indexOf(actualObject.id) !== -1) {
                        removeItem(oldTarget.inEdges, actualObject.id);
                    }
                }
                this.updateEdges(actualObject);
            }
            if (newProp.sourcePortID !== undefined && newProp.sourcePortID !== oldProp.sourcePortID) {
                let source: Canvas;
                if (actualObject.sourceID && this.nameTable[actualObject.sourceID]) {
                    source = this.nameTable[actualObject.sourceID].wrapper;
                }
                actualObject.sourcePortWrapper = source ?
                    this.getWrapper(source, newProp.sourcePortID) : undefined;
            }
            if (newProp.targetPortID !== undefined && newProp.targetPortID !== oldProp.targetPortID) {
                let target: Canvas;
                if (actualObject.targetID && this.nameTable[actualObject.targetID]) {
                    target = this.nameTable[actualObject.targetID].wrapper;
                }
                actualObject.targetPortWrapper = target ?
                    this.getWrapper(target, newProp.targetPortID) : undefined;
            }
            points = this.getPoints(actualObject);
        }
        //Add prop change for zindex, alignments and margin
        if (newProp.style !== undefined) {
            updateStyle(newProp.style, actualObject.wrapper.children[0]);
        }
        if (points.length > 0 || newProp.sourceDecorator !== undefined || newProp.targetDecorator !== undefined ||
            newProp.cornerRadius !== undefined) {
            updateConnector(actualObject, points.length > 0 ? points : actualObject.intermediatePoints);
            if (newProp.type !== undefined) {
                updateSelector = true;
            }
            if (points.length > 0) {
                actualObject.wrapper.measure(new Size(actualObject.wrapper.width, actualObject.wrapper.height));
                actualObject.wrapper.arrange(actualObject.wrapper.desiredSize);
                if (actualObject.annotations.length) {
                    for (let annotation of actualObject.annotations) {
                        let annotationWrapper: TextElement;
                        annotationWrapper = this.getWrapper(actualObject.wrapper, annotation.id) as TextElement;
                        actualObject.updateAnnotation(
                            annotation as PathAnnotation,
                            actualObject.intermediatePoints, actualObject.wrapper.bounds, annotationWrapper);
                    }
                }
                actualObject.wrapper.measure(new Size(actualObject.wrapper.width, actualObject.wrapper.height));
                actualObject.wrapper.arrange(actualObject.wrapper.desiredSize);
                this.updateObject(actualObject, oldProp, newProp);

            } //work-around to update intersected connector bridging
        }
        if ((newProp.sourcePoint || newProp.targetPoint || newProp.segments)
            && this.diagramActions === DiagramAction.Render) {
            updateSelector = true;
        }
        if (!disableBridging) {
            this.updateBridging();
        }
        this.updateAnnotations(newProp, actualObject);
        actualObject.wrapper.measure(new Size(actualObject.wrapper.width, actualObject.wrapper.height));
        actualObject.wrapper.arrange(actualObject.wrapper.desiredSize);
        if (existingBounds.equals(existingBounds, actualObject.wrapper.bounds) === false) {
            this.updateQuad(actualObject);
            this.updateGroupSize(actualObject);
        }
        if (updateSelector === true && this.checkSelectedItem(actualObject) && (!(this.diagramActions & DiagramAction.ToolAction))) {
            this.updateSelector();
        }
        if (this.mode === 'SVG' && !this.preventConnectorsUpdate) {
            this.updateDiagramObject(actualObject);
        }
    }

    private getPoints(actualObject: Connector, points?: PointModel[]): PointModel[] {
        let pts: PointModel[];
        pts = actualObject.getConnectorPoints(
            actualObject.type, points,
            this.layout.type === 'ComplexHierarchicalTree' || this.layout.type === 'HierarchicalTree' ?
                this.layout.orientation : undefined);
        return pts;
    }

    /**
     * update the  opacity  and visibility for the node  once the layout animation starts
     */
    /** @private */
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
     * checkSelected Item for Connector
     * @private
     */
    public checkSelectedItem(actualObject: Connector | Node): boolean {
        let selectorModel: SelectorModel = this.selectedItems;
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
     * Updates the visibility of the diagram container
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
     * Updates the visibility of the node/connector
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
                    for (let child of obj.children) {
                        this.updateElementVisibility(this.nameTable[child].wrapper, this.nameTable[child], visible);
                    }
                }
                //ports
                if (obj.ports) {
                    for (let port of obj.ports) {
                        if (port.visibility & PortVisibility.Visible) {
                            let wrapper: DiagramElement = this.getWrapper(element, port.id);
                            wrapper.visible = visible;
                        }
                    }
                }
                if (obj.annotations) {
                    for (let annotation of obj.annotations) {
                        let wrapper: DiagramElement = this.getWrapper(element, annotation.id);
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
                for (let annotation of obj.annotations) {
                    let wrapper: DiagramElement = this.getWrapper(element, annotation.id);
                    wrapper.visible = visible;
                }
            }
            if (obj.expandIcon || obj.collapseIcon) {
                let wrapper: Container = this.getWrapper(element, 'icon_content') as Container;
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
                    this.updateDiagramObject(this.nameTable[element.id]);
                }
            }
        }
    }

    private updateAnnotations(newProp: Connector, actualObject: Connector): void {
        if (newProp.annotations !== undefined) {
            for (let key of Object.keys(newProp.annotations)) {
                let index: number = Number(key);
                let changedObject: AnnotationModel = newProp.annotations[key];
                let actualAnnotation: AnnotationModel = actualObject.annotations[index];
                this.updateAnnotation(changedObject, actualAnnotation, actualObject.wrapper, actualObject);
            }
        }
    }

    /** @private */
    public updateAnnotation(
        changedObject: AnnotationModel, actualAnnotation: ShapeAnnotationModel, nodes: Container,
        actualObject?: Object, canUpdateSize?: boolean): void {
        let annotationWrapper: TextElement; let isMeasure: boolean = false;
        annotationWrapper = this.getWrapper(nodes, actualAnnotation.id) as TextElement;
        if (annotationWrapper !== undefined) {

            if (changedObject.width !== undefined && changedObject.height !== undefined) {
                annotationWrapper.width = changedObject.width; annotationWrapper.height = changedObject.height;
                isMeasure = true;
            }
            if (changedObject.rotateAngle !== undefined) {
                annotationWrapper.rotateAngle = changedObject.rotateAngle;
            }
            if (canUpdateSize) {
                annotationWrapper.refreshTextElement();
            }
            if (actualAnnotation instanceof PathAnnotation && (changedObject as PathAnnotationModel).segmentAngle !== undefined) {
                annotationWrapper.rotateAngle = actualAnnotation.rotateAngle;
            }
            if (actualAnnotation instanceof ShapeAnnotation &&
                (changedObject as ShapeAnnotationModel).offset !== undefined) {
                let offset: PointModel = (changedObject as ShapeAnnotationModel).offset;
                isMeasure = true;
                let offsetX: number = offset.x !== undefined ? offset.x :
                    actualAnnotation.offset.x;
                let offsetY: number = offset.y !== undefined ? offset.y :
                    actualAnnotation.offset.y;
                annotationWrapper.setOffsetWithRespectToBounds(offsetX, offsetY, 'Fraction');
                annotationWrapper.relativeMode = 'Point';
            } else if (actualAnnotation instanceof PathAnnotation &&
                ((changedObject as PathAnnotationModel).offset !== undefined ||
                    (changedObject as PathAnnotationModel).segmentAngle !== undefined)) {
                (actualObject as Connector).updateAnnotation(
                    actualAnnotation, (actualObject as Connector).intermediatePoints,
                    (actualObject as Connector).wrapper.bounds, annotationWrapper);
            }
            if ((actualAnnotation instanceof PathAnnotation) && (changedObject as PathAnnotation).displacement) {
                if ((changedObject as PathAnnotation).displacement.x !== undefined ||
                    (changedObject as PathAnnotation).displacement.y !== undefined) {
                    isMeasure = true;
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
                let updateSelector: boolean = false;
                if ((annotationWrapper.constraints & AnnotationConstraints.Select) &&
                    (!(changedObject.constraints & AnnotationConstraints.Select)) &&
                    isSelected(this, actualObject, false, annotationWrapper)) {
                    updateSelector = true;
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
            if (changedObject.content !== undefined) {
                if (annotationWrapper as TextElement) {
                    isMeasure = true;
                    (annotationWrapper as TextElement).content = changedObject.content;
                }
            }
            if (isMeasure === true) {
                annotationWrapper.measure(new Size(annotationWrapper.width, annotationWrapper.height));
                annotationWrapper.arrange(annotationWrapper.desiredSize);
            }
            annotationWrapper.refreshTextElement();
            // this.refresh(); this.refreshDiagramLayer();
        }
    }

    /** @private */
    public updatePort(changedObject: PointPortModel, actualPort: PointPortModel, nodes: Container): void {
        let portWrapper: DiagramElement; let isMeasure: boolean = false;
        portWrapper = this.getWrapper(nodes, actualPort.id);
        if (portWrapper !== undefined) {

            if (changedObject.offset !== undefined) {
                isMeasure = true;
                let offsetX: number = changedObject.offset.x !== undefined ? changedObject.offset.x :
                    actualPort.offset.x;
                let offsetY: number = changedObject.offset.y !== undefined ? changedObject.offset.y :
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
                    let pathdata: string = getPortShape(changedObject.shape);
                    (portWrapper as PathElement).data = pathdata;
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

    /** @private */
    public updateIcon(actualObject: Node): void {
        let iconContainer: Canvas = this.getWrapper(actualObject.wrapper, 'icon_content') as Canvas;
        let diagramId: string = (this.diagramActions & DiagramAction.Render) ? this.element.id : undefined;
        if (iconContainer) {
            if (this.mode === 'SVG') {
                let icon: HTMLElement = getDiagramElement(actualObject.wrapper.id + '_icon_content', diagramId);
                if (icon) {
                    let iconRect: HTMLElement = getDiagramElement(icon.id + '_rect', diagramId);
                    let iconShape: HTMLElement = getDiagramElement(icon.id + '_shape', diagramId);
                    let nativeContent: HTMLElement = getDiagramElement(iconShape.id + '_native_element', diagramId);
                    if (nativeContent) {
                        nativeContent.parentNode.removeChild(nativeContent);
                    }
                    iconShape.parentNode.removeChild(iconShape);
                    iconRect.parentNode.removeChild(iconRect);
                    icon.parentNode.removeChild(icon);
                }
            }
            let index: number = actualObject.wrapper.children.indexOf(iconContainer);
            actualObject.wrapper.children.splice(index, 1);
        }
        let portContainer: Container = this.getPortContainer(actualObject);
        actualObject.initIcons(this.getDescription, this.layout, portContainer, this.element.id);
    }

    private getPortContainer(actualObject: Node): Container {
        if (actualObject.children) {
            for (let i: number = 0; i < actualObject.wrapper.children.length; i++) {
                if (actualObject.wrapper.children[i].id === 'group_container') {
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
    }
    /** @private */
    public updateQuad(obj: IElement): void {
        let modified: boolean = this.spatialSearch.updateQuad(obj.wrapper);
        if (modified && !this.preventUpdate) {
            this.updatePage();
        }
    }
    /** @private */
    public removeFromAQuad(obj: IElement): void {
        this.spatialSearch.removeFromAQuad(obj.wrapper);
        let modified: boolean = this.spatialSearch.updateBounds(obj.wrapper);
        if (modified && !this.preventUpdate) {
            this.updatePage();
        }
        if ((obj as NodeModel).children) {
            let child: NodeModel;
            let children: string[] = (obj as NodeModel).children;
            for (let i: number = 0; i < children.length; i++) {
                child = this.nameTable[children[i]];
                if (child) {
                    this.removeFromAQuad(child as Node);
                }
            }
        }
    }
    /** @private */
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
        if (this.diagramActions & DiagramAction.Render) {
            this.scroller.setSize();
            this.scroller.updateScrollOffsets();
            //updating overview
            for (let temp of this.views) {
                let view: View = this.views[temp];
                if (!(view instanceof Diagram)) {
                    view.updateView(view);
                }
            }
        }
    }

    /** @private */
    public protectPropertyChange(enable: boolean): void {
        this.isProtectedOnChange = enable;
    }

    /** @private */
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

    //property changes - end region
    /* tslint:disable */
    private initDroppables(): void {
        // initiates droppable event
        let childTable: {} = {};
        let entryTable: {} = {};
        this.droppable = new Droppable(this.element);
        this.droppable.accept = '.e-dragclone';
        // tslint:disable-next-line:no-any
        this.droppable.over = (args: any) => {
            if (!this.currentSymbol) {
                if (args.dragData) {
                    let newObj: NodeModel | Connector;
                    let position: PointModel = this.eventHandler.getMousePosition(args.event);
                    let clonedObject: Object; let selectedSymbol: HTMLElement = args.dragData.helper;
                    let paletteId: string = selectedSymbol.getAttribute('paletteId');
                    if (paletteId) {
                        let sourceElement: Object = (document.getElementById(paletteId) as EJ2Instance).ej2_instances[0];
                        let source: string = 'sourceElement';
                        this.droppable[source] = sourceElement;
                        let selectedSymbols: string = 'selectedSymbols';
                        let childtable: string = 'childTable';
                        if (sourceElement) {
                            let obj: IElement = sourceElement[selectedSymbols];
                            clonedObject = cloneObject(sourceElement[selectedSymbols]);
                            childTable = sourceElement[childtable];
                            let wrapper: DiagramElement = (obj.wrapper.children[0] as Container).children[0];
                            if (sourceElement[selectedSymbols] instanceof Node) {
                                (clonedObject as Node).offsetX = position.x + 5 + ((clonedObject as Node).width || wrapper.actualSize.width) / 2;
                                (clonedObject as Node).offsetY = position.y + ((clonedObject as Node).height || wrapper.actualSize.height) / 2;
                                let newNode: Node = new Node(this, 'nodes', clonedObject as NodeModel, true);
                                if (newNode.shape.type === 'Bpmn' && (newNode.shape as BpmnShape).activity.subProcess.processes
                                    && (newNode.shape as BpmnShape).activity.subProcess.processes.length) {
                                    (newNode.shape as BpmnShape).activity.subProcess.processes = [];
                                }
                                newObj = newNode;
                                if ((clonedObject as Node).children) {
                                    let parentNode: Node = (clonedObject as Node);
                                    let tempTable: {} = {};
                                    entryTable = this.getChildren(parentNode, tempTable, childTable);
                                    arrangeChild(parentNode, -parentNode.offsetX, -parentNode.offsetY, entryTable, true, this);
                                }
                            } else if (sourceElement[selectedSymbols] instanceof Connector) {
                                newObj = new Connector(this, 'connectors', clonedObject as ConnectorModel, true);
                                let bounds: Rect = Rect.toBounds([newObj.sourcePoint, newObj.targetPoint]);
                                let tx: number = position.x - bounds.center.x;
                                let ty: number = position.y - bounds.center.y;
                                newObj.sourcePoint.x += tx; newObj.sourcePoint.y += ty;
                                newObj.targetPoint.x += tx; newObj.targetPoint.y += ty;
                            }
                            newObj.id += randomId();
                            let arg: IDragEnterEventArgs = {
                                source: sourceElement, element: newObj as Node, cancel: false,
                                diagram: this
                            };
                            this['enterObject'] = newObj;
                            this['enterTable'] = entryTable;
                            this.triggerEvent(DiagramEvent.dragEnter, arg);
                            if (!this.activeLayer.lock && !arg.cancel) {
                                this.preventUpdate = true;
                                if ((newObj as Node).children) {
                                    this.findChild((newObj as Node), entryTable);
                                }
                                this.preventUpdate = true;
                                this.initObject(newObj as IElement, undefined, undefined, true);
                                this.currentSymbol = newObj as Node | Connector;
                                if (this.mode !== 'SVG') {
                                    this.refreshDiagramLayer();
                                }
                                this.commandHandler.select(newObj);
                                this.eventHandler.mouseDown(args.event);
                                this.eventHandler.mouseMove(args.event, args);
                                this.preventUpdate = false; this.updatePage(); selectedSymbol.style.opacity = '0';
                            }
                            delete this['enterObject'];
                            delete this['enterTable'];
                        }
                        this.droppable[selectedSymbols] = selectedSymbol;
                    }
                }
            } else {
                if (args.event.touches && args.event.touches.length) {
                    this.eventHandler.mouseMove(args.event, args.event.touches);
                }
            }
        };
        // tslint:disable-next-line:no-any
        this.droppable.drop = (args: any) => {
            if (this.currentSymbol) {
                if (args.event.touches) {
                    this.eventHandler.mouseUp(args.event);
                }
                let newObj: NodeModel | Connector; let node: Node; let conn: Connector;
                let source: string = 'sourceElement';
                let arg: IDropEventArgs = {
                    source: this.droppable[source],
                    element: this.currentSymbol,
                    target: this.eventHandler['hoverNode'] || this, cancel: false,
                    position: { x: this.currentSymbol.wrapper.offsetX, y: this.currentSymbol.wrapper.offsetY }
                };
                this.triggerEvent(DiagramEvent.drop, arg); let clonedObject: Object; let id: string = 'id';
                clonedObject = cloneObject(this.currentSymbol); clonedObject['hasTarget'] = this.currentSymbol['hasTarget'];
                this.removeFromAQuad(this.currentSymbol);
                this.removeObjectsFromLayer(this.nameTable[this.currentSymbol.id]);
                this.removeElements(this.currentSymbol);
                if (arg.cancel) { this.removeChildNodes(this.currentSymbol as Node) }
                delete this.nameTable[this.currentSymbol.id]; this.currentSymbol = null;
                this.protectPropertyChange(true);
                if (!arg.cancel) {
                    this.startGroupAction();
                    if (((clonedObject as Node).shape as BpmnShape).type === 'Bpmn' && ((clonedObject as Node).shape as BpmnShape).annotation
                        && clonedObject['hasTarget']) {
                        let nodeId: string = (((clonedObject as Node).shape as BpmnShape).annotation as BpmnAnnotation).nodeId;
                        ((clonedObject as Node).shape as BpmnShape).annotation.id = (clonedObject as Node).id;
                        this.addTextAnnotation(((clonedObject as Node).shape as BpmnShape).annotation, this.nameTable[nodeId]);
                        (clonedObject as BpmnAnnotation).nodeId = '';
                    }
                    if ((clonedObject as Node).children) {
                        this.addChildNodes(clonedObject);
                    }
                    this.add(clonedObject, true);
                    if (canSingleSelect(this)) {
                        this.select([this.nameTable[clonedObject[id]]]);
                    }
                }
                this.protectPropertyChange(false);
                newObj = this.nameTable[clonedObject[id]];
                if (clonedObject['hasTarget']) {
                    (clonedObject as BpmnAnnotation).nodeId = clonedObject['hasTarget'];
                    this.remove(clonedObject);
                }
                if (this.bpmnModule && newObj instanceof Node && (clonedObject as Node).processId) {
                    newObj.processId = (clonedObject as Node).processId;
                    this.bpmnModule.dropBPMNchild(this.nameTable[newObj.processId], newObj, this);
                }
                this.endGroupAction();
                if (this.mode !== 'SVG') { this.refreshDiagramLayer(); }

                delete this.droppable[source];
            }
            let selectedSymbols: string = 'selectedSymbols'; remove(this.droppable[selectedSymbols]);
        };
        this.droppable.out = (args: Object) => {
            if (this.currentSymbol && !this.eventHandler.focus) {
                this.unSelect(this.currentSymbol); this.removeFromAQuad(this.currentSymbol);
                if (this.mode !== 'SVG' && this.currentSymbol.shape.type === 'Native') {
                    this.removeElements(this.currentSymbol);
                }
                this.removeObjectsFromLayer(this.nameTable[this.currentSymbol.id]);
                delete this.nameTable[this.currentSymbol.id];
                this.triggerEvent(DiagramEvent.dragLeave, { element: this.currentSymbol, diagram: this });
                if (this.mode !== 'SVG') { this.refreshDiagramLayer(); } else {
                    this.removeElements(this.currentSymbol);
                }
                this.currentSymbol = null; let selectedSymbols: string = 'selectedSymbols';
                this.droppable[selectedSymbols].style.opacity = '1';
                let source: string = 'sourceElement';
                delete this.droppable[source];
            }
        };
    }
    private removeChildNodes(node: NodeModel): void {
        if (node instanceof Node && node.children) {
            for (let i: number = 0; i < node.children.length; i++) {
                if (this.nameTable[node.children[i]].children) {
                    this.removeChildNodes(node);
                }
                this.removeFromAQuad(this.nameTable[node.children[i]]);
                this.removeObjectsFromLayer(this.nameTable[node.children[i]]);
                delete this.nameTable[node.children[i]];
            }
        }
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
}