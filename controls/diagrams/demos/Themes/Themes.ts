import {
    Diagram, NodeModel, UndoRedo, ConnectorModel, NodeConstraints, Connector, Node, BpmnDiagrams, StackPanel, DiagramElement, TextElement
} from '../../src/diagram/index';
Diagram.Inject(UndoRedo);

Diagram.Inject(BpmnDiagrams);

import {
    SymbolPalette, SymbolInfo
} from '../../src/symbol-palette/index';
SymbolPalette.Inject(BpmnDiagrams);
/**
 * Simple symbol palette
 */
let nodes: NodeModel[] = [
    {
        id: 'node11', width: 100, height: 100, offsetX: 100, offsetY: 100,
        annotations: [{ content: 'Default Shape' }]
    },
    {
        id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 100,
        shape: {
            type: 'Path', data: 'M540.3643,137.9336L546.7973,159.7016L570.3633,159.7296L550.7723,171.9366L558.9053,194.9966L540.3643,' +
                '179.4996L521.8223,194.9966L529.9553,171.9366L510.3633,159.7296L533.9313,159.7016L540.3643,137.9336z'
        },
        annotations: [{ content: 'Path Element' }]
    },
    {
        id: 'node3', width: 100, height: 100, offsetX: 500, offsetY: 100,
        constraints: NodeConstraints.PointerEvents | NodeConstraints.Select,
        shape: {
            type: 'Path', data: 'M540.3643,137.9336L546.7973,159.7016L570.3633,159.7296L550.7723,171.9366L558.9053,194.9966L540.3643,' +
                '179.4996L521.8223,194.9966L529.9553,171.9366L510.3633,159.7296L533.9313,159.7016L540.3643,137.9336z'
        },
        annotations: [{ content: 'Path Element' }]
    }
];


let connectors: ConnectorModel[] = [
    {
        id: 'connector1',
        type: 'Straight', hitPadding: 30,
        // sourceDecorator: {
        //     hitPadding: 30
        // },
        // targetDecorator: {
        //     hitPadding: 30
        // },
        sourcePoint: { x: 100, y: 300 },
        targetPoint: { x: 200, y: 400 },
    },
    {
        id: 'connector2',
        type: 'Bezier', hitPadding: 30,
        // sourceDecorator: {
        //     hitPadding: 30
        // },
        // targetDecorator: {
        //     hitPadding: 30
        // },
        sourcePoint: { x: 300, y: 300 },
        targetPoint: { x: 400, y: 400 },
    },
    {
        id: 'connector3',
        type: 'Straight',
        sourceID: 'node1',
        targetID: 'node2',
    },
];

let flowshapes: NodeModel[] = [{ id: 'start', shape: { type: 'Flow', shape: 'Terminator' } },
{ id: 'process', shape: { type: 'Flow', shape: 'Process' } },
{ id: 'decision', shape: { type: 'Flow', shape: 'Decision' } },
{ id: 'data', shape: { type: 'Flow', shape: 'Data' } },
{ id: 'end', shape: { type: 'Flow', shape: 'Terminator' } }];

let bpmnShapes: NodeModel[] = [{
    id: 'node2a', width: 100, height: 100, offsetX: 500, offsetY: 100,
    shape: { type: 'Bpmn', shape: 'DataObject', dataObject: { collection: false, type: 'None' } }
},
{
    id: 'node1b', width: 100, height: 100, offsetX: 300, offsetY: 100,
    shape: {
        type: 'Bpmn', shape: 'Activity',
        activity: { activity: 'SubProcess', subProcess: { type: 'Transaction' } }
    }
}];

let connectorSymbols: ConnectorModel[] = [{
    id: 'connector1a', type: 'Straight',
    sourcePoint: { x: 20, y: 20 }, targetPoint: { x: 15, y: 15 },
}];

let grids: NodeModel[] = [{
    id: 'grid', width: 100, height: 100
}];

let svgNodes: NodeModel[] = [{
    id: 'native', width: 100, height: 100, shape: {
        type: 'Native',
        content: '<g><style xmlns=http://www.w3.org/2000/svg type=text/css>.st051{fill:#CBC4C9;}.st152{fill:#E5DCE1;}.st252{fill:#DBD5DA;}.st3552{fill:#69696B;}</style><g xmlns=http://www.w3.org/2000/svg>    <path class=st051 d=M2.8,37L18,44.3c5,2.4,10.8,2.3,15.6-0.3l13.6-7.3c1.7-0.9,2.3-5.6,1.9-7c0,0.1,0.1,0.3,0.1,0.4v-4.3   c0.1,1.6-0.8,3.1-2.3,3.7l0,0l-13.1-6.9c-5.5-2.9-12-2.9-17.5,0L3.2,29.8c-1.3-0.5-2.3-1.7-2.5-3.2v6.7 />    <path class=st152 d=M18.2,37.2l-15-7.3c-1.7-0.7-2.6-2.7-1.9-4.4c0.3-0.8,0.9-1.4,1.7-1.8l13.6-7.2c5.4-2.8,11.9-2.8,17.3,0   l13.2,7c1.7,0.8,2.5,2.9,1.7,4.6c-0.3,0.8-1,1.4-1.7,1.7L33.6,37C28.8,39.5,23.1,39.6,18.2,37.2z />    <path class=st252 d=M25.5,39.2c-2.7,0-5.3-0.6-7.7-1.8L2.6,30.1c-1.1-0.6-1.9-1.6-2.3-2.8l1-0.3C1.6,28,2.2,28.7,3,29.2l15.2,7.4   c4.8,2.3,10.5,2.2,15.2-0.3L47,29c0.9-0.5,1.6-1.4,1.8-2.4l1,0.1c-0.2,1.4-1.1,2.5-2.3,3.1l-13.7,7.3   C31.3,38.5,28.4,39.2,25.5,39.2z />    <path class=st3552 d=M26,46.1c-0.7,0-1.4,0-2.2-0.1c-2.3-0.3-4.6-1-6.8-2l-9.1-4.4L4.8,38H4.6c-1-0.4-1.9-1-2.7-1.8   c-0.7-0.8-1.2-1.8-1.5-2.8c-0.2-0.6-0.2-1.2-0.2-1.8V28l0,0c0,0,0-0.1,0-0.3c0.2-2.3,1.5-4.4,3.6-5.5l12.4-6.6c5.6-3,12.4-3,18-0.1   l13.3,7c1.5,1,2.4,2.7,2.3,4.5l-0.1,5.2c0,2.1-1.2,4-3.1,4.9L33,44.5C30.8,45.6,28.4,46.2,26,46.1z M25.2,14.3   c-3,0-5.9,0.7-8.6,2.1L4.2,23.1c-1.7,0.9-2.9,2.7-3,4.6c0,0.1,0,0.2,0,0.2v3.6c0,0.5,0.1,1,0.2,1.5C1.6,34,2,34.8,2.6,35.5   c0.7,0.7,1.5,1.2,2.4,1.6l0.2,0.1l3.2,1.5l9.1,4.4c2,1,4.2,1.6,6.5,1.9c2.9,0.4,5.9-0.1,8.6-1.4l13.7-7.3c1.5-0.8,2.5-2.3,2.5-4   l0.1-5.2c0.1-1.5-0.6-2.9-1.8-3.6l-13.3-7C31.1,15.1,28.2,14.3,25.2,14.3L25.2,14.3z />    <path class=st3552 d=M4,33.5c0,0.5-0.2,0.8-0.5,0.8S2.8,34,2.8,33.5s0.2-0.8,0.5-0.8S4,33,4,33.5z />    <path class=st3552 d=M7,35.1c0,0.5-0.2,0.8-0.5,0.8s-0.6-0.3-0.7-0.8s0.2-0.8,0.5-0.8S6.9,34.7,7,35.1z />    <path class=st3552 d=M9.9,36.7c0,0.5-0.2,0.8-0.5,0.8s-0.6-0.3-0.7-0.8s0.2-0.8,0.5-0.8S9.9,36.3,9.9,36.7z />    <path class=st3552 d=M17.6,40.2c0,0.6-0.3,1.1-0.7,1.1s-0.8-0.5-0.9-1.1s0.3-1.1,0.7-1.1S17.6,39.6,17.6,40.2z />    <path class=st3552 d=M32,15.2l0.4-12.7c0-0.6,0.5-1.1,1.1-1.1c0.2,0,0.3,0,0.5,0.1l0,0c0.4,0.2,0.6,0.5,0.6,0.9L35,16.5L32,15.2z /></g></g>',
        text: 'Element for Network Diagram'
    } as NodeModel
}];

let getTextElement: Function = (text: string) => {
    let textElement: TextElement = new TextElement();
    textElement.width = 50;
    textElement.height = 20;
    textElement.content = text;
    return textElement;
};

let addRows: Function = (column: StackPanel) => {
    column.children.push(getTextElement('Row1'));
    column.children.push(getTextElement('Row2'));
    column.children.push(getTextElement('Row3'));
    column.children.push(getTextElement('Row4'));
};

let getNodeTemplate: Function = (symbol: NodeModel) => {
    if (symbol.id.indexOf('grid') !== -1) {
        let table: StackPanel = new StackPanel();
        table.orientation = 'Horizontal';

        let column1: StackPanel = new StackPanel();
        column1.children = [];
        column1.children.push(getTextElement('Column1'));
        addRows(column1);

        let column2: StackPanel = new StackPanel();
        column2.children = [];
        column2.children.push(getTextElement('Column2'));
        addRows(column2);

        table.children = [column1, column2];
        return table;
    }
    return null;
};

let diagram: Diagram = new Diagram({
    width: '74%', height: '600px',
    connectors: connectors, nodes: nodes,
    pageSettings: {
        background: { color: 'transparent' }
    },
    setNodeTemplate: (node: NodeModel) => {
        return getNodeTemplate(node);
    },

    rulerSettings: {
        showRulers: true
    }
});
diagram.appendTo('#diagram');



let palette: SymbolPalette = new SymbolPalette({
    expandMode: 'Multiple',
    palettes: [
        { id: 'flow', expanded: true, symbols: flowshapes, iconCss: 'shapes', title: 'Flow Shapes' },
        { id: 'bpmn', expanded: true, symbols: bpmnShapes, iconCss: 'shapes', title: 'BPMN Shapes' },
        { id: 'grids', expanded: true, symbols: grids, iconCss: 'shapes', title: 'Grids' },
        { id: 'native', expanded: true, symbols: svgNodes, iconCss: 'shapes', title: 'Native Elements' },
        { id: 'connectors', expanded: true, symbols: connectorSymbols, iconCss: 'shapes', title: 'Connectors' }
    ],
    getSymbolTemplate: (symbol: NodeModel): DiagramElement => {
        return getNodeTemplate(symbol);
    },
    width: '25%', height: '550px'
});
palette.appendTo('#symbolpalette');
document.getElementById('Theme').onchange = Theme;
function Theme(): void {
    var cssLinkIndex;
    var e = (document.getElementById('Theme')) as HTMLSelectElement;
    var oldlink = document.getElementsByTagName("link").item(cssLinkIndex);
    var value = e.value;
    var newlink = document.createElement("link");
    newlink.setAttribute("rel", "stylesheet");
    newlink.setAttribute("type", "text/css");
    newlink.setAttribute("href", value);
    document.getElementsByTagName("head").item(0).replaceChild(newlink, oldlink);
}
