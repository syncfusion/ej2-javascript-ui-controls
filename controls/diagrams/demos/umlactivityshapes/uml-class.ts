import {
    Diagram, NodeModel, ConnectorModel, UmlActivityShapeModel, UmlActivityFlows
} from '../../src/diagram/index';


import {
    SymbolPalette, SymbolInfo
} from '../../src/symbol-palette/index';
import { UmlClassifierShapeModel, UndoRedo } from '../../src/index';
Diagram.Inject(UndoRedo);
/**
 * UMLActivity
 */
// let node: NodeModel = {
//     id: 'node',
//     width: 90,
//     height: 90,
//     offsetX: 100,
//     offsetY: 100, annotations: [{ content: 'Action' }],
//     shape: { type: 'UmlActivity', shape: 'Action' },
// };

let node1: NodeModel = {
    id: 'node1',
    offsetX: 100,
    offsetY: 100, style: {
        fill: '#26A0DA',
    }, borderColor: 'white'
    ,
    shape: {
        type: 'UmlClassifier',
        classShape: {
            property: [
                { name: 'accepted', type: 'Date', style: {} },
                { name: 'sickness', type: 'History' },
                { name: 'prescription', type: 'String[*]' },
                { name: 'allergies', type: 'String[*]' }
            ], methods: [{ name: 'getHistory', style: {}, parameters: [{ name: 'Date', style: {} }], type: 'History' }],
            name: 'Patient'
        },
        classifier: 'Class'
    } as UmlClassifierShapeModel,
};


let node2: NodeModel = {
    id: 'node2',
    offsetX: 300,
    offsetY: 200, style: {
        fill: '#26A0DA',
    }, borderColor: 'white',
    shape: {
        type: 'UmlClassifier',
        enumerationShape: {
            name: 'AccountType',
            //sets the members of enumeration
            members: [
                {
                    name: 'Checking Account', style: {}
                },
                {
                    name: 'Savings Account'
                },
                {
                    name: 'Credit Account'
                }]
        },
        classifier: 'Enumeration'
    } as UmlClassifierShapeModel,

};

let node3: NodeModel = {
    id: 'node3',
    offsetX: 400,
    offsetY: 300, style: {
        fill: '#26A0DA',
    }, borderColor: 'white',
    shape: {
        type: 'UmlClassifier',
        interfaceShape: {
            name: "Bank Account",
            property: [{
                name: "owner",
                type: "String[*]", style: {}
            },
            {
                name: "balance",
                type: "Dollars"
            }],
            methods: [{
                name: "deposit", style: {},
                parameters: [{
                    name: "amount",
                    type: "Dollars",
                    style: {}
                }],
            }]
        },
        classifier: 'Interface'
    } as UmlClassifierShapeModel,
};
let diagram: Diagram = new Diagram({
    width: 1000, height: 600,
    nodes: [node1, node2, node3],
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
        { id: 'UmlActivity', expanded: true, symbols: getUMLActivityShapes(), title: 'UMLActivity Shapes' },
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

