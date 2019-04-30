/**
 * Explores the types of nodes
 */

import {
    Diagram, UndoRedo, NodeModel, AnnotationConstraints, Connector, ConnectorModel
} from '../../src/diagram/index';

Diagram.Inject(UndoRedo);
let nodes: NodeModel[] = [
    {
        id: 'node1', width: 300, height: 160, offsetX: 250, offsetY: 180,
        annotations: [
            {
                id: "node_label", height: 60, width: 200,
                constraints: AnnotationConstraints.Interaction,
                template: '<style>th {border: 5px solid #c1dad7}td {border: 5px solid #c1dad7}.c1 { background: #4b8c74 } .c2 { background: #74c476 }  .c3 { background: #a4e56d } .c4 { background: #cffc83 } </style> <table style="width:100%;"> <tbody> <tr> <th class="c1">ID</th> <th class="c2">X</th> <th class="c3">Y</th></tr> <tr> <td class="c1">${id}</td> <td class="c2">${offset.x}</td> <td class="c3">${offset.y}</td> </tr> </tbody> </table>'
            }
        ]
    }
];
let connectors: ConnectorModel[] = [
    {
        id: 'connector', sourcePoint: {x: 800, y: 100}, targetPoint: {x: 600, y: 300},
        annotations: [
            {
                id: "connector_label", height: 60, width: 200, offset: 0.5,
                constraints: AnnotationConstraints.Interaction,
                template: '<style>th {border: 5px solid #c1dad7}td {border: 5px solid #c1dad7}.c1 { background: #4b8c74 } .c2 { background: #74c476 }  .c3 { background: #a4e56d } .c4 { background: #cffc83 } </style> <table style="width:100%;"> <tbody> <tr> <th class="c1">ID</th> <th class="c2">Offset</th> </tr> <tr> <td class="c1">${id}</td> <td class="c2">${offset}</td> </tr> </tbody> </table>'
            }
        ]
    }
];
let diagram: Diagram = new Diagram({
    width: '100%', height: 900, nodes: nodes, connectors: connectors,
});
diagram.scrollSettings.canAutoScroll = true;
diagram.appendTo('#diagram');