import {
    Diagram, NodeModel, UndoRedo, randomId, ConnectorModel, Connector, Node, BpmnDiagrams,
    StackPanel, TextElement, PortVisibility, PortConstraints
} from '../../src/diagram/index';
Diagram.Inject(UndoRedo);

Diagram.Inject(BpmnDiagrams);

import {
    SymbolPalette, SymbolInfo
} from '../../src/symbol-palette/index';
import { IElement } from '../../src/index';

SymbolPalette.Inject(BpmnDiagrams);
/**
 * Simple symbol palette
 */
let nodes: NodeModel[] = [
    {
        id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,
        annotations: [{ content: 'Default Shape' }]
    },
    {
        id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 100,
        shape: {
            type: 'Path', data: 'M540.3643,137.9336L546.7973,159.7016L570.3633,159.7296L550.7723,171.9366L558.9053,194.9966L540.3643,' +
                '179.4996L521.8223,194.9966L529.9553,171.9366L510.3633,159.7296L533.9313,159.7016L540.3643,137.9336z'
        },
        annotations: [{ content: 'Path Element' }]
    }
];


let connectors: ConnectorModel[] = [{
    id: 'connector1',
    type: 'Straight',
    sourcePoint: { x: 100, y: 300 },
    targetPoint: { x: 200, y: 400 },
}];

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
    }
});
diagram.appendTo('#diagram');


export function getBasicShapes(): NodeModel[] {

    let basicShapes: NodeModel[] = [
        { id: 'Rectangle', shape: { type: 'Basic', shape: 'Rectangle' }, style: { strokeWidth: 2 }, offsetX: 25, offsetY: 25 },
        { id: 'Ellipse', shape: { type: 'Basic', shape: 'Rectangle' }, style: { strokeWidth: 2 }, offsetX: 75, offsetY: 75 },
        { id: 'group', children: ['Rectangle', 'Ellipse'] },
        { id: 'Hexagon', shape: { type: 'Basic', shape: 'Rectangle' }, style: { strokeWidth: 2 }, offsetX: 125, offsetY: 125 },
        { id: 'Hexagon2', shape: { type: 'Basic', shape: 'Hexagon' }, style: { strokeWidth: 2 }, offsetX: 50, offsetY: 50 },
        { id: 'group2', children: ['group', 'Hexagon'] },
        { id: 'group3', children: ['group2', 'Hexagon2'] },
        { id: 'Parallelogram', shape: { type: 'Basic', shape: 'Parallelogram' }, style: { strokeWidth: 2 } },
        { id: 'Triangle', shape: { type: 'Basic', shape: 'Triangle' }, style: { strokeWidth: 2 } },
        { id: 'polygon', shape: { type: 'Basic', shape: 'Polygon', points: [{ x: 0, y: 0 }, { x: 2, y: 2 }] } }
    ];

    return basicShapes;
}

let shapes: NodeModel[] = [{
    id: 'SHAPE_BELL2',
    shape: {
        type: 'Path',
        data: 'M37.5,18.5h0a30,30,0,0,1,30,30v0a30,30,0,0,1-30,30h0a0,0,0,0,1,0,0v-60A0,0,0,0,1,37.5,18.5Z'
    },
    width: 30,
    height: 60,
    offsetX: 52.5,
    offsetY: 48.5
},
{
    id: 'SHAPE_BELL3',
    shape: {
        type: 'Path',
        data: 'M 24 , 48.5 L 37.25 , 48.5'
    },
    width: 13.25,
    height: 1,
    offsetX: 30.625,
    offsetY: 49
},
{
    id: 'SHAPE_BELL',
    children: ['SHAPE_BELL2', 'SHAPE_BELL3']
},
{
    id: 'SHAPE_BUZZER2',
    shape: {
        type: 'Path',
        data: 'M32.5,18.5h0a30,30,0,0,1,30,30v0a30,30,0,0,1-30,30h0a0,0,0,0,1,0,0v-60A0,0,0,0,1,32.5,18.5Z'
    },
    width: 30.000003814697266,
    height: 60,
    offsetX: 47.50000190734863,
    offsetY: 48.5
},
{
    id: 'SHAPE_BUZZER3',
    shape: {
        type: 'Path',
        data: 'M 61 , 39.5 L 76 , 39.5'
    },
    width: 15,
    height: 1,
    offsetX: 68.5,
    offsetY: 40
},
{
    id: 'SHAPE_BUZZER4',
    shape: {
        type: 'Path',
        data: 'M 61 , 57.5 L 76 , 57.5'
    },
    width: 15,
    height: 1,
    offsetX: 68.5,
    offsetY: 58
},
{
    id: 'SHAPE_BUZZER',
    children: ['SHAPE_BUZZER2', 'SHAPE_BUZZER3', 'SHAPE_BUZZER4']
},

{
    id: 'SHAPE_ELECTRET MICROPHONE2',
    shape: {
        type: 'Basic',
        shape: 'Ellipse'
    },
    width: 64,
    height: 64,
    offsetX: 52.5,
    offsetY: 51.5
}, {
    id: 'SHAPE_ELECTRET MICROPHONE3',
    shape: {
        type: 'Path',
        data: 'M 20.5 , 20 L 20.5 , 84'
    },
    width: 1,
    height: 64,
    offsetX: 21,
    offsetY: 52
}, {
    id: 'SHAPE_ELECTRET MICROPHONE4',
    shape: {
        type: 'Path',
        data: 'M 52.5 , 54 L 52.5 , 84'
    },
    width: 1,
    height: 30,
    offsetX: 53,
    offsetY: 69
}, {
    id: 'SHAPE_ELECTRET MICROPHONE5',
    shape: {
        type: 'Path',
        data: 'M 52.5 , 20 L 52.5 , 50'
    },
    width: 1,
    height: 30,
    offsetX: 53,
    offsetY: 35
}, {
    id: 'SHAPE_ELECTRET MICROPHONE6',
    shape: {
        type: 'Path',
        data: 'M 44 , 54.5 L 61 , 54.5'
    },
    width: 17,
    height: 1,
    offsetX: 52.5,
    offsetY: 55
}, {
    id: 'SHAPE_ELECTRET MICROPHONE7',
    shape: {
        type: 'Path',
        data: 'M 44 , 49.5 L 61 , 49.5'
    },
    width: 17,
    height: 1,
    offsetX: 52.5,
    offsetY: 50
}, {
    id: 'SHAPE_ELECTRET MICROPHONE',
    children: ['SHAPE_ELECTRET MICROPHONE2', 'SHAPE_ELECTRET MICROPHONE3', 'SHAPE_ELECTRET MICROPHONE4',
        'SHAPE_ELECTRET MICROPHONE5', 'SHAPE_ELECTRET MICROPHONE6', 'SHAPE_ELECTRET MICROPHONE7'
    ]
},
{
    id: 'SHAPE_HEADPHONES2',
    shape: {
        type: 'Path',
        data: 'M29.5,53a24.5,24.5,0,0,1,49,0'
    },
    width: 49,
    height: 24.49154281616211,
    offsetX: 54,
    offsetY: 40.754228591918945
},
{
    id: 'SHAPE_HEADPHONES3',
    shape: {
        type: 'Basic',
        shape: 'Ellipse'
    },
    width: 12,
    height: 22.139999389648438,
    offsetX: 32.5,
    offsetY: 61.5
},
{
    id: 'SHAPE_HEADPHONES4',
    shape: {
        type: 'Basic',
        shape: 'Ellipse'
    },
    width: 12,
    height: 22.139999389648438,
    offsetX: 75.5,
    offsetY: 61.5
}, {
    id: 'SHAPE_HEADPHONES',
    children: ['SHAPE_HEADPHONES2', 'SHAPE_HEADPHONES3', 'SHAPE_HEADPHONES4']
},
{
    id: 'SHAPE_LOUDSPEAKER2',
    shape: {
        type: 'Path',
        data: 'M49.5 41.5 44.5 41.5 44.5 57.5 49.5 57.5 58.5 68.66 58.5 29.41 49.5 41.5'
    },
    width: 14,
    height: 39.250003814697266,
    offsetX: 51.5,
    offsetY: 49.03500175476074
}, {
    id: 'SHAPE_LOUDSPEAKER3',
    shape: {
        type: 'Path',
        data: 'M 37 , 44.5 L 45 , 44.5'
    },
    width: 8,
    height: 1,
    offsetX: 41,
    offsetY: 45
},
{
    id: 'SHAPE_LOUDSPEAKER4',
    shape: {
        type: 'Path',
        data: 'M 37 , 54.5 L 45 , 54.5'
    },
    width: 8,
    height: 1,
    offsetX: 41,
    offsetY: 55
},
{
    id: 'SHAPE_LOUDSPEAKER5',
    shape: {
        type: 'Path',
        data: 'M 49.5 , 41 L 49.5 , 58'
    },
    width: 1,
    height: 17,
    offsetX: 50,
    offsetY: 49.5
},
{
    id: 'SHAPE_LOUDSPEAKER',
    children: ['SHAPE_LOUDSPEAKER2', 'SHAPE_LOUDSPEAKER3', 'SHAPE_LOUDSPEAKER4', 'SHAPE_LOUDSPEAKER5']
},
{
    id: 'SHAPE_MICROPHONE2',
    shape: {
        type: 'Path',
        data: 'M31.5,17.5h0a30,30,0,0,1,30,30v0a30,30,0,0,1-30,30h0a0,0,0,0,1,0,0v-60A0,0,0,0,1,31.5,17.5Z'
    },
    width: 30.00000762939453,
    height: 60.00000762939453,
    offsetX: 46.500003814697266,
    offsetY: 47.500003814697266
},
{
    id: 'SHAPE_MICROPHONE3',
    shape: {
        type: 'Path',
        data: 'M 61 , 41.5 L 67 , 41.5'
    },
    width: 6,
    height: 1,
    offsetX: 64,
    offsetY: 42
},
{
    id: 'SHAPE_MICROPHONE4',
    shape: {
        type: 'Path',
        data: 'M 61 , 53.5 L 67 , 53.5'
    },
    width: 6,
    height: 1,
    offsetX: 64,
    offsetY: 54
},
{
    id: 'SHAPE_MICROPHONE',
    children: ['SHAPE_MICROPHONE2', 'SHAPE_MICROPHONE3', 'SHAPE_MICROPHONE4']
},
{
    id: 'SHAPE_MICROPHONE12',
    shape: {
        type: 'Path',
        data: 'M 21.5 , 20 L 21.5 , 84'
    },
    width: 1,
    height: 64,
    offsetX: 22,
    offsetY: 52
},
{
    id: 'SHAPE_MICROPHONE13',
    shape: {
        type: 'Basic',
        shape: 'Ellipse'
    },
    width: 64,
    height: 64,
    offsetX: 53.5,
    offsetY: 51.5
},
{
    id: 'SHAPE_MICROPHONE1',
    children: ['SHAPE_MICROPHONE12', 'SHAPE_MICROPHONE13']
},
{
    id: 'SHAPE_PIEZO_SOUNDER2',
    shape: {
        type: 'Basic',
        shape: 'Rectangle'
    },
    width: 16,
    height: 42,
    offsetX: 50,
    offsetY: 50
},
{
    id: 'SHAPE_PIEZO_SOUNDER3',
    shape: {
        type: 'Path',
        data: 'M 62.5 , 29 L 62.5 , 72'
    },
    width: 1,
    height: 43,
    offsetX: 63,
    offsetY: 50.5
},
{
    id: 'SHAPE_PIEZO_SOUNDER4',
    shape: {
        type: 'Path',
        data: 'M 100 , 50.5 L 62 , 50.5'
    },
    width: 38,
    height: 1,
    offsetX: 81,
    offsetY: 51
},
{
    id: 'SHAPE_PIEZO_SOUNDER5',
    shape: {
        type: 'Path',
        data: 'M 39 , 50.5 L 1 , 50.5'
    },
    width: 39,
    height: 1,
    offsetX: 19.5,
    offsetY: 51
},
{
    id: 'SHAPE_PIEZO_SOUNDER6',
    shape: {
        type: 'Path',
        data: 'M 38.5 , 29 L 38.5 , 72'
    },
    width: 1,
    height: 43,
    offsetX: 39,
    offsetY: 50.5
},
{
    id: 'SHAPE_PIEZO_SOUNDER',
    children: ['SHAPE_PIEZO_SOUNDER2', 'SHAPE_PIEZO_SOUNDER3', 'SHAPE_PIEZO_SOUNDER4',
        'SHAPE_PIEZO_SOUNDER5', 'SHAPE_PIEZO_SOUNDER6'
    ]
},
{
    id: 'SHAPE_DIPOLE2',
    shape: {
        type: 'Path',
        data: 'M0 32.5 36.5 32.5 36.5 70'
    },
    width: 36.5,
    height: 37.5,
    offsetX: 18.25,
    offsetY: 51.25,
    style: {
        fill: 'transparent'
    }
}, {
    id: 'SHAPE_DIPOLE3',
    shape: {
        type: 'Path',
        data: 'M99.5 32.5 63 32.5 63 70'
    },
    width: 36.5,
    height: 37.5,
    offsetX: 81.25,
    offsetY: 51.25,
    style: {
        fill: 'transparent'
    }
}, {
    id: 'SHAPE_DIPOLE',
    children: ['SHAPE_DIPOLE2', 'SHAPE_DIPOLE3']
}
];

export function electricShapes(): NodeModel[] {

    let basicShapes: NodeModel[] = shapes;

    return basicShapes;
}





let palette: SymbolPalette = new SymbolPalette({
    expandMode: 'Multiple',
    palettes: [
        { id: 'basic', expanded: true, symbols: electricShapes(), title: 'Basic Shapes' },
    ],
    width: '200px', height: '100%', symbolHeight: 50, symbolWidth: 50,
    symbolPreview: { height: 100, width: 100 },
    getNodeDefaults: setPaletteNodeDefaults,
    symbolMargin: { left: 12, right: 12, top: 12, bottom: 12 },
    getSymbolInfo: (symbol: NodeModel): SymbolInfo => {
        return { fit: true };
    }
});
palette.appendTo('#symbolpalette');


function setPaletteNodeDefaults(node: NodeModel): void {
    if (node.id === 'Terminator' || node.id === 'Process') {
        node.width = 130;
        node.height = 65;
    } else if (node.width === undefined && node.height === undefined) {
        node.width = 50;
        node.height = 50;
    }
    node.ports = [
        { offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw },
        { offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw },
        { offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw },
        { offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw }
    ];
    node.style.strokeColor = '#3A3A3A';
}

document.getElementById('symbolsize').onchange = () => {
    // let checked = (document.getElementById('symbolsize') as HTMLInputElement).checked;
    // palette.symbolWidth = checked ? 80 : undefined;
    // palette.symbolHeight = checked ? 80 : undefined;
    // palette.dataBind();
    diagram.scale(diagram.nodes[4], 4, 1, { x: 0.5, y: 0.5 });
    diagram.dataBind();
};
let shape: NodeModel;
document.getElementById('additem').onclick = () => {
    shape = { id: 'newflow' + randomId(), shape: { type: 'Flow', shape: 'Process' } };
    palette.addPaletteItem('flow', shape);
    palette.dataBind();
};

document.getElementById('removeitem').onclick = () => {
    palette.removePaletteItem('flow', palette.palettes[0].symbols[palette.palettes[0].symbols.length - 1].id);
    palette.dataBind();
};


document.getElementById('customsize').onchange = () => {
    let checked = (document.getElementById('customsize') as HTMLInputElement).checked;
    palette.getSymbolInfo = (symbol: Node | Connector): SymbolInfo => {
        if (symbol.shape.type === 'Bpmn') {
            return { width: 50, height: 50 };
        }
        if (symbol.id === 'decision' || symbol.id === 'start' || symbol.id === 'end') {
            return { width: 100, height: 40 };
        }
        return { width: 75, height: 40 };
    };
    palette.dataBind();
};

document.getElementById('description').onchange = () => {
    let checked = (document.getElementById('customsize') as HTMLInputElement).checked;
    palette.getSymbolInfo = (symbol: Node | Connector): SymbolInfo => {
        if (symbol['text'] !== undefined) {
            return { width: 75, height: 40, description: { text: symbol['text'], overflow: 'Wrap' } };
        }
        if (symbol.shape.type === 'Bpmn') {
            return { width: 50, height: 50, description: { text: symbol.shape['shape'] } };
        }
        if (symbol.id === 'decision' || symbol.id === 'start' || symbol.id === 'end') {
            return { width: 100, height: 40, description: { text: symbol.shape['shape'] } };
        }
        return { width: 75, height: 40, description: { text: symbol.shape['shape'] } };
    };
    palette.dataBind();
};
document.getElementById('fit').onchange = () => {
    let checked = (document.getElementById('customsize') as HTMLInputElement).checked;
    palette.getSymbolInfo = (symbol: Node | Connector): SymbolInfo => {
        if (symbol.shape.type === 'Bpmn') {
            return { width: 50, height: 50, description: { text: symbol.shape['shape'] } };
        }
        if (symbol.id === 'decision' || symbol.id === 'start' || symbol.id === 'end') {
            return { width: 100, height: 40, fit: true, description: { text: symbol.shape['shape'] } };
        }
        return { width: 75, height: 40, fit: true, description: { text: symbol.shape['shape'] } };
    };
    palette.dataBind();
};
