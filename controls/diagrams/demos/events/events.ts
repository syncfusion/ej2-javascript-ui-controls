import {
    Diagram, NodeModel, ConnectorModel, IDataLoadedEventArgs,
    ISelectionChangeEventArgs, IDragLeaveEventArgs, IDragEnterEventArgs, IDragOverEventArgs,
    ITextEditEventArgs, IRotationEventArgs, ICollectionChangeEventArgs, ISizeChangeEventArgs,
    IPropertyChangeEventArgs, IDoubleClickEventArgs, IDropEventArgs, IHistoryChangeArgs,
    IScrollChangeEventArgs, IDraggingEventArgs, IEndChangeEventArgs, IConnectionChangeEventArgs,
    PointModel, UndoRedo, Rect, Matrix, identityMatrix, rotateMatrix, transformPointByMatrix, rotatePoint
} from '../../src/diagram/index';
import { DiagramBeforeMenuOpenEventArgs } from '../../src/diagram/index';
import { MenuEventArgs } from '@syncfusion/ej2-navigations';
import { MouseEvents } from '../../spec/diagram/interaction/mouseevents.spec';
Diagram.Inject(UndoRedo);

/**
 * Basic Shapes
 */
let connector: ConnectorModel = { id: 'connector1', sourcePoint: { x: 200, y: 200 }, targetPoint: { x: 300, y: 300 } };
let connector1: ConnectorModel = { id: 'connector2', sourcePoint: { x: 300, y: 300 }, targetPoint: { x: 200, y: 200 } };
let nodes: NodeModel[] = [
    { id: 'node1a', width: 100, height: 100, offsetX: 100, offsetY: 100 },
    { id: 'node2a', width: 100, height: 100, offsetX: 200, offsetY: 150 },
    {
        id: 'node1', width: 100, height: 100, offsetX: 300, offsetY: 300,
    },
    {
        id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 100,
        shape: {
            type: 'Path',
            data: 'M540.3643,137.9336L546.7973,159.7016L570.3633,159.7296L550.7723,171.9366L558.9053,194.9966L540.3643,179.4996L521.8223,194.9966L529.9553,171.9366L510.3633,159.7296L533.9313,159.7016L540.3643,137.9336z'
        }
    },
    {
        id: 'node3', width: 100, height: 100, offsetX: 500, offsetY: 100, shape: { type: 'Text', content: 'Text Element' },
        style: { strokeColor: 'none', fill: 'none', color: 'blue' }
    },
    {
        id: 'node4', width: 50, height: 50, offsetX: 700, offsetY: 100, style: { fill: 'none' },
    },
    {
        id: 'node5', width: 100, height: 100, offsetX: 100, offsetY: 300,

    }];

let diagram: Diagram = new Diagram({
    width: '100%', height: 900, nodes: nodes,
    connectors: [connector, connector1],
    contextMenuOpen: (arg: DiagramBeforeMenuOpenEventArgs) => {
        for (let item of arg.items) {
            if (item.text === 'delete') {
                if (!diagram.selectedItems.nodes.length && !diagram.selectedItems.connectors.length) {
                    arg.hiddenItems.push(item.text);
                }
            }
        }
    },
    contextMenuClick: (arg: MenuEventArgs) => {
        if (arg.item.id === 'delete') {
            if ((diagram.selectedItems.nodes.length + diagram.selectedItems.connectors.length) > 0) {
                diagram.cut();
            }
        }
    },
    getNodeDefaults: (obj: NodeModel) => {
        let defaults: NodeModel = {
            width: 150, height: 50, offsetX: 100, offsetY: 100,
        };
        return defaults;
    }
});
diagram.scrollSettings.canAutoScroll = true;
diagram.appendTo('#diagram');
diagram.animationComplete = () => {
    //if (arg.state === 'Completed') {
    //}
};

let autoScroll: HTMLButtonElement = document.getElementById('AutoScroll') as HTMLButtonElement;
autoScroll.onclick = () => {
    let mouseEvents: MouseEvents = new MouseEvents();
    let diagramCanvas: Element = document.getElementById('diagramcontent');
    //mouseevents.dragEvent(diagramCanvas, 1000, 600, 1100, 700);
    let center: PointModel = { x: 700, y: 300 };
    mouseEvents.clickEvent(diagramCanvas, center.x, center.x);
    mouseEvents.mouseDownEvent(diagramCanvas, center.x, center.y);
    mouseEvents.mouseMoveEvent(diagramCanvas, center.x + 300, center.y + 300);
    mouseEvents.mouseMoveEvent(diagramCanvas, center.x + 300 + 25, center.y + 300 + 25);
    mouseEvents.mouseMoveEvent(diagramCanvas, center.x + 300 + 25 + 10, center.y + 300 + 25 + 10);

    setTimeout(() => {
        // tslint:disable-next-line:curly
        if (diagram.selectedItems.nodes[0].offsetX >= 1000)
            mouseEvents.mouseUpEvent(diagramCanvas, diagram.selectedItems.nodes[0].offsetX, diagram.selectedItems.nodes[0].offsetY);
        diagram.scrollSettings.canAutoScroll = false;
        // tslint:disable-next-line:align
    }, 3000);
};
let autoScrollconnector: HTMLButtonElement = document.getElementById('AutoScroll-Connector') as HTMLButtonElement;
autoScrollconnector.onclick = () => {
    let mouseEvents: MouseEvents = new MouseEvents();
    let diagramCanvas: Element = document.getElementById('diagramcontent');
    let connector: ConnectorModel = {
        id: 'connector', type: 'Orthogonal',
        sourcePoint: { x: 800, y: 350 }, targetPoint: { x: 900, y: 450 }
    };
    diagram.add(connector);
    //mouseevents.dragEvent(diagramCanvas, 1000, 600, 1100, 700);
    let center: PointModel = { x: 805, y: 355 };
    mouseEvents.clickEvent(diagramCanvas, center.x, center.x);
    mouseEvents.mouseDownEvent(diagramCanvas, center.x, center.y);
    mouseEvents.mouseMoveEvent(diagramCanvas, center.x + 195, center.y + 245);
    mouseEvents.mouseMoveEvent(diagramCanvas, center.x + 195 + 25, center.y + 245 + 25);
    mouseEvents.mouseMoveEvent(diagramCanvas, center.x + 195 + 25 + 10, center.y + 245 + 25 + 10);

    setTimeout(() => {
        // tslint:disable-next-line:curly
        if (diagram.selectedItems.nodes[0].offsetX >= 1000)
            mouseEvents.mouseUpEvent(diagramCanvas, diagram.selectedItems.connectors[0].sourcePoint.x + 5,
                diagram.selectedItems.connectors[0].targetPoint.y + 5);
        diagram.scrollSettings.canAutoScroll = false;
        // tslint:disable-next-line:align
    }, 3000);
};
let selectButton: HTMLButtonElement = document.getElementById('Select-node') as HTMLButtonElement;
selectButton.onclick = () => {
    let mouseevents: MouseEvents = new MouseEvents();
    let diagramCanvas: Element = document.getElementById('diagramcontent');
    mouseevents.clickEvent(diagramCanvas, 90, 90);
};
let dragButton: HTMLButtonElement = document.getElementById('Drag-node') as HTMLButtonElement;
dragButton.onclick = () => {
    let mouseevents: MouseEvents = new MouseEvents();
    let connector: ConnectorModel = { id: 'connector', type: 'Orthogonal', sourceID: diagram.nodes[5].id, targetID: diagram.nodes[1].id };
    diagram.add(connector);
    let diagramCanvas: Element = document.getElementById('diagramcontent');
    mouseevents.dragEvent(diagramCanvas, 100, 100, 150, 150);
    mouseevents.mouseUpEvent(diagramCanvas, 150, 150);
};
let resize: HTMLButtonElement = document.getElementById('Resize-node') as HTMLButtonElement;
resize.onclick = () => {
    let mouseevents: MouseEvents = new MouseEvents();
    let diagramCanvas: Element = document.getElementById('diagramcontent');
    let topLeft1: PointModel = (diagram.nodes[2] as NodeModel).wrapper.bounds.topLeft;
    mouseevents.clickEvent(diagramCanvas, 300, 100);
    mouseevents.dragEvent(diagramCanvas, topLeft1.x, topLeft1.y, topLeft1.x - 10, topLeft1.y - 10);
    mouseevents.mouseUpEvent(diagramCanvas, topLeft1.x - 10, topLeft1.y - 10);
};
let position: HTMLButtonElement = document.getElementById('Position-node') as HTMLButtonElement;
position.onclick = () => {
    let mouseevents: MouseEvents = new MouseEvents();
    let diagramCanvas: Element = document.getElementById('diagramcontent');
    let topLeft1: PointModel = (diagram.nodes[1] as NodeModel).wrapper.bounds.topLeft;
    mouseevents.clickEvent(diagramCanvas, 300, 100);
    mouseevents.dragEvent(diagramCanvas, topLeft1.x, topLeft1.y, topLeft1.x - 10, topLeft1.y - 10);
    mouseevents.mouseUpEvent(diagramCanvas, topLeft1.x - 10, topLeft1.y - 10);
};
let rotate: HTMLButtonElement = document.getElementById('Rotate-node') as HTMLButtonElement;
rotate.onclick = () => {
    let mouseEvents: MouseEvents = new MouseEvents();
    let diagramCanvas: Element = document.getElementById('diagramcontent');
    
};

let sourcePointChange: HTMLButtonElement = document.getElementById('sourcePointChange') as HTMLButtonElement;
sourcePointChange.onclick = () => {
    let mouseevents: MouseEvents = new MouseEvents();
    let diagramCanvas: Element = document.getElementById('diagramcontent');
    let topLeft1: PointModel = (diagram.connectors[0] as ConnectorModel).wrapper.bounds.topLeft;
    mouseevents.clickEvent(diagramCanvas, 300, 100);
    mouseevents.dragEvent(diagramCanvas, topLeft1.x, topLeft1.y, topLeft1.x - 10, topLeft1.y - 10);
    mouseevents.mouseUpEvent(diagramCanvas, topLeft1.x - 10, topLeft1.y - 10);

    // mouseEvents.clickEvent(diagramCanvas, 200, 200);
    // mouseEvents.dragAndDropEvent(diagramCanvas, 200, 200, 250, 250);
};
let labelEdit: HTMLButtonElement = document.getElementById('LabelEdit-node') as HTMLButtonElement;
labelEdit.onclick = () => {
    resetDiagram();
    let mouseevents: MouseEvents = new MouseEvents();
    let diagramCanvas: Element = document.getElementById('diagramcontent');
    mouseevents.clickEvent(diagramCanvas, 100, 100);
    mouseevents.dblclickEvent(diagramCanvas, 100, 100);
};
let scrollNode: HTMLButtonElement = document.getElementById('Scroll-node') as HTMLButtonElement;
scrollNode.onclick = () => {
    let mouseevents: MouseEvents = new MouseEvents();
    let diagramCanvas: Element = document.getElementById('diagramcontent');
    mouseevents.dragEvent(diagramCanvas, 100, 100, 1150, 1250);
    mouseevents.mouseUpEvent(diagramCanvas, 1150, 1150);
};
let paletteElement: any = document.getElementById('symbolpalette') as HTMLButtonElement;

let dragEnter: HTMLButtonElement = document.getElementById('dragEnter') as HTMLButtonElement;
dragEnter.onclick = () => {
    let mouseevents: MouseEvents = new MouseEvents();
    let diagramCanvas: Element = document.getElementById('diagramcontent');
    mouseevents.mouseDownEvent(paletteElement, 175, 350, false, false);
    mouseevents.mouseMoveEvent(paletteElement, 100, 350, false, false);
    mouseevents.mouseMoveEvent(paletteElement, 200, 200, false, false);
    mouseevents.mouseMoveEvent(diagramCanvas, 300, 300, false, false);
    mouseevents.mouseUpEvent(diagramCanvas, 300, 300, false, false);
};

// diagram.propertyChange = (arg: IPropertyChangeEventArgs) => {

//     document.getElementById('EventLog').innerHTML += '<br /> Property Change : ' + arg.newValue + ', ' + arg.oldValue
//         + ', cause:' + arg.cause;
//     if (arg.newValue.selectedItems) {
//         document.getElementById('EventLog').innerHTML += '<br /> Property Change : ' +
//             arg.newValue.selectedItems.width;
//     }
// };
// diagram.selectionChange = (arg: ISelectionChangeEventArgs) => {
//     document.getElementById('EventLog').innerHTML += '<br /> Selection Change : State:' + arg.state + ', type:' + arg.type
//         + ', cause:' + arg.cause;
//     if (arg.newValue && arg.newValue[0] && arg.newValue[0].id) {
//         document.getElementById('EventLog').innerHTML += '<br /> newValue :' + ','
//             + arg.newValue[0].id;
//     }
//     if (arg.oldValue && arg.oldValue[0] && arg.oldValue[0].id) {
//         document.getElementById('EventLog').innerHTML += '<br /> oldValue:' + ','
//             + arg.oldValue[0].id;
//     }
//     if (arg.state === 'Changed') {
//         if (arg.oldValue && arg.oldValue[0] && arg.newValue && arg.newValue[0] &&
//             arg.oldValue[0].id && arg.newValue[0].id) {
//             document.getElementById('EventLog').innerHTML += '<br /> Selection Change with changed state : ' + arg.state + ', ' + arg.type
//                 + ',' + arg.newValue[0].id + ',' + arg.oldValue[0].id;
//         }
//     }
// };
// diagram.scrollChange = (arg: IScrollChangeEventArgs) => {
//     if (arg.oldValue.HorizontalOffset && arg.newValue.HorizontalOffset && arg.newValue.VerticalOffset &&
//         arg.oldValue.VerticalOffset) {
//         document.getElementById('EventLog').innerHTML += '<br /> Scroll Change : oldvalue-horizontaloffset:'
//             + ', source:' + arg.source
//             + arg.oldValue.HorizontalOffset + ',oldvalue-verticaloffset ' + arg.oldValue.VerticalOffset
//             + ' newvalue-horizontaloffset:' + arg.newValue.HorizontalOffset + ',newvalue-verticaloffset ' + arg.newValue.VerticalOffset;
//     }
// };
// diagram.rotateChange = (arg: IRotationEventArgs) => {

//     document.getElementById('EventLog').innerHTML += '<br /> Rotation Change : ' + arg.state
//         + ', source:' + arg.source
//         + ',newValue:' + arg.newValue + ',oldValue' + arg.oldValue;
//     if (arg.state === 'Completed') {
//         document.getElementById('EventLog').innerHTML += '<br /> Rotation Change : '
//             + ', source:' + arg.source
//             + ',newValue:' + arg.newValue + ',oldValue' + arg.oldValue;
//     }
// };
// diagram.collectionChange = (arg: ICollectionChangeEventArgs) => {

//     document.getElementById('EventLog').innerHTML += '<br /> Collection Change : ' + arg.state
//         + ', cause:' + arg.cause
//         + ',type:' + arg.type + ',element' + arg.element.id;

// };
// diagram.sizeChange = (arg: ISizeChangeEventArgs) => {

//     document.getElementById('EventLog').innerHTML += '<br /> Size Change : ' + arg.state
//         + ', source:' + arg.source;
//     if (arg.newValue && arg.newValue[0]) {
//         document.getElementById('EventLog').innerHTML += '<br /> Size Change : '
//             + ',newValue:' + arg.newValue[0].id;
//     }
//     if (arg.state === 'Completed') {
//         document.getElementById('EventLog').innerHTML += '<br /> Size Change newValue: ' + arg.newValue.offsetX
//             + arg.newValue.offsetY;
//     }
// };
// diagram.positionChange = (arg: IDraggingEventArgs) => {
//     document.getElementById('EventLog').innerHTML += '<br /> Position Change : ' + arg.state
//         + ', source:' + arg.source
//         + ', target:' + arg.target
//         + ',newValue:' + arg.newValue + ',oldValue' + arg.oldValue + ', targetPsition:' + arg.targetPosition;
//     if (arg.state === 'Completed') {
//         document.getElementById('EventLog').innerHTML += '<br /> Position Change : ' +
//             ',newValueOffsetX:' + arg.newValue.offsetX +
//             ',newValueOffsetY:' + arg.newValue.offsetY;
//     }
// };
// diagram.sourcePointChange = (arg: IEndChangeEventArgs) => {

//     document.getElementById('EventLog').innerHTML += '<br /> Source end change: ' + arg.state
//         + ',newValue:' + arg.newValue + ',oldValue' + arg.oldValue
//         + ',targetNode:' + arg.targetNode + ',targetPort' + arg.targetPort
//         + ',connector:' + arg.connector;
// };
// diagram.targetPointChange = (arg: IEndChangeEventArgs) => {

//     document.getElementById('EventLog').innerHTML += '<br /> Target end change: ' + arg.state
//         + ',newValue:' + arg.newValue as PointModel + ',oldValue' + arg.oldValue.x + arg.oldValue.y
//         + ',targetNode:' + arg.targetNode + ',targetPort' + arg.targetPort
//         + ',connector:' + arg.connector;
// };
// diagram.connectionChange = (arg: IConnectionChangeEventArgs) => {

//     document.getElementById('EventLog').innerHTML += '<br /> connection change: ' + arg.state
//         + ', connector:' + arg.connector
//         + ',newValue:' + arg.newValue + ',oldValue' + arg.oldValue
//         + ',connectorEnd:' + arg.connectorEnd;
// };
// diagram.dataLoaded = (arg: IDataLoadedEventArgs) => {
//     document.getElementById('EventLog').innerHTML += '<br /> dataLoaded: ' + arg.diagram[0].id;
// };
// diagram.doubleClick = (arg: IDoubleClickEventArgs) => {
//     document.getElementById('EventLog').innerHTML += '<br /> doubleClick: ' + arg.count
//         + ', position:' + arg.position + ', source:' + arg.source;
// };
// diagram.historyChange = (arg: IHistoryChangeArgs) => {

//     document.getElementById('EventLog').innerHTML += '<br /> historyChange : ' + arg.cause
//         + ', change:' + arg.change.offsetX
//         + ', source:' + arg.source;
// };
// diagram.textEdit = (arg: ITextEditEventArgs) => {

//     document.getElementById('EventLog').innerHTML += '<br /> Drag Enter : ' + arg.oldValue + ',' + arg.newValue;
// };
document.getElementById('eventclear').onclick = () => {
    document.getElementById('EventLog').innerHTML = '';
};
let appearance: HTMLButtonElement = document.getElementById('Appearance-node') as HTMLButtonElement;
appearance.onclick = () => {
    resetDiagram();
    setNodeStyle();
};
function setNodeStyle(): void {
    for (let i: number = 0; i < diagram.nodes.length; i++) {
        diagram.nodes[i].style = { fill: 'red', strokeColor: 'blue', color: 'black' };

    }
}
function resetDiagram(): void {
    for (let i: number = diagram.historyList.undoStack.length; i >= 0; i--) {
        diagram.undo();
    }
}