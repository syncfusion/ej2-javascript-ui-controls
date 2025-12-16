/**
 * Diagram spec document
 */
import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import {
    ConnectorModel, Node,
    DataBinding, HierarchicalTree, NodeModel, Rect, TextElement, LayoutAnimation, GroupableView, StackPanel, ImageElement, TreeInfo, TextModel, ConnectorConstraints, PortVisibility, NodeConstraints, PointPort, SelectorConstraints, SnapConstraints, DiagramTools, HorizontalAlignment, MarginModel, Side, UserHandleModel, VerticalAlignment, Connector, ToolBase, randomId, PointPortModel
} from '../../../src/diagram/index';
import { MindMap } from '../../../src/diagram/layout/mind-map';
import { SpatialSearch } from '../../../src/diagram/interaction/spatial-search/spatial-search';
import { profile, inMB, getMemoryProfile } from '../../../spec/common.spec';
Diagram.Inject(DataBinding, HierarchicalTree, MindMap);
Diagram.Inject(LayoutAnimation);
import { Animation, ISelectionChangeEventArgs } from '../../../src/diagram/objects/interface/IElement'


import { DataManager, Query } from '@syncfusion/ej2-data';
import { MouseEvents } from '../interaction/mouseevents.spec';
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
            diagram = null;
            ele.remove();
            ele = null;
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
                    && (bounds.width == 853 || bounds.width == 849 || bounds.width == 878 || bounds.width == 882 || bounds.width == 670 ||bounds.width == 690 || bounds.width == 853) &&
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
            expect((bounds.x == 320||bounds.x == 300 || bounds.x == 451 || bounds.x == 536) && (bounds.y == 108 || bounds.y == 70) &&
                    (bounds.width == 769 || bounds.width == 773 || bounds.width == 590 || bounds.width == 642 || bounds.width == 554||bounds.width == 610 || bounds.width == 558) && (bounds.height == 412 || bounds.height == 490)).toBe(true);
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
                    (bounds.width == 769 || bounds.width == 554 || bounds.width == 590 ||bounds.width == 610|| bounds.width == 558) && (bounds.height == 337 || bounds.height == 435)).toBe(true);
                expect(Math.ceil(diagram.nodes[5].offsetX) == 245 || diagram.nodes[5].offsetX == 255 && (diagram.nodes[5].offsetY == 275 || diagram.nodes[5].offsetY == 222.5)).toBe(true);
            done();
        });
    });
    describe('default branch and without root ', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll(() => {
            ele = createElement('div', { id: 'diagram1' });
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
            diagram.appendTo('#diagram1');
        });
        afterAll(() => {
            diagram.destroy();
            diagram = null;
            ele.remove();
            ele = null;
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
            ele = createElement('div', { id: 'diagram2' });
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
            diagram.appendTo('#diagram2');
        });
        afterAll(() => {
            diagram.destroy();
            diagram = null;
            ele.remove();
            ele = null;
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
            ele = createElement('div', { id: 'diagram3' });
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
            diagram.appendTo('#diagram3');
        });
        afterAll(() => {
            diagram.destroy();
            diagram = null;
            ele.remove();
            ele = null;
        });
        it('Without datasource without root', (done: Function) => {
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == 465 && bounds.y == 465 && bounds.width == 270 && bounds.height == 70).toBe(true);
            expect(diagram.nodes[0].offsetX == 500 && diagram.nodes[0].offsetY == 500).toBe(true);
            done();
        });
    });
    describe('Vertical Orientation in mindmap', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let data: object[] = [
            { id: 1, Label: "Creativity", fill: "red", branch: "Root" },
            { id: 3, Label: "Brainstorming", parentId: 1, branch: "Right", fill: "red" },
            { id: 4, Label: "Complementing", parentId: 1, branch: "Left", fill: "red" },
            { id: 22, Label: "Sessions", parentId: 3, branch: "subRight", fill: "red" },
            { id: 23, Label: "Generate", parentId: 3, branch: "subRight", fill: "red" },
            { id: 25, Label: "Local", parentId: 22, branch: "subRight" },
            { id: 26, Label: "Remote", parentId: 22, branch: "subRight" },
            { id: 27, Label: "Individual", parentId: 22, branch: "subRight" },
            { id: 28, Label: "Teams", parentId: 22, branch: "subRight" },
            { id: 29, Label: "Ideas", parentId: 23, branch: "subRight" },
            { id: 30, Label: "Engagement", parentId: 23, branch: "subRight" },
            { id: 31, Label: "Product", parentId: 29, branch: "subRight" },
            { id: 32, Label: "Service", parentId: 29, branch: "subRight" },
            { id: 33, Label: "Business Direction", parentId: 29, branch: "subRight" },
            { id: 34, Label: "Empowering", parentId: 30, branch: "subRight" },
            { id: 35, Label: "Ownership", parentId: 30, branch: "subRight" },
            { id: 50, Label: "Information", parentId: 4, branch: "subLeft" },
            { id: 51, Label: "Expectations", parentId: 4, branch: "subLeft" },
            { id: 53, Label: "Competitors", parentId: 50, branch: "subLeft" },
            { id: 54, Label: "Products", parentId: 50, branch: "subLeft" },
            { id: 55, Label: "Features", parentId: 50, branch: "subLeft" },
            { id: 56, Label: "Other Data", parentId: 50, branch: "subLeft" },
            { id: 59, Label: "Organization", parentId: 51, branch: "subLeft" },
            { id: 60, Label: "Customer", parentId: 51, branch: "subLeft" },
            { id: 61, Label: "Staff", parentId: 51, branch: "subLeft" },
            { id: 62, Label: "Stakeholders", parentId: 51, branch: "subLeft" }
        ];

        let items: DataManager = new DataManager(data as JSON[], new Query().take(7));

        beforeAll(() => {
            ele = createElement('div', { id: 'diagram4' });
            document.body.appendChild(ele);

             diagram = new Diagram({
                width: '100%', height: '550px',
                layout: { type: 'MindMap',verticalAlignment : 'Auto', horizontalAlignment : 'Auto' , verticalSpacing : 20, horizontalSpacing : 40},
                dataSourceSettings: { id: 'id', parentId: 'parentId', dataSource: items, root: String(1) },
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
            diagram.appendTo('#diagram4');
        });
        afterAll(() => {
            diagram.destroy();
            diagram = null;
            ele.remove();
            ele = null;
        });
        it('vertical Orientation in mindmap', (done: Function) => {
            expect(diagram.layout.orientation === 'TopToBottom').toBe(true);
            diagram.layout.orientation = 'Horizontal';
            expect(diagram.layout.orientation === 'Horizontal').toBe(true);
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            console.log("bounds");
            console.log(bounds.x,bounds.y,bounds.width,bounds.height);
            expect(bounds.x == -31 && bounds.y == 107  && bounds.width == 918  && bounds.height == 341).toBe(false);
            done();
        });
    });

    describe('Without datasource and without root ', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll(() => {
            ele = createElement('div', { id: 'diagram5' });
            document.body.appendChild(ele);
            let node: NodeModel = { id: 'node1', offsetX: 550, offsetY: 750, width: 70, height: 70, annotations: [{ content: 'node1' }] };
            diagram = new Diagram({
                width: 500, height: 700, nodes: [node],
                layout: { type: 'MindMap' },
            });
            diagram.appendTo('#diagram5');
        });
        afterAll(() => {
            diagram.destroy();
            diagram = null;
            ele.remove();
            ele = null;
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
            ele = createElement('div', { id: 'diagram6' });
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
            diagram.appendTo('#diagram6');
        });
        afterAll(() => {
            diagram.destroy();
            diagram = null;
            ele.remove();
            ele = null;
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
            ele = createElement('div', { id: 'diagram7' });
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
            diagram.appendTo('#diagram7');
        });
        afterAll(() => {
            diagram.destroy();
            diagram = null;
            ele.remove();
            ele = null;
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
    describe('bring into view in mindmap sample', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();
        let data: object[] = [
            { id: 1, Label: "Creativity", fill: "red", branch: "Root" },
            { id: 3, Label: "Brainstorming", parentId: 1, branch: "Right", fill: "red" },
            { id: 4, Label: "Complementing", parentId: 1, branch: "Left", fill: "red" },
            { id: 22, Label: "Sessions", parentId: 3, branch: "subRight", fill: "red" },
            { id: 23, Label: "Generate", parentId: 3, branch: "subRight", fill: "red" },
            { id: 25, Label: "Local", parentId: 22, branch: "subRight" },
            { id: 26, Label: "Remote", parentId: 22, branch: "subRight" },
            { id: 27, Label: "Individual", parentId: 22, branch: "subRight" },
            { id: 28, Label: "Teams", parentId: 22, branch: "subRight" },
            { id: 29, Label: "Ideas", parentId: 23, branch: "subRight" },
            { id: 30, Label: "Engagement", parentId: 23, branch: "subRight" },
            { id: 31, Label: "Product", parentId: 29, branch: "subRight" },
            { id: 32, Label: "Service", parentId: 29, branch: "subRight" },
            { id: 33, Label: "Business Direction", parentId: 29, branch: "subRight" },
            { id: 34, Label: "Empowering", parentId: 30, branch: "subRight" },
            { id: 35, Label: "Ownership", parentId: 30, branch: "subRight" },
            { id: 50, Label: "Information", parentId: 4, branch: "subLeft" },
            { id: 51, Label: "Expectations", parentId: 4, branch: "subLeft" },
            { id: 53, Label: "Competitors", parentId: 50, branch: "subLeft" },
            { id: 54, Label: "Products", parentId: 50, branch: "subLeft" },
            { id: 55, Label: "Features", parentId: 50, branch: "subLeft" },
            { id: 56, Label: "Other Data", parentId: 50, branch: "subLeft" },
            { id: 59, Label: "Organization", parentId: 51, branch: "subLeft" },
            { id: 60, Label: "Customer", parentId: 51, branch: "subLeft" },
            { id: 61, Label: "Staff", parentId: 51, branch: "subLeft" },
            { id: 62, Label: "Stakeholders", parentId: 51, branch: "subLeft" }
        ];

        let items: DataManager = new DataManager(data as JSON[], new Query().take(7));
        function getNodeDefaults(obj: Node): Node {
            obj.constraints = NodeConstraints.Default & ~NodeConstraints.Drag;
            let empInfo: EmployeeInfo = obj.data as EmployeeInfo;
            if (empInfo.branch === 'Left' || empInfo.branch === 'Right'
                || empInfo.branch === 'Root') {
                obj.shape = { type: 'Basic', shape: 'Ellipse' }; obj.borderColor = 'black'; /* tslint:disable:no-string-literal */
                obj.style = {
                    fill: empInfo.branch === 'Root' ? '#E74C3C' : '#F39C12', strokeColor: 'none',
                    strokeWidth: 2
                };
                obj.annotations = [{
                    content: empInfo.Label, margin: { left: 10, right: 10, top: 10, bottom: 10 },
                    style: { color: 'white' }
                }];
                let port: PointPortModel[] = getPort();
                for (let i: number = 0; i < port.length; i++) {
                    obj.ports.push(new PointPort(obj, 'ports', port[i], true));
                }
                hideUserHandle('Top');
            } else {
                let color: string; /* tslint:disable:no-string-literal */
                if (empInfo.branch === 'Right' || empInfo.branch === 'subRight') {
                    color = '#8E44AD';
                } else {
                    color = '#3498DB';
                }
                obj.shape = { type: 'Basic', shape: 'Rectangle' };
                obj.style = { fill: color, strokeWidth: 0 };
                obj.minWidth = 100;
                obj.height = 4;
                let port: PointPortModel[] = getPort();
                for (let i: number = 0; i < port.length; i++) {
                    obj.ports.push(new PointPort(obj, 'ports', port[i], true));
                }
                obj.annotations = [{
                    content: empInfo.Label, offset: { x: .5, y: 0 }, verticalAlignment: 'Bottom'
                }];
                (obj.shape as TextModel).margin = { left: 0, right: 0, top: 0, bottom: 0 };
            }
            return obj;
        }
        //sets connector default value
        function getConnectorDefaults(connector: ConnectorModel, diagram: Diagram): ConnectorModel {
            connector.type = 'Bezier';
            connector.targetDecorator = { shape: 'None' };
            connector.constraints &= ~ConnectorConstraints.Select;
            let sourceNode: Node = diagram.getObject(connector.sourceID) as Node;
            let targetNode: Node = diagram.getObject(connector.targetID) as Node;
            let nodeInfo: EmployeeInfo = (targetNode.data as EmployeeInfo);
            if (nodeInfo.branch === 'Right' || nodeInfo.branch === 'subRight') {
                connector.sourcePortID = sourceNode.ports[0].id;
                connector.targetPortID = targetNode.ports[1].id;
                connector.style = { strokeWidth: 5, strokeColor: '#8E44AD' };
            } else if (nodeInfo.branch === 'Left' || nodeInfo.branch === 'subLeft') {
                connector.sourcePortID = sourceNode.ports[1].id;
                connector.targetPortID = targetNode.ports[0].id;
                connector.style = { strokeWidth: 5, strokeColor: '#3498DB' };
            }
            return connector;
        }
        //creation of the Ports
        function getPort(): PointPortModel[] {
            let port: PointPortModel[] = [
                {
                    id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Hidden,
                    style: { fill: 'black' }
                },
                {
                    id: 'port2', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Hidden,
                    style: { fill: 'black' }
                }
            ];
            return port;
        }
        
        //Selectionchange event for Node and connector
        function selectionChange(arg: ISelectionChangeEventArgs): void {
            if (arg.state === 'Changing') {
                if (arg.newValue[0] instanceof Node) {
                    let empInfo: EmployeeInfo = ((arg.newValue[0] as Node).data as EmployeeInfo);
                    for (let handle of diagram.selectedItems.userHandles) {
                        handle.visible = true;
                    }
                    if (empInfo.branch === 'Left' || empInfo.branch === 'subLeft') {
                        hideUserHandle('leftHandle');
                        changeUserHandlePosition('leftHandle');
                    } else if (empInfo.branch === 'Right' || empInfo.branch === 'subRight') {
                        hideUserHandle('rightHandle');
                        changeUserHandlePosition('rightHandle');
                    } else if (empInfo.branch === 'Root') {
                        hideUserHandle('delete');
                    }
                } else {
                    hideUserHandle('leftHandle');
                    hideUserHandle('rightHandle');
                    hideUserHandle('delete');
                }
            }
        }
        
        function addNode(): NodeModel {
            let obj: NodeModel = {};
            obj.id = randomId();
            obj.data = {};
            (obj.data as EmployeeInfo).Label = 'Node';
            return obj;
        }
        
        function addConnector(source: NodeModel, target: NodeModel): ConnectorModel {
            let connector: ConnectorModel = {};
            connector.id = randomId();
            connector.sourceID = source.id; connector.targetID = target.id;
            return connector;
        }
        
        //Tool for Userhandles.
        function getTool(action: string): ToolBase {
            let tool: any;
            if (action === 'leftHandle') {
                tool = new LeftExtendTool(diagram.commandHandler);
            } else if (action === 'rightHandle') {
                tool = new RightExtendTool(diagram.commandHandler);
            } else if (action === 'delete') {
                tool = new DeleteClick(diagram.commandHandler);
            }
            return tool;
        }

        class LeftExtendTool extends ToolBase {
            //mouseDown event
            public mouseDown(args: any): void {
                super.mouseDown(args);
                this.inAction = true;
            }
            //mouseUp event
            public mouseUp(args: any): void {
                if (this.inAction) {
                    let selectedObject: any = this.commandHandler.getSelectedObject();
                    if (selectedObject[0]) {
                        if (selectedObject[0] instanceof Node) {
                            let node: NodeModel = addNode();
                            let empInfo: EmployeeInfo = selectedObject[0].data as EmployeeInfo;
                            if (empInfo.branch === 'Root') {
                                (node.data as EmployeeInfo).branch = 'Right';
                            } else if (empInfo.branch === 'Right' || empInfo.branch === 'subRight') {
                                (node.data as EmployeeInfo).branch = 'subRight';
                            }
                            let connector: ConnectorModel = addConnector(selectedObject[0], node);
                            diagram.clearSelection();
                            let nd: Node = diagram.add(node) as Node;
                            diagram.add(connector);
                            diagram.doLayout();
                            diagram.bringIntoView(nd.wrapper.bounds);
                            diagram.startTextEdit(nd);
                        }
                    }
                }
            }
        }
        class RightExtendTool extends ToolBase {
            //mouseDown event
            public mouseDown(args:any): void {
                super.mouseDown(args);
                this.inAction = true;
            }
            //mouseUp event
            public mouseUp(args: any): void {
                if (this.inAction) {
                    let selectedObject: any = this.commandHandler.getSelectedObject();
                    if (selectedObject[0]) {
                        if (selectedObject[0] instanceof Node) {
                            let node: NodeModel = addNode();
                            if ((selectedObject[0].data as EmployeeInfo).branch === 'Root') {
                                (node.data as EmployeeInfo).branch = 'Left';
                            } else if ((selectedObject[0].data as EmployeeInfo).branch === 'Left' ||
                                (selectedObject[0].data as EmployeeInfo).branch === 'subLeft') {
                                (node.data as EmployeeInfo).branch = 'subLeft';
                            }
                            let connector: ConnectorModel = addConnector(selectedObject[0], node);
                            diagram.clearSelection();
                            let nd: Node = diagram.add(node) as Node;
                            diagram.add(connector);
                            diagram.doLayout();
                            diagram.bringIntoView(nd.wrapper.bounds);
                            diagram.startTextEdit(nd);
                        }
                    }
                }
            }
        }
        class DeleteClick extends ToolBase {
            //mouseDown event
            public mouseDown(args: any): void {
                super.mouseDown(args);
                this.inAction = true;
            }
            //mouseup event
            public mouseUp(args: any): void {
                if (this.inAction) {
                    let selectedObject: any = this.commandHandler.getSelectedObject();
                    if (selectedObject[0]) {
                        if (selectedObject[0] instanceof Node) {
                            let node: Node = selectedObject[0] as Node;
                            this.removeSubChild(node);
                        }
                        diagram.doLayout();
                    }
                }
            }
            //Remove the subchild Elements
            private removeSubChild(node: Node): void {
                for (let i: number = node.outEdges.length - 1; i >= 0; i--) {
                    let connector: Connector = diagram.getObject(node.outEdges[i]) as Connector;
                    let childNode: Node = diagram.getObject(connector.targetID) as Node;
                    if (childNode.outEdges.length > 0) {
                        this.removeSubChild(childNode);
                    } else {
                        diagram.remove(childNode);
                    }
                }
                diagram.remove(node);
            }
        }
        //hide the require userhandle.
        function hideUserHandle(name: string): void {
            for (let handle of diagram.selectedItems.userHandles) {
                if (handle.name === name) {
                    handle.visible = false;
                }
            }
        }
        let leftarrow: string = 'M11.924,6.202 L4.633,6.202 L4.633,9.266 L0,4.633 L4.632,0 L4.632,3.551 L11.923,3.551 L11.923,6.202Z';
        let rightarrow: string = 'M0,3.063 L7.292,3.063 L7.292,0 L11.924,4.633 L7.292,9.266 L7.292,5.714 L0.001,5.714 L0.001,3.063Z';
        let deleteicon: string = 'M 7.04 22.13 L 92.95 22.13 L 92.95 88.8 C 92.95 91.92 91.55 94.58 88.76' +
            '96.74 C 85.97 98.91 82.55 100 78.52 100 L 21.48 100 C 17.45 100 14.03 98.91 11.24 96.74 C 8.45 94.58 7.04' +
            '91.92 7.04 88.8 z M 32.22 0 L 67.78 0 L 75.17 5.47 L 100 5.47 L 100 16.67 L 0 16.67 L 0 5.47 L 24.83 5.47 z';
        
        let leftuserhandle: UserHandleModel = setUserHandle(//it is in dedicated line here.
            'leftHandle', leftarrow, 'Left', 1,
            { top: 0, bottom: 0, left: 0, right: 10 }, 'Left', 'Top');
        let rightuserhandle: UserHandleModel = setUserHandle(//it is in dedicated line here.
            'rightHandle', rightarrow, 'Right', 1,
            { top: 0, bottom: 0, left: 10, right: 0 }, 'Right', 'Top');
        let deleteuserhandle: UserHandleModel = setUserHandle(//it is in dedicated line here.
            'delete', deleteicon, 'Top', 0.5,
            { top: 0, bottom: 10, left: 0, right: 0 }, 'Center', 'Center');
        let handle: UserHandleModel[] = [leftuserhandle, rightuserhandle, deleteuserhandle];
        //set and creation of the Userhandle.
        function setUserHandle(//it is in dedicated line here.
            name: string, pathData: string, side: Side, offset: number, margin: MarginModel,
            halignment: HorizontalAlignment, valignment: VerticalAlignment): UserHandleModel {
            let userhandle: UserHandleModel = {
                name: name, pathData: pathData, backgroundColor: 'black', pathColor: 'white', side: side,
                offset: offset, margin: margin, horizontalAlignment: halignment, verticalAlignment: valignment
            };
            return userhandle;
        }
        //Change the Position of the UserHandle.
        function changeUserHandlePosition(change: string): void {
            for (let handle of diagram.selectedItems.userHandles) {
                if (handle.name === 'delete' && change === 'leftHandle') {
                    applyHandle(handle, 'Left', { top: 0, bottom: 0, left: 0, right: 10 }, 'Left');
        
                } else if (handle.name === 'delete' && change === 'rightHandle') {
                    applyHandle(handle, 'Right', { top: 0, bottom: 0, left: 10, right: 0 }, 'Right');
                }
            }
        }
        //set the value for UserHandle element.
        function applyHandle(//it is in dedicated line here.
            handle: UserHandleModel, side: Side, margin: MarginModel, halignment: HorizontalAlignment): void {
            handle.side = side;
            handle.offset = 1;
            handle.margin = margin;
            handle.horizontalAlignment = halignment;
            handle.verticalAlignment = 'Top';
        }
  
        beforeAll(() => {
            ele = createElement('div', { id: 'diagram8' });
            document.body.appendChild(ele);

            diagram = new Diagram({
                            width: '100%', height: '550px',
                snapSettings: { constraints: SnapConstraints.None }, tool: DiagramTools.SingleSelect,
                layout: {
                    type: 'MindMap',orientation:'LeftToRight', getBranch: (node: Node) => {
                        return ((node as Node).data as EmployeeInfo).branch;
                    }, horizontalSpacing: 50
                },
                //Selectionchange event for Node and connector
                selectionChange: selectionChange,
                selectedItems: { constraints: SelectorConstraints.UserHandle, userHandles: handle },
                dataSourceSettings: { id: 'id', parentId: 'parentId', dataSource: items, root: String(1) },
                //sets node default value
                getNodeDefaults: getNodeDefaults,
                //sets connector default value 
                getConnectorDefaults: getConnectorDefaults,
                getCustomTool: getTool
            });
            diagram.appendTo('#diagram8');
            diagram.fitToPage();
        });
        afterAll(() => {
            diagram.destroy();
            diagram = null;
            ele.remove();
            ele = null;
        });
        // it('mindmap expand collapse icon not working issue fix ', (done: Function) => {
        //     let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        //     diagram.select([diagram.nodes[17]]);
        //     let handle: any = document.getElementById('rightHandle_userhandle').getBoundingClientRect();
        //         mouseEvents.mouseDownEvent(diagramCanvas, handle.x + diagram.element.offsetLeft, handle.y + diagram.element.offsetTop);
        //         mouseEvents.mouseUpEvent(diagramCanvas,handle.x + diagram.element.offsetLeft, handle.y + diagram.element.offsetTop);
        //     expect(diagram.nodes[26].visible && diagram.nodes[26].visible).toBe(true);
        //     done();
        // });
    });

    const workingData =  [
        { id: "1", label: "Business Planning", parentId: "", branch: "Root", fill: "#034d6d", hasChild: true, level: 0, strokeColor: "#034d6d", orientation: "Root" },
        { id: "2", label: "Expectation", parentId: "1", branch: "Left", fill: "#1b80c6", hasChild: true, level: 1, strokeColor: "#1b80c6", orientation: "Left" },
        { id: "3", label: "Requirements", parentId: "1", branch: "Right", fill: "#1b80c6", hasChild: true, level: 1, strokeColor: "#1b80c6", orientation: "Right" },
        { id: "4", label: "Marketing", parentId: "1", branch: "Left", fill: "#1b80c6", hasChild: true, level: 1, strokeColor: "#1b80c6", orientation: "Left" },
        { id: "5", label: "Budgets", parentId: "1", branch: "Right", fill: "#1b80c6", hasChild: true, level: 1, strokeColor: "#1b80c6", orientation: "Right" },
        { id: "6", label: "Situation in Market", parentId: "1", branch: "Left", fill: "#1b80c6", hasChild: true, level: 1, strokeColor: "#1b80c6", orientation: "Left" },
        { id: "7", label: "Product Sales", parentId: "2", branch: "SubLeft", fill: "#3dbfc9", hasChild: false, level: 2, strokeColor: "#3dbfc9", orientation: "SubLeft" },
        { id: "8", label: "Strategy", parentId: "2", branch: "SubLeft", fill: "#3dbfc9", hasChild: false, level: 2, strokeColor: "#3dbfc9", orientation: "SubLeft" },
        { id: "9", label: "Contacts", parentId: "2", branch: "SubLeft", fill: "#3dbfc9", hasChild: false, level: 2, strokeColor: "#3dbfc9", orientation: "SubLeft" },
        { id: "10", label: "Customer Groups", parentId: "4", branch: "SubLeft", fill: "#3dbfc9", hasChild: false, level: 2, strokeColor: "#3dbfc9", orientation: "SubLeft" },
        { id: "11", label: "Branding", parentId: "4", branch: "SubLeft", fill: "#3dbfc9", hasChild: false, level: 2, strokeColor: "#3dbfc9", orientation: "SubLeft" },
        { id: "12", label: "Advertising", parentId: "4", branch: "SubLeft", fill: "#3dbfc9", hasChild: false, level: 2, strokeColor: "#3dbfc9", orientation: "SubLeft" },
        { id: "13", label: "Competitors", parentId: "6", branch: "SubLeft", fill: "#3dbfc9", hasChild: false, level: 2, strokeColor: "#3dbfc9", orientation: "SubLeft" },
        { id: "14", label: "Location", parentId: "6", branch: "SubLeft", fill: "#3dbfc9", hasChild: false, level: 2, strokeColor: "#3dbfc9", orientation: "SubLeft" },
        { id: "15", label: "Director", parentId: "3", branch: "SubRight", fill: "#3dbfc9", hasChild: false, level: 2, strokeColor: "#3dbfc9", orientation: "SubRight" },
        { id: "16", label: "Accounts Department", parentId: "3", branch: "SubRight", fill: "#3dbfc9", hasChild: false, level: 2, strokeColor: "#3dbfc9", orientation: "SubRight" },
        { id: "17", label: "Administration", parentId: "3", branch: "SubRight", fill: "#3dbfc9", hasChild: false, level: 2, strokeColor: "#3dbfc9", orientation: "SubRight" },
        { id: "18", label: "Development", parentId: "3", branch: "SubRight", fill: "#3dbfc9", hasChild: false, level: 2, strokeColor: "#3dbfc9", orientation: "SubRight" },
        { id: "19", label: "Estimation", parentId: "5", branch: "SubRight", fill: "#3dbfc9", hasChild: false, level: 2, strokeColor: "#3dbfc9", orientation: "SubRight" },
        { id: "20", label: "Profit", parentId: "5", branch: "SubRight", fill: "#3dbfc9", hasChild: false, level: 2, strokeColor: "#3dbfc9", orientation: "SubRight" },
        { id: "21", label: "Funds", parentId: "5", branch: "SubRight", fill: "#3dbfc9", hasChild: false, level: 2, strokeColor: "#3dbfc9", orientation: "SubRight" }
    ];

    describe('Mindmap import export as mermaid', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll(() => {
            ele = createElement('div', { id: 'mindmapimportexport' });
            document.body.appendChild(ele);
            diagram = new Diagram({
                width: '100%', height: '900px',
                layout:{
                    type:'MindMap',
                    verticalSpacing: 50,
                    horizontalSpacing: 50,
                    orientation: 'Horizontal',
                },
                dataSourceSettings: { id: 'id', parentId: 'parentId', dataSource: new DataManager(workingData)},
                getNodeDefaults: (obj: Node) => {
                    obj.width = 120;
                    obj.height = 50;
                    obj.style = { fill: '#8df9c6', strokeColor: '#8df9c6',strokeWidth: 2 };
                    obj.annotations = [{ content: obj.data ? (obj.data as any).label: obj.annotations.length ? obj.annotations[0].content:'', style: { color: 'black' } }];
                    return obj;
                }, getConnectorDefaults: (connector: ConnectorModel, diagram: Diagram) => {
                    connector.type = 'Bezier';
                    connector.targetDecorator = { shape: 'None' };
                    connector.style = { strokeColor: '#08cd70 ', strokeWidth: 1 };
                    return connector;
                }
            });
            diagram.appendTo('#mindmapimportexport');
        });
        afterAll(() => {
            diagram.destroy();
            diagram = null;
            ele.remove();
            ele = null;
        });
        it('Export mindmap in mermaid format', (done: Function) => {
            const data = diagram.saveDiagramAsMermaid();
            expect(data !== '' && data.includes('mindmap')).toBe(true);
            done();
        });
        it('Importing and exporting mindmap layout', (done: Function) => {
            let mermaidMindmap = `mindmap
                          root((Mobile Banking Registration))
                            User(User)
                            PersonalInfo))Personal Information((
                                Name)Name(
                                DOB[Date of Birth]
                                Address((Address))
                            ContactInfo{{Contact Information}}
                                Email((Email))
                                Phone((Phone Number))
                            Account((Account))
                            AccountType((Account Type))
                                Savings((Savings))
                                Checking((Checking))
                            AccountDetails((Account Details))
                                AccountNumber((Account Number))
                                SortCode((Sort Code))
                            Security((Security))
                            Authentication((Authentication))
                                Password((Password))
                                Biometrics((Biometrics))
                                Fingerprint((Fingerprint))
                                FaceID((Face ID))
                            Verification((Verification))
                                OTP((OTP))
                                SecurityQuestions((Security Questions))
                            Terms((Terms & Conditions))
                            AcceptTerms((Accept Terms))
                            PrivacyPolicy((Privacy Policy))`;
    
            diagram.loadDiagramFromMermaid(mermaidMindmap);
            expect(diagram.nodes.length === 28).toBe(true);
            let saveData1 = diagram.saveDiagramAsMermaid();
            diagram.loadDiagramFromMermaid(saveData1);
            let saveData2 = diagram.saveDiagramAsMermaid();
            diagram.loadDiagramFromMermaid(saveData2);
            let saveData3 = diagram.saveDiagramAsMermaid();
            diagram.loadDiagramFromMermaid(saveData3);
            expect(diagram.nodes.length === 28).toBe(true);
            done();
        });
        it('Importing and exporting different type of mermaid code', (done: Function) => {
            let mermaidMindmap = `mindmap
                                  Root
                                    A
                                        B
                                      C`;
    
            diagram.loadDiagramFromMermaid(mermaidMindmap);
            expect(diagram.nodes.length === 4).toBe(true);
            let saveData1 = diagram.saveDiagramAsMermaid();
            diagram.loadDiagramFromMermaid(saveData1);
            expect(diagram.nodes.length === 4).toBe(true);
            done();
        });
        it('Importing and exporting different type of mermaid code 2', (done: Function) => {
            let mermaidMindmap = `mindmap
                                    id1["\`**Root** with\n
    a second line\n
    Unicode works too: 🤓\`"]
                                      id2["\`The dog in **the** hog... a *very long text* that wraps to a new line\`"]
                                      id3[Regular labels still works]`;
            let mermaidMindmap2 = `mindmap
                                      id1["\`**Root** with a single line Unicode works too: 🤓\`"]
                                        id2["\`The dog in **the** hog... \n
    a *very long text* that wraps \n
    to a new line\`"]
                                        id3[Regular labels still works]`;
    
            diagram.loadDiagramFromMermaid(mermaidMindmap);
            expect(diagram.nodes.length === 3).toBe(true);
            let saveData1 = diagram.saveDiagramAsMermaid();
            diagram.loadDiagramFromMermaid(saveData1);
            expect(diagram.nodes.length === 3).toBe(true);
            diagram.loadDiagramFromMermaid(mermaidMindmap2);
            expect(diagram.nodes.length === 3).toBe(true);
            let saveData2 = diagram.saveDiagramAsMermaid();
            diagram.loadDiagramFromMermaid(saveData1);
            expect(diagram.nodes.length === 3).toBe(true);
            done();
        });
        // it('Load unclear indentation', (done: Function) => {
        //     let data = `mindmap
        //                   Root
        //                     A
        //                         B
        //                     C`;
        //     diagram.loadDiagramFromMermaid(data);
        //     expect().toBe(true);
        //     done();
        // });
    });
    

});
export interface EmployeeInfo {
    branch: string;
    color: string;
    Left: string;
    Right: string;
    Root: string;
    Label: string;
}

