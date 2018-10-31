import { Diagram } from '../../src/diagram/diagram';
import { TextStyle } from '../../src/diagram/core/appearance';
import { Segments, ConnectorConstraints } from '../../src/diagram/enum/enum';
import { NodeModel, PathModel, TextModel, BasicShapeModel } from '../../src/diagram/objects/node-model';
import { ConnectorModel, DecoratorModel } from '../../src/diagram/objects/connector-model';
import { PointPortModel } from '../../src/diagram/objects/port-model';
import { MouseEvents } from '../../spec/diagram/interaction/mouseevents.spec';
import { UndoRedo, ConnectorEditing, Connector, PointModel } from '../../src/diagram/index';
Diagram.Inject(UndoRedo, ConnectorEditing);

/**
 * Connector Docking
 */
let decoratorsrc: DecoratorModel = { pivot: {}, style: {} };
let decoratortarget: DecoratorModel = { pivot: {}, style: {} };
let connector1: ConnectorModel = {};
connector1.id = 'connector1';
connector1.type = 'Straight';
connector1.sourcePoint = { x: 100, y: 100 };
connector1.targetPoint = { x: 200, y: 200 };

let connector2: ConnectorModel = {};
connector2.id = 'connector2';
connector2.type = 'Orthogonal';
connector2.sourcePoint = { x: 250, y: 250 };
connector2.targetPoint = { x: 350, y: 350 };

let connector3: ConnectorModel = {};
connector3.id = 'connector3';
connector3.type = 'Straight';
connector3.sourcePoint = { x: 400, y: 250 };
connector3.targetPoint = { x: 500, y: 250 };


let connector4: ConnectorModel = {};
connector4.id = 'connector4';
connector4.type = 'Orthogonal';
connector4.sourcePoint = { x: 700, y: 350 };
connector4.targetPoint = { x: 600, y: 250 };

let node: NodeModel = { shape: { shape: 'Rectangle' } as BasicShapeModel, style: {} };
node.id = 'node';
node.width = 70; node.height = 70
node.offsetX = 82; node.offsetY = 45;
let shape: PathModel = { type: 'Path' };
shape.data =
    'M540.3643,137.9336L546.7973,159.7016L570.3633,159.7296L550.7723,171.9366L558.9053,194.9966L540.3643,179.4996L521.8223,194.9966L529.9553,171.9366L510.3633,159.7296L533.9313,159.7016L540.3643,137.9336z';
node.shape = shape;
let nodeport: PointPortModel = { offset: {}, margin: {}, style: {} };
nodeport.shape = 'Square';
nodeport.id = 'port';
nodeport.offset = {
    x: 1, y: 0.5
};
node.ports = [nodeport];

let text: TextModel = { type: 'Text', content: 'textelement' };
let node1: NodeModel = { shape: { shape: 'Rectangle' } as BasicShapeModel, style: {} };
node1.id = 'textelement1';
node1.width = 70; node1.height = 70
node1.offsetX = 282; node1.offsetY = 45;
node1.shape = text;
(node1.style as TextStyle).color = 'green';
(node1.style as TextStyle).fontSize = 12;
(node1.style as TextStyle).fill = 'transparent'; (node1.style as TextStyle).fontFamily = 'sans-serif';
let nodeport1: PointPortModel = { offset: {}, margin: {}, style: {} }; nodeport1.offset = {
    x: 0, y: 0.5
}; nodeport1.id = 'port1';
nodeport1.shape = 'Square'; node1.ports = [nodeport1];

let node2: NodeModel = { shape: { shape: 'Rectangle' } as BasicShapeModel, style: {} };
node2.id = 'textelement2';
node2.width = 70; node2.height = 70
node2.offsetX = 482; node2.offsetY = 45;
node2.shape = text;
(node2.style as TextStyle).color = 'green';
(node2.style as TextStyle).fontSize = 12;
(node2.style as TextStyle).fill = 'transparent'; (node2.style as TextStyle).fontFamily = 'sans-serif';
let nodeport2: PointPortModel = { offset: {}, margin: {}, style: {} }; nodeport2.offset = {
    x: 0.5, y: 1
};
nodeport2.id = 'port2';
nodeport2.shape = 'Square'; node2.ports = [nodeport2];

let node3: NodeModel = { shape: { shape: 'Rectangle' } as BasicShapeModel, style: {} };
node3.id = 'textelement3';
node3.width = 70; node3.height = 70
node3.offsetX = 482; node3.offsetY = 195;
node3.shape = text;
(node3.style as TextStyle).color = 'green';
(node3.style as TextStyle).fontSize = 12;
(node3.style as TextStyle).fill = 'transparent'; (node3.style as TextStyle).fontFamily = 'sans-serif';
let nodeport3: PointPortModel = { offset: {}, margin: {}, style: {} }; nodeport3.offset = {
    x: 0.5, y: 0
};
nodeport3.id = 'port3';
nodeport3.shape = 'Square'; node3.ports = [nodeport3];

let node4: NodeModel = { shape: { shape: 'Rectangle' } as BasicShapeModel, style: {} };
node4.id = 'textelement4';
node4.width = 70; node4.height = 70
node4.offsetX = 300; node4.offsetY = 195;
node4.shape = {};
let path: PathModel = { type: 'Path' };
path.data =
    'M540.3643,137.9336L546.7973,159.7016L570.3633,159.7296L550.7723,171.9366L558.9053,194.9966L540.3643,179.4996L521.8223,194.9966L529.9553,171.9366L510.3633,159.7296L533.9313,159.7016L540.3643,137.9336z';
node4.shape = path;
let nodeport4: PointPortModel = { offset: {}, margin: {}, style: {} };
nodeport4.shape = 'Square';
nodeport4.offset = {
    x: 0, y: 0.5
};
nodeport4.id = 'port4';
node4.ports = [nodeport4];

let node5: NodeModel = { shape: { shape: 'Rectangle' } as BasicShapeModel, style: {} };
node5.id = 'textelement5';
node5.width = 70; node5.height = 70
node5.offsetX = 610; node5.offsetY = 67;
node5.shape = text;
(node5.style as TextStyle).color = 'green';
(node5.style as TextStyle).fontSize = 12;
(node5.style as TextStyle).fill = 'transparent'; (node5.style as TextStyle).fontFamily = 'sans-serif';
let nodeport5: PointPortModel = { offset: {}, margin: {}, style: {} }; nodeport5.offset = {
    x: 0, y: 0.5
}; nodeport5.id = 'port5'
nodeport5.shape = 'Square'; node5.ports = [nodeport5];

let node6: NodeModel = { shape: { shape: 'Rectangle' } as BasicShapeModel, style: {} };
node6.id = 'textelement6';
node6.width = 70; node6.height = 70
node6.offsetX = 810; node6.offsetY = 67;
node6.shape = text;
(node6.style as TextStyle).color = 'green';
(node6.style as TextStyle).fontSize = 12;
(node6.style as TextStyle).fill = 'transparent'; (node6.style as TextStyle).fontFamily = 'sans-serif';
let nodeport6: PointPortModel = { offset: {}, margin: {}, style: {} }; nodeport6.offset = {
    x: 1, y: 0.5
};
nodeport6.id = 'port6';
nodeport6.shape = 'Square'; node6.ports = [nodeport6];

let node7: NodeModel = { shape: { shape: 'Rectangle' } as BasicShapeModel, style: {} };
node7.id = 'textelement7';
node7.width = 70; node7.height = 70
node7.offsetX = 935; node7.offsetY = 63;
node7.shape = text;

(node7.style as TextStyle).color = 'green';
(node7.style as TextStyle).fontSize = 12;
(node7.style as TextStyle).fill = 'transparent'; (node7.style as TextStyle).fontFamily = 'sans-serif';
let nodeport7: PointPortModel = { offset: {}, margin: {}, style: {} }; nodeport7.offset = {
    x: 1, y: 0.5
};
nodeport7.id = 'port7';
nodeport7.shape = 'Square'; node7.ports = [nodeport7];

let node8: NodeModel = { shape: { shape: 'Rectangle' } as BasicShapeModel, style: {} };
node8.id = 'textelement8';
node8.width = 70; node8.height = 70
node8.offsetX = 938; node8.offsetY = 193;
node8.shape = text;
(node8.style as TextStyle).color = 'green';
(node8.style as TextStyle).fontSize = 12;
(node8.style as TextStyle).fill = 'transparent'; (node8.style as TextStyle).fontFamily = 'sans-serif';
let nodeport8: PointPortModel = { offset: {}, margin: {}, style: {} }; nodeport8.offset = {
    x: 0.5, y: 0
};
nodeport8.id = 'port8';
nodeport8.shape = 'Square'; node8.ports = [nodeport8];

let node9: NodeModel = { shape: { shape: 'Rectangle' } as BasicShapeModel, style: {} };
node9.id = 'textelement9';
node9.width = 70; node9.height = 70
node9.offsetX = 1097; node9.offsetY = 63;
node9.shape = text;
(node9.style as TextStyle).color = 'green';
(node9.style as TextStyle).fontSize = 12;
(node9.style as TextStyle).fill = 'transparent'; (node9.style as TextStyle).fontFamily = 'sans-serif';
let nodeport9: PointPortModel = { offset: {}, margin: {}, style: {} }; nodeport9.offset = {
    x: 0.5, y: 0
};
nodeport9.id = 'port9';
nodeport9.shape = 'Square'; node9.ports = [nodeport9];

let node10: NodeModel = { shape: { shape: 'Rectangle' } as BasicShapeModel, style: {} };
node10.id = 'textelement10';
node10.width = 70; node10.height = 70
node10.offsetX = 1094; node10.offsetY = 191;
node10.shape = text;
(node10.style as TextStyle).color = 'green';
(node10.style as TextStyle).fontSize = 12;
(node10.style as TextStyle).fill = 'transparent'; (node10.style as TextStyle).fontFamily = 'sans-serif';
let nodeport10: PointPortModel = { offset: {}, margin: {}, style: {} }; nodeport10.offset = {
    x: 0.5, y: 1
};
nodeport10.id = 'port10';
nodeport10.shape = 'Square'; node10.ports = [nodeport10];

let node11: NodeModel = { shape: { shape: 'Rectangle' } as BasicShapeModel, style: {} };
node11.id = 'textelement11';
node11.width = 70; node11.height = 70
node11.offsetX = 100; node11.offsetY = 316;
node11.shape = text;
(node11.style as TextStyle).color = 'green';
(node11.style as TextStyle).fontSize = 12;
(node11.style as TextStyle).fill = 'transparent'; (node11.style as TextStyle).fontFamily = 'sans-serif';
let nodeport11: PointPortModel = { offset: {}, margin: {}, style: {} }; nodeport11.offset = {
    x: 0.5, y: 1
};
nodeport11.id = 'port11';
nodeport11.shape = 'Square'; node11.ports = [nodeport11];


let node12: NodeModel = { shape: { shape: 'Rectangle' } as BasicShapeModel, style: {} };
node12.id = 'textelement12';
node12.width = 70; node12.height = 70
node12.offsetX = 239; node12.offsetY = 317;
node12.shape = text;
(node12.style as TextStyle).color = 'green';
(node12.style as TextStyle).fontSize = 12;
(node12.style as TextStyle).fill = 'transparent'; (node12.style as TextStyle).fontFamily = 'sans-serif';
let nodeport12: PointPortModel = { offset: {}, margin: {}, style: {} }; nodeport12.offset = {
    x: 0, y: 0.5
};
nodeport12.id = 'port12';
nodeport12.shape = 'Square'; node12.ports = [nodeport12];

let node13: NodeModel = { shape: { shape: 'Rectangle' } as BasicShapeModel, style: {} };
node13.id = 'textelement13';
node13.width = 70; node13.height = 70
node13.offsetX = 372; node13.offsetY = 310;
node13.shape = text;
(node13.style as TextStyle).color = 'green';
(node13.style as TextStyle).fontSize = 12;
(node13.style as TextStyle).fill = 'transparent'; (node13.style as TextStyle).fontFamily = 'sans-serif';
let nodeport13: PointPortModel = { offset: {}, margin: {}, style: {} }; nodeport13.offset = {
    x: 0.5, y: 1
};
nodeport13.id = 'port13';
nodeport13.shape = 'Square'; node13.ports = [nodeport13];

let node14: NodeModel = { shape: { shape: 'Rectangle' } as BasicShapeModel, style: {} };
node14.id = 'textelement14';
node14.width = 70; node14.height = 70
node14.offsetX = 514; node14.offsetY = 325;
node14.shape = text;
(node14.style as TextStyle).color = 'green';
(node14.style as TextStyle).fontSize = 12;
(node14.style as TextStyle).fill = 'transparent'; (node14.style as TextStyle).fontFamily = 'sans-serif';
let nodeport14: PointPortModel = { offset: {}, margin: {}, style: {} }; nodeport14.offset = {
    x: 1, y: 0.5
};
nodeport14.id = 'port14';
nodeport14.shape = 'Square'; node14.ports = [nodeport14];

let node15: NodeModel = { shape: { shape: 'Rectangle' } as BasicShapeModel, style: {} };
node15.id = 'textelement15';
node15.width = 70; node15.height = 70
node15.offsetX = 640; node15.offsetY = 276;
node15.shape = text;

(node15.style as TextStyle).color = 'green';
(node15.style as TextStyle).fontSize = 12;
(node15.style as TextStyle).fill = 'transparent'; (node15.style as TextStyle).fontFamily = 'sans-serif';
let nodeport15: PointPortModel = { offset: {}, margin: {}, style: {} }; nodeport15.offset = {
    x: 0.5, y: 1
};
nodeport15.id = 'port15';
nodeport15.shape = 'Square'; node15.ports = [nodeport15];

let node16: NodeModel = { shape: { shape: 'Rectangle' } as BasicShapeModel, style: {} };
node16.id = 'textelement16';
node16.width = 70; node16.height = 70
node16.offsetX = 840; node16.offsetY = 276;
node16.shape = text;
(node16.style as TextStyle).color = 'green';
(node16.style as TextStyle).fontSize = 12;
(node16.style as TextStyle).fill = 'transparent'; (node16.style as TextStyle).fontFamily = 'sans-serif';
let nodeport16: PointPortModel = { offset: {}, margin: {}, style: {} }; nodeport16.offset = {
    x: 0.5, y: 0
};
nodeport16.id = 'port16';
nodeport16.shape = 'Square'; node16.ports = [nodeport16];


let node17: NodeModel = { shape: { shape: 'Rectangle' } as BasicShapeModel, style: {} };
node17.id = 'textelement17';
node17.width = 70; node17.height = 70
node17.offsetX = 936; node17.offsetY = 365;
node17.shape = text;
(node17.style as TextStyle).color = 'green';
(node17.style as TextStyle).fontSize = 12;
(node17.style as TextStyle).fill = 'transparent'; (node17.style as TextStyle).fontFamily = 'sans-serif';
let nodeport17: PointPortModel = { offset: {}, margin: {}, style: {} }; nodeport17.offset = {
    x: 0, y: 0.5
};
nodeport17.id = 'port17';
nodeport17.shape = 'Square'; node17.ports = [nodeport17];

let diagram: Diagram = new Diagram({
    width: '1250px', height: '450px', nodes: [node, node1, node2, node3, node4, node5, node6, node7, node8, node9, node10,
        node11, node12, node13, node14, node15, node16, node17], connectors: [
            { id: 'Connector1', sourceID: 'node', sourcePortID: 'port', targetID: 'textelement4', targetPortID: 'port4' },
            { id: 'Connector2', sourceID: 'textelement1', sourcePortID: 'port1', targetID: 'textelement2', targetPortID: 'port2' },
            { id: 'Connector3', sourceID: 'textelement5', sourcePortID: '', targetID: 'textelement3', targetPortID: 'port3' },
            { id: 'Connector4', sourceID: 'textelement6', sourcePortID: 'port6', targetID: 'textelement16', targetPortID: '' },
            { id: 'Connector5', sourceID: 'textelement7', sourcePortID: 'port7', targetID: 'textelement8', targetPortID: 'port8' },
            { id: 'Connector6', sourceID: 'textelement9', sourcePortID: 'port9', targetID: 'textelement10', targetPortID: 'port10' },
            { id: 'Connector7', sourceID: 'textelement8', sourcePortID: 'port8', targetID: 'textelement17', targetPortID: 'port17' },
            { id: 'Connector8', sourceID: 'textelement16', sourcePortID: '', targetID: 'textelement15', targetPortID: 'port15' },
            { id: 'Connector9', sourceID: 'textelement15', sourcePortID: '', targetID: 'textelement13', targetPortID: 'port13' },
            { id: 'Connector10', sourceID: 'textelement3', sourcePortID: '', targetID: 'textelement14', targetPortID: 'port14' },
            { id: 'Connector11', sourceID: 'textelement11', sourcePortID: 'port11', targetID: 'textelement12', targetPortID: 'port12' },
            { id: 'Connector12', sourceID: 'textelement12', sourcePortID: 'port12', targetID: 'textelement13', targetPortID: '' },
        ],
    getConnectorDefaults: (obj: ConnectorModel, diagram: Diagram) => {
        let connector: ConnectorModel = {};
        connector.type = 'Orthogonal';
        connector.constraints = ConnectorConstraints.Default | ConnectorConstraints.DragSegmentThumb;
        return connector;
    },
});

diagram.appendTo('#diagram');

let mouseevents = new MouseEvents();
let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
mouseevents.clickEvent(diagramCanvas, 10, 10);
let button = document.getElementById('undo');
button.onclick = function () {
    diagram.undo();
}
let button1 = document.getElementById('redo');
button1.onclick = function () {
    diagram.redo();
}
let disConnect = document.getElementById('disConnect');
disConnect.onclick = function () {
    let connector: ConnectorModel = diagram.connectors[0];
    diagram.select([connector]);
    mouseevents.mouseDownEvent(diagramCanvas, connector.sourcePoint.x + diagram.element.offsetLeft, connector.sourcePoint.y + diagram.element.offsetTop);
    mouseevents.mouseMoveEvent(diagramCanvas, connector.sourcePoint.x + diagram.element.offsetLeft - 50, connector.sourcePoint.y + diagram.element.offsetTop);
    mouseevents.mouseMoveEvent(diagramCanvas, 10 + diagram.element.offsetLeft, connector.sourcePoint.y + diagram.element.offsetTop);
    mouseevents.mouseMoveEvent(diagramCanvas, 5 + diagram.element.offsetLeft, connector.sourcePoint.y + diagram.element.offsetTop);
    mouseevents.mouseUpEvent(diagramCanvas, 5 + diagram.element.offsetLeft, connector.sourcePoint.y + diagram.element.offsetTop);
}
let connect = document.getElementById('connect');
connect.onclick = function () {
    let connector: ConnectorModel = diagram.connectors[0];
    diagram.select([connector]);
    let node: NodeModel = diagram.nodes[0];
    mouseevents.mouseDownEvent(diagramCanvas, connector.sourcePoint.x + diagram.element.offsetLeft, connector.sourcePoint.y + diagram.element.offsetTop)
    mouseevents.mouseMoveEvent(diagramCanvas, connector.sourcePoint.x + diagram.element.offsetLeft + 50, connector.sourcePoint.y + diagram.element.offsetTop)
    mouseevents.mouseMoveEvent(diagramCanvas, node.offsetX + diagram.element.offsetLeft, node.offsetY + diagram.element.offsetTop);
    mouseevents.mouseUpEvent(diagramCanvas, node.offsetX + diagram.element.offsetLeft, node.offsetY + diagram.element.offsetTop);
}

let segmentEditing = document.getElementById('segmentEditing');
segmentEditing.onclick = function () {
    let connector: Connector = diagram.connectors[1] as Connector;
    diagram.select([connector as ConnectorModel]);
    let node: NodeModel = diagram.nodes[0];
    let startPoint: PointModel;
    startPoint = {
        x: (connector.intermediatePoints[2].x + connector.intermediatePoints[3].x) / 2,
        y: (connector.intermediatePoints[2].y + connector.intermediatePoints[3].y) / 2
    };
    mouseevents.mouseDownEvent(diagramCanvas, startPoint.x + diagram.element.offsetLeft, startPoint.y + diagram.element.offsetTop)
    mouseevents.mouseMoveEvent(diagramCanvas, startPoint.x + diagram.element.offsetLeft, startPoint.y + diagram.element.offsetTop + 50)
    mouseevents.mouseMoveEvent(diagramCanvas, startPoint.x + diagram.element.offsetLeft, startPoint.y + diagram.element.offsetTop + 60);
    mouseevents.mouseUpEvent(diagramCanvas, startPoint.x + diagram.element.offsetLeft, startPoint.y + diagram.element.offsetTop + 60);
}
let segmentEditing1 = document.getElementById('segmentEditing1');
segmentEditing1.onclick = function () {
    let connector: Connector = diagram.connectors[1] as Connector;
    diagram.select([connector as ConnectorModel]);
    let node: NodeModel = diagram.nodes[0];
    let startPoint: PointModel;
    startPoint = {
        x: (connector.intermediatePoints[2].x + connector.intermediatePoints[1].x) / 2,
        y: (connector.intermediatePoints[2].y + connector.intermediatePoints[1].y) / 2
    };
    mouseevents.mouseDownEvent(diagramCanvas, startPoint.x + diagram.element.offsetLeft, startPoint.y + diagram.element.offsetTop)
    mouseevents.mouseMoveEvent(diagramCanvas, startPoint.x + diagram.element.offsetLeft + 50, startPoint.y + diagram.element.offsetTop)
    mouseevents.mouseMoveEvent(diagramCanvas, startPoint.x + diagram.element.offsetLeft + 60, startPoint.y + diagram.element.offsetTop);
    mouseevents.mouseUpEvent(diagramCanvas, startPoint.x + diagram.element.offsetLeft + 60, startPoint.y + diagram.element.offsetTop);
}
let segmentEditing2 = document.getElementById('segmentEditing2');
segmentEditing2.onclick = function () {
    let connector: Connector = diagram.connectors[9] as Connector;
    diagram.select([connector as ConnectorModel]);
    let startPoint: PointModel;
    startPoint = {
        x: (connector.intermediatePoints[2].x + connector.intermediatePoints[1].x) / 2,
        y: (connector.intermediatePoints[2].y + connector.intermediatePoints[1].y) / 2
    };
    mouseevents.mouseDownEvent(diagramCanvas, startPoint.x + diagram.element.offsetLeft, startPoint.y + diagram.element.offsetTop)
    mouseevents.mouseMoveEvent(diagramCanvas, startPoint.x + diagram.element.offsetLeft, startPoint.y + diagram.element.offsetTop - 5)
    mouseevents.mouseMoveEvent(diagramCanvas, startPoint.x + diagram.element.offsetLeft, startPoint.y + diagram.element.offsetTop - 10);
    mouseevents.mouseMoveEvent(diagramCanvas, startPoint.x + diagram.element.offsetLeft, startPoint.y + diagram.element.offsetTop - 20);
    mouseevents.mouseMoveEvent(diagramCanvas, startPoint.x + diagram.element.offsetLeft, startPoint.y + diagram.element.offsetTop - 30);
    mouseevents.mouseMoveEvent(diagramCanvas, startPoint.x + diagram.element.offsetLeft, startPoint.y + diagram.element.offsetTop - 40);
    mouseevents.mouseUpEvent(diagramCanvas, startPoint.x + diagram.element.offsetLeft, startPoint.y + diagram.element.offsetTop - 40);
}


let nodeToPoint = document.getElementById('segmentEditing6');
nodeToPoint.onclick = function () {
    let connector: Connector = diagram.connectors[7] as Connector;
    diagram.select([connector as ConnectorModel]);
    let startPoint: PointModel;
    startPoint = {
        x: (connector.intermediatePoints[2].x + connector.intermediatePoints[3].x) / 2,
        y: (connector.intermediatePoints[2].y + connector.intermediatePoints[3].y) / 2
    };
    mouseevents.mouseDownEvent(diagramCanvas, startPoint.x + diagram.element.offsetLeft, startPoint.y + diagram.element.offsetTop)
    mouseevents.mouseMoveEvent(diagramCanvas, startPoint.x + diagram.element.offsetLeft, startPoint.y + diagram.element.offsetTop + 20)
    mouseevents.mouseMoveEvent(diagramCanvas, startPoint.x + diagram.element.offsetLeft, startPoint.y + diagram.element.offsetTop + 30);
    mouseevents.mouseMoveEvent(diagramCanvas, startPoint.x + diagram.element.offsetLeft, startPoint.y + diagram.element.offsetTop + 40);
    mouseevents.mouseUpEvent(diagramCanvas, startPoint.x + diagram.element.offsetLeft, startPoint.y + diagram.element.offsetTop + 40);
    connector = diagram.connectors[7] as Connector;
    diagram.select([connector as ConnectorModel]);
    startPoint = {
        x: (connector.intermediatePoints[0].x + connector.intermediatePoints[0].x) / 2,
        y: (connector.intermediatePoints[0].y + connector.intermediatePoints[0].y) / 2
    };
    mouseevents.mouseDownEvent(diagramCanvas, startPoint.x + diagram.element.offsetLeft, startPoint.y + diagram.element.offsetTop)
    mouseevents.mouseMoveEvent(diagramCanvas, startPoint.x + diagram.element.offsetLeft - 20, startPoint.y + diagram.element.offsetTop)
    mouseevents.mouseMoveEvent(diagramCanvas, startPoint.x + diagram.element.offsetLeft - 30, startPoint.y + diagram.element.offsetTop);
    mouseevents.mouseMoveEvent(diagramCanvas, startPoint.x + diagram.element.offsetLeft - 40, startPoint.y + diagram.element.offsetTop);
    mouseevents.mouseUpEvent(diagramCanvas, startPoint.x + diagram.element.offsetLeft - 40, startPoint.y + diagram.element.offsetTop);
}

let pointToNode = document.getElementById('segmentEditing7');
pointToNode.onclick = function () {
    let connector: Connector = diagram.connectors[7] as Connector;
    diagram.select([connector as ConnectorModel]);
    let startPoint: PointModel;
    startPoint = {
        x: (connector.intermediatePoints[0].x + connector.intermediatePoints[0].x) / 2,
        y: (connector.intermediatePoints[0].y + connector.intermediatePoints[0].y) / 2
    };
    let node: NodeModel = diagram.nodes[16];
    mouseevents.mouseDownEvent(diagramCanvas, startPoint.x + diagram.element.offsetLeft, startPoint.y + diagram.element.offsetTop)
    mouseevents.mouseMoveEvent(diagramCanvas, startPoint.x + diagram.element.offsetLeft + 20, startPoint.y + diagram.element.offsetTop)
    mouseevents.mouseMoveEvent(diagramCanvas, startPoint.x + diagram.element.offsetLeft + 30, startPoint.y + diagram.element.offsetTop);
    mouseevents.mouseMoveEvent(diagramCanvas, node.offsetX + diagram.element.offsetLeft, node.offsetY + diagram.element.offsetTop);
    mouseevents.mouseUpEvent(diagramCanvas, node.offsetX + diagram.element.offsetLeft, node.offsetY + diagram.element.offsetTop);
}