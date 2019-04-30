import {
    Diagram, NodeModel, UndoRedo, randomId, ConnectorModel, Connector, BpmnDiagrams,
    StackPanel, TextElement, PortVisibility, PortConstraints, LayerModel, IDragEnterEventArgs, DiagramContextMenu
} from '../../src/diagram/index';

import { Node } from '../../src/diagram/objects/node';
Diagram.Inject(UndoRedo);
Diagram.Inject(DiagramContextMenu);
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
        id: 'node1', height: 75, width: 75, offsetX: 100, offsetY: 100, annotations: [{ content: 'Layer1' }]
    },
    {
        id: 'node2', height: 75, width: 75, offsetX: 400, offsetY: 100, annotations: [{ content: 'Layer1' }]
    },
    {
        id: 'node3', height: 75, width: 75, offsetX: 150, offsetY: 150, annotations: [{ content: 'Layer2' }]
    },
    {
        id: 'node4', height: 75, width: 75, offsetX: 450, offsetY: 150, annotations: [{ content: 'Layer2' }]
    },
    {
        id: 'node5', height: 75, width: 75, offsetX: 100, offsetY: 300, annotations: [{ content: 'Layer3' }]
    },
    {
        id: 'node6', height: 75, width: 75, offsetX: 400, offsetY: 300, annotations: [{ content: 'Layer3' }]
    },
    {
        id: 'node7', height: 75, width: 75, offsetX: 150, offsetY: 350, annotations: [{ content: 'Layer4' }]
    },
    {
        id: 'node8', height: 75, width: 75, offsetX: 450, offsetY: 350, annotations: [{ content: 'Layer4' }]
    },
    {
        id: 'node9', height: 75, width: 75, offsetX: 600, offsetY: 100, annotations: [{ content: 'Layer2' }]
    },
    {
        id: 'node10', height: 75, width: 75, offsetX: 800, offsetY: 300, annotations: [{ content: 'Layer2' }]
    },
    {
        id: 'node11', height: 75, width: 75, offsetX: 650, offsetY: 150, annotations: [{ content: 'Layer3' }]
    },
    {
        id: 'node12', height: 75, width: 75, offsetX: 850, offsetY: 350, annotations: [{ content: 'Layer3' }]
    },

];
let layers: LayerModel[] = [
    {
        id: 'default_layer',
        visible: true,
        objects: ['node1', 'node2'],
        lock: false,
        zIndex: 1
    },
    {
        id: 'Layer2',
        visible: true,
        objects: ['node3', 'node4', 'node9', 'node10'],
        lock: false,
        zIndex: 0
    },
    {
        id: 'Layer3',
        visible: true,
        objects: ['node5', 'node6', 'node11', 'node12'],
        lock: false,
    },
    {
        id: 'Layer4',
        visible: true,
        objects: ['node7', 'node8'],
        lock: false,
    }
];

let diagram: Diagram = new Diagram({
    width: '1000px', height: '600px',
    nodes: nodes,
    layers: layers,
    contextMenuSettings: { show: true}
    //dragEnter: dragEnter,
});
diagram.appendTo('#diagram');
//diagram.addLayer({ id: 'Layer2' });

function dragEnter(args: IDragEnterEventArgs) {

    var obj = args.element;
    var node = diagram.selectedItems.nodes[0];
    if (obj instanceof Node) {
        args.cancel = false;
    }
    if (!args.cancel) {

        if (obj.addInfo[0].text === "default_layer") {
            diagram.setActiveLayer("default_layer");

        } else {
            diagram.setActiveLayer('Layer2');
        }
    }

}
let shapes: NodeModel[] = [
    {
        id: 'ProcessRight',
        shape: {
            type: "Path",
            data: "M0 0 L85 0 L110 100 L85 200 L0 200 Z",
        },
        annotations: [{ style: { color: "#245c86", fill: "transparent" }, }],
        addInfo: [{ text: "default_layer" }]
    },
    {
        id: 'ProcessDown',
        shape: {
            type: "Path",
            data: "M0 0 L200 0 L200 85 L100 110 L0 85 Z",
        },
        annotations: [{ style: { color: "#245c86", fill: "transparent" }, }],
        addInfo: [{ text: "default_layer" }]
    },
    {
        id: 'ProcessLeft',
        shape: {
            type: "Path",
            data: "M0 100 L25 0 L110 0 L110 200 L25 200 Z",
        },
        annotations: [{ style: { color: "#245c86", fill: "transparent" }, }],
        addInfo: [{ text: "default_layer" }]
    },
    {
        id: 'ProcessUp',
        shape: {
            type: "Path",
            data: "M0 25 L100 0 L200 25 L200 110 L0 110 Z",
        },
        annotations: [{ style: { color: "#245c86", fill: "transparent" }, }],
        addInfo: [{ text: "default_layer" }]
    },

];
let shapes2: NodeModel[] = [
    {
        id: 'ProcessArrowRight',
        shape: {
            type: "Path",
            data: "M0 0 L85 0 L110 100 L85 200 L0 200 L25 100 Z",
        },
        annotations: [{ style: { color: "#245c86", fill: "transparent" }, offset: { x: 0.61, y: 0.5 }, }],
        addInfo: [{ text: 'Layer2' }]
    },
    {
        id: 'ProcessArrowDown',
        shape: {
            type: "Path",
            data: "M0 0 L100 25 L200 0 L200 85 L100 110 L0 85 Z",
        },
        annotations: [{ style: { color: "#245c86", fill: "transparent" }, }],
        addInfo: [{ text: 'Layer2' }]
    },
    {
        id: 'ProcessArrowLeft',
        shape: {
            type: "Path",
            data: "M0 100 L25 0 L110 0 L85 100 L110 200 L25 200 Z",
        },
        annotations: [{ style: { color: "#245c86", fill: "transparent" }, offset: { x: 0.39, y: 0.5 }, }],
        addInfo: [{ text: 'Layer2' }]
    },
    {
        id: 'ProcessArrowUp',
        shape: {
            type: "Path",
            data: "M0 25 L100 0 L200 25 L200 110 L100 85 L0 110 Z",
        },
        annotations: [{ style: { color: "#245c86", fill: "transparent" }, }],
        addInfo: [{ text: 'Layer2' }]
    },
];
let palette: SymbolPalette = new SymbolPalette({
    expandMode: 'Multiple',
    palettes: [
        { id: 'palette1', expanded: true, symbols: shapes, iconCss: 'e-ddb-icons e-flow', title: 'Palette1' },
        { id: 'palette2', expanded: true, symbols: shapes2, iconCss: 'e-ddb-icons e-flow', title: 'Palette2' }
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
    node.width = 100;
    node.height = 100;
}

document.getElementById('forward').onclick = () => {
    diagram.bringLayerForward('default_layer');
}
document.getElementById('backward').onclick = () => {
    diagram.sendLayerBackward('Layer4');
}

