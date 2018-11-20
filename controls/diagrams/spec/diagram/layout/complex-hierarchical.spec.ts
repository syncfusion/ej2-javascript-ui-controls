/**
 * Diagram spec document
 */
import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { DataManager, Query } from '@syncfusion/ej2-data';
import{SpatialSearch} from '../../../src/diagram/interaction/spatial-search/spatial-search';
import {
    ConnectorModel, Node,
    DataBinding, PointModel, GraphLayoutManager, Layout, IConnector,
    HierarchicalTree, NodeModel, Rect, BasicShapeModel, ComplexHierarchicalTree,
} from '../../../src/diagram/index';
Diagram.Inject(ComplexHierarchicalTree);

let data: object[] = [{ 'Name': 'Customer Support', 'fillColor': '#0f688d' },
{ 'Name': 'OEM Support', 'fillColor': '#0f688d', 'ReportingPerson': ['Customer Support'] },
{ 'Name': 'Customer Care', 'ReportingPerson': ['Customer Support', 'OEM Support'], 'fillColor': '#14ad85' },
{ 'Name': 'Central Region', 'fillColor': '#0f688d' },
{ 'Name': 'Eastern Region', 'fillColor': '#0f688d' },
{ 'Name': 'ServiceCare', 'ReportingPerson': ['Central Region', 'Eastern Region'], 'fillColor': '#14ad85' },
{ 'Name': 'National Channel Marketing', 'fillColor': '#0f688d' },
{ 'Name': 'Retail Channel Marketing', 'fillColor': '#0f688d' },
{
    'Name': 'Channel Marketing', 'ReportingPerson': ['National Channel Marketing', 'Retail Channel Marketing'],
    'fillColor': '#14ad85'
},
{ 'Name': 'Northern Region', 'fillColor': '#0f688d' },
{ 'Name': 'Western Region', 'fillColor': '#0f688d' },
{ 'Name': 'Southern Region', 'fillColor': '#0f688d' },
{ 'Name': 'Channel Field Sales', 'ReportingPerson': ['Northern Region', 'Western Region', 'Southern Region'], 'fillColor': '#14ad85' },
{ 'Name': 'Customer', 'ReportingPerson': ['Customer Care', 'ServiceCare'], 'fillColor': '#0aa6ce' },
{ 'Name': 'SalesMan', 'ReportingPerson': ['Channel Marketing', 'Channel Field Sales'], 'fillColor': '#0aa6ce' },
{ 'Name': 'Adventure Work Cycle', 'ReportingPerson': ['Customer', 'SalesMan'], 'fillColor': '#f16f62' },
{ 'Name': 'cycle1', 'ReportingPerson': ['Adventure Work Cycle', 'Northern Region',], 'fillColor': '#f16f62' },
];

describe('Diagram Control', () => {
    describe('Complex Tree Layout', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let items: DataManager = new DataManager(data as JSON[], new Query().take(7));
        beforeAll(() => {
            ele = createElement('div', { id: 'diagramComplexHierarchicalTree' });
            document.body.appendChild(ele);
            diagram = new Diagram({
                width: 1000, height: 1000,
                layout: { type: 'ComplexHierarchicalTree', horizontalSpacing: 40, verticalSpacing: 40, orientation: 'TopToBottom' },
                dataSourceSettings: {
                    id: 'Name', parentId: 'ReportingPerson', dataManager: items
                },
                getNodeDefaults: (node: NodeModel, diagram: Diagram) => {
                    let obj: NodeModel = {};
                    obj.height = 40; obj.width = 100;
                    obj.backgroundColor = 'lightgrey';
                    obj.style = { fill: 'transparent', strokeWidth: 2 };
                    return obj;
                }, getConnectorDefaults: (obj: ConnectorModel, diagram: Diagram) => {
                    let connector: ConnectorModel = {};
                    connector.targetDecorator = { shape: 'None' };
                    connector.type = 'Orthogonal';
                    return connector;
                },
            });
            diagram.appendTo('#diagramComplexHierarchicalTree');
        });
        afterAll(() => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking TopToBottom complex tree layout', (done: Function) => {
            diagram.layout.type = 'ComplexHierarchicalTree';
            diagram.layout.horizontalSpacing = 40;
            diagram.layout.verticalSpacing = 40;
            diagram.spatialSearch = new SpatialSearch(diagram.nameTable);
            diagram.dataBind();
            expect(diagram.nodes[0].offsetX == 1.1238696756863291 && diagram.nodes[0].offsetY == 70).toBe(true);
            done();
        });
        it('Checking BottomToTop complex tree layout', (done: Function) => {
            diagram.layout.type = 'ComplexHierarchicalTree';
            diagram.layout.orientation = 'BottomToTop';
            diagram.dataBind();
            expect(diagram.nodes[0].offsetX == 1.1238696756863291 && diagram.nodes[0].offsetY == 470).toBe(true);
            done();
        });
        it('Checking LeftToRight complex tree layout', (done: Function) => {
            diagram.layout.type = 'ComplexHierarchicalTree';
            diagram.layout.orientation = 'LeftToRight';
            diagram.dataBind();
            expect(diagram.nodes[0].offsetX == 200 && diagram.nodes[0].offsetY == 57.02686734040091).toBe(true);
            done();
        });
        it('Checking RightToLeft complex tree layout', (done: Function) => {
            diagram.layout.type = 'ComplexHierarchicalTree';
            diagram.layout.orientation = 'RightToLeft';
            diagram.dataBind();
            expect(diagram.nodes[0].offsetX == 900 && diagram.nodes[0].offsetY == 57.02686734040091).toBe(true);
            done();
        });
        it('Checking Margin layout', (done: Function) => {
            diagram.layout.type = 'ComplexHierarchicalTree';
            diagram.layout.margin.left = 100;
            diagram.layout.margin.top = 100;
            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.left === 200 && bounds.right === 1000 && bounds.top === 87 && bounds.bottom === 700).toBe(true);
            done();
        });
    });
});

let complexData: Object[] = [
    { 'Name': 'a', 'fillColor': '#0f688d', 'ReportingPerson': 'c' },
    { 'Name': 'b', 'fillColor': '#0f688d', 'ReportingPerson': 'a' },
    { 'Name': 'c', 'fillColor': '#0f688d', 'ReportingPerson': 'b' },
]

describe('Diagram Control', () => {
    describe('cyclic Tree Layout', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let items1: DataManager = new DataManager(complexData as JSON[], new Query().take(3));
        beforeAll(() => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            diagram = new Diagram({
                width: 1000, height: 1000,
                layout: { type: 'ComplexHierarchicalTree', horizontalSpacing: 40, verticalSpacing: 40 },
                dataSourceSettings: {
                    id: 'Name', parentId: 'ReportingPerson', dataManager: items1, root: 'a'
                },
                getNodeDefaults: (node: NodeModel, diagram: Diagram) => {
                    let obj: NodeModel = {};
                    obj.height = 40; obj.width = 100;
                    obj.backgroundColor = 'lightgrey';
                    obj.style = { fill: 'transparent', strokeWidth: 2 };
                    return obj;
                }, getConnectorDefaults: (obj: ConnectorModel, diagram: Diagram) => {
                    let connector: ConnectorModel = {};
                    connector.targetDecorator = { shape: 'None' };
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
        it('Checking TopToBottom complex tree layout', (done: Function) => {
            diagram.layout.type = 'ComplexHierarchicalTree';
            diagram.dataBind();
            expect(diagram.nodes[0].offsetX == 572.5 && diagram.nodes[0].offsetY == 70).toBe(true);
            done();
        });
    });
});

describe('Diagram Control', () => {
    describe('Complex Hierarchical sample issue fix', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let items1: DataManager = new DataManager(complexData as JSON[], new Query().take(3));
        beforeAll(() => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [
                {
                    id: 'Node1', width: 50, height: 50, annotations: [{ content: 'Node1' }],
                    expandIcon: {
                        shape: 'Minus',
                        width: 10,
                        height: 10
                    },
                    collapseIcon: {
                        shape: 'Plus',
                        width: 10,
                        height: 10
                    },
                }, {
                    id: 'Node2', width: 50, height: 50, annotations: [{ content: 'Node2' }],
                    expandIcon: {
                        shape: 'Minus',
                        width: 10,
                        height: 10
                    },
                    collapseIcon: {
                        shape: 'Plus',
                        width: 10,
                        height: 10
                    },
                }, {
                    id: 'Node3', width: 50, height: 50, annotations: [{ content: 'Node3' }],
                },
                {
                    id: 'Node4', width: 50, height: 50, annotations: [{ content: 'Node4' }],
                    expandIcon: {
                        shape: 'Minus',
                        width: 10,
                        height: 10
                    },
                    collapseIcon: {
                        shape: 'Plus',
                        width: 10,
                        height: 10
                    },
                },
                {
                    id: 'Node5', width: 50, height: 50, annotations: [{ content: 'Node5' }],
                },
                {
                    id: 'Node6', width: 50, height: 50, annotations: [{ content: 'Node6' }]
                },
                {
                    id: 'Node7', width: 50, height: 50, annotations: [{ content: 'Node7' }]
                },
                {
                    id: 'Node8', width: 50, height: 50, annotations: [{ content: 'Node8' }],
                    expandIcon: {
                        shape: 'Minus',
                        width: 10,
                        height: 10
                    },
                    collapseIcon: {
                        shape: 'Plus',
                        width: 10,
                        height: 10
                    },
                },
                {
                    id: 'Node9', width: 50, height: 50, annotations: [{ content: 'Node9' }],
                    expandIcon: {
                        shape: 'Minus',
                        width: 10,
                        height: 10
                    },
                    collapseIcon: {
                        shape: 'Plus',
                        width: 10,
                        height: 10
                    },
                },
                {
                    id: 'newnode', width: 50, height: 50, annotations: [{ content: 'newnode' }],
                    expandIcon: {
                        shape: 'Minus',
                        width: 10,
                        height: 10
                    },
                    collapseIcon: {
                        shape: 'Plus',
                        width: 10,
                        height: 10
                    },
                },
            
            ];
            let connector: ConnectorModel[] = [
                {
                    id: 'node1_2', sourceID: 'Node1', targetID: 'Node2',
                }, {
                    id: 'node2_3', sourceID: 'Node2', targetID: 'Node3',
                },
                {
                    id: 'node2_4', sourceID: 'Node2', targetID: 'Node4',
                },
                {
                    id: 'node2_5', sourceID: 'Node2', targetID: 'Node5',
                },
                {
                    id: 'node2_6', sourceID: 'Node2', targetID: 'Node6',
                },
                {
                    id: 'node2_7', sourceID: 'Node2', targetID: 'Node7',
                },
                {
                    id: 'node2_8', sourceID: 'Node2', targetID: 'Node8',
                },
                {
                    id: 'node8_9', sourceID: 'Node8', targetID: 'Node9',
                },
                {
                    id: 'node9_4', sourceID: 'Node9', targetID: 'Node4',
                },
               
                {
                    id: 'node9_5', sourceID: 'Node9', targetID: 'Node5',
                },
                {
                    id: 'node9_6', sourceID: 'Node9', targetID: 'Node6',
                }


            ];
            diagram = new Diagram({
                width: '1000px',
                height: '800px', nodes: nodes, connectors: connector, layout: { type: 'ComplexHierarchicalTree' },

            });
            diagram.appendTo('#diagram');
        });
        afterAll(() => {
            diagram.destroy();
            ele.remove();
        });

        it('checking the node which have multiple parent', (done: Function) => {
            let node = diagram.nodes[8];
            node.isExpanded = false;
            setTimeout(() => {
                var node = diagram.nodes[4];
                expect(node.visible).toBe(true);
                done();

            },
                0);
        });

        it('checking icon click', (done: Function) => {
            let node = diagram.nodes[0];
            node.isExpanded = false;
            setTimeout(() => {
                var node = diagram.nodes[8];
                expect(!node.visible).toBe(true)
                done();
            },
                0);
        });
    });
});