import { Diagram, ScrollLimit, DiagramTools } from '../../src/diagram/index';

import { ConnectorModel } from '../../src/diagram/index';

import { NodeModel } from '../../src/diagram/index';

import { Rect } from '../../src/diagram/index';

/**
 * pageSettings
 */
let diagram: Diagram;
let connector: ConnectorModel = {
    id: 'connector1', sourcePoint: { x: 300, y: 400 }, targetPoint: { x: 500, y: 500 }, annotations: [{ content: 'Connector' }]
};
let node: NodeModel = {
    id: 'node1', width: 150, height: 100, offsetX: 100, offsetY: 100, annotations: [{ content: 'Node1' }]
};
let node2: NodeModel = {
    id: 'node2', width: 80, height: 130, offsetX: 200, offsetY: 200, annotations: [{ content: 'Node2' }]
};
let node3: NodeModel = {
    id: 'node3', width: 100, height: 75, offsetX: 300, offsetY: 350, annotations: [{ content: 'Node3' }]
};
diagram = new Diagram({
    width: '700px', height: '500px', nodes: [node, node2, node3], connectors: [connector],
    tool: DiagramTools.ZoomPan,
    scrollSettings: { horizontalOffset: 300, verticalOffset: 300, viewPortHeight: 400, viewPortWidth: 400 }
});
diagram.appendTo('#diagram');

document.getElementById('ScrollLimit').onchange = ScrollLimitChange;
function ScrollLimitChange() {
    let e = ((document.getElementById('ScrollLimit')) as HTMLSelectElement).value;
    diagram.scrollSettings.scrollLimit = e as ScrollLimit;
    diagram.dataBind();
}

let viewPortWidth: HTMLButtonElement = document.getElementById('viewPortWidth') as HTMLButtonElement;
viewPortWidth.onclick = () => {
    //resetDiagram();
    diagram.scrollSettings = {
        viewPortWidth: 800
    };
    diagram.dataBind();
};
let viewPortHeight: HTMLButtonElement = document.getElementById('viewPortHeight') as HTMLButtonElement;
viewPortHeight.onclick = () => {
    //resetDiagram();
    diagram.scrollSettings = {
        viewPortHeight: 700,
    };
    diagram.dataBind();
};
let verticalOffset: HTMLButtonElement = document.getElementById('verticalOffset') as HTMLButtonElement;
verticalOffset.onclick = () => {
    //resetDiagram();
    diagram.scrollSettings = {
        verticalOffset: 700,
    };
    diagram.dataBind();
};
let horizontalOffset: HTMLButtonElement = document.getElementById('horizontalOffset') as HTMLButtonElement;
horizontalOffset.onclick = () => {
    //resetDiagram();
    diagram.scrollSettings = {
        horizontalOffset: 800
    };
    diagram.dataBind();
};
let scrollableArea: HTMLButtonElement = document.getElementById('scrollableArea') as HTMLButtonElement;
scrollableArea.onclick = () => {
    //resetDiagram();
    diagram.scrollSettings = {
        scrollableArea: new Rect(0, 0, 300, 300),
    };
    diagram.dataBind();
};
let minZoom: HTMLButtonElement = document.getElementById('minZoom') as HTMLButtonElement;
minZoom.onclick = () => {
    //resetDiagram();
    diagram.scrollSettings = {
        minZoom: 0.10,
    };
    diagram.dataBind();
};
let maxZoom: HTMLButtonElement = document.getElementById('maxZoom') as HTMLButtonElement;
maxZoom.onclick = () => {
    //resetDiagram();
    diagram.scrollSettings = {
        maxZoom: 0.23,
    };
    diagram.dataBind();
};
let currentZoom: HTMLButtonElement = document.getElementById('currentZoom') as HTMLButtonElement;
currentZoom.onclick = () => {
    //resetDiagram();
    diagram.scrollSettings = {
        currentZoom: 0.2,
    };
    diagram.dataBind();
};
let enableautoscroll: HTMLButtonElement = document.getElementById('EnablecanAutoScroll') as HTMLButtonElement;
enableautoscroll.onclick = () => {
    //resetDiagram();
    diagram.scrollSettings = {
        canAutoScroll: true,
    };
    diagram.dataBind();
};
let disableCanAutoScroll: HTMLButtonElement = document.getElementById('DisablecanAutoScroll') as HTMLButtonElement;
disableCanAutoScroll.onclick = () => {
    //resetDiagram();
    diagram.scrollSettings = {
        canAutoScroll: false,
    };
    diagram.dataBind();
};
let autoScrollBorder: HTMLButtonElement = document.getElementById('autoScrollBorder') as HTMLButtonElement;
autoScrollBorder.onclick = () => {
    //resetDiagram();
    diagram.scrollSettings = {
        autoScrollBorder: { left: 25, right: 25, top: 25, bottom: 25 }
    };
    diagram.dataBind();
};
function resetDiagram(): void {
    for (let i: number = diagram.historyList.undoStack.length; i >= 0; i--) {
        diagram.undo();
    }
}
