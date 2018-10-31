/**
 * Test case for dataManager
 */
import { DataManager, ReturnOption, RequestOptions } from '../src/manager';
import { JsonAdaptor, RemoteSaveAdaptor, WebMethodAdaptor, UrlAdaptor } from '../src/adaptors';
import { ODataAdaptor, ODataV4Adaptor, WebApiAdaptor, CacheAdaptor } from '../src/adaptors';
import { Query, Predicate } from '../src/query';
import { DataUtil } from '../src/util';
import { Ajax } from '@syncfusion/ej2-base';
import { extend } from '@syncfusion/ej2-base';
import '../node_modules/es6-promise/dist/es6-promise';
function format(val: number, field: string): any {
    if (val === 10250) {
        field = 'N';
    }
    return field;
}
describe('Json Adaptor', () => {
    let data: JSON[] = ([
        { OrderID: 10248, CustomerID: 'VINET', EmployeeID: 5, Freight: 32.38, Guid: 'f89dee73-af9f-4cd4-b330-db93c25ff3c7' },
        { OrderID: 10249, CustomerID: 'AANAR', EmployeeID: 2, Freight: 11.61, Guid: 'db2d2186-1c29-4d1e-88ef-a127f521b9c6' },
        { OrderID: 10250, CustomerID: 'VICTE', EmployeeID: 7, Freight: 65.83, Guid: '6F9619FF-8B86-D011-B42D-00C04FC964FF' },
        { OrderID: 10251, CustomerID: 'VINET', EmployeeID: 7, Freight: 70.63, Guid: 'f89dee73-af9f-4cd4-b330-db93c25ff3c8' },
        { OrderID: 10252, CustomerID: 'SUPRD', EmployeeID: 6, Freight: 45.45, Guid: 'f89dee73-af9f-4cd4-b330-db93c25ff3c9' }
    ]as Object) as JSON[];
    let crudData: JSON[] = ([
        { OrderID: 10248, CustomerID: 'VINET', EmployeeID: 5, Freight: 32.38 },
        { OrderID: 10249, CustomerID: 'AANAR', EmployeeID: 2, Freight: 11.61 },
        { OrderID: 10250, CustomerID: 'VICTE', EmployeeID: 7, Freight: 65.83 },
        { OrderID: 10251, CustomerID: 'VINET', EmployeeID: 7, Freight: 70.63 },
        { OrderID: 10252, CustomerID: 'SUPRD', EmployeeID: 6, Freight: 45.45 }
    ] as Object) as JSON[];
    let aggData: JSON[] = ([
        { OrderID: 10248, CustomerID: 'VINET', EmployeeID: 5, Freight: 32.38, Verified: true },
        { OrderID: 10249, CustomerID: 'AANAR', EmployeeID: 2, Freight: 11.61, Verified: false },
        { OrderID: 10250, CustomerID: 'VICTE', EmployeeID: 7, Freight: 65.83, Verified: true },
        { OrderID: 10251, CustomerID: 'SUPRD', EmployeeID: 7, Freight: 70.63, Verified: false }
    ]as Object) as JSON[];
    let dataManager: DataManager;
    describe('To check DataManager', () => {
        it('generated data properly', () => {
            dataManager = new DataManager(data, new Query(), new JsonAdaptor);
            expect(dataManager.executeLocal().length).toBe(data.length);
        });
        describe('batchRequst method', () => {
            let result: any;
            let changes: any = { changedRecords: [], addedRecords: [], deletedRecords: [] };
            beforeAll((done: Function) => {
                changes.changedRecords.push({ OrderID: 10250, CustomerID: 'VICTE', EmployeeID: 1, Freight: 65.83 });
                changes.addedRecords.push({ OrderID: 10253, CustomerID: 'ANNARS', EmployeeID: 4, Freight: 22.33 });
                changes.deletedRecords.push({ OrderID: 10248, CustomerID: 'VINET', EmployeeID: 5, Freight: 32.38 });
                dataManager = new DataManager(crudData, new Query(), new JsonAdaptor);
                dataManager.dataSource.key = 'OrderID';
                dataManager.saveChanges(changes);
                result = dataManager.executeLocal();
                done();
            });
            it('check length of the data', () => {
                expect(result.length).toBe(5);
            });
            it('check data added properly', () => {
                expect(result[4]["OrderID"]).toBe(10253);
            });
            it('check data cheanges reflected properly', () => {
                expect(result[1]["EmployeeID"]).toBe(1);
            });
            it('check data deleted properly', () => {
                expect(result[0]).not.toEqual(data[0]);
            });
        });
        describe('batchRequst method with query', () => {
            let result: any;
            let changes: any = { changedRecords: [], addedRecords: [], deletedRecords: [] };
            beforeAll((done: Function) => {
                changes.changedRecords.push({ OrderID: 10250, CustomerID: 'VICTE', EmployeeID: 2, Freight: 65.83 });
                dataManager = new DataManager(crudData, new Query(), new JsonAdaptor);
                dataManager.dataSource.key = 'OrderID';
                dataManager.saveChanges(changes, 'OrderID', new Query());
                result = dataManager.executeLocal();
                done();
            });
            it('check length of the data', () => {
                expect(result.length).toBe(5);
            });
            it('check data added properly', () => {
                expect(result[4]["OrderID"]).toBe(10253);
            });
            it('check data cheanges reflected properly', () => {
                expect(result[1]["EmployeeID"]).toBe(2);
            });
            it('check data deleted properly', () => {
                expect(result[0]).not.toEqual(data[0]);
            });
        });
        describe('page method', () => {
            it('check length of the data', () => {
                dataManager = new DataManager(data, new Query().page(2, 3), new JsonAdaptor);
                expect(dataManager.executeLocal().length).toBe(2);
            });
            it('check data paging properly', () => {
                let result: any = dataManager.executeLocal();
                expect(result[0]).toEqual(data[3]);
            });
            it('check data paging without data', () => {
                dataManager = new DataManager([], new Query().page(1, 2), new JsonAdaptor);
                expect(dataManager.executeLocal().length).toEqual(0);
            });
        });
        describe('range method', () => {
            it('check length of the data', () => {
                dataManager = new DataManager(data, new Query().page(1, 2), new JsonAdaptor);
                expect(dataManager.executeLocal().length).toBe(2);
            });
            it('check data paging properly', () => {
                let result: any = dataManager.executeLocal();
                expect(result[0]).toEqual(data[0]);
                expect(result[1]).toEqual(data[1]);
            });
            it('check data range without data', () => {
                dataManager = new DataManager([], new Query().range(1, 2), new JsonAdaptor);
                expect(dataManager.executeLocal().length).toEqual(0);
            });
        });
        describe('where method', () => {
            it('check length of the data', () => {
                dataManager = new DataManager(data, new Query().where('CustomerID', 'equal', 'VINET'), new JsonAdaptor);
                expect(dataManager.executeLocal().length).toBe(2);
            });
            it('check filtered data without data in dataManager', () => {
                dataManager = new DataManager([], new Query().where('CustomerID', 'equal', 'VINET'), new JsonAdaptor);
                expect(dataManager.executeLocal().length).toEqual(0);
            });
        });
        describe('aggregate method', () => {
            let result: any;
            describe('sum method', () => {
                it('check length of the data', () => {
                    dataManager = new DataManager(aggData, new Query().aggregate('sum', 'Freight').requiresCount(), new JsonAdaptor);
                    result = dataManager.executeLocal();
                    expect(result.aggregates['Freight - sum']).toBe(180.45);
                });
                it('check aggregate data without data', () => {
                    dataManager = new DataManager([], new Query().aggregate('sum', 'Freight').requiresCount(), new JsonAdaptor);
                    result = dataManager.executeLocal();
                    expect(result.aggregates['Freight - sum']).toBeNull();
                });
            });
            describe('average method', () => {
                it('check length of the data', () => {
                    dataManager = new DataManager(aggData, new Query().aggregate('average', 'Freight').requiresCount(), new JsonAdaptor);
                    result = dataManager.executeLocal();
                    expect(result.aggregates['Freight - average']).toBe(45.1125);
                });
                it('check aggregate data without data', () => {
                    dataManager = new DataManager([], new Query().aggregate('average', 'Freight').requiresCount(), new JsonAdaptor);
                    result = dataManager.executeLocal();
                    expect(result.aggregates['Freight - average']).toBeNull();
                });
            });
            describe('minimum method', () => {
                it('check length of the data', () => {
                    dataManager = new DataManager(aggData, new Query().aggregate('min', 'Freight').requiresCount(), new JsonAdaptor);
                    result = dataManager.executeLocal();
                    expect(result.aggregates['Freight - min']).toBe(11.61);
                });
                it('check aggregate data without data', () => {
                    dataManager = new DataManager([], new Query().aggregate('min', 'Freight').requiresCount(), new JsonAdaptor);
                    result = dataManager.executeLocal();
                    expect(result.aggregates['Freight - min']).toBeNull();
                });
            });
            describe('maximum method', () => {
                it('check length of the data', () => {
                    dataManager = new DataManager(aggData, new Query().aggregate('max', 'Freight').requiresCount(), new JsonAdaptor);
                    result = dataManager.executeLocal();
                    expect(result.aggregates['Freight - max']).toBe(70.63);
                });
                it('check aggregate data without data', () => {
                    dataManager = new DataManager([], new Query().aggregate('max', 'Freight').requiresCount(), new JsonAdaptor);
                    result = dataManager.executeLocal();
                    expect(result.aggregates['Freight - max']).toBeNull();
                });
            });
            describe('count method', () => {
                it('check length of the data', () => {
                    dataManager = new DataManager(aggData, new Query().aggregate('count', 'Freight').requiresCount(), new JsonAdaptor);
                    result = dataManager.executeLocal();
                    expect(result.aggregates['Freight - count']).toBe(4);
                });
                it('check aggregate data without data', () => {
                    dataManager = new DataManager([], new Query().aggregate('count', 'Freight').requiresCount(), new JsonAdaptor);
                    result = dataManager.executeLocal();
                    expect(result.aggregates['Freight - count']).toBeNull();
                });
            });
            describe('truecount method', () => {
                it('check length of the data', () => {
                    dataManager = new DataManager(aggData, new Query().aggregate('truecount', 'Verified').requiresCount(), new JsonAdaptor);
                    result = dataManager.executeLocal();
                    expect(result.aggregates['Verified - truecount']).toBe(2);
                });
                it('check aggregate data without data', () => {
                    dataManager = new DataManager([], new Query().aggregate('truecount', 'Verified').requiresCount(), new JsonAdaptor);
                    result = dataManager.executeLocal();
                    expect(result.aggregates['Verified - truecount']).toBeNull();
                });
            });
            describe('falsecount method', () => {
                it('check length of the data', () => {
                    dataManager =
                        new DataManager(aggData, new Query().aggregate('falsecount', 'Verified').requiresCount(), new JsonAdaptor);
                    result = dataManager.executeLocal();
                    expect(result.aggregates['Verified - falsecount']).toBe(2);
                });
                it('check aggregate data without data', () => {
                    dataManager = new DataManager([], new Query().aggregate('falsecount', 'Verified').requiresCount(), new JsonAdaptor);
                    result = dataManager.executeLocal();
                    expect(result.aggregates['Verified - falsecount']).toBeNull();
                });
            });
        });
        describe('search method', () => {
            it('check length of the data', () => {
                dataManager = new DataManager(data, new Query().search(7, 'EmployeeID', 'equal'), new JsonAdaptor);
                expect(dataManager.executeLocal().length).toBe(2);
            });
            it('check length of the data', () => {
                dataManager = new DataManager(data, new Query().
                    search('f89dee73-af9f-4cd4-b330-db93c25ff3c9', 'Guid', 'equal'), new JsonAdaptor);
                expect(dataManager.executeLocal().length).toBe(1);
            });
            it('check searched data without data', () => {
                dataManager = new DataManager([], new Query().search(7, 'EmployeeID', 'equal'), new JsonAdaptor);
                expect(dataManager.executeLocal().length).toEqual(0);
            });
            it('check searched data without field name', () => {
                dataManager = new DataManager(data, new Query().search(7, [], 'equal'), new JsonAdaptor);
                expect(dataManager.executeLocal().length).toEqual(2);
            });
        });
        describe('sortyBy method', () => {
            it('check length of the data', () => {
                dataManager = new DataManager(data, new Query().sortBy('Freight', 'descending'), new JsonAdaptor);
                expect(dataManager.executeLocal().length).toBe(5);
            });
            it('check sorted data without data in dataManager', () => {
                dataManager = new DataManager([], new Query().sortBy('Freight', 'descending'), new JsonAdaptor);
                expect(dataManager.executeLocal().length).toEqual(0);
            });
            it('check sorted data without field name', () => {
                dataManager = new DataManager(data, new Query().sortBy(null, 'descending'), new JsonAdaptor);
                expect(dataManager.executeLocal().length).toEqual(5);
            });
            it('check sorted data with array of field name', () => {
                dataManager = new DataManager(data, new Query().sortBy(['Freight'], 'descending'), new JsonAdaptor);
                expect(dataManager.executeLocal().length).toEqual(5);
            });
            it('check sorted data with array of empty field', () => {
                dataManager = new DataManager(data, new Query().sortBy([null, 'Freight desc']), new JsonAdaptor);
                expect(dataManager.executeLocal().length).toEqual(5);
            });
            it('check sorted data with guid field descending', () => {
                dataManager = new DataManager(data, new Query().sortBy('Guid', 'descending'), new JsonAdaptor);
                expect(dataManager.executeLocal().length).toEqual(5);
            });
            it('check sorted data with guid field ascending', () => {
                dataManager = new DataManager(data, new Query().sortBy('Guid', 'ascending'), new JsonAdaptor);
                expect(dataManager.executeLocal().length).toEqual(5);
            });
        });
        describe('group method', () => {
            it('check length of the data', () => {
                dataManager = new DataManager(data, new Query().group('EmployeeID'), new JsonAdaptor);
                expect(dataManager.executeLocal().length).toBe(4);
            });
            it('check length of the data when using guid', () => {
                dataManager = new DataManager(data, new Query().group('Guid'), new JsonAdaptor);
                expect(dataManager.executeLocal().length).toBe(5);
            });
            it('check length of the data when using guid with multiple group', () => {
                dataManager = new DataManager(data, new Query().group('Guid').group('EmployeeID').group('CustomerID'), new JsonAdaptor);
                expect(dataManager.executeLocal().length).toBe(1);
            });
            it('check searched data without data', () => {
                dataManager = new DataManager([], new Query().group('EmployeeID'), new JsonAdaptor);
                expect(dataManager.executeLocal().length).toEqual(0);
            });
            it('check length of the data', () => {
                dataManager = new DataManager(
                    data, new Query().group('EmployeeID').aggregate('sum', 'Freight').requiresCount(), new JsonAdaptor);
                let result: any = dataManager.executeLocal();
                expect(result.result.length).toBe(4);
                expect(result.result[0].aggregates['Freight - sum']).toBe(11.61);
            });
            it('check length of the data with function param', () => {
                dataManager = new DataManager(data, new Query().group('OrderID', format), new JsonAdaptor);
                expect(dataManager.executeLocal().length).toBe(2);
            });
            it('check length of the data when using employee ID with function param', () => {
                dataManager = new DataManager(data, new Query().group('EmployeeID', format), new JsonAdaptor);
                expect(dataManager.executeLocal().length).toBe(1);
            });
            it('check length of the data when using guid with multiple group with function param', () => {
                dataManager = new DataManager(data, new Query().group('Guid', format).group('EmployeeID', format).group('CustomerID', format), new JsonAdaptor);
                expect(dataManager.executeLocal().length).toBe(1);
            });
            it('check searched data without data with function param', () => {
                dataManager = new DataManager([], new Query().group('EmployeeID', format), new JsonAdaptor);
                expect(dataManager.executeLocal().length).toEqual(0);
            });
            it('check length of the data', () => {
                dataManager = new DataManager(
                    data, new Query().group('OrderID', format).aggregate('sum', 'Freight').requiresCount(), new JsonAdaptor);
                let result: any = dataManager.executeLocal();
                expect(result.result.length).toBe(2);
                expect(result.result[0].aggregates['Freight - sum']).toBe(160.07);
            });
        });
        describe('take method', () => {
            it('check length of the data', () => {
                dataManager = new DataManager(data, new Query().take(3), new JsonAdaptor);
                expect(dataManager.executeLocal().length).toBe(3);
            });
            it('check take without data', () => {
                dataManager = new DataManager([], new Query().take(3), new JsonAdaptor);
                expect(dataManager.executeLocal().length).toEqual(0);
            });
        });
        describe('skip method', () => {
            it('check length of the data', () => {
                dataManager = new DataManager(data, new Query().skip(3), new JsonAdaptor);
                expect(dataManager.executeLocal().length).toBe(2);
            });
            it('check skip without data', () => {
                dataManager = new DataManager([], new Query().skip(3), new JsonAdaptor);
                expect(dataManager.executeLocal().length).toEqual(0);
            });
        });
        describe('select method', () => {
            it('check length of the data', () => {
                dataManager = new DataManager(data, new Query().select(['OrderID', 'CustomerID', 'Freight']), new JsonAdaptor);
                expect(dataManager.executeLocal().length).toBe(5);
            });
            it('check selected field without data', () => {
                dataManager = new DataManager([], new Query().select(['OrderID', 'CustomerID', 'Freight']), new JsonAdaptor);
                expect(dataManager.executeLocal().length).toEqual(0);
            });
        });
        describe('insert method', () => {
            let record: Object = { OrderID: 10254, CustomerID: 'ANNARS', EmployeeID: 4, Freight: 22.33 };
            let result: Object[];
            beforeAll((done: Function) => {
                dataManager = new DataManager(crudData, new Query(), new JsonAdaptor);
                dataManager.insert(record);
                result = dataManager.executeLocal();
                done();
            });
            it('check length of the data', () => {
                expect(result.length).toBe(6);
            });
            it('check data added properly', () => {
                expect((<{ [key: string]: any }>result[5])["OrderID"]).toBe(10254);
            });
        });
        describe('insert method with query', () => {
            let record: Object = { OrderID: 10255, CustomerID: 'ANNARS', EmployeeID: 4, Freight: 22.33 };
            let result: Object[];
            beforeAll((done: Function) => {
                dataManager = new DataManager(crudData, new Query(), new JsonAdaptor);
                dataManager.insert(record, new Query());
                result = dataManager.executeLocal();
                done();
            });
            it('check length of the data', () => {
                expect(result.length).toBe(7);
            });
            it('check data added properly', () => {
                expect((<{ [key: string]: any }>result[6])["OrderID"]).toBe(10255);
            });
        });
        describe('update method', () => {
            let record: Object = { OrderID: 10254, CustomerID: 'ANNARS', EmployeeID: 3, Freight: 22.33 };
            let result: Object[];
            beforeAll((done: Function) => {
                dataManager = new DataManager(crudData, new Query(), new JsonAdaptor);
                dataManager.update('OrderID', record, 'crudData');
                result = dataManager.executeLocal();
                done();
            });
            it('check length of the data', () => {
                expect(result.length).toBe(7);
            });
            it('check data updated properly', () => {
                expect((<{ [key: string]: any }>result[5])["EmployeeID"]).toBe(3);
            });
            it('check data updated when empty dataSource', () => {
                dataManager = new DataManager([], new Query(), new JsonAdaptor);
                dataManager.update('OrderID', 10249, 'crudData');
                result = dataManager.executeLocal();
                expect(result.length).toBe(0);
            });
        });
        describe('update method with query', () => {
            let record: Object = { OrderID: 10255, CustomerID: 'ANNARS', EmployeeID: 3, Freight: 22.33 };
            let result: Object[];
            beforeAll((done: Function) => {
                dataManager = new DataManager(crudData, new Query(), new JsonAdaptor);
                dataManager.update('OrderID', record, new Query());
                result = dataManager.executeLocal();
                done();
            });
            it('check length of the data', () => {
                expect(result.length).toBe(7);
            });
            it('check data updated properly', () => {
                expect((<{ [key: string]: any }>result[5])["EmployeeID"]).toBe(3);
            });
        });
        describe('remove method', () => {
            let result: Object[];
            beforeAll((done: Function) => {
                dataManager = new DataManager(crudData, new Query(), new JsonAdaptor);
                dataManager.remove('OrderID', 10249, 'crudData');
                result = dataManager.executeLocal();
                done();
            });
            it('check length of the data', () => {
                expect(result.length).toBe(6);
            });
            it('check data removed properly', () => {
                expect((<{ [key: string]: any }>result[0])["OrderID"]).toBe(10250);
            });
            it('check data removed properly when pass object of data', () => {
                dataManager.remove('OrderID', { OrderID: 10254, CustomerID: 'ANNARS', EmployeeID: 4, Freight: 22.33 });
                result = dataManager.executeLocal();
                expect(result.length).toBe(5);
            });
            it('check data removed when empty dataSource', () => {
                dataManager = new DataManager([], new Query(), new JsonAdaptor);
                dataManager.remove('OrderID', 10249, 'crudData');
                result = dataManager.executeLocal();
                expect(result.length).toBe(0);
            });
        });
        describe('remove method with query', () => {
            let result: Object[];
            beforeAll((done: Function) => {
                dataManager = new DataManager(crudData, new Query(), new JsonAdaptor);
                dataManager.remove('OrderID', 10255, new Query());
                result = dataManager.executeLocal();
                done();
            });
            it('check length of the data', () => {
                expect(result.length).toBe(4);
            });
        });
        describe('insert in position', () => {
            let record: Object = { OrderID: 10255, CustomerID: 'ANNARS', EmployeeID: 4, Freight: 22.33 };
            let result: Object[];
            beforeAll((done: Function) => {
                dataManager = new DataManager(crudData, new Query(), new JsonAdaptor);
                dataManager.insert(record, new Query(), new Query(), 1);
                result = dataManager.executeLocal();
                done();
            });
            it('check length of the data', () => {
                expect(result.length).toBe(5);
            });
            it('check data added properly', () => {
                expect((<{ [key: string]: any }>result[1])["OrderID"]).toBe(10255);
            });
        });
    });
});

describe('OData Adaptor', () => {
    let result: Object[]; let request: JasmineAjaxRequest;
    type ResponseType = { result: Object[], count: number | string };
    type MockAjaxReturn = { promise: Promise<Object>, request: JasmineAjaxRequest };
    let dataManager: DataManager;
    let data: JSON[] = ([
        { OrderID: 10248, CustomerID: 'VINET', EmployeeID: 5, Freight: 32.38, Guid: 'f89dee73-af9f-4cd4-b330-db93c25ff3c7' },
        { OrderID: 10249, CustomerID: 'AANAR', EmployeeID: 2, Freight: 11.61, Guid: 'db2d2186-1c29-4d1e-88ef-a127f521b9c6' },
        { OrderID: 10250, CustomerID: 'VICTE', EmployeeID: 7, Freight: 65.83, Guid: '6F9619FF-8B86-D011-B42D-00C04FC964FF' },
        { OrderID: 10251, CustomerID: 'VINET', EmployeeID: 7, Freight: 70.63, Guid: 'f89dee73-af9f-4cd4-b330-db93c25ff3c8' },
        { OrderID: 10252, CustomerID: 'SUPRD', EmployeeID: 6, Freight: 45.45, Guid: 'f89dee73-af9f-4cd4-b330-db93c25ff3c9' }
    ]as Object) as JSON[];
    let crudData: JSON[] = ([
        { OrderID: 10248, CustomerID: 'VINET', EmployeeID: 5, Freight: 32.38 },
        { OrderID: 10249, CustomerID: 'AANAR', EmployeeID: 2, Freight: 11.61 },
        { OrderID: 10250, CustomerID: 'VICTE', EmployeeID: 7, Freight: 65.83 },
        { OrderID: 10251, CustomerID: 'VINET', EmployeeID: 7, Freight: 70.63 },
        { OrderID: 10252, CustomerID: 'SUPRD', EmployeeID: 6, Freight: 45.45 }
    ] as Object) as JSON[];
    let aggData: JSON[] = ([
        { OrderID: 10248, CustomerID: 'VINET', EmployeeID: 5, Freight: 32.38, Verified: true },
        { OrderID: 10249, CustomerID: 'AANAR', EmployeeID: 2, Freight: 11.61, Verified: false },
        { OrderID: 10250, CustomerID: 'VICTE', EmployeeID: 7, Freight: 65.83, Verified: true },
        { OrderID: 10251, CustomerID: 'SUPRD', EmployeeID: 7, Freight: 70.63, Verified: false }
    ] as Object) as JSON[];

    let mockAjax: Function = (data: { [o: string]: Object | Object[] } | Object[], query: Query, response?: Object):
        MockAjaxReturn => {
        jasmine.Ajax.install();
        dataManager = new DataManager({
            url: '/api/Employees',
            adaptor: new ODataAdaptor
        });
        let prom: Promise<Object> = dataManager.executeQuery(query);
        let defaults: Object = {
            'status': 200,
            'contentType': 'application/json',
            'responseText': JSON.stringify(data)
        };
        let responses: Object = {};
        request = jasmine.Ajax.requests.mostRecent();
        extend(responses, defaults, response);
        request.respondWith(responses);
        return {
            promise: prom,
            request: request
        };
    };

    describe('basic request with no  - Verbose response', () => {
        let result: ResponseType; let mAjax: MockAjaxReturn;
        beforeAll((done: Function) => {
            mAjax = mockAjax({ d: data }, new Query());
            mAjax.promise.then((e) => {
                result = <ResponseType>e;
                done();
            });
        });
        afterAll(() => {
            jasmine.Ajax.uninstall();
        });
        it('basic request - Verbose response - check url', () => {
            expect(request.url).toBe('/api/Employees/');
        });

        it('basic request - Verbose response - response - data check', () => {
            expect(result.result.length).toBe(5);
        });
        it('basic request - - Verbose response - count value check', () => {
            expect(result.count).toBe(0);
        });
    });
    describe('basic request with no query - JSON Light response', () => {
        let result: ResponseType; let mAjax: MockAjaxReturn; let request: JasmineAjaxRequest;
        beforeAll((done: Function) => {
            mAjax = mockAjax({ "value": data }, new Query(), { 'responseHeaders': { "DataServiceVersion": "3.0", "Content-Type": "application/json" } });
            mAjax.promise.then((e: ResponseType) => {
                result = e;
                done();
            });
            request = mAjax.request;
        });
        afterAll(() => {
            jasmine.Ajax.uninstall();
        });
        it('basic request - JSON Light response - check url', () => {
            expect(request.url).toBe('/api/Employees/');
        });
        it('basic request - JSON Light response - data check', () => {
            expect(result.result.length).toBe(5);
        });
        it('basic request - JSON Light response - count value check', () => {
            expect(result.count).toBe(0);
        });
    });
    describe('basic request with no query - Failed request', () => {
        let request: JasmineAjaxRequest; let error: { message: string }; let mAjax: MockAjaxReturn;
        beforeAll((done: Function) => {
            mAjax = mockAjax({ message: "Dude something went wrong..!!" }, new Query(), { status: 500 });
            mAjax.promise.catch((e) => {
                error = JSON.parse(e.error.response);
                done();
            });
        });
        afterAll(() => {
            jasmine.Ajax.uninstall();
        });
        it('basic request - Failed request - check url', () => {
            expect(error.message).toBe('Dude something went wrong..!!');
        });
    });
    describe('basic request with requiresCount - Verbose response', () => {
        let request: JasmineAjaxRequest; let result: ReturnOption; let res: Object[]; let mAjax: MockAjaxReturn;
        beforeAll((done: Function) => {
            mAjax = mockAjax({ d: { result: data, count: 5 } }, new Query().requiresCount());
            mAjax.promise.then((e: ReturnOption) => {
                result = e;
                res = <Object[]>e.result;
                done();
            });
            request = mAjax.request;
        });
        afterAll(() => {
            jasmine.Ajax.uninstall();
        });
        it('requiresCount - Verbose response - check url', () => {
            expect(request.url).toBe('/api/Employees/?$inlinecount=allpages');
        });

        it('requiresCount - Verbose response - data check', () => {
            expect(res.length).toBe(5);
        });
        it('requiresCount - Verbose response - count value check', () => {
            expect(result.count).toBe(5);
        });
    });
    describe('basic request with requiresCount - JSON Light response', () => {
        let request: JasmineAjaxRequest; let result: ReturnOption; let res: Object[]; let mAjax: MockAjaxReturn;
        beforeAll((done: Function) => {
            mAjax = mockAjax({ "value": data, "odata.count": "5" }, new Query().requiresCount(), { 'responseHeaders': { "DataServiceVersion": "3.0", "Content-Type": "application/json" } });
            mAjax.promise.then((e: ReturnOption) => {
                result = e;
                res = <Object[]>e.result;
                done();
            });
            request = mAjax.request;
        });
        afterAll(() => {
            jasmine.Ajax.uninstall();
        });
        it('requiresCount - JSON Light response - check url', () => {
            expect(request.url).toBe('/api/Employees/?$inlinecount=allpages');
        });

        it('requiresCount - JSON Light response - data check', () => {
            expect(res.length).toBe(5);
        });
        it('requiresCount - JSON Light response - count value check', () => {
            expect(result.count).toBe(5);
        });
    });
    describe('requireFormat check', () => {
        let request: JasmineAjaxRequest;
        beforeAll((done: Function) => {
            jasmine.Ajax.install();
            dataManager = new DataManager({
                url: '/api/Employees',
                adaptor: new ODataAdaptor,
                requiresFormat: true
            });
            let prom: Promise<Object> = dataManager.executeQuery(new Query());
            let result: RequestOptions;
            request = jasmine.Ajax.requests.mostRecent();
            request.respondWith({
                'status': 200,
                'contentType': 'application/json',
                'responseText': JSON.stringify({ d: data })
            });
            prom.then((e: RequestOptions) => {
                this.result = e.result;
                done();
            });
        });
        afterAll(() => {
            jasmine.Ajax.uninstall();
        });
        it('requireFormat - request URL check', () => {
            expect(request.url).toBe("/api/Employees/?$format=json");
        });
    });
    describe('page method', () => {
        let request: JasmineAjaxRequest; let result: ReturnOption;
        beforeAll((done: Function) => {
            jasmine.Ajax.install();
            dataManager = new DataManager({
                url: '/api/Employees',
                adaptor: new ODataAdaptor
            });
            let prom: Promise<Object> = dataManager.executeQuery(new Query().page(1, 2));
            request = jasmine.Ajax.requests.mostRecent();
            request.respondWith({
                'status': 200,
                'contentType': 'application/json',
                'responseText': JSON.stringify({ d: data.slice(0, 2) })
            });
            prom.then((e: ReturnOption) => {
                this.result = e;
                done();
            });
        });
        afterAll(() => {
            jasmine.Ajax.uninstall();
        });

        it("Page method url check", () => {
            expect(request.url).toBe("/api/Employees/?$skip=0&$top=2");
        });
        it("Page method data check", () => {
            expect(this.result.result.length).toBe(2);
        });
        it("Page method skip check", () => {
            expect(this.result.result[0]["OrderID"]).toEqual(10248);
        });
    });
    describe('range method', () => {
        let result: ResponseType; let mAjax: MockAjaxReturn; let req: JasmineAjaxRequest;
        beforeAll((done: Function) => {
            mAjax = mockAjax({ d: data.slice(1, 4) }, new Query().range(1, 4));
            mAjax.promise.then((e: ResponseType) => {
                result = e;
                done();
            });
            req = mAjax.request;
        });
        it('Range method - url check', () => {
            expect(req.url).toBe("/api/Employees/?$skip=1&$top=3");
        });
        it('Range method - data length check', () => {
            expect(result.result.length).toBe(3);
        });
        afterAll(() => {
            jasmine.Ajax.uninstall();
        });
    });
    describe('where method', () => {

        let dataMock = (field: string, operator: string, val: any, icase: boolean): Object[] => {
            let fn: { [x: string]: Function } = <{ [x: string]: Function }>DataUtil.fnOperators;
            return data.filter((o: { [y: string]: any }) => {
                return fn[operator](o[field], val, icase);
            });
        }

        describe("where basic check - ignoreCase - true", () => {
            let result: ResponseType; let mAjax: MockAjaxReturn; let request: JasmineAjaxRequest;
            beforeAll((done: Function) => {
                mAjax = mockAjax({ d: dataMock("CustomerID", "equal", "VINET", true) },
                    new Query().where('CustomerID', 'equal', 'VINET', true));
                mAjax.promise.then((e: ResponseType) => {
                    result = e;
                    done();
                });
                request = mAjax.request;
            });

            afterAll(() => {
                jasmine.Ajax.uninstall();
            });

            it("where method - url check", () => {
                expect(request.url).toBe("/api/Employees/?$filter=tolower(CustomerID) eq 'vinet'");
            });
            it('generated data properly', () => {
                expect(result.result.length).toBe(2);
            });
            it('To check filtered properly', () => {
                expect((result.result[0] as { [key: string]: any })["CustomerID"]).toEqual('VINET');
                expect((result.result[1] as { [key: string]: any })["CustomerID"]).toEqual('VINET');
            });
        });
        describe("where basic check - ignoreCase - false", () => {
            let result: ResponseType; let mAjax: MockAjaxReturn; let request: JasmineAjaxRequest;
            beforeAll((done: Function) => {
                mAjax = mockAjax({ d: dataMock("CustomerID", "equal", "VINET", false) },
                    new Query().where('CustomerID', 'equal', 'VINET', false));
                mAjax.promise.then((e: ResponseType) => {
                    result = e;
                    done();
                });
                request = mAjax.request;
            });

            afterAll(() => {
                jasmine.Ajax.uninstall();
            });

            it("where method - url check", () => {
                expect(request.url).toBe("/api/Employees/?$filter=CustomerID eq 'VINET'");
            });
            it('generated data properly', () => {
                expect(result.result.length).toBe(2);
            });
            it('To check filtered properly', () => {
                expect(result.result[0]["CustomerID"]).toEqual('VINET');
                expect(result.result[1]["CustomerID"]).toEqual('VINET');
            });
        });
        describe("where basic check - ignoreCase in number value  - true", () => {
            let result: ResponseType; let mAjax: MockAjaxReturn; let request: JasmineAjaxRequest;
            beforeAll((done: Function) => {
                mAjax = mockAjax({ d: dataMock("OrderID", 'equal', 10248, true) },
                    new Query().where('OrderID', 'equal', 10248, true));
                mAjax.promise.then((e: ResponseType) => {
                    result = e;
                    done();
                });
                request = mAjax.request;
            });

            afterAll(() => {
                jasmine.Ajax.uninstall();
            });

            it("where method - url check", () => {
                expect(request.url).toBe("/api/Employees/?$filter=OrderID eq 10248");
            });
            it('generated data properly', () => {
                expect(result.result.length).toBe(1);
            });
            it('To check filtered properly', () => {
                expect(result.result[0]["OrderID"]).toEqual(10248);
            });
        });
        describe("where basic check - ignoreCase in number value - false", () => {
            let result: ResponseType; let mAjax: MockAjaxReturn; let request: JasmineAjaxRequest;
            beforeAll((done: Function) => {
                mAjax = mockAjax({ d: dataMock("OrderID", 'equal', 10248, false) },
                    new Query().where('OrderID', 'equal', 10248, false));
                mAjax.promise.then((e: ResponseType) => {
                    result = e;
                    done();
                });
                request = mAjax.request;
            });

            afterAll(() => {
                jasmine.Ajax.uninstall();
            });

            it("where method - url check", () => {
                expect(request.url).toBe("/api/Employees/?$filter=OrderID eq 10248");
            });
            it('generated data properly', () => {
                expect(result.result.length).toBe(1);
            });
            it('To check filtered properly', () => {
                expect(result.result[0]["OrderID"]).toEqual(10248);
            });
        });
        describe('startswith filter - ignoreCase - false', () => {
            let result: ResponseType; let mAjax: MockAjaxReturn; let request: JasmineAjaxRequest;
            beforeAll((done: Function) => {
                mAjax = mockAjax({ d: dataMock('CustomerID', 'startswith', 'vi', false) },
                    new Query().where('CustomerID', 'startswith', 'vi', false));
                mAjax.promise.then((e: ResponseType) => {
                    result = e;
                    done();
                });
                request = mAjax.request;
            });

            afterAll(() => {
                jasmine.Ajax.uninstall();
            });

            it("where method - startswith - url check", () => {
                expect(request.url).toBe("/api/Employees/?$filter=startswith(CustomerID,'vi')");
            });
            it('where method - startswith - data check', () => {
                expect(result.result.length).toBe(0);
            });
        });
        describe('startswith filter - ignoreCase - true', () => {
            let result: ResponseType; let mAjax: MockAjaxReturn; let request: JasmineAjaxRequest;
            beforeAll((done: Function) => {
                mAjax = mockAjax({ d: dataMock('CustomerID', 'startswith', 'vi', true) },
                    new Query().where('CustomerID', 'startswith', 'vi', true));
                mAjax.promise.then((e: ResponseType) => {
                    result = e;
                    done();
                });
                request = mAjax.request;
            });

            afterAll(() => {
                jasmine.Ajax.uninstall();
            });

            it("where method - startswith - url check", () => {
                expect(request.url).toBe("/api/Employees/?$filter=startswith(tolower(CustomerID),'vi')");
            });
            it('where method - startswith - data check', () => {
                expect(result.result.length).toBe(3);
            });
        });
        describe('endswith filter - ignoreCase - false', () => {
            let result: ResponseType; let mAjax: MockAjaxReturn; let request: JasmineAjaxRequest;
            beforeAll((done: Function) => {
                mAjax = mockAjax({ d: dataMock('CustomerID', 'endswith', 'ET', false) },
                    new Query().where('CustomerID', 'endswith', 'ET', false));
                mAjax.promise.then((e: ResponseType) => {
                    result = e;
                    done();
                });
                request = mAjax.request;
            });

            afterAll(() => {
                jasmine.Ajax.uninstall();
            });

            it("where method - endswith - url check", () => {
                expect(request.url).toBe("/api/Employees/?$filter=endswith(CustomerID,'ET')");
            });
            it('where method - endswith - data check', () => {
                expect(result.result.length).toBe(2);
            });
        });
        describe('endswith filter - ignoreCase - true', () => {
            let result: ResponseType; let mAjax: MockAjaxReturn; let request: JasmineAjaxRequest;
            beforeAll((done: Function) => {
                mAjax = mockAjax({ d: dataMock('CustomerID', 'endswith', 'ET', true) },
                    new Query().where('CustomerID', 'endswith', 'ET', true));
                mAjax.promise.then((e: ResponseType) => {
                    result = e;
                    done();
                });
                request = mAjax.request;
            });

            afterAll(() => {
                jasmine.Ajax.uninstall();
            });

            it("where method - endswith - url check", () => {
                expect(request.url).toBe("/api/Employees/?$filter=endswith(tolower(CustomerID),'et')");
            });
            it('where method - endswith - data check', () => {
                expect(result.result.length).toBe(2);
            });
        });
        describe('Contains filter - ignoreCase - true', () => {
            let result: ResponseType; let mAjax: MockAjaxReturn; let request: JasmineAjaxRequest;
            beforeAll((done: Function) => {
                mAjax = mockAjax({ d: dataMock('CustomerID', 'contains', 'NA', true) },
                    new Query().where('CustomerID', 'contains', 'NA', true));
                mAjax.promise.then((e: ResponseType) => {
                    result = e;
                    done();
                });
                request = mAjax.request;
            });

            afterAll(() => {
                jasmine.Ajax.uninstall();
            });

            it("where method - contains - url check", () => {
                expect(request.url).toBe("/api/Employees/?$filter=substringof('na',tolower(CustomerID))");
            });
            it('where method - contains - data check', () => {
                expect(result.result.length).toBe(1);
            });
        });
        describe('Contains filter - ignoreCase - false', () => {
            let result: ResponseType; let mAjax: MockAjaxReturn; let request: JasmineAjaxRequest;
            beforeAll((done: Function) => {
                mAjax = mockAjax({ d: dataMock('CustomerID', 'contains', 'NA', false) },
                    new Query().where('CustomerID', 'contains', 'NA', false));
                mAjax.promise.then((e: ResponseType) => {
                    result = e;
                    done();
                });
                request = mAjax.request;
            });

            afterAll(() => {
                jasmine.Ajax.uninstall();
            });

            it("where method - contains - url check", () => {
                expect(request.url).toBe("/api/Employees/?$filter=substringof('NA',CustomerID)");
            });
            it('where method - contains - data check', () => {
                expect(result.result.length).toBe(1);
            });
        });
        describe('greaterthan/lessthan/greaterthanorequal/lessthanorequal/notequal check using AND', () => {
            let result: ResponseType; let mAjax: MockAjaxReturn; let request: JasmineAjaxRequest;
            beforeAll((done: Function) => {
                let predicate: Array<Predicate> = [];
                predicate.push(new Predicate("OrderID", ">=", 10255));
                predicate.push(new Predicate("OrderID", "<=", 10248));
                predicate.push(new Predicate("OrderID", ">", 10249));
                predicate.push(new Predicate("OrderID", "<", 10254));
                predicate.push(new Predicate("OrderID", "!=", 10250));
                mAjax = mockAjax({ d: [{ OrderID: 10251 }, { OrderID: 10252 }] },
                    new Query().where(Predicate.and(predicate)));
                mAjax.promise.then((e: ResponseType) => {
                    result = e;
                    done();
                });
                request = mAjax.request;
            });

            afterAll(() => {
                jasmine.Ajax.uninstall();
            });

            it("where method - </>/<=/>=/!= - url check", () => {
                expect(request.url).toBe("/api/Employees/?$filter=(OrderID ge 10255) and (OrderID le 10248) and (OrderID gt 10249) and (OrderID lt 10254) and (OrderID ne 10250)");
            });
            it('where method - </>/<=/>=/!= - data check', () => {
                expect(result.result.length).toBe(2);
            });
        });
        describe('greaterthan/lessthan/greaterthanorequal/lessthanorequal/notequal check using OR', () => {
            let result: ResponseType; let mAjax: MockAjaxReturn; let request: JasmineAjaxRequest;
            beforeAll((done: Function) => {
                let predicate: Array<Predicate> = [];
                predicate.push(new Predicate("OrderID", ">=", 10255));
                predicate.push(new Predicate("OrderID", "<=", 10248));
                predicate.push(new Predicate("OrderID", ">", 10249));
                predicate.push(new Predicate("OrderID", "<", 10254));
                predicate.push(new Predicate("OrderID", "!=", 10250));
                mAjax = mockAjax({ d: new DataManager(data).executeLocal(new Query().where(Predicate.or(predicate))) },
                    new Query().where(Predicate.or(predicate)));
                mAjax.promise.then((e: ResponseType) => {
                    result = e;
                    done();
                });
                request = mAjax.request;
            });

            afterAll(() => {
                jasmine.Ajax.uninstall();
            });

            it("where method - </>/<=/>=/!= - url check", () => {
                expect(request.url).toBe("/api/Employees/?$filter=(OrderID ge 10255) or (OrderID le 10248) or (OrderID gt 10249) or (OrderID lt 10254) or (OrderID ne 10250)");
            });
            it('where method - </>/<=/>=/!= - data check', () => {
                expect(result.result.length).toBe(5);
            });
        });
        describe('date filtering', () => {
            let result: ResponseType; let mAjax: MockAjaxReturn; let request: JasmineAjaxRequest;
            beforeAll((done: Function) => {
                mAjax = mockAjax({ d: [{ Date: new Date(2015, 7, 7).toJSON() }] },
                    new Query().where('Date', '==', new Date(2015, 7, 7)));
                mAjax.promise.then((e: ResponseType) => {
                    result = e;
                    done();
                });
                request = mAjax.request;
            });

            afterAll(() => {
                jasmine.Ajax.uninstall();
            });

            it("where method - contains - url check", () => {
                expect(request.url).toBe("/api/Employees/?$filter=Date eq datetime'2015-08-07T00:00:00.000Z'");
            });
            it('where method - contains - data check', () => {
                expect(result.result.length).toBe(1);
            });
        });
    });
    describe('search method - field as string', () => {
        let result: ResponseType; let mAjax: MockAjaxReturn; let request: JasmineAjaxRequest;
        beforeAll((done: Function) => {
            mAjax = mockAjax({ d: data },
                new Query().search('VI', "CustomerID"));
            mAjax.promise.then((e: ResponseType) => {
                result = e;
                done();
            });
            request = mAjax.request;
        });
        it('search method - field as string - url check', () => {
            expect(request.url).toBe("/api/Employees/?$filter=(substringof('VI',cast(CustomerID, 'Edm.String')))");
        });
        afterAll(() => {
            jasmine.Ajax.uninstall();
        });
    });
    describe('search method - field as Array', () => {
        let result: ResponseType; let mAjax: MockAjaxReturn; let request: JasmineAjaxRequest;
        beforeAll((done: Function) => {
            mAjax = mockAjax({ d: data },
                new Query().search('VI', ["CustomerID", "EmployeeID"]));
            mAjax.promise.then((e: ResponseType) => {
                result = e;
                done();
            });
            request = mAjax.request;
        });
        it('search method - field as Array - url check', () => {
            expect(request.url).toBe("/api/Employees/?$filter=(substringof('VI',cast(CustomerID, 'Edm.String'))) or (substringof('VI',cast(EmployeeID, 'Edm.String')))");
        });
        afterAll(() => {
            jasmine.Ajax.uninstall();
        });
    });
    describe('search method with operator defined', () => {
        let result: ResponseType; let mAjax: MockAjaxReturn; let request: JasmineAjaxRequest;
        beforeAll((done: Function) => {
            mAjax = mockAjax({ d: data },
                new Query().search('VI', ["CustomerID", "EmployeeID"], "startswith"));
            mAjax.promise.then((e: ResponseType) => {
                result = e;
                done();
            });
            request = mAjax.request;
        });
        it('search method - operator defined - url check', () => {
            expect(request.url).toBe("/api/Employees/?$filter=(startswith(cast(CustomerID, 'Edm.String'),'VI')) or (startswith(cast(EmployeeID, 'Edm.String'),'VI'))");
        });
        afterAll(() => {
            jasmine.Ajax.uninstall();
        });
    });
    describe('search method with ignoreCase true', () => {
        let result: ResponseType; let mAjax: MockAjaxReturn; let request: JasmineAjaxRequest;
        beforeAll((done: Function) => {
            mAjax = mockAjax({ d: data },
                new Query().search('VI', ["CustomerID", "EmployeeID"], "contains", true));
            mAjax.promise.then((e: ResponseType) => {
                result = e;
                done();
            });
            request = mAjax.request;
        });
        it('search method - ignoreCase true - url check', () => {
            expect(request.url).toBe("/api/Employees/?$filter=(substringof('vi',tolower(cast(CustomerID, 'Edm.String')))) or (substringof('vi',tolower(cast(EmployeeID, 'Edm.String'))))");
        });
        afterAll(() => {
            jasmine.Ajax.uninstall();
        });
    });
    describe('sort method', () => {
        describe('sort method - fieldname & no comparer', () => {
            let result: ResponseType; let mAjax: MockAjaxReturn; let request: JasmineAjaxRequest;
            beforeAll((done: Function) => {
                mAjax = mockAjax({ d: data },
                    new Query().sortBy("EmployeeID"));
                mAjax.promise.then((e: ResponseType) => {
                    result = e;
                    done();
                });
                request = mAjax.request;
            });
            it('sort method - fieldname & no comparer - url check', () => {
                expect(request.url).toBe('/api/Employees/?$orderby=EmployeeID');
            });
            afterAll(() => {
                jasmine.Ajax.uninstall();
            });
        });
        describe('sort method - Array of fieldname', () => {
            let result: ResponseType; let mAjax: MockAjaxReturn; let request: JasmineAjaxRequest;
            beforeAll((done: Function) => {
                mAjax = mockAjax({ d: data },
                    new Query().sortBy(["EmployeeID", "CustomerID"]));
                mAjax.promise.then((e: ResponseType) => {
                    result = e;
                    done();
                });
                request = mAjax.request;
            });
            it('sort method - Array of fieldname - url check', () => {
                expect(request.url).toBe('/api/Employees/?$orderby=EmployeeID,CustomerID');
            });
            afterAll(() => {
                jasmine.Ajax.uninstall();
            });
        });
        describe('sort method - multiple field with same direction', () => {
            let result: ResponseType; let mAjax: MockAjaxReturn; let request: JasmineAjaxRequest;
            beforeAll((done: Function) => {
                mAjax = mockAjax({ d: data },
                    new Query().sortBy(["EmployeeID", "CustomerID"], "descending"));
                mAjax.promise.then((e: ResponseType) => {
                    result = e;
                    done();
                });
                request = mAjax.request;
            });
            it('sort method - multiple field with same direction - url check', () => {
                expect(request.url).toBe('/api/Employees/?$orderby=EmployeeID desc,CustomerID desc');
            });
            afterAll(() => {
                jasmine.Ajax.uninstall();
            });
        });
        describe('sort method - multiple field with different direction', () => {
            let result: ResponseType; let mAjax: MockAjaxReturn; let request: JasmineAjaxRequest;
            beforeAll((done: Function) => {
                mAjax = mockAjax({ d: data },
                    new Query().sortBy("EmployeeID").sortBy("CustomerID", "descending"));
                mAjax.promise.then((e: ResponseType) => {
                    result = e;
                    done();
                });
                request = mAjax.request;
            });
            it('sort method - multiple field with different direction - url check', () => {
                expect(request.url).toBe('/api/Employees/?$orderby=CustomerID desc,EmployeeID');
            });
            afterAll(() => {
                jasmine.Ajax.uninstall();
            });
        });
        describe('sort method - comparer as string(asc)', () => {
            let result: ResponseType; let mAjax: MockAjaxReturn; let request: JasmineAjaxRequest;
            beforeAll((done: Function) => {
                mAjax = mockAjax({ d: data },
                    new Query().sortBy("EmployeeID", "ascending"));
                mAjax.promise.then((e: ResponseType) => {
                    result = e;
                    done();
                });
                request = mAjax.request;
            });
            it('sort method - comparer as string(asc) - url check', () => {
                expect(request.url).toBe('/api/Employees/?$orderby=EmployeeID');
            });
            afterAll(() => {
                jasmine.Ajax.uninstall();
            });
        });
        describe('sort method - comparer as string(desc)', () => {
            let result: ResponseType; let mAjax: MockAjaxReturn; let request: JasmineAjaxRequest;
            beforeAll((done: Function) => {
                mAjax = mockAjax({ d: data },
                    new Query().sortBy("EmployeeID", "descending"));
                mAjax.promise.then((e: ResponseType) => {
                    result = e;
                    done();
                });
                request = mAjax.request;
            });
            it('sort method - comparer as string(asc) - url check', () => {
                expect(request.url).toBe('/api/Employees/?$orderby=EmployeeID desc');
            });
            afterAll(() => {
                jasmine.Ajax.uninstall();
            });
        });
        describe('sort method - invalid direction', () => {
            let result: ResponseType; let mAjax: MockAjaxReturn; let request: JasmineAjaxRequest;
            beforeAll((done: Function) => {
                mAjax = mockAjax({ d: data },
                    new Query().sortBy("EmployeeID", "green"));
                mAjax.promise.then((e: ResponseType) => {
                    result = e;
                    done();
                });
                request = mAjax.request;
            });
            it('sort method - invalid direction - url check', () => {
                expect(request.url).toBe('/api/Employees/?$orderby=EmployeeID');
            });
            afterAll(() => {
                jasmine.Ajax.uninstall();
            });
        });
        describe('sort method - invalid direction - array of field name', () => { //new Query().sortBy(['EmployeeID'], 'descend')
            let result: ResponseType; let mAjax: MockAjaxReturn; let request: JasmineAjaxRequest;
            beforeAll((done: Function) => {
                mAjax = mockAjax({ d: data },
                    new Query().sortBy(['EmployeeID', 'CustomerID'], 'descend'));
                mAjax.promise.then((e: ResponseType) => {
                    result = e;
                    done();
                });
                request = mAjax.request;
            });
            it('sort method - invalid direction - array of field name - url check', () => {
                expect(request.url).toBe('/api/Employees/?$orderby=EmployeeID,CustomerID');
            });
            afterAll(() => {
                jasmine.Ajax.uninstall();
            });
        });
    });
    describe('group method', () => {

        describe('Single group method', () => {
            let result: ResponseType; let mAjax: MockAjaxReturn; let request: JasmineAjaxRequest;
            beforeAll((done: Function) => {
                mAjax = mockAjax({ d: DataUtil.sort(data, "EmployeeID", DataUtil.fnAscending) },
                    new Query().group("EmployeeID"));
                mAjax.promise.then((e: ResponseType) => {
                    result = e;
                    done();
                });
                request = mAjax.request;
            });
            it('Single group method - check url', () => {
                expect(request.url).toBe('/api/Employees/?$orderby=EmployeeID');
            });
            it('Single group method - check data length', () => {
                expect(result.result.length).toEqual(4);
            });
            it('Single group method - check data objects', () => {
                let obj = <{ [key: string]: string | number | Date | Object[] }>result.result[3];
                expect(obj["field"]).toEqual("EmployeeID");
                expect(obj["key"]).toEqual(7);
                expect(obj["count"]).toBe((<Object[]>obj["items"]).length);
            });
            afterAll(() => {
                jasmine.Ajax.uninstall();
            });
        });
        describe('multiple group method', () => {
            let result: ResponseType; let mAjax: MockAjaxReturn; let request: JasmineAjaxRequest;
            beforeAll((done: Function) => {
                mAjax = mockAjax({ d: DataUtil.sort(data, "EmployeeID", DataUtil.fnAscending) },
                    new Query().group("EmployeeID").group("CustomerID"));
                mAjax.promise.then((e: ResponseType) => {
                    result = e;
                    done();
                });
                request = mAjax.request;
            });
            it('multiple group method - check url', () => {
                expect(request.url).toBe('/api/Employees/?$orderby=CustomerID,EmployeeID');
            });
            it('multiple group method - check data length', () => {
                expect(result.result.length).toEqual(4);
            });
            it('multiple group method - check data objects', () => {
                let obj = <{ [key: string]: string | number | Date | Object[] }>result.result[3];
                expect(obj["field"]).toEqual("EmployeeID");
                expect(obj["key"]).toEqual(7);
                expect(obj["count"]).toBe((<Object[]>obj["items"]).length);
            });
            it('multiple group method - check level-2 data objects', () => {
                let obj = <{ [key: string]: string | number | Date | Object[] }>result.result[3];
                let item = <Object[] & { level: number }>obj["items"];
                expect(obj["count"]).toBe((<Object[]>obj["items"]).length);
                expect(item.level).toBe(2);
            });
            afterAll(() => {
                jasmine.Ajax.uninstall();
            });
        });
    });
    describe('xml format check', () => {
        let request: JasmineAjaxRequest;
        beforeAll((done: Function) => {
            jasmine.Ajax.install();
            dataManager = new DataManager({
                url: '/api/Employees',
                adaptor: new ODataAdaptor,
                requiresFormat: true
            });
            let prom: Promise<Object> = dataManager.executeQuery(new Query());
            let result: RequestOptions;
            request = jasmine.Ajax.requests.mostRecent();
            request.respondWith({
                'status': 200,
                'contentType': 'application/xml',
                'responseText': '<xml><order></order></xml>'
            });
            prom.then((e: RequestOptions) => {
                this.result = e.result;
                done();
            });
        });
        afterAll(() => {
            jasmine.Ajax.uninstall();
        });
        it('xml format  - data check', () => {
            expect(this.result.length).toBe(0);
        });
    });
    describe('Branch coverage', () => {
        let odata: ODataAdaptor = new ODataAdaptor();
        odata.generateDeleteRequest(undefined, {});
        odata.generateInsertRequest(undefined, {});
        odata.generateUpdateRequest(undefined, {}, []);

        it ('checked insert a record in a table', () => {
            expect((<any>odata.insert(new DataManager({url: '/home'}), {order: 2}, 'order')).url).
        toBe("/home/order");
        });

        it('checked update a record in a table', () =>{
            expect(JSON.stringify(odata.update(new DataManager({url: '/home'}), 'order', 4, 'order'))).
            toBe('{"type":"PUT","url":"/home/order(undefined)","data":"4","accept":"application/json;odata=light;q=1,application/json;odata=verbose;q=0.5"}');
        });

        it('check remove a record in a table', () => {
            expect(JSON.stringify(odata.remove(new DataManager({url: '/home'}), 'order', 4, 'order'))).
            toBe('{"type":"DELETE","url":"/home/order(4)"}');
        });
    });
    describe('xml format check - no count', () => {
        let request: JasmineAjaxRequest;
        beforeAll((done: Function) => {
            jasmine.Ajax.install();
            dataManager = new DataManager({
                url: '/api/Employees',
                adaptor: new ODataAdaptor
            });
            let prom: Promise<Object> = dataManager.executeQuery(new Query().requiresCount());
            let result: RequestOptions;
            request = jasmine.Ajax.requests.mostRecent();
            request.respondWith({
                'status': 200,
                'contentType': 'application/xml',
                'responseText': '<xml><order></order></xml>'
            });
            prom.then((e: RequestOptions) => {
                this.result = e.result;
                done();
            });
        });
        afterAll(() => {
            jasmine.Ajax.uninstall();
        });
        it('xml format  - data check', () => {
            expect(this.result.length).toBe(0);
        });
    });
});

describe('ODataV4 Adaptor', () => {
    let result: Object[];
    let dataManager: DataManager;
    describe('To check DataManager', () => {
        beforeAll((done: Function) => {
            dataManager = new DataManager({
                url: '/api/Employees',
                adaptor: new ODataV4Adaptor
            });
            let promise: Promise<Object> = dataManager.executeQuery(new Query().take(5));
            promise.then((e: { result: Object[] }) => {
                result = e.result;
                done();
            });
        });
        it('generated data properly', () => {
            expect(result.length).toBe(5);
        });
    });
    describe('xml format check', () => {
        let request: JasmineAjaxRequest; let result: RequestOptions;
        beforeAll((done: Function) => {
            jasmine.Ajax.install();
            dataManager = new DataManager({
                url: '/api/Employees',
                adaptor: new ODataV4Adaptor,
                requiresFormat: true
            });
            let prom: Promise<Object> = dataManager.executeQuery(new Query());
            request = jasmine.Ajax.requests.mostRecent();
            request.respondWith({
                'status': 200,
                'contentType': 'application/xml',
                'responseText': '<xml><order></order></xml>'
            });
            prom.then((e: RequestOptions) => {
                this.result = e.result;
                done();
            });
        });
        afterAll(() => {
            jasmine.Ajax.uninstall();
        });
        it('xml format  - data check', () => {
            expect(this.result.length).toBe(0);
        });
    });
    describe('xml format check - no count', () => {
        let request: JasmineAjaxRequest;
        beforeAll((done: Function) => {
            jasmine.Ajax.install();
            dataManager = new DataManager({
                url: '/api/Employees',
                adaptor: new ODataV4Adaptor
            });
            let prom: Promise<Object> = dataManager.executeQuery(new Query().requiresCount());
            let result: RequestOptions;
            request = jasmine.Ajax.requests.mostRecent();
            request.respondWith({
                'status': 200,
                'contentType': 'application/xml',
                'responseText': '<xml><order></order></xml>'
            });
            prom.then((e: RequestOptions) => {
                this.result = e.result;
                done();
            });
        });
        afterAll(() => {
            jasmine.Ajax.uninstall();
        });
        it('xml format  - data check', () => {
            expect(this.result.length).toBe(0);
        });
    });
    describe('page method', () => {
        beforeAll((done: Function) => {
            dataManager = new DataManager({
                url: '/api/Employees',
                adaptor: new ODataV4Adaptor
            });
            let promise: Promise<Object> = dataManager.executeQuery(new Query().page(2, 3).take(5));
            promise.then((e: { result: Object[] }) => {
                result = e.result;
                done();
            });
        });
        it('check length of the data', () => {
            expect(result.length).toBe(3);
        });
    });
    describe('range method', () => {
        beforeAll((done: Function) => {
            dataManager = new DataManager({
                url: '/api/Employees',
                adaptor: new ODataV4Adaptor
            });
            let promise: Promise<Object> = dataManager.executeQuery(new Query().range(1, 2).take(5));
            promise.then((e: { result: Object[] }) => {
                result = e.result;
                done();
            });
        });
        it('check length of the data', () => {
            expect(result.length).toBe(1);
        });
    });
    describe('where method', () => {
        beforeAll((done: Function) => {
            dataManager = new DataManager({
                url: '/api/Employees',
                adaptor: new ODataV4Adaptor
            });
            let promise: Promise<Object> = dataManager.executeQuery(new Query().where('LastName', 'equal', 'Andrew'));
            promise.then((e: { result: Object[] }) => {
                result = e.result;
                done();
            });
        });
        it('generated data properly', () => {
            expect(result.length).toBe(1);
        });
        it('To check filtered properly".', () => {
            expect(result[0]["LastName"]).toEqual('Andrew');
        });
        describe('date filtering', () => {
            let request: JasmineAjaxRequest;
            beforeAll((done: Function) => {
                jasmine.Ajax.install();
                dataManager = new DataManager({
                    url: 'http://services.odata.org/V4/OData/OData.svc/Products',
                    adaptor: new ODataV4Adaptor
                });
                let promise: Promise<Object> = dataManager.executeQuery(new Query().
                    where('ReleaseDate', 'lessThan', new Date('December 30, 1995 12:13:00')));
                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith({
                    'status': 200,
                    'contentType': 'application/json',
                    'responseText': JSON.stringify({
                        value: [{
                            'ReleaseDate': new Date('December 30, 1994 12:13:00').toJSON()
                        }]
                    })
                });
                promise.then((e: { result: Object[] }) => {
                    result = e.result;
                    done();
                });
            });
            it('generated data properly', () => {
                expect(result.length).toBe(1);
            });
            it('generated data filtered properly', () => {
                expect(new Date(result[0]["ReleaseDate"]) < new Date('December 30, 1995 12:13:00')).toBe(true);
            });
            afterAll(() => {
                jasmine.Ajax.uninstall();
            });
        });
        describe('guid filtering', () => {
            let request: JasmineAjaxRequest;
            beforeAll((done: Function) => {
                jasmine.Ajax.install();
                dataManager = new DataManager({
                    url: '/api/Employees',
                    adaptor: new ODataV4Adaptor
                });
                dataManager.executeQuery(new Query().
                    where('Guid', 'equal', 'f89dee73-af9f-4cd4-b330-db93c25ff3c9', true));
                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith({
                    'status': 200,
                    'contentType': 'application/json',
                    'responseText': JSON.stringify({
                        value: [{
                            '_id': 5, 'EmployeeID': 1005, 'Guid': 'f89dee73-af9f-4cd4-b330-db93c25ff3c9', 'FirstName': 'Buchanan',
                            'LastName': 'Steven', 'DOB': new Date('October 2, 1990 08:13:00')
                        }]
                    })
                });
                done();
            });
            afterAll(() => {
                jasmine.Ajax.uninstall();
            });
            it('generated guid filter url properly', () => {
                expect(request.url).
                    toEqual('/api/Employees/?$filter=Guid eq guid' + '\'' + 'f89dee73-af9f-4cd4-b330-db93c25ff3c9' + '\'');
            });
        });
        describe('startsWith guid filtering', () => {
            let request: JasmineAjaxRequest;
            beforeAll((done: Function) => {
                jasmine.Ajax.install();
                dataManager = new DataManager({
                    url: '/api/Employees',
                    adaptor: new ODataV4Adaptor
                });
                dataManager.executeQuery(new Query().
                    where('Guid', 'startsWith', 'f89dee73-af9f-4cd4-b330-db93c25ff3c9', true));
                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith({
                    'status': 200,
                    'contentType': 'application/json',
                    'responseText': JSON.stringify(
                        {
                            value: [{
                                '_id': 5, 'EmployeeID': 1005, 'Guid': 'f89dee73-af9f-4cd4-b330-db93c25ff3c9', 'FirstName': 'Buchanan',
                                'LastName': 'Steven', 'DOB': new Date('October 2, 1990 08:13:00')
                            }]
                        })
                });
                done();
            });
            afterAll(() => {
                jasmine.Ajax.uninstall();
            });
            it('generated guid filter url properly', () => {
                expect(request.url).
                    toEqual('/api/Employees/?$filter=startswith(Guid,guid' + '\'' + 'f89dee73-af9f-4cd4-b330-db93c25ff3c9' + '\')');
            });
        });
    });
    describe('search method', () => {
        beforeAll((done: Function) => {
            dataManager = new DataManager({
                url: '/api/Employees',
                adaptor: new ODataV4Adaptor
            });
            let promise: Promise<Object> = dataManager.executeQuery(new Query().search(7, 'EmployeeID', 'equal'));
            promise.then((e: { result: Object[] }) => {
                result = e.result;
                done();
            });
        });
        it('To check filtered data length".', () => {
            expect(result.length).toBe(9);
        });
    });
    describe('sort method', () => {
        beforeAll((done: Function) => {
            dataManager = new DataManager({
                url: '/api/Employees',
                adaptor: new ODataV4Adaptor
            });
            let promise: Promise<Object> = dataManager.executeQuery(new Query().sortBy('EmployeeID', 'descending').take(5));
            promise.then((e: { result: Object[] }) => {
                result = e.result;
                done();
            });
        });
        it('To check sorted data length properly".', () => {
            expect(result.length).toBe(5);
        });
        it('To check filtered properly".', () => {
            expect(result[0]["_id"] > result[1]["_id"]).toEqual(true);
            expect(result[1]["_id"] > result[2]["_id"]).toEqual(true);
        });
        describe('array of field name in sort method', () => {
            beforeAll((done: Function) => {
                dataManager = new DataManager({
                    url: '/api/Employees',
                    adaptor: new ODataV4Adaptor
                });
                let promise: Promise<Object> = dataManager.executeQuery(new Query().sortBy(['EmployeeID'], 'descending').take(5));
                promise.then((e: { result: Object[] }) => {
                    result = e.result;
                    done();
                });
            });
            it('To check sorted data length properly".', () => {
                expect(result.length).toBe(5);
            });
            it('To check sorted properly".', () => {
                expect(result[0]["_id"] > result[1]["_id"]).toEqual(true);
                expect(result[1]["_id"] > result[2]["_id"]).toEqual(true);
            });
        });
        describe('invalid operator in sort method', () => {
            beforeAll((done: Function) => {
                dataManager = new DataManager({
                    url: '/api/Employees',
                    adaptor: new ODataV4Adaptor
                });
                let promise: Promise<Object> = dataManager.executeQuery(new Query().sortBy('EmployeeID', 'descend').take(5));
                promise.then((e: { result: Object[] }) => {
                    result = e.result;
                    done();
                });
            });
            it('To check sorted data length properly".', () => {
                expect(result.length).toBe(5);
            });
        });
    });
    describe('aggregate method', () => {
        beforeAll((done: Function) => {
            dataManager = new DataManager({
                url: '/api/Employees',
                adaptor: new ODataV4Adaptor
            });
            let promise: Promise<Object> = dataManager.executeQuery(new Query().requiresCount().aggregate('count', 'EmployeeID'));
            promise.then((e: any) => {
                result = e;
                done();
            });
        });
        it('To check take data legnth.', () => {
            expect((<any>result).aggregates['EmployeeID - count']).toBe(9);
        });
    });
    describe('group method', () => {
        beforeAll((done: Function) => {
            dataManager = new DataManager({
                url: '/api/Employees',
                adaptor: new ODataV4Adaptor
            });
            let promise: Promise<Object> = dataManager.executeQuery(new Query().group('EmployeeID'));
            promise.then((e: any) => {
                result = e.result;
                done();
            });
        });
        it('check length of the data', () => {
            expect(result[0]["items"].length).toBe(1);
        });
        it('check field name from result', () => {
            expect(result[0]["field"]).toEqual('EmployeeID');
        });
    });
    describe('insert method', () => {
        let record: Object = { EmployeeId: 10, LastName: 'John', FirstName: 'Stephen' };
        let result: string;
        let query: Query = new Query();
        let request: any;
        beforeAll((done: Function) => {
            jasmine.Ajax.install();
            dataManager = new DataManager({
                url: '/api/Employees',
                adaptor: new ODataV4Adaptor,
                offline: true
            });
            let promise: Promise<Object> = (<Promise<Object>>dataManager.insert(record, query));
            request = jasmine.Ajax.requests.mostRecent();
            request.respondWith({
                'status': 200,
                'contentType': 'application/json',
                'responseText': JSON.stringify(record)
            });
            promise.then((e: any) => {
                result = 'Inserted successfully';
                done();
            });
        });
        afterAll(() => {
            jasmine.Ajax.uninstall();
        });
        it('check data added properly', () => {
            expect(result).toBe('Inserted successfully');
        });
        it('check type of post', () => {
            expect(request.method).toEqual('POST');
        });
        it('check params', () => {
            expect(request.params).toEqual('{"EmployeeId":10,"LastName":"John","FirstName":"Stephen"}');
        });
    });

    describe('insert method when failure', () => {
        let record: Object = { EmployeeId: 10, LastName: 'John', FirstName: 'Stephen' };
        let result: string;
        let request: JasmineAjaxRequest;
        beforeAll((done: Function) => {
            jasmine.Ajax.install();
            dataManager = new DataManager({
                url: '/api/Orders',
                adaptor: new ODataV4Adaptor,
                offline: true
            });
            let promise: Promise<Object> = (<Promise<Object>>dataManager.insert(record));
            request = jasmine.Ajax.requests.mostRecent();
            request.respondWith({});
            promise.then(
                (e: string) => {
                    result = 'Inserted successfully';
                    done();
                },
                (e: string) => {
                    result = 'Inserted failed';
                    done();
                });
        });
        afterAll(() => {
            jasmine.Ajax.uninstall();
        });
        it('check data added properly', () => {
            expect(result).toBe('Inserted failed');
        });
    });

    describe('update method', () => {
        let record: Object = { _id: 9, EmployeeId: 1009, LastName: 'John', FirstName: 'Smith' };
        let result: string;
        let query: Query = new Query();
        let request: any;
        beforeAll((done: Function) => {
            jasmine.Ajax.install();
            dataManager = new DataManager({
                url: '/api/Employees',
                adaptor: new ODataV4Adaptor,
                offline: true
            });
            let promise: Promise<Object> = (<Promise<Object>>dataManager.update('_id', record, query));
            request = jasmine.Ajax.requests.mostRecent();
            request.respondWith({
                'status': 200,
                'contentType': 'application/json',
                'responseText': JSON.stringify(record)
            });
            promise.then((e: any) => {
                result = 'Updated successfully';
                done();
            });
        });
        afterAll(() => {
            jasmine.Ajax.uninstall();
        });
        it('check updated data', () => {
            expect(result).toBe('Updated successfully');
        });
        it('check type of post', () => {
            expect(request.method).toEqual('PATCH');
        });
        it('check params', () => {
            expect(request.params).toEqual('{"_id":9,"EmployeeId":1009,"LastName":"John","FirstName":"Smith"}');
        });
    });

    describe('update method', () => {
        let record: Object = { _id: 9, EmployeeId: 1009, LastName: 'John', FirstName: 'Smith' };
        let result: string;
        let query: Query = new Query();
        let request: any;
        beforeAll((done: Function) => {
            jasmine.Ajax.install();
            dataManager = new DataManager({
                url: '/api/Employees',
                adaptor: new ODataV4Adaptor
            });
            let promise: Promise<Object> = (<Promise<Object>>dataManager.update('LastName', record, query));
            request = jasmine.Ajax.requests.mostRecent();
            request.respondWith({
                'status': 200,
                'contentType': 'application/json',
                'responseText': JSON.stringify(record)
            });
            promise.then((e: any) => {
                result = 'Updated successfully';
                done();
            });
        });
        afterAll(() => {
            jasmine.Ajax.uninstall();
        });
        it('check the request', () => {
            expect(request.url).toEqual(`/api/Employees('John')`);
        });
    });
    describe('select method', () => {
        let record: Object = { _id: 9, Employee:{EmployeeId: 1009}, LastName: 'John', FirstName: 'Smith' };
        let result: string;
        let query: Query = new Query();
        let request: any;
        beforeAll((done: Function) => {
            jasmine.Ajax.install();
            dataManager = new DataManager({
                url: '/api/Employees',
                adaptor: new ODataV4Adaptor
            });
            let promise: Promise<Object> = dataManager.executeQuery(new Query().select(['Employee.EmployeeID']));
            request = jasmine.Ajax.requests.mostRecent();
            request.respondWith({
                'status': 200,
                'contentType': 'application/json',
                'responseText': JSON.stringify(record)
            });
            promise.then((e: any) => {
                result = 'Selected successfully';
                done();
            });
        });
        afterAll(() => {
            jasmine.Ajax.uninstall();
        });
        it('check the request', () => {
            expect(request.url).toEqual(`/api/Employees/?$expand=Employee($select=EmployeeID)`);
        });
    });
    describe('update method when failure', () => {
        let record: Object = { _id: 9, EmployeeId: 1009, LastName: 'John', FirstName: 'Smith' };
        let result: string;
        beforeAll((done: Function) => {
            jasmine.Ajax.install();
            dataManager = new DataManager({
                url: '/api/Orders',
                adaptor: new ODataV4Adaptor,
                offline: true
            });
            let promise: Promise<Object> = (<Promise<Object>>dataManager.update('_id', record));
            let request: JasmineAjaxRequest = jasmine.Ajax.requests.mostRecent();
            request.respondWith({});
            promise.then(
                (e: string) => {
                    result = 'Updated successfully';
                    done();
                },
                (e: string) => {
                    result = 'Updated failed';
                    done();
                });
        });
        afterAll(() => {
            jasmine.Ajax.uninstall();
        });
        it('check updated data', () => {
            expect(result).toBe('Updated failed');
        });
    });
    describe('remove method', () => {
        let result: string;
        let query: Query = new Query();
        let request: any;
        beforeAll((done: Function) => {
            jasmine.Ajax.install();
            dataManager = new DataManager({
                url: '/api/Employees',
                adaptor: new ODataV4Adaptor,
                offline: true
            });
            let promise: Promise<Object> = (<Promise<Object>>dataManager.remove('RegionID', 4, query));
            request = jasmine.Ajax.requests.mostRecent();
            request.respondWith({
                'status': 200,
                'contentType': 'application/json',
                'responseText': JSON.stringify({})
            });
            promise.then((e: any) => {
                result = 'Removed successfully';
                done();
            });
        });
        afterAll(() => {
            jasmine.Ajax.uninstall();
        });
        it('check data Removed properly', () => {
            expect(result).toBe('Removed successfully');
        });
        it('check type of post', () => {
            expect(request.method).toEqual('DELETE');
        });
        it('check params', () => {
            expect(request.params).toBeNull;
        });
    });
    describe('remove method', () => {
        let result: string;
        let query: Query = new Query();
        let request: any;
        beforeAll((done: Function) => {
            jasmine.Ajax.install();
            dataManager = new DataManager({
                url: '/api/Employees',
                adaptor: new ODataV4Adaptor
            });
            let promise: Promise<Object> = (<Promise<Object>>dataManager.remove('RegionDescription', 'Southern', query));
            request = jasmine.Ajax.requests.mostRecent();
            request.respondWith({
                'status': 200,
                'contentType': 'application/json',
                'responseText': JSON.stringify({})
            });
            promise.then((e: any) => {
                result = 'Removed successfully';
                done();
            });
        });
        afterAll(() => {
            jasmine.Ajax.uninstall();
        });
        it('check the request', () => {
            expect(request.url).toEqual(`/api/Employees('Southern')`);
        });
    });
    
    describe('remove method when failure', () => {
        let result: string;
        beforeAll((done: Function) => {
            jasmine.Ajax.install();
            dataManager = new DataManager({
                url: '/api/Region',
                adaptor: new ODataV4Adaptor,
                offline: true
            });
            let promise: Promise<Object> = (<Promise<Object>>dataManager.remove('RegionID', 4));
            let request: JasmineAjaxRequest = jasmine.Ajax.requests.mostRecent();
            request.respondWith({});
            promise.then(
                (e: string) => {
                    result = 'Removed successfully';
                    done();
                },
                (e: string) => {
                    result = 'Removed failed';
                    done();
                });
        });
        afterAll(() => {
            jasmine.Ajax.uninstall();
        });
        it('check data Removed properly', () => {
            expect(result).toBe('Removed failed');
        });
    });

    describe('batchRequst method', () => {
        let result: string;
        let changes: any = { changedRecords: [], addedRecords: [], deletedRecords: [] };
        let request: JasmineAjaxRequest;
        beforeAll((done: Function) => {
            jasmine.Ajax.install();
            changes.changedRecords.push({ RegionID: 1, RegionDescription: 'Southern' });
            changes.addedRecords.push({ RegionID: 5, RegionDescription: 'Southern' });
            changes.deletedRecords.push({ RegionID: 2, RegionDescription: 'Western' });
            dataManager = new DataManager({
                url: '/api/Employees',
                adaptor: new ODataV4Adaptor
            });
            let promise: Promise<Object> = (<Promise<Object>>dataManager.saveChanges(changes, 'RegionID', new Query()));
            request = jasmine.Ajax.requests.mostRecent();
            request.respondWith({
                'status': 200,
                'contentType': 'multipart/mixed; boundary=batchresponse_5daab2ca-9817-42f6-a786-2ae12905c96b',
                'responseText': `{"Content-Type": "multipart/mixed",
                "boundary":"changeset_b5af43a3-f35f-41a8-b048-201f404cfb4c --changeset_b5af43a3-f35f-41a8-b048-201f404cfb4c",
                "Content-Type": "application/http", "Content-Transfer-Encoding": "binary PUT Table1Items(24) HTTP/1.1", "If-Match" : "*",
                "Accept": "application/json;odata=light;q=1,application/json;odata=verbose;q=0.5", "Content-Id": 0,
                "Content-Type": "application/json;", "charset": {"Id":24,"OrderID":23,"EmployeeID":4,"Freight":null,"City":null},
                "CreatedBy":"TestUser","Created":"2015-11-06T11:28:19.211Z","ModifiedBy":"TestUser",
                "Modified":"2015-11-06T11:28:19.211Z","RowVersion":"AAAAAAAANsg="}`
            })
            promise.then((e: any) => {
                result = 'Batch request successfully';
                done();
            });
        });
        afterAll(() => {
            jasmine.Ajax.uninstall();
        });
        it('check data updated properly', () => {
            expect(result).toBe('Batch request successfully');
        });
        it('check type of the request', () => {
            expect(request.method).toEqual('POST');
        });
    });

    describe('batchRequst method using null value', () => {
        let result: any;
        let changes: any = { changedRecords: [], addedRecords: [], deletedRecords: [] };
        beforeAll((done: Function) => {
            jasmine.Ajax.install();
            changes.addedRecords.push(
                {
                    'Id': 24, 'OrderID': 23, 'EmployeeID': 4, 'Freight': null,
                    'City': null, 'CreatedBy': 'TestUser', 'Created': '2015-11-06T11:28:19.211Z',
                    'ModifiedBy': 'TestUser', 'Modified': '2015-11-06T11:28:19.211Z', 'RowVersion': 'AAAAAAAANsg='
                });
            dataManager = new DataManager({
                url: '/api/Employees',
                adaptor: new ODataAdaptor,
                offline: true
            });
            let promise: Promise<Object> = (<Promise<Object>>dataManager.saveChanges(changes, 'Id', new Query()));
            let request: JasmineAjaxRequest = jasmine.Ajax.requests.mostRecent();
            request.respondWith({
                'status': 200,
                'contentType': 'application/json',
                'responseText': `{"Content-Type": "multipart/mixed",
                "boundary":"changeset_b5af43a3-f35f-41a8-b048-201f404cfb4c --changeset_b5af43a3-f35f-41a8-b048-201f404cfb4c",
                "Content-Type": "application/http", "Content-Transfer-Encoding": "binary PUT Table1Items(24) HTTP/1.1", "If-Match" : "*",
                "Accept": "application/json;odata=light;q=1,application/json;odata=verbose;q=0.5", "Content-Id": 0,
                "Content-Type": "application/json;", "charset": {"Id":24,"OrderID":23,"EmployeeID":4,"Freight":null,"City":null},
                "CreatedBy":"TestUser","Created":"2015-11-06T11:28:19.211Z","ModifiedBy":"TestUser",
                "Modified":"2015-11-06T11:28:19.211Z","RowVersion":"AAAAAAAANsg="} `
            });
            promise.then((e: any) => {
                result = e;
                done();
            });
        });
        afterAll(() => {
            jasmine.Ajax.uninstall();
        });
        it('check data updated properly', () => {
            expect(result).not.toBeNull;
        });
    });

    describe('batchRequst method when failure', () => {
        let result: any;
        let changes: any = { changedRecords: [], addedRecords: [], deletedRecords: [] };
        beforeAll((done: Function) => {
            jasmine.Ajax.install();
            changes.changedRecords.push({ RegionID: 1, RegionDescription: 'Southern' });
            changes.addedRecords.push({ RegionID: 5, RegionDescription: 'Southern' });
            changes.deletedRecords.push({ RegionID: 2, RegionDescription: 'Western' });
            dataManager = new DataManager({
                url: '/api/Region',
                adaptor: new ODataAdaptor,
                offline: true
            });
            let promise: Promise<Object> = (<Promise<Object>>dataManager.saveChanges(changes, 'RegionID', new Query()));
            let request: JasmineAjaxRequest = jasmine.Ajax.requests.mostRecent();
            request.respondWith({});
            promise.then(
                (e: string) => {
                    result = 'Batch request successfully';
                    done();
                },
                (e: string) => {
                    result = 'Batch request failed';
                    done();
                });
        });
        afterAll(() => {
            jasmine.Ajax.uninstall();
        });
        it('check data updated properly', () => {
            expect(result).toBe('Batch request failed');
        });
    });

    describe('Check distinct method in OdataV4', () => {
        let request: JasmineAjaxRequest;
        beforeAll((done: Function) => {
            jasmine.Ajax.install();
            dataManager = new DataManager({
                url: 'odata/Orders',
                adaptor: new ODataV4Adaptor()
            });
            let query: Query = new Query().distinct(['Freight']).take(10);
            query.execute(dataManager).then((e: { result: Object[] }) => {
                done();
            });
            request = jasmine.Ajax.requests.mostRecent();
            request.respondWith({
                'status': 200,
                'contentType': 'application/json',
                'responseText': `{"Content-Type": "multipart/mixed",
                "boundary":"changeset_b5af43a3-f35f-41a8-b048-201f404cfb4c --changeset_b5af43a3-f35f-41a8-b048-201f404cfb4c",
                "Content-Type": "application/http", "Content-Transfer-Encoding": "binary PUT Table1Items(24) HTTP/1.1", "If-Match" : "*",
                "Accept": "application/json;odata=light;q=1,application/json;odata=verbose;q=0.5", "Content-Id": 0,
                "Content-Type": "application/json;", "charset": {"Id":24,"OrderID":23,"EmployeeID":4,"Freight":null,"City":null},
                "CreatedBy":"TestUser","Created":"2015-11-06T11:28:19.211Z","ModifiedBy":"TestUser",
                "Modified":"2015-11-06T11:28:19.211Z","RowVersion":"AAAAAAAANsg="} `
            });
        });
        it('To check multiple selected method.', () => {
            expect(request.url).toEqual('odata/Orders/?$apply=groupby((Freight))&$top=10');
        });
        afterAll(() => {
            jasmine.Ajax.uninstall();
        });
    });
});

describe('WebApi Adaptor', () => {
    let result: Object[];
    let dataManager: DataManager;
    let request: JasmineAjaxRequest;
    let data: Object[] = [
        { OrderID: 10248, CustomerID: 'VINET', EmployeeID: 7, Freight: 32.38, Guid: 'f89dee73-af9f-4cd4-b330-db93c25ff3c7' },
        { OrderID: 10249, CustomerID: 'AANAR', EmployeeID: 2, Freight: 11.61, Guid: 'db2d2186-1c29-4d1e-88ef-a127f521b9c6' },
        { OrderID: 10250, CustomerID: 'VICTE', EmployeeID: 7, Freight: 65.83, Guid: '6F9619FF-8B86-D011-B42D-00C04FC964FF' },
        { OrderID: 10251, CustomerID: 'VINET', EmployeeID: 7, Freight: 70.63, Guid: 'f89dee73-af9f-4cd4-b330-db93c25ff3c7' },
        { OrderID: 10252, CustomerID: 'SUPRD', EmployeeID: 6, Freight: 45.45, Guid: 'f89dee73-af9f-4cd4-b330-db93c25ff3c9' }
    ];
    type MockAjaxReturn = { promise: Promise<Object>, request: JasmineAjaxRequest };
    let mockAjax: Function = (data: { [o: string]: Object | Object[] } | Object[], query: Query, response?: Object):
        MockAjaxReturn => {
        jasmine.Ajax.install();
        dataManager = new DataManager({
            url: '/api/Employees',
            adaptor: new WebApiAdaptor
        });
        let prom: Promise<Object> = dataManager.executeQuery(query);
        let defaults: Object = {
            'status': 200,
            'contentType': 'application/json',
            'responseText': JSON.stringify(data)
        };
        let responses: Object = {};
        request = jasmine.Ajax.requests.mostRecent();
        extend(responses, defaults, response);
        request.respondWith(responses);
        return {
            promise: prom,
            request: request
        };
    };
    let mAjax: MockAjaxReturn;
    describe('To check DataManager', () => {
        beforeAll((done: Function) => {
            mAjax = mockAjax({ Items: data }, new Query());
            mAjax.promise.then((e: { result: Object[] }) => {
                result = e.result;
                done();
            });
        });
        it('generated data properly', () => {
            expect(result.length).not.toBe(0);
        });
        afterAll(() => {
            jasmine.Ajax.uninstall();
        })
    });
    describe('group method', () => {
        beforeAll((done: Function) => {
            dataManager = new DataManager({
                url: 'http://mvc.syncfusion.com/UGService/api/Orders/',
                adaptor: new WebApiAdaptor
            });
            mAjax = mockAjax({ Items: data }, new Query().take(10).group('EmployeeID'));
            mAjax.promise.then((e: any) => {
                result = e.result;
                done();
            });
        });
        it('check length of the data', () => {
            expect(result[0]["items"].length).not.toBe(0);
        });
        it('check field name from result', () => {
            expect(result[0]["field"]).toEqual('EmployeeID');
        });
        afterAll(() => {
            jasmine.Ajax.uninstall();
        })
    });
    describe('insert method', () => {
        let record: Object = { OrderID: 10980, EmployeeId: 4, Freight: 25.55, CustomerID: 'TOMSP' };
        let result: string;
        let query: Query = new Query();
        let request: any;
        beforeAll((done: Function) => {
            jasmine.Ajax.install();
            dataManager = new DataManager({
                url: 'http://mvc.syncfusion.com/UGService/api/Orders/',
                adaptor: new WebApiAdaptor,
                offline: true
            });
            let promise: Promise<Object> = (<Promise<Object>>dataManager.insert(record, query));
            request = jasmine.Ajax.requests.mostRecent();
            request.respondWith({
                'status': 200,
                'contentType': 'application/json',
                'responseText': 'Response from WebApiAdaptor'
            });
            promise.then((e: any) => {
                result = 'Inserted successfully';
                done();
            });
        });
        afterAll(() => {
            jasmine.Ajax.uninstall();
        });
        it('check data added properly', () => {
            expect(result).toBe('Inserted successfully');
        });
        it('check dparams of post', () => {
            expect(request.params).toEqual('{"OrderID":10980,"EmployeeId":4,"Freight":25.55,"CustomerID":"TOMSP"}');
        });
    });
    describe('update method', () => {
        let record: Object = { OrderID: 10248, EmployeeId: 4, Freight: 78.55, CustomerID: 'VINET' };
        let result: string;
        let query: Query = new Query();
        let request: any;
        beforeAll((done: Function) => {
            jasmine.Ajax.install();
            dataManager = new DataManager({
                url: 'http://mvc.syncfusion.com/UGService/api/Orders/',
                adaptor: new WebApiAdaptor,
                offline: true
            });
            let promise: Promise<Object> = (<Promise<Object>>dataManager.update('OrderID', record, query));
            request = jasmine.Ajax.requests.mostRecent();
            request.respondWith({
                'status': 200,
                'contentType': 'application/json',
                'responseText': 'Response from WebApiAdaptor'
            });
            promise.then((e: any) => {
                result = 'Updated successfully';
                done();
            });
        });
        afterAll(() => {
            jasmine.Ajax.uninstall();
        });
        it('check updated data', () => {
            expect(result).toBe('Updated successfully');
        });
        it('check params of post', () => {
            expect(request.params).toEqual('{"OrderID":10248,"EmployeeId":4,"Freight":78.55,"CustomerID":"VINET"}');
        });
    });
    describe('remove method', () => {
        let result: string;
        let query: Query = new Query();
        let request: any;
        beforeAll((done: Function) => {
            jasmine.Ajax.install();
            dataManager = new DataManager({
                url: 'http://mvc.syncfusion.com/UGService/api/Orders/',
                adaptor: new WebApiAdaptor,
                offline: true
            });
            let promise: Promise<Object> = (<Promise<Object>>dataManager.remove('RegionID', 10980, query));
            request = jasmine.Ajax.requests.mostRecent();
            request.respondWith({
                'status': 200,
                'contentType': 'application/json',
                'responseText': 'Response from WebApiAdaptor'
            });
            promise.then((e: any) => {
                result = 'Removed successfully';
                done();
            });
        });
        afterAll(() => {
            jasmine.Ajax.uninstall();
        });
        it('check data Removed properly', () => {
            expect(result).toBe('Removed successfully');
        });
        it('check params of post', () => {
            expect(request.params).toEqual('10980');
        });
    });
    describe('batchRequst method', () => {
        let result: any;
        let changes: any = { changedRecords: [], addedRecords: [], deletedRecords: [] };
        beforeAll((done: Function) => {
            jasmine.Ajax.install();
            changes.changedRecords.push({ OrderID: 10248, EmployeeId: 4, Freight: 53.55, CustomerID: 'VINET' });
            changes.addedRecords.push({ OrderID: 10981, EmployeeId: 6, Freight: 78.55, CustomerID: 'VINET' });
            changes.deletedRecords.push({ OrderID: 10250, EmployeeId: 9, Freight: 8.0000, CustomerID: 'HANAR' });
            dataManager = new DataManager({
                url: 'http://mvc.syncfusion.com/UGService/api/Orders/',
                adaptor: new WebApiAdaptor,
                offline: true
            });
            let promise: Promise<Object> = (<Promise<Object>>dataManager.saveChanges(changes, 'RegionID', new Query()));
            let request: JasmineAjaxRequest = jasmine.Ajax.requests.mostRecent();
            request.respondWith({
                'status': 200,
                'contentType': 'application/json',
                'responseText': '{"Response from WebApiAdaptor": "responseText"}'
            });
            promise.then((e: any) => {
                result = 'Batch request successfully';
                done();
            });
        });
        afterAll(() => {
            jasmine.Ajax.uninstall();
        });
        it('check data updated properly', () => {
            expect(result).toBe('Batch request successfully');
        });
    });
    describe('Aggregate checking', () => {
        let request: JasmineAjaxRequest;
        let dataManager: DataManager;
        let query: Query = new Query().aggregate("min", "OrderID").requiresCount();
        let result: { result: Object[], aggregates: { [a: string]: Object } };
        beforeAll((done: Function) => {
            jasmine.Ajax.install();
            this.dataManager = new DataManager({
                url: '/Home/Employees',
                adaptor: new WebApiAdaptor
            });
            let promise: Promise<Object> = this.dataManager.executeQuery(query);
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                'status': 200,
                'contentType': 'application/json',
                'responseText': JSON.stringify({ Items: [{ OrderID: 1 }, { OrderID: 2 }], Count: 2 }),
                'requestHeaders': {
                    'DataServiceVersion': '3.0'
                }
            });
            promise.then((e: { result: Object[], aggregates: { [a: string]: Object } }) => {
                this.result = e;
                done();
            });
        });
        afterAll(() => {
            jasmine.Ajax.uninstall();
        });
        it('check whether the args wrapped in "value"', () => {
            expect(this.result.aggregates["OrderID - min"]).toBe(1);
        });
    });

    describe('WebMethod Adaptor', () => {
        let dataManager: DataManager;
        let result: any;
        let data: Object[] = [
            { OrderID: 10248, CustomerID: 'VINET', EmployeeID: 7, Freight: 32.38, Guid: 'f89dee73-af9f-4cd4-b330-db93c25ff3c7' },
            { OrderID: 10249, CustomerID: 'AANAR', EmployeeID: 2, Freight: 11.61, Guid: 'db2d2186-1c29-4d1e-88ef-a127f521b9c6' },
            { OrderID: 10250, CustomerID: 'VICTE', EmployeeID: 7, Freight: 65.83, Guid: '6F9619FF-8B86-D011-B42D-00C04FC964FF' },
            { OrderID: 10251, CustomerID: 'VINET', EmployeeID: 7, Freight: 70.63, Guid: 'f89dee73-af9f-4cd4-b330-db93c25ff3c7' },
            { OrderID: 10252, CustomerID: 'SUPRD', EmployeeID: 6, Freight: 45.45, Guid: 'f89dee73-af9f-4cd4-b330-db93c25ff3c9' }
        ];


        describe('Process Query check', () => {
            let request: JasmineAjaxRequest;
            let dataManager: DataManager;
            let query: Query = new Query().addParams("hi", "test");
            beforeAll((done: Function) => {
                jasmine.Ajax.install();
                this.dataManager = new DataManager({
                    url: '/Home/Employees',
                    adaptor: new WebMethodAdaptor
                });
                let promise: Promise<Object> = this.dataManager.executeQuery(query);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    'status': 200,
                    'contentType': 'application/json',
                    'responseText': JSON.stringify({ d: data })
                });
                promise.then((e: { result: Object[] }) => {
                    result = e.result;
                    done();
                });
            });
            afterAll(() => {
                jasmine.Ajax.uninstall();
            });
            it('check whether the args wrapped in "value"', () => {
                expect(this.request.data().value).not.toBeNull();
            });
        });
        describe('insert method', () => {
            let record: Object = { EmployeeId: 10, LastName: 'John', FirstName: 'Stephen' };
            let result: string;
            let query: Query = new Query();
            let request: any;
            beforeAll((done: Function) => {
                jasmine.Ajax.install();
                dataManager = new DataManager({
                    url: '/Default/Orders',
                    adaptor: new WebMethodAdaptor
                });
                let promise: Promise<Object> = (<Promise<Object>>dataManager.insert(record, query));
                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith({
                    'status': 200,
                    'contentType': 'application/json',
                    'responseText': 'Response from WebMethodAdaptor'
                });
                promise.then((e: any) => {
                    result = 'Inserted successfully';
                    done();
                });
            });
            afterAll(() => {
                jasmine.Ajax.uninstall();
            });
            it('check data added properly', () => {
                expect(result).toBe('Inserted successfully');
            });
            it('check params of post', () => {
                expect(request.params).
                    toEqual('{"value":{"EmployeeId":10,"LastName":"John","FirstName":"Stephen"},"table":null,"action":"insert"}');
            });
        });
        describe('update method', () => {
            let record: Object = { _id: 9, EmployeeId: 1009, LastName: 'John', FirstName: 'Smith' };
            let result: string;
            let query: Query = new Query();
            let request: any;
            beforeAll((done: Function) => {
                jasmine.Ajax.install();
                dataManager = new DataManager({
                    url: '/Default/Orders',
                    adaptor: new WebMethodAdaptor
                });
                let promise: Promise<Object> = (<Promise<Object>>dataManager.update('_id', record, query));
                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith({
                    'status': 200,
                    'contentType': 'application/json',
                    'responseText': 'Response from WebMethodAdaptor'
                });
                promise.then((e: any) => {
                    result = 'Updated successfully';
                    done();
                });
            });
            afterAll(() => {
                jasmine.Ajax.uninstall();
            });
            it('check updated data', () => {
                expect(result).toBe('Updated successfully');
            });
            it('check params of post', () => {
                expect(request.params).
                    toEqual('{"value":{"_id":9,"EmployeeId":1009,"LastName":"John","FirstName":"Smith"},"action":"update","keyColumn":"_id","key":9,"table":null}');
            });
        });
        describe('remove method', () => {
            let result: string;
            let query: Query = new Query();
            beforeAll((done: Function) => {
                jasmine.Ajax.install();
                dataManager = new DataManager({
                    url: '/Default/Orders',
                    adaptor: new WebMethodAdaptor
                });
                let promise: Promise<Object> = (<Promise<Object>>dataManager.remove('RegionID', 4, query));
                let request: JasmineAjaxRequest = jasmine.Ajax.requests.mostRecent();
                request.respondWith({
                    'status': 200,
                    'contentType': 'application/json',
                    'responseText': 'Response from WebMethodAdaptor'
                });
                promise.then((e: any) => {
                    result = 'Removed successfully';
                    done();
                });
            });
            afterAll(() => {
                jasmine.Ajax.uninstall();
            });
            it('check data added properly', () => {
                expect(result).toBe('Removed successfully');
            });
        });
        describe('batchRequst method', () => {
            let result: any;
            let changes: any = { changedRecords: [], addedRecords: [], deletedRecords: [] };
            beforeAll((done: Function) => {
                jasmine.Ajax.install();
                changes.changedRecords.push({ RegionID: 1, RegionDescription: 'Southern' });
                changes.addedRecords.push({ RegionID: 5, RegionDescription: 'Southern' });
                changes.deletedRecords.push({ RegionID: 2, RegionDescription: 'Western' });
                dataManager = new DataManager({
                    url: '/Default/Orders',
                    adaptor: new WebMethodAdaptor
                });
                let promise: Promise<Object> = (<Promise<Object>>dataManager.saveChanges(changes, 'RegionID', new Query()));
                let request: JasmineAjaxRequest = jasmine.Ajax.requests.mostRecent();
                request.respondWith({
                    'status': 200,
                    'contentType': 'application/json',
                    'responseText': JSON.stringify(changes)
                });
                promise.then((e: any) => {
                    result = 'Batch request successfully';
                    done();
                });
            });
            afterAll(() => {
                jasmine.Ajax.uninstall();
            });
            it('check data updated properly', () => {
                expect(result).toBe('Batch request successfully');
            });
        });
    });

    describe('RemoteSaveAdaptor Adaptor', () => {
        let dataManager: DataManager;
        describe('batchRequst method', () => {
            let result: any;
            let changes: any = { changedRecords: [], addedRecords: [], deletedRecords: [] };
            beforeAll((done: Function) => {
                jasmine.Ajax.install();
                changes.changedRecords.push({ RegionID: 1, RegionDescription: 'Southern' });
                changes.addedRecords.push({ RegionID: 5, RegionDescription: 'Southern' });
                changes.deletedRecords.push({ RegionID: 2, RegionDescription: 'Western' });
                dataManager = new DataManager({
                    url: '/Home/Orders',
                    adaptor: new RemoteSaveAdaptor
                });
                let promise: Promise<Object> = (<Promise<Object>>dataManager.saveChanges(changes, 'RegionID', new Query()));
                let request: JasmineAjaxRequest = jasmine.Ajax.requests.mostRecent();
                request.respondWith({
                    'status': 200,
                    'contentType': 'application/json',
                    'responseText': '{"Response from WebMethodAdaptor": "response Text"}'
                });
                promise.then((e: any) => {
                    result = 'Batch request successfully';
                    done();
                });
            });
            afterAll(() => {
                jasmine.Ajax.uninstall();
            });
            it('check data updated properly', () => {
                expect(result).toBe('Batch request successfully');
            });
        });
    });

    describe('Cache Adaptor', () => {
        let result: Object[];
        let dataManager: DataManager;
        describe('To check DataManager with timeTillExpiration', () => {
            beforeAll((done: Function) => {
                dataManager = new DataManager({
                    url: 'http://mvc.syncfusion.com/Services/Northwnd.svc/Orders/',
                    enableCaching: true,
                    cachingPageSize: 10,
                    timeTillExpiration: 120000
                });
                let promise: Promise<Object> = dataManager.executeQuery(new Query().skip(10).take(5));
                promise.then((e: { result: Object[] }) => {
                    result = e.result;
                    done();
                });
            });
            it('generated data properly', () => {
                expect(result.length).toBe(5);
            });
        });
        describe('To check DataManager without timeTillExpiration', () => {
            beforeAll((done: Function) => {
                dataManager = new DataManager({
                    url: 'http://mvc.syncfusion.com/Services/Northwnd.svc/Orders/',
                    enableCaching: true,
                    cachingPageSize: 10
                });
                let promise: Promise<Object> = dataManager.executeQuery(new Query().skip(10).take(5));
                promise.then((e: { result: Object[] }) => {
                    result = e.result;
                    done();
                });
            });
            it('generated data properly', () => {
                expect(result.length).toBe(5);
            });
        });
        describe('To check DataManager without enableCaching', () => {
            beforeAll((done: Function) => {
                dataManager = new DataManager({
                    url: 'http://mvc.syncfusion.com/Services/Northwnd.svc/Orders/',
                    timeTillExpiration: 1,
                    adaptor: new CacheAdaptor
                });
                done();
            });
            it('generated data properly', () => {
                expect(dataManager).not.toBeNull;
            });
        });
        describe('page method', () => {
            beforeAll((done: Function) => {
                dataManager = new DataManager({
                    url: 'http://mvc.syncfusion.com/Services/Northwnd.svc/Orders/',
                    enableCaching: true,
                    cachingPageSize: 10,
                    timeTillExpiration: 1
                });
                let promise: Promise<Object> = dataManager.executeQuery(new Query().page(2, 3).take(15));
                promise.then((e: { result: Object[] }) => {
                    result = e.result;
                    done();
                });
            });
            it('check length of the data', () => {
                expect(result.length).toBe(3);
            });
        });
        describe('range method', () => {
            beforeAll((done: Function) => {
                dataManager = new DataManager({
                    url: 'http://mvc.syncfusion.com/Services/Northwnd.svc/Orders/',
                    enableCaching: true,
                    cachingPageSize: 10,
                    timeTillExpiration: 120000
                });
                let promise: Promise<Object> = dataManager.executeQuery(new Query().range(1, 2).take(5));
                promise.then((e: { result: Object[] }) => {
                    result = e.result;
                    done();
                });
            });
            it('check length of the data', () => {
                expect(result.length).toBe(1);
            });
        });
        describe('where method', () => {
            beforeAll((done: Function) => {
                dataManager = new DataManager({
                    url: 'http://mvc.syncfusion.com/Services/Northwnd.svc/Orders/',
                    enableCaching: true,
                    cachingPageSize: 10,
                    timeTillExpiration: 120000
                });
                let promise: Promise<Object> = dataManager.executeQuery(new Query().where('CustomerID', 'equal', 'VINET').take(5));
                promise.then((e: { result: Object[] }) => {
                    result = e.result;
                    done();
                });
            });
            it('generated data properly', () => {
                expect(result.length).toBe(5);
            });
            it('To check filtered properly".', () => {
                expect(result[0]["CustomerID"]).toEqual('VINET');
                expect(result[1]["CustomerID"]).toEqual('VINET');
            });
            describe('date filtering', () => {
                beforeAll((done: Function) => {
                    dataManager = new DataManager({
                        url: 'http://mvc.syncfusion.com/Services/Northwnd.svc/Orders/',
                        enableCaching: true,
                        cachingPageSize: 10,
                        timeTillExpiration: 120000
                    });
                    let promise: Promise<Object> = dataManager.executeQuery(new Query().
                        where('OrderDate', 'greaterThan', new Date('December 30, 2006 12:13:00')).take(5));
                    promise.then((e: { result: Object[] }) => {
                        result = e.result;
                        done();
                    });
                });
                it('generated data properly', () => {
                    expect(result.length).toBe(5);
                });
                it('generated data filtered properly', () => {
                    expect(new Date(result[0]["OrderDate"]) > new Date('December 30, 2006 12:13:00')).toBe(true);
                });
            });
        });
        describe('search method', () => {
            beforeAll((done: Function) => {
                dataManager = new DataManager({
                    url: 'http://mvc.syncfusion.com/Services/Northwnd.svc/Orders/',
                    enableCaching: true,
                    cachingPageSize: 10,
                    timeTillExpiration: 120000
                });
                let promise: Promise<Object> = dataManager.executeQuery(new Query().search(7, 'EmployeeID', 'equal').take(5));
                promise.then((e: { result: Object[] }) => {
                    result = e.result;
                    done();
                });
            });
            it('To check filtered data length".', () => {
                expect(result.length).toBe(5);
            });
            it('To check filtered properly".', () => {
                expect(result[0]["EmployeeID"]).toEqual(7);
                expect(result[1]["EmployeeID"]).toEqual(7);
            });
        });
        describe('sort method', () => {
            beforeAll((done: Function) => {
                dataManager = new DataManager({
                    url: 'http://mvc.syncfusion.com/Services/Northwnd.svc/Orders/',
                    enableCaching: true,
                    cachingPageSize: 10,
                    timeTillExpiration: 120000
                });
                let promise: Promise<Object> = dataManager.executeQuery(new Query().sortBy('EmployeeID', 'descending').take(5));
                promise.then((e: { result: Object[] }) => {
                    result = e.result;
                    done();
                });
            });
            it('To check sorted data length properly".', () => {
                expect(result.length).toBe(5);
            });
            it('To check filtered properly".', () => {
                expect(result[0]["EmployeeID"] >= result[1]["EmployeeID"]).toEqual(true);
                expect(result[1]["EmployeeID"] >= result[2]["EmployeeID"]).toEqual(true);
            });
            describe('array of field name in sort method', () => {
                beforeAll((done: Function) => {
                    dataManager = new DataManager({
                        url: 'http://mvc.syncfusion.com/Services/Northwnd.svc/Orders/',
                        enableCaching: true,
                        cachingPageSize: 10,
                        timeTillExpiration: 120000
                    });
                    let promise: Promise<Object> = dataManager.executeQuery(new Query().sortBy(['EmployeeID'], 'descending').take(5));
                    promise.then((e: { result: Object[] }) => {
                        result = e.result;
                        done();
                    });
                });
                it('To check sorted data length properly".', () => {
                    expect(result.length).toBe(5);
                });
                it('To check filtered properly".', () => {
                    expect(result[0]["EmployeeID"] >= result[1]["EmployeeID"]).toEqual(true);
                    expect(result[1]["EmployeeID"] >= result[2]["EmployeeID"]).toEqual(true);
                });
            });
            describe('invalid operator in sort method', () => {
                beforeAll((done: Function) => {
                    dataManager = new DataManager({
                        url: 'http://mvc.syncfusion.com/Services/Northwnd.svc/Orders/',
                        enableCaching: true,
                        cachingPageSize: 10,
                        timeTillExpiration: 120000
                    });
                    let promise: Promise<Object> = dataManager.executeQuery(new Query().sortBy('EmployeeID', 'descend').take(5));
                    promise.then((e: { result: Object[] }) => {
                        result = e.result;
                        done();
                    });
                });
                it('To check sorted data length properly".', () => {
                    expect(result.length).toBe(5);
                });
            });
            describe('array of field name with invalid operator in sort method', () => {
                beforeAll((done: Function) => {
                    dataManager = new DataManager({
                        url: 'http://mvc.syncfusion.com/Services/Northwnd.svc/Orders/',
                        enableCaching: true,
                        cachingPageSize: 10,
                        timeTillExpiration: 120000
                    });
                    let promise: Promise<Object> = dataManager.executeQuery(new Query().sortBy(['EmployeeID'], 'descend').take(5));
                    promise.then((e: { result: Object[] }) => {
                        result = e.result;
                        done();
                    });
                });
                it('To check sorted data length properly".', () => {
                    expect(result.length).toBe(5);
                });
            });
        });
        describe('aggregate method', () => {
            beforeAll((done: Function) => {
                dataManager = new DataManager({
                    url: 'http://mvc.syncfusion.com/Services/Northwnd.svc/Orders/',
                    enableCaching: true,
                    cachingPageSize: 10,
                    timeTillExpiration: 120000
                });
                let promise: Promise<Object> = dataManager.executeQuery(new Query().take(10).requiresCount().aggregate('sum', 'Freight'));
                promise.then((e: any) => {
                    result = e;
                    done();
                });
            });
            it('To check take data legnth.', () => {
                expect((<any>result).aggregates['Freight - sum']).toBe(409.88);
            });
        });
        describe('group method', () => {
            beforeAll((done: Function) => {
                dataManager = new DataManager({
                    url: 'http://mvc.syncfusion.com/Services/Northwnd.svc/Orders/',
                    enableCaching: true,
                    cachingPageSize: 10,
                    timeTillExpiration: 120000
                });
                let promise: Promise<Object> = dataManager.executeQuery(new Query().take(10).group('EmployeeID'));
                promise.then((e: any) => {
                    result = e.result;
                    done();
                });
            });
            it('check length of the data', () => {
                expect(result[0]["items"].length).toBe(10);
            });
            it('check field name from result', () => {
                expect(result[0]["field"]).toEqual('EmployeeID');
            });
        });
        describe('insert method', () => {
            let record: Object = { OrderID: 10980, EmployeeId: 4, Freight: 25.55, CustomerID: 'TOMSP' };
            let result: string;
            let query: Query = new Query();
            beforeAll((done: Function) => {
                jasmine.Ajax.install();
                dataManager = new DataManager({
                    url: 'http://mvc.syncfusion.com/Services/Northwnd.svc/Orders/',
                    enableCaching: true,
                    cachingPageSize: 10,
                    timeTillExpiration: 120000
                });
                let promise: Promise<Object> = (<Promise<Object>>dataManager.insert(record, query));
                let request: JasmineAjaxRequest = jasmine.Ajax.requests.mostRecent();
                request.respondWith({
                    'status': 200,
                    'contentType': 'application/json',
                    'responseText': 'Response from Cache Adaptor'
                });
                promise.then((e: any) => {
                    result = 'Inserted successfully';
                    done();
                });
            });
            afterAll(() => {
                jasmine.Ajax.uninstall();
            });
            it('check data added properly', () => {
                expect(result).toBe('Inserted successfully');
            });
        });
        describe('update method', () => {
            let record: Object = { OrderID: 10248, EmployeeId: 4, Freight: 78.55, CustomerID: 'VINET' };
            let result: string;
            let query: Query = new Query();
            beforeAll((done: Function) => {
                jasmine.Ajax.install();
                dataManager = new DataManager({
                    url: 'http://mvc.syncfusion.com/Services/Northwnd.svc/Orders/',
                    enableCaching: true,
                    cachingPageSize: 10,
                    timeTillExpiration: 120000
                });
                let promise: Promise<Object> = (<Promise<Object>>dataManager.update('OrderID', record, query));
                let request: JasmineAjaxRequest = jasmine.Ajax.requests.mostRecent();
                request.respondWith({
                    'status': 200,
                    'contentType': 'application/json',
                    'responseText': 'Response from CacheAdaptor'
                });
                promise.then((e: any) => {
                    result = 'Updated successfully';
                    done();
                });
            });
            afterAll(() => {
                jasmine.Ajax.uninstall();
            });
            it('check updated data', () => {
                expect(result).toBe('Updated successfully');
            });
        });
        describe('remove method', () => {
            let result: string;
            let query: Query = new Query();
            beforeAll((done: Function) => {
                jasmine.Ajax.install();
                dataManager = new DataManager({
                    url: 'http://mvc.syncfusion.com/Services/Northwnd.svc/Orders/',
                    enableCaching: true,
                    cachingPageSize: 10,
                    timeTillExpiration: 120000
                });
                let promise: Promise<Object> = (<Promise<Object>>dataManager.remove('OrderID', 10980, query));
                let request: JasmineAjaxRequest = jasmine.Ajax.requests.mostRecent();
                request.respondWith({
                    'status': 200,
                    'contentType': 'application/json',
                    'responseText': 'Response from CacheAdaptor'
                });
                promise.then((e: any) => {
                    result = 'Removed successfully';
                    done();
                });
            });
            afterAll(() => {
                jasmine.Ajax.uninstall();
            });
            it('check data Removed properly', () => {
                expect(result).toBe('Removed successfully');
            });
        });
        describe('batchRequst method', () => {
            let result: any;
            let changes: any = { changedRecords: [], addedRecords: [], deletedRecords: [] };
            beforeAll((done: Function) => {
                jasmine.Ajax.install();
                changes.changedRecords.push({ OrderID: 10248, EmployeeId: 4, Freight: 53.55, CustomerID: 'VINET' });
                changes.addedRecords.push({ OrderID: 10981, EmployeeId: 6, Freight: 78.55, CustomerID: 'VINET' });
                changes.deletedRecords.push({ OrderID: 10250, EmployeeId: 9, Freight: 8.0000, CustomerID: 'HANAR' });
                dataManager = new DataManager({
                    url: 'http://mvc.syncfusion.com/Services/Northwnd.svc/Orders/',
                    enableCaching: true,
                    cachingPageSize: 10,
                    timeTillExpiration: 120000
                });
                let promise: Promise<Object> = (<Promise<Object>>dataManager.saveChanges(changes, 'OrderID', new Query()));
                let request: JasmineAjaxRequest = jasmine.Ajax.requests.mostRecent();
                request.respondWith({
                    'status': 200,
                    'contentType': 'application/json',
                    'responseText': '{"Response from CacheAdaptor": "response"}'
                });
                promise.then((e: any) => {
                    result = 'Batch request successfully';
                    done();
                });
            });
            afterAll(() => {
                jasmine.Ajax.uninstall();
            });
            it('check data updated properly', () => {
                expect(result).toBe('Batch request successfully');
            });
        });
    });

    describe('UrlAdaptor Adaptor', () => {
        let dataManager: DataManager;
        let result: any;
        let data: Object[] = [
            { OrderID: 10248, CustomerID: 'VINET', EmployeeID: 7, Freight: 32.38, Guid: 'f89dee73-af9f-4cd4-b330-db93c25ff3c7' },
            { OrderID: 10249, CustomerID: 'AANAR', EmployeeID: 2, Freight: 11.61, Guid: 'db2d2186-1c29-4d1e-88ef-a127f521b9c6' },
            { OrderID: 10250, CustomerID: 'VICTE', EmployeeID: 7, Freight: 65.83, Guid: '6F9619FF-8B86-D011-B42D-00C04FC964FF' },
            { OrderID: 10251, CustomerID: 'VINET', EmployeeID: 7, Freight: 70.63, Guid: 'f89dee73-af9f-4cd4-b330-db93c25ff3c7' },
            { OrderID: 10252, CustomerID: 'SUPRD', EmployeeID: 6, Freight: 45.45, Guid: 'f89dee73-af9f-4cd4-b330-db93c25ff3c9' }
        ];
        describe('page method', () => {
            let adaptor = new UrlAdaptor;
            beforeAll((done: Function) => {
                jasmine.Ajax.install();
                dataManager = new DataManager({
                    url: '/Home/Employees',
                    adaptor: adaptor
                });
                let promise: Promise<Object> = dataManager.executeQuery(new Query().page(2, 3).take(5));
                let request: JasmineAjaxRequest = jasmine.Ajax.requests.mostRecent();
                request.respondWith({
                    'status': 200,
                    'contentType': 'application/json',
                    'responseText': JSON.stringify(data)
                });
                promise.then((e: { result: Object[] }) => {
                    result = e.result;
                    done();
                });
            });
            afterAll(() => {
                jasmine.Ajax.uninstall();
            });
            it('check length of the data', () => {
                expect(result.length).toBe(5);
                expect(adaptor.convertToQueryString({}, null, null)).toBe('');
            });
        });
        describe('range method', () => {
            beforeAll((done: Function) => {
                jasmine.Ajax.install();
                dataManager = new DataManager({
                    url: '/Home/Employees',
                    adaptor: new UrlAdaptor
                });
                let promise: Promise<Object> = dataManager.executeQuery(new Query().range(1, 2).take(5));
                let request: JasmineAjaxRequest = jasmine.Ajax.requests.mostRecent();
                request.respondWith({
                    'status': 200,
                    'contentType': 'application/json',
                    'responseText': JSON.stringify(data)
                });
                promise.then((e: { result: Object[] }) => {
                    result = e.result;
                    done();
                });
            });
            afterAll(() => {
                jasmine.Ajax.uninstall();
            });
            it('check length of the data', () => {
                expect(result.length).toBe(5);
            });
        });
        describe('where method', () => {
            beforeAll((done: Function) => {
                jasmine.Ajax.install();
                dataManager = new DataManager({
                    url: '/Home/Employees',
                    adaptor: new UrlAdaptor
                });
                let promise: Promise<Object> = dataManager.executeQuery(new Query().where('CustomerID', 'equal', 'VINET', true).take(5));
                let request: JasmineAjaxRequest = jasmine.Ajax.requests.mostRecent();
                request.respondWith({
                    'status': 200,
                    'contentType': 'application/json',
                    'responseText': JSON.stringify(data)
                });
                promise.then((e: { result: Object[] }) => {
                    result = e.result;
                    done();
                });
            });
            afterAll(() => {
                jasmine.Ajax.uninstall();
            });
            it('generated data properly', () => {
                expect(result.length).toBe(5);
            });
        });
        describe('group column', () => {
            let result: any;
            beforeAll((done: Function) => {
                jasmine.Ajax.install();
                dataManager = new DataManager({
                    url: '/Home/Employees',
                    adaptor: new UrlAdaptor
                });
                let promise: Promise<Object> = dataManager.executeQuery(new Query().group('EmployeeID').group('CustomerID'));
                let request: JasmineAjaxRequest = jasmine.Ajax.requests.mostRecent();
                request.respondWith({
                    'status': 200,
                    'contentType': 'application/json',
                    'responseText': JSON.stringify(data)
                });
                promise.then((e: Object) => {
                    result = e;
                    done();
                });
            });
            afterAll(() => {
                jasmine.Ajax.uninstall();
            });
            it('check data filtered properly', () => {
                expect(result.result[0]["items"].length).toBe(2);
            });
        });
        describe('group column with group data source', () => {
            let result: any;
            beforeAll((done: Function) => {
                jasmine.Ajax.install();
                dataManager = new DataManager({
                    url: '/Home/Employees',
                    adaptor: new UrlAdaptor
                });
                let promise: Promise<Object> = dataManager.executeQuery(new Query().group('EmployeeID').group('CustomerID').group('Guid'));
                let request: JasmineAjaxRequest = jasmine.Ajax.requests.mostRecent();
                request.respondWith({
                    'status': 200,
                    'contentType': 'application/json',
                    'responseText': JSON.stringify({ result: data, groupDs: data })
                });
                promise.then((e: Object) => {
                    result = e;
                    done();
                });
            });
            afterAll(() => {
                jasmine.Ajax.uninstall();
            });
            it('check data filtered properly', () => {
                expect(result.result[0]["items"].length).toBe(2);
            });
        });
        describe('aggregate method', () => {
            let result: any;
            beforeAll((done: Function) => {
                jasmine.Ajax.install();
                dataManager = new DataManager({
                    url: '/Home/Employees',
                    adaptor: new UrlAdaptor
                });
                let promise: Promise<Object> = dataManager.executeQuery(new Query().take(10).requiresCount().
                    aggregate('count', 'EmployeeID'));
                let request: JasmineAjaxRequest = jasmine.Ajax.requests.mostRecent();
                request.respondWith({
                    'status': 200,
                    'contentType': 'application/json',
                    'responseText': JSON.stringify({ result: data, count: 5 })
                });
                promise.then((e: Object) => {
                    result = e;
                    done();
                });
            });
            afterAll(() => {
                jasmine.Ajax.uninstall();
            });
            it('check data aggregate properly', () => {
                expect(result.aggregates['EmployeeID - count']).toBe(5);
            });
        });
        describe('aggregate method with return options', () => {
            let result: any;
            beforeAll((done: Function) => {
                jasmine.Ajax.install();
                dataManager = new DataManager({
                    url: '/Home/Employees',
                    adaptor: new UrlAdaptor
                });
                let promise: Promise<Object> = dataManager.executeQuery(new Query().take(10).requiresCount().
                    aggregate('count', 'EmployeeID'));
                let request: JasmineAjaxRequest = jasmine.Ajax.requests.mostRecent();
                request.respondWith({
                    'status': 200,
                    'contentType': 'application/json',
                    'responseText': JSON.stringify({ result: data, count: 5, aggregate: { 'EmployeeID - count': 5 } })
                });
                promise.then((e: Object) => {
                    result = e;
                    done();
                });
            });
            afterAll(() => {
                jasmine.Ajax.uninstall();
            });
            it('check data result properly', () => {
                expect(result.result.length).toBe(5);
            });
            it('check data count properly', () => {
                expect(result.count).toBe(5);
            });
        });
        describe('insert method', () => {
            let record: Object = { EmployeeId: 10, LastName: 'John', FirstName: 'Stephen' };
            let result: string;
            let query: Query = new Query();
            beforeAll((done: Function) => {
                jasmine.Ajax.install();
                dataManager = new DataManager({
                    url: '/Home/Employees',
                    adaptor: new UrlAdaptor
                });
                let promise: Promise<Object> = (<Promise<Object>>dataManager.insert(record, query));
                let request: JasmineAjaxRequest = jasmine.Ajax.requests.mostRecent();
                request.respondWith({
                    'status': 200,
                    'contentType': 'application/json',
                    'responseText': JSON.stringify({ d: data })
                });
                promise.then((e: any) => {
                    result = 'Inserted successfully';
                    done();
                });
            });
            afterAll(() => {
                jasmine.Ajax.uninstall();
            });
            it('check data added properly', () => {
                expect(result).toBe('Inserted successfully');
            });
        });
        describe('update method', () => {
            let record: Object = { _id: 9, EmployeeId: 1009, LastName: 'John', FirstName: 'Smith' };
            let result: string;
            let query: Query = new Query();
            beforeAll((done: Function) => {
                jasmine.Ajax.install();
                dataManager = new DataManager({
                    url: '/Home/Employees',
                    adaptor: new UrlAdaptor
                });
                let promise: Promise<Object> = (<Promise<Object>>dataManager.update('_id', record, query));
                let request: JasmineAjaxRequest = jasmine.Ajax.requests.mostRecent();
                request.respondWith({
                    'status': 200,
                    'contentType': 'application/json',
                    'responseText': JSON.stringify(data)
                });
                promise.then((e: any) => {
                    result = 'Updated successfully';
                    done();
                });
            });
            afterAll(() => {
                jasmine.Ajax.uninstall();
            });
            it('check updated data', () => {
                expect(result).toBe('Updated successfully');
            });
        });
        describe('remove method', () => {
            let result: string;
            let query: Query = new Query();
            beforeAll((done: Function) => {
                jasmine.Ajax.install();
                dataManager = new DataManager({
                    url: '/Home/Employees',
                    adaptor: new UrlAdaptor
                });
                let promise: Promise<Object> = (<Promise<Object>>dataManager.remove('EmployeeID', 4, query));
                let request: JasmineAjaxRequest = jasmine.Ajax.requests.mostRecent();
                request.respondWith({
                    'status': 200,
                    'contentType': 'application/json',
                    'responseText': JSON.stringify(data)
                });
                promise.then((e: any) => {
                    result = 'Removed successfully';
                    done();
                });
            });
            afterAll(() => {
                jasmine.Ajax.uninstall();
            });
            it('check data Removed properly', () => {
                expect(result).toBe('Removed successfully');
            });
        });
        describe('batchRequst method', () => {
            let result: any;
            let changes: any = { changedRecords: [], addedRecords: [], deletedRecords: [] };
            beforeAll((done: Function) => {
                jasmine.Ajax.install();
                changes.changedRecords.push(
                    { OrderID: 10248, CustomerID: 'AANAR', EmployeeID: 7, Freight: 23.38, Guid: 'f89dee73-af9f-4cd4-b330-db93c25ff3c7' });
                changes.addedRecords.push(
                    { OrderID: 10253, CustomerID: 'VINET', EmployeeID: 4, Freight: 35.38, Guid: 'f89dee73-af9f-4cd4-b330-db93c25ff3c7' });
                changes.deletedRecords.push(
                    { OrderID: 10253, CustomerID: 'VINET', EmployeeID: 4, Freight: 35.38, Guid: 'f89dee73-af9f-4cd4-b330-db93c25ff3c7' });
                dataManager = new DataManager({
                    url: '/Home/Employees',
                    adaptor: new UrlAdaptor
                });
                let promise: Promise<Object> = (<Promise<Object>>dataManager.saveChanges(changes, 'OrderID', new Query()));
                let request: JasmineAjaxRequest = jasmine.Ajax.requests.mostRecent();
                request.respondWith({
                    'status': 200,
                    'contentType': 'application/json',
                    'responseText': JSON.stringify({
                        result: data,
                        addedRecords: [{
                            OrderID: 10253, CustomerID: 'VINET', EmployeeID: 4,
                            Freight: 35.38, Guid: 'f89dee73-af9f-4cd4-b330-db93c25ff3c7'
                        }]
                    })
                });
                promise.then((e: any) => {
                    result = e;
                    done();
                });
            });
            afterAll(() => {
                jasmine.Ajax.uninstall();
            });
            it('check data updated properly', () => {
                expect(result).not.toBeNull;
            });
        });
        describe('xml format check', () => {
            let request: JasmineAjaxRequest;
            beforeAll((done: Function) => {
                jasmine.Ajax.install();
                dataManager = new DataManager({
                    url: '/api/Employees',
                    adaptor: new UrlAdaptor,
                    requiresFormat: true
                });
                let prom: Promise<Object> = dataManager.executeQuery(new Query());
                let result: RequestOptions;
                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith({
                    'status': 200,
                    'contentType': 'application/xml',
                    'responseText': '<xml><order></order></xml>'
                });
                prom.then((e: RequestOptions) => {
                    this.result = e.result;
                    done();
                });
            });
            afterAll(() => {
                jasmine.Ajax.uninstall();
            });
            it('xml format  - data check', () => {
                expect(this.result.length).toBe(0);
            });
        });
        describe('xml format check - no count', () => {
            let request: JasmineAjaxRequest;
            beforeAll((done: Function) => {
                jasmine.Ajax.install();
                dataManager = new DataManager({
                    url: '/api/Employees',
                    adaptor: new UrlAdaptor
                });
                let prom: Promise<Object> = dataManager.executeQuery(new Query().requiresCount());
                let result: RequestOptions;
                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith({
                    'status': 200,
                    'contentType': 'application/xml',
                    'responseText': '<xml><order></order></xml>'
                });
                prom.then((e: RequestOptions) => {
                    this.result = e.result;
                    done();
                });
            });
            afterAll(() => {
                jasmine.Ajax.uninstall();
            });
            it('xml format  - data check', () => {
                expect(this.result.length).toBe(0);
            });
        });

    });

});    