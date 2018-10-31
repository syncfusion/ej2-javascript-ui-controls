/**
 * FlowChart
 */

import {
    Diagram, ConnectorModel, NodeModel, DiagramConstraints, HierarchicalTree
} from '../../src/diagram/index';

Diagram.Inject(HierarchicalTree);

let node: NodeModel = { id: 'node1', width: 70, height: 70, annotations: [{ content: 'node1' }] };
let node1: NodeModel = { id: 'node2', width: 70, height: 70, annotations: [{ content: 'node2' }] };
let node2: NodeModel = { id: 'node3', width: 70, height: 70, annotations: [{ content: 'node3' }] };
let node3: NodeModel = { id: 'node4', width: 70, height: 70, annotations: [{ content: 'node4' }] };
let node4: NodeModel = { id: 'node5', width: 70, height: 70, annotations: [{ content: 'node5' }] };
let node5: NodeModel = { id: 'node6', width: 70, height: 70, annotations: [{ content: 'node6' }] };
let node6: NodeModel = { id: 'node7', width: 70, height: 70, annotations: [{ content: 'node7' }] };
let node7: NodeModel = { id: 'node8', width: 70, height: 70, annotations: [{ content: 'node8' }] };
let node8: NodeModel = { id: 'node9', width: 70, height: 70, annotations: [{ content: 'node9' }] };
let node9: NodeModel = { id: 'node10', width: 70, height: 70, annotations: [{ content: 'node10' }] };

let connector: ConnectorModel = { id: 'connectr', sourceID: 'node1', targetID: 'node2' };
let connector1: ConnectorModel = { id: 'connectr1', sourceID: 'node2', targetID: 'node3' };
//let connector2: ConnectorModel = { id: 'connectr2', sourceID: 'node1', targetID: 'node3' };
let connector3: ConnectorModel = { id: 'connectr3', sourceID: 'node3', targetID: 'node4' };
let connector4: ConnectorModel = { id: 'connectr4', sourceID: 'node3', targetID: 'node6' };
let connector5: ConnectorModel = { id: 'connectr5', sourceID: 'node4', targetID: 'node7' };
let connector7: ConnectorModel = { id: 'connectr7', sourceID: 'node4', targetID: 'node5' };
let connector6: ConnectorModel = { id: 'connectr6', sourceID: 'node4', targetID: 'node8' };
let connector11: ConnectorModel = { id: 'connectr11', sourceID: 'node6', targetID: 'node9' };
let connector12: ConnectorModel = { id: 'connectr12', sourceID: 'node6', targetID: 'node10' };
let connector8: ConnectorModel = { id: 'connectr8', sourceID: 'node6', targetID: 'node7' };
let connector13: ConnectorModel = { id: 'connectr13', sourceID: 'node6', targetID: 'node8' };
let connector9: ConnectorModel = { id: 'connectr9', sourceID: 'node7', targetID: 'node1' };

let diagram: Diagram = new Diagram({
    width: 1000, height: 1000, nodes: [node, node1, node2, node3, node5, node6, node4, node7, node8, node9],
    connectors: [connector, connector1,
        connector3, connector4, connector5, connector6, connector7, connector8, connector11, connector12, connector13],
    layout: { type: 'HierarchicalTree' },
    constraints: DiagramConstraints.Bridging | DiagramConstraints.Default
});
diagram.appendTo('#diagram');

