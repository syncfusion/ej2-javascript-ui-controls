import {
    Diagram, NodeModel, BasicShapeModel, FlowShapeModel, BpmnShapeModel, ConnectorModel,
    PointPortModel, BasicShapes, FlowShapes, BpmnShapes, BpmnEventModel, BpmnGatewayModel,
    BpmnDataObjectModel, BpmnActivityModel, BpmnDiagrams, Segments, DiagramTools
} from '../../src/diagram/index';
Diagram.Inject(BpmnDiagrams);

/**
 * Basic Shapes
 */
let nodeport1: PointPortModel = { offset: { x: 1, y: 0.5 } };
let nodeport2: PointPortModel = { offset: { x: 0, y: 0.5 } };
let shape: BasicShapeModel = { type: 'Basic', shape: 'Ellipse' };
let node1: NodeModel = {
    id: 'node', offsetX: 200, offsetY: 100, shape: shape,
};
let shape2: BasicShapeModel = { type: 'Basic', shape: 'Ellipse' };
let node2: NodeModel = {
    id: 'node2', offsetX: 500, offsetY: 100, shape: shape2,
};


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
    width: 800, height: 800, nodes: [node1, node2], connectors: connectors
});
diagram.appendTo('#diagram');


document.getElementById('connectorType').onchange = () => {
    let type: Segments = (document.getElementById('connectorType') as HTMLInputElement).value as Segments;


    let connector: ConnectorModel = {

        type: type,

    };

    let continuousDraw: any = document.getElementById('drawnode');
    if (continuousDraw.checked) {
        diagram.tool = DiagramTools.ContinuousDraw;
    } else if (ZoomPan.checked) {
        diagram.tool = DiagramTools.DrawOnce | DiagramTools.ZoomPan
    }
    else {
        diagram.tool = DiagramTools.DrawOnce;
    }
    diagram.drawingObject = connector;
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
    } else if (ZoomPan.checked) {
        diagram.tool = DiagramTools.DrawOnce | DiagramTools.ZoomPan
    }
    else {
        diagram.tool = DiagramTools.DrawOnce;
    }
    diagram.drawingObject = node;
    diagram.dataBind();

};

let ContinuousDraw: any = document.getElementById("drawnode");
ContinuousDraw.onclick = Drawable;

function Drawable() {
    let ZoomPan: any = document.getElementById("ZoomPan");
    if (ContinuousDraw.checked) {
        if (!MultipleSelect.checked && !ZoomPan.checked) {
            diagram.tool = DiagramTools.Default & DiagramTools.MultipleSelect
        }
        else {
            diagram.tool = diagram.tool | DiagramTools.SingleSelect
        }

    }
    else {
        diagram.tool = diagram.tool & DiagramTools.SingleSelect;
    }
    if(ZoomPan.checked){
            ZoomPan.checked = false;
        }
    diagram.dataBind();
}

let SingleSelect: any = document.getElementById("SingleSelect");
SingleSelect.onclick = selectable;

function selectable() {
    if (SingleSelect.checked) {
        if (!MultipleSelect.checked && !ZoomPan.checked) {
            diagram.tool = DiagramTools.Default & ~DiagramTools.MultipleSelect
        }
        else {
            diagram.tool = diagram.tool | DiagramTools.SingleSelect
        }

    }
    else {
        diagram.tool = diagram.tool & ~DiagramTools.SingleSelect;
    }
    diagram.dataBind();
}

let MultipleSelect: any = document.getElementById("MultipleSelect");
MultipleSelect.onclick = MultipleSelectable;

function MultipleSelectable() {
    if (MultipleSelect.checked) {
        if (!SingleSelect.checked && !ZoomPan.checked) {
            diagram.tool = DiagramTools.Default & ~DiagramTools.SingleSelect

        }
        else {
            diagram.tool = diagram.tool | DiagramTools.MultipleSelect;
        }
    }

    else {
        diagram.tool = diagram.tool & ~DiagramTools.MultipleSelect;
    }
    diagram.dataBind();
}



let ZoomPan: any = document.getElementById("ZoomPan");
ZoomPan.onclick = ZoomPanable;

function ZoomPanable() {
    let ContinuousDraw: any = document.getElementById("drawnode");
    if (ZoomPan.checked) {
        if (!SingleSelect.checked && !MultipleSelect.checked) {
            diagram.tool = DiagramTools.ZoomPan;
        }

        else {
            diagram.tool = diagram.tool | DiagramTools.ZoomPan
        }

    }
    else {
        diagram.tool = diagram.tool & ~DiagramTools.ZoomPan;
    }
    if(ContinuousDraw.checked){
         ContinuousDraw.checked = false;
        }
    diagram.dataBind();
}

