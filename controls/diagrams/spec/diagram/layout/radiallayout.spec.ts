/**
 * Diagram spec document
 */
import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { DataManager, Query } from '@syncfusion/ej2-data';
import {
    ConnectorModel, Node,
    DataBinding, PointModel, GraphLayoutManager, Layout, IConnector,
    HierarchicalTree, NodeModel, Rect, BasicShapeModel, RadialTree, randomId
} from '../../../src/diagram/index';
import  {profile , inMB, getMemoryProfile} from '../../../spec/common.spec';
import { MouseEvents } from '../interaction/mouseevents.spec';
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
                    id: 'Id', parentId: 'ReportingPerson', dataSource: items, root: 'parent'
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
        it('Checking node offset after save and load', (done: Function) => {
            let offsetX: number = diagram.nodes[0].offsetX;
            let offsetY: number = diagram.nodes[0].offsetY;
            let data: string = diagram.saveDiagram();
            diagram.loadDiagram(data);
            expect(diagram.nodes[0].offsetX == offsetX && diagram.nodes[0].offsetY == offsetY).toBe(true);
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
                    id: 'Id', parentId: 'ReportingPerson', dataSource: items
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
describe('Diagram Control', () => {
    describe('Radial Tree to check parent node position after adding nodes at runtime', () => {
        let mouseEvents: MouseEvents = new MouseEvents();
        let diagram: Diagram;
        let ele: HTMLElement;
        let items: DataManager = new DataManager(data as JSON[], new Query().take(3));
        beforeAll(() => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            var nodes : NodeModel[] = [
                { 
                id: 'node',
                offsetX: 200,
                offsetY: 100,
                width: 100,
                height: 100,
                shape: {
                  type: 'Basic',
                  shape: 'Ellipse',
                },}
            ];
            diagram = new Diagram({
                width: 1000, height: 1000, nodes: nodes,
                layout: {
                    type: 'RadialTree', horizontalSpacing: 30, verticalSpacing: 30, root: 'parent',
                    orientation: 'BottomToTop'
                },
                getNodeDefaults: (obj: Node, diagram: Diagram) => {
                    obj.height = 50;
                    obj.width = 50;
                    obj.backgroundColor = 'lightgrey';
                    obj.style = { fill: 'transparent', strokeWidth: 2 };
                    return obj;
                }, getConnectorDefaults: (connector: ConnectorModel, diagram: Diagram) => {
                    connector.targetDecorator.shape = 'None';
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
        it('Checking root position for radial tree layout', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            diagram.layout.type = 'RadialTree';
            diagram.layout.horizontalSpacing = 40;
            diagram.layout.verticalSpacing = 40;
            diagram.dataBind();
            expect(diagram.nodes[0].offsetX == 200 && diagram.nodes[0].offsetY == 100).toBe(true);
            mouseEvents.clickEvent(diagramCanvas, 200, 100);
            for (let i : number = 1; i <= 20; i++) {
                let newNode = {
                    id: 'newnode' + randomId(),
                    height: 100,
                    width: 100,
                    shape: {
                        type: 'Basic',
                        shape: 'Ellipse',
                    },
                };
                diagram.add(newNode as Node);
                let newConn = {
                    id: 'newcon' + randomId(),
                    sourceID: diagram.nodes[0].id,
                    targetID: newNode.id,
                };
                diagram.add(newConn);
            }
            diagram.doLayout();
            diagram.dataBind();
            expect(diagram.nodes[0].offsetX == 200 && diagram.nodes[0].offsetY == 100).toBe(true);
            done();
        });
    });
});
describe('Diagram Control', () => {
    describe('Radial Tree to check parent node position after adding nodes at default and runtime', () => {
        let mouseEvents: MouseEvents = new MouseEvents();
        let diagram: Diagram;
        let ele: HTMLElement;
        let items: DataManager = new DataManager(data as JSON[], new Query().take(3));
        beforeAll(() => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            var nodes : NodeModel[] = [
                { 
                id: 'node0',
                offsetX: 200,
                offsetY: 100,
                width: 100,
                height: 100,
                shape: {
                  type: 'Basic',
                  shape: 'Ellipse',
                },},
                { 
                    id: 'node1',
                    offsetX: 200,
                    offsetY: 100,
                    width: 100,
                    height: 100,
                    shape: {
                      type: 'Basic',
                      shape: 'Ellipse',
                    },},
                    { 
                        id: 'node2',
                        offsetX: 200,
                        offsetY: 100,
                        width: 100,
                        height: 100,
                        shape: {
                          type: 'Basic',
                          shape: 'Ellipse',
                        },},
                        { 
                            id: 'node3',
                            offsetX: 200,
                            offsetY: 100,
                            width: 100,
                            height: 100,
                            shape: {
                              type: 'Basic',
                              shape: 'Ellipse',
                            },},
                            { 
                                id: 'node4',
                                offsetX: 200,
                                offsetY: 100,
                                width: 100,
                                height: 100,
                                shape: {
                                  type: 'Basic',
                                  shape: 'Ellipse',
                                },},
                                { 
                                    id: 'node5',
                                    offsetX: 200,
                                    offsetY: 100,
                                    width: 100,
                                    height: 100,
                                    shape: {
                                      type: 'Basic',
                                      shape: 'Ellipse',
                                    },}
            ];
            var connectors : ConnectorModel[] = [
                {
                    id : 'connector1',
                    sourceID : 'node0',
                    targetID : 'node1'
                },
                {
                    id : 'connector2',
                    sourceID : 'node0',
                    targetID : 'node2'
                },
                {
                    id : 'connector3',
                    sourceID : 'node0',
                    targetID : 'node3'
                },
                {
                    id : 'connector4',
                    sourceID : 'node0',
                    targetID : 'node4'
                },
                {
                    id : 'connector5',
                    sourceID : 'node0',
                    targetID : 'node5'
                },
            ];
            diagram = new Diagram({
                width: 1000, height: 1000, nodes: nodes, connectors : connectors,
                layout: {
                    type: 'RadialTree', horizontalSpacing: 30, verticalSpacing: 30, root: 'parent',
                    orientation: 'BottomToTop'
                },
                getNodeDefaults: (obj: Node, diagram: Diagram) => {
                    obj.height = 50;
                    obj.width = 50;
                    obj.backgroundColor = 'lightgrey';
                    obj.style = { fill: 'transparent', strokeWidth: 2 };
                    return obj;
                }, getConnectorDefaults: (connector: ConnectorModel, diagram: Diagram) => {
                    connector.targetDecorator.shape = 'None';
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
        it('Checking root position after adding default and runtime layout', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            diagram.layout.type = 'RadialTree';
            diagram.layout.horizontalSpacing = 40;
            diagram.layout.verticalSpacing = 40;
            diagram.dataBind();
            expect(diagram.nodes[0].offsetX == 200 && diagram.nodes[0].offsetY == 100).toBe(true);
            mouseEvents.clickEvent(diagramCanvas, 200, 100);
            for (let i : number = 1; i <= 5; i++) {
                let newNode = {
                    id: 'newnode' + randomId(),
                    height: 100,
                    width: 100,
                    shape: {
                        type: 'Basic',
                        shape: 'Ellipse',
                    },
                };
                diagram.add(newNode as Node);
                let newConn = {
                    id: 'newcon' + randomId(),
                    sourceID: diagram.nodes[0].id,
                    targetID: newNode.id,
                };
                diagram.add(newConn);
            }
            diagram.doLayout();
            diagram.dataBind();
            expect(diagram.nodes[0].offsetX == 200 && diagram.nodes[0].offsetY == 100).toBe(true);
            done();
        });
    });
});
describe('Diagram Control', () => {
    describe('Radial Tree to check parent node position after adding child for children node', () => {
        let mouseEvents: MouseEvents = new MouseEvents();
        let diagram: Diagram;
        let ele: HTMLElement;
        let items: DataManager = new DataManager(data as JSON[], new Query().take(3));
        beforeAll(() => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            var nodes : NodeModel[] = [
                { 
                id: 'node0',
                offsetX: 200,
                offsetY: 100,
                width: 100,
                height: 100,
                shape: {
                  type: 'Basic',
                  shape: 'Ellipse',
                },},
                { 
                    id: 'node1',
                    offsetX: 200,
                    offsetY: 100,
                    width: 100,
                    height: 100,
                    shape: {
                      type: 'Basic',
                      shape: 'Ellipse',
                    },},
                    { 
                        id: 'node2',
                        offsetX: 200,
                        offsetY: 100,
                        width: 100,
                        height: 100,
                        shape: {
                          type: 'Basic',
                          shape: 'Ellipse',
                        },},
                        { 
                            id: 'node3',
                            offsetX: 200,
                            offsetY: 100,
                            width: 100,
                            height: 100,
                            shape: {
                              type: 'Basic',
                              shape: 'Ellipse',
                            },},
                            { 
                                id: 'node4',
                                offsetX: 200,
                                offsetY: 100,
                                width: 100,
                                height: 100,
                                shape: {
                                  type: 'Basic',
                                  shape: 'Ellipse',
                                },},
                                { 
                                    id: 'node5',
                                    offsetX: 200,
                                    offsetY: 100,
                                    width: 100,
                                    height: 100,
                                    shape: {
                                      type: 'Basic',
                                      shape: 'Ellipse',
                                    },}
            ];
            var connectors : ConnectorModel[] = [
                {
                    id : 'connector1',
                    sourceID : 'node0',
                    targetID : 'node1'
                },
                {
                    id : 'connector2',
                    sourceID : 'node0',
                    targetID : 'node2'
                },
                {
                    id : 'connector3',
                    sourceID : 'node0',
                    targetID : 'node3'
                },
                {
                    id : 'connector4',
                    sourceID : 'node0',
                    targetID : 'node4'
                },
                {
                    id : 'connector5',
                    sourceID : 'node0',
                    targetID : 'node5'
                },
            ];
            diagram = new Diagram({
                width: 1000, height: 1000, nodes: nodes, connectors : connectors,
                layout: {
                    type: 'RadialTree', horizontalSpacing: 30, verticalSpacing: 30, root: 'parent',
                    orientation: 'BottomToTop'
                },
                getNodeDefaults: (obj: Node, diagram: Diagram) => {
                    obj.height = 50;
                    obj.width = 50;
                    obj.backgroundColor = 'lightgrey';
                    obj.style = { fill: 'transparent', strokeWidth: 2 };
                    return obj;
                }, getConnectorDefaults: (connector: ConnectorModel, diagram: Diagram) => {
                    connector.targetDecorator.shape = 'None';
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
        it('Checking root position after adding nodes for child nodes', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            diagram.layout.type = 'RadialTree';
            diagram.layout.horizontalSpacing = 40;
            diagram.layout.verticalSpacing = 40;
            diagram.dataBind();
            expect(diagram.nodes[0].offsetX == 200 && diagram.nodes[0].offsetY == 100).toBe(true);
            mouseEvents.clickEvent(diagramCanvas, 200, 100);
            for (let i : number = 1; i <= 5; i++) {
                let newNode = {
                    id: 'newnode' + randomId(),
                    height: 100,
                    width: 100,
                    shape: {
                        type: 'Basic',
                        shape: 'Ellipse',
                    },
                };
                diagram.add(newNode as Node);
                let newConn = {
                    id: 'newcon' + randomId(),
                    sourceID: diagram.nodes[i].id,
                    targetID: newNode.id,
                };
                diagram.add(newConn);
            }
            diagram.doLayout();
            diagram.dataBind();
            expect(diagram.nodes[0].offsetX == 200 && diagram.nodes[0].offsetY == 100).toBe(true);
            done();
        });
    });
});