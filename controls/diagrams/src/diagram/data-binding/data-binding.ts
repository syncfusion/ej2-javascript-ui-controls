import { Node } from '../objects/node';
import { Connector } from '../objects/connector';
import { NodeModel } from '../objects/node-model';
import { ConnectorModel } from '../objects/connector-model';
import { DataSourceModel } from '../diagram/data-source-model';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { Diagram } from '../diagram';
import { randomId, getFunction } from '../utility/base-util';

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
     * @return {void}
     * @private
     */

    public destroy(): void {
        /**
         * Destroy method performed here
         */
    }

    /**
     * Get module name.
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
     * @param data 
     * @param diagram 
     * @private
     */

    public initData(data: DataSourceModel, diagram: Diagram): void {
        let dataSource: Object[];
        let dataProp: string = 'data';
        let jsonProp: string = 'json';
        let dataManager: DataManager = data.dataManager || {} as DataManager;
        dataSource = data.data || dataManager[dataProp] || dataManager[jsonProp] ||
            (dataManager.dataSource ? dataManager.dataSource.json : undefined);
        if (dataSource && dataSource.length) {
            this.applyDataSource(data, dataSource, diagram);

        }
    }

    /**
     * Initialize nodes and connector when we have a data as remote url
     * @param data 
     * @param diagram 
     * @private
     */

    public initSource(data: DataSourceModel, diagram: Diagram): void {
        let dataSource: DataSourceModel = data; let result: Object[];
        let mapper: DataSourceModel = data;
        if (dataSource.dataManager instanceof DataManager) {
            let query: Query = mapper.dataManager.defaultQuery;
            data.dataManager.executeQuery(query).then((e: Object) => {
                let prop: string = 'result';
                result = e[prop];
                if (!diagram.isDestroyed) {
                    this.applyDataSource(data, result, diagram);
                    diagram.refreshDiagram();
                    diagram.trigger('dataLoaded', { diagram: diagram });
                }
            });
        }
    }

    private applyDataSource(mapper: DataSourceModel, data: Object[], diagram: Diagram): void {
        this.dataTable = {};
        let obj: Object; let firstNode: Object;
        let rootNodes: Object[] = [];
        let firstLevel: Object[] = []; let item: Object;
        let nextLevel: Object;
        if (data !== undefined) {
            for (let r: number = 0; r < data.length; r++) {
                obj = data[r];
                if (obj[mapper.parentId] === undefined || obj[mapper.parentId] === null ||
                    typeof obj[mapper.parentId] !== 'object') {
                    if (rootNodes[obj[mapper.parentId]] !== undefined) {
                        (rootNodes[obj[mapper.parentId]] as DataItems).items.push(obj);
                    } else {
                        rootNodes[obj[mapper.parentId]] = { items: [obj] };
                    }
                } else {
                    rootNodes = this.updateMultipleRootNodes(obj, rootNodes, mapper, data);
                }
                if (mapper.root === obj[mapper.id]) {
                    firstNode = { items: [obj] };
                }
            }

            if (firstNode) {
                firstLevel.push(firstNode);
            } else {
                for (let n of Object.keys(rootNodes)) {
                    if (!n || n === 'undefined' || n === '\'\'' || n === 'null') {
                        firstLevel.push(rootNodes[n]);
                    }
                }
            }
            for (let i: number = 0; i < firstLevel.length; i++) {
                for (let j: number = 0; j < (firstLevel[i] as DataItems).items.length; j++) {
                    item = (firstLevel[i] as DataItems).items[j];
                    let node: Node = this.applyNodeTemplate(mapper, item, diagram);
                    (diagram.nodes as Node[]).push(node);
                    this.dataTable[item[mapper.id]] = node;
                    nextLevel = rootNodes[node.data[mapper.id]];
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
     * @param object 
     * @param rootnodes 
     * @param mapper 
     * @param data 
     */

    private updateMultipleRootNodes(obj: Object, rootNodes: Object[], mapper: DataSourceModel, data: Object[]): Object[] {
        let parents: string[] = obj[mapper.parentId]; let parent: string;
        for (let i: number = 0; i < parents.length; i++) {
            parent = parents[i];
            if (rootNodes[parent]) {
                rootNodes[parent].items.push(obj);
            } else {
                rootNodes[parent] = { items: [obj] };
            }
        }
        return rootNodes;
    }

    /**
     * Get the node values 
     * @param mapper 
     * @param item 
     * @param diagram 
     */

    private applyNodeTemplate(mapper: DataSourceModel, item: Object, diagram: Diagram): Node {
        let root: Object = item;
        let id: string = randomId();
        let nodeModel: NodeModel = { id: id, data: item };
        let doBinding: Function = getFunction(mapper.doBinding);
        if (doBinding) {
            doBinding(nodeModel, item, diagram);
        }

        let obj: Node = new Node(diagram, 'nodes', nodeModel, true);

        if (!this.collectionContains(obj, diagram, mapper.id, mapper.parentId)) {
            return obj;
        } else {
            return this.dataTable[item[mapper.id]];
        }
    }


    private renderChildNodes(mapper: DataSourceModel, parent: Object, value: string, rtNodes: Object[], diagram: Diagram): void {
        let child: Object; let nextLevel: Object; let node: Node;
        for (let j: number = 0; j < (parent as DataItems).items.length; j++) {
            child = (parent as DataItems).items[j];
            node = this.applyNodeTemplate(mapper, child, diagram);
            let canBreak: boolean = false;
            if (!this.collectionContains(node, diagram, mapper.id, mapper.parentId)) {
                this.dataTable[child[mapper.id]] = node;
                (diagram.nodes as Node[]).push(node);
            } else {
                canBreak = true;
            }
            if (!this.containsConnector(diagram, value, node.id)) {
                diagram.connectors.push(this.applyConnectorTemplate(value, node.id, diagram));
            }
            if (!canBreak) {
                nextLevel = rtNodes[node.data[mapper.id]];
                if (nextLevel !== undefined) {
                    this.renderChildNodes(mapper, nextLevel, node.id, rtNodes, diagram);
                }
            }
        }
    }

    private containsConnector(diagram: Diagram, sourceNode: string, targetNode: string): boolean {
        if (sourceNode !== '' && targetNode !== '') {
            for (let i: number = 0; i < diagram.connectors.length; i++) {
                let connector: Connector = diagram.connectors[i] as Connector;
                if (connector !== undefined && (connector.sourceID === sourceNode && connector.targetID === targetNode)) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     *  collectionContains method is used to  check wthear the node is already present in collection or not
     * @param node
     * @param diagram 
     * @param id 
     * @param parentId 
     */

    private collectionContains(node: Node, diagram: Diagram, id: string, parentId: string): boolean {
        let obj: Node = this.dataTable[node.data[id]] as Node;
        if (obj !== undefined && obj.data[id] === node.data[id] && obj.data[parentId] === node.data[parentId]) {
            return true;
        } else {
            return false;
        }
    }



    /**
     * Get the Connector values
     * @param sourceNode
     * @param targetNode 
     * @param diagram 
     */

    private applyConnectorTemplate(sNode: string, tNode: string, diagram: Diagram): Connector {
        let connModel: ConnectorModel = {
            id: randomId(), sourceID: sNode, targetID: tNode
        };
        let obj: Connector = new Connector(diagram, 'connectors', connModel, true);
        return obj;
    }
}


interface DataItems {
    items: Object[];
}
