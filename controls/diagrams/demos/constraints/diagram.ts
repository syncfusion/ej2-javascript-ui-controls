import { Diagram } from '../../src/diagram/diagram';
import { SnapConstraints, NodeConstraints, DiagramConstraints, DiagramTools, ConnectorConstraints } from '../../src/diagram/enum/enum';
import { NodeModel } from '../../src/diagram/objects/node-model';
import { SnapSettingsModel, GridlinesModel } from '../../src/diagram/diagram/grid-lines-model';
import { Snapping } from '../../src/diagram/objects/snapping';
import { MouseEvents } from '../../spec/diagram/interaction/mouseevents.spec';
import { Matrix, transformPointByMatrix, identityMatrix, rotateMatrix } from '../../src/diagram/primitives/matrix';
import { PointModel, UndoRedo, Rect, ConnectorModel, IDragOverEventArgs, IDragEnterEventArgs, IDragLeaveEventArgs, IDropEventArgs, ConnectorBridging, ZoomOptions } from '../../src/diagram/index';
Diagram.Inject(Snapping, UndoRedo, ConnectorBridging);


/**
 * pageSettings
 */
let diagram: Diagram;
let node: NodeModel = {
    id: 'node1', width: 60, height: 60, offsetX: 100, offsetY: 100,
};
let node2: NodeModel = {
    id: 'node2', width: 60, height: 90, offsetX: 270, offsetY: 100,
};
let node3: NodeModel = {
    id: 'node3', width: 60, height: 120, offsetX: 540, offsetY: 100,
};
let node4: NodeModel = {
    id: 'node4', width: 60, height: 90, offsetX: 100, offsetY: 250,
    tooltip: {
        content: 'Node',
        position: 'TopCenter', showTipPointer: true,
    },
    constraints: NodeConstraints.Default | NodeConstraints.InheritTooltip
};
let node5: NodeModel = {
    id: 'node5', width: 90, height: 90, offsetX: 285, offsetY: 280,
};
let node6: NodeModel = {
    id: 'node6', width: 120, height: 90, offsetX: 500, offsetY: 250,
};
let node7: NodeModel = {
    id: 'node7', width: 60, height: 90, offsetX: 300, offsetY: 400,
    constraints: NodeConstraints.AspectRatio | NodeConstraints.Default
};
let node8: NodeModel = {
    id: 'node8', width: 60, height: 90, offsetX: 500, offsetY: 500,
};
let node9: NodeModel = {
    id: 'node9', width: 60, height: 90, offsetX: 670, offsetY: 400,
};
let horizontalGridlines: GridlinesModel = { lineColor: 'black', lineDashArray: '1,1' };
let verticalGridlines: GridlinesModel = { lineColor: 'black', lineDashArray: '1,1' };
let snapSettings: SnapSettingsModel = {
    snapObjectDistance: 5,
    constraints: (SnapConstraints.SnapToObject | SnapConstraints.ShowLines | SnapConstraints.SnapToLines) | SnapConstraints.ShowLines,
    horizontalGridlines, verticalGridlines
};
diagram = new Diagram({
    width: '1000px', height: '580px', nodes: [node, node2,
        node3, node4, node5, node6, node7, node8, node9
    ], connectors: [],
});
diagram.appendTo('#diagram');
let mouseevents: MouseEvents = new MouseEvents();
    let diagramCanvas: Element = document.getElementById('diagramcontent');
    mouseevents.clickEvent(diagramCanvas, 10, 10);
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

// document.getElementById('selectBox').onclick = showCheckboxes;

// let expanded = false;
// function showCheckboxes() {
//     let checkboxes: HTMLElement = document.getElementById('checkboxes');
//     if (!expanded) {
//         checkboxes.style.display = 'block';
//         expanded = true;
//     } else {
//         checkboxes.style.display = 'none';
//         expanded = false;
//     }
// }
let zoomPan: HTMLButtonElement = document.getElementById('ZoomPan') as HTMLButtonElement;
zoomPan.onclick = () => {
    diagram.tool = DiagramTools.ZoomPan;
};

let bridge: HTMLButtonElement = document.getElementById('Bridging1') as HTMLButtonElement;
bridge.onclick = () => {

    let connector: ConnectorModel = { sourceID: diagram.nodes[5].id, targetID: diagram.nodes[7].id, type: 'Orthogonal' };
    connector.constraints |= ConnectorConstraints.InheritBridging;
    let connector1: ConnectorModel =
        {
            sourceID: diagram.nodes[6].id, targetID: diagram.nodes[8].id, type: 'Orthogonal',
            constraints: ConnectorConstraints.InheritBridging
        };
    connector1.constraints |= ConnectorConstraints.InheritBridging;
    diagram.add(connector);
    diagram.add(connector1);
    let mouseevents: MouseEvents = new MouseEvents();
    let diagramCanvas: Element = document.getElementById('diagramcontent');
    mouseevents.clickEvent(diagramCanvas, 500, 500);
    mouseevents.dragEvent(diagramCanvas, 500, 500, 510, 510);
    mouseevents.mouseMoveEvent(diagramCanvas, 510, 510);
    mouseevents.mouseUpEvent(diagramCanvas, 510, 510);
    diagram.dataBind();

};
let undo: HTMLButtonElement = document.getElementById('Undo') as HTMLButtonElement;
undo.onclick = () => {
    for (let i: number = diagram.historyList.undo.length; i >= 0; i--) {
        diagram.undo();
    }
};
let redo: HTMLButtonElement = document.getElementById('Redo') as HTMLButtonElement;
redo.onclick = () => {
    for (let i: number = diagram.historyList.redo.length; i >= 0; i--) {
        diagram.redo();
    }
};
let zoompanDiagram: HTMLButtonElement = document.getElementById('ZoomPanDiagram') as HTMLButtonElement;
zoompanDiagram.onclick = () => {
    let mouseevents: MouseEvents = new MouseEvents();
    let diagramCanvas: Element = document.getElementById('diagramcontent');
    mouseevents.clickEvent(diagramCanvas, 540, 100);
    mouseevents.mouseMoveEvent(diagramCanvas, 540, 400);
    mouseevents.dragAndDropEvent(diagramCanvas, 540, 100, 400, 400);
}
let zoomin: HTMLButtonElement = document.getElementById('ZoomInDiagram') as HTMLButtonElement;
zoomin.onclick = () => {
    let mouseevents: MouseEvents = new MouseEvents();
    let diagramCanvas: Element = document.getElementById('diagramcontent');
    let zoomin: ZoomOptions = { type: 'ZoomIn', zoomFactor: 0.5 };
    diagram.zoomTo(zoomin);
}
let zoomout: HTMLButtonElement = document.getElementById('ZoomOutDiagram') as HTMLButtonElement;
zoomout.onclick = () => {
    let mouseevents: MouseEvents = new MouseEvents();
    let diagramCanvas: Element = document.getElementById('diagramcontent');
    mouseevents.mouseWheelEvent(diagramCanvas, 400, 100, true);
}
let resizeWidth: HTMLButtonElement = document.getElementById('SnapResizeWidth-node') as HTMLButtonElement;
resizeWidth.onclick = () => {
    let mouseevents: MouseEvents = new MouseEvents();
    let diagramCanvas: Element = document.getElementById('diagramcontent');
    let topLeft1: PointModel = (diagram.nodes[3] as NodeModel).wrapper.bounds.topLeft;
    mouseevents.clickEvent(diagramCanvas, diagram.nodes[3].offsetX, diagram.nodes[3].offsetY);
    mouseevents.dragEvent(diagramCanvas, topLeft1.x, topLeft1.y, topLeft1.x - 10, topLeft1.y - 10);
    mouseevents.mouseMoveEvent(diagramCanvas, topLeft1.x - 10, topLeft1.y - 10);
    diagram.dataBind();
};
let noneSelect: HTMLButtonElement = document.getElementById('NodeConstraints-Select') as HTMLButtonElement;
noneSelect.onclick = () => {
    diagram.clearSelection();
    resetDiagram();
    let mouseevents: MouseEvents = new MouseEvents();
    let diagramCanvas: Element = document.getElementById('diagramcontent');
    mouseevents.clickEvent(diagramCanvas, (diagram.nodes[3] as NodeModel).offsetX, (diagram.nodes[3] as NodeModel).offsetY);
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
    mouseevents.mouseUpEvent(diagramCanvas, 280, 350);
    mouseevents.mouseLeaveEvent(diagramCanvas);
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
    mouseevents.dragAndDropEvent(
        diagramCanvas, rotator.x + diagram.element.offsetLeft,
        rotator.y + diagram.element.offsetTop, endPoint.x + diagram.element.offsetLeft,
        endPoint.y + diagram.element.offsetTop);
    mouseevents.mouseUpEvent(diagramCanvas, endPoint.x + diagram.element.offsetLeft, endPoint.y + diagram.element.offsetTop);
    diagram.nodes[3].rotateAngle = Math.round(diagram.nodes[3].rotateAngle);
    mouseevents.mouseUpEvent(diagramCanvas, endPoint.x + diagram.element.offsetLeft,
        // tslint:disable-next-line:align
        endPoint.y + diagram.element.offsetTop);
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

function applyConstraints(value: string): void {
    nodeConstraints(value, (document.getElementById(value) as HTMLInputElement).checked);
}
document.getElementById('None').onchange = () => {
    applyConstraints('None');

};
document.getElementById('Bridging').onchange = () => {
    applyConstraints('Bridging');
};
document.getElementById('UndoRedo').onchange = () => {
    applyConstraints('UndoRedo');
};
document.getElementById('Tooltip').onchange = () => {
    applyConstraints('Tooltip');
};
document.getElementById('UserInteraction').onchange = () => {
    applyConstraints('UserInteraction');
};
document.getElementById('PageEditable').onchange = () => {
    applyConstraints('PageEditable');
};
document.getElementById('Zoom').onchange = () => {
    applyConstraints('Zoom');
};
document.getElementById('PanX').onchange = () => {
    applyConstraints('PanX');
};
document.getElementById('PanY').onchange = () => {
    applyConstraints('PanY');
};
document.getElementById('Pan').onchange = () => {
    applyConstraints('Pan');
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
        diagram.constraints = DiagramConstraints.Default;
    }
    if (diagram.constraints & DiagramConstraints.None) {
        diagram.constraints &= ~DiagramConstraints.None;
    }
    switch (constraints) {
        case 'None':
            if (checked) {
                diagram.constraints = DiagramConstraints.None;
            }
            break;
        case 'Bridging':
            if (checked) {
                diagram.constraints |= DiagramConstraints.Bridging;
            } else {
                diagram.constraints &= ~DiagramConstraints.Bridging;
            }
            break;
        case 'UndoRedo':
            if (checked) {
                diagram.constraints |= DiagramConstraints.UndoRedo;
            } else {
                diagram.constraints &= ~DiagramConstraints.UndoRedo;
            }
            break;
        case 'Tooltip':
            if (checked) {
                diagram.constraints |= DiagramConstraints.Tooltip;
            } else {
                diagram.constraints &= ~DiagramConstraints.Tooltip;
            }
            break;
        case 'UserInteraction':
            if (checked) {
                diagram.constraints |= DiagramConstraints.UserInteraction;
            } else {
                diagram.constraints &= ~DiagramConstraints.UserInteraction;
            }
            break;
        case 'PageEditable':
            if (checked) {
                diagram.constraints |= DiagramConstraints.PageEditable;
            } else {
                diagram.constraints &= ~DiagramConstraints.PageEditable;
            }
            break;
        case 'Zoom':
            if (checked) {
                diagram.constraints |= DiagramConstraints.Zoom;
            } else {
                diagram.constraints &= ~DiagramConstraints.Zoom;
            }
            break;
        case 'PanX':
            if (checked) {
                diagram.constraints |= DiagramConstraints.PanX;
            } else {
                diagram.constraints &= ~DiagramConstraints.PanX;
            }
            break;
        case 'PanY':
            if (checked) {
                diagram.constraints |= DiagramConstraints.PanY;
            } else {
                diagram.constraints &= ~DiagramConstraints.PanY;
            }
            break;
        case 'Pan':
            if (checked) {
                diagram.constraints |= DiagramConstraints.Pan;
            } else {
                diagram.constraints &= ~DiagramConstraints.Pan;
            }
            break;
        case 'Default':
            if (checked) {
                diagram.constraints |= DiagramConstraints.Default;
            } else {
                diagram.constraints &= ~DiagramConstraints.Default;
            }
            break;
    }
    diagram.dataBind();
}

