/**
 * TEST SAMPLES-BPMN SHAPES
 */

import {
    Diagram, NodeModel, Segments, ConnectorModel, BpmnFlowModel, VerticalAlignment, BpmnDiagrams, DiagramTools
} from '../../src/diagram/index';

Diagram.Inject(BpmnDiagrams);

let diagram: Diagram;

let nodes: NodeModel[] = [
    {
        id: 'node1', width: 60, height: 60, offsetX: 75, offsetY: 90,
        shape: { type: 'Bpmn', shape: 'Event', event: { event: 'Start', trigger: 'Message' } },
        annotations: [{
            id: 'label1', content: 'Customer Query', offset: { y: 1 }, verticalAlignment: 'Top', margin: { top: 5 },
            style: { strokeColor: 'transparent' }
        }]
    },

    {
        id: 'node2', width: 75, height: 70, offsetX: 210, offsetY: 90,
        shape: { type: 'Bpmn', shape: 'Gateway', gateway: { type: 'None' } },
        annotations: [{
            id: 'label2', content: 'Enough details',
            style: { strokeColor: 'transparent' }
        }]
    },

    {
        id: 'node3', width: 60, height: 50, offsetX: 345, offsetY: 90,
        shape: { type: 'Bpmn', shape: 'Activity', activity: { activity: 'Task', task: { type: 'None', compensation: false, } } },
        annotations: [{
            id: 'label3', content: 'Analyse',
            style: { strokeColor: 'transparent', whiteSpace: 'PreserveAll' }
        }]
    },

    {
        id: 'node4', width: 75, height: 70, offsetX: 480, offsetY: 90,
        shape: { type: 'Bpmn', shape: 'Gateway', gateway: { type: 'Exclusive' } },
    },

    {
        id: 'node5', width: 75, height: 70, offsetX: 630, offsetY: 90,
        shape: { type: 'Bpmn', shape: 'Gateway', gateway: { type: 'None' } }, annotations: [{
            id: 'label5', content: 'Validate',
            style: { strokeColor: 'transparent' }
        }]
    },

    {
        id: 'node6', width: 60, height: 60, offsetX: 745, offsetY: 90,
        shape: {
            type: 'Bpmn', shape: 'Event',
            event: { event: 'End', trigger: 'Message' }
        },
    },

    {
        id: 'node7', width: 60, height: 50, offsetX: 210, offsetY: 200,
        shape: {
            type: 'Bpmn', shape: 'Activity', activity: { activity: 'Task', task: { type: 'Send', compensation: false, } },
        }, annotations: [{
            id: 'label7', content: 'Request',
            style: { strokeColor: 'transparent' }
        }]
    },

    {
        id: 'node8', width: 60, height: 60, offsetX: 480, offsetY: 200,
        shape: {
            type: 'Bpmn', shape: 'Event',
            event: { event: 'End', trigger: 'Message' }
        }, annotations: [{
            id: 'label8', content: 'How to?', offset: { y: 1 }, verticalAlignment: 'Top', margin: { top: 5 },
            style: { strokeColor: 'transparent' }
        }]
    },

    {
        id: 'node9', width: 70, height: 50, offsetX: 630, offsetY: 200,
        shape: {
            type: 'Bpmn', shape: 'Activity', activity: {
                activity: 'Task', task: {
                    type: 'None'
                }
            },
        }, annotations: [{
            id: 'label7', content: 'Log bug/feature',
            style: { strokeColor: 'transparent' }
        }]
    },

    {
        id: 'node10', width: 75, height: 55, offsetX: 440, offsetY: 300,
        shape: {
            type: 'Bpmn', shape: 'Activity', activity: {
                activity: 'SubProcess',
                subProcess: {
                    type: 'Event', collapsed: false,
                    events: [{
                        height: 25, width: 25,
                        offset: { x: 0.5, y: 1 }, event: 'Intermediate', trigger: 'Timer'
                    }]
                }
            }
        }, annotations: [{ id: 'label7', content: 'Implement', style: { strokeColor: 'transparent' } }]
    },

    {
        id: 'node11', width: 60, height: 60, offsetX: 335, offsetY: 300,
        shape: {
            type: 'Bpmn', shape: 'Event',
            event: { event: 'End', trigger: 'Message' }
        }
    },

    {
        id: 'node12', width: 60, height: 60, offsetX: 745, offsetY: 300,
        shape: {
            type: 'Bpmn', shape: 'Event',
            event: { event: 'End', trigger: 'Message' }
        }
    },

    {
        id: 'node13', width: 60, height: 60, offsetX: 630, offsetY: 300,
        shape: {
            type: 'Bpmn', shape: 'Gateway', gateway: { type: 'Parallel' }
        }
    }];

let connectors: ConnectorModel[] = [
    { id: 'connector1', type: 'Straight', sourceID: 'node1', targetID: 'node2' },
    { id: 'connector2', type: 'Straight', sourceID: 'node2', targetID: 'node3' },
    { id: 'connector3', type: 'Straight', sourceID: 'node3', targetID: 'node4' },
    {
        id: 'connector4', type: 'Straight', sourceID: 'node4', targetID: 'node5',
        annotations: [{
            id: 'label7', content: 'Feature/Bug', offset: 0.5, alignment: 'After', margin: { top: 5 },
            style: { strokeColor: 'transparent' }
        }]
    },
    {
        id: 'connector5', type: 'Straight', sourceID: 'node5', targetID: 'node6',
        annotations: [{
            id: 'label7', content: 'Invalid', offset: 0.5, alignment: 'After', margin: { top: 5 },
            style: { strokeColor: 'transparent' }
        }],
        shape: { type: 'Bpmn', flow: 'Message', message: 'InitiatingMessage' } as BpmnFlowModel
    },
    {
        id: 'connector6', type: 'Straight', sourceID: 'node2', targetID: 'node7'
    },
    {
        id: 'connector7', type: 'Straight', sourceID: 'node4', targetID: 'node8',
        annotations: [{
            id: 'label7', content: 'How to?', offset: 0.5, alignment: 'After', margin: { top: 5 },
            style: { strokeColor: 'transparent' }
        }]
    },
    { id: 'connector8', type: 'Straight', sourceID: 'node5', targetID: 'node9', },
    { id: 'connector9', type: 'Straight', sourceID: 'node13', targetID: 'node12' },
    { id: 'connector10', type: 'Orthogonal', sourceID: 'node7', targetID: 'node3', },
    { id: 'connector11', type: 'Straight', sourceID: 'node13', targetID: 'node10' },
    {
        id: 'connector12', type: 'Straight', sourceID: 'node10', targetID: 'node11',
        shape: { type: 'Bpmn', flow: 'Message', message: 'Default' } as BpmnFlowModel
    },
    {
        id: 'connector13', type: 'Straight', sourceID: 'node9', targetID: 'node13',
        shape: { type: 'Bpmn', flow: 'Message', message: 'Default' } as BpmnFlowModel
    }
];
diagram = new Diagram({
    width: '1000px', height: '500px', nodes: nodes, connectors: connectors,
    snapSettings: { constraints: 0 }, tool: DiagramTools.ZoomPan
});
diagram.appendTo('#diagram');


document.getElementById("zoomout").onclick = () => {
    diagram.zoom(1.2);
};
document.getElementById("zoomin").onclick = () => {
    diagram.zoom(0.8);
};

document.getElementById("pan").onclick = () => {
    diagram.pan(100, 0);
};