import { Diagram, Matrix, ConnectorConstraints, transformPointByMatrix, rotateMatrix, identityMatrix, DiagramElement, ConnectorBridging, DiagramConstraints, Connector, UndoRedo, Segments, DiagramTools, PointModel, PathAnnotationModel, Html } from '../../src/diagram/index';
import { ConnectorModel } from '../../src/diagram/objects/connector-model';
import { MouseEvents } from '../../spec/diagram/interaction/mouseevents.spec';
Diagram.Inject(ConnectorBridging, UndoRedo);

/**
 * Connectors
 */

let connectors: ConnectorModel[] = [
    {
        id: 'connector1',
        type: 'Straight',
        sourcePoint: { x: 100, y: 100 },
        targetPoint: { x: 200, y: 200 },
    },
    {
        id: 'connector2',
        type: 'Straight',
        sourcePoint: { x: 300, y: 100 },
        targetPoint: { x: 400, y: 200 },
        sourceDecorator: {
            style: { fill: 'black' },
            shape: 'Diamond',
            pivot: { x: 0, y: 0.5 }
        },
        targetDecorator: {
            shape: 'None',
            style: { fill: 'blue' },
            pivot: { x: 0, y: 0.5 }
        }
    },
    {
        id: 'connector3',
        type: 'Straight',
        sourcePoint: { x: 500, y: 100 },
        targetPoint: { x: 600, y: 200 },
        sourceDecorator: {
            style: { fill: 'black' },
            shape: 'Arrow',
            pivot: { x: 0, y: 0.5 }
        },
        targetDecorator: {
            shape: 'Diamond',
            style: { fill: 'blue' },
            pivot: { x: 0, y: 0.5 }
        }
    },
    {
        id: 'connector4',
        type: 'Straight',
        sourcePoint: { x: 700, y: 100 },
        targetPoint: { x: 800, y: 200 },

        targetDecorator: {
            shape: 'None',
            style: { strokeColor: 'red', strokeWidth: 3, strokeDashArray: '2,2' }
        }
    },
    {
        id: 'connector5',
        type: 'Orthogonal',
        sourcePoint: { x: 100, y: 300 },
        targetPoint: { x: 200, y: 400 },
    },
    {
        id: 'connector6',
        type: 'Orthogonal',
        sourcePoint: { x: 300, y: 300 },
        targetPoint: { x: 400, y: 400 },
        sourceDecorator: {
            style: { fill: 'black' },
            shape: 'Diamond',
            pivot: { x: 0, y: 0.5 }
        },
        targetDecorator: {
            shape: 'None',
            style: { fill: 'blue' },
            pivot: { x: 0, y: 0.5 }
        }
    },
    {
        id: 'connector7',
        type: 'Orthogonal',
        sourcePoint: { x: 500, y: 300 },
        targetPoint: { x: 600, y: 400 },
        sourceDecorator: {
            style: { fill: 'black' },
            shape: 'Arrow',
            pivot: { x: 0, y: 0.5 }
        },
        targetDecorator: {
            shape: 'Diamond',
            style: { fill: 'blue' },
            pivot: { x: 0, y: 0.5 }
        }
    },
    {
        id: 'connector8',
        type: 'Orthogonal',
        sourcePoint: { x: 700, y: 300 },
        targetPoint: { x: 800, y: 400 },

        targetDecorator: {
            shape: 'None',
        }
    },
];

let diagram: Diagram = new Diagram({
    width: '1050px', height: '500px', connectors: connectors,
    constraints: DiagramConstraints.Default | DiagramConstraints.Bridging
});

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
document.getElementById('selectionoption').onchange = selectionOption;
function selectionOption() {
    let e: HTMLSelectElement = (document.getElementById('selectionoption')) as HTMLSelectElement;
    let multipleSelect: HTMLInputElement = (document.getElementById('MultipleSelection')) as HTMLInputElement;
    let value: boolean = (multipleSelect.checked) ? true : false;
    diagram.select([diagram.connectors[Number(e.value)]], value);
}
document.getElementById('connectorType').onchange = () => {
    (document.getElementById('drawingTools') as HTMLInputElement).checked = false;
    let type: Segments = (document.getElementById('connectorType') as HTMLInputElement).value as Segments;
    if (type == 'Straight' || type === 'Bezier') {
        ((document.getElementById('cornerRadius') as HTMLInputElement).checked) = false;
    }
}
document.getElementById('drawingTools').onchange = () => {
    let type: Segments = (document.getElementById('connectorType') as HTMLInputElement).value as Segments;
    let cornerRadius: number = ((document.getElementById('cornerRadius') as HTMLInputElement).checked) ? 10 : 0;
    let annotations: PathAnnotationModel[] = ((document.getElementById('label') as HTMLInputElement).checked) ? [{ id: 'label1', content: 'Text2', offset: 0.5 }] : [];
    let connector: ConnectorModel = { type: type, cornerRadius: cornerRadius, annotations: annotations };
    diagram.tool = DiagramTools.DrawOnce;
    diagram.drawingObject = connector;
    diagram.dataBind();
    if (type === 'Straight') {
        mouseEvents.mouseDownEvent(diagramCanvas, 200, 100);
        mouseEvents.mouseMoveEvent(diagramCanvas, 250, 150);
        mouseEvents.mouseMoveEvent(diagramCanvas, 300, 200);
        mouseEvents.mouseUpEvent(diagramCanvas, 300, 200);
    } else if (type === 'Orthogonal') {
        mouseEvents.mouseDownEvent(diagramCanvas, 250, 400);
        mouseEvents.mouseMoveEvent(diagramCanvas, 250, 430);
        mouseEvents.mouseMoveEvent(diagramCanvas, 300, 450);
        mouseEvents.mouseUpEvent(diagramCanvas, 300, 450);
    } else {
        mouseEvents.mouseDownEvent(diagramCanvas, 300, 480);
        mouseEvents.mouseMoveEvent(diagramCanvas, 250, 450);
        mouseEvents.mouseMoveEvent(diagramCanvas, 400, 420);
        mouseEvents.mouseUpEvent(diagramCanvas, 400, 450);
    }
};
document.getElementById('cornerRadius').onclick = () => {
    let obj: ConnectorModel = diagram.selectedItems.connectors[0];
    obj.cornerRadius = ((document.getElementById('cornerRadius') as HTMLInputElement).checked) ? 10 : 0;
    diagram.dataBind();
}
document.getElementById('addConnector').onclick = () => {
    let type: Segments = (document.getElementById('connectorType') as HTMLInputElement).value as Segments;
    let sourcePoint: PointModel;
    let targetPoint: PointModel;
    let cornerRadius: number = ((document.getElementById('cornerRadius') as HTMLInputElement).checked) ? 10 : 0;
    let annotations: PathAnnotationModel[] = ((document.getElementById('label') as HTMLInputElement).checked) ? [{ id: 'label1', content: 'Text2', offset: 0.5 }] : [];
    if (type === 'Straight') {
        sourcePoint = { x: 900, y: 100 };
        targetPoint = { x: 1000, y: 200 };
    } else if (type === 'Orthogonal') {
        sourcePoint = { x: 900, y: 300 };
        targetPoint = { x: 1000, y: 400 };
    } else {
        sourcePoint = { x: 900, y: 220 };
        targetPoint = { x: 1000, y: 300 };
    }
    let connector: ConnectorModel = { type: type, annotations: annotations, sourcePoint: sourcePoint, targetPoint: targetPoint, cornerRadius: cornerRadius }
    diagram.add(connector);
};

document.getElementById('removeConnector').onclick = () => {
    let obj = diagram.nameTable[diagram.selectedItems.connectors[0].id];
    diagram.remove(obj);
};
document.getElementById('fillColor').onchange = () => {
    let obj: ConnectorModel = diagram.selectedItems.connectors[0];
    if ((document.getElementById('fillColorRadio') as HTMLInputElement).checked) {
        obj.style.fill = (document.getElementById('fillColor') as HTMLInputElement).value;
    } else {
        obj.style.strokeColor = (document.getElementById('fillColor') as HTMLInputElement).value;
    }
    diagram.dataBind();
}
document.getElementById('strokeWidth').onchange = () => {
    let obj: ConnectorModel = diagram.selectedItems.connectors[0];
    obj.style.strokeWidth = Number((document.getElementById('strokeWidth') as HTMLInputElement).value);
    diagram.dataBind();
}
document.getElementById('strokeDashArray').onchange = () => {
    let obj: ConnectorModel = diagram.selectedItems.connectors[0];
    obj.style.strokeDashArray = (document.getElementById('strokeDashArray') as HTMLInputElement).value;
    diagram.dataBind();
}
document.getElementById('opacity').onchange = () => {
    let obj: ConnectorModel = diagram.selectedItems.connectors[0];
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

function draw() {
    let type: Segments = (document.getElementById('connectorType') as HTMLInputElement).value as Segments;
    if (type === 'Straight') {
        mouseEvents.mouseDownEvent(diagramCanvas, 200, 100);
        mouseEvents.mouseMoveEvent(diagramCanvas, 250, 150);
        mouseEvents.mouseMoveEvent(diagramCanvas, 300, 200);
        mouseEvents.mouseUpEvent(diagramCanvas, 300, 200);
    } else if (type === 'Orthogonal') {
        mouseEvents.mouseDownEvent(diagramCanvas, 250, 400);
        mouseEvents.mouseMoveEvent(diagramCanvas, 250, 430);
        mouseEvents.mouseMoveEvent(diagramCanvas, 300, 450);
        mouseEvents.mouseUpEvent(diagramCanvas, 300, 450);
    } else {
        mouseEvents.mouseDownEvent(diagramCanvas, 300, 480);
        mouseEvents.mouseMoveEvent(diagramCanvas, 250, 450);
        mouseEvents.mouseMoveEvent(diagramCanvas, 400, 420);
        mouseEvents.mouseUpEvent(diagramCanvas, 400, 450);
    }
}


document.getElementById('interaction').onchange = interaction;
function interaction() {
    let e: HTMLSelectElement = (document.getElementById('interaction')) as HTMLSelectElement;
    if (e.value === 'drag') {
        drag();
    } else if (e.value === 'sourceEndDrag') {
        sourceEndDrag();
    } else if (e.value === 'targetEndDrag') {
        targetEndDrag();
    } else if (e.value === 'rotate') {
        rotate();
    } else {
        resize(e.value);
    }
}

function drag() {
    if (diagram.selectedItems.connectors.length) {
        let connector = diagram.selectedItems.connectors[0];
        let points = (diagram.selectedItems.connectors[0] as Connector).intermediatePoints;
        let centerX = (((connector.type === 'Orthogonal') ? points[2].x : points[0].x) + points[1].x) / 2;
        let centerY = (((connector.type === 'Orthogonal') ? points[2].y : points[0].y) + points[1].y) / 2;
        mouseEvents.mouseDownEvent(diagramCanvas, centerX + diagram.element.offsetLeft, centerY + diagram.element.offsetTop);
        mouseEvents.mouseMoveEvent(diagramCanvas, centerX + diagram.element.offsetLeft + 20, centerY + diagram.element.offsetTop);
        mouseEvents.mouseMoveEvent(diagramCanvas, centerX + diagram.element.offsetLeft + 20, centerY + diagram.element.offsetTop + 20);
        mouseEvents.mouseUpEvent(diagramCanvas, centerX + diagram.element.offsetLeft + 20, centerY + diagram.element.offsetTop + 20);
    }
}

function sourceEndDrag() {
    if (diagram.selectedItems.connectors.length) {
        let connector: ConnectorModel = diagram.selectedItems.connectors[0];
        let centerX: number = (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].x;
        let centerY: number = (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].y;
        mouseEvents.mouseDownEvent(diagramCanvas, centerX + diagram.element.offsetLeft, centerY + diagram.element.offsetTop);
        mouseEvents.mouseMoveEvent(diagramCanvas, centerX + diagram.element.offsetLeft + 20, centerY + diagram.element.offsetTop);
        mouseEvents.mouseMoveEvent(diagramCanvas, centerX + diagram.element.offsetLeft + 20, centerY + diagram.element.offsetTop + 20);
        mouseEvents.mouseUpEvent(diagramCanvas, centerX + diagram.element.offsetLeft + 20, centerY + diagram.element.offsetTop + 20);
    }
}

function targetEndDrag() {
    if (diagram.selectedItems.connectors.length) {
        let connector: ConnectorModel = diagram.selectedItems.connectors[0];
        let length: number = (diagram.selectedItems.connectors[0] as Connector).intermediatePoints.length;
        let centerX: number = (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[length - 1].x;
        let centerY: number = (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[length - 1].y;
        mouseEvents.mouseDownEvent(diagramCanvas, centerX + diagram.element.offsetLeft, centerY + diagram.element.offsetTop);
        mouseEvents.mouseMoveEvent(diagramCanvas, centerX + diagram.element.offsetLeft + 20, centerY + diagram.element.offsetTop);
        mouseEvents.mouseMoveEvent(diagramCanvas, centerX + diagram.element.offsetLeft + 20, centerY + diagram.element.offsetTop + 20);
        mouseEvents.mouseUpEvent(diagramCanvas, centerX + diagram.element.offsetLeft + 20, centerY + diagram.element.offsetTop + 20);
    }
}

function sourceControlThumbDrag() {
    if (diagram.selectedItems.connectors[0].type == 'Bezier') {
        let element: HTMLElement = document.getElementById('bezierPoint_1_1');
        let x: number = Number(element.getAttribute('cx'));
        let y: number = Number(element.getAttribute('cy'));
        mouseEvents.mouseDownEvent(diagramCanvas, x + diagram.element.offsetLeft, y + diagram.element.offsetTop);
        mouseEvents.mouseMoveEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop + 50);
        mouseEvents.mouseMoveEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop + 20);
        mouseEvents.mouseUpEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop + 20);
    }
}

function targetControlThumbDrag() {
    if (diagram.selectedItems.connectors[0].type == 'Bezier') {
        let element: HTMLElement = document.getElementById('bezierPoint_1_2');
        let x: number = Number(element.getAttribute('cx'));
        let y: number = Number(element.getAttribute('cy'));
        mouseEvents.mouseDownEvent(diagramCanvas, x + diagram.element.offsetLeft, y + diagram.element.offsetTop);
        mouseEvents.mouseMoveEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop - 20);
        mouseEvents.mouseMoveEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop + 20);
        mouseEvents.mouseUpEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop + 20);
    }
}


let addlabel = document.getElementById('addLabel');
addlabel.onclick = function () {
    if (diagram.selectedItems.nodes.length + diagram.selectedItems.connectors.length > 0) {
        let isNode: boolean = (diagram.selectedItems.nodes.length > 0) ? true : false;
        let node: ConnectorModel = diagram.selectedItems.connectors[0];
        let label: PathAnnotationModel[] = [{ id: 'label1', content: 'Text2', offset: 0.5 }];
        diagram.addLabels(node, label);
    }
}

let removelabel = document.getElementById('removeLabel');
removelabel.onclick = function () {
    if (diagram.selectedItems.nodes.length + diagram.selectedItems.connectors.length > 0) {
        let isNode: boolean = (diagram.selectedItems.nodes.length > 0) ? true : false;
        let node: ConnectorModel = diagram.selectedItems.connectors[0];
        let label: PathAnnotationModel[] = [{ id: 'label1' },];
        diagram.removeLabels(node, label);
    }
}

function rotate() {
    if (diagram.selectedItems.connectors.length > 1) {
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
    if (diagram.selectedItems.connectors.length > 1) {
        let element: HTMLElement = document.getElementById(direction);
        let x: number = Number(element.getAttribute('cx'));
        let y: number = Number(element.getAttribute('cy'));
        mouseEvents.mouseDownEvent(diagramCanvas, x + diagram.element.offsetLeft, y + diagram.element.offsetTop);
        mouseEvents.mouseMoveEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop);
        mouseEvents.mouseMoveEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop + 20);
        mouseEvents.mouseUpEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop + 20);
    }
}

document.getElementById('None').onchange = function () {
    connectorConstraints('None', (document.getElementById('None') as HTMLInputElement).checked);
}
document.getElementById('Select').onchange = function () {
    connectorConstraints('Select', (document.getElementById('Select') as HTMLInputElement).checked);
}
document.getElementById('Drag').onchange = function () {
    connectorConstraints('Drag', (document.getElementById('Drag') as HTMLInputElement).checked);
}
document.getElementById('Delete').onchange = function () {
    connectorConstraints('Delete', (document.getElementById('Delete') as HTMLInputElement).checked);
}
document.getElementById('DragSourceEnd').onchange = function () {
    connectorConstraints('DragSourceEnd', (document.getElementById('DragSourceEnd') as HTMLInputElement).checked);
}
document.getElementById('DragTargetEnd').onchange = function () {
    connectorConstraints('DragTargetEnd', (document.getElementById('DragTargetEnd') as HTMLInputElement).checked);
}
document.getElementById('DragSegmentThumb').onchange = function () {
    connectorConstraints('DragSegmentThumb', (document.getElementById('DragSegmentThumb') as HTMLInputElement).checked);
}
document.getElementById('AllowDrop').onchange = function () {
    connectorConstraints('AllowDrop', (document.getElementById('AllowDrop') as HTMLInputElement).checked);
}
document.getElementById('Bridging').onchange = function () {
    connectorConstraints('Bridging', (document.getElementById('Bridging') as HTMLInputElement).checked);
}
document.getElementById('BridgeObstacle').onchange = function () {
    connectorConstraints('BridgeObstacle', (document.getElementById('BridgeObstacle') as HTMLInputElement).checked);
}
document.getElementById('InheritBridging').onchange = function () {
    connectorConstraints('InheritBridging', (document.getElementById('InheritBridging') as HTMLInputElement).checked);
}
document.getElementById('PointerEvents').onchange = function () {
    connectorConstraints('PointerEvents', (document.getElementById('PointerEvents') as HTMLInputElement).checked);
}
document.getElementById('Tooltip').onchange = function () {
    connectorConstraints('Tooltip', (document.getElementById('Tooltip') as HTMLInputElement).checked);
}
document.getElementById('InheritTooltip').onchange = function () {
    connectorConstraints('InheritTooltip', (document.getElementById('InheritTooltip') as HTMLInputElement).checked);
}
document.getElementById('Interaction').onchange = function () {
    connectorConstraints('Interaction', (document.getElementById('Interaction') as HTMLInputElement).checked);
}
document.getElementById('ReadOnly').onchange = function () {
    connectorConstraints('ReadOnly', (document.getElementById('ReadOnly') as HTMLInputElement).checked);
}
document.getElementById('Default').onchange = function () {
    connectorConstraints('Default', (document.getElementById('Default') as HTMLInputElement).checked);
}

function connectorConstraints(constraints: string, checked: boolean) {
    if (diagram.selectedItems.connectors.length === 1) {
        let connector = diagram.selectedItems.connectors[0];
        switch (constraints) {
            case 'None':
                connector.constraints = ConnectorConstraints.None;
                break;
            case 'Select':
                if (checked) {
                    connector.constraints |= ConnectorConstraints.Select;
                } else {
                    connector.constraints = connector.constraints & ~ConnectorConstraints.Select;
                }
                break;
            case 'Delete':
                if (checked) {
                    connector.constraints |= ConnectorConstraints.Delete;
                } else {
                    connector.constraints = connector.constraints & ~ConnectorConstraints.Delete;
                }
                break;
            case 'Drag':
                if (checked) {
                    connector.constraints |= ConnectorConstraints.Drag;
                } else {
                    connector.constraints = connector.constraints & ~ConnectorConstraints.Drag;
                }
                break;
            case 'DragSourceEnd':
                if (checked) {
                    connector.constraints |= ConnectorConstraints.DragSourceEnd;
                } else {
                    connector.constraints = connector.constraints & ~ConnectorConstraints.DragSourceEnd;
                }
                break;
            case 'DragTargetEnd':
                if (checked) connector.constraints |= ConnectorConstraints.DragTargetEnd;
                else { connector.constraints = connector.constraints & ~ConnectorConstraints.DragTargetEnd; }
                break;
            case 'DragSegmentThumb':
                if (checked) {
                    connector.constraints |= ConnectorConstraints.DragSegmentThumb;
                }

                else { connector.constraints = connector.constraints & ~ConnectorConstraints.DragSegmentThumb; }
                break;
            case 'AllowDrop':
                if (checked) {
                    connector.constraints |= ConnectorConstraints.AllowDrop;
                } else { connector.constraints = connector.constraints & ~ConnectorConstraints.AllowDrop; }
                break;
            case 'Bridging':
                if (checked) {
                    connector.constraints |= ConnectorConstraints.Bridging;
                } else {
                    connector.constraints = connector.constraints & ~ConnectorConstraints.Bridging;
                }
                break;
            case 'BridgeObstacle':
                if (checked) {
                    connector.constraints |= ConnectorConstraints.BridgeObstacle;
                } else {
                    connector.constraints = connector.constraints & ~ConnectorConstraints.BridgeObstacle;
                }
                break;
            case 'InheritBridging':
                if (checked) {
                    connector.constraints |= ConnectorConstraints.InheritBridging;
                } else {
                    connector.constraints = connector.constraints & ~ConnectorConstraints.InheritBridging;
                }
                break;
            case 'PointerEvents':
                if (checked) {
                    connector.constraints |= ConnectorConstraints.PointerEvents;
                } else {
                    connector.constraints = connector.constraints & ~ConnectorConstraints.PointerEvents;
                }
                break;
            case 'Tooltip ':
                if (checked) {
                    connector.constraints |= ConnectorConstraints.Tooltip;
                } else { connector.constraints = connector.constraints & ~ConnectorConstraints.Tooltip; }
                break;
            case 'InheritTooltip':
                if (checked) {
                    connector.constraints |= ConnectorConstraints.InheritTooltip;
                } else {
                    connector.constraints = connector.constraints & ~ConnectorConstraints.InheritTooltip;
                }
                break;
            case 'Interaction':
                if (checked) {
                    connector.constraints |= ConnectorConstraints.Interaction;
                } else {
                    connector.constraints = connector.constraints & ~ConnectorConstraints.Interaction;
                }
                break;
            case 'ReadOnly':
                if (checked) {
                    connector.constraints |= ConnectorConstraints.ReadOnly;
                } else {
                    connector.constraints = connector.constraints & ~ConnectorConstraints.ReadOnly;
                }
                break;
            case 'Default':
                if (checked) {
                    connector.constraints |= ConnectorConstraints.Default;
                } else {
                    connector.constraints = connector.constraints & ~ConnectorConstraints.Default;
                }
        }
    }
}
function uncheckAll(divid: string) {
    let checks = document.querySelectorAll('#' + divid + ' input[type="checkbox"]');
    for (let i = 0; i < checks.length; i++) {
        let check = checks[i];
        // if(!check.disabled){
        //     check.checked = false;
        // }
    }
}
let copy = document.getElementById('copy');
copy.onclick = function () {
    diagram.copy();

}

let paste = document.getElementById('paste');
paste.onclick = function () {
    diagram.paste();
}
let Bridging = document.getElementById('connectorbridging');
Bridging.onclick = function () {
    let connector: ConnectorModel = { sourcePoint: { x: 50, y: 150 }, targetPoint: { x: 850, y: 150 } };
    let connector1: ConnectorModel = { sourcePoint: { x: 50, y: 350 }, targetPoint: { x: 850, y: 350 } };
    diagram.add(connector);
    diagram.add(connector1);
}
document.getElementById('connectorInteraction').onclick = () => {
    drag();
    sourceEndDrag();
    targetEndDrag();
    rotate();
    resize('resizeNorth');
    sourceControlThumbDrag();
    targetControlThumbDrag();
}
document.getElementById('connectorStyle').onclick = () => {
    let connector = diagram.connectors[0];
    connector.style.fill = 'Red';
    connector.style.strokeColor = 'Blue';
    connector.style.opacity = 0.5;
    connector.style.strokeWidth = 4;
    connector.style.strokeDashArray = '2,2'
    diagram.dataBind();
}

document.getElementById('connectorProperties').onclick = () => {
    let connector = diagram.connectors[2];
    connector.sourcePoint.x = 520;
    connector.sourcePoint.y = 80;
    connector.targetPoint.x = 620;
    connector.targetPoint.y = 180;
    connector.type = 'Orthogonal';
    diagram.connectors[3].type = 'Bezier';
    diagram.connectors[4].type = 'Straight';
    diagram.connectors[5].type = 'Bezier';
    diagram.connectors[6].type = 'Bezier';
    diagram.connectors[6].type = 'Orthogonal';
    diagram.dataBind();
}

document.getElementById('drawConnectorUsingDrawingTool').onclick = () => {
    let connector: ConnectorModel = { type: 'Straight', annotations: [{ id: 'label1', content: 'Text2', offset: 0.5 }] };
    diagram.tool = DiagramTools.DrawOnce;
    diagram.drawingObject = connector;
    diagram.dataBind();
    mouseEvents.mouseDownEvent(diagramCanvas, 200, 100);
    mouseEvents.mouseMoveEvent(diagramCanvas, 250, 150);
    mouseEvents.mouseMoveEvent(diagramCanvas, 300, 200);
    mouseEvents.mouseUpEvent(diagramCanvas, 300, 200);
    connector = { type: 'Orthogonal', cornerRadius: 10, annotations: [{ id: 'label1', content: 'Text2', offset: 0.5 }] };
    diagram.tool = DiagramTools.DrawOnce;
    diagram.drawingObject = connector;
    diagram.dataBind();
    mouseEvents.mouseDownEvent(diagramCanvas, 250, 400);
    mouseEvents.mouseMoveEvent(diagramCanvas, 250, 430);
    mouseEvents.mouseMoveEvent(diagramCanvas, 300, 450);
    mouseEvents.mouseUpEvent(diagramCanvas, 300, 450);
    connector = { type: 'Bezier', cornerRadius: 10, annotations: [{ id: 'label1', content: 'Text2', offset: 0.5 }] };
    diagram.tool = DiagramTools.DrawOnce;
    diagram.drawingObject = connector;
    diagram.dataBind();
    mouseEvents.mouseDownEvent(diagramCanvas, 300, 480);
    mouseEvents.mouseMoveEvent(diagramCanvas, 250, 450);
    mouseEvents.mouseMoveEvent(diagramCanvas, 400, 420);
    mouseEvents.mouseUpEvent(diagramCanvas, 400, 450);
}
