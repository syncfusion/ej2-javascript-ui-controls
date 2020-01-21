/**
 * Diagram spec document
 */
import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import {
    ConnectorModel, Node,
    DataBinding, HierarchicalTree, NodeModel, Rect, TextElement, LayoutAnimation, Container, StackPanel, ImageElement, TreeInfo, TextModel, ConnectorConstraints, PortVisibility, NodeConstraints, PointPort
} from '../../../src/diagram/index';
import { MindMap } from '../../../src/diagram/layout/mind-map';
import { SpatialSearch } from '../../../src/diagram/interaction/spatial-search/spatial-search';
import { profile, inMB, getMemoryProfile } from '../../../spec/common.spec';
Diagram.Inject(DataBinding, HierarchicalTree, MindMap);
Diagram.Inject(LayoutAnimation);
import { Animation } from '../../../src/diagram/objects/interface/IElement'


import { DataManager, Query } from '@syncfusion/ej2-data';
/**
 * MindMapTree
 */



let data: object[] = [
    { id: 1, Label: 'StackPanel' },
    { id: 2, Label: 'Label', parentId: 1 },
    { id: 3, Label: 'ListBox', parentId: 1 },
    { id: 4, Label: 'StackPanel', parentId: 1 },
    { id: 5, Label: 'Border', parentId: 2 },
    { id: 6, Label: 'Border', parentId: 3 },
    { id: 7, Label: 'Button', parentId: 4 },
    { id: 8, Label: 'ContentPresenter', parentId: 5 },
    { id: 9, Label: 'Text Block', parentId: 8 },
    { id: 10, Label: 'ScrollViewer', parentId: 6 },
    { id: 11, Label: 'Grid', parentId: 10 },
    { id: 12, Label: 'Rectangle', parentId: 11 },
    { id: 13, Label: 'ScrollContentPresenter', parentId: 11 },
    { id: 14, Label: 'ScrollBar', parentId: 11 },
    { id: 15, Label: 'ScrollBar', parentId: 11 },
    { id: 16, Label: 'ItemsPresenter', parentId: 13 },
    { id: 17, Label: 'AdornerLayer', parentId: 13 },
    { id: 18, Label: 'VirtualizingStackPanel', parentId: 15 },
    { id: 19, Label: 'ListBoxItem', parentId: 18 },
    { id: 20, Label: 'ListBoxItem', parentId: 18 },
    { id: 21, Label: 'Border', parentId: 19 },
    { id: 22, Label: 'ContentPresenter', parentId: 19 },
    { id: 23, Label: 'TextBlock', parentId: 19 },
    { id: 24, Label: 'Border', parentId: 20 },
    { id: 25, Label: 'ContentPresenter', parentId: 20 },
    { id: 26, Label: 'TextBlock', parentId: 20 },
    { id: 27, Label: 'ButtonChrome', parentId: 7 },
    { id: 28, Label: 'ContentPresenter', parentId: 27 },
    { id: 29, Label: 'TextBlock', parentId: 28 }
];

let datas: object[] = [
    { id: 1, Label: 'StackPanel' },
];





describe('Diagram Control', () => {
    describe('Tree Layout', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll(() => {
            ele = createElement('div', { id: 'diagramMindMap1' });
            document.body.appendChild(ele);
            let items = new DataManager(data, new Query().take(7));
            diagram = new Diagram({
                width: '650px', height: '550px',
                layout: {
                    type: 'MindMap',
                },
                dataSourceSettings: { id: 'id', parentId: 'parentId', dataSource: items },
                getNodeDefaults: (node: Node) => {
                    let obj: NodeModel = {};
                    obj.shape = { type: 'Text', content: (node.data as { Label: 'string' }).Label };
                    obj.style = { fill: 'lightgrey', strokeColor: 'none', strokeWidth: 2 };
                    obj.borderColor = 'black';
                    obj.backgroundColor = 'lightgrey';
                    obj.borderWidth = 1;
                    (obj.shape as TextModel).margin = { left: 5, right: 5, top: 5, bottom: 5 };
                    return obj;
                }, getConnectorDefaults: (obj: ConnectorModel, diagram: Diagram) => {
                    let connector: ConnectorModel = {};
                    connector.type = 'Orthogonal';
                    return connector;
                },
            });
            diagram.appendTo('#diagramMindMap1');
        });
        afterAll(() => {
            diagram.destroy();
            ele.remove();
        });
        it('With default Branch and without root', (done: Function) => {
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect((bounds.x == -524 || bounds.x == -491 || bounds.x == -340 || bounds.x === -552 || bounds.x === -520 || bounds.x === -524) &&
                (bounds.y == 155 || bounds.y == 160 || bounds.y == 130) &&
                (bounds.width == 1398 || bounds.width == 1090 || bounds.width == 1451 || bounds.width === 1406 || bounds.width == 1399) &&
                (bounds.height == 375 || bounds.height == 490 || bounds.height == 360)).toBe(true);
            expect((diagram.nodes[5].offsetX == 234.9765625 || diagram.nodes[5].offsetX == 245) && diagram.nodes[5].offsetY == 275).toBe(true);
            done();
        });
        it('Checking left  layout', (done: Function) => {
            diagram.dataSourceSettings.root = String(1);
            diagram.layout.getBranch = (node: NodeModel, nodes: NodeModel[]) => {
                return 'Left';
            }
            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            console.log(bounds.width);
            expect((bounds.x == 290 || bounds.x == 300 || bounds.x == 290) && (bounds.y == 108 || bounds.y == 70) && (bounds.width == 884 || bounds.width == 690 || bounds.width === 914 ||
                bounds.width == 690 || bounds.width === 880) && (bounds.height == 412 || bounds.height == 490)).toBe(true);
            expect((diagram.nodes[5].offsetX == 415.0234375 || diagram.nodes[5].offsetX == 405) && (diagram.nodes[5].offsetY == 275 || diagram.nodes[5].offsetY == 215)).toBe(true);
            done();
        });
        it('Checking Right Layout', (done: Function) => {
            diagram.layout.getBranch = (node: NodeModel, nodes: NodeModel[]) => {
                return 'Right';
            }
            diagram.spatialSearch = new SpatialSearch(diagram.nameTable);
            diagram.dataBind();

            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect((bounds.x == -523 || bounds.x == -519 || bounds.x == -340) && (bounds.y == 101 || bounds.y == 108 || bounds.y == 70)
                && (bounds.width == 853 || bounds.width == 849 || bounds.width == 878 || bounds.width == 882 || bounds.width == 670 || bounds.width == 853) &&
                (bounds.height == 429 || bounds.height == 412 || bounds.height == 490)).toBe(true);
            expect((diagram.nodes[5].offsetX == 234.9765625 || diagram.nodes[5].offsetX == 245) && (diagram.nodes[5].offsetY == 275 || diagram.nodes[5].offsetY == 215)).toBe(true);
            done();
        });
        it('Checking with horizontal spacing', (done: Function) => {
            diagram.layout.getBranch = (node: NodeModel, nodes: NodeModel[]) => {
                return 'Left';
            };

            diagram.layout.horizontalSpacing = 20;
            diagram.spatialSearch = new SpatialSearch(diagram.nameTable);
            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect((bounds.x == 320 || bounds.x == 451 || bounds.x == 536) && (bounds.y == 108 || bounds.y == 70) &&
                (bounds.width == 769 || bounds.width == 773 || bounds.width == 590 || bounds.width == 642 || bounds.width == 554 || bounds.width == 558) && (bounds.height == 412 || bounds.height == 490)).toBe(true);
            expect(Math.ceil(diagram.nodes[5].offsetX) == 406 || diagram.nodes[5].offsetX == 395 && (diagram.nodes[5].offsetY == 275 || diagram.nodes[5].offsetY == 215)).toBe(true);
            done();
        });
        it('Checking with vertical spacing', (done: Function) => {
            diagram.layout.getBranch = (node: NodeModel, nodes: NodeModel[]) => {
                return 'Right';
            };
            diagram.spatialSearch = new SpatialSearch(diagram.nameTable);
            diagram.layout.verticalSpacing = 20;
            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect((bounds.x == -443 || bounds.x == -439 || bounds.x == -260) && (bounds.y == 138 || bounds.y == 93) &&
                (bounds.width == 769 || bounds.width == 554 || bounds.width == 590 || bounds.width == 558) && (bounds.height == 337 || bounds.height == 435)).toBe(true);
            expect(Math.ceil(diagram.nodes[5].offsetX) == 245 || diagram.nodes[5].offsetX == 255 && (diagram.nodes[5].offsetY == 275 || diagram.nodes[5].offsetY == 222.5)).toBe(true);
            done();
        });
    });
    describe('default branch and without root ', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll(() => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let items = new DataManager(datas, new Query().take(7));
            diagram = new Diagram({
                width: '650px', height: '550px',
                layout: {
                    type: 'MindMap',


                },
                dataSourceSettings: { id: 'id', parentId: 'parentId', dataSource: items, root: String(1) },
                getNodeDefaults: (node: Node) => {
                    let obj: NodeModel = {};
                    obj.shape = { type: 'Text', content: (node.data as { Label: 'string' }).Label };
                    obj.style = { fill: 'lightgrey', strokeColor: 'none', strokeWidth: 2 };
                    obj.borderColor = 'black';
                    obj.backgroundColor = 'lightgrey';
                    obj.borderWidth = 1;
                    (obj.shape as TextModel).margin = { left: 5, right: 5, top: 5, bottom: 5 };
                    return obj;
                }, getConnectorDefaults: (obj: ConnectorModel, diagram: Diagram) => {
                    let connector: ConnectorModel = {};
                    connector.type = 'Orthogonal';
                    return connector;
                },
            });
            diagram.appendTo('#diagram');
        });
        afterAll(() => {
            diagram.destroy();
            ele.remove();
        });
        it('With default Branch and without root', (done: Function) => {
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect((bounds.x == 290 || bounds.x == 300) && (bounds.y == 264 || bounds.y == 250) &&
                (bounds.width == 71 || bounds.width == 50) && (bounds.height == 22 || bounds.height == 50)).toBe(true);
            expect(diagram.nodes[0].offsetX == 325 && diagram.nodes[0].offsetY == 275).toBe(true);
            done();
        });
    });
    describe('Without datasource and with root ', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll(() => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let node: NodeModel = { id: 'node1', width: 70, height: 70, annotations: [{ content: 'node1' }] };
            let node1: NodeModel = { id: 'node2', width: 70, height: 70, annotations: [{ content: 'node2' }] };
            let node2: NodeModel = { id: 'node3', width: 70, height: 70, annotations: [{ content: 'node3' }] };

            let connector: ConnectorModel = { id: 'connectr', sourceID: 'node1', targetID: 'node2' };
            let connector1: ConnectorModel = { id: 'connectr1', sourceID: 'node2', targetID: 'node3' };
            diagram = new Diagram({
                width: 1000, height: 1000, nodes: [node, node1, node2],
                connectors: [connector, connector1,
                ],
                layout: { type: 'MindMap', root: 'node1' },
            });
            diagram.appendTo('#diagram');
        });
        afterAll(() => {
            diagram.destroy();
            ele.remove();
        });
        it('Without datasource with root', (done: Function) => {
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == 465 && bounds.y == 465 && bounds.width == 270 && bounds.height == 70).toBe(true);
            expect(diagram.nodes[0].offsetX == 500 && diagram.nodes[0].offsetY == 500).toBe(true);
            done();
        });
    });
    describe('Without datasource and without root ', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll(() => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let node: NodeModel = { id: 'node1', width: 70, height: 70, annotations: [{ content: 'node1' }] };
            let node1: NodeModel = { id: 'node2', width: 70, height: 70, annotations: [{ content: 'node2' }] };
            let node2: NodeModel = { id: 'node3', width: 70, height: 70, annotations: [{ content: 'node3' }] };

            let connector: ConnectorModel = { id: 'connectr', sourceID: 'node1', targetID: 'node2' };
            let connector1: ConnectorModel = { id: 'connectr1', sourceID: 'node2', targetID: 'node3' };
            diagram = new Diagram({
                width: 1000, height: 1000, nodes: [node, node1, node2],
                connectors: [connector, connector1,
                ],
                layout: { type: 'MindMap' },
            });
            diagram.appendTo('#diagram');
        });
        afterAll(() => {
            diagram.destroy();
            ele.remove();
        });
        it('Without datasource without root', (done: Function) => {
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == 465 && bounds.y == 465 && bounds.width == 270 && bounds.height == 70).toBe(true);
            expect(diagram.nodes[0].offsetX == 500 && diagram.nodes[0].offsetY == 500).toBe(true);
            done();
        });
    });
    describe('Without datasource and without root ', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll(() => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let node: NodeModel = { id: 'node1', offsetX: 550, offsetY: 750, width: 70, height: 70, annotations: [{ content: 'node1' }] };
            diagram = new Diagram({
                width: 500, height: 700, nodes: [node],
                layout: { type: 'MindMap' },
            });
            diagram.appendTo('#diagram');
        });
        afterAll(() => {
            diagram.destroy();
            ele.remove();
        });
        it('Without datasource without root', (done: Function) => {
            diagram.bringIntoView(diagram.nodes[0].wrapper.bounds);
            diagram.startTextEdit(diagram.nodes[0]);
            let editBox = document.getElementById(diagram.element.id + '_editBox');
            (editBox as HTMLInputElement).value = "Node";
            expect(editBox !== null).toBe(true);
            expect((editBox as HTMLInputElement).value === "Node").toBe(true);
            done();
        });
        it('memory leak', () => {
            profile.sample();
            let average: any = inMB(profile.averageChange)
            //Check average change in memory samples to not be over 10MB
            expect(average).toBeLessThan(10);
            let memory: any = inMB(getMemoryProfile())
            //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
            expect(memory).toBeLessThan(profile.samples[0] + 0.25);
        })
    });

    describe('getBranch Support for the Blazor ', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let data: object[] = [
            { id: 1, Label: 'StackPanel', Branch: 'Left' },
            { id: 2, Label: 'Label', parentId: 1, Branch: 'Left' },
            { id: 3, Label: 'ListBox', parentId: 1, Branch: 'Left' },
            { id: 4, Label: 'StackPanel', parentId: 1, Branch: 'Left' },
            { id: 5, Label: 'Border', parentId: 2, Branch: 'Left' },
            { id: 6, Label: 'Border', parentId: 3, Branch: 'Left' },
            { id: 7, Label: 'Button', parentId: 4, Branch: 'Left' },
            { id: 8, Label: 'ContentPresenter', parentId: 5, Branch: 'Left' },
            { id: 9, Label: 'Text Block', parentId: 8, Branch: 'Left' },
            { id: 10, Label: 'ScrollViewer', parentId: 6, Branch: 'Left' },
            { id: 11, Label: 'Grid', parentId: 10, Branch: 'Left' },
            { id: 12, Label: 'Rectangle', parentId: 11, Branch: 'Left' },
            { id: 13, Label: 'ScrollContentPresenter', parentId: 11, Branch: 'Left' },
            { id: 14, Label: 'ScrollBar', parentId: 11, Branch: 'Left' },
            { id: 15, Label: 'ScrollBar', parentId: 11, Branch: 'Left' },
            { id: 16, Label: 'ItemsPresenter', parentId: 13, Branch: 'Left' },
            { id: 17, Label: 'AdornerLayer', parentId: 13, Branch: 'Left' },
            { id: 18, Label: 'VirtualizingStackPanel', parentId: 15, Branch: 'Left' },
            { id: 19, Label: 'ListBoxItem', parentId: 18, Branch: 'Left' },
            { id: 20, Label: 'ListBoxItem', parentId: 18, Branch: 'Left' },
            { id: 21, Label: 'Border', parentId: 19, Branch: 'Left' },
            { id: 22, Label: 'ContentPresenter', parentId: 19, Branch: 'Left' },
            { id: 23, Label: 'TextBlock', parentId: 19, Branch: 'Left' },
            { id: 24, Label: 'Border', parentId: 20, Branch: 'Left' },
            { id: 25, Label: 'ContentPresenter', parentId: 20, Branch: 'Left' },
            { id: 26, Label: 'TextBlock', parentId: 20, Branch: 'Left' },
            { id: 27, Label: 'ButtonChrome', parentId: 7, Branch: 'Left' },
            { id: 28, Label: 'ContentPresenter', parentId: 27, Branch: 'Left' },
            { id: 29, Label: 'TextBlock', parentId: 28, Branch: 'Left' }
        ];
        let items: DataManager = new DataManager(data as JSON[], new Query().take(7));
        beforeAll(() => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);

            diagram = new Diagram({
                width: '100%', height: '550px',
                layout: { type: 'MindMap' },
                dataSourceSettings: {
                    id: 'id', parentId: 'parentId', dataSource: items, root: String(1),
                    dataMapSettings: [{ property: 'Branch', field: 'Branch' }]
                },
                getNodeDefaults: (obj: Node) => {
                    obj.shape = { type: 'Text', content: (obj.data as { Label: 'string' }).Label };
                    obj.style = { fill: 'lightgrey', strokeColor: 'none', strokeWidth: 2 };
                    obj.borderColor = 'black';
                    obj.backgroundColor = 'lightgrey';
                    obj.borderWidth = 1;
                    (obj.shape as TextModel).margin = { left: 5, right: 5, top: 5, bottom: 5 };
                    return obj;
                }, getConnectorDefaults: (connector: ConnectorModel, diagram: Diagram) => {
                    connector.type = 'Orthogonal';
                    return connector;
                }
            });
            diagram.appendTo('#diagram');
        });
        afterAll(() => {
            diagram.destroy();
            ele.remove();
        });
        it('Without datasource without root', (done: Function) => {
            expect(diagram.nodes[0].branch === 'Left').toBe(true);
            done();
        });
    });


    describe('mindmap expand collapse icon not working issue fix ', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let data: object[] = [
            { id: 1, Label: 'Barbie Silks', fill: 'red', branch: 'Root' },
            { id: 2, Label: 'Categories', parentId: 1, branch: 'Right', fill: 'red' },
            { id: 3, Label: 'Products', parentId: 1, branch: 'Right', fill: 'red' },
            { id: 4, Label: 'Orders', parentId: 1, branch: 'Left', fill: 'red' },
            { id: 5, Label: 'Transactions', parentId: 1, branch: 'Left', fill: 'red' },
            { id: 6, Label: 'Users', parentId: 1, branch: 'Left', fill: 'red' },
            { id: 7, Label: 'Create Category', parentId: 2, branch: 'subRight' },
            { id: 8, Label: 'Update Category', parentId: 2, branch: 'subRight' },
            { id: 9, Label: 'Delete Category', parentId: 2, branch: 'subRight' },
            { id: 10, Label: 'Create Product', parentId: 3, branch: 'subRight' },
            { id: 11, Label: 'Update Product', parentId: 3, branch: 'subRight' },
            { id: 12, Label: 'Delete Product', parentId: 3, branch: 'subRight' },
            { id: 13, Label: 'Create Order', parentId: 4, branch: 'subLeft' },
            { id: 14, Label: 'Delete Order', parentId: 4, branch: 'subLeft' },
            { id: 15, Label: 'Initiate Transaction', parentId: 5, branch: 'subLeft' },
            { id: 16, Label: 'Update Transaction', parentId: 5, branch: 'subLeft' },
            { id: 17, Label: 'Cancel Transaction', parentId: 5, branch: 'subLeft' },
            { id: 18, Label: 'Add User', parentId: 6, branch: 'subLeft' },
            { id: 19, Label: 'Update User', parentId: 6, branch: 'subLeft' },
            { id: 20, Label: 'Delete User', parentId: 6, branch: 'subLeft' },
        ];

        let items: DataManager = new DataManager(data as JSON[], new Query().take(7));
        function getPort() {
            let port = [
                {
                    id: "port1",
                    offset: { x: 0, y: 0.5 },
                    visibility: PortVisibility.Hidden,
                    style: { fill: "black" }
                },
                {
                    id: "port2",
                    offset: { x: 1, y: 0.5 },
                    visibility: PortVisibility.Hidden,
                    style: { fill: "black" }
                }
            ];
            return port;
        }
        beforeAll(() => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);

            diagram = new Diagram({
                width: '100%', height: '550px',
                layout: {
                    type: "MindMap",
                    getBranch: (node: any) => {
                        return node.data.branch;
                    },
                    horizontalSpacing: 50
                },
                dataSourceSettings: {
                    id: "id",
                    parentId: "parentId",
                    dataSource: items,
                    root: String(1)
                },
                getNodeDefaults: (obj: any) => {
                    obj.constraints =
                        NodeConstraints.Default & ~NodeConstraints.Drag;
                    if (
                        obj.data.branch === "Left" ||
                        obj.data.branch === "Right" ||
                        obj.data.branch === "Root"
                    ) {
                        obj.shape = { type: "Basic", shape: "Ellipse" };
                        obj.borderColor =
                            "black"; /* tslint:disable:no-string-literal */
                        obj.style = {
                            fill: obj.data.branch === "Root" ? "#E74C3C" : "#F39C12",
                            strokeColor: "none",
                            strokeWidth: 2
                        };
                        obj.annotations = [
                            {
                                content: obj.data.Label,
                                margin: { left: 10, right: 10, top: 10, bottom: 10 },
                                style: { color: "white" }
                            }
                        ];
                        let port = getPort();
                        for (let i = 0; i < port.length; i++) {
                            obj.ports.push(new PointPort(obj, "ports", port[i], true));
                        }
                    } else {
                        let color; /* tslint:disable:no-string-literal */
                        if (
                            obj.data.branch === "Right" ||
                            obj.data.branch === "subRight"
                        ) {
                            color = "#8E44AD";
                        } else {
                            color = "#3498DB";
                        }
                        obj.shape = { type: "Basic", shape: "Rectangle" };
                        obj.style = { fill: color, strokeWidth: 0 };
                        obj.minWidth = 100;
                        obj.height = 4;
                        let port = getPort();
                        for (let i = 0; i < port.length; i++) {
                            obj.ports.push(new PointPort(obj, "ports", port[i], true));
                        }
                        obj.annotations = [
                            {
                                content: obj.data.Label,
                                offset: { x: 0.5, y: 0 },
                                verticalAlignment: "Bottom"
                            }
                        ];
                        obj.shape.margin = {
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: 0
                        };
                    }
                    //define expand icon
                    obj.expandIcon = {
                        height: 10,
                        width: 10,
                        shape: "Minus",
                        fill: "lightgray",
                        offset: { x: 0.5, y: 1 }
                    };
                    //define collapse icon
                    obj.collapseIcon = {
                        height: 10,
                        width: 10,
                        shape: "Plus",
                        fill: "lightgray",
                        offset: { x: 0.5, y: 1 }
                    };
                    return obj;
                }, getConnectorDefaults: (connector: ConnectorModel, diagram: Diagram) => {
                    connector.type = "Bezier";
                    connector.targetDecorator = { shape: "None" };
                    let sourceNode: any = diagram.getObject(connector.sourceID);
                    let targetNode: any = diagram.getObject(connector.targetID);
                    if (
                        targetNode.data.branch === "Right" ||
                        targetNode.data.branch === "subRight"
                    ) {
                        connector.sourcePortID = sourceNode.ports[0].id;
                        connector.targetPortID = targetNode.ports[1].id;
                        connector.style = { strokeWidth: 5, strokeColor: "#8E44AD" };
                    } else if (
                        targetNode.data.branch === "Left" ||
                        targetNode.data.branch === "subLeft"
                    ) {
                        connector.sourcePortID = sourceNode.ports[1].id;
                        connector.targetPortID = targetNode.ports[0].id;
                        connector.style = { strokeWidth: 5, strokeColor: "#3498DB" };
                    }
                    connector.constraints &= ~ConnectorConstraints.Select;
                    return connector;
                }
            });
            diagram.appendTo('#diagram');
        });
        afterAll(() => {
            diagram.destroy();
            ele.remove();
        });
        it('mindmap expand collapse icon not working issue fix ', (done: Function) => {
            expect(diagram.nodes[3].visible && diagram.nodes[4].visible).toBe(true);
            var node = diagram.nodes[1];
            node.isExpanded = false
            diagram.dataBind();
            expect(!diagram.nodes[3].visible && !diagram.nodes[4].visible).toBe(true);
            done();
        });
    });
});

