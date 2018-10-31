/**
 * Diagram spec document
 */
import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import {
    ConnectorModel, Node, TextModel, Connector,
    DataBinding, HierarchicalTree, NodeModel, Rect, TextElement, LayoutAnimation, Container, StackPanel, ImageElement, TreeInfo
} from '../../../src/diagram/index';
Diagram.Inject(DataBinding, HierarchicalTree);
Diagram.Inject(LayoutAnimation);
import { MouseEvents } from '../../../spec/diagram/interaction/mouseevents.spec';
import { Animation } from '../../../src/diagram/objects/interface/IElement'


import { DataManager, Query } from '@syncfusion/ej2-data';
/**
 * Organizational Chart
 */

let assitants: object[] = [
    { 'Id': 'parent', 'Role': 'Board', 'color': '#71AF17' },
    { 'Id': '1', 'Role': 'General Manager', 'Manager': 'parent', 'ChartType': 'Right', 'color': '#71AF17' },
    { 'Id': '11', 'Role': 'Assistant Manager', 'Manager': '1', 'color': '#71AF17' },
    { 'Id': '2', 'Role': 'Human Resource Manager', 'Manager': '1', 'ChartType': 'Right', 'color': '#1859B7' },
    { 'Id': '3', 'Role': 'Trainers', 'Manager': '2', 'color': '#2E95D8' },
    { 'Id': '4', 'Role': 'Recruiting Team', 'Manager': '2', 'color': '#2E95D8' },
    { 'Id': '5', 'Role': 'Finance Asst. Manager', 'Manager': '2', 'color': '#2E95D8' },
    { 'Id': '6', 'Role': 'Design Manager', 'Manager': '1', 'ChartType': 'Right', 'color': '#1859B7' },
    { 'Id': '7', 'Role': 'Design Supervisor', 'Manager': '6', 'color': '#2E95D8' },
    { 'Id': '8', 'Role': 'Development Supervisor', 'Manager': '6', 'color': '#2E95D8' },
    { 'Id': '9', 'Role': 'Drafting Supervisor', 'Manager': '6', 'color': '#2E95D8' },
    { 'Id': '10', 'Role': 'Operation Manager', 'Manager': '1', 'ChartType': 'Right', 'color': '#1859B7' },
    { 'Id': '11', 'Role': 'Statistic Department', 'Manager': '10', 'color': '#2E95D8' },
    { 'Id': '12', 'Role': 'Logistic Department', 'Manager': '10', 'color': '#2E95D8' },
    { 'Id': '16', 'Role': 'Marketing Manager', 'Manager': '1', 'ChartType': 'Right', 'color': '#1859B7' },
    { 'Id': '17', 'Role': 'Oversea sales Manager', 'Manager': '16', 'color': '#2E95D8' },
    { 'Id': '18', 'Role': 'Petroleum Manager', 'Manager': '16', 'color': '#2E95D8' },
    { 'Id': '20', 'Role': 'Service Dept. Manager', 'Manager': '16', 'color': '#2E95D8' },
    { 'Id': '21', 'Role': 'Quality Department', 'Manager': '16', 'color': '#2E95D8' }
];

let assitants1: object[] = [
    { 'Id': 'parent', 'Role': 'Board', 'color': '#71AF17' },
    { 'Id': '1', 'Role': 'General Manager', 'Manager': 'parent', 'ChartType': 'Right', 'color': '#71AF17' },
    { 'Id': '11', 'Role': 'Assistant Manager', 'Manager': '1', 'color': '#71AF17' },
    { 'Id': '2', 'Role': 'Human Resource Manager', 'Manager': '1', 'ChartType': 'Right', 'color': '#1859B7' },
    { 'Id': '3', 'Role': 'Trainers', 'Manager': '2', 'color': '#2E95D8' },
];
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

let multipleRoot: object[] = [
    { 'Name': 'Tree Layout' },
    { 'Name': 'Organizational Chart' },
    { 'Name': 'Hierarchical Tree', 'Category': 'Tree Layout' },
    { 'Name': 'Radial Tree', 'Category': 'Tree Layout' },
    { 'Name': 'Mind Map', 'Category': 'Hierarchical Tree' },
    { 'Name': 'Family Tree', 'Category': 'Hierarchical Tree' },
    { 'Name': 'Management', 'Category': 'Organizational Chart' },
    { 'Name': 'Human Resource', 'Category': 'Management' },
    { 'Name': 'University', 'Category': 'Management' },
    { 'Name': 'Business', 'Category': 'Management' }
];


let balancedTree: object[] = [
    { 'Name': 'a' },
    { 'Name': 'b', 'Category': 'a' },
    { 'Name': 'c', 'Category': 'a' },
    { 'Name': 'd', 'Category': 'a' },
    { 'Name': 'e', 'Category': 'a' },
    { 'Name': 'b1', 'Category': 'b' },
    { 'Name': 'b2', 'Category': 'b' },
    { 'Name': 'b3', 'Category': 'b' },
    { 'Name': 'c1', 'Category': 'c' },
    { 'Name': 'c2', 'Category': 'c' },
    { 'Name': 'c3', 'Category': 'c' },
    { 'Name': 'c4', 'Category': 'c' },
    { 'Name': 'c5', 'Category': 'c' },
    { 'Name': 'd1', 'Category': 'd' },
    { 'Name': 'd2', 'Category': 'd' },
    { 'Name': 'd3', 'Category': 'd' },
    { 'Name': 'd4', 'Category': 'd' },
    { 'Name': 'd5', 'Category': 'd' },
    { 'Name': 'd6', 'Category': 'd' },
    { 'Name': 'e1', 'Category': 'e' },
    { 'Name': 'e2', 'Category': 'e' },
    { 'Name': 'e3', 'Category': 'e' },
    { 'Name': 'e4', 'Category': 'e' }
];

let singleChild: object[] = [
    { 'Name': 'a' },
    { 'Name': 'b', 'Category': 'a' },
    { 'Name': 'c', 'Category': 'b' },
    { 'Name': 'd', 'Category': 'c' }];

let completeVerticalTree: object[] = [
    { 'Name': 'a' },
    { 'Name': 'b', 'Category': 'a' },
    { 'Name': 'c', 'Category': 'a' },
    { 'Name': 'd', 'Category': 'b' },
    { 'Name': 'e', 'Category': 'b' },
    { 'Name': 'f', 'Category': 'c' },
    { 'Name': 'g', 'Category': 'c' },
];

describe('Diagram Control', () => {
    describe('Tree Layout', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll(() => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let items = new DataManager(data, new Query().take(7));
            diagram = new Diagram({
                width: '1200px', height: '580px',
                snapSettings: { constraints: 0 },
                layout: {
                    type: 'OrganizationalChart',
                },
                dataSourceSettings: {
                    id: 'id', parentId: 'parentId', dataManager: items
                },
                getNodeDefaults: (node: NodeModel, diagram: Diagram) => {
                    let obj: NodeModel = {};
                    obj.width = 150;
                    obj.height = 50;
                    obj.style = { fill: node.data['color'] };
                    obj.annotations = [{ content: node.data['Role'], style: { color: 'white' } }];
                    return obj;
                }, getConnectorDefaults: (obj: ConnectorModel, diagram: Diagram) => {
                    let connector: ConnectorModel = {};
                    connector.targetDecorator = { shape: 'None' };
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
        it('Checking organizational chart', (done: Function) => {
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == 65 && bounds.y == 50 && bounds.width == 1070 && bounds.height == 740).toBe(true);
            expect(diagram.nodes[0].offsetX == 525 && diagram.nodes[0].offsetY == 75).toBe(true);
            done();
        });
        it('Checking hierarchical tree layout', (done: Function) => {
            diagram.layout.type = 'HierarchicalTree';

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == 30 && bounds.y == 50 && bounds.width == 1140 && bounds.height == 690).toBe(true);
            expect(diagram.nodes[0].offsetX == 510 && diagram.nodes[0].offsetY == 75).toBe(true);
            done();
        });
        it('Checking vertical left tree orientation', (done: Function) => {
            diagram.layout.type = 'OrganizationalChart';
            diagram.layout.getLayoutInfo = (node: NodeModel, options: TreeInfo) => {
                if (!options.hasSubTree) {
                    options.type = 'Left';
                    options.orientation = 'Vertical';
                }
            };

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == 118 && bounds.y == 50 && bounds.width == 1055 && bounds.height == 805).toBe(true);
            expect(diagram.nodes[0].offsetX == 712.5 && diagram.nodes[0].offsetY == 75).toBe(true);
            done();
        });
        it('Checking vertical left tree with less offset', (done: Function) => {
            diagram.layout.type = 'OrganizationalChart';
            diagram.layout.getLayoutInfo = (node: NodeModel, options: TreeInfo) => {
                if (!options.hasSubTree) {
                    options.type = 'Left';
                    options.orientation = 'Vertical';
                    options.offset = -20;
                }
            };

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == 120 && bounds.y == 50 && bounds.width == 1015 && bounds.height == 805).toBe(true);
            expect(diagram.nodes[0].offsetX == 695 && diagram.nodes[0].offsetY == 75).toBe(true);
            done();
        });
        it('Checking vertical left tree with 0 offset', (done: Function) => {
            diagram.layout.type = 'OrganizationalChart';
            diagram.layout.getLayoutInfo = (node: NodeModel, options: TreeInfo) => {
                if (!options.hasSubTree) {
                    options.type = 'Left';
                    options.orientation = 'Vertical';
                    options.offset = 0;
                }
            };

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == 118 && bounds.y == 50 && bounds.width == 1055 && bounds.height == 805).toBe(true);
            expect(diagram.nodes[0].offsetX == 712.5 && diagram.nodes[0].offsetY == 75).toBe(true);
            done();
        });
        it('Checking vertical left tree with greater offset', (done: Function) => {
            diagram.layout.type = 'OrganizationalChart';
            diagram.layout.getLayoutInfo = (node: NodeModel, options: TreeInfo) => {
                if (!options.hasSubTree) {
                    options.type = 'Alternate';
                    options.orientation = 'Vertical';
                    options.offset = 60;
                }
            };

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == 75 && bounds.y == 50 && bounds.width == 1050 && bounds.height == 740).toBe(true);
            expect(diagram.nodes[0].offsetX == 532.5 && diagram.nodes[0].offsetY == 75).toBe(true);
            done();
        });
        it('Checking vertical right tree orientation', (done: Function) => {
            diagram.layout.type = 'OrganizationalChart';
            diagram.layout.getLayoutInfo = (node: NodeModel, options: TreeInfo) => {
                if (!options.hasSubTree) {
                    options.type = 'Right';
                    options.orientation = 'Vertical';
                }
            };

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == 70 && bounds.y == 50 && bounds.width == 1060 && bounds.height == 805).toBe(true);
            expect(diagram.nodes[0].offsetX == 593.75 && diagram.nodes[0].offsetY == 75).toBe(true);
            done();
        });
        it('Checking vertical right tree with less offset', (done: Function) => {
            diagram.layout.type = 'OrganizationalChart';
            diagram.layout.getLayoutInfo = (node: NodeModel, options: TreeInfo) => {
                if (!options.hasSubTree) {
                    options.type = 'Right';
                    options.orientation = 'Vertical';
                    options.offset = -20;
                }
            };

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == 93 && bounds.y == 50 && bounds.width == 1015 && bounds.height == 805).toBe(true);
            expect(diagram.nodes[0].offsetX == 626.25 && diagram.nodes[0].offsetY == 75).toBe(true);
            done();
        });
        it('Checking vertical alternate tree orientation', (done: Function) => {
            diagram.layout.type = 'OrganizationalChart';
            diagram.layout.getLayoutInfo = (node: NodeModel, options: TreeInfo) => {
                if (!options.hasSubTree) {
                    options.type = 'Alternate';
                    options.orientation = 'Vertical';
                }
            };

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == 65 && bounds.y == 50 && bounds.width == 1070 && bounds.height == 740).toBe(true);
            expect(diagram.nodes[0].offsetX == 525 && diagram.nodes[0].offsetY == 75).toBe(true);
            done();
        });
        it('Checking vertical alternate tree with less offset', (done: Function) => {
            diagram.layout.type = 'OrganizationalChart';
            diagram.layout.getLayoutInfo = (node: NodeModel, options: TreeInfo) => {
                if (!options.hasSubTree) {
                    options.type = 'Alternate';
                    options.orientation = 'Vertical';
                    options.offset = 4;
                }
            };

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == 97 && bounds.y == 50 && bounds.width == 1006 && bounds.height == 740).toBe(true);
            expect(diagram.nodes[0].offsetX == 549 && diagram.nodes[0].offsetY == 75).toBe(true);
            done();
        });
        it('Checking balanced tree with left orientation', (done: Function) => {
            diagram.layout.type = 'OrganizationalChart';
            diagram.layout.getLayoutInfo = (node: NodeModel, options: TreeInfo) => {
                if (!options.hasSubTree) {
                    options.type = 'Balanced';
                    options.orientation = 'Horizontal';
                }
            };

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == 120 && bounds.y == 50 && bounds.width == 960 && bounds.height == 770).toBe(true);
            expect(diagram.nodes[0].offsetX == 600 && diagram.nodes[0].offsetY == 75).toBe(true);
            done();
        });
        it('Checking horizontal left tree orientation', (done: Function) => {
            diagram.layout.type = 'HierarchicalTree';
            diagram.layout.getLayoutInfo = (node: NodeModel, options: TreeInfo) => {
                if (!options.hasSubTree) {
                    options.type = 'Left';
                    options.orientation = 'Horizontal';
                }
            };

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == 30 && bounds.y == 50 && bounds.width == 1140 && bounds.height == 690).toBe(true);
            expect(diagram.nodes[0].offsetX == 510 && diagram.nodes[0].offsetY == 75).toBe(true);
            done();
        });
        it('Checking horizontal right tree orientation', (done: Function) => {
            diagram.layout.type = 'HierarchicalTree';
            diagram.layout.getLayoutInfo = (node: NodeModel, options: TreeInfo) => {
                if (!options.hasSubTree) {
                    options.type = 'Right';
                    options.orientation = 'Horizontal';
                }
            };

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == 30 && bounds.y == 50 && bounds.width == 1140 && bounds.height == 690).toBe(true);
            expect(diagram.nodes[0].offsetX == 510 && diagram.nodes[0].offsetY == 75).toBe(true);
            done();
        });
        it('Checking hierarchical tree - left to right orientation', (done: Function) => {
            diagram.layout.type = 'OrganizationalChart';
            diagram.layout.orientation = 'LeftToRight';

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == 50 && bounds.y == 5 && bounds.width == 1590 && bounds.height == 570).toBe(true);
            expect(diagram.nodes[0].offsetX == 125 && diagram.nodes[0].offsetY == 210).toBe(true);
            done();
        });
        it('Checking right to left orientation', (done: Function) => {
            diagram.layout.orientation = 'RightToLeft';

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == 50 && bounds.y == 5 && bounds.width == 1590 && bounds.height == 570).toBe(true);
            expect(diagram.nodes[0].offsetX == 1565 && diagram.nodes[0].offsetY == 210).toBe(true);
            done();
        });
        it('Checking tree - bottom to top orientation', (done: Function) => {
            diagram.layout.orientation = 'BottomToTop';

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == -60 && bounds.y == 50 && bounds.width == 1320 && bounds.height == 690).toBe(true);
            expect(diagram.nodes[0].offsetX == 420 && diagram.nodes[0].offsetY == 715).toBe(true);
            done();
        });
        it('Checking tree - with variable size', (done: Function) => {
            let i = 0;
            let reset = diagram.getNodeDefaults;
            for (let _i = 0, _a = diagram.nodes; _i < _a.length; _i++) {
                let node = _a[_i];
                if (i % 2 === 0) {
                    node.width = 200;
                }
                if (i % 3 === 0) {
                    node.height = 200;
                }
                i++;
            }
            diagram.layout.orientation = 'TopToBottom';

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == -122 && bounds.y == 50 && bounds.width == 1445 && bounds.height == 1290).toBe(true);
            expect(diagram.nodes[0].offsetX == 420 && diagram.nodes[0].offsetY == 150).toBe(true);
            diagram.getNodeDefaults = reset;
            done();
        });
        it('Checking tree - with variable size  - Org chart', (done: Function) => {
            let i = 0;
            let reset = diagram.getNodeDefaults;
            for (let _i = 0, _a = diagram.nodes; _i < _a.length; _i++) {
                let node = _a[_i];
                if (i % 2 === 0) {
                    node.width = 200;
                }
                if (i % 3 === 0) {
                    node.height = 200;
                }
                i++;
            }
            diagram.layout.type = 'HierarchicalTree';

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == -77 && bounds.y == 50 && bounds.width == 1355 && bounds.height == 1290).toBe(true);
            expect(diagram.nodes[0].offsetX == 532.5 && diagram.nodes[0].offsetY == 150).toBe(true);
            diagram.getNodeDefaults = reset;
            done();
        });
        it('Checking fixed node at first level', (done: Function) => {
            diagram.layout.orientation = 'TopToBottom';
            diagram.layout.fixedNode = diagram.nodes[0].id;
            diagram.nodes[0].offsetX = 500;
            diagram.nodes[0].offsetY = 50;

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == -110 && bounds.y == -50 && bounds.width == 1355 && bounds.height == 1290).toBe(true);
            expect(diagram.nodes[0].offsetX == 500 && diagram.nodes[0].offsetY == 50).toBe(true);
            done();
        });
        it('Checking fixed node', (done: Function) => {
            diagram.layout.orientation = 'TopToBottom';
            diagram.layout.fixedNode = diagram.nodes[2].id;
            diagram.nodes[2].offsetX = 500;
            diagram.nodes[2].offsetY = 50;

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == 290 && bounds.y == -285 && bounds.width == 1355 && bounds.height == 1290).toBe(true);
            expect(diagram.nodes[0].offsetX == 900 && diagram.nodes[0].offsetY == -185).toBe(true);
            done();
        });
        it('Checking fixed node - left to right orientation', (done: Function) => {
            diagram.layout.orientation = 'LeftToRight';

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == -10 && bounds.y == -130 && bounds.width == 1890 && bounds.height == 1020).toBe(true);
            expect(diagram.nodes[0].offsetX == 90 && diagram.nodes[0].offsetY == 397.5).toBe(true);
            done();
        });
        it('Checking fixed node - right to left orientation', (done: Function) => {
            diagram.layout.orientation = 'RightToLeft';

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == -1700 && bounds.y == -130
                && bounds.width == 1890 && bounds.height == 1020).toBe(true);
            expect(diagram.nodes[0].offsetX == 90 && diagram.nodes[0].offsetY == 397.5).toBe(true);
            done();
        });
        it('Checking fixed node - bottom to top orientation', (done: Function) => {
            diagram.layout.orientation = 'BottomToTop';

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == -530 && bounds.y == -1525 && bounds.width == 1355 && bounds.height == 1290).toBe(true);
            expect(diagram.nodes[0].offsetX == 80 && diagram.nodes[0].offsetY == -335).toBe(true);
            done();
        });
        it('Checking Left Top Alignment', (done: Function) => {
            diagram.layout.orientation = 'TopToBottom';
            diagram.layout.fixedNode = '';
            diagram.layout.horizontalAlignment = 'Left';
            diagram.layout.verticalAlignment = 'Top';

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == 50 && bounds.y == 50 && bounds.width == 1355 && bounds.height == 1290).toBe(true);
            expect(diagram.nodes[0].offsetX == 660 && diagram.nodes[0].offsetY == 150).toBe(true);
            done();
        });
        it('Checking Left Top Alignment - Bottom To Top Orientation', (done: Function) => {
            diagram.layout.orientation = 'BottomToTop';

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == 50 && bounds.y == 50 && bounds.width == 1355 && bounds.height == 1290).toBe(true);
            expect(diagram.nodes[0].offsetX == 660 && diagram.nodes[0].offsetY == 1240).toBe(true);
            done();
        });
        it('Checking Left Top Alignment - Left To Right Orientation', (done: Function) => {
            diagram.layout.orientation = 'LeftToRight';

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == 50 && bounds.y == 50 && bounds.width == 1890 && bounds.height == 1020).toBe(true);
            expect(diagram.nodes[0].offsetX == 150 && diagram.nodes[0].offsetY == 577.5).toBe(true);
            done();
        });
        it('Checking Left Top Alignment - Right To Left Orientation', (done: Function) => {
            diagram.layout.orientation = 'RightToLeft';

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == 50 && bounds.y == 50 && bounds.width == 1890 && bounds.height == 1020).toBe(true);
            expect(diagram.nodes[0].offsetX == 1840 && diagram.nodes[0].offsetY == 577.5).toBe(true);
            done();
        });
        it('Checking Right Bottom Alignment', (done: Function) => {
            diagram.layout.horizontalAlignment = 'Right';
            diagram.layout.verticalAlignment = 'Bottom';
            diagram.layout.orientation = 'TopToBottom';

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == -155 && bounds.y == -710 && bounds.width == 1355 && bounds.height == 1290).toBe(true);
            expect(diagram.nodes[0].offsetX == 455 && diagram.nodes[0].offsetY == -610).toBe(true);
            done();
        });
        it('Checking Right Bottom Alignment - Bottom to top', (done: Function) => {
            diagram.layout.orientation = 'BottomToTop';

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == -155 && bounds.y == -710 && bounds.width == 1355 && bounds.height == 1290).toBe(true);
            expect(diagram.nodes[0].offsetX == 455 && diagram.nodes[0].offsetY == 480).toBe(true);
            done();
        });
        it('Checking Right Bottom Alignment - left to right', (done: Function) => {
            diagram.layout.orientation = 'LeftToRight';

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == -690 && bounds.y == -440 && bounds.width == 1890 && bounds.height == 1020).toBe(true);
            expect(diagram.nodes[0].offsetX == -590 && diagram.nodes[0].offsetY == 87.5).toBe(true);
            done();
        });
        it('Checking Right Bottom Alignment - right to left', (done: Function) => {
            diagram.layout.orientation = 'RightToLeft';

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == -690 && bounds.y == -440 && bounds.width == 1890 && bounds.height == 1020).toBe(true);
            expect(diagram.nodes[0].offsetX == 1100 && diagram.nodes[0].offsetY == 87.5).toBe(true);
            done();
        });
        it('Checking Center Center Alignment', (done: Function) => {
            diagram.layout.horizontalAlignment = 'Center';
            diagram.layout.verticalAlignment = 'Center';

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == -345 && bounds.y == -220 && bounds.width == 1890 && bounds.height == 1020).toBe(true);
            expect(diagram.nodes[0].offsetX == 1445 && diagram.nodes[0].offsetY == 307.5).toBe(true);
            done();
        });
        it('Checking Center Center Alignment - Bottom To Top Orientation', (done: Function) => {
            diagram.layout.orientation = 'BottomToTop';

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == -77 && bounds.y == -355 && bounds.width == 1355 && bounds.height == 1290).toBe(true);
            expect(diagram.nodes[0].offsetX == 532.5 && diagram.nodes[0].offsetY == 835).toBe(true);
            done();
        });
        it('Checking Center Center Alignment - Left To Right Orientation', (done: Function) => {
            diagram.layout.orientation = 'LeftToRight';

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == -345 && bounds.y == -220 && bounds.width == 1890 && bounds.height == 1020).toBe(true);
            expect(diagram.nodes[0].offsetX == -245 && diagram.nodes[0].offsetY == 307.5).toBe(true);
            done();
        });
        it('Checking Center Center Alignment - Right To Left Orientation', (done: Function) => {
            diagram.layout.orientation = 'RightToLeft';

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == -345 && bounds.y == -220 && bounds.width == 1890 && bounds.height == 1020).toBe(true);
            expect(diagram.nodes[0].offsetX == 1445 && diagram.nodes[0].offsetY == 307.5).toBe(true);
            done();
        });
        it('Checking multiple roots', (done: Function) => {
            diagram.layout.type = 'HierarchicalTree';
            diagram.layout.orientation = 'TopToBottom';
            diagram.dataSourceSettings.dataManager = new DataManager({ json: multipleRoot });
            diagram.dataSourceSettings.id = 'Name';
            diagram.dataSourceSettings.parentId = 'Category';

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == 165 && bounds.y == 185 && bounds.width == 870 && bounds.height == 210).toBe(true);
            expect(diagram.nodes[0].offsetX == 420 && diagram.nodes[0].offsetY == 210).toBe(true);
            done();
        });
        it('Checking multiple roots - bottom to top', (done: Function) => {
            diagram.layout.type = 'HierarchicalTree';
            diagram.layout.orientation = 'BottomToTop';

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == 165 && bounds.y == 185 && bounds.width == 870 && bounds.height == 210).toBe(true);
            expect(diagram.nodes[0].offsetX == 420 && diagram.nodes[0].offsetY == 370).toBe(true);
            done();
        });
        it('Checking multiple roots - left to right', (done: Function) => {
            diagram.layout.type = 'HierarchicalTree';
            diagram.layout.orientation = 'LeftToRight';

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == 345 && bounds.y == 105 && bounds.width == 510 && bounds.height == 370).toBe(true);
            expect(diagram.nodes[0].offsetX == 420 && diagram.nodes[0].offsetY == 210).toBe(true);
            done();
        });
        it('Checking multiple roots - right to left', (done: Function) => {
            diagram.layout.type = 'HierarchicalTree';
            diagram.layout.orientation = 'RightToLeft';

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == 345 && bounds.y == 105 && bounds.width == 510 && bounds.height == 370).toBe(true);
            expect(diagram.nodes[0].offsetX == 780 && diagram.nodes[0].offsetY == 210).toBe(true);
            done();
        });
        it('Checking balanced tree - Multiple Levels', (done: Function) => {
            diagram.layout.type = 'OrganizationalChart';
            diagram.layout.orientation = 'TopToBottom';
            diagram.dataSourceSettings.dataManager = new DataManager({ json: balancedTree });
            diagram.dataSourceSettings.id = 'Name';
            diagram.dataSourceSettings.parentId = 'Category';
            diagram.layout.getLayoutInfo = (node: NodeModel, options: TreeInfo) => {
                if (!options.hasSubTree) {
                    options.type = 'Balanced';
                    options.orientation = 'Horizontal';
                }
            };

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == -375 && bounds.y == 145 && bounds.width == 1950 && bounds.height == 290).toBe(true);
            expect(diagram.nodes[0].offsetX == 600 && diagram.nodes[0].offsetY == 170).toBe(true);
            done();
        });
        it('Checking balanced tree - Bottom to top', (done: Function) => {
            diagram.layout.orientation = 'BottomToTop';

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == -375 && bounds.y == 145 && bounds.width == 1950 && bounds.height == 290).toBe(true);
            expect(diagram.nodes[0].offsetX == 600 && diagram.nodes[0].offsetY == 410).toBe(true);
            done();
        });

        it('Checking balanced tree - left to right', (done: Function) => {
            diagram.layout.orientation = 'LeftToRight';
            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == 405 && bounds.y == -135 && bounds.width == 540 && bounds.height == 850).toBe(true);
            expect(diagram.nodes[0].offsetX == 330 && diagram.nodes[0].offsetY == 290).toBe(true);
            done();
        });
        it('Checking balanced tree - right to left', (done: Function) => {
            diagram.layout.orientation = 'RightToLeft';
            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == 255 && bounds.y == -135 && bounds.width == 540 && bounds.height == 850).toBe(true);
            expect(diagram.nodes[0].offsetX == 870 && diagram.nodes[0].offsetY == 290).toBe(true);
            done();
        });
        it('Checking balanced tree - custom rows', (done: Function) => {
            diagram.layout.orientation = 'TopToBottom';
            diagram.layout.getLayoutInfo = (node: NodeModel, options: TreeInfo) => {
                if (node.data['Name'] === 'd') {
                    options.rows = 3;
                }
                if (!options.hasSubTree) {
                    options.type = 'Balanced';
                    options.orientation = 'Horizontal';
                }
            };

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == -195 && bounds.y == 155 && bounds.width == 1590 && bounds.height == 320).toBe(true);
            expect(diagram.nodes[0].offsetX == 600 && diagram.nodes[0].offsetY == 130).toBe(true);
            done();
        });
        it('Checking exclude from layout', (done: Function) => {
            diagram.layout.orientation = 'BottomToTop';
            (diagram.nodes[8] as NodeModel).excludeFromLayout = true;
            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == -105 && bounds.y == 105 && bounds.width == 1410 && bounds.height == 370).toBe(true);
            expect(diagram.nodes[8].offsetX == 600 && diagram.nodes[8].offsetY == 290).toBe(true);
            (diagram.nodes[8] as NodeModel).excludeFromLayout = false;
            done();
        });
        it('Checking Assistants', (done: Function) => {
            diagram.layout.type = 'OrganizationalChart';
            diagram.layout.orientation = 'TopToBottom';
            diagram.dataSourceSettings.dataManager = new DataManager({ json: assitants });
            diagram.dataSourceSettings.id = 'Id';
            diagram.dataSourceSettings.parentId = 'Manager';
            diagram.layout.getLayoutInfo = (node: NodeModel, options: TreeInfo) => {
                if (node.data['Role'] === 'General Manager') {
                    options.assistants.push(options.children[0]);
                    options.children.splice(0, 1);
                }
            };

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == -30 && bounds.y == 80 && bounds.width == 1260 && bounds.height == 420).toBe(true);
            expect(diagram.nodes[0].offsetX == 600 && diagram.nodes[0].offsetY == 105).toBe(true);
            done();
        });
        it('Checking Assitants - Bottom to top', (done: Function) => {
            diagram.layout.orientation = 'BottomToTop';

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == -30 && bounds.y == 80 && bounds.width == 1260 && bounds.height == 420).toBe(true);
            expect(diagram.nodes[0].offsetX == 600 && diagram.nodes[0].offsetY == 475).toBe(true);
            done();
        });
        it('Checking Assitants - left to right', (done: Function) => {
            diagram.layout.orientation = 'LeftToRight';

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == 90 && bounds.y == 10 && bounds.width == 1020 && bounds.height == 560).toBe(true);
            expect(diagram.nodes[0].offsetX == 165 && diagram.nodes[0].offsetY == 290).toBe(true);
            done();
        });
        it('Checking Assitants - right to left', (done: Function) => {
            diagram.layout.orientation = 'RightToLeft';

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == 90 && bounds.y == 10 && bounds.width == 1020 && bounds.height == 560).toBe(true);
            expect(diagram.nodes[0].offsetX == 1035 && diagram.nodes[0].offsetY == 290).toBe(true);
            done();
        });
        it('Checking with two Assistants', (done: Function) => {
            diagram.layout.type = 'OrganizationalChart';
            diagram.layout.orientation = 'TopToBottom';
            diagram.dataSourceSettings.dataManager = new DataManager({ json: assitants });
            diagram.dataSourceSettings.id = 'Id';
            diagram.dataSourceSettings.parentId = 'Manager';
            diagram.layout.getLayoutInfo = (node: NodeModel, options: TreeInfo) => {
                if (node.data['Role'] === 'General Manager') {
                    options.assistants.push(options.children[0]);
                    options.assistants.push(options.children[1]);
                    options.children.splice(0, 2);
                }
                if (node.data['Role'] === 'Human Resource Manager') {
                    options.children = [];
                }
            };

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == -75 && bounds.y == -25 && bounds.width == 1120 && bounds.height == 525).toBe(true);
            expect(diagram.nodes[0].offsetX == 600 && diagram.nodes[0].offsetY == 105).toBe(true);
            done();
        });
        it('Checking Assitants - without children', (done: Function) => {
            diagram.layout.orientation = 'TopToBottom';
            diagram.layout.getLayoutInfo = (node: NodeModel, options: TreeInfo) => {
                if (node.data['Role'] === 'General Manager') {
                    options.assistants.push(options.children[0]);
                    options.children.splice(0, 1);
                    options.children = [];
                }
            };

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == -75 && bounds.y == -50 && bounds.width == 1120 && bounds.height == 550).toBe(true);
            expect(diagram.nodes[0].offsetX == 600 && diagram.nodes[0].offsetY == 210).toBe(true);
            done();
        });

        it('Checking single column with vertical tree', (done: Function) => {
            diagram.layout.type = 'OrganizationalChart';
            diagram.layout.orientation = 'TopToBottom';
            diagram.dataSourceSettings.dataManager = new DataManager({ json: singleChild });
            diagram.dataSourceSettings.id = 'Name';
            diagram.dataSourceSettings.parentId = 'Category';
            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == 478 && bounds.y == 153 && bounds.width == 245 && bounds.height == 275).toBe(true);
            expect(diagram.nodes[0].offsetX == 552.5 && diagram.nodes[0].offsetY == 177.5).toBe(true);
            done();
        });

        it('Checking with empty diagram', (done: Function) => {
            diagram.dataSourceSettings.dataManager = new DataManager({ json: [] });

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == 0 && bounds.y == 0 && bounds.width == 0 && bounds.height == 0).toBe(true);
            done();
        });
        it('Checking complete vertical tree', (done: Function) => {
            diagram.layout.type = 'OrganizationalChart';
            diagram.layout.orientation = 'TopToBottom';
            diagram.dataSourceSettings.dataManager = new DataManager({ json: completeVerticalTree });
            diagram.dataSourceSettings.id = 'Name';
            diagram.dataSourceSettings.parentId = 'Category';
            diagram.layout.getLayoutInfo = (node: NodeModel, options: TreeInfo) => {
                options.type = 'Left';
                options.orientation = 'Vertical';
            };

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == 430 && bounds.y == 70 && bounds.width == 340 && bounds.height == 440).toBe(true);
            expect(diagram.nodes[0].offsetX == 695 && diagram.nodes[0].offsetY == 95).toBe(true);
            done();
        });
        it('Checking with layout bounds', (done: Function) => {
            diagram.layout.bounds = new Rect(0, 0, 500, 500);
            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == 80 && bounds.y == 30 && bounds.width == 340 && bounds.height == 440).toBe(true);
            expect(diagram.nodes[0].offsetX == 345 && diagram.nodes[0].offsetY == 55).toBe(true);
            done();
        });
    });
    describe('Tree Layout', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll(() => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let items = new DataManager(data, new Query().take(7));
            diagram = new Diagram({
                width: '1200px', height: '580px', mode: 'SVG',
                snapSettings: { constraints: 0 },
                layout: {
                    type: 'HierarchicalTree',
                },
                dataSourceSettings: {
                    id: 'id', parentId: 'parentId', dataManager: items
                },
                getNodeDefaults: (obj: NodeModel, diagram: Diagram) => {
                    obj.shape = { type: 'Text', content: (obj.data as { Label: 'string' }).Label };
                    obj.style = { fill: 'lightgrey', strokeColor: 'none', strokeWidth: 2 };
                    obj.borderColor = 'black';
                    obj.backgroundColor = 'lightgrey';
                    obj.borderWidth = 1;
                    (obj.shape as TextModel).margin = { left: 5, right: 5, top: 5, bottom: 5 };
                    return obj;
                }, getConnectorDefaults: (obj: ConnectorModel, diagram: Diagram) => {
                    let connector: ConnectorModel = {};
                    connector.targetDecorator = { shape: 'None' };
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
        it('Checking organizational chart - save and load', (done: Function) => {
            var savedata2 = diagram.saveDiagram();
            diagram.loadDiagram(savedata2);
            expect(diagram.nodes[0].width == undefined && diagram.nodes[0].height == undefined).toBe(true);
            done();
        });
    });
});
export interface TreeInfo {
    orientation?: string; type?: string; offset?: number; enableRouting?: boolean; children?: string[];
    assistants?: string[]; level?: number; hasSubTree?: boolean; rows?: number;
}

let data1: object[] = [//code added
    {
        'Id': 'parent1', 'Name': 'Maria Anders', 'Designation': 'Managing Director',
        'ImageUrl': '../content/images/orgchart/Clayton.png', 'IsExpand': 'true', 'RatingColor': '#C34444'
    },
    {
        'Id': 'parent', 'Name': 'Maria Anders', 'Designation': 'Managing Director', 'ReportingPerson': 'parent1',
        'ImageUrl': '../content/images/orgchart/Clayton.png', 'IsExpand': 'true', 'RatingColor': '#C34444'
    },
    {
        'Id': 1, 'Name': 'Ana Trujillo', 'Designation': 'Project Manager',
        'ImageUrl': '../content/images/orgchart/Thomas.PNG', 'IsExpand': 'true',
        'RatingColor': '#68C2DE', 'ReportingPerson': 'parent'
    },
    {
        'Id': 1111, 'Name': 'Ana Trujillo', 'Designation': 'Project Manager',
        'ImageUrl': '../content/images/orgchart/Thomas.PNG', 'IsExpand': 'true',
        'RatingColor': '#68C2DE', 'ReportingPerson': 'parent'
    },
    {
        'Id': 2, 'Name': 'Anto Moreno', 'Designation': 'Project Lead',
        'ImageUrl': '../content/images/orgchart/image53.png', 'IsExpand': 'false',
        'RatingColor': '#93B85A', 'ReportingPerson': 'parent'
    },
    {
        'Id': 3, 'Name': 'Thomas Hardy', 'Designation': 'Senior S/w Engg',
        'ImageUrl': '../content/images/orgchart/image57.png', 'IsExpand': 'false',
        'RatingColor': '#68C2DE', 'ReportingPerson': 'parent'
    },


];
describe('Tree Layout', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    beforeAll(() => {
        ele = createElement('div', { id: 'diagramanimation' });
        document.body.appendChild(ele);
        let items1 = new DataManager(data1, new Query().take(7));
        diagram = new Diagram({
            width: '1250px', height: '590px',
            snapSettings: { constraints: 0 },
            layout: {
                enableAnimation: true,
                type: 'OrganizationalChart', margin: { top: 20 },
                getLayoutInfo: (node: Node, tree: TreeInfo) => {
                    if (!tree.hasSubTree) {
                        tree.orientation = 'Vertical';
                        tree.type = 'Alternate';
                    }
                }
            },
            dataSourceSettings: {
                id: 'Id', parentId: 'ReportingPerson', dataManager: items1
            },

            getNodeDefaults: (obj: NodeModel, diagram: Diagram) => {
                obj.expandIcon = { horizontalAlignment: 'Center', verticalAlignment: 'Center', height: 20, width: 20, shape: "ArrowDown", fill: 'red', offset: { x: .7, y: .8 } }
                obj.collapseIcon.offset = { x: .7, y: .8 }
                obj.collapseIcon.height = 20;
                obj.collapseIcon.width = 20;
                obj.collapseIcon.shape = "ArrowUp";
                obj.collapseIcon.fill = 'red';
                obj.collapseIcon.horizontalAlignment = 'Center';
                obj.collapseIcon.verticalAlignment = 'Center';
                obj.width = 150;
                obj.height = 50;
                obj.style = {};
                obj.style.fill = obj.data['color'];
                obj.annotations = [{ content: obj.data['Role'], style: { color: 'white' } }];
                return obj;
            }, getConnectorDefaults: (connector: ConnectorModel, diagram: Diagram) => {
                let obj: any = {};
                obj.targetDecorator = {};
                obj.targetDecorator.shape = 'None';
                obj.type = 'Orthogonal';
                return obj;
            },

            setNodeTemplate: (obj: Node, diagram: Diagram): Container => {
                let content: StackPanel = new StackPanel();
                content.id = obj.id + '_outerstack';
                content.style.strokeColor = 'darkgreen';
                content.orientation = 'Horizontal';
                content.padding = { left: 5, right: 10, top: 5, bottom: 5 };
                let innerStack: StackPanel = new StackPanel();
                innerStack.style.strokeColor = 'none';
                innerStack.margin = { left: 5, right: 0, top: 0, bottom: 0 };
                innerStack.id = obj.id + '_innerstack';

                let text: TextElement = new TextElement();
                text.content = obj.data['Name'];

                text.style.color = 'blue';
                text.style.strokeColor = 'none';
                text.style.fill = 'none';
                text.id = obj.id + '_text1';

                let desigText: TextElement = new TextElement();
                desigText.margin = { left: 0, right: 0, top: 5, bottom: 0 };
                desigText.content = obj.data['Designation'];
                desigText.style.color = 'blue';
                desigText.style.strokeColor = 'none';
                desigText.style.fill = 'none';
                desigText.style.textWrapping = 'Wrap';
                desigText.id = obj.id + '_desig';
                innerStack.children = [text, desigText];

                content.children = [innerStack];

                return content;
            }
        });
        diagram.appendTo('#diagramanimation');
    });

    afterAll(() => {
        diagram.destroy();
        ele.remove();
    });

    it('Checking icons on proper layer', (done: Function) => {
        let svgElement: SVGSVGElement = document.getElementsByClassName('e-ports-expand-layer')[0] as SVGSVGElement;
        let gElement: SVGElement = svgElement.getElementById(diagram.nodes[0].id + '_icon_content_groupElement') as SVGElement;
        expect(gElement != null).toBe(true);
        done();
    });

    it('Checking organizational chart collapse', (done: Function) => {
        let mouseEvents: MouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.clickEvent(diagramCanvas, 648, 54);
        let nodes: Node = diagram.nodes[1] as Node
        diagram.animationComplete = () => {
            expect(nodes.visible === false).toBe(true);
            done();
        };
    });

    it('Checking organizational chart expand', (done: Function) => {
        let mouseEvents: MouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.clickEvent(diagramCanvas, 648, 54);
        let nodes: Node = diagram.nodes[1] as Node
        diagram.animationComplete = () => {
            expect(nodes.visible === true).toBe(true);
            done();

        };
    });

    it('Checking organizational chart expand along with layout', (done: Function) => {
        let mouseEvents: MouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.clickEvent(diagramCanvas, 648, 127);
        let nodes: Node = diagram.nodes[0] as Node
        diagram.animationComplete = () => {
            expect(Math.round(nodes.offsetX) === 545 && Math.round(nodes.offsetY) === 55).toBe(true);
            done();
        };

    });
    it('Checking organizational chart collapse along with layout', (done: Function) => {
        let mouseEvents: MouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.clickEvent(diagramCanvas, 648, 127);
        let nodes: Node = diagram.nodes[0] as Node
        diagram.animationComplete = () => {
            expect((Math.round(nodes.offsetX) === 625 || Math.round(nodes.offsetX) === 624) && Math.round(nodes.offsetY) === 40).toBe(true);
            done();
        };
    });
    it('Checking icons on proper layer if removed', (done: Function) => {
        let id = diagram.nodes[0].id;
        diagram.remove(diagram.nodes[0]);
        let svgElement: SVGSVGElement = document.getElementsByClassName('e-ports-expand-layer')[0] as SVGSVGElement;
        let gElement: SVGElement = svgElement.getElementById(id + '_icon_content_groupElement') as SVGElement;
        expect(gElement == null).toBe(true);
        done();
    });
});

describe('Organization chart', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    beforeAll(() => {
        ele = createElement('div', { id: 'diagramOrgChart32' });
        document.body.appendChild(ele);
        let items: DataManager = new DataManager(assitants1 as JSON[], new Query().take(7));

        diagram = new Diagram({
            width: '100%', height: '700px',
            snapSettings: { constraints: 0 },
            layout: {
                type: 'OrganizationalChart', orientation: 'BottomToTop', horizontalSpacing: 30, verticalSpacing: 30,
                getLayoutInfo: (node: Node, options: TreeInfo) => {
                    if (node.data['Role'] === 'General Manager') {
                        options.assistants.push(options.children[0]);
                        options.children.splice(0, 1);
                    }
                    if (!options.hasSubTree) {
                        options.offset = -50;
                        options.type = 'Left';
                        options.orientation = 'Vertical';
                    }
                }
            },
            dataSourceSettings: {
                id: 'Id', parentId: 'Manager', dataManager: items
            },

            getNodeDefaults: (obj: Node, diagram: Diagram) => {
                obj.width = 150;
                obj.height = 50;
                obj.style.fill = obj.data['color'];
                obj.annotations = [{ content: obj.data['Role'], style: { color: 'white' } }];
                return obj;
            }, getConnectorDefaults: (connector: ConnectorModel, diagram: Diagram) => {
                connector.targetDecorator.shape = 'None';
                connector.type = 'Orthogonal';
                return connector;
            }
        });
        diagram.appendTo('#diagramOrgChart32');
    });

    afterAll(() => {
        diagram.destroy();
        ele.remove();
    });

    it('Checking organizational chart- orientation (Bottom to Top), type (Left) and the offset value is negative', (done: Function) => {
        
        expect(diagram.connectors[3].sourcePoint.x == (diagram.connectors[3] as Connector).sourceWrapper.bounds.topCenter.x &&
            diagram.connectors[3].sourcePoint.y == (diagram.connectors[3] as Connector).sourceWrapper.bounds.topCenter.y &&
            diagram.connectors[3].targetPoint.x == (diagram.connectors[3] as Connector).targetWrapper.bounds.middleRight.x &&
            diagram.connectors[3].targetPoint.y == (diagram.connectors[3] as Connector).targetWrapper.bounds.middleRight.y).toBe(true);
        done();
    });
    it('Checking organizational chart- orientation (Bottom to Top), type (Right) and the offset value is negative', (done: Function) => {
        diagram.layout.type = 'OrganizationalChart';
        diagram.layout.getLayoutInfo = (node: NodeModel, options: TreeInfo) => {
            if (node.data['Role'] === 'General Manager') {
                options.assistants.push(options.children[0]);
                options.children.splice(0, 1);
            }
            if (!options.hasSubTree) {
                options.offset = -50;
                options.type = 'Right';
                options.orientation = 'Vertical';
            }
        };
        diagram.dataBind();
        expect(diagram.connectors[3].sourcePoint.x == (diagram.connectors[3] as Connector).sourceWrapper.bounds.topCenter.x &&
            diagram.connectors[3].sourcePoint.y == (diagram.connectors[3] as Connector).sourceWrapper.bounds.topCenter.y &&
            diagram.connectors[3].targetPoint.x == (diagram.connectors[3] as Connector).targetWrapper.bounds.middleLeft.x &&
            diagram.connectors[3].targetPoint.y == (diagram.connectors[3] as Connector).targetWrapper.bounds.middleLeft.y).toBe(true);
        done();
    });
    it('Checking organizational chart- orientation (Left to Right), type (Left) and the offset value is negative', (done: Function) => {
        diagram.layout.type = 'OrganizationalChart';
        diagram.layout.orientation = 'LeftToRight';
        diagram.layout.getLayoutInfo = (node: NodeModel, options: TreeInfo) => {
            if (node.data['Role'] === 'General Manager') {
                options.assistants.push(options.children[0]);
                options.children.splice(0, 1);
            }
            if (!options.hasSubTree) {
                options.offset = -50;
                options.type = 'Left';
                options.orientation = 'Vertical';
            }
        };
        diagram.dataBind();
        expect(diagram.connectors[3].sourcePoint.x == (diagram.connectors[3] as Connector).sourceWrapper.bounds.middleRight.x &&
            diagram.connectors[3].sourcePoint.y == (diagram.connectors[3] as Connector).sourceWrapper.bounds.middleRight.y &&
            diagram.connectors[3].targetPoint.x == (diagram.connectors[3] as Connector).targetWrapper.bounds.topCenter.x &&
            diagram.connectors[3].targetPoint.y == (diagram.connectors[3] as Connector).targetWrapper.bounds.topCenter.y).toBe(true);
        done();
    });
    it('Checking organizational chart- orientation (Left to Right), type (Right) and the offset value is negative', (done: Function) => {
        diagram.layout.type = 'OrganizationalChart';
        diagram.layout.orientation = 'LeftToRight';
        diagram.layout.getLayoutInfo = (node: NodeModel, options: TreeInfo) => {
            if (node.data['Role'] === 'General Manager') {
                options.assistants.push(options.children[0]);
                options.children.splice(0, 1);
            }
            if (!options.hasSubTree) {
                options.offset = -50;
                options.type = 'Right';
                options.orientation = 'Vertical';
            }
        };
        diagram.dataBind();
        expect(diagram.connectors[3].sourcePoint.x == (diagram.connectors[3] as Connector).sourceWrapper.bounds.middleRight.x &&
            diagram.connectors[3].sourcePoint.y == (diagram.connectors[3] as Connector).sourceWrapper.bounds.middleRight.y &&
            diagram.connectors[3].targetPoint.x == (diagram.connectors[3] as Connector).targetWrapper.bounds.bottomCenter.x &&
            diagram.connectors[3].targetPoint.y == (diagram.connectors[3] as Connector).targetWrapper.bounds.bottomCenter.y).toBe(true);
        done();
    });
    it('Checking organizational chart- orientation (Right to Left), type (Left) and the offset value is negative', (done: Function) => {
        diagram.layout.type = 'OrganizationalChart';
        diagram.layout.orientation = 'RightToLeft';
        diagram.layout.getLayoutInfo = (node: NodeModel, options: TreeInfo) => {
            if (node.data['Role'] === 'General Manager') {
                options.assistants.push(options.children[0]);
                options.children.splice(0, 1);
            }
            if (!options.hasSubTree) {
                options.offset = -50;
                options.type = 'Left';
                options.orientation = 'Vertical';
            }
        };
        diagram.dataBind();
        expect(diagram.connectors[3].sourcePoint.x == (diagram.connectors[3] as Connector).sourceWrapper.bounds.middleLeft.x &&
            diagram.connectors[3].sourcePoint.y == (diagram.connectors[3] as Connector).sourceWrapper.bounds.middleLeft.y &&
            diagram.connectors[3].targetPoint.x == (diagram.connectors[3] as Connector).targetWrapper.bounds.topCenter.x &&
            diagram.connectors[3].targetPoint.y == (diagram.connectors[3] as Connector).targetWrapper.bounds.topCenter.y).toBe(true);
        done();
    });
    it('Checking organizational chart- orientation (Left to Right), type (Right) and the offset value is negative', (done: Function) => {
        diagram.layout.type = 'OrganizationalChart';
        diagram.layout.orientation = 'RightToLeft';
        diagram.layout.getLayoutInfo = (node: NodeModel, options: TreeInfo) => {
            if (node.data['Role'] === 'General Manager') {
                options.assistants.push(options.children[0]);
                options.children.splice(0, 1);
            }
            if (!options.hasSubTree) {
                options.offset = -50;
                options.type = 'Right';
                options.orientation = 'Vertical';
            }
        };
        diagram.dataBind();
        expect(diagram.connectors[3].sourcePoint.x == (diagram.connectors[3] as Connector).sourceWrapper.bounds.middleLeft.x &&
            diagram.connectors[3].sourcePoint.y == (diagram.connectors[3] as Connector).sourceWrapper.bounds.middleLeft.y &&
            diagram.connectors[3].targetPoint.x == (diagram.connectors[3] as Connector).targetWrapper.bounds.bottomCenter.x &&
            diagram.connectors[3].targetPoint.y == (diagram.connectors[3] as Connector).targetWrapper.bounds.bottomCenter.y).toBe(true);
        done();
    });
});

describe('Tree Layout', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    beforeAll(() => {
        ele = createElement('div', { id: 'diagramanimationlayputorientation' });
        document.body.appendChild(ele);
        let items1 = new DataManager(data1, new Query().take(7));
        window['setNodeTemplate'] = function (obj: Node, diagram: Diagram): Container {
            let content: StackPanel = new StackPanel();
            content.id = obj.id + '_outerstack';
            content.style.strokeColor = 'darkgreen';
            content.orientation = 'Horizontal';
            content.padding = { left: 5, right: 10, top: 5, bottom: 5 };
            let innerStack: StackPanel = new StackPanel();
            innerStack.style.strokeColor = 'none';
            innerStack.margin = { left: 5, right: 0, top: 0, bottom: 0 };
            innerStack.id = obj.id + '_innerstack';

            let text: TextElement = new TextElement();
            text.content = obj.data['Name'];

            text.style.color = 'blue';
            text.style.strokeColor = 'none';
            text.style.fill = 'none';
            text.id = obj.id + '_text1';

            let desigText: TextElement = new TextElement();
            desigText.margin = { left: 0, right: 0, top: 5, bottom: 0 };
            desigText.content = obj.data['Designation'];
            desigText.style.color = 'blue';
            desigText.style.strokeColor = 'none';
            desigText.style.fill = 'none';
            desigText.style.textWrapping = 'Wrap';
            desigText.id = obj.id + '_desig';
            innerStack.children = [text, desigText];

            content.children = [innerStack];

            return content;
        }
        diagram = new Diagram({
            width: '1250px', height: '590px',
            snapSettings: { constraints: 0 },
            layout: {
                enableAnimation: true,
                type: 'OrganizationalChart', margin: { top: 20 },
                getLayoutInfo: (node: Node, tree: TreeInfo) => {
                    if (!tree.hasSubTree) {
                        tree.orientation = 'Vertical';
                        tree.type = 'Alternate';
                    }
                }
            },
            dataSourceSettings: {
                id: 'Id', parentId: 'ReportingPerson', dataManager: items1
            },

            getNodeDefaults: (obj: NodeModel, diagram: Diagram) => {
                obj.expandIcon = { horizontalAlignment: 'Center', verticalAlignment: 'Center', height: 20, width: 20, shape: "ArrowDown", fill: 'red', offset: { x: .5, y: .85 } }
                obj.collapseIcon.offset = { x: .5, y: .85 }
                obj.collapseIcon.height = 20;
                obj.collapseIcon.width = 20;
                obj.collapseIcon.shape = "ArrowUp";
                obj.collapseIcon.fill = 'red';
                obj.collapseIcon.horizontalAlignment = 'Center';
                obj.collapseIcon.verticalAlignment = 'Center';
                obj.width = 150;
                obj.height = 50;
                obj.style.fill = obj.data['color'];
                obj.annotations = [{ content: obj.data['Role'], style: { color: 'white' } }];
                return obj;
            }, getConnectorDefaults: (connector: ConnectorModel, diagram: Diagram) => {
                connector.targetDecorator.shape = 'None';
                connector.type = 'Orthogonal';
                return connector;
            },
            setNodeTemplate: 'setNodeTemplate'
        });

        diagram.appendTo('#diagramanimationlayputorientation');


    });

    afterAll(() => {
        diagram.destroy();
        ele.remove();
    });


    it('Checking icons positioning based on orinetation', (done: Function) => {
        let nodes: Node = diagram.nodes[0] as Node;
        expect(Math.ceil(nodes.wrapper.children[2].offsetX) === 625 && Math.ceil(nodes.wrapper.children[2].offsetY) === 54).toBe(true);
        diagram.layout.orientation = 'BottomToTop'
        diagram.dataBind();
        let nodes1: Node = diagram.nodes[0] as Node;
        expect(Math.ceil(nodes1.wrapper.children[2].offsetX) === 625 && Math.ceil(nodes1.wrapper.children[2].offsetY) === 203).toBe(true);
        diagram.layout.orientation = 'LeftToRight'
        diagram.dataBind();
        let nodes2: Node = diagram.nodes[0] as Node;
        expect((Math.ceil(nodes2.wrapper.children[2].offsetX) === 152 || Math.ceil(nodes2.wrapper.children[2].offsetX) === 151)
            && Math.ceil(nodes2.wrapper.children[2].offsetY) === 295).toBe(true);
        diagram.layout.orientation = 'RightToLeft';
        diagram.dataBind();
        let nodes3: Node = diagram.nodes[0] as Node;
        expect((Math.ceil(nodes3.wrapper.children[2].offsetX) === 465 || Math.ceil(nodes3.wrapper.children[2].offsetX) === 464
            || (Math.ceil(nodes3.wrapper.children[2].offsetX) === 466))
            && Math.ceil(nodes3.wrapper.children[2].offsetY) === 295).toBe(true);
        done();
    })
});

describe('Tree Layout', () => {
    let diagram1: Diagram;
    let ele: HTMLElement;
    beforeAll(() => {
        ele = createElement('div', { id: 'diagramanimationfalse' });
        document.body.appendChild(ele);
        let items1 = new DataManager(data1, new Query().take(7));
        diagram1 = new Diagram({
            width: '1250px', height: '590px',
            snapSettings: { constraints: 0 },
            layout: {
                enableAnimation: false,
                type: 'OrganizationalChart', margin: { top: 20 },
                getLayoutInfo: (node: Node, tree: TreeInfo) => {
                    if (!tree.hasSubTree) {
                        tree.orientation = 'Vertical';
                        tree.type = 'Alternate';
                    }
                }
            },
            dataSourceSettings: {
                id: 'Id', parentId: 'ReportingPerson', dataManager: items1
            },

            getNodeDefaults: (obj: NodeModel, diagram: Diagram) => {
                obj.expandIcon = { horizontalAlignment: 'Center', verticalAlignment: 'Center', height: 20, width: 20, shape: "ArrowDown", fill: 'red', offset: { x: .7, y: .8 } }
                obj.collapseIcon.offset = { x: .7, y: .8 }
                obj.collapseIcon.height = 20;
                obj.collapseIcon.width = 20;
                obj.collapseIcon.shape = "ArrowUp";
                obj.collapseIcon.fill = 'red';
                obj.collapseIcon.horizontalAlignment = 'Center';
                obj.collapseIcon.verticalAlignment = 'Center';
                obj.width = 150;
                obj.height = 50;
                obj.style = { fill: obj.data['color'] };
                obj.annotations = [{ content: obj.data['Role'], style: { color: 'white' } }];
                return obj;
            }, getConnectorDefaults: (obj: ConnectorModel, diagram: Diagram) => {
                let connector: ConnectorModel = {};
                connector.targetDecorator = { shape: 'None' };
                connector.type = 'Orthogonal';
                return connector;
            },

            setNodeTemplate: (obj: Node, diagram: Diagram): Container => {
                let content: StackPanel = new StackPanel();
                content.id = obj.id + '_outerstack';
                content.style.strokeColor = 'darkgreen';
                content.orientation = 'Horizontal';
                content.padding = { left: 5, right: 10, top: 5, bottom: 5 };
                let innerStack: StackPanel = new StackPanel();
                innerStack.style.strokeColor = 'none';
                innerStack.margin = { left: 5, right: 0, top: 0, bottom: 0 };
                innerStack.id = obj.id + '_innerstack';

                let text: TextElement = new TextElement();
                text.content = obj.data['Name'];

                text.style.color = 'blue';
                text.style.strokeColor = 'none';
                text.style.fill = 'none';
                text.id = obj.id + '_text1';

                let desigText: TextElement = new TextElement();
                desigText.margin = { left: 0, right: 0, top: 5, bottom: 0 };
                desigText.content = obj.data['Designation'];
                desigText.style.color = 'blue';
                desigText.style.strokeColor = 'none';
                desigText.style.fill = 'none';
                desigText.style.textWrapping = 'Wrap';
                desigText.id = obj.id + '_desig';
                innerStack.children = [text, desigText];

                content.children = [innerStack];

                return content;
            }
        });
        diagram1.appendTo('#diagramanimationfalse');
    });

    afterAll(() => {
        diagram1.destroy();
        ele.remove();
    });

    it('Checking organizational chart collapse', (done: Function) => {
        let mouseEvents: MouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement = document.getElementById(diagram1.element.id + 'content');
        mouseEvents.clickEvent(diagramCanvas, 620, 54);
        mouseEvents.clickEvent(diagramCanvas, 648, 54);
        let nodes: Node = diagram1.nodes[1] as Node;
        expect((Math.round(nodes.offsetX) == 625 || Math.round(nodes.offsetX) == 624) && Math.round(nodes.offsetY) == 109).toBe(true);
        done();
    });
});


describe('Tree Layout', () => {
    let diagram2: Diagram;
    let ele: HTMLElement;
    beforeAll(() => {
        ele = createElement('div', { id: 'diagramanimationExpand' });
        document.body.appendChild(ele);
        let items1 = new DataManager(data1, new Query().take(7));
        diagram2 = new Diagram({
            width: '1250px', height: '590px',
            snapSettings: { constraints: 0 },
            layout: {
                enableAnimation: false,
                type: 'OrganizationalChart', margin: { top: 20 },
                getLayoutInfo: (node: Node, tree: TreeInfo) => {
                    if (!tree.hasSubTree) {
                        tree.orientation = 'Vertical';
                        tree.type = 'Alternate';
                    }
                }
            },
            dataSourceSettings: {
                id: 'Id', parentId: 'ReportingPerson', dataManager: items1
            },

            getNodeDefaults: (obj: NodeModel, diagram: Diagram) => {
                obj.expandIcon = { horizontalAlignment: 'Center', verticalAlignment: 'Center', height: 20, width: 20, shape: "ArrowDown", fill: 'red', offset: { x: .7, y: .8 } }
                obj.collapseIcon.offset = { x: .7, y: .8 }
                obj.collapseIcon.height = 20;
                obj.collapseIcon.width = 20;
                obj.collapseIcon.shape = "ArrowUp";
                obj.collapseIcon.fill = 'red';
                obj.collapseIcon.horizontalAlignment = 'Center';
                obj.collapseIcon.verticalAlignment = 'Center';
                obj.width = 150;
                obj.height = 50;
                obj.style = { fill: obj.data['color'] };
                obj.annotations = [{ content: obj.data['Role'], style: { color: 'white' } }];
                return obj;
            }, getConnectorDefaults: (connector: ConnectorModel, diagram: Diagram) => {
                connector.targetDecorator.shape = 'None';
                connector.type = 'Orthogonal';
                return connector;
            },

            setNodeTemplate: (obj: Node, diagram: Diagram): Container => {
                let content: StackPanel = new StackPanel();
                content.id = obj.id + '_outerstack';
                content.style.strokeColor = 'darkgreen';
                content.orientation = 'Horizontal';
                content.padding = { left: 5, right: 10, top: 5, bottom: 5 };
                let innerStack: StackPanel = new StackPanel();
                innerStack.style.strokeColor = 'none';
                innerStack.margin = { left: 5, right: 0, top: 0, bottom: 0 };
                innerStack.id = obj.id + '_innerstack';

                let text: TextElement = new TextElement();
                text.content = obj.data['Name'];

                text.style.color = 'blue';
                text.style.strokeColor = 'none';
                text.style.fill = 'none';
                text.id = obj.id + '_text1';

                let desigText: TextElement = new TextElement();
                desigText.margin = { left: 0, right: 0, top: 5, bottom: 0 };
                desigText.content = obj.data['Designation'];
                desigText.style.color = 'blue';
                desigText.style.strokeColor = 'none';
                desigText.style.fill = 'none';
                desigText.style.textWrapping = 'Wrap';
                desigText.id = obj.id + '_desig';
                innerStack.children = [text, desigText];

                content.children = [innerStack];

                return content;
            }
        });
        diagram2.appendTo('#diagramanimationExpand');
    });

    afterAll(() => {
        diagram2.destroy();
        ele.remove();
    });

    it('Checking organizational chart collapse', (done: Function) => {
        (diagram2.nodes[0] as Node).isExpanded = !(diagram2.nodes[0] as Node).isExpanded;
        diagram2.dataBind();
        setTimeout(() => {
            let node: Node = diagram2.nodes[1] as Node;
            let nodeObj: HTMLElement = document.getElementById(node.id);
            expect(nodeObj.getAttribute('visibility') === 'hidden').toBe(true);
            done();
        }, 200);
    });

    it('Checking organizational chart expand', (done: Function) => {
        (diagram2.nodes[0] as Node).isExpanded = !(diagram2.nodes[0] as Node).isExpanded;
        diagram2.dataBind();
        setTimeout(() => {
            let node: Node = diagram2.nodes[1] as Node;
            let nodeObj: HTMLElement = document.getElementById(node.id);
            expect(nodeObj.getAttribute('visibility') === 'visible').toBe(true);
            done();
        }, 200);
    });
    it('Checking organizational chart expand', (done: Function) => {
        let node: Node = diagram2.nodes[5] as Node;
        let wrapper = node.wrapper.children[2];
        expect(wrapper.visible === false).toBe(true);
        done();
    });

});

describe('Tree Layout', () => {
    let diagram3: Diagram;
    let ele: HTMLElement;
    beforeAll(() => {
        ele = createElement('div', { id: 'diagramanimationExpand' });
        document.body.appendChild(ele);
        let items1 = new DataManager(data1, new Query().take(7));
        diagram3 = new Diagram({
            width: '1250px', height: '590px',
            snapSettings: { constraints: 0 },
            layout: {
                enableAnimation: false,
                type: 'OrganizationalChart', margin: { top: 20 },
                getLayoutInfo: (node: Node, tree: TreeInfo) => {
                    if (!tree.hasSubTree) {
                        tree.orientation = 'Vertical';
                        tree.type = 'Alternate';
                    }
                }
            },
            dataSourceSettings: {
                id: 'Id', parentId: 'ReportingPerson', dataManager: items1
            },

            getNodeDefaults: (obj: NodeModel, diagram: Diagram) => {

                obj.isExpanded = false;
                obj.expandIcon = { horizontalAlignment: 'Center', verticalAlignment: 'Center', height: 20, width: 20, shape: "ArrowDown", fill: 'red', offset: { x: .7, y: .8 } };
                obj.collapseIcon.offset = { x: .7, y: .8 };
                obj.collapseIcon.height = 20;
                obj.collapseIcon.width = 20;
                obj.collapseIcon.shape = "ArrowUp";
                obj.collapseIcon.fill = 'red';
                obj.collapseIcon.horizontalAlignment = 'Center';
                obj.collapseIcon.verticalAlignment = 'Center';
                obj.width = 150;
                obj.height = 50;
                obj.style = { fill: obj.data['color'] };
                obj.annotations = [{ content: obj.data['Role'], style: { color: 'white' } }];
                return obj;
            }, getConnectorDefaults: (connector: ConnectorModel, diagram: Diagram) => {
                connector.targetDecorator.shape = 'None';
                connector.type = 'Orthogonal';
                return connector;
            },

            setNodeTemplate: (obj: Node, diagram: Diagram): Container => {
                let content: StackPanel = new StackPanel();
                content.id = obj.id + '_outerstack';
                content.style.strokeColor = 'darkgreen';
                content.orientation = 'Horizontal';
                content.padding = { left: 5, right: 10, top: 5, bottom: 5 };
                let innerStack: StackPanel = new StackPanel();
                innerStack.style.strokeColor = 'none';
                innerStack.margin = { left: 5, right: 0, top: 0, bottom: 0 };
                innerStack.id = obj.id + '_innerstack';

                let text: TextElement = new TextElement();
                text.content = obj.data['Name'];

                text.style.color = 'blue';
                text.style.strokeColor = 'none';
                text.style.fill = 'none';
                text.id = obj.id + '_text1';

                let desigText: TextElement = new TextElement();
                desigText.margin = { left: 0, right: 0, top: 5, bottom: 0 };
                desigText.content = obj.data['Designation'];
                desigText.style.color = 'blue';
                desigText.style.strokeColor = 'none';
                desigText.style.fill = 'none';
                desigText.style.textWrapping = 'Wrap';
                desigText.id = obj.id + '_desig';
                innerStack.children = [text, desigText];

                content.children = [innerStack];

                return content;
            }
        });
        diagram3.appendTo('#diagramanimationExpand');
    });

    afterAll(() => {
        diagram3.destroy();
        ele.remove();
    });

    it('Checking organizational chart Expand', (done: Function) => {
        (diagram3.nodes[0] as Node).isExpanded = !(diagram3.nodes[0] as Node).isExpanded;
        diagram3.dataBind();
        setTimeout(() => {
            let node: Node = diagram3.nodes[1] as Node;
            let nodeObj: HTMLElement = document.getElementById(node.id);
            expect(nodeObj.getAttribute('visibility') === 'visible').toBe(true);
            done();
        }, 200);
    });
});
describe('Connector Update in Layout Issue', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    beforeAll(() => {
        ele = createElement('div', { id: 'diagramConnectorUpdateInLayoutIssue' });
        document.body.appendChild(ele);
        let data: object[] = [
            { id: 1, Label: 'StackPanel' },
            { id: 2, Label: 'Label', parentId: 1 },
            { id: 3, Label: 'ListBox', parentId: 1 }
        ];
        let items: DataManager = new DataManager(data as JSON[], new Query().take(7));
        diagram = new Diagram({
            width: '900px', height: '550px',
            layout: { type: 'HierarchicalTree' },
            dataSourceSettings: { id: 'id', parentId: 'parentId', dataManager: items },
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
        diagram.appendTo('#diagramConnectorUpdateInLayoutIssue');
    });
    afterAll(() => {
        diagram.destroy();
        ele.remove();
    });
    it('Checking Connector update in DOM - After checking the layout', (done: Function) => {
        diagram.layout.type = "OrganizationalChart";
        diagram.dataBind();
        let id = diagram.connectors[0].id;
        let x = document.getElementById(id).getAttribute('x');
        let y = document.getElementById(id).getAttribute('y');
        expect(x == '433.5' && y == '72.5').toBe(true);
        done();
    });
});
