/**
 * Explores the types of nodes
 */

import {
    Diagram, NodeModel, StackPanel, PortVisibility, AnnotationModel, ShapeAnnotationModel, Node, TextElement, ConnectorModel, Orientation, VerticalAlignment, Port, PointPort, PortModel, PointPortModel, DiagramElement, AnnotationConstraints
} from '../../src/diagram/index';
import { MouseEvents } from '../../spec/diagram/interaction/mouseevents.spec';



var newnode: NodeModel = {
    offsetX: 250,
    offsetY: 250,
    width: 100,
    height: 100,
    shape: {
        type: "Basic",
        shape: "Triangle"
    },
    style: {
        fill: '#6BA5D7',
        strokeColor: 'white'
    },
    annotations: [
        {
            content: "ssss",
            constraints: AnnotationConstraints.Interaction,
            style: { fill: "transparent" }
        }
    ]
};
var nodes = [
    {
        id: 'node1', width: 50, height: 50, offsetX: 600,
        offsetY: 300,
    }, {
        id: 'node2', width: 50, height: 50, offsetX: 600,
        offsetY: 400
    },
    { id: 'group', children: ['node1', 'node2'], rotateAngle: 45 },
];
var connectors: ConnectorModel = {
    id: 'connector2',
    type: 'Straight',
    sourcePoint: { x: 300, y: 100 },
    targetPoint: { x: 400, y: 200 },
    annotations: [{ content: 'tecp' }],
    sourceDecorator: {
        style: { fill: 'black' },
        shape: 'Diamond',
        pivot: { x: 0, y: 0.5 }
    },
    targetDecorator: {
        // shape: 'None',
        style: { fill: 'blue' },
        pivot: { x: 0, y: 0.5 }
    }
};

let diagram: Diagram = new Diagram({
    width: '800px', height: '500px', nodes: nodes,
    connectors: [connectors],

});
diagram.appendTo('#diagram');
diagram.add(newnode);

let addport = document.getElementById('addport');
var nudgeTestCase = document.getElementById('nudgeTestCase');
nudgeTestCase.onclick = function () {
    var mouseEvents = new MouseEvents();
    let diagramCanvas; let left; let top;
    diagramCanvas = document.getElementById(diagram.element.id + 'content');
    mouseEvents.clickEvent(diagramCanvas, 1, 1);
    left = diagram.element.offsetLeft; top = diagram.element.offsetTop;
    let node = (diagram.nodes[3]);
    let annotation = node.wrapper.children[1];
    mouseEvents.clickEvent(diagramCanvas, annotation.offsetX + left, annotation.offsetY + top);
    diagram.nudge('Right');
};
var testcases = document.getElementById('testcases');
testcases.onclick = function () {
    var mouseEvents = new MouseEvents();
    var diagramCanvas = document.getElementById(diagram.element.id + 'content');
    var offsetX = diagram.nodes[3].offsetX;
    var offsetY = diagram.nodes[3].offsetY;
    mouseEvents.mouseDownEvent(diagramCanvas, offsetX, offsetY, true);
    mouseEvents.mouseMoveEvent(diagramCanvas, offsetX, offsetY, true);
    mouseEvents.dragAndDropEvent(diagramCanvas, offsetX, offsetY, offsetX, offsetY);
    mouseEvents.mouseMoveEvent(diagramCanvas, 800, 100);
    mouseEvents.mouseLeaveEvent(diagramCanvas);
    mouseEvents.dragAndDropEvent(diagramCanvas, offsetX, offsetY, offsetX + 100, offsetY);
    var diagramCanvas = document.getElementById(diagram.element.id + 'content');
    mouseEvents.clickEvent(diagramCanvas, 400, 300);
    diagram.startTextEdit(diagram.selectedItems.nodes[0], diagram.selectedItems.nodes[0].annotations[0].id);
    (document.getElementById(diagram.element.id + '_editBox') as HTMLTextAreaElement).value = 'editText1';
    mouseEvents.clickEvent(diagramCanvas, 10, 10);
    var temp = document.getElementById(diagram.nodes[3].wrapper.children[1].id + '_groupElement');
};
var testcases1 = document.getElementById('testcases1');
testcases1.onclick = function () {
    var mouseEvents = new MouseEvents();
    var diagramCanvas = document.getElementById(diagram.element.id + 'content');
    var offsetX = diagram.connectors[0].wrapper.offsetX;
    var offsetY = diagram.connectors[0].wrapper.offsetY;
    mouseEvents.dragAndDropEvent(diagramCanvas, offsetX, offsetY, offsetX - 20, offsetY - 20);
    var connector = diagram.connectors[0];
    connector.targetDecorator.style.fill = 'red';
    diagram.dataBind();
    var element = document.getElementById(connector.id + '_tarDec_groupElement');
};
var testcases2 = document.getElementById('testcases2');
testcases2.onclick = function () {
    var offsetX = diagram.nodes[2].offsetX;
    var offsetY = diagram.nodes[2].offsetY;
    var diagramCanvas = document.getElementById(diagram.element.id + 'content');
    var mouseEvents = new MouseEvents();
    mouseEvents.clickEvent(diagramCanvas, offsetX, offsetY);
    diagram.copy();
    diagram.paste();
    var node = diagram.nodes[5];
    var element = document.getElementById(node.id + '_content_groupElement');
};