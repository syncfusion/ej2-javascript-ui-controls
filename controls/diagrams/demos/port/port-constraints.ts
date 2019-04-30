import { Diagram } from '../../src/diagram/diagram';
import { ConnectorModel } from '../../src/diagram/objects/connector-model';
import { NodeModel } from '../../src/diagram/objects/node-model';
import { PortConstraints, NodeConstraints } from '../../src/index';
/**
 * pageSettings
 */
let diagram: Diagram
let node1: NodeModel = {
    id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 150, annotations: [{ content: 'Node1' }],
    shape: { type: 'Basic', shape: 'Rectangle' },
    constraints: NodeConstraints.Default & ~NodeConstraints.InConnect,
    ports: [
                 { id: 'node8In', height: 10, width: 10, offset: { x: 1, y: 0.5 }, constraints: PortConstraints.InConnect },
      ]
};
let node2: NodeModel = {
    id: 'node2', width: 100, height: 100, offsetX: 500, offsetY: 150, annotations: [{ content: 'Node2' }],
    shape: { type: 'Basic', shape: 'Rectangle' }, constraints: NodeConstraints.Default & ~NodeConstraints.OutConnect,
    ports: [
                 { id: 'node2Out', height: 10, width: 10, offset: { x: 0, y: 0.5 }, constraints: PortConstraints.OutConnect },
      ]
};
let connectors: ConnectorModel[] = [
    {
        id: 'connector7', sourcePoint: { x: 300, y: 150}, targetPoint: { x: 200, y: 150},
        type: 'Orthogonal', segments: [{ type: 'Orthogonal'}], targetDecorator: { height: 10, width: 10}
    },
];
diagram = new Diagram({
    width: '1000px', height: '500px', nodes: [node1, node2], connectors: connectors,
});
diagram.appendTo('#diagram');



