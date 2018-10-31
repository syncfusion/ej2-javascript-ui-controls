import { Diagram } from '../../src/diagram/diagram';
import { SnapConstraints, NodeConstraints, DiagramConstraints, DiagramTools, ConnectorConstraints, SelectorConstraints } from '../../src/diagram/enum/enum';
import { NodeModel } from '../../src/diagram/objects/node-model';
import { SnapSettingsModel, GridlinesModel } from '../../src/diagram/diagram/grid-lines-model';
import { Snapping } from '../../src/diagram/objects/snapping';
import { MouseEvents } from '../../spec/diagram/interaction/mouseevents.spec';
import { Matrix, transformPointByMatrix, identityMatrix, rotateMatrix } from '../../src/diagram/primitives/matrix';
import { PointModel, UndoRedo, Rect, ConnectorModel, IDragOverEventArgs, IDragEnterEventArgs, IDragLeaveEventArgs, IDropEventArgs, ConnectorBridging, ZoomOptions, Point, UserHandleModel } from '../../src/diagram/index';
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
//Defines the user handle collection for nodes in diagram
let handles: UserHandleModel[] = [{
    name: 'clone', pathData: 'M60.3,18H27.5c-3,0-5.5,2.4-5.5,5.5v38.2h5.5V23.5h32.7V18z M68.5,28.9h-30c-3,' +
        '0-5.5,2.4-5.5,5.5v38.2c0,3,2.4,5.5,5.5,5.5h30c3,0,5.5-2.4,5.5-5.5V34.4C73.9,31.4,71.5,28.9,68.5,28.9z ' +
        'M68.5,72.5h-30V34.4h30V72.5z'
    , visible: true, offset: 0, side: 'Bottom', margin: { top: 0, bottom: 0, left: 0, right: 0 }
}];
let horizontalGridlines: GridlinesModel = { lineColor: 'black', lineDashArray: '1,1' };
let verticalGridlines: GridlinesModel = { lineColor: 'black', lineDashArray: '1,1' };
let snapSettings: SnapSettingsModel = {
    snapObjectDistance: 5,
    constraints: (SnapConstraints.SnapToObject | SnapConstraints.ShowLines | SnapConstraints.SnapToLines) | SnapConstraints.ShowLines,
    horizontalGridlines, verticalGridlines
};
let connector: ConnectorModel = { sourcePoint: { x: 150, y: 100 }, targetPoint: { x: 200, y: 200 }, type: 'Orthogonal' };
diagram = new Diagram({
    width: '1000px', height: '1000px', nodes: [node5
    ], connectors: [connector],
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
let zoomPan: HTMLButtonElement = document.getElementById('ZoomPan') as HTMLButtonElement;
zoomPan.onclick = () => {
    diagram.tool = DiagramTools.ZoomPan;
};
let userHandle: HTMLButtonElement = document.getElementById('AddUserHandle') as HTMLButtonElement;
userHandle.onclick = () => {
    diagram.selectedItems = { userHandles: handles };
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
    let topLeft1: PointModel = (diagram.nodes[4] as NodeModel).wrapper.bounds.topLeft;
    mouseevents.clickEvent(diagramCanvas, diagram.nodes[4].offsetX, diagram.nodes[3].offsetY);
    mouseevents.dragEvent(diagramCanvas, topLeft1.x, topLeft1.y, topLeft1.x - 10, topLeft1.y - 10);
    mouseevents.mouseMoveEvent(diagramCanvas, topLeft1.x - 10, topLeft1.y - 10);
    diagram.dataBind();
};
let noneSelect: HTMLButtonElement = document.getElementById('Node-Select') as HTMLButtonElement;
noneSelect.onclick = () => {
    diagram.clearSelection();
    resetDiagram();
    let mouseevents: MouseEvents = new MouseEvents();
    let diagramCanvas: Element = document.getElementById('diagramcontent');
    mouseevents.clickEvent(diagramCanvas, (diagram.nodes[0] as NodeModel).offsetX, (diagram.nodes[0] as NodeModel).offsetY);
}
let connectorSelect: HTMLButtonElement = document.getElementById('Connector-Select') as HTMLButtonElement;
connectorSelect.onclick = () => {
    diagram.clearSelection();
    resetDiagram();
    let mouseevents: MouseEvents = new MouseEvents();
    let diagramCanvas: Element = document.getElementById('diagramcontent');
    mouseevents.clickEvent(diagramCanvas, diagram.connectors[0].sourcePoint.x, diagram.connectors[0].sourcePoint.y);
    mouseevents.mouseUpEvent(diagramCanvas, diagram.connectors[0].sourcePoint.x, diagram.connectors[0].sourcePoint.y);
}

let delete1: HTMLButtonElement = document.getElementById('NodeConstraints-Delete') as HTMLButtonElement;
delete1.onclick = () => {
    let node: NodeModel = diagram.selectedItems.nodes[0];
    if (node != null) {
        diagram.remove(node);
    }
}
let nodeDrag: HTMLButtonElement = document.getElementById('NodeConstraints-Drag') as HTMLButtonElement;
nodeDrag.onclick = () => {
    resetDiagram();
    let mouseevents: MouseEvents = new MouseEvents();
    let diagramCanvas: Element = document.getElementById('diagramcontent');
    mouseevents.dragEvent(diagramCanvas, 285, 280, 350, 350);
    mouseevents.mouseUpEvent(diagramCanvas, 350, 350);
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
    mouseevents.mouseMoveEvent(diagramCanvas, 285, 280);
    mouseevents.mouseMoveEvent(diagramCanvas, 285, 280);
    mouseevents.mouseOverEvent(diagramCanvas);
    diagram.dataBind();
};

function applyConstraints(value: string): void {
    nodeConstraints(value, (document.getElementById(value) as HTMLInputElement).checked);
}
document.getElementById('None').onchange = () => {
    applyConstraints('None');

};
document.getElementById('ConnectorSourceThumb').onchange = () => {
    applyConstraints('ConnectorSourceThumb');
};
document.getElementById('ConnectorTargetThumb').onchange = () => {
    applyConstraints('ConnectorTargetThumb');
};
document.getElementById('ResizeSouthEast').onchange = () => {
    applyConstraints('ResizeSouthEast');
};
document.getElementById('ResizeSouthWest').onchange = () => {
    applyConstraints('ResizeSouthWest');
};
document.getElementById('ResizeNorthEast').onchange = () => {
    applyConstraints('ResizeNorthEast');
};
document.getElementById('ResizeNorthWest').onchange = () => {
    applyConstraints('ResizeNorthWest');
};
document.getElementById('ResizeEast').onchange = () => {
    applyConstraints('ResizeEast');
};
document.getElementById('ResizeWest').onchange = () => {
    applyConstraints('ResizeWest');
};
document.getElementById('ResizeSouth').onchange = () => {
    applyConstraints('ResizeSouth');
};
document.getElementById('ResizeNorth').onchange = () => {
    applyConstraints('ResizeNorth');
};
document.getElementById('Rotate').onchange = () => {
    applyConstraints('Rotate');
};
document.getElementById('UserHandle').onchange = () => {
    applyConstraints('UserHandle');
};
document.getElementById('ToolTip').onchange = () => {
    applyConstraints('ToolTip');
};
document.getElementById('ResizeAll').onchange = () => {
    applyConstraints('ResizeAll');
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
        diagram.selectedItems.constraints = SelectorConstraints.All;
    }
    if (diagram.selectedItems.constraints & SelectorConstraints.None) {
        diagram.selectedItems.constraints &= ~SelectorConstraints.None;
    }
    switch (constraints) {
        case 'None':
            if (checked) {
                diagram.selectedItems.constraints = SelectorConstraints.None;
            }
            break;
        case 'ConnectorSourceThumb':
            if (checked) {
                diagram.selectedItems.constraints |= SelectorConstraints.ConnectorSourceThumb;
            } else {
                diagram.selectedItems.constraints &= ~SelectorConstraints.ConnectorSourceThumb;
            }
            break;
        case 'ConnectorTargetThumb':
            if (checked) {
                diagram.selectedItems.constraints |= SelectorConstraints.ConnectorTargetThumb;
            } else {
                diagram.selectedItems.constraints &= ~SelectorConstraints.ConnectorTargetThumb;
            }
            break;
        case 'ResizeSouthEast':
            if (checked) {
                diagram.selectedItems.constraints |= SelectorConstraints.ResizeSouthEast;
            } else {
                diagram.selectedItems.constraints &= ~SelectorConstraints.ResizeSouthEast;
            }
            break;
        case 'ResizeSouthWest':
            if (checked) {
                diagram.selectedItems.constraints |= SelectorConstraints.ResizeSouthWest;
            } else {
                diagram.selectedItems.constraints &= ~SelectorConstraints.ResizeSouthWest;
            }
            break;
        case 'ResizeNorthEast':
            if (checked) {
                diagram.selectedItems.constraints |= SelectorConstraints.ResizeNorthEast;
            } else {
                diagram.selectedItems.constraints &= ~SelectorConstraints.ResizeNorthEast;
            }
            break;
        case 'ResizeNorthWest':
            if (checked) {
                diagram.selectedItems.constraints |= SelectorConstraints.ResizeNorthWest;
            } else {
                diagram.selectedItems.constraints &= ~SelectorConstraints.ResizeNorthWest;
            }
            break;
        case 'ResizeEast':
            if (checked) {
                diagram.selectedItems.constraints |= SelectorConstraints.ResizeEast;
            } else {
                diagram.selectedItems.constraints &= ~SelectorConstraints.ResizeEast;
            }
            break;
        case 'ResizeWest':
            if (checked) {
                diagram.selectedItems.constraints |= SelectorConstraints.ResizeWest;
            } else {
                diagram.selectedItems.constraints &= ~SelectorConstraints.ResizeWest;
            }
            break;
        case 'ResizeSouth':
            if (checked) {
                diagram.selectedItems.constraints |= SelectorConstraints.ResizeSouth;
            } else {
                diagram.selectedItems.constraints &= ~SelectorConstraints.ResizeSouth;
            }
            break;
        case 'ResizeNorth':
            if (checked) {
                diagram.selectedItems.constraints |= SelectorConstraints.ResizeNorth;
            } else {
                diagram.selectedItems.constraints &= ~SelectorConstraints.ResizeNorth;
            }
            break;
        case 'Rotate':
            if (checked) {
                diagram.selectedItems.constraints |= SelectorConstraints.Rotate;
            } else {
                diagram.selectedItems.constraints &= ~SelectorConstraints.Rotate;
            }
            break;
        case 'UserHandle':
            if (checked) {
                diagram.selectedItems.constraints |= SelectorConstraints.UserHandle;
            } else {
                diagram.selectedItems.constraints &= ~SelectorConstraints.UserHandle;
            }
            break;
        case 'ToolTip':
            if (checked) {
                diagram.selectedItems.constraints |= SelectorConstraints.ToolTip;
            } else {
                diagram.selectedItems.constraints &= ~SelectorConstraints.ToolTip;
            }
            break;
        case 'ResizeAll':
            if (checked) {
                diagram.selectedItems.constraints |= SelectorConstraints.ResizeAll;
            } else {
                diagram.selectedItems.constraints &= ~SelectorConstraints.ResizeAll;
            }
            break;
        case 'All':
            if (checked) {
                diagram.selectedItems.constraints |= SelectorConstraints.All;
            } else {
                diagram.selectedItems.constraints &= ~SelectorConstraints.All;
            }
            break;
    }
    diagram.dataBind();
}

