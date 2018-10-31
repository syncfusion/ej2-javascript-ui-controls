/**
 * BPMNShapes_Events
 */

import {
    Diagram, NodeModel, BpmnActivityModel, MarginModel, BpmnShape,
    BpmnSubProcessModel, BpmnDiagrams, NodeConstraints, ConnectorModel, UndoRedo, BpmnFlowModel
} from '../../src/diagram/index';
import { SymbolPalette } from '../../src/index';
Diagram.Inject(BpmnDiagrams, UndoRedo);
SymbolPalette.Inject(BpmnDiagrams);
let sourceMargin: MarginModel = { left: 5, right: 5, bottom: 5, top: 5 };

let nod: NodeModel = {
    id: 'nod', width: 100, height: 100, offsetX: 300, offsetY: 300,
    constraints: NodeConstraints.Default | NodeConstraints.AllowDrop,

    shape: {
        type: 'Bpmn', shape: 'Activity', activity: {
            activity: 'SubProcess',
            subProcess: { collapsed: true } as BpmnSubProcessModel
        }
    },
};
let nod1: NodeModel = {
    id: 'nod1', width: 100, height: 100, offsetX: 300, offsetY: 300, margin: { top: 200 },
    constraints: NodeConstraints.Default | NodeConstraints.AllowDrop,

    shape: {
        type: 'Bpmn', shape: 'Activity', activity: {
            activity: 'SubProcess',
            subProcess: { collapsed: true } as BpmnSubProcessModel
        },
    },
};
let nodea: NodeModel = {
    id: 'nodea', maxHeight: 600, maxWidth: 600, minWidth: 300, minHeight: 300,
    constraints: NodeConstraints.Default | NodeConstraints.AllowDrop,
    offsetX: 200, offsetY: 200,
    shape: {
        type: 'Bpmn', shape: 'Activity', activity: {
            activity: 'SubProcess',
            subProcess: {
                collapsed: true, type: 'Transaction',
                //processes: ['start', 'end', 'nod1', 'nod']
            } as BpmnSubProcessModel
        },
    },
};

let start: NodeModel = {
    id: 'start', shape: { type: 'Bpmn', shape: 'Event' }, width: 100, height: 100,
    margin: { left: 10, top: 50 }
};

let end: NodeModel = {
    id: 'end', shape: { type: 'Bpmn', shape: 'Event', event: { event: 'Intermediate' } }, width: 100, height: 100,
    margin: { left: 300, top: 50 }
};

let connector6: ConnectorModel[] =
    [{ id: 'connector6', type: 'Straight', sourceID: 'nodea', targetID: 'start', sourcePortID: 'success' },
    ];
var node = {
    id: 'node', width: 100, height: 100, offsetX: 300, offsetY: 450,
    style: { fill: 'red', strokeColor: 'blue', strokeWidth: 5 },
    constraints: NodeConstraints.Default | NodeConstraints.Shadow,
    shape: {
        type: 'Bpmn', shape: 'DataObject',
        dataObject: { collection: false, type: 'Input' },
        annotations: [
            { name: 'annot1', angle: 30, length: 150, text: 'textAnnotation1' },
            { name: 'annot2', angle: 90, width: 100, height: 100, length: 150, text: 'textAnnotation2' },
            { name: 'annot3', angle: 180, width: 100, height: 100, length: 150, text: 'textAnnotation3' },
            { name: 'annot4', angle: 280, width: 100, height: 100, length: 150, text: 'textAnnotation4' }
        ]
    },
};
let diagram: Diagram = new Diagram({

    width: '74%', height: '600px', nodes: [nodea, start], connectors: connector6
});


let bpmnShapes: NodeModel[] = [{
    id: 'nodea1', width: 50, height: 50, //maxHeight: 600, maxWidth: 600, minWidth: 300, minHeight: 300,
    constraints: NodeConstraints.Default | NodeConstraints.AllowDrop,
    offsetX: 200, offsetY: 200,
    shape: {
        type: 'Bpmn', shape: 'Activity',
        activity: {
            activity: 'SubProcess',
            subProcess: {
                collapsed: true, type: 'Event', events: [{
                    id: 'event1', offset: { x: 0, y: 0.5 }
                }]
            },
        }
    }
},
    start,
    end
];

let connections: ConnectorModel[] = [{
    id: 'connector1', type: 'Straight', sourcePoint: { x: 100, y: 100 },
    targetPoint: { x: 150, y: 150 },
    // shape: {
    //     type: 'Bpmn',
    //     flow: 'Sequence', sequence: 'Normal'
    // }
}, {
    id: 'connector2', type: 'Straight', sourcePoint: { x: 170, y: 170 },
    targetPoint: { x: 250, y: 250 },
    // shape: {
    //     type: 'Bpmn',
    //     flow: 'Sequence', sequence: 'Conditional'
    // }
}, {
    id: 'connector3', type: 'Straight', sourcePoint: { x: 270, y: 270 },
    targetPoint: { x: 330, y: 330 },
    // shape: {
    //     type: 'Bpmn',
    //     flow: 'Sequence', sequence: 'Default'
    // }
}];
let palette: SymbolPalette = new SymbolPalette({
    expandMode: 'Multiple',
    palettes: [
        { id: 'bpmn', expanded: true, symbols: bpmnShapes, iconCss: 'shapes', title: 'BPMN Shapes' },
        { id: 'connectors', expanded: true, symbols: connections, iconCss: 'shapes', title: 'Connectors' }
    ],
    symbolWidth: 50,
    symbolHeight: 50,
    width: '25%', height: '550px'
});
palette.appendTo('#symbolpalette');

diagram.appendTo('#diagram');

document.getElementById('gg').onclick = fun1;
function fun1() {
    (diagram.nodes[0].shape as BpmnShape).activity.subProcess.collapsed = true;
    diagram.dataBind();
}
document.getElementById('gg1').onclick = fun11;
function fun11() {
    (diagram.nodes[0].shape as BpmnShape).activity.subProcess.collapsed = false;
    diagram.dataBind();

}