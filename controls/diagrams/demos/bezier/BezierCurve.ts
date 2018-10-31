import { Diagram } from '../../src/diagram/diagram';
import { Segments, PortVisibility } from '../../src/diagram/enum/enum';
import { ConnectorModel, VectorModel, BezierSegmentModel } from '../../src/diagram/objects/connector-model';
import { PointModel } from '../../src/diagram/primitives/point-model';
import { NodeModel, PathModel, TextModel, BasicShapeModel } from '../../src/diagram/objects/node-model';
import { TextStyle } from '../../src/diagram/core/appearance';
import { PointPortModel } from '../../src/diagram/objects/port-model';

/**
 * Connectors
 */

var node2: NodeModel = { shape: { shape: 'Rectangle' } as BasicShapeModel, style: {} };
node2.id = 'textelement2';
node2.width = 100;
node2.height = 100;
node2.offsetX = 100;
node2.offsetY = 400;
(node2.style as TextStyle).color = 'green';
(node2.style as TextStyle).fontSize = 12;
(node2.style as TextStyle).fill = 'transparent'; (node2.style as TextStyle).fontFamily = 'sans-serif';
let nodeport2: PointPortModel = { offset: {}, margin: {}, style: {} }; nodeport2.offset = {
    x: 1, y: .5
};
nodeport2.id = 'port2';
nodeport2.visibility = PortVisibility.Hidden
nodeport2.shape = 'Square'; node2.ports = [nodeport2];

let node3: NodeModel = { shape: { shape: 'Rectangle' } as BasicShapeModel, style: {} };
node3.id = 'textelement3';
node3.width = 100; node3.height = 100;
node3.offsetX = 400; node3.offsetY = 200;
(node3.style as TextStyle).color = 'green';
(node3.style as TextStyle).fontSize = 12;
(node3.style as TextStyle).fill = 'transparent'; (node3.style as TextStyle).fontFamily = 'sans-serif';
let nodeport3: PointPortModel = { offset: {}, margin: {}, style: {} }; nodeport3.offset = {
    x: 0, y: 0.5
};
nodeport3.visibility = PortVisibility.Hidden
nodeport3.id = 'port3';
nodeport3.shape = 'Square'; node3.ports = [nodeport3];

let node6: NodeModel = { shape: { shape: 'Rectangle' } as BasicShapeModel, style: {} };
node6.id = 'textelement6';
node6.width = 100; node6.height = 100;
node6.offsetX = 400; node6.offsetY = 350;
(node6.style as TextStyle).color = 'green';
(node6.style as TextStyle).fontSize = 12;
(node6.style as TextStyle).fill = 'transparent'; (node6.style as TextStyle).fontFamily = 'sans-serif';
let nodeport6: PointPortModel = { offset: {}, margin: {}, style: {} }; nodeport6.offset = {
    x: 0, y: 0.5
};
nodeport6.id = 'port6';
nodeport6.visibility = PortVisibility.Hidden
nodeport6.shape = 'Square'; node6.ports = [nodeport6];

let node7: NodeModel = { shape: { shape: 'Rectangle' } as BasicShapeModel, style: {} };
node7.id = 'textelement7';
node7.width = 100; node7.height = 100;
node7.offsetX = 400;
node7.offsetY = 500;
(node7.style as TextStyle).color = 'green';
(node7.style as TextStyle).fontSize = 12;
(node7.style as TextStyle).fill = 'transparent'; (node7.style as TextStyle).fontFamily = 'sans-serif';
let nodeport7: PointPortModel = { offset: {}, margin: {}, style: {} }; nodeport7.offset = {
    x: 0, y: 0.5
};
nodeport7.id = 'port7';
nodeport7.visibility = PortVisibility.Hidden
nodeport7.shape = 'Square'; node7.ports = [nodeport7];


let connectors: ConnectorModel[] = [

    {
        id: 'connector1', type: 'Bezier',
        segments: [{
            type: 'Bezier',
        }],
        sourcePoint: { x: 50, y: 100 },
        targetPoint: { x: 150, y: 200 },
    },
    {
        id: 'connector2', type: 'Bezier',
        segments: [{
            type: 'Bezier', vector1: { distance: 100, angle: 90 }, vector2: { distance: 45, angle: 45 }
        }],
        sourcePoint: { x: 200, y: 100 },
        targetPoint: { x: 300, y: 200 },
    },
    {
        id: 'connector3',
        type: 'Bezier',
        segments: [{
            type: 'Bezier', point1: { x: 500, y: 100 }, point2: { x: 600, y: 200 }
        }],
        sourcePoint: { x: 500, y: 200 },
        targetPoint: { x: 600, y: 100 },
    },
    {
        id: 'connector7', type: 'Bezier',
        segments: [{
            type: 'Bezier',
        }],
        sourceID: node2.id,
        targetID: node7.id,
        sourcePortID: nodeport2.id,
        targetPortID: nodeport7.id,
    },
    {
        id: 'connector5',
        type: 'Bezier',
        segments: [{
            type: 'Bezier',
        }],
        sourceID: node2.id,
        targetID: node3.id,
        sourcePortID: nodeport2.id,
        targetPortID: nodeport3.id,
    },
    {
        id: 'connector6', type: 'Bezier',
        segments: [{
            type: 'Bezier',
        }],
        sourceID: node2.id,
        targetID: node6.id,
        sourcePortID: nodeport2.id,
        targetPortID: nodeport6.id,
    },
];

let diagram: Diagram = new Diagram({
    width: '700px', height: '700px', connectors: connectors, nodes: [node2, node3, node6, node7]
});

diagram.appendTo('#diagram');

document.getElementById('sourcepointX').onchange = function () {
    let value: string = (document.getElementById('sourcepointX') as HTMLSelectElement).value;
    diagram.connectors[0].sourcePoint.x = Number(value);
    diagram.dataBind();
};

document.getElementById('sourcepointX').onchange = function () {
    var value: string = (document.getElementById('sourcepointX') as HTMLSelectElement).value;
    diagram.connectors[0].sourcePoint.x = Number(value);
    diagram.dataBind();
};
document.getElementById('sourcepointY').onchange = function () {
    let value: string = (document.getElementById('sourcepointY') as HTMLSelectElement).value;
    diagram.connectors[0].sourcePoint.y = Number(value);
    diagram.dataBind();
};
document.getElementById('TargetpointX').onchange = function () {
    let value: string = (document.getElementById('TargetpointX') as HTMLSelectElement).value;
    diagram.connectors[0].targetPoint.x = Number(value);
    diagram.dataBind();
};
document.getElementById('TargetpointY').onchange = function () {
    let value: string = (document.getElementById('TargetpointY') as HTMLSelectElement).value;
    diagram.connectors[0].targetPoint.y = Number(value);
    diagram.dataBind();
};
document.getElementById('Point1X').onchange = function () {
    let value: string = (document.getElementById('Point1X') as HTMLSelectElement).value;
    (diagram.connectors[2].segments[0] as BezierSegmentModel).point1.x = Number(value);
    diagram.dataBind();
};
document.getElementById('Point1Y').onchange = function () {
    let value: string = (document.getElementById('Point1Y') as HTMLSelectElement).value;
    (diagram.connectors[2].segments[0] as BezierSegmentModel).point1.y = Number(value);
    diagram.dataBind();
};
document.getElementById('Point2X').onchange = function () {
    let value: string = (document.getElementById('Point2X') as HTMLSelectElement).value;
    (diagram.connectors[2].segments[0] as BezierSegmentModel).point2.x = Number(value);
    diagram.dataBind();
};
document.getElementById('Point2Y').onchange = function () {
    let value: string = (document.getElementById('Point2Y') as HTMLSelectElement).value;
    (diagram.connectors[2].segments[0] as BezierSegmentModel).point2.y = Number(value);
    diagram.dataBind();
};
document.getElementById('Vector1Angle').onchange = function () {
    let value: string = (document.getElementById('Vector1Angle') as HTMLSelectElement).value;
    (diagram.connectors[1].segments[0] as BezierSegmentModel).vector1.angle = Number(value);
    diagram.dataBind();
};
document.getElementById('Vector1Distance').onchange = function () {
    let value: string = (document.getElementById('Vector1Distance') as HTMLSelectElement).value;
    (diagram.connectors[1].segments[0] as BezierSegmentModel).vector1.distance = Number(value);
    diagram.dataBind();
};
document.getElementById('Vector2Angle').onchange = function () {
    let value: string = (document.getElementById('Vector2Angle') as HTMLSelectElement).value;
    (diagram.connectors[1].segments[0] as BezierSegmentModel).vector2.angle = Number(value);
    diagram.dataBind();
};
document.getElementById('Vector2Distance').onchange = function () {
    let value: string = (document.getElementById('Vector2Distance') as HTMLSelectElement).value;
    (diagram.connectors[1].segments[0] as BezierSegmentModel).vector2.distance = Number(value);
    diagram.dataBind();
};

