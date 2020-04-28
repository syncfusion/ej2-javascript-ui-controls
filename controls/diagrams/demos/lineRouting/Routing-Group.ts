import {
    Diagram, UndoRedo, PortVisibility, BpmnDiagrams, PointModel, LineRouting, DiagramConstraints, Connector, NodeModel, ConnectorModel
} from '../../src/diagram/index';
import {createSvgElement, createHtmlElement } from '../../src/diagram/utility/dom-util';

import { MouseEvents } from '../../spec/diagram/interaction/mouseevents.spec';
import { Matrix, transformPointByMatrix, identityMatrix, rotateMatrix } from '../../src/diagram/primitives/matrix';

Diagram.Inject(UndoRedo, LineRouting, BpmnDiagrams);

// Node to Node

function getIntermediatePoints(points: PointModel[], value: string) {
    var output = 'expect(';
    for (var i = 0; i < points.length; i++) {
        output += value + '.intermediatePoints[' + i + '].x ==' + points[i].x +
            '&&' + value + '.intermediatePoints[' + i + '].y ==' + points[i].y + '&&';
    }
    output += ').toBe(true);';
    return output;
}
let nodes: NodeModel[] = [
    {
        id: "node1",
        height: 100,
        width: 100,
        offsetX: 300,
        offsetY: 100,
        annotations: [{ content: "Node1" }]
      },
      {
        id: "node2",
        height: 100,
        width: 100,
        offsetX: 500,
        offsetY: 250,
        annotations: [{ content: "Node2" }]
      },
      {
        id: "node3",
        height: 100,
        width: 100,
        offsetX: 100,
        offsetY: 250,
        annotations: [{ content: "Node3" }]
      },
      {
        id: "node4",
        height: 100,
        width: 100,
        offsetX: 300,
        offsetY: 400,
        annotations: [{ content: "Node4" }]
      },
      {
        id: 'group',
        children: ['node1', 'node2', 'node3']
      }
];

let connectors: ConnectorModel[] = [
    {
        id: 'connector1',
        sourceID: 'node1',
        targetID: 'node2',
      },
      {
        id: 'connector2',
        sourceID: 'node2',
        targetID: 'node3',
      },
      {
        id: 'connector3',
        sourceID: 'node3',
        targetID: 'node1',
      },
      {
        id: 'connector4',
        sourceID: 'node3',
        targetID: 'node4'
      }
];

let diagram: Diagram = new Diagram({
    width: '100%', height: 900, nodes: nodes, connectors: connectors,
    constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting,
    getConnectorDefaults: function(connector: ConnectorModel){
        connector.type = 'Orthogonal';
        return connector;
    }
});

diagram.appendTo('#diagram');
document.getElementById('lineRouting').onclick = function(){
    diagram.constraints = DiagramConstraints.Default | DiagramConstraints.LineRouting;
    diagram.dataBind();
    diagram.resetSegments();
}
document.getElementById('DisablelineRouting').onclick = function(){
    diagram.constraints = DiagramConstraints.Default & ~DiagramConstraints.LineRouting;
    diagram.dataBind();
    diagram.resetSegments();
}