/**
 * BPMNShapes_Events
 */

import {
    Diagram, BpmnShapeModel, NodeModel, BpmnDiagrams
} from '../../src/diagram/index';

Diagram.Inject(BpmnDiagrams);

let node: NodeModel = {
    id: 'node', width: 100, height: 100, offsetX: 100, offsetY: 100,
    shape: {
        type: 'Bpmn', shape: 'DataObject',
        dataObject: { collection: false, type: 'Input' }
    } as BpmnShapeModel,
};
let node1: NodeModel = {
    id: 'node1', width: 100, height: 100, offsetX: 300, offsetY: 100,
    shape: {
        type: 'Bpmn', shape: 'DataObject',
        dataObject: { collection: false, type: 'Output' }
    } as BpmnShapeModel,
};
let node2: NodeModel = {
    id: 'node2', width: 100, height: 100, offsetX: 500, offsetY: 100,
    shape: {
        type: 'Bpmn', shape: 'DataObject',
        dataObject: { collection: false, type: 'None' }
    } as BpmnShapeModel,
};
let node3: NodeModel = {
    id: 'node3', width: 100, height: 100, offsetX: 700, offsetY: 100,
    shape: {
        type: 'Bpmn', shape: 'DataObject',
        dataObject: { collection: true, type: 'Input' }
    } as BpmnShapeModel,
};
let node4: NodeModel = {
    id: 'node4', width: 100, height: 100, offsetX: 900, offsetY: 100,
    shape: {
        type: 'Bpmn', shape: 'DataObject',
        dataObject: { collection: true, type: 'Output' }
    } as BpmnShapeModel,
};
let node5: NodeModel = {
    id: 'node5', width: 100, height: 100, offsetX: 100, offsetY: 300,
    shape: {
        type: 'Bpmn', shape: 'DataObject',
        dataObject: { collection: true, type: 'None' }
    } as BpmnShapeModel,
};
let diagram = new Diagram({

    width: 1000, height: 1000, nodes: [node, node1, node2, node3, node4, node5]
});

diagram.appendTo('#diagram');

