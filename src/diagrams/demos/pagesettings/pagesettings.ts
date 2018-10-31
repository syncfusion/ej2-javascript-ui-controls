import { Diagram } from '../../src/diagram/diagram';
import { SnapConstraints } from '../../src/diagram/enum/enum';
import { ConnectorModel } from '../../src/diagram/objects/connector-model';
import { NodeModel } from '../../src/diagram/objects/node-model';
/**
 * pageSettings
 */
let diagram: Diagram;
let connector: ConnectorModel = {
    id: 'connector1', sourcePoint: { x: 300, y: 400 }, targetPoint: { x: 500, y: 500 }, annotations: [ {content: 'Connector'}]
};
let node: NodeModel = {
    id: 'node1', width: 150, height: 100, offsetX: 100, offsetY: 100, annotations: [ { content: 'Node1'}]
};
let node2: NodeModel = {
    id: 'node2', width: 80, height: 130, offsetX: 200, offsetY: 200, annotations: [ { content: 'Node2'}]
};
let node3: NodeModel = {
    id: 'node3', width: 100, height: 75, offsetX: 300, offsetY: 350, annotations: [ { content: 'Node3'}]
};
diagram = new Diagram({
    width: '1000px', height: '500px', nodes: [node, node2, node3], connectors: [connector],
    // snapSettings: { constraints: SnapConstraints.SnapToLines },
    pageSettings: {
        orientation: 'Landscape',
        background: { color: 'blue' }, width: 300, height: 300, multiplePage: true, showPageBreaks: true,
        margin: { left: 10, top: 10, bottom: 10 },
    }
});
diagram.appendTo('#diagram');



