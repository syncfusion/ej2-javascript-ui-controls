/**
 * Swimlane sample
 */
import {
    Diagram, NodeModel, Node, SwimLane, DiagramContextMenu, ConnectorModel, UndoRedo, PortVisibility, PortConstraints, SwimLaneModel,
    DiagramBeforeMenuOpenEventArgs, LaneModel, cloneObject, randomId, ShapeStyleModel, HeaderModel
} from '../../src/diagram/index';
import { MenuEventArgs } from '@syncfusion/ej2-navigations';
import { PaletteModel, SymbolPalette } from '../../src/symbol-palette/index';
Diagram.Inject(DiagramContextMenu, UndoRedo);

let pathData = 'M 120 24.9999 C 120 38.8072 109.642 50 96.8653 50 L 23.135' +
    ' 50 C 10.3578 50 0 38.8072 0 24.9999 L 0 24.9999 C' +
    '0 11.1928 10.3578 0 23.135 0 L 96.8653 0 C 109.642 0 120 11.1928 120 24.9999 Z';




addStyles('../../node_modules/@syncfusion/ej2-base/styles/material.css')
addStyles('../../node_modules/@syncfusion/ej2-navigations/styles/material.css')
addStyles('../../node_modules/@syncfusion/ej2-inputs/styles/material.css')
addStyles('../../node_modules/@syncfusion/ej2-lists/styles/material.css')
addStyles('../../node_modules/@syncfusion/ej2-splitbuttons/styles/material.css')
addStyles('../../node_modules/@syncfusion/ej2-popups/styles/material.css')
addStyles('../../styles/diagram/material.css')

let count = 0;
function addStyles(location: string, addLoadEvent?: boolean) {
    var link = document.createElement("link");
    link.href = location;
    link.type = "text/css";
    link.rel = "stylesheet";

    link.onload = function () { CSSDone(); }

    document.getElementsByTagName("head")[0].appendChild(link);
}


let palettes: PaletteModel[] = [
    {
        id: 'flow', expanded: true, title: 'Flow Shapes', symbols: [
            {
                id: 'Terminator', width: 50, height: 60, shape: { type: 'Flow', shape: 'Terminator' }, style: { strokeWidth: 1 }, ports: [
                    { offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw },
                    { offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw },
                    { offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw },
                    { offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw }
                ]
            },
            {
                id: 'Process', width: 50, height: 60, shape: { type: 'Flow', shape: 'Process' }, style: { strokeWidth: 1 }, ports: [
                    { offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw },
                    { offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw },
                    { offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw },
                    { offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw }
                ]
            },
            {
                id: 'Decision', width: 50, height: 50, shape: { type: 'Flow', shape: 'Decision' }, style: { strokeWidth: 1 }, ports: [
                    { offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw },
                    { offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw },
                    { offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw },
                    { offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw }
                ]
            },
            {
                id: 'Document', width: 50, height: 50, shape: { type: 'Flow', shape: 'Document' }, style: { strokeWidth: 1 }, ports: [
                    { offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw },
                    { offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw },
                    { offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw },
                    { offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw }
                ]
            },
            {
                id: 'PreDefinedProcess', width: 50, height: 50, shape: { type: 'Flow', shape: 'PreDefinedProcess' }, ports: [
                    { offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw },
                    { offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw },
                    { offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw },
                    { offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw }
                ], style: { strokeWidth: 1 }
            },
            {
                id: 'data', width: 50, height: 50, shape: { type: 'Flow', shape: 'Data' }, ports: [
                    { offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw },
                    { offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw },
                    { offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw },
                    { offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw }
                ], style: { strokeWidth: 1 }
            },
        ]
    },
    {
        id: 'swimlaneShapes', expanded: true,
        title: 'Swimlane Shapes',
        symbols: [
            {
                id: 'stackCanvas1',
                shape: {
                    type: 'SwimLane', lanes: [
                        {
                            id: 'lane1',
                            style: { strokeColor: 'black' }, height: 60, width: 150,
                            header: { width: 50, height: 50, style: { strokeColor: 'black', fontSize: 11 } },
                        }
                    ],
                    orientation: 'Horizontal', isLane: true
                },
                height: 60,
                width: 140,
                offsetX: 70,
                offsetY: 30,
            }, {
                id: 'stackCanvas2',
                shape: {
                    type: 'SwimLane',
                    lanes: [
                        {
                            id: 'lane1',
                            style: { strokeColor: 'black' }, height: 150, width: 60,
                            header: { width: 50, height: 50, style: { strokeColor: 'black', fontSize: 11 } },
                        }
                    ],
                    orientation: 'Vertical', isLane: true
                },
                height: 140,
                width: 60,
                // style: { fill: '#f5f5f5' },
                offsetX: 70,
                offsetY: 30,
            }, {
                id: 'verticalPhase',
                shape: {
                    type: 'SwimLane',
                    phases: [{ style: { strokeWidth: 1, strokeDashArray: '3,3', strokeColor: '#A9A9A9' }, }],
                    annotations: [{ text: '' }],
                    orientation: 'Vertical', isPhase: true
                },
                height: 60,
                width: 140
            }, {
                id: 'horizontalPhase',
                shape: {
                    type: 'SwimLane',
                    phases: [{ style: { strokeWidth: 1, strokeDashArray: '3,3', strokeColor: '#A9A9A9' }, }],
                    annotations: [{ text: '' }],
                    orientation: 'Horizontal', isPhase: true
                },
                height: 60,
                width: 140
            }
        ]
    },
    {
        id: 'connectors', expanded: true, symbols: [
            {
                id: 'Link1', type: 'Orthogonal', sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 40, y: 40 },
                targetDecorator: { shape: 'Arrow' }, style: { strokeWidth: 1 }
            },
            {
                id: 'Link2', type: 'Orthogonal', sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 40, y: 40 },
                targetDecorator: { shape: 'Arrow' }, style: { strokeWidth: 1, strokeDashArray: '4 4' }
            }], title: 'Connectors'
    }
];

let nodes: NodeModel[] = [
    {
        id: 'swimlane',
        shape: {
            type: 'SwimLane',
            header: {
                annotation: { content: 'ONLINE PURCHASE STATUS', style: { fill: '#111111' } },
                height: 50, style: { fontSize: 11 },
                orientation: 'Horizontal',
            },
            lanes: [
                {
                    id: 'stackCanvas1',
                    header: {
                        annotation: { content: 'CUSTOMER' }, width: 50,
                        style: { fontSize: 11 }
                    },
                    height: 100,
                    children: [
                        {
                            id: 'Order',
                            shape: { type: 'Path', data: pathData },
                            annotations: [
                                {
                                    content: 'ORDER',
                                    style: { fontSize: 11 }
                                }
                            ],
                            margin: { left: 60, top: 20 },
                            height: 40, width: 100
                        }
                    ],
                },
                {
                    id: 'stackCanvas2',
                    header: {
                        annotation: { content: 'ONLINE' }, width: 50,
                        style: { fontSize: 11 }
                    },
                    height: 100,
                    children: [
                        {
                            id: 'selectItemaddcart',
                            annotations: [{ content: 'Select item\nAdd cart' }],
                            margin: { left: 190, top: 20 },
                            height: 40, width: 100
                        },
                        {
                            id: 'paymentondebitcreditcard',
                            annotations: [{ content: 'Payment on\nDebit/Credit Card' }],
                            margin: { left: 350, top: 20 },
                            height: 40, width: 100
                        }
                    ],
                },
                {
                    id: 'stackCanvas3',
                    header: {
                        annotation: { content: 'SHOP' }, width: 50,
                        style: { fontSize: 11 }
                    },
                    height: 100,
                    children: [
                        {
                            id: 'getmaildetailaboutorder',
                            annotations: [{ content: 'Get mail detail\nabout order' }],
                            margin: { left: 190, top: 20 },
                            height: 40, width: 100
                        },
                        {
                            id: 'pakingitem',
                            annotations: [{ content: 'Paking item' }],
                            margin: { left: 350, top: 20 },
                            height: 40, width: 100
                        }
                    ],
                },
                {
                    id: 'stackCanvas4',
                    header: {
                        annotation: { content: 'DELIVERY' }, width: 50,
                        style: { fontSize: 11 }
                    },
                    height: 100,
                    children: [
                        {
                            id: 'sendcourieraboutaddress',
                            annotations: [{ content: 'Send Courier\n about Address' }],
                            margin: { left: 190, top: 20 },
                            height: 40, width: 100
                        },
                        {
                            id: 'deliveryonthataddress',
                            annotations: [{ content: 'Delivery on that\n Address' }],
                            margin: { left: 350, top: 20 },
                            height: 40, width: 100
                        },
                        {
                            id: 'getitItem',
                            shape: { type: 'Path', data: pathData },
                            annotations: [{ content: 'GET IT ITEM', style: { fontSize: 11 } }],
                            margin: { left: 500, top: 20 },
                            height: 40, width: 100
                        }
                    ],
                },
            ],
            phases: [
                {
                    id: 'phase1', offset: 170,
                    header: { content: { content: 'Phase' } }
                },
                {
                    id: 'phase2', offset: 450,
                    header: { content: { content: 'Phase' } }
                },
            ],
            phaseSize: 20,
        },
        offsetX: 420, offsetY: 270,
        height: 100,
        width: 650
    },
];
let connectors: ConnectorModel[] = [
    {
        id: 'connector1', sourceID: 'Order',
        targetID: 'selectItemaddcart'
    },
    {
        id: 'connector2', sourceID: 'selectItemaddcart',
        targetID: 'paymentondebitcreditcard'
    },
    {
        id: 'connector3', sourceID: 'paymentondebitcreditcard',
        targetID: 'getmaildetailaboutorder'
    },
    {
        id: 'connector4', sourceID: 'getmaildetailaboutorder',
        targetID: 'pakingitem'
    },
    {
        id: 'connector5', sourceID: 'pakingitem',
        targetID: 'sendcourieraboutaddress'
    },
    {
        id: 'connector6', sourceID: 'sendcourieraboutaddress',
        targetID: 'deliveryonthataddress'
    },
    {
        id: 'connector7', sourceID: 'deliveryonthataddress',
        targetID: 'getitItem'
    },
];

function getConnectorDefaults(connector: ConnectorModel): ConnectorModel {
    connector.type = 'Orthogonal';
    connector.style.strokeColor = "#CCCCCC";
    connector.sourceDecorator.style.strokeColor = "#CCCCCC";
    connector.targetDecorator.style.strokeColor = "#CCCCCC";
    connector.sourceDecorator.style.fill = "#CCCCCC";
    connector.targetDecorator.style.fill = "#CCCCCC";
    return connector;
}
function getNodeDefaults(node: NodeModel): NodeModel {
    node.style.strokeColor = "#CCCCCC";
    return node;
}
function CSSDone() {
    count++;
    if (count === 7) {
        let symbolPalette: SymbolPalette = new SymbolPalette({
            palettes: palettes,
            symbolHeight: 50, symbolWidth: 50,
            symbolPreview: { width: 100, height: 100 },
            expandMode: 'Multiple',
            height: '500px',
            width: '100%',
        });
        symbolPalette.appendTo('#symbolpalette');
    }
}

let diagram = new Diagram({
    width: 1500, height: 1000, nodes: nodes,
    connectors: connectors,
    getConnectorDefaults: getConnectorDefaults,
    getNodeDefaults: getNodeDefaults,
    contextMenuSettings: {
        show: true, items: [
            {
                text: 'Clone', id: 'Clone', target: '.e-diagramcontent',
            },
            {
                text: 'Cut', id: 'Cut', target: '.e-diagramcontent',
            },
            {
                text: 'InsertLaneBefore', id: 'InsertLaneBefore', target: '.e-diagramcontent',
            },
            {
                text: 'InsertLaneAfter', id: 'InsertLaneAfter', target: '.e-diagramcontent',
            }],
        showCustomMenuOnly: true,
    },
    contextMenuOpen: function (args: DiagramBeforeMenuOpenEventArgs) {
        for (let item of args.items) {
            if ((diagram.selectedItems.connectors.length + diagram.selectedItems.nodes.length) > 0) {
                if (item.id === 'InsertLaneBefore' || item.id === 'InsertLaneAfter') {
                    if (diagram.selectedItems.connectors.length || (diagram.selectedItems.nodes.length && !(diagram.selectedItems.nodes[0] as Node).isLane)) {
                        args.hiddenItems.push(item.text);
                    }
                }
            } else {
                args.hiddenItems.push(item.text);
            }
        }
    },
    contextMenuClick: function (args: MenuEventArgs) {
        if (args.item.id === 'InsertLaneBefore' || args.item.id === 'InsertLaneAfter') {
            if (diagram.selectedItems.nodes.length > 0 && (diagram.selectedItems.nodes[0] as Node).isLane) {
                let index: number;
                let node: Node = diagram.selectedItems.nodes[0] as Node;
                let swimlane: NodeModel = diagram.getObject((diagram.selectedItems.nodes[0] as Node).parentId);
                let shape: SwimLaneModel = swimlane.shape as SwimLaneModel;
                let existingLane: LaneModel = cloneObject(shape.lanes[0]);

                let newLane: LaneModel = {
                    id: randomId(),
                    header: {
                        width: existingLane.header.width, height: existingLane.header.height,
                        style: existingLane.header.style as ShapeStyleModel
                    } as HeaderModel,
                    style: existingLane.style as ShapeStyleModel,
                    height: existingLane.height, width: existingLane.width,
                } as LaneModel;

                if (shape.orientation === 'Horizontal') {
                    let exclude = 0;
                    exclude += (shape.header) ? 1 : 0;
                    exclude += (shape.phases.length) ? 1 : 0;
                    index = node.rowIndex - exclude;
                    newLane.header.width = existingLane.header.width;
                    newLane.header.height = existingLane.height;
                } else {
                    index = node.columnIndex - (shape.phases.length) ? 1 : 0;
                    newLane.header.width = existingLane.width;
                    newLane.header.height = existingLane.header.height;
                }
                if (args.item.id === 'InsertLaneBefore') {
                    diagram.addLanes(swimlane, [newLane], index);
                } else {
                    diagram.addLanes(swimlane, [newLane], index + 1);
                }
                diagram.clearSelection();
            }
        } else if (args.item.id === 'Cut') {
            diagram.cut();
        } else if (args.item.id === 'Clone') {
            diagram.copy();
            diagram.paste();
        }
    },
});

diagram.appendTo('#diagram');

diagram.dragEnter = function (arg) {
    if (arg.element instanceof Node) {
        let shape: SwimLaneModel = arg.element.shape as SwimLaneModel;
        if (shape.isLane) {
            if (shape.orientation === "Horizontal") {
                shape.lanes[0].height = 100;
                shape.lanes[0].width = 500;
            } else if (shape.orientation === "Vertical") {
                shape.lanes[0].height = 500;
                shape.lanes[0].width = 100;
            }
        }
    }
};


