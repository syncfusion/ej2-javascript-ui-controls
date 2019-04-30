/**
 * BPMNShapes_Events
 */

import {
    Diagram, BpmnShapeModel, NodeModel, PortVisibility, BpmnDiagrams, BasicShapeModel, ConnectorModel, BpmnFlowModel
} from '../../src/diagram/index';

Diagram.Inject(BpmnDiagrams);

let diagram: Diagram;
let shape2: BasicShapeModel = { type: 'Basic', shape: 'Ellipse' };
let nodes: NodeModel[] = [
    {
        id: 'bpmn', width: 100, height: 100, offsetX: 450, offsetY: 240, ports: [{ id: 'a', visibility: PortVisibility.Visible }],
        shape: {
            type: 'Bpmn', shape: 'DataObject',
            dataObject: { collection: false, type: 'Input' },
            annotations: [{ id: 'left', angle: 170, length: 150, text: 'Left', },
            { id: 'right', angle: 30, length: 150, text: 'Right', },
            { id: 'top', angle: 270, length: 150, text: 'Top' },
            { id: 'bottom', angle: 120, length: 150, text: 'Bottom' }
            ]
        } as BpmnShapeModel,
    },

    {
        id: 'bpmn2', width: 100, height: 100, offsetX: 750, offsetY: 240, ports: [{ id: 'a', visibility: PortVisibility.Visible }],
        shape: {
            type: 'Bpmn', shape: 'DataObject',
            dataObject: { collection: false, type: 'Input' },
            annotations: [{ id: 'left', angle: 170, length: 150, text: 'Left', },
            { id: 'right', angle: 30, length: 150, text: 'Right', },
            { id: 'top', angle: 270, length: 150, text: 'Top' },
            { id: 'bottom', angle: 120, length: 150, text: 'Bottom' }
            ]
        } as BpmnShapeModel,
    }
];

let connectors: ConnectorModel[] = [
    { id: 'connector1', type: 'Straight', sourceID: 'endofnode', targetID: 'bpmntextannotnode' },
    // { id: 'connector2', type: 'Straight', sourceID: 'node2', targetID: 'node3' },
    // { id: 'connector3', type: 'Straight', sourceID: 'node3', targetID: 'node4' },
    // {
    //     id: 'connector4', type: 'Straight', sourceID: 'node4', targetID: 'node5',
    //     annotations: [{
    //         id: 'label7', content: 'Feature/Bug', offset: 0.5, alignment: 'After', margin: { top: 5 },
    //         style: { strokeColor: 'transparent' }
    //     }]
    // },
    // {
    //     id: 'connector5', type: 'Straight', sourceID: 'node5', targetID: 'node6',
    //     annotations: [{
    //         id: 'label7', content: 'Invalid', offset: 0.5, alignment: 'After', margin: { top: 5 },
    //         style: { strokeColor: 'transparent' }
    //     }],
    //     shape: { type: 'Bpmn', flow: 'Message', message: 'InitiatingMessage' } as BpmnFlowModel
    // },
    // {
    //     id: 'connector6', type: 'Straight', sourceID: 'node2', targetID: 'node7'
    // },
    // {
    //     id: 'connector7', type: 'Straight', sourceID: 'node4', targetID: 'node8',
    //     annotations: [{
    //         id: 'label7', content: 'How to?', offset: 0.5, alignment: 'After', margin: { top: 5 },
    //         style: { strokeColor: 'transparent' }
    //     }]
    // },
    // { id: 'connector8', type: 'Straight', sourceID: 'node5', targetID: 'node9', },
    // { id: 'connector9', type: 'Straight', sourceID: 'node13', targetID: 'node12' },
    // { id: 'connector10', type: 'Orthogonal', sourceID: 'node7', targetID: 'node3', },
    // { id: 'connector11', type: 'Straight', sourceID: 'node13', targetID: 'node10' },
    // {
    //     id: 'connector12', type: 'Straight', sourceID: 'node10', targetID: 'node11',
    //     shape: { type: 'Bpmn', flow: 'Message', message: 'Default' } as BpmnFlowModel
    // },
    // {
    //     id: 'connector13', type: 'Straight', sourceID: 'nosde9', targetID: 'node13',
    //     shape: { type: 'Bpmn', flow: 'Message', message: 'Default' } as BpmnFlowModel
    // }
];
diagram = new Diagram({

    width: '1500px', height: '1500px', nodes: nodes,// connectors: connectors,
    snapSettings: { constraints: 0 },
});
diagram.appendTo('#diagram');


document.getElementById('Add').onclick = () => {
    let annotation = { name: 'newAnnotation', angle: 225, length: 200, text: 'New Annotation' };
    diagram.addTextAnnotation(annotation, diagram.nodes[1]);
}


