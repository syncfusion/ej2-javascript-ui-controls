import {
    Diagram, NodeModel, UndoRedo, Node, DataBinding, Keys,
    KeyModifiers, DiagramContextMenu, BasicShapeModel, HierarchicalTree, CommandManagerModel, ConnectorModel, SnapConstraints
} from '../../src/diagram/index';
import { DataManager } from '@syncfusion/ej2-data';
import { keyBoardData, DataInfo } from './diagram-data';
import { MouseEvents } from '../../spec/diagram/interaction/mouseevents.spec';
Diagram.Inject(UndoRedo, DiagramContextMenu, HierarchicalTree, DataBinding);

/**
 * Key Board Interaction sample
 */
//Initialize shape
let shape: BasicShapeModel = { type: 'Basic', shape: 'Ellipse', cornerRadius: 10 };
let diagram: Diagram = new Diagram({
    //Initializes diagram control
    width: '100%', height: 645,
    snapSettings: { constraints: SnapConstraints.None },
    contextMenuSettings: { show: true },
    //Sets the default values of nodes
    getNodeDefaults: (obj: Node) => {
        if (!obj.children) {
            obj.shape = shape;
            obj.width = 70;
            obj.height = 70;
        }
        return obj;
    },
    //Configrues hierarchical tree layout
    layout: {
        type: 'HierarchicalTree'
    },
    //Configures data source
    dataSourceSettings: {
        id: 'id', parentId: 'ancestor', dataManager: new DataManager(keyBoardData as JSON[]),
        //binds the external data with node
        doBinding: (nodeModel: NodeModel, data: DataInfo) => {
            nodeModel.annotations = [{
                /* tslint:disable:no-string-literal */
                content: data['id'],
                style: { color: 'white' }
            }
            ];
            nodeModel.style = {
                strokeColor: 'transparent',
                /* tslint:disable:no-string-literal */
                fill: data['fill']
            };

        }
    },
    commandManager: getCommandManagerSettings()
});
diagram.appendTo('#diagram');
let mouseevents: MouseEvents = new MouseEvents();
    let diagramCanvas: HTMLElement = document.getElementById('diagramcontent');
    mouseevents.clickEvent(diagramCanvas, 10, 10);
diagram.select([diagram.nodes[0]]);
//Custom command for Diagraming elements.
function getCommandManagerSettings(): CommandManagerModel {
    let commandManager: CommandManagerModel = {
        commands: [{
            name: 'customGroup',
            canExecute: (): boolean => {
                if (diagram.selectedItems.nodes.length > 0 || diagram.selectedItems.connectors.length > 0) {
                    return true;
                }
                return false;
            },
            execute: (): void => {
                diagram.cut();
            },
            gesture: {
                key: Keys.X,
                keyModifiers: KeyModifiers.Control
            }

        },
        {
            name: 'customUnGroup',
            canExecute: (): boolean => {
                if (diagram.selectedItems.nodes[0].children) {
                    return true;
                }
                return false;
            },
            execute: (): void => {
                diagram.unGroup();
            },
            gesture: {
                key: Keys.U,
                keyModifiers: KeyModifiers.Control
            }

        },
        {
            name: 'navigationDown',
            canExecute: (): boolean => {
                return true;
            },
            execute: (): void => {
                navigateToChild();
            },
            gesture: { key: Keys.Down },
        },
        {
            name: 'navigationUp',
            canExecute: (): boolean => {
                return true;
            },
            execute: (): void => {
                navigateToParent();
            },
            gesture: { key: Keys.Up },
        },
        {
            name: 'navigationLeft',
            canExecute: (): boolean => {
                return true;
            },
            execute: (): void => {
                navigateToRighttSibling();
            },
            gesture: { key: Keys.Right },
        },
        {
            name: 'navigationRight',
            canExecute: (): boolean => {
                return true;
            },
            execute: (): void => {
                navigateToLeftSibling();
            },
            gesture: { key: Keys.Left },
        }]
    };
    return commandManager;
}
//Navigation for Child Node
function navigateToChild(): void {
    let parent: Node = diagram.selectedItems.nodes[0] as Node;
    let connectorId: string = parent.outEdges[0];
    let child: NodeModel[] = getChildNode(connectorId);
    if (child && child.length > 0) {
        diagram.clearSelection();
        diagram.select(child);
    }
}
//Navigation for parent Node 
function navigateToParent(): void {
    let child: Node = diagram.selectedItems.nodes[0] as Node;
    let connectorId: string = child.inEdges[0];
    let parent: NodeModel[] = getParentNode(connectorId);
    if (parent && parent.length > 0) {
        diagram.clearSelection();
        diagram.select(parent);
    }
}
//Navigation for RightSibling Node 
function navigateToRighttSibling(): void {
    let child: Node = diagram.selectedItems.nodes[0] as Node;
    let connectorId: string = child.inEdges[0];
    let nextConnectorId: string;
    let parent: NodeModel[] = getParentNode(connectorId);
    if (parent && parent.length > 0) {
        for (let i: number = 0; i < (parent[0] as Node).outEdges.length; i++) {
            if ((parent[0] as Node).outEdges[i] === connectorId) {
                nextConnectorId = (parent[0] as Node).outEdges[i + 1];
            }
        }
        let rightSibling: NodeModel[] = getChildNode(nextConnectorId);
        if (rightSibling && rightSibling.length > 0) {
            diagram.clearSelection();
            diagram.select(rightSibling);
        }
    }
}
//Navigation for LeftSibling Node 
function navigateToLeftSibling(): void {
    let child: Node = diagram.selectedItems.nodes[0] as Node;
    let connectorId: string = child.inEdges[0];
    let prevConnectorId: string;
    let parent: NodeModel[] = getParentNode(connectorId);
    if (parent && parent.length > 0) {
        for (let i: number = 0; i < (parent[0] as Node).outEdges.length; i++) {
            if ((parent[0] as Node).outEdges[i] === connectorId) {
                prevConnectorId = (parent[0] as Node).outEdges[i - 1];
            }
        }
        let leftSibling: NodeModel[] = getChildNode(prevConnectorId);
        if (leftSibling && leftSibling.length > 0) {
            diagram.clearSelection();
            diagram.select(leftSibling);
        }
    }
}
let keynavigation: HTMLButtonElement = document.getElementById('KeynavigationDown') as HTMLButtonElement;
keynavigation.onclick = () => {
    let mouseevents: MouseEvents = new MouseEvents();
    let diagramCanvas: HTMLElement = document.getElementById('diagramcontent');
    mouseevents.keyDownEvent(diagramCanvas, 'Down');
}
let keynavigationUp: HTMLButtonElement = document.getElementById('KeynavigationUp') as HTMLButtonElement;
keynavigationUp.onclick = () => {
    let mouseevents: MouseEvents = new MouseEvents();
    let diagramCanvas: HTMLElement = document.getElementById('diagramcontent');
    mouseevents.keyDownEvent(diagramCanvas, 'Up');
}
let keynavigationLeft: HTMLButtonElement = document.getElementById('KeynavigationLeft') as HTMLButtonElement;
keynavigationUp.onclick = () => {
    let mouseevents: MouseEvents = new MouseEvents();
    let diagramCanvas: HTMLElement = document.getElementById('diagramcontent');
    mouseevents.keyDownEvent(diagramCanvas, 'Left');
}
let keynavigationRight: HTMLButtonElement = document.getElementById('KeynavigationRight') as HTMLButtonElement;
keynavigationRight.onclick = () => {
    let mouseevents: MouseEvents = new MouseEvents();
    let diagramCanvas: HTMLElement = document.getElementById('diagramcontent');
    mouseevents.keyDownEvent(diagramCanvas, 'Right');
}
let customCommand: HTMLButtonElement = document.getElementById('CustomCommand') as HTMLButtonElement;
customCommand.onclick = () => {
    let mouseevents: MouseEvents = new MouseEvents();
    let diagramCanvas: HTMLElement = document.getElementById('diagramcontent');
    mouseevents.keyDownEvent(diagramCanvas, 'S', true);
}


//Get child node elements
function getChildNode(name: string): NodeModel[] {
    let childNode: NodeModel[] = [];
    let connector: ConnectorModel = diagram.getObject(name) as ConnectorModel;
    if (connector) {
        childNode.push(diagram.getObject(connector.targetID) as NodeModel);
    }
    return childNode;
}
//Get parent node elements
function getParentNode(name: string): NodeModel[] {
    let parentNode: NodeModel[] = [];
    let connector: ConnectorModel = diagram.getObject(name) as ConnectorModel;
    if (connector) {
        parentNode.push(diagram.getObject(connector.sourceID) as NodeModel);
    }
    return parentNode;
}