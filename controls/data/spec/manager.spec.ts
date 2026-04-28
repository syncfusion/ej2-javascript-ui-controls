/**
 * Test case for dataManager
 */
import { DataManager, DataOptions } from '../src/manager';
import { JsonAdaptor, ODataV4Adaptor, RemoteSaveAdaptor } from '../src/adaptors';
import { Predicate, Query } from '../src/query';
import { extend, isNullOrUndefined, Fetch } from '@syncfusion/ej2-base';


let originalFetch: any = window.fetch;
describe('DataManager', () => {
    let employeesData: JSON[] = ([{ EmployeeID: 1, LastName: "Davolio", FirstName: "Nancy", Title: "Sales Representative" },
    { EmployeeID: 2, LastName: "Fuller", FirstName: "Andrew", Title: "Vice President, Sales" },
    { EmployeeID: 3, LastName: "Leverling", FirstName: "Janet", Title: "Sales Representative" },
    { EmployeeID: 4, LastName: "Peacock", FirstName: "Margaret", Title: "Sales Representative" },
    { EmployeeID: 5, LastName: "Fuller", FirstName: "Andrew", Title: "Vice President, Sales" },
    { EmployeeID: 6, LastName: "Leverling", FirstName: "Janet", Title: "Sales Representative" },
    { EmployeeID: 7, LastName: "Peacock", FirstName: "Margaret", Title: "Sales Representative" },
    { EmployeeID: 8, LastName: "Fuller", FirstName: "Andrew", Title: "Vice President, Sales" },
    { EmployeeID: 9, LastName: "Leverling", FirstName: "Janet", Title: "Sales Representative" }
    ] as Object) as JSON[];

    let data: JSON[] = ([
        { OrderID: 10248, CustomerID: 'VINET', EmployeeID: 5, Freight: 32.38 },
        { OrderID: 10249, CustomerID: 'AANAR', EmployeeID: 2, Freight: 11.61 },
        { OrderID: 10250, CustomerID: 'VICTE', EmployeeID: 7, Freight: 65.83 },
        { OrderID: 10251, CustomerID: 'TOMSP', EmployeeID: 7, Freight: 70.63 },
        { OrderID: 10252, CustomerID: 'SUPRD', EmployeeID: 6, Freight: 45.45 }
    ] as Object) as JSON[];

    type MockAjaxReturn = { promise: Promise<Object>, request: JasmineAjaxRequest };
    type ResponseType = { result: Object[], count: number | string };

    let mockAjax: Function = (d: { data: { [o: string]: Object | Object[] } | Object[], dm?: DataManager }, query: Query | Function, response?: Object):
        MockAjaxReturn => {
        const responseData = JSON.stringify(d.data);
        let responses: Object = {};
        const fakeResponse = new Response(responseData, {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
        if (!isNullOrUndefined(response)) {
            extend(responses, fakeResponse, response);
        }
        else {
            responses = fakeResponse;
        }

        spyOn(window, 'fetch').and.returnValue(Promise.resolve(responses));
        let dataManager = d.dm || new DataManager({
            url: '/api/Employees',
        });
        let prom: Promise<Object> = dataManager.executeQuery(query);
        let request: any = window.fetch['calls'].mostRecent();
        return {
            promise: prom,
            request: request
        }
    };

    describe('DataManager generated properly without data', () => {
        let dataManager: DataManager = new DataManager();
        it('To check length of generated data.', () => {
            expect(dataManager.dataSource.json.length).toBe(0);
        });
        it('To check the dataType.', () => {
            expect(dataManager.dataSource.dataType).toEqual('json');
        });
        it('To check offline mode.', () => {
            expect(dataManager.dataSource.offline).toEqual(true);
        });
        dataManager = new DataManager({});
    });
    describe('JSON data', () => {

        let complexData: JSON[] = ([
            {
                OrderID: 10248, CustomerID: 'VINET', Freight: 32.38,
                Order_Details: [{ OrderID: 10248, OrderName: 'Laptop' }, { OrderID: 10248, OrderName: 'Mobile' }]
            },
            {
                OrderID: 10249, CustomerID: 'AANAR', Freight: 11.61,
                Order_Details: [{ OrderID: 10249, OrderName: 'RAM' }, { OrderID: 10249, OrderName: 'Tap' }]
            },
            {
                OrderID: 10250, CustomerID: 'VICTE', Freight: 65.83,
                Order_Details: [{ OrderID: 10250, OrderName: 'Hard-Disk' }, { OrderID: 10250, OrderName: 'Laptop' }]
            },
            {
                OrderID: 10251, CustomerID: 'TOMSP', Freight: 70.63,
                Order_Details: [{ OrderID: 10251, OrderName: 'Pendrive' }, { OrderID: 10251, OrderName: 'Mobile' }]
            },
            {
                OrderID: 10252, CustomerID: 'SUPRD', Freight: 45.45,
                Order_Details: [{ OrderID: 10252, OrderName: 'Mouse' }, { OrderID: 10252, OrderName: 'Keyboard' }]
            }
        ] as Object) as JSON[];
        describe('JSON data is generated properly', () => {
            let dataManager: DataManager = new DataManager(data);
            it('To check length of generated data.', () => {
                expect(dataManager.dataSource.json.length).toBe(data.length);
            });
            it('To check the dataType.', () => {
                expect(dataManager.dataSource.dataType).toEqual('json');
            });
            it('To check offline mode.', () => {
                expect(dataManager.dataSource.offline).toEqual(true);
            });
        });
        describe('executeLocal method', () => {
            it('without query.', () => {
                let dataManager: DataManager = new DataManager(data);
                expect(() => { dataManager.executeLocal(); }).toThrow();
            });
            it('with query.', () => {
                let dataManager: DataManager = new DataManager(data);
                let result: Object[] = dataManager.executeLocal(new Query()) as Object[];
                expect(result.length).toBe(data.length);
            });
            it('without json data', () => {
                let dataManager: DataManager = new DataManager();
                dataManager.dataSource.json = null;
                expect(() => { dataManager.executeLocal(new Query()); }).toThrow();
            });
            it('without json data', () => {
                let dataManager: DataManager = new DataManager(data).
                    setDefaultQuery(new Query().select(['OrderID', 'CustomerID', 'Freight']));
                expect(dataManager.executeLocal().length).toBe(data.length);
            });
            it('with subquery', () => {
                let dataManager: DataManager = new DataManager(data).
                    setDefaultQuery(new Query().from('Orders').select(['OrderID', 'CustomerID', 'Freight']).hierarchy(new Query(), () => {
                        return [10248];
                    }));
                expect(dataManager.executeLocal().length).toBe(data.length);
            });
            it('with subquery and requiresCount', () => {
                let dataManager: DataManager = new DataManager(complexData).
                    setDefaultQuery(new Query().from('Orders').requiresCount()
                        .hierarchy(new Query().foreignKey('OrderID').from('Order_Details').requiresCount(), () => {
                            return [10248];
                        }));
                let result: any = dataManager.executeLocal();
                expect(result.count && result.result.length).toBe(data.length);
            });
            it('array of table with hierarchy', () => {
                let dataManager: DataManager = new DataManager(complexData).
                    setDefaultQuery(new Query(['Orders']).requiresCount()
                        .hierarchy(new Query(['Order_Details']).foreignKey('OrderID').requiresCount(), () => {
                            return [10248];
                        }));
                let result: any = dataManager.executeLocal();
                expect(result.count && result.result.length).toBe(data.length);
            });
        });
        describe('cors not supported browser check', () => {
            let request: string = 'XMLHttpRequest';
            let savedRequest: XMLHttpRequest = window[request];
            beforeAll(() => {
                window[request] = undefined;
            });
            afterAll(() => {
                window[request] = savedRequest;
            });
            it('To check the generated data without crossDomain.', () => {
                let dataManager: DataManager = new DataManager(data);
                let result: Object[] = dataManager.executeLocal(new Query()) as Object[];
                expect(result.length).toBe(data.length);
            });
            it('To check the generated data with crossDomain.', () => {
                let dataManager: DataManager = new DataManager({ json: data, crossDomain: false });
                let result: Object[] = dataManager.executeLocal(new Query()) as Object[];
                expect(result.length).toBe(data.length);
            });
        });
        describe('To pass dataType in dataManager Object', () => {
            let dataManager: DataManager = new DataManager({ json: data, crossDomain: false, dataType: 'json' });
            let result: Object[] = dataManager.executeLocal(new Query()) as Object[];
            it('To check the generated data.', () => {
                expect(result.length).toBe(data.length);
            });
            it('To check the generated data.', () => {
                expect(dataManager.dataSource.dataType).toEqual('json');
            });
        });
        describe('setDefaultQuery method', () => {
            let dataManager: DataManager = new DataManager(data).setDefaultQuery(new Query().select(['OrderID', 'CustomerID', 'Freight']));
            it('To check the default query.', () => {
                expect(dataManager.defaultQuery !== undefined).toBe(true);
            });
            it('To check the generated query.', () => {
                expect(dataManager.defaultQuery instanceof Query).toBe(true);
            });
            it('To check the generated query length.', () => {
                expect(dataManager.defaultQuery.queries.length).toEqual(1);
            });
            it('To check the generated query as onSelect.', () => {
                expect(dataManager.defaultQuery.queries[0].fn).toEqual('onSelect');
            });
            it('To check the generated query as onSelect.', () => {
                expect(dataManager.defaultQuery.queries[0].e.fieldNames).toEqual(['OrderID', 'CustomerID', 'Freight']);
            });
        });
        describe('executeQuery method', () => {

            describe('with select and take process', () => {
                let result: Object[];
                beforeAll(() => {
                    const query = new Query().take(3).select(['OrderID', 'CustomerID', 'EmployeeID']);

                    // Process the data locally using DataManager's executeLocal method
                    const localData: any = new DataManager(data).executeLocal(query);

                    result = localData;
                });
                it('To check the result length of data.', () => {
                    expect(result.length).toBe(3);
                });
                it('To check the result key is equal to select query.', () => {
                    expect(Object.keys(result[0])).toEqual(['OrderID', 'CustomerID', 'EmployeeID']);
                });
            });
            describe('done function in executeQuery method', () => {
                let result: Object[];
                beforeAll((done: Function) => {
                    let data1 = new DataManager(data).executeLocal(new Query().take(3).select(['OrderID', 'CustomerID', 'EmployeeID']));
                    let doneFn: Function = (e: { result: Object[] }) => {
                        result = e.result;
                    };
                    let mAjax: MockAjaxReturn = mockAjax({
                        dm: new DataManager({
                            url: '/api/Orders'
                        }).setDefaultQuery(new Query().select(['OrderID', 'CustomerID', 'EmployeeID']).take(3)),
                        data: { d: data1 }
                    }, doneFn);
                    mAjax.promise.then((e: ResponseType) => {
                        result = e.result;
                        done();
                    });
                });
                it('To check the result length of data.', () => {
                    expect(result.length).toBe(3);
                });
                it('To check the result key is equal to select query.', () => {
                    expect(Object.keys(result[0])).toEqual(['OrderID', 'CustomerID', 'EmployeeID']);
                });
                it('To check non valid query', () => {
                    let dataManager: DataManager = new DataManager({
                        url: 'http://mvc.syncfusion.com/Services/Northwnd.svc/Orders/'
                    });
                    let done: Function = (e: { result: Object[] }) => {
                        return e.result;
                    };
                    expect(() => { dataManager.executeQuery(done); }).toThrow();
                });
                afterAll(() => {
                    window.fetch = originalFetch;
                });
            });
            describe('with hierarchy', () => {
                let result: Object[];
                let first: JasmineAjaxRequest;
                let last: JasmineAjaxRequest;

                beforeAll((done: Function) => {
                    // Mock the Fetch API response for the first AJAX request
                    spyOn(window, 'fetch').and.returnValues(
                        Promise.resolve(new Response(JSON.stringify([{ OrderID: 10248, CustomerID: 'VINET', EmployeeID: 5, Freight: 32.38 },
                        { OrderID: 10249, CustomerID: 'AANAR', EmployeeID: 2, Freight: 11.61 },
                        { OrderID: 10250, CustomerID: 'VICTE', EmployeeID: 7, Freight: 65.83 }]), { status: 200, headers: { 'Content-Type': 'application/json' } })),
                        Promise.resolve(new Response(JSON.stringify([{ OrderID: 10248, CustomerID: 'VINET', EmployeeID: 5, Freight: 32.38 }]), { status: 200, headers: { 'Content-Type': 'application/json' } }))
                    );

                    let dataManager: Promise<Object> = new DataManager({
                        url: '/api/'
                    }).executeQuery(new Query().from('Orders').hierarchy(
                        new Query().foreignKey('OrderID').from('Order_Details'), () => {
                            return [10248];
                        }));

                    dataManager.then((e: { result: Object[] }) => {
                        result = e.result;
                        done();
                    }).catch((error) => {
                        console.error(error);
                        done();
                    });
                });

                it('To check the result length of data.', () => {
                    expect(result.length).toBe(3);
                    expect(result[0]['Order_Details'].length).toBe(1);
                });

                // No need for an afterAll() block when using Fetch API instead of Jasmine AJAX
            });

            describe('with hierarchy and requirecounts', () => {
                let result: Object[];
                let first: JasmineAjaxRequest;
                let last: JasmineAjaxRequest;

                beforeAll((done: Function) => {
                    // Mock the Fetch API response for the first AJAX request
                    spyOn(window, 'fetch').and.returnValues(
                        Promise.resolve(new Response(JSON.stringify({
                            d: [{ OrderID: 10248, CustomerID: 'VINET', EmployeeID: 5, Freight: 32.38 },
                            { OrderID: 10249, CustomerID: 'AANAR', EmployeeID: 2, Freight: 11.61 },
                            { OrderID: 10250, CustomerID: 'VICTE', EmployeeID: 7, Freight: 65.83 }], __count: 3
                        }), { status: 200, headers: { 'Content-Type': 'application/json' } })),
                        Promise.resolve(new Response(JSON.stringify({
                            d: [{ OrderID: 10248, CustomerID: 'VINET', EmployeeID: 5, Freight: 32.38 }], __count: 1
                        }), { status: 200, headers: { 'Content-Type': 'application/json' } }))
                    );

                    let dataManager: Promise<Object> = new DataManager({
                        url: '/api/'
                    }).executeQuery(new Query().from('Orders').requiresCount().hierarchy(
                        new Query().foreignKey('OrderID').from('Order_Details').requiresCount(), () => {
                            return [10248];
                        }));

                    dataManager.then((e: { result: Object[] }) => {
                        result = e.result;
                        done();
                    }).catch((error) => {
                        console.error(error);
                        done();
                    });
                });

                it('To check the result length of data.', () => {
                    expect(result.length).toBe(3);
                    expect(result[0]['Order_Details'].length).toBe(1);
                });

                // No need for an afterAll() block when using Fetch API instead of Jasmine AJAX
            });

            describe('without url in dataManager', () => {
                let result: Object[];
                beforeAll((done: Function) => {
                    let dataManager: Promise<Object> = new DataManager()
                        .executeQuery(new Query().requiresCount());
                    dataManager.then((e: { result: Object[] }) => {
                        result = e.result;
                        done();
                    });
                });
                it('To check the result length of data.', () => {
                    expect(result.length).toBe(0);
                });
            });
            describe('invalid url in dataManager', () => {
                let result: any;

                beforeAll((done: Function) => {
                    // Mock the Fetch API response for the invalid URL
                    let mAjax: MockAjaxReturn = mockAjax({
                        d: []
                    }, new Query(), {
                        status: 500,
                        statusText: 'Bad Request'
                    });
                    mAjax.promise.then(
                        (e: { result: Object[] }) => {
                            result = e.result;
                            done();
                        },
                        (e: Object[]) => {
                            result = e;
                            done();
                        });
                });

                it('To check the result length of data.', () => {
                    expect(result.error.statusText).toEqual('Bad Request');
                });

                // No need for an afterAll() block when using Fetch API instead of Jasmine AJAX
            });

            describe('with hierarchy and without child selector', () => {
                let result: Object[];
                beforeAll((done: Function) => {
                     // Mock the Fetch API response for the first AJAX request
                     spyOn(window, 'fetch').and.returnValues(
                        Promise.resolve(new Response(JSON.stringify({
                            d: [{ OrderID: 10248, CustomerID: 'VINET', EmployeeID: 5, Freight: 32.38 },
                            { OrderID: 10249, CustomerID: 'AANAR', EmployeeID: 2, Freight: 11.61 },
                            { OrderID: 10250, CustomerID: 'VICTE', EmployeeID: 7, Freight: 65.83 }], __count: 3
                        }), { status: 200, headers: { 'Content-Type': 'application/json' } })),
                        Promise.resolve(new Response(JSON.stringify({
                            d: [{ OrderID: 10248, CustomerID: 'VINET', EmployeeID: 5, Freight: 32.38 },
                            { OrderID: 10249, CustomerID: 'AANAR', EmployeeID: 2, Freight: 11.61 },
                            { OrderID: 10250, CustomerID: 'VICTE', EmployeeID: 7, Freight: 65.83 }], __count: 3
                        }), { status: 200, headers: { 'Content-Type': 'application/json' } }))
                    );
                  let dataManager: Promise<Object> = new DataManager({
                    url: '/api/',
                  }).executeQuery(
                    new Query().from('Orders').hierarchy(new Query().foreignKey('OrderID').from('Order_Details'), () => '')
                  );

                    dataManager.then((e: { result: Object[] }) => {
                        result = e.result;
                        done();
                    }).catch((error) => {
                        console.error(error);
                        done();
                    });
                });
                it('url check', () => {
                  expect(fetch['calls'].mostRecent().args[0].url.replace(/^https?:\/\/[^/]+/, '')).toBe('/api/Order_Details?$filter=(OrderID%20eq%2010248)%20or%20(OrderID%20eq%2010249)%20or%20(OrderID%20eq%2010250)');
                });

                it('data check', () => {
                  // Perform assertions on the result data obtained from the Fetch requests
                  let firstdetails = result[0]["Order_Details"];
                  expect(firstdetails.length).toBe(1);
                  expect(firstdetails[0]["OrderID"]).toBe(10248);
                });
              });


            // describe('with hierarchy and without date parse options', () => {
            //     let result: Object[];
            //     beforeAll((done: Function) => {
            //         let dm: DataManager = new DataManager({
            //             url: 'temp/url',
            //             headers: [{ 'Content-Type': 'text/html' }]
            //         });
            //         dm.dateParse = false;
            //         let data1 = new DataManager(data).executeLocal(new Query().take(3).select(['OrderID', 'CustomerID', 'EmployeeID']));
            //         let mAjax: MockAjaxReturn = mockAjax({
            //             data: data1,
            //             dm: dm
            //         }, new Query().from('Orders').take(3))

            //         mAjax.promise.then((e: { result: Object[] }) => {
            //             result = e.result;
            //             done();
            //         });
            //     });
            //     it('To check the result length of data.', () => {
            //         expect(result.length).toBe(3);
            //     });
            //     afterAll(() => {
            //         window.fetch = originalFetch;
            //     });
            // });
            describe('adding dynamic headers', () => {
                let result: Object[];
                beforeAll((done: Function) => {
                    let data1 = new DataManager(data).executeLocal(new Query().take(5).select(['OrderID', 'CustomerID', 'EmployeeID']));
                    let mAjax: MockAjaxReturn = mockAjax({
                        data: data1,
                        dm: new DataManager({
                            url: 'temp/url',
                            headers: [{ 'Content-Type': 'text/html' }]
                        })
                    }, new Query().select(['OrderID', 'CustomerID', 'EmployeeID']).take(5))

                    mAjax.promise.then((e: { result: Object[] }) => {
                        result = e.result;
                        done();
                    });
                });
                it('To check the result length of data.', () => {
                    expect(result.length).toBe(5);
                });
                afterAll(() => {
                    window.fetch = originalFetch;
                });
            });
        });
    });
    describe('Remote data', () => {
        let result: Object[];
        let dataManager: DataManager;
        describe('Remote data is generated properly', () => {
            beforeAll((done: Function) => {
                let data1 = new DataManager(data).executeLocal(new Query().take(5).select(['OrderID', 'CustomerID', 'EmployeeID']));
                dataManager = new DataManager({
                    url: 'api/Orders'
                })
                let mAjax: MockAjaxReturn = mockAjax({
                    data: data1,
                    dm: dataManager
                }, new Query().select(['OrderID', 'CustomerID', 'EmployeeID']).take(5))

                mAjax.promise.then((e: { result: Object[] }) => {
                    result = e.result;
                    done();
                });
            });
            it('To check length of generated data.', () => {
                expect(result.length).toBe(5);
            });
            it('To check the dataType.', () => {
                expect(dataManager.dataSource.dataType).toEqual('json');
            });
            it('To check offline mode.', () => {
                expect(dataManager.dataSource.offline).toEqual(false);
            });
            afterAll(() => {
                window.fetch = originalFetch;
            });
        });
        describe('Remote url in constructor', () => {
            it('To check error throws when invalid arguments.', () => {
                expect(() => { new DataManager('http://mvc.syncfusion.com/Services/Northwnd.svc/Orders/' as DataOptions); }).toThrow();
            });
        });
        describe('RemoteSaveAdaptor with offline', () => {
            beforeAll((done: Function) => {
                dataManager = new DataManager({
                    json: [{ OrderID: 10248, CustomerID: 'VINET', ShipName: 'SURINDER' }],
                    adaptor: new RemoteSaveAdaptor
                });
                let promise: Promise<Object> = dataManager.executeQuery(new Query().select(['OrderID', 'CustomerID', 'ShipName']).take(5));
                promise.then((e: { result: Object[] }) => {
                    result = e.result;
                    done();
                });
            });
            describe('Remote data is generated properly', () => {
                it('To check length of generated data.', () => {
                    expect(result.length).toBe(1);
                });
                it('To check the dataType.', () => {
                    expect(dataManager.dataSource.dataType).toEqual('json');
                });
                it('To check offline mode.', () => {
                    expect(dataManager.dataSource.offline).toEqual(false);
                });
            });
        });
        describe('Remote data with offline', () => {
            let resquest: JasmineAjaxRequest;
            beforeAll((done: Function) => {
                const fetchSpy = spyOn(window, 'fetch').and.returnValue(Promise.resolve({
                    ok: true,
                    status: 200,
                    headers: new Headers({
                        'Content-Type': 'application/json'
                    }),
                    json: function () {
                        return Promise.resolve({ d: employeesData, __count: 9 });
                    }
                }));
                dataManager = new DataManager({
                    url: 'service/Employees/',
                    offline: true
                });
                (dataManager.ready as Promise<Object>).then((e: { result: Object[] }) => {
                    result = e.result;
                    done();
                });
            });
            describe('Remote data is generated properly', () => {
                it('To check length of generated data.', () => {
                    expect(result.length).toEqual(9);
                });
            });
            afterAll(() => {
                window.fetch = originalFetch;
            });
        });
        describe('EnableCaching options', () => {
            let resquest: JasmineAjaxRequest;
            beforeAll((done: Function) => {
                const fetchSpy = spyOn(window, 'fetch').and.returnValue(Promise.resolve({
                    ok: true,
                    status: 200,
                    headers: new Headers({
                        'Content-Type': 'application/json'
                    }),
                    json: function () {
                        return Promise.resolve({ d: employeesData, __count: 9 });
                    }
                }));
                dataManager = new DataManager({
                    url: 'service/Employees/',
                    enableCaching: true,
                    cachingPageSize: 10,
                    timeTillExpiration: 120000
                });
                let promise: Promise<Object> = dataManager.executeQuery(new Query().select(['EmployeeID', 'LastName', 'FirstName']));
                promise.then((e: { result: Object[] }) => {
                    result = e.result;
                    done();
                });
            });
            describe('Remote data is generated properly', () => {
                it('To check length of generated data.', () => {
                    expect(result.length).toEqual(9);
                });
            });
        });
        describe('RemoteSaveAdaptor with offline', () => {
            beforeAll((done: Function) => {
                dataManager = new DataManager({
                    json: [{ OrderID: 10248, CustomerID: 'VINET', ShipName: 'SURINDER' }],
                    adaptor: new RemoteSaveAdaptor,
                    offline: true
                });
                let promise: Promise<Object> = dataManager.executeQuery(new Query().select(['OrderID', 'CustomerID', 'ShipName']));
                promise.then((e: { result: Object[] }) => {
                    result = e.result;
                    done();
                });
            });
            describe('Remote data is generated properly', () => {
                it('To check length of generated data.', () => {
                    expect(result.length).toBe(1);
                });
                it('To check offline mode.', () => {
                    expect(dataManager.dataSource.offline).toEqual(true);
                });
            });
        });

        describe('persistence support in datamanager', () => {
            let promise: Promise<Object>;
            let dataManagernew: DataManager;
            beforeAll((done: Function) => {
                dataManagernew = new DataManager({
                    url: '/api/Employees',
                    adaptor: new ODataV4Adaptor,
                    enablePersistence: true,
                    id: 'DMNew',
                });
                promise = dataManagernew.executeQuery(new Query().sortBy("EmployeeID", "descending").take(8));
                promise.then((e: { result: Object[] }) => {
                    result = e.result;
                    done();
                });
            });
            it('trigger unload event to mimic browser page load action', (done: Function) => {
                window.dispatchEvent(new Event('unload'));
                dataManagernew = new DataManager({
                    url: '/api/Employees',
                    adaptor: new ODataV4Adaptor,
                    enablePersistence: true,
                    id: 'DMNew',
                });
                promise = dataManagernew.executeQuery(new Query().sortBy("EmployeeID", "ascending"));
                promise.then((e: { result: Object[] }) => {
                    result = e.result;
                    done();
                });
            });
            it('checking ascending sorted result in persistence enabled data manager', () => {
                expect((result[0] as any).EmployeeID === 10001).toBe(false);
            });

            afterAll(() => {
                dataManagernew.clearPersistence();
            });
        });

        describe('persistence support in datamanager - persitence with Filter query', () => {
            let dataManagernew: DataManager;
            beforeAll((done: Function) => {
                dataManagernew = new DataManager({
                    json: data,
                    adaptor: new JsonAdaptor(),
                    enablePersistence: true,
                    id: 'DMNew',
                });
                let predicate: Predicate = new Predicate('OrderID', 'equal', 10248);
                predicate = predicate.or('OrderID', 'equal', 10249);
                result = dataManagernew.executeLocal(new Query().where(predicate));
                done();
            });
            it('trigger unload event to mimic browser page load action', () => {
                window.dispatchEvent(new Event('unload'));
                dataManagernew = new DataManager({
                    json: data,
                    adaptor: new JsonAdaptor(),
                    enablePersistence: true,
                    id: 'DMNew',
                });
                result = dataManagernew.executeLocal(new Query().take(4));

            });
            it('checking Filtered result in persistence enabled data manager', () => {
                expect(result.length).toBe(2);
                expect((result[0] as any).OrderID).toBe(10248);
                expect((result[1] as any).OrderID).toBe(10249);
            });

            afterAll(() => {
                dataManagernew.clearPersistence();
            });
        });

        describe('persistence support in datamanager - ignoreOnPersist', () => {
            let dataManagernew: DataManager;
            beforeAll((done: Function) => {
                dataManagernew = new DataManager({
                    json: data,
                    adaptor: new JsonAdaptor(),
                    enablePersistence: true,
                    id: 'DMNew',
                    ignoreOnPersist: ['onSelect']
                });
                let query: Query = new Query().select(['OrderID', 'CustomerID']).take(3);
                result = dataManagernew.executeLocal(query);
                done();
            });
            it('trigger unload event to mimic browser page load action', () => {
                window.dispatchEvent(new Event('unload'));
                dataManagernew = new DataManager({
                    json: data,
                    adaptor: new JsonAdaptor(),
                    enablePersistence: true,
                    id: 'DMNew',
                    ignoreOnPersist: ['onSelect']

                });
                result = dataManagernew.executeLocal(new Query().take(5));
            });
            it('checking result in ignoreonPersist as "onSelect" enabled data manager', () => {
                expect(Object.keys(result[0]).length === 2).toBeFalsy;
            });

            afterAll(() => {
                dataManagernew.clearPersistence();
            });
        });

        describe('837642 - persistence in dataManager with complex filter query', () => {
            let result: Object[];
            let dataManager: DataManager;
            let dataNew: JSON[] = [];
            beforeAll((done: Function) => {
                dataNew = ([
                    { OrderID: 10248, CustomerID: 'VINET', EmployeeID: 5, Freight: 32.38 },
                    { OrderID: 10249, CustomerID: 'AANAR', EmployeeID: 2, Freight: 11.61 },
                    { OrderID: 10250, CustomerID: 'VICTE', EmployeeID: 7, Freight: 65.83 },
                    { OrderID: 10251, CustomerID: 'TOMSP', EmployeeID: 6, Freight: 70.63 },
                    { OrderID: 10252, CustomerID: 'SUPRD', EmployeeID: 7, Freight: 45.45 }
                ] as Object) as JSON[];

                let predicateArray1: Predicate[] = [];
                let predicateArray3: Predicate[] = [];

                predicateArray1.push(new Predicate("CustomerID", "equal", "VINET"));
                predicateArray1.push(new Predicate("CustomerID", "equal", "TOMSP"));
                predicateArray1.push(new Predicate("CustomerID", "equal", "HANAR"));
                predicateArray1.push(new Predicate("CustomerID", "equal", "VICTE"));
                predicateArray1.push(new Predicate("CustomerID", "equal", "SUPRD"));
                let predicate1: Predicate = Predicate.or(predicateArray1);

                let predicate2: Predicate = new Predicate("OrderID", "notequal", 10252);

                predicateArray3.push(new Predicate("EmployeeID", "equal", 5));
                predicateArray3.push(new Predicate("EmployeeID", "equal", 6));
                let predicate3: Predicate = Predicate.or(predicateArray3);

                let predicate: Predicate = Predicate.and([predicate1, predicate2, predicate3]);
                let query: Query = new Query().where(predicate);
                dataManager = new DataManager({
                    json: dataNew,
                    adaptor: new JsonAdaptor(),
                    enablePersistence: true,
                    id: 'DMNew',
                    ignoreOnPersist: ['onSelect']
                });
                result = dataManager.executeLocal(query);
                done();
            });
            it('To check the result length of data.', () => {
                expect(result.length).toBe(2);
                window.dispatchEvent(new Event('unload'));
                dataManager = new DataManager({
                    json: dataNew,
                    adaptor: new JsonAdaptor(),
                    enablePersistence: true,
                    id: 'DMNew',
                });
                result = dataManager.executeLocal(new Query());
                expect(result.length).toBe(2);
            });

            afterAll(() => {
                (dataManager as any).clearPersistence();
            });
        });
    });

});