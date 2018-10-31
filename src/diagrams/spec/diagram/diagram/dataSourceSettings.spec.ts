import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { BasicShapeModel } from '../../../src/diagram/objects/node-model';
import { Node } from '../../../src/diagram/objects/node';
import { NodeModel } from '../../../src/diagram/objects/node-model';
import { IDataLoadedEventArgs } from '../../../src/diagram/objects/interface/IElement';
import { ConnectorModel, } from '../../../src/diagram/objects/connector-model';
import { Segments } from '../../../src/diagram/enum/enum';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { DataBinding } from '../../../src/diagram/index';
Diagram.Inject(DataBinding);


/**
 * Data Source Spec
 */
describe('Diagram Control', () => {

    describe('Data Binding', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);

            let data: DataManager = new DataManager();
            diagram = new Diagram({
                width: 1000, height: 1000,
                dataSourceSettings: { dataManager: data },
                layout: { type: 'HierarchicalTree' }
            });
            diagram.appendTo('#diagram');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking empty data', (done: Function) => {
            expect(diagram.nodes.length === 0 && diagram.connectors.length === 0).toBe(true);
            done();
        });
    });

    describe('Data Binding', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let data: object[] = [{ 'Name': 'Director' },
            { 'Name': 'Manager', 'ReportingPerson': 'Director' },
            { 'Name': 'TeamLead', 'ReportingPerson': 'Director' },
            { 'Name': 'Software Developer', 'ReportingPerson': 'TeamLead' },
            { 'Name': 'Testing engineer', 'ReportingPerson': 'TeamLead' },
            { 'Name': 'Software Developer', 'ReportingPerson': 'Manager' },
            { 'Name': 'Testing engineer', 'ReportingPerson': 'Manager' }];

            let items: DataManager = new DataManager(data as JSON[]);
            let i: number = 1;

            diagram = new Diagram({
                width: 1000, height: 1000,
                dataSourceSettings: {
                    id: 'Name',
                    parentId: 'ReportingPerson',
                    dataManager: items,
                    doBinding: (node: NodeModel, dataSource: object, diagram: Diagram) => {
                        node.annotations = [{ content: dataSource['Name'] }];
                    }
                },
                getNodeDefaults: (node: Node) => {
                    let obj: NodeModel = {};
                    obj.width = 100; obj.height = 50; obj.offsetX = i * 100;
                    obj.offsetY = i * 100;
                    obj.shape = { type: 'Basic', shape: 'Rectangle' } as BasicShapeModel;
                    obj.style = { fill: 'transparent', strokeWidth: 2 };
                    i++;
                    return obj;
                }, getConnectorDefaults: (obj: ConnectorModel, diagram: Diagram) => {
                    let connector: ConnectorModel = {};
                    connector.type = 'Orthogonal';
                    return connector;
                }
            });
            diagram.appendTo('#diagram');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking local data binding', (done: Function) => {
            expect(diagram.nodes.length === 7 && diagram.connectors.length === 6).toBe(true);
            expect((diagram.nodes[0] as NodeModel).annotations.length).toBe(1);
            done();

        });
    });

    describe('Data Binding using string function', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagrammo' });
            document.body.appendChild(ele);
            let data: object[] = [{ 'Name': 'Director' },
            { 'Name': 'Manager', 'ReportingPerson': 'Director' },
            { 'Name': 'TeamLead', 'ReportingPerson': 'Director' },
            { 'Name': 'Software Developer', 'ReportingPerson': 'TeamLead' },
            { 'Name': 'Testing engineer', 'ReportingPerson': 'TeamLead' },
            { 'Name': 'Software Developer', 'ReportingPerson': 'Manager' },
            { 'Name': 'Testing engineer', 'ReportingPerson': 'Manager' }];

            let items: DataManager = new DataManager(data as JSON[]);
            let i: number = 1;

            diagram = new Diagram({
                width: 1000, height: 1000,
                dataSourceSettings: {
                    id: 'Name',
                    parentId: 'ReportingPerson',
                    dataManager: items,
                    doBinding: (node: NodeModel, dataSource: object, diagram: Diagram) => {
                        node.annotations = [{ content: dataSource['Name'] }];
                    }
                },
                getNodeDefaults: 'getNodeDefaults',
                getConnectorDefaults: 'getConnectorDefaults'
            });
            diagram.appendTo('#diagrammo');

            window['getNodeDefaults'] = function (node: Node): NodeModel {
                let obj: NodeModel = {};
                obj.width = 100; obj.height = 50; obj.offsetX = i * 100;
                obj.offsetY = i * 100;
                obj.shape = { type: 'Basic', shape: 'Rectangle' } as BasicShapeModel;
                obj.style = { fill: 'transparent', strokeWidth: 2 };
                i++;
                return obj;
            }

            window['getConnectorDefaults'] = function (obj: ConnectorModel, diagram: Diagram): ConnectorModel {
                let connector: ConnectorModel = {};
                connector.type = 'Orthogonal';
                return connector;
            }
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking local data binding', (done: Function) => {
            expect(diagram.nodes.length === 7 && diagram.connectors.length === 6).toBe(true);
            expect((diagram.nodes[0] as NodeModel).annotations.length).toBe(1);
            done();
        });
    });

    describe('Data Binding', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            const SERVICE_URI = 'https://mvc.syncfusion.com/Services/Northwnd.svc';
            let items: DataManager = new DataManager({ url: SERVICE_URI }, new Query().from('Employees').
                select('EmployeeID, ReportsTo, FirstName'));
            let i: number = 1;
            diagram = new Diagram({
                width: 1500, height: 1500,
                dataSourceSettings: { id: 'EmployeeID', parentId: 'ReportsTo', dataManager: items },
                getNodeDefaults: (node: Node) => {
                    let obj: NodeModel = {};
                    obj.width = 100; obj.height = 50; obj.offsetX = i * 100;
                    obj.offsetY = i * 100;
                    obj.shape = { type: 'Basic', shape: 'Rectangle' } as BasicShapeModel;
                    obj.style = { fill: 'transparent', strokeWidth: 2 };
                    i++;
                    return obj;
                }, getConnectorDefaults: (obj: ConnectorModel, diagram: Diagram) => {
                    let connector: ConnectorModel = {};
                    connector.type = 'Orthogonal';

                    return connector;
                }
            });
            diagram.appendTo('#diagram');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking remote data binding', (done: Function) => {
            diagram.dataLoaded = (args: IDataLoadedEventArgs) => {
                expect(diagram.nodes.length === 10 && diagram.connectors.length === 8).toBe(true);
                done();
            };
        });
    });

    describe('Data Binding ', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let data: object[] = [{ 'Name': 'Customer Support', 'fillColor': '#0f688d' },
            { 'Name': 'OEM Support', 'fillColor': '#0f688d' },
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
            { 'Name': 'Channel Field Sales', 'ReportingPerson': ['Northern Region', 'Western Region'], 'fillColor': '#14ad85' },
            { 'Name': 'Customer', 'ReportingPerson': ['Customer Care', 'ServiceCare'], 'fillColor': '#0aa6ce' },
            { 'Name': 'SalesMan', 'ReportingPerson': ['Channel Marketing', 'Channel Field Sales'], 'fillColor': '#0aa6ce' },
            { 'Name': 'Adventure Work Cycle', 'ReportingPerson': ['Customer', 'SalesMan'], 'fillColor': '#f16f62' },
            ];
            let items: DataManager = new DataManager(data as JSON[], new Query().take(7));
            let i: number = 1;
            diagram = new Diagram({
                width: 3500, height: 3500, dataSourceSettings: { id: 'Name', parentId: 'ReportingPerson', dataManager: items },
                getNodeDefaults: (node: Node) => {
                    let obj: NodeModel = {};
                    obj.width = 100; obj.height = 50; obj.offsetX = i * 100;
                    obj.offsetY = i * 100; obj.shape = { type: 'Basic', shape: 'Rectangle' } as BasicShapeModel;
                    obj.style = { fill: 'transparent', strokeWidth: 2 };
                    i++;
                    return obj;
                }, getConnectorDefaults: (obj: ConnectorModel, diagram: Diagram) => {
                    let connector: ConnectorModel = {};
                    connector.type = 'Orthogonal';
                    return connector;
                }
            });
            diagram.appendTo('#diagram');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking data source with multiple parents', (done: Function) => {
            let source: Node;
            let connector: ConnectorModel = diagram.connectors[0];
            expect(diagram.nodes.length === 15 && diagram.connectors.length === 14).toBe(true);
            done();
        });
    });

    describe('Data Binding', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let data: object[] = [{ 'Name': 'Director' },
            { 'Name': 'Manager', 'ReportingPerson': 'Director' },
            { 'Name': 'Software Developer', 'ReportingPerson': ['Director', 'Manager'] },
            ];
            let items: DataManager = new DataManager(data as JSON[], new Query().take(4));
            let i: number = 1;
            diagram = new Diagram({
                width: 1000, height: 1000, dataSourceSettings: { id: 'Name', parentId: 'ReportingPerson', dataManager: items },
                getNodeDefaults: (node: Node) => {
                    let obj: NodeModel = {};
                    obj.width = 100; obj.height = 50; obj.offsetX = i * 100;
                    obj.offsetY = i * 100; obj.shape = { type: 'Basic', shape: 'Rectangle' } as BasicShapeModel;
                    obj.style = { fill: 'transparent', strokeWidth: 2 };
                    i++;
                    return obj;
                }, getConnectorDefaults: (obj: ConnectorModel, diagram: Diagram) => {
                    let connector: ConnectorModel = {};
                    connector.type = 'Orthogonal';
                    return connector;
                }
            });
            diagram.appendTo('#diagram');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking cyclic data', (done: Function) => {
            expect(diagram.nodes.length === 3 && diagram.connectors.length === 3).toBe(true);
            done();
        });
    });


    describe('Data Binding', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let data: object[] = [
                { 'Id': 'E1', 'Name': 'Maria Anders', 'Designation': 'Managing Director' },
                { 'Id': 'E2', 'Name': 'Ana Trujillo', 'Designation': 'Project Manager', 'ReportingPerson': 'E1' }];
            let items: DataManager = new DataManager(data as JSON[], new Query().take(2));
            let i: number = 1;
            diagram = new Diagram({
                width: 1000, height: 1000, dataSourceSettings: {
                    id: 'Id', parentId: 'Designation', root: 'E2', dataManager: items
                },
                getNodeDefaults: (node: Node) => {
                    let obj: NodeModel = {};
                    obj.width = 100; obj.height = 50; obj.offsetX = i * 100;
                    obj.offsetY = i * 100; obj.shape = { type: 'Basic', shape: 'Rectangle' } as BasicShapeModel;
                    obj.style = { fill: 'transparent', strokeWidth: 2 };
                    i++;
                    return obj;
                }, getConnectorDefaults: (obj: ConnectorModel, diagram: Diagram) => {
                    let connector: ConnectorModel = {};
                    connector.type = 'Orthogonal';
                    return connector;
                }
            });
            diagram.appendTo('#diagram');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking root node', (done: Function) => {
            expect(diagram.nodes.length === 1 && (diagram.nodes[0] as Node).inEdges.length === 0
                && (diagram.nodes[0] as Node).outEdges.length === 0).toBe(true);
            done();
        });
    });
    describe('Data Binding', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let data: object[] = [{ 'Name': 'Director' },
            { 'Name': 'Manager', 'ReportingPerson': 'Director' },
            { 'Name': 'TeamLead', 'ReportingPerson': 'Director' },
            { 'Name': 'Software Developer', 'ReportingPerson': 'TeamLead' },
            { 'Name': 'Testing engineer', 'ReportingPerson': 'TeamLead' },
            { 'Name': 'Software Developer', 'ReportingPerson': 'Manager' },
            { 'Name': 'Testing engineer', 'ReportingPerson': 'Manager' }];


            let i: number = 1;

            diagram = new Diagram({
                width: 1000, height: 1000,
                dataSourceSettings: {
                    id: 'Name',
                    data: data,
                    doBinding: (node: NodeModel, dataSource: object, diagram: Diagram) => {
                        node.annotations = [{ content: dataSource['Name'] }];
                    }
                },
                getNodeDefaults: (node: Node) => {
                    let obj: NodeModel = {};
                    obj.width = 100; obj.height = 50; obj.offsetX = i * 100;
                    obj.offsetY = i * 100;
                    obj.shape = { type: 'Basic', shape: 'Rectangle' } as BasicShapeModel;
                    obj.style = { fill: 'transparent', strokeWidth: 2 };
                    i++;
                    return obj;
                }, getConnectorDefaults: (obj: ConnectorModel, diagram: Diagram) => {
                    let connector: ConnectorModel = {};
                    connector.type = 'Orthogonal';
                    return connector;
                }
            });
            diagram.appendTo('#diagram');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking binding without connections', (done: Function) => {
            expect(diagram.nodes.length == 7).toBe(true);
            expect((diagram.nodes[0] as NodeModel).annotations.length).toBe(1);
            done();
        });
    });
    describe('Data Binding with string function', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramko' });
            document.body.appendChild(ele);
            let data: object[] = [{ 'Name': 'Director' },
            { 'Name': 'Manager', 'ReportingPerson': 'Director' },
            { 'Name': 'TeamLead', 'ReportingPerson': 'Director' },
            { 'Name': 'Software Developer', 'ReportingPerson': 'TeamLead' },
            { 'Name': 'Testing engineer', 'ReportingPerson': 'TeamLead' },
            { 'Name': 'Software Developer', 'ReportingPerson': 'Manager' },
            { 'Name': 'Testing engineer', 'ReportingPerson': 'Manager' }];

            let items: DataManager = new DataManager(data as JSON[]);
            let i: number = 1;

            diagram = new Diagram({
                width: 1000, height: 1000,
                dataSourceSettings: {
                    id: 'Name',
                    dataManager: items,
                    doBinding: 'doBinding'
                    // doBinding: (node: NodeModel, dataSource: object, diagram: Diagram) => {
                    //     node.annotations = [{ content: dataSource['Name'] }];
                    // }
                },
                getNodeDefaults: (node: Node) => {
                    let obj: NodeModel = {};
                    obj.width = 100; obj.height = 50; obj.offsetX = i * 100;
                    obj.offsetY = i * 100;
                    obj.shape = { type: 'Basic', shape: 'Rectangle' } as BasicShapeModel;
                    obj.style = { fill: 'transparent', strokeWidth: 2 };
                    i++;
                    return obj;
                }, getConnectorDefaults: (obj: ConnectorModel, diagram: Diagram) => {
                    let connector: ConnectorModel = {};
                    connector.type = 'Orthogonal';
                    return connector;
                }
            });



            diagram.appendTo('#diagramko');
        });
        window['doBinding'] = function (node: NodeModel, dataSource: object, diagram: Diagram) {
            node.annotations = [{ content: dataSource['Name'] }];
        }
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking binding without connections', (done: Function) => {
            expect(diagram.nodes.length == 7).toBe(true);
            expect((diagram.nodes[0] as NodeModel).annotations.length).toBe(1);
            done();
        });
    });
});
