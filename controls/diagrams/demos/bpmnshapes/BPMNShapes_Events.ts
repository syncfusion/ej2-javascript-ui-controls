/**
 * BPMNShapes_Events
 */

import {
    Diagram, NodeModel, BpmnDiagrams, UndoRedo
} from '../../src/diagram/index';

Diagram.Inject(BpmnDiagrams, UndoRedo);

let diagram: Diagram;

let node7: NodeModel = {
    id: 'node7', width: 100, height: 100, offsetX: 100, offsetY: 100,
    shape: {
        type: 'Bpmn', shape: 'Event',
        event: { event: 'Start', trigger: 'None' }
    }
};
let node8: NodeModel = {
    id: 'node8', width: 100, height: 100, offsetX: 300, offsetY: 100,
    shape: {
        type: 'Bpmn', shape: 'Event',
        event: { event: 'NonInterruptingStart', trigger: 'None' }
    },
};
let node9: NodeModel = {
    id: 'node9', width: 100, height: 100, offsetX: 500, offsetY: 100,
    shape: {
        type: 'Bpmn', shape: 'Event',
        event: { event: 'Intermediate', trigger: 'None' }
    },
};
let node10: NodeModel = {
    id: 'node10', width: 100, height: 100, offsetX: 700, offsetY: 100,
    shape: {
        type: 'Bpmn', shape: 'Event',
        event: { event: 'NonInterruptingIntermediate', trigger: 'None' }
    },
};
let node11: NodeModel = {
    id: 'node11', width: 100, height: 100, offsetX: 900, offsetY: 100,
    shape: {
        type: 'Bpmn', shape: 'Event',
        event: { event: 'ThrowingIntermediate', trigger: 'None' }
    },
};
let node12: NodeModel = {
    id: 'node12', width: 100, height: 100, offsetX: 1100, offsetY: 100,
    shape: {
        type: 'Bpmn', shape: 'Event',
        event: { event: 'End', trigger: 'None' }
    },
};
let node13: NodeModel = {
    id: 'node13', width: 100, height: 100, offsetX: 100, offsetY: 300,
    shape: {
        type: 'Bpmn', shape: 'Event',
        event: { event: 'Start', trigger: 'Message' }
    },
};
let node14: NodeModel = {
    id: 'node14', width: 100, height: 100, offsetX: 300, offsetY: 300,
    shape: {
        type: 'Bpmn', shape: 'Event',
        event: { event: 'NonInterruptingStart', trigger: 'Multiple' }
    },
};

let node15: NodeModel = {
    id: 'node15', width: 100, height: 100, offsetX: 500, offsetY: 300,
    shape: {
        type: 'Bpmn', shape: 'Event',
        event: { event: 'Intermediate', trigger: 'Parallel' }
    },
};
let node16: NodeModel = {
    id: 'node16', width: 100, height: 100, offsetX: 700, offsetY: 300,
    shape: {
        type: 'Bpmn', shape: 'Event',
        event: { event: 'NonInterruptingIntermediate', trigger: 'Signal' }
    },
};
let node18: NodeModel = {
    id: 'node18', width: 100, height: 100, offsetX: 900, offsetY: 300,
    shape: {
        type: 'Bpmn', shape: 'Event',
        event: { event: 'ThrowingIntermediate', trigger: 'Signal' }
    },
};
let node19: NodeModel = {
    id: 'node19', width: 100, height: 100, offsetX: 1100, offsetY: 300,
    shape: {
        type: 'Bpmn', shape: 'Event',
        event: { event: 'End', trigger: 'Timer' }
    },
};
let node20: NodeModel = {
    id: 'node7', width: 100, height: 100, offsetX: 100, offsetY: 500,
    shape: {
        type: 'Bpmn', shape: 'Event',
        event: { event: 'Start', trigger: 'Cancel' }
    },
};
let node21: NodeModel = {
    id: 'node21', width: 100, height: 100, offsetX: 300, offsetY: 500,
    shape: {
        type: 'Bpmn', shape: 'Event',
        event: { event: 'Start', trigger: 'Timer' }
    },
};

diagram = new Diagram({

    width: 1500, height: 1500, nodes: [node7, node8, node9, node10, node11, node12, node13, node14, node15,
        node16, node18, node19, node20, node21]
});

diagram.appendTo('#diagram');

