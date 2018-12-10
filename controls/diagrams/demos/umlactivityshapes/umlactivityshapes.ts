import {
    Diagram, NodeModel, ConnectorModel, UmlActivityShapeModel, UmlActivityFlows
} from '../../src/diagram/index';


import {
    SymbolPalette, SymbolInfo
} from '../../src/symbol-palette/index';

/**
 * UMLActivity
 */
let node: NodeModel = {
    id: 'node',
    width: 90,
    height: 90,
    offsetX: 100,
    offsetY: 100, annotations: [{ content: 'Action' }],
    shape: { type: 'UmlActivity', shape: 'Action' },
};
let node1: NodeModel = { shape: {} };
node1.id = 'node1';
node1.width = 90;
node1.height = 90; node1.annotations = [{ content: 'Decision' }];
node1.offsetX = 300;
node1.offsetY = 100;
node1.shape = { type: 'UmlActivity', shape: 'Decision' };

let node2: NodeModel = { shape: {} };
node2.id = 'node2';
node2.width = 90;
node2.height = 90; node2.annotations = [{ content: 'MergeNode' }];
node2.offsetX = 500;
node2.offsetY = 100;
node2.shape = { type: 'UmlActivity', shape: 'MergeNode' };

let node3: NodeModel = { shape: {} };
node3.id = 'node3';
node3.width = 90;
node3.height = 90; node3.annotations = [{ content: 'InitialNode' }];
node3.offsetX = 700;
node3.offsetY = 100;
node3.shape = { type: 'UmlActivity', shape: 'InitialNode' };

let node4: NodeModel = { shape: {} };
node4.id = 'node4';
node4.width = 90;
node4.style = { fill: 'red', strokeColor: 'green' }
node4.height = 90; node4.annotations = [{ content: 'FinalNode' }];
node4.offsetX = 900;
node4.offsetY = 100;
node4.shape = { type: 'UmlActivity', shape: 'FinalNode' };


let node5: NodeModel = { shape: {} };
node5.id = 'node5'; node5.annotations = [{ content: 'ForkNode' }];
node5.offsetX = 1100;
node5.offsetY = 100;
node5.shape = { type: 'UmlActivity', shape: 'ForkNode' };

let node6: NodeModel = { shape: {} };
node6.id = 'node6'; node6.annotations = [{ content: 'JoinNode' }];
node6.offsetX = 100;
node6.offsetY = 300;
node6.shape.type = 'UmlActivity';
node6.shape = { type: 'UmlActivity', shape: 'JoinNode' };

let node7: NodeModel = { shape: {} };
node7.id = 'node7';
node7.width = 90;
node7.height = 90; node7.annotations = [{ content: 'TimeEvent' }];
node7.offsetX = 300;
node7.offsetY = 300;
node7.shape = { type: 'UmlActivity', shape: 'TimeEvent' };

let node8: NodeModel = { shape: {} };
node8.id = 'node8';
node8.width = 90; node8.style = { fill: 'red', strokeColor: 'green' }

node8.height = 90; node8.annotations = [{ content: 'AcceptingEvent' }];
node8.offsetX = 500;
node8.offsetY = 300;
node8.shape = { type: 'UmlActivity', shape: 'AcceptingEvent' };

let node9: NodeModel = { shape: {} };
node9.id = 'node9';
node9.width = 90;
node9.height = 90; node9.annotations = [{ content: 'SendSignal' }];
node9.offsetX = 700;
node9.offsetY = 300;
node9.shape = { type: 'UmlActivity', shape: 'SendSignal' };

let node10: NodeModel = { shape: {} };
node10.id = 'node10';
node10.width = 90;
node10.height = 90; node10.annotations = [{ content: 'ReceiveSignal' }];
node10.offsetX = 900;
node10.offsetY = 300;
node10.shape = { type: 'UmlActivity', shape: 'ReceiveSignal' };

let node11: NodeModel = { shape: {} };
node11.id = 'node11';
node11.width = 90;
node11.height = 90; node11.annotations = [{ content: 'StructuredNode' }];
node11.offsetX = 1100;
node11.offsetY = 300;
node11.shape = { type: 'UmlActivity', shape: 'StructuredNode' };

let node12: NodeModel = { shape: {} };
node12.id = 'node12';
node12.width = 90;
node12.height = 90; node12.annotations = [{ content: 'Note' }];
node12.offsetX = 100;
node12.offsetY = 500;
node12.shape = { type: 'UmlActivity', shape: 'Note' };

let connectors: ConnectorModel[] = [
    {
        id: 'connector1', style: { fill: 'red', strokeColor: 'yellow', strokeWidth: 5 },
        type: 'Straight',
        sourcePoint: { x: 100, y: 700 },
        targetPoint: { x: 200, y: 800 },
        shape: { type: 'UmlActivity', flow: 'Object' }
    },
    {
        id: 'connector2', type: 'Straight', sourcePoint: { x: 300, y: 700 }, style: { fill: 'red', strokeColor: 'yellow', strokeWidth: 5 },
        targetPoint: { x: 400, y: 800 },
        shape: { type: 'UmlActivity', flow: 'Control' }
    },
    {
        id: 'connector3', type: 'Straight', style: { fill: 'red', strokeDashArray: ' 2 3', strokeColor: 'yellow', strokeWidth: 5 },
        sourcePoint: { x: 500, y: 700 },
        targetPoint: { x: 600, y: 800 },
        shape: { type: 'UmlActivity', flow: 'Exception' }
    },

];
let diagram: Diagram = new Diagram({
    width: 1000, height: 600,
    nodes: [node, node1, node2, node3, node4, node5, node6, node7, node8, node9, node10, node11, node12],
    connectors: connectors,
});
diagram.appendTo('#diagram');


export function getUMLActivityShapes(): NodeModel[] {

    let umlActivitySymbols: NodeModel[] = [
        { id: 'Action', shape: { type: 'UmlActivity', shape: 'Action' }, annotations: [{ content: 'FinalNode' }] },
        { id: 'Decision', shape: { type: 'UmlActivity', shape: 'Decision' } },
        { id: 'MergeNode', shape: { type: 'UmlActivity', shape: 'MergeNode' } },
        { id: 'InitialNode', shape: { type: 'UmlActivity', shape: 'InitialNode' } },
        { id: 'FinalNode', shape: { type: 'UmlActivity', shape: 'FinalNode' } },
        { id: 'ForkNode', shape: { type: 'UmlActivity', shape: 'ForkNode' } },
        { id: 'JoinNode', shape: { type: 'UmlActivity', shape: 'JoinNode' } },
        { id: 'TimeEvent', shape: { type: 'UmlActivity', shape: 'TimeEvent' } },
        { id: 'AcceptingEvent', shape: { type: 'UmlActivity', shape: 'AcceptingEvent' } },
        { id: 'SendSignal', shape: { type: 'UmlActivity', shape: 'SendSignal' } },
        { id: 'ReceiveSignal', shape: { type: 'UmlActivity', shape: 'ReceiveSignal' } },
        { id: 'StructuredNode', shape: { type: 'UmlActivity', shape: 'StructuredNode' } },
        { id: 'Note', shape: { type: 'UmlActivity', shape: 'Note' } },
    ];
    return umlActivitySymbols;
}
export function getUMLActivityFlowShapes(): ConnectorModel[] {

    let umlActivityFlowSymbols: ConnectorModel[] = [
        {
            id: 'controlFlow', sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 40, y: 40 },
            shape: { type: 'UmlActivity', flow: 'Object' }
        },
        {
            id: 'objectFlow', sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 40, y: 40 },
            shape: { type: 'UmlActivity', flow: 'Control' }
        },
        {
            id: 'ExceptionFlow', sourcePoint: { x: 0, y: 10 }, targetPoint: { x: 40, y: 100 },
            shape: { type: 'UmlActivity', flow: 'Exception' }
        },
    ];
    return umlActivityFlowSymbols;
}

function setPaletteNodeDefaults(node: NodeModel): void {
    if ((node.shape as UmlActivityShapeModel).shape === 'JoinNode') {
        node.width = 20;
        node.height = 70;
    } else if ((node.shape as UmlActivityShapeModel).shape === 'ForkNode') {
        node.width = 70;
        node.height = 20;
    } else {
        node.width = 100;
        node.height = 100;
    }

}
let palette: SymbolPalette = new SymbolPalette({
    expandMode: 'Multiple',
    palettes: [
        { id: 'umlActivity', expanded: true, symbols: getUMLActivityShapes(), title: 'UMLActivity Shapes' },
        { id: 'umlActivityFlow', expanded: true, symbols: getUMLActivityFlowShapes(), title: 'UMLActivity Flow Shapes' },

    ], getNodeDefaults: setPaletteNodeDefaults,
    width: '100%', height: '100%', symbolHeight: 50, symbolWidth: 50,
    symbolPreview: { height: 100, width: 100 },
    enableSearch: true,
    symbolMargin: { left: 12, right: 12, top: 12, bottom: 12 },
    getSymbolInfo: (symbol: NodeModel): SymbolInfo => {
        return { fit: true };
    }
});
palette.appendTo('#symbolpalette');

