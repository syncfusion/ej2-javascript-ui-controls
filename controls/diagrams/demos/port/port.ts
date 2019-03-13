/**
 * Explores the types of nodes
 */

import {
    Diagram, UndoRedo, NodeModel, StackPanel, HorizontalAlignment, PortVisibility, PortShapes, Node, ConnectorModel, VerticalAlignment, Port, PointPort, PortModel, PointPortModel, PortConstraints
} from '../../src/diagram/index';
import { MouseEvents } from '../../spec/diagram/interaction/mouseevents.spec';
Diagram.Inject(UndoRedo);

let nodes: NodeModel[] = [
    {
        id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100, ports: [{ id: 'port1', visibility: PortVisibility.Visible, shape: 'Circle', offset: { x: 0, y: 0.5 } },
        { id: 'port2', visibility: PortVisibility.Hover, shape: 'Circle', offset: { x: 0.5, y: 0 } },
        { id: 'port3', visibility: PortVisibility.Hidden, shape: 'Circle', offset: { x: 1, y: 0.5 } },
        { id: 'port4', visibility: PortVisibility.Connect, shape: 'Circle', offset: { x: 0.5, y: 1 } }
        ]
    },
    {
        id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 100,
        shape: { type: 'Path', data: 'M540.3643,137.9336L546.7973,159.7016L570.3633,159.7296L550.7723,171.9366L558.9053,194.9966L540.3643,179.4996L521.8223,194.9966L529.9553,171.9366L510.3633,159.7296L533.9313,159.7016L540.3643,137.9336z' },
        annotations: [{ content: 'Path Element' }], ports: [{ id: 'port1', visibility: PortVisibility.Visible, shape: 'Circle', offset: { x: 0, y: 0.5 } },
        { id: 'port2', visibility: PortVisibility.Hover, shape: 'Circle', offset: { x: 0.5, y: 0 } },
        { id: 'port3', visibility: PortVisibility.Hidden, shape: 'Circle', offset: { x: 1, y: 0.5 } },
        { id: 'port4', visibility: PortVisibility.Connect, shape: 'Circle', offset: { x: 0.5, y: 1 } }
        ]
    },
    {
        id: 'node3', width: 50, height: 100, offsetX: 300, annotations: [{ id: 'text1', content: 'Child1' }],
        offsetY: 300,
    }, {
        id: 'node4', width: 50, height: 100, offsetX: 400, annotations: [{ id: 'text1', content: 'Child2' }],
        offsetY: 300
    },
    {
        id: 'group', children: ['node3', 'node4'], annotations: [{ id: 'group1', content: 'Group' }],
        ports: [{ id: 'port1', visibility: PortVisibility.Visible, shape: 'Circle', offset: { x: 0, y: 0.5 } },
        { id: 'port2', visibility: PortVisibility.Hover, shape: 'Circle', offset: { x: 0.5, y: 0 } },
        { id: 'port3', visibility: PortVisibility.Hidden, shape: 'Circle', offset: { x: 1, y: 0.5 } },
        { id: 'port4', visibility: PortVisibility.Connect, shape: 'Circle', offset: { x: 0.5, y: 1 } }
        ]
    },
];
let connectors: ConnectorModel[] = [{
    id: 'connector1', sourcePoint: { x: 100, y: 200 }, targetPoint: { x: 200, y: 300 }
}];

let diagram: Diagram = new Diagram({
    width: '800px', height: '500px', nodes: nodes, connectors: connectors
});
diagram.appendTo('#diagram');

let mouseevents = new MouseEvents();
let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
mouseevents.clickEvent(diagramCanvas, 10, 10);
let addport = document.getElementById('addport');
addport.onclick = function () {
    if (diagram.selectedItems.nodes.length > 0) {
        let nodes: Node = diagram.selectedItems.nodes[0] as Node
        let port: PointPortModel[] =
            [{ id: 'port1', visibility: PortVisibility.Visible, shape: 'Circle', offset: { x: 0, y: 0.5 } },
            { id: 'port2', visibility: PortVisibility.Hover, shape: 'Circle', offset: { x: 0.5, y: 0 } },
            { id: 'port3', visibility: PortVisibility.Hidden, shape: 'Circle', offset: { x: 1, y: 0.5 } },
            { id: 'port4', visibility: PortVisibility.Connect, shape: 'Circle', offset: { x: 0.5, y: 1 } }
            ]
        diagram.addPorts(nodes, port);
    }
}

let removeport = document.getElementById('removeport');
removeport.onclick = function () {
    if (diagram.selectedItems.nodes.length > 0) {
        let nodes: Node = diagram.selectedItems.nodes[0] as Node
        let port: PointPortModel[] = [
            { id: 'port1', }, { id: 'port2', }, { id: 'port3', }, { id: 'port4', }
        ]
        diagram.removePorts(nodes, port);
    }
}
let node: NodeModel | ConnectorModel;
let port: PointPort;
document.getElementById('selectNode').onchange = () => {
    let e: HTMLInputElement = (document.getElementById('selectNode')) as HTMLInputElement;
    if (e.value == 'connector') {
        node = diagram.connectors[0];
    } else {
        node = diagram.nodes[Number(e.value)];
    }
    diagram.select([node]);
    if (e.value == 'connector') {
            mouseevents.mouseDownEvent(diagramCanvas, (node as ConnectorModel).sourcePoint.x + diagram.element.offsetLeft, (node as ConnectorModel).sourcePoint.y + diagram.element.offsetTop);
    }
}

document.getElementById('selectPort').onchange = () => {
    let e: string = (document.getElementById('selectPort') as HTMLInputElement).value;
    port = node.ports[Number(e)] as PointPort;
}

document.getElementById('portShapes').onchange = () => {
    if (port) {
        port.shape = ((document.getElementById('portShapes') as HTMLInputElement).value) as PortShapes;
        if(port.shape === 'Custom'){
            port.pathData = (document.getElementById('pathData') as HTMLInputElement).value;
        }
        diagram.dataBind();
    }
}

let expanded = false;
document.getElementById('selectVisiblity').onclick = showCheckboxes;
function showCheckboxes() {
    let checkboxes: HTMLElement = document.getElementById("checkboxes");
    if (!expanded) {
        checkboxes.style.display = "block";
        expanded = true;
    } else {
        checkboxes.style.display = "none";
        expanded = false;
    }
}

document.getElementById('Visible').onchange = function () {
    portVisibility('Visible', (document.getElementById('Visible') as HTMLInputElement).checked);
}
document.getElementById('Hidden').onchange = function () {
    portVisibility('Hidden', (document.getElementById('Hidden') as HTMLInputElement).checked);
}
document.getElementById('Hover').onchange = function () {
    portVisibility('Hover', (document.getElementById('Hover') as HTMLInputElement).checked);
}
document.getElementById('Connect').onchange = function () {
    portVisibility('Connect', (document.getElementById('Connect') as HTMLInputElement).checked);
}

function portVisibility(visibility: string, checked: boolean) {
    if (port) {
        switch (visibility) {
            case 'Visible':
                if (checked) {
                    port.visibility = PortVisibility.Visible;
                } else {
                    port.visibility = port.visibility & ~PortVisibility.Visible;
                }
                break;
            case 'Hidden':
                if (checked) {
                    port.visibility |= PortVisibility.Hidden;
                } else {
                    port.visibility = port.visibility & ~PortVisibility.Hidden;
                }
                break;
            case 'Hover':
                if (checked) {
                    port.visibility |= PortVisibility.Hover;
                } else {
                    port.visibility = port.visibility & ~PortVisibility.Hover;
                }
                break;
            case 'Connect':
                if (checked) {
                    port.visibility |= PortVisibility.Connect;
                } else {
                    port.visibility = port.visibility & ~PortVisibility.Connect;
                }
                break;

        }
    }
}
document.getElementById('alignment').onchange = () => {
    let value = (document.getElementById('alignment') as HTMLInputElement).value;
    if ((document.getElementById('horizontalAlignment') as HTMLInputElement).checked) {
        port.horizontalAlignment = value as HorizontalAlignment;
    } else {
        if (value === 'Left') {
            port.verticalAlignment = 'Top';
        } else if (value === 'Right') {
            port.verticalAlignment = 'Bottom';
        } else {
            port.verticalAlignment = value as VerticalAlignment;
        }
    }
}
document.getElementById('margin').onchange = () => {
    let marginValues;
    let value = Number((document.getElementById('margin') as HTMLInputElement).value);
    if ((document.getElementById('marginLeft') as HTMLInputElement).checked) {
        port.margin.left = value;
    } else if ((document.getElementById('marginRight') as HTMLInputElement).checked) {
        port.margin.right = value;
    } else if ((document.getElementById('marginTop') as HTMLInputElement).checked) {
        port.margin.top = value;
    } else {
        port.margin.bottom = value;
    }
    diagram.dataBind();
}

document.getElementById('offsetX').onchange = () => {
    port.offset.x = Number((document.getElementById('offsetX') as HTMLInputElement).value);
    diagram.dataBind();
}

document.getElementById('offsetY').onchange = () => {
    port.offset.y = Number((document.getElementById('offsetY') as HTMLInputElement).value);
    diagram.dataBind();
}

document.getElementById('pathData').onchange = () => {
    port.pathData = (document.getElementById('pathData') as HTMLInputElement).value;
    diagram.dataBind();
}

document.getElementById('fillColor').onchange = () => {
    if ((document.getElementById('fillColorRadio') as HTMLInputElement).checked) {
        port.style.fill = (document.getElementById('fillColor') as HTMLInputElement).value;
    } else {
        port.style.strokeColor = (document.getElementById('fillColor') as HTMLInputElement).value;
    }
    diagram.dataBind();
}

document.getElementById('widthHeight').onchange = () => {
    if ((document.getElementById('widthRadio') as HTMLInputElement).checked) {
        port.width = Number((document.getElementById('widthHeight') as HTMLInputElement).value);
    } else {
        port.height = Number((document.getElementById('widthHeight') as HTMLInputElement).value);
    }
    diagram.dataBind();
}

document.getElementById('strokeWidth').onchange = () => {
    port.style.strokeWidth = Number((document.getElementById('strokeWidth') as HTMLInputElement).value);
    diagram.dataBind();
}

document.getElementById('strokeDashArray').onchange = () => {
    port.style.strokeDashArray = (document.getElementById('strokeDashArray') as HTMLInputElement).value;
    diagram.dataBind();
}

document.getElementById('opacity').onchange = () => {
    port.style.opacity = Number((document.getElementById('opacity') as HTMLInputElement).value);
    diagram.dataBind();
}

document.getElementById('portConstraints').onchange = () => {
    if (port) {
        let option = (document.getElementById('portConstraints') as HTMLInputElement).value;
        switch (option) {
            case 'None':
                port.constraints = PortConstraints.None;
                break;
            case 'Drag':
                port.constraints = PortConstraints.Drag;
                break;
            case 'Draw':
                port.constraints = PortConstraints.Draw;
                break;
        }
    }
    diagram.dataBind();
}

document.getElementById('unSelect').onclick = () => {
    mouseevents.mouseLeaveEvent(diagramCanvas);
    diagram.clearSelection();
}

document.getElementById('MouseMove').onclick = () => {
    let index = Number((document.getElementById('Node') as HTMLInputElement).value);
    let node: NodeModel = diagram.nodes[index];
    mouseevents.mouseMoveEvent(diagramCanvas, node.offsetX, node.offsetY)
    mouseevents.mouseMoveEvent(diagramCanvas, node.offsetX+diagram.element.offsetLeft, node.offsetY+diagram.element.offsetTop);
}