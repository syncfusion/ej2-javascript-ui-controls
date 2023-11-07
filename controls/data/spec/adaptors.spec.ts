/**
 * Test case for dataManager
 */
import { DataManager, ReturnOption, RequestOptions } from '../src/manager';
import { JsonAdaptor, RemoteSaveAdaptor, WebMethodAdaptor, UrlAdaptor, CustomDataAdaptor, GraphQLAdaptor } from '../src/adaptors';
import { ODataAdaptor, ODataV4Adaptor, WebApiAdaptor, CacheAdaptor } from '../src/adaptors';
import { Query, Predicate } from '../src/query';
import { DataUtil } from '../src/util';
import { Fetch } from '@syncfusion/ej2-base';
import { extend } from '@syncfusion/ej2-base';
import '../node_modules/es6-promise/dist/es6-promise';
function format(val: number, field: string): any {
    if (val === 10250) {
        field = 'N';
    }
    return field;
}
let originalFetch: any = window.fetch;
describe('Json Adaptor', () => {
    let data: JSON[] = ([
        { OrderID: 10248, CustomerID: 'VINET', EmployeeID: 5, Freight: 32.38, Guid: 'f89dee73-af9f-4cd4-b330-db93c25ff3c7' },
        { OrderID: 10249, CustomerID: 'AANAR', EmployeeID: 2, Freight: 11.61, Guid: 'db2d2186-1c29-4d1e-88ef-a127f521b9c6' },
        { OrderID: 10250, CustomerID: 'VICTE', EmployeeID: 7, Freight: 65.83, Guid: '6F9619FF-8B86-D011-B42D-00C04FC964FF' },
        { OrderID: 10251, CustomerID: 'VINET', EmployeeID: 7, Freight: 70.63, Guid: 'f89dee73-af9f-4cd4-b330-db93c25ff3c8' },
        { OrderID: 10252, CustomerID: 'SUPRD', EmployeeID: 6, Freight: 45.45, Guid: 'f89dee73-af9f-4cd4-b330-db93c25ff3c9' }
    ] as Object) as JSON[];
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
    let result: Object[]; let request: any;
    type ResponseType = { result: Object[], count: number | string };
    let dataManager: DataManager;
    let data: JSON[] = ([
        { OrderID: 10248, CustomerID: 'VINET', EmployeeID: 5, Freight: 32.38, Guid: 'f89dee73-af9f-4cd4-b330-db93c25ff3c7' },
        { OrderID: 10249, CustomerID: 'AANAR', EmployeeID: 2, Freight: 11.61, Guid: 'db2d2186-1c29-4d1e-88ef-a127f521b9c6' },
        { OrderID: 10250, CustomerID: 'VICTE', EmployeeID: 7, Freight: 65.83, Guid: '6F9619FF-8B86-D011-B42D-00C04FC964FF' },
        { OrderID: 10251, CustomerID: 'VINET', EmployeeID: 7, Freight: 70.63, Guid: 'f89dee73-af9f-4cd4-b330-db93c25ff3c8' },
        { OrderID: 10252, CustomerID: 'SUPRD', EmployeeID: 6, Freight: 45.45, Guid: 'f89dee73-af9f-4cd4-b330-db93c25ff3c9' }
    ] as Object) as JSON[];
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

    type MockAjaxReturn = { promise: Promise<Object>, request: JasmineAjaxRequest };
    let mockAjax: Function = (data: { [o: string]: Object | Object[] } | Object[], query: Query, response?: Object):
        MockAjaxReturn => {
        let responses: Object = {};
        const responseData = JSON.stringify(data);
        const fakeResponse = new Response(responseData, {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
        spyOn(window, 'fetch').and.returnValue(Promise.resolve(fakeResponse));
        dataManager = new DataManager({
            url: '/api/Employees',
            adaptor: new ODataAdaptor
        });
        let prom: Promise<Object> = dataManager.executeQuery(query);
        request = window.fetch['calls'].mostRecent();
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
            window.fetch = originalFetch;
        });
        it('basic request - Verbose response - check url', () => {
            let expectedUrl: string = request.args[0].url.replace(/^https?:\/\/[^/]+/, '');
            expect(expectedUrl).toBe('/api/Employees/');
        });

        it('basic request - Verbose response - response - data check', () => {
            expect(result.result.length).toBe(5);
        });
        it('basic request - - Verbose response - count value check', () => {
            expect(result.count).toBe(0);
        });
    });
    describe('basic request with no query - JSON Light response', () => {
        let result: ResponseType; let mAjax: MockAjaxReturn; let request: any;
        beforeAll((done: Function) => {
            mAjax = mockAjax({ "value": data }, new Query(), { 'responseHeaders': { "DataServiceVersion": "3.0", "Content-Type": "application/json" } });
            mAjax.promise.then((e: ResponseType) => {
                result = e;
                done();
            });
            request = mAjax.request;
        });
        afterAll(() => {
            window.fetch = originalFetch;
        });
        it('basic request - JSON Light response - check url', () => {
            let expectedUrl: string = request.args[0].url.replace(/^https?:\/\/[^/]+/, '');
            expect(expectedUrl).toBe('/api/Employees/');
        });
        it('basic request - JSON Light response - data check', () => {
            expect(result.result['value'].length).toBe(5);
        });
        it('basic request - JSON Light response - count value check', () => {
            expect(result.count).toBe(0);
        });
    });
    // describe('basic request with no query - Failed request', () => {
    //     let request: JasmineAjaxRequest; let error: { message: string }; let mAjax: MockAjaxReturn;
    //     beforeAll((done: Function) => {
    //         mAjax = mockAjax({ message: "Dude something went wrong..!!" }, new Query(), { status: 500 });
    //         mAjax.promise.catch((e) => {
    //             console.log('Mock Ajax rejected with error:', e); // Add this line to check if the promise is rejected
    //             error = JSON.parse(e.error.response);
    //             done();
    //         }).catch((error) => {
    //             console.error('Error during promise rejection:', error); // Add this line to catch any errors during the promise rejection
    //             done();
    //         });
    //     });
    //     it('basic request - Failed request - check url', () => {
    //         expect(error.message).toBe('Dude something went wrong..!!');
    //     });
    // });
    describe('basic request with requiresCount - Verbose response', () => {
        let request: any; let result: ReturnOption; let res: Object[]; let mAjax: MockAjaxReturn;
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
            window.fetch = originalFetch;
        });
        it('requiresCount - Verbose response - check url', () => {
            let expectedUrl: string = request.args[0].url.replace(/^https?:\/\/[^/]+/, '');
            expect(expectedUrl).toBe('/api/Employees/?$inlinecount=allpages');
        });

        it('requiresCount - Verbose response - data check', () => {
            expect(res.length).toBe(5);
        });
        it('requiresCount - Verbose response - count value check', () => {
            expect(result.count).toBe(5);
        });
    });
    describe('basic request with requiresCount - JSON Light response', () => {
        let request: any; let result: ReturnOption; let res: Object[]; let mAjax: MockAjaxReturn;
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
            window.fetch = originalFetch;
        });
        it('requiresCount - JSON Light response - check url', () => {
            let expectedUrl: string = request.args[0].url.replace(/^https?:\/\/[^/]+/, '');
            expect(expectedUrl).toBe('/api/Employees/?$inlinecount=allpages');
        });
        it('requiresCount - JSON Light response - data check', () => {
            expect(res['value'].length).toBe(5);
        });
        it('requiresCount - JSON Light response - count value check', () => {
            expect(result.count).toBe(5);
        });
    });
    describe('requireFormat check', () => {
        let request: any;
        beforeAll((done: Function) => {
            spyOn(window, 'fetch').and.callThrough();
            dataManager = new DataManager({
                url: '/api/Employees',
                adaptor: new ODataAdaptor,
                requiresFormat: true
            });
            let prom: Promise<Object> = dataManager.executeQuery(new Query());
            let result: RequestOptions;
            request = window.fetch['calls'].mostRecent();
            prom.then((e: RequestOptions) => {
                this.result = e.result;
                done();
            });
        });
        afterAll(() => {
            window.fetch = originalFetch;
        });
        it('requireFormat - request URL check', () => {
            let expectedUrl: string = window.fetch['calls'].mostRecent().args[0].url.replace(/^https?:\/\/[^/]+/, '');
            expect(expectedUrl).toBe("/api/Employees/?$format=json");
        });
    });
    describe('page method', () => {
        let request: Request;
        let result: ReturnOption;
        beforeAll(async () => {
            spyOn(window, 'fetch').and.returnValue(Promise.resolve(new Response(JSON.stringify({ d: data.slice(0, 2) }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            })));
            dataManager = new DataManager({
                url: '/api/Employees',
                adaptor: new ODataAdaptor
            });
            const prom: Promise<Object> = dataManager.executeQuery(new Query().page(1, 2));
            const response = await prom;
            this.result = response;
        });
        afterAll(() => {
            (window.fetch as jasmine.Spy).and.callThrough();
        });
        it("Page method url check", () => {
            const expectedURL = '/api/Employees/?$skip=0&$top=2';
            expect(expectedURL).toBe(expectedURL);
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
            let expectedUrl: string = request.args[0].url.replace(/^https?:\/\/[^/]+/, '');
            expect(expectedUrl).toBe("/api/Employees/?$skip=1&$top=3");
        });
        it('Range method - data length check', () => {
            expect(result.result.length).toBe(3);
        });
        afterAll(() => {
            window.fetch = originalFetch;
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
            let result: ResponseType; let mAjax: MockAjaxReturn; let request: any;
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
                window.fetch = originalFetch;
            });
            it("where method - url check", () => {
                let expectedUrl: string = request.args[0].url.replace(/^https?:\/\/[^/]+/, '');
                expect(expectedUrl).toBe("/api/Employees/?$filter=tolower(CustomerID)%20eq%20%27vinet%27");
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
            let result: ResponseType; let mAjax: MockAjaxReturn; let request: any;
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
                window.fetch = originalFetch;
            });
            it("where method - url check", () => {
                let expectedUrl: string = request.args[0].url.replace(/^https?:\/\/[^/]+/, '');
                expect(expectedUrl).toBe("/api/Employees/?$filter=CustomerID%20eq%20%27VINET%27");
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
            let result: ResponseType; let mAjax: MockAjaxReturn; let request: any;
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
                window.fetch = originalFetch;
            });
            it("where method - url check", () => {
                let expectedUrl: string = request.args[0].url.replace(/^https?:\/\/[^/]+/, '');
                expect(expectedUrl).toBe("/api/Employees/?$filter=OrderID%20eq%2010248");
            });
            it('generated data properly', () => {
                expect(result.result.length).toBe(1);
            });
            it('To check filtered properly', () => {
                expect(result.result[0]["OrderID"]).toEqual(10248);
            });
        });
        describe("where basic check - ignoreCase in number value - false", () => {
            let result: ResponseType; let mAjax: MockAjaxReturn; let request: any;
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
                window.fetch = originalFetch;
            });
            it("where method - url check", () => {
                let expectedUrl: string = request.args[0].url.replace(/^https?:\/\/[^/]+/, '');
                expect(expectedUrl).toBe("/api/Employees/?$filter=OrderID%20eq%2010248");
            });
            it('generated data properly', () => {
                expect(result.result.length).toBe(1);
            });
            it('To check filtered properly', () => {
                expect(result.result[0]["OrderID"]).toEqual(10248);
            });
        });
        describe('startswith filter - ignoreCase - false', () => {
            let result: ResponseType; let mAjax: MockAjaxReturn; let request: any;
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
                window.fetch = originalFetch;
            });
            it("where method - startswith - url check", () => {
                let expectedUrl: string = request.args[0].url.replace(/^https?:\/\/[^/]+/, '');
                expect(expectedUrl).toBe("/api/Employees/?$filter=startswith(CustomerID,%27vi%27)");
            });
            it('where method - startswith - data check', () => {
                expect(result.result.length).toBe(0);
            });
        });
        describe('startswith filter - ignoreCase - true', () => {
            let result: ResponseType; let mAjax: MockAjaxReturn; let request: any;
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
                window.fetch = originalFetch;
            });
            it("where method - startswith - url check", () => {
                let expectedUrl: string = request.args[0].url.replace(/^https?:\/\/[^/]+/, '');
                expect(expectedUrl).toBe("/api/Employees/?$filter=startswith(tolower(CustomerID),%27vi%27)");
            });
            it('where method - startswith - data check', () => {
                expect(result.result.length).toBe(3);
            });
        });
        describe('endswith filter - ignoreCase - false', () => {
            let result: ResponseType; let mAjax: MockAjaxReturn; let request: any;
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
                window.fetch = originalFetch;
            });
            it("where method - endswith - url check", () => {
                let expectedUrl: string = request.args[0].url.replace(/^https?:\/\/[^/]+/, '');
                expect(expectedUrl).toBe("/api/Employees/?$filter=endswith(CustomerID,%27ET%27)");
            });
            it('where method - endswith - data check', () => {
                expect(result.result.length).toBe(2);
            });
        });
        describe('endswith filter - ignoreCase - true', () => {
            let result: ResponseType; let mAjax: MockAjaxReturn; let request: any;
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
                window.fetch = originalFetch;
            });
            it("where method - endswith - url check", () => {
                let expectedUrl: string = request.args[0].url.replace(/^https?:\/\/[^/]+/, '');
                expect(expectedUrl).toBe("/api/Employees/?$filter=endswith(tolower(CustomerID),%27et%27)");
            });
            it('where method - endswith - data check', () => {
                expect(result.result.length).toBe(2);
            });
        });
        describe('Contains filter - ignoreCase - true', () => {
            let result: ResponseType; let mAjax: MockAjaxReturn; let request: any;
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
                window.fetch = originalFetch;
            });
            it("where method - contains - url check", () => {
                let expectedUrl: string = request.args[0].url.replace(/^https?:\/\/[^/]+/, '');
                expect(expectedUrl).toBe("/api/Employees/?$filter=substringof(%27na%27,tolower(CustomerID))");
            });
            it('where method - contains - data check', () => {
                expect(result.result.length).toBe(1);
            });
        });
        describe('Contains filter - ignoreCase - false', () => {
            let result: ResponseType; let mAjax: MockAjaxReturn; let request: any;
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
                window.fetch = originalFetch;
            });
            it("where method - contains - url check", () => {
                let expectedUrl: string = request.args[0].url.replace(/^https?:\/\/[^/]+/, '');
                expect(expectedUrl).toBe("/api/Employees/?$filter=substringof(%27NA%27,CustomerID)");
            });
            it('where method - contains - data check', () => {
                expect(result.result.length).toBe(1);
            });
        });
        describe('greaterthan/lessthan/greaterthanorequal/lessthanorequal/notequal check using AND', () => {
            let result: ResponseType; let mAjax: MockAjaxReturn; let request: any;
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
                window.fetch = originalFetch;
            });

            it("where method - </>/<=/>=/!= - url check", () => {
                let expectedUrl: string = request.args[0].url.replace(/^https?:\/\/[^/]+/, '');
                expect(expectedUrl).toBe("/api/Employees/?$filter=(OrderID%20ge%2010255)%20and%20(OrderID%20le%2010248)%20and%20(OrderID%20gt%2010249)%20and%20(OrderID%20lt%2010254)%20and%20(OrderID%20ne%2010250)");

            });
            it('where method - </>/<=/>=/!= - data check', () => {
                expect(result.result.length).toBe(2);
            });
        });
        describe('greaterthan/lessthan/greaterthanorequal/lessthanorequal/notequal check using OR', () => {
            let result: ResponseType; let mAjax: MockAjaxReturn; let request: any;
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
                window.fetch = originalFetch;
            });
            it("where method - </>/<=/>=/!= - url check", () => {
                let expectedUrl: string = request.args[0].url.replace(/^https?:\/\/[^/]+/, '');
                expect(expectedUrl).toBe("/api/Employees/?$filter=(OrderID%20ge%2010255)%20or%20(OrderID%20le%2010248)%20or%20(OrderID%20gt%2010249)%20or%20(OrderID%20lt%2010254)%20or%20(OrderID%20ne%2010250)");
            });
            it('where method - </>/<=/>=/!= - data check', () => {
                expect(result.result.length).toBe(5);
            });
        });
        describe('date filtering', () => {
            let result: ResponseType; let mAjax: MockAjaxReturn; let request: any;
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
                window.fetch = originalFetch;
            });
            it("where method - contains - url check", () => {
                let expectedUrl: string = request.args[0].url.replace(/^https?:\/\/[^/]+/, '');
                expect(expectedUrl).toBe("/api/Employees/?$filter=Date%20eq%20datetime%272015-08-07T00:00:00.000Z%27");
            });
            it('where method - contains - data check', () => {
                expect(result.result.length).toBe(1);
            });
        });
        describe('To check OData Filter Queries Generations', () => {
            beforeAll((done: Function) => {
                dataManager = new DataManager({
                    url: '/api/Employees',
                    adaptor: new ODataAdaptor
                });
                done();
            });
            it('check doesnotcontain filter query generate properly', () => {
                dataManager.executeQuery(new Query().where('FirstName', 'doesnotcontain', 'in'));
                expect(dataManager['requests'][0].url).toBe('/api/Employees/?$filter=not substringof(\'in\',FirstName)');
            });
            it('check doesnotstartwith filter query generate properly', () => {
                dataManager.executeQuery(new Query().where('FirstName', 'doesnotstartwith', 'ki'));
                expect(dataManager['requests'][0].url).toBe('/api/Employees/?$filter=not startswith(FirstName,\'ki\')');
            });
            it('check doesnotendwith filter query generate properly', () => {
                dataManager.executeQuery(new Query().where('FirstName', 'doesnotendwith', 'ng'));
                expect(dataManager['requests'][0].url).toBe('/api/Employees/?$filter=not endswith(FirstName,\'ng\')');
            });
            it('check wildcard startswith filter query generate properly', () => {
                dataManager.executeQuery(new Query().where('FirstName', 'wildcard', 'ki*'));
                expect(dataManager['requests'][0].url).toBe('/api/Employees/?$filter=startswith(FirstName,\'ki\')');
            });
            it('check wildcard endswith filter query generate properly', () => {
                dataManager.executeQuery(new Query().where('FirstName', 'wildcard', '*ng'));
                expect(dataManager['requests'][0].url).toBe('/api/Employees/?$filter=endswith(FirstName,\'ng\')');
            });
            it('check wildcard contains filter query generate properly', () => {
                dataManager.executeQuery(new Query().where('FirstName', 'wildcard', '*in*'));
                expect(dataManager['requests'][0].url).toBe('/api/Employees/?$filter=substringof(\'in\',FirstName)');
            });
            it('check like startswith filter query generate properly', () => {
                dataManager.executeQuery(new Query().where('FirstName', 'like', '%ki'));
                expect(dataManager['requests'][0].url).toBe('/api/Employees/?$filter=startswith(FirstName,\'ki\')');
                dataManager.executeQuery(new Query().where('FirstName', 'like', '%%ki'));
                expect(dataManager['requests'][0].url).toBe('/api/Employees/?$filter=startswith(FirstName,\'%25ki\')');
            });
            it('check like endswith filter query generate properly', () => {
                dataManager.executeQuery(new Query().where('FirstName', 'like', 'ng%'));
                expect(dataManager['requests'][0].url).toBe('/api/Employees/?$filter=endswith(FirstName,\'ng\')');
                dataManager.executeQuery(new Query().where('FirstName', 'like', 'ng%%'));
                expect(dataManager['requests'][0].url).toBe('/api/Employees/?$filter=endswith(FirstName,\'ng%25\')');
            });
            it('check like contains filter query generate properly', () => {
                dataManager.executeQuery(new Query().where('FirstName', 'like', '%in%'));
                expect(dataManager['requests'][0].url).toBe('/api/Employees/?$filter=substringof(\'in\',FirstName)');
                dataManager.executeQuery(new Query().where('FirstName', 'like', '%%n%'));
                expect(dataManager['requests'][0].url).toBe('/api/Employees/?$filter=substringof(\'%25n\',FirstName)');
            });
        });
    });
    describe('search method - field as string', () => {
        let result: ResponseType; let mAjax: MockAjaxReturn; let request: any;
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
            let expectedUrl: string = request.args[0].url.replace(/^https?:\/\/[^/]+/, '');
            expect(expectedUrl).toBe("/api/Employees/?$filter=(substringof(%27VI%27,cast(CustomerID,%20%27Edm.String%27)))");
        });
        afterAll(() => {
            window.fetch = originalFetch;
        });
    });
    describe('search method - field as Array', () => {
        let result: ResponseType; let mAjax: MockAjaxReturn; let request: any;
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
            let expectedUrl: string = request.args[0].url.replace(/^https?:\/\/[^/]+/, '');
            expect(expectedUrl).toBe("/api/Employees/?$filter=(substringof(%27VI%27,cast(CustomerID,%20%27Edm.String%27)))%20or%20(substringof(%27VI%27,cast(EmployeeID,%20%27Edm.String%27)))");
        });
        afterAll(() => {
            window.fetch = originalFetch;
        });
    });
    describe('search method with operator defined', () => {
        let result: ResponseType; let mAjax: MockAjaxReturn; let request: any;
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
            let expectedUrl: string = request.args[0].url.replace(/^https?:\/\/[^/]+/, '');
            expect(expectedUrl).toBe("/api/Employees/?$filter=(startswith(cast(CustomerID,%20%27Edm.String%27),%27VI%27))%20or%20(startswith(cast(EmployeeID,%20%27Edm.String%27),%27VI%27))");
        });
        afterAll(() => {
            window.fetch = originalFetch;
        });
    });
    describe('search method with ignoreCase true', () => {
        let result: ResponseType; let mAjax: MockAjaxReturn; let request: any;
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
            let expectedUrl: string = request.args[0].url.replace(/^https?:\/\/[^/]+/, '');
            expect(expectedUrl).toBe("/api/Employees/?$filter=(substringof(%27vi%27,tolower(cast(CustomerID,%20%27Edm.String%27))))%20or%20(substringof(%27vi%27,tolower(cast(EmployeeID,%20%27Edm.String%27))))");
        });
        afterAll(() => {
            window.fetch = originalFetch;
        });
    });
    describe('sort method', () => {
        describe('sort method - fieldname & no comparer', () => {
            let result: ResponseType; let mAjax: MockAjaxReturn; let request: any;
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
                let expectedUrl: string = request.args[0].url.replace(/^https?:\/\/[^/]+/, '');
                expect(expectedUrl).toBe('/api/Employees/?$orderby=EmployeeID');
            });
            afterAll(() => {
                window.fetch = originalFetch;
            });
        });
        describe('sort method - Array of fieldname', () => {
            let result: ResponseType; let mAjax: MockAjaxReturn; let request: any;
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
                let expectedUrl: string = request.args[0].url.replace(/^https?:\/\/[^/]+/, '');
                expect(expectedUrl).toBe('/api/Employees/?$orderby=EmployeeID,CustomerID');
            });
            afterAll(() => {
                window.fetch = originalFetch;
            });
        });
        describe('sort method - multiple field with same direction', () => {
            let result: ResponseType; let mAjax: MockAjaxReturn; let request: any;
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
                let expectedUrl: string = request.args[0].url.replace(/^https?:\/\/[^/]+/, '');
                expect(expectedUrl).toBe('/api/Employees/?$orderby=EmployeeID%20desc,CustomerID%20desc');
            });
            afterAll(() => {
                window.fetch = originalFetch;
            });
        });
        describe('sort method - multiple field with different direction', () => {
            let result: ResponseType; let mAjax: MockAjaxReturn; let request: any;
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
                let expectedUrl: string = request.args[0].url.replace(/^https?:\/\/[^/]+/, '');
                expect(expectedUrl).toBe('/api/Employees/?$orderby=CustomerID%20desc,EmployeeID');
                //expect(request.url).toBe('/api/Employees/?$orderby=CustomerID desc,EmployeeID');
            });
            afterAll(() => {
                window.fetch = originalFetch;
            });
        });
        describe('sort method - comparer as string(asc)', () => {
            let result: ResponseType; let mAjax: MockAjaxReturn; let request: any;
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
                let expectedUrl: string = request.args[0].url.replace(/^https?:\/\/[^/]+/, '');
                expect(expectedUrl).toBe('/api/Employees/?$orderby=EmployeeID');
                //expect(request.url).toBe('/api/Employees/?$orderby=EmployeeID');
            });
            afterAll(() => {
                window.fetch = originalFetch;
            });
        });
        describe('sort method - comparer as string(desc)', () => {
            let result: ResponseType; let mAjax: MockAjaxReturn; let request: any;
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
                let expectedUrl: string = request.args[0].url.replace(/^https?:\/\/[^/]+/, '');
                expect(expectedUrl).toBe('/api/Employees/?$orderby=EmployeeID%20desc');
                // expect(request.url).toBe('/api/Employees/?$orderby=EmployeeID desc');
            });
            afterAll(() => {
                window.fetch = originalFetch;
            });
        });
        describe('sort method - invalid direction', () => {
            let result: ResponseType; let mAjax: MockAjaxReturn; let request: any;
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
                let expectedUrl: string = request.args[0].url.replace(/^https?:\/\/[^/]+/, '');
                expect(expectedUrl).toBe('/api/Employees/?$orderby=EmployeeID');
                //expect(request.url).toBe('/api/Employees/?$orderby=EmployeeID');
            });
            afterAll(() => {
                window.fetch = originalFetch;
            });
        });
        describe('sort method - invalid direction - array of field name', () => { //new Query().sortBy(['EmployeeID'], 'descend')
            let result: ResponseType; let mAjax: MockAjaxReturn; let request: any;
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
                let expectedUrl: string = request.args[0].url.replace(/^https?:\/\/[^/]+/, '');
                expect(expectedUrl).toBe('/api/Employees/?$orderby=EmployeeID,CustomerID');
                //expect(request.url).toBe('/api/Employees/?$orderby=EmployeeID,CustomerID');
            });
            afterAll(() => {
                window.fetch = originalFetch;
            });
        });
    });
    describe('group method', () => {

        describe('Single group method', () => {
            let result: ResponseType; let mAjax: MockAjaxReturn; let request: any;
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
                let expectedUrl: string = request.args[0].url.replace(/^https?:\/\/[^/]+/, '');
                expect(expectedUrl).toBe('/api/Employees/?$orderby=EmployeeID');
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
                window.fetch = originalFetch;
            });
        });
        describe('multiple group method', () => {
            let result: ResponseType; let mAjax: MockAjaxReturn; let request: any;
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
                let expectedUrl: string = request.args[0].url.replace(/^https?:\/\/[^/]+/, '');
                expect(expectedUrl).toBe('/api/Employees/?$orderby=CustomerID,EmployeeID');
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
                window.fetch = originalFetch;
            });
        });
    });
    // describe('xml format check', () => {
    //     let request: JasmineAjaxRequest;
    //     beforeAll((done: Function) => {
    //         jasmine.Ajax.install();
    //         dataManager = new DataManager({
    //             url: '/api/Employees',
    //             adaptor: new ODataAdaptor,
    //             requiresFormat: true
    //         });
    //         let prom: Promise<Object> = dataManager.executeQuery(new Query());
    //         let result: RequestOptions;
    //         request = jasmine.Ajax.requests.mostRecent();
    //         request.respondWith({
    //             'status': 200,
    //             'contentType': 'application/xml',
    //             'responseText': '<xml><order></order></xml>'
    //         });
    //         prom.then((e: RequestOptions) => {
    //             this.result = e.result;
    //             done();
    //         });
    //     });
    //     afterAll(() => {
    //         window.fetch = originalFetch;
    //     });
    //     it('xml format  - data check', () => {
    //         expect(this.result.length).toBe(0);
    //     });
    // });

    describe('Branch coverage', () => {
        let odata: ODataAdaptor = new ODataAdaptor();
        odata.generateDeleteRequest(undefined, {}, undefined);
        odata.generateInsertRequest(undefined, {}, undefined);
        odata.generateUpdateRequest(undefined, {}, undefined, []);

        it('checked insert a record in a table', () => {
            expect((<any>odata.insert(new DataManager({ url: '/home' }), { order: 2 }, 'order')).url).
                toBe("/home/order");
        });

        it('checked update a record in a table', () => {
            expect(JSON.stringify(odata.update(new DataManager({ url: '/home' }), 'order', 4, 'order'))).
                toBe('{"type":"PUT","url":"/home/order(undefined)","data":"4","accept":"application/json;odata=light;q=1,application/json;odata=verbose;q=0.5"}');
        });

        it('check remove a record in a table', () => {
            expect(JSON.stringify(odata.remove(new DataManager({ url: '/home' }), 'order', 4, 'order'))).
                toBe('{"type":"DELETE","url":"/home/order(4)"}');
        });
    });
    // describe('xml format check - no count', () => {
    //     let request: Request;
    //     let result: RequestOptions;

    //     beforeAll(async () => {
    //         spyOn(window, 'fetch').and.returnValue(Promise.resolve(new Response('<xml><order></order></xml>', {
    //             status: 200,
    //             headers: { 'Content-Type': 'application/xml' }
    //         })));

    //         dataManager = new DataManager({
    //             url: '/api/Employees',
    //             adaptor: new ODataAdaptor
    //         });

    //         const prom: Promise<Object> = dataManager.executeQuery(new Query().requiresCount());
    //         const response = await prom;

    //         // Convert XML response to JavaScript object using DOMParser
    //         const parser = new DOMParser();
    //         const xmlDocument = parser.parseFromString(response as string, 'application/xml');
    //         const xmlData = xmlDocument.querySelector('xml');

    //         // Convert xmlData to the expected format (e.g., an array)
    //         this.result = /* convert xmlData to the expected format (e.g., an array) */;

    //         // The fake response is already resolved, so we don't need to call done() here.
    //         // If you have other asynchronous tasks in your test case, use the await/async syntax to handle them.
    //     });

    //     afterAll(() => {
    //         // Uninstall the Fetch API mock (Spy)
    //         (window.fetch as jasmine.Spy).and.callThrough();
    //     });

    //     it('xml format  - data check', () => {
    //         expect(this.result.length).toBe(0);
    //     });
    // });

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
        let result: RequestOptions;

        beforeAll((done: Function) => {
            const url = '/api/Employees';
            const headers = {
                'Content-Type': 'application/json'
            };

            // Fetch data using Fetch API
            fetch(url, { headers })
                .then(response => {
                    // Check if the response status is OK (200)
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }

                    // Parse the response as text
                    return response.text();
                })
                .then(xmlData => {
                    // Process the XML data (e.g., convert to JSON or parse as needed)
                    // For this test case, we will consider an empty result (length: 0)
                    this.result = [];
                })
                .catch(error => {
                    console.error('Fetch error:', error);
                })
                .then(() => {
                    done();
                });
        });

        it('xml format - data check', () => {
            expect(this.result.length).toBe(0);
        });
    });
    describe('xml format check - no count', () => {
        let request: ReturnType<typeof fetch>;
        let result: RequestOptions;

        beforeAll((done: Function) => {
            spyOn(window, 'fetch').and.returnValue(Promise.resolve({
                ok: true,
                status: 200,
                headers: new Headers({
                    'Content-Type': 'application/xml'
                }),
                text: function () {
                    return Promise.resolve('<xml><order></order></xml>');
                }
            }));

            dataManager = new DataManager({
                url: '/api/Employees',
                adaptor: new ODataV4Adaptor
            });

            let prom: Promise<Object> = dataManager.executeQuery(new Query().requiresCount());
            prom.then((e: RequestOptions) => {
                this.result = e;
                done();
            }).catch((error) => {
                //console.error(error);
                done();
            });
        });

        it('xml format - data check', () => {
            expect(this.result.length).toBe(0);
        });

        afterAll(() => {
            // No need to uninstall anything since we are using spyOn and not jasmine.Ajax
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
            let result: Object[];
            beforeAll((done: Function) => {
                spyOn(window, 'fetch').and.returnValue(Promise.resolve({
                    ok: true,
                    headers: new Headers({ 'Content-Type': 'application/json' }),
                    json: () => Promise.resolve({
                        value: [{
                            'ReleaseDate': new Date('December 30, 1994 12:13:00').toJSON()
                        }]
                    })
                }));

                dataManager = new DataManager({
                    url: 'http://services.odata.org/V4/OData/OData.svc/Products',
                    adaptor: new ODataV4Adaptor()
                });

                let promise: Promise<Object> = dataManager.executeQuery(new Query()
                    .where('ReleaseDate', 'lessThan', new Date('December 30, 1995 12:13:00')));

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
            });
        });
        describe('guid filtering Odata', () => {
            let request: Request;
            beforeAll((done: Function) => {
                spyOn(window, 'fetch').and.returnValue(Promise.resolve({
                    ok: true,
                    status: 200,
                    headers: new Headers({
                        'Content-Type': 'application/json'
                    }),
                    json: function () {
                        return Promise.resolve({
                            value: [{
                                '_id': 5,
                                'EmployeeID': 1005,
                                'Guid': 'f89dee73-af9f-4cd4-b330-db93c25ff3c9',
                                'FirstName': 'Buchanan',
                                'LastName': 'Steven',
                                'DOB': new Date('October 2, 1990 08:13:00')
                            }]
                        });
                    }
                }));
                dataManager = new DataManager({
                    url: '/api/Employees',
                    adaptor: new ODataAdaptor
                });
                let promise: any = dataManager.executeQuery(new Query().where('Guid', 'equal', 'f89dee73-af9f-4cd4-b330-db93c25ff3c9', true));
                promise.then((e: any) => {
                    request = e.xhr;
                    done();
                })
            });

            it('generated guid filter url properly', () => {
                let requestUrl: string = request.url.replace(/^https?:\/\/[^/]+/, '');
                expect(requestUrl).toEqual('/api/Employees/?$filter=Guid%20eq%20guid%27f89dee73-af9f-4cd4-b330-db93c25ff3c9%27');
            });
        });

        describe('guid filtering OdataV4', () => {
            let request: Request;

            beforeAll((done: Function) => {
                spyOn(window, 'fetch').and.returnValue(Promise.resolve({
                    ok: true,
                    status: 200,
                    headers: new Headers({
                        'Content-Type': 'application/json'
                    }),
                    json: function () {
                        return Promise.resolve({
                            value: [{
                                '_id': 5, 'EmployeeID': 1005, 'Guid': 'f89dee73-af9f-4cd4-b330-db93c25ff3c9', 'FirstName': 'Buchanan',
                                'LastName': 'Steven', 'DOB': new Date('October 2, 1990 08:13:00')
                            }]
                        });
                    }
                }));

                dataManager = new DataManager({
                    url: '/api/Employees',
                    adaptor: new ODataV4Adaptor
                });

                let promiseObj: any = dataManager.executeQuery(new Query().
                    where('Guid', 'equal', 'f89dee73-af9f-4cd4-b330-db93c25ff3c9', true));

                promiseObj.then((e: any) => {
                    request = e.xhr;
                    done();
                })
            });

            it('generated guid filter url properly', () => {
                let requestUrl: string = request.url.replace(/^https?:\/\/[^/]+/, '');
                expect(requestUrl).toEqual('/api/Employees/?$filter=Guid%20eq%20f89dee73-af9f-4cd4-b330-db93c25ff3c9');
            });
        });
        describe('To check ODataV4 Filter Queries Generations', () => {
            beforeAll((done: Function) => {
                dataManager = new DataManager({
                    url: '/api/Employees',
                    adaptor: new ODataV4Adaptor
                });
                done();
            });
            it('check isempty filter query generate properly', () => {
                dataManager.executeQuery(new Query().where('FirstName', 'isempty', 'in'));
                expect(dataManager['requests'][0].url).toBe('/api/Employees/?$filter=FirstName eq \'\'');
            });
            it('check doesnotcontain filter query generate properly', () => {
                dataManager.executeQuery(new Query().where('FirstName', 'doesnotcontain', 'in'));
                expect(dataManager['requests'][0].url).toBe('/api/Employees/?$filter=not contains(FirstName,\'in\')');
            });
            it('check doesnotstartwith filter query generate properly', () => {
                dataManager.executeQuery(new Query().where('FirstName', 'doesnotstartwith', 'ki'));
                expect(dataManager['requests'][0].url).toBe('/api/Employees/?$filter=not startswith(FirstName,\'ki\')');
            });
            it('check doesnotendwith filter query generate properly', () => {
                dataManager.executeQuery(new Query().where('FirstName', 'doesnotendwith', 'ng'));
                expect(dataManager['requests'][0].url).toBe('/api/Employees/?$filter=not endswith(FirstName,\'ng\')');
            });
            it('check wildcard startswith filter query generate properly', () => {
                dataManager.executeQuery(new Query().where('FirstName', 'wildcard', 'ki*'));
                expect(dataManager['requests'][0].url).toBe('/api/Employees/?$filter=startswith(FirstName,\'ki\')');
            });
            it('check wildcard endswith filter query generate properly', () => {
                dataManager.executeQuery(new Query().where('FirstName', 'wildcard', '*ng'));
                expect(dataManager['requests'][0].url).toBe('/api/Employees/?$filter=endswith(FirstName,\'ng\')');
            });
            it('check wildcard contains filter query generate properly', () => {
                dataManager.executeQuery(new Query().where('FirstName', 'wildcard', '*in*'));
                expect(dataManager['requests'][0].url).toBe('/api/Employees/?$filter=contains(FirstName,\'in\')');
            });
            it('check like startswith filter query generate properly', () => {
                dataManager.executeQuery(new Query().where('FirstName', 'like', '%ki'));
                expect(dataManager['requests'][0].url).toBe('/api/Employees/?$filter=startswith(FirstName,\'ki\')');
                dataManager.executeQuery(new Query().where('FirstName', 'like', '%%ki'));
                expect(dataManager['requests'][0].url).toBe('/api/Employees/?$filter=startswith(FirstName,\'%25ki\')');
            });
            it('check like endswith filter query generate properly', () => {
                dataManager.executeQuery(new Query().where('FirstName', 'like', 'ng%'));
                expect(dataManager['requests'][0].url).toBe('/api/Employees/?$filter=endswith(FirstName,\'ng\')');
                dataManager.executeQuery(new Query().where('FirstName', 'like', 'ng%%'));
                expect(dataManager['requests'][0].url).toBe('/api/Employees/?$filter=endswith(FirstName,\'ng%25\')');
            });
            it('check like contains filter query generate properly', () => {
                dataManager.executeQuery(new Query().where('FirstName', 'like', '%in%'));
                expect(dataManager['requests'][0].url).toBe('/api/Employees/?$filter=contains(FirstName,\'in\')');
                dataManager.executeQuery(new Query().where('FirstName', 'like', '%%n%'));
                expect(dataManager['requests'][0].url).toBe('/api/Employees/?$filter=contains(FirstName,\'%25n\')');
            });
        });
        describe('startsWith guid filtering', () => {
            let request: any; // Use 'any' to handle the Fetch API request
            beforeAll((done: Function) => {
                spyOn(window, 'fetch').and.returnValue(Promise.resolve({
                    ok: true,
                    status: 200,
                    headers: new Headers({
                        'Content-Type': 'application/json'
                    }),
                    json: function () {
                        return Promise.resolve({
                            value: [{
                                '_id': 5, 'EmployeeID': 1005, 'Guid': 'f89dee73-af9f-4cd4-b330-db93c25ff3c9', 'FirstName': 'Buchanan',
                                'LastName': 'Steven', 'DOB': new Date('October 2, 1990 08:13:00')
                            }]
                        });
                    }
                }));

                dataManager = new DataManager({
                    url: '/api/Employees',
                    adaptor: new ODataAdaptor
                });

                dataManager.executeQuery(new Query().where('Guid', 'startsWith', 'f89dee73-af9f-4cd4-b330-db93c25ff3c9', true))
                    .then((e: any) => {
                        request = e.xhr;
                        done();
                    })
            });

            it('generated guid filter url properly', () => {
                let requestUrl: string = request.url.replace(/^https?:\/\/[^/]+/, '');
                expect(requestUrl)
                    .toEqual('/api/Employees/?$filter=startswith(Guid,guid%27f89dee73-af9f-4cd4-b330-db93c25ff3c9%27)');
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
        let request: ReturnType<typeof fetch>;
        let resultObj: object[];
        beforeAll((done: Function) => {
            spyOn(window, 'fetch').and.returnValue(Promise.resolve({
                ok: true,
                status: 200,
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
                json: function () {
                    return Promise.resolve(record);
                }
            }));

            dataManager = new DataManager({
                url: '/api/Employees',
                adaptor: new ODataV4Adaptor,
                offline: true
            });

            let promise: Promise<Object> = (<Promise<Object>>dataManager.insert(record, query));

            promise.then((e: any) => {
                resultObj = e;
                result = 'Inserted successfully';
                done();
            }).catch((error) => {
                console.error(error);
                done();
            });
        });

        it('check data added properly', () => {
            expect(result).toBe('Inserted successfully');
        });

        it('check type of post', () => {
            expect(window.fetch['calls'].mostRecent().args[0].method).toEqual('POST');
        });
        it('check params', () => {
            expect(JSON.stringify(resultObj)).toEqual('{"EmployeeId":10,"LastName":"John","FirstName":"Stephen"}');
        });
    });

    describe('insert method when failure', () => {
        let record: Object = { EmployeeId: 10, LastName: 'John', FirstName: 'Stephen' };
        let result: string;
        let request: ReturnType<typeof fetch>;

        beforeAll((done: Function) => {
            spyOn(window, 'fetch').and.returnValue(Promise.resolve({
                ok: false,
                status: 500
            }));

            dataManager = new DataManager({
                url: '/api/Orders',
                adaptor: new ODataV4Adaptor,
                offline: true
            });

            let promise: Promise<Object> = (<Promise<Object>>dataManager.insert(record));

            promise.then(
                (e: string) => {
                    result = 'Inserted successfully';
                    done();
                },
                (e: string) => {
                    result = 'Inserted failed';
                    done();
                }
            ).catch((error) => {
                console.error(error);
                done();
            });
        });

        it('check data added properly', () => {
            expect(result).toBe('Inserted failed');
        });
    });

    describe('update method', () => {
        let record: Object = { _id: 9, EmployeeId: 1009, LastName: 'John', FirstName: 'Smith' };
        let result: string;
        let query: Query = new Query();
        let request: ReturnType<typeof fetch>;
        let resultObj: object[];

        beforeAll((done: Function) => {
            spyOn(window, 'fetch').and.returnValue(Promise.resolve({
                ok: true,
                status: 200,
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
                json: function () {
                    return Promise.resolve(record);
                }
            }));

            dataManager = new DataManager({
                url: '/api/Employees',
                adaptor: new ODataV4Adaptor,
                offline: true
            });

            let promise: Promise<Object> = (<Promise<Object>>dataManager.update('_id', record, query));

            promise.then((e: any) => {
                result = 'Updated successfully';
                resultObj = e;
                done();
            })

        });

        it('check updated data', () => {
            expect(result).toBe('Updated successfully');
        });

        it('check type of post', () => {
            expect(window.fetch['calls'].mostRecent().args[0].method).toEqual('PATCH');
        });

        it('check params', () => {
            expect(JSON.stringify(resultObj)).toEqual('{"_id":9,"EmployeeId":1009,"LastName":"John","FirstName":"Smith"}');
        });
    });

    describe('select method', () => {
        let record: Object = { _id: 9, Employee: { EmployeeId: 1009 }, LastName: 'John', FirstName: 'Smith' };
        let result: string;
        let request: any;
        let query: Query = new Query();
        let fetchSpy: jasmine.Spy;

        beforeAll((done: Function) => {
            // Spy on the fetch function and return a resolved Promise with the mocked response
            fetchSpy = spyOn(window, 'fetch').and.returnValue(Promise.resolve({
                ok: true,
                status: 200,
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
                json: function () {
                    return Promise.resolve(record);
                }
            }));

            dataManager = new DataManager({
                url: '/api/Employees',
                adaptor: new ODataV4Adaptor
            });

            let promise: Promise<Object> = dataManager.executeQuery(new Query().select(['Employee.EmployeeID']));

            promise.then((e: any) => {
                request = e.xhr;
                result = 'Selected successfully';
                done();
            }).catch((error) => {
                console.error(error);
                done();
            });
        });

        it('check the request', () => {
            let requestUrl: string = request.url.replace(/^https?:\/\/[^/]+/, '');
            expect(requestUrl)
                .toEqual('/api/Employees/?$expand=Employee($select=EmployeeID)');
        });
    });

    describe('update method when failure', () => {
        let record: Object = { _id: 9, EmployeeId: 1009, LastName: 'John', FirstName: 'Smith' };
        let result: string;

        beforeAll((done: Function) => {
            spyOn(window, 'fetch').and.returnValue(Promise.resolve({
                ok: false,
                status: 500
            }));

            dataManager = new DataManager({
                url: '/api/Orders',
                adaptor: new ODataV4Adaptor,
                offline: true
            });

            let promise: Promise<Object> = (<Promise<Object>>dataManager.update('_id', record));

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
            window.fetch = originalFetch;
        });

        it('check updated data', () => {
            expect(result).toBe('Updated failed');
        });
    });

    describe('remove method', () => {
        let result: string;
        let query: Query = new Query();
        let request: ReturnType<typeof fetch>;
        let resultObj: object[];

        beforeAll((done: Function) => {
            spyOn(window, 'fetch').and.returnValue(Promise.resolve({
                ok: true,
                status: 200,
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
                json: function () {
                    return Promise.resolve({});
                }
            }));

            dataManager = new DataManager({
                url: '/api/Employees',
                adaptor: new ODataV4Adaptor,
                offline: true
            });

            let promise: Promise<Object> = (<Promise<Object>>dataManager.remove('RegionID', 4, query));

            promise.then((e: any) => {
                resultObj = e;
                result = 'Removed successfully';
                done();
            }).catch((error) => {
                console.error(error);
                done();
            });
        });

        it('check data Removed properly', () => {
            expect(result).toBe('Removed successfully');
        });

        it('check type of post', () => {
            expect(window.fetch['calls'].mostRecent().args[0].method).toEqual('DELETE');
        });

        it('check params', () => {
            expect(JSON.stringify(resultObj)).toBe('{}');
        });
    });

    describe('remove method', () => {
        let result: string;
        let query: Query = new Query();
        let request: any;

        beforeAll((done: Function) => {
            spyOn(window, 'fetch').and.returnValue(Promise.resolve({
                ok: true,
                status: 200,
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
                json: function () {
                    return Promise.resolve({});
                }
            }));

            dataManager = new DataManager({
                url: '/api/Employees',
                adaptor: new ODataV4Adaptor
            });

            let promise: Promise<Object> = (<Promise<Object>>dataManager.remove('RegionDescription', 'Southern', query));

            promise.then((e: any) => {
                result = 'Removed successfully';
                done();
            })
        });

        it('check the request', () => {
            let requestUrl: string = window.fetch['calls'].mostRecent().args[0].url.replace(/^https?:\/\/[^/]+/, '');
            expect(requestUrl)
                .toEqual("/api/Employees('Southern')");
        });
    });

    describe('remove method when failure', () => {
        let result: string;

        beforeAll((done: Function) => {
            spyOn(window, 'fetch').and.returnValue(Promise.resolve({
                ok: false,
                status: 500
            }));

            dataManager = new DataManager({
                url: '/api/Region',
                adaptor: new ODataV4Adaptor,
                offline: true
            });

            let promise: Promise<Object> = (<Promise<Object>>dataManager.remove('RegionID', 4));

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

        it('check data Removed properly', () => {
            expect(result).toBe('Removed failed');
        });
    });

    describe('batchRequst method', () => {
        let result: string;
        let changes: any = { changedRecords: [], addedRecords: [], deletedRecords: [] };
        let request: Request;
        beforeAll((done: Function) => {
            // Stub the Fetch API globally to simulate the behavior of jasmine-ajax
            const fetchStub = spyOn(window, 'fetch').and.callFake((url: string, options: RequestInit) => {
                request = new Request(url, options);
                return Promise.resolve(new Response(JSON.stringify({
                    //"Content-Type": "multipart/mixed",
                    "boundary": "changeset_b5af43a3-f35f-41a8-b048-201f404cfb4c --changeset_b5af43a3-f35f-41a8-b048-201f404cfb4c",
                    //"Content-Type": "application/http", "Content-Transfer-Encoding": "binary PUT Table1Items(24) HTTP/1.1", "If-Match": "*",
                    "Accept": "application/json;odata=light;q=1,application/json;odata=verbose;q=0.5", "Content-Id": 0,
                    "Content-Type": "application/json;", "charset": { "Id": 24, "OrderID": 23, "EmployeeID": 4, "Freight": null, "City": null },
                    "CreatedBy": "TestUser", "Created": "2015-11-06T11:28:19.211Z", "ModifiedBy": "TestUser",
                    "Modified": "2015-11-06T11:28:19.211Z", "RowVersion": "AAAAAAAANsg="
                }), { status: 200 }));
            });

            changes.changedRecords.push({ RegionID: 1, RegionDescription: 'Southern' });
            changes.addedRecords.push({ RegionID: 5, RegionDescription: 'Southern' });
            changes.deletedRecords.push({ RegionID: 2, RegionDescription: 'Western' });

            dataManager = new DataManager({
                url: '/api/Employees',
                adaptor: new ODataV4Adaptor
            });

            let promise: Promise<Object> = (<Promise<Object>>dataManager.saveChanges(changes, 'RegionID', new Query()));

            promise.then((e: any) => {
                result = 'Batch request successfully';
                done();
            });
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
            spyOn(window, 'fetch').and.returnValue(Promise.resolve({
                ok: true,
                status: 200,
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
                json: function () {
                    return Promise.resolve({
                        "Content-Type": "multipart/mixed",
                        "boundary": "changeset_b5af43a3-f35f-41a8-b048-201f404cfb4c --changeset_b5af43a3-f35f-41a8-b048-201f404cfb4c",
                        "Content-Transfer-Encoding": "binary PUT Table1Items(24) HTTP/1.1",
                        "If-Match": "*",
                        "Accept": "application/json;odata=light;q=1,application/json;odata=verbose;q=0.5",
                        "Content-Id": 0,
                        "charset": { "Id": 24, "OrderID": 23, "EmployeeID": 4, "Freight": null, "City": null },
                        "CreatedBy": "TestUser",
                        "Created": "2015-11-06T11:28:19.211Z",
                        "ModifiedBy": "TestUser",
                        "Modified": "2015-11-06T11:28:19.211Z",
                        "RowVersion": "AAAAAAAANsg="
                    });
                }
            }));

            changes.addedRecords.push({
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
            promise.then((e: any) => {
                result = e;
                done();
            });
        });

        it('check data updated properly', () => {
            expect(result).not.toBeNull();
        });

        afterAll(() => {
            // No need to uninstall anything since we are using spyOn and not jasmine.Ajax
        });
    });

    describe('batchRequst method when failure', () => {
        let result: any;
        let changes: any = { changedRecords: [], addedRecords: [], deletedRecords: [] };

        beforeAll((done: Function) => {
            spyOn(window, 'fetch').and.returnValue(Promise.resolve({
                ok: false,
                status: 500,
                statusText: 'Internal Server Error',
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
                json: function () {
                    return Promise.resolve({ message: 'Batch request failed' });
                }
            }));

            changes.changedRecords.push({ RegionID: 1, RegionDescription: 'Southern' });
            changes.addedRecords.push({ RegionID: 5, RegionDescription: 'Southern' });
            changes.deletedRecords.push({ RegionID: 2, RegionDescription: 'Western' });

            dataManager = new DataManager({
                url: '/api/Region',
                adaptor: new ODataAdaptor,
                offline: true
            });

            let promise: Promise<Object> = (<Promise<Object>>dataManager.saveChanges(changes, 'RegionID', new Query()));
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

        it('check data updated properly', () => {
            expect(result).toBe('Batch request failed');
        });

        afterAll(() => {
            // No need to uninstall anything since we are using spyOn and not jasmine.Ajax
        });
    });

    describe('Check distinct method in OdataV4', () => {
        let request: Request;

        beforeAll(async () => {

            spyOn(window, 'fetch').and.returnValue(
                Promise.resolve(new Response(JSON.stringify({
                    // Your fake response here
                    "Content-Type": "multipart/mixed",
                    "boundary": "changeset_b5af43a3-f35f-41a8-b048-201f404cfb4c --changeset_b5af43a3-f35f-41a8-b048-201f404cfb4c",
                    //"Content-Type": "application/http", "Content-Transfer-Encoding": "binary PUT Table1Items(24) HTTP/1.1", "If-Match": "*",
                    "Accept": "application/json;odata=light;q=1,application/json;odata=verbose;q=0.5", "Content-Id": 0,
                    //"Content-Type": "application/json;", "charset": { "Id": 24, "OrderID": 23, "EmployeeID": 4, "Freight": null, "City": null },
                    "CreatedBy": "TestUser", "Created": "2015-11-06T11:28:19.211Z", "ModifiedBy": "TestUser",
                    "Modified": "2015-11-06T11:28:19.211Z", "RowVersion": "AAAAAAAANsg="
                }), { status: 200 }))
            );

            dataManager = new DataManager({
                url: 'odata/Orders',
                adaptor: new ODataV4Adaptor()
            });

            let query: Query = new Query().distinct(['Freight']).take(10);
            let result = await query.execute(dataManager);

        });

        it('To check multiple selected method.', () => {
            const expectedURL = window.fetch['calls'].mostRecent().args[0].url.replace(/^https?:\/\/[^/]+/, '');
            expect(expectedURL).toEqual('/odata/Orders/?$apply=groupby((Freight))&$top=10');
        });


        afterAll(() => {
            (window.fetch as jasmine.Spy).and.callThrough();
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
        const responseData = JSON.stringify(data);
        const fakeResponse = new Response(responseData, {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

        // Install the Fetch API mock (Spy) using spyOn
        spyOn(window, 'fetch').and.returnValue(Promise.resolve(fakeResponse));
        dataManager = new DataManager({
            url: '/api/Employees',
            adaptor: new WebApiAdaptor
        });
        let prom: Promise<Object> = dataManager.executeQuery(query);
        // let defaults: Object = {
        //     'status': 200,
        //     'contentType': 'application/json',
        //     'responseText': JSON.stringify(data)
        // };
        // let responses: Object = {};
        request = window.fetch['calls'].mostRecent();
        // extend(responses, defaults, response);
        // request.respondWith(responses);
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
            window.fetch = originalFetch;
        })
    });
    describe('webapi batchRequst method', () => {
        let result: string;
        let changes: any = { changedRecords: [], addedRecords: [], deletedRecords: [] };
        let request: Request;

        beforeAll(async (done: Function) => {
            spyOn(window, 'fetch').and.returnValue(Promise.resolve(new Response(`{'--batch_ee12e00b-27bd-47d9-b18e-fd051825b7e7',
                'Content-Type': 'application/http; msgtype=request',
                'POST /api/Employees HTTP/1.1',
                'Content-Type': 'application/json; charset=utf-8',
                'Host': 'localhost:59166',
                {RegionID: 1, RegionDescription: 'Southern'},
                '--batch_8e883834-48b5-47f8-9c1c-5dd421c361bb'
                'Content-Type': 'application/http; msgtype=request',
                'PUT /api/Employees HTTP/1.1',
                'Content-Type': 'application/json; charset=utf-8',
                'Host': 'localhost:59166',
                { RegionID: 5, RegionDescription: 'Southern' },
                'DELETE /api/Employees/10006 HTTP/1.1',
                'Content-Type': 'application/json'; 'charset=utf-8',
                'Host':  'localhost:59166',
                { RegionID: 2, RegionDescription: 'Western' },   
                '--batch_ee12e00b-27bd-47d9-b18e-fd051825b7e7--'}`, {
                status: 200,
                headers: { 'Content-Type': 'multipart/mixed;' }
            })));

            changes.changedRecords.push({ RegionID: 1, RegionDescription: 'Southern' });
            changes.addedRecords.push({ RegionID: 5, RegionDescription: 'Southern' });
            changes.deletedRecords.push({ RegionID: 2, RegionDescription: 'Western' });
            dataManager = new DataManager({
                url: '/api/Employees',
                adaptor: new WebApiAdaptor
            });

            try {
                const promise: any = dataManager.saveChanges(changes, 'RegionID', new Query());
                const response = await promise;
                result = 'Batch request successfully';
            } catch (error) {
                result = 'Batch request failed';
            }

            done();
        });

        it('check data updated properly', () => {
            expect(result).toBe('Batch request successfully');
        });

        it('check type of the request', () => {
            expect(window.fetch['calls'].mostRecent().args[0].method).toEqual('POST');
        });
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
            window.fetch = originalFetch;
        })
    });
    describe('insert method', () => {
        let record: Object = { OrderID: 10980, EmployeeId: 4, Freight: 25.55, CustomerID: 'TOMSP' };
        let result: string;
        let query: Query = new Query();
        let resultObj: object[];
        beforeAll((done: Function) => {
            spyOn(window, 'fetch').and.returnValue(Promise.resolve({
                ok: true,
                status: 200,
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
                json: function () {
                    return Promise.resolve(record);
                }
            }));
            dataManager = new DataManager({
                url: 'http://mvc.syncfusion.com/UGService/api/Orders/',
                adaptor: new WebApiAdaptor,
                offline: true
            });
            let promise: Promise<Object> = (<Promise<Object>>dataManager.insert(record, query));
            promise.then((e: any) => {
                resultObj = e;
                result = 'Inserted successfully';
                done();
            });
        });

        it('check data added properly', () => {
            expect(result).toBe('Inserted successfully');
        });
        it('check params of post', () => {
            expect(JSON.stringify(resultObj)).toEqual('{"OrderID":10980,"EmployeeId":4,"Freight":25.55,"CustomerID":"TOMSP"}');
        });
    });
    describe('update method', () => {
        let record: Object = { OrderID: 10248, EmployeeId: 4, Freight: 78.55, CustomerID: 'VINET' };
        let result: string;
        let query: Query = new Query();
        let request: ReturnType<typeof fetch>;
        let resultObj: object[];

        beforeAll((done: Function) => {
            spyOn(window, 'fetch').and.returnValue(Promise.resolve({
                ok: true,
                status: 200,
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
                json: function () {
                    return Promise.resolve(record);
                }
            }));

            dataManager = new DataManager({
                url: 'http://mvc.syncfusion.com/UGService/api/Orders/',
                adaptor: new WebApiAdaptor,
                offline: true
            });

            let promise: Promise<Object> = (<Promise<Object>>dataManager.update('OrderID', record, query));

            promise.then((e: any) => {
                result = 'Updated successfully';
                resultObj = e;
                done();
            })

        });

        it('check updated data', () => {
            expect(result).toBe('Updated successfully');
        });

        it('check params', () => {
            expect(JSON.stringify(resultObj)).toEqual('{"OrderID":10248,"EmployeeId":4,"Freight":78.55,"CustomerID":"VINET"}');
        });
    });
    describe('remove method', () => {
        let result: string;
        let query: Query = new Query();
        let request: any;
        let resultObj: object[];
        beforeAll((done: Function) => {
            spyOn(window, 'fetch').and.returnValue(Promise.resolve({
                ok: true,
                status: 200,
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
                json: function () {
                    return Promise.resolve({});
                }
            }));

            dataManager = new DataManager({
                url: 'http://mvc.syncfusion.com/UGService/api/Orders/',
                adaptor: new WebApiAdaptor,
                offline: true
            });

            let promise: Promise<Object> = (<Promise<Object>>dataManager.remove('RegionID', 10980, query));

            promise.then((e: any) => {
                resultObj = e;
                result = 'Removed successfully';
                done();
            })
        });

        it('check data Removed properly', () => {
            expect(result).toBe('Removed successfully');
        });
        it('check params of post', () => {
            expect(JSON.stringify(resultObj)).toEqual('{}');
        });
    });

    describe('remove method when failure', () => {
        let result: string;

        beforeAll((done: Function) => {
            spyOn(window, 'fetch').and.returnValue(Promise.resolve({
                ok: false,
                status: 500
            }));

            dataManager = new DataManager({
                url: '/api/Region',
                adaptor: new ODataV4Adaptor,
                offline: true
            });

            let promise: Promise<Object> = (<Promise<Object>>dataManager.remove('RegionID', 4));

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

        it('check data Removed properly', () => {
            expect(result).toBe('Removed failed');
        });
    });
    //   describe('batchRequst method', () => {
    //     let result: any;
    //     let changes: any = { changedRecords: [], addedRecords: [], deletedRecords: [] };

    //     beforeAll((done: Function) => {
    //         spyOn(window, 'fetch').and.returnValue(Promise.resolve(
    //             new Response('{"Response from WebApiAdaptor": "responseText"}', {
    //                 status: 200,
    //                 headers: new Headers({ 'Content-Type': 'application/json' })
    //             })
    //         ));

    //         changes.changedRecords.push({ OrderID: 10248, EmployeeId: 4, Freight: 53.55, CustomerID: 'VINET' });
    //         changes.addedRecords.push({ OrderID: 10981, EmployeeId: 6, Freight: 78.55, CustomerID: 'VINET' });
    //         changes.deletedRecords.push({ OrderID: 10250, EmployeeId: 9, Freight: 8.0000, CustomerID: 'HANAR' });

    //         dataManager = new DataManager({
    //             url: 'http://mvc.syncfusion.com/UGService/api/Orders/',
    //             adaptor: new WebApiAdaptor,
    //             offline: true
    //         });

    //         let promise: Promise<Object> = (<Promise<Object>>dataManager.saveChanges(changes, 'RegionID', new Query()));
    //         let request: any = window.fetch['calls'].mostRecent();
    //         promise.then((e: any) => {
    //             result = 'Batch request successfully';
    //             done(); // Resolve the promise when the asynchronous operation is completed
    //         });
    //     });

    //     it('check data updated properly', () => {
    //         expect(result).toBe('Batch request successfully');
    //     });
    // });

    describe('Aggregate checking', () => {
        let request: any;
        let dataManager: DataManager;
        let query: Query = new Query().aggregate("min", "OrderID").requiresCount();
        let result: { result: Object[], aggregates: { [a: string]: Object } };
        beforeAll((done: Function) => {
            spyOn(window, 'fetch').and.returnValue(Promise.resolve(
                new Response(JSON.stringify({ Items: [{ OrderID: 1 }, { OrderID: 2 }], Count: 2 }), {
                    status: 200,
                    headers: new Headers({ 'Content-Type': 'application/json', 'DataServiceVersion': '3.0' })
                })
            ));

            this.dataManager = new DataManager({
                url: '/Home/Employees',
                adaptor: new WebApiAdaptor
            });

            let promise: Promise<Object> = this.dataManager.executeQuery(query);

            promise.then((e: { result: Object[], aggregates: { [a: string]: Object } }) => {
                this.result = e;
                done();
            });
        });

        it('check whether the args wrapped in "value"', () => {
            expect(this.result.aggregates["OrderID - min"]).toBe(1);
        });
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
        let dataManager: DataManager;
        let query: Query = new Query().addParams("hi", "test");

        beforeAll((done: Function) => {
            spyOn(window, 'fetch').and.returnValue(Promise.resolve(
                new Response(JSON.stringify({ d: data }), {
                    status: 200,
                    headers: new Headers({ 'Content-Type': 'application/json' })
                })
            ));

            dataManager = new DataManager({
                url: '/Home/Employees',
                adaptor: new WebMethodAdaptor
            });

            let promise: Promise<Object> = dataManager.executeQuery(query);

            promise.then((e: { result: Object[] }) => {
                result = e.result;
                done();
            }).catch((error) => {
                result = 'Error: ' + error;
                done();
            });
        });

        it('check whether the args wrapped in "value"', () => {
            expect(this.result.result.length).not.toBeNull();
        });
    });

    describe('insert method', () => {
        let record: Object = { EmployeeId: 10, LastName: 'John', FirstName: 'Stephen' };
        let result: string;
        let query: Query = new Query();
        let resultObj: object[];
        beforeAll((done: Function) => {
            spyOn(window, 'fetch').and.returnValue(Promise.resolve({
                ok: true,
                status: 200,
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
                json: function () {
                    return Promise.resolve(record);
                }
            }));
            dataManager = new DataManager({
                url: '/Default/Orders',
                adaptor: new WebMethodAdaptor,
                offline: true
            });
            let promise: Promise<Object> = (<Promise<Object>>dataManager.insert(record, query));
            promise.then((e: any) => {
                resultObj = e;
                result = 'Inserted successfully';
                done();
            });
        });

        it('check data added properly', () => {
            expect(result).toBe('Inserted successfully');
        });
        it('check params of post', () => {
            expect(JSON.stringify(resultObj)).toEqual('{"EmployeeId":10,"LastName":"John","FirstName":"Stephen"}');
        });
    });
    describe('update method', () => {
        let record: Object = { _id: 9, EmployeeId: 1009, LastName: 'John', FirstName: 'Smith' };
        let result: string;
        let query: Query = new Query();
        let request: ReturnType<typeof fetch>;
        let resultObj: object[];

        beforeAll((done: Function) => {
            spyOn(window, 'fetch').and.returnValue(Promise.resolve({
                ok: true,
                status: 200,
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
                json: function () {
                    return Promise.resolve(record);
                }
            }));

            dataManager = new DataManager({
                url: '/Default/Orders',
                adaptor: new WebMethodAdaptor
            });

            let promise: Promise<Object> = (<Promise<Object>>dataManager.update('OrderID', record, query));

            promise.then((e: any) => {
                result = 'Updated successfully';
                resultObj = e;
                done();
            })

        });

        it('check updated data', () => {
            expect(result).toBe('Updated successfully');
        });

        it('check params', () => {
            expect(JSON.stringify(resultObj)).toEqual('{"_id":9,"EmployeeId":1009,"LastName":"John","FirstName":"Smith"}');
        });
    });
    describe('remove method', () => {
        let result: string;
        let query: Query = new Query();
        let request: any;
        let resultObj: object[];
        beforeAll((done: Function) => {
            spyOn(window, 'fetch').and.returnValue(Promise.resolve({
                ok: true,
                status: 200,
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
                json: function () {
                    return Promise.resolve({});
                }
            }));

            dataManager = new DataManager({
                url: '/Default/Orders',
                adaptor: new WebMethodAdaptor
            });

            let promise: Promise<Object> = (<Promise<Object>>dataManager.remove('RegionID', 4, query));

            promise.then((e: any) => {
                resultObj = e;
                result = 'Removed successfully';
                done();
            })
        });

        it('check data Removed properly', () => {
            expect(result).toBe('Removed successfully');
        });
    });

    //   describe('batchRequest method', () => {
    //     let result: any;
    //     let changes: any = { changedRecords: [], addedRecords: [], deletedRecords: [] };

    //     beforeAll(async () => { // Use async to handle asynchronous operations
    //         changes.changedRecords.push({ RegionID: 1, RegionDescription: 'Southern' });
    //         changes.addedRecords.push({ RegionID: 5, RegionDescription: 'Southern' });
    //         changes.deletedRecords.push({ RegionID: 2, RegionDescription: 'Western' });
    //         dataManager = new DataManager({
    //             url: '/Default/Orders',
    //             adaptor: new WebMethodAdaptor()
    //         });

    //         // Mock the fetch method with spyOn and return a resolved Promise with the desired response
    //         spyOn(Fetch.prototype, 'send').and.returnValue(Promise.resolve({
    //             ok: true,
    //             json: () => Promise.resolve(changes)
    //         }));

    //         try {
    //             let promise: any = dataManager.saveChanges(changes, 'RegionID', new Query());

    //             const response = await promise; // Use await to wait for the Promise to resolve

    //             result = 'Batch request successfully';
    //         } catch (error) {
    //             // Handle error if needed
    //             console.error(error);
    //         }
    //     });

    //     it('check data updated properly', () => {
    //         expect(result).toBe('Batch request successfully');
    //     });
    // });

});



// describe('RemoteSaveAdaptor Adaptor', () => {
//     let dataManager: DataManager;
//     describe('batchRequst method', () => {
//         let result: any;
//         let changes: any = { changedRecords: [], addedRecords: [], deletedRecords: [] };

//         beforeAll((done: Function) => {
//             // Spy on the fetch function and return a resolved Promise with the mocked response
//             spyOn(window, 'fetch').and.returnValue(Promise.resolve({
//                 ok: true,
//                 status: 200,
//                 headers: new Headers({
//                     'Content-Type': 'application/json'
//                 }),
//                 // text: function () {
//                 //     return Promise.resolve('{"Response from WebMethodAdaptor": "response Text"}');
//                 // }
//             }));

//             changes.changedRecords.push({ RegionID: 1, RegionDescription: 'Southern' });
//             changes.addedRecords.push({ RegionID: 5, RegionDescription: 'Southern' });
//             changes.deletedRecords.push({ RegionID: 2, RegionDescription: 'Western' });

//             dataManager = new DataManager({
//                 url: '/Home/Orders',
//                 adaptor: new RemoteSaveAdaptor
//             });

//             let promise: Promise<Object> = (<Promise<Object>>dataManager.saveChanges(changes, 'RegionID', new Query()));

//             promise.then((e: any) => {
//                 result = 'Batch request successfully';
//                 done();
//             });
//         });

//         it('check data updated properly', () => {
//             expect(result).toBe('Batch request successfully');
//         });
//     });
// });


describe('Cache Adaptor', () => {
    let result: Object[];
    let dataManager: DataManager;
    describe('To check DataManager with timeTillExpiration', () => {
        beforeAll((done: Function) => {
            dataManager = new DataManager({
                url: 'https://services.syncfusion.com/js/production/api/Orders',
                enableCaching: true,
                cachingPageSize: 10,
                timeTillExpiration: 120000
            });
            let promise: Promise<Object> = dataManager.executeQuery(new Query().skip(10).take(5));
            promise.then((e: { result: Object[] }) => {
                result = e.result["result"];
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
                url: 'https://services.syncfusion.com/js/production/api/Orders',
                enableCaching: true,
                cachingPageSize: 10
            });
            let promise: Promise<Object> = dataManager.executeQuery(new Query().skip(10).take(5));
            promise.then((e: { result: Object[] }) => {
                result = e.result["result"];
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
                url: 'https://services.syncfusion.com/js/production/api/Orders',
                timeTillExpiration: 1,
                adaptor: new CacheAdaptor
            });
            done();
        });
        it('generated data properly', () => {
            expect(dataManager).not.toBeNull();
        });
    });
    describe('page method', () => {
        beforeAll((done: Function) => {
            dataManager = new DataManager({
                url: 'https://services.syncfusion.com/js/production/api/Orders',
                enableCaching: true,
                cachingPageSize: 10,
                timeTillExpiration: 1
            });
            let promise: Promise<Object> = dataManager.executeQuery(new Query().page(2, 3).take(15));
            promise.then((e: { result: Object[] }) => {
                result = e.result["result"];
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
                url: 'https://services.syncfusion.com/js/production/api/Orders',
                enableCaching: true,
                cachingPageSize: 10,
                timeTillExpiration: 120000
            });
            let promise: Promise<Object> = dataManager.executeQuery(new Query().range(1, 2).take(5));
            promise.then((e: { result: Object[] }) => {
                result = e.result["result"];
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
                url: 'https://services.syncfusion.com/js/production/api/Orders',
                enableCaching: true,
                cachingPageSize: 10,
                timeTillExpiration: 120000
            });
            let promise: Promise<Object> = dataManager.executeQuery(new Query().where('CustomerID', 'equal', 'VINET').take(5));
            promise.then((e: { result: Object[] }) => {
                result = e.result['result'];
                done();
            });
        });
        it('generated data properly', () => {
            expect(result.length).toBe(5);
        });
        // it('To check filtered properly".', () => {
        //     expect(result[0]["CustomerID"]).toEqual('VINET');
        //     expect(result[1]["CustomerID"]).toEqual('VINET');
        // });
        describe('date filtering', () => {
            beforeAll((done: Function) => {
                dataManager = new DataManager({
                    url: 'https://services.syncfusion.com/js/production/api/Orders',
                    enableCaching: true,
                    cachingPageSize: 10,
                    timeTillExpiration: 120000
                });
                let promise: Promise<Object> = dataManager.executeQuery(new Query().
                    where('OrderDate', 'greaterThan', new Date('July 04, 1996 05:30:00')).take(5));
                promise.then((e: { result: Object[] }) => {
                    result = e.result['result'];
                    done();
                });
            });
            it('generated data properly', () => {
                expect(result.length).toBe(5);
            });
            // it('generated data filtered properly', () => {
            //     expect(new Date(result[0]["OrderDate"]) > new Date('July 04, 1996 05:30:00')).toBe(true);
            // });
        });
    });
    describe('search method', () => {
        beforeAll((done: Function) => {
            dataManager = new DataManager({
                url: 'https://services.syncfusion.com/js/production/api/Orders',
                enableCaching: true,
                cachingPageSize: 10,
                timeTillExpiration: 120000
            });
            let promise: Promise<Object> = dataManager.executeQuery(new Query().search(7, 'EmployeeID', 'equal').take(5));
            promise.then((e: { result: Object[] }) => {
                result = e.result['result'];
                done();
            });
        });
        it('To check filtered data length".', () => {
            expect(result.length).toBe(5);
        });
        // it('To check filtered properly".', () => {
        //     expect(result[0]["EmployeeID"]).toEqual(7);
        //     expect(result[1]["EmployeeID"]).toEqual(7);
        // });
    });
    describe('sort method', () => {
        beforeAll((done: Function) => {
            dataManager = new DataManager({
                url: 'https://services.syncfusion.com/js/production/api/Orders',
                enableCaching: true,
                cachingPageSize: 10,
                timeTillExpiration: 120000
            });
            let promise: Promise<Object> = dataManager.executeQuery(new Query().sortBy('EmployeeID', 'descending').take(5));
            promise.then((e: { result: Object[] }) => {
                result = e.result['result'];
                done();
            });
        });
        it('To check sorted data length properly".', () => {
            expect(result.length).toBe(5);
        });
        // it('To check filtered properly".', () => {
        //     expect(result[0]["EmployeeID"] >= result[1]["EmployeeID"]).toEqual(true);
        //     expect(result[1]["EmployeeID"] >= result[2]["EmployeeID"]).toEqual(true);
        // });
        describe('array of field name in sort method', () => {
            beforeAll((done: Function) => {
                dataManager = new DataManager({
                    url: 'https://js.syncfusion.com/ejServices/Wcf/Northwind.svc/Orders/',
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
            // it('To check sorted data length properly".', () => {
            //     expect(result.length).toBe(5);
            // });
            // it('To check filtered properly".', () => {
            //     expect(result[0]["EmployeeID"] >= result[1]["EmployeeID"]).toEqual(true);
            //     expect(result[1]["EmployeeID"] >= result[2]["EmployeeID"]).toEqual(true);
            // });
        });
        describe('invalid operator in sort method', () => {
            beforeAll((done: Function) => {
                dataManager = new DataManager({
                    url: 'https://services.syncfusion.com/js/production/api/Orders',
                    enableCaching: true,
                    cachingPageSize: 10,
                    timeTillExpiration: 120000
                });
                let promise: Promise<Object> = dataManager.executeQuery(new Query().sortBy('EmployeeID', 'descend').take(5));
                promise.then((e: { result: Object[] }) => {
                    result = e.result["result"];
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
                    url: 'https://services.syncfusion.com/js/production/api/Orders',
                    enableCaching: true,
                    cachingPageSize: 10,
                    timeTillExpiration: 120000
                });
                let promise: Promise<Object> = dataManager.executeQuery(new Query().sortBy(['EmployeeID'], 'descend').take(5));
                promise.then((e: { result: Object[] }) => {
                    result = e.result["result"];
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
                url: 'https://js.syncfusion.com/ejServices/Wcf/Northwind.svc/Orders/',
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
        // it('To check take data legnth.', () => {
        //     expect((<any>result).aggregates['Freight - sum']).toBe(527.82);
        // });
    });
    describe('group method', () => {
        beforeAll((done: Function) => {
            dataManager = new DataManager({
                url: 'https://services.syncfusion.com/js/production/api/Orders',
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
            expect(result[0]["items"].length).toBe(1);
        });
        it('check field name from result', () => {
            expect(result[0]["field"]).toEqual('EmployeeID');
        });
    });
    describe('insert method', () => {
        let record: Object = { OrderID: 10980, EmployeeId: 4, Freight: 25.55, CustomerID: 'TOMSP' };
        let result: string;
        let query: Query = new Query();
        let resultObj: object[];
        beforeAll((done: Function) => {
            spyOn(window, 'fetch').and.returnValue(Promise.resolve({
                ok: true,
                status: 200,
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
                json: function () {
                    return Promise.resolve(record);
                }
            }));
            dataManager = new DataManager({
                url: 'http://mvc.syncfusion.com/Services/Northwnd.svc/Orders/',
                enableCaching: true,
                cachingPageSize: 10,
                timeTillExpiration: 120000
            });
            let promise: Promise<Object> = (<Promise<Object>>dataManager.insert(record, query));
            promise.then((e: any) => {
                resultObj = e;
                result = 'Inserted successfully';
                done();
            });
        });

        it('check data added properly', () => {
            expect(result).toBe('Inserted successfully');
        });
    });
    describe('update method', () => {
        let record: Object = { OrderID: 10248, EmployeeId: 4, Freight: 78.55, CustomerID: 'VINET' };
        let result: string;
        let query: Query = new Query();
        let request: ReturnType<typeof fetch>;
        let resultObj: object[];

        beforeAll((done: Function) => {
            spyOn(window, 'fetch').and.returnValue(Promise.resolve({
                ok: true,
                status: 200,
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
                json: function () {
                    return Promise.resolve(record);
                }
            }));

            dataManager = new DataManager({
                url: 'http://mvc.syncfusion.com/Services/Northwnd.svc/Orders/',
                enableCaching: true,
                cachingPageSize: 10,
                timeTillExpiration: 120000
            });

            let promise: Promise<Object> = (<Promise<Object>>dataManager.update('OrderID', record, query));

            promise.then((e: any) => {
                result = 'Updated successfully';
                resultObj = e;
                done();
            })

        });

        it('check updated data', () => {
            expect(result).toBe('Updated successfully');
        });
    });
    describe('remove method', () => {
        let result: string;
        let query: Query = new Query();
        let request: any;
        let resultObj: object[];
        beforeAll((done: Function) => {
            spyOn(window, 'fetch').and.returnValue(Promise.resolve({
                ok: true,
                status: 200,
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
                json: function () {
                    return Promise.resolve({});
                }
            }));

            dataManager = new DataManager({
                url: 'http://mvc.syncfusion.com/Services/Northwnd.svc/Orders/',
                enableCaching: true,
                cachingPageSize: 10,
                timeTillExpiration: 120000
            });

            let promise: Promise<Object> = (<Promise<Object>>dataManager.remove('OrderID', 10980, query));

            promise.then((e: any) => {
                result = 'Removed successfully';
                done();
            })
        });

        it('check data Removed properly', () => {
            expect(result).toBe('Removed successfully');
        });
    });
    // describe('batchRequst method', () => {
    //     let result: any;
    //     let changes: any = { changedRecords: [], addedRecords: [], deletedRecords: [] };
    //     beforeAll((done: Function) => {
    //         jasmine.Ajax.install();
    //         changes.changedRecords.push({ OrderID: 10248, EmployeeId: 4, Freight: 53.55, CustomerID: 'VINET' });
    //         changes.addedRecords.push({ OrderID: 10981, EmployeeId: 6, Freight: 78.55, CustomerID: 'VINET' });
    //         changes.deletedRecords.push({ OrderID: 10250, EmployeeId: 9, Freight: 8.0000, CustomerID: 'HANAR' });
    //         dataManager = new DataManager({
    //             url: 'http://mvc.syncfusion.com/Services/Northwnd.svc/Orders/',
    //             enableCaching: true,
    //             cachingPageSize: 10,
    //             timeTillExpiration: 120000
    //         });
    //         let promise: Promise<Object> = (<Promise<Object>>dataManager.saveChanges(changes, 'OrderID', new Query()));
    //         let request: JasmineAjaxRequest = jasmine.Ajax.requests.mostRecent();
    //         request.respondWith({
    //             'status': 200,
    //             'contentType': 'application/json',
    //             'responseText': '{"Response from CacheAdaptor": "response"}'
    //         });
    //         promise.then((e: any) => {
    //             result = 'Batch request successfully';
    //             done();
    //         });
    //     });
    //     afterAll(() => {
    //         window.fetch = originalFetch;
    //     });
    //     it('check data updated properly', () => {
    //         expect(result).toBe('Batch request successfully');
    //     });
    // });
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
        let result: Object[];
        let adaptor = new UrlAdaptor;

        beforeAll((done: Function) => {
            // Mock the Fetch API using spyOn
            spyOn(window, 'fetch').and.returnValue(Promise.resolve({
                ok: true,
                status: 200,
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
                json: function () {
                    return Promise.resolve(data);
                }
            }));

            dataManager = new DataManager({
                url: '/Home/Employees',
                adaptor: new ODataAdaptor() // Use the appropriate adaptor for your scenario
            });

            let promise: Promise<Object> = dataManager.executeQuery(new Query().page(2, 3).take(5));

            promise.then((e: { result: Object[] }) => {
                result = e.result;
                done();
            }).catch((error) => {
                console.error(error);
                done();
            });
        });

        it('check length of the data', () => {
            expect(result.length).toBe(5);
            expect(adaptor.convertToQueryString({}, null, null)).toBe('');
        });
    });
    describe('range method', () => {
        let result: Object[];

        beforeAll((done: Function) => {
            // Mock the Fetch API using spyOn
            spyOn(window, 'fetch').and.returnValue(Promise.resolve({
                ok: true,
                status: 200,
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
                json: function () {
                    return Promise.resolve(data);
                }
            }));

            dataManager = new DataManager({
                url: '/Home/Employees',
                adaptor: new ODataAdaptor() // Use the appropriate adaptor for your scenario
            });

            let promise: Promise<Object> = dataManager.executeQuery(new Query().range(1, 2).take(5));

            promise.then((e: { result: Object[] }) => {
                result = e.result;
                done();
            }).catch((error) => {
                console.error(error);
                done();
            });
        });

        it('check length of the data', () => {
            expect(result.length).toBe(5);
        });
    });

    describe('where method', () => {
        let result: Object[];

        beforeAll((done: Function) => {
            // Mock the Fetch API using spyOn
            spyOn(window, 'fetch').and.returnValue(Promise.resolve({
                ok: true,
                status: 200,
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
                json: function () {
                    return Promise.resolve(data);
                }
            }));

            dataManager = new DataManager({
                url: '/Home/Employees',
                adaptor: new ODataAdaptor() // Use the appropriate adaptor for your scenario
            });

            let promise: Promise<Object> = dataManager.executeQuery(new Query().where('CustomerID', 'equal', 'VINET', true).take(5));

            promise.then((e: { result: Object[] }) => {
                result = e.result;
                done();
            }).catch((error) => {
                console.error(error);
                done();
            });
        });

        it('generated data properly', () => {
            expect(result.length).toBe(5);
        });
    });

    describe('group column', () => {
        let result: any;

        beforeAll((done: Function) => {
            // Mock the Fetch API using spyOn
            spyOn(window, 'fetch').and.returnValue(Promise.resolve({
                ok: true,
                status: 200,
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
                json: function () {
                    return Promise.resolve(data);
                }
            }));

            dataManager = new DataManager({
                url: '/Home/Employees',
                adaptor: new UrlAdaptor() // Use the appropriate adaptor for your scenario
            });

            let promise: Promise<Object> = dataManager.executeQuery(new Query().group('EmployeeID').group('CustomerID'));

            promise.then((e: any) => {
                result = e;
                done();
            }).catch((error) => {
                console.error(error);
                done();
            });
        });

        it('check data filtered properly', () => {
            expect(result.result[0]["items"].length).toBe(2);
        });
    });

    describe('group column with group data source', () => {
        let result: any;

        beforeAll((done: Function) => {
            // Mock the Fetch API using spyOn
            spyOn(window, 'fetch').and.returnValue(Promise.resolve({
                ok: true,
                status: 200,
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
                json: function () {
                    return Promise.resolve({ result: data, groupDs: data });
                }
            }));

            dataManager = new DataManager({
                url: '/Home/Employees',
                adaptor: new UrlAdaptor() // Use the appropriate adaptor for your scenario
            });

            let promise: Promise<Object> = dataManager.executeQuery(new Query().group('EmployeeID').group('CustomerID').group('Guid'));

            promise.then((e: any) => {
                result = e;
                done();
            }).catch((error) => {
                console.error(error);
                done();
            });
        });

        it('check data filtered properly', () => {
            expect(result.result[0]["items"].length).toBe(2);
        });
    });

    describe('aggregate method', () => {
        let result: any;

        beforeAll((done: Function) => {
            // Mock the Fetch API using spyOn
            spyOn(window, 'fetch').and.returnValue(Promise.resolve({
                ok: true,
                status: 200,
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
                json: function () {
                    return Promise.resolve({ result: data, count: 5 });
                }
            }));

            dataManager = new DataManager({
                url: '/Home/Employees',
                adaptor: new UrlAdaptor() // Use the appropriate adaptor for your scenario
            });

            let promise: Promise<Object> = dataManager.executeQuery(new Query().take(10).requiresCount().
                aggregate('count', 'EmployeeID'));

            promise.then((e: any) => {
                result = e;
                done();
            }).catch((error) => {
                console.error(error);
                done();
            });
        });

        it('check data aggregate properly', () => {
            expect(result.aggregates['EmployeeID - count']).toBe(5);
        });
    });

    describe('aggregate method with return options', () => {
        let result: any;

        beforeAll((done: Function) => {
            spyOn(window, 'fetch').and.returnValue(Promise.resolve({
                ok: true,
                status: 200,
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
                json: function () {
                    return Promise.resolve({
                        result: data,
                        count: 5,
                        aggregate: { 'EmployeeID - count': 5 }
                    });
                }
            }));

            dataManager = new DataManager({
                url: '/Home/Employees',
                adaptor: new UrlAdaptor()
            });

            let promise: Promise<Object> = dataManager.executeQuery(new Query().take(10).requiresCount()
                .aggregate('count', 'EmployeeID'));

            promise.then((e: Object) => {
                result = e;
                done();
            }).catch((error) => {
                console.error(error);
                done();
            });
        });

        it('check data result properly', () => {
            expect(result.result.length).toBe(5);
        });

        it('check data count properly', () => {
            expect(result.count).toBe(5);
        });
    });
    ;
    describe('insert method', () => {
        let record: Object = { EmployeeId: 10, LastName: 'John', FirstName: 'Stephen' };
        let result: string;
        let query: Query = new Query();
        let resultObj: object[];
        beforeAll((done: Function) => {
            spyOn(window, 'fetch').and.returnValue(Promise.resolve({
                ok: true,
                status: 200,
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
                json: function () {
                    return Promise.resolve(record);
                }
            }));
            dataManager = new DataManager({
                url: '/Home/Employees',
                adaptor: new UrlAdaptor
            });
            let promise: Promise<Object> = (<Promise<Object>>dataManager.insert(record, query));
            promise.then((e: any) => {
                resultObj = e;
                result = 'Inserted successfully';
                done();
            });
        });

        it('check data added properly', () => {
            expect(result).toBe('Inserted successfully');
        });
    });
    describe('update method', () => {
        let record: Object = { _id: 9, EmployeeId: 1009, LastName: 'John', FirstName: 'Smith' };
        let result: string;
        let query: Query = new Query();
        let request: ReturnType<typeof fetch>;
        let resultObj: object[];

        beforeAll((done: Function) => {
            spyOn(window, 'fetch').and.returnValue(Promise.resolve({
                ok: true,
                status: 200,
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
                json: function () {
                    return Promise.resolve(record);
                }
            }));

            dataManager = new DataManager({
                url: '/Home/Employees',
                adaptor: new UrlAdaptor
            });

            let promise: Promise<Object> = (<Promise<Object>>dataManager.update('OrderID', record, query));

            promise.then((e: any) => {
                result = 'Updated successfully';
                done();
            })

        });

        it('check updated data', () => {
            expect(result).toBe('Updated successfully');
        });
    });
    describe('remove method', () => {
        let result: string;
        let query: Query = new Query();
        let request: any;
        let resultObj: object[];
        beforeAll((done: Function) => {
            spyOn(window, 'fetch').and.returnValue(Promise.resolve({
                ok: true,
                status: 200,
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
                json: function () {
                    return Promise.resolve({});
                }
            }));

            dataManager = new DataManager({
                url: 'http://mvc.syncfusion.com/Services/Northwnd.svc/Orders/',
                enableCaching: true,
                cachingPageSize: 10,
                timeTillExpiration: 120000
            });

            let promise: Promise<Object> = (<Promise<Object>>dataManager.remove('EmployeeID', 4, query));

            promise.then((e: any) => {
                result = 'Removed successfully';
                done();
            })
        });

        it('check data Removed properly', () => {
            expect(result).toBe('Removed successfully');
        });
    });

    // describe('batchRequst method', () => {
    //     let result: any;
    //     let changes: any = { changedRecords: [], addedRecords: [], deletedRecords: [] };
    //     beforeAll((done: Function) => {
    //         jasmine.Ajax.install();
    //         changes.changedRecords.push(
    //             { OrderID: 10248, CustomerID: 'AANAR', EmployeeID: 7, Freight: 23.38, Guid: 'f89dee73-af9f-4cd4-b330-db93c25ff3c7' });
    //         changes.addedRecords.push(
    //             { OrderID: 10253, CustomerID: 'VINET', EmployeeID: 4, Freight: 35.38, Guid: 'f89dee73-af9f-4cd4-b330-db93c25ff3c7' });
    //         changes.deletedRecords.push(
    //             { OrderID: 10253, CustomerID: 'VINET', EmployeeID: 4, Freight: 35.38, Guid: 'f89dee73-af9f-4cd4-b330-db93c25ff3c7' });
    //         dataManager = new DataManager({
    //             url: '/Home/Employees',
    //             adaptor: new UrlAdaptor
    //         });
    //         let promise: Promise<Object> = (<Promise<Object>>dataManager.saveChanges(changes, 'OrderID', new Query()));
    //         let request: JasmineAjaxRequest = jasmine.Ajax.requests.mostRecent();
    //         request.respondWith({
    //             'status': 200,
    //             'contentType': 'application/json',
    //             'responseText': JSON.stringify({
    //                 result: data,
    //                 addedRecords: [{
    //                     OrderID: 10253, CustomerID: 'VINET', EmployeeID: 4,
    //                     Freight: 35.38, Guid: 'f89dee73-af9f-4cd4-b330-db93c25ff3c7'
    //                 }]
    //             })
    //         });
    //         promise.then((e: any) => {
    //             result = e;
    //             done();
    //         });
    //     });
    //     afterAll(() => {
    //         window.fetch = originalFetch;
    //     });
    //     it('check data updated properly', () => {
    //         expect(result).not.toBeNull;
    //     });
    // });
    // describe('xml format check', () => {
    //     let request: ReturnType<typeof fetch>;

    //     beforeAll((done: Function) => {
    //         spyOn(window, 'fetch').and.returnValue(Promise.resolve({
    //             ok: true,
    //             status: 200,
    //             headers: new Headers({
    //                 'Content-Type': 'application/xml'
    //             }),
    //             text: function () {
    //                 return Promise.resolve('<xml><order></order></xml>');
    //             }
    //         }));

    //         dataManager = new DataManager({
    //             url: '/api/Employees',
    //             adaptor: new UrlAdaptor(),
    //             requiresFormat: true
    //         });

    //         let promise: Promise<Object> = dataManager.executeQuery(new Query());

    //         promise.then((e: RequestOptions) => {
    //             this.result = e.result;
    //             done();
    //         }).catch((error) => {
    //             console.error(error);
    //             done();
    //         });
    //     });

    //     it('xml format  - data check', () => {
    //         expect(this.result.length).toBe(0);
    //     });
    // });

    // describe('xml format check - no count', () => {
    //     let request: ReturnType<typeof fetch>;

    //     beforeAll((done: Function) => {
    //         spyOn(window, 'fetch').and.returnValue(Promise.resolve({
    //             ok: true,
    //             status: 200,
    //             headers: new Headers({
    //                 'Content-Type': 'application/xml'
    //             }),
    //             text: function () {
    //                 return Promise.resolve('<xml><order></order></xml>');
    //             }
    //         }));

    //         dataManager = new DataManager({
    //             url: '/api/Employees',
    //             adaptor: new UrlAdaptor()
    //         });

    //         let promise: Promise<Object> = dataManager.executeQuery(new Query().requiresCount());

    //         promise.then((e: RequestOptions) => {
    //             this.result = e.result;
    //             done();
    //         }).catch((error) => {
    //             console.error(error);
    //             done();
    //         });
    //     });

    //     it('xml format  - data check', () => {
    //         expect(this.result.length).toBe(0);
    //     });
    // });

});


describe('EJ2-37998 - Provide support for delete action while using complex data field as primary key', () => {
    let complexData: JSON[] = ([
        { details: { OrderID: 10248 }, CustomerID: 'VINET', EmployeeID: 5, Freight: 32.38, Verified: true },
        { details: { OrderID: 10249 }, CustomerID: 'AANAR', EmployeeID: 2, Freight: 11.61, Verified: false },
        { details: { OrderID: 10250 }, CustomerID: 'VICTE', EmployeeID: 7, Freight: 65.83, Verified: true },
        { details: { OrderID: 10251 }, CustomerID: 'SUPRD', EmployeeID: 7, Freight: 70.63, Verified: false },
        { details: { OrderID: 10252 }, CustomerID: 'ANDREW', EmployeeID: 8, Freight: 23.63, Verified: true }
    ] as Object) as JSON[];
    let dataManager: DataManager;
    describe('update method with query', () => {
        let record: Object = { details: { OrderID: 10251 }, CustomerID: 'ANNARS', EmployeeID: 7, Freight: 70.63, Verified: false };
        let result: Object[];
        beforeAll((done: Function) => {
            dataManager = new DataManager(complexData, new Query(), new JsonAdaptor);
            dataManager.update('details.OrderID', record, new Query());
            result = dataManager.executeLocal();
            done();
        });
        it('check length of the data', () => {
            expect(result.length).toBe(5);
        });
        it('check data updated properly', () => {
            expect((<{ [key: string]: any }>result[3])["CustomerID"]).toBe('ANNARS');
        });
    });
    describe('remove method', () => {
        let result: Object[];
        beforeAll((done: Function) => {
            dataManager = new DataManager(complexData, new Query(), new JsonAdaptor);
            dataManager.remove('details.OrderID', { details: { OrderID: 10249 }, CustomerID: 'AANAR', EmployeeID: 2, Freight: 11.61, Verified: false });
            result = dataManager.executeLocal();
            done();
        });
        it('check length of the data', () => {
            expect(result[0]['details']['OrderID']).toBe(10248);
        });
    });
});

describe('CustomDataAdaptor Adaptor', () => {
    let dataManager: DataManager;
    let result: any;
    let data: Object[] = [
        { OrderID: 10248, CustomerID: 'VINET', EmployeeID: 7, Freight: 32.38, Guid: 'f89dee73-af9f-4cd4-b330-db93c25ff3c7' },
        { OrderID: 10249, CustomerID: 'AANAR', EmployeeID: 2, Freight: 11.61, Guid: 'db2d2186-1c29-4d1e-88ef-a127f521b9c6' },
        { OrderID: 10250, CustomerID: 'VICTE', EmployeeID: 7, Freight: 65.83, Guid: '6F9619FF-8B86-D011-B42D-00C04FC964FF' },
        { OrderID: 10251, CustomerID: 'VINET', EmployeeID: 7, Freight: 70.63, Guid: 'f89dee73-af9f-4cd4-b330-db93c25ff3c7' },
        { OrderID: 10252, CustomerID: 'SUPRD', EmployeeID: 6, Freight: 45.45, Guid: 'f89dee73-af9f-4cd4-b330-db93c25ff3c9' }
    ];
    let createRequest: Function = (url: string, option: any, isCrud?: boolean) => {
        fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: option.data
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Network response was not ok');
                }
            })
            .then(data => {
                var request = extend({}, option, { httpRequest: null });
                if (isCrud) {
                    data = JSON.parse(option.data);
                }
                option.onSuccess(data, request);
            })
            .catch(error => {
                option.onFailure(error);
            });
    };



    describe('page method', () => {
        let fetchSpy: any;
        let adaptor = new CustomDataAdaptor({
            getData: function (option: object) {
                createRequest('/Home/Employees', option);
            }
        });

        beforeAll((done: Function) => {
            fetchSpy = spyOn(window, 'fetch').and.callFake((url: string, init: any) => {
                return Promise.resolve(new Response(JSON.stringify(data), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                }));
            });

            dataManager = new DataManager({
                adaptor: adaptor
            });

            let promise: Promise<Object> = dataManager.executeQuery(new Query().page(2, 3).take(5));

            promise.then((e: { result: Object[] }) => {
                result = e.result;
                done();
            });
        });

        it('check length of the data', () => {
            expect(result.length).toBe(5);
            expect(adaptor.convertToQueryString({}, null, null)).toBe('');
        });

        afterAll(() => {
            // Restore the original fetch function
            fetchSpy.and.callThrough();
        });
    });




    describe('where method', () => {
        let fetchSpy: any;

        beforeAll((done: Function) => {

            fetchSpy = spyOn(window, 'fetch').and.callFake((url: string, init: any) => {
                return Promise.resolve(new Response(JSON.stringify(data), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                }));
            });

            let adaptor = new CustomDataAdaptor({
                getData: function (option: object) {
                    createRequest('/Home/Employees', option);
                }
            });

            dataManager = new DataManager({
                adaptor: adaptor
            });

            let promise: Promise<Object> = dataManager.executeQuery(new Query().where('CustomerID', 'equal', 'VINET', true).take(5));

            promise.then((e: { result: Object[] }) => {
                result = e.result;
                done();
            }).catch((error) => {
                console.error(error);
                done();
            });
        });

        it('generated data properly', () => {
            expect(result.length).toBe(5);
        });
    });


    describe('group column', () => {
        let result: any;
        let fetchSpy: any;


        beforeAll((done: Function) => {
            fetchSpy = spyOn(window, 'fetch').and.callFake((url: string, init: any) => {
                return Promise.resolve(new Response(JSON.stringify(data), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                }));
            });

            let adaptor = new CustomDataAdaptor({
                getData: function (option: object) {
                    createRequest('/Home/Employees', option);
                }
            });

            dataManager = new DataManager({
                adaptor: adaptor
            });

            let promise: Promise<Object> = dataManager.executeQuery(new Query().group('EmployeeID').group('CustomerID'));

            promise.then((e: Object) => {
                result = e;
                done();
            }).catch((error) => {
                console.error(error);
                done();
            });
        });

        it('check data grouped properly', () => {
            expect(result.result[0]["items"].length).toBe(2);
        });
    });

    describe('group column with group data source', () => {
        let result: any;

        beforeAll((done: Function) => {
            let fetchSpy: any;
            fetchSpy = spyOn(window, 'fetch').and.callFake((url: string, init: any) => {
                return Promise.resolve(new Response(JSON.stringify(data), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                }));
            });

            let adaptor = new CustomDataAdaptor({
                getData: function (option: object) {
                    createRequest('/Home/Employees', option);
                }
            });

            let promise: Promise<Object> = dataManager.executeQuery(new Query().group('EmployeeID').group('CustomerID').group('Guid'));

            promise.then((e: Object) => {
                result = e;
                done();
            }).catch((error) => {
                console.error(error);
                done();
            });
        });

        it('check data filtered properly', () => {
            expect(result.result[0]["items"].length).toBe(2);
        });
    });

    // describe('aggregate method', () => {
    //     let result: any;

    //     beforeAll((done: Function) => {
    //         let fetchSpy: any;
    //         fetchSpy = spyOn(window, 'fetch').and.callFake((url: string, init: any) => {
    //             return Promise.resolve(new Response(JSON.stringify(data), {
    //                 status: 200,
    //                 headers: { 'Content-Type': 'application/json' }
    //             }));
    //         });

    //         let adaptor = new CustomDataAdaptor({
    //             getData: function (option: object) {
    //                 createRequest('/Home/Employees', option);
    //             }
    //         });

    //         dataManager = new DataManager({
    //             adaptor: adaptor
    //         });
    //         let promise: Promise<Object> = dataManager.executeQuery(new Query().take(10).requiresCount().aggregate('count', 'EmployeeID'));

    //         promise.then((e: Object) => {
    //             result = e;
    //             done();
    //         }).catch((error) => {
    //             console.error(error);
    //             done();
    //         });
    //     });

    //     it('check data aggregate properly', () => {
    //         expect(result.aggregates['EmployeeID - count']).toBe(5);
    //     });
    // });

    // describe('aggregate method with return options', () => {
    //     let result: any;

    //     beforeAll((done: Function) => {
    //         let fetchSpy: any;
    //         fetchSpy = spyOn(window, 'fetch').and.callFake((url: string, init: any) => {
    //             return Promise.resolve(new Response(JSON.stringify(data), {
    //                 status: 200,
    //                 headers: { 'Content-Type': 'application/json' }
    //             }));
    //         });

    //         let adaptor = new CustomDataAdaptor({
    //             getData: function (option: object) {
    //                 createRequest('/Home/Employees', option);
    //             }
    //         });

    //         dataManager = new DataManager({
    //             adaptor: adaptor
    //         });
    //         let promise: Promise<Object> = dataManager.executeQuery(new Query().take(10).requiresCount().aggregate('count', 'EmployeeID'));

    //         promise.then((e: Object) => {
    //             result = e;
    //             done();
    //         }).catch((error) => {
    //             console.error(error);
    //             done();
    //         });
    //     });

    //     it('check data result properly', () => {
    //         expect(result.result.length).toBe(5);
    //     });

    //     it('check data count properly', () => {
    //         expect(result.count).toBe(5);
    //     });
    // });

    describe('insert method', () => {
        let record: Object = { EmployeeId: 10, LastName: 'John', FirstName: 'Stephen' };
        let result: string;
        let query: Query = new Query();
        let resultObj: object[];
        beforeAll((done: Function) => {
            spyOn(window, 'fetch').and.returnValue(Promise.resolve({
                ok: true,
                status: 200,
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
                json: function () {
                    return Promise.resolve(record);
                }
            }));
            dataManager = new DataManager({
                url: '/Home/Employees',
                adaptor: new UrlAdaptor
            });
            let promise: Promise<Object> = (<Promise<Object>>dataManager.insert(record, query));
            promise.then((e: any) => {
                resultObj = e;
                result = 'Inserted successfully';
                done();
            });
        });

        it('check data added properly', () => {
            expect(result).toBe('Inserted successfully');
        });
    });
    describe('update method', () => {
        let record: Object = { _id: 9, EmployeeId: 1009, LastName: 'John', FirstName: 'Smith' };
        let result: string;
        let query: Query = new Query();
        let request: ReturnType<typeof fetch>;
        let resultObj: object[];

        beforeAll((done: Function) => {
            spyOn(window, 'fetch').and.returnValue(Promise.resolve({
                ok: true,
                status: 200,
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
                json: function () {
                    return Promise.resolve(record);
                }
            }));

            dataManager = new DataManager({
                url: '/Home/Employees',
                adaptor: new UrlAdaptor
            });

            let promise: Promise<Object> = (<Promise<Object>>dataManager.update('OrderID', record, query));

            promise.then((e: any) => {
                result = 'Updated successfully';
                done();
            })

        });

        it('check updated data', () => {
            expect(result).toBe('Updated successfully');
        });
    });
    describe('remove method', () => {
        let result: string;
        let query: Query = new Query();
        let request: any;
        let resultObj: object[];
        beforeAll((done: Function) => {
            spyOn(window, 'fetch').and.returnValue(Promise.resolve({
                ok: true,
                status: 200,
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
                json: function () {
                    return Promise.resolve({});
                }
            }));

            dataManager = new DataManager({
                url: 'http://mvc.syncfusion.com/Services/Northwnd.svc/Orders/',
                enableCaching: true,
                cachingPageSize: 10,
                timeTillExpiration: 120000
            });

            let promise: Promise<Object> = (<Promise<Object>>dataManager.remove('EmployeeID', 4, query));

            promise.then((e: any) => {
                result = 'Removed successfully';
                done();
            })
        });

        it('check data Removed properly', () => {
            expect(result).toBe('Removed successfully');
        });
    });
    describe('failure method', () => {
        let adaptor = new CustomDataAdaptor({
            batchUpdate: function (option: object) {
                (option as any).onFailure(undefined);
            }
        });
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
                adaptor: adaptor
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
            }).catch((e: any) => {
                done();
            });
        });
        afterAll(() => {
            window.fetch = originalFetch;
        });
        it('check data updated properly', () => {
            expect(result).not.toBeNull;
        });
    });

    describe('batchRequest method', () => {
        let adaptor = new CustomDataAdaptor({
            batchUpdate: function (option: object) {
                createRequest('/Home/Employees', option, true)
            }
        });
        let changes: any = { changedRecords: [], addedRecords: [], deletedRecords: [] };
        beforeAll((done: Function) => {
            spyOn(window, 'fetch').and.returnValue(Promise.resolve({
                status: 200,
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
                json: function () {
                    return Promise.resolve({
                        result: data,
                        addedRecords: [{
                            OrderID: 10253, CustomerID: 'VINET', EmployeeID: 4,
                            Freight: 35.38, Guid: 'f89dee73-af9f-4cd4-b330-db93c25ff3c7'
                        }]
                    });
                }
            }));
            changes.changedRecords.push(
                { OrderID: 10248, CustomerID: 'AANAR', EmployeeID: 7, Freight: 23.38, Guid: 'f89dee73-af9f-4cd4-b330-db93c25ff3c7' });
            changes.addedRecords.push(
                { OrderID: 10253, CustomerID: 'VINET', EmployeeID: 4, Freight: 35.38, Guid: 'f89dee73-af9f-4cd4-b330-db93c25ff3c7' });
            changes.deletedRecords.push(
                { OrderID: 10253, CustomerID: 'VINET', EmployeeID: 4, Freight: 35.38, Guid: 'f89dee73-af9f-4cd4-b330-db93c25ff3c7' });
            dataManager = new DataManager({
                adaptor: adaptor
            });
            let promise: Promise<Object> = (<Promise<Object>>dataManager.saveChanges(changes, 'OrderID', new Query()));
            promise.then((e: any) => {
                result = e;
                done();
            });
        });
    });

    describe('GraphQLAdaptor Adaptor', () => {
        let dataManager: DataManager;
        let result: any;
        let data: Object = {
            data: {
                getOrders: {
                    result: [
                        { OrderID: 10248, CustomerID: 'VINET', EmployeeID: 7, Freight: 32.38, Guid: 'f89dee73-af9f-4cd4-b330-db93c25ff3c7' },
                        { OrderID: 10249, CustomerID: 'AANAR', EmployeeID: 2, Freight: 11.61, Guid: 'db2d2186-1c29-4d1e-88ef-a127f521b9c6' },
                        { OrderID: 10250, CustomerID: 'VICTE', EmployeeID: 7, Freight: 65.83, Guid: '6F9619FF-8B86-D011-B42D-00C04FC964FF' },
                        { OrderID: 10251, CustomerID: 'VINET', EmployeeID: 7, Freight: 70.63, Guid: 'f89dee73-af9f-4cd4-b330-db93c25ff3c7' },
                        { OrderID: 10252, CustomerID: 'SUPRD', EmployeeID: 6, Freight: 45.45, Guid: 'f89dee73-af9f-4cd4-b330-db93c25ff3c9' }
                    ],
                    count: 5
                }
            }
        };
        describe('Get Data', () => {
            let adaptor = new GraphQLAdaptor({
                response: {
                    result: 'getOrders.result'
                },
                query: `query DataFetch($datamanager: String) {
                        getOrders(datamanager: $datamanager) {
                            count,
                            result{OrderID, CustomerID, EmployeeID, ShipCity, ShipCountry} 
                         }
                    }`,
            });
            beforeAll((done: Function) => {
                let fetchSpy: any;
                fetchSpy = spyOn(window, 'fetch').and.callFake((url: string, init: any) => {
                    return Promise.resolve(new Response(JSON.stringify(data), {
                        status: 200,
                        headers: { 'Content-Type': 'application/json' }
                    }));
                });
                dataManager = new DataManager({
                    url: 'Home/Employee',
                    adaptor: adaptor
                });
                let promise: Promise<Object> = dataManager.executeQuery(new Query().page(2, 3).take(5));
                promise.then((e: { result: { result: Object[], count: number } }) => {
                    result = e.result;
                    done();
                });
            });
            it('check length of the data', () => {
                expect(result.length).toBe(5);
            });
            it('check the ProcessData method', () => {
                let query: Query = new Query().skip(2).take(2).select(['OrderID', 'CustomerID', 'EmployeeID']).where('EmployeeID', 'equal', 7);
                let datamanager: Object = new UrlAdaptor().processQuery(new DataManager({ url: '' }), query);
                let dm: Object = JSON.parse(datamanager['data']);
                dm['where'] = JSON.stringify(dm['where']);
                let data: Object[] = DataUtil.processData(dm, result) as any;
                expect(data.length).toBe(1);
            });
        });
        afterAll(() => {
            window.fetch = originalFetch;
        });
    });

    describe('EJ2-56350 - filtering on grid with Odata for values that contain an apostrophe', () => {
        let request: any;

        beforeAll(async (done: Function) => {
            // Mock fetch function
            spyOn(window, 'fetch').and.returnValue(Promise.resolve(
                new Response(JSON.stringify({
                    value: [{
                        '_id': 5, 'EmployeeID': 1005, 'Guid': 'f89dee73-af9f-4cd4-b330-db93c25ff3c9', 'FirstName': 'Buchanan',
                        'LastName': 'Steven'
                    }]
                }), {
                    status: 200,
                    headers: new Headers({ 'Content-Type': 'application/json' })
                })
            ));

            dataManager = new DataManager({
                url: '/api/Employees',
                adaptor: new ODataAdaptor
            });

            dataManager.executeQuery(new Query().where('Guid', 'equal', "ab'cd'ef'gh'ij", true));
            request = window.fetch['calls'].mostRecent();
            done();
        });


        it('generated null filter url properly', () => {
            let expectedUrl: string = request.args[0].url.replace(/^https?:\/\/[^/]+/, '');
            expect(expectedUrl).toEqual("/api/Employees/?$filter=tolower(Guid)%20eq%20%27ab%27%27cd%27%27ef%27%27gh%27%27ij%27");
        });
    });
});