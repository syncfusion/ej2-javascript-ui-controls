import { Diagram, Matrix,PointPortModel, ConnectorConstraints,NodeModel, transformPointByMatrix, rotateMatrix, identityMatrix, DiagramElement, ConnectorBridging, DiagramConstraints, Connector, UndoRedo, Segments, DiagramTools, PointModel, PathAnnotationModel, Html } from '../../src/diagram/index';
import { ConnectorModel } from '../../src/diagram/objects/connector-model';
import { MouseEvents } from '../../spec/diagram/interaction/mouseevents.spec';
Diagram.Inject(ConnectorBridging, UndoRedo);

/**
 * Connectors
 */

    let nodeport2:PointPortModel = {offset: { x: 1 }};
    nodeport2.id = 'fff';
    nodeport2.shape = 'Circle';
    let nodeport21:PointPortModel= {offset: { y: 1 }};
    nodeport21.id = 'ggg';
    nodeport21.shape = 'Circle';
    let connector:ConnectorModel = {
        id: 'connector1', sourceID: 'node1', targetID: 'node2', type: 'Straight', targetPortID: 'ggg', sourcePortID: 'fff', targetPadding: 20, sourcePadding: 20
    };
    let connector1:ConnectorModel = {
        id: 'connector2', sourceID: 'node3', targetID: 'node4', type: 'Straight', targetPadding: 20, sourcePadding: 20
    };
    let node:NodeModel= {
        id: 'node1', width: 50, height: 50, offsetX: 100, offsetY: 100, annotations: [{ content: 'Node1', height: 50, width: 50 }], ports: [nodeport2]
    };
    let node2:NodeModel= {
        id: 'node2', width: 50, height: 50, offsetX: 200, offsetY: 200, annotations: [{ content: 'Node2', height: 50, width: 50 }], ports: [nodeport21]
    };
    let node3:NodeModel = {
        id: 'node3', width: 100, height: 75, offsetX: 300, offsetY: 350, annotations: [{ content: 'Node3', height: 50, width: 50 }]
    };
    let node4:NodeModel = {
        id: 'node4', width: 100, height: 75, offsetX: 300, offsetY: 350, annotations: [{ content: 'Node3', height: 50, width: 50 }]
    };

let diagram: Diagram = new Diagram({
    width: '1050px', height: '500px', connectors: [connector,connector1],nodes:[node,node2,node3,node4],
    constraints: DiagramConstraints.Default | DiagramConstraints.Bridging
});

diagram.appendTo('#diagram');

document.getElementById('updateConnector').onclick =updateConnector;

function updateConnector() {
    if (diagram.selectedItems.connectors.length) {
        diagram.selectedItems.connectors[0].sourcePadding=5;
        diagram.selectedItems.connectors[0].targetPadding=5;
    
        diagram.dataBind();
    }
}
