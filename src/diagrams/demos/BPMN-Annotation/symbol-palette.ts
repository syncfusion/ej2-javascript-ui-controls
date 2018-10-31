import {
    Diagram, NodeModel, UndoRedo, randomId, ConnectorModel, Connector, Node, BpmnDiagrams, StackPanel, DiagramElement, TextElement, PortVisibility, PortConstraints
} from '../../src/diagram/index';
Diagram.Inject(UndoRedo);

Diagram.Inject(BpmnDiagrams);

import {
    SymbolPalette, SymbolInfo
} from '../../src/symbol-palette/index';
import { NodeConstraints } from "../../src/index";

SymbolPalette.Inject(BpmnDiagrams);
/**
 * Simple symbol palette
 */

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



let diagram: Diagram = new Diagram({
    width: '74%', height: '600px',
    pageSettings: {
        background: { color: 'transparent' }
    },

});
diagram.appendTo('#diagram');

export function getBPMNShapes(): NodeModel[] {

    let bpmnShapes: NodeModel[] = [
        {
            id: 'BPMNStart', constraints: NodeConstraints.Default | NodeConstraints.AllowDrop, style: { strokeWidth: 2 }, shape: { type: 'Bpmn', shape: 'Event', event: { event: 'Start', trigger: 'None' } },
        },
        {
            id: 'Intermediate', constraints: NodeConstraints.Default | NodeConstraints.AllowDrop, style: { strokeWidth: 2 }, shape: { type: 'Bpmn', shape: 'Event', event: { event: 'Intermediate', trigger: 'None' } },
        },
        {
            id: 'End', constraints: NodeConstraints.Default | NodeConstraints.AllowDrop, style: { strokeWidth: 2 }, shape: { type: 'Bpmn', shape: 'Event', event: { event: 'End', trigger: 'None' } },
        },
        {
            id: 'Gateway', constraints: NodeConstraints.Default | NodeConstraints.AllowDrop, style: { strokeWidth: 2 }, shape: { type: 'Bpmn', shape: 'Gateway' }
        },
        {
            id: 'Task', constraints: NodeConstraints.Default | NodeConstraints.AllowDrop, style: { strokeWidth: 2 }, shape: { type: 'Bpmn', shape: 'Activity', activity: { activity: 'Task' } }
        },
        {
            id: 'SubProcessEventBased', constraints: NodeConstraints.Default | NodeConstraints.AllowDrop, style: { strokeWidth: 2 }, shape: {
                type: 'Bpmn', shape: 'Activity', activity: {
                    activity: 'SubProcess',
                    subProcess: { type: 'Transaction', transaction: { success: { visible: false }, failure: { visible: false }, cancel: { visible: false } } }
                },
            },
        },

        {
            id: 'DataObject', constraints: NodeConstraints.Default | NodeConstraints.AllowDrop, style: { strokeWidth: 2 }, shape: { type: 'Bpmn', shape: 'DataObject' }
        },
        {
            id: 'annotwww4', width: 100, height: 100, constraints: NodeConstraints.Default | NodeConstraints.AllowDrop,
            shape: { type: 'Bpmn', shape: 'TextAnnotation', annotation: { angle: 280, length: 150, text: 'textAnnotation4', } }
        }
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
        { id: 'bpmn', expanded: false, symbols: getBPMNShapes(), title: 'BPMN Shapes' },
        { id: 'connectors', expanded: false, symbols: getConnectors(), title: 'Connectors' }
    ],
    width: '25%', height: '100%', symbolHeight: 50, symbolWidth: 50,
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
