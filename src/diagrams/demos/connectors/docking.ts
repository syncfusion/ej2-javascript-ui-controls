import { Diagram } from '../../src/diagram/diagram';
import { TextStyle } from '../../src/diagram/core/appearance';
import { Segments } from '../../src/diagram/enum/enum';
import { NodeModel, PathModel, TextModel, BasicShapeModel } from '../../src/diagram/objects/node-model';
import { ConnectorModel, DecoratorModel } from '../../src/diagram/objects/connector-model';
import { PointPortModel } from '../../src/diagram/objects/port-model';

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
node.width = 100; node.height = 100;
node.offsetX = 100; node.offsetY = 700;
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
node1.width = 100; node1.height = 100;
node1.offsetX = 300; node1.offsetY = 700;
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
node2.width = 100; node2.height = 100;
node2.offsetX = 500; node2.offsetY = 700;
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
node3.width = 100; node3.height = 100;
node3.offsetX = 500; node3.offsetY = 850;
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
node4.width = 100; node4.height = 100;
node4.offsetX = 100; node4.offsetY = 1000;
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
node5.width = 100; node5.height = 100;
node5.offsetX = 300; node5.offsetY = 1000;
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
node6.width = 100; node6.height = 100;
node6.offsetX = 500; node6.offsetY = 1000;
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
node7.width = 100; node7.height = 100;
node7.offsetX = 700; node7.offsetY = 1000;
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
node8.width = 100; node8.height = 100;
node8.offsetX = 900; node8.offsetY = 1000;
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
node9.width = 100; node9.height = 100;
node9.offsetX = 900; node9.offsetY = 1200;
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
node10.width = 100; node10.height = 100;
node10.offsetX = 1200; node10.offsetY = 1000;
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
node11.width = 100; node11.height = 100;
node11.offsetX = 1200; node11.offsetY = 1200;
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
node12.width = 100; node12.height = 100;
node12.offsetX = 100; node12.offsetY = 1400;
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
node13.width = 100; node13.height = 100;
node13.offsetX = 300; node13.offsetY = 1400;
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
node14.width = 100; node14.height = 100;
node14.offsetX = 500; node14.offsetY = 1400;
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
node15.width = 100; node15.height = 100;
node15.offsetX = 700; node15.offsetY = 1400;
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
node16.width = 100; node16.height = 100;
node16.offsetX = 900; node16.offsetY = 1400;
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
node17.width = 100; node17.height = 100;
node17.offsetX = 1100; node17.offsetY = 1400;
node17.shape = text;
(node17.style as TextStyle).color = 'green';
(node17.style as TextStyle).fontSize = 12;
(node17.style as TextStyle).fill = 'transparent'; (node17.style as TextStyle).fontFamily = 'sans-serif';
let nodeport17: PointPortModel = { offset: {}, margin: {}, style: {} }; nodeport17.offset = {
    x: 0, y: 0.5
};
nodeport17.id = 'port17';
nodeport17.shape = 'Square'; node17.ports = [nodeport17];

let node18: NodeModel = { shape: { shape: 'Rectangle' } as BasicShapeModel, style: {} };
node18.id = 'textelement18';
node18.width = 100; node18.height = 100;
node18.offsetX = 100; node18.offsetY = 1600;
node18.shape = text;
(node18.style as TextStyle).color = 'green';
(node18.style as TextStyle).fontSize = 12;
(node18.style as TextStyle).fill = 'transparent'; (node18.style as TextStyle).fontFamily = 'sans-serif';
let nodeport18: PointPortModel = { offset: {}, margin: {}, style: {} }; nodeport18.offset = {
    x: 0.5, y: 0
};
nodeport18.id = 'port18';
nodeport18.shape = 'Square'; node18.ports = [nodeport18];

let node19: NodeModel = { shape: { shape: 'Rectangle' } as BasicShapeModel, style: {} };
node19.id = 'textelement19';
node19.width = 100; node19.height = 100;
node19.offsetX = 300; node19.offsetY = 1600;
node19.shape = text;
(node19.style as TextStyle).color = 'green';
(node19.style as TextStyle).fontSize = 12;
(node19.style as TextStyle).fill = 'transparent'; (node19.style as TextStyle).fontFamily = 'sans-serif';
let nodeport19: PointPortModel = { offset: {}, margin: {}, style: {} }; nodeport19.offset = {
    x: 1, y: 0.5
};
nodeport19.id = 'port19';
nodeport19.shape = 'Square'; node19.ports = [nodeport19];

let node20: NodeModel = { shape: { shape: 'Rectangle' } as BasicShapeModel, style: {} };
node20.id = 'textelement20';
node20.width = 100; node20.height = 100;
node20.offsetX = 500; node20.offsetY = 1600;
node20.shape = text;
(node20.style as TextStyle).color = 'green';
(node20.style as TextStyle).fontSize = 12;
(node20.style as TextStyle).fill = 'transparent'; (node20.style as TextStyle).fontFamily = 'sans-serif';
let nodeport20: PointPortModel = { offset: {}, margin: {}, style: {} }; nodeport20.offset = {
    x: 0.5, y: 1
};
nodeport20.id = 'port20';
nodeport20.shape = 'Square'; node20.ports = [nodeport20];

let node21: NodeModel = { shape: { shape: 'Rectangle' } as BasicShapeModel, style: {} };
node21.id = 'textelement21';
node21.width = 100; node21.height = 100;
node21.offsetX = 700; node21.offsetY = 1600;
node21.shape = text;
(node21.style as TextStyle).color = 'green';
(node21.style as TextStyle).fontSize = 12;
(node21.style as TextStyle).fill = 'transparent'; (node21.style as TextStyle).fontFamily = 'sans-serif';
let nodeport21: PointPortModel = { offset: {}, margin: {}, style: {} }; nodeport21.offset = {
    x: 0, y: 0.5
};
nodeport21.id = 'port21';
nodeport21.shape = 'Square'; node21.ports = [nodeport21];


let node22: NodeModel = { shape: { shape: 'Rectangle' } as BasicShapeModel, style: {} };
node22.id = 'textelement22';
node22.width = 100; node22.height = 100;
node22.offsetX = 900; node22.offsetY = 1600;
node22.shape = text;
(node22.style as TextStyle).color = 'green';
(node22.style as TextStyle).fontSize = 12;
(node22.style as TextStyle).fill = 'transparent'; (node22.style as TextStyle).fontFamily = 'sans-serif';
let nodeport22: PointPortModel = { offset: {}, margin: {}, style: {} }; nodeport22.offset = {
    x: 0.5, y: 1
};
nodeport22.id = 'port22';
nodeport22.shape = 'Square'; node22.ports = [nodeport22];


let node23: NodeModel = { shape: { shape: 'Rectangle' } as BasicShapeModel, style: {} };
node23.id = 'textelement23';
node23.width = 100; node23.height = 100;
node23.offsetX = 1200; node23.offsetY = 1600;
node23.shape = text;
(node23.style as TextStyle).color = 'green';
(node23.style as TextStyle).fontSize = 12;
(node23.style as TextStyle).fill = 'transparent'; (node23.style as TextStyle).fontFamily = 'sans-serif';
let nodeport23: PointPortModel = { offset: {}, margin: {}, style: {} }; nodeport23.offset = {
    x: 1, y: 0.5
};
nodeport23.id = 'port23';
nodeport23.shape = 'Square'; node23.ports = [nodeport23];


let node24: NodeModel = { shape: { shape: 'Rectangle' } as BasicShapeModel, style: {} };
node24.id = 'textelement24';
node24.width = 100; node24.height = 100;
node24.offsetX = 100; node24.offsetY = 1800;
node24.shape = text;
(node24.style as TextStyle).color = 'green';
(node24.style as TextStyle).fontSize = 12;
(node24.style as TextStyle).fill = 'transparent'; (node24.style as TextStyle).fontFamily = 'sans-serif';
let nodeport24: PointPortModel = { offset: {}, margin: {}, style: {} }; nodeport24.offset = {
    x: 0, y: 0.5
};
nodeport24.id = 'port24';
nodeport24.shape = 'Square'; node24.ports = [nodeport24];


let node25: NodeModel = { shape: { shape: 'Rectangle' } as BasicShapeModel, style: {} };
node25.id = 'textelement25';
node25.width = 100; node25.height = 100;
node25.offsetX = 300; node25.offsetY = 1800;
node25.shape = text;
(node25.style as TextStyle).color = 'green';
(node25.style as TextStyle).fontSize = 12;
(node25.style as TextStyle).fill = 'transparent'; (node25.style as TextStyle).fontFamily = 'sans-serif';
let nodeport25: PointPortModel = { offset: {}, margin: {}, style: {} }; nodeport25.offset = {
    x: 0.5, y: 0
};
nodeport25.id = 'port25';
nodeport25.shape = 'Square'; node25.ports = [nodeport25];


let node26: NodeModel = { shape: { shape: 'Rectangle' } as BasicShapeModel, style: {} };
node26.id = 'textelement26';
node26.width = 100; node26.height = 100;
node26.offsetX = 500; node26.offsetY = 1800;
node26.shape = text;
(node26.style as TextStyle).color = 'green';
(node26.style as TextStyle).fontSize = 12;
(node26.style as TextStyle).fill = 'transparent'; (node26.style as TextStyle).fontFamily = 'sans-serif';
let nodeport26: PointPortModel = { offset: {}, margin: {}, style: {} }; nodeport26.offset = {
    x: 1, y: 0.5
};
nodeport26.id = 'port26';
nodeport26.shape = 'Square'; node26.ports = [nodeport26];


let node27: NodeModel = { shape: { shape: 'Rectangle' } as BasicShapeModel, style: {} };
node27.id = 'textelement27';
node27.width = 100; node27.height = 100;
node27.offsetX = 700; node27.offsetY = 1800;
node27.shape = text;
(node27.style as TextStyle).color = 'green';
(node27.style as TextStyle).fontSize = 12;
(node27.style as TextStyle).fill = 'transparent'; (node27.style as TextStyle).fontFamily = 'sans-serif';
let nodeport27: PointPortModel = { offset: {}, margin: {}, style: {} }; nodeport27.offset = {
    x: 0.5, y: 0
};
nodeport27.id = 'port27';
nodeport27.shape = 'Square'; node27.ports = [nodeport27];


let connector5: ConnectorModel = {};
connector5.id = 'connector5';
connector5.type = 'Orthogonal';
connector5.sourceID = node.id;
connector5.targetID = node1.id;
connector5.sourcePortID = nodeport.id;
connector5.targetPortID = nodeport1.id;

let connector6: ConnectorModel = {};
connector6.id = 'connector6';
connector6.type = 'Orthogonal';
connector6.sourceID = node2.id;
connector6.targetID = node3.id;
connector6.sourcePortID = nodeport2.id;
connector6.targetPortID = nodeport3.id;

let connector7: ConnectorModel = {};
connector7.id = 'connector7';
connector7.type = 'Orthogonal';
connector7.sourceID = node4.id;
connector7.targetID = node5.id;
connector7.sourcePortID = nodeport4.id;
connector7.targetPortID = nodeport5.id;

let connector8: ConnectorModel = {};
connector8.id = 'connector8';
connector8.type = 'Orthogonal';
connector8.sourceID = node6.id;
connector8.targetID = node7.id;
connector8.sourcePortID = nodeport6.id;
connector8.targetPortID = nodeport7.id;

let connector9: ConnectorModel = {};
connector8.id = 'connector9';
connector9.type = 'Orthogonal';
connector9.sourceID = node8.id;
connector9.targetID = node9.id;
connector9.sourcePortID = nodeport8.id;
connector9.targetPortID = nodeport9.id;

let connector10: ConnectorModel = {};
connector10.id = 'connector10';
connector10.type = 'Orthogonal';
connector10.sourceID = node10.id;
connector10.targetID = node11.id;
connector10.sourcePortID = nodeport10.id;
connector10.targetPortID = nodeport11.id;

let connector11: ConnectorModel = {};
connector11.id = 'connector11';
connector11.type = 'Orthogonal';
connector11.sourceID = node12.id;
connector11.targetID = node13.id;
connector11.sourcePortID = nodeport12.id;
connector11.targetPortID = nodeport13.id;

let connector12: ConnectorModel = {};
connector12.id = 'connector12';
connector12.type = 'Orthogonal';
connector12.sourceID = node14.id;
connector12.targetID = node15.id;
connector12.sourcePortID = nodeport14.id;
connector12.targetPortID = nodeport15.id;

let connector13: ConnectorModel = {};
connector13.id = 'connector13';
connector13.type = 'Orthogonal';
connector13.sourceID = node16.id;
connector13.targetID = node17.id;
connector13.sourcePortID = nodeport16.id;
connector13.targetPortID = nodeport17.id;

let connector14: ConnectorModel = {};
connector14.id = 'connector14';
connector14.type = 'Orthogonal';
connector14.sourceID = node18.id;
connector14.targetID = node19.id;
connector14.sourcePortID = nodeport18.id;
connector14.targetPortID = nodeport19.id;

let connector15: ConnectorModel = {};
connector15.id = 'connector15';
connector15.type = 'Orthogonal';
connector15.sourceID = node20.id;
connector15.targetID = node21.id;
connector15.sourcePortID = nodeport20.id;
connector15.targetPortID = nodeport21.id;

let connector16: ConnectorModel = {};
connector16.id = 'connector16';
connector16.type = 'Orthogonal';
connector16.sourceID = node22.id;
connector16.targetID = node23.id;
connector16.sourcePortID = nodeport22.id;
connector16.targetPortID = nodeport23.id;

let connector17: ConnectorModel = {};
connector17.id = 'connector17';
connector17.type = 'Orthogonal';
connector17.sourceID = node24.id;
connector17.targetID = node25.id;
connector17.sourcePortID = nodeport24.id;
connector17.targetPortID = nodeport25.id;


let connector18: ConnectorModel = {};
connector18.id = 'connector18';
connector18.type = 'Straight';
connector18.sourceID = node26.id;
connector18.targetID = node27.id;
connector18.sourcePortID = nodeport26.id;
connector18.targetPortID = nodeport27.id;

let diagram: Diagram = new Diagram({
    width: 1500, height: 2000, nodes: [node, node1, node2, node3, node4, node5, node6, node7, node8, node9, node10,
        node11, node12, node13, node14, node15, node16, node17, node18, node19, node20,
        node21, node22, node23, node24, node25, node26, node27], connectors: [
            //nod1, nod2, nod3,
            connector1, connector2, connector3, connector4, connector5, connector6, connector7,
            connector8, connector9, connector10, connector11, connector12, connector13, connector14, connector15, connector16,
            connector17, connector18
        ]
});

diagram.appendTo('#diagram');



