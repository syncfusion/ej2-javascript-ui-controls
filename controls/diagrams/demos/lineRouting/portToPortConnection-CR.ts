import {
    Diagram, UndoRedo, PortVisibility, BpmnDiagrams, PointModel, LineRouting, DiagramConstraints, Connector, NodeModel, ConnectorModel
} from '../../src/diagram/index';
import { createSvgElement, createHtmlElement } from '../../src/diagram/utility/dom-util';

import { MouseEvents } from '../../spec/diagram/interaction/mouseevents.spec';
import { Matrix, transformPointByMatrix, identityMatrix, rotateMatrix } from '../../src/diagram/primitives/matrix';

Diagram.Inject(UndoRedo, LineRouting, BpmnDiagrams);

// Line Routing - Port to port connection

let diagram: Diagram = new Diagram({
    width: "700px",
    height: "800px",
    nodes: [
        {
            id: "NewIdea", width: 100, height: 160,
            offsetX: 300, offsetY: 280,
            ports: [{ id: 'port1', offset: { x: 1, y: 0.7 } }]
        },
        {
            id: "Meeting", width: 100, height: 60, offsetX: 500, offsetY: 480,
            ports: [{ id: 'port1', offset: { x: 0, y: 0.7 } }]
        }
    ],
    connectors: [
        {
            id: 'connector', sourceID: 'NewIdea', targetID: 'Meeting', sourcePortID: 'port1', targetPortID: 'port1', type: 'Orthogonal'
        }
    ],
    constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting,
    getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
});

diagram.appendTo('#diagram');