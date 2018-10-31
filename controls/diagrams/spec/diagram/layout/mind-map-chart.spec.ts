/**
 * Diagram spec document
 */
import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import {
    ConnectorModel, Node,
    DataBinding, HierarchicalTree, NodeModel, Rect, TextElement, LayoutAnimation, Container, StackPanel, ImageElement, TreeInfo, TextModel
} from '../../../src/diagram/index';
import { MindMap } from '../../../src/diagram/layout/mind-map';
import { SpatialSearch } from '../../../src/diagram/interaction/spatial-search/spatial-search';
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
                dataSourceSettings: { id: 'id', parentId: 'parentId', dataManager: items },
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
            expect((bounds.x == -524 || bounds.x == -491 || bounds.x === -552 || bounds.x === -520 || bounds.x === -524) &&
                bounds.y == 155 || bounds.y == 160 &&
                (bounds.width == 1398 || bounds.width == 1451 || bounds.width === 1406 || bounds.width == 1399) &&
                bounds.height == 375 || bounds.height == 360).toBe(true);
            expect(diagram.nodes[5].offsetX == 234.9765625 && diagram.nodes[5].offsetY == 275).toBe(true);
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
            expect(bounds.x == 290 && bounds.y == 108 && (bounds.width == 884 || bounds.width === 914 ||
                bounds.width === 880) && bounds.height == 412).toBe(true);
            expect(diagram.nodes[5].offsetX == 415.0234375 && diagram.nodes[5].offsetY == 275).toBe(true);
            done();
        });
        it('Checking Right Layout', (done: Function) => {
            diagram.layout.getBranch = (node: NodeModel, nodes: NodeModel[]) => {
                return 'Right';
            }
            diagram.spatialSearch = new SpatialSearch(diagram.nameTable);
            diagram.dataBind();

            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect((bounds.x == -523 || bounds.x == -519) && (bounds.y == 101 || bounds.y == 108)
                && (bounds.width == 853 || bounds.width == 849 || bounds.width == 878 || bounds.width == 882 || bounds.width == 853) &&
                (bounds.height == 429 || bounds.height == 412)).toBe(true);
            expect(diagram.nodes[5].offsetX == 234.9765625 && diagram.nodes[5].offsetY == 275).toBe(true);
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
            expect((bounds.x == 320 || bounds.x == 451 || bounds.x == 536) && bounds.y == 108 &&
                (bounds.width == 769 || bounds.width == 773 || bounds.width == 642 || bounds.width == 554 || bounds.width == 558) && bounds.height == 412).toBe(true);
            expect(Math.ceil(diagram.nodes[5].offsetX) == 406 && diagram.nodes[5].offsetY == 275).toBe(true);
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
            expect((bounds.x == -443 || bounds.x == -439) && bounds.y == 138 &&
                (bounds.width == 769 || bounds.width == 554 || bounds.width == 558) && bounds.height == 337).toBe(true);
            expect(Math.ceil(diagram.nodes[5].offsetX) == 245 && diagram.nodes[5].offsetY == 275).toBe(true);
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
                dataSourceSettings: { id: 'id', parentId: 'parentId', dataManager: items, root: String(1) },
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
            expect(bounds.x == 290 && bounds.y == 264 && bounds.width == 71 && bounds.height == 22).toBe(true);
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
    });
});

