import {
    Diagram, NodeModel, FlowShapeModel, BasicShapeModel, 
    Keys, KeyModifiers, UndoRedo, ConnectorModel, cloneObject
} from '../../src/diagram/index';
import { HistoryEntry, History } from '../../src/diagram/diagram/history';
Diagram.Inject(UndoRedo);
/**
 * Command Manager
 */
let node1: NodeModel = {
    id: "node1", width: 90, height: 40, annotations: [{ content: 'Start' }],
    offsetX: 400, offsetY: 30, shape: { type: 'Flow', shape: 'Terminator' }
};
let node2: NodeModel = {
    id: "node2", offsetX: 400, offsetY: 100, width: 90, height: 40, annotations: [{ content: 'Design' }],
    shape: { type: 'Flow', shape: 'Process' }
};
let node3: NodeModel = {
    id: "node3", offsetX: 400, offsetY: 180, width: 90, height: 40, annotations: [{ content: 'Coding' }],
    shape: { type: 'Flow', shape: 'Process' }
};
let node4: NodeModel = {
    id: "node4", width: 90, height: 40, offsetX: 400, offsetY: 260,
    annotations: [{ content: 'Testing' }], shape: { type: 'Flow', shape: 'Process' },
};
let node5: NodeModel = {
    id: "node5", width: 90, height: 40, offsetX: 400, offsetY: 340,
    annotations: [{ content: 'Errors?' }], shape: { type: 'Flow', shape: 'Decision' },
};
let node6: NodeModel = {
    id: "node6", width: 90, height: 40, offsetX: 400, offsetY: 450,
    annotations: [{ content: 'End' }], shape: { type: 'Flow', shape: 'Terminator' },
};
let node7: NodeModel = {
    id: "node7", width: 110, height: 60, offsetX: 220, offsetY: 180,
    annotations: [{ content: 'Design Error?' }], shape: { type: 'Flow', shape: 'Decision' }
};


let connector1: ConnectorModel = { id: "connector1", sourceID: node1.id, targetID: node2.id };

let connector2: ConnectorModel = { id: "connector2", sourceID: node2.id, targetID: node3.id };
let connector3: ConnectorModel = { id: "connector3", sourceID: node3.id, targetID: node4.id };
let connector4: ConnectorModel = { id: "connector4", sourceID: node4.id, targetID: node5.id };
let connector5: ConnectorModel = {
    id: "connector5", sourceID: node5.id, targetID: node6.id,
    annotations: [{ content: "No", style: { fill: 'white' } }]
};
let connector6: ConnectorModel = {
    id: "connector6", sourceID: node5.id, targetID: node7.id,type: "Orthogonal",
    annotations: [{ content: "Yes", style: { fill: "white" } }]
};
let connector7: ConnectorModel = {
    id: "connector7", sourceID: node7.id, targetID: node3.id,type: "Orthogonal",
    annotations: [{ content: "No", style: { fill: "white" } }]
};
let connector8: ConnectorModel = {
    id: "connector8", sourceID: node7.id, targetID: node2.id, type: "Orthogonal",
    annotations: [{ content: "Yes", style: { fill: "white" } }]
};

let diagram: Diagram = new Diagram({
    width: 850, height: 700, nodes: [node1, node2, node3, node4, node5, node6, node7],
    connectors: [connector1, connector2, connector3, connector4, connector5, connector6, connector7, connector8],
    commandManager:{
        commands:[{
            name:'customCopy',
            canExecute:function(){
                if(diagram.selectedItems.nodes.length>0 || diagram.selectedItems.connectors.length>0){
                    return true;
                }
                return false;
            },
            execute:function(){
                for(let i=0; i<diagram.selectedItems.nodes.length; i++){
                    diagram.selectedItems.nodes[i].style.fill = 'red';
                }
                diagram.dataBind();
            },
            gesture:{
                key:Keys.G,
                keyModifiers:KeyModifiers.Shift | KeyModifiers.Alt
            }
            
        }]
    }
});
diagram.appendTo('#diagram');

