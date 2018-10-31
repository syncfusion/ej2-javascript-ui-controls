import {
    Diagram, NodeModel, BasicShapeModel, FlowShapeModel, BpmnShapeModel, ConnectorModel,
    PointPortModel, BasicShapes, FlowShapes, BpmnShapes, BpmnEventModel, BpmnGatewayModel, UndoRedo,
    BpmnDataObjectModel, BpmnActivityModel, BpmnDiagrams, Segments, DiagramTools, ShapeAnnotationModel, PathModel, ImageModel, TextModel, DiagramConstraints, SelectorConstraints
} from '../../src/diagram/index';
import { MouseEvents } from '../../spec/diagram/interaction/mouseevents.spec';
Diagram.Inject(BpmnDiagrams, UndoRedo);

/**
 * Basic Shapes
 */
let nodeport1: PointPortModel = { offset: { x: 1, y: 0.5 } };
let nodeport2: PointPortModel = { offset: { x: 0, y: 0.5 } };
let shape: BasicShapeModel = { type: 'Basic', shape: 'Rectangle' };
let node1: NodeModel = { id: 'node', offsetX: 100, offsetY: 100, shape: shape, ports: [nodeport1] };
let shape2: BasicShapeModel = { type: 'Basic', shape: 'Ellipse' };
let node2: NodeModel = { id: 'node2', offsetX: 700, offsetY: 500, shape: shape2, ports: [nodeport2] };

let continuousDraw: any;
let connectors: ConnectorModel[] = [{
    id: 'connector1',
    type: 'Straight',
    sourcePoint: { x: 100, y: 100 },
    targetPoint: { x: 200, y: 200 },
},
{
    id: 'connector2',
    type: 'Orthogonal',
    sourcePoint: { x: 300, y: 100 },
    targetPoint: { x: 400, y: 200 },
}];
let diagram: Diagram = new Diagram({
    width: '1000px', height: 700, nodes: [node1, node2], connectors: connectors
});
diagram.scrollSettings.canAutoScroll = true;
diagram.appendTo('#diagram');
document.getElementById('selectBox').onclick = showCheckboxes;

let expanded = false;
function showCheckboxes() {
    let checkboxes: HTMLElement = document.getElementById('checkboxes');
    if (!expanded) {
        checkboxes.style.display = 'block';
        expanded = true;
    } else {
        checkboxes.style.display = 'none';
        expanded = false;
    }
}
function applyConstraints(value: string): void {
    chageTool(value, (document.getElementById(value) as HTMLInputElement).checked);
}

document.getElementById('None').onchange = () => {
    applyConstraints('None');

};
document.getElementById('SingleSelect').onchange = () => {
    applyConstraints('SingleSelect');

};
document.getElementById('MultipleSelect').onchange = () => {
    applyConstraints('MultipleSelect');

};
document.getElementById('DrawOnce').onchange = () => {
    applyConstraints('DrawOnce');

};
document.getElementById('ContinuousDraw').onchange = () => {
    applyConstraints('ContinuousDraw');

};
document.getElementById('ZoomPan').onchange = () => {
    applyConstraints('ZoomPan');

};
document.getElementById('Default').onchange = () => {
    applyConstraints('Default');

};
// tslint:disable-next-line:max-func-body-length
function chageTool(constraints: string, checked: boolean): void {
    if (constraints === 'None') {
        diagram.tool = DiagramTools.Default;
    }
    switch (constraints) {
        case 'None':
            if (checked) {
                diagram.tool = DiagramTools.None;
            }
            break;
        case 'SingleSelect':
            if (checked) {
                diagram.tool |= DiagramTools.SingleSelect;
            } else {
                diagram.tool &= ~DiagramTools.SingleSelect;
            }
            break;
        case 'MultipleSelect':
            if (checked) {
                diagram.tool |= DiagramTools.MultipleSelect;
            } else {
                diagram.tool &= ~DiagramTools.MultipleSelect;
            }
            break;
        case 'DrawOnce':
            if (checked) {
                diagram.tool |= DiagramTools.DrawOnce;
            } else {
                diagram.tool &= ~DiagramTools.DrawOnce;
            }
            break;
        case 'ContinuousDraw':
            if (checked) {
                diagram.tool |= DiagramTools.ContinuousDraw;
            } else {
                diagram.tool &= ~DiagramTools.ContinuousDraw;
            }
            break;
        case 'ZoomPan':
            if (checked) {
                diagram.tool |= DiagramTools.ZoomPan;
            } else {
                diagram.tool &= ~DiagramTools.ZoomPan;
            }
            break;
        case 'Default':
            if (checked) {
                diagram.tool |= DiagramTools.Default;
            } else {
                diagram.tool &= ~DiagramTools.Default;
            }
            break;
    }
    diagram.dataBind();
}
document.getElementById('dropdown').onchange = (arg) => {
    let type: any = document.getElementById('applyshapes');
    switch (type.value) {
        case 'Draw':
            drawObject1();
            break;
        case 'DrawPolygon':
            drawPolygon();
            break;
        case 'Path':
            getPathShape();
            break;
        case 'image':
            getImageNode();
            break;
        case 'svg':
            getSVGNode();
            break;
        case 'text':
            getTextNode();
            break;
    }
};
//Set TextNode Shape.
function getTextNode(): void {
    let drawingshape: NodeModel | PathModel | ImageModel | TextModel | ConnectorModel;
    drawingshape = { type: 'Text', content: 'Text' };
    let node: NodeModel = {
        shape: drawingshape, style: { color: 'black' }
    };
    setdrawobject(node, null);
}
//Set SVG Node
function getSVGNode(): void {
    // tslint:disable-next-line:max-line-length
    let drawingshape: NodeModel | PathModel | ImageModel | TextModel | ConnectorModel;
    drawingshape = {
        type: 'Native', content: getPath(),
    };
    let node: NodeModel = {
        shape: drawingshape
    };
    setdrawobject(node, null);
}
function getPath(): string {
    let str: string = '<svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="350.000000pt" ' +
        'height="229.000000pt" viewBox="0 0 350.000000 229.000000" ' +
        'preserveAspectRatio="xMidYMid meet"> <metadata>' +
        ' Created by potrace 1.11, written by Peter Selinger 2001-2013' +
        ' </metadata> <g transform="translate(0.000000,229.000000) scale(0.100000,-0.100000)"' +
        ' fill="#de6ca9" stroke="none"><path d="M0 1145 l0 -1145 1750 0 1750 0 0 1145 0 1145' +
        ' -1750 0 -1750 0 0 -1145z m1434 186 c19 -8 26 -18 26 -37 0 -24 -3 -26' +
        ' -27 -19 -16 3 -58 9 -94 12 -63 5 -67 4 -88 -23 -23 -29 -21 -60 6 -81 8' +
        ' -6 47 -19 86 -29 55 -13 80 -25 106 -51 31 -31 33 -37 29 -88 -8 -94 -69' +
        ' -133 -193 -122 -90 7 -115 20 -115 58 0 26 3 30 18 24 91 -38 168 -41 204' +
        ' -8 23 21 23 75 1 96 -10 8 -49 23 -88 33 -88 22 -135 63 -135 118 0 92 67 140' +
        ' 181 131 31 -2 68 -9 83 -14z m854 -6 c38 -15 42 -21 42 -51 l0 -33 -47 25' +
        ' c-41 22 -58 25 -115 22 -58 -3 -72 -8 -97 -32 -79 -75 -59 -259 32 -297 35' +
        ' -15 106 -18 150 -6 26 7 27 10 27 67 l0 60 -50 0 c-47 0 -50 2 -50 25 0 25' +
        ' 1 25 80 25 l81 0 -3 -97 -3 -98 -40 -20 c-22 -10 -65 -21 -95 -23 -153 -11' +
        ' -242 74 -243 230 0 145 93 235 233 224 30 -2 74 -12 98 -21z m-638 -169 l67' +
        ' -178 40 103 c22 57 53 139 69 182 28 75 29 77 62 77 19 0 32 -4 30 -9 -1 -5' +
        ' -39 -104 -83 -220 l-80 -211 -37 0 c-35 0 -37 2 -56 53 -11 28 -48 124 -81 ' +
        '211 -34 87 -61 163 -61 168 0 5 14 8 32 6 31 -3 32 -5 98 -182z" />' +
        '</g> </svg>';
    return str;
}
function getImageNode(): void {
    let drawingshape: NodeModel | PathModel | ImageModel | TextModel | ConnectorModel;
    drawingshape = { type: 'Image', source: '../overview/employees/image30.png' };
    let node: NodeModel = {
        shape: drawingshape
    };
    setdrawobject(node, null);
}
function getPathShape(): void {
    // tslint:disable-next-line:max-line-length
    let drawingshape: NodeModel | PathModel | ImageModel | TextModel | ConnectorModel;
    drawingshape = { type: 'Path', data: 'M540.3643,137.9336L546.7973,159.7016L570.3633,159.7296L550.7723,171.9366L558.9053,194.9966L540.3643,179.4996L521.8223,194.9966L529.9553,171.9366L510.3633,159.7296L533.9313,159.7016L540.3643,137.9336z' };
    let node = {
        shape: drawingshape
    };
    setdrawobject(node, null);
}
//Enable drawing object.
function setdrawobject(node: NodeModel, connector: ConnectorModel): void {
    let continuousDraw: any = document.getElementById('drawnode');

    if (connector == null) {
        diagram.drawingObject = node;
    } else {
        diagram.drawingObject = connector;
    }
    diagram.dataBind();
}

document.getElementById('connectorType').onchange = () => {
    let type: Segments = (document.getElementById('connectorType') as HTMLInputElement).value as Segments;


    let connector: ConnectorModel = {

        type: type,

    };

    diagram.drawingObject = connector;
    diagram.dataBind();
};

document.getElementById('basicShapes').onchange = () => {
    let value: BasicShapes = (document.getElementById('basicShapes') as HTMLInputElement).value as BasicShapes;

    let shape: BasicShapeModel = { type: 'Basic', shape: value };
    let node: NodeModel =
        {
            shape: shape

        };
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

    diagram.drawingObject = node;
    diagram.dataBind();

};
let multiselect: HTMLButtonElement = document.getElementById('multiselect') as HTMLButtonElement;
multiselect.onclick = () => {
    diagram.select([diagram.nodes[0], diagram.nodes[1]]);
}
let select: HTMLButtonElement = document.getElementById('select') as HTMLButtonElement;
select.onclick = () => {
    diagram.select([diagram.nodes[0]]);
}
let multiselectcon: HTMLButtonElement = document.getElementById('multiselect-connector') as HTMLButtonElement;
multiselectcon.onclick = () => {
    diagram.select([diagram.connectors[0], diagram.connectors[1]]);
}
let selectconnector: HTMLButtonElement = document.getElementById('select-connector') as HTMLButtonElement;
selectconnector.onclick = () => {
    diagram.select([diagram.connectors[0]]);
}
let dragall: HTMLButtonElement = document.getElementById('AllDrag') as HTMLButtonElement;
dragall.onclick = () => {
    diagram.selectAll();
    let mouseevents: MouseEvents = new MouseEvents();
    let diagramCanvas: Element = document.getElementById('diagramcontent');
    mouseevents.dragEvent(diagramCanvas, 340, 120, 440, 200);
    mouseevents.mouseMoveEvent(diagramCanvas, 440, 200);
    mouseevents.mouseUpEvent(diagramCanvas, 440, 200);
}
let zoompanDiagram: HTMLButtonElement = document.getElementById('ZoomPanDiagram') as HTMLButtonElement;
zoompanDiagram.onclick = () => {
    let mouseevents: MouseEvents = new MouseEvents();
    let diagramCanvas: Element = document.getElementById('diagramcontent');
    mouseevents.clickEvent(diagramCanvas, 540, 100);
    mouseevents.mouseMoveEvent(diagramCanvas, 540, 400);
    mouseevents.dragAndDropEvent(diagramCanvas, 540, 100, 400, 400);
}
let drawObject: HTMLButtonElement = document.getElementById('DrawObject') as HTMLButtonElement;
drawObject.onclick = () => {
    drawObject1();
}
function drawObject1(): void {
    resetDiagram();
    let mouseevents: MouseEvents = new MouseEvents();
    let diagramCanvas: Element = document.getElementById('diagramcontent');
    mouseevents.mouseDownEvent(diagramCanvas, 200, 250);
    mouseevents.mouseMoveEvent(diagramCanvas, 250, 350);
    mouseevents.mouseUpEvent(diagramCanvas, 250, 350);
    mouseevents.mouseDownEvent(diagramCanvas, 400, 350);
    mouseevents.mouseMoveEvent(diagramCanvas, 450, 450);
    mouseevents.mouseUpEvent(diagramCanvas, 450, 450);
}
let drawpolygon: HTMLButtonElement = document.getElementById('Polygon') as HTMLButtonElement;
drawpolygon.onclick = () => {
    drawPolygon();
};
function drawPolygon(): void {
    resetDiagram();
    let mouseevents: MouseEvents = new MouseEvents();
    let diagramCanvas: Element = document.getElementById('diagramcontent');
    mouseevents.mouseDownEvent(diagramCanvas, 200, 250);
    mouseevents.mouseMoveEvent(diagramCanvas, 250, 350);
    mouseevents.mouseDownEvent(diagramCanvas, 250, 350);
    mouseevents.mouseMoveEvent(diagramCanvas, 150, 330);
    mouseevents.dblclickEvent(diagramCanvas, 150, 330);
    if (diagram.tool === DiagramTools.ContinuousDraw) {
        mouseevents.mouseDownEvent(diagramCanvas, 400, 350);
        mouseevents.mouseMoveEvent(diagramCanvas, 450, 450);
        mouseevents.mouseDownEvent(diagramCanvas, 450, 450);
        mouseevents.mouseMoveEvent(diagramCanvas, 350, 400);
        mouseevents.dblclickEvent(diagramCanvas, 350, 400);
    }
}
let edittext: HTMLButtonElement = document.getElementById('EditText') as HTMLButtonElement;
edittext.onclick = () => {
    editText();
};
function editText(): void {
    resetDiagram();
    let mouseevents: MouseEvents = new MouseEvents();
    let diagramCanvas: Element = document.getElementById('diagramcontent');
    mouseevents.clickEvent(diagramCanvas, 200, 250);
    (document.getElementById(diagram.element.id + '_editBox') as HTMLTextAreaElement).value = 'editText1';
    if (diagram.tool === DiagramTools.ContinuousDraw) {
        mouseevents.clickEvent(diagramCanvas, 400, 250);
        (document.getElementById(diagram.element.id + '_editBox') as HTMLTextAreaElement).value = 'editText1';
    }
}

function resetDiagram(): void {
    for (let i: number = diagram.historyList.undoStack.length; i >= 0; i--) {
        diagram.undo();
    }
}
