import {
    Diagram, NodeModel, UndoRedo, randomId, ConnectorModel, Connector, Node, BpmnDiagrams, StackPanel, DiagramElement, TextElement, PortVisibility, PortConstraints
} from '../../src/diagram/index';
Diagram.Inject(UndoRedo);
import { ExpandMode } from '@syncfusion/ej2-navigations';
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
    width: '100%', height: '500px',
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
        { id: 'Rectangle', shape: { type: 'Basic', shape: 'Rectangle' }, style: { strokeWidth: 2 } },
        { id: 'Ellipse', shape: { type: 'Basic', shape: 'Ellipse' }, style: { strokeWidth: 2 } },
        { id: 'Hexagon', shape: { type: 'Basic', shape: 'Hexagon' }, style: { strokeWidth: 2 } },
        { id: 'Parallelogram', shape: { type: 'Basic', shape: 'Parallelogram' }, style: { strokeWidth: 2 } },
        { id: 'Triangle', shape: { type: 'Basic', shape: 'Triangle' }, style: { strokeWidth: 2 } },
        { id: 'Plus', shape: { type: 'Basic', shape: 'Plus' }, style: { strokeWidth: 2 } },
        { id: 'Star', shape: { type: 'Basic', shape: 'Star' }, style: { strokeWidth: 2 } },
        { id: 'Pentagon', shape: { type: 'Basic', shape: 'Pentagon' }, style: { strokeWidth: 2 } },
        { id: 'Heptagon', shape: { type: 'Basic', shape: 'Heptagon' }, style: { strokeWidth: 2 } },
        { id: 'Octagon', shape: { type: 'Basic', shape: 'Octagon' }, style: { strokeWidth: 2 } },
        { id: 'Trapezoid', shape: { type: 'Basic', shape: 'Trapezoid' }, style: { strokeWidth: 2 } },
        { id: 'Decagon', shape: { type: 'Basic', shape: 'Decagon' }, style: { strokeWidth: 2 } },
        { id: 'RightTriangle', shape: { type: 'Basic', shape: 'RightTriangle' }, style: { strokeWidth: 2 } },
        { id: 'Cylinder', shape: { type: 'Basic', shape: 'Cylinder' }, style: { strokeWidth: 2 } },
        { id: 'Diamond', shape: { type: 'Basic', shape: 'Diamond' }, style: { strokeWidth: 2 } },
    ];

    return basicShapes;
}

export function getFlowShapes(): NodeModel[] {

    let flowShapes: NodeModel[] = [
        { id: 'Terminator', shape: { type: 'Flow', shape: 'Terminator' }, style: { strokeWidth: 2 } },
        { id: 'Process', shape: { type: 'Flow', shape: 'Process' }, style: { strokeWidth: 2 } },
        { id: 'Decision', shape: { type: 'Flow', shape: 'Decision' }, style: { strokeWidth: 2 } },
        { id: 'Document', shape: { type: 'Flow', shape: 'Document' }, style: { strokeWidth: 2 } },
        { id: 'PreDefinedProcess', shape: { type: 'Flow', shape: 'PreDefinedProcess' }, style: { strokeWidth: 2 } },
        { id: 'PaperTap', shape: { type: 'Flow', shape: 'PaperTap' }, style: { strokeWidth: 2 } },
        { id: 'DirectData', shape: { type: 'Flow', shape: 'DirectData' }, style: { strokeWidth: 2 } },
        { id: 'SequentialData', shape: { type: 'Flow', shape: 'SequentialData' }, style: { strokeWidth: 2 } },
        { id: 'Sort', shape: { type: 'Flow', shape: 'Sort' }, style: { strokeWidth: 2 } },
        { id: 'MultiDocument', shape: { type: 'Flow', shape: 'MultiDocument' }, style: { strokeWidth: 2 } },
        { id: 'Collate', shape: { type: 'Flow', shape: 'Collate' }, style: { strokeWidth: 2 } },
        { id: 'SummingJunction', shape: { type: 'Flow', shape: 'SummingJunction' }, style: { strokeWidth: 2 } },
        { id: 'Or', shape: { type: 'Flow', shape: 'Or' }, style: { strokeWidth: 2 } },
        { id: 'InternalStorage', shape: { type: 'Flow', shape: 'InternalStorage' }, style: { strokeWidth: 2 } },
        { id: 'Extract', shape: { type: 'Flow', shape: 'Extract' }, style: { strokeWidth: 2 } },
        { id: 'ManualOperation', shape: { type: 'Flow', shape: 'ManualOperation' }, style: { strokeWidth: 2 } },
        { id: 'Merge', shape: { type: 'Flow', shape: 'Merge' }, style: { strokeWidth: 2 } },
        { id: 'OffPageReference', shape: { type: 'Flow', shape: 'OffPageReference' }, style: { strokeWidth: 2 } },
        { id: 'SequentialAccessStorage', shape: { type: 'Flow', shape: 'SequentialAccessStorage' }, style: { strokeWidth: 2 } },
        { id: 'Annotation', shape: { type: 'Flow', shape: 'Annotation' }, style: { strokeWidth: 2 } },
        { id: 'Annotation2', shape: { type: 'Flow', shape: 'Annotation2' }, style: { strokeWidth: 2 } },
        { id: 'data', shape: { type: 'Flow', shape: 'Data' }, style: { strokeWidth: 2 } },
        { id: 'Card', shape: { type: 'Flow', shape: 'Card' }, style: { strokeWidth: 2 } },
        { id: 'Delay', shape: { type: 'Flow', shape: 'Delay' }, style: { strokeWidth: 2 } },
        { id: 'Preparation', shape: { type: 'Flow', shape: 'Preparation' }, style: { strokeWidth: 2 } },
        { id: 'Display', shape: { type: 'Flow', shape: 'Display' }, style: { strokeWidth: 2 } },
        { id: 'ManualInput', shape: { type: 'Flow', shape: 'ManualInput' }, style: { strokeWidth: 2 } },
        { id: 'LoopLimit', shape: { type: 'Flow', shape: 'LoopLimit' }, style: { strokeWidth: 2 } },
        { id: 'StoredData', shape: { type: 'Flow', shape: 'StoredData' }, style: { strokeWidth: 2 } }
    ];

    return flowShapes;
}

export function getBPMNShapes(): NodeModel[] {

    let bpmnShapes: NodeModel[] = [
        {
            id: 'BPMNStart', style: { strokeWidth: 2 }, shape: { type: 'Bpmn', shape: 'Event', event: { event: 'Start', trigger: 'None' } },
        },
        {
            id: 'Intermediate', style: { strokeWidth: 2 }, shape: { type: 'Bpmn', shape: 'Event', event: { event: 'Intermediate', trigger: 'None' } },
        },
        {
            id: 'End', style: { strokeWidth: 2 }, shape: { type: 'Bpmn', shape: 'Event', event: { event: 'End', trigger: 'None' } },
        },
        {
            id: 'Gateway', style: { strokeWidth: 2 }, shape: { type: 'Bpmn', shape: 'Gateway' }
        },
        {
            id: 'Task', style: { strokeWidth: 2 }, shape: { type: 'Bpmn', shape: 'Activity', activity: { activity: 'Task' } }
        },
        {
            id: 'SubProcessEventBased', style: { strokeWidth: 2 }, shape: {
                type: 'Bpmn', shape: 'Activity', activity: {
                    activity: 'SubProcess',
                    subProcess: { type: 'Transaction', transaction: { success: { visible: false }, failure: { visible: false }, cancel: { visible: false } } }
                },
            },
        },
        {
            id: 'Message', style: { strokeWidth: 2 }, shape: { type: 'Bpmn', shape: 'Message' }
        },
        {
            id: 'DataObject', style: { strokeWidth: 2 }, shape: { type: 'Bpmn', shape: 'DataObject' }
        },
        {
            id: 'DataSource', style: { strokeWidth: 2 }, shape: { type: 'Bpmn', shape: 'DataSource' }
        },
        {
            id: 'Activity', style: { strokeWidth: 2 }, shape: { type: 'Bpmn', shape: 'Activity' }
        },
        {
            id: 'Group', style: { strokeWidth: 2 }, shape: { type: 'Bpmn', shape: 'Group' }
        },
        // {
        //     id: 'sequenceFlow', shape: { type: 'Bpmn', shape: '' }
        // }
    ];

    return bpmnShapes;
}

export function getConnectors(): ConnectorModel[] {

    let connectorSymbols: ConnectorModel[] = [
        {
            id: 'Link1', type: 'Orthogonal', sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 40, y: 40 },
            targetDecorator: { shape: 'Arrow' }, style: { strokeWidth: 2 }
        },
        {
            id: 'Link2', type: 'Orthogonal', sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 40, y: 40 },
            targetDecorator: { shape: 'Arrow' }, style: { strokeWidth: 2, strokeDashArray: '4 4' }
        },
        {
            id: 'link3', type: 'Orthogonal', sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 40, y: 40 },
            style: { strokeWidth: 2 }, targetDecorator: { shape: 'None' }
        },
        {
            id: 'Link4', type: 'Orthogonal', sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 40, y: 40 },
            style: { strokeWidth: 2, strokeDashArray: '4 4' }, targetDecorator: { shape: 'None' }
        },
        {
            id: 'Link21', type: 'Straight', sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 40, y: 40 },
            targetDecorator: { shape: 'Arrow' }, style: { strokeWidth: 2 }
        },
        {
            id: 'Link22', type: 'Straight', sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 40, y: 40 },
            targetDecorator: { shape: 'Arrow' }, style: { strokeWidth: 2, strokeDashArray: '4 4' }
        },
        {
            id: 'link23', type: 'Straight', sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 40, y: 40 },
            style: { strokeWidth: 2 }, targetDecorator: { shape: 'None' }
        },
        {
            id: 'Link24', type: 'Straight', sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 40, y: 40 },
            style: { strokeWidth: 2, strokeDashArray: '4 4' }, targetDecorator: { shape: 'None' }
        },
        {
            id: 'link33', type: 'Bezier', sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 40, y: 40 },
            style: { strokeWidth: 2 }, targetDecorator: { shape: 'None' }
        },
        {
            id: 'Link34', type: 'Bezier', sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 40, y: 40 },
            style: { strokeWidth: 2, strokeDashArray: '4 4' }, targetDecorator: { shape: 'None' }
        }
    ];

    return connectorSymbols;
}


let palette: SymbolPalette = new SymbolPalette({
    expandMode: 'Multiple',
    palettes: [
        //{ id: 'scratchpad', expanded: true, symbols: [], iconCss: 'ej-icon-New scratch-pad', title: 'Scratchpad' },
        { id: 'flow', expanded: true, symbols: getFlowShapes(), title: 'Flow Shapes' },
        { id: 'basic', expanded: true, symbols: getBasicShapes(), title: 'Basic Shapes' },
        { id: 'bpmn', expanded: true, symbols: getBPMNShapes(), title: 'BPMN Shapes' },
        { id: 'connectors', expanded: true, symbols: getConnectors(), title: 'Connectors' }
    ],
    width: '100%', height: '100%', symbolHeight: 50, symbolWidth: 50,
    symbolPreview: { height: 100, width: 100 },
    enableSearch: true,
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
    } else {
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
    let checked = (document.getElementById('symbolsize') as HTMLInputElement).checked;
    palette.symbolWidth = checked ? 80 : undefined;
    palette.symbolHeight = checked ? 80 : undefined;
    palette.dataBind();
};
document.getElementById('animation').onchange = () => {
    let checked = (document.getElementById('animation') as HTMLInputElement).checked;
    palette.enableAnimation = checked;
    palette.dataBind();
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


document.getElementById('expand').onchange = () => {
    let checked = (document.getElementById('expand') as HTMLInputElement).value;
    palette.expandMode = checked as ExpandMode;
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
