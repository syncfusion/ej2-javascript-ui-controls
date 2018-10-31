/**
 * Data spec
 */
import { createElement, remove } from '@syncfusion/ej2-base';
import { EmitType } from '@syncfusion/ej2-base';
import { Query, DataManager, ODataV4Adaptor } from '@syncfusion/ej2-data';
import { Grid } from '../../../src/grid/base/grid';
import { extend } from '../../../src/grid/base/util';
import { Page, Sort, Group, Edit, Toolbar, Selection } from '../../../src/grid/actions';
import { Data } from '../../../src/grid/actions/data';
import { data } from '../base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { createGrid, destroy } from '../base/specutil.spec';
import { DataStateChangeEventArgs, DataSourceChangedEventArgs } from '../../../src/grid/base/interface';

Grid.Inject(Page, Sort, Group, Edit, Toolbar);

describe('Data module', () => {

    describe('Locale data testing', () => {

        type MockAjaxReturn = { promise: Promise<Object>, request: JasmineAjaxRequest };
        type ResponseType = { result: Object[], count: number | string };

        let mockAjax: Function = (d: { data: { [o: string]: Object | Object[] } | Object[], dm?: DataManager }, query: Query | Function, response?: Object):
            MockAjaxReturn => {
            jasmine.Ajax.install();
            let dataManager = d.dm || new DataManager({
                url: '/api/Employees',
            });
            let prom: Promise<Object> = dataManager.executeQuery(query);
            let request: JasmineAjaxRequest;
            let defaults: Object = {
                'status': 200,
                'contentType': 'application/json',
                'responseText': JSON.stringify(d.data)
            };
            let responses: Object = {};
            request = jasmine.Ajax.requests.mostRecent();
            extend(responses, defaults, response);
            request.respondWith(responses);
            return {
                promise: prom,
                request: request
            }
        };

        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: data,
                    query: new Query().take(5), allowPaging: false, dataBound: dataBound,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID' },
                        { headerText: 'CustomerID', field: 'CustomerID' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                        { headerText: 'ShipCity', field: 'ShipCity' },
                    ],
                });
            gridObj.appendTo('#Grid');
        });

        it('TR generated testing', () => {
            expect(gridObj.element.querySelectorAll('.e-row').length).toBe(5);
        });

        afterAll(() => {
            remove(elem);
            jasmine.Ajax.uninstall();
        });

    });

    describe('Remote data without columns testing', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let resquest: JasmineAjaxRequest;
        let dataManager: DataManager;
        let query: Query = new Query().take(5);
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            jasmine.Ajax.install();
            dataManager = new DataManager({
                url: 'service/Orders/'
            });
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: dataManager, dataBound: dataBound,
                    query: query, allowPaging: true,
                });
            gridObj.appendTo('#Grid');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify({ d: data.slice(0, 15), __count: 15 })
            });
        });

        it('TR generated testing', () => {
            expect(gridObj.element.querySelectorAll('.e-row').length).toBe(15);
        });

        it('Column count testing', () => {
            expect(gridObj.element.querySelectorAll('.e-headercell').length).toBe(12);
        });

        afterAll(() => {
            remove(gridObj.element);
            jasmine.Ajax.uninstall();
        });
    });

    describe('actionFailure after control destroyed', () => {
        let actionFailedFunction: () => void = jasmine.createSpy('actionFailure');
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let gridObj: Grid;
        beforeAll(() => {
            jasmine.Ajax.install();
            document.body.appendChild(elem);
            gridObj = new Grid({
                dataSource: new DataManager({
                    url: '/test/db',
                    adaptor: new ODataV4Adaptor
                }),
                columns: [
                    { headerText: 'OrderID', field: 'OrderID' },
                    { headerText: 'CustomerID', field: 'CustomerID' },
                    { headerText: 'EmployeeID', field: 'EmployeeID' },
                    { headerText: 'ShipCountry', field: 'ShipCountry' },
                    { headerText: 'ShipCity', field: 'ShipCity' },
                ],
                actionFailure: actionFailedFunction
            });
            gridObj.appendTo('#Grid');
        });
        beforeEach((done: Function) => {
            let request: JasmineAjaxRequest = jasmine.Ajax.requests.mostRecent();
            request.respondWith({
                'status': 404,
                'contentType': 'application/json',
                'responseText': 'Page not found'
            });
            setTimeout(() => { done(); }, 100);
        });
        it('actionFailure testing', () => {
            expect(actionFailedFunction).toHaveBeenCalled();
        });

        afterAll(() => {
            remove(elem);
            jasmine.Ajax.uninstall();
        });
    });

    describe('Grid with empty datasource', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: null, allowPaging: false,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID' },
                        { headerText: 'CustomerID', field: 'CustomerID' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                        { headerText: 'ShipCity', field: 'ShipCity' },
                    ],
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });

        it('Row count testing', () => {
            expect(gridObj.element.querySelectorAll('.e-row').length).toBe(0);
            //for coverage
            gridObj.isDestroyed = true;
            let data = new Data(gridObj);
            (gridObj.renderModule as any).data.destroy();
            gridObj.isDestroyed = false;
        });

        afterAll(() => {
            remove(elem);
        });

    });

    describe('datamanager offline - success testing', () => {
        let gridObj: Grid;
        let dataManager: DataManager;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let actionComplete: (e?: Object) => void;
        beforeAll((done: Function) => {
            jasmine.Ajax.install();
            dataManager = new DataManager({
                url: '/test/db',
                adaptor: new ODataV4Adaptor,
                offline: true
                }
            );
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify({value: data.slice(0, 15)})
            });
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: dataManager, allowPaging: true,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID' },
                        { headerText: 'CustomerID', field: 'CustomerID' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                        { headerText: 'ShipCity', field: 'ShipCity' },
                    ],
                    dataBound: dataBound,
                    actionComplete: actionComplete,
                });
            gridObj.appendTo('#Grid');
        });

        it('promise test', () => {
            expect(dataManager.ready).not.toBeNull();
            expect(dataManager.dataSource.json.length).toBe(15);
        });

        it('Row count testing', () => {
            expect(gridObj.element.querySelectorAll('.e-row').length).toBe(12);
        });

        afterAll(() => {
            jasmine.Ajax.uninstall();
            remove(elem);
        });

    });

    describe('datamanager offline - failure testing', () => {
        let gridObj: Grid;
        let dataManager: any = new DataManager(data as JSON[]);
        dataManager.ready = {
            then: (args: any) => {
                return {
                    catch: (args: any) => {
                        {
                            args.call(this, {});
                        }
                    }
                };
            }
        };
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let actionComplete: (e?: Object) => void;
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            let actionFailure: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: dataManager, allowPaging: false,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID' },
                        { headerText: 'CustomerID', field: 'CustomerID' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                        { headerText: 'ShipCity', field: 'ShipCity' },
                    ],
                    dataBound: dataBound,
                    actionComplete: actionComplete,
                    actionFailure: actionFailure
                });
            gridObj.appendTo('#Grid');
        });

        it('Row count testing', () => {
            expect(gridObj.element.querySelectorAll('.e-row').length).toBe(0);
        });

        it('EJ2-7420- Get Column by field test', () => {
            expect((<any>gridObj.getDataModule()).getColumnByField('ShipCity').field).toBe('ShipCity');
        });

        afterAll(() => {
            remove(elem);
        });
    });
    describe('Custom Data Source =>', () => {
        let gridObj: Grid;
        let dataStateChange: (s?: DataStateChangeEventArgs) => void;
        let dataSourceChanged: (s?: DataSourceChangedEventArgs) => void;
        beforeAll((done: Function) => {
            let options: Object = {
                dataSource: { result : data.slice(0,6), count : data.length },
                allowSorting: true,
                allowGrouping: true,
                allowPaging: true,
                pageSettings: {pageSize: 6},
                toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true },
                columns: [
                    { field: 'OrderID', headerText: 'Order ID', textAlign: 'Right', width: 100, isPrimaryKey: true },
                    { field: 'CustomerID', headerText: 'Customer ID', width: 120 },
                    { field: 'Freight', headerText: 'Freight', textAlign: 'Right', width: 120, format: 'C2' },
                    { field: 'ShipCountry', headerText: 'Ship Country', width: 150 }
                ],
                dataStateChange: dataStateChange,
                dataSourceChanged: dataSourceChanged,
            };
            gridObj = createGrid(options, done);
        });
    //Local Custom Data Service
        it('Initial Page rendering ', (done: Function) => {
            dataStateChange = ( s: DataStateChangeEventArgs ): void => {
                expect(s.action.requestType).toBe('paging');
                expect(s.skip).toBe(12);
                expect(s.take).toBe(6);
                done();
            }
            gridObj.dataStateChange = dataStateChange;
            gridObj.dataSourceChanged = null;
            gridObj.goToPage(3);
        });
        it('Sorting in Custom Data Service =>', (done: Function) => {
            dataStateChange = ( s: DataStateChangeEventArgs ): void => {
                expect(s.action.requestType).toBe('sorting');
                expect(s.sorted[0].name).toBe('CustomerID');
                done();
            }
            gridObj.dataStateChange = dataStateChange;
            gridObj.dataSourceChanged = null;
            gridObj.sortColumn('CustomerID', 'Ascending', false);
        });
        it('Grouping in Custom Data Service =>', (done: Function) => {
            dataStateChange = ( s: DataStateChangeEventArgs ): void => {
                expect(s.group[0]).toBe('CustomerID');
                done();
            }
            gridObj.dataStateChange = dataStateChange;
            gridObj.dataSourceChanged = null;
            gridObj.groupModule.groupColumn('CustomerID');
        });
        it('Deleting a record =>', (done: Function) => {
            dataSourceChanged = ( s: DataSourceChangedEventArgs ): void => {
                expect(s.requestType).toBe('delete');
                gridObj.dataStateChange = null;
                done();
            }
            gridObj.dataSourceChanged = dataSourceChanged;
            gridObj.editModule.deleteRecord('OrderID', gridObj.currentViewData[2]);
        });
        afterAll((done) => {
            destroy(gridObj);
        });
     });
     describe('Custom Data Source with inline editing =>', () => {
        let gridObj: Grid;
        let dataStateChange: (s?: DataStateChangeEventArgs) => void;
        let dataSourceChanged: (s?: DataSourceChangedEventArgs) => void;
        beforeAll((done: Function) => {
            let options: Object = {
                dataSource: { result : data.slice(0,6), count : data.length },
                allowSorting: true,
                allowGrouping: true,
                allowPaging: true,
                pageSettings: {pageSize: 6},
                toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true },
                columns: [
                    { field: 'OrderID', headerText: 'Order ID', textAlign: 'Right', width: 100, isPrimaryKey: true },
                    { field: 'CustomerID', headerText: 'Customer ID', width: 120 },
                    { field: 'Freight', headerText: 'Freight', textAlign: 'Right', width: 120, format: 'C2' },
                    { field: 'ShipCountry', headerText: 'Ship Country', width: 150 }
                ],
                dataStateChange: dataStateChange,
                dataSourceChanged: dataSourceChanged,
            };
            gridObj = createGrid(options, done);
        });
        it('Editing a record =>', (done: Function) => {
            dataSourceChanged = ( s: DataSourceChangedEventArgs ): void => {
                expect(s.requestType).toBe('save');
                expect(s.action).toBe('edit');
                gridObj.dataStateChange = null;
                done();
            }
            gridObj.selectRow(0);
            gridObj.startEdit();
            (gridObj.element.querySelector('#' + gridObj.element.id + 'CustomerID') as any).value = 'updated';
            gridObj.dataSourceChanged = dataSourceChanged;
            gridObj.endEdit();
        });
        afterAll((done) => {
            destroy(gridObj);
        });
     });
     describe('Custom Data Source with Batch editing =>', () => {
        let gridObj: Grid;
        let dataStateChange: (s?: DataStateChangeEventArgs) => void;
        let dataSourceChanged: (s?: DataSourceChangedEventArgs) => void;
        beforeAll((done: Function) => {
            let options: Object = {
                dataSource: { result : data.slice(0,6), count : data.length },
                allowSorting: true,
                allowGrouping: true,
                allowPaging: true,
                pageSettings: {pageSize: 6},
                toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch'},
                columns: [
                    { field: 'OrderID', headerText: 'Order ID', textAlign: 'Right', width: 100, isPrimaryKey: true },
                    { field: 'CustomerID', headerText: 'Customer ID', width: 120 },
                    { field: 'Freight', headerText: 'Freight', textAlign: 'Right', width: 120, format: 'C2' },
                    { field: 'ShipCountry', headerText: 'Ship Country', width: 150 }
                ],
                dataStateChange: dataStateChange,
                dataSourceChanged: dataSourceChanged,
            };
            gridObj = createGrid(options, done);
        });
        it('Batch Editing a record =>', (done: Function) => {
            dataSourceChanged = ( s: DataSourceChangedEventArgs ): void => {
                expect(s.requestType).toBe('batchsave');
                gridObj.dataStateChange = null;
                done();
            }
            gridObj.dataSourceChanged = dataSourceChanged;
            gridObj.editModule.editCell(4, 'CustomerID');
            (gridObj.element.querySelector('#' + gridObj.element.id + 'CustomerID') as any).value = 'updated';
            gridObj.editModule.saveCell();
            gridObj.editModule.batchSave();
            (gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm')as any).querySelectorAll('button')[0].click();
        });
        afterAll((done) => {
            destroy(gridObj);
        });

    });
    describe('Multi Delete in a single request =>', () => {
        let gridObj: Grid;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            let options: Object = {
                dataSource: data.map(data => data),
                selectionSettings: { type: 'Multiple' },
                pageSettings: { pageSize: 6 },
                toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal' },
                columns: [
                    { field: 'OrderID', headerText: 'Order ID', textAlign: 'Right', width: 100, isPrimaryKey: true },
                    { field: 'CustomerID', headerText: 'Customer ID', width: 120 },
                    { field: 'Freight', headerText: 'Freight', textAlign: 'Right', width: 120, format: 'C2' },
                    { field: 'ShipCountry', headerText: 'Ship Country', width: 150 }
                ],
                actionComplete: actionComplete,
            };
            gridObj = createGrid(options, done);
        });
        it(' Multi Select and delete => ', (done: Function) => {
            actionComplete = (args?: any): void => {
                expect(args.requestType).toBe('delete');
                expect(args.data.length).toBe(2);
                done();
            }
            gridObj.actionComplete = actionComplete;
            gridObj.selectRows([2, 4]);
            gridObj.deleteRecord();
        });
        afterAll((done) => {
            destroy(gridObj);
        });
    });

});