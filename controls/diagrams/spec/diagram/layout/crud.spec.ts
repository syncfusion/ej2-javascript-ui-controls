/**
 * Diagram spec document
 */
import {
    ConnectorModel,
    Node,
    NodeModel,
    DataBinding,
    HierarchicalTree,
    randomId
} from '../../../src/diagram/index';
import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { MouseEvents } from '../interaction/mouseevents.spec';
import { profile, inMB, getMemoryProfile } from '../../../spec/common.spec';

Diagram.Inject(DataBinding, HierarchicalTree);

let node: NodeModel = {
    id: 'node1',
    width: 70,
    height: 70,
    annotations: [{ content: 'node1' }]
};
let node1: NodeModel = {
    id: 'node2',
    width: 70,
    height: 70,
    annotations: [{ content: 'node2' }]
};
let node2: NodeModel = {
    id: 'node3',
    width: 70,
    height: 70,
    annotations: [{ content: 'node3' }]
};
let node3: NodeModel = {
    id: 'node4',
    width: 70,
    height: 70,
    annotations: [{ content: 'node4' }]
};
let node4: NodeModel = {
    id: 'node5',
    width: 70,
    height: 70,
    annotations: [{ content: 'node5' }]
};
let node5: NodeModel = {
    id: 'node6',
    width: 70,
    height: 70,
    annotations: [{ content: 'node6' }]
};
let node6: NodeModel = {
    id: 'node7',
    width: 70,
    height: 70,
    annotations: [{ content: 'node7' }]
};
let node7: NodeModel = {
    id: 'node8',
    width: 70,
    height: 70,
    annotations: [{ content: 'node8' }]
};
let node8: NodeModel = {
    id: 'node9',
    width: 70,
    height: 70,
    annotations: [{ content: 'node9' }]
};
let node9: NodeModel = {
    id: 'node10',
    width: 70,
    height: 70,
    annotations: [{ content: 'node10' }]
};

let connector: ConnectorModel = {
    id: 'connector',
    sourceID: 'node1',
    targetID: 'node2'
};
let connector1: ConnectorModel = {
    id: 'connector1',
    sourceID: 'node2',
    targetID: 'node3'
};
let connector2: ConnectorModel = {
    id: 'connector2',
    sourceID: 'node3',
    targetID: 'node4'
};
let connector3: ConnectorModel = {
    id: 'connector3',
    sourceID: 'node3',
    targetID: 'node6'
};
let connector4: ConnectorModel = {
    id: 'connector4',
    sourceID: 'node4',
    targetID: 'node7'
};
let connector5: ConnectorModel = {
    id: 'connector5',
    sourceID: 'node4',
    targetID: 'node5'
};
let connector6: ConnectorModel = {
    id: 'connector6',
    sourceID: 'node4',
    targetID: 'node8'
};
let connector7: ConnectorModel = {
    id: 'connector7',
    sourceID: 'node6',
    targetID: 'node9'
};
let connector8: ConnectorModel = {
    id: 'connector8',
    sourceID: 'node6',
    targetID: 'node10'
};
let connector9: ConnectorModel = {
    id: 'connector9',
    sourceID: 'node6',
    targetID: 'node7'
};
let connector10: ConnectorModel = {
    id: 'connector10',
    sourceID: 'node6',
    targetID: 'node8'
};

let nodedata: any = [
    { Id: '1', Name: 'diagram', Color: '#0f688d', Description: 'diagram' },
    { Id: '2', Name: 'layout', Color: '#0f688d', Description: 'layout' },
    { Id: '3', Name: 'treelayout', Color: '#0f688d', Description: 'treelayout' },
    { Id: '4', Name: 'orgchart', Color: '#0f688d', Description: 'orgchart' },
    { Id: '5', Name: 'htree', Color: '#0f688d', Description: 'htree' },
    { Id: '6', Name: 'rtree', Color: '#0f688d', Description: 'rtree' },
    { Id: '7', Name: 'mindmap', Color: '#0f688d', Description: 'mindmap' },
    { Id: '8', Name: 'ftree', Color: '#0f688d', Description: 'ftree' },
    { Id: '9', Name: 'management', Color: '#0f688d', Description: 'management' },
    { Id: '10', Name: 'hr', Color: '#0f688d', Description: 'hr' },
    { Id: '11', Name: 'university', Color: '#0f688d', Description: 'university' },
    { Id: '12', Name: 'business', Color: '#0f688d', Description: 'business' }
];

let connectorData: any = [
    { Id: '1', Name: 'Line1', sourceID: 'diagram', targetID: 'layout' },
    { Id: '2', Name: 'Line2', sourceID: 'layout', targetID: 'treelayout' },
    { Id: '3', Name: 'Line3', sourceID: 'layout', targetID: 'orgchart' },
    { Id: '4', Name: 'Line4', sourceID: 'treelayout', targetID: 'htree' },
    { Id: '5', Name: 'Line5', sourceID: 'treelayout', targetID: 'rtree' },
    { Id: '6', Name: 'Line6', sourceID: 'orgchart', targetID: 'management' },
    { Id: '7', Name: 'Line7', sourceID: 'htree', targetID: 'mindmap' },
    { Id: '8', Name: 'Line8', sourceID: 'htree', targetID: 'ftree' },
    { Id: '9', Name: 'Line9', sourceID: 'management', targetID: 'hr' },
    { Id: '10', Name: 'Line10', sourceID: 'management', targetID: 'university' },
    { Id: '11', Name: 'Line11', sourceID: 'management', targetID: 'business' }
];

describe('Crud Diagram', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    beforeAll(() => {
        ele = createElement('div', { id: 'CrudDiagram' });
        document.body.appendChild(ele);
        diagram = new Diagram({
            width: 1000,
            height: 1000,
            nodes: [
                node,
                node1,
                node2,
                node3,
                node5,
                node6,
                node4,
                node7,
                node8,
                node9
            ],
            connectors: [
                connector,
                connector1,
                connector2,
                connector3,
                connector4,
                connector5,
                connector6,
                connector7,
                connector8,
                connector9,
                connector10
            ],
            layout: { type: 'HierarchicalTree', verticalSpacing: 40 },
            getNodeDefaults: (obj: Node, diagram: Diagram) => {
                obj.width = 100;
                obj.height = 100;
                obj.shape = { type: 'Basic', shape: 'Rectangle' };
                obj.style = { fill: 'transparent', strokeWidth: 2 };
                return obj;
            },
            getConnectorDefaults: (connector: ConnectorModel, diagram: Diagram) => {
                connector.type = 'Orthogonal';
                return connector;
            }
        });
        diagram.appendTo('#CrudDiagram');
    });
    afterAll(() => {
        diagram.destroy();
        ele.remove();
    });
    it('Checking insertdata', (done: Function) => {
        let mouseEvents: MouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement = document.getElementById(
            diagram.element.id + 'content'
        );
        mouseEvents.clickEvent(diagramCanvas, 518, 150);

        let selectedItem: NodeModel = diagram.selectedItems.nodes[0];
        let description: string = 'data';
        let color: string = 'red';
        let node: any = {
            id: randomId(),
            style: { fill: color },
            Id: Math.floor(Math.random() * 66) + 1,
            Description: description,
            Color: color
        };
        let connector: any = {
            id: randomId(),
            sourceID: selectedItem.id,
            targetID: node.id,
            Id: Math.floor(Math.random() * 66) + 1
        };
        diagram.add(node);
        diagram.add(connector);
        diagram.doLayout();
        let data: object = diagram.insertData();
        expect(
            (data as Diagram).nodes.length == 1 &&
            (data as Diagram).connectors.length == 1
        ).toBe(true);
        done();
    });

    it('Checking updateData', (done: Function) => {
        let mouseEvents: MouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement = document.getElementById(
            diagram.element.id + 'content'
        );
        mouseEvents.clickEvent(diagramCanvas, 648, 290);

        let selectedItem: any = diagram.selectedItems.nodes[0];
        selectedItem.Description = 'sametor';
        selectedItem.Color = 'blue';
        diagram.dataBind();
        diagram.updateData();
        expect(
            (diagram.selectedItems.nodes[0] as any).Description == 'sametor'
        ).toBe(true);
        done();
    });

    it('Checking deleteData', (done: Function) => {
        let mouseEvents: MouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement = document.getElementById(
            diagram.element.id + 'content'
        );
        mouseEvents.clickEvent(diagramCanvas, 648, 290);

        let selectedItem: any = diagram.selectedItems.nodes[0];
        diagram.remove(selectedItem);
        diagram.doLayout();
        let data: Object = diagram.removeData();
        expect(
            (data as Diagram).nodes.length == 1 &&
            (data as Diagram).connectors.length == 1
        ).toBe(true);
        done();
    });

});

describe('Crud Datasource', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    beforeAll(() => {
        ele = createElement('div', { id: 'CrudDiagram1' });
        document.body.appendChild(ele);
        diagram = new Diagram({
            width: 1000,
            height: 1000,
            dataSourceSettings: {
                id: 'Name',
                crudAction: {
                    customFields: ['Id', 'Description', 'Color']
                },
                dataManager: nodedata,
                connectionDataSource: {
                    id: 'Name',
                    sourceID: 'sourceID',
                    targetID: 'targetID',
                    crudAction: {
                        customFields: ['Id']
                    },
                    dataManager: connectorData
                }
            },
            layout: { type: 'HierarchicalTree', verticalSpacing: 40 },
            getNodeDefaults: (obj: Node, diagram: Diagram) => {
                obj.width = 100;
                obj.height = 100;
                obj.shape = { type: 'Basic', shape: 'Rectangle' };
                obj.style = { fill: 'transparent', strokeWidth: 2 };
                return obj;
            },
            getConnectorDefaults: (connector: ConnectorModel, diagram: Diagram) => {
                connector.type = 'Orthogonal';
                return connector;
            }
        });
        diagram.appendTo('#CrudDiagram1');
    });
    afterAll(() => {
        diagram.destroy();
        ele.remove();
    });
    it('Checking insertnode', (done: Function) => {
        let description: string = 'data';
        let color: string = 'red';
        let node: any = {
            id: randomId(),
            offsetX: 300,
            offsetY: 300,
            width: 100,
            height: 100,
            Id: Math.floor(Math.random() * 66) + 1,
            Description: description,
            Color: color
        };
        diagram.add(node);
        let data: any = diagram.insertData(node);
        expect(node.Description == 'data').toBe(true);
        done();
    });
    it('Checking updatenode', (done: Function) => {
        let mouseEvents: MouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement = document.getElementById(
            diagram.element.id + 'content'
        );
        mouseEvents.clickEvent(diagramCanvas, 350, 350);

        let selectedItem: any = diagram.selectedItems.nodes[0];
        selectedItem.Description = 'Niranjan';
        let data: any = diagram.updateData(selectedItem);
        expect(selectedItem.Description == 'Niranjan').toBe(true);
        done();
    });
    it('Checking deletenode', (done: Function) => {
        let mouseEvents: MouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement = document.getElementById(
            diagram.element.id + 'content'
        );
        mouseEvents.clickEvent(diagramCanvas, 350, 350);

        let selectedItem: any = diagram.selectedItems.nodes[0];
        diagram.remove(selectedItem);
        let data: any = diagram.removeData(selectedItem);
        expect(diagram.nodes.length === 12).toBe(true);
        done();
    });

});

describe('Crud read Node datasource', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    beforeAll(() => {
        ele = createElement('div', { id: 'CrudDiagram2' });
        document.body.appendChild(ele);
        diagram = new Diagram({
            width: 1000,
            height: 1000,
            dataSourceSettings: {
                id: 'Name',
                crudAction: {
                    read:
                        'http://js.syncfusion.com/demos/ejservices/api/Diagram/GetNodes',
                    create:
                        'http://js.syncfusion.com/demos/ejservices/api/Diagram/AddNodes',
                    update:
                        'http://js.syncfusion.com/demos/ejservices/api/Diagram/UpdateNodes',
                    destroy:
                        'http://js.syncfusion.com/demos/ejservices/api/Diagram/DeleteNodes',
                    customFields: ['Id', 'Description', 'Color']
                },
                connectionDataSource: {
                    id: 'Name',
                    sourceID: 'sourceID',
                    targetID: 'targetID',
                    crudAction: {
                        read:
                            'http://js.syncfusion.com/demos/ejservices/api/Diagram/GetConnectors',
                        create:
                            'http://js.syncfusion.com/demos/ejservices/api/Diagram/AddConnectors',
                        update:
                            'http://js.syncfusion.com/demos/ejservices/api/Diagram/UpdateConnectors',
                        destroy:
                            'http://js.syncfusion.com/demos/ejservices/api/Diagram/DeleteConnectors',
                        customFields: ['Id']
                    }
                }
            },
            layout: { type: 'HierarchicalTree', verticalSpacing: 40 },
            getNodeDefaults: (obj: Node, diagram: Diagram) => {
                obj.width = 100;
                obj.height = 100;
                obj.shape = { type: 'Basic', shape: 'Rectangle' };
                obj.style = { fill: 'transparent', strokeWidth: 2 };
                return obj;
            },
            getConnectorDefaults: (connector: ConnectorModel, diagram: Diagram) => {
                connector.type = 'Orthogonal';
                return connector;
            }
        });
        diagram.appendTo('#CrudDiagram2');
    });
    afterAll(() => {
        diagram.destroy();
        ele.remove();
    });
    it('Checking empty crud', (done: Function) => {
        let nodes: NodeModel[] = diagram.nodes;
        let connectors: ConnectorModel[] = diagram.connectors;
       // expect(nodes.length > 0).toBe(true);
        done();
    });

});

describe('Crud read Connector datasource', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    beforeAll(() => {
        ele = createElement('div', { id: 'CrudDiagram3' });
        document.body.appendChild(ele);
        diagram = new Diagram({
            width: 1000,
            height: 1000,
            dataSourceSettings: {
                id: 'Name',
                crudAction: {
                    customFields: ['Id', 'Description', 'Color']
                },
                connectionDataSource: {
                    id: 'Name',
                    sourceID: 'sourceID',
                    targetID: 'targetID',
                    crudAction: {
                        read:
                            'http://js.syncfusion.com/demos/ejservices/api/Diagram/GetConnectors',
                        create:
                            'http://js.syncfusion.com/demos/ejservices/api/Diagram/AddConnectors',
                        update:
                            'http://js.syncfusion.com/demos/ejservices/api/Diagram/UpdateConnectors',
                        destroy:
                            'http://js.syncfusion.com/demos/ejservices/api/Diagram/DeleteConnectors',
                        customFields: ['Id']
                    }
                }
            },
            layout: { type: 'HierarchicalTree', verticalSpacing: 40 },
            getNodeDefaults: (obj: Node, diagram: Diagram) => {
                obj.width = 100;
                obj.height = 100;
                obj.shape = { type: 'Basic', shape: 'Rectangle' };
                obj.style = { fill: 'transparent', strokeWidth: 2 };
                return obj;
            },
            getConnectorDefaults: (connector: ConnectorModel, diagram: Diagram) => {
                connector.type = 'Orthogonal';
                return connector;
            }
        });
        diagram.appendTo('#CrudDiagram3');
    });
    afterAll(() => {
        diagram.destroy();
        ele.remove();
    });
    it('Checking empty connection crud', (done: Function) => {
        let nodes: NodeModel[] = diagram.nodes;
        let connectors: ConnectorModel[] = diagram.connectors;
        expect(nodes.length == 0 && connectors.length == 0).toBe(true);
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
