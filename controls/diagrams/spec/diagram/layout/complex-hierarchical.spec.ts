/**
 * Diagram spec document
 */
import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { SpatialSearch } from '../../../src/diagram/interaction/spatial-search/spatial-search';
import {
    ConnectorModel, Node,
    DataBinding, PointModel, GraphLayoutManager, Layout, IConnector, IDataLoadedEventArgs,
    HierarchicalTree, NodeModel, Rect, BasicShapeModel, ComplexHierarchicalTree, ShapeModel, SnapSettingsModel, SnapConstraints, TextModel, ImageElement, StackPanel, TextElement
} from '../../../src/diagram/index';
import { profile, inMB, getMemoryProfile } from '../../../spec/common.spec';
Diagram.Inject(ComplexHierarchicalTree, HierarchicalTree);

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
                    id: 'Name', parentId: 'ReportingPerson', dataSource: items
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
            expect((diagram.nodes[0].offsetX == 1.1238696756863291 || diagram.nodes[0].offsetX == 100) && diagram.nodes[0].offsetY == 300).toBe(true);
            done();
        });
        it('Checking BottomToTop complex tree layout', (done: Function) => {
            diagram.layout.type = 'ComplexHierarchicalTree';
            diagram.layout.orientation = 'BottomToTop';
            diagram.dataBind();
            expect((diagram.nodes[0].offsetX == 1.1238696756863291 || diagram.nodes[0].offsetX == 100) && diagram.nodes[0].offsetY == 700).toBe(true);
            done();
        });
        it('Checking LeftToRight complex tree layout', (done: Function) => {
            diagram.layout.type = 'ComplexHierarchicalTree';
            diagram.layout.orientation = 'LeftToRight';
            diagram.dataBind();
            expect(diagram.nodes[0].offsetX == 100 && (diagram.nodes[0].offsetY == 215.13003698807424 || diagram.nodes[0].offsetY == 57.09756405520557)).toBe(true);
            done();
        });
        it('Checking RightToLeft complex tree layout', (done: Function) => {
            diagram.layout.type = 'ComplexHierarchicalTree';
            diagram.layout.orientation = 'RightToLeft';
            diagram.dataBind();
            expect(diagram.nodes[0].offsetX == 800 && (diagram.nodes[0].offsetY == 215.13003698807424 || diagram.nodes[0].offsetY == 57.09756405520557)).toBe(true);
            done();
        });
        it('Checking Margin layout', (done: Function) => {
            diagram.layout.type = 'ComplexHierarchicalTree';
            diagram.layout.margin.left = 100;
            diagram.layout.margin.top = 100;
            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.left === 100 && bounds.right === 900 && bounds.top === 195 && bounds.bottom === 805).toBe(true);
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
                    id: 'Name', parentId: 'ReportingPerson', dataSource: items1, root: 'a'
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
            expect(diagram.nodes[0].offsetX == 145 && diagram.nodes[0].offsetY == 420).toBe(true);
            done();
        });
        it('Checking connector annotation position issue after dolayout', (done: Function) => {

            let node7: NodeModel = {
                id: 'node7', width: 50, height: 50, annotations: [{ content: 'Web Server' }],
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
                shape: { type: 'Image', source: 'https://cdn0.iconfinder.com/data/icons/feather/96/591267-box-512.png' }
            };

            diagram.add(node7);
            let sourceID = diagram.nodes[2].id
            let connector: ConnectorModel = {
                id: 'connector6', sourceID: sourceID, targetID: 'node7', annotations: [{ content: 'connector6' }]
            };
            diagram.add(connector);
            diagram.doLayout();
            expect(diagram.connectors[3].wrapper.children[3].offsetX === 215 && diagram.connectors[3].wrapper.children[3].offsetY === 455).toBe(true);
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
                    id: 'node4_newnode', sourceID: 'Node4', targetID: 'newnode',
                },
                {
                    id: 'node5_newnode', sourceID: 'Node5', targetID: 'newnode',
                },
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
        it('checking icon click issue fix', (done: Function) => {
            let node = diagram.nodes[3];
            node.isExpanded = false;
            setTimeout(() => {
                var node1 = diagram.nodes[9];
                expect(node1.visible).toBe(true)
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
describe('Diagram Control', () => {
    describe('Complex Hierarchical Nan issue fix', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let items1: DataManager = new DataManager(complexData as JSON[], new Query().take(3));
        beforeAll(() => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            var data = [
                {
                    id: '0',
                    parent: ['1', '2']
                },
                {
                    id: '1',
                },
                {
                    id: '2',
                },
                {
                    id: '3',
                    parent: ['0']
                },
                {
                    id: '4',
                    parent: ['0']
                },
                {
                    id: '5',
                    parent: ['4']
                },
                {
                    id: '6',
                    parent: ['4']
                },
                {
                    id: '7',
                    parent: ['17', '6']
                },
                {
                    id: '8',
                    parent: ['0']
                },
                {
                    id: '9',
                    parent: ['8']
                },
                {
                    id: '10',
                    parent: ['9', '19']
                },
                {
                    id: '11',
                    parent: ['10', '19']
                },
                {
                    id: '12',
                    parent: ['10', '19']
                },
                {
                    id: '13',
                    parent: ['9', '19']
                },
                {
                    id: '14',
                    parent: ['13', '19']
                },
                {
                    id: '15',
                    parent: ['13', '19']
                },
                {
                    id: '16',
                    parent: ['9', '24']
                },
                {
                    id: '17',
                    parent: ['9']
                },
                {
                    id: '18',
                    parent: ['0']
                },
                {
                    id: '19',
                    parent: ['0']
                },
                {
                    id: '20',
                    parent: ['19']
                },
                {
                    id: '21',
                    parent: ['19']
                },
                {
                    id: '22',
                    parent: ['19']
                },
                {
                    id: '23',
                    parent: ['0']
                },
                {
                    id: '24',
                    parent: ['0']
                },
                {
                    id: '25',
                    parent: ['0']
                },
                {
                    id: '26',
                    parent: ['25']
                },
                {
                    id: '27',
                    parent: ['0']
                },
                {
                    id: '28',
                    parent: ['27']
                },
                {
                    id: '29',
                    parent: ['27']
                },
                {
                    id: '30',
                    parent: ['0']
                },
                {
                    id: '31',
                    parent: ['30']
                },
                {
                    id: '32',
                    parent: ['0']
                }
            ];
            function getConnectorDefaults(connector: ConnectorModel) {
                connector.id = connector.sourceID + '_' + connector.targetID;
                connector.type = 'Orthogonal';
                connector.cornerRadius = 7;
                connector.targetDecorator.height = 7;
                connector.targetDecorator.width = 7;
                connector.style.strokeColor = '#6d6d6d';
                return connector;
            }
            function getNodeDefaults(node: NodeModel, diagram: Diagram) {
                var obj = {
                    width: 75,
                    height: 75,
                    shape: { shape: 'Ellipse' },
                    style: { fill: '#37909A', strokeColor: '#024249' },
                    annotations: [
                        {
                            content: node.id,
                            margin: { left: 10, right: 10 },
                            style: {
                                color: 'white',
                                fill: 'none',
                                strokeColor: 'none',
                                bold: true
                            }
                        }
                    ],
                };
                return obj;
            }
            diagram = new Diagram({
                width: '1000px', height: '500px', dataSourceSettings: {
                    id: 'id', parentId: 'parent', dataSource: new DataManager(data),
                },
                layout: {
                    type: 'ComplexHierarchicalTree', horizontalSpacing: 20, verticalSpacing: 20,
                    // enableAnimation: true,
                    margin: { left: 10, right: 0, top: 50, bottom: 0 }
                },
                getNodeDefaults: getNodeDefaults, getConnectorDefaults: getConnectorDefaults
            });
            diagram.appendTo('#diagram');
        });
        afterAll(() => {
            diagram.destroy();
            ele.remove();
        });

        it('checking the node which have multiple parent', (done: Function) => {
            var nodes = diagram.nodes
            expect(nodes.length === 33).toBe(true);
            done();
        });
    });
});
export interface IEmployeeInfo {
    id: string;
    height: number;
    width: number;
    x: number;
    y: number;
    isVisible: boolean;
    type: ShapeModel;
    content: string;
}
let hierarchicalTree: object[] = [
    { id: 'node1111', type: 'Native', x: 200, y: 200, width: 100, height: 100, isVisible: true, content: '<g xmlns="http://www.w3.org/2000/svg">	<g transform="translate(1 1)">		<g>			<path style="fill:#61443C;" d="M61.979,435.057c2.645-0.512,5.291-0.853,7.936-1.109c-2.01,1.33-4.472,1.791-6.827,1.28     C62.726,435.13,62.354,435.072,61.979,435.057z"/>			<path style="fill:#61443C;" d="M502.469,502.471h-25.6c0.163-30.757-20.173-57.861-49.749-66.304     c-5.784-1.581-11.753-2.385-17.749-2.389c-2.425-0.028-4.849,0.114-7.253,0.427c1.831-7.63,2.747-15.45,2.731-23.296     c0.377-47.729-34.52-88.418-81.749-95.317c4.274-0.545,8.577-0.83,12.885-0.853c25.285,0.211,49.448,10.466,67.167,28.504     c17.719,18.039,27.539,42.382,27.297,67.666c0.017,7.846-0.9,15.666-2.731,23.296c2.405-0.312,4.829-0.455,7.253-0.427     C472.572,434.123,502.783,464.869,502.469,502.471z"/>		</g>		<path style="fill:#8B685A;" d="M476.869,502.471H7.536c-0.191-32.558,22.574-60.747,54.443-67.413    c0.375,0.015,0.747,0.072,1.109,0.171c2.355,0.511,4.817,0.05,6.827-1.28c1.707-0.085,3.413-0.171,5.12-0.171    c4.59,0,9.166,0.486,13.653,1.451c2.324,0.559,4.775,0.147,6.787-1.141c2.013-1.288,3.414-3.341,3.879-5.685    c7.68-39.706,39.605-70.228,79.616-76.117c4.325-0.616,8.687-0.929,13.056-0.939c13.281-0.016,26.409,2.837,38.485,8.363    c3.917,1.823,7.708,3.904,11.349,6.229c2.039,1.304,4.527,1.705,6.872,1.106c2.345-0.598,4.337-2.142,5.502-4.264    c14.373-25.502,39.733-42.923,68.693-47.189h0.171c47.229,6.899,82.127,47.588,81.749,95.317c0.017,7.846-0.9,15.666-2.731,23.296    c2.405-0.312,4.829-0.455,7.253-0.427c5.996,0.005,11.965,0.808,17.749,2.389C456.696,444.61,477.033,471.713,476.869,502.471    L476.869,502.471z"/>		<path style="fill:#66993E;" d="M502.469,7.537c0,0-6.997,264.96-192.512,252.245c-20.217-1.549-40.166-5.59-59.392-12.032    c-1.365-0.341-2.731-0.853-4.096-1.28c0,0-0.597-2.219-1.451-6.144c-6.656-34.048-25.088-198.997,231.765-230.144    C485.061,9.159,493.595,8.22,502.469,7.537z"/>		<path style="fill:#9ACA5C;" d="M476.784,10.183c-1.28,26.197-16.213,238.165-166.827,249.6    c-20.217-1.549-40.166-5.59-59.392-12.032c-1.365-0.341-2.731-0.853-4.096-1.28c0,0-0.597-2.219-1.451-6.144    C238.363,206.279,219.931,41.329,476.784,10.183z"/>		<path style="fill:#66993E;" d="M206.192,246.727c-0.768,3.925-1.365,6.144-1.365,6.144c-1.365,0.427-2.731,0.939-4.096,1.28    c-21.505,7.427-44.293,10.417-66.987,8.789C21.104,252.103,8.816,94.236,7.621,71.452c-0.085-1.792-0.085-2.731-0.085-2.731    C222.747,86.129,211.653,216.689,206.192,246.727z"/>		<path style="fill:#9ACA5C;" d="M180.336,246.727c-0.768,3.925-1.365,6.144-1.365,6.144c-1.365,0.427-2.731,0.939-4.096,1.28    c-13.351,4.412-27.142,7.359-41.131,8.789C21.104,252.103,8.816,94.236,7.621,71.452    C195.952,96.881,185.541,217.969,180.336,246.727z"/>	</g>	<g>		<path d="M162.136,426.671c3.451-0.001,6.562-2.08,7.882-5.268s0.591-6.858-1.849-9.298l-8.533-8.533    c-3.341-3.281-8.701-3.256-12.012,0.054c-3.311,3.311-3.335,8.671-0.054,12.012l8.533,8.533    C157.701,425.773,159.872,426.673,162.136,426.671L162.136,426.671z"/>		<path d="M292.636,398.57c3.341,3.281,8.701,3.256,12.012-0.054c3.311-3.311,3.335-8.671,0.054-12.012l-8.533-8.533    c-3.341-3.281-8.701-3.256-12.012,0.054s-3.335,8.671-0.054,12.012L292.636,398.57z"/>		<path d="M296.169,454.771c-3.341-3.281-8.701-3.256-12.012,0.054c-3.311,3.311-3.335,8.671-0.054,12.012l8.533,8.533    c3.341,3.281,8.701,3.256,12.012-0.054c3.311-3.311,3.335-8.671,0.054-12.012L296.169,454.771z"/>		<path d="M386.503,475.37c3.341,3.281,8.701,3.256,12.012-0.054c3.311-3.311,3.335-8.671,0.054-12.012l-8.533-8.533    c-3.341-3.281-8.701-3.256-12.012,0.054c-3.311,3.311-3.335,8.671-0.054,12.012L386.503,475.37z"/>		<path d="M204.803,409.604c2.264,0.003,4.435-0.897,6.033-2.5l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    c-3.311-3.311-8.671-3.335-12.012-0.054l-8.533,8.533c-2.44,2.44-3.169,6.11-1.849,9.298    C198.241,407.524,201.352,409.603,204.803,409.604z"/>		<path d="M332.803,443.737c2.264,0.003,4.435-0.897,6.033-2.5l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    c-3.311-3.311-8.671-3.335-12.012-0.054l-8.533,8.533c-2.44,2.44-3.169,6.11-1.849,9.298    C326.241,441.658,329.352,443.737,332.803,443.737z"/>		<path d="M341.336,366.937c2.264,0.003,4.435-0.897,6.033-2.5l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    c-3.311-3.311-8.671-3.335-12.012-0.054l-8.533,8.533c-2.44,2.44-3.169,6.11-1.849,9.298    C334.774,364.858,337.885,366.937,341.336,366.937z"/>		<path d="M164.636,454.771l-8.533,8.533c-2.188,2.149-3.055,5.307-2.27,8.271c0.785,2.965,3.1,5.28,6.065,6.065    c2.965,0.785,6.122-0.082,8.271-2.27l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    C173.337,451.515,167.977,451.49,164.636,454.771L164.636,454.771z"/>		<path d="M232.903,429.171l-8.533,8.533c-2.188,2.149-3.055,5.307-2.27,8.271c0.785,2.965,3.1,5.28,6.065,6.065    c2.965,0.785,6.122-0.082,8.271-2.27l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    C241.604,425.915,236.243,425.89,232.903,429.171L232.903,429.171z"/>		<path d="M384.003,409.604c2.264,0.003,4.435-0.897,6.033-2.5l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    c-3.311-3.311-8.671-3.335-12.012-0.054l-8.533,8.533c-2.44,2.44-3.169,6.11-1.849,9.298    C377.441,407.524,380.552,409.603,384.003,409.604z"/>		<path d="M70.77,463.304l-8.533,8.533c-2.188,2.149-3.055,5.307-2.27,8.271s3.1,5.28,6.065,6.065    c2.965,0.785,6.122-0.082,8.271-2.27l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    C79.47,460.048,74.11,460.024,70.77,463.304L70.77,463.304z"/>		<path d="M121.97,446.238l-8.533,8.533c-2.188,2.149-3.055,5.307-2.27,8.271c0.785,2.965,3.1,5.28,6.065,6.065    c2.965,0.785,6.122-0.082,8.271-2.27l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    C130.67,442.981,125.31,442.957,121.97,446.238L121.97,446.238z"/>		<path d="M202.302,420.638c-1.6-1.601-3.77-2.5-6.033-2.5c-2.263,0-4.433,0.899-6.033,2.5l-8.533,8.533    c-2.178,2.151-3.037,5.304-2.251,8.262c0.786,2.958,3.097,5.269,6.055,6.055c2.958,0.786,6.111-0.073,8.262-2.251l8.533-8.533    c1.601-1.6,2.5-3.77,2.5-6.033C204.802,424.408,203.903,422.237,202.302,420.638L202.302,420.638z"/>		<path d="M210.836,463.304c-3.341-3.281-8.701-3.256-12.012,0.054c-3.311,3.311-3.335,8.671-0.054,12.012l8.533,8.533    c2.149,2.188,5.307,3.055,8.271,2.27c2.965-0.785,5.28-3.1,6.065-6.065c0.785-2.965-0.082-6.122-2.27-8.271L210.836,463.304z"/>		<path d="M343.836,454.771l-8.533,8.533c-2.188,2.149-3.055,5.307-2.27,8.271c0.785,2.965,3.1,5.28,6.065,6.065    c2.965,0.785,6.122-0.082,8.271-2.27l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    C352.537,451.515,347.177,451.49,343.836,454.771L343.836,454.771z"/>		<path d="M429.17,483.904c3.341,3.281,8.701,3.256,12.012-0.054s3.335-8.671,0.054-12.012l-8.533-8.533    c-3.341-3.281-8.701-3.256-12.012,0.054c-3.311,3.311-3.335,8.671-0.054,12.012L429.17,483.904z"/>		<path d="M341.336,401.071c2.264,0.003,4.435-0.897,6.033-2.5l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    s-8.671-3.335-12.012-0.054l-8.533,8.533c-2.44,2.441-3.169,6.11-1.849,9.298C334.774,398.991,337.885,401.07,341.336,401.071z"/>		<path d="M273.069,435.204c2.264,0.003,4.435-0.897,6.033-2.5l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    s-8.671-3.335-12.012-0.054l-8.533,8.533c-2.44,2.44-3.169,6.11-1.849,9.298C266.508,433.124,269.618,435.203,273.069,435.204z"/>		<path d="M253.318,258.138c22.738,7.382,46.448,11.338,70.351,11.737c31.602,0.543,62.581-8.828,88.583-26.796    c94.225-65.725,99.567-227.462,99.75-234.317c0.059-2.421-0.91-4.754-2.667-6.421c-1.751-1.679-4.141-2.52-6.558-2.308    C387.311,9.396,307.586,44.542,265.819,104.5c-28.443,42.151-38.198,94.184-26.956,143.776c-3.411,8.366-6.04,17.03-7.852,25.881    c-4.581-7.691-9.996-14.854-16.147-21.358c8.023-38.158,0.241-77.939-21.57-110.261C160.753,95.829,98.828,68.458,9.228,61.196    c-2.417-0.214-4.808,0.628-6.558,2.308c-1.757,1.667-2.726,4-2.667,6.421c0.142,5.321,4.292,130.929,77.717,182.142    c20.358,14.081,44.617,21.428,69.367,21.008c18.624-0.309,37.097-3.388,54.814-9.138c11.69,12.508,20.523,27.407,25.889,43.665    c0.149,15.133,2.158,30.19,5.982,44.832c-12.842-5.666-26.723-8.595-40.759-8.6c-49.449,0.497-91.788,35.567-101.483,84.058    c-5.094-1.093-10.29-1.641-15.5-1.638c-42.295,0.38-76.303,34.921-76.025,77.217c-0.001,2.263,0.898,4.434,2.499,6.035    c1.6,1.6,3.771,2.499,6.035,2.499h494.933c2.263,0.001,4.434-0.898,6.035-2.499c1.6-1.6,2.499-3.771,2.499-6.035    c0.249-41.103-31.914-75.112-72.967-77.154c0.65-4.78,0.975-9.598,0.975-14.421c0.914-45.674-28.469-86.455-72.083-100.045    c-43.615-13.59-90.962,3.282-116.154,41.391C242.252,322.17,242.793,288.884,253.318,258.138L253.318,258.138z M87.519,238.092    c-55.35-38.567-67.358-129.25-69.833-158.996c78.8,7.921,133.092,32.454,161.458,72.992    c15.333,22.503,22.859,49.414,21.423,76.606c-23.253-35.362-77.83-105.726-162.473-140.577c-2.82-1.165-6.048-0.736-8.466,1.125    s-3.658,4.873-3.252,7.897c0.406,3.024,2.395,5.602,5.218,6.761c89.261,36.751,144.772,117.776,161.392,144.874    C150.795,260.908,115.29,257.451,87.519,238.092z M279.969,114.046c37.6-53.788,109.708-86.113,214.408-96.138    c-2.65,35.375-17.158,159.05-91.892,211.175c-37.438,26.116-85.311,30.57-142.305,13.433    c19.284-32.09,92.484-142.574,212.405-191.954c2.819-1.161,4.805-3.738,5.209-6.76c0.404-3.022-0.835-6.031-3.25-7.892    c-2.415-1.861-5.64-2.292-8.459-1.131C351.388,82.01,279.465,179.805,252.231,222.711    C248.573,184.367,258.381,145.945,279.969,114.046L279.969,114.046z M262.694,368.017c15.097-26.883,43.468-43.587,74.3-43.746    c47.906,0.521,86.353,39.717,85.95,87.625c-0.001,7.188-0.857,14.351-2.55,21.337c-0.67,2.763,0.08,5.677,1.999,7.774    c1.919,2.097,4.757,3.1,7.568,2.676c1.994-0.272,4.005-0.393,6.017-0.362c29.59,0.283,54.467,22.284,58.367,51.617H17.661    c3.899-29.333,28.777-51.334,58.367-51.617c4-0.004,7.989,0.416,11.9,1.254c4.622,0.985,9.447,0.098,13.417-2.467    c3.858-2.519,6.531-6.493,7.408-11.017c7.793-40.473,43.043-69.838,84.258-70.192c16.045-0.002,31.757,4.582,45.283,13.212    c4.01,2.561,8.897,3.358,13.512,2.205C256.422,375.165,260.36,372.163,262.694,368.017L262.694,368.017z"/>	</g></g>' },
    {
        id: 'node1112', type: 'Native', x: 200, y: 400, width: 100, height: 100, isVisible: true, content: '<g xmlns="http://www.w3.org/2000/svg">' +
            '<rect height="256" width="256" fill="#34353F"/>' +
            '<path id="path1" transform="rotate(0,128,128) translate(59.1078108549118,59) scale(4.3125,4.3125)  " fill="#FFFFFF" d="M12.12701,24.294998C12.75201,24.294998 13.258998,24.803009 13.258998,25.428009 13.258998,26.056 12.75201,26.563004 12.12701,26.563004 11.499019,26.563004 10.993007,26.056 10.993007,25.428009 10.993007,24.803009 11.499019,24.294998 12.12701,24.294998z M7.9750035,24.294998C8.6010101,24.294998 9.1090057,24.803009 9.1090057,25.428009 9.1090057,26.056 8.6010101,26.563004 7.9750035,26.563004 7.3480199,26.563004 6.8399942,26.056 6.8399942,25.428009 6.8399942,24.803009 7.3480199,24.294998 7.9750035,24.294998z M7.9750035,20.286011C8.6010101,20.286011 9.1090057,20.792999 9.1090057,21.419006 9.1090057,22.044006 8.6010101,22.552002 7.9750035,22.552002 7.3500035,22.552002 6.8420084,22.044006 6.8420084,21.419006 6.8420084,20.792999 7.3500035,20.286011 7.9750035,20.286011z M18.499994,19.317001C18.313013,19.317001,18.156,19.472,18.156,19.656006L18.156,27.01001C18.156,27.195007,18.313013,27.350006,18.499994,27.350006L29.521993,27.350006C29.707998,27.350006,29.865988,27.195007,29.865988,27.01001L29.865988,19.656006C29.865988,19.472,29.707998,19.317001,29.521993,19.317001z M17.243006,17.443008L30.778003,17.443008C31.425007,17.445007,31.947986,17.962006,31.950001,18.602997L31.950001,28.542007C31.947986,29.182999,31.425007,29.702011,30.778003,29.703003L25.654012,29.703003C25.511007,29.703003 25.399008,29.824997 25.413992,29.964996 25.430013,30.13501 25.452993,30.360001 25.477011,30.559998 25.506002,30.809998 25.727987,30.980011 25.976003,31.033997L27.756002,31.419006C27.907003,31.452011 28.015005,31.584 28.015005,31.738007 28.015005,31.883011 27.895986,32 27.74999,32L27.571005,32 20.450004,32 20.318016,32C20.171013,32 20.053001,31.883011 20.053001,31.738007 20.053001,31.585007 20.161003,31.452011 20.312004,31.419998L22.115989,31.033005C22.35601,30.98201 22.572014,30.815002 22.596,30.574005 22.616997,30.363007 22.636009,30.130997 22.648002,29.960007 22.658012,29.819 22.542015,29.70401 22.399986,29.70401L17.243006,29.703003C16.596002,29.702011,16.072992,29.182999,16.071008,28.542007L16.071008,18.602997C16.072992,17.962006,16.596002,17.445007,17.243006,17.443008z M7.9750035,16.133011C8.6020172,16.133011 9.1100128,16.641006 9.1100128,17.268005 9.1100128,17.893997 8.6020172,18.402008 7.9750035,18.402008 7.3489964,18.402008 6.8410013,17.893997 6.8410013,17.268005 6.8410013,16.641006 7.3489964,16.133011 7.9750035,16.133011z M24.027,13.762009C24.654014,13.762009 25.16201,14.270004 25.16201,14.895996 25.16201,15.522003 24.654014,16.029999 24.027,16.029999 23.400993,16.029999 22.892998,15.522003 22.892998,14.895996 22.892998,14.270004 23.400993,13.762009 24.027,13.762009z M24.027,9.6110077C24.653007,9.6110077 25.161003,10.119003 25.161003,10.74501 25.161003,11.37001 24.653007,11.878006 24.027,11.878006 23.402,11.878006 22.894005,11.37001 22.894005,10.74501 22.894005,10.119003 23.402,9.6110077 24.027,9.6110077z M24.027,5.6000061C24.654014,5.6000061 25.16201,6.1080017 25.16201,6.7350006 25.16201,7.3610077 24.654014,7.8690033 24.027,7.8690033 23.400993,7.8690033 22.892998,7.3610077 22.892998,6.7350006 22.892998,6.1080017 23.400993,5.6000061 24.027,5.6000061z M19.876001,5.6000061C20.503013,5.6000061 21.011009,6.1080017 21.011009,6.7350006 21.011009,7.3610077 20.503013,7.8690033 19.876001,7.8690033 19.249994,7.8690033 18.743006,7.3610077 18.743006,6.7350006 18.743006,6.1080017 19.249994,5.6000061 19.876001,5.6000061z M2.4290157,1.8740082C2.2420037,1.8740082,2.0850215,2.029007,2.0850215,2.2140045L2.0850215,9.5680084C2.0850215,9.753006,2.2420037,9.9069977,2.4290157,9.9069977L13.451014,9.9069977C13.637995,9.9069977,13.795008,9.753006,13.795008,9.5680084L13.795008,2.2140045C13.795008,2.029007,13.637995,1.8740082,13.451014,1.8740082z M1.1730042,0L14.706996,0C15.353999,0.0019989014,15.877009,0.51899719,15.878993,1.1600037L15.878993,11.100006C15.877009,11.740005,15.353999,12.26001,14.706996,12.26001L9.5830047,12.26001C9.4399994,12.26001 9.3290069,12.382004 9.3420074,12.52301 9.3600128,12.692001 9.3829925,12.917999 9.4060028,13.117004 9.4349945,13.367004 9.6570099,13.53801 9.9049957,13.591003L11.684994,13.975998C11.835994,14.009003 11.945003,14.141998 11.945003,14.294998 11.945003,14.440002 11.826015,14.557007 11.679012,14.557007L11.499996,14.557007 4.3789966,14.557007 4.2470081,14.557007C4.1000049,14.557007 3.9819935,14.440002 3.9819937,14.294998 3.9819935,14.141998 4.0899952,14.009003 4.2409961,13.977005L6.0450113,13.589996C6.2860086,13.539001 6.501005,13.373001 6.5249918,13.130997 6.5460184,12.921005 6.5650003,12.688004 6.5769937,12.516998 6.5870035,12.376999 6.4710062,12.262009 6.3290079,12.262009L1.1730042,12.26001C0.52499391,12.26001,0.0020143806,11.740005,0,11.100006L0,1.1600037C0.0020143806,0.51899719,0.52499391,0.0019989014,1.1730042,0z"/>' +
            '</g>'
    }
];

describe('Diagram Control', () => {
    describe('Update Datasource without using layout issue fix', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let items1: DataManager = new DataManager(complexData as JSON[], new Query().take(3));

        beforeAll(() => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            diagram = new Diagram({
                width: '900px', height: '550px',
                //layout: { type: 'HierarchicalTree' },
                dataSourceSettings: {
                    // sets the fields to bind
                    dataSource: new DataManager(hierarchicalTree as JSON[]), // binds the data with the nodess
                    doBinding: (
                        nodeModel: NodeModel,
                        data: object,
                        diagram: Diagram
                    ) => {
                        nodeModel.id = (data as IEmployeeInfo).id,
                            nodeModel.height = (data as IEmployeeInfo).height,
                            nodeModel.width = (data as IEmployeeInfo).width,
                            nodeModel.offsetX = (data as IEmployeeInfo).x,
                            nodeModel.offsetY = (data as IEmployeeInfo).y,
                            nodeModel.visible = (data as IEmployeeInfo).isVisible
                        nodeModel.shape = {
                            content: (data as IEmployeeInfo).content,
                            type: 'Native',
                        }
                    },
                    id: 'id',

                },
            });
            diagram.appendTo('#diagram');
        });
        afterAll(() => {
            diagram.destroy();
            ele.remove();
        });

        it('checking the node which have multiple parent', (done: Function) => {
            var hierarchicalTree: any = [
                { id: 'node1111', type: 'Native', x: 500, y: 250, width: 100, height: 100, isVisible: true, content: '<g xmlns="http://www.w3.org/2000/svg">	<g transform="translate(1 1)">		<g>			<path style="fill:#61443C;" d="M61.979,435.057c2.645-0.512,5.291-0.853,7.936-1.109c-2.01,1.33-4.472,1.791-6.827,1.28     C62.726,435.13,62.354,435.072,61.979,435.057z"/>			<path style="fill:#61443C;" d="M502.469,502.471h-25.6c0.163-30.757-20.173-57.861-49.749-66.304     c-5.784-1.581-11.753-2.385-17.749-2.389c-2.425-0.028-4.849,0.114-7.253,0.427c1.831-7.63,2.747-15.45,2.731-23.296     c0.377-47.729-34.52-88.418-81.749-95.317c4.274-0.545,8.577-0.83,12.885-0.853c25.285,0.211,49.448,10.466,67.167,28.504     c17.719,18.039,27.539,42.382,27.297,67.666c0.017,7.846-0.9,15.666-2.731,23.296c2.405-0.312,4.829-0.455,7.253-0.427     C472.572,434.123,502.783,464.869,502.469,502.471z"/>		</g>		<path style="fill:#8B685A;" d="M476.869,502.471H7.536c-0.191-32.558,22.574-60.747,54.443-67.413    c0.375,0.015,0.747,0.072,1.109,0.171c2.355,0.511,4.817,0.05,6.827-1.28c1.707-0.085,3.413-0.171,5.12-0.171    c4.59,0,9.166,0.486,13.653,1.451c2.324,0.559,4.775,0.147,6.787-1.141c2.013-1.288,3.414-3.341,3.879-5.685    c7.68-39.706,39.605-70.228,79.616-76.117c4.325-0.616,8.687-0.929,13.056-0.939c13.281-0.016,26.409,2.837,38.485,8.363    c3.917,1.823,7.708,3.904,11.349,6.229c2.039,1.304,4.527,1.705,6.872,1.106c2.345-0.598,4.337-2.142,5.502-4.264    c14.373-25.502,39.733-42.923,68.693-47.189h0.171c47.229,6.899,82.127,47.588,81.749,95.317c0.017,7.846-0.9,15.666-2.731,23.296    c2.405-0.312,4.829-0.455,7.253-0.427c5.996,0.005,11.965,0.808,17.749,2.389C456.696,444.61,477.033,471.713,476.869,502.471    L476.869,502.471z"/>		<path style="fill:#66993E;" d="M502.469,7.537c0,0-6.997,264.96-192.512,252.245c-20.217-1.549-40.166-5.59-59.392-12.032    c-1.365-0.341-2.731-0.853-4.096-1.28c0,0-0.597-2.219-1.451-6.144c-6.656-34.048-25.088-198.997,231.765-230.144    C485.061,9.159,493.595,8.22,502.469,7.537z"/>		<path style="fill:#9ACA5C;" d="M476.784,10.183c-1.28,26.197-16.213,238.165-166.827,249.6    c-20.217-1.549-40.166-5.59-59.392-12.032c-1.365-0.341-2.731-0.853-4.096-1.28c0,0-0.597-2.219-1.451-6.144    C238.363,206.279,219.931,41.329,476.784,10.183z"/>		<path style="fill:#66993E;" d="M206.192,246.727c-0.768,3.925-1.365,6.144-1.365,6.144c-1.365,0.427-2.731,0.939-4.096,1.28    c-21.505,7.427-44.293,10.417-66.987,8.789C21.104,252.103,8.816,94.236,7.621,71.452c-0.085-1.792-0.085-2.731-0.085-2.731    C222.747,86.129,211.653,216.689,206.192,246.727z"/>		<path style="fill:#9ACA5C;" d="M180.336,246.727c-0.768,3.925-1.365,6.144-1.365,6.144c-1.365,0.427-2.731,0.939-4.096,1.28    c-13.351,4.412-27.142,7.359-41.131,8.789C21.104,252.103,8.816,94.236,7.621,71.452    C195.952,96.881,185.541,217.969,180.336,246.727z"/>	</g>	<g>		<path d="M162.136,426.671c3.451-0.001,6.562-2.08,7.882-5.268s0.591-6.858-1.849-9.298l-8.533-8.533    c-3.341-3.281-8.701-3.256-12.012,0.054c-3.311,3.311-3.335,8.671-0.054,12.012l8.533,8.533    C157.701,425.773,159.872,426.673,162.136,426.671L162.136,426.671z"/>		<path d="M292.636,398.57c3.341,3.281,8.701,3.256,12.012-0.054c3.311-3.311,3.335-8.671,0.054-12.012l-8.533-8.533    c-3.341-3.281-8.701-3.256-12.012,0.054s-3.335,8.671-0.054,12.012L292.636,398.57z"/>		<path d="M296.169,454.771c-3.341-3.281-8.701-3.256-12.012,0.054c-3.311,3.311-3.335,8.671-0.054,12.012l8.533,8.533    c3.341,3.281,8.701,3.256,12.012-0.054c3.311-3.311,3.335-8.671,0.054-12.012L296.169,454.771z"/>		<path d="M386.503,475.37c3.341,3.281,8.701,3.256,12.012-0.054c3.311-3.311,3.335-8.671,0.054-12.012l-8.533-8.533    c-3.341-3.281-8.701-3.256-12.012,0.054c-3.311,3.311-3.335,8.671-0.054,12.012L386.503,475.37z"/>		<path d="M204.803,409.604c2.264,0.003,4.435-0.897,6.033-2.5l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    c-3.311-3.311-8.671-3.335-12.012-0.054l-8.533,8.533c-2.44,2.44-3.169,6.11-1.849,9.298    C198.241,407.524,201.352,409.603,204.803,409.604z"/>		<path d="M332.803,443.737c2.264,0.003,4.435-0.897,6.033-2.5l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    c-3.311-3.311-8.671-3.335-12.012-0.054l-8.533,8.533c-2.44,2.44-3.169,6.11-1.849,9.298    C326.241,441.658,329.352,443.737,332.803,443.737z"/>		<path d="M341.336,366.937c2.264,0.003,4.435-0.897,6.033-2.5l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    c-3.311-3.311-8.671-3.335-12.012-0.054l-8.533,8.533c-2.44,2.44-3.169,6.11-1.849,9.298    C334.774,364.858,337.885,366.937,341.336,366.937z"/>		<path d="M164.636,454.771l-8.533,8.533c-2.188,2.149-3.055,5.307-2.27,8.271c0.785,2.965,3.1,5.28,6.065,6.065    c2.965,0.785,6.122-0.082,8.271-2.27l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    C173.337,451.515,167.977,451.49,164.636,454.771L164.636,454.771z"/>		<path d="M232.903,429.171l-8.533,8.533c-2.188,2.149-3.055,5.307-2.27,8.271c0.785,2.965,3.1,5.28,6.065,6.065    c2.965,0.785,6.122-0.082,8.271-2.27l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    C241.604,425.915,236.243,425.89,232.903,429.171L232.903,429.171z"/>		<path d="M384.003,409.604c2.264,0.003,4.435-0.897,6.033-2.5l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    c-3.311-3.311-8.671-3.335-12.012-0.054l-8.533,8.533c-2.44,2.44-3.169,6.11-1.849,9.298    C377.441,407.524,380.552,409.603,384.003,409.604z"/>		<path d="M70.77,463.304l-8.533,8.533c-2.188,2.149-3.055,5.307-2.27,8.271s3.1,5.28,6.065,6.065    c2.965,0.785,6.122-0.082,8.271-2.27l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    C79.47,460.048,74.11,460.024,70.77,463.304L70.77,463.304z"/>		<path d="M121.97,446.238l-8.533,8.533c-2.188,2.149-3.055,5.307-2.27,8.271c0.785,2.965,3.1,5.28,6.065,6.065    c2.965,0.785,6.122-0.082,8.271-2.27l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    C130.67,442.981,125.31,442.957,121.97,446.238L121.97,446.238z"/>		<path d="M202.302,420.638c-1.6-1.601-3.77-2.5-6.033-2.5c-2.263,0-4.433,0.899-6.033,2.5l-8.533,8.533    c-2.178,2.151-3.037,5.304-2.251,8.262c0.786,2.958,3.097,5.269,6.055,6.055c2.958,0.786,6.111-0.073,8.262-2.251l8.533-8.533    c1.601-1.6,2.5-3.77,2.5-6.033C204.802,424.408,203.903,422.237,202.302,420.638L202.302,420.638z"/>		<path d="M210.836,463.304c-3.341-3.281-8.701-3.256-12.012,0.054c-3.311,3.311-3.335,8.671-0.054,12.012l8.533,8.533    c2.149,2.188,5.307,3.055,8.271,2.27c2.965-0.785,5.28-3.1,6.065-6.065c0.785-2.965-0.082-6.122-2.27-8.271L210.836,463.304z"/>		<path d="M343.836,454.771l-8.533,8.533c-2.188,2.149-3.055,5.307-2.27,8.271c0.785,2.965,3.1,5.28,6.065,6.065    c2.965,0.785,6.122-0.082,8.271-2.27l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    C352.537,451.515,347.177,451.49,343.836,454.771L343.836,454.771z"/>		<path d="M429.17,483.904c3.341,3.281,8.701,3.256,12.012-0.054s3.335-8.671,0.054-12.012l-8.533-8.533    c-3.341-3.281-8.701-3.256-12.012,0.054c-3.311,3.311-3.335,8.671-0.054,12.012L429.17,483.904z"/>		<path d="M341.336,401.071c2.264,0.003,4.435-0.897,6.033-2.5l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    s-8.671-3.335-12.012-0.054l-8.533,8.533c-2.44,2.441-3.169,6.11-1.849,9.298C334.774,398.991,337.885,401.07,341.336,401.071z"/>		<path d="M273.069,435.204c2.264,0.003,4.435-0.897,6.033-2.5l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    s-8.671-3.335-12.012-0.054l-8.533,8.533c-2.44,2.44-3.169,6.11-1.849,9.298C266.508,433.124,269.618,435.203,273.069,435.204z"/>		<path d="M253.318,258.138c22.738,7.382,46.448,11.338,70.351,11.737c31.602,0.543,62.581-8.828,88.583-26.796    c94.225-65.725,99.567-227.462,99.75-234.317c0.059-2.421-0.91-4.754-2.667-6.421c-1.751-1.679-4.141-2.52-6.558-2.308    C387.311,9.396,307.586,44.542,265.819,104.5c-28.443,42.151-38.198,94.184-26.956,143.776c-3.411,8.366-6.04,17.03-7.852,25.881    c-4.581-7.691-9.996-14.854-16.147-21.358c8.023-38.158,0.241-77.939-21.57-110.261C160.753,95.829,98.828,68.458,9.228,61.196    c-2.417-0.214-4.808,0.628-6.558,2.308c-1.757,1.667-2.726,4-2.667,6.421c0.142,5.321,4.292,130.929,77.717,182.142    c20.358,14.081,44.617,21.428,69.367,21.008c18.624-0.309,37.097-3.388,54.814-9.138c11.69,12.508,20.523,27.407,25.889,43.665    c0.149,15.133,2.158,30.19,5.982,44.832c-12.842-5.666-26.723-8.595-40.759-8.6c-49.449,0.497-91.788,35.567-101.483,84.058    c-5.094-1.093-10.29-1.641-15.5-1.638c-42.295,0.38-76.303,34.921-76.025,77.217c-0.001,2.263,0.898,4.434,2.499,6.035    c1.6,1.6,3.771,2.499,6.035,2.499h494.933c2.263,0.001,4.434-0.898,6.035-2.499c1.6-1.6,2.499-3.771,2.499-6.035    c0.249-41.103-31.914-75.112-72.967-77.154c0.65-4.78,0.975-9.598,0.975-14.421c0.914-45.674-28.469-86.455-72.083-100.045    c-43.615-13.59-90.962,3.282-116.154,41.391C242.252,322.17,242.793,288.884,253.318,258.138L253.318,258.138z M87.519,238.092    c-55.35-38.567-67.358-129.25-69.833-158.996c78.8,7.921,133.092,32.454,161.458,72.992    c15.333,22.503,22.859,49.414,21.423,76.606c-23.253-35.362-77.83-105.726-162.473-140.577c-2.82-1.165-6.048-0.736-8.466,1.125    s-3.658,4.873-3.252,7.897c0.406,3.024,2.395,5.602,5.218,6.761c89.261,36.751,144.772,117.776,161.392,144.874    C150.795,260.908,115.29,257.451,87.519,238.092z M279.969,114.046c37.6-53.788,109.708-86.113,214.408-96.138    c-2.65,35.375-17.158,159.05-91.892,211.175c-37.438,26.116-85.311,30.57-142.305,13.433    c19.284-32.09,92.484-142.574,212.405-191.954c2.819-1.161,4.805-3.738,5.209-6.76c0.404-3.022-0.835-6.031-3.25-7.892    c-2.415-1.861-5.64-2.292-8.459-1.131C351.388,82.01,279.465,179.805,252.231,222.711    C248.573,184.367,258.381,145.945,279.969,114.046L279.969,114.046z M262.694,368.017c15.097-26.883,43.468-43.587,74.3-43.746    c47.906,0.521,86.353,39.717,85.95,87.625c-0.001,7.188-0.857,14.351-2.55,21.337c-0.67,2.763,0.08,5.677,1.999,7.774    c1.919,2.097,4.757,3.1,7.568,2.676c1.994-0.272,4.005-0.393,6.017-0.362c29.59,0.283,54.467,22.284,58.367,51.617H17.661    c3.899-29.333,28.777-51.334,58.367-51.617c4-0.004,7.989,0.416,11.9,1.254c4.622,0.985,9.447,0.098,13.417-2.467    c3.858-2.519,6.531-6.493,7.408-11.017c7.793-40.473,43.043-69.838,84.258-70.192c16.045-0.002,31.757,4.582,45.283,13.212    c4.01,2.561,8.897,3.358,13.512,2.205C256.422,375.165,260.36,372.163,262.694,368.017L262.694,368.017z"/>	</g></g>' },
                {
                    id: 'node1112', type: 'Native', x: 500, y: 450, width: 100, height: 100, isVisible: true, content: '<g xmlns="http://www.w3.org/2000/svg">' +
                        '<rect height="256" width="256" fill="#34353F"/>' +
                        '<path id="path1" transform="rotate(0,128,128) translate(59.1078108549118,59) scale(4.3125,4.3125)  " fill="#FFFFFF" d="M12.12701,24.294998C12.75201,24.294998 13.258998,24.803009 13.258998,25.428009 13.258998,26.056 12.75201,26.563004 12.12701,26.563004 11.499019,26.563004 10.993007,26.056 10.993007,25.428009 10.993007,24.803009 11.499019,24.294998 12.12701,24.294998z M7.9750035,24.294998C8.6010101,24.294998 9.1090057,24.803009 9.1090057,25.428009 9.1090057,26.056 8.6010101,26.563004 7.9750035,26.563004 7.3480199,26.563004 6.8399942,26.056 6.8399942,25.428009 6.8399942,24.803009 7.3480199,24.294998 7.9750035,24.294998z M7.9750035,20.286011C8.6010101,20.286011 9.1090057,20.792999 9.1090057,21.419006 9.1090057,22.044006 8.6010101,22.552002 7.9750035,22.552002 7.3500035,22.552002 6.8420084,22.044006 6.8420084,21.419006 6.8420084,20.792999 7.3500035,20.286011 7.9750035,20.286011z M18.499994,19.317001C18.313013,19.317001,18.156,19.472,18.156,19.656006L18.156,27.01001C18.156,27.195007,18.313013,27.350006,18.499994,27.350006L29.521993,27.350006C29.707998,27.350006,29.865988,27.195007,29.865988,27.01001L29.865988,19.656006C29.865988,19.472,29.707998,19.317001,29.521993,19.317001z M17.243006,17.443008L30.778003,17.443008C31.425007,17.445007,31.947986,17.962006,31.950001,18.602997L31.950001,28.542007C31.947986,29.182999,31.425007,29.702011,30.778003,29.703003L25.654012,29.703003C25.511007,29.703003 25.399008,29.824997 25.413992,29.964996 25.430013,30.13501 25.452993,30.360001 25.477011,30.559998 25.506002,30.809998 25.727987,30.980011 25.976003,31.033997L27.756002,31.419006C27.907003,31.452011 28.015005,31.584 28.015005,31.738007 28.015005,31.883011 27.895986,32 27.74999,32L27.571005,32 20.450004,32 20.318016,32C20.171013,32 20.053001,31.883011 20.053001,31.738007 20.053001,31.585007 20.161003,31.452011 20.312004,31.419998L22.115989,31.033005C22.35601,30.98201 22.572014,30.815002 22.596,30.574005 22.616997,30.363007 22.636009,30.130997 22.648002,29.960007 22.658012,29.819 22.542015,29.70401 22.399986,29.70401L17.243006,29.703003C16.596002,29.702011,16.072992,29.182999,16.071008,28.542007L16.071008,18.602997C16.072992,17.962006,16.596002,17.445007,17.243006,17.443008z M7.9750035,16.133011C8.6020172,16.133011 9.1100128,16.641006 9.1100128,17.268005 9.1100128,17.893997 8.6020172,18.402008 7.9750035,18.402008 7.3489964,18.402008 6.8410013,17.893997 6.8410013,17.268005 6.8410013,16.641006 7.3489964,16.133011 7.9750035,16.133011z M24.027,13.762009C24.654014,13.762009 25.16201,14.270004 25.16201,14.895996 25.16201,15.522003 24.654014,16.029999 24.027,16.029999 23.400993,16.029999 22.892998,15.522003 22.892998,14.895996 22.892998,14.270004 23.400993,13.762009 24.027,13.762009z M24.027,9.6110077C24.653007,9.6110077 25.161003,10.119003 25.161003,10.74501 25.161003,11.37001 24.653007,11.878006 24.027,11.878006 23.402,11.878006 22.894005,11.37001 22.894005,10.74501 22.894005,10.119003 23.402,9.6110077 24.027,9.6110077z M24.027,5.6000061C24.654014,5.6000061 25.16201,6.1080017 25.16201,6.7350006 25.16201,7.3610077 24.654014,7.8690033 24.027,7.8690033 23.400993,7.8690033 22.892998,7.3610077 22.892998,6.7350006 22.892998,6.1080017 23.400993,5.6000061 24.027,5.6000061z M19.876001,5.6000061C20.503013,5.6000061 21.011009,6.1080017 21.011009,6.7350006 21.011009,7.3610077 20.503013,7.8690033 19.876001,7.8690033 19.249994,7.8690033 18.743006,7.3610077 18.743006,6.7350006 18.743006,6.1080017 19.249994,5.6000061 19.876001,5.6000061z M2.4290157,1.8740082C2.2420037,1.8740082,2.0850215,2.029007,2.0850215,2.2140045L2.0850215,9.5680084C2.0850215,9.753006,2.2420037,9.9069977,2.4290157,9.9069977L13.451014,9.9069977C13.637995,9.9069977,13.795008,9.753006,13.795008,9.5680084L13.795008,2.2140045C13.795008,2.029007,13.637995,1.8740082,13.451014,1.8740082z M1.1730042,0L14.706996,0C15.353999,0.0019989014,15.877009,0.51899719,15.878993,1.1600037L15.878993,11.100006C15.877009,11.740005,15.353999,12.26001,14.706996,12.26001L9.5830047,12.26001C9.4399994,12.26001 9.3290069,12.382004 9.3420074,12.52301 9.3600128,12.692001 9.3829925,12.917999 9.4060028,13.117004 9.4349945,13.367004 9.6570099,13.53801 9.9049957,13.591003L11.684994,13.975998C11.835994,14.009003 11.945003,14.141998 11.945003,14.294998 11.945003,14.440002 11.826015,14.557007 11.679012,14.557007L11.499996,14.557007 4.3789966,14.557007 4.2470081,14.557007C4.1000049,14.557007 3.9819935,14.440002 3.9819937,14.294998 3.9819935,14.141998 4.0899952,14.009003 4.2409961,13.977005L6.0450113,13.589996C6.2860086,13.539001 6.501005,13.373001 6.5249918,13.130997 6.5460184,12.921005 6.5650003,12.688004 6.5769937,12.516998 6.5870035,12.376999 6.4710062,12.262009 6.3290079,12.262009L1.1730042,12.26001C0.52499391,12.26001,0.0020143806,11.740005,0,11.100006L0,1.1600037C0.0020143806,0.51899719,0.52499391,0.0019989014,1.1730042,0z"/>' +
                        '</g>'
                }
            ];
            diagram.dataSourceSettings.dataSource = new DataManager(hierarchicalTree as JSON[]);
            diagram.dataBind();
            var element = document.getElementById('node1111_content_groupElement')
            var child = element.children[0]
            expect((child.getAttribute('x') === '450.5') && (child.getAttribute('y') === '200.5')).toBe(true)
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
});
export interface EmployeeInfo {
    Name: string;
}
describe('Diagram Control', () => {
    describe('connector bridging module enable - decorator isse', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let items1: DataManager = new DataManager(complexData as JSON[], new Query().take(3));
        let hierarchicalTree: any = [
            {
                "Name": "Diagram",
                "fillColor": "#916DAF"
            },
            {
                "Name": "Layout",
                "Category": "Diagram"
            },
        ];

        let data: Object = {
            //sets the fields to bind
            id: 'Name', parentId: 'Category',
            dataSource: new DataManager(hierarchicalTree),
            //binds the data with the nodes
            doBinding: (nodeModel: NodeModel, data: object, diagram: Diagram) => {
                nodeModel.shape = { type: 'Text', content: (data as EmployeeInfo).Name };
            }
        };
        let items: DataManager = new DataManager(data as JSON[], new Query().take(7));
        let snapSettings: SnapSettingsModel = { constraints: SnapConstraints.None };

        let layout: Object = {
            type: 'HierarchicalTree', verticalSpacing: 30, horizontalSpacing: 40,
            enableAnimation: true
        };
        beforeAll(() => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            diagram = new Diagram({
                width: '900px', height: '550px',
                snapSettings: snapSettings,
                layout: layout,//{ type: 'HierarchicalTree' },
                dataSourceSettings: data,
                //dataSourceSettings: { id: 'id', parentId: 'parentId', dataManager: items },
                getNodeDefaults: (obj: Node) => {
                    obj.style = { fill: '#659be5', strokeColor: 'none', color: 'white', strokeWidth: 2 };
                    obj.borderColor = '#3a6eb5';
                    obj.backgroundColor = '#659be5';
                    (obj.shape as TextModel).margin = { left: 5, right: 5, bottom: 5, top: 5 };
                    obj.expandIcon = { height: 10, width: 10, shape: 'None', fill: 'lightgray', offset: { x: .5, y: 1 } };
                    obj.expandIcon.verticalAlignment = 'Auto';
                    obj.expandIcon.margin = { left: 0, right: 0, top: 0, bottom: 0 };
                    obj.collapseIcon.offset = { x: .5, y: 1 };
                    obj.collapseIcon.verticalAlignment = 'Auto';
                    obj.collapseIcon.margin = { left: 0, right: 0, top: 0, bottom: 0 };
                    obj.collapseIcon.height = 10;
                    obj.collapseIcon.width = 10;
                    obj.collapseIcon.padding.top = 5;
                    obj.collapseIcon.shape = 'None';
                    obj.collapseIcon.fill = 'lightgray';
                    return obj;
                }, getConnectorDefaults: (connector: ConnectorModel, diagram: Diagram) => {
                    // connector.targetDecorator.shape = 'None';
                    connector.type = 'Orthogonal';
                    // connector.constraints = 0;
                    connector.cornerRadius = 5;
                    connector.style.strokeColor = '#6d6d6d';
                    return connector;
                }
            });
            diagram.appendTo('#diagram');
        });
        afterAll(() => {
            diagram.destroy();
            ele.remove();
        });

        it('connector bridging module enable - decorator isse', (done: Function) => {
            var node = diagram.nodes[1]
            diagram.drag(node, -50, -50)
            var pathelement = document.getElementById('diagram_diagramLayer')
            console.log('decorator isse')
            console.log(pathelement.children[2].children[1].children[0].getAttribute('d'))
            console.log(pathelement.children[2].children[3].children[0].getAttribute('d'))
            expect((pathelement.children[2].children[1].children[0].getAttribute('d') === "M93.35,40 L93.35,59.4 Q93.35,64.4,88.35,64.4 L5,64.4 Q0,64.4,0,59.4 L0,5 Q0,0,5,0 L38.35,0 Q43.35,0,43.35,5 L43.35,20.6 " ||
                pathelement.children[2].children[1].children[0].getAttribute('d') === "M93.35,40 L93.35,59.4 Q93.35,64.4,88.35,64.4 L5,64.4 Q0,64.4,0,59.4 L0,5 Q0,0,5,0 L38.35,0 Q43.35,0,43.35,5 L43.35,20.6 " || pathelement.children[2].children[1].children[0].getAttribute('d') === "M94.69,40 L94.69,59.4 Q94.69,64.4,89.69,64.4 L5,64.4 Q0,64.4,0,59.4 L0,5 Q0,0,5,0 L39.69,0 Q44.69,0,44.69,5 L44.69,20.6 ") &&
                (pathelement.children[2].children[3].children[0].getAttribute('d') === "M10,0 L10,10 L0,5 Z " || pathelement.children[2].children[3].children[0].getAttribute('d') === "M10,0 L10,10 L0,5 Z " || pathelement.children[2].children[3].children[0].getAttribute('d') === "M10,0 L10,10 L0,5 Z ")).toBe(true);
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
    describe('Complex Tree Layout', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let items: DataManager = new DataManager(data as JSON[], new Query().take(7));
        beforeAll(() => {
            ele = createElement('div', { id: 'diagramComplexHierarchicalTreeUpdate' });
            document.body.appendChild(ele);
            diagram = new Diagram({
                width: 1000, height: 1000,
                nodes: [
                    {
                        id: 'node0',
                        offsetX: 100,
                        offsetY: 100,
                        width: 30,
                        height: 30,
                        annotations: [{
                            content: 'Start',
                            margin: { bottom: -30 }
                        }],
                        style: {
                            strokeColor: '#62A716',
                            strokeWidth: 1
                        }
                    },
                    {
                        id: 'node1',
                        offsetX: 250,
                        offsetY: 250,
                        width: 90,
                        height: 60,
                        annotations: [
                            {
                                content: 'Activity 1'
                            }
                        ],
                        /*borderColor: '#78BE83',*/
                        borderWidth: 4,
                        style: {
                            fill: '#d8ecdc',
                            strokeColor: '#78BE83',
                            strokeWidth: 3,
                            gradient: {
                                // Start point of linear gradient
                                x1: 0,
                                y1: 0,
                                // End point of linear gradient
                                x2: 1,
                                y2: 1,
                                // Sets an array of stop objects
                                stops: [
                                    {
                                        color: 'white',
                                        offset: 30,
                                        opacity: 0.1
                                    },
                                    {
                                        color: '#d8ecdc',
                                        offset: 100,
                                        opacity: 0.1
                                    }
                                ],
                                type: 'Linear'
                            }
                        }
                    },
                    {
                        id: 'node2',
                        offsetX: 250,
                        offsetY: 800,
                        width: 90,
                        height: 60,
                        /*borderColor: '#78BE83',*/
                        borderWidth: 4,
                        annotations: [
                            {
                                content: `Sample Text`,
                                // horizontalAlignment: 'Left',
                                style: {
                                    textOverflow: 'Ellipsis',
                                    textWrapping: 'NoWrap',
                                    // textAlign: 'Left',
                                    whiteSpace: 'CollapseAll'
                                },
                                height: 50,
                                width: 80,
                                margin: { left: 0, top: 0, right: 0, bottom: 0 }
                            }
                        ],
                        style: {
                            strokeColor: '#778899',
                            strokeWidth: 3
                        }
                    },

                    { id: 'node3', offsetX: 500, offsetY: 100 },
                    { id: 'node4', offsetX: 500, offsetY: 300 }

                ],
                connectors: [{
                    id: 'connector1', sourceID: 'node0', targetID: 'node1'
                },
                {
                    id: 'connector2', sourceID: 'node1', targetID: 'node2'
                }
                ],
                layout: { type: 'ComplexHierarchicalTree', horizontalSpacing: 40, verticalSpacing: 40, orientation: 'TopToBottom' },
            });
            diagram.appendTo('#diagramComplexHierarchicalTreeUpdate');
        });
        afterAll(() => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking TopToBottom complex tree layout', (done: Function) => {
            diagram.layout.orientation = 'TopToBottom';
            diagram.layout.type = 'HierarchicalTree';
            diagram.doLayout();
            expect(diagram.nodes[3].offsetX == 500 && diagram.nodes[3].offsetY == 100 && diagram.nodes[4].offsetX == 500 &&
                diagram.nodes[4].offsetY == 300).toBe(true);
            done();
        });

        it('CR issue for node and connector collection reset', (done: Function) => {
            diagram.layout.orientation = "LeftToRight"
            diagram.nodes = [
                {
                    id: 'node0',
                    offsetX: 100,
                    offsetY: 100,
                    width: 30,
                    height: 30,
                    annotations: [{
                        content: 'Start',
                        margin: { bottom: -30 }
                    }],
                    style: {
                        strokeColor: '#62A716',
                        strokeWidth: 1
                    }
                },
                {
                    id: 'node1',
                    offsetX: 250,
                    offsetY: 250,
                    width: 90,
                    height: 60,
                    annotations: [
                        {
                            content: 'Activity 1'
                        }
                    ],
                    /*borderColor: '#78BE83',*/
                    borderWidth: 4,
                    style: {
                        fill: '#d8ecdc',
                        strokeColor: '#78BE83',
                        strokeWidth: 3,
                        gradient: {
                            // Start point of linear gradient
                            x1: 0,
                            y1: 0,
                            // End point of linear gradient
                            x2: 1,
                            y2: 1,
                            // Sets an array of stop objects
                            stops: [
                                {
                                    color: 'white',
                                    offset: 30,
                                    opacity: 0.1
                                },
                                {
                                    color: '#d8ecdc',
                                    offset: 100,
                                    opacity: 0.1
                                }
                            ],
                            type: 'Linear'
                        }
                    }
                },
                {
                    id: 'node2',
                    offsetX: 250,
                    offsetY: 800,
                    width: 90,
                    height: 60,
                    /*borderColor: '#78BE83',*/
                    borderWidth: 4,
                    annotations: [
                        {
                            content: `Sample Text`,
                            // horizontalAlignment: 'Left',
                            style: {
                                textOverflow: 'Ellipsis',
                                textWrapping: 'NoWrap',
                                // textAlign: 'Left',
                                whiteSpace: 'CollapseAll'
                            },
                            height: 50,
                            width: 80,
                            margin: { left: 0, top: 0, right: 0, bottom: 0 }
                        }
                    ],
                    style: {
                        strokeColor: '#778899',
                        strokeWidth: 3
                    }
                },

                { id: 'node3', offsetX: 500, offsetY: 100 },
                { id: 'node4', offsetX: 500, offsetY: 300 }

            ];
            diagram.connectors = [{
                id: 'connector1', sourceID: 'node0', targetID: 'node1'
            },
            {
                id: 'connector2', sourceID: 'node1', targetID: 'node2'
            }
            ];
            diagram.dataBind();
            expect(diagram.nodes[0].offsetX === 65 && diagram.nodes[0].offsetY === 417.5 && diagram.nodes.length === 5).toBe(true);
            done();
        });
    });
});





////////////// test cases
export interface Activity {
    Code: string;
    Description: string;
    NodeType: string;
    Speed: string;
    Allocation: number;
}

describe('Layout nodes and connectors overllaping issues', () => {
    describe('Layout nodes and connectors overllaping issues', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        var getNodeTemplate = function (obj: NodeModel) {
            // Main Panel
            const nodePanel: StackPanel = new StackPanel();
            nodePanel.id = obj.id + "_nodePanel";
            nodePanel.orientation = "Horizontal";
            nodePanel.style.strokeColor = "none";
            nodePanel.height = 96;
            nodePanel.width = 196;
            nodePanel.style.fill = "White";

            // Content Panel
            const contentPanel: StackPanel = new StackPanel();
            contentPanel.id = obj.id + "_contentPanel";
            contentPanel.orientation = "Vertical";
            contentPanel.style.fill = "none";
            contentPanel.style.strokeColor = "none";
            contentPanel.width = 148;
            contentPanel.height = 96;

            // Sets panel for the alert, which indicates bottlenecks (i.e. green, yellow, red)
            const statusPanel: StackPanel = new StackPanel();
            statusPanel.orientation = "Horizontal";
            statusPanel.style.strokeColor = "none";
            statusPanel.id = obj.id + "_alert";
            statusPanel.width = 48;
            statusPanel.height = 96;

            // Header Panel
            const headerPanel: StackPanel = new StackPanel();
            headerPanel.id = obj.id + "_headerPanel";
            headerPanel.orientation = "Vertical";
            headerPanel.style.fill = "none";
            headerPanel.style.strokeColor = "none";
            headerPanel.height = 40;
            headerPanel.width = 148;
            headerPanel.verticalAlignment = "Top";
            headerPanel.horizontalAlignment = "Left";

            // Sets panel for the header first line (code)
            const code: TextElement = new TextElement();
            code.margin = { left: 8, right: 0, top: 8, bottom: 0 };
            code.content = (obj.data as Activity).Code;
            code.style.fontFamily = '"Fira Sans", sans-serif';
            code.style.fontSize = 10;
            code.style.color = "rgba(0,0,0,0.60)";
            code.style.textWrapping = "Wrap";
            code.style.textAlign = "Left";
            code.style.strokeColor = "none";
            code.horizontalAlignment = "Left";
            code.verticalAlignment = "Top";
            code.style.fill = "none";
            code.id = obj.id + "_code";

            // Sets panel for the header second line (description)
            const description: TextElement = new TextElement();
            description.margin = { left: 8, right: 0, top: 0, bottom: 0 };
            description.content = (obj.data as Activity).Description;
            description.style.fontFamily = '"Fira Sans", sans-serif';
            description.style.color = "rgba(0,0,0,0.60)";
            description.style.fontSize = 10;
            description.style.textAlign = "Left";
            description.style.textWrapping = "Wrap";
            description.style.strokeColor = "none";
            description.horizontalAlignment = "Left";
            description.verticalAlignment = "Bottom";
            description.style.strokeColor = "none";
            description.style.textWrapping = "Wrap";
            description.style.fill = "none";
            description.id = obj.id + "_description";

            // Sets fake panel to help spliting speed and capacity into different lines
            const detailPanel: StackPanel = new StackPanel();
            detailPanel.style.fill = "none";
            detailPanel.style.strokeColor = "none";
            detailPanel.orientation = "Vertical";
            detailPanel.id = obj.id + "_detailPanel";
            detailPanel.horizontalAlignment = "Left";
            detailPanel.width = 148;
            detailPanel.height = 56;

            // Sets panel for the details first line (speed)
            const speed: TextElement = new TextElement();
            speed.margin = { left: 8, right: 0, top: 18, bottom: 0 };
            speed.content = "Speed: " + (obj.data as Activity).Speed;
            speed.style.fontFamily = '"Fira Sans", sans-serif';
            speed.style.color = "rgba(0,0,0,0.87)";
            speed.style.fontSize = 12;
            speed.style.strokeColor = "none";
            speed.horizontalAlignment = "Left";
            speed.style.textWrapping = "Wrap";
            speed.style.fill = "none";
            speed.id = obj.id + "_speed";

            const icon: ImageElement = new ImageElement();
            icon.id = obj.id + "_icon";
            icon.style.strokeColor = "None";
            icon.margin = { left: 12, right: 0, top: 39, bottom: 0 };
            icon.style.fill = "none";
            icon.width = 24;
            icon.height = 24;

            // Sets panel for the details second line (allocation)
            const allocation: TextElement = new TextElement();
            allocation.margin = { left: 8, right: 0, top: 3, bottom: 0 };
            allocation.style.fontFamily = '"Fira Sans", sans-serif';
            allocation.style.color = "rgba(0,0,0,0.87)";
            allocation.style.fontSize = 12;
            // When allocation percent is zero, then it is showed as Non-Aplicable
            if ((obj.data as Activity).Allocation === 0) {
                allocation.content = "Allocation: N/A";
            } else {
                allocation.content =
                    "Allocation: " + (obj.data as Activity).Allocation + "%";
            }
            allocation.style.strokeColor = "none";
            allocation.horizontalAlignment = "Left";
            allocation.style.textWrapping = "Wrap";
            allocation.style.fill = "none";
            allocation.id = obj.id + "_allocation";

            // When the node is a line, no alerts will be visible and font will be slightly different
            if ((obj.data as Activity).NodeType === "Line") {
                // Composes the whole header panel
                nodePanel.style.fill = "#252E4E";
                contentPanel.style.fill = "#252E4E";
                statusPanel.style.fill = "#4A5C9B";
                description.style.color = "rgba(255,255,255,0.60)";
                code.style.color = "rgba(255,255,255,0.60)";
                speed.style.color = "rgba(255,255,255, 1)";
                allocation.style.color = "rgba(255,255,255, 1)";
                icon.source =
                    'data:image/svg+xml,%3C%3Fxml version="1.0" encoding="UTF-8"%3F%3E%3Csvg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"%3E%3C!-- Generator: Sketch 61 (89581) - https://sketch.com --%3E%3Ctitle%3Espeedometer%3C/title%3E%3Cdesc%3ECreated with Sketch.%3C/desc%3E%3Cg id="Projection-Analytics" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"%3E%3Cg id="speedometer" fill="%2300EACE" fill-rule="nonzero"%3E%3Cpath d="M10.35,13.4841078 C8.63515585,13.4841078 7.245,12.0909446 7.245,10.3723906 C7.245,9.21068287 7.87635,8.19418859 8.7975,7.66519667 L18.84735,1.83591314 L13.1238,11.7726634 C12.6063,12.7891576 11.56095,13.4841078 10.35,13.4841078 M10.35,0 C12.22335,0 13.9725,0.518619531 15.49395,1.36915556 L13.32045,2.62421483 C12.42,2.27155355 11.385,2.07447812 10.35,2.07447812 C5.77708227,2.07447812 2.07,5.78958009 2.07,10.3723906 C2.07,12.6646889 2.99115,14.7391671 4.4919,16.2327913 L4.50225,16.2327913 C4.9059,16.6373146 4.9059,17.2907752 4.50225,17.6952984 C4.0986,18.0998216 3.4362,18.0998216 3.03255,17.7056708 L3.03255,17.7056708 C1.1592,15.8282681 0,13.2351704 0,10.3723906 C0,4.64387746 4.63385284,0 10.35,0 M20.7,10.3723906 C20.7,13.2351704 19.5408,15.8282681 17.66745,17.7056708 L17.66745,17.7056708 C17.2638,18.0998216 16.61175,18.0998216 16.2081,17.6952984 C15.80445,17.2907752 15.80445,16.6373146 16.2081,16.2327913 L16.2081,16.2327913 C17.70885,14.7287947 18.63,12.6646889 18.63,10.3723906 C18.63,9.33515156 18.43335,8.2979125 18.0711,7.36439734 L19.32345,5.18619531 C20.1825,6.7420539 20.7,8.48461553 20.7,10.3723906 Z" id="Shape"%3E%3C/path%3E%3C/g%3E%3C/g%3E%3C/svg%3E';
            } else {
                // When the node is an activity
                // Alert will show the respective color based on bottlenecks
                if ((obj.data as Activity).Allocation < 80) {
                    // Green
                    statusPanel.style.fill = "#C8F0AA";
                    switch ((obj.data as Activity).NodeType) {
                        case "Manpower":
                            icon.source =
                                "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3C!-- Generator: Sketch 61 (89581) - https://sketch.com --%3E%3Ctitle%3EShape%3C/title%3E%3Cdesc%3ECreated with Sketch.%3C/desc%3E%3Cg id='Projection-Analytics' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3E%3Cg id='worker' fill='%237FBC52' fill-rule='nonzero'%3E%3Cpath d='M10.1052632,16.4210526 C4.52210526,16.4210526 0,18.6821053 0,21.4736842 L0,24 L20.2105263,24 L20.2105263,21.4736842 C20.2105263,18.6821053 15.6884211,16.4210526 10.1052632,16.4210526 M5.05263158,8.84210526 C5.05263158,11.6325966 7.31477179,13.8947368 10.1052632,13.8947368 C12.8957545,13.8947368 15.1578947,11.6325966 15.1578947,8.84210526 M9.47368421,0 C9.09473684,0 8.84210526,0.265263158 8.84210526,0.631578947 L8.84210526,4.42105263 L7.57894737,4.42105263 L7.57894737,1.26315789 C7.57894737,1.26315789 4.73684211,2.34947368 4.73684211,6 C4.73684211,6 3.78947368,6.17684211 3.78947368,7.57894737 L16.4210526,7.57894737 C16.3578947,6.17684211 15.4736842,6 15.4736842,6 C15.4736842,2.34947368 12.6315789,1.26315789 12.6315789,1.26315789 L12.6315789,4.42105263 L11.3684211,4.42105263 L11.3684211,0.631578947 C11.3684211,0.265263158 11.1284211,0 10.7368421,0 L9.47368421,0 Z' id='Shape'%3E%3C/path%3E%3C/g%3E%3C/g%3E%3C/svg%3E";
                            break;
                        case "Equipment":
                            icon.source =
                                "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3C!-- Generator: Sketch 61 (89581) - https://sketch.com --%3E%3Ctitle%3EShape%3C/title%3E%3Cdesc%3ECreated with Sketch.%3C/desc%3E%3Cg id='Projection-Analytics' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3E%3Cpath d='M18.8971429,3.42857143 L16.1428571,6.18285714 L16.1428571,6.38857143 L18.8971429,9.14285714 L23,9.14285714 L23,11.4285714 L17.96,11.4285714 L16.1428571,9.61142857 L16.1428571,12.5714286 L15,12.5714286 C13.7376349,12.5714286 12.7142857,11.5480794 12.7142857,10.2857143 L12.7142857,7.42857143 L9.12571429,7.42857143 C9.02285714,7.85142857 8.85142857,8.25142857 8.62285714,8.62857143 L15.2057143,20.5714286 L20.7142857,20.5714286 C21.9766509,20.5714286 23,21.5947777 23,22.8571429 L23,24 L0.142857143,24 L0.142857143,22.8571429 C0.142857143,21.5947777 1.16620629,20.5714286 2.42857143,20.5714286 L9.98285714,20.5714286 L4.62285714,10.8571429 C2.56571429,10.8228571 0.782857143,9.41714286 0.268571429,7.42857143 C-0.36,4.98285714 1.11428571,2.49142857 3.57142857,1.86285714 C6.00571429,1.23428571 8.49714286,2.69714286 9.12571429,5.14285714 L12.7142857,5.14285714 L12.7142857,2.28571429 C12.7142857,1.02334914 13.7376349,0 15,0 L16.1428571,0 L16.1428571,2.96 L17.96,1.14285714 L23,1.14285714 L23,3.42857143 L18.8971429,3.42857143 M4.71428571,4 C3.45192057,4 2.42857143,5.02334914 2.42857143,6.28571429 C2.42857143,7.54807943 3.45192057,8.57142857 4.71428571,8.57142857 C5.97665086,8.57142857 7,7.54807943 7,6.28571429 C7,5.02334914 5.97665086,4 4.71428571,4 Z' id='Shape' fill='%237ABD12' fill-rule='nonzero'%3E%3C/path%3E%3C/g%3E%3C/svg%3E";
                    }
                } else if ((obj.data as Activity).Allocation > 95) {
                    // Red
                    statusPanel.style.fill = "#F2B7BF";
                    switch ((obj.data as Activity).NodeType) {
                        case "Manpower":
                            icon.source =
                                "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3C!-- Generator: Sketch 61 (89581) - https://sketch.com --%3E%3Ctitle%3EShape%3C/title%3E%3Cdesc%3ECreated with Sketch.%3C/desc%3E%3Cg id='Projection-Analytics' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3E%3Cpath d='M10.1052632,16.4210526 C4.52210526,16.4210526 0,18.6821053 0,21.4736842 L0,24 L20.2105263,24 L20.2105263,21.4736842 C20.2105263,18.6821053 15.6884211,16.4210526 10.1052632,16.4210526 M5.05263158,8.84210526 C5.05263158,11.6325966 7.31477179,13.8947368 10.1052632,13.8947368 C12.8957545,13.8947368 15.1578947,11.6325966 15.1578947,8.84210526 M9.47368421,0 C9.09473684,0 8.84210526,0.265263158 8.84210526,0.631578947 L8.84210526,4.42105263 L7.57894737,4.42105263 L7.57894737,1.26315789 C7.57894737,1.26315789 4.73684211,2.34947368 4.73684211,6 C4.73684211,6 3.78947368,6.17684211 3.78947368,7.57894737 L16.4210526,7.57894737 C16.3578947,6.17684211 15.4736842,6 15.4736842,6 C15.4736842,2.34947368 12.6315789,1.26315789 12.6315789,1.26315789 L12.6315789,4.42105263 L11.3684211,4.42105263 L11.3684211,0.631578947 C11.3684211,0.265263158 11.1284211,0 10.7368421,0 L9.47368421,0 Z' id='Shape' fill='%23B02032' fill-rule='nonzero'%3E%3C/path%3E%3C/g%3E%3C/svg%3E";
                            break;
                        case "Equipment":
                            icon.source =
                                "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3C!-- Generator: Sketch 61 (89581) - https://sketch.com --%3E%3Ctitle%3EShape%3C/title%3E%3Cdesc%3ECreated with Sketch.%3C/desc%3E%3Cg id='Projection-Analytics' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3E%3Cpath d='M18.8971429,3.42857143 L16.1428571,6.18285714 L16.1428571,6.38857143 L18.8971429,9.14285714 L23,9.14285714 L23,11.4285714 L17.96,11.4285714 L16.1428571,9.61142857 L16.1428571,12.5714286 L15,12.5714286 C13.7376349,12.5714286 12.7142857,11.5480794 12.7142857,10.2857143 L12.7142857,7.42857143 L9.12571429,7.42857143 C9.02285714,7.85142857 8.85142857,8.25142857 8.62285714,8.62857143 L15.2057143,20.5714286 L20.7142857,20.5714286 C21.9766509,20.5714286 23,21.5947777 23,22.8571429 L23,24 L0.142857143,24 L0.142857143,22.8571429 C0.142857143,21.5947777 1.16620629,20.5714286 2.42857143,20.5714286 L9.98285714,20.5714286 L4.62285714,10.8571429 C2.56571429,10.8228571 0.782857143,9.41714286 0.268571429,7.42857143 C-0.36,4.98285714 1.11428571,2.49142857 3.57142857,1.86285714 C6.00571429,1.23428571 8.49714286,2.69714286 9.12571429,5.14285714 L12.7142857,5.14285714 L12.7142857,2.28571429 C12.7142857,1.02334914 13.7376349,0 15,0 L16.1428571,0 L16.1428571,2.96 L17.96,1.14285714 L23,1.14285714 L23,3.42857143 L18.8971429,3.42857143 M4.71428571,4 C3.45192057,4 2.42857143,5.02334914 2.42857143,6.28571429 C2.42857143,7.54807943 3.45192057,8.57142857 4.71428571,8.57142857 C5.97665086,8.57142857 7,7.54807943 7,6.28571429 C7,5.02334914 5.97665086,4 4.71428571,4 Z' id='Shape' fill='%23B02032' fill-rule='nonzero'%3E%3C/path%3E%3C/g%3E%3C/svg%3E";
                            break;
                    }
                } else if (
                    (obj.data as Activity).Allocation >= 80 &&
                    (obj.data as Activity).Allocation < 90
                ) {
                    // Yellow
                    statusPanel.style.fill = "#FCE0A6";
                    switch ((obj.data as Activity).NodeType) {
                        case "Manpower":
                            icon.source =
                                "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3C!-- Generator: Sketch 61 (89581) - https://sketch.com --%3E%3Ctitle%3EShape%3C/title%3E%3Cdesc%3ECreated with Sketch.%3C/desc%3E%3Cg id='Projection-Analytics' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3E%3Cpath d='M10.1052632,16.4210526 C4.52210526,16.4210526 0,18.6821053 0,21.4736842 L0,24 L20.2105263,24 L20.2105263,21.4736842 C20.2105263,18.6821053 15.6884211,16.4210526 10.1052632,16.4210526 M5.05263158,8.84210526 C5.05263158,11.6325966 7.31477179,13.8947368 10.1052632,13.8947368 C12.8957545,13.8947368 15.1578947,11.6325966 15.1578947,8.84210526 M9.47368421,0 C9.09473684,0 8.84210526,0.265263158 8.84210526,0.631578947 L8.84210526,4.42105263 L7.57894737,4.42105263 L7.57894737,1.26315789 C7.57894737,1.26315789 4.73684211,2.34947368 4.73684211,6 C4.73684211,6 3.78947368,6.17684211 3.78947368,7.57894737 L16.4210526,7.57894737 C16.3578947,6.17684211 15.4736842,6 15.4736842,6 C15.4736842,2.34947368 12.6315789,1.26315789 12.6315789,1.26315789 L12.6315789,4.42105263 L11.3684211,4.42105263 L11.3684211,0.631578947 C11.3684211,0.265263158 11.1284211,0 10.7368421,0 L9.47368421,0 Z' id='Shape' fill='%23CD9A32' fill-rule='nonzero'%3E%3C/path%3E%3C/g%3E%3C/svg%3E";
                            break;
                        case "Equipment":
                            icon.source =
                                "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3C!-- Generator: Sketch 61 (89581) - https://sketch.com --%3E%3Ctitle%3EShape%3C/title%3E%3Cdesc%3ECreated with Sketch.%3C/desc%3E%3Cg id='Projection-Analytics' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3E%3Cpath d='M18.8971429,3.42857143 L16.1428571,6.18285714 L16.1428571,6.38857143 L18.8971429,9.14285714 L23,9.14285714 L23,11.4285714 L17.96,11.4285714 L16.1428571,9.61142857 L16.1428571,12.5714286 L15,12.5714286 C13.7376349,12.5714286 12.7142857,11.5480794 12.7142857,10.2857143 L12.7142857,7.42857143 L9.12571429,7.42857143 C9.02285714,7.85142857 8.85142857,8.25142857 8.62285714,8.62857143 L15.2057143,20.5714286 L20.7142857,20.5714286 C21.9766509,20.5714286 23,21.5947777 23,22.8571429 L23,24 L0.142857143,24 L0.142857143,22.8571429 C0.142857143,21.5947777 1.16620629,20.5714286 2.42857143,20.5714286 L9.98285714,20.5714286 L4.62285714,10.8571429 C2.56571429,10.8228571 0.782857143,9.41714286 0.268571429,7.42857143 C-0.36,4.98285714 1.11428571,2.49142857 3.57142857,1.86285714 C6.00571429,1.23428571 8.49714286,2.69714286 9.12571429,5.14285714 L12.7142857,5.14285714 L12.7142857,2.28571429 C12.7142857,1.02334914 13.7376349,0 15,0 L16.1428571,0 L16.1428571,2.96 L17.96,1.14285714 L23,1.14285714 L23,3.42857143 L18.8971429,3.42857143 M4.71428571,4 C3.45192057,4 2.42857143,5.02334914 2.42857143,6.28571429 C2.42857143,7.54807943 3.45192057,8.57142857 4.71428571,8.57142857 C5.97665086,8.57142857 7,7.54807943 7,6.28571429 C7,5.02334914 5.97665086,4 4.71428571,4 Z' id='Shape' fill='%23CD9A32' fill-rule='nonzero'%3E%3C/path%3E%3C/g%3E%3C/svg%3E";
                            break;
                    }
                } else if (
                    (obj.data as Activity).Allocation >= 90 &&
                    (obj.data as Activity).Allocation < 95
                ) {
                    // Orange
                    statusPanel.style.fill = "#FEB59C";
                    switch ((obj.data as Activity).NodeType) {
                        case "Manpower":
                            icon.source =
                                'data:image/svg+xml,%3C%3Fxml version="1.0" encoding="UTF-8"%3F%3E%3Csvg width="21px" height="24px" viewBox="0 0 21 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"%3E%3C!-- Generator: Sketch 61 (89581) - https://sketch.com --%3E%3Ctitle%3EShape%3C/title%3E%3Cdesc%3ECreated with Sketch.%3C/desc%3E%3Cg id="Projection-Analytics" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"%3E%3Cpath d="M10.1052632,16.4210526 C4.52210526,16.4210526 0,18.6821053 0,21.4736842 L0,24 L20.2105263,24 L20.2105263,21.4736842 C20.2105263,18.6821053 15.6884211,16.4210526 10.1052632,16.4210526 M5.05263158,8.84210526 C5.05263158,11.6325966 7.31477179,13.8947368 10.1052632,13.8947368 C12.8957545,13.8947368 15.1578947,11.6325966 15.1578947,8.84210526 M9.47368421,0 C9.09473684,0 8.84210526,0.265263158 8.84210526,0.631578947 L8.84210526,4.42105263 L7.57894737,4.42105263 L7.57894737,1.26315789 C7.57894737,1.26315789 4.73684211,2.34947368 4.73684211,6 C4.73684211,6 3.78947368,6.17684211 3.78947368,7.57894737 L16.4210526,7.57894737 C16.3578947,6.17684211 15.4736842,6 15.4736842,6 C15.4736842,2.34947368 12.6315789,1.26315789 12.6315789,1.26315789 L12.6315789,4.42105263 L11.3684211,4.42105263 L11.3684211,0.631578947 C11.3684211,0.265263158 11.1284211,0 10.7368421,0 L9.47368421,0 Z" id="Shape" fill="%23D04D20" fill-rule="nonzero"%3E%3C/path%3E%3C/g%3E%3C/svg%3E';
                            break;
                        case "Equipment":
                            icon.source =
                                'data:image/svg+xml,%3C%3Fxml version="1.0" encoding="UTF-8"%3F%3E%3Csvg width="23px" height="24px" viewBox="0 0 23 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"%3E%3C!-- Generator: Sketch 61 (89581) - https://sketch.com --%3E%3Ctitle%3EShape%3C/title%3E%3Cdesc%3ECreated with Sketch.%3C/desc%3E%3Cg id="Projection-Analytics" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"%3E%3Cpath d="M18.7734695,3.42857143 L16.0191838,6.18285714 L16.0191838,6.38857143 L18.7734695,9.14285714 L22.8763266,9.14285714 L22.8763266,11.4285714 L17.8363266,11.4285714 L16.0191838,9.61142857 L16.0191838,12.5714286 L14.8763266,12.5714286 C13.6139615,12.5714286 12.5906123,11.5480794 12.5906123,10.2857143 L12.5906123,7.42857143 L9.0020409,7.42857143 C8.89918376,7.85142857 8.72775519,8.25142857 8.49918376,8.62857143 L15.0820409,20.5714286 L20.5906123,20.5714286 C21.8529775,20.5714286 22.8763266,21.5947777 22.8763266,22.8571429 L22.8763266,24 L0.0191837615,24 L0.0191837615,22.8571429 C0.0191837615,21.5947777 1.0425329,20.5714286 2.30489805,20.5714286 L9.85918376,20.5714286 L4.49918376,10.8571429 C2.4420409,10.8228571 0.659183762,9.41714286 0.144898047,7.42857143 C-0.483673381,4.98285714 0.990612333,2.49142857 3.44775519,1.86285714 C5.8820409,1.23428571 8.37346948,2.69714286 9.0020409,5.14285714 L12.5906123,5.14285714 L12.5906123,2.28571429 C12.5906123,1.02334914 13.6139615,0 14.8763266,0 L16.0191838,0 L16.0191838,2.96 L17.8363266,1.14285714 L22.8763266,1.14285714 L22.8763266,3.42857143 L18.7734695,3.42857143 M4.59061233,4 C3.32824719,4 2.30489805,5.02334914 2.30489805,6.28571429 C2.30489805,7.54807943 3.32824719,8.57142857 4.59061233,8.57142857 C5.85297748,8.57142857 6.87632662,7.54807943 6.87632662,6.28571429 C6.87632662,5.02334914 5.85297748,4 4.59061233,4 Z" id="Shape" fill="%23D04D20" fill-rule="nonzero"%3E%3C/path%3E%3C/g%3E%3C/svg%3E';
                            break;
                    }
                }
            }

            // Sets the respective icon for line nodes, without showing the allocation as it doesn't make sense
            if ((obj.data as Activity).NodeType === "Line") {
                speed.style.fontSize = 13;
                detailPanel.children = [speed];
            } else if ((obj.data as Activity).NodeType === "Manpower") {
                // Sets the respective icon for manpower nodes
                detailPanel.children = [speed, allocation];
            } else if ((obj.data as Activity).NodeType === "Equipment") {
                // Sets the respective icon for equipment nodes
                detailPanel.children = [speed, allocation];
            }
            headerPanel.children = [code, description];
            statusPanel.children = [icon];
            contentPanel.children = [headerPanel, detailPanel];
            nodePanel.children = [contentPanel, statusPanel];
            return nodePanel;
        };
        let tasks: object[] = [
            {
                irn: "8e4ce960-cf6a-4fef-ba7c-385cb0e9677f",
                taskNo: "2",
                taskName: "Cuts",
                nodeType: 0,
                speed: 8430.5,
                utilization: 0.0,
                parentList: [],
                nodeTypeLabel: "Line"
            },
            {
                irn: "e6643d41-d5ad-47df-9c0a-d981e457f59e",
                taskNo: "1",
                taskName: "Whole Birds",
                nodeType: 0,
                speed: 20150.5,
                utilization: 0.0,
                parentList: [],
                nodeTypeLabel: "Line"
            },
            {
                irn: "c78a9a91-97fe-463d-9b59-06aab164031c",
                taskNo: "11083",
                taskName: "Gibblet Grading",
                nodeType: 1,
                speed: 0.0,
                utilization: 0.166623,
                parentList: ["54e12ad2-400b-46e7-a019-9768a3555176"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "7b67b28e-1c4c-4e8c-b2cc-07d0d1f4d9ce",
                taskNo: "404",
                taskName: "Crating S/On Single Portion",
                nodeType: 1,
                speed: 5537.490051,
                utilization: 0.169483,
                parentList: ["136cf265-f68e-4be2-9b7f-9dbb10618cd6"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "622bdc5f-26f0-4879-a0e8-0baca1997ad5",
                taskNo: "11252",
                taskName: "FR WB Alyoum Crating",
                nodeType: 1,
                speed: 0.0,
                utilization: 0.0,
                parentList: ["491a5dbf-1f22-4a2a-a344-699e2cfd2de8"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "1c61b41d-4740-4d0f-b6cb-0decbab6d12f",
                taskNo: "10980",
                taskName: "Product Packing S/Less",
                nodeType: 1,
                speed: 780.951085,
                utilization: 0.058495,
                parentList: ["390ec5c1-0a27-41d5-9793-8c4764c5b632"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "b6abff5f-36a1-4d0d-a753-0e7afe8f4883",
                taskNo: "401",
                taskName: "Product Packing and weighing",
                nodeType: 1,
                speed: 100.0,
                utilization: 0.825954,
                parentList: [
                    "ab4ea3a6-59aa-4e73-891c-cf5f2520e6f8",
                    "08032b36-661c-49e0-a5c2-6ce9e4bd2447"
                ],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "80c2bcde-4c29-47ca-aa54-1232745108aa",
                taskNo: "11091",
                taskName: "Crating",
                nodeType: 1,
                speed: 0.0,
                utilization: 0.499871,
                parentList: ["197f3eec-570c-4b8a-b2d1-165801939445"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "7d78088f-a28a-4924-859d-14e443c53573",
                taskNo: "490",
                taskName: "Boxing",
                nodeType: 1,
                speed: 999.0,
                utilization: 0.490958,
                parentList: [
                    "6a9aee3c-74aa-4937-8918-dbe552cfb45c",
                    "2298cca0-fa28-40a7-8ade-d23ae8a5b1eb"
                ],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "197f3eec-570c-4b8a-b2d1-165801939445",
                taskNo: "11089",
                taskName: "QX1100",
                nodeType: 2,
                speed: 0.0,
                utilization: 0.999743,
                parentList: ["8b246bc8-58b3-4a7b-ba05-dc2a7e63e7bf"],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "fde30b7e-ff93-439e-afe7-1b331461d3b9",
                taskNo: "11247",
                taskName: "Manual Packing WB Alyoum 750g",
                nodeType: 1,
                speed: 0.0,
                utilization: 0.0,
                parentList: ["06f699bf-8363-4244-91a8-6ae1b47e9b92"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "8ee5a9fb-1e2c-4bf0-b937-1d4bf7c08cb0",
                taskNo: "515",
                taskName: "MOBA  1 - 15",
                nodeType: 2,
                speed: 600.0,
                utilization: 0.511791,
                parentList: ["3f1af140-7240-4c7f-8040-42fa28234947"],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "3884a007-362f-4a4e-b314-204dac85916e",
                taskNo: "10904",
                taskName: "Product Loading  AA SP",
                nodeType: 1,
                speed: 2519.999999,
                utilization: 0.442792,
                parentList: ["3f1af140-7240-4c7f-8040-42fa28234947"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "b7195cd8-eb3d-400b-bd84-21d77b02e391",
                taskNo: "466",
                taskName: "Cuts - Breast Fillet Deboning L",
                nodeType: 1,
                speed: 15000.0,
                utilization: 0.499784,
                parentList: ["8e4ce960-cf6a-4fef-ba7c-385cb0e9677f"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "81da0030-1cea-46d8-9b04-28b97b4b2394",
                taskNo: "482",
                taskName: "Crating WIP for VA",
                nodeType: 1,
                speed: 15000.0,
                utilization: 0.269034,
                parentList: ["4b2602f0-8637-4c27-8f4b-8c8e9ac9e75d"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "5b695c07-fb80-44dc-b405-28d97f9fa986",
                taskNo: "353",
                taskName: "Whole Birds - Single A",
                nodeType: 1,
                speed: 22500.0,
                utilization: 0.209833,
                parentList: ["e6643d41-d5ad-47df-9c0a-d981e457f59e"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "ccdeca52-a784-4424-a06f-2a8c834a5750",
                taskNo: "11159",
                taskName: "Manual Vaccum Sealer",
                nodeType: 2,
                speed: 924.082492,
                utilization: 0.998602,
                parentList: [
                    "c12066ab-7abd-4871-837b-c3d71553be6a",
                    "98522370-88cb-4bde-85ae-543821c94f3b",
                    "2c53ed6a-62ae-4819-aaec-b40826083832"
                ],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "532ca0c8-440b-47f8-afef-2c5d6d464e0e",
                taskNo: "10553",
                taskName: "Multi Head - IQF",
                nodeType: 2,
                speed: 9260.813869,
                utilization: 0.052961,
                parentList: [
                    "c263b629-1c5e-4b1b-b692-792ace72a387",
                    "5f8ee78d-c0c6-4a5c-8aab-bea90d85960d"
                ],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "7691ddd7-a2c4-4b98-b301-30ab8385749a",
                taskNo: "10965",
                taskName: "Manual Grading - Thigh",
                nodeType: 1,
                speed: 15000.0,
                utilization: 0.076969,
                parentList: ["8e95534d-7408-4310-9a01-a33d5c474408"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "a2cd6151-92a9-49f5-9c91-32bbb6d2d042",
                taskNo: "460",
                taskName: "Product Packing",
                nodeType: 1,
                speed: 407.680654,
                utilization: 0.638183,
                parentList: ["ab4ea3a6-59aa-4e73-891c-cf5f2520e6f8"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "bffd3c93-de71-4c0c-89c0-35db8b42bdd2",
                taskNo: "363",
                taskName: "CSB Palletizing Area 15A",
                nodeType: 2,
                speed: 2700.0,
                utilization: 0.40427,
                parentList: ["04da64dc-aa5b-42b2-8757-9d3ae9f3e6a6"],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "3f1af140-7240-4c7f-8040-42fa28234947",
                taskNo: "348",
                taskName: "M5000",
                nodeType: 2,
                speed: 22500.0,
                utilization: 0.298525,
                parentList: [
                    "966bcb93-9d2e-4483-9337-5c63f60a30f2",
                    "5b695c07-fb80-44dc-b405-28d97f9fa986",
                    "03b0d211-463f-4ed5-9207-b8b8058d9699",
                    "0ad3ec9e-ff6c-410b-8416-471b6852f240"
                ],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "72fe8923-8fda-462c-b6dc-43f69e243924",
                taskNo: "10906",
                taskName: "Product Arranging Padding AA SP",
                nodeType: 1,
                speed: 2519.999999,
                utilization: 0.442792,
                parentList: ["3884a007-362f-4a4e-b314-204dac85916e"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "1ad3f175-b396-4e97-9d21-4611d722ad85",
                taskNo: "392",
                taskName: "Crating VA",
                nodeType: 1,
                speed: 22500.000004,
                utilization: 0.00737,
                parentList: ["b4e9a25b-133f-4798-ba2f-933067ea57d9"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "0ad3ec9e-ff6c-410b-8416-471b6852f240",
                taskNo: "346",
                taskName: "Double A Tray Pack",
                nodeType: 1,
                speed: 22500.0,
                utilization: 0.0,
                parentList: ["e6643d41-d5ad-47df-9c0a-d981e457f59e"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "49c54dd2-aef1-4723-94ce-47961e117606",
                taskNo: "10590",
                taskName: "Drop Off - IQF",
                nodeType: 2,
                speed: 15000.000003,
                utilization: 0.02761,
                parentList: ["7cc43ee2-d2c2-4015-8b9a-840c3e0e7e3d"],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "fa2981c2-3009-4e35-9bb8-4ca7306bf486",
                taskNo: "470",
                taskName: "Product Packing - Breast/Thigh Fillet",
                nodeType: 1,
                speed: 606.2894,
                utilization: 0.309125,
                parentList: ["ab4ea3a6-59aa-4e73-891c-cf5f2520e6f8"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "2e5c5191-24ee-4758-9948-51083c6e5f52",
                taskNo: "11234",
                taskName: "Nandos WB Manual Dipping & Packing",
                nodeType: 1,
                speed: 960.0,
                utilization: 0.062239,
                parentList: ["17e11ab3-1c66-4167-bb0b-f731d9984451"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "02b54228-279d-4ed3-a8d6-52474508f569",
                taskNo: "10603",
                taskName: "CARTON FREEZER",
                nodeType: 2,
                speed: 107.956904,
                utilization: 0.534097,
                parentList: [
                    "e3b8b9d2-c03b-4961-b6e0-850ef8276821",
                    "ccdeca52-a784-4424-a06f-2a8c834a5750"
                ],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "98522370-88cb-4bde-85ae-543821c94f3b",
                taskNo: "11227",
                taskName: "Manual packing-Liver Nandos",
                nodeType: 1,
                speed: 0.0,
                utilization: 0.0,
                parentList: ["4debbec0-0921-4c00-80c5-c2255db8c7b3"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "0e0d1b0c-7710-4c3a-bd5b-546434f29859",
                taskNo: "377",
                taskName: "Shrink Pack Machine AA",
                nodeType: 2,
                speed: 2519.999999,
                utilization: 0.442792,
                parentList: ["72fe8923-8fda-462c-b6dc-43f69e243924"],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "751698c1-8de2-439b-86d5-598a10fd8d18",
                taskNo: "10538",
                taskName: "CSB Product Registration Area 01",
                nodeType: 2,
                speed: 22500.0,
                utilization: 0.053998,
                parentList: ["3e34d192-b752-4903-854f-c5cc6ac6ffd5"],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "601a3cde-fbcc-4e73-9be5-5c61112f1511",
                taskNo: "10566",
                taskName: "Sealing - QX1100 Thigh/Breast Fillet",
                nodeType: 2,
                speed: 4275.076454,
                utilization: 0.468747,
                parentList: [
                    "a2cd6151-92a9-49f5-9c91-32bbb6d2d042",
                    "fa2981c2-3009-4e35-9bb8-4ca7306bf486"
                ],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "966bcb93-9d2e-4483-9337-5c63f60a30f2",
                taskNo: "373",
                taskName: "Whole Birds - Double A Shrink",
                nodeType: 1,
                speed: 22500.0,
                utilization: 0.495927,
                parentList: ["e6643d41-d5ad-47df-9c0a-d981e457f59e"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "5bc92984-ded0-4958-89d9-5ee809c9cb65",
                taskNo: "11069",
                taskName: "Product Weighing",
                nodeType: 1,
                speed: 1568.761031,
                utilization: 0.065976,
                parentList: ["bb0ffd3f-33e4-4040-97a4-ae3835cb42fa"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "b99ca1d9-da04-413c-946f-600b73bf4b8d",
                taskNo: "10968",
                taskName: "Product Packing S/On",
                nodeType: 1,
                speed: 567.126443,
                utilization: 0.330755,
                parentList: ["08032b36-661c-49e0-a5c2-6ce9e4bd2447"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "0e83c96a-d77f-4c6a-bfdd-60217eeee868",
                taskNo: "11054",
                taskName: "Shrink Wrapping - IQF",
                nodeType: 1,
                speed: 1826.999999,
                utilization: 0.056671,
                parentList: ["c87ea422-8c07-42c4-986f-e9db3207f084"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "5d243c71-ed42-4842-b58a-60f7a82bced0",
                taskNo: "11137",
                taskName: "Product CSB Registr Area 07",
                nodeType: 2,
                speed: 11400.239657,
                utilization: 0.087889,
                parentList: ["a4e9abe1-203a-4f93-8361-ac84ed780176"],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "c855d8d4-3848-4f3d-8947-616a9ec8dbc1",
                taskNo: "456",
                taskName: "Cuts - Drumstick Line",
                nodeType: 1,
                speed: 15000.0,
                utilization: 0.362909,
                parentList: ["8e4ce960-cf6a-4fef-ba7c-385cb0e9677f"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "491a5dbf-1f22-4a2a-a344-699e2cfd2de8",
                taskNo: "11236",
                taskName: "Manual Vacuum Sealing",
                nodeType: 2,
                speed: 240.0,
                utilization: 0.497916,
                parentList: [
                    "fde30b7e-ff93-439e-afe7-1b331461d3b9",
                    "2e5c5191-24ee-4758-9948-51083c6e5f52"
                ],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "2b5500e3-c270-4bdf-a862-69c05d9469b0",
                taskNo: "367",
                taskName: "Carton Freezer",
                nodeType: 2,
                speed: 4620.0,
                utilization: 0.051948,
                parentList: [
                    "ac8da9bd-3f1c-4cf4-8cc0-8c70712f608d",
                    "79ec6d37-e516-46bb-ab76-eff3e171d468"
                ],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "06f699bf-8363-4244-91a8-6ae1b47e9b92",
                taskNo: "384",
                taskName: "TUMBLER",
                nodeType: 2,
                speed: 1200.0,
                utilization: 0.207291,
                parentList: ["17e11ab3-1c66-4167-bb0b-f731d9984451"],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "09cd3402-b762-4d23-9767-6b06781d1b84",
                taskNo: "11242",
                taskName: "Nandos WB FZ Boxing",
                nodeType: 1,
                speed: 0.0,
                utilization: 0.0,
                parentList: ["491a5dbf-1f22-4a2a-a344-699e2cfd2de8"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "ec44a155-106a-44bd-8b4f-6cd2524be700",
                taskNo: "349",
                taskName: "AUTOMAC 1-3",
                nodeType: 2,
                speed: 1800.0,
                utilization: 0.676643,
                parentList: ["3f1af140-7240-4c7f-8040-42fa28234947"],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "08032b36-661c-49e0-a5c2-6ce9e4bd2447",
                taskNo: "10935",
                taskName: "Multi Head - Portions",
                nodeType: 2,
                speed: 6952.552502,
                utilization: 0.269976,
                parentList: [
                    "fd795140-58db-43b1-9624-a95af3d82248",
                    "75bfea49-ab2e-4a52-90d7-816b4eec3927",
                    "cdce8c53-5406-4fa5-aca9-efd47a1019c1",
                    "7691ddd7-a2c4-4b98-b301-30ab8385749a",
                    "3b686776-d0f5-4892-9ea1-dbfa9d34ce8b"
                ],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "fe2f4b70-20dd-4205-a06c-782dbae3048d",
                taskNo: "10943",
                taskName: "CSB",
                nodeType: 2,
                speed: 15000.000001,
                utilization: 0.027531,
                parentList: ["7b67b28e-1c4c-4e8c-b2cc-07d0d1f4d9ce"],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "c263b629-1c5e-4b1b-b692-792ace72a387",
                taskNo: "10930",
                taskName: "Wings Drop",
                nodeType: 2,
                speed: 15000.0,
                utilization: 0.060151,
                parentList: ["8eef9692-c954-4641-abbf-eac871b79c76"],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "2fb67cf5-c301-48d0-968a-797352f4854a",
                taskNo: "442",
                taskName: "Cuts - Whole Legs Line Selection",
                nodeType: 1,
                speed: 15000.0,
                utilization: 0.057612,
                parentList: ["8e4ce960-cf6a-4fef-ba7c-385cb0e9677f"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "60f58f04-7434-4a97-871b-7b1dba222ab9",
                taskNo: "436",
                taskName: "Manual grading - Drumstick",
                nodeType: 1,
                speed: 15000.000002,
                utilization: 0.0055,
                parentList: ["00064d72-52fa-4342-8bac-b0fb2f8b0eea"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "75bfea49-ab2e-4a52-90d7-816b4eec3927",
                taskNo: "444",
                taskName: "Manual grading - Whole Leg",
                nodeType: 1,
                speed: 15000.0,
                utilization: 0.028806,
                parentList: ["fce92890-c23b-445e-bb8e-c979f6c2f8bc"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "c304d260-1f80-493c-8d30-8331e6927058",
                taskNo: "11027",
                taskName: "Rapid Machine",
                nodeType: 2,
                speed: 7020.0,
                utilization: 0.266978,
                parentList: ["c14b50f9-e166-43f9-8d8f-cd58d0c45a39"],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "7cc43ee2-d2c2-4015-8b9a-840c3e0e7e3d",
                taskNo: "485",
                taskName: "Cuts - IQF Line",
                nodeType: 1,
                speed: 15000.000003,
                utilization: 0.02761,
                parentList: ["8e4ce960-cf6a-4fef-ba7c-385cb0e9677f"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "e3b8b9d2-c03b-4961-b6e0-850ef8276821",
                taskNo: "11222",
                taskName: "Nandos liver boxing",
                nodeType: 1,
                speed: 0.0,
                utilization: 0.0,
                parentList: ["ccdeca52-a784-4424-a06f-2a8c834a5750"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "310156cd-5925-46d8-b581-87d24c368ed9",
                taskNo: "10559",
                taskName: "CSB Product Registration Area 12",
                nodeType: 2,
                speed: 15000.0,
                utilization: 0.004568,
                parentList: ["1477367a-81b1-4c8d-bb37-eba391ac9941"],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "390ec5c1-0a27-41d5-9793-8c4764c5b632",
                taskNo: "10580",
                taskName: "Product Weighing S/Less",
                nodeType: 1,
                speed: 7028.559773,
                utilization: 0.058495,
                parentList: [
                    "7691ddd7-a2c4-4b98-b301-30ab8385749a",
                    "60f58f04-7434-4a97-871b-7b1dba222ab9"
                ],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "ac8da9bd-3f1c-4cf4-8cc0-8c70712f608d",
                taskNo: "366",
                taskName: "Boxing Single A",
                nodeType: 1,
                speed: 600.0,
                utilization: 0.026666,
                parentList: ["8ee5a9fb-1e2c-4bf0-b937-1d4bf7c08cb0"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "4b2602f0-8637-4c27-8f4b-8c8e9ac9e75d",
                taskNo: "10597",
                taskName: "VA Drop",
                nodeType: 2,
                speed: 15000.0,
                utilization: 0.134517,
                parentList: ["ca075b32-38cf-4d40-99d1-f8ad478f81dc"],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "f6231156-a0ba-44da-b534-8f46333c3a27",
                taskNo: "11078",
                taskName: "Product CS Registration - 4800",
                nodeType: 1,
                speed: 4800.0,
                utilization: 0.097046,
                parentList: ["f1cf478b-d31f-463b-9733-b1bbd600b8b0"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "9871b81b-d862-4d09-bed2-928882e076ac",
                taskNo: "10543",
                taskName: "CSB Product Registration Area 12",
                nodeType: 2,
                speed: 4800.0,
                utilization: 0.004149,
                parentList: ["6ec732de-882d-45d3-9cb5-fa392c65c5fd"],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "b4e9a25b-133f-4798-ba2f-933067ea57d9",
                taskNo: "389",
                taskName: "CFS",
                nodeType: 2,
                speed: 1800.0,
                utilization: 0.092129,
                parentList: ["7029bdd6-2071-42de-9faf-a28a88f4d5f3"],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "54e12ad2-400b-46e7-a019-9768a3555176",
                taskNo: "11081",
                taskName: "Giblets Line",
                nodeType: 1,
                speed: 0.0,
                utilization: 0.0,
                parentList: ["8e4ce960-cf6a-4fef-ba7c-385cb0e9677f"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "cdf81ed4-7d4a-4c8f-929a-9ba2dd0c5981",
                taskNo: "10572",
                taskName: "Thigh De-boner 1-4",
                nodeType: 2,
                speed: 14671.854782,
                utilization: 0.177329,
                parentList: ["4858eb7a-b048-4f43-ac57-f38760ac7c5c"],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "04da64dc-aa5b-42b2-8757-9d3ae9f3e6a6",
                taskNo: "361",
                taskName: "Crating Single A",
                nodeType: 1,
                speed: 600.0,
                utilization: 0.485124,
                parentList: ["8ee5a9fb-1e2c-4bf0-b937-1d4bf7c08cb0"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "136cf265-f68e-4be2-9b7f-9dbb10618cd6",
                taskNo: "10939",
                taskName: "QX1100 - Single Portion",
                nodeType: 2,
                speed: 6434.082184,
                utilization: 0.38891,
                parentList: [
                    "b99ca1d9-da04-413c-946f-600b73bf4b8d",
                    "b6abff5f-36a1-4d0d-a753-0e7afe8f4883"
                ],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "1f9180d5-07bf-4e40-a1c4-9e4e7b115873",
                taskNo: "10564",
                taskName: "CSB Product Registration Area 01",
                nodeType: 2,
                speed: 0.0,
                utilization: 0.0,
                parentList: ["fe95db65-1b3a-4e66-a1ff-b147683fb56c"],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "997c8e2f-f8da-4f6b-b07b-a26bb06d590e",
                taskNo: "10598",
                taskName: "CFS S/Less Single Portion",
                nodeType: 2,
                speed: 7028.559773,
                utilization: 0.019498,
                parentList: ["1c61b41d-4740-4d0f-b6cb-0decbab6d12f"],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "7029bdd6-2071-42de-9faf-a28a88f4d5f3",
                taskNo: "388",
                taskName: "Product Packing",
                nodeType: 1,
                speed: 1800.0,
                utilization: 0.030709,
                parentList: ["06f699bf-8363-4244-91a8-6ae1b47e9b92"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "9092f044-24b3-4dc4-9f03-a32d9f55c0c4",
                taskNo: "10602",
                taskName: "CSB Palletizing Area 15 - Frozen",
                nodeType: 2,
                speed: 107.956904,
                utilization: 0.534097,
                parentList: ["02b54228-279d-4ed3-a8d6-52474508f569"],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "8e95534d-7408-4310-9a01-a33d5c474408",
                taskNo: "10958",
                taskName: "Thighs Drop",
                nodeType: 2,
                speed: 15000.0,
                utilization: 0.076969,
                parentList: ["ca075b32-38cf-4d40-99d1-f8ad478f81dc"],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "43cd2d28-8be9-4309-b30f-a45f7262295d",
                taskNo: "11093",
                taskName: "Product CSB Registration",
                nodeType: 1,
                speed: 0.0,
                utilization: 0.499871,
                parentList: ["80c2bcde-4c29-47ca-aa54-1232745108aa"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "fd795140-58db-43b1-9624-a95af3d82248",
                taskNo: "11016",
                taskName: "Drumstick Manual Grading - 1800",
                nodeType: 1,
                speed: 15000.0,
                utilization: 0.181454,
                parentList: ["00064d72-52fa-4342-8bac-b0fb2f8b0eea"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "a4e9abe1-203a-4f93-8361-ac84ed780176",
                taskNo: "472",
                taskName: "Crating - Area 07",
                nodeType: 1,
                speed: 4275.076454,
                utilization: 0.234373,
                parentList: ["601a3cde-fbcc-4e73-9be5-5c61112f1511"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "391324f2-7c7f-4050-9b24-ad0f0f01d568",
                taskNo: "394",
                taskName: "Product CSB Registration Area 12",
                nodeType: 1,
                speed: 1600.0,
                utilization: 0.103645,
                parentList: ["1ad3f175-b396-4e97-9d21-4611d722ad85"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "bb0ffd3f-33e4-4040-97a4-ae3835cb42fa",
                taskNo: "10600",
                taskName: "Tumbler - VA - Tumbler - VA",
                nodeType: 2,
                speed: 1964.480548,
                utilization: 0.234869,
                parentList: ["4debbec0-0921-4c00-80c5-c2255db8c7b3"],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "00064d72-52fa-4342-8bac-b0fb2f8b0eea",
                taskNo: "10962",
                taskName: "Drumstick Drop",
                nodeType: 2,
                speed: 15000.0,
                utilization: 0.373911,
                parentList: [
                    "c855d8d4-3848-4f3d-8947-616a9ec8dbc1",
                    "ca075b32-38cf-4d40-99d1-f8ad478f81dc"
                ],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "fe95db65-1b3a-4e66-a1ff-b147683fb56c",
                taskNo: "503",
                taskName: "Crating",
                nodeType: 1,
                speed: 0.0,
                utilization: 0.0,
                parentList: ["ccdeca52-a784-4424-a06f-2a8c834a5750"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "f1cf478b-d31f-463b-9733-b1bbd600b8b0",
                taskNo: "11076",
                taskName: "Crating - 1800",
                nodeType: 1,
                speed: 999.0,
                utilization: 0.466288,
                parentList: ["ccdeca52-a784-4424-a06f-2a8c834a5750"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "2c53ed6a-62ae-4819-aaec-b40826083832",
                taskNo: "11192",
                taskName: "Manual Packing",
                nodeType: 1,
                speed: 1976.896548,
                utilization: 0.004861,
                parentList: ["bb0ffd3f-33e4-4040-97a4-ae3835cb42fa"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "e1f652bd-9849-403a-aa8a-b5caee9f2068",
                taskNo: "10911",
                taskName: "Crating AA SP",
                nodeType: 1,
                speed: 2519.999999,
                utilization: 0.442792,
                parentList: ["0e0d1b0c-7710-4c3a-bd5b-546434f29859"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "03b0d211-463f-4ed5-9207-b8b8058d9699",
                taskNo: "381",
                taskName: "Whole Birds - Value Added Area",
                nodeType: 1,
                speed: 22500.000007,
                utilization: 0.027422,
                parentList: ["e6643d41-d5ad-47df-9c0a-d981e457f59e"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "b2020949-aab9-455a-8936-b9bce854fe2d",
                taskNo: "369",
                taskName: "CSB Palletizing Area 15B",
                nodeType: 2,
                speed: 2700.0,
                utilization: 0.022222,
                parentList: [
                    "09cd3402-b762-4d23-9767-6b06781d1b84",
                    "2b5500e3-c270-4bdf-a862-69c05d9469b0"
                ],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "5f8ee78d-c0c6-4a5c-8aab-bea90d85960d",
                taskNo: "10592",
                taskName: "Spiral Freezer",
                nodeType: 2,
                speed: 8656.124102,
                utilization: 0.047845,
                parentList: ["49c54dd2-aef1-4723-94ce-47961e117606"],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "908d1fd0-e4bf-4328-b5fe-c21edd11d658",
                taskNo: "351",
                taskName: "Prod Label Appl AA Tray Pack",
                nodeType: 1,
                speed: 1800.0,
                utilization: 0.674976,
                parentList: ["ec44a155-106a-44bd-8b4f-6cd2524be700"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "4debbec0-0921-4c00-80c5-c2255db8c7b3",
                taskNo: "11225",
                taskName: "VA raw materials",
                nodeType: 1,
                speed: 1635.226591,
                utilization: 0.569733,
                parentList: ["8e4ce960-cf6a-4fef-ba7c-385cb0e9677f"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "c12066ab-7abd-4871-837b-c3d71553be6a",
                taskNo: "11071",
                taskName: "Product Packing 1800",
                nodeType: 1,
                speed: 1568.761031,
                utilization: 0.065976,
                parentList: ["5bc92984-ded0-4958-89d9-5ee809c9cb65"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "3e34d192-b752-4903-854f-c5cc6ac6ffd5",
                taskNo: "352",
                taskName: "Crating Tray Pack",
                nodeType: 1,
                speed: 1800.0,
                utilization: 0.674976,
                parentList: ["908d1fd0-e4bf-4328-b5fe-c21edd11d658"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "e0861de7-17e2-4bba-a89b-c6fb9918524f",
                taskNo: "467",
                taskName: "Thigh De-Skinning",
                nodeType: 1,
                speed: 14671.854782,
                utilization: 0.177329,
                parentList: ["f696f178-97c0-4779-a0c8-e7fd7acb8b24"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "fce92890-c23b-445e-bb8e-c979f6c2f8bc",
                taskNo: "10575",
                taskName: "Whole Leg Drop S/On",
                nodeType: 2,
                speed: 15000.0,
                utilization: 0.019204,
                parentList: ["2fb67cf5-c301-48d0-968a-797352f4854a"],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "c14b50f9-e166-43f9-8d8f-cd58d0c45a39",
                taskNo: "10574",
                taskName: "Breast Skinner",
                nodeType: 2,
                speed: 7020.0,
                utilization: 0.266978,
                parentList: ["b7195cd8-eb3d-400b-bd84-21d77b02e391"],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "ab4ea3a6-59aa-4e73-891c-cf5f2520e6f8",
                taskNo: "10557",
                taskName: "Multi Head - Fillet",
                nodeType: 2,
                speed: 7020.0,
                utilization: 0.28553,
                parentList: [
                    "c304d260-1f80-493c-8d30-8331e6927058",
                    "cdf81ed4-7d4a-4c8f-929a-9ba2dd0c5981"
                ],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "2298cca0-fa28-40a7-8ade-d23ae8a5b1eb",
                taskNo: "11191",
                taskName: "Manual Vacuum Sealing",
                nodeType: 1,
                speed: 0.0,
                utilization: 0.0,
                parentList: ["b6abff5f-36a1-4d0d-a753-0e7afe8f4883"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "6a9aee3c-74aa-4937-8918-dbe552cfb45c",
                taskNo: "10591",
                taskName: "Form Fill Machine - IQF",
                nodeType: 2,
                speed: 9260.813929,
                utilization: 0.052961,
                parentList: ["532ca0c8-440b-47f8-afef-2c5d6d464e0e"],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "3b686776-d0f5-4892-9ea1-dbfa9d34ce8b",
                taskNo: "398",
                taskName: "Manual Product grading - Wings",
                nodeType: 1,
                speed: 15000.000001,
                utilization: 0.027531,
                parentList: ["c263b629-1c5e-4b1b-b692-792ace72a387"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "8b246bc8-58b3-4a7b-ba05-dc2a7e63e7bf",
                taskNo: "11087",
                taskName: "Multi Head - Gibblets",
                nodeType: 2,
                speed: 0.0,
                utilization: 0.999743,
                parentList: ["c78a9a91-97fe-463d-9b59-06aab164031c"],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "f696f178-97c0-4779-a0c8-e7fd7acb8b24",
                taskNo: "475",
                taskName: "Cuts - Thigh Deboni Line",
                nodeType: 1,
                speed: 15000.0,
                utilization: 0.173449,
                parentList: ["8e4ce960-cf6a-4fef-ba7c-385cb0e9677f"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "c87ea422-8c07-42c4-986f-e9db3207f084",
                taskNo: "10558",
                taskName: "CSB Product Registration Area 14",
                nodeType: 2,
                speed: 11383.916461,
                utilization: 0.043084,
                parentList: ["7d78088f-a28a-4924-859d-14e443c53573"],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "8eef9692-c954-4641-abbf-eac871b79c76",
                taskNo: "395",
                taskName: "Cuts - Wing Line",
                nodeType: 1,
                speed: 15000.0,
                utilization: 0.030075,
                parentList: ["8e4ce960-cf6a-4fef-ba7c-385cb0e9677f"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "1477367a-81b1-4c8d-bb37-eba391ac9941",
                taskNo: "454",
                taskName: "Crating Area 12",
                nodeType: 1,
                speed: 7028.566801,
                utilization: 0.009749,
                parentList: ["997c8e2f-f8da-4f6b-b07b-a26bb06d590e"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "195cc3e9-ac68-47c0-867a-eeaa52d03db5",
                taskNo: "380",
                taskName: "Product CSB Registration Area 01",
                nodeType: 1,
                speed: 2400.0,
                utilization: 0.464932,
                parentList: ["e1f652bd-9849-403a-aa8a-b5caee9f2068"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "cdce8c53-5406-4fa5-aca9-efd47a1019c1",
                taskNo: "450",
                taskName: "Cuts - Mix Parts Line'",
                nodeType: 1,
                speed: 15000.0,
                utilization: 0.02962,
                parentList: ["8e4ce960-cf6a-4fef-ba7c-385cb0e9677f"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "79ec6d37-e516-46bb-ab76-eff3e171d468",
                taskNo: "371",
                taskName: "Boxing WB Bulk Frozen",
                nodeType: 1,
                speed: 0.0,
                utilization: 0.0,
                parentList: ["3f1af140-7240-4c7f-8040-42fa28234947"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "de6d525d-de56-4f6e-a56a-f0a1333ff844",
                taskNo: "11134",
                taskName: "Product CSB Registration Area 06",
                nodeType: 2,
                speed: 12011.525179,
                utilization: 0.104111,
                parentList: ["7b67b28e-1c4c-4e8c-b2cc-07d0d1f4d9ce"],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "4858eb7a-b048-4f43-ac57-f38760ac7c5c",
                taskNo: "11037",
                taskName: "Oysther Thigh Loading - 7020",
                nodeType: 1,
                speed: 7020.0,
                utilization: 0.370619,
                parentList: ["e0861de7-17e2-4bba-a89b-c6fb9918524f"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "17e11ab3-1c66-4167-bb0b-f731d9984451",
                taskNo: "385",
                taskName: "Injector VA",
                nodeType: 2,
                speed: 1200.0,
                utilization: 0.257083,
                parentList: ["3f1af140-7240-4c7f-8040-42fa28234947"],
                nodeTypeLabel: "Machinery"
            },
            {
                irn: "ca075b32-38cf-4d40-99d1-f8ad478f81dc",
                taskNo: "416",
                taskName: "Cuts - Thigh Line",
                nodeType: 1,
                speed: 15000.0,
                utilization: 0.538068,
                parentList: ["8e4ce960-cf6a-4fef-ba7c-385cb0e9677f"],
                nodeTypeLabel: "Manpower"
            },
            {
                irn: "6ec732de-882d-45d3-9cb5-fa392c65c5fd",
                taskNo: "11239",
                taskName: "Nandos WB FR Crating",
                nodeType: 1,
                speed: 600.0,
                utilization: 0.199166,
                parentList: ["491a5dbf-1f22-4a2a-a344-699e2cfd2de8"],
                nodeTypeLabel: "Manpower"
            }
        ];
        const data = tasks.map(t => ({
            Id: (t as any).irn,
            ParentList:
                (t as any).parentList && (t as any).parentList.length > 0 ? (t as any).parentList : undefined,
            Code: (t as any).taskNo,
            Description: (t as any).taskName,
            NodeType: (t as any).nodeTypeLabel,
            Speed: (t as any).speed,
            SpeedLabel: (t as any).speed,
            Utilization: (t as any).utilization * 100,
            UtilizationLabel: (t as any).utilization
        }));


        beforeAll(() => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            diagram = new Diagram({
                width: "100%", height: 1000,
                backgroundColor: 'black',
                setNodeTemplate: function (node: any) {
                    return getNodeTemplate(node);
                },
                layout: {
                    type: "ComplexHierarchicalTree",
                    horizontalSpacing: 32,
                    verticalSpacing: 32,
                    orientation: "LeftToRight",
                    margin: { left: 48, right: 48, top: 48, bottom: 48 },
                    enableAnimation: true
                },
                dataSourceSettings: {
                    id: "Id",
                    parentId: "ParentList", dataSource: new DataManager(data),
                    doBinding: (nodeModel: any, data: any, diagram: any) => {
                        //nodeModel.id = data.Code
                        //nodeModel.shape = { type: 'Text', content: (data a).Name };
                    },
                },
                //nodete

                getNodeDefaults: (obj: NodeModel, diagram: Diagram) => {
                    obj.shape = { type: "Basic", shape: "Rectangle" };

                    obj.expandIcon.height = 10;
                    obj.expandIcon.width = 10;
                    obj.expandIcon.shape = "Minus";
                    obj.expandIcon.fill = "#fff";
                    obj.expandIcon.offset = { x: 0.5, y: 1 };
                    obj.expandIcon.verticalAlignment = "Auto";
                    obj.expandIcon.margin = { left: 0, right: 0, top: 0, bottom: 0 };
                    obj.expandIcon.borderColor = "#ABB8E7";
                    obj.expandIcon.cornerRadius = 1;

                    obj.collapseIcon.height = 10;
                    obj.collapseIcon.width = 10;
                    obj.collapseIcon.shape = "Plus";
                    obj.collapseIcon.fill = "#fff";
                    obj.collapseIcon.offset = { x: 0.5, y: 1 };
                    obj.collapseIcon.verticalAlignment = "Auto";
                    obj.collapseIcon.margin = { left: 0, right: 0, top: 0, bottom: 0 };
                    obj.collapseIcon.borderColor = "#ABB8E7";
                    obj.collapseIcon.cornerRadius = 1;

                    return obj;
                }, getConnectorDefaults: (connector: ConnectorModel, diagram: Diagram) => {
                    connector.type = "Orthogonal";
                    connector.cornerRadius = 7;
                    connector.targetDecorator.height = 5;
                    connector.targetDecorator.width = 3;
                    connector.targetDecorator.style.fill = "#ABB8E7";
                    connector.targetDecorator.style.strokeColor = "#ABB8E7";
                    connector.style.strokeColor = "#ABB8E7";
                    return connector;
                },
            });
            diagram.appendTo('#diagram');
        });
        afterAll(() => {
            diagram.destroy();
            ele.remove();
        });

        it('nodes overlap issue', (done: Function) => {
            expect(Math.round(diagram.nodes[76].offsetY) === 63 && Math.round(diagram.nodes[76].offsetX) === 1286 && Math.round(diagram.nodes[60].offsetX) === 830
                && Math.round(diagram.nodes[60].offsetY) === -652).toBe(true);

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

});


let data1: object[] = [
    {
        "Name": "Diagram",
        "fillColor": "#916DAF"
    },
    {
        "Name": "Layout",
        "Category": "Diagram"
    },
    {
        "Name": "Tree Layout",
        "Category": "Layout"
    },
    {
        "Name": "Organizational Chart",
        "Category": "Layout"
    },
]
let data2: object[] = [
    {
        "Name": "Diagram",
        "fillColor": "#916DAF"
    },
    {
        "Name": "Layout",
        "Category": "Diagram"
    },
    {
        "Name": "Tree Layout",
        "Category": "Layout"
    },
    {
        "Name": "Organizational Chart",
        "Category": "Layout"
    },
    {
        "Name": "Hierarchical Tree",
        "Category": "Tree Layout"
    },
    {
        "Name": "Radial Tree",
        "Category": "Tree Layout"
    },
    {
        "Name": "Mind Map",
        "Category": "Hierarchical Tree"
    },
    {
        "Name": "Family Tree",
        "Category": "Hierarchical Tree"
    },
    {
        "Name": "Management",
        "Category": "Organizational Chart"
    },
    {
        "Name": "Human Resources",
        "Category": "Management"
    },
    {
        "Name": "University",
        "Category": "Management"
    },
    {
        "Name": "Business",
        "Category": "Management"
    }
]
describe('DataLoaded event do not gets trigger after data loaded', () => {
    describe('Hierarchical Tree Layout', () => {
        let diagram: Diagram;
        let ele: HTMLElement;   
        function load2(){
            diagram.dataSourceSettings.dataManager = new DataManager(data2);
            diagram.dataBind();    
           }     
        beforeAll(() => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            diagram = new Diagram({                
                width: '100%', height: 490,
                //Configures data source
                dataSourceSettings: {
                    id: 'Name', parentId: 'Category', dataManager: new DataManager(data1),
                    //binds the external data with node
                    doBinding: (nodeModel: NodeModel, data: DataInfo, diagram: Diagram) => {
                        nodeModel.annotations = [{
                            /* tslint:disable:no-string-literal */
                            content: data['Name'], margin: { top: 10, left: 10, right: 10, bottom: 0 },
                            style: { color: 'black' }
                        }
                        ];
                        /* tslint:disable:no-string-literal */
                        nodeModel.style = { fill: '#ffeec7', strokeColor: '#f5d897', strokeWidth: 1 };
                    }
                },
                //Configrues HierarchicalTree layout
                layout: {
                    type: 'HierarchicalTree', horizontalSpacing: 15, verticalSpacing: 50,
                    margin: { top: 10, left: 10, right: 10, bottom: 0 },
                },    
                //Sets the default values of nodes
                getNodeDefaults: (obj: Node, diagram: Diagram) => {
                    //Initialize shape
                    obj.shape = { type: 'Basic', shape: 'Rectangle' };
                    obj.style = { strokeWidth: 1 };
                    obj.width = 95;
                    obj.height = 30;
                },
                //Sets the default values of connectors
                getConnectorDefaults: (connector: ConnectorModel, diagram: Diagram) => {
                    connector.type = 'Orthogonal';
                    connector.style.strokeColor = '#4d4d4d';
                    connector.targetDecorator.shape = 'None';
                },
            });
            diagram.appendTo('#diagram');
            
            interface DataInfo {
                [key: string]: string;
            }
        });
        afterAll(() => {
            diagram.destroy();
            ele.remove();
        });
        it('DataLoaded event do not gets trigger after data loaded', (done: Function) => {
            debugger
            load2();
            diagram.dataLoaded= (args: IDataLoadedEventArgs) => {                  
                expect(args.diagram !== null).toBe(true);            
            };
            done();
        });
       
    });
});