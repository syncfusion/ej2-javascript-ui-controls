import {
    Diagram, NodeModel, FlowShapeModel, BasicShapeModel, UndoRedo, ConnectorModel, cloneObject, AlignmentOptions
} from '../../src/diagram/index';
import { HistoryEntry, History } from '../../src/diagram/diagram/history';
Diagram.Inject(UndoRedo);
/**
 * Undo Redo
 */
let node1: NodeModel = {
    id: 'node1', width: 90, height: 40, annotations: [{ content: 'Start' }],
    offsetX: 400, offsetY: 30, shape: { type: 'Flow', shape: 'Terminator' }
};
let node2: NodeModel = {
    id: 'node2', offsetX: 400, offsetY: 100, width: 90, height: 40, annotations: [{ content: 'Design' }],
    shape: { type: 'Flow', shape: 'Process' }
};
let node3: NodeModel = {
    id: 'node3', offsetX: 400, offsetY: 180, width: 90, height: 40, annotations: [{ content: 'Coding' }],
    shape: { type: 'Flow', shape: 'Process' }
};
let node4: NodeModel = {
    id: 'node4', width: 90, height: 40, offsetX: 400, offsetY: 260,
    annotations: [{ content: 'Testing' }], shape: { type: 'Flow', shape: 'Process' },
};
let node5: NodeModel = {
    id: 'node5', width: 90, height: 40, offsetX: 400, offsetY: 340,
    annotations: [{ content: 'Errors?' }], shape: { type: 'Flow', shape: 'Decision' },
};
let node6: NodeModel = {
    id: 'node6', width: 90, height: 40, offsetX: 400, offsetY: 450,
    annotations: [{ content: 'End' }], shape: { type: 'Flow', shape: 'Terminator' },
};
let node7: NodeModel = {
    id: 'node7', width: 110, height: 60, offsetX: 220, offsetY: 180,
    annotations: [{ content: 'Design Error?' }], shape: { type: 'Flow', shape: 'Decision' }
};


let connector1: ConnectorModel = { id: 'connector1', sourceID: node1.id, targetID: node2.id };

let connector2: ConnectorModel = { id: 'connector2', sourceID: node2.id, targetID: node3.id };
let connector3: ConnectorModel = { id: 'connector3', sourceID: node3.id, targetID: node4.id };
let connector4: ConnectorModel = { id: 'connector4', sourceID: node4.id, targetID: node5.id };
let connector5: ConnectorModel = {
    id: 'connector5', sourceID: node5.id, targetID: node6.id,
    annotations: [{ content: 'No', style: { fill: 'white' } }]
};
let connector6: ConnectorModel = {
    id: 'connector6', sourceID: node5.id, targetID: node7.id, type: 'Orthogonal',
    annotations: [{ content: 'Yes', style: { fill: 'white' } }]
};
let connector7: ConnectorModel = {
    id: 'connector7', sourceID: node7.id, targetID: node3.id, type: 'Orthogonal',
    annotations: [{ content: 'No', style: { fill: 'white' } }]
};
let connector8: ConnectorModel = {
    id: 'connector8', sourceID: node7.id, targetID: node2.id, type: 'Orthogonal',
    annotations: [{ content: 'Yes', style: { fill: 'white' } }]
};

let diagram: Diagram = new Diagram({
    width: '850px', height: '700px', nodes: [node1, node2, node3, node4, node5, node6, node7],
    connectors: [connector1, connector2, connector3, connector4, connector5, connector6, connector7, connector8],
    // connector2,connector3, connector4, connector5, connector6, connector7, connector8],
    getCustomProperty: (key: string) => {
        if (key === 'nodes') {
            return ['description'];
        }
        return null;
    }
});
diagram.appendTo('#diagram');


document.getElementById('samesize').onchange = size;
function size() {
    var e = (document.getElementById('samesize')) as HTMLSelectElement;
    let objects: (NodeModel | ConnectorModel)[] = [];
    objects.push(diagram.nodes[0], diagram.nodes[1], diagram.nodes[2], diagram.nodes[3], diagram.nodes[4], diagram.nodes[5], diagram.nodes[6]);
    if (e.value === 'size')
        diagram.sameSize('Size', objects);
    if (e.value === 'width')
        diagram.sameSize('Width', objects);
    if (e.value === 'Height')
        diagram.sameSize('Height', objects);
    diagram.dataBind();
}
let alignObjects: Function = (objects: (NodeModel | ConnectorModel)[], options: AlignmentOptions) => {
    diagram.align(options, objects);
};

document.getElementById('align').onchange = align;
function align() {
    var e = (document.getElementById('align')) as HTMLSelectElement;
    let objects: (NodeModel | ConnectorModel)[] = [];
    objects.push(diagram.nodes[0], diagram.nodes[1], diagram.nodes[2], diagram.nodes[3], diagram.nodes[4], diagram.nodes[5], diagram.nodes[6]);
    if (e.value === 'left')
        alignObjects(objects, 'Left');
    if (e.value === 'right')
        alignObjects(objects, 'Right');
    if (e.value === 'center')
        alignObjects(objects, 'Center');
    if (e.value === 'top')
        alignObjects(objects, 'Top');
    if (e.value === 'bottom')
        alignObjects(objects, 'Bottom');
    if (e.value === 'middle')
        alignObjects(objects, 'Middle');
    diagram.dataBind();
}

function canlog() {
    diagram.historyList.canLog = function (entry: HistoryEntry) {
        entry.cancel = true;
        return entry;
    }
}

let log: any = document.getElementById('log');
log.onclick = selectable;
let oldProp, newProp;
function selectable() {
    if (!log.checked) {
        diagram.historyList.canLog = function (entry: HistoryEntry) {
            entry.cancel = true;
            return entry;
        }
        diagram.dataBind();
    }
    else {
        diagram.historyList.canLog = function (entry: HistoryEntry) {
            entry.cancel = false;
            return entry;
        }
        diagram.dataBind();
    }
}
diagram.historyList.undo = function (args: HistoryEntry) {
    (args.redoObject) = cloneObject(args.undoObject) as NodeModel;
    args.undoObject['description'] = 'Start';
    diagram.dataBind();
    alert(args.undoObject['description']);
}
diagram.historyList.redo = function (args: HistoryEntry) {
    alert(args.redoObject['description']);
    let current: NodeModel = cloneObject(args.undoObject) as NodeModel;
    args.undoObject['description'] = args.redoObject['description'];
    args.redoObject = current;
    diagram.dataBind();

}
let button0 = document.getElementById('update');
button0.onclick = function () {
    let obj = diagram.nodes[0];
    obj['description'] = (document.getElementById('custom') as HTMLSelectElement).value;
    let entry: HistoryEntry = { undoObject: obj };
    diagram.historyList.push(entry);
    diagram.dataBind();
}
let button2 = document.getElementById('change');
button2.onclick = function () {
    let obj = diagram.nameTable[diagram.selectedItems.connectors[0].id];
    obj.sourcePoint.x = Number((document.getElementById('offsetx') as HTMLSelectElement).value);
    obj.sourcePoint.y = Number((document.getElementById('offsety') as HTMLSelectElement).value);
    diagram.clearSelectorLayer();
    diagram.dataBind();
}
let button = document.getElementById('undo');
button.onclick = function () {
    diagram.undo();
}
let button1 = document.getElementById('redo');
button1.onclick = function () {
    diagram.redo();
}

let button3 = document.getElementById('startGroup');
button3.onclick = function () {
    diagram.historyList.startGroupAction();

}

let button4 = document.getElementById('endGroup');
button4.onclick = function () {
    diagram.historyList.endGroupAction();
}

let button5 = document.getElementById('copy');
button5.onclick = function () {
    diagram.copy();

}

let button6 = document.getElementById('paste');
button6.onclick = function () {
    diagram.paste(diagram.copy() as (NodeModel | ConnectorModel)[]);
}

let button7 = document.getElementById('add');
button7.onclick = function () {
    let pathNode: NodeModel = {
        id: 'node', width: 100, height: 100, offsetX: 700, offsetY: 100,
        style: { fill: 'green' },
        shape: {
            type: 'Flow', shape: 'Sort'
        } as FlowShapeModel, ports: [{ id: 'port', shape: 'Square', offset: { x: 0.5, y: 1 } }]
    };
    diagram.add(pathNode);
    diagram.refreshDiagramLayer();
}

let button8 = document.getElementById('remove');
button8.onclick = function () {
    let obj = diagram.nameTable[diagram.selectedItems.nodes[0].id];
    diagram.remove(obj);
    diagram.refreshDiagramLayer();
};