/**
 * Explores the types of nodes
 */

import {
    Diagram, UndoRedo, NodeModel, AnnotationConstraints, Connector, ConnectorModel
} from '../../src/diagram/index';

Diagram.Inject(UndoRedo);
let nodes: NodeModel[] = [
    {
        id: "node0",
        offsetX: 100,
        offsetY: 100,
        width: 100,
        height: 100,
        shape: { type: "HTML", },
        style: { fill: 'yellow' }
    },
    {
        id: "node11",
        offsetX: 900,
        offsetY: 100,
        width: 100,
        height: 100,
        shape: { type: "HTML", },
        style: { fill: 'yellow' }
    },
    {
        id: 'node1', width: 100, height: 100, offsetX: 250, offsetY: 180,
        annotations: [
            {
                id: "node_label1",
                constraints: AnnotationConstraints.Interaction,
                width: 30,
                height: 30,
                template: '<style>th {border: 5px solid #c1dad7}td {border: 5px solid #c1dad7}.c1 { background: #4b8c74 } .c2 { background: #74c476 }  .c3 { background: #a4e56d } .c4 { background: #cffc83 } </style> <table style="width:100%;"> <tbody> <tr> <th class="c1">ID</th> <th class="c2">X</th> <th class="c3">Y</th></tr> <tr> <td class="c1">${id}</td> <td class="c2">${offset.x}</td> <td class="c3">${offset.y}</td> </tr> </tbody> </table>'
            },
            {
                id: "node_label2",
                constraints: AnnotationConstraints.Interaction,
                offset: { x: 1, y: 0 },
                content: "dvv",
            },
            {
                id: "node_label3",
                width: 100,
                height: 30,
                constraints: AnnotationConstraints.Interaction,
                offset: { x: 0, y: 0 },
            }
        ]
    }
];
let connectors: ConnectorModel[] = [
    {
        id: 'connector', sourcePoint: { x: 800, y: 100 }, targetPoint: { x: 600, y: 300 },
        annotations: [
            {
                id: "connector_label1", height: 60, width: 200, offset: 0,
                constraints: AnnotationConstraints.Interaction,
            },
            {
                id: "connector_labe2l", height: 60, width: 200, offset: 0,
                constraints: AnnotationConstraints.Interaction,
                content: "dvv",
            },
            {
                id: "connector_labe3l", height: 60, width: 200, offset: 0.5,
                constraints: AnnotationConstraints.Interaction,
                template: '<style>th {border: 5px solid #c1dad7}td {border: 5px solid #c1dad7}.c1 { background: #4b8c74 } .c2 { background: #74c476 }  .c3 { background: #a4e56d } .c4 { background: #cffc83 } </style> <table style="width:100%;"> <tbody> <tr> <th class="c1">ID</th> <th class="c2">Offset</th> </tr> <tr> <td class="c1">${id}</td> <td class="c2">${offset}</td> </tr> </tbody> </table>'
            }
        ]
    }
];
let diagram: Diagram = new Diagram({
    width: '100%', height: 900, nodes: nodes, connectors: connectors,
    nodeTemplate: '#nodetemplate',
    annotationTemplate: "#annotationtemplate"
});
diagram.scrollSettings.canAutoScroll = true;
diagram.appendTo('#diagram');
var addport = document.getElementById('addport');
addport.onclick = function () {
    var annotation1 = diagram.nodes[0].annotations[0].id
    var annotation1Element = document.getElementById(diagram.nodes[0].id + '_' + annotation1 + '_html_element')
    if (annotation1Element instanceof HTMLDivElement) {

    }
    var annotation2 = diagram.nodes[0].annotations[1].id
    var annotation2Element = document.getElementById(diagram.nodes[0].id + '_' + annotation2 + '_groupElement')
    if ((annotation2Element.children[1].childNodes[0] as HTMLElement).innerHTML === "dvv") {

    }
    var annotation3 = diagram.nodes[0].annotations[2].id
    var annotation3Element = document.getElementById(diagram.nodes[0].id + '_' + annotation3 + '_html_element')
    if (annotation3Element instanceof HTMLDivElement) {

    }



    var connectorannotation1 = diagram.connectors[0].annotations[0].id
    var connectorannotation1Element = document.getElementById(diagram.connectors[0].id + '_' + connectorannotation1 + '_html_element')
    if (connectorannotation1Element instanceof HTMLDivElement) {

    }
    var connectorannotation2 = diagram.connectors[0].annotations[1].id
    var connectorannotation2Element = document.getElementById(diagram.connectors[0].id + '_' + connectorannotation2 + '_groupElement')
    if ((connectorannotation2Element.children[1].childNodes[0] as HTMLElement).innerHTML === "dvv") {

    }
    var connectorannotation3 = diagram.connectors[0].annotations[2].id
    var connectorannotation3Element = document.getElementById(diagram.connectors[0].id + '_' + connectorannotation3 + '_html_element')
    if (connectorannotation3Element instanceof HTMLDivElement) {

    }
}