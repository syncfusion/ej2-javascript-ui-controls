import { Diagram } from '../../src/diagram/diagram';
import { SnapConstraints, NodeConstraints, DiagramConstraints, DiagramTools } from '../../src/diagram/enum/enum';
import { NodeModel } from '../../src/diagram/objects/node-model';
import { SnapSettingsModel, GridlinesModel } from '../../src/diagram/diagram/grid-lines-model';
import { Snapping } from '../../src/diagram/objects/snapping';
import { MouseEvents } from '../../spec/diagram/interaction/mouseevents.spec';
import { Matrix, transformPointByMatrix, identityMatrix, rotateMatrix } from '../../src/diagram/primitives/matrix';
import { PointModel, UndoRedo, Rect, ConnectorModel, IDragOverEventArgs, IDragEnterEventArgs, IDragLeaveEventArgs, IDropEventArgs } from '../../src/diagram/index';
Diagram.Inject(Snapping, UndoRedo);


/**
 * pageSettings
 */
let diagram: Diagram;
let node: NodeModel = {
    id: 'node1', width: 60, height: 60, offsetX: 100, offsetY: 100,
};
let node2: NodeModel = {
    id: 'node2', width: 60, height: 90, offsetX: 170, offsetY: 100,
};
let node3: NodeModel = {
    id: 'node3', width: 60, height: 120, offsetX: 240, offsetY: 100,
};
let node4: NodeModel = {
    id: 'node4', width: 60, height: 90, offsetX: 100, offsetY: 250,
    tooltip: {
        content: 'Node',
        position: 'TopCenter', showTipPointer: true,
    }
};
let node5: NodeModel = {
    id: 'node5', width: 90, height: 90, offsetX: 185, offsetY: 250,
};
let node6: NodeModel = {
    id: 'node6', width: 120, height: 90, offsetX: 300, offsetY: 250,
};
let node7: NodeModel = {
    id: 'node7', width: 60, height: 90, offsetX: 100, offsetY: 380,
    constraints: NodeConstraints.AspectRatio | NodeConstraints.Default
};
let node8: NodeModel = {
    id: 'node8', width: 60, height: 90, offsetX: 170, offsetY: 380,
};
let node9: NodeModel = {
    id: 'node9', width: 60, height: 90, offsetX: 240, offsetY: 380,
};
let horizontalGridlines: GridlinesModel = { lineColor: 'black', lineDashArray: '1,1' };
let verticalGridlines: GridlinesModel = { lineColor: 'black', lineDashArray: '1,1' };
let snapSettings: SnapSettingsModel = {
    snapObjectDistance: 5,
    constraints: (SnapConstraints.SnapToObject | SnapConstraints.ShowLines | SnapConstraints.SnapToLines) | SnapConstraints.ShowLines,
    horizontalGridlines, verticalGridlines
};
diagram = new Diagram({
    width: '800px', height: '550px', nodes: [node, node2,
        node3, node4, node5, node6, node7, node8, node9
    ], connectors: [],
    snapSettings: snapSettings
});
diagram.appendTo('#diagram');
diagram.dragEnter = (args: IDragEnterEventArgs) => {

};
diagram.dragOver = (args: IDragOverEventArgs) => {

};
diagram.dragLeave = (args: IDragLeaveEventArgs) => {

};
diagram.drop = (args: IDropEventArgs) => {
    let tnode: NodeModel = args.target as NodeModel;
    if (tnode) {
        (tnode as NodeModel).style.fill = 'yellow';
        diagram.dataBind();
    }
};

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
let dragButton: HTMLButtonElement = document.getElementById('SnapDrag-node') as HTMLButtonElement;
dragButton.onclick = () => {
    let mouseevents: MouseEvents = new MouseEvents();
    let diagramCanvas: Element = document.getElementById('diagramcontent');
    mouseevents.clickEvent(diagramCanvas, 240, 100);
    mouseevents.dragEvent(diagramCanvas, 240, 100, 241, 100);
    mouseevents.mouseMoveEvent(diagramCanvas, 241, 100);
    diagram.dataBind();
};
let resize: HTMLButtonElement = document.getElementById('SnapResizeHeight-node') as HTMLButtonElement;
resize.onclick = () => {
    let mouseevents: MouseEvents = new MouseEvents();
    let diagramCanvas: Element = document.getElementById('diagramcontent');
    let topLeft1: PointModel = (diagram.nodes[4] as NodeModel).wrapper.bounds.topLeft;
    mouseevents.clickEvent(diagramCanvas, 185, 250);
    mouseevents.dragEvent(diagramCanvas, topLeft1.x, topLeft1.y, topLeft1.x - 1, topLeft1.y - 1);
    mouseevents.mouseMoveEvent(diagramCanvas, topLeft1.x - 1, topLeft1.y - 1);
    diagram.dataBind();
};
let resizeWidth: HTMLButtonElement = document.getElementById('SnapResizeWidth-node') as HTMLButtonElement;
resizeWidth.onclick = () => {
    let mouseevents: MouseEvents = new MouseEvents();
    let diagramCanvas: Element = document.getElementById('diagramcontent');
    let topLeft1: PointModel = (diagram.nodes[3] as NodeModel).wrapper.bounds.topLeft;
    mouseevents.clickEvent(diagramCanvas, 100, 250);
    mouseevents.dragEvent(diagramCanvas, topLeft1.x, topLeft1.y, topLeft1.x - 1, topLeft1.y - 1);
    mouseevents.mouseMoveEvent(diagramCanvas, topLeft1.x - 1, topLeft1.y - 1);
    diagram.dataBind();
};
let noneSelect: HTMLButtonElement = document.getElementById('NodeConstraints-Select') as HTMLButtonElement;
noneSelect.onclick = () => {
    resetDiagram();
    let mouseevents: MouseEvents = new MouseEvents();
    let diagramCanvas: Element = document.getElementById('diagramcontent');
    mouseevents.clickEvent(diagramCanvas, (diagram.nodes[3] as NodeModel).offsetX, (diagram.nodes[3] as NodeModel).offsetY);
    diagram.dataBind();
}
let inselectect: HTMLButtonElement = document.getElementById('NodeConstraints-InConnectselect') as HTMLButtonElement;
inselectect.onclick = () => {
    resetDiagram();
    let mouseevents: MouseEvents = new MouseEvents();
    let diagramCanvas: Element = document.getElementById('diagramcontent');
    mouseevents.clickEvent(diagramCanvas, 185, 250);
    diagram.dataBind();
}
let noneDrag: HTMLButtonElement = document.getElementById('NodeConstraints-NoneDrag') as HTMLButtonElement;
noneDrag.onclick = () => {
    let mouseevents: MouseEvents = new MouseEvents();
    let diagramCanvas: Element = document.getElementById('diagramcontent');
    mouseevents.clickEvent(diagramCanvas, 240, 100);
    SetNodeConstraints(NodeConstraints.None);
    mouseevents.dragEvent(diagramCanvas, 240, 100, 280, 300);
    mouseevents.mouseMoveEvent(diagramCanvas, 280, 300);
    mouseevents.mouseUpEvent(diagramCanvas, 280, 300);
    diagram.dataBind();
}
let delete1: HTMLButtonElement = document.getElementById('NodeConstraints-Delete') as HTMLButtonElement;
delete1.onclick = () => {
    let node: NodeModel = diagram.selectedItems.nodes[0];
    if (node != null) {
        diagram.remove(node);
    }
    diagram.dataBind();
}
let nodeDrag: HTMLButtonElement = document.getElementById('NodeConstraints-Drag') as HTMLButtonElement;
nodeDrag.onclick = () => {
    resetDiagram();
    let mouseevents: MouseEvents = new MouseEvents();
    let diagramCanvas: Element = document.getElementById('diagramcontent');
    mouseevents.dragEvent(diagramCanvas, 100, 250, 280, 350);
    mouseevents.mouseMoveEvent(diagramCanvas, 280, 350);
    mouseevents.mouseUpEvent(diagramCanvas, 280, 350);
    diagram.dataBind();
}
let rotate: HTMLButtonElement = document.getElementById('NodeConstraints-Rotate') as HTMLButtonElement;
rotate.onclick = () => {
    let mouseevents: MouseEvents = new MouseEvents();
    let diagramCanvas: Element = document.getElementById('diagramcontent');
    let bounds: Rect = (diagram.nodes[3] as NodeModel).wrapper.bounds;
    let rotator: PointModel = { x: bounds.center.x, y: bounds.y - 30 };
    let matrix: Matrix = identityMatrix();
    rotateMatrix(matrix, 50, bounds.center.x, bounds.center.y);
    let endPoint: PointModel = transformPointByMatrix(matrix, rotator);
    mouseevents.mouseDownEvent(diagramCanvas, rotator.x + diagram.element.offsetLeft, rotator.y + diagram.element.offsetTop, );
    mouseevents.dragEvent(
        diagramCanvas, rotator.x + diagram.element.offsetLeft,
        rotator.y + diagram.element.offsetTop, endPoint.x + diagram.element.offsetLeft,
        endPoint.y + diagram.element.offsetTop);
    mouseevents.mouseUpEvent(diagramCanvas, endPoint.x + diagram.element.offsetLeft, endPoint.y + diagram.element.offsetTop);
    diagram.nodes[3].rotateAngle = Math.round(diagram.nodes[3].rotateAngle);
    diagram.dataBind();
};
let labelEdit: HTMLButtonElement = document.getElementById('NodeConstraints-ReadOnly') as HTMLButtonElement;
labelEdit.onclick = () => {
    let mouseevents: MouseEvents = new MouseEvents();
    let diagramCanvas: Element = document.getElementById('diagramcontent');
    mouseevents.dblclickEvent(diagramCanvas, 100, 250);
    diagram.dataBind();
};
let toolTip: HTMLButtonElement = document.getElementById('NodeConstraints-ToolTip') as HTMLButtonElement;
toolTip.onclick = () => {
    let mouseevents: MouseEvents = new MouseEvents();
    let diagramCanvas: Element = document.getElementById('diagramcontent');
    mouseevents.mouseMoveEvent(diagramCanvas, 100, 250);
    mouseevents.mouseMoveEvent(diagramCanvas, 105, 250);
    mouseevents.mouseOverEvent(diagramCanvas);
    diagram.dataBind();
};
let connect: HTMLButtonElement = document.getElementById('NodeConstraints-Connect') as HTMLButtonElement;
connect.onclick = () => {

    let connector: ConnectorModel = { sourceID: diagram.nodes[3].id, targetID: diagram.nodes[4].id };
    diagram.add(connector);
    diagram.dataBind();
};
let allowDrag: HTMLButtonElement = document.getElementById('NodeConstraints-AllowDrag') as HTMLButtonElement;
allowDrag.onclick = () => {
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
    resetDiagram();
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
function resetDiagram(): void {
    for (let i: number = diagram.historyList.undoStack.length; i >= 0; i--) {
        diagram.undo();
    }
}
// tslint:disable-next-line:max-func-body-length
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

