import { Diagram } from '../../src/diagram/diagram';
import { SnapConstraints } from '../../src/diagram/enum/enum';
import { ConnectorModel } from '../../src/diagram/objects/connector-model';
import { NodeModel } from '../../src/diagram/objects/node-model';
import { Snapping, BasicShapes, BasicShapeModel, Segments, FlowShapes, BoundaryConstraints, FlowShapeModel, DiagramTools } from '../../src/diagram/index';
Diagram.Inject(Snapping);
/**
 * pageSettings
 */
let diagram: Diagram;
let connector: ConnectorModel = {
    id: 'connector1', sourcePoint: { x: 300, y: 100 }, targetPoint: { x: 400, y: 100 }
};
let node: NodeModel = {
    id: 'node1', width: 150, height: 100, offsetX: 100, offsetY: 100,
};
let node2: NodeModel = {
    id: 'node2', width: 80, height: 130, offsetX: 200, offsetY: 200,
};
let node3: NodeModel = {
    id: 'node3', width: 100, height: 75, offsetX: 300, offsetY: 350,
};
diagram = new Diagram({
    tool: DiagramTools.ContinuousDraw,
    width: 800, height: 800, nodes: [node, node2],
    connectors: [connector],
    pageSettings: {
        orientation: 'Landscape',
        boundaryConstraints: 'Infinity',

        width: 600, height: 500,
        multiplePage: true, showPageBreaks: true,
    },
    scrollSettings: { canAutoScroll: true }
});
diagram.appendTo('#diagram');

document.getElementById('basicShapes').onchange = () => {
    let value: BasicShapes = (document.getElementById('basicShapes') as HTMLInputElement).value as BasicShapes;

    let shape: BasicShapeModel = { type: 'Basic', shape: value };
    let node: NodeModel =
        {
            shape: shape

        };
};


document.getElementById('connectorType').onchange = () => {
    let type: Segments = (document.getElementById('connectorType') as HTMLInputElement).value as Segments;


    let connector: ConnectorModel = {

        type: type,

    };

    let continuousDraw: any = document.getElementById('drawnode');
    if (continuousDraw.checked) {
        diagram.tool = DiagramTools.ContinuousDraw;
    } else {
        diagram.tool = DiagramTools.DrawOnce;
    }
    diagram.drawingObject = connector;
    diagram.dataBind();

};

document.getElementById('basicShapes').onchange = () => {
    let value: BasicShapes = (document.getElementById('basicShapes') as HTMLInputElement).value as BasicShapes;

    let shape: BasicShapeModel = { type: 'Basic', shape: value };
    let node: NodeModel = { shape: shape };

    let continuousDraw: any = document.getElementById('drawnode');
    if (continuousDraw.checked) {
        diagram.tool = DiagramTools.ContinuousDraw;
    } else {
        diagram.tool = DiagramTools.DrawOnce;
    }
    diagram.drawingObject = node;
    diagram.dataBind();

};

document.getElementById('flowShapes').onchange = () => {
    let value: FlowShapes = (document.getElementById('flowShapes') as HTMLInputElement).value as FlowShapes;

    let shape: FlowShapeModel = { type: 'Flow', shape: value };
    let node: NodeModel =
        {
            shape: shape

        };


    let continuousDraw: any = document.getElementById('drawnode');
    if (continuousDraw.checked) {
        diagram.tool = DiagramTools.ContinuousDraw;
    } else {
        diagram.tool = DiagramTools.DrawOnce;
    }
    diagram.drawingObject = node;
    diagram.dataBind();

};
document.getElementById('BoundaryConstraints').onchange = () => {
    let constraints: BoundaryConstraints = (document.getElementById('BoundaryConstraints') as HTMLInputElement).value as BoundaryConstraints;
    if (constraints != 'Infinity') {
        diagram.scrollSettings.canAutoScroll = false;
    }
    diagram.pageSettings.boundaryConstraints = constraints;
    diagram.dataBind();
};





