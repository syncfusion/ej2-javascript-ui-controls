import { ModuleDeclaration } from '@syncfusion/ej2-base';
import { SelectedItem } from '@syncfusion/ej2-lists';
import { ContextMenu, ContextMenuModel } from '@syncfusion/ej2-navigations';
import { Diagram } from '../diagram';
import { Gridlines } from '../diagram/grid-lines';
import { ContextMenuSettings } from '../diagram/keyboard-commands';
import { Layer } from '../diagram/layer';
import { DiagramRuler } from '../diagram/ruler-settings';
import { DiagramConstraints, DiagramTools, SelectorConstraints, SnapConstraints } from '../enum/enum';
import { Connector } from '../objects/connector';
import { ConnectorModel } from '../objects/connector-model';
import { ContextMenuItemModel } from '../objects/interface/interfaces';
import { NodeModel } from '../objects/node-model';
import { ConnectorProperties } from './connectorProperties';
import { LabelProperties } from './labelProperties';
import { NodeProperties } from './nodeProperties';
import { PortProperties } from './portProperties';


export class Ej1Serialization {

    private diagram: Diagram;

    public labelProperties: LabelProperties = new LabelProperties(this);
    public connectorProperties: ConnectorProperties  =  new ConnectorProperties(this.labelProperties);
    public portProperties: PortProperties = new PortProperties(this);

    public nodeProperties: NodeProperties = new NodeProperties(this.labelProperties, this.portProperties);
    constructor(diagram: Diagram) {
        this.diagram = diagram;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public convertedData: any = {};
    //(EJ2-272287) Provide support to convert the EJ1 diagram to EJ2 diagram
    //Getting the object data from the load diagram and serialize it into from EJ1 to EJ2
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public getSerializedData(data: Object) : any {
        this.convertedData.mode = 'SVG';
        this.convertedData.basicElements = [];
        this.convertedData.width = (data as Diagram).width;
        this.convertedData.height = (data as Diagram).height;
        if ((data as Diagram).nodes && (data as Diagram).nodes.length > 0) {
            this.nodeProperties.renderNodesCollection(this.convertedData, data);
        }
        else {
            this.convertedData.nodes = (data as Diagram).nodes;
        }
        if ((data as Diagram).connectors && (data as Diagram).connectors.length > 0) {
            this.connectorProperties.renderConnectorsCollection(this.convertedData, (data as Diagram));
        }
        else {
            this.convertedData.connectors = (data as Diagram).connectors;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((data as any).defaultSettings !== undefined) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.convertedData.getNodeDefaults = this.getNodeDefaults((data as any).defaultSettings.node);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.convertedData.getConnectorDefaults = this.getConnectorDefaults((data as any).defaultSettings.connector);
        }
        //this.convertedData.setNodeTemplate = this.getNodeTemplate((data as Diagram).nodeTemplate);

        //969490- Prevent Exception Handling When Loading EJ1 JSON Data into EJ2 Components
        (data as Diagram).layers = (data as Diagram).layers || [];
        (data as Diagram).dataSourceSettings = (data as Diagram).dataSourceSettings || {};
        (data as Diagram).dataSourceSettings.crudAction = (data as Diagram).dataSourceSettings.crudAction || {};
        (data as Diagram).rulerSettings = (data as Diagram).rulerSettings || {};
        (data as Diagram).rulerSettings.horizontalRuler = (data as Diagram).rulerSettings.horizontalRuler || {};
        (data as Diagram).rulerSettings.verticalRuler = (data as Diagram).rulerSettings.verticalRuler || {};
        (data as Diagram).snapSettings = (data as Diagram).snapSettings || {};
        (data as any).snapSettings.horizontalGridLines = (data as any).snapSettings.horizontalGridLines || {};
        (data as any).snapSettings.verticalGridLines = (data as any).snapSettings.verticalGridLines || {};
        (data as any).snapSettings.snapConstraints = SnapConstraints.All;
        (data as Diagram).pageSettings = (data as Diagram).pageSettings || {};
        (data as any).pageSettings.scrollLimit = (data as any).pageSettings.scrollLimit || 'Diagram';
        (data as any).pageSettings.pageOrientation = (data as any).pageSettings.pageOrientation || 'Landscape';
        (data as Diagram).pageSettings.boundaryConstraints = (data as Diagram).pageSettings.boundaryConstraints || 'Diagram';
        (data as any).pageSettings.pageBackgroundColor = (data as any).pageSettings.pageBackgroundColor || 'transparent';
        (data as any).backgroundImage = (data as any).backgroundImage || {};
        (data as Diagram).tooltip = (data as Diagram).tooltip || {};
        (data as Diagram).scrollSettings = (data as Diagram).scrollSettings || {};
        (data as Diagram).layout = (data as Diagram).layout || {};
        (data as Diagram).layout.margin = (data as Diagram).layout.margin || { left: 0, right: 0, top: 0, bottom: 0 };
        (data as Diagram).layout.horizontalAlignment = (data as Diagram).layout.horizontalAlignment || 'Auto';
        (data as Diagram).layout.verticalAlignment = (data as Diagram).layout.verticalAlignment || 'Auto';
        (data as Diagram).layout.type = (data as Diagram).layout.type || 'None';
        (data as Diagram).selectedItems = (data as Diagram).selectedItems || {};
        (data as Diagram).selectedItems.constraints = (data as Diagram).selectedItems.constraints || SelectorConstraints.All;
        (data as Diagram).constraints = (data as Diagram).constraints || DiagramConstraints.Default;
        (data as Diagram).tool = (data as Diagram).tool || DiagramTools.None;
        (data as Diagram).scrollSettings.horizontalOffset = -(data as Diagram).scrollSettings.horizontalOffset || 0;
        (data as Diagram).scrollSettings.verticalOffset = -(data as Diagram).scrollSettings.verticalOffset || 0;
        if (!(data as any).pageSettings.pageWidth) {
            (data as any).pageSettings.pageWidth = (data as any).scrollSettings.viewPortWidth;
        }
        if (!(data as any).pageSettings.pageHeight) {
            (data as any).pageSettings.pageHeight = (data as any).scrollSettings.viewPortHeight;
        }

        this.setLayers(this.convertedData, (data as Diagram));
        this.setDataSourceSettings(this.convertedData, data);
        this.setRulerSettings(this.convertedData, data);
        this.setSnapSettings(this.convertedData, data);
        if ((data as any).snapSettings.enableSnapToObject) {
            this.convertedData.snapSettings.constraints = this.convertedData.snapSettings.constraints | SnapConstraints.SnapToObject;
        } else {
            this.convertedData.snapSettings.constraints = this.convertedData.snapSettings.constraints & ~SnapConstraints.SnapToObject;
        }
        if ((data as any).pageSettings.backgroundImage === undefined) {
            (data as any).pageSettings.backgroundImage = {
                source: '',
                scale: 'meet',
                alignment: 'xmidymid'
            };
            (data as any).pageSettings.showPageBreak = false;
        }
        this.setScrollSettings(this.convertedData, data);
        this.setPageSettings(this.convertedData, data);
        this.setContextMenu(this.convertedData, data);
        this.setTooltip(this.convertedData, data);
        this.setModelLayout(this.convertedData, data);
        this.setSelectedItems(this.convertedData, data);
        this.convertedData.constraints = this.setDiagramConstraints((data as any).constraints);
        this.convertedData.tool = this.setDiagramTool((data as any).tool);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.convertedData.drawType = (data as any).drawType;
        this.convertedData.commandManager = (data as any).commandManager;
        return this.convertedData;
    }


    //(EJ2-272287) Provide support to convert the EJ1 diagram to EJ2 diagram
    //declare the node default properties
    public getNodeDefaults(node: NodeModel) : NodeModel {
        if (node) {
            return this.nodeProperties.convertToNode(node);
        } else {
            return null;
        }
    }
    //(EJ2-272287) Provide support to convert the EJ1 diagram to EJ2 diagram
    //declare the node default properties
    public getConnectorDefaults(connector: ConnectorModel) : ConnectorModel {
        if (connector) {
            return this.connectorProperties.convertToConnector(connector);
        } else {
            return null;
        }
    }

    //(EJ2-272287) Provide support to convert the EJ1 diagram to EJ2 diagram
    //Update the layers from the EJ1 JSON
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public setLayers(convertedData: Object | any, data: Diagram) : void {
        convertedData.layers = [];
        if (data.layers.length > 0) {
            for (let i : number = 0; i < data.layers.length; i++) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const newLayer: any = {};
                const layer : any = data.layers[parseInt(i.toString(), 10)];
                newLayer.id = layer.name;
                newLayer.visible = layer.visible;
                newLayer.lock = layer.lock;
                newLayer.objects = layer.objects;
                convertedData.layers.push(newLayer);
            }
        }
    }

    //(EJ2-272287) Provide support to convert the EJ1 diagram to EJ2 diagram
    //Update the dataSourceSettings from EJ1 to EJ2
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public setDataSourceSettings(convertedData: Object | any, data: Object | any) : void {
        convertedData.dataSourceSettings = {};
        convertedData.dataSourceSettings.id = data.dataSourceSettings.id;
        convertedData.dataSourceSettings.dataManager = data.dataSourceSettings.dataSource;
        convertedData.dataSourceSettings.root = data.dataSourceSettings.root;
        convertedData.dataSourceSettings.parentId = data.dataSourceSettings.parent;
        convertedData.dataSourceSettings.crudAction = {
            read: data.dataSourceSettings.crudAction.read,
            create: data.dataSourceSettings.crudAction.create,
            update: data.dataSourceSettings.crudAction.update,
            destroy: data.dataSourceSettings.crudAction.destroy,
            customFields: data.dataSourceSettings.customFields
        };
        if (data.dataSourceSettings.connectionDataSource) {
            convertedData.dataSourceSettings.connectionDataSource = {};
            convertedData.dataSourceSettings.connectionDataSource.id = data.dataSourceSettings.connectionDataSource.id;
            convertedData.dataSourceSettings.connectionDataSource.dataManager = data.dataSourceSettings.connectionDataSource.dataSource;
            convertedData.dataSourceSettings.connectionDataSource.sourceID = data.dataSourceSettings.connectionDataSource.sourceNode;
            convertedData.dataSourceSettings.connectionDataSource.targetID = data.dataSourceSettings.connectionDataSource.targetNode;
            convertedData.dataSourceSettings.connectionDataSource.sourcePointX = data.dataSourceSettings.connectionDataSource.sourcePointX;
            convertedData.dataSourceSettings.connectionDataSource.sourcePointY = data.dataSourceSettings.connectionDataSource.sourcePointY;
            convertedData.dataSourceSettings.connectionDataSource.targetPointX = data.dataSourceSettings.connectionDataSource.targetPointX;
            convertedData.dataSourceSettings.connectionDataSource.targetPointY = data.dataSourceSettings.connectionDataSource.targetPointY;
            convertedData.dataSourceSettings.connectionDataSource.crudAction = {
                read: data.dataSourceSettings.connectionDataSource.crudAction.read,
                create: data.dataSourceSettings.connectionDataSource.crudAction.create,
                update: data.dataSourceSettings.connectionDataSource.crudAction.update,
                destroy: data.dataSourceSettings.connectionDataSource.crudAction.destroy,
                customFields: data.dataSourceSettings.connectionDataSource.customFields
            };
        }
    }
    //(EJ2-272287) Provide support to convert the EJ1 diagram to EJ2 diagram
    //Update the ruler settings
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public setRulerSettings(convertedData: Object | any, data: Object | any): void {
        convertedData.rulerSettings = {};
        convertedData.rulerSettings.showRulers = data.rulerSettings.showRulers;
        convertedData.rulerSettings.horizontalRuler = this.setRulerProperties(data.rulerSettings.horizontalRuler);
        convertedData.rulerSettings.verticalRuler = this.setRulerProperties(data.rulerSettings.verticalRuler);
    }

    //(EJ2-272287) Provide support to convert the EJ1 diagram to EJ2 diagram
    //Update the orientation of the ruler
    public setRulerProperties(ruler: any) : any {
        const rulerProperties: any = {};
        rulerProperties.interval = ruler.interval;
        rulerProperties.segmentWidth = ruler.segmentWidth;
        // rulerProperties.tickAlignment = ruler.tickAlignment === 'rightorbottom' ? 'RightOrBottom' : 'LeftOrTop';
        rulerProperties.markerColor = ruler.markerColor;
        rulerProperties.thickness = ruler.thickness;
        rulerProperties.arrangeTick = ruler.arrangeTick;
        return rulerProperties;
    }

    //(EJ2-272287) Provide support to convert the EJ1 diagram to EJ2 diagram
    //Update the snap settings
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public setSnapSettings(convertedData: Object | any, data: Object | any) : void {
        convertedData.snapSettings = {};
        if (data.snapSettings) {
            convertedData.snapSettings.horizontalGridLines = this.setGridLines(data.snapSettings.horizontalGridLines);
            convertedData.snapSettings.verticalGridLines = this.setGridLines(data.snapSettings.verticalGridLines);
            convertedData.snapSettings.snapAngle = data.snapSettings.snapAngle;
            convertedData.snapSettings.snapObjectDistance = data.snapSettings.snapObjectDistance;
            convertedData.snapSettings.constraints = this.setSnapConstraints(data.snapSettings.snapConstraints);
        }
    }

    //(EJ2-272287) Provide support to convert the EJ1 diagram to EJ2 diagram
    //Update the snap constraints from EJ1 to EJ2
    public setSnapConstraints(constraints: number) : number {
        let snapConstraints : number = SnapConstraints.None;
        if (constraints & SnapConstraints.ShowHorizontalLines) {
            snapConstraints = snapConstraints | SnapConstraints.ShowHorizontalLines;
        }
        if (constraints & SnapConstraints.ShowVerticalLines) {
            snapConstraints = snapConstraints | SnapConstraints.ShowVerticalLines;
        }
        if (constraints & SnapConstraints.ShowLines) {
            snapConstraints = snapConstraints | SnapConstraints.ShowLines;
        }
        if (constraints & SnapConstraints.SnapToHorizontalLines) {
            snapConstraints = snapConstraints | SnapConstraints.SnapToHorizontalLines;
        }
        if (constraints & SnapConstraints.SnapToVerticalLines) {
            snapConstraints = snapConstraints | SnapConstraints.SnapToVerticalLines;
        }
        if (constraints & SnapConstraints.SnapToLines) {
            snapConstraints = snapConstraints | SnapConstraints.SnapToLines;
        }
        return snapConstraints;
    }

    //(EJ2-272287) Provide support to convert the EJ1 diagram to EJ2 diagram
    //Update the gridlines
    public setGridLines(gridlines: any) : any {
        const gridLinesProperties: any = {};
        gridLinesProperties.lineColor = gridlines.lineColor;
        gridLinesProperties.lineDashArray = gridlines.lineDashArray;
        gridLinesProperties.lineIntervals = gridlines.lineInterval;
        gridLinesProperties.snapIntervals = gridlines.snapInterval;
        return gridLinesProperties;
    }

    //(EJ2-272287) Provide support to convert the EJ1 diagram to EJ2 diagram
    //Update the scroll-settings
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public setScrollSettings(convertedData: Object | any, data: Object | any) : void {
        convertedData.scrollSettings = {
            horizontalOffset: data.scrollSettings.horizontalOffset,
            verticalOffset: data.scrollSettings.verticalOffset,
            currentZoom: data.scrollSettings.currentZoom,
            viewPortWidth: data.scrollSettings.viewPortWidth,
            viewPortHeight: data.scrollSettings.viewPortHeight,
            minZoom: data.scrollSettings.minZoom,
            maxZoom: data.scrollSettings.maxZoom,
            scrollLimit: (data.pageSettings.scrollLimit).charAt(0).toUpperCase() + (data.pageSettings.scrollLimit).slice(1),
            scrollableArea: data.pageSettings.scrollableArea,
            canAutoScroll: data.enableAutoScroll,
            autoScrollBorder: data.pageSettings.autoScrollBorder
        };
    }

    //(EJ2-272287) Provide support to convert the EJ1 diagram to EJ2 diagram
    //Update the page settings
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public setPageSettings(convertedData: Object | any, data: Object | any) : void {
        convertedData.pageSettings = {
            width: data.pageSettings.pageWidth,
            height: data.pageSettings.pageHeight,
            // eslint-disable-next-line max-len
            margin: { left: data.pageSettings.pageMargin, right: data.pageSettings.pageMargin, top: data.pageSettings.pageMargin, bottom: data.pageSettings.pageMargin },
            orientation: (data.pageSettings.pageOrientation).charAt(0).toUpperCase() + (data.pageSettings.pageOrientation).slice(1),
            // eslint-disable-next-line max-len
            boundaryConstraints: (data.pageSettings.boundaryConstraints).charAt(0).toUpperCase() + (data.pageSettings.boundaryConstraints).slice(1),
            // eslint-disable-next-line max-len
            background: { color: data.pageSettings.pageBackgroundColor, source: data.backgroundImage.source, scale: data.backgroundImage.scale, align: data.backgroundImage.align },
            multiplePage: data.pageSettings.multiplePage,
            showPageBreaks: data.pageSettings.showPageBreak
        };
    }

    //(EJ2-272287) Provide support to convert the EJ1 diagram to EJ2 diagram
    //Sets the contextmenu settings
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public setContextMenu(convertedData: Object | any, data: Object | any) : void {
        convertedData.contextMenuSettings = {};
        convertedData.contextMenuSettings.show = data.enableContextMenu;
        if (data.contextMenu !== undefined) {
            convertedData.contextMenuSettings.showCustomMenuOnly = data.contextMenu.showCustomMenuItemsOnly;
            convertedData.contextMenuSettings.items = this.getContextMenuItems(data.contextMenu.items);
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public items: any = [];

    //(EJ2-272287) Provide support to convert the EJ1 diagram to EJ2 diagram
    //Update the contextmenu items
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public getContextMenuItems(contextMenuItems: any): any {
        const menuItem: any = {};
        for (let i : number = 0; i < contextMenuItems.length; i++) {
            const oldMenuItem: any = contextMenuItems[parseInt(i.toString(), 10)];
            menuItem.id = oldMenuItem.name;
            menuItem.text = oldMenuItem.text;
            this.items.push(menuItem);
            if (contextMenuItems.subItems && contextMenuItems.subItems.length > 0) {
                this.getContextMenuItems(contextMenuItems.subItems);
            }
        }
        return this.items;
    }

    //(EJ2-272287) Provide support to convert the EJ1 diagram to EJ2 diagram
    //Update the tooltip items
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public setTooltip(convertedData: Object | any, data: Object | any) : void {
        convertedData.tooltip = {
            content: data.tooltip.templateId,
            relativeMode: data.tooltip.relativeMode
        };
    }

    //(EJ2-272287) Provide support to convert the EJ1 diagram to EJ2 diagram
    //Sets the model layout for the converted data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public setModelLayout(convertedData: Object | any, data: Object | any) : void {
        convertedData.layout = {
            fixedNode: data.layout.fixedNode,
            horizontalSpacing: data.layout.horizontalSpacing,
            verticalSpacing: data.layout.verticalSpacing,
            maxIteration: data.layout.maxIteration,
            springFactor: data.layout.springFactor,
            springLength: data.layout.springLength,
            // eslint-disable-next-line max-len
            margin: { left: data.layout.margin.left, right: data.layout.margin.right, top: data.layout.margin.top, bottom: data.layout.margin.bottom },
            horizontalAlignment: (data.layout.horizontalAlignment).charAt(0).toUpperCase() + (data.layout.horizontalAlignment).slice(1),
            verticalAlignment: (data.layout.verticalAlignment).charAt(0).toUpperCase() + (data.layout.verticalAlignment).slice(1),
            orientation: data.layout.orientation === 'toptobottom' ? 'TopToBottom' : data.layout.orientation === 'bottomtotop' ? 'BottomToTop' : data.layout.orientation === 'righttoleft' ? 'RightToLeft' : 'LeftToRight',
            connectorSegments: data.layout.getConnectorSegments,
            type: (data.layout.type).charAt(0).toUpperCase() + (data.layout.type).slice(1),
            getLayoutInfo: data.layout.getLayoutInfo,
            bounds: data.layout.bounds,
            root: data.layout.root
        };
        if (convertedData.layout && convertedData.layout.type === 'Hierarchicaltree') {
            convertedData.layout.type = 'HierarchicalTree';
        }else if (convertedData.layout && convertedData.layout.type === 'Organizationalchart'){
            convertedData.layout.type = 'OrganizationalChart';
        }else if (convertedData.layout && convertedData.layout.type === 'Radialtree'){
            convertedData.layout.type = 'RadialTree';
        }
    }

    //(EJ2-272287) Provide support to convert the EJ1 diagram to EJ2 diagram
    //Sets the selected items to convert the data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public setSelectedItems(convertedData: Object | any, data: Object | any) : void {
        convertedData.selectedItems = {};
        const nodes : NodeModel[] = [];
        const connectors : ConnectorModel[] = [];
        convertedData.selectedItems.nodes = nodes;
        convertedData.selectedItems.connectors = connectors;
        convertedData.selectedItems.offsetX = data.selectedItems.offsetX;
        convertedData.selectedItems.offsetY = data.selectedItems.offsetY;
        convertedData.selectedItems.width = data.selectedItems.width;
        convertedData.selectedItems.height = data.selectedItems.height;
        convertedData.selectedItems.rotateAngle = data.selectedItems.rotateAngle;
        convertedData.selectedItems.constraints = this.setSelectorConstraints(data.selectedItems.constraints);
        convertedData.selectedItems.userHandles = data.selectedItems.userHandles;
    }

    //(EJ2-272287) Provide support to convert the EJ1 diagram to EJ2 diagram
    //Update the selector constraints from EJ1 to EJ2
    public setSelectorConstraints(constraints: number): number {
        let selectorConstraints : number = SelectorConstraints.None;
        if (constraints & SelectorConstraints.ConnectorSourceThumb) {
            selectorConstraints = selectorConstraints | SelectorConstraints.Rotate;
        }
        if (constraints & SelectorConstraints.ResizeAll) {
            selectorConstraints = selectorConstraints | SelectorConstraints.ResizeAll;
        }
        if (constraints & SelectorConstraints.ResizeSouthEast) {
            selectorConstraints = selectorConstraints | SelectorConstraints.UserHandle;
        }
        if (constraints & SelectorConstraints.ToolTip) {
            selectorConstraints = selectorConstraints | SelectorConstraints.ToolTip;
        }
        if (constraints & SelectorConstraints.All) {
            selectorConstraints = selectorConstraints | SelectorConstraints.All;
        }
        return selectorConstraints;
    }


    //(EJ2-272287) Provide support to convert the EJ1 diagram to EJ2 diagram
    //Update the diagram constraints from EJ1 to EJ2
    public setDiagramConstraints(constraints: number): number {
        let diagramConstraints : number = DiagramConstraints.None;
        if (constraints & DiagramConstraints.UserInteraction) {
            diagramConstraints = diagramConstraints | DiagramConstraints.UserInteraction;
        }
        if (constraints & DiagramConstraints.ApiUpdate) {
            diagramConstraints = diagramConstraints | DiagramConstraints.ApiUpdate;
        }
        if (constraints & DiagramConstraints.PageEditable) {
            diagramConstraints = diagramConstraints | DiagramConstraints.PageEditable;
        }
        if (constraints & DiagramConstraints.LineRouting) {
            diagramConstraints = diagramConstraints | DiagramConstraints.Bridging;
        }
        if (constraints & DiagramConstraints.Zoom) {
            diagramConstraints = diagramConstraints | DiagramConstraints.Zoom;
        }
        if (constraints & DiagramConstraints.PanX) {
            diagramConstraints = diagramConstraints | DiagramConstraints.PanX;
        }
        if (constraints & DiagramConstraints.PanY) {
            diagramConstraints = diagramConstraints | DiagramConstraints.PanY;
        }
        if (constraints & DiagramConstraints.Pan) {
            diagramConstraints = diagramConstraints | DiagramConstraints.Pan;
        }
        if (constraints & DiagramConstraints.UndoRedo) {
            diagramConstraints = diagramConstraints | DiagramConstraints.UndoRedo;
        }
        if (constraints & DiagramConstraints.ZoomTextEdit) {
            diagramConstraints = diagramConstraints | DiagramConstraints.ZoomTextEdit;
        }
        return diagramConstraints;
    }


    //(EJ2-272287) Provide support to convert the EJ1 diagram to EJ2 diagram
    //Update the diagram tool from EJ1 to EJ2
    public setDiagramTool(tool: number): number {
        let diagramTool : number = DiagramTools.None;
        if (tool & DiagramTools.MultipleSelect) {
            diagramTool = diagramTool | DiagramTools.SingleSelect;
        }
        if (tool & DiagramTools.ZoomPan) {
            diagramTool = diagramTool | DiagramTools.MultipleSelect;
        }
        if (tool & DiagramTools.DrawOnce) {
            diagramTool = diagramTool | DiagramTools.ZoomPan;
        }
        if (tool & DiagramTools.ContinuousDraw) {
            diagramTool = diagramTool | DiagramTools.DrawOnce;
        }
        if (tool & DiagramTools.ContinuousDraw) {
            diagramTool = diagramTool | DiagramTools.ContinuousDraw;
        }
        return diagramTool;
    }

    //     /* tslint:disable */
    // /**
    //  * To provide the array of modules needed for control rendering
    //  *
    //  * @returns {ModuleDeclaration[]} To provide the array of modules needed for control rendering .\
    //  * @private
    //  */
    //  public requiredModules(): ModuleDeclaration[] {
    //     const modules: ModuleDeclaration[] = [];
    //     modules.push({
    //         member: 'NodeProperties',
    //         args: []
    //     });
    //  return modules;
    //  }

    /**
     * To destroy the ruler
     *
     * @returns {void} To destroy the ruler
     */

    public destroy(): void {
        /**
         * Destroys the Print and Export module
         */
    }

    /**
     * Get module name.
     *
     * @returns {string} Returns the module name
     */
    protected getModuleName(): string {
        /**
         * Returns the module name
         */
        return 'Ej1Serialization';
    }
}
