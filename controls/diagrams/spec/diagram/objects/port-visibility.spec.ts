import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { ConnectorModel } from '../../../src/diagram/objects/connector-model';
import { NodeModel, PathModel, FlowShapeModel, TextModel,BasicShapeModel } from '../../../src/diagram/objects/node-model';
import { TextStyle } from '../../../src/diagram/core/appearance';
import { PointModel } from '../../../src/diagram/primitives/point-model';
import { Rect } from '../../../src/diagram/primitives/rect';
import { Matrix, transformPointByMatrix, identityMatrix, rotateMatrix } from '../../../src/diagram/primitives/matrix';
import { MouseEvents } from '../interaction/mouseevents.spec';
import { Node } from '../../../src/diagram/objects/node';
import { Connector } from '../../../src/diagram/objects/connector';
import { UndoRedo } from '../../../src/diagram/objects/undo-redo';
import { HistoryEntry, History } from '../../../src/diagram/diagram/history';
import { PortVisibility,PortConstraints,DiagramTools, NodeConstraints } from '../../../src/diagram/enum/enum';
import {
    SymbolPalette, SymbolInfo, PaletteModel
} from '../../../src/symbol-palette/index';
import { IElement, TextElement, StackPanel, DiagramElement, randomId } from '../../../src/diagram/index';
Diagram.Inject(UndoRedo);
/**
 * Interaction Specification Document
 */
describe('Diagram Control', () => {

    describe('Port Visiblity', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram12' });
            document.body.appendChild(ele);
            let connector1: ConnectorModel = {
                id: 'connector1',
                type: 'Straight',
                sourcePoint: { x: 100, y: 100 },
                targetPoint: { x: 200, y: 200 },
            };
            let connector2: ConnectorModel = {
                id: 'connector2',
                type: 'Straight',
                sourcePoint: { x: 200, y: 400 },
                targetPoint: { x: 400, y: 400 },
            };

            let node1: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,
                ports: [{
                    shape: 'Circle',
                    visibility: PortVisibility.Visible | PortVisibility.Hover,
                    offset: { x: 1, y: 0.75 }
                }],
                annotations: [{ content: 'Mouse Hover' }]
            };
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 100,
                ports: [{
                    shape: 'Circle',
                    visibility: PortVisibility.Connect,
                    offset: { x: 1, y: 0.75 }
                }],
                annotations: [{ content: 'Connect' }]
            };
              let node33: NodeModel = {
                id: 'node33', width: 100, height: 150, offsetX: 300, offsetY: 500,
                ports: [{
                    shape: 'Circle',
                    visibility: PortVisibility.Connect,
                    offset: { x: 1, y: 0.75 }
                }],
                annotations: [{ content: 'Connect node' }]
            };
            let node3: NodeModel = {
                id: 'node3', width: 100, height: 100, offsetX: 500, offsetY: 100,
                ports: [{
                    shape: 'Circle',
                    visibility: PortVisibility.Visible,
                    offset: { x: 1, y: 0.75 }
                }],
                annotations: [{ content: 'Port Visible' }]
            };
            let node4: NodeModel = {
                id: 'node4', width: 100, height: 100, offsetX: 700, offsetY: 100,
                ports: [{
                    shape: 'Circle',
                    visibility: PortVisibility.Hidden,
                    constraints: PortConstraints.Drag,
                    offset: { x: 1, y: 0.75 }
                }],
                annotations: [{ content: 'Port Hidden' }]
            };
             let node5: NodeModel = {
                id: 'node5', width: 100, height: 100, offsetX: 100, offsetY: 300,
                ports: [
                    {
                        id: 'port1',
                        shape: 'Circle',
                        visibility: PortVisibility.Connect,
                        constraints: PortConstraints.Draw,
                        offset: { x: 0, y: 0 }
                    }, {
                        id: 'port2', constraints: PortConstraints.Drag,
                        visibility: PortVisibility.Hidden, shape: 'Circle', offset: { x: 1, y: 0 }
                    },
                ],
                annotations: [{ content: 'Port Hidden' }]
            };
                  var node6 :NodeModel= {
                    id: 'node6', width: 100, height: 100, offsetX: 300, offsetY: 400,
                    annotations: [{ content: 'connector node' }]
                };
            diagram = new Diagram({
                width: 1000, height: 1000, nodes: [node1, node2, node3, node4,node33], connectors: [connector1] 
            });

            diagram.appendTo('#diagram12');

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking PortVisibility - Hover', (done: Function) => {
            expect((diagram.nodes[0] as Node).wrapper.children[2].visible === false).toBe(true);
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.mouseMoveEvent(diagramCanvas, 60, 60, false, false);
            expect((diagram.nodes[0] as Node).wrapper.children[2].visible === true).toBe(true);
            mouseEvents.mouseMoveEvent(diagramCanvas, 160, 260, false, false);
            expect((diagram.nodes[0] as Node).wrapper.children[2].visible === false).toBe(true);
            done();
        });
        it('Checking PortVisibility - Connect', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.dragEvent(diagramCanvas, 200, 40, 300, 100);
            expect((diagram.nodes[1] as Node).wrapper.children[2].visible === false).toBe(true);
            mouseEvents.clickEvent(diagramCanvas, 200, 200);
            mouseEvents.dragEvent(diagramCanvas, 200, 200, 300, 100);
            expect((diagram.nodes[1] as Node).wrapper.children[2].visible === true).toBe(true);
            done();

        });
        //To check update port visibility - property change
        it('Checking PortVisibility - Visible', (done: Function) => {
            expect((diagram.nodes[2] as Node).wrapper.children[2].visible === true).toBe(true);
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 100, 100);
            mouseEvents.dragAndDropEvent(diagramCanvas, 100, 100, 500, 100);
            expect((diagram.nodes[2] as Node).wrapper.children[2].visible === true).toBe(true);
            mouseEvents.dragAndDropEvent(diagramCanvas, 500, 100, 100, 100);
            expect((diagram.nodes[2] as Node).wrapper.children[2].visible === true).toBe(true);
            done();
        });
        it('Checking port visibility change ', function (done) {
            var nodelement = document.getElementById('node1_content');
            (diagram.nodes[2] as Node).ports[0].visibility = PortVisibility.Hidden;
            let node = (diagram.nodes[2] as Node)
            diagram.dataBind();
            expect(node.wrapper.children[2].visible === false).toBe(true);
            done();
        });

        it('Checking PortVisibility - Hidden', (done: Function) => {
            expect((diagram.nodes[3] as Node).wrapper.children[2].visible === false).toBe(true);
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 100, 100);
            mouseEvents.dragAndDropEvent(diagramCanvas, 100, 100, 700, 100);
            expect((diagram.nodes[3] as Node).wrapper.children[2].visible === false).toBe(true);
            mouseEvents.dragAndDropEvent(diagramCanvas, 700, 100, 100, 100);
            expect((diagram.nodes[3] as Node).wrapper.children[2].visible === false).toBe(true);
            done();
        });
         it('Checking PortVisibility - Connect-issue', (done: Function) => {
              
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 300, 500);
            mouseEvents.dragEvent(diagramCanvas, 300, 500, 300, 200);
            mouseEvents.clickEvent(diagramCanvas, 400, 100);
            mouseEvents.dragEvent(diagramCanvas, 350, 100, 300, 100);
            expect((diagram.nodes[1] as Node).wrapper.children[2].visible === true).toBe(true);
            mouseEvents.dragEvent(diagramCanvas, 350, 100, 300, 200);
            expect((diagram.nodes[1] as Node).wrapper.children[2].visible === false&&(diagram.nodes[4] as Node).wrapper.children[2].visible===true).toBe(true);
            done();

        });
        it('Checking Port drag constraints and draw constraints for port hidden and hover ', (done: Function) => {
             let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
             mouseEvents.clickEvent(diagramCanvas, 500, 300);
             mouseEvents.clickEvent(diagramCanvas, 500, 300);
             mouseEvents.mouseMoveEvent(diagramCanvas, 100, 300);
             mouseEvents.mouseMoveEvent(diagramCanvas, 52, 253);
             let element1 = document.getElementById('diagram12content')
             expect(element1.style.cursor != 'crosshair').toBe(true);
             mouseEvents.clickEvent(diagramCanvas, 500, 300);
             mouseEvents.mouseMoveEvent(diagramCanvas, 156 + 8, 251);
             let element2 = document.getElementById('diagram12content')
             expect(element2.style.cursor != 'pointer').toBe(true);
             done();
         })



    });
    describe('Testing symbol palette', () => {
        let diagram: Diagram;
        let palette: SymbolPalette;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();
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
            id: 'task', width: 100, height: 100, offsetX: 300, offsetY: 100,
            shape: {
                type: 'Bpmn', shape: 'Activity',
                activity: { activity: 'SubProcess', subProcess: { type: 'Event' } }
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

        let htmlNodes: NodeModel[] = [{
            id: 'html', width: 100, height: 100, shape: {
                type: 'HTML',
                content: '<div style="background:red;height:100%;width:100%;"><input type="button" value="{{:value}}" /></div>',
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

        beforeAll((): void => {
            ele = createElement('div', { styles: 'width:100%;height:500px;' });
            ele.appendChild(createElement('div', { id: 'symbolpalette', styles: 'width:25%;float:left;' }));
            ele.appendChild(createElement('div', { id: 'diagram', styles: 'width:74%;height:500px;float:left;' }));
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [
                {
                    id: 'node1', width: 100, height: 100, offsetX: 40, offsetY: 100,
                    ports: [{
                        shape: 'Circle',
                        visibility: PortVisibility.Visible | PortVisibility.Hover,
                        offset: { x: 1, y: 0.75 }
                    }],
                    annotations: [{ content: 'Mouse Hover' }]
                },

            ];
            let connectors: ConnectorModel[] = [{
                id: 'connector1', type: 'Straight', sourcePoint: { x: 100, y: 300 },
                targetPoint: { x: 200, y: 400 },
            }];

            diagram = new Diagram({
                connectors: connectors, nodes: nodes, pageSettings: { background: { color: 'transparent' } },
                width: '70%'
            });
            diagram.appendTo('#diagram');

            palette = new SymbolPalette({
                width: '25%', height: '500px',
                palettes: [
                    { id: 'flow', expanded: true, symbols: flowshapes, iconCss: '', title: 'Flow Shapes' },
                    { id: 'bpmn', expanded: true, symbols: bpmnShapes, iconCss: '', title: 'BPMN Shapes' },
                    { id: 'grids', expanded: true, symbols: grids, title: 'Grids' },
                    { id: 'native', expanded: true, symbols: svgNodes, title: 'Native Elements' },
                    { id: 'html', expanded: true, symbols: htmlNodes, iconCss: 'shapes', title: 'Html Elements' },
                    { id: 'connectors', expanded: true, height: 200, symbols: connectorSymbols, iconCss: '', title: 'Connectors' }
                ], enableAnimation: false, enableSearch: true,
                symbolMargin: { top: 5, bottom: 5, left: 5, right: 5 }
            });
            palette.appendTo('#symbolpalette');
        });

        afterAll((): void => {
            diagram.destroy();
            palette.destroy();
            ele.remove();
        });
        it('Checking PortVisibility - Hover issue', (done: Function) => {
            expect((diagram.nodes[0] as Node).wrapper.children[2].visible === false).toBe(true);
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.mouseMoveEvent(diagramCanvas, 40+diagram.element.offsetLeft, 100);
            expect((diagram.nodes[0] as Node).wrapper.children[2].visible === true).toBe(true);
            mouseEvents.mouseLeaveEvent(diagramCanvas);
            expect((diagram.nodes[0] as Node).wrapper.children[2].visible === false).toBe(true);
            done();
        });
    });
    describe('Port Visiblity', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let diagramCanvas:HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram12' });
            document.body.appendChild(ele);

            diagram = new Diagram({
                width: 1000, height: 1000, nodes: [
                    {
                        id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,
                        ports: [{ id: 'port1', visibility: PortVisibility.Hover, shape: 'Circle', offset: { x: 0, y: 0 } },
                        { id: 'port2', visibility: PortVisibility.Hover, shape: 'Circle', offset: { x: 1, y: 0 } },
                        { id: 'port3', visibility: PortVisibility.Hover, shape: 'Circle', offset: { x: 0, y: 1 } },
                        { id: 'port4', visibility: PortVisibility.Hover, shape: 'Circle', offset: { x: 1, y: 1 } }
                        ]
                    },
                    {
                        id: 'newNode', width: 100, style: { fill: 'red' }, offsetX: 100, offsetY: 100, annotations: [{ content: 'Content' }], ports: [{ id: 'port1', visibility: PortVisibility.Hover, shape: 'Circle', offset: { x: 0, y: 0 } },
                        { id: 'port2', visibility: PortVisibility.Hover, shape: 'Circle', offset: { x: 1, y: 0 } },
                        { id: 'port3', visibility: PortVisibility.Hover, shape: 'Circle', offset: { x: 0, y: 1 } },
                        { id: 'port4', visibility: PortVisibility.Hover, shape: 'Circle', offset: { x: 1, y: 1 } }
                        ]
                    },
                {
                    id: 'node3', width: 100, height: 100, offsetX: 50, offsetY: 300,
                    ports: [{ id: 'port1', visibility: PortVisibility.Connect, shape: 'Circle', offset: { x: 0, y: 0 } },
                    { id: 'port2', visibility: PortVisibility.Connect, shape: 'Circle', offset: { x: 1, y: 0 } },
                    { id: 'port3', visibility: PortVisibility.Hover, shape: 'Circle', offset: { x: 0, y: 1 } },
                    { id: 'port4', visibility: PortVisibility.Hover, shape: 'Circle', offset: { x: 1, y: 1 } }
                    ]

                },{
                    id: 'node4', width: 100, height: 100, offsetX: 400, offsetY: 400,
                    ports: [{ id: 'port1', visibility: PortVisibility.Connect|PortVisibility.Hover, shape: 'Circle', offset: { x: 0, y: 0 } },]

                }
                ], connectors: [{
                        type: 'Orthogonal', sourcePoint: { x: 400, y: 400 }, targetPoint: { x: 500, y: 500 },
                    }]
            });

            diagram.appendTo('#diagram12');
            diagramCanvas = document.getElementById(diagram.element.id + 'content');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking PortVisibility - Hover When try to create the connection', (done: Function) => {
            
            diagram.select([diagram.connectors[0]]);
            var node1 = diagram.nodes[0];
            expect(document.getElementById('node1_port1').getAttribute('visibility') == 'hidden' && document.getElementById('node1_port2').getAttribute('visibility') == 'hidden' &&
                document.getElementById('node1_port3').getAttribute('visibility') == 'hidden' && document.getElementById('node1_port4').getAttribute('visibility') == 'hidden' &&
                document.getElementById('newNode_port1').getAttribute('visibility') == 'hidden' && document.getElementById('newNode_port2').getAttribute('visibility') == 'hidden' &&
                document.getElementById('newNode_port3').getAttribute('visibility') == 'hidden' && document.getElementById('newNode_port4').getAttribute('visibility') == 'hidden').toBe(true);

            mouseEvents.mouseDownEvent(diagramCanvas, diagram.connectors[0].sourcePoint.x + diagram.element.offsetLeft, diagram.connectors[0].sourcePoint.y + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, (node1.offsetX) + diagram.element.offsetLeft, (node1.offsetY + node1.height / 2) - diagram.element.offsetTop);
            expect(document.getElementById('node1_port1').getAttribute('visibility') == 'visible' && document.getElementById('node1_port2').getAttribute('visibility') == 'visible' &&
                document.getElementById('node1_port3').getAttribute('visibility') == 'visible' && document.getElementById('node1_port4').getAttribute('visibility') == 'visible' &&
                document.getElementById('newNode_port1').getAttribute('visibility') == 'hidden' && document.getElementById('newNode_port2').getAttribute('visibility') == 'hidden' &&
                document.getElementById('newNode_port3').getAttribute('visibility') == 'hidden' && document.getElementById('newNode_port4').getAttribute('visibility') == 'hidden').toBe(true);

            var node1 = diagram.nodes[1]
            mouseEvents.mouseMoveEvent(diagramCanvas, (node1.offsetX) + diagram.element.offsetLeft, (node1.offsetY + node1.wrapper.actualSize.height / 2) - diagram.element.offsetTop);
            expect(document.getElementById('node1_port1').getAttribute('visibility') == 'hidden' && document.getElementById('node1_port2').getAttribute('visibility') == 'hidden' &&
                document.getElementById('node1_port3').getAttribute('visibility') == 'hidden' && document.getElementById('node1_port4').getAttribute('visibility') == 'hidden' &&
                document.getElementById('newNode_port1').getAttribute('visibility') == 'visible' && document.getElementById('newNode_port2').getAttribute('visibility') == 'visible' &&
                document.getElementById('newNode_port3').getAttribute('visibility') == 'visible' && document.getElementById('newNode_port4').getAttribute('visibility') == 'visible').toBe(true);

            mouseEvents.mouseMoveEvent(diagramCanvas, 500 + diagram.element.offsetLeft, 500 - diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 700 + diagram.element.offsetLeft, 700 - diagram.element.offsetTop);
            expect(document.getElementById('node1_port1').getAttribute('visibility') == 'hidden' && document.getElementById('node1_port2').getAttribute('visibility') == 'hidden' &&
                document.getElementById('node1_port3').getAttribute('visibility') == 'hidden' && document.getElementById('node1_port4').getAttribute('visibility') == 'hidden' &&
                document.getElementById('newNode_port1').getAttribute('visibility') == 'hidden' && document.getElementById('newNode_port2').getAttribute('visibility') == 'hidden' &&
                document.getElementById('newNode_port3').getAttribute('visibility') == 'hidden' && document.getElementById('newNode_port4').getAttribute('visibility') == 'hidden').toBe(true);

            done();
        });
        it('Checking PortVisibility - Connect when try to create the connection', (done: Function) => {
            var node1 = diagram.nodes[2]
            mouseEvents.mouseDownEvent(diagramCanvas, diagram.connectors[0].sourcePoint.x + diagram.element.offsetLeft, diagram.connectors[0].sourcePoint.y + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, (node1.offsetX) + diagram.element.offsetLeft, (node1.offsetY + node1.wrapper.actualSize.height / 2) - diagram.element.offsetTop);
            expect(document.getElementById('node3_port1').getAttribute('visibility') == 'visible' && document.getElementById('node3_port2').getAttribute('visibility') == 'visible' &&
                document.getElementById('node3_port3').getAttribute('visibility') == 'visible' && document.getElementById('node3_port4').getAttribute('visibility') == 'visible').toBe(true);
            mouseEvents.mouseLeaveEvent(diagramCanvas);
            expect(document.getElementById('node3_port1').getAttribute('visibility') == 'hidden' && document.getElementById('node3_port2').getAttribute('visibility') == 'hidden' &&
                document.getElementById('node3_port3').getAttribute('visibility') == 'hidden' && document.getElementById('node3_port4').getAttribute('visibility') == 'hidden').toBe(true);            
            done();
        });
        it('Checking PortVisibility with drawing tool', (done: Function) => {
            diagram.tool = DiagramTools.DrawOnce;
            let shape: BasicShapeModel = { type: 'Basic', shape: 'Diamond' };
            let node: NodeModel =
                {shape: shape};
            diagram.drawingObject = node;
            diagram.dataBind();
            mouseEvents.mouseMoveEvent(diagramCanvas, 400, 400, false, false);
            expect(diagram.nodes[3].wrapper.children[1].visible===false).toBe(true)
            done();
        })

    });

    describe('Port Visiblity', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram123' });
            document.body.appendChild(ele);
            let node1: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,
                constraints: NodeConstraints.Default & ~(NodeConstraints.Resize | NodeConstraints.Rotate | NodeConstraints.Drag),
                ports: [{
                    shape: 'Circle',
                    visibility: PortVisibility.Hover | PortVisibility.Connect,
                    offset: { x: 1, y: 0.75 }
                }]
            };
            diagram = new Diagram({
                width: 400, height: 400, nodes: [node1]
            });

            diagram.appendTo('#diagram123');

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking PortVisibility - Hover', (done: Function) => {
            expect((diagram.nodes[0] as Node).wrapper.children[1].visible === false).toBe(true);
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.mouseMoveEvent(diagramCanvas, 60, 60, false, false);
            expect((diagram.nodes[0] as Node).wrapper.children[1].visible === false).toBe(true);
            mouseEvents.mouseMoveEvent(diagramCanvas, 160, 260, false, false);
            expect((diagram.nodes[0] as Node).wrapper.children[1].visible === false).toBe(true);
            done();
        });
    });
});