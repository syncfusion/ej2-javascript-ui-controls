import { BasicShape, Node } from '../objects/node';
import { Connector } from '../objects/connector';
import { BasicShapeModel, BpmnShapeModel, FlowShapeModel, NodeModel, PathModel } from '../objects/node-model';
import { ConnectorModel } from '../objects/connector-model';
import { DataSourceModel } from '../diagram/data-source-model';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { Diagram } from '../diagram';
import { randomId, getFunction } from '../utility/base-util';
import { cloneBlazorObject, getConnectorArrowType } from '../utility/diagram-util';
import { updateDefaultValues } from '../utility/diagram-util';
import { isBlazor } from '@syncfusion/ej2-base';
import { DecoratorShapes } from '../enum/enum';
import { ShapeStyleModel, StrokeStyleModel } from '../core/appearance-model';
/**
 * data source defines the basic unit of diagram
 */
export class DataBinding {

    /**
     * Constructor for the data binding module.
     * @private
     */

    constructor() {
        //constructs the data binding module
    }

    /**
     * To destroy the data binding module
     *
     * @returns {void}
     * @private
     */

    public destroy(): void {
        /**
         * Destroy method performed here
         */
    }

    /**
     * Core method to return the component name.
     *
     * @returns {string}  Core method to return the component name.
     * @private
     */
    protected getModuleName(): string {
        /**
         * Returns the module name
         */
        return 'DataBinding';
    }


    /**   @private  */
    public dataTable: Object = {};

    /**
     * Initialize nodes and connectors when we have a data as JSON
     *
     * @param {DataSourceModel} data
     * @param {Diagram} diagram
     * @private
     */

    public initData(data: DataSourceModel, diagram: Diagram): void {
        let dataSource: Object[] | JSON;
        const dataProp: string = 'data';
        const jsonProp: string = 'json';
        const dataManager: DataManager = data.dataManager || data.dataSource || {} as DataManager;
        dataSource = dataManager[`${dataProp}`] || dataManager[`${jsonProp}`] ||
            (dataManager.dataSource ? dataManager.dataSource.json : undefined);
        if (dataSource && (dataSource as Object[]).length === 0 && dataManager.dataSource.data) {
            dataSource = dataManager.dataSource.data;
        }
        if (dataSource && (dataSource as Object[]).length) {
            this.applyDataSource(data, dataSource as Object[], diagram);
            diagram.trigger('dataLoaded', { diagram: (isBlazor()) ? null : cloneBlazorObject(diagram) });
        }
    }

    /**
     * Initialize nodes and connector when we have a data as remote url
     *
     * @param {DataSourceModel} data
     * @param {Diagram} diagram
     * @private
     */

    public initSource(data: DataSourceModel, diagram: Diagram): void {
        const dataSource: DataSourceModel = data; let result: Object[];
        const mapper: DataSourceModel = data;
        if (dataSource.dataManager instanceof DataManager || dataSource.dataSource instanceof DataManager) {
            const tempObj: DataManager = mapper.dataManager || mapper.dataSource;
            const query: Query = tempObj.defaultQuery || new Query();
            const dataManager: DataManager = data.dataManager || data.dataSource;
            dataManager.executeQuery(query).then((e: Object) => {
                const prop: string = 'result';
                result = e[`${prop}`];
                if (!diagram.isDestroyed) {
                    diagram.protectPropertyChange(true);
                    this.applyDataSource(data, result, diagram);
                    diagram.refreshDiagram();
                    diagram.protectPropertyChange(false);
                    diagram.trigger('dataLoaded', { diagram: (isBlazor()) ? null : cloneBlazorObject(diagram) });
                }
            });
        }
    }

    private applyDataSource(mapper: DataSourceModel, data: Object[], diagram: Diagram): void {
        this.dataTable = {};
        let obj: Object; let firstNode: Object; let node: Node;
        let rootNodes: Object[] = [];
        const firstLevel: Object[] = []; let item: Object;
        let nextLevel: Object;
        if (data !== undefined) {
            for (let r: number = 0; r < data.length; r++) {
                obj = data[parseInt(r.toString(), 10)];
                //832886 - Rendering layout without case sensitivity
                if (obj[mapper.parentId] === undefined || obj[mapper.parentId] === null ||
                    typeof obj[mapper.parentId] !== 'object') {
                    if (isNaN(obj[mapper.parentId]) && obj[mapper.parentId] !== undefined) {
                        if (rootNodes[obj[mapper.parentId] ? obj[mapper.parentId].toLowerCase() : obj[mapper.parentId]] !== undefined) {
                            (rootNodes[obj[mapper.parentId].toLowerCase()] as DataItems).items.push(obj);
                        }
                        else {
                            rootNodes[obj[mapper.parentId] ? obj[mapper.parentId].toLowerCase() : obj[mapper.parentId]] = { items: [obj] };
                        }
                    }
                    else {
                        if (rootNodes[obj[mapper.parentId]] !== undefined) {
                            (rootNodes[obj[mapper.parentId]] as DataItems).items.push(obj);
                        } else {
                            rootNodes[obj[mapper.parentId]] = { items: [obj] };
                        }
                    }
                } else {
                    rootNodes = this.updateMultipleRootNodes(obj, rootNodes, mapper, data);
                }
                if (mapper.root && isNaN(mapper.root as any) && obj[mapper.id] && isNaN(obj[mapper.id])) {
                    if ((mapper.root).toLowerCase() === obj[mapper.id].toLowerCase()) {
                        firstNode = { items: [obj] };
                    }
                } else {
                    if (mapper.root === obj[mapper.id]) {
                        firstNode = { items: [obj] };
                    }
                }
            }
            if (firstNode) {
                firstLevel.push(firstNode);
            } else {
                for (const n of Object.keys(rootNodes)) {
                    if (!n || n === 'undefined' || n === '\'\'' || n === 'null') {
                        firstLevel.push(rootNodes[`${n}`]);
                    }
                }
            }
            for (let i: number = 0; i < firstLevel.length; i++) {
                for (let j: number = 0; j < (firstLevel[parseInt(i.toString(), 10)] as DataItems).items.length; j++) {
                    item = (firstLevel[parseInt(i.toString(), 10)] as DataItems).items[parseInt(j.toString(), 10)];
                    node = this.applyNodeTemplate(mapper, item, diagram);
                    (diagram.nodes as Node[]).push(node);
                    if (isNaN(item[mapper.id]) && item[mapper.id] !== undefined) {
                        this.dataTable[item[mapper.id].toLowerCase()] = node;
                    }
                    else {
                        this.dataTable[item[mapper.id]] = node;
                    }
                    if (isNaN(node.data[mapper.id] as any) && node.data[mapper.id] !== undefined) {
                        nextLevel = rootNodes[node.data[mapper.id].toLowerCase()];
                    }
                    else {
                        nextLevel = rootNodes[node.data[mapper.id]];
                    }
                    if (nextLevel !== undefined) {
                        this.renderChildNodes(mapper, nextLevel, node.id, rootNodes, diagram);
                    }
                }
            }
        }
        this.dataTable = null;
    }

    /**
     * updateMultipleRootNodes method is used  to update the multiple Root Nodes
     *
     * @param {Object} object
     * @param {Object[]} rootnodes
     * @param {DataSourceModel} mapper
     * @param {Object[]} data
     */

    private updateMultipleRootNodes(obj: Object, rootNodes: Object[], mapper: DataSourceModel, data: Object[]): Object[] {
        const parents: string[] = obj[mapper.parentId]; let parent: string;
        for (let i: number = 0; i < parents.length; i++) {
            if (parents[parseInt(i.toString(), 10)]) {
                if (isNaN(parents[parseInt(i.toString(), 10)] as any)) {
                    parent = (parents[parseInt(i.toString(), 10)]).toLowerCase();
                }
                else {
                    parent = (parents[parseInt(i.toString(), 10)]);
                }
                if (rootNodes[`${parent}`]) {
                    rootNodes[`${parent}`].items.push(obj);
                } else {
                    rootNodes[`${parent}`] = { items: [obj] };
                }
            }
            else {
                parent = parents[parseInt(i.toString(), 10)];
                if (rootNodes[`${parent}`]) {
                    rootNodes[`${parent}`].items.push(obj);
                } else {
                    rootNodes[`${parent}`] = { items: [obj] };
                }
            }
        }
        return rootNodes;
    }


    /**
     *  Get the node values\
     *
     * @returns { Node }    Get the node values.\
     * @param {DataSourceModel} mapper - provide the id value.
     * @param {Object} item - provide the id value.
     * @param {Diagram} diagram - provide the id value.
     *
     * @private
     */
    private applyNodeTemplate(mapper: DataSourceModel, item: Object, diagram: Diagram): Node {
        //const root: Object = item;
        const id: string = randomId();
        //const blazor: string = 'Blazor';
        const nodeModel: NodeModel = { id: id, data: item };
        //Task 895538: Flow-chart layout support for EJ2 diagram.
        //Added below code to set node shape and style based on the data.
        if (diagram.layout.type === 'Flowchart'){
            const shape: BasicShapeModel = this.getFlowChartNodeShape(item as FlowChartData) as BasicShapeModel;
            const style: ShapeStyleModel = { fill: (item as FlowChartData).color ? (item as FlowChartData).color : 'white',
                strokeColor: (item as FlowChartData).stroke ? (item as FlowChartData).stroke : 'black',
                strokeWidth: (item as FlowChartData).strokeWidth ? (item as FlowChartData).strokeWidth : 1
            };
            nodeModel.shape = shape as BasicShapeModel | BpmnShapeModel | FlowShapeModel;
            nodeModel.style = style;
            nodeModel.annotations = [{ content: (item as FlowChartData).name ? (item as FlowChartData).name : '' }];
        }
        // eslint-disable-next-line @typescript-eslint/ban-types
        const doBinding: Function = getFunction(mapper.doBinding);
        if (doBinding) {
            doBinding(nodeModel, item, diagram);
        }
        const obj: Node = new Node(diagram, 'nodes', nodeModel, true);
        updateDefaultValues(obj, nodeModel, diagram.nodeDefaults);
        if (mapper.dataMapSettings) {
            let index: number;
            let arrayProperty: string[] = [];
            let innerProperty: string[] = [];
            for (let i: number = 0; i < mapper.dataMapSettings.length; i++) {
                if (mapper.dataMapSettings[parseInt(i.toString(), 10)].property.indexOf('.') !== -1) {
                    innerProperty = this.splitString(mapper.dataMapSettings[parseInt(i.toString(), 10)].property);
                    for (let p: number = 0; p < innerProperty.length; p++) {
                        if (innerProperty[parseInt(p.toString(), 10)].indexOf('[') !== -1) {
                            index = innerProperty[parseInt(p.toString(), 10)].indexOf('[');
                            arrayProperty = innerProperty[parseInt(p.toString(), 10)].split('[');
                        }
                    }
                    if (index) {
                        if (innerProperty[2]) {
                            obj[arrayProperty[0]][innerProperty[0].charAt(index + 1)][innerProperty[1]][innerProperty[2]] =
                                item[mapper.dataMapSettings[parseInt(i.toString(), 10)].field];
                        } else {
                            const value: string = item[mapper.dataMapSettings[parseInt(i.toString(), 10)].field];
                            obj[arrayProperty[0]][innerProperty[0].charAt(index + 1)][innerProperty[1]] = value;
                        }
                    } else {
                        if (innerProperty[2]) {
                            obj[innerProperty[0]][innerProperty[1]][innerProperty[2]]
                                = item[mapper.dataMapSettings[parseInt(i.toString(), 10)].field];
                        } else {
                            obj[innerProperty[0]][innerProperty[1]] = item[mapper.dataMapSettings[parseInt(i.toString(), 10)].field];
                        }
                    }
                } else {
                    let property: string = mapper.dataMapSettings[parseInt(i.toString(), 10)].property;
                    property = property.charAt(0).toLowerCase() + property.slice(1);
                    obj[`${property}`] = item[mapper.dataMapSettings[parseInt(i.toString(), 10)].field];
                }
                index = 0;
                arrayProperty = [];
                innerProperty = [];
            }
        }
        if (!this.collectionContains(obj, diagram, mapper.id, mapper.parentId)) {
            return obj;
        } else {
            if (item[mapper.id] && isNaN(item[mapper.id])) {
                return this.dataTable[item[mapper.id].toLowerCase()];
            }
            else {
                return this.dataTable[item[mapper.id]];
            }
        }
    }
    private getFlowChartNodeShape(data: FlowChartData): BasicShapeModel | FlowShapeModel | PathModel {
        if (data.shape !== '') {
            switch (data.shape) {
            case 'Rectangle':
                return { type: 'Basic', shape: 'Rectangle' };
            case 'Decision':
                return { type: 'Flow', shape: 'Decision' };
            case 'Hexagon':
                return {type: 'Path', data: 'M 0 0 L 2 -2 L 11 -2 L 13 0 L 11 2 L 2 2 L 0 0' };
            case 'Ellipse':
                return { type: 'Basic', shape: 'Ellipse' };
            case 'Terminator':
                return { type: 'Flow', shape: 'Terminator' };
            case 'PredefinedProcess':
                return { type: 'Flow', shape: 'PreDefinedProcess' };
            case 'Parallelogram':
                return {type: 'Basic', shape: 'Parallelogram' };
            case 'ParallelogramAlt':
                return {type: 'Path', data: 'M 0 0 L 12 0 L 14 2 L 2 2 L 0 0' };
            case 'Trapezoid':
                return {type: 'Path', data: 'M 0 0 L 1 -1 L 5 -1 L 6 0 L 0 0' };
            case 'TrapezoidAlt':
                return {type: 'Path', data: 'M 0 0 L 5 0 L 4 1 L 1 1 L 0 0' };
            case 'DataSource':
                return {type: 'Path', data: 'M 0 1 L 0 6 C 2 7 4 7 6 6 L 6 1 C 5 0 1 0 0 1 C 1 2 5 2 6 1' };
            case 'Asymmetric':
                return {type: 'Path', data: 'M 0 0 L 8 0 L 8 2 L 0 2 L 2 1 L 0 0' };
            case 'DoubleCircle':
                return {type: 'Path', data: 'M 0 0 A 1 1 0 0 0 7 0 A 1 1 0 0 0 0 0 M -1 0 A 1 1 0 0 0 8 0 A 1 1 0 0 0 -1 0' };
            default:
                return { type: 'Flow', shape: 'Process' };
            }
        }
        return { type: 'Flow', shape: 'Process' };
    }

    private splitString(property: string): string[] {
        let temp: string[] = [];
        temp = property.split('.');
        for (let i: number = 0; i < temp.length; i++) {
            temp[parseInt(i.toString(), 10)] = temp[parseInt(i.toString(), 10)].charAt(0).toLowerCase()
                + temp[parseInt(i.toString(), 10)].slice(1);
        }
        return temp;
    }

    private renderChildNodes(
        mapper: DataSourceModel, parent: Object, value: string, rtNodes: Object[], diagram: Diagram): void {
        let child: Object; let nextLevel: Object; let node: Node;
        for (let j: number = 0; j < (parent as DataItems).items.length; j++) {
            child = (parent as DataItems).items[parseInt(j.toString(), 10)];
            if (!child[mapper.id]) {
                continue;
            }

            node = this.applyNodeTemplate(mapper, child, diagram);
            let canBreak: boolean = false;
            if (!this.collectionContains(node, diagram, mapper.id, mapper.parentId)) {
                if (child[mapper.id] && isNaN(child[mapper.id])) {
                    this.dataTable[child[mapper.id].toLowerCase()] = node;
                }
                else {
                    this.dataTable[child[mapper.id]] = node;
                }
                (diagram.nodes as Node[]).push(node);
            } else {
                canBreak = true;
            }
            if (!this.containsConnector(diagram, value, node.id)) {
                diagram.connectors.push(this.applyConnectorTemplate(value, node.id, diagram));
            }
            if (!canBreak) {
                if (node.data[mapper.id] && isNaN(node.data[mapper.id])) {
                    nextLevel = rtNodes[node.data[mapper.id].toLowerCase()];
                }
                else {
                    nextLevel = rtNodes[node.data[mapper.id]];
                }
                if (nextLevel !== undefined) {
                    this.renderChildNodes(mapper, nextLevel, node.id, rtNodes, diagram);
                }
            }
        }
    }

    // Bug 832897: Need to improve performance while rendering layout with large number of nodes.
    // Replaced for loop with some() method to improve performance.
    private containsConnector(diagram: Diagram, sourceNode: string, targetNode: string): boolean {
        if (sourceNode === '' || targetNode === '') {
            return false;
        }
        return diagram.connectors.some((connector: Connector) => {
            return connector !== undefined && connector.sourceID === sourceNode && connector.targetID === targetNode;
        });
    }

    /**
     *  collectionContains method is used to  check wthear the node is already present in collection or not
     *
     * @param {Node} node
     * @param {Diagram} diagram
     * @param {string} id
     * @param {string} parentId
     */

    private collectionContains(node: Node, diagram: Diagram, id: string, parentId: string): boolean {
        let obj: Node;
        if (isNaN(node.data[`${id}`]) && node.data[`${id}`]) {
            obj = this.dataTable[node.data[`${id}`].toLowerCase()] as Node;
        }
        else {
            obj = this.dataTable[node.data[`${id}`]] as Node;
        }
        if (obj !== undefined && obj.data[`${id}`] === node.data[`${id}`] && obj.data[`${parentId}`] === node.data[`${parentId}`]) {
            return true;
        } else {
            return false;
        }
    }



    /**
     * Get the Connector values
     *
     * @param {string} sNode
     * @param {string} tNode
     * @param {Diagram} diagram
     */

    private applyConnectorTemplate(sNode: string, tNode: string, diagram: Diagram): Connector {
        const connModel: ConnectorModel = {
            id: randomId(), sourceID: sNode, targetID: tNode
        };
        let arrowType: ArrowStyle;
        //Task 895538: Flow-chart layout support for EJ2 diagram.
        //Added below code to set connector annotation and style based on the data.
        if (diagram.layout.type === 'Flowchart'){
            const targetNode: NodeModel = diagram.nodes.find((node: Node) => node.id === tNode) as Node;

            if (typeof (targetNode.data as FlowChartData).label === 'string'){
                connModel.annotations = [{content: (targetNode.data as FlowChartData).label as string}];
            }else if (Array.isArray((targetNode.data as FlowChartData).label)){
                const inConnectors: ConnectorModel[] = diagram.connectors.filter((connector: Connector) => connector.targetID === tNode);
                let index: number = 0;
                if (inConnectors.length > 0){
                    index = inConnectors.length;
                }
                connModel.annotations = [{content: (targetNode.data as FlowChartData).label[parseInt(index.toString(), 10)]}];
            }
            arrowType = getConnectorArrowType(targetNode.data as FlowChartData) as ArrowStyle;
        }
        const obj: Connector = new Connector(diagram, 'connectors', connModel, true);
        if (arrowType){
            obj.style.strokeWidth = arrowType.strokeWidth ? arrowType.strokeWidth : 1;
            obj.targetDecorator.shape = arrowType.targetDecorator ? arrowType.targetDecorator as DecoratorShapes : 'Arrow' as DecoratorShapes;
            obj.style.strokeDashArray = arrowType.strokeDashArray ? arrowType.strokeDashArray : '';
            obj.style.opacity = arrowType.opacity !== undefined ? arrowType.opacity : 1;
        }
        updateDefaultValues(obj, connModel, diagram.connectorDefaults);
        return obj;
    }

}


interface DataItems {
    items: Object[];
}
export interface ArrowStyle{
    targetDecorator: string;
    strokeWidth: number;
    strokeDashArray?: string;
    opacity?: number;
}
export interface FlowChartData{
    id: string;
    name: string;
    shape: BasicShapeModel | FlowShapeModel | PathModel | string;
    color: string;
    label: string[] | string;
    parentId: string[] | number[] | null;
    arrowType: string;
    stroke: string;
    strokeWidth: number;
}
