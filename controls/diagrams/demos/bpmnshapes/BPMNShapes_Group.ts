// /**
//  * BPMNShapes_Events
//  */

// import {
//     Diagram, NodeModel, BpmnActivityModel, HorizontalAlignment, VerticalAlignment, MarginModel, BpmnGroupModel,
//     BpmnSubProcessModel, TextStyleModel, BpmnDiagrams, BpmnGatewayModel
// } from '../../src/diagram/index';

// Diagram.Inject(BpmnDiagrams);
// let sourceMargin: MarginModel = { left: 5, right: 5, bottom: 5, top: 5 };

// let node: NodeModel = {
//     id: 'node', width: 100, height: 100, offsetX: 100, offsetY: 100,
//     shape: { type: 'Bpmn', shape: 'Gateway', gateway: { type: 'Exclusive' } as BpmnGatewayModel },
// };
// let node1: NodeModel = {
//     id: 'node1', width: 100, height: 100, offsetX: 300, offsetY: 100,
//     shape: { type: 'Bpmn', shape: 'Gateway', gateway: { type: 'Complex' } as BpmnGatewayModel },
// };
// let node2: NodeModel = {
//     id: 'node2', width: 100, height: 100, offsetX: 500, offsetY: 100,
//     shape: { type: 'Bpmn', shape: 'Gateway', gateway: { type: 'EventBased' } as BpmnGatewayModel },
// };
// let node3: NodeModel = {
//     id: 'node3', width: 100, height: 100, offsetX: 700, offsetY: 100,
//     shape: { type: 'Bpmn', shape: 'Gateway', gateway: { type: 'ExclusiveEventBased' } as BpmnGatewayModel },
// };
// let node4: NodeModel = {
//     id: 'node4', width: 100, height: 100, offsetX: 900, offsetY: 100,
//     shape: { type: 'Bpmn', shape: 'Gateway', gateway: { type: 'Inclusive' } as BpmnGatewayModel },
// };
// let node5: NodeModel = {
//     id: 'node5', width: 100, height: 100, offsetX: 100, offsetY: 300,
//     shape: { type: 'Bpmn', shape: 'Gateway', gateway: { type: 'Parallel' } as BpmnGatewayModel },
// };
// let node6: NodeModel = {
//     id: 'node6', width: 100, height: 100, offsetX: 300, offsetY: 300,
//     shape: { type: 'Bpmn', shape: 'Gateway', gateway: { type: 'ParallelEventBased' } as BpmnGatewayModel },
// };




// let node7: NodeModel = {
//     id: 'node7', width: 100, height: 100, offsetX: 700, offsetY: 700,
//     shape: { type: 'Bpmn', shape: 'Gateway', gateway: { type: 'None' } as BpmnGatewayModel },
// };

// let nod: NodeModel = {
//     id: 'nod', 
//     shape: { type: 'Bpmn', shape: 'Group', group: { children: ['node', 'node1'] } }
// };

// let diagram: Diagram = new Diagram({
//     mode:'Canvas',
//     width: 1200, height: 1200, nodes: [node, node1,nod, node7]
// });

// diagram.appendTo('#diagram');

