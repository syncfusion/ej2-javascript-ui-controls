import {
    Diagram, UndoRedo, SnapConstraints, BpmnDiagrams, LineRouting, DiagramConstraints, NodeModel, ConnectorModel, PointPortModel
} from '../../src/diagram/index';
Diagram.Inject(UndoRedo, LineRouting, BpmnDiagrams);

let portCollection: PointPortModel[] = [
    { id: "left", offset: { x: 0, y: 0.5 } },
    { id: 'top', offset: { x: 0.5, y: 0 } },
    { id: 'right', offset: { x: 1, y: 0.5 } },
    { id: "bottom", offset: { x: 0.5, y: 1 } }];

let nodes: NodeModel[] = [{
    id: 'node0', width: 30, height: 30, offsetX: 40, offsetY: 174.408, ports: portCollection,
    shape: { type: "Bpmn", shape: "Event" },
    annotations: [{
        id: 'label1', content: 'Start', offset: { x: 0.5, y: 1 }, margin: { top: 2 }, verticalAlignment: "Top"
    }],
    style: { fill: "#FFFFFF", strokeColor: "#62A716", strokeWidth: 2 }
},
{
    id: 'node1', width: 90, height: 60, offsetX: 40.5, offsetY: 89, ports: portCollection,
    shape: { type: "Bpmn", shape: "Activity", activity: { activity: 'Task', task: { type: 'User' } } },
    annotations: [{
        id: 'label2', content: 'Document Review', margin: { top: 10, right: 2, bottom: 3, left: 2 }
    }],
    style: { fill: "#E3EDF3", strokeWidth: 2, strokeColor: "#7fadc8" }
},
{
    id: 'node2', width: 90, height: 60, offsetX: 472, offsetY: 317.5, ports: portCollection,
    shape: { type: "Bpmn", shape: "Activity", activity: { activity: 'Task', task: { type: 'Service' } } },
    annotations: [{
        id: 'label3', content: 'Extraction', margin: { top: 10, right: 2, bottom: 3, left: 2 }
    }],
    style: { fill: "#E3EDF3", strokeWidth: 2, strokeColor: "#7fadc8" }
},
{
    id: 'node3', width: 90, height: 60, offsetX: 39, offsetY: 363.944444444444, ports: portCollection,
    shape: { type: "Bpmn", shape: "Activity", activity: { activity: 'Task', task: { type: 'Service' } } },
    annotations: [{
        id: 'label3', content: 'Classification', margin: { top: 10, right: 2, bottom: 3, left: 2 }
    }],
    style: { fill: "#E3EDF3", strokeWidth: 2, strokeColor: "#7fadc8" }
},
{
    id: 'node4', width: 90, height: 60, offsetX: 715, offsetY: 42.5, ports: portCollection,
    shape: { type: "Bpmn", shape: "Activity", activity: { activity: 'Task', task: { type: 'User' } } },
    annotations: [{
        id: 'label2', content: 'Validation Round 1', margin: { top: 10, right: 2, bottom: 3, left: 2 }
    }],
    style: { fill: "#E3EDF3", strokeWidth: 2, strokeColor: "#7fadc8" }
},
{
    id: 'node5', width: 90, height: 60, offsetX: 694.5, offsetY: 247, ports: portCollection,
    shape: { type: "Bpmn", shape: "Activity", activity: { activity: 'Task', task: { type: 'User' } } },
    annotations: [{
        id: 'label2', content: 'Validation Round 2', margin: { top: 10, right: 2, bottom: 3, left: 2 }
    }],
    style: { fill: "#E3EDF3", strokeWidth: 2, strokeColor: "#7fadc8" }
},
{
    id: 'node6', width: 90, height: 60, offsetX: 829.5, offsetY: 247, ports: portCollection,
    shape: { type: "Bpmn", shape: "Activity", activity: { activity: 'Task', task: { type: 'User' } } },
    annotations: [{
        id: 'label2', content: 'Validation Round 3', margin: { top: 10, right: 2, bottom: 3, left: 2 }
    }],
    style: { fill: "#E3EDF3", strokeWidth: 2, strokeColor: "#7fadc8" }
},
{
    id: 'node7', width: 90, height: 60, offsetX: 964.5, offsetY: 247, ports: portCollection,
    shape: { type: "Bpmn", shape: "Activity", activity: { activity: 'Task', task: { type: 'User' } } },
    annotations: [{
        id: 'label2', content: 'Verification', margin: { top: 10, right: 2, bottom: 3, left: 2 }
    }],
    style: { fill: "#E3EDF3", strokeWidth: 2, strokeColor: "#7fadc8" }
},
{
    id: 'node8', width: 60, height: 60, offsetX: 63, offsetY: 421, ports: portCollection,
    shape: { type: "Bpmn", shape: "Gateway", },
    annotations: [{
        id: 'label2', content: 'Has Rejections?', offset: { x: 0, y: 1 }, margin: { left: 0, top: 1, right: 0, bottom: 0 }
    }],
    style: { fill: "#FFFFFF", strokeColor: "#d5dc43", strokeWidth: 2 }
},
{
    id: 'node9', width: 90, height: 60, offsetX: 720, offsetY: 776, ports: portCollection,
    shape: { type: "Bpmn", shape: "Activity", activity: { activity: 'Task', task: { type: 'User' } } },
    annotations: [{
        id: 'label2', content: 'Rescan', margin: { top: 10, right: 2, bottom: 3, left: 2 }
    }],
    style: { fill: "#E3EDF3", strokeWidth: 2, strokeColor: "#7fadc8" }
},
{
    id: 'node11', width: 60, height: 60, offsetX: 306, offsetY: 436.5, ports: portCollection,
    shape: { type: "Bpmn", shape: "Gateway", },
    annotations: [{
        id: 'label2', content: 'Has Rejections?', offset: { x: 0, y: 1 }, margin: { left: 0, top: 1, right: 0, bottom: 0 }
    }],
    style: { fill: "#FFFFFF", strokeColor: "#d5dc43", strokeWidth: 2 }
},
{
    id: 'node12', width: 60, height: 60, offsetX: 590, offsetY: 175.5, ports: portCollection,
    shape: { type: "Bpmn", shape: "Gateway", },
    annotations: [{
        id: 'label2', content: 'Has Rejections?', offset: { x: 0, y: 1 }, margin: { left: 0, top: 1, right: 0, bottom: 0 }
    }],
    style: { fill: "#FFFFFF", strokeColor: "#d5dc43", strokeWidth: 2 }
},
{
    id: 'node13', width: 60, height: 60, offsetX: 837, offsetY: 52.7066858410835, ports: portCollection,
    shape: { type: "Bpmn", shape: "Gateway", },
    annotations: [{
        id: 'label2', content: 'Has Rejections?', offset: { x: 0, y: 1 }, margin: { left: 0, top: 1, right: 0, bottom: 0 }
    }],
    style: { fill: "#FFFFFF", strokeColor: "#d5dc43", strokeWidth: 2 }
},
{
    id: 'node17', width: 60, height: 60, offsetX: 1121, offsetY: 273.706685841084, ports: portCollection,
    shape: { type: "Bpmn", shape: "Gateway", },
    annotations: [{
        id: 'label2', content: 'Has Rejections?', offset: { x: 0, y: 1 }, margin: { left: 0, top: 1, right: 0, bottom: 0 }
    }],
    style: { fill: "#FFFFFF", strokeColor: "#d5dc43", strokeWidth: 2 }
},
{
    id: 'node19', width: 60, height: 60, offsetX: 1242, offsetY: 198.706685841084, ports: portCollection,
    shape: { type: "Bpmn", shape: "Gateway", },
    annotations: [{
        id: 'label2', content: 'Has Rejections?', offset: { x: 0, y: 1 }, margin: { left: 0, top: 1, right: 0, bottom: 0 }
    }],
    style: { fill: "#FFFFFF", strokeColor: "#d5dc43", strokeWidth: 2 }
},
{
    id: 'node21', width: 60, height: 60, offsetX: 1280, offsetY: 417.706685841084, ports: portCollection,
    shape: { type: "Bpmn", shape: "Gateway", },
    annotations: [{
        id: 'label2', content: 'Has Rejections?', offset: { x: 0, y: 1 }, margin: { left: 0, top: 1, right: 0, bottom: 0 }
    }],
    style: { fill: "#FFFFFF", strokeColor: "#d5dc43", strokeWidth: 2 }
},
{
    id: 'node23', width: 90, height: 60, offsetX: 1519.5, offsetY: 479.166666666667, ports: portCollection,
    shape: { type: "Bpmn", shape: "Activity", activity: { activity: 'Task', task: { type: 'Service' } } },
    annotations: [{
        id: 'label3', content: 'Export', margin: { top: 10, right: 2, bottom: 3, left: 2 }
    }],
    style: { fill: "#E3EDF3", strokeWidth: 2, strokeColor: "#7fadc8" }
},
{
    id: 'node24', width: 30, height: 30, offsetX: 1684.5, offsetY: 479.166666666667, ports: portCollection,
    shape: { type: "Bpmn", shape: "Event", event: { event: "End" } },
    annotations: [{
        id: 'label1', content: 'End', offset: { x: 0.5, y: 1 }, margin: { top: 2 }, verticalAlignment: "Top"
    }],
    style: { fill: "#FFFFFF", strokeColor: "#9b0000", strokeWidth: 4 }
},
];
let connectors: ConnectorModel[] = [
    {
        id: 'node8-node1', type: 'Orthogonal', sourceID: 'node8', targetID: 'node1', sourcePortID: "top", targetPortID: "left",
        annotations: [{ content: 'False' }], style: { strokeColor: "#0000FE" }, targetDecorator: { style: { fill: "#0000FE" } }
    },
    {
        id: 'node11-node2', type: 'Orthogonal', sourceID: 'node11', targetID: 'node2', sourcePortID: "top", targetPortID: "left",
        annotations: [{ content: 'False' }], style: { strokeColor: "#0000FE" }, targetDecorator: { style: { fill: "#0000FE" } }
    },
    {
        id: 'node9-node3', type: 'Orthogonal', sourceID: 'node9', targetID: 'node3', sourcePortID: "right", targetPortID: "left",
    },
    {
        id: 'node0-node3', type: 'Orthogonal', sourceID: 'node0', targetID: 'node3', sourcePortID: "right", targetPortID: "left",
    },
    {
        id: 'node12-node4', type: 'Orthogonal', sourceID: 'node12', targetID: 'node4', sourcePortID: "top", targetPortID: "left",
        annotations: [{ content: 'False' }], style: { strokeColor: "#0000FE" }, targetDecorator: { style: { fill: "#0000FE" } }
    },
    {
        id: 'node13-node5', type: 'Orthogonal', sourceID: 'node13', targetID: 'node5', sourcePortID: "top", targetPortID: "left",
        annotations: [{ content: 'False' }], style: { strokeColor: "#0000FE" }, targetDecorator: { style: { fill: "#0000FE" } }
    },
    {
        id: 'node17-node6', type: 'Orthogonal', sourceID: 'node17', targetID: 'node6', sourcePortID: "top", targetPortID: "left",
        annotations: [{ content: 'False' }], style: { strokeColor: "#0000FE" }, targetDecorator: { style: { fill: "#0000FE" } }
    },
    {
        id: 'node19-node7', type: 'Orthogonal', sourceID: 'node19', targetID: 'node7', sourcePortID: "top", targetPortID: "left",
        annotations: [{ content: 'False' }], style: { strokeColor: "#0000FE" }, targetDecorator: { style: { fill: "#0000FE" } }
    },
    {
        id: 'node3-node8', type: 'Orthogonal', sourceID: 'node3', targetID: 'node8', sourcePortID: "right", targetPortID: "left",
    },
    {
        id: 'node8-node9', type: 'Orthogonal', sourceID: 'node8', targetID: 'node9', sourcePortID: "bottom", targetPortID: "left",
        annotations: [{ content: 'True' }], style: { strokeColor: "#007f00" }, targetDecorator: { style: { fill: "#007f00" } }
    },
    {
        id: 'node11-node9', type: 'Orthogonal', sourceID: 'node11', targetID: 'node9', sourcePortID: "bottom", targetPortID: "left",
        annotations: [{ content: 'True' }], style: { strokeColor: "#007f00" }, targetDecorator: { style: { fill: "#007f00" } }
    },
    {
        id: 'node12-node9', type: 'Orthogonal', sourceID: 'node12', targetID: 'node9', sourcePortID: "bottom", targetPortID: "left",
        annotations: [{ content: 'True' }], style: { strokeColor: "#007f00" }, targetDecorator: { style: { fill: "#007f00" } }
    },
    {
        id: 'node13-node9', type: 'Orthogonal', sourceID: 'node13', targetID: 'node9', sourcePortID: "bottom", targetPortID: "left",
        annotations: [{ content: 'True' }], style: { strokeColor: "#007f00" }, targetDecorator: { style: { fill: "#007f00" } }
    },
    {
        id: 'node17-node9', type: 'Orthogonal', sourceID: 'node17', targetID: 'node9', sourcePortID: "bottom", targetPortID: "left",
        annotations: [{ content: 'True' }], style: { strokeColor: "#007f00" }, targetDecorator: { style: { fill: "#007f00" } }
    },
    {
        id: 'node19-node9', type: 'Orthogonal', sourceID: 'node19', targetID: 'node9', sourcePortID: "bottom", targetPortID: "left",
        annotations: [{ content: 'True' }], style: { strokeColor: "#007f00" }, targetDecorator: { style: { fill: "#007f00" } }
    },
    {
        id: 'node21-node9', type: 'Orthogonal', sourceID: 'node21', targetID: 'node9', sourcePortID: "top", targetPortID: "left",
        annotations: [{ content: 'True' }], style: { strokeColor: "#007f00" }, targetDecorator: { style: { fill: "#007f00" } }
    },
    {
        id: 'node1-node11', type: 'Orthogonal', sourceID: 'node1', targetID: 'node11', sourcePortID: "right", targetPortID: "left",
    },
    {
        id: 'node2-node12', type: 'Orthogonal', sourceID: 'node2', targetID: 'node12', sourcePortID: "right", targetPortID: "left",
    },
    {
        id: 'node4-node13', type: 'Orthogonal', sourceID: 'node4', targetID: 'node13', sourcePortID: "right", targetPortID: "left",
    },
    {
        id: 'node5-node17', type: 'Orthogonal', sourceID: 'node5', targetID: 'node17', sourcePortID: "right", targetPortID: "left",
    },
    {
        id: 'node6-node19', type: 'Orthogonal', sourceID: 'node6', targetID: 'node19', sourcePortID: "right", targetPortID: "left",
    },
    {
        id: 'node7-node21', type: 'Orthogonal', sourceID: 'node7', targetID: 'node21', sourcePortID: "right", targetPortID: "left",
    },
    {
        id: 'node21-node23', type: 'Orthogonal', sourceID: 'node21', targetID: 'node23', sourcePortID: "bottom", targetPortID: "left",
        annotations: [{ content: 'False' }], style: { strokeColor: "#0000FE" }, targetDecorator: { style: { fill: "#0000FE" } }
    },
    {
        id: 'node23-node24', type: 'Orthogonal', sourceID: 'node23', targetID: 'node24', sourcePortID: "right", targetPortID: "left",
    },
]

let diagram: Diagram = new Diagram({
    width: 1000, height: 550,
    nodes: nodes, connectors: connectors,
    snapSettings: {
        constraints: SnapConstraints.None
    },
    constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting,
    getConnectorDefaults: function (connectorModel: ConnectorModel) {
        connectorModel.cornerRadius = 10;
        connectorModel.targetDecorator.style.strokeColor = "#778899";
    }
});

diagram.appendTo('#diagram');
diagram.fitToPage();