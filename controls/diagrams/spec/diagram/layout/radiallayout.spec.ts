/**
 * Diagram spec document
 */
import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { DataManager, Query } from '@syncfusion/ej2-data';
import {
    ConnectorModel, Node,
    DataBinding, PointModel, GraphLayoutManager, Layout, IConnector,
    HierarchicalTree, NodeModel, Rect, BasicShapeModel, RadialTree
} from '../../../src/diagram/index';
Diagram.Inject(RadialTree);

let data: object[] = [{
    "Id": "parent", "Name": "Maria Anders", "Designation": "Managing Director",
    "ImageUrl": "../content/images/radialtree/Clayton.png", "IsExpand": "true", "RatingColor": "#C34444"
},
{
    "Id": 1, "Name": "Ana Trujillo", "Designation": "Project Manager",
    "ImageUrl": "../content/images/radialtree/Thomas.PNG", "IsExpand": "false",
    "RatingColor": "#68C2DE", "ReportingPerson": "parent"
},
{
    "Id": 2, "Name": "Lino Rodri", "Designation": "Project Manager",
    "ImageUrl": "../content/images/radialtree/Robin.PNG", "IsExpand": "true",
    "RatingColor": "#68C2DE", "ReportingPerson": "parent"
},
{
    "Id": 3, "Name": "Philip Cramer", "Designation": "Project Manager",
    "ImageUrl": "../content/images/radialtree/Robin.PNG", "IsExpand": "true",
    "RatingColor": "#68C2DE", "ReportingPerson": "parent"
},
{
    "Id": 4, "Name": "Pedro Afonso", "Designation": "Project Manager",
    "ImageUrl": "../content/images/radialtree/Paul.png", "IsExpand": "true",
    "RatingColor": "#68C2DE", "ReportingPerson": "parent"
},
{
    "Id": 5, "Name": "Anto Moreno", "Designation": "Project Lead",
    "ImageUrl": "../content/images/radialtree/image53.png", "IsExpand": "false",
    "RatingColor": "#93B85A", "ReportingPerson": 1
},
];

describe('Diagram Control', () => {
    describe('Radial Tree Layout', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let items: DataManager = new DataManager(data as JSON[], new Query().take(7));
        beforeAll(() => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            diagram = new Diagram({
                width: 1000, height: 1000,

                layout: { type: 'RadialTree', horizontalSpacing: 40, verticalSpacing: 40, orientation: 'TopToBottom' },
                dataSourceSettings: {
                    id: 'Id', parentId: 'ReportingPerson', dataManager: items, root: 'parent'
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
                    connector.type = 'Straight';
                    return connector;
                },
            });
            diagram.appendTo('#diagram');
        });
        afterAll(() => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking TopToBottom radial tree layout', (done: Function) => {
            diagram.layout.type = 'RadialTree';
            diagram.layout.horizontalSpacing = 80;
            diagram.layout.verticalSpacing = 80;
            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.left === 603 && bounds.right === 1574 && bounds.top === 633 && bounds.bottom === 1368).toBe(true);
            done();
        });
    });
});


let node: NodeModel = { id: 'node1', width: 70, height: 70, annotations: [{ content: 'node1' }] };
let node1: NodeModel = { id: 'node2', width: 70, height: 70, annotations: [{ content: 'node2' }] };
let node2: NodeModel = { id: 'node3', width: 70, height: 70, annotations: [{ content: 'node3' }] };
let node3: NodeModel = { id: 'node4', width: 70, height: 70, annotations: [{ content: 'node4' }] };
let node4: NodeModel = { id: 'node5', width: 70, height: 70, annotations: [{ content: 'node5' }] };
let node5: NodeModel = { id: 'node6', width: 70, height: 70, excludeFromLayout: true, annotations: [{ content: 'node6' }] };


let connector: ConnectorModel = { id: 'connectr', sourceID: 'node1', targetID: 'node2' };
let connector1: ConnectorModel = { id: 'connectr1', sourceID: 'node1', targetID: 'node3' };
let connector2: ConnectorModel = { id: 'connectr2', sourceID: 'node2', targetID: 'node4' };
let connector3: ConnectorModel = { id: 'connectr3', sourceID: 'node2', targetID: 'node5' };
let connector4: ConnectorModel = { id: 'connectr4', sourceID: 'node3', targetID: 'node5' };
let connector5: ConnectorModel = { id: 'connectr5', sourceID: 'node3', targetID: 'node4' };


describe('Diagram Control', () => {
    describe('Radial Tree to check root Layout', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let items: DataManager = new DataManager(data as JSON[], new Query().take(3));
        beforeAll(() => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            diagram = new Diagram({

                width: 1000, height: 1000, nodes: [node, node1, node2, node3, node4, node5],
                connectors: [connector, connector1, connector2],
                layout: { type: 'RadialTree', horizontalSpacing: 40, verticalSpacing: 40, orientation: 'TopToBottom', root: 'node1' },
                dataSourceSettings: {
                    root: 'node1'
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
                    connector.type = 'Straight';
                    return connector;
                },
            });
            diagram.appendTo('#diagram');
        });
        afterAll(() => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking root for radial tree layout', (done: Function) => {
            diagram.layout.type = 'RadialTree';
            diagram.layout.horizontalSpacing = 40;
            diagram.layout.verticalSpacing = 40;
            diagram.dataBind();
            expect(diagram.nodes[0].offsetX == 500 && diagram.nodes[0].offsetY == 500).toBe(true);
            done();
        });
    });
});

let data11: object[] = [{
    "Id": "parent", "Name": "Maria Anders", "Designation": "Managing Director", "ReportingPerson": 1,
    "ImageUrl": "../content/images/radialtree/Clayton.png", "IsExpand": "true", "RatingColor": "#C34444"
},
{
    "Id": 1, "Name": "Ana Trujillo", "Designation": "Project Manager",
    "ImageUrl": "../content/images/radialtree/Thomas.PNG", "IsExpand": "false",
    "RatingColor": "#68C2DE", "ReportingPerson": "parent"
},
{
    "Id": 2, "Name": "Lino Rodri", "Designation": "Project Manager",
    "ImageUrl": "../content/images/radialtree/Robin.PNG", "IsExpand": "true",
    "RatingColor": "#68C2DE", "ReportingPerson": "parent"
}
];

describe('Diagram Control', () => {
    describe('Radial Tree without root Layout', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let items: DataManager = new DataManager(data11 as JSON[], new Query().take(7));
        beforeAll(() => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            diagram = new Diagram({

                width: 1000, height: 1000,
                layout: { type: 'RadialTree', horizontalSpacing: 40, verticalSpacing: 40, orientation: 'TopToBottom' },
                dataSourceSettings: {
                    id: 'Id', parentId: 'ReportingPerson', dataManager: items
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
                    connector.type = 'Straight';
                    return connector;
                },
            });
            diagram.appendTo('#diagram');
        });
        afterAll(() => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking radial without root layout', (done: Function) => {
            diagram.layout.type = 'RadialTree';
            diagram.layout.horizontalSpacing = 40;
            diagram.layout.verticalSpacing = 40;
            diagram.dataBind();
            expect(diagram.nodes.length === 0).toBe(true);
            done();
        });
    });
});
