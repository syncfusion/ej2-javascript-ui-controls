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
let connector: ConnectorModel = { sourcePoint: { x: 300, y: 100 }, targetPoint: { x: 400, y: 200 }, type: 'Orthogonal' };
diagram = new Diagram({
    width: '1000px', height: '1000px', nodes: [node, node2,
        node3, node4, node5, node6, node7, node8, node9
    ], connectors: [],
    snapSettings: snapSettings
});
diagram.appendTo('#diagram');
let mouseevents = new MouseEvents();
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
document.getElementById('selectBox1').onclick = showCheckboxes1;
let expanded1 = false;
function showCheckboxes1() {
    let checkboxes: HTMLElement = document.getElementById('checkboxes1');
    if (!expanded1) {
        checkboxes.style.display = 'block';
        expanded1 = true;
    } else {
        checkboxes.style.display = 'none';
        expanded1 = false;
    }
}
let addConnector: HTMLButtonElement = document.getElementById('AddConnector') as HTMLButtonElement;
addConnector.onclick = () => {
    diagram.add(connector);
};
let setpageSettings: HTMLButtonElement = document.getElementById('SetPageSetting') as HTMLButtonElement;
setpageSettings.onclick = () => {
    diagram.pageSettings.width = 500;
    diagram.pageSettings.height = 300;
};
let setDiagramSize: HTMLButtonElement = document.getElementById('SetDiagramSize') as HTMLButtonElement;
setDiagramSize.onclick = () => {
    diagram.width = 500;
    diagram.height = 300;
};

let dragConnector: HTMLButtonElement = document.getElementById('DragConnector') as HTMLButtonElement;
dragConnector.onclick = () => {

    let mouseevents: MouseEvents = new MouseEvents();
    let diagramCanvas: Element = document.getElementById('diagramcontent');
    mouseevents.clickEvent(diagramCanvas, 350, 120);
    mouseevents.dragEvent(diagramCanvas, 350, 120, 600, 200);
    mouseevents.mouseMoveEvent(diagramCanvas, 600, 200);
    mouseevents.mouseUpEvent(diagramCanvas, 600, 200);
    diagram.dataBind();
};
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
    diagram.clearSelection();
    resetDiagram();
    let mouseevents: MouseEvents = new MouseEvents();
    let diagramCanvas: Element = document.getElementById('diagramcontent');
    mouseevents.clickEvent(diagramCanvas, (diagram.nodes[3] as NodeModel).offsetX, (diagram.nodes[3] as NodeModel).offsetY);
    diagram.dataBind();
}

let noneDrag: HTMLButtonElement = document.getElementById('NodeConstraints-NoneDrag') as HTMLButtonElement;
noneDrag.onclick = () => {
    let mouseevents: MouseEvents = new MouseEvents();
    let diagramCanvas: Element = document.getElementById('diagramcontent');
    mouseevents.clickEvent(diagramCanvas, 240, 100);
    SetNodeConstraints(NodeConstraints.None);
    mouseevents.dragEvent(diagramCanvas, 240, 100, 280, 300);
    mouseevents.mouseMoveEvent(diagramCanvas, 500, 450);
    mouseevents.mouseUpEvent(diagramCanvas, 500, 450);
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
    let mouseevents: MouseEvents = new MouseEvents();
    let diagramCanvas: Element = document.getElementById('diagramcontent');
    mouseevents.dragEvent(diagramCanvas, 100, 250, 280, 350);
    mouseevents.mouseMoveEvent(diagramCanvas, 280, 350);
    mouseevents.mouseUpEvent(diagramCanvas, 280, 350);
    diagram.dataBind();
}

function SetNodeConstraints(constraints: NodeConstraints): void {
    let node: NodeModel = diagram.selectedItems.nodes[0];
    if (node != null) {
        node.constraints = constraints;
    }
}

document.getElementById('Diagram').onchange = () => {
    diagram.pageSettings.boundaryConstraints = 'Diagram';

};
document.getElementById('Infinity').onchange = () => {
    diagram.pageSettings.boundaryConstraints = 'Infinity';

};
document.getElementById('Page').onchange = () => {
    diagram.pageSettings.boundaryConstraints = 'Page';

};
function applyConstraints(value: string): void {
    nodeConstraints(value, (document.getElementById(value) as HTMLInputElement).checked);
}

document.getElementById('None').onchange = () => {
    applyConstraints('None');

};
document.getElementById('ShowHorizontalLines').onchange = () => {
    applyConstraints('ShowHorizontalLines');
};
document.getElementById('ShowVerticalLines').onchange = () => {
    applyConstraints('ShowVerticalLines');
};
document.getElementById('ShowLines').onchange = () => {
    applyConstraints('ShowLines');
};
document.getElementById('SnapToHorizontalLines').onchange = () => {
    applyConstraints('SnapToHorizontalLines');
};
document.getElementById('SnapToVerticalLines').onchange = () => {
    applyConstraints('SnapToVerticalLines');
};
document.getElementById('SnapToLines').onchange = () => {
    applyConstraints('SnapToLines');
};
document.getElementById('SnapToObject').onchange = () => {
    applyConstraints('SnapToObject');
};
document.getElementById('All').onchange = () => {
    applyConstraints('All');
};

function resetDiagram(): void {
    for (let i: number = diagram.historyList.undoStack.length; i >= 0; i--) {
        diagram.undo();
    }
}
// tslint:disable-next-line:max-func-body-length
function nodeConstraints(constraints: string, checked: boolean): void {
    if (constraints === 'None') {
        diagram.snapSettings.constraints = SnapConstraints.All;
    }
    switch (constraints) {
        case 'None':
            if (checked) {
                diagram.snapSettings.constraints = SnapConstraints.None;
            }
            break;
        case 'ShowHorizontalLines':
            if (checked) {
                diagram.snapSettings.constraints |= SnapConstraints.ShowHorizontalLines;
            } else {
                diagram.snapSettings.constraints &= ~SnapConstraints.ShowHorizontalLines;
            }
            break;
        case 'ShowVerticalLines':
            if (checked) {
                diagram.snapSettings.constraints |= SnapConstraints.ShowVerticalLines;
            } else {
                diagram.snapSettings.constraints &= ~SnapConstraints.ShowVerticalLines;
            }
            break;
        case 'ShowLines':
            if (checked) {
                diagram.snapSettings.constraints |= SnapConstraints.ShowLines;
            } else {
                diagram.snapSettings.constraints &= ~SnapConstraints.ShowLines;
            }
            break;
        case 'SnapToHorizontalLines':
            if (checked) {
                diagram.snapSettings.constraints |= SnapConstraints.SnapToHorizontalLines;
            } else {
                diagram.snapSettings.constraints &= ~SnapConstraints.SnapToHorizontalLines;
            }
            break;
        case 'SnapToVerticalLines':
            if (checked) {
                diagram.snapSettings.constraints |= SnapConstraints.SnapToVerticalLines;
            } else {
                diagram.snapSettings.constraints &= ~SnapConstraints.SnapToVerticalLines;
            }
            break;
        case 'SnapToLines':
            if (checked) {
                diagram.snapSettings.constraints |= SnapConstraints.SnapToLines;
            } else { diagram.snapSettings.constraints &= ~SnapConstraints.SnapToLines; }
            break;
        case 'SnapToObject':
            if (checked) {
                diagram.snapSettings.constraints |= SnapConstraints.SnapToObject;
            } else { diagram.snapSettings.constraints &= ~SnapConstraints.SnapToObject; }
            break;
        case 'All':
            if (checked) {
                diagram.snapSettings.constraints |= SnapConstraints.All;
            } else { diagram.snapSettings.constraints &= ~SnapConstraints.All; }
            break;
    }
    diagram.dataBind();
}

