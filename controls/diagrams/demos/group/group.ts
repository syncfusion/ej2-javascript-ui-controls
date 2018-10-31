/**
 * TEST SAMPLES-BPMN SHAPES
 */

import {
    Diagram, NodeModel, UndoRedo, DiagramContextMenu, ConnectorModel, Snapping, SnapSettingsModel, SnapConstraints,
    GridlinesModel, DiagramElement, ShapeAnnotationModel, PathAnnotationModel, Node, PointModel, transformPointByMatrix, rotateMatrix, identityMatrix, Matrix,
    Connector, PointPortModel, PortVisibility, NodeConstraints
} from '../../src/diagram/index';
import { MouseEvents } from '../../spec/diagram/interaction/mouseevents.spec';
Diagram.Inject(UndoRedo, DiagramContextMenu, Snapping);

let diagram: Diagram;
let nodes: NodeModel[] = [
    {
        id: 'node1', width: 50, height: 50, offsetX: 100,
        offsetY: 100,
    }, {
        id: 'node2', width: 50, height: 50, offsetX: 200,
        offsetY: 200
    },
    {
        id: 'node3', width: 100, height: 100, offsetX: 700,
        offsetY: 400
    },
    {
        id: 'node4', width: 100, height: 100, offsetX: 950,
        offsetY: 300
    },
    {
        id: 'node5', width: 50, height: 50, offsetX: 450,
        offsetY: 100
    },
    {
        id: 'node6', width: 50, height: 50, offsetX: 750,
        offsetY: 100
    },
    {
        id: 'node7', width: 50, height: 50, offsetX: 750,
        offsetY: 170
    },
    {
        id: 'node8', width: 50, height: 50, offsetX: 850,
        offsetY: 100
    },


    { id: 'group', children: ['node1', 'node2'], rotateAngle: 45 },
    { id: 'group2', children: ['node5', 'connector2'], },
    { id: 'group3', children: ['connector3', 'connector4'], },
    { id: 'group4', children: ['node6', 'node7'], },
    { id: 'group5', children: ['group4', 'node8', 'connector1'], },
];

let connectors: ConnectorModel[] = [
    {
        id: 'connector1', sourcePoint: { x: 850, y: 170 }, targetPoint: { x: 850, y: 200 }
    },
    {
        id: 'connector2', sourcePoint: { x: 300, y: 100 }, targetPoint: { x: 400, y: 200 }
    },
    {
        id: 'connector3', sourcePoint: { x: 550, y: 100 }, targetPoint: { x: 600, y: 200 }
    },
    {
        id: 'connector4', sourcePoint: { x: 600, y: 100 }, targetPoint: { x: 650, y: 200 }
    }
];

let snapSettings: SnapSettingsModel = {
    snapObjectDistance: 5,
    constraints: (SnapConstraints.SnapToObject | SnapConstraints.SnapToLines) | SnapConstraints.ShowLines
};


diagram = new Diagram(
    {
        width: '1050px', height: '500px', nodes: nodes,
        connectors: connectors,
        //snapSettings: { constraints: 0 }, 
        snapSettings: snapSettings,
        contextMenuSettings: { show: true },
        click: onClick,
    });

   
    function onClick(args: any) {
    }
    function onMouseEnter(args: any) {
    }

diagram.appendTo('#diagram');
let expanded = false;
document.getElementById('selectBox').onclick = showCheckboxes;
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

let mouseEvents = new MouseEvents();
let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
mouseEvents.clickEvent(diagramCanvas, 10, 10);

document.getElementById('selectNodes').onchange = selectionOption;
function selectionOption() {
    let e: HTMLSelectElement = (document.getElementById('selectNodes')) as HTMLSelectElement;
    let multipleSelect: HTMLInputElement = (document.getElementById('multiSelect')) as HTMLInputElement;
    let value: boolean = (multipleSelect.checked) ? true : false;
    if (Number(e.value) >= 13) {
        let index: number = Number(e.value) - 13;
        diagram.select([diagram.connectors[index]], value);
    }
    diagram.select([diagram.nodes[Number(e.value)]], value);
}

document.getElementById('fillColor').onchange = () => {
    let obj: ConnectorModel | NodeModel = (diagram.selectedItems.connectors[0]) ? diagram.selectedItems.connectors[0] : diagram.selectedItems.nodes[0];
    if ((document.getElementById('fillColorRadio') as HTMLInputElement).checked) {
        obj.style.fill = (document.getElementById('fillColor') as HTMLInputElement).value;
    } else {
        obj.style.strokeColor = (document.getElementById('fillColor') as HTMLInputElement).value;
    }
    diagram.dataBind();
}
document.getElementById('strokeWidth').onchange = () => {
    let obj: ConnectorModel | NodeModel = (diagram.selectedItems.connectors[0]) ? diagram.selectedItems.connectors[0] : diagram.selectedItems.nodes[0];
    obj.style.strokeWidth = Number((document.getElementById('strokeWidth') as HTMLInputElement).value);
    diagram.dataBind();
}
document.getElementById('strokeDashArray').onchange = () => {
    let obj: ConnectorModel | NodeModel = (diagram.selectedItems.connectors[0]) ? diagram.selectedItems.connectors[0] : diagram.selectedItems.nodes[0];
    obj.style.strokeDashArray = (document.getElementById('strokeDashArray') as HTMLInputElement).value;
    diagram.dataBind();
}
document.getElementById('opacity').onchange = () => {
    let obj: ConnectorModel | NodeModel = (diagram.selectedItems.connectors[0]) ? diagram.selectedItems.connectors[0] : diagram.selectedItems.nodes[0];
    obj.style.opacity = Number((document.getElementById('opacity') as HTMLInputElement).value);
    diagram.dataBind();
}
let undo = document.getElementById('undo');
undo.onclick = function () {
    diagram.undo();
};

let redo = document.getElementById('redo');
redo.onclick = function () {
    diagram.redo();
};
let addlabel = document.getElementById('addLabel');
addlabel.onclick = function () {
    if (diagram.selectedItems.nodes.length + diagram.selectedItems.connectors.length > 0) {
        let isNode: boolean = (diagram.selectedItems.nodes.length > 0) ? true : false;
        let node: NodeModel | ConnectorModel = (isNode) ? diagram.selectedItems.nodes[0] : (diagram.selectedItems.connectors[0]) ? diagram.selectedItems.connectors[0] : diagram.selectedItems.nodes[0];
        let label: ShapeAnnotationModel[] | PathAnnotationModel[] = (isNode) ?
            (
                [{ id: 'label1', content: 'Label1', offset: { x: 0.5, y: 0.5 } },]
            ) :
            (
                [{ id: 'label1', content: 'Text2', offset: 0 },
                { id: 'label2', content: 'Text3', offset: 1 },]
            );
        diagram.addLabels(node, label);
    }
}

let removelabel = document.getElementById('removeLabel');
removelabel.onclick = function () {
    if (diagram.selectedItems.nodes.length + diagram.selectedItems.connectors.length > 0) {
        let isNode: boolean = (diagram.selectedItems.nodes.length > 0) ? true : false;
        let node: Node | ConnectorModel = (isNode) ? (diagram.selectedItems.nodes[0] as Node) : (diagram.selectedItems.connectors[0]);
        let label: ShapeAnnotationModel[] | PathAnnotationModel[] = (isNode) ?
            (
                [{ id: 'label1' },]
            ) :
            (
                [{ id: 'label1' },
                { id: 'label2' },]
            );
        diagram.removeLabels(node, label);
    }
}

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

document.getElementById('interaction').onchange = interaction;
function interaction() {
    let e: HTMLSelectElement = (document.getElementById('interaction')) as HTMLSelectElement;
    if (e.value === 'drag') {
        drag();
    } else if (e.value === 'rotate') {
        rotate();
    } else {
        resize(e.value);
    }
}

function drag() {
    if (diagram.selectedItems.nodes.length) {
        let node = diagram.selectedItems.nodes[0];
        let centerX = node.offsetX;
        let centerY = node.offsetY;
        mouseEvents.mouseDownEvent(diagramCanvas, centerX + diagram.element.offsetLeft, centerY + diagram.element.offsetTop);
        mouseEvents.mouseMoveEvent(diagramCanvas, centerX + diagram.element.offsetLeft + 20, centerY + diagram.element.offsetTop);
        mouseEvents.mouseMoveEvent(diagramCanvas, centerX + diagram.element.offsetLeft + 20, centerY + diagram.element.offsetTop + 20);
        mouseEvents.mouseUpEvent(diagramCanvas, centerX + diagram.element.offsetLeft + 20, centerY + diagram.element.offsetTop + 20);
    }
}

function rotate() {
    if (diagram.selectedItems.nodes.length) {
        let element: DiagramElement = diagram.selectedItems.wrapper;
        let ten: number = 10 / diagram.scroller.currentZoom;
        let matrix: Matrix = identityMatrix();
        rotateMatrix(matrix, element.rotateAngle + element.parentTransform, element.offsetX, element.offsetY);
        //check for resizing tool
        let x: number = element.offsetX - element.pivot.x * element.actualSize.width;
        let y: number = element.offsetY - element.pivot.y * element.actualSize.height;
        let rotateThumb: PointModel = { x: x + element.actualSize.width / 2, y: y - 30 / diagram.scroller.currentZoom };
        rotateThumb = transformPointByMatrix(matrix, rotateThumb);
        mouseEvents.mouseDownEvent(diagramCanvas, rotateThumb.x + diagram.element.offsetLeft, rotateThumb.y + diagram.element.offsetTop);
        mouseEvents.mouseMoveEvent(diagramCanvas, rotateThumb.x + diagram.element.offsetLeft + 20, rotateThumb.y + diagram.element.offsetTop);
        mouseEvents.mouseMoveEvent(diagramCanvas, rotateThumb.x + diagram.element.offsetLeft + 20, rotateThumb.y + diagram.element.offsetTop + 20);
        mouseEvents.mouseUpEvent(diagramCanvas, rotateThumb.x + diagram.element.offsetLeft + 20, rotateThumb.y + diagram.element.offsetTop + 20);
    }
}

function resize(direction: string): void {
    let element: HTMLElement = document.getElementById(direction);
    let x: number = Number(element.getAttribute('cx'));
    let y: number = Number(element.getAttribute('cy'));
    mouseEvents.mouseDownEvent(diagramCanvas, x + diagram.element.offsetLeft, y + diagram.element.offsetTop);
    mouseEvents.mouseMoveEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop);
    mouseEvents.mouseMoveEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop + 20);
    mouseEvents.mouseUpEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop + 20);
}

function nodeConstraints(constraints: string, checked: boolean): void {
    if (constraints === 'None') {
        for (let i: number = 0; i < diagram.nodes.length; i++) {
            diagram.nodes[i].constraints = NodeConstraints.Default;
            diagram.dataBind();
        }
    }
    if (diagram.selectedItems.nodes.length === 1) {
        let node: NodeModel = diagram.selectedItems.nodes[0];
        if (node.constraints & NodeConstraints.None) {
            node.constraints &= ~NodeConstraints.None;
        }
        switch (constraints) {
            case 'None':
                if (checked) {
                    node.constraints = NodeConstraints.None;
                }
                break;
            case 'Select':
                if (checked) {
                    node.constraints |= NodeConstraints.Select;
                } else {
                    node.constraints &= ~NodeConstraints.Select;
                }
                break;
            case 'Rotate':
                if (checked) {
                    node.constraints |= NodeConstraints.Rotate;
                } else {
                    node.constraints &= ~NodeConstraints.Rotate;
                }
                break;
            case 'Delete':
                if (checked) {
                    node.constraints |= NodeConstraints.Delete;
                } else {
                    node.constraints &= ~NodeConstraints.Delete;
                }
                break;
            case 'Drag':
                if (checked) {
                    node.constraints |= NodeConstraints.Drag;
                } else {
                    node.constraints &= ~NodeConstraints.Drag;
                }
                break;
            case 'Shadow':
                if (checked) {
                    node.constraints |= NodeConstraints.Shadow;
                } else {
                    node.constraints &= ~NodeConstraints.Shadow;
                }
                break;
            case 'PointerEvents':
                if (checked) {
                    node.constraints |= NodeConstraints.PointerEvents;
                } else { node.constraints &= ~NodeConstraints.PointerEvents; }
                break;
            case 'InConnect':
                if (checked) {
                    node.constraints |= NodeConstraints.InConnect;
                } else { node.constraints &= ~NodeConstraints.InConnect; }
                break;
            case 'AllowDrop':
                if (checked) {
                    node.constraints |= NodeConstraints.AllowDrop;
                } else { node.constraints &= ~NodeConstraints.AllowDrop; }
                break;
            case 'OutConnect':
                if (checked) {
                    node.constraints |= NodeConstraints.OutConnect;
                } else {
                    node.constraints &= ~NodeConstraints.OutConnect;
                }
                break;
            case 'Expandable':
                if (checked) {
                    node.constraints |= NodeConstraints.Expandable;
                } else {
                    node.constraints &= ~NodeConstraints.Expandable;
                }
                break;
            case 'Inherit':
                if (checked) {
                    node.constraints |= NodeConstraints.Inherit;
                } else {
                    node.constraints &= ~NodeConstraints.Inherit;
                }
                break;
            case 'Tooltip':
                if (checked) {
                    node.constraints |= NodeConstraints.Tooltip;
                } else { node.constraints &= ~NodeConstraints.Tooltip; }
                break;
            case 'InheritTooltip':
                if (checked) {
                    node.constraints |= NodeConstraints.InheritTooltip;
                } else {
                    node.constraints &= ~NodeConstraints.InheritTooltip;
                }
                break;
            case 'ResizeNorthEast':
                if (checked) {
                    node.constraints |= NodeConstraints.ResizeNorthEast;
                } else {
                    node.constraints &= ~NodeConstraints.ResizeNorthEast;
                }
                break;
            case 'ResizeEast':
                if (checked) {
                    node.constraints |= NodeConstraints.ResizeEast;
                } else {
                    node.constraints &= ~NodeConstraints.ResizeEast;
                }
                break;
            case 'ResizeSouthEast':
                if (checked) {
                    node.constraints |= NodeConstraints.ResizeSouthEast;
                } else {
                    node.constraints &= ~NodeConstraints.ResizeSouthEast;
                }
                break;
            case 'ResizeSouth':
                if (checked) {
                    node.constraints |= NodeConstraints.ResizeSouth;
                } else {
                    node.constraints &= ~NodeConstraints.ResizeSouth;
                }
                break;
            case 'ResizeSouthWest':
                if (checked) {
                    node.constraints |= NodeConstraints.ResizeSouthWest;
                } else {
                    node.constraints &= ~NodeConstraints.ResizeSouthWest;
                }
                break;
            case 'ResizeWest':
                if (checked) {
                    node.constraints |= NodeConstraints.ResizeWest;
                } else {
                    node.constraints &= ~NodeConstraints.ResizeWest;
                }
                break;
            case 'ResizeNorthWest':
                if (checked) {
                    node.constraints |= NodeConstraints.ResizeNorthWest;
                } else {
                    node.constraints &= ~NodeConstraints.ResizeNorthWest;
                }
                break;
            case 'ResizeNorth':
                if (checked) {
                    node.constraints |= NodeConstraints.ResizeNorth;
                } else {
                    node.constraints &= ~NodeConstraints.ResizeNorth;
                }
                break;
            case 'Resize':
                if (checked) {
                    node.constraints |= NodeConstraints.Resize;
                } else {
                    node.constraints &= ~NodeConstraints.Resize;
                }
                break;
            case 'AspectRatio':
                if (checked) {
                    node.constraints |= NodeConstraints.AspectRatio;
                } else {
                    node.constraints &= ~NodeConstraints.AspectRatio;
                }
                break;
            case 'ReadOnly':
                if (checked) {
                    node.constraints |= NodeConstraints.ReadOnly;
                } else {
                    node.constraints &= ~NodeConstraints.ReadOnly;
                }
                break;
            case 'Default':
                if (checked) {
                    node.constraints |= NodeConstraints.Default;
                } else {
                    node.constraints &= ~NodeConstraints.Default;
                }
        }
        diagram.dataBind();
    }
}
function applyConstraints(value: string): void {
    nodeConstraints(value, (document.getElementById(value) as HTMLInputElement).checked);
}
document.getElementById('None').onchange = () => {
    applyConstraints('None');

};
document.getElementById('Select').onchange = () => {
    applyConstraints('Select');
};
document.getElementById('Drag').onchange = () => {
    applyConstraints('Drag');
};
document.getElementById('Delete').onchange = () => {
    applyConstraints('Delete');
};
document.getElementById('Rotate').onchange = () => {
    applyConstraints('Rotate');
};
document.getElementById('Shadow').onchange = () => {
    applyConstraints('Shadow');
};
document.getElementById('PointerEvents').onchange = () => {
    applyConstraints('PointerEvents');
};
document.getElementById('InConnect').onchange = () => {
    applyConstraints('InConnect');
};
document.getElementById('AllowDrop').onchange = () => {
    applyConstraints('AllowDrop');
};
document.getElementById('OutConnect').onchange = () => {
    applyConstraints('OutConnect');
};
document.getElementById('Expandable').onchange = () => {
    applyConstraints('Expandable');
};
document.getElementById('Inherit').onchange = () => {
    applyConstraints('Inherit');
};
document.getElementById('Tooltip').onchange = () => {
    applyConstraints('Tooltip');
};
document.getElementById('InheritTooltip').onchange = () => {
    applyConstraints('InheritTooltip');
};
document.getElementById('ResizeNorthEast').onchange = () => {
    applyConstraints('ResizeNorthEast');
};
document.getElementById('ResizeEast').onchange = () => {
    applyConstraints('ResizeEast');
};
document.getElementById('ResizeSouthEast').onchange = () => {
    applyConstraints('ResizeSouthEast');
};
document.getElementById('ResizeSouth').onchange = () => {
    applyConstraints('ResizeSouth');
};
document.getElementById('ResizeSouthWest').onchange = () => {
    applyConstraints('ResizeSouthWest');
};
document.getElementById('ResizeWest').onchange = () => {
    applyConstraints('ResizeWest');
};
document.getElementById('ResizeNorthWest').onchange = () => {
    applyConstraints('ResizeNorthWest');
};
document.getElementById('ResizeNorth').onchange = () => {
    applyConstraints('ResizeNorth');
};
document.getElementById('Resize').onchange = () => {
    applyConstraints('Resize');
};
document.getElementById('AspectRatio').onchange = () => {
    applyConstraints('AspectRatio');
};
document.getElementById('ReadOnly').onchange = () => {
    applyConstraints('ReadOnly');
};
document.getElementById('Default').onchange = () => {
    applyConstraints('Default');
};

let copy = document.getElementById('copy');
copy.onclick = function () {
    diagram.copy();

}

let paste = document.getElementById('paste');
paste.onclick = function () {
    diagram.paste();
}

let Nodedelete:HTMLElement = document.getElementById('NodeConstraints-Delete');
Nodedelete.onclick = function(){
    diagram.remove(diagram.selectedItems.nodes[0]);
}

let noneSelect: HTMLButtonElement = document.getElementById('NodeConstraints-Select') as HTMLButtonElement;
noneSelect.onclick = () => {
   let node: NodeModel = diagram.selectedItems.nodes[0];
   diagram.clearSelection();
   diagram.select([node]);
}
let inselectect: HTMLButtonElement = document.getElementById('NodeConstraints-InConnectselect') as HTMLButtonElement;
inselectect.onclick = () => {
    
}
let noneDrag: HTMLButtonElement = document.getElementById('NodeConstraints-NoneDrag') as HTMLButtonElement;
noneDrag.onclick = () => {
    let node: NodeModel = diagram.selectedItems.nodes[0];
    diagram.clearSelection();
    diagram.select([node]);
    drag();
}

let nodeDrag: HTMLButtonElement = document.getElementById('NodeConstraints-Drag') as HTMLButtonElement;
nodeDrag.onclick = () => {
    let node: NodeModel = diagram.selectedItems.nodes[0];
    diagram.clearSelection();
    diagram.select([node]);
    drag();
}
let rotate1: HTMLButtonElement = document.getElementById('NodeConstraints-Rotate') as HTMLButtonElement;
rotate1.onclick = () => {
    let node: NodeModel = diagram.selectedItems.nodes[0];
    diagram.clearSelection();
    diagram.select([node]);
    rotate();
};
let labelEdit: HTMLButtonElement = document.getElementById('NodeConstraints-ReadOnly') as HTMLButtonElement;
labelEdit.onclick = () => {
    let node: NodeModel = diagram.selectedItems.nodes[0];
    mouseEvents.dblclickEvent(diagramCanvas, node.offsetX, node.offsetY);    
};
let toolTip: HTMLButtonElement = document.getElementById('NodeConstraints-ToolTip') as HTMLButtonElement;
toolTip.onclick = () => {
    let node: NodeModel = diagram.selectedItems.nodes[0];
    let mouseevents: MouseEvents = new MouseEvents();
    let diagramCanvas: Element = document.getElementById('diagramcontent');
    mouseevents.mouseMoveEvent(diagramCanvas, node.offsetX, node.offsetY); 
    mouseevents.mouseMoveEvent(diagramCanvas, node.offsetX, node.offsetY); 
    mouseevents.mouseOverEvent(diagramCanvas);
    diagram.dataBind();
};
let connect: HTMLButtonElement = document.getElementById('NodeConstraints-Connect') as HTMLButtonElement;
connect.onclick = () => {

    let connector: ConnectorModel = { sourceID: diagram.nodes[8].id, targetID: diagram.nodes[10].id };
    diagram.add(connector);
    diagram.dataBind();
};
let allowDrop: HTMLButtonElement = document.getElementById('NodeConstraints-AllowDrop') as HTMLButtonElement;
allowDrop.onclick = () => {
    let mouseevents: MouseEvents = new MouseEvents();
    let diagramCanvas: Element = document.getElementById('diagramcontent');
    mouseevents.dragEvent(diagramCanvas, 100, 250, 185, 250);
    mouseevents.mouseMoveEvent(diagramCanvas, 185, 250);
    mouseevents.mouseUpEvent(diagramCanvas, 185, 250);
    diagram.dataBind();
}
let allowDragHighlight: HTMLButtonElement = document.getElementById('NodeConstraints-AllowDragHighlight') as HTMLButtonElement;
allowDragHighlight.onclick = () => {
    let mouseevents: MouseEvents = new MouseEvents();
    let diagramCanvas: Element = document.getElementById('diagramcontent');
    mouseevents.dragEvent(diagramCanvas, 100, 250, 185, 250);
    mouseevents.mouseMoveEvent(diagramCanvas, 185, 250);
    diagram.dataBind();
}
function SetNodeConstraints(constraints: NodeConstraints): void {
    let node: NodeModel = diagram.selectedItems.nodes[0];
    if (node != null) {
        node.constraints = constraints;
    }
}
let expandSelect: HTMLButtonElement = document.getElementById('NodeConstraints-ExpandSelect') as HTMLButtonElement;
expandSelect.onclick = () => {
    // resetDiagram();
    let mouseevents: MouseEvents = new MouseEvents();
    let diagramCanvas: Element = document.getElementById('diagramcontent');
    mouseevents.clickEvent(diagramCanvas, 170, 140);
    diagram.dataBind();
}
let connectwithExpandable: HTMLButtonElement = document.getElementById('NodeConstraints-ConnectwithExpandable') as HTMLButtonElement;
connectwithExpandable.onclick = () => {
    diagram.clearSelection();
    diagram.nodes[1].expandIcon.shape = 'Minus';
    diagram.nodes[1].collapseIcon.shape = 'Plus';
    diagram.dataBind();
    let connector: ConnectorModel = { sourceID: diagram.nodes[1].id, targetID: diagram.nodes[3].id };
    let connector1: ConnectorModel = { sourceID: diagram.nodes[1].id, targetID: diagram.nodes[5].id };
    diagram.add(connector);
    diagram.add(connector1);
    let mouseevents: MouseEvents = new MouseEvents();
    let diagramCanvas: Element = document.getElementById('diagramcontent');
    mouseevents.clickEvent(diagramCanvas, 170, 145);
    diagram.dataBind();
};
let aspectRatio: HTMLButtonElement = document.getElementById('NodeConstraints-AspectRatio') as HTMLButtonElement;
aspectRatio.onclick = () => {
    let mouseevents: MouseEvents = new MouseEvents();
    let diagramCanvas: Element = document.getElementById('diagramcontent');
    let topLeft1: PointModel = (diagram.nodes[3] as NodeModel).wrapper.bounds.topCenter;
    mouseevents.clickEvent(diagramCanvas, 100, 250);
    mouseevents.dragEvent(diagramCanvas, topLeft1.x, topLeft1.y, topLeft1.x - 20, topLeft1.y - 20);
    mouseevents.mouseMoveEvent(diagramCanvas, topLeft1.x - 20, topLeft1.y - 20);
    diagram.dataBind();
};
